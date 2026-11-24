// ================= ELECTRICITY DISAPPEARS: overlays =================
function atmoA(e,cm){const a=e.a==null?1:e.a;if(a<=0.01)return;const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.4,'rgba(110,190,255,0.55)');g.addColorStop(0.62,'rgba(80,150,255,0.25)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore();return r}
const CAPS=[[0.05,1.2,'Earth at ^NIGHT 🌃'],[1.3,2.4,'~ELECTRICITY: DELETED ⚡'],[2.4,3.45,'for ^5 SECONDS ⏱️'],
 [3.6,5.0,'every ^LIGHT 💡'],[5.0,6.4,'every ^PHONE 📱'],[6.4,7.9,'even your ^HEARTBEAT 💓'],[7.9,9.4,'and then… ~POOF ⚡'],
 [9.8,11.0,'^YOU 🫵'],[11.0,12.5,'your ^NERVES are electric ⚡'],[12.5,14.0,'~NO SIGNAL ❌'],[14.0,15.5,'you ~DROP 😵'],[15.5,16.9,'heart: ~5 BEATS skipped 💓'],
 [17.2,18.7,'The ^POWER GRID 🔌'],[18.7,20.2,'every city goes ~DARK 🌃'],[20.2,21.9,'trains, Wi-Fi, hospitals'],[21.9,23.9,'~ALL OFF ❌'],
 [24.2,25.6,'^LIGHTNING ⚡'],[25.6,27.1,'strikes ≈ ^44 times a second'],[27.1,28.6,'5 seconds = ^220 bolts'],[28.6,30.9,'~CANCELLED ❌'],
 [31.2,32.6,'Every ^PHONE 📱'],[32.6,34.0,'every ^COMPUTER 💻'],[34.0,35.6,'~SHUTS DOWN 💀'],[35.6,37.3,'unsaved work… ~GONE 😭'],
 [37.5,39.0,'Last ^SECOND…'],[41.05,42.3,'Electricity ^BACK ✅'],[42.3,43.5,'the grid? ~NOT so fast 😳'],
 [45.2,46.6,'no ~HEARTBEATS 💔'],[46.6,47.6,'no ~THOUGHTS 🧠'],[47.6,49.1,'every cell runs on ^⚡'],[49.1,50.3,'life would ~STOP'],[50.3,51.5,'on the whole ~PLANET 🌍'],
 [51.8,53.4,'Relax 😮‍💨'],[53.4,55.0,'your heart makes its ^OWN spark'],[55.0,56.8,'≈ ^100,000 times a day 💓'],[56.8,58.5,'no plug needed ✅']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=880,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+460+i*80,y-16,60,32,16);ctx.fill()}
  ctx.font='900 38px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'⚡ POWER: BACK ✅':`⚡ POWER: OFF · ${n}/5`,x0+32,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
