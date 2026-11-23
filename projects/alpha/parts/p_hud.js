function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.h0,16,0.4);S(EV.h1,16,0.4);S(EV.hit1,42,1.4);S(EV.hit2,12,0.4);S(EV.boom2,12,0.4);S(EV.hit3,6,0.5);S(EV.c4,30,1.0);S(EV.hit5,8,0.4);S(EV.fall5+0.35,14,0.4);
  const rn=roundAt(tt);if(rn===0&&tt>=EV.e1+0.8&&tt<EV.hit1)a+=2+3*(tt-EV.e1-0.8);if(rn===0&&tt>=EV.hit1&&tt<EV.hit1+2.6)a+=5;if(rn===3&&tt>=EV.c4-1.2&&tt<EV.c4)a+=3;return a}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',58,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?50:54,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  const C1=1600,C2=1715,C3=1830;
  // R1 laser
  if(rn===0&&t>=EV.e1+0.2&&t<EV.hit1)card('Breakthrough Starshot plan 🚀',C1,PURPLE,50,EV.e1+0.2,t);
  if(rn===0&&t>=EV.e1+1.2&&t<EV.hit1)card('100 GW ≈ 50 Hoover Dams ⚡',C2,DARK,52,EV.e1+1.2,t);
  if(rn===0&&t>=EV.e1+2.2&&t<EV.hit1)card('3… 2… 1…',660,'rgba(30,120,190,0.92)',70,EV.e1+2.2,t);
  if(rn===0&&t>=EV.hit1&&t<EV.res1)card('60,000 g 😵',660,PINK,96,EV.hit1,t);
  if(rn===0&&t>=EV.hit1+0.6&&t<EV.res1)card('0 → 20% light speed in minutes',C1,ORANGE,46,EV.hit1+0.6,t);
  if(rn===0&&t>=EV.res1+0.4&&t<R[1]-0.2)card('Real: a proposed laser-sail plan',C1,BLUE,46,EV.res1+0.4,t);
  if(rn===0&&t>=EV.res1+1.1&&t<R[1]-0.2)card('tiny probes on meter-wide sails',C2,BLUE,46,EV.res1+1.1,t);
  if(rn===0&&t>=EV.res1+1.9&&t<R[1]-0.2)card('≈ 60,000 km per SECOND 🤯',C3,CYAN,48,EV.res1+1.9,t);
  // R2 trip
  if(rn===1&&t>=EV.s2+0.2&&t<EV.hit2)card('Distance: 4.2 light-years 🌌',C1,DARK,50,EV.s2+0.2,t);
  if(rn===1&&t>=EV.s2+1.2&&t<EV.hit2)card('Voyager 1 would need ~75,000 years 🐢',C2,ORANGE,42,EV.s2+1.2,t);
  if(rn===1&&t>=EV.s2+2.2&&t<EV.hit2)card('Light sail: ~20 years 🚀',C3,GREEN,50,EV.s2+2.2,t);
  if(rn===1&&t>=EV.hit2&&t<EV.res2)card('ZAP ⚡ cosmic rays',660,'rgba(20,150,190,0.92)',76,EV.hit2,t);
  if(rn===1&&t>=EV.res2+0.4&&t<R[2]-0.2)card('Real: radiation & dust are',C1,BLUE,48,EV.res2+0.4,t);
  if(rn===1&&t>=EV.res2+1.1&&t<R[2]-0.2)card('the biggest dangers on the way',C2,BLUE,46,EV.res2+1.1,t);
  if(rn===1&&t>=EV.res2+1.9&&t<R[2]-0.2)card('…ant: crumbs everywhere 🍪',C3,PURPLE,44,EV.res2+1.9,t);
  // R3 three suns
  if(rn===2&&t>=EV.b3+0.5&&t<EV.hit3)card('Alpha Centauri A ☀️ + B 🟠',C1,ORANGE,50,EV.b3+0.5,t);
  if(rn===2&&t>=EV.b3+1.5&&t<EV.hit3)card('+ tiny red Proxima 🔴',C2,PINK,52,EV.b3+1.5,t);
  if(rn===2&&t>=EV.hit3&&t<EV.res3)card('3 SUNS?! 😵‍💫',1640,PURPLE,80,EV.hit3,t);
  if(rn===2&&t>=EV.res3+0.4&&t<R[3]-0.2)card('Real: A & B orbit each other',C1,BLUE,48,EV.res3+0.4,t);
  if(rn===2&&t>=EV.res3+1.1&&t<R[3]-0.2)card('once every ~80 years 🔄',C2,BLUE,50,EV.res3+1.1,t);
  if(rn===2&&t>=EV.res3+1.9&&t<R[3]-0.2)card('Webb may have spotted a giant planet 🪐',C3,CYAN,40,EV.res3+1.9,t);
  // R4 superflare
  if(rn===3&&t>=EV.k4+0.3&&t<EV.c4)card('Proxima: an angry red dwarf 🔴',C1,DARK,48,EV.k4+0.3,t);
  if(rn===3&&t>=EV.k4+1.3&&t<EV.c4)card('…it’s about to sneeze 🤧',C2,PINK,50,EV.k4+1.3,t);
  if(rn===3&&t>=EV.c4&&t<EV.res4)card('14,000x BRIGHTER 💥',1640,PINK,80,EV.c4,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('Real: May 1, 2019 – Proxima flared',C1,BLUE,44,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.1&&t<R[4]-0.2)card('14,000x brighter in UV, for ~7 s',C2,BLUE,44,EV.res4+1.1,t);
  if(rn===3&&t>=EV.res4+1.9&&t<R[4]-0.2)card('bad news for life on Proxima b 😬',C3,RED,44,EV.res4+1.9,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.5&&t<EV.dot5+0.2)card('ARRIVED: Proxima b 🪐🎉',C1,GREEN,54,R[4]+0.5,t);
  if(rn===4&&t>=R[4]+1.4&&t<EV.dot5+0.2)card('closest known exoplanet system',C2,DARK,46,R[4]+1.4,t);
  if(rn===4&&t>=EV.dot5+0.3&&t<EV.look5+0.2)card('…wait 😳',660,'rgba(30,120,190,0.92)',66,EV.dot5+0.3,t);
  if(rn===4&&t>=EV.look5&&t<EV.hit5)card('Trip: ~20 YEARS 📅',C1,ORANGE,58,EV.look5,t);
  if(rn===4&&t>=EV.look5+1.0&&t<EV.hit5)card('Worker ant lifespan: ~1 year 🐜',C2,RED,48,EV.look5+1.0,t);
  if(rn===4&&t>=EV.res5+0.7)card('Real: Starshot would carry no crew',1400,BLUE,48,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.4)card('just gram-sized chips 🔬',1515,BLUE,50,EV.res5+1.4,t);
  if(rn===4&&t>=EV.res5+2.4)card('photos home would take 4.2 years 📡',1630,PURPLE,44,EV.res5+2.4,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('THE NEAREST STARS',0,-170,fitSize('THE NEAREST STARS',960,92),'#5AF0FF');txt('ALPHA CENTAURI 🌟',0,-50,fitSize('ALPHA CENTAURI 🌟',980,120),'#FFD84A');txt('vs',0,50,70,'#ffffff');txt('ONE DYING ANT 🐜',0,145,92,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Riding a laser sail. Who wins? 🤔',1500,'rgba(15,10,30,0.66)',50);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived a 100 GW laser, 60,000 g,';txt(l1,0,-260,fitSize(l1,980,58),'#FFD84A');const l2='3 suns & a superflare ☀️';txt(l2,0,-180,fitSize(l2,960,62),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('calendar 📅',0,60,fitSize('calendar 📅',960,110),'#B89AFF');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);const l3='Would YOU ride the laser? 🚀';txt(l3,W/2,1100,fitSize(l3,960,56),'#ffffff','center',800);ctx.restore()}
