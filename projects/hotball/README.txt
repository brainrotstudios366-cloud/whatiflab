Sources: engine.js, assets.js, scenes.js, tracks.js are identical to projects/ant (copy them from there).
"Red-hot ball, lava, lightning & a kaiju vs ONE dying ant" (66 s, trend #hotball + #kaiju).
New reusable parts in antmain.js: HOTB red-hot glowing ball (+hotBall() glow/ground-glow/HOTPTS screen glow), tongs,
sphC() sphere with colour function, tileable LAVA sheet (crust plates + glowing cracks, 40-unit tiles, cooling via tint),
lightning drawBolt()/boltA() flicker, KAIJU (KBODY/KSPK emissive spikes/KLEG walking legs, buckle + fall + dust, square-cube-law gag),
SNOWF snowflake (face camera: pitch ~1.4 + in-plane spin), ICE cube freeze, antItems o.soot / o.frost colour overrides.
audio_hot.py: sizzle(), roar(), thunder(), crack() + helpers from aliens.
