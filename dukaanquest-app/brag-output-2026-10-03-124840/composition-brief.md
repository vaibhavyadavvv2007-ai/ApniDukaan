# Hyperframes Composition Brief: DukaanQuest

## Objective
Create a short launch-style brag video for **DukaanQuest**, an AI omnichannel
growth copilot for traditional Indian retailers. The video must make a judge
understand in 20 seconds that this connects five separate merchant jobs into
one guided sequence, and that it is honest about what is really live.

## Output
- Composition directory: `brag-output-2026-10-03-124840/composition/`
- Rendered video: `brag-output-2026-10-03-124840/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds exactly (4.0 + 6.0 + 7.0 + 3.0)

## Source Material
- Project root: `dukaanquest-app/`
- Primary files read: `index.html`, `src/App.jsx`, `src/index.css`,
  `src/components/game/DigitalDukaanCanvas.jsx`,
  `src/components/studio/GeminiPhotoStudio.jsx`,
  `src/components/catalog/OmnichannelCatalog.jsx`,
  `src/components/crm/WhatsAppCRMHub.jsx`,
  `src/components/simulator/WhatIfSimulator.jsx`
- Product name: DukaanQuest
- Tagline / strongest claim: **"From photo to profit"** (`App.jsx` journey title, verbatim)
- Key UI / visual moment to recreate: the **isometric Digital Town** —
  five extruded buildings on a bounded diamond plot in Canvas 2D. Recreate it as
  an isometric CSS/HTML composition in the same palette: two visible wall faces
  per volume (lighter left, darker right), a flat roof with a ridge line, a warm
  saffron cornice on the near roof edges, an elliptical contact shadow under
  each building, painter's-order (far-to-near) draw, and depth-correct labels
  under each building. The centre building ("Your shop") is the anchor: tallest,
  saffron-lit, with an awning.
- Copy that must appear verbatim:
  - "From photo to profit"
  - "2/5 steps done"
  - "55 XP to Digital Vyapari"
  - "Your shop" · "Photo studio" · "Packaging" · "Customer reach" · "What-if room"
  - "What Gemini read"
  - "Same product, five marketplaces"
  - "Send to 5 customers"
  - "What each option would earn you"
  - "Do this one"
  - "LIVE" · "SANDBOX" · "STAGED" · "FALLBACK"
  - "Mohalla Merchant → Digital Vyapari"
  - "Create once. Sell everywhere. Retain. Reach. Simulate."

## Creative Direction
- Tone preset: `polished`
- Creative direction: "a real shop's working screen, filmed honestly — no superlatives, no fake-live claims"
- Interpretation: confidence through restraint. Four scenes, longer holds,
  soft crossfade/slide transitions. Type settles and stays readable — never
  flashes past. The product's own UI copy carries the story; no invented
  marketing language, no generic SaaS phrasing.
- Angle: a saree-shop owner already has stock, a counter, UPI and a WhatsApp
  list. What's missing is not a website — it's the *team* a big retailer would
  have. DukaanQuest puts those five jobs in one guided sequence and makes
  progress visible as a town that fills in. The honesty layer is the
  credibility beat.
- Hook: three lines land in sequence — "Products." → "Customers." → "A shop." —
  then the turn, "What's missing is the team."
- Outro / punchline: "Mohalla Merchant → Digital Vyapari" over the fully lit
  town, with the promise line beneath.
- Avoid:
  - Generic SaaS language ("streamline your workflow", "empower", "unleash")
  - Abstract filler visuals, colour washes, particle systems
  - Any invented statistic, market number, customer quote, or growth claim
  - Purple / neon / glow-heavy "AI" styling — the palette is warm ink + saffron
  - Browser chrome, localhost URLs, debug UI
  - The demo persona's real name or any customer names/phone numbers from
    `mockData.js` (privacy substitution, per /brag Step 1)

## Visual Identity
- Background: `#12100e` (ink-900). Surfaces `#1d1a17` (ink-800) / `#242019`
  (ink-750). Hairlines `#38332b` (ink-650).
- Text: `#f7f2ea` primary, `#b3aa9d` secondary, `#7d7469` tertiary.
- Accent: `#e8a33d` saffron, soft `#f2c179`, status ok `#7bb88f`.
- Display font: IBM Plex Sans. If unavailable offline, fall back to a
  neutral system sans — do not fetch remote fonts at render time.
- Body font: IBM Plex Sans, same fallback rule.
- Mono font for counts/status: IBM Plex Mono, or a system monospace fallback.
- Visual references from the project: the isometric town plot, the saffron
  vertical rail used throughout the app shell, the `progressbar` track fill
  style (5px track, saffron fill), and the pill/status-tag shapes.

## Storyboard
Use `brag-output-2026-10-03-124840/brag-plan.md` as the creative contract.

