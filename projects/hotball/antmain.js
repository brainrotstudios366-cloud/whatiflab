// ===================== RED-HOT BALL vs DYING ANT =====================
const FPS=30,DUR=66,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();buildPlanets();
// ---------- mesh helpers ----------
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
function blob(mb,c,r,colFn,seed,sq,res,mat){const la=res?res[0]:9,lo=res?res[1]:14;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];const n=1+0.32*(vnoise(d[0]*2.2+seed*7.3,d[1]*2.2+d[2]*1.7+seed)-0.5);return[c[0]+d[0]*r*n,c[1]+d[1]*r*n*(sq||1),c[2]+d[2]*r*n]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
function segM(a,b,r){const y=V.sub(b,a);const L=V.len(y)||1e-6;const yn=V.sc(y,1/L);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);const mid=V.sc(V.add(a,b),0.5);
  return new Float32Array([x[0]*r,x[1]*r,x[2]*r,0,y[0],y[1],y[2],0,z[0]*r,z[1]*r,z[2]*r,0,mid[0],mid[1],mid[2],1])}
// mushroom cloud (unit height ~1)
function mushGeo(hot){const m=new MB();const sm=hot?MAT.emis:0;
  const col=hot?(p=>{const y=p[1];const core=Math.exp(-Math.pow((y-0.66)/0.12,2));return mix3(mix3([1,0.38,0.08],[1,0.62,0.18],clamp(y*1.4,0,1)),[1,0.95,0.7],core*0.8)}):(p=>{const y=p[1];const under=clamp((0.72-y)/0.12,0,1)*clamp((y-0.5)/0.1,0,1);const b=mix3([0.42,0.36,0.32],[0.78,0.74,0.7],clamp(y*1.25,0,1));return mix3(b,[0.5,0.38,0.3],under*0.6)});
  for(let y=0.04;y<0.62;y+=0.05){const r=0.065+0.03*Math.max(0,0.25-y)*4+0.012*Math.sin(y*40);blob(m,[Math.sin(y*30)*0.01,y,Math.cos(y*23)*0.01],r,col,y*10,1,[7,11],sm)}
  blob(m,[0,0.72,0],0.25,col,3,0.62,[11,18],sm);
  for(let i=0;i<12;i++){const a=i/12*TAU2;blob(m,[Math.cos(a)*0.24,0.655+0.02*Math.sin(i*2.3),Math.sin(a)*0.24],0.1+0.015*Math.sin(i*1.7),col,i+20,0.8,[7,11],sm)}
  for(let i=0;i<6;i++){const a=i/6*TAU2+0.4;blob(m,[Math.cos(a)*0.12,0.83,Math.sin(a)*0.12],0.11,col,i+40,0.8,[7,11],sm)}blob(m,[0,0.88,0],0.12,col,51,0.8,[7,11],sm);
  for(let i=0;i<14;i++){const a=i/14*TAU2;blob(m,[Math.cos(a)*0.26,0.035,Math.sin(a)*0.26],0.07,col,i+60,0.6,[6,10],sm);blob(m,[Math.cos(a+0.2)*0.15,0.05,Math.sin(a+0.2)*0.15],0.07,col,i+80,0.7,[6,10],sm)}
  return m.build(0.5)}
const MUSH=mushGeo(false),MUSHHOT=mushGeo(true);
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.55,0.46,0.38],[0.7,0.62,0.54],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const RING=um(m=>{const seg=96;for(let i=0;i<seg;i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;const r0=0.96,r1=1;m.quad([Math.cos(a)*r0,0,Math.sin(a)*r0],[Math.cos(a)*r1,0,Math.sin(a)*r1],[Math.cos(b)*r1,0,Math.sin(b)*r1],[Math.cos(b)*r0,0,Math.sin(b)*r0],[1,1,1],MAT.emis)}});
const BOMB=um(m=>{m.ico([0,0,0],1,hx('#4a5a3a'),0,2.2,[14,20]);m.ico([0,-1.2,0],0.55,hx('#3a4a2e'),0,1.2,[10,14]);m.box([0,0.25,0],[2.04,0.25,2.04],hx('#d8b030'));for(let i=0;i<4;i++){const a=i*Math.PI/2;m.box([Math.cos(a)*0.7,2.3,Math.sin(a)*0.7],[0.08+Math.abs(Math.sin(a))*1.3,1.0,0.08+Math.abs(Math.cos(a))*1.3],hx('#3a4a2e'))}m.prism([0,1.6,0],0.6,0.6,1.3,14,hx('#3a4a2e'))},0.5);
let SUNE;{const m=new MB();m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[24,36]);SUNE=m.build(0.3)}
let BHD;{const m=new MB();const seg=96;for(let k=0;k<12;k++){const r0=1.25+k*0.2,r1=r0+0.2;const f=k/12;const c=mix3(mix3([1,1,0.95],[1,0.62,0.25],Math.min(1,f*2)),[0.6,0.12,0.25],Math.max(0,f*2-1));for(let i=0;i<seg;i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;m.quad([Math.cos(a)*r0,0,Math.sin(a)*r0],[Math.cos(a)*r1,0,Math.sin(a)*r1],[Math.cos(b)*r1,0,Math.sin(b)*r1],[Math.cos(b)*r0,0,Math.sin(b)*r0],c,MAT.glass)}}BHD=m.build()}
const AST=um(m=>blob(m,[0,0,0],1,p=>mix3([0.32,0.27,0.24],[0.5,0.42,0.36],vnoise(p[0]*3,p[2]*3+p[1])),5,0.9,[16,24]),0.3);
// background world (meters)
let BGG;{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#7aa858'));const r=rngG(77);for(let i=0;i<260;i++){const a=r()*TAU2,d=500+r()*3500;tree(m,Math.cos(a)*d,Math.sin(a)*d,5+r()*5,0,r()<0.4?'pine':'')}BGG=m.build(0.5)}
const CITY=[];{const r=rngG(31);for(let i=0;i<26;i++){const m=new MB();const h=40+r()*170,w=18+r()*22;skyscraper(m,0,0,w,w*(0.8+r()*0.4),h,hx(['#a8b4c4','#8c96a8','#c4c0b8','#7a8a9a','#b8c4cc'][i%5]));CITY.push({mesh:m.build(),x:(r()-0.5)*1300,z:(r()-0.5)*500,h})}}
// foreground (cm)
const CRUMB=um(m=>blob(m,[0,0,0],1,p=>mix3([0.85,0.6,0.3],[0.98,0.86,0.6],clamp(p[1]+0.5,0,1)),9,0.8,[10,14]),0.4);
const LEAF=um(m=>{const n=10;for(let i=0;i<n;i++){const z0=-1+2*i/n,z1=-1+2*(i+1)/n;const w0=Math.sin((i/n)*Math.PI)*0.6,w1=Math.sin(((i+1)/n)*Math.PI)*0.6;const c0=0.12*Math.sin(i/n*Math.PI),c1=0.12*Math.sin((i+1)/n*Math.PI);const g=hx('#4fae3a'),g2=hx('#2f8a2a');m.quad([-w0,-c0*0.5,z0],[0,c0,z0],[0,c1,z1],[-w1,-c1*0.5,z1],[g,g2,g2,g]);m.quad([0,c0,z0],[w0,-c0*0.5,z0],[w1,-c1*0.5,z1],[0,c1,z1],[g2,g,g,g2])}},0.3);
const DROP=um(m=>{const la=16,lo=20;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const y=Math.cos(th);const r=Math.sin(th)*(y>0?(1-y)*0.85+0.15*(1-y*y):1);return[Math.cos(ph)*r,y*1.25,Math.sin(ph)*r]};for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const col=[0.55,0.78,1];if(i===0)m.tri(a,c,b,col);else if(i===la-1)m.tri(a,d,b,col);else m.quad(a,d,c,b,col)}},0.3);
const ALEAF=um(m=>{const n=14;const cA=hx('#e8742a'),cB=hx('#c2361c'),cC=hx('#f2b23a');for(let i=0;i<n;i++){const z0=-1+2*i/n,z1=-1+2*(i+1)/n;const f0=i/n,f1=(i+1)/n;const w0=Math.sin(f0*Math.PI)*0.7*(1+0.25*Math.sin(f0*18)),w1=Math.sin(f1*Math.PI)*0.7*(1+0.25*Math.sin(f1*18));const c0=0.1*Math.sin(f0*Math.PI),c1=0.1*Math.sin(f1*Math.PI);
  const g0=mix3(cC,cA,f0),g1=mix3(cC,cA,f1);m.quad([-w0,-c0*0.4,z0],[0,c0,z0],[0,c1,z1],[-w1,-c1*0.4,z1],[mix3(g0,cB,0.5),g0,g1,mix3(g1,cB,0.5)]);m.quad([0,c0,z0],[w0,-c0*0.4,z0],[w1,-c1*0.4,z1],[0,c1,z1],[g0,mix3(g0,cB,0.5),mix3(g1,cB,0.5),g1])}
  m.box([0,0.02,-1.15],[0.05,0.04,0.4],hx('#7a4a22'))},0.3);
