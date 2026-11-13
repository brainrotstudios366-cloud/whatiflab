// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const ts=R[rn];const k=t-ts;const fin=rn===4;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=fin&&t<EV.drop0;
  if(!hideLab){const kk=fin?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,fin?104:120,fin?'#c88aff':(rn===1?'#7ae0ff':'#ffd84a'));ctx.restore();
    if(t<t2)pill(cap1,385,fin?'rgba(110,40,140,0.85)':(rn===1?'rgba(20,70,140,0.85)':'rgba(15,10,30,0.66)'),60,Math.min(1,kk/0.12));else pill(cap2,385,fin?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>EV.peace&&t<EV.wait)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-EV.peace)/0.15));if(t>=EV.wait)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.bonk;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle='#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.25?0.88+0.12*easeOut(t/0.25):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=20;ctx.shadowOffsetY=6;
  txt('HYPERNOVA 💥',0,-80,fitSize('HYPERNOVA 💥',980,120),'#7ae0ff');txt('vs',0,40,78,'#ffffff');txt('A DYING ANT 🐜',0,150,104,'#ff6a5a');ctx.restore();
  if(t>0.8){ctx.save();ctx.globalAlpha=a*clamp((t-0.8)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should fight',0,-110,88,'#ffffff');txt('him NEXT? 🐜',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('TON 618? 🕳️  Big Bang? 💥',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
function glowAt(p,r,col,a){if(!p||a<=0.003)return;const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${Math.min(1,a)})`);g.addColorStop(0.25,`rgba(${col},${Math.min(1,a)*0.35})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const n=tt-EV.nova;
  const sp=LASTVP_BG?project(LASTVP_BG,SC):null;
  ctx.save();ctx.globalCompositeOperation='screen';
  if(tt<EV.nova){const pre=tt-EV.collapse;const pul=tt>=R[0]?0.5+0.5*Math.sin((tt-R[0])*(5+(tt-R[0])*4)):0.5;let a=0.32+0.1*pul;let r=520;if(pre>0){a*=lerp(1,0.45,clamp(pre/0.6,0,1));r=lerp(520,160,clamp(pre/0.6,0,1))}glowAt(sp,r,'120,170,255',a)}
  else{if(n<2.0)glowAt(sp,lerp(300,1100,easeOut(n/0.4)),'230,240,255',clamp(1.0-n/1.8,0,1));
    if(sp&&n<2.0){const a=clamp(1-n/2,0,1);ctx.fillStyle=`rgba(200,225,255,${0.55*a})`;ctx.fillRect(0,sp[1]-6-10*a,W,12+20*a)}
    if(tt>=8)glowAt(sp,420,'255,120,190',0.16);
    if(tt>=EV.warn&&tt<EV.beam1+0.4){const w=clamp((tt-EV.warn)/0.7,0,1);glowAt(sp,lerp(200,650,w),'150,220,255',0.45*w)}
    if(roundAt(tt)>=3){const p=pulseK(tt);glowAt(sp,260+p*700,'170,220,255',0.3+p*0.6)}}
  // gamma hit sparkle
  {const b=beamK(tt);if(b>0&&LASTVP){const p=project(LASTVP,hitP());glowAt(p,300,'190,240,255',0.5*b*(0.85+0.15*Math.sin(tt*50)))}}
  // campfire glow
  if(tt>=EV.ignite&&LASTVP){const p=project(LASTVP,V.add(MTOP,[0,0.15,0]));const k=tt-EV.ignite;glowAt(p,k<0.3?600:300,'255,150,60',(k<0.3?0.8:0.32)+0.05*Math.sin(tt*23))}
  ctx.restore();
  // wave streaks
  if(tt>=EV.wave-0.3&&tt<EV.wave+1.4){const r=rngG(3);const a=clamp((tt-EV.wave+0.3)/0.3,0,1)*clamp((EV.wave+1.4-tt)/0.6,0,1);ctx.save();ctx.globalCompositeOperation='screen';const cx=sp?sp[0]:W/2,cy=sp?sp[1]:H*0.3;
    for(let i=0;i<40;i++){const ang=r()*TAU2,spd=1.4+r()*1.2,ph=r();const d=((tt*spd+ph)%1);const d0=200+d*1400,d1=d0+120+r()*260;ctx.strokeStyle=`rgba(255,${190+r()*60|0},${140+r()*80|0},${0.5*a*(1-d*0.5)})`;ctx.lineWidth=3+r()*6;ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*d0,cy+Math.sin(ang)*d0);ctx.lineTo(cx+Math.cos(ang)*d1,cy+Math.sin(ang)*d1);ctx.stroke()}ctx.restore()}
  // pulsar sweep bands
  if(roundAt(tt)>=3&&tt<R[5]){const p=pulseK(tt);if(p>0.02){ctx.fillStyle=`rgba(170,225,255,${(tt>EV.ignite-0.2&&tt<EV.ignite+0.2?0.45:0.14)*p})`;ctx.fillRect(0,0,W,H)}}
  // bonk stars
  {const k=tt-EV.bonk;if(k>=0&&k<0.6&&LASTVP){const p=project(LASTVP,[0,0.75,-0.22]);if(p){ctx.save();ctx.globalCompositeOperation='screen';const r=rngG(8);for(let i=0;i<16;i++){const a=r()*TAU2,l=(60+r()*200)*easeOut(k/0.25),l0=l*0.35;ctx.strokeStyle=`rgba(255,${210+r()*45|0},140,${1-k/0.6})`;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*l0,p[1]+Math.sin(a)*l0);ctx.lineTo(p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l);ctx.stroke()}ctx.restore()}}}
  // slow-mo letterbox
  if(tt>=EV.drop0-0.6&&tt<EV.bonk+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.bonk-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k);ctx.fillStyle=`rgba(120,60,160,${0.08*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.4)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col,rise)=>{const k=tt-t0;rise=rise||0;if(k>=-rise&&k<d){const v=k<0?1+k/rise:1-k/d;ctx.fillStyle=`rgba(${col||'255,255,255'},${a*v})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.nova,1.0,0.55,'235,245,255');flash(EV.wave,0.88,0.75,'255,236,215',0.15);flash(EV.beam0,0.7,0.3,'200,240,255');flash(EV.ignite,0.25,0.25,'255,180,90');flash(EV.bonk,0.3,0.2,'230,200,255');
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.42;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.15) contrast(1.06)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
