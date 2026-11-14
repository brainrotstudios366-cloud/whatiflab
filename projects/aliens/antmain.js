// ===================== ALIENS vs DYING ANT =====================
const FPS=30,DUR=65,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
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
  return it}
// ---------- timeline ----------
const R=[3.6,12.0,21.0,31.0,41.0,50.5,60.2]; // round starts; R[6]=end card
const EV={fm:[5.0,5.7,6.4,7.1,7.8,8.5],res1:9.4,
  ufo2:12.0,beam2:13.2,lift2:13.6,up2:15.3,fly2:15.8,drop2:16.0,land2:17.3,res2:17.7,
  night3:21.0,ms3:21.2,beam3:23.2,imp3:23.8,hit3:25.2,gl3:26.6,res3:26.6,
  scan4:32.0,cnt4:32.6,per4:34.9,flee4:36.7,res4:37.2,
  ufo5:41.2,ray5:42.1,lift5:42.5,res5:46.2,
  drop0:53.0,splash:55.6,endc:60.2,loop:64.6};
const FMP=[[1.0,-0.4],[-1.2,-0.9],[1.3,0.9],[-1.0,0.6],[0.9,-1.4],[-0.7,-1.7]];
const ROUNDS=[['ROUND 1','Alien laser barrage 👽🔫','Missed every single shot 😮‍💨',EV.res1],['ROUND 2','UFO abduction 🛸','Dropped from the sky… walked it off 🪂',EV.res2],['ROUND 3','Mothership city-buster 💥','Didn’t even look up 😎',EV.res3],['ROUND 4','Alien scan: count the ants 📡','Aliens: “NOPE.” 🛸💨',EV.res4],['ROUND 5','20× gravity ray 🌀','Leg day paid off 🦵💪',EV.res5],['FINAL ROUND','One single raindrop 💧','Cause of death: rain 💀',EV.splash+0.3]];
function roundAt(t){for(let i=5;i>=0;i--)if(t>=R[i])return i;return -1}
// ---------- alien meshes ----------
const ECYL=um(m=>m.prism([0,-0.5,0],1,1,1,24,[1,1,1],MAT.emis));
const ECONE=um(m=>m.prism([0,0,0],1,0.22,1,32,[1,1,1],MAT.emis));
const EBOX=um(m=>m.box([0,0,0],[1,1,1],[1,1,1],MAT.emis));
const UFO=um(m=>{const hull=p=>mix3(hx('#8a94a8'),hx('#e4ecf6'),clamp(p[1]*3+0.5,0,1));
  m.ico([0,0,0],1,[1,1,1],0,0.2,[14,40]);
  // recolor via second pass: rings
  for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const r0=0.55,r1=0.92;m.quad([Math.cos(a)*r0,0.135,Math.sin(a)*r0],[Math.cos(b)*r0,0.135,Math.sin(b)*r0],[Math.cos(b)*r1,0.045,Math.sin(b)*r1],[Math.cos(a)*r1,0.045,Math.sin(a)*r1],hx('#b8c2d2'))}
  m.ico([0,0.16,0],0.42,hx('#5af0ff'),MAT.glass,0.75,[12,20]);
  for(let i=0;i<16;i++){const a=i/16*TAU2;m.ico([Math.cos(a)*0.97,0,Math.sin(a)*0.97],0.055,i%2?hx('#5af0ff'):hx('#7dff9a'),MAT.emis,1,[6,8])}
  m.ico([0,-0.17,0],0.33,hx('#7dff9a'),MAT.emis,0.25,[8,16])},0.45);
const MSHIP=um(m=>{m.ico([0,0,0],1,hx('#3a4050'),0,0.11,[16,64]);m.ico([0,0.07,0],0.55,hx('#2a2e3a'),0,0.18,[10,40]);
  for(let k=0;k<3;k++){const r=0.35+k*0.24;for(let i=0;i<48;i++){const a=i/48*TAU2+k;m.ico([Math.cos(a)*r,-0.1+k*0.03-0.02,Math.sin(a)*r],0.012+k*0.004,k===1?hx('#ff5a8a'):hx('#5af0ff'),MAT.emis,1,[4,6])}}
  for(let i=0;i<64;i++){const a=i/64*TAU2;m.ico([Math.cos(a)*0.99,0,Math.sin(a)*0.99],0.012,hx('#ffd84a'),MAT.emis,1,[4,6])}
  m.ico([0,-0.1,0],0.12,hx('#9af6ff'),MAT.emis,0.4,[8,16])},0.4);
