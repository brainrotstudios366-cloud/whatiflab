// ===================== LARGE HADRON COLLIDER vs ONE DYING ANT =====================
// ---------- new meshes ----------
const LH_ICE=um(m=>m.box([0,0.5,0],[1,1,1],[1,1,1],MAT.glass));
const LH_BIRD=um(m=>{const c=hx('#2a2a32');m.ico([0,0,0],0.3,c,0,0.55,[8,12]);m.ico([0,0.06,0.36],0.13,c,0,1,[6,8]);m.ico([0,0.04,0.5],0.06,hx('#e0a030'),0,1,[4,6]);
  m.quad([-0.12,0,-0.3],[0.12,0,-0.3],[0.22,0,-0.62],[-0.22,0,-0.62],c)},0.4);
const LH_WR=um(m=>{const c=hx('#33333c');m.quad([0,0,-0.16],[0,0,0.2],[1.0,0,0.05],[1.25,0,-0.15],c);m.quad([0,0,0.2],[0,0,-0.16],[1.25,0,-0.15],[1.0,0,0.05],c)});
const LH_WL=um(m=>{const c=hx('#33333c');m.quad([0,0,-0.16],[-1.25,0,-0.15],[-1.0,0,0.05],[0,0,0.2],c);m.quad([0,0,0.2],[-1.0,0,0.05],[-1.25,0,-0.15],[0,0,-0.16],c)});
const LH_BREAD=um(m=>{blob(m,[0,0,0],1,p=>{const crust=clamp(p[1]*1.4+0.2,0,1);return mix3([0.96,0.8,0.5],[0.7,0.38,0.1],crust)},11,0.7,[12,18]);
  for(let i=0;i<3;i++)m.box([0,0.62,-0.45+i*0.45],[0.9,0.06,0.12],hx('#f0d8a0'),0,0.5)},0.5);
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.45,h1:1.35,b1:4.0,hit1:7.0,crk1:9.2,res1:9.6,
  s2:14.2,hit2:19.0,res2:20.8,
  b3:25.0,land3:30.0,res3:31.6,
  k4:36.0,c4:38.6,evap4:42.0,res4:42.4,
  dot5:48.4,look5:50.4,hit5:53.0,fall5:53.6,res5:54.0,loop:65.5};
