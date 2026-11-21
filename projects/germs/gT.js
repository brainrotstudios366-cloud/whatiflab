// ================= ALL BACTERIA DISAPPEAR 5s: meshes + timeline =================
// bacterium rod (capsule along x, ~2.4 long incl. flagellum) – light colour, recoloured per instance with tint
const GB_ROD=um(m=>{const B=HC('#e8fff0'),D=HC('#bfe9cf'),E=HC('#ffffff');
  tube(m,[-0.75,0,0],[0.75,0,0],0.34,0.34,B,22);m.ico([0.75,0,0],0.34,B,0,1,[10,22]);m.ico([-0.75,0,0],0.34,B,0,1,[10,22]);
  // pili (tiny hairs)
  for(let i=0;i<26;i++){const x=-0.9+hsh(i,3)*1.8;const a=hsh(i,4)*TAU2;const n=[0,Math.cos(a),Math.sin(a)];const p0=[x,n[1]*0.33,n[2]*0.33];const p1=V.add(p0,V.sc(n,0.16));tube(m,p0,p1,0.018,0.01,D,4)}
  // flagellum (helical tail, emissive)
  let prev=[-1.05,0,0];for(let i=1;i<=26;i++){const k=i/26;const p=[-1.05-k*1.9,Math.sin(k*TAU2*2.2)*0.16*k,Math.cos(k*TAU2*2.2)*0.16*k-0.0];tube(m,prev,p,0.04,0.04,E,6,MAT.emis);prev=p}
  // glowing inner bands (DNA hint)
  for(const x of[-0.35,0.05,0.42])tube(m,[x-0.06,0,0],[x+0.06,0,0],0.345,0.345,E,22,MAT.emis)},0.6);
// coccus chain (4 balls)
const GB_COC=um(m=>{const B=HC('#ffe8f0'),E=HC('#ffffff');for(let i=0;i<4;i++){const a=(i-1.5)*0.5;const c=[Math.sin(a)*1.6,Math.cos(a)*1.6-1.55,0];m.ico(c,0.36,B,0,1,[10,20]);m.ico(V.add(c,[0,0,0.3]),0.09,E,MAT.emis,1,[5,8])}},0.6);
// spirillum (corkscrew)
const GB_SPI=um(m=>{const B=HC('#fff6dc');let prev=null;for(let i=0;i<=60;i++){const k=i/60;const p=[-1.6+k*3.2,Math.sin(k*TAU2*2)*0.32,Math.cos(k*TAU2*2)*0.32];if(prev)tube(m,prev,p,0.14,0.14,B,10);prev=p}m.ico([-1.6,0,0.32],0.14,B,0,1,[6,10]);m.ico([1.6,0,0.32],0.14,B,0,1,[6,10])},0.6);
const GB_TYPES=[[GB_ROD,'#62ff9a'],[GB_ROD,'#5af0ff'],[GB_COC,'#ff6fa0'],[GB_ROD,'#7dff9a'],[GB_SPI,'#ffd84a'],[GB_ROD,'#5af0ff']];
// low-poly cow along +x (head at +x)
const GB_COW=um(m=>{const Wh=HC('#f4f1ea'),Bk=HC('#1d1d22'),Pk=HC('#f2a3b4'),Hf=HC('#3a3330'),Hn=HC('#e9dcc0');
  m.box([0,1.05,0],[1.45,0.78,0.82],Wh);m.box([0,1.05,0],[1.35,0.86,0.74],Wh);m.box([0,1.05,0],[1.55,0.7,0.74],Wh);
  for(const[x,y,z,sx,sy]of[[0.25,1.2,0.415,0.5,0.4],[-0.45,0.95,0.415,0.4,0.35],[-0.1,1.3,-0.415,0.55,0.35],[0.4,0.9,-0.415,0.3,0.3],[-0.55,1.25,0.0,0.3,0.05]])m.box([x,y,z],[sx,sy,0.02],Bk);
  m.box([-0.55,1.45,0.1],[0.35,0.02,0.4],Bk);
  for(const[x,z]of[[0.55,0.28],[0.55,-0.28],[-0.55,0.28],[-0.55,-0.28]]){m.box([x,0.4,z],[0.2,0.72,0.2],Wh);m.box([x,0.06,z],[0.22,0.12,0.22],Hf)}
  m.box([-0.15,0.6,0],[0.34,0.18,0.3],Pk);
  m.box([1.0,1.38,0],[0.52,0.46,0.44],Wh);m.box([1.0,1.52,0.12],[0.3,0.18,0.02].map((v,i)=>i===2?0.24:v),Bk);m.box([1.32,1.24,0],[0.2,0.3,0.4],Pk);
  for(const s of[-1,1]){m.box([1.42,1.28,s*0.1],[0.02,0.06,0.06],Bk);m.box([1.18,1.48,s*0.225],[0.1,0.1,0.02],Bk);m.box([1.2,1.5,s*0.232],[0.04,0.04,0.02],HC('#ffffff'));
    m.box([0.9,1.55,s*0.33],[0.12,0.08,0.22],Wh);tube(m,[0.98,1.62,s*0.15],[1.0,1.82,s*0.26],0.045,0.02,Hn,6)}
  tube(m,[-0.75,1.35,0],[-0.95,0.75,0],0.035,0.03,Wh,6);m.ico([-0.96,0.7,0],0.07,Bk,0,1.4,[5,8])},0.35);
