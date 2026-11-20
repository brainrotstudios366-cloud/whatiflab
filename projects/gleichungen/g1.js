// ===================== GLEICHUNGEN UMSTELLEN – base, meshes =====================
const FPS=30,SUB=1,DUR=VO_DUR;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const TAU2=Math.PI*2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function mix3(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
const backOut=x=>{if(x<=0)return 0;if(x>=1)return 1;const c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const E=(l,r)=>VO[l][0]+(r||0);          // event time: line l + offset r (s)
const LE=l=>VO[l][1];                      // line end
const HC=hx;
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
function sph(m,R,NA,NO,colFn,mat){const P=(i,j)=>{const th=i/NA*Math.PI,ph=j/NO*TAU2;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};
  for(let i=0;i<NA;i++)for(let j=0;j<NO;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const S=p=>V.sc(p,R);const ca=colFn(a),cb=colFn(b),cc=colFn(c),cd=colFn(d);
    if(i===0)m.tri(S(a),S(c),S(b),[ca,cc,cb],mat);else if(i===NA-1)m.tri(S(a),S(d),S(b),[ca,cd,cb],mat);else m.quad(S(a),S(d),S(c),S(b),[ca,cd,cc,cb],mat)}}
function tube(m,a,b,r0,r1,col,seg,mat){seg=seg||10;const y=V.sub(b,a);const yn=V.norm(y);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);
  const ring=(c,r)=>{const o=[];for(let i=0;i<seg;i++){const ang=i/seg*TAU2;o.push(V.add(c,V.add(V.sc(x,Math.cos(ang)*r),V.sc(z,Math.sin(ang)*r))))}return o};const A=ring(a,r0),B=ring(b,r1);for(let i=0;i<seg;i++){const j=(i+1)%seg;m.quad(A[i],A[j],B[j],B[i],col,mat)}}
function segM(a,b,r){const y=V.sub(b,a);const L=V.len(y)||1e-6;const yn=V.sc(y,1/L);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);const mid=V.sc(V.add(a,b),0.5);
  return new Float32Array([x[0]*r,x[1]*r,x[2]*r,0,y[0],y[1],y[2],0,z[0]*r,z[1]*r,z[2]*r,0,mid[0],mid[1],mid[2],1])}
function torus(m,R,r,n,k,col,mat){for(let i=0;i<n;i++)for(let j=0;j<k;j++){const P=(a,b)=>{const A=a/n*TAU2,B=b/k*TAU2;return[(R+r*Math.cos(B))*Math.cos(A),r*Math.sin(B),(R+r*Math.cos(B))*Math.sin(A)]};m.quad(P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),col,mat)}}
// --- palette
const CY=HC('#5AF0FF'),YE=HC('#FFD84A'),PK=HC('#FF5A8A'),GR=HC('#7DFF9A');
// --- unit helpers
const UCYL=um(m=>m.prism([0,-0.5,0],1,1,1,10,[1,1,1],MAT.emis));            // emissive unit cylinder (tint)
const UCYLL=um(m=>m.prism([0,-0.5,0],1,1,1,14,[0.75,0.78,0.86]),0.7);       // lit cylinder
const USPH=um(m=>sph(m,1,10,16,()=>[1,1,1],MAT.emis));
// --- x-box (crate): dark glassy body + glowing cyan edges ; unit cube
const XBOX=um(m=>{m.box([0,0,0],[0.94,0.94,0.94],HC('#10204a'),0,0,HC('#1a3470'));const e=0.07,c=HC('#7af6ff');
  for(const a of[-0.47,0.47])for(const b of[-0.47,0.47]){m.box([0,a,b],[1,e,e],c,MAT.emis);m.box([a,0,b],[e,1,e],c,MAT.emis);m.box([a,b,0],[e,e,1],c,MAT.emis)}});
// --- weight: gold cylinder with knob + glow band ; height 1, radius .5 , base at y=-.5
const WGT=um(m=>{m.prism([0,-0.5,0],0.5,0.5,0.78,22,HC('#f2b632'));m.prism([0,0.28,0],0.5,0.36,0.12,22,HC('#ffd25a'));m.prism([0,0.4,0],0.17,0.17,0.1,12,HC('#e0a020'));
  m.prism([0,-0.2,0],0.505,0.505,0.08,22,HC('#fff2b0'),MAT.emis)},0.6);
