// ===================== ALPHA CENTAURI vs ONE DYING ANT (riding a Starshot light sail) =====================
// ---------- new meshes ----------
// light sail: thin iridescent mirror square with glowing cyan rim + gold StarChip
const SAILW=1.7;
const MSAIL=um(m=>{const N=14,S=SAILW;for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x0=-S+2*S*i/N,x1=-S+2*S*(i+1)/N,z0=-S+2*S*j/N,z1=-S+2*S*(j+1)/N;
    const cf=(x,z)=>{const k=0.5+0.5*Math.sin(x*1.3+z*0.9);const k2=0.5+0.5*Math.sin(z*1.7-x*0.6+1);return mix3(mix3(hx('#6a7690'),hx('#8a7aa0'),k),hx('#5a8a98'),k2*0.45)};
    m.quad([x0,0,z0],[x0,0,z1],[x1,0,z1],[x1,0,z0],[cf(x0,z0),cf(x0,z1),cf(x1,z1),cf(x1,z0)])}
  m.quad([-S,-0.012,-S],[S,-0.012,-S],[S,-0.012,S],[-S,-0.012,S],hx('#4a4e60'));
  const rim=[[-S,0.01,-S],[S,0.01,-S],[S,0.01,S],[-S,0.01,S],[-S,0.01,-S]];for(let i=0;i<4;i++){const pts=[];for(let k=0;k<=6;k++)pts.push(V.add(rim[i],V.sc(V.sub(rim[i+1],rim[i]),k/6)));tubeP(m,pts,f=>0.022,f=>[0.55,1,1],MAT.glass,6)}
  for(let k=1;k<6;k++){const u=-S+2*S*k/6;m.box([u,0.004,0],[0.008,0.004,2*S],[0.75,0.95,1],MAT.glass);m.box([0,0.004,u],[2*S,0.004,0.008],[0.75,0.95,1],MAT.glass)}
  m.box([1.05,0.035,0.95],[0.34,0.05,0.34],hx('#d8a838'));m.box([1.05,0.064,0.95],[0.22,0.012,0.22],hx('#202838'));
  for(let k=0;k<4;k++)m.box([0.97+k*0.055,0.072,0.95],[0.02,0.006,0.16],[0.4,0.9,1],MAT.glass);
},0.5);
const BEAMC=um(m=>m.prism([0,-0.5,0],1,1,1,32,[1,1,1],MAT.glass));
const P5DIR=V.norm([-0.154,0.174,0.973]);const PBDIR=V.norm([-0.438,0.052,0.897]);
const PROXB=um(m=>sphC(m,[0,0,0],1,p=>{const n=fbm(p[0]*2.2+3,p[2]*2.2+p[1]*1.6,5),d=vnoise(p[0]*9+1,p[1]*9+p[2]*7);const L=V.norm(V.sub(P5DIR,V.sc(PBDIR,0.85)));const dl=V.dot(V.norm(p),L);
  let c=n>0.5?mix3(hx('#b0563a'),hx('#e09a64'),clamp((n-0.5)*4,0,1)):mix3(hx('#1a2a40'),hx('#2a5a6a'),n*1.6);c=mix3(c,hx('#7a3a2a'),clamp((d-0.7)*3,0,0.5));
  if(dl<-0.05)c=mix3(c,hx('#dde6f0'),clamp((-dl-0.05)*3,0,0.9));
  const sh=clamp(0.05+1.15*Math.max(0,dl)+0.25*clamp(dl+0.15,0,0.15)/0.15,0.05,1.15);const rim=Math.pow(1-Math.abs(V.dot(V.norm(p),PBDIR)),3);return V.add(V.sc(c,sh),V.sc([1,0.55,0.4],rim*0.35*clamp(dl+0.4,0,1)))},[64,96],MAT.glass));
const PROXS=um(m=>sphC(m,[0,0,0],1,p=>{const n=vnoise(p[0]*7+2,p[1]*7+p[2]*5),q=vnoise(p[0]*19,p[1]*19-p[2]*13);return mix3([0.78,0.16,0.06],[1,0.5,0.22],clamp(0.15+n*0.8+(q-0.5)*0.4,0,1))},[28,40],MAT.glass));
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.45,h1:1.35,e1:4.0,hit1:7.4,res1:9.9,
  s2:14.2,hit2:17.6,boom2:18.6,res2:20.6,
  b3:25.0,hit3:28.4,crk3:30.0,res3:30.7,
  k4:36.0,c4:39.0,res4:41.6,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.6,res5:54.0,loop:65.5};
