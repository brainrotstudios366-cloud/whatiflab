// ===================== SPACE JUNK vs ONE DYING ANT =====================
// ---------- new meshes (meters in BG) ----------
// dead satellite: gold-foil box + 2 blue solar wings + dish
const SJ_SAT=um(m=>{m.box([0,0,0],[2,2.2,2],hx('#d8a838'));m.box([0,1.2,0],[1.6,0.2,1.6],hx('#b8b8c0'));
  for(const s of[-1,1]){m.box([s*1.4,0,0],[0.8,0.12,0.12],hx('#9a9aa2'));for(let k=0;k<3;k++)m.box([s*(2.3+k*1.55),0,0],[1.45,0.06,1.9],hx('#2050b0'),MAT.win,0,hx('#3a78e0'))}
  m.prism([0,-1.1,0],0.2,1.1,0.5,16,hx('#e8e8e8'));m.prism([0,-1.6,0],0.06,0.06,0.6,8,hx('#888'))},0.5);
// rocket booster: 70 m steel cylinder, grid fins, engine skirt (base at y=0)
const SJ_BOOST=um(m=>{const R0=4.5;for(let i=0;i<14;i++){const y=i*5;const c=i%2?hx('#c4c8cc'):hx('#b4b8bc');m.prism([0,y,0],R0,R0,5,32,c)}
  m.prism([0,70,0],R0,R0*0.92,1.2,32,hx('#a8acb0'));m.prism([0,71.2,0],R0*0.92,0.1,0.6,32,hx('#a8acb0'));
  for(let i=0;i<4;i++){const a=i*Math.PI/2+0.4;m.box([Math.cos(a)*(R0+1.0),66,Math.sin(a)*(R0+1.0)],[Math.abs(Math.sin(a))*0.3+Math.abs(Math.cos(a))*2.2,2.6,Math.abs(Math.cos(a))*0.3+Math.abs(Math.sin(a))*2.2],hx('#3a3c40'))}
  for(let i=0;i<3;i++){const a=i/3*TAU2+0.5;m.box([Math.cos(a)*(R0+0.15),62,Math.sin(a)*(R0+0.15)],[0.5,4,0.5],hx('#7a7c80'))}
  m.prism([0,-1.2,0],R0*0.95,R0,1.2,32,hx('#2a2a2e'));for(let i=0;i<8;i++){const a=i/8*TAU2;m.prism([Math.cos(a)*2.9,-2.2,Math.sin(a)*2.9],0.7,0.45,1.0,12,hx('#1a1a1c'))}m.prism([0,-2.2,0],0.7,0.45,1.0,12,hx('#1a1a1c'))},0.4);
const SJ_BCONE=um(m=>{const s=28;for(let i=0;i<s;i++){const a=i/s*TAU2,b=(i+1)/s*TAU2;m.tri([0,0,0],[Math.cos(a),-1,Math.sin(a)],[Math.cos(b),-1,Math.sin(b)],[1,1,1],MAT.glass)}});
// FG: bolt + paint fleck + crater
const SJ_BOLT=um(m=>{m.prism([0,-0.11,0],0.05,0.05,0.22,6,hx('#8a8a90'));m.prism([0,0.11,0],0.09,0.09,0.06,6,hx('#9a9aa0'))},0.3);
const SJ_FLECK=um(m=>{m.box([0,0,0],[1,0.18,0.75],hx('#f4f4f6'));m.box([0.12,0.1,0.05],[0.55,0.06,0.4],hx('#e84a3a'))},0.3);
const SJ_CRATER=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const w=1+0.12*Math.sin(i*1.9);m.tri([0,0,0],[Math.cos(b)*w,0,Math.sin(b)*w],[Math.cos(a)*w,0,Math.sin(a)*w],[0.18,0.15,0.13])}
  for(let i=0;i<14;i++){const a=i/14*TAU2;m.ico([Math.cos(a)*1.15,0.02,Math.sin(a)*1.15],0.18+0.08*Math.sin(i*2.7),hx('#7a6a58'),0,0.5,[4,6])}},0.3);
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.45,b1:4.0,hit1:7.0,res1:9.6,
  s2:14.2,hit2:19.0,res2:20.8,
  b3:25.0,land3:30.0,res3:31.6,
  k4:36.0,c4:38.6,res4:42.4,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.6,res5:54.0,loop:65.5};
