// ===================== TIME ITSELF vs DYING ANT =====================
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
// ---------- timeline ----------
const R=[3.0,12.0,21.5,31.0,41.5,52.0,61.0];
const EV={bh1:4.6,slow1:5.1,hawk1:8.0,evap1:9.0,res1:9.4,walk1:10.4,
  ff2a:12.7,ff2b:18.2,res2:18.6,
  rain3:21.9,frz3:23.3,res3:26.6,unf3:29.0,
  rw0:32.3,rw1:36.1,rw2:38.7,res4:39.2,
  ff5a:42.2,ff5b:47.2,burn5:44.6,gl5:47.6,res5:48.3,
  norm6:52.0,fin6:54.4,sec0:55.6,sec1:56.6,fall6:56.7,res6:57.0,endc:61.0,loop:65.5};
const ROUNDS=[['ROUND 1','Mini black hole 🕳️','It evaporated 💨',EV.res1],['ROUND 2','⏩ 1,000,000 years','Unbothered 😐',EV.res2],['ROUND 3','TIME FREEZE ⏸️','Walked right through 😎',EV.res3],['ROUND 4','TIME REWIND ⏪','Healed… for 2 seconds 😭',EV.res4],['ROUND 5','⏩ 1 BILLION years ☀️','Just got a tan 😎',EV.res5],['FINAL ROUND','ONE normal second ⏱️','Cause of death: old age 👴💀',EV.res6]];
function roundAt(t){for(let i=5;i>=0;i--)if(t>=R[i])return i;return -1}
const FREEZE=[[EV.bh1-0.2,EV.walk1],[EV.sec0,999]];
function distAt(t){let d=t;for(const [a,b] of FREEZE){if(t>a)d-=Math.min(t,b)-a}return d}
// scene-time mapping (rewind)
const RWK=(EV.rw0-0.6)/(EV.rw1-EV.rw0);let HEALTHY=false;
function sceneT(t){HEALTHY=false;if(t>=EV.loop)return t-EV.loop;if(t>=EV.rw0&&t<EV.rw1){const k=(t-EV.rw0)/(EV.rw1-EV.rw0);const kk=k*k*(1.6-0.6*k);return EV.rw0-(EV.rw0-0.6)*kk}
  if(t>=EV.rw1&&t<EV.rw2){HEALTHY=true;return 0.6+(t-EV.rw1)*0.9}return t}
