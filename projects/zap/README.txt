"What if ELECTRICITY disappeared for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-24). Render ~10–15 min.
Setup = same as projects/core (engine.js from flat; assets/scenes/tracks/sheet.py from neptune; partA0/partA1/b0/cS/cFX/bM0/qitems/bD0/bF from sgra;
sM.js+v0.js from sun; aM.js = lines 1-43 of spin/pA.js; aH.js from air; cH.js from core) + zT.js (meshes/timeline/scene) + zD.js (overlays).
New reusable parts (zT.js): ZL1/ZL2 night-side city lights split into two patchy halves (zLights), zFlick()/zFlickOn() stutter on/off,
 lightsA() per-scene lights alpha, eCam() night-side Earth camera (ZN = direction with the densest city lights, found by sampling),
 ZP_BODY/ZP_SCR 3D phone (screen emissive, tint to switch off), zPose() person collapse/get-up via jumperItems tilt.
zD.js: ecgPanel() animated ECG heart monitor (green beats / pink flatline, ecgOn()), boltPath()/drawBolt() 2D lightning + lightningFX(),
 phoneScreen() 2D UI mapped on the 3D phone screen with an affine setTransform from 3 projected corners (mpt()).
Audio (audio_zap.py): buzz() mains hum, pdown()/pup() power down/up, thunder(), ecgbeeps().
