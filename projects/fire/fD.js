// ================= FIRE DISAPPEARS: overlays =================
function atmoA(e,cm){const a=e.a==null?1:e.a;if(a<=0.01)return;const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.4,'rgba(110,190,255,0.55)');g.addColorStop(0.62,'rgba(80,150,255,0.25)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore();return r}
const CAPS=[[0.05,1.2,'Thanksgiving ^DINNER 🦃'],[1.3,2.4,'~FIRE: DELETED 🔥'],[2.4,3.45,'for ^5 SECONDS ⏱️'],
 [3.6,5.0,'every ^CAMPFIRE 🏕️'],[5.0,6.4,'every ^ENGINE 🚗'],[6.4,7.9,'every ^CANDLE 🕯️'],[7.9,9.4,'and then… ~POOF 💨'],
 [9.8,11.0,'The ^OVEN 🦃'],[11.0,12.5,'gas flames: ~OUT ❌'],[12.5,14.5,'the turkey? ~STILL RAW 😭'],[14.5,16.9,'dinner ~DELAYED 💀'],
 [17.2,18.6,'Every ^CAR 🚗'],[18.6,20.0,'engine: ~DEAD 💀'],[20.0,21.9,'no more tiny ^EXPLOSIONS 💥'],[21.9,23.9,'electric cars: ^UNBOTHERED 😎'],
 [24.2,25.6,'Power ^PLANTS 🏭'],[25.6,27.2,'most of them ^BURN stuff 🔥'],[27.2,29.0,'the lights go ~OUT 🌃'],[29.0,30.9,'sun, wind & nuclear: ^STILL ON ✅'],
 [31.2,32.6,'But the ^SUN? ☀️'],[32.6,34.0,'it is ~NOT fire 😳'],[34.0,35.6,'there is no oxygen in space'],[35.6,37.3,'it runs on ^FUSION ⚛️'],
 [37.5,39.0,'And ^YOU? 🫵'],[41.05,42.3,'Fire is ^BACK ✅'],[42.3,43.5,'but flames ~DON\'T relight 😳'],
 [45.2,46.6,'no ~COOKING 🍳'],[46.6,47.8,'no ~CARS, no ~PLANES'],[47.8,49.4,'most power: ~GONE 🔌'],[49.4,51.5,'even some ^FORESTS need fire 🌲'],
 [51.8,53.0,'Relax 😮‍💨'],[53.0,54.8,'one ^SPARK 🔥'],[54.8,56.6,'and it\'s ^BACK ✅'],[56.6,58.5,'Happy ^THANKSGIVING 🦃']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=880,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+460+i*80,y-16,60,32,16);ctx.fill()}
  ctx.font='900 38px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'🔥 FIRE: BACK ✅':`🔥 FIRE: OFF · ${n}/5`,x0+32,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
// ---------- 2D flame (teardrop), base point p, height h px ----------
function flame2D(p,h,a,t,seed,blue){if(!p||a<=0.01||h<2)return;const fl=1+0.12*Math.sin(t*23+seed*5)+0.08*Math.sin(t*37+seed);const hh=h*fl*a,ww=h*0.36*(0.6+0.4*a);const sway=Math.sin(t*9+seed*3)*ww*0.25;
  ctx.save();ctx.globalCompositeOperation='screen';glowAt([p[0],p[1]-hh*0.45],hh*2.4,blue?'60,120,255':'255,150,50',0.35*a);
  const L=(sc,c0,c1)=>{const w=ww*sc,H=hh*sc;ctx.beginPath();ctx.moveTo(p[0],p[1]+w*0.15);ctx.bezierCurveTo(p[0]-w,p[1]-H*0.05,p[0]-w*0.6,p[1]-H*0.6,p[0]+sway,p[1]-H);ctx.bezierCurveTo(p[0]+w*0.6,p[1]-H*0.6,p[0]+w,p[1]-H*0.05,p[0],p[1]+w*0.15);
    const g=ctx.createLinearGradient(p[0],p[1],p[0],p[1]-H);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.fill()};
  ctx.globalAlpha=a;if(blue){L(1,'rgba(40,90,255,0.95)','rgba(120,200,255,0.2)');L(0.55,'rgba(200,230,255,0.9)','rgba(160,220,255,0.3)')}
  else{L(1,'rgba(255,90,20,0.9)','rgba(255,170,40,0.15)');L(0.7,'rgba(255,190,60,0.95)','rgba(255,220,120,0.4)');L(0.38,'rgba(255,255,230,1)','rgba(255,250,200,0.6)');ctx.globalAlpha=a*0.7;ctx.fillStyle='rgba(80,120,255,0.8)';ctx.beginPath();ctx.ellipse(p[0],p[1]-ww*0.1,ww*0.25,ww*0.35,0,0,TAU2);ctx.fill()}
  ctx.restore()}
