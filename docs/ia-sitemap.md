# DPR AI — Information Architecture Sitemap
## Phase 2 Redesign · July 2026

**Evidence basis:** `docs/site-audit.csv` (66 rows: 55 keep + 6 merge + 5 cut), `index.html`
primary nav (live), `vercel.json` (existing redirects confirmed).  
**Validation status:** UNTESTED HYPOTHESIS — groupings and labels are heuristic-provisional,
derived from audit metadata and content roles. Recommend a tree test on ≥10 tasks with
15–30 participants before shipping nav changes to production.  
**Constraint check:** Max depth ≤3 clicks from any page via primary nav OR footer (footer
is present on every page, making footer links effectively 1 click from anywhere).

---

## 1. GLOBAL NAV

### 1a. Top Nav — 6 items + 1 CTA

```
[DPR AI] → /
│
├── How it works                  → /method
│
├── Proof ▾
│   ├── Results                   → /proof
│   ├── Case studies              → /case-studies
│   └── Teardowns                 → /teardowns
│
├── Pricing                       → /pricing
│
├── Tools ▾
│   ├── Score my AI               → /score/
│   ├── Free AI agent             → /free/
│   ├── Cost estimator            → /cost/
│   ├── Cost of inaction          → /cost-of-inaction
│   └── Build vs buy?             → /build-buy-rent
│
├── Resources ▾
│   ├── Field Notes               → /blog/
│   ├── Knowledge Base            → /kb/
│   ├── Playbook                  → /playbook
│   ├── AI Guide                  → /guide/
│   ├── Practice AI               → /learn/
│   └── Training                  → /train/
│
├── About ▾
│   ├── Studio                    → /about
│   ├── Why we exist              → /slop
│   ├── You own it                → /own-it
│   └── Investors                 → /investors
│
└── [CTA] Start a build           → /contact
```

**Depth metrics:**
- Max depth from nav: 3 clicks (nav → section index → individual article or doc)
- Top-task depth: 1–2 clicks (method, pricing, proof, score, contact)
- Sibling counts per dropdown: Proof 3 · Tools 5 · Resources 6 · About 4
- Total top-level nav items: 6 (within constraint)

**Label rationale (all provisional — untested with users):**

| Label | Rationale | Synonym to test |
|-------|-----------|-----------------|
| Proof | Active word; matches how buyers discuss AI ROI; surfaces the evidence cluster that has zero nav presence today | Results, Evidence |
| Tools | Covers interactive calculators + decision aids without implying all are free | Free tools, Calculators |
| Resources | Business-buyer register; avoids "Learn" which reads as student-facing | Learn, Library |
| About (with dropdown) | Brings conviction pages (slop, own-it) into a discoverable location for buyers who need the philosophy | — |
| Why we exist | Plain label for slop.html (the anti-slop manifesto) | The anti-slop stance, Manifesto |
| You own it | Plain label for own-it.html (ownership pillar) | No lock-in, Own your AI |
| Teardowns | Editorial label for the AI autopsy/diagnostic page; matches page title | Diagnostics, Autopsies |

---

### 1b. Footer Nav

```
Studio                Tools                  Resources              Company
────────────────────  ─────────────────────  ─────────────────────  ──────────────────────
How it works /method  Score my AI /score/    Field Notes /blog/     About /about
Pricing /pricing      Free AI agent /free/   Knowledge Base /kb/    Why we exist /slop
Results /proof        Cost estimator /cost/  Playbook /playbook     You own it /own-it
Case studies          Cost of inaction       AI Guide /guide/       Investors /investors
  /case-studies         /cost-of-inaction    Practice AI /learn/    Invest in DPR /dataroom
Teardowns /teardowns  Build vs buy?          Training /train/       Data Room /dataroom/
                        /build-buy-rent      News /news/            One-pager /onepager-dpr
                                             Glossary /glossary/    Contact /contact
```

**Footer-only pages:** `/news/`, `/glossary/`, `/dataroom`, `/dataroom/`, `/onepager-dpr`
and the 7 individual dataroom docs are not in the primary nav dropdown but are reachable
in ≤2 clicks from the footer (which is present on every page).