// fast-forward day angle
function ffAng(t,a,b,N){const k=clamp((t-a)/(b-a),0,1);const s=k*k*k*(k*(k*6-15)+10);return s*N*TAU2}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const E_DAY=envBase();
const E_NIGHT=envBase({sunCol:hx('#2a3a70'),sky:hx('#0c1430'),gnd:hx('#1a2030'),fog:hx('#0e1630'),hor:hx('#1a2a5a'),zen:hx('#03050f'),stars:1,night:0.8,fogD:2600,gndCol:hx('#0e1630')});
const E_COSMIC=envBase({sunCol:hx('#c8b0ff'),sky:hx('#5a4a90'),fog:hx('#6a5aa0'),hor:hx('#9a7ad0'),zen:hx('#1a1040'),gnd:hx('#4a4060'),stars:0.5,night:0.35,gndCol:hx('#6a5aa0')});
const E_FROZEN=envBase({sunCol:hx('#c8d8ff'),sky:hx('#8a98b0'),fog:hx('#a8b4c8'),hor:hx('#b8c4d4'),zen:hx('#4a5a7a'),gnd:hx('#707888'),gndCol:hx('#a8b4c8')});
const E_BURN=envBase({sunCol:hx('#ffb070'),sky:hx('#c05a28'),gnd:hx('#5a2a18'),fog:hx('#c06a3a'),hor:hx('#ffb060'),zen:hx('#4a1208'),stars:0,night:0.15,fogD:3000,gndCol:hx('#c06a3a'),sunSize:9});
function dayEnv(base,ang,a0){const a=a0+ang;const sun=V.norm([0.22,Math.sin(a),Math.cos(a)]);const nf=clamp(0.5-sun[1]*2.2,0,1);const e=mixEnv(base,E_NIGHT,nf);e.sun=[sun[0],Math.max(sun[1],-0.2),sun[2]];return e}
function envAt(t){let e=E_DAY;const rn=roundAt(t);
  if(rn<=0&&t>=EV.bh1)e=mixEnv(E_DAY,E_COSMIC,ease((t-EV.bh1)/0.6)*(1-ease((t-EV.evap1)/0.5)));
  if(rn===1){const a0=Math.asin(0.55);const ang=ffAng(t,EV.ff2a,EV.ff2b,6);e=dayEnv(E_DAY,ang,a0);if(t<EV.ff2a){const k=ease((t-R[1])/0.7);e=mixEnv(E_DAY,e,k)}}
  if(rn===2){e=mixEnv(E_DAY,E_FROZEN,ease((t-EV.frz3)/0.4)*(1-ease((t-EV.unf3)/0.5)))}
  if(rn===3)e=E_DAY;
  if(rn===4){const a0=Math.asin(0.55);const ang=ffAng(t,EV.ff5a,EV.ff5b,5);const hb=ease((t-EV.ff5a)/(EV.ff5b+0.6-EV.ff5a));const base=mixEnv(E_DAY,E_BURN,hb);e=dayEnv(base,ang,a0);const k2=ease((t-EV.ff5b)/0.8);const sunF=V.norm([0.12,0.24,1]);e.sun=V.norm(V.add(V.sc(e.sun,1-k2),V.sc(sunF,k2)));e.sunSize=lerp(1,9,hb)}
  if(rn>=5){e=mixEnv(E_BURN,E_DAY,ease((t-R[5])/0.9));e.sunSize=lerp(9,1,ease((t-R[5])/0.9))}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.95,-3.9-k*0.3];at=[0,1.05,0.3]}
  if(rn===0){const k=ease((t-R[0])/1.4);eye=[lerp(1.2,2.1,k),lerp(0.95,1.2,k),lerp(-4.2,-4.3,k)];at=[lerp(0,0.55,k),lerp(1.0,0.9,k),0.6];
    if(t>=EV.hawk1){const kk=ease((t-EV.hawk1)/1.0)*(1-ease((t-EV.walk1)/1.0));eye=V.add(eye,[0.1*kk,0,0.5*kk])}}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.9,1.5,k)+sway*0.4,lerp(1.1,0.62,k),lerp(-4.3,-4.0,k)];at=[0,lerp(0.8,1.25,k),0.8];if(t>EV.ff2b){const kk=ease((t-EV.ff2b)/1.0);at=V.add(at,[0,-0.45*kk,0]);eye=V.add(eye,[0,0.2*kk,0.4*kk])}}
  if(rn===2){const k=ease((t-R[2])/7);eye=[lerp(-2.1,-1.3,k),lerp(1.0,0.72,k),lerp(-4.0,-3.2,k)];at=[0,0.55,0.4]}
  if(rn===3){eye=[1.55+sway*0.3,1.0,-3.8];at=[0,0.7,0.4]}
  if(rn===4){const k=ease((t-R[4])/1.2);eye=[1.6+sway*0.3,lerp(0.95,0.62,k),-4.2];at=[0,lerp(0.8,1.3,k),0.8];if(t>=EV.gl5-0.4){const kk=ease((t-EV.gl5+0.4)/1.0);at=V.add(at,[0,-0.6*kk,0]);eye=V.add(eye,[-0.2*kk,0.25*kk,0.7*kk])}}
  if(rn===5){const k=ease((t-R[5])/2.0);eye=[lerp(1.7,1.25,k),0.95,lerp(-3.8,-3.1,k)];at=[0,0.55,0.2];
    if(t>=EV.sec0-0.4){const kk=ease((t-EV.sec0+0.4)/1.6);eye=[lerp(1.25,1.0,kk),lerp(0.95,1.45,kk),lerp(-3.1,-3.3,kk)];at=[-0.3*kk,0.4,0]}}
  if(t>=R[6])eye=[1.0,1.45,-3.3],at=[-0.3,0.4,0];
  return{eye,at}}