const WDROP=um(m=>{const la=18,lo=24;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const y=Math.cos(th);const r=Math.sin(th)*(y>0?(1-y)*0.85+0.15*(1-y*y):1);return[Math.cos(ph)*r,y*1.25,Math.sin(ph)*r]};for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const col=hx('#8fd4ff');if(i===0)m.tri(a,c,b,col,MAT.glass);else if(i===la-1)m.tri(a,d,b,col,MAT.glass);else m.quad(a,d,c,b,col,MAT.glass)}},0.3);
const BIGROCK=um(m=>blob(m,[0,0,0],1,p=>mix3([0.42,0.38,0.36],[0.66,0.6,0.55],vnoise(p[0]*3+1,p[2]*3+p[1])),11,0.75,[12,18]),0.3);
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0')},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const E_DAY=envBase();
const E_NIGHT=envBase({sun:[0.3,0.35,-0.6],sunCol:hx('#7a90d0'),sky:hx('#0a1430'),gnd:hx('#202838'),fog:hx('#0e1a36'),fogD:5000,zen:hx('#03050f'),hor:hx('#1a2a55'),stars:1,night:1});
const E_BURN=envBase({sunCol:hx('#ffb080'),sky:hx('#d07040'),gnd:hx('#4a3a40'),fog:hx('#7a3a40'),hor:hx('#ff7a50'),zen:hx('#2a0a20'),stars:0.5,night:0.5,fogD:3000});
const E_GRAV=envBase({sunCol:hx('#e8c8ff'),sky:hx('#a890e0'),fog:hx('#c8b0f0'),hor:hx('#e0c8ff'),zen:hx('#4a2a9a')});
const E_RAIN=envBase({sun:[0.3,0.8,-0.4],sunCol:hx('#d8dee8'),sky:hx('#a8b4c4'),fog:hx('#b8c2cc'),hor:hx('#c8d0da'),zen:hx('#6a7688'),gnd:hx('#707468')});
function envAt(t){let e=E_DAY;
  if(t>=R[2]-0.2&&t<R[3]+1.5){e=mixEnv(E_DAY,E_NIGHT,ease((t-EV.night3+0.2)/1.0));if(t>=EV.imp3){const k=ease((t-EV.imp3)/1.0)*(1-ease((t-R[3]+0.5)/1.5)*0);e=mixEnv(e,E_BURN,k*0.75)}}
  if(t>=R[3]&&t<R[4]){const k=ease((t-R[3])/1.2);e=mixEnv(mixEnv(E_NIGHT,E_BURN,0.75),mixEnv(E_DAY,E_NIGHT,0.25),k);if(t>=EV.flee4)e=mixEnv(e,E_DAY,ease((t-EV.flee4)/1.0))}
  if(t>=R[4]&&t<R[5]){const k=ease((t-EV.ray5)/0.6)*(1-ease((t-R[5]+0.8)/0.8));e=mixEnv(E_DAY,E_GRAV,k)}
  if(t>=R[5]){e=mixEnv(E_DAY,E_RAIN,ease((t-R[5])/1.5))}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;eye=[eye[0]+sway,eye[1],eye[2]];
  if(t<R[0]){const k=t/R[0];eye=[1.4-k*0.3,0.8,-3.3-k*0.3];at=[0,0.85,0.3]}
  if(rn===0){eye=[1.6+sway,1.15,-4.3];at=[0,0.75,0.4]}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[1.7,lerp(0.9,0.55,k),-4.4];at=[0,lerp(0.9,2.3,k),0.4];
    if(t>=EV.fly2-0.2){const kk=ease((t-EV.fly2+0.2)/0.8);at=[0,lerp(2.3,1.1,kk),0.4];eye=[1.7,lerp(0.55,0.9,kk),-4.2]}}
  if(rn===2){const k=ease((t-R[2])/1.2);eye=[lerp(-1.8,-1.5,k),lerp(0.95,0.55,k),-3.9];at=[0,lerp(0.7,1.45,k),0.4];if(t>EV.gl3-0.4){const kk=ease((t-EV.gl3+0.4)/0.8);eye=V.add(eye,V.sc([0.5,0.15,1.2],kk));at=V.add(at,[0,-0.6*kk,0])}}
  if(rn===3){eye=[1.6,0.7,-4.2];at=[0,1.25,0.4];if(t>EV.flee4-0.2&&t<EV.res4+2){}}
  if(rn===4){eye=[1.9,1.1,-3.9];at=[0,0.95,0.4];if(t>=EV.lift5){const k=ease((t-EV.lift5)/1.4);eye=[lerp(1.9,1.35,k),lerp(1.1,0.75,k),lerp(-3.9,-3.0,k)];at=[0,lerp(0.95,0.9,k),0.3]}}
  if(rn===5){const k=ease((t-R[5])/2.5);eye=[lerp(1.7,1.2,k),0.95,lerp(-3.8,-2.9,k)];at=[0,0.55,0.2];if(t>=EV.drop0-0.4){const kk=ease((t-EV.drop0+0.4)/0.8);eye=[lerp(1.2,1.6,kk),lerp(0.95,0.6,kk),lerp(-2.9,-3.4,kk)];at=[0,lerp(0.55,1.9,kk)-ease((t-EV.splash+1.2)/1.0)*1.45,0]}}
  if(rn===5&&t>=EV.splash){const k=ease((t-EV.splash)/0.9);eye=[lerp(1.6,1.5,k),lerp(0.6,2.6,k),lerp(-3.4,-2.8,k)];at=[0,lerp(0.45,0.1,k),lerp(0,0.7,k)]}
  if(t>=R[6])eye=[1.5,2.6,-2.8],at=[0,0.1,0.7];
  return{eye,at}}
