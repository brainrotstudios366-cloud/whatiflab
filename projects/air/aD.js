// ================= AIR DISAPPEARS: overlays =================
function atmoA(e,cm){const a=e.a==null?1:e.a;if(a<=0.01)return;const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;const g=ctx.createRadialGradient(c[0],c[1],r*0.86,c[0],c[1],r*1.18);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.42,'rgba(120,200,255,0.75)');g.addColorStop(0.62,'rgba(80,150,255,0.35)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore();return r}
const CAPS=[[0.05,1.2,'This is our ^AIR 🌍'],[1.3,2.4,'~DELETED 💨'],[2.4,3.45,'for ^5 SECONDS'],
 [3.6,5.0,'Right now the ^AIR'],[5.0,6.4,'pushes on YOU'],[6.4,7.9,'with ^10 TONNES'],[7.9,9.5,'on every m² 😳'],
 [9.8,10.5,'Air ~GONE'],[10.6,12.0,'the sky turns ^BLACK 🌌'],[12.0,13.6,'^STARS at noon ✨'],[13.6,15.2,'nothing scatters ^BLUE'],[15.2,16.9,'and total ~SILENCE 🔇'],
 [17.2,18.7,'Every ^PLANE ✈️'],[18.7,20.3,'engines ~DIE'],[20.3,22.2,'no oxygen to ^BURN 🔥'],[22.2,23.9,'and ^NO LIFT 😳'],
 [24.2,25.7,'Your ears ~POP 👂'],[25.7,27.3,'your spit ^BOILS 🫧'],[27.3,29.0,'at ^37 °C 😳'],[29.0,30.9,'DON\'T hold your ~BREATH'],
 [31.2,32.7,'The ^OCEANS 🌊'],[32.7,34.2,'start to ~BOIL'],[34.2,35.8,'and ^FREEZE 🧊'],[35.8,37.3,'at the SAME time'],
 [37.5,39.0,'Space rocks 🌠'],[39.0,40.95,'~DON\'T burn up'],[41.05,42.3,'AIR is ^BACK ✅'],[42.3,43.5,'…phew 😮‍💨'],
 [45.2,46.8,'oceans ^BOIL away'],[46.8,48.5,'^+120 °C by day'],[48.5,50.0,'~−130 °C at night'],[50.0,51.5,'Earth = ^MOON 2.0 🌑'],
 [51.8,53.4,'So thank your ^AIR ❤️'],[53.4,55.0,'it burns space rocks'],[55.0,56.8,'into ^SHOOTING STARS 🌠'],[56.8,58.5,'^GEMINIDS: Dec 13–14']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=840,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+400+i*82,y-16,62,32,16);ctx.fill()}
  ctx.font='900 40px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'💨 AIR: 100%':`💨 AIR: 0% · ${n}/5`,x0+36,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
