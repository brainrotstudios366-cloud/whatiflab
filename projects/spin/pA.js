// ================= EARTH STOPS SPINNING: meshes =================
function spEarthCol(n){const v=sLand(n);const lat=Math.abs(n[1]);
  const deep=clamp((0.5-v)/0.14,0,1);const ocean=mix3(HC('#2c8ad4'),HC('#0a2766'),Math.pow(deep,0.55));
  const dry=clamp((fbm(n[0]*3+11,n[2]*3+n[1],3)-0.45)*3+(lat<0.35?0.3:-0.25),0,1);const hi=clamp((v-0.57)*6,0,1);
  let land=mix3(HC('#3f8a3c'),HC('#cfa86a'),dry*0.85);land=mix3(land,HC('#7a6644'),hi*0.45);
  let c=mix3(ocean,land,sst(0.497,0.507,v));const ice=sst(0.93,0.975,lat+(v-0.5)*0.15);return mix3(c,[0.82,0.87,0.94],ice)}
const SPE=um(m=>sph(m,1,128,256,spEarthCol,0),0.3);
// "never spins again": oceans pile up at the poles, one equatorial mega-continent (Esri 2010)
function spEarth2Col(n){const v=sLand(n);const lat=Math.abs(n[1]);const edge=0.62+0.12*(fbm(n[0]*2.6+5,n[2]*2.6+n[1],4)-0.5)*2+(v-0.5)*0.5;
  const isLand=sst(edge+0.015,edge-0.015,lat);const deep=clamp((lat-edge)/0.2,0,1);const ocean=mix3(HC('#2c8ad4'),HC('#0a2766'),Math.pow(deep,0.6));
  const dry=clamp((fbm(n[0]*3+11,n[2]*3+n[1],3)-0.42)*3+(lat<0.3?0.35:-0.1),0,1);let land=mix3(HC('#4a8a3c'),HC('#d6ae6c'),dry*0.9);land=mix3(land,HC('#7a6644'),clamp((v-0.55)*5,0,1)*0.5);
  let c=mix3(ocean,land,isLand);const ice=sst(0.9,0.96,lat);return mix3(c,[0.93,0.95,1],ice*0.9)}
const SPE2=um(m=>sph(m,1.002,128,256,spEarth2Col,0),0.3);
// separate cloud shell (so the air can keep moving while the ground stops)
const SPCLOUD=um(m=>{const r=rngG(12);let k=0;for(let i=0;i<200000&&k<26000;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const n=[s*Math.cos(a),u,s*Math.sin(a)];const c=sCloud(n);if(c<0.565)continue;k++;
  const p=V.sc(n,1.012+0.004*r());const sz=0.007+0.02*clamp((c-0.565)*5,0,1)*(0.5+0.5*r());const t1=V.norm(V.cross(n,Math.abs(n[1])<0.9?[0,1,0]:[1,0,0])),t2=V.cross(n,t1);const col=mix3([0.9,0.92,0.96],[1,1,1],r());
  const NS=7;for(let j=0;j<NS;j++){const a0=j/NS*TAU2,a1=(j+1)/NS*TAU2;const q0=V.add(p,V.add(V.sc(t1,Math.cos(a0)*sz),V.sc(t2,Math.sin(a0)*sz))),q1=V.add(p,V.add(V.sc(t1,Math.cos(a1)*sz),V.sc(t2,Math.sin(a1)*sz)));m.tri(p,q0,q1,col,0)}}});
