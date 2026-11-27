// ===================== THE ICE AGE vs ONE DYING ANT =====================
// ---------- new meshes ----------
// snowy tundra ground tile
function iceCol(x,z){const n=fbm(x*0.05+3,z*0.05,3),q=fbm(x*0.5,z*0.5+7,2);const c=mix3(hx('#b9cbe0'),hx('#f2f6fb'),clamp(0.3+n*0.9,0,1));return mix3(c,hx('#9fb6d2'),clamp((q-0.62)*1.6,0,0.4))}
function buildIceTile(){const T=200,m=new MB();const r=rngG(23);
  ground(m,-60,-T,60,0,null,0,6,(x,z)=>iceCol(x,z));
  for(const s of[-1,1])ground(m,s>0?60:-400,-T,s>0?400:-60,0,null,0,20,(x,z)=>V.sc(iceCol(x,z),0.95));
  // dry grass tufts poking through the snow
  for(let i=0;i<1300;i++){const x=(r()<0.5?-1:1)*(0.5+Math.pow(r(),1.4)*16),z=-r()*T;if(r()<0.55)continue;const n=3+Math.floor(r()*4);
    for(let j=0;j<n;j++){const h=0.08+r()*0.2,yaw=r()*TAU2,w=0.012+r()*0.012,lx=(r()-0.5)*h*0.6,lz=(r()-0.5)*h*0.6;const xx=x+(r()-0.5)*0.12,zz=z+(r()-0.5)*0.12;
      const b0=[xx+Math.cos(yaw)*w,0,zz+Math.sin(yaw)*w],b1=[xx-Math.cos(yaw)*w,0,zz-Math.sin(yaw)*w],tip=[xx+lx,h,zz+lz];m.tri(b0,b1,tip,[hx('#6a5a34'),hx('#6a5a34'),hx(r()<0.5?'#c8b070':'#a89458')])}}
  // rocks with snow caps
  for(let i=0;i<160;i++){const x=(r()<0.5?-1:1)*(1.4+Math.pow(r(),1.4)*70),z=-r()*T,s=0.05+Math.pow(r(),3)*0.9;m.ico([x,0,z],s,mix3(hx('#3e4450'),hx('#6a707c'),r()),0,0.55,[5,7]);m.ico([x,s*0.32,z],s*0.86,hx('#f4f8fc'),0,0.3,[5,7])}
  for(let i=0;i<40;i++){const x=(r()-0.5)*2.6,z=-r()*T;if(Math.abs(x)<0.45)continue;m.ico([x,0,z],0.02+r()*0.04,mix3(hx('#3a3e48'),hx('#6a707a'),r()),0,0.6,[4,6])}
  // soft snow mounds
  for(let i=0;i<60;i++){const x=(r()<0.5?-1:1)*(1.2+r()*30),z=-r()*T,s=0.3+r()*1.4;m.ico([x,-s*0.2,z],s,hx('#eef3fa'),0,0.25,[7,10])}
  // ice sparkles (emissive specks)
  for(let i=0;i<900;i++){const x=(r()-0.5)*14,z=-r()*T;m.box([x,0.004,z],[0.012,0.006,0.012],[1,1,1],MAT.emis)}
  return{mesh:m.build(0.45),T}}
const MTILE=buildIceTile();
// overcast / snow cloud blob: baked shading (unlit glass mat)
const HCLOUD=um(m=>blob(m,[0,0,0],1,p=>{const n=vnoise(p[0]*3+1,p[1]*3+p[2]*2.4);const y=clamp(p[1]*0.55+0.5,0,1);return V.sc(mix3([0.55,0.6,0.68],[0.92,0.94,0.97],Math.pow(y,1.2)),0.85+0.25*n)},7,0.62,[12,18],MAT.glass),0.6);
// snow slab (avalanche), top face at y=0
const SNOWSLAB=um(m=>m.box([0,-0.5,0],[1,1,1],hx('#eaf0f8'),0));
// ice block around the frozen ant (unlit glass, alpha)
const ICEB=um(m=>{m.box([0,0.5,0],[1,1,1],hx('#bfe6ff'),MAT.glass);m.box([0,0.5,0],[0.82,0.9,0.82],hx('#e8f8ff'),MAT.glass)});
// icicle (cone pointing down, tip at origin, height 6, radius 1)
const ICICLE=um(m=>{const s=10;for(let i=0;i<s;i++){const a=i/s*TAU2,b=(i+1)/s*TAU2;const ra=1+0.25*Math.sin(i*2.7),rb=1+0.25*Math.sin((i+1)*2.7);
  m.tri([0,0,0],[Math.cos(b)*rb,6,Math.sin(b)*rb],[Math.cos(a)*ra,6,Math.sin(a)*ra],[[0.9,0.97,1],[0.62,0.82,0.98],[0.62,0.82,0.98]],MAT.glass);
  m.tri([0,6,0],[Math.cos(a)*ra,6,Math.sin(a)*ra],[Math.cos(b)*rb,6,Math.sin(b)*rb],[0.8,0.92,1],MAT.glass)}});
