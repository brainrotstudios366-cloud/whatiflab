// ============================ FASTER THAN LIGHT ====================
const DURA=67,LOOPA=66.6;
const TA={laps:2.6,demo:6.6,rocket:10.2,graph:16.3,inf:21.65,cern:27.7,photon:37.35,cause:40.4,expand:47.7,sun:56.3,endc:60.4};
const BLUE=[80,170,255],RED=[255,80,90],GOLD=[255,214,90],LIGHT=[255,240,170];
const segA=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function sceneA(t){if(t<TA.laps)return'title';if(t<TA.rocket)return'laps';if(t<TA.graph)return'rocket';if(t<TA.cern)return'graph';if(t<TA.photon)return'cern';if(t<TA.cause)return'photon';if(t<TA.expand)return'cause';if(t<TA.sun)return'expand';return'sun'}
//@@HELPERS@@
function beam(x1,y1,x2,y2,w,a){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a==null?1:a;ctx.lineCap='round';ctx.strokeStyle='rgba(255,230,150,0.35)';ctx.lineWidth=w*4;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle='rgba(255,250,220,1)';ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore()}
function rocket(x,y,s,rot,flame){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);
  if(flame>0){ctx.save();ctx.globalCompositeOperation='lighter';const L=120+flame*260+Math.sin(Date.now())*0;const g=ctx.createLinearGradient(-60,0,-60-L,0);g.addColorStop(0,'rgba(255,240,180,1)');g.addColorStop(0.4,'rgba(255,140,40,0.8)');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-60,-28);ctx.lineTo(-60-L,0);ctx.lineTo(-60,28);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.fillStyle='#e8ecf2';ctx.beginPath();ctx.moveTo(110,0);ctx.quadraticCurveTo(60,-48,-60,-42);ctx.lineTo(-60,42);ctx.quadraticCurveTo(60,48,110,0);ctx.fill();ctx.fillStyle='#d84a3a';ctx.beginPath();ctx.moveTo(110,0);ctx.quadraticCurveTo(90,-28,70,-36);ctx.lineTo(70,36);ctx.quadraticCurveTo(90,28,110,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(-40,-42);ctx.lineTo(-80,-80);ctx.lineTo(-62,-40);ctx.fill();ctx.beginPath();ctx.moveTo(-40,42);ctx.lineTo(-80,80);ctx.lineTo(-62,40);ctx.fill();
  ctx.fillStyle='#5ab0ff';ctx.beginPath();ctx.arc(30,0,16,0,7);ctx.fill();ctx.strokeStyle='#2a3a5a';ctx.lineWidth=5;ctx.stroke();ctx.restore()}