// --- balloon (-1)
const BALL=um(m=>{sph(m,1,16,24,n=>{const d=Math.max(0,V.dot(n,V.norm([-0.5,0.6,0.6])));return mix3(HC('#c2184a'),HC('#ff7aa0'),clamp(0.2+d,0,1))},MAT.emis);m.prism([0,-1.12,0],0.18,0.05,0.2,8,HC('#c2184a'),MAT.emis)});
// --- scale parts
const SBASE=um(m=>{m.prism([0,0,0],2.2,2.0,0.22,48,HC('#1b2142'));m.prism([0,0.22,0],1.5,1.3,0.2,48,HC('#232a52'));m.prism([0,0.215,0],2.02,2.02,0.02,48,CY,MAT.emis);
  m.prism([0,0.42,0],0.42,0.34,0.3,24,HC('#2c3566'));tube(m,[0,0.6,0],[0,3.05,0],0.2,0.16,HC('#3a4478'),20);m.prism([0,1.4,0],0.205,0.2,0.06,20,CY,MAT.emis);
  m.prism([0,3.0,0],0.5,0.08,0.5,4,HC('#4a5590'),0,Math.PI/4)},0.5);
const PIVOT=um(m=>sph(m,0.2,12,18,n=>mix3(HC('#ffb020'),HC('#fff0a0'),clamp(n[1]*0.5+0.6,0,1)),MAT.emis));
const BEAM=um(m=>{m.box([0,0,0],[6.0,0.2,0.32],HC('#2c3566'),0,0,HC('#3a4680'));m.box([0,0,0.165],[5.8,0.05,0.02],CY,MAT.emis);
  for(const s of[-1,1]){m.box([s*2.95,0,0],[0.18,0.34,0.4],HC('#3a4478'));}
  for(let i=-5;i<=5;i++)if(i)m.box([i*0.5,0.075,0.166],[0.025,0.07,0.01],HC('#9ab8ff'),MAT.emis)});
const PAN=um(m=>{m.prism([0,-0.1,0],1.25,1.45,0.12,48,HC('#262e5a'));m.prism([0,0.019,0],1.45,1.45,0.002,48,HC('#323c70'));torus(m,1.45,0.04,64,6,CY,MAT.emis);
  m.prism([0,-0.14,0],1.0,1.0,0.04,40,HC('#1a2046'))},0.5);
const POINTER=um(m=>{m.prism([0,0,0],0.06,0.0,0.9,8,YE,MAT.emis)});
// --- floor: dark disc with faint emissive rings
const FLOOR=um(m=>{const N=96;for(let i=0;i<N;i++){const a=i/N*TAU2,b=(i+1)/N*TAU2;m.tri([0,0,0],[Math.cos(b)*40,0,Math.sin(b)*40],[Math.cos(a)*40,0,Math.sin(a)*40],[HC('#0a0e2a'),HC('#04061a'),HC('#04061a')])}
  for(const[r,g]of[[2.6,0.5],[3.6,0.28],[5.2,0.16],[7.5,0.09],[10.5,0.05]]){for(let i=0;i<120;i++){const a=i/120*TAU2,b=(i+1)/120*TAU2;const w=0.03;const c=V.sc(CY,g);
    m.quad([Math.cos(a)*(r-w),0.005,Math.sin(a)*(r-w)],[Math.cos(a)*(r+w),0.005,Math.sin(a)*(r+w)],[Math.cos(b)*(r+w),0.005,Math.sin(b)*(r+w)],[Math.cos(b)*(r-w),0.005,Math.sin(b)*(r-w)],c,MAT.emis)}}});
