// ===================== SPEED TRACKS (scrolling tiles) =====================
const TAU2=Math.PI*2;
function per(z,T,k){return Math.sin(z/T*TAU2*k)} // periodic helper
function uSph(m){const s=new MB();s.ico([0,0,0],1,[1,1,1],m,1,[16,24]);return s.build(0.3)}
let UEMIS,UGLASS;

function loftZ(mb,rings,seg,col,m,capA,capB){const R=rings.map(r=>{const pts=[];for(let i=0;i<seg;i++){const a=i/seg*TAU2;pts.push([r.x+Math.cos(a)*r.rx,r.cy+Math.sin(a)*r.ry*(Math.sin(a)<0?(r.flat||1):1),r.z])}return pts});
  for(let k=0;k<R.length-1;k++)for(let i=0;i<seg;i++){const j=(i+1)%seg;mb.quad(R[k][i],R[k][j],R[k+1][j],R[k+1][i],rings[k].col||col,m)}
  if(capA!==false){const r=rings[0];for(let i=0;i<seg;i++)mb.tri([r.x,r.cy,r.z],R[0][(i+1)%seg],R[0][i],col,m)}
  if(capB!==false){const L=R.length-1,r=rings[L];for(let i=0;i<seg;i++)mb.tri([r.x,r.cy,r.z],R[L][i],R[L][(i+1)%seg],col,m)}}
function wheelX(mb,x,y,z,r,w,seg){seg=seg||18;const tire=hx('#1a1a1e'),hub=hx('#c8ccd4');const P=(a,xx,rr)=>[xx,y+Math.sin(a)*rr,z+Math.cos(a)*rr];
  for(let i=0;i<seg;i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;mb.quad(P(a,x-w/2,r),P(b,x-w/2,r),P(b,x+w/2,r),P(a,x+w/2,r),tire);for(const s of[-1,1]){const xx=x+s*w/2;mb.tri([xx,y,z],s>0?P(a,xx,r*0.62):P(b,xx,r*0.62),s>0?P(b,xx,r*0.62):P(a,xx,r*0.62),hub);mb.quad(P(a,xx,r*0.62),P(b,xx,r*0.62),P(b,xx,r),P(a,xx,r),tire)}}}
function carNice(mb,x,z,ry,col,y0){y0=y0||0;const pr=[[-2.2,0.32],[-2.28,0.62],[-2.12,0.86],[-1.05,0.98],[-0.55,1.42],[0.85,1.44],[1.45,0.98],[2.15,0.88],[2.28,0.6],[2.2,0.32]];const cs=Math.cos(ry||0),sn=Math.sin(ry||0);const Pt=(lx,y,lz)=>[x+lx*cs+lz*sn,y0+y,z-lx*sn+lz*cs];
  const wd=0.92;const glass=hx('#22304a');for(let i=0;i<pr.length-1;i++){const [z0,y0_]=pr[i],[z1,y1]=pr[i+1];const g=(i===3||i===5);const c=g?glass:col;const ww=i>=3&&i<=5?wd*0.86:wd;const wn=i>=3&&i<=5?wd*0.86:wd;mb.quad(Pt(-ww,y0_,z0),Pt(-wn,y1,z1),Pt(wn,y1,z1),Pt(ww,y0_,z0),c,g?MAT.glass:0)}
  mb.quad(Pt(-wd,0.32,2.2),Pt(-wd,0.32,-2.2),Pt(wd,0.32,-2.2),Pt(wd,0.32,2.2),hx('#222'));
  for(const s of[-1,1]){const cx_=0,cy=0.75;for(let i=0;i<pr.length-1;i++){const [z0,y0_]=pr[i],[z1,y1]=pr[i+1];const w0=i>=3&&i<=5?wd*0.86:wd,w1=(i+1)>=4&&(i+1)<=5?wd*0.86:wd;mb.tri(Pt(s*wd,cy,cx_),Pt(s*(i>=3&&i<=5?wd*0.86:wd),y0_,z0),Pt(s*(i>=3&&i<=5?wd*0.86:wd),y1,z1),col)}
    mb.tri(Pt(s*wd,cy,0),Pt(s*wd,0.32,2.2),Pt(s*wd,0.32,-2.2),col);mb.quad(Pt(s*wd*0.87,1.0,-0.95),Pt(s*wd*0.87,1.0,1.35),Pt(s*wd*0.87,1.36,0.8),Pt(s*wd*0.87,1.36,-0.45),glass,MAT.glass)}
  for(const s of[-1,1])for(const lz of[-1.38,1.38]){const p=Pt(s*0.82,0.34,lz);mbWheel(mb,p,0.34,0.26,ry)}
  for(const s of[-1,1]){mb.box(Pt(s*0.6,0.68,-2.26),[0.35,0.1,0.04],[1,0.95,0.8],MAT.emis,ry);mb.box(Pt(s*0.6,0.72,2.27),[0.35,0.1,0.04],hx('#d02020'),MAT.emis,ry)}}
