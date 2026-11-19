PS.chop=P_(Object.assign({},PS.stand,{hR:[-0.1,0.8,0.12],head:{p:-0.55},lid:0.1,browA:0.35,mouth:'flat'}));
PS.chopS=P_(Object.assign({},PS.chop,{lid:0.75,browA:0.1,head:{p:-0.35}}));
PS.shock=P_(Object.assign({},PS.stand,{hR:[-0.3,0.25,0.25],hL:[0.3,0.25,0.25],head:{p:-0.3},lid:0,browA:0.6,mouth:'open'}));
PS.frozen=P_(Object.assign({},PS.shock,{pel:{y:0.9},head:{p:-0.2}}));
function samAt(t){let o,extra={};
  if(t<R[0]){o=PS.iai}
  // ---- R1 liftoff: vertical cut splits the blast
  else if(t<R[1]){o=kf(t,[[R[0],PS.iai],[R[0]+0.6,PS.stand],[EV.ign+0.2,PS.stand],[EV.ign+0.7,PS.iai],[EV.cut-0.5,PS.iai],[EV.cut-0.25,PS.jodan],[EV.cut,PS.cutlow],[EV.hit+2.3,PS.cutlow],[EV.hit+2.7,PS.rest],[EV.cool-0.3,PS.rest],[EV.cool,PS.sheathA],[EV.cool+0.6,PS.sheathA],[EV.cool+0.85,PS.stand],[R[1]-1.4,PS.stand],[R[1]-0.8,PS.lookup],[R[1],PS.lookup]]);o=Object.assign({},o);
    if(t>=EV.cool&&t<EV.cool+0.6)o.sheathK=easeIn((t-EV.cool)/0.6);if(t>=EV.cool+0.6&&t<R[1]-1.4)o.lid=0.7}
  // ---- R2 booster catch with chopsticks
  else if(t<R[2]){o=kf(t,[[R[1],PS.lookup],[EV.chop-0.5,PS.lookup],[EV.chop,PS.chop],[EV.catch+0.9,PS.chop],[EV.catch+1.5,PS.chopS],[R[2],PS.chopS]]);o=Object.assign({},o);
    if(t>=EV.chop-0.15)extra.chop=clamp((t-EV.chop+0.15)/0.2,0,1);
    if(t>=EV.catch&&t<EV.catch+0.5){const k=(t-EV.catch)/0.5;o.root=[0,-0.07*Math.sin(k*Math.PI),0]}}
  // ---- R3 liquid oxygen: frozen, breaks out, shaved ice
  else if(t<R[3]){const tf=Math.min(t,EV.freeze);o=kf(tf,[[R[2],PS.stand],[EV.vent+0.3,PS.stand],[EV.vent+0.8,PS.lookup],[EV.freeze-0.6,PS.lookup],[EV.freeze-0.2,PS.frozen],[EV.freeze,PS.frozen]]);
    if(t>=EV.crack-0.05)o=kf(t,[[EV.crack-0.05,PS.frozen],[EV.crack+0.1,PS.spin],[EV.crack+0.35,PS.follow],[EV.crack+0.9,PS.follow],[EV.crack+1.3,PS.rest],[EV.ice-0.4,PS.stand],[EV.ice,PS.eat],[R[3]-0.5,PS.eat],[R[3],PS.rest]]);
    o=Object.assign({},o);if(t>=EV.freeze&&t<EV.crack){o.lid=0;o.wind=0;o.t=EV.freeze}
    if(t>=EV.ice-0.2&&t<R[3]-0.3)extra.snow=1}
  // ---- R4 reentry: jump + slice the ship
  else if(t<R[4]){o=kf(t,[[R[3],PS.rest],[EV.ready-0.6,PS.rest],[EV.ready-0.3,PS.lookup],[EV.ready+0.6,PS.lookup],[EV.ready+1.0,PS.chudan],[EV.jump-0.15,PS.chudan],[EV.jump,PS.jump],[EV.slice-0.1,PS.jump],[EV.slice+0.05,PS.jumpcut],[EV.land,PS.jumpcut],[EV.land+0.1,PS.land],[EV.walk-0.6,PS.land],[EV.walk-0.1,PS.rest],[EV.walk+0.3,PS.sheathA],[EV.walk+0.9,PS.sheathA],[EV.walk+1.15,PS.stand],[R[4],PS.stand]]);o=Object.assign({},o);
    if(t>=EV.jump&&t<EV.land){const k=(t-EV.jump)/(EV.land-EV.jump);o.root=[0,2.6*Math.sin(k*Math.PI),0]}
    if(t>=EV.walk+0.3&&t<EV.walk+0.9)o.sheathK=easeIn((t-EV.walk-0.3)/0.6);if(t>=EV.walk+0.9)o.lid=0.7}
  // ---- FINAL: ONE heat-shield tile
  else{const sur=P_(Object.assign({},PS.lookup,{lid:0,browA:0.6,mouth:'open'}));
    o=kf(t,[[R[4],PS.stand],[R[4]+0.6,PS.cross],[EV.look-0.3,PS.cross],[EV.look,PS.lookup],[EV.bonk-0.7,PS.lookup],[EV.bonk-0.35,sur],[EV.bonk,sur],[EV.bonk+0.15,PS.slap],[EV.bonk+0.4,PS.slip],[EV.floor,PS.down],[99,PS.down]]);o=Object.assign({},o);
    if(t>=EV.bonk+0.1){const k=clamp((t-EV.bonk-0.1)/(EV.floor-EV.bonk-0.1),0,1);o.rootP=-easeIn(k)*1.42;o.root=[0,0.3*Math.sin(Math.min(1,k*1.6)*Math.PI*0.5)*(1-k)+0.06*k,0.25*k];
      if(t>=EV.floor){const b=t-EV.floor;o.rootP=-1.42+Math.abs(Math.sin(b*14))*0.08*Math.exp(-b*6);o.root=[0,0.06,0.25]}}}
  o=Object.assign({},o);if(o.t==null)o.t=t;o.yaw=Math.PI;if(o.wind==null)o.wind=1;return{o,extra}}
