// 2D driving rain (slanted by the wind)
function rain2D(tt){const r=rainAt(tt);if(r<=0.01)return;const wd=windAt(tt);const sl=0.25+wd*0.9;const n=Math.round(230*r);ctx.save();ctx.lineCap='round';
  for(let i=0;i<n;i++){const sp=2600+hsh(i,2)*1600;const len=70+hsh(i,3)*90;const y=((hsh(i,4)*(H+400)+tt*sp)%(H+400))-200;const x0=hsh(i,5)*(W+800)-400;const xx=(((x0+y*sl*0.55)%(W+800))+(W+800))%(W+800)-400;const a=(0.12+0.22*hsh(i,6))*r;ctx.strokeStyle=`rgba(210,225,245,${a})`;ctx.lineWidth=hsh(i,7)>0.85?4:2.2;ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx-len*sl*0.55,y-len);ctx.stroke()}
  ctx.restore()}
// 2D lightning bolts in the distant sky
function bolt2D(x0,y0,x1,y1,seed,a){const P=[[x0,y0]];const n=12;for(let i=1;i<=n;i++){const f=i/n;P.push([lerp(x0,x1,f)+(hsh(i,seed)-0.5)*90*(i<n?1:0),lerp(y0,y1,f)])}
  ctx.save();ctx.globalCompositeOperation='screen';ctx.lineJoin='round';ctx.lineCap='round';
  for(const [w,c] of [[26,`rgba(120,150,255,${0.25*a})`],[10,`rgba(190,210,255,${0.6*a})`],[3.5,`rgba(255,255,255,${a})`]]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(const p of P)ctx.lineTo(p[0],p[1]);ctx.stroke();
    // one branch
    ctx.beginPath();const b=P[5];ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]+(hsh(1,seed+3)-0.5)*260,b[1]+110);ctx.lineTo(b[0]+(hsh(2,seed+3)-0.5)*340,b[1]+230);ctx.lineWidth=w*0.6;ctx.stroke()}
  ctx.restore();glowAt([x0,y0+60],380,'170,190,255',0.35*a)}
function bolts2D(tt){if(tt>=R[3])return;for(let i=0;i<BOLTS.length;i++){const b=BOLTS[i];const k=tt-b;if(k<0||k>0.3)continue;const a=k<0.06?1:(k<0.1?0.2:0.8*(1-(k-0.1)/0.2));const x=W*(0.15+hsh(i,41)*0.7);bolt2D(x,-20,x+(hsh(i,42)-0.5)*200,H*(0.38+hsh(i,43)*0.12),50+i*7,a)}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  bolts2D(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||(q.sun?1100:700),q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  ctx.restore();
  rain2D(tt);
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${rn>=3?0.3:0.45})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.35,0.3,'230,235,255');flash(EV.h1,0.3,0.3,'230,235,255');flash(EV.hit2,0.35,0.5,'200,230,255');flash(EV.hit3,0.4,0.5,'225,235,255');flash(EV.fall5+0.35,0.3,0.25);
  for(const b of BOLTS)if(tt<R[3])flash(b,0.22,0.25,'200,215,255');
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
