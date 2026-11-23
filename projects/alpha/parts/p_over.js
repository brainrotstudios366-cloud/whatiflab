// ---------- overlays ----------
function calendar(tt){if(tt<EV.dot5||tt>=EV.res5+0.5)return;const a=ease((tt-EV.dot5)/0.3)*(1-ease((tt-EV.res5)/0.5));const k=clamp((tt-EV.look5+0.6)/(EV.hit5-EV.look5+0.4),0,1);
  const yr=Math.floor(2026+21*easeIn(k)*0.15+21*k*0.85);const flip=(tt*(2+18*k))%1;const pop=tt-EV.dot5<0.25?0.6+0.4*easeOut((tt-EV.dot5)/0.25):1;
  ctx.save();ctx.globalAlpha=a;ctx.translate(W/2+270,750);ctx.scale(pop,pop);ctx.rotate(0.06);
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=24;ctx.fillStyle='#fdfbf6';rrect(-150,-150,300,300,28);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#e8344a';rrect(-150,-150,300,92,28);ctx.fill();ctx.fillRect(-150,-90,300,32);
  for(const s of[-1,1]){ctx.fillStyle='#555';rrect(s*80-9,-172,18,52,9);ctx.fill()}
  txt('YEAR',0,-104,40,'#ffffff','center',900,false);txt(String(yr),0,40,96,'#1a1424','center',900,false);
  if(k>0&&k<1){ctx.globalAlpha=a*(1-flip)*0.8;ctx.fillStyle='#ffffff';ctx.save();ctx.scale(1,1-flip);rrect(-150,-58,300,200,20);ctx.fill();ctx.restore()}
  ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||700,q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  ctx.restore();
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.25,0.25,'220,170,255');flash(EV.h1,0.25,0.25,'220,170,255');flash(EV.hit1,0.6,0.5,'235,210,255');flash(EV.hit2,0.4,0.3,'170,245,255');flash(EV.boom2,0.35,0.3,'170,245,255');flash(EV.c4,0.9,1.2,'240,230,255');flash(EV.hit5,0.25,0.3);flash(EV.fall5+0.35,0.3,0.25);
  if(rn===3&&tt>=EV.c4&&tt<EV.c4+2.4)glitchFx(0.6*(1-(tt-EV.c4)/2.4));
  calendar(tt);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
