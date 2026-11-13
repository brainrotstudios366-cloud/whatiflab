// ============================ QUANTUM TUNNELING ====================
const DURA=61,LOOPA=60.6;
const TA={ball:2.85,wave:7.3,appear:15.4,tname:18.4,sun:21.0,phone:26.95,micro:30.6,nobel:34.75,wall:45.6,endc:53.4};
const BLUE=[80,170,255],RED=[255,80,90],GOLD=[255,214,90],LIGHT=[255,240,170],CYAN=[90,240,255];
const segA=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function sceneA(t){if(t<TA.ball)return'title';if(t<TA.wave)return'ball';if(t<TA.appear)return'wave';if(t<TA.sun)return'appear';if(t<TA.phone)return'sun';if(t<TA.micro)return'phone';if(t<TA.nobel)return'micro';if(t<TA.wall)return'nobel';return'wall'}
//@@HELPERS@@
function brick(x,y,w,h){ctx.fillStyle='#7a3a2a';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#5a2a1e';ctx.lineWidth=4;for(let r=0;r*50<h;r++){ctx.beginPath();ctx.moveTo(x,y+r*50);ctx.lineTo(x+w,y+r*50);ctx.stroke();for(let c=0;c*80<w+80;c++){const bx=x+c*80+(r%2)*40;if(bx>x&&bx<x+w){ctx.beginPath();ctx.moveTo(bx,y+r*50);ctx.lineTo(bx,y+r*50+50);ctx.stroke()}}}
  ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(x,y,w*0.25,h)}
