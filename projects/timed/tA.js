// ============================ TIME DILATION ====================
const DURA=62,LOOPA=61.6;
const TA={clocks:3.95,iss:10.45,young:15.4,grav:19.9,gps:25.5,map:30.0,twins:35.4,bh:42.3,test:46.8,endc:54.6};
const BLUE=[80,170,255],RED=[255,80,90],GOLD=[255,214,90],LIGHT=[255,240,170];
const segA=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function sceneA(t){if(t<TA.clocks)return'title';if(t<TA.iss)return'clocks';if(t<TA.grav)return'iss';if(t<TA.gps)return'grav';if(t<TA.twins)return'gps';if(t<TA.bh)return'twins';if(t<TA.test)return'bh';return'test'}
//@@HELPERS@@
function clock(x,y,r,ang,col,lab){ctx.fillStyle='#f4f0e6';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle=col||'#3a2a4a';ctx.lineWidth=r*0.08;ctx.stroke();for(let i=0;i<12;i++){const a=i/12*6.283;ctx.fillStyle='#3a2a4a';ctx.fillRect(x+Math.cos(a)*(r*0.8)-r*0.03,y+Math.sin(a)*(r*0.8)-r*0.03,r*0.06,r*0.06)}
  ctx.lineCap='round';ctx.strokeStyle='#2a1a3a';ctx.lineWidth=r*0.07;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ang/12)*r*0.5,y-Math.cos(ang/12)*r*0.5);ctx.stroke();ctx.strokeStyle='#d84a3a';ctx.lineWidth=r*0.035;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ang)*r*0.82,y-Math.cos(ang)*r*0.82);ctx.stroke();
  ctx.fillStyle='#2a1a3a';ctx.beginPath();ctx.arc(x,y,r*0.06,0,7);ctx.fill();if(lab)label(lab,x,y+r+50,40,'#ffffff')}
function astronaut(x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle='#e8ecf2';rrect(-50,-10,100,120,40);ctx.fill();ctx.fillStyle='#c8ccd4';rrect(-80,0,30,90,15);ctx.fill();rrect(50,0,30,90,15);ctx.fill();rrect(-45,100,38,80,15);ctx.fill();rrect(7,100,38,80,15);ctx.fill();
  ctx.fillStyle='#f4f6fa';ctx.beginPath();ctx.arc(0,-55,58,0,7);ctx.fill();ctx.fillStyle='#2a3a5a';ctx.beginPath();ctx.ellipse(0,-52,40,30,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.5)';ctx.beginPath();ctx.ellipse(-14,-62,12,7,-0.5,0,7);ctx.fill();ctx.fillStyle='#b0b4bc';rrect(-40,20,80,40,8);ctx.fill();ctx.restore()}
function iss(x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle='#d8dce4';rrect(-40,-10,80,20,6);ctx.fill();ctx.fillStyle='#2a4a8a';for(const sx of[-1,1]){ctx.fillRect(sx*50-(sx<0?40:0),-40,40,80);ctx.strokeStyle='#8ab0e0';ctx.lineWidth=2;ctx.strokeRect(sx*50-(sx<0?40:0),-40,40,80)}ctx.fillStyle='#b8bcc4';ctx.fillRect(-50,-3,100,6);ctx.restore()}
function sat(x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle='#e8c860';rrect(-16,-16,32,32,4);ctx.fill();ctx.fillStyle='#2a4a8a';ctx.fillRect(-56,-10,36,20);ctx.fillRect(20,-10,36,20);ctx.restore()}
function blackhole(x,y,r,t){ctx.save();ctx.globalCompositeOperation='lighter';glow(x,y,r*3.5,[255,140,40],0.4);ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.scale(1,0.32);for(let i=0;i<18;i++){const rr=r*1.25+i*r*0.07;ctx.strokeStyle=`rgba(255,${150+i*5},${60+i*4},${0.7-i*0.03})`;ctx.lineWidth=r*0.07;ctx.beginPath();ctx.arc(0,0,rr,Math.PI,2*Math.PI);ctx.stroke()}ctx.restore();
  ctx.fillStyle='#000';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='rgba(255,200,120,0.9)';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r+4,0,7);ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.scale(1,0.32);for(let i=0;i<18;i++){const rr=r*1.25+i*r*0.07;ctx.strokeStyle=`rgba(255,${150+i*5},${60+i*4},${0.75-i*0.03})`;ctx.lineWidth=r*0.07;ctx.beginPath();ctx.arc(0,0,rr,0,Math.PI);ctx.stroke()}ctx.restore()}