function aurGeo(seed){const m=new MB();const N=90;for(let i=0;i<N;i++){const f0=i/N,f1=(i+1)/N;const X=f=>(f-0.5)*2,Z=f=>0.22*Math.sin(f*9+seed)+0.12*Math.sin(f*23+seed*2);const H=f=>0.75+0.25*Math.sin(f*13+seed*3);
  const g=[0.25,1,0.55],pk=[0.9,0.25,0.85],k0=0.6+0.4*Math.sin(f0*31+seed),k1=0.6+0.4*Math.sin(f1*31+seed);const lev=[0,0.15,0.5,1];
  for(let j=0;j<3;j++){const ya=lev[j],yb=lev[j+1];const col=(y,k)=>{if(y<=0)return V.sc(g,0.2*k);if(y<0.2)return V.sc(g,k);if(y<0.6)return V.sc(mix3(g,pk,0.4),0.75*k);return V.sc(pk,0.0)};
   m.quad([X(f0),ya*H(f0),Z(f0)],[X(f1),ya*H(f1),Z(f1)],[X(f1),yb*H(f1),Z(f1)],[X(f0),yb*H(f0),Z(f0)],[col(ya,k0),col(ya,k1),col(yb,k1),col(yb,k0)],MAT.emis)}}return m.build()}
const AUR=[aurGeo(0.3),aurGeo(2.1),aurGeo(4.4)];
function buildTile(burnt){const T=200,m=new MB();const r=rngG(burnt?9:4);
  ground(m,-60,-T,60,0,null,0,10,(x,z)=>{const n=0.4+0.09*fbm(x*0.04+3,z*0.04,3)+0.05*(hsh(x*3|0,z*3|0)-0.5);return burnt?[n*0.45,n*0.42,n*0.4]:[n,n*0.98,n*0.94]});
  for(const z of[-100,-200,0])m.box([0,0.02,z],[120,0.06,1.0],burnt?[0.12,0.11,0.1]:[0.38,0.37,0.35]);for(const s of[-1,1])m.box([s*60,0.02,-T/2],[1.0,0.06,T],burnt?[0.12,0.11,0.1]:[0.38,0.37,0.35]);
  for(let k=0;k<3;k++){let x=(r()-0.5)*80,z=-r()*T;for(let i=0;i<8;i++){const nx=x+(r()-0.5)*8,nz=z-3-r()*4;if(Math.abs(nx)>3)m.quad([x-0.2,0.035,z],[nx-0.2,0.035,nz],[nx+0.2,0.035,nz],[x+0.2,0.035,z],[0.3,0.29,0.28]);x=nx;z=nz}}
  for(const s of[-1,1])ground(m,s>0?61:-400,-T,s>0?400:-61,0,null,-0.3,20,(x,z)=>{const q=fbm(x*0.03,z*0.03+s*9,3);return burnt?[0.13+q*0.06,0.11+q*0.04,0.1]:[0.32+q*0.12,0.5+q*0.12,0.2]});
  for(let i=0;i<1100;i++){const s=r()<0.5?-1:1;const x=s*(61+Math.pow(r(),1.6)*330),z=-r()*T;let h=(3+r()*8)*(1+(Math.abs(x)-60)/140);if(burnt)h*=0.25;const yaw=r()*TAU2,w=0.35+r()*0.35,lx=(r()-0.5)*h*0.5,lz=(r()-0.5)*h*0.5;
    const b0=[x+Math.cos(yaw)*w,-0.3,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,-0.3,z-Math.sin(yaw)*w],md=[x+lx*0.3,h*0.55,z+lz*0.3],tip=[x+lx,h,z+lz];const mw=[Math.cos(yaw)*w*0.6,0,Math.sin(yaw)*w*0.6];
    const cb=burnt?[0.06,0.05,0.05]:hx(r()<0.5?'#2f6a22':'#3a7a2a'),cm=burnt?[0.15,0.13,0.12]:hx('#5aa03a'),ct=burnt?[0.3,0.25,0.2]:hx(r()<0.5?'#9ad060':'#b8d870');
    m.quad(b0,b1,V.sub(md,mw),V.add(md,mw),[cb,cb,cm,cm]);m.tri(V.add(md,mw),V.sub(md,mw),tip,[cm,cm,ct])}
  for(let i=0;i<22;i++){const x=(r()<0.5?-1:1)*(4+r()*52),z=-r()*T,s=0.2+r()*0.7;m.ico([x,0,z],s,burnt?[0.2,0.18,0.17]:hx(['#8a8278','#9a8a7a','#6a645e','#b0a898'][i%4]),0,0.6,[6,9])}
  if(burnt)for(let i=0;i<40;i++){m.ico([(r()-0.5)*110,0.05,-r()*T],0.15+r()*0.25,[1,0.45,0.1],MAT.emis,0.5,[4,6])}
  else{m.ico([22,0.05,-60],3,hx('#c89a5a'),0,0.08,[6,12]);m.ico([-30,0.05,-150],2.5,hx('#b07a40'),0,0.08,[6,12])}
  return{mesh:m.build(0.45),T}}