function pxSize(p,s){const c=prj(p);if(!c)return null;const q=prj(V.add(p,[0,s,0]));if(!q)return null;return[c,Math.hypot(q[0]-c[0],q[1]-c[1])]}
// smoke wisps rising after a flame dies at t0
function smoke(p,t,t0,seed){const k=t-t0;if(k<0||k>3.2||!p)return;ctx.save();for(let i=0;i<7;i++){const kk=k-i*0.12;if(kk<0)continue;const y=p[1]-kk*90-i*6;const x=p[0]+Math.sin(kk*3+i+seed)*14*kk;const r=8+kk*16;const a=0.25*clamp(1-kk/3,0,1);
  const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(210,215,225,${a})`);g.addColorStop(1,'rgba(210,215,225,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}ctx.restore()}
function tableFX(t){const S=scn(t);for(let i=0;i<4;i++){const P=pxSize(candleTip(i),0.11);if(!P)continue;const L=candleL(t,i);flame2D(P[0],P[1],L,t,i,false);
  if(S==='hook')smoke(P[0],t,EV.off+i*0.06+0.3,i);if(S==='back')smoke(P[0],t,EV.back-0.4,i);}
  const L=tableLight(t);if(L>0.02){const c=prj([0.05,0.95,0]);if(c)glowAt(c,700,'255,140,60',0.16*L)}
  if(S==='hook'&&t>EV.off+0.4){const c=prj([0.05,1.0,0.05]);if(c)glowAt(c,500,'60,90,200',0.08*seg(t,EV.off,EV.off+1))}
  if(S==='day'){const k=t-52.4;if(k>0&&k<2.0){const x0=prj([FCAND_X[0]-0.25,1.25,FCAND_Z+0.1]);const x1=prj(candleTip(3));if(x0&&x1){const u=clamp((t-52.9)/1.3,0,1);const px=lerp(x0[0],x1[0],u),py=lerp(x0[1],x1[1],u)-20;
    ctx.save();ctx.strokeStyle='#d8b07a';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+70,py+70);ctx.stroke();ctx.fillStyle='#b8202a';ctx.beginPath();ctx.arc(px,py,10,0,TAU2);ctx.fill();ctx.restore();
    if(k>0.45){flame2D([px,py+4],60,clamp((k-0.45)*5,0,1)*clamp((2.0-k)/0.2,0,1),t,7,false);if(k<0.7){glowAt([px,py],260,'255,220,140',0.8*(0.7-k)/0.25)}}}}}}
// ---------- oven FX ----------
function ovenFX(t){const on=ovenL(t);const c=prj([0,0.42,0.39]);if(c)glowAt(c,360,'255,140,40',0.35*on);
  for(let i=0;i<9;i++){const P=pxSize([-0.3+i*0.075,0.2,0.12],0.05);if(P)flame2D(P[0],P[1],on,t,i,true)}
  for(const sx of[-1,1])for(const sz of[-1,1]){const cc=[sx*0.24,0.985,sz*0.17];for(let j=0;j<12;j++){const a=j/12*TAU2;const P=pxSize([cc[0]+Math.cos(a)*0.07,cc[1],cc[2]+Math.sin(a)*0.07],0.035);if(P)flame2D(P[0],P[1],on,t,j+sx*3+sz*7,true)}}
  if(t>EV.r1+1.4)for(let i=0;i<3;i++){const P=prj([-0.2+i*0.2,0.25,0.12]);if(P)smoke([P[0],P[1]],t,EV.r1+1.6,i)}
  const p=prj([0,0.65,0.4]);if(p){tag('🌡️ '+(t<EV.r1+1.4?'180 °C':Math.round(lerp(180,120,seg(t,EV.r1+1.4,EV.r2)))+' °C ↓'),[p[0],p[1]-40],t<EV.r1+1.4?'#ffd84a':'#5af0ff',seg(t,EV.r1+0.4,EV.r1+0.7)*clamp((EV.r2-0.2-t)/0.2,0,1))}}
// ---------- cars FX ----------
function carsFX(t){for(const c of FCARS){const x=carX(c,t);const dir=c[0]<0?1:-1;const rear=prj([x-dir*2.3,0.35,c[0]]);const top=prj([x,2.1,c[0]]);if(!rear||!top)continue;
  if(!c[3]){const on=t<FSTALL?1:fFlick(t,FSTALL);for(let i=0;i<5;i++){const ph=((t*2.5+i/5+c[1]*0.1)%1);const px=rear[0]-dir*ph*60,py=rear[1]-ph*40;glowAt([px,py],14+ph*30,'200,200,210',0.35*on*(1-ph))}
    if(t>FSTALL+0.3&&c===FCARS[0])tag('❌ ENGINE OFF',[top[0],top[1]-30],'#ff5a8a',seg(t,FSTALL+0.3,FSTALL+0.6)*clamp((EV.r3-0.2-t)/0.2,0,1));
    if(t<FSTALL){const g=prj([x+dir*0.5,0.7,c[0]]);if(g&&Math.floor(t*12+c[1])%2===0)glowAt(g,30,'255,160,60',0.25)}}
  else if(t>EV.r2+4.6)tag('⚡ EV: STILL DRIVING 😎',[top[0],top[1]-30],'#7dff9a',seg(t,EV.r2+4.6,EV.r2+4.9)*clamp((EV.r3-0.2-t)/0.2,0,1))}}
// ---------- earth fires ----------
function earthFires(t,cm,a){if(a<=0.01)return;const ed=V.norm(cm.eye);for(const f of FFIRES){if(V.dot(f.n,ed)<0.15)continue;const p=prj(f.n);if(!p)continue;const fl=0.7+0.3*Math.sin(t*11+f.ph);glowAt(p,26*f.s*fl,'255,120,30',0.75*a);glowAt(p,7*f.s,'255,240,180',0.9*a*fl)}}
function earthFireA(t){const S=scn(t);if(S==='idea')return fFlick(t,EV.vanish);return 0}
// ---------- sun FX ----------
function sunFX(t,cm){const c=prj([0,0,0]);if(!c)return;const P=pRad([0,0,0],1,cm);if(!P)return;const r=P[1];glowAt(c,r*2.2,'255,150,40',0.35);sphereGlow(cm,1,1,'255,190,80');
  if(t>EV.r4+1.8){const k=seg(t,EV.r4+1.8,EV.r4+2.1);emojiAt('🔥',c[0]-r*0.55,c[1]-r*0.95,110*popS(t-EV.r4-1.8),k*clamp((EV.r4+4.4-t)/0.2,0,1));emojiAt('❌',c[0]-r*0.55+40,c[1]-r*0.95+40,80*popS(t-EV.r4-2.0),k*clamp((EV.r4+4.4-t)/0.2,0,1))}
  if(t>EV.r4+4.6){const k=seg(t,EV.r4+4.6,EV.r4+4.9);tag('⚛️ H + H → He + ENERGY',[c[0],c[1]-r*1.05],'#ffd84a',k*clamp((EV.r5-0.2-t)/0.2,0,1))}}
// ---------- you (r5): slow-burn cells ----------
function youFX(t){const p=prj([0,1.15,5.2]);if(!p)return;const a=seg(t,EV.r5+0.3,EV.r5+0.6)*clamp((EV.back-0.1-t)/0.2,0,1);for(let i=0;i<6;i++){const ph=(t*0.8+i/6)%1;const ang=i/6*TAU2+t*0.6;glowAt([p[0]+Math.cos(ang)*70,p[1]+Math.sin(ang)*120],22,'255,150,60',0.5*a*Math.sin(ph*Math.PI))}
  tag('🔋 CELLS: "BURNING" FOOD (NO FLAMES)',[p[0],p[1]-300],'#7dff9a',a)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmoA(e,cm);
  if(S==='hook'||S==='back'||S==='day'||S==='end')tableFX(tt);
  if(S==='r1')ovenFX(tt);if(S==='r2')carsFX(tt);if(S==='r4')sunFX(tt,cm);if(S==='r5')youFX(tt);
  if(S==='idea')earthFires(tt,cm,earthFireA(tt));
  {const la=earthLights(tt);const v=(la[0]+la[1])*0.5;if(EARTHS.length&&(S==='idea'||S==='r3'||S==='never')){const c=prj(V.sc(V.norm(cm.eye),1));if(c)glowAt(c,420,'255,170,80',0.08*v)}}
  {const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if FIRE 🔥',-90,104,'#ffffff');L('DISAPPEARED',25,130,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  bigTitle([['What if it',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['came back? 😳',150,96,'#ffffff']],EV.never,EV.never+1.6,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(3.6,5.0,'FIRE = FUEL + OXYGEN + HEAT','A FAST CHEMICAL REACTION 🔥','#ffd84a');card(5.0,6.4,'FIRES BURNING ON EARTH','RIGHT NOW: THOUSANDS 🛰️','#ff5a8a');card(6.4,EV.vanish,'HUMANS HAVE USED FIRE FOR','≈ 1 MILLION YEARS 🔥','#ffd84a');
  card(11.0,13.95,'AMERICANS EAT ON THANKSGIVING','≈ 46 MILLION TURKEYS 🦃','#ffd84a');card(14.0,16.9,'A RAW TURKEY NEEDS','≈ 3-4 HOURS IN THE OVEN ⏳','#5af0ff');
  card(18.6,21.9,'≈ 1.5 BILLION CARS ON EARTH','MOST BURN FUEL TO MOVE 🚗','#ff5a8a');card(21.9,EV.r3,'A CAR ENGINE AT 2,000 RPM','≈ 4,000 TINY FIRES A MINUTE 💥','#ffd84a');
  card(25.6,EV.r4,'BURNING COAL, GAS & OIL MAKES','≈ 60% OF THE WORLD\'S POWER ⚡','#ff5a8a');
  card(32.6,EV.r5,'THE SUN FUSES ≈ 600 MILLION','TONS OF HYDROGEN EVERY SECOND ☀️','#ffd84a');
  card(42.3,EV.never,'FIRE NEEDS A SPARK','TO START AGAIN 🔥','#ffd84a');card(49.4,EV.day,'SOME PINE CONES ONLY OPEN','IN THE HEAT OF A FIRE 🌲🔥','#7dff9a');
  card(53.0,EV.endc,'FIRE IS JUST CHEMISTRY','FUEL + OXYGEN + HEAT 🧪','#7dff9a');
  roundBar(tt);
  if(S==='r5'){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(S==='never'&&tt>EV.never+1.6){const ic=[['🍳',-300],['🚗',-100],['✈️',100],['🏭',300]];ic.forEach(([e,dx],i)=>{const k=tt-EV.never-1.8-i*0.25;if(k<0)return;const a=clamp((EV.never+5.6-tt)/0.2,0,1);if(a<=0)return;emojiAt(e,W/2+dx,560,110*popS(k),a);if(k>0.4)emojiAt('❌',W/2+dx+40,600,64*popS(k-0.4),a)})}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.off,0.5,0.35,'255,140,60');flash(EV.idea,0.4,0.3);flash(EV.vanish,0.5,0.3,'255,140,60');flash(EV.r1,0.5,0.3);flash(EV.r1+1.4,0.3,0.25,'90,240,255');flash(EV.r2,0.4,0.3);flash(FSTALL,0.3,0.25,'255,90,138');flash(EV.r3,0.4,0.3);flash(EV.r3+1.7,0.3,0.3,'0,0,0');
  flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,0.7,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.day,0.5,0.3);flash(53.0,0.25,0.3,'255,180,80');flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.45*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('5 seconds without fire…',-70,84,'#ffffff');L('what would YOU miss first? 🔥',45,88,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
