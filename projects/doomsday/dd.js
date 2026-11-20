// ===================== EVERY DOOMSDAY vs ONE DYING ANT =====================
// ---------- new meshes ----------
const DD_ICE=um(m=>m.box([0,0.5,0],[1,1,1],[1,1,1],MAT.glass));
// volcano (unit: base radius 1, height 0.5), crater on top
const DD_VOLC=um(m=>{const seg=28,ring=7;const R0=1,H0=0.5,RT=0.16;const P=(i,j)=>{const a=j/seg*TAU2;const f=i/ring;const r=lerp(R0,RT,Math.pow(f,0.7))*(1+0.06*Math.sin(a*5+i)+0.04*vnoise(a*3,i));const y=H0*f;return[Math.cos(a)*r,y,Math.sin(a)*r]};
  for(let i=0;i<ring;i++)for(let j=0;j<seg;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const f=i/ring;const col=mix3(hx('#5a4a40'),hx('#2a2220'),f)
    ;const ash=vnoise(j*0.7,i*1.3)>0.6?0.25:0;m.quad(a,d,c,b,mix3(col,[0.55,0.52,0.5],ash))}
  for(let j=0;j<seg;j++){const a=j/seg*TAU2,b=(j+1)/seg*TAU2;m.tri([0,H0-0.03,0],[Math.cos(b)*RT,H0,Math.sin(b)*RT],[Math.cos(a)*RT,H0,Math.sin(a)*RT],[1,0.42,0.08],MAT.emis)}},0.5);
const DD_ASHM=um(m=>blob(m,[0,0,0],1,p=>mix3([0.36,0.34,0.33],[0.62,0.6,0.58],clamp(p[1]*0.8+0.4,0,1)),17,0.62,[12,18]),0.5);
const DD_ASHF=um(m=>blob(m,[0,0,0],1,p=>[0.5,0.48,0.47],3,0.5,[4,6]),0.4);
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.45,h1:1.35,e1:4.0,hit1:7.6,crk1:9.4,res1:9.9,
  s2:14.2,hit2:18.6,res2:20.6,
  b3:25.0,hit3:27.8,crk3:30.2,res3:30.7,
  k4:36.0,c4:39.5,res4:41.6,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.6,res5:54.0,loop:65.5};
