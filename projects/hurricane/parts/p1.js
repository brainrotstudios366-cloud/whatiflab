// ===================== CATEGORY 5 HURRICANE vs ONE DYING ANT =====================
// ---------- new meshes ----------
// stormy meadow ground tile
function hurCol(x,z){const n=fbm(x*0.05+3,z*0.05,3),q=fbm(x*0.4,z*0.4+7,2);const c=mix3(hx('#2a5a2c'),hx('#4a8a3a'),clamp(0.25+n*0.9,0,1));return mix3(c,hx('#5a4a32'),clamp((q-0.6)*1.4,0,0.45))}
function buildHurTile(){const T=200,m=new MB();const r=rngG(21);
  ground(m,-60,-T,60,0,null,0,6,(x,z)=>hurCol(x,z));
  for(const s of[-1,1])ground(m,s>0?60:-400,-T,s>0?400:-60,0,null,0,20,(x,z)=>V.sc(hurCol(x,z),0.9));
  // grass blades, all bent by the wind toward -x
  for(let i=0;i<2600;i++){const x=(r()<0.5?-1:1)*(0.45+Math.pow(r(),1.5)*16),z=-r()*T;const h=0.08+r()*0.22*(1+Math.abs(x)*0.08),yaw=r()*TAU2,w=0.018+r()*0.02,lx=-h*(0.35+r()*0.4),lz=(r()-0.5)*h*0.3;
    const b0=[x+Math.cos(yaw)*w,0,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,0,z-Math.sin(yaw)*w],tip=[x+lx,h*0.8,z+lz];const cb=hx(r()<0.5?'#1f4a22':'#2a5a28'),ct=hx(r()<0.5?'#6aa04a':'#8ab85a');m.tri(b0,b1,tip,[cb,cb,ct])}
  for(let i=0;i<220;i++){const x=(r()<0.5?-1:1)*(1.4+Math.pow(r(),1.4)*70),z=-r()*T,s=0.04+Math.pow(r(),3)*0.8;m.ico([x,0,z],s,mix3(hx('#5a5650'),hx('#9a948a'),r()),0,0.55,[5,7])}
  for(let i=0;i<50;i++){const x=(r()-0.5)*2.6,z=-r()*T;if(Math.abs(x)<0.45)continue;m.ico([x,0,z],0.02+r()*0.04,mix3(hx('#4a4640'),hx('#8a847a'),r()),0,0.6,[4,6])}
  // puddles (water material) scattered beside the path
  for(let i=0;i<26;i++){const x=(r()<0.5?-1:1)*(0.9+r()*6),z=-r()*T,s=0.25+r()*0.6;m.box([x,0.004,z],[s*1.6,0.008,s],hx('#4a6a80'),MAT.water)}
  return{mesh:m.build(0.45),T}}
const MTILE=buildHurTile();
// storm cloud blob: baked shading (unlit glass mat) dark belly, light top
const HCLOUD=um(m=>blob(m,[0,0,0],1,p=>{const n=vnoise(p[0]*3+1,p[1]*3+p[2]*2.4);const y=clamp(p[1]*0.55+0.5,0,1);return V.sc(mix3([0.2,0.22,0.26],[0.78,0.8,0.84],Math.pow(y,1.3)),0.8+0.35*n)},7,0.62,[12,18],MAT.glass),0.6);
// water slab, top face at y=0
const HWATER=um(m=>m.box([0,-0.5,0],[1,1,1],hx('#2c6a8c'),MAT.water));
const HFOAM=um(m=>m.box([0,-0.5,0],[1,1,1],hx('#e8f4ff'),MAT.water));
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.5,h1:1.45,e1:4.0,hit1:7.2,crk1:8.7,res1:9.9,
  s2:14.2,hit2:17.4,boom2:18.8,res2:20.4,
  b3:25.0,hit3:28.2,crk3:29.0,res3:30.5,
  k4:36.0,c4:39.0,res4:41.6,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.9,res5:54.3,loop:65.5};
