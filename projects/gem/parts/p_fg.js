// ---------- foreground ----------
let LASTVP=null,QPTS=[];
function dropPos(t){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);const kk=Math.pow(k,1.25);return[0.04+Math.sin(k*5)*0.05*(1-k),lerp(4.4,1.02,kk),-0.3]}
// a glowing meteor head + tail between st and en (k 0..1); fizzles (no ground impact)
function meteorFG(items,st,en,k,s,col,glow){const d=V.norm(V.sub(en,st));const cur=V.add(st,V.sc(V.sub(en,st),k));
  items.push({mesh:GSPH,M:M4.trs(cur,0,0,0,s),tint:[1,1,0.92],tintAmt:1,add:1,noShadow:true});
  for(let j=0;j<12;j++){const f=j/12;const q=V.sub(cur,V.sc(d,f*s*26));items.push({mesh:GSPH,M:M4.trs(q,0,0,0,s*1.3*(1-f*0.8)),tint:mix3(col||[1,0.95,0.6],[1,0.35,0.08],f),tintAmt:1,alpha:0.8*(1-f),add:1,noShadow:true})}
  QPTS.push({p:cur,c:glow||'255,235,170',r:s*14,a:0.9});return cur}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];const L=MTILE;
  let pose='walk',walk=sjSpd(t)>0?1:0,o={t};
  const dist=sjD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // HOOK: two meteors scream past the ant and burst into sparks just above the grass
  if(t<R[0]+0.6){const LB=[[EV.h0,[-0.75,0.55,0.6],0.09],[EV.h1,[0.85,0.7,1.2],0.11]];
    for(const [h,p,s] of LB){const k=t-h;if(k<-0.35)continue;
      if(k<0){const f=(k+0.35)/0.35;meteorFG(items,[p[0]-3,p[1]+6,p[2]+4],p,f,s)}
      else if(k<1.4){burst(items,p,k,30,31+h*10,1.4,null,3.0);if(k<0.3)QPTS.push({p,c:'255,220,150',r:2.2*(1-k/0.3),a:0.9})}}
    for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.2*j,0],0,0,(h===EV.h0?0.1:-0.1)*j,1);o.lid=0;o.flail=1}}if(t>=2.0&&t<R[0])o.lid=0.3}
  // R1: ONE Geminid at 35 km/s, straight at the ant ... burns up above him
  if(rn===0){if(t>=EV.e1+1.0&&t<EV.res1){walk=0;o.lid=0;o.headDown=-0.35}
    if(t>=EV.e1&&t<EV.hit1){const k=(t-EV.e1)/(EV.hit1-EV.e1);meteorFG(items,[-14,7,30],[0.05,1.5,0.9],Math.pow(k,1.6),0.1+0.12*k)}
    if(t>=EV.hit1){const k=t-EV.hit1;if(k<0.5)QPTS.push({p:[0.05,1.5,0.9],c:'255,240,190',r:6*(1-k/0.5),a:1});
      if(k<2.6)burst(items,[0.05,1.5,0.9],k*0.8,46,81,1.3,null,1.2);
      // glitter rain settling on the ant
      if(k>0.3&&k<3.5)for(let i=0;i<36;i++){const ph=clamp((k-0.3)/(1.6+hsh(i,2)*0.8),0,1);const p=[(hsh(i,3)-0.5)*0.9+Math.sin(t*2+i)*0.05,lerp(1.45,0.45+hsh(i,4)*0.4,ph),0.5+(hsh(i,5)-0.5)*0.9];
        items.push({mesh:GSPH,M:M4.trs(p,0,0,0,0.012),tint:[1,0.9,0.55],tintAmt:1,alpha:(1-ease((k-2.6)/0.9))*(0.6+0.4*Math.sin(t*20+i)),add:1,noShadow:true})}
      if(t>=EV.crk1){o.dust=0.25*(1-ease((t-EV.res1-1)/1.5))}
      if(k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.1*j,0],0,0,0.05*j,1);o.flail=1}}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5)*(1-ease((t-R[1]+0.6)/0.4));o.lid=0.4}}
  // R2: FIREBALL explodes in the sky, then the SONIC BOOM arrives
  if(rn===1){if(t>=EV.s2+1.4&&t<EV.res2){o.lid=0;o.headDown=-0.35;walk=0}
    if(t>=EV.hit2&&t<EV.boom2){o.lid=0;const j=Math.sin(t*30)*0.01;Rm=M4.trs([j,0,0],0,0,0,1)}
    if(t>=EV.boom2){const k=t-EV.boom2;
      items.push({mesh:RING,M:M4.trs([0,0.03,0.05],0,0,0,0.2+easeOut(k/1.1)*5),tint:[0.8,1,0.8],tintAmt:1,alpha:Math.max(0,0.85*(1-k/1.2)),add:1,noShadow:true});
      if(k<1.6)puff(items,[0,0.02,0.05],k,8,1.2,[0.35,0.4,0.42],0.3);
      // grass flattening ring = sparks of dust
      if(k<1.2)burst(items,[0,0.05,0.05],k,24,95,1.6,[0.7,0.8,0.7],4.9);
      if(k<0.9){const kk=k/0.9;Rm=M4.trs([0,0.18*Math.sin(kk*Math.PI),0],easeOut(kk)*TAU2,0,0.08*Math.sin(kk*Math.PI*2),1);o.flail=1;o.lid=0}}
    if(t>=EV.res2){o.glasses=easeOut((t-EV.res2)/0.5)*(1-ease((t-R[2]+0.6)/0.4));o.lid=0.35}}
  // R3: 120 METEORS PER HOUR – the ant looks up and counts... and gets dizzy
  if(rn===2){if(t>=EV.b3+1.0&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.4}
    if(t>=EV.hit3&&t<EV.crk3+0.4){o.dizzy=1;const k=t-EV.hit3;Rm=M4.trs([0,0,0],Math.sin(k*5)*0.35,0,Math.sin(k*7)*0.08,1)}
    if(t>=EV.crk3&&t<EV.crk3+0.5){const k=t-EV.crk3;const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.1*j,0],0,0,0.08*j,1)}
    if(t>=EV.res3){o.glasses=easeOut((t-EV.res3)/0.5)*(1-ease((t-R[3]+0.6)/0.4));o.lid=0.4}}
  // R4: PHAETHON – red glow, ant trembles, then it flies past
  if(rn===3){if(t>=EV.k4+0.6&&t<EV.res4){walk=0;o.lid=0;o.headDown=-0.3;if(t>=EV.c4-0.3)Rm=M4.trs([Math.sin(t*40)*0.015,0,0],0,0,0,1)}
    if(t>=EV.k4){const a=ease((t-EV.k4)/1.5)*(1-ease((t-EV.res4)/1.2));QPTS.push({p:[0,0.7,0.2],c:'255,110,60',r:1.6,a:0.18*a})}
    if(t>=EV.res4){o.glasses=easeOut((t-EV.res4)/0.5)*(1-ease((t-R[4]+0.6)/0.4));o.lid=0.3}}
  // FINAL: ONE speck of space dust
  if(rn===4){if(t>=EV.dot5&&t<EV.hit5){const p=dropPos(t);const ap=clamp((t-EV.dot5)/0.4,0,1);
      items.push({mesh:MGRAIN,M:M4.trs([p[0],p[1]-0.3,p[2]],t*2.2,t*1.3,0,0.1),tint:[0.75,0.8,0.95],tintAmt:0.35,alpha:ap});QPTS.push({p:[p[0],p[1]-0.3,p[2]],c:'200,230,255',r:0.3*(0.7+0.3*Math.sin(t*12)),a:0.7*ap})}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=-0.3;if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.015;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;
      if(t<EV.fall5)items.push({mesh:MGRAIN,M:M4.trs([0.06,0.86,-0.32],0.4,0.2,0,0.07)});
      if(k<1.2){burst(items,[0.02,0.8,-0.3],k,26,121,0.9,[0.8,0.9,1],4.9);puff(items,[0.02,0.65,-0.3],k,8,0.5,[0.7,0.7,0.75],0.5);items.push({mesh:RING,M:M4.trs([0,0.04,-0.25],0,0,0,0.2+easeOut(k/0.6)*1.4),tint:[0.7,0.85,1],tintAmt:1,alpha:Math.max(0,0.7*(1-k/0.8)),add:1,noShadow:true})}
      if(k<0.35)QPTS.push({p:[0.02,0.8,-0.3],c:'210,230,255',r:0.7*(1-k/0.35),a:0.9});
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      else{Rm=M4.trs([Math.sin(k*70)*0.03,0,0],0,0,0,[1,1-0.35*Math.sin(clamp(k/0.3,0,1)*Math.PI),1]);o.flail=1;o.dizzy=1}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sjD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.2,EV.res1+1.8,EV.res2+2.4,EV.res3+1.6,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  const ai=antItems(Rm,o);
  if(o.dust)for(const q of ai)if(q.tint)q.tint=mix3(q.tint,[1,0.85,0.45],o.dust);
  items.push(...ai);
  return items}
