"What if Earth's AIR disappeared for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-18 midday). Render ~9 min total.
Setup: engine.js/assets.js/scenes.js/tracks.js from projects/neptune; partA0(DUR=66)/partA1/b0/cS/cFX/bM0/qitems/bD0/bF from projects/sgra;
sM.js+v0.js from projects/sun; aM.js = lines 1-43 of projects/spin/pA.js (SPE, SPCLOUD, SPTOWN, SPCOAST, SPWATER...). aH.js = pD.js lines 2-7,25-38 (helpers).
New reusable parts (aT.js): ARJET airliner mesh (tube fuselage, swept wings via arFlat(), engines, fin) + ARENG engine points,
 ARDRY dead airless Earth (dry basins/salt), ARICE ice-floe patches on SPWATER, envVac() vacuum sky (black, stars, harsh shadows),
 mixEnv() lerp between two env objects (blue sky -> black), airAmt(t) controlling atmosphere glow/clouds.
aD.js: atmoA() atmosphere rim with alpha, meteors() (impact or burn-up streaks on globe), bubbles(), steam() soft 2D steam glows
 (better than PUFF meshes, which look like rocks from far), muteIcon(). GOTCHA: arc() with radius from (t%x) can go negative -> guard.
