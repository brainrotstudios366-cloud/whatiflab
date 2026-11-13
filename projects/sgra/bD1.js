function arrowLine(x0,y0,x1,y1,col,w,a){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1+Math.cos(an)*w*1.6,y1+Math.sin(an)*w*1.6);ctx.lineTo(x1+Math.cos(an+2.4)*w*2.2,y1+Math.sin(an+2.4)*w*2.2);ctx.lineTo(x1+Math.cos(an-2.4)*w*2.2,y1+Math.sin(an-2.4)*w*2.2);ctx.fill();ctx.restore()}
function interiorBG(t,a){ctx.save();const cx=W/2,cy=H*0.42;const g=ctx.createRadialGradient(cx,cy,0,cx,cy,H*0.75);g.addColorStop(0,`rgba(255,120,60,${0.28*a})`);g.addColorStop(0.35,`rgba(140,20,30,${0.22*a})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const r=rngG(11);ctx.lineCap='round';for(let i=0;i<70;i++){const ang=r()*TAU2+t*(0.25+r()*0.3);const ph=(t*(0.25+r()*0.25)+r())%1;const d=H*0.75*(1-ph),ln=60+r()*160;ctx.strokeStyle=`rgba(255,${120+r()*100|0},${80+r()*80|0},${0.35*a*Math.sin(ph*Math.PI)})`;ctx.lineWidth=2+r()*4;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*d,cy+Math.sin(ang)*d);ctx.lineTo(cx+Math.cos(ang+0.08)*(d-ln),cy+Math.sin(ang+0.08)*(d-ln));ctx.stroke()}ctx.restore()}
function bhGlow(t,cm,a){const c=prj([0,0,0]);if(!c)return;const b=camBasisB(cm);const e=prj(V.add(cm.at,[0,0,0])&&V.sc(b.r,1));if(!e)return;const rr=Math.min(900,Math.hypot(e[0]-c[0],e[1]-c[1]));if(!(rr>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],rr,c[0],c[1],rr*3.4);g.addColorStop(0,`rgba(255,200,130,${0.45*a})`);g.addColorStop(0.3,`rgba(255,140,60,${0.22*a})`);g.addColorStop(1,'rgba(255,100,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(c[0],c[1],rr*0.995,0,Math.PI*2,true);ctx.fill('evenodd');ctx.restore()}
function clock(x,y,r,ang,a,col){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.fillStyle='rgba(8,10,30,0.82)';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=6;ctx.stroke();for(let i=0;i<12;i++){const q=i/12*TAU2;ctx.beginPath();ctx.moveTo(Math.cos(q)*r*0.78,Math.sin(q)*r*0.78);ctx.lineTo(Math.cos(q)*r*0.9,Math.sin(q)*r*0.9);ctx.stroke()}
  ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ang-Math.PI/2)*r*0.72,Math.sin(ang-Math.PI/2)*r*0.72);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,10,0,7);ctx.fill();ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  if(S==='galaxy')drawGalaxy(tt);
  if(S==='hook'||S==='end'||S==='disk'||S==='friend'||S==='cross')bhGlow(tt,cm,S==='friend'?0.6:1);
  if(INSIDE.has(S)||S==='wait')interiorBG(tt,S==='wait'?0.7:1);
  // galaxy markers
  if(S==='galaxy'){const k=seg(tt,EV.gal+0.6,EV.gal+1.0);const c=prj([0,0,0]);const rot=tt*0.04;const yr=0.52*26;const ya=[Math.cos(2.2+rot)*yr,0,Math.sin(2.2+rot)*yr];const y=prj(ya);
    if(c){glowAt(c,90,'255,120,60',0.8*k);tag('🕳️ SAGITTARIUS A*',[c[0],c[1]-80],'#ffd84a',k)}
    if(y&&tt>EV.gal+2.2){const k2=seg(tt,EV.gal+2.2,EV.gal+2.6);glowAt(y,50,'255,240,200',k2);tag('☀️ YOU ARE HERE',[y[0],y[1]+70],'#ffffff',k2);if(c&&tt>EV.gal+2.6){const k3=seg(tt,EV.gal+2.6,EV.gal+3.4);ctx.save();ctx.setLineDash([18,14]);ctx.strokeStyle='rgba(90,240,255,0.9)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(y[0],y[1]);ctx.lineTo(lerp(y[0],c[0],k3),lerp(y[1],c[1],k3));ctx.stroke();ctx.restore()}}}
  // size bracket
  if(S==='size'&&tt>EV.size+0.5){const a=seg(tt,EV.size+0.5,EV.size+0.9);const L=prj([-1,1.12,0]),Rr=prj([1,1.12,0]);if(L&&Rr){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='#5af0ff';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(L[0],L[1]+24);ctx.lineTo(L[0],L[1]);ctx.lineTo(Rr[0],Rr[1]);ctx.lineTo(Rr[0],Rr[1]+24);ctx.stroke();ctx.restore()}
    if(tt>EV.suns+0.3){const q=prj([0,-1.6,0.3]);if(q)tag('= 18 × ☀️ side by side',[q[0],q[1]+30],'#ffd84a',seg(tt,EV.suns+1.9,EV.suns+2.3))}}
  // friend tag
  if(S==='friend'&&QR){const q=prj(QR.p);if(q)tag('👀 YOUR FRIEND (far away)',[clamp(q[0],300,W-300),q[1]+QR.s*2600/q[2]+50],'#ffd84a',seg(tt,EV.friend+0.5,EV.friend+0.8));const a=prj([0.05,0.4,1.9]);if(a)tag('YOU 🧑‍🚀',[a[0],a[1]-60],'#ffffff',seg(tt,EV.friend+1.2,EV.friend+1.5))}
  // telescope view + clock
  if(S==='freeze'){const k=seg(tt,EV.freeze,EV.freeze+0.4);bhGlow(tt,cm,1);ctx.save();ctx.fillStyle=`rgba(0,0,0,${0.92*k})`;ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(W/2,H*0.47,470,0,Math.PI*2,true);ctx.fill();ctx.strokeStyle=`rgba(90,240,255,${0.7*k})`;ctx.lineWidth=8;ctx.beginPath();ctx.arc(W/2,H*0.47,470,0,7);ctx.stroke();ctx.restore();
    tag('🔭 WHAT YOUR FRIEND SEES',[W/2,H*0.47-520],'#5af0ff',k);const x=tt-EV.freeze;const ang=x<0?0:(1-Math.exp(-x*0.55))/0.55*4.2;const sl=clamp(1-x/4.5,0,1);clock(W/2+330,H*0.47-300,95,ang,k,sl>0.1?'#ffd84a':'#ff5a8a');
    if(tt>EV.frz)tag('❄️ FROZEN… FOREVER',[W/2,H*0.47+560],'#9fe8ff',seg(tt,EV.frz,EV.frz+0.3))}
  // cross: horizon line
  if(S==='cross'){const k=seg(tt,EV.horiz-0.25,EV.horiz+0.35);if(k>0&&k<1){ctx.save();ctx.globalCompositeOperation='screen';const y=H*(1.1-k*1.2);const g=ctx.createLinearGradient(0,y-160,0,y+160);g.addColorStop(0,'rgba(180,120,255,0)');g.addColorStop(0.5,'rgba(220,180,255,0.75)');g.addColorStop(1,'rgba(180,120,255,0)');ctx.fillStyle=g;ctx.fillRect(0,y-160,W,320);ctx.restore()}
    if(tt>EV.horiz+0.2)tag('✅ crossed the event horizon',[W/2,520],'#7dff9a',seg(tt,EV.horiz+0.2,EV.horiz+0.5));else if(tt>EV.cross+1.0)tag('EVENT HORIZON AHEAD ⬇️',[W/2,520],'#c8a8ff',seg(tt,EV.cross+1,EV.cross+1.3))}
  // calm: tiny stretch arrows
  if(S==='calm'){const a=prj(V.add(inA(tt),[0,0.42,0])),b=prj(V.add(inA(tt),[0,-0.42,0]));const k=seg(tt,EV.calm+0.3,EV.calm+0.6);if(a&&b){arrowLine(a[0],a[1]-60,a[0],a[1]-90,'#7dff9a',8,k);arrowLine(b[0],b[1]+60,b[0],b[1]+90,'#7dff9a',8,k)}}
  // inside: converging arrows
  if(S==='inside'){const k=seg(tt,EV.inside+0.3,EV.inside+0.8);const cx=W/2,cy=H*0.42;const pu=(tt*0.8)%1;for(let i=0;i<12;i++){const an=i/12*TAU2+0.13;const r1=760-pu*120,r0=r1-200;arrowLine(cx+Math.cos(an)*r1,cy+Math.sin(an)*r1,cx+Math.cos(an)*r0,cy+Math.sin(an)*r0,'#ff5a8a',12,k*0.85)}
    glowAt([cx,cy],120,'255,240,220',0.9*k);tag('🚫 NO WAY OUT',[W/2,560],'#ff5a8a',seg(tt,EV.inside+0.6,EV.inside+0.9))}
  // spag labels
  if(S==='spag'&&tt>EV.stretch+0.6){const A=inA(tt);const k=easeIn(seg(tt,EV.stretch,EV.nasa+0.6));const L=0.32*(1+5.5*k)*0.95;const h=prj(V.add(A,[-L,0,0])),f=prj(V.add(A,[L,0,0]));const a=seg(tt,EV.stretch+0.6,EV.stretch+0.9);
    if(h&&f){const dx=f[0]-h[0];arrowLine(f[0]+30,f[1],f[0]+30+Math.sign(dx)*140,f[1],'#ff5a8a',16,a);arrowLine(h[0]-30,h[1],h[0]-30-Math.sign(dx)*70,h[1],'#ffd84a',10,a);tag('FEET 💪 pulled harder',[clamp(f[0],260,W-260),f[1]+110],'#ff5a8a',a);tag('HEAD',[clamp(h[0],120,W-120),h[1]-90],'#ffd84a',a)}}
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  // title
  if(tt<3.3){const a=clamp((3.3-tt)/0.35,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.35?0.7+0.3*easeOut(tt/0.35):1;ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=24;
    ctx.font='900 78px Inter';ctx.fillStyle='#fff';ctx.fillText('What if you fell into',0,-70);ctx.font=`900 ${fitS('SAGITTARIUS A* 🕳️',990,118)}px Inter, "Noto Color Emoji"`;ctx.fillStyle='#ffd84a';ctx.fillText('SAGITTARIUS A* 🕳️',0,45);ctx.restore()}
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4))};
  card(8.2,10.4,'DISTANCE','26,000 LIGHT-YEARS','#5af0ff');card(10.5,EV.size,'MASS','4,000,000 × ☀️','#ffd84a');card(13.4,EV.disk,'EVENT HORIZON','≈ 25 MILLION km','#5af0ff');
  card(20.4,EV.friend,'ACCRETION DISK','GAS AT MILLIONS OF °C 🔥','#ff8a5a');card(EV.calm+0.6,EV.inside,'STRETCH AT THE EDGE','ALMOST ZERO 🤏','#7dff9a');
  card(EV.nasa+0.3,EV.timer,'NASA SIMULATION · 2024','SGR A* · 4.3 MILLION ☀️','#5af0ff');
  if(S==='nasa'&&tt>=EV.timer){const k=seg(tt,EV.timer,EV.endc-0.4);const v=Math.max(0,12.8*(1-k));const s=popS(tt-EV.timer);ctx.save();ctx.translate(W/2,520);ctx.scale(s,s);ctx.fillStyle='rgba(8,10,30,0.85)';rrect(-330,-120,660,240,40);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.8)';ctx.lineWidth=5;rrect(-330,-120,660,240,40);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='800 34px Inter';ctx.fillStyle='rgba(255,220,230,0.95)';ctx.fillText('HORIZON → THE END',0,-70);ctx.font='900 130px Inter';ctx.fillStyle=v<3?'#ff5a8a':'#ffffff';ctx.fillText(v.toFixed(1)+' s',0,30);ctx.restore()}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.gal,0.5,0.3);flash(EV.size,0.5,0.3);flash(EV.disk,0.6,0.35,'255,200,140');flash(EV.friend,0.4,0.3);flash(EV.freeze,0.4,0.3);flash(EV.cross,0.4,0.3);flash(EV.horiz,0.6,0.4,'220,190,255');flash(EV.wait,0.6,0.3,'255,230,160');flash(EV.calm,0.4,0.3);flash(EV.inside,0.5,0.3,'255,120,120');flash(EV.spag,0.4,0.3);flash(EV.stretch,0.5,0.3,'255,160,120');flash(EV.nasa,0.4,0.3);flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.65*k})`);gg.addColorStop(0.45,`rgba(4,4,20,${0.4*k})`);gg.addColorStop(0.62,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,520);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=20;ctx.font='900 54px Inter';ctx.fillStyle='#fff';ctx.fillText('NEXT VIDEO:',0,-150);
  ctx.font=`900 ${fitS('What\'s really inside',980,84)}px Inter`;ctx.fillStyle='#ffd84a';ctx.fillText('What\'s really inside',0,-50);ctx.font=`900 ${fitS('a NEUTRON STAR? ⭐',980,96)}px Inter, "Noto Color Emoji"`;ctx.fillText('a NEUTRON STAR? ⭐',0,60);ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.font='800 50px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.fillText('Follow so you don\'t miss it 🔔',W/2,1560);ctx.restore()}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.02,far:3000},{center:[0,-9999,0],radius:1},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.disk,6,0.5);S(EV.horiz,8,0.6);S(EV.wait,10,0.5);S(EV.inside,6,0.5);S(EV.stretch,8,0.6);if(t>=EV.stretch&&t<EV.endc)a+=1.5+2*seg(t,EV.stretch,EV.endc);if(t<EV.gal)a+=1.2;return a}
