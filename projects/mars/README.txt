"Mars vs ONE dying ant" (66 s, trend #marte x4.52 rising (rank 51) + #exploracionespacial x10.8 + #spacexstarship x44, TikTok Science 7d US, 2026-11-21).
Sources: engine.js, assets.js, scenes.js, tracks.js identical to projects/ant (copy them). Build: ./build.sh (cat base.js sjhead.js mars.js > antmain.js). base.js/sjhead.js = same as projects/doomsday.
Template = projects/doomsday (same timeline R/EV, camera, HUD), re-skinned for Mars:
- buildMarsTile()/MTILE: red fbm ground + rocks + small crater rims (replaces grass/road TILE); marsCol(x,z) colour fn reused for the far BG plane.
- SF_BG: Mars plains, crater rims, boulders, two arcs of mesas (prisms); DD_VOLC recoloured red w/o lava = Olympus Mons backdrop.
- Envs: butterscotch day, dust-storm (fogD 900), radiation glare, cold night/ice, BLUE Mars sunset (E_DUSK), near-space sky (E_VOID), Mars dawn.
- R1 dust storm wall (USPH blobs rolling toward camera) + MDUST mound; R2 Sun (SUNG) + solar-storm streaks + green radiation beam;
  R3 ice block (from doomsday); R4 ALMOST NO AIR: air streaks leaving, o.puff (ant inflates, scale around body), boiling bubbles at mouth;
  FINAL: ONE MGRAIN dust grain falls -> *POOF* -> o.green sick tint -> K.O.
- New antItems post-tints: o.dust (red dust), o.green, o.puff.
audio_mars.py: from audio_dd.py; storm wind instead of nuke, geiger ticks for radiation, thin-air hiss fade + boiling blips, dust-grain tick+poof.
Normalize: acompressor(-22dB,4:1)+loudnorm I=-11+alimiter 0.88 level=false -> mean -17.8 dB, max -0.9 dB.
