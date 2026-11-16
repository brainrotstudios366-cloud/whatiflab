// ===================== QUANTUM PHYSICS vs DYING ANT =====================
// ---------- new meshes ----------
const QM_HALF=um(m=>{const seg=48;for(let i=0;i<seg;i++){const a=Math.PI+i/seg*Math.PI,b=Math.PI+(i+1)/seg*Math.PI;const r0=0.93,r1=1;m.quad([Math.cos(a)*r0,0,Math.sin(a)*r0],[Math.cos(a)*r1,0,Math.sin(a)*r1],[Math.cos(b)*r1,0,Math.sin(b)*r1],[Math.cos(b)*r0,0,Math.sin(b)*r0],[1,1,1],MAT.emis)}});
// slit wall (x from -2.5..2.5, slits at +-0.32, width 0.2) centred at z=0, thickness 0.12
const QM_SW=0.2,QM_SX=0.32;
const QM_SLIT=um(m=>{const H=0.95,T=0.12,c=hx('#2a2f4a'),ct=hx('#5AF0FF');const segs=[[-2.6,-QM_SX-QM_SW/2],[-QM_SX+QM_SW/2,QM_SX-QM_SW/2],[QM_SX+QM_SW/2,2.6]];
  for(const [a,b] of segs){m.box([(a+b)/2,H/2,0],[b-a,H,T],c,0,0,c);m.box([(a+b)/2,H+0.02,0],[b-a,0.04,T+0.02],ct,MAT.emis)}
  for(const x of[-QM_SX-QM_SW/2,-QM_SX+QM_SW/2,QM_SX-QM_SW/2,QM_SX+QM_SW/2])m.box([x,H/2,-T/2-0.005],[0.025,H,0.02],ct,MAT.emis)},0.2);
// detector screen with interference stripes (emissive) – built at z=0 facing +z
const QM_SCR=um(m=>{m.box([0,1.2,0.05],[5.2,2.4,0.06],hx('#14162a'))},0.2);
const QM_STR=um(m=>{const N=120;for(let i=0;i<N;i++){const x0=-2.5+5*i/N,x1=-2.5+5*(i+1)/N;const xc=(x0+x1)/2;const I=Math.pow(Math.cos(xc*5.2),2)*Math.exp(-xc*xc*0.35);const c=mix3([0.02,0.03,0.08],[0.45,1,1],I);m.quad([x0,0.1,0],[x1,0.1,0],[x1,2.3,0],[x0,2.3,0],c,MAT.emis)}});
// energy barrier (tunnelling)
const QM_BAR=um(m=>{m.box([0,1.3,0],[5,2.6,0.36],hx('#ff4a8a'),MAT.emis)},0.2);
const QM_BARE=um(m=>{for(const y of[0.02,2.6])m.box([0,y,0],[5.05,0.05,0.4],[1,1,1],MAT.emis);for(let i=-6;i<=6;i++)m.box([i*0.4,1.3,0.19],[0.02,2.6,0.02],[1,0.8,0.9],MAT.emis)},0.2);
// cardboard box (open at bottom), size 1.7 x 1.35 x 2.0
const QM_BOX=um(m=>{const c=hx('#c89a5e'),c2=hx('#b0844a'),w=1.7,h=1.35,d=2.0,T=0.04;
  m.box([0,h-T/2,0],[w,T,d],c,0,0,hx('#d4a86a'));m.box([-w/2+T/2,h/2,0],[T,h,d],c2);m.box([w/2-T/2,h/2,0],[T,h,d],c2);m.box([0,h/2,-d/2+T/2],[w,h,T],c);m.box([0,h/2,d/2-T/2],[w,h,T],c);
  m.box([0,h+0.001,0],[0.18,0.012,d+0.01],hx('#d8c8a0'));m.box([0,h/2,-d/2-0.001],[0.18,h,0.012],hx('#d8c8a0'))},0.2);
// poison vial
const QM_VIAL=um(m=>{m.prism([0,0,0],0.08,0.08,0.22,16,[0.75,0.9,0.95],MAT.glass);m.prism([0,0.22,0],0.04,0.04,0.07,12,[0.75,0.9,0.95],MAT.glass);m.prism([0,0.29,0],0.05,0.05,0.04,12,hx('#8a5a2a'))},0.5);
const QM_LIQ=um(m=>{m.prism([0,0.01,0],0.07,0.07,0.14,16,hx('#7DFF9A'),MAT.emis)},0.5);
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={wave1:4.8,str1:6.0,stop1w:9.0,bonk1:9.6,res1:9.8,fade1:12.4,
  go2:13.5,bonk2:15.3,res2a:15.5,ghost2:17.4,walk2a:17.8,walk2b:19.5,res2:19.9,fade2:23.6,
  stop3:25.6,split3:26.0,look3:29.9,coll3:30.3,res3:30.9,
  drop4:36.5,open4:43.0,res4:43.4,
  shot5:49.0,ph5a:49.4,hit5:52.8,fall5:53.3,res5:53.7,endc:61.0,loop:65.5};
