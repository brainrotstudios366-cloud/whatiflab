// ================= opponents / props (planets) =================
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.55,0.48],[0.8,0.74,0.66],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1])}});
const PUFF=um(m=>blob(m,[0,0,0],1,p=>mix3([0.78,0.78,0.8],[0.97,0.97,0.98],clamp(p[1]*0.5+0.5,0,1)),3,0.9,[7,10]),0.5);
function sphC(mb,c,r,colFn,res,mat){const la=res[0],lo=res[1];const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[c[0]+Math.sin(th)*Math.cos(ph)*r,c[1]+Math.cos(th)*r,c[2]+Math.sin(th)*Math.sin(ph)*r]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
const GSPH=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.glass,1,[16,24]));
// ---- planets: unlit (MAT.glass) with baked lighting; camera sees the -z face ----
const PL_L=V.norm([-0.55,0.42,-0.72]);
function litP(base,p,rim){const n=V.norm(p);const lam=clamp(V.dot(n,PL_L),0,1);const f=0.1+0.95*Math.pow(lam,0.8);const edge=Math.pow(1-Math.abs(n[2]),3);return V.add(V.sc(base,f),V.sc(rim||[0,0,0],edge*(0.3+0.7*lam)))}
const PLAN={};
{const res=[30,48],G=MAT.glass;
  PLAN.mer=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);let c=mix3(hx('#8a8580'),hx('#c9c2b8'),fbm(n[0]*3+2,n[1]*3+n[2]*2,4));const cr=vnoise(n[0]*9+n[2]*4,n[1]*9);c=mix3(c,hx('#5e5a56'),smst(0.62,0.75,cr)*0.7);return litP(c,p,[0.3,0.28,0.25])},res,G));
  PLAN.ven=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const sw=fbm(n[0]*2.5+n[1]*4,n[1]*6+n[2]*2,4);let c=mix3(hx('#e8c27a'),hx('#fff0c8'),sw);c=mix3(c,hx('#c8904a'),smst(0.55,0.8,vnoise(n[1]*10+sw*3,n[0]*2))*0.5);return litP(c,p,[0.9,0.75,0.4])},res,G));
  PLAN.mar=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);let c=mix3(hx('#c1502a'),hx('#e08050'),fbm(n[0]*3,n[1]*3+n[2]*3,4));c=mix3(c,hx('#6a2a18'),smst(0.55,0.72,fbm(n[0]*2+5,n[2]*2+n[1],3))*0.75);if(n[1]>0.86)c=mix3(c,[0.97,0.95,0.94],smst(0.86,0.9,n[1]));return litP(c,p,[0.9,0.45,0.3])},res,G));
  PLAN.jup=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const y=n[1]+0.05*(fbm(n[0]*4,n[2]*4+n[1]*8,3)-0.5);const b=Math.sin(y*22)*0.5+0.5;let c=mix3(hx('#b9875a'),hx('#f2e2c4'),b);c=mix3(c,hx('#8a5a3c'),smst(0.7,0.95,Math.sin(y*9+1))*0.55);
    const sp=[-0.3,-0.3,-0.9];const d=V.len(V.sub(n,V.norm(sp)));const sd=Math.hypot((n[0]-V.norm(sp)[0])*0.8,(n[1]-V.norm(sp)[1])*1.6,(n[2]-V.norm(sp)[2]));c=mix3(c,hx('#c8442a'),smst(0.17,0.1,sd));c=mix3(c,hx('#e8a080'),smst(0.08,0.02,sd)*0.5);return litP(c,p,[0.9,0.75,0.55])},res,G));
  PLAN.nep=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const y=n[1]+0.04*(fbm(n[0]*4,n[2]*4,3)-0.5);let c=mix3(hx('#2a50c8'),hx('#4a88f0'),Math.sin(y*12)*0.5+0.5);c=mix3(c,hx('#cfe8ff'),smst(0.8,0.95,Math.sin(y*30+n[0]*3))*0.35);
    const sd=Math.hypot(n[0]-0.35,(n[1]+0.25)*1.7,n[2]+0.9);c=mix3(c,hx('#10206a'),smst(0.14,0.07,sd));return litP(c,p,[0.4,0.75,1.0])},res,G));
  PLAN.ear=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const l=fbm(n[0]*2.5+1,n[1]*2.5+n[2]*2.5,4);let c=l>0.52?mix3(hx('#3e8a3a'),hx('#b8a060'),smst(0.55,0.7,l)):hx('#1c4fa8');c=mix3(c,[1,1,1],smst(0.55,0.75,fbm(n[0]*5,n[1]*7+n[2]*3,3))*0.75);if(Math.abs(n[1])>0.88)c=[0.95,0.97,1];return litP(c,p,[0.5,0.75,1])},res,G));
  PLAN.sat=um(m=>{sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const b=Math.sin(n[1]*18)*0.5+0.5;return litP(mix3(hx('#c8a870'),hx('#f0e0b0'),b),p,[0.8,0.7,0.5])},[20,32],G);
    for(let i=0;i<64;i++){const a=i/64*TAU2,b=(i+1)/64*TAU2;for(const[r0,r1,cc]of[[1.35,1.75,hx('#d8c090')],[1.8,2.2,hx('#b89a6a')]]){const q=(r,an)=>[Math.cos(an)*r,0,Math.sin(an)*r];const col=V.sc(cc,0.85);m.quad(q(r0,a),q(r1,a),q(r1,b),q(r0,b),col,G);m.quad(q(r0,b),q(r1,b),q(r1,a),q(r0,a),col,G)}}})}
