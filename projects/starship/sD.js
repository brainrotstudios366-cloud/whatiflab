// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const [lab,c1,c2,t2,c3,t3]=ROUNDS[rn];const fin=rn===4;const ts=fin?EV.boss:R[rn];const k=t-ts;
  if(!fin||t>=EV.boss){ctx.save();ctx.translate(W/2,250);const pp=popS(k);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cap=c1,bg='rgba(15,10,30,0.66)',ka=k;if(t>=t2){cap=c2;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)';ka=t-t2}if(c3&&t>=t3){cap=c3;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,110,190,0.88)';ka=t-t3}pill(cap,385,bg,60,Math.min(1,ka/0.12))}
  else{if(t>R[4]+0.2)pill('Too easy. 😎',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[4]-0.2)/0.15))}
  const ko=t>=EV.bonk+0.15;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('⚔️ HP',-238,2,44,'#fff','center',900,false);
  const hp=t>=EV.freeze&&t<EV.crack?0.97:1;ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330*hp,34,17);ctx.fill()}
  txt(ko?'K.O.':(hp<1?'97%':'100%'),258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore();
  for(const st of[STATS[rn],STATS2[rn]]){if(st&&t>=st[2]&&t<st[3]){const a=Math.min(1,(t-st[2])/0.2,(st[3]-t)/0.2);ctx.save();ctx.globalAlpha=a;const s=fitSize(st[0],860,50);ctx.font=`900 ${s}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(st[0]).width;
    ctx.translate(W/2,640);const pp=popS(t-st[2]);ctx.scale(pp,pp);ctx.fillStyle='rgba(8,8,26,0.78)';rrect(-w/2-30,-44,w+60,88,24);ctx.fill();ctx.strokeStyle=st[1];ctx.lineWidth=5;ctx.stroke();txt(st[0],0,3,s,st[1],'center',900,false);ctx.restore()}}}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.88+0.12*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['33 ROCKET ENGINES 🔥','#FFB34A'],['THE "CHOPSTICKS" 🥢','#5AF0FF'],['−183 °C FUEL 🧊','#9ad8ff'],['1,400 °C REENTRY ☄️','#FF8A5A'],['…and ??? 🤫','#ffffff']];
  L.forEach(([s,c],i)=>{const kk=clamp((t+0.12-i*0.03)/0.12,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-220+i*74,64,c);ctx.restore()});
  const kv=clamp((t+0.1)/0.15,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,165,72,'#ffffff');ctx.restore()}
  const ks=clamp((t+0.1)/0.15,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,270);const p2=popS(t+0.3);ctx.scale(p2,p2);txt('ONE SAMURAI ⚔️',0,0,fitSize('ONE SAMURAI ⚔️',980,112),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.0){ctx.save();ctx.globalAlpha=a*clamp((t-1.0)/0.3,0,1);pill('The biggest rocket ever 🚀 Who wins?',1640,'rgba(15,10,30,0.7)',56);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('What should he',0,-110,86,'#ffffff');txt('fight NEXT? ⚔️',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('Volcano 🌋   Black hole 🕳️   Lightning ⚡',W/2,1080,50,'#ffffff','center',800);ctx.restore()}
function swordTrail(t){if(!LASTVP)return;const N=9,dt=0.012;const P=[];for(let i=0;i<N;i++){const S=i===0?LASTSAM:samItems(t-i*dt);if(!S.tip){break}const a=project(LASTVP,S.base),b=project(LASTVP,S.tip);if(!a||!b)break;P.push([a,b])}
  if(P.length<2)return;for(let i=1;i<P.length;i++){if(Math.hypot(P[i][1][0]-P[i-1][1][0],P[i][1][1]-P[i-1][1][1])>260||Math.hypot(P[i][0][0]-P[i-1][0][0],P[i][0][1]-P[i-1][0][1])>200)return}let sp=0;for(let i=1;i<P.length;i++)sp+=Math.hypot(P[i][1][0]-P[i-1][1][0],P[i][1][1]-P[i-1][1][1]);sp/=P.length-1;const al=clamp((sp-12)/50,0,1);if(al<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<P.length-1;i++){const f=1-i/(P.length-1);ctx.fillStyle=`rgba(${200+55*f|0},${230+25*f|0},255,${0.75*al*f})`;ctx.beginPath();ctx.moveTo(P[i][0][0],P[i][0][1]);ctx.lineTo(P[i][1][0],P[i][1][1]);ctx.lineTo(P[i+1][1][0],P[i+1][1][1]);ctx.lineTo(P[i+1][0][0],P[i+1][0][1]);ctx.closePath();ctx.fill()}ctx.restore()}
function slashLine(cx,cy,ang,k,wid,col){if(k<0||k>1)return;const L=2600;const w=wid*Math.sin(k*Math.PI)*(1-k*0.5);const dx=Math.cos(ang),dy=Math.sin(ang);const ext=easeOut(clamp(k/0.25,0,1));ctx.save();ctx.globalCompositeOperation='screen';
  const x0=cx-dx*L*ext,y0=cy-dy*L*ext,x1=cx+dx*L*ext,y1=cy+dy*L*ext;ctx.strokeStyle=`rgba(${col},${0.35*(1-k)})`;ctx.lineWidth=w*4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${0.95*(1-k*0.7)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function word(s,p,size,col,k,rot){if(k<0||k>1)return;const sc=k<0.15?0.5+0.5*easeOut(k/0.15)+Math.sin(k/0.15*Math.PI)*0.25:1;ctx.save();ctx.globalAlpha=k>0.75?(1-k)/0.25:1;ctx.translate(p[0],p[1]);ctx.rotate(rot||0);ctx.scale(sc,sc);txt(s,0,0,size,col);ctx.restore()}
function P2(p){return LASTVP&&p?project(LASTVP,p):null}
const onS=p=>p&&p[0]>-50&&p[0]<W+50&&p[1]>-50&&p[1]<H+50;
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  if(LASTSAM&&LASTSAM.tip)swordTrail(tt);
  const head=LASTSAM&&LASTSAM.head?P2(LASTSAM.head):null;
  if(rn===0){if(tt>=EV.ign&&tt<EV.ign+1.4){const p=P2([PAD[0],18,PAD[2]]);if(onS(p))word('IGNITION 🔥',[W/2,p[1]-420],110,'#FFB34A',(tt-EV.ign)/1.4,-0.05)}
    {const k=(tt-EV.cut+0.05)/0.45;if(head&&k>0&&k<1)slashLine(head[0],head[1]+150,-1.45,k,26,'255,220,160')}
    if(head)word('SPLIT!',[W/2,Math.max(820,head[1]-260)],130,'#ffd84a',(tt-EV.hit-0.1)/1.1,-0.08)}
  if(rn===1){const tp_=P2(LASTSAM.chopTip);if(tp_&&tt>=EV.catch-0.05)word('CLICK.',[tp_[0]+140,tp_[1]+60],96,'#5AF0FF',(tt-EV.catch+0.05)/1.1,0.1);
    if(tp_&&tt>=EV.catch&&tt<EV.catch+0.7)glowAt(tp_,260*(1-(tt-EV.catch)/0.7)+40,'255,255,230',0.9*(1-(tt-EV.catch)/0.7));
    const b=P2(BOOSTB);if(b&&tt>=EV.bdesc+0.5&&tt<EV.catch-2.2&&onS(b)){const s=1+0.06*Math.sin(tt*9);ctx.save();ctx.strokeStyle='rgba(90,240,255,0.95)';ctx.lineWidth=7;ctx.beginPath();ctx.arc(b[0],b[1],120*s,0,TAU2);ctx.stroke();ctx.restore()}
    if(head&&tt>=EV.catch+1.6&&tt<EV.jeal){const k=tt-EV.catch-1.6;const sc=1+0.06*Math.sin(tt*9);ctx.save();ctx.strokeStyle='rgba(255,216,74,0.95)';ctx.lineWidth=7;ctx.beginPath();ctx.arc(head[0],head[1]+20,70*sc,0,TAU2);ctx.stroke();ctx.restore();word('him 👆',[head[0],head[1]+150],56,'#ffd84a',Math.min(0.7,k/1.0),0)}
    if(head&&tt>=EV.jeal+0.2)word('🥢😎',[head[0]+150,head[1]-120],100,'#fff',(tt-EV.jeal-0.2)/2.2,0)}
  if(rn===2){const ic=P2(ICEP);if(ic&&tt>=EV.freeze&&tt<EV.crack)word('🥶',[ic[0]+170,ic[1]-260],110,'#fff',(tt-EV.freeze)/(EV.crack-EV.freeze),0);
    if(head){const k=(tt-EV.crack)/0.45;if(k>0&&k<1)slashLine(head[0],head[1]+120,0.12,k,24,'200,240,255');word('CRACK!',[W/2,Math.max(800,head[1]-240)],130,'#9ad8ff',(tt-EV.crack)/1.0,-0.08);
      if(tt>=EV.ice+0.3)word('😋🍧',[head[0]+150,head[1]-100],100,'#fff',(tt-EV.ice-0.3)/2.2,0)}}
  if(rn===3){const s=P2(SHIPC);if(s&&tt<EV.slice-1.2&&onS(s)){glowAt(s,220,'255,140,150',0.45)}
    {const k=(tt-EV.slice+0.03)/0.45;const p=P2(S1);if(p&&k>0&&k<1)slashLine(p[0],p[1],-1.5,k,30,'255,200,180');if(p)word('SLICE!',[W/2,Math.max(760,p[1]-300)],140,'#ffd84a',(tt-EV.slice)/1.1,-0.08)}
    if(tt>=EV.boom)word('KABOOM 💥',[W/2,860],120,'#FF8A5A',(tt-EV.boom)/1.3,0.06)}
  if(rn===4||tt>=R[5]){const p=P2(TILEP);if(false){const s=1+0.08*Math.sin(tt*10);ctx.save();ctx.strokeStyle='rgba(255,90,90,0.95)';ctx.lineWidth=7;ctx.beginPath();ctx.arc(p[0],p[1],95*s,0,TAU2);ctx.stroke();ctx.restore()}
    if(p&&tt>=EV.whistle&&tt<EV.bonk&&onS(p)){for(let i=0;i<2;i++){const ph=(tt*1.3+i*0.5)%1;ctx.save();ctx.globalAlpha=Math.sin(ph*Math.PI)*0.9;txt('wheee',p[0]+(i?-1:1)*(110+ph*40),p[1]-50-ph*50,40,'#ffffff','center',900);ctx.restore()}}
    if(head&&tt>=EV.look&&tt<EV.bonk-0.4)word('?',[head[0]+110,head[1]-150],110,'#ffd84a',(tt-EV.look)/(EV.bonk-0.4-EV.look),0);
    if(head){word('BONK!',[head[0],Math.max(800,head[1]-200)],140,'#ffd84a',(tt-EV.bonk)/0.9,-0.1);{const k=(tt-EV.bonk)/0.35;if(k>=0&&k<1)emoji('💥',head[0],head[1]-30,170*(0.7+0.3*easeOut(k*3)),1-k)}
      if(tt>=EV.floor+0.4)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',head[0]+Math.cos(a)*110,head[1]-40+Math.sin(a)*35,70)}}
    if(p&&tt>=EV.floor+1.4&&tt<R[5])word('🖤 1 – 0',[clamp(p[0],300,W-300),Math.max(820,p[1]-120)],64,'#FF5A8A',clamp((tt-EV.floor-1.4)/5,0,0.74),0);
    {const k=ease((tt-EV.bonk+0.2)/0.25)*(1-ease((tt-EV.floor-0.1)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.18);flash(EV.ign,0.35,0.3,'255,200,140');flash(EV.hit,0.45,0.3,'255,190,120');flash(EV.catch,0.4,0.2);flash(EV.freeze,0.4,0.25,'200,235,255');flash(EV.crack,0.45,0.2,'220,245,255');
  flash(EV.slice,0.55,0.25);flash(EV.boom,0.5,0.4,'255,170,90');flash(EV.boss,0.35,0.2,'255,90,90');flash(EV.bonk,0.4,0.15);flash(EV.floor,0.45,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
