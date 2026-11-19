// ================= STARSHIP models (origin = bottom centre, +y up). Heat shield (black) faces local +z =====
const RK=4.5;// radius (9 m diameter)
const STEEL=y=>{const b=0.8+0.06*Math.sin(y*0.9)+0.05*(vnoise(y*0.7,3.1)-0.5);return[0.74*b,0.76*b,0.8*b]};
function cylC(m,y0,y1,rf,seg,cf,mat,ny){ny=ny||Math.max(2,Math.round((y1-y0)/1.8));for(let i=0;i<ny;i++){const ya=y0+(y1-y0)*i/ny,yb=y0+(y1-y0)*(i+1)/ny;const ra=rf(ya),rb=rf(yb);
  for(let j=0;j<seg;j++){const a=j/seg*TAU2,b=(j+1)/seg*TAU2;const P=(an,y,r)=>[Math.sin(an)*r,y,Math.cos(an)*r];
    const seam=((ya/1.8)|0)%2;const c=(an,y)=>{const k=cf(an,y);return seam?k.map(v=>v*0.96):k};
    m.quad(P(a,ya,ra),P(b,ya,ra),P(b,yb,rb),P(a,yb,rb),[c(a,ya),c(b,ya),c(b,yb),c(a,yb)],mat)}}}
const shipCol=(an,y)=>{const cz=Math.cos(an);if(cz>0.12){const h=vnoise(an*14,y*3.5);return[0.07+0.04*h,0.07+0.04*h,0.08+0.04*h]}return STEEL(y)};
function engineCluster(m,y){const dk=hx('#2c2c32'),in_=hx('#4a3a30');const ring=(n,r)=>{for(let i=0;i<n;i++){const a=i/n*TAU2+(n===3?0.5:0);const x=Math.sin(a)*r,z=Math.cos(a)*r;m.prism([x,y-1.4,z],0.62,0.38,1.4,10,dk);m.prism([x,y-1.38,z],0.52,0.02,0.05,10,in_)}};
  ring(3,0.9);ring(10,2.25);ring(20,3.75)}
const BOOST=um(m=>{cylC(m,0,69,()=>RK,32,(an,y)=>STEEL(y));
  // hot-staging ring (vented)
  cylC(m,69,71.5,()=>RK*1.01,32,(an,y)=>{const v=Math.sin(an*16)>0.3&&y>69.4&&y<71.1;return v?[0.05,0.05,0.06]:[0.55,0.56,0.6]},0,2);
  m.prism([0,71.5,0],RK*1.01,RK*0.6,0.3,32,hx('#3a3a40'));
  // skirt + engines
  m.prism([0,-0.6,0],RK*1.0,RK,0.6,32,hx('#5a5c62'));m.prism([0,-0.6,0],RK*0.98,RK*0.98,0.02,32,hx('#1a1a1e'));engineCluster(m,-0.6);
  // grid fins (4)
  for(let i=0;i<4;i++){const a=i/4*TAU2+Math.PI/4;const d=RK+1.6;const x=Math.sin(a)*d,z=Math.cos(a)*d;const ry=a;
    m.box([x,65.5,z],[3.6,4.2,0.35],hx('#3a3a42'),0,ry);m.box([Math.sin(a)*(RK+0.3),65.5,Math.cos(a)*(RK+0.3)],[0.8,1.2,0.8],hx('#5a5a60'),0,ry)}
  // chines / pipes
  for(const a of[1.6,-1.6]){const x=Math.sin(a)*(RK+0.15),z=Math.cos(a)*(RK+0.15);m.box([x,34,z],[0.5,64,0.4],hx('#8a8c92'),0,a)}},0.4);
function shipPart(m,y0,y1){const rf=y=>y<36?RK:RK*Math.sqrt(Math.max(0.0005,1-Math.pow((y-36)/16.5,2)));
  cylC(m,y0,Math.min(y1,36),rf,32,shipCol);if(y1>36){cylC(m,Math.max(36,y0),y1,rf,32,shipCol,0,12);if(y1>=52)m.prism([0,52,0],rf(52),0.01,0.4,32,hx('#151518'))}
  if(y0<=0.01){m.prism([0,-0.02,0],RK,RK,0.02,32,hx('#2a2a30'));for(let i=0;i<6;i++){const a=i/6*TAU2;const r=i<3?1.0:2.9;const x=Math.sin(a+(i<3?0:0.5))*r,z=Math.cos(a+(i<3?0:0.5))*r;m.prism([x,-1.6,z],i<3?0.6:0.95,0.35,1.6,10,hx('#2c2c32'))}}
  // aft flaps (sides, x=±) and forward flaps
  const flap=(yA,yB,wA,wB,sx)=>{const xa=sx*(RK*0.92),xb=sx*(RK*0.92+wA),xc=sx*(RK*0.92+wB);const z=0.3;const c=hx('#141418');
    for(const zz of[z,-z+0.6]){m.quad([xa,yA,zz],[xb,yA,zz],[xc,yB,zz],[xa,yB,zz],c)}m.box([sx*(RK*0.92+wA*0.5),(yA+yB)/2,0.5],[wA,yB-yA,0.5],c)};
  for(const sx of[-1,1]){if(y0<=2&&y1>=12)flap(1,11,3.4,2.4,sx);if(y0<=40&&y1>=47)flap(40,47,2.0,1.1,sx)}}
