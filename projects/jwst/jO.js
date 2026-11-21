// ================= JWST props (The What If Lab, 2026-11-21) =================
// JW: James Webb Space Telescope. Samurai stands on the top sunshield layer at y=0 (origin).
// Mirror: 18 gold flat-top hexagons (6.5 m), on a tower behind-left of the samurai, facing the camera (-z) and tilted up.
const JWC={gold:hx('#f4c24a'),gold2:hx('#c98d1c'),gold3:hx('#ffe28a'),back:hx('#1c1c24'),strut:hx('#2a2a32'),mem:hx('#8a7fb0'),mem2:hx('#6c5f98'),memE:hx('#4a3c78'),bus:hx('#2c2c34'),sol:hx('#22305a')};
const MIR_C=[-3.9,3.5,2.9],MIR_YAW=-0.55,MIR_TILT=-0.32;// mirror centre (world), yaw (turn to face camera-right), tilt (face up a bit)
const MIR_M=M4.mul(M4.trs(MIR_C,MIR_YAW,MIR_TILT,0,1),M4.trs([0,0,0],0,0,0,1));
const HEXS=(()=>{const s=0.762,L=[];for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++){const d=Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));if(d<1||d>2)continue;L.push([s*1.5*q,s*Math.sqrt(3)*(r+q/2)])}return L})();
function hexAt(m,cx,cy,rad,colFn,zf,mat){const P=a=>{const x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;return[x,y,zf(x,y)]};const c=[cx,cy,zf(cx,cy)];
  for(let k=0;k<6;k++){const a=k/6*TAU2,b=(k+1)/6*TAU2;const A=P(a),B=P(b);m.tri(c,A,B,[colFn(c,0),colFn(A,1),colFn(B,1)],mat);m.tri(c,B,A,[colFn(c,0),colFn(B,1),colFn(A,1)],mat)}}
const MIRZ=(x,y)=>-(x*x+y*y)/(4*7.8);// concave towards -z (the viewer)
const JWM=um(m=>{// mirror in local frame: xy plane, facing -z
  HEXS.forEach(([cx,cy],i)=>{hexAt(m,cx,cy,0.745,(p,e)=>{const g=0.5+0.5*Math.sin(p[0]*2.3+p[1]*1.7+i);let c=mix3(JWC.gold,JWC.gold3,0.55*g*(1-e*0.5));return mix3(c,JWC.gold2,e*0.35)},MIRZ,0);
    hexAt(m,cx,cy,0.78,()=>JWC.back,(x,y)=>MIRZ(x,y)+0.05,0)});
  // backplane + tower
  m.box([0,0,0.35],[2.6,4.6,0.45],JWC.back);m.box([0,-0.2,0.85],[1.4,1.8,0.8],hx('#3a3a46'));
  tube(m,[0,-1.2,0.6],[0,-3.4,1.2],0.22,0.26,JWC.strut,8);
  // secondary mirror: 3 struts to a small disc ~4.2 m in front
  const SM=[0,0.25,-4.2];const feet=[[0,3.25,-0.3],[-2.8,-1.6,-0.3],[2.8,-1.6,-0.3]];for(const f of feet)tube(m,f,SM,0.035,0.03,JWC.strut,6);
  m.prism(V.add(SM,[0,0,0]),0.38,0.38,0.08,6,JWC.gold2,0,0);
},0.3);
// small secondary mirror is built as y-up prism – good enough at this size.
const JWS=um(m=>{// sunshield: 5 stacked kite-hexagon membranes + spacecraft bus underneath
  const SHP=[[-10.5,0],[-5.2,7],[5.2,7],[10.5,0],[5.2,-7],[-5.2,-7]];const off=[-2.4,0,3.2];
  for(let L=0;L<5;L++){const y=-0.03-L*0.26,s=1+L*0.035;const pts=SHP.map(([x,z])=>[off[0]+x*s,y,off[2]+z*s]);const ctr=[off[0],y-0.06*L,off[2]];
    const col=p=>{const n=fbm(p[0]*0.25+L,p[2]*0.25,3);let c=mix3(L===0?JWC.mem:JWC.mem2,hx('#d8ccf2'),0.35*n);if(L>0)c=V.sc(c,0.8-L*0.08);return c};
    for(let k=0;k<6;k++){const A=pts[k],B=pts[(k+1)%6];// subdivide for wrinkle shading
      const N=6;for(let i=0;i<N;i++){const a0=lerp3(ctr,A,i/N),a1=lerp3(ctr,A,(i+1)/N),b0=lerp3(ctr,B,i/N),b1=lerp3(ctr,B,(i+1)/N);const w=(p,j)=>[p[0],p[1]+0.03*Math.sin(p[0]*1.7+p[2]*2.1+j),p[2]];
        const q=[w(a0,i),w(a1,i+1),w(b1,i+1),w(b0,i)];m.quad(q[0],q[1],q[2],q[3],q.map(col));m.quad(q[0],q[3],q[2],q[1],q.map(p=>V.sc(col(p),0.7)))}
      // glowing-ish edge strip
      m.quad([A[0],A[1]+0.015,A[2]],[B[0],B[1]+0.015,B[2]],[B[0],B[1]-0.02,B[2]],[A[0],A[1]-0.02,A[2]],JWC.memE)}}
  // spreader booms between layers
  for(const[x,z]of SHP){const p=[off[0]+x*1.08,0,off[2]+z*1.08];tube(m,V.add(p,[0,-0.0,0]),V.add(p,[0,-1.2,0]),0.04,0.04,JWC.strut,5)}
  // bus + solar panel on the warm side
  m.box([off[0],-1.9,off[2]],[3.2,1.3,2.6],JWC.bus);m.box([off[0],-2.0,off[2]-3.2],[2.4,0.08,4.2],JWC.sol);
  for(let i=0;i<6;i++)m.box([off[0],-1.95,off[2]-1.4-i*0.65],[2.3,0.02,0.05],hx('#5a6a9a'));
  m.prism([off[0]+1.2,-2.6,off[2]+0.9],0.5,0.2,0.4,16,hx('#d8d8e0'));
},0.25);
// thruster nozzles on the front sunshield edge (comedy: they push the whole thing into a spin)
const JTH=[[3.6,-0.55,-4.35,1],[-6.4,-0.55,-4.35,-1]];
const JNOZ=um(m=>{m.prism([0,-0.12,0],0.07,0.13,0.24,10,hx('#5a5a62'));m.prism([0,0.12,0],0.13,0.13,0.03,10,hx('#3a3a40'))},0.4);
// ---- exoplanets (unlit, baked)
const W107=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const y=n[1]+0.05*(fbm(n[0]*4,n[2]*4,3)-0.5);const b=Math.sin(y*14+fbm(n[0]*3,n[2]*3,2)*3)*0.5+0.5;
  let c=mix3(hx('#9a5a2e'),hx('#f0c890'),b);c=mix3(c,hx('#6a3418'),smst(0.6,0.9,fbm(n[0]*6+2,n[1]*9,3))*0.45);return litP(c,p,[1,0.75,0.45])},[32,48],MAT.glass));