const ROUNDS=[['ROUND 1','A SUPERVOLCANO 🌋','Ant: free ash facial 😎',EV.res1],['ROUND 2','A GAMMA-RAY BURST 💫','Ant: SPF 1,000,000 😎',EV.res2],['ROUND 3','SNOWBALL EARTH 🥶','Ant: brain freeze. That’s it 😎',EV.res3],['ROUND 4','VACUUM DECAY 🫧','The universe ended. Ant: 🥱',EV.res4],['FINAL ROUND','ONE raindrop 💧','Cause of death: ONE raindrop 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){if(t<R[0])return 1;if(t<R[1])return t<EV.e1+1.0?1:(t>=EV.res1+1.0?1:0);if(t<R[2])return t<EV.s2+1.4?0.9:(t>=EV.res2+1.4?0.9:0);
  if(t<R[3])return t<EV.b3+1.0?0.9:(t>=EV.res3+1.2?0.9:0);if(t<R[4])return t<EV.k4+0.6?0.9:(t>=EV.res4+1.4?0.9:0);if(t<R[5])return t<EV.look5?0.75:0;return 0}
const SJ_DT=1/120,SJ_TAB=[0];for(let i=1;i<=DUR/SJ_DT+10;i++){const tm=(i-0.5)*SJ_DT;SJ_TAB.push(SJ_TAB[i-1]+sjSpd(tm)*SJ_DT*1.1)}
function sjD(t){t=clamp(t,0,DUR+0.05);const f=t/SJ_DT,i=Math.floor(f);return lerp(SJ_TAB[i],SJ_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const SUNDIR=V.norm([-0.5,0.5,-0.6]),SUNDIR5=V.norm([0.42,0.1,1]);
const E_DAY=envBase({sun:SUNDIR,sunCol:hx('#fff0d8'),sky:hx('#86b4ea'),zen:hx('#1d4ab0'),hor:hx('#d8e6f4'),fog:hx('#c8d8ea'),fogD:7000,gnd:hx('#6a7a58'),gndCol:hx('#b8c4c8')});
const E_ASH=envBase({sun:SUNDIR,sunCol:hx('#ff9a60'),sky:hx('#7a4a34'),zen:hx('#2a1812'),hor:hx('#d0703a'),fog:hx('#6a4a3a'),fogD:3200,gnd:hx('#4a4038'),gndCol:hx('#6a5244'),night:0.25});
const E_ICE=envBase({sun:SUNDIR,sunCol:hx('#e0f0ff'),sky:hx('#b8dcff'),zen:hx('#4a88e0'),hor:hx('#f4fbff'),fog:hx('#e6f4ff'),fogD:1400,gnd:hx('#c8dcec'),gndCol:hx('#e6f4ff')});
const E_FLASH=envBase({sun:SUNDIR,sunCol:hx('#ffffff'),sky:hx('#f4f0ff'),zen:hx('#e0e8ff'),hor:hx('#ffffff'),fog:hx('#f0f0ff'),fogD:7000,gnd:hx('#d0d0e0'),gndCol:hx('#f0f0ff')});
const E_DUSK=envBase({sun:V.norm([0.7,0.12,-0.7]),sunCol:hx('#ffa070'),sky:hx('#5a4a9a'),zen:hx('#10144a'),hor:hx('#ff8a60'),fog:hx('#7a6a9a'),fogD:6000,gnd:hx('#4a4a58'),gndCol:hx('#5a4a60'),stars:0.35,night:0.45});
const E_NIGHT=envBase({sun:V.norm([0.3,0.25,-0.6]),sunCol:hx('#6a88b8'),sky:hx('#0e1a38'),gnd:hx('#1e2a30'),fog:hx('#0e2030'),fogD:6000,zen:hx('#03050f'),hor:hx('#22305a'),gndCol:hx('#0e2030'),stars:1,night:1});
const E_PURP=envBase({sun:E_NIGHT.sun,sunCol:hx('#b090ff'),sky:hx('#2a1a5a'),zen:hx('#080418'),hor:hx('#6a3a8a'),fog:hx('#22184a'),fogD:6000,gnd:hx('#2a2a40'),gndCol:hx('#22184a'),stars:1,night:1});
const E_VOID=envBase({sun:V.norm([0.2,0.6,-0.5]),sunCol:hx('#ff7ae0'),sky:hx('#c02a9a'),zen:hx('#12002a'),hor:hx('#30ffe0'),fog:hx('#6a1a8a'),fogD:2500,gnd:hx('#2a1040'),gndCol:hx('#5a1a7a'),stars:0.6,night:0.3});
const E_DAWN=envBase({sun:SUNDIR5,sunCol:hx('#ffe0b0'),sky:hx('#9ab8e0'),zen:hx('#3a68c0'),hor:hx('#ffcf9a'),fog:hx('#e0d0c0'),fogD:7000,gnd:hx('#7a8060'),gndCol:hx('#d8c8a8'),sunSize:2.5});
function envAt(t){const rn=roundAt(t);let e=E_DAY;const fl=(t0,a,d)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E_FLASH,a*(1-k/d))};
  if(rn<=0){if(t>=EV.e1)e=mixEnv(E_DAY,E_ASH,ease((t-EV.e1-0.3)/2.5));fl(EV.h0,0.4,0.5);fl(EV.h1,0.3,0.5);fl(EV.e1,0.45,0.7);fl(EV.crk1,0.25,0.5)}
  else if(rn===1){e=mixEnv(E_ASH,E_NIGHT,ease((t-R[1])/1.0));if(t>=EV.s2)e=mixEnv(e,E_PURP,ease((t-EV.s2)/2));fl(EV.hit2,0.5,1.0)}
  else if(rn===2){e=mixEnv(E_NIGHT,E_DAY,ease((t-R[2])/1.0));if(t>=EV.b3-0.5)e=mixEnv(e,E_ICE,ease((t-EV.b3+0.5)/2.5));fl(EV.crk3,0.35,0.6)}
  else if(rn===3){e=mixEnv(E_ICE,E_DUSK,ease((t-R[3])/1.0));if(t>=EV.c4-0.1)e=mixEnv(e,E_VOID,ease((t-EV.c4+0.1)/0.3)*(1-ease((t-EV.res4-0.6)/1.6)));fl(EV.c4,0.7,0.6)}
  else{e=mixEnv(E_DUSK,E_DAWN,ease((t-R[4])/1.2))}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  const to=(e2,a2,k)=>{eye=[lerp(eye[0],e2[0],k),lerp(eye[1],e2[1],k),lerp(eye[2],e2[2],k)];at=[lerp(at[0],a2[0],k),lerp(at[1],a2[1],k),lerp(at[2],a2[2],k)]};
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.8+k*0.1,-3.5-k*0.4];at=[0.2,0.95,0.4]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.2,1.4,k)+sway*0.2,lerp(0.9,0.55,k),lerp(-3.9,-3.9,k)];at=[lerp(0.2,0.0,k),lerp(0.95,1.25,k),lerp(0.4,0.6,k)];
    if(t>=EV.hit1-1.0){to([1.2,1.0,-2.9],[0.1,0.55,0.2],ease((t-EV.hit1+1.0)/0.9))}
    if(t>=EV.res1){to([1.5,0.95,-3.0],[0.2,0.65,0.2],ease((t-EV.res1)/0.8))}}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.5,1.2,k)+sway*0.2,lerp(0.95,0.4,k),lerp(-3.0,-4.2,k)];at=[lerp(0.2,-0.2,k),lerp(0.65,1.55,k),lerp(0.2,1.0,k)];
    if(t>=EV.hit2-0.9){to([1.5,1.0,-3.4],[0.0,0.8,0.3],ease((t-EV.hit2+0.9)/0.8))}}
  if(rn===2){const k=ease((t-R[2])/1.4);eye=[lerp(1.5,1.6,k)+sway*0.2,lerp(1.0,0.95,k),lerp(-3.4,-3.6,k)];at=[lerp(0.0,0.15,k),lerp(0.8,0.75,k),lerp(0.3,0.3,k)];
    if(t>=EV.hit3-0.6){to([1.1,0.95,-2.8],[0.1,0.6,0.2],ease((t-EV.hit3+0.6)/0.8))}
    if(t>=EV.res3){to([1.5,0.95,-3.0],[0.2,0.65,0.2],ease((t-EV.res3)/0.8))}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[lerp(1.5,-1.3,k)+sway*0.2,lerp(0.95,0.75,k),lerp(-3.0,-3.8,k)];at=[lerp(0.2,0.2,k),lerp(0.65,0.95,k),lerp(0.2,0.9,k)];
    if(t>=EV.c4-0.4){to([-1.2,0.85,-3.0],[0.1,0.65,0.2],ease((t-EV.c4+0.4)/0.8))}}
  if(rn===4){const k=ease((t-R[4])/1.0);eye=[lerp(-1.2,1.9,k)+sway*0.3,lerp(0.85,1.0,k),lerp(-3.0,-3.9,k)];at=[lerp(0.1,0.3,k),lerp(0.65,0.85,k),lerp(0.2,0.2,k)];
    if(t>=EV.dot5){const kk=ease((t-EV.dot5)/1.2);to([1.3,0.7,-2.9],[0.1,1.45,0.0],kk)}
    if(t>=EV.hit5-0.3){to([1.1,1.4,-3.1],[-0.2,0.4,0],ease((t-EV.hit5+0.3)/0.9))}}
  if(t>=R[5])eye=[1.1,1.4,-3.1],at=[-0.2,0.4,0];
  return{eye,at}}
