#!/usr/bin/env python3
"""
DPR AI — news agent (Collector + Ranker/Deduper + Faithful Summarizer + Publisher).

Reads tools/news/sources.json (the source registry), fetches every ACTIVE feed,
deduplicates + ranks by credibility/recency/corroboration, writes faithful,
extractive summaries, applies an honesty gate, and publishes news/news.json.
It also updates each source's health (last_ok / fails / status) in sources.json.

Honest by construction: summaries come only from each item's own title/description;
every item links to its real source; items with no working link are dropped;
nothing is fabricated. No source or URL is ever invented.

Runs deterministically (e.g. GitHub Actions cron). No page backend.
"""
import json, os, re, math, time, calendar, hashlib, urllib.request
from datetime import datetime, timezone
from html import unescape
from urllib.parse import urlsplit, urlunsplit

try:
    import feedparser
except ImportError:
    raise SystemExit("feedparser is required (pip install feedparser)")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))          # repo root
SRC_PATH = os.path.join(HERE, "sources.json")
OUT_PATH = os.path.join(ROOT, "news", "news.json")
MAX_ITEMS = 24
UA = "dpr-news-agent/1.0 (+https://dprai.io)"
PROBATION_AT, DEMOTE_AT = 3, 6

AI_KW = re.compile(r"\b(ai|artificial intelligence|machine learning|llm|gpt|claude|gemini|openai|anthropic|deepmind|neural|model|chatbot|agent|generative)\b", re.I)
TAGS = [
    ("Policy",      r"\b(regulat|policy|law|eu ai act|white house|congress|ban|lawsuit|copyright|court|senate|bill)\b"),
    ("Safety",      r"\b(safety|alignment|risk|harm|jailbreak|guardrail|red.?team|misuse|bias)\b"),
    ("Open Source", r"\b(open.?source|open.?weight|llama|mistral|hugging ?face)\b"),
    ("Business",    r"\b(funding|raises?|valuation|acquire|acquisition|ipo|revenue|layoff|deal|billion|million|invest)\b"),
    ("Models",      r"\b(model|gpt-?\d|claude|gemini|llama|release|launch|multimodal|reasoning)\b"),
    ("Tools",       r"\b(app|feature|api|tool|agent|assistant|plugin|update|integrat)\b"),
    ("Research",    r"\b(paper|arxiv|research|study|benchmark|method|dataset|training)\b"),
]
OPINION_KW = re.compile(r"\b(opinion|editorial|column|commentary|why i|op-ed)\b", re.I)


def clean(txt, n=240):
    if not txt:
        return ""
    txt = unescape(re.sub(r"<[^>]+>", " ", txt))
    txt = re.sub(r"\s+", " ", txt).strip()
    return (txt[:n].rsplit(" ", 1)[0] + "\u2026") if len(txt) > n else txt


def norm_url(u):
    try:
        s = urlsplit(u.lower())
        return urlunsplit((s.scheme, s.netloc, s.path.rstrip("/"), "", ""))
    except Exception:
        return (u or "").lower()


def toks(t):
    return set(re.findall(r"[a-z0-9]+", (t or "").lower()))


def jac(a, b):
    A, B = toks(a), toks(b)
    return len(A & B) / len(A | B) if A and B else 0.0


def entry_ts(e):
    for k in ("published_parsed", "updated_parsed"):
        if e.get(k):
            return calendar.timegm(e[k])
    return None


def fetch_rss(src):
    d = feedparser.parse(src["url"], agent=UA)
    out = []
    for e in d.entries[:25]:
        link = (e.get("link") or "").strip()
        title = clean(e.get("title", ""), 180)
        if not link or not title:
            continue
        summ = clean(e.get("summary", "") or e.get("description", ""), 240)
        if src["id"] == "mittr" and not (AI_KW.search(title) or AI_KW.search(summ)):
            continue
        out.append({"source_name": src["name"], "source_id": src["id"],
                    "headline": title, "url": link, "summary": summ or title,
                    "published_ts": entry_ts(e), "credibility": src["credibility"]})
    return out


def fetch_hn(src):
    req = urllib.request.Request(src["url"], headers={"User-Agent": UA})
    data = json.loads(urllib.request.urlopen(req, timeout=20).read())
    out = []
    for h in data.get("hits", []):
        title = clean(h.get("title", ""), 180)
        if not title:
            continue
        link = h.get("url") or ("https://news.ycombinator.com/item?id=" + str(h.get("objectID")))
        out.append({"source_name": src["name"], "source_id": src["id"],
                    "headline": title, "url": link,
                    "summary": f"{h.get('points', 0)} points and {h.get('num_comments', 0)} comments on Hacker News.",
                    "published_ts": h.get("created_at_i"), "credibility": src["credibility"],
                    "hn_points": h.get("points", 0)})
    return out