// ISS-like station
const SPISS=um(m=>{const g=[0.82,0.84,0.88];m.box([0,0,0],[0.9,0.16,0.16],g);m.box([0,0,0],[0.14,0.14,0.6],g);for(const x of[-0.62,-0.38,0.38,0.62])m.box([x,0,0],[0.18,0.02,1.3],HC('#2a4590'),0,0,HC('#3c62c0'))});
// ---- ground town (second 1) ----
const SPTOWN=um(m=>{ground(m,-160,-160,160,40,null,0,8,(x,z)=>mix3(C.grass,C.grass2,fbm(x*0.05,z*0.05,3)));
  ground(m,-160,-4,160,4,C.road,0.02,8);for(let x=-150;x<150;x+=6)m.box([x,0.04,0],[3,0.02,0.25],C.line);ground(m,-160,-6.5,160,-4,C.side,0.05,8);ground(m,-160,4,160,6.5,C.side,0.05,8);
  const walls=[hx('#e8dcc4'),hx('#c9d7e3'),hx('#efc9a8'),hx('#d8e2c4'),hx('#f0e6d6')];const roofs=[C.roofR,C.roofG,hx('#7a4a3a')];
  for(let i=-7;i<=7;i++){const x=i*11+3*hsh(i,2);house(m,x,-13-3*hsh(i,3),7,6,4+hsh(i,4)*2,walls[(i+7)%5],roofs[(i+9)%3],0)}
  for(let i=-6;i<=6;i++){const x=i*13+5;house(m,x,-34-4*hsh(i,5),8,7,5+hsh(i,6)*3,walls[(i+9)%5],roofs[(i+7)%3],0)}
  for(let i=-10;i<10;i++){tree(m,i*9+4,-25+2*hsh(i,7),1.2+0.4*hsh(i,8),0,'pine')}
  for(let i=-12;i<12;i++){tree(m,i*14,-58-6*hsh(i,9),2+hsh(i,10),0)}},0);
const SPCAR=[hx('#e2483a'),hx('#2f7fe0'),hx('#f2cf2e'),hx('#f2f2f2')].map(col=>um(m=>car(m,0,0,Math.PI/2,col),0));
const SPBUS=um(m=>bus(m,0,0,Math.PI/2,hx('#f2b02e')),0);
const SPTREE=um(m=>tree(m,0,0,1.1,0),0);
const SPCRATE=um(m=>{m.box([0,0.5,0],[1,1,1],C.wood);m.box([0,0.5,0.505],[0.9,0.12,0.02],hx('#8a6a45'));m.box([0,0.5,-0.505],[0.9,0.12,0.02],hx('#8a6a45'))},0);
const SPBIN=um(m=>{m.prism([0,0,0],0.4,0.45,1.1,10,hx('#3f9a5a'));m.prism([0,1.1,0],0.48,0.48,0.08,10,hx('#2f7a45'))},0);
const SPBALL=um(m=>m.ico([0,0.45,0],0.45,[1,1,1],0,1,[8,12]),0);
// ---- coast city + mega wave (second 3) ----
const SPCOAST=um(m=>{const r=rngG(31);ground(m,-400,-400,40,200,HC('#1f5f9a'),0,20);m.d&&0;
  ground(m,40,-400,400,200,null,0.5,20,(x,z)=>mix3(HC('#8d8a82'),HC('#6f7266'),fbm(x*0.02,z*0.02,3)));ground(m,30,-400,40,200,C.sand,0.3,10);
  const cols=[hx('#7c93b0'),hx('#a9b8c9'),hx('#5f7590'),hx('#c8ccd2'),hx('#8aa0b8')];
  for(let i=0;i<9;i++)for(let j=0;j<12;j++){const x=55+i*16+r()*6,z=-170+j*17+r()*6;const h=(30+r()*90)*(1-i*0.05);skyscraper(m,x,z,9+r()*5,9+r()*5,h,cols[(i+j)%5],0)}},0);
