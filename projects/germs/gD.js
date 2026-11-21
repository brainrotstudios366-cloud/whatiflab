// ================= ALL BACTERIA DISAPPEAR: overlays =================
function rgbS(h){const n=parseInt(h.slice(1),16);return`${n>>16&255},${n>>8&255},${n&255}`}
function atmoA(e,cm){const a=e.a==null?1:e.a;if(a<=0.01)return;const c=prj(e.p);if(!c)return;const b=camBasisB(cm);const q=prj(V.add(e.p,V.sc(b.r,e.s)));if(!q)return;const r=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!(r>2))return;
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;const g=ctx.createRadialGradient(c[0],c[1],r*0.86,c[0],c[1],r*1.18);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.42,'rgba(120,200,255,0.75)');g.addColorStop(0.62,'rgba(80,150,255,0.35)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.2,c[1]-r*1.2,r*2.4,r*2.4);ctx.restore();return r}
const CAPS=[[0.05,1.2,'These are ^BACTERIA 🦠'],[1.3,2.4,'~DELETED ❌'],[2.4,3.45,'for ^5 SECONDS'],
 [3.6,5.0,'They live ^EVERYWHERE 🌍'],[5.0,6.4,'and all together'],[6.4,7.9,'they outweigh ALL ^ANIMALS'],[7.9,9.5,'~35 to 1 😳'],
 [9.8,11.0,'Inside ^YOU 🫵'],[11.0,12.5,'~38 TRILLION gone 💨'],[12.5,14.0,'about as many as'],[14.0,15.5,'your ^OWN cells 😳'],[15.5,16.9,'you\'re 0.2 kg ^LIGHTER'],
 [17.2,18.7,'The ^OCEAN 🌊'],[18.7,20.2,'one tiny bacterium'],[20.2,21.9,'makes the oxygen for'],[21.9,23.9,'^1 in 5 BREATHS 🫁'],
 [24.2,25.6,'The ^SOIL 🌱'],[25.6,27.1,'1 teaspoon of dirt'],[27.1,28.6,'has more microbes'],[28.6,30.9,'than ^PEOPLE on Earth 😳'],
 [31.2,32.6,'This ^COW 🐄'],[32.6,34.0,'can\'t digest ~GRASS'],[34.0,35.6,'its microbes do it'],[35.6,37.3,'grass in… ~NOTHING 😳'],
 [37.5,39.0,'Last ^SECOND…'],[41.05,42.3,'Bacteria ^BACK ✅'],[42.3,43.5,'…phew 😮‍💨'],
 [45.2,46.8,'cows ~STARVE 🐄'],[46.8,48.4,'crops lose ^NITROGEN 🌾'],[48.4,50.0,'dead stuff piles up 🍂'],[50.0,51.5,'food chains ~COLLAPSE'],
 [51.8,53.4,'Lab mice CAN live'],[53.4,55.0,'with ^ZERO bacteria 🐭'],[55.0,56.8,'but only in a ^BUBBLE 🫧'],[56.8,58.5,'Earth ~CAN\'T 🌍']];
function caption(t){for(const[a,b,s]of CAPS){if(t<a-0.03||t>=b)continue;const ws=s.split(' ');let size=112;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const cl=ws.map(w=>w.replace(/^[\^~]/,'').toUpperCase());const wd=cl.map(w=>ctx.measureText(w).width);const tot=wd.reduce((x,y)=>x+y,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-a+0.03);ctx.translate(W/2,1290);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  let col='#ffffff';ws.forEach((w,j)=>{col=w[0]==='^'?'#ffd84a':w[0]==='~'?'#ff5a8a':'#ffffff';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(cl[j],x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=col;ctx.fillText(cl[j],x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}
function roundBar(t){if(t<EV.r1||t>=EV.never-0.3)return;const n=t<EV.r2?1:t<EV.r3?2:t<EV.r4?3:t<EV.r5?4:5;const a=clamp((EV.never-0.3-t)/0.3,0,1)*seg(t,EV.r1,EV.r1+0.3);
  ctx.save();ctx.globalAlpha=a;const w=880,x0=W/2-w/2,y=225;ctx.fillStyle='rgba(8,10,30,0.85)';rrect(x0,y-46,w,92,46);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.7)';ctx.lineWidth=3;rrect(x0,y-46,w,92,46);ctx.stroke();
  const lit=t>=EV.back;for(let i=0;i<5;i++){const on=i<n;ctx.fillStyle=lit?'#7dff9a':on?'#ff5a8a':'rgba(255,255,255,0.15)';rrect(x0+460+i*80,y-16,60,32,16);ctx.fill()}
  ctx.font='900 38px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lit?'🦠 BACTERIA: 100%':`🦠 BACTERIA: 0% · ${n}/5`,x0+32,y+2);ctx.restore();
  for(const[i,t0]of[[1,EV.r1],[2,EV.r2],[3,EV.r3],[4,EV.r4],[5,EV.r5]]){const k=t-t0-0.05;if(k<0||k>1.0)continue;const p=popS(k);ctx.save();ctx.globalAlpha=clamp((1.0-k)/0.25,0,1);ctx.translate(W/2,430);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 120px Inter';ctx.lineWidth=24;ctx.lineJoin='round';ctx.strokeStyle='#000';ctx.strokeText('SECOND '+i,0,0);ctx.fillStyle=i===5?'#ffd84a':'#ff5a8a';ctx.fillText('SECOND '+i,0,0);ctx.restore()}}
// glowing microbe specks at 3D points; vanish (fly up + sparkle) at tv
function specks(pts,t,tv,cols,sz,a){if(a<=0)return;ctx.save();for(let i=0;i<pts.length;i++){const P=pts[i];const col=cols[i%cols.length];const k=t-tv-hsh(i,31)*0.25;
    if(k<0){const p=prj(P);if(!p)continue;const tw=0.65+0.35*Math.sin(t*5+i*1.7);glowAt(p,sz*(0.8+hsh(i,32)*0.6),col,a*tw);glowAt(p,sz*0.28,'255,255,255',a*0.8*tw)}
    else if(k<0.6){const p=prj(P);if(!p)continue;const kk=k/0.6;const q=[p[0]+(hsh(i,33)-0.5)*90*kk,p[1]-60*kk-30*kk*kk];glowAt(q,sz*(1+kk*1.5),col,a*(1-kk));
      ctx.globalAlpha=a*(1-kk);ctx.strokeStyle='#ffffff';ctx.lineWidth=3;const r=6+kk*22;ctx.beginPath();ctx.moveTo(q[0]-r,q[1]);ctx.lineTo(q[0]+r,q[1]);ctx.moveTo(q[0],q[1]-r);ctx.lineTo(q[0],q[1]+r);ctx.stroke();ctx.globalAlpha=1}}ctx.restore()}
const GC_G=['98,255,154','90,240,255','125,255,154','255,216,74','255,111,160'];
const GB_BODY=[];for(let i=0;i<46;i++){const belly=i<26;const y=belly?0.85+hsh(i,41)*0.45:0.25+hsh(i,41)*1.5;GB_BODY.push([(hsh(i,42)-0.5)*(belly?0.34:0.5),y,5.2+0.12+(hsh(i,43)-0.5)*0.08])}
const GB_SEA=[];for(let i=0;i<110;i++)GB_SEA.push([-170+hsh(i,44)*240,0.6,-190+hsh(i,45)*230]);
const GB_SOIL=[];for(let i=0;i<70;i++)GB_SOIL.push([-3.5+hsh(i,46)*6.5,0.03,7.2+hsh(i,47)*4.5]);
const GB_BELLY=[];for(let i=0;i<28;i++){const p=[(hsh(i,48)-0.5)*1.1,0.8+hsh(i,49)*0.5,(hsh(i,50)-0.5)*0.5];const c=Math.cos(-0.55),s=Math.sin(-0.55);GB_BELLY.push([p[0]*c+p[2]*s,p[1],6.5-p[0]*s+p[2]*c])}
function globeSpecks(cm,t,a){if(a<=0)return;const pts=[];for(let i=0;i<70;i++){const lat=(hsh(i,51)-0.5)*2.4;const dl=(hsh(i,52)-0.5)*2.6+t*0.05;pts.push(globePt(cm,lat,dl,1.012))}
  const h=V.norm(cm.eye);const vis=pts.filter(p=>V.dot(V.norm(p),h)>0.25);specks(vis,t,1e9,GC_G,26,a)}
function swPos(t,i){const b=GB_SW[i];const w=t*b.sp+b.ph;return V.add(b.p,[Math.sin(w)*0.35,Math.cos(w*0.8)*0.3,Math.sin(w*0.6)*0.2])}
function micOverlay(t,S){ // glows around microbes + eyepiece vignette + labels
  ctx.save();ctx.globalCompositeOperation='screen';for(const g of GB_POS){const p=prj(g.p);if(!p)continue;const r=pxR0(g.p,1.3*g.s*g.v);glowAt(p,Math.min(r,420),rgbS(g.col),0.33*g.v)}ctx.restore();
  // background floating specks (depth)
  for(let i=0;i<26;i++){const x=(hsh(i,61)*W+t*12*(hsh(i,62)-0.5)*8)%W,y=(hsh(i,63)*H+t*18*(0.3+hsh(i,64)))%H;glowAt([x,y],10+hsh(i,65)*24,'120,255,220',0.16)}
  if(S==='hook'){const k=t-EV.gone;if(k>-0.05&&k<0.9)for(let i=0;i<GB_SW.length;i++){const kk=(k-hsh(i,21)*0.12)/0.6;if(kk<0||kk>1)continue;const p=prj(swPos(EV.gone,i));if(!p)continue;const col=rgbS(GB_TYPES[GB_SW[i].ty][1]);glowAt(p,60+kk*160,col,0.8*(1-kk));
    ctx.save();ctx.globalAlpha=1-kk;ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p[0],p[1],20+kk*110,0,Math.PI*2);ctx.stroke();ctx.restore()}}
  const vg=ctx.createRadialGradient(W/2,H*0.5,W*0.5,W/2,H*0.5,H*0.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,6,8,0.78)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(S!=='end'){ctx.save();ctx.globalAlpha=0.9;const x0=80,y0=1700;ctx.fillStyle='#fff';ctx.fillRect(x0,y0,160,10);ctx.font='900 34px Inter';ctx.textAlign='left';ctx.fillText('2 µm',x0,y0-22);ctx.textAlign='right';ctx.font='900 36px Inter, "Noto Color Emoji"';ctx.fillText('🔬 ×5000',W-80,y0+8);ctx.restore()}}
let TT0=0;function pxR0(P,r){const c=prj(P);const cm=camAt(TT0);const b=camBasisB(cm);const q=prj(V.add(P,V.sc(b.r,r)));return c&&q?Math.hypot(q[0]-c[0],q[1]-c[1]):0}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;TT0=tt;const S=scn(tt);const cm=camAt(tt);
  for(const e of EARTHS)atmoA(e,cm);
  if(S==='hook'||S==='day'||S==='end')micOverlay(tt,S);
  if(S==='idea'){globeSpecks(cm,tt,seg(tt,EV.idea+0.3,EV.idea+1.0));}
  if(S==='r5'&&tt>=EV.back){globeSpecks(cm,tt,seg(tt,EV.back,EV.back+0.4));const k=tt-EV.back;if(k<0.5){const c=prj([0,0,0]);if(c)glowAt(c,700,'125,255,154',0.45*(1-k/0.5))}}
  if(S==='r1'){specks(GB_BODY,tt,EV.r1+1.0,GC_G,22,1);const hp=prj([0,1.95,5.2]);if(hp)tag('⚖️ −0.2 kg',[clamp(hp[0]+250,240,W-240),hp[1]+260],'#7dff9a',seg(tt,15.5,15.8))}
  if(S==='r2'){specks(GB_SEA,tt,EV.r2+1.2,['98,255,154','90,240,255'],16,1);tag('🦠 ocean microbes: OFF',[W/2,1500],'#5af0ff',seg(tt,EV.r2+1.6,EV.r2+1.9)*clamp((EV.r3-0.2-tt)/0.2,0,1))}
  if(S==='r3'){specks(GB_SOIL,tt,EV.r3+1.0,GC_G,18,1);tag('🌱 roots lose their helpers',[W/2,1500],'#7dff9a',seg(tt,EV.r3+1.6,EV.r3+1.9)*clamp((EV.r4-0.2-tt)/0.2,0,1))}
  if(S==='r4'){specks(GB_BELLY,tt,EV.r4+1.0,GC_G,22,1);const mp=prj([1.11,1.3,7.18]);if(mp)tag('🌾 grass in',[clamp(mp[0]+120,220,W-220),mp[1]-120],'#ffd84a',seg(tt,EV.r4+1.6,EV.r4+1.9));const bp=prj([-0.1,0.9,6.6]);if(bp)tag('❌ no digestion',[clamp(bp[0],220,W-220),bp[1]+150],'#ff5a8a',seg(tt,EV.r4+3.6,EV.r4+3.9))}
  if(S==='never'){const mk=ease(seg(tt,EV.morph,EV.morph+2.4));const c=prj([0,0,0]);if(c&&mk>0.5){tag('🥀 dying land',[c[0],c[1]+430],'#ff5a8a',seg(tt,EV.morph+1.6,EV.morph+1.9))}}
  if(S!=='hook'&&S!=='day'&&S!=='end'){const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  if(S==='hook'){const a=clamp((EV.idea-0.1-tt)/0.3,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.3?0.7+0.3*easeOut(tt/0.3):1;ctx.translate(W/2,330);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};L('What if ALL bacteria 🦠',-90,96,'#ffffff');L('DISAPPEARED',25,130,'#ffd84a');L('for 5 seconds?',135,90,'#ffffff');ctx.restore()}
  bigTitle([['What if they',-90,100,'#ffffff'],['NEVER',25,150,'#ff5a8a'],['came back? 😳',150,96,'#ffffff']],EV.never,EV.morph+0.1,tt,H*0.25);
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4),430)};
  card(6.4,EV.r1,'BACTERIA vs ALL ANIMALS','≈ 35× THE MASS 🦠','#7dff9a');card(11.0,15.4,'BACTERIA IN YOUR BODY','≈ 38 TRILLION 🦠','#ffd84a');
  card(20.2,EV.r3,'PROCHLOROCOCCUS','≈ 20% OF EARTH\'S O₂ 🫁','#5af0ff');card(27.1,EV.r4,'BACTERIA TURN AIR NITROGEN','→ PLANT FOOD 🌱','#7dff9a');
  card(34.0,EV.r5,'A COW\'S STOMACH','= A MICROBE TANK 🦠','#ffd84a');card(48.4,EV.day,'NATURE\'S RECYCLING','JAMMED ♻️❌','#ff5a8a');
  card(55.0,EV.endc,'GERM-FREE LAB MICE','LIVE IN STERILE BUBBLES 🫧','#5af0ff');
  roundBar(tt);
  if(S==='r5'&&tt<EV.back){bigCount('3',EV.r5+1.5,tt,'#ffffff');bigCount('2',EV.r5+2.2,tt,'#ffffff');bigCount('1',EV.r5+2.9,tt,'#ff5a8a')}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.gone,0.8,0.35,'255,90,138');flash(EV.idea,0.4,0.3);flash(EV.r1,0.5,0.3);flash(EV.r1+1.0,0.35,0.3,'98,255,154');flash(EV.r2,0.4,0.3);flash(EV.r2+1.2,0.3,0.3,'98,255,154');flash(EV.r3,0.4,0.3);flash(EV.r3+1.0,0.3,0.3,'98,255,154');flash(EV.r4,0.4,0.3);flash(EV.r4+1.0,0.3,0.3,'98,255,154');flash(EV.r5,0.4,0.3);flash(EV.back,0.8,0.5,'125,255,154');flash(EV.never,0.5,0.3,'0,0,0');flash(EV.morph,0.4,0.3);flash(EV.day,0.5,0.3,'98,255,154');flash(EV.endc,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(2,14,18,${0.75*k})`);gg.addColorStop(0.4,`rgba(2,14,18,${0.45*k})`);gg.addColorStop(0.6,'rgba(2,14,18,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,380);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const L=(s,y,sz,col)=>{ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,y);ctx.fillStyle=col;ctx.fillText(s,0,y)};
  L('What would YOU miss first?',-70,84,'#ffffff');L('CHEESE 🧀 or COWS 🐄',45,92,'#ffd84a');L('👇 comment',150,70,'#5af0ff');ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1560);ctx.restore()}
