// ROMAN LEGION vs DYING ANT (Part 2)
const FPS=30,DUR=65,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();buildPlanets();
// ---------- timeline ----------
const R=[3.6,11.2,19.0,26.8,34.6,42.6,50.4,60.4];
const EV={stomp1:7.7,lift1:8.5,pop1:9.0,army0:11.2,stompA:14.4,stompB:16.8,tst0:19.0,cat0:26.8,umb:27.9,caes0:34.6,thumb:37.4,stab0:39.4,clang:40.0,emp0:42.6,drop0:53.4,splash:55.6,endc:60.4,loop:64.4};
const ROUNDS=[['ROUND 1','1 Roman soldier ⚔️','…he got back up 🐜',9.5],['ROUND 2','100 Roman soldiers 🛡️','Not even a scratch 💅',17.1],['ROUND 3','Testudo formation 🐢','He\'s having a picnic 🍞',24.9],['ROUND 4','Flaming catapults 🔥','Same trick again ☂️',30.3],['ROUND 5','Julius Caesar himself 👑','PARRIED 😎🗡️',40.2],['ROUND 6','The ENTIRE Roman Empire 🏛️','He just walked through 🚶',46.6],['FINAL ROUND','One grape 🍇','Cause of death: grape 💀',56.2]];
function roundAt(t){for(let i=6;i>=0;i--)if(t>=R[i])return i;return -1}
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
function blob(mb,c,r,colFn,seed,sq,res,mat){const la=res?res[0]:9,lo=res?res[1]:14;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];const n=1+0.32*(vnoise(d[0]*2.2+seed*7.3,d[1]*2.2+d[2]*1.7+seed)-0.5);return[c[0]+d[0]*r*n,c[1]+d[1]*r*n*(sq||1),c[2]+d[2]*r*n]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
function segM(a,b,r){const y=V.sub(b,a);const L=V.len(y)||1e-6;const yn=V.sc(y,1/L);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);const mid=V.sc(V.add(a,b),0.5);
  return new Float32Array([x[0]*r,x[1]*r,x[2]*r,0,y[0],y[1],y[2],0,z[0]*r,z[1]*r,z[2]*r,0,mid[0],mid[1],mid[2],1])}
function tube(m,a,b,r0,r1,col,seg,mat){seg=seg||10;const y=V.sub(b,a);const yn=V.norm(y);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);
  const ring=(c,r)=>{const o=[];for(let i=0;i<seg;i++){const ang=i/seg*TAU2;o.push(V.add(c,V.add(V.sc(x,Math.cos(ang)*r),V.sc(z,Math.sin(ang)*r))))}return o};const A=ring(a,r0),B=ring(b,r1);for(let i=0;i<seg;i++){const j=(i+1)%seg;m.quad(A[i],A[j],B[j],B[i],col,mat)}}
const lerp3=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const S=47; // soldier scale (meters -> world)
const RC={tunic:hx('#b3262a'),steel:hx('#aab0b8'),steel2:hx('#6c727c'),skin:hx('#d9a27c'),leather:hx('#6a4228'),sandal:hx('#5a3820'),crest:hx('#d82020'),shield:hx('#a8201c'),gold:hx('#e6b84a'),wood:hx('#8a6a40'),dark:[0.08,0.06,0.06]};
const CC={cape:hx('#6a2088'),armor:hx('#e0b040'),armor2:hx('#a87a20'),laurel:hx('#4a9a2a'),hair:hx('#7a6a5a'),toga:hx('#f2eee2')};
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.52,0.42],[0.76,0.68,0.58],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const AST=um(m=>blob(m,[0,0,0],1,p=>mix3([0.42,0.38,0.34],[0.62,0.56,0.5],vnoise(p[0]*3,p[2]*3+p[1])),5,0.9,[12,18]),0.3);
const CRUMB=um(m=>blob(m,[0,0,0],1,p=>mix3([0.85,0.6,0.3],[0.98,0.86,0.6],clamp(p[1]+0.5,0,1)),9,0.8,[10,14]),0.4);
const LEAF=um(m=>{const n=10;for(let i=0;i<n;i++){const z0=-1+2*i/n,z1=-1+2*(i+1)/n;const w0=Math.sin((i/n)*Math.PI)*0.6,w1=Math.sin(((i+1)/n)*Math.PI)*0.6;const c0=0.12*Math.sin(i/n*Math.PI),c1=0.12*Math.sin((i+1)/n*Math.PI);const g=hx('#4fae3a'),g2=hx('#2f8a2a');m.quad([-w0,-c0*0.5,z0],[0,c0,z0],[0,c1,z1],[-w1,-c1*0.5,z1],[g,g2,g2,g]);m.quad([0,c0,z0],[w0,-c0*0.5,z0],[w1,-c1*0.5,z1],[0,c1,z1],[g2,g,g,g2])}},0.3);
const GRAPE=um(m=>{m.ico([0,0,0],1,hx('#6a2c86'),0,1.08,[18,24]);m.ico([0,1.0,0],0.12,hx('#5a4a2a'),0,1,[5,8]);tube(m,[0,1.0,0],[0.08,1.5,0.05],0.06,0.04,hx('#6a5a30'),6)},0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;const w=1+0.12*Math.sin(i*1.9);m.tri([0,0,0],[Math.cos(b)*w,0,Math.sin(b)*w],[Math.cos(a)*w,0,Math.sin(a)*w],[1,1,1])}});
// ---------- background world (meters) ----------
let BGG;{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#9aa860'));const r=rngG(77);
  for(let i=0;i<300;i++){const a=r()*TAU2,d=400+r()*3500;const x=Math.cos(a)*d,z=Math.sin(a)*d;const k=r();
    if(k<0.55){const h=10+r()*8;m.prism([x,0,z],0.4,0.3,2,5,hx('#5a4030'));m.ico([x,h*0.55,z],h*0.13,hx(r()<0.5?'#2e5a2a':'#355f2e'),0,3.6,[7,8])}
    else if(k<0.85){const h=8+r()*5;m.prism([x,0,z],0.35,0.28,h,5,hx('#6a4a32'));m.ico([x,h,z],h*0.42,hx('#4a7a34'),0,0.32,[6,10])}
    else tree(m,x,z,4+r()*4,0,'')}
  BGG=m.build(0.5)}
