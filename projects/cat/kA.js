// ================= animation =================
const env01=(t,a,b,fi,fo)=>clamp(Math.min((t-a)/fi,(b-t)/fo),0,1);
const FR0=[-0.065,0,0.19];
function catAt(t){const rn=roundAt(t);
  const c={pos:[0,0,0],yaw:0,sit:1,t,eyes:{lid:0.35,look:[0,0.1]},tail:{up:-0.12,curl:0.25,side:0.9,wag:0.12,ph:t*0.4},headY:0.08*Math.sin(t*0.6),headP:0,mouth:0,ears:0};
  const lick=(t0,t1)=>{if(t<t0||t>=t1)return;const k=env01(t,t0,t1,0.35,0.35);c.paws={FR:lerp3(FR0,[-0.025,0.37,0.29],k)};c.headP=0.32*k;c.headR=-0.22*k;c.headY=0;
    c.eyes={lid:lerp(0.35,1,k),happy:1};if(k>0.9&&Math.sin(t*10)>0)c.tongue=1;if(k>0.9)c.paws.FR=V.add(c.paws.FR,[0,0.012*Math.sin(t*10),0])};
  if(rn<0){c.eyes.lid=0.3+0.7*clamp(1-Math.abs(t-1.6)/0.12,0,1);c.tail.wag=0.25}
  if(rn===0){c.eyes={lid:0.45,look:[0,0.05]};if(t>=EV.blink&&t<EV.blink+0.45)c.eyes.lid=lerp(0.45,1,Math.sin(Math.PI*(t-EV.blink)/0.45));
    if(t>=6.3)c.eyes={lid:0.3,brow:0.28,look:[0,0]};
    if(t>=EV.stand){c.sit=1-ease((t-EV.stand)/0.4);c.tail={up:0.7,curl:0.7,wag:0.25,ph:t*0.8}}
    if(t>=EV.raise&&t<EV.swat+0.7){let p;if(t<EV.swat)p=lerp3(FR0,[-0.1,0.2,0.27],ease((t-EV.raise)/0.4));else if(t<EV.swat+0.13)p=lerp3([-0.1,0.2,0.27],[0.12,0.13,0.33],easeOut((t-EV.swat)/0.13));else p=lerp3([0.12,0.13,0.33],FR0,ease((t-EV.swat-0.13)/0.5));c.paws={FR:p};
      if(t>=EV.swat&&t<EV.swat+0.4)c.headY=0.25*Math.sin(Math.PI*(t-EV.swat)/0.4)}
    if(t>=EV.swat+0.7){c.eyes={lid:0.4,look:[0,0.35]}}
    if(t>=11.0){c.sit=ease((t-11.0)/0.3);c.tail={up:-0.12,curl:0.25,side:0.9,wag:0.12,ph:t*0.4}}lick(EV.lick0,16.6)}
  if(rn===1){c.eyes={lid:0.4,look:[0,0]};
    if(t>=EV.suck0&&t<EV.vjump){const k=t-EV.suck0;c.sit=1-ease(k/0.25);c.crouch=0.8;c.ears=0.8;c.eyes={lid:0.18,brow:0.4};c.pos=[0.01*Math.sin(t*40),0,0.25*ease(k/1.9)];c.tail={up:1.1,curl:0.9,wag:0.4,ph:t*3};c.headP=-0.05}
    if(t>=EV.vjump-0.12&&t<EV.ride){const s=hopK(t,EV.vjump,EV.vland-EV.vjump,[0,0,0.25],[0,0.345,1.85],0.55);c.pos=s.p;c.sit=0;c.crouch=s.sq>0?s.sq*3:0;c.ears=0.2;c.eyes={lid:0.25,brow:0.2};c.tail={up:0.8,curl:0.6};
      if(t>=EV.boop-0.3&&t<EV.boop+0.6){let p;const k=t-EV.boop;if(k<0)p=lerp3(FR0,[-0.03,0.14,0.29],ease((k+0.3)/0.25));else if(k<0.12)p=lerp3([-0.03,0.14,0.29],[-0.03,0.035,0.34],easeOut(k/0.12));else p=lerp3([-0.03,0.035,0.34],FR0,ease((k-0.12)/0.45));c.paws={FR:p};c.headP=0.3;c.eyes={lid:0.35,look:[0,-0.6]}}}
    if(t>=EV.ride){const v=vacAt(t);c.pos=tp(M4.trs(v.pos,v.yaw,0,0,1),[0,0.345,-0.05]);c.yaw=v.yaw;c.sit=1;c.eyes={lid:0.5,look:[0.2,0]};c.headY=0.25*Math.sin(t*0.9);c.tail={up:0.3,curl:0.5,wag:0.4,ph:t*0.6}}}
  if(rn===2){c.eyes={lid:0.4,look:[0,0.3]};if(t>=R[2]+1.0){c.headP=-0.35*ease((t-R[2]-1)/0.5);c.eyes={lid:0.45,look:[0,0.9]}}
    if(t>=EV.lift0&&t<EV.inside){const k=(t-EV.lift0)/(EV.inside-EV.lift0);c.pos=[0,6.2*ease(k),0];c.sit=0.3;c.dangle=1;c.yaw=(t-EV.lift0)*0.9;c.headP=0;c.eyes={lid:0.55,look:[0,-0.2]};c.tail={up:-1.2,curl:-0.2};
      if(t>EV.inside-0.18)c.sc=clamp((EV.inside-t)/0.18,0.02,1)}
    if(t>=EV.inside&&t<EV.drop)c.hidden=1;
    if(t>=EV.drop&&t<EV.dland){const k=(t-EV.drop)/(EV.dland-EV.drop);c.pos=[0,6.2*(1-k*k)+0.3,0];c.piv=0.3;c.rz=Math.PI*(1-ease(clamp(k/0.6,0,1)));c.sit=0;c.splay=k<0.5?1:0;c.eyes={lid:0,wide:1,look:[0,-0.5]};c.ears=0.6;c.tail={up:0.9,curl:-0.6,wag:1,ph:t*3}}
    if(t>=EV.dland){const k=t-EV.dland;c.sit=ease((k-0.5)/0.4);c.crouch=0.9*Math.exp(-k*6);c.eyes={lid:0.45,look:[0,0]};if(t>=EV.ufoCrash){c.headY=-0.45*env01(t,EV.ufoCrash,EV.ufoCrash+0.9,0.2,0.3);}lick(EV.ufoCrash+1.0,R[3]+0.2)}}
  if(rn===3){c.eyes={lid:0.45,look:[0,0.4]};
    if(t>=EV.roar1&&t<EV.roar1+1.1){c.ears=0.7;c.eyes={lid:0.65,look:[0,0.2]};c.headP=0.06}
    if(t>=EV.yawn&&t<EV.yawn+1.0){const k=(t-EV.yawn)/1.0;const m=Math.sin(Math.PI*k);c.mouth=m;c.eyes={lid:1};c.headP=-0.28*m;c.ears=0.3*m}
    if(t>=EV.roar2&&t<EV.hiss){c.ears=0.7;c.eyes={lid:0.6,look:[0,0.2]}}
    if(t>=EV.hiss&&t<EV.calm+0.5){const k=t-EV.hiss;const pop=easeOut(clamp(k/0.18,0,1));const off=t<EV.calm?1:1-ease((t-EV.calm)/0.5);c.sit=1-pop*off;c.arch=pop*off;c.puff=pop*off;c.ears=off;c.mouth=t<EV.flee+0.3?pop:0.15*off;c.eyes=off>0.5?{glow:1,brow:0.6}:{lid:0.4};
      c.tail={up:1.0,curl:0.15,wag:0.15,ph:t*4};c.pos=[0.006*Math.sin(t*60)*off,0,0]}
    lick(EV.calm+0.6,R[4]+0.2)}
  if(rn>=4){c.sit=0;c.crouch=0.35;c.headP=0.75+0.06*Math.sin(t*12);c.eyes={lid:1,happy:1};c.tail={up:0.5,curl:0.6,wag:0.3,ph:t*0.5};
    if(t>=EV.boss){c.headP=lerp(0.75,0.15,ease((t-EV.boss)/0.3));c.eyes={lid:0.35,look:[0,0]}}
    if(t>=EV.look){const k=ease((t-EV.look)/0.35);c.headY=2.2*k;c.yaw=0.7*k;c.headP=0.15;c.eyes={lid:0,tiny:t>EV.look+0.4?1:0,look:[0,0]};if(t>EV.look+0.4){c.ears=0.5;c.puff=0.4}}
    if(t>=EV.jump){const k=t-EV.jump;let y;if(t<EV.apex0)y=1.5*easeOut((t-EV.jump)/(EV.apex0-EV.jump));else if(t<EV.apex1)y=1.5+0.1*(t-EV.apex0);else{const q=(t-EV.apex1)/(EV.koland-EV.apex1);y=1.6*(1-q*q)}
      const kk=Math.min(1,(t-EV.jump)/0.35);c.pos=[0.2*kk,y+0.3,-0.05*kk];c.piv=0.3;c.yaw=lerp(0.7,Math.PI,easeOut(kk));c.headY=lerp(2.2,0,kk);c.headP=0;c.crouch=0;c.splay=1;c.puff=1;c.arch=0.6;c.ears=1;c.mouth=0.8;c.eyes={lid:0,tiny:1,wide:1};c.tail={up:1.1,curl:0.1};
      if(t>=EV.apex1){c.rz=Math.PI*ease((t-EV.apex1)/(EV.koland-EV.apex1))}}
    if(t>=EV.koland){const k=t-EV.koland;c.pos=[0.2,0.15+0.05*Math.exp(-k*7)*Math.abs(Math.cos(k*18)),-0.05];c.rz=Math.PI;c.yaw=Math.PI;c.piv=0.3;c.splay=1;c.puff=0.6*Math.exp(-k*0.6);c.arch=0;c.ears=0.6;c.mouth=0.3;c.tongue=1;c.eyes={x:1};c.tail={up:-0.4,curl:-0.2}}}
  return c}
