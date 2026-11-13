// ---------- motion helpers ----------
const STOMPS=[];{const r=rngG(11);for(let i=0;i<13;i++){let x,z;do{x=(r()-0.5)*16;z=3+r()*15}while(Math.abs(x)<3.6&&z<6);STOMPS.push({t:EV.stompA+i*0.18,x,z,yaw:(r()-0.5)*0.5})}STOMPS.splice(5,0,{t:EV.stompA+0.85,x:3.5,z:-1.5,yaw:0.1})}
const CATS=[{t:28.4,p:[-40,0,140]},{t:28.9,p:[35,0,90]},{t:29.5,p:[-14,0,60]},{t:30.1,p:[55,0,200]},{t:30.7,p:[-60,0,110]},{t:31.3,p:[20,0,48]},{t:32.0,p:[-25,0,260]},{t:32.7,p:[42,0,150]},{t:33.4,p:[-8,0,100]}];
const EMPCATS=[{t:43.6,p:[-90,0,420]},{t:44.7,p:[80,0,500]},{t:45.9,p:[-40,0,620]},{t:47.1,p:[60,0,380]},{t:48.4,p:[-100,0,520]},{t:49.5,p:[30,0,650]}];
const FLY=2.0;
function legY(t,t0){const k=t-t0;if(k<-0.14)return null;if(k<0)return 42*Math.pow(-k/0.14,1.5);if(k<0.28)return 0;if(k<0.62)return 42*easeIn((k-0.28)/0.34);return null}
function hero1Z(t){if(t<R[0])return 400;return Math.max(26,240-68*(t-R[0]))}
function armyZ(t){return Math.max(70,520-150*(t-R[1]))}
function tstZ(t){const k=t-EV.tst0;if(k<3.6)return 420-105*k;return 42-30*(k-3.6)}
function underK(t){if(t<EV.tst0||t>=R[3])return 0;const zf=tstZ(t),zb=zf+80;return clamp((-6-zf)/8,0,1)*clamp((zb+6)/8,0,1)}
function caesarZ(t){return Math.max(42,300-110*(t-R[4]))}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff0d6'),sky:hx('#a8c8ea'),gnd:hx('#a09070'),fog:hx('#e6dcc8'),fogD:5000,zen:hx('#3f7fd6'),hor:hx('#f0dcc0'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#e6dcc8')},o||{})}
function envAt(t){let e=envBase();const rn=roundAt(t);
  if(rn===3){const k=clamp((t-28.2)/1.2,0,1)*clamp((R[4]-t)/0.8,0,1);e.fog=mix3(e.fog,hx('#c89070'),k*0.6);e.hor=mix3(e.hor,hx('#e8a070'),k*0.6);e.sky=mix3(e.sky,hx('#c0a090'),k*0.5);e.sunCol=mix3(e.sunCol,hx('#ffc890'),k*0.5)}
  if(rn===5){e.hor=mix3(e.hor,hx('#f0c090'),0.5);e.fog=mix3(e.fog,hx('#e0c8a8'),0.5)}
  const u=underK(t);if(u>0){e.sunCol=mix3(e.sunCol,[0.1,0.05,0.03],u);e.sky=mix3(e.sky,hx('#9a4a3a'),u);e.gnd=mix3(e.gnd,hx('#6a3424'),u);e.fog=mix3(e.fog,hx('#2a120e'),u);e.hor=mix3(e.hor,hx('#3a1a14'),u);e.zen=mix3(e.zen,hx('#1a0808'),u)}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.4-k*0.3,0.9,-3.3-k*0.3];at=[0,0.6+k*0.4,0.3]}
  if(rn===0){if(t<7.25||t>=9.7){eye=[1+sway*0.4,1.2,-7.5];at=[-2.7,6.5,20];if(t>=9.7){eye=[0.9+sway*0.4,1.3,-6.5];at=[-2.6,5.5,20]}}else{eye=[5,4.5,-14];at=[0,2.2,1]}}
  if(rn===1){if(t<EV.stompA-0.05){eye=[-1+sway*0.4,1.4,-8.5];at=[3.5,7,30]}else{eye=[2.4,1.9,-6.6];at=[-0.9,1.3,2.5];if(t>=EV.stompB){const k=ease((t-EV.stompB)/1.2);eye=[lerp(2.4,1.6,k),lerp(1.9,1.0,k),lerp(-6.6,-3.9,k)];at=[lerp(-0.9,0,k),lerp(1.3,0.75,k),lerp(2.5,0.4,k)]}}}
  if(rn===2){eye=[1.2+sway*0.4,1.3,-6.5];at=[-3.4,5,20];if(t>=23.2){const k=ease((t-23.2)/1.5);eye=[lerp(1.2,1.2,k),lerp(1.3,1.1,k),lerp(-6.5,-4.4,k)];at=[lerp(-3.4,-1.1,k),lerp(5,1.4,k),lerp(20,4,k)]}}
  if(rn===3){if(t<28.6){eye=[1+sway*0.4,1.1,-7];at=[-5.7,6,40]}else{eye=[1.8+sway*0.5,0.8,-4.6];at=[0,1.5,0.4]}}
  if(rn===4){if(t<37.2){eye=[1+sway*0.4,1.0,-7.5];at=[-5.3,9,40]}else if(t<EV.stab0||t>=41.6){eye=[1.5,0.6,-3];at=[0,70,42];if(t>=41.6){eye=[1.2,0.6,-3.2]}}else{eye=[2.4,1.5,-5.6];at=[0,1.6,0]}}
  if(rn===5){if(t<46.0){eye=[-1+sway*0.4,1.3,-8];at=[5,7,40]}else{eye=[1.6+sway*0.5,0.95,-4.1];at=[-0.8,1.1,2]}}
  if(rn===6){const k=ease((t-R[6])/2.5);eye=[lerp(1.7,1.2,k),0.95,lerp(-3.8,-2.9,k)];at=[0,0.55,0.2];if(t>=EV.drop0-0.4){const kk=ease((t-EV.drop0+0.4)/0.8);eye=[lerp(1.2,1.6,kk),lerp(0.95,0.6,kk),lerp(-2.9,-3.3,kk)];at=[0,lerp(0.55,1.6,kk)-ease((t-EV.splash+0.6)/0.6)*1.1,0]}}
  if(t>=R[7])eye=[1.4,1.0,-3.2],at=[0,0.4,0];
  return{eye,at}}