let COLOS;{const m=new MB();const seg=72,Ro=90,Ri=70,th=12;const stone=hx('#dcc8a2'),stone2=hx('#c6b08a'),dark=hx('#4a3a2c');const lims=[1,1,0.82,0.6];const P=(ang,r,y)=>[Math.cos(ang)*r,y,Math.sin(ang)*r];
  for(let k=0;k<4;k++){const y0=k*th;const nl=k<3?lims[k+1]:0;
    for(let i=0;i<Math.round(seg*lims[k]);i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;
      m.quad(P(a,Ro,y0),P(b,Ro,y0),P(b,Ro,y0+th),P(a,Ro,y0+th),k%2?stone2:stone);m.quad(P(a,Ri,y0),P(a,Ri,y0+th),P(b,Ri,y0+th),P(b,Ri,y0),stone2);
      if(i>=Math.round(seg*nl))m.quad(P(a,Ri,y0+th),P(a,Ro,y0+th),P(b,Ro,y0+th),P(b,Ri,y0+th),stone2);
      const a1=a+(b-a)*0.2,b1=a+(b-a)*0.8,r=Ro+0.2;const ht=k<3?0.7:0.45;m.quad(P(a1,r,y0+th*0.12),P(b1,r,y0+th*0.12),P(b1,r,y0+th*ht),P(a1,r,y0+th*ht),dark);if(k<3)m.tri(P(a1,r,y0+th*ht),P(b1,r,y0+th*ht),P((a1+b1)/2,r,y0+th*0.84),dark)}}
  m.quad([-Ri,0.3,-Ri],[-Ri,0.3,Ri],[Ri,0.3,Ri],[Ri,0.3,-Ri],hx('#c8b080'));COLOS=m.build()}
// ---------- road tile (world units) ----------
function buildTile(){const T=200,m=new MB();const r=rngG(4);
  ground(m,-60,-T,60,0,null,0,10,(x,z)=>{const n=0.55+0.08*fbm(x*0.04+3,z*0.04,3)+0.04*(hsh(x*3|0,z*3|0)-0.5);return[n*1.05,n*0.9,n*0.68]});
  const sw=1.7;for(let zi=0;zi<Math.round(T/sw);zi++){const off=(zi%2)*sw*0.5;for(let xi=-10;xi<=10;xi++){const x=xi*sw+off;if(Math.abs(x)>15.5)continue;const z=-zi*sw-sw/2;const j=hsh(xi+40,zi);const g=0.36+0.14*j+0.05*hsh(xi+3,zi*5);const c=[g*1.08,g*1.0,g*0.88];
      m.box([x+(hsh(xi,zi+7)-0.5)*0.25,0.05,z+(hsh(xi+9,zi)-0.5)*0.25],[sw*(0.8+0.1*hsh(xi,zi+11)),0.14+j*0.08,sw*(0.8+0.1*hsh(xi+5,zi))],c,0,(hsh(xi,zi+3)-0.5)*0.2,[c[0]*1.08,c[1]*1.08,c[2]*1.06])}}
  for(const s of[-1,1])for(let z=0;z<T;z+=4.2)m.box([s*17.2,0.18,-z-2.1],[1.4,0.4,4.0],[0.6,0.56,0.5]);
  for(const s of[-1,1])ground(m,s>0?61:-400,-T,s>0?400:-61,0,null,-0.3,20,(x,z)=>{const q=fbm(x*0.03,z*0.03+s*9,3);return[0.4+q*0.12,0.52+q*0.12,0.22]});
  for(let i=0;i<900;i++){const s=r()<0.5?-1:1;const x=s*(61+Math.pow(r(),1.6)*330),z=-r()*T;let h=(3+r()*8)*(1+(Math.abs(x)-60)/140);const yaw=r()*TAU2,w=0.35+r()*0.35,lx=(r()-0.5)*h*0.5,lz=(r()-0.5)*h*0.5;
    const b0=[x+Math.cos(yaw)*w,-0.3,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,-0.3,z-Math.sin(yaw)*w],md=[x+lx*0.3,h*0.55,z+lz*0.3],tip=[x+lx,h,z+lz];const mw=[Math.cos(yaw)*w*0.6,0,Math.sin(yaw)*w*0.6];
    const cb=hx(r()<0.5?'#5a6a22':'#6a7a2a'),cm=hx('#8aa03a'),ct=hx(r()<0.5?'#c8c060':'#b8c870');m.quad(b0,b1,V.sub(md,mw),V.add(md,mw),[cb,cb,cm,cm]);m.tri(V.add(md,mw),V.sub(md,mw),tip,[cm,cm,ct])}
  for(let i=0;i<120;i++){const s=r()<0.5?-1:1;const x=s*(19+r()*40),z=-r()*T,h=1+r()*3;const c=hx(r()<0.5?'#7a8a2a':'#9a9a40');m.tri([x-0.3,0,z],[x+0.3,0,z],[x+(r()-0.5),h,z],c);m.tri([x,0,z-0.3],[x,0,z+0.3],[x+(r()-0.5),h*0.8,z],c)}
  for(let i=0;i<26;i++){const x=(r()<0.5?-1:1)*(19+r()*40),z=-r()*T,s=0.2+r()*0.7;m.ico([x,0,z],s,hx(['#8a8278','#9a8a7a','#6a645e','#b0a898'][i%4]),0,0.6,[6,9])}
  return{mesh:m.build(0.45),T}}
const TILE=buildTile();
// ---------- roman soldiers ----------
function bakeLegs(m,x,z,st){const k=S;for(const sx of[-1,1]){const fz=z-sx*st*0.2*k;const ft=[x+sx*0.1*k,0,fz];const ank=[ft[0],0.07*k,fz],hip=[x+sx*0.1*k,0.92*k,z];
    tube(m,ank,hip,0.058*k,0.078*k,RC.skin,8);m.box([ft[0],0.0125*k,fz-0.05*k],[0.11*k,0.025*k,0.27*k],RC.sandal);m.ico([ft[0],0.045*k,fz-0.07*k],0.055*k,RC.skin,0,0.65,[5,8]);
    for(const f of[0.04,0.13,0.22,0.31]){const a=lerp3(ank,hip,f),b=lerp3(ank,hip,f+0.025);tube(m,a,b,0.066*k,0.066*k,RC.sandal,8)}}
  tube(m,[x,0.7*k,z],[x,1.0*k,z],0.21*k,0.18*k,RC.tunic,10)}
