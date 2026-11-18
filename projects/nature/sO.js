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
// ---------------- MANTIS SHRIMP (peacock) ----------------
const MS_SH=[[0.045,0.075,0.25],[-0.045,0.075,0.25]];
const MANTIS=um(m=>{const G=MAT.plain||0;
  for(let i=0;i<8;i++){const z=-0.29+i*0.058,r=0.05+0.016*Math.sin(i/7*Math.PI*0.9);const ca=mix3(hx('#1f9a7a'),hx('#4cc85a'),i/6),cb=mix3(hx('#0d5a6a'),hx('#2f8a3a'),i/6);
    ell(m,[0,0.07,z],[r*1.35,r*0.62,0.042],(p,u)=>{let c=mix3(cb,ca,clamp(u[1]*0.7+0.5,0,1));if(u[2]>0.75)c=mix3(c,hx('#ff8a3a'),0.6);if(u[1]<-0.3)c=mix3(c,hx('#f0c8a0'),0.5);return c},[8,14])}
  ell(m,[0,0.085,0.17],[0.085,0.045,0.1],(p,u)=>mix3(hx('#1e7a3a'),hx('#7ae05a'),clamp(u[1]*0.8+0.4,0,1)),[10,16]);
  // eyes on stalks
  for(const sx of[-1,1]){tube(m,[sx*0.025,0.13,0.25],[sx*0.045,0.2,0.28],0.012,0.01,hx('#3ab8a8'),6);ell(m,[sx*0.048,0.215,0.285],[0.025,0.032,0.025],(p,u)=>{const b=Math.abs(u[1])<0.18;return b?hx('#f0f0ff'):(u[1]>0?hx('#5a3aa8'):hx('#2a8ab8'))},[8,10],MAT.emis);
    tube(m,[sx*0.03,0.12,0.27],[sx*0.12,0.2,0.38],0.006,0.003,hx('#ff7a3a'),4);tube(m,[sx*0.02,0.1,0.27],[sx*0.08,0.13,0.4],0.006,0.003,hx('#3ab8ff'),4);
    m.quad([sx*0.04,0.11,0.29],[sx*0.1,0.13,0.36],[sx*0.08,0.15,0.36],[sx*0.03,0.12,0.29],hx('#ff9a4a'));m.quad([sx*0.03,0.12,0.29],[sx*0.08,0.15,0.36],[sx*0.1,0.13,0.36],[sx*0.04,0.11,0.29],hx('#ff9a4a'));
    for(let k=0;k<4;k++){const z=0.05-k*0.06;tube(m,[sx*0.04,0.05,z],[sx*0.09,0.0,z+0.02],0.009,0.006,hx('#ff5a3a'),5)}}
  // tail fan
  for(const[a,c]of[[-0.6,'#ff8a3a'],[-0.2,'#2a8ad8'],[0.2,'#2a8ad8'],[0.6,'#ff8a3a']]){const d=[Math.sin(a),0,-Math.cos(a)];const b=[0,0.07,-0.32];const e=V.add(b,V.sc(d,0.13));const s=V.sc(V.norm(V.cross(d,[0,1,0])),0.025);
    m.quad(V.add(b,s),V.add(e,s),V.add(e,V.sc(s,-1)),V.sub(b,s),hx(c));m.quad(V.sub(b,s),V.add(e,V.sc(s,-1)),V.add(e,s),V.add(b,s),hx(c))}},0.5);
// raptorial arm: origin at shoulder, extends along local +z
const MARM=um(m=>{tube(m,[0,0,0],[0,0,0.11],0.018,0.016,hx('#ff5a6a'),8);tube(m,[0,0,0.11],[0,0.0,0.15],0.016,0.03,hx('#ff8aa0'),8);
  ell(m,[0,0,0.165],[0.032,0.034,0.035],(p,u)=>mix3(hx('#ffd0e0'),hx('#ffffff'),clamp(u[2],0,1)),[8,12])},0.5);
