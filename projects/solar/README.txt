"Solar storm vs ONE dying ant" (66 s, trend #geomagneticstorm x6.07 / #spaceweather x4.23 / #tormentasolar x20.6 rising, TikTok Science 7d US, Nov 2026 G1 storms in the news).
Sources: engine.js, assets.js, scenes.js, tracks.js are identical to projects/ant (copy them from there). Build: ./build.sh (cat base.js sf.js > antmain.js). base.js = xmas base.js.
Rounds: X-CLASS FLARE (big unlit SUNG sun in BG pass at 30 km + opaque FLOOP flare loops + whiteout env E_FLASH), CME (additive GSPH plasma cloud flying from sun, deflected by cyan FLINE field-line arcs),
GEOMAGNETIC STORM (night + AUR aurora, BG power-line poles/wires/transformer SF_BG, street-lamp + village window glows (BGPTS projected with LASTBGVP), transformer sparks + explosion -> blackout),
CARRINGTON 1859 (red aurora mix, snapping wire falling next to ant with sparkBurst()), FINAL: magnifying glass MAG_RIM/MAG_LENS + focal dot crawling to the ant, 2D beam triangle overlay.
New reusable parts: tubeP() tube along polyline, GSPH unlit (MAT.glass = unfogged) sphere for suns/halos, SUNG textured sun, FLOOP/FLINE arcs, BCONE, SPARK streak + sparkBurst(), BGPTS glow list for the BG pass, poleGeo() power line.
TIP: MAT.glass items are unlit AND unfogged -> perfect for objects in the far sky (sun, plasma). Additive colours vanish on a bright sky -> use opaque (no add) for flare loops.
audio_sf.py: electric() buzz+crackle, plasma() rising roar, choir() + helpers from xmas.