function bakeRoman(m,x,z,st){const k=S,Y=v=>v*k;bakeLegs(m,x,z,st);
  tube(m,[x,Y(0.98),z],[x,Y(1.42),z],Y(0.18),Y(0.205),RC.steel,10);for(const yy of[1.06,1.17,1.28])tube(m,[x,Y(yy),z],[x,Y(yy+0.035),z],Y(0.19),Y(0.195),RC.steel2,10);
  m.ico([x,Y(1.42),z],Y(0.215),RC.steel,0,0.45,[6,10]);m.ico([x,Y(1.62),z],Y(0.11),RC.skin,0,1.1,[7,10]);m.ico([x,Y(1.685),z+Y(0.008)],Y(0.123),RC.steel,0,0.8,[7,10]);
  m.box([x,Y(1.82),z],[Y(0.035),Y(0.08),Y(0.22)],RC.crest);for(const s of[-1,1])m.ico([x+s*Y(0.04),Y(1.63),z-Y(0.1)],Y(0.014),RC.dark,0,1,[4,6]);
  m.box([x+Y(0.2),Y(1.02),z-Y(0.25)],[Y(0.5),Y(0.86),Y(0.05)],RC.shield);m.ico([x+Y(0.2),Y(1.02),z-Y(0.28)],Y(0.065),RC.gold,0,0.6,[5,8]);for(const yy of[0.62,1.42])m.box([x+Y(0.2),Y(yy),z-Y(0.28)],[Y(0.5),Y(0.035),Y(0.01)],RC.gold);m.box([x+Y(0.2),Y(1.02),z-Y(0.28)],[Y(0.035),Y(0.86),Y(0.01)],RC.gold);
  tube(m,[x-Y(0.22),Y(1.4),z],[x-Y(0.27),Y(1.12),z-Y(0.04)],Y(0.055),Y(0.05),RC.skin,7);tube(m,[x-Y(0.27),Y(1.12),z-Y(0.04)],[x-Y(0.28),Y(1.08),z-Y(0.22)],Y(0.05),Y(0.045),RC.skin,7);
  tube(m,[x-Y(0.28),Y(0.1),z-Y(0.24)],[x-Y(0.28),Y(2.2),z-Y(0.24)],Y(0.014),Y(0.014),RC.wood,6);tube(m,[x-Y(0.28),Y(2.2),z-Y(0.24)],[x-Y(0.28),Y(2.45),z-Y(0.24)],Y(0.02),Y(0.001),RC.steel,6)}
function buildArmy(cols,rows,dx,dz,st){const A=new MB(),B=new MB();for(let j=0;j<rows;j++)for(const x of cols){const p=((Math.round(x)+j)&1)?1:-1;const jx=(hsh(x|0,j)-0.5)*3,jz=(hsh(j,x|0)-0.5)*4;bakeRoman(A,x+jx,j*dz+jz,p);bakeRoman(B,x+jx,j*dz+jz,-p)}return[A.build(0.5),B.build(0.5)]}
const ARMY=buildArmy([-117,-91,-65,-39,-13,13,39,65,91,117],10,26,30);
const EMPA=buildArmy([-134,-108,-82,-56,-30,30,56,82,108,134],8,26,30);
// testudo
let TST,TSTL;{const m=new MB();const sh=(c,w,h,ax,sg)=>{const r=(hsh(c[0]*3|0,c[1]*7+c[2]|0)-0.5);
    if(ax==='z'){m.box(c,[w*0.96,h*0.96,1.4],RC.shield,0,r*0.06);m.ico([c[0],c[1],c[2]+sg*0.9],1.9,RC.gold,0,0.6,[6,8]);m.box([c[0],c[1],c[2]+sg*0.75],[0.9,h*0.9,0.2],RC.gold);for(const d of[-1,1])m.box([c[0],c[1]+d*(h*0.45),c[2]+sg*0.75],[w*0.94,0.8,0.2],RC.gold)}
    else if(ax==='x'){m.box(c,[1.4,h*0.96,w*0.96],RC.shield,0,r*0.06);m.ico([c[0]+sg*0.9,c[1],c[2]],1.9,RC.gold,0,0.6,[6,8]);m.box([c[0]+sg*0.75,c[1],c[2]],[0.2,h*0.9,0.9],RC.gold);for(const d of[-1,1])m.box([c[0]+sg*0.75,c[1]+d*(h*0.45),c[2]],[0.2,0.8,w*0.94],RC.gold)}
    else{m.box(c,[w*0.96,1.4,h*0.96],RC.shield);m.ico([c[0],c[1]+0.9,c[2]],1.9,RC.gold,0,0.6,[6,8]);m.box([c[0],c[1]+0.75,c[2]],[0.9,0.2,h*0.9],RC.gold)}};
  for(let i=0;i<6;i++)for(let rr=0;rr<3;rr++){const x=-37.5+15*i,y=20+24*rr;sh([x,y,0],15,24,'z',-1);sh([x,y,80],15,24,'z',1)}
  for(let i=0;i<5;i++)for(let rr=0;rr<3;rr++){const z=8+16*i,y=20+24*rr;sh([-45.5,y,z],16,24,'x',-1);sh([45.5,y,z],16,24,'x',1)}
  for(let i=0;i<6;i++)for(let j=0;j<5;j++)sh([-37.5+15*i,81+(hsh(i,j)-0.5)*1.5,8+16*j],15,16,'y',1);
  TST=m.build();
  const A=new MB(),B=new MB();for(const x of[-37.5,-22.5,-7.5,7.5,22.5,37.5])for(const z of[8,24,40,56,72]){const p=((x>0?1:0)+(z/16|0))&1?1:-1;bakeLegs(A,x,z,p);bakeLegs(B,x,z,-p)}TSTL=[A.build(0.5),B.build(0.5)]}
