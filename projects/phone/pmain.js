// ===================== WHAT IF EVERY PHONE RANG AT ONCE =====================
const FPS=30,DUR=65,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x,lerp=(a,b,k)=>a+(b-a)*k;
const SERIF='Lora, "Noto Color Emoji", serif',SANS='Inter, "Noto Color Emoji"';
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
initGL();initAssets();buildSpace();buildModels();buildPlanets();
const RE=6371;
// ---------- timeline ----------
const T_RING=8.0;
const SC=[[0,'intro'],[8,'ring'],[14,'crane'],[20,'answer'],[27,'earth'],[33,'tower'],[40,'silence'],[46,'mom'],[52,'decline'],[60.4,'end'],[64.4,'loop']];
function scAt(t){for(let i=SC.length-1;i>=0;i--)if(t>=SC[i][0])return[SC[i][1],t-SC[i][0],i];return['intro',t,0]}
// captions: [start,end,text]; *word* = highlighted
const CAPS=[[8.5,14,'*8 billion* phones ring at once'],[14.3,17.2,'Times Square sounds like a *rock concert*'],[17.2,20,'Every *pigeon* in New York takes off'],[20.4,27,'Everyone *answers* at the same time'],[27.4,33,'*8 billion calls* hit the network in 1 second'],[33.4,37,'Cell towers *can\'t handle it*'],[37,40,'…and *overload*'],[40.5,43.4,'*Silence.* Nobody is there.'],[43.4,46,'So *who* called?'],[49.2,52,'Every. Single. *Phone.*'],[52.4,55.6,'Everyone *declines*'],[55.6,60.4,'Except *one guy*']];
const LABELS=[[0,'EVERY PHONE RINGS IN','TIMES SQUARE, NEW YORK'],[8,'ALL PHONES RINGING FOR','TIMES SQUARE, NEW YORK'],[27,'GLOBAL CALLS PER SECOND','PLANET EARTH'],[33,'NETWORK LOAD','ROOFTOP, MIDTOWN'],[40,'TIME SINCE THE CALL','TIMES SQUARE, NEW YORK']];
// ---------- helpers ----------
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
function tube(m,a,b,r0,r1,col,seg,mat){seg=seg||10;const y=V.sub(b,a);const yn=V.norm(y);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);
  const ring=(c,r)=>{const o=[];for(let i=0;i<seg;i++){const ang=i/seg*TAU2;o.push(V.add(c,V.add(V.sc(x,Math.cos(ang)*r),V.sc(z,Math.sin(ang)*r))))}return o};const A=ring(a,r0),B=ring(b,r1);for(let i=0;i<seg;i++){const j=(i+1)%seg;m.quad(A[i],A[j],B[j],B[i],col,mat)}}
function segM(a,b,r){const y=V.sub(b,a);const L=V.len(y)||1e-6;const yn=V.sc(y,1/L);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);const mid=V.sc(V.add(a,b),0.5);
  return new Float32Array([x[0]*r,x[1]*r,x[2]*r,0,y[0],y[1],y[2],0,z[0]*r,z[1]*r,z[2]*r,0,mid[0],mid[1],mid[2],1])}
const UBE=um(m=>m.box([0,0,0],[1,1,1],[1,1,1],MAT.emis));
// ---------- baked crowd ----------
const SHIRTS=['#e04848','#3c8de0','#52c060','#f0d040','#f2f2f2','#e07fd0','#ff8a30','#40c8c8','#8a60d0','#2a2a2a','#c84a6a','#6a8a3a'].map(hx),PANTS=['#2c3245','#3a4a6a','#5a4a3a','#1a1a1a','#6a6a70','#c8b89a'].map(hx),SKINS=['#e6b394','#c88a62','#8a5a3c','#f2c8a8','#a8704a'].map(hx),HAIRS=['#3a2a22','#1a1a1a','#8a5a30','#d8b060','#6a6a6a'].map(hx);
const rcol=(r,a)=>a[Math.floor(r()*a.length)];
function bakePerson(m,x,z,yaw,pal,pose,s,lean){s=s||1;const cs=Math.cos(yaw),sn=Math.sin(yaw);const P=(lx,ly,lz)=>[x+(lx*cs+lz*sn)*s,ly*s,z+(-lx*sn+lz*cs)*s];const R=r=>r*s;
  const st=pose==='walk'?0.18:0.02;
  tube(m,P(-0.1,0.08,st),P(-0.1,0.9,0),R(0.075),R(0.09),pal.pant,8);tube(m,P(0.1,0.08,-st),P(0.1,0.9,0),R(0.075),R(0.09),pal.pant,8);
  m.ico(P(-0.1,0.06,st-0.05),R(0.08),pal.shoe,0,0.55,[5,8]);m.ico(P(0.1,0.06,-st-0.05),R(0.08),pal.shoe,0,0.55,[5,8]);
  m.ico(P(0,0.92,0),R(0.18),pal.pant,0,0.5,[6,10]);tube(m,P(0,0.9,0),P(0,1.38,0),R(0.17),R(0.19),pal.shirt,10);m.ico(P(0,1.4,0),R(0.2),pal.shirt,0,0.42,[6,10]);
  const hz=pose==='phone'||pose==='red'?-0.05:0;m.ico(P(0,1.52,hz*0.5),R(0.05),pal.skin,0,1.5,[4,6]);m.ico(P(0,1.66,hz),R(0.115),pal.skin,0,1.12,[8,10]);m.ico(P(0,1.73,hz+0.012),R(0.12),pal.hair,0,0.62,[6,10]);
  // left arm down
  const sw=pose==='walk'?0.12:0;tube(m,P(-0.24,1.4,0),P(-0.26,1.08,-sw),R(0.055),R(0.05),pal.shirt,8);tube(m,P(-0.26,1.08,-sw),P(-0.25,0.84,-sw*1.5),R(0.048),R(0.044),pal.skin,8);
  if(pose==='walk'){tube(m,P(0.24,1.4,0),P(0.26,1.08,sw),R(0.055),R(0.05),pal.shirt,8);tube(m,P(0.26,1.08,sw),P(0.25,0.84,sw*1.5),R(0.048),R(0.044),pal.skin,8)}
  else if(pose==='ear'){tube(m,P(0.24,1.4,0),P(0.36,1.2,-0.05),R(0.055),R(0.05),pal.shirt,8);tube(m,P(0.36,1.2,-0.05),P(0.15,1.62,-0.03),R(0.048),R(0.044),pal.skin,8);m.box(P(0.13,1.66,-0.04),[R(0.02),R(0.15),R(0.075)],[0.08,0.08,0.1],0,yaw)}
  else{tube(m,P(0.24,1.4,0),P(0.25,1.1,-0.06),R(0.055),R(0.05),pal.shirt,8);tube(m,P(0.25,1.1,-0.06),P(0.1,1.18,-0.34),R(0.048),R(0.044),pal.skin,8);tube(m,P(-0.26,1.08,0),P(-0.08,1.16,-0.33),R(0.046),R(0.044),pal.skin,8);
    m.box(P(0.01,1.2,-0.36),[R(0.085),R(0.02),R(0.15)],[0.08,0.08,0.1],0,yaw);m.box(P(0.01,1.213,-0.36),[R(0.072),R(0.008),R(0.13)],pose==='red'?[1,0.2,0.2]:[0.75,0.9,1],MAT.emis,yaw)}}