const SPWATER=um(m=>{for(let i=-20;i<2;i++)for(let j=-20;j<10;j++){const x=i*20,z=j*20;m.quad([x,0.2,z],[x,0.2,z+20],[x+20,0.2,z+20],[x+20,0.2,z],HC('#1d5b92'),MAT.water)}});
const SPWAVE=um(m=>{const PR=[[-90,0],[-50,0.22],[-25,0.55],[-10,0.86],[-3,0.98],[1,1.0],[4.5,0.95],[7,0.82],[8,0.62],[7.6,0.42],[8.6,0.2],[11,0]];
  const col=y=>y>0.9?mix3(HC('#bfe8f5'),[1,1,1],(y-0.9)*10):mix3(HC('#082c55'),HC('#1f86a8'),Math.pow(y/0.9,1.6));
  const tap=z=>sst(-300,-200,z)*sst(140,60,z);for(let k=0;k<88;k++){const z0=-300+k*5,z1=z0+5;const w0=4*Math.sin(z0*0.05)+2*Math.sin(z0*0.13),w1=4*Math.sin(z1*0.05)+2*Math.sin(z1*0.13);const h0=tap(z0),h1=tap(z1);
    for(let i=0;i<PR.length-1;i++){const a=PR[i],b=PR[i+1];m.quad([a[0]+w0,a[1]*h0,z0],[b[0]+w0,b[1]*h0,z0],[b[0]+w1,b[1]*h1,z1],[a[0]+w1,a[1]*h1,z1],[col(a[1]),col(b[1]),col(b[1]),col(a[1])],0)}}},0.5);
// ================= timeline =================
const EV={stop:1.25,idea:3.5,r1:9.6,fly:10.5,r2:17.0,r3:24.0,r4:31.0,r5:37.4,back:41.0,never:43.6,morph:45.0,day:51.6,endc:58.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.never)return'r5';if(t<EV.day)return'never';if(t<EV.endc)return'day';return'end'}
function rotY(v,a){const c=Math.cos(a),s=Math.sin(a);return[c*v[0]+s*v[2],v[1],-s*v[0]+c*v[2]]}
// Earth spin angle (exaggerated for readability) and the cloud/air angle that keeps going
const WSP=2.2;
function spinAng(t){if(t<EV.stop)return t*WSP;if(t<EV.idea){const k=t-EV.stop;return EV.stop*WSP+0.05*Math.sin(k*18)*Math.exp(-k*5)}
  if(t<EV.r1)return 1.2+(t-EV.idea)*0.18;if(t<EV.back)return 0.4;if(t<EV.never){const k=t-EV.back;return 0.4+WSP*(k-(1-Math.exp(-k*2))/2*0)}return 0.4+WSP*(EV.never-EV.back)}
function cloudAng(t){if(t<EV.stop)return t*WSP;if(t<EV.idea)return t*WSP;if(t<EV.r1)return spinAng(t);if(t<EV.r2)return 0.4;if(t<EV.r5+0.01)return 0.4+(t-EV.r2)*1.1;if(t<EV.back)return 0.4+(EV.r5-EV.r2)*1.1+(t-EV.r5)*1.1;return spinAng(t)+0.6}
function envBase(){return{sun:V.norm([0.85,0.32,0.55]),sunCol:V.sc(hx('#fff1e0'),1.25),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.05,0.06,0.1]}}
function envAt(t){const S=scn(t);if(S==='r1'||S==='r3'){return envDay({sun:V.norm([-0.35,0.75,0.55]),fogD:S==='r3'?900:320,fog:hx('#cfe0f0')})}
  const e=envBase();if(S==='day'){e.sun=V.norm([-1,0.15,0.15])}if(S==='r4'){e.sun=V.norm([0.7,0.6,0.5])}return e}
