// ---------- foreground ----------
let LASTVP=null,QPTS=[];
const WDIR=V.norm([-1,-0.12,0.18]);
const ICE_CYAN=[0.75,0.92,1];
// avalanche snow front (R2)
function avAt(t){const rn=roundAt(t);if(rn!==1||t<EV.hit2-0.9)return null;const k=clamp((t-EV.hit2+0.9)/1.3,0,1);return{zf:lerp(16,-9,easeIn(k)*0.4+k*0.6),top:0.74}}
// mammoth foot height (R3), fg units; center & radius
const FOOTC=[-22.6,0,5.0],FOOTR=21;
function footY(t){if(roundAt(t)!==2)return null;if(t<EV.hit3-1.5||t>EV.crk3+1.4)return null;if(t<EV.hit3)return lerp(38,0,easeIn(clamp((t-EV.hit3+1.5)/1.5,0,1)));if(t<EV.crk3)return 0;return lerp(0,80,easeIn(clamp((t-EV.crk3)/1.4,0,1)))}
function shards(items,p,k,n,seed,sc){for(let i=0;i<n;i++){const d=V.norm([hsh(i,seed)-0.5,0.35+hsh(i,seed+1)*0.9,hsh(i,seed+2)-0.5]);const v=(0.7+hsh(i,seed+3))*sc;const q=[p[0]+d[0]*v*k,p[1]+d[1]*v*k-4.9*k*k*sc*0.4,p[2]+d[2]*v*k];if(q[1]<0.02)q[1]=0.02;
  items.push({mesh:SHARD,M:M4.trs(q,k*9+i,k*7+i*2,0,(0.03+0.04*hsh(i,seed+4))*sc),alpha:Math.max(0,0.85*(1-ease((k-1.2)/0.6))),noShadow:true})}}
