// ================= props: Voyager 1, Io, Saturn, ice chunks, heliopause wall, phone, cosmic ray =================
const PAD=[-30,0,-230];// sR.js tower needs it (tower itself unused)
const RING=um(m=>{const N=64;for(let i=0;i<N;i++){const a=i/N*TAU2,b=(i+1)/N*TAU2;const q=(r,an)=>[Math.cos(an)*r,0,Math.sin(an)*r];m.quad(q(0.9,a),q(1,a),q(1,b),q(0.9,b),[1,1,1]);m.quad(q(0.9,b),q(1,b),q(1,a),q(0.9,a),[1,1,1])}});
function discXY(m,c,r,colFn,mat,N){N=N||28;for(let i=0;i<N;i++){const a=i/N*TAU2,b=(i+1)/N*TAU2;const A=[c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,c[2]],B=[c[0]+Math.cos(b)*r,c[1]+Math.sin(b)*r,c[2]];m.tri(c,B,A,[colFn(0,a),colFn(1,b),colFn(1,a)],mat);m.tri(c,A,B,[colFn(0,a),colFn(1,a),colFn(1,b)],mat)}}
// ---- Voyager 1 (samurai stands on top of the 10-sided bus at y=0; dish below, opening downwards)
const VC={white:hx('#e9eaee'),white2:hx('#c9ccd6'),dark:hx('#23242c'),gold:hx('#d6a640'),gold2:hx('#a8782a'),boom:hx('#b8bcc8'),rtg:hx('#3a3a42')};
const VOY=um(m=>{
  // bus: decagon with alternating gold-foil / dark panels
  m.prism([0,-0.44,0],0.86,0.86,0.44,10,VC.dark,0,Math.PI/10);m.prism([0,-0.03,0],0.8,0.8,0.03,10,hx('#4a4c56'),0,Math.PI/10);
  for(let i=0;i<10;i++){const a0=i/10*TAU2+Math.PI/10,a1=(i+1)/10*TAU2+Math.PI/10;const r=0.875;const P=(a,y)=>[Math.cos(a)*r,y,Math.sin(a)*r];const c=i%2?VC.gold:VC.gold2;const ins=0.02;
    const A=P(a0+0.03,-0.4),B=P(a1-0.03,-0.4),C=P(a1-0.03,-0.05),D=P(a0+0.03,-0.05);m.quad(A,D,C,B,[c,mix3(c,[1,0.9,0.6],0.35),c,mix3(c,[0.5,0.35,0.1],0.4)]);m.quad(A,B,C,D,c)}
  // dish (back side up), paraboloid, ribs
  const NR=14,NA=48,RD=1.85;const Y=r=>-0.46-0.55*Math.pow(r/RD,2);
  for(let i=0;i<NR;i++)for(let j=0;j<NA;j++){const r0=i/NR*RD,r1=(i+1)/NR*RD,a0=j/NA*TAU2,a1=(j+1)/NA*TAU2;const P=(r,a)=>[Math.cos(a)*r,Y(r),Math.sin(a)*r];
    const cc=k=>mix3(VC.white,VC.white2,0.25+0.25*Math.sin(k*3.1));m.quad(P(r0,a0),P(r0,a1),P(r1,a1),P(r1,a0),cc(i+j*0.3));m.quad(P(r0,a0),P(r1,a0),P(r1,a1),P(r0,a1),V.sc(VC.white,0.92))}
  for(let k=0;k<12;k++){const a=k/12*TAU2;tube(m,[Math.cos(a)*0.85,Y(0.85)+0.012,Math.sin(a)*0.85],[Math.cos(a)*RD,Y(RD)+0.012,Math.sin(a)*RD],0.014,0.01,VC.white2,5)}
  // subreflector tripod below
  for(let k=0;k<3;k++){const a=k/3*TAU2+0.3;tube(m,[Math.cos(a)*1.55,Y(1.55),Math.sin(a)*1.55],[0,-1.75,0],0.014,0.012,VC.boom,5)}
  m.prism([0,-1.82,0],0.22,0.26,0.08,16,VC.white2);
  // RTG boom (-x) with 3 finned RTGs
  tube(m,[-0.8,-0.25,0.1],[-3.2,-0.55,0.5],0.035,0.03,VC.boom,6);
  for(let k=0;k<3;k++){const f=0.45+k*0.2;const c=lerp3([-0.8,-0.25,0.1],[-3.2,-0.55,0.5],f);tube(m,V.add(c,[0.17,0.03,-0.03]),V.add(c,[-0.17,-0.03,0.03]),0.16,0.16,VC.rtg,10);
    for(let q=0;q<6;q++){const a=q/6*TAU2;m.box(V.add(c,[0,Math.cos(a)*0.2,Math.sin(a)*0.2]),[0.3,0.06,0.06],hx('#2a2a30'))}}
  // science boom (+x, towards camera) with scan platform
  tube(m,[0.8,-0.22,-0.15],[2.7,-0.35,-0.75],0.035,0.03,VC.boom,6);m.box([2.75,-0.33,-0.78],[0.42,0.32,0.36],VC.gold2);m.box([2.75,-0.12,-0.78],[0.3,0.12,0.3],VC.dark);
  for(const dz of[-0.07,0.08]){tube(m,[2.75+dz,-0.25,-0.96],[2.75+dz,-0.25,-1.12],0.06,0.07,hx('#18181c'),10)}
  // magnetometer boom (long, +z away from camera, up)
  for(let k=0;k<3;k++){const a=k/3*TAU2;const o=[Math.cos(a)*0.05,Math.sin(a)*0.05,0];tube(m,V.add([0.55,-0.1,0.6],o),V.add([4.5,1.6,9.5],o),0.012,0.01,VC.boom,4)}
  // thrusters
  for(let k=0;k<4;k++){const a=k/4*TAU2+0.4;m.prism([Math.cos(a)*0.86,-0.46,Math.sin(a)*0.86],0.03,0.07,0.1,8,hx('#606068'))}
},0.4);
// golden record on the camera-facing (-z) side of the bus (separate so it can shine)
const GREC=um(m=>{discXY(m,[0,0,0],1,(e,a)=>mix3(hx('#ffe08a'),hx('#c8901e'),0.35+0.35*Math.sin(a*2+e*2)),0,40);for(let k=1;k<5;k++){const r=k*0.2;for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.quad([Math.cos(a)*r,Math.sin(a)*r,-0.003],[Math.cos(b)*r,Math.sin(b)*r,-0.003],[Math.cos(b)*(r+0.025),Math.sin(b)*(r+0.025),-0.003],[Math.cos(a)*(r+0.025),Math.sin(a)*(r+0.025),-0.003],hx('#a8701a'))}}},0);
const GREC_P=[0.0,-0.22,-0.835];
// ---- Io (unlit, baked like PLAN)
const IOM=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);let c=mix3(hx('#e8c84a'),hx('#f6e8a0'),fbm(n[0]*3+1,n[1]*3+n[2]*3,4));c=mix3(c,hx('#c86a2a'),smst(0.55,0.75,fbm(n[0]*5+3,n[2]*5+n[1]*2,3))*0.6);
  const sp=vnoise(n[0]*11+n[2]*5,n[1]*11);c=mix3(c,hx('#3a2a1a'),smst(0.72,0.8,sp)*0.8);c=mix3(c,hx('#a04020'),smst(0.62,0.7,vnoise(n[1]*14,n[2]*14+n[0]*3))*0.5);return litP(c,p,[1,0.85,0.4])},[28,44],MAT.glass));
