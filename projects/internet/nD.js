// ================= INTERNET DISAPPEARS: overlays =================
function atmoA(e,cm){const a=e.a==null?1:e.a;if(a<=0.01)return;const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.4,'rgba(110,190,255,0.55)');g.addColorStop(0.62,'rgba(80,150,255,0.25)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore();return r}
const CAPS=[[0.05,1.2,'Your ^FEED 📱'],[1.3,2.4,'~INTERNET: DELETED 🌐'],[2.4,3.45,'for ^5 SECONDS ⏱️'],
 [3.6,5.0,'every ^WEBSITE 🌐'],[5.0,6.4,'every ^MESSAGE 💬'],[6.4,7.9,'every ^VIDEO ▶️'],[7.9,9.4,'and then… ~POOF 💨'],
 [9.8,11.0,'^CYBER MONDAY 🛒'],[11.0,12.5,'you hit ^BUY NOW 👆'],[12.5,14.5,'payment: ~FAILED ❌'],[14.5,16.9,'the deal: ~GONE 😭'],
 [17.2,18.6,'Under the ^OCEAN 🌊'],[18.6,20.0,'cables full of ^LIGHT 💡'],[20.0,21.9,'linking ^CONTINENTS 🌍'],[21.9,23.9,'~ALL DARK ❌'],
 [24.2,25.6,'Every ^TEXT 💬'],[25.6,27.2,'every ^EMAIL 📧'],[27.2,29.0,'~NOT DELIVERED ❌'],[29.0,30.9,'online games: ~KICKED 🎮'],
 [31.2,32.6,'But ^GPS? 🛰️'],[32.6,34.0,'it ^STILL WORKS ✅'],[34.0,35.6,'satellites don\'t need Wi-Fi'],[35.6,37.3,'they beam ^TIME signals ⏱️'],
 [37.5,39.0,'And ^YOU? 🫵'],[39.0,40.9,'staring at a ~SPINNER 🌀'],[41.05,42.3,'Internet ^BACK ✅'],[42.3,43.5,'but not ~INSTANTLY 😳'],
 [45.2,46.6,'no ~ONLINE SHOPPING 🛒'],[46.6,47.8,'no ~CARD payments 💳'],[47.8,49.4,'flights & banks: ~CHAOS ✈️'],[49.4,51.5,'and no ~TIKTOK 😱'],
 [51.8,53.0,'Relax 😮‍💨'],[53.0,54.8,'the internet is ^BACK ✅'],[54.8,56.6,'order ^CONFIRMED 🛍️'],[56.6,58.5,'Happy ^CYBER MONDAY 🛒']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,isPhone(scn(t))?1440:1310);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=880,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+460+i*80,y-16,60,32,16);ctx.fill()}
  ctx.font='900 38px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'🌐 INTERNET: BACK ✅':`🌐 INTERNET: OFF · ${n}/5`,x0+32,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
// ---------- globe links ----------
function visP(p,cm){return V.dot(p,cm.eye)>1.0}
function arcPts(l,lift,N){const a=NHUB[l[0]],b=NHUB[l[1]];const P=[];for(let i=0;i<=N;i++){const u=i/N;const n=V.norm(slerpN(a,b,u));P.push(V.sc(n,1.004+lift*Math.sin(u*Math.PI)))}return P}
function linksFX(t,cm,mode){const sea=mode==='sea';const col=mode==='back'?'125,255,154':sea?'90,240,255':'90,240,255';const col2=mode==='idea'?'255,216,74':col;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';ctx.lineJoin='round';
  NLINK.forEach((l,i)=>{const a=linkA(t,i);if(a<=0.01)return;const lift=sea?0.0:0.06+0.12*l[2];const P=arcPts(l,lift,28);const S=P.map(p=>visP(p,cm)?prj(p):null);
    for(const[lw,al]of[[sea?16:12,0.18],[sea?6:4.5,0.75],[1.8,1]]){ctx.strokeStyle=al===1?`rgba(235,255,255,${a})`:`rgba(${i%3===0?col2:col},${al*a})`;ctx.lineWidth=lw;ctx.beginPath();let on=false;for(const s of S){if(!s){on=false;continue}if(!on){ctx.moveTo(s[0],s[1]);on=true}else ctx.lineTo(s[0],s[1])}ctx.stroke()}
    for(let k=0;k<(sea?3:2);k++){const u=(t*(0.55+l[3]*0.5)+k/(sea?3:2)+l[3])%1;const j=Math.floor(u*28);const s=S[j];if(!s)continue;glowAt(s,sea?26:22,'255,255,255',0.9*a);glowAt(s,sea?60:48,col,0.5*a)}});
  NHUB.forEach((h,i)=>{if(!visP(V.sc(h,1.004),cm))return;let a=0;NLINK.forEach((l,j)=>{if(l[0]===i||l[1]===i)a=Math.max(a,linkA(t,j))});if(a<=0.01)return;const s=prj(V.sc(h,1.004));if(!s)return;glowAt(s,30,col,0.8*a);glowAt(s,8,'255,255,255',a)});ctx.restore()}