function fgItems(t){QPTS=[];const rn=roundAt(t);const items=[];const L=MTILE;
  let pose='walk',walk=sjSpd(t)>0?1:0,o={t};
  const dist=sjD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // ---- blizzard streaks ----
  const wd=windAt(t);
  if(wd>0.02){const n=Math.round(60*wd);for(let i=0;i<n;i++){const sp=9+hsh(i,3)*8;const ph=(t*sp/14+hsh(i,4))%1;const p=[lerp(5,-5,ph),0.05+hsh(i,5)*2.2,-1.6+hsh(i,6)*6];
      streak(items,p,WDIR,0.35+wd*0.8*hsh(i,7),0.014,[0.95,0.97,1],0.3*wd*Math.sin(ph*Math.PI))}}
  // ---- HOOK: two icicles spear the snow beside the ant ----
  if(t<R[0]+0.6){const LB=[[EV.h0,[-0.75,0,0.6],0.2],[EV.h1,[0.85,0,1.2],-0.25]];
    for(const [h,p,tl] of LB){const k=t-h;if(k<-0.45)continue;
      if(k<0){const f=(k+0.45)/0.45;const y=lerp(3.4,0,easeIn(f));items.push({mesh:ICICLE,M:M4.trs([p[0],y,p[2]],0,0,tl,[0.2,0.2,0.2]),alpha:0.9,noShadow:true});
        streak(items,[p[0],y+0.8,p[2]],[0,-1,0],1.4,0.05,[0.85,0.95,1],0.35)}
      else{items.push({mesh:ICICLE,M:M4.trs([p[0],-0.4,p[2]],0,0,tl,[0.2,0.2,0.2]),alpha:0.9,noShadow:true});
        if(k<1.6){shards(items,[p[0],0.05,p[2]],k,16,31+h*10,1.1);puff(items,p,k,9,0.7,[0.93,0.96,1],0.7);burst(items,[p[0],0.05,p[2]],k,18,41+h*10,1.0,[0.85,0.95,1],3.0)}}}
    for(const h of[EV.h0,EV.h1]){const k=t-h;if(k>0&&k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.15*j,0],0,0,(h===EV.h0?0.1:-0.1)*j,1);o.lid=0;o.flail=1}}if(t>=2.0&&t<R[0])o.lid=0.3}
  // ---- R1: -40 °C: frost, frozen solid in a block of ice, breaks out ----
  if(rn===0){if(t>=EV.e1+0.6&&t<EV.crk1){walk=0;o.lid=t<EV.hit1-0.8?0.2:0;const sh=t<EV.hit1?1:0;Rm=M4.trs([Math.sin(t*41)*0.012*sh,0,0],0,0,Math.sin(t*33)*0.025*sh,1)}
    o.frost=0.75*ease((t-EV.e1-0.6)/(EV.hit1-EV.e1-0.6))*(1-ease((t-EV.crk1)/1.6));
    if(t>=EV.hit1-0.9&&t<EV.crk1){const g=easeOut(clamp((t-EV.hit1+0.9)/0.9,0,1));items.push({mesh:ICEB,M:M4.trs([0,0,0.12],0.05,0,0,[1.35,1.22*g,1.75]),alpha:0.5,noShadow:true});
      for(let i=0;i<8;i++){const a=i/8*TAU2;items.push({mesh:SHARD,M:M4.trs([Math.cos(a)*0.72,0.05,0.12+Math.sin(a)*0.92],a,0,0,[0.12,0.16*g,0.12]),alpha:0.7,noShadow:true})}
      if(t>=EV.hit1)QPTS.push({p:[0,0.6,0.1],c:'190,235,255',r:1.0,a:0.25+0.1*Math.sin(t*6)})}
    if(t>=EV.crk1-0.45&&t<EV.crk1){for(let i=0;i<5;i++)streak(items,[0.68,0.3+i*0.18,-0.1+hsh(i,3)*0.5],V.norm([hsh(i,4)-0.5,0.4,1]),0.25,0.01,[1,1,1],0.9)}
    if(t>=EV.crk1){const k=t-EV.crk1;if(k<2.0){shards(items,[0,0.5,0.12],k,30,61,1.6);burst(items,[0,0.5,0.12],k,26,71,1.2,[0.85,0.95,1],3.0)}
      if(k<0.5){const j=Math.sin(k/0.5*Math.PI);Rm=M4.trs([0,0.25*j,0],0,0,0,[1,1+0.15*j,1]);o.lid=0;o.flail=1}}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5)*(1-ease((t-R[1]+0.6)/0.4));o.lid=0.4}}
  // ---- R2: AVALANCHE ----
  const A2=avAt(t);
  if(rn===1){if(t>=EV.s2+1.0&&t<EV.hit2){walk=0;o.lid=0;o.headDown=-0.25;Rm=M4.trs([Math.sin(t*50)*0.01,0,0],0,0,0,1)}
    if(A2){const top=A2.top,zf=A2.zf;items.push({mesh:SNOWSLAB,M:M4.trs([0,top,(zf+60)/2],0,0,0,[80,top+0.3,60-zf]),noShadow:true});
      // billowing powder front
      const ca=1-ease((t-EV.hit2-0.3)/1.2);if(ca>0)for(let i=0;i<34;i++){const x=-5+i/34*10+(hsh(i,7)-0.5)*0.3;const ph=(t*0.9+hsh(i,3))%1;const s=0.35+hsh(i,4)*0.5+ph*0.4;
        items.push({mesh:USPH,M:M4.trs([x,top+0.1+ph*1.3,zf+0.2+ph*0.6],0,0,0,s),tint:[0.95,0.97,1],tintAmt:1,alpha:0.75*ca*(1-ph*0.6),noShadow:true})}
      if(t<EV.hit2+0.8)for(let i=0;i<30;i++){const x=-4+i/30*8;const k=(t*2+hsh(i,3))%1;streak(items,[x,top+0.15+k*0.6,zf+0.1],V.norm([0,1,-0.6]),0.25,0.03,[1,1,1],0.6*(1-k))}
      // lingering snow dust in the air after it passed
      if(t>=EV.hit2)for(let i=0;i<14;i++){const k=t-EV.hit2;const p=[(hsh(i,11)-0.5)*4,top+0.3+hsh(i,12)*1.6+k*0.1,(hsh(i,13)-0.3)*3];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.3+hsh(i,14)*0.4+k*0.1),tint:[0.96,0.97,1],tintAmt:1,alpha:Math.max(0,0.45*(1-k/2.5)),noShadow:true})}}
    if(t>=EV.hit2&&t<EV.boom2){walk=0;o.lid=0;o.frost=0.3;const k=t-EV.hit2;Rm=M4.trs([0,0,0],0,0,Math.sin(k*3)*0.05,1);
      // antennae poke out: wiggle
      o.flail=k>0.6?0.6:0}
    if(t>=EV.boom2){walk=0;const k=t-EV.boom2;const top=A2?A2.top:0.74;const up=easeOut(clamp(k/0.45,0,1));const y=lerp(0,top,up)+(k<0.45?Math.sin(k/0.45*Math.PI)*0.35:0);
      Rm=M4.trs([0,y,0],Math.sin(t*0.8)*0.15,0,0,1);o.frost=0.3*(1-ease(k/2));
      if(k<1.4){burst(items,[0,top+0.05,0.1],k,28,151,1.0,[0.95,0.97,1],4.9);puff(items,[0,top,0.1],k,9,0.7,[0.96,0.97,1],0.7)}
      o.lid=k<1.0?0:0.4;if(t>=EV.res2){o.glasses=easeOut((t-EV.res2)/0.5)*(1-ease((t-R[2]+0.6)/0.4))}}}
  // ---- R3: WOOLLY MAMMOTH stomps right next to him ----
  if(rn===2){const ms=mamAt(t);
    if(t>=EV.b3+0.8&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.45}
    // footstep tremors while it walks in
    if(ms&&t<EV.hit3-1.4){const ph=(ms.ph%Math.PI)/Math.PI;if(ph<0.12){const j=Math.sin(ph/0.12*Math.PI);Rm=M4.trs([0,0.05*j,0],0,0,0,1)}}
    const fy=footY(t);if(fy!=null){items.push({mesh:MFOOT,M:M4.trs([FOOTC[0],fy,FOOTC[2]],2.6,0,0,FOOTR)});
      const sh=clamp(1-fy/38,0,1);items.push({mesh:DISC2,M:M4.trs([FOOTC[0]+1,0.012,FOOTC[2]],0,0,0,FOOTR*(1.35-0.3*sh)),tint:[0.05,0.06,0.1],tintAmt:1,alpha:0.55*sh,noShadow:true})}
    if(t>=EV.crk3+0.6)items.push({mesh:DISC2,M:M4.trs([FOOTC[0],0.01,FOOTC[2]],0,0,0,FOOTR*0.98),tint:[0.55,0.62,0.74],tintAmt:1,alpha:0.5,noShadow:true});
    if(t>=EV.hit3){const k=t-EV.hit3;if(k<2.2){const ep=[-1.7,0.05,0.4];puff(items,ep,k*0.8,10,1.5,[0.95,0.97,1],0.75);burst(items,ep,k*0.9,40,171,1.6,[0.95,0.97,1],3.5)}
      if(k<0.6){const j=Math.sin(k/0.6*Math.PI);Rm=M4.trs([0.15*j,0.45*j,0],0,0,-0.2*j,1);o.flail=1;o.lid=0}
      if(t>=EV.crk3&&t<EV.res3){o.dizzy=1;const kk=t-EV.crk3;Rm=M4.mul(Rm,M4.trs([0,0,0],Math.sin(kk*5)*0.3,0,Math.sin(kk*7)*0.07,1))}}
    if(t>=EV.res3){o.glasses=easeOut((t-EV.res3)/0.5)*(1-ease((t-R[3]+0.6)/0.4));o.lid=0.4}}
  // ---- R4: THE ICE SHEET: he looks... and just walks away ----
  if(rn===3){if(t>=EV.c4-0.4&&t<EV.res4-1.0){o.lid=0;o.headDown=-0.5}
    if(t>=EV.res4-1.0){o.lid=0.45;o.glasses=easeOut((t-EV.res4+0.6)/0.5)*(1-ease((t-R[4]+0.6)/0.4))}}
  // ---- FINAL: ONE snowflake ----
  const FL=[0,0.75,-0.36];
  if(rn===4){if(t>=EV.dot5&&t<EV.hit5){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);const p=[lerp(1.3,0,k)+Math.sin(k*7)*0.3*(1-k),lerp(3.2,FL[1],k),FL[2]+Math.cos(k*5)*0.2*(1-k)];
      items.push({mesh:SFLAKE,M:M4.trs(p,t*0.9,lerp(0.5,1.5,k)+Math.sin(t*2)*0.25*(1-k),0,0.3),alpha:clamp((t-EV.dot5)/0.4,0,1),noShadow:true});QPTS.push({p,c:'190,235,255',r:0.35,a:0.55})}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=-0.35;if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.012;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0.1;
      if(t<EV.fall5){const sq=easeOut(clamp(k/0.25,0,1));pose='squash';Rm=M4.trs([0,-0.1*sq,0],0,0,Math.sin(k*14)*0.03,[1,1-0.12*sq,1]);o.flail=1}
      else{const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      items.push({mesh:SFLAKE,M:M4.mul(Rm,M4.trs(FL,0.4,1.5,0,0.3)),noShadow:true});QPTS.push({p:[FL[0]-0.3*(t>=EV.fall5?1:0),FL[1]-0.3*(t>=EV.fall5?1:0),FL[2]],c:'190,235,255',r:0.3,a:0.4});
      if(k<0.6)burst(items,FL,k,10,191,0.4,[0.9,0.97,1],2.0);
      if(t>=EV.fall5+0.35&&t<EV.fall5+1.4){const kk=t-EV.fall5-0.35;puff(items,[-0.4,0.02,0.2],kk,6,0.5,[0.95,0.97,1],0.5)}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sjD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.2,EV.res1+1.8,EV.res2+1.6,EV.res3+1.6,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  items.push(...antItems(Rm,o));
  return items}
