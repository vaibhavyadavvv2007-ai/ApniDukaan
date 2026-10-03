# Brag Plan: DukaanQuest

## What is this app?
An AI omnichannel growth copilot for traditional Indian retailers — it turns one
product record into a marketplace listing, reaches existing customers over
WhatsApp in their own language, and lets the owner simulate the profit before
spending money.

## The angle
A saree-shop owner in Gandhi Bazaar already has stock, a counter, UPI and a
WhatsApp list. What's missing is not a website — it's the *team* a big retailer
would have: someone to prep packaging, shoot the product, list it, message
customers, and check the numbers. DukaanQuest puts those five jobs in one
guided sequence, and then makes progress *visible* as an isometric town the
merchant watches fill in. The honesty layer is the credibility beat: the app
labels every integration LIVE / SANDBOX / STAGED / FALLBACK rather than
pretending everything is live.

## Hook (first 2-3 seconds)
Ink-black frame, a saffron rule, and three short lines that land in sequence:
**"Products."** → **"Customers."** → **"A shop."** then the turn:
**"What's missing is the team."** The last line is the hook payoff and it holds
long enough to read (~1.4s).

## Key moments (the middle)
1. **The Digital Town** — the app's real isometric canvas: five buildings, one
   per engine ("Your shop", "Photo studio", "Packaging", "Customer reach",
   "What-if room"), with the hero line **"From photo to profit"** and the
   real stepper **"2/5 steps done"** and **"55 XP to Digital Vyapari"**.
2. **One product, one workflow** — the real screen labels in sequence:
   **"What Gemini read"** → **"Same product, five marketplaces"** →
   **"Send to 5 customers"** → **"What each option would earn you"**, ending on
   the simulator's **"Do this one"**.
3. **The honesty strip** — **LIVE / SANDBOX / STAGED / FALLBACK**, because that
   is the thing no other dashboard in this category does.

## Outro / punchline
**"Mohalla Merchant → Digital Vyapari"** with the promise line beneath it:
**"Create once. Sell everywhere. Retain. Reach. Simulate."** The town is fully
lit behind the type.

## User flow worth showing
Entry → key action → result, exactly as the merchant meets it:
- **Entry:** the shop dashboard with the Golden Journey stepper ("From photo to profit", 2/5 steps done).
- **Key action:** one product moving through the five engines — Gemini reads the fabric, the master record goes out to five marketplaces, the customer segment gets a regional-language WhatsApp message.
- **Result:** the What-If simulator returns a profit per option and the merchant picks **"Do this one"** — then the shop levels up from Mohalla Merchant to Digital Vyapari.

## Tone
- Preset: `polished`
- Creative direction: "a real shop's working screen, filmed honestly — no superlatives, no fake-live claims"
- Interpretation: confidence through restraint. Fewer scenes, longer holds, soft crossfades. Type settles and stays readable instead of flashing. The product's own UI copy does the talking; no invented marketing language.

## Format: landscape — 1920x1080
## Duration: 20 seconds

## Visual identity (from the project)
- Background: `#12100e` (--ink-900), surfaces `#1d1a17` / `#242019`, hairlines `#38332b`
- Accent: `#e8a33d` (--accent saffron), soft `#f2c179`, status ok `#7bb88f`
- Text: `#f7f2ea` primary, `#b3aa9d` secondary, `#7d7469` tertiary
- Display font: IBM Plex Sans (headlines) — fallback if unavailable
- Body font: IBM Plex Sans — fallback if unavailable
- Numeric/mono font: IBM Plex Mono for XP, counts, and status tags
- Strongest visual element: the isometric Digital Town canvas (`DigitalDukaanCanvas.jsx`) — five extruded volumes on a bounded plot with a saffron cornice and contact shadows, rendered in Canvas 2D. The video recreates this as a CSS/HTML isometric composition in the same palette.

## Share copy (draft)
Introducing DukaanQuest: an AI omnichannel growth copilot for traditional Indian retailers. One product record becomes a marketplace listing, a regional-language WhatsApp campaign, and a profit simulation — and the shop visibly levels up as you do it.

## Audio direction
- Role: warm corporate bed with restrained, motion-matched accents.
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (120.19 BPM) — upbeat enough to carry the sequential reveals, corporate enough for a screening audience.
- Music treatment: start at 0.0 at low-mid volume, hold flat under the middle, duck slightly under the status strip in Scene 3, then let one dry SFX ring over the music as the outro type lands. Fade out over the last 0.6s.
- Music cue guidance: bundled preset read from `assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.md`. Strong cues available in window: **16.02s, 17.02s, 17.52s, 18.02s, 18.52s, 20.02s**. Target **17.02s** for the Digital Town full-reveal and **18.02s** for the level-up type — the only two beat-locks, per the 1–3 lock budget. Beat grid for the five sequential town buildings and the four workflow labels: use consecutive beats but **snap to every other beat for readable text** (beats are 0.50s apart at 120 BPM, which is below the reading floor).
- Audio-reactive treatment: subtle. Let music energy make the saffron accent line and the town plot glow breathe slightly. No waveform bars, no equalizer visuals, no particles.
- SFX posture: sparse and professional. One soft click per sequential reveal, one dry announcement hit on the level-up, nothing else.
- Audio-coupled moments: hook lines landing in sequence; the five town buildings arriving one by one; the four workflow labels arriving one by one; the status strip ticking its four states; the level-up type landing on a strong cue.
- Restraint rule: no SFX on the hook's first two lines (silence makes the third line land), and no sound under the outro promise line except the single dry hit.

## Storyboard