const PL_HALO={mer:[0.5,0.45,0.4],ven:[1,0.8,0.45],mar:[1,0.45,0.25],jup:[1,0.8,0.55],nep:[0.35,0.65,1],ear:[0.4,0.7,1]};
// big sun (Mercury)
const SUNM=um(m=>sphC(m,[0,0,0],1,p=>{const n=V.norm(p);const g=fbm(n[0]*6,n[1]*6+n[2]*6,4);const e=Math.pow(1-Math.abs(n[2]),2);return mix3(mix3([1,0.97,0.82],[1,0.82,0.45],g*0.7),[1,0.5,0.15],e*0.8)},[24,40],MAT.glass));
// ---- umbrella (wagasa), local +y up, canopy centre at y=0.62 above hand
const UMB=um(m=>{const N=20,red=hx('#d23a2a'),red2=hx('#f05a3a'),rib=hx('#3a2418');tube(m,[0,-0.05,0],[0,0.7,0],0.012,0.012,hx('#6a4a2a'),6);
  const P=(a,r)=>[Math.cos(a)*r,0.7-0.28*r*r,Math.sin(a)*r];for(let i=0;i<N;i++){const a=i/N*TAU2,b=(i+1)/N*TAU2;const c=i%2?red:red2;
    m.tri([0,0.74,0],P(b,0.6),P(a,0.6),[mix3(c,[1,0.8,0.6],0.3),c,c]);m.tri([0,0.74,0],P(a,0.6),P(b,0.6),[c,c,c]);tube(m,[0,0.72,0],P(a,0.6),0.006,0.004,rib,4);tube(m,[0,0.4,0],P(a,0.36),0.004,0.004,rib,3)}
  m.prism([0,0.72,0],0.05,0.02,0.06,10,hx('#2a1a10'))},0.4);
