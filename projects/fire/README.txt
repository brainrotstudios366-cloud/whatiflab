"What if FIRE disappeared for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-26, Thanksgiving). Render ~11 min.
Setup = same as projects/zap (engine.js from flat; assets/scenes/tracks/sheet.py from neptune; partA0(DUR=66)/partA1/b0/cS/cFX/bM0/qitems/bD0/bF from sgra;
sM.js+v0.js from sun; aM.js = lines 1-43 of spin/pA.js; aH.js from air; cH.js from core) + fT.js (meshes/timeline/scene) + fD.js (overlays). build.sh concatenates.
New reusable parts (fT.js): FK_ROAST roast turkey mesh (fEll ellipsoids, drumsticks with bones), FK_PLATE (garnish), FK_TABLE (dinner room: wall, table, cloth, runner,
 pumpkins fPump(), 4 candles FCAND_*, candleTip(i)), envRoom(L) candle-lit room light (warm<->cold blue), FOV_BODY hollow oven + kitchen (cabinets, tiles, 4 burners),
 FOV_WIN glass (alpha), FOV_IN emissive interior, FSUN granulated emissive sun, fLights(part) city-light split 60/40, FFIRES globe fire points, tCam() lerp camera,
 cars on SPTOWN road (FCARS, carX coast-to-stop, EV keeps driving).
fD.js: flame2D() 2D candle/gas flame (orange or blue) with glow, smoke() wisps, pxSize(), tableFX (candles + match relight), ovenFX (blue gas flames, burner rings,
 thermometer tag), carsFX (exhaust puffs, ENGINE OFF / EV tags), earthFires(), sunFX (corona + fusion tag), youFX.
audio_fire.py: crackle() fire crackle, blowout(), gas() hiss, car_eng(), sputter(), match().
