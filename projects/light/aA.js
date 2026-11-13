// ======================================================================
// ============================ ANTIMATTER EXPLAINER ====================
// ======================================================================
const DURA=73,LOOPA=72.6;
const TA={twins:3.2,names:7.65,ann:11.2,touch:13.0,boom:13.9,energy:16.15,eflash:17.6,bang:22.4,count:25.2,wipe:30.35,left:33.0,earth:35.5,storm:38.3,banana:40.4,cern:45.45,trap:48.0,cost:50.9,bulb:56.4,pet:60.75,why:65.8,endc:68.9};
const BLUE=[80,170,255],RED=[255,80,90],GOLD=[255,214,90];
function sceneA(t){if(t<TA.twins)return'city';if(t<TA.ann)return'twins';if(t<TA.energy)return'ann';if(t<TA.bang)return'energy';if(t<TA.earth)return'bang';if(t<TA.storm)return'earth';if(t<TA.banana)return'storm';if(t<TA.cern)return'banana';if(t<TA.cost)return'cern';if(t<TA.bulb)return'cost';if(t<TA.pet)return'bulb';if(t<TA.why)return'pet';return'why'}
const segA=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function space(t,c1,c2,drift){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,c1||'#05061a');g.addColorStop(1,c2||'#0d0a2a');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  for(const s of nstars){const y=(s[1]*1.4+(drift||0)*t*20)%H;ctx.fillStyle=`rgba(255,255,255,${0.25+0.5*Math.abs(Math.sin(s[3]*40+t*0.6))})`;ctx.fillRect(s[0],y,s[2],s[2])}}
function grid(t,a){ctx.save();ctx.globalAlpha=a||0.12;ctx.strokeStyle='#7a8cff';ctx.lineWidth=2;const o=(t*30)%120;for(let x=-120+o;x<W+120;x+=120){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=-120+o;y<H+120;y+=120){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore()}
function particle(x,y,r,col,sign,a){ctx.save();ctx.globalAlpha=a==null?1:a;glow(x,y,r*3.2,col,0.55);const g=ctx.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(0.35,css(mix(col,[255,255,255],0.35)));g.addColorStop(1,css(mix(col,[0,0,0],0.35)));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  if(sign)txt(sign,x,y+r*0.05,r*1.25,'#ffffff','center',900,false);ctx.restore()}
function label(s,x,y,size,col,a){ctx.save();ctx.globalAlpha=a==null?1:a;ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=12;txt(s,x,y,size,col||'#fff');ctx.restore()}
function earth(x,y,r,t){glow(x,y,r*1.5,[90,160,255],0.45);const g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);g.addColorStop(0,'#5ab0ff');g.addColorStop(1,'#123a8a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.clip();ctx.fillStyle='#3faa5a';const rot=t*0.05;for(let i=0;i<9;i++){const a=hash(i,1)*6.283+rot,d=hash(i,2)*0.8;const cx=x+Math.cos(a)*d*r*1.1,cy=y+(hash(i,3)-0.5)*1.4*r;ctx.beginPath();ctx.ellipse(cx,cy,r*(0.15+hash(i,4)*0.25),r*(0.1+hash(i,5)*0.18),hash(i,6)*3,0,7);ctx.fill()}
  ctx.fillStyle='rgba(255,255,255,0.55)';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(x+(hash(i,7)-0.5)*1.8*r,y+(hash(i,8)-0.5)*1.8*r,r*0.25,r*0.05,hash(i,9),0,7);ctx.fill()}
  const sh=ctx.createLinearGradient(x-r,y-r,x+r,y+r);sh.addColorStop(0.45,'rgba(0,0,10,0)');sh.addColorStop(1,'rgba(0,0,10,0.7)');ctx.fillStyle=sh;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();
  ctx.strokeStyle='rgba(140,200,255,0.6)';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r+4,0,7);ctx.stroke()}