function barrier(x,y,w,h){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#3a4a7a');g.addColorStop(0.5,'#6a7ab0');g.addColorStop(1,'#3a4a7a');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(160,180,255,0.8)';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h)}
function packet(cx,y,amp,dir,t,col,sig){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=col||'rgba(90,240,255,0.95)';ctx.lineWidth=7;ctx.beginPath();sig=sig||120;for(let i=-240;i<=240;i+=4){const x=cx+i;const e=Math.exp(-(i*i)/(2*sig*sig));const yy=y-Math.sin(i*0.07-dir*t*14)*amp*e;i===-240?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke();glow(cx,y,sig*1.2,CYAN,0.25*amp/120);ctx.restore()}
function person(x,y,s,lean){ctx.save();ctx.translate(x,y);ctx.rotate(lean||0);ctx.scale(s,s);ctx.fillStyle='#3a6aa0';rrect(-38,-120,76,120,10);ctx.fill();ctx.fillStyle='#2a2a3a';rrect(-36,0,32,130,8);ctx.fill();rrect(4,0,32,130,8);ctx.fill();ctx.fillStyle='#f5c99a';rrect(-30,-190,60,62,18);ctx.fill();ctx.fillStyle='#5a3a20';rrect(-32,-198,64,22,10);ctx.fill();ctx.fillStyle='#3a6aa0';rrect(-62,-118,24,100,10);ctx.fill();rrect(38,-118,24,100,10);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(10,-166,8,10);ctx.restore()}
// ---------------- scenes ----------------
function drawTitle(t){space(t,'#04040f','#0e0a26');grid(t,0.07);brick(W/2-80,880,160,620);const x=((t*500)%1400)-200;const inW=x>W/2-80&&x<W/2+80;particle(x,1190,40,CYAN,'',inW?0.35:1)}
function drawBall(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a2440');g.addColorStop(1,'#0e1426');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle='#2a3a2a';ctx.fillRect(0,1500,W,420);brick(760,820,160,680);
  const lt=t-TA.ball;const ph=(lt%1.4)/1.4;let x;if(ph<0.5)x=160+ph*2*580;else x=740-(ph-0.5)*2*580;const y=1440-Math.sin(ph*Math.PI)*320;
  ctx.fillStyle='#ff7a3a';ctx.beginPath();ctx.arc(x,y,50,0,7);ctx.fill();ctx.strokeStyle='#8a3a1a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,50,0.5,2.6);ctx.stroke();if(Math.abs(ph-0.5)<0.04)label('BONK',700,1000,60,'#ffffff');
  label('100% bounces back 🔁',W/2-60,700,52,'#ffffff',segA(t,TA.ball+1,TA.ball+1.3))}
function drawWave(t){space(t,'#04040f','#0b0a22');grid(t,0.06);const lt=t-TA.wave;barrier(W/2-35,760,70,700);const y=1110;const hit=3.2;
  if(lt<hit){packet(140+lt*(W/2-180)/hit,y,110,1,t)}else{const k=lt-hit;packet(W/2-180-k*120,y,90,-1,t,'rgba(90,240,255,0.9)');packet(W/2+180+k*120,y,32,1,t,'rgba(255,120,240,0.95)',90);
    if(k>0.6)label('a tiny part leaks through!',W/2+120,1340,44,'#ff9af0',segA(t,TA.wave+hit+0.6,TA.wave+hit+0.9))}
  if(lt>0.5&&lt<hit)label('electron = wave 🌊',W/2,620,56,'#9ff0ff',segA(t,TA.wave+0.5,TA.wave+0.8))}
function drawAppear(t){space(t,'#04040f','#0b0a22');grid(t,0.06);barrier(W/2-35,760,70,700);const lt=t-TA.appear;const y=1110;const jump=1.6;
  if(lt<jump){particle(240+lt*120,y,40,CYAN,'−',1)}else{const k=lt-jump;if(k<0.25){ctx.save();ctx.globalCompositeOperation='lighter';glow(W/2+220,y,200*(1-k*4)+40,[255,160,255],0.9);ctx.restore()}particle(W/2+220+k*80,y,40,CYAN,'−',1);ctx.save();ctx.globalAlpha=Math.max(0,1-k);ctx.globalCompositeOperation='lighter';for(let i=0;i<12;i++){const a=i/12*6.283;glow(W/2+220+Math.cos(a)*k*200,y+Math.sin(a)*k*200,20,[255,180,255],0.8)}ctx.restore()}
  if(t>=TA.tname){const k=popS(t-TA.tname);ctx.save();ctx.translate(W/2,1600);ctx.scale(k,k);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=16;txt('QUANTUM',0,-50,92,'#ffffff');txt('TUNNELING 👻',0,50,92,'#ff9af0');ctx.restore()}}
function drawSunQ(t){const lt=t-TA.sun;const g=ctx.createRadialGradient(W/2,1000,100,W/2,1000,1100);g.addColorStop(0,'#ffcc60');g.addColorStop(0.5,'#e86a20');g.addColorStop(1,'#5a1a08');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=0.2;for(let i=0;i<40;i++){ctx.fillStyle='#fff3c0';ctx.beginPath();ctx.arc(hash(i,1)*W,(hash(i,2)*H+lt*40)%H,30+hash(i,3)*60,0,7);ctx.fill()}ctx.restore();
  const meet=2.4;const k=segA(t,TA.sun,TA.sun+meet);const d=420*(1-easeOut(k))+60;
  if(lt<meet+0.2){// repulsion field
    ctx.save();ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=4;ctx.setLineDash([12,10]);ctx.beginPath();ctx.arc(W/2,1000,120,0,7);ctx.stroke();ctx.restore();particle(W/2-d,1000,55,RED,'+',1);particle(W/2+d,1000,55,RED,'+',1);if(lt>0.8&&lt<meet)label('they repel each other ⛔',W/2,780,46,'#ffffff')}
  else{const f=lt-meet-0.2;ctx.save();ctx.globalCompositeOperation='lighter';glow(W/2,1000,900*Math.exp(-f*1.2)+150,[255,255,230],Math.max(0.3,1-f*0.4));ctx.restore();particle(W/2,1000,70,GOLD,'He',1);label('FUSION ☀️ thanks to tunneling',W/2,1250,48,'#ffffff',segA(t,TA.sun+meet+0.5,TA.sun+meet+0.8))}}
function drawPhone(t){ctx.fillStyle='#0a0a12';ctx.fillRect(0,0,W,H);grid(t,0.05);const lt=t-TA.phone;
  ctx.fillStyle='#1a1a22';rrect(300,520,480,900,60);ctx.fill();ctx.fillStyle='#2a3a5a';rrect(325,560,430,820,40);ctx.fill();for(let i=0;i<9;i++){ctx.fillStyle=['#e86a4a','#4ab0e8','#e8c84a','#6ad86a','#c86ae8','#e84a8a','#4ae8c8','#8a8ae8','#e8a84a'][i];rrect(360+(i%3)*130,620+Math.floor(i/3)*130,100,100,20);ctx.fill()}
  // memory cell
  const cx=W/2,cy=1300;ctx.fillStyle='rgba(15,10,30,0.92)';rrect(110,1080,860,420,36);ctx.fill();ctx.fillStyle='#5a6a8a';ctx.fillRect(200,1330,680,60);ctx.fillStyle='#aab4c8';ctx.fillRect(200,1300,680,30);ctx.fillStyle='#e8c860';ctx.fillRect(200,1200,680,100);
  txt('STORAGE CELL',cx,1130,34,'#ffffff');txt('thin wall',880-10,1316,22,'#1a1a2a','right');
  for(let i=0;i<5;i++){const ph=((lt*0.8+i/5)%1);const x=260+i*130;const y=1360-ph*130;particle(x,y,14,CYAN,'',ph<0.9?1:1-(ph-0.9)*10)}
  label('📱 your photos',W/2,460,52,'#ffffff',segA(t,TA.phone+0.2,TA.phone+0.5))}
function drawMicro(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1020');g.addColorStop(1,'#141c34');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const lt=t-TA.micro;
  const tipX=200+((lt*160)%680);ctx.fillStyle='#c8ccd4';ctx.beginPath();ctx.moveTo(tipX-50,600);ctx.lineTo(tipX+50,600);ctx.lineTo(tipX,1030);ctx.closePath();ctx.fill();
  for(let r=0;r<4;r++)for(let c=0;c<9;c++){const x=140+c*100+(r%2)*50,y=1120+r*80;const hl=Math.abs(x-tipX)<50&&r===0;const gg=ctx.createRadialGradient(x-12,y-12,4,x,y,44);gg.addColorStop(0,hl?'#fff6c0':'#b8c8ff');gg.addColorStop(1,hl?'#e8a020':'#3a4a8a');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(x,y,42,0,7);ctx.fill()}
  ctx.save();ctx.globalCompositeOperation='lighter';glow(tipX,1060,60,CYAN,0.8);ctx.restore();label('🔬 seeing single ATOMS',W/2,460,52,'#ffffff',segA(t,TA.micro+0.2,TA.micro+0.5))}
function drawNobel(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a1408');g.addColorStop(1,'#0a0804');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const lt=t-TA.nobel;const k=popS(lt-0.3);
  ctx.save();ctx.translate(W/2,860);ctx.scale(k,k);ctx.save();ctx.globalCompositeOperation='lighter';glow(0,0,380,[255,200,90],0.4);ctx.restore();const gg=ctx.createRadialGradient(-60,-60,20,0,0,240);gg.addColorStop(0,'#fff0a0');gg.addColorStop(1,'#b07a10');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(0,0,240,0,7);ctx.fill();ctx.strokeStyle='#8a5a08';ctx.lineWidth=14;ctx.stroke();txt('NOBEL',0,-40,70,'#6a4a08');txt('2025',0,50,80,'#6a4a08');ctx.restore();
  if(lt>4.5){const a=segA(t,TA.nobel+4.5,TA.nobel+5);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#2a6a3a';rrect(330,1250,420,260,20);ctx.fill();ctx.strokeStyle='#e8c860';ctx.lineWidth=6;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(360,1280+i*40);ctx.lineTo(720,1280+i*40);ctx.stroke()}ctx.fillStyle='#1a1a1a';rrect(470,1320,140,120,10);ctx.fill();txt('chip',540,1380,30,'#e8c860');ctx.restore();label('⚛️ quantum computers',W/2,1580,50,'#7dff9a',segA(t,TA.nobel+7.5,TA.nobel+7.8))}}
function drawWall(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a2440');g.addColorStop(1,'#0e1426');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle='#2a3a2a';ctx.fillRect(0,1500,W,420);brick(700,780,180,720);const lt=t-TA.wall;const ph=(lt%1.2)/1.2;
  let x,lean=0;if(ph<0.55)x=180+ph/0.55*420;else{x=600-(ph-0.55)/0.45*200;lean=-0.3*(1-(ph-0.55)/0.45)}person(x,1370,1.6,lean);if(ph>0.55&&ph<0.7)label('💥',660,950,90,'#fff');
  const n=Math.floor(lt/1.2)+1;ctx.save();ctx.fillStyle='rgba(15,10,30,0.82)';rrect(240,560,600,140,30);ctx.fill();ctx.restore();txt('ATTEMPTS: '+n,W/2,630,56,'#ffffff')}
// ---------------- captions ----------------
const capsA=[[0.2,2.7,'👻 Walking through walls?'],[2.95,7.1,'🏀 A ball always bounces back'],[7.4,15.3,'🌊 But electrons are waves'],[15.5,20.9,'…so they can appear on the other side'],[21.1,26.8,'☀️ The Sun needs tunneling'],
  [27.05,30.5,'📱 It\'s in your phone'],[30.7,34.6,'🔬 It lets us see atoms'],[34.85,45.5,'🏅 Nobel Prize 2025'],[45.7,53.3,'🧱 Could YOU tunnel?']];
//@@COMMON@@
function drawTitleA(t){const a=t<2.5?1:clamp((2.85-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,640);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('Particles that walk',0,-70,fitSize('Particles that walk',980,96),'#ffffff');txt('through WALLS 👻',0,50,fitSize('through WALLS 👻',980,110),'#ffd84a');ctx.restore()}
function drawStatsA(t){const box=(a,b,lab,val,col)=>{if(t>=a&&t<b)statBoxM(lab,val,col,Math.min(1,(t-a)/0.25,(b-t)/0.2))};
  box(TA.sun+3.0,TA.phone,'SUN CORE','15 MILLION °C','#ffd84a');box(TA.nobel+1.2,TA.nobel+4.4,'WINNERS','3 PHYSICISTS 🧪','#ffffff');
  box(TA.wall+2.4,TA.endc,'TIME NEEDED','> AGE OF THE UNIVERSE','#ff6b6b')}
function drawEndA(t){const k=ease((t-TA.endc)/0.5)*clamp((LOOPA-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.8*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-TA.endc<0.5?0.7+0.3*ease((t-TA.endc-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,760);ctx.scale(pop,pop);txt('NEXT VIDEO:',0,-150,56,'#ffffff');txt('What is',0,-40,92,'#9fe8ff');txt('ABSOLUTE ZERO? 🥶',0,70,fitSize('ABSOLUTE ZERO? 🥶',980,92),'#9fe8ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-TA.endc-0.6)/0.4);txt('Follow so you don\'t miss it 🔔',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
function renderSceneA(t){ctx.save();const S=sceneA(t);let sh=0;const sk=(t0,a,d)=>{const k=t-t0;if(k>=0&&k<d)sh+=a*(1-k/d)};sk(TA.sun+2.6,22,0.6);if(sh)ctx.translate((hash(Math.floor(t*60),1)-0.5)*sh,(hash(Math.floor(t*60),2)-0.5)*sh);
  ({title:drawTitle,ball:drawBall,wave:drawWave,appear:drawAppear,sun:drawSunQ,phone:drawPhone,micro:drawMicro,nobel:drawNobel,wall:drawWall})[S](t);ctx.restore()}
const CUTS=[TA.ball,TA.wave,TA.appear,TA.sun,TA.phone,TA.micro,TA.nobel,TA.wall];
const FLASHES=[[TA.sun+2.6,0.8,0.5,'255,240,200']];