// ---- big Saturn with detailed rings (unlit, baked)
const SATB=um(m=>{sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const y=n[1]+0.02*(fbm(n[0]*5,n[2]*5,3)-0.5);const b=Math.sin(y*26)*0.5+0.5;let c=mix3(hx('#c8a46a'),hx('#f2e2b6'),b);c=mix3(c,hx('#a8845a'),smst(0.7,1,Math.sin(y*7))*0.4);if(n[1]>0.85)c=mix3(c,hx('#8aa0a8'),0.4);return litP(c,p,[0.9,0.8,0.55])},[32,48],MAT.glass);
  const bands=[[1.24,1.52,'#7a6a58',0.5],[1.52,1.95,'#e6d2a6',0.95],[1.95,2.02,'#100c0a',0.1],[2.02,2.27,'#d2bc8e',0.85],[2.27,2.3,'#403428',0.4]];
  for(let i=0;i<96;i++){const a=i/96*TAU2,b=(i+1)/96*TAU2;for(const[r0,r1,cs,al]of bands){const q=(r,an)=>[Math.cos(an)*r,0,Math.sin(an)*r];const sh=(an)=>{const p=[Math.cos(an),0,Math.sin(an)];return (p[2]>0&&Math.abs(p[0])<1)?0.35:1};// planet shadow on the far side
      const col=(r,an)=>V.sc(mix3(hx(cs),[1,0.97,0.9],0.12*Math.sin(r*90)),(0.55+0.45*al)*((an>Math.PI*0.35&&an<Math.PI*0.65&&r<2.4)?0.4:1));
      m.quad(q(r0,a),q(r1,a),q(r1,b),q(r0,b),[col(r0,a),col(r1,a),col(r1,b),col(r0,b)],MAT.glass);m.quad(q(r0,b),q(r1,b),q(r1,a),q(r0,a),[col(r0,b),col(r1,b),col(r1,a),col(r0,a)],MAT.glass)}}});
