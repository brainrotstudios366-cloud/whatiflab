// HYPERNOVA vs DYING ANT
const FPS=30,DUR=25,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();buildPlanets();
// ---------- timeline ----------
const R=[2.2,5.6,9.8,13.6,17.2,21.6];
const EV={glasses:4.3,stopW:5.0,collapse:4.95,nova:5.6,wave:7.0,umb:10.35,warn:10.2,beam0:10.9,beam1:12.7,sit:13.85,ignite:14.55,peace:17.4,wait:18.4,drop0:19.0,bonk:20.25,endc:21.6,loop:24.6};
const ROUNDS=[['STAGE 1','The star is collapsing ⭐','He brought sunglasses 😎',4.6],['STAGE 2','HYPERNOVA 💥','Didn\'t even look back 😎',8.5],['STAGE 3','Gamma-ray burst ☢️','Blocked it with a leaf 🍃',11.7],['STAGE 4','Neutron star 🌀','Made a campfire 🔥😌',15.1],['FINAL ROUND','One space pebble 🪨','Cause of death: pebble 💀',20.7]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
function blob(mb,c,r,colFn,seed,sq,res,mat){const la=res?res[0]:9,lo=res?res[1]:14;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];const n=1+0.32*(vnoise(d[0]*2.2+seed*7.3,d[1]*2.2+d[2]*1.7+seed)-0.5);return[c[0]+d[0]*r*n,c[1]+d[1]*r*n*(sq||1),c[2]+d[2]*r*n]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
function segM(a,b,r){const y=V.sub(b,a);const L=V.len(y)||1e-6;const yn=V.sc(y,1/L);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);const mid=V.sc(V.add(a,b),0.5);
  return new Float32Array([x[0]*r,x[1]*r,x[2]*r,0,y[0],y[1],y[2],0,z[0]*r,z[1]*r,z[2]*r,0,mid[0],mid[1],mid[2],1])}
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
// ---------- ant ----------
const AC={body:hx('#6b3a26'),body2:hx('#4a2618'),leg:hx('#3e2014'),eye:[0.97,0.97,0.97],pup:[0.04,0.03,0.03],band:[0.96,0.95,0.92],wood:hx('#e8c890'),match:hx('#d83020')};
function antItems(Rm,o){const it=[];const P=(M,mesh,c,s,col,rot,ns)=>it.push({mesh,M:M4.mul(M,M4.trs(c,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint:col,tintAmt:1,noShadow:!!ns});
  const ph=o.ph||0,walk=o.walk==null?1:o.walk,pose=o.pose||'walk';
  const bob=walk*(0.022*Math.abs(Math.sin(ph))+0.03*Math.max(0,Math.sin(ph+0.9)));const roll=walk*0.08*Math.sin(ph);
  const ck=o.cough==null?-1:o.cough;const cj=ck>=0&&ck<0.9?Math.sin(clamp(ck/0.25,0,1)*Math.PI)*(ck<0.45?1:0.6):0;
  let B=M4.mul(Rm,M4.trs([0,bob+(pose==='sit'?-0.13:0),0],0,(pose==='sit'?-0.18:0)+cj*0.12,roll,1));
  // body
  P(B,USPH,[0,0.43,0.5],[0.25,0.235,0.33],AC.body,[0,-0.25,0]);P(B,USPH,[0,0.5,0.42],[0.16,0.1,0.18],mix3(AC.body,[1,0.8,0.7],0.25),[0,-0.25,0],1);
  for(const zz of[0.38,0.55,0.7])P(B,USPH,[0,0.43+(zz-0.5)*0.25,zz],[0.255,0.03,0.04],AC.body2,[0,-0.25,0],1);
  P(B,USPH,[0,0.37,0.15],[0.07,0.07,0.08],AC.body2);P(B,USPH,[0,0.38,-0.06],[0.13,0.12,0.21],AC.body,[0,0.15,0]);
  const Hd=M4.mul(B,M4.trs([0,0.47,-0.3],0,0.1+cj*0.35+(o.headDown||0),Math.sin((o.t||0)*1.3)*0.04*walk,1));
  P(Hd,USPH,[0,0.04,-0.06],[0.22,0.2,0.2],AC.body);P(Hd,USPH,[0,-0.08,-0.2],[0.12,0.07,0.08],AC.body2);
  for(const s of[-1,1])P(Hd,USPH,[s*0.05,-0.12,-0.25],[0.03,0.025,0.06],AC.leg,[s*0.5,0,0]);
  // eyes
  const lid=o.lid==null?0.45:o.lid;for(const s of[-1,1]){const ec=[s*0.095,0.09,-0.2];P(Hd,USPH,ec,[0.075,0.088,0.055],AC.eye,null,1);
    if(o.xeyes){for(const d of[-1,1])P(Hd,UB,[ec[0],ec[1],ec[2]-0.05],[0.1,0.018,0.01],AC.pup,[0,0,d*0.78],1)}
    else{P(Hd,USPH,[ec[0]+0.005,ec[1]-0.012,ec[2]-0.045],[0.042,0.05,0.022],AC.pup,null,1);P(Hd,USPH,[ec[0]-0.012,ec[1]+0.008,ec[2]-0.062],[0.012,0.014,0.006],[1,1,1],null,1);
      P(Hd,USPH,[ec[0],ec[1]+0.105-lid*0.115,ec[2]+0.004],[0.083,0.06,0.06],AC.body,[0,0,s*-0.15],1)}}
  if(o.glasses){const gk=o.glasses;const gy=0.09+(1-gk)*0.6;for(const s of[-1,1])P(Hd,USPH,[s*0.095,gy,-0.27],[0.085,0.07,0.025],[0.03,0.03,0.05],null,1);P(Hd,UB,[0,gy+0.02,-0.27],[0.25,0.018,0.02],[0.03,0.03,0.05],null,1);for(const s of[-1,1])P(Hd,USPH,[s*0.07,gy+0.025,-0.296],[0.02,0.012,0.004],[0.7,0.7,0.8],null,1)}
  // bandage on head
  P(Hd,UB,[0.03,0.22,-0.04],[0.18,0.035,0.06],AC.band,[0.3,0,0.5],1);P(Hd,UB,[0.03,0.22,-0.04],[0.18,0.035,0.06],AC.band,[0.3,0,-0.5],1);
  // antennae (one droopy)
  for(const s of[-1,1]){const base=M4.mul(Hd,M4.trs([s*0.07,0.18,-0.12],0,0,0,1));const e1=[s*0.08,0.2,-0.05],droop=s<0?1:0;const flap=(o.flail||0)*Math.sin((o.t||0)*20+s)*0.1;
    const e2=V.add(e1,droop?[s*0.08,-0.22,-0.12]:[s*0.1+flap,0.06,-0.2]);it.push({mesh:UCYL,M:M4.mul(base,segM([0,0,0],e1,0.017)),tint:AC.leg,tintAmt:1,noShadow:true});it.push({mesh:UCYL,M:M4.mul(base,segM(e1,e2,0.013)),tint:AC.leg,tintAmt:1,noShadow:true});P(base,USPH,e2,0.024,AC.leg,null,1);P(base,USPH,e1,0.02,AC.leg,null,1)}
  // legs
  const hz=[-0.14,-0.05,0.04],fz=[-0.5,-0.08,0.38];let hands=null;
  for(let i=0;i<3;i++)for(const s of[-1,1]){const hip=[s*0.09,0.34,hz[i]];const grp=(i+(s>0?1:0))%2;const g=ph+grp*Math.PI;let foot;
    const limp=(i===2&&s<0);
    if(pose==='squash'){foot=[s*0.75,0.02,fz[i]*1.4]}
    else if(pose==='cling'||pose==='fall'){const fl=Math.sin((o.t||0)*22+i*1.7+s)*0.12;foot=[s*0.52,0.05+fl,fz[i]+fl*0.6];if(pose==='cling'&&i===0)foot=[s*0.07,0.3,-0.66]}
    else{const lift=limp?0:Math.max(0,Math.sin(g))*0.12*walk;const dz=limp?0.06:0.1*Math.cos(g)*walk;foot=[s*0.5,lift-(pose==='sit'?-0.1:0),fz[i]+dz];if(pose==='sit'&&i>0)foot=[s*0.58,0.0,fz[i]*1.2];
      if(i===0){if(pose==='sit')foot=[s*0.09,0.47+0.03*Math.sin((o.t||0)*9),-0.56];if(pose==='dust'){const w=(o.t||0)*13+s*1.4;foot=[s*0.13,0.5+0.07*Math.sin(w),-0.36+0.07*Math.cos(w)]}if(pose==='umb'&&s>0)foot=[0.2,0.62,-0.38];if(pose==='walk'&&s>0&&o.crutch!==false)foot=[0.38,0.36,-0.36];if(pose==='parry')foot=s>0?[0.16,0.78,-0.5]:[-0.08,0.66,-0.52]}}
    // root-space foot for sit/umb holds: compensate (feet given in body space already)
    const knee=V.add(V.add(hip,V.sc(V.sub(foot,hip),0.45)),[s*0.07,0.2,0]);const leg=AC.leg;
    it.push({mesh:UCYL,M:M4.mul(B,segM(hip,knee,0.036)),tint:leg,tintAmt:1});it.push({mesh:UCYL,M:M4.mul(B,segM(knee,foot,0.025)),tint:leg,tintAmt:1});P(B,USPH,knee,0.038,leg);P(B,USPH,foot,0.03,leg);
    if(limp){P(B,USPH,V.add(knee,V.sc(V.sub(foot,knee),0.5)),[0.05,0.07,0.05],AC.band)}
    if(i===0&&s>0)hands=foot}
  // crutch (matchstick)
  if(pose==='walk'&&o.crutch!==false){const g0=[0.55,0,-0.5-0.08*Math.cos(ph)*walk];const top=[0.38,0.42,-0.36];it.push({mesh:UCYL,M:M4.mul(B,segM(g0,top,0.028)),tint:AC.wood,tintAmt:1});P(B,USPH,top,[0.05,0.06,0.05],AC.match)}
  if(pose==='umb'&&hands&&o.shield){const top=[0.04,1.12,0.3];it.push({mesh:UCYL,M:M4.mul(B,segM(hands,top,0.02)),tint:hx('#3a7a2a'),tintAmt:1});it.push({mesh:LEAF,M:M4.mul(B,M4.trs(top,0.05*Math.sin((o.t||0)*30),-1.12,0,[0.8,1.0,0.9])),tint:o.leafGlow?mix3(hx('#5ad04a'),[0.85,1,1],o.leafGlow):null,tintAmt:o.leafGlow?0.5:0})}
  else if(pose==='umb'&&hands){const top=[0.06,1.8,-0.12];it.push({mesh:UCYL,M:M4.mul(B,segM(hands,top,0.02)),tint:hx('#3a7a2a'),tintAmt:1});it.push({mesh:LEAF,M:M4.mul(B,M4.trs(V.add(top,[0,0.02,0]),0.4,0.12+0.05*Math.sin((o.t||0)*3),0.08,[1.0,1.0,1.25])),tint:null,tintAmt:0})}
  if(pose==='parry'){const g0=[0.24,0.12,-0.46],top=[0.04,1.52,-0.56];it.push({mesh:UCYL,M:M4.mul(B,segM(g0,top,0.03)),tint:AC.wood,tintAmt:1});P(B,USPH,top,[0.055,0.065,0.055],AC.match)}
  if(pose==='sit'&&!o.noCrumb){const cb=M4.mul(B,M4.trs([0.1,0.44,-0.66],(o.t||0)*0.3,0.3,0,[0.1,0.085,0.085]));it.push({mesh:CRUMB,M:cb})}
  if(ck>=0&&ck<1.4){for(let i=0;i<4;i++){const k=ck-i*0.06;if(k<0)continue;const p=[Math.sin(i*2)*0.05+0.0,0.42+k*0.25,-0.62-k*0.55];const s=0.05+k*0.14;it.push({mesh:USPH,M:M4.mul(Rm,M4.trs(p,0,0,0,s)),tint:[0.55,0.52,0.5],tintAmt:1,alpha:Math.max(0,0.55*(1-k/1.4)),noShadow:true})}}
  if(o.dizzy){for(let i=0;i<4;i++){const a=(o.t||0)*5+i/4*TAU2;it.push({mesh:UEMIS,M:M4.mul(Rm,M4.trs([Math.cos(a)*0.28,0.95+0.04*Math.sin(a*2),-0.3+Math.sin(a)*0.28],a,0.5,0,0.045)),tint:[1,0.9,0.3],tintAmt:1,noShadow:true})}}
  return it}
// ---------- helpers ----------
const JAX=(()=>{const h=V.norm(V.cross(SDIR,[0,1,0]));let j=V.norm(V.add(V.sc(h,0.75),[0,0.66,0]));j=V.norm(V.sub(j,V.sc(SDIR,V.dot(j,SDIR))));return j})();
const PQ=V.norm(V.cross(SDIR,JAX));
const SC=V.sc(SDIR,60000);
const PW=TAU2/1.5;
function pulsarDir(t){const th=PW*(t-EV.ignite);const b=0.22;const p1=V.add(V.sc(SDIR,-Math.cos(b)),V.sc(JAX,Math.sin(b)));return V.norm(V.add(V.sc(p1,Math.cos(th)),V.sc(PQ,Math.sin(th))))}
function pulseK(t){if(roundAt(t)<3||t>=EV.loop)return 0;const a=pulsarDir(t);const d=Math.max(V.dot(a,V.sc(SDIR,-1)),V.dot(V.sc(a,-1),V.sc(SDIR,-1)));return Math.pow(Math.max(0,d),60)}
function walkDist(t){return 0.95*Math.min(t,EV.stopW)}
function beamK(t){if(t<EV.beam0||t>=EV.beam1+0.3)return 0;return clamp((t-EV.beam0)/0.08,0,1)*clamp((EV.beam1+0.3-t)/0.3,0,1)}
// ---------- environments ----------
function envAt(t){const e={sun:SDIR,sunCol:[1.0,1.08,1.3],sky:[0.17,0.19,0.32],gnd:[0.1,0.08,0.12],fog:[0,0,0],fogD:1e7,zen:[0.004,0.005,0.016],hor:[0.025,0.02,0.06],stars:1,night:0,emis:1,ground:0,neb:0.55,shI:0,sunSize:1.5};
  if(t>=EV.collapse&&t<EV.nova){const k=ease((t-EV.collapse)/0.6);e.sunCol=V.sc(e.sunCol,lerp(1,0.2,k))}
  const n=t-EV.nova;
  if(n>=0&&t<8.0){const f=Math.exp(-n*3.2)*1.8+1.2;e.sunCol=[f,f*0.97,f*1.08];e.sky=[0.35,0.36,0.5];e.shR=0.03+0.95*easeOut(n/1.4);e.shI=lerp(2.0,1.1,clamp(n/1.4,0,1));e.fill=0.28;e.shW=0.1;e.shC=[1,0.95,0.9];e.shC2=[0.55,0.75,1];e.hor=[0.1,0.09,0.16];
    if(t>=EV.wave-0.1){const k=clamp((t-EV.wave+0.1)/0.2,0,1)*clamp((8.0-t)/0.8,0,1);e.sunCol=mix3(e.sunCol,[3.2,2.3,1.7],k);e.sky=mix3(e.sky,[0.8,0.5,0.4],k);e.gnd=mix3(e.gnd,[0.5,0.3,0.2],k)}}
  if(t>=8.0){e.sunCol=[0.95,0.62,0.85];e.sky=[0.22,0.15,0.3];e.gnd=[0.12,0.07,0.1];e.shR=0.42;e.shI=0.95;e.fill=0.55;e.shW=0.2;e.shC=[1,0.38,0.62];e.shC2=[0.35,0.6,1];e.hor=[0.06,0.03,0.08];
    if(t<8.6){const k=1-clamp((t-8.0)/0.6,0,1);e.shI+=k*1.2}}
  if(t>=EV.warn&&t<EV.beam1+0.4){const w=clamp((t-EV.warn)/0.7,0,1)*0.5;const b=beamK(t)*(0.85+0.15*Math.sin(t*60));e.sunCol=V.add(e.sunCol,V.sc([0.8,1.2,1.7],w*0.3+b*0.6));e.sky=V.add(e.sky,V.sc([0.05,0.1,0.15],b))}
  if(roundAt(t)>=3){const p=pulseK(t);e.sunCol=V.add([0.7,0.62,0.95],V.sc([1.2,1.6,2.2],p));e.sky=[0.2,0.16,0.32]}
  return e}
function fillCol(t){let f=[0.42,0.4,0.55];const n=t-EV.nova;if(n>=0&&n<2.5)f=V.add(f,V.sc([0.8,0.85,1],Math.exp(-n*2)));if(t>=8)f=[0.48,0.38,0.52];if(t>=EV.ignite&&roundAt(t)>=3)f=V.add(f,[0.12,0.06,0]);return f}
// ---------- camera ----------
function aim(eye,tgt,w){const f=V.norm(V.add(V.sc(V.norm(V.sub(tgt,eye)),1-w),V.sc(SDIR,w)));return{eye,at:V.add(eye,V.sc(f,4))}}
function camAt(t){const rn=roundAt(t);const sw=Math.sin(t*0.4)*0.2;
  if(t<R[0]){const k=t/R[0];return aim([1.9-0.2*k,0.6,-4.8+0.4*k],[0,0.5,0],0.5)}
  if(rn===0){const k=ease((t-R[0])/2.0);let eye=[lerp(1.3,0.95,k),lerp(0.5,0.62,k),lerp(-3.7,-2.6,k)];let w=lerp(0.5,0.32,k);if(t>=EV.stopW){const kk=ease((t-EV.stopW)/0.6);eye=[lerp(0.95,1.6,kk),lerp(0.62,0.42,kk),lerp(-2.6,-4.2,kk)];w=lerp(0.22,0.56,kk)}return aim(eye,[0,0.55,0],w)}
  if(rn===1){if(t<7.7)return aim([1.6+sw*0.3,0.42,-4.2],[0,0.55,0],0.56);const k=ease((t-7.7)/0.8);return aim([lerp(1.6,1.15,k),lerp(0.42,0.68,k),lerp(-4.2,-2.6,k)],[0,0.6,0],lerp(0.56,0.18,k))}
  if(rn===2){if(t<EV.umb)return aim([1.3,0.6,-3.0],[0,0.6,0],0.3);return aim([1.9+sw*0.2,0.5,-3.9],[0,0.9,0],0.4)}
  if(rn===3){return aim([1.5+sw*0.3,0.55,-3.4],[0.1,0.5,0],0.4)}
  if(rn===4){const k=ease((t-R[4])/2.5);let r=aim([lerp(1.5,1.15,k),0.6,lerp(-3.4,-2.8,k)],[0.1,0.5,0],lerp(0.4,0.2,k));
    if(t>=EV.drop0-0.5){const kk=ease((t-EV.drop0+0.5)/0.7);const ku=ease((t-EV.bonk+0.5)/0.5);const eye=[lerp(1.15,1.5,kk),lerp(0.6,0.38,kk),lerp(-2.8,-3.1,kk)];const tg=[lerp(0.1,-0.4,kk*(1-ku)),lerp(0.5,1.9,kk)-1.4*ku,lerp(0,0.4,kk*(1-ku))];r={eye,at:V.add(eye,V.sc(V.norm(V.sub(tg,eye)),4))}}
    if(t>=R[5])r={eye:[1.4,1.0,-3.2],at:[0,0.4,0]};return r}
  return{eye:[1.4,1.0,-3.2],at:[0,0.4,0]}}
// ---------- background (meters) ----------
function spindle(items,a,b,r,col,al){items.push({mesh:UGLASS,M:segM(lerp3(a,b,0.25),lerp3(a,b,0.75),r),tint:col,tintAmt:1,alpha:al,add:1,noShadow:true})}
function bgItems(t){const items=[];const G=(r,col,a,add)=>items.push({mesh:UGLASS,M:M4.trs(SC,0,0,0,r),tint:col,tintAmt:1,alpha:a,add:add?1:0,noShadow:true});
  if(t<EV.nova){let rad=5600;if(t>=R[0]){const q=t-R[0];rad*=1+0.045*Math.sin(q*(5+q*4))*clamp(q/0.5,0,1)}const pre=t-EV.collapse;if(pre>0)rad*=lerp(1,0.03,easeIn(clamp(pre/0.62,0,1)));
    const col=mix3([0.72,0.84,1],[1,1,1],clamp(pre/0.5,0,1));G(rad,col,1,0);G(rad*1.06,[0.55,0.72,1],0.4,1);G(rad*1.2,[0.4,0.6,1],0.2,1);G(rad*1.5,[0.3,0.45,1],0.09,1);G(rad*2.3,[0.2,0.32,0.9],0.045,1);G(rad*3.6,[0.15,0.25,0.8],0.025,1)}
  else{const n=t-EV.nova;
    if(n<0.9)G(lerp(400,11000,easeOut(n/0.25)),[1,1,1],clamp(1-n/0.9,0,1)*0.85,1);
    if(n<4.6){const L=75000*easeOut(n/1.1);const a=clamp(1-(n-2.6)/2,0,1);for(const s of[-1,1]){const tip=V.add(SC,V.sc(JAX,s*L));spindle(items,SC,tip,1300,[0.85,0.95,1],0.8*a);spindle(items,SC,tip,3600,[0.4,0.6,1],0.25*a)}}
    if(n>=0.8){const k=clamp((n-0.8)/0.6,0,1);G(1300,[0.85,0.92,1],k,0);G(3500,[0.6,0.75,1],0.3*k,1);G(9000,[0.9,0.4,0.7],0.1*k,1)}
    if(t>=EV.warn&&t<EV.beam1+0.4){const w=clamp((t-EV.warn)/0.7,0,1);const b=beamK(t);G(lerp(3000,11000,w)*(1+0.1*Math.sin(t*40)),[0.6,0.9,1],0.45*w*(1-b*0.3),1);G(20000,[0.5,0.8,1],0.2*b,1)}
    if(roundAt(t)>=3){const a=pulsarDir(t);for(const s of[-1,1]){const tip=V.add(SC,V.sc(a,s*48000));spindle(items,SC,tip,650,[0.85,0.97,1],0.85);spindle(items,SC,tip,2200,[0.4,0.7,1],0.22)}const p=pulseK(t);G(1700+p*6000,[0.9,0.97,1],1,0);G(5000,[0.5,0.8,1],0.3+p*0.5,1)}}
  return{items}}
// ---------- foreground ----------
let LASTVP=null,LASTVP_BG=null;const MATCHP=[0.78,0,0.3],MTOP=[0.78,0.9,0.3];
const SOOT=[0.07,0.06,0.06];
function hitP(){return[0.04,1.25,0.42]}
function fgItems(t){const rn=roundAt(t);const items=[];let pose='walk',walk=t<EV.stopW?1:0,o={t};
  items.push({mesh:PLANET,M:M4.trs([0,-RP,0],0,walkDist(t)/RP,0,1)});
  if(t>=EV.glasses)o.glasses=easeOut((t-EV.glasses)/0.5);
  if(t>=EV.wave&&t<EV.wave+1.2)o.flail=1;
  if(rn===2&&t>=EV.umb){pose='umb';o.shield=true;o.leafGlow=beamK(t)*0.12}
  if(t>=EV.sit&&rn>=3){pose='sit';o.noCrumb=true}
  if(rn===4&&t<EV.wait)o.lid=0.62;if(rn===4&&t>=EV.wait)o.lid=0;
  if(t>=EV.bonk){pose='squash';o.xeyes=true}
  const slow=t>=EV.drop0&&t<EV.bonk+0.4;o.ph=t*(slow?1.2:5.2);o.walk=walk;o.pose=pose;if(pose!=='walk')o.crutch=false;if(rn>=3&&pose==='walk')o.crutch=false;
  const coughs=[1.2,8.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  let Rm=M4.id();
  if(t>=EV.wave&&t<EV.wave+0.9){const k=t-EV.wave;Rm=M4.trs([Math.sin(t*70)*0.04*(1-k/0.9),0,0],0,-0.08*(1-k/0.9),Math.sin(t*53)*0.05*(1-k/0.9),1)}
  if(pose==='squash'){const k=clamp((t-EV.bonk)/0.1,0,1);Rm=M4.trs([0,0,0],0,0,0,[lerp(1,1.35,k),lerp(1,0.25,k),lerp(1,1.15,k)])}
  let ai=antItems(Rm,o);const soot=t<EV.wave?0:t<R[2]?clamp((t-EV.wave)/0.25,0,1)*0.8:0.45;
  if(soot>0)for(const it of ai){if(!it.tint||it.tint[0]===0.97||it.mesh===LEAF)continue;if(it.tint[0]>0.9&&it.tint[1]>0.9&&it.tint[2]>0.9&&it.mesh===USPH)continue;it.tint=mix3(it.tint,SOOT,soot*(it.tint[0]>0.8?0.6:0.85))}
  items.push(...ai);
  // smoke from sooty ant
  if(t>=EV.wave+0.3&&t<R[2]+0.6){for(let i=0;i<7;i++){const ph=((t*0.8+i/7)%1);const age=ph;const p=[(hsh(i,2)-0.5)*0.5+Math.sin(t*2+i)*0.05,0.8+age*1.1,0.2+(hsh(i,3)-0.5)*0.4];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.03+age*0.11),tint:[0.72,0.7,0.72],tintAmt:1,alpha:0.28*(1-age)*clamp((R[2]+0.6-t)/0.6,0,1),noShadow:true})}}
  // fire wall
  if(t>=EV.wave-0.6&&t<EV.wave+0.25){const n=t-EV.nova;const r=1500*n/(EV.wave-EV.nova);const a=easeIn(clamp((t-EV.wave+0.6)/0.6,0,1))*clamp((EV.wave+0.25-t)/0.25,0,1);const c=V.sc(SDIR,1500);items.push({mesh:UGLASS,M:M4.trs(c,0,0,0,r),tint:[1,0.88,0.75],tintAmt:1,alpha:0.32*a,add:1,noShadow:true});items.push({mesh:UGLASS,M:M4.trs(c,0,0,0,Math.max(1,r-14)),tint:[1,0.45,0.25],tintAmt:1,alpha:0.25*a,add:1,noShadow:true})}
  // debris
  if(t>=EV.wave-0.4&&t<EV.wave+1.6){for(let i=0;i<46;i++){const t0=EV.wave-0.35+hsh(i,1)*0.9;const k=t-t0;if(k<0)continue;const x=(hsh(i,2)-0.5)*14,y=0.15+Math.pow(hsh(i,3),2)*4.5;const z=36-62*k;if(z<-9||z>40)continue;const s=0.06+Math.pow(hsh(i,4),2)*0.5;
    items.push({mesh:ROCK[i%4],M:M4.trs([x,y+Math.sin(k*3+i)*0.2,z],k*6+i,k*4,0,s),tint:[1,0.55,0.2],tintAmt:0.35});if(i%3===0)items.push({mesh:UGLASS,M:segM([x,y,z+0.2],[x,y,z+1.6+s*4],s*0.6),tint:[1,0.6,0.25],tintAmt:1,alpha:0.4,add:1,noShadow:true})}}
  // gamma ray beam on leaf
  {const b=beamK(t);if(b>0){const h=hitP();const far=V.add(h,V.sc(SDIR,1400));const fl=0.85+0.15*Math.sin(t*70);spindle(items,h,far,0.12*fl,[0.95,1,1],0.95*b);spindle(items,h,far,0.38,[0.45,0.8,1],0.35*b);spindle(items,h,far,1.0,[0.3,0.55,1],0.12*b);
    items.push({mesh:UGLASS,M:M4.trs(h,0,0,0,0.35*fl),tint:[0.9,1,1],tintAmt:1,alpha:0.8*b,add:1,noShadow:true});items.push({mesh:UGLASS,M:M4.trs(h,0,0,0,0.9),tint:[0.4,0.75,1],tintAmt:1,alpha:0.3*b,add:1,noShadow:true});
    for(let i=0;i<6;i++){const a=i/6*TAU2+t*0.6;const d=V.norm([Math.cos(a),0.35+0.3*Math.sin(a*2),Math.sin(a)*0.6+0.25]);spindle(items,h,V.add(h,V.sc(d,9+3*Math.sin(t*9+i))),0.05,[0.8,0.95,1],0.6*b)}
    for(let i=0;i<24;i++){const ph=(t*2.2+hsh(i,1))%1;const d=V.norm([hsh(i,2)-0.5,hsh(i,3)*0.8,hsh(i,4)-0.6]);const p=V.add(h,V.sc(d,ph*3));items.push({mesh:UGLASS,M:M4.trs(p,0,0,0,0.04*(1-ph)),tint:[0.85,1,1],tintAmt:1,alpha:b,add:1,noShadow:true})}}}
  // campfire match
  if(t>=EV.sit&&rn>=3||t>=R[5]){items.push({mesh:UCYL,M:segM(MATCHP,MTOP,0.032),tint:AC.wood,tintAmt:1});const lit=t>=EV.ignite;items.push({mesh:USPH,M:M4.trs(V.add(MTOP,[0,0.04,0]),0,0,0,[0.06,0.075,0.06]),tint:lit?[0.12,0.08,0.06]:AC.match,tintAmt:1});
    if(lit){const k=t-EV.ignite;const g=k<0.25?easeOut(k/0.25)*1.6:1+0.12*Math.sin(t*23)+0.08*Math.sin(t*37);const fp=V.add(MTOP,[0,0.09,0]);const sw=0.06*Math.sin(t*11);
      items.push({mesh:FLAME,M:M4.trs(fp,0,0,sw,[0.13*g,0.15*g,0.13*g]),tint:[1,0.42,0.08],tintAmt:1,alpha:0.6,add:1,noShadow:true});items.push({mesh:FLAME,M:M4.trs(V.add(fp,[0,-0.01,0]),0,0,sw,[0.075*g,0.09*g,0.075*g]),tint:[1,0.88,0.45],tintAmt:1,alpha:0.95,add:1,noShadow:true});items.push({mesh:UGLASS,M:M4.trs(V.add(fp,[0,0.08,0]),0,0,0,0.55*g),tint:[1,0.5,0.15],tintAmt:1,alpha:0.12,add:1,noShadow:true})}}
  // pebble
  if(t>=EV.drop0-0.3){const S0=[-1.7,6.8,1.1],HIT=[0.0,1.0,-0.22],REST=[0.05,0.5,-0.12];let p,rot;
    if(t<EV.bonk){const k=(t-EV.drop0+0.3)/(EV.bonk-EV.drop0+0.3);p=lerp3(S0,HIT,Math.pow(k,1.15));rot=t*1.2}else{const k=clamp((t-EV.bonk)/0.55,0,1);p=lerp3([0,0.62,-0.22],REST,k);p[1]+=Math.abs(Math.sin(Math.PI*2*k))*0.35*(1-k);rot=EV.bonk*1.2+k*1.5}
    items.push({mesh:PEBBLE,M:M4.trs(p,rot,rot*0.7,0.3,0.32)})}
  return items}
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);env.fillD=V.norm(V.add(V.norm(V.sub(c.eye,[0,0.5,0])),[0.3,0.9,0]));env.fillC=fillCol(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  LASTVP_BG=renderGL(env,{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);
  LASTVP=renderGL(Object.assign({},env,{fogD:1e7}),{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0.3,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  if(t>=R[0]&&t<EV.nova)a+=1.5+4*clamp((t-3.5)/1.5,0,1);S_(EV.nova,26,1.4);S_(EV.wave,48,1.8);a+=7*beamK(t);S_(EV.beam0,16,0.5);S_(EV.ignite,5,0.3);S_(EV.bonk,20,0.5);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const ts=R[rn];const k=t-ts;const fin=rn===4;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=fin&&t<EV.drop0;
  if(!hideLab){const kk=fin?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,fin?104:120,fin?'#c88aff':(rn===1?'#7ae0ff':'#ffd84a'));ctx.restore();
    if(t<t2)pill(cap1,385,fin?'rgba(110,40,140,0.85)':(rn===1?'rgba(20,70,140,0.85)':'rgba(15,10,30,0.66)'),60,Math.min(1,kk/0.12));else pill(cap2,385,fin?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>EV.peace&&t<EV.wait)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-EV.peace)/0.15));if(t>=EV.wait)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.bonk;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle='#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.25?0.88+0.12*easeOut(t/0.25):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=20;ctx.shadowOffsetY=6;
  txt('HYPERNOVA 💥',0,-80,fitSize('HYPERNOVA 💥',980,120),'#7ae0ff');txt('vs',0,40,78,'#ffffff');txt('A DYING ANT 🐜',0,150,104,'#ff6a5a');ctx.restore();
  if(t>0.8){ctx.save();ctx.globalAlpha=a*clamp((t-0.8)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should fight',0,-110,88,'#ffffff');txt('him NEXT? 🐜',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('TON 618? 🕳️  Big Bang? 💥',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
function glowAt(p,r,col,a){if(!p||a<=0.003)return;const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${Math.min(1,a)})`);g.addColorStop(0.25,`rgba(${col},${Math.min(1,a)*0.35})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const n=tt-EV.nova;
  const sp=LASTVP_BG?project(LASTVP_BG,SC):null;
  ctx.save();ctx.globalCompositeOperation='screen';
  if(tt<EV.nova){const pre=tt-EV.collapse;const pul=tt>=R[0]?0.5+0.5*Math.sin((tt-R[0])*(5+(tt-R[0])*4)):0.5;let a=0.32+0.1*pul;let r=520;if(pre>0){a*=lerp(1,0.45,clamp(pre/0.6,0,1));r=lerp(520,160,clamp(pre/0.6,0,1))}glowAt(sp,r,'120,170,255',a)}
  else{if(n<2.0)glowAt(sp,lerp(300,1100,easeOut(n/0.4)),'230,240,255',clamp(1.0-n/1.8,0,1));
    if(sp&&n<2.0){const a=clamp(1-n/2,0,1);ctx.fillStyle=`rgba(200,225,255,${0.55*a})`;ctx.fillRect(0,sp[1]-6-10*a,W,12+20*a)}
    if(tt>=8)glowAt(sp,420,'255,120,190',0.16);
    if(tt>=EV.warn&&tt<EV.beam1+0.4){const w=clamp((tt-EV.warn)/0.7,0,1);glowAt(sp,lerp(200,650,w),'150,220,255',0.45*w)}
    if(roundAt(tt)>=3){const p=pulseK(tt);glowAt(sp,260+p*700,'170,220,255',0.3+p*0.6)}}
  // gamma hit sparkle
  {const b=beamK(tt);if(b>0&&LASTVP){const p=project(LASTVP,hitP());glowAt(p,300,'190,240,255',0.5*b*(0.85+0.15*Math.sin(tt*50)))}}
  // campfire glow
  if(tt>=EV.ignite&&LASTVP){const p=project(LASTVP,V.add(MTOP,[0,0.15,0]));const k=tt-EV.ignite;glowAt(p,k<0.3?600:300,'255,150,60',(k<0.3?0.8:0.32)+0.05*Math.sin(tt*23))}
  ctx.restore();
  // wave streaks
  if(tt>=EV.wave-0.3&&tt<EV.wave+1.4){const r=rngG(3);const a=clamp((tt-EV.wave+0.3)/0.3,0,1)*clamp((EV.wave+1.4-tt)/0.6,0,1);ctx.save();ctx.globalCompositeOperation='screen';const cx=sp?sp[0]:W/2,cy=sp?sp[1]:H*0.3;
    for(let i=0;i<40;i++){const ang=r()*TAU2,spd=1.4+r()*1.2,ph=r();const d=((tt*spd+ph)%1);const d0=200+d*1400,d1=d0+120+r()*260;ctx.strokeStyle=`rgba(255,${190+r()*60|0},${140+r()*80|0},${0.5*a*(1-d*0.5)})`;ctx.lineWidth=3+r()*6;ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*d0,cy+Math.sin(ang)*d0);ctx.lineTo(cx+Math.cos(ang)*d1,cy+Math.sin(ang)*d1);ctx.stroke()}ctx.restore()}
  // pulsar sweep bands
  if(roundAt(tt)>=3&&tt<R[5]){const p=pulseK(tt);if(p>0.02){ctx.fillStyle=`rgba(170,225,255,${(tt>EV.ignite-0.2&&tt<EV.ignite+0.2?0.45:0.14)*p})`;ctx.fillRect(0,0,W,H)}}
  // bonk stars
  {const k=tt-EV.bonk;if(k>=0&&k<0.6&&LASTVP){const p=project(LASTVP,[0,0.75,-0.22]);if(p){ctx.save();ctx.globalCompositeOperation='screen';const r=rngG(8);for(let i=0;i<16;i++){const a=r()*TAU2,l=(60+r()*200)*easeOut(k/0.25),l0=l*0.35;ctx.strokeStyle=`rgba(255,${210+r()*45|0},140,${1-k/0.6})`;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*l0,p[1]+Math.sin(a)*l0);ctx.lineTo(p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l);ctx.stroke()}ctx.restore()}}}
  // slow-mo letterbox
  if(tt>=EV.drop0-0.6&&tt<EV.bonk+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.bonk-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k);ctx.fillStyle=`rgba(120,60,160,${0.08*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.4)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col,rise)=>{const k=tt-t0;rise=rise||0;if(k>=-rise&&k<d){const v=k<0?1+k/rise:1-k/d;ctx.fillStyle=`rgba(${col||'255,255,255'},${a*v})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.nova,1.0,0.55,'235,245,255');flash(EV.wave,0.88,0.75,'255,236,215',0.15);flash(EV.beam0,0.7,0.3,'200,240,255');flash(EV.ignite,0.25,0.25,'255,180,90');flash(EV.bonk,0.3,0.2,'230,200,255');
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.42;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.15) contrast(1.06)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
