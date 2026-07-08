# DPR AI — News Agent

Keeps the `/news/` page fresh with credible AI news, automatically. Honest by
construction: faithful, extractive summaries; every item links to its real
source; nothing is fabricated; no source or URL is ever invented.

## How it works

```
sources.json  →  scout.py (discover feeds)  →  agent.py (collect → dedupe →
                 rank → summarize → honesty gate → write news/news.json)  →
                 GitHub Actions commits + pushes  →  auto-deploys to dprai.io
```

- **`sources.json`** — the credible source registry (url, type, credibility,
  status, tier, health). Only real, reachable feeds. Never edited to invent a source.
- **`agent.py`** — Collector + Ranker/Deduper + faithful Summarizer + Publisher.
  Fetches every `active` feed, dedupes (URL + title similarity, with
  corroboration counts), ranks by credibility × recency × corroboration, writes
  extractive summaries, and publishes `news/news.json` — but only when the set of
  stories actually changed (so it deploys on real updates only).
- **`scout.py`** — Source Scout. Auto-discovers a real RSS/Atom feed for any
  `candidate` source (via its `<link rel="alternate">` tag), validates it's
  reachable, and promotes it to `active` with evidence.
- **`.github/workflows/news.yml`** — runs hourly (and on demand), then commits +
  pushes if there's new news. No page backend — the site just reads the committed
  JSON.

## Run locally

```bash
pip install -r tools/news/requirements.txt
python tools/news/scout.py     # optional: discover new feeds
python tools/news/agent.py     # refresh news/news.json
```

## Design

Architected with Jarvis (`dpr_news_multiagent`): a cooperating set of agents —
Source Scout, Credibility & Quality Scorer, Collector, Ranker/Deduper, Faithful
Summarizer, Publisher. The deterministic pipeline (collect/rank/summarize/publish)
runs in GitHub Actions; the smarter Scout/Scorer can be driven by the Jarvis mesh.
