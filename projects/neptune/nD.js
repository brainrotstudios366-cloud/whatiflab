// ================= NEPTUNE: overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.16?0.6+0.4*easeOut(k/0.16)+Math.sin(k/0.16*Math.PI)*0.14:1}
function glowAt(p,r,col,a){if(r<=0||a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function star4(x,y,s,a){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;ctx.translate(x,y);const g=ctx.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(200,230,255,0)');ctx.fillStyle=g;
  for(const r of[0,Math.PI/2]){ctx.save();ctx.rotate(r);ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*0.08,s,0);ctx.quadraticCurveTo(0,s*0.08,-s,0);ctx.fill();ctx.restore()}ctx.beginPath();ctx.arc(0,0,s*0.18,0,7);ctx.fill();ctx.restore()}
function fitS(s,maxW,size,font){ctx.font=`${font||'900'} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
// captions: 1-3 words, big, center
const KEY=new Set(['DIAMONDS','NEPTUNE','FARTHEST','BILLION','MINUS','FASTEST','WINDS','THOUSAND','DEEP','INSIDE','OCEAN','PRESSURE','METHANE','CARBON','DIAMOND','FALL','RAIN','CORE','LAYER','LASERS','PLASTIC','TINY','MILLIONS','CARATS','COMMON','GALAXY','UNIVERSE','BLACK','HOLE','2017','TWENTY','SEVENTEEN','REAL','INSANE','FAKE','WILD','CRAZIEST','RIPS','LITERALLY','JOKE']);
const GROUPS=[];{for(const c of VO){let g=null;for(const[w,a,b]of c.w){const cl=w.replace(/["]/g,'');if(!g||g.words.length>=2||g.len+cl.length>12||/[.,!?:]$/.test(g.words[g.words.length-1])){g={words:[],a,b,len:0};GROUPS.push(g)}g.words.push(cl);g.b=b;g.len+=cl.length+1}}}
function caption(t){for(let i=0;i<GROUPS.length;i++){const g=GROUPS[i];const nx=i+1<GROUPS.length?GROUPS[i+1].a:g.b+0.4;if(t>=g.a-0.05&&t<Math.min(nx,g.b+0.4)){
  const ws=g.words.map(w=>w.replace(/[.,:!?]+$/,'').replace(/\.\.\.$/,'').toUpperCase());let size=118;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const wd=ws.map(w=>ctx.measureText(w).width);const tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  const sc=Math.min(1,940/tot)*popS(t-g.a+0.05);ctx.translate(W/2,1270);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const key=KEY.has(w.replace(/[^A-Z0-9]/g,''));ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(w,x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=key?'#ffd84a':'#ffffff';ctx.fillText(w,x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}}
function statCard(lab,val,col,k,y){if(k<=0)return;const s=popS(k);ctx.save();ctx.translate(W/2,y||330);ctx.scale(s,s);const vs=fitS(val,820,70);ctx.font=`900 ${vs}px Inter`;const w=Math.max(ctx.measureText(val).width,360)+90;ctx.fillStyle='rgba(8,10,30,0.82)';rrect(-w/2,-80,w,160,34);ctx.fill();ctx.strokeStyle='rgba(90,240,255,0.45)';ctx.lineWidth=3;rrect(-w/2,-80,w,160,34);ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='800 34px Inter';ctx.fillStyle='rgba(200,230,255,0.9)';ctx.fillText(lab,0,-40);ctx.font=`900 ${vs}px Inter, "Noto Color Emoji"`;ctx.fillStyle=col||'#ffd84a';ctx.fillText(val,0,22);ctx.restore()}
function tag(s,p,col,a){if(!p)return;ctx.save();ctx.globalAlpha=a;ctx.font='900 34px Inter';const w=ctx.measureText(s).width+40;ctx.fillStyle='rgba(8,10,30,0.8)';rrect(p[0]-w/2,p[1]-28,w,56,28);ctx.fill();ctx.fillStyle=col||'#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,p[0],p[1]+2);ctx.restore()}
const GST=[];{const r=rngG(5);for(let i=0;i<14000;i++){const arm=i%3,t=Math.pow(r(),0.8);const ang=arm/3*TAU2+t*7.5+(r()-0.5)*(0.22+t*0.18);const d=0.04+t*1.0;const sp=(r()-0.5)*0.05*(1-t*0.4);const y=(r()-0.5)*0.04*(1.2-t);
  GST.push([Math.cos(ang)*d+sp,y,Math.sin(ang)*d+sp*0.7,t<0.18?0:r()<0.12?2:1,0.5+r()*1.6,r()*6])}
  for(let i=0;i<3000;i++){const a=r()*TAU2,d=Math.pow(r(),1.6)*0.22;GST.push([Math.cos(a)*d,(r()-0.5)*0.07*(1-d*3),Math.sin(a)*d,0,0.5+r()*1.4,r()*6])}}
const GCOL=['rgba(255,226,170,0.75)','rgba(170,200,255,0.7)','rgba(255,150,210,0.75)'];
function drawGalaxy(t){const rot=t*0.04,c=Math.cos(rot),s=Math.sin(rot),S=26;ctx.save();ctx.globalCompositeOperation='lighter';
  const ce=prj([0,0,0]);if(ce){glowAt(ce,330,'255,200,140',0.5);glowAt(ce,110,'255,240,210',0.85)}
  for(let i=0;i<GST.length;i+=23){const g=GST[i];if(g[3]===0)continue;const x=(g[0]*c-g[2]*s)*S,z=(g[0]*s+g[2]*c)*S;const q=prj([x,g[1]*S,z]);if(q)glowAt(q,clamp(900/q[2],12,60),g[3]===2?'255,120,200':'120,160,255',0.13)}
  for(let b=0;b<3;b++){ctx.fillStyle=GCOL[b];for(const g of GST){if(g[3]!==b)continue;const x=(g[0]*c-g[2]*s)*S,z=(g[0]*s+g[2]*c)*S;const q=prj([x,g[1]*S,z]);if(!q||q[0]<-5||q[0]>W+5||q[1]<-5||q[1]>H+5)continue;const sz=clamp(g[4]*60/q[2],1,5);ctx.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz)}}
  ctx.restore()}
const BOK=[];{const r=rngG(31);for(let i=0;i<34;i++)BOK.push([r()*W,r()*H,20+r()*90,0.3+r()*0.8,r()*6])}
function drawBokeh(t){for(const[x,y,s,v,ph]of BOK){const yy=((y-t*v*120)%(H+200)+H+200)%(H+200)-100;glowAt([x+Math.sin(t*0.7+ph)*30,yy],s,'255,140,60',0.22+0.12*Math.sin(t*2+ph))}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  // planet rim + sun
  if(S==='space'||S==='dive'||S==='cut'||S==='sink'){const c=prj([0,0,0]);const b=camBasis(cm);const e=prj(V.sc(b.r,R));if(c&&e){const rr=Math.hypot(e[0]-c[0],e[1]-c[1]);ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],rr*0.93,c[0],c[1],rr*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.35,'rgba(110,190,255,0.55)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(c[0],c[1],rr*1.2,0,7);ctx.fill();ctx.restore()}
    const sp=prj(V.add(cm.eye,V.sc(V.norm(envAt(tt).sun),500)));if(sp){glowAt(sp,180,'255,240,210',0.6);glowAt(sp,40,'255,255,255',1)}}
  if(S==='galaxy')drawGalaxy(tt);if(S==='deep')drawBokeh(tt);
  if(S==='giant'){const c=prj([0,0,0]);if(c)glowAt(c,700,'140,200,255',0.4*ease(seg(tt,EV.giant,EV.giant+0.8)))}
  // diamond glints
  for(const[p,s,ph]of GLINTS){const q=prj(p);if(!q||q[2]<0.2)continue;const k=Math.pow(Math.max(0,Math.sin(tt*3+ph*7)),8);if(k<0.05)continue;const sz=clamp(s*2600/q[2],10,220);star4(q[0],q[1],sz*(0.5+k),k)}
  // Q glow
  if(QR){const q=prj(QR.p);if(q)glowAt(q,clamp(QR.s*2400/q[2],20,300),'255,210,90',0.35)}
  // cutaway labels
  if(S==='cut'&&tt>EV.cut+2.4){const a=clamp((tt-EV.cut-2.4)*3,0,1);tag('☁️ ATMOSPHERE',prj([0,R*0.93,R*0.25]),'#9fd0ff',a);if(tt>EV.cut+3.2)tag('🌊 HOT ICY OCEAN',prj([R*0.4,R*0.15,0]),'#5af0ff',clamp((tt-EV.cut-3.2)*3,0,1));if(tt>EV.cut+4.2)tag('🪨 CORE',prj([R*0.12,-R*0.1,0]),'#e8b88a',clamp((tt-EV.cut-4.2)*3,0,1))}
  if(S==='sink'&&tt>EV.layer+0.5)tag('💎 DIAMOND LAYER?',prj([R*0.2,R*0.05,R*0.2]),'#ffffff',clamp((tt-EV.layer-0.5)*3,0,1));
  // pressure arrows
  if(S==='deep'&&tt<EV.split+0.4){const a=clamp((tt-EV.meth-0.6)*3,0,1)*clamp((EV.split+0.4-tt)*4,0,1);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#ff6b4a';ctx.strokeStyle='#ff6b4a';ctx.lineWidth=16;const pu=Math.sin(tt*14)*14;
    for(let i=0;i<8;i++){const an=i/8*TAU2;const r1=520+pu,r0=360+pu;const cx=W/2,cy=960;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r1,cy+Math.sin(an)*r1);ctx.lineTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*(r0-40),cy+Math.sin(an)*(r0-40));ctx.lineTo(cx+Math.cos(an+0.08)*(r0+10),cy+Math.sin(an+0.08)*(r0+10));ctx.lineTo(cx+Math.cos(an-0.08)*(r0+10),cy+Math.sin(an-0.08)*(r0+10));ctx.fill()}ctx.restore()}
  if(S==='deep'&&tt>=EV.split&&tt<EV.form){tag('H₂ flies away 💨',[W/2,620],'#ffffff',clamp((tt-EV.split-0.2)*3,0,1));tag('C = carbon',[W/2,1500],'#cfd6e8',clamp((tt-EV.split-0.8)*3,0,1))}
  if(S==='deep'&&tt>=EV.gem){const c=[W/2,960];glowAt(c,520,'150,220,255',0.35+0.1*Math.sin(tt*5));for(let i=0;i<6;i++){const a=tt*1.2+i*1.05;star4(c[0]+Math.cos(a)*300,c[1]+Math.sin(a)*220,70,Math.pow(Math.max(0,Math.sin(tt*4+i)),4))}}
  if(S==='lab'){const f=tt-EV.fire;if(f>0.1&&f<1.0){const p=prj([2.1,1.42,0]);if(p){glowAt(p,700*(1-(f-0.1)),'200,255,210',0.9*(1-(f-0.1)));glowAt(p,160,'255,255,255',1-(f-0.1))}}}
  if(S==='galaxy'&&tt<EV.endc+0.5){for(let i=0;i<16;i++){const a=hsh(i,1)*TAU2,d=0.2+hsh(i,2)*0.75;const p=prj([Math.cos(a+tt*0.04)*d*26,0,Math.sin(a+tt*0.04)*d*26]);if(!p)continue;const k=Math.pow(Math.max(0,Math.sin(tt*2.5+i*1.7)),6);if(k>0.05){star4(p[0],p[1],70*(0.5+k),k);if(k>0.6)emojiAt('💎',p[0],p[1]-50,40,k)}}}
  // dive whiteout
  if(S==='dive'){const k=seg(tt,EV.dive+0.9,EV.dive+1.9);ctx.fillStyle=`rgba(120,180,255,${k})`;ctx.fillRect(0,0,W,H)}
  // vignette
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  // title / stats
  if(tt<3.4){const a=clamp((3.4-tt)/0.35,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.35?0.7+0.3*easeOut(tt/0.35):1;ctx.translate(W/2,560);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=24;
    ctx.font='900 92px Inter';ctx.fillStyle='#fff';ctx.fillText('It rains',0,-70);ctx.font=`900 ${fitS('DIAMONDS 💎',980,140)}px Inter, "Noto Color Emoji"`;ctx.fillStyle='#9fe8ff';ctx.fillText('DIAMONDS 💎',0,50);ctx.font='900 72px Inter';ctx.fillStyle='#fff';ctx.fillText('on Neptune',0,160);ctx.restore()}
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4))};
  card(EV.fly+0.6,EV.close,'DISTANCE FROM SUN','4.5 BILLION km','#ffd84a');card(EV.close+0.9,EV.close+3.6,'TEMPERATURE','−200 °C 🥶','#9fe8ff');card(EV.close+3.6,EV.dive,'WIND SPEED','2,000+ km/h 🌪️','#ffd84a');
  card(EV.meth+0.7,EV.split,'PRESSURE','MILLIONS × EARTH','#ff8a6a');card(EV.lab+0.6,EV.fire,'2017 · STANFORD (SLAC)','LASER vs PLASTIC','#7dff9a');card(EV.fire+1.2,EV.giant,'RESULT','NANO-DIAMONDS 💎','#9fe8ff');
  card(EV.giant+0.8,EV.galaxy,'SIZE (PREDICTED)','MILLIONS OF CARATS','#ffd84a');card(EV.galaxy+2.2,EV.endc,'ICE GIANTS','MOST COMMON PLANETS?','#9fe8ff');
  if(tt<EV.endc)caption(tt);
  // cut flashes
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.fly,0.5,0.3);flash(EV.cut,0.9,0.5,'140,200,255');flash(EV.meth,0.6,0.3,'255,170,120');flash(EV.gem,0.85,0.4,'200,240,255');flash(EV.sink,0.5,0.3);flash(EV.lab,0.5,0.3);flash(EV.fire+0.1,0.6,0.3,'210,255,220');flash(EV.giant,0.7,0.4,'200,240,255');flash(EV.galaxy,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function emojiAt(s,x,y,size,a){ctx.save();ctx.globalAlpha=a;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.6*k})`);gg.addColorStop(0.45,`rgba(4,4,20,${0.35*k})`);gg.addColorStop(0.62,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,600);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=20;ctx.font='900 54px Inter';ctx.fillStyle='#fff';ctx.fillText('NEXT VIDEO:',0,-150);
  ctx.font=`900 ${fitS('What if you fall into',980,84)}px Inter`;ctx.fillStyle='#ffd84a';ctx.fillText('What if you fall into',0,-50);ctx.font=`900 ${fitS('a BLACK HOLE? 🕳️',980,96)}px Inter, "Noto Color Emoji"`;ctx.fillText('a BLACK HOLE? 🕳️',0,60);ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.font='800 50px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.fillText('Follow so you don\'t miss it 🔔',W/2,1560);ctx.restore()}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:3000},{center:[0,-9999,0],radius:1},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.cut,8,0.5);S(EV.gem,8,0.5);S(EV.fire+0.1,10,0.5);S(EV.giant,6,0.5);if(t>=EV.meth&&t<EV.split)a+=2.5*seg(t,EV.meth,EV.split);if(t>=EV.dive&&t<EV.cut)a+=3;return a}
