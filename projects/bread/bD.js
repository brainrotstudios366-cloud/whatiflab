// ================= overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.18?0.55+0.45*easeOut(k/0.18)+Math.sin(k/0.18*Math.PI)*0.16:1}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function pill(s,y,bg,size,al,x){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(x||W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
// white speech sign with black border + tail (like the trend videos)
function sign(s,x,y,size,k,tail,col){if(k<=0)return;size=fitSize(s,900,size);ctx.save();ctx.translate(x,y);const p=popS(k);ctx.scale(p,p);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;const bw=w+size*1.2,bh=size*1.75;
  ctx.fillStyle='rgba(0,0,0,0.35)';rrect(-bw/2+6,-bh/2+10,bw,bh,size*0.5);ctx.fill();ctx.fillStyle='#ffffff';ctx.strokeStyle='#111';ctx.lineWidth=size*0.12;rrect(-bw/2,-bh/2,bw,bh,size*0.5);ctx.fill();ctx.stroke();
  if(tail){ctx.beginPath();ctx.moveTo(-size*0.5*tail,bh/2-2);ctx.lineTo(-size*0.95*tail,bh/2+size*0.55);ctx.lineTo(size*0.1*tail,bh/2-2);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillRect(-size*0.5*tail-2,bh/2-size*0.14,size*0.62,size*0.14)}
  ctx.fillStyle=col||'#111';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,size*0.06);ctx.restore()}