const ROUNDS=[['ROUND 1','DOUBLE-SLIT 🌊','Too BIG to be a wave 🤕',EV.res1],['ROUND 2','QUANTUM TUNNELING 🧱','FIRST TRY?! 😳',EV.res2],['ROUND 3','SUPERPOSITION 👯','Collapsed… ALIVE 😮‍💨',EV.res3],['ROUND 4','SCHRÖDINGER’S BOX 📦','He drank the poison. Fine. 😎',EV.res4],['FINAL ROUND','ONE photon 💡','Cause of death: YOU looked 👁️💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
// walking speed schedule (1 = walk) -> integrated ground distance
function qmSpd(t){if(t>=EV.wave1&&t<EV.stop1w)return 0;if(t>=EV.bonk1&&t<EV.go2)return 0;if(t>=EV.bonk2&&t<EV.walk2a)return 0;if(t>=EV.walk2b&&t<R[2])return 0;if(t>=EV.stop3&&t<R[4])return 0;if(t>=EV.hit5)return 0;
  if(t>=EV.walk2a&&t<EV.walk2b)return 0.95;if(t>=R[4]&&t<EV.hit5)return 0.75;return 1}
const QM_DT=1/120,QM_TAB=[0];for(let i=1;i<=DUR/QM_DT+10;i++){const tm=(i-0.5)*QM_DT;QM_TAB.push(QM_TAB[i-1]+qmSpd(tm)*QM_DT*1.1)}
function qmD(t){t=clamp(t,0,DUR+0.05);const f=t/QM_DT,i=Math.floor(f);return lerp(QM_TAB[i],QM_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// object positions that ride on the ground
const slitZ=t=>-0.78+(qmD(t)-qmD(EV.bonk1));
const barZ=t=>-0.66-0.18+(qmD(t)-qmD(EV.bonk2));
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const E_DAY=envBase();
const E_COSMIC=envBase({sunCol:hx('#c8b0ff'),sky:hx('#5a4a90'),fog:hx('#6a5aa0'),hor:hx('#9a7ad0'),zen:hx('#1a1040'),gnd:hx('#4a4060'),stars:0.5,night:0.35,gndCol:hx('#6a5aa0')});
const E_Q=mixEnv(E_DAY,E_COSMIC,0.72);E_Q.sun=V.norm([0.5,0.7,-0.45]);
const E_LAB=envBase({sunCol:hx('#b8c8ff'),sky:hx('#1a1a48'),fog:hx('#24245a'),hor:hx('#4a3a8a'),zen:hx('#06061a'),gnd:hx('#2a2a48'),stars:0.9,night:0.55,gndCol:hx('#24245a'),fogD:3000});E_LAB.sun=V.norm([0.4,0.8,-0.4]);
function envAt(t){const rn=roundAt(t);let e=E_Q;
  // darker "lab" while waves / tunnelling / photon glow
  let d=0;if(rn===0&&t>=EV.wave1-0.4)d=ease((t-EV.wave1+0.4)/0.6)*(1-ease((t-EV.bonk1+0.2)/0.6));
  if(rn===1&&t>=EV.ghost2-0.4)d=ease((t-EV.ghost2+0.4)/0.6)*(1-ease((t-EV.res2)/0.8));
  if(rn===4&&t>=EV.shot5)d=0.8*ease((t-EV.shot5)/0.5)*(1-ease((t-EV.hit5-0.2)/0.8));
  if(d>0)e=mixEnv(E_Q,E_LAB,d);return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.95,-3.9-k*0.3];at=[0,1.05,0.3]}
  if(rn===0){const k=ease((t-R[0])/1.2);// rear 3/4 view looking through the slits
    eye=[lerp(1.6,1.6,k),lerp(1.0,3.0,k),lerp(-3.9,3.0,k)];at=[0,lerp(0.8,0.7,k),lerp(0.3,-2.2,k)];
    if(k>=1){eye=[1.6+sway*0.3,3.0,3.0];at=[0,0.7,-2.2]}
    if(t>=EV.stop1w){const kk=ease((t-EV.stop1w)/0.6);eye=V.add(eye,[-0.3*kk,-0.9*kk,-0.6*kk]);at=V.add(at,[0,0.15*kk,0.7*kk])}
    if(t>=EV.fade1){const kk=ease((t-EV.fade1)/1.0);eye=[lerp(eye[0],2.6,kk),lerp(eye[1],1.0,kk),lerp(eye[2],-0.4,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.7,kk),lerp(at[2],-0.4,kk)]}}
  if(rn===1){eye=[3.7+sway*0.2,1.3,-0.1];at=[0,0.7,-0.45];if(t<R[1]+0.1){}
    if(t>=EV.ghost2-0.3){const kk=ease((t-EV.ghost2+0.3)/1.5);eye=V.add(eye,[0.5*kk,0.25*kk,0.15*kk]);at=V.add(at,[0,0.1*kk,0.2*kk])}
    if(t>=EV.fade2){const kk=ease((t-EV.fade2)/0.9);eye=[lerp(eye[0],1.75,kk),lerp(eye[1],1.0,kk),lerp(eye[2],-3.9,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.68,kk),lerp(at[2],0.4,kk)]}}
  if(rn===2){const k=ease((t-R[2])/1.0);eye=[1.75,1.0,-3.9];at=[0,0.68,0.4];
    if(t>=EV.split3-0.3){const kk=ease((t-EV.split3+0.3)/1.0)*(1-ease((t-EV.coll3)/0.6));eye=V.add(eye,[0.3*kk,1.0*kk,-0.7*kk]);at=V.add(at,[0,-0.15*kk,0.5*kk])}
    if(t>=EV.look3-0.3&&t<EV.coll3+0.3){eye=V.add(eye,V.sc(V.sub(at,eye),0.05*Math.sin(clamp((t-EV.look3+0.3)/0.9,0,1)*Math.PI)))}}
  if(rn===3){const k=ease((t-R[3])/1.0);eye=[lerp(1.75,2.3,k)+sway*0.3,lerp(1.0,1.9,k),lerp(-3.9,-4.3,k)];at=[0,lerp(0.68,0.6,k),0.2];
    if(t>=EV.open4){const kk=ease((t-EV.open4)/0.9);eye=V.add(eye,[-0.5*kk,-0.85*kk,1.2*kk]);at=V.add(at,[0,0.0,-0.1*kk])}}
  if(rn===4){eye=[1.75+sway*0.3,1.0,-3.9];at=[0,0.68,0.4];
    if(t>=EV.ph5a-0.2){const kk=ease((t-EV.ph5a+0.2)/1.2);eye=V.add(eye,[1.1*kk,0.05*kk,0.9*kk]);at=V.add(at,[0,0.05*kk,-0.9*kk])}
    if(t>=EV.hit5-0.4){const kk=ease((t-EV.hit5+0.4)/0.9);eye=[lerp(eye[0],1.0,kk),lerp(eye[1],1.45,kk),lerp(eye[2],-3.3,kk)];at=[lerp(at[0],-0.3,kk),lerp(at[1],0.4,kk),lerp(at[2],0,kk)]}}
  if(t>=R[5])eye=[1.0,1.45,-3.3],at=[-0.3,0.4,0];
  return{eye,at}}
// ---------- background ----------
function bgItems(t){return{items:[{mesh:BGG}]}}
// ---------- foreground ----------
let LASTVP=null,QPTS=[],BOXP=null,PHOT=null;
function ghostify(arr,col,al,add){for(const q of arr){if(q.tint)q.tint=mix3(q.tint,col,0.55);q.alpha=al;if(add)q.add=1;q.noShadow=true}return arr}
function qmAnt(Rm,o){return antItems(Rm,o)}
function fgItems(t){QPTS=[];BOXP=null;PHOT=null;const rn=roundAt(t);const items=[];const L=TILE;
  let pose='walk',walk=qmSpd(t)>0?1:0,o={t};let hide=false;
  const dist=qmD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // floating quantum sparkles
  for(let i=0;i<26;i++){const ph=(t*0.12+hsh(i,3))%1;const x=(hsh(i,1)-0.5)*7,z=(hsh(i,2)-0.6)*7;const y=0.2+ph*2.6;const tw=0.5+0.5*Math.sin(t*3+i);
    items.push({mesh:UEMIS,M:M4.trs([x+0.2*Math.sin(t+i),y,z],0,0,0,0.018+0.012*tw),tint:i%3?[0.35,0.95,1]:[1,0.45,0.75],tintAmt:1,alpha:0.8*Math.sin(ph*Math.PI),add:1,noShadow:true})}
  // ---- HOOK glitch (ant flickers between places) ----
  if(t<R[0]){for(const g of[0.7,1.35,2.0,2.55]){const k=t-g;if(k>=0&&k<0.16){const s=hsh(g*10|0,4)>0.5?1:-1;Rm=M4.trs([s*0.55,0,0],0,0,0,1);items.push(...ghostify(qmAnt(M4.id(),{t,ph:t*5.2,walk:1}),[0.35,0.95,1],0.35,1))}}}
  // ---- R1: double slit ----
  if(rn===0||(t>=R[1]&&t<R[1]+0.2)){const z=slitZ(t);const fa=(1-ease((t-EV.fade1)/0.8))*ease((t-R[0]-0.7)/0.6);
    if(fa>0.01&&z>-14){items.push({mesh:QM_SLIT,M:M4.trs([0,0,z],0,0,0,[1,fa,1])});
      const sz=z-2.3;items.push({mesh:QM_SCR,M:M4.trs([0,0,sz],0,0,0,[1,fa,1])});
      const sa=ease((t-EV.str1)/1.5)*fa;if(sa>0.01)items.push({mesh:QM_STR,M:M4.trs([0,0,sz+0.09],0,0,0,[1,fa,1]),tint:[1,1,1],tintAmt:0,alpha:sa,add:1,noShadow:true});
      if(sa<1&&t>=EV.str1-0.6)for(let i=0;i<40;i++){const tt=EV.str1-0.6+hsh(i,9)*2.2;if(t<tt||t>tt+0.6)continue;let x=(hsh(i,5)-0.5)*4.4;const I=Math.pow(Math.cos(x*5.2),2);if(I<0.5)x=Math.round(x*5.2/Math.PI)*Math.PI/5.2;items.push({mesh:UEMIS,M:M4.trs([x,0.25+hsh(i,6)*1.95,sz+0.12],0,0,0,0.035),tint:[0.7,1,1],tintAmt:1,alpha:1-(t-tt)/0.6,add:1,noShadow:true})}
      // waves
      if(t>=EV.wave1&&t<EV.stop1w+0.5){const wa=ease((t-EV.wave1)/0.4)*(1-ease((t-EV.stop1w)/0.5));const src=[0,0.06,-0.55];const dW=src[2]-z;
        for(let i=0;i<6;i++){const ph=((t-EV.wave1)*0.9+i/6)%1;const r=ph*dW;if(r<0.05)continue;items.push({mesh:QM_HALF,M:M4.trs(src,0,0,0,r),tint:[0.35,0.95,1],tintAmt:1,alpha:0.85*wa*(1-ph*0.5),add:1,noShadow:true})}
        for(const sx of[-QM_SX,QM_SX])for(let i=0;i<8;i++){const ph=((t-EV.wave1)*0.6+i/8)%1;const r=ph*2.3;if(r<0.05||t<EV.wave1+0.9)continue;items.push({mesh:QM_HALF,M:M4.trs([sx,0.06,z-0.07],0,0,0,r),tint:[0.35,0.95,1],tintAmt:1,alpha:0.75*wa*(1-ph),add:1,noShadow:true})}}}
    if(t>=EV.wave1&&t<EV.stop1w+0.4){const wa=ease((t-EV.wave1)/0.4)*(1-ease((t-EV.stop1w)/0.4));o.frost=0.4*wa;o.lid=0.1;items.push({mesh:UEMIS,M:M4.trs([0,0.5,0.1],0,0,0,0.85+0.05*Math.sin(t*12)),tint:[0.35,0.95,1],tintAmt:1,alpha:0.1*wa,add:1,noShadow:true});
      const w=1+0.05*Math.sin(t*14)*wa;Rm=M4.trs([0,0,0],0,0,0,[w,1/w,w])}
    if(t>=EV.bonk1&&t<EV.bonk1+0.25){const k=(t-EV.bonk1)/0.25;Rm=M4.trs([0,0,0.12*Math.sin(k*Math.PI)],0,-0.25*Math.sin(k*Math.PI),0,1)}
    if(t>=EV.bonk1+0.2&&t<EV.fade1+0.6){o.dizzy=true;o.lid=0.3}}
  // ---- R2: tunnelling barrier ----
  if(rn===1){const z=barZ(t);const fa=1-ease((t-EV.fade2)/0.7);
    if(fa>0.01){const gl=t>=EV.ghost2&&t<EV.walk2b+0.3?0.55:0.8;items.push({mesh:QM_BAR,M:M4.trs([0,0,z],0,0,0,[1,fa,1]),tint:[1,0.35,0.6],tintAmt:0.2,alpha:gl*fa,noShadow:true});
      items.push({mesh:QM_BARE,M:M4.trs([0,0,z],0,0,0,[1,fa,1]),tint:[1,0.85,0.95],tintAmt:1,alpha:fa,add:1,noShadow:true});QPTS.push({p:[0,1.3,z],c:'255,70,140',r:1.3,a:0.25*fa})}
    if(t<EV.bonk2)o.lid=0.35;
    if(t>=EV.bonk2&&t<EV.bonk2+0.25){const k=(t-EV.bonk2)/0.25;Rm=M4.trs([0,0,0.14*Math.sin(k*Math.PI)],0,-0.3*Math.sin(k*Math.PI),0,1)}
    if(t>=EV.bonk2+0.2&&t<EV.ghost2-0.2){o.dizzy=true;o.lid=0.3}
    if(t>=EV.ghost2&&t<EV.walk2b+0.3){const g=ease((t-EV.ghost2)/0.4)*(1-ease((t-EV.walk2b)/0.3));hide=true;
      const a=qmAnt(Rm,Object.assign({},o,{ph:t*5.2,walk:qmSpd(t)>0?1:0,pose:'walk',lid:0.2}));
      if(g<0.99){items.push(...a.map(q=>Object.assign({},q)))}
      items.push(...ghostify(qmAnt(Rm,Object.assign({},o,{ph:t*5.2,walk:qmSpd(t)>0?1:0,pose:'walk',lid:0.2})),[0.35,0.95,1],0.75*g,1));
      items.push({mesh:UEMIS,M:M4.trs([0,0.5,0.1],0,0,0,0.9),tint:[0.35,0.95,1],tintAmt:1,alpha:0.2*g,add:1,noShadow:true});
      if(g>=0.99)hide=true;else hide=true;
      // tunnelling sparks where the ant crosses the wall
      for(let i=0;i<10;i++){const ph=(t*2.2+hsh(i,4))%1;items.push({mesh:UEMIS,M:M4.trs([(hsh(i,5)-0.5)*0.8,0.2+hsh(i,6)*0.6,z+0.2+(hsh(i,7)-0.5)*0.1],0,0,0,0.03*(1-ph)),tint:[0.7,1,1],tintAmt:1,alpha:g*(1-ph),add:1,noShadow:true})}}
    if(t>=EV.res2&&t<EV.res2+2.2)o.glasses=easeOut((t-EV.res2)/0.5)}
  // ---- R3: superposition ----
  let copies=null;
  if(rn===2&&t>=EV.split3){const sk=easeOut((t-EV.split3)/0.6);const ck=t>=EV.coll3?easeIn(clamp((t-EV.coll3)/0.35,0,1)):0;const k=sk*(1-ck);
    if(ck<1){copies=[];const N=6;for(let i=0;i<N;i++){const a=-Math.PI*0.08+i/(N-1)*Math.PI*1.16;const rr=1.45*k;const p=[Math.cos(a)*rr*1.1,0,Math.sin(a)*rr*0.9+0.2*k];const dead=i%2===1;
        let M=M4.trs(p,a*0.3,0,0,1);if(dead)M=M4.mul(M,M4.trs([0,0.62,0],0,0,Math.PI*0.96,1));
        const fl=0.38+0.18*Math.sin(t*9+i*1.7);
        copies.push(...ghostify(qmAnt(M,{t:t+i,ph:0,walk:0,xeyes:dead,lid:dead?0:0.3,pose:dead?'fall':'walk',flail:dead?0:0}),dead?[1,0.4,0.6]:[0.35,0.95,1],fl*clamp(sk*2,0,1),1));
        if(dead)QPTS.push({p:V.add(p,[0,0.9,0]),emo:'💀'});else QPTS.push({p:V.add(p,[0,1.05,0]),emo:'😇'})}}
    if(ck<1)o.frost=0.35*k;if(t<EV.coll3){walk=0;o.lid=0.15}}
  if(copies)items.push(...copies);
  if(rn===2&&t>=EV.coll3&&t<EV.coll3+0.6){const k=(t-EV.coll3)/0.6;items.push({mesh:RING,M:M4.trs([0,0.05,0.1],0,0,0,0.2+k*3),tint:[0.6,1,1],tintAmt:1,alpha:0.9*(1-k),add:1,noShadow:true})}
  if(rn===2&&t>=EV.res3&&t<EV.res3+1.6){o.lid=0.6}
  // ---- R4: Schrödinger's box ----
  if(rn===3){const by=t<EV.drop4?lerp(5,0,easeIn(clamp((t-R[3]-0.2)/(EV.drop4-R[3]-0.2),0,1))):(t<EV.open4?0:easeIn(clamp((t-EV.open4)/0.6,0,1))*7);
    const bounce=t>=EV.drop4&&t<EV.drop4+0.3?Math.sin((t-EV.drop4)/0.3*Math.PI)*0.06:0;const sq=t>=EV.drop4&&t<EV.drop4+0.15?1-0.06*Math.sin((t-EV.drop4)/0.15*Math.PI):1;
    const tilt=t>=EV.open4?ease((t-EV.open4)/0.6)*0.9:0;
    if(by<6.5)items.push({mesh:QM_BOX,M:M4.trs([0,by+bounce,0.1],0.08,0,tilt,[1,sq,1])});BOXP=[0,0.72+by,-0.92+0.1];
    if(t>=EV.drop4&&t<EV.open4)hide=true;
    if(t>=EV.drop4&&t<EV.drop4+1.2){const k=t-EV.drop4;for(let i=0;i<10;i++){const a=i/10*TAU2;smoke(items,[Math.cos(a)*1.0,0.05,0.1+Math.sin(a)*1.1],k*2.0,1,0.6)}}
    // inside: vial
    if(t>=EV.open4){items.push({mesh:QM_VIAL,M:M4.trs([0.55,0.08,-0.55],0,0,1.5708,1),tint:[0.8,0.95,1],tintAmt:0.1,alpha:0.7,noShadow:false});QPTS.push({p:[0.5,0.12,-0.55],c:'125,255,154',r:0.25,a:0.3})}
    else if(t<EV.drop4){items.push({mesh:QM_VIAL,M:M4.trs([0.6,0,-0.5],0,0,0,1),tint:[0.8,0.95,1],tintAmt:0.1,alpha:0.7});items.push({mesh:QM_LIQ,M:M4.trs([0.6,0,-0.5],0,0,0,1),tint:[0.5,1,0.6],tintAmt:0.3,alpha:0.95,noShadow:true});QPTS.push({p:[0.6,0.12,-0.5],c:'125,255,154',r:0.35,a:0.45})}
    if(t>=EV.open4){pose='sit';walk=0;o.glasses=1;o.lid=0.35}
    if(t<EV.drop4&&t>=R[3]+0.3){walk=0;o.lid=0.05}}
  // ---- FINAL: one photon ----
  if(rn===4){if(t>=EV.shot5&&t<EV.hit5){o.lid=t<EV.ph5a+0.6?0.0:0.2;}
    if(t>=EV.ph5a&&t<EV.hit5+0.05){const k=clamp((t-EV.ph5a)/(EV.hit5-EV.ph5a),0,1);const A=[1.2,0.95,-3.6],B=[0,0.66,-0.6];const kk=k;
      const p=V.add(A,V.sc(V.sub(B,A),kk));PHOT=p;const dir=V.norm(V.sub(B,A));const side=V.norm(V.cross(dir,[0,1,0]));
      for(let i=0;i<34;i++){const s=i*0.022;const kq=kk-s/V.len(V.sub(B,A));if(kq<0)break;const q=V.add(A,V.sc(V.sub(B,A),kq));const wv=Math.sin(kq*60-t*25)*0.06*(1-i/34);
        items.push({mesh:UEMIS,M:M4.trs(V.add(V.add(q,V.sc(side,wv)),[0,wv*0.6,0]),0,0,0,0.028*(1-i/40)),tint:[1,0.9,0.4],tintAmt:1,alpha:1-i/34,add:1,noShadow:true})}
      items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.05),tint:[1,1,0.8],tintAmt:1,alpha:1,add:1,noShadow:true});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.12),tint:[1,0.85,0.3],tintAmt:1,alpha:0.35,add:1,noShadow:true})}
    if(t>=EV.hit5){const k=t-EV.hit5;if(k<0.5)for(let i=0;i<12;i++){const d=V.norm([hsh(i,1)-0.5,hsh(i,2)-0.3,hsh(i,3)-0.5]);items.push({mesh:UEMIS,M:M4.trs(V.add([0,0.7,-0.6],V.sc(d,k*0.9)),0,0,0,0.02*(1-k/0.5)),tint:[1,0.9,0.4],tintAmt:1,alpha:1,add:1,noShadow:true})}
      walk=0;o.lid=0;if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const b=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,b,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      else{const sh=Math.sin(k*60)*0.02;Rm=M4.trs([sh,0,0],0,0,0,1)}}}
  if(t>=R[5]){walk=0}
  o.ph=walk?qmD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.0,EV.res1+1.6,EV.res2a+0.6,EV.res3+0.8,R[4]+1.2];for(const c of coughs)if(t>=c&&t<c+1.4&&!(rn===3&&t>=EV.drop4))o.cough=t-c;
  if(!hide)items.push(...qmAnt(Rm,o));
  return items}
