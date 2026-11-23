// ===================== SOLAR STORM vs ONE DYING ANT =====================
// ---------- new meshes ----------
// unlit (glass-material) sphere: unfogged, tintable -> sun, halos, plasma (use add:1)
const GSPH=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.glass,1,[16,24]));
const SUNG=um(m=>sphC(m,[0,0,0],1,p=>{const n=vnoise(p[0]*6+2,p[1]*6+p[2]*3);return mix3([1,0.55,0.12],[1,0.9,0.55],clamp(0.2+n*0.9,0,1))},[24,36],MAT.glass));
// tube along a polyline
function tubeP(m,pts,rf,colF,mat,seg){seg=seg||8;let prevRing=null;for(let i=0;i<pts.length;i++){const p=pts[i];const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)];const d=V.norm(V.sub(b,a));const tmp=Math.abs(d[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(d,tmp)),y=V.cross(x,d);const f=i/(pts.length-1);const r=rf(f);
  const ring=[];for(let j=0;j<seg;j++){const an=j/seg*TAU2;ring.push(V.add(p,V.add(V.sc(x,Math.cos(an)*r),V.sc(y,Math.sin(an)*r))))}
  if(prevRing){const c0=colF((i-1)/(pts.length-1)),c1=colF(f);for(let j=0;j<seg;j++){const j1=(j+1)%seg;m.quad(prevRing[j],ring[j],ring[j1],prevRing[j1],[c0,c1,c1,c0],mat)}}prevRing=ring}}
// flare loop: arch in XY plane from (-1,0) to (1,0), height 1.25
const FLOOP=um(m=>{const pts=[];for(let i=0;i<=40;i++){const a=Math.PI*(1-i/40);pts.push([Math.cos(a),Math.sin(a)*1.25,0.05*Math.sin(a*3)])}
  tubeP(m,pts,f=>0.12+0.07*Math.sin(f*Math.PI),f=>mix3([1,0.55,0.15],[1,0.95,0.6],Math.sin(f*Math.PI)),MAT.glass,10)});
// magnetic field line (dipole-ish arc), XY plane, from (-1,0) to (1,0)
const FLINE=um(m=>{const pts=[];for(let i=0;i<=60;i++){const a=Math.PI*(1-i/60);pts.push([Math.cos(a),Math.pow(Math.sin(a),1.4)*0.75,0])}
  tubeP(m,pts,f=>0.02,f=>[1,1,1],MAT.glass,6)});
// cone (apex at origin, base at y=-1 radius 1) for the sunbeam
const BCONE=um(m=>{const s=28;for(let i=0;i<s;i++){const a=i/s*TAU2,b=(i+1)/s*TAU2;m.tri([0,0,0],[Math.cos(a),-1,Math.sin(a)],[Math.cos(b),-1,Math.sin(b)],[1,1,1],MAT.glass)}});
// magnifying glass (lens in XY plane, handle down -y)
const MAG_RIM=um(m=>{const pts=[];for(let i=0;i<=64;i++){const a=i/64*TAU2;pts.push([Math.cos(a),Math.sin(a),0])}tubeP(m,pts,f=>0.075,f=>hx('#d8b048'),0,10);
  m.prism([0,-2.35,0],0.13,0.11,1.25,14,hx('#2a1a14'));m.prism([0,-1.15,0],0.12,0.12,0.25,14,hx('#d8b048'));m.ico([0,-2.38,0],0.13,hx('#2a1a14'),0,1,[6,8])},0.5);
const MAG_LENS=um(m=>sphC(m,[0,0,0],0.97,p=>[0.75,0.9,1],[14,22],MAT.glass,1));
// sparks: short streak
const SPARK=um(m=>m.box([0,0,0],[0.06,0.06,1],[1,1,1],MAT.glass));