function hopK(t,t0,d,a,b,h){if(t<t0)return{p:a.slice(),sq:0.12*clamp((t-t0+0.12)/0.12,0,1)};if(t<t0+d){const k=(t-t0)/d;const p=lerp3(a,b,k);p[1]+=4*h*k*(1-k);return{p,sq:0}}const k=t-t0-d;return{p:b.slice(),sq:0.3*Math.exp(-k*8)}}
// ---- dogs
const DOGS=[];for(let r=0;r<3;r++)for(let c=0;c<6;c++){const i=r*6+c;DOGS.push({i,x:(c-2.5)*0.72+(hsh(i,1)-0.5)*0.25,z0:31.2+r*1.15+hsh(i,3)*0.45,sc:0.85+hsh(i,4)*0.4,col:DOGCOL[i%4],h:hsh(i,5)})}
function dogsAt(t){if(t>=R[1])return[];const out=[];for(const d of DOGS){const z=d.z0-6.5*(t-R[0]);const tL=EV.swat+0.03+Math.max(0,z)/28;const st={pos:[d.x,0,z],yaw:Math.PI+(d.h-0.5)*0.2,sc:d.sc,col:d.col,t};
    if(t<tL){st.gait={ph:t*2.8+d.h,amp:0.34};st.mouth=0.35+0.45*Math.abs(Math.sin(t*7+d.i));st.eyes={lid:0.1,brow:0.45};st.tongue=d.i%3===0?1:0;st.tail={up:0.5,curl:0.3,wag:0.6,ph:t*3}}
    else{const k=t-tL;if(k>4)continue;const v=[d.x*1.1+(d.h-0.5)*2.5,6+d.h*4,7+d.h*5];st.pos=[d.x+v[0]*k,0.35*d.sc+v[1]*k-1.5*k*k,z+v[2]*k];st.piv=0.35;st.rx=k*(5+d.h*4);st.rz=k*(2+d.h*3)*(d.i%2?1:-1);st.mouth=0.8;st.eyes={lid:0,tiny:1};st.splay=1;st.tail={up:1,curl:0.2}}
    out.push(st)}return out}
