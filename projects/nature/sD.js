// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const [lab,c1,c2,t2,c3,t3]=ROUNDS[rn];const fin=rn===4;const ts=fin?EV.boss:R[rn];const k=t-ts;
  if(!fin||t>=EV.boss){ctx.save();ctx.translate(W/2,250);const pp=popS(k);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cap=c1,bg='rgba(15,10,30,0.66)',ka=k;if(t>=t2){cap=c2;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)';ka=t-t2}if(c3&&t>=t3){cap=c3;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,110,190,0.88)';ka=t-t3}pill(cap,385,bg,60,Math.min(1,ka/0.12))}
  else{if(t>R[4]+0.2)pill('Night falls… something buzzes 🌙',385,'rgba(15,10,30,0.62)',56,Math.min(1,(t-R[4]-0.2)/0.15))}
  const ko=t>=EV.slap+0.15;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('⚔️ HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle=t>=EV.bite?'#ffb03e':'#3ee07a';rrect(-150,-17,t>=EV.bite?300:330,34,17);ctx.fill()}
  txt(ko?'K.O.':(t>=EV.bite?'99%':'100%'),258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore();
  for(const st of[STATS[rn],STATS2[rn]]){if(st&&t>=st[2]&&t<st[3]){const a=Math.min(1,(t-st[2])/0.2,(st[3]-t)/0.2);ctx.save();ctx.globalAlpha=a;const s=fitSize(st[0],860,50);ctx.font=`900 ${s}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(st[0]).width;
    ctx.translate(W/2,640);const pp=popS(t-st[2]);ctx.scale(pp,pp);ctx.fillStyle='rgba(8,8,26,0.78)';rrect(-w/2-30,-44,w+60,88,24);ctx.fill();ctx.strokeStyle=st[1];ctx.lineWidth=5;ctx.stroke();txt(st[0],0,3,s,st[1],'center',900,false);ctx.restore()}}}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.88+0.12*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['MANTIS SHRIMP 🥊','#7DFF9A'],['PISTOL SHRIMP 🔥','#FF8A6A'],['SALTWATER CROC 🐊','#d8e070'],['SPERM WHALE 🐋','#5AF0FF'],['…and ??? 🤫','#ffffff']];
  L.forEach(([s,c],i)=>{const kk=clamp((t+0.12-i*0.03)/0.12,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-220+i*74,64,c);ctx.restore()});
  const kv=clamp((t+0.1)/0.15,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,165,72,'#ffffff');ctx.restore()}
  const ks=clamp((t+0.1)/0.15,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,270);const p2=popS(t+0.3);ctx.scale(p2,p2);txt('ONE SAMURAI ⚔️',0,0,fitSize('ONE SAMURAI ⚔️',980,112),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.2){ctx.save();ctx.globalAlpha=a*clamp((t-1.2)/0.3,0,1);pill("Nature's hardest hits 🥊 Who wins?",1640,'rgba(15,10,30,0.7)',56);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Which animal should',0,-110,82,'#ffffff');txt('he fight NEXT? 🐾',0,0,92,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('Hippo 🦛   Honey badger 🦡   Gorilla 🦍',W/2,1080,50,'#ffffff','center',800);ctx.restore()}
// ---- sword trail ----
function swordTrail(t){if(!LASTVP)return;const N=9,dt=0.012;const P=[];for(let i=0;i<N;i++){const S=i===0?LASTSAM:samItems(t-i*dt);if(!S.tip){break}const a=project(LASTVP,S.base),b=project(LASTVP,S.tip);if(!a||!b)break;P.push([a,b])}
  if(P.length<2)return;let sp=0;for(let i=1;i<P.length;i++)sp+=Math.hypot(P[i][1][0]-P[i-1][1][0],P[i][1][1]-P[i-1][1][1]);sp/=P.length-1;const al=clamp((sp-12)/50,0,1);if(al<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<P.length-1;i++){const f=1-i/(P.length-1);ctx.fillStyle=`rgba(${200+55*f|0},${230+25*f|0},255,${0.75*al*f})`;ctx.beginPath();ctx.moveTo(P[i][0][0],P[i][0][1]);ctx.lineTo(P[i][1][0],P[i][1][1]);ctx.lineTo(P[i+1][1][0],P[i+1][1][1]);ctx.lineTo(P[i+1][0][0],P[i+1][0][1]);ctx.closePath();ctx.fill()}ctx.restore()}
function slashLine(cx,cy,ang,k,wid,col){if(k<0||k>1)return;const L=2600;const w=wid*Math.sin(k*Math.PI)*(1-k*0.5);const dx=Math.cos(ang),dy=Math.sin(ang);const ext=easeOut(clamp(k/0.25,0,1));ctx.save();ctx.globalCompositeOperation='screen';
  const x0=cx-dx*L*ext,y0=cy-dy*L*ext,x1=cx+dx*L*ext,y1=cy+dy*L*ext;ctx.strokeStyle=`rgba(${col},${0.35*(1-k)})`;ctx.lineWidth=w*4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${0.95*(1-k*0.7)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function word(s,p,size,col,k,rot){if(k<0||k>1)return;const sc=k<0.15?0.5+0.5*easeOut(k/0.15)+Math.sin(k/0.15*Math.PI)*0.25:1;ctx.save();ctx.globalAlpha=k>0.75?(1-k)/0.25:1;ctx.translate(p[0],p[1]);ctx.rotate(rot||0);ctx.scale(sc,sc);txt(s,0,0,size,col);ctx.restore()}
function P2(p){return LASTVP&&p?project(LASTVP,p):null}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  if(LASTSAM&&LASTSAM.tip)swordTrail(tt);
  // R1 mantis
  if(rn===0){const p=P2(IMP);const k=tt-EV.punch;if(p&&k>=0&&k<0.6){glowAt(p,420*(1-k/0.6)+80,'190,230,255',0.95*(1-k/0.6));ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<14;i++){const a=i/14*TAU2+0.3;const r0=40+k*500,r1=r0+120*(1-k/0.6);ctx.strokeStyle=`rgba(255,240,200,${0.9*(1-k/0.6)})`;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*r0,p[1]+Math.sin(a)*r0);ctx.lineTo(p[0]+Math.cos(a)*r1,p[1]+Math.sin(a)*r1);ctx.stroke()}ctx.restore()}
    if(p)word('BAM!',[p[0]+40,p[1]-190],120,'#ffd84a',(tt-EV.punch)/0.9,-0.12);
    const m=P2(MSH);if(m&&tt>=EV.bounce+0.9&&tt<R[1])for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',m[0]+Math.cos(a)*90,m[1]-60+Math.sin(a)*28,62)}
    if(m&&tt>=R[0]+0.3&&tt<EV.mWind){const s=1+0.06*Math.sin(tt*9);ctx.save();ctx.strokeStyle='rgba(125,255,154,0.9)';ctx.lineWidth=7;ctx.beginPath();ctx.arc(m[0],m[1]+40,150*s,0,TAU2);ctx.stroke();ctx.restore()}}
  // R2 pistol shrimp
  if(rn===1){const p=P2(BUB);const k=tt-EV.snap;if(p&&k>=0&&k<0.8){glowAt(p,500*(1-k/0.8)+60,'255,240,200',0.8*(1-k/0.8));glowAt(p,260,'255,140,60',0.8*(1-k/0.8))}
    if(p)word('SNAP!',[p[0]-30,p[1]-210],130,'#FF5A8A',(tt-EV.snap)/1.0,0.1);
    const d=LASTSAM&&LASTSAM.dango?P2(LASTSAM.dango):null;if(d&&tt>=EV.toast&&tt<EV.yum+0.4){ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<4;i++){const kk=((tt-EV.toast)*0.8+i/4)%1;ctx.strokeStyle=`rgba(255,255,255,${0.5*(1-kk)})`;ctx.lineWidth=6;ctx.beginPath();const x=d[0]-30+i*20,y=d[1]-40-kk*150;ctx.moveTo(x,y);ctx.quadraticCurveTo(x+25,y-30,x,y-60);ctx.stroke()}ctx.restore()}
    if(d&&tt>=EV.yum+0.15)word('😋',[d[0]+60,d[1]-80],100,'#fff',(tt-EV.yum-0.15)/1.4,0)}
  // R3 croc
  if(rn===2){const p=P2(CRJ);if(p)word('CHOMP!',[p[0],p[1]-180],120,'#FFB36A',(tt-EV.lunge)/0.9,-0.1);if(p&&tt>=EV.dent)word('🦷✨',[p[0]+40,p[1]-140],110,'#fff',(tt-EV.dent)/2.6,0)}
  // R4 whale
  if(rn===3){const p=P2(WHEAD);if(p&&tt>=EV.click-0.1&&tt<EV.click+1.4){const k=tt-EV.click;glowAt(p,240+Math.abs(Math.sin(k*20))*80,'90,240,255',0.8*clamp(1-k/1.4,0,1))}
    if(p)word('CLICK!!!',[clamp(p[0],300,W-300),p[1]-200],130,'#5AF0FF',(tt-EV.click)/1.2,0.08);
    if(tt>=EV.tiny-0.1&&LASTSAM&&LASTSAM.head){const h=P2(LASTSAM.head);if(h)word('*click*',[h[0]+170,h[1]-120],44,'#ffffff',(tt-EV.tiny+0.1)/2.2,0)}}
  // FINAL mosquito
  if(rn===4||tt>=R[5]){const m=P2(MQ);if(m)glowAt(m,90,'255,240,255',0.35);
    if(m&&tt>=EV.boss-0.2&&tt<EV.slap+1.2&&!(tt>=EV.mland-0.2&&tt<EV.slap)){const s=1+0.08*Math.sin(tt*10);ctx.save();ctx.strokeStyle='rgba(255,90,90,0.95)';ctx.lineWidth=7;ctx.beginPath();ctx.arc(m[0],m[1],(tt<EV.buzz?150:95)*s,0,TAU2);ctx.stroke();ctx.restore()}
    if(m&&tt>=EV.buzz&&tt<EV.slap+1.4){for(let i=0;i<2;i++){const ph=(tt*1.3+i*0.5)%1;ctx.save();ctx.globalAlpha=Math.sin(ph*Math.PI)*0.9;txt('bzzz',m[0]+(i?-1:1)*(90+ph*60),m[1]-60-ph*50,40,'#ffffff','center',900);ctx.restore()}}
    for(const [ts,ang] of[[EV.sl1,1.2],[EV.sl2,0.05],[EV.sl3,-1.3]]){const k=(tt-ts+0.02)/0.4;if(k>0&&k<1){const i=MQK.findIndex(q=>q[0]>ts)-1;const pp=P2(MQK[Math.max(0,i)][1]);if(pp){slashLine(pp[0],pp[1],ang,k,22,'255,220,200');word('MISS',[pp[0],pp[1]-120],70,'#ff6a6a',k,0)}}}
    if(m&&tt>=EV.bite&&tt<EV.slapUp)word('🩸',[m[0]+70,m[1]+40],60,'#fff',(tt-EV.bite)/(EV.slapUp-EV.bite),0);
    if(LASTSAM&&LASTSAM.head){const h=P2(LASTSAM.head);if(h){word('SLAP!',[h[0],Math.max(800,h[1]-200)],130,'#ffd84a',(tt-EV.slap)/0.9,-0.1);{const k=(tt-EV.slap)/0.35;if(k>=0&&k<1)emoji('💥',h[0],h[1]-30,170*(0.7+0.3*easeOut(k*3)),1-k)}
      if(tt>=EV.floor+0.4)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',h[0]+Math.cos(a)*110,h[1]-40+Math.sin(a)*35,70)}}}
    if(m&&tt>=EV.floor+1.4&&tt<R[5])word('🦟 +1 snack',[clamp(m[0],300,W-300),Math.max(800,m[1]-110)],60,'#FF5A8A',clamp((tt-EV.floor-1.4)/5,0,0.74),0);
    {const k=ease((tt-EV.slap+0.2)/0.25)*(1-ease((tt-EV.floor-0.1)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.18);flash(EV.punch,0.4,0.22,'210,235,255');flash(EV.snap,0.5,0.25,'255,245,220');flash(EV.jam,0.4,0.2);flash(EV.click,0.35,0.3,'150,240,255');flash(EV.boss,0.35,0.2,'255,90,90');flash(EV.slap,0.3,0.15);flash(EV.floor,0.45,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
