// ================= EARTH STOPS SPINNING: meshes =================
function spEarthCol(n){const v=sLand(n);const lat=Math.abs(n[1]);
  const deep=clamp((0.5-v)/0.14,0,1);const ocean=mix3(HC('#2c8ad4'),HC('#0a2766'),Math.pow(deep,0.55));
  const dry=clamp((fbm(n[0]*3+11,n[2]*3+n[1],3)-0.45)*3+(lat<0.35?0.3:-0.25),0,1);const hi=clamp((v-0.57)*6,0,1);
  let land=mix3(HC('#3f8a3c'),HC('#cfa86a'),dry*0.85);land=mix3(land,HC('#7a6644'),hi*0.45);
  let c=mix3(ocean,land,sst(0.497,0.507,v));const ice=sst(0.93,0.975,lat+(v-0.5)*0.15);return mix3(c,[0.82,0.87,0.94],ice)}
const SPE=um(m=>sph(m,1,128,256,spEarthCol,0),0.3);
// "never spins again": oceans pile up at the poles, one equatorial mega-continent (Esri 2010)
function spEarth2Col(n){const v=sLand(n);const lat=Math.abs(n[1]);const edge=0.62+0.12*(fbm(n[0]*2.6+5,n[2]*2.6+n[1],4)-0.5)*2+(v-0.5)*0.5;
  const isLand=sst(edge+0.015,edge-0.015,lat);const deep=clamp((lat-edge)/0.2,0,1);const ocean=mix3(HC('#2c8ad4'),HC('#0a2766'),Math.pow(deep,0.6));
  const dry=clamp((fbm(n[0]*3+11,n[2]*3+n[1],3)-0.42)*3+(lat<0.3?0.35:-0.1),0,1);let land=mix3(HC('#4a8a3c'),HC('#d6ae6c'),dry*0.9);land=mix3(land,HC('#7a6644'),clamp((v-0.55)*5,0,1)*0.5);
  let c=mix3(ocean,land,isLand);const ice=sst(0.9,0.96,lat);return mix3(c,[0.93,0.95,1],ice*0.9)}
const SPE2=um(m=>sph(m,1.002,128,256,spEarth2Col,0),0.3);
// separate cloud shell (so the air can keep moving while the ground stops)
const SPCLOUD=um(m=>{const r=rngG(12);let k=0;for(let i=0;i<200000&&k<26000;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const n=[s*Math.cos(a),u,s*Math.sin(a)];const c=sCloud(n);if(c<0.565)continue;k++;
  const p=V.sc(n,1.012+0.004*r());const sz=0.007+0.02*clamp((c-0.565)*5,0,1)*(0.5+0.5*r());const t1=V.norm(V.cross(n,Math.abs(n[1])<0.9?[0,1,0]:[1,0,0])),t2=V.cross(n,t1);const col=mix3([0.9,0.92,0.96],[1,1,1],r());
  const NS=7;for(let j=0;j<NS;j++){const a0=j/NS*TAU2,a1=(j+1)/NS*TAU2;const q0=V.add(p,V.add(V.sc(t1,Math.cos(a0)*sz),V.sc(t2,Math.sin(a0)*sz))),q1=V.add(p,V.add(V.sc(t1,Math.cos(a1)*sz),V.sc(t2,Math.sin(a1)*sz)));m.tri(p,q0,q1,col,0)}}});
// ISS-like station
const SPISS=um(m=>{const g=[0.82,0.84,0.88];m.box([0,0,0],[0.9,0.16,0.16],g);m.box([0,0,0],[0.14,0.14,0.6],g);for(const x of[-0.62,-0.38,0.38,0.62])m.box([x,0,0],[0.18,0.02,1.3],HC('#2a4590'),0,0,HC('#3c62c0'))});
// ---- ground town (second 1) ----
const SPTOWN=um(m=>{ground(m,-160,-160,160,40,null,0,8,(x,z)=>mix3(C.grass,C.grass2,fbm(x*0.05,z*0.05,3)));
  ground(m,-160,-4,160,4,C.road,0.02,8);for(let x=-150;x<150;x+=6)m.box([x,0.04,0],[3,0.02,0.25],C.line);ground(m,-160,-6.5,160,-4,C.side,0.05,8);ground(m,-160,4,160,6.5,C.side,0.05,8);
  const walls=[hx('#e8dcc4'),hx('#c9d7e3'),hx('#efc9a8'),hx('#d8e2c4'),hx('#f0e6d6')];const roofs=[C.roofR,C.roofG,hx('#7a4a3a')];
  for(let i=-7;i<=7;i++){const x=i*11+3*hsh(i,2);house(m,x,-13-3*hsh(i,3),7,6,4+hsh(i,4)*2,walls[(i+7)%5],roofs[(i+9)%3],0)}
  for(let i=-6;i<=6;i++){const x=i*13+5;house(m,x,-34-4*hsh(i,5),8,7,5+hsh(i,6)*3,walls[(i+9)%5],roofs[(i+7)%3],0)}
  for(let i=-10;i<10;i++){tree(m,i*9+4,-25+2*hsh(i,7),1.2+0.4*hsh(i,8),0,'pine')}
  for(let i=-12;i<12;i++){tree(m,i*14,-58-6*hsh(i,9),2+hsh(i,10),0)}},0);
