# Built on Jarvis — `jarvis.html`

*The differentiator, shown truthfully. Goal: a technical buyer should believe the delivery
engine is real and repeatable — not one-off consulting, and not autonomy we don't have.*

*Grounded in `jarvis.html` and the real, sanitized run export in
`assets/data/jarvis-run.json`. Deeper than the current page: each of the five roles gets a
fuller description and the run snapshot is explained with its real numbers and provenance.*

---

## Section 1 — Page hero

- **Eyebrow:** How we build · built on Jarvis
- **Headline:** A small team, amplified by a mesh.
- **Subhead:** Behind the studio is Jarvis — a group of specialised AI workers that plan the
  work, hand it to the right builder, grade each other's output, and fix their own mistakes.
- **Body:** It's how a few senior people ship like a much larger team. We don't ask you to
  take that on faith: we show it the only honest way — with a real run from our own logs,
  sanitized of any client data. No single model is trusted with everything; the mesh catches
  its own mistakes before you ever see the result.
- **Primary CTA:** See it run on your pilot → `contact.html`

---

## Section 2 — The five roles

- **Eyebrow:** The five roles
- **Headline:** Plan, dispatch, build, grade, and heal.
- **Subhead:** Each worker does one job well and checks the next. No single model is trusted
  with everything — the mesh catches its own mistakes.

**Planner.** Breaks a goal into a small, ordered set of tasks with clear success criteria.
Nothing starts until the work is scoped and the finish line is defined.

**Dispatcher.** Routes each task to the worker best suited to it — and refuses work that
isn't ready, instead of pushing a half-scoped task downstream.

**Builder.** Does the actual work: writes the code, the docs, the configuration. This is where
the system that runs your pilot is actually built.

**Grader.** Checks the result against the criteria and sends it back if it isn't good enough.
The grader is why "done" means checked, not just written.

**Healer.** Catches failures, learns from them, and repairs the run without a human in the
loop — so a flaky step doesn't sink the whole build.

**How they connect.** The work moves in a loop, not a straight line. The planner hands scoped
tasks to the dispatcher; the dispatcher routes each one to a builder; the builder's output
goes to the grader; and the grader decides what happens next — pass it to the healer to shore
up, or send it **back** to the dispatcher to be re-run. That build → grade → send-back loop is
why "done" means checked, not just written. This is the exact routing recorded in the run log
(`edges` in `assets/data/jarvis-run.json`), not a diagram we drew for the page.

---

## Section 3 — A real run, not a mock-up

- **Eyebrow:** A real run, not a mock-up
- **Headline:** Every node is a real worker. Every count is a real record.
- **Subhead:** The numbers below come straight from Jarvis's own run log, sanitized of any
  client data. The live graph on our home page is driven by this same snapshot.

**Run snapshot (real, sanitized)**
- **305** files changed
- **60** tasks dispatched
- **66,255** seconds of compute (~18.4 hours)

- **Provenance line (as rendered):** Source: Jarvis mesh state.db (dispatches) · exported
  2026-06-30 · sanitized, no client data.
- **Body:** These are real records mapped from real agent runs, not a demo dataset. Roles are
  mapped from the actual agent slugs in the log; the counts are the actual totals. If the
  snapshot ever fails to load, the page says so plainly rather than showing invented numbers.

---

## Section 4 — The honest limits

- **Eyebrow:** The honest limits
- **Headline:** A mesh is not magic.
- **Body:** It speeds up disciplined, well-specified work; it does not replace judgment, and
  we keep a senior human approving the calls that matter. We don't claim autonomy we don't
  have. On your pilot, you see the same logs we do — the plan, the grades, the fixes — so the
  engine is transparent, not a black box you're asked to trust.

---

## Section 5 — CTA

- **Eyebrow:** Start a conversation
- **Headline:** See it run on your pilot.
- **Subhead:** Book a scoping call and we'll show you the mesh working on real work.
- **Primary CTA:** Book a call → `contact.html`

---

## Facts to confirm before publishing

- **The run figures (305 / 60 / 66,255).** Real as of the 2026-06-30 export in
  `assets/data/jarvis-run.json`. Re-export before a relaunch so the snapshot is current; the
  page reads these live, so refreshing the JSON refreshes the page.
- **"~18.4 hours."** This is just 66,255 seconds expressed in hours (66,255 ÷ 3,600 ≈ 18.4).
  Recompute if the seconds figure changes.
- **The five role names** (planner, dispatcher, builder, grader, healer) match the `roles`
  array in `assets/data/jarvis-run.json`. Keep them in sync if the mesh roles change.
- **The role flow** (planner → dispatcher → builder → grader → healer, plus the grader →
  dispatcher send-back loop) is the `edges` array in `assets/data/jarvis-run.json`. If the
  routing changes, update the "How they connect" paragraph to match the log.
