// ================= opponents / props (nature's hardest hitters) =================
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1])}});
const PUFF=um(m=>blob(m,[0,0,0],1,p=>mix3([0.78,0.78,0.8],[0.97,0.97,0.98],clamp(p[1]*0.5+0.5,0,1)),3,0.9,[7,10]),0.5);
function sphC(mb,c,r,colFn,res,mat){const la=res[0],lo=res[1];const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[c[0]+Math.sin(th)*Math.cos(ph)*r,c[1]+Math.cos(th)*r,c[2]+Math.sin(th)*Math.sin(ph)*r]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
// ellipsoid with colour function (local unit-sphere coords passed to colFn as 2nd arg), optional pitch tilt
function ell(mb,c,r,colFn,res,mat,tilt){res=res||[10,16];const la=res[0],lo=res[1];const ct=Math.cos(tilt||0),st=Math.sin(tilt||0);
  const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const u=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];let q=[u[0]*r[0],u[1]*r[1],u[2]*r[2]];q=[q[0],q[1]*ct-q[2]*st,q[1]*st+q[2]*ct];return{p:V.add(c,q),u}};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const A=P(i,j),B=P(i+1,j),C_=P(i+1,j+1),D=P(i,j+1);const cl=[colFn(A.p,A.u),colFn(D.p,D.u),colFn(C_.p,C_.u),colFn(B.p,B.u)];
    if(i===0)mb.tri(A.p,C_.p,B.p,[cl[0],cl[2],cl[3]],mat);else if(i===la-1)mb.tri(A.p,D.p,B.p,[cl[0],cl[1],cl[3]],mat);else mb.quad(A.p,D.p,C_.p,B.p,cl,mat)}}
const GSPH=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.glass,1,[16,24]));
const RING=um(m=>{const N=64;for(let i=0;i<N;i++){const a=i/N*TAU2,b=(i+1)/N*TAU2;const q=(r,an)=>[Math.cos(an)*r,0,Math.sin(an)*r];m.quad(q(0.9,a),q(1,a),q(1,b),q(0.9,b),[1,1,1]);m.quad(q(0.9,b),q(1,b),q(1,a),q(0.9,a),[1,1,1])}});
