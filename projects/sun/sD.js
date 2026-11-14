// ================= SUN VANISHES: overlays =================

function arrowLine(x0,y0,x1,y1,col,w,a){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1+Math.cos(an)*w*1.6,y1+Math.sin(an)*w*1.6);ctx.lineTo(x1+Math.cos(an+2.4)*w*2.2,y1+Math.sin(an+2.4)*w*2.2);ctx.lineTo(x1+Math.cos(an-2.4)*w*2.2,y1+Math.sin(an-2.4)*w*2.2);ctx.fill();ctx.restore()}
function clock(x,y,r,ang,a,col){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.fillStyle='rgba(8,10,30,0.82)';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=6;ctx.stroke();for(let i=0;i<12;i++){const q=i/12*TAU2;ctx.beginPath();ctx.moveTo(Math.cos(q)*r*0.78,Math.sin(q)*r*0.78);ctx.lineTo(Math.cos(q)*r*0.9,Math.sin(q)*r*0.9);ctx.stroke()}
  ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ang-Math.PI/2)*r*0.72,Math.sin(ang-Math.PI/2)*r*0.72);ctx.stroke();ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ang/12-Math.PI/2)*r*0.45,Math.sin(ang/12-Math.PI/2)*r*0.45);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.restore()}
// ---- captions: [start,end,text]; ^WORD = yellow, ~WORD = pink
const CAPS=[[1.38,3.1,'~POOF 💨'],[3.3,4.6,'EARTH?'],[4.6,6.1,'^NO idea 😎'],[6.1,8.5,'Still ^SUNNY ☀️'],
 [8.7,10.2,'The ^LAST sunlight'],[10.2,11.9,'is still flying 💨'],[11.9,13.6,'^150 MILLION km'],[13.6,15.3,'to go…'],
 [15.5,17.0,'Even ^GRAVITY'],[17.0,18.7,'has NO idea 🤯'],[18.7,21.3,'^STILL orbiting'],
 [24.0,25.6,'~LIGHTS OUT 🌑'],[25.6,27.9,'Day → ^NIGHT'],
 [28.6,30.2,'^STARS at noon ✨'],[30.2,32.5,'Solar power?'],
 [33.1,34.7,'Gravity ~GONE'],[34.7,36.0,'Earth flies ^STRAIGHT'],[36.0,37.1,'…by a tiny bit 🤏'],
 [37.8,39.3,'The ^MOON?'],[39.3,40.5,'~DARK too 🌑'],[40.5,41.7,'Moonlight = sunlight'],
 [45.3,46.4,'^LIGHTS ON ☀️'],[46.4,47.4,'Phew 😮‍💨'],
 [47.5,49.2,'But the darkness…'],[49.2,51.0,'keeps ^TRAVELING'],[51.0,53.2,'past every planet 🪐'],[53.2,55.2,'Neptune: ^4 HOURS'],[55.2,57.0,'^VOYAGER 1 🛰️'],
 [57.1,58.8,'^ALIENS 👽'],[58.8,60.2,'^4.2 YEARS later…'],[60.2,61.5,'see our Sun ~BLINK']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1270);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function fmtT(s){s=Math.max(0,Math.round(s));const m=Math.floor(s/60),r=s%60;return m+':'+String(r).padStart(2,'0')}
