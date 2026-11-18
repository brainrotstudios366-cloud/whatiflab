"Nature's hardest hits vs ONE samurai" (66 s, vs-samurai format, 2026-11-18 evening). Trend: #ufc/#mma rising (TikTok ALL 7d US, x1.84/x1.63) -> "nature's hardest hitters" battle.
Sources: engine.js, assets.js, scenes.js, tracks.js identical to projects/samurai (copy them from there). Build: ./build.sh -> smain.js. SUB=2. Based on projects/planets (sS/sW unchanged).
Rounds: mantis shrimp punch blocked by low-guard blade (IMP = point on blade computed from samItems(EV.punch)), pistol shrimp snap (cavitation bubble GSPH + RING shock) toasts dango,
saltwater croc (CROC body + CHEAD/CJAW hinged at CR_HINGE + chained CTAIL segments) jaws jammed open with a saya STICK, sperm whale (WHALE) clicks = cyan RING ripples on the sea (draw at y=-0.5, sea is -0.55),
FINAL: ONE mosquito (MOSQ + WING flapping + MBLOOD belly after bite), samurai misses 3 slashes, mosquito lands on forehead (use tp(S.Hm,[0.02,0.19,0.26]) - S.head is NOT the face), he slaps himself -> K.O.
New reusable parts (sO.js): ell() ellipsoid with colour fn + tilt, RING annulus, MANTIS+MARM, PISTOL+PCLAW+PDACT, CROC/CHEAD/CJAW/CTAIL, STICK, WHALE, MOSQ/WING/MBLOOD, DANGO/TOASTM. sF.js: lookZ(pos,dir,s).
Lessons: anything a camera shot depends on that is computed lazily (PSH, IMP) must be initialised at the top of renderScene, otherwise the first sub-frame of a segment uses defaults -> double exposure.
Backlit sunset (sun towards +z) turns big creatures into black blobs -> put the sun behind the camera.
audio_nat.py = planets helpers + buzz() (mosquito) + snapS() (pistol shrimp).