const ROUNDS=[['ROUND 1','MAGNETS AT −271 °C 🥶','Ant: free AC 😎❄️',EV.res1],['ROUND 2','PROTONS AT LIGHT SPEED ⚡','Dodged 11,245× a second 😎',EV.res2],['ROUND 3','HEAD-ON COLLISION 💥','Ant: nice tan 😎🔥',EV.res3],['ROUND 4','A MINI BLACK HOLE 🕳️','It evaporated. Ant: 🥱',EV.res4],['FINAL ROUND','ONE piece of bread 🥖','Cause of death: ONE piece of bread 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sjSpd(t){if(t<R[0])return 1;if(t<R[1])return t<EV.b1+1.0?1:(t>=EV.res1+1.0?1:0);if(t<R[2])return t<EV.s2+1.4?0.9:(t>=EV.res2+1.4?0.9:0);
  if(t<R[3])return t<EV.b3+1.0?0.9:0;if(t<R[4])return t<EV.k4+0.6?0.9:0;if(t<R[5])return t<EV.look5?0.75:0;return 0}
const SJ_DT=1/120,SJ_TAB=[0];for(let i=1;i<=DUR/SJ_DT+10;i++){const tm=(i-0.5)*SJ_DT;SJ_TAB.push(SJ_TAB[i-1]+sjSpd(tm)*SJ_DT*1.1)}
function sjD(t){t=clamp(t,0,DUR+0.05);const f=t/SJ_DT,i=Math.floor(f);return lerp(SJ_TAB[i],SJ_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const SUNDIR=V.norm([-0.5,0.5,-0.6]),SUNDIR5=V.norm([0.42,0.1,1]);
const E_DAY=envBase({sun:SUNDIR,sunCol:hx('#fff0d8'),sky:hx('#86b4ea'),zen:hx('#1d4ab0'),hor:hx('#d8e6f4'),fog:hx('#c8d8ea'),fogD:7000,gnd:hx('#6a7a58'),gndCol:hx('#b8c4c8')});
const E_ICE=envBase({sun:SUNDIR,sunCol:hx('#e0f0ff'),sky:hx('#b8dcff'),zen:hx('#4a88e0'),hor:hx('#eef8ff'),fog:hx('#dcefff'),fogD:5000,gnd:hx('#9ab8d0'),gndCol:hx('#dcefff')});
const E_FLASH=envBase({sun:SUNDIR,sunCol:hx('#ffffff'),sky:hx('#f4f0ff'),zen:hx('#e0e8ff'),hor:hx('#ffffff'),fog:hx('#f0f0ff'),fogD:7000,gnd:hx('#d0d0e0'),gndCol:hx('#f0f0ff')});
const E_DUSK=envBase({sun:V.norm([0.7,0.12,-0.7]),sunCol:hx('#ffa070'),sky:hx('#5a4a9a'),zen:hx('#10144a'),hor:hx('#ff8a60'),fog:hx('#7a6a9a'),fogD:6000,gnd:hx('#4a4a58'),gndCol:hx('#5a4a60'),stars:0.35,night:0.45});
const E_NIGHT=envBase({sun:V.norm([0.3,0.25,-0.6]),sunCol:hx('#6a88b8'),sky:hx('#0e1a38'),gnd:hx('#1e2a30'),fog:hx('#0e2030'),fogD:6000,zen:hx('#03050f'),hor:hx('#22305a'),gndCol:hx('#0e2030'),stars:1,night:1});
const E_PURP=envBase({sun:E_NIGHT.sun,sunCol:hx('#b090ff'),sky:hx('#2a1a5a'),zen:hx('#080418'),hor:hx('#6a3a8a'),fog:hx('#22184a'),fogD:6000,gnd:hx('#2a2a40'),gndCol:hx('#22184a'),stars:1,night:1});
const E_DAWN=envBase({sun:SUNDIR5,sunCol:hx('#ffe0b0'),sky:hx('#9ab8e0'),zen:hx('#3a68c0'),hor:hx('#ffcf9a'),fog:hx('#e0d0c0'),fogD:7000,gnd:hx('#7a8060'),gndCol:hx('#d8c8a8'),sunSize:2.5});
function envAt(t){const rn=roundAt(t);let e=E_DAY;const fl=(t0,a,d)=>{const k=t-t0;if(k>0&&k<d)e=mixEnv(e,E_FLASH,a*(1-k/d))};
  if(rn<=0){if(t>=EV.b1)e=mixEnv(E_DAY,E_ICE,ease((t-EV.b1)/2.5));fl(EV.h0,0.45,0.5);fl(EV.h1,0.35,0.5);fl(EV.crk1,0.35,0.6)}
  else if(rn===1){e=mixEnv(E_ICE,E_DUSK,ease((t-R[1])/1.0));fl(EV.hit2,0.5,0.8)}
  else if(rn===2){e=mixEnv(E_DUSK,E_NIGHT,0.6*ease((t-R[2])/1.0));fl(EV.land3,0.7,1.6)}
  else if(rn===3){e=mixEnv(E_NIGHT,E_PURP,ease((t-EV.k4)/1.5)*(1-ease((t-EV.evap4)/1.2)));fl(EV.evap4,0.6,0.8)}
  else{e=mixEnv(E_NIGHT,E_DAWN,ease((t-R[4])/1.2))}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  const to=(e2,a2,k)=>{eye=[lerp(eye[0],e2[0],k),lerp(eye[1],e2[1],k),lerp(eye[2],e2[2],k)];at=[lerp(at[0],a2[0],k),lerp(at[1],a2[1],k),lerp(at[2],a2[2],k)]};
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.8+k*0.1,-3.5-k*0.4];at=[0.2,0.95,0.4]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.2,1.5,k)+sway*0.2,lerp(0.9,0.85,k),lerp(-3.9,-3.4,k)];at=[lerp(0.2,0.15,k),lerp(0.95,0.75,k),lerp(0.4,0.3,k)];
    if(t>=EV.hit1-0.4){to([1.1,0.95,-2.8],[0.1,0.6,0.2],ease((t-EV.hit1+0.4)/0.8))}
    if(t>=EV.res1){to([1.5,0.95,-3.0],[0.2,0.65,0.2],ease((t-EV.res1)/0.8))}}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.5,1.2,k)+sway*0.2,lerp(0.95,0.45,k),lerp(-3.0,-4.2,k)];at=[lerp(0.2,-0.3,k),lerp(0.65,1.45,k),lerp(0.2,1.0,k)];
    if(t>=EV.hit2-1.4){to([1.4,0.8,-3.2],[0.0,0.75,0.3],ease((t-EV.hit2+1.4)/0.9))}}
  if(rn===2){const k=ease((t-R[2])/1.4);eye=[lerp(1.4,1.9,k)+sway*0.2,lerp(0.8,0.7,k),lerp(-3.2,-4.3,k)];at=[lerp(0.0,-0.3,k),lerp(0.75,1.0,k),lerp(0.3,1.2,k)];
    if(t>=EV.land3+0.8){to([1.5,0.85,-3.4],[-0.1,0.75,0.4],ease((t-EV.land3-0.8)/1.2))}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[lerp(1.5,-1.4,k)+sway*0.2,lerp(0.85,0.8,k),lerp(-3.4,-3.7,k)];at=[lerp(-0.1,0.1,k),lerp(0.75,0.68,k),lerp(0.4,-0.6,k)];
    if(t>=EV.c4){to([-1.0,0.75,-3.1],[0.1,0.62,-0.8],ease((t-EV.c4)/1.0))}
    if(t>=EV.res4-0.2){to([-1.5,0.8,-3.2],[-0.1,0.7,0.3],ease((t-EV.res4+0.2)/1.0))}}
  if(rn===4){const k=ease((t-R[4])/1.0);eye=[lerp(-1.5,1.9,k)+sway*0.3,lerp(0.8,1.0,k),lerp(-3.2,-3.9,k)];at=[lerp(-0.1,0.3,k),lerp(0.7,0.85,k),lerp(0.3,0.2,k)];
    if(t>=EV.look5-0.3){const kk=ease((t-EV.look5+0.3)/1.0);to([0.9,0.95,-2.3],[0.25,0.85,0.1],kk)}
    if(t>=EV.hit5-0.3){to([1.1,1.4,-3.1],[-0.2,0.4,0],ease((t-EV.hit5+0.3)/0.9))}}
  if(t>=R[5])eye=[1.1,1.4,-3.1],at=[-0.2,0.4,0];
  return{eye,at}}
