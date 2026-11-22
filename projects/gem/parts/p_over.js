// 2D meteor streaks radiating from Gemini (upper left of frame)
function meteors2D(tt){let rate=0;const rn=roundAt(tt);
  if(tt<R[4]+0.8)rate=1.3;if(tt<R[0])rate=3;if(rn===2&&tt>=EV.b3-0.3&&tt<R[3]-0.3)rate=lerp(1.3,18,ease((tt-EV.b3+0.3)/1.5));if(rn===1&&tt>=EV.hit2-0.2&&tt<EV.hit2+1.5)rate=0.3;if(rn===4)rate=1.3*(1-ease((tt-R[4])/0.8));
  if(rate<=0.01)return;const RX=W*0.18,RY=-H*0.05;ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';
  const i0=Math.floor((tt-1.2)*10),i1=Math.floor(tt*10);
  for(let ii=i0*2;ii<=i1*2+1;ii++){const i=ii;if(hsh(ii,91)*20>rate)continue;const t0=i/20+hsh(i,92)*0.05,d=0.35+hsh(i,93)*0.45;const k=(tt-t0)/d;if(k<0||k>1)continue;
    const ang=0.35+hsh(i,94)*1.15;const r0=200+hsh(i,95)*900;const len=260+hsh(i,96)*520;const dx=Math.cos(ang),dy=Math.sin(ang);
    const hx_=RX+dx*(r0+len*k),hy=RY+dy*(r0+len*k);if(hy>H*0.62)continue;const tl=Math.min(len*k,320+len*0.45);const a=Math.sin(k*Math.PI)*(0.55+0.45*hsh(i,97));
    const g=ctx.createLinearGradient(hx_,hy,hx_-dx*tl,hy-dy*tl);const big=hsh(i,98)>0.85;g.addColorStop(0,`rgba(255,250,${big?200:235},${a})`);g.addColorStop(0.3,`rgba(255,225,140,${a*0.6})`);g.addColorStop(1,'rgba(255,160,80,0)');
    ctx.strokeStyle=g;ctx.lineWidth=big?10:5.5;ctx.beginPath();ctx.moveTo(hx_,hy);ctx.lineTo(hx_-dx*tl,hy-dy*tl);ctx.stroke();glowAt([hx_,hy],big?40:18,'255,245,210',a*0.8)}
  ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  meteors2D(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||(q.sun?1100:700),q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  ctx.restore();
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.5,0.3,'255,230,170');flash(EV.h1,0.45,0.3,'255,220,160');flash(EV.hit1,0.6,0.5,'255,245,210');flash(EV.hit2,0.7,0.9,'210,255,200');flash(EV.boom2,0.3,0.3);flash(EV.c4,0.25,0.4,'255,140,80');flash(EV.hit5,0.35,0.3,'210,230,255');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
