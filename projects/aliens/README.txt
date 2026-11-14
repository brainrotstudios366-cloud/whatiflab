Sources: engine.js, assets.js, scenes.js, tracks.js are identical to projects/ant (copy them from there).
"Alien invasion vs ONE dying ant" (65 s). New reusable parts in antmain.js:
UFO saucer mesh (UFO), mothership (MSHIP), emissive cylinder/cone/box (ECYL/ECONE/EBOX) for lasers & tractor beams,
glass raindrop (WDROP), BIGROCK, mixEnv() env blending + E_NIGHT/E_BURN/E_GRAV/E_RAIN presets,
distAt() to stop ground scrolling during stand-still scenes, ant pose 'lift' (holds object overhead),
animated big-number counter card (fmtBig), card() pop helper, green laser bolts with ground scorch.
audio_ali.py: hum() UFO drone, theremin(), pew(), zap(), chime().