// ---------------- scenes ----------------
function drawTwins(t){space(t);grid(t,0.1);const k=easeOut(segA(t,TA.twins,TA.twins+0.8));
  // mirror line
  ctx.save();ctx.globalAlpha=0.8*k;const mg=ctx.createLinearGradient(W/2-6,0,W/2+6,0);mg.addColorStop(0,'rgba(200,220,255,0)');mg.addColorStop(0.5,'rgba(220,235,255,0.9)');mg.addColorStop(1,'rgba(200,220,255,0)');ctx.fillStyle=mg;ctx.fillRect(W/2-14,480,28,1050);ctx.restore();
  const bob=Math.sin(t*2)*16;const xL=W/2-250*k,xR=W/2+250*k;
  // orbit rings
  ctx.save();ctx.globalAlpha=0.35*k;ctx.strokeStyle=css(BLUE);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(xL,1000+bob,170,60,0.3,0,7);ctx.stroke();ctx.strokeStyle=css(RED);ctx.beginPath();ctx.ellipse(xR,1000-bob,170,60,-0.3,0,7);ctx.stroke();ctx.restore();
  particle(xL,1000+bob,90*k+1,BLUE,'−',k);particle(xR,1000-bob,90*k+1,RED,'+',k);
  if(t>=TA.names){const a=segA(t,TA.names,TA.names+0.3);label('ELECTRON',xL,1180+bob,52,'#9fd0ff',a);label('POSITRON',xR,1180-bob,52,'#ff9aa2',a);label('matter',xL,1240+bob,38,'rgba(255,255,255,0.8)',a);label('ANTImatter',xR,1240-bob,38,'#ff9aa2',a)}
  if(t>=TA.twins+1.6&&t<TA.names){const a=segA(t,TA.twins+1.6,TA.twins+1.9);label('SAME MASS ⚖️',W/2,780,56,'#ffffff',a);if(t>=TA.twins+2.7)label('OPPOSITE CHARGE ⚡',W/2,860,56,'#ffd84a',segA(t,TA.twins+2.7,TA.twins+3.0))}}
function drawAnn(t){space(t,'#06051a','#120a24');grid(t,0.08);const k=segA(t,TA.ann,TA.touch);const kk=k*k;const x1=W/2-380*(1-kk),x2=W/2+380*(1-kk);const y=1000;
  const b=t-TA.boom;
  if(b<0){particle(x1,y,85,BLUE,'−');particle(x2,y,85,RED,'+');if(t>TA.touch){const s=segA(t,TA.touch,TA.boom);ctx.save();ctx.globalCompositeOperation='lighter';glow(W/2,y,200+400*s,[255,255,255],0.4+0.5*s);ctx.restore()}}
  else{ctx.save();ctx.globalCompositeOperation='lighter';glow(W/2,y,900*Math.exp(-b*1.2)+200,[255,250,230],Math.max(0,1-b*0.5));
    for(const d of[-1,1]){const L=b*1400;const gx=W/2+d*L*0.7,gy=y-d*L*0.7;ctx.strokeStyle='rgba(255,230,120,0.9)';ctx.lineWidth=10;ctx.beginPath();for(let i=0;i<=40;i++){const s=i/40;const px=W/2+(gx-W/2)*s,py=y+(gy-y)*s;const w=Math.sin(s*40-b*30)*18;ctx.lineTo(px+w*0.7,py+w*0.7)}ctx.stroke();glow(gx,gy,90,[255,220,120],0.8)}
    for(let i=0;i<40;i++){const a=hash(i,1)*6.283,d=b*(400+hash(i,2)*900);ctx.fillStyle=`rgba(255,240,200,${Math.max(0,1-b*0.6)})`;ctx.fillRect(W/2+Math.cos(a)*d,y+Math.sin(a)*d,6,6)}ctx.restore();
    const a=segA(t,TA.boom+0.5,TA.boom+0.8);label('E = mc²',W/2,760,110,'#ffd84a',a);label('100% mass → energy',W/2,1300,52,'#ffffff',segA(t,TA.boom+0.9,TA.boom+1.2))}}
function drawEnergy(t){const lt=Math.min(2.9,(t-TA.energy)*0.4);drawCityM(lt);const p=[W/2,760+Math.sin(t*2)*10];const f=t-TA.eflash;ctx.save();ctx.globalCompositeOperation='lighter';
  if(f<0){glow(p[0],p[1],160,[255,120,140],0.8);ctx.restore();particle(p[0],p[1],26,RED,'',1);label('1 gram of antimatter',p[0],p[1]-90,50,'#fff');return}
  glow(p[0],p[1],1500*Math.min(1,f*1.5)+200,[255,240,210],Math.max(0.12,1-f*0.3));glow(p[0],p[1],450,[255,255,255],Math.max(0,0.95-f*0.35));ctx.restore()}
