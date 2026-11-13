// ===================== ASTEROID vs DYING ANT =====================
const FPS=30,DUR=63,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();buildPlanets();
// ---------- timeline ----------
const R=[3.6,11.8,20.2,28.8,38.2,47.4,58.4]; // round starts; R[6]=end card
const EV={tilt1:4.8,mets:[5.0,5.45,5.9,6.3,6.75,7.15,7.6,8.0,8.5],fm:[5.3,6.15,7.0,7.85,8.7],ast2:12.3,imp2:14.2,hit2:15.6,night3:20.2,cme3:21.4,aur3:21.8,gl3:23.0,ast4:29.0,imp4:31.6,hit4:33.4,bh5:38.4,cl5:39.2,suck5:42.2,spit5:42.6,land5:43.6,drop0:50.4,splash:53.0,endc:58.4,loop:62.6};
const FMP=[[1.7,0.6],[-2.1,-0.9],[2.4,1.9],[-1.5,1.2],[2.0,-1.3]];
const ROUNDS=[['ROUND 1','Meteor shower ☄️☄️☄️','Dodged every single one 😮‍💨',9.4],['ROUND 2','Apophis-size asteroid 🪨 (340 m)','Came prepared ☂️',16.4],['ROUND 3','Extreme solar storm ☀️⚡','Free aurora show 😎',24.0],['ROUND 4','Dino-killer asteroid 🦖☄️','Ants really survived this one 🐜',35.0],['ROUND 5','Black hole 🕳️','…and got spit back out 🐜',43.4],['FINAL ROUND','One autumn leaf 🍂','Cause of death: autumn 💀',53.6]];
function roundAt(t){for(let i=5;i>=0;i--)if(t>=R[i])return i;return -1}
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
      if(i===0){if(pose==='sit')foot=[s*0.09,0.47+0.03*Math.sin((o.t||0)*9),-0.56];if(pose==='dust'){const w=(o.t||0)*13+s*1.4;foot=[s*0.13,0.5+0.07*Math.sin(w),-0.36+0.07*Math.cos(w)]}if(pose==='umb'&&s>0)foot=[0.2,0.62,-0.38];if(pose==='walk'&&s>0&&o.crutch!==false)foot=[0.38,0.36,-0.36]}}
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
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0')},o||{})}
function envAt(t){const rn=roundAt(t);
  let e=envBase();
  const haze=(k,a)=>{e=envBase({fog:mix3(e.fog,hx('#a89888'),k*a),hor:mix3(e.hor,hx('#c0a890'),k*a),zen:mix3(e.zen,hx('#6a7a90'),k*a*0.7),sky:mix3(e.sky,hx('#b0a090'),k*a)})};
  if(t>=EV.mets[3]&&t<R[1])haze(clamp((t-EV.mets[3])/1.5,0,1)*clamp(1-(t-9.5)/2,0.3,1),0.35);
  if(t>=EV.hit2&&t<R[2])haze(clamp(1-(t-EV.hit2-1.5)/3,0.45,1),0.7);
  if(t>=R[2]&&t<R[3]){const k=ease((t-EV.night3)/0.9),a=ease((t-EV.aur3)/1.6)*(1-ease((t-R[3]+0.4)/0.4)*0);const night=envBase({sun:[0.3,0.25,-0.6],sunCol:hx('#7a90c0'),sky:hx('#0a1430'),gnd:hx('#202838'),fog:mix3(hx('#0c1630'),hx('#1a4a40'),a),fogD:5000,zen:hx('#03050f'),hor:mix3(hx('#14203e'),hx('#2a8a6a'),a),stars:1,night:1});
    e=envBase({sun:night.sun,sunCol:mix3(e.sunCol,night.sunCol,k),sky:mix3(e.sky,night.sky,k),gnd:mix3(e.gnd,night.gnd,k),fog:mix3(e.fog,night.fog,k),zen:mix3(e.zen,night.zen,k),hor:mix3(e.hor,night.hor,k),stars:k,night:k,fogD:5000})}
  if(t>=R[3]&&t<R[4]){const k=clamp((t-R[3])/1,0,1),n=clamp((t-EV.imp4)/1.2,0,1);e=envBase({sunCol:mix3(hx('#ffd8b0'),hx('#ffb080'),k),fog:mix3(mix3(hx('#9a8070'),hx('#a05a40'),k),hx('#c06030'),n),hor:mix3(mix3(hx('#c09070'),hx('#e07040'),k),hx('#ff9040'),n),zen:mix3(mix3(hx('#4a5a70'),hx('#5a2a30'),k),hx('#6a1a10'),n),sky:mix3(hx('#a08878'),hx('#d07040'),n),fogD:3000,gnd:hx('#5a4a40'),emis:1+n*0.3})}
  if(t>=R[4]&&t<EV.spit5){const k=clamp((t-R[4])/0.6,0,1);e=envBase({sunCol:mix3(hx('#ffb070'),hx('#c8a8ff'),k),fog:mix3(hx('#c06030'),hx('#0a0614'),k),hor:mix3(hx('#ff9040'),hx('#1a0a28'),k),zen:mix3(hx('#6a1a10'),[0,0,0.01],k),sky:mix3(hx('#d07040'),hx('#4a3a80'),k),gnd:hx('#2a2030'),stars:k,fogD:3000})}
  if(t>=EV.spit5&&t<R[6]+5){e=envBase({sunCol:hx('#ffe6c0'),hor:hx('#f0dcc0'),fog:hx('#e8d8c4'),sky:hx('#b8c8e0')})}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;eye=[eye[0]+sway,eye[1],eye[2]];
  if(t<R[0]){const k=t/R[0];eye=[1.4-k*0.3,0.9,-3.3-k*0.3];at=[0,0.6,0.3]}
  if(rn===0&&t<EV.tilt1+0.3){const k=ease((t-R[0]-0.3)/0.9);eye=V.add(eye,[0,-0.25*k,0.3*k]);at=V.add(at,[0,0.7*k,0])}
  if(rn===0&&t>=EV.tilt1+0.3){const k=1-ease((t-EV.tilt1-0.3)/1.4);eye=V.add(eye,[0,-0.25*k,0.3*k]);at=V.add(at,[0,0.7*k,0])}
  if(rn===1){eye=[1.7,0.75,-4.2];at=[0,1.15,0.4];if(t>EV.hit2+0.8){const k=ease((t-EV.hit2-0.8)/1.4);eye=V.add(eye,V.sc([-0.4,0.15,1.0],k));at=V.add(at,[0,-0.3*k,0])}}
  if(rn===2){const k=ease((t-R[2])/1.2);eye=[lerp(-1.8,-1.5,k),lerp(0.95,0.55,k),-3.9];at=[0,lerp(0.7,1.45,k),0.4];if(t>EV.gl3-0.4){const kk=ease((t-EV.gl3+0.4)/0.8);eye=V.add(eye,V.sc([0.5,0.15,1.2],kk));at=V.add(at,[0,-0.6*kk,0])}}
  if(rn===3){eye=[1.8,0.9,-4.1];at=[0,0.95,0.3];if(t>EV.hit4+1.4){const k=ease((t-EV.hit4-1.4)/1.5);eye=[lerp(1.8,1.3,k),lerp(0.9,1.5,k),lerp(-4.1,-2.8,k)];at=[0,lerp(0.95,0.45,k),lerp(0.3,-0.3,k)]}}
  if(rn===4){eye=[1.8,1.0,-3.9];at=[0,0.9,0.4];if(t>=EV.spit5){eye=[1.6,0.95,-3.6];at=[0,0.6,0.2]}}
  if(rn===5){const k=ease((t-R[5])/2.5);eye=[lerp(1.7,1.2,k),0.95,lerp(-3.8,-2.9,k)];at=[0,0.55,0.2];if(t>=EV.drop0-0.4){const kk=ease((t-EV.drop0+0.4)/0.8);eye=[lerp(1.2,1.6,kk),lerp(0.95,0.6,kk),lerp(-2.9,-3.4,kk)];at=[0,lerp(0.55,1.9,kk)-ease((t-EV.splash+1.2)/1.0)*1.45,0]}}
  if(rn===5&&t>=EV.splash){const k=ease((t-EV.splash)/0.9);eye=[lerp(1.6,1.5,k),lerp(0.6,2.6,k),lerp(-3.4,-2.8,k)];at=[0,lerp(0.45,0.1,k),lerp(0,0.7,k)]}
  if(t>=R[6])eye=[1.5,2.6,-2.8],at=[0,0.1,0.7];
  return{eye,at}}
