function bubble(s,x,y,size,bg,fg,al,tailDir){size=fitSize(s,760,size);ctx.save();ctx.globalAlpha=al;ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;x=clamp(x,w/2+60,W-w/2-60);
  ctx.fillStyle=bg;rrect(x-w/2-30,y-size*0.85,w+60,size*1.7,size*0.6);ctx.fill();if(tailDir){ctx.beginPath();ctx.moveTo(x+tailDir*40,y+size*0.8);ctx.lineTo(x+tailDir*80,y+size*1.5);ctx.lineTo(x+tailDir*90,y+size*0.8);ctx.fill()}
  txt(s,x,y+3,size,fg,'center',900,false);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  // planet halos
  if(LASTVP)for(const P of SKYPL){const c=project(LASTVP,P.p),e=project(LASTVP,V.add(P.p,[P.r,0,0]));if(!c||!e)continue;const rp=Math.hypot(e[0]-c[0],e[1]-c[1]);if(!(rp>1))continue;const col=PL_HALO[P.key].map(x=>x*255|0);
    ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],rp*0.92,c[0],c[1],rp*(P.key==='ear'?4:1.3));g.addColorStop(0,`rgba(${col},${0.5*P.a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(c[0]-rp*4.2,c[1]-rp*4.2,rp*8.4,rp*8.4);ctx.restore()}
  if(LASTSAM&&LASTSAM.tip)swordTrail(tt);
  const head=LASTSAM&&LASTSAM.head?P2(LASTSAM.head):null;
  if(rn===0){word('SANDSTORM! 🌪️',[W/2,820],104,'#FFB34A',(tt-EV.plume-0.1)/1.5,-0.05);
    if(tt>=EV.plume){const a=clamp((tt-EV.plume)/1.2,0,1)*clamp((R[1]-tt)/0.6,0,1);ctx.fillStyle=`rgba(200,140,70,${0.16*a})`;ctx.fillRect(0,0,W,H)}
    if(LASTSAM.umbC&&tt>=EV.snow&&tt<EV.cool){const u=P2(LASTSAM.umbC);if(u)for(let i=0;i<3;i++){const ph=(tt*1.6+i/3)%1;ctx.save();ctx.globalAlpha=Math.sin(ph*Math.PI);txt(['tsss','tik','shhh'][i],u[0]+(i-1)*200,u[1]-80-ph*60,46,'#e8c080','center',900);ctx.restore()}}
    if(head&&tt>=EV.cool+0.3)word('☂️😎',[head[0]+170,head[1]-150],100,'#fff',(tt-EV.cool-0.3)/2.4,0)}
  if(rn===1){for(let i=0;i<3;i++){const k=(tt-CUTT[i]+0.03)/0.42;const p=P2(CHP[i]);if(p&&k>0&&k<1)slashLine(p[0],p[1],[-0.5,0.35,-1.35][i],k,26,'200,240,255');
      if(p)word(['SLICE!','DICE!','CRUNCH!'][i],[clamp(p[0],300,W-300),Math.max(760,p[1]-220)],[118,118,130][i],['#ffd84a','#5AF0FF','#7DFF9A'][i],(tt-CUTT[i])/0.85,-0.08+i*0.06)}
    if(head&&tt>=EV.ice+0.3)word('😎💎',[head[0]+150,head[1]-110],100,'#fff',(tt-EV.ice-0.3)/2.4,0)}
  if(rn===2){const w=P2(TRK.WALL);if(w&&tt>EV.wall+0.6&&tt<EV.pass-0.25){const a=clamp((tt-EV.wall-0.6)/0.4,0,1);ctx.save();ctx.globalAlpha=a;const s=1+0.05*Math.sin(tt*8);ctx.translate(W/2,clamp(w[1]+160,700,1450));ctx.scale(s,s);txt('7 LIGHT-YEARS',0,0,120,'#FF9A4A');ctx.restore()}
    {const k=tt-EV.pass;if(k>=-0.25&&k<0.9){const a=k<0?(k+0.25)/0.25:1-k/0.9;ctx.fillStyle=`rgba(255,150,60,${0.5*a})`;ctx.fillRect(0,0,W,H)}}
    if(tt>=EV.pass)word('WHOOSH',[W/2,820],120,'#ffc27a',(tt-EV.pass)/1.0,-0.06);
    if(head&&tt>=EV.meh+0.1)word('…😐',[head[0]+160,head[1]-140],100,'#fff',Math.min(0.74,(tt-EV.meh-0.1)/3),0)}
  if(rn===3){const e=P2(EARTHP);if(e&&onS(e)&&tt<EV.send+3.6){const a=clamp((tt-R[3]-0.4)/0.4,0,1);ctx.save();ctx.globalAlpha=a;ctx.restore();
      bubble('🌌 MoM-z14 · light left it 13.5 billion yrs ago',e[0],Math.max(820,e[1]+110),42,'rgba(8,8,26,0.8)','#ff8a7a',a,0)}
    const ph=LASTSAM&&LASTSAM.phone?P2(LASTSAM.phone):null;
    if(ph&&tt>=EV.send-0.6&&tt<EV.nap){bubble(tt<EV.send?'yo galaxy 👋':'yo galaxy 👋  ✓ sent',ph[0]-120,Math.max(800,ph[1]-170),54,'rgba(40,140,255,0.92)','#fff',clamp((tt-EV.send+0.6)/0.2,0,1),1)}
    if(tt>=EV.send+0.6&&tt<EV.react+1.6){const k=clamp((tt-EV.send-0.6)/(EV.reply-EV.send-0.6),0,1);const yrs=Math.floor(Math.pow(10,1+9.5*Math.pow(k,0.8)));const lab=k>=1?'♾️ NEVER':(yrs>=1e9?(yrs/1e9).toFixed(1)+' billion yrs':yrs>=1e6?(yrs/1e6).toFixed(0)+' million yrs':yrs.toLocaleString('en-US')+' yrs');
      ctx.save();const a=clamp((tt-EV.send-0.6)/0.2,0,1);ctx.globalAlpha=a;ctx.fillStyle='rgba(8,8,26,0.8)';rrect(W/2-270,1440,540,110,30);ctx.fill();ctx.strokeStyle=k>=1?'#FF5A8A':'#5AF0FF';ctx.lineWidth=5;ctx.stroke();txt(k>=1?lab:`⏳ ${lab}`,W/2,1497,fitSize('⏳ 10.0 billion yrs',480,60),k>=1?'#FF5A8A':'#ffffff','center',900,false);ctx.restore()}
    if(head&&tt>=EV.nap+0.4&&tt<EV.reply-0.2)for(let i=0;i<3;i++){const p=((tt-EV.nap)*0.8+i/3)%1;ctx.save();ctx.globalAlpha=Math.sin(p*Math.PI);txt('z',head[0]+70+p*90,head[1]-60-p*170,40+p*40,'#9ad8ff');ctx.restore()}
    if(ph&&tt>=EV.reply){bubble('❌ Not delivered. Ever.',ph[0]-60,Math.max(800,ph[1]-190),58,'rgba(235,235,245,0.96)','#d02a4a',clamp((tt-EV.reply)/0.15,0,1),1);
      if(tt>=EV.react+0.2)pill('Space expands faster than his text can travel 🚀',1660,'rgba(200,40,70,0.9)',46,clamp((tt-EV.react-0.2)/0.3,0,1));}}
  if(rn===4||tt>=R[5]){const hp=P2(HITP);
    if(HITS&&tt<EV.ray&&tt>EV.ray-0.5){}
    if(hp&&tt>=EV.ray)word('TINK! 💥',[clamp(hp[0]+120,300,W-300),clamp(hp[1]-180,760,1500)],110,'#ffb070',(tt-EV.ray)/0.9,0.08);
    if(tt>=EV.flip&&tt<EV.thrust+0.4){const k=tt-EV.flip;const a=clamp(k/0.1,0,1)*clamp((EV.thrust+0.4-tt)/0.3,0,1);const y=1000;const bit=k<0.5?'0':'1';
      ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(4,4,16,0.82)';rrect(W/2-330,y-120,660,240,40);ctx.fill();ctx.strokeStyle='#FF5A8A';ctx.lineWidth=6;ctx.stroke();
      {const hp=P2(HITP);if(hp&&onS(hp)&&k>=0.5){ctx.strokeStyle='#FF5A8A';ctx.lineWidth=7;ctx.beginPath();ctx.arc(hp[0],hp[1],60+8*Math.sin(k*12),0,TAU2);ctx.stroke()}}
      txt(k<0.5?'🔍 ZOOM: mirror segment C3':'💥 DENT! (it really happened, 2022)',W/2,y-34,fitSize('💥 DENT! (it really happened, 2022)',600,48),k<0.5?'#FFD84A':'#FF5A8A','center',900,false);
      txt(k<0.5?'hit by ONE speck of dust':'the samurai lost his balance…',W/2,y+50,44,'#ffffff','center',800,false);ctx.restore()}
    if(tt>=EV.thrust&&tt<EV.fling){const v=P2([0.8,-0.5,0.3]);if(v)word('PSSHHH',[clamp(v[0],300,W-300),v[1]+120],90,'#ffffff',(tt-EV.thrust)/1.4,0.1);if(head&&tt>EV.thrust+0.7)word('?!',[head[0]+120,head[1]-150],110,'#ffd84a',(tt-EV.thrust-0.7)/(EV.fling-EV.thrust-0.7),0)}
    if(tt>=EV.fling)word('YEEEET',[W/2,820],140,'#ffd84a',(tt-EV.fling)/1.2,-0.08);
    if(head&&tt>=EV.ko){for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',head[0]+Math.cos(a)*110,head[1]-40+Math.sin(a)*35,70)}}
    if(tt>=EV.ko+1.0&&tt<R[5])word('🪨 1 – 0 🥷',[W/2,1500],64,'#ffb070',clamp((tt-EV.ko-1.0)/5,0,0.74),0);
    {const k=ease((tt-EV.fling+0.1)/0.25)*(1-ease((tt-EV.ko-0.6)/0.4));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.18);flash(EV.plume,0.3,0.35,'240,190,120');for(const c of CUTT)flash(c,0.35,0.18,'220,245,255');flash(EV.pass,0.6,0.35,'255,180,100');flash(EV.reply,0.3,0.15,'255,90,120');
  flash(EV.ray,0.6,0.25,'255,210,160');flash(EV.boss,0.35,0.2,'255,90,90');flash(EV.fling,0.4,0.15);flash(EV.ko,0.3,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