// ---------- helpers ----------
function streak(items,head,d,len,w,col,a){const c=V.sub(head,V.sc(d,len/2));items.push({mesh:SPARK,M:M4.mul(M4.trs(c,Math.atan2(d[0],d[2]),-Math.asin(clamp(d[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[w/0.06,w/0.06,len])),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
function burst(items,p,k,n,seed,sc,col,grav){for(let i=0;i<n;i++){const d=V.norm([hsh(i,seed)-0.5,0.25+hsh(i,seed+1)*0.9,hsh(i,seed+2)-0.5]);const v=(0.6+hsh(i,seed+3))*sc;const g=grav==null?4.9:grav;
  const q=[p[0]+d[0]*v*k,p[1]+d[1]*v*k-g*k*k*sc*0.3,p[2]+d[2]*v*k];if(q[1]<0)continue;const vel=V.norm([d[0],d[1]-g*0.6*k/v*sc,d[2]]);streak(items,q,vel,0.25*sc*Math.max(0.2,1-k),0.03*sc,col||mix3([1,1,0.85],[1,0.5,0.15],clamp(k,0,1)),Math.max(0,1-k/1.2))}}
function puff(items,p,k,n,sc,col,a0){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);if(k<0||k>1.6)continue;const d=easeOut(k/1.0)*sc*(0.8+0.4*hsh(j,3));items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1*sc+k*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+k*0.25)*sc),tint:col||[0.72,0.68,0.6],tintAmt:1,alpha:Math.max(0,(a0||0.7)*(1-k/1.6)),noShadow:true})}}
// ---------- background world: power line + village (from solar/lhc) ----------
const SF_POLES=[];for(let i=-5;i<=5;i++)SF_POLES.push([i*28+8,0,38+Math.sin(i*1.3)*1.5]);
function poleGeo(m,x,z){m.prism([x,0,z],0.17,0.12,9.5,8,hx('#5a4030'));m.box([x,8.9,z],[3.0,0.18,0.2],hx('#4a3428'));for(const s of[-1.3,0,1.3])m.box([x+s,9.1,z],[0.1,0.25,0.1],hx('#c8c8c0'))}
let SF_BG,SF_WIN=[];{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#6a9850'));const r=rngG(55);
  for(let i=0;i<240;i++){const a=r()*TAU2,d=260+r()*3600;const tx=Math.cos(a)*d,tz=Math.sin(a)*d;if(tz>0&&Math.abs(tx+0.3*tz)<tz*0.75&&d<2200)continue;tree(m,tx,tz,5+r()*5,0,r()<0.45?'pine':'')}
  for(let i=0;i<14;i++){const sd=i<7?-1:1;const x=sd*(45+r()*60),z=60+r()*90;tree(m,x,z,3+r()*3,0,r()<0.5?'pine':'')}
  for(const p of SF_POLES)poleGeo(m,p[0],p[2]);
  for(let i=0;i<SF_POLES.length-1;i++){const a=SF_POLES[i],b=SF_POLES[i+1];for(const s of[-1.3,0,1.3]){const pts=[];for(let k=0;k<=8;k++){const f=k/8;pts.push([lerp(a[0],b[0],f)+s,9.2-1.1*Math.sin(f*Math.PI),lerp(a[2],b[2],f)])}tubeP(m,pts,()=>0.035,()=>[0.12,0.12,0.13],0,4)}}
  for(let i=0;i<11;i++){const x=-180+i*36+(r()-0.5)*12,z=190+r()*90,w=8+r()*4,d=7+r()*3,h=4.5+r()*2;house(m,x,z,w,d,h,hx(['#c8b8a0','#a88a70','#d8d0c0','#9a7a60'][i%4]),hx(['#7a3a2a','#4a4a5a','#6a3020'][i%3]),(r()-0.5)*0.4);
    for(const wx of[-0.25,0.25])SF_WIN.push([x+wx*w,h*0.45,z-d/2-0.08])}
  for(let i=0;i<26;i++){const a=-0.9+i*0.07,d=5200+hsh(i,3)*900;const x=Math.sin(a)*d,z=Math.cos(a)*d;m.prism([x,0,z],380+hsh(i,4)*260,40,260+hsh(i,5)*420,9,mix3(hx('#5a7088'),hx('#7a8aa0'),hsh(i,6)),0,i)}
  SF_BG=m.build(0.5)}