function mbWheel(mb,p,r,w,ry){const seg=16,tire=hx('#1a1a1e'),hub=hx('#c8ccd4');const cs=Math.cos(ry||0),sn=Math.sin(ry||0);const T=(lx,ly,lz)=>[p[0]+lx*cs+lz*sn,p[1]+ly,p[2]-lx*sn+lz*cs];const Q=(a,lx,rr)=>T(lx,Math.sin(a)*rr,Math.cos(a)*rr);
  for(let i=0;i<seg;i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;mb.quad(Q(a,-w/2,r),Q(b,-w/2,r),Q(b,w/2,r),Q(a,w/2,r),tire);for(const s of[-1,1]){const lx=s*w/2;mb.tri(T(lx,0,0),Q(s>0?a:b,lx,r*0.6),Q(s>0?b:a,lx,r*0.6),hub);mb.quad(Q(a,lx,r*0.6),Q(b,lx,r*0.6),Q(b,lx,r),Q(a,lx,r),tire)}}}
// ---- dynamic models ----
let CYCLIST,F1CAR=[],TRAIN,JET,SEDAN=[],TRUCK;
function buildModels(){UEMIS=uSph(MAT.emis);UGLASS=uSph(MAT.glass);
  {const m=new MB();for(const z of[-0.55,0.55]){m.prism([0,0.35,z],0.34,0.34,0.06,12,hx('#1d1e22'),0,0);}
   for(const z of[-0.55,0.55])m.box([0,0.35,z],[0.1,0.7,0.7],hx('#1d1e22'));m.box([0,0.62,0],[0.06,0.06,1.1],hx('#20c070'));m.box([0,0.78,-0.1],[0.06,0.4,0.06],hx('#20c070'));
   m.box([0,0.62,0.45],[0.06,0.5,0.06],hx('#20c070'));m.box([0,1.0,-0.1],[0.2,0.06,0.3],hx('#222'));
   m.box([0,1.25,-0.05],[0.34,0.5,0.24],hx('#f2c230'));m.ico([0,1.62,0.08],0.14,hx('#d9a68a'));m.box([0,1.74,0.05],[0.28,0.1,0.36],hx('#e04848'));
   for(const s of[-1,1]){m.box([s*0.1,0.8,0.05],[0.12,0.5,0.14],hx('#2c3245'));m.box([s*0.18,1.3,0.28],[0.08,0.08,0.5],hx('#f2c230'))}CYCLIST=m.build()}
  for(const col of['#e02020','#1f6fd8','#f0f0f0','#ff8a00']){const m=new MB();const c=hx(col);loftZ(m,[{z:-2.6,x:0,cy:0.32,rx:0.08,ry:0.06},{z:-1.6,x:0,cy:0.36,rx:0.22,ry:0.12},{z:-0.4,x:0,cy:0.42,rx:0.32,ry:0.2},{z:0.6,x:0,cy:0.45,rx:0.55,ry:0.24},{z:1.6,x:0,cy:0.45,rx:0.45,ry:0.22},{z:2.3,x:0,cy:0.45,rx:0.2,ry:0.16}],16,c);
   m.box([0,0.62,0.25],[0.36,0.12,0.5],hx('#151515'));m.ico([0,0.7,0.2],0.13,hx('#ffd84a'),0,1,[10,14]);m.box([0,0.14,-2.55],[1.9,0.05,0.45],c);m.box([0,0.9,2.3],[1.4,0.07,0.45],c);for(const s of[-1,1])m.box([s*0.68,0.6,2.3],[0.05,0.6,0.5],c);
   for(const sx of[-0.85,0.85])for(const sz of[-1.6,1.45])mbWheel(m,[sx,0.34,sz],0.34,0.34,0);F1CAR.push(m.build(0.5))}
  for(const col of['#d6453d','#3e6fd8','#e8eaee','#2b2d33','#f2c230','#52a060']){const m=new MB();carNice(m,0,0,0,hx(col));SEDAN.push(m.build(0.55))}
  {const m=new MB();m.box([0,1.6,1.5],[2.5,2.6,8],hx('#e8e8ec'));m.box([0,1.3,-4.2],[2.4,2.0,2.6],hx('#d6453d'));m.box([0,1.9,-5.4],[2.2,0.8,0.2],hx('#2f3a4c'));for(const sz of[-4.4,-1,2,4.6])for(const sx of[-1.1,1.1])m.box([sx,0.5,sz],[0.4,1,1],hx('#1d1e22'));TRUCK=m.build()}
  {const m=new MB();const L=25,N=8,wh=hx('#f4f6f8'),bl=hx('#1f4fa8');for(let i=0;i<N;i++){const z0=i*L+0.3,z1=(i+1)*L-0.3;loftZ(m,[{z:z0,x:0,cy:2.0,rx:1.7,ry:1.7,flat:0.75},{z:z1,x:0,cy:2.0,rx:1.7,ry:1.7,flat:0.75}],20,wh);
     m.box([0,1.35,(z0+z1)/2],[3.42,0.32,L-0.8],bl);for(let w=0;w<9;w++)for(const s of[-1,1])m.box([s*1.66,2.45,z0+1.8+w*2.5],[0.06,0.62,1.6],hx('#26324a'),MAT.glass);for(const sz of[3,L-3])m.box([0,0.55,z0+sz],[2.4,0.5,2.2],hx('#333'))}
   const rs=[];for(let k=0;k<=12;k++){const f=k/12;const e=Math.sqrt(1-f*f*0.96);rs.push({z:0.3-f*10.5,x:0,cy:2.0-f*f*0.9,rx:1.7*(0.08+0.92*Math.pow(1-f,0.55)),ry:1.7*(0.08+0.92*Math.pow(1-f,0.7)),flat:0.75})}loftZ(m,rs,20,wh,0,false,true);
   m.box([0,1.35,-3],[3.0,0.3,6.2],bl);loftZ(m,[{z:-1.2,x:0,cy:2.9,rx:1.0,ry:0.35},{z:-4.2,x:0,cy:2.6,rx:0.7,ry:0.25}],14,hx('#1a2238'),MAT.glass);TRAIN=m.build(0.5)}
  {const m=new MB();const g=hx('#8a95a5');m.box([0,0,0],[1.4,1.3,14],g);m.prism([0,0,-7],0.7,0.0,4,8,g);m.quad([-0.5,0,-1],[-0.5,0,4],[-6.5,-0.2,4.5],[-6.5,-0.2,3],g);m.quad([0.5,0,-1],[6.5,-0.2,3],[6.5,-0.2,4.5],[0.5,0,4],g);
   for(const s of[-1,1])m.quad([s*0.4,0.5,4.5],[s*0.4,0.5,7],[s*2.4,2.6,7.4],[s*2.4,2.6,6.4],g);m.box([0,0.75,-3.5],[0.8,0.5,2.4],hx('#2a3550'),MAT.glass);m.prism([0,0,7],0.55,0.45,0.2,8,hx('#ffb040'),MAT.emis);JET=m.build()}}
