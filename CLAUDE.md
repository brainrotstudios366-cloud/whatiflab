# The What If Lab – automatic TikTok video pipeline (PLAYBOOK)

Owner: TikTok account **The What If Lab** (handle formerly `elevatedliving12`). The owner writes German → talk to him in German. All on-screen text, narration, descriptions are **English**.
Goal: views, likes, followers, money (TikTok Creator Rewards → every video **61–75 s**, never under 60 s).

One automatic run = **ONE finished video** (+ texts), delivered to the owner. Follow the steps in order.
Never ask questions during an automatic run – decide and say in the delivery message what you decided.

---------------------------------------------------------------------------------------------------
## 0. Setup in a fresh container (2 min)
```
cd /home/claude/whatiflab && git pull -q            # repo already cloned by the run prompt
mkdir -p /home/claude/work
```
Tools that exist in the image: node 22 + playwright (`/opt/npm-tools/node_modules/playwright`, chromium w/ SwiftShader),
ffmpeg, python3 (numpy, PIL, scipy), fonts Inter + Noto Color Emoji. Nothing to install.

## 1. Trend research (ALWAYS first – the owner insists every video is based on current TikTok trends/memes)
a) **Official TikTok trend data** (TikTok for Business connector, advertiser `7707744734819893268` = account "TheWhatIfLab_adv", NO ads are ever run):
   `tool_execute` → `discovery_trending_list` with
   `{"advertiser_id":"7707744734819893268","discovery_type":"HASHTAG","date_range":"7DAY","country_code":"US","category_name":X}`
   for X in `ALL`, `SCIENCE`, `ANIMATION_AND_COMICS`, `COMEDY` (output is huge → it is saved to a file; summarize with `python3 tools/trends.py <file>…`).
   Optional: `discovery_video_list` (`hashtag_ids` from the list, max 10) → top videos of a rising hashtag = what format is working.
b) **Meme / format trends**: WebSearch "TikTok trends this week" + fetch 1–2 weekly-updated pages (socialpilot.co/blog/tiktok-trends, virlo.ai/blog/current-tiktok-trends). Prefer EARLY/rising, skip fading.
c) **Own performance** (Metricool connector, brand id `7705320`, network tiktok):
   `getAnalyticsDataByMetrics` metrics `["TKPO02","TKPO05","TKPO06","TKPO07","TKPO08","TKPO09","TKPO10","TKPO15"]` (date, desc, duration, views, likes, comments, shares, avg watch s) for the last 30 days.
   Double down on what works.
d) Read `history.json` – never repeat a topic from the last 30 entries; alternate formats.

### What works on THIS account (data 13.11.2026 – update in history notes when new data shows otherwise)
| Format | avg views | best |
|---|---|---|
| **"X vs ONE dying ant 🐜 – who wins?"** (huge threats vs the meme ant, rounds, ant survives absurdly, dies to something tiny) | ~1500 | Atomic bomb vs one dying ant: 4.4k |
| **"What if X disappeared for 5 seconds?"** (science sim, countdown, real consequences) | ~800 | Magnets: 3.6k, best watch time |
| "Every second X doubles…" | ~470 | |
| Story / lore | ~600 | |
| Pure learning explainers (antimatter, light) | ~240 | weakest |
Viewers watch only ~10–20 s on average → **the first 1–2 s must hook hard**, cut every 2–3 s, no slow intros, no city-street opener.

### Pick the idea
Combine a **rising trend / meme / rising hashtag** with a **format that works here**, always with real science behind it.
Examples: `#asteroidimpact` rising → "Asteroid impact vs ONE dying ant"; `#sagittariusa` → "What if you fell into Sagittarius A*?"; solar storm news → "What if a solar storm hit Earth for 5 seconds?".
Mix per day: ~2× "vs ONE ant/samurai" or "What if…disappeared" style, ~1× space/physics "What if…?" with Puck narration.
No copyrighted characters, no real people, no politics, nothing blackpill/violent-gore. Ant/samurai/Q are our own characters.

## 2. Facts
WebSearch every number/claim you will show. Hedge predictions ("might", "scientists think"). Keep a `sources` list for the delivery message.

## 3. Script & sound style
Two sound styles exist – choose per format:
- **vs / what-if-disappeared sims**: NO narrator. Big captions + round titles + SFX (owner adds music in TikTok). See `projects/ant`, `projects/nova`, `projects/samurai`, `projects/magnets`.
- **space/physics "What if…?" explainers**: narrator **Puck** (energetic). Script = 11–14 short punchy lines, hook line first ("It rains diamonds on Neptune. Real diamonds."), "Wait…what?!" moments, end with teaser + "Follow". See `projects/neptune` (`vo2/script.json`).