const BB=[];{const r=rng(91);for(let i=0;i<520;i++)BB.push({a:r()*6.283,d:Math.pow(r(),0.6),s:0.6+r()*0.8,anti:i%2===1,pair:Math.floor(i/2),keep:i===2*77||i===2*201||i===2*333||i===2*412})}
function drawBang(t){space(t,'#020210','#0a0620');const b=t-TA.bang;const R0=Math.min(1,b/2.5);const cx=W/2,cy=960;
  if(b<1.2){ctx.save();ctx.globalCompositeOperation='lighter';glow(cx,cy,1200*easeOut(b/1.2),[255,245,220],1-b/1.4);ctx.restore()}
  const wipe=segA(t,TA.wipe,TA.wipe+2.4);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const p of BB){const dd=p.d*900*easeOut(R0)*(1+0.08*Math.sin(t+p.a));let x=cx+Math.cos(p.a+t*0.05)*dd,y=cy+Math.sin(p.a+t*0.05)*dd*1.4;
    const die=hash(p.pair,5);if(!p.keep||p.anti){if(wipe>die){const k=(wipe-die)*8;if(k<1){glow(x,y,40*(1-k)+10,[255,250,220],0.8*(1-k))}continue}}
    const col=p.anti?RED:BLUE;glow(x,y,14*p.s,col,0.9);ctx.fillStyle='#fff';ctx.fillRect(x-2,y-2,4,4)}
  ctx.restore();
  if(t>=TA.count&&t<TA.wipe+0.3){const a=segA(t,TA.count,TA.count+0.3);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(15,10,30,0.75)';rrect(70,1250,940,250,34);ctx.fill();
    txt('MATTER',110,1320,40,'#9fd0ff','left');txt('ANTIMATTER',110,1430,40,'#ff9aa2','left');const n1=t>=TA.count+3.2?'1,000,000,001':'1,000,000,000';txt(n1,970,1320,58,t>=TA.count+3.2?'#7dff9a':'#ffffff','right');txt('1,000,000,000',970,1430,58,'#ffffff','right');
    if(t>=TA.count+3.2){const k=t-TA.count-3.2;glow(900,1320,140,[120,255,150],0.6*Math.max(0,1-k))}ctx.restore()}
  if(t>=TA.left){// galaxies from leftovers
    const a=segA(t,TA.left,TA.left+1.0);ctx.save();ctx.globalAlpha=a;for(let i=0;i<5;i++){const gx=160+hash(i,11)*760,gy=500+hash(i,12)*900,r=60+hash(i,13)*90;ctx.save();ctx.translate(gx,gy);ctx.rotate(t*0.2+i);ctx.globalCompositeOperation='lighter';
      for(let j=0;j<60;j++){const an=j*0.45,dd=r*j/60;ctx.fillStyle=`rgba(${200+hash(j,i)*55|0},${190+hash(j,i+3)*60|0},255,0.7)`;ctx.fillRect(Math.cos(an)*dd,Math.sin(an)*dd*0.5,3,3)}glow(0,0,r*0.6,[255,230,200],0.6);ctx.restore()}
    ctx.restore();if(t>=TA.left+1.0){const k=segA(t,TA.left+1.0,TA.left+1.3);label('📍 YOU',W/2+40,1100,60,'#ffd84a',k)}}}
function drawEarthS(t){space(t);const lt=t-TA.earth;earth(W/2,1050,330,t);
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const ph=((lt*0.9+hash(i,1))%1);const a=-1.2+hash(i,2)*2.4-Math.PI/2;const sx=W/2+Math.cos(a)*1100,sy=1050+Math.sin(a)*1100;const ex=W/2+Math.cos(a)*350,ey=1050+Math.sin(a)*350;
    const px=sx+(ex-sx)*ph,py=sy+(ey-sy)*ph;ctx.strokeStyle='rgba(180,220,255,0.8)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-(ex-sx)*0.12,py-(ey-sy)*0.12);ctx.stroke();glow(px,py,30,[200,230,255],0.9);
    if(ph>0.85){const k=(ph-0.85)/0.15;for(let j=0;j<6;j++){const b=a+(hash(j,i)-0.5)*1.2;const d=k*120;particle(ex+Math.cos(b)*d,ey+Math.sin(b)*d,8,j%2?RED:BLUE,'',1-k)}}}ctx.restore();
  label('☄️ cosmic rays',W/2,600,58,'#ffffff',segA(t,TA.earth+0.3,TA.earth+0.6))}
