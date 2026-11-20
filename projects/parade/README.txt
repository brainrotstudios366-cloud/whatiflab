"What if ALL the planets lined up?" – Puck narration, 66 s (2026-11-20 midday). Trend: #planetaryalignment / #alineacionplanetaria rising + real 4-planet parade 13–22 Nov 2026.
Copy into /home/claude/work/parade: engine.js from projects/flat; assets.js/scenes.js/tracks.js/sheet.py from projects/neptune; partA1/b0/cS/cFX/bM0/qitems/bF/rscene from projects/sgra; sM.js from projects/sun.
Render only ~10 min (2 workers).
New reusable parts:
 pM.js: P_JUP hi-res Jupiter (turbulent bands + Great Red Spot), P_IO + P_IOG (Io with emissive volcanoes), P_VEN, P_MER, P_URA, P_WATER, P_GROUND night hills + P_TREE silhouettes.
 pA.js: planet line-up along the z axis (fits 9:16: line runs vertically on screen, Sun at the far end), scatter->snap into line,
        pre-dawn sky with 2D planet dots on the ecliptic (skyDots), true-scale giant Jupiter in the sky + Moon reference ring,
        tidal bulge (additive UEMIS ellipsoid), Earth orbiting Jupiter with trail, lava Earth (P_LAVA/P_LAVAG), hair-vs-tide compare box, tide gauge, social "internet says" chips.
VO: whole script synthesized in one Speko call (62 s) -> used unchanged (natural pauses) -> audio_transcribe words -> vo/tw.txt -> vo.js. No cutting needed.
Bug to avoid: flash(a*(1-seg(t,e,...))) BEFORE e is a constant flash -> guard with if(t>=e).
