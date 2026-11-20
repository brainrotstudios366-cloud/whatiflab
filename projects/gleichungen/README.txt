YouTube LONG video (German, 16:9 1920x1080) "Gleichungen umstellen – der Waage-Trick" (6:22) + 3 Shorts (2026-11-20).
New channel idea: German school-math explainer ("Mathe-Lücken schließen"), Puck voice in German (intent de-DE).
engine.js: copy from projects/neptune and change line 3 to: const W=window.VW||1080,H=window.VH||1920;  (g.html sets VW/VH=1920x1080)
build.sh concatenates vo.js g1..g6 -> gmain.js. rt.js/rscene.js use require('playwright'), viewport 1920x1080.
Parts: g1 meshes (XBOX crate, WGT weight, BALL balloon=-1, scale SBASE/BEAM/PAN, FLOOR rings, Q mascot)
       g2 SCALE sim: mkScene/addItems/setOut, torque -> spring-simulated tilt (precomputed), side badges ("x + 5"), group tinting for division
       g3 2D: drawEq (tokens, ^y/^p/^g colors, fractions a/b, align on '='), cards, stamps (check/cross), pills
       g4 timeline: scale scenes S1..S4, modes (board/scale), camera, Q expressions ; g5 overlay elements (steps() list with "| op" column) ; g6 overlays/chapter cards/frame
VO: Speko synth >~1000 chars times out (60s) -> synthesize in 7 chunks (~700 chars), transcribe each (language de, word_timestamps) -> vo/lines_t.py -> assemble.py (gaps, 11s pause for exercises).
Render: 382 s = 11474 frames, 12 segments x 3 workers ~ 20 min. Audio: audio.py (sfx + Am-F-C-G pad, ducking) -> loudnorm.
Shorts: shorts.sh = cut(s) of the long mp4 -> vertical 1080x1920 (blur bg, title via textfile, progress bar).
