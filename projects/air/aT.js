// ================= EARTH'S AIR DISAPPEARS 5s: meshes + timeline =================
// dead airless Earth ("never comes back"): dry ocean basins + salt flats, grey-brown land
function arDryCol(n){const v=sLand(n);const f=fbm(n[0]*6+3,n[2]*6+n[1]*2,4);const basin=sst(0.507,0.49,v);
  let land=mix3(HC('#8a7a66'),HC('#5e544a'),clamp((f-0.35)*2,0,1));const sea=mix3(HC('#4a4440'),HC('#cfc8bc'),clamp((f-0.62)*4,0,1)*0.8);
  return mix3(land,sea,basin)}
const ARDRY=um(m=>sph(m,1.002,128,256,arDryCol,0),0.3);
// airliner along +x (nose at +x), wingspan along z
function arFlat(m,pts,y,th,col){const n=pts.length;const top=pts.map(p=>[p[0],y+th/2,p[1]]),bot=pts.map(p=>[p[0],y-th/2,p[1]]);
  for(let i=1;i<n-1;i++){m.tri(top[0],top[i+1],top[i],col);m.tri(bot[0],bot[i],bot[i+1],col)}
  for(let i=0;i<n;i++){const j=(i+1)%n;m.quad(top[i],bot[i],bot[j],top[j],col)}}
const ARJET=um(m=>{const W=HC('#f3f5f9'),G=HC('#c4cad6'),D=HC('#1b2233'),A=HC('#ff5a8a'),Cy=HC('#2fb8e8');
  tube(m,[-3.0,0,0],[2.6,0,0],0.34,0.34,W,18);tube(m,[2.6,0,0],[3.35,-0.04,0],0.34,0.12,W,18);m.ico([3.38,-0.04,0],0.12,W,0,1,[6,10]);
  tube(m,[-3.0,0,0],[-4.4,0.2,0],0.34,0.07,W,18);
  for(let i=0;i<16;i++){const x=-2.4+i*0.3;for(const s of[-1,1])m.box([x,0.1,s*0.325],[0.12,0.11,0.04],D)}
  for(const s of[-1,1])m.box([2.75,0.12,s*0.27],[0.25,0.1,0.12],D);
  for(const s of[-1,1])m.box([0,-0.12,s*0.33],[5.8,0.06,0.03],Cy);
  // wings (swept) + engines
  for(const s of[-1,1]){arFlat(m,[[0.9,s*0.25],[-0.5,s*0.25],[-1.7,s*3.6],[-1.1,s*3.6]],-0.12,0.08,G);
    tube(m,[0.75,-0.42,s*1.35],[-0.35,-0.42,s*1.35],0.2,0.16,HC('#dfe3ea'),14);tube(m,[0.77,-0.42,s*1.35],[0.6,-0.42,s*1.35],0.205,0.205,D,14);
    arFlat(m,[[-3.4,s*0.1],[-4.0,s*0.1],[-4.55,s*1.3],[-4.25,s*1.3]],0.12,0.05,G)}
  // fin
  m.quad([-3.5,0.25,0.02],[-4.35,1.55,0.02],[-4.75,1.55,0.02],[-4.5,0.2,0.02],A);m.quad([-4.5,0.2,-0.02],[-4.75,1.55,-0.02],[-4.35,1.55,-0.02],[-3.5,0.25,-0.02],A)},0.4);
const ARENG=[[-0.4,-0.42,1.35],[-0.4,-0.42,-1.35]];
// ice crust patches on the ocean (r4)
const ARICE=um(m=>{const S=3;for(let i=-110;i<10;i++)for(let j=-100;j<50;j++){const x=i*S,z=j*S;const f=fbm(x*0.02+4,z*0.02,4);if(f<0.47)continue;const c=mix3(HC('#a9d4e8'),HC('#f4fbff'),clamp((f-0.47)*5,0,1));m.quad([x,0.35,z],[x,0.35,z+S],[x+S,0.35,z+S],[x+S,0.35,z],c,0)}});
// ================= timeline =================
const EV={gone:1.25,idea:3.5,r1:9.6,fly:10.5,r2:17.0,r3:24.0,r4:31.0,r5:37.4,back:41.0,never:43.6,morph:45.0,day:51.6,endc:58.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.never)return'r5';if(t<EV.day)return'never';if(t<EV.endc)return'day';return'end'}
// how much air there is (1 = normal) -> atmosphere glow, clouds, blue sky
function airAmt(t){const S=scn(t);if(S==='hook')return 1-seg(t,EV.gone,EV.gone+0.22);if(S==='idea')return 1;if(S==='r1')return 1-seg(t,EV.fly,EV.fly+0.5);
  if(S==='r5')return seg(t,EV.back,EV.back+0.35);if(S==='never')return 1-seg(t,EV.morph,EV.morph+1.6);return S==='day'||S==='end'?1:0}