// ---------- background (meters) ----------
function explo(items,pos,k,S,D,hitT){if(k<0)return;
  if(k<1.4){const r=S*0.28*easeOut(k/0.5);items.push({mesh:UEMIS,M:M4.trs([pos[0],pos[1]+r*0.7,pos[2]],0,0,0,r),tint:mix3([0.8,1,1],[0.35,0.9,1],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.2,0,1),add:1,noShadow:true})}
  const sx=0.35+0.65*easeOut((k-0.15)/3.2),sy=0.12+0.88*easeOut((k-0.1)/2.4);if(k>0.1){const M=M4.trs(pos,k*0.05,0,0,[S*sx,S*sy,S*sx]);items.push({mesh:MUSH,M});items.push({mesh:MUSHHOT,M:M4.trs(pos,k*0.05,0,0,[S*sx*1.03,S*sy*1.02,S*sx*1.03]),alpha:clamp(1.0-k/5,0.12,1)*0.9,add:1,noShadow:true,tint:null})}
  const rr=D*k/hitT;if(rr<D*1.05){items.push({mesh:RING,M:M4.trs([pos[0],1,pos[2]],0,0,0,rr),alpha:0.55*(1-rr/(D*1.1)),add:1,noShadow:true,tint:[0.7,1,1],tintAmt:1});
    items.push({mesh:UEMIS,M:M4.trs(pos,0,0,0,rr),alpha:0.07*(1-rr/D),add:1,noShadow:true,tint:[1,1,1],tintAmt:1});
    items.push({mesh:DUSTRING,M:M4.trs(pos,0,0,0,[rr,S*0.08+rr*0.02,rr])})}}