// ---------------- scenes ----------------
function drawTitle(t){space(t,'#03030f','#0c0824',0.3);earth(W/2,1700,520,t);astronaut(W/2+Math.sin(t)*30,1180,1.2,Math.sin(t*0.7)*0.25)}
function drawClocks(t){space(t);grid(t,0.07);const lt=t-TA.clocks;const k=easeOut(segA(t,TA.clocks,TA.clocks+0.5));
  clock(W/2,640,180*k+1,lt*3.0,'#3a2a4a','STANDING STILL 🧍');
  // moving clock with streaks
  const mx=W/2+Math.sin(lt*2)*40;ctx.save();ctx.globalAlpha=0.5;for(let i=0;i<10;i++){ctx.fillStyle='rgba(120,180,255,0.35)';ctx.fillRect(mx-260-i*40,1040+i*12-60,200,6)}ctx.restore();clock(mx,1060,180*k+1,lt*(t>TA.clocks+2.6?1.2:3.0),'#d84a3a','MOVING FAST 🚀');
  if(t>TA.clocks+3.0)label('⏳ slower!',W/2+230,900,52,'#ff8a8a',segA(t,TA.clocks+3.0,TA.clocks+3.3))}
function drawIss(t){space(t);const cx=W/2,cy=1000;earth(cx,cy,300,t);const a=(t-TA.iss)*0.9;const ox=cx+Math.cos(a)*400,oy=cy+Math.sin(a)*400*0.45;
  ctx.save();ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=3;ctx.setLineDash([10,12]);ctx.beginPath();ctx.ellipse(cx,cy,400,180,0,0,7);ctx.stroke();ctx.restore();
  if(Math.sin(a)<0){iss(ox,oy,1.2,0.2)}// behind -> draw before? earth already drawn; draw only front half
  if(Math.sin(a)>=0)iss(ox,oy,1.3,0.2);
  if(t>=TA.young){const k=popS(t-TA.young);ctx.save();ctx.translate(W/2,1480);ctx.scale(k,k);ctx.fillStyle='rgba(15,10,30,0.8)';rrect(-400,-100,800,200,40);ctx.fill();txt('−0.005 s',0,-15,96,'#7dff9a');txt('younger after 6 months',0,60,38,'#ffffff');ctx.restore()}}
function person(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#3a6aa0';rrect(-38,-120,76,120,10);ctx.fill();ctx.fillStyle='#2a2a3a';rrect(-36,0,32,130,8);ctx.fill();rrect(4,0,32,130,8);ctx.fill();ctx.fillStyle='#f5c99a';rrect(-30,-190,60,62,18);ctx.fill();ctx.fillStyle='#5a3a20';rrect(-32,-198,64,22,10);ctx.fill();ctx.fillStyle='#3a6aa0';rrect(-62,-118,24,100,10);ctx.fill();rrect(38,-118,24,100,10);ctx.fill();
  ctx.fillStyle='#111';ctx.fillRect(-14,-166,8,10);ctx.fillRect(6,-166,8,10);ctx.restore()}
function drawGrav(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a2a4a');g.addColorStop(1,'#0a1428');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle='#3a5a3a';ctx.fillRect(0,1450,W,500);
  const lt=t-TA.grav;person(W/2,1320,2.0);const ns=v=>String(Math.floor(v)).padStart(9,'0');
  ctx.save();ctx.fillStyle='rgba(15,10,30,0.8)';rrect(590,820,460,130,26);ctx.fill();rrect(590,1180,460,130,26);ctx.fill();ctx.restore();
  txt('HEAD 🧠',820,850,30,'#9fd0ff');txt(ns(lt*123456789.3)+' ns',820,905,34,'#ffffff');txt('FEET 🦶',820,1210,30,'#ffd84a');txt(ns(lt*123456789.0)+' ns',820,1265,34,'#ffffff');
  ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(620,885);ctx.lineTo(600,960);ctx.stroke();ctx.beginPath();ctx.moveTo(590,1245);ctx.lineTo(560,1540);ctx.stroke();
  label('🌍 more gravity = slower time',W/2,620,48,'#ffffff',segA(t,TA.grav+0.3,TA.grav+0.6))}