const TILE=buildTile(false),TILEB=buildTile(true);
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
      if(i===0){if(pose==='sit')foot=[s*0.09,0.47+0.03*Math.sin((o.t||0)*9),-0.56];if(pose==='dust'){const w=(o.t||0)*13+s*1.4;foot=[s*0.13,0.5+0.07*Math.sin(w),-0.36+0.07*Math.cos(w)]}if(pose==='umb'&&s>0)foot=[0.2,0.62,-0.38];if(pose==='lift')foot=[s*0.2,0.86+0.02*Math.sin((o.t||0)*31+s),-0.3];if(pose==='walk'&&s>0&&o.crutch!==false)foot=[0.38,0.36,-0.36]}
      if(pose==='lift'&&i>0)foot=[s*0.62,0.0,fz[i]*1.25]}
    // root-space foot for sit/umb holds: compensate (feet given in body space already)
    const knee=V.add(V.add(hip,V.sc(V.sub(foot,hip),0.45)),[s*0.07,0.2,0]);const leg=AC.leg;
    it.push({mesh:UCYL,M:M4.mul(B,segM(hip,knee,0.036)),tint:leg,tintAmt:1});it.push({mesh:UCYL,M:M4.mul(B,segM(knee,foot,0.025)),tint:leg,tintAmt:1});P(B,USPH,knee,0.038,leg);P(B,USPH,foot,0.03,leg);
    if(limp){P(B,USPH,V.add(knee,V.sc(V.sub(foot,knee),0.5)),[0.05,0.07,0.05],AC.band)}
    if(i===0&&s>0)hands=foot}
  // crutch (matchstick)
  if(pose==='walk'&&o.crutch!==false){const g0=[0.55,0,-0.5-0.08*Math.cos(ph)*walk];const top=[0.38,0.42,-0.36];it.push({mesh:UCYL,M:M4.mul(B,segM(g0,top,0.028)),tint:AC.wood,tintAmt:1});P(B,USPH,top,[0.05,0.06,0.05],AC.match)}
  if(pose==='umb'&&hands){const top=[0.06,1.8,-0.12];it.push({mesh:UCYL,M:M4.mul(B,segM(hands,top,0.02)),tint:hx('#3a7a2a'),tintAmt:1});it.push({mesh:LEAF,M:M4.mul(B,M4.trs(V.add(top,[0,0.02,0]),0.4,0.12+0.05*Math.sin((o.t||0)*3),0.08,[1.0,1.0,1.25])),tint:null,tintAmt:0})}
  if(pose==='sit'){const cb=M4.mul(B,M4.trs([0,0.47,-0.62],(o.t||0)*0.3,0.3,0,[0.14,0.12,0.12]));it.push({mesh:CRUMB,M:cb})}
  if(ck>=0&&ck<1.4){for(let i=0;i<4;i++){const k=ck-i*0.06;if(k<0)continue;const p=[Math.sin(i*2)*0.05+0.0,0.42+k*0.25,-0.62-k*0.55];const s=0.05+k*0.14;it.push({mesh:USPH,M:M4.mul(Rm,M4.trs(p,0,0,0,s)),tint:[0.55,0.52,0.5],tintAmt:1,alpha:Math.max(0,0.55*(1-k/1.4)),noShadow:true})}}
  if(o.dizzy){for(let i=0;i<4;i++){const a=(o.t||0)*5+i/4*TAU2;it.push({mesh:UEMIS,M:M4.mul(Rm,M4.trs([Math.cos(a)*0.28,0.95+0.04*Math.sin(a*2),-0.3+Math.sin(a)*0.28],a,0.5,0,0.045)),tint:[1,0.9,0.3],tintAmt:1,noShadow:true})}}
  if(o.soot)for(const q of it)if(q.tint)q.tint=mix3(q.tint,[0.07,0.05,0.04],o.soot);
  if(o.frost)for(const q of it)if(q.tint)q.tint=mix3(q.tint,[0.72,0.9,1],o.frost);
  return it}
// ===================== HOT BALL & CO vs DYING ANT (part 2) =====================
// ---------- new meshes ----------
const ECYL=um(m=>m.prism([0,-0.5,0],1,1,1,24,[1,1,1],MAT.emis));
const EBOX=um(m=>m.box([0,0,0],[1,1,1],[1,1,1],MAT.emis));
function sphC(mb,c,r,colFn,res,mat,sq){const la=res[0],lo=res[1];const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[c[0]+Math.sin(th)*Math.cos(ph)*r,c[1]+Math.cos(th)*r*(sq||1),c[2]+Math.sin(th)*Math.sin(ph)*r]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
// red-hot ball: emissive orange with darker oxidised patches
const HOTB=um(m=>sphC(m,[0,0,0],1,p=>{const n=vnoise(p[0]*2.6+4,p[1]*2.6+p[2]*2.1);const sp=clamp((n-0.58)*4,0,1);const hot=mix3([1,0.3,0.05],[1,0.6,0.16],clamp(0.5+p[1]*0.5,0,1));return mix3(hot,[0.5,0.07,0.02],sp*0.8)},[22,34],MAT.emis),0.5);
const COLDB=um(m=>sphC(m,[0,0,0],1,p=>mix3([0.22,0.2,0.2],[0.42,0.38,0.36],vnoise(p[0]*3,p[1]*3+p[2])),[16,24],0),0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const w=1+0.12*Math.sin(i*1.9);m.tri([0,0,0],[Math.cos(b)*w,0,Math.sin(b)*w],[Math.cos(a)*w,0,Math.sin(a)*w],[1,1,1])}});
// lava sheet (front edge at z=0, extends to +z)
const LAVA=um(m=>{const NX=96,NZ=80,X0=-24,X1=24,L=40;const c=(x,z)=>{const aa=z*TAU2/40;const n=0.5*(fbm(x*0.25+2,2.2*Math.cos(aa)+9,3)+fbm(x*0.25+11,2.2*Math.sin(aa)+3,3));const v=Math.abs(Math.sin(x*1.3+n*7)*Math.sin(aa*7+n*6+Math.sin(x*0.5)));const cr=clamp((v-0.18)*3.2,0,1);const hot=mix3([1,0.85,0.35],[1,0.42,0.06],clamp(v*4,0,1));return mix3(hot,mix3([0.32,0.07,0.02],[0.16,0.04,0.03],n),cr*0.92)};
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const x0=X0+(X1-X0)*i/NX,x1=X0+(X1-X0)*(i+1)/NX,z0=L*j/NZ,z1=L*(j+1)/NZ;m.quad([x0,0,z0],[x0,0,z1],[x1,0,z1],[x1,0,z0],[c(x0,z0),c(x0,z1),c(x1,z1),c(x1,z0)],MAT.emis)}});
// snowflake (flat, XZ plane)
const SNOWF=um(m=>{const col=[0.88,0.96,1];const bar=(a,b,w)=>{const d=V.norm(V.sub(b,a));const n=[-d[2]*w,0,d[0]*w];m.quad(V.add(a,n),V.add(b,n),V.sub(b,n),V.sub(a,n),col,MAT.emis);m.quad(V.sub(a,n),V.sub(b,n),V.add(b,n),V.add(a,n),col,MAT.emis)};
  for(let i=0;i<6;i++){const a=i/6*TAU2;const dir=[Math.cos(a),0,Math.sin(a)];bar([0,0,0],V.sc(dir,1),0.07);for(const f of[0.45,0.72]){const p=V.sc(dir,f);for(const s of[-1,1]){const b=a+s*0.9;bar(p,V.add(p,[Math.cos(b)*0.3*(1.2-f),0,Math.sin(b)*0.3*(1.2-f)]),0.05)}}}
  m.ico([0,0,0],0.16,col,MAT.emis,0.3,[6,10])});
const ICE=um(m=>m.box([0,0,0],[1,1,1],hx('#c8f2ff'),MAT.glass));
// ---------- kaiju (unit height ~1, faces +z, feet at y=0) ----------
const KC=p=>{const n=vnoise(p[0]*14+3,p[1]*14+p[2]*9);return mix3(hx('#1f2a27'),hx('#3c4a43'),n)};
const KBODY=um(m=>{blob(m,[0,0.52,0],0.17,KC,1,1.45,[12,18]);blob(m,[0,0.66,0.05],0.14,KC,2,1.1,[10,16]);
  blob(m,[0,0.52,0.1],0.11,p=>mix3(hx('#4a5248'),hx('#5c6656'),vnoise(p[1]*30,p[0]*20)),3,1.6,[8,12]);
  blob(m,[0,0.8,0.1],0.07,KC,4,1.2,[8,12]);blob(m,[0,0.88,0.15],0.085,KC,5,0.8,[10,16]);blob(m,[0,0.865,0.24],0.06,KC,6,0.65,[8,12]);blob(m,[0,0.83,0.2],0.055,KC,7,0.5,[8,12]);
  for(const s of[-1,1]){blob(m,[s*0.15,0.63,0.1],0.04,KC,8+s,1.6,[6,10]);blob(m,[s*0.16,0.56,0.17],0.03,KC,10+s,1.0,[6,10])}
  for(let i=0;i<10;i++){const f=i/9;blob(m,[0,0.42-f*0.38,-0.12-f*0.62],0.12*(1-f*0.78),KC,20+i,0.9,[8,12])}
  for(const s of[-1,1])m.ico([s*0.042,0.895,0.215],0.014,hx('#ff5a8a'),MAT.emis,1,[6,8])},0.5);