// ---- tile builders ----
const TR={};
function tile(key){if(TR[key])return TR[key];const m=new MB();let T,env,stat=null,cam;const r=rngG(key.length*97+key.charCodeAt(0));const sm=new MB();
  if(key==='park'){T=60;ground(m,-160,-T,160,0,C.grass,0,6,(x,z)=>hsh(Math.floor(x/6)+200,Math.floor(-z/6))<0.5?C.grass:C.grass2);ground(m,-1.4,-T,1.4,0,hx('#c9b48a'),0.03,6);
    for(let i=0;i<16;i++){const s=r()<0.5?-1:1;const x=s*(5+r()*50),z=-r()*T;tree(m,x,z,1.8+r()*1.6,0,r()<0.3?'pine':'')}
    for(const z of[-15,-45]){m.box([2.8,0.45,z],[0.6,0.08,2.2],C.wood);m.box([3.05,0.75,z],[0.08,0.5,2.2],C.wood);for(const dz of[-0.9,0.9])m.box([2.8,0.22,z+dz],[0.5,0.45,0.08],hx('#333'))}
    for(const z of[-5,-35]){m.prism([-2.4,0,z],0.07,0.06,3.6,6,hx('#2f3138'));m.box([-2.4,3.7,z],[0.35,0.3,0.35],hx('#fff3c0'),MAT.emis)}
    for(let i=0;i<5;i++){const z=-r()*T;const x=(r()<0.5?-1:1)*(6+r()*12);people(m,x,z,x+0.1,z+0.1,1,i+key.length*7)}
    env=envDay({fogD:220,sun:[0.5,0.75,0.45],sunCol:hx('#fff4e0')});cam={eye:[2.6,1.35,4.2],at:[0,1.0,-1.5],orb:0.25}}
  if(key==='suburb'){T=64;ground(m,-160,-T,-1.6,0,C.grass,0,8,(x,z)=>hsh(Math.floor(x/8)+50,Math.floor(-z/8))<0.5?C.grass:C.grass2);ground(m,-1.6,-T,1.6,0,C.side,0.04,8);ground(m,1.6,-T,11.6,0,C.road,0.02,8);ground(m,11.6,-T,14.6,0,C.side,0.04,8);ground(m,14.6,-T,160,0,C.grass,0,8);
    for(let z=-4;z>-T;z-=12)m.box([6.6,0.03,z],[0.2,0.02,5],C.line);const wc=['#f2e6d0','#cfd8e0','#e8d0c0','#d9e8c9','#f0d9b5','#e0e0ea'];
    for(const [x,ry,s] of[[-11,Math.PI/2,-1],[21,-Math.PI/2,1]])for(let k=0;k<2;k++){const z=-16-k*32+(s>0?8:0);house(m,x,z,11,9,5+r()*1.5,hx(wc[Math.floor(r()*6)]),r()<0.5?C.roofR:C.roofG,ry);tree(m,x-s*5,z+9,1.1);fence(m,x-s*6.5,z-8,x-s*6.5,z+8,0.9)}
    carNice(m,3.4,-40,0,hx(['#3e6fd8','#2b2d33','#e8eaee'][Math.floor(r()*3)]));for(let z=-10;z>-T;z-=32)m.box([12.5,0.6,z],[0.5,1.2,0.4],hx('#3a5fc0'));
    env=envDay({fogD:260,sun:[-0.45,0.75,0.45]});cam={eye:[5.2,1.25,1.2],at:[0.4,1.0,-1.2],orb:-0.3}}
  if(key==='city'){T=120;ground(m,-200,-T,200,0,C.road,0,20);ground(m,-8,-T,-4,0,C.side,0.05,10);ground(m,12,-T,16,0,C.side,0.05,10);
    for(let z=-2;z>-T;z-=10)m.box([4,0.03,z],[0.25,0.02,4],C.yellow);for(let x=-3;x<12;x+=1.4)m.box([x,0.03,-60],[0.7,0.02,4],C.line);
    const bc=['#8a93ab','#a59f9a','#7a8398','#b2b5c3','#9499b2','#a8a2b8','#c9b8a6'];for(const s of[-1,1]){let z=0;while(z>-T+1){const len=Math.min(14+r()*14,z+T);const d=12+r()*6,h=25+r()*80;skyscraper(m,s<0?-8-d/2:16+d/2,z-len/2,d,len-0.6,h,hx(bc[Math.floor(r()*7)]));z-=len}}
    for(let z=-6;z>-T;z-=24){m.prism([-4.6,0,z],0.12,0.1,7,6,hx('#3b3d46'));m.box([-3.8,7,z],[1.8,0.2,0.4],hx('#3b3d46'))}people(m,-7.6,-T,-4.4,0,18,5);people(m,12.4,-T,15.6,0,18,6);
    env=envDay({fogD:300,sun:[0.45,0.75,0.5],fog:hx('#d8dde8')});cam={eye:[2.2,1.6,4.6],at:[0.6,1.0,-2],orb:0.3}}
  if(key==='highway'||key==='coast'){T=200;const co=key==='coast';ground(m,-6,-T,co?8:22,0,C.road,0,20);for(let z=-3;z>-T;z-=12){m.box([2,0.03,z],[0.18,0.02,5],C.line);if(!co){m.box([6,0.03,z],[0.18,0.02,5],C.line)}}
    m.box([-5.7,0.03,-T/2],[0.18,0.02,T],C.line);if(!co){m.box([10,0.45,-T/2],[0.6,0.9,T],hx('#b8b8b8'));m.box([14,0.03,-T/2],[0.18,0.02,T],C.yellow);for(let z=-3;z>-T;z-=12)m.box([18,0.03,z],[0.18,0.02,5],C.line)}
    for(let z=0;z>-T;z-=4)m.box([-6.6,0.45,z],[0.1,0.9,0.1],hx('#999'));m.box([-6.6,0.7,-T/2],[0.06,0.25,T],hx('#c8c8c8'));
    if(!co){terrain(m,-260,-T,-6.5,0,24,(x,z)=>Math.max(0,(-x-12)*0.12)*(1+0.6*per(z,T,1))+4*per(z,T,2)*Math.min(1,(-x-6.5)/30),(x,z,h)=>h>12?hx('#7a9a55'):(hsh(Math.floor(x/10),Math.floor(-z/10))<0.5?C.grass:C.grass2));
      terrain(m,22,-T,260,0,24,(x,z)=>Math.max(0,(x-28)*0.15)*(1+0.5*per(z,T,1))+3*per(z,T,3)*Math.min(1,(x-22)/30),(x,z,h)=>h>14?hx('#7a9a55'):(hsh(Math.floor(x/10)+9,Math.floor(-z/10))<0.5?C.grass:C.grass2));
      for(let i=0;i<20;i++){const s=r()<0.5?-1:1;const x=s<0?-14-r()*80:30+r()*80;tree(m,x,-r()*T,2+r()*1.5,0,r()<0.5?'pine':'')}
      m.prism([-8,0,-100],0.2,0.2,7,6,hx('#888'));m.prism([20,0,-100],0.2,0.2,7,6,hx('#888'));m.box([6,7,-100],[28,0.4,0.4],hx('#888'));m.box([1,7.6,-100],[7,1.8,0.2],hx('#1f7a3a'));m.box([12,7.6,-100],[6,1.8,0.2],hx('#1f7a3a'));m.box([1,7.6,-99.88],[5,0.25,0.02],[1,1,1]);
      env=envDay({fogD:520,sun:[0.5,0.7,0.5]});cam={eye:[0.4,5.2,8.5],at:[0.6,0.9,-6],orb:0.15}}
    else{terrain(m,-200,-T,-6.5,0,20,(x,z)=>Math.max(0,(-x-8)*0.6)*(1+0.4*per(z,T,1)+0.2*per(z,T,4)),(x,z,h,ny)=>ny<0.7?hx('#9a7a62'):hx('#6a8a48'));
      terrain(m,8,-T,40,0,12,(x,z)=>-Math.min(24,Math.max(0,(x-10))*1.3)+2*per(z,T,3),(x,z,h,ny)=>h<-18?C.sand:(ny<0.6?hx('#8a6a55'):hx('#7a9050')));
      for(let z=-10;z>-T;z-=20)tree(m,-9,z,1.4,0,'palm');for(let i=0;i<6;i++)m.ico([16+r()*20,-23,-r()*T],2+r()*4,C.rock);
      sm.quad([30,-23.5,-9000],[30,-23.5,9000],[9000,-23.5,9000],[9000,-23.5,-9000],hx('#3a6aa0'),MAT.water);
      env=envDay({sun:[0.75,0.18,-0.65],sunCol:hx('#ffb070'),sky:hx('#e8b0a0'),gnd:hx('#7a6050'),fog:hx('#f0b898'),fogD:1100,zen:hx('#3a4aa0'),hor:hx('#ffb890'),sunSize:2.4});cam={eye:[-4.6,1.0,1.4],at:[0.6,1.1,-1.6],orb:0.25}}}
  if(key==='train'){T=300;ground(m,-300,-T,300,0,C.grass,0,20,(x,z)=>{const a=Math.floor(x/20),b=Math.floor(-z/20);const q=hsh(a+77,b);return q<0.33?hx('#7aa83c'):q<0.66?hx('#9ab84a'):hx('#c8b85a')});
    ground(m,-2,-T,2,0,hx('#a89a88'),0.05,20);m.box([5,0.25,-T/2],[5,0.5,T],hx('#8a8580'));for(const x of[4.25,5.75])m.box([x,0.58,-T/2],[0.1,0.16,T],hx('#c8c8d0'));for(let z=0;z>-T;z-=1.5)m.box([5,0.52,z],[2.6,0.08,0.3],hx('#5a4a3a'));
    for(let z=-10;z>-T;z-=50){m.prism([8,0.5,z],0.15,0.15,6.5,6,hx('#888'));m.box([5.6,6.8,z],[5,0.2,0.2],hx('#888'))}m.box([5,6.3,-T/2],[0.03,0.03,T],hx('#333'));
    for(let i=0;i<5;i++){const x=(r()<0.5?-1:1)*(25+r()*150);house(m,x,-r()*T,8,8,4,hx('#e8e0d0'),hx('#3a4050'),0)}
    {const fj=[-2400,0,-5200];sm.prism(fj,2600,250,2200,14,hx('#4a5a7a'));sm.prism([fj[0],1500,fj[2]],820,250,700,14,C.snow);sm.prism([fj[0],0,fj[2]+500],1500,800,600,12,hx('#5a7a5a'))}
    env=envDay({fogD:2600,sun:[0.4,0.7,0.55],fog:hx('#dfe8f0')});cam={eye:[-4.2,1.5,2.5],at:[1.0,1.3,-2.0],orb:0.2}}
  if(key==='f1'){T=300;ground(m,-200,-T,200,0,C.grass,0,20,(x,z)=>Math.floor(-z/10)%2?C.grass:C.grass2);ground(m,-10,-T,10,0,hx('#3a3c44'),0.03,20);
    for(let z=0;z>-T;z-=2)for(const s of[-1,1])m.box([s*10.7,0.06,z-1],[1.4,0.06,2],Math.floor(-z/2)%2?hx('#e02020'):[1,1,1]);for(let z=-3;z>-T;z-=12)m.box([0,0.05,z],[0.25,0.02,6],[0.9,0.9,0.9]);
    m.box([18,0.6,-T/2],[0.5,1.2,T],hx('#e8e8e8'));for(let z=-10;z>-T;z-=20)m.box([17.7,0.6,z],[0.05,1.0,16],hx(['#e02020','#1f6fd8','#ffd84a','#20a060'][Math.floor(-z/20)%4]));
    for(let k=0;k<6;k++){const y=1+k*1.6,x=24+k*2.4;m.box([x,y/2,-T/2],[2.4,y,T-2],hx('#9a9aa6'));for(let z=-2;z>-T;z-=1.1)m.box([x-0.3,y+0.35,z],[0.4,0.6,0.5],hx(['#e04848','#3c8de0','#f0d040','#f2f2f2','#52c060','#ff8a30'][Math.floor(r()*6)]))}
    m.box([38,10,-T/2],[2,2,T],hx('#4a4c55'));for(let z=-30;z>-T;z-=60){m.prism([-14,0,z],0.2,0.2,8,6,hx('#aaa'));m.box([-14,8.5,z],[1.5,1,6],hx('#e02020'))}
    env=envDay({fogD:700,sun:[0.5,0.75,0.4]});cam={eye:[-3.4,1.1,-6.0],at:[0.2,1.1,0.5],orb:-0.25}}
  if(key==='desert'){T=500;ground(m,-400,-T,400,0,C.sand,0,25,(x,z)=>{const q=hsh(Math.floor(x/25)+33,Math.floor(-z/25));return q<0.5?hx('#e0b880'):hx('#d4a870')});ground(m,-3,-T,3,0,hx('#b89a72'),0.04,25);
    for(let i=0;i<34;i++){const s=r()<0.5?-1:1;const x=s*(8+r()*180),z=-r()*T,h=3+r()*4;m.prism([x,0,z],0.4,0.35,h,7,hx('#3f7d3c'));for(const a of[-1,1])if(r()<0.7){const y=h*(0.4+r()*0.3);m.box([x+a*0.7,y,z],[1.2,0.5,0.5],hx('#3f7d3c'));m.prism([x+a*1.2,y,z],0.3,0.28,1.8,6,hx('#3f7d3c'))}}
    for(let i=0;i<14;i++)m.ico([(r()<0.5?-1:1)*(6+r()*200),0,-r()*T],0.8+r()*2.5,hx('#a07a55'),0,0.6);
    for(let i=0;i<9;i++){const x=(r()<0.5?-1:1)*(1200+r()*2500),z=-1500-r()*6000,w=400+r()*900,h=200+r()*350;sm.box([x,h/2,z],[w,h,w*0.8],hx('#b0704a'),0,r(),hx('#c88a5a'))}
    env=envDay({sun:[0.6,0.6,0.5],sunCol:hx('#fff0d0'),sky:hx('#e8d8c0'),gnd:hx('#a08060'),fog:hx('#f0dcc0'),fogD:2400,zen:hx('#3a74c8'),hor:hx('#f4e2c8')});cam={eye:[3.0,1.4,5.0],at:[0.2,1.1,-1.6],orb:0.3}}
  if(key==='ocean'){T=1000;m.quad([-3000,0,-T],[-3000,0,0],[3000,0,0],[3000,0,-T],hx('#1f6fa8'),MAT.water);
    for(let i=0;i<6;i++){const s=r()<0.5?-1:1;const x=s*(80+r()*500),z=-r()*T,R=10+r()*40;m.ico([x,-R*0.4,z],R,C.rock,0,0.6);if(r()<0.6)tree(m,x,z,2,R*0.45,'palm')}
    env=envDay({fogD:3500,sun:[0.5,0.7,0.45],fog:hx('#cfe4f2'),hor:hx('#e0f0fa'),zen:hx('#2a6ad0')});cam={eye:[-4.8,0.9,2.2],at:[0.8,1.0,-1.8],orb:0.3}}
  if(key==='canyon'){T=2000;ground(m,-60,-T,60,0,hx('#c8743f'),0,40,(x,z)=>hsh(Math.floor(x/40)+5,Math.floor(-z/40))<0.5?hx('#c8743f'):hx('#b8683a'));
    m.quad([-12,0.1,-T],[-12,0.1,0],[12,0.1,0],[12,0.1,-T],hx('#3a7aa0'),MAT.water);
    for(const s of[-1,1])terrain(m,s<0?-600:60,-T,s<0?-60:600,0,34,(x,z)=>{const d=Math.abs(x)-60;return Math.min(380,Math.max(0,d-80)*1.6)*(0.8+0.15*per(z,T,2)+0.1*per(z,T,5))+30*per(z+x,T,3)},(x,z,h)=>{const b=Math.floor(h/28)%3;return b===0?hx('#b85a30'):b===1?hx('#d88a50'):hx('#a04a28')});
    env=envDay({sun:[0.55,0.65,0.4],sunCol:hx('#ffe6c0'),sky:hx('#e8c8a8'),gnd:hx('#904a2a'),fog:hx('#f0c8a0'),fogD:3200,zen:hx('#3a6ac0'),hor:hx('#f8d8b0')});cam={eye:[3.2,1.6,5.4],at:[0.2,1.1,-1.8],orb:0.3}}
  if(key==='ice'){T=4000;ground(m,-3000,-T,3000,0,hx('#e8f2fa'),0,250,(x,z)=>{const q=hsh(Math.floor(x/250)+3,Math.floor(-z/250));return q<0.4?hx('#e4eef8'):q<0.8?hx('#d4e4f2'):hx('#b8d4ea')});
    for(let i=0;i<40;i++)m.box([(r()-0.5)*4000,0.05,-r()*T],[2+r()*4,0.05,100+r()*400],hx('#9cc0dc'),0,r()*3);
    for(let i=0;i<22;i++){const s=r()<0.5?-1:1;const x=s*(60+r()*1500);m.ico([x,0,-r()*T],15+r()*60,hx(r()<0.5?'#f4f9fe':'#cfe6f6'),0,0.7)}
    for(let i=0;i<10;i++){const x=(r()<0.5?-1:1)*(4000+r()*8000);sm.prism([x,0,-6000-r()*10000],1500+r()*1500,0,1200+r()*1500,7,hx('#dce8f4'))}
    env=envDay({sun:[0.6,0.35,-0.5],sunCol:hx('#fff0e0'),sky:hx('#b8d0ea'),gnd:hx('#c0d0e0'),fog:hx('#dce8f4'),fogD:9000,zen:hx('#2a5ab8'),hor:hx('#e8f0fa'),sunSize:1.6});cam={eye:[-4.4,1.3,2.6],at:[0.8,1.1,-1.8],orb:0.3}}
  if(key==='night'){T=8000;ground(m,-8000,-T,8000,0,hx('#20242c'),0,1000,(x,z)=>hsh(Math.floor(x/1000)+9,Math.floor(-z/1000))<0.5?hx('#1c2028'):hx('#242a30'));
    for(let c=0;c<16;c++){const cx=(r()<0.5?-1:1)*(300+r()*5000),cz=-r()*T,R=150+r()*700;const n=Math.floor(R/3);for(let i=0;i<n;i++){const a=r()*TAU2,d=Math.sqrt(r())*R;m.box([cx+Math.cos(a)*d,1,cz+Math.sin(a)*d],[12,2,12],hx(r()<0.7?'#ffb050':'#fff0c0'),MAT.emis)}}
    for(let k=0;k<3;k++){const x=(k-1)*2500+300;for(let z=0;z>-T;z-=60)m.box([x+Math.sin(z*0.001)*300,1,z],[6,1,20],hx('#ffc070'),MAT.emis)}
    env={sun:[0.3,0.5,-0.6],sunCol:hx('#4a5a80'),sky:hx('#1a2440'),gnd:hx('#101420'),fog:hx('#0c1426'),fogD:9000,zen:hx('#03060f'),hor:hx('#1a2a4a'),stars:1,night:1,emis:1.3};cam={eye:[4.8,1.2,-0.6],at:[-0.4,1.1,0.6],orb:-0.3}}
  const L={mesh:m.build(0.45),T,env,cam,stat:sm.d.length?sm.build(0.45):null};TR[key]=L;return L}