// ice shard chunk
const SHARD=um(m=>m.ico([0,0,0],1,hx('#cfeeff'),MAT.glass,1,[3,5]));
// snowflake: 6 arms with side branches (emissive), in XY plane
const SFLAKE=um(m=>{const q=(p0,p1,w)=>{const d=V.norm(V.sub(p1,p0));const nx=[-d[1]*w,d[0]*w,0];const c=[0.85,0.95,1];m.quad(V.add(p0,nx),V.sub(p0,nx),V.sub(p1,nx),V.add(p1,nx),c,MAT.emis);m.quad(V.add(p1,nx),V.sub(p1,nx),V.sub(p0,nx),V.add(p0,nx),c,MAT.emis)};
  for(let i=0;i<6;i++){const a=i/6*TAU2;const ca=Math.cos(a),sa=Math.sin(a);q([0,0,0],[ca,sa,0],0.07);
    for(const f of[0.45,0.72]){const p=[ca*f,sa*f,0];for(const s of[-1,1]){const b=a+s*1.0;q(p,[p[0]+Math.cos(b)*0.32*(1.1-f),p[1]+Math.sin(b)*0.32*(1.1-f),0],0.05)}}}
  m.ico([0,0,0],0.16,[0.9,0.97,1],MAT.emis,1,[4,6])});
// ---------- woolly mammoth (bg, meters, faces -z) ----------
const MFUR=um(m=>blob(m,[0,0,0],1,p=>{const n=vnoise(p[0]*5+2,p[1]*5+p[2]*4);const y=clamp(p[1]*0.5+0.5,0,1);return mix3(mix3(hx('#2e1a0e'),hx('#6a4426'),y),hx('#8a5a32'),clamp((n-0.55)*2,0,0.6))},4,1,[12,18]),0.6);
const tuskM=s=>um(m=>{const pts=[];for(let i=0;i<=20;i++){const f=i/20;pts.push([s*(0.15*Math.sin(f*2.2)+f*0.25-f*f*0.45),-0.55*Math.sin(f*1.7)+f*f*1.0,-f*1.6+f*f*0.6])}tubeP(m,pts,f=>0.13*(1-f*0.75),f=>mix3(hx('#e8dcc0'),hx('#fff6e4'),f),0,10)},0.6);
const MTUSKS=[tuskM(-1),tuskM(1)];
const MTRUNK=um(m=>{const pts=[];for(let i=0;i<=20;i++){const f=i/20;pts.push([0,-f*1.9,-0.25-f*0.35+f*f*f*0.55])}tubeP(m,pts,f=>0.3*(1-f*0.6),f=>mix3(hx('#4a2c18'),hx('#3a2214'),f),0,12)},0.6);
// giant foot (fg, unit radius, height 3.2): furry column + dark sole + toenails
const MFOOT=um(m=>{m.prism([0,0.04,0],1.0,0.92,3.2,32,hx('#4a2c18'));m.prism([0,0,0],0.98,0.98,0.05,32,hx('#2a201a'));
  for(let i=0;i<60;i++){const a=i/60*TAU2;blob(m,[Math.cos(a)*0.98,0.35+0.08*Math.sin(i*1.9),Math.sin(a)*0.98],0.16,p=>mix3(hx('#3a2214'),hx('#7a5030'),clamp(p[1]-0.1,0,1)),i,2.2,[6,9])}
  for(let i=0;i<40;i++){const a=i/40*TAU2+0.08;blob(m,[Math.cos(a)*0.95,1.4+0.6*hsh(i,3),Math.sin(a)*0.95],0.22,p=>mix3(hx('#3a2214'),hx('#6a4426'),hsh(i,4)),i+70,1.8,[6,9])}
  for(let i=0;i<5;i++){const a=-0.62+i*0.31;m.ico([Math.cos(a)*0.93,0.12,Math.sin(a)*0.93],0.16,hx('#d8ccb0'),0,0.75,[6,8])}},0.5);
