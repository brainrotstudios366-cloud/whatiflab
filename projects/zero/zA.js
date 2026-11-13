// ============================ ABSOLUTE ZERO ====================
const DURA=66,LOOPA=65.6;
const TA={atoms:2.7,cool:8.5,compare:16.8,never:23.75,lab:29.25,helium:35.9,super:43.85,bec:49.5,humans:55.15,endc:59.0};
const BLUE=[80,170,255],RED=[255,80,90],GOLD=[255,214,90],ICE=[160,230,255];
const segA=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function sceneA(t){if(t<TA.atoms)return'title';if(t<TA.cool)return'atoms';if(t<TA.compare)return'cool';if(t<TA.never)return'compare';if(t<TA.lab)return'never';if(t<TA.helium)return'lab';if(t<TA.super)return'helium';if(t<TA.bec)return'super';if(t<TA.humans)return'bec';return'humans'}
//@@HELPERS@@
function iceBg(t,dark){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,dark?'#06142a':'#0e2a4a');g.addColorStop(1,dark?'#020814':'#06162a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=0.35;for(let i=0;i<70;i++){const x=hash(i,1)*W,y=(hash(i,2)*H+t*30*(0.3+hash(i,3)))%H;ctx.fillStyle='#e8f6ff';ctx.beginPath();ctx.arc(x,y,2+hash(i,4)*3,0,7);ctx.fill()}ctx.restore()}
function frost(a){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='rgba(220,245,255,0.7)';ctx.lineWidth=3;for(let i=0;i<14;i++){const cx=i<7?0:W,cy=hash(i,5)*H;ctx.beginPath();for(let j=0;j<6;j++){const ang=(hash(i,j+9)-0.5)*1.6+(i<7?0:Math.PI);const L=60+hash(i,j)*140;ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*L,cy+Math.sin(ang)*L)}ctx.stroke()}ctx.restore()}
function atomBox(x,y,w,h,speed,col,t,n){ctx.save();ctx.fillStyle='rgba(15,10,30,0.6)';rrect(x,y,w,h,30);ctx.fill();ctx.strokeStyle=css(col);ctx.lineWidth=5;rrect(x,y,w,h,30);ctx.stroke();ctx.beginPath();rrect(x,y,w,h,30);ctx.clip();
  for(let i=0;i<(n||14);i++){const vx=(hash(i,1)-0.5)*2,vy=(hash(i,2)-0.5)*2;const px=x+40+((hash(i,3)*(w-80)+vx*t*speed*200)%(2*(w-80))+2*(w-80))%(2*(w-80));const py=y+40+((hash(i,4)*(h-80)+vy*t*speed*200)%(2*(h-80))+2*(h-80))%(2*(h-80));
    const fx=px-x-40>(w-80)?x+40+2*(w-80)-(px-x-40):px,fy=py-y-40>(h-80)?y+40+2*(h-80)-(py-y-40):py;const jx=Math.sin(t*speed*40+i)*speed*6,jy=Math.cos(t*speed*37+i)*speed*6;particle(fx+jx,fy+jy,20,col,'',1)}ctx.restore()}
function thermo(x,y,h,frac,val){ctx.fillStyle='#e8f0f8';rrect(x-40,y-h,80,h+40,40);ctx.fill();ctx.beginPath();ctx.arc(x,y+40,70,0,7);ctx.fill();const col=frac>0.5?'#e84a3a':frac>0.2?'#4ab0e8':'#9fe8ff';ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y+40,52,0,7);ctx.fill();rrect(x-22,y-h*frac+10,44,h*frac,22);ctx.fill();
  for(let i=0;i<10;i++){ctx.fillStyle='#8a9ab0';ctx.fillRect(x+40,y-h+20+i*(h-40)/9,24,5)}if(val)txt(val,x+260,y-h*frac+20,72,'#ffffff','center')}
// ---------------- scenes ----------------
function drawTitle(t){iceBg(t);frost(0.9);thermo(W/2,1500,560,0.12+0.02*Math.sin(t*3),'')}
function drawAtoms(t){iceBg(t,1);const lt=t-TA.atoms;atomBox(110,560,860,520,1.6,RED,t,14);label('🔥 HOT = fast atoms',W/2,1150,50,'#ff9a8a',segA(t,TA.atoms+0.4,TA.atoms+0.7));
  if(lt>2.6){atomBox(110,1240,860,380,0.25,BLUE,t,14);label('❄️ COLD = slow atoms',W/2,1690,50,'#9fd0ff',segA(t,TA.atoms+2.6,TA.atoms+2.9))}}
