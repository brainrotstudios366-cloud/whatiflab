// ================= village world =================
const smst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
function hgt(x,z){if(Math.abs(x-400)<70&&z>-40&&z<80)return 0.06*(fbm(x*0.3,z*0.3,2)-0.5);const r=Math.hypot(x,z);return smst(40,160,r)*fbm(x*0.01+3,z*0.01+1,3)*40+0.08*(fbm(x*0.3,z*0.3,2)-0.5)}
function onRoad(x,z){return (x>4&&x<300&&Math.abs(z-0.5)<2.4)||(Math.abs(x-400)<2.6&&z>3)}
function gcol(x,z,h,ny){const n=fbm(x*0.08+7,z*0.08,3);const dirt=1-smst(11,14.5,Math.hypot(x,z*1.15)+2.5*(fbm(x*0.2,z*0.2,2)-0.5));const rd=onRoad(x,z)?1-smst(1.6,2.4,Math.abs(z-0.5)):0;
  const d=Math.max(dirt,rd);let g=mix3(hx('#5a9a38'),hx('#7ab448'),n);let c=mix3(g,mix3(hx('#b0905e'),hx('#c8aa78'),n),d);return c}
function vhouse(m,x,z,ry,w,d,h,sh,roof,door){const cs=Math.cos(ry),sn=Math.sin(ry);const P=p=>[x+p[0]*cs+p[2]*sn,p[1],z-p[0]*sn+p[2]*cs];
  const B=(c,s,col,mat)=>{// axis aligned in local; ry multiples of 90 assumed for box -> use box with ry
    m.box(P(c),s,col,mat,ry)};
  const cream=hx('#f2e4bc'),tim=hx('#5a3a22');const fz=-d/2-0.04;// front face local -z
  B([0,h/2,0],[w,h,d],cream);B([0,0.25,0],[w+0.1,0.5,d+0.1],hx('#9a8a78'));
  // timber
  for(const y of[0.5,h*0.52,h-0.08])B([0,y,fz],[w+0.04,0.16,0.1],tim);
  for(const xx of[-w/2+0.08,w/2-0.08,-w/6,w/6])B([xx,h/2,fz],[0.16,h,0.1],tim);
  for(const xx of[-w/2+0.08,w/2-0.08])for(const zz of[-d/2+0.08,d/2-0.08])B([xx,h/2,zz],[0.18,h,0.18],tim);
  // diagonal braces (as tubes)
  const tb=(a,b)=>tube(m,P(a),P(b),0.07,0.07,tim,4);tb([-w/2+0.1,h*0.53,fz],[-w/6,h-0.1,fz]);tb([w/2-0.1,h*0.53,fz],[w/6,h-0.1,fz]);tb([-w/2+0.1,0.5,fz],[-w/6,h*0.5,fz]);tb([w/2-0.1,0.5,fz],[w/6,h*0.5,fz]);
  // windows
  const win=(xx,yy)=>{B([xx,yy,fz-0.02],[0.9,1.0,0.06],hx('#ffe6a0'),MAT.win);B([xx,yy,fz-0.06],[0.08,1.0,0.04],tim);B([xx,yy,fz-0.06],[0.9,0.08,0.04],tim);B([xx,yy-0.55,fz-0.1],[1.1,0.1,0.18],tim);
    for(const s of[-1,1]){B([xx+s*0.62,yy,fz-0.05],[0.34,1.05,0.06],sh);for(let k=0;k<3;k++)B([xx+s*0.62,yy-0.35+k*0.35,fz-0.09],[0.3,0.04,0.02],V.sc(sh,0.7))}};
  win(-w/3,h*0.76);win(w/3,h*0.76);if(!door){win(-w/3,h*0.27);win(w/3,h*0.27)}else{win(-w/3+0.1,h*0.27)}
  if(door){B([w/6+0.55,1.0,fz-0.02],[1.0,2.0,0.08],hx('#6a3e22'));B([w/6+0.55,2.05,fz-0.05],[1.2,0.14,0.1],tim);B([w/6+0.85,1.0,fz-0.08],[0.08,0.08,0.06],hx('#d8b040'))}
  // roof (gable along local x)
  const ov=0.45,rh=h*0.55;const L=[-w/2-ov,h-0.05,-d/2-ov],Rr=[w/2+ov,h-0.05,-d/2-ov],L2=[-w/2-ov,h-0.05,d/2+ov],R2=[w/2+ov,h-0.05,d/2+ov],T1=[-w/2-ov,h+rh,0],T2=[w/2+ov,h+rh,0];
  const rc=roof,rc2=V.sc(roof,0.8);m.quad(P(L),P(T1),P(T2),P(Rr),rc);m.quad(P(R2),P(T2),P(T1),P(L2),rc2);
  // roof tiles rows
  for(let i=1;i<5;i++){const k=i/5;const a=lerp3(L,T1,k),b=lerp3(Rr,T2,k);tube(m,P(V.add(a,[0,0.02,-0.02])),P(V.add(b,[0,0.02,-0.02])),0.04,0.04,V.sc(roof,0.7),4);const a2=lerp3(L2,T1,k),b2=lerp3(R2,T2,k);tube(m,P(V.add(a2,[0,0.02,0.02])),P(V.add(b2,[0,0.02,0.02])),0.04,0.04,V.sc(roof,0.6),4)}
  for(const sx of[-1,1]){m.tri(P([sx*w/2,h,-d/2]),P([sx*w/2,h+rh*0.92,0]),P([sx*w/2,h,d/2]),cream);m.tri(P([sx*w/2,h,d/2]),P([sx*w/2,h+rh*0.92,0]),P([sx*w/2,h,-d/2]),cream)}
  B([w*0.25,h+rh*0.8,d*0.15],[0.6,1.6,0.6],hx('#9a4a32'));B([w*0.25,h+rh*0.8+0.8,d*0.15],[0.75,0.15,0.75],hx('#7a3a2a'))}
