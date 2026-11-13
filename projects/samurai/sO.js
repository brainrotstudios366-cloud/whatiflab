// ================= opponents =================
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.55,0.48],[0.8,0.74,0.66],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1])}});
const PUFF=um(m=>blob(m,[0,0,0],1,p=>mix3([0.78,0.78,0.8],[0.97,0.97,0.98],clamp(p[1]*0.5+0.5,0,1)),3,0.9,[7,10]),0.5);
// ---- meteor ----
const metCol=p=>{const n=vnoise(p[0]*3+1,p[2]*3+p[1]*2);const cr=vnoise(p[0]*9,p[1]*9+p[2]*3);return mix3(hx('#3a2e2a'),hx('#6a5a50'),n)};
const METEOR=um(m=>blob(m,[0,0,0],1,metCol,5,0.92,[16,24]),0.3);
const METHALF=um(m=>{const la=16,lo=24;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];const n=1+0.32*(vnoise(d[0]*2.2+5*7.3,d[1]*2.2+d[2]*1.7+5)-0.5);return[Math.max(0,d[0]*n),d[1]*n*0.92,d[2]*n]};
  const C_=p=>p[0]<0.04?mix3(hx('#ffdd66'),hx('#ff6a1a'),Math.hypot(p[1],p[2])):metCol(p);
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const emis=a[0]<0.02&&b[0]<0.02&&c[0]<0.02&&d[0]<0.02;m.quad(a,d,c,b,[C_(a),C_(d),C_(c),C_(b)],emis?MAT.emis:0)}},0.2);
// ---- tsunami ----
const WPROF=[[1.5,0],[1.0,0.2],[0.6,0.5],[0.28,0.82],[0.06,0.98],[-0.12,1.0],[-0.27,0.92],[-0.36,0.78],[-0.34,0.64],[-0.24,0.57],[-0.13,0.6],[-0.08,0.48],[-0.12,0.28],[-0.22,0.1],[-0.3,0]];
function waveMesh(x0,x1,taperSide){const m=new MB();const NX=90,NP=WPROF.length;const H0=72;
  const colP=j=>{if(j>=7&&j<=10)return hx('#e8f4f4');if(j>=5)return hx('#4fb8b8');if(j<=1)return hx('#165a6e');if(j>=13)return hx('#d8eeee');return mix3(hx('#1a6a80'),hx('#2c9aa8'),j/5)};
  const pt=(i,j)=>{const x=x0+(x1-x0)*i/NX;let s=1+0.1*(vnoise(x*0.02,3)-0.5);if(taperSide){const e=taperSide>0?x-x0:x1-x;s*=smst(0,6,e)}const[pz,py]=WPROF[j];return[x,py*H0*s,pz*H0*0.9*Math.max(0.35,s)]};
  for(let i=0;i<NX;i++)for(let j=0;j<NP-1;j++){const a=pt(i,j),b=pt(i+1,j),c=pt(i+1,j+1),d=pt(i,j+1);m.quad(a,b,c,d,[colP(j),colP(j),colP(j+1),colP(j+1)])}
  if(taperSide){const i=taperSide>0?0:NX;for(let j=0;j<NP-2;j++){const a=pt(i,j),b=pt(i,j+1),c=pt(i,NP-1-0);m.tri(a,b,[a[0],0,(a[2]+c[2])/2],hx('#bfe6e6'))}}
  return m.build(0.5)}
const WAVE=waveMesh(-900,900,0),WAVEL=waveMesh(-900,0,-1),WAVER=waveMesh(0,900,1);
// ---- dragon head (local: +z forward, y up) ----
const DC={body:hx('#c42a22'),body2:hx('#8a1a16'),belly:hx('#f0c050'),gold:hx('#e8b840'),mane:hx('#f4f0e8'),horn:hx('#efe2c0'),eye:hx('#ffe040'),dark:[0.05,0.03,0.03],teeth:[0.98,0.97,0.92],tongue:hx('#e05070')};
const DHEAD=um(m=>{blob(m,[0,0,0],1,()=>DC.body,2,0.8,[10,14]);
  m.box([0,0.05,1.1],[1.1,0.55,1.5],DC.body);m.box([0,0.36,0.75],[0.9,0.25,0.9],DC.body2);m.ico([0,0.1,1.9],0.42,DC.body,0,0.7,[6,9]);
  for(const sx of[-1,1]){m.ico([sx*0.24,0.32,1.95],0.09,DC.dark,0,1,[4,6]);m.ico([sx*0.42,0.42,0.55],0.2,DC.eye,0,1,[6,8]);m.ico([sx*0.47,0.44,0.62],0.09,DC.dark,0,1.3,[4,6]);m.box([sx*0.42,0.63,0.55],[0.42,0.1,0.3],DC.body2,0,sx*0.3);
    tube(m,[sx*0.3,0.5,0.0],[sx*0.6,1.3,-0.9],0.12,0.06,DC.horn,7);tube(m,[sx*0.6,1.3,-0.9],[sx*0.7,1.7,-1.5],0.06,0.02,DC.horn,6);tube(m,[sx*0.48,1.0,-0.6],[sx*0.95,1.35,-0.55],0.05,0.02,DC.horn,5);
    for(let k=0;k<5;k++)m.prism([sx*(0.3+k*0.04),-0.2,1.2-k*0.3],0.05,0,-0.18,5,DC.teeth);
    for(let k=0;k<7;k++){const a=k/7*Math.PI;blob(m,[sx*0.75,0.1+Math.sin(a)*0.5,-0.2-Math.cos(a)*0.5],0.32,()=>DC.mane,k+sx,1.2,[5,7])}}
  for(let k=0;k<6;k++)blob(m,[0,0.6-k*0.1,-0.5-k*0.25],0.38,()=>DC.mane,k*3,1,[5,7])},0.5);
