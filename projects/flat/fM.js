// ================= FLAT EARTH: meshes (prefix F_) =================
// pancake Earth: unit sphere, top hemisphere coloured with an azimuthal-equidistant "flat-earth map"
// (north pole in the centre, Antarctica = ice wall around the rim), bottom = bare rock. Scale it [FR,FY,FR].
function fFlatMap(n){const rho=clamp(Math.hypot(n[0],n[2]),0,1);const th=rho*Math.PI*0.97;const ph=Math.atan2(n[2],n[0]);
  return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]}
function fRock(n){const v=fbm(n[0]*6+3,n[2]*6+n[1]*2,4);return mix3(HC('#3a2a20'),HC('#6b5038'),v)}
function fEarthCol(n){if(n[1]<-0.02)return fRock(n);const c=sEarthCol(fFlatMap(n));if(n[1]<0.12){const k=clamp((0.12-n[1])/0.14,0,1);return mix3(c,[0.9,0.94,1],k*0.9)}return c}
const F_EARTH=um(m=>sph(m,1,160,256,fEarthCol,0),0.3);
// dried-out version (oceans drained to the centre): ocean -> pale seabed
function fDryCol(n){if(n[1]<-0.02)return fRock(n);const d=fFlatMap(n);const v=sLand(d);let c=sEarthCol(d);if(v<0.5&&Math.abs(d[1])<0.8){const s=fbm(d[0]*8,d[2]*8+d[1]*3,3);c=mix3(HC('#9c8564'),HC('#c9b48a'),s)}
  if(n[1]<0.12){const k=clamp((0.12-n[1])/0.14,0,1);return mix3(c,[0.9,0.94,1],k*0.9)}return c}
const F_DRY=um(m=>sph(m,1,160,256,fDryCol,0),0.3);
// ocean dome (water material)
const F_DOME=um(m=>sph(m,1,48,96,n=>{const w=fbm(n[0]*6+1,n[2]*6+n[1]*3,3);return mix3(mix3(HC('#4fb4ff'),HC('#1a6fd6'),clamp(1-n[1],0,1)),[0.85,0.95,1],clamp((w-0.6)*2.5,0,0.6))},0),0.4);
// lava Earth (emissive cracks over dark crust)
function fLavaCol(n){const v=fbm(n[0]*5+2,n[2]*5+n[1]*3,5);const cr=Math.abs(fbm(n[0]*9+7,n[1]*9-n[2]*4,3)-0.5);
  if(cr<0.05)return mix3([1,0.9,0.4],[1,0.4,0.05],cr/0.05);return mix3([0.12,0.06,0.05],[0.35,0.12,0.06],v)}
const F_LAVA=um(m=>sph(m,1,96,192,fLavaCol,0),0.3);
const F_LAVAG=um(m=>sph(m,1,96,192,n=>{const cr=Math.abs(fbm(n[0]*9+7,n[1]*9-n[2]*4,3)-0.5);return cr<0.06?mix3([1,0.85,0.35],[1,0.35,0.05],cr/0.06):[0,0,0]},MAT.emis),0.3);
// hydraulic press plate (dark steel + cyan emissive stripes)
const F_PRESS=um(m=>{m.box([0,0,0],[4.2,0.35,4.2],HC('#2a2f3c'),0,0,HC('#3c4456'));for(let i=-3;i<=3;i++)m.box([i*0.55,-0.18,2.1],[0.25,0.04,0.02],[0.35,0.95,1],MAT.emis);
  m.box([0,-0.19,0],[3.8,0.03,3.8],HC('#1c2029'));m.box([0,1.6,0],[0.9,2.9,0.9],HC('#444c5e'),0,0,HC('#5a647a'));for(const s of[-1,1])m.box([s*1.6,0.3,0],[0.18,0.3,3.6],[1,0.85,0.3],MAT.emis)});
// local surface ground (green, gentle) + tilted tree
const F_GROUND=um(m=>{const r=rngG(8);for(let i=-30;i<30;i++)for(let j=-40;j<8;j++){const c=mix3(HC('#3f7a35'),HC('#5f9a45'),r()*0.7+0.15*Math.sin(i*0.7));m.quad([i*1.5,0,j*1.5],[i*1.5,0,j*1.5+1.5],[i*1.5+1.5,0,j*1.5+1.5],[i*1.5+1.5,0,j*1.5],c,0)}});
const F_TREE=um(m=>{tube(m,[0,0,0],[0,0.9,0],0.09,0.06,HC('#6a4a2c'),7);blob(m,[0,1.35,0],0.55,p=>mix3(HC('#2f7a35'),HC('#57b04a'),clamp(p[1]-0.9,0,1)),4,1.1,[8,12]);blob(m,[0.25,1.05,0.1],0.35,()=>HC('#3a8a3a'),6,1,[6,9])});
const F_ARROWM=um(m=>{tube(m,[0,0,0],[0,0.75,0],0.06,0.06,[1,0.35,0.55],8,MAT.emis);m.prism([0,0.75,0],0.16,0,0.28,10,[1,0.35,0.55],MAT.emis)});