const HERO_C=[9,0,0];const HEROES=[[9,0],[10.1,-0.8],[8.0,-1.2],[10.7,0.9],[7.6,0.6],[9.5,-2.4]];
let CROWD={};{const r=rngG(11);const spots=[];
  for(let i=0;i<520;i++){let x,z;const zone=r();if(zone<0.42){x=6.5+r()*13.5}else if(zone<0.84){x=-(6.5+r()*13.5)}else{x=(r()-0.5)*12;z=-20-r()*6}if(z==null)z=30-r()*150;if(Math.hypot(x-HERO_C[0],z-HERO_C[2])<3.6)continue;spots.push({x,z,yaw:r()*TAU2,dir:r()<0.5?1:-1,pal:{shirt:rcol(r,SHIRTS),pant:rcol(r,PANTS),skin:rcol(r,SKINS),hair:rcol(r,HAIRS),shoe:r()<0.5?[0.95,0.95,0.95]:[0.15,0.15,0.17]},s:0.92+r()*0.16})}
  for(const pose of['walk','phone','ear','red'])for(const g of[1,-1]){const m=new MB();for(const p of spots)if(p.dir===g){const yaw=pose==='walk'?(g>0?0:Math.PI):p.yaw;bakePerson(m,p.x,p.z,yaw,p.pal,pose,p.s)}CROWD[pose+(g>0?'A':'B')]=m.build(0.5)}}
// ---------- Times Square ----------
let TSQ,BILL=[];{const m=new MB();const r=rngG(3);
  ground(m,-6,-400,6,60,hx('#3c3e44'),0,10,(x,z)=>{const n=0.24+0.03*hsh(x|0,z|0);return[n,n,n*1.08]});
  for(const s of[-1,1]){ground(m,s>0?6:-22,-400,s>0?22:-6,60,null,0.12,4,(x,z)=>{const q=hsh(Math.floor(x/2)+40,Math.floor(z/2));return q<0.5?hx('#9a4a42'):hx('#a8564c')});m.box([s*6,0.06,-170],[0.3,0.14,460],hx('#b0aca4'));}
  for(let i=-5;i<=5;i++)m.box([i*1.1,0.015,-24],[0.55,0.02,4],[0.92,0.92,0.9]);for(let z=-380;z<50;z+=8)m.box([0,0.015,z],[0.15,0.02,4],hx('#f2cf2e'));for(const x of[-3,3])for(let z=-380;z<50;z+=6)m.box([x,0.015,z],[0.12,0.02,3],[0.9,0.9,0.9]);
  for(const s of[-1,1])for(let z=40;z>-400;){const w=14+r()*16,d=24+r()*30,h=50+r()*160;const x=s*(22.5+w/2);skyscraper(m,x,z-d/2,w,d,h,hx(['#7a8494','#8c96a8','#5a6270','#9a9488','#6a7280'][Math.floor(r()*5)]));
    // billboards on facade
    const nb=1+Math.floor(r()*3);for(let k=0;k<nb;k++){const bh=6+r()*12,bw=Math.min(d-3,8+r()*14),by=6+k*14+r()*4,bz=z-d/2+(r()-0.5)*(d-bw-2);BILL.push({s,x:s*22.35,y:by,z:bz,w:bw,h:bh,seed:BILL.length})}z-=d+0.5}
  // street lamps & lights
  for(const s of[-1,1])for(let z=30;z>-300;z-=22){m.prism([s*6.6,0,z],0.08,0.06,6,8,hx('#2a2c30'));m.box([s*6.0,6,z],[1.3,0.1,0.1],hx('#2a2c30'));m.box([s*5.4,5.9,z],[0.5,0.12,0.25],[1,0.95,0.8],MAT.emis)}
  TSQ=m.build(0.5)}
function billMesh(b){const m=new MB();const r=rngG(b.seed*7+3);const pal=[['#ff3a6a','#ffd23a'],['#2a7aff','#ffffff'],['#ff8a1a','#2a1a10'],['#10d0a0','#0a2a4a'],['#c03aff','#ffe0ff'],['#ffffff','#e02020'],['#1a1a1a','#ffcc00'],['#30c0ff','#ff4ad0']][b.seed%8].map(hx);
  const n=-b.s;const X=b.x;const Q=(z0,y0,z1,y1,col,off)=>{const xx=X+n*(off||0);m.quad([xx,y0,z0],[xx,y1,z0],[xx,y1,z1],[xx,y0,z1],col,MAT.emis)};
  m.box([X-n*0.15,b.y+b.h/2,b.z],[0.3,b.h+0.6,b.w+0.6],[0.1,0.1,0.12]);
  const z0=b.z-b.w/2,z1=b.z+b.w/2;Q(z0,b.y,z1,b.y+b.h,[pal[0],mix3(pal[0],[0,0,0],0.4),mix3(pal[0],[0,0,0],0.4),pal[0]],0.02);
  const kind=b.seed%4;if(kind===0){for(let i=0;i<3;i++)Q(z0+b.w*0.1,b.y+b.h*(0.2+i*0.22),z0+b.w*(0.4+r()*0.5),b.y+b.h*(0.32+i*0.22),pal[1],0.05)}
  else if(kind===1){const cz=b.z,cy=b.y+b.h/2,rr=Math.min(b.w,b.h)*0.32;for(let i=0;i<24;i++){const a=i/24*TAU2,c=(i+1)/24*TAU2;m.tri([X+n*0.05,cy,cz],[X+n*0.05,cy+Math.sin(a)*rr,cz+Math.cos(a)*rr],[X+n*0.05,cy+Math.sin(c)*rr,cz+Math.cos(c)*rr],pal[1],MAT.emis)}}
  else if(kind===2){Q(z0+b.w*0.05,b.y+b.h*0.62,z1-b.w*0.05,b.y+b.h*0.85,pal[1],0.05);Q(z0+b.w*0.05,b.y+b.h*0.15,z0+b.w*0.5,b.y+b.h*0.5,mix3(pal[1],pal[0],0.4),0.05)}
  else{for(let i=0;i<5;i++)Q(z0+b.w*(0.08+i*0.18),b.y+b.h*0.15,z0+b.w*(0.18+i*0.18),b.y+b.h*(0.3+r()*0.55),pal[1],0.05)}
  return m.build()}