// dead links (dim grey dashes) after the vanish
function deadLinks(t,cm,a){if(a<=0.01)return;ctx.save();ctx.setLineDash([10,12]);ctx.lineWidth=3;ctx.strokeStyle=`rgba(255,90,138,${0.35*a})`;NLINK.forEach((l,i)=>{const P=arcPts(l,0.06+0.12*l[2],20);ctx.beginPath();let on=false;for(const p of P){const s=visP(p,cm)?prj(p):null;if(!s){on=false;continue}if(!on){ctx.moveTo(s[0],s[1]);on=true}else ctx.lineTo(s[0],s[1])}ctx.stroke()});ctx.restore()}
// ---------- GPS orbits ----------
const GPSO=[[0.95,0.3],[0.95,2.4],[0.95,4.5]];const GR=1.75;
function gpsPos(o,u){const[inc,raan]=GPSO[o];const p=[Math.cos(u)*GR,0,Math.sin(u)*GR];const y=p[2]*Math.sin(inc),z=p[2]*Math.cos(inc);const x=p[0];return[x*Math.cos(raan)-z*Math.sin(raan),y,x*Math.sin(raan)+z*Math.cos(raan)]}
function occl(p,cm){const e=cm.eye;const d=V.sub(p,e);const L=V.len(d);const f=V.sc(d,1/L);const b=V.dot(e,f);const c=V.dot(e,e)-1;const disc=b*b-c;if(disc<0)return false;const t0=-b-Math.sqrt(disc);return t0>0&&t0<L}
function satGlyph(s,sz,a){ctx.save();ctx.globalAlpha=a;ctx.translate(s[0],s[1]);ctx.fillStyle='#2a4590';ctx.fillRect(-sz*1.9,-sz*0.35,sz*1.2,sz*0.7);ctx.fillRect(sz*0.7,-sz*0.35,sz*1.2,sz*0.7);ctx.strokeStyle='#8fb3ff';ctx.lineWidth=2;ctx.strokeRect(-sz*1.9,-sz*0.35,sz*1.2,sz*0.7);ctx.strokeRect(sz*0.7,-sz*0.35,sz*1.2,sz*0.7);
  ctx.fillStyle='#e8ecf5';ctx.fillRect(-sz*0.5,-sz*0.5,sz,sz);ctx.fillStyle='#ffd84a';ctx.fillRect(-sz*0.5,-sz*0.5,sz,sz*0.25);ctx.restore()}
