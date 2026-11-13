
// ===================== LOCATIONS =====================
const LOC={};
function envDay(o){return Object.assign({sun:[0.5,0.8,0.35],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#6f7a55'),fog:hx('#cfe0f0'),fogD:400,zen:hx('#3f7ed4'),hor:hx('#d4e6f4'),stars:0,night:0,emis:1},o||{})}
function people(mb,x0,z0,x1,z1,n,seed){const r=rngG(seed);const cols=['#e04848','#3c8de0','#52c060','#f0d040','#f2f2f2','#e07fd0','#ff8a30','#40c8c8'];for(let i=0;i<n;i++){const x=x0+r()*(x1-x0),z=z0+r()*(z1-z0);const c=hx(cols[Math.floor(r()*cols.length)]);
  mb.box([x,0.45,z],[0.36,0.9,0.24],hx('#2c3245'));mb.box([x,1.2,z],[0.46,0.6,0.28],c);mb.ico([x,1.68,z],0.15,hx('#d9a68a'))}}
function build(key){if(LOC[key])return LOC[key];let L;const mb=new MB();
  if(key==='yard'){terrain(mb,-80,-80,80,80,40,(x,z)=>0.15*fbm(x*0.05,z*0.05),(x,z)=>hsh(Math.floor(x/3),Math.floor(z/3))<0.5?C.grass:C.grass2);
    house(mb,0,-16,10,8,5,hx('#f2e6d0'),C.roofR,0);house(mb,18,-24,9,8,4.5,hx('#cfd8e0'),C.roofG,0.3);house(mb,-18,-22,9,8,5,hx('#e8d0c0'),C.roofR,-0.2);
    fence(mb,-14,-4,14,-4,1.0);fence(mb,-14,-4,-14,10,1.0);tree(mb,-8,-10,1.3);tree(mb,9,-7,1.1);tree(mb,-16,8,1.5,0,'pine');tree(mb,13,9,1.2);tree(mb,25,-5,1.6,0,'pine');tree(mb,-26,-4,1.4);
    mb.box([7,0.4,2],[1.6,0.8,0.8],hx('#5a5f6a'));mb.box([-6,0.3,4],[2.2,0.6,1.2],hx('#3c8de0'));car(mb,6,-10,0.4,hx('#d6453d'));
    L={env:envDay({fogD:300}),origin:[0,0,0]}}
  if(key==='suburb'){ground(mb,-150,-150,150,150,C.grass,0,10,(x,z)=>hsh(x,z)<0.5?C.grass:C.grass2);ground(mb,-5,-150,5,150,C.road,0.02,10);ground(mb,-8,-150,-5,150,C.side,0.04,10);ground(mb,5,-150,8,150,C.side,0.04,10);
    for(let z=-140;z<150;z+=12)mb.box([0,0.03,z],[0.2,0.02,5],C.line);
    const wc=['#f2e6d0','#cfd8e0','#e8d0c0','#d9e8c9','#f0d9b5','#e0e0ea'];let i=0;for(let z=-120;z<120;z+=16){for(const s of[-1,1]){house(mb,s*16,z,10,9,s>0&&z===-8?7:5,hx(wc[i%6]),i%2?C.roofR:C.roofG,s>0?-Math.PI/2:Math.PI/2);tree(mb,s*10,z+7,1.1);i++}}
    car(mb,-3.3,-4,0,hx('#3e6fd8'));car(mb,3.3,10,Math.PI,hx('#e8eaee'));car(mb,-3.3,20,0,hx('#2b2d33'));car(mb,3.3,-26,Math.PI,hx('#f2c230'));people(mb,-8,-40,-5,40,12,3);people(mb,5,-40,8,40,12,4);
    L={env:envDay({fogD:350,sun:[-0.4,0.8,0.45]}),origin:[-1.2,0,-4]}}
  if(key==='city'){ground(mb,-200,-300,200,100,C.road,0,20);ground(mb,-16,-300,-8,100,C.side,0.05,10);ground(mb,8,-300,16,100,C.side,0.05,10);
    for(let z=-290;z<100;z+=10)mb.box([0,0.03,z],[0.25,0.02,4],C.yellow);
    const bc=['#8a93ab','#a59f9a','#7a8398','#b2b5c3','#9499b2','#a8a2b8','#c9b8a6'];const r=rngG(7);
    for(const s of[-1,1]){let z=90;while(z>-290){const len=14+r()*14,h=s>0&&z<10&&z>-30?32:25+r()*70,d=12+r()*6;skyscraper(mb,s*(16+d/2),z-len/2,d,len-0.6,h,hx(bc[Math.floor(r()*7)]));z-=len}}
    bus(mb,-3.5,-6,0,hx('#f2c230'));car(mb,3.5,6,Math.PI,hx('#d6453d'));car(mb,-3.5,14,0,hx('#3e6fd8'));car(mb,3.5,-24,Math.PI,hx('#e8eaee'));car(mb,-3.5,-40,0,hx('#f2c230'));people(mb,8.5,-80,15,40,40,5);people(mb,-15,-80,-8.5,40,40,6);
    for(let z=-280;z<100;z+=24){mb.prism([9,0,z],0.12,0.1,7,6,hx('#3b3d46'));mb.box([8.2,7,z],[1.8,0.2,0.4],hx('#3b3d46'))}
    L={env:envDay({fogD:280,sun:[0.45,0.75,0.5],fog:hx('#d8dde8')}),origin:[10.5,0,-6]}}
  if(key==='park'){terrain(mb,-150,-150,150,150,50,(x,z)=>{const d=Math.hypot(x+10,z+30);return d<22?-1.2:0.3*fbm(x*0.03,z*0.03)},(x,z,h)=>h<-0.3?hx('#9a8a6a'):(hsh(Math.floor(x/4),Math.floor(z/4))<0.5?C.grass:C.grass2));
    ground(mb,-35,-55,15,-5,C.water,-0.4,50);
    const r=rngG(11);for(let i=0;i<55;i++){const x=(r()-0.5)*220,z=(r()-0.5)*220;if(Math.hypot(x+10,z+30)<26||Math.hypot(x,z)<6)continue;tree(mb,x,z,2.6+r()*1.8,0,r()<0.25?'pine':'')}
    for(let i=0;i<14;i++){const a=i/14*6.283;mb.box([Math.cos(a)*9,0.25,Math.sin(a)*9+2],[1.6,0.1,0.5],C.wood)}ground(mb,-1.5,-150,1.5,150,hx('#c9b48a'),0.03,10);people(mb,-30,-10,30,30,30,8);
    L={env:envDay({fogD:350,sun:[0.6,0.7,0.3],sunCol:hx('#fff4e0')}),origin:[3,0,0]}}
  if(key==='beach'){terrain(mb,-300,-600,300,120,60,(x,z)=>{const s=z>0?1.2+0.3*fbm(x*0.03,z*0.03):1.2+z*0.06;return Math.max(-8,s)},(x,z,h)=>h<0?hx('#c9b07a'):C.sand);
    ground(mb,-3000,-3000,3000,-20,C.water,0,6000/12,null);
    for(let i=0;i<30;i++){const x=-140+i*10+hsh(i,1)*5,z=40+hsh(i,2)*50;tree(mb,x,z,1.2+hsh(i,3)*0.6,1.2,'palm')}
    const lx=-30,lz=-30;mb.prism([lx-1,0,lz-2],12,10,3,10,C.rock);for(let k=0;k<8;k++){const c=k%2?hx('#f2f2f2'):hx('#d6453d');mb.prism([lx,3+k*5.2,lz],5-k*0.25,5-(k+1)*0.25,5.2,12,c)}mb.prism([lx,44.6,lz],3.2,3.2,3,12,hx('#2f3a4c'),MAT.glass);mb.prism([lx,47.6,lz],3.6,0,3,12,hx('#d6453d'));
    for(let i=0;i<10;i++)mb.ico([lx+(hsh(i,4)-0.5)*24,0.5,lz+(hsh(i,5)-0.5)*16-6],1+hsh(i,6)*2.5,C.rock);
    for(let i=0;i<8;i++){const x=10+i*7,z=20;mb.prism([x,1.2,z],0.05,0.05,2.6,6,hx('#ddd'));mb.prism([x,3.6,z],1.6,0,0.6,8,hx(['#e04848','#3c8de0','#f0d040','#52c060'][i%4]))}people(mb,-20,10,60,40,25,9);
    L={env:envDay({sun:[-0.6,0.35,-0.7],sunCol:hx('#ffc890'),sky:hx('#e8b8a0'),gnd:hx('#8a7a60'),fog:hx('#f0c8a8'),fogD:900,zen:hx('#4a6ab8'),hor:hx('#ffcfa0'),sunSize:2}),origin:[4,1.4,30]}}
  if(key==='downtown'){ground(mb,-1000,-1000,1000,1000,hx('#6a6c74'),0,100);const r=rngG(21);const bc=['#8a93ab','#a59f9a','#7a8398','#b2b5c3','#9499b2','#c2c8d4','#6a7488','#b8c4d0'];
    for(let gx=-8;gx<=8;gx++)for(let gz=-10;gz<=4;gz++){const x=gx*42,z=gz*42;if(Math.abs(gx)<=0&&gz>=-1&&gz<=1){ground(mb,x-18,z-18,x+18,z+18,C.grass,0.05,36);continue}const h=Math.max(20,(180-Math.hypot(x,z)*0.25)*(0.4+r()*0.9));skyscraper(mb,x,z,24+r()*10,24+r()*10,h,hx(bc[Math.floor(r()*8)]))}
    for(let i=0;i<10;i++)tree(mb,(r()-0.5)*30,(r()-0.5)*30,1.4);people(mb,-15,-15,15,15,30,10);
    L={env:envDay({fogD:1600,sun:[0.5,0.7,0.5],fog:hx('#d4dde8')}),origin:[0,0,8]}}
  if(key==='paris'){ground(mb,-3000,-3000,3000,3000,hx('#8a8a80'),0,500);const r=rngG(31);
    ground(mb,-60,-60,60,620,C.grass,0.05,40);ground(mb,-3000,-140,3000,-90,C.water,0.1,500);
    for(let gx=-14;gx<=14;gx++)for(let gz=-12;gz<=16;gz++){const x=gx*55,z=gz*55;if(Math.abs(x)<80&&z>-80&&z<640)continue;if(z>-150&&z<-80)continue;const w=40+r()*8,d=40+r()*8,h=18+r()*8;mb.box([x,h/2,z],[w,h,d],hx('#e6d9c0'),MAT.win);mb.box([x,h+2,z],[w*0.95,4,d*0.95],hx('#5a6070'))}
    // lattice tower
    const T=330;const lw=(y)=>62*Math.pow(1-y/T,1.8)+3;const BR=hx('#7a5a40');
    for(let seg=0;seg<26;seg++){const y0=seg*T/26*0.86,y1=(seg+1)*T/26*0.86;const w0=lw(y0),w1=lw(y1);for(const sx of[-1,1])for(const sz of[-1,1]){const a=[sx*w0,y0,sz*w0],b=[sx*w1,y1,sz*w1];const th=1.6*(w0/60)+0.6;
        mb.box([(a[0]+b[0])/2,(y0+y1)/2,(a[2]+b[2])/2],[th,y1-y0+0.5,th],BR)}
      if(seg%2===0)for(const s of[-1,1]){mb.box([0,y1,s*w1],[2*w1,0.6,0.8],BR);mb.box([s*w1,y1,0],[0.8,0.6,2*w1],BR)}}
    for(const [py,pw] of[[57,46],[115,26],[276,9]])mb.box([0,py,0],[pw*2.1,4,pw*2.1],hx('#6a4a32'));mb.prism([0,T*0.86,0],3,0.6,T*0.14,8,BR);
    for(let gx=-14;gx<=14;gx+=2){tree(mb,-70,gx*20+300,2.5);tree(mb,70,gx*20+300,2.5)}
    L={env:envDay({sun:[0.6,0.55,0.55],sunCol:hx('#fff0dc'),fog:hx('#dfe2ea'),fogD:2200,hor:hx('#e8eef6')}),origin:[0,0,140]}}
  if(key==='ny'){ground(mb,-6000,-6000,6000,6000,C.water,0,1000);ground(mb,-700,-3000,700,3000,hx('#6a6c74'),0.5,250);const r=rngG(41);const bc=['#8a93ab','#a59f9a','#7a8398','#b2b5c3','#9499b2','#c2c8d4','#6a7488','#b8c4d0'];
    for(let gx=-9;gx<=9;gx++)for(let gz=-40;gz<=40;gz++){const x=gx*72,z=gz*72;if(gx>=-2&&gx<=2&&gz>=-1&&gz<=10){if(gz===4)ground(mb,x-30,z-30,x+30,z+30,C.grass,0.6,60);continue}const midt=Math.exp(-Math.pow((z+600)/500,2))*1+Math.exp(-Math.pow((z-900)/400,2))*0.7;const h=30+r()*80+midt*r()*320;skyscraper(mb,x,z,40+r()*16,40+r()*16,h,hx(bc[Math.floor(r()*8)]))}
    ground(mb,-150,-60,150,760,C.grass,0.6,30);for(let i=0;i<120;i++)tree(mb,(r()-0.5)*280,-50+r()*800,2.2,0.6);
    L={env:envDay({fogD:4500,sun:[0.5,0.7,0.5],fog:hx('#d4dde8')}),origin:[0,0,300]}}
  if(key==='desert'){terrain(mb,-8000,-8000,8000,8000,90,(x,z)=>{const d=Math.hypot(x,z);return d<900?0:60*fbm(x*0.0012,z*0.0012)+40*Math.sin(x*0.002+z*0.001)},(x,z,h)=>mix3(hx('#e2b878'),hx('#c8945a'),clamp01(h/120)));
    ground(mb,-900,-900,900,900,hx('#9a9088'),0.5,150);ground(mb,-8000,-25,8000,25,C.road,1,1000);const r=rngG(51);
    for(let i=0;i<60;i++){const a=r()*6.283,d=150+r()*650;const h=40+r()*240;skyscraper(mb,Math.cos(a)*d,Math.sin(a)*d,30+r()*20,30+r()*20,h,hx(['#c2c8d4','#b8c4d0','#d8d0c0','#9aa8b8'][i%4]))}
    const segs=[[0,170,58],[170,320,46],[320,460,34],[460,580,24],[580,680,16],[680,750,9]];for(const [y0,y1,rr_] of segs)mb.prism([0,y0,0],rr_,rr_*0.85,y1-y0,6,hx('#c8d0dc'),MAT.win);mb.prism([0,750,0],5,0.5,78,6,hx('#d0d4dc'));
    for(let i=0;i<40;i++)tree(mb,(r()-0.5)*600,(r()-0.5)*600,1.6,0.5,'palm');
    L={env:envDay({sun:[0.7,0.45,0.4],sunCol:hx('#ffe0b0'),sky:hx('#e8d8c0'),gnd:hx('#a08060'),fog:hx('#efd8b8'),fogD:9000,zen:hx('#4a7ac8'),hor:hx('#f4e0c0')}),origin:[260,0,260]}}
  if(key==='islands'){ground(mb,-40000,-40000,40000,40000,hx('#1f78b0'),0,8000);const r=rngG(61);
    const HI=[[-700,-2300,520],[-1700,-3900,760],[350,-3300,420],[-2900,-5600,680],[900,-5800,560],[-300,-7200,900],[2000,-4300,380],[-4200,-3200,450]];for(let i=0;i<22;i++){let cx,cz,R;if(i<HI.length){[cx,cz,R]=HI[i]}else{cx=(r()-0.5)*14000;cz=-r()*14000;R=150+r()*500}terrain(mb,cx-R,cz-R,cx+R,cz+R,14,(x,z)=>{const d=Math.hypot(x-cx,z-cz)/R;return Math.max(-20,(1-d*d)*R*0.25*(0.7+0.6*fbm(x*0.004,z*0.004)))},(x,z,h)=>h<6?C.sand:(h>R*0.15?hx('#4f7d3c'):hx('#5f9a45')))}
    L={env:envDay({fogD:14000,sun:[0.5,0.75,0.4],fog:hx('#cfe6f4'),hor:hx('#e0f0fa')}),origin:[0,0,0],clouds:1750}}
  if(key==='mount'||key==='himalaya'){const big=key==='himalaya';const S=big?32000:16000,HM=big?8850:3600,f0=big?0.00011:0.00022;
    const PK=big?[[-3200,-11000,8850,2800],[-9000,-12500,7400,2600],[3600,-14500,7700,2800],[-11000,-6000,6600,2400],[7000,-9000,6800,2400],[-1000,-20000,7900,3200],[9000,-17000,7200,2800],[-6500,-3500,5600,2000],[5200,-3800,5400,1800]]
                :[[-1800,-5200,3300,1300],[1900,-6600,3100,1300],[-4200,-7600,3500,1500],[300,-10000,3400,1700],[-5200,-3600,2800,1200],[4300,-4200,2600,1100]];
    const hf=(x,z)=>{let r_=0,a=1,f=f0;for(let o=0;o<5;o++){const n_=1-Math.abs(vnoise(x*f+o*7.3,z*f-o*3.1)*2-1);r_+=n_*n_*a;a*=0.5;f*=2.07}r_/=1.9;
      let g=0;for(const [px,pz,ph,ps] of PK){const d2=((x-px)**2+(z-pz)**2)/(ps*ps);g=Math.max(g,ph*Math.exp(-d2*0.9))}
      const vd=Math.hypot(x,z+300);const valley=Math.min(1,vd/(big?5000:2200));return Math.max(big?2400:120,g*(0.86+0.14*r_)+HM*0.16*r_*valley)};
    const snowH=big?4700:2500;
    terrain(mb,-S,-S*1.4,S,S*0.6,big?150:140,hf,(x,z,h,ny)=>h>snowH?(ny>0.5?C.snow:hx('#9a98a0')):(ny<0.62?(h>snowH*0.7?(big?hx('#7d8494'):hx('#8a8580')):C.rock):(big?(h>snowH*0.75?hx('#dfe6ee'):hx('#9c8a72')):(h<900?hx('#4f8a3a'):hx('#6f8a58')))));
    L={env:envDay({fogD:big?60000:30000,sun:[0.6,0.55,0.35],fog:hx('#c8daf0'),zen:big?hx('#163f9a'):hx('#2f6fd0'),hor:hx('#d8e6f6')}),origin:[0,0,0],clouds:big?4300:1700}}
  if(key==='plane'){ground(mb,-90000,-90000,90000,90000,hx('#e8eef6'),0,30000);L={env:envDay({fogD:60000,fog:hx('#b8cce8'),zen:hx('#0c2a78'),hor:hx('#9fc0e8'),sky:hx('#8ab0e0')}),origin:[0,0,0],cloudsea:true}}
  L.mesh=mb.d.length?mb.build():null;
  if(L.clouds){const cm=new MB();const r=rngG(71);if(key==='islands'){for(const [x,z,s] of[[-520,-420,170],[480,-700,190],[-900,-1500,240],[700,-1900,260],[-260,-2600,230],[1300,-1200,220],[-1500,-800,210]])for(let k=0;k<5;k++)cm.ico([x+(r()-0.5)*s*2,1900+(r()-0.5)*s*0.4,z+(r()-0.5)*s*1.4],s*(0.5+r()*0.5),[1,1,1],0,0.55)}const sc=key==='islands'?1:(key==='himalaya'?3:2);for(let i=0;i<160;i++){const x=(r()-0.5)*16000*sc,z=(r()-0.5)*16000*sc,s=(120+r()*220)*sc;for(let k=0;k<4;k++)cm.ico([x+(r()-0.5)*s*2,L.clouds+(r()-0.5)*s*0.3,z+(r()-0.5)*s*1.4],s*(0.6+r()*0.5),[1,1,1],0,0.55)}L.cloudMesh=cm.build()}
  if(L.cloudsea){const cm=new MB();const r=rngG(81);for(let i=0;i<500;i++){const x=(r()-0.5)*60000,z=(r()-0.5)*60000,s=600+r()*1400;cm.ico([x,200+r()*300,z],s,[1,1,1],0,0.4)}L.cloudMesh=cm.build()}
  LOC[key]=L;return L}
function mix3(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}function clamp01(x){return Math.max(0,Math.min(1,x))}
// ---------- earth / space ----------
let EARTH,CLOUDS,MOON,ISS,PLANE,EPATCH,CPATCH;
function buildSpace(){const RE=6371;const em=new MB();const la=220,lo=440;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*Math.PI*2;return[Math.sin(th)*Math.cos(ph)*RE,Math.cos(th)*RE,Math.sin(th)*Math.sin(ph)*RE]};
  const col=(p)=>{const lat=Math.asin(p[1]/RE);const n=fbm(p[0]*0.0007+10,p[2]*0.0007+p[1]*0.0003,6);const d=fbm(p[0]*0.004+1,p[2]*0.004-p[1]*0.002,3);const j=(hsh(p[0]*3|0,p[2]*3|0)-0.5)*0.05;
    if(Math.abs(lat)>1.22+0.1*d)return C.snow;let c;
    if(n>0.53){const dry=Math.abs(lat)<0.55&&d>0.5;c=n>0.63?(n>0.68?hx('#6f7d4a'):hx('#4f7436')):(dry?mix3(hx('#d2b878'),hx('#b89458'),d):mix3(hx('#3f7f35'),hx('#6a9a45'),d))}
    else c=n>0.505?mix3(hx('#3aa8c8'),hx('#2a86bc'),(0.53-n)/0.025):mix3(hx('#1f62ad'),hx('#123d86'),clamp01((0.5-n)*6));
    return[c[0]+j,c[1]+j,c[2]+j]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const m=V.sc(V.add(V.add(a,b),V.add(c,d)),0.25);const cc=col(m);if(i>0)em.tri(a,d,c,cc);if(i<la-1)em.tri(a,c,b,cc)}
  EARTH=em.build();
  const cm=new MB();const RC=RE+12;const Pc=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*Math.PI*2;return[Math.sin(th)*Math.cos(ph)*RC,Math.cos(th)*RC,Math.sin(th)*Math.sin(ph)*RC]};
  for(let i=1;i<la-1;i++)for(let j=0;j<lo;j++){const a=Pc(i,j);if(fbm(a[0]*0.0013+3,a[2]*0.0013+a[1]*0.0006,5)<0.57)continue;cm.quad(a,Pc(i,j+1),Pc(i+1,j+1),Pc(i+1,j),[0.9,0.92,0.96],MAT.emis)}CLOUDS=cm.build();
  {const I=M4.inv(M4.trs([0,0,0],1.48+38*0.004,0.6,0,1));const tob=w=>[I[0]*w[0]+I[4]*w[1]+I[8]*w[2],I[1]*w[0]+I[5]*w[1]+I[9]*w[2],I[2]*w[0]+I[6]*w[1]+I[10]*w[2]];
   const NN=300,A=0.5,c0=0.16;const W_=(i,j,R)=>{const a=(i/NN-0.5)*2*A,jj=j/NN,b=-0.08+0.66*jj*jj;const d=V.norm([Math.sin(a),Math.cos(a)*Math.cos(b),-Math.cos(a)*Math.sin(b)]);return tob(V.sc(d,R))};
   const pm=new MB(),pc=new MB();const G=[],GC=[];for(let i=0;i<=NN;i++){G.push([]);GC.push([]);for(let j=0;j<=NN;j++){G[i].push(W_(i,j,RE+3));GC[i].push(W_(i,j,RE+14))}}
   for(let i=0;i<NN;i++)for(let j=0;j<NN;j++){const a=G[i][j],b=G[i+1][j],c=G[i+1][j+1],d=G[i][j+1];const m=V.sc(V.add(V.add(a,b),V.add(c,d)),0.25);const mo=V.sc(m,RE/V.len(m));
     const cc=col(mo);const fine=(fbm(mo[0]*0.03,mo[2]*0.03+mo[1]*0.01,3)-0.5)*0.14+(vnoise(mo[0]*0.15+mo[1]*0.05,mo[2]*0.15)-0.5)*0.08;pm.tri(a,c,b,[cc[0]+fine,cc[1]+fine,cc[2]+fine]);pm.tri(a,d,c,[cc[0]+fine,cc[1]+fine,cc[2]+fine]);
     const q=V.sc(mo,(RE+12)/RE);const cv=0.55*fbm(q[0]*0.0013+3,q[2]*0.0013+q[1]*0.0006,5)+0.45*fbm(q[0]*0.006-2,q[2]*0.006+q[1]*0.003,4);const jb_=-0.08+0.66*(j/NN)**2,ia_=(i/NN-0.5)*2*A;if(cv>=0.585&&Math.hypot(jb_,ia_*0.7)>0.045){const A_=GC[i][j],B_=GC[i+1][j],C_=GC[i+1][j+1],D_=GC[i][j+1];pc.tri(A_,C_,B_,[0.9,0.92,0.96],MAT.emis);pc.tri(A_,D_,C_,[0.9,0.92,0.96],MAT.emis)}}
   EPATCH=pm.build();CPATCH=pc.build()}
  const mm=new MB();mm.ico([0,0,0],1,hx('#c8c8d0'));MOON=mm.build();
  const is=new MB();const G=hx('#c8a24a'),T=hx('#a0a4ac'),B=hx('#24407a');is.box([0,0,0],[30,1,1],T);for(const sx of[-12,-8,8,12])for(const sz of[-1,1])is.box([sx,0,sz*6],[3.2,0.12,10],B,0,0,G);is.box([0,0,0],[4,4,14],hx('#e6e6ea'));is.box([0,-3,4],[3,3,6],hx('#d0d0d6'));ISS=is.build();
  const pm=new MB();const W_=hx('#f2f4f7'),B_=hx('#1f4fa8');pm.box([0,0,0],[3.8,3.8,34],W_);pm.box([0,-0.3,-18.5],[3.0,3.0,3],W_);pm.box([0,-0.1,-20.3],[2.0,2.0,0.8],hx('#2a3140'));pm.box([0,0.5,19],[2.6,2.4,4],W_);
  pm.quad([-1.9,-0.8,-3],[1.9,-0.8,-3],[16,-0.4,6],[14,-0.4,8.5],W_);pm.quad([1.9,-0.8,-3],[-1.9,-0.8,-3],[-14,-0.4,8.5],[-16,-0.4,6],W_);pm.quad([-1.9,-1.1,-3],[-16,-0.7,6],[-14,-0.7,8.5],[1.9,-1.1,-3],hx('#c8ccd4'));pm.quad([1.9,-1.1,-3],[14,-0.7,8.5],[16,-0.7,6],[-1.9,-1.1,-3],hx('#c8ccd4'));
  pm.box([0,4.6,18.5],[0.5,7,4.2],B_);pm.box([0,1.4,19.5],[12,0.35,2.6],W_);for(const sx of[-7,7])pm.box([sx,-2.3,-1],[2.3,2.3,5],hx('#9aa0aa'));
  for(let z=-15;z<14;z+=1.2)for(const sx of[-1.92,1.92])pm.box([sx,0.7,z],[0.04,0.5,0.6],hx('#2a3140'));pm.box([0,-1.4,0],[3.85,1.0,33],B_);PLANE=pm.build()}
