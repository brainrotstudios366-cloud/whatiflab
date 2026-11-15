"What if Earth stopped spinning for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-15 midday).
engine.js/assets.js/scenes.js/tracks.js: copy from projects/neptune. partA0(DUR=66)/partA1/b0/cS/cFX/bM0/qitems/bD0/bF: copy from projects/sgra.
sM.js + v0.js: copy from projects/sun (sLand/sCloud/SSUNS...).
New reusable parts (pA.js):
 SPE  Earth without baked clouds + SPCLOUD separate flat-disc cloud shell (rotate independently: "air keeps moving")
 SPE2 "Earth never spins": polar oceans + equatorial mega-continent (crossfade with alpha)
 SPTOWN suburban street (houses/trees/road) + SPCAR[4]/SPBUS/SPTREE/SPCRATE/SPBIN/SPBALL loose props (flying-off list SPFLY)
 SPCOAST coast + skyscraper city, SPWATER, SPWAVE extruded mega-wave with tapered ends
 SPISS small space station; spinAng()/cloudAng() spin-stop timing.
pD.js: globePt() (lat point facing camera), pin(), spinArrows() equator arrows, windStreaks() on globe, speedLines(), bigTitle().
