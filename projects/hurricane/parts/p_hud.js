function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.h0,20,0.45);S(EV.h1,18,0.45);S(EV.hit1,22,0.6);S(EV.crk1,16,0.5);S(EV.hit2,34,1.0);S(EV.boom2,10,0.4);S(EV.hit3,46,1.0);S(EV.hit5,4,0.4);S(EV.fall5+0.35,14,0.4);
  for(const b of BOLTS)if(tt<R[3])S(b+0.25,6,0.5);
  const rn=roundAt(tt);if(rn===0&&tt>=EV.e1&&tt<EV.crk1)a+=2+4*clamp((tt-EV.e1)/3,0,1);if(rn<0)a+=1.5;return a}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?50:54,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  const C1=1600,C2=1715;
  // R1
  if(rn===0&&t>=EV.e1+0.3&&t<EV.hit1)card('Category 5: winds over 252 km/h 💨',C1,ORANGE,50,EV.e1+0.3,t);
  if(rn===0&&t>=EV.e1+1.3&&t<EV.hit1)card('= twice highway speed 🚗💨',C2,DARK,52,EV.e1+1.3,t);
  if(rn===0&&t>=EV.hit1&&t<EV.crk1)card('*WHOOSH* 🌪️',660,PINK,84,EV.hit1,t);
  if(rn===0&&t>=EV.crk1&&t<EV.res1)card('*plop*',660,ORANGE,80,EV.crk1,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: ants are so tiny & light…',C1,BLUE,48,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.2&&t<R[1]-0.2)card('a fall from ANY height can’t hurt them 🪂',C2,BLUE,42,EV.res1+1.2,t);
  // R2
  if(rn===1&&t>=EV.s2+0.4&&t<EV.hit2)card('The wind shoves the SEA onto land 🌊',C1,ORANGE,44,EV.s2+0.4,t);
  if(rn===1&&t>=EV.s2+1.4&&t<EV.hit2)card('storm surge: up to ~8 m high 😱',C2,DARK,48,EV.s2+1.4,t);
  if(rn===1&&t>=EV.hit2+0.05&&t<EV.boom2)card('SPLASH 💦',660,PINK,86,EV.hit2+0.05,t);
  if(rn===1&&t>=EV.boom2&&t<EV.res2)card('…wait, he’s BACK?! 🍃',660,GREEN,66,EV.boom2,t);
  if(rn===1&&t>=EV.res2+0.4&&t<R[2]-0.2)card('Real: ants trap tiny air bubbles',C1,BLUE,48,EV.res2+0.4,t);
  if(rn===1&&t>=EV.res2+1.1&&t<R[2]-0.2)card('& can survive underwater for HOURS 🫧',C2,BLUE,44,EV.res2+1.1,t);
  if(rn===1&&t>=EV.res2+2.0&&t<R[2]-0.2)card('fire ants even build living rafts 🛟',1830,CYAN,44,EV.res2+2.0,t);
  // R3
  if(rn===2&&t>=EV.b3+0.3&&t<EV.hit3)card('Hurricanes spark LIGHTNING ⚡',C1,PURPLE,50,EV.b3+0.3,t);
  if(rn===2&&t>=EV.b3+1.3&&t<EV.hit3)card('one bolt: ~30,000 °C 🔥',C2,DARK,54,EV.b3+1.3,t);
  if(rn===2&&t>=EV.hit3+0.05&&t<EV.res3)card('KRA-KOOM ⚡',660,PINK,86,EV.hit3+0.05,t);
  if(rn===2&&t>=EV.res3+0.5&&t<R[3]-0.2)card('Real: that’s ~5x hotter than the Sun’s surface',C1,BLUE,40,EV.res3+0.5,t);
  if(rn===2&&t>=EV.res3+1.2&&t<R[3]-0.2)card('the air EXPLODES = thunder 🔊',C2,BLUE,48,EV.res3+1.2,t);
  // R4
  if(rn===3&&t>=EV.k4+0.3&&t<EV.c4)card('Suddenly… silence 😶',C1,PURPLE,54,EV.k4+0.3,t);
  if(rn===3&&t>=EV.k4+1.2&&t<EV.c4)card('the EYE: calm air & blue sky 🌀',C2,DARK,48,EV.k4+1.2,t);
  if(rn===3&&t>=EV.c4&&t<EV.res4)card('a wall of clouds ~15 km high 😳',1640,PINK,52,EV.c4,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('Real: a hurricane releases heat energy',C1,BLUE,44,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.1&&t<R[4]-0.2)card('~200x ALL power plants on Earth ⚡',C2,BLUE,46,EV.res4+1.1,t);
  if(rn===3&&t>=EV.res4+2.0&&t<R[4]-0.2)card('…ant: still asleep 😴',1830,CYAN,46,EV.res4+2.0,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.dot5+0.4)card('The storm is gone. He survived… 😌',C1,DARK,48,R[4]+0.6,t);
  if(rn===4&&t>=EV.dot5+0.6&&t<EV.look5+0.2)card('…wait 😳',660,'rgba(30,120,190,0.92)',66,EV.dot5+0.6,t);
  if(rn===4&&t>=EV.look5+0.3&&t<EV.hit5)card('ONE gentle breeze: 2 km/h 🍃',1730,PURPLE,54,EV.look5+0.3,t);
  if(rn===4&&t>=EV.hit5&&t<EV.res5+0.4)card('*pff*',660,ORANGE,76,EV.hit5,t);
  if(rn===4&&t>=EV.res5+0.7)card('Real: hurricanes die fast over land',1400,BLUE,50,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.3)card('no warm ocean water = no fuel 🌊',1515,BLUE,48,EV.res5+1.3,t);
  if(rn===4&&t>=EV.res5+2.4)card('the breeze had NO excuse 💀',1630,RED,50,EV.res5+2.4,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('CATEGORY 5',0,-170,fitSize('CATEGORY 5',960,100),'#5AF0FF');txt('HURRICANE 🌀',0,-50,fitSize('HURRICANE 🌀',960,140),'#FFD84A');txt('vs',0,50,70,'#ffffff');txt('ONE DYING ANT 🐜',0,145,92,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('The strongest storm on Earth. Who wins? 🤔',1500,'rgba(15,10,30,0.66)',48);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived 252 km/h winds, a storm surge,';txt(l1,0,-260,fitSize(l1,980,56),'#FFD84A');const l2='lightning & the eye of the storm 🌀';txt(l2,0,-180,fitSize(l2,960,60),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('gentle breeze 🍃',0,60,fitSize('gentle breeze 🍃',960,110),'#7DFF9A');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);const l3='What should he fight next? 👇';txt(l3,W/2,1100,fitSize(l3,960,56),'#ffffff','center',800);ctx.restore()}
