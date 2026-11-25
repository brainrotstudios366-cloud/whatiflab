// ---------- foreground ----------
let LASTVP=null,QPTS=[];
const WDIR=V.norm([-1,-0.04,0.18]);
// water level & surge front (R2)
function waterAt(t){const rn=roundAt(t);if(rn!==1)return{lvl:0,zf:99};
  let lvl=0.1*ease((t-EV.s2)/2.5),zf=-40;
  if(t>=EV.hit2-0.9){const k=clamp((t-EV.hit2+0.9)/1.3,0,1);zf=lerp(16,-9,easeIn(k)*0.4+k*0.6)}else zf=99;
  const rec=ease((t-(R[2]-2.6))/2.3);const top=0.62*(1-rec);
  return{lvl:Math.max(lvl*(1-rec),0),zf,top}}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];const L=MTILE;
  let pose='walk',walk=sjSpd(t)>0?1:0,o={t};
  const dist=sjD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // ---- wind streaks + flying leaves (everywhere the wind blows) ----
  const wd=windAt(t);
  if(wd>0.02){const n=Math.round(46*wd);for(let i=0;i<n;i++){const sp=9+hsh(i,3)*8;const ph=(t*sp/14+hsh(i,4))%1;const p=[lerp(5,-5,ph),0.08+hsh(i,5)*2.2,-1.6+hsh(i,6)*6];
      streak(items,p,WDIR,0.5+wd*0.9*hsh(i,7),0.012,[0.85,0.9,1],0.16*wd*Math.sin(ph*Math.PI))}
    const nl=Math.round(9*wd);for(let i=0;i<nl;i++){const sp=5+hsh(i,13)*5;const ph=(t*sp/12+hsh(i,14))%1;const p=[lerp(6,-6,ph),0.15+hsh(i,15)*1.8+Math.sin(t*3+i)*0.15,-1+hsh(i,16)*5];
      items.push({mesh:LEAF,M:M4.trs(p,t*(3+i),t*(5+i*0.7),t*4,0.09+hsh(i,17)*0.05)})}}
  // ---- HOOK: two pieces of debris (twig, pebble) slam beside the ant ----
  if(t<R[0]+0.6){const LB=[[EV.h0,[-0.75,0.12,0.6]],[EV.h1,[0.85,0.12,1.2]]];
    for(const [h,p] of LB){const k=t-h;if(k<-0.4)continue;
      if(k<0){const f=(k+0.4)/0.4;const q=[p[0]+3.5*(1-f),p[1]+0.9*(1-f),p[2]];items.push({mesh:LEAF,M:M4.trs(q,t*9,t*14,t*6,0.16)});items.push({mesh:UB,M:M4.trs([q[0]+0.3,q[1]+0.1,q[2]],t*11,0.3,t*7,[0.32,0.03,0.03]),tint:hx('#5a3a22'),tintAmt:1})}
      else if(k<1.4){burst(items,p,k,26,31+h*10,1.2,[0.75,0.85,0.95],3.0);puff(items,p,k,8,0.6,[0.55,0.5,0.42],0.5);
        items.push({mesh:UB,M:M4.trs([p[0]-0.1,0.03,p[2]],0.3,0,0,[0.32,0.03,0.03]),tint:hx('#5a3a22'),tintAmt:1})}}
    for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.15*j,0],0,0,(h===EV.h0?0.1:-0.1)*j,1);o.lid=0;o.flail=1}}if(t>=2.0&&t<R[0])o.lid=0.3}
  // ---- R1: 252 km/h winds: clings ... blown away ... lands unhurt ----
  if(rn===0){if(t>=EV.e1+0.6&&t<EV.hit1){walk=0;pose='cling';o.lid=0;Rm=M4.trs([Math.sin(t*37)*0.02,0,0],0,0,0.08+Math.sin(t*23)*0.04,1)}
    if(t>=EV.hit1&&t<EV.crk1){walk=0;pose='fall';o.lid=0;o.flail=1;const k=(t-EV.hit1)/(EV.crk1-EV.hit1);let p,sp=t*9;
      if(k<0.45){const kk=k/0.45;p=[lerp(0,-3.6,easeIn(kk)),lerp(0,3.2,easeOut(kk)),lerp(0,1.2,kk)]}else{const kk=(k-0.45)/0.55;p=[lerp(0.6,0,kk),lerp(4.2,0,easeIn(kk)),lerp(0.6,0,kk)]}
      Rm=M4.trs(p,sp*0.6,sp*0.3,sp,1)}
    if(t>=EV.crk1){const k=t-EV.crk1;if(k<1.3){puff(items,[0,0.02,0.2],k,9,0.9,[0.55,0.5,0.42],0.55);burst(items,[0,0.05,0.2],k,16,61,0.8,[0.6,0.55,0.45],4.9)}
      if(k<0.45){const j=Math.sin(k/0.45*Math.PI);Rm=M4.trs([0,0.12*j,0],0,0,0,[1,1-0.25*j,1]);o.lid=0}}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5)*(1-ease((t-R[1]+0.6)/0.4));o.lid=0.4}}
  // ---- R2: STORM SURGE ----
  const W2=waterAt(t);
  if(rn===1){if(t>=EV.s2+1.0&&t<EV.hit2){walk=0;o.lid=0;o.headDown=-0.1}
    // water body: shallow sheet + surge region behind the front
    if(W2.lvl>0.003)items.push({mesh:HWATER,M:M4.trs([0,W2.lvl,20],0,0,0,[80,0.5,80]),alpha:0.82,noShadow:true});
    if(W2.zf<40){const top=W2.top;const zf=W2.zf;items.push({mesh:HWATER,M:M4.trs([0,top,(zf+60)/2],0,0,0,[80,top+0.3,60-zf]),alpha:0.85,noShadow:true});
      // foamy crest at the front
      if(t<EV.hit2+1.0){const ca=1-ease((t-EV.hit2-0.2)/0.8);items.push({mesh:HFOAM,M:M4.trs([0,top+0.12,zf],0,0,0,[80,0.3,0.5]),alpha:0.8*ca,noShadow:true});
        for(let i=0;i<30;i++){const x=-4+i/30*8;const k=(t*2+hsh(i,3))%1;streak(items,[x,top+0.15+k*0.5,zf+0.1],V.norm([0,1,-0.6]),0.25,0.04,[0.9,0.96,1],0.5*ca*(1-k))}}
      if(t>=R[2]-3&&top>0.02){}}
    if(t>=EV.hit2&&t<EV.boom2){walk=0;const k=t-EV.hit2;o.lid=0;o.flail=1;Rm=M4.trs([0,-0.15,0],0,0,Math.sin(k*9)*0.3,1);
      for(let i=0;i<14;i++){const ph=((t-EV.hit2)*1.2+hsh(i,4))%1;items.push({mesh:GSPH,M:M4.trs([(hsh(i,5)-0.5)*0.5,0.3+ph*0.4,(hsh(i,6)-0.5)*0.5],0,0,0,0.02+0.02*hsh(i,7)),tint:[0.85,0.95,1],tintAmt:1,alpha:0.6*(1-ph),add:1,noShadow:true})}}
    if(t>=EV.boom2){walk=0;const k=t-EV.boom2;const lv=W2.top;const up=easeOut(clamp(k/0.5,0,1));const bob=Math.sin(t*2.6)*0.025*(lv>0.05?1:0);const y=lerp(-0.1,lv,up)+bob;
      Rm=M4.trs([0,y+0.02,0],Math.sin(t*0.8)*0.25,0,Math.sin(t*2.1)*0.06,1);items.push({mesh:LEAF,M:M4.trs([0,y+0.01,0.05],Math.sin(t*0.8)*0.25+Math.PI/2,0,Math.sin(t*2.1)*0.06,[1.05,1,1.25])});
      if(k<1.0){burst(items,[0,lv+0.05,0.1],k,24,151,0.9,[0.85,0.95,1],4.9);items.push({mesh:RING,M:M4.trs([0,lv+0.02,0.1],0,0,0,0.2+easeOut(k/0.8)*1.6),tint:[0.9,0.97,1],tintAmt:1,alpha:Math.max(0,0.7*(1-k/0.9)),add:1,noShadow:true})}
      o.lid=k<1.0?0:0.4;if(t>=EV.res2){o.glasses=easeOut((t-EV.res2)/0.5)*(1-ease((t-R[2]+0.6)/0.4))}}}
  // ---- R3: LIGHTNING strikes right next to him ----
  const P3=[0.85,0,1.0];
  if(rn===2){if(t>=EV.b3+1.0&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.4}
    // static charge: tiny sparks crawling on the antennae/ground before the strike
    if(t>=EV.hit3-1.4&&t<EV.hit3){const a=ease((t-EV.hit3+1.4)/1.4);for(let i=0;i<6;i++){const ph=hsh(i,Math.floor(t*14));if(ph<0.5)continue;const q=[P3[0]+(hsh(i,8)-0.5)*0.4,0.05+hsh(i,9)*0.3,P3[2]+(hsh(i,10)-0.5)*0.4];streak(items,q,V.norm([hsh(i,11)-0.5,1,hsh(i,12)-0.5]),0.12,0.012,[0.7,0.85,1],0.8*a)}
      QPTS.push({p:[P3[0],0.2,P3[2]],c:'150,190,255',r:0.5,a:0.4*a})}
    if(t>=EV.hit3&&t<EV.hit3+0.45){const k=t-EV.hit3;const on=k<0.09||(k>0.13&&k<0.45);if(on){const al=k<0.09?1:0.85*(1-(k-0.13)/0.32);bolt3D(items,[P3[0]+2.2,12,P3[2]+5],P3,407,al,1)}
      QPTS.push({p:[P3[0],0.15,P3[2]],c:'200,220,255',r:2.5*(1-k/0.45),a:0.9})}
    if(t>=EV.hit3){const k=t-EV.hit3;if(k<2.2){burst(items,[P3[0],0.05,P3[2]],k*0.9,40,171,1.3,null,3.5);puff(items,[P3[0],0.02,P3[2]],k*0.8,9,1.1,[0.25,0.24,0.26],0.55)}
      items.push({mesh:RING,M:M4.trs([P3[0],0.012,P3[2]],0,0,0,0.25),tint:[0.08,0.06,0.05],tintAmt:1,alpha:0.85,noShadow:true});
      if(k<1.2)items.push({mesh:RING,M:M4.trs([P3[0],0.03,P3[2]],0,0,0,0.2+easeOut(k/0.7)*3),tint:[0.75,0.85,1],tintAmt:1,alpha:Math.max(0,0.8*(1-k/0.9)),add:1,noShadow:true});
      o.soot=lerp(0.7,0.45,ease((t-EV.res3-1.5)/2));if(k<0.55){const j=Math.sin(k/0.55*Math.PI);Rm=M4.trs([0,0.3*j,0],0,0,-0.15*j,1);o.flail=1;o.lid=0}
      if(t>=EV.crk3-0.3&&t<EV.res3){o.dizzy=1;const kk=t-EV.crk3+0.3;Rm=M4.mul(Rm,M4.trs([0,0,0],Math.sin(kk*5)*0.3,0,Math.sin(kk*7)*0.07,1))}
      // smoke wisps from the ant
      if(k<4)for(let i=0;i<4;i++){const ph=((t*0.7)+i/4)%1;items.push({mesh:USPH,M:M4.trs([-0.05+Math.sin(i*2+t)*0.05,0.9+ph*0.7,0.2],0,0,0,0.05+ph*0.12),tint:[0.3,0.3,0.32],tintAmt:1,alpha:0.4*(1-ph)*(1-ease((k-2.5)/1.5)),noShadow:true})}}
    if(t>=EV.res3){o.glasses=easeOut((t-EV.res3)/0.5)*(1-ease((t-R[3]+0.6)/0.4));o.lid=0.4}}
  // ---- R4: THE EYE – calm; he naps ----
  if(rn===3){if(t>=EV.k4+0.4){walk=0;o.lid=t<EV.c4?0.1:0.85;o.headDown=t<EV.c4?-0.5:0.05}
    if(t>=EV.res4){o.lid=0.92;o.headDown=0.15}}
  // ---- FINAL: ONE gentle breeze ----
  if(rn===4){if(t>=EV.dot5&&t<EV.hit5+0.6){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);const p=[lerp(3.2,-0.2,k),0.55+Math.sin(k*9)*0.12+(1-k)*0.4,0.25];
      items.push({mesh:LEAF,M:M4.trs(p,Math.sin(t*2)*0.6,t*1.4,Math.sin(t*1.7)*0.5,0.13),alpha:clamp((t-EV.dot5)/0.4,0,1)});
      for(let i=0;i<5;i++){const ph=((t-EV.dot5)*0.6+i/5)%1;const q=[lerp(3.5,-1.5,ph),0.5+i*0.14+Math.sin(ph*8+i)*0.06,0.25+i*0.05];streak(items,q,V.norm([-1,Math.cos(ph*8+i)*0.4,0]),0.4,0.008,[1,1,1],0.25*Math.sin(ph*Math.PI))}}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=-0.1;if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.012;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;
      if(t<EV.fall5){const w=Math.sin(k*9)*0.2*Math.min(1,k*2);Rm=M4.trs([0,0,0],0,0,w,1);o.flail=1}
      else{const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      if(t>=EV.fall5+0.35&&t<EV.fall5+1.4){const kk=t-EV.fall5-0.35;puff(items,[-0.4,0.02,0.2],kk,6,0.5,[0.7,0.68,0.6],0.4)}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sjD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.2,EV.res1+1.8,EV.s2+0.2,EV.res3+1.6,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  const ai=antItems(Rm,o);
  // wet sheen after the surge
  if(rn===1&&t>=EV.hit2)for(const q of ai)if(q.tint)q.tint=mix3(q.tint,[0.25,0.35,0.5],0.25);
  items.push(...ai);
  return items}