function envBase(){return{sun:V.norm([0.85,0.32,0.55]),sunCol:V.sc(hx('#fff1e0'),1.25),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.05,0.06,0.1]}}
function envVac(sun){return{sun,sunCol:V.sc(hx('#ffffff'),1.35),sky:[0.035,0.035,0.05],gnd:[0.02,0.02,0.025],fog:hx('#05060c'),fogD:1e7,zen:hx('#000003'),hor:hx('#05060f'),stars:1.0,night:0,emis:1,sunSize:0.03,fillD:[-0.6,0.3,0.7],fillC:[0.02,0.02,0.03]}}
function mixEnv(a,b,k){const o={};for(const key in b){const x=a[key],y=b[key];if(Array.isArray(y)&&Array.isArray(x))o[key]=x.map((v,i)=>lerp(v,y[i],k));else if(typeof y==='number'&&typeof x==='number')o[key]=key==='fogD'?Math.exp(lerp(Math.log(x),Math.log(y),k)):lerp(x,y,k);else o[key]=k<0.5&&x!==undefined?x:y}return o}
const AR_SUNT=V.norm([-0.35,0.75,0.55]);
function envAt(t){const S=scn(t);
  if(S==='r1'){const d=envDay({sun:AR_SUNT,fogD:320,fog:hx('#cfe0f0')});return mixEnv(d,envVac(AR_SUNT),ease(1-airAmt(t)))}
  if(S==='r2'||S==='r3')return envVac(S==='r3'?V.norm([0.6,0.55,0.6]):AR_SUNT);
  if(S==='r4')return envVac(V.norm([0.5,0.5,0.7]));
  const e=envBase();if(S==='never'){e.sun=V.norm([0.3,0.35,0.9])}return e}
function arPlaneP(t){const k=t-EV.r2;const x=-30+k*22;const die=EV.r2+1.6;const kd=Math.max(0,t-die-0.6);return{p:[x,60-kd*kd*1.6,0],pitch:-Math.min(0.42,kd*0.16),roll:Math.sin(kd*1.3)*0.08*kd}}
function camAt(t){const S=scn(t);let eye=[0,0.35,4.4],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;eye=[0.2*Math.sin(tt*0.3),0.55,lerp(4.7,4.3,ease(tt/3))];at=[0,0.05,0]}
  if(S==='idea'){const k=ease(seg(t,EV.idea,EV.idea+1.2));eye=[lerp(0.2,-0.7,k),lerp(0.55,0.45,k),lerp(4.3,3.5,k)];at=[lerp(0,-0.12,k),0.1,0]}
  if(S==='r1'){const k=seg(t,EV.r1,EV.r2);const up=ease(seg(t,EV.fly,EV.fly+1.6));eye=[lerp(-0.8,0.8,k),lerp(1.6,1.4,k),lerp(17.5,16.5,k)];at=[lerp(0.2,0.6,k),lerp(2.4,6.5,up),0];fov=0.98}
  if(S==='r2'){const P=arPlaneP(t);const k=seg(t,EV.r2,EV.r3);eye=V.add(P.p,[lerp(-7,-3,k),lerp(2.2,4.5,k),lerp(12,13.5,k)]);at=V.add(P.p,[0.6,-0.4,0]);fov=0.9}
  if(S==='r3'){const k=seg(t,EV.r3,EV.r4);eye=[lerp(0.7,0.35,k),lerp(1.75,1.7,k),lerp(8.3,7.7,k)];at=[0,1.5,5.2];fov=0.8}
  if(S==='r4'){const k=seg(t,EV.r4,EV.r5);eye=[lerp(-130,-100,k),lerp(95,80,k),lerp(300,265,k)];at=[lerp(-50,-35,k),0,-70];fov=0.95}
  if(S==='r5'){const k=seg(t,EV.r5,EV.never);eye=[lerp(0.9,-0.4,k),0.6,lerp(4.0,4.5,k)];at=[0,0.05,0]}
  if(S==='never'){const k=ease(seg(t,EV.morph,EV.morph+2.6));eye=[0.3,lerp(0.5,1.2,k),lerp(4.6,3.9,k)];at=[0,lerp(0.1,0.12,k),0]}
  if(S==='day'){const k=seg(t,EV.day,EV.endc);eye=[lerp(0.7,0.1,k),0.75,lerp(3.6,3.9,k)];at=[-0.1,0.3,0]}
  return{eye,at,fov}}
