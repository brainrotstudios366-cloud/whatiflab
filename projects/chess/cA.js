// ================= animation =================
function hop(t,t0,d,a,b,h,an){an=an==null?0.14:an;if(t<t0-an)return{p:a.slice(),sq:0};if(t<t0)return{p:a.slice(),sq:0.16*ease((t-t0+an)/Math.max(an,1e-3))};
  if(t<t0+d){const k=(t-t0)/d;const p=lerp3(a,b,k);p[1]+=4*h*k*(1-k);return{p,sq:-0.12*Math.sin(Math.PI*k)*(h>0.2?1:0.3),air:k}}
  const k=t-t0-d;return{p:b.slice(),sq:0.2*Math.exp(-k*9)*Math.cos(k*22)*(h>0.2?1:0.4),landed:k}}
function seq(t,start,moves){let st={p:start.slice(),sq:0};let cur=start;for(const mv of moves){const[t0,d,to,h,an]=mv;if(t>=t0-(an==null?0.14:an))st=hop(t,t0,d,cur,to,h,an);else break;cur=to}return st}
const faceYaw=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
function lookAt(st,kind,tgt){const e=EYE[kind];const h=[st.pos[0],st.pos[1]+e[0],st.pos[2]];const d=V.norm(V.sub(tgt,h));const y=st.yaw||0;const lx=d[0]*Math.cos(y)-d[2]*Math.sin(y);return[clamp(lx*1.3,-1,1),clamp(d[1]*1.5,-1,1)]}
function flyer(p0,v,g,k,piv){return[p0[0]+v[0]*k,p0[1]+piv+v[1]*k-0.5*g*k*k,p0[2]+v[2]*k]}
const S_=sq;
// ---- squares
const KP=[S_(2,8),S_(3,6),S_(5,7),S_(7,6),S_(8,4),S_(6,5)];
const BP=[S_(8,8),S_(5,5),S_(8,2),S_(4,6),S_(1,3),S_(6,8),S_(4,6)];const BD=[0.45,0.3,0.33,0.25,0.3,0.25];const BEDGE=[9.4,0,-7.4];
const QB=[[40.95,S_(5,5)],[41.5,S_(6,6)],[42.15,S_(5,6)],[42.7,S_(3,6)],[43.9,S_(5,7)]];
function rookX(t){if(t<EV.charge)return 7;if(t<EV.slow0)return 7-6*Math.pow((t-EV.charge)/(EV.slow0-EV.charge),2);if(t<EV.slow1)return 1-3.5*(t-EV.slow0)/(EV.slow1-EV.slow0);
  if(t<EV.redge)return -2.5-6.9*(t-EV.slow1)/(EV.redge-EV.slow1);return -9.4-20*(t-EV.redge)}
