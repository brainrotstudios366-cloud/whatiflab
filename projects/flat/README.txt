"What if Earth was FLAT?" – Puck narration, 66 s (2026-11-19 midday). Trend: #flatearthsociety / #flerf rising (TikTok Science 7d US).
Copy into /home/claude/work/flat: assets.js/scenes.js/tracks.js/sheet.py from projects/neptune; partA1/b0/cS/cFX/bM0/qitems/bF/rscene/rt from projects/sgra
(rt.js: bh.html -> flat.html); sM.js from projects/sun. Everything else is here.
ENGINE FIX (engine.js here, reusable!): non-uniform scale lighting. Vertex shader now uses `uniform vec3 uNS` -> vN=mat3(uM)*(aN*uNS);
 items may pass `ns:[1/sx²,1/sy²,1/sz²]` (helper nsOf(s) in fA.js) so squashed/stretched meshes (pancake planet, domes) get correct normals. Default [1,1,1] = old behaviour.
New reusable parts:
 fM.js: F_EARTH pancake Earth (azimuthal "flat-earth map", north pole centre, ice-wall rim, rock bottom; scale shp(1)), F_DRY (oceans drained -> seabed),
        F_DOME ocean dome, F_LAVA + F_LAVAG (molten planet + emissive cracks), F_PRESS hydraulic press plate, F_GROUND/F_TREE day surface.
 fA.js: shp(f) volume-preserving sphere<->pancake morph (squash hook + collapse back), gravity-arrow field on a disc, flow arrows, 2D storm spirals,
        dipole field lines, solar-wind streaks, tilted walker on a slope (jumperItems tilt) for "uphill forever", planets line-up, seamless loop (press re-enters).
VO: one Speko synth (55.6 s) + audio_transcribe word times -> vo/tw.txt -> gaps inserted at energy minima between lines (0.4–0.6 s) -> 61.2 s + 4.8 s end card.