const KSPK=um(m=>{const pts=[];for(let i=0;i<14;i++){const f=i/13;let p,h;if(f<0.35){const g=f/0.35;p=[0,lerp(0.94,0.7,g),lerp(0.1,-0.12,g)];h=lerp(0.05,0.11,g)}else{const g=(f-0.35)/0.65;p=[0,lerp(0.66,0.08,g),lerp(-0.14,-0.74,g)];h=lerp(0.11,0.03,g)}
  m.prism(p,h*0.5,0.002,h*1.5,6,hx("#5af0ff"),MAT.emis)}});
const KLEG=um(m=>{blob(m,[0,-0.06,0],0.1,KC,30,1.3,[8,12]);blob(m,[0,-0.2,0.03],0.07,KC,31,1.5,[8,12]);blob(m,[0,-0.33,0.07],0.075,KC,32,0.45,[8,12]);for(let i=-1;i<=1;i++)m.prism([i*0.035,-0.355,0.14],0.012,0.001,0.03,5,hx('#d8d0c0'),0)},0.5);
// ---------- timeline ----------
const R=[3.0,12.0,21.5,31.0,41.5,52.0,61.0]; // round starts; R[6]=end card
const EV={drop1:6.0,land1:6.35,roll1:8.0,rolled1:8.9,res1:9.2,walk1:10.0,
  fm:[13.2,13.8,14.4,15.0,15.5,16.0,16.4,16.8,17.2,17.6],res2:18.4,
  leaf3:21.9,leafL3:22.85,hop3:22.95,lava3:22.6,gl3:25.6,res3:26.2,
  bolt4a:33.6,bolt4b:36.3,res4:37.0,walk4:38.6,
  kai5:41.5,roar5:44.0,stomp5:45.6,buck5:46.5,fall5:47.9,res5:48.5,
  drop0:54.0,snow:57.0,endc:61.0,loop:65.5};
const FMP=[[1.3,-0.6],[-1.4,-1.0],[1.6,1.3],[-1.3,0.9],[0.8,-1.7],[-0.7,-2.0],[2.1,0.1],[-2.1,-0.2],[0.7,2.1],[-0.6,2.5]];
const ROUNDS=[['ROUND 1','1000°C red-hot ball 🔥','Free sauna 🧖',EV.res1],['ROUND 2','10 red-hot balls 🔥x10','Dodged all 10 😮‍💨',EV.res2],['ROUND 3','Lava flood 🌋 1150°C','Surfed it 🏄',EV.res3],['ROUND 4','Lightning strike ⚡ 30,000°C','Fully charged 🔋',EV.res4],['ROUND 5','100-meter KAIJU 🦖','Physics did the work 📐😎',EV.res5],['FINAL ROUND','One snowflake ❄️','Cause of death: winter 🥶💀',EV.snow+0.4]];
function roundAt(t){for(let i=5;i>=0;i--)if(t>=R[i])return i;return -1}
const FREEZE=[[EV.drop1,EV.walk1],[R[2]+0.3,EV.walk4]];
function distAt(t){let d=t;for(const [a,b] of FREEZE){if(t>a)d-=Math.min(t,b)-a}return d}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0')},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const E_DAY=envBase();
const E_HOT=envBase({sunCol:hx('#ffd8b0'),sky:hx('#e8b890'),fog:hx('#f0c8a0'),hor:hx('#ffd0a0'),zen:hx('#5a6ad0')});
const E_BURN=envBase({sun:[0.3,0.6,-0.5],sunCol:hx('#ff9a60'),sky:hx('#a03a20'),gnd:hx('#4a2a20'),fog:hx('#6a2a1a'),hor:hx('#ff6a30'),zen:hx('#1a0608'),stars:0.2,night:0.6,fogD:2600});
const E_STORM=envBase({sun:[0.3,0.5,-0.6],sunCol:hx('#7080b0'),sky:hx('#1a2038'),gnd:hx('#252a35'),fog:hx('#1c2236'),hor:hx('#3a4566'),zen:hx('#080a14'),stars:0,night:1,fogD:2600});
const E_SNOW=envBase({sun:[0.3,0.7,-0.4],sunCol:hx('#e0ecff'),sky:hx('#8ea4c4'),fog:hx('#b4c4d8'),hor:hx('#c8d6e6'),zen:hx('#3e5684'),gnd:hx('#8a92a0')});
function envAt(t){let e=E_DAY;const rn=roundAt(t);
  if(rn<=0)e=mixEnv(E_DAY,E_HOT,t<EV.land1?0.3:0.3+0.5*ease((t-EV.land1)/0.6)*(1-ease((t-EV.rolled1)/2)));
  if(rn===1)e=mixEnv(E_DAY,E_HOT,0.45);
  if(rn===2)e=mixEnv(mixEnv(E_DAY,E_HOT,0.45),E_BURN,ease((t-EV.lava3)/1.4));
  if(rn===3)e=mixEnv(E_BURN,E_STORM,ease((t-R[3])/1.0));
  if(rn===4)e=mixEnv(E_STORM,E_DAY,ease((t-R[4])/0.4));
  if(rn>=5||t>=R[5])e=mixEnv(E_DAY,E_SNOW,ease((t-R[5])/1.5));
  return e}
// ---------- camera ----------
function flakePos(t){const k=clamp((t-EV.drop0)/(EV.snow-EV.drop0),0,1);return[0.55*Math.sin(k*7.5)*(1-k)+0.02,lerp(4.4,0.86,Math.pow(k,0.9)),-0.32+0.4*Math.cos(k*6)*(1-k)]}
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.95,-3.9-k*0.3];at=[0,1.05,0.3]}
  if(rn===0){eye=[1.6+sway,1.15,-4.3];at=[0,0.85,0.4];if(t>=EV.drop1&&t<EV.rolled1+0.6){const k=ease((t-EV.drop1)/0.5);eye=V.add(eye,[-0.2*k,-0.1*k,0.45*k]);at=V.add(at,[0,-0.3*k,0])}}
  if(rn===1){const k=ease((t-R[1])/1.0);eye=[lerp(2.1,1.8,k)+sway*0.5,lerp(1.8,1.5,k),-4.3];at=[0,0.5,0.6]}
  if(rn===2){const k=ease((t-R[2])/6);eye=[lerp(-2.1,-1.5,k),lerp(0.95,0.7,k),lerp(-4.0,-3.3,k)];at=[0,0.5,0.6];if(t>EV.gl3-0.4){const kk=ease((t-EV.gl3+0.4)/0.8);eye=V.add(eye,V.sc([0.3,0.08,0.45],kk))}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[1.5+sway*0.4,lerp(0.95,0.7,k),-3.7];at=[0,lerp(0.8,1.35,k),0.6];if(t>=EV.bolt4b+0.6){const kk=ease((t-EV.bolt4b-0.6)/1.0);eye=V.add(eye,[-0.2*kk,0.2*kk,0.8*kk]);at=V.add(at,[0,-0.55*kk,0])}}
  if(rn===4){const k=ease((t-R[4])/1.2);eye=[1.9+sway*0.3,lerp(0.75,0.35,k),-4.4];at=[-0.9,lerp(1.0,2.4,k),2.0];if(t>=EV.fall5+0.4){const kk=ease((t-EV.fall5-0.4)/1.0);at=V.add(at,[0,-0.8*kk,0]);eye=V.add(eye,[0,0.25*kk,0.4*kk])}}
  if(rn===5){const k=ease((t-R[5])/2.0);eye=[lerp(1.7,1.25,k),0.95,lerp(-3.8,-3.0,k)];at=[0,0.55,0.2];
    if(t>=EV.drop0-0.3){const f=flakePos(t);const kk=ease((t-EV.drop0+0.3)/0.7);at=[0,lerp(0.55,Math.max(0.6,(f[1]+0.5)*0.5),kk),0];eye=[1.25,lerp(0.95,0.75,kk),lerp(-3.0,-3.9,kk)]}
    if(t>=EV.snow){const kk=ease((t-EV.snow)/1.2);eye=[lerp(1.25,1.35,kk),lerp(0.75,1.3,kk),lerp(-3.9,-3.1,kk)];at=[0,lerp(0.6,0.45,kk),0]}}
  if(t>=R[6])eye=[1.35,1.3,-3.1],at=[0,0.45,0];
  return{eye,at}}