// meteors: streaks from space into the globe. burn=true -> they burn up in the air (end above the surface)
function meteors(cm,t,t0,n,burn,a){if(a<=0)return;const h=V.norm(cm.eye);const b=camBasisB(cm);ctx.save();ctx.lineCap='round';
  for(let i=0;i<n;i++){const per=burn?1.5:1.1;const ph0=hsh(i,7)*per;const life=(t-t0-ph0);if(life<0)continue;const cyc=Math.floor(life/per);const k=(life%per)/per;const id=i*13+cyc*7;
    const u=(hsh(id,1)-0.5)*1.6,v=(hsh(id,2)-0.5)*1.5;const nrm=V.norm(V.add(V.sc(h,0.7),V.add(V.sc(b.r,u),V.sc(b.u,v))));
    const end=V.sc(nrm,burn?1.075:1.0);const L=burn?0.75:1.5;const off=V.norm(V.add(V.sc(nrm,0.8),V.add(V.sc(b.u,0.55),V.sc(b.r,0.5*(hsh(id,3)-0.5)))));const start=V.add(end,V.sc(off,L));const dir=V.sc(off,-1);
    const kk=burn?Math.min(1,k*1.25):Math.min(1,k*2.2);const head=V.add(start,V.sc(dir,L*kk));const tail=V.add(start,V.sc(dir,L*Math.max(0,kk-0.28)));
    const ph=prj(head),pt=prj(tail);if(!ph||!pt)continue;const fade=burn?Math.sin(Math.min(1,k*1.25)*Math.PI):(k<0.45?1:0);
    if(fade>0.01){const g=ctx.createLinearGradient(pt[0],pt[1],ph[0],ph[1]);g.addColorStop(0,'rgba(255,200,120,0)');g.addColorStop(1,`rgba(255,250,230,${a*fade})`);ctx.strokeStyle=g;ctx.lineWidth=burn?9:10;ctx.beginPath();ctx.moveTo(pt[0],pt[1]);ctx.lineTo(ph[0],ph[1]);ctx.stroke();glowAt(ph,burn?38:30,burn?'140,255,200':'255,210,140',0.8*a*fade)}
    if(!burn&&k>=0.45){const kf=(k-0.45)/0.55;const pe=prj(end);if(pe){glowAt(pe,30+kf*90,'255,150,80',a*(1-kf));ctx.save();ctx.globalAlpha=a*(1-kf);ctx.strokeStyle='#ffd84a';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(pe[0],pe[1],8+kf*60,(8+kf*60)*0.5,0,0,Math.PI*2);ctx.stroke();ctx.restore()}}}
  ctx.restore()}
function bubbles(c,r,t,n,a,seed){if(!c||a<=0)return;ctx.save();for(let i=0;i<n;i++){const ph=(hsh(i,seed)+t*(0.8+hsh(i,seed+1)))%1;const x=c[0]+(hsh(i,seed+2)-0.5)*r*2+Math.sin(t*5+i)*6,y=c[1]-ph*r*1.6+(hsh(i,seed+3)-0.3)*r*0.5;const rr=(4+hsh(i,seed+4)*12)*(0.5+ph);
  ctx.globalAlpha=a*Math.sin(ph*Math.PI);ctx.strokeStyle='rgba(220,245,255,0.95)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(180,230,255,0.18)';ctx.fill();ctx.fillStyle='rgba(255,255,255,0.9)';ctx.beginPath();ctx.arc(x-rr*0.35,y-rr*0.35,rr*0.22,0,Math.PI*2);ctx.fill()}ctx.restore()}