### Scene 1 — "Three things he already has" — 4.0s
Ink-black field, saffron vertical rule on the left. Three lines arrive one at a
time, fast in, then held: **"Products."** (0.4s), **"Customers."** (1.3s),
**"A shop."** (2.2s). At 2.9s the turn: **"What's missing is the team."** in
saffron, holding to the end of the scene.
Sequential/interaction: yes — three text lines revealed one by one, each with a
soft key tick; the fourth line is a single confident SLAM after a 0.25s pause.
Audio intent: quiet and expectant; almost silence under the first three lines so
the fourth lands.
Audio-coupled idea: typed/revealed text with key ticks on the first three, then
silence-then-impact on the fourth.
Music: warm bed enters at 0.0, low volume.
Transition mood: soft → Scene 2.

### Scene 2 — "The town" — 6.0s
Crossfade into the isometric plot. The five buildings extrude up one at a time
on a bounded diamond plot, far-to-near, with contact shadows and saffron
cornices. Labels settle under each building: **"Your shop"**, **"Photo studio"**,
**"Packaging"**, **"Customer reach"**, **"What-if room"**. Above it, the real
journey headline **"From photo to profit"** and the stepper **"2/5 steps done"**
with the progress rail at 40%. Small mono line: **"55 XP to Digital Vyapari"**.
Sequential/interaction: yes — the five buildings rise one by one; the stepper
counter settles after the last one lands.
Audio intent: the reveal should feel earned and calm, not flashy.
Audio-coupled idea: one soft click per building as it lands; counter settles
last. Snap buildings to every other beat (0.5s beats are too tight for labels
to be read), and let the labels hold as a set once all five are up.
Music: bed continues, volume opens slightly.
Transition mood: soft slide → Scene 3.
Beat note: full-plot reveal beat-locked to the **17.02s** strong cue (±0.15s).

### Scene 3 — "One product through five engines" — 7.0s
The workflow. A single product card on the left; four labelled stages arrive in
sequence on the right, each showing the app's real screen copy:
**"What Gemini read"** → **"Same product, five marketplaces"** →
**"Send to 5 customers"** → **"What each option would earn you"** with the
simulator's **"Do this one"** button. Beneath, the honesty strip ticks through
four status tags: **LIVE**, **SANDBOX**, **STAGED**, **FALLBACK** — with the
small grounding line **"every integration reports its real state"**.
Sequential/interaction: yes — four stages arrive one by one, each paired with a
soft click; the status strip then ticks its four tags.
Audio intent: credible and steady. Music ducks slightly under this scene so the
status strip reads as the serious beat.
Audio-coupled idea: one click per stage; the four status tags tick in sequence
and the music dips under them.
Music: bed ducks ~20% for the duration of the status strip.
Transition mood: soft crossfade → Scene 4.

### Scene 4 — "Level up" — 3.0s
The town returns, now fully lit. The level-up type lands hard:
**"Mohalla Merchant → Digital Vyapari"** with saffron on the second half. Beneath,
the promise line holds: **"Create once. Sell everywhere. Retain. Reach. Simulate."**
Sequential/interaction: yes — the level-up line SLAMs in, then the promise line
settles underneath and holds to the end.
Audio intent: one dry announcement hit ringing over the music as the type lands,
then a clean fade.
Audio-coupled idea: single dry SFX on the level-up landing; promise line fades in
under it with no additional sound.
Music: bed ducks under the hit, fades out over the last 0.6s.
Transition mood: hold to black.
Beat note: level-up type beat-locked to the **18.02s** strong cue (±0.15s).

**Scene duration check:** 4.0 + 6.0 + 7.0 + 3.0 = **20.0s** (inside the 15–25s window).

**Music mood for this video:** upbeat-corporate, restrained.
**Audio summary:** a warm 120 BPM bed opens quietly, carries four sequential
reveals with sparse motion-matched clicks, ducks under the honest status strip,
lands one dry hit on the level-up, and fades to black.

---

## Grounding check (every on-screen claim traced to the project)

| On-screen copy | Source |
|---|---|
| "Products." / "Customers." / "A shop." / "What's missing is the team." | Framing problem, `PRD.md` §problem ("no IT team or studio"); framing/tone, invented but asserts nothing about the product |
| "From photo to profit" | `App.jsx` — journey title, verbatim |
| "2/5 steps done" | `App.jsx` — `doneCount`/`JOURNEY.length` |
| "55 XP to Digital Vyapari" | `App.jsx` — `${600 - xp} XP to Digital Vyapari` |
| "Your shop" / "Photo studio" / "Packaging" / "Customer reach" / "What-if room" | `DigitalDukaanCanvas.jsx` — building `label` fields, verbatim |
| "What Gemini read" | `GeminiPhotoStudio.jsx` — card heading, verbatim |
| "Same product, five marketplaces" | `OmnichannelCatalog.jsx` — section sub, verbatim |
| "Send to 5 customers" | `WhatsAppCRMHub.jsx` — `Send to ${n} customers` |
| "What each option would earn you" | `WhatIfSimulator.jsx` — section heading, verbatim |
| "Do this one" | `WhatIfSimulator.jsx` — recommended strategy button, verbatim |
| LIVE / SANDBOX / STAGED / FALLBACK | `App.jsx` — `health.services[key].classification` |
| "Mohalla Merchant" / "Digital Vyapari" | `App.jsx` — level titles, verbatim |
| "Create once. Sell everywhere. Retain. Reach. Simulate." | Core promise; "Create once. Sell everywhere." is the project's own catalog tagline in `HackSprint_Strategy_Blueprint.md` §4 |

**Privacy substitutions (Step 1 rule — nothing secret on screen):** the app's
demo persona name, phone numbers, and customer names in `mockData.js` are
deliberately **not** used. The video shows only screen-level labels and engine
names. No keys, tokens, internal hosts, or `localhost` URLs appear. The share
copy contains no merchant or customer names.