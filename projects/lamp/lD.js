// ================= overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.18?0.55+0.45*easeOut(k/0.18)+Math.sin(k/0.18*Math.PI)*0.16:1}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function pill(s,y,bg,size,al,x,fg){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(x||W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.9,w+68,size*1.8,size*0.5);ctx.fill();ctx.fillStyle=fg||'#ffffff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,4);ctx.restore()}
// captions: groups of up to 3 words, italic, key words green
const KEY=new Set(['RULE','STREETLAMP','NIGHT','SEVENTY','OLD','MAN','KIDS','LAUGH','DARK','NEVER','BACK','STANDING','UNDER','FLICKERS','CLOSER','LAMP','FLICKER','ONCE','TWICE','WINDOW','GONE','BEDROOM','LIGHT','CANDLE','ON']);
const GROUPS=[];{for(const c of VO){let g=null;for(const[w,a,b]of c.w){const clean=w.replace(/["]/g,'');if(!g||g.words.length>=3||g.len+clean.length>14||/[.,!?:]$/.test(g.words[g.words.length-1])){g={words:[],a,b,len:0};GROUPS.push(g)}g.words.push(clean);g.b=b;g.len+=clean.length+1}}}
function caption(t){for(let i=0;i<GROUPS.length;i++){const g=GROUPS[i];const nx=i+1<GROUPS.length?GROUPS[i+1].a:g.b+0.4;if(t>=g.a-0.05&&t<Math.min(nx,g.b+0.45)){
  const ws=g.words.map(w=>w.replace(/[.,:!?]+$/,'').replace(/\.\.\.$/,''));const size=104;ctx.save();ctx.font=`italic 900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;let tot=0;const wd=ws.map(w=>ctx.measureText(w).width);tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-g.a+0.05);ctx.translate(W/2,1250);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const key=KEY.has(w.toUpperCase().replace(/[^A-Z]/g,''));ctx.lineWidth=size*0.2;ctx.strokeStyle='#000';ctx.strokeText(w,x,0);ctx.fillStyle=key?'#86ff5c':'#ffffff';ctx.fillText(w,x,0);x+=wd[j]+sp});ctx.restore();return}}}
function lampGlows(t){const S=scn(t);let list,st,off;if(S==='bed'){list=KL;st=klamps(t);off=K}else{list=VL;st=vlamps(t);off=[0,0,0]}
  list.forEach((l,i)=>{if(st[i]<=0)return;const p=prj([l[0]+off[0],3.62,l[1]+off[2]]);if(!p||p[2]<0.3)return;const r=clamp(1400/p[2],30,520);glowAt(p,r,'255,190,110',0.55);glowAt(p,r*0.25,'255,240,210',0.8)})}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);
  lampGlows(tt);
  if(S==='fb'&&OLDR&&OLDR.tip){const fl=tt<EV.leave?1:1-seg(tt,EV.leave+2.5,EV.fbEnd-0.5);const p=prj(OLDR.tip);if(p&&fl>0){const r=clamp(500/p[2],20,200)*fl;glowAt(p,r,'255,180,90',0.7*fl)}}
  if(GHOSTR){const p=prj(GHOSTR.head);if(p&&p[2]>0.2){const r=clamp(160/p[2],8,90);glowAt([p[0],p[1]-r*0.3],r,'255,90,20',0.55)}}
  if(S==='bed'&&tt>=EV.eyes){const k=tt-EV.eyes;const p=prj(GHOSTR&&GHOSTR.head);if(p)glowAt([p[0],p[1]-20],200,'255,80,20',0.6*clamp(k*6,0,1))}
  // grade: darker vignette
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.22,W/2,H*0.5,H*0.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${S==='fb'?0.6:0.55})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(S==='fb'){// film grain + scratches
    ctx.save();ctx.globalAlpha=0.08;for(let i=0;i<220;i++){const x=hsh(i,Math.floor(tt*24))*W,y=hsh(i+999,Math.floor(tt*24))*H;ctx.fillStyle=i%2?'#fff':'#000';ctx.fillRect(x,y,3,3)}ctx.restore();
    if(hsh(Math.floor(tt*24),5)<0.3){ctx.fillStyle='rgba(255,255,240,0.25)';ctx.fillRect(hsh(Math.floor(tt*24),6)*W,0,2,H)}
    const k=tt-EV.fb;if(k<3.5)pill('70 YEARS AGO',300,'rgba(0,0,0,0.55)',52,clamp(k*4,0,1)*clamp((3.5-k)*3,0,1),W/2,'#f2e6c8')}
  // title + hook
  const titleOn=tt<EV.fb||(tt>=EV.stat&&tt<EV.bed)||tt>=EV.endc;if(titleOn)pill('THE LAMPLIGHTER',250,'rgba(0,0,0,0.82)',60,1,W/2,'#ffffff');
  if(tt<EV.street){const a=clamp(tt*5,0,1);pill('NEVER LET THE LAMPS GO OUT 🕯️',400,'rgba(210,30,30,0.92)',52,a)}
  if(tt>=EV.fbEnd-0.1&&tt<EV.stat+0.4){const k=tt-EV.fbEnd;pill('TODAY',300,'rgba(0,0,0,0.6)',52,clamp(k*4,0,1)*clamp((EV.stat+0.4-tt)*3,0,1))}
  if(S==='bed'&&tt<EV.bed+2.6){const k=tt-EV.bed;pill('LAST NIGHT · 3:07 AM',300,'rgba(0,0,0,0.6)',50,clamp(k*4,0,1)*clamp((EV.bed+2.6-tt)*3,0,1))}
  if(tt<EV.endc)caption(tt);
  // flicker darkening on whole screen during village flickers
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  const blk=(t0,d)=>{const k=tt-t0;if(k>-d&&k<d){ctx.fillStyle=`rgba(0,0,0,${1-Math.abs(k)/d})`;ctx.fillRect(0,0,W,H)}};
  blk(EV.fb,0.25);blk(EV.fbEnd,0.4);blk(EV.bed,0.3);flash(EV.fl[0]+0.8,0.25,0.15,'255,120,60');
  if(tt>=EV.black&&tt<EV.endc){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H)}
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(0,0,0,${1-k/0.25})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const t0=EV.endc;const k=ease((t-t0)/0.4)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(0,0,0,${0.55*k})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);const p=popS(t-t0);ctx.scale(p,p);txt('Comment 🕯️',0,-70,110,'#ffd27a');txt('to keep your lamp on',0,60,fitSize('to keep your lamp on',960,72),'#ffffff');ctx.restore();
  if(t-t0>0.8){ctx.save();ctx.globalAlpha=k*clamp((t-t0-0.8)*3,0,1);txt('👇',W/2,900+Math.abs(Math.sin((t-t0)*4))*22,100,'#fff','center',900,false);pill('PART 2? 👀',1500,'rgba(210,30,30,0.92)',58,1);ctx.restore()}}