function drawCool(t){iceBg(t,1);const k=easeIn(segA(t,TA.cool+0.3,TA.cool+6.2));frost(k);const temp=20-(293.15)*k;
  atomBox(110,560,560,560,Math.max(0.02,1.4*(1-k)),k>0.7?ICE:k>0.3?BLUE:RED,t,12);thermo(850,1080,480,1-k*0.95,'');
  ctx.save();ctx.fillStyle='rgba(15,10,30,0.82)';rrect(110,1200,860,170,34);ctx.fill();ctx.restore();txt(temp.toFixed(k>0.98?2:0)+' °C',W/2,1285,96,k>0.98?'#9fe8ff':'#ffffff');
  if(t>TA.cool+6.3){const kk=popS(t-TA.cool-6.3);ctx.save();ctx.translate(W/2,1520);ctx.scale(kk,kk);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=16;txt('ABSOLUTE ZERO',0,0,fitSize('ABSOLUTE ZERO',960,110),'#9fe8ff');txt('= 0 Kelvin',0,90,56,'#ffffff');ctx.restore()}}
function easeIn(x){return x<0?0:x>1?1:x*x}
function drawCompare(t){iceBg(t,1);const lt=t-TA.compare;const X=300,Y0=560,Y1=1650;ctx.fillStyle='rgba(255,255,255,0.25)';rrect(X-10,Y0,20,Y1-Y0,10);ctx.fill();
  const marks=[[0,'🧊 0 °C','water freezes',0.0],[-89,'🌍 −89 °C','coldest on Earth',1.6],[-270,'🌌 −270 °C','deep space',3.6],[-273.15,'❄️ −273.15 °C','ABSOLUTE ZERO',5.2]];
  for(const[v,a,b,t0]of marks){if(lt<t0)continue;const y=Y0+({'0':0,'-89':380,'-270':780,'-273.15':1040})[String(v)];const k=popS(lt-t0);ctx.save();ctx.globalAlpha=Math.min(1,k);ctx.fillStyle=v<-271?'#9fe8ff':'#ffffff';ctx.beginPath();ctx.arc(X,y,22,0,7);ctx.fill();txt(a,X+60,y-22,52,v<-271?'#9fe8ff':'#ffffff','left');txt(b,X+60,y+30,34,'rgba(255,255,255,0.75)','left');ctx.restore()}}
function drawNever(t){iceBg(t,1);grid(t,0.05);const X0=150,Y0=1450,GW=780,GH=760;ctx.strokeStyle='rgba(255,255,255,0.8)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(X0,Y0-GH);ctx.lineTo(X0,Y0);ctx.lineTo(X0+GW,Y0);ctx.stroke();
  ctx.save();ctx.setLineDash([16,12]);ctx.strokeStyle='#9fe8ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(X0,Y0-40);ctx.lineTo(X0+GW,Y0-40);ctx.stroke();ctx.restore();txt('0 K',X0+GW-10,Y0-75,38,'#9fe8ff','right');
  const k=segA(t,TA.never,TA.never+4.2);ctx.strokeStyle='#ffd84a';ctx.lineWidth=8;ctx.beginPath();for(let i=0;i<=100;i++){const s=i/100*k;const x=X0+s*GW,y=Y0-40-(GH-60)*Math.exp(-s*5);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  const s=k;ctx.save();ctx.globalCompositeOperation='lighter';glow(X0+s*GW,Y0-40-(GH-60)*Math.exp(-s*5),50,GOLD,0.9);ctx.restore();txt('TEMPERATURE',X0+10,Y0-GH-40,34,'rgba(255,255,255,0.8)','left');txt('TIME →',X0+GW/2,Y0+50,34,'rgba(255,255,255,0.8)');
  if(t>TA.never+2.6)label('closer… but NEVER 0 🚫',W/2,560,52,'#ff8a8a',segA(t,TA.never+2.6,TA.never+2.9))}
function drawLab(t){iceBg(t,1);const lt=t-TA.lab;const cx=W/2;ctx.save();for(let i=0;i<5;i++){const y=600+i*170,w=520-i*70;const g=ctx.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,'#a87a20');g.addColorStop(0.5,'#ffe08a');g.addColorStop(1,'#a87a20');ctx.fillStyle=g;rrect(cx-w/2,y,w,40,10);ctx.fill();
    ctx.strokeStyle='#c8a050';ctx.lineWidth=8;for(const sx of[-0.35,0,0.35]){ctx.beginPath();ctx.moveTo(cx+sx*w,y+40);ctx.lineTo(cx+sx*(w-70),y+170);ctx.stroke()}}ctx.restore();ctx.save();ctx.globalCompositeOperation='lighter';glow(cx,1440,120,ICE,0.6+0.2*Math.sin(t*3));ctx.restore();
  ctx.save();ctx.fillStyle='rgba(15,10,30,0.85)';rrect(110,1520,860,150,34);ctx.fill();ctx.restore();const st=['1 K','0.001 K','0.000001 K','0.000000001 K'][Math.min(3,Math.floor(Math.max(0,lt-0.5)/1.0))];txt(st,W/2,1595,72,'#7dff9a');
  label('🧪 lab freezer',W/2,500,52,'#ffffff',segA(t,TA.lab+0.2,TA.lab+0.5))}