let EARTHS=[],AROBJ={};
const ARSP=0.35;// slow globe spin
function arEarth(items,ang,air,dry){const M=M4.trs([0,0,0],ang,0,0.2,1);items.push({mesh:SPE,M});if(dry>0)items.push({mesh:ARDRY,M,alpha:dry});
  if(air>0.01)items.push({mesh:SPCLOUD,M:M4.trs([0,0,0],ang*1.15,0,0.2,1),alpha:air*0.78,noShadow:true});EARTHS.push({p:[0,0,0],s:1,a:air})}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];AROBJ={};const air=airAmt(t);
  if(S==='hook'||S==='end'||S==='idea'||S==='r5'||S==='day'){arEarth(items,t*ARSP*(S==='end'?1:1)+(S==='end'?-EV.endc*ARSP:0),air,0)}
  if(S==='never'){arEarth(items,t*ARSP,air,ease(seg(t,EV.morph,EV.morph+1.8)))}
  if(S==='idea'){const k=seg(t,EV.idea+4.0,EV.idea+4.4);if(k>0)qItems(items,t,cm,{x:0.6,y:-0.52,s:0.15,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='r1'||S==='r3'||S==='r2'){items.push({mesh:SPTOWN,M:ID4})}
  if(S==='r1'){const ks=Math.max(0,t-EV.fly);for(const it of jumperItems([1.05,0,11.6],-0.25,0,ks>1.2?0.9:0.05,0,1.0))items.push(it);
    for(const it of jumperItems([-1.2,0,10.8],0.3,0,ks>1.8?0.95:0.08,0,0.95))items.push(it);
    const kq=seg(t,EV.fly+2.0,EV.fly+2.3);if(kq>0)qItems(items,t,cm,{x:0.58,y:0.1,s:0.12,d:3,pop:easeOut(kq),expr:'wide'})}
  if(S==='r2'){const P=arPlaneP(t);const M=M4.mul(M4.trs(P.p,0,0,P.pitch,1),M4.trs([0,0,0],0,P.roll,0,1));items.push({mesh:ARJET,M});
    AROBJ.eng=ARENG.map(e=>{const v=[e[0],e[1],e[2],1];const r=[0,0,0];for(let i=0;i<3;i++)r[i]=M[i]*v[0]+M[4+i]*v[1]+M[8+i]*v[2]+M[12+i];return r});AROBJ.plane=P.p}
  if(S==='r3'){const k=seg(t,EV.r3+1.6,EV.r3+3.2);const sw=1+0.035*ease(k);for(const it of jumperItems([0,0,5.2],0,0,0.08,0,sw))items.push(it);AROBJ.head=[0,0.86*1+0.86,5.2]}
  if(S==='r4'){items.push({mesh:SPCOAST,M:ID4});items.push({mesh:SPWATER,M:ID4});const ki=ease(seg(t,EV.r4+3.0,EV.r4+5.2));if(ki>0)items.push({mesh:ARICE,M:ID4,alpha:ki*0.92});
  }
  return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  const town=S==='r1'||S==='r2'||S==='r3';const vac=1-airAmt(tt);
  if(!town&&S!=='r4')items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  else if(vac>0.02)items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true,alpha:vac});
  const shc=S==='r1'||S==='r3'?{center:[0,0,6],radius:30}:S==='r4'?{center:[60,0,-60],radius:220}:{center:[0,-9999,0],radius:1};
  if(town||S==='r4'){env.ground=1;env.gndCol=S==='r4'?hx('#1d5b92'):hx('#4f7d3c')}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:S==='r4'?1:S==='r3'?0.05:S==='r2'?0.5:0.02,far:S==='r4'?4000:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.gone,16,0.7);S(EV.fly,12,0.8);S(EV.r2+1.6,8,0.6);S(EV.back,14,0.8);S(EV.r3+1.0,6,0.4);
  for(let i=0;i<6;i++)S(EV.r5+0.5+i*0.45,4,0.25);return a}
