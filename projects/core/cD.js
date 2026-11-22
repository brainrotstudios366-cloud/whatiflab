// ================= EARTH'S CORE DISAPPEARS: overlays =================
function atmoA(e,cm){const a=e.a==null?1:e.a;if(a<=0.01)return;const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;const g=ctx.createRadialGradient(c[0],c[1],r*0.86,c[0],c[1],r*1.18);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.42,'rgba(120,200,255,0.75)');g.addColorStop(0.62,'rgba(80,150,255,0.35)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore();return r}
const CAPS=[[0.05,1.2,'This is Earth\'s ^CORE 🔥'],[1.3,2.4,'~DELETED ❌'],[2.4,3.45,'for ^5 SECONDS ⏱️'],
 [3.6,5.0,'It\'s ^BIGGER than Mars 😳'],[5.0,6.4,'as hot as the ^SUN\'s surface'],[6.4,7.9,'⅓ of Earth\'s ^MASS'],[7.9,9.4,'and then… ~POOF 💨'],
 [9.8,11.0,'^YOU 🫵'],[11.0,12.5,'gravity drops by ~⅓ 📉'],[12.5,14.0,'70 kg → ^47 kg ⚖️'],[14.0,15.5,'you jump ^50% HIGHER 🦘'],[15.5,16.9,'floaty… and ~WEIRD 😳'],
 [17.2,18.7,'The ^MAGNETIC field 🧲'],[18.7,20.2,'is made by the core'],[20.2,21.9,'its source: ~GONE ❌'],[21.9,23.9,'compasses go ^CRAZY 🧭'],
 [24.2,25.6,'The ^MOON 🌙'],[25.6,27.1,'gravity travels at'],[27.1,28.6,'the speed of ^LIGHT ⚡'],[28.6,30.9,'it feels it ^1.3 s LATER 😳'],
 [31.2,32.6,'The ^MANTLE 🪨'],[32.6,34.0,'2,900 km of rock'],[34.0,35.6,'above an empty ~HOLE 🕳️'],[35.6,37.3,'it starts to ~FALL 😳'],
 [37.5,39.0,'Last ^SECOND…'],[41.05,42.3,'Core ^BACK ✅'],[42.3,43.5,'Earth RINGS like a ^BELL 🔔'],
 [45.2,46.6,'the mantle ~FALLS IN 🕳️'],[46.6,47.6,'⅔ of the planet…'],[47.6,49.1,'~CRASH 💥'],[49.1,50.3,'Earth ^MELTS 🌋'],[50.3,51.5,'and ~SHRINKS'],
 [51.8,53.4,'Relax 😮‍💨'],[53.4,55.0,'the real core is ^5,200 °C'],[55.0,56.8,'and it\'s going ^NOWHERE'],[56.8,58.5,'for ^BILLIONS of years ✅']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=880,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+460+i*80,y-16,60,32,16);ctx.fill()}
  ctx.font='900 38px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'🔥 CORE: BACK ✅':`🔥 CORE: GONE · ${n}/5`,x0+32,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