// ---- vacuum
function vacAt(t){if(t<R[1]||t>=R[2])return null;const v={pos:[0,0,2.2],yaw:Math.PI,led:0,happy:0};
  if(t<EV.vstop){const k=(t-R[1])/(EV.vstop-R[1]);v.pos=[0,0,lerp(14,2.2,1-Math.pow(1-k,2))]}
  if(t>=EV.boop){v.led=1;v.happy=1}
  if(t>=EV.ride&&t<24.2)v.yaw=Math.PI+3*Math.PI*ease((t-EV.ride)/0.8);
  if(t>=24.2){const a=(t-24.2)*0.85;v.pos=[2.2-2.2*Math.cos(a),0,2.2+2.2*Math.sin(a)];v.yaw=a}
  return v}
function vacItems(items,t){const v=vacAt(t);if(!v)return;const M=M4.trs(v.pos,v.yaw,0,0,1);items.push({mesh:VAC,M});
  const ledC=v.led?(t<EV.boop+0.5?hsv((t*3)%1,0.8,1):[0.25,1,0.45]):[1,0.2,0.15];items.push({mesh:VLED,M,tint:ledC,tintAmt:1,noShadow:true});
  for(const sx of[-1,1])items.push({mesh:BRUSH,M:M4.mul(M,M4.trs([sx*0.85,0,0.95],t*14*sx,0,0,1)),noShadow:true});
  const ec=v.happy?[0.3,1,0.5]:[1,0.18,0.12];for(const sx of[-1,1]){if(v.happy){for(const d of[-1,1])items.push({mesh:UEMIS,M:M4.mul(M,M4.trs([sx*0.17+d*0.035,0.305+(d<0?0:0)+0.012,1.235],0,0,d*0.6,[0.045,0.012,0.012])),tint:ec,tintAmt:1,noShadow:true})}
    else items.push({mesh:UEMIS,M:M4.mul(M,M4.trs([sx*0.17,0.3,1.235],0,0,-sx*0.35,[0.07,0.025,0.012])),tint:ec,tintAmt:1,noShadow:true})}
  if(t>=EV.suck0&&t<EV.vjump+0.3){const a=env01(t,EV.suck0,EV.vjump+0.3,0.3,0.3);for(let i=0;i<46;i++){const k=(t*1.4+hsh(i,1))%1;const s=[(hsh(i,2)-0.5)*1.8,0.02+hsh(i,3)*0.5,-0.7+hsh(i,4)*1.2];const e=[0,0.08,0.92];const p=lerp3(s,e,k*k);
      items.push({mesh:i%3?PETAL:UB,M:M4.trs(p,t*5+i,t*7+i,0,i%3?0.03:0.012),tint:i%3?null:[0.55,0.5,0.4],tintAmt:i%3?0:1,alpha:a*Math.min(1,(1-k)*4),noShadow:true})}}
  {const k=t-EV.boop;if(k>=0&&k<0.6){const c=tp(M,[0,0.38,0]);for(let j=0;j<14;j++){const a=j/14*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(c,[Math.cos(a)*k*1.2,k*1.5-k*k*2,Math.sin(a)*k*1.2]),0,0,0,0.018*(1-k/0.6)),tint:[0.6,0.9,1],tintAmt:1,alpha:1,add:1,noShadow:true})}}}}
