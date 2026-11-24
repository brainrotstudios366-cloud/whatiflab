// ===================== FRAME =====================
CAM.sort((a,b)=>a[0]-b[0]);
function camY(t){let y=0;for(const[tk,yk]of CAM){if(t<tk)break;y=lerp(y,yk,eio((t-tk)/1.1))}return y}
// captions: sentence split, char-proportional timing
const CAPS=[];VOTXT.forEach((s,l)=>{const parts=s.match(/[^.!?]+[.!?]*/g).map(p=>p.trim()).filter(Boolean);let c=0;const n=s.length;for(const p of parts){const i=s.indexOf(p,c);const a=VO[l][0]+(i/n)*(VO[l][1]-VO[l][0]),b=VO[l][0]+((i+p.length)/n)*(VO[l][1]-VO[l][0]);CAPS.push([a,b+0.25,p]);c=i+p.length}});
function wrap(s,maxW){ctx.font='600 38px Inter';const w=s.split(' ');const L=[''];for(const x of w){const tt=(L[L.length-1]+' '+x).trim();if(ctx.measureText(tt).width>maxW&&L[L.length-1])L.push(x);else L[L.length-1]=tt}return L}
function captions(t){let cur=null;for(const c of CAPS)if(t>=c[0]-0.05&&t<=c[1])cur=c;if(!cur)return;const k=Math.min(prog(t,cur[0]-0.05,0.15),1-prog(t,cur[1]-0.15,0.15));if(k<=0)return;
  const L=wrap(cur[2],1400);ctx.save();ctx.globalAlpha=k;ctx.font='600 38px Inter';const w=Math.max(...L.map(x=>ctx.measureText(x).width))+64,h=L.length*50+26;const y0=H-40-h;
  ctx.fillStyle='rgba(255,255,255,0.96)';ctx.shadowColor='rgba(29,59,110,0.18)';ctx.shadowBlur=18;ctx.beginPath();ctx.roundRect(W/2-w/2,y0,w,h,22);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#D7E4EF';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';L.forEach((x,i)=>ctx.fillText(x,W/2,y0+13+25+i*50));ctx.restore()}
function chapterTag(t){let cur=null;for(const c of CHAPS)if(t>=E(c[0],0))cur=c;if(!cur||t>=E(39,-0.7))return;const s=('KAPITEL '+cur[1]+'  ·  '+cur[2]).toUpperCase();ctx.save();ctx.font='700 24px Inter';const w=ctx.measureText(s).width+36;ctx.fillStyle='rgba(251,250,244,0.94)';ctx.beginPath();ctx.roundRect(152,30,w,44,22);ctx.fill();ctx.strokeStyle='#D7E4EF';ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=0.85;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText(s,170,53);ctx.restore()}
const pg=document.createElement('canvas');pg.width=W;pg.height=H+80;{const b=pg.getContext('2d');b.fillStyle=C.bg;b.fillRect(0,0,W,H+80);b.strokeStyle=C.grid;b.lineWidth=1.5;for(let x=0;x<W;x+=40){b.beginPath();b.moveTo(x+.5,0);b.lineTo(x+.5,H+80);b.stroke()}for(let y=0;y<H+80;y+=40){b.beginPath();b.moveTo(0,y+.5);b.lineTo(W,y+.5);b.stroke()}
  b.strokeStyle='rgba(214,58,58,0.45)';b.lineWidth=3;b.beginPath();b.moveTo(110,0);b.lineTo(110,H+80);b.stroke()}
const vg=document.createElement('canvas');vg.width=W;vg.height=H;{const b=vg.getContext('2d');const g=b.createRadialGradient(W/2,H/2,H*0.45,W/2,H/2,H*1.1);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(60,50,30,0.16)');b.fillStyle=g;b.fillRect(0,0,W,H)}
function frame(fi){const t=fi/FPS;const cy=camY(t);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.drawImage(pg,0,-((cy%40)+40)%40);
  for(const pass of[true,false])for(const e of EL){if(!!e.under!==pass||t<e.t0-0.01)continue;const oy=SECY[e.sec]-cy;if(oy>H+100||oy+SECH[e.sec]<-100)continue;ctx.save();ctx.translate(0,oy);e.f(t);ctx.restore()}
  ctx.drawImage(vg,0,0);chapterTag(t);captions(t);
  if(t<0.3){ctx.fillStyle=`rgba(0,0,0,${1-t/0.3})`;ctx.fillRect(0,0,W,H)}if(t>DUR-0.7){ctx.fillStyle=`rgba(0,0,0,${clamp((t-(DUR-0.7))/0.7,0,1)})`;ctx.fillRect(0,0,W,H)}}
window.frame=frame;window.NFR=Math.round(DUR*FPS);window.WRITES=WRITES;window.SFXDATA={W:WRITES,X:XS,K:CK,CAM:CAM};