function drawStorm(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a1d2e');g.addColorStop(1,'#3a3f52');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const lt=t-TA.storm;
  ctx.fillStyle='#2a2e3e';for(let i=0;i<14;i++){ctx.beginPath();ctx.arc(80+i*75,700+Math.sin(i*1.7)*60,140+hash(i,3)*90,0,7);ctx.fill()}ctx.fillStyle='#363a4c';for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(40+i*95,820+Math.sin(i*2.3)*50,120+hash(i,4)*70,0,7);ctx.fill()}
  const fl=[0.25,0.9,1.5];for(const f of fl){const k=lt-f;if(k>=0&&k<0.35){ctx.fillStyle=`rgba(220,230,255,${0.35*(1-k/0.35)})`;ctx.fillRect(0,0,W,H);ctx.save();ctx.strokeStyle=`rgba(255,255,255,${1-k/0.35})`;ctx.lineWidth=10;ctx.shadowColor='#bcd4ff';ctx.shadowBlur=40;ctx.beginPath();let x=300+hash(f*10|0,1)*480,y=900;ctx.moveTo(x,y);for(let s=0;s<12;s++){x+=(hash(s,f*10|0)-0.5)*140;y+=80;ctx.lineTo(x,y)}ctx.stroke();ctx.restore();
      ctx.save();ctx.globalCompositeOperation='lighter';for(let j=0;j<8;j++){const a=hash(j,f*7|0)*6.283,d=k*500;particle(540+Math.cos(a)*d,850+Math.sin(a)*d*0.6,10,RED,'',1-k/0.35)}ctx.restore()}}
  ctx.fillStyle='rgba(120,140,180,0.35)';for(let i=0;i<160;i++){const x=(hash(i,1)*W+lt*-120)%W,y=(hash(i,2)*H+lt*1600)%H;ctx.fillRect((x+W)%W,y,2,26)}
  label('⛈️ thunderstorms',W/2,1250,58,'#ffffff',segA(t,TA.storm+0.2,TA.storm+0.5))}
function banana(x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-220,-60);ctx.quadraticCurveTo(0,180,230,-70);ctx.quadraticCurveTo(250,-90,240,-110);ctx.quadraticCurveTo(0,90,-205,-90);ctx.closePath();
  const g=ctx.createLinearGradient(0,-100,0,120);g.addColorStop(0,'#ffe36a');g.addColorStop(1,'#e8b020');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=10;ctx.strokeStyle='#8a6a10';ctx.stroke();ctx.fillStyle='#5a4210';ctx.beginPath();ctx.ellipse(-215,-78,16,22,0.6,0,7);ctx.fill();ctx.fillRect(228,-122,26,30);ctx.restore()}
function drawBanana(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a1a4a');g.addColorStop(1,'#120a24');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);grid(t,0.06);const lt=t-TA.banana;const s=easeOut(segA(t,TA.banana,TA.banana+0.5));
  banana(W/2,1000+Math.sin(t*2)*14,1.6*s+0.01,-0.15);
  const pops=[1.6,3.3];for(const p0 of pops){const k=lt-p0;if(k>0&&k<1.6){const a=-1.1+(p0>2?0.6:0);const d=easeOut(k/1.6)*700;ctx.save();ctx.globalCompositeOperation='lighter';particle(W/2+Math.cos(a)*d,980+Math.sin(a)*d,26,RED,'+',Math.min(1,(1.6-k)*2));glow(W/2,980,200,[255,120,130],0.5*Math.max(0,1-k*3));ctx.restore()}}
  label('🍌 + positron',W/2,560,64,'#ffffff',segA(t,TA.banana+0.2,TA.banana+0.5))}