---

### 1c. Full Page Map — All 66 CSV Rows Assigned to Exactly One Owner Section

Every page from the audit is placed below. Primary home = nav section or footer column
that owns it. Cross-links from other pages are permitted and expected.

#### Homepage (1 page)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| / | index.html | keep | Brand/logo link |

#### Nav Item 1 — How it works (1 page)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /method | method.html | keep | Nav item 1 (direct) |

#### Nav Item 2 — Proof (3 pages)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /proof | proof.html | keep | Proof dropdown |
| /case-studies | case-studies.html | keep | Proof dropdown |
| /teardowns | teardowns.html | keep | Proof dropdown |

#### Nav Item 3 — Pricing (1 page)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /pricing | pricing.html | keep | Nav item 3 (direct) |

#### Nav Item 4 — Tools (5 pages)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /score/ | score/index.html | keep | Tools dropdown |
| /free/ | free/index.html | keep | Tools dropdown |
| /cost/ | cost/index.html | keep | Tools dropdown |
| /cost-of-inaction | cost-of-inaction.html | keep | Tools dropdown |
| /build-buy-rent | build-buy-rent.html | keep | Tools dropdown |

#### Nav Item 5 — Resources (27 pages)

**5a — Field Notes (blog)**
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /blog/ | blog/index.html | keep | Resources dropdown |
| /blog/how-to-use-claude-effectively | blog/how-to-use-claude-effectively.html | keep | via /blog/ |
| /blog/measure-ai-honestly | blog/measure-ai-honestly.html | keep | via /blog/ |
| /blog/no-lock-in | blog/no-lock-in.html | keep | via /blog/ |
| /blog/own-vs-rent-ai | blog/own-vs-rent-ai.html | keep | via /blog/ |
| /blog/the-one-number | blog/the-one-number.html | keep | via /blog/ |
| /blog/what-investors-want | blog/what-investors-want.html | keep | via /blog/ |
| /blog/why-ai-projects-die | blog/why-ai-projects-die.html | keep | via /blog/ |

**5b — Knowledge Base**
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /kb/ | kb/index.html | keep | Resources dropdown |
| /kb/ai-for-small-business | kb/ai-for-small-business.html | keep | via /kb/ |
| /kb/ai-governance-and-compliance | kb/ai-governance-and-compliance.html | keep | via /kb/ |
| /kb/ai-governance-framework | kb/ai-governance-framework.html | keep | via /kb/ |
| /kb/flat-subscription-dealflow-explained | kb/flat-subscription-dealflow-explained.html | keep | via /kb/ |
| /kb/how-to-measure-ai-roi | kb/how-to-measure-ai-roi.html | keep | via /kb/ |
| /kb/how-to-write-ai-use-policy | kb/how-to-write-ai-use-policy.html | keep | via /kb/ |
| /kb/is-your-ai-feature-good-enough | kb/is-your-ai-feature-good-enough.html | keep | via /kb/ |
| /kb/what-custom-ai-automation-costs | kb/what-custom-ai-automation-costs.html | keep | via /kb/ |
| /kb/what-you-own-means | kb/what-you-own-means.html | keep | via /kb/ |

**5c — Other Resources**
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /playbook | playbook.html | keep | Resources dropdown |
| /guide/ | guide/index.html | keep | Resources dropdown |
| /guide/what-ai-actually-is | guide/what-ai-actually-is.html | keep | via /guide/ |
| /guide/your-first-15-minutes | guide/your-first-15-minutes.html | keep | via /guide/ |
| /learn/ | learn/index.html | keep | Resources dropdown |
| /train/ | train/index.html | keep | Resources dropdown |
| /train/dashboard | train/dashboard.html | keep (thin) | via /train/ |
| /train/lesson | train/lesson.html | keep (placeholder shell) | via /train/ |
| /train/module | train/module.html | keep (placeholder shell) | via /train/ |

#### Nav Item 6 — About (4 pages)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /about | about.html | keep | About dropdown |
| /slop | slop.html | keep | About dropdown |
| /own-it | own-it.html | keep | About dropdown |
| /investors | investors.html | keep | About dropdown |

