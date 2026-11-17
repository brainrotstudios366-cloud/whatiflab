// ================= NO EMPTY SPACE: overlays =================
const CAPS=[[0.05,0.9,'This is ^EARTH 🌍'],[0.95,2.2,'~POOF 💥'],[2.2,3.45,'now it\'s ^TINY 😳'],
 [3.6,5.0,'Every atom is'],[5.0,6.6,'^99.9999999% EMPTY'],[6.6,8.2,'nucleus = an ^ANT 🐜'],[8.2,9.9,'atom = a ^STADIUM 🏟️'],
 [10.2,11.9,'Start with ^YOU'],[12.0,13.4,'you ~SHRINK…'],[13.4,14.8,'to ^0.008 mm 🔬'],[14.8,15.6,'still ^70 kg'],[15.6,16.9,'~THROUGH the floor'],
 [17.2,19.0,'ALL ^8 BILLION humans'],[19.2,20.8,'fit in ONE…'],[20.8,22.3,'^SUGAR CUBE 🧊'],[22.3,23.9,'weighing ~500M tons'],
 [24.2,25.8,'And ^EARTH? 🌍'],[25.8,27.4,'ALL of it…'],[27.4,29.1,'^370 m wide'],[29.1,30.9,'smaller than ^DOWNTOWN'],
 [31.2,32.7,'SAME ^MASS though'],[32.7,34.3,'gravity ~1 BILLION×'],[34.3,35.8,'the ^MOON? 🌕'],[35.8,36.9,'doesn\'t ^CARE 😎'],
 [37.2,38.6,'Sounds fake?'],[38.6,40.0,'= a ^NEUTRON STAR'],[40.0,40.95,'they ^EXIST ✨'],
 [41.1,42.4,'space comes ^BACK…'],[42.4,43.6,'~KABOOM 💥'],[43.6,45.0,'biggest blast ^EVER'],[45.0,46.4,'(probably 💀)'],
 [46.7,48.3,'Wait… ^WEIRDER'],[48.3,50.0,'you ^NEVER touch'],[50.0,51.6,'~ANYTHING 😳'],[51.6,53.3,'electrons ^PUSH back'],[53.3,55.0,'your chair? 🪑'],[55.0,56.8,'you ^HOVER on it'],[56.8,58.5,'^RIGHT NOW 👀']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.touch-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.touch-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=840,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+400+i*82,y-16,62,32,16);ctx.fill()}
  ctx.font='900 40px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'⚛️ SPACE IS BACK':`⚛️ SECOND ${n}/5`,x0+36,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