// ---------- the ice sheet (bg, meters): 3 km tall wall, front face at z=0 facing -z ----------
const ICEWALL=um(m=>{const NX=120,NY=26,WD=24000,HT=3000;const P=(i,j)=>{const x=(i/NX-0.5)*WD,y=j/NY*HT;const top=HT*(1-0.04*Math.pow(Math.abs(i/NX-0.5)*2,2))+60*vnoise(i*0.3,3);const yy=Math.min(y,top);
    const dz=-180*vnoise(i*0.55,j*0.15)-80*vnoise(i*2.1,j*0.9)+(j===NY?-400:0);return[x,yy,dz]};
  const col=(i,j)=>{const f=j/NY;const n=vnoise(i*0.9,j*0.35),cr=vnoise(i*2.3,j*0.2);let c=mix3(hx('#4a86c0'),hx('#bfe4ff'),clamp(f*0.9+n*0.4,0,1));c=mix3(c,hx('#2a5a90'),clamp((cr-0.62)*3,0,0.7));if(f>0.93)c=mix3(c,hx('#ffffff'),clamp((f-0.93)*14,0,1));return c};
  for(let i=0;i<NX;i++)for(let j=0;j<NY;j++)m.quad(P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),[col(i,j),col(i+1,j),col(i+1,j+1),col(i,j+1)],MAT.glass);
  for(let i=0;i<NX;i++){const a=P(i,NY),b=P(i+1,NY);m.quad(a,b,[b[0],b[1],8000],[a[0],a[1],8000],[0.96,0.98,1],MAT.glass)}
  for(let i=0;i<NX;i++){const x0=(i/NX-0.5)*WD,x1=((i+1)/NX-0.5)*WD;m.quad([x0,0,-500],[x1,0,-500],[x1,160,-60],[x0,160,-60],[[0.8,0.86,0.94],[0.8,0.86,0.94],[0.9,0.95,1],[0.9,0.95,1]],MAT.glass)}});
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.5,h1:1.45,e1:4.0,hit1:7.2,crk1:8.7,res1:9.9,
  s2:14.2,hit2:17.4,boom2:18.8,res2:20.4,
  b3:25.0,hit3:28.2,crk3:29.0,res3:30.5,
  k4:36.0,c4:39.0,res4:41.6,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.9,res5:54.3,loop:65.5};