function pine(m,x,z,s,r){const y=hgt(x,z);m.prism([x,y,z],0.18*s,0.12*s,1.2*s,6,hx('#5a3a22'));const c1=hx('#2f6a3a'),c2=hx('#3f8a48');
  for(let i=0;i<4;i++){const yy=y+0.9*s+i*1.05*s;m.prism([x,yy,z],(1.7-i*0.33)*s,0,1.9*s,9,mix3(c1,c2,i/4))}}
function roundTree(m,x,z,s,seed){const y=hgt(x,z);tube(m,[x,y,z],[x,y+2.2*s,z],0.25*s,0.18*s,hx('#6a4228'),7);
  for(let i=0;i<5;i++){const a=i*1.3+seed;const c=[x+Math.cos(a)*1.0*s*(i?1:0),y+2.9*s+(i?0:0.7*s)+hsh(i,seed)*0.4*s,z+Math.sin(a)*1.0*s*(i?1:0)];blob(m,c,(i?1.25:1.6)*s,p=>mix3(hx('#3e8a36'),hx('#7ac04a'),clamp((p[1]-c[1])/(2*s)+0.5,0,1)),seed*3+i,0.9,[7,10])}}
let WORLD,BAKSIGN;{const m=new MB();
  terrain(m,-60,-60,60,60,90,hgt,gcol);terrain(m,345,-30,455,70,70,hgt,gcol);terrain(m,-1500,-1500,1500,1500,80,(x,z)=>hgt(x,z)-((Math.abs(x)<60&&Math.abs(z)<60)||(Math.abs(x-400)<55&&z>-30&&z<70)?0.4:0),gcol);
  vhouse(m,393,14,Math.PI/2,6.2,5,4.2,hx('#3a5a7a'),hx('#5a3a2a'),1);vhouse(m,407.5,22,-Math.PI/2,6.2,5,4.4,hx('#7a3a3a'),hx('#4a3a2a'),1);vhouse(m,393,30,Math.PI/2,6.2,5,4.0,hx('#3a6a4a'),hx('#5a2a22'),0);vhouse(m,407.5,38,-Math.PI/2,6.2,5,4.2,hx('#3a5a7a'),hx('#4a3a2a'),0);
  for(const[x,z,s]of[[395,46,1.2],[405,50,1.0],[392,6,1.0],[409,8,1.1]])roundTree(m,x,z,s,x+z);
  const SH=[hx('#c03a2a'),hx('#3a7a3a'),hx('#2a5a9a'),hx('#c03a2a'),hx('#3a7a3a')];const RF=[hx('#8a3a22'),hx('#7a3020'),hx('#6a3a2a'),hx('#8a4a2a')];
  // back row (facing -z toward camera)
  vhouse(m,0,12,0,7.2,5,4.6,hx('#c03a2a'),hx('#8a3a22'),1);// bakery
  vhouse(m,-9,13,0.12,6.2,5,4.2,SH[1],RF[1],1);vhouse(m,9.5,13.2,-0.15,6.4,5,4.4,SH[2],RF[2],1);
  vhouse(m,-17,10,0.5,6,5,4.0,SH[0],RF[3],0);vhouse(m,17.5,9,-0.6,6,5,4.2,SH[1],RF[0],1);
  // side rows
  vhouse(m,-14,-2,Math.PI/2,6.4,5,4.2,SH[2],RF[0],1);vhouse(m,-15,-10,Math.PI/2,6,5,4.0,SH[0],RF[2],0);
  vhouse(m,15,-6,-Math.PI/2,6.4,5,4.4,SH[0],RF[1],1);
  // back houses (behind camera)
  vhouse(m,-6,-17,Math.PI,6.4,5,4.2,SH[1],RF[2],1);vhouse(m,6,-18,Math.PI,6.4,5,4.0,SH[2],RF[0],0);
  // bakery sign
  m.box([1.75,2.62,9.38],[2.5,0.66,0.1],hx('#7a3a1a'));m.box([1.75,2.62,9.36],[2.62,0.76,0.06],hx('#4a2a14'));pixText(m,'BAKERY',[1.75,2.62,9.3],0.06,hx('#fff0c0'),-1,0.04);
  // stone oven dome right of bakery
  // barrels, crates, well
  for(const[x,z]of[[-4.2,9.0],[-4.9,9.4],[6.6,8.4],[-12,4],[11.5,3.5]]){const y=hgt(x,z);m.prism([x,y,z],0.42,0.42,0.95,12,hx('#8a5a30'));for(const yy of[0.15,0.8])m.prism([x,y+yy,z],0.44,0.44,0.07,12,hx('#4a4a4a'))}
  for(const[x,z]of[[6.3,9.2],[-12.6,3.2]])m.box([x,0.35,z],[0.7,0.7,0.7],hx('#a8743e'),0,0,hx('#b8844e'));
  // well
  {const x=-7.5,z=2.5;m.prism([x,0,z],1.0,1.0,0.8,14,hx('#8a8a88'));m.prism([x,0.8,z],1.05,1.05,0.1,14,hx('#6a6a68'));m.prism([x,0.02,z],0.85,0.85,0.8,14,hx('#2a3a4a'));for(const s of[-1,1])m.box([x+s*0.9,1.4,z],[0.12,1.3,0.12],hx('#6a4228'));m.prism([x,2.0,z],0.0001,0.0001,0,4,hx('#6a4228'));
    m.quad([x-1.3,2.0,z-0.8],[x-1.3,2.6,z],[x+1.3,2.6,z],[x+1.3,2.0,z-0.8],hx('#8a3a22'));m.quad([x+1.3,2.0,z+0.8],[x+1.3,2.6,z],[x-1.3,2.6,z],[x-1.3,2.0,z+0.8],hx('#7a3020'))}
  // fences along road
  for(let i=0;i<14;i++){const x=16+i*2.2;for(const zz of[-2.6,3.6]){m.box([x,0.5,zz],[0.14,1.0,0.14],hx('#8a6a42'));m.box([x+1.1,0.7,zz],[2.2,0.1,0.08],hx('#9a7a4a'));m.box([x+1.1,0.35,zz],[2.2,0.1,0.08],hx('#9a7a4a'))}}
  // trees
  const r=rngG(7);
  for(let i=0;i<70;i++){const a=r()*TAU2,d=24+r()*55;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z)||Math.abs(z-0.5)<6&&x>0)continue;pine(m,x,z,1.0+r()*0.9,r)}
  for(const[x,z,s]of[[-5,16,1.1],[5,17,1.2],[-13,15,1.0],[13.5,15.5,1.2],[-20,3,1.1],[-19,-15,1.1],[19,-14,1.2],[-3.5,-14,0.9],[13,-16,1.0],[24,8,1.3],[-24,10,1.2]])roundTree(m,x,z,s,x*3+z);
  // bushes
  for(let i=0;i<30;i++){const a=r()*TAU2,d=14+r()*8;const x=Math.cos(a)*d,z=Math.sin(a)*d*0.95;if(onRoad(x,z))continue;blob(m,[x,hgt(x,z)+0.3,z],0.6+r()*0.4,p=>mix3(hx('#3a7a30'),hx('#6aaa40'),clamp(p[1],0,1)),i+50,0.75,[6,9])}
  // grass tufts
  for(let i=0;i<2200;i++){const a=r()*TAU2,d=12+Math.pow(r(),0.8)*30;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z))continue;const y=hgt(x,z);const h=0.15+r()*0.2,yaw=r()*TAU2,w=0.04;const cb=hx('#4a8a2a'),ct=hx('#a8d060');
    m.tri([x+Math.cos(yaw)*w,y,z+Math.sin(yaw)*w],[x-Math.cos(yaw)*w,y,z-Math.sin(yaw)*w],[x+(r()-0.5)*0.1,y+h,z+(r()-0.5)*0.1],[cb,cb,ct])}
  // flowers
  for(let i=0;i<160;i++){const a=r()*TAU2,d=13+r()*14;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z))continue;m.ico([x,hgt(x,z)+0.18,z],0.07,[hx('#ff5a6a'),hx('#ffe04a'),hx('#ffffff'),hx('#b070ff')][i%4],0,1,[3,5])}
  WORLD=m.build(0.0)}
const OVEN=BRICKDOME;
