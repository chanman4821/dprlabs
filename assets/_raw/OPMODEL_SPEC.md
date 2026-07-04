# OPMODEL SPEC - "How we run it" operating-model flow diagram

## What to build
A signature ANIMATED flow diagram section for the DPR / Deeper site that shows our
operating model: one or two humans in the loop steering an AI orchestrator that fans
out to several AGENT TEAMS (teams within teams), which in turn act on the client's
services. Inspired structurally by the Harness "AI SRE" flow diagram (marching dashed
connector lines, pulsing robot nodes, cycling status labels) but using OUR brand and
OUR positioning: we are the senior consulting team; the humans stay in control.

This is a NEW section. Do NOT remove or restyle existing sections. All files stay in
C:\Users\dennha\programs\dpr.

## Positioning / copy (value-based, plain, confident)
- Eyebrow: HOW WE RUN IT
- Heading: One team. A hundred hands.
- Sub: We run your AI like a team of teams - small specialist agent crews that plan,
  build, automate and watch your systems around the clock, all steered by one or two
  senior humans who stay in the loop on every decision that matters.
- A short caption line under the diagram (also used as the screen-reader description,
  see a11y): A human sets the goal. The orchestrator breaks it into work. Specialist
  agent teams execute. Every important step comes back to a human to approve.

## Structure of the diagram (left to right)
1. HUMAN node (left): a person glyph + label "You + 1-2 senior leads". Small tag pill
   "human in the loop".
2. A REQUEST pill ("Your goal") flows right from the human into the hub along a
   highlighted dashed connector.
3. ORCHESTRATOR hub (center): a brand orb/diamond labelled "Deeper Orchestrator" with
   a smaller sub-label that cycles: Planning... / Routing... / Reviewing...
4. From the hub, FOUR or FIVE dashed connectors fan out to AGENT-TEAM lanes (stack
   vertically on the right). Each lane = a rounded node showing:
   - team name + a cluster of 2-3 small "sub-agent" dots (this visually conveys
     "teams within teams")
   - a status label that cycles with animated trailing dots
   - a small row of 3-4 service chips (the systems that team touches)
   Lanes (use brand colors via the per-lane --c variable):
   a. Strategy crew      (--cyan)   status: Mapping... / Prioritizing...
   b. Build crew         (--violet) status: Building... / Shipping...
   c. Automation crew    (--green)  status: Wiring... / Automating...
   d. Insight crew       (--gold)   status: Forecasting... / Scoring...
   e. Reliability crew   (--accent) status: Watching... / Healing...   (SRE-style)
5. A RETURN connector from the lanes back to the HUMAN node, labelled "Approve / steer"
   - this is the key human-in-the-loop message: control loops back to the person.

## Motion (all GPU-cheap, all reduced-motion gated)
- Connector lines are SVG paths animated with stroke-dasharray + stroke-dashoffset
  keyframes so the dashes "march" along the path (the flow effect). Stagger each lane
  so flow lights up lane-by-lane, then the return line pulses back to the human.
- Agent nodes gently pulse (box-shadow / opacity breathe).
- Status labels cycle their text every ~2.2s with 3 animated trailing dots.
- The whole thing starts only when scrolled into view (IntersectionObserver, threshold
  ~0.25), like the existing reveal system.

## Reduced motion (prefers-reduced-motion: reduce) - HARD REQUIREMENT
- No marching dashes, no pulsing, no label cycling. Show the diagram in a clean STATIC
  resolved state: all connectors drawn solid-ish (low opacity), each status label shows
  ONE steady representative word (e.g. its first state without dots), everything fully
  legible. The section must convey the same meaning with zero motion.
- Mirror the project pattern: the JS must check prefers-reduced-motion and bail out of
  all animation, leaving the DOM-authored static frame intact.

## Accessibility (WCAG 2.2 AA)
- The decorative SVG connectors get aria-hidden="true".
- Provide a real text description of the model for screen readers: either a visible
  caption (preferred, the caption line above) or a visually-hidden <p>. A sighted-text
  caption that doubles as the SR description is ideal.
- All text meets AA contrast over the dark background. Do not rely on color alone to
  distinguish lanes - each lane has its name in text.
- Keyboard: nothing here should trap focus; non-interactive nodes are not focusable.
- Respect existing focus-visible styles.

## Integration details (match the existing codebase exactly)
- Stack: vanilla HTML + CSS + JS. No frameworks, no build step, no new dependencies.
- Brand tokens already in styles.css :root - USE THEM, no hardcoded hex:
  --bg #05080e, --ink, --ink-2, --ink-3, --line, --cyan #3fd0e6, --teal #1f8fa8,
  --accent #56e0f0, --violet #b48cff, --green #56e0a4, --gold #ffd166, --amber #ffae57,
  --radius 20px, --maxw 1180px, --ease cubic-bezier(.2,.7,.2,1).
- PLACEMENT: insert the new <section class="opmodel" id="operating"
  aria-labelledby="operating-h"> immediately AFTER the integrations section closing tag
  and BEFORE <section class="results" id="results"> in index.html.
- Use the existing reveal-on-scroll classes (reveal / reveal-up) for the heading/intro
  so it fades in consistently with the rest of the page.
- Create a NEW file opmodel.js for the engine. Add <script src="opmodel.js"></script>
  in index.html right AFTER <script src="transitions.js"></script> and BEFORE
  <script src="media.js"></script>.
- Put all new CSS in styles.css (append a clearly-commented "/* ---- Operating model
  diagram ---- */" block). Reuse the prefers-reduced-motion media block conventions.
- Do NOT touch mockups.js, transitions.js, media.js, bg.js, widgets.js, script.js,
  solutions.js logic. Only add the new section markup, the new CSS block, and opmodel.js.

## Quality bar / self-check before done
- Page loads with ZERO console errors in normal AND reduced-motion modes.
- Normal mode: connectors visibly march, lanes light in sequence, labels cycle, return
  line pulses to the human node.
- Reduced motion: completely still, still fully readable and meaningful.
- Layout holds from 360px wide up to 1440px (lanes stack cleanly on narrow screens; no
  horizontal overflow at 360px).
- Nothing else on the page changed or regressed (hero video, mockups, section videos,
  mobile menu, sub-nav indicator all still work).
- Looks premium and on-brand: deep near-black background, cyan/teal glow, the same
  visual language as the rest of the site. Not a generic boxy flowchart.