// ---------- background (meters) ----------
let KPOS=[0,0,0];
function kaiju(items,t,P,dir){if(t<EV.kai5-0.1||t>=R[5])return;const yaw=Math.atan2(-dir[0],-dir[2]);const d=lerp(620,240,clamp((t-EV.kai5)/(EV.stomp5-EV.kai5),0,1));const p=P(d,d*0.12,0);KPOS=V.add(p,[0,60,0]);const S=105;
  const wph=(Math.min(t,EV.stomp5)-EV.kai5)*TAU2/1.8;const walking=t<EV.stomp5;
  const kb=ease((t-EV.buck5)/0.7),kf=easeIn(clamp((t-EV.buck5-0.45)/1.0,0,1));const fall=kf*1.42;const stompLift=t>=EV.stomp5&&t<EV.buck5+0.2?Math.sin(clamp((t-EV.stomp5)/0.9,0,1)*Math.PI*0.6)*0.5:0;
  const bobY=walking?0.012*Math.abs(Math.sin(wph)):0;
  let Rt=M4.mul(M4.trs(p,yaw,0,0,S),M4.trs([0,0,-0.1*kf],0,-fall,0.05*Math.sin(t*0.9),1));const B=M4.mul(Rt,M4.trs([0,bobY-0.1*kb,0],0,0,walking?0.04*Math.sin(wph):0,1));
  items.push({mesh:KBODY,M:B});const pulse=t>=EV.roar5&&t<EV.roar5+1.6?0.6+0.4*Math.sin((t-EV.roar5)*20):0.25;
  items.push({mesh:KSPK,M:B});items.push({mesh:KSPK,M:M4.mul(B,M4.trs([0,0,0],0,0,0,1.03)),tint:[0.5,1,1],tintAmt:1,alpha:pulse*0.5,add:1,noShadow:true});
  for(const s of[-1,1]){let sw=walking?s*0.38*Math.sin(wph):0;if(s>0)sw-=stompLift;const bend=kb*0.9;items.push({mesh:KLEG,M:M4.mul(B,M4.trs([s*0.11,0.36,0],0,sw-bend*0.5,s*bend*0.35,1))})}
  // fall dust
  const k=t-EV.fall5;if(k>0){const pos=P(d+90,d*0.12,0);const sx=easeOut(k/1.6);items.push({mesh:DUSTRING,M:M4.trs(pos,0,0,0,[60+sx*260,18+sx*40,60+sx*260])});
    for(let i=0;i<14;i++){const a=i/14*TAU2;const r=40+sx*200*(0.6+hsh(i,4)*0.6);items.push({mesh:USPH,M:M4.trs(V.add(pos,[Math.cos(a)*r,12+sx*60*hsh(i,2),Math.sin(a)*r]),0,0,0,30+sx*70),tint:[0.62,0.58,0.52],tintAmt:1,alpha:0.7*(1-clamp((k-1.5)/2.5,0,1)),noShadow:true})}}}
function bgItems(t){const items=[{mesh:BGG}];const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  kaiju(items,t,P,dir);
  return{items,dir,side}}
// ---------- foreground (cm) ----------
let LASTVP=null,HOTPTS=[];
function hotBall(items,p,r,heat,rot){items.push({mesh:HOTB,M:M4.trs(p,rot||0,0,0,r),tint:[0.35,0.06,0.02],tintAmt:1-heat,noShadow:false});
  if(heat>0.05){items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r*1.3),tint:[1,0.45,0.12],tintAmt:1,alpha:0.18*heat,add:1,noShadow:true});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r*1.85),tint:[1,0.3,0.05],tintAmt:1,alpha:0.05*heat,add:1,noShadow:true});
    items.push({mesh:DISC2,M:M4.trs([p[0],0.03,p[2]],0,0,0,[r*1.6,1,r*1.6]),tint:[1,0.4,0.08],tintAmt:1,alpha:0.5*heat,add:1,noShadow:true});HOTPTS.push([p,r,heat])}}
function smoke(items,p,k,n,sc){for(let j=0;j<n;j++){const kk=k-j*0.18;if(kk<0||kk>2.4)continue;items.push({mesh:USPH,M:M4.trs([p[0]+Math.sin(kk*2+j)*0.15*kk,p[1]+kk*0.9,p[2]+kk*0.2],0,0,0,(0.15+kk*0.3)*sc),tint:[0.55,0.52,0.5],tintAmt:1,alpha:Math.max(0,0.18*(1-kk/2.4)),noShadow:true})}}
function boltPts(seed,top,bot,n){const pts=[];for(let i=0;i<=n;i++){const f=i/n;const j=i===0||i===n?0:1;pts.push([lerp(top[0],bot[0],f)+j*(hsh(seed,i)-0.5)*1.6*(1-f*0.5),lerp(top[1],bot[1],f),lerp(top[2],bot[2],f)+j*(hsh(i,seed+3)-0.5)*1.2])}return pts}
function drawBolt(items,seed,top,bot,a){const pts=boltPts(seed,top,bot,18);for(let i=0;i<pts.length-1;i++){items.push({mesh:ECYL,M:segM(pts[i],pts[i+1],0.045),tint:[1,1,1],tintAmt:1,alpha:a,add:1,noShadow:true});items.push({mesh:ECYL,M:segM(pts[i],pts[i+1],0.18),tint:[0.45,0.65,1],tintAmt:1,alpha:0.45*a,add:1,noShadow:true})}
  for(let b=0;b<4;b++){const i0=2+b*3;let p=pts[i0];for(let k=0;k<4;k++){const q=V.add(p,[(hsh(seed+b,k)-0.25)*2.0,-1.3,(hsh(k,seed+b)-0.5)*1.2]);items.push({mesh:ECYL,M:segM(p,q,0.025),tint:[0.85,0.9,1],tintAmt:1,alpha:a*0.75,add:1,noShadow:true});p=q}}}
