"Geminid meteor shower vs ONE dying ant" (66 s, trend #geminids NEW rising + #meteors x65 + #meteoros, TikTok Science 7d US, 2026-11-22).
Sources: engine.js, assets.js, scenes.js, tracks.js identical to projects/ant (copy them). Build: ./build.sh concatenates base.js sjhead.js + parts/*.js -> antmain.js.
Modular split (easier to re-skin than one big file): parts/p1.js (meshes, timeline R/EV, ROUNDS, envs), k_cam.js (camera+helpers, from mars),
p_bg.js (world + bg items), p_fg.js (foreground/ant), k_render.js, p_hud.js (shake, HUD cards, title, end), k_ov.js (pill/card/HP), k_glow.js, p_over.js (overlays), k_frame.js.
New reusable: buildGemTile() night meadow with grass blades; pine-forest + hills SF_BG; meteorFG() glowing 3D meteor head+tail; meteors2D() canvas meteor
shower radiating from a radiant (rate per time, cheap, looks great); fireball crossing bg sky + explosion; PHAE asteroid with baked lighting + lava cracks
(MAT.glass = unlit -> bake shading into vertex colours, otherwise far objects look fogged/flat); PCRUMB debris trail; envs E_NIGHT/E_DEEP/E_GREEN/E_HOT with sunSize 0.45 (env.sun = moon disc in sky!).
Lessons: env.sun draws a disc in the sky -> keep all envs' sun dir identical in a round or the "moon" jumps; portrait horizontal half-FOV is only ~15° -> keep bg objects within ±25% side offset.
audio_gem.py: from audio_mars.py; meteor whooshes, fizz sizzle, sonic boom, storm of whooshes, Phaethon drone. Normalize: acompressor(-22dB,4:1)+loudnorm I=-11+alimiter 0.88 -> mean -18 dB, max -0.9.
