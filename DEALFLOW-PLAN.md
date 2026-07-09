# DPR AI — Dealflow + Data Flywheel Plan

*Internal working plan. Not published to the site. **Not legal advice** — a securities
lawyer must review every item flagged ⚖️ before any of the capital side goes live.*

---

## 0. Bottom line

We connect verified-accredited investors with founders we've actually built for. We
**never** take a cut of a raise or a fee for an introduction — we sell a flat
subscription to a trusted, AI-scored feed. Every subscription and every match throws off
data that sharpens the scoring, so the product gets better with every user. That
compounding data-plus-relationship advantage is the moat.

Two sides, one flywheel, one data engine underneath.

## 1. The model in one picture

```
builds → real measured traction → founders fundable on merit → subscribing investors
   ↑                                                                      │
   └──────── more builds ← future clients ← better founders ←─────────────┘
                         (every match feeds the scoring engine)
```

## 2. Who's involved

- **Founders** — companies DPR has built owned, measured AI for. We only ever feature
  founders we have actually worked with.
- **Investors** — verified-accredited angels, micro-VCs, family offices, syndicate leads.
- **The licensed partner** — a registered broker-dealer we route to for any founder we
  hold equity in. They contract with and are paid by the party directly; DPR takes nothing.

## 3. The compliant match mechanic (7 steps)

| # | Step | Who | Money |
|---|---|---|---|
| 1 | Build + instrument the founder's one honest number. Founder signs build SOW **and** a separate "feature me in the feed" consent. | Human | Founder pays flat build fee. No financing-contingent part. |
| 2 | Score the number with the **published** method → an information-only deal page with the disclaimer stack + any conflict badge. | Auto | None. Scoring is part of the subscription we already sell. |
| 3 | Publish the page into the gated feed; only verified-accredited investors can see it. | Auto | Subscriber pays flat tier fee only. |
| 4 | An investor raises their hand ("request intro"). DPR human reviews fit + conflict status. | Human | No per-intro fee, ever. |
| 5 | **Non-equity founder:** DPR makes a warm, double-opt-in intro (both sides consent), then steps out of the deal. | Human | No contingent/success pay. Subscription only. |
| 6 | **Equity-held founder (the firewall):** DPR does **not** intro. The match routes entirely through the registered broker-dealer partner, paid directly, DPR's stake disclosed, DPR takes nothing. | Human | Any transaction pay goes to the licensed partner, not DPR. |
| 7 | Log consent, disclosures, and outcome to an audit trail. Nothing to reconcile — no per-deal fee exists. | Auto | — |

**The only two money paths:** founder pays a flat build fee; investor pays a flat
subscription. Never per-deal, never contingent, never timed to a raise.

## 4. The product & tiers

- **Free — "What We're Seeing"** weekly AI-scored teardown/memo. Information, not deals.
  Builds the audience and the authority. This is the top of the whole funnel.
- **Signal — ~$250/mo ($3k/yr):** full gated scored feed + memo archive + published
  rubric. Read-only; passive interest signals only.
- **Syndicate — ~$625/mo ($7.5k/yr):** Signal + human warm intros to non-equity founders
  + monthly live pitch / office-hours + deeper measured data rooms.
- **Inner Circle — ~$1,000/mo ($12k/yr):** Syndicate + priority intro queue + founder
  update rooms (ongoing KPIs) + small-group roundtables + early access to new builds.

Bill annually, report as ARR. Expected mix ≈ 80% Signal / 15% Syndicate / 5% Inner Circle
→ blended **≈ $340/mo per subscriber**.

## 5. The data flywheel (the moat)

### What each interaction throws off
- **Investor behavior:** opens, dwell time, saves, passes, intro-requests, tier, which
  thesis filters they use.
- **Match outcomes:** intro accepted? conversation happened? follow-on interest?
- **Founder outcomes:** the instrumented one-number trajectory over time.
- **Investor feedback:** agree/disagree with a score; post-intro rating.

### How it compounds
Every signal feeds the scoring/matching engine. It learns (a) what "good" looks like for
each investor's taste and (b) what predicts a founder worth backing. Sharper matches →
better outcomes → more trust → more subscribers and better founders → more data. A rival
can copy the website in a weekend, not a rubric tuned on years of real outcomes.

### Instrumentation spec — build from user one
- **Event log:** `page_view, save, pass, intro_request, intro_sent, intro_accepted,
  conversation_confirmed, score_feedback, founder_metric_update` — each with pseudonymous
  actor id, deal id, timestamp, tier.
- **Per-investor thesis profile** that updates from behavior.
- **Per-deal outcome record.**
- **Versioned scoring rubric**, back-tested against real outcomes; self-calibrating
  (retune weights as outcomes land) but kept **explainable** so scores stay "information."

### Guardrails
- Data improves the **information product only** — never personalized advice, never a fee
  tied to a match.
- Consent + privacy: investors and founders opt in to data use; protect PII; publish a
  plain-English data-use note.

## 6. Playbooks (value-add + audience magnet)

Produce first, in this order:
1. **Published Scoring Methodology** (investor) — authority; reframes scores as
   information; seeds the reader list.
2. **Diligence Rubric — "What We Screen For"** (investor) — free, demonstrates rigor.
3. **The One Honest Number** (founder) — instrument the metric that makes deal pages
   credible; sold as generic ops work.