BILL.forEach(b=>b.mesh=billMesh(b));
// ---------- tower scene ----------
let ROOF,TOWER;{const m=new MB();const r=rngG(8);m.box([0,-0.5,0],[30,1,30],hx('#6a6a70'));ground(m,-15,-15,15,15,null,0.01,3,(x,z)=>{const q=0.4+0.1*hsh(x|0,z|0);return[q,q,q*1.04]});
  for(const s of[-1,1]){m.box([s*15,0.5,0],[0.4,1,30],hx('#8a8a90'));m.box([0,0.5,s*15],[30,1,0.4],hx('#8a8a90'))}m.box([-8,1.2,6],[4,2.4,3],hx('#9a9aa0'));m.box([7,1,-7],[3,2,3],hx('#7a7a80'));
  for(let i=0;i<70;i++){const a=r()*TAU2,d=40+r()*400;const w=15+r()*25,h=-60+r()*200;if(h<5)continue;skyscraper(m,Math.cos(a)*d,Math.sin(a)*d,w,w,h,hx(['#5a6270','#6a7280','#4a525e'][i%3]))}
  m.box([0,-80,0],[30,159,30],hx('#5a6270'),MAT.win);ROOF=m.build(0.5);
  const t=new MB();const legs=[[-1.2,-1.2],[1.2,-1.2],[1.2,1.2],[-1.2,1.2]];const top=0.35,Ht=16;const c=hx('#b8bcc4');
  for(let i=0;i<4;i++){const [x0,z0]=legs[i],[x1,z1]=legs[(i+1)%4];tube(t,[x0,0,z0],[x0*top,Ht,z0*top],0.07,0.05,c,8);for(let k=0;k<8;k++){const y0=k*Ht/8,y1=(k+1)*Ht/8;const f0=1-(1-top)*y0/Ht,f1=1-(1-top)*y1/Ht;tube(t,[x0*f0,y0,z0*f0],[x1*f1,y1,z1*f1],0.03,0.03,c,6);tube(t,[x0*f0,y0,z0*f0],[x1*f0,y0,z1*f0],0.03,0.03,c,6)}}
  tube(t,[0,Ht,0],[0,Ht+3,0],0.06,0.04,c,8);for(let i=0;i<3;i++){const a=i/3*TAU2;t.box([Math.cos(a)*0.75,Ht-1.5,Math.sin(a)*0.75],[0.35,2.2,0.12],[0.92,0.92,0.94],0,-a+Math.PI/2);t.box([Math.cos(a)*0.75,Ht-5.0,Math.sin(a)*0.75],[0.35,2.0,0.12],[0.92,0.92,0.94],0,-a+Math.PI/2)}
  t.ico([0.8,Ht-8,0.3],0.6,[0.92,0.92,0.94],0,0.35,[8,12]);t.box([0,0.3,0],[3.2,0.6,3.2],hx('#5a5a60'));TOWER=t.build(0.5)}