function hsv(h,s,v){const f=n=>{const k=(n+h*6)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1))};return[f(5),f(3),f(1)]}
// ---- ufo
const UFO_END=[-45,0,90];
function ufoAt(t){if(t<R[2]||t>=EV.ufoCrash)return null;const u={pos:[0,7+0.15*Math.sin(t*2),0.3],rx:0,rz:0.05*Math.sin(t*1.3),chaos:0};
  if(t<EV.ufoHover){const k=(t-R[2])/(EV.ufoHover-R[2]);u.pos=lerp3([3,30,30],[0,7,0.3],1-Math.pow(1-k,2.5));u.rz=-0.2*(1-k)}
  if(t>=EV.chaos0&&t<EV.drop+0.2){u.chaos=1;u.pos=V.add(u.pos,[0.25*Math.sin(t*37),0.2*Math.sin(t*29),0.2*Math.sin(t*41)]);u.rx=0.15*Math.sin(t*23);u.rz=0.18*Math.sin(t*31)}
  if(t>=EV.ufoAway){const k=(t-EV.ufoAway)/(EV.ufoCrash-EV.ufoAway);u.pos=V.add(lerp3([0,7,0.3],UFO_END,Math.pow(k,1.5)),[3*Math.sin(t*5)*(1-k),4*Math.sin(Math.PI*k),0]);u.rx=0.45*Math.sin(t*8);u.rz=0.6*Math.sin(t*6.5);u.chaos=0.6}
  return u}
