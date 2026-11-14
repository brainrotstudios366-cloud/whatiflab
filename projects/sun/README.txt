"What if the Sun disappeared for 5 seconds?" – no-narrator what-if sim, 66 s.
engine.js/assets.js/scenes.js/tracks.js: copy from projects/neptune. partA0/partA1/b0/cS/cFX/bM0/qitems/bD0/bF: copy from projects/sgra (set DUR in partA0).
New reusable parts:
 sM.js: SEARTH (procedural Earth w/ baked clouds, smooth coasts, ice caps), SLIGHTSN/SLIGHTSD city-light meshes split by
        local day/night side (SLS = Earth-local sun dir) -> show night lights normally, both when the Sun is gone,
        SMOONE emissive full-moon billboard (dim with tint), SSUNS granulated emissive sun, SMARS/SJUP/SSAT(+ring)/SNEPM,
        SPANEL solar panel + legs + LED, SGROUNDM, SPROBE (Voyager-like probe).
 sA.js: earthItems() (yaw so that day side faces any sun direction via yawFor()), darkAt() lighting switch,
        solar-system log-scale map AU2R + expanding "darkness ring" timed by WKEY.
 sD.js: CAPS caption list (^yellow ~pink), roundBar() "SECOND n/5" progress bar + big round titles, sunGlow() corona rays,
        poofFX(), ghostSun(), atmo() rim, lightBeam(), circ3/strokePts projected orbits, drawProx() 2D star map.
GOTCHA: engine/scenes already define EARTH, CLOUDS, SATRING, seg-like names -> all meshes prefixed S.