function ring2(c,r,col,a,w){if(!c||a<=0||r<=0)return;ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w||8;ctx.beginPath();ctx.arc(c[0],c[1],r,0,7);ctx.stroke();ctx.restore()}
function eCloud(c,r,a,rgb){if(!c||a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],0,c[0],c[1],r);g.addColorStop(0,`rgba(${rgb},${0.0*a})`);g.addColorStop(0.55,`rgba(${rgb},${0.10*a})`);g.addColorStop(0.9,`rgba(${rgb},${0.22*a})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.fillRect(c[0]-r,c[1]-r,2*r,2*r);ctx.restore()}
function pxR(p,r){const c=prj(p);if(!c)return 0;const b=camBasisB(camAt(TT));const q=prj(V.add(p,V.sc(b.r,r)));return q?Math.hypot(q[0]-c[0],q[1]-c[1]):0}
let TT=0;
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;TT=tt;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS){if(e.s>0.2)atmo(e,cm);else{const c=prj(e.p);if(c)glowAt(c,90,'120,200,255',0.8)}if(e.hot){const c=prj(e.p);if(c)glowAt(c,pxR(e.p,e.s)*1.5,'255,150,80',0.35)}}
  if(S==='hook'&&tt>=EV.snap){const k=tt-EV.snap;const c=prj([0,0,0]);if(c){if(k<0.6)glowAt(c,800,'255,90,138',0.6*(1-k/0.6));for(let i=0;i<2;i++){const kk=k-i*0.12;if(kk>0&&kk<0.8)ring2(c,(1-kk/0.8)*600,'#ff5a8a',kk/0.8,10)}if(k>1.2)tag('🌍 EARTH · 370 m',[c[0],c[1]+170],'#ffd84a',seg(k,1.2,1.5))}}
  if(S==='idea'){const c=prj([0,0,0]);if(c){const R=pxR([0,0,0],3.2);eCloud(c,R*1.15,1,'90,200,255');glowAt(c,Math.max(40,pxR([0,0,0],0.06)*3),'255,120,160',0.7);
      const k1=seg(tt,EV.idea+0.4,EV.idea+0.7);tag('⚛️ ELECTRON CLOUD',[W/2,clamp(c[1]-R*0.95,300,800)],'#5af0ff',k1*clamp((EV.idea+3.0-tt)/0.3,0,1));
      const k2=seg(tt,EV.idea+3.1,EV.idea+3.4);if(k2>0){ctx.save();ctx.globalAlpha=k2;ctx.font='90px "Noto Color Emoji"';ctx.textAlign='center';ctx.textBaseline='middle';if(tt>EV.idea+4.6)ctx.fillText('🐜',c[0]+150,c[1]-130);ctx.restore();tag('NUCLEUS (tiny!)',[c[0],c[1]+130],'#ff5a8a',k2)}}
    for(const a of VATOMS){const p=prj(a.e);if(p)glowAt(p,26,'140,240,255',0.9)}}
  if(S==='r1'){const ps=VPERS?prj(VPERS):null;if(tt>EV.shrink&&ps){glowAt(ps,60,'255,216,74',0.6*seg(tt,EV.shrink+0.6,EV.shrink+1.0));tag('🫵 YOU',[ps[0],ps[1]-110],'#ffd84a',seg(tt,EV.shrink+1.0,EV.shrink+1.3)*clamp((EV.fall+0.3-tt)/0.3,0,1))}
    if(tt>EV.fall){const g=prj([0,0.02,0]);if(g){const kk=tt-EV.fall;ctx.save();ctx.fillStyle='rgba(5,5,10,0.92)';ctx.beginPath();ctx.ellipse(g[0],g[1],70*seg(kk,0,0.15),24*seg(kk,0,0.15),0,0,7);ctx.fill();ctx.restore();glowAt([g[0],g[1]+kk*900],50,'255,216,74',clamp(1-kk,0,1));tag('🕳️ ...still falling',[g[0],g[1]-120],'#ff5a8a',seg(kk,0.3,0.6))}}
    if(tt<EV.shrink&&tt>EV.r1+0.5&&ps)tag('🫵 YOU · 70 kg',[ps[0],ps[1]-90],'#ffffff',seg(tt,EV.r1+0.5,EV.r1+0.8))}
  if(S==='r2'){if(tt<EV.gone){tag('👥 8,000,000,000 people',[W/2,1500],'#ffffff',seg(tt,EV.r2+0.4,EV.r2+0.7))}else{const c=prj([0,0.5*0.6,0]);if(c)glowAt(c,320,'255,255,255',0.22);const k=tt-EV.gone;if(k<0.5)glowAt([W/2,H*0.5],900,'255,255,255',0.7*(1-k/0.5));
      for(let i=0;i<10;i++){const ph=(hsh(i,3)+tt*0.6)%1;const p=prj([(hsh(i,1)-0.5)*0.7,0.1+hsh(i,2)*0.6,(hsh(i,4)-0.5)*0.7]);if(p){const a=Math.sin(ph*Math.PI);glowAt(p,24,'255,255,255',a*0.9)}}}}
  if(S==='r3'){const e=EARTHS[0];if(e){const c=prj([e.p[0],e.p[1]+e.s,e.p[2]]);if(c)tag('🌍 ALL OF EARTH',[clamp(c[0],220,W-220),clamp(c[1]-60,560,1500)],'#ffd84a',seg(tt,EV.r3+1.4,EV.r3+1.7))}}
  if(S==='r4'){const c=prj([0,0,0]);if(c){glowAt(c,140,'150,210,255',0.9);tag('🌍 3.7 × 10⁻⁵ · gravity 💀',[c[0],c[1]+120],'#ff5a8a',0);}if(VMOONP){const p=prj(VMOONP);if(p)tag('🌕 same orbit',[clamp(p[0],200,W-200),p[1]-110],'#7dff9a',seg(tt,EV.r4+3.4,EV.r4+3.7))}
    // dotted moon orbit
    ctx.save();ctx.setLineDash([10,14]);ctx.strokeStyle='rgba(125,255,154,0.45)';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<=64;i++){const a=i/64*TAU2;const p=prj([Math.cos(a)*1.7,Math.sin(a)*0.25,Math.sin(a)*1.7]);if(p)i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])}ctx.stroke();ctx.restore()}
  if(S==='r5'){const c=prj([0,0,0]);const k=VNS||0;if(c){glowAt(c,260,'140,200,255',0.4+0.5*k);if(k>0){ctx.save();ctx.globalCompositeOperation='screen';ctx.translate(c[0],c[1]);ctx.rotate(0.35+Math.sin(tt*3)*0.15);for(const s of[-1,1]){const g=ctx.createLinearGradient(0,0,0,s*900);g.addColorStop(0,`rgba(200,230,255,${0.8*k})`);g.addColorStop(1,'rgba(90,160,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-70,s*900);ctx.lineTo(70,s*900);ctx.fill()}ctx.restore()}
      tag('✨ REAL neutron stars ≈ 20 km',[W/2,c[1]+300],'#5af0ff',seg(tt,EV.r5+2.2,EV.r5+2.5))}}
  if(S==='back'){const k=tt-EV.back;const c=prj([0,0,0]);if(c){if(k<1.6){glowAt(c,1200*(0.4+k),'255,200,120',0.9*clamp(1-k/1.6,0,1));for(let i=0;i<4;i++){const kk=k-i*0.15;if(kk>0&&kk<1.4)ring2(c,kk*900,i%2?'#ffd84a':'#ffffff',clamp(1-kk/1.4,0,1),14-i*2)}}
      for(let i=0;i<40;i++){const a=hsh(i,1)*TAU2,sp=(0.4+hsh(i,2))*1100;const kk=k-0.1;if(kk<0||kk>1.8)continue;const x=c[0]+Math.cos(a)*sp*kk,y=c[1]+Math.sin(a)*sp*kk;glowAt([x,y],22,'255,180,90',clamp(1-kk/1.8,0,1))}}}
  if(S==='touch'){for(const a of VATOMS){const c=prj(a.c);if(c){eCloud(c,pxR(a.c,1.1)*1.2,1,'90,200,255');glowAt(c,50,'255,120,160',0.7)}const p=prj(a.e);if(p)glowAt(p,22,'140,240,255',0.9)}
    const s=tt-EV.touch;if(s>3.4){const c=prj([0,0,0]);if(c){const fl=0.5+0.5*Math.sin(tt*14);glowAt(c,120,'255,216,74',0.6*fl*seg(s,3.4,3.7));ctx.save();ctx.globalAlpha=seg(s,3.4,3.7);ctx.font='96px "Noto Color Emoji"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚡',c[0],c[1]);ctx.restore();
        arrowLine(c[0]-60,c[1]+190,c[0]-230,c[1]+190,'#ff5a8a',10,seg(s,3.6,3.9));arrowLine(c[0]+60,c[1]+190,c[0]+230,c[1]+190,'#ff5a8a',10,seg(s,3.6,3.9));tag('NO CONTACT ✋',[c[0],c[1]+280],'#ff5a8a',seg(s,3.8,4.1))}}}
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if ATOMS ⚛️ lost',-90,96,'#ffffff');L('ALL EMPTY SPACE',25,118,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(6.6,EV.r1,'NUCLEUS vs ATOM SIZE','≈ 1 : 100,000 📏','#ffd84a');card(13.4,EV.r2,'YOU, WITHOUT EMPTY SPACE','≈ 0.008 mm 🔬','#ffd84a');
  card(20.8,EV.r3,'ALL HUMANS, COMPRESSED','≈ 2 cm³ 🧊','#5af0ff');card(27.4,EV.r4,'EARTH, COMPRESSED','≈ 370 m WIDE 🌍','#ffd84a');
  card(32.7,EV.r5,'SURFACE GRAVITY','≈ 1,000,000,000 g 💀','#ff5a8a');card(38.6,EV.back,'NEUTRON STARS','REAL · ≈ 20 km wide ✨','#5af0ff');card(51.6,EV.endc,'ELECTRONS','REPEL EACH OTHER ⚡','#ffd84a');
  roundBar(tt);
  if(S==='r5'){bigCount('3',EV.r5+2.6,tt,'#ffffff');bigCount('2',EV.r5+3.1,tt,'#ffffff');bigCount('1',EV.r5+3.6,tt,'#ff5a8a')}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.snap,0.7,0.35,'255,90,138');flash(EV.idea,0.4,0.3);flash(EV.r1,0.6,0.3);flash(EV.shrink,0.5,0.3,'255,216,74');flash(EV.fall,0.4,0.25);flash(EV.r2,0.4,0.3);flash(EV.gone,0.9,0.4);flash(EV.r3,0.4,0.3);flash(EV.r4,0.4,0.3);flash(EV.r5,0.4,0.3);flash(EV.back,1.0,0.6,'255,240,210');flash(EV.touch,0.5,0.3,'0,0,0');flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.7*k})`);gg.addColorStop(0.4,`rgba(4,4,20,${0.4*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('Which second was',-70,92,'#ffffff');L('the CRAZIEST? 🤯',45,104,'#ffd84a');L('👇 comment 1–5',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