let TT0=0;
// ---------- ECG heart monitor ----------
function ecgOn(u){const S=scn(u);if(S==='r1')return u<EV.r1+2.9;if(S==='r5')return u>=EV.back+0.35;if(S==='never')return false;if(S==='day'||S==='end')return true;return powerOn(u)}
function ecgV(u){if(!ecgOn(u))return (vnoise(u*40,3.3)-0.5)*0.03;const ph=((u%0.8)+0.8)%0.8/0.8;const G=(c,w,a)=>a*Math.exp(-Math.pow((ph-c)/w,2));return G(0.12,0.03,0.12)-G(0.25,0.008,0.18)+G(0.27,0.01,1.0)-G(0.295,0.01,0.3)+G(0.5,0.05,0.25)}
function ecgPanel(t,a,y){if(a<=0.01)return;y=y||1580;const w=880,h=190,x0=W/2-w/2;ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(6,10,24,0.86)';rrect(x0,y-h/2,w,h,30);ctx.fill();const on=ecgOn(t);const col=on?'#7dff9a':'#ff5a8a';
  ctx.strokeStyle=on?'rgba(125,255,154,0.5)':'rgba(255,90,138,0.6)';ctx.lineWidth=3;rrect(x0,y-h/2,w,h,30);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;for(let gx=x0+40;gx<x0+w;gx+=40){ctx.beginPath();ctx.moveTo(gx,y-h/2+8);ctx.lineTo(gx,y+h/2-8);ctx.stroke()}
  ctx.font='900 34px Inter, "Noto Color Emoji"';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.fillText('💓 HEART',x0+30,y-h/2+36);ctx.textAlign='right';ctx.fillStyle=col;
  const bl=Math.floor(t*2)%2===0;ctx.fillText(on?'75 BPM ✅':(bl?'⚠️ NO SIGNAL':'NO SIGNAL'),x0+w-30,y-h/2+36);
  const SPAN=2.6,N=220,px0=x0+30,pw=w-60,yb=y+30;ctx.beginPath();for(let i=0;i<=N;i++){const u=t-SPAN+SPAN*i/N;const v=ecgV(u);const X=px0+pw*i/N,Y=yb-v*95;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}
  ctx.lineJoin='round';ctx.strokeStyle=col;ctx.lineWidth=5;ctx.shadowColor=col;ctx.shadowBlur=18;ctx.stroke();ctx.shadowBlur=0;const hv=ecgV(t);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px0+pw,yb-hv*95,8,0,TAU2);ctx.fill();ctx.restore()}
