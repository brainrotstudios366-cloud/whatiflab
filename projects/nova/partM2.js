function tube(m,a,b,r0,r1,col,seg,mat){seg=seg||10;const y=V.sub(b,a);const yn=V.norm(y);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);
  const ring=(c,r)=>{const o=[];for(let i=0;i<seg;i++){const ang=i/seg*TAU2;o.push(V.add(c,V.add(V.sc(x,Math.cos(ang)*r),V.sc(z,Math.sin(ang)*r))))}return o};const A=ring(a,r0),B=ring(b,r1);for(let i=0;i<seg;i++){const j=(i+1)%seg;m.quad(A[i],A[j],B[j],B[i],col,mat)}}
const lerp3=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.52,0.42],[0.76,0.68,0.58],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const CRUMB=um(m=>blob(m,[0,0,0],1,p=>mix3([0.85,0.6,0.3],[0.98,0.86,0.6],clamp(p[1]+0.5,0,1)),9,0.8,[10,14]),0.4);
const LEAF=um(m=>{const n=10;for(let i=0;i<n;i++){const z0=-1+2*i/n,z1=-1+2*(i+1)/n;const w0=Math.sin((i/n)*Math.PI)*0.6,w1=Math.sin(((i+1)/n)*Math.PI)*0.6;const c0=0.12*Math.sin(i/n*Math.PI),c1=0.12*Math.sin((i+1)/n*Math.PI);const g=hx('#4fae3a'),g2=hx('#2f8a2a');m.quad([-w0,-c0*0.5,z0],[0,c0,z0],[0,c1,z1],[-w1,-c1*0.5,z1],[g,g2,g2,g]);m.quad([0,c0,z0],[w0,-c0*0.5,z0],[w1,-c1*0.5,z1],[0,c1,z1],[g2,g,g,g2])}},0.3);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const w=1+0.12*Math.sin(i*1.9);m.tri([0,0,0],[Math.cos(b)*w,0,Math.sin(b)*w],[Math.cos(a)*w,0,Math.sin(a)*w],[1,1,1])}});
// ---------- planetoid ----------
const RP=45;const SDIR=V.norm([-0.25,0.2,1]);
const CRATERS=[];{const r=rngG(21);for(let i=0;i<400&&CRATERS.length<150;i++){const u=r()*2-1,a=r()*TAU2;const q=Math.sqrt(1-u*u);const d=[u,q*Math.cos(a),q*Math.sin(a)];const rad=0.02+Math.pow(r(),2.6)*0.2;if(Math.abs(d[0])<rad*1.45+0.03)continue;CRATERS.push({d,rad,dep:0.5+r()*0.4,cs:Math.cos(rad*1.5)})}}
function pDisp(p){let h=0,c=0;for(const k of CRATERS){const cs=V.dot(p,k.d);if(cs<k.cs)continue;const ang=Math.acos(Math.min(1,cs));const q=ang/k.rad;const wR=k.rad*RP;
    if(q<1){h-=k.dep*0.22*wR*(1-q*q);c-=0.25*(1-q)}h+=k.dep*0.06*wR*Math.exp(-Math.pow((q-1)/0.2,2));c+=0.18*Math.exp(-Math.pow((q-1)/0.25,2))}
  const fl=clamp((Math.abs(p[0])*RP-0.7)/3,0,1);h+=fl*(0.5*(fbm(p[1]*9+3,p[2]*9+p[0]*7,4)-0.5)+0.15*(vnoise(p[1]*40,p[2]*40+p[0]*30)-0.5));return[h,c]}
let PLANET;{const m=new MB();const NF=420,NP=150;const G=[];
  for(let j=0;j<=NP;j++){const u=-1+2*j/NP;const psi=Math.sign(u)*Math.pow(Math.abs(u),1.7)*Math.PI/2*0.999;const row=[];
    for(let i=0;i<=NF;i++){const ph=i/NF*TAU2;const d=[Math.sin(psi),Math.cos(psi)*Math.cos(ph),Math.cos(psi)*Math.sin(ph)];const [h,c]=pDisp(d);const p=V.sc(d,RP+h);
      const n=fbm(d[1]*6+1,d[2]*6+d[0]*5,3);const g=0.42+0.16*n+0.04*(vnoise(d[1]*60,d[2]*60+d[0]*50)-0.5);const cc=1+c;row.push([p,[g*1.0*cc,g*0.955*cc,g*0.92*cc]])}G.push(row)}
  for(let j=0;j<NP;j++)for(let i=0;i<NF;i++){const a=G[j][i],b=G[j+1][i],c=G[j+1][i+1],d=G[j][i+1];m.quad(a[0],d[0],c[0],b[0],[a[1],d[1],c[1],b[1]])}
  const r=rngG(5);for(let i=0;i<1100;i++){const ph=r()*TAU2;const psi=(r()-0.5)*0.75;const d=[Math.sin(psi),Math.cos(psi)*Math.cos(ph),Math.cos(psi)*Math.sin(ph)];const xw=Math.abs(d[0])*RP;let s=0.03+Math.pow(r(),3.2)*(xw>3?1.3:0.35);if(xw<0.95&&s>0.08)s=0.05;if(xw<0.7)continue;
    const [h]=pDisp(d);const g=0.36+r()*0.22;m.ico(V.sc(d,RP+h+s*0.25),s,[g,g*0.96,g*0.92],0,0.55+r()*0.4,s>0.3?[7,10]:[4,6])}
  PLANET=m.build(0.55)}
const PEBBLE=um(m=>blob(m,[0,0,0],1,p=>mix3([0.38,0.36,0.34],[0.58,0.55,0.52],vnoise(p[0]*4+2,p[2]*4+p[1]*3)),3,0.85,[12,16]),0.4);
const FLAME=um(m=>{const la=10,lo=14;for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const P=(ii,jj)=>{const th=ii/la*Math.PI,ph=jj/lo*TAU2;const y=Math.cos(th);const rr=Math.sin(th)*(y>0?Math.pow(1-y,0.9)*0.9+0.1*(1-y):1);return[Math.cos(ph)*rr,y*1.9,Math.sin(ph)*rr]};const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);if(i===0)m.tri(a,c,b,[1,1,1],MAT.glass);else m.quad(a,d,c,b,[1,1,1],MAT.glass)}});