function fleetVis(t){if(t<R[3]+0.5)return 1;if(t<EV.flee4)return 1;return 0}
function bgItems(t){const items=[{mesh:BGG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  // UFO fleet (title..R4)
  const fl=(t<EV.flee4+1.5)&&!(rn===1&&t>EV.ufo2&&t<R[2]);
  if(fl){for(let i=0;i<5;i++){const d=[2200,3000,3800,4600,5400][i],sd=[-700,600,-150,1300,-1500][i]+Math.sin(t*0.6+i)*60;let y=[330,420,560,480,640][i]+Math.sin(t*1.3+i*2)*20;let p=P(d,sd,y);let s=[190,170,160,150,150][i];
      if(t>=EV.flee4){const k=easeIn((t-EV.flee4-i*0.08)/0.9);p=V.add(p,[0,k*9000,0]);s*=1-k*0.6}
      if(t<0.6){p=V.add(p,[0,(1-easeOut(t/0.6))*1500,0])}
      items.push({mesh:UFO,M:M4.trs(p,t*1.5+i,0.12*Math.sin(t+i),0,s)});items.push({mesh:UEMIS,M:M4.trs(V.add(p,[0,-s*0.15,0]),0,0,0,[s*1.4,s*0.3,s*1.4]),tint:[0.4,1,0.6],tintAmt:1,alpha:0.12,add:1,noShadow:true})}}
  // R3/R4 mothership
  if(t>=EV.ms3-0.2&&t<EV.flee4+1.4){const k=easeOut((t-EV.ms3)/2.2);let p=V.add(P(11000,1800),[0,lerp(9000,3600,k),0]);let s=4200;
    if(t>=EV.flee4){const kk=easeIn((t-EV.flee4)/1.1);p=V.add(p,[0,kk*30000,0])}
    items.push({mesh:MSHIP,M:M4.trs(p,t*0.08,0.06,0,s)});MSPOS=p;
    // city-buster beam
    if(t>=EV.beam3&&t<EV.imp3+1.0){const tgt=P(7000,-1200);const a=clamp((t-EV.beam3)/0.2,0,1)*clamp(1-(t-EV.imp3-0.5)/0.5,0,1);const top=V.add(p,[0,-s*0.1,0]);
      items.push({mesh:ECYL,M:segM(tgt,top,120+60*Math.sin(t*40)),tint:[0.6,1,1],tintAmt:1,alpha:0.9*a,add:1,noShadow:true});items.push({mesh:ECYL,M:segM(tgt,top,380),tint:[0.2,0.8,1],tintAmt:1,alpha:0.35*a,add:1,noShadow:true})}
    // R4 scan fan
    if(t>=EV.scan4&&t<EV.flee4){const a=clamp((t-EV.scan4)/0.3,0,1);const sw=Math.sin((t-EV.scan4)*1.6);const tgt=V.add(P(lerp(2500,600,0.5+0.5*sw),0),[0,0,0]);const top=V.add(p,[0,-s*0.1,0]);
      for(let j=-3;j<=3;j++){const tg=V.add(tgt,V.sc(side,j*700));items.push({mesh:ECYL,M:segM(tg,top,25),tint:[1,0.35,0.6],tintAmt:1,alpha:0.5*a,add:1,noShadow:true})}}}
  // R3 city + explosion
  if(rn===2){const tgt=P(7000,-1200);for(const c of CITY){if(t>=EV.hit3-0.6)break;const q=V.add(tgt,V.add(V.sc(side,c.x*0.8),V.sc(dir,c.z*0.6)));items.push({mesh:c.mesh,M:M4.trs(q,0,0,0,1)})}
    explo(items,tgt,t-EV.imp3,3400,7000,EV.hit3-EV.imp3)}
  // R5 single UFO high above with gravity ray
  if(rn===4){const k=easeOut((t-EV.ufo5)/1.0);const p=V.add(P(300,0),[0,lerp(6000,1500,k),0]);items.push({mesh:UFO,M:M4.trs(p,t*1.2,0.1,0,260)})}
  return{items,dir,side}}
let MSPOS=[0,0,0];
// ---------- foreground (cm) ----------
let LASTVP=null;
function fgItems(t){const rn=roundAt(t);const items=[];const burnt=t>=EV.hit3+0.3&&t<R[3]+0.2;const L=burnt?TILEB:TILE;
  let pose='walk',walk=1,o={t};let hide=false;
  if(rn===1&&t>=EV.lift2&&t<EV.drop2){pose='fall';walk=0;if(t>=EV.fly2)hide=true}
  if(rn===1&&t>=EV.drop2){pose=t<EV.land2?'fall':'walk';walk=t<EV.land2+2.0?0:1;o.dizzy=t>=EV.land2&&t<EV.land2+2.2;o.lid=t<EV.land2+2.2?0:0.45}
  if(rn===2&&t>=EV.hit3+0.8){pose='sit';walk=0}
  if(rn===2&&t>=EV.gl3){o.glasses=easeOut((t-EV.gl3)/0.5)}
  if(rn===3&&t>=EV.cnt4&&t<EV.flee4+0.4){o.lid=0.0}
  if(rn===4&&t>=EV.ray5-0.6){walk=0;o.lid=0.05}if(rn===4&&t>=EV.lift5){pose='lift';walk=0;o.lid=0.2}
  if(rn===5&&t>=EV.splash){pose='squash';walk=0;o.xeyes=true}
  if(t>=R[6]&&t<EV.loop){pose='squash';walk=0;o.xeyes=true}
  if(rn===5&&t<EV.drop0-0.8){o.lid=0.62}
  if(rn===5&&t>=EV.drop0-0.8&&t<EV.splash){o.lid=0.0;walk=t<EV.drop0?1:0.0}
  if(rn===0)o.lid=t>EV.fm[0]&&t<9.6?0.1:0.45;
  const moving=!(rn===1&&t>=EV.beam2&&t<EV.land2+2.0)&&!(rn===4&&t>=EV.lift5);
  const dist=1.1*distAt(t);const o_=((dist%L.T)+L.T)%L.T;for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  const slow=rn===5&&t>=EV.drop0&&t<EV.splash+1.5;
  o.ph=t*(slow?1.2:5.2);o.walk=walk;o.pose=pose;
  const coughs=[2.0,9.9,EV.land2+0.4,EV.hit3+1.2,EV.res5+0.6];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  let Rm=M4.id();
  if(rn===0){for(const f of EV.fm){const k=t-f;if(k>=0&&k<0.32){Rm=M4.trs([0,Math.sin(k/0.32*Math.PI)*0.28,0],0,0,0,1)}}}
  // R2 abduction lift
  if(rn===1&&t>=EV.lift2&&t<EV.fly2){const k=easeIn(clamp((t-EV.lift2)/(EV.up2-EV.lift2),0,1));Rm=M4.trs([0,k*3.3+0.1*Math.sin(t*5),0.3*k],t*1.6,0.3*Math.sin(t*3),0.2*Math.sin(t*4),1-0.5*k)}
  if(rn===1&&t>=EV.drop2&&t<EV.land2){const k=clamp((t-EV.drop2)/(EV.land2-EV.drop2),0,1);const y=6*(1-k*k);Rm=M4.trs([0,y,0],t*6,t*4,0,1)}
  if(rn===1&&t>=EV.land2&&t<EV.land2+0.5){const k=(t-EV.land2)/0.5;Rm=M4.trs([0,Math.sin(k*Math.PI)*1.2,0],0,0,0,[1+0.2*Math.sin(k*Math.PI*3)*(1-k),1-0.3*Math.sin(k*Math.PI*3)*(1-k),1])}
  if(pose==='lift'){const k=easeOut((t-EV.lift5)/0.5);const tr=Math.sin(t*38)*0.012;Rm=M4.trs([tr,0,0],0,0,0,[1+0.12*k,1-0.16*k+0.02*Math.sin(t*9),1+0.05*k])}
  if(pose==='squash'){const k=clamp((t-EV.splash)/0.12,0,1);Rm=M4.trs([0,0,0],0,0,0,[lerp(1,1.35,k),lerp(1,0.26,k),lerp(1,1.15,k)])}
  if(!hide)items.push(...antItems(Rm,o));
  // R1 laser bolts
  if(rn===0||(t>=R[1]&&t<R[1]+0.5)){EV.fm.forEach((f,i)=>{const [x0,z0]=FMP[i];const k=t-f;const tf=0.3;
      if(k>-tf&&k<0.12){const q=clamp(1+k/tf,0,1);const st=[x0*0.4-1.5,7.5,z0+13];const tip=V.add(st,V.sc(V.sub([x0,0.05,z0],st),q));const tail=V.add(st,V.sc(V.sub([x0,0.05,z0],st),Math.max(0,q-0.55)));
        items.push({mesh:ECYL,M:segM(tail,tip,0.09),tint:[0.8,1,0.85],tintAmt:1,alpha:1,add:1,noShadow:true});items.push({mesh:ECYL,M:segM(tail,tip,0.22),tint:[0.05,0.9,0.2],tintAmt:1,alpha:0.7,add:1,noShadow:true})}
      if(k>=0){const z=z0+1.1*k;if(z>8)return;
        items.push({mesh:DISC2,M:M4.trs([x0,0.035,z],i,0,0,[0.5,1,0.5]),tint:mix3([0.4,1,0.5],[0.1,0.12,0.1],clamp(k/1.5,0,1)),tintAmt:1,noShadow:true});
        if(k<0.6){items.push({mesh:UEMIS,M:M4.trs([x0,0.15,z],0,0,0,[0.15+0.4*easeOut(k/0.25),0.1+0.3*easeOut(k/0.25),0.15+0.4*easeOut(k/0.25)]),tint:[0.1,1,0.3],tintAmt:1,alpha:0.6*(1-k/0.6),add:1,noShadow:true});
          for(let j=0;j<12;j++){const a=j/12*TAU2+i;const sp=1.6+hsh(i,j)*2;const p=[x0+Math.cos(a)*sp*k,0.1+k*(5-k*14)*(0.6+hsh(j,i)*0.6),z+Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.045),tint:[0.5,1,0.6],tintAmt:1,alpha:1,add:1,noShadow:true})}}
        if(k<2.5)for(let j=0;j<3;j++){const kk=k-j*0.25;if(kk<0)continue;items.push({mesh:USPH,M:M4.trs([x0+kk*0.2,0.3+kk*0.7,z+kk*0.3],0,0,0,0.25+kk*0.35),tint:[0.5,0.52,0.48],tintAmt:1,alpha:Math.max(0,0.1*(1-kk/2)),noShadow:true})}}})}
  // R2 big UFO over the ant
  if(rn===1&&t<EV.fly2+1.0){const k=easeOut((t-EV.ufo2)/1.2);let p=[0,lerp(16,4.4,k)+0.08*Math.sin(t*2.2),0.7];let s=2.4;if(t>=EV.fly2){const kk=easeIn((t-EV.fly2)/0.6);p=V.add(p,[0,kk*40,kk*6])}
    items.push({mesh:UFO,M:M4.trs(p,t*1.4,0.06*Math.sin(t*1.7),0,s),noShadow:false});UFOFG=p;
    if(t>=EV.beam2&&t<EV.fly2){const a=clamp((t-EV.beam2)/0.25,0,1);const fl=0.85+0.15*Math.sin(t*23);
      items.push({mesh:ECONE,M:M4.trs([p[0],0,p[2]-0.35],t*0.5,0,0,[1.05,p[1]-0.3,1.05]),tint:[0.45,1,0.7],tintAmt:1,alpha:0.28*a*fl,add:1,noShadow:true});
      items.push({mesh:ECONE,M:M4.trs([p[0],0,p[2]-0.35],t*0.5,0,0,[0.7,p[1]-0.3,0.7]),tint:[0.7,1,0.85],tintAmt:1,alpha:0.25*a*fl,add:1,noShadow:true});
      items.push({mesh:DISC2,M:M4.trs([0,0.04,0.35],0,0,0,[1.05,1,1.05]),tint:[0.5,1,0.7],tintAmt:1,alpha:0.5*a,add:1,noShadow:true});
      for(let i=0;i<18;i++){const ph=((t*0.7+hsh(i,1))%1);const a2=hsh(i,2)*TAU2+t;const r=0.15+0.7*hsh(i,3)*(1-ph*0.6);items.push({mesh:UEMIS,M:M4.trs([Math.cos(a2)*r,ph*3.8,0.35+Math.sin(a2)*r],0,0,0,0.035),tint:[0.7,1,0.8],tintAmt:1,alpha:a*(1-ph),add:1,noShadow:true})}}}
  // R3: debris glow embers after hit
  // R4 scan line sweeping across ground
  if(rn===3&&t>=EV.scan4&&t<EV.flee4){const sw=Math.sin((t-EV.scan4)*1.6);const z=lerp(-2,6,0.5+0.5*sw);
    items.push({mesh:EBOX,M:M4.trs([0,0.03,z],0,0,0,[30,0.02,0.07]),tint:[1,0.4,0.65],tintAmt:1,alpha:0.95,add:1,noShadow:true});items.push({mesh:EBOX,M:M4.trs([0,0.05,z],0,0,0,[30,0.05,0.5]),tint:[1,0.3,0.6],tintAmt:1,alpha:0.25,add:1,noShadow:true});
    for(let j=-3;j<=3;j++)items.push({mesh:ECYL,M:segM([j*2.2,0.02,z],[j*2.2+6,30,z+50],0.025),tint:[1,0.4,0.7],tintAmt:1,alpha:0.35,add:1,noShadow:true})}
  // R5 gravity ray + rock
  if(rn===4){if(t>=EV.ray5){const a=clamp((t-EV.ray5)/0.3,0,1)*(1-ease((t-R[5]+0.6)/0.5));const fl=0.8+0.2*Math.sin(t*19);
      items.push({mesh:ECYL,M:segM([0,0,0.1],[0,60,0.1],1.0),tint:[0.75,0.45,1],tintAmt:1,alpha:0.22*a*fl,add:1,noShadow:true});items.push({mesh:ECYL,M:segM([0,0,0.1],[0,60,0.1],0.6),tint:[0.9,0.7,1],tintAmt:1,alpha:0.18*a*fl,add:1,noShadow:true});
      for(let i=0;i<4;i++){const ph=((t-EV.ray5)*0.9+i/4)%1;items.push({mesh:RING,M:M4.trs([0,0.04,0.1],0,0,0,0.8+ph*3.5),tint:[0.8,0.5,1],tintAmt:1,alpha:a*0.7*(1-ph),add:1,noShadow:true})}
      for(let i=0;i<16;i++){const ph=((t*1.3+hsh(i,5))%1);const a2=hsh(i,6)*TAU2;const r=0.2+0.7*hsh(i,7);items.push({mesh:UEMIS,M:M4.trs([Math.cos(a2)*r,4*(1-ph),0.1+Math.sin(a2)*r],0,0,0,0.03),tint:[0.9,0.7,1],tintAmt:1,alpha:a*ph,add:1,noShadow:true})}}
    if(t>=EV.ray5){let y;const k=t-EV.lift5;const kd=clamp((t-EV.ray5)/0.3,0,1);if(k<0){y=lerp(9,0.3,kd*kd)}else y=lerp(0.3,1.25,easeOut(k/0.6));const x=k<0?-1.3:lerp(-1.3,0,easeOut(k/0.5));const z=k<0?-0.6:lerp(-0.6,-0.28,easeOut(k/0.5));
      items.push({mesh:BIGROCK,M:M4.trs([x,y+(k>0?Math.sin(t*38)*0.01:0),z],0.4,0.2,0.1,[0.62,0.42,0.55]),tint:null,tintAmt:0})}}
  // FINAL: one raindrop
  if(rn===5&&t>=EV.drop0-0.3&&t<EV.splash){const k=(t-EV.drop0+0.3)/(EV.splash-EV.drop0+0.3);const y=0.95+4.5*Math.pow(1-k,1.2);
    items.push({mesh:WDROP,M:M4.trs([0.02,y,-0.05],0,0,0,[0.32,0.36+0.04*Math.sin(t*9),0.32]),tint:null,tintAmt:0,alpha:0.82});items.push({mesh:UEMIS,M:M4.trs([0.1,y+0.12,-0.2],0,0,0,0.05),tint:[1,1,1],tintAmt:1,alpha:0.8,add:1,noShadow:true})}
  if((rn===5&&t>=EV.splash)||(t>=R[6]&&t<EV.loop)){const k=t-EV.splash;
    items.push({mesh:DISC2,M:M4.trs([0,0.04,0],1,0,0,[1.0,1,0.9]),tint:[0.3,0.38,0.45],tintAmt:1,alpha:0.45,noShadow:true});
    if(k<1.0)for(let i=0;i<16;i++){const a=i/16*TAU2;const sp=1.8+hsh(i,3)*1.4;const p=[Math.cos(a)*sp*k,0.15+k*(3.2-k*6)*(0.6+hsh(i,9)*0.8),Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:WDROP,M:M4.trs(p,0,0,0,0.06),tint:null,tintAmt:0,alpha:0.85})}
    if(k<0.8)items.push({mesh:RING,M:M4.trs([0,0.05,0],0,0,0,0.4+k*3.0),tint:[0.8,0.92,1],tintAmt:1,alpha:0.6*(1-k/0.8),add:1,noShadow:true});
    if(k<1.5){const kk=k;items.push({mesh:UCYL,M:M4.mul(M4.trs([1.2+kk*4,0.1+kk*(4-kk*5.5),-0.4],0,0,kk*12,1),segM([0,-0.25,0],[0,0.25,0],0.028)),tint:AC.wood,tintAmt:1})}}
  return items}