function ufoItems(items,t){const u=ufoAt(t);if(!u)return;const M=M4.trs(u.pos,t*0.6,u.rx,u.rz,1);items.push({mesh:UFO,M,tint:null,tintAmt:0});
  items.push({mesh:DOME,M:M4.mul(M,M4.trs([0,0.55,0],0,0,0,[1.25,0.9,1.25])),tint:[0.6,0.95,1],tintAmt:1,alpha:0.55,noShadow:true});
  for(let i=0;i<14;i++){const a=i/14*TAU2;let c=hsv(((i/14)+t*0.5)%1,0.7,1);if(u.chaos&&Math.sin(t*30+i)>0)c=[1,0.15,0.1];items.push({mesh:UEMIS,M:M4.mul(M,M4.trs([Math.cos(a)*3.48,0.05,Math.sin(a)*3.48],0,0,0,0.13)),tint:c,tintAmt:1,noShadow:true})}
  if(t>=EV.beam0&&t<EV.inside+0.15){const a=env01(t,EV.beam0,EV.inside+0.15,0.25,0.15)*(0.85+0.15*Math.sin(t*25));const b=[u.pos[0],u.pos[1]-0.6,u.pos[2]];
    items.push({mesh:TRACT,M:segM([b[0],0,b[2]],b,1.25),tint:[0.45,1,0.8],tintAmt:1,alpha:0.2*a,add:1,noShadow:true});items.push({mesh:TRACT,M:segM([b[0],0,b[2]],b,0.7),tint:[0.7,1,0.9],tintAmt:1,alpha:0.2*a,add:1,noShadow:true});
    for(let j=0;j<30;j++){const k=(t*0.35+hsh(j,1))%1;const ang=j*2.4+t;const r=0.2+hsh(j,2)*0.9*(1-k*0.6);items.push({mesh:UEMIS,M:M4.trs([b[0]+Math.cos(ang)*r,k*b[1],b[2]+Math.sin(ang)*r],0,0,0,0.03),tint:[0.7,1,0.85],tintAmt:1,alpha:a*0.9,add:1,noShadow:true})}
    items.push({mesh:DISC2,M:M4.trs([b[0],0.02,b[2]],0,0,0,1.3),tint:[0.5,1,0.8],tintAmt:1,alpha:0.35*a,add:1,noShadow:true})}
  if(t>=EV.ufoAway){for(let j=0;j<18;j++){const tj=t-j*0.06;if(tj<EV.ufoAway)break;const q=ufoAt(tj);if(!q)break;items.push({mesh:PUFF,M:M4.trs(V.add(q.pos,[0,0.3,0]),j,0,0,0.6+j*0.12),tint:[0.25,0.24,0.26],tintAmt:0.8,alpha:0.6*(1-j/18),noShadow:true})}}}
// ---- bear
const BSC=3.2;
function bearAt(t){if(t<R[3]||t>=R[4])return null;const b={pos:[0,0,2.6],yaw:Math.PI,sc:BSC,t,eyes:{lid:0.15,brow:0.5},headP:0.05,mouth:0,tail:{up:0.2}};
  if(t<EV.bstop){const k=(t-R[3])/(EV.bstop-R[3]);const z=lerp(16,2.6,1-Math.pow(1-k,1.6));b.pos=[0,0,z];b.gait={ph:(16-z)/0.75,amp:0.22*(1-k*0.6)}}
  if(t>=EV.roar1&&t<EV.roar1+1.1){const m=env01(t,EV.roar1,EV.roar1+1.1,0.15,0.3);b.mouth=m;b.headP=0.05+0.3*m;b.headY=0.06*Math.sin(t*30)*m;b.crouch=0.25*m;b.eyes={lid:0.1,brow:0.6}}
  if(t>=EV.yawn&&t<EV.roar2){b.headR=0.3*env01(t,EV.yawn,EV.roar2,0.3,0.3);b.eyes={lid:0,brow:-0.2}}
  if(t>=EV.roar2&&t<EV.hiss){const m=env01(t,EV.roar2,EV.hiss,0.12,0.2);b.mouth=m;b.headP=0.05+0.38*m;b.headY=0.08*Math.sin(t*34)*m;b.crouch=0.35*m;b.eyes={lid:0.05,brow:0.75}}
  if(t>=EV.hiss){const k=t-EV.hiss;b.eyes={lid:0,tiny:1,brow:-0.5};b.mouth=0.35;b.pos=[0,0.25*Math.sin(Math.PI*clamp(k/0.35,0,1)),2.6+0.5*easeOut(clamp(k/0.35,0,1))];b.headP=-0.15}
  if(t>=EV.flee){const k=t-EV.flee;b.yaw=Math.PI-Math.PI*ease(clamp(k/0.4,0,1));if(k>0.35){const q=k-0.35;b.pos=[0.3*Math.sin(q*3),0,3.1+3*q*q+2*q];b.gait={ph:t*2.4,amp:0.3}}b.mouth=0.5}
  return b}
