"What if you fell into Sagittarius A*?" – Puck narration, neptune-style engine.
engine.js/assets.js/scenes.js/tracks.js: copy from projects/neptune.
New reusable parts: bM1.js (BHDISK accretion disk, BHLENS billboard lensing ring, BHPR photon ring, ASTRO astronaut + VISOR),
bA.js bhItems()/astroItems()/bbM() billboard helper, bD1.js bhGlow (ring glow), telescope mask, clock, interiorBG, countdown timer.
GOTCHA: canvas arc(...,0,7,true) inside an evenodd/hole path draws a wedge artifact -> always use Math.PI*2.
VO: synthesize full script once, cut lines (vo/align_bh.py has line bounds + ST), A*/star merge done in post.