// ---- per-piece states for time t; returns list of {kind,white,st}
let HERO=null,STATE=null;
function piecesAt(t){const rn=roundAt(t);const P=[];const breath=0.012*Math.sin(t*3.1);
  const hero={kind:'pawn',white:true,st:{pos:S_(5,4),yaw:0,sq:breath,eyes:{lid:0.15}}};
  if(rn<0){hero.st.pos=S_(5,2);const L=[['knight',S_(6,6)],['bishop',S_(5,6)],['rook',S_(4,6)],['queen',S_(3,6)]];
    for(const[k,p]of L){const ph=t*3+p[0];P.push({kind:k,white:false,st:{pos:p,yaw:Math.PI,sq:0.02*Math.sin(ph),eyes:{lid:0.25,brow:0.45,look:lookAt({pos:p,yaw:Math.PI},k,[1,1.1,-5])}}})}
    hero.st.eyes={lid:0.3,brow:0.25,look:[0,0.2]}}
  if(rn===0){const moves=EV.kh.map((t0,i)=>[t0,0.5,KP[i+1],1.6]);let kn;
    const hs=seq(t,S_(5,4),[[EV.cap1,0.45,S_(6,5),0.9]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;
    if(t<EV.hit1){const s=seq(t,KP[0],moves);kn={kind:'knight',white:false,st:{pos:s.p,sq:s.sq,yaw:faceYaw(s.p,hero.st.pos),eyes:{lid:0.2,brow:0.5}}};
      if(t>EV.kland+0.1&&t<EV.cap1){const k=t-EV.kland;kn.st.sq+=0.06*Math.abs(Math.sin(k*14));kn.st.rz=0.08*Math.sin(k*9);kn.st.eyes={lid:0.45,brow:0.2,mouth:'grin'}}
      if(t>=EV.cap1){kn.st.eyes={lid:0,brow:-0.4,tiny:1,mouth:'o'}}kn.st.eyes.look=lookAt(kn.st,'knight',V.add(hero.st.pos,[0,1,0]))}
    else{const k=t-EV.hit1;kn={kind:'knight',white:false,st:{pos:flyer(S_(6,5),[10,13,11],3.5,k,0.95),piv:0.95,yaw:0.6,rx:k*8,rz:k*5,eyes:{x:1}}}}
    if(t<EV.hit1+3.2)P.push(kn);
    hero.st.eyes={lid:0.15,look:lookAt(hero.st,'pawn',V.add(kn.st.pos,[0,1.4,0]))};
    if(t>=EV.squint&&t<EV.hit1+1.5)Object.assign(hero.st.eyes,{lid:0.4,brow:0.32});if(t>=EV.hit1+1.5)Object.assign(hero.st.eyes,{lid:0.3,brow:-0.15,mouth:'smirk',look:[0.3,0.1]})}
  if(rn===1){let bs,yaw=0;const mv=EV.bz.map((t0,i)=>[t0,BD[i],BP[i+1],0.03,0.06]);
    if(t<EV.bfly)bs=seq(t,BP[0],mv);else if(t<EV.bfall)bs=hop(t,EV.bfly,EV.bfall-EV.bfly,BP[6],BEDGE,0.03,0.08);
    const b={kind:'bishop',white:false,st:{pos:null,sq:0,eyes:{lid:0.15,brow:0.5}}};
    if(t<EV.bfall){b.st.pos=bs.p;b.st.sq=bs.sq;b.st.yaw=faceYaw(bs.p,hero.st.pos);if(bs.air!=null&&t>=EV.bfly)b.st.yaw=faceYaw(BP[6],BEDGE);if(bs.air!=null)b.st.rx=0.18}
    else{const k=t-EV.bfall;b.st.pos=flyer(BEDGE,[9,1.5,-9],14,k,1.1);b.st.piv=1.1;b.st.yaw=faceYaw(BP[6],BEDGE);b.st.rx=0.3+k*4;b.st.eyes={lid:0,tiny:1,mouth:'o',brow:-0.5}}
    if(t>=EV.rage&&t<EV.bfly){const k=t-EV.rage;b.st.rz=0.035*Math.sin(k*70);b.st.eyes={lid:0.1,brow:0.75,browY:-0.02};b.st.sq=0.03*Math.sin(k*40)}
    b.st.eyes.look=b.st.eyes.look||lookAt(b.st,'bishop',V.add(hero.st.pos,[0,1,0]));b.trail=t>=EV.bz[0]-0.05&&t<EV.bfall;
    if(t<EV.bfall+2.5)P.push(b);
    hero.st.eyes={lid:0.42,look:lookAt(hero.st,'pawn',V.add(b.st.pos,[0,1.6,0]))};if(t>=EV.rage+0.3)Object.assign(hero.st.eyes,{mouth:'smirk',brow:-0.1})}
  if(rn===2){const hs=seq(t,S_(4,2),[[EV.dstep,0.6,S_(4,4),1.2,0.1]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;
    const r={kind:'rook',white:false,st:{pos:[7,0,-5],yaw:-Math.PI/2,sq:0,eyes:{lid:0.1,brow:0.6}}};
    if(t<EV.rland){const k=(t-EV.rdrop)/(EV.rland-EV.rdrop);r.st.pos=[7,30*(1-k*k),-5];r.st.sq=-0.12}
    else if(t<EV.charge){const k=t-EV.rland;r.st.sq=0.25*Math.exp(-k*8)*Math.cos(k*20);for(const s of[EV.snort1,EV.snort2]){const q=t-s;if(q>-0.15&&q<0.4)r.st.sq+=q<0?0.12*(q+0.15)/0.15:0.12*Math.exp(-q*10)*Math.cos(q*25)}
      if(t>EV.snort2+0.3){r.st.rx=0.12*ease((t-EV.snort2-0.3)/0.5)}}
    else{const x=rookX(t);r.st.pos=[x,0,-5];r.st.rx=0.22+0.04*Math.sin(t*30);r.st.sq=0.03*Math.sin(t*38);if(t>=EV.redge){const k=t-EV.redge;r.st.pos=[x,1.0-4.9*1.8*k*k,-5];r.st.piv=1.0;r.st.rx=0.22+k*2.5;r.st.eyes={lid:0,tiny:1,mouth:'o',brow:-0.5}}}
    r.st.eyes.look=lookAt(r.st,'rook',V.add(hero.st.pos,[0,1,0]));if(t<EV.rboom)P.push(r);r.dust=t>=EV.charge&&t<EV.redge;
    hero.st.eyes={lid:0.2,look:lookAt(hero.st,'pawn',V.add(r.st.pos,[0,1.2,0]))};
    if(t>=EV.slow0-0.3&&t<EV.dstep+0.3)Object.assign(hero.st.eyes,{lid:0,tiny:1,mouth:'o'});
    if(t>=EV.dstep+0.45){hero.st.sg=0.6*(1-ease((t-EV.dstep-0.45)/0.22));hero.st.eyes={lid:0.2,mouth:'smirk'}}}
  if(rn===3){const hs=seq(t,S_(5,5),[[EV.qs1,0.4,S_(5,6),0.8],[EV.qs2,0.4,S_(5,7),0.8],[EV.qcap,0.45,S_(4,8),1.4]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;
    const q={kind:'queen',white:false,st:{pos:S_(4,8),yaw:Math.PI,sq:0.015*Math.sin(t*2.6),eyes:{lid:0.2,brow:0.45}}};
    if(t<EV.qland){const k=(t-EV.qdesc)/(EV.qland-EV.qdesc);q.st.pos=V.add(S_(4,8),[0,14*(1-k*k),0]);q.st.sq=-0.1}
    else if(t<EV.qhit){const k=t-EV.qland;q.st.sq+=0.22*Math.exp(-k*8)*Math.cos(k*20);if(t>=39.8)q.st.eyes={lid:0.1,brow:0.55,glow:1};
      if(t>=EV.qcharge&&t<EV.qhit){const c=t-EV.qcharge;q.st.sq=-0.08*ease(c/0.4)+0.02*Math.sin(c*50)}q.st.yaw=faceYaw(q.st.pos,hero.st.pos)}
    else{const k=t-EV.qhit;q.st.pos=flyer(S_(4,8),[-8,14,10],4,k,1.3);q.st.piv=1.3;q.st.rx=-k*7;q.st.rz=k*4;q.st.eyes={x:1}}
    if(t<EV.qhit)q.st.eyes.look=lookAt(q.st,'queen',V.add(hero.st.pos,[0,1,0]));q.aura=t<EV.qhit;if(t<EV.qhit+3.2)P.push(q);
    hero.st.eyes={lid:0.12,brow:0.25,look:lookAt(hero.st,'pawn',V.add(S_(4,8),[0,2,0]))};if(t>=EV.qs1-0.2&&t<EV.qcap)hero.st.eyes.mouth='o';
    if(t>=EV.qhit){hero.st.eyes={lid:0.2,brow:-0.1,look:[0,0.3]}}
    if(t>=EV.promo){hero.kind='queen';const k=t-EV.promo;hero.st.sc=1+0.25*Math.exp(-k*6)*Math.cos(k*14);hero.st.yaw=0;hero.st.eyes={lid:0.22,brow:0.1,mouth:'smirk',look:[0,0.1]}}
    else if(t>=EV.promo0){const k=(t-EV.promo0)/(EV.promo-EV.promo0);hero.st.pos=V.add(S_(4,8),[0,0.6*ease(k),0]);hero.st.rx=0;hero.st.yaw=k*k*TAU2*2;hero.st.eyes={lid:1}}}
  if(rn>=4){const hs=seq(t,S_(5,2),[[EV.dstep2,0.55,S_(5,4),1.0]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;hero.st.eyes={lid:0.3,look:[0,0.1]};
    if(t>=EV.dstep2-0.6){hero.st.sg=0.5*(1-ease((t-EV.dstep2+0.6)/0.2));hero.st.eyes.mouth='smirk'}
    const bp={kind:'pawn',white:false,st:{pos:S_(4,4),yaw:Math.PI,sq:breath*0.7,eyes:{lid:1,brow:0}}};
    if(t>=EV.wake)bp.st.eyes={lid:clamp(1-(t-EV.wake)/0.15,0,1),brow:0.2,look:[0,0]};
    if(t>=EV.turn){bp.st.yaw=lerp(Math.PI,Math.PI/2,ease((t-EV.turn)/0.3));bp.st.eyes={lid:0.15,brow:0.55,look:[0,0]}}
    if(t>=EV.boss){bp.st.eyes.mouth='grin';bp.st.sq+=0.02*Math.sin(t*30)*(t<EV.ep?1:0)}
    if(t>=EV.ep-0.14){const s=hop(t,EV.ep,0.4,S_(4,4),S_(5,3),0.9);bp.st.pos=s.p;bp.st.sq=s.sq;bp.st.yaw=Math.PI/2}
    if(t>=EV.ephit+0.5)bp.st.eyes={lid:0.35,brow:0.3,mouth:'smirk',look:lookAt(bp.st,'pawn',[8,0.5,-0.6])};
    P.push(bp);
    if(t>=EV.wake&&t<EV.ephit)hero.st.eyes.look=[-0.6,0];
    if(t>=EV.boss-0.2&&t<EV.ephit){hero.st.eyes={lid:0,tiny:1,look:[-0.8,0]};hero.st.sg=null}
    if(t>=EV.ephit){const k=Math.min(t,EV.koland)-EV.ephit,K=EV.koland-EV.ephit;const kk=k/K;const a=[1,0.69,-1],b=[8.2,0.64,-0.6];const p=lerp3(a,b,kk);p[1]+=4*2.0*kk*(1-kk);
      hero.st.pos=p;hero.st.piv=0.69;hero.st.rz=-(Math.PI/2+TAU2)*easeOut(kk)*(kk<1?1:1);hero.st.rx=0.3*Math.sin(kk*Math.PI);hero.st.sq=0;hero.st.sg=null;hero.st.eyes={lid:0,tiny:1,mouth:'o'};
      if(t>=EV.koland){const q=t-EV.koland;hero.st.pos=V.add(b,[0,0.06*Math.exp(-q*8)*Math.abs(Math.cos(q*20)),0]);hero.st.rz=-Math.PI/2;hero.st.rx=0;hero.st.eyes={x:1,mouth:'o'}}}}
  P.unshift(hero);HERO=hero;STATE=P;return P}
// ---- highlights
const YEL=[0.96,0.93,0.35],RED=[0.95,0.22,0.2],BLU=[0.3,0.6,1.0],GLD=[1,0.85,0.35];
function hl(items,p,col,a){if(a<=0.01)return;items.push({mesh:SQ,M:M4.trs([p[0],0.015,p[2]],0,0,0,[Q*0.97,1,Q*0.97]),tint:col,tintAmt:1,alpha:a*0.55,noShadow:true})}
function highlights(items,t){const rn=roundAt(t);const fade=(t0,t1)=>clamp((t-t0)/0.12,0,1)*clamp((t1-t)/0.15,0,1);
  if(rn===0){for(let i=0;i<5;i++){const t1=i<4?EV.kh[i+1]:EV.cap1;const a=fade(EV.kh[i],t1);hl(items,KP[i],YEL,a);hl(items,KP[i+1],YEL,a)}
    hl(items,S_(6,5),RED,fade(EV.squint,EV.cap1)*(0.7+0.3*Math.sin(t*20)));const a=fade(EV.cap1+0.1,R[1]);hl(items,S_(5,4),YEL,a);hl(items,S_(6,5),YEL,a)}
  if(rn===1){for(let i=0;i<6;i++){const t1=i<5?EV.bz[i+1]:EV.bfly;const a=fade(EV.bz[i],t1);hl(items,BP[i],YEL,a);hl(items,BP[i+1],YEL,a)}
    const d=fade(EV.rage+0.05,EV.bfly-0.1);if(d>0)for(let f=1;f<=8;f++)for(let r=1;r<=8;r++)if(!isLight(f,r))hl(items,S_(f,r),BLU,d*(0.55+0.25*Math.sin(t*9+(f+r)*0.5)));
    if(d>0)hl(items,S_(5,4),[0.35,1,0.45],d*0.9)}
  if(rn===2){const a=fade(EV.snort2-0.2,EV.slow1+0.2);for(let f=1;f<=8;f++)hl(items,S_(f,2),RED,a*(0.6+0.3*Math.sin(t*14-f*0.8)));const b=fade(EV.dstep+0.6,R[3]);hl(items,S_(4,2),YEL,b);hl(items,S_(4,4),YEL,b)}
  if(rn===3){for(const[tb,p]of QB)hl(items,p,RED,fade(tb-0.35,tb+0.5)*(0.6+0.4*Math.sin(t*25)));const a=fade(EV.qcap+0.3,R[4]);hl(items,S_(5,7),YEL,a);hl(items,S_(4,8),t>=EV.promo0&&t<EV.promo+1?GLD:YEL,a)}
  if(rn>=4){const a=fade(EV.dstep2+0.5,EV.ep);hl(items,S_(5,2),YEL,a);hl(items,S_(5,4),YEL,a);const b=fade(EV.ep+0.4,99);hl(items,S_(4,4),YEL,b);hl(items,S_(5,3),YEL,b);hl(items,S_(5,4),RED,fade(EV.ephit,99))}}
// ---- effects
function dust(items,p,k,s,col,a0){if(k<0||k>0.7)return;const r=s*(0.6+2.2*easeOut(k/0.7));items.push({mesh:DUSTRING,M:M4.trs([p[0],p[1]+0.02,p[2]],0,0,0,[r,0.35*s,r]),tint:col||null,tintAmt:col?0.6:0,alpha:(a0||0.6)*(1-k/0.7),noShadow:true})}
function effects(items,t){const rn=roundAt(t);
  if(rn===0){EV.kh.forEach((t0,i)=>dust(items,KP[i+1],t-t0-0.5,0.8));dust(items,S_(6,5),t-EV.cap1-0.45,0.7);
    {const k=t-EV.hit1;if(k>=0&&k<0.5)for(let j=0;j<8;j++){const a=j/8*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(S_(6,5),[Math.cos(a)*k*5,1.2+Math.sin(a)*k*4,0.3]),0,0,0,0.12*(1-k/0.5)),tint:[1,0.9,0.5],tintAmt:1,alpha:0.9,add:1,noShadow:true})}}}
  if(rn===1){EV.bz.forEach((t0,i)=>dust(items,BP[i+1],t-t0-BD[i],0.5,null,0.4))}
  if(rn===2){dust(items,[7,0,-5],t-EV.rland,2.0,null,0.8);dust(items,S_(4,4),t-EV.dstep-0.6,0.7);
    for(const s of[EV.snort1,EV.snort2]){const k=t-s;if(k>=0&&k<1.2)for(let j=0;j<4;j++){const a=j*1.6;items.push({mesh:PUFF,M:M4.trs([7+Math.cos(a)*0.3,2.0+k*1.6+j*0.1,-5+Math.sin(a)*0.3],j,0,0,0.18+k*0.4),tint:[1,1,1],tintAmt:0.5,alpha:0.7*(1-k/1.2),noShadow:true})}}
    if(t>=EV.charge&&t<EV.redge+0.3){for(let j=0;j<10;j++){const tj=t-j*0.07;if(tj<EV.charge)break;const x=rookX(tj)+0.9;const k=j*0.07;items.push({mesh:PUFF,M:M4.trs([x+k*1.5,0.3+k*0.8,-5+Math.sin(j*2.1)*0.5],j,0,0,0.3+k*1.2),tint:[0.85,0.8,0.75],tintAmt:0.5,alpha:0.6*(1-j/10),noShadow:true})}}
    if(t>=EV.rboom-0.05)fireball(items,[-48,-34,-5],t-EV.rboom,8)}
  if(rn===3){dust(items,S_(4,8),t-EV.qland,1.8,[0.6,0.3,0.9],0.8);[EV.qs1+0.4,EV.qs2+0.4].forEach(tt=>dust(items,[1,0,tt<42?3:5],t-tt,0.6));
    const Q_=STATE.find(p=>p.kind==='queen'&&!p.white);
    if(Q_&&Q_.aura&&t>=EV.qland){const c=V.add(Q_.st.pos,[0,1.5,0]);const pl=0.8+0.2*Math.sin(t*6);items.push({mesh:UEMIS,M:M4.trs(c,0,0,0,[1.4,2.0,1.4]),tint:[0.55,0.2,0.9],tintAmt:1,alpha:0.13*pl,add:1,noShadow:true});
      const rr=1.3+0.15*Math.sin(t*4);items.push({mesh:DUSTRING,M:M4.trs([c[0],0.05,c[2]],t*0.5,0,0,[rr,0.25,rr]),tint:[0.7,0.35,1],tintAmt:1,alpha:0.35,add:1,noShadow:true});
      if(t>=EV.qcharge){const c2=V.add(Q_.st.pos,[0,2.3,0.25]);items.push({mesh:UEMIS,M:M4.trs(c2,0,0,0,0.15+0.5*ease((t-EV.qcharge)/0.6)),tint:[1,0.3,0.25],tintAmt:1,alpha:0.6,add:1,noShadow:true})}}
    for(const[tb,p]of QB){const k=t-tb;const src=V.add(S_(4,8),[0,2.1,0.3]);if(k>=0&&k<0.3&&tb<EV.qhit){const tg=[p[0],0.1,p[2]];const w=0.09*(1-k/0.3)+0.03;items.push({mesh:BEAM,M:segM(src,tg,w),tint:[1,0.25,0.2],tintAmt:1,alpha:0.95,add:1,noShadow:true});items.push({mesh:BEAM,M:segM(src,tg,w*3),tint:[1,0.4,0.3],tintAmt:1,alpha:0.3,add:1,noShadow:true})}
      if(k>=0.03&&k<2.2)fireball(items,[p[0],0,p[2]],k-0.03,0.55);if(k>=0.2)items.push({mesh:DISC2,M:M4.trs([p[0],0.02,p[2]],0,0,0,0.8),tint:[0.08,0.06,0.06],tintAmt:1,alpha:0.55,noShadow:true})}
    {const k=t-EV.qhit;if(k>=0&&k<0.5)for(let j=0;j<10;j++){const a=j/10*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(S_(4,8),[Math.cos(a)*k*6,1.6+Math.sin(a)*k*5,0]),0,0,0,0.14*(1-k/0.5)),tint:[1,0.85,0.5],tintAmt:1,alpha:0.9,add:1,noShadow:true})}}
    if(t>=EV.promo0){const k=t-EV.promo0;const a=clamp(k/0.3,0,1)*clamp((EV.promo+1.4-t)/0.8,0,1);const p=S_(4,8);if(a>0){items.push({mesh:BEAM,M:segM([p[0],0,p[2]],[p[0],60,p[2]],1.1+0.1*Math.sin(t*20)),tint:[1,0.92,0.6],tintAmt:1,alpha:0.18*a,add:1,noShadow:true});
      items.push({mesh:BEAM,M:segM([p[0],0,p[2]],[p[0],60,p[2]],0.45),tint:[1,1,0.9],tintAmt:1,alpha:0.3*a,add:1,noShadow:true});
      for(let j=0;j<26;j++){const ph=(k*0.9+hsh(j,1))%1;const ang=j*2.4+k*3;const r=0.6+hsh(j,2)*1.0;items.push({mesh:UEMIS,M:M4.trs([p[0]+Math.cos(ang)*r,ph*5,p[2]+Math.sin(ang)*r],0,0,0,0.05+0.05*hsh(j,3)),tint:[1,0.9,0.5],tintAmt:1,alpha:a*(1-ph),add:1,noShadow:true})}}
      const r2=t-EV.promo;if(r2>=0&&r2<0.9){const rr=0.5+9*easeOut(r2/0.9);items.push({mesh:DUSTRING,M:M4.trs([p[0],0.1,p[2]],0,0,0,[rr,0.3,rr]),tint:[1,0.9,0.5],tintAmt:1,alpha:0.7*(1-r2/0.9),add:1,noShadow:true})}
      if(t>=EV.promo){items.push({mesh:UEMIS,M:M4.trs(V.add(p,[0,1.6,0]),0,0,0,[1.3,2.1,1.3]),tint:[1,0.85,0.4],tintAmt:1,alpha:0.05+0.02*Math.sin(t*5),add:1,noShadow:true})}}}
  if(rn>=4){dust(items,S_(5,4),t-EV.dstep2-0.55,0.7);dust(items,S_(5,3),t-EV.ep-0.4,0.7);dust(items,[8.2,0,-0.6],t-EV.koland,0.9);
    {const k=t-EV.ephit;if(k>=0&&k<0.5)for(let j=0;j<10;j++){const a=j/10*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(S_(5,4),[Math.cos(a)*k*5,0.9+Math.sin(a)*k*4,0]),0,0,0,0.13*(1-k/0.5)),tint:[1,0.9,0.5],tintAmt:1,alpha:0.9,add:1,noShadow:true})}}
    if(t>=EV.ephit){const k=Math.min(t-EV.ephit,1.4);const p=[1+3.0*k,1.15+3.2*k-4.9*k*k,-0.6-1.6*k];if(p[1]<0.03)p[1]=0.03;items.push({mesh:SGLASS,M:M4.trs(p,k*9,k<1.3?k*6:0,k<1.3?k*4:0,1),noShadow:true})}}}