const SF_WINM=um(m=>{for(const p of SF_WIN)m.box(p,[1.3,1.3,0.1],[1,1,1],MAT.glass)});
// fixed volcano position (in front of the round-1 camera)
let DD_VP=null;function volcPos(){if(!DD_VP){const c=camAt(R[0]+2.0);const d=V.norm([c.at[0]-c.eye[0],0,c.at[2]-c.eye[2]]);DD_VP=[d[0]*3600+d[2]*-350,0,d[2]*3600-d[0]*-350]}return DD_VP}
const DD_VS=1700;
// ---------- background ----------
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  if(rn>=1&&rn<=3){const a=rn===1?ease((t-R[1]-0.5)/2):(rn===2?1-ease((t-R[2])/1):0);if(a>0.01){items.push({mesh:SF_WINM,M:M4.id(),tint:[1,0.8,0.45],tintAmt:1,alpha:a,add:1,noShadow:true});for(let i=0;i<SF_WIN.length;i+=2)BGPTS.push({p:SF_WIN[i],c:'255,200,120',r:5,a:0.35*a})}}
  // VOLCANO (hook + R1)
  if(rn<=0){const vp=volcPos();const top=[vp[0],DD_VS*0.5,vp[2]];items.push({mesh:DD_VOLC,M:M4.trs(vp,0,0,0,DD_VS)});
    const glow=t<EV.e1?0.35+0.15*Math.sin(t*5):1;BGPTS.push({p:top,c:'255,120,40',r:420*glow,a:0.7*glow});
    // hook: lava spurts
    if(t<R[0]+0.5)for(let i=0;i<10;i++){const kk=((t*0.8+hsh(i,7))%1);const d=V.norm([hsh(i,8)-0.5,1.3,hsh(i,9)-0.5]);const q=V.add(top,[d[0]*kk*500,d[1]*kk*600-kk*kk*500,d[2]*kk*500]);streak(items,q,d,120,22,[1,0.5,0.1],0.8*(1-kk))}
    if(t>=EV.e1){const k=t-EV.e1;const g=easeOut(k/5.5);
      items.push({mesh:MUSHHOT,M:M4.trs([top[0],top[1]-60,top[2]],k*0.05,0,0,[420+900*g,300+900*easeOut(k/1.2),420+900*g]),tint:[1,1,1],tintAmt:0,alpha:clamp(1.6-k/3.5,0,1)});
      items.push({mesh:MUSH,M:M4.trs([top[0],top[1]-80,top[2]],k*0.03,0,0,[900+2600*g,400+4200*g,900+2600*g])});
      for(let i=0;i<26;i++){const kk=((k*0.55+hsh(i,17))%1);const d=V.norm([hsh(i,18)-0.5,1.1,hsh(i,19)-0.5]);const q=V.add(top,[d[0]*kk*1400,d[1]*kk*1500-kk*kk*1300,d[2]*kk*1400]);if(q[1]<0)continue;streak(items,q,V.norm([d[0],d[1]-kk*1.6,d[2]]),220,40,[1,0.55,0.12],0.9*(1-kk));if(i%4===0)BGPTS.push({p:q,c:'255,140,50',r:90,a:0.5*(1-kk)})}
      BGPTS.push({p:[top[0],top[1]+200,top[2]],c:'255,110,40',r:1500,a:0.55*clamp(k/0.4,0,1)})}}
  // R2: the dying star in the sky that fires the gamma-ray beam
  if(rn===1){const sp=P(20000,-2400,14000);const a=ease((t-R[1]-0.3)/1.2);const fl=t>=EV.s2?ease((t-EV.s2)/3.2):0;const hit=t>=EV.hit2?Math.max(0,1-(t-EV.hit2)/1.6):0;
    BGPTS.push({p:sp,c:'200,170,255',r:600+fl*3500+hit*6000,a:(0.5+0.5*fl)*a,cap:900});BGPTS.push({p:sp,c:'255,255,255',r:250+fl*900,a:a,cap:300});
    if(t>=EV.s2){const k=t-EV.s2;for(let i=0;i<2;i++){const s=i?-1:1;const d=V.norm([side[0]*0.15*s,s,side[2]*0.15*s]);streak(items,V.add(sp,V.sc(d,2500*fl)),d,5000*fl,220,[0.7,0.55,1],0.6*fl)}}}
  // dawn sun + rain cloud (FINAL)
  if(rn>=4){const sp=V.sc(SUNDIR5,30000);items.push({mesh:SUNG,M:M4.trs(sp,0,0,0,1300)});BGPTS.push({p:sp,c:'255,215,150',r:6000,a:0.7*ease((t-R[4])/1.2),sun:1})}
  return{items,dir,side}}
