// base: ant + helpers (from timedil)
const FPS=30,DUR=66,SUB=1;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
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
  if(!o.healthy){P(Hd,UB,[0.03,0.22,-0.04],[0.18,0.035,0.06],AC.band,[0.3,0,0.5],1);P(Hd,UB,[0.03,0.22,-0.04],[0.18,0.035,0.06],AC.band,[0.3,0,-0.5],1)}
  // antennae (one droopy)
  for(const s of[-1,1]){const base=M4.mul(Hd,M4.trs([s*0.07,0.18,-0.12],0,0,0,1));const e1=[s*0.08,0.2,-0.05],droop=(s<0&&!o.healthy)||o.old>0.5?1:0;const flap=(o.flail||0)*Math.sin((o.t||0)*20+s)*0.1;
    const e2=V.add(e1,droop?[s*0.08,-0.22,-0.12]:[s*0.1+flap,0.06,-0.2]);it.push({mesh:UCYL,M:M4.mul(base,segM([0,0,0],e1,0.017)),tint:AC.leg,tintAmt:1,noShadow:true});it.push({mesh:UCYL,M:M4.mul(base,segM(e1,e2,0.013)),tint:AC.leg,tintAmt:1,noShadow:true});P(base,USPH,e2,0.024,AC.leg,null,1);P(base,USPH,e1,0.02,AC.leg,null,1)}
  // legs
  const hz=[-0.14,-0.05,0.04],fz=[-0.5,-0.08,0.38];let hands=null;
  for(let i=0;i<3;i++)for(const s of[-1,1]){const hip=[s*0.09,0.34,hz[i]];const grp=(i+(s>0?1:0))%2;const g=ph+grp*Math.PI;let foot;
    const limp=(i===2&&s<0)&&!o.healthy;
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
  if(o.old)for(const q of it)if(q.tint)q.tint=mix3(q.tint,[0.62,0.6,0.58],o.old*0.8);
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
// ===================== TIME ITSELF vs DYING ANT (part 2) =====================
const TD_GRAIN=um(m=>blob(m,[0,0,0],1,p=>mix3([0.55,0.45,0.35],[0.8,0.7,0.55],clamp(p[1]+0.5,0,1)),3,0.8,[6,9]),0.4);
