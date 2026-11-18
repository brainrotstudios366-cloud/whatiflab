"Space junk vs ONE dying ant" (66 s, trend #spacexstarship x11 / #spacejunk x5.6 / #asteroidimpact rising, TikTok Science 7d US; Starship Flight 15 (Nov 13 2026) booster catch called off).
Sources: engine.js, assets.js, scenes.js, tracks.js are identical to projects/ant (copy them from there). Build: ./build.sh (cat base.js sjhead.js sj.js > antmain.js). base.js = solar base.js, sjhead.js = first helper block of solar sf.js (GSPH, SUNG, tubeP, SPARK...).
Rounds: BOLT (FG slow-mo bolt from sky + crater SJ_CRATER), DEAD SATELLITE (BG fireball SJ_SAT with GSPH tail, impact + FG burning fragments), ROCKET BOOSTER (BG SJ_BOOST 70 m with landing-burn SJ_BCONE flames, dust ring, FG exhaust wind),
KESSLER (BG orbital debris band = streak() list, collision flashes + burst(), re-entry streaks), FINAL: SJ_FLECK paint fleck drifting to the ant's head.
New reusable helpers: streak(items,head,dir,len,width,col,alpha) – glowing additive streak; burst() streak debris; SJ_SAT satellite, SJ_BOOST booster, SJ_CRATER.
TIP: with the camera looking +z, screen-left is +x. BG objects must stay below ~20° elevation or they hide behind the title/HUD.
audio_sj.py: sfx bed from solar; normalize: ffmpeg acompressor+alimiter+loudnorm I=-13 -> mean ≈ -17 dB.
