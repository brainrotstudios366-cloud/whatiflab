// ===================== 2D helpers =====================
const FONT='Inter, "Noto Color Emoji"';
const COL={w:'#FFFFFF',c:'#5AF0FF',y:'#FFD84A',p:'#FF5A8A',g:'#7DFF9A',d:'#8a93c8'};
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px ${FONT}`;ctx.textAlign=align||'center';ctx.textBaseline='middle';
  if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*(stroke||0.16);ctx.strokeStyle='rgba(5,6,26,0.9)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function tw(s,size,weight){ctx.font=`${weight||900} ${size}px ${FONT}`;return ctx.measureText(s).width}
function glowTxt(s,x,y,size,col,align,weight){ctx.save();ctx.shadowColor=col;ctx.shadowBlur=size*0.5;txt(s,x,y,size,col,align,weight,false);ctx.restore();txt(s,x,y,size,col,align,weight,0.12)}
// ---- equation tokens: "x + 5 = 12" ; prefixes ^y ^p ^g ^c ^w ^d ; fraction "a/b"
function eqTok(str){return str.split(' ').filter(Boolean).map(s=>{let c=null;if(s[0]==='^'){c=COL[s[1]];s=s.slice(2)}
  const fr=/^-?\d+\/\d+$/.test(s)?s.split('/'):null;if(!c)c=/x/.test(s)&&!fr?COL.c:COL.w;s=s.replace(/-/g,'−');return{s,c,fr}})}
function tokW(tk,size){if(tk.fr)return Math.max(tw(tk.fr[0],size*0.62,800),tw(tk.fr[1],size*0.62,800))+size*0.1;return tw(tk.s,size,800)}
function eqLayout(str,size){const T=eqTok(str);const gap=size*0.26;let w=0,eqx=null;T.forEach((tk,i)=>{tk.w=tokW(tk,size);tk.x=w;if(tk.s==='='&&eqx==null)eqx=w+tk.w/2;w+=tk.w+(i<T.length-1?gap:0)});return{T,w,eqx:eqx==null?w/2:eqx}}
// draw equation. mode 'c' centre at x ; mode '=' aligns '=' at x
function drawEq(str,x,y,size,o){o=o||{};const L=eqLayout(str,size);const x0=o.align==='='?x-L.eqx:o.align==='l'?x:x-L.w/2;const a=o.alpha==null?1:o.alpha;if(a<=0)return L;
  ctx.save();ctx.globalAlpha*=a;
  if(o.glow){ctx.save();ctx.shadowColor=o.glow;ctx.shadowBlur=size*0.6;for(const tk of L.T)if(!tk.fr){ctx.font=`800 ${size}px ${FONT}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=tk.c;ctx.fillText(tk.s,x0+tk.x,y)}ctx.restore()}
  for(const tk of L.T){const tx=x0+tk.x;if(tk.fr){const fs=size*0.62;const cx=tx+tk.w/2;txt(tk.fr[0].replace('-','−'),cx,y-size*0.36,fs,tk.c,'center',800,0.14);txt(tk.fr[1],cx,y+size*0.38,fs,tk.c,'center',800,0.14);
      ctx.fillStyle=tk.c;ctx.fillRect(tx,y-size*0.04,tk.w,size*0.075)}else txt(tk.s,tx,y,size,tk.c,'left',800,0.14)}
  if(o.strike!=null&&o.strike>0){const k=clamp(o.strike,0,1);ctx.strokeStyle=COL.p;ctx.lineWidth=size*0.09;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0-size*0.2,y+size*0.05);ctx.lineTo(x0-size*0.2+(L.w+size*0.4)*k,y-size*0.05);ctx.stroke()}
  ctx.restore();L.x0=x0;return L}
// token-range highlight box (for cancel / emphasis)
function tokBox(L,i0,i1,y,size,col,a,cross){if(a<=0)return;const T=L.T;const xa=L.x0+T[i0].x-size*0.1,xb=L.x0+T[i1].x+T[i1].w+size*0.1;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=size*0.06;rrect(xa,y-size*0.62,xb-xa,size*1.24,size*0.2);ctx.stroke();
  if(cross){ctx.lineWidth=size*0.08;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(xa+size*0.1,y+size*0.45);ctx.lineTo(xb-size*0.1,y-size*0.45);ctx.stroke()}ctx.restore()}
// glass card
function card(x,y,w,h,o){o=o||{};const a=o.alpha==null?1:o.alpha;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const r=o.r||28;
  ctx.shadowColor=o.edge||'rgba(90,240,255,0.55)';ctx.shadowBlur=30;rrect(x,y,w,h,r);ctx.fillStyle=o.fill||'rgba(10,14,44,0.86)';ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'rgba(255,255,255,0.08)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;rrect(x,y,w,h,r);ctx.fill();
  ctx.lineWidth=3;ctx.strokeStyle=o.edge||'rgba(90,240,255,0.75)';rrect(x,y,w,h,r);ctx.stroke();ctx.restore()}
// check / cross stamps (drawn, no emoji)
function stamp(ok,x,y,s,k){if(k<=0)return;const sc=backOut(clamp(k*1.4,0,1));ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(ok?-0.08:0.1);const col=ok?COL.g:COL.p;
  ctx.shadowColor=col;ctx.shadowBlur=s*0.5;ctx.beginPath();ctx.arc(0,0,s,0,Math.PI*2);ctx.fillStyle=ok?'rgba(20,70,40,0.92)':'rgba(80,15,35,0.92)';ctx.fill();ctx.lineWidth=s*0.12;ctx.strokeStyle=col;ctx.stroke();ctx.shadowBlur=0;
  ctx.lineWidth=s*0.2;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(ok){ctx.moveTo(-s*0.45,s*0.02);ctx.lineTo(-s*0.12,s*0.36);ctx.lineTo(s*0.5,-s*0.36)}else{ctx.moveTo(-s*0.38,-s*0.38);ctx.lineTo(s*0.38,s*0.38);ctx.moveTo(s*0.38,-s*0.38);ctx.lineTo(-s*0.38,s*0.38)}ctx.stroke();ctx.restore()}
// pill label
function pill(s,x,y,size,col,a,bg){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=tw(s,size,900)+size*1.1,h=size*1.55;rrect(x-w/2,y-h/2,w,h,h/2);ctx.fillStyle=bg||'rgba(8,10,36,0.88)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=col;ctx.stroke();txt(s,x,y+size*0.03,size,col,'center',900,false);ctx.restore()}
const appear=(t,t0,d)=>clamp((t-t0)/(d||0.35),0,1);
const life=(t,t0,t1,d)=>{d=d||0.3;return clamp((t-t0)/d,0,1)*(t1==null?1:1-clamp((t-t1)/d,0,1))};
