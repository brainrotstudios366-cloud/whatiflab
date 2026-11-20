// ================= PLANET PARADE: meshes (prefix P_) =================
// hi-res Jupiter with turbulent bands + Great Red Spot
function pJupCol(n){const lat=n[1];const tw=fbm(n[0]*3+1,n[2]*3+lat*2,4);const b=Math.sin(lat*22+tw*2.6+Math.sin(lat*7)*1.2);
  const band=[[HC('#8a5a3a'),HC('#f3e3c6')],[HC('#b07a50'),HC('#fff3dc')]][Math.abs(lat)>0.55?0:1];let c=mix3(band[0],band[1],0.5+0.5*b);
  const ed=fbm(n[0]*11+3,n[2]*11+lat*20,3);c=mix3(c,V.sc(c,0.82),clamp((ed-0.55)*3,0,1));
  // great red spot (southern hemisphere)
  const ph=Math.atan2(n[2],n[0]);const dl=(lat+0.36)/0.09,dp=(ph-0.6)/0.22;const r=dl*dl+dp*dp;if(r<1){const k=1-r;c=mix3(c,mix3(HC('#c85a3a'),HC('#e88a5a'),fbm(n[0]*20,n[2]*20,2)),clamp(k*2.2,0,1))}
  if(Math.abs(lat)>0.86)c=mix3(c,HC('#6f6a74'),clamp((Math.abs(lat)-0.86)*7,0,0.8));return c}
const P_JUP=um(m=>sph(m,1,96,192,pJupCol,0),0.3);
// Io: sulphur yellow, orange/white patches, dark volcano calderas
function pIoCol(n){const v=fbm(n[0]*4+2,n[2]*4+n[1]*3,4);const s=fbm(n[0]*9+5,n[1]*9-n[2]*3,3);let c=mix3(HC('#d9c24a'),HC('#f2e6a0'),v);
  if(s>0.62)c=mix3(c,HC('#c8642a'),clamp((s-0.62)*6,0,1));if(s<0.3)c=mix3(c,HC('#f6f2e2'),clamp((0.3-s)*5,0,0.8));
  const d=fbm(n[0]*16+9,n[2]*16+n[1]*6,2);if(d>0.74)c=mix3(c,HC('#2a1a12'),clamp((d-0.74)*12,0,1));return c}
const P_IO=um(m=>sph(m,1,48,96,pIoCol,0),0.3);
const P_IOG=um(m=>sph(m,1,48,96,n=>{const d=fbm(n[0]*16+9,n[2]*16+n[1]*6,2);return d>0.8?mix3([1,0.8,0.3],[1,0.3,0.05],clamp((d-0.8)*10,0,1)):[0,0,0]},MAT.emis),0.3);
// Venus (cream clouds), Mercury (grey-brown), Uranus (pale cyan)
const P_VEN=um(m=>sph(m,1,32,64,n=>mix3(HC('#d9b77a'),HC('#fbebc4'),0.5+0.5*Math.sin(n[1]*5+fbm(n[0]*2+1,n[2]*2,3)*4)),0),0.3);
const P_MER=um(m=>sph(m,1,32,64,n=>{const v=fbm(n[0]*5+3,n[2]*5+n[1]*2,4);return mix3(HC('#6d625a'),HC('#b3a89c'),v)},0),0.3);
const P_URA=um(m=>sph(m,1,32,64,n=>mix3(HC('#8fe3e8'),HC('#c9f6f4'),0.5+0.5*Math.sin(n[1]*6)*0.4+fbm(n[0]*2,n[2]*2,2)*0.3),0),0.3);
// ocean shell (water material) for tidal bulge
const P_WATER=um(m=>sph(m,1,64,128,n=>{const w=fbm(n[0]*6+1,n[2]*6+n[1]*3,3);return mix3(HC('#3f9cff'),[0.85,0.95,1],clamp((w-0.6)*2.5,0,0.6))},MAT.water),0.4);
// night ground: dark rolling hills + tree silhouettes
const P_GROUND=um(m=>{const r=rngG(8);const hgt=(x,z)=>0.5*Math.sin(x*0.13)+0.4*Math.sin(z*0.21+x*0.05)+0.25*fbm(x*0.1,z*0.1,2);
  for(let i=-40;i<40;i++)for(let j=-60;j<8;j++){const x0=i*1.5,z0=j*1.5,x1=x0+1.5,z1=z0+1.5;const c=mix3(HC('#0d1a24'),HC('#16283a'),r()*0.6);
    m.quad([x0,hgt(x0,z0),z0],[x0,hgt(x0,z1),z1],[x1,hgt(x1,z1),z1],[x1,hgt(x1,z0),z0],c,0)}});
const P_TREE=um(m=>{tube(m,[0,0,0],[0,0.9,0],0.09,0.06,HC('#1a120c'),7);blob(m,[0,1.35,0],0.55,()=>HC('#0b1a14'),4,1.1,[8,12]);blob(m,[0.25,1.05,0.1],0.35,()=>HC('#0e1f18'),6,1,[6,9])});