const TOWER_PTS=[[0.75,14.5,0],[-0.37,14.5,0.65],[-0.37,14.5,-0.65],[0.75,11,0],[-0.37,11,0.65],[0,19,0]];
// ---------- walker (hero) ----------
function walker(base,phase,o,pal){o=o||{};const items=[];const B=M4.trs(base,o.yaw==null?Math.PI:o.yaw,o.lean||0,0,o.s||1);const amp=o.amp==null?1:o.amp;
  const put=(M,mesh,off,s,col,ns,extra)=>{items.push(Object.assign({mesh,M:M4.mul(M,M4.trs(off,0,0,0,s)),tint:col,tintAmt:1,noShadow:!!ns},extra||{}))};const J=(M,t,rx,rz)=>M4.mul(M,M4.trs(t,0,rx||0,rz||0,1));
  const hipY=0.94,Lt=0.44,Ls=0.44;const P=J(B,[0,hipY+0.03*amp*Math.abs(Math.cos(phase)),0],0.02);put(P,USPH,[0,0.02,0],[0.17,0.11,0.11],pal.pant);
  const Tq=J(P,[0,0.05,0],-0.04);put(Tq,UCYL,[0,0.24,0],[0.165,0.44,0.115],pal.shirt);put(Tq,USPH,[0,0.02,0],[0.165,0.07,0.115],pal.shirt);put(Tq,USPH,[0,0.46,0],[0.2,0.09,0.12],pal.shirt);
  if(pal.jacket){put(Tq,UB,[0,0.2,0.118],[0.06,0.4,0.01],pal.jacket,1)}
  const Hd=J(Tq,[0,0.52,0],0.02+(o.head||0),o.headRoll||0);put(Hd,UCYL,[0,0.04,0],[0.05,0.08,0.05],pal.skin);put(Hd,USPH,[0,0.17,0.01],[0.105,0.125,0.11],pal.skin);put(Hd,USPH,[0,0.225,-0.012],[0.112,0.09,0.114],pal.hair,1);
  if(pal.cap){put(Hd,USPH,[0,0.255,0.0],[0.118,0.065,0.12],pal.cap,1);put(Hd,USPH,[0,0.235,0.1],[0.085,0.012,0.08],pal.cap,1)}for(const sx of[-1,1])put(Hd,USPH,[sx*0.105,0.17,0],[0.02,0.03,0.025],pal.skin,1);put(Hd,USPH,[0,0.15,0.11],[0.016,0.02,0.02],mix3(pal.skin,[0.6,0.3,0.3],0.25),1);
  for(const sx of[-1,1])put(Hd,USPH,[sx*0.04,0.18,0.098],[0.014,0.018,0.01],[0.08,0.08,0.1],1);if(o.mouth)put(Hd,USPH,[0,0.115,0.105],[0.03,0.012+0.015*o.mouth,0.01],[0.3,0.08,0.08],1);
  for(const sx of[-1,1]){const p=phase+(sx>0?Math.PI:0);const th=-0.42*amp*Math.sin(p);const kn=0.08+0.55*amp*Math.max(0,Math.cos(p+0.4));
    const Hp=J(P,[sx*0.095,0,0],th);put(Hp,USPH,[0,0,0],[0.09,0.09,0.09],pal.pant);put(Hp,UCYL,[0,-Lt/2,0],[0.085,Lt,0.09],pal.pant);const K=J(Hp,[0,-Lt,0],kn);put(K,USPH,[0,0,0],[0.075,0.075,0.075],pal.pant);put(K,UCYL,[0,-Ls/2,0],[0.068,Ls,0.07],pal.pant);
    const A=J(K,[0,-Ls,0],-kn*0.5-th*0.3);put(A,USPH,[0,-0.035,0.06],[0.065,0.05,0.135],pal.shoe);put(A,USPH,[0,-0.07,0.06],[0.066,0.02,0.136],pal.sole||[0.9,0.9,0.9])}
  for(const sx of[-1,1]){const p=phase+(sx>0?0:Math.PI);const R_=sx<0; // sx<0 = right arm (character's right when facing +z? whichever)
    const sh=R_&&o.armR!=null?o.armR:(!R_&&o.armL!=null?o.armL:0.38*amp*Math.sin(p));const ao=R_&&o.outR!=null?o.outR:(!R_&&o.outL!=null?o.outL:0.1);const el=R_&&o.elR!=null?o.elR:(!R_&&o.elL!=null?o.elL:-0.35);
    const S=J(Tq,[sx*0.2,0.43,0],sh,sx*ao);put(S,USPH,[0,0,0],[0.065,0.065,0.065],pal.shirt);put(S,UCYL,[0,-0.14,0],[0.058,0.28,0.058],pal.shirt);
    const E=J(S,[0,-0.28,0],el,R_&&o.twR!=null?o.twR:0);put(E,USPH,[0,0,0],[0.055,0.055,0.055],pal.shirt);put(E,UCYL,[0,-0.12,0],[0.05,0.24,0.05],pal.shirt);put(E,USPH,[0,-0.27,0],[0.045,0.055,0.05],pal.skin);
    if(R_&&o.phone){const Ph=M4.mul(E,M4.trs([0,-0.29,0.03],0,0,0,1));put(Ph,UB,[0,0,0],[0.08,0.16,0.012],[0.06,0.06,0.08],1);put(Ph,UBE,[0,0,0.0075],[0.07,0.145,0.003],o.screen||[0.7,0.88,1],1)}}
  return items}
const HPAL=[{shirt:hx('#e2483a'),pant:hx('#2c3a5a'),shoe:[0.96,0.96,0.96],skin:hx('#e6b394'),hair:hx('#3a2a22'),cap:hx('#1f6fd8')},{shirt:hx('#f0d040'),pant:hx('#3a3a40'),shoe:[0.15,0.15,0.17],skin:hx('#8a5a3c'),hair:hx('#1a1a1a')},{shirt:hx('#40c8c8'),pant:hx('#c8b89a'),shoe:[0.96,0.96,0.96],skin:hx('#f2c8a8'),hair:hx('#d8b060')},{shirt:hx('#2a2a2a'),pant:hx('#3a4a6a'),shoe:[0.9,0.3,0.3],skin:hx('#c88a62'),hair:hx('#1a1a1a'),cap:hx('#e04848')},{shirt:hx('#8a60d0'),pant:hx('#1a1a1a'),shoe:[0.96,0.96,0.96],skin:hx('#e6b394'),hair:hx('#8a5a30')},{shirt:hx('#52c060'),pant:hx('#2c3245'),shoe:[0.15,0.15,0.17],skin:hx('#a8704a'),hair:hx('#1a1a1a')}];
// ---------- poses ----------
function heroPose(t,i){const lag=i*0.12;const o={phone:false,amp:0,armR:null};const sc=scAt(t)[0];
  if(t<T_RING)return{amp:1};
  const k=ease((t-T_RING-0.3-lag)/0.5);let mode='look';
  if(t>=20.2+lag*0.5&&t<40)mode='ear';if(t>=52.4+lag*0.4&&t<55.2)mode='decline';if(t>=55.2)mode=i===0?'ear':'pocket';
  if(mode==='look'||mode==='decline'){o.phone=k>0.05;o.armR=lerp(0,-0.75,k);o.elR=lerp(-0.35,-1.35,k);o.outR=0.12;o.head=0.32*k;o.armL=lerp(0,-0.55,k);o.elL=lerp(-0.35,-1.2,k);o.outL=-0.1*k;if(mode==='decline')o.screen=t-52.4-lag*0.4>0.25?[1,0.25,0.25]:[0.7,0.88,1]}
  if(mode==='ear'){const ke=ease((t-(t>=55.2?55.2:20.2+lag*0.5))/0.4);o.phone=true;o.armR=lerp(-0.75,-0.35,ke);o.outR=lerp(0.12,0.95,ke);o.elR=lerp(-1.35,-2.35,ke);o.head=lerp(0.32,-0.05,ke);o.headRoll=0.12*ke;o.armL=lerp(-0.55,0,ke);o.elL=lerp(-1.2,-0.35,ke);o.mouth=Math.max(0,Math.sin(t*14+i))*(t>=21&&t<27||t>=56?1:0)}
  if(mode==='pocket'){o.phone=false}
  if(t>=40&&t<52.4&&mode!=='decline'){o.phone=true;o.armR=-0.75;o.elR=-1.35;o.outR=0.12;o.head=0.32;o.armL=-0.55;o.elL=-1.2;o.outL=-0.1;if(t>40&&t<43.4){o.head=0.05;o.headRoll=0.15*Math.sin(t*1.5+i)}}
  return o}