function drawHelium(t){iceBg(t,1);const lt=t-TA.helium;const bx=330,by=820,bw=420,bh=640;
  const climb=segA(t,TA.helium+1.5,TA.helium+5.0);ctx.fillStyle='rgba(150,220,255,0.5)';ctx.fillRect(bx+10,by+bh*0.45,bw-20,bh*0.55-10);
  ctx.fillStyle='rgba(170,235,255,0.75)';const fh=(bh*0.45)*climb;ctx.fillRect(bx-4,by+bh*0.45-fh,14,fh);ctx.fillRect(bx+bw-10,by+bh*0.45-fh,14,fh);
  if(climb>=1){const k=segA(t,TA.helium+5.0,TA.helium+7.5);ctx.fillRect(bx-18,by,14,bh*k);ctx.fillRect(bx+bw+4,by,14,bh*k);for(let i=0;i<3;i++){const ph=(lt*1.5+i/3)%1;ctx.beginPath();ctx.arc(bx-11,by+bh+ph*200,12,0,7);ctx.fill();ctx.beginPath();ctx.arc(bx+bw+11,by+bh+ph*200,12,0,7);ctx.fill()}}
  ctx.strokeStyle='rgba(230,245,255,0.9)';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx,by+bh);ctx.lineTo(bx+bw,by+bh);ctx.lineTo(bx+bw,by);ctx.stroke();
  label('SUPERFLUID HELIUM 🧪',W/2,640,54,'#9fe8ff',segA(t,TA.helium+0.3,TA.helium+0.6));if(climb>0.3)label('climbs up the walls ⬆️',W/2,1640,50,'#ffffff',segA(t,TA.helium+2.5,TA.helium+2.8))}
function drawSuper(t){iceBg(t,1);const lt=t-TA.super;const cx=W/2,cy=1150;ctx.fillStyle='#2a3448';ctx.beginPath();ctx.ellipse(cx,cy,280,80,0,0,7);ctx.fill();ctx.fillStyle='#4a5468';ctx.beginPath();ctx.ellipse(cx,cy-12,280,80,0,0,7);ctx.fill();
  ctx.save();ctx.globalAlpha=0.35;for(let i=0;i<8;i++){const ph=(lt*0.5+i/8)%1;ctx.fillStyle='#e8f6ff';ctx.beginPath();ctx.ellipse(cx+(hash(i,1)-0.5)*400,cy-20-ph*120,60+ph*40,20+ph*10,0,0,7);ctx.fill()}ctx.restore();
  const my=cy-230+Math.sin(lt*2)*16;ctx.save();ctx.globalCompositeOperation='lighter';glow(cx,my+60,160,ICE,0.3);ctx.restore();ctx.fillStyle='#6a6a7a';rrect(cx-110,my-40,220,80,14);ctx.fill();ctx.fillStyle='#d84a3a';rrect(cx-110,my-40,110,80,14);ctx.fill();txt('N',cx-55,my,44,'#fff');txt('S',cx+55,my,44,'#fff');
  label('⚡ zero resistance → floating magnet',W/2,640,46,'#ffffff',segA(t,TA.super+0.3,TA.super+0.6));if(lt>3.0)label('🏥 used in MRI machines',W/2,1500,52,'#7dff9a',segA(t,TA.super+3.0,TA.super+3.3))}
