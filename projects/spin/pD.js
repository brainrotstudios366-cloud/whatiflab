// ================= EARTH STOPS SPINNING: overlays =================
function arrowLine(x0,y0,x1,y1,col,w,a){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1+Math.cos(an)*w*1.6,y1+Math.sin(an)*w*1.6);ctx.lineTo(x1+Math.cos(an+2.4)*w*2.2,y1+Math.sin(an+2.4)*w*2.2);ctx.lineTo(x1+Math.cos(an-2.4)*w*2.2,y1+Math.sin(an-2.4)*w*2.2);ctx.fill();ctx.restore()}
function pill(s,y,col,a,size){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.font=`900 ${size||44}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width+64;ctx.fillStyle='rgba(8,10,30,0.82)';rrect(W/2-w/2,y-40,w,80,40);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;rrect(W/2-w/2,y-40,w,80,40);ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,W/2,y+2);ctx.restore()}
function camBasisB(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function atmo(e,cm){const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.45,'rgba(110,190,255,0.55)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore()}
function bigCount(s,t0,t,col){const k=t-t0;if(k<0||k>0.7)return;const p=popS(k*0.8);ctx.save();ctx.globalAlpha=clamp((0.7-k)/0.15,0,1);ctx.translate(W/2,H*0.42);ctx.scale(p*1.2,p*1.2);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 300px Inter';ctx.lineWidth=40;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText(s,0,0);ctx.fillStyle=col;ctx.fillText(s,0,0);ctx.restore()}
const CAPS=[[1.3,2.45,'~STOP ✋'],[2.45,3.45,'for ^5 SECONDS'],
 [3.6,5.0,'Right now you are'],[5.0,6.4,'^SPINNING 🌀'],[6.4,7.9,'^1,670 km/h'],[7.9,9.5,'…and feel ^NOTHING'],
 [9.8,10.5,'The ground ~STOPS'],[10.6,12.0,'Everything else ^DOESN\'T'],[12.0,13.6,'➡️ ^1,670 km/h EAST'],[13.6,15.2,'Cars, trees, ^YOU 😳'],[15.2,16.9,'faster than ^SOUND 💥'],
 [17.2,18.7,'The ^AIR keeps going'],[18.7,20.3,'^SUPERSONIC wind 🌪️'],[20.3,22.2,'3× the ~WORST tornado'],[22.2,23.9,'ever measured'],
 [24.2,25.7,'The ^OCEANS too 🌊'],[25.7,27.3,'slam into coasts'],[27.3,29.0,'~MEGA TSUNAMIS'],[29.0,30.9,'taller than ^SKYSCRAPERS'],
 [31.2,32.7,'Safest place?'],[32.7,34.2,'The ^POLES 🐧'],[34.2,35.8,'^0 km/h there 😎'],[35.8,37.3,'Astronauts? ^FINE 🛰️'],
 [37.5,39.0,'Then it spins ^AGAIN…'],[41.05,42.3,'and it ALL happens'],[42.3,43.5,'~TWICE 💀'],
 [45.2,46.8,'Oceans flow to the ^POLES'],[46.8,48.5,'ONE ^GIANT continent'],[48.5,50.0,'around the ^EQUATOR'],[50.0,51.5,'(over many years)'],
 [51.8,53.4,'And ONE day…'],[53.4,55.0,'= ^ONE YEAR ☀️'],[55.0,56.8,'6 months of ^DAY'],[56.8,58.5,'6 months of ~NIGHT 🌑']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=840,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+400+i*82,y-16,62,32,16);ctx.fill()}
  ctx.font='900 40px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'🌀 SPINNING!':`🛑 SECOND ${n}/5`,x0+36,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
// point on the globe at latitude lat, facing the camera (+ lon offset)
function globePt(cm,lat,dl,r){const h=V.norm([cm.eye[0],0,cm.eye[2]]);const a=Math.atan2(h[0],h[2])+(dl||0);const R=r||1.0;return[Math.sin(a)*Math.cos(lat)*R,Math.sin(lat)*R,Math.cos(a)*Math.cos(lat)*R]}
function pin(p,col,a){if(!p||a<=0)return;glowAt(p,34,col,0.9*a);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p[0],p[1],9,0,7);ctx.fill();ctx.restore()}
function spinArrows(cm,t,a,col){if(a<=0)return;// curved arrows around the equator showing the spin direction
  ctx.save();ctx.globalAlpha=a;for(let j=0;j<3;j++){const pts=[];for(let i=0;i<=24;i++){const lon=-0.9+j*0.7+i/24*0.5+((t*WSP*0.25)%0.7);const p=prj([Math.sin(lon)*1.12,0.05*j-0.05,Math.cos(lon)*1.12]);pts.push(p)}
   ctx.strokeStyle=col;ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();pts.forEach((p,i)=>{if(!p)return;i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.stroke();const p1=pts[pts.length-1],p0=pts[pts.length-3];if(p1&&p0)arrowLine(p0[0],p0[1],p1[0],p1[1],col,10,1)}ctx.restore()}
function windStreaks(cm,t,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';const h=V.norm(V.sub(cm.eye,[0,0,0]));
  for(let i=0;i<46;i++){const lat=(hsh(i,1)-0.5)*2.2;const ph=(hsh(i,2)+t*0.7*(0.8+hsh(i,3)*0.6))%1;const lon0=Math.atan2(h[0],h[2])-1.3+ph*2.6;const L=0.35;
    const pts=[];for(let k=0;k<=10;k++){const lon=lon0+k/10*L;const p=[Math.sin(lon)*Math.cos(lat)*1.035,Math.sin(lat)*1.035,Math.cos(lon)*Math.cos(lat)*1.035];if(V.dot(V.norm(p),h)<0.1){pts.push(null);continue}pts.push(prj(p))}
    const al=a*Math.sin(ph*Math.PI)*0.85;ctx.strokeStyle=`rgba(220,245,255,${al})`;ctx.lineWidth=4+hsh(i,4)*4;ctx.lineCap='round';ctx.beginPath();let on=false;for(const p of pts){if(!p){on=false;continue}if(!on){ctx.moveTo(p[0],p[1]);on=true}else ctx.lineTo(p[0],p[1])}ctx.stroke()}ctx.restore()}
function speedLines(t,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<40;i++){const y=300+hsh(i,1)*1400;const ph=(hsh(i,2)+t*(1.4+hsh(i,3)))%1;const x=-300+ph*(W+600);const L=180+hsh(i,4)*320;
  const g=ctx.createLinearGradient(x-L,0,x,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,`rgba(255,255,255,${0.55*a})`);ctx.strokeStyle=g;ctx.lineWidth=3+hsh(i,5)*4;ctx.beginPath();ctx.moveTo(x-L,y);ctx.lineTo(x,y);ctx.stroke()}ctx.restore()}
function bigTitle(lines,t0,t1,t,y){const k=t-t0;if(k<0||t>=t1)return;const a=clamp((t1-t)/0.3,0,1);const p=popS(k);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,y);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  for(const[s,yy,sz,col]of lines){ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,yy);ctx.fillStyle=col;ctx.fillText(s,0,yy)}ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmo(e,cm);
  if(S==='hook'){spinArrows(cm,tt,tt<EV.stop?1:clamp(1-(tt-EV.stop)/0.25,0,1),'#5af0ff');if(tt>=EV.stop){const k=tt-EV.stop;if(k<0.5){const c=prj([0,0,0]);if(c)glowAt(c,700,'255,90,138',0.5*(1-k/0.5))}
      const c=prj([0,0,0]);if(c&&k>0.15)tag('🛑 SPIN: 0',[c[0],c[1]+430],'#ff5a8a',seg(k,0.15,0.4))}}
  if(S==='end'){spinArrows(cm,tt,1,'#5af0ff')}
  if(S==='idea'){const L=[[0,'EQUATOR · 1,670 km/h','#ffd84a',EV.idea+0.6,'255,216,74'],[0.71,'NEW YORK · 1,260 km/h','#5af0ff',EV.idea+1.2,'90,240,255'],[1.45,'NORTH POLE · 0 km/h','#7dff9a',EV.idea+1.8,'125,255,154']];
    for(const[lat,s,col,t0,rgb]of L){const k=seg(tt,t0,t0+0.3);if(k<=0)continue;const gp=globePt(cm,lat,lat>1.4?0:0.12);const p=prj(gp);if(!p)continue;pin(p,rgb,k);const tx=clamp(p[0]+(lat>1.4?0:150),250,W-250);tag(s,[tx,p[1]-(lat>1.4?70:58)],col,k)}
    const k=seg(tt,EV.idea+0.2,EV.idea+0.5);if(k>0)spinArrows(cm,tt*0.3,k*0.7,'#5af0ff')}
  if(S==='r1'){const ks=flyOff(tt);speedLines(tt,seg(ks,0,0.3));if(tt<EV.fly){const c=prj([0,0,0]);}
    const k=seg(ks,0.1,0.4);tag('🐢 SLOW-MO ×100',[W/2,1480],'#ffffff',k);if(ks>0.5){const p=prj(SPOBJ[0]);if(p)tag('🚗 1,670 km/h',[clamp(p[0],220,W-220),p[1]-150],'#ffd84a',seg(ks,0.5,0.8)*clamp((ks-0)*1,0,1))}
    if(tt<EV.fly&&tt>EV.r1+0.5)pill('🌍 a normal day…',560,'rgba(125,255,154,0.8)',seg(tt,EV.r1+0.5,EV.r1+0.7),40)}
  if(S==='r2'){windStreaks(cm,tt,seg(tt,EV.r2+0.3,EV.r2+0.8));const c=prj([0,0,0]);if(c){tag('🛑 GROUND: STOPPED',[W/2-200,1520],'#ff5a8a',seg(tt,EV.r2+0.9,EV.r2+1.2));tag('💨 AIR: 1,670 km/h',[W/2+200,1520],'#5af0ff',seg(tt,EV.r2+1.5,EV.r2+1.8))}}
  if(S==='r3'){const p=prj(SPOBJ[0]);const k=seg(tt,EV.r3+1.6,EV.r3+2.0);if(p)tag('🌊 ≈ 1,670 km/h',[clamp(p[0],220,W-220),clamp(p[1]-80,520,1500)],'#5af0ff',k*clamp((EV.r3+5.4-tt)/0.3,0,1));if(tt>EV.r3+5.6){const kk=tt-EV.r3-5.6;if(kk<0.6){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-kk/0.6)})`;ctx.fillRect(0,0,W,H)}}}
  if(S==='r4'){const np=prj([0,1.0,0]);const k=seg(tt,EV.r4+1.4,EV.r4+1.8);if(np){pin(np,'125,255,154',k);tag('NORTH POLE · 0 km/h ✅',[np[0],np[1]-70],'#7dff9a',k)}
    if(SPISSP){const ip=prj(SPISSP);const k2=seg(tt,EV.r4+4.8,EV.r4+5.2);if(ip&&k2>0){glowAt(ip,60,'255,255,255',0.6*k2);tag('🛰️ ISS: totally fine',[clamp(ip[0],220,W-220),ip[1]+70],'#ffffff',k2)}}}
  if(S==='r5'&&tt>=EV.back){spinArrows(cm,tt,clamp((tt-EV.back)/0.3,0,1),'#7dff9a');const k=tt-EV.back;if(k<0.5){const c=prj([0,0,0]);if(c)glowAt(c,700,'125,255,154',0.45*(1-k/0.5))}}
  if(S==='never'){const mk=ease(seg(tt,EV.morph,EV.morph+2.6));if(mk>0.5){const k=seg(tt,EV.morph+2.0,EV.morph+2.4);const n1=prj(globePt(cm,1.05,0));const e1=prj(globePt(cm,0.0,-0.25));const s1=prj(globePt(cm,-1.0,0.1));
      if(n1)tag('🌊 NORTH POLAR OCEAN',[n1[0],n1[1]],'#5af0ff',k);if(e1)tag('🌍 MEGA-CONTINENT',[e1[0],e1[1]],'#ffd84a',seg(tt,EV.morph+2.5,EV.morph+2.9));if(s1)tag('🌊 SOUTH POLAR OCEAN',[s1[0],s1[1]],'#5af0ff',seg(tt,EV.morph+3.0,EV.morph+3.4))}}
  if(S==='day'){const c=prj([0,0,0]);if(c){tag('☀️ DAY SIDE',[c[0]-230,c[1]+420],'#ffd84a',seg(tt,EV.day+0.5,EV.day+0.8));tag('🌑 NIGHT SIDE',[c[0]+230,c[1]+420],'#c8d0ff',seg(tt,EV.day+0.8,EV.day+1.1))}glowAt([-120,H*0.48],700,'255,220,150',0.45)}
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  // title (hook)
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if EARTH 🌍',-90,100,'#ffffff');L('STOPPED SPINNING',25,120,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  bigTitle([['What if it',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['spun again? 😳',150,96,'#ffffff']],EV.never,EV.morph+0.1,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(6.4,EV.r1,'EARTH\'S SPIN AT THE EQUATOR','1,670 km/h 🌀','#ffd84a');card(15.2,EV.r2,'SPEED OF SOUND','1,235 km/h 🔊','#5af0ff');
  card(20.3,EV.r3,'WORST TORNADO WIND EVER (1999)','≈ 484 km/h 🌪️','#ff5a8a');card(27.3,30.0,'OCEANS MOVING AT','≈ 465 m/s 🌊','#5af0ff');
  card(35.8,EV.r5,'THE ISS ORBITS AT','≈ 28,000 km/h 🛰️','#7dff9a');card(48.5,EV.day,'ESRI SIMULATION (2010)','OCEANS → POLES 🌊','#5af0ff');card(53.4,EV.endc,'ONE DAY WOULD LAST','≈ 365 DAYS 📅','#ffd84a');
  roundBar(tt);
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.stop,0.8,0.35,'255,90,138');flash(EV.idea,0.4,0.3);flash(EV.r1,0.6,0.3);flash(EV.fly,0.7,0.35);flash(EV.r2,0.4,0.3);flash(EV.r3,0.4,0.3);flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,0.8,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.morph,0.4,0.3);flash(EV.day,0.4,0.3);flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.7*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.4*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('Where would YOU be?',-70,92,'#ffffff');L('EQUATOR 💀 or POLE 😎',45,86,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