// ---------- helpers ----------
function streak(items,head,d,len,w,col,a){const c=V.sub(head,V.sc(d,len/2));items.push({mesh:SPARK,M:M4.mul(M4.trs(c,Math.atan2(d[0],d[2]),-Math.asin(clamp(d[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[w/0.06,w/0.06,len])),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
function burst(items,p,k,n,seed,sc,col,grav){for(let i=0;i<n;i++){const d=V.norm([hsh(i,seed)-0.5,0.25+hsh(i,seed+1)*0.9,hsh(i,seed+2)-0.5]);const v=(0.6+hsh(i,seed+3))*sc;const g=grav==null?4.9:grav;
  const q=[p[0]+d[0]*v*k,p[1]+d[1]*v*k-g*k*k*sc*0.3,p[2]+d[2]*v*k];if(q[1]<0)continue;const vel=V.norm([d[0],d[1]-g*0.6*k/v*sc,d[2]]);streak(items,q,vel,0.25*sc*Math.max(0.2,1-k),0.03*sc,col||mix3([1,1,0.85],[1,0.5,0.15],clamp(k,0,1)),Math.max(0,1-k/1.2))}}
function puff(items,p,k,n,sc,col,a0){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);if(k<0||k>1.6)continue;const d=easeOut(k/1.0)*sc*(0.8+0.4*hsh(j,3));items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1*sc+k*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+k*0.25)*sc),tint:col||[0.72,0.68,0.6],tintAmt:1,alpha:Math.max(0,(a0||0.7)*(1-k/1.6)),noShadow:true})}}
// proton beam pass along x: from x=sx*8 to -sx*8 in dur s
function beamPass(items,t,t0,dur,y,z,sx,a,col){const k=(t-t0)/dur;if(k<-0.01||k>1.9)return;const c=col||[0.55,0.75,1];
  if(k<=1){const x=lerp(sx*8,-sx*8,k);const p=[x,y,z];const d=[-sx,0,0];streak(items,p,d,4.0,0.07,c,0.85*a);streak(items,p,d,1.6,0.035,[1,1,1],a);QPTS.push({p,c:'150,200,255',r:0.7,a:0.9*a})}
  const fk=k<=1?0:(k-1)/0.9;const x0=sx*8,x1=lerp(sx*8,-sx*8,Math.min(1,k));const L=Math.abs(x1-x0);if(L>0.1)streak(items,[x1,y,z],[-sx,0,0],L,0.02,c,0.45*a*(1-fk))}
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
  // distant mountains (Jura-like ridge)
  for(let i=0;i<26;i++){const a=-0.9+i*0.07,d=5200+hsh(i,3)*900;const x=Math.sin(a)*d,z=Math.cos(a)*d;m.prism([x,0,z],380+hsh(i,4)*260,40,260+hsh(i,5)*420,9,mix3(hx('#5a7088'),hx('#7a8aa0'),hsh(i,6)),0,i)}
  SF_BG=m.build(0.5)}
