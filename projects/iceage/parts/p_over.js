// 2D falling snow (drifts with the blizzard wind)
function snow2D(tt){const r=snowAt(tt);if(r<=0.01)return;const wd=windAt(tt);const n=Math.round(320*r);ctx.save();
  for(let i=0;i<n;i++){const z=hsh(i,9);const sp=(120+z*420)*(1+wd*1.5);const sz=1.5+z*z*7;const y=((hsh(i,4)*(H+200)+tt*sp)%(H+200))-100;const x0=hsh(i,5)*(W+600)-300;const sway=Math.sin(tt*(0.8+z)+i)*30*(1-wd);
    const xx=((((x0-tt*sp*wd*1.6+sway)%(W+600))+(W+600))%(W+600))-300;const a=(0.35+0.5*z)*Math.min(1,r*1.5);
    if(wd>0.5&&z>0.4){ctx.strokeStyle=`rgba(255,255,255,${a*0.8})`;ctx.lineWidth=sz*0.8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx+sp*wd*0.05,y-sp*0.03);ctx.stroke()}
    else{ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.beginPath();ctx.arc(xx,y,sz,0,TAU2);ctx.fill()}}
  ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||(q.sun?1100:700),q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  ctx.restore();
  snow2D(tt);
  // frost vignette while frozen
  if(rn===0){const fk=ease((tt-EV.e1-0.6)/2.5)*(1-ease((tt-EV.crk1)/1.0));if(fk>0){const g=ctx.createRadialGradient(W/2,H*0.5,H*0.25,W/2,H*0.5,H*0.75);g.addColorStop(0,'rgba(200,235,255,0)');g.addColorStop(1,`rgba(200,235,255,${0.55*fk})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${rn>=2?0.32:0.4})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.35,0.3,'220,240,255');flash(EV.h1,0.3,0.3,'220,240,255');flash(EV.hit1,0.45,0.5,'200,235,255');flash(EV.crk1,0.4,0.35,'230,245,255');flash(EV.hit2,0.6,0.6,'245,250,255');flash(EV.hit3,0.35,0.4,'255,255,255');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