const ROUNDS=[['ROUND 1','ONE BOLT AT 28,000 km/h 🔩','Missed by 1 cm 😎',EV.res1],['ROUND 2','A FALLING DEAD SATELLITE 🛰️','Free solar panels ☀️😎',EV.res2],['ROUND 3','A 70 m ROCKET BOOSTER 🚀','Nice landing. Ant: 6/10 🥱',EV.res3],['ROUND 4','KESSLER SYNDROME 💥','Ant: free fireworks 🎆',EV.res4],['FINAL ROUND','ONE paint fleck 🎨','Cause of death: ONE paint fleck 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){if(t<R[0])return 1;if(t<R[1])return t<EV.b1+1.0?1:(t>=EV.res1+1.0?1:0);if(t<R[2])return t<EV.s2+1.6?0.9:(t>=EV.res2+1.4?0.9:0);
  if(t<R[3])return t<EV.b3+1.2?0.9:0;if(t<R[4])return 0;if(t<R[5])return t<EV.look5?0.75:0;return 0}
const SJ_DT=1/120,SJ_TAB=[0];for(let i=1;i<=DUR/SJ_DT+10;i++){const tm=(i-0.5)*SJ_DT;SJ_TAB.push(SJ_TAB[i-1]+sjSpd(tm)*SJ_DT*1.1)}
function sjD(t){t=clamp(t,0,DUR+0.05);const f=t/SJ_DT,i=Math.floor(f);return lerp(SJ_TAB[i],SJ_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const SUNDIR=V.norm([-0.5,0.5,-0.6]),SUNDIR5=V.norm([0.42,0.1,1]);
const E_DAY=envBase({sun:SUNDIR,sunCol:hx('#fff0d8'),sky:hx('#86b4ea'),zen:hx('#1d4ab0'),hor:hx('#d8e6f4'),fog:hx('#c8d8ea'),fogD:7000,gnd:hx('#6a7a58'),gndCol:hx('#b8c4c8')});
const E_FLASH=envBase({sun:SUNDIR,sunCol:hx('#ffffff'),sky:hx('#fff4e0'),zen:hx('#ffe8c0'),hor:hx('#ffffff'),fog:hx('#fff0dc'),fogD:7000,gnd:hx('#d0c8b0'),gndCol:hx('#fff0dc')});
const E_DUSK=envBase({sun:V.norm([0.7,0.12,-0.7]),sunCol:hx('#ffa070'),sky:hx('#6a5a9a'),zen:hx('#141a4a'),hor:hx('#ff8a50'),fog:hx('#8a6a8a'),fogD:6000,gnd:hx('#4a4a58'),gndCol:hx('#5a4a60'),stars:0.3,night:0.4});
const E_NIGHT=envBase({sun:V.norm([0.3,0.25,-0.6]),sunCol:hx('#6a88b8'),sky:hx('#0e1a38'),gnd:hx('#1e2a30'),fog:hx('#0e2030'),fogD:6000,zen:hx('#03050f'),hor:hx('#22305a'),gndCol:hx('#0e2030'),stars:1,night:1});
const E_DAWN=envBase({sun:SUNDIR5,sunCol:hx('#ffe0b0'),sky:hx('#9ab8e0'),zen:hx('#3a68c0'),hor:hx('#ffcf9a'),fog:hx('#e0d0c0'),fogD:7000,gnd:hx('#7a8060'),gndCol:hx('#d8c8a8'),sunSize:2.5});
function envAt(t){const rn=roundAt(t);let e=E_DAY;const fl=(t0,a,d)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E_FLASH,a*(1-k/d))};
  if(rn<=0){fl(EV.h0,0.5,0.6);fl(EV.hit1,0.6,0.8)}
  else if(rn===1){fl(EV.hit2,0.85,1.6)}
  else if(rn===2){e=mixEnv(E_DAY,E_DUSK,ease((t-R[2])/1.0));const k=t-EV.b3;if(k>0&&t<EV.land3+1.5){const g=t<EV.land3?ease(k/3)*0.35:0.35+0.3*(1-ease((t-EV.land3)/1.5));e=mixEnv(e,envBase({sun:E_DUSK.sun,sunCol:hx('#ffc080'),sky:hx('#c08060'),zen:hx('#3a2a50'),hor:hx('#ffb070'),fog:hx('#b08070'),fogD:6000,gnd:hx('#8a6a50'),gndCol:hx('#a07a60'),night:0.3}),g)}}
  else if(rn===3){e=mixEnv(E_DUSK,E_NIGHT,ease((t-R[3])/0.8));const c=t-EV.c4;if(c>0&&c<4)e=mixEnv(e,envBase({sun:E_NIGHT.sun,sunCol:hx('#c0a0ff'),sky:hx('#3a2a6a'),zen:hx('#0a0820'),hor:hx('#8a4a8a'),fog:hx('#2a2050'),fogD:6000,gnd:hx('#2a2a40'),gndCol:hx('#2a2050'),stars:1,night:1}),0.5*Math.sin(Math.PI*c/4))}
  else{e=mixEnv(E_NIGHT,E_DAWN,ease((t-R[4])/1.2))}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  const to=(e2,a2,k)=>{eye=[lerp(eye[0],e2[0],k),lerp(eye[1],e2[1],k),lerp(eye[2],e2[2],k)];at=[lerp(at[0],a2[0],k),lerp(at[1],a2[1],k),lerp(at[2],a2[2],k)]};
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.8+k*0.1,-3.5-k*0.4];at=[0.2,0.95,0.4]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.2,1.4,k)+sway*0.2,lerp(0.9,0.7,k),lerp(-3.9,-3.7,k)];at=[lerp(0.2,0.35,k),lerp(0.95,1.25,k),lerp(0.4,0.6,k)];
    if(t>=EV.hit1-0.2){to([1.3,1.05,-3.1],[0.35,0.55,0.2],ease((t-EV.hit1+0.2)/0.6))}
    if(t>=EV.res1){to([1.5,0.95,-3.0],[0.2,0.65,0.2],ease((t-EV.res1)/0.8))}}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.5,1.2,k)+sway*0.2,lerp(0.95,0.45,k),lerp(-3.0,-4.2,k)];at=[lerp(0.2,-0.3,k),lerp(0.65,1.45,k),lerp(0.2,1.0,k)];
    if(t>=EV.hit2+0.4){to([1.6,0.9,-3.4],[0.1,0.6,0.3],ease((t-EV.hit2-0.4)/0.9))}}
  if(rn===2){const k=ease((t-R[2])/1.4);eye=[lerp(1.6,2.0,k)+sway*0.2,lerp(0.9,0.42,k),lerp(-3.4,-4.6,k)];at=[lerp(0.1,-0.6,k),lerp(0.6,1.75,k),lerp(0.3,1.3,k)];
    if(t>=EV.land3+0.6){to([1.5,0.75,-3.6],[-0.2,0.95,0.6],ease((t-EV.land3-0.6)/1.2))}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[lerp(1.5,-1.6,k)+sway*0.2,lerp(0.75,0.7,k),lerp(-3.6,-3.9,k)];at=[lerp(-0.2,0.3,k),lerp(0.95,1.25,k),lerp(0.6,1.0,k)];
    if(t>=EV.res4-0.2){to([-1.5,0.8,-3.2],[-0.1,0.8,0.5],ease((t-EV.res4+0.2)/1.0))}}
  if(rn===4){const k=ease((t-R[4])/1.0);eye=[lerp(-1.5,1.9,k)+sway*0.3,lerp(0.8,1.1,k),lerp(-3.2,-3.9,k)];at=[lerp(-0.1,0.3,k),lerp(0.8,0.7,k),lerp(0.5,0.2,k)];
    if(t>=EV.look5-0.3){const kk=ease((t-EV.look5+0.3)/1.0);to([0.9,0.95,-2.3],[0.25,0.8,0.1],kk)}
    if(t>=EV.hit5-0.3){to([1.1,1.4,-3.1],[-0.2,0.4,0],ease((t-EV.hit5+0.3)/0.9))}}
  if(t>=R[5])eye=[1.1,1.4,-3.1],at=[-0.2,0.4,0];
  return{eye,at}}
