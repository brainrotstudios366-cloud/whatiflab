// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const [lab,c1,c2,t2,c3,t3]=ROUNDS[rn];const fin=rn===4;const ts=fin?EV.swat0:R[rn];const k=t-ts;
  if(!fin||t>=EV.swat0){ctx.save();ctx.translate(W/2,250);const pp=popS(k);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cap=c1,bg='rgba(15,10,30,0.66)',ka=k;if(t>=t2){cap=c2;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)';ka=t-t2}if(c3&&t>=t3){cap=c3;bg='rgba(40,110,190,0.88)';ka=t-t3}pill(cap,385,bg,60,Math.min(1,ka/0.12))}
  else{if(t>R[4]+0.3&&t<EV.wait)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[4]-0.3)/0.15));if(t>=EV.wait)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.slap+0.1;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('⚔️ HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330,34,17);ctx.fill()}
  txt(ko?'K.O.':'100%',258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['1000 NINJAS 🥷','#d9d0ff'],['A METEOR ☄️','#ffb36a'],['A TSUNAMI 🌊','#7fe0ff'],['A DRAGON 🐉','#ff7a6a']];
  L.forEach(([s,c],i)=>{const kk=clamp((t-0.15-i*0.18)/0.25,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-190+i*78,62,c);ctx.restore()});
  const kv=clamp((t-0.95)/0.25,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,140,74,'#ffffff');ctx.restore()}
  const ks=clamp((t-1.15)/0.25,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,250);const p2=popS(t-1.15);ctx.scale(p2,p2);txt('ONE SAMURAI ⚔️',0,0,fitSize('ONE SAMURAI ⚔️',980,112),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.6){ctx.save();ctx.globalAlpha=a*clamp((t-1.6)/0.3,0,1);pill('Who wins? 🤔',1560,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should he',0,-110,88,'#ffffff');txt('fight NEXT? ⚔️',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('T-Rex? 🦖   A black hole? 🕳️',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
// ---- sword trail ----
function swordTrail(t){if(!LASTVP)return;const N=9,dt=0.012;const P=[];for(let i=0;i<N;i++){const S=i===0?LASTSAM:samItems(t-i*dt);if(!S.tip){break}const a=project(LASTVP,S.base),b=project(LASTVP,S.tip);if(!a||!b)break;P.push([a,b])}
  if(P.length<2)return;let sp=0;for(let i=1;i<P.length;i++)sp+=Math.hypot(P[i][1][0]-P[i-1][1][0],P[i][1][1]-P[i-1][1][1]);sp/=P.length-1;const al=clamp((sp-12)/50,0,1);if(al<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<P.length-1;i++){const f=1-i/(P.length-1);ctx.fillStyle=`rgba(${200+55*f|0},${230+25*f|0},255,${0.75*al*f})`;ctx.beginPath();ctx.moveTo(P[i][0][0],P[i][0][1]);ctx.lineTo(P[i][1][0],P[i][1][1]);ctx.lineTo(P[i+1][1][0],P[i+1][1][1]);ctx.lineTo(P[i+1][0][0],P[i+1][0][1]);ctx.closePath();ctx.fill()}ctx.restore()}
function slashLine(cx,cy,ang,k,wid,col){if(k<0||k>1)return;const L=2600;const w=wid*Math.sin(k*Math.PI)*(1-k*0.5);const dx=Math.cos(ang),dy=Math.sin(ang);const ext=easeOut(clamp(k/0.25,0,1));ctx.save();ctx.globalCompositeOperation='screen';
  const x0=cx-dx*L*ext,y0=cy-dy*L*ext,x1=cx+dx*L*ext,y1=cy+dy*L*ext;ctx.strokeStyle=`rgba(${col},${0.35*(1-k)})`;ctx.lineWidth=w*4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${0.95*(1-k*0.7)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  if(LASTSAM&&LASTSAM.tip)swordTrail(tt);
  // stage 1: spin + click cuts
  {const k=(tt-EV.click)/0.35;if(k>=0&&k<1){const r=rngG(4);for(let i=0;i<7;i++)slashLine(r()*W,300+r()*1300,(r()-0.5)*1.2,clamp(k*1.3-i*0.04,0,1),14,'170,220,255')}}
  // meteor
  if(rn===1){if(tt<EV.cut&&LASTVP){const p=project(LASTVP,metPos(tt));if(p)glowAt(p,900*clamp((tt-R[1])/4.5,0.25,1),'255,140,50',0.55)}
    {const k=(tt-EV.cut+0.03)/0.45;if(LASTVP){const p=project(LASTVP,MET_C);slashLine(p?p[0]:W/2,p?p[1]:H/2,Math.PI/2+0.12,k,26,'255,220,160')}}
    if(tt>=EV.boom&&LASTVP){const fa=Math.exp(-(tt-EV.boom)*0.9);for(const L of MLAND){const p=project(LASTVP,[L[0],12,L[2]]);if(p){glowAt(p,700,'255,150,50',0.75*fa);glowAt(p,260,'255,240,190',0.8*fa)}}}
    if(tt>=EV.boom){const r=rngG(9);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<60;i++){const sp=120+r()*260;const x=(r()*W+Math.sin(tt*0.7+i)*60);const y=H-((tt-EV.boom)*sp+r()*H)%H;ctx.fillStyle=`rgba(255,${120+r()*100|0},40,${0.7*clamp(1-(tt-EV.boom)/5,0.25,1)})`;ctx.beginPath();ctx.arc(x,y,3+r()*4,0,TAU2);ctx.fill()}ctx.restore()}}
  // tsunami: wind/spray streaks + vertical cut
  if(rn===2){const a=clamp((tt-30.5)/1.5,0,1)*clamp((R[3]-tt)/1.5,0,1);if(a>0){const r=rngG(12);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<40;i++){const sp=1400+r()*900;const x0=r()*W*1.4;const y=((tt*sp+r()*2000)%(H+300))-150;const x=x0-y*0.35;ctx.strokeStyle=`rgba(210,235,245,${0.28*a})`;ctx.lineWidth=2+r()*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+40,y-110);ctx.stroke()}ctx.restore()}
    slashLine(W/2+10,H*0.45,Math.PI/2,(tt-EV.wcut+0.02)/0.55,34,'160,230,255')}
  // dragon: fire glow, cut, hearts
  if(rn===3&&LASTDRA&&LASTVP){if(tt>=EV.fire0&&tt<EV.fire1+0.4){const fa=tt<EV.fire1?1:1-(tt-EV.fire1)/0.4;const m=project(LASTVP,LASTDRA.mouth);if(m)glowAt(m,300,'255,170,60',0.45*fa);const h=project(LASTVP,[0,1.4,0.8]);if(h)glowAt(h,380,'255,140,40',0.35*fa)}
    {const p=project(LASTVP,LASTDRA.head);slashLine(p?p[0]:W/2,p?p[1]:H*0.4,-0.6,(tt-EV.dcut+0.02)/0.45,24,'255,230,200')}
    if(tt>=EV.pat+0.3){const p=project(LASTVP,V.add(LASTDRA.head,[0,1.6,0]));if(p)for(let i=0;i<3;i++){const k=((tt-EV.pat)*0.6+i/3)%1;emoji(i===1?'💕':'❤️',p[0]+Math.sin(k*9+i*2)*50+(i-1)*90,p[1]-k*260,70+30*k,clamp(Math.min(k/0.15,(1-k)/0.3),0,1))}}}
  // mosquito: KO stars + letterbox
  if(rn===4||tt>=R[5]){if(tt>=EV.slap+0.6&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*110,p[1]-40+Math.sin(a)*35,70)}}
    {const k=ease((tt-EV.land2+0.1)/0.3)*(1-ease((tt-EV.slap-0.2)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}}
    if(tt>=EV.wait-0.1&&tt<EV.slap&&LASTMOSQ&&LASTVP){const p=project(LASTVP,LASTMOSQ);if(p&&tt<EV.land2){/* buzz marks */ctx.save();ctx.strokeStyle='rgba(255,255,255,0.75)';ctx.lineWidth=5;for(let i=0;i<3;i++){const a=-0.9+i*0.5+Math.sin(tt*30+i)*0.1;ctx.beginPath();ctx.arc(p[0],p[1],45+i*18,a,a+0.35);ctx.stroke()}ctx.restore()}}
    {const k=(tt-EV.slap)/0.3;if(k>=0&&k<1&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p){emoji('💥',p[0]+30,p[1]-60,160*(0.7+0.3*easeOut(k*3)),1-k)}}}}
  // slow-mo bars around the freeze
  {const k=ease((tt-EV.spin+0.4)/0.3)*(1-ease((tt-EV.click-0.1)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,100*k);ctx.fillRect(0,H-100*k,W,100*k)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.spin,0.75,0.25);flash(EV.click,0.45,0.2);flash(EV.cut,0.9,0.35);flash(EV.boom,0.45,0.7,'255,190,120');flash(EV.wcut,0.85,0.35,'220,245,255');flash(EV.dcut,0.85,0.3);flash(EV.slap,0.4,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
