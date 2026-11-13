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