// ---- planets ----
let MOONH,MARS,JUP,SAT,SATRING,ROCK=[];
function planetMesh(la,lo,colFn){const mb=new MB();const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};const G=[];for(let i=0;i<=la;i++){G.push([]);for(let j=0;j<=lo;j++){const p=P(i,j);G[i].push([p,colFn(p)])}}
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=G[i][j],b=G[i+1][j],c=G[i+1][j+1],d=G[i][j+1];if(i>0)mb.tri(a[0],d[0],c[0],[a[1],d[1],c[1]]);if(i<la-1)mb.tri(a[0],c[0],b[0],[a[1],c[1],b[1]])}return mb.build(0.5)}
function buildPlanets(){MOONH=planetMesh(96,192,p=>{const n=fbm(p[0]*3+5,p[2]*3+p[1]*2,5);const cr=vnoise(p[0]*14+p[1]*3,p[2]*14);const g=0.55+0.25*n-(cr>0.82?0.12:0)-(n<0.45?0.15:0);return[g,g,g*1.02]});
  MARS=planetMesh(80,160,p=>{const n=fbm(p[0]*2.5+1,p[2]*2.5+p[1]*1.5,5);if(Math.abs(p[1])>0.92)return C.snow;return n>0.55?hx('#c8643a'):n>0.45?hx('#b0502c'):hx('#8a3c22')});
  JUP=planetMesh(80,160,p=>{const y=p[1]+0.06*Math.sin(p[0]*6+p[2]*5);const b=Math.sin(y*22)*0.5+0.5;const sp=Math.hypot(p[0]-0.55,p[1]+0.35,p[2]-0.75)<0.18;if(sp)return hx('#c0583a');return mix3(hx('#e8d4b0'),hx('#b07a50'),b*(0.6+0.4*Math.abs(Math.sin(y*7))))});
  SAT=planetMesh(64,128,p=>mix3(hx('#f0dca8'),hx('#c8a870'),Math.sin(p[1]*18)*0.5+0.5));
  {const mb=new MB();const seg=96;for(let k=0;k<6;k++){const r0=1.3+k*0.18,r1=r0+0.16;const c=k===3?null:mix3(hx('#e8d8b0'),hx('#a08a60'),k/6);if(!c)continue;for(let i=0;i<seg;i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;mb.quad([Math.cos(a)*r0,0,Math.sin(a)*r0],[Math.cos(a)*r1,0,Math.sin(a)*r1],[Math.cos(b)*r1,0,Math.sin(b)*r1],[Math.cos(b)*r0,0,Math.sin(b)*r0],c)}}SATRING=mb.build()}
  for(let k=0;k<4;k++){const mb=new MB();const rr=rngG(300+k);mb.ico([0,0,0],1,hx(['#6a625a','#7a7068','#5a5550','#857a70'][k]),0,0.7+rr()*0.3);ROCK.push(mb.build())}}