let TT0=0;
// glow of the core / hole in the cutaway
function coreGlow(cm,t){const c=prj([0,0,0]);if(!c)return;const P=pRad([0,0,0],CR,cm);if(!P)return;const r=P[1];const cv=coreVis(t);
  if(cv>0.01){glowAt(c,r*1.5,'255,190,80',0.5*cv);glowAt(c,r*0.55,'255,250,220',0.55*cv)}
  if(cv<0.99){const a=(1-cv)*(0.55+0.15*Math.sin(t*6));ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],r*0.75,c[0],c[1],r*1.25);g.addColorStop(0,'rgba(255,90,138,0)');g.addColorStop(0.5,`rgba(255,90,138,${0.45*a})`);g.addColorStop(1,'rgba(255,90,138,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.3,c[1]-r*1.3,r*2.6,r*2.6);ctx.restore()}}
// burst when the core vanishes / returns
function burst(cm,t,t0,col){const k=(t-t0)/0.8;if(k<0||k>1)return;const c=prj([0,0,0]);if(!c)return;const P=pRad([0,0,0],CR,cm);const r=P?P[1]:200;
  glowAt(c,r*(1+k*2),col,0.9*(1-k));ctx.save();ctx.globalAlpha=1-k;ctx.strokeStyle='#fff';ctx.lineWidth=8*(1-k)+2;ctx.beginPath();ctx.arc(c[0],c[1],r*(0.6+k*2.2),0,TAU2);ctx.stroke();
  for(let i=0;i<18;i++){const a=hsh(i,81)*TAU2,d=r*(0.3+k*(1.2+hsh(i,82)*1.6));const x=c[0]+Math.cos(a)*d,y=c[1]+Math.sin(a)*d;star4(x,y,26*(1-k)+8,1-k)}ctx.restore()}
function layerTags(t,a){if(a<=0)return;const P=(r,q)=>prj([Math.cos(q)*r,Math.sin(q)*r,0.002]);
  const L=[['🪨 CRUST',1.0,1.05,'#ffffff',0],['🟠 MANTLE',0.74,0.55,'#ffb070',0.15],['🔥 OUTER CORE · liquid iron',0.4,0.22,'#ffd84a',0.3],['⚪ INNER CORE · solid',0.1,-1.25,'#ffffff',0.45]];
  for(const[s,r,q,col,d]of L){const p=P(r,q);if(!p)continue;const k=seg(t,EV.idea+0.3+d,EV.idea+0.6+d)*a;pin(p,'255,255,255',k);tag(s,[clamp(p[0]+(q<0?-40:40)+(r<0.2?-120:0),260,W-260),p[1]+(q<0?70:-60)],col,k)}}
function gArrow(t,cm){const k=t-EV.r1;if(k<0.3)return;const base=prj([0.95,2.35,5.2]);if(!base)return;const f=k<0.9?1:lerp(1,0.675,easeOut(seg(k,0.9,1.3)));const L=230*f;
  arrow2([base[0],base[1]],[base[0],base[1]+L],f<0.99?'#ff5a8a':'#ffd84a',16,seg(k,0.3,0.6)*clamp((EV.r2-0.2-t)/0.2,0,1));
  tag(f<0.99?'GRAVITY −32%':'GRAVITY 100%',[base[0],base[1]-46],f<0.99?'#ff5a8a':'#ffd84a',seg(k,0.3,0.6)*clamp((EV.r2-0.2-t)/0.2,0,1))}
function jumpLines(t){if(t<EV.r1+2.6)return;const a=seg(t,EV.r1+2.6,EV.r1+2.9)*clamp((EV.r2-0.2-t)/0.2,0,1);
  for(const[h,s,col]of[[0.5,'normal jump','#ffffff'],[CE_JH,'now 🦘','#7dff9a']]){const p0=prj([-0.75,h,5.2]),p1=prj([0.75,h,5.2]);if(!p0||!p1)continue;strokePts([p0,p1],col,6,a*0.9,[18,12]);tag(s,[p0[0]-140,p0[1]+(h>0.6?-34:34)],col,a)}}
function compass(t,a){if(a<=0)return;const x=W/2,y=1580,R=110;ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(8,10,30,0.85)';ctx.beginPath();ctx.arc(x,y,R,0,TAU2);ctx.fill();ctx.strokeStyle='#5af0ff';ctx.lineWidth=6;ctx.stroke();
  ctx.font='900 34px Inter';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('N',x,y-R+28);
  const k=t-EV.r2-1.2;const ang=k<0?Math.sin(t*2)*0.06:k*7+Math.sin(k*5)*2.5;ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle='#ff5a8a';ctx.beginPath();ctx.moveTo(0,-R*0.8);ctx.lineTo(18,0);ctx.lineTo(-18,0);ctx.closePath();ctx.fill();ctx.fillStyle='#e8eefc';ctx.beginPath();ctx.moveTo(0,R*0.8);ctx.lineTo(18,0);ctx.lineTo(-18,0);ctx.closePath();ctx.fill();ctx.restore()}
function dipole(t){const k=seg(t,EV.r2+1.2,EV.r2+3.0);const fl=k>0&&k<1?(0.6+0.4*Math.sin(t*40)):1;const al=(1-k)*fl*seg(t,EV.r2,EV.r2+0.4);if(al<=0.01)return;
  for(let i=1;i<=4;i++){const L=1.35+i*0.55;const P=[];for(let q=0;q<=60;q++){const th=0.15+q/60*(Math.PI-0.3);const r=L*Math.sin(th)*Math.sin(th);if(r<1.0){P.push(null);continue}P.push([r*Math.sin(th),r*Math.cos(th),0])}
    for(const sx of[-1,1])strokePts(P.map(p=>p?prj([p[0]*sx,p[1],0.3]):null),'#5af0ff',6,al*0.85,[16,10])}
  const c=prj([0,1.0,0]);if(c)glowAt(c,90,'90,240,255',0.6*al)}
function gravRing(t,cm){const t0=27.3,k=(t-t0)/1.3;const e=prj(CE_EP),m=prj(CE_MP);if(!e||!m)return;
  if(k>=0&&k<=1.25){const d=V.len(V.sub(CE_MP,CE_EP));const R=pRad(CE_EP,CE_ER+(d-CE_ER)*Math.min(k,1)+(k>1?(k-1)*2:0),cm);if(R){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=k>1?1-(k-1)/0.25:1;ctx.strokeStyle='#ffd84a';ctx.lineWidth=10;ctx.beginPath();ctx.arc(e[0],e[1],R[1],0,TAU2);ctx.stroke();ctx.lineWidth=26;ctx.strokeStyle='rgba(255,216,74,0.25)';ctx.stroke();ctx.restore()}}
  const tm=clamp(t-t0,0,1.3);if(t>t0-0.2&&t<EV.r4-0.2)pill(`⚡ gravity news: ${tm.toFixed(1)} s`,1500,'#ffd84a',seg(t,t0-0.2,t0)*clamp((EV.r4-0.2-t)/0.2,0,1),44);
  const hk=t-(t0+1.3);if(hk>=0){glowAt(m,220,'255,216,74',0.7*Math.max(0,1-hk/0.8));tag('🌙 huh?!',[m[0]-40,m[1]+150],'#ffd84a',seg(hk,0,0.2)*clamp((EV.r4-0.2-t)/0.2,0,1))}
}
function bellRings(cm,t){const k0=t-EV.back-0.2;if(k0<0||t>EV.never)return;const c=prj([0,0,0]);if(!c)return;const P=pRad([0,0,0],1,cm);if(!P)return;const r=P[1];
  ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<5;i++){const k=(k0*0.9-i*0.25);if(k<0||k>1)continue;ctx.globalAlpha=(1-k)*0.85;ctx.strokeStyle=i%2?'#ff5a8a':'#ffd84a';ctx.lineWidth=10;ctx.beginPath();ctx.arc(c[0],c[1],r*(0.55+k*0.75),0,TAU2);ctx.stroke()}ctx.restore()}