// articulated roman (hero soldier / caesar)
function romanItems(base,phase,o){o=o||{};const items=[];const cz=!!o.caesar;const B=M4.trs(base,o.yaw==null?Math.PI:o.yaw,o.lean||0,0,o.s||S);const amp=o.amp==null?1:o.amp;
  const put=(M,mesh,off,s,col,ns,rot)=>{items.push({mesh,M:M4.mul(M,M4.trs(off,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint:col,tintAmt:1,noShadow:!!ns})};const J=(M,t,rx,rz)=>M4.mul(M,M4.trs(t,0,rx||0,rz||0,1));
  const hipY=0.94,Lt=0.44,Ls=0.44;const P=J(B,[0,hipY+0.03*amp*Math.abs(Math.cos(phase)),0],0.02);
  put(P,UCYL,[0,-0.1,0],[0.21,0.3,0.17],cz?CC.toga:RC.tunic);for(let i=0;i<12;i++){const a=i/12*TAU2;put(P,UB,[Math.sin(a)*0.205,-0.13,Math.cos(a)*0.165],[0.05,0.22,0.012],cz?CC.armor2:RC.leather,1,[a,0,0])}
  put(P,UCYL,[0,0.05,0],[0.19,0.05,0.15],cz?CC.armor2:RC.leather);
  const Tq=J(P,[0,0.05,0],-0.04);put(Tq,UCYL,[0,0.24,0],[0.168,0.44,0.125],cz?CC.armor:RC.steel);
  if(!cz){for(let i=0;i<4;i++)put(Tq,UCYL,[0,0.07+i*0.085,0],[0.176,0.03,0.132],RC.steel2,1)}else{put(Tq,UB,[0,0.3,0.12],[0.16,0.2,0.02],CC.armor2,1);put(Tq,UB,[0,0.2,-0.17],[0.4,0.9,0.025],CC.cape,0,[0,0.1,0]);}
  put(Tq,USPH,[0,0.46,0],[0.215,0.09,0.135],cz?CC.armor:RC.steel);for(const sx of[-1,1])put(Tq,USPH,[sx*0.2,0.44,0],[0.095,0.06,0.1],cz?CC.armor2:RC.steel2,1);
  const Hd=J(Tq,[0,0.52,0],0.02+(o.head||0),o.headRoll||0);put(Hd,UCYL,[0,0.04,0],[0.05,0.08,0.05],RC.skin);put(Hd,USPH,[0,0.17,0.01],[0.105,0.125,0.11],RC.skin);
  for(const sx of[-1,1]){put(Hd,USPH,[sx*0.04,0.18,0.098],[0.016,0.02,0.01],RC.dark,1);put(Hd,UB,[sx*0.042,0.212,0.1],[0.04,0.01,0.01],cz?CC.hair:RC.dark,1,[0,0,sx*(o.shock?-0.25:0.3)])}
  put(Hd,USPH,[0,0.15,0.115],[0.018,0.03,0.025],mix3(RC.skin,[0.6,0.3,0.3],0.2),1);put(Hd,USPH,[0,0.105,0.105],[o.shock?0.025:0.035,o.shock?0.03:0.008,0.01],[0.3,0.08,0.08],1);
  if(!cz){put(Hd,USPH,[0,0.23,-0.005],[0.123,0.105,0.126],RC.steel);put(Hd,UB,[0,0.15,-0.115],[0.22,0.03,0.07],RC.steel,1,[0,-0.5,0]);for(const sx of[-1,1])put(Hd,UB,[sx*0.108,0.12,0.04],[0.015,0.11,0.07],RC.steel,1);put(Hd,UB,[0,0.335,0],[0.025,0.03,0.04],RC.steel2,1);put(Hd,UB,[0,0.37,0],[0.035,0.075,0.24],RC.crest,1)}
  else{put(Hd,USPH,[0,0.215,-0.015],[0.112,0.08,0.113],CC.hair,1);for(let i=0;i<16;i++){const a=i/16*TAU2;if(Math.sin(a)>0.75)continue;put(Hd,USPH,[Math.cos(a)*0.112,0.24-0.02*Math.sin(a),Math.sin(a)*0.112-0.01],[0.03,0.016,0.02],CC.laurel,1,[a,0,0.4])}}
  for(const sx of[-1,1]){const p=phase+(sx>0?Math.PI:0);const th=-0.42*amp*Math.sin(p);const kn=0.08+0.55*amp*Math.max(0,Math.cos(p+0.4));
    const Hp=J(P,[sx*0.095,0,0],th);put(Hp,UCYL,[0,-Lt*0.5,0],[0.072,Lt,0.075],RC.skin);const K=J(Hp,[0,-Lt,0],kn);put(K,USPH,[0,0,0],[0.068,0.068,0.068],RC.skin);put(K,UCYL,[0,-Ls/2,0],[0.06,Ls,0.062],RC.skin);
    for(const f of[0.55,0.68,0.81])put(K,UCYL,[0,-Ls*f,0],[0.066,0.016,0.068],RC.sandal,1);
    const A=J(K,[0,-Ls,0],-kn*0.5-th*0.3);put(A,USPH,[0,-0.035,0.06],[0.055,0.04,0.12],RC.skin);put(A,UB,[0,-0.07,0.05],[0.115,0.026,0.27],RC.sandal);put(A,UB,[0,-0.03,0.07],[0.12,0.02,0.03],RC.sandal,1)}
  for(const sx of[-1,1]){const p=phase+(sx>0?0:Math.PI);const R_=sx<0;
    const sh=R_&&o.armR!=null?o.armR:(!R_&&o.armL!=null?o.armL:0.38*amp*Math.sin(p));const ao=R_&&o.outR!=null?o.outR:(!R_&&o.outL!=null?o.outL:0.1);const el=R_&&o.elR!=null?o.elR:(!R_&&o.elL!=null?o.elL:-0.35);
    const Sx=J(Tq,[sx*0.21,0.43,0],sh,sx*ao);put(Sx,USPH,[0,0,0],[0.07,0.07,0.07],cz?CC.armor:RC.tunic);put(Sx,UCYL,[0,-0.14,0],[0.056,0.28,0.056],RC.skin);
    const E=J(Sx,[0,-0.28,0],el);put(E,USPH,[0,0,0],[0.052,0.052,0.052],RC.skin);put(E,UCYL,[0,-0.12,0],[0.048,0.24,0.048],RC.skin);put(E,USPH,[0,-0.27,0],[0.05,0.055,0.055],RC.skin);
    if(R_&&o.thumb)put(E,UCYL,[0,-0.27,-0.09],[0.028,0.12,0.028],RC.skin,1,[0,Math.PI/2,0]);
    if(R_&&o.spear){put(E,UCYL,[0,-0.28,0],[0.014,2.1,0.014],RC.wood,0,[0,Math.PI/2,0]);put(E,UCYL,[0,-0.28,-1.15],[0.02,0.25,0.02],RC.steel,1,[0,Math.PI/2,0])}}
  if(!cz&&o.shield!==false){put(Tq,UB,[0.2,0.05,0.24],[0.5,0.86,0.05],RC.shield);put(Tq,USPH,[0.2,0.05,0.27],[0.065,0.065,0.04],RC.gold,1);for(const yy of[-0.37,0.47])put(Tq,UB,[0.2,yy,0.268],[0.5,0.035,0.01],RC.gold,1);put(Tq,UB,[0.2,0.05,0.268],[0.035,0.86,0.01],RC.gold,1)}
  return items}
// giant stomping leg (world units)
function stompLeg(items,pos,yaw){const M=M4.trs(pos,yaw==null?Math.PI:yaw,0,0,S);const put=(off,mesh,s,col,rot)=>items.push({mesh,M:M4.mul(M,M4.trs(off,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint:col,tintAmt:1});
  put([0,0.0125,0.05],UB,[0.115,0.026,0.28],RC.sandal);put([0,0.045,0.07],USPH,[0.056,0.04,0.125],RC.skin);for(let i=0;i<4;i++)put([-0.036+i*0.024,0.03,0.18],USPH,[0.013,0.014,0.018],RC.skin);
  put([0,0.05,0.1],UB,[0.12,0.02,0.03],RC.sandal);put([0,0.06,0.02],UB,[0.12,0.02,0.03],RC.sandal);put([0,0.08,0],USPH,[0.06,0.05,0.065],RC.skin);
  put([0,0.36,0],UCYL,[0.06,0.6,0.063],RC.skin);for(const y of[0.12,0.2,0.28,0.36])put([0,y,0],UCYL,[0.066,0.016,0.068],RC.sandal);put([0,0.66,0],USPH,[0.07,0.07,0.07],RC.skin);put([0,0.9,0],UCYL,[0.078,0.5,0.08],RC.skin);put([0,1.15,0],UCYL,[0.2,0.3,0.17],RC.tunic)}
function swordItems(items,tip,rz){const M=M4.trs(tip,0.35,0,rz||0,1);const put=(off,mesh,s,col,ns)=>items.push({mesh,M:M4.mul(M,M4.trs(off,0,0,0,s)),tint:col,tintAmt:1,noShadow:!!ns});
  put([0,17,0],UB,[2.6,28,0.35],RC.steel);put([0,18,0],UB,[0.5,24,0.42],RC.steel2,1);put([0,2.4,0],USPH,[1.3,2.6,0.17],RC.steel);put([0,31.6,0],UB,[6.5,1.3,1.8],RC.gold);put([0,35.5,0],UCYL,[0.85,6.5,0.85],RC.leather);put([0,39.4,0],USPH,[1.5,1.3,1.5],RC.gold)}
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
  if(pose==='umb'&&hands){const top=[0.06,1.8,-0.12];it.push({mesh:UCYL,M:M4.mul(B,segM(hands,top,0.02)),tint:hx('#3a7a2a'),tintAmt:1});it.push({mesh:LEAF,M:M4.mul(B,M4.trs(V.add(top,[0,0.02,0]),0.4,0.12+0.05*Math.sin((o.t||0)*3),0.08,[1.0,1.0,1.25])),tint:null,tintAmt:0})}
  if(pose==='parry'){const g0=[0.24,0.12,-0.46],top=[0.04,1.52,-0.56];it.push({mesh:UCYL,M:M4.mul(B,segM(g0,top,0.03)),tint:AC.wood,tintAmt:1});P(B,USPH,top,[0.055,0.065,0.055],AC.match)}
  if(pose==='sit'){const cb=M4.mul(B,M4.trs([0,0.47,-0.62],(o.t||0)*0.3,0.3,0,[0.14,0.12,0.12]));it.push({mesh:CRUMB,M:cb})}
  if(ck>=0&&ck<1.4){for(let i=0;i<4;i++){const k=ck-i*0.06;if(k<0)continue;const p=[Math.sin(i*2)*0.05+0.0,0.42+k*0.25,-0.62-k*0.55];const s=0.05+k*0.14;it.push({mesh:USPH,M:M4.mul(Rm,M4.trs(p,0,0,0,s)),tint:[0.55,0.52,0.5],tintAmt:1,alpha:Math.max(0,0.55*(1-k/1.4)),noShadow:true})}}
  if(o.dizzy){for(let i=0;i<4;i++){const a=(o.t||0)*5+i/4*TAU2;it.push({mesh:UEMIS,M:M4.mul(Rm,M4.trs([Math.cos(a)*0.28,0.95+0.04*Math.sin(a*2),-0.3+Math.sin(a)*0.28],a,0.5,0,0.045)),tint:[1,0.9,0.3],tintAmt:1,noShadow:true})}}
  return it}
// ---------- motion helpers ----------
const STOMPS=[];{const r=rngG(11);for(let i=0;i<13;i++){let x,z;do{x=(r()-0.5)*16;z=3+r()*15}while(Math.abs(x)<3.6&&z<6);STOMPS.push({t:EV.stompA+i*0.18,x,z,yaw:(r()-0.5)*0.5})}STOMPS.splice(5,0,{t:EV.stompA+0.85,x:3.5,z:-1.5,yaw:0.1})}
const CATS=[{t:28.4,p:[-40,0,140]},{t:28.9,p:[35,0,90]},{t:29.5,p:[-14,0,60]},{t:30.1,p:[55,0,200]},{t:30.7,p:[-60,0,110]},{t:31.3,p:[20,0,48]},{t:32.0,p:[-25,0,260]},{t:32.7,p:[42,0,150]},{t:33.4,p:[-8,0,100]}];
const EMPCATS=[{t:43.6,p:[-90,0,420]},{t:44.7,p:[80,0,500]},{t:45.9,p:[-40,0,620]},{t:47.1,p:[60,0,380]},{t:48.4,p:[-100,0,520]},{t:49.5,p:[30,0,650]}];
const FLY=2.0;
function legY(t,t0){const k=t-t0;if(k<-0.14)return null;if(k<0)return 42*Math.pow(-k/0.14,1.5);if(k<0.28)return 0;if(k<0.62)return 42*easeIn((k-0.28)/0.34);return null}
function hero1Z(t){if(t<R[0])return 400;return Math.max(26,240-68*(t-R[0]))}
function armyZ(t){return Math.max(70,520-150*(t-R[1]))}
function tstZ(t){const k=t-EV.tst0;if(k<3.6)return 420-105*k;return 42-30*(k-3.6)}
function underK(t){if(t<EV.tst0||t>=R[3])return 0;const zf=tstZ(t),zb=zf+80;return clamp((-6-zf)/8,0,1)*clamp((zb+6)/8,0,1)}
function caesarZ(t){return Math.max(42,300-110*(t-R[4]))}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff0d6'),sky:hx('#a8c8ea'),gnd:hx('#a09070'),fog:hx('#e6dcc8'),fogD:5000,zen:hx('#3f7fd6'),hor:hx('#f0dcc0'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#e6dcc8')},o||{})}
function envAt(t){let e=envBase();const rn=roundAt(t);
  if(rn===3){const k=clamp((t-28.2)/1.2,0,1)*clamp((R[4]-t)/0.8,0,1);e.fog=mix3(e.fog,hx('#c89070'),k*0.6);e.hor=mix3(e.hor,hx('#e8a070'),k*0.6);e.sky=mix3(e.sky,hx('#c0a090'),k*0.5);e.sunCol=mix3(e.sunCol,hx('#ffc890'),k*0.5)}
  if(rn===5){e.hor=mix3(e.hor,hx('#f0c090'),0.5);e.fog=mix3(e.fog,hx('#e0c8a8'),0.5)}
  const u=underK(t);if(u>0){e.sunCol=mix3(e.sunCol,[0.1,0.05,0.03],u);e.sky=mix3(e.sky,hx('#9a4a3a'),u);e.gnd=mix3(e.gnd,hx('#6a3424'),u);e.fog=mix3(e.fog,hx('#2a120e'),u);e.hor=mix3(e.hor,hx('#3a1a14'),u);e.zen=mix3(e.zen,hx('#1a0808'),u)}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.4-k*0.3,0.9,-3.3-k*0.3];at=[0,0.6+k*0.4,0.3]}
  if(rn===0){if(t<7.25||t>=9.7){eye=[1+sway*0.4,1.2,-7.5];at=[-2.7,6.5,20];if(t>=9.7){eye=[0.9+sway*0.4,1.3,-6.5];at=[-2.6,5.5,20]}}else{eye=[5,4.5,-14];at=[0,2.2,1]}}
  if(rn===1){if(t<EV.stompA-0.05){eye=[-1+sway*0.4,1.4,-8.5];at=[3.5,7,30]}else{eye=[2.4,1.9,-6.6];at=[-0.9,1.3,2.5];if(t>=EV.stompB){const k=ease((t-EV.stompB)/1.2);eye=[lerp(2.4,1.6,k),lerp(1.9,1.0,k),lerp(-6.6,-3.9,k)];at=[lerp(-0.9,0,k),lerp(1.3,0.75,k),lerp(2.5,0.4,k)]}}}
  if(rn===2){eye=[1.2+sway*0.4,1.3,-6.5];at=[-3.4,5,20];if(t>=23.2){const k=ease((t-23.2)/1.5);eye=[lerp(1.2,1.2,k),lerp(1.3,1.1,k),lerp(-6.5,-4.4,k)];at=[lerp(-3.4,-1.1,k),lerp(5,1.4,k),lerp(20,4,k)]}}
  if(rn===3){if(t<28.6){eye=[1+sway*0.4,1.1,-7];at=[-5.7,6,40]}else{eye=[1.8+sway*0.5,0.8,-4.6];at=[0,1.5,0.4]}}
  if(rn===4){if(t<37.2){eye=[1+sway*0.4,1.0,-7.5];at=[-5.3,9,40]}else if(t<EV.stab0||t>=41.6){eye=[1.5,0.6,-3];at=[0,70,42];if(t>=41.6){eye=[1.2,0.6,-3.2]}}else{eye=[2.4,1.5,-5.6];at=[0,1.6,0]}}
  if(rn===5){if(t<46.0){eye=[-1+sway*0.4,1.3,-8];at=[5,7,40]}else{eye=[1.6+sway*0.5,0.95,-4.1];at=[-0.8,1.1,2]}}
  if(rn===6){const k=ease((t-R[6])/2.5);eye=[lerp(1.7,1.2,k),0.95,lerp(-3.8,-2.9,k)];at=[0,0.55,0.2];if(t>=EV.drop0-0.4){const kk=ease((t-EV.drop0+0.4)/0.8);eye=[lerp(1.2,1.6,kk),lerp(0.95,0.6,kk),lerp(-2.9,-3.3,kk)];at=[0,lerp(0.55,1.6,kk)-ease((t-EV.splash+0.6)/0.6)*1.1,0]}}
  if(t>=R[7])eye=[1.4,1.0,-3.2],at=[0,0.4,0];
  return{eye,at}}
// ---------- background ----------
function bgItems(t){const items=[{mesh:BGG}];const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];items.push({mesh:COLOS,M:M4.trs(P(900,-330),0.3,0,0,1.25)});return{items}}
// ---------- explosions ----------
function impact(items,p,k,s){if(k<0)return;
  if(k<1.0){const r=s*(0.4+0.9*easeOut(k/0.25));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.4,0.1],clamp(k/0.8,0,1)),tintAmt:1,alpha:clamp(1-k,0,1),add:1,noShadow:true})}
  if(k<4.5){const rr=s*(0.6+2.0*easeOut(k/1.2));items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[rr,s*0.4*(1+k*0.3),rr]),alpha:clamp(1-(k-2)/2.5,0,1)});
    for(let i=0;i<4;i++){const a=i*1.3;const q=[p[0]+Math.cos(a)*s*0.5,p[1]+s*(0.8+k*1.6)+i*s*0.4,p[2]+Math.sin(a)*s*0.5];items.push({mesh:USPH,M:M4.trs(q,0,0,0,s*(0.4+k*0.25)),tint:[0.36,0.33,0.31],tintAmt:1,alpha:clamp(0.8-k/4.5,0,1),noShadow:true})}}
  if(k<7)items.push({mesh:AST,M:M4.trs([p[0],s*0.35,p[2]],1,0.5,0,s*0.55),tint:[1,0.45,0.15],tintAmt:clamp(0.6-k*0.1,0,0.6)})}
