// ================= objects =================
function lathe(m,prof,seg,col,mat){for(let i=0;i<prof.length-1;i++){const[r0,y0]=prof[i],[r1,y1]=prof[i+1];for(let j=0;j<seg;j++){const a=j/seg*TAU2,b=(j+1)/seg*TAU2;
  const A=[Math.cos(a)*r0,y0,Math.sin(a)*r0],B=[Math.cos(b)*r0,y0,Math.sin(b)*r0],C=[Math.cos(b)*r1,y1,Math.sin(b)*r1],D=[Math.cos(a)*r1,y1,Math.sin(a)*r1];
  const c=typeof col==='function'?col((y0+y1)/2,(r0+r1)/2):col;if(r0<1e-5)m.tri(A,C,D,c,mat);else if(r1<1e-5)m.tri(A,B,C,c,mat);else m.quad(A,D,C,B,c,mat)}}}
const VAC=um(m=>{lathe(m,[[0,0.03],[1.24,0.03],[1.3,0.08],[1.3,0.25],[1.26,0.31],[1.12,0.34],[0,0.34]],56,(y,r)=>y>0.3?(r>0.9&&r<1.0?hx('#4a4d56'):hx('#2a2c33')):hx('#6a6e78'));
  lathe(m,[[0,0.341],[0.17,0.341],[0.17,0.36],[0.15,0.372],[0,0.372]],28,hx('#d8dade'));
  m.box([0,0.3,1.12],[0.6,0.08,0.22],hx('#121318'),0,0)});
const VLED=um(m=>lathe(m,[[0.6,0.343],[0.68,0.343]],48,[1,1,1],MAT.emis));
const BRUSH=um(m=>{for(let i=0;i<3;i++){const a=i/3*TAU2;tube(m,[0,0.02,0],[Math.cos(a)*0.32,0.012,Math.sin(a)*0.32],0.012,0.006,hx('#3a3c44'),5)}m.ico([0,0.025,0],0.05,hx('#1a1a20'))});
const UFO=um(m=>{lathe(m,[[0,-0.62],[1.2,-0.56],[2.6,-0.26],[3.6,0],[3.55,0.1],[2.5,0.38],[1.4,0.55],[0,0.6]],60,(y,r)=>r>3.3?hx('#8a8e9a'):(y<0?hx('#7d818c'):hx('#c4c8d2')));
  lathe(m,[[0,-0.64],[0.75,-0.64]],32,[1,1,1],MAT.emis)});
const DOME=um(m=>m.ico([0,0,0],1,[0.6,0.9,1],MAT.glass,1,[12,20]));
const TRACT=um(m=>m.prism([0,-0.5,0],1,0.32,1,32,[1,1,1],MAT.emis));
const ALIEN=um(m=>{m.ico([0,0.2,0],0.38,hx('#7ad860'));m.ico([0,-0.25,0],0.25,hx('#7ad860'));for(const sx of[-1,1])m.ico([sx*0.15,0.22,0.3],0.11,[0.03,0.03,0.05])});
const CUKE=um(m=>{const c=hx('#3f8a32'),c2=hx('#2d6a24');const N=28,Mr=12;for(let i=0;i<Mr;i++)for(let j=0;j<N;j++){const P=(ii,jj)=>{const u=ii/Mr,a=jj/N*TAU2;const r=0.055*Math.pow(Math.sin(Math.PI*clamp(u,0.001,0.999)),0.45)*(1+0.03*Math.sin(a*6));return[(u-0.5)*0.34,r*Math.cos(a),r*Math.sin(a)]};
  const cc=(ii,jj)=>((jj+(ii%2))%4<2)?c:c2;m.quad(P(i,j),P(i,j+1),P(i+1,j+1),P(i+1,j),[cc(i,j),cc(i,j+1),cc(i+1,j+1),cc(i+1,j)])}
  for(let k=0;k<26;k++){const u=0.12+hsh(k,1)*0.76,a=hsh(k,2)*TAU2;const r=0.055*Math.pow(Math.sin(Math.PI*u),0.45);m.ico([(u-0.5)*0.34,r*Math.cos(a),r*Math.sin(a)],0.007,hx('#a8c870'))}
  m.ico([0.172,0,0],0.012,hx('#8a7a40'))});
const BOWL=um(m=>{lathe(m,[[0,0.005],[0.1,0.005],[0.13,0.065],[0.115,0.068],[0.09,0.02],[0,0.02]],32,hx('#e85060'));for(let k=0;k<26;k++){const a=hsh(k,1)*TAU2,r=Math.sqrt(hsh(k,2))*0.085;m.ico([Math.cos(a)*r,0.035+hsh(k,3)*0.012,Math.sin(a)*r],0.014,hx('#9a6232'))}});