// ---------- lightning ----------
function boltPath(x,y,len,seed,ang){const P=[[x,y]];let cx=x,cy=y;const n=9;for(let i=1;i<=n;i++){const d=len/n;const j=(hsh(seed,i)-0.5)*1.1;cx+=Math.sin(ang+j)*d;cy+=Math.cos(ang+j)*d;P.push([cx,cy])}return P}
function drawBolt(P,a,col,w){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;ctx.lineJoin='round';ctx.lineCap='round';for(const[lw,c]of[[w*4,`rgba(${col},0.25)`],[w*1.8,`rgba(${col},0.7)`],[w*0.7,'rgba(255,255,255,1)']]){ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}ctx.restore()}
function boltPt(i){const cm=camAt(EV.r3+1);const d=V.norm(cm.eye);const r=ZR,u=V.norm(V.cross(r,d));const q=V.norm(V.add(d,V.add(V.sc(r,0.25+(hsh(i,93)-0.5)*0.6),V.sc(u,(hsh(i,94)-0.5)*0.95))));return V.sc(q,1.0)}
function lightningFX(t){ZBOLTS.forEach((b,i)=>{const k=t-b;if(k<0||k>0.26||b>=EV.r3+4.6)return;const p=prj(boltPt(i));if(!p)return;const a=(k<0.05?1:k<0.09?0.35:k<0.13?0.9:1-(k-0.13)/0.13);
  glowAt(p,380,'170,190,255',0.8*a);glowAt(p,90,'255,255,255',0.9*a);const P=boltPath(p[0]+(hsh(i,95)-0.5)*40,p[1]-150,300,i,(hsh(i,96)-0.5)*0.6);drawBolt(P,a,'150,170,255',7);const Q=boltPath(P[4][0],P[4][1],130,i+50,0.9*(hsh(i,97)>0.5?1:-1));drawBolt(Q,a*0.8,'150,170,255',3)});
  if(t>=EV.r3+4.6){for(let j=0;j<3;j++){const i=[2,7,12][j]%ZBOLTS.length;const p=[[W/2-260,820],[W/2+10,980],[W/2+250,800]][j];const k=seg(t,EV.r3+4.65+j*0.18,EV.r3+4.85+j*0.18);if(k<=0)continue;const P=boltPath(p[0],p[1]-150,300,i,(hsh(i,96)-0.5)*0.6);
    ctx.save();ctx.globalAlpha=0.6*k;ctx.strokeStyle='rgba(160,170,200,0.7)';ctx.lineWidth=5;ctx.setLineDash([14,10]);ctx.beginPath();P.forEach((q,n)=>n?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.restore();emojiAt('❌',P[4][0],P[4][1],70*popS(t-EV.r3-4.65-j*0.18),k)}}}
// ---------- phone screen (2D content mapped on the 3D screen) ----------
function mpt(M,p){return[M[0]*p[0]+M[4]*p[1]+M[8]*p[2]+M[12],M[1]*p[0]+M[5]*p[1]+M[9]*p[2]+M[13],M[2]*p[0]+M[6]*p[1]+M[10]*p[2]+M[14]]}
function phoneScreen(t){if(!ZPM)return;const z=0.047;const A=prj(mpt(ZPM,[-0.37,0.77,z])),B=prj(mpt(ZPM,[0.37,0.77,z])),C=prj(mpt(ZPM,[-0.37,-0.77,z]));if(!A||!B||!C)return;
  const off=t>=EV.r4+3.0;const fl=zFlick(t,EV.r4+3.0);const c0=prj(mpt(ZPM,[0,0,z]));
  if(fl<0.5){glowAt(c0,120,'255,255,255',fl*0.6);if(t>EV.r4+3.6){ctx.save();const k=seg(t,EV.r4+3.6,EV.r4+3.9);tag('🔌 NO POWER',[c0[0],c0[1]],'#ff5a8a',k);ctx.restore()}return}
  ctx.save();ctx.setTransform((B[0]-A[0])/370,(B[1]-A[1])/370,(C[0]-A[0])/770,(C[1]-A[1])/770,A[0],A[1]);ctx.globalAlpha=fl;
  const g=ctx.createLinearGradient(0,0,0,770);g.addColorStop(0,'#1b3c8a');g.addColorStop(1,'#0b1840');ctx.fillStyle=g;ctx.fillRect(0,0,370,770);
  ctx.fillStyle='#fff';ctx.font='800 20px Inter';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('9:41',24,24);ctx.textAlign='right';ctx.font='800 20px Inter, "Noto Color Emoji"';ctx.fillText('📶 🔋 82%',346,24);
  ctx.fillStyle='rgba(255,255,255,0.95)';rrect(20,60,330,560,22);ctx.fill();ctx.fillStyle='#14182a';ctx.textAlign='left';ctx.font='900 26px Inter';ctx.fillText('MY ESSAY.doc',40,98);
  ctx.fillStyle='#ff5a8a';ctx.font='800 18px Inter';ctx.fillText('● not saved',40,128);
  const typed=Math.floor(clamp((t-EV.r4)/3.0,0,1)*14);for(let i=0;i<14;i++){ctx.fillStyle=i<typed?'#8a93b8':'#e2e6f2';const L=[260,290,230,280,300,250,270,180,290,240,280,260,220,150][i];rrect(40,160+i*30,L,12,6);ctx.fill()}
  if(Math.floor(t*3)%2===0){ctx.fillStyle='#2a6cff';ctx.fillRect(40+[260,290,230,280,300,250,270,180,290,240,280,260,220,150][Math.max(0,typed-1)]*0.95,155+Math.max(0,typed-1)*30,4,22)}
  ctx.fillStyle='#5af0ff';rrect(40,650,290,70,35);ctx.fill();ctx.fillStyle='#0b1840';ctx.textAlign='center';ctx.font='900 26px Inter, "Noto Color Emoji"';ctx.fillText('💾 SAVE (later…)',185,686);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;TT0=tt;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmoA(e,cm);
  if(S==='r3'&&tt<EV.r3+4.6){const ce=prj(V.sc(V.norm(cm.eye),1));if(ce)glowAt(ce,500,'60,80,160',0.12)}
  if(S==='r3')lightningFX(tt);
  if(S==='r4')phoneScreen(tt);
  // city-light warm haze when lights on
  {const la=lightsA(tt);const v=(la[0]+la[1])*0.5;if(v>0.02&&EARTHS.length){const c=prj(V.sc(V.norm(cm.eye),1));if(c)glowAt(c,420,'255,170,80',0.1*v)}}
  {const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if ELECTRICITY ⚡',-90,96,'#ffffff');L('DISAPPEARED',25,130,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  bigTitle([['What if it',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['came back? 😳',150,96,'#ffffff']],EV.never,EV.never+1.6,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(3.6,5.0,'EARTH\'S CITY LIGHTS','SEEN FROM SPACE 🛰️','#ffd84a');card(5.0,6.4,'ELECTRICITY =','MOVING ELECTRIC CHARGES ⚡','#5af0ff');card(6.4,EV.vanish,'YOUR BRAIN RUNS ON','≈ 20 WATTS 🧠','#ffd84a');
  card(11.0,13.95,'NERVE SIGNALS FLY AT UP TO','≈ 120 m/s ⚡','#5af0ff');card(14.0,16.9,'EVERY HEARTBEAT STARTS WITH','AN ELECTRIC SPARK 💓','#ff5a8a');
  card(18.7,EV.r3,'≈ 8 BILLION PEOPLE','IN THE DARK 🌑','#ff5a8a');card(25.6,EV.r4,'LIGHTNING FLASHES PER YEAR','≈ 1.4 BILLION ⚡','#ffd84a');
  card(32.6,EV.r5,'A PHONE CHIP SWITCHES','BILLIONS OF TIMES A SECOND','#5af0ff');
  card(42.3,EV.never,'RESTARTING A BLACKED-OUT GRID','CAN TAKE HOURS (Spain 2025) 😳','#ffd84a');card(47.6,EV.day,'EVERY CELL IN YOUR BODY USES','ELECTRIC SIGNALS ⚡','#ff5a8a');
  card(53.4,EV.endc,'YOUR HEART BEATS','≈ 100,000 TIMES A DAY 💓','#7dff9a');
  roundBar(tt);
  if(S==='r1')ecgPanel(tt,seg(tt,EV.r1+0.1,EV.r1+0.4)*clamp((EV.r2-0.15-tt)/0.2,0,1));
  if(S==='r5'&&tt>EV.back-1.5)ecgPanel(tt,seg(tt,EV.back-1.5,EV.back-1.2)*clamp((EV.never-0.15-tt)/0.2,0,1));
  if(S==='never'&&tt>EV.never+1.6)ecgPanel(tt,seg(tt,EV.never+1.6,EV.never+1.9)*clamp((EV.day-0.15-tt)/0.2,0,1));
  if(S==='day')ecgPanel(tt,seg(tt,EV.day+0.2,EV.day+0.5)*clamp((EV.endc-0.15-tt)/0.2,0,1));
  if(S==='r2'&&tt>EV.r2+2.2){const ic=[['🏥',-280,560],['🚆',0,640],['📶',280,560]];ic.forEach(([e,dx,y],i)=>{const k=tt-EV.r2-2.4-i*0.25;if(k<0)return;const a=clamp((EV.r3-0.2-tt)/0.2,0,1);const p=popS(k);emojiAt(e,W/2+dx,y+260,120*p,a);if(k>0.5)emojiAt('❌',W/2+dx+45,y+305,70*popS(k-0.5),a)})}
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(S==='r1'&&tt>EV.r1+4.5&&tt<EV.r1+6.9){const p=prj([0.2,0.6,5.2]);if(p)emojiAt('💫',p[0],p[1]-70,90,clamp((EV.r1+6.9-tt)/0.3,0,1))}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.off,0.55,0.35,'90,240,255');flash(EV.idea,0.4,0.3);flash(EV.vanish,0.5,0.3,'90,240,255');flash(EV.r1,0.5,0.3);flash(EV.r1+4.35,0.3,0.25,'255,90,138');flash(EV.r2,0.4,0.3);flash(EV.r2+1.6,0.35,0.3,'90,240,255');flash(EV.r3,0.4,0.3);
  for(const b of ZBOLTS)if(b<EV.r3+4.6)flash(b,0.12,0.12,'190,200,255');flash(EV.r4,0.4,0.3);flash(EV.r4+3.0,0.35,0.3,'90,240,255');flash(EV.r5,0.4,0.3);flash(EV.back,0.75,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.day,0.5,0.3);flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.45*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('5 seconds without power…',-70,84,'#ffffff');L('what would YOU miss first? 📱',45,88,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