#### CTA (1 page)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /contact | contact.html | keep | Nav CTA button |

#### Footer-only — Resources secondary (2 pages)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /news/ | news/index.html | keep | Footer Resources column |
| /glossary/ | glossary/index.html | keep (thin) | Footer Resources column |

#### Footer-only — Investor path (10 pages)
| Clean URL | File | Audit status | Primary home |
|-----------|------|--------------|--------------|
| /dataroom | dataroom.html | keep | Footer Company column |
| /dataroom/ | dataroom/index.html | keep | Footer Company column |
| /dataroom/compliance | dataroom/compliance.html | keep | via /dataroom/ |
| /dataroom/deck-dpr | dataroom/deck-dpr.html | keep | via /dataroom/ |
| /dataroom/faq | dataroom/faq.html | keep | via /dataroom/ |
| /dataroom/market | dataroom/market.html | keep | via /dataroom/ |
| /dataroom/model-dpr | dataroom/model-dpr.html | keep | via /dataroom/ |
| /dataroom/summary-dpr | dataroom/summary-dpr.html | keep | via /dataroom/ |
| /dataroom/team | dataroom/team.html | keep (thin) | via /dataroom/ |
| /onepager-dpr | onepager-dpr.html | keep | Footer Company column |

#### Merges — 301 redirects, not placed in nav tree (6 pages)
| URL (both forms) | File | Redirect target |
|-----------------|------|-----------------|
| /pilot, /pilot.html | pilot.html | → /contact |
| /pilot-scoping-guide, /pilot-scoping-guide.html | pilot-scoping-guide.html | → /contact |
| /blog/two-week-pilot, /blog/two-week-pilot.html | blog/two-week-pilot.html | → /contact |
| /blog/buy-build-or-pilot, /blog/buy-build-or-pilot.html | blog/buy-build-or-pilot.html | → /contact |
| /dataroom/dpr-deck, /dataroom/dpr-deck/, /dataroom/dpr-deck/index.html | dataroom/dpr-deck/index.html | → /dataroom/deck-dpr |
| /what-investors-screen, /what-investors-screen.html | what-investors-screen.html | → /blog/what-investors-want |

#### Cut — already redirected to / in vercel.json (5 pages, not in tree)
| File | Status |
|------|--------|
| design/previews/agenticloops-light.html | cut · already → / in vercel.json |
| design/previews/blueprint.html | cut · already → / in vercel.json |
| design/previews/ink-violet-light.html | cut · already → / in vercel.json |
| design/previews/pine.html | cut · already → / in vercel.json |
| design/previews/vermillion.html | cut · already → / in vercel.json |

**Coverage check:** 1 + 1 + 3 + 1 + 5 + 27 + 4 + 1 + 2 + 10 = **55 kept** + 6 merge + 5 cut = **66 total** ✓

---

## 2. URL DECISION

**Decision: Clean URLs (/pricing, /method, /about) — adopt now.**

Add `"cleanUrls": true` (and `"trailingSlash": false`) to `vercel.json`. This is a Phase 2
redesign commit — the right moment to normalize canonical URL forms before the redirect
graph grows. Clean URLs remove `.html` friction from shared links, prevent Googlebot from
indexing duplicate content at both `/pricing` and `/pricing.html`, and match every modern
static-site convention. The operational cost is a one-time find-and-replace of all internal
`href="page.html"` references to `href="/page"` across 61 pages; it is not ongoing work.

**How Vercel handles it:** With `cleanUrls: true`, Vercel serves `pricing.html` at `/pricing`
AND issues an automatic 301 from `/pricing.html` → `/pricing` for any inbound link that uses
the old form. No indexed `.html` URL goes dead; all link equity is preserved automatically
by Vercel's routing layer. The explicit merge redirects in vercel.json (Section 3) take
priority over cleanUrls behavior, so merged pages route correctly to their destinations
without double-redirect chains — provided both the `.html` and clean-URL forms of each
merge source are listed as explicit rules.

**Concrete implementation steps (all in one commit):**
1. `vercel.json`: add `"cleanUrls": true` and `"trailingSlash": false`
2. `vercel.json`: add the 13 new explicit redirect rules from Section 3
3. All HTML files: update `href="page.html"` → `href="/page"` and
   `href="subdir/page.html"` → `href="/subdir/page"` (internal links)