let UFOFG=[0,4,0];
function distAt(t){let d=t;for(const [a,b] of [[EV.beam2,EV.land2+2.0],[EV.hit3+0.8,R[3]],[EV.ray5-0.6,R[5]]]){if(t>a)d-=Math.min(t,b)-a}return d}
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const w=1+0.12*Math.sin(i*1.9);m.tri([0,0,0],[Math.cos(b)*w,0,Math.sin(b)*w],[Math.cos(a)*w,0,Math.sin(a)*w],[1,1,1])}});
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function dustAmt(t){const f=(h,a,b,c)=>{const k=t-h;if(k<0)return 0;if(k<a)return easeOut(k/a);if(k<a+b)return 1;return clamp(1-(k-a-b)/c,0,1)};return f(EV.hit3,0.15,0.5,0.8)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};EV.fm.forEach(d=>S(d,16,0.45));S(EV.beam2,6,0.8);S(EV.land2,14,0.4);S(EV.beam3,10,0.8);S(EV.imp3,30,2.0);S(EV.hit3,46,2.6);S(EV.flee4,12,1.0);if(t>=EV.ray5&&t<R[5]-0.5)a+=3;S(EV.lift5,14,0.6);S(EV.splash,12,0.4);if(t<0.8)a+=8*(1-t/0.8);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function fmtBig(n){return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[6])return;const ts=R[rn];const k=t-ts;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=rn===5&&t<EV.drop0;
  if(!hideLab){const kk=rn===5?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===5?104:120,rn===5?'#5AF0FF':'#ffd84a');ctx.restore();
    if(t<t2)pill(cap1,385,rn===5?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.66)',60,Math.min(1,kk/0.12));else pill(cap2,385,rn===5?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[5]+0.3&&t<EV.drop0-0.6)pill('Aliens gone… finally peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[5]-0.3)/0.15));if(t>=EV.drop0-0.6)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.splash;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle='#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore();
  // stat cards
  if(rn===1&&t>=EV.land2+0.5&&t<R[2]-0.3)card('Real physics: tiny bugs fall SLOW 🪶',660,'rgba(20,120,140,0.9)',50,EV.land2+0.5,t);
  if(rn===1&&t>=EV.land2+1.3&&t<R[2]-0.3)card('Ants can survive a fall from ANY height',770,'rgba(15,10,30,0.72)',44,EV.land2+1.3,t);
  if(rn===2&&t>=EV.imp3+0.3&&t<EV.hit3+1.2)card('💥 City gone in 1 second',660,'rgba(255,60,110,0.9)',54,EV.imp3+0.3,t);
  if(rn===2&&t>=EV.gl3+0.4&&t<R[3]-0.2)card('Ants live on every continent but Antarctica 🌍',660,'rgba(20,120,90,0.88)',44,EV.gl3+0.4,t);
  if(rn===3&&t>=EV.cnt4&&t<EV.flee4+0.3){const k=easeOut(clamp((t-EV.cnt4)/2.2,0,1));const n=k<1?2e16*Math.pow(k,3):2e16;ctx.save();const c=t-EV.cnt4;const pp=c<0.2?0.6+0.4*easeOut(c/0.2):1;ctx.translate(W/2,690);ctx.scale(pp,pp);
    ctx.fillStyle='rgba(15,10,30,0.8)';rrect(-470,-110,940,220,40);ctx.fill();ctx.strokeStyle='rgba(255,90,138,0.9)';ctx.lineWidth=5;rrect(-470,-110,940,220,40);ctx.stroke();
    txt('📡 ANTS DETECTED ON EARTH',0,-55,44,'#FF5A8A','center',900,false);txt(fmtBig(n),0,35,fitSize('20,000,000,000,000,000',880,74),k>=1?'#ffd84a':'#ffffff','center',900,false);ctx.restore()}
  if(rn===3&&t>=EV.per4&&t<EV.flee4+0.3)card('= 2.5 MILLION ants per human 😳',880,'rgba(255,60,110,0.9)',54,EV.per4,t);
  if(rn===3&&t>=EV.res4+0.5&&t<R[4]-0.2)card('Fermi paradox: SOLVED? 👽🤫',660,'rgba(90,60,200,0.9)',58,EV.res4+0.5,t);
  if(rn===3&&t>=EV.res4+1.3&&t<R[4]-0.2)card('“If aliens exist… where are they?”',770,'rgba(15,10,30,0.72)',44,EV.res4+1.3,t);
  if(rn===4&&t>=EV.lift5+0.8&&t<R[5]-0.2)card('Real: ants lift 10–50× their own weight 🏋️',660,'rgba(120,60,200,0.9)',48,EV.lift5+0.8,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,430);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('ALIEN INVASION 🛸',0,-150,fitSize('ALIEN INVASION 🛸',980,110),'#7DFF9A');txt('vs',0,-40,80,'#ffffff');txt('ONE DYING ANT 🐜',0,70,100,'#ff6a5a');ctx.restore();
  if(t>1.0){ctx.save();ctx.globalAlpha=a*clamp((t-1.0)/0.3,0,1);pill('Who wins? 🤔',730,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[6];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.68*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  txt('Aliens: scared of ants 👽',0,-230,fitSize('Aliens: scared of ants 👽',960,74),'#7DFF9A');txt('Ants: scared of rain 💧',0,-130,fitSize('Ants: scared of rain 💧',960,74),'#5AF0FF');
  txt('Who wins:',0,10,84,'#ffffff');txt('YOU or this ant? 🐜',0,115,fitSize('YOU or this ant? 🐜',960,90),'#ffd84a');txt('👇',0,280+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1140,52,'#ffffff','center',800);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;
  const da=dustAmt(tt);if(da>0){ctx.fillStyle=`rgba(120,110,120,${0.93*da})`;ctx.fillRect(0,0,W,H);const r=rngG(Math.floor(tt*30));ctx.strokeStyle=`rgba(70,60,70,${0.5*da})`;ctx.lineWidth=6;for(let i=0;i<40;i++){const x=r()*W*1.4-W*0.2,y=r()*H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+120+r()*200,y+30*(r()-0.5));ctx.stroke()}}
  // tractor beam glow
  if(tt>=EV.beam2&&tt<EV.fly2){const p=project(LASTVP,UFOFG);if(p){const g=ctx.createRadialGradient(p[0],p[1]+300,50,p[0],p[1]+300,800);g.addColorStop(0,'rgba(120,255,170,0.22)');g.addColorStop(1,'rgba(120,255,170,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}}
  // mothership glow
  if(tt>=EV.ms3&&tt<EV.flee4+0.8&&LASTVP_BG){const p=project(LASTVP_BG,MSPOS);if(p){const g=ctx.createRadialGradient(p[0],p[1],40,p[0],p[1],700);g.addColorStop(0,'rgba(90,240,255,0.22)');g.addColorStop(1,'rgba(90,240,255,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}}
  // scan: pink scanline over screen
  if(tt>=EV.scan4&&tt<EV.flee4){const y=((tt-EV.scan4)*700)%(H+200)-100;const g=ctx.createLinearGradient(0,y-80,0,y+80);g.addColorStop(0,'rgba(255,90,138,0)');g.addColorStop(0.5,'rgba(255,90,138,0.28)');g.addColorStop(1,'rgba(255,90,138,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,y-80,W,160);ctx.restore()}
  // gravity ray purple pulse
  if(tt>=EV.ray5&&tt<R[5]){const a=(1-ease((tt-R[5]+0.8)/0.8))*(0.08+0.05*Math.sin(tt*12));ctx.fillStyle=`rgba(150,90,255,${a})`;ctx.fillRect(0,0,W,H)}
  // rain mood
  if(tt>=R[5]&&tt<EV.splash+2){ctx.fillStyle=`rgba(60,80,110,${0.08*ease((tt-R[5])/1.5)})`;ctx.fillRect(0,0,W,H)}
  if(tt>=EV.drop0-0.6&&tt<EV.splash+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.splash-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k);ctx.fillStyle=`rgba(80,160,255,${0.06*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<6;i++)flash(R[i],0.35,0.15);EV.fm.forEach(d=>flash(d,0.12,0.12,'170,255,190'));flash(EV.beam2,0.4,0.3,'160,255,200');flash(EV.beam3,0.5,0.3,'180,250,255');flash(EV.imp3,1,1.0,'230,255,255');flash(EV.flee4,0.6,0.4,'255,200,230');flash(EV.ray5,0.5,0.3,'200,160,255');flash(EV.splash,0.35,0.2,'200,230,255');flash(EV.land2,0.3,0.2);
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
