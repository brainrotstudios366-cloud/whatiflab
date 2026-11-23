// ---------- render ----------
let LASTBGVP=null;
function renderScene(t){const tt=sceneT(t);const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  LASTBGVP=renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:2,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const KEYL=V.norm([0.55,0.8,-0.6]);const fenv=Object.assign({},env,{fogD:900,sun:V.norm(V.add(V.sc(env.sun,0.3),V.sc(KEYL,0.7))),sky:mix3(env.sky,[0.55,0.6,0.8],0.35)});
  const sd={center:[0,0,-0.4],radius:4.5};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:4000},sd,fitems,tt,{noClear:true,noSky:true})}
