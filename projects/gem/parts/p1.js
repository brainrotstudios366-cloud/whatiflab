// ===================== GEMINID METEOR SHOWER vs ONE DYING ANT =====================
// ---------- new meshes ----------
// night meadow ground tile (replaces the grass/road TILE)
function gemCol(x,z){const n=fbm(x*0.05+3,z*0.05,3),q=fbm(x*0.4,z*0.4+7,2);const c=mix3(hx('#24502a'),hx('#3f7a34'),clamp(0.25+n*0.9,0,1));return mix3(c,hx('#5a4a32'),clamp((q-0.6)*1.4,0,0.45))}
function buildGemTile(){const T=200,m=new MB();const r=rngG(21);
  ground(m,-60,-T,60,0,null,0,6,(x,z)=>gemCol(x,z));
  for(const s of[-1,1])ground(m,s>0?60:-400,-T,s>0?400:-60,0,null,0,20,(x,z)=>V.sc(gemCol(x,z),0.9));
  // grass blades
  for(let i=0;i<2600;i++){const x=(r()<0.5?-1:1)*(0.45+Math.pow(r(),1.5)*16),z=-r()*T;const h=0.08+r()*0.22*(1+Math.abs(x)*0.08),yaw=r()*TAU2,w=0.018+r()*0.02,lx=(r()-0.5)*h*0.6,lz=(r()-0.5)*h*0.6;
    const b0=[x+Math.cos(yaw)*w,0,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,0,z-Math.sin(yaw)*w],tip=[x+lx,h,z+lz];const cb=hx(r()<0.5?'#1f4a22':'#2a5a28'),ct=hx(r()<0.5?'#6aa04a':'#8ab85a');m.tri(b0,b1,tip,[cb,cb,ct])}
  for(let i=0;i<220;i++){const x=(r()<0.5?-1:1)*(1.4+Math.pow(r(),1.4)*70),z=-r()*T,s=0.04+Math.pow(r(),3)*0.8;m.ico([x,0,z],s,mix3(hx('#5a5650'),hx('#9a948a'),r()),0,0.55,[5,7])}
  for(let i=0;i<50;i++){const x=(r()-0.5)*2.6,z=-r()*T;if(Math.abs(x)<0.45)continue;m.ico([x,0,z],0.02+r()*0.04,mix3(hx('#4a4640'),hx('#8a847a'),r()),0,0.6,[4,6])}
  // small flowers (tiny emissive dots read as fireflies-ish highlights)
  for(let i=0;i<70;i++){const x=(r()<0.5?-1:1)*(0.7+r()*8),z=-r()*T;m.ico([x,0.12+r()*0.1,z],0.022,hx(r()<0.5?'#e8e0ff':'#ffd8f0'),0,1,[3,4])}
  return{mesh:m.build(0.45),T}}
const MTILE=buildGemTile();
// ONE speck of space dust (dark metallic, glints)
const MGRAIN=um(m=>blob(m,[0,0,0],1,p=>mix3([0.22,0.22,0.26],[0.62,0.58,0.52],clamp(p[1]*0.6+0.5,0,1)),5,0.55,[8,12]),0.4);
// 3200 Phaethon: lumpy rock, one side red-hot
const PH_L=V.norm([0.85,0.35,-0.4]);
const PHAE=um(m=>blob(m,[0,0,0],1,p=>{const n=vnoise(p[0]*4+1,p[1]*4+p[2]*3),c=vnoise(p[0]*9+5,p[1]*9-p[2]*7);const nn=V.norm(p);const sh=0.45+0.8*Math.max(0,V.dot(nn,PH_L));const base=V.sc(mix3(hx('#3e3834'),hx('#7a7068'),n),sh);const crack=clamp((c-0.74)*7,0,1);const rim=clamp(nn[0]*1.3-0.2,0,1);return mix3(base,mix3(hx('#ff3a08'),hx('#ffb050'),c),Math.max(crack,rim*rim*0.6))},11,0.78,[18,26],MAT.glass),0.5);
const PCRUMB=um(m=>blob(m,[0,0,0],1,p=>{const nn=V.norm(p);const sh=0.25+0.9*Math.max(0,V.dot(nn,PH_L));return V.sc([0.75,0.62,0.5],sh)},3,0.7,[5,8],MAT.glass),0.4);
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.45,h1:1.35,e1:4.0,hit1:7.4,crk1:8.0,res1:9.9,
  s2:14.2,hit2:17.6,boom2:18.9,res2:20.6,
  b3:25.0,hit3:28.4,crk3:30.0,res3:30.7,
  k4:36.0,c4:39.0,res4:41.6,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.6,res5:54.0,loop:65.5};