4. **Weekly Sector Teardowns** (investor) — recurring distribution.
5. **Traction-Instrumentation Playbook** (founder) — generic ops work, decoupled from any
   raise.

Later: Data-Room Hygiene, Get-Fundable Ops Readiness, How To Read A DPR Deal Page.

Founder playbooks are sold/given as **generic ops work, billed whether or not they raise**
— that's what keeps them out of "advice" territory.

## 7. Phased roadmap (12 months, then scale)

### Phase 1 — Foundation (months 1–3)
Be a paid build shop only. Sign 2–4 build clients; instrument each one-number. Draft the
build SOW, feature-consent, and disclaimer stack with counsel ⚖️. Launch the free weekly
memo; publish the scoring method; hand-seed 200–400 readers from warm relationships.
Finish the first 2–3 builds → first real deal pages. Stand up the accreditation gate ⚖️.
**Milestone:** first founder proof pages exist; distribution engine live.

### Phase 2 — First flow (months 4–7)
Paper the broker-dealer partnership ⚖️. Grow readers to ~1,200. Soft-launch **Signal** to
the warmest readers (first 5–10 subs). Run the first monthly pitch day. Launch **Syndicate**
+ first warm intros. Execute the first firewall test (a BD-routed equity match), audited.
**Milestone:** first paying subs + first compliant intros + first BD routing.

### Phase 3 — Loop + premium (months 8–12)
Keep builds flowing to refresh founder supply. Ship a sector-teardown series. Launch
founder-update rooms. Open **Inner Circle** to the top cohort. Systematize the loop (each
build → a memo + a deal page; each memo → readers; each cohort → funds more builds). Grow
the list to ~3,000. Review CAC and unit economics; harden the compliance checklist ⚖️.
**Milestone:** self-reinforcing loop proven end-to-end without a cold marketplace.

## 8. Metrics & honest targets

- **Reader list:** 200–400 (m2) → ~1,200 (m4) → ~3,000 (m11). ~1–2% convert to paid.
- **Subscribers:** 5–10 (m5) → low double digits (m8) → **~45 by month 42–60** (the real
  timeline; the memo has to become a genuinely-followed research product).
- **Renewal:** model 75–85% annual, separate from the ~4%/mo build-retainer churn; treat
  as ARR-derived, not smooth monthly cash.
- **CAC:** ~20–40 unbillable founder-hours per paying sub. **No paid ads** — accredited CAC
  is punishing.
- **Data health:** % of matches with a captured outcome; scoring back-test accuracy trend.

## 9. Compliance gates (counsel must clear — ⚖️)

| Step | Line that gets crossed | Safe alternative |
|---|---|---|
| Investor pricing | Any % of a raise, per-intro success fee, or fee timed to a financing = unregistered broker. | Flat recurring subscriptions only, payable regardless of any outcome. |
| Intro to an equity-held founder | DPR warm-introducing a company it holds = a transaction nexus resembling brokering. | Route entirely through the registered broker-dealer partner; stake disclosed; DPR takes no cut. |
| Scores & deal pages | Framing a score as "buy"/personalized advice = investment-adviser activity. | Publish scores as generic information with an open method + full disclaimer stack. |
| Advisory alongside intros | Bundling advisory with fundraise access, or timing it to a raise = compensated facilitation. | Sell advisory as generic ops instrumentation, billed whether or not they raise. |
| Gating the audience | Showing private-placement deals to non-accredited/unverified people can break the exemption (general solicitation). | Verify accredited status before feed access; keep the free memo information-only, no specific security offered. |
| Automating intros | Automation that negotiates, recommends a security, or moves money = broker activity. | Keep the intro human + double-opt-in; automation only displays information. |

**Never:** a percentage of a raise, a per-intro success fee, any fee timed to a financing;
warm-introducing a company we hold equity in; framing a score as a recommendation;
exposing deals to non-accredited people; automating the introduction, negotiation, or money.

**Counsel checklist before launch:**
1. Confirm flat-subscription-only keeps DPR outside broker-dealer registration.
2. Paper the broker-dealer partnership for equity-held (SAFE) routing.
3. Validate scores/deal pages are information, not advice (avoid investment-adviser status).
4. Confirm the accreditation-verification process; confirm the free memo isn't unlawful
   general solicitation under the exemption relied on.
5. Review conflict-disclosure language + the capped/unpaid portfolio-deal fraction.
6. Confirm founder advisory reads as generic ops work, not compensated deal facilitation.
7. Pin down the exact private-placement exemption(s) and states in scope — currently unknown
   and legally material.

## 10. Immediate next actions (this month)

1. Draft the free weekly memo format + first issue; write **Playbook #1 (Published Scoring
   Methodology)** — this is the highest-leverage first move.
2. Start hand-building the accredited reader list from warm relationships.
3. Draft the SOW + feature-consent + disclaimer stack; book securities counsel to review §9. ⚖️
4. Write the event-log instrumentation spec so the data flywheel captures from user one.
5. On the site: a founder-facing "get discovered on merit" page and an investor-facing
   "what you get" page — both compliance-worded, **publish held until counsel clears the
   disclaimer stack.** ⚖️

---

*Sources: BUSINESS-MODEL.md (source of truth for the compliant model), Jarvis brain
strategy pass (dpr_dealflow.json), and 2025–2026 market research on small-business AI value.*