// ---------------- PISTOL SHRIMP ----------------
const PISTOL=um(m=>{for(let i=0;i<6;i++){const z=-0.2+i*0.055;const r=0.035+0.012*Math.sin(i/5*Math.PI);ell(m,[0,0.05,z],[r*1.2,r*0.7,0.036],(p,u)=>{const band=(i%2===0)?1:0;return mix3(hx('#d84a3a'),hx('#ffb0a0'),band*0.5+clamp(u[1],0,1)*0.3)},[8,12])}
  ell(m,[0,0.06,0.13],[0.045,0.04,0.075],(p,u)=>mix3(hx('#c83a2a'),hx('#ff9a80'),clamp(u[1]*0.8+0.3,0,1)),[10,14]);
  for(const sx of[-1,1]){ell(m,[sx*0.022,0.075,0.205],[0.014,0.014,0.014],()=>hx('#1a1020'),[6,8],MAT.emis);tube(m,[sx*0.015,0.07,0.2],[sx*0.1,0.12,0.36],0.004,0.002,hx('#ff6a4a'),4);
    for(let k=0;k<4;k++){const z=0.06-k*0.05;tube(m,[sx*0.03,0.03,z],[sx*0.07,0.0,z+0.02],0.006,0.004,hx('#ff7a5a'),5)}}
  for(const a of[-0.5,0,0.5]){const d=[Math.sin(a),0,-Math.cos(a)];const b=[0,0.05,-0.22];const e=V.add(b,V.sc(d,0.08));const s=V.sc(V.norm(V.cross(d,[0,1,0])),0.02);m.quad(V.add(b,s),V.add(e,s),V.add(e,V.sc(s,-1)),V.sub(b,s),hx('#ff8a6a'));m.quad(V.sub(b,s),V.add(e,V.sc(s,-1)),V.add(e,s),V.add(b,s),hx('#ff8a6a'))}
  // small claw left
  tube(m,[-0.04,0.04,0.15],[-0.06,0.03,0.24],0.01,0.012,hx('#e85a4a'),6)},0.5);
const PCLAW_W=[0.055,0.05,0.16];// wrist on body
const PCLAW=um(m=>{tube(m,[0,0,-0.03],[0,0,0.03],0.018,0.03,hx('#d84a3a'),8);ell(m,[0,0,0.1],[0.05,0.042,0.085],(p,u)=>mix3(hx('#b8302a'),hx('#ff8a70'),clamp(u[1]*0.7+0.4,0,1)),[10,14]);
  // fixed finger (bottom)
  tube(m,[0,-0.018,0.17],[0,-0.022,0.25],0.02,0.008,hx('#ff9a80'),8)},0.5);
const PDACT=um(m=>{tube(m,[0,0,0],[0,0.0,0.085],0.022,0.009,hx('#ffb0a0'),8);ell(m,[0,-0.012,0.02],[0.014,0.016,0.014],()=>hx('#ffc8b8'),[6,8])},0.5);
const PDACT_H=[0,0.022,0.17];
// ---------------- SALTWATER CROCODILE ----------------
const CR_HINGE=[0,0.42,1.0];
const CROC=um(m=>{const dk=hx('#3d4a2a'),md=hx('#5a6638'),bel=hx('#c8c098');
  ell(m,[0,0.36,0],[0.55,0.27,1.15],(p,u)=>{let c=mix3(dk,md,fbm(p[0]*6,p[2]*6,3));if(u[1]<-0.2)c=mix3(c,bel,clamp(-u[1]*1.5-0.3,0,1));return c},[12,22]);
  ell(m,[0,0.4,0.9],[0.36,0.2,0.35],(p,u)=>mix3(dk,md,fbm(p[0]*8,p[2]*8,2)),[8,14]);
  // scutes
  for(let i=0;i<12;i++)for(const sx of[-1,1,-2,2]){const z=-1.0+i*0.17;const x=sx*0.1;if(Math.abs(sx)===2&&(i<2||i>10))continue;m.prism([x,0.6+0.03*Math.cos(z*1.3)-(Math.abs(sx)===2?0.04:0),z],0.045,0.0,0.07,4,hx('#2e3820'))}
  // legs
  for(const[sx,z]of[[-1,0.65],[1,0.65],[-1,-0.6],[1,-0.6]]){const hip=[sx*0.42,0.32,z],knee=[sx*0.72,0.22,z+0.08],foot=[sx*0.78,0.03,z+0.18];tube(m,hip,knee,0.12,0.09,dk,8);tube(m,knee,foot,0.08,0.06,dk,8);
    for(let k=-1;k<=1;k++)tube(m,foot,V.add(foot,[sx*0.05+k*0.06,-0.02,0.16]),0.03,0.012,dk,5)}},0.5);