Scene summary:
1. **Three things he already has** — 4.0s — ink field + saffron left rail;
   "Products." / "Customers." / "A shop." revealed one at a time, then
   "What's missing is the team." in saffron, held.
2. **The town** — 6.0s — crossfade to the isometric plot; five buildings rise
   one by one far-to-near with contact shadows and saffron cornices; labels
   settle under each; "From photo to profit" above; "2/5 steps done" with a
   40%-filled track; "55 XP to Digital Vyapari" small mono beneath.
3. **One product through five engines** — 7.0s — one product card at left;
   four labelled stages arrive in sequence at right ("What Gemini read" →
   "Same product, five marketplaces" → "Send to 5 customers" → "What each
   option would earn you" with the "Do this one" button); the honesty strip then
   ticks LIVE · SANDBOX · STAGED · FALLBACK with the small grounding line
   "every integration reports its real state".
4. **Level up** — 3.0s — the town returns fully lit; "Mohalla Merchant →
   Digital Vyapari" slams in with saffron on the second half; the promise line
   "Create once. Sell everywhere. Retain. Reach. Simulate." settles beneath
   and holds to black.

## Audio
- Audio role: warm corporate bed with restrained, motion-matched accents.
- Audio arc: quiet open under the hook → opens slightly through the town reveal
  → ducks ~20% under the honesty strip in Scene 3 → one dry hit rings over the
  bed on the level-up → clean fade over the last 0.6s.
- Music: `assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`
  (already copied into `composition/assets/music/`).
- Music treatment: start at 0.0 at low-mid volume, hold flat through Scene 2,
  duck under the Scene 3 status strip, duck under the Scene 4 hit, fade out
  over the final 0.6s.
- Music cue guidance: bundled preset already read —
  `assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.md`
  (120.19 BPM). Use **1–2 strong-cue locks only**:
  - Scene 2 full-plot reveal → **17.02s** strong cue
  - Scene 4 level-up type → **18.02s** strong cue
  Both within ±0.15s, marked `// beat-locked`.
  Beat grid (0.50s spacing at 120 BPM) for the five sequential buildings and
  four sequential stage labels: **snap to every other beat** (≈1.0s apart) so
  labels stay readable; non-text accents (cornice glow, dot ticks) may use every
  beat. Mark with `// beat-grid`.
- Audio-reactive treatment: **subtle**. Let music RMS/bass make the saffron
  accent line and the town plot's warmth breathe slightly. No waveform bars, no
  equalizer visuals, no musical-note graphics, no heavy pulsing.
- Audio-coupled moments:
  - Scene 1 — three hook lines revealed in sequence; key ticks on the first
    two, silence then a single impact on the third/turn line.
  - Scene 2 — one soft click per building as it lands; the stepper counter
    settles after the fifth.
  - Scene 3 — one click per stage; the four status tags tick in sequence.
  - Scene 4 — single dry announcement hit on the level-up landing, ringing over
    the music; nothing under the promise line.
- SFX selection guidance: match sound to motion — soft interface clicks for the
  sequential reveals, a dry announcement hit only for the level-up payoff.
  Prefer low high-frequency-risk files for repeated moments so five clicks in
  five seconds never get harsh.
- SFX analysis guidance: see
  `<skill-dir>/assets/sfx/sfx-analysis.md` and `assets/sfx/sfx-analysis.json`
  (`interface/` and `ui/` folders hold click/select/switch candidates).
- Exact SFX choice: Hyperframes picks filenames, timestamps, density and volume
  from the implemented animation.
- Audio files: music is already in `composition/assets/music/`; copy any
  Hyperframes-selected SFX into `composition/assets/`.

## Hyperframes Instructions

Requirements:
- Recreate the isometric town as a real isometric composition — extruded
  volumes with two wall faces, flat roof + ridge, saffron cornice on near roof
  edges, elliptical contact shadows, painter's-order far-to-near drawing, and
  the centre "Your shop" building tallest with an awning. Do not substitute a
  flat box grid; the depth cues are the point.
- Show the real product copy listed above, verbatim. Every claim on screen must
  be traceable to the app (see the grounding table in brag-plan.md).
- Keep all text readable: the hook's turn line needs ≈1.4s settled, short
  labels ≈0.8s settled. Fast-in then hold.
- Keep total duration at 20s (15–25s window).
- Include the music + SFX layer; audio was not disabled.
- Use local assets only; keep creation and rendering local.
- Run `npx hyperframes check` before render — it is brag's single gate, and
  contrast failures gate as errors, so verify the saffron-on-ink and
  `#b3aa9d`-on-ink pairings pass.
- Two strong-cue beat-locks (17.02s, 18.02s) and beat-grid snapping for
  sequential text; natural timing wins wherever it protects readability.