4. All HTML files: update `<link rel="canonical" href="https://dprai.io/page.html" />`
   → `href="https://dprai.io/page"`
5. Verify: `vercel dev` locally, confirm no double-redirect on any merge target

> ⚠ **Atomicity:** cleanUrls config + all 13 redirect rules + internal link updates must
> ship in a single commit. Deploying cleanUrls before the explicit redirect rules creates
> a window where /pilot, /what-investors-screen, and /dataroom/dpr-deck serve live content
> at clean URLs rather than routing to their merge destinations.

---

## 3. REDIRECT MAP

All 301 (permanent). Add to `vercel.json` `"redirects"` array. Existing rules
(`/design/previews/:path*` → `/` and others already in vercel.json) are unchanged.

| # | old_url | new_url | type | reason |
|---|---------|---------|------|--------|
| 1 | /pilot | /contact | 301 | Placeholder stub; no content — merge per audit |
| 2 | /pilot.html | /contact | 301 | `.html` form — explicit override prevents cleanUrls from serving stale content |
| 3 | /pilot-scoping-guide | /contact | 301 | Placeholder stub — merge per audit |
| 4 | /pilot-scoping-guide.html | /contact | 301 | `.html` form |
| 5 | /blog/two-week-pilot | /contact | 301 | Redirect stub from retired pilot language — merge per audit |
| 6 | /blog/two-week-pilot.html | /contact | 301 | `.html` form |
| 7 | /blog/buy-build-or-pilot | /contact | 301 | Redirect stub — merge per audit |
| 8 | /blog/buy-build-or-pilot.html | /contact | 301 | `.html` form |
| 9 | /dataroom/dpr-deck | /dataroom/deck-dpr | 301 | Duplicate 10-slide angel deck → canonical 12-slide main deck |
| 10 | /dataroom/dpr-deck/ | /dataroom/deck-dpr | 301 | Trailing-slash form (directory index) |
| 11 | /dataroom/dpr-deck/index.html | /dataroom/deck-dpr | 301 | Explicit `.html` form |
| 12 | /what-investors-screen | /blog/what-investors-want | 301 | Overlaps stronger blog article — merge per audit |
| 13 | /what-investors-screen.html | /blog/what-investors-want | 301 | `.html` form |

**Total new redirect rules: 13**  
(4 merge targets × 2 URL forms = 8 · /dataroom/dpr-deck × 3 forms = 3 · /what-investors-screen × 2 = 2)

**Nav-implied URL moves:** None. The Phase 2 nav redesign changes which pages are linked
from the menu; it does not rename or relocate any page URL. All moves in this table are
sourced exclusively from the `keep_cut_merge` column of the site audit.

---

## 4. THREE JOURNEY MAPS

All URLs in clean-URL form. All pages are from the audit's `keep` set. Steps are ordered
as a realistic user path; branching exists in practice but is not shown here.

---

### Journey 1 — Business Buyer (skeptical ops or finance leader)

**Entry signal:** Organic search — "AI automation agency that actually delivers ROI"  
**Conversion:** Contact form submission at /contact → start a build

| Step | URL | Page title (from audit) | User action |
|------|-----|------------------------|-------------|
| 1 | / | Production AI your business actually owns. | Reads "one number, agreed up front." Clicks "See how it works." |
| 2 | /method | The Owned-AI Method | Reads 6-step process; notes measurement and ownership. Clicks "See the proof." |
| 3 | /proof | No borrowed logos. Numbers you can check. | Sees baselines and sample sizes with honest caveats. Clicks "Book a free teardown." |
| 4 | /teardowns | Most AI builds don't die in the model. | Reviews autopsy examples; requests diagnostic. |
| ✓ | /contact | Tell us one task your team dreads. | **Conversion: submits contact form.** |

---

### Journey 2 — Founder (building an AI product, wants capital)

**Entry signal:** SEO — "what investors look for in AI startups 2026"  
**Conversion:** Contact form submission at /contact → start a conversation about build + intros