const W17=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const y=n[1]+0.04*(fbm(n[0]*5,n[2]*5,3)-0.5);const b=Math.sin(y*18)*0.5+0.5;
  let c=mix3(hx('#6a8ad0'),hx('#dceaff'),b*0.8);const sp=vnoise(n[0]*30+n[2]*11,n[1]*30);c=mix3(c,hx('#ffffff'),smst(0.82,0.9,sp)*0.7);return litP(c,p,[0.6,0.8,1])},[32,48],MAT.glass));
// ---- quartz crystal (hexagonal prism with pointed ends), and a half (cut) crystal
function crys(m,half){const r=0.42,h0=half?0:-0.55,h1=0.55,tip=1.0;const col=(y,k)=>mix3(hx('#4a7ad8'),hx('#d8ecff'),clamp(0.35+y*0.45+0.3*Math.sin(k*2.1),0,1));
  for(let k=0;k<6;k++){const a=k/6*TAU2,b=(k+1)/6*TAU2;const P=(an,y)=>[Math.cos(an)*r,y,Math.sin(an)*r];
    m.quad(P(a,h0),P(a,h1),P(b,h1),P(b,h0),[col(h0,k),col(h1,k),col(h1,k+1),col(h0,k+1)],MAT.emis);
    m.tri(P(a,h1),[0,tip,0],P(b,h1),[col(h1,k),[1,1,1],col(h1,k+1)],MAT.emis);
    if(half)m.tri(P(a,h0),P(b,h0),[0,h0,0],[hx('#e8f6ff'),hx('#e8f6ff'),[1,1,1]],MAT.emis);else m.tri(P(a,h0),P(b,h0),[0,-tip,0],[col(h0,k),col(h0,k+1),[1,1,1]],MAT.emis)}}
const CRYS=um(m=>crys(m,false),0.0);const CRYH=um(m=>crys(m,true),0.0);
// ---- the most distant galaxy (red smudge), unlit
const GAL=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);return mix3(hx('#ff3a2a'),hx('#ffd0a0'),clamp(-n[2]*0.7,0,1))},[12,18],MAT.glass));
Object.assign(PL_HALO,{w107:[1,0.7,0.4],w17:[0.55,0.75,1],gal:[1,0.3,0.2]});
// ---- Cosmic Cliffs (Carina): emissive noisy disc in the xy plane, orange dusty cliffs below a ridge, blue gas above, little stars
const CLIFF=um(m=>{const NR=26,NA=72,RW=90;for(let i=0;i<NR;i++)for(let j=0;j<NA;j++){const r0=i/NR*RW,r1=(i+1)/NR*RW,a0=j/NA*TAU2,a1=(j+1)/NA*TAU2;
  const P=(r,a)=>[Math.cos(a)*r,Math.sin(a)*r,3*(fbm(Math.cos(a)*r*0.05+4,Math.sin(a)*r*0.05,3)-0.5)];const C=(r,a)=>{const x=Math.cos(a)*r,y=Math.sin(a)*r;const f=fbm(x*0.04+2,y*0.04+7,4),g=fbm(x*0.1+f*3,y*0.1,3);
    const ridge=y-(-6+14*(fbm(x*0.05+9,1.3,3)-0.5));let c;if(ridge<0){c=mix3(hx('#5a2a12'),hx('#ff9a3a'),smst(-14,0,ridge)*(0.5+0.6*g))}else{c=mix3(hx('#ffd27a'),hx('#3a6aff'),smst(0,10,ridge));c=mix3(c,hx('#8a4aff'),smst(0.55,0.8,g)*0.4)}
    const st=vnoise(x*1.7,y*1.7);c=mix3(c,[1,1,1],smst(0.93,0.97,st));return V.sc(c,(0.45+0.8*smst(0.3,0.8,f*0.6+g*0.6))*(1-smst(0.6,1,r/RW)))};
  m.quad(P(r0,a0),P(r1,a0),P(r1,a1),P(r0,a1),[C(r0,a0),C(r1,a0),C(r1,a1),C(r0,a1)],MAT.glass);m.quad(P(r0,a0),P(r0,a1),P(r1,a1),P(r1,a0),[C(r0,a0),C(r0,a1),C(r1,a1),C(r1,a0)],MAT.glass)}});
