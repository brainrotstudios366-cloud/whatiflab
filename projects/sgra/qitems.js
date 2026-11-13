let QR=null;
function camBasis(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function qItems(items,t,cm,o){const b=camBasis(cm);const d=o.d||3;const tanH=Math.tan(cm.fov/2)*d,tanW=tanH*W/H;const bob=Math.sin(t*2.2)*0.04;
  const p=V.add(cm.eye,V.add(V.sc(b.f,d),V.add(V.sc(b.r,-o.x*tanW),V.sc(b.u,o.y*tanH+bob))));const s=(o.s||0.16)*d/3*(o.pop==null?1:o.pop);if(s<=0.001)return;
  const toC=V.sc(b.f,-1);const rx=V.norm(V.cross([0,1,0],toC)),ry=V.cross(toC,rx);const tilt=Math.sin(t*1.7)*0.12;
  const rot=(v)=>V.add(V.add(V.sc(rx,v[0]),V.sc(ry,v[1])),V.sc(toC,v[2]));const Mx=(lp,sc)=>{const c=V.add(p,V.sc(rot(lp),s));const X=V.sc(rx,s*sc[0]),Y=V.sc(ry,s*sc[1]),Z=V.sc(toC,s*sc[2]);return[X[0],X[1],X[2],0,Y[0],Y[1],Y[2],0,Z[0],Z[1],Z[2],0,c[0],c[1],c[2],1]};
  items.push({mesh:QBODY,M:Mx([0,0,0],[1,1,1])});
  // rings
  const cols=[[0.35,0.95,1],[1,0.85,0.3],[1,0.4,0.6]];for(let i=0;i<3;i++){const a=t*1.4+i*TAU2/3;const ax=V.norm([Math.cos(i*2.1),0.6,Math.sin(i*2.1)]);
    const R0=1.75;const M0=M4.mul(M4.trs([0,0,0],a,i*1.05+0.4,0.3*i,R0),M4.id());const base=[R0,0,0,0,0,R0,0,0,0,0,R0,0,0,0,0,1];
    const L=M4.trs([0,0,0],a+i,0.9+i*0.5,i*0.8,R0);const W2=[rx[0]*s,rx[1]*s,rx[2]*s,0,ry[0]*s,ry[1]*s,ry[2]*s,0,toC[0]*s,toC[1]*s,toC[2]*s,0,p[0],p[1],p[2],1];items.push({mesh:TORUS,M:M4.mul(W2,L),tint:cols[i],tintAmt:1})}
  const ex=o.expr||'open';const blink=(t%3.1)<0.12;
  for(const sx of[-1,1]){if(ex==='happy'){items.push({mesh:QDARK,M:Mx([sx*0.36,0.22,0.9],[0.2,0.06,0.06])})}else{const big=ex==='wide'?1.25:1;items.push({mesh:QWHITE,M:Mx([sx*0.36,0.2,0.84],[0.27*big,blink?0.04:0.32*big,0.18])});if(!blink){items.push({mesh:QDARK,M:Mx([sx*0.34,0.17,0.99],[0.13*big,0.16*big,0.06])});items.push({mesh:QWHITE,M:Mx([sx*0.3,0.24,1.04],[0.045,0.045,0.03])})}}}
  if(ex==='wide'||ex==='o')items.push({mesh:QDARK,M:Mx([0,-0.32,0.93],[0.14,0.17,0.06])});else items.push({mesh:QMOUTH,M:Mx([0,-0.25,0.94],[1,1,1])});
  QR={p,s}}