// dead Earth ("never come back"): brown dying land, murky seas
function gbDeadCol(n){const v=sLand(n);const f=fbm(n[0]*6+3,n[2]*6+n[1]*2,4);const basin=sst(0.507,0.49,v);
  const land=mix3(HC('#7d6a52'),HC('#4f463d'),clamp((f-0.35)*2,0,1));const sea=mix3(HC('#14263a'),HC('#2a3b44'),clamp((f-0.5)*2,0,1));const ice=sst(0.78,0.86,Math.abs(n[1]));return mix3(mix3(land,sea,basin),HC('#dfe6ea'),ice*0.8)}
const GB_DEAD=um(m=>sph(m,1.003,128,256,gbDeadCol,0),0.3);
// ================= timeline =================
const EV={gone:1.25,idea:3.5,r1:9.6,r2:17.0,r3:24.0,r4:31.0,r5:37.4,back:41.0,never:43.6,morph:45.0,day:51.6,endc:58.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.never)return'r5';if(t<EV.day)return'never';if(t<EV.endc)return'day';return'end'}
const GB_SUN=V.norm([-0.35,0.75,0.55]);
function envMic(){return{sun:V.norm([0.5,0.7,0.6]),sunCol:V.sc(hx('#e8fff8'),1.15),sky:[0.05,0.12,0.13],gnd:[0.01,0.03,0.035],fog:hx('#04181c'),fogD:16,zen:hx('#021014'),hor:hx('#06262a'),stars:0,night:0,emis:1.25,sunSize:0.0,fillD:[-0.6,0.3,0.7],fillC:[0.06,0.2,0.22]}}
function envSpace(){return{sun:V.norm([0.85,0.32,0.55]),sunCol:V.sc(hx('#fff1e0'),1.25),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.05,0.06,0.1]}}
function envAt(t){const S=scn(t);
  if(S==='hook'||S==='day'||S==='end')return envMic();
  if(S==='r1'||S==='r4')return envDay({sun:GB_SUN,fogD:320,fog:hx('#cfe0f0')});
  if(S==='r2')return envDay({sun:V.norm([0.5,0.45,0.7]),fogD:900,fog:hx('#cfe0f0')});
  if(S==='r3')return envDay({sun:V.norm([-0.7,0.22,0.6]),fogD:260,fog:hx('#f3d2a8')});
  const e=envSpace();if(S==='never'){e.sun=V.norm([0.3,0.35,0.9])}return e}
function camAt(t){const S=scn(t);let eye=[0,0.35,4.4],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='day'||S==='end'){const tt=S==='hook'?t:S==='day'?t-EV.day+3:t-EV.endc;eye=[1.2*Math.sin(tt*0.25),0.6*Math.sin(tt*0.17),lerp(9.5,8.3,ease(clamp(tt/3,0,1)))];at=[0,0,-1];fov=0.85}
  if(S==='idea'){const k=ease(seg(t,EV.idea,EV.idea+1.2));eye=[lerp(0.2,-0.7,k),lerp(0.55,0.45,k),lerp(4.6,3.6,k)];at=[lerp(0,-0.12,k),0.1,0]}
  if(S==='r1'){const k=ease(seg(t,EV.r1,EV.r2));eye=[lerp(1.0,0.5,k),lerp(1.35,1.25,k),lerp(10.2,9.2,k)];at=[0,1.0,5.2];fov=0.85}
  if(S==='r2'){const k=seg(t,EV.r2,EV.r3);eye=[lerp(-130,-100,k),lerp(95,80,k),lerp(300,265,k)];at=[lerp(-50,-35,k),0,-70];fov=0.95}
  if(S==='r3'){const k=ease(seg(t,EV.r3,EV.r4));eye=[lerp(-2.6,-1.5,k),lerp(0.55,0.45,k),lerp(13.8,12.6,k)];at=[0,0.25,9];fov=0.9}
  if(S==='r4'){const k=ease(seg(t,EV.r4,EV.r5));eye=[lerp(3.4,2.6,k),lerp(1.9,1.65,k),lerp(12.2,11.2,k)];at=[0.2,0.9,6.5];fov=0.85}
  if(S==='r5'){const k=seg(t,EV.r5,EV.never);eye=[lerp(0.9,-0.4,k),0.6,lerp(4.0,4.5,k)];at=[0,0.05,0]}
  if(S==='never'){const k=ease(seg(t,EV.morph,EV.morph+2.6));eye=[0.3,lerp(0.5,1.0,k),lerp(4.6,3.9,k)];at=[0,lerp(0.1,0.12,k),0]}
  return{eye,at,fov}}