const SPCAR=[hx('#e2483a'),hx('#2f7fe0'),hx('#f2cf2e'),hx('#f2f2f2')].map(col=>um(m=>car(m,0,0,Math.PI/2,col),0));
const SPBUS=um(m=>bus(m,0,0,Math.PI/2,hx('#f2b02e')),0);
const SPTREE=um(m=>tree(m,0,0,1.1,0),0);
const SPCRATE=um(m=>{m.box([0,0.5,0],[1,1,1],C.wood);m.box([0,0.5,0.505],[0.9,0.12,0.02],hx('#8a6a45'));m.box([0,0.5,-0.505],[0.9,0.12,0.02],hx('#8a6a45'))},0);
const SPBIN=um(m=>{m.prism([0,0,0],0.4,0.45,1.1,10,hx('#3f9a5a'));m.prism([0,1.1,0],0.48,0.48,0.08,10,hx('#2f7a45'))},0);
const SPBALL=um(m=>m.ico([0,0.45,0],0.45,[1,1,1],0,1,[8,12]),0);
// ---- coast city + mega wave (second 3) ----
const SPCOAST=um(m=>{const r=rngG(31);ground(m,-400,-400,40,200,HC('#1f5f9a'),0,20);m.d&&0;
  ground(m,40,-400,400,200,null,0.5,20,(x,z)=>mix3(HC('#8d8a82'),HC('#6f7266'),fbm(x*0.02,z*0.02,3)));ground(m,30,-400,40,200,C.sand,0.3,10);
  const cols=[hx('#7c93b0'),hx('#a9b8c9'),hx('#5f7590'),hx('#c8ccd2'),hx('#8aa0b8')];
  for(let i=0;i<9;i++)for(let j=0;j<12;j++){const x=55+i*16+r()*6,z=-170+j*17+r()*6;const h=(30+r()*90)*(1-i*0.05);skyscraper(m,x,z,9+r()*5,9+r()*5,h,cols[(i+j)%5],0)}},0);
const SPWATER=um(m=>{for(let i=-20;i<2;i++)for(let j=-20;j<10;j++){const x=i*20,z=j*20;m.quad([x,0.2,z],[x,0.2,z+20],[x+20,0.2,z+20],[x+20,0.2,z],HC('#1d5b92'),MAT.water)}});
const SPWAVE=um(m=>{const PR=[[-90,0],[-50,0.22],[-25,0.55],[-10,0.86],[-3,0.98],[1,1.0],[4.5,0.95],[7,0.82],[8,0.62],[7.6,0.42],[8.6,0.2],[11,0]];
  const col=y=>y>0.9?mix3(HC('#bfe8f5'),[1,1,1],(y-0.9)*10):mix3(HC('#082c55'),HC('#1f86a8'),Math.pow(y/0.9,1.6));
  const tap=z=>sst(-300,-200,z)*sst(140,60,z);for(let k=0;k<88;k++){const z0=-300+k*5,z1=z0+5;const w0=4*Math.sin(z0*0.05)+2*Math.sin(z0*0.13),w1=4*Math.sin(z1*0.05)+2*Math.sin(z1*0.13);const h0=tap(z0),h1=tap(z1);
    for(let i=0;i<PR.length-1;i++){const a=PR[i],b=PR[i+1];m.quad([a[0]+w0,a[1]*h0,z0],[b[0]+w0,b[1]*h0,z0],[b[0]+w1,b[1]*h1,z1],[a[0]+w1,a[1]*h1,z1],[col(a[1]),col(b[1]),col(b[1]),col(a[1])],0)}}},0.5);
