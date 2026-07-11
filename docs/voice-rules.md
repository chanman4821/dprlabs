# DPR AI — Voice Rules
**Editorial Guardrail · v1.0**
_Built from live-page audit: index.html, about.html, pricing.html, method.html,
proof.html, own-it.html, case-studies.html, contact.html, slop.html_

---

## The voice in 3 adjectives

**Blunt** — State the claim first. Prove it or admit you can't. No warm-up paragraphs.
**Specific** — A number beats an adjective. A process beats a promise. A caveat beats overconfidence.
**Self-aware** — DPR is a small, early-stage studio. Say so. The honesty is the differentiator.

---

## 3 anti-patterns

1. **Authority without evidence.**
   "We're the leading senior AI studio" with nothing behind it.
   Rule: if a claim cannot be sourced to a metric, a named process, or an honest admission, it does not ship.

2. **Padding before the point.**
   "In the rapidly evolving AI landscape, businesses face unprecedented challenges…"
   Rule: delete everything before the actual claim. Start with the noun.

3. **Hedges that perform honesty without being honest.**
   "We believe we might potentially be well-positioned to…" is not DPR candor.
   Rule: say what you know; say what you don't; stop there. Two sentences max per idea.

---

## WORDS WE NEVER USE

| Banned word or phrase | Replace with |
|---|---|
| cutting-edge | Name the specific technology or technique |
| seamless | Name the integration point or admit the friction |
| revolutionize | Reserved for things with a measured before/after. Otherwise delete. |
| leverage | "use" — or name the specific tool |
| unlock | Name what specifically becomes possible |
| empower | Name the capability the person gains |
| "in today's world" | Delete the entire phrase |
| synergy | Name what two things combine to produce |
| game-changer | A number with a baseline; otherwise delete |
| robust | Name what it handles and what it doesn't |
| innovative | Name the new thing |
| transform | Use only with a measured before/after (e.g., "38 min → 10 min") |
| solutions | Name the workflow |
| journey | Delete |
| ecosystem | Name what connects to what |
| at scale | Name the volume |
| streamline | Allowed only with a number (e.g., "cut from 38 min to 10 min") |
| optimize | Allowed only with a named metric |
| next-level | Delete |
| holistic | Delete |
| world-class | Cite the source or delete |
| industry-leading | Cite the source or delete |
| "harness the power of" | Delete through "of." Start with the outcome. |
| AI-powered | Allowed only if followed by what the AI actually does |
| state-of-the-art | Name the model, architecture, or technique |
| mission-driven | Show the behavior that proves it |

---

## Sentence and paragraph limits

**H1:** ≤ 8 words. Name a claim, not a category.
**Subhead / lead:** ≤ 25 words. One idea. One sentence or two short ones.
**Body paragraph:** ≤ 4 sentences. Front-load the claim; put the caveat last.
**Hero proof bullets:** 3 items maximum. Each must be a verifiable claim, not a promise.
**Lists:** 3–6 items. More than 6 = split into two distinct arguments.
**Section heading:** ≤ 8 words. If a number fits, use it.

---

## How to state uncertainty honestly

DPR is explicitly early-stage. proof.html says it directly: "a small, senior team early in
our story — a few builds so far." Use that framing. Do not oversell the track record.

**Rule 1 — Label the stage.**
"We're a small studio, early in our story" is the honest framing (proof.html). Use it where relevant.

**Rule 2 — Label illustrations as illustrations.**
proof.html scorecard (11 min / 90 sec / n=400) = illustration of the format only. Never present it as a result.
case-studies.html (38 min / 10 min / n=2,431) = real client measurement. Label it correctly: "anonymized, client-measured."

**Rule 3 — Name what you don't know.**
"We don't have enough data to say this result is universal" is stronger than a hedged superlative.

**Rule 4 — Caveats go last, not nowhere.**
Result → sample → limit.
✓ "38 minutes to 10 minutes, n=2,431. This was one freight-exception team; peak-season volume needs eval-guided retraining."
✗ "We saw significant improvements across various metrics."

---

## How to phrase pricing

1. **Always publish the number.** "Contact us for pricing" is slop. DPR publishes ranges. (pricing.html)
2. **Explain what moves the price.** "Near $3k for a clean single workflow; up to $15k for compliance-heavy or multi-integration builds." (pricing.html)
3. **State the guarantee in plain terms.** "Miss the agreed number — no fee, keep the code." Not "guaranteed results."
4. **State the cancel term for retainers.** "Cancel any time" is a meaningful commitment; state it. (pricing.html)
5. **Don't switch floors between pages.** pricing.html shows build sprints from $3k; index.html says "from $8,000." Use one consistent floor or explain the difference explicitly.

---

## The definition of a verifiable claim vs filler

**Verifiable** — has a number, a named source, a cited process, a documented term, or an honest admission.

| Verifiable ✓ | Why |
|---|---|
| "$3,000–$15,000 fixed price" | Specific range, on pricing.html |
| "38 minutes → 10 minutes, n=2,431" | Measured, sample stated, source labeled |
| "1 business day reply" | Specific, committable SLA (contact.html) |
| "6-module Owned-AI Method" | Named, documented, each step has a named output |
| "Ex-Microsoft & PayPal senior builders" | Named companies — pending named bios |
| "A few builds so far" | Honest self-description (proof.html) |

**Filler** — cannot be checked, compared, or falsified.

| Filler ✗ | Why |
|---|---|
| "We help businesses scale with AI" | Three vague verbs, no outcome |
| "Proven process" | Proven by whom, measured how? |
| "Senior, experienced team" (without names) | Adjective without evidence |
| "We deliver results" | Circular |
| "Cutting-edge AI solutions" | Two banned words, zero specifics |

If a claim cannot be made verifiable, it does not go in.
It gets a `[[NEEDS REAL INPUT: <what's needed>]]` placeholder instead.

---

## Before / after: 5 real slop sentences from the site — rewritten

| # | Location | BEFORE (current copy on site) | AFTER (DPR voice) | Why it's stronger |
|---|---|---|---|---|
| 1 | index.html meta description | "We help businesses scale with AI, help founders build, and bring funding and founders together." | "We take one workflow, agree one number before we write a line of code, and hand you the system that moved it — or you pay nothing." | Three vague verbs → one concrete sequence + the guarantee. The reader now knows what they're buying. |
| 2 | index.html hub / offerings label | "Scale with AI" | "Cut the workflow that costs the most. Measure it. Own the result." | Names what "scale" means: cost reduction + measurement + ownership. Not a platitude. |
| 3 | index.html offerings card (founders) | "Idea to a shipped, owned product — you ship it, you own it." | "Concept to a launched AI product. The code, keys, and eval suite handed to you on day done." | Restating "own" twice is filler. Listing what's actually handed over is proof. |
| 4 | index.html metric-band tag | "−74% · illustrative" (tagging the real case study result as illustrative) | "−74% · anonymized logistics build · n=2,431 · client-measured" | The case-studies.html page calls this a real result. The homepage tag should match. Calling a real number "illustrative" undersells proof. |
| 5 | index.html offerings card (businesses) | "Automation, compliance-grade systems, integration — measured by a number you agree up front, and yours to keep." | "One workflow — built into your real tools and repos. You name the number before we start. Code and keys handed over when it ships." | "Automation, compliance-grade systems, integration" is a vague list. "Built into your real tools and repos" is concrete. "Code and keys handed over" is concrete. |
