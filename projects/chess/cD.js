// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const[lab,caps]=ROUNDS[rn];const fin=rn===4;
  if(!fin||t>=EV.boss){const ts=fin?EV.boss:R[rn];ctx.save();ctx.translate(W/2,250);const pp=popS(t-ts);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cur=null;for(const c of caps)if(t>=c[0])cur=c;if(cur)pill(cur[1],385,cur[2],60,Math.min(1,(t-cur[0])/0.12))}
  else{let s=null,t0=0;if(t>=R[4]+0.3){s='New game… finally peace 😌';t0=R[4]+0.3}if(t>=EV.dstep2){s='First move: 2 squares 😎';t0=EV.dstep2}if(t>=EV.wake){s='Wait…';t0=EV.wake}
    if(s)pill(s,385,BGD,s==='Wait…'?64:60,Math.min(1,(t-t0)/0.15))}
  const ko=t>=EV.ephit+0.05;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('♟️ HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330,34,17);ctx.fill()}
  txt(ko?'K.O.':'100%',258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['A KNIGHT 🐴','#d9d0ff'],['A BISHOP ⛪','#ffcf8a'],['A ROOK 🏰','#9fe0ff'],['THE QUEEN 👑','#ff8ab4']];
  L.forEach(([s,c],i)=>{const kk=clamp((t-0.15-i*0.18)/0.25,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-190+i*78,62,c);ctx.restore()});
  const kv=clamp((t-0.95)/0.25,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,140,74,'#ffffff');ctx.restore()}
  const ks=clamp((t-1.15)/0.25,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,250);const p2=popS(t-1.15);ctx.scale(p2,p2);txt('ONE PAWN ♟️',0,0,fitSize('ONE PAWN ♟️',980,118),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.6){ctx.save();ctx.globalAlpha=a*clamp((t-1.6)/0.3,0,1);pill('Who wins? 🤔',1560,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should the pawn',0,-110,fitSize('Who should the pawn',960,84),'#ffffff');txt('fight NEXT? ♟️',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('The King? 🤴   A chess bot? 🤖',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function badge(p,sym,col,k){if(!p)return;const s=k<0.18?0.4+0.6*easeOut(k/0.18)+0.25*Math.sin(k/0.18*Math.PI):1;ctx.save();ctx.translate(p[0]+60,p[1]-40);ctx.scale(s,s);ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=12;ctx.shadowOffsetY=4;
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,52,0,TAU2);ctx.fill();ctx.shadowColor='transparent';ctx.lineWidth=7;ctx.strokeStyle='#ffffff';ctx.stroke();txt(sym,0,4,sym.length>1?50:58,'#ffffff','center',900,false);ctx.restore()}
function pcHead(kind,white,dy){if(!STATE||!LASTVP)return null;const pc=STATE.find(p=>p.kind===kind&&p.white===white);if(!pc||!pc.M)return null;return project(LASTVP,V.add(headPos(kind,pc.M),[0,dy||0.35,0]))}
const BADGES=[[EV.kland+0.05,EV.cap1+0.2,'knight',false,'??','#e0413a'],[EV.hit1+0.05,EV.hit1+1.6,'pawn',true,'!!','#1fb5a8'],[EV.bfly,EV.bfall+0.6,'bishop',false,'??','#e0413a'],
  [EV.slow1,EV.redge+0.6,'rook',false,'??','#e0413a'],[EV.dstep+0.6,EV.dstep+2.2,'pawn',true,'!!','#1fb5a8'],[EV.qhit+0.05,EV.promo0,'pawn',true,'!!','#1fb5a8'],[EV.ephit+0.1,R[5]+0.3,'pawn',false,'!!','#1fb5a8']];
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  // rook speed lines
  if(rn===2&&tt>=EV.charge&&tt<EV.redge+0.2){const a=clamp((tt-EV.charge)/0.6,0,1)*(tt>=EV.slow0&&tt<EV.slow1?0.45:1);const r=rngG(12);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<34;i++){const y=r()*H;const sp=2600+r()*1800;const x=W-((tt*sp+r()*3000)%(W+600));ctx.strokeStyle=`rgba(255,255,255,${0.32*a})`;ctx.lineWidth=2+r()*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+220+r()*200,y);ctx.stroke()}ctx.restore()}
  // queen beam glows
  if(rn===3&&LASTVP){for(const[tb,p]of QB){const k=tt-tb;if(k>=0&&k<0.6){const q=project(LASTVP,[p[0],0.4,p[2]]);if(q){glowAt(q,260,'255,120,60',0.65*(1-k/0.6));glowAt(q,90,'255,240,200',0.8*(1-k/0.6))}}}
    if(tt>=EV.qcharge&&tt<EV.qhit){const q=project(LASTVP,V.add(S_(4,8),[0,2.3,0.3]));if(q)glowAt(q,120+180*ease((tt-EV.qcharge)/0.6),'255,80,60',0.6)}
    if(tt>=EV.promo0&&tt<EV.promo+1.5){const q=project(LASTVP,V.add(S_(4,8),[0,1.5,0]));const a=clamp((tt-EV.promo0)/0.4,0,1)*clamp((EV.promo+1.5-tt)/0.8,0,1);if(q){glowAt(q,600,'255,220,140',0.3*a);glowAt(q,220,'255,255,235',0.35*a)}}}
  if(rn===2&&tt>=EV.rboom&&LASTVP){const q=project(LASTVP,[-48,-30,-5]);const f=Math.exp(-(tt-EV.rboom)*1.0);if(q){glowAt(q,600,'255,150,60',0.7*f);glowAt(q,200,'255,240,200',0.8*f)}}
  // twinkles for pieces sent into the sky
  for(const[t0,p0,v,g,pv]of[[EV.hit1,S_(6,5),[10,13,11],3.5,0.95],[EV.qhit,S_(4,8),[-8,14,10],4,1.3]]){const k=tt-t0;if(k>2.5&&k<3.4&&LASTVP){const q=project(LASTVP,flyer(p0,v,g,2.6,pv));if(q){const a=Math.sin((k-2.5)/0.9*Math.PI);ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(k*3);emoji('✨',0,0,90+60*a,a);ctx.restore()}}}
  // bishop rage
  if(rn===1&&tt>=EV.rage&&tt<EV.bfly){const p=pcHead('bishop',false,0.3);if(p){const k=tt-EV.rage;emoji('💢',p[0]+70+Math.sin(k*20)*6,p[1]-40,80*(0.9+0.15*Math.abs(Math.sin(k*8))),1)}}
  // sleeping black pawn
  if(rn===4&&tt<EV.wake){const p=pcHead('pawn',false,0.25);if(p)for(let i=0;i<3;i++){const k=((tt*0.5)+i/3)%1;emoji('💤',p[0]+40+k*70,p[1]-k*170,46+k*30,clamp(Math.min(k/0.2,(1-k)/0.3),0,1))}}
  // annotation badges
  for(const[t0,t1,kind,wh,sym,col]of BADGES){if(tt>=t0&&tt<t1){if(kind==='pawn'&&wh&&HERO.kind!=='pawn')continue;badge(pcHead(kind,wh,0.35),sym,col,tt-t0)}}
  // KO stars
  if(rn===4&&tt>=EV.koland+0.1&&LASTVP&&HERO.M){const p=project(LASTVP,tp(HERO.M,[0,1.2,0]));if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*100,p[1]-150+Math.sin(a)*32,64)}}
  // slow-mo bars
  {const k=ease((tt-EV.slow0+0.2)/0.25)*(1-ease((tt-EV.slow1)/0.25));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,100*k);ctx.fillRect(0,H-100*k,W,100*k)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.36)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.hit1,0.6,0.25);flash(EV.rland,0.25,0.2);flash(EV.rboom,0.35,0.5,'255,190,120');flash(EV.qhit,0.7,0.3);flash(EV.promo,0.95,0.6,'255,245,215');flash(EV.ephit,0.6,0.25);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
