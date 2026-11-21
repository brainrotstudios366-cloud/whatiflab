"What if ALL bacteria disappeared for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-21 midday). Render ~10 min.
Setup = same as projects/air (engine/assets/scenes/tracks from neptune; partA0(DUR=66)/partA1/b0/cS/cFX/bM0/qitems/bD0/bF from sgra;
sM.js+v0.js from sun; aM.js = lines 1-43 of spin/pA.js; aH.js from air) + gT.js (meshes/timeline/scene) + gD.js (overlays).
New reusable parts (gT.js): GB_ROD bacterium (capsule + pili + emissive helical flagellum + glowing bands, recolour via tint),
 GB_COC coccus chain, GB_SPI spirillum, GB_TYPES colour list, swarmItems() floating microbe swarm (microscope scene, envMic() teal fog env),
 GB_COW low-poly cow (head +x, yaw -0.55 faces the camera), GB_DEAD dying brown Earth (crossfade over SPE).
gD.js: specks(pts,t,tVanish,cols,size,a) glowing 3D microbe specks that sparkle-vanish, globeSpecks(), micOverlay() (glows, eyepiece vignette, 2 µm scale bar).
Audio: sparkle(), squish()/wobble() (microbe squelch), moo(), waves().
Facts: 38 trillion bacteria / 0.2 kg in a body (Sender et al. 2016); bacteria 70 Gt C vs animals 2 Gt C (Bar-On 2018) ≈ 35x;
Prochlorococcus ≈ 20% of biosphere O2 (Smithsonian); teaspoon of soil > people on Earth; germ-free mice live in sterile isolators.