// ---------- helpers ----------
function streak(items,head,d,len,w,col,a){const c=V.sub(head,V.sc(d,len/2));items.push({mesh:SPARK,M:M4.mul(M4.trs(c,Math.atan2(d[0],d[2]),-Math.asin(clamp(d[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[w/0.06,w/0.06,len])),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
function sparkBurst(items,p,t,n,seed,sc){for(let i=0;i<n;i++){const ph=((t*3.2+hsh(i,seed))%1);const d=V.norm([hsh(i,seed+1)-0.5,0.4+hsh(i,seed+2),hsh(i,seed+3)-0.5]);const v=(1.5+hsh(i,seed+4)*2.5)*sc;
  const q=[p[0]+d[0]*v*ph,p[1]+d[1]*v*ph-4.9*ph*ph*sc,p[2]+d[2]*v*ph];if(q[1]<0)continue;const vel=V.norm([d[0],d[1]-9.8*ph/v,d[2]]);
  items.push({mesh:SPARK,M:M4.mul(M4.trs(q,Math.atan2(vel[0],vel[2]),-Math.asin(clamp(vel[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[0.35*sc,0.35*sc,1.6*sc*(1-ph)])),tint:mix3([1,1,0.85],[1,0.55,0.15],ph),tintAmt:1,alpha:1-ph,add:1,noShadow:true})}}
function burst(items,p,k,n,seed,sc,col,grav){for(let i=0;i<n;i++){const d=V.norm([hsh(i,seed)-0.5,0.25+hsh(i,seed+1)*0.9,hsh(i,seed+2)-0.5]);const v=(0.6+hsh(i,seed+3))*sc;const g=grav==null?4.9:grav;
  const q=[p[0]+d[0]*v*k,p[1]+d[1]*v*k-g*k*k*sc*0.3,p[2]+d[2]*v*k];if(q[1]<0)continue;const vel=V.norm([d[0],d[1]-g*0.6*k/v*sc,d[2]]);streak(items,q,vel,0.25*sc*Math.max(0.2,1-k),0.03*sc,col||mix3([1,1,0.85],[1,0.5,0.15],clamp(k,0,1)),Math.max(0,1-k/1.2))}}
function puff(items,p,k,n,sc,col,a0){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);if(k<0||k>1.6)continue;const d=easeOut(k/1.0)*sc*(0.8+0.4*hsh(j,3));items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1*sc+k*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+k*0.25)*sc),tint:col||[0.72,0.68,0.6],tintAmt:1,alpha:Math.max(0,(a0||0.7)*(1-k/1.6)),noShadow:true})}}
// ---------- background world: power line + village (from solar) ----------
const SF_POLES=[];for(let i=-5;i<=5;i++)SF_POLES.push([i*28+8,0,38+Math.sin(i*1.3)*1.5]);
function poleGeo(m,x,z){m.prism([x,0,z],0.17,0.12,9.5,8,hx('#5a4030'));m.box([x,8.9,z],[3.0,0.18,0.2],hx('#4a3428'));for(const s of[-1.3,0,1.3])m.box([x+s,9.1,z],[0.1,0.25,0.1],hx('#c8c8c0'))}
let SF_BG,SF_WIN=[];{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#6a9850'));const r=rngG(55);
  for(let i=0;i<240;i++){const a=r()*TAU2,d=260+r()*3600;const tx=Math.cos(a)*d,tz=Math.sin(a)*d;if(tz>0&&Math.abs(tx+0.3*tz)<tz*0.75&&d<2200)continue;tree(m,tx,tz,5+r()*5,0,r()<0.45?'pine':'')}
  for(let i=0;i<14;i++){const sd=i<7?-1:1;const x=sd*(45+r()*60),z=60+r()*90;tree(m,x,z,3+r()*3,0,r()<0.5?'pine':'')}
  for(const p of SF_POLES)poleGeo(m,p[0],p[2]);
  for(let i=0;i<SF_POLES.length-1;i++){const a=SF_POLES[i],b=SF_POLES[i+1];for(const s of[-1.3,0,1.3]){const pts=[];for(let k=0;k<=8;k++){const f=k/8;pts.push([lerp(a[0],b[0],f)+s,9.2-1.1*Math.sin(f*Math.PI),lerp(a[2],b[2],f)])}tubeP(m,pts,()=>0.035,()=>[0.12,0.12,0.13],0,4)}}
  for(let i=0;i<11;i++){const x=-180+i*36+(r()-0.5)*12,z=190+r()*90,w=8+r()*4,d=7+r()*3,h=4.5+r()*2;house(m,x,z,w,d,h,hx(['#c8b8a0','#a88a70','#d8d0c0','#9a7a60'][i%4]),hx(['#7a3a2a','#4a4a5a','#6a3020'][i%3]),(r()-0.5)*0.4);
    for(const wx of[-0.25,0.25])SF_WIN.push([x+wx*w,h*0.45,z-d/2-0.08])}
  // landing pad for the booster
  m.prism([-40,0.02,150],16,16,0.15,40,hx('#8a8a88'));for(let i=0;i<8;i++){const a=i/8*TAU2;m.box([-40+Math.cos(a)*13,0.2,150+Math.sin(a)*13],[1.2,0.1,1.2],hx('#e8c020'))}
  SF_BG=m.build(0.5)}
const SF_WINM=um(m=>{for(const p of SF_WIN)m.box(p,[1.3,1.3,0.1],[1,1,1],MAT.glass)});
const BOOST_P=[-40,0,150];
// satellite path (BG meters)
const SAT_I=[-6,0,26],SAT_S=[-150,170,520];
function satPos(t){const k=clamp((t-EV.s2)/(EV.hit2-EV.s2),0,1);const kk=Math.pow(k,1.7);return[lerp(SAT_S[0],SAT_I[0],kk),lerp(SAT_S[1],SAT_I[1]+2,kk),lerp(SAT_S[2],SAT_I[2],kk)]}
function boostY(t){const k=clamp((t-EV.b3)/(EV.land3-EV.b3),0,1);return 150*Math.pow(1-k,1.5)}
// ---------- background ----------
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  // village windows at night
  if(rn===2||rn===3){const a=rn===2?ease((t-R[2]-1)/2):1;if(a>0.01){items.push({mesh:SF_WINM,M:M4.id(),tint:[1,0.8,0.45],tintAmt:1,alpha:a,add:1,noShadow:true});for(let i=0;i<SF_WIN.length;i+=2)BGPTS.push({p:SF_WIN[i],c:'255,200,120',r:5,a:0.35*a})}}
  // R2: dead satellite re-entering as a fireball
  if(rn===1&&t>=EV.s2&&t<EV.hit2+3){
    if(t<EV.hit2){const p=satPos(t),p2=satPos(t-0.05);const d=V.norm(V.sub(p,p2));const k=clamp((t-EV.s2)/(EV.hit2-EV.s2),0,1);
      items.push({mesh:SJ_SAT,M:M4.trs(p,t*1.3,0.4+t*0.7,0.3,2.2),tint:[1,0.45,0.15],tintAmt:0.25*k});
      const fr=[1,0.55+0.1*Math.sin(t*40),0.2];items.push({mesh:GSPH,M:M4.trs(V.add(p,V.sc(d,1.5)),0,0,0,4.5*(1+0.1*Math.sin(t*33))),tint:fr,tintAmt:1,alpha:0.55,add:1,noShadow:true});
      for(let i=0;i<18;i++){const q=V.sub(p,V.sc(d,3+i*(4+i*0.6)));items.push({mesh:GSPH,M:M4.trs(q,0,0,0,3.2+i*0.55),tint:mix3([1,0.75,0.3],[0.5,0.18,0.12],i/18),tintAmt:1,alpha:0.35*(1-i/18),add:1,noShadow:true})}
      for(let i=0;i<10;i++){const q=V.sub(p,V.sc(d,8+i*12));items.push({mesh:USPH,M:M4.trs(V.add(q,[0,2,0]),0,0,0,4+i*1.6),tint:[0.35,0.3,0.3],tintAmt:1,alpha:0.25*(1-i/10),noShadow:true})}
      BGPTS.push({p,c:'255,170,80',r:60,a:0.85})}
    else{const k=t-EV.hit2;const ip=SAT_I;items.push({mesh:GSPH,M:M4.trs([ip[0],3,ip[2]],0,0,0,2+easeOut(k/0.5)*16),tint:mix3([1,0.95,0.7],[1,0.35,0.1],clamp(k/0.7,0,1)),tintAmt:1,alpha:Math.max(0,0.9*(1-k/1.4)),add:1,noShadow:true});
      BGPTS.push({p:[ip[0],4,ip[2]],c:'255,190,110',r:120*(1-k/3),a:0.9*(1-k/3)});
      for(let i=0;i<14;i++){const a=i/14*TAU2;const d=easeOut(k/1.2)*(10+hsh(i,4)*8);items.push({mesh:USPH,M:M4.trs([ip[0]+Math.cos(a)*d,2+k*(2+hsh(i,2)*3),ip[2]+Math.sin(a)*d*0.6],0,0,0,4+k*3),tint:[0.42,0.38,0.35],tintAmt:1,alpha:Math.max(0,0.6*(1-k/3)),noShadow:true})}
      // burning wreck: pieces
      for(let i=0;i<5;i++){const q=[ip[0]+(hsh(i,5)-0.5)*14,0.6,ip[2]+(hsh(i,6)-0.5)*6];items.push({mesh:SJ_SAT,M:M4.trs(q,i*1.3,i,0.6*i,0.45),tint:[0.2,0.15,0.12],tintAmt:0.7});BGPTS.push({p:q,c:'255,140,60',r:4,a:0.5*(1-k/3)})}}}
  // R3: rocket booster landing burn
  if(rn===2&&t>=EV.b3){const y=boostY(t);const bp=[BOOST_P[0],y+2.2,BOOST_P[2]];const tilt=y>5?0.04*Math.sin(t*1.7):0;
    items.push({mesh:SJ_BOOST,M:M4.trs(bp,0.3,tilt,0,1)});
    const on=t<EV.land3+0.25;if(on){const fl=1+0.08*Math.sin(t*50)+0.05*Math.sin(t*23);const L=(y<40?10+y*0.5:30)*fl;
      items.push({mesh:SJ_BCONE,M:M4.trs([bp[0],y,bp[2]],0,0,0,[4.2,L*1.4,4.2]),tint:[1,0.7,0.3],tintAmt:1,alpha:0.95,add:1,noShadow:true});
      items.push({mesh:SJ_BCONE,M:M4.trs([bp[0],y,bp[2]],0,0,0,[1.6,L*0.7,1.6]),tint:[1,0.95,0.8],tintAmt:1,alpha:0.9,add:1,noShadow:true});
      BGPTS.push({p:[bp[0],y-8,bp[2]],c:'255,190,110',r:70,a:0.95});BGPTS.push({p:[bp[0],y-3,bp[2]],c:'255,250,220',r:18,a:1});
      if(y<60){const g=1-y/60;for(let i=0;i<16;i++){const a=i/16*TAU2+t*0.3;const d=8+((t*14+hsh(i,3)*20)%30);items.push({mesh:USPH,M:M4.trs([bp[0]+Math.cos(a)*d,1.5+d*0.12,bp[2]+Math.sin(a)*d],0,0,0,3+d*0.18),tint:[0.78,0.72,0.66],tintAmt:1,alpha:0.5*g*(1-d/40),noShadow:true})}}}
    if(t>=EV.land3){const k=t-EV.land3;for(let i=0;i<22;i++){const a=i/22*TAU2;const d=10+easeOut(k/2.5)*(50+hsh(i,7)*30);items.push({mesh:USPH,M:M4.trs([bp[0]+Math.cos(a)*d,2+k*1.2+hsh(i,8)*3,bp[2]+Math.sin(a)*d],0,0,0,6+k*3),tint:[0.8,0.75,0.7],tintAmt:1,alpha:Math.max(0,0.55*(1-k/5)),noShadow:true})}
      // steam venting
      for(let i=0;i<6;i++){const kk=((k*0.6+i/6)%1);items.push({mesh:USPH,M:M4.trs([bp[0]+3,60+kk*25,bp[2]-2],0,0,0,2+kk*6),tint:[0.95,0.95,0.97],tintAmt:1,alpha:0.35*(1-kk),noShadow:true})}}}
  // R4: Kessler syndrome – debris band in orbit, collisions, re-entry streaks
  if(rn===3&&t>=EV.k4-0.3){const a=ease((t-EV.k4+0.3)/1.2)*(1-ease((t-EV.res4-1.8)/1.2));const ang=Math.atan2(dir[0],dir[2]);
    const tc=Math.max(0,t-EV.c4);const n=Math.round(36+Math.min(150,tc*tc*14));
    for(let i=0;i<n;i++){const sp=(0.6+hsh(i,1))*(hsh(i,9)<0.5?1:-1)*0.05;const ph=(hsh(i,2)+t*sp)%1;const s=(ph-0.5)*9000;const d=3500+hsh(i,3)*2500;const y=1300+hsh(i,4)*1500+s*0.08*(hsh(i,5)-0.5);
      const p=P(d,s,y);const vd=V.norm([side[0]*Math.sign(sp),0.0,side[2]*Math.sign(sp)]);const c=i<36?[0.75,0.95,1]:[1,0.75,0.45];streak(items,p,vd,180,16,c,a*0.9)}
    // collisions
    const CT=[EV.c4,EV.c4+0.9,EV.c4+1.5,EV.c4+1.9,EV.c4+2.2,EV.c4+2.45,EV.c4+2.7,EV.c4+2.9,EV.c4+3.1,EV.c4+3.3];
    for(let j=0;j<CT.length;j++){const k=t-CT[j];if(k<0||k>2.2)continue;const p=P(4200+j*230,(hsh(j,11)-0.5)*3600,1600+hsh(j,12)*900);
      items.push({mesh:GSPH,M:M4.trs(p,0,0,0,120+easeOut(k/0.4)*260),tint:[1,0.95,0.8],tintAmt:1,alpha:Math.max(0,0.8*(1-k/0.6)),add:1,noShadow:true});BGPTS.push({p,c:'255,220,170',r:900*(1-k/2.2),a:0.9*(1-k/2.2)});
      burst(items,p,k,14,j*17+3,700,null,0.4)}
    // re-entry streaks falling
    if(t>=EV.c4+0.5)for(let i=0;i<14;i++){const per=1.6+hsh(i,21);const ph=((t-EV.c4)/per+hsh(i,22))%1;const s0=(hsh(i,23)-0.5)*6000;const p=P(3800+hsh(i,24)*1500,s0+ph*900,2200-ph*2000);const vd=V.norm([side[0]*0.45,-1,side[2]*0.45]);
      streak(items,p,vd,700,30,[1,0.65,0.3],a*(ph<0.15?ph/0.15:1)*(1-ph));BGPTS.push({p,c:'255,160,80',r:300,a:0.5*a*(1-ph)})}}
  // dawn sun (FINAL)
  if(rn>=4){const sp=V.sc(SUNDIR5,30000);items.push({mesh:SUNG,M:M4.trs(sp,0,0,0,1300)});BGPTS.push({p:sp,c:'255,215,150',r:6000,a:0.7*ease((t-R[4])/1.2),sun:1})}
  return{items,dir,side}}
// ---------- foreground ----------
let LASTVP=null,QPTS=[];
const HIT1=[0.95,0.02,0.15];
function boltPos(t){const k=clamp((t-EV.b1)/(EV.hit1-EV.b1),0,1);const kk=Math.pow(k,2.4);const S=[-1.2,6,14];return[lerp(S[0],HIT1[0],kk),lerp(S[1],HIT1[1]+0.05,kk),lerp(S[2],HIT1[2],kk)]}
function fleckPos(t){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);const kk=ease(k);const S=[1.7,1.3,1.4],E=[0.02,0.92,-0.32];const w=Math.sin(k*9)*0.18*(1-k);
  return[lerp(S[0],E[0],kk)+w,lerp(S[1],E[1],kk)+Math.cos(k*7)*0.12*(1-k),lerp(S[2],E[2],kk)]}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];const L=TILE;
  let pose='walk',walk=sjSpd(t)>0?1:0,o={t};
  const dist=sjD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // HOOK: tiny debris slams into the ground next to the ant
  if(t<R[0]){const hp=[-0.75,0.02,0.5];const k=t-EV.h0;
    if(k<0&&k>-0.45){const f=(k+0.45)/0.45;const p=[lerp(-3,hp[0],f),lerp(9,hp[1],f),lerp(6,hp[2],f)];const d=V.norm([2.25,-8.98,-5.5]);streak(items,p,V.sc(d,-1),2.2,0.12,[1,0.85,0.6],1);QPTS.push({p,c:'255,220,160',r:0.9,a:1})}
    if(k>=0){items.push({mesh:SJ_CRATER,M:M4.trs(hp,0,0,0,[0.16,1,0.16])});if(k<1.4){burst(items,hp,k,16,3,1.3);puff(items,hp,k,8,0.6);QPTS.push({p:V.add(hp,[0,0.1,0]),c:'255,200,120',r:0.7*(1-k/1.4),a:0.9})}}
    if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.2*j,0],0,0,0.1*j,1);o.lid=0;o.flail=1}if(t>=1.6)o.lid=0.3}
  // R1: bolt
  if(rn===0){if(t>=EV.b1&&t<EV.hit1){const p=boltPos(t),p2=boltPos(t-0.04);const d=V.norm(V.sub(p,p2));const k=clamp((t-EV.b1)/(EV.hit1-EV.b1),0,1);
      items.push({mesh:SJ_BOLT,M:M4.mul(M4.trs(p,Math.atan2(d[0],d[2]),-Math.asin(clamp(d[1],-1,1)),0,1),M4.trs([0,0,0],Math.PI/2,Math.PI/2,0,1.2)),tint:[1,0.55,0.2],tintAmt:0.6*k});
      streak(items,V.sub(p,V.sc(d,0.12)),d,1.5+k*2,0.06,[1,0.8,0.5],0.8);streak(items,V.sub(p,V.sc(d,0.12)),d,0.8,0.12,[1,0.95,0.85],0.6);QPTS.push({p,c:'255,200,140',r:0.9+k*0.5,a:1})}
    if(t>=EV.b1+0.6&&t<EV.hit1){o.lid=0;o.headDown=-0.3;walk=0}
    if(t>=EV.hit1){const k=t-EV.hit1;items.push({mesh:SJ_CRATER,M:M4.trs(HIT1,0,0,0,[0.32,1,0.32])});
      items.push({mesh:SJ_BOLT,M:M4.trs([HIT1[0],0.05,HIT1[2]],0.4,0.5,0.9,1.2),tint:mix3([1,0.45,0.1],[0.55,0.55,0.6],clamp(k/4,0,1)),tintAmt:1});
      if(k<2){burst(items,HIT1,k,28,5,2.0);puff(items,HIT1,k*0.9,12,1.0)}QPTS.push({p:V.add(HIT1,[0,0.08,0]),c:'255,170,90',r:Math.max(0.15,1.2*(1-k/1.2)),a:0.9});
      if(k<0.6){const j=Math.sin(k/0.6*Math.PI);Rm=M4.trs([-0.15*ease(k/0.3),0.25*j,0],0,0,-0.15*j,1);o.flail=1;o.lid=0}else Rm=M4.trs([-0.15,0,0],0,0,0,1);walk=t>=EV.res1+1.0?1:0;if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5);o.lid=0.4}}}
  // R2: satellite fragments rain around the ant
  if(rn===1){if(t>=EV.s2+1.2&&t<EV.res2){o.lid=0;o.headDown=-0.35;walk=0}
    if(t>=EV.hit2-0.1&&t<EV.hit2+0.6){const k=(t-EV.hit2+0.1)/0.7;Rm=M4.trs([0,0.22*Math.sin(k*Math.PI),0],0,0,0.1*Math.sin(k*Math.PI*2),1);o.flail=1}
    const FR=[[1.1,0.02,0.6,0.25],[-0.9,0.02,0.9,0.45],[0.5,0.02,1.6,0.65],[-0.4,0.02,-0.9,0.8]];
    for(let i=0;i<FR.length;i++){const [x,y,z,dl]=FR[i];const tl=EV.hit2+dl;const k=t-tl;
      if(k<0&&k>-0.35){const f=(k+0.35)/0.35;const p=[x+2*(1-f),y+5*(1-f),z+3*(1-f)];streak(items,p,V.norm([-2,-5,-3]),0.8,0.06,[1,0.7,0.35],1);QPTS.push({p,c:'255,170,90',r:0.3,a:0.8})}
      if(k>=0&&t<R[2]){items.push({mesh:SJ_SAT,M:M4.trs([x,0.06,z],i*1.7,0.3+i,0.2,0.05+0.015*i),tint:mix3([1,0.5,0.15],[0.25,0.22,0.2],clamp(k/3,0,1)),tintAmt:0.8});
        if(k<1.2){burst(items,[x,0.03,z],k,10,i*7+40,0.9);puff(items,[x,0.02,z],k,6,0.4)}QPTS.push({p:[x,0.1,z],c:'255,150,70',r:0.3*(1-clamp(k/3,0,0.8)),a:0.7})}}
    if(t>=EV.res2&&t<EV.res2+2.6){o.glasses=1-ease((t-EV.res2-2.2)/0.4);o.lid=0.35}}
  // R3: booster landing exhaust wind
  if(rn===2){if(t>=EV.b3+1.2&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.45}
    if(t>=EV.land3-0.4&&t<EV.land3+2.2){const k=t-EV.land3+0.4;o.flail=1;o.lid=0;const push=-0.35*ease(k/0.8);Rm=M4.trs([0.12*Math.sin(k*30)*(1-k/2.6)+push*0.3,Math.abs(Math.sin(k*11))*0.06,push],0,0,0,1);
      for(let i=0;i<26;i++){const ph=((t*1.6+hsh(i,31))%1);const p=[(hsh(i,32)-0.5)*4,0.05+hsh(i,33)*1.2,2.6-ph*7];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.04+hsh(i,34)*0.08),tint:[0.78,0.7,0.6],tintAmt:1,alpha:0.6*Math.sin(ph*Math.PI),noShadow:true})}}
    if(t>=EV.land3+2.2)Rm=M4.trs([0,0,-0.35],0,0,0,1);
    if(t>=EV.res3){pose='sit';walk=0;o.glasses=easeOut((t-EV.res3)/0.5);o.lid=0.35;o.headDown=-0.3}}
  // R4: Kessler – ant sits and watches (popcorn crumb)
  if(rn===3){pose='sit';walk=0;Rm=M4.trs([0,0,-0.35],0,0,0,1);o.headDown=-0.4;o.lid=t>=EV.c4&&t<EV.res4?0:0.3;if(t>=EV.res4){o.glasses=easeOut((t-EV.res4)/0.5);o.lid=0.35}
    if(t>=EV.c4+2.0){for(let i=0;i<6;i++){const per=0.9+hsh(i,41);const ph=((t-EV.c4)/per+hsh(i,42))%1;const p=[(hsh(i,43)-0.5)*5,4-ph*4.2,1.5+hsh(i,44)*3];if(p[1]<0.03)continue;streak(items,p,V.norm([0.2,-1,-0.1]),0.5,0.03,[1,0.6,0.3],0.9*(1-ph));QPTS.push({p,c:'255,150,70',r:0.12,a:0.5})}}}
  // FINAL: ONE paint fleck
  if(rn===4){if(t>=EV.dot5&&t<EV.res5+1.5){const p=t<EV.hit5?fleckPos(t):V.add([0.02,0.92,-0.32],[0.25*ease((t-EV.hit5)/0.6),-0.9*easeIn(clamp((t-EV.hit5)/0.6,0,1)),-0.1]);const sp=t*6;
      items.push({mesh:SJ_FLECK,M:M4.trs(p,sp,sp*0.7,0.4,0.055)});const ap=clamp((t-EV.dot5)/0.4,0,1);QPTS.push({p,c:'255,255,255',r:0.2,a:0.85*ap});
      if(t<EV.hit5){const d=V.norm(V.sub(fleckPos(t),fleckPos(t-0.05)));streak(items,V.sub(p,V.sc(d,0.03)),d,0.35,0.012,[0.85,0.95,1],0.5*ap)}}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=-0.2+0.15*ease((t-EV.look5)/1.5);if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.015;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;if(k<0.35)QPTS.push({p:[0.02,0.95,-0.32],c:'255,255,240',r:0.6*(1-k/0.35),a:1});
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      else{Rm=M4.trs([Math.sin(k*70)*0.03,Math.abs(Math.sin(k*18))*0.08,0],0,0,0,1);o.flail=1;o.dizzy=1}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sjD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.0,EV.res1+1.8,EV.res2+2.8,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  items.push(...antItems(Rm,o));
  return items}