// ---- ice chunk (lit, glossy-ish)
const CHUNK=um(m=>blob(m,[0,0,0],1,p=>mix3(hx('#cfe6ff'),hx('#ffffff'),clamp(p[1]*0.5+0.5,0,1)),7,0.85,[8,12]),0.0);
const CHALF=um(m=>{blob(m,[0,0,0],1,p=>mix3(hx('#cfe6ff'),hx('#ffffff'),clamp(p[1]*0.5+0.5,0,1)),7,0.85,[8,12])},0.0);
// ---- heliopause wall: big emissive noisy disc in the xy plane
const WALL=um(m=>{const NR=26,NA=72,RW=90;for(let i=0;i<NR;i++)for(let j=0;j<NA;j++){const r0=i/NR*RW,r1=(i+1)/NR*RW,a0=j/NA*TAU2,a1=(j+1)/NA*TAU2;
  const P=(r,a)=>[Math.cos(a)*r,Math.sin(a)*r,3*(fbm(Math.cos(a)*r*0.05+4,Math.sin(a)*r*0.05,3)-0.5)];const C=(r,a)=>{const x=Math.cos(a)*r,y=Math.sin(a)*r;const f=fbm(x*0.04+2,y*0.04+7,4),g=fbm(x*0.12+f*3,y*0.12,3);
    let c=mix3(hx('#ff3a7a'),hx('#ffb04a'),smst(0.35,0.75,g));c=mix3(c,hx('#7a2aff'),smst(0.55,0.25,f)*0.6);return V.sc(c,(0.35+0.9*smst(0.4,0.8,f*0.6+g*0.6))*(1-smst(0.6,1,r/RW)))};
  m.quad(P(r0,a0),P(r1,a0),P(r1,a1),P(r0,a1),[C(r0,a0),C(r1,a0),C(r1,a1),C(r0,a1)],MAT.glass);m.quad(P(r0,a0),P(r0,a1),P(r1,a1),P(r1,a0),[C(r0,a0),C(r0,a1),C(r1,a1),C(r1,a0)],MAT.glass)}});
// ---- phone (left hand)
const PHONE=um(m=>{m.box([0,0,0],[0.07,0.13,0.012],hx('#18181e'));m.box([0,0.004,-0.0065],[0.06,0.11,0.002],hx('#7ae8ff'),MAT.emis)},0);
// ---- pale blue dot
const EDOT=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);return mix3(hx('#3a7aff'),hx('#cfe8ff'),clamp(-n[2]*0.6+n[1]*0.4,0,1))},[10,16],MAT.glass));
