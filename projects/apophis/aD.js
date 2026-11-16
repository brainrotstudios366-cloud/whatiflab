// ================= APOPHIS: overlays / render =================
function camBasisB(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function pRad(p,s,cm){const c=prj(p);if(!c)return null;const b=camBasisB(cm);const q=prj(V.add(p,V.sc(b.r,s)));if(!q)return null;return[c,Math.hypot(q[0]-c[0],q[1]-c[1])]}
function earthGlow(cm,a){if(!EARTHP)return;const R=pRad(EARTHP.p,EARTHP.s,cm);if(!R)return;const[c,r]=R;if(!(r>2))return;ctx.save();ctx.globalCompositeOperation='screen';
  const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.22);g.addColorStop(0,'rgba(90,200,255,0)');g.addColorStop(0.28,`rgba(110,210,255,${0.55*a})`);g.addColorStop(0.5,`rgba(70,150,255,${0.22*a})`);g.addColorStop(1,'rgba(40,80,255,0)');
  ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.3,c[1]-r*1.3,r*2.6,r*2.6);ctx.restore()}
function sunFlare(cm,a){const p=V.add(cm.eye,V.sc(SUND,300));const c=prj(p);if(!c)return;glowAt(c,260,'255,230,190',0.5*a);glowAt(c,70,'255,255,240',0.9*a)}
function vignette(col,a){if(a<=0)return;ctx.save();const g=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.72);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
function flash(a,col){if(a<=0)return;ctx.save();ctx.fillStyle=`rgba(${col||'255,255,255'},${a})`;ctx.fillRect(0,0,W,H);ctx.restore()}
function sphCircle(n,ang,R,cm){const t1=V.norm(V.cross(n,Math.abs(n[1])<0.9?[0,1,0]:[1,0,0])),t2=V.cross(n,t1);const out=[];for(let i=0;i<=72;i++){const a=i/72*TAU2;const p=V.sc(V.add(V.sc(n,Math.cos(ang)),V.sc(V.add(V.sc(t1,Math.cos(a)),V.sc(t2,Math.sin(a))),Math.sin(ang))),R);
  const vis=V.dot(p,V.sub(cm.eye,p))>0;out.push(vis?prj(p):null)}return out}
