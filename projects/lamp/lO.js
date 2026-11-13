// ================= lamp props =================
const LAMPPOST=um(m=>{const ir=hx('#1c1c22'),ir2=hx('#2a2a32');m.prism([0,0,0],0.22,0.18,0.25,8,ir);m.prism([0,0.25,0],0.08,0.06,3.0,8,ir2);m.prism([0,3.25,0],0.13,0.13,0.08,8,ir);
  // lantern frame
  for(const sx of[-1,1])for(const sz of[-1,1])m.box([sx*0.19,3.62,sz*0.19],[0.04,0.62,0.04],ir);m.prism([0,3.92,0],0.32,0.0,0.32,4,ir,0,Math.PI/4);m.box([0,3.33,0],[0.44,0.06,0.44],ir);m.prism([0,4.22,0],0.04,0.0,0.12,6,ir)});
const LGLASS=um(m=>m.box([0,3.62,0],[0.34,0.56,0.34],[1,1,1],MAT.emis));
const LGLOW=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[8,12]));
const POOL=um(m=>{const n=32;for(let i=0;i<n;i++){const a=i/n*TAU2,b=(i+1)/n*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1],MAT.emis)}});
const POLE=um(m=>{tube(m,[0,0,0],[0,2.6,0],0.025,0.02,hx('#3a2a1e'),6);tube(m,[0,2.6,0],[0.12,2.75,0],0.02,0.02,hx('#2a2a2a'),5);m.box([0.13,2.72,0],[0.06,0.1,0.06],hx('#3a3a3a'))});
const BEDROOM=um(m=>{const S=4.5,Hh=3.0,wall=hx('#3a4a78'),wall2=hx('#34426c');
  for(let i=-5;i<5;i++)for(let j=-5;j<5;j++)m.quad([i*0.6,0,j*0.6],[i*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,j*0.6],(i+j)%2?hx('#7a5a3e'):hx('#6e5036'));
  // back wall z=3 with window hole x -0.8..0.8, y 1.0..2.3
  const wz=3.0;m.quad([-S,0,wz],[-S,Hh,wz],[-0.8,Hh,wz],[-0.8,0,wz],wall);m.quad([0.8,0,wz],[0.8,Hh,wz],[S,Hh,wz],[S,0,wz],wall);m.quad([-0.8,2.3,wz],[-0.8,Hh,wz],[0.8,Hh,wz],[0.8,2.3,wz],wall);m.quad([-0.8,0,wz],[-0.8,1.0,wz],[0.8,1.0,wz],[0.8,0,wz],wall);
  m.quad([-3.0,0,-S],[-3.0,Hh,-S],[-3.0,Hh,S],[-3.0,0,S],wall2);m.quad([3.0,0,S],[3.0,Hh,S],[3.0,Hh,-S],[3.0,0,-S],wall2);m.quad([-S,0,-3.4],[S,0,-3.4],[S,Hh,-3.4],[-S,Hh,-3.4],wall);m.quad([-S,Hh,-S],[S,Hh,-S],[S,Hh,S],[-S,Hh,S],hx('#2c3658'));
  // window frame + sill
  const fr=hx('#e8e4dc');m.box([0,1.0,2.95],[1.8,0.1,0.25],fr);m.box([0,2.3,2.97],[1.8,0.1,0.1],fr);for(const sx of[-1,1])m.box([sx*0.85,1.65,2.97],[0.1,1.4,0.1],fr);m.box([0,1.65,2.97],[0.06,1.3,0.06],fr);
  // curtains
  for(const sx of[-1,1])for(let k=0;k<4;k++)m.box([sx*(1.0+k*0.12),1.6,2.88],[0.12,2.2,0.08+0.05*(k%2)],hx('#7a2a3a'));
  // bed
  m.box([-1.9,0.25,1.2],[1.6,0.5,2.6],hx('#5a3a24'));m.box([-1.9,0.6,1.2],[1.5,0.22,2.5],hx('#e8e8f0'));m.box([-1.9,0.74,0.6],[1.52,0.12,1.4],hx('#c84a4a'));m.box([-1.9,0.78,2.2],[1.0,0.16,0.45],hx('#f4f4f8'));m.box([-1.9,0.9,2.5],[1.6,1.3,0.12],hx('#5a3a24'));
  // desk + posters + door
  m.box([2.0,0.75,1.9],[1.6,0.08,0.9],hx('#8a6a4a'));for(const sx of[1.3,2.7])m.box([sx,0.37,1.9],[0.08,0.74,0.8],hx('#6a4a2a'));m.box([2.0,0.95,2.1],[0.5,0.3,0.05],hx('#2a2a30'));
  m.box([-1.9,2.0,2.98],[0.7,0.9,0.02],hx('#e8b84a'));m.box([2.0,2.0,2.98],[0.8,0.6,0.02],hx('#4ab4a8'));
  m.box([0.8,1.05,-3.38],[1.0,2.1,0.04],hx('#4a3020'));m.box([1.15,1.05,-3.34],[0.08,0.08,0.06],hx('#c8a040'))});
const CEILLAMP=um(m=>{m.prism([0,2.9,0],0.02,0.02,0.1,6,hx('#222'));m.ico([0,2.75,0],0.18,[1,1,1],MAT.emis,0.7,[6,10])});
const SNOWF=um(m=>m.ico([0,0,0],1,[1,1,1],0,1,[3,5]));