// ---------- pigeons ----------
function pigeons(items,t){const k0=16.4;if(t<k0-0.2||t>27)return;for(let i=0;i<60;i++){const st=k0+hsh(i,1)*0.9;const k=t-st;const p0=[HERO_C[0]+(hsh(i,2)-0.5)*14,0,HERO_C[2]-4-hsh(i,3)*20];let p=p0,fl=0;if(k>0){const up=k*k*2.5+k*6;p=[p0[0]+(hsh(i,4)-0.5)*k*6,up,p0[2]-k*4];fl=Math.sin(t*28+i)}
  const R=M4.trs(p,hsh(i,5)*TAU2,k>0?-0.3:0,0,2.6);const g=hx('#8a8e9a');items.push({mesh:USPH,M:M4.mul(R,M4.trs([0,0.12,0],0,0,0,[0.09,0.08,0.15])),tint:g,tintAmt:1});items.push({mesh:USPH,M:M4.mul(R,M4.trs([0,0.2,-0.1],0,0,0,0.055)),tint:hx('#5a6a7a'),tintAmt:1});
  for(const s of[-1,1])items.push({mesh:UB,M:M4.mul(R,M4.trs([s*0.1,0.15,0],0,0,s*(0.2+fl*0.9),[0.2,0.015,0.11])),tint:hx('#7a7e8a'),tintAmt:1});if(k<=0)for(const s of[-1,1])items.push({mesh:UCYL,M:M4.mul(R,M4.trs([s*0.03,0.04,0],0,0,0,[0.01,0.08,0.01])),tint:hx('#e07060'),tintAmt:1})}}
// ---------- envs ----------
function envTS(){return envDay({sun:[-0.5,0.38,0.6],sunCol:hx('#ffc89a'),sky:hx('#7a8cc0'),gnd:hx('#5a4a50'),fog:hx('#c8a8b0'),fogD:420,zen:hx('#1e3a8a'),hor:hx('#f0a088'),stars:0,night:0.6,emis:1.15,sunSize:1.5})}
function envTower(t){const e=envTS();e.fogD=900;e.night=0.85;return e}
// ---------- cameras ----------
function camTS(t){const sc=scAt(t);const nm=sc[0],k=sc[1];
  if(nm==='intro'){const u=k/8;return{eye:[lerp(13.5,11.6,u),lerp(2.4,1.8,u),lerp(16,6.5,u)],at:[lerp(4,6.5,u),lerp(6,2.2,u),lerp(-60,-8,u)]}}
  if(nm==='ring'){const u=k/6;return{eye:[lerp(12.6,12.0,u),lerp(1.8,1.7,u),lerp(5.2,4.4,u)],at:[9.1,1.25,-0.7]}}
  if(nm==='crane'){const u=ease(k/6);return{eye:[lerp(12.5,15,u),lerp(2.2,24,u),lerp(6,24,u)],at:[lerp(9,6,u),lerp(1.4,0,u),lerp(-1,-24,u)]}}
  if(nm==='answer'){const u=k/7;return{eye:[lerp(6.2,6.8,u),1.75,lerp(3.8,4.2,u)],at:[9.3,1.5,-0.7]}}
  if(nm==='silence'){const u=k/6;return{eye:[lerp(14.5,13.5,u),lerp(5,4.2,u),lerp(10,8,u)],at:[9,1.2,-1]}}
  if(nm==='mom'){const u=ease(k/3);if(k<3)return{eye:[lerp(9.35,9.32,u),lerp(1.95,1.85,u),lerp(0.62,0.52,u)],at:[9.05,1.15,-0.32]};const u2=ease((k-3)/3);return{eye:[lerp(10,16,u2),lerp(3,18,u2),lerp(4,22,u2)],at:[8,0.5,-14]}}
  if(nm==='decline'){if(k<3.2){const u=k/3.2;return{eye:[lerp(16,15,u),lerp(18,14,u),lerp(22,18,u)],at:[8,0.5,-14]}}const u=ease((k-3.2)/1.4);return{eye:[lerp(15,10.6,u),lerp(14,1.75,u),lerp(18,2.6,u)],at:[lerp(8,9,u),lerp(0.5,1.55,u),lerp(-14,0,u)]}}
  if(nm==='end'||nm==='loop')return{eye:[10.6,1.75,2.6],at:[9,1.55,0]};
  return{eye:[11,1.6,3],at:[9,1.3,0]}}
// ---------- scene renders ----------
let LASTVP=null,LASTMODE='';
function renderTS(t){const items=[{mesh:TSQ}];const nm=scAt(t)[0];
  for(const b of BILL){let tint=null,ta=0;if(t>=36.5&&t<40.5){const g=hsh(b.seed,Math.floor(t*12));if(g<0.3){tint=[0.05,0.05,0.06];ta=1}}items.push({mesh:b.mesh,tint,tintAmt:ta})}
  const walkOff=Math.min(t,T_RING)-T_RING;let poseKey='walk';if(t>=T_RING+0.5)poseKey='phone';if(t>=20.4&&t<40)poseKey='ear';if(t>=52.6&&t<55.4)poseKey='red';if(t>=55.4)poseKey='walk';
  const bob=t<T_RING?0.03*Math.abs(Math.sin(t*6)):0;items.push({mesh:CROWD[poseKey+'A'],M:M4.trs([0,bob,walkOff*-1.1],0,0,0,1)});items.push({mesh:CROWD[poseKey+'B'],M:M4.trs([0,bob,walkOff*1.1],0,0,0,1)});
  // taxis
  const lanes=[-4.5,-1.5,1.5,4.5];for(let i=0;i<14;i++){const lane=lanes[i%4];const dir=lane<0?1:-1;const v=7+hsh(i,2)*3;const z0=-20-hsh(i,1)*200;
    const tb=11.0+hsh(i,4)*1.2;const tt=Math.min(t,tb);let z=z0+dir*v*tt;let pitch=0;if(t>tb){const kb=Math.min(t-tb,0.8);z+=dir*v*(kb-kb*kb/1.6);pitch=(t-tb<0.8?Math.sin((t-tb)/0.8*Math.PI)*0.04:0)*dir}
    z=((z+260)%300+300)%300-260;items.push({mesh:SEDAN[i%3===0?2:4],M:M4.trs([lane,0,z],dir>0?Math.PI:0,pitch,0,1)})}
  // heroes
  HEROES.forEach(([x,z],i)=>{const o=heroPose(t,i);const dir=i%2?1:-1;let zz=z;let yaw=i%2?0:Math.PI;let ph=t*6.2+i;if(t<T_RING){zz=z+dir*1.25*(t-T_RING)}else{yaw=yaw+(i===0?0:Math.sin(i*2.1)*0.5);if(i===2)yaw=Math.PI*0.5}
    if(t<T_RING)o.amp=1;else o.amp=lerp(1,0,clamp((t-T_RING)/0.4,0,1));items.push(...walker([x,0,zz],ph,Object.assign(o,{yaw}),HPAL[i]))});
  pigeons(items,t);
  const c=camTS(t);LASTVP=renderGL(envTS(),{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:2500},{center:[HERO_C[0],0,HERO_C[2]-2],radius:nm==='crane'||nm==='decline'||nm==='mom'?28:9},items,t);LASTMODE='ts'}