const ROUNDS=[['ROUND 1','A 100 GIGAWATT LASER 🔦','Ant: free tan 😎',EV.res1],['ROUND 2','40 TRILLION KM OF NOTHING 🌌','Ant: brought snacks 😎',EV.res2],['ROUND 3','THREE SUNS ☀️☀️🔴','Ant: triple tan 😎',EV.res3],['ROUND 4','A PROXIMA SUPERFLARE ⚡','Ant: SPF 1,000,000 😎',EV.res4],['FINAL ROUND','ONE calendar 📅','Cause of death: ONE calendar 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){return 0}
function sjD(t){return 0}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// ---------- environments (deep space; env.sun = the star that lights the ant) ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#3a4a7a'),gnd:hx('#1a1a2a'),fog:hx('#05061a'),fogD:1e7,zen:hx('#020310'),hor:hx('#0a0c26'),stars:1,night:0.8,emis:1,ground:0,gndCol:hx('#05061a'),sunSize:0.6},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const SOLDIR=V.norm([-0.75,0.45,0.5]);
const ADIR=V.norm([-0.127,0.407,0.905]);
const BDIR=V.norm([-0.0495,0.326,0.944]);
const PDIR=V.norm([-0.233,0.326,0.916]);
const E_EARTH=envBase({sun:SOLDIR,sunCol:hx('#fff4e0'),sky:hx('#5a7ab0'),gnd:hx('#1a3a6a'),hor:hx('#0c1838'),zen:hx('#02040e'),sunSize:1.2});
const E_DEEP=envBase({sun:SOLDIR,sunCol:hx('#c8d0f0'),sky:hx('#2a3466'),gnd:hx('#121428'),hor:hx('#0a0a24'),zen:hx('#010208'),sunSize:0.35});
const E_ACEN=envBase({sun:ADIR,sunCol:hx('#ffe8c0'),sky:hx('#5a4a6a'),gnd:hx('#2a1a20'),hor:hx('#1a1028'),zen:hx('#03020a'),sunSize:0.01});
const E_PROX=envBase({sun:PDIR,sunCol:hx('#ff8a5a'),sky:hx('#6a2a2a'),gnd:hx('#2a0c10'),hor:hx('#2a0a14'),zen:hx('#060104'),sunSize:0.01});
const E_FLARE=envBase({sun:PDIR,sunCol:hx('#ffffff'),sky:hx('#e8d8ff'),gnd:hx('#8a6aa8'),hor:hx('#4a2a7a'),zen:hx('#2a1050'),sunSize:0.01});
const E_PB=envBase({sun:P5DIR,sunCol:hx('#ff9a6a'),sky:hx('#7a3a3a'),gnd:hx('#2a1418'),hor:hx('#1e0a14'),zen:hx('#050106'),sunSize:0.01});
const E_FLASH=envBase({sun:SOLDIR,sunCol:hx('#ffffff'),sky:hx('#ffe8ff'),zen:hx('#2a1030'),hor:hx('#5a2a5a'),gnd:hx('#c8a0d8'),sunSize:1.2});
function envAt(t){const rn=roundAt(t);let e=E_EARTH;const fl=(t0,a,d,E)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E||E_FLASH,a*(1-k/d))};
  if(rn<=0){fl(EV.h0,0.15,0.4);fl(EV.h1,0.15,0.4);if(t>=EV.e1&&t<EV.hit1)e=mixEnv(e,E_FLASH,0.1*ease((t-EV.e1)/(EV.hit1-EV.e1)));fl(EV.hit1,0.4,0.8);if(t>=EV.hit1)e=mixEnv(e,E_DEEP,ease((t-EV.hit1-1)/4))}
  else if(rn===1){e=E_DEEP;fl(EV.hit2,0.35,0.4);fl(EV.boom2,0.3,0.4)}
  else if(rn===2){e=mixEnv(E_DEEP,E_ACEN,ease((t-EV.b3)/3))}
  else if(rn===3){e=mixEnv(E_ACEN,E_PROX,ease((t-R[3])/1.2));if(t>=EV.c4)e=mixEnv(e,E_FLARE,0.95*(1-ease((t-EV.c4-0.4)/2.2)))}
  else{e=mixEnv(E_PROX,E_PB,ease((t-R[4])/1.2))}
  return e}