// ---------- background ----------
function bgItems(t){const items=[{mesh:BGG}];const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];items.push({mesh:COLOS,M:M4.trs(P(900,-330),0.3,0,0,1.25)});return{items}}
// ---------- explosions ----------
function impact(items,p,k,s){if(k<0)return;
  if(k<1.0){const r=s*(0.4+0.9*easeOut(k/0.25));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.4,0.1],clamp(k/0.8,0,1)),tintAmt:1,alpha:clamp(1-k,0,1),add:1,noShadow:true})}
  if(k<4.5){const rr=s*(0.6+2.0*easeOut(k/1.2));items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[rr,s*0.4*(1+k*0.3),rr]),alpha:clamp(1-(k-2)/2.5,0,1)});
    for(let i=0;i<4;i++){const a=i*1.3;const q=[p[0]+Math.cos(a)*s*0.5,p[1]+s*(0.8+k*1.6)+i*s*0.4,p[2]+Math.sin(a)*s*0.5];items.push({mesh:USPH,M:M4.trs(q,0,0,0,s*(0.4+k*0.25)),tint:[0.36,0.33,0.31],tintAmt:1,alpha:clamp(0.8-k/4.5,0,1),noShadow:true})}}
  if(k<7)items.push({mesh:AST,M:M4.trs([p[0],s*0.35,p[2]],1,0.5,0,s*0.55),tint:[1,0.45,0.15],tintAmt:clamp(0.6-k*0.1,0,0.6)})}