function renderEarth(t,k){const EM=M4.trs([0,0,0],1.1+k*0.05,0.35,0,1);const d=RE*(5.0-k*0.1);LASTVP=renderGL({sun:[0.5,0.35,0.8],sunCol:hx('#fff6e6'),sky:[0.25,0.3,0.45],gnd:[0.02,0.02,0.05],fog:[0,0,0],fogD:1e9,zen:[0,0,0.01],hor:[0.01,0.01,0.03],stars:1,night:0,emis:1,sunSize:1.5},{eye:[0,RE*0.15,d],at:[0,0,0],fov:0.85,near:100,far:200000},null,[{mesh:EARTH,M:EM},{mesh:EPATCH,M:EM}],t);LASTMODE='earth';EARTH_M=EM}
let EARTH_M=M4.id();
function renderTower(t,k){const items=[{mesh:ROOF},{mesh:TOWER}];const over=k>=4.0;
  // beacon
  const bl=!over||k<4.6?(Math.sin(t*5)>0?1:0.2):0;items.push({mesh:UEMIS,M:M4.trs([0,19.1,0],0,0,0,0.18),tint:[1,0.15,0.1],tintAmt:1});if(bl>0.5)items.push({mesh:UEMIS,M:M4.trs([0,19.1,0],0,0,0,0.6),tint:[1,0.2,0.1],tintAmt:1,alpha:0.35,add:1,noShadow:true});
  // overload glow on antennas
  const heat=clamp((k-0.5)/3.5,0,1);for(const p of TOWER_PTS.slice(0,5))items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.12+heat*0.22+0.04*Math.sin(t*30)),tint:mix3([0.4,0.7,1],[1,0.5,0.15],heat),tintAmt:1,alpha:0.35+heat*0.4,add:1,noShadow:true});
  // sparks
  for(let i=0;i<70;i++){const st=1.2+hsh(i,1)*5.5;const kk=((k-st)%0.9+0.9)%0.9;if(k<st)continue;if(!over&&hsh(i,9)>heat)continue;const p0=TOWER_PTS[i%5];const v=[(hsh(i,2)-0.5)*5,1+hsh(i,3)*3,(hsh(i,4)-0.5)*5];const mult=over&&k<5?2:1;const p=[p0[0]+v[0]*kk*mult,p0[1]+v[1]*kk-4.9*kk*kk,p0[2]+v[2]*kk*mult];items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.06),tint:[1,0.85,0.4],tintAmt:1,alpha:1-kk/0.9,add:1,noShadow:true})}
  // smoke
  if(k>2.5)for(let i=0;i<14;i++){const kk=((k-2.5-i*0.25)%3.5+3.5)%3.5;if(k-2.5<i*0.25)continue;const p0=TOWER_PTS[i%5];items.push({mesh:USPH,M:M4.trs([p0[0]+kk*0.8,p0[1]+kk*2.2,p0[2]+kk*0.4],0,0,0,0.3+kk*0.6),tint:[0.25,0.25,0.27],tintAmt:1,alpha:0.45*(1-kk/3.5),noShadow:true})}
  if(over&&k<4.8){const kk=k-4;items.push({mesh:UEMIS,M:M4.trs([0,14,0],0,0,0,1+kk*5),tint:[1,0.7,0.3],tintAmt:1,alpha:(1-kk/0.8)*0.6,add:1,noShadow:true})}
  const u=k/7;const c={eye:[lerp(9,7,u),lerp(4,6,u),lerp(13,10,u)],at:[0,lerp(11,13,u),0]};LASTVP=renderGL(envTower(t),{eye:c.eye,at:c.at,fov:0.95,near:0.1,far:3000},{center:[0,8,0],radius:16},items,t);LASTMODE='tower'}
function renderScene(t){let tt=t;if(t>=64.4)tt=t-64.4;const [nm,k]=scAt(tt);if(nm==='earth')renderEarth(tt,k);else if(nm==='tower')renderTower(tt,k);else renderTS(tt)}
function shakeAmt(t){if(t>=64.4)t-=64.4;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(T_RING,10,1.2);if(t>=T_RING&&t<20)a+=2.5;S(17.2,4,1);S(37,18,1.0);if(t>=33&&t<37)a+=(t-33)*0.8;return a}
// ---------- overlays ----------
function capText(s,x,y,size,align){// *x* highlight
  const parts=s.split('*');ctx.font=`500 ${size}px ${SERIF}`;let total=0;const ws=parts.map(p=>{const w=ctx.measureText(p).width;total+=w;return w});let cx=align==='left'?x:x-total/2;
  ctx.textAlign='left';ctx.textBaseline='middle';parts.forEach((p,i)=>{ctx.shadowColor='rgba(0,0,0,0.65)';ctx.shadowBlur=16;ctx.shadowOffsetY=3;ctx.fillStyle=i%2?'#7ab4ff':'#ffffff';ctx.fillText(p,cx,y);cx+=ws[i]});ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0}
