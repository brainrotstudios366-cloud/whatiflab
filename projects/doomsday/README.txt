"Every DOOMSDAY vs ONE dying ant" (66 s, trend #doomsday x2.24 rising (TikTok ALL 7d US) + #spacemystery x4.34 / Science top list, 2026-11-20).
Sources: engine.js, assets.js, scenes.js, tracks.js are identical to projects/ant (copy them). Build: ./build.sh (cat base.js sjhead.js dd.js > antmain.js). base.js/sjhead.js = same as projects/lhc.
Rounds: SUPERVOLCANO (DD_VOLC background volcano w/ emissive crater, MUSH/MUSHHOT plume scaled in meters, lava streaks, ash rain DD_ASHF, ash mound DD_ASHM buries ant -> *POP*),
GAMMA-RAY BURST (star flare in sky + bipolar jets, thin "aim" beam then fat additive beam column via streak(), ground RING, spin + tan), SNOWBALL EARTH (ice block from lhc),
VACUUM DECAY (GSPH bubble + 7 RING great circles expanding from BC, passes the camera -> E_VOID env, glitchFx() canvas RGB-slice overlay, o.void colour inversion on ant),
FINAL: ONE raindrop (DROP mesh slow-mo fall, splash ring + puddle, o.wet tint) -> K.O.
Hook: two HOTB lava bombs slam beside the ant (falling streak + burst + smoke).
Fix: glowAt() now skips rad<=0.5 (float -0 radius crashed createRadialGradient mid-render).
audio_dd.py: sfx from lhc + lava-bomb hook, eruption (nuke+roll+ash ticks), GRB zap, vacuum glitch, raindrop "bloop"; normalize: acompressor+alimiter+loudnorm I=-13 -> mean ≈ -18 dB.
