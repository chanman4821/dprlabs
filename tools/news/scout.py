#!/usr/bin/env python3
"""
DPR AI — Source Scout (dynamic source discovery).

For each source registered as a 'candidate' with type 'html', fetch its page and
auto-discover a real RSS/Atom feed via its <link rel="alternate"> tag. If a feed
is found AND validated as reachable with entries, promote the candidate to an
active 'rss' source with recorded evidence.

Guardrail: only ever adds a REAL, reachable feed. Never invents a source or URL.
This is the discovery half of Jarvis's design; the deterministic collector
(agent.py) then fetches whatever the registry marks 'active'.
"""
import json, os, re, urllib.request
from datetime import datetime, timezone
from urllib.parse import urljoin

try:
    import feedparser
except ImportError:
    raise SystemExit("feedparser is required (pip install feedparser)")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_PATH = os.path.join(HERE, "sources.json")
UA = "dpr-news-scout/1.0 (+https://dprai.io)"

FEED_LINK = re.compile(
    r'<link[^>]+rel=["\']alternate["\'][^>]+type=["\']application/(?:rss|atom)\+xml["\'][^>]*>'
    r'|<link[^>]+type=["\']application/(?:rss|atom)\+xml["\'][^>]+rel=["\']alternate["\'][^>]*>', re.I)
HREF = re.compile(r'href=["\']([^"\']+)["\']', re.I)


def discover(page_url):
    req = urllib.request.Request(page_url, headers={"User-Agent": UA})
    html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "replace")
    for tag in FEED_LINK.findall(html):
        m = HREF.search(tag)
        if not m:
            continue
        href = m.group(1)
        if href.startswith("//"):
            href = "https:" + href
        elif href.startswith("/"):
            href = urljoin(page_url, href)
        return href
    return None


def reachable(feed_url):
    d = feedparser.parse(feed_url, agent=UA)
    return len(d.entries) > 0


def main():
    with open(SRC_PATH, encoding="utf-8") as fh:
        reg = json.load(fh)
    promoted = 0
    for s in reg["sources"]:
        if s.get("status") != "candidate" or s.get("type") != "html":
            continue
        try:
            feed = discover(s["url"])
            if feed and reachable(feed):
                s["url"] = feed
                s["type"] = "rss"
                s["status"] = "active"
                s["last_ok"] = datetime.now(timezone.utc).isoformat()
                s["added_by"] = "source_scout"
                s.setdefault("evidence", []).append("Feed auto-discovered by scout: " + feed)
                promoted += 1
                print(f"[promoted] {s['name']} -> {feed}")
            else:
                print(f"[no feed]  {s['name']} ({s['url']})")
        except Exception as ex:
            print(f"[err]      {s['name']}: {str(ex)[:90]}")

    if promoted:
        reg["updated_at"] = datetime.now(timezone.utc).isoformat()
        with open(SRC_PATH, "w", encoding="utf-8") as fh:
            json.dump(reg, fh, ensure_ascii=False, indent=2)
    print(f"scout: {promoted} source(s) promoted")


if __name__ == "__main__":
    main()
