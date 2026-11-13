// ================= overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.18?0.55+0.45*easeOut(k/0.18)+Math.sin(k/0.18*Math.PI)*0.16:1}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function pill(s,y,bg,size,al,x,fg){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(x||W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.9,w+68,size*1.8,size*0.5);ctx.fill();ctx.fillStyle=fg||'#ffffff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,4);ctx.restore()}
// captions: groups of up to 3 words, italic, key words green
const KEY=new Set(['TWELVE','THIRTEEN','THIRTEENTH','ELEVEN','MIDNIGHT','LIT','OPEN','GONE','WAVING','WINDOW','MISSING','SLEEP','HOUSES','HOUSE','COUNT','COUNTED','RULE','STREETLAMP','NIGHT','SEVENTY','OLD','MAN','KIDS','LAUGH','DARK','NEVER','BACK','STANDING','UNDER','FLICKERS','CLOSER','LAMP','FLICKER','ONCE','TWICE','WINDOW','GONE','BEDROOM','LIGHT','CANDLE','ON']);
const GROUPS=[];{for(const c of VO){let g=null;for(const[w,a,b]of c.w){const clean=w.replace(/["]/g,'');if(!g||g.words.length>=3||g.len+clean.length>14||/[.,!?:]$/.test(g.words[g.words.length-1])){g={words:[],a,b,len:0};GROUPS.push(g)}g.words.push(clean);g.b=b;g.len+=clean.length+1}}}
function caption(t){for(let i=0;i<GROUPS.length;i++){const g=GROUPS[i];const nx=i+1<GROUPS.length?GROUPS[i+1].a:g.b+0.4;if(t>=g.a-0.05&&t<Math.min(nx,g.b+0.45)){
  const ws=g.words.map(w=>w.replace(/[.,:!?]+$/,'').replace(/\.\.\.$/,''));const size=104;ctx.save();ctx.font=`italic 900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;let tot=0;const wd=ws.map(w=>ctx.measureText(w).width);tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-g.a+0.05);ctx.translate(W/2,1250);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const key=KEY.has(w.toUpperCase().replace(/[^A-Z]/g,''));ctx.lineWidth=size*0.2;ctx.strokeStyle='#000';ctx.strokeText(w,x,0);ctx.fillStyle=key?'#86ff5c':'#ffffff';ctx.fillText(w,x,0);x+=wd[j]+sp});ctx.restore();return}}}
function numPop(o){const p=prj(o.p);if(!p||p[2]<0.3)return;const s=popS(o.k);const r=(o.red?62:48)*s;ctx.save();ctx.translate(p[0],p[1]-30);ctx.fillStyle=o.red?'rgba(210,25,25,0.95)':'rgba(255,255,255,0.95)';ctx.beginPath();ctx.arc(0,0,r,0,TAU2);ctx.fill();ctx.lineWidth=6;ctx.strokeStyle='#000';ctx.stroke();
  ctx.font=`900 ${Math.round(r*(o.label.length>2?0.8:1.05))}px Inter`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=o.red?'#fff':'#111';ctx.fillText(o.label,0,3);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);
  // lamp glows
  if(S!=='day'&&S!=='fbd')KLAMPS.forEach(l=>{const p=prj([l[0],3.62,l[1]]);if(!p||p[2]<0.3)return;const r=clamp(1300/p[2],30,420);glowAt(p,r,'255,190,110',0.45);glowAt(p,r*0.25,'255,240,210',0.7)});
  if(show13(tt)&&S!=='day'&&S!=='fbd'){for(const sd of[-1,1]){const p=prj(winPt(H13,5.2,sd,0));if(p&&p[2]>0.3)glowAt(p,clamp(2600/p[2],40,600),'255,40,20',0.35)}const p=prj(doorPt(H13,5.2,0));if(p&&p[2]>0.3)glowAt(p,clamp(2200/p[2],40,500),'255,30,10',0.3)}
  if(KIDR&&tt>=EV.cut){const p=prj(KIDR.head);if(p)glowAt(p,260,'255,40,20',0.25)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.22,W/2,H*0.5,H*0.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${S==='day'?0.4:0.55})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(isFB(tt)){ctx.save();ctx.globalAlpha=0.08;for(let i=0;i<220;i++){const x=hsh(i,Math.floor(tt*24))*W,y=hsh(i+999,Math.floor(tt*24))*H;ctx.fillStyle=i%2?'#fff':'#000';ctx.fillRect(x,y,3,3)}ctx.restore();if(hsh(Math.floor(tt*24),5)<0.3){ctx.fillStyle='rgba(255,255,240,0.25)';ctx.fillRect(hsh(Math.floor(tt*24),6)*W,0,2,H)}}
  for(const o of countPops(tt))numPop(o);
  const lab=(t0,t1,s,y)=>{if(tt>=t0&&tt<t1){pill(s,y||300,'rgba(0,0,0,0.62)',50,clamp((tt-t0)*4,0,1)*clamp((t1-tt)*3,0,1),W/2,'#f2e6c8')}};
  lab(EV.mid,EV.door,'🕛 12:00 AM');lab(EV.fb,EV.fb+3,'50 YEARS AGO');lab(EV.fbm,EV.fbm+2.8,'THE NEXT MORNING');lab(EV.kid,EV.kid+2.6,'LAST NIGHT');lab(EV.morn,EV.morn+2.4,'THIS MORNING');
  const titleOn=tt<EV.count2+3||tt>=EV.endc;if(titleOn)pill('THE 13TH HOUSE',250,'rgba(0,0,0,0.82)',60,1,W/2,'#ffffff');
  if(tt<EV.count2){pill('COUNT THE HOUSES 👀',400,'rgba(210,30,30,0.92)',52,clamp(tt*5,0,1))}
  if(tt<EV.endc)caption(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  const blk=(t0,d)=>{const k=tt-t0;if(k>-d&&k<d){ctx.fillStyle=`rgba(0,0,0,${1-Math.abs(k)/d})`;ctx.fillRect(0,0,W,H)}};
  blk(EV.fb,0.3);blk(EV.fbm,0.3);blk(EV.fbEnd,0.3);blk(EV.kid,0.3);blk(EV.morn,0.35);flash(EV.appear+1.0,0.3,0.2,'255,60,40');flash(EV.c13,0.35,0.2,'255,40,30');flash(EV.cut,0.6,0.3,'255,40,30');
  if(tt>=EV.black&&tt<EV.endc){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H)}
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(0,0,0,${1-k/0.25})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const t0=EV.endc;const k=ease((t-t0)/0.4)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(0,0,0,${0.55*k})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);const p=popS(t-t0);ctx.scale(p,p);txt('How many houses',0,-70,fitSize('How many houses',960,96),'#ffffff');txt('did YOU count? 🏚️',0,50,fitSize('did YOU count? 🏚️',960,96),'#ff5a4a');ctx.restore();
  if(t-t0>0.8){ctx.save();ctx.globalAlpha=k*clamp((t-t0-0.8)*3,0,1);txt('👇',W/2,900+Math.abs(Math.sin((t-t0)*4))*22,100,'#fff','center',900,false);pill('PART 2? 👀',1500,'rgba(210,30,30,0.92)',58,1);ctx.restore()}}