// swarm layout (shared by hook/day/end)
const GB_SW=[];for(let i=0;i<30;i++){GB_SW.push({p:[(hsh(i,11)-0.5)*9,(hsh(i,12)-0.5)*13,-7.5+hsh(i,13)*8],ty:i%GB_TYPES.length,yaw:hsh(i,14)*TAU2,pit:(hsh(i,15)-0.5)*1.4,sp:0.3+hsh(i,16)*0.5,s:0.75+hsh(i,17)*0.5,ph:hsh(i,18)*TAU2})}
GB_SW[0].p=[0.3,0.4,1.0];GB_SW[0].ty=0;GB_SW[0].s=1.25;GB_SW[1].p=[-2.2,-2.6,-0.5];GB_SW[1].ty=2;GB_SW[2].p=[2.4,3.4,-1.2];GB_SW[2].ty=4;
// visibility of the microbes per time (0..1 scale), with per-bug stagger
function swarmVis(t,i){const S=scn(t);if(S==='hook'){const k=seg(t,EV.gone+hsh(i,21)*0.12,EV.gone+0.22+hsh(i,21)*0.12);return 1-k}
  if(S==='day'){return easeOut(seg(t,EV.day+0.05+hsh(i,22)*0.5,EV.day+0.35+hsh(i,22)*0.5))}return 1}
let GB_POS=[];
function swarmItems(items,t){GB_POS=[];for(let i=0;i<GB_SW.length;i++){const b=GB_SW[i];const v=swarmVis(t,i);if(v<=0.01)continue;const w=t*b.sp+b.ph;
  const p=V.add(b.p,[Math.sin(w)*0.35,Math.cos(w*0.8)*0.3,Math.sin(w*0.6)*0.2]);const[mesh,col]=GB_TYPES[b.ty];
  const M=M4.trs(p,b.yaw+w*0.4,b.pit+Math.sin(w)*0.2,Math.sin(w*1.3)*0.25,b.s*v);items.push({mesh,M,tint:HC(col),tintAmt:0.85});GB_POS.push({p,col,v,s:b.s})}}
let EARTHS=[],GBOBJ={};
const GBSP=0.35;
function gbEarth(items,ang,dead){const M=M4.trs([0,0,0],ang,0,0.2,1);items.push({mesh:SPE,M});if(dead>0)items.push({mesh:GB_DEAD,M,alpha:dead});
  items.push({mesh:SPCLOUD,M:M4.trs([0,0,0],ang*1.15,0,0.2,1),alpha:0.78*(1-dead*0.5),noShadow:true});EARTHS.push({p:[0,0,0],s:1,a:1-dead*0.4})}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];GBOBJ={};GB_POS=[];
  if(S==='hook'||S==='day'||S==='end')swarmItems(items,t);
  if(S==='idea'||S==='r5')gbEarth(items,t*GBSP,0);
  if(S==='never')gbEarth(items,t*GBSP,ease(seg(t,EV.morph,EV.morph+2.4)));
  if(S==='idea'){const k=seg(t,EV.idea+4.2,EV.idea+4.5);if(k>0)qItems(items,t,cm,{x:0.6,y:-0.5,s:0.15,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='never'){const k=seg(t,EV.morph+3.2,EV.morph+3.5);if(k>0)qItems(items,t,cm,{x:-0.6,y:-0.5,s:0.15,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='r1'||S==='r3'||S==='r4')items.push({mesh:SPTOWN,M:ID4});
  if(S==='r1'){for(const it of jumperItems([0,0,5.2],0.15,0,seg(t,EV.r1+1.0,EV.r1+1.4)*0.9+0.08,0,1))items.push(it)}
  if(S==='r4'){const k=t-EV.r4;const chew=Math.sin(k*9)*0.015*(k<1.0?1:0);items.push({mesh:GB_COW,M:M4.trs([0,chew,6.5],-0.55,0,0,1)});
    const kq=seg(t,EV.r4+4.0,EV.r4+4.3);if(kq>0)qItems(items,t,cm,{x:0.62,y:-0.05,s:0.12,d:3,pop:easeOut(kq),expr:'wide'})}
  if(S==='r2'){items.push({mesh:SPCOAST,M:ID4});items.push({mesh:SPWATER,M:ID4})}
  return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  const town=S==='r1'||S==='r3'||S==='r4';const mic=S==='hook'||S==='day'||S==='end';
  if(!town&&S!=='r2'&&!mic)items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const shc=town?{center:[0,0,6],radius:30}:S==='r2'?{center:[60,0,-60],radius:220}:{center:[0,-9999,0],radius:1};
  if(town||S==='r2'){env.ground=1;env.gndCol=S==='r2'?hx('#1d5b92'):hx('#4f7d3c')}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:S==='r2'?1:town?0.05:mic?0.1:0.02,far:S==='r2'?4000:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.gone,16,0.7);S(EV.r1+1.0,8,0.5);S(EV.r2+1.2,8,0.5);S(EV.r3+1.0,8,0.5);S(EV.r4+1.0,8,0.5);S(EV.back,14,0.8);S(EV.morph,6,0.6);
  for(let i=0;i<3;i++)S(EV.r5+1.5+i*0.7,4,0.25);return a}