function drawGps(t){space(t);const lt=t-TA.gps;if(t<TA.map){const cx=W/2,cy=980;earth(cx,cy,280,t);for(let i=0;i<4;i++){const a=lt*0.4+i*1.57;const x=cx+Math.cos(a)*440,y=cy+Math.sin(a)*440*0.5;sat(x,y,1.3,a);ctx.save();ctx.globalCompositeOperation='lighter';glow(x,y,40,[255,220,120],0.4*(0.5+0.5*Math.sin(t*6+i)));ctx.restore()}
    label('🛰️ GPS clocks: +38 µs per day',W/2,1450,46,'#ffd84a',segA(t,TA.gps+1.0,TA.gps+1.3))}
  else{const k=segA(t,TA.map+0.5,TA.twins-0.8);ctx.fillStyle='#0a0a12';ctx.fillRect(0,0,W,H);ctx.fillStyle='#1a1a22';rrect(240,520,600,1100,70);ctx.fill();ctx.save();ctx.beginPath();rrect(270,560,540,1020,50);ctx.clip();ctx.fillStyle='#e8eadf';ctx.fillRect(270,560,540,1020);
    ctx.strokeStyle='#fff';ctx.lineWidth=26;for(const[x1,y1,x2,y2]of[[270,800,810,860],[420,560,480,1580],[270,1200,810,1150],[650,560,700,1580]]){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}ctx.fillStyle='#a8d890';ctx.fillRect(500,900,120,200);ctx.fillStyle='#9ac8f0';ctx.fillRect(280,1260,120,250);
    const px=540,py=1060;ctx.fillStyle='#4a8af0';ctx.beginPath();ctx.arc(px,py,22,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.stroke();
    const dx=px+k*300,dy=py-k*500;ctx.fillStyle='#e84a3a';ctx.beginPath();ctx.moveTo(dx,dy);ctx.arc(dx,dy-40,30,Math.PI*0.75,Math.PI*0.25);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(dx,dy-42,11,0,7);ctx.fill();ctx.restore();
    ctx.save();ctx.fillStyle='rgba(15,10,30,0.85)';rrect(290,1650,500,120,30);ctx.fill();ctx.restore();txt('OFF BY: '+(k*10).toFixed(1)+' km',W/2,1710,48,'#ff6b6b')}}
function drawTwins(t){space(t);const lt=t-TA.twins;earth(220,1560,200,t);const k=easeOut(segA(t,TA.twins+0.3,TA.twins+2.5));ctx.save();ctx.translate(220+k*700,1300-k*700);ctx.rotate(-0.78);ctx.translate(-220-k*700,-1300+k*700);ctx.restore();
  // rocket glyph
  ctx.save();ctx.translate(260+k*620,1260-k*640);ctx.rotate(-0.8);ctx.fillStyle='#e8ecf2';ctx.beginPath();ctx.moveTo(60,0);ctx.quadraticCurveTo(30,-26,-40,-22);ctx.lineTo(-40,22);ctx.quadraticCurveTo(30,26,60,0);ctx.fill();ctx.globalCompositeOperation='lighter';glow(-60,0,60,[255,160,60],0.8);ctx.restore();
  const cal=(x,lab,n,col)=>{ctx.save();ctx.fillStyle='#f4f4f0';rrect(x-170,560,340,300,30);ctx.fill();ctx.fillStyle=col;rrect(x-170,560,340,80,30);ctx.fill();ctx.fillRect(x-170,600,340,40);ctx.restore();txt(lab,x,600,36,'#ffffff');txt(n,x,750,96,'#1a1a2a');txt(n==='1'?'year':'years',x,830,36,'#3a3a4a')};
  if(t>TA.twins+3.3){const p=segA(t,TA.twins+3.3,TA.twins+5.0);cal(300,'YOU 🚀','1','#4a8af0');cal(780,'EARTH 🌍',String(Math.max(1,Math.round(1+p*6))),'#3faa5a')}}
function drawBh(t){space(t,'#020206','#0a0410');const lt=t-TA.bh;blackhole(W/2,900,170,t);
  // hourglass
  const hx=W/2,hy=1380;ctx.save();ctx.strokeStyle='#d8c8a0';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(hx-70,hy-110);ctx.lineTo(hx+70,hy-110);ctx.lineTo(hx+10,hy);ctx.lineTo(hx+70,hy+110);ctx.lineTo(hx-70,hy+110);ctx.lineTo(hx-10,hy);ctx.closePath();ctx.stroke();const s=0.3+0.1*Math.sin(lt);ctx.fillStyle='#f2c060';ctx.beginPath();ctx.moveTo(hx-60*s*2,hy-110+110*(1-s));ctx.lineTo(hx+60*s*2,hy-110+110*(1-s));ctx.lineTo(hx,hy);ctx.closePath();ctx.fill();ctx.restore();
  label('1 hour = years 😳',W/2,1580,56,'#ffd84a',segA(t,TA.bh+1.5,TA.bh+1.8))}
function drawTest(t){space(t);const lt=t-TA.test;const cx=W/2,cy=820;earth(cx,cy,260,t);const a=lt*1.2;const px=cx+Math.cos(a)*330,py=cy+Math.sin(a)*330*0.5;
  ctx.save();ctx.translate(px,py);ctx.rotate(a+Math.PI/2);ctx.fillStyle='#f4f4f8';rrect(-50,-10,100,20,10);ctx.fill();ctx.fillRect(-12,-40,24,80);ctx.fillRect(-46,-6,10,30);ctx.restore();
  ctx.save();ctx.fillStyle='rgba(15,10,30,0.82)';rrect(110,1220,860,300,36);ctx.fill();ctx.restore();label('1971 ✈️ atomic clocks',W/2,1160,48,'#ffffff');
  const off=segA(t,TA.test+2.0,TA.test+5.0);txt('GROUND',300,1290,34,'#9fd0ff');txt('PLANE',780,1290,34,'#ffd84a');txt('12:00:00.000000000',300,1370,30,'#ffffff');txt('12:00:00.000000'+String(Math.floor(off*273)).padStart(3,'0'),780,1370,30,off>0?'#ff6b6b':'#ffffff');
  if(off>0.6)label('OUT OF SYNC ✅ Einstein was right',W/2,1460,40,'#7dff9a',segA(t,TA.test+3.8,TA.test+4.1))}
// ---------------- captions ----------------
const capsA=[[0.2,3.8,'👨‍🚀 Astronauts age slower. Really.'],[4.0,10.3,'⏰ Moving fast = slower time'],[10.5,19.7,'🛰️ ISS: 28,000 km/h'],[20.0,25.4,'🌍 Gravity slows time too'],[25.6,35.3,'📱 GPS must fix this every day'],
  [35.5,42.2,'🚀 99% light speed for 1 year…'],[42.4,46.7,'🕳️ Near a black hole…'],[46.9,54.5,'🧪 Proven in 1971']];
//@@COMMON@@
function drawTitleA(t){const a=t<3.6?1:clamp((3.95-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,700);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('Why ASTRONAUTS',0,-70,fitSize('Why ASTRONAUTS',980,110),'#ffffff');txt('age SLOWER ⏳',0,60,fitSize('age SLOWER ⏳',980,120),'#ffd84a');ctx.restore()}
function drawStatsA(t){const box=(a,b,lab,val,col)=>{if(t>=a&&t<b)statBoxM(lab,val,col,Math.min(1,(t-a)/0.25,(b-t)/0.2))};
  box(TA.clocks+1.0,TA.iss,'DISCOVERED BY','EINSTEIN, 1905','#ffffff');box(TA.iss+0.6,TA.young,'ISS SPEED','28,000 km/h','#ffd84a');}
function drawEndA(t){const k=ease((t-TA.endc)/0.5)*clamp((LOOPA-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.8*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-TA.endc<0.5?0.7+0.3*ease((t-TA.endc-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,760);ctx.scale(pop,pop);txt('NEXT VIDEO:',0,-150,56,'#ffffff');txt('Particles that walk',0,-40,fitSize('Particles that walk',980,92),'#ffd84a');txt('through WALLS 👻',0,70,92,'#ffd84a');ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-TA.endc-0.6)/0.4);txt('Follow so you don\'t miss it 🔔',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
function renderSceneA(t){ctx.save();const S=sceneA(t);({title:drawTitle,clocks:drawClocks,iss:drawIss,grav:drawGrav,gps:drawGps,twins:drawTwins,bh:drawBh,test:drawTest})[S](t);ctx.restore()}
const CUTS=[TA.clocks,TA.iss,TA.grav,TA.gps,TA.map,TA.twins,TA.bh,TA.test];
