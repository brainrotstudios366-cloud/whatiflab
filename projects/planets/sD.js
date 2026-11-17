// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[6])return;const [lab,c1,c2,t2,c3,t3]=ROUNDS[rn];const fin=rn===5;const ts=fin?EV.boss:R[rn];const k=t-ts;
  if(!fin||t>=EV.boss){ctx.save();ctx.translate(W/2,250);const pp=popS(k);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cap=c1,bg='rgba(15,10,30,0.66)',ka=k;if(t>=t2){cap=c2;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)';ka=t-t2}if(c3&&t>=t3){cap=c3;bg='rgba(40,110,190,0.88)';ka=t-t3}pill(cap,385,bg,60,Math.min(1,ka/0.12))}
  else{if(t>R[5]+0.3)pill('Back on Earth… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[5]-0.3)/0.15))}
  const ko=t>=EV.slip+0.35;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('⚔️ HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330,34,17);ctx.fill()}
  txt(ko?'K.O.':'100%',258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore();
  const st=STATS[rn];if(st&&t>=st[2]&&t<st[3]){const a=Math.min(1,(t-st[2])/0.2,(st[3]-t)/0.2);ctx.save();ctx.globalAlpha=a;const s=fitSize(st[0],820,50);ctx.font=`900 ${s}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(st[0]).width;
    ctx.translate(W/2,640);const pp=popS(t-st[2]);ctx.scale(pp,pp);ctx.fillStyle='rgba(8,8,26,0.78)';rrect(-w/2-30,-44,w+60,88,24);ctx.fill();ctx.strokeStyle=st[1];ctx.lineWidth=5;ctx.stroke();txt(st[0],0,3,s,st[1],'center',900,false);ctx.restore()}}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.88+0.12*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['MERCURY 🔥','#ffd09a'],['VENUS ☠️','#ffe07a'],['MARS 🌪️','#ff8a5a'],['JUPITER 🌀','#ffc8a0'],['NEPTUNE 💎','#7fc8ff']];
  L.forEach(([s,c],i)=>{const kk=clamp((t+0.12-i*0.03)/0.12,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-220+i*74,64,c);ctx.restore()});
  const kv=clamp((t+0.1)/0.15,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,165,72,'#ffffff');ctx.restore()}
  const ks=clamp((t+0.1)/0.15,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,270);const p2=popS(t+0.3);ctx.scale(p2,p2);txt('ONE SAMURAI ⚔️',0,0,fitSize('ONE SAMURAI ⚔️',980,112),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.4){ctx.save();ctx.globalAlpha=a*clamp((t-1.4)/0.3,0,1);pill('Who wins? 🤔',1640,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[6];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Which planet should',0,-110,82,'#ffffff');txt('he fight NEXT? 🪐',0,0,92,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('Saturn? 🪐   Uranus? 🧊   The Sun? ☀️',W/2,1080,50,'#ffffff','center',800);ctx.restore()}
// ---- sword trail ----
function swordTrail(t){if(!LASTVP)return;const N=9,dt=0.012;const P=[];for(let i=0;i<N;i++){const S=i===0?LASTSAM:samItems(t-i*dt);if(!S.tip){break}const a=project(LASTVP,S.base),b=project(LASTVP,S.tip);if(!a||!b)break;P.push([a,b])}
  if(P.length<2)return;let sp=0;for(let i=1;i<P.length;i++)sp+=Math.hypot(P[i][1][0]-P[i-1][1][0],P[i][1][1]-P[i-1][1][1]);sp/=P.length-1;const al=clamp((sp-12)/50,0,1);if(al<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<P.length-1;i++){const f=1-i/(P.length-1);ctx.fillStyle=`rgba(${200+55*f|0},${230+25*f|0},255,${0.75*al*f})`;ctx.beginPath();ctx.moveTo(P[i][0][0],P[i][0][1]);ctx.lineTo(P[i][1][0],P[i][1][1]);ctx.lineTo(P[i+1][1][0],P[i+1][1][1]);ctx.lineTo(P[i+1][0][0],P[i+1][0][1]);ctx.closePath();ctx.fill()}ctx.restore()}
function slashLine(cx,cy,ang,k,wid,col){if(k<0||k>1)return;const L=2600;const w=wid*Math.sin(k*Math.PI)*(1-k*0.5);const dx=Math.cos(ang),dy=Math.sin(ang);const ext=easeOut(clamp(k/0.25,0,1));ctx.save();ctx.globalCompositeOperation='screen';
  const x0=cx-dx*L*ext,y0=cy-dy*L*ext,x1=cx+dx*L*ext,y1=cy+dy*L*ext;ctx.strokeStyle=`rgba(${col},${0.35*(1-k)})`;ctx.lineWidth=w*4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${0.95*(1-k*0.7)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  // planet halos
  if(LASTVP)for(const P of SKYPL){const c=project(LASTVP,P.p),e=project(LASTVP,V.add(P.p,[P.r,0,0]));if(!c||!e)continue;const rp=Math.hypot(e[0]-c[0],e[1]-c[1]);const col=P.key==='sun'?[255,230,170]:PL_HALO[P.key].map(x=>x*255|0);
    ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],rp*0.92,c[0],c[1],rp*(P.key==='sun'?2.6:1.35));g.addColorStop(0,`rgba(${col},${0.5*P.a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(c[0]-rp*2.7,c[1]-rp*2.7,rp*5.4,rp*5.4);ctx.restore();
    if(P.key==='sun')glowAt(c,rp*1.3,'255,250,225',0.6*P.a)}
  if(LASTSAM&&LASTSAM.tip)swordTrail(tt);
  // Mercury heat haze tint
  if(rn===0&&tt<EV.night){const a=clamp((tt-R[0]-0.5)/1.5,0,1)*0.22;ctx.fillStyle=`rgba(255,150,60,${a})`;ctx.fillRect(0,0,W,H)}
  if(rn===0&&tt>=EV.night&&tt<EV.night+2){for(let i=0;i<14;i++){const r=rngG(i+3);const x=r()*W,y=H*0.2+r()*H*0.6;emoji('❄️',x,y+(tt-EV.night)*120*r(),40+r()*30,clamp(1-(tt-EV.night)/2,0,1)*0.8)}}
  // Mars: dust streaks
  if(rn===2&&tt>=EV.dust-0.2){const a=clamp((tt-EV.dust+0.2)/0.5,0,1);const r=rngG(12);ctx.save();for(let i=0;i<70;i++){const sp=900+r()*900;const y=r()*H;const x=((tt*sp+r()*3000)%(W+400))-200;ctx.strokeStyle=`rgba(230,150,100,${0.35*a})`;ctx.lineWidth=2+r()*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-90-r()*80,y+12);ctx.stroke()}ctx.restore()}
  if(rn===2&&tt>=EV.nap+0.6&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p)for(let i=0;i<3;i++){const k=((tt-EV.nap)*0.7+i/3)%1;txt('z',p[0]+70+k*90+i*10,Math.max(760,p[1]-30-k*160),50+i*16,'#ffffff','center',900)}}
  // Jupiter: glow + cut
  if(rn===3){if(tt<EV.cut&&tt>=EV.grs0&&LASTVP){const p=project(LASTVP,metPos(tt));if(p)glowAt(p,850*clamp((tt-EV.grs0)/4,0.25,1),'255,110,60',0.45)}
    {const k=(tt-EV.cut+0.03)/0.45;if(LASTVP){const p=project(LASTVP,MET_C);slashLine(p?p[0]:W/2,p?p[1]:H/2,Math.PI/2+0.12,k,26,'255,220,160')}}}
  // Neptune: wind streaks + diamond glints
  if(rn===4){const a=clamp((tt-R[4]-0.3)/1,0,1);const r=rngG(21);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<46;i++){const sp=1800+r()*1500;const y=r()*H;const x=W+200-((tt*sp+r()*4000)%(W+600));ctx.strokeStyle=`rgba(170,220,255,${0.3*a})`;ctx.lineWidth=2+r()*2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+140+r()*120,y-14);ctx.stroke()}ctx.restore();
    if(LASTVP){for(let i=0;i<DIA.length;i++){const q=diaPos(DIA[i],tt);if(!q)continue;const p=project(LASTVP,q.p);if(!p)continue;const tw=0.5+0.5*Math.sin(tt*9+i*1.7);glowAt(p,26+tw*24,'200,240,255',0.55*tw);if(q.fly&&q.b<0.25)glowAt(p,90,'255,255,255',0.8*(1-q.b/0.25))}
      if(LASTSAM&&LASTSAM.gem){const p=project(LASTVP,LASTSAM.gem);if(p){glowAt(p,140,'190,240,255',0.65);const s=0.5+0.5*Math.sin(tt*7);ctx.save();ctx.globalCompositeOperation='screen';ctx.strokeStyle=`rgba(255,255,255,${0.8*s})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p[0]-70,p[1]);ctx.lineTo(p[0]+70,p[1]);ctx.moveTo(p[0],p[1]-70);ctx.lineTo(p[0],p[1]+70);ctx.stroke();ctx.restore()}}}}
  // Earth: peel highlight, slip, KO
  if(rn===5||tt>=R[6]){if(tt>=EV.boss&&tt<EV.step&&LASTPEEL&&LASTVP){const p=project(LASTVP,LASTPEEL);if(p){const s=1+0.08*Math.sin(tt*10);ctx.save();ctx.strokeStyle='rgba(255,90,90,0.95)';ctx.lineWidth=8;ctx.beginPath();ctx.arc(p[0],p[1],110*s,0,TAU2);ctx.stroke();ctx.restore()}}
    {const k=ease((tt-EV.step+0.2)/0.3)*(1-ease((tt-EV.floor-0.1)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}}
    if(tt>=EV.floor+0.4&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*110,p[1]-40+Math.sin(a)*35,70)}}
    {const k=(tt-EV.floor)/0.35;if(k>=0&&k<1&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p)emoji('💥',p[0]-20,p[1]-40,160*(0.7+0.3*easeOut(k*3)),1-k)}}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<6;i++)flash(R[i],0.35,0.18);flash(EV.umb,0.25,0.15);flash(EV.night,0.6,0.3,'160,200,255');flash(EV.dust,0.6,0.5,'255,170,110');flash(EV.cut,0.9,0.35);flash(EV.spin0,0.35,0.2,'200,240,255');flash(EV.keep,0.35,0.2,'200,240,255');flash(EV.floor,0.45,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