const SF_WINM=um(m=>{for(const p of SF_WIN)m.box(p,[1.3,1.3,0.1],[1,1,1],MAT.glass)});
// ---------- background ----------
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  if(rn>=1&&rn<=3){const a=rn===1?ease((t-R[1]-0.5)/2):1;if(a>0.01){items.push({mesh:SF_WINM,M:M4.id(),tint:[1,0.8,0.45],tintAmt:1,alpha:a,add:1,noShadow:true});for(let i=0;i<SF_WIN.length;i+=2)BGPTS.push({p:SF_WIN[i],c:'255,200,120',r:5,a:0.35*a})}}
  // R2: hologram of the 27 km ring in the sky, proton bunches racing around
  if(rn===1&&t>=EV.s2-0.2){const a=ease((t-EV.s2+0.2)/1.2)*(1-ease((t-R[2]+0.6)/0.6));const c=P(4500,0,950);const tl=1.05;const up=[0,1,0];
    const u=side,v=V.norm(V.add(V.sc(dir,Math.cos(tl)),V.sc(up,Math.sin(tl))));const RR=1000;const rp=an=>V.add(c,V.add(V.sc(u,Math.cos(an)*RR),V.sc(v,Math.sin(an)*RR)));
    const NS=72;for(let i=0;i<NS;i++){const a0=i/NS*TAU2,a1=(i+1)/NS*TAU2;const p0=rp(a0),p1=rp(a1);const d=V.sub(p1,p0);const L=V.len(d);streak(items,p1,V.sc(d,1/L),L*1.15,22,[0.3,0.85,1],0.55*a);streak(items,p1,V.sc(d,1/L),L*1.15,7,[0.85,1,1],0.6*a)}
    BGPTS.push({p:c,c:'90,240,255',r:1400,a:0.18*a});
    const sp=1.2+Math.max(0,t-EV.s2-1)*0.9;for(let b=0;b<2;b++)for(let i=0;i<5;i++){const sg=b?1:-1;const an=sg*(t-EV.s2)*sp+i/5*TAU2+b*0.3;const p=rp(an);const d=V.norm(V.sub(rp(an-sg*0.01),p));
      streak(items,p,V.sc(d,-1),420,40,b?[1,0.5,0.85]:[0.6,0.8,1],0.9*a);streak(items,p,V.sc(d,-1),160,22,[1,1,1],a);BGPTS.push({p,c:b?'255,120,200':'150,200,255',r:260,a:0.8*a})}}
  // dawn sun + bird (FINAL)
  if(rn>=4){const sp=V.sc(SUNDIR5,30000);items.push({mesh:SUNG,M:M4.trs(sp,0,0,0,1300)});BGPTS.push({p:sp,c:'255,215,150',r:6000,a:0.7*ease((t-R[4])/1.2),sun:1});
    if(t>=R[4]+0.4&&t<EV.dot5+3){const k=(t-R[4]-0.4)/5.0;const p=P(45,lerp(-30,34,k),5.2+Math.sin(t*2.2)*0.3);const yaw=Math.atan2(-side[0],-side[2]);const fl=Math.sin(t*11)*0.7;const Mb=M4.trs(p,yaw,0.05,0,3);
      items.push({mesh:LH_BIRD,M:Mb});items.push({mesh:LH_WR,M:M4.mul(Mb,M4.trs([0.18,0.05,0],0,0,fl,1))});items.push({mesh:LH_WL,M:M4.mul(Mb,M4.trs([-0.18,0.05,0],0,0,-fl,1))})}}
  return{items,dir,side}}
// ---------- foreground ----------
let LASTVP=null,QPTS=[];
const CP=[-0.3,0.95,2.2],BH=[0.12,0.6,-1.45];
function breadPos(t){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);const kk=ease(k);const S=[1.5,2.6,1.6],E=[0.02,1.0,-0.32];const w=Math.sin(k*8)*0.22*(1-k);
  return[lerp(S[0],E[0],kk)+w,lerp(S[1],E[1],kk)+Math.cos(k*6)*0.1*(1-k),lerp(S[2],E[2],kk)]}