function smoke(items,p,k,n,sc){for(let j=0;j<n;j++){const kk=k-j*0.18;if(kk<0||kk>2.4)continue;items.push({mesh:USPH,M:M4.trs([p[0]+Math.sin(kk*2+j)*0.15*kk,p[1]+kk*0.9,p[2]+kk*0.2],0,0,0,(0.15+kk*0.3)*sc),tint:[0.6,0.56,0.6],tintAmt:1,alpha:Math.max(0,0.2*(1-kk/2.4)),noShadow:true})}}
// ---------- render ----------
function renderScene(t){const tt=sceneT(t);const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});const sd=env.sun[1]>0.05?{center:[0,0,-0.6],radius:5.0}:{center:[0,-9999,0],radius:1};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},sd,fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.bonk1,22,0.4);S(EV.bonk2,26,0.45);S(EV.coll3,18,0.4);S(EV.drop4,30,0.5);S(EV.open4,10,0.3);S(EV.hit5,12,0.3);S(EV.fall5+0.35,14,0.4);
  for(const g of[0.7,1.35,2.0,2.55])S(g,10,0.16);if(tt<0.8)a+=8*(1-tt/0.8);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
const QM_WL='0.00000000000000000000000001 m';// 1e-26
const QM_PJ='0.0000000000000000004 J';// 4e-19
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?54:60,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  // R1
  if(rn===0&&t>=EV.wave1+0.3&&t<EV.res1)card('The ant becomes a WAVE?! 🌊',660,'rgba(20,110,170,0.92)',54,EV.wave1+0.3,t);
  if(rn===0&&t>=EV.str1+1.6&&t<EV.res1)card('🐜 wavelength: '+QM_WL,780,'rgba(15,10,30,0.8)',44,EV.str1+1.6,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: electrons DO pass both slits 🌊',660,'rgba(20,110,170,0.92)',48,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.3&&t<R[1]-0.2)card('Record: molecules of 2,000 atoms (2019) ⚛️',780,'rgba(15,10,30,0.78)',40,EV.res1+1.3,t);
  // R2
  if(rn===1&&t>=R[1]+0.9&&t<EV.ghost2)card('Chance to tunnel: 0.000…0001% 🎲',660,'rgba(200,40,110,0.92)',48,R[1]+0.9,t);
  if(rn===1&&t>=EV.res2a+0.5&&t<EV.ghost2)card('Attempt #2… 😤',780,'rgba(15,10,30,0.78)',50,EV.res2a+0.5,t);
  if(rn===1&&t>=EV.ghost2+0.3&&t<EV.res2)card('👻 He’s going THROUGH it',660,'rgba(20,110,170,0.92)',54,EV.ghost2+0.3,t);
  if(rn===1&&t>=EV.res2+0.5&&t<R[2]-0.2)card('Real: electrons tunnel all the time ⚡',660,'rgba(20,110,170,0.92)',48,EV.res2+0.5,t);
  if(rn===1&&t>=EV.res2+1.3&&t<R[2]-0.2)card('(your phone’s memory chips use it 📱)',780,'rgba(15,10,30,0.78)',42,EV.res2+1.3,t);
  if(rn===1&&t>=EV.res2+2.1&&t<R[2]-0.2)card('For an ant: wait WAY longer than the universe ⏳',890,'rgba(200,40,110,0.9)',36,EV.res2+2.1,t);
  // R3
  if(rn===2&&t>=EV.split3+0.4&&t<EV.look3)card('🐜 in 6 places at once',660,'rgba(20,110,170,0.92)',58,EV.split3+0.4,t);
  if(rn===2&&t>=EV.split3+1.4&&t<EV.look3)card('Alive AND dead 😇💀',780,'rgba(200,40,110,0.92)',56,EV.split3+1.4,t);
  if(rn===2&&t>=EV.look3&&t<EV.res3)card('…until someone LOOKS 👁️',660,'rgba(15,10,30,0.85)',58,EV.look3,t);
  if(rn===2&&t>=EV.res3+0.6&&t<R[3]-0.2)card('Real record: a 16 µg crystal (2023) 💎',660,'rgba(20,110,170,0.92)',46,EV.res3+0.6,t);
  if(rn===2&&t>=EV.res3+1.4&&t<R[3]-0.2)card('An ant is ~100× heavier 🐜',780,'rgba(15,10,30,0.78)',50,EV.res3+1.4,t);
  // R4
  if(rn===3&&t>=R[3]+0.7&&t<EV.drop4)card('50% chance: poison 🧪',660,'rgba(40,140,60,0.9)',54,R[3]+0.7,t);
  if(rn===3&&t>=EV.drop4+0.6&&t<EV.open4-2.6)card('Alive? Dead? BOTH? 🤔',660,'rgba(15,10,30,0.82)',58,EV.drop4+0.6,t);
  if(rn===3&&t>=EV.drop4+1.5&&t<EV.open4-2.6)card('Real: Schrödinger’s 1935 thought experiment 🐱',780,'rgba(20,110,170,0.9)',38,EV.drop4+1.5,t);
  if(rn===3&&t>=EV.open4-2.6&&t<EV.open4){const n=Math.ceil(EV.open4-t);card('Opening in '+n+'…',700,'rgba(200,40,110,0.92)',80,EV.open4-n,t)}
  if(rn===3&&t>=EV.res4+0.8&&t<R[4]-0.2)card('(no real cats or ants were harmed 🐱🐜)',660,'rgba(15,10,30,0.78)',42,EV.res4+0.8,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.shot5)card('Nothing quantum left… 😌',660,'rgba(15,10,30,0.7)',56,R[4]+0.6,t);
  if(rn===4&&t>=EV.ph5a+0.3&&t<EV.hit5)card('1 photon of light 💡 (slow-mo)',660,'rgba(200,150,20,0.92)',52,EV.ph5a+0.3,t);
  if(rn===4&&t>=EV.res5+0.7)card('Real: to see anything, light must hit it 💡',660,'rgba(20,110,170,0.92)',42,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.6)card('1 photon ≈ '+QM_PJ,780,'rgba(15,10,30,0.8)',44,EV.res5+1.6,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('QUANTUM PHYSICS ⚛️',0,-110,fitSize('QUANTUM PHYSICS ⚛️',980,112),'#5AF0FF');txt('vs',0,-5,76,'#ffffff');txt('ONE DYING ANT 🐜',0,95,96,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  txt('Survived quantum physics ⚛️',0,-230,fitSize('Survived quantum physics ⚛️',960,76),'#FFD84A');txt('Lost to ONE photon 💡',0,-130,fitSize('Lost to ONE photon 💡',960,76),'#5AF0FF');
  txt('Who killed him?',0,10,84,'#ffffff');txt('YOU did. 👁️',0,115,fitSize('YOU did. 👁️',960,96),'#ff6a8a');txt('👇',0,280+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1140,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  // 3D-anchored glows / emoji
  ctx.save();ctx.globalCompositeOperation='screen';for(const q of QPTS){if(q.emo)continue;const s=project(LASTVP,q.p);if(s)glowAt(s,Math.min(700,q.r*1900/s[2]),q.c,q.a)}
  if(PHOT){const s=project(LASTVP,PHOT);if(s){glowAt(s,Math.min(400,0.35*1900/s[2]),'255,220,120',0.7)}}
  if(rn===0&&tt>=EV.wave1&&tt<EV.stop1w+0.4){const s=project(LASTVP,[0,0.5,0]);if(s)glowAt(s,Math.min(800,1.2*1900/s[2]),'90,240,255',0.3*ease((tt-EV.wave1)/0.4)*(1-ease((tt-EV.stop1w)/0.4)))}
  ctx.restore();
  for(const q of QPTS){if(!q.emo)continue;const s=project(LASTVP,q.p);if(s&&s[1]>860&&s[1]<1700){const sz=clamp(0.28*1900/s[2],40,90);txt(q.emo,s[0],s[1],sz,'#fff','center',900,false)}}
  // box label
  if(BOXP&&rn===3&&tt<EV.open4+0.1){const s=project(LASTVP,BOXP);if(s){ctx.save();ctx.translate(s[0],s[1]);const sc=clamp(1.6/s[2]*2.2,0.4,1.4);ctx.scale(sc,sc);ctx.rotate(-0.05);ctx.fillStyle='rgba(30,20,10,0.85)';ctx.font='900 64px Inter, "Noto Color Emoji"';const lbl=tt>=EV.drop4?'50% 💀 / 50% 😇':'⚠️ CAT BOX';const w=ctx.measureText(lbl).width;rrect(-w/2-24,-48,w+48,96,18);ctx.fill();txt(lbl,0,4,64,'#ffd84a','center',900,false);ctx.restore()}}
  // round darkening tints
  if(rn===4&&tt>=EV.shot5&&tt<EV.hit5+0.5){ctx.fillStyle=`rgba(10,10,40,${0.18*ease((tt-EV.shot5)/0.5)*(1-ease((tt-EV.hit5)/0.5))})`;ctx.fillRect(0,0,W,H)}
  // camera shutter (the viewer takes a photo)
  if(rn===4){const k=tt-EV.shot5;if(k>=0&&k<1.1){ctx.save();ctx.globalAlpha=clamp((1.1-k)/0.4,0,1);ctx.translate(W/2,900);const p=k<0.15?0.5+0.5*easeOut(k/0.15):1+0.08*(k-0.15);ctx.scale(p,p);txt('📸',0,0,240,'#fff','center',900,false);ctx.restore()}}
  if(rn===2){const k=tt-EV.look3;if(k>=0&&k<0.9){ctx.save();ctx.globalAlpha=clamp((0.9-k)/0.3,0,1);ctx.translate(W/2,900);const p=k<0.15?0.5+0.5*easeOut(k/0.15):1+0.1*(k-0.15);ctx.scale(p,p);txt('👁️',0,0,260,'#fff','center',900,false);ctx.restore()}}
  // final letterbox
  if(rn===4&&tt>=EV.ph5a&&tt<EV.res5+0.8){const k=ease((tt-EV.ph5a)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);for(const g of[0.7,1.35,2.0,2.55])flash(g,0.25,0.12,'90,240,255');
  flash(EV.wave1,0.5,0.3,'90,240,255');flash(EV.bonk1,0.35,0.2);flash(EV.ghost2,0.4,0.3,'90,240,255');flash(EV.split3,0.5,0.3,'90,240,255');flash(EV.coll3,0.7,0.4);flash(EV.drop4,0.3,0.2,'255,230,200');flash(EV.open4,0.4,0.3);
  flash(EV.shot5,0.95,0.6);flash(EV.hit5,0.5,0.3,'255,230,140');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