const ROUNDS=[['ROUND 1','ONE Geminid meteor ☄️','Ant: unbothered 😎',EV.res1],['ROUND 2','A FIREBALL 🔥','Ant: free fireworks 😎',EV.res2],['ROUND 3','120 METEORS PER HOUR 🌠','Ant: made 120 wishes 😎',EV.res3],['ROUND 4','THE MOTHERSHIP: PHAETHON 🪨','Ant: it flew by, millions of km away 😎',EV.res4],['FINAL ROUND','ONE speck of space dust ✨','Cause of death: ONE speck of space dust 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){if(t<R[0])return 1;if(t<R[1])return t<EV.e1+1.0?1:(t>=EV.res1+1.0?1:0);if(t<R[2])return t<EV.s2+1.4?0.9:(t>=EV.res2+1.4?0.9:0);
  if(t<R[3])return t<EV.b3+1.0?0.9:(t>=EV.res3+1.2?0.9:0);if(t<R[4])return t<EV.k4+0.6?0.9:(t>=EV.res4+1.4?0.9:0);if(t<R[5])return t<EV.look5?0.75:0;return 0}
const SJ_DT=1/120,SJ_TAB=[0];for(let i=1;i<=DUR/SJ_DT+10;i++){const tm=(i-0.5)*SJ_DT;SJ_TAB.push(SJ_TAB[i-1]+sjSpd(tm)*SJ_DT*1.1)}
function sjD(t){t=clamp(t,0,DUR+0.05);const f=t/SJ_DT,i=Math.floor(f);return lerp(SJ_TAB[i],SJ_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const SUNDIR5=V.norm([0.42,0.1,1]),GMOON=V.norm([-0.45,0.45,-0.6]);
const E_NIGHT=envBase({sunSize:0.45,sun:GMOON,sunCol:hx('#9fb4ec'),sky:hx('#141c3c'),gnd:hx('#1c2a2a'),fog:hx('#18224a'),fogD:6000,zen:hx('#03040e'),hor:hx('#2c3a6e'),gndCol:hx('#2a3a4a'),stars:1,night:0.75});
const E_DEEP=envBase({sunSize:0.45,sun:GMOON,sunCol:hx('#8aa0e0'),sky:hx('#0c1230'),gnd:hx('#141e24'),fog:hx('#101838'),fogD:6000,zen:hx('#010208'),hor:hx('#22306a'),gndCol:hx('#1e2a3a'),stars:1,night:0.85});
const E_GREEN=envBase({sunSize:0.45,sun:GMOON,sunCol:hx('#d8ffd0'),sky:hx('#5a9a7a'),gnd:hx('#3a6a4a'),fog:hx('#6ab090'),fogD:7000,zen:hx('#1a4a3a'),hor:hx('#b0ffd8'),gndCol:hx('#7ac0a0'),stars:0.3,night:0.2});
const E_HOT=envBase({sunSize:0.45,sun:GMOON,sunCol:hx('#ffb080'),sky:hx('#3a1c30'),gnd:hx('#3a2020'),fog:hx('#4a2438'),fogD:6000,zen:hx('#0a0410'),hor:hx('#8a3a3a'),gndCol:hx('#5a3030'),stars:0.8,night:0.55});
const E_FLASH=envBase({sunSize:0.45,sun:GMOON,sunCol:hx('#ffffff'),sky:hx('#fff8e8'),zen:hx('#fff0d8'),hor:hx('#ffffff'),fog:hx('#fff4e8'),fogD:7000,gnd:hx('#e0d8c0'),gndCol:hx('#fff0e0')});
const E_DAWN=envBase({sun:SUNDIR5,sunCol:hx('#fff0d8'),sky:hx('#e8a888'),zen:hx('#3a4a8a'),hor:hx('#ffd0a0'),fog:hx('#e0b0a0'),fogD:6000,gnd:hx('#5a6a3a'),gndCol:hx('#c0a080'),sunSize:1.4,stars:0.15});
function envAt(t){const rn=roundAt(t);let e=E_NIGHT;const fl=(t0,a,d,E)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E||E_FLASH,a*(1-k/d))};
  if(rn<=0){fl(EV.h0,0.25,0.4);fl(EV.h1,0.22,0.4);if(t>=EV.e1)e=mixEnv(e,E_FLASH,0.1*ease((t-EV.e1)/(EV.hit1-EV.e1))*(t<EV.hit1?1:0));fl(EV.hit1,0.6,0.7)}
  else if(rn===1){if(t>=EV.s2)e=mixEnv(e,E_GREEN,0.35*ease((t-EV.s2)/2.5)*(t<EV.hit2?1:0));fl(EV.hit2,0.9,1.6,E_GREEN);fl(EV.boom2,0.3,0.5)}
  else if(rn===2){e=mixEnv(E_NIGHT,E_DEEP,ease((t-R[2])/1.5))}
  else if(rn===3){e=E_DEEP;if(t>=EV.k4)e=mixEnv(e,E_HOT,0.65*ease((t-EV.k4)/2.5)*(1-ease((t-EV.res4-0.3)/1.6)))}
  else{e=mixEnv(E_DEEP,E_DAWN,ease((t-R[4])/1.6))}
  return e}
