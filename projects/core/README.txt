"What if Earth's CORE disappeared for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-22 midday). Render ~10 min.
Setup = same as projects/germs: engine.js from projects/flat (uNS fix); assets/scenes/tracks/sheet.py from neptune; partA0(DUR=66)/partA1/b0/cS/cFX/bM0/qitems/bD0/bF from sgra;
sM.js+v0.js from sun; aM.js = lines 1-43 of spin/pA.js; aH.js from air. cH.js (here) = flat helpers (pRad, strokePts, arrow2, sphereGlow, F_LAVA/F_LAVAG, fieldLines).
New reusable parts (cT.js): CUTAWAY EARTH – CE_SHELL (spEarthCol sphere minus the x>0,z>0 quadrant), CE_MANT (emissive layered wedge crust/mantle),
 CE_CORE (outer+inner core wedge, scalable to make it vanish/return), CE_CAV (dark hollow cavity), CE_ROCK falling chunks (rockItems), ceLayer(r) colours,
 cutCam(d,yo,sw) camera looking into the cut, Earth+Moon space layout (CE_EP/CE_MP), jumpAt() floaty jump loop for jumperItems.
 NOTE: don't draw SPCLOUD over a cutaway (it covers the cut faces).
cD.js: coreGlow() (core glow / pink hole rim), burst() vanish/return ring+stars, layerTags(), gArrow() gravity arrow, jumpLines(), compass() spinning compass,
 dipole() collapsing field lines, gravRing() light-speed gravity ring Earth->Moon with timer pill, bellRings(), fallArrows().
Audio: rumble(), lava(), bell() (Earth rings), warble().
