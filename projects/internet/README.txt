"What if the INTERNET disappeared for 5 seconds?" – no-narrator what-if sim, 66 s (2026-11-28, Cyber Monday tie-in). Render ~8 min.
Setup = same as projects/zap/fire (engine.js from flat; assets/scenes/tracks/sheet.py from neptune; partA0(DUR=66)/partA1/b0/cS/cFX/bM0/qitems/bD0/bF from sgra;
sM.js+v0.js from sun; aM.js = lines 1-43 of spin/pA.js; aH.js from air; cH.js from core) + nT.js (meshes/timeline/scene) + nD.js (overlays). build.sh concatenates.
New reusable parts: NHUB/NLINK procedural data hubs + links on the globe (night side), slerpN(), linkA() per-link flicker/patchy return,
 linksFX(t,cm,'idea'|'sea'|'back') glowing arcs (raised or hugging the surface) with travelling data pulses, deadLinks() dashed pink dead routes,
 GPS orbits gpsPos()/occl() sphere-occlusion test, satGlyph() 2D satellite, gpsFX() sat->user signal lines + "YOU ARE HERE",
 bubblesFX() chat bubbles turning "not delivered" around the jumper, phone UI modes on the 3D phone: uiFeed (scrolling feed, hearts), uiOffline (wifi-off + spinner),
 uiShop (Cyber Monday product + BUY NOW tap/spinner/PAYMENT FAILED), uiOk (order confirmed + confetti); pCam() phone camera; captions move to y=1440 in phone scenes.
Audio (audio_net.py): chatter() data blips, notif(), errb() error beep.
