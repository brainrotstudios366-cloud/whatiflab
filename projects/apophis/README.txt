"What if Apophis hit Earth?" – Puck narration, 66 s (2026-11-16 midday). Render took only ~10 min.
engine.js/assets.js/scenes.js/tracks.js: copy from projects/neptune. partA1/b0/cS/cFX/bM0/qitems/bD0/bF/rscene/rt: copy from projects/sgra
(bD0: replace KEY set). sM.js: copy from projects/sun (SEARTH, SLIGHTSN, SLS).
New reusable parts:
 aM.js: A_APO bilobed boulder asteroid, A_GSAT geostationary satellite (+A_LED), A_TOWER hologram skyscraper (443 units-scale),
        A_PROBE OSIRIS-APEX-like probe, A_GROUND night hills + A_TREE (naked-eye night-sky scene).
 aA.js: flyby path apPath(), heroCam(), satRing(), impact fall fallA(), asteroid-quake dust puffs.
 aD.js: earthGlow() atmosphere rim, sunFlare(), sphCircle() circle on a sphere surface (shock rings / damage radius),
        skyDot() moving bright dot w/ trail, radar arcs, vignette/flash, end card.
VO ALIGNMENT (much easier than silencedetect): Speko audio_transcribe(audio_url=<synth url, valid 15 min>, word_timestamps=true)
 gives word times -> vo/tw.txt (word start_ms end_ms|...) -> cut at energy minima between lines, insert gaps -> vo_full.wav + vo.js.