function strokePts(P,col,w,a,dash){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();let pen=false;for(const q of P){if(!q){pen=false;continue}if(!pen){ctx.moveTo(q[0],q[1]);pen=true}else ctx.lineTo(q[0],q[1])}ctx.stroke();ctx.restore()}
function circ3(R,y,n){const o=[];for(let i=0;i<=n;i++){const a=i/n*TAU2;o.push(prj([Math.sin(a)*R,y,Math.cos(a)*R]))}return o}
function bigLabel(lines,y,k){if(k<=0)return;const p=popS(k);ctx.save();ctx.translate(W/2,y);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  for(const[s,dy,sz,col]of lines){ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,dy);ctx.fillStyle=col;ctx.fillText(s,0,dy)}ctx.restore()}
function drawEnd(t){const k=ease((t-EV.follow)/0.4)*clamp((EV.loop-t)/0.3,0,1);if(k<=0)return;const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.45,`rgba(4,4,20,${0.35*k})`);gg.addColorStop(0.65,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;bigLabel([['Will YOU look up on',-60,80,'#ffffff'],['APRIL 13, 2029? 👀👇',50,92,'#ffd84a']],400,t-EV.follow);ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.follow-0.6)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
function skyDot(t){const k=seg(t,EV.eye,EV.whatif);const x=lerp(180,900,k),y=lerp(560,380,k)-Math.sin(k*Math.PI)*60;ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<26;i++){const q=Math.max(0,k-i*0.006);const xx=lerp(180,900,q),yy=lerp(560,380,q)-Math.sin(q*Math.PI)*60;ctx.fillStyle=`rgba(255,240,210,${0.35*(1-i/26)})`;ctx.beginPath();ctx.arc(xx,yy,7*(1-i/30),0,Math.PI*2);ctx.fill()}ctx.restore();
  glowAt([x,y],90,'255,225,170',0.55);star4(x,y,70,0.95);return[x,y]}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  if(S!=='eye'&&S!=='size')earthGlow(cm,1);
  if(S==='hook'||S==='end'||S==='date'||S==='quake'||S==='probe')sunFlare(cm,0.8);
  if(S==='hook'){if(tt>3.7&&SATP.length){const q=prj(SATP[4]);if(q)tag('📡 satellite',[q[0],q[1]-60],'#5af0ff',seg(tt,3.7,4.0))}
    const a=prj(APOP&&APOP.p);if(a&&tt>0.9)tag('☄️ ASTEROID',[a[0],a[1]-200],'#ffd84a',seg(tt,0.9,1.2))}
  if(S==='date'){statCard('📅 CLOSEST FLYBY','APRIL 13, 2029','#ffd84a',tt-EV.date,330);const a=prj(APOP.p);
    if(tt>EV.name&&a)tag('☄️ 99942 APOPHIS',[W/2,1440],'#ffffff',seg(tt,EV.name,EV.name+0.25));
    if(tt>EV.chaos){vignette('180,20,30',0.55*seg(tt,EV.chaos,EV.chaos+0.4));tag('🐍 named after the GOD OF CHAOS',[W/2,560],'#ff5a8a',seg(tt,EV.chaos,EV.chaos+0.3))}
    flash(0.6*(1-seg(tt,EV.date,EV.date+0.25)))}
  if(S==='size'){const k=seg(tt,EV.size+0.7,EV.size+1.1);const bL=prj([-2.45,0,0]),tL=prj([-2.45,4.43,0]),bR=prj([2.7,0.0,0]),tR=prj([2.7,4.5,0]);
    if(bL&&tL&&bR&&tR){ctx.save();ctx.globalAlpha=k;ctx.lineWidth=6;ctx.strokeStyle='#5af0ff';ctx.beginPath();ctx.moveTo(bL[0]+24,bL[1]);ctx.lineTo(bL[0],bL[1]);ctx.lineTo(tL[0],tL[1]);ctx.lineTo(tL[0]+24,tL[1]);ctx.stroke();
      ctx.strokeStyle='#ffd84a';ctx.beginPath();ctx.moveTo(bR[0]-24,bR[1]);ctx.lineTo(bR[0],bR[1]);ctx.lineTo(tR[0],tR[1]);ctx.lineTo(tR[0]-24,tR[1]);ctx.stroke();ctx.restore();
      tag('🏙️ 443 m',[bL[0]+20,(bL[1]+tL[1])/2],'#5af0ff',k);tag('☄️ ~450 m',[bR[0]-40,(bR[1]+tR[1])/2],'#ffd84a',k)}
    const b=prj([-1.45,-0.25,0]);if(b&&false)tag('EMPIRE STATE BUILDING',[b[0],b[1]+40],'#9fe8ff',seg(tt,EV.size+1,EV.size+1.3));
    if(tt>EV.tons-0.1)statCard('⚖️ WEIGHT','~20 MILLION TONS','#ffd84a',tt-EV.tons+0.1,330);flash(0.5*(1-seg(tt,EV.size,EV.size+0.2)))}
  if(S==='sats'){const k=seg(tt,EV.sats+0.2,EV.sats+0.9);strokePts(circ3(6.6,0,160),'rgba(90,240,255,0.9)',5,k*0.8,[16,14]);
    const u=lerp(-7,2.2,seg(tt,EV.sats,EV.eye));const P=[];for(let x=-9;x<=u;x+=0.1)P.push(prj(apPath(x)));strokePts(P,'#ff5a8a',7,0.85,null);
    if(tt>EV.wsat){const q=prj([Math.sin(-2.3)*6.6,0,Math.cos(-2.3)*6.6]);if(q)tag('📡 weather satellites · 36,000 km',[clamp(q[0],330,W-330),q[1]-70],'#5af0ff',seg(tt,EV.wsat,EV.wsat+0.3))}
    if(APOP){const g=prj(APOP.p);if(g)glowAt(g,70,'255,90,138',0.5)}if(tt>EV.km&&APOP){const q=prj(APOP.p);if(q)tag('☄️ APOPHIS · 32,000 km',[clamp(q[0],330,W-330),q[1]+90],'#ff5a8a',seg(tt,EV.km,EV.km+0.3))}
    flash(0.5*(1-seg(tt,EV.sats,EV.sats+0.2)))}
  if(S==='eye'){const d=skyDot(tt);if(tt>EV.eye+0.8)tag('🌍 Europe · Africa · Asia',[W/2,250],'#ffffff',seg(tt,EV.eye+0.8,EV.eye+1.1));
    if(tt>EV.tele)tag('✅ NO TELESCOPE NEEDED',[W/2,340],'#7dff9a',seg(tt,EV.tele,EV.tele+0.3));flash(0.4*(1-seg(tt,EV.eye,EV.eye+0.2)))}
  if(S==='whatif'){const hot=seg(tt,EV.hit-0.3,EV.boom);vignette('200,30,20',0.25+0.35*hot+0.12*Math.sin(tt*12)*hot);if(APOP){const a=prj(APOP.p);if(a)glowAt(a,80+180*hot,'255,150,60',0.7*hot)}}
  if(S==='boom'||S==='destr'){const k=tt-EV.boom;const c=prj(V.sc(IP,1.0));if(c){glowAt(c,lerp(500,260,clamp(k/3,0,1)),'255,170,80',clamp(1-k/7,0.3,1));glowAt(c,120,'255,250,220',clamp(1-k/2,0.2,1))}
    for(let i=0;i<3;i++){const kk=k-i*0.5;if(kk<0||kk>3.5)continue;strokePts(sphCircle(IP,0.02+0.32*easeOut(kk/3.5),1.004,cm),i?'#ffb070':'#fff2d0',9-i*2,clamp(1-kk/3.5,0,1),null)}
    if(S==='boom'){flash(clamp(1-k/0.5,0,1));if(tt>EV.mt-0.1)statCard('💥 ENERGY','1,000+ MEGATONS','#ff5a8a',tt-EV.mt+0.1,330);if(tt>EV.x20)tag('= 20× the biggest bomb ever tested',[W/2,480],'#ffd84a',seg(tt,EV.x20,EV.x20+0.3))}
    if(S==='destr'){const kk=seg(tt,EV.destr+0.2,EV.destr+0.9);strokePts(sphCircle(IP,0.06*kk+0.001,1.003,cm),'#ff5a8a',8,kk,[18,12]);const q=prj(V.sc(IP,1.0));const e=prj(V.sc(V.norm(V.add(IP,[0,0.065,0])),1.0));
      if(q&&e&&tt>EV.destr+0.9)tag('🔴 hundreds of km',[q[0],e[1]-60],'#ff5a8a',seg(tt,EV.destr+0.9,EV.destr+1.2));vignette('160,20,20',0.35)}}
  if(S==='panic'){vignette('0,0,0',0.5);if(tt>EV.nope){flash(0.3*(1-seg(tt,EV.nope,EV.nope+0.2)),'125,255,154');tag('✅ RELAX',[W/2,520],'#7dff9a',seg(tt,EV.nope,EV.nope+0.3))}else tag('😱 ???',[W/2,520],'#ff5a8a',seg(tt,EV.panic+0.2,EV.panic+0.5))}
  if(S==='radar'){const e=prj([0,0,0]),a=APOP&&prj(APOP.p);if(e&&a){const an=Math.atan2(a[1]-e[1],a[0]-e[0]);const D=Math.hypot(a[0]-e[0],a[1]-e[1]);ctx.save();ctx.lineCap='round';
      for(let i=0;i<5;i++){const ph=((tt*0.9+i/5)%1);ctx.strokeStyle=`rgba(125,255,154,${0.85*(1-ph)})`;ctx.lineWidth=7;ctx.beginPath();ctx.arc(e[0],e[1],60+ph*(D-40),an-0.28,an+0.28);ctx.stroke()}ctx.restore();tag('📡 RADAR',[e[0],e[1]+150],'#7dff9a',seg(tt,EV.radar+0.3,EV.radar+0.6))}
    if(tt>EV.safe-0.1)statCard('IMPACT RISK','✅ ZERO for 100+ years','#7dff9a',tt-EV.safe+0.1,330);flash(0.4*(1-seg(tt,EV.radar,EV.radar+0.2)))}
  if(S==='quake'){if(tt>EV.shake){tag("🌍 Earth's gravity ➜ asteroid-quakes",[W/2,330],'#ffd84a',seg(tt,EV.shake,EV.shake+0.3))}else tag('🏆 EARTH WINS',[W/2,330],'#7dff9a',seg(tt,EV.quake+0.7,EV.quake+1.0));
    if(tt>EV.slide)tag('🪨 landslides!',[W/2,440],'#ff5a8a',seg(tt,EV.slide,EV.slide+0.3));flash(0.4*(1-seg(tt,EV.quake,EV.quake+0.2)))}
  if(S==='probe'){if(PROBEP&&tt>EV.apex){const q=prj(PROBEP);if(q)tag('🛰️ NASA OSIRIS-APEX',[clamp(q[0],300,W-300),q[1]-120],'#5af0ff',seg(tt,EV.apex,EV.apex+0.3))}flash(0.4*(1-seg(tt,EV.probe,EV.probe+0.2)))}
  if(S==='end'&&tt<EV.follow){statCard('⏳ A FLYBY THIS CLOSE','once every few 1,000 years','#ffd84a',tt-EV.endc-0.1,330)}
  if(S==='end')drawEnd(tt);
  caption(tt)}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.005,far:3000},{center:[0,-9999,0],radius:1},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.boom,18,0.9);S(EV.hit,4,1.3);S(EV.shake,7,0.5);S(EV.slide,8,0.6);S(EV.chaos,6,0.4);S(EV.mt,5,0.3);return a}