function samItems(t){const{o,extra}=samAt(t);if(o.sheathK!=null&&o.sheathK>=0){const pre=charItems(Object.assign({},o,{sw:'none'}));
    const sayaA=tp(pre.Pm,[0.2,0.0,0.13]),sd=V.norm(td(pre.Pm,[0.06,0.33,1]));const k=o.sheathK;const hw=V.add(sayaA,V.sc(sd,0.1+0.34*(1-k)));const I=M4.inv(pre.Tm);o.hR=tp(I,hw);o.sd=td(I,V.sc(sd,-1));o.sw='hand';o.twoHand=false}
  const r=charItems(o);
  if(extra.chop){const H=r.hands[-1];const s=extra.chop;r.chopTip=V.add(H,[0,0.33,0]);for(const dx of[-0.012,0.012])r.items.push({mesh:CHOP,M:M4.trs(V.add(H,[dx,-0.03,0]),0,0,dx*1.5,s)})}
  if(extra.snow){const H=r.hands[1];const p=V.add(H,[0,0.03,-0.03]);r.items.push({mesh:CUP,M:M4.trs(p,0,0,0,1.15)});r.items.push({mesh:SNOW,M:M4.trs(V.add(p,[0,0.045,0]),0,0,0,[0.045,0.035,0.045]),tint:[0.95,0.97,1],tintAmt:0.3});
    r.items.push({mesh:SNOW,M:M4.trs(V.add(p,[0.01,0.07,0]),0,0,0,[0.022,0.018,0.022]),tint:[1,0.35,0.5],tintAmt:1})}
  r.o=o;return r}
const CUP=um(m=>{m.prism([0,-0.04,0],0.032,0.042,0.075,14,hx('#3a5a4a'));m.prism([0,0.03,0],0.036,0.036,0.002,14,hx('#9ac860'))},0.5);