// ---------- background ----------
function bgItems(t){return{items:[{mesh:BGG}]}}
// ---------- foreground ----------
let LASTVP=null,BHSCR=null,HOTPTS=[];
const BHP=[1.25,1.0,1.0];
function bhScale(t){if(t<EV.bh1)return 0;const g=easeOut((t-EV.bh1)/0.35);let s=g*(1+0.04*Math.sin(t*14));if(t>=EV.hawk1)s*=1-0.55*ease((t-EV.hawk1)/(EV.evap1-EV.hawk1));if(t>=EV.evap1)s=0;return s}
function rainDrop(i){return[(hsh(i,1)-0.5)*5.0,hsh(i,2),-6.8+hsh(i,3)*7.6]}
function fgItems(t){HOTPTS=[];const rn=roundAt(t);const items=[];const burnt=t>=EV.burn5+0.8&&t<R[5]+0.6;const L=burnt?TILEB:TILE;
  let pose='walk',walk=1,o={t,healthy:HEALTHY};let hide=false;const gz=(t0)=>1.1*(distAt(t)-distAt(t0));
  const dist=1.1*distAt(t);const o_=((dist%L.T)+L.T)%L.T;
  const frozenTint=rn===2?ease((t-EV.frz3)/0.4)*(1-ease((t-EV.unf3)/0.5)):0;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1),tint:[0.62,0.68,0.8],tintAmt:0.55*frozenTint});
  let Rm=M4.id();
  // ---- R1: mini black hole ----
  const bs=bhScale(t);
  if(bs>0.001){const sc=0.17*bs;
    items.push({mesh:UEMIS,M:M4.trs(BHP,0,0,0,sc),tint:[0,0,0],tintAmt:1});
    items.push({mesh:BHD,M:M4.mul(M4.trs(BHP,0,0.32,0.18,1),M4.trs([0,0,0],t*2.4,0,0,sc*0.95)),tint:[1,0.75,0.4],tintAmt:0.15});
    items.push({mesh:RING,M:M4.mul(M4.trs(BHP,0,1.35,0.1,1),M4.trs([0,0,0],0,0,0,sc*1.08)),tint:[1,0.85,0.6],tintAmt:1,alpha:0.9,add:1,noShadow:true});
    items.push({mesh:UEMIS,M:M4.trs(BHP,0,0,0,sc*2.2),tint:[0.6,0.35,1],tintAmt:1,alpha:0.1,add:1,noShadow:true});
    if(t>=EV.hawk1){const hk=ease((t-EV.hawk1)/(EV.evap1-EV.hawk1));items.push({mesh:UEMIS,M:M4.trs(BHP,0,0,0,sc*(1.25+0.15*Math.sin(t*40))),tint:[1,1,1],tintAmt:1,alpha:0.25+0.6*hk,add:1,noShadow:true});
      for(let i=0;i<14;i++){const ph=((t*1.8+hsh(i,5))%1);const d=V.norm([hsh(i,6)-0.5,hsh(i,7)-0.5,hsh(i,8)-0.5]);items.push({mesh:UEMIS,M:M4.trs(V.add(BHP,V.sc(d,sc*1.2+ph*0.9)),0,0,0,0.018),tint:[0.85,0.9,1],tintAmt:1,alpha:(1-ph)*hk,add:1,noShadow:true})}}
    // debris spiralling in (crumbs, grains, leaf bits)
    if(t<EV.hawk1+0.4)for(let i=0;i<16;i++){const per=1.6;const ph=(((t-EV.bh1)/per+hsh(i,11))%1);if(t-EV.bh1<ph*per)continue;const r=lerp(2.2,0.05,Math.pow(ph,0.7));const a=hsh(i,12)*TAU2+ph*9+t*0.5;
      const p=V.add(BHP,[Math.cos(a)*r,Math.sin(a)*r*0.32+(-0.6)*(1-ph)*(hsh(i,13)),Math.sin(a)*r*0.9]);const s=(0.035+0.03*hsh(i,14))*(ph>0.85?(1-ph)/0.15:1);
      items.push({mesh:i%3===0?ALEAF:TD_GRAIN,M:M4.trs(p,a*2,a,ph*5,i%3===0?s*2.6:s),tint:null,tintAmt:0,noShadow:true});
      items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,s*1.4),tint:[1,0.7,0.35],tintAmt:1,alpha:0.25*ph,add:1,noShadow:true})}
    BHSCR=true}else BHSCR=null;
  const ek=t-EV.evap1;if(ek>=0&&ek<1.2){items.push({mesh:RING,M:M4.mul(M4.trs(BHP,0,1.35,0.1,1),M4.trs([0,0,0],0,0,0,0.1+ek*3.5)),tint:[0.9,0.85,1],tintAmt:1,alpha:0.9*(1-ek/1.2),add:1,noShadow:true});
    for(let i=0;i<34;i++){const d=V.norm([hsh(i,21)-0.5,hsh(i,22)-0.5,hsh(i,23)-0.5]);items.push({mesh:UEMIS,M:M4.trs(V.add(BHP,V.sc(d,easeOut(ek/1.2)*(1.2+hsh(i,24)*1.6))),0,0,0,0.04*(1-ek/1.2)),tint:[1,0.95,0.8],tintAmt:1,alpha:1,add:1,noShadow:true})}
    if(ek<0.35)items.push({mesh:UEMIS,M:M4.trs(BHP,0,0,0,0.12+ek*2.2),tint:[1,1,1],tintAmt:1,alpha:0.7*(1-ek/0.35),add:1,noShadow:true})}
  if(rn===0&&t>=EV.bh1&&t<EV.evap1+0.4){walk=0;pose='fall';o.flail=1;o.lid=0.0;const sl=t<EV.slow1?1:0.12;o.t=t<EV.slow1?t:EV.slow1+(t-EV.slow1)*sl;
    const pk=ease((t-EV.bh1)/1.4)*(1-ease((t-EV.evap1)/0.4));Rm=M4.trs([0.18*pk,0.05*pk,0.12*pk],-0.35*pk,0,-0.22*pk,1)}
  if(rn===0&&t>=EV.evap1+0.4&&t<EV.walk1){walk=0;o.lid=0.2;o.dizzy=true}
  // ---- R3: rain + time freeze ----
  if(rn===2||(t>=R[3]&&t<R[3]+0.6)){const rainA=ease((t-EV.rain3)/0.6);
    for(let i=0;i<90;i++){if(hsh(i,4)>rainA)continue;const [x,ph,z0]=rainDrop(i);const v=7.5;const top=5.2;
      const yAt=tt=>top-(((tt-EV.rain3)*v/top+ph)%1)*top;let y,z=z0;
      if(t<EV.frz3)y=yAt(t);else if(t<EV.unf3){y=yAt(EV.frz3);z=z0+gz(EV.frz3)}else{const y0=yAt(EV.frz3);const k=t-EV.unf3;y=y0-v*k*k*0.9-v*0.3*k;z=z0+gz(EV.frz3);if(y<0){const sk=-y/(v*1.2);if(sk<0.3)items.push({mesh:RING,M:M4.trs([x,0.04,z],0,0,0,0.05+sk*0.9),tint:[0.8,0.9,1],tintAmt:1,alpha:0.7*(1-sk/0.3),add:1,noShadow:true});continue}}
      if(z>6)continue;
      // ant bumps into frozen drops -> pop
      if(t>=EV.frz3&&t<EV.unf3&&Math.abs(x)<0.55&&y<1.1){const zc=z;if(zc>-0.55){const pk=(zc+0.55)/1.1;if(pk<0.35){for(let j=0;j<8;j++){const a=j/8*TAU2;items.push({mesh:UEMIS,M:M4.trs([x+Math.cos(a)*pk*0.6,y+Math.sin(a)*pk*0.4,zc],0,0,0,0.025),tint:[0.75,0.9,1],tintAmt:1,alpha:1-pk/0.35,add:1,noShadow:true})}}continue}}
      const fr=t>=EV.frz3&&t<EV.unf3;const st=fr?1:2.6;
      items.push({mesh:DROP,M:M4.trs([x,y,z],0,0,0,[0.045,0.045*st,0.045]),tint:[0.6,0.85,1],tintAmt:0.3,alpha:fr?0.85:0.6,noShadow:true});
      if(fr)items.push({mesh:UEMIS,M:M4.trs([x-0.012,y+0.015,z-0.03],0,0,0,0.012),tint:[1,1,1],tintAmt:1,alpha:0.9,add:1,noShadow:true});
      if(!fr&&t<EV.frz3&&y<0.25)items.push({mesh:RING,M:M4.trs([x,0.04,z],0,0,0,0.05+(0.25-y)*1.2),tint:[0.8,0.9,1],tintAmt:1,alpha:0.5,add:1,noShadow:true})}
    // frozen falling leaf
    if(t>=EV.rain3){let lp,lr;if(t<EV.frz3){const k=clamp((t-EV.rain3)/(EV.frz3-EV.rain3),0,1);lp=[lerp(1.8,0.9,k)+0.3*Math.sin(k*6),lerp(4.5,1.55,k),-1.6];lr=k*4}else if(t<EV.unf3){lp=[0.9+0.3*Math.sin(6),1.55,-1.6+gz(EV.frz3)];lr=4}else{const k=clamp((t-EV.unf3)/1.4,0,1);lp=[0.9+0.3*Math.sin(6+k*4),lerp(1.55,0.05,k),-1.6+gz(EV.frz3)];lr=4+k*3}
      if(lp[2]<7)items.push({mesh:ALEAF,M:M4.trs(lp,lr,0.4*Math.sin(lr),0.3*Math.cos(lr),0.3),tint:[0.6,0.68,0.85],tintAmt:0.5*frozenTint})}}
  if(rn===2&&t>=EV.frz3-0.2&&t<EV.frz3+0.8){o.lid=0.05}
  if(rn===2&&t>=EV.res3-0.3&&t<EV.res3+2.0)o.glasses=easeOut((t-EV.res3+0.3)/0.5)*(1-ease((t-EV.res3-1.5)/0.5));
  // ---- R5: billion years ----
  if(rn===4&&t>=EV.burn5+0.8){for(let i=0;i<6;i++){const k=((t-EV.burn5)*0.6+i/6)%1;smoke(items,[(hsh(i,1)-0.5)*6,0.2,1+hsh(i,2)*5],k*2.4,1,1.5)}}
  if(rn===4&&t>=EV.gl5)o.glasses=easeOut((t-EV.gl5)/0.5);
  if(rn===5&&t<R[5]+1.2)o.glasses=1-ease((t-R[5])/0.6);
  if(rn===4&&t>=EV.burn5)o.soot=0.3*ease((t-EV.burn5)/2);
  if(rn===5)o.soot=0.3*(1-ease((t-R[5])/1.5));
  // ---- FINAL: one second -> old age ----
  if(rn===5&&t>=EV.sec0){const ok=ease((t-EV.sec0)/(EV.sec1-EV.sec0));o.old=ok;o.lid=lerp(0.45,0.85,ok);walk=0;o.headDown=0.25*ok;
    if(t>=EV.fall6){const fk=easeIn(clamp((t-EV.fall6)/0.35,0,1));const b=t>=EV.fall6+0.35&&t<EV.fall6+0.6?Math.sin((t-EV.fall6-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,b,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall6+0.3}}
  if(t>=R[6]){walk=0}
  if(HEALTHY){o.crutch=false;o.lid=0.05;walk=1.25;o.glasses=0}
  o.ph=(rn===0&&t>=EV.bh1&&t<EV.walk1)?0:t*5.2*(HEALTHY?1.3:1);o.walk=walk;o.pose=pose;
  const coughs=[2.0,EV.res1+0.6,EV.res2+0.9,EV.rw2+0.15,EV.res5+0.8,R[5]+1.6];if(!HEALTHY&&!o.old)for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  if(!hide)items.push(...antItems(Rm,o));
  return items}
function smoke(items,p,k,n,sc){for(let j=0;j<n;j++){const kk=k-j*0.18;if(kk<0||kk>2.4)continue;items.push({mesh:USPH,M:M4.trs([p[0]+Math.sin(kk*2+j)*0.15*kk,p[1]+kk*0.9,p[2]+kk*0.2],0,0,0,(0.15+kk*0.3)*sc),tint:[0.45,0.4,0.38],tintAmt:1,alpha:Math.max(0,0.16*(1-kk/2.4)),noShadow:true})}}
// ---------- render ----------
function renderScene(t){const tt=sceneT(t);const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  const fz=roundAt(tt)===2?ease((tt-EV.frz3)/0.4)*(1-ease((tt-EV.unf3)/0.5)):0;if(fz>0)items[0].tint=[0.6,0.66,0.78],items[0].tintAmt=0.5*fz;
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});const sd=env.sun[1]>0.05?{center:[0,0,-0.2],radius:4.5}:{center:[0,-9999,0],radius:1};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},sd,fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.bh1,16,0.5);if(tt>=EV.bh1&&tt<EV.evap1)a+=2.5;S(EV.evap1,30,0.8);S(EV.frz3,10,0.3);S(EV.unf3,8,0.3);
  if(t>=EV.rw0&&t<EV.rw1)a+=4;const k2=t-EV.rw2;if(k2>=0&&k2<0.5)a+=24*(1-k2/0.5);S(EV.fall6+0.35,14,0.4);if(tt>=EV.burn5&&tt<R[5])a+=1.5;if(tt<0.8&&t<EV.rw0)a+=8*(1-tt/0.8);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