function gpsFX(t,cm){const k=t-EV.r4;const a=seg(t,EV.r4+0.2,EV.r4+0.8)*clamp((EV.r5-0.1-t)/0.25,0,1);if(a<=0)return;
  const user=V.norm(V.add(V.norm(cm.eye),[0,0.32,0]));const us=prj(V.sc(user,1.0));const sats=[];
  for(let o=0;o<3;o++){ctx.save();ctx.setLineDash([12,10]);ctx.lineWidth=3;ctx.strokeStyle=`rgba(200,225,255,${0.45*a})`;ctx.beginPath();let on=false;for(let i=0;i<=96;i++){const p=gpsPos(o,i/96*TAU2);const s=occl(p,cm)?null:prj(p);if(!s){on=false;continue}if(!on){ctx.moveTo(s[0],s[1]);on=true}else ctx.lineTo(s[0],s[1])}ctx.stroke();ctx.restore();
    for(let j=0;j<2;j++){const p=gpsPos(o,j*Math.PI+o*1.1+t*0.18);if(occl(p,cm))continue;const s=prj(p);if(s)sats.push([s,p])}}
  sats.sort((x,y)=>V.dot(V.norm(x[1]),user)<V.dot(V.norm(y[1]),user)?1:-1);
  if(us&&t>EV.r4+1.4){sats.slice(0,4).forEach(([s],i)=>{const b=seg(t,EV.r4+1.4+i*0.2,EV.r4+1.7+i*0.2)*a;if(b<=0)return;ctx.save();ctx.strokeStyle=`rgba(125,255,154,${0.55*b})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(us[0],us[1]);ctx.stroke();ctx.restore();
    for(let q=0;q<2;q++){const u=(t*0.9+q*0.5+i*0.13)%1;glowAt([lerp(s[0],us[0],u),lerp(s[1],us[1],u)],18,'125,255,154',0.9*b)}})}
  for(const[s]of sats){glowAt(s,50,'255,216,74',0.35*a);satGlyph(s,30,a)}
  if(us&&t>EV.r4+2.4){const b=seg(t,EV.r4+2.4,EV.r4+2.7)*a;glowAt(us,60,'125,255,154',0.8*b);ctx.save();ctx.globalAlpha=b;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(us[0],us[1],10,0,TAU2);ctx.fill();ctx.restore();tag('📍 YOU ARE HERE ✅',[us[0],us[1]-60],'#7dff9a',b)}}
// ---------- town: message bubbles ----------
const BUB=[['hey 👋',-250,70,0.0],['📧 RE: invoice',250,0,0.5],['🎮 GG!',-260,210,1.0],['lol 😂',260,150,1.5],['send pics 📸',230,300,2.0]];
function bubblesFX(t){const head=prj([0,1.95,5.2]);if(!head)return;BUB.forEach(([s,dx,dy,d],i)=>{const k=t-EV.r3-0.3-d;if(k<0)return;const e=easeOut(Math.min(k/0.6,1));const x=head[0]+dx*e,y=head[1]+dy*e-Math.min(k,2)*15;
  const fail=k>1.3;const a=clamp((EV.r4-0.2-t)/0.25,0,1);if(a<=0)return;const p=popS(k);ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(p,p);ctx.font='900 40px Inter, "Noto Color Emoji"';const w=ctx.measureText(s).width+56;
  ctx.fillStyle=fail?'rgba(60,14,30,0.92)':'rgba(255,255,255,0.95)';rrect(-w/2,-36,w,72,36);ctx.fill();ctx.strokeStyle=fail?'#ff5a8a':'#5af0ff';ctx.lineWidth=4;rrect(-w/2,-36,w,72,36);ctx.stroke();ctx.fillStyle=fail?'#ffb0c4':'#14182a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,2);
  if(fail){ctx.font='900 30px Inter, "Noto Color Emoji"';ctx.fillStyle='#ff5a8a';ctx.fillText('❗ not delivered',0,62)}ctx.restore()});
  if(t>EV.r3+5.0){const a=seg(t,EV.r3+5.0,EV.r3+5.3)*clamp((EV.r4-0.2-t)/0.25,0,1);tag('🎮 CONNECTION LOST · PING ∞',[W/2,1180],'#ff5a8a',a)}}
// ---------- phone screen (2D UI mapped on the 3D screen, 370 x 770 units) ----------
function mpt(M,p){return[M[0]*p[0]+M[4]*p[1]+M[8]*p[2]+M[12],M[1]*p[0]+M[5]*p[1]+M[9]*p[2]+M[13],M[2]*p[0]+M[6]*p[1]+M[10]*p[2]+M[14]]}
function phoneMode(t){const S=scn(t);if(S==='hook')return t<EV.off?'feed':'offline';if(S==='r1')return t<EV.r1+1.6?'shop':t<EV.r1+3.0?'load':'fail';if(S==='r5')return'offline';
  if(S==='day')return t<EV.day+1.0?'offline':t<EV.day+1.5?'load':'ok';return'feed'}
const FEEDC=[['#ff5a8a','#5a2bd6','🐜','#antlife'],['#5af0ff','#1b3c8a','🌌','#space'],['#ffd84a','#d6452b','🌋','#science'],['#7dff9a','#1b7a5a','🧪','#whatif']];
function spinner(x,y,r,t,col){ctx.save();ctx.lineWidth=r*0.22;ctx.lineCap='round';for(let i=0;i<10;i++){const a=i/10*TAU2+Math.floor(t*12)/12*TAU2;ctx.strokeStyle=col||'#fff';ctx.globalAlpha=(i+1)/10;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*0.55,y+Math.sin(a)*r*0.55);ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.stroke()}ctx.restore()}
function wifiOff(x,y,s,col){ctx.save();ctx.lineCap='round';ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=s*0.12;for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(x,y,s*0.33*i,-Math.PI*0.78,-Math.PI*0.22);ctx.stroke()}ctx.fillStyle='rgba(255,255,255,0.85)';ctx.beginPath();ctx.arc(x,y,s*0.1,0,TAU2);ctx.fill();
  ctx.strokeStyle=col||'#ff5a8a';ctx.lineWidth=s*0.14;ctx.beginPath();ctx.moveTo(x-s*0.85,y-s*1.05);ctx.lineTo(x+s*0.85,y+s*0.2);ctx.stroke();ctx.restore()}
function statusBar(t,on){ctx.fillStyle='#fff';ctx.font='800 20px Inter';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('9:41',24,24);ctx.textAlign='right';ctx.font='800 20px Inter, "Noto Color Emoji"';ctx.fillText(on?'📶 🔋 82%':'❌ 🔋 82%',346,24)}
function uiFeed(t){const i=Math.floor(t/0.9)%FEEDC.length;const f=FEEDC[i];const k=(t/0.9)%1;const sl=k<0.18?(1-easeOut(k/0.18))*770:0;
  for(const[ff,dy]of[[FEEDC[(i+FEEDC.length-1)%FEEDC.length],sl-770],[f,sl]]){const g=ctx.createLinearGradient(0,dy,0,dy+770);g.addColorStop(0,ff[0]);g.addColorStop(1,ff[1]);ctx.fillStyle=g;ctx.fillRect(0,dy,370,770);ctx.font='150px "Noto Color Emoji"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ff[2],185,dy+330+Math.sin(t*5)*10);
    ctx.fillStyle='#fff';ctx.font='900 26px Inter';ctx.textAlign='left';ctx.fillText(ff[3],24,dy+640);ctx.font='700 20px Inter';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText('wait for the end 😳 #fyp',24,dy+675)}
  ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(0,0,370,60);statusBar(t,true);ctx.fillStyle='#fff';ctx.font='900 22px Inter';ctx.textAlign='center';ctx.fillText('Following   ·   For You',185,60);
  ctx.font='40px "Noto Color Emoji"';['❤️','💬','↗️'].forEach((e,j)=>{ctx.fillText(e,330,380+j*90);ctx.font='800 18px Inter';ctx.fillStyle='#fff';ctx.fillText(['128K','2.4K','9K'][j],330,418+j*90);ctx.font='40px "Noto Color Emoji"'});
  for(let h=0;h<4;h++){const ph=(t*0.8+h*0.27)%1;ctx.globalAlpha=1-ph;ctx.font='34px "Noto Color Emoji"';ctx.fillText('❤️',320-Math.sin(ph*6+h)*18,360-ph*240);ctx.globalAlpha=1}}
function uiOffline(t){const g=ctx.createLinearGradient(0,0,0,770);g.addColorStop(0,'#10132a');g.addColorStop(1,'#05061a');ctx.fillStyle=g;ctx.fillRect(0,0,370,770);statusBar(t,false);
  wifiOff(185,300,110,'#ff5a8a');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 30px Inter';ctx.fillText('No internet',185,390);ctx.font='700 21px Inter';ctx.fillStyle='rgba(200,215,255,0.8)';ctx.fillText('Check your connection',185,428);spinner(185,540,40,t,'#5af0ff');
  ctx.font='800 20px Inter';ctx.fillStyle='rgba(90,240,255,0.9)';ctx.fillText('Retrying'+'.'.repeat(1+Math.floor(t*3)%3),185,610)}
function uiShop(t,mode){const g=ctx.createLinearGradient(0,0,0,770);g.addColorStop(0,'#1b1f3e');g.addColorStop(1,'#0b0d22');ctx.fillStyle=g;ctx.fillRect(0,0,370,770);statusBar(t,mode!=='fail');
  ctx.fillStyle='#ffd84a';rrect(16,52,338,70,18);ctx.fill();ctx.fillStyle='#14182a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 28px Inter, "Noto Color Emoji"';ctx.fillText('🛒 CYBER MONDAY',185,88);
  ctx.fillStyle='rgba(255,255,255,0.96)';rrect(16,140,338,360,22);ctx.fill();ctx.font='130px "Noto Color Emoji"';ctx.fillText('🎧',185,265);ctx.fillStyle='#14182a';ctx.font='900 28px Inter';ctx.fillText('Wireless Headphones',185,375);
  ctx.font='800 24px Inter';ctx.fillStyle='#8a93b8';ctx.fillText('$99',120,425);ctx.strokeStyle='#8a93b8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(96,425);ctx.lineTo(144,425);ctx.stroke();ctx.fillStyle='#ff3a6a';ctx.font='900 40px Inter';ctx.fillText('$49',215,425);
  ctx.fillStyle='#ff5a8a';rrect(250,152,92,40,20);ctx.fill();ctx.fillStyle='#fff';ctx.font='900 22px Inter';ctx.fillText('-50%',296,173);
  const tl=Math.max(0,3*3600-Math.floor(t*7));ctx.fillStyle='#ffd84a';ctx.font='800 22px Inter, "Noto Color Emoji"';ctx.fillText('⏰ deal ends in 00:0'+(9-Math.floor(t)%10)+':'+String(59-Math.floor(t*7)%60).padStart(2,'0'),185,535);
  const bx=40,by=580,bw=290,bh=86;const press=mode==='load'?1:0;const pk=t-EV.r1-1.6;
  if(mode==='fail'){ctx.fillStyle='#ff5a8a';rrect(bx,by,bw,bh,43);ctx.fill();ctx.fillStyle='#fff';ctx.font='900 28px Inter, "Noto Color Emoji"';ctx.fillText('❌ PAYMENT FAILED',185,by+bh/2);ctx.font='800 20px Inter';ctx.fillStyle='#ffb0c4';ctx.fillText('No connection · try again',185,by+bh+34)}
  else{ctx.fillStyle='#5af0ff';rrect(bx+press*6,by+press*4,bw-press*12,bh-press*8,43);ctx.fill();if(mode==='load')spinner(185,by+bh/2,26,t,'#0b1840');else{ctx.fillStyle='#0b1840';ctx.font='900 32px Inter, "Noto Color Emoji"';ctx.fillText('BUY NOW 👆',185,by+bh/2)}}
  if(pk>0&&pk<0.6){ctx.strokeStyle=`rgba(255,255,255,${1-pk/0.6})`;ctx.lineWidth=6;ctx.beginPath();ctx.arc(230,by+bh/2,20+pk*160,0,TAU2);ctx.stroke()}
  if(t>EV.r1+1.1&&t<EV.r1+1.9){ctx.font='70px "Noto Color Emoji"';ctx.fillText('👆',240+ (t<EV.r1+1.6?(EV.r1+1.6-t)*120:0),by+bh/2+40)}}
function uiOk(t){const g=ctx.createLinearGradient(0,0,0,770);g.addColorStop(0,'#0f3a2a');g.addColorStop(1,'#06120e');ctx.fillStyle=g;ctx.fillRect(0,0,370,770);statusBar(t,true);
  const k=t-EV.day-1.5;const p=popS(k);ctx.save();ctx.translate(185,300);ctx.scale(p,p);ctx.fillStyle='#7dff9a';ctx.beginPath();ctx.arc(0,0,90,0,TAU2);ctx.fill();ctx.strokeStyle='#06120e';ctx.lineWidth=20;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-40,0);ctx.lineTo(-10,32);ctx.lineTo(45,-30);ctx.stroke();ctx.restore();
  ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 32px Inter';ctx.fillText('ORDER CONFIRMED',185,440);ctx.font='800 22px Inter, "Noto Color Emoji"';ctx.fillStyle='#b8ffd0';ctx.fillText('🎧 $49 · arriving Thursday',185,482);
  for(let i=0;i<26;i++){const ph=k*0.7+hsh(i,3);if(k<0)break;const x=hsh(i,1)*370,y=((hsh(i,2)*770+k*260*(0.6+hsh(i,4)))%770);ctx.fillStyle=['#ffd84a','#5af0ff','#ff5a8a','#7dff9a'][i%4];ctx.save();ctx.translate(x,y);ctx.rotate(ph*6);ctx.fillRect(-6,-3,12,6);ctx.restore()}}
function phoneScreen(t){if(!ZPM)return;const z=0.047;const A=prj(mpt(ZPM,[-0.37,0.77,z])),B=prj(mpt(ZPM,[0.37,0.77,z])),C=prj(mpt(ZPM,[-0.37,-0.77,z]));if(!A||!B||!C)return;
  const md=phoneMode(t);const c0=prj(mpt(ZPM,[0,0,z]));const S=scn(t);
  glowAt(c0,520,md==='fail'||md==='offline'?'255,90,138':md==='ok'?'125,255,154':'90,170,255',0.22);
  ctx.save();ctx.setTransform((B[0]-A[0])/370,(B[1]-A[1])/370,(C[0]-A[0])/770,(C[1]-A[1])/770,A[0],A[1]);rrect(0,0,370,770,30);ctx.clip();
  if(md==='feed')uiFeed(t);else if(md==='offline')uiOffline(t);else if(md==='ok')uiOk(t);else if(S==='day')uiOffline(t);else uiShop(t,md);
  if(S==='day'&&md==='load'){ctx.fillStyle='rgba(5,6,26,0.6)';ctx.fillRect(0,0,370,770);ctx.fillStyle='#7dff9a';ctx.font='900 28px Inter';ctx.textAlign='center';ctx.fillText('Reconnecting…',185,700)}
  const fl=S==='hook'?(t<EV.off?1:zFlick(t,EV.off)):1;if(S==='hook'&&t>=EV.off&&t<EV.off+0.45){ctx.fillStyle=`rgba(0,0,0,${1-fl})`;ctx.fillRect(0,0,370,770)}
  const gl=ctx.createLinearGradient(0,0,370,770);gl.addColorStop(0,'rgba(255,255,255,0.10)');gl.addColorStop(0.35,'rgba(255,255,255,0)');ctx.fillStyle=gl;ctx.fillRect(0,0,370,770);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmoA(e,cm);
  if(S==='idea'){linksFX(tt,cm,'idea');if(tt>EV.vanish+0.4)deadLinks(tt,cm,seg(tt,EV.vanish+0.4,EV.vanish+0.6))}
  if(S==='r2'){linksFX(tt,cm,'sea');if(tt>EV.r2+2.2)deadLinks(tt,cm,seg(tt,EV.r2+2.2,EV.r2+2.5)*clamp((EV.r3-0.1-tt)/0.2,0,1))}
  if(S==='back'){deadLinks(tt,cm,clamp((EV.back+1.6-tt)/0.6,0,1));linksFX(tt,cm,'back')}
  if(S==='never')deadLinks(tt,cm,0.8);
  if(S==='r4')gpsFX(tt,cm);
  if(S==='r3')bubblesFX(tt);
  if(isPhone(S))phoneScreen(tt);
  {const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,300);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if the INTERNET 🌐',-90,92,'#ffffff');L('DISAPPEARED',22,130,'#ffd84a');L('for 5 seconds?',128,86,'#ffffff');ctx.restore()}
  bigTitle([['What if it',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['came back? 😳',150,96,'#ffffff']],EV.never,EV.never+1.6,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(3.6,5.0,'PEOPLE ONLINE RIGHT NOW','≈ 6 BILLION 🌐','#ffd84a');card(5.0,6.4,'GOOGLE SEARCHES EVERY SECOND','≈ 158,000 🔎','#5af0ff');card(6.4,EV.vanish,'YOUR DATA TRAVELS AS LIGHT','THROUGH GLASS FIBERS 💡','#ffd84a');
  card(11.0,13.95,'CYBER MONDAY 2025 · US ONLINE','$14.25 BILLION 💸','#ffd84a');card(14.0,16.9,'≈ $165,000 EVERY SECOND','5 s = ≈ $825,000 STUCK 😭','#ff5a8a');
  card(18.6,21.9,'UNDERSEA CABLES CARRY ≈ 99%','OF DATA BETWEEN CONTINENTS 🌊','#5af0ff');card(21.9,EV.r3,'TOTAL UNDERSEA CABLE','≈ 1.4 MILLION KM 🌍','#ffd84a');
  card(25.6,28.95,'EMAILS SENT EVERY SECOND','≈ 4 MILLION 📧','#5af0ff');card(29.0,EV.r4,'IN JUST 5 SECONDS','≈ 20 MILLION EMAILS STUCK 📧','#ff5a8a');
  card(32.6,EV.r5,'≈ 31 GPS SATELLITES','20,200 KM ABOVE YOU 🛰️','#7dff9a');
  card(42.3,EV.never,'ROUTERS MUST RE-LEARN EVERY PATH','THAT CAN TAKE MINUTES ⏳','#ffd84a');card(49.4,EV.day,'2021: ONE ROUTER UPDATE TOOK','FACEBOOK OFFLINE ≈ 6 HOURS 😳','#ff5a8a');
  card(53.0,EV.endc,'THE INTERNET WAS BUILT TO','ROUTE AROUND DAMAGE 🌐','#7dff9a');
  roundBar(tt);
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(S==='never'&&tt>EV.never+1.6){const ic=[['🛒',-300],['💳',-100],['✈️',100],['🏦',300]];ic.forEach(([e,dx],i)=>{const k=tt-EV.never-1.8-i*0.25;if(k<0)return;const a=clamp((EV.never+5.6-tt)/0.2,0,1);if(a<=0)return;emojiAt(e,W/2+dx,560,110*popS(k),a);if(k>0.4)emojiAt('❌',W/2+dx+40,600,64*popS(k-0.4),a)})}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.off,0.55,0.35,'90,240,255');flash(EV.idea,0.4,0.3);flash(EV.vanish,0.5,0.3,'90,240,255');flash(EV.r1,0.5,0.3);flash(EV.r1+3.0,0.35,0.3,'255,90,138');flash(EV.r2,0.4,0.3);flash(EV.r2+1.5,0.35,0.3,'90,240,255');flash(EV.r3,0.4,0.3);flash(EV.r3+1.6,0.25,0.25,'255,90,138');
  flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,0.75,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.day,0.5,0.3);flash(EV.day+1.5,0.35,0.3,'125,255,154');flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.45*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('5 seconds without internet…',-70,84,'#ffffff');L('what would YOU miss first? 🌐',45,88,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