| Step | URL | Page title (from audit) | User action |
|------|-----|------------------------|-------------|
| 1 | /blog/what-investors-want | What investors actually look for in an AI startup | Reads investor-screening criteria. Clicks brand link to explore DPR. |
| 2 | /investors | We do not sell introductions. | Reads about warm-intro service for founders; understands the no-fee model. |
| 3 | /method | The Owned-AI Method | Reads how the owned-AI build works; maps it to their product idea. |
| 4 | /pricing | Start small. Pay more only when it works. | Evaluates $3k–$15k build sprint cost against their runway. |
| ✓ | /contact | Tell us one task your team dreads. | **Conversion: reaches out to start a build and explore investor intros.** |

---

### Journey 3 — Investor (seed/angel, due diligence)

**Entry signal:** Direct link from DPR team → /investors  
**Conversion:** Books a call via /contact → request investor access

| Step | URL | Page title (from audit) | User action |
|------|-----|------------------------|-------------|
| 1 | /investors | We do not sell introductions. | Reads investment thesis framing; sees link to data room. |
| 2 | /dataroom | Invest in DPR AI. | Reviews public investor landing — business model summary and deck links. |
| 3 | /dataroom/deck-dpr | We build AI that works, and we know the investors. | Reviews the 12-slide main investor deck. |
| 4 | /dataroom/faq | FAQ & risk factors — the hard questions, answered | Reads risk factors before deciding to go deeper. |
| ✓ | /contact | Tell us one task your team dreads. | **Conversion: requests investor access / books a call.** |

---

## 5. ORPHANS & GAPS

### 5a. Pages intentionally outside the primary nav (not orphaned — reachable via footer)

These pages have lower buyer-journey priority. They are in the footer nav (present on every
page), making them ≤2 clicks from anywhere on the site. They are excluded from the primary
nav dropdown to keep sibling counts tight.

| URL | File | Why footer-only |
|-----|------|-----------------|
| /news/ | news/index.html | Automated curation; not a decision page in any buyer journey |
| /glossary/ | glossary/index.html | Audit flags entries as "very short" (thin); useful reference, not a nav priority |
| /dataroom | dataroom.html | Investor-specific; /investors in nav dropdown is the public entry point |
| /dataroom/ | dataroom/index.html | Investor confidential index; investors.html leads here |
| /onepager-dpr | onepager-dpr.html | Typically shared as a direct link; not browsed |
| /dataroom/compliance → /dataroom/team | 7 investor docs | Accessed via /dataroom/ index; investor-only |

### 5b. Audience gaps

| Audience | Coverage | Gap |
|----------|----------|-----|
| Business buyer | ✓ Strong | Primary nav has 4 buyer-facing entry points (method, proof, pricing, teardowns). Journey is 4–5 pages with clear conversion. |
| Founder | ⚠ Weak | No dedicated founder landing page. method.html is written for business buyers building on existing systems; it does not speak to a founder building a new product. blog/what-investors-want.html is the only explicitly founder-audience page. The "Build the product · Founders" homepage hub node links to contact.html — the founder receives no page that is theirs. |
| Investor | ✓ Adequate | Clear nav path: investors.html → dataroom.html → dataroom/index.html → docs. dataroom/team.html is flagged "thin" in the audit — a diligence risk but not an IA gap. |
| General / beginner | ⚠ Weak | guide/, learn/, and train/ are in the Resources dropdown but there is no explicit "new to AI?" entry callout on the homepage or in the nav label. Beginners landing on /guide/ have a clear path, but nothing in the nav signals they belong there. |

### 5c. Missing pages the IA implies should exist

> These are structural gaps identified by the nav model. Build decisions are out of scope
> for this IA plan.

1. **`/founders` — Dedicated founder landing.**  
   The homepage has a "Build the product · Founders" hub node that links to `/contact`.
   There is no page that owns the founder pitch: idea → shipped AI product on your stack +
   warm investor intro. method.html speaks to business buyers with existing workflows;
   founders building new products need a different frame. The Journey 2 map above is forced
   to route through /method and /investors as substitutes.