// ---------- foreground ----------
let LASTVP=null,QPTS=[];
const BC=[0.3,0.6,70];
function dropPos(t){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);const kk=Math.pow(k,1.25);return[0.04+Math.sin(k*5)*0.05*(1-k),lerp(4.4,1.02,kk),-0.3]}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];const L=TILE;
  let pose='walk',walk=sjSpd(t)>0?1:0,o={t};
  const dist=sjD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // HOOK: two lava bombs slam down next to the ant
  if(t<R[0]+0.6){const LB=[[EV.h0,[-0.85,0,0.7],0.26],[EV.h1,[0.9,0,1.3],0.32]];
    for(const [h,p,s] of LB){const k=t-h;if(k<-0.3)continue;const fade=clamp((R[0]+0.6-t)/0.6,0,1);
      if(k<0){const f=(k+0.3)/0.3;const q=[p[0]-0.9*(1-f),s+4*(1-f),p[2]+0.6*(1-f)];items.push({mesh:HOTB,M:M4.trs(q,t*5,t*3,0,s)});streak(items,q,V.norm([-0.9,4,0.6]),2.2,s*1.2,[1,0.5,0.1],0.7);QPTS.push({p:q,c:'255,130,40',r:0.8,a:0.8})}
      else{items.push({mesh:HOTB,M:M4.trs([p[0],s*0.85,p[2]],0,0,0,s),tint:[1,1,1],tintAmt:0,alpha:fade});QPTS.push({p:[p[0],s,p[2]],c:'255,120,40',r:1.0,a:0.7*fade});
        if(k<1.4)burst(items,[p[0],0.1,p[2]],k,22,31+h*10,1.6,null,4.9);puff(items,[p[0],0.02,p[2]],k*0.8,9,1.0,[0.35,0.32,0.3],0.7*fade);
        for(let i=0;i<4;i++){const kk=((k*0.6+i/4)%1);items.push({mesh:USPH,M:M4.trs([p[0]+Math.sin(i*2)*0.1,s+kk*1.4,p[2]],0,0,0,0.08+kk*0.3),tint:[0.3,0.28,0.27],tintAmt:1,alpha:0.45*(1-kk)*fade,noShadow:true})}}}
    for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.2*j,0],0,0,(h===EV.h0?0.1:-0.1)*j,1);o.lid=0;o.flail=1}}if(t>=2.0&&t<R[0])o.lid=0.3}
  // R1: SUPERVOLCANO – ash rain buries the ant
  if(rn===0){const fk=ease((t-EV.e1-1.0)/3.0);const gone=1-ease((t-R[1]+1.2)/1.2);const fa=fk*gone;
    if(fa>0.01){items.push({mesh:DISC2,M:M4.trs([0,0.012,0.1],0,0,0,[0.3+fk*5,1,0.3+fk*5]),tint:[0.5,0.48,0.47],tintAmt:1,alpha:0.8*fa,noShadow:true});
      for(let i=0;i<70;i++){const per=1.6+hsh(i,61);const ph=((t-EV.e1)/per+hsh(i,62))%1;const p=[(hsh(i,63)-0.5)*5+Math.sin(t*1.7+i)*0.15,3.2-ph*3.2,-1.5+hsh(i,64)*4];if(p[1]<0.02)continue;items.push({mesh:DD_ASHF,M:M4.trs(p,t*2+i,i,0,0.02+hsh(i,65)*0.02),tint:i%5?[0.45,0.43,0.42]:[1,0.5,0.15],tintAmt:1,alpha:0.9*fa,noShadow:true});if(i%5===0)QPTS.push({p,c:'255,140,60',r:0.08,a:0.5*fa})}}
    if(t>=EV.e1+1.2&&t<EV.res1){walk=0;o.lid=0;o.headDown=-0.25}
    if(t>=EV.hit1-1.4&&t<EV.crk1+0.15){const g=ease((t-EV.hit1+1.4)/1.4);const sh=t>EV.crk1-0.8?Math.sin(t*60)*0.02:0;const out=t>=EV.crk1?1-(t-EV.crk1)/0.15:1;
      items.push({mesh:DD_ASHM,M:M4.trs([sh,0,0.05],0.3,0,0,[0.95*g*out+0.01,1.25*g*out+0.01,1.25*g*out+0.01])});
      if(t<EV.hit1)for(let i=0;i<20;i++){const kk=((t*1.4+hsh(i,71))%1);items.push({mesh:DD_ASHF,M:M4.trs([(hsh(i,72)-0.5)*1.6,2.2-kk*2.0,(hsh(i,73)-0.5)*1.6],i,i,0,0.035),tint:[0.5,0.48,0.47],tintAmt:1,noShadow:true})}}
    if(t>=EV.hit1-0.3&&t<EV.crk1)o.soot=0.6;
    if(t>=EV.crk1){const k=t-EV.crk1;if(k<1.6){burst(items,[0,0.6,0.1],k,34,81,1.9,[0.55,0.52,0.5],4.9);puff(items,[0,0.05,0.1],k,12,1.1,[0.5,0.48,0.46],0.7)}
      o.soot=0.6*(1-ease((k-1.2)/1.5));if(k<0.4){const j=Math.sin(k/0.4*Math.PI);Rm=M4.trs([0,0.15*j,0],0,0,0.06*j,1);o.flail=1}}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5);o.lid=0.4}}
  // R2: GAMMA-RAY BURST – a beam from a dying star
  if(rn===1){if(t>=EV.s2+1.4&&t<EV.res2){o.lid=0;o.headDown=-0.35;walk=0}
    const bd=V.norm([0.22,-1,0.35]);const head=[0.0,0.0,0.05];
    if(t>=EV.hit2-1.3&&t<EV.hit2){const k=(t-EV.hit2+1.3)/1.3;streak(items,head,bd,80,0.02+0.03*k,[0.8,0.6,1],0.5+0.4*k);QPTS.push({p:[0,0.05,0.05],c:'200,160,255',r:0.4*k,a:0.7})}
    if(t>=EV.hit2){const k=t-EV.hit2;const bk=Math.max(0,1-Math.max(0,k-0.9)/0.6);
      if(bk>0){const w=0.9*easeOut(k/0.12)*(0.9+0.1*Math.sin(t*60));streak(items,head,bd,90,w,[0.6,0.45,1],0.6*bk);streak(items,head,bd,90,w*0.4,[1,1,1],0.9*bk);QPTS.push({p:[0,0.4,0.05],c:'220,200,255',r:2.6*bk,a:0.9});
        for(let i=0;i<10;i++){const ph=((t*3+hsh(i,91))%1);const q=V.sub(head,V.sc(bd,ph*6));streak(items,q,bd,0.7,0.06,[1,1,1],0.8*bk)}}
      items.push({mesh:RING,M:M4.trs([0,0.03,0.05],0,0,0,0.2+easeOut(k/1.1)*5),tint:[0.75,0.6,1],tintAmt:1,alpha:Math.max(0,0.85*(1-k/1.2)),add:1,noShadow:true});
      if(k<1.6)burst(items,[0,0.1,0.05],k,30,95,2.0,[0.85,0.75,1],2.0);
      o.soot=0.5*ease(k/0.6);if(k<0.9){const kk=k/0.9;Rm=M4.trs([0,0.18*Math.sin(kk*Math.PI),0],easeOut(kk)*TAU2,0,0.08*Math.sin(kk*Math.PI*2),1);o.flail=1;o.lid=0}
      if(k>=0.3&&k<3){for(let i=0;i<5;i++){const kk=((k*0.5+i/5)%1);items.push({mesh:USPH,M:M4.trs([0.05+Math.sin(i*2)*0.1,0.8+kk*0.8,-0.1],0,0,0,0.06+kk*0.18),tint:[0.3,0.28,0.3],tintAmt:1,alpha:0.4*(1-kk),noShadow:true})}}}
    if(t>=EV.res2){o.glasses=easeOut((t-EV.res2)/0.5)*(1-ease((t-R[2]+0.6)/0.4));o.lid=0.35}}
  // R3: SNOWBALL EARTH – frozen solid
  if(rn===2){o.soot=0.5*(1-ease((t-R[2])/1.5));const fk=ease((t-EV.b3)/2.5);const melt=1-ease((t-EV.res3-0.6)/2.0);const fa=fk*Math.max(melt,0.55);
    if(fa>0.01){items.push({mesh:DISC2,M:M4.trs([0,0.012,0.1],0,0,0,[0.3+fk*5.5,1,0.3+fk*5.5]),tint:[0.9,0.97,1],tintAmt:1,alpha:0.85*fa,noShadow:true});
      for(let i=0;i<26;i++){const a=hsh(i,51)*TAU2,d=0.4+hsh(i,52)*3.2*fk;items.push({mesh:USPH,M:M4.trs([Math.cos(a)*d,0.02,0.1+Math.sin(a)*d],hsh(i,53)*3,0,0,[0.05+hsh(i,54)*0.06,0.04+0.08*hsh(i,55),0.05]),tint:[0.92,0.98,1],tintAmt:1,alpha:0.9*fa,noShadow:true})}
      for(let i=0;i<55;i++){const per=2.2+hsh(i,61);const ph=((t-EV.b3)/per+hsh(i,62))%1;const p=[(hsh(i,63)-0.5)*5+Math.sin(t*1.3+i)*0.1,3.2-ph*3.2,-1.5+hsh(i,64)*4];if(p[1]<0.02)continue;items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.018+hsh(i,65)*0.015),tint:[1,1,1],tintAmt:1,alpha:0.85*fa,noShadow:true})}}
    if(t>=EV.b3+0.8&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.2;o.frost=ease((t-EV.b3-0.8)/2.4)*(t<EV.crk3?1:1-ease((t-EV.crk3)/1.5))}
    if(t>=EV.res3)o.frost=0.4*(1-ease((t-EV.res3)/1.2));
    if(t>=EV.hit3-0.6&&t<EV.crk3){const g=ease((t-EV.hit3+0.6)/0.6);const j=t>EV.crk3-0.7?Math.sin(t*70)*0.02:0;const M=M4.trs([j,0,0.12],0,0,0,[1.3,1.12*g,1.75]);
      items.push({mesh:DD_ICE,M,tint:[0.62,0.86,1],tintAmt:1,alpha:0.34,noShadow:true});items.push({mesh:DD_ICE,M:M4.mul(M,M4.trs([0,0,0],0,0,0,1.02)),tint:[0.5,0.8,1],tintAmt:1,alpha:0.16,add:1,noShadow:true});
      if(g>0.9){for(const s of[-1,1])for(const z of[-1,1])streak(items,[s*0.65,1.12,0.12+z*0.875],[0,-1,0],1.12,0.014,[0.85,0.97,1],0.6)}
      if(t>=EV.hit3)Rm=M4.trs([j,0,0],0,0,0,1)}
    if(t>=EV.crk3){const k=t-EV.crk3;if(k<1.6){burst(items,[0,0.55,0.12],k,30,71,1.8,[0.75,0.92,1],4.9);puff(items,[0,0.02,0.12],k,10,0.9,[0.9,0.96,1],0.6)}
      if(k<0.4){const j=Math.sin(k/0.4*Math.PI);Rm=M4.trs([0,0.12*j,0],0,0,0.06*j,1);o.flail=1}}
    if(t>=EV.res3){o.glasses=easeOut((t-EV.res3)/0.5)*(1-ease((t-R[3]+0.6)/0.4));o.lid=0.4}}
  // R4: VACUUM DECAY – a bubble of new physics sweeps over everything at light speed
  if(rn===3){o.frost=0.3*(1-ease((t-R[3])/1.2));
    if(t>=EV.k4&&t<EV.c4+0.15){const k=clamp((t-EV.k4)/(EV.c4-EV.k4),0,1);const rb=Math.max(0.5,(BC[2]+0.6)*Math.pow(k,1.6));const pul=1+0.01*Math.sin(t*20);
      items.push({mesh:GSPH,M:M4.trs(BC,0,0,0,rb*pul),tint:[1,0.35,0.85],tintAmt:1,alpha:0.16,add:1,noShadow:true});
      items.push({mesh:GSPH,M:M4.trs(BC,0,0,0,rb*0.97),tint:[0.2,0.9,1],tintAmt:1,alpha:0.08,add:1,noShadow:true});
      for(let i=0;i<7;i++){const ry=i/7*Math.PI+t*0.3,rx=0.5+hsh(i,5)*1.2;items.push({mesh:RING,M:M4.trs(BC,ry,rx,0,rb),tint:i%2?[1,0.45,0.9]:[0.4,1,1],tintAmt:1,alpha:0.55,add:1,noShadow:true})}
      const edge=[BC[0],BC[1],BC[2]-rb];QPTS.push({p:edge,c:'255,120,230',r:Math.min(3,0.6+rb*0.04),a:0.7})}
    if(t>=EV.k4+0.6&&t<EV.res4){walk=0;o.lid=0;o.headDown=-0.3;if(t>=EV.c4-1.0&&t<EV.c4)Rm=M4.trs([Math.sin(t*40)*0.02,0,0],0,0,0,1)}
    if(t>=EV.c4&&t<EV.res4+0.8){const k=t-EV.c4;o.flail=k<1.2?1:0;o.void=Math.max(0,1-Math.max(0,k-1.4)/1.0);if(k<0.6){const j=Math.sin(k/0.6*Math.PI);Rm=M4.trs([0,0.15*j,0],0,0,0.1*j,1)}
      for(let i=0;i<30;i++){const ph=((k*0.35+hsh(i,111))%1);const p=[(hsh(i,112)-0.5)*5,ph*3,-1+hsh(i,113)*4];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.02),tint:i%2?[1,0.4,0.9]:[0.3,1,1],tintAmt:1,alpha:0.8*(1-ph)*o.void,add:1,noShadow:true})}}
    if(t>=EV.res4){o.glasses=easeOut((t-EV.res4)/0.5)*(1-ease((t-R[4]+0.6)/0.4));o.lid=0.3}}
  // FINAL: ONE raindrop
  if(rn===4){if(t>=EV.dot5&&t<EV.hit5){const p=dropPos(t);const wob=1+0.06*Math.sin(t*14);const ap=clamp((t-EV.dot5)/0.4,0,1);
      items.push({mesh:DROP,M:M4.trs([p[0],p[1]-0.3,p[2]],0,0,0,[0.24/wob,0.24*wob,0.24/wob]),tint:[0.6,0.82,1],tintAmt:0.5,alpha:0.75*ap,noShadow:false});
      items.push({mesh:GSPH,M:M4.trs([p[0]-0.06,p[1]-0.2,p[2]-0.12],0,0,0,0.045),tint:[1,1,1],tintAmt:1,alpha:0.9*ap,add:1,noShadow:true});QPTS.push({p,c:'170,220,255',r:0.3,a:0.5*ap})}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=-0.3;if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.015;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;
      items.push({mesh:DISC2,M:M4.trs([0,0.015,-0.2],0,0,0,[0.3+easeOut(k/0.3)*1.0,1,0.3+easeOut(k/0.3)*0.9]),tint:[0.55,0.75,0.95],tintAmt:1,alpha:0.6,noShadow:true});
      if(k<1.2){burst(items,[0.02,0.75,-0.3],k,26,121,0.9,[0.7,0.88,1],4.9);items.push({mesh:RING,M:M4.trs([0,0.04,-0.25],0,0,0,0.2+easeOut(k/0.6)*1.4),tint:[0.75,0.9,1],tintAmt:1,alpha:Math.max(0,0.7*(1-k/0.8)),add:1,noShadow:true})}
      if(k<0.35)QPTS.push({p:[0.02,0.8,-0.3],c:'220,240,255',r:0.7*(1-k/0.35),a:0.9});
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3;o.wet=1}
      else{Rm=M4.trs([Math.sin(k*70)*0.03,0,0],0,0,0,[1,1-0.35*Math.sin(clamp(k/0.3,0,1)*Math.PI),1]);o.flail=1;o.dizzy=1;o.wet=1}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sjD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.2,EV.res1+1.8,EV.res2+2.4,EV.res3+1.6,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  const ai=antItems(Rm,o);if(o.void)for(const q of ai)if(q.tint){const g=(q.tint[0]+q.tint[1]+q.tint[2])/3;q.tint=mix3(q.tint,[1-q.tint[0]*0.6,0.4+g*0.6,1-q.tint[2]*0.3],0.7*o.void)}
  if(o.wet)for(const q of ai)if(q.tint)q.tint=mix3(q.tint,[0.35,0.5,0.7],0.25);
  items.push(...ai);
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
  S(EV.h0,24,0.45);S(EV.h1,20,0.45);S(EV.e1,30,1.6);S(EV.hit1,10,0.4);S(EV.crk1,18,0.5);S(EV.hit2,40,1.2);S(EV.crk3,18,0.5);S(EV.c4,30,0.9);S(EV.hit5,10,0.4);S(EV.fall5+0.35,14,0.4);
  const rn=roundAt(tt);if(rn===0&&tt>=EV.e1&&tt<EV.hit1)a+=4;if(rn===3&&tt>=EV.c4-1.5&&tt<EV.c4)a+=4*ease((tt-EV.c4+1.5)/1.5);if(rn===2&&tt>=EV.crk3-0.7&&tt<EV.crk3)a+=3;return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