function camAt(t){const S=scn(t);let eye=[0,0.35,4.4],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;eye=[0.2*Math.sin(tt*0.3),0.55,lerp(4.7,4.3,ease(tt/3))];at=[0,0.05,0]}
  if(S==='idea'){const k=ease(seg(t,EV.idea,EV.idea+1.0));eye=[lerp(0.2,-0.6,k),lerp(0.55,0.9,k),lerp(4.3,3.6,k)];at=[0.1,0.18,0]}
  if(S==='r1'){const ks=Math.max(0,t-EV.fly);eye=[-2+ks*0.9,4.2,25];at=[2+ks*1.6,1.7,0];fov=0.95}
  if(S==='r2'){const k=seg(t,EV.r2,EV.r3);eye=[lerp(-1.2,0.8,k),lerp(1.4,1.0,k),lerp(3.7,3.4,k)];at=[0,0.05,0]}
  if(S==='r3'){const k=seg(t,EV.r3,EV.r4);eye=[lerp(-190,-150,k),lerp(120,130,k),lerp(330,310,k)];at=[lerp(-40,0,k),20,-70];fov=0.95}
  if(S==='r4'){const k=ease(seg(t,EV.r4,EV.r4+1.4));eye=[lerp(0.4,0.15,k),lerp(1.6,3.3,k),lerp(3.6,2.1,k)];at=[0,lerp(0,0.35,k),0]}
  if(S==='r5'){const k=seg(t,EV.r5,EV.never);eye=[lerp(0.9,-0.4,k),0.6,lerp(4.3,4.6,k)];at=[0,0.05,0]}
  if(S==='never'){const k=ease(seg(t,EV.morph,EV.morph+2.6));eye=[0.3,lerp(0.5,2.0,k),lerp(4.6,4.0,k)];at=[0,lerp(0.1,0.15,k),0]}
  if(S==='day'){const k=seg(t,EV.day,EV.endc);eye=[lerp(0.6,0.1,k),0.45,lerp(4.4,4.7,k)];at=[-0.05,0.08,0]}
  return{eye,at,fov}}
let EARTHS=[],SPQ=null,SPISSP=null,SPOBJ=[];
function spEarth(items,p,s,ang,cang,mk,tiltZ){const M=M4.trs(p,ang,0,tiltZ||0,s);items.push({mesh:SPE,M});if(mk>0)items.push({mesh:SPE2,M,alpha:mk});
  items.push({mesh:SPCLOUD,M:M4.trs(p,cang,0,tiltZ||0,s),alpha:(1-mk*0.5)*0.75,noShadow:true});EARTHS.push({p,s,dk:0})}
// flying objects of second 1: [mesh, x, z, speed, lift, spin, scale]
const SPFLY=[[()=>SPCAR[0],-9,1.8,1,0.12,0.5,1],[()=>SPCAR[1],2,-1.9,1,0.1,-0.4,1],[()=>SPBUS,-22,1.6,0.95,0.08,0.2,1],[()=>SPCAR[2],12,1.9,1.05,0.14,0.7,1],[()=>SPCAR[3],-30,-1.8,1,0.1,-0.6,1],
  [()=>SPCRATE,-4,6.2,1.1,0.35,1.6,0.9],[()=>SPCRATE,6,7,1.15,0.4,-2.0,0.8],[()=>SPBIN,-1,-5.4,1.2,0.5,2.6,1],[()=>SPBIN,9,5.6,1.25,0.45,-2.2,1],[()=>SPBALL,4,9,1.4,0.7,3.5,1],
  [()=>SPTREE,-12,8.5,0.9,0.3,1.0,1],[()=>SPTREE,15,-7.5,0.9,0.28,-1.2,1],[()=>SPTREE,-18,-7.8,0.85,0.25,1.1,1],[()=>SPCRATE,-14,5.5,1.1,0.4,1.8,0.7]];