const DJAW=um(m=>{m.box([0,-0.1,0.9],[0.95,0.22,1.4],DC.body);m.box([0,0.02,0.9],[0.75,0.05,1.2],DC.tongue);for(const sx of[-1,1])for(let k=0;k<5;k++)m.prism([sx*0.36,0.01,1.4-k*0.25],0.045,0,0.16,5,DC.teeth);
  blob(m,[0,-0.3,0.6],0.3,()=>DC.mane,9,1.2,[5,7])},0.5);
const DCLAW=um(m=>{tube(m,[0,0,0],[0,-1,0.3],0.22,0.16,DC.body,7);m.ico([0,-1.05,0.35],0.2,DC.belly,0,1,[5,7]);for(let k=-1;k<=1;k++)tube(m,[k*0.12,-1.1,0.4],[k*0.2,-1.3,0.75],0.05,0.01,DC.horn,5)},0.5);
// ---- mosquito (local +z forward) ----
const MOSQ=um(m=>{blob(m,[0,0,-0.6],0.3,p=>Math.sin(p[2]*30)>0.3?hx('#e8e8e8'):hx('#2a2a30'),1,0.7,[8,10]);m.ico([0,0.05,0],0.22,hx('#3a3a42'),0,1,[7,9]);m.ico([0,0.08,0.3],0.14,hx('#2a2a30'),0,1,[6,8]);
  for(const sx of[-1,1])m.ico([sx*0.08,0.12,0.38],0.07,hx('#c02020'),0,1,[5,6]);tube(m,[0,0.04,0.42],[0,-0.1,1.0],0.025,0.008,hx('#2a2a30'),5);
  for(const sx of[-1,1])for(let k=0;k<3;k++){const h=[sx*0.12,0,0.1-k*0.12],kn=[sx*0.55,0.25,0.25-k*0.35],f=[sx*0.8,-0.6,0.3-k*0.5];tube(m,h,kn,0.02,0.015,hx('#2a2a30'),4);tube(m,kn,f,0.015,0.008,hx('#2a2a30'),4)}},0.4);
const WING=um(m=>{const N=10;for(let i=0;i<N;i++){const a=i/N*Math.PI,b=(i+1)/N*Math.PI;m.tri([0,0,0],[Math.sin(a)*0.25,0,-Math.cos(a)*0.25+0.1-a*0.2],[Math.sin(b)*0.25,0,-Math.cos(b)*0.25+0.1-b*0.2],[0.85,0.9,0.95])}});
// ---- ninja crowd (baked) ----
function ninjaPose(ph,kind,seed){const r=rngG(seed);const p=P_({});p.style='ninja';
  if(kind==='run'){const s=Math.sin(ph),c=Math.cos(ph);p.pel={y:0.86+0.04*Math.abs(c),z:0,p:0.35,r:0};p.tor={tw:0,b:0.15,s:0};p.fR=[-0.12,0.1+Math.max(0,s)*0.25,0.45*s];p.fL=[0.12,0.1+Math.max(0,-s)*0.25,-0.45*s];
    p.hR=[-0.32,-0.05-0.05*s,0.1-0.2*s];p.hL=[0.3,0.05,0.1+0.25*s];p.sd=[-0.15,0.2,-1];p.sw='hand';p.head={y:0,p:-0.35,r:0}}
  else{p.pel={y:0.14,z:0,p:0,r:0};p.rootP=-Math.PI/2;p.fR=[-0.15,0.07,0.1];p.fL=[0.18,0.07,0];p.hR=[-0.5,0.3,0.1];p.hL=[0.5,0.25,0.1];p.sw='none'}
  return p}
function buildCrowd(){const out={run:[new MB(),new MB()],down:new MB()};const r=rngG(31);
  for(let j=0;j<10;j++)for(let i=0;i<25;i++){const x=(i-12)*4.6+(r()-0.5)*2.6,z=j*3.0+(r()-0.5)*1.6;const yaw=Math.PI+(r()-0.5)*0.25;const sd=i*31+j;
    for(let f=0;f<2;f++){const p=ninjaPose(f*Math.PI+(i+j)%2*Math.PI*0.5,'run',sd);p.root=[x,0,z];p.yaw=yaw;p.lo=true;p.t=0;p.wind=0;bake(charItems(p).items,out.run[f])}
    const p=ninjaPose(0,'down',sd);p.root=[x,0.0,z+0.8];p.yaw=yaw+(r()-0.5)*1.2;p.lo=true;p.t=0;p.wind=0;bake(charItems(p).items,out.down)}
  return{run:[out.run[0].build(),out.run[1].build()],down:out.down.build()}}
const CROWD=buildCrowd();