function bigWord(s,y,size,k,col){if(k<=0)return;size=fitSize(s,980,size);ctx.save();ctx.translate(W/2,y);const p=popS(k);ctx.scale(p,p);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  ctx.lineWidth=size*0.26;ctx.strokeStyle='#000';ctx.strokeText(s,0,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=14;ctx.shadowOffsetY=6;ctx.fillStyle=col||'#ffffff';ctx.fillText(s,0,0);ctx.restore()}
const HOT=new Set(['LEO','MAX','BREAD','MUD','NIGHT','FAILED','AGAIN','AGAIN.','GOLDEN','BAKERY','WORLDWIDE','SILENT','NEVER','LAUGH','JOB','FIVE','YEARS','LATER','HUNDRED','TWO']);
function caption(t){for(const c of VO){for(let i=0;i<c.w.length;i++){const[w,a,b]=c.w[i];const nx=i+1<c.w.length?c.w[i+1][1]:b+0.3;if(t>=a-0.04&&t<Math.max(nx,b+0.05)){const s=w.replace(/["]/g,'').replace(/[.,:!?]+$/,'').toUpperCase();if(!s)return;
      const key=s.replace(/[^A-Z]/g,'');const col=HOT.has(key)?'#ffd84a':'#ffffff';bigWord(s,1290,150,t-a+0.04,col);return}}}}
function sunRays(t,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<6;i++){const x=W*(-0.1+i*0.24)+Math.sin(t*0.3+i)*30;const g=ctx.createLinearGradient(x,0,x+500,H*0.7);g.addColorStop(0,`rgba(255,250,220,${0.16*a})`);g.addColorStop(1,'rgba(255,250,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+70+i*8,0);ctx.lineTo(x+600,H*0.75);ctx.lineTo(x+420,H*0.75);ctx.closePath();ctx.fill()}ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);
  const day=S==='village'&&!(tt>=EV.night&&tt<EV.kitch);sunRays(tt,day?1:0);
  // laughter
  if(tt<EV.laugh1){VR.forEach(([k,r],i)=>{const ph=(tt*1.8+i*0.37)%1;const p=prj(r.top);if(p&&i<6)bubbleTxt(['HAHA','LOL','HAHAHA','😂','HAHA','🤣'][i],p[0]+(i%2?40:-40),p[1]-40-ph*40,i%3==2?60:52,Math.sin(Math.PI*Math.min(1,ph*1.3)))})}
  if(tt>=EV.laugh1&&tt<EV.dad1){const p=prj(DADR&&DADR.top);if(p)sign('Fresh bread! 🥖',clamp(p[0]-60,320,760),p[1]-110,54,tt-EV.laugh1-0.2,1)}
  if(tt>=EV.swipe+0.25&&tt<EV.mock){VR.length;const p=prj(F1R&&F1R.top);if(p)bubbleTxt('HAHAHA 😂',p[0],p[1]-60,52,1)}
  if(tt>=EV.mock&&tt<EV.sad){const p=prj(MAXR&&MAXR.top);if(p)sign('BREAD BOY 🤡',clamp(p[0]+40,330,750),p[1]-110,64,tt-EV.mock-0.05,1)}
  if(tt>=EV.splat&&tt<EV.mock){const p=prj(PUD);if(p)bubbleTxt('*SPLAT*',p[0],p[1]-120,64,clamp((tt-EV.splat)*5,0,1),'#c8a070')}
  if(S==='kitchen'){EV.fail.forEach((f,i)=>{if(tt>=f&&tt<EV.gold-0.4){const p=prj([K[0]-0.45+i*0.45,1.3,1.45]);if(p)emoji('❌',p[0],p[1]-60,90*popS(tt-f))}});
    if(tt>=EV.gold+0.1){const p=prj([K[0]+0.4,1.3,1.45]);if(p){glowAt(p,300,'255,220,120',0.6);for(let i=0;i<5;i++){const a=tt*2+i*1.26;emoji('✨',p[0]+Math.cos(a)*170,p[1]-40+Math.sin(a)*90,56)}sign('PERFECT ✨',W/2,560,70,tt-EV.gold-0.2,0)}}}
  if(tt>=EV.later&&tt<EV.truck){const k=tt-EV.later;sign('5 YEARS LATER ⏳',W/2,640,84,k,0)}
  if(tt>=EV.shops&&tt<EV.door)sign('200 SHOPS WORLDWIDE 🌍',W/2,640,62,tt-EV.shops,0);
  if(tt>=EV.lb&&tt<EV.shops)sign("LEO'S BAKERY 🥖",W/2,640,72,tt-EV.lb,0);
  if(tt>=EV.out+0.9&&tt<EV.silent){const p=prj(LEOR&&LEOR.top);if(p){pill('+1000 AURA 😎',p[1]-90,'rgba(240,170,20,0.92)',58,clamp((tt-EV.out-0.9)*6,0,1),p[0]);for(let i=0;i<4;i++){const a=tt*3+i*1.57;emoji('✨',p[0]+Math.cos(a)*160,p[1]+120+Math.sin(a)*120,48)}}}
  if(tt>=EV.silent&&tt<EV.saw){for(let i=0;i<2;i++){const ph=(tt*1.3+i*0.5)%1;emoji('🦗',260+i*560,900+Math.sin(ph*TAU2)*20,80,Math.sin(Math.PI*ph))}bubbleTxt('*cricket noises*',W/2,700,56,clamp((tt-EV.silent)*4,0,1),'#ffffff')}
  if(tt>=EV.turn+0.4&&tt<EV.cartPan){const p=prj(LEOR&&LEOR.top);if(p)bubbleTxt('!',p[0],p[1]-50,140*popS(tt-EV.turn-0.4),1,'#ff4a4a')}
  if(tt>=EV.reveal&&tt<EV.cant){const p=prj(MAXR&&MAXR.top);if(p)emoji('😳',p[0]+170,p[1]-20,110*popS(tt-EV.reveal))}
  if(tt>=EV.bought+0.15&&tt<EV.said){const p=prj([5.55,1.3,3.35]);if(p)emoji('💰',p[0],p[1]-80,110*popS(tt-EV.bought-0.15))}
  if(tt>=EV.fly+0.8&&tt<EV.never){const p=prj([5.8,2.2,3.6]);if(p)sign('SOLD OUT ✅',p[0],p[1]-60,60,tt-EV.fly-0.8,0)}
  if(tt>=EV.away+0.3&&tt<EV.endc){pill('Part 2? 👀',560,'rgba(15,10,30,0.7)',62,clamp((tt-EV.away-0.3)*4,0,1))}
  // captions
  caption(tt);
  // series tag
  if(tt<3.2){const a=clamp((3.2-tt)/0.4,0,1)*clamp(tt*5,0,1);pill('The Bread Boy 🥖  Part 1',300,'rgba(200,60,40,0.9)',54,a)}
  // vignette
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.32)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  const blk=(t0,d)=>{const k=tt-t0;if(k>-d&&k<d){ctx.fillStyle=`rgba(0,0,0,${1-Math.abs(k)/d})`;ctx.fillRect(0,0,W,H)}};
  blk(EV.night,0.3);blk(EV.kitch,0.25);flash(EV.later,0.9,0.5);flash(EV.reveal,0.5,0.25);flash(EV.gold,0.5,0.3,'255,230,150');flash(EV.never,0.3,0.2);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function bubbleTxt(s,x,y,size,al,col){ctx.save();ctx.globalAlpha=clamp(al,0,1);ctx.translate(x,y);txt(s,0,0,size,col||'#ffffff');ctx.restore()}
function drawEnd(t){const t0=EV.endc;const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.62*k})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;const pop=popS(t-t0);ctx.translate(W/2,640);ctx.scale(pop,pop);txt('Should Leo give',0,-100,fitSize('Should Leo give',960,96),'#ffffff');txt('Max a job? 💼',0,10,104,'#ffd84a');ctx.restore();
  const kk=t-t0-0.5;if(kk>0){ctx.save();ctx.globalAlpha=k;pill('✅ YES',960,'rgba(40,160,70,0.92)',70*popS(kk),1,W/2-210);pill('❌ NO',960,'rgba(200,40,40,0.92)',70*popS(kk-0.12),1,W/2+210);ctx.restore()}
  if(t-t0>1.0){ctx.save();ctx.globalAlpha=k*clamp((t-t0-1.0)*3,0,1);txt('👇',W/2,1110+Math.abs(Math.sin((t-t0)*5))*24,110,'#fff','center',900,false);txt('Follow for Part 2 👀',W/2,1500,60,'#ffffff');ctx.restore()}}