const CTAIL=um(m=>{tube(m,[0,0,0],[0,0,-1],1,0.82,hx('#3d4a2a'),12);for(let i=0;i<4;i++){const z=-0.12-i*0.24;m.prism([0,0.95-i*0.03,z],0.18,0.0,0.32,4,hx('#2e3820'))}},0.5);
// upper head: origin at hinge, snout to +z ~1.0
const CHEAD=um(m=>{const dk=hx('#3d4a2a'),md=hx('#56603a');const L=1.0;
  const sec=z=>{const k=z/L;return{w:0.3-0.17*k,h:0.16-0.09*k,y:0.02-0.0*k}};const N=10;
  for(let i=0;i<N;i++){const z0=i/N*L,z1=(i+1)/N*L;const a=sec(z0),b=sec(z1);const P=(s,z,ang)=>[Math.cos(ang)*s.w,s.y+Math.max(0,Math.sin(ang))*s.h,z];
    for(let j=0;j<12;j++){const a0=j/12*Math.PI,a1=(j+1)/12*Math.PI;const col=mix3(dk,md,fbm(z0*7,j*0.7,2));m.quad(P(a,z0,a0),P(a,z0,a1),P(b,z1,a1),P(b,z1,a0),col)}
    m.quad([-a.w,a.y,z0],[a.w,a.y,z0],[b.w,b.y,z1],[-b.w,b.y,z1],hx('#e0a0a0'))}
  m.quad([-0.13,0.02,L],[0.13,0.02,L],[0.13,0.09,L],[-0.13,0.09,L],dk);
  ell(m,[0,0.12,-0.05],[0.3,0.18,0.25],(p,u)=>mix3(dk,md,clamp(u[1],0,1)),[8,12]);
  for(const sx of[-1,1]){ell(m,[sx*0.17,0.27,0.02],[0.07,0.06,0.07],(p,u)=>u[2]>0.4&&u[1]>-0.1?hx('#e8c040'):dk,[8,10]);m.box([sx*0.17,0.29,0.085],[0.012,0.05,0.01],hx('#101010'));
    for(let k=0;k<11;k++){const z=0.08+k*0.085;const w=sec(z).w;m.prism([sx*(w-0.025),0.02,z],0.018,0.0,-0.07-0.02*(k%3===0),5,hx('#f4f0dc'))}}
  ell(m,[0,0.09,0.98],[0.06,0.03,0.04],()=>hx('#2e3820'),[6,8])},0.5);
const CJAW=um(m=>{const dk=hx('#4a5532');const L=0.98;const N=10;for(let i=0;i<N;i++){const z0=i/N*L,z1=(i+1)/N*L;const w0=0.28-0.16*z0/L,w1=0.28-0.16*z1/L;const h=0.1;
    m.quad([-w0,0,z0],[-w1,0,z1],[w1,0,z1],[w0,0,z0],hx('#d88a8a'));m.quad([-w0,-h,z0],[w0,-h,z0],[w1,-h*0.8,z1],[-w1,-h*0.8,z1],hx('#c8c098'));
    for(const sx of[-1,1]){m.quad([sx*w0,0,z0],[sx*w0,-h,z0],[sx*w1,-h*0.8,z1],[sx*w1,0,z1],dk);m.quad([sx*w1,0,z1],[sx*w1,-h*0.8,z1],[sx*w0,-h,z0],[sx*w0,0,z0],dk)}}
  ell(m,[0,-0.02,0.0],[0.27,0.1,0.15],()=>dk,[6,10]);
  for(const sx of[-1,1])for(let k=0;k<10;k++){const z=0.12+k*0.085;const w=0.28-0.16*z/L;m.prism([sx*(w-0.03),0,z],0.016,0.0,0.065+0.02*(k%3===1),5,hx('#f4f0dc'))}},0.5);