function bunch(items,p,t,col,cs){items.push({mesh:GSPH,M:M4.trs(p,0,0,0,0.13*(1+0.15*Math.sin(t*37))),tint:[1,1,1],tintAmt:1,alpha:0.95,add:1,noShadow:true});
  items.push({mesh:GSPH,M:M4.trs(p,0,0,0,0.32*(1+0.1*Math.sin(t*23))),tint:col,tintAmt:1,alpha:0.5,add:1,noShadow:true});QPTS.push({p,c:cs,r:1.0,a:0.9})}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];const L=TILE;
  let pose='walk',walk=sjSpd(t)>0?1:0,o={t};
  const dist=sjD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // HOOK: two proton beams rip past the ant
  if(t<R[0]){beamPass(items,t,EV.h0-0.12,0.22,0.55,-0.95,1,1);beamPass(items,t,EV.h1-0.12,0.22,0.8,0.9,-1,1,[1,0.5,0.85]);
    for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.2*j,0],0,0,(h===EV.h0?0.1:-0.1)*j,1);o.lid=0;o.flail=1}}if(t>=2.0)o.lid=0.3}
  // R1: frozen by the magnets' cold
  if(rn===0){const fk=ease((t-EV.b1)/2.5);const melt=1-ease((t-EV.res1-0.6)/2.0);const fa=fk*melt;
    if(fa>0.01){items.push({mesh:DISC2,M:M4.trs([0,0.012,0.1],0,0,0,[0.3+fk*4.5,1,0.3+fk*4.5]),tint:[0.86,0.95,1],tintAmt:1,alpha:0.75*fa,noShadow:true});
      for(let i=0;i<26;i++){const a=hsh(i,51)*TAU2,d=0.4+hsh(i,52)*3.2*fk;items.push({mesh:USPH,M:M4.trs([Math.cos(a)*d,0.02,0.1+Math.sin(a)*d],hsh(i,53)*3,0,0,[0.05+hsh(i,54)*0.06,0.04+0.08*hsh(i,55),0.05]),tint:[0.92,0.98,1],tintAmt:1,alpha:0.9*fa,noShadow:true})}
      for(let i=0;i<40;i++){const per=2.2+hsh(i,61);const ph=((t-EV.b1)/per+hsh(i,62))%1;const p=[(hsh(i,63)-0.5)*5+Math.sin(t*1.3+i)*0.1,3.2-ph*3.2,-1.5+hsh(i,64)*4];if(p[1]<0.02)continue;items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.018+hsh(i,65)*0.015),tint:[1,1,1],tintAmt:1,alpha:0.85*fa,noShadow:true})}}
    if(t>=EV.b1+0.8&&t<EV.res1){walk=0;o.lid=0;o.headDown=-0.2;o.frost=ease((t-EV.b1-0.8)/2.4)*(t<EV.crk1?1:1-ease((t-EV.crk1)/1.5))}
    if(t>=EV.res1)o.frost=0.4*(1-ease((t-EV.res1)/1.2));
    if(t>=EV.hit1-0.6&&t<EV.crk1){const g=ease((t-EV.hit1+0.6)/0.6);const j=t>EV.crk1-0.7?Math.sin(t*70)*0.02:0;const M=M4.trs([j,0,0.12],0,0,0,[1.3,1.12*g,1.75]);
      items.push({mesh:LH_ICE,M,tint:[0.62,0.86,1],tintAmt:1,alpha:0.34,noShadow:true});items.push({mesh:LH_ICE,M:M4.mul(M,M4.trs([0,0,0],0,0,0,1.02)),tint:[0.5,0.8,1],tintAmt:1,alpha:0.16,add:1,noShadow:true});
      if(g>0.9){for(const s of[-1,1])for(const z of[-1,1])streak(items,[s*0.65,1.12,0.12+z*0.875],[0,-1,0],1.12,0.014,[0.85,0.97,1],0.6)}
      if(t>=EV.hit1)Rm=M4.trs([j,0,0],0,0,0,1)}
    if(t>=EV.crk1){const k=t-EV.crk1;if(k<1.6){burst(items,[0,0.55,0.12],k,30,71,1.8,[0.75,0.92,1],4.9);puff(items,[0,0.02,0.12],k,10,0.9,[0.9,0.96,1],0.6)}
      if(k<0.4){const j=Math.sin(k/0.4*Math.PI);Rm=M4.trs([0,0.12*j,0],0,0,0.06*j,1);o.flail=1}}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5);o.lid=0.4}}
  // R2: protons race past – faster and faster
  if(rn===1){if(t>=EV.s2+1.4&&t<EV.res2){o.lid=0;o.headDown=-0.3;walk=0}
    const PS=[[15.4,0.5,1.6,1],[16.3,0.35,2.4,-1],[17.0,0.7,1.2,1],[17.6,0.25,-1.4,-1],[18.1,0.6,2.0,1],[18.45,0.9,1.0,-1],[18.75,0.3,-1.7,1],[EV.hit2,1.02,-0.38,-1]];
    for(let i=0;i<PS.length;i++){const [t0,y,z,sx]=PS[i];beamPass(items,t,t0-0.1,0.2,y,z,sx,1,i%2?[1,0.5,0.85]:null)}
    if(t>=EV.hit2+0.15)for(let i=0;i<14;i++){const per=0.55+hsh(i,81)*0.5;const t0=EV.hit2+0.2+hsh(i,82)*per;const kk=((t-t0)/per)%1;if(t<t0)continue;const y=0.25+hsh(i,83)*0.9,z=(hsh(i,84)<0.5?-1:1)*(1.2+hsh(i,85)*1.5);beamPass(items,EV.hit2+kk*per,EV.hit2,0.2,y,z,i%2?1:-1,0.6,i%2?[1,0.5,0.85]:null)}
    if(t>=EV.hit2-0.05&&t<EV.hit2+0.9){const k=(t-EV.hit2+0.05)/0.95;Rm=M4.trs([0,0.18*Math.sin(k*Math.PI),0],easeOut(k)*TAU2,0,0.08*Math.sin(k*Math.PI*2),1);o.flail=1;o.lid=0;QPTS.push({p:[-0.1,1.0,-0.4],c:'200,220,255',r:0.5*(1-k),a:0.9})}
    if(t>=EV.res2&&t<R[2]){o.glasses=1-ease((t-R[2]+0.6)/0.4);o.lid=0.35}}
  // R3: head-on collision behind the ant
  if(rn===2){if(t>=EV.b3+1.0&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.35}
    if(t<EV.land3){const k=clamp((t-EV.b3)/(EV.land3-EV.b3),0,1);const kk=Math.pow(k,1.6);const xL=lerp(-4.2,CP[0]-0.02,kk),xR=lerp(3.6,CP[0]+0.02,kk);
      if(t>=EV.b3){bunch(items,[xL,CP[1],CP[2]],t,[0.5,0.75,1],'140,190,255');bunch(items,[xR,CP[1],CP[2]],t+1,[1,0.45,0.8],'255,120,200');
        streak(items,[xL,CP[1],CP[2]],[1,0,0],2.5,0.08,[0.55,0.75,1],0.8);streak(items,[xR,CP[1],CP[2]],[-1,0,0],2.5,0.08,[1,0.5,0.85],0.8);
        streak(items,[CP[0],CP[1],CP[2]],[1,0,0],16,0.015,[0.6,0.8,1],0.25);
        if(k>0.75){const g=(k-0.75)/0.25;QPTS.push({p:CP,c:'255,255,255',r:1.5*g,a:0.6*g})}}}
    else{const k=t-EV.land3;
      items.push({mesh:GSPH,M:M4.trs(CP,0,0,0,0.15+easeOut(k/0.35)*2.4),tint:mix3([1,1,1],[1,0.75,0.5],clamp(k/0.8,0,1)),tintAmt:1,alpha:Math.max(0,0.95*(1-k/1.1)),add:1,noShadow:true});
      items.push({mesh:RING,M:M4.trs(CP,0,Math.PI/2,0,0.3+easeOut(k/1.2)*7),tint:[0.6,0.9,1],tintAmt:1,alpha:Math.max(0,0.8*(1-k/1.3)),add:1,noShadow:true});
      QPTS.push({p:CP,c:'255,250,240',r:Math.max(0.3,5*(1-k/1.5)),a:0.95});
      const TC=[[1,0.85,0.3],[0.35,0.95,1],[1,0.35,0.6],[0.5,1,0.55]];const ta=Math.max(0,1-Math.max(0,k-1.8)/1.4);
      if(ta>0)for(let j=0;j<22;j++){const th0=hsh(j,91)*TAU2,cv=(hsh(j,92)-0.5)*2.6,Lj=(1.2+hsh(j,93)*2.6)*easeOut(k/0.6);const zz=(hsh(j,94)-0.5)*0.5;let q=CP.slice(),th=th0;const ns=10,ds=Lj/ns;
        for(let s=0;s<ns;s++){th+=cv*ds;const d=V.norm([Math.cos(th),Math.sin(th),zz]);const q2=V.add(q,V.sc(d,ds));if(q2[1]<0.02)break;streak(items,q2,d,ds*1.15,0.028,TC[j%4],ta*(0.55+0.45*s/ns));q=q2}
        if(j%3===0)QPTS.push({p:q,c:['255,215,80','90,240,255','255,90,150','125,255,154'][j%4],r:0.25,a:0.6*ta})}
      if(k<1.5)burst(items,CP,k,26,95,2.4,null,1.2);
      if(k>=0.12){o.soot=ease((k-0.12)/0.3)*0.55}
      if(k>=0.1&&k<2.0){const kk=k-0.1;o.flail=1;o.lid=0;const push=-0.3*ease(kk/0.5);Rm=M4.trs([0.08*Math.sin(kk*30)*(1-kk/2),Math.abs(Math.sin(kk*11))*0.06*(1-kk/2),push],0,0,0,1)}
      if(k>=2.0)Rm=M4.trs([0,0,-0.3],0,0,0,1);
      if(k>=0.3&&k<3){for(let i=0;i<5;i++){const kk=((k*0.5+i/5)%1);items.push({mesh:USPH,M:M4.trs([0.05+Math.sin(i*2)*0.1,0.8+kk*0.8,-0.1],0,0,0,0.06+kk*0.18),tint:[0.25,0.24,0.24],tintAmt:1,alpha:0.4*(1-kk),noShadow:true})}}}
    if(t>=EV.res3){walk=0;o.glasses=easeOut((t-EV.res3)/0.5);o.lid=0.35;o.headDown=-0.25}}
  // R4: a mini black hole appears right in front of the ant
  if(rn===3){o.soot=0.55*(1-ease((t-R[3])/1.5));
    if(t>=EV.k4&&t<EV.res4+1.0){const ap=easeOut((t-EV.k4)/0.6);const ev=t>=EV.evap4?1-easeIn(clamp((t-EV.evap4)/0.35,0,1)):1;const s=ap*ev*(1+0.05*Math.sin(t*9));
      if(s>0.01){items.push({mesh:USPH,M:M4.trs(BH,0,0,0,0.085*s),tint:[0,0,0],tintAmt:1,noShadow:true});
        items.push({mesh:BHD,M:M4.trs(BH,t*2.2,0.42,0.15,0.065*s),tint:[1,1,1],tintAmt:0,alpha:0.95,add:1,noShadow:true});
        items.push({mesh:GSPH,M:M4.trs(BH,0,0,0,0.16*s),tint:[0.55,0.3,1],tintAmt:1,alpha:0.25,add:1,noShadow:true});
        QPTS.push({p:BH,c:'255,170,90',r:0.6*s,a:0.6});QPTS.push({p:BH,c:'150,90,255',r:1.4*s,a:0.45});
        const pull=ease((t-EV.k4-0.5)/2)*(0.55+0.45*ease((t-EV.c4)/1));
        for(let i=0;i<34;i++){const ph=((t*(0.35+0.25*pull)+hsh(i,101))%1);const r=(1-ph)*1.3;const an=hsh(i,102)*TAU2+ph*ph*14;const p=[BH[0]+Math.cos(an)*r,BH[1]+(hsh(i,103)-0.5)*0.5*(1-ph),BH[2]+Math.sin(an)*r*0.45];if(p[1]<0.01)continue;
          items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.012+0.012*hsh(i,104)),tint:i%3?[0.75,0.7,0.62]:[1,0.75,0.4],tintAmt:1,alpha:Math.min(1,ph*4)*ev,noShadow:true})}}
      if(t>=EV.evap4){const k=t-EV.evap4;if(k<0.5)QPTS.push({p:BH,c:'230,240,255',r:2.2*(1-k/0.5),a:1});if(k<1.4)burst(items,BH,k,24,111,1.2,[0.8,0.9,1],0.6)}}
    if(t>=EV.k4+0.6&&t<EV.evap4){walk=0;o.lid=0;o.flail=1;const pull=ease((t-EV.k4-0.8)/2)*(0.5+0.5*ease((t-EV.c4)/1));o.headDown=0.1*pull;
      Rm=M4.trs([0.03*Math.sin(t*45)*pull,0,-0.22*pull],0,0,0.05*Math.sin(t*13)*pull,1);if(t>=EV.c4)pose='cling'}
    if(t>=EV.evap4&&t<EV.res4){const k=(t-EV.evap4)/0.4;Rm=M4.trs([0,0.1*Math.sin(k*Math.PI),-0.22*(1-ease(k))],0,0,0,1);o.lid=0}
    if(t>=EV.res4){pose='sit';walk=0;Rm=M4.trs([0,0,0],0,0,0,1);o.glasses=easeOut((t-EV.res4)/0.5);o.lid=0.3;o.headDown=-0.2}}
  // FINAL: ONE piece of bread dropped by a bird
  if(rn===4){if(t>=EV.dot5&&t<EV.res5+1.5){const p=t<EV.hit5?breadPos(t):V.add([0.02,1.0,-0.32],[0.3*ease((t-EV.hit5)/0.6),-0.92*easeIn(clamp((t-EV.hit5)/0.6,0,1)),-0.15]);const sp=t*2.4;
      items.push({mesh:LH_BREAD,M:M4.trs([p[0],Math.max(0.08,p[1]),p[2]],sp,0.5+sp*0.6,0.3,[0.17,0.12,0.26])});const ap=clamp((t-EV.dot5)/0.4,0,1);if(t<EV.hit5)QPTS.push({p,c:'255,230,170',r:0.25,a:0.6*ap})}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=-0.25+0.15*ease((t-EV.look5)/1.5);if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.015;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;if(k<0.35)QPTS.push({p:[0.02,1.0,-0.32],c:'255,245,220',r:0.7*(1-k/0.35),a:1});
      if(k<1.2)burst(items,[0.02,0.9,-0.32],k,12,121,0.6,[1,0.85,0.55],4.9);
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      else{Rm=M4.trs([Math.sin(k*70)*0.03,Math.abs(Math.sin(k*18))*0.08,0],0,0,0,1);o.flail=1;o.dizzy=1}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sjD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.2,EV.res1+1.8,EV.res2+2.6,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
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
  S(EV.h0,20,0.4);S(EV.h1,16,0.4);S(EV.crk1,18,0.5);S(EV.hit2,22,0.6);S(EV.land3,48,1.5);S(EV.evap4,16,0.5);S(EV.hit5,10,0.4);S(EV.fall5+0.35,14,0.4);
  const rn=roundAt(tt);if(rn===2&&tt>=EV.b3+2&&tt<EV.land3)a+=5*ease((tt-EV.b3-2)/3);if(rn===3&&tt>=EV.c4&&tt<EV.evap4)a+=3.5;if(rn===0&&tt>=EV.crk1-0.7&&tt<EV.crk1)a+=3;return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
const BLUE='rgba(20,110,170,0.92)',DARK='rgba(15,10,30,0.8)',PINK='rgba(200,40,110,0.92)',GREEN='rgba(40,140,60,0.9)',RED='rgba(200,30,40,0.92)',ORANGE='rgba(210,100,20,0.92)',CYAN='rgba(20,150,190,0.92)';
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?54:58,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  const C1=1600,C2=1715;
  // R1
  if(rn===0&&t>=EV.b1+0.3&&t<EV.hit1)card('LHC magnets: superconducting 🧲',C1,CYAN,46,EV.b1+0.3,t);
  if(rn===0&&t>=EV.b1+1.2&&t<EV.hit1)card('cooled with liquid helium 🧊',C2,DARK,48,EV.b1+1.2,t);
  if(rn===0&&t>=EV.hit1&&t<EV.crk1)card('FROZEN SOLID 🧊',660,CYAN,80,EV.hit1,t);
  if(rn===0&&t>=EV.crk1&&t<EV.res1+0.3)card('*CRACK*',660,DARK,76,EV.crk1,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: they run at −271.3 °C',C1,BLUE,50,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.2&&t<R[1]-0.2)card('colder than outer space 🌌',C2,BLUE,50,EV.res1+1.2,t);
  // R2
  if(rn===1&&t>=EV.s2+0.6&&t<EV.hit2)card('A 27 km ring under Switzerland 🔁',C1,DARK,46,EV.s2+0.6,t);
  if(rn===1&&t>=EV.s2+1.6&&t<EV.hit2)card('99.9999991% of light speed ⚡',C2,ORANGE,48,EV.s2+1.6,t);
  if(rn===1&&t>=EV.hit2&&t<EV.res2)card('THAT WAS CLOSE 😱',660,PINK,76,EV.hit2,t);
  if(rn===1&&t>=EV.res2+0.4&&t<R[2]-0.2)card('Real: protons lap the ring',C1,BLUE,50,EV.res2+0.4,t);
  if(rn===1&&t>=EV.res2+1.1&&t<R[2]-0.2)card('11,245 times EVERY second 🤯',C2,BLUE,50,EV.res2+1.1,t);
  // R3
  if(rn===2&&t>=EV.b3+0.6&&t<EV.land3)card('2 proton beams. Head-on. 💥',C1,PINK,48,EV.b3+0.6,t);
  if(rn===2&&t>=EV.b3+1.6&&t<EV.land3)card('(shown in SLOW-MO 🐢)',C2,DARK,46,EV.b3+1.6,t);
  if(rn===2&&t>=EV.land3+0.1&&t<EV.res3)card('COLLISION 💥',660,RED,80,EV.land3+0.1,t);
  if(rn===2&&t>=EV.res3+0.5&&t<R[3]-0.2)card('Real: for a split second it gets',C1,BLUE,48,EV.res3+0.5,t);
  if(rn===2&&t>=EV.res3+1.2&&t<R[3]-0.2)card('a BILLION× hotter than the Sun’s core ☀️',C2,BLUE,42,EV.res3+1.2,t);
  // R4
  if(rn===3&&t>=EV.k4+0.4&&t<EV.evap4)card('Some people feared the LHC',C1,DARK,48,EV.k4+0.4,t);
  if(rn===3&&t>=EV.k4+1.2&&t<EV.evap4)card('could make black holes 😱',C2,DARK,50,EV.k4+1.2,t);
  if(rn===3&&t>=EV.c4+0.3&&t<EV.evap4)card('IT’S PULLING HIM IN 😱',660,PINK,70,EV.c4+0.3,t);
  if(rn===3&&t>=EV.evap4&&t<EV.res4+0.2)card('*poof* ✨',660,DARK,76,EV.evap4,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('Real: physicists say a mini one',C1,BLUE,48,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.1&&t<R[4]-0.2)card('would vanish instantly (Hawking) ✨',C2,BLUE,46,EV.res4+1.1,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.dot5+0.4)card('Sunrise. He survived it all… 😌',C1,DARK,50,R[4]+0.6,t);
  if(rn===4&&t>=EV.dot5+0.6&&t<EV.look5+0.2)card('…wait 😳',660,'rgba(30,120,190,0.92)',66,EV.dot5+0.6,t);
  if(rn===4&&t>=EV.look5+0.3&&t<EV.hit5)card('ONE piece of bread 🥖',1600,ORANGE,60,EV.look5+0.3,t);
  if(rn===4&&t>=EV.hit5&&t<EV.res5+0.4)card('*BONK*',660,DARK,74,EV.hit5,t);
  if(rn===4&&t>=EV.res5+0.7)card('Real: 2009, a bird dropped bread',1400,BLUE,50,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.3)card('on the LHC’s outdoor power gear 🐦',1515,BLUE,46,EV.res5+1.3,t);
  if(rn===4&&t>=EV.res5+2.4)card('→ its magnets overheated 🔥',1630,RED,50,EV.res5+2.4,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('LARGE HADRON',0,-170,fitSize('LARGE HADRON',960,104),'#5AF0FF');txt('COLLIDER ⚛️',0,-60,fitSize('COLLIDER ⚛️',960,112),'#FFD84A');txt('vs',0,35,70,'#ffffff');txt('ONE DYING ANT 🐜',0,130,92,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived −271 °C, light-speed protons,';txt(l1,0,-260,fitSize(l1,980,58),'#FFD84A');const l2='a collision & a black hole 🕳️';txt(l2,0,-180,fitSize(l2,960,60),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('piece of bread 🥖',0,60,fitSize('piece of bread 🥖',960,104),'#FF9A3A');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
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
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.55,0.3,'190,220,255');flash(EV.h1,0.45,0.3,'255,190,230');flash(EV.crk1,0.5,0.4,'220,240,255');flash(EV.hit2,0.5,0.35,'200,220,255');flash(EV.land3,0.9,0.8,'255,250,240');flash(EV.evap4,0.6,0.4,'230,235,255');flash(EV.hit5,0.45,0.3,'255,255,255');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