function sinceS(t){if(t<EV.gone)return 0;if(t<EV.race)return t-EV.gone;const k=seg(t,EV.race,EV.later);return (EV.race-EV.gone)+(500-(EV.race-EV.gone))*Math.pow(k,1.5)}
function pill(s,y,col,a,size){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.font=`900 ${size||44}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width+64;ctx.fillStyle='rgba(8,10,30,0.82)';rrect(W/2-w/2,y-40,w,80,40);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;rrect(W/2-w/2,y-40,w,80,40);ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,W/2,y+2);ctx.restore()}
function atmo(e,cm){const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;const a=1-0.75*e.dk;
  ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.45,`rgba(110,190,255,${0.55*a})`);g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore()}
function camBasisB(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function sunGlow(cm,t,a){if(!SUNP)return;const c=prj(SUNP.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(SUNP.p,V.sc(b.r,SUNP.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);
  glowAt(c,r*2.6,'255,120,20',0.45*a);glowAt(c,r*1.45,'255,200,110',0.65*a);ctx.save();ctx.globalCompositeOperation='screen';ctx.translate(c[0],c[1]);for(let i=0;i<48;i++){const an=i/48*TAU2+t*0.05;const L=r*(1.15+0.5*fbm(i*0.7+t*0.6,i*0.3,2));const g=ctx.createLinearGradient(Math.cos(an)*r*0.95,Math.sin(an)*r*0.95,Math.cos(an)*L,Math.sin(an)*L);g.addColorStop(0,`rgba(255,200,110,${0.35*a})`);g.addColorStop(1,'rgba(255,140,40,0)');ctx.strokeStyle=g;ctx.lineWidth=r*0.09;ctx.beginPath();ctx.moveTo(Math.cos(an)*r*0.95,Math.sin(an)*r*0.95);ctx.lineTo(Math.cos(an)*L,Math.sin(an)*L);ctx.stroke()}ctx.restore()}
function ghostSun(p,r,a,label){if(!p||a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.setLineDash([16,12]);ctx.strokeStyle='rgba(255,216,74,0.85)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();if(label)tag(label,[p[0],p[1]-r-50],'#ffd84a',a)}
function circ3(R,y){const pts=[];for(let i=0;i<=128;i++){const a=i/128*TAU2;pts.push(prj([Math.cos(a)*R,y||0,Math.sin(a)*R]))}return pts}
function strokePts(pts,col,w,dash){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=w;if(dash)ctx.setLineDash(dash);ctx.beginPath();let on=false;for(const p of pts){if(!p){on=false;continue}if(!on){ctx.moveTo(p[0],p[1]);on=true}else ctx.lineTo(p[0],p[1])}ctx.stroke();ctx.restore()}
// burst particles at sun vanish
function poofFX(c,r,k){if(k<0||k>1.4)return;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<90;i++){const an=hsh(i,1)*TAU2,d=r*(0.4+hsh(i,2)*0.6)+k*r*(1.5+hsh(i,4)*3.5);const s=4+hsh(i,3)*9;ctx.fillStyle=`rgba(255,${180+hsh(i,5)*70|0},90,${(1-k/1.4)})`;ctx.fillRect(c[0]+Math.cos(an)*d-s/2,c[1]+Math.sin(an)*d-s/2,s,s)}
  const g=ctx.createRadialGradient(c[0],c[1],0,c[0],c[1],r*(1+k*5));g.addColorStop(0,`rgba(255,240,200,${0.9*Math.max(0,1-k/0.6)})`);g.addColorStop(1,'rgba(255,160,60,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
function lightBeam(t){// race: sunlight column from ghost sun to Earth, dark front chasing
  const top=prj([0,7.2,0]),bot=prj([0,-3.7,0]);if(!top||!bot)return;const f=Math.pow(seg(t,EV.race,EV.later),1.5)*0.92;const yD=lerp(top[1],bot[1],f);
  ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createLinearGradient(0,yD,0,bot[1]);g.addColorStop(0,'rgba(255,216,74,0)');g.addColorStop(0.08,'rgba(255,216,74,0.5)');g.addColorStop(1,'rgba(255,240,180,0.35)');ctx.fillStyle=g;for(let j=0;j<8;j++){const w=60+j*45;ctx.globalAlpha=0.22;ctx.fillRect(W/2-w/2,yD,w,bot[1]-yD)}ctx.globalAlpha=1;
  for(let i=0;i<60;i++){const ph=(hsh(i,7)+t*0.9)%1;const y=lerp(yD,bot[1],ph);const x=W/2+(hsh(i,8)-0.5)*300;ctx.fillStyle=`rgba(255,240,190,${0.8*Math.sin(ph*Math.PI)})`;ctx.fillRect(x-3,y-14,6,28)}ctx.restore();
  ctx.save();ctx.strokeStyle='rgba(255,90,138,0.95)';ctx.lineWidth=6;ctx.setLineDash([22,14]);ctx.beginPath();ctx.moveTo(W/2-230,yD);ctx.lineTo(W/2+230,yD);ctx.stroke();ctx.restore();
  tag('🌑 DARKNESS FRONT',[W/2,yD-46],'#ff5a8a',seg(t,EV.race+0.4,EV.race+0.8));tag('☀️ last sunlight',[W/2+250,lerp(yD,bot[1],0.55)],'#ffd84a',seg(t,EV.race+1.0,EV.race+1.4))}
function bigCount(s,t0,t,col){const k=t-t0;if(k<0||k>0.7)return;const p=popS(k*0.8);ctx.save();ctx.globalAlpha=clamp((0.7-k)/0.15,0,1);ctx.translate(W/2,H*0.44);ctx.scale(p*1.2,p*1.2);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 300px Inter';ctx.lineWidth=40;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText(s,0,0);ctx.fillStyle=col;ctx.fillText(s,0,0);ctx.restore()}
function roundBar(t){if(t<EV.r1||t>=EV.back+0.6)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.back+0.6-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=840,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  for(let i=0;i<5;i++){const on=i<n;const lit=t>=EV.back;ctx.fillStyle=lit?'#ffd84a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+400+i*82,y-16,62,32,16);ctx.fill()}
  ctx.font='900 40px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t>=EV.back?'☀️ BACK!':`🌑 SECOND ${n}/5`,x0+36,y+2);ctx.restore();
  // big round title on each round start
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  // atmospheres, sun glow
  for(const e of EARTHS)atmo(e,cm);
  if(S==='hook'||S==='end'){sunGlow(cm,tt,S==='end'?1:clamp(sunScaleHook(tt),0,1));if(S==='hook'){const c=prj([0,0,0]);const q=prj([camBasisB(cm).r[0],camBasisB(cm).r[1],camBasisB(cm).r[2]]);const r=c&&q?Math.hypot(q[0]-c[0],q[1]-c[1]):300;if(c){poofFX(c,r,tt-EV.gone);ghostSun(c,r,seg(tt,EV.gone+0.5,EV.gone+0.9)*0.8,null)}}}
  if(S==='wave'){sunGlow(cm,tt,1)}
  if(S==='race'){const g=prj([0,7.2,0]);const q=prj([1.4,7.2,0]);if(g&&q){const r=Math.hypot(q[0]-g[0],q[1]-g[1]);ghostSun(g,r,seg(tt,EV.race,EV.race+0.4),'☀️ SUN: GONE')}lightBeam(tt)}
  if(S==='grav'||S==='r3'){const pts=circ3(ORB,0);strokePts(pts,'rgba(90,240,255,0.55)',4,[14,12]);const c=prj([0,0,0]);const q=prj([0.8,0,0]);if(c&&q)ghostSun(c,Math.max(30,Math.hypot(q[0]-c[0],q[1]-c[1])),0.85,S==='grav'&&tt<EV.grav+3.3?'☀️ (gone)':null);
    const ep=prj(orbPos(tt));if(S==='grav'&&ep&&c){const k=seg(tt,EV.grav+0.6,EV.grav+1.0);const dx=c[0]-ep[0],dy=c[1]-ep[1],L=Math.hypot(dx,dy);arrowLine(ep[0]+dx/L*70,ep[1]+dy/L*70,ep[0]+dx/L*min2(240,L*0.6),ep[1]+dy/L*min2(240,L*0.6),'#7dff9a',12,k);tag('🧲 PULL: STILL ON',[ep[0]+dx/L*150,ep[1]+dy/L*150-60],'#7dff9a',k)}
    if(S==='r3'&&ep){const th=orbTh(EV.r3);const p0=[Math.cos(th)*ORB,0,Math.sin(th)*ORB];const tg=[-Math.sin(th),0,Math.cos(th)];const a=prj(p0),b=prj(V.add(p0,V.sc(tg,3.2)));const k=seg(tt,EV.r3+1.6,EV.r3+2.0);if(a&&b){ctx.save();ctx.globalAlpha=k;strokePts([a,b],'rgba(255,216,74,0.95)',6,[20,12]);ctx.restore();arrowLine(ep[0],ep[1],lerp(ep[0],b[0],0.5),lerp(ep[1],b[1],0.5),'#ffd84a',12,k)}
      const k2=seg(tt,EV.r3+0.3,EV.r3+0.6);const cc=prj([0,0,0]);if(cc){tag('🧲 PULL: OFF',[ep[0],ep[1]-110],'#ff5a8a',k2)}}}
  if(S==='r4'&&MOONP){const m=prj(MOONP);if(m){const off=seg(tt,EV.r4+1.4,EV.r4+1.7);glowAt(m,200,'220,230,255',0.5*(1-off));tag(off<0.5?'🌕 FULL MOON':'🌑 …GONE',[m[0],m[1]+190],off<0.5?'#ffffff':'#ff5a8a',seg(tt,EV.r4+0.3,EV.r4+0.6))}}
  if(S==='r1'){const k=seg(tt,EV.r1+2.4,EV.r1+2.8);tag('🏙️ every city lights up',[W/2,1520],'#ffd84a',k*clamp((EV.r2-tt)/0.2,0,1))}
  if(S==='r2'){const hz=prj([0,0.2,-120]);if(hz){const g=ctx.createLinearGradient(0,hz[1]-160,0,hz[1]+40);g.addColorStop(0,'rgba(255,150,70,0)');g.addColorStop(1,'rgba(255,150,70,0.22)');ctx.fillStyle=g;ctx.fillRect(0,hz[1]-160,W,200)}for(const[p,c]of LEDP){const q=prj(p);if(q)glowAt(q,clamp(500/q[2],8,38),`${c[0]*255|0},${c[1]*255|0},${c[2]*255|0}`,0.7)}tag('🕛 12:00 NOON',[W/2,560],'#ffffff',seg(tt,EV.r2+0.9,EV.r2+1.2))}
  if(S==='wave'){const au=waveAU(tt);for(let i=0;i<6;i++){const R=AU2R(PL[i][1]);strokePts(circ3(R,0),'rgba(140,170,255,0.22)',2)}
    const R=AU2R(au);const pts=circ3(R,0);ctx.save();ctx.globalAlpha=0.9;strokePts(pts,'rgba(0,0,0,0.85)',22);ctx.globalCompositeOperation='screen';strokePts(pts,'rgba(255,90,138,0.9)',6);strokePts(circ3(R*1.012,0),'rgba(255,90,138,0.35)',14);ctx.restore();
    for(let i=0;i<6;i++){const p=prj(plPos(i));if(!p)continue;const hit=au>=PL[i][1];const k=hit?seg(au,PL[i][1],PL[i][1]*1.25+0.15):0;if(i===5)emojiAt('🛰️',p[0],p[1],60,1);
      const sec=PL[i][1]*499;const lab=i===5?'~1 DAY':sec<3600?Math.round(sec/60)+' MIN':Math.floor(sec/3600)+' H '+Math.round(sec%3600/60)+' MIN';
      const hT=hitT(i);const fo=i<5?clamp(1-(tt-hT-2.2)/0.4,0,1):1;if(k>0&&fo>0){glowAt(p,90,'255,90,138',0.6*(1-k));tag(PL[i][0]+' · '+lab,[clamp(p[0],230,W-230),p[1]+70],PL[i][2],ease(k)*fo)}}
    const sec=au*499;const v=sec<3600?fmtT(sec):sec<86400?Math.floor(sec/3600)+' h '+String(Math.round(sec%3600/60)).padStart(2,'0')+' min':(sec/86400).toFixed(1)+' days';pill('⏱ '+v+' after',225,'rgba(255,90,138,0.8)',seg(tt,EV.wave,EV.wave+0.3),46)}
  if(S==='prox')drawProx(tt);
  // vignette
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  // title
  if(tt<EV.idea-0.1&&S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if the SUN ☀️',-80,96,'#ffffff');L('DISAPPEARED',30,128,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  // since-timer
  if(tt>=EV.idea&&tt<EV.r1){const ff=tt>=EV.race;pill((ff?'⏩ ':'⏱ ')+fmtT(sinceS(tt))+' since the Sun vanished',225,'rgba(90,240,255,0.7)',seg(tt,EV.idea,EV.idea+0.3)*clamp((EV.later-tt)/0.2,0,1),42)}
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(5.9,EV.race,'SUNLIGHT TRAVEL TIME','8 MIN 20 S 🚀','#ffd84a');card(11.8,EV.grav,'SPEED OF LIGHT','300,000 km/s ⚡','#5af0ff');
  card(18.5,EV.later,'GRAVITY TRAVELS AT','THE SPEED OF LIGHT ⚡','#7dff9a');card(25.8,EV.r2,'DAYLIGHT LOST BY','≈ 4 BILLION PEOPLE','#ff5a8a');
  if(tt>=30.4&&tt<EV.r3){const v=Math.round(100*(1-seg(tt,30.7,31.5)));statCard('SOLAR PANELS ⚡',v+'%',v>0?'#ffd84a':'#ff5a8a',Math.min(tt-30.4,(EV.r3-tt)*4),430)}
  card(35.0,EV.r4,'EARTH LEAVES ITS ORBIT BY','ONLY ≈ 7 cm 🤏','#ffd84a');card(39.5,EV.r5,'THE FULL MOON GOES DARK','≈ 2.6 s AFTER US 🌑','#5af0ff');
  card(55.3,EV.prox,'VOYAGER 1 · NOV 18, 2026','1 LIGHT-DAY AWAY 🛰️','#7dff9a');
  if(S==='grav'&&tt>=EV.grav+3.4&&tt<EV.later){tag('(proven in 2017 🔭)',[W/2,560],'#c8f0ff',seg(tt,EV.grav+3.4,EV.grav+3.7))}
  if(S==='later'){const k=seg(tt,EV.later,EV.later+0.3);ctx.fillStyle=`rgba(0,0,8,${0.55*k})`;ctx.fillRect(0,0,W,H);clock(W/2,560,120,(tt-EV.later)*9,k,'#ffd84a');
    ctx.save();ctx.globalAlpha=k;const p=popS(tt-EV.later);ctx.translate(W/2,H*0.5);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.font='900 150px Inter';ctx.lineWidth=28;ctx.strokeStyle='#000';ctx.strokeText('8 MIN 20 S',0,-40);ctx.fillStyle='#ffd84a';ctx.fillText('8 MIN 20 S',0,-40);ctx.font='900 90px Inter';ctx.strokeText('LATER…',0,90);ctx.fillStyle='#fff';ctx.fillText('LATER…',0,90);ctx.restore()}
  roundBar(tt);
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+0.55,tt,'#ffffff');bigCount('2',EV.r5+1.3,tt,'#ffffff');bigCount('1',EV.r5+2.05,tt,'#ff5a8a');if(tt>EV.r5+2.8)emojiAt('😬',W/2,H*0.44,200,seg(tt,EV.r5+2.8,EV.r5+3.0))}
  if(S==='r5'&&tt>=EV.back){const k=tt-EV.back;glowAt([W*1.02,H*0.36],900,'255,220,150',0.75*Math.exp(-k*0.4));}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.idea,0.4,0.3);flash(EV.race,0.4,0.3);flash(EV.grav,0.4,0.3);flash(EV.later,0.3,0.3);flash(EV.r1,0.85,0.35,'0,0,0');flash(EV.r2,0.4,0.3,'0,0,20');flash(EV.r3,0.4,0.3);flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,0.9,0.6,'255,235,190');flash(EV.wave,0.5,0.3);flash(EV.prox,0.5,0.3);flash(EV.endc,0.5,0.3,'255,220,150');
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,240,210,${0.6*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function min2(a,b){return a<b?a:b}
const PXS=[];{const r=rngG(41);for(let i=0;i<500;i++)PXS.push([r()*W,r()*H,0.6+r()*2.2,r()])}
function drawProx(t){const k=seg(t,EV.prox,EV.prox+0.4);for(const s of PXS){ctx.fillStyle=`rgba(255,255,255,${0.25+0.5*s[3]})`;ctx.fillRect(s[0],s[1],s[2],s[2])}
  const S=[250,520],P=[800,1530];const blink=t>=60.2&&t<60.9;glowAt(S,140,'255,220,150',blink?0.08:0.85*k);glowAt(S,40,'255,250,230',blink?0.05:1*k);tag('☀️ OUR SUN',[S[0],S[1]-90],'#ffd84a',k);
  glowAt(P,170,'255,110,80',0.85*k);glowAt(P,45,'255,200,180',k);tag('PROXIMA CENTAURI',[P[0]-90,P[1]+110],'#ff8a5a',k);emojiAt('👽',P[0]-150,P[1]-90,120,seg(t,EV.prox+0.6,EV.prox+0.9));
  const f=seg(t,EV.prox+0.3,60.2);const d=Math.hypot(P[0]-S[0],P[1]-S[1]);ctx.save();ctx.setLineDash([16,14]);ctx.strokeStyle='rgba(90,240,255,0.6)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(S[0],S[1]);ctx.lineTo(P[0],P[1]);ctx.stroke();ctx.restore();
  const R=d*f;ctx.save();ctx.strokeStyle='rgba(255,90,138,0.9)';ctx.lineWidth=8;ctx.beginPath();ctx.arc(S[0],S[1],Math.max(1,R),-0.2,1.9);ctx.stroke();ctx.restore();
  tag('4.24 LIGHT-YEARS',[(S[0]+P[0])/2+150,(S[1]+P[1])/2-20],'#5af0ff',seg(t,EV.prox+0.8,EV.prox+1.1));
  if(t>=60.2){const q=popS(t-60.2);ctx.save();ctx.translate(P[0]-120,P[1]-420);ctx.scale(q,q);tag('“Did the Sun just blink?!”',[0,0],'#ffffff',1);ctx.restore()}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.7*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.4*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,400);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('Would YOU even notice',-60,84,'#ffffff');L('those 5 seconds? 👇',50,96,'#ffd84a');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});if(scn(tt)==='r2')items.shift();LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.02,far:3000},{center:[0,-9999,0],radius:1},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.gone,12,0.6);S(EV.r1,10,0.6);S(EV.r3,6,0.4);S(EV.back,12,0.7);S(EV.later,4,0.4);return a}

function hitT(i){for(let j=1;j<WKEY.length;j++)if(WKEY[j][1]>=PL[i][1]-1e-6)return WKEY[j][0];return 99}
