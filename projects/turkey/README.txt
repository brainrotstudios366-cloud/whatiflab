"Everything vs ONE turkey" (66 s, trends #disguiseaturkey x4.65 (Animation 7d US) + #blackfriday rising + Leonids peak Nov 17).
Build: copy engine.js, assets.js, scenes.js, tracks.js from projects/ant, then `cat tk_head.js tk_trex.js tk_main.js tk_fx.js > tkmain.js` (tk.html loads tkmain.js).
New reusable parts: TURKEY model tkItems()/tkState() (fan open/close TFEATH x15, folded TWING / open TWINGO wings, snood, wattle, cartoon eyes+lids,
gobble head-shake, run/fly/tumble poses, lookUp, shiver, 'disg' = ant disguise: antennae+bandage+matchstick crutch), ell() ellipsoid with colour fn,
FARM tile (dirt path, fence, grass blades, 40-unit tiles in METER scale), pumpkins PUMP, hay bales HAY, shopping CART + 2D price tags (TAGS),
tornado TORN funnel + orbiting debris, T. rex (kaiju mesh recoloured: TXBODY/TXLEG), giant FORK, rain streaks + puddles (MAT.water), poof cloud,
spd()/DTAB integrated ground-scroll speed (run/stop/fly), real ant cameo via antItems scaled 0.42.
audio_tk.py: gobble() synth (pulsed band-passed saw), rattle() carts, windroar(), rainsnd(), stepz().