const BLUE='rgba(20,110,170,0.92)',DARK='rgba(15,10,30,0.8)',PINK='rgba(200,40,110,0.92)',GREEN='rgba(40,140,60,0.9)',RED='rgba(200,30,40,0.92)',ORANGE='rgba(210,100,20,0.92)',CYAN='rgba(20,150,190,0.92)',PURPLE='rgba(110,50,190,0.92)';
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?54:58,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  const C1=1600,C2=1715;
  // R1
  if(rn===0&&t>=EV.e1+0.3&&t<EV.hit1)card('Yellowstone: a SUPERVOLCANO 🌋',C1,ORANGE,46,EV.e1+0.3,t);
  if(rn===0&&t>=EV.e1+1.3&&t<EV.hit1)card('hiding under the USA 🇺🇸',C2,DARK,48,EV.e1+1.3,t);
  if(rn===0&&t>=EV.hit1&&t<EV.crk1)card('BURIED IN ASH 🫣',660,DARK,80,EV.hit1,t);
  if(rn===0&&t>=EV.crk1&&t<EV.res1+0.3)card('*POP*',660,ORANGE,76,EV.crk1,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: its last super-eruption was',C1,BLUE,50,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.2&&t<R[1]-0.2)card('631,000 years ago 🌋',C2,BLUE,50,EV.res1+1.2,t);
  if(rn===0&&t>=EV.res1+2.0&&t<R[1]-0.2)card('ash fell across North America 🌫️',1830,RED,46,EV.res1+2.0,t);
  // R2
  if(rn===1&&t>=EV.s2+0.4&&t<EV.hit2)card('A dying star fires a beam 💫',C1,PURPLE,48,EV.s2+0.4,t);
  if(rn===1&&t>=EV.s2+1.4&&t<EV.hit2)card('the BRIGHTEST blasts in the universe',C2,DARK,44,EV.s2+1.4,t);
  if(rn===1&&t>=EV.hit2+0.1&&t<EV.res2)card('DIRECT HIT ☢️',660,PINK,80,EV.hit2+0.1,t);
  if(rn===1&&t>=EV.res2+0.4&&t<R[2]-0.2)card('Real: some scientists think one hit',C1,BLUE,46,EV.res2+0.4,t);
  if(rn===1&&t>=EV.res2+1.1&&t<R[2]-0.2)card('Earth ~445 million years ago 🌍',C2,BLUE,48,EV.res2+1.1,t);
  if(rn===1&&t>=EV.res2+2.0&&t<R[2]-0.2)card('…and helped a mass extinction 🐚',1830,RED,44,EV.res2+2.0,t);
  // R3
  if(rn===2&&t>=EV.b3+0.3&&t<EV.hit3)card('The WHOLE planet freezes 🧊',C1,CYAN,48,EV.b3+0.3,t);
  if(rn===2&&t>=EV.b3+1.3&&t<EV.hit3)card('oceans, land… everything 🥶',C2,DARK,48,EV.b3+1.3,t);
  if(rn===2&&t>=EV.hit3&&t<EV.crk3)card('FROZEN SOLID 🧊',660,CYAN,80,EV.hit3,t);
  if(rn===2&&t>=EV.crk3&&t<EV.res3+0.3)card('*CRACK*',660,DARK,76,EV.crk3,t);
  if(rn===2&&t>=EV.res3+0.5&&t<R[3]-0.2)card('Real: ~700 million years ago',C1,BLUE,50,EV.res3+0.5,t);
  if(rn===2&&t>=EV.res3+1.2&&t<R[3]-0.2)card('Earth froze almost pole to pole ❄️',C2,BLUE,46,EV.res3+1.2,t);
  // R4
  if(rn===3&&t>=EV.k4+0.3&&t<EV.c4)card('A bubble of a NEW vacuum 🫧',C1,PURPLE,48,EV.k4+0.3,t);
  if(rn===3&&t>=EV.k4+1.2&&t<EV.c4)card('rewrites physics at light speed ⚡',C2,DARK,46,EV.k4+1.2,t);
  if(rn===3&&t>=EV.c4&&t<EV.res4)card('PHYSICS: DELETED 😱',660,PINK,72,EV.c4,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('Real: physicists think it’s possible…',C1,BLUE,46,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.1&&t<R[4]-0.2)card('but not for trillions of trillions of years 😮‍💨',C2,BLUE,42,EV.res4+1.1,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.dot5+0.4)card('Sunrise. He survived it all… 😌',C1,DARK,50,R[4]+0.6,t);
  if(rn===4&&t>=EV.dot5+0.6&&t<EV.look5+0.2)card('…wait 😳',660,'rgba(30,120,190,0.92)',66,EV.dot5+0.6,t);
  if(rn===4&&t>=EV.look5+0.3&&t<EV.hit5)card('ONE raindrop 💧',1730,BLUE,60,EV.look5+0.3,t);
  if(rn===4&&t>=EV.hit5&&t<EV.res5+0.4)card('*SPLASH*',660,BLUE,74,EV.hit5,t);
  if(rn===4&&t>=EV.res5+0.7)card('Real: a big raindrop can weigh',1400,BLUE,50,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.3)card('20× more than a small ant 💧',1515,BLUE,48,EV.res5+1.3,t);
  if(rn===4&&t>=EV.res5+2.4)card('= a CAR falling on you 🚗',1630,RED,52,EV.res5+2.4,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('EVERY',0,-170,104,'#5AF0FF');txt('DOOMSDAY ☠️',0,-60,fitSize('DOOMSDAY ☠️',960,116),'#FFD84A');txt('vs',0,35,70,'#ffffff');txt('ONE DYING ANT 🐜',0,130,92,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived a supervolcano, a gamma-ray burst,';txt(l1,0,-260,fitSize(l1,980,58),'#FFD84A');const l2='Snowball Earth & the END of physics 🫧';txt(l2,0,-180,fitSize(l2,960,60),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('raindrop 💧',0,60,fitSize('raindrop 💧',960,110),'#5AF0FF');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('Which doomsday should he face next?',W/2,1100,fitSize('Which doomsday should he face next?',960,52),'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p||!(rad>0.5))return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function glitchFx(k){if(k<=0)return;for(let i=0;i<14;i++){const y=(hsh(i,Math.floor(k*40))*H)|0,h=8+hsh(i,7)*60;const dx=(hsh(i,Math.floor(k*30)+3)-0.5)*90*k;ctx.globalAlpha=0.5*k;ctx.drawImage(cv,0,y,W,h,dx,y,W,h)}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='screen';ctx.fillStyle=`rgba(255,40,200,${0.12*k})`;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over'}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||(q.sun?1100:700),q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  ctx.restore();
  if(rn===3&&tt>=EV.c4&&tt<EV.c4+1.6){ctx.save();glitchFx(1-(tt-EV.c4)/1.6);ctx.restore()}
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.5,0.3,'255,180,110');flash(EV.h1,0.45,0.3,'255,170,100');flash(EV.e1,0.6,0.6,'255,190,120');flash(EV.crk1,0.2,0.25,'230,220,210');flash(EV.hit2,0.6,0.6,'235,220,255');flash(EV.crk3,0.5,0.4,'220,240,255');flash(EV.c4,0.8,0.5,'255,150,240');flash(EV.hit5,0.4,0.3,'220,240,255');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