// ---- scene
let LASTVP=null;
function fgItems(t){const items=[{mesh:BOARD},{mesh:CLOUDSEA},{mesh:ISLES}];const P=piecesAt(t);
  for(const pc of P){pc.M=pieceItems(pc.kind,pc.white,pc.st,items);
    if(pc.trail){const H0=HERO,S0=STATE;for(let i=1;i<=6;i++){const tt=t-i*0.03;if(tt<R[1])break;const P2=piecesAt(tt);const b=P2.find(p=>p.kind==='bishop');if(!b||V.len(V.sub(b.st.pos,pc.st.pos))<0.05)continue;pieceItems('bishop',false,Object.assign({},b.st,{alpha:0.28*(1-i/7),add:1,tint:[0.55,0.3,1],tintAmt:1,noShadow:true}),items)}HERO=H0;STATE=S0}}
  highlights(items,t);effects(items,t);return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const c=camAt(tt);const items=fgItems(tt);const hp=HERO.st.pos;
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.05,far:14000},{center:[hp[0],0,hp[2]+1],radius:9},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  EV.kh.forEach(t0=>S(t0+0.5,5,0.25));S(EV.hit1,14,0.45);S(EV.rland,18,0.6);S(EV.snort1,4,0.3);S(EV.snort2,5,0.3);if(t>=EV.charge&&t<EV.redge)a+=3+5*clamp((t-EV.charge)/1,0,1)*(t>=EV.slow0&&t<EV.slow1?0.3:1);
  S(EV.rboom,10,1.2);S(EV.qland,14,0.6);for(const[tb]of QB)S(tb,6,0.35);S(EV.qhit,16,0.5);S(EV.promo,10,0.6);S(EV.ephit,16,0.45);S(EV.koland,9,0.35);return a}