function drawCern(t){const lt=t-TA.cern;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1424');g.addColorStop(1,'#14243a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);grid(t,0.08);
  if(t<TA.trap){const k=easeOut(segA(t,TA.cern,TA.cern+0.6));ctx.save();ctx.translate(W/2,1000);ctx.scale(k,k*0.55);ctx.strokeStyle='#4a6a9a';ctx.lineWidth=60;ctx.beginPath();ctx.arc(0,0,380,0,7);ctx.stroke();ctx.strokeStyle='#8ab0e0';ctx.lineWidth=10;ctx.beginPath();ctx.arc(0,0,380,0,7);ctx.stroke();ctx.restore();
    ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=t*4+i*2.1;const x=W/2+Math.cos(a)*380*k,y=1000+Math.sin(a)*380*k*0.55;for(let j=0;j<12;j++){const b=a-j*0.05;glow(W/2+Math.cos(b)*380*k,1000+Math.sin(b)*380*k*0.55,24,[255,120,140],0.5*(1-j/12))}particle(x,y,14,RED,'',1)}ctx.restore();
    label('CERN 🇨🇭 antimatter factory',W/2,560,54,'#ffffff',segA(t,TA.cern+0.3,TA.cern+0.6))}
  else{const k=easeOut(segA(t,TA.trap,TA.trap+0.5));ctx.save();ctx.globalAlpha=k;// trap cylinder
    ctx.fillStyle='rgba(120,160,220,0.12)';rrect(300,640,480,740,60);ctx.fill();ctx.strokeStyle='rgba(160,200,255,0.7)';ctx.lineWidth=6;rrect(300,640,480,740,60);ctx.stroke();
    for(let i=0;i<5;i++){ctx.fillStyle='#b87333';rrect(270,700+i*140,540,50,20);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.25)';rrect(280,706+i*140,520,10,5);ctx.fill()}
    ctx.strokeStyle='rgba(120,200,255,0.35)';ctx.lineWidth=3;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(540,1010,60+i*30,330,0,0,7);ctx.stroke()}ctx.restore();
    const px=540+Math.sin(t*3)*30,py=1010+Math.cos(t*2.3)*50;ctx.save();ctx.globalCompositeOperation='lighter';particle(px,py,30,RED,'−',k);ctx.restore();
    label('🧲 magnetic trap',W/2,520,58,'#ffffff',k);label('no walls touched',W/2,1470,44,'rgba(255,255,255,0.85)',segA(t,TA.trap+0.8,TA.trap+1.1))}}
function drawCost(t){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#10240e');g.addColorStop(1,'#061206');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const lt=t-TA.cost;
  ctx.save();ctx.globalAlpha=0.25;for(let i=0;i<40;i++){const x=(hash(i,1)*W),y=(hash(i,2)*H+lt*300*(0.5+hash(i,3)))%H;ctx.font='70px "Noto Color Emoji"';ctx.textAlign='center';ctx.fillText('💵',x,y)}ctx.restore();
  const k=easeOut(segA(t,TA.cost+0.3,TA.cost+2.2));const v=Math.round(62.5*k*10)/10;label('1 GRAM =',W/2,820,70,'#ffffff',segA(t,TA.cost,TA.cost+0.3));
  label('$'+(k<1?Math.floor(62500*k).toLocaleString('en-US')+',000,000,000':'62,500,000,000,000'),W/2,960,fitSize('$62,500,000,000,000',980,96),'#7dff9a',segA(t,TA.cost+0.2,TA.cost+0.4));
  label('(estimate)',W/2,1060,40,'rgba(255,255,255,0.7)',segA(t,TA.cost+2.2,TA.cost+2.5));label('🥇 most expensive stuff on Earth',W/2,1250,48,'#ffd84a',segA(t,TA.cost+2.6,TA.cost+2.9))}
function drawBulb(t){const lt=t-TA.bulb;ctx.fillStyle='#07070c';ctx.fillRect(0,0,W,H);const on=lt>0.6&&lt<3.4?1:0;const fl=lt>3.0&&lt<3.4?(hash(Math.floor(lt*20),2)<0.5?1:0):1;const b=on*fl;
  if(b){ctx.save();ctx.globalCompositeOperation='lighter';glow(540,880,700,[255,220,140],0.5);ctx.restore()}
  ctx.fillStyle=b?'#fff4c8':'#3a3a40';ctx.beginPath();ctx.arc(540,880,170,0,7);ctx.fill();ctx.fillStyle='#8a8a90';rrect(470,1030,140,120,16);ctx.fill();ctx.fillStyle='#6a6a70';for(let i=0;i<3;i++)rrect(470,1045+i*35,140,14,7),ctx.fill();
  ctx.strokeStyle=b?'#ff9a2a':'#5a5a60';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(500,1030);ctx.lineTo(510,900);ctx.lineTo(540,860);ctx.lineTo(570,900);ctx.lineTo(580,1030);ctx.stroke();
  label('ALL antimatter ever made at CERN',W/2,560,46,'#ffffff',segA(t,TA.bulb+0.2,TA.bulb+0.5));label('💡 = a few minutes of light',W/2,1300,54,'#ffd84a',segA(t,TA.bulb+1.4,TA.bulb+1.7))}
