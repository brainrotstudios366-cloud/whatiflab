// ================= APOPHIS: meshes (prefix A_) =================
// bilobed, elongated asteroid (long axis = x, ~1.8 units from tip to tip)
function aRockCol(p){const v=vnoise(p[0]*3.1+2,p[2]*3.1+p[1]*1.7);const f=vnoise(p[0]*9+5,p[1]*9-p[2]*4);const cr=vnoise(p[0]*5.3+11,p[2]*5.3-p[1]*2.3);
  let c=mix3([0.34,0.3,0.27],[0.62,0.56,0.49],clamp(v*0.8+f*0.35,0,1));if(cr>0.68)c=V.sc(c,0.62);if(cr>0.64&&cr<0.68)c=V.sc(c,1.18);return c}
const A_APO=um(m=>{blob(m,[-0.42,0,0],0.6,aRockCol,5,0.82,[22,34]);blob(m,[0.45,0.04,0.02],0.47,aRockCol,9,0.85,[20,30]);blob(m,[0.02,-0.02,0],0.42,aRockCol,13,0.8,[14,22]);
  const r=rngG(21);for(let i=0;i<90;i++){const a=r()*TAU2,u=r()*2-1,s=Math.sqrt(1-u*u);const lob=r()<0.55;const c=lob?[-0.42,0,0]:[0.45,0.04,0.02],R=lob?0.55:0.43;
    blob(m,[c[0]+Math.cos(a)*s*R,c[1]+u*R*0.8,c[2]+Math.sin(a)*s*R],0.012+r()*0.03,aRockCol,30+i,0.8,[5,8])}},0.45);
// geostationary satellite (gold body + 2 blue panels)
const A_GSAT=um(m=>{m.box([0,0,0],[0.34,0.3,0.3],HC('#d8a940'),0,0,HC('#f0c860'));for(const s of[-1,1]){m.box([s*0.62,0,0],[0.85,0.02,0.3],HC('#1d3f9c'),0,0,HC('#3d6fe0'));tube(m,[s*0.17,0,0],[s*0.2,0,0],0.02,0.02,[0.7,0.7,0.75],5)}
  tube(m,[0,0.15,0],[0,0.3,0],0.12,0.02,[0.9,0.9,0.92],10)});
const A_LED=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[5,7]));
// hologram skyscraper (stepped tower + spire), height 4.43 units (1 unit = 100 m), emissive
const A_TOWER=um(m=>{const c=[0.35,0.95,1],e=MAT.emis;const L=(y0,h,w)=>{m.box([0,y0+h/2,0],[w,h,w*0.75],V.sc(c,0.55),e,0,c)};
  L(0,0.35,1.15);L(0.35,2.35,0.82);L(2.7,0.45,0.62);L(3.15,0.3,0.46);L(3.45,0.25,0.32);tube(m,[0,3.7,0],[0,4.43,0],0.07,0.012,c,8,e);
  for(let i=0;i<22;i++){const y=0.45+i*0.1;m.box([0,y,0.31],[0.78,0.018,0.01],[0.8,1,1],e)}});
// OSIRIS-APEX style probe: box body, two wing panels, high-gain dish, sampling arm
const A_PROBE=um(m=>{m.box([0,0,0],[0.5,0.42,0.42],HC('#c9ccd6'),0,0,HC('#e8e8f0'));m.box([0,0,0.215],[0.48,0.4,0.01],HC('#d6a640'));
  for(const s of[-1,1]){tube(m,[s*0.25,0,0],[s*0.4,0,0],0.02,0.02,[0.7,0.7,0.75],5);m.box([s*0.95,0,0],[1.1,0.02,0.42],HC('#1b2f86'),0,0,HC('#3e66d8'))}
  for(let i=0;i<20;i++){const a=i/20*TAU2,b=(i+1)/20*TAU2;m.tri([0,0.42,0],[Math.cos(b)*0.36,0.3,Math.sin(b)*0.36],[Math.cos(a)*0.36,0.3,Math.sin(a)*0.36],[0.95,0.95,0.97])}
  tube(m,[0,0.21,0],[0,0.3,0],0.03,0.03,[0.8,0.8,0.82],6);tube(m,[0.1,-0.21,0.1],[0.35,-0.75,0.35],0.018,0.018,[0.75,0.75,0.78],5);m.ico([0.36,-0.78,0.36],0.06,[0.85,0.85,0.88],0,1,[4,6])});
// night ground: dark hills
const A_GROUND=um(m=>{const N=60;const hgt=(x,z)=>0.9*fbm(x*0.05+3,z*0.05,3)+(z<-40?(fbm(x*0.03,9,2)*7):0);
  for(let i=-N;i<N;i++)for(let j=-N;j<6;j++){const x0=i*1.5,x1=x0+1.5,z0=j*1.5,z1=z0+1.5;const c=mix3(HC('#0f1a14'),HC('#1c2b1e'),hsh(i,j));m.quad([x0,hgt(x0,z0),z0],[x0,hgt(x0,z1),z1],[x1,hgt(x1,z1),z1],[x1,hgt(x1,z0),z0],c,0)}});
const A_TREE=um(m=>{m.prism([0,0,0],0.06,0.06,0.5,6,[0.15,0.1,0.06]);m.prism([0,0.4,0],0.5,0,1.6,8,HC('#0c2016'))});