// ---------- background (meters) ----------
function explo(items,pos,k,S,D,hitT,o){o=o||{};if(k<0)return;
  // fireball
  if(k<1.4){const r=S*0.28*easeOut(k/0.5);items.push({mesh:UEMIS,M:M4.trs([pos[0],pos[1]+r*0.7,pos[2]],0,0,0,r),tint:mix3([1,1,0.9],[1,0.55,0.15],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.2,0,1),add:1,noShadow:true})}
  // mushroom
  const sx=0.35+0.65*easeOut((k-0.15)/3.2),sy=0.12+0.88*easeOut((k-0.1)/2.4);if(k>0.1){const M=M4.trs(pos,k*0.05,0,0,[S*sx,S*sy,S*sx]);items.push({mesh:MUSH,M});items.push({mesh:MUSHHOT,M:M4.trs(pos,k*0.05,0,0,[S*sx*1.03,S*sy*1.02,S*sx*1.03]),alpha:clamp(1.0-k/5,0.12,1)*0.9,add:1,noShadow:true,tint:null})}
  // shock wave
  const rr=D*k/hitT;if(rr<D*1.05){items.push({mesh:RING,M:M4.trs([pos[0],1,pos[2]],0,0,0,rr),alpha:0.55*(1-rr/(D*1.1)),add:1,noShadow:true,tint:[1,0.95,0.85],tintAmt:1});
    items.push({mesh:UEMIS,M:M4.trs(pos,0,0,0,rr),alpha:0.07*(1-rr/D),add:1,noShadow:true,tint:[1,1,1],tintAmt:1});
    items.push({mesh:DUSTRING,M:M4.trs(pos,0,0,0,[rr,S*0.08+rr*0.02,rr])})}}