function drawPet(t){const lt=t-TA.pet;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#e8eef6');g.addColorStop(1,'#b8c4d4');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#d8dee8';rrect(160,1250,760,60,20);ctx.fill();ctx.fillStyle='#a8b4c4';rrect(220,1310,640,300,30);ctx.fill();
  // body silhouette lying
  ctx.fillStyle='#f0c8a0';ctx.beginPath();ctx.arc(250,1205,52,0,7);ctx.fill();rrect(300,1170,520,80,40);ctx.fill();
  // scanner ring
  const rx=540+Math.sin(lt*0.8)*120;ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.ellipse(rx,1100,170,330,0,0,7);ctx.fill();ctx.fillStyle='#2a3a5a';ctx.beginPath();ctx.ellipse(rx,1100,120,270,0,0,7);ctx.fill();ctx.strokeStyle='#5ab0ff';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(rx,1100,145,300,0,0,7);ctx.stroke();
  ctx.fillStyle='#f0c8a0';rrect(300,1170,520,80,40);ctx.fill();
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.restore();
  // screen with glowing spots
  ctx.save();ctx.translate(0,80);ctx.fillStyle='#10141c';rrect(240,520,600,420,30);ctx.fill();ctx.fillStyle='#2a3448';ctx.beginPath();ctx.ellipse(540,730,150,190,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(540,560,70,70,0,0,7);ctx.fill();
  ctx.save();ctx.globalCompositeOperation='lighter';for(const[x,y,r]of[[540,560,40],[500,720,30],[590,760,24],[545,820,20]]){glow(x,y,r*2*(1+0.2*Math.sin(t*4+x)),[255,120,60],0.9)}ctx.restore();ctx.restore();
  label('🏥 PET scan',W/2,470,64,'#1a2a4a',segA(t,TA.pet+0.2,TA.pet+0.5))}
function drawWhy(t){space(t,'#030312','#100828');const lt=t-TA.why;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const gx=200+hash(i,21)*680,gy=500+hash(i,22)*900,r=80+hash(i,23)*80;ctx.save();ctx.translate(gx,gy);ctx.rotate(t*0.15+i);for(let j=0;j<70;j++){const an=j*0.45,dd=r*j/70;ctx.fillStyle='rgba(220,210,255,0.6)';ctx.fillRect(Math.cos(an)*dd,Math.sin(an)*dd*0.5,3,3)}glow(0,0,r*0.6,[255,230,200],0.5);ctx.restore()}ctx.restore();
  const k=popS(lt-0.3);ctx.save();ctx.translate(W/2,960);ctx.scale(k,k);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=20;txt('?',0,0,420,'#ffd84a');ctx.restore()}
function popS(k){return k<0?0:k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1}
// ---------------- captions ----------------
const capsA=[[0.2,3.1,'⚛️ What is antimatter?'],[3.3,7.5,'👯 Every particle has an evil twin'],[7.7,11.1,'Electron (−) ↔ Positron (+)'],[11.3,16.0,'💥 If they touch… both vanish'],[16.2,22.3,'1 gram = 43 kilotons of energy'],
  [22.5,25.1,'💥 The Big Bang made both'],[25.3,30.2,'…but matter won by 1 in a billion'],[30.4,35.4,'The leftover = everything. Even you'],[35.6,41.6,'Where is it today? 🔍'],[41.8,45.3,'🍌 1 positron every ~75 minutes'],
  [45.5,50.8,'🧲 Trapped in magnetic bottles'],[51.0,56.3,'💸 The most expensive substance'],[56.5,60.6,'All of it ever made → 1 bulb, minutes'],[60.8,65.7,'🏥 PET scans use positrons'],[65.9,68.8,'🤯 Why did matter win? Nobody knows']];