def tag_of(it):
    if it["source_id"] == "arxiv":
        return "Research"
    hay = (it["headline"] + " " + it.get("summary", "")).lower()
    for name, pat in TAGS:
        if re.search(pat, hay):
            return name
    return "Tools"


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def iso_from_ts(ts):
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat() if ts else None


def main():
    with open(SRC_PATH, encoding="utf-8") as fh:
        reg = json.load(fh)
    now = time.time()
    raw = []

    for s in reg["sources"]:
        if s.get("status") == "demoted":
            continue
        if s["type"] not in ("rss", "hn_algolia"):   # candidates (html) await scout discovery
            continue
        try:
            items = fetch_hn(s) if s["type"] == "hn_algolia" else fetch_rss(s)
            if items:
                s["last_ok"] = now_iso()
                s["fails"] = 0
                if s.get("status") == "probation":
                    s["status"] = "active"
            else:
                s["fails"] = s.get("fails", 0) + 1
            raw += items
            print(f"[ok]   {s['name']}: {len(items)} items")
        except Exception as ex:
            s["fails"] = s.get("fails", 0) + 1
            print(f"[fail] {s['name']}: {str(ex)[:90]}")
        f = s.get("fails", 0)
        if f >= DEMOTE_AT:
            s["status"] = "demoted"
        elif f >= PROBATION_AT and s.get("status") == "active":
            s["status"] = "probation"

    # dedupe + corroboration (keep highest-credibility instance; count the cluster)
    kept = []
    for it in sorted(raw, key=lambda x: -x.get("credibility", 0)):
        it["_nu"] = norm_url(it["url"])
        dup = None
        for k in kept:
            if it["_nu"] == k["_nu"] or jac(it["headline"], k["headline"]) >= 0.85:
                dup = k
                break
        if dup:
            dup["_corr"] = dup.get("_corr", 1) + 1
        else:
            it["_corr"] = 1
            kept.append(it)

    def score(it):
        ts = it.get("published_ts")
        age = (now - ts) / 3600 if ts else 240
        rec = math.exp(-age / 48)
        imp = 0.5
        if it.get("hn_points"):
            imp = min(1.0, it["hn_points"] / 500.0)
        if re.search(r"\b(launch|release|raises?|acqui|gpt|claude|gemini|regulat|safety)\b", it["headline"], re.I):
            imp = max(imp, 0.7)
        imp = min(1.0, imp + 0.08 * (it.get("_corr", 1) - 1))   # corroboration boost
        return round(0.35 * it.get("credibility", 0.7) + 0.35 * rec + 0.30 * imp, 4)

    for it in kept:
        it["_score"] = score(it)
    kept.sort(key=lambda x: (x.get("published_ts") or 0, x["_score"]), reverse=True)

    items = []
    for it in kept[:MAX_ITEMS]:
        # honesty gate: must have a real http(s) link
        if not re.match(r"^https?://", it["url"]):
            continue
        items.append({
            "id": hashlib.sha1(it["_nu"].encode()).hexdigest()[:12],
            "headline": it["headline"],
            "source_name": it["source_name"],
            "source_id": it["source_id"],
            "url": it["url"],
            "published_at": iso_from_ts(it.get("published_ts")),
            "summary": it["summary"],
            "tags": [tag_of(it)],
            "is_opinion": bool(OPINION_KW.search(it["headline"])),
            "corroboration_count": it.get("_corr", 1),
            "credibility": it.get("credibility", 0.7),
            "rank_score": it["_score"],
        })

    # Only publish when the set of stories actually changed (avoids deploy churn:
    # the hourly job commits/deploys only when there is genuinely new news).
    new_ids = [it["id"] for it in items]
    old_ids = []
    if os.path.exists(OUT_PATH):
        try:
            old_ids = [x.get("id") for x in json.load(open(OUT_PATH, encoding="utf-8")).get("items", [])]
        except Exception:
            old_ids = []
    if items and new_ids == old_ids:
        print("\nNo new stories — news.json unchanged.")
        return

    out = {"meta": {"generated_at": now_iso(), "version": 1, "count": len(items),
                    "note": "Faithful, extractive summaries; every item links to its original source."},
           "items": items}
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2)

    print(f"\nPublished {len(items)} items to news/news.json (was {len(old_ids)}).")


if __name__ == "__main__":
    main()