function bgItems(t){const items=[{mesh:BGG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  // R1 meteor shower
  if(t>=R[0]-0.5&&t<R[1]+0.3){EV.mets.forEach((td,i)=>{const d=2200+hsh(i,3)*4200,sd=(hsh(i,5)-0.5)*2*d*0.4;const tgt=P(d,sd);const fk=(t-(td-0.9))/0.9;
      if(fk>0&&fk<1){const st=[tgt[0]-side[0]*1800*(hsh(i,8)<0.5?1:-1),2400,tgt[2]-side[2]*1800*(hsh(i,8)<0.5?1:-1)];const cur=V.add(st,V.sc(V.sub(tgt,st),fk));
        for(let j=0;j<10;j++){const f=j/10;const q=V.add(cur,V.sc(V.sub(st,cur),f*0.4));items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,(50+0.2*d*0.02)*(1-f*0.7)),tint:mix3([1,0.95,0.7],[1,0.35,0.05],f),tintAmt:1,alpha:0.7*(1-f),add:1,noShadow:true})}}
      const k=t-td;if(k>0&&k<3){const r=(140+hsh(i,7)*120)*easeOut(k/0.4);items.push({mesh:UEMIS,M:M4.trs([tgt[0],r*0.5,tgt[2]],0,0,0,r),tint:mix3([1,1,0.85],[1,0.45,0.1],clamp(k/1,0,1)),tintAmt:1,alpha:clamp(1-k/1.4,0,1),add:1,noShadow:true});
        const rr=900*easeOut(k/2.2);items.push({mesh:DUSTRING,M:M4.trs(tgt,0,0,0,[rr,60+rr*0.05,rr]),alpha:clamp(1.3-k/2.2,0,1)});items.push({mesh:USPH,M:M4.trs([tgt[0],150+k*120,tgt[2]],0,0,0,[260+k*160,200+k*150,260+k*160]),tint:[0.45,0.4,0.36],tintAmt:1,alpha:clamp(0.8-k/3.5,0,1)})}})}
  // R2 Apophis-size asteroid
  if(t>=R[1]-0.2&&t<R[2]){const tgt=P(4500,600);const k=(t-EV.ast2)/(EV.imp2-EV.ast2);if(k>-0.1&&k<1){const kk=Math.max(0,k);const start=[tgt[0]-side[0]*2600,4200,tgt[2]-side[2]*2600];const cur=[lerp(start[0],tgt[0],kk),lerp(start[1],200,kk),lerp(start[2],tgt[2],kk)];
      items.push({mesh:AST,M:M4.trs(cur,t*2,t,0,260)});for(let i=0;i<14;i++){const f=0.08+i/14;const q=[lerp(cur[0],start[0],f*0.35),lerp(cur[1],start[1],f*0.35),lerp(cur[2],start[2],f*0.35)];items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,300*(1-f*0.6)),tint:mix3([1,0.9,0.5],[1,0.3,0.05],f),tintAmt:1,alpha:0.5*(1-f),add:1,noShadow:true})}}
    explo(items,tgt,t-EV.imp2,2600,4500,EV.hit2-EV.imp2)}
  // R3 solar storm: aurora curtains
  if(t>=EV.aur3-0.2&&t<R[3]+0.2){const a=ease((t-EV.aur3)/1.8)*(1-ease((t-R[3]+0.3)/0.5));for(let i=0;i<3;i++){const d=3500+i*1700,sd=(i-1)*900;const p=P(d,sd,700+i*250);const ang=Math.atan2(dir[0],dir[2]);
      const wob=Math.sin(t*0.9+i*2)*0.25;items.push({mesh:AUR[i],M:M4.trs(p,ang+wob*0.2,0,0,[5200+i*1500,(1500+i*500)*(0.85+0.15*Math.sin(t*1.7+i)),900]),tint:null,tintAmt:0,alpha:a*(0.75+0.25*Math.sin(t*3.1+i*1.3)),add:1,noShadow:true})}}
  // R4 dino-killer asteroid
  if(t>=R[3]-0.2&&t<R[4]){const tgt=P(9000,-900);const k=(t-EV.ast4)/(EV.imp4-EV.ast4);if(k>-0.1&&k<1){const kk=easeIn(Math.max(0,k))*0.6+Math.max(0,k)*0.4;const start=[tgt[0]+side[0]*2600+dir[0]*3000,7200,tgt[2]+side[2]*2600+dir[2]*3000];const cur=[lerp(start[0],tgt[0],kk),lerp(start[1],900,kk),lerp(start[2],tgt[2],kk)];
      items.push({mesh:AST,M:M4.trs(cur,t*0.7,t*0.4,0,1300)});for(let i=0;i<16;i++){const f=0.06+i/16;const q=V.add(cur,V.sc(V.sub(start,cur),f*0.45));items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,1250*(1-f*0.5)),tint:mix3([1,0.95,0.7],[1,0.3,0.05],f),tintAmt:1,alpha:0.55*(1-f),add:1,noShadow:true})}}
    explo(items,tgt,t-EV.imp4,5200,9000,EV.hit4-EV.imp4)}
  // R5 black hole
  if(t>=R[4]&&t<EV.spit5){const bp=V.add(P(9000,1500),[0,1600,0]);const g=easeOut((t-EV.bh5)/1.2);const s=560*g*(1+0.6*clamp((t-(EV.suck5-1.2))/1.4,0,1));items.push({mesh:BHD,M:M4.trs(bp,t*0.9,0.35,0.15,s*1.0)});items.push({mesh:USPH,M:M4.trs(bp,0,0,0,s*1.15),tint:[0,0,0],tintAmt:1,alpha:0.999})}
  return{items,dir,side}}
