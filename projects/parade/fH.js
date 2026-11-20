function camBasisB(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function pRad(p,s,cm){const c=prj(p);if(!c)return null;const b=camBasisB(cm);const q=prj(V.add(p,V.sc(b.r,s)));if(!q)return null;return[c,Math.hypot(q[0]-c[0],q[1]-c[1])]}
function sunFlare(cm,a){const p=V.add(cm.eye,V.sc(SUND,300));const c=prj(p);if(!c)return;glowAt(c,260,'255,230,190',0.5*a);glowAt(c,70,'255,255,240',0.9*a)}
function vignette(col,a){if(a<=0)return;ctx.save();const g=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.72);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
function flash(a,col){if(a<=0)return;ctx.save();ctx.fillStyle=`rgba(${col||'255,255,255'},${a})`;ctx.fillRect(0,0,W,H);ctx.restore()}
function strokePts(P,col,w,a,dash){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();let pen=false;for(const q of P){if(!q){pen=false;continue}if(!pen){ctx.moveTo(q[0],q[1]);pen=true}else ctx.lineTo(q[0],q[1])}ctx.stroke();ctx.restore()}
function bigLabel(lines,y,k){if(k<=0)return;const p=popS(k);ctx.save();ctx.translate(W/2,y);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  for(const[s,dy,sz,col]of lines){ctx.font=`900 ${fitS(s,980,sz)}px Inter, "Noto Color Emoji"`;ctx.lineWidth=sz*0.2;ctx.strokeStyle='rgba(0,0,0,0.9)';ctx.strokeText(s,0,dy);ctx.fillStyle=col;ctx.fillText(s,0,dy)}ctx.restore()}