function wrapCap(s,y,size,al){ctx.save();ctx.globalAlpha=al;ctx.font=`500 ${size}px ${SERIF}`;const plain=s.replace(/\*/g,'');if(ctx.measureText(plain).width<940){capText(s,W/2,y,size)}else{const words=s.split(' ');let best=1,bd=1e9;for(let i=1;i<words.length;i++){const a=words.slice(0,i).join(' ').replace(/\*/g,''),b=words.slice(i).join(' ').replace(/\*/g,'');const d=Math.abs(ctx.measureText(a).width-ctx.measureText(b).width);if(d<bd){bd=d;best=i}}
  let l1=words.slice(0,best).join(' '),l2=words.slice(best).join(' ');{const mw=Math.max(ctx.measureText(l1.replace(/\*/g,'')).width,ctx.measureText(l2.replace(/\*/g,'')).width);if(mw>930)size=size*930/mw}const fix=(a,b)=>{const n=(a.match(/\*/g)||[]).length;if(n%2){a=a+'*';b='*'+b}return[a,b]};[l1,l2]=fix(l1,l2);capText(l1,W/2,y-size*0.6,size);capText(l2,W/2,y+size*0.62,size)}ctx.restore()}
function fmtT(s){s=Math.max(0,s);const m=Math.floor(s/60),r=s-m*60;return`${m}:${r.toFixed(3).padStart(6,'0')}`}
function spaced(s,x,y,size,col,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`600 ${size}px ${SANS}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=col||'#fff';ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=10;let cx=x;for(const ch of s){ctx.fillText(ch,cx,y);cx+=ctx.measureText(ch).width+size*0.22}ctx.restore()}
function drawLabel(t){if(t>=60.4)return;let L=LABELS[0];for(const l of LABELS)if(t>=l[0])L=l;let val;
  if(L[0]===0)val=fmtT(T_RING-t);else if(L[0]===8)val=fmtT(t-T_RING);else if(L[0]===27){const n=Math.floor(8e9*easeOut((t-27.2)/2.5));val=n.toLocaleString('en-US')}else if(L[0]===33){val=Math.floor(clamp(100+(t-33)*95,100,999))+'%'+(t>=37?' ⚠️':'')}else val=fmtT(t-40+0.0);
  const x=70,y=t<T_RING?820:1100;const red=L[0]===33&&t>35;spaced(L[1],x,y,30,'#ffffff',0.95);ctx.save();ctx.font=`400 ${L[0]===27?96:110}px ${SERIF}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=14;ctx.fillStyle=red?'#ff6a5a':'#ffffff';ctx.fillText(val,x-4,y+78);ctx.restore();spaced(L[2],x,y+160,26,'#ffffff',0.85)}
function drawTitle(t){if(t>=T_RING+0.4)return;const a=t<T_RING-0.4?1:clamp((T_RING+0.4-t)/0.8,0,1);const k=easeOut(t/0.6);ctx.save();ctx.globalAlpha=a*k;ctx.translate(0,(1-k)*20);wrapCap('What if every *phone* on Earth rang at the same time?',560,80,1);ctx.restore()}
function drawCaps(t){for(const [a,b,s] of CAPS){if(t>=a&&t<b){const al=Math.min(1,(t-a)/0.3,(b-t)/0.25);wrapCap(s,590,74,al)}}}
function bubble(x,y,s,size,al,bg,fg){ctx.save();ctx.globalAlpha=al;ctx.font=`700 ${size}px ${SANS}`;const w=ctx.measureText(s).width+size*0.9,h=size*1.6;ctx.fillStyle=bg||'rgba(255,255,255,0.95)';rrect(x-w/2,y-h,w,h,h*0.45);ctx.fill();ctx.beginPath();ctx.moveTo(x-8,y-1);ctx.lineTo(x+8,y-1);ctx.lineTo(x,y+12);ctx.closePath();ctx.fill();ctx.fillStyle=fg||'#1a1a2a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y-h/2+1);ctx.restore()}
const HELLOS=['Hello?','Hallo?','¿Hola?','Allô?','Pronto?','Alô?','Moshi moshi?','Yeah?','Hey?','Yo?','Hello??','Halo?','Ja?','Who is this?'];
function headPts(t){const pts=[];HEROES.forEach(([x,z],i)=>pts.push([x,1.95,z]));const r=rngG(5);for(let i=0;i<60;i++){const s=r()<0.5?1:-1;const x=s*(6.5+r()*13.5),z=4-r()*60;pts.push([x,1.95,z])}return pts}
const HP=headPts(0);
function drawBubbles(t){if(LASTMODE!=='ts')return;
  if(t>=20.6&&t<27){HP.forEach((p,i)=>{const st=20.6+hsh(i,1)*2.2;if(t<st)return;const q=project(LASTVP,p);if(!q||q[2]>40)return;const sz=clamp(46*6/q[2],18,46);bubble(q[0],q[1],HELLOS[i%HELLOS.length],sz,Math.min(1,(t-st)/0.15)*Math.min(1,(27-t)/0.2))})}
  if(t>=40.8&&t<46){HP.forEach((p,i)=>{const st=40.8+hsh(i,2)*1.5;if(t<st)return;const q=project(LASTVP,p);if(!q||q[2]>40)return;const sz=clamp(54*6/q[2],20,54);bubble(q[0],q[1],'?',sz,Math.min(1,(t-st)/0.15)*Math.min(1,(46-t)/0.2))})}
  if(t>=49.2&&t<52.6){HP.forEach((p,i)=>{const st=49.2+hsh(i,3)*1.4;if(t<st)return;const q=project(LASTVP,[p[0],1.5,p[2]]);if(!q||q[2]>60)return;const sz=clamp(40*8/q[2],22,44);bubble(q[0],q[1],'📱 Mom ❤️',sz,Math.min(1,(t-st)/0.15),'rgba(20,20,30,0.85)','#ffffff')})}
  if(t>=52.6&&t<55.4){HP.forEach((p,i)=>{const st=52.6+hsh(i,4)*1.2;if(t<st)return;const q=project(LASTVP,[p[0],1.5,p[2]]);if(!q||q[2]>60)return;const sz=clamp(40*8/q[2],24,44);bubble(q[0],q[1],'❌',sz,Math.min(1,(t-st)/0.12)*Math.min(1,(55.4-t)/0.2),'rgba(220,40,40,0.9)','#fff')})}
  if(t>=56.4&&t<60.4){const q=project(LASTVP,HP[0]);if(q)bubble(q[0]+40,q[1]-10,'Hi mom… 😅',50,Math.min(1,(t-56.4)/0.2))}}
function drawPhoneUI(t){if(t<46||t>=49.2)return;const k=t-46;const a=ease(k/0.3)*clamp((49.2-t)/0.25,0,1);const s=0.85+0.15*easeOut(k/0.4);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,H*0.56);ctx.scale(s,s);
  ctx.fillStyle='#0c0c10';rrect(-300,-560,600,1120,80);ctx.fill();const g=ctx.createLinearGradient(0,-540,0,540);g.addColorStop(0,'#2a3a6a');g.addColorStop(1,'#0e1430');ctx.fillStyle=g;rrect(-284,-544,568,1088,68);ctx.fill();ctx.fillStyle='#000';rrect(-60,-528,120,34,17);ctx.fill();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba(255,255,255,0.75)';ctx.font=`500 34px ${SANS}`;ctx.fillText('incoming call…',0,-330);ctx.fillStyle='#fff';ctx.font=`600 96px ${SANS}`;ctx.fillText('Mom ❤️',0,-220);
  const pr=1+0.06*Math.sin(k*10);ctx.fillStyle='rgba(255,255,255,0.12)';ctx.beginPath();ctx.arc(0,-20,110*pr,0,TAU2);ctx.fill();ctx.font=`110px ${SANS}`;ctx.fillText('👩',0,-14);
  for(const [x,c,ic] of[[-150,'#ff3b30','✕'],[150,'#34c759','✆']]){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,330,70,0,TAU2);ctx.fill();ctx.fillStyle='#fff';ctx.font=`700 64px ${SANS}`;ctx.fillText(ic,x,334)}ctx.font=`500 30px ${SANS}`;ctx.fillStyle='rgba(255,255,255,0.8)';ctx.fillText('Decline',-150,440);ctx.fillText('Accept',150,440);ctx.restore()}