2. **`/solutions` or per-offering landing pages.**  
   DPR has three distinct offerings (Scale with AI, Build the product, Meet the capital)
   but only method.html serves as a catch-all landing. As the site scales, separate offering
   pages would allow audience-specific SEO and conversion tracking.

3. **Expanded case study index.**  
   case-studies.html contains one anonymized build. When a second case exists, a list/index
   (`/case-studies/` index + individual `/case-studies/[slug]` pages) would better serve
   the Proof section's "numbers you can check" promise.

4. **`/dataroom/team` — content urgency flag.**  
   Not a missing page; it exists. Audit flags it "thin." Investor diligence hits this page
   in the journey; under-populated team content creates a trust gap before a close.

---

## 6. NAV CHANGE SUMMARY

Seven changes, in plain language for a non-engineer founder:

1. **"Proof" is now a visible top-nav dropdown — two clicks from anywhere.**  
   Today, proof.html, case-studies.html, and teardowns.html have zero nav entries. A buyer
   who doesn't know to scroll the homepage never finds them. In Phase 2, "Proof" is the
   second item in the primary nav, surfacing your three strongest trust pages immediately.

2. **"Free tools" appears once, not twice.**  
   Right now "Free tools" is a standalone nav item AND appears inside the Learn dropdown —
   two places, same destination. Both instances are gone. All five interactive tools
   (Score my AI, Free AI agent, Cost estimator, Cost of inaction, Build-vs-buy decision
   tree) live under a single "Tools" dropdown, cleanly separated from content.

3. **Teardowns moves from nowhere into the Proof section.**  
   teardowns.html is a strong lead-gen page — AI build autopsies plus a free diagnostic
   booking — with no nav entry today. It joins "Proof" as the third item in that dropdown,
   turning Proof into a three-page evidence cluster: results → case studies → build
   autopsies. Buyers can book a teardown in two clicks.

4. **Your anti-slop manifesto and ownership argument become findable.**  
   slop.html and own-it.html are two of your strongest brand-voice pages. Today they have
   no nav entry. In Phase 2 they appear in the "About" dropdown under plain labels —
   "Why we exist" and "You own it" — so buyers who need convincing can find the argument
   without stumbling onto it by accident.

5. **Investors get a menu path and a clean dataroom route.**  
   investors.html and the entire investor dataroom have no primary nav presence today. In
   Phase 2, investors.html joins the "About" dropdown. The public investor landing
   (/dataroom), the confidential document index (/dataroom/), and the one-pager
   (/onepager-dpr) all appear in the footer Company column — at most two clicks from any
   page on the site.

6. **"Learn" becomes "Resources" and playbook finally has a home.**  
   The current Learn dropdown mixes tools (Free tools) with articles and training modules.
   The new Resources dropdown is content-only: Field Notes, Knowledge Base, Playbook, AI
   Guide, Practice AI (prompt builder), and Training. playbook.html — the automation field
   guide most vendors won't hand you — moves from nav-orphan to Resources entry point.

7. **Six dead-end pages get clean 301 redirects and all URLs go extension-free.**  
   pilot.html, pilot-scoping-guide.html, and two blog stubs redirect to /contact. The
   duplicate angel deck URL redirects to the canonical 12-slide deck. The overlapping
   investor-screening page redirects to the stronger blog article that covers the same
   ground. At the same time, adding `"cleanUrls": true` to vercel.json makes every URL
   lose its .html extension (/pricing instead of /pricing.html). Old bookmarks and indexed
   URLs keep working — Vercel issues the 301 automatically. Both changes ship in one
   atomic commit.

---

*IA method: inventory-driven grouping from site-audit.csv + first-principles audience
segmentation. No card-sort or tree-test data exists yet.*  
*Authoritative sources: [NN/g IA 101](https://www.nngroup.com/articles/information-architecture-101/) ·
[NN/g tree testing](https://www.nngroup.com/articles/tree-testing/) ·
[NN/g taxonomy & labeling](https://www.nngroup.com/articles/taxonomy-definition/)*  
*Next action: run a tree test on ≥10 tasks before shipping nav to production. Minimum
tasks: find a teardown booking, find pricing, find the investor deck, find the ownership
argument, find the Claude how-to article.*