function flyOff(t){return Math.max(0,t-EV.fly)}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];SPISSP=null;SPOBJ=[];
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;const a=S==='end'?tt*WSP:spinAng(tt),c=S==='end'?tt*WSP:cloudAng(tt);spEarth(items,[0,0,0],1,a,c,0)}
  if(S==='idea'){spEarth(items,[0,0,0],1,spinAng(t),cloudAng(t),0);const k=seg(t,EV.idea+4.2,EV.idea+4.6);if(k>0)qItems(items,t,cm,{x:0.62,y:-0.55,s:0.15,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='r2'||S==='r5'){spEarth(items,[0,0,0],1,spinAng(t),cloudAng(t),0)}
  if(S==='r4'){spEarth(items,[0,0,0],1,0.4,cloudAng(t),0);const a=t*0.55;const R=1.16;const p=[Math.cos(a)*R,Math.sin(a)*0.55*R,Math.sin(a)*0.83*R];SPISSP=p;items.push({mesh:SPISS,M:M4.trs(p,-a,0.4,0,0.11)});
    const k=seg(t,EV.r4+2.0,EV.r4+2.4);if(k>0)qItems(items,t,cm,{x:-0.55,y:-0.5,s:0.14,d:3,pop:easeOut(k),expr:'happy'})}
  if(S==='never'||S==='day'){const mk=S==='day'?1:ease(seg(t,EV.morph,EV.morph+2.6));spEarth(items,[0,0,0],1,S==='day'?0.4+(t-EV.day)*0.08:0.4+(t-EV.never)*0.06,S==='day'?0.4+(t-EV.day)*0.08:0.4+(t-EV.never)*0.06,mk)}
  if(S==='r1'){items.push({mesh:SPTOWN,M:ID4});const ks=flyOff(t);const v=7.5;
    for(const[mf,x,z,sp,lift,spin,sc]of SPFLY){const d=ks*v*sp;const y=lift*ks*ks*0.9+(mf()===SPTREE?0:0);const p=[x+d,y,z];const M=M4.trs(p,0,0,-spin*ks*0.35,sc);items.push({mesh:mf(),M});SPOBJ.push(p)}
    // dust puffs where things were
    if(ks>0)for(let i=0;i<SPFLY.length;i++){const[mf,x,z,sp]=SPFLY[i];for(let j=0;j<3;j++){const kk=ks-j*0.25;if(kk<0)continue;const p=[x+kk*7.5*sp*0.6-j*1.5,0.6+kk*0.4,z];items.push({mesh:PUFF,M:M4.trs(p,i+j,0,0,0.5+kk*0.5),tint:hx('#d8cbb0'),tintAmt:0.6,alpha:clamp(0.6-kk*0.12,0,0.6),noShadow:true})}}
    const kq=seg(t,EV.fly+0.6,EV.fly+0.9);if(kq>0){const ks2=Math.max(0,t-EV.fly-0.6);qItems(items,t,cm,{x:0.55-ks2*0.25,y:0.32+ks2*0.03,s:0.11,d:3,pop:easeOut(kq),expr:'wide'})}}
  if(S==='r3'){items.push({mesh:SPCOAST,M:ID4});items.push({mesh:SPWATER,M:ID4});const k=seg(t,EV.r3+0.8,EV.r4-0.4);const xw=lerp(-220,40,k);const Hh=lerp(55,90,ease(k));items.push({mesh:SPWAVE,M:M4.trs([xw,0,0],0,0,0,[1.6,Hh,1])});
    if(k>0.82){const kk=(k-0.82)/0.18;for(let i=0;i<16;i++){const z=-150+i*12;const p=[45+kk*20+hsh(i,3)*10,20+kk*60*hsh(i,4),z];items.push({mesh:PUFF,M:M4.trs(p,i,0,0,10+kk*25),tint:[0.95,0.97,1],tintAmt:0.8,alpha:clamp(0.9-kk*0.2,0,0.9),noShadow:true})}}
    SPOBJ=[[xw+2,Hh,-40]]}
  return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  if(S!=='r1'&&S!=='r3')items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const shc=S==='r1'?{center:[cm.at[0],0,-2],radius:42}:S==='r3'?{center:[60,0,-60],radius:220}:{center:[0,-9999,0],radius:1};
  if(S==='r1'||S==='r3'){env.ground=1;env.gndCol=S==='r3'?hx('#1d5b92'):C.grass}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:S==='r3'?1:0.02,far:S==='r3'?4000:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.stop,16,0.7);S(EV.fly,12,0.8);S(EV.r3+5.6,10,1.0);S(EV.back,14,0.8);S(EV.r2,4,0.4);return a}