function drawBec(t){iceBg(t,1);const lt=t-TA.bec;const k=easeOut(segA(t,TA.bec+0.5,TA.bec+3.5));const cx=W/2,cy=1050;
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const a=hash(i,1)*6.283,d=(150+hash(i,2)*380)*(1-k);particle(cx+Math.cos(a+lt*0.5)*d,cy+Math.sin(a+lt*0.5)*d,18,ICE,'',1-k*0.7)}
  if(k>0.3){const r=80+k*140;glow(cx,cy,r*2,ICE,0.6*k);ctx.strokeStyle=`rgba(200,245,255,${k})`;ctx.lineWidth=6;ctx.beginPath();for(let i=0;i<=120;i++){const a=i/120*6.283;const rr=r*(1+0.08*Math.sin(a*6+lt*4));const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}ctx.restore();
  label('one SUPER ATOM ⚛️',W/2,1290,56,'#9fe8ff',segA(t,TA.bec+3.0,TA.bec+3.3))}
function drawHumans(t){iceBg(t,1);frost(0.8);const lt=t-TA.humans;ctx.save();ctx.translate(W/2,1000);ctx.rotate(lt*0.3);ctx.strokeStyle='#e8f6ff';ctx.lineWidth=14;ctx.lineCap='round';for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-260);ctx.moveTo(0,-160);ctx.lineTo(-60,-210);ctx.moveTo(0,-160);ctx.lineTo(60,-210);ctx.stroke()}ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';glow(W/2,1000,400,ICE,0.4);ctx.restore();label('coldest place in the universe:',W/2,1420,46,'#ffffff',segA(t,TA.humans+0.8,TA.humans+1.1));label('🧪 a lab on Earth',W/2,1500,64,'#7dff9a',segA(t,TA.humans+1.6,TA.humans+1.9))}
// ---------------- captions ----------------
const capsA=[[0.2,2.6,'🥶 The coldest temperature possible'],[2.8,8.4,'🌡️ Temperature = moving atoms'],[8.6,16.7,'❄️ Atoms almost stop at −273.15 °C'],[16.9,23.6,'🌍 Earth vs space vs absolute zero'],[23.85,29.1,'🚫 It can never be reached'],
  [29.35,35.8,'🧪 Billionths of a degree away'],[36.0,43.7,'🌀 Matter gets WEIRD'],[43.95,49.4,'⚡ Superconductors'],[49.6,55.0,'⚛️ Bose-Einstein condensate'],[55.25,58.9,'👨‍🔬 The coldest place is man-made']];
//@@COMMON@@
function drawTitleA(t){const a=t<2.4?1:clamp((2.7-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,700);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('What is',0,-80,96,'#ffffff');txt('ABSOLUTE ZERO? 🥶',0,40,fitSize('ABSOLUTE ZERO? 🥶',980,110),'#9fe8ff');ctx.restore()}
function drawStatsA(t){const box=(a,b,lab,val,col)=>{if(t>=a&&t<b)statBoxM(lab,val,col,Math.min(1,(t-a)/0.25,(b-t)/0.2))};
  box(TA.helium+4.5,TA.super,'TEMPERATURE','−271 °C','#9fe8ff');box(TA.bec+0.6,TA.humans,'FIRST MADE','1995','#ffffff')}
function drawEndA(t){const k=ease((t-TA.endc)/0.5)*clamp((LOOPA-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.8*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-TA.endc<0.5?0.7+0.3*ease((t-TA.endc-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,760);ctx.scale(pop,pop);txt('What should I',0,-100,92,'#ffd84a');txt('explain next?',0,10,92,'#ffd84a');const bounce=Math.abs(Math.sin((t-TA.endc)*5))*26;txt('👇',0,190+bounce,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-TA.endc-0.6)/0.4);txt('Follow The What If Lab ⚛️',W/2,1180,50,'#ffffff','center',800);ctx.restore()}
function renderSceneA(t){ctx.save();const S=sceneA(t);({title:drawTitle,atoms:drawAtoms,cool:drawCool,compare:drawCompare,never:drawNever,lab:drawLab,helium:drawHelium,super:drawSuper,bec:drawBec,humans:drawHumans})[S](t);ctx.restore()}
const CUTS=[TA.atoms,TA.cool,TA.compare,TA.never,TA.lab,TA.helium,TA.super,TA.bec,TA.humans];