function sun(x,y,r,t){ctx.save();ctx.globalCompositeOperation='lighter';glow(x,y,r*3,[255,180,60],0.5);glow(x,y,r*1.6,[255,220,120],0.8);ctx.restore();const g=ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.1,x,y,r);g.addColorStop(0,'#fff6c0');g.addColorStop(1,'#ffa020');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
function galaxy(x,y,r,rot,a){ctx.save();ctx.globalAlpha=a==null?1:a;ctx.translate(x,y);ctx.rotate(rot);ctx.globalCompositeOperation='lighter';for(let j=0;j<70;j++){const an=j*0.45,dd=r*j/70;ctx.fillStyle=`rgba(${200+hash(j,3)*55|0},${190+hash(j,4)*60|0},255,0.75)`;ctx.fillRect(Math.cos(an)*dd,Math.sin(an)*dd*0.5,3,3);ctx.fillRect(-Math.cos(an)*dd,-Math.sin(an)*dd*0.5,3,3)}glow(0,0,r*0.6,[255,230,200],0.6);ctx.restore()}
// ---------------- scenes ----------------
function drawTitle(t){space(t,'#03030f','#0c0824',0.5);const k=(t*0.9)%1.2;const x=-300+k*1700;beam(x-600,1150,x,1150,10);ctx.save();ctx.globalCompositeOperation='lighter';glow(x,1150,160,LIGHT,0.9);ctx.restore()}
function drawLaps(t){space(t);const cx=W/2,cy=1020,R=300;earth(cx,cy,R,t);
  let ang;if(t<TA.demo){ang=t*2.2}else{const k=segA(t,TA.demo,TA.demo+2.4);ang=TA.demo*2.2+k*7.5*6.283}
  const o=R+70;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const a=ang-i*0.03;ctx.fillStyle=`rgba(255,240,170,${0.9*(1-i/40)})`;ctx.beginPath();ctx.arc(cx+Math.cos(a)*o,cy+Math.sin(a)*o*0.9,12*(1-i/40)+3,0,7);ctx.fill()}glow(cx+Math.cos(ang)*o,cy+Math.sin(ang)*o*0.9,90,LIGHT,0.9);ctx.restore();
  if(t>=TA.demo){const k=segA(t,TA.demo,TA.demo+2.4);const a=segA(t,TA.demo,TA.demo+0.2);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(15,10,30,0.75)';rrect(240,1440,600,180,30);ctx.fill();txt((k*1).toFixed(2)+' s',400,1530,72,'#ffffff');txt('LAPS: '+(k*7.5).toFixed(1),690,1530,52,'#ffd84a');ctx.restore()}}
function drawRocket(t){const lt=t-TA.rocket;const sp=segA(t,TA.rocket,TA.graph);space(t,'#03030f','#0a0820');
  ctx.save();for(let i=0;i<160;i++){const y=hash(i,1)*H,spd=300+hash(i,2)*900;const x=((hash(i,3)*W-lt*spd*(1+sp*4))%W+W)%W;const L=10+sp*120;ctx.strokeStyle=`rgba(255,255,255,${0.3+0.4*hash(i,4)})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+L,y);ctx.stroke()}ctx.restore();
  rocket(W/2+Math.sin(t*20)*3*sp,860,1.5,0,0.4+sp);
  // speedometer
  const gx=W/2,gy=1330,gr=170;ctx.save();ctx.lineWidth=26;ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.beginPath();ctx.arc(gx,gy,gr,Math.PI,2*Math.PI);ctx.stroke();const v=0.9*ease(sp);ctx.strokeStyle=v>0.8?'#ff6b6b':'#ffd84a';ctx.beginPath();ctx.arc(gx,gy,gr,Math.PI,Math.PI+Math.PI*v);ctx.stroke();ctx.restore();
  txt(Math.round(v*100)+'% c',gx,gy-40,60,'#ffffff');txt('SPEED',gx,gy+20,30,'rgba(255,255,255,0.7)')}
const gam=v=>1/Math.sqrt(Math.max(1e-9,1-v*v));
function drawGraph(t){space(t,'#05061a','#0a0a22');grid(t,0.06);const X0=150,Y0=1450,GW=780,GH=820;
  ctx.save();ctx.strokeStyle='rgba(255,255,255,0.8)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(X0,Y0-GH-40);ctx.lineTo(X0,Y0);ctx.lineTo(X0+GW+30,Y0);ctx.stroke();ctx.restore();
  txt('SPEED →',X0+GW/2,Y0+60,36,'rgba(255,255,255,0.8)');ctx.save();ctx.translate(X0-60,Y0-GH/2);ctx.rotate(-Math.PI/2);txt('ENERGY →',0,0,36,'rgba(255,255,255,0.8)');ctx.restore();
  // light-speed wall
  const wx=X0+GW;ctx.save();ctx.setLineDash([18,14]);ctx.strokeStyle='rgba(255,90,90,0.9)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(wx,Y0);ctx.lineTo(wx,Y0-GH-60);ctx.stroke();ctx.restore();txt('LIGHT SPEED',wx-10,Y0-GH-90,34,'#ff8a8a','right');
  const ey=g=>Y0-Math.min(GH+200,(g-1)/7*GH*0.55+40);
  const vmax=t<TA.inf?0.99*ease(segA(t,TA.graph,TA.graph+3.2)):0.99+0.0099*segA(t,TA.inf,TA.inf+3);
  ctx.save();ctx.beginPath();ctx.rect(X0,Y0-GH-60,GW+20,GH+60);ctx.clip();ctx.strokeStyle='#ffd84a';ctx.lineWidth=8;ctx.lineJoin='round';ctx.beginPath();const N=200;for(let i=0;i<=N;i++){const v=vmax*i/N;const x=X0+v*GW,y=ey(gam(v));i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  const dx=X0+vmax*GW,dy=ey(gam(vmax));ctx.globalCompositeOperation='lighter';glow(dx,Math.max(dy,Y0-GH-40),60,GOLD,0.9);ctx.restore();
  if(t>=TA.graph+3.2&&t<TA.inf){const a=segA(t,TA.graph+3.2,TA.graph+3.5);label('99% → 7× energy',X0+GW*0.55,ey(7.09)-60,50,'#ffd84a',a)}
  if(t>=TA.inf){const a=segA(t,TA.inf+0.8,TA.inf+1.1);label('∞',wx-80,Y0-GH+60,160*popS(t-TA.inf-0.8),'#ff6b6b',a);label('more than the whole universe',W/2,Y0-GH-170,46,'#ffffff',segA(t,TA.inf+2.6,TA.inf+2.9))}}
function drawCern(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1424');g.addColorStop(1,'#14243a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);grid(t,0.08);
  const k=easeOut(segA(t,TA.cern,TA.cern+0.6));ctx.save();ctx.translate(W/2,860);ctx.scale(k,k*0.55);ctx.strokeStyle='#4a6a9a';ctx.lineWidth=60;ctx.beginPath();ctx.arc(0,0,380,0,7);ctx.stroke();ctx.strokeStyle='#8ab0e0';ctx.lineWidth=10;ctx.beginPath();ctx.arc(0,0,380,0,7);ctx.stroke();ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';const a=t*9;for(let j=0;j<22;j++){const b=a-j*0.04;glow(W/2+Math.cos(b)*380*k,860+Math.sin(b)*380*k*0.55,26,[120,200,255],0.6*(1-j/22))}particle(W/2+Math.cos(a)*380*k,860+Math.sin(a)*380*k*0.55,16,BLUE,'+',1);ctx.restore();
  const p=segA(t,TA.cern+3.2,TA.cern+6.5);const digs='99.9999991';const shown=p<1?digs.slice(0,Math.max(2,Math.floor(p*digs.length))):digs;ctx.save();ctx.fillStyle='rgba(15,10,30,0.78)';rrect(90,1160,900,200,36);ctx.fill();ctx.restore();
  txt(shown+'% c',W/2,1260,fitSize('99.9999991% c',820,104),'#7dff9a');
  if(t>=TA.cern+7.0){const kk=popS(t-TA.cern-7.0);label('≠ 100% ❌',W/2,1460,70*kk,'#ff6b6b')}}
function drawPhoton(t){space(t,'#05040f','#0f0a22');const lt=t-TA.photon;const x=((lt*900)%1500)-200;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,230,140,0.95)';ctx.lineWidth=8;ctx.beginPath();for(let i=0;i<=60;i++){const xx=x-300+i*5;ctx.lineTo(xx,820+Math.sin(i*0.6-lt*30)*40*(i/60))}ctx.stroke();glow(x,820,90,LIGHT,0.9);ctx.restore();
  label('PHOTON 💡',W/2,680,58,'#ffd84a');label('mass = 0',W/2,960,64,'#ffffff');rocket(W/2,1130,1.0,0,0.2);label('rocket: mass > 0',W/2,1260,52,'rgba(255,255,255,0.8)')}
function drawCause(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0a2a');g.addColorStop(1,'#0a0618');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);grid(t,0.06);const lt=t-TA.cause;
  // clock running backwards
  const cx=W/2,cy=760,r=230;ctx.fillStyle='#f4f0e6';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.strokeStyle='#3a2a4a';ctx.lineWidth=16;ctx.stroke();for(let i=0;i<12;i++){const a=i/12*6.283;ctx.fillStyle='#3a2a4a';ctx.fillRect(cx+Math.cos(a)*(r-40)-6,cy+Math.sin(a)*(r-40)-6,12,12)}
  const am=-lt*6,ah=-lt*0.5;ctx.strokeStyle='#2a1a3a';ctx.lineCap='round';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ah)*120,cy-Math.cos(ah)*120);ctx.stroke();ctx.strokeStyle='#d84a3a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(am)*190,cy-Math.cos(am)*190);ctx.stroke();
  label('⏪',cx,cy+r+70,90,'#fff');
  if(lt>1.2){const k=popS(lt-1.2);ctx.save();ctx.translate(W/2,1300);ctx.scale(k,k);ctx.fillStyle='rgba(255,255,255,0.95)';rrect(-400,-90,800,180,40);ctx.fill();txt('📩 Message from',0,-30,48,'#1a1a2a');txt('TOMORROW',0,35,58,'#d84a3a');ctx.restore()}
  if(lt>4.0)label('effect BEFORE cause 🤯',W/2,1530,54,'#ffd84a',segA(t,TA.cause+4.0,TA.cause+4.3))}
function drawExpand(t){space(t,'#020210','#08061c');const lt=t-TA.expand;const sc=1+lt*0.22;const cx=W/2,cy=980;
  ctx.save();ctx.strokeStyle='rgba(120,140,255,0.15)';ctx.lineWidth=2;for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(cx+i*90*sc,0);ctx.lineTo(cx+i*90*sc,H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,cy+i*90*sc);ctx.lineTo(W,cy+i*90*sc);ctx.stroke()}ctx.restore();
  for(let i=0;i<10;i++){const gx=(hash(i,31)-0.5)*7,gy=(hash(i,32)-0.5)*9;const x=cx+gx*90*sc,y=cy+gy*90*sc;galaxy(x,y,30+hash(i,33)*30,t*0.2+i);const d=Math.hypot(gx,gy);if(d>3.2&&lt>3.5){ctx.save();ctx.globalAlpha=segA(t,TA.expand+3.5,TA.expand+3.9);ctx.strokeStyle='#ff8a8a';ctx.lineWidth=5;const ux=gx/d,uy=gy/d;ctx.beginPath();ctx.moveTo(x+ux*50,y+uy*50);ctx.lineTo(x+ux*130,y+uy*130);ctx.stroke();ctx.restore()}}
  galaxy(cx,cy,50,t*0.2,1);label('📍 US',cx,cy+80,44,'#ffd84a');if(lt>3.6)label('faster than light!',W/2,1560,56,'#ff8a8a',segA(t,TA.expand+3.6,TA.expand+3.9))}
function drawSunS(t){space(t);const lt=t-TA.sun;sun(220,940,140,t);earth(880,940,70,t);const k=segA(t,TA.sun+0.3,TA.sun+3.6);const x=360+k*450;beam(360,940,x,940,8);ctx.save();ctx.globalCompositeOperation='lighter';glow(x,940,70,LIGHT,0.9);ctx.restore();
  const m=Math.floor(k*500/60),s=Math.floor(k*500)%60;ctx.save();ctx.fillStyle='rgba(15,10,30,0.75)';rrect(290,1120,500,150,30);ctx.fill();ctx.restore();txt(m+' min '+String(s).padStart(2,'0')+' s',W/2,1195,64,'#ffd84a')}
// ---------------- captions ----------------
const capsA=[[0.2,2.5,'⚡ Why can\'t anything beat light?'],[2.7,10.1,'💡 300,000 km every second'],[10.3,16.2,'🚀 Faster = more energy needed'],[16.4,21.5,'At 99% → 7× the energy'],[21.75,27.6,'At 100% → INFINITE energy'],
  [27.8,37.2,'⚛️ Fastest thing humans built'],[37.45,40.3,'Light has zero mass'],[40.5,47.6,'⏪ Faster = messages to the past'],[47.8,56.2,'🌌 But space itself can beat light'],[56.4,60.3,'☀️ You see the Sun 8 min late']];
//@@COMMON@@
function drawTitleA(t){const a=t<2.3?1:clamp((2.6-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,760);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('Why can\'t anything go',0,-90,fitSize('Why can\'t anything go',980,84),'#ffffff');txt('FASTER THAN LIGHT?',0,30,fitSize('FASTER THAN LIGHT?',980,120),'#ffd84a');ctx.restore()}
function drawStatsA(t){const box=(a,b,lab,val,col)=>{if(t>=a&&t<b)statBoxM(lab,val,col,Math.min(1,(t-a)/0.25,(b-t)/0.2))};
  box(TA.laps+0.4,TA.demo,'SPEED OF LIGHT','299,792 km/s','#ffd84a');box(TA.rocket+0.6,TA.graph,'ENGINE','MORE POWER 🔥','#ffffff');
  box(TA.photon+0.4,TA.cause,'PHOTON MASS','0','#7dff9a');box(TA.expand+0.5,TA.expand+3.5,'UNIVERSE','EXPANDING','#9fd0ff');box(TA.sun+0.4,TA.endc,'ANDROMEDA','2.5 MILLION YEARS LATE','#ffd84a')}
function drawEndA(t){const k=ease((t-TA.endc)/0.5)*clamp((LOOPA-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.8*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-TA.endc<0.5?0.7+0.3*ease((t-TA.endc-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,760);ctx.scale(pop,pop);txt('NEXT VIDEO:',0,-150,56,'#ffffff');txt('Why astronauts',0,-40,92,'#ffd84a');txt('age slower ⏳',0,70,92,'#ffd84a');ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-TA.endc-0.6)/0.4);txt('Follow so you don\'t miss it 🔔',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
function renderSceneA(t){ctx.save();const S=sceneA(t);let sh=0;const sk=(t0,a,d)=>{const k=t-t0;if(k>=0&&k<d)sh+=a*(1-k/d)};sk(TA.inf+0.8,18,0.5);if(t>=TA.rocket&&t<TA.graph)sh+=segA(t,TA.rocket,TA.graph)*6;if(sh)ctx.translate((hash(Math.floor(t*60),1)-0.5)*sh,(hash(Math.floor(t*60),2)-0.5)*sh);
  ({title:drawTitle,laps:drawLaps,rocket:drawRocket,graph:drawGraph,cern:drawCern,photon:drawPhoton,cause:drawCause,expand:drawExpand,sun:drawSunS})[S](t);ctx.restore()}
const CUTS=[TA.laps,TA.rocket,TA.graph,TA.cern,TA.photon,TA.cause,TA.expand,TA.sun];