const SHIP=um(m=>shipPart(m,0,52),0.4);const SHIPA=um(m=>shipPart(m,0,26),0.4);const SHIPB=um(m=>shipPart(m,26,52),0.4);
// cut faces for the halves (glowing steel)
const CUTF=um(m=>{for(let i=0;i<32;i++){const a=i/32*TAU2,b=(i+1)/32*TAU2;m.tri([0,0,0],[Math.sin(b)*RK*0.98,0,Math.cos(b)*RK*0.98],[Math.sin(a)*RK*0.98,0,Math.cos(a)*RK*0.98],[1,1,1],MAT.emis);m.tri([0,0,0],[Math.sin(a)*RK*0.98,0,Math.cos(a)*RK*0.98],[Math.sin(b)*RK*0.98,0,Math.cos(b)*RK*0.98],[1,1,1],MAT.emis)}});
// launch tower with chopsticks + launch mount + tank farm (world coords around PAD)
const TOWER=um(m=>{const tx=PAD[0]-17,tz=PAD[2]-2;const s=6,H=146;const g=hx('#5a5e66'),g2=hx('#7a7e86');
  for(const[cx,cz]of[[-1,-1],[1,-1],[1,1],[-1,1]])m.box([tx+cx*s,H/2,tz+cz*s],[0.9,H,0.9],g);
  for(let y=0;y<H;y+=9){for(const[a,b]of[[[-1,-1],[1,-1]],[[1,-1],[1,1]],[[1,1],[-1,1]],[[-1,1],[-1,-1]]]){const A=[tx+a[0]*s,y,tz+a[1]*s],B=[tx+b[0]*s,y,tz+b[1]*s];tube(m,A,B,0.3,0.3,g2,5);tube(m,A,[B[0],y+9,B[2]],0.2,0.2,g,4)}}
  m.box([tx,H+1,tz],[13,2,13],hx('#4a4e56'));tube(m,[tx,H+2,tz],[tx,H+14,tz],0.3,0.1,g,5);
  // chopsticks arms (open) at ~105 m
  const ay=104;m.box([tx+s+1,ay,tz],[3,5,14],hx('#3a3e46'));for(const sz of[-1,1]){const A=[tx+s+1.5,ay,tz+sz*5],B=[PAD[0]+6,ay,PAD[2]+sz*14];tube(m,A,B,1.2,1.0,hx('#2e3238'),8);m.box([B[0],ay+1.2,B[2]],[3,1,3],hx('#ffd84a'))}
  // launch mount: 6 legs + table ring
  for(let i=0;i<6;i++){const a=i/6*TAU2;m.box([PAD[0]+Math.sin(a)*8,10,PAD[2]+Math.cos(a)*8],[3,20,3],hx('#8a8a88'))}
  for(let i=0;i<24;i++){const a=i/24*TAU2,b=(i+1)/24*TAU2;tube(m,[PAD[0]+Math.sin(a)*9,20,PAD[2]+Math.cos(a)*9],[PAD[0]+Math.sin(b)*9,20,PAD[2]+Math.cos(b)*9],1.6,1.6,hx('#7a7a78'),6)}
  m.box([PAD[0],0.5,PAD[2]],[40,1,40],hx('#8c8c88'));
  // tank farm
  for(let i=0;i<7;i++){const x=PAD[0]+30+i*9,z=PAD[2]-28-(i%2)*10;m.prism([x,0,z],3.2,3.2,(i%3?18:26),18,hx('#e6e8ea'));m.prism([x,(i%3?18:26),z],3.2,1.5,1.2,18,hx('#c8cacc'))}
  for(let i=0;i<4;i++){const x=PAD[0]-30-i*8,z=PAD[2]-24;m.prism([x,0,z],3.5,3.5,14,18,hx('#d8dadc'))}},0.3);
// small stuff
const CHOP=um(m=>{tube(m,[0,0,0],[0,0.34,0],0.006,0.0035,hx('#c8282a'),6);tube(m,[0,0,0],[0,0.012,0],0.0062,0.0062,hx('#c8282a'),6)},0.5);
const TILE=um(m=>{m.prism([0,-0.02,0],0.17,0.17,0.04,6,hx('#141416'));m.prism([0,0.02,0],0.16,0.16,0.002,6,hx('#2a2a30'))},0);
const ICEB=um(m=>{m.box([0,0.5,0],[1,1,1],[0.75,0.92,1],MAT.glass)});
const SHARD=um(m=>{m.tri([0,0.5,0],[-0.3,-0.3,0.2],[0.35,-0.25,0.1],[0.8,0.95,1],MAT.glass);m.tri([0,0.5,0],[0.35,-0.25,0.1],[0,-0.2,-0.35],[0.7,0.9,1],MAT.glass);m.tri([0,0.5,0],[0,-0.2,-0.35],[-0.3,-0.3,0.2],[0.75,0.92,1],MAT.glass)});
const SNOW=um(m=>blob(m,[0,0,0],1,p=>[0.96,0.98,1],5,0.8,[6,9]),0.5);