function fallArrows(t,cm,a){if(a<=0)return;for(let i=0;i<6;i++){const q=-1.1+i*0.45;const ph=(t*1.2+i*0.31)%1;const r0=lerp(0.86,CR+0.02,ph),r1=lerp(0.86,CR+0.02,Math.min(1,ph+0.3));
  arrow2(prj([Math.cos(q)*r0,Math.sin(q)*r0,0.004]),prj([Math.cos(q)*r1,Math.sin(q)*r1,0.004]),'#ff5a8a',9,a*Math.sin(ph*Math.PI))}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;TT0=tt;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmoA(e,cm);
  const cut=S==='hook'||S==='idea'||S==='r4'||S==='r5'||S==='day'||S==='end'||(S==='never'&&tt<EV.morph);
  if(cut)coreGlow(cm,tt);
  burst(cm,tt,EV.gone,'255,90,138');burst(cm,tt,EV.vanish,'255,90,138');burst(cm,tt,EV.back,'125,255,154');
  if(S==='idea')layerTags(tt,clamp((EV.vanish-tt)/0.25,0,1));
  if(S==='r1'){gArrow(tt,cm);jumpLines(tt)}
  if(S==='r2'){dipole(tt);compass(tt,seg(tt,EV.r2+0.2,EV.r2+0.5)*clamp((EV.r3-0.2-tt)/0.2,0,1))}
  if(S==='r3')gravRing(tt,cm);
  if(S==='r4')fallArrows(tt,cm,seg(tt,EV.r4+4.4,EV.r4+4.7));
  if(S==='r5')bellRings(cm,tt);
  if(S==='never'){if(tt<EV.morph)fallArrows(tt,cm,seg(tt,EV.never+1.4,EV.never+1.7));const mk=ease(seg(tt,EV.morph,EV.morph+0.6));if(mk>0)sphereGlow(cm,0.945,mk*(0.8+0.2*Math.sin(tt*5)),'255,120,40')}
  {const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if Earth\'s CORE 🔥',-90,96,'#ffffff');L('DISAPPEARED',25,130,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  bigTitle([['What if it',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['came back? 😳',150,96,'#ffffff']],EV.never,EV.never+1.6,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(3.6,5.0,'CORE RADIUS vs MARS','3,480 km vs 3,390 km 🔴','#ffd84a');card(5.0,6.4,'INNER CORE','≈ 5,200 °C 🔥','#ff5a8a');card(6.4,EV.vanish,'THE CORE =','≈ 32% OF EARTH\'S MASS','#ffd84a');
  card(12.5,16.9,'A 70 kg PERSON WOULD WEIGH','≈ 47 kg ⚖️','#7dff9a');card(18.7,EV.r3,'THE MAGNETIC FIELD IS MADE BY','SWIRLING LIQUID IRON 🌀','#5af0ff');
  card(25.6,27.2,'EARTH → MOON','≈ 1.3 LIGHT-SECONDS 🌙','#ffd84a');card(35.6,EV.r5,'5 s OF FREE FALL (core edge)','≈ 130 m DOWN ⬇️','#ff5a8a');
  card(42.3,EV.never,'AFTER HUGE QUAKES, EARTH','RINGS FOR WEEKS 🔔','#7dff9a');card(47.6,EV.day,'ENERGY OF THE FALLING ROCK','ENOUGH TO MELT EARTH 🌋','#ff5a8a');
  card(53.4,EV.endc,'THE CORE HAS BEEN HOT FOR','≈ 4.5 BILLION YEARS 🔥','#ffd84a');
  roundBar(tt);
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.gone,0.8,0.35,'255,90,138');flash(EV.idea,0.4,0.3);flash(EV.vanish,0.6,0.3,'255,90,138');flash(EV.r1,0.5,0.3);flash(EV.r1+0.9,0.35,0.3,'255,90,138');flash(EV.r2,0.4,0.3);flash(EV.r2+1.2,0.3,0.3,'90,240,255');flash(EV.r3,0.4,0.3);flash(27.3+1.3,0.3,0.3,'255,216,74');flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,0.8,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.morph,0.9,0.5,'255,150,60');flash(EV.day,0.5,0.3);flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.45*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('5 seconds of LOW gravity…',-70,84,'#ffffff');L('what would YOU do? 🦘',45,92,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