### Puck narration (Speko connector)
`audio_synthesize` body:
```
{"text": "<ALL lines, separated by blank lines>", "intent":{"language":"en"}, "voice":"Puck",
 "constraints":{"allowedProviders":{"tts":["google-tts"]}},
 "instructions":"Say this like an excited, energetic TikTok science creator: fast, punchy, amazed, with dramatic emphasis. Keep the same energy from start to finish."}
```
Synthesize the WHOLE script in ONE call (consistent voice). The wav is saved under the tool-results folder.
Split into lines: `ffmpeg -af silencedetect=n=-38dB:d=0.12`, map paragraph pauses to line ends (check syllables/sec ≈ constant ~4.3), cut each line with **input seeking** (`ffmpeg -ss A -to B -i full.wav -af "silenceremove…,areverse,silenceremove…,areverse,atempo=1.04"`; output seeking + areverse breaks!).
Word timings: `projects/neptune/vo/align2.py` pattern (syllable/pause groups) → `vo.js`. Then derive scene events (EV) from word times (e.g. explosion exactly on the word "lasers").
If Speko fails: retry once; if still down make a NO-narrator sim video instead (never block).

## 4. Build the video (3D WebGL engine)
Copy the closest project as template:
```
cp -r /home/claude/whatiflab/projects/<template> /home/claude/work/<slug> && cd /home/claude/work/<slug>
grep -rl "/home/claude/<template>" . | xargs sed -i "s#/home/claude/<template>#/home/claude/work/<slug>#g"
```
Templates: `ant` (ant model, rounds, bomb/asteroid/sun/black hole FX), `nova` (hypernova vs ant), `samurai`, `chess`, `cat` (vs format with many units),
`neptune` (best quality: planets, cutaway, molecules, diamonds, lab, 2D galaxy, mascot Q, word-by-word captions, Puck VO), `bread`/`lamp`/`house` (story),
`magnets`/`friction`/`oxygen`/`gravity`/`moon`/`tsunami` (what-if-disappeared sims), `anti`/`light`/`timed`/`tunnel`/`zero` (2D canvas explainers – weaker, avoid).
Engine facts (neptune-style, split files concatenated by `build.sh` into one main js loaded by the html):
- items `{mesh,M,tint,tintAmt,alpha,add,noShadow}`; MAT plain 0 / win .2 / water .4 / emis .6 / glass .8; `um(fn,smooth)` builds a mesh; `sph()`, `blob()`, `tube()`, `m.box(pos,size,col,mat,_,colTop)`.
- `renderScene(t)` → `renderGL(env,cam,shadowCfg,items,t)`; pass a far shadowCfg `{center:[0,-9999,0],radius:1}` when no shadows; `overlays(t)` draws the 2D canvas layer (captions, cards, glows) with `project(LASTVP,p)`.
- Global name clashes with engine globals break the page (seen: `C`, `TRUCK`, `house`) → prefix your globals.
- `partA0.js`: `const FPS=30,DUR=…,SUB=1` (SUB=1 keeps render ≈40 min for 75 s).
Style: "Neon Space Lab" – bg #05061A, cyan #5AF0FF, yellow #FFD84A key facts, pink #FF5A8A danger, green #7DFF9A results; Inter 900; captions 1–2 words, y≈1270, white + black stroke, key words yellow; Q mascot (glowing ?-atom with eyes, emissive) as reactions; stat cards top; flashes on hits; seamless loop to start.

## 5. SELF-REVIEW (mandatory – the owner relies on it, no human approves before posting)
`node rt.js <times…>` → `python3 sheet.py sheet.jpg <times…>` → Read the sheet. Check 12–16 frames across the whole video:
captions readable & not covering the subject, nothing clipped or overlapping, no black/empty frames, no NaN-invisible objects, facts on screen correct,
3D looks premium (smooth, emissive glows, no flat grey). Fix and re-check until you would be proud of it. Then render:
`./runall.sh > render.log 2>&1` via Bash `run_in_background` with **timeout 7200000** (default 30 min kills it; it resumes finished segments).
After render: contact sheet of 24 frames from the final mp4 + `volumedetect` (mean ≈ -17 dB, max ≤ -0.5). Fix anything wrong (re-render only affected segments).

## 6. Audio
Numpy SFX script pattern: `projects/neptune/audio_nep.py` (helpers whoosh, chime, boom, shing, risew, choir, beep, thud, tok, zap, jingle…; narration ducking; `alimiter` + `loudnorm I=-14`) → `sfx_norm.wav`, muxed by `runall.sh`.

## 7. Deliver
- Final file name `<slug>_<seconds>s.mp4`. Send with **SendUserFile** (status `proactive`) + **SendUserMessage** in German containing, ready to copy:
  English **Description**, **Hashtags** (5–8; include the rising trend hashtag you used), **Pin comment**, **Poll** (question + 2 answers), German music tip, best posting time, and the trend you used + sources.
  Remind: tick "AI-generated content" label in TikTok.
- (Auto-posting via Metricool needs a paid plan – NOT active. When the owner upgrades: push the mp4 to `media/` in this repo (repo must be public), use the raw URL in Metricool `createScheduledPost` with `tiktokData.isAigc=true`, then delete old media.)
- Append to `history.json`: `{date, slug, title, format, trend, hashtags, duration}`; commit & push:
  `git add -A && git commit -m "video: <slug>" && git -c push.negotiate=true push`. Never commit mp4/wav (see .gitignore).
- If you improved a reusable part (new model, helper, fix), save it under `projects/<slug>/` (sources only) so later runs can reuse it.