// ---------- render ----------
let LASTBGVP=null;
function renderScene(t){const tt=sceneT(t);const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  LASTBGVP=renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:2,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});
  const sd={center:[0,0,-0.4],radius:4.5};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:4000},sd,fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.h0,22,0.5);S(EV.hit1,34,0.9);S(EV.hit2,44,1.2);S(EV.hit2+0.25,10,0.3);S(EV.hit2+0.45,10,0.3);S(EV.land3,40,1.4);S(EV.c4,10,0.5);S(EV.hit5,10,0.4);S(EV.fall5+0.35,14,0.4);
  const rn=roundAt(tt);if(rn===2&&tt>=EV.b3+2&&tt<EV.land3)a+=6*ease((tt-EV.b3-2)/3);if(rn===3&&tt>=EV.c4&&tt<EV.res4)a+=2.5;if(rn===1&&tt>=EV.s2+2&&tt<EV.hit2)a+=5*ease((tt-EV.s2-2)/2.8);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
const BLUE='rgba(20,110,170,0.92)',DARK='rgba(15,10,30,0.8)',PINK='rgba(200,40,110,0.92)',GREEN='rgba(40,140,60,0.9)',RED='rgba(200,30,40,0.92)',ORANGE='rgba(210,100,20,0.92)';
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?54:58,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  let C1=1600,C2=1715;if(rn===2){C1=1400;C2=1520}
  // R1
  if(rn===0&&t>=EV.b1+0.3&&t<EV.hit1)card('In orbit: ~8× faster than a bullet 💨',C1,ORANGE,46,EV.b1+0.3,t);
  if(rn===0&&t>=EV.b1+1.1&&t<EV.hit1)card('(shown in SLOW-MO 🐢)',C2,DARK,46,EV.b1+1.1,t);
  if(rn===0&&t>=EV.hit1+0.2&&t<EV.res1)card('IMPACT 💥',660,PINK,80,EV.hit1+0.2,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: most small junk burns up',C1,BLUE,48,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.2&&t<R[1]-0.2)card('in our air before it lands 🔥',C2,BLUE,48,EV.res1+1.2,t);
  // R2
  if(rn===1&&t>=EV.s2+0.8&&t<EV.hit2)card('Dead satellites fall back to Earth 🔥',C1,PINK,46,EV.s2+0.8,t);
  if(rn===1&&t>=EV.s2+1.8&&t<EV.hit2)card('Re-entry heat: 1,000s of °C 🌡️',C2,DARK,48,EV.s2+1.8,t);
  if(rn===1&&t>=EV.hit2+0.1&&t<EV.res2)card('DIRECT HIT 💥',660,RED,76,EV.hit2+0.1,t);
  if(rn===1&&t>=EV.res2+0.5&&t<R[2]-0.2)card('Real: only ONE person is known',C1,BLUE,48,EV.res2+0.5,t);
  if(rn===1&&t>=EV.res2+1.2&&t<R[2]-0.2)card('to be hit by space junk (1997, unhurt)',C2,BLUE,42,EV.res2+1.2,t);
  // R3
  if(rn===2&&t>=EV.b3+0.8&&t<EV.land3)card('As tall as a 20-story building 🏢',C1,ORANGE,46,EV.b3+0.8,t);
  if(rn===2&&t>=EV.b3+1.8&&t<EV.land3)card('Landing burn: 🔥🔥🔥',C2,DARK,54,EV.b3+1.8,t);
  if(rn===2&&t>=EV.land3+0.1&&t<EV.res3)card('TOUCHDOWN 💨',660,PINK,76,EV.land3+0.1,t);
  if(rn===2&&t>=EV.res3+0.5&&t<R[3]-0.2)card('Real: Nov 13, Starship’s booster',C1,BLUE,46,EV.res3+0.5,t);
  if(rn===2&&t>=EV.res3+1.2&&t<R[3]-0.2)card('skipped its tower catch → Gulf 🌊',C2,BLUE,46,EV.res3+1.2,t);
  // R4
  if(rn===3&&t>=EV.k4+0.4&&t<EV.c4+1.2)card('30,000+ tracked pieces up there 🛰️',C1,DARK,46,EV.k4+0.4,t);
  if(rn===3&&t>=EV.k4+1.3&&t<EV.c4+1.2)card('+1 million bigger than 1 cm 😳',C2,DARK,48,EV.k4+1.3,t);
  if(rn===3&&t>=EV.c4+1.2&&t<EV.res4)card('1 crash → 1000s of new pieces',C1,PINK,48,EV.c4+1.2,t);
  if(rn===3&&t>=EV.c4+2.0&&t<EV.res4)card('→ more crashes → MORE pieces 💥',C2,RED,46,EV.c4+2.0,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('Real: 2009, two satellites collided',C1,BLUE,46,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.1&&t<R[4]-0.2)card('at ~42,000 km/h 💥',C2,BLUE,54,EV.res4+1.1,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.dot5+0.4)card('Sunrise. Peace at last… 😌',C1,DARK,52,R[4]+0.6,t);
  if(rn===4&&t>=EV.dot5+0.6&&t<EV.hit5)card('…wait 😳',660,'rgba(30,120,190,0.92)',66,EV.dot5+0.6,t);
  if(rn===4&&t>=EV.look5+0.3&&t<EV.hit5)card('ONE paint fleck 🎨',1600,ORANGE,60,EV.look5+0.3,t);
  if(rn===4&&t>=EV.hit5&&t<EV.res5+0.4)card('*tap*',660,DARK,70,EV.hit5,t);
  if(rn===4&&t>=EV.res5+0.7)card('Real: 2016, a tiny paint fleck',1400,BLUE,50,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.3)card('chipped the Space Station window 🪟',1515,BLUE,46,EV.res5+1.3,t);
  if(rn===4&&t>=EV.res5+2.4)card('→ a 7 mm crater 😳',1630,RED,50,EV.res5+2.4,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('SPACE JUNK 🛰️',0,-110,fitSize('SPACE JUNK 🛰️',980,116),'#FFD84A');txt('vs',0,-5,76,'#ffffff');txt('ONE DYING ANT 🐜',0,95,96,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived a bolt, a satellite,';txt(l1,0,-260,fitSize(l1,980,60),'#FFD84A');const l2='a rocket & Kessler syndrome 💥';txt(l2,0,-180,fitSize(l2,960,60),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('paint fleck 🎨',0,60,fitSize('paint fleck 🎨',960,110),'#FF9A3A');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1100,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||(q.sun?1100:700),q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  ctx.restore();
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.7,0.4,'255,230,190');flash(EV.hit1,0.85,0.7,'255,240,210');flash(EV.hit2,0.95,1.0,'255,220,170');flash(EV.land3,0.6,0.6,'255,230,200');flash(EV.c4,0.4,0.3,'255,240,220');flash(EV.hit5,0.45,0.3,'255,255,255');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