function boulder(items,c,t,s){const k=(t-(c.t-FLY))/FLY;if(k<0||k>=1)return;const st=[c.p[0]*0.35,30,1700];const cur=[lerp(st[0],c.p[0],k),lerp(st[1],s,k)+520*4*k*(1-k),lerp(st[2],c.p[2],k)];
  items.push({mesh:AST,M:M4.trs(cur,t*3,t*2,0,s),tint:[0.6,0.3,0.15],tintAmt:0.3});items.push({mesh:UEMIS,M:M4.trs(cur,0,0,0,s*1.3),tint:[1,0.55,0.15],tintAmt:1,alpha:0.55,add:1,noShadow:true});
  for(let i=1;i<10;i++){const kk=Math.max(0,k-i*0.022);const q=[lerp(st[0],c.p[0],kk),lerp(st[1],s,kk)+520*4*kk*(1-kk),lerp(st[2],c.p[2],kk)];items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,s*(1.2-i*0.08)),tint:mix3([1,0.8,0.3],[0.5,0.2,0.1],i/10),tintAmt:1,alpha:0.45*(1-i/10),add:1,noShadow:true})}}
// ---------- foreground ----------
let LASTVP=null;
function fgItems(t){const rn=roundAt(t);const items=[];const L=TILE;let pose='walk',walk=1,o={t};
  // ant state
  if(rn===0&&t>=EV.stomp1&&t<EV.pop1){pose='squash';walk=0;o.xeyes=true}
  if(rn===0&&t>=EV.pop1&&t<10.6){o.dizzy=true;o.lid=0;walk=t<9.7?0:1}
  if(rn===1&&t>=EV.stompA&&t<EV.stompB){o.flail=1;o.lid=0}
  if(rn===1&&t>=EV.stompB+0.1){pose='dust';walk=0}
  if(rn===2&&t>=23.5){pose='sit';walk=0}
  if(rn===3&&t>=EV.umb){pose='umb'}
  if(rn===4&&t>=39.1&&t<41.7){pose='parry';walk=0;o.lid=t<EV.clang?0.1:0.5}
  if(rn===5&&t>=44.2){o.glasses=easeOut((t-44.2)/0.5)}
  if(rn===6&&t>=EV.splash){pose='squash';walk=0;o.xeyes=true}
  if(t>=R[7]&&t<EV.loop){pose='squash';walk=0;o.xeyes=true}
  if(rn===6&&t<EV.drop0-0.8){o.lid=0.62}
  if(rn===6&&t>=EV.drop0-0.8&&t<EV.splash){o.lid=0.0;walk=t<EV.drop0?1:0.0}
  const dist=1.1*t;const o_=((dist%L.T)+L.T)%L.T;for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  const slow=rn===6&&t>=EV.drop0&&t<EV.splash+1.5;o.ph=t*(slow?1.2:5.2);o.walk=walk;o.pose=pose;
  const coughs=[2.0,10.2,EV.stompB+0.6,EV.clang+1.0];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;if(pose==='dust'&&t<EV.stompB+0.3)o.cough=-1;
  let Rm=M4.id();
  if(pose==='squash'){const t0=rn===0?EV.stomp1:EV.splash;const k=clamp((t-t0)/0.1,0,1);Rm=M4.trs([0,0,0],0,0,0,[lerp(1,1.35,k),lerp(1,0.24,k),lerp(1,1.15,k)])}
  if(rn===0&&t>=EV.pop1&&t<EV.pop1+0.7){const k=(t-EV.pop1)/0.7;const sy=1+0.45*Math.sin(k*Math.PI*2.5)*(1-k);Rm=M4.trs([0,Math.max(0,Math.sin(Math.min(1,k*1.6)*Math.PI))*0.9,0],0,0,0,[1/Math.sqrt(sy),sy,1/Math.sqrt(sy)])}
  items.push(...antItems(Rm,o));
  // ---- R1 soldier + stomp
  if(rn===0||(t>=R[0]-0.01&&t<R[1])){const z=hero1Z(t);const hide=t>=7.25&&t<9.7;if(!hide&&t>=R[0]){const moving=z>26.01;items.push(...romanItems([1.5,0,z],(240-z)/(S*0.3),{amp:moving?1:0,spear:true,armR:-0.5,elR:-1.1,head:t>=9.7?0.45:0}))}
    const y=legY(t,EV.stomp1);if(y!=null&&t<9.7)stompLeg(items,[0.2,y,-0.5],0);if(t>=EV.stomp1&&t<EV.stomp1+1.6){const k=t-EV.stomp1;if(k>0.15)items.push({mesh:DUSTRING,M:M4.trs([0.2,0,2.2],0,0,0,[4+6*easeOut(k/0.5),0.5+k*0.3,5+6*easeOut(k/0.5)]),alpha:clamp(1-k/1.6,0,1)*0.8})}}
  // title/R1: army far behind
  if(t<R[0]){items.push({mesh:ARMY[Math.floor(t*2.2)%2],M:M4.trs([0,0,900-12*t],0,0,0,1)})}
  // ---- R2 army + stomps
  if(rn===1){if(t<EV.stompA-0.05){const z=armyZ(t);items.push({mesh:ARMY[Math.floor(t*3.2)%2],M:M4.trs([0,0,z],0,0,0,1)})}
    else for(const s of STOMPS){const y=legY(t,s.t);if(y!=null)stompLeg(items,[s.x,y,s.z],s.yaw);const k=t-s.t;if(k>=0&&k<1.2)items.push({mesh:DUSTRING,M:M4.trs([s.x,0,s.z-2],0,0,0,[5+6*easeOut(k/0.4),0.6+k*0.4,6+6*easeOut(k/0.4)]),alpha:clamp(1-k/1.2,0,1)*0.8})}}
  // ---- R3 testudo
  if(rn===2){const zf=tstZ(t);const st=Math.floor(t*(zf>42?3.4:2.4))%2;items.push({mesh:TST,M:M4.trs([0,Math.abs(Math.sin(t*7))*0.6,zf],0,0,0,1)});items.push({mesh:TSTL[st],M:M4.trs([0,0,zf],0,0,0,1)})}
  // ---- R4 catapults
  if(rn===3){for(const c of CATS){boulder(items,c,t,8);impact(items,c.p,t-c.t,7)}
    if(t>=29.1){for(let i=0;i<16;i++){const t0=29.1+hsh(i,11)*3.6;const k=t-t0;if(k<0||k>2)continue;const onLeaf=i%3===0;const x0=onLeaf?(hsh(i,1)-0.5)*1.2:(hsh(i,1)-0.5)*30,z0=onLeaf?-0.2:(hsh(i,2)-0.4)*25;const yHit=onLeaf?2.0:0.2;const tf=0.5;let y,x=x0;if(k<tf){y=yHit+30*(1-k/tf)*(1-k/tf)+(1-k/tf)*8}else{const kb=k-tf;y=yHit+kb*(6-kb*14);x=x0+(onLeaf?(i%2?1:-1)*kb*5:0);if(y<0.2)y=0.2}
      items.push({mesh:ROCK[i%4],M:M4.trs([x,y,z0],k*4,k*3,0,onLeaf?0.22:0.3+hsh(i,5)*0.5),tint:[1,0.5,0.2],tintAmt:k<tf?0.6:0.15})}}}
  // ---- R5 caesar
  if(rn===4){const z=caesarZ(t);const stab=t>=EV.stab0&&t<41.6;
    if(!stab){const moving=z>42.01;const o2={caesar:true,amp:moving?1:0};if(t>=EV.thumb&&t<41.6){const k=ease((t-EV.thumb)/0.5);o2.armR=lerp(0,-0.85,k);o2.elR=lerp(-0.35,-0.1,k);o2.outR=lerp(0.1,0.7,k);o2.thumb=k>0.5;o2.head=-0.25*k}
      if(t>=41.6){const k=ease((t-41.6)/0.3);o2.lean=-0.12*k;o2.armR=-2.2*k;o2.armL=-2.2*k;o2.outR=0.5;o2.outL=0.5;o2.elR=-0.6;o2.elL=-0.6;o2.shock=true;o2.head=-0.2}
      items.push(...romanItems([0,0,z],(300-z)/(S*0.3),o2))}
    if(stab){let y;const k=t-EV.stab0;const hitK=EV.clang-EV.stab0;if(k<hitK-0.15)y=40+Math.sin(k*3)*2-k*4;else if(k<hitK)y=lerp(38,1.55,easeIn((k-hitK+0.15)/0.15));else{const kk=t-EV.clang;y=1.55+kk*(26-kk*14);if(kk>0.9)y=1.55+0.9*(26-0.9*14)+((kk-0.9)*30)}
      const wob=t>=EV.clang?Math.sin((t-EV.clang)*40)*0.15*Math.exp(-(t-EV.clang)*3):0;swordItems(items,[0.08+(t>=EV.clang?(t-EV.clang)*3:0),y,-0.56],0.12+wob)}}
  // ---- R6 empire
  if(rn===5){const off=-(t-R[5])*55;const st=Math.floor(t*3.2)%2;for(let n=-1;n<4;n++){const z0=((off%240)+240)%240+n*240-120;items.push({mesh:EMPA[st],M:M4.trs([0,0,z0],0,0,0,1)})}
    for(const c of EMPCATS){boulder(items,c,t,9);impact(items,c.p,t-c.t,9)}}
  // ---- final grape
  if(rn===6&&t>=EV.drop0-0.3&&t<EV.splash){const k=(t-EV.drop0+0.3)/(EV.splash-EV.drop0+0.3);const y=0.95+7*Math.pow(1-k,1.15);items.push({mesh:GRAPE,M:M4.trs([0,y,-0.08],k*2,0.3,0.2,0.85)});items.push({mesh:UEMIS,M:M4.trs([-0.3,y+0.45,-0.7],0,0,0,0.1),tint:[1,1,1],tintAmt:1,alpha:0.7,add:1,noShadow:true})}
  if((rn===6&&t>=EV.splash)||(t>=R[7]&&t<EV.loop)){const k=t-EV.splash;items.push({mesh:GRAPE,M:M4.trs([0,0.42,-0.08],0.7,0.3,0.2,[0.95,0.5,0.95])});items.push({mesh:DISC2,M:M4.trs([0,0.04,0],0,0,0,[lerp(0.6,2.0,easeOut(k/0.3)),1,lerp(0.6,1.8,easeOut(k/0.3))]),tint:hx('#7a2a8a'),tintAmt:1,alpha:0.75,noShadow:true});
    if(k<1.2)for(let i=0;i<14;i++){const a=i/14*TAU2;const sp=2.0+hsh(i,3)*1.5;const p=[Math.cos(a)*sp*k,0.3+k*(5-k*9)*0.6*(0.8+hsh(i,4)*0.6),Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.07+hsh(i,5)*0.05),tint:hx('#8a3a9a'),tintAmt:1})}
    if(k<1.5){const kk=k;items.push({mesh:UCYL,M:M4.mul(M4.trs([1.2+kk*4,0.1+kk*(4-kk*5.5),-0.4],0,0,kk*12,1),segM([0,-0.25,0],[0,0.25,0],0.028)),tint:AC.wood,tintAmt:1})}}
  return items}
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:underK(tt)>0?300:1100});
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S_(EV.stomp1,30,1.0);for(const s of STOMPS)S_(s.t,9,0.4);
  if(t>=EV.tst0&&t<R[3]){const zf=tstZ(t);if(zf<160&&zf>-90)a+=3.5}for(const c of CATS)S_(c.t,16,1.0);S_(EV.clang,14,0.6);if(t>=R[5]&&t<R[6])a+=1.5;for(const c of EMPCATS)S_(c.t,7,0.8);S_(EV.splash,20,0.5);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[7])return;const ts=R[rn];const k=t-ts;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=rn===6&&t<EV.drop0;
  if(!hideLab){const kk=rn===6?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===6?104:120,rn===6?'#c88aff':'#ffd84a');ctx.restore();
    if(t<t2)pill(cap1,385,rn===6?'rgba(110,40,140,0.85)':'rgba(15,10,30,0.66)',60,Math.min(1,kk/0.12));else pill(cap2,385,rn===6?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[6]+0.3&&t<EV.drop0-0.6)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[6]-0.3)/0.15));if(t>=EV.drop0-0.6)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.splash;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle='#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,430);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('PART 2',0,-250,56,'#ffffff');txt('ROMAN LEGION ⚔️',0,-150,fitSize('ROMAN LEGION ⚔️',980,104),'#ffd84a');txt('vs',0,-40,80,'#ffffff');txt('ONE DYING ANT 🐜',0,70,100,'#ff6a5a');ctx.restore();
  if(t>1.0){ctx.save();ctx.globalAlpha=a*clamp((t-1.0)/0.3,0,1);pill('Who wins? 🤔',730,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[7];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.68*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should fight',0,-110,88,'#ffffff');txt('him NEXT? 🐜',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('Part 3: TON 618? 🕳️',W/2,1080,56,'#ffffff','center',800);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;
  // stomp dust tint
  {const k=tt-EV.stomp1;if(k>=0&&k<1.2){ctx.fillStyle=`rgba(170,140,105,${0.22*(1-k/1.2)})`;ctx.fillRect(0,0,W,H)}}
  // catapult fire streaks
  if(tt>=28.2&&tt<R[4]){const r=rngG(3);const a=clamp((tt-28.2)/0.6,0,1)*clamp((R[4]-tt)/1.2,0,1);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<14;i++){const sp=700+r()*500;const x0=r()*W*1.3,ph=r()*3;const y=((tt*sp+ph*700)%(H*0.6));const x=x0-y*0.3;ctx.strokeStyle=`rgba(255,${140+r()*80|0},60,${0.45*a})`;ctx.lineWidth=4+r()*4;ctx.beginPath();ctx.moveTo(x,y-110);ctx.lineTo(x-33,y);ctx.stroke()}ctx.restore()}
  // clang spark
  {const k=tt-EV.clang;if(k>=0&&k<0.5&&LASTVP){const p=project(LASTVP,[0.06,1.55,-0.56]);if(p){ctx.save();ctx.globalCompositeOperation='screen';const r=rngG(5);for(let i=0;i<22;i++){const a=r()*TAU2,l=(80+r()*260)*easeOut(k/0.25),l0=l*0.3;ctx.strokeStyle=`rgba(255,${200+r()*55|0},120,${1-k/0.5})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*l0,p[1]+Math.sin(a)*l0);ctx.lineTo(p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l);ctx.stroke()}
    const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],260);g.addColorStop(0,`rgba(255,250,220,${0.9*(1-k/0.5)})`);g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}}}
  if(tt>=EV.thumb+0.3&&tt<EV.stab0){const k=tt-EV.thumb-0.3;const sc=k<0.25?0.5+0.5*easeOut(k/0.25)+Math.sin(k/0.25*Math.PI)*0.2:1;ctx.save();ctx.translate(780,760+Math.sin(k*6)*14);ctx.scale(sc,sc);ctx.font='200px "Noto Color Emoji"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('👎',0,0);ctx.restore()}
  // slow-mo letterbox
  if(tt>=EV.drop0-0.6&&tt<EV.splash+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.splash-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k);ctx.fillStyle=`rgba(120,60,160,${0.08*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<7;i++)flash(R[i],0.35,0.15);flash(EV.stomp1,0.3,0.15);for(const c of CATS)flash(c.t,0.35,0.3,'255,200,140');flash(EV.clang,0.6,0.25);flash(EV.splash,0.45,0.2,'230,200,255');
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