function drawCaptionA(t){for(const[a,b,s]of capsA){if(t<a||t>=b)continue;const k=t-a;const sc=k<0.18?0.6+0.4*ease(k/0.18)+Math.sin(k/0.18*Math.PI)*0.12:1;const al=Math.min(1,k/0.1,(b-t)/0.12);const size=fitSize(s,920,56);
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,330);ctx.scale(sc,sc);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.72)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function drawTitleA(t){const a=t<2.9?1:clamp((3.2-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,820);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('What is',0,-90,100,'#ffffff');txt('ANTIMATTER?',0,30,fitSize('ANTIMATTER?',980,140),'#ffd84a');ctx.restore()}
function drawStatsA(t){const box=(a,b,lab,val,col)=>{if(t>=a&&t<b)statBoxM(lab,val,col,Math.min(1,(t-a)/0.25,(b-t)/0.2))};
  box(TA.twins+1.6,TA.names,'MASS','IDENTICAL','#ffffff');box(TA.names+0.4,TA.ann,'CHARGE','−1  vs  +1','#ffd84a');
  box(TA.eflash+0.3,TA.eflash+2.4,'ENERGY (1 g)','43 kt TNT','#ffd84a');box(TA.eflash+2.4,TA.bang,'THAT IS','≈ 3× HIROSHIMA','#ff6b6b');
  box(TA.earth+0.5,TA.storm,'MADE BY','COSMIC RAYS','#9fd0ff');box(TA.storm+0.4,TA.banana,'MADE IN','LIGHTNING','#ffffff');box(TA.banana+0.6,TA.cern,'BANANA','1 e⁺ / 75 min','#ffd84a');
  box(TA.cern+0.6,TA.trap,'DISCOVERED','1932','#ffffff');box(TA.trap+0.5,TA.cost,'2023','IT FALLS DOWN ⬇️','#7dff9a');box(TA.pet+0.6,TA.why,'USED IN','HOSPITALS','#7dff9a')}
function drawEndA(t){const k=ease((t-TA.endc)/0.5)*clamp((LOOPA-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.78*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-TA.endc<0.5?0.7+0.3*ease((t-TA.endc-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);txt('What should I',0,-100,92,'#ffd84a');txt('explain next?',0,10,92,'#ffd84a');const bounce=Math.abs(Math.sin((t-TA.endc)*5))*26;txt('👇',0,190+bounce,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-TA.endc-0.6)/0.4);txt('Follow The What If Lab ⚛️',W/2,1180,50,'#ffffff','center',800);ctx.restore()}
// ---------------- render ----------------
function renderSceneA(t){ctx.save();const S=sceneA(t);let sh=0;const sk=(t0,a,d)=>{const k=t-t0;if(k>=0&&k<d)sh+=a*(1-k/d)};sk(TA.boom,22,0.6);sk(TA.eflash,26,0.8);sk(TA.bang,30,1.0);if(sh)ctx.translate((hash(Math.floor(t*60),1)-0.5)*sh,(hash(Math.floor(t*60),2)-0.5)*sh);
  if(S==='city'){drawCityM(Math.min(2.9,t*0.9))}else if(S==='twins')drawTwins(t);else if(S==='ann')drawAnn(t);else if(S==='energy')drawEnergy(t);else if(S==='bang')drawBang(t);else if(S==='earth')drawEarthS(t);else if(S==='storm')drawStorm(t);else if(S==='banana')drawBanana(t);else if(S==='cern')drawCern(t);else if(S==='cost')drawCost(t);else if(S==='bulb')drawBulb(t);else if(S==='pet')drawPet(t);else drawWhy(t);
  ctx.restore()}
function overlaysA(t){ctx=ctx0;const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  [TA.twins,TA.ann,TA.energy,TA.earth,TA.storm,TA.banana,TA.cern,TA.cost,TA.bulb,TA.pet,TA.why].forEach(tt=>flash(tt,0.45,0.22));flash(TA.boom,0.9,0.5);flash(TA.eflash,0.95,0.7);flash(TA.bang,1,0.6);
  if(t<3.2)drawTitleA(t);drawStatsA(t);if(t<TA.endc)drawCaptionA(t);drawEndA(t);{const k=LOOPA-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const tf=fi/FPS;const t0=tf>=LOOPA?tf-LOOPA:tf;for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderSceneA(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;ctx0.drawImage(acc,0,0);overlaysA(tf>=LOOPA?tf-LOOPA:tf)}
window.frame=frame;window.NFR=DURA*FPS;