function drawEarthFX(t){if(LASTMODE!=='earth')return;const k=t-27;const g=ctx.createRadialGradient(W/2,H*0.5,300,W/2,H*0.5,700);g.addColorStop(0,'rgba(100,170,255,0)');g.addColorStop(0.75,'rgba(100,170,255,0.12)');g.addColorStop(1,'rgba(100,170,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const r=rngG(21);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<420;i++){const lat=Math.asin(r()*2-1),lon=r()*TAU2;const pl=[Math.cos(lat)*Math.cos(lon)*RE,Math.sin(lat)*RE,Math.cos(lat)*Math.sin(lon)*RE];const m=EARTH_M;const p=[m[0]*pl[0]+m[4]*pl[1]+m[8]*pl[2],m[1]*pl[0]+m[5]*pl[1]+m[9]*pl[2],m[2]*pl[0]+m[6]*pl[1]+m[10]*pl[2]];
    const cam=[0,RE*0.15,RE*(5.0-k*0.1)];if(V.dot(V.norm(p),V.norm(V.sub(cam,p)))<0.05)continue;const q=project(LASTVP,p);if(!q)continue;const st=0.3+r()*2.5;const kk=k-st;if(kk<0)continue;const ph=(kk%1.4)/1.4;
    ctx.strokeStyle=`rgba(120,200,255,${0.8*(1-ph)})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(q[0],q[1],6+ph*40,0,TAU2);ctx.stroke();ctx.fillStyle='rgba(200,240,255,0.95)';ctx.beginPath();ctx.arc(q[0],q[1],3.5,0,TAU2);ctx.fill()}ctx.restore()}
function drawTowerFX(t){if(LASTMODE!=='tower')return;const k=t-33;const heat=clamp((k-0.5)/3.5,0,1);if(k>1&&k<4.6){const r=rngG(Math.floor(t*20));ctx.save();ctx.globalCompositeOperation='screen';ctx.lineWidth=4;for(let n=0;n<Math.floor(2+heat*6);n++){const a=project(LASTVP,TOWER_PTS[Math.floor(r()*5)]),b=project(LASTVP,TOWER_PTS[Math.floor(r()*6)]);if(!a||!b)continue;ctx.strokeStyle=`rgba(150,220,255,${0.5+0.5*r()})`;ctx.beginPath();ctx.moveTo(a[0],a[1]);for(let s=1;s<8;s++){const f=s/8;ctx.lineTo(lerp(a[0],b[0],f)+(r()-0.5)*40,lerp(a[1],b[1],f)+(r()-0.5)*40)}ctx.lineTo(b[0],b[1]);ctx.stroke()}ctx.restore()}}
function drawEnd(t){const t0=60.4;const k=ease((t-t0)/0.5)*clamp((64.4-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(8,10,25,${0.62*k})`;ctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=k;wrapCap('Would *you* pick up?',720,96,1);ctx.font=`120px ${SANS}`;ctx.textAlign='center';ctx.fillText('👇',W/2,900+Math.abs(Math.sin((t-t0)*5))*26);ctx.restore();ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);wrapCap('What should happen *next*?',1110,54,1);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=64.4?t-64.4:t;
  if(tt>=T_RING&&tt<20){const p=0.07+0.05*Math.sin(tt*18);ctx.fillStyle=`rgba(120,180,255,${p*(tt<14?1:0.6)})`;ctx.fillRect(0,0,W,H)}
  drawEarthFX(tt);drawTowerFX(tt);
  if(tt>=40&&tt<43.4){ctx.fillStyle='rgba(10,10,30,0.18)';ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  drawBubbles(tt);drawPhoneUI(tt);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(T_RING,0.75,0.4,'200,225,255');flash(27,0.5,0.3);flash(33,0.4,0.25);flash(37,0.9,0.5,'255,220,170');flash(40,0.6,0.4,'0,0,0');flash(46,0.3,0.2);flash(52.6,0.35,0.25,'255,60,60');flash(55.6,0.3,0.2);
  if(t<64.4){drawTitle(tt);drawCaps(tt);drawLabel(tt);drawEnd(tt)}else{drawTitle(tt);drawLabel(tt)}
  {const k=64.4-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.42;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.1) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();overlays(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;