// sheath prop jammed in the jaws (local +y)
const STICK=um(m=>{tube(m,[0,0,0],[0,0.5,0],0.024,0.022,hx('#151018'),10);tube(m,[0,-0.01,0],[0,0.04,0],0.028,0.028,hx('#d0a040'),10);tube(m,[0,0.46,0],[0,0.51,0],0.026,0.026,hx('#d0a040'),10)},0.6);
// ---------------- SPERM WHALE (~16 m) ----------------
const WHALE=um(m=>{const g1=hx('#2e3440'),g2=hx('#5a6272');
  ell(m,[0,0,3.6],[1.55,1.75,4.4],(p,u)=>mix3(g1,g2,fbm(p[0]*0.8,p[2]*0.8+p[1],3)*0.8),[14,22]);
  ell(m,[0,-0.2,-1.6],[1.65,1.6,4.6],(p,u)=>mix3(g1,g2,fbm(p[0]*0.8+3,p[2]*0.8,3)*0.7),[12,20]);
  tube(m,[0,0,-5.4],[0,0.2,-9.6],1.25,0.35,g1,12);
  for(let k=0;k<5;k++)m.prism([0,1.5-k*0.25,-3.5-k*1.1],0.35,0.0,0.4,5,g2);
  for(const sx of[-1,1]){const r=[0,0.2,-9.6],t=[sx*2.6,0.25,-10.6],b=[sx*0.4,0.2,-10.2];m.tri(r,t,b,g1);m.tri(r,b,t,g1);
    ell(m,[sx*1.35,-0.4,4.2],[0.12,0.12,0.12],()=>hx('#101218'),[5,6]);
    ell(m,[sx*1.4,-0.9,1.5],[0.15,0.45,0.9],()=>g1,[6,8],0,-0.6)}
  ell(m,[0,-1.6,3.4],[0.35,0.18,3.6],()=>hx('#c8c4bc'),[6,10])},0.5);
// ---------------- MOSQUITO (Aedes; 1 unit = body, scale ~0.035) ----------------
const MOSQ=um(m=>{const blk=hx('#2a2a34'),wht=hx('#f4f4ff');
  ell(m,[0,0,0.36],[0.09,0.09,0.09],()=>blk,[8,10]);
  for(const sx of[-1,1]){ell(m,[sx*0.06,0.03,0.4],[0.05,0.06,0.05],()=>hx('#3a2a60'),[6,8],MAT.emis);tube(m,[sx*0.03,0.05,0.42],[sx*0.12,0.18,0.62],0.012,0.006,hx('#3a3a40'),4)}
  tube(m,[0,-0.03,0.43],[0,-0.22,0.9],0.014,0.006,blk,5);
  ell(m,[0,0.03,0.15],[0.13,0.14,0.17],(p,u)=>{const lyre=Math.abs(Math.abs(u[0])-0.3)<0.08&&u[1]>0.3;return lyre||Math.abs(u[0])<0.05&&u[1]>0.5?wht:blk},[10,14]);
  ell(m,[0,-0.02,-0.38],[0.09,0.08,0.34],(p,u)=>{const s=Math.sin((p[2]+0.04)*55);return s>0.75&&u[1]>-0.2?wht:blk},[10,18],0,0.25);
  for(let k=0;k<3;k++)for(const sx of[-1,1]){const r=[sx*0.08,-0.05,0.24-k*0.1];const kn=[sx*(0.38+k*0.05),0.12,0.4-k*0.35];const ft=[sx*(0.55+k*0.12),-0.55,0.6-k*0.7];
    tube(m,r,kn,0.016,0.012,blk,4);tube(m,kn,ft,0.012,0.006,blk,4);for(let b=1;b<4;b++){const q=lerp3(kn,ft,b/4);tube(m,q,lerp3(kn,ft,b/4+0.04),0.013,0.013,wht,4)}}},0.5);
const WING=um(m=>{const P=[[0,0,0],[0.12,0,-0.08],[0.52,0,-0.32],[0.75,0,-0.4],[0.62,0,-0.48],[0.2,0,-0.2]];const c=[0.8,0.85,0.95];for(let i=1;i<P.length-1;i++){m.tri(P[0],P[i],P[i+1],c);m.tri(P[0],P[i+1],P[i],c)}});
const MBLOOD=um(m=>ell(m,[0,-0.02,-0.38],[0.1,0.1,0.36],()=>hx('#c81830'),[8,14],0,0.25),0.5);
// ---------------- DANGO + tea cup ----------------
const DANGO=um(m=>{tube(m,[0,-0.08,0],[0,0.2,0],0.005,0.005,hx('#d8b880'),5);for(const[y,c]of[[0.03,'#f4a0b8'],[0.085,'#fbf4ea'],[0.14,'#8ac860']])ell(m,[0,y,0],[0.028,0.026,0.028],()=>hx(c),[8,10])},0.5);
const TOASTM=um(m=>{for(const y of[0.03,0.085,0.14])ell(m,[0,y,0],[0.0285,0.0265,0.0285],(p,u)=>mix3(hx('#8a4a1a'),hx('#d89a4a'),vnoise(u[0]*4+y*30,u[1]*4)),[8,10])},0.5);
