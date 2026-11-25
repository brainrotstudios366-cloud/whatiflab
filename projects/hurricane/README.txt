"Category 5 HURRICANE vs ONE dying ant" (66 s, vs-ant, 2026-11-25). Trend: #hurricane (x4.03 rising, TikTok ALL 7d US) + #weather (x3.10).
Sources: engine.js, assets.js, scenes.js, tracks.js identical to projects/ant (copy them). Build: ./build.sh -> antmain.js. Template = projects/gem (modular parts).
Rounds: R1 252 km/h winds (pose 'cling', then blown off-screen & falls back in = 'ants survive any fall'); R2 STORM SURGE (HWATER slab MAT.water rising + surge front
with foam crest, ant pops up riding a LEAF raft); R3 LIGHTNING (bolt3D(): jagged additive streak polyline + branches, scorch ring, o.soot, smoke wisps);
R4 THE EYE (cloud CEILING fades inside r<3400, WALL ring of HCLOUD blobs = stadium effect, camera tilts up); FINAL: ONE gentle breeze (leaf drifts by, ant wobbles & tips over).
New reusable: HCLOUD baked-shade storm cloud blob (unlit glass, tint toward env.hor by distance), CEIL/WALL cloud fields rotating around storm centre,
windAt()/rainAt() drivers, 3D wind streaks + tumbling LEAFs, rain2D() slanted canvas rain, bolt2D()/bolts2D() distant sky lightning + env flash (BOLTS list),
wind-bent grass tile with puddles. audio_hur.py: storm wind bed following windAt, rain hiss, thunder per bolt, splash/bubbles, eye choir + birds, snore, breeze.
Normalize: acompressor(-22dB,4:1)+loudnorm I=-11+alimiter 0.88 -> mean -17.5, max -1.8.
Lesson: big full-screen env flash on the strike washed the bolt out -> keep E_BOLT mix ≤0.5 and overlay flash ≤0.4 so the 3D bolt stays visible.
