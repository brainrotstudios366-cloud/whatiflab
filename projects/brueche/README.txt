YouTube LONG video (German, 16:9) "Brüche addieren – der Fehler, den fast alle machen" (8:01) + 3 Shorts. 2026-11-22.
NEW DESIGN "Karoheft" (chosen by owner, draft in projects/design_v2): pure 2D canvas, no WebGL, ~15 min render for 8 min.
- One continuous notebook page; sections stacked vertically (SECH/SECY), camera scrolls smoothly at chapter starts (camTo) -> no hard cuts.
- Handwriting font Caveat (fonts/), pen-reveal L->R with pen dot; fractions F(n,d) as tokens; hand-drawn jittered lines (hline/hrect/hcircle).
- Elements: write(), note(), marker() (yellow highlighter, drawn under), bar() fraction strips with splits/merges/fills, pizza(), arrow() with label (·3), cross/check, boxE.
- Fixed colour meaning: ink blue text, red = operation/mistake, green = result; orange=1/2, blue=1/3 pieces.
- Captions bottom (sentence-level, char-proportional timing), chapter tag top-left.
VO: one Speko synth call PER LINE (55 calls, sequential order kept by file timestamps) -> no alignment needed; word times by char proportion (Wd(l,'word',occ)).
Audio: pencil scratch per write (dump.js exports WRITES), page rustle on scroll, chime on check/box, soft buzz on cross, warm keys pad, ducking.
Shorts: shorts.sh -> portrait paper background (paper_v.png made in python), inset video scaled 1240 & cropped, Caveat titles.
