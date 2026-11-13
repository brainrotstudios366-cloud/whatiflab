// ================= NEPTUNE: meshes =================
const HC=(h)=>hx(h);
function sph(m,R,NA,NO,colFn,mat,skip){const P=(i,j)=>{const th=i/NA*Math.PI,ph=j/NO*TAU2;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};
  for(let i=0;i<NA;i++)for(let j=0;j<NO;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const cen=V.norm(V.add(V.add(a,b),V.add(c,d)));if(skip&&skip(cen))continue;
    const S=p=>V.sc(p,R);const ca=colFn(a),cb=colFn(b),cc=colFn(c),cd=colFn(d);if(i===0)m.tri(S(a),S(c),S(b),[ca,cc,cb],mat);else if(i===NA-1)m.tri(S(a),S(d),S(b),[ca,cd,cb],mat);else m.quad(S(a),S(d),S(c),S(b),[ca,cd,cc,cb],mat)}}
const TORUS=um(m=>{const n=96,k=10,R=1,r=0.035;for(let i=0;i<n;i++)for(let j=0;j<k;j++){const P=(a,b)=>{const A=a/n*TAU2,B=b/k*TAU2;return[(R+r*Math.cos(B))*Math.cos(A),r*Math.sin(B),(R+r*Math.cos(B))*Math.sin(A)]};m.quad(P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),[1,1,1],MAT.emis)}});
const QL=V.norm([-0.45,0.7,0.6]);const QBODY=um(m=>sph(m,1,32,48,n=>{const d=Math.max(0,V.dot(n,QL));const rim=Math.pow(1-Math.max(0,n[2]),3);let c=mix3(HC('#e8780a'),HC('#ffd23a'),clamp(0.25+d*0.9,0,1));c=mix3(c,HC('#fffbe0'),Math.pow(d,10)*0.9);return mix3(c,HC('#ffe9a0'),rim*0.5)},MAT.emis));
const QWHITE=um(m=>sph(m,1,14,22,n=>mix3([0.75,0.78,0.86],[1,1,1],clamp(n[2]*0.8+n[1]*0.3+0.3,0,1)),MAT.emis));
const QDARK=um(m=>sph(m,1,14,22,()=>[0.07,0.05,0.12],MAT.emis));
const QMOUTH=um(m=>{const p=[];for(let i=0;i<=12;i++){const a=Math.PI+0.5+i/12*(Math.PI-1);p.push([Math.cos(a)*0.32,Math.sin(a)*0.2,0])}for(let i=0;i<12;i++)tube(m,p[i],p[i+1],0.045,0.045,[0.42,0.14,0.05],6,MAT.emis)});
const STARFIELD=um(m=>{const r=rngG(9);for(let i=0;i<900;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const p=[s*Math.cos(a)*400,u*400,s*Math.sin(a)*400];m.ico(p,0.4+r()*0.9,mix3([1,1,1],[0.7,0.8,1],r()),MAT.emis,1,[2,3])}});
const SUNM=um(m=>m.ico([0,0,0],1,HC('#fff6e0'),MAT.emis,1,[12,18]));
const EBOX=um(m=>m.box([0,0,0],[1,1,1],[1,1,1],MAT.emis));
