"Christmas vs ONE dying ant" (66 s, trend #christmas (ALL top-5, rising) + #adventcalendar x5.56 / #christmasdecor rising, TikTok 7d US).
Sources: engine.js, assets.js, scenes.js, tracks.js are identical to projects/ant (copy them from there). Build: ./build.sh (cat base.js xm.js > antmain.js).
base.js = quantum base.js + ant Santa hat (o.hat / o.hatK, mesh XM_HAT defined in xm.js).
Rounds: BLIZZARD -40° (horizontal snow streaks, E_BLIZ env mix, glass ice block XM_ICE + flying shards), GIANT CHRISTMAS TREE (xmTree() builder with ornaments,
string lights list for 2D glows, emissive star XM_STAR; ant falls from top with tumbling + camera follow), AVALANCHE SNOWBALL (rolling SNOWB from behind, lens snow-splat overlay, XM_PILE),
SANTA'S SLEIGH at ~1,000 km/s (XM_SLEIGH + fiery trail, fireball, ground shock ring, raining GIFTS giftGeo()), FINAL: ONE snowflake (XM_FLAKE 6-arm emissive, slow-mo fall, squash K.O.).
New reusable parts: snow world BGS (snowy pines, houses w/ glowing windows + light strings, big town tree), buildSnowTile() (footpath, mounds, light string in snow),
seg2() two-sided flat strip, snowFall()/blizzard() particles, puff(). audio_xm.py: bells() sleigh bells, glass() shatter, ice_crack(), wind(), roll().
NOTE: FG fog (fogD 900) whitens anything >~800 units away – raise fogD for sky objects (done in R4).
