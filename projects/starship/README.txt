"Starship vs ONE samurai" (66 s, vs-samurai format, 2026-11-19 evening). Trend: #spacexstarship rising x43 (TikTok Science 7d US) + Starship Flight 15 news (13 Nov 2026).
Sources: engine.js, assets.js, scenes.js, tracks.js from projects/samurai, sS.js from projects/planets. Build: ./build.sh -> smain.js. SUB=2. Samurai faces -z (o.yaw=PI in samAt).
Rounds: liftoff blast (particle wave from PAD splits in a V around him), booster caught on chopsticks (CHOP, TIP lazily from samItems(EV.catch)),
LOX venting -> frozen in ICEB glass block -> SHARDs + shaved ice (CUP+SNOW), ship reentry belly-flop with plasma glow -> sliced (SHIPA/SHIPB halves + CUTF glowing cut faces) -> fireballs,
FINAL: ONE hex heat-shield TILE falls (camera 'TIL' tracks it) -> BONK -> K.O.
New reusable parts (sR.js): cylC() banded cylinder with colour fn, BOOST (33 engines, grid fins, hot-stage ring), SHIP (black heat shield on local +z, flaps), TOWER (lattice + chopsticks arms + launch mount + tank farm around PAD),
shipM() for belly-flop orientation, CHOP, TILE, ICEB, SHARD, SNOW. sW.js: hgt() flattened around PAD + tree-free sight corridor to the pad.
Lessons: swordTrail must bail out when tip/base jump >260 px between samples (sheath pose snap drew giant translucent quads = "ghost samurai").
Huge objects above the hero: noShadow, else the 6.5 m shadow map blacks everything out. Looking straight up at a booster bottom = flat blue screen -> approach on a diagonal path and use a telephoto (fov 0.5).
audio_ss.py = nature helpers + rumble/hiss/fallwh.
