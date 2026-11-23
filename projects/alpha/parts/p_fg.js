// ---------- foreground: light sail + ant ----------
let LASTVP=null,QPTS=[];
function beamA(t){let a=0;for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>=0&&k<0.35)a=Math.max(a,0.55*Math.sin(k/0.35*Math.PI))}
  if(t>=EV.e1&&t<EV.hit1){const k=(t-EV.e1)/(EV.hit1-EV.e1);a=Math.max(a,0.15+0.35*k+0.12*Math.sin(t*28)*k)}
  if(t>=EV.hit1&&t<R[1])a=Math.max(a,1-ease((t-EV.hit1-2.2)/0.8));return a}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];
  let walk=0,o={t};let Rm=M4.id();let Sm=M4.id();
  // sail jitter at launch
  if(t>=EV.hit1&&t<EV.hit1+2.5){const j=(1-(t-EV.hit1)/2.5);Sm=M4.trs([0,0,0],Math.sin(t*37)*0.01*j,0,Math.sin(t*29)*0.012*j,1)}
  items.push({mesh:MSAIL,M:Sm});
  // LASER BEAM from Earth (hook test pulses, R1 charge + launch)
  const ba=beamA(t);if(ba>0.01){const far=V.sc(DIRE,1800);
    items.push({mesh:BEAMC,M:segM([0,-0.03,0],far,2.9),tint:[0.62,0.28,1],tintAmt:1,add:1,alpha:0.32*ba,noShadow:true});
    items.push({mesh:BEAMC,M:segM([0,-0.03,0],far,2.1),tint:[0.85,0.6,1],tintAmt:1,add:1,alpha:0.35*ba,noShadow:true});
    items.push({mesh:BEAMC,M:segM([0,-0.03,0],far,1.0),tint:[1,0.92,1],tintAmt:1,add:1,alpha:0.5*ba,noShadow:true});
    QPTS.push({p:[0,-0.15,0],c:'210,140,255',r:1.4*ba,a:0.45*ba,cap:600});
    for(const s of[[-1,-1],[1,-1],[-1,1],[1,1]])QPTS.push({p:[s[0]*SAILW,0,s[1]*SAILW],c:'190,150,255',r:0.6*ba,a:0.7*ba})}
  // speed streaks (we fly away from Earth)
  const sp=t>=EV.hit1&&t<R[2]+0.8?(t<R[1]?Math.min(1,(t-EV.hit1)/0.4):1-ease((t-R[2]-0.2)/0.6)):0;
  if(sp>0.01){const vel=t<R[1]?60:30;for(let i=0;i<46;i++){const b=[(hsh(i,1)-0.5)*9,(hsh(i,2)-0.2)*5,(hsh(i,3)-0.3)*10];if(Math.hypot(b[0],b[2])<1.9&&b[1]<1.5)continue;
      const L=40,ph=((t*vel+hsh(i,4)*L)%L)-L*0.5;const q=V.add(b,V.sc(DIRE,ph));streak(items,q,DIRE,1.2+hsh(i,5)*1.4,0.012,mix3([0.7,0.9,1],[1,0.8,1],hsh(i,6)),0.55*sp)}}
  // HOOK: laser test pulses jolt the ant
  for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>0&&k<0.45){const j=Math.sin(k/0.45*Math.PI);Rm=M4.trs([0,0.12*j,0],0,0,(h===EV.h0?0.1:-0.1)*j,1);o.lid=0;o.flail=1}}
  if(t>=2.0&&t<R[0])o.lid=0.3;
  // R1: charge -> LAUNCH at 60,000 g -> sunglasses
  if(rn===0){if(t>=EV.e1+0.8&&t<EV.hit1){o.lid=0;o.headDown=0.25;Rm=M4.trs([Math.sin(t*45)*0.006*(t-EV.e1),0,0],0,0,0,1)}
    if(t>=EV.hit1&&t<EV.res1){const k=t-EV.hit1;const sq=k<0.25?easeOut(k/0.25):1-0.25*ease((k-1.6)/0.8);o.pose='squash';o.lid=0;o.flail=0.4;
      Rm=M4.trs([Math.sin(t*50)*0.01,0,0],0,0,0,[1+0.25*sq,1-0.42*sq,1+0.2*sq]);if(k<0.6)burst(items,[0,0.05,0],k,30,61,1.4,[0.85,0.7,1],0)}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5)*(1-ease((t-R[1]+0.6)/0.4));o.lid=0.4}}
  // R2: snack in deep space, cosmic ray ZAPs
  if(rn===1){if(t>=EV.s2+0.8)o.pose='sit';
    const zap=(t0,to,seed)=>{const k=t-t0;if(k<-0.18||k>1.2)return;const from=V.add(to,V.sc(V.norm([-0.8,0.9,0.6]),9));
      if(k<0){const f=(k+0.18)/0.18;const h=V.add(from,V.sc(V.sub(to,from),f));streak(items,h,V.norm(V.sub(to,from)),2.2,0.03,[0.6,1,1],1)}
      else{burst(items,to,k*0.9,24,seed,0.9,[0.6,1,1],0.5);if(k<0.3)QPTS.push({p:to,c:'150,240,255',r:1.6*(1-k/0.3),a:1})}};
    zap(EV.hit2,[0.45,0.02,-0.55],71);zap(EV.boom2,[1.05,0.08,0.95],73);
    for(const h of[EV.hit2,EV.boom2]){const k=t-h;if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.15*j,0],0,0,0.08*j,1);o.lid=0;o.flail=1}}
    if(t>=EV.res2){o.glasses=easeOut((t-EV.res2)/0.5)*(1-ease((t-R[2]+0.6)/0.4));o.lid=0.35}}
  // R3: three suns -> dizzy
  if(rn===2){if(t>=EV.b3+0.8&&t<EV.res3){o.lid=0;o.headDown=-0.4}
    if(t>=EV.hit3&&t<EV.crk3+0.4){o.dizzy=1;const k=t-EV.hit3;Rm=M4.trs([0,0,0],Math.sin(k*5)*0.4,0,Math.sin(k*7)*0.08,1)}
    if(t>=EV.res3){o.glasses=easeOut((t-EV.res3)/0.5)*(1-ease((t-R[3]+0.6)/0.4));o.lid=0.4;o.headDown=-0.25}}
  // R4: Proxima superflare
  if(rn===3){if(t>=EV.k4+0.4&&t<EV.res4){o.lid=0;o.headDown=-0.35;if(t>=EV.c4-1.2&&t<EV.c4)Rm=M4.trs([Math.sin(t*40)*0.012,0,0],0,0,0,1)}
    if(t>=EV.c4&&t<EV.c4+0.6){const k=t-EV.c4;const j=Math.sin(k/0.6*Math.PI);Rm=M4.trs([0,0.1*j,-0.15*j],0,0,-0.12*j,1);o.flail=1}
    if(t>=EV.c4&&t<EV.res4)o.white=Math.max(0,1-(t-EV.c4)/1.6);
    if(t>=EV.res4){o.glasses=easeOut((t-EV.res4)/0.5)*(1-ease((t-R[4]+0.6)/0.4));o.lid=0.35}}
  // FINAL: arrival -> calendar -> old age
  if(rn===4){const hop=t-R[4]-0.5;if(hop>0&&hop<0.9){const j=Math.abs(Math.sin(hop/0.45*Math.PI));Rm=M4.trs([0,0.25*j,0],0,0,0,1);o.flail=1;o.lid=0.1}
    if(hop>0&&hop<2.2){const cc=[[1,0.85,0.3],[0.4,1,0.6],[1,0.4,0.6],[0.4,0.9,1]];for(let q=0;q<4;q++)burst(items,[0,0.9,-0.2],hop*0.7,10,141+q*7,0.9,cc[q],1.5)}
    if(t>=EV.dot5&&t<EV.look5){o.lid=0;o.headDown=0}
    if(t>=EV.look5){const ak=ease((t-EV.look5)/(EV.hit5-EV.look5));o.old=ak;o.lid=0.2+0.5*ak;o.headDown=0.3*ak;Rm=M4.trs([0,-0.04*ak,0],0,0,0,1)}
    if(t>=EV.hit5){o.old=1;o.headDown=0;
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      else{const k=t-EV.hit5;Rm=M4.trs([Math.sin(k*60)*0.02,0,0],0,0,0,1);o.lid=0.7}}}
  o.ph=0;o.walk=walk;o.pose=o.pose||'walk';
  const coughs=[2.2,EV.res1+1.8,EV.res2+2.4,EV.res3+1.6,EV.look5+1.0];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  const ai=antItems(M4.mul(Sm,Rm),o);
  if(o.white)for(const q of ai)if(q.tint)q.tint=mix3(q.tint,[1,0.95,1],o.white*0.8);
  items.push(...ai);
  return items}