const ROUNDS=[['ROUND 1','252 km/h WINDS 💨','Ant: free flight 😎',EV.res1],['ROUND 2','STORM SURGE 🌊','Ant: built a boat 😎',EV.res2],['ROUND 3','LIGHTNING ⚡','Ant: free tan 😎',EV.res3],['ROUND 4','THE EYE OF THE STORM 🌀','Ant: took a nap 😴',EV.res4],['FINAL ROUND','ONE gentle breeze 🍃','Cause of death: ONE gentle breeze 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){if(t<R[0])return 0.8;if(t<R[1])return t<EV.e1+0.6?0.8:(t>=EV.res1+1.0?0.9:0);if(t<R[2])return t<EV.s2+1.0?0.8:0;
  if(t<R[3])return t<EV.b3+1.0?0.9:(t>=EV.res3+1.2?0.9:0);if(t<R[4])return t<EV.k4+0.4?0.9:0;if(t<R[5])return t<EV.look5&&t>=R[4]+0.3?0.75:0;return 0}
const SJ_DT=1/120,SJ_TAB=[0];for(let i=1;i<=DUR/SJ_DT+10;i++){const tm=(i-0.5)*SJ_DT;SJ_TAB.push(SJ_TAB[i-1]+sjSpd(tm)*SJ_DT*1.1)}
function sjD(t){t=clamp(t,0,DUR+0.05);const f=t/SJ_DT,i=Math.floor(f);return lerp(SJ_TAB[i],SJ_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// wind strength 0..1 (drives streaks, leaves, rain slant, cloud speed)
function windAt(t){const rn=roundAt(t);if(rn<0)return 0.75;
  if(rn===0){if(t<EV.e1)return 0.6;if(t<EV.hit1)return lerp(0.6,1,ease((t-EV.e1)/(EV.hit1-EV.e1)));return lerp(1,0.65,ease((t-EV.crk1)/1.5))}
  if(rn===1)return 0.6;if(rn===2)return 0.55;
  if(rn===3)return 0.55*(1-ease((t-R[3])/1.2));
  return 0}
// rain amount 0..1
function rainAt(t){const rn=roundAt(t);if(rn<=2)return rn===2?1:0.85;if(rn===3)return 0.85*(1-ease((t-R[3])/1.0));return 0}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const HSUN=V.norm([0.35,0.8,0.6]),SUNDIR5=V.norm([0.42,0.25,1]);
const E_STORM=envBase({sun:HSUN,sunSize:0.05,sunCol:hx('#8a96a4'),sky:hx('#5a6672'),gnd:hx('#3a4a3c'),fog:hx('#56626e'),fogD:2600,zen:hx('#2a3038'),hor:hx('#7a8692'),gndCol:hx('#5a6670'),night:0.25});
const E_DARK=envBase({sun:HSUN,sunSize:0.05,sunCol:hx('#6a6e96'),sky:hx('#3a3e58'),gnd:hx('#2a3034'),fog:hx('#383c54'),fogD:2200,zen:hx('#14161e'),hor:hx('#545a76'),gndCol:hx('#3a4050'),night:0.45});
const E_BOLT=envBase({sun:HSUN,sunSize:0.05,sunCol:hx('#e8f0ff'),sky:hx('#c8d8ff'),zen:hx('#a0b4ff'),hor:hx('#f0f4ff'),fog:hx('#b8c8f0'),fogD:4000,gnd:hx('#a0a8c0'),gndCol:hx('#d0d8f0')});
const E_EYE=envBase({sun:HSUN,sunSize:0.6,sunCol:hx('#fff0d0'),sky:hx('#8ec0f0'),zen:hx('#2a6ad0'),hor:hx('#cfe4f6'),fog:hx('#b8d0e6'),fogD:5000,gnd:hx('#6a7a5a'),gndCol:hx('#b8d0e6')});
const E_CLEAR=envBase({sun:SUNDIR5,sunSize:1.2,sunCol:hx('#fff2dc'),sky:hx('#a8d0f4'),zen:hx('#3a7ad8'),hor:hx('#e4f0fa'),fog:hx('#cfe2f2'),fogD:5000,gnd:hx('#7a8a5a'),gndCol:hx('#cfe2f2')});
const BOLTS=[0.25,1.0,2.3,6.1,11.6,15.6,22.6,25.6,26.6,27.4,32.6,34.4];
function envAt(t){const rn=roundAt(t);let e=E_STORM;const fl=(t0,a,d,E)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E||E_BOLT,a*(1-k/d))};
  if(rn===2)e=mixEnv(E_STORM,E_DARK,ease((t-R[2])/1.5));
  if(rn===3){e=mixEnv(E_STORM,E_EYE,ease((t-EV.k4+0.6)/2.2))}
  if(rn===4){e=mixEnv(E_EYE,E_CLEAR,ease((t-R[4])/1.2))}
  if(rn<=2)for(const b of BOLTS)fl(b,0.45,0.35);
  if(rn===2)fl(EV.hit3,0.5,0.8);
  return e}