const ROUNDS=[['ROUND 1','−40 °C WINTER 🥶','Ant: just chilling 😎',EV.res1],['ROUND 2','AVALANCHE 🏔️','Ant: built an igloo 😎',EV.res2],['ROUND 3','6-TONNE WOOLLY MAMMOTH 🦣','Ant: missed by 2 cm 😎',EV.res3],['ROUND 4','A 3 KM ICE SHEET 🧊','Ant: just walked away 😎',EV.res4],['FINAL ROUND','ONE snowflake ❄️','Cause of death: ONE snowflake 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){if(t<R[0])return 0.8;if(t<R[1])return t<EV.e1+0.6?0.8:(t>=EV.res1+1.0?0.9:0);if(t<R[2])return t<EV.s2+1.0?0.8:0;
  if(t<R[3])return t<EV.b3+0.8?0.9:(t>=EV.res3+1.2?0.9:0);if(t<R[4])return t<EV.c4-0.4?0.6:(t>=EV.res4-1.0?1.1:0);if(t<R[5])return t<EV.look5&&t>=R[4]+0.3?0.75:0;return 0}
const SJ_DT=1/120,SJ_TAB=[0];for(let i=1;i<=DUR/SJ_DT+10;i++){const tm=(i-0.5)*SJ_DT;SJ_TAB.push(SJ_TAB[i-1]+sjSpd(tm)*SJ_DT*1.1)}
function sjD(t){t=clamp(t,0,DUR+0.05);const f=t/SJ_DT,i=Math.floor(f);return lerp(SJ_TAB[i],SJ_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// blizzard wind 0..1
function windAt(t){const rn=roundAt(t);if(rn<0)return 0.35;
  if(rn===0){if(t<EV.e1)return 0.4;if(t<EV.hit1)return lerp(0.4,1,ease((t-EV.e1)/(EV.hit1-EV.e1)));return lerp(1,0.3,ease((t-EV.crk1)/1.5))}
  if(rn===1)return t<EV.hit2?0.25:lerp(0.9,0.2,ease((t-EV.hit2)/2));if(rn===3)return 0.2;return 0}
// falling snow amount 0..1
function snowAt(t){const rn=roundAt(t);if(rn<0)return 0.55;if(rn===0)return lerp(0.6,1,ease((t-EV.e1)/2))*(1-0.6*ease((t-EV.res1)/1.5));if(rn===1)return 0.45;if(rn===2)return 0.18;if(rn===3)return 0.3;return 0}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const HSUN=V.norm([0.35,0.55,0.75]),SUNDIR5=HSUN;
const E_STORM=envBase({sun:HSUN,sunSize:0.05,sunCol:hx('#e4ecf6'),sky:hx('#b6c4d6'),gnd:hx('#9aa8b8'),fog:hx('#d2dce8'),fogD:3000,zen:hx('#7a8ea8'),hor:hx('#e2e9f1'),gndCol:hx('#dde5ee'),night:0.05});
const E_DARK=envBase({sun:HSUN,sunSize:0.05,sunCol:hx('#aab8cc'),sky:hx('#8896aa'),gnd:hx('#6a7688'),fog:hx('#a6b2c2'),fogD:1300,zen:hx('#4e5c72'),hor:hx('#b4c0ce'),gndCol:hx('#b8c4d2'),night:0.18});
const E_BOLT=envBase({sun:HSUN,sunSize:0.05,sunCol:hx('#f0f8ff'),sky:hx('#e0f0ff'),zen:hx('#b0d0f0'),hor:hx('#f4faff'),fog:hx('#e0ecf8'),fogD:4000,gnd:hx('#c0ccd8'),gndCol:hx('#e8f0f8')});
const E_EYE=envBase({sun:HSUN,sunSize:0.9,sunCol:hx('#fff4e0'),sky:hx('#a0cdf2'),zen:hx('#2a64c8'),hor:hx('#e6f2fb'),fog:hx('#d6e6f4'),fogD:6000,gnd:hx('#9aaabb'),gndCol:hx('#dde8f2')});
const E_ICE=envBase({sun:HSUN,sunSize:0.9,sunCol:hx('#f4f8ff'),sky:hx('#98c4ee'),zen:hx('#2458b8'),hor:hx('#dcecf8'),fog:hx('#cfe0f0'),fogD:7000,gnd:hx('#90a2b8'),gndCol:hx('#d4e2f0')});
const E_CLEAR=envBase({sun:HSUN,sunSize:1.1,sunCol:hx('#ffe8c8'),sky:hx('#b4d4f0'),zen:hx('#3a70c8'),hor:hx('#fbe9d8'),fog:hx('#eadfd8'),fogD:6000,gnd:hx('#a0a6b4'),gndCol:hx('#e6e4ea')});
const BOLTS=[];
function envAt(t){const rn=roundAt(t);let e=E_STORM;const fl=(t0,a,d,E)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E||E_BOLT,a*(1-k/d))};
  if(rn===0)e=mixEnv(E_STORM,E_DARK,ease((t-EV.e1)/2.5)*(1-ease((t-EV.res1)/1.5)*0.7));
  if(rn===2)e=mixEnv(E_STORM,E_EYE,ease((t-R[2])/1.0));
  if(rn===3)e=mixEnv(E_EYE,E_ICE,ease((t-R[3])/1.0));
  if(rn===4)e=mixEnv(E_ICE,E_CLEAR,ease((t-R[4])/1.5));
  fl(EV.hit1,0.6,0.6);fl(EV.crk1,0.4,0.4);fl(EV.hit2,0.5,0.8);
  return e}