function boltA(t,t0){const k=t-t0;if(k<0||k>0.5)return 0;if(k<0.07)return 1;if(k<0.11)return 0.15;if(k<0.2)return 1;return 1-(k-0.2)/0.3}
function lavaEdge(t){return 40-30*(Math.min(t,R[3])-EV.lava3)}
function fgItems(t){HOTPTS=[];const rn=roundAt(t);const items=[];const burnt=t>=EV.lava3+1.3&&t<R[4];const L=burnt?TILEB:TILE;
  let pose='walk',walk=1,o={t};let hide=false;const gz=(t0)=>1.1*(distAt(t)-distAt(t0));
  const dist=1.1*distAt(t);const o_=((dist%L.T)+L.T)%L.T;for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // ---- R1: ball in tongs, drop, sizzle, roll off ----
  if(t<R[1]+0.6){const r=0.82;let bp=[0,1.9+0.04*Math.sin(t*2.1),0.25],rot=0;
    if(t>=EV.drop1){const k=clamp((t-EV.drop1)/(EV.land1-EV.drop1),0,1);bp=[0,lerp(1.9,r,k*k),0.25]}
    if(t>=EV.land1){bp=[0,r,0.25];if(t<EV.land1+0.25){const k=(t-EV.land1)/0.25;bp[1]=r+Math.sin(k*Math.PI)*0.12}}
    if(t>=EV.roll1){const k=ease((t-EV.roll1)/(EV.rolled1-EV.roll1));bp=[lerp(0,2.4,k),r,0.25];rot=0;}
    if(t>=EV.walk1)bp[2]+=gz(EV.walk1);
    const heat=t<EV.rolled1+1.5?1:clamp(1-(t-EV.rolled1-1.5)/3.5,0.35,1);
    if(bp[2]<9){if(t>=EV.roll1){const k=ease((t-EV.roll1)/(EV.rolled1-EV.roll1));items.push({mesh:HOTB,M:M4.mul(M4.trs(bp,0,0,0,1),M4.trs([0,0,0],0,0,-k*2.9,r)),tint:[0.35,0.06,0.02],tintAmt:1-heat});items.push({mesh:UEMIS,M:M4.trs(bp,0,0,0,r*1.3),tint:[1,0.45,0.12],tintAmt:1,alpha:0.18*heat,add:1,noShadow:true});items.push({mesh:UEMIS,M:M4.trs(bp,0,0,0,r*1.85),tint:[1,0.3,0.05],tintAmt:1,alpha:0.05*heat,add:1,noShadow:true});items.push({mesh:DISC2,M:M4.trs([bp[0],0.03,bp[2]],0,0,0,[r*1.6,1,r*1.6]),tint:[1,0.4,0.08],tintAmt:1,alpha:0.5*heat,add:1,noShadow:true});HOTPTS.push([bp,r,heat])}else hotBall(items,bp,r,heat,rot)}
    // tongs
    if(t<EV.drop1+0.8){const up=t<EV.drop1?0:easeIn((t-EV.drop1)/0.8)*4;const open=t<EV.drop1?0:ease((t-EV.drop1)/0.15)*0.25;
      for(const s of[-1,1]){const tip=[s*(r*0.78+open),1.9+0.04*Math.sin(t*2.1)+up,0.25],mid=[s*(r*1.05+open),2.7+up,0.25],top=[s*0.12,4.6+up,0.25];
        items.push({mesh:UCYL,M:segM(tip,mid,0.055),tint:hx('#4a4e56'),tintAmt:1});items.push({mesh:UCYL,M:segM(mid,top,0.06),tint:hx('#5a5e66'),tintAmt:1});items.push({mesh:USPH,M:M4.trs(mid,0,0,0,0.07),tint:hx('#4a4e56'),tintAmt:1})}}
    // scorch mark under impact
    if(t>=EV.land1){const z=0.25+(t>=EV.walk1?gz(EV.walk1):0);if(z<9)items.push({mesh:DISC2,M:M4.trs([0,0.025,z],1,0,0,[1.05,1,1.05]),tint:[0.08,0.06,0.05],tintAmt:1,alpha:0.7,noShadow:true});
      smoke(items,[0,0.9,0.25+(t>=EV.walk1?gz(EV.walk1):0)],t-EV.land1,8,1.4)}}
  if(rn===0&&t>=EV.land1-0.02&&t<EV.roll1+0.35)hide=true;
  if(rn===0&&t>=EV.drop1-0.5&&t<EV.land1)o.lid=0.0;
  if(rn===0&&t>=EV.roll1+0.35&&t<EV.walk1){walk=0;o.soot=0.55;o.dizzy=true;o.lid=0.15;const k=(t-EV.roll1-0.35)/0.45;if(k<1)Rm=M4.trs([0,0,0],0,0,0,[1+0.25*(1-k),lerp(0.45,1,easeOut(k)),1+0.15*(1-k)])}
  if(rn===0&&t>=EV.walk1)o.soot=0.55*(1-clamp((t-EV.walk1)/2.5,0,1));
  // ---- R2: ten balls rain down ----
  if(rn===1||(t>=R[2]&&t<R[2]+0.6)){EV.fm.forEach((f,i)=>{const [x0,z0]=FMP[i];const k=t-f;const r=0.42;const tf=0.45;
      if(k>-tf&&k<0){const q=clamp(1+k/tf,0,1);const st=[x0*0.3+1.2,11,z0+5];const p=V.add(st,V.sc(V.sub([x0,r,z0],st),q*q));hotBall(items,p,r,1,0);
        const tail=V.add(st,V.sc(V.sub([x0,r,z0],st),Math.max(0,q*q-0.25)));items.push({mesh:ECYL,M:segM(tail,p,r*0.55),tint:[1,0.55,0.15],tintAmt:1,alpha:0.35,add:1,noShadow:true})}
      if(k>=0){const z=z0+gz(f);if(z>9)return;let y=r;if(k<0.22)y=r+Math.sin(k/0.22*Math.PI)*0.2;hotBall(items,[x0,y,z],r,clamp(1-k/9,0.4,1),0);
        items.push({mesh:DISC2,M:M4.trs([x0,0.025,z],i,0,0,[0.75,1,0.75]),tint:[0.08,0.06,0.05],tintAmt:1,alpha:0.65,noShadow:true});
        if(k<0.5){items.push({mesh:RING,M:M4.trs([x0,0.05,z],0,0,0,0.3+k*3.2),tint:[1,0.6,0.2],tintAmt:1,alpha:0.7*(1-k/0.5),add:1,noShadow:true});
          for(let j=0;j<10;j++){const a=j/10*TAU2+i;const sp=1.4+hsh(i,j)*1.8;const p=[x0+Math.cos(a)*sp*k,0.1+k*(4-k*12)*(0.6+hsh(j,i)*0.6),z+Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.04),tint:[1,0.75,0.3],tintAmt:1,alpha:1,add:1,noShadow:true})}}
        smoke(items,[x0,0.6,z],k,5,0.9)}})}
  if(rn===1){for(const f of EV.fm){const k=t-f;if(k>=-0.1&&k<0.28){o.lid=0.05;Rm=M4.trs([0,Math.sin(clamp(k+0.1,0,0.38)/0.38*Math.PI)*0.3,0],0,0,0,1)}}}
  // ---- R3: leaf + lava ----
  const onLeaf=t>=EV.hop3+0.35&&t<EV.walk4;
  if(rn===2||rn===3){if(t>=EV.leaf3&&t<EV.walk4+0.1){let lp=[0,0.1,0.12],ly=0,lr=0,lpitch=0;
      if(t<EV.leafL3){const k=clamp((t-EV.leaf3)/(EV.leafL3-EV.leaf3),0,1);lp=[lerp(1.6,0,k)+0.4*Math.sin(k*9)*(1-k),lerp(4.2,0.1,k),lerp(-0.6,0.12,k)];ly=k*3;lr=0.5*Math.sin(k*11)*(1-k);lpitch=0.4*Math.cos(k*9)*(1-k)}
      if(onLeaf){lr=0.04*Math.sin(t*2.6);lp[1]=0.11+0.015*Math.sin(t*3.1)}
      items.push({mesh:ALEAF,M:M4.trs(lp,ly,lpitch,lr,[0.95,1,1.3]),tint:null,tintAmt:0})}
    if(t>=EV.lava3){const ze=lavaEdge(t);const cool=rn===3?ease((t-R[3])/1.5):0;const zz=ze+(t>=EV.walk4?gz(EV.walk4):0);
      for(let q=0;q<9;q++){const z0=zz+q*40;if(z0>200)break;if(z0+40<-8)continue;items.push({mesh:LAVA,M:M4.trs([0,0.07,z0],0,0,0,1),tint:[0.1,0.05,0.045],tintAmt:cool*0.82,noShadow:true})}
      if(rn===2){items.push({mesh:EBOX,M:M4.trs([0,0.14,zz+0.25],0,0,0,[80,0.18,0.7]),tint:[1,0.6,0.15],tintAmt:1,alpha:0.95,noShadow:true});items.push({mesh:EBOX,M:M4.trs([0,0.2,zz+0.3],0,0,0,[80,0.5,1.6]),tint:[1,0.4,0.05],tintAmt:1,alpha:0.25,add:1,noShadow:true});
        for(let i=0;i<14;i++){const ph=((t*0.8+hsh(i,7))%1);const x=(hsh(i,8)-0.5)*7,z=Math.max(zz+0.5,-2)+hsh(i,9)*6;items.push({mesh:UEMIS,M:M4.trs([x,0.08+ph*0.08,Math.max(z,0.8)],0,0,0,0.03+0.06*Math.sin(ph*Math.PI)),tint:[1,0.75,0.3],tintAmt:1,alpha:0.8*(1-ph),add:1,noShadow:true})}
        if(t>=EV.lava3+1.3)for(let i=0;i<6;i++){const k=((t-EV.lava3)*0.6+i/6)%1;smoke(items,[(hsh(i,1)-0.5)*5,0.3,1+hsh(i,2)*4],k*2.4,1,1.6)}}}}
  if(rn===2&&t>=EV.leaf3&&t<EV.hop3)o.lid=0.05;
  if(t>=EV.hop3&&t<EV.hop3+0.35){const k=(t-EV.hop3)/0.35;walk=0;Rm=M4.trs([0,Math.sin(k*Math.PI)*0.55+0.11*k,0],0,0,0,1)}
  if(onLeaf){walk=0;Rm=M4.trs([0,0.11+0.015*Math.sin(t*3.1),0],0,0,0.04*Math.sin(t*2.6),1)}
  if(t>=EV.gl3&&t<R[3]+1.5)o.glasses=easeOut((t-EV.gl3)/0.5)*(1-ease((t-R[3]-0.8)/0.5));
  // ---- R4: lightning ----
  if(rn===3){for(const [b,sd] of [[EV.bolt4a,3],[EV.bolt4b,11]]){const a=boltA(t,b);if(a>0){drawBolt(items,sd,[-2.5+sd*0.1,28,6],[0,0.78,-0.15],a);items.push({mesh:RING,M:M4.trs([0,0.05,0],0,0,0,0.5+(t-b)*6),tint:[0.7,0.85,1],tintAmt:1,alpha:0.6*a,add:1,noShadow:true})}}
    const ch=t>=EV.bolt4a?clamp(1-(t-EV.bolt4b-3.5)/1.5,0,1):0;if(ch>0){const pu=0.5+0.5*Math.sin(t*9);items.push({mesh:UEMIS,M:M4.trs([0,0.45,0.1],0,0,0,[0.75,0.6,1.0]),tint:[0.4,0.85,1],tintAmt:1,alpha:(0.02+0.025*pu)*ch,add:1,noShadow:true});
      for(let i=0;i<8;i++){const ph=((t*2.2+hsh(i,3))%1);const a2=hsh(i,4)*TAU2+t*3;items.push({mesh:ECYL,M:segM([Math.cos(a2)*0.35,0.3+ph*0.6,Math.sin(a2)*0.5],[Math.cos(a2+0.5)*0.45,0.42+ph*0.6,Math.sin(a2+0.5)*0.6],0.012),tint:[0.7,0.95,1],tintAmt:1,alpha:ch*(1-ph)*(hsh(i,Math.floor(t*12))>0.5?1:0),add:1,noShadow:true})}}
    if(t>=EV.bolt4a&&t<EV.bolt4a+0.6||t>=EV.bolt4b&&t<EV.bolt4b+0.6){o.lid=0.0;o.flail=1}
    if(t>=EV.bolt4a+0.3){o.dizzy=t<EV.bolt4b-0.4||(t>=EV.bolt4b+0.3&&t<EV.res4+0.8);o.soot=0.35*clamp(1-(t-EV.res4-1)/2,0,1)}}
  // ---- FINAL: one snowflake ----
  if(rn===5&&t>=EV.drop0-0.3&&t<EV.snow+0.1){const f=flakePos(t);const k=clamp((t-EV.drop0)/(EV.snow-EV.drop0),0,1);items.push({mesh:SNOWF,M:M4.mul(M4.trs(f,0.3*Math.sin(t*1.9),1.4+0.22*Math.sin(t*2.3),0,1),M4.trs([0,0,0],t*1.2,0,0,0.34)),tint:null,tintAmt:0,noShadow:true});
    items.push({mesh:UEMIS,M:M4.trs(f,0,0,0,0.2),tint:[0.75,0.9,1],tintAmt:1,alpha:0.08,add:1,noShadow:true})}
  const frz=t>=EV.snow?ease((t-EV.snow)/0.5):0;
  if(frz>0){o.frost=0.75*frz;walk=0;o.xeyes=t>=EV.snow+0.35;o.lid=0;
    items.push({mesh:ICE,M:M4.trs([0,0.42,0.12],0.08,0,0,[1.05*frz+0.01,0.95*frz+0.01,1.75*frz+0.01]),tint:null,tintAmt:0,alpha:0.5*frz,noShadow:true});
    if(t<EV.snow+0.6){for(let i=0;i<16;i++){const a=i/16*TAU2;const kk=(t-EV.snow)/0.6;items.push({mesh:UEMIS,M:M4.trs([Math.cos(a)*0.8*kk,0.4+0.3*Math.sin(i*1.3),Math.sin(a)*1.1*kk],0,0,0,0.03),tint:[0.85,0.95,1],tintAmt:1,alpha:1-kk,add:1,noShadow:true})}}}
  if(rn===5&&t<EV.drop0-0.8)o.lid=0.62;
  if(rn===5&&t>=EV.drop0-0.8&&t<EV.snow){o.lid=0.0;walk=t<EV.drop0+0.6?1:0.0}
  if(t>=R[6]){walk=0}
  o.ph=t*5.2;o.walk=walk;o.pose=pose;
  const coughs=[2.0,EV.roll1+0.5,EV.res2+0.8,EV.bolt4a+0.7,EV.bolt4b+0.8,EV.res5+0.6];if(!frz)for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  if(!hide)items.push(...antItems(Rm,o));
  return items}
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function dustAmt(t){const k=t-EV.fall5-0.25;if(k<0)return 0;if(k<0.3)return 0.75*easeOut(k/0.3);if(k<0.9)return 0.75;return 0.75*clamp(1-(k-0.9)/1.2,0,1)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.land1,22,0.5);EV.fm.forEach(d=>S(d,12,0.4));if(t>=EV.lava3&&t<R[3])a+=2.5;S(EV.lava3+1.2,10,1.2);S(EV.bolt4a,34,0.7);S(EV.bolt4b,30,0.7);
  if(t>=EV.kai5&&t<EV.stomp5){const ph=((t-EV.kai5)/0.9)%1;a+=7*Math.max(0,1-ph*4)}S(EV.roar5,10,1.6);S(EV.buck5,14,0.5);S(EV.fall5,48,2.4);S(EV.hop3+0.35,6,0.3);if(t<0.8)a+=8*(1-t/0.8);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[6])return;const ts=R[rn];const k=t-ts;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=rn===5&&t<EV.drop0;
  if(!hideLab){const kk=rn===5?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===5?104:120,rn===5?'#5AF0FF':'#ffd84a');ctx.restore();
    if(t<t2)pill(cap1,385,rn===5?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,kk/0.12));else pill(cap2,385,rn===5?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[5]+0.3&&t<EV.drop0-0.6)pill('Kaiju gone… finally peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[5]-0.3)/0.15));if(t>=EV.drop0-0.6)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.snow+0.35;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle='#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore();
  // stat cards
  if(rn===0&&t>=EV.land1+0.4&&t<R[1]-0.2)card('Glows orange at ≈1000°C 🌡️',660,'rgba(230,90,20,0.92)',54,EV.land1+0.4,t);
  if(rn===0&&t>=EV.res1+0.6&&t<R[1]-0.2)card('Real: hot metal glows = thermal radiation 🔴',770,'rgba(15,10,30,0.72)',42,EV.res1+0.6,t);
  if(rn===1&&t>=EV.res2+0.5&&t<R[2]-0.2)card('That’s 2× hotter than a pizza oven 🍕',660,'rgba(230,90,20,0.92)',50,EV.res2+0.5,t);
  if(rn===2&&t>=EV.lava3+1.6&&t<R[3]-0.2)card('Real lava: ≈1150°C 🌋',660,'rgba(230,70,20,0.92)',56,EV.lava3+1.6,t);
  if(rn===2&&t>=EV.res3+0.8&&t<R[3]-0.2)card('Real physics: that leaf would be toast 🍂🔥',770,'rgba(15,10,30,0.72)',42,EV.res3+0.8,t);
  if(rn===3&&t>=EV.bolt4a+0.7&&t<R[4]-0.2)card('5× hotter than the Sun’s surface ☀️',660,'rgba(60,90,220,0.92)',50,EV.bolt4a+0.7,t);
  if(rn===3&&t>=EV.res4+0.9&&t<R[4]-0.2)card('Real: Earth gets ~44 lightning flashes per second ⚡',770,'rgba(15,10,30,0.72)',40,EV.res4+0.9,t);
  if(rn===4&&t>=EV.fall5+0.7&&t<R[5]-0.2)card('📐 SQUARE-CUBE LAW',660,'rgba(90,60,200,0.92)',58,EV.fall5+0.7,t);
  if(rn===4&&t>=EV.fall5+1.5&&t<R[5]-0.2)card('10× bigger = 1000× heavier 😳',770,'rgba(15,10,30,0.75)',50,EV.fall5+1.5,t);
  if(rn===4&&t>=EV.fall5+2.4&&t<R[5]-0.2)card('…but bones only 100× stronger 🦴',875,'rgba(255,60,110,0.9)',50,EV.fall5+2.4,t);
  if(rn===5&&t>=EV.snow+1.3)card('Real: ants are cold-blooded 🧊',660,'rgba(30,120,190,0.9)',54,EV.snow+1.3,t);
  if(rn===5&&t>=EV.snow+2.0)card('Cold makes them freeze up ❄️',770,'rgba(15,10,30,0.72)',46,EV.snow+2.0,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('RED-HOT BALL 🔥',0,-110,fitSize('RED-HOT BALL 🔥',980,112),'#FF8A3A');txt('vs',0,-5,76,'#ffffff');txt('ONE DYING ANT 🐜',0,95,96,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[6];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  txt('Survived 30,000°C ⚡🔥',0,-230,fitSize('Survived 30,000°C ⚡🔥',960,76),'#FFD84A');txt('Lost to 0°C ❄️',0,-130,fitSize('Lost to 0°C ❄️',960,76),'#5AF0FF');
  txt('Who wins:',0,10,84,'#ffffff');txt('YOU or this ant? 🐜',0,115,fitSize('YOU or this ant? 🐜',960,90),'#ffd84a');txt('👇',0,280+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1140,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;
  ctx.save();ctx.globalCompositeOperation='screen';for(const [p,r,h] of HOTPTS){const q=project(LASTVP,p);if(!q)continue;const rad=Math.min(900,r*1900/q[2]*1.6);glowAt(q,rad,'255,80,20',0.22*h)}
  // kaiju spikes glow
  if(tt>=EV.kai5&&tt<R[5]&&LASTVP_BG){const q=project(LASTVP_BG,KPOS);if(q)glowAt(q,500,'90,240,255',tt>=EV.roar5&&tt<EV.roar5+1.6?0.28:0.12)}
  ctx.restore();
  const da=dustAmt(tt);if(da>0){ctx.fillStyle=`rgba(150,138,120,${0.93*da})`;ctx.fillRect(0,0,W,H);const r=rngG(Math.floor(tt*30));ctx.strokeStyle=`rgba(90,80,70,${0.5*da})`;ctx.lineWidth=6;for(let i=0;i<40;i++){const x=r()*W*1.4-W*0.2,y=r()*H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+120+r()*200,y+30*(r()-0.5));ctx.stroke()}}
  // lava heat from bottom
  if(tt>=EV.lava3&&tt<R[3]+1.5){const a=ease((tt-EV.lava3-0.8)/1.0)*(1-ease((tt-R[3])/1.5));const g=ctx.createLinearGradient(0,H,0,H*0.45);g.addColorStop(0,`rgba(255,90,20,${0.18*a})`);g.addColorStop(1,'rgba(255,90,20,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
  // storm blue
  if(tt>=R[3]&&tt<R[4]){ctx.fillStyle=`rgba(20,30,80,${0.12*ease((tt-R[3])/1)})`;ctx.fillRect(0,0,W,H)}
  // kaiju CRACK
  if(tt>=EV.buck5&&tt<EV.buck5+1.3){const k=tt-EV.buck5;const pp=k<0.15?0.5+0.5*easeOut(k/0.15):1;ctx.save();ctx.globalAlpha=clamp((1.3-k)/0.3,0,1);ctx.translate(W/2+Math.sin(k*60)*6,840);ctx.rotate(-0.08);ctx.scale(pp,pp);txt('*CRACK* 🦴',0,0,110,'#FF5A8A');ctx.restore()}
  if(tt>=EV.roar5&&tt<EV.roar5+1.4){const k=tt-EV.roar5;ctx.save();ctx.globalAlpha=clamp((1.4-k)/0.3,0,1)*clamp(k/0.1,0,1);ctx.translate(W/2+Math.sin(k*70)*8,860);ctx.scale(1+k*0.15,1+k*0.15);txt('ROOOAR!',0,0,104,'#7DFF9A');ctx.restore()}
  // cold mood
  if(tt>=R[5]&&tt<EV.loop){ctx.fillStyle=`rgba(90,130,190,${0.08*ease((tt-R[5])/1.5)})`;ctx.fillRect(0,0,W,H)}
  if(tt>=EV.drop0-0.6&&tt<EV.snow+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.snow-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  if(tt>=EV.snow){const k=ease((tt-EV.snow)/0.6);const g=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.62);g.addColorStop(0,'rgba(220,240,255,0)');g.addColorStop(1,`rgba(220,240,255,${0.55*k})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<6;i++)flash(R[i],0.35,0.15);flash(EV.land1,0.55,0.35,'255,170,90');EV.fm.forEach(d=>flash(d,0.16,0.15,'255,170,90'));flash(EV.lava3+1.2,0.3,0.4,'255,140,60');
  for(const b of[EV.bolt4a,EV.bolt4b]){const a=boltA(tt,b);if(a>0){ctx.fillStyle=`rgba(220,230,255,${0.3*a})`;ctx.fillRect(0,0,W,H)}}
  flash(EV.buck5,0.25,0.2,'255,120,160');flash(EV.fall5,0.6,0.5,'255,240,220');flash(EV.snow,0.6,0.35,'220,240,255');
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
let LASTVP_BG=null;
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function updBG(t){const tt=t>=EV.loop?t-EV.loop:t;const c=camAt(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);LASTVP_BG=M4.mul(M4.persp(0.95,W/H,4,4e5),M4.look(be,V.add(be,fd),[0,1,0]))}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);updBG(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