// ---------- foreground (cm) ----------
let LASTVP=null;
function fgItems(t){const rn=roundAt(t);const items=[];const burnt=t>=EV.hit4+0.3&&t<EV.spit5;const L=burnt?TILEB:TILE;
  let pose='walk',walk=1,o={t};
  if(rn===1&&t>=EV.ast2+0.6){pose='umb'}
  if(rn===2&&t>=EV.gl3){o.glasses=easeOut((t-EV.gl3)/0.5)}
  if(rn===3&&t>=EV.hit4+0.8){pose='sit';walk=0}
  if(rn===4&&t>=EV.cl5&&t<EV.suck5+0.4){pose='cling';walk=0}
  if(rn===4&&t>=EV.spit5){pose=t<EV.land5?'fall':'walk';walk=t<EV.land5+2.2?0:1;o.dizzy=t>=EV.land5&&t<EV.land5+2.4;o.lid=0}
  if(rn===5&&t>=EV.splash){pose='squash';walk=0;o.xeyes=true}
  if(t>=R[6]&&t<EV.loop){pose='squash';walk=0;o.xeyes=true}
  if(rn===5&&t<EV.drop0-0.8){o.lid=0.62}
  if(rn===5&&t>=EV.drop0-0.8&&t<EV.splash){o.lid=0.0;walk=t<EV.drop0?1:0.0}
  if(rn===0)o.lid=t>EV.fm[0]&&t<9.6?0.1:0.45;
  const dist=1.1*t;const o_=((dist%L.T)+L.T)%L.T;for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  const slow=rn===5&&t>=EV.drop0&&t<EV.splash+1.5;
  o.ph=t*(slow?1.2:5.2);o.walk=walk;o.pose=pose;
  const coughs=[2.0,9.9,EV.hit2+0.9,EV.hit4+1.6,EV.land5+0.6];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  let Rm=M4.id();
  // R1 hops when tiny meteorites slam next to him
  if(rn===0){for(const f of EV.fm){const k=t-f;if(k>=0&&k<0.32){Rm=M4.trs([0,Math.sin(k/0.32*Math.PI)*0.28,0],0,0,0,1)}}}
  if(pose==='cling'){const k=ease((t-EV.cl5)/0.6);const ang=-(0.9+0.25*Math.sin(t*9)+0.15*Math.sin(t*23))*k;const sk=t>=EV.suck5?easeIn((t-EV.suck5)/0.4):0;
    const piv=[0,0.4,-0.66];Rm=M4.mul(M4.trs([piv[0],piv[1]+sk*30,piv[2]+sk*80],0,ang,0,1),M4.trs(V.sc(piv,-1),0,0,0,1));
    const bend=0.25+0.12*Math.sin(t*7);items.push({mesh:UCYL,M:segM([0,-0.3,-0.75],[0,1.4,-0.75+bend*2.4],0.09),tint:hx('#4a9a35'),tintAmt:1})}
  if(pose==='fall'){const k=clamp((t-EV.spit5-0.2)/(EV.land5-EV.spit5-0.2),0,1);const y=40*(1-k*k);Rm=M4.trs([0,y,0],t*6,t*4,0,1)}
  if(rn===4&&t>=EV.land5&&t<EV.land5+0.5){const k=(t-EV.land5)/0.5;Rm=M4.trs([0,Math.sin(k*Math.PI)*1.2,0],0,0,0,[1+0.2*Math.sin(k*Math.PI*3)*(1-k),1-0.3*Math.sin(k*Math.PI*3)*(1-k),1])}
  if(pose==='squash'){const k=clamp((t-EV.splash)/0.12,0,1);Rm=M4.trs([0,0,0],0,0,0,[lerp(1,1.35,k),lerp(1,0.26,k),lerp(1,1.15,k)])}
  items.push(...antItems(Rm,o));
  // R1 tiny meteorites (foreground)
  if(rn===0||(t>=R[1]&&t<R[1]+0.5)){EV.fm.forEach((f,i)=>{const [x0,z0]=FMP[i];const k=t-f;const tf=0.38;
      if(k>-tf&&k<0){const q=1+k/tf;const st=[x0-3.5,9,z0+6];const cur=V.add(st,V.sc(V.sub([x0,0.1,z0],st),q));items.push({mesh:ROCK[i%4],M:M4.trs(cur,t*9,t*7,0,0.18),tint:[1,0.55,0.2],tintAmt:0.7,noShadow:true});
        for(let j=0;j<9;j++){const ff=j/9;const p=V.add(cur,V.sc(V.sub(st,cur),ff*0.35));items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.26*(1-ff*0.75)),tint:mix3([1,0.95,0.7],[1,0.3,0.05],ff),tintAmt:1,alpha:0.85*(1-ff),add:1,noShadow:true})}}
      if(k>=0){const z=z0+1.1*k;if(z>8)return;
        items.push({mesh:DISC2,M:M4.trs([x0,0.035,z],i,0,0,[0.55,1,0.55]),tint:mix3([1,0.5,0.15],[0.12,0.1,0.09],clamp(k/1.5,0,1)),tintAmt:1,noShadow:true});
        items.push({mesh:ROCK[i%4],M:M4.trs([x0,0.08,z],i,i*2,0,0.16),tint:mix3([1,0.5,0.15],[0.3,0.25,0.2],clamp(k/2,0,1)),tintAmt:0.8});
        if(k<0.6){items.push({mesh:UEMIS,M:M4.trs([x0,0.2,z],0,0,0,0.2+0.55*easeOut(k/0.25)),tint:mix3([1,0.85,0.5],[1,0.4,0.08],k/0.6),tintAmt:1,alpha:1-k/0.6,add:1,noShadow:true});
          for(let j=0;j<12;j++){const a=j/12*TAU2+i;const sp=1.6+hsh(i,j)*2;const p=[x0+Math.cos(a)*sp*k,0.1+k*(5-k*14)*(0.6+hsh(j,i)*0.6),z+Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.045),tint:[1,0.7,0.3],tintAmt:1,alpha:1,add:1,noShadow:true})}}
        if(k<2.5)for(let j=0;j<3;j++){const kk=k-j*0.25;if(kk<0)continue;items.push({mesh:USPH,M:M4.trs([x0+kk*0.2,0.3+kk*0.7,z+kk*0.3],0,0,0,0.25+kk*0.35),tint:[0.5,0.46,0.42],tintAmt:1,alpha:Math.max(0,0.22*(1-kk/2)),noShadow:true})}}})}
  // black hole debris
  if(rn===4&&t>=EV.cl5-0.2&&t<EV.spit5){const bdir=V.norm([camAt(t).at[0]-camAt(t).eye[0],0.28,camAt(t).at[2]-camAt(t).eye[2]]);for(let i=0;i<34;i++){const t0=EV.cl5-0.2+hsh(i,1)*3.0;const k=t-t0;if(k<0)continue;const p0=[(hsh(i,2)-0.5)*50,0,(hsh(i,3)-0.3)*40];const d=k*k*35;const p=V.add(p0,V.sc(bdir,d));p[1]+=k*3;const mesh=i%3===0?CRUMB:(i%3===1?ROCK[i%4]:LEAF);items.push({mesh,M:M4.trs(p,k*5+i,k*3,i,i%3===2?1.2:0.5+hsh(i,4)*0.8),tint:null,tintAmt:0})}}
  // asteroid debris rocks bouncing (R2)
  if(rn===1&&t>=EV.imp2+0.6){for(let i=0;i<16;i++){const t0=EV.imp2+0.6+hsh(i,11)*3.2;const k=t-t0;if(k<0||k>2)continue;const onLeaf=i%3===0;const x0=onLeaf?(hsh(i,1)-0.5)*1.2:(hsh(i,1)-0.5)*30,z0=onLeaf?-0.2:(hsh(i,2)-0.6)*25;const yHit=onLeaf?2.0:0.2;const tf=0.5;let y,x=x0,z=z0;if(k<tf){y=yHit+30*(1-k/tf)*(1-k/tf)*1.0+(1-k/tf)*8}else{const kb=k-tf;y=yHit+kb*(6-kb*14);x=x0+(onLeaf?(i%2?1:-1)*kb*5:0);if(y<0.2)y=0.2}
      items.push({mesh:ROCK[i%4],M:M4.trs([x,y,z],k*4,k*3,0,onLeaf?0.22:0.3+hsh(i,5)*0.5),tint:[1,0.5,0.2],tintAmt:k<tf?0.6:0.15})}}
  // FINAL: one autumn leaf
  if(rn===5&&t>=EV.drop0-0.3&&t<EV.splash){const k=(t-EV.drop0+0.3)/(EV.splash-EV.drop0+0.3);const y=0.75+8*Math.pow(1-k,1.1);const sw=Math.sin(t*3.2)*(1-k)*1.1;
    items.push({mesh:ALEAF,M:M4.trs([sw+0.05*k,y-0.45*k*k,lerp(-0.1,1.3,k)+Math.cos(t*2.1)*0.3*(1-k)],t*0.8,Math.sin(t*3.2)*0.55*(1-k)+0.08,Math.cos(t*2.7)*0.4*(1-k),[1.4,1,1.7]),tint:null,tintAmt:0})}
  if((rn===5&&t>=EV.splash)||(t>=R[6]&&t<EV.loop)){const k=t-EV.splash;items.push({mesh:ALEAF,M:M4.trs([0.05,0.3,1.3],EV.splash*0.8,0.06,0.02,[1.4,1,1.7]),tint:null,tintAmt:0});
    if(k<1.2)for(let i=0;i<10;i++){const a=i/10*TAU2;const sp=1.6+hsh(i,3)*1.2;const kk=k;const p=[Math.cos(a)*sp*kk*1.4,0.15+kk*0.5,Math.sin(a)*sp*kk*1.4];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.12+kk*0.25),tint:[0.7,0.62,0.5],tintAmt:1,alpha:Math.max(0,0.2*(1-kk/1.2)),noShadow:true})}
    if(k<1.5){const kk=k;items.push({mesh:UCYL,M:M4.mul(M4.trs([1.2+kk*4,0.1+kk*(4-kk*5.5),-0.4],0,0,kk*12,1),segM([0,-0.25,0],[0,0.25,0],0.028)),tint:AC.wood,tintAmt:1})}}
  return items}
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const w=1+0.12*Math.sin(i*1.9);m.tri([0,0,0],[Math.cos(b)*w,0,Math.sin(b)*w],[Math.cos(a)*w,0,Math.sin(a)*w],[1,1,1])}});
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function dustAmt(t){const f=(h,a,b,c)=>{const k=t-h;if(k<0)return 0;if(k<a)return easeOut(k/a);if(k<a+b)return 1;return clamp(1-(k-a-b)/c,0,1)};return Math.max(f(EV.hit2,0.15,0.9,1.0),f(EV.hit4,0.15,1.2,1.0))}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};EV.mets.forEach(d=>S(d,6,0.6));EV.fm.forEach(d=>S(d,16,0.45));S(EV.imp2,24,1.6);S(EV.hit2,36,2);S(EV.cme3,10,1.2);S(EV.imp4,30,2.0);S(EV.hit4,46,2.6);if(t>=EV.cl5-0.2&&t<EV.suck5)a+=6+5*clamp((t-EV.cl5-0.6)/2,0,1);S(EV.suck5,30,0.6);S(EV.land5,14,0.4);S(EV.splash,12,0.4);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[6])return;const ts=R[rn];const k=t-ts;const pop=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=rn===5&&t<EV.drop0;
  if(!hideLab){const kk=rn===5?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===5?104:120,rn===5?'#ffb04a':'#ffd84a');ctx.restore();
    if(t<t2)pill(cap1,385,rn===5?'rgba(190,80,20,0.85)':'rgba(15,10,30,0.66)',60,Math.min(1,kk/0.12));else pill(cap2,385,rn===5?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[5]+0.3&&t<EV.drop0-0.6)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[5]-0.3)/0.15));if(t>=EV.drop0-0.6)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  // HP bar
  const ko=t>=EV.splash;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle=ko?'#ff3a3a':'#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore();
  // stat card
  if(rn===3&&t>=EV.imp4+0.25&&t<EV.hit4+1.6){const k=t-EV.imp4-0.25;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,660);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill('💥 = 4.5 BILLION Hiroshima bombs',0,'rgba(255,60,110,0.9)',54);ctx.restore()}
  if(rn===2&&t>=EV.cme3+0.2&&t<EV.gl3+0.2){const k=t-EV.cme3-0.2;ctx.save();ctx.globalAlpha=Math.min(1,k/0.15);pill('Real 2024 storm: auroras seen in Mexico 🌌',660,'rgba(20,120,90,0.88)',48);ctx.restore()}}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,430);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('ASTEROID ☄️',0,-150,118,'#ffd84a');txt('vs',0,-40,80,'#ffffff');txt('ONE DYING ANT 🐜',0,70,100,'#ff6a5a');ctx.restore();
  if(t>1.0){ctx.save();ctx.globalAlpha=a*clamp((t-1.0)/0.3,0,1);pill('Who wins? 🤔',730,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[6];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.68*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who wins:',0,-110,90,'#ffffff');txt('YOU or this ant? 🐜',0,0,fitSize('YOU or this ant? 🐜',960,92),'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1080,52,'#ffffff','center',800);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;
  // dust storm
  const da=dustAmt(tt);if(da>0){ctx.fillStyle=`rgba(150,122,96,${0.93*da})`;ctx.fillRect(0,0,W,H);const r=rngG(Math.floor(tt*30));ctx.strokeStyle=`rgba(90,70,55,${0.5*da})`;ctx.lineWidth=6;for(let i=0;i<40;i++){const x=r()*W*1.4-W*0.2,y=r()*H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+120+r()*200,y+30*(r()-0.5));ctx.stroke()}
    for(let i=0;i<14;i++){const x=r()*W,y=r()*H,s=4+r()*10;ctx.fillStyle=`rgba(60,45,35,${0.7*da})`;ctx.fillRect(x,y,s,s)}}
  // solar storm: CME flash + aurora sky glow
  if(tt>=EV.cme3-0.6&&tt<EV.cme3+1.2){const k=(tt-EV.cme3+0.6)/1.8;const g=ctx.createRadialGradient(W*0.2,H*0.1,30,W*0.2,H*0.1,500+k*500);g.addColorStop(0,`rgba(255,240,200,${0.7*Math.sin(k*Math.PI)})`);g.addColorStop(1,'rgba(255,120,200,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
  if(tt>=EV.aur3&&tt<R[3]){const a=ease((tt-EV.aur3)/1.8)*(1-ease((tt-R[3]+0.3)/0.3));const g=ctx.createLinearGradient(0,0,0,H*0.7);g.addColorStop(0,`rgba(200,80,220,${0.16*a})`);g.addColorStop(0.5,`rgba(60,255,150,${0.14*a})`);g.addColorStop(1,'rgba(60,255,150,0)');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
  // asteroid fire rain streaks (R2 light, R4 heavy)
  const fire=(t0,t1,n,amp)=>{if(tt<t0||tt>=t1)return;const r=rngG(3);const a=clamp(1-(tt-t0-3)/2,0,1)*amp;ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<n;i++){const sp=900+r()*600;const x0=r()*W*1.3,ph=r()*3;const y=((tt*sp+ph*700)%(H*0.75));const x=x0-y*0.35;ctx.strokeStyle=`rgba(255,${140+r()*80|0},60,${0.6*a})`;ctx.lineWidth=5+r()*5;ctx.beginPath();ctx.moveTo(x,y-120);ctx.lineTo(x+0.35*-120,y);ctx.stroke()}ctx.restore()};
  fire(EV.imp2+0.3,R[2],16,0.7);fire(EV.imp4+0.3,R[4],34,1);
  // meteor shower streaks in sky (R1)
  if(tt>=R[0]+0.2&&tt<9.6){const r=rngG(17);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<14;i++){const t0=R[0]+0.2+r()*5.6,d=0.5+r()*0.4;const k=(tt-t0)/d;if(k<0||k>1)continue;const x0=W*(0.1+r()*1.0),y0=r()*H*0.25;const L=500+r()*400;const x=x0-k*L*0.8,y=y0+k*L*0.6;const g=ctx.createLinearGradient(x,y,x+260,y-195);g.addColorStop(0,`rgba(255,250,220,${0.9*Math.sin(k*Math.PI)})`);g.addColorStop(1,'rgba(255,160,80,0)');ctx.strokeStyle=g;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+260,y-195);ctx.stroke()}ctx.restore()}
  if(tt>=EV.imp4&&tt<R[4]){ctx.fillStyle='rgba(255,120,40,0.1)';ctx.fillRect(0,0,W,H)}
  // black hole glow / suck streaks
  if(tt>=EV.bh5&&tt<EV.spit5){const p=project(LASTVP_BG,BHPOS);if(p){const g=ctx.createRadialGradient(p[0],p[1],60,p[0],p[1],650);g.addColorStop(0,'rgba(255,160,90,0.3)');g.addColorStop(1,'rgba(150,60,200,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);const a=clamp((tt-EV.cl5)/0.8,0,1);const r=rngG(Math.floor(tt*20));ctx.strokeStyle=`rgba(220,200,255,${0.35*a})`;ctx.lineWidth=4;for(let i=0;i<30;i++){const ang=r()*TAU2,d0=300+r()*900,ln=100+r()*200;const sh=(tt*3+r())%1;const d=d0*(1-sh);ctx.beginPath();ctx.moveTo(p[0]+Math.cos(ang)*d,p[1]+Math.sin(ang)*d);ctx.lineTo(p[0]+Math.cos(ang)*(d+ln),p[1]+Math.sin(ang)*(d+ln));ctx.stroke()}}}
  // slow-mo letterbox
  if(tt>=EV.drop0-0.6&&tt<EV.splash+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.splash-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k);ctx.fillStyle=`rgba(255,150,60,${0.08*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<6;i++)flash(R[i],0.35,0.15);EV.mets.forEach(d=>flash(d,0.3,0.25,'255,240,210'));EV.fm.forEach(d=>flash(d,0.45,0.2,'255,230,190'));flash(EV.imp2,0.9,0.6,'255,220,170');flash(EV.cme3,0.5,0.4,'255,230,250');flash(EV.imp4,1,1.0,'255,250,235');flash(EV.spit5,1,0.5);flash(EV.splash,0.35,0.2,'255,200,140');
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
let LASTVP_BG=null,SUNPOS=[0,0,0],BHPOS=[0,0,0];
// capture bg VP + positions
const _renderGL=renderGL;
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function updBG(t){const tt=t>=EV.loop?t-EV.loop:t;const c=camAt(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);LASTVP_BG=M4.mul(M4.persp(0.95,W/H,4,4e5),M4.look(be,V.add(be,fd),[0,1,0]));
  const dir=V.norm([c.at[0]-c.eye[0],0,c.at[2]-c.eye[2]]);const side=[dir[2],0,-dir[0]];const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];SUNPOS=V.add(P(1e5,-9000),[0,13000,0]);BHPOS=V.add(P(9000,1500),[0,1600,0])}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);const slow=t0>=EV.drop0&&t0<EV.splash;
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);updBG(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