function pxR0(P,r){const c=prj(P);const cm=camAt(TT0);const b=camBasisB(cm);const q=prj(V.add(P,V.sc(b.r,r)));return c&&q?Math.hypot(q[0]-c[0],q[1]-c[1]):0}
let TT0=0;
function steam(p,r,a){if(!p||a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(235,245,255,${a})`);g.addColorStop(0.5,`rgba(210,230,250,${a*0.45})`);g.addColorStop(1,'rgba(200,220,255,0)');ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function muteIcon(x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(8,10,30,0.82)';ctx.beginPath();ctx.arc(0,0,80,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff5a8a';ctx.lineWidth=6;ctx.stroke();ctx.font='900 84px Inter, "Noto Color Emoji"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔇',0,6);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;TT0=tt;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmoA(e,cm);
  if(S==='hook'&&tt>=EV.gone){const k=tt-EV.gone;if(k<0.5){const c=prj([0,0,0]);if(c)glowAt(c,700,'255,90,138',0.5*(1-k/0.5))}const c=prj([0,0,0]);if(c&&k>0.15)tag('💨 AIR: 0%',[c[0],c[1]+430],'#ff5a8a',seg(k,0.15,0.4))}
  if(S==='idea'){const c=prj([0,0,0]);const k1=seg(tt,EV.idea+1.4,EV.idea+1.7);if(c){const lp=prj(globePt(cm,0.55,-0.75,1.07));if(lp){pin(lp,'90,240,255',k1);tag('🌍 AIR LAYER: ~100 km thin',[clamp(lp[0]+120,300,W-300),lp[1]-70],'#5af0ff',k1)}
      const k2=seg(tt,EV.idea+2.2,EV.idea+2.5);tag('🍎 thinner than an apple\'s skin (to scale)',[W/2,1520],'#ffffff',k2*clamp((EV.idea+4.0-tt)/0.2,0,1))}}
  if(S==='r1'){const ks=tt-EV.fly;if(tt<EV.fly&&tt>EV.r1+0.3)pill('☀️ a normal day…',560,'rgba(125,255,154,0.8)',seg(tt,EV.r1+0.3,EV.r1+0.5),40);
    if(ks>0){const sp=prj(V.add(cm.eye,V.sc(AR_SUNT,500)));if(0&&sp){glowAt(sp,160,'255,255,255',0.55*seg(ks,0.2,0.8));0&&tag('☀️ the Sun looks WHITE',[clamp(sp[0],260,W-260),clamp(sp[1]+120,560,1100)],'#ffffff',seg(ks,1.6,1.9)*clamp((EV.r2-0.2-tt)/0.2,0,1))}
      muteIcon(W/2,1560,1,seg(tt,15.2,15.45)*clamp((EV.r2-tt)/0.2,0,1));tag('🌑 shadows go pitch-black',[W/2,1490],'#c8d0ff',seg(tt,13.7,14.0)*clamp((15.15-tt)/0.2,0,1))}}
  if(S==='r2'&&AROBJ.eng){const kd=seg(tt,EV.r2+1.2,EV.r2+1.9);for(const e of AROBJ.eng){const p=prj(e);if(!p)continue;const fl=1-kd;glowAt(p,110+15*Math.sin(tt*40),'255,150,70',0.95*fl);glowAt(p,40,'255,255,230',fl);if(kd>0&&kd<1){glowAt(p,90*kd,'120,120,130',0.5*(1-kd))}}
    const pp=prj(AROBJ.plane);if(pp){tag('❌ ENGINE OFF',[clamp(pp[0]-150,240,W-240),pp[1]+190],'#ff5a8a',seg(tt,EV.r2+2.0,EV.r2+2.3)*clamp((EV.r2+4.9-tt)/0.2,0,1));
      if(tt>EV.r2+5.0){const k=seg(tt,EV.r2+5.0,EV.r2+5.3);arrowLine(pp[0]+260,pp[1]-140,pp[0]+260,pp[1]+120,'#ff5a8a',14,k);tag('⬇️ falling',[clamp(pp[0]+260,200,W-200),pp[1]+190],'#ff5a8a',k)}}}
  if(S==='r3'&&AROBJ.head){const hp=prj([0,1.62,5.36]);const ep=[prj([-0.17,1.71,5.2]),prj([0.17,1.71,5.2])];const k=seg(tt,EV.r3+0.2,EV.r3+0.5);
    if(tt<EV.r3+1.6&&tt>EV.r3+0.2)for(const p of ep){if(!p)continue;const kk=(tt-EV.r3-0.2)%0.6/0.6;ctx.save();ctx.globalAlpha=k*(1-kk);ctx.strokeStyle='#ff5a8a';ctx.lineWidth=8;ctx.beginPath();ctx.arc(p[0],p[1],30+kk*90,0,Math.PI*2);ctx.stroke();ctx.restore()}
    if(hp){const kb=seg(tt,EV.r3+1.7,EV.r3+2.2);bubbles(hp,95,tt,26,kb,3);const pp=prj([0.12,1.55,5.38]);if(pp){tag('🫧 boiling saliva',[clamp(pp[0]+200,260,W-260),pp[1]-330],'#5af0ff',seg(tt,EV.r3+2.2,EV.r3+2.5)*clamp((EV.r3+4.9-tt)/0.2,0,1))}}
    const kl=seg(tt,EV.r3+5.0,EV.r3+5.3);tag('🫁 exhale! lungs can rupture',[W/2,1490],'#ff5a8a',kl);tag('😵 awake for ~10–15 s',[W/2,1565],'#ffffff',seg(tt,EV.r3+5.6,EV.r3+5.9))}
  if(S==='r4'){const kb=Math.max(0,tt-EV.r4-0.6);for(let i=0;i<70;i++){const ph=(hsh(i,1)+kb*0.3*(0.6+hsh(i,2)))%1;const P=[-330+hsh(i,3)*350,1+ph*40,-260+hsh(i,4)*400];const p=prj(P);if(!p)continue;const sz=pxR0(P,6+ph*18);steam(p,sz,0.42*Math.sin(ph*Math.PI)*Math.min(1,kb*1.2))}
    const k=seg(tt,EV.r4+1.0,EV.r4+1.4);for(let i=0;i<10;i++){const p=prj([-260+hsh(i,11)*250,0.5,-150+hsh(i,12)*250]);if(p)bubbles(p,40,tt+i,6,k*0.8*(1-seg(tt,EV.r4+4.5,EV.r4+6)),20+i)}
    tag('♨️ BOILING',[W/2-220,1490],'#ff5a8a',seg(tt,EV.r4+1.7,EV.r4+2.0));tag('🧊 FREEZING',[W/2+220,1490],'#5af0ff',seg(tt,EV.r4+3.3,EV.r4+3.6))}
  if(S==='r5'){if(tt<EV.back)meteors(cm,tt,EV.r5+0.2,14,false,1);
    if(tt>=EV.back){const k=tt-EV.back;if(k<0.5){const c=prj([0,0,0]);if(c)glowAt(c,700,'125,255,154',0.45*(1-k/0.5))}}}
  if(S==='never'){const mk=ease(seg(tt,EV.morph,EV.morph+2.6));const c=prj([0,0,0]);if(c&&mk>0.5){tag('🏜️ dry ocean basins',[c[0],c[1]+430],'#ffd84a',seg(tt,EV.morph+1.6,EV.morph+1.9))}}
  if(S==='day'){meteors(cm,tt,EV.day+0.1,16,true,seg(tt,EV.day,EV.day+0.4));const lp=prj(globePt(cm,0.7,-0.6,1.08));if(lp)tag('🔥 burn up ~100 km high',[clamp(lp[0]+80,280,W-280),lp[1]-60],'#7dff9a',seg(tt,EV.day+1.6,EV.day+1.9))}
  if(S==='end'){meteors(cm,tt,EV.endc,10,true,0.8*clamp((EV.loop-0.4-tt)/0.3,0,1))}
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if Earth\'s AIR 💨',-90,96,'#ffffff');L('DISAPPEARED',25,130,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  bigTitle([['What if it',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['came back? 😳',150,96,'#ffffff']],EV.never,EV.morph+0.1,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(6.4,EV.r1,'AIR PRESSURE AT SEA LEVEL','≈ 10 t per m² 🏋️','#ffd84a');card(13.6,15.15,'BLUE SKY = AIR SCATTERING','NO AIR → BLACK 🌌','#5af0ff');
  card(18.7,EV.r3,'PLANES IN THE SKY RIGHT NOW','≈ 10,000 ✈️','#ff5a8a');card(27.3,29.9,'ARMSTRONG LIMIT (6.3 kPa)','WATER BOILS AT 37 °C','#5af0ff');
  card(35.8,EV.r5,'BOILING STEALS HEAT','→ ICE ON TOP 🧊','#5af0ff');card(39.0,EV.back,'SPACE DUST HITTING EARTH','TONS EVERY DAY 🌠','#ffd84a');
  card(48.5,EV.day,'JUST LIKE THE MOON','+120 °C / −130 °C 🌑','#ff5a8a');card(55.0,EV.endc,'GEMINIDS PEAK DEC 13–14','UP TO 120 / HOUR 🌠','#7dff9a');
  roundBar(tt);
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.gone,0.8,0.35,'255,90,138');flash(EV.idea,0.4,0.3);flash(EV.r1,0.6,0.3);flash(EV.fly,0.6,0.35,'0,0,0');flash(EV.r2,0.4,0.3);flash(EV.r3,0.4,0.3);flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,0.8,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.morph,0.4,0.3);flash(EV.day,0.4,0.3);flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.7*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.4*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('What would YOU miss first?',-70,84,'#ffffff');L('BLUE SKY 🌌 or SOUND 🔇',45,86,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