const fmtN=n=>Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[6])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  if(t>=EV.rw0&&t<EV.rw2){ // rewind HUD
    if(t<EV.rw1){const pp=0.92+0.08*Math.sin(t*12);ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt('⏪ REWIND',0,0,112,'#FF5A8A');ctx.restore();const st=sceneT(t);pill('⏱️ '+st.toFixed(1)+' s',385,'rgba(15,10,30,0.72)',58)}
    else{txt('1 week ago… 🐜',W/2,250,96,'#7DFF9A');pill('Healthy again?! 💪',385,'rgba(40,140,60,0.88)',60,Math.min(1,(t-EV.rw1)/0.12))}
    const hl=t>=EV.rw1;drawHP(t,hl?1:0.03,hl?'#7DFF9A':'#ff4a4a',hl?'100%':'1%');return}
  const hideLab=rn===5&&t<EV.fin6;
  if(!hideLab){const kk=rn===5?t-EV.fin6:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===5?104:120,rn===5?'#5AF0FF':'#ffd84a');ctx.restore();
    if(rn===3&&t>=EV.rw2&&t<t2){if(t<EV.rw2+0.5)pill('▶ PLAY',385,'rgba(15,10,30,0.72)',62)}
    else if(t<t2)pill(cap1,385,rn===5?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,kk/0.12));else pill(cap2,385,rn===5?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[5]+0.4&&t<EV.fin6-0.5)pill('Time is back to normal… 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[5]-0.4)/0.15));if(t>=EV.fin6-0.5)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.fall6+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  // counters / widgets
  if(rn===0&&t>=EV.slow1&&t<EV.evap1)card('🐜 time: ×0.1 🐢',660,'rgba(110,60,220,0.92)',58,EV.slow1,t);
  if(rn===1&&t>=EV.ff2a-0.3){const n=1e6*clamp(ffAng(t,EV.ff2a,EV.ff2b,6)/(6*TAU2),0,1);card('📅 +'+fmtN(n)+' years',660,'rgba(20,110,170,0.92)',58,EV.ff2a-0.3,t)}
  if(rn===4&&t>=EV.ff5a-0.3){const n=1e9*clamp(ffAng(t,EV.ff5a,EV.ff5b,5)/(5*TAU2),0,1);card('📅 +'+fmtN(n)+' years',660,'rgba(200,90,20,0.92)',56,EV.ff5a-0.3,t)}
  if(rn===5&&t>=EV.sec0-0.6){const s=clamp((t-EV.sec0)/(EV.sec1-EV.sec0),0,1);card('⏱️ '+s.toFixed(2)+' s',660,s>=1?'rgba(200,40,40,0.92)':'rgba(15,10,30,0.8)',72,EV.sec0-0.6,t)}
  // stat cards
  if(rn===0&&t>=EV.slow1+0.7&&t<R[1]-0.2)card('Near a black hole, time slows down ⏳',780,'rgba(15,10,30,0.75)',46,EV.slow1+0.7,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: tiny black holes evaporate 💨',660,'rgba(110,60,220,0.92)',50,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.2&&t<R[1]-0.2)card('(Hawking radiation – smaller = faster)',890,'rgba(15,10,30,0.72)',40,EV.res1+1.2,t);
  if(rn===1&&t>=EV.res2+0.4&&t<R[2]-0.2)card('Real: ants have existed 100+ million years 🦖',780,'rgba(40,140,60,0.9)',42,EV.res2+0.4,t);
  if(rn===1&&t>=EV.res2+1.2&&t<R[2]-0.2)card('Oldest ant fossil: 113 million years 🪨',890,'rgba(15,10,30,0.72)',42,EV.res2+1.2,t);
  if(rn===2&&t>=EV.frz3+0.6&&t<R[3]-0.2)card('Everything froze… except the ant 🐜',660,'rgba(30,110,190,0.9)',48,EV.frz3+0.6,t);
  if(rn===2&&t>=EV.res3+0.6&&t<R[3]-0.2)card('Real: the faster you move, the slower your clock ⏱️',780,'rgba(15,10,30,0.75)',40,EV.res3+0.6,t);
  if(rn===2&&t>=EV.res3+1.4&&t<R[3]-0.2)card('(Einstein’s time dilation – GPS must correct it 🛰️)',890,'rgba(15,10,30,0.72)',36,EV.res3+1.4,t);
  if(rn===3&&t>=EV.res4+0.5&&t<R[4]-0.2)card('Real: time only flows forward ➡️',660,'rgba(255,60,110,0.9)',52,EV.res4+0.5,t);
  if(rn===3&&t>=EV.res4+1.2&&t<R[4]-0.2)card('because entropy (disorder) always grows 🧩',780,'rgba(15,10,30,0.75)',42,EV.res4+1.2,t);
  if(rn===4&&t>=EV.burn5+1.0&&t<R[5]-0.2)card('Real: the Sun slowly gets brighter ☀️⬆️',780,'rgba(15,10,30,0.75)',46,EV.burn5+1.0,t);
  if(rn===4&&t>=EV.res5+0.5&&t<R[5]-0.2)card('In ~1 billion years oceans could boil away 🌊🔥',890,'rgba(230,70,20,0.92)',40,EV.res5+0.5,t);
  if(rn===5&&t>=EV.res6+0.6)card('Its age: 1,001,000,000 years 🎂',780,'rgba(255,60,110,0.9)',50,EV.res6+0.6,t);
  if(rn===5&&t>=EV.res6+1.4)card('Real: worker ants live months to a few years 🐜',890,'rgba(15,10,30,0.75)',40,EV.res6+1.4,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('TIME ITSELF ⏳',0,-110,fitSize('TIME ITSELF ⏳',980,118),'#5AF0FF');txt('vs',0,-5,76,'#ffffff');txt('ONE DYING ANT 🐜',0,95,96,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[6];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  txt('Survived a black hole 🕳️',0,-230,fitSize('Survived a black hole 🕳️',960,76),'#FFD84A');txt('Lost to ONE second ⏱️',0,-130,fitSize('Lost to ONE second ⏱️',960,76),'#5AF0FF');
  txt('Who wins:',0,10,84,'#ffffff');txt('YOU or this ant? 🐜',0,115,fitSize('YOU or this ant? 🐜',960,90),'#ffd84a');txt('👇',0,280+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1140,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  // black hole glow
  if(BHSCR){const q=project(LASTVP,BHP);if(q){const bs=bhScale(tt);ctx.save();ctx.globalCompositeOperation='screen';glowAt(q,Math.min(900,0.9*1900/q[2]*bs+40),'150,90,255',0.35);if(tt>=EV.hawk1)glowAt(q,Math.min(900,1.2*1900/q[2]),'230,235,255',0.5*ease((tt-EV.hawk1)/(EV.evap1-EV.hawk1)));ctx.restore();
    const lr=0.36*1900/q[2]*bs;ctx.save();ctx.strokeStyle='rgba(255,220,170,0.35)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(q[0],q[1],lr,0,TAU2);ctx.stroke();ctx.restore()}}
  // cosmic purple
  if(rn===0&&tt>=EV.bh1&&tt<EV.evap1+0.5){ctx.fillStyle=`rgba(60,20,120,${0.12*ease((tt-EV.bh1)/0.5)*(1-ease((tt-EV.evap1)/0.5))})`;ctx.fillRect(0,0,W,H)}
  // freeze tint
  const fz=rn===2?ease((tt-EV.frz3)/0.4)*(1-ease((tt-EV.unf3)/0.5)):0;if(fz>0){ctx.fillStyle=`rgba(120,170,255,${0.1*fz})`;ctx.fillRect(0,0,W,H)}
  if(rn===2){for(const [t0,s] of [[EV.frz3,'⏸️'],[EV.unf3,'▶️']]){const k=tt-t0;if(k>=0&&k<1.0){ctx.save();ctx.globalAlpha=clamp((1-k)/0.4,0,1)*0.9;ctx.translate(W/2,860);const p=k<0.15?0.5+0.5*easeOut(k/0.15):1+0.1*(k-0.15);ctx.scale(p,p);txt(s,0,0,230,'#fff','center',900,false);ctx.restore()}}}
  // heat
  if(rn===4&&tt>=EV.burn5-1){const a=ease((tt-EV.burn5+1)/2.0);const g=ctx.createLinearGradient(0,H,0,H*0.4);g.addColorStop(0,`rgba(255,100,20,${0.2*a})`);g.addColorStop(1,'rgba(255,100,20,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
  // healthy memory tint
  if(HEALTHY){ctx.fillStyle='rgba(255,210,140,0.10)';ctx.fillRect(0,0,W,H)}
  // VHS rewind
  if(t>=EV.rw0&&t<EV.rw1){ctx.save();ctx.fillStyle='rgba(255,60,140,0.07)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,0,0,0.18)';for(let y=0;y<H;y+=6)ctx.fillRect(0,y,W,2);
    const r=rngG(Math.floor(t*30));for(let i=0;i<3;i++){const y=r()*H;ctx.fillStyle=`rgba(255,255,255,${0.08+r()*0.12})`;ctx.fillRect(0,y,W,8+r()*30)}ctx.restore()}
  // final letterbox
  if(rn===5&&tt>=EV.fin6&&tt<EV.res6+0.8){const k=ease((tt-EV.fin6)/0.4)*(1-ease((tt-EV.res6-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  if(rn===5&&tt>=EV.sec0&&tt<R[6]){const k=ease((tt-EV.sec0)/1.0);ctx.fillStyle=`rgba(60,50,40,${0.12*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col,tv)=>{const k=(tv==null?t:tv)-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<6;i++)flash(R[i],0.35,0.15);if(t<EV.rw0||t>=EV.rw2){flash(EV.bh1,0.5,0.3,'170,120,255',tt);flash(EV.evap1,0.75,0.5,'240,240,255',tt);flash(EV.frz3,0.35,0.3,'190,220,255',tt);flash(EV.unf3,0.25,0.25,'190,220,255',tt)}
  flash(EV.rw0,0.35,0.2,'255,90,160');flash(EV.rw1,0.6,0.3);flash(EV.rw2,0.7,0.35);flash(EV.fall6+0.35,0.3,0.25,'255,255,255');
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
