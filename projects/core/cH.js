function pRad(p,s,cm){const c=prj(p);if(!c)return null;const b=camBasisB(cm);const q=prj(V.add(p,V.sc(b.r,s)));if(!q)return null;return[c,Math.hypot(q[0]-c[0],q[1]-c[1])]}
function strokePts(P,col,w,a,dash){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();let pen=false;for(const q of P){if(!q){pen=false;continue}if(!pen){ctx.moveTo(q[0],q[1]);pen=true}else ctx.lineTo(q[0],q[1])}ctx.stroke();ctx.restore()}
function arrow2(a,b,col,w,al){if(!a||!b||al<=0)return;const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<6)return;const ux=dx/L,uy=dy/L;ctx.save();ctx.globalAlpha=al;ctx.strokeStyle='rgba(0,0,0,0.7)';ctx.lineCap='round';
  ctx.lineWidth=w+6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]-ux*w*1.5,b[1]-uy*w*1.5);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]-ux*w*1.5,b[1]-uy*w*1.5);ctx.stroke();
  const h=w*2.6;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]-ux*h-uy*h*0.6,b[1]-uy*h+ux*h*0.6);ctx.lineTo(b[0]-ux*h+uy*h*0.6,b[1]-uy*h-ux*h*0.6);ctx.closePath();ctx.fill();ctx.restore()}
function sphereGlow(cm,R,a,col){const c=prj([0,0,0]);if(!c)return;const P=pRad([0,0,0],R,cm);if(!P)return;const r=P[1];ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.25);
  g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(0.28,`rgba(${col},${0.55*a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.4,c[1]-r*1.4,r*2.8,r*2.8);ctx.restore()}
function fLavaCol(n){const v=fbm(n[0]*5+2,n[2]*5+n[1]*3,5);const cr=Math.abs(fbm(n[0]*9+7,n[1]*9-n[2]*4,3)-0.5);
  if(cr<0.05)return mix3([1,0.9,0.4],[1,0.4,0.05],cr/0.05);return mix3([0.12,0.06,0.05],[0.35,0.12,0.06],v)}
const F_LAVA=um(m=>sph(m,1,96,192,fLavaCol,0),0.3);
const F_LAVAG=um(m=>sph(m,1,96,192,n=>{const cr=Math.abs(fbm(n[0]*9+7,n[1]*9-n[2]*4,3)-0.5);return cr<0.06?mix3([1,0.85,0.35],[1,0.35,0.05],cr/0.06):[0,0,0]},MAT.emis),0.3);
function fieldLines(al){if(al<=0)return;for(let i=1;i<=4;i++){const L=1.6+i*0.9;const P=[];for(let q=0;q<=60;q++){const th=0.08+q/60*(Math.PI-0.16);const r=L*Math.sin(th)*Math.sin(th);P.push([r*Math.sin(th)*1.0,r*Math.cos(th)*0.9,0])}
  for(const sx of[-1,1])strokePts(P.map(p=>prj([p[0]*sx,p[1],p[2]+0.2])),'#5af0ff',6,al*0.8,[14,10])}}