// ---- Great Red Spot vortex disc (local: normal +y), side 0 full, +-1 half
function vortexMesh(side){const m=new MB();const NR=16,NA=64;const col=(r,a)=>{const s=Math.sin(a*3-r*9)*0.5+0.5;const q=fbm(Math.cos(a)*r*3+4,Math.sin(a)*r*3,3);let c=mix3(hx('#b8341c'),hx('#ff8a4a'),s*0.7+q*0.3);c=mix3(c,hx('#ffe2b0'),smst(0.8,1,r)*0.8);c=mix3(c,hx('#6a1408'),smst(0.25,0,r)*0.7);return c};
  const P=(r,a)=>{const h=0.22*(1-r*r)-0.05*Math.sin(a*3-r*9);return[Math.cos(a)*r,h,Math.sin(a)*r]};
  for(let i=0;i<NR;i++)for(let j=0;j<NA;j++){const r0=i/NR,r1=(i+1)/NR,a0=j/NA*TAU2,a1=(j+1)/NA*TAU2;const cx=Math.cos((a0+a1)/2);if(side&&cx*side<0)continue;
    const A=P(r0,a0),B=P(r1,a0),C=P(r1,a1),D=P(r0,a1);m.quad(A,D,C,B,[col(r0,a0),col(r0,a1),col(r1,a1),col(r1,a0)],MAT.emis);
    const f=p=>[p[0],-p[1]*0.6,p[2]];m.quad(f(A),f(B),f(C),f(D),[col(r0,a0),col(r1,a0),col(r1,a1),col(r0,a1)].map(c=>V.sc(c,0.7)),MAT.emis)}
  if(side){for(let i=0;i<NR;i++){const r0=i/NR,r1=(i+1)/NR;for(const a of[Math.PI/2,-Math.PI/2]){const A=P(r0,a),B=P(r1,a);const f=p=>[p[0],-p[1]*0.6,p[2]];m.quad(A,B,f(B),f(A),hx('#ffd090'),MAT.emis);m.quad(f(A),f(B),B,A,hx('#ffd090'),MAT.emis)}}}
  return m.build(0.5)}
const GRS=vortexMesh(0),GRSL=vortexMesh(-1),GRSR=vortexMesh(1);
// ---- diamond (octahedron-ish brilliant)
const DIAM=um(m=>{const N=8,t=[0,0.55,0],b=[0,-1,0];const ring=[];for(let i=0;i<N;i++){const a=i/N*TAU2;ring.push([Math.cos(a)*0.8,0.2,Math.sin(a)*0.8])}
  const tab=[];for(let i=0;i<N;i++){const a=(i+0.5)/N*TAU2;tab.push([Math.cos(a)*0.42,0.55,Math.sin(a)*0.42])}
  for(let i=0;i<N;i++){const j=(i+1)%N;const k=0.78+0.22*Math.sin(i*2.3);const c1=V.sc([0.85,0.97,1],k),c2=V.sc([0.7,0.9,1],1.05-k*0.3),c3=[0.95,1,1];
    m.tri(ring[i],tab[i],ring[j],c1,MAT.glass);m.tri(tab[i],tab[j],ring[j],c3,MAT.glass);m.tri(ring[j],b,ring[i],c2,MAT.glass);m.tri(t,tab[j],tab[i],[1,1,1],MAT.glass)}},0.0);
// ---- banana peel (local y up, on ground)
const PEEL=um(m=>{const Y=hx('#f4d23a'),Y2=hx('#d8a820'),In=hx('#fff4c0'),Br=hx('#5a3a18');
  blob(m,[0,0.05,0],0.09,()=>Y,3,0.8,[6,9]);tube(m,[0,0.08,0],[0,0.2,-0.02],0.045,0.025,Y,8);tube(m,[0,0.2,-0.02],[0,0.24,-0.03],0.022,0.018,Br,6);
  for(let k=0;k<4;k++){const a=k/4*TAU2+0.4;const d=[Math.cos(a),0,Math.sin(a)];let prev=[d[0]*0.06,0.05,d[2]*0.06];for(let s=1;s<=5;s++){const r=0.06+s*0.05;const q=[d[0]*r,0.05+0.04*Math.sin(s/5*Math.PI)-s*0.008,d[2]*r];
      const w=0.045*(1-s/7);const sd=V.norm(V.cross(d,[0,1,0]));const A=V.add(prev,V.sc(sd,w)),B=V.add(prev,V.sc(sd,-w)),C=V.add(q,V.sc(sd,-w*0.85)),D=V.add(q,V.sc(sd,w*0.85));m.quad(A,B,C,D,Y);m.quad(D,C,B,A,In);prev=q}}
  m.box([0,0.12,0],[0.05,0.03,0.05],Y2)},0.6);