function boulder(items,c,t,s){const k=(t-(c.t-FLY))/FLY;if(k<0||k>=1)return;const st=[c.p[0]*0.35,30,1700];const cur=[lerp(st[0],c.p[0],k),lerp(st[1],s,k)+520*4*k*(1-k),lerp(st[2],c.p[2],k)];
  items.push({mesh:AST,M:M4.trs(cur,t*3,t*2,0,s),tint:[0.6,0.3,0.15],tintAmt:0.3});items.push({mesh:UEMIS,M:M4.trs(cur,0,0,0,s*1.3),tint:[1,0.55,0.15],tintAmt:1,alpha:0.55,add:1,noShadow:true});
  for(let i=1;i<10;i++){const kk=Math.max(0,k-i*0.022);const q=[lerp(st[0],c.p[0],kk),lerp(st[1],s,kk)+520*4*kk*(1-kk),lerp(st[2],c.p[2],kk)];items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,s*(1.2-i*0.08)),tint:mix3([1,0.8,0.3],[0.5,0.2,0.1],i/10),tintAmt:1,alpha:0.45*(1-i/10),add:1,noShadow:true})}}
// ---------- foreground ----------
let LASTVP=null;
function fgItems(t){const rn=roundAt(t);const items=[];const L=TILE;let pose='walk',walk=1,o={t};
  // ant state
  if(rn===0&&t>=EV.stomp1&&t<EV.pop1){pose='squash';walk=0;o.xeyes=true}
  if(rn===0&&t>=EV.pop1&&t<10.6){o.dizzy=true;o.lid=0;walk=t<9.7?0:1}
  if(rn===1&&t>=EV.stompA&&t<EV.stompB){o.flail=1;o.lid=0}
  if(rn===1&&t>=EV.stompB+0.1){pose='dust';walk=0}
  if(rn===2&&t>=23.5){pose='sit';walk=0}
  if(rn===3&&t>=EV.umb){pose='umb'}
  if(rn===4&&t>=39.1&&t<41.7){pose='parry';walk=0;o.lid=t<EV.clang?0.1:0.5}
  if(rn===5&&t>=44.2){o.glasses=easeOut((t-44.2)/0.5)}
  if(rn===6&&t>=EV.splash){pose='squash';walk=0;o.xeyes=true}
  if(t>=R[7]&&t<EV.loop){pose='squash';walk=0;o.xeyes=true}
  if(rn===6&&t<EV.drop0-0.8){o.lid=0.62}
  if(rn===6&&t>=EV.drop0-0.8&&t<EV.splash){o.lid=0.0;walk=t<EV.drop0?1:0.0}
  const dist=1.1*t;const o_=((dist%L.T)+L.T)%L.T;for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  const slow=rn===6&&t>=EV.drop0&&t<EV.splash+1.5;o.ph=t*(slow?1.2:5.2);o.walk=walk;o.pose=pose;
  const coughs=[2.0,10.2,EV.stompB+0.6,EV.clang+1.0];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;if(pose==='dust'&&t<EV.stompB+0.3)o.cough=-1;
  let Rm=M4.id();
  if(pose==='squash'){const t0=rn===0?EV.stomp1:EV.splash;const k=clamp((t-t0)/0.1,0,1);Rm=M4.trs([0,0,0],0,0,0,[lerp(1,1.35,k),lerp(1,0.24,k),lerp(1,1.15,k)])}
  if(rn===0&&t>=EV.pop1&&t<EV.pop1+0.7){const k=(t-EV.pop1)/0.7;const sy=1+0.45*Math.sin(k*Math.PI*2.5)*(1-k);Rm=M4.trs([0,Math.max(0,Math.sin(Math.min(1,k*1.6)*Math.PI))*0.9,0],0,0,0,[1/Math.sqrt(sy),sy,1/Math.sqrt(sy)])}
  items.push(...antItems(Rm,o));
  // ---- R1 soldier + stomp
  if(rn===0||(t>=R[0]-0.01&&t<R[1])){const z=hero1Z(t);const hide=t>=7.25&&t<9.7;if(!hide&&t>=R[0]){const moving=z>26.01;items.push(...romanItems([1.5,0,z],(240-z)/(S*0.3),{amp:moving?1:0,spear:true,armR:-0.5,elR:-1.1,head:t>=9.7?0.45:0}))}
    const y=legY(t,EV.stomp1);if(y!=null&&t<9.7)stompLeg(items,[0.2,y,-0.5],0);if(t>=EV.stomp1&&t<EV.stomp1+1.6){const k=t-EV.stomp1;if(k>0.15)items.push({mesh:DUSTRING,M:M4.trs([0.2,0,2.2],0,0,0,[4+6*easeOut(k/0.5),0.5+k*0.3,5+6*easeOut(k/0.5)]),alpha:clamp(1-k/1.6,0,1)*0.8})}}
  // title/R1: army far behind
  if(t<R[0]){items.push({mesh:ARMY[Math.floor(t*2.2)%2],M:M4.trs([0,0,900-12*t],0,0,0,1)})}
  // ---- R2 army + stomps
  if(rn===1){if(t<EV.stompA-0.05){const z=armyZ(t);items.push({mesh:ARMY[Math.floor(t*3.2)%2],M:M4.trs([0,0,z],0,0,0,1)})}
    else for(const s of STOMPS){const y=legY(t,s.t);if(y!=null)stompLeg(items,[s.x,y,s.z],s.yaw);const k=t-s.t;if(k>=0&&k<1.2)items.push({mesh:DUSTRING,M:M4.trs([s.x,0,s.z-2],0,0,0,[5+6*easeOut(k/0.4),0.6+k*0.4,6+6*easeOut(k/0.4)]),alpha:clamp(1-k/1.2,0,1)*0.8})}}
  // ---- R3 testudo
  if(rn===2){const zf=tstZ(t);const st=Math.floor(t*(zf>42?3.4:2.4))%2;items.push({mesh:TST,M:M4.trs([0,Math.abs(Math.sin(t*7))*0.6,zf],0,0,0,1)});items.push({mesh:TSTL[st],M:M4.trs([0,0,zf],0,0,0,1)})}
  // ---- R4 catapults
  if(rn===3){for(const c of CATS){boulder(items,c,t,8);impact(items,c.p,t-c.t,7)}
    if(t>=29.1){for(let i=0;i<16;i++){const t0=29.1+hsh(i,11)*3.6;const k=t-t0;if(k<0||k>2)continue;const onLeaf=i%3===0;const x0=onLeaf?(hsh(i,1)-0.5)*1.2:(hsh(i,1)-0.5)*30,z0=onLeaf?-0.2:(hsh(i,2)-0.4)*25;const yHit=onLeaf?2.0:0.2;const tf=0.5;let y,x=x0;if(k<tf){y=yHit+30*(1-k/tf)*(1-k/tf)+(1-k/tf)*8}else{const kb=k-tf;y=yHit+kb*(6-kb*14);x=x0+(onLeaf?(i%2?1:-1)*kb*5:0);if(y<0.2)y=0.2}
      items.push({mesh:ROCK[i%4],M:M4.trs([x,y,z0],k*4,k*3,0,onLeaf?0.22:0.3+hsh(i,5)*0.5),tint:[1,0.5,0.2],tintAmt:k<tf?0.6:0.15})}}}
  // ---- R5 caesar
  if(rn===4){const z=caesarZ(t);const stab=t>=EV.stab0&&t<41.6;
    if(!stab){const moving=z>42.01;const o2={caesar:true,amp:moving?1:0};if(t>=EV.thumb&&t<41.6){const k=ease((t-EV.thumb)/0.5);o2.armR=lerp(0,-0.85,k);o2.elR=lerp(-0.35,-0.1,k);o2.outR=lerp(0.1,0.7,k);o2.thumb=k>0.5;o2.head=-0.25*k}
      if(t>=41.6){const k=ease((t-41.6)/0.3);o2.lean=-0.12*k;o2.armR=-2.2*k;o2.armL=-2.2*k;o2.outR=0.5;o2.outL=0.5;o2.elR=-0.6;o2.elL=-0.6;o2.shock=true;o2.head=-0.2}
      items.push(...romanItems([0,0,z],(300-z)/(S*0.3),o2))}
    if(stab){let y;const k=t-EV.stab0;const hitK=EV.clang-EV.stab0;if(k<hitK-0.15)y=40+Math.sin(k*3)*2-k*4;else if(k<hitK)y=lerp(38,1.55,easeIn((k-hitK+0.15)/0.15));else{const kk=t-EV.clang;y=1.55+kk*(26-kk*14);if(kk>0.9)y=1.55+0.9*(26-0.9*14)+((kk-0.9)*30)}
      const wob=t>=EV.clang?Math.sin((t-EV.clang)*40)*0.15*Math.exp(-(t-EV.clang)*3):0;swordItems(items,[0.08+(t>=EV.clang?(t-EV.clang)*3:0),y,-0.56],0.12+wob)}}
  // ---- R6 empire
  if(rn===5){const off=-(t-R[5])*55;const st=Math.floor(t*3.2)%2;for(let n=-1;n<4;n++){const z0=((off%240)+240)%240+n*240-120;items.push({mesh:EMPA[st],M:M4.trs([0,0,z0],0,0,0,1)})}
    for(const c of EMPCATS){boulder(items,c,t,9);impact(items,c.p,t-c.t,9)}}
  // ---- final grape
  if(rn===6&&t>=EV.drop0-0.3&&t<EV.splash){const k=(t-EV.drop0+0.3)/(EV.splash-EV.drop0+0.3);const y=0.95+7*Math.pow(1-k,1.15);items.push({mesh:GRAPE,M:M4.trs([0,y,-0.08],k*2,0.3,0.2,0.85)});items.push({mesh:UEMIS,M:M4.trs([-0.3,y+0.45,-0.7],0,0,0,0.1),tint:[1,1,1],tintAmt:1,alpha:0.7,add:1,noShadow:true})}
  if((rn===6&&t>=EV.splash)||(t>=R[7]&&t<EV.loop)){const k=t-EV.splash;items.push({mesh:GRAPE,M:M4.trs([0,0.42,-0.08],0.7,0.3,0.2,[0.95,0.5,0.95])});items.push({mesh:DISC2,M:M4.trs([0,0.04,0],0,0,0,[lerp(0.6,2.0,easeOut(k/0.3)),1,lerp(0.6,1.8,easeOut(k/0.3))]),tint:hx('#7a2a8a'),tintAmt:1,alpha:0.75,noShadow:true});
    if(k<1.2)for(let i=0;i<14;i++){const a=i/14*TAU2;const sp=2.0+hsh(i,3)*1.5;const p=[Math.cos(a)*sp*k,0.3+k*(5-k*9)*0.6*(0.8+hsh(i,4)*0.6),Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.07+hsh(i,5)*0.05),tint:hx('#8a3a9a'),tintAmt:1})}
    if(k<1.5){const kk=k;items.push({mesh:UCYL,M:M4.mul(M4.trs([1.2+kk*4,0.1+kk*(4-kk*5.5),-0.4],0,0,kk*12,1),segM([0,-0.25,0],[0,0.25,0],0.028)),tint:AC.wood,tintAmt:1})}}
  return items}
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:underK(tt)>0?300:1100});
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S_(EV.stomp1,30,1.0);for(const s of STOMPS)S_(s.t,9,0.4);
  if(t>=EV.tst0&&t<R[3]){const zf=tstZ(t);if(zf<160&&zf>-90)a+=3.5}for(const c of CATS)S_(c.t,16,1.0);S_(EV.clang,14,0.6);if(t>=R[5]&&t<R[6])a+=1.5;for(const c of EMPCATS)S_(c.t,7,0.8);S_(EV.splash,20,0.5);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[7])return;const ts=R[rn];const k=t-ts;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=rn===6&&t<EV.drop0;
  if(!hideLab){const kk=rn===6?t-EV.drop0:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===6?104:120,rn===6?'#c88aff':'#ffd84a');ctx.restore();
    if(t<t2)pill(cap1,385,rn===6?'rgba(110,40,140,0.85)':'rgba(15,10,30,0.66)',60,Math.min(1,kk/0.12));else pill(cap2,385,rn===6?'rgba(200,40,40,0.85)':'rgba(40,140,60,0.85)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[6]+0.3&&t<EV.drop0-0.6)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[6]-0.3)/0.15));if(t>=EV.drop0-0.6)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.splash;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();const fl=ko?0:0.03+0.01*Math.sin(t*9);ctx.fillStyle='#ff4a4a';if(fl>0){rrect(-150,-17,Math.max(14,330*fl),34,17);ctx.fill()}
  txt(ko?'K.O.':'1%',250,2,ko?46:44,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,430);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('PART 2',0,-250,56,'#ffffff');txt('ROMAN LEGION ⚔️',0,-150,fitSize('ROMAN LEGION ⚔️',980,104),'#ffd84a');txt('vs',0,-40,80,'#ffffff');txt('ONE DYING ANT 🐜',0,70,100,'#ff6a5a');ctx.restore();
  if(t>1.0){ctx.save();ctx.globalAlpha=a*clamp((t-1.0)/0.3,0,1);pill('Who wins? 🤔',730,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[7];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.68*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should fight',0,-110,88,'#ffffff');txt('him NEXT? 🐜',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('Part 3: TON 618? 🕳️',W/2,1080,56,'#ffffff','center',800);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;
  // stomp dust tint
  {const k=tt-EV.stomp1;if(k>=0&&k<1.2){ctx.fillStyle=`rgba(170,140,105,${0.22*(1-k/1.2)})`;ctx.fillRect(0,0,W,H)}}
  // catapult fire streaks
  if(tt>=28.2&&tt<R[4]){const r=rngG(3);const a=clamp((tt-28.2)/0.6,0,1)*clamp((R[4]-tt)/1.2,0,1);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<14;i++){const sp=700+r()*500;const x0=r()*W*1.3,ph=r()*3;const y=((tt*sp+ph*700)%(H*0.6));const x=x0-y*0.3;ctx.strokeStyle=`rgba(255,${140+r()*80|0},60,${0.45*a})`;ctx.lineWidth=4+r()*4;ctx.beginPath();ctx.moveTo(x,y-110);ctx.lineTo(x-33,y);ctx.stroke()}ctx.restore()}
  // clang spark
  {const k=tt-EV.clang;if(k>=0&&k<0.5&&LASTVP){const p=project(LASTVP,[0.06,1.55,-0.56]);if(p){ctx.save();ctx.globalCompositeOperation='screen';const r=rngG(5);for(let i=0;i<22;i++){const a=r()*TAU2,l=(80+r()*260)*easeOut(k/0.25),l0=l*0.3;ctx.strokeStyle=`rgba(255,${200+r()*55|0},120,${1-k/0.5})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*l0,p[1]+Math.sin(a)*l0);ctx.lineTo(p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l);ctx.stroke()}
    const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],260);g.addColorStop(0,`rgba(255,250,220,${0.9*(1-k/0.5)})`);g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}}}
  if(tt>=EV.thumb+0.3&&tt<EV.stab0){const k=tt-EV.thumb-0.3;const sc=k<0.25?0.5+0.5*easeOut(k/0.25)+Math.sin(k/0.25*Math.PI)*0.2:1;ctx.save();ctx.translate(780,760+Math.sin(k*6)*14);ctx.scale(sc,sc);ctx.font='200px "Noto Color Emoji"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('👎',0,0);ctx.restore()}
  // slow-mo letterbox
  if(tt>=EV.drop0-0.6&&tt<EV.splash+0.8){const k=ease((tt-EV.drop0+0.6)/0.4)*(1-ease((tt-EV.splash-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k);ctx.fillStyle=`rgba(120,60,160,${0.08*k})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<7;i++)flash(R[i],0.35,0.15);flash(EV.stomp1,0.3,0.15);for(const c of CATS)flash(c.t,0.35,0.3,'255,200,140');flash(EV.clang,0.6,0.25);flash(EV.splash,0.45,0.2,'230,200,255');
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