const SHADOW=um(m=>{const N=40;for(let i=0;i<N;i++){const a=i/N*TAU2,b=(i+1)/N*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[[0,0,0],[0.04,0.05,0.12],[0.04,0.05,0.12]],MAT.glass)}});
// --- Q mascot
const QL=V.norm([-0.45,0.7,0.6]);const QBODY=um(m=>sph(m,1,28,40,n=>{const d=Math.max(0,V.dot(n,QL));const rim=Math.pow(1-Math.max(0,n[2]),3);let c=mix3(HC('#e8780a'),HC('#ffd23a'),clamp(0.25+d*0.9,0,1));c=mix3(c,HC('#fffbe0'),Math.pow(d,10)*0.9);return mix3(c,HC('#ffe9a0'),rim*0.5)},MAT.emis));
const QWHITE=um(m=>sph(m,1,12,18,n=>mix3([0.75,0.78,0.86],[1,1,1],clamp(n[2]*0.8+n[1]*0.3+0.3,0,1)),MAT.emis));
const QDARK=um(m=>sph(m,1,12,18,()=>[0.07,0.05,0.12],MAT.emis));
const QMOUTH=um(m=>{const p=[];for(let i=0;i<=12;i++){const a=Math.PI+0.5+i/12*(Math.PI-1);p.push([Math.cos(a)*0.32,Math.sin(a)*0.2,0])}for(let i=0;i<12;i++)tube(m,p[i],p[i+1],0.045,0.045,[0.42,0.14,0.05],6,MAT.emis)});
const TORUS=um(m=>torus(m,1,0.035,80,8,[1,1,1],MAT.emis));
function camBasis(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
let QR=null;
function qItems(items,t,cm,o){const b=camBasis(cm);const d=o.d||3;const tanH=Math.tan(cm.fov/2)*d,tanW=tanH*W/H;const bob=Math.sin(t*2.2)*0.04+(o.jump||0);
  const p=V.add(cm.eye,V.add(V.sc(b.f,d),V.add(V.sc(b.r,o.x*tanW),V.sc(b.u,o.y*tanH+bob))));const s=(o.s||0.16)*d/3*(o.pop==null?1:o.pop);if(s<=0.001){QR=null;return}
  const toC=V.sc(b.f,-1);const rx=V.norm(V.cross([0,1,0],toC)),ry=V.cross(toC,rx);
  const Mx=(lp,sc)=>{const c=V.add(p,V.add(V.add(V.sc(rx,lp[0]*s),V.sc(ry,lp[1]*s)),V.sc(toC,lp[2]*s)));const X=V.sc(rx,s*sc[0]),Y=V.sc(ry,s*sc[1]),Z=V.sc(toC,s*sc[2]);return new Float32Array([X[0],X[1],X[2],0,Y[0],Y[1],Y[2],0,Z[0],Z[1],Z[2],0,c[0],c[1],c[2],1])};
  items.push({mesh:QBODY,M:Mx([0,0,0],[1,1,1])});
  const cols=[[0.35,0.95,1],[1,0.85,0.3],[1,0.4,0.6]];for(let i=0;i<3;i++){const a=t*1.4+i*TAU2/3;const R0=1.75;
    const L=M4.trs([0,0,0],a+i,0.9+i*0.5,i*0.8,R0);const W2=new Float32Array([rx[0]*s,rx[1]*s,rx[2]*s,0,ry[0]*s,ry[1]*s,ry[2]*s,0,toC[0]*s,toC[1]*s,toC[2]*s,0,p[0],p[1],p[2],1]);items.push({mesh:TORUS,M:M4.mul(W2,L),tint:cols[i],tintAmt:1})}
  const ex=o.expr||'open';const blink=(t%3.1)<0.12;
  for(const sx of[-1,1]){if(ex==='happy'){items.push({mesh:QDARK,M:Mx([sx*0.36,0.22,0.9],[0.2,0.06,0.06])})}else{const big=ex==='wide'?1.25:1;items.push({mesh:QWHITE,M:Mx([sx*0.36,0.2,0.84],[0.27*big,blink?0.04:0.32*big,0.18])});
    if(!blink){const lx=ex==='side'?0.07:0;items.push({mesh:QDARK,M:Mx([sx*0.34+lx,0.17,0.99],[0.13*big,0.16*big,0.06])});items.push({mesh:QWHITE,M:Mx([sx*0.3+lx,0.24,1.04],[0.045,0.045,0.03])})}}}
  if(ex==='wide'||ex==='o')items.push({mesh:QDARK,M:Mx([0,-0.32,0.93],[0.14,0.17,0.06])});else items.push({mesh:QMOUTH,M:Mx([0,-0.25,0.94],[1,1,1])});
  QR={p,s}}