function cukeItems(items,t){if(t<R[4])return;let x=0;if(t<EV.cuke)x=1.6;else x=lerp(1.4,0,easeOut(clamp((t-EV.cuke)/0.55,0,1)));if(x>1.5)return;items.push({mesh:CUKE,M:M4.trs([x,0.05,-0.5],0.12,0,0,1)});
  if(t<EV.jump)items.push({mesh:BOWL,M:M4.trs([0,0,0.33],0,0,0,1)});else items.push({mesh:BOWL,M:M4.trs([0,0,0.33],0,0,0,1)})}
// ---- effects
function ring(items,p,k,d,rmax,col,a0,add){if(k<0||k>d)return;const r=0.2+rmax*easeOut(k/d);items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[r,0.25+r*0.03,r]),tint:col||null,tintAmt:col?1:0,alpha:(a0||0.6)*(1-k/d),add:add?1:0,noShadow:true})}
function effects(items,t){const rn=roundAt(t);
  if(rn===0){ring(items,[0,0.2,0.3],t-EV.swat,0.7,16,[1,1,1],0.7,1);ring(items,[0,0.02,0.3],t-EV.swat,0.9,9,null,0.6)}
  if(rn===1){ring(items,[0,0.36,1.85],t-EV.vland,0.5,0.8,null,0.5)}
  if(rn===2){ring(items,[0,0.02,0],t-EV.dland,0.6,1.4,null,0.35);if(t>=EV.ufoCrash-0.05)fireball(items,UFO_END,t-EV.ufoCrash,6)}
  if(rn===3){ring(items,[0,0.25,0.2],t-EV.hiss,0.7,9,[0.8,0.4,1],0.7,1);const b=bearAt(t);if(b&&t<EV.bstop)for(let s=0;s<6;s++){}
    if(t>=EV.roar1&&t<EV.roar1+1.1||t>=EV.roar2&&t<EV.hiss){for(let i=0;i<26;i++){const k=(t*1.8+hsh(i,1))%1;const p=[(hsh(i,2)-0.5)*0.9,0.2+hsh(i,3)*0.6,1.3-k*2.2];items.push({mesh:PUFF,M:M4.trs(p,i,0,0,0.025+k*0.035),tint:[1,1,1],tintAmt:0.6,alpha:0.2*Math.sin(Math.PI*k),noShadow:true})}}}
  if(rn>=4){ring(items,[0.2,0.02,-0.05],t-EV.koland,0.5,0.9,null,0.6);ring(items,[0,0.02,0],t-EV.jump,0.5,0.8,null,0.5)}}
// ---- scene
let LASTVP=null,CAT=null,CATR=null,BEAR=null,BEARR=null,DOGR=[];
function fgItems(t){const rn=roundAt(t);const items=[{mesh:WORLD},{mesh:SEA},{mesh:MOUNT}];if(rn!==2)petals(items,t,[0,0,0],60);
  const c=catAt(t);CAT=c;CATR=null;if(!c.hidden)CATR=quad('cat',c,items);
  DOGR=[];for(const d of dogsAt(t))DOGR.push([d,quad('dog',d,items)]);
  vacItems(items,t);ufoItems(items,t);const b=bearAt(t);BEAR=b;BEARR=b?quad('bear',b,items):null;cukeItems(items,t);effects(items,t);return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const cp=CAT.pos;
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.03,far:14000},{center:[cp[0],0,cp[2]+0.8],radius:roundAt(tt)===3?4.5:3.2},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.swat,16,0.6);if(t>=R[0]&&t<EV.swat)a+=1.5*clamp((t-R[0])/3,0,1);if(t>=EV.suck0&&t<EV.vjump)a+=3;S(EV.vland,5,0.3);S(EV.boop,6,0.3);
  if(t>=EV.chaos0&&t<EV.drop)a+=7;S(EV.dland,8,0.4);S(EV.ufoCrash,12,1.2);
  if(t>=R[3]&&t<EV.bstop){const ph=((16-(bearAt(t)||{pos:[0,0,16]}).pos[2])/0.75)%0.5;if(ph<0.08)a+=4}
  if(t>=EV.roar1&&t<EV.roar1+1.1)a+=7;if(t>=EV.roar2&&t<EV.hiss)a+=10;S(EV.hiss,18,0.6);S(EV.koland,12,0.4);S(EV.jump,5,0.3);return a}
