// ===================== OVERLAYS + FRAME =====================
function scaleLabels(t){if(!SCN||!LASTVP)return;const S=SCN.S,G=SCN.G;const f=H/(2*Math.tan(CAM.fov/2));
  for(const lb of SCN.lab){const p=project(LASTVP,lb.p);if(!p||lb.a<=0.02)continue;const px=f/p[2];ctx.save();ctx.globalAlpha*=lb.a;
    if(lb.k==='x')txt('x',p[0],p[1]+px*0.01,px*0.36,lb.ga>0.2?'#ffffff':COL.c,'center',900,0.12);else txt('−1',p[0],p[1],px*0.17,'#ffffff','center',900,0.12);ctx.restore()}
  // badges under pans + (in)equality sign
  const any=S.items.some(it=>t>it.tin+0.2);if(!any)return;const ka=clamp((t-Math.min(...S.items.map(i=>i.tin))-0.2)/0.4,0,1);
  const bl=project(LASTVP,[G.pL[0],G.pL[1]-0.55,0.6]),br=project(LASTVP,[G.pR[0],G.pR[1]-0.55,0.6]);if(!bl||!br)return;
  const sL=sideText(S,'L',t),sR=sideText(S,'R',t);pill(sL,bl[0],bl[1],40,COL.c,ka);pill(sR,br[0],br[1],40,COL.c,ka);
  const bal=Math.abs(G.th)<0.02;const mx=(bl[0]+br[0])/2,my=(bl[1]+br[1])/2;ctx.save();ctx.globalAlpha*=ka;const c=bal?COL.g:COL.p;ctx.shadowColor=c;ctx.shadowBlur=20;txt(bal?'=':'≠',mx,my,84,c,'center',900,0.1);ctx.restore()}
function chapterCard(t){for(const[l,n,title]of CHAP){const t0=E(l,-0.45),t1=LE(l)+0.55;if(t<t0||t>t1)continue;const k=appear(t,t0,0.4),ko=1-clamp((t-(t1-0.35))/0.35,0,1);const a=Math.min(k,ko);
    ctx.save();ctx.globalAlpha=a*0.78;ctx.fillStyle='#04051a';ctx.fillRect(0,0,W,H);ctx.restore();
    ctx.save();ctx.globalAlpha=a;const sl=(1-easeOut(k))*120;
    txt('KAPITEL '+n,960-sl,400,54,COL.c,'center',900);const s=fitSize(title,1600,130);glowTxt(title,960+sl,540,s,'#ffffff','center',900);
    const w=easeOut(clamp((t-t0-0.2)/0.6,0,1))*Math.min(1500,tw(title,s,900));ctx.fillStyle=COL.y;ctx.shadowColor=COL.y;ctx.shadowBlur=20;ctx.fillRect(960-w/2,630,w,10);ctx.restore()}}
function fitSize(s,maxW,size){const w=tw(s,size,900);return w>maxW?size*maxW/w:size}
function chapterTag(t){let cur=null;for(const c of CHAP)if(t>LE(c[0])+0.5)cur=c;if(!cur||t>E(45,-0.3))return;const a=clamp((t-LE(cur[0])-0.5)/0.4,0,1);ctx.save();ctx.globalAlpha=a*0.9;
  const s='KAPITEL '+cur[1]+' · '+cur[2].toUpperCase();ctx.font=`900 26px ${FONT}`;const w=ctx.measureText(s).width+44;rrect(36,30,w,50,25);ctx.fillStyle='rgba(8,10,36,0.75)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(90,240,255,0.6)';ctx.stroke();
  txt(s,36+w/2,56,26,COL.c,'center',900,false);ctx.restore()}
function vignette(){const g=ctx.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,H*1.05);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,8,0.55)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
function flash(t){for(const c of CUTS){const d=t-c;if(d>-0.18&&d<0.3){const a=d<0?(d+0.18)/0.18:1-d/0.3;ctx.save();ctx.globalAlpha=clamp(a,0,1)*0.85;ctx.fillStyle='#bff8ff';ctx.fillRect(0,0,W,H);ctx.restore()}}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;vignette();scaleLabels(t);
  for(const e of EL){if(t<e.t0||t>e.t1+0.35)continue;const a=1-clamp((t-e.t1)/0.3,0,1);if(a<=0)continue;ctx.save();e.f(t,a);ctx.restore()}
  chapterTag(t);chapterCard(t);flash(t);
  if(t<0.35){ctx.save();ctx.globalAlpha=1-t/0.35;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.restore()}
  if(t>DUR-0.6){ctx.save();ctx.globalAlpha=clamp((t-(DUR-0.6))/0.6,0,1);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.restore()}}
const bc=document.createElement('canvas');bc.width=480;bc.height=270;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(6px)';bctx.drawImage(acc,0,0,480,270);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t=fi/FPS;renderScene(t);actx.setTransform(1,0,0,1,0,0);actx.globalAlpha=1;actx.drawImage(glc,0,0);
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.08) contrast(1.06)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();overlays(t)}
initGL();window.frame=frame;window.NFR=Math.round(DUR*FPS);
