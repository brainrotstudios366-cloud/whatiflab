// ===================== KAROHEFT ENGINE (2D) =====================
const W=1080,H=1920,FPS=30,DUR=VO_DUR;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,k)=>a+(b-a)*k;
const eio=x=>{x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const eo=x=>{x=clamp(x,0,1);return 1-Math.pow(1-x,3)};
const prog=(t,a,d)=>clamp((t-a)/d,0,1);
const C={bg:'#FBFAF4',grid:'#D7E4EF',ink:'#1D3B6E',blue:'#1D6FE0',red:'#D63A3A',green:'#1E9E55',mark:'rgba(255,224,70,0.55)',
  org:'#FF9F43',orgF:'rgba(255,159,67,0.55)',blu:'#4DA3FF',bluF:'rgba(77,163,255,0.5)',pur:'#9B59D0',purF:'rgba(155,89,208,0.45)',grn:'#26C281',grnF:'rgba(38,194,129,0.5)',grnF2:'rgba(38,194,129,0.25)',brown:'#7A4A2A'};
const HF=s=>`700 ${s}px Caveat, "Noto Color Emoji"`;
// ---- timing
const E=(l,r)=>VO[l][0]+(r||0);const LE=l=>VO[l][1];
function Wd(l,word,occ){const s=VOTXT[l].toLowerCase(),w=word.toLowerCase();let i=-1;for(let k=0;k<(occ||1);k++){i=s.indexOf(w,i+1);if(i<0){console.log('WORD?',l,word);return VO[l][0]}}return VO[l][0]+(i/s.length)*(VO[l][1]-VO[l][0])-0.05}
// ---- deterministic jitter for hand-drawn lines
function hsh(a,b){let h=Math.sin(a*127.1+b*311.7)*43758.5453;return h-Math.floor(h)}
function hline(x1,y1,x2,y2,col,w,k,seed){k=k==null?1:k;if(k<=0)return;const n=Math.max(2,Math.ceil(Math.hypot(x2-x1,y2-y1)/40));const L=Math.hypot(x2-x1,y2-y1)||1;const nx=-(y2-y1)/L,ny=(x2-x1)/L;seed=seed||(x1*0.13+y1*0.7);
  ctx.strokeStyle=col;ctx.lineWidth=w||3.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();const m=Math.max(1,Math.round(n*k));
  for(let i=0;i<=m;i++){let f=i/n;if(i===m)f=k;const j=(i===0||f>=1)?0:(hsh(seed,i)-0.5)*1.6;const x=lerp(x1,x2,f)+nx*j,y=lerp(y1,y2,f)+ny*j;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
function hrect(x,y,w,h,col,lw,k){const P=2*(w+h);let r=(k==null?1:k)*P;const seg=[[x,y,x+w,y,w],[x+w,y,x+w,y+h,h],[x+w,y+h,x,y+h,w],[x,y+h,x,y,h]];for(const s of seg){if(r<=0)break;const f=Math.min(1,r/s[4]);hline(s[0],s[1],s[2],s[3],col,lw,f);r-=s[4]}}
function hcircle(cx,cy,r,col,lw,k){k=k==null?1:k;if(k<=0)return;ctx.strokeStyle=col;ctx.lineWidth=lw||3.5;ctx.lineCap='round';ctx.beginPath();const n=60,m=Math.round(n*k*1.04);for(let i=0;i<=m;i++){const a=-Math.PI/2+i/n*Math.PI*2;const rr=r*(1+(hsh(cx,i%n)-0.5)*0.012);const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
const MAC='\u0304';const strip=s=>String(s).split(MAC).join('');
function ftm(str,x,y){str=String(str);if(str.indexOf(MAC)<0){ctx.fillText(str,x,y);return}const pl=strip(str);const al=ctx.textAlign;const W_=ctx.measureText(pl).width;let x0=al==='center'?x-W_/2:al==='right'?x-W_:x;ctx.save();ctx.textAlign='left';ctx.fillText(pl,x0,y);
 let acc='';const fs=parseFloat((ctx.font.match(/(\d+(\.\d+)?)px/)||[0,40])[1]);for(let i=0;i<str.length;i++){const ch=str[i];if(ch===MAC){const c=acc.slice(-1);const a=x0+ctx.measureText(acc.slice(0,-1)).width,b=x0+ctx.measureText(acc).width;const yy=y-fs*(ctx.textBaseline==='middle'?0.42:0.78);ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=Math.max(2,fs*0.06);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a+fs*0.14,yy);ctx.lineTo(b+fs*0.06,yy);ctx.stroke()}else acc+=ch}ctx.restore()}
// ---- text / fraction tokens
function tw(s,size){ctx.font=HF(size);return ctx.measureText(strip(s)).width}
function tokW(tk,size){if(typeof tk==='object'&&tk.n!=null)return Math.max(tw(String(tk.n),size*0.78),tw(String(tk.d),size*0.78))+size*0.22;const s=typeof tk==='object'?tk.s:tk;return tw(s,size)}
const F=(n,d,c)=>({n,d,c});const S=(s,c)=>({s,c});
function layoutT(toks,size){const g=size*0.28;let x=0;return toks.map(tk=>{const w=tokW(tk,size);const o={tk,x,w};x+=w+g;return o}).concat([])}
function totalW(toks,size){const L=layoutT(toks,size);const l=L[L.length-1];return l.x+l.w}
function drawTok(tk,x,y,size,col){ctx.textBaseline='middle';ctx.textAlign='center';
  if(typeof tk==='object'&&tk.n!=null){const c=tk.c||col;const w=tokW(tk,size);ctx.font=HF(size*0.78);ctx.fillStyle=tk.cn||c;ftm(String(tk.n),x+w/2,y-size*0.38);ctx.fillStyle=tk.cd||c;ftm(String(tk.d),x+w/2,y+size*0.44);hline(x+size*0.04,y+size*0.03,x+w-size*0.04,y+size*0.03,c,Math.max(3,size*0.045),1,x);return}
  const s=typeof tk==='object'?tk.s:tk;const c=(typeof tk==='object'&&tk.c)||col;ctx.font=HF(size);ctx.fillStyle=c;ctx.textAlign='left';ftm(s,x,y+size*0.04)}
// reveal a drawing callback left->right with pen dot
function reveal(x,y,w,size,k,col,fn){if(k<=0)return;if(k>=1){fn();return}ctx.save();ctx.beginPath();ctx.rect(x-12,y-size*1.1,(w+24)*k,size*2.2);ctx.clip();fn();ctx.restore();
  ctx.save();ctx.fillStyle=col;ctx.globalAlpha=0.85;ctx.beginPath();ctx.arc(x-12+(w+24)*k,y+size*0.3,4.5,0,7);ctx.fill();ctx.restore()}
// ---------------- elements ----------------
const EL=[];const WRITES=[];
function el(t0,f,o){EL.push(Object.assign({t0,f},o||{}));}
// write tokens: times = array (per token) or single start (auto sequential)
function write(sec,t0,x,y,toks,size,col,o){o=o||{};col=col||C.ink;const L=layoutT(toks,size);let ts=Array.isArray(t0)?t0:null;const per=o.per||0.22;
  const starts=L.map((l,i)=>ts?ts[Math.min(i,ts.length-1)]+(ts.length<L.length&&i>=ts.length?(i-ts.length+1)*per:0):t0+i*per);
  const durs=L.map(l=>clamp(l.w/(size*2.4),0.18,0.55));L.forEach((l,i)=>WRITES.push([starts[i],durs[i]]));
  const ax=o.align==='c'?x-(L[L.length-1].x+L[L.length-1].w)/2:o.align==='r'?x-(L[L.length-1].x+L[L.length-1].w):x;
  const obj={sec,t0:starts[0],L,ax,y,size,starts,durs,tOut:o.tOut};
  el(starts[0],t=>{let a=1;if(o.tOut!=null)a=1-prog(t,o.tOut,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;L.forEach((l,i)=>{const k=prog(t,starts[i],durs[i]);if(k<=0)return;const c=(o.cols&&o.cols[i])||col;reveal(ax+l.x,y,l.w,size,k,c,()=>drawTok(l.tk,ax+l.x,y,size,c))});ctx.restore()},{sec});
  return obj}
// bounding rect of token i..j in a written object
function tokRect(w,i,j,pad){j=j==null?i:j;pad=pad==null?10:pad;const a=w.L[i],b=w.L[j];const tall=w.L.slice(i,j+1).some(l=>typeof l.tk==='object'&&l.tk.n!=null);const hh=tall?w.size*1.0:w.size*0.6;return[w.ax+a.x-pad,w.y-hh-pad,b.x+b.w-a.x+pad*2,hh*2+pad*2]}
function marker(sec,t0,r,tOut){el(t0,t=>{let k=eo(prog(t,t0,0.35));if(tOut!=null)k*=1-prog(t,tOut,0.4);if(k<=0)return;ctx.save();ctx.fillStyle=C.mark;ctx.beginPath();ctx.roundRect(r[0],r[1]+r[3]*0.08,r[2]*k,r[3]*0.84,8);ctx.fill();ctx.restore()},{sec,under:true})}
function boxE(sec,t0,r,col,lw){CK.push(t0);el(t0,t=>{const k=eo(prog(t,t0,0.6));if(k>0)hrect(r[0],r[1],r[2],r[3],col||C.green,lw||4,k)},{sec})}
function strike(sec,t0,r,col){el(t0,t=>{const k=eo(prog(t,t0,0.3));if(k>0)hline(r[0],r[1]+r[3]*0.75,r[0]+r[2],r[1]+r[3]*0.25,col||C.red,5,k)},{sec})}
const XS=[],CK=[];function cross(sec,t0,x,y,s){XS.push(t0);el(t0,t=>{const k=prog(t,t0,0.35);if(k<=0)return;hline(x-s,y-s,x+s,y+s,C.red,6,clamp(k*2,0,1));hline(x+s,y-s,x-s,y+s,C.red,6,clamp(k*2-1,0,1))},{sec})}
function check(sec,t0,x,y,s){CK.push(t0);el(t0,t=>{const k=prog(t,t0,0.35);if(k<=0)return;hline(x-s,y,x-s*0.3,y+s*0.7,C.green,6,clamp(k*2.2,0,1));hline(x-s*0.3,y+s*0.7,x+s,y-s*0.8,C.green,6,clamp(k*2.2-1.2,0,1))},{sec})}
function arrow(sec,t0,x1,y1,x2,y2,col,bend,label,lsize){WRITES.push([t0,0.4]);el(t0,t=>{const k=eo(prog(t,t0,0.45));if(k<=0)return;col=col||C.red;const mx=(x1+x2)/2+(bend||0)*(y2-y1)*0.0,my=(y1+y2)/2-(bend||0);
  ctx.strokeStyle=col;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);const n=24;let px=x1,py=y1,qx=x1,qy=y1;for(let i=1;i<=Math.round(n*k);i++){const f=i/n;const x=(1-f)*(1-f)*x1+2*(1-f)*f*mx+f*f*x2,y=(1-f)*(1-f)*y1+2*(1-f)*f*my+f*f*y2;qx=px;qy=py;px=x;py=y;ctx.lineTo(x,y)}ctx.stroke();
  if(k>0.95){const a=Math.atan2(py-qy,px-qx);hline(px,py,px-18*Math.cos(a-0.45),py-18*Math.sin(a-0.45),col,4);hline(px,py,px-18*Math.cos(a+0.45),py-18*Math.sin(a+0.45),col,4)}
  if(label){ctx.save();ctx.globalAlpha=prog(t,t0+0.25,0.3);ctx.font=HF(lsize||44);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,mx,my-(bend>0?22:-22)*(bend?1:0)-(bend?0:24));ctx.restore()}},{sec})}
function note(sec,t0,x,y,s,size,col,o){return write(sec,t0,x,y,[S(s)],size,col,Object.assign({per:0},o||{}))}
// fraction strip: n parts (can change over time), filled parts with colors
// o: {n, splits:[[t,n2]], fills:[[t,from,to,color]], merges:[[t,n2]] (fewer dividers), label}
function bar(sec,t0,x,y,w,h,o){o=o||{};WRITES.push([t0,0.6]);el(t0,t=>{const k=eo(prog(t,t0,0.6));if(k<=0)return;
   // fills
   for(const f of(o.fills||[])){const[tf,a,b,col,n0,dur]=f;const kk=eo(prog(t,tf,dur||0.5));if(kk<=0)continue;const n=n0||o.n;ctx.fillStyle=col;const xa=x+w*a/n,xb=x+w*b/n;ctx.fillRect(xa,y+3,(xb-xa)*kk,h-6)}
   // dividers
   let n=o.n;const div=new Set();for(let i=1;i<n;i++)div.add(i/n);
   for(const[ts,n2]of(o.splits||[])){const kk=prog(t,ts,0.6);if(kk<=0)continue;for(let i=1;i<n2;i++){const f=i/n2;if([...div].some(d=>Math.abs(d-f)<1e-6))continue;if(o.splitRange&&(f<o.splitRange[0]-1e-6||f>o.splitRange[1]+1e-6))continue;hline(x+w*f,y+h*0.5-h*0.5*eo(kk),x+w*f,y+h*0.5+h*0.5*eo(kk),C.ink,2.5,1,f*99)}}
   const fade=(o.merges||[]).map(([tm,n2])=>({tm,n2}));
   for(const d of div){let a=1;for(const m of fade){const keep=Math.abs(Math.round(d*m.n2)-d*m.n2)<1e-6;if(!keep)a*=1-prog(t,m.tm,0.6)}if(a<=0)continue;ctx.save();ctx.globalAlpha*=a;hline(x+w*d,y,x+w*d,y+h,C.ink,2.5,k,d*77);ctx.restore()}
   hrect(x,y,w,h,C.ink,3.5,k)},{sec})}
// pizza
function pizza(sec,t0,cx,cy,r,o){WRITES.push([t0,0.6]);el(t0,t=>{const k=eo(prog(t,t0,0.7));if(k<=0)return;
   ctx.save();ctx.globalAlpha*=k;ctx.fillStyle='#FCE7B8';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.restore();
   for(const[tf,i,col]of(o.fills||[])){const kk=eo(prog(t,tf,0.4));if(kk<=0)continue;const a0=-Math.PI/2+i/o.n*Math.PI*2,a1=a0+Math.PI*2/o.n;ctx.save();ctx.globalAlpha*=kk;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r-3,a0,a1);ctx.closePath();ctx.fill();
     // pepperoni dots
     ctx.fillStyle='rgba(200,60,40,0.75)';for(let j=0;j<3;j++){const a=a0+(j+0.6)/3.4*(a1-a0),rr=r*(0.35+0.4*hsh(i,j));ctx.beginPath();ctx.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,r*0.07,0,7);ctx.fill()}ctx.restore()}
   hcircle(cx,cy,r,C.ink,4,k);
   if(o.cutT!=null){const kk=prog(t,o.cutT,0.8);for(let i=0;i<o.n;i++){const kc=clamp(kk*o.n-i,0,1);if(kc<=0)continue;const a=-Math.PI/2+i/o.n*Math.PI*2;hline(cx,cy,cx+Math.cos(a)*r*kc,cy+Math.sin(a)*r*kc,C.ink,3.5,1,i*13)}}},{sec})}
function headingE(sec,t0,num,title){const s=(num?num+'. ':'')+title;const w=note(sec,t0,170,150,s,84,C.red);const tw_=tw(s,84);el(t0+0.5,t=>{const k=eo(prog(t,t0+0.5,0.6));if(k>0)hline(170,200,170+tw_,200,C.red,4,k,num||7)},{sec});return w}
// custom
function custom(sec,t0,f){el(t0,f,{sec})}
