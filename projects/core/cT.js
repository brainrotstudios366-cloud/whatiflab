// ================= EARTH'S CORE DISAPPEARS 5s: meshes + timeline =================
const CR=0.546,CRI=0.19; // core radius (3480/6371), inner core (1220/6371)
const CE_SKIP=c=>c[0]>0&&c[2]>0;
function ceLayer(r){if(r>0.975)return mix3(HC('#5a4a3c'),HC('#8a7864'),(r-0.975)/0.025);
  if(r>0.86)return mix3(HC('#b0441f'),HC('#d86a34'),(r-0.86)/0.115);
  if(r>CR)return mix3(HC('#ff6a1e'),HC('#a82a18'),Math.pow((r-CR)/(0.86-CR),0.8));
  if(r>CRI)return mix3(HC('#fff0a0'),HC('#ffae2a'),Math.pow((r-CRI)/(CR-CRI),0.7));return mix3(HC('#ffffff'),HC('#fff3b8'),r/CRI)}
function ceWedge(m,r0,r1,NR,NT,bright){for(const face of[0,1]){for(let i=0;i<NR;i++)for(let j=0;j<NT;j++){const a=r0+(r1-r0)*i/NR,b=r0+(r1-r0)*(i+1)/NR,a0=j/NT*Math.PI-Math.PI/2,a1=(j+1)/NT*Math.PI-Math.PI/2;
  const P=(r,q)=>face===0?[0,Math.sin(q)*r,Math.cos(q)*r]:[Math.cos(q)*r,Math.sin(q)*r,0];const mid=(a+b)/2;
  const q=(a0+a1)/2;const n=fbm(mid*14+face*5,q*6+3,3);const col=V.sc(ceLayer(mid),(bright||1)*(0.82+n*0.36));m.quad(P(a,a0),P(b,a0),P(b,a1),P(a,a1),col,MAT.emis)}}}
const CE_SHELL=um(m=>sph(m,1,128,256,spEarthCol,0,CE_SKIP),0.3);
const CE_MANT=um(m=>ceWedge(m,CR,1,40,72,0.95));
const CE_CORE=um(m=>{ceWedge(m,0,CR,22,72,1.15);sph(m,CR*0.999,40,80,n=>V.sc(ceLayer(CR*0.98),1.1),MAT.emis,c=>!(c[0]>0&&c[2]>0))});
const CE_CAV=um(m=>sph(m,CR,48,96,n=>{const v=fbm(n[0]*6+2,n[1]*6+n[2]*3,4);return mix3(HC('#14081f'),HC('#3a1440'),v)},MAT.emis,CE_SKIP));
const CE_ROCK=um(m=>blob(m,[0,0,0],1,p=>mix3(HC('#7a2a18'),HC('#ff7a2a'),clamp(p[1]*0.5+0.5,0,1)),5,0.8,[6,9],MAT.emis),0.4);
// ================= timeline =================
const EV={gone:1.25,idea:3.5,vanish:9.0,r1:9.6,r2:17.0,r3:24.0,r4:31.0,r5:37.4,back:41.0,never:43.6,morph:47.6,day:51.6,endc:58.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.never)return'r5';if(t<EV.day)return'never';if(t<EV.endc)return'day';return'end'}
// core visibility 0..1
function coreVis(t){const S=scn(t);
  if(S==='hook')return 1-easeIn(seg(t,EV.gone,EV.gone+0.22));
  if(S==='idea')return 1-easeIn(seg(t,EV.vanish,EV.vanish+0.22));
  if(S==='r5')return easeOut(seg(t,EV.back,EV.back+0.3));
  if(S==='day'||S==='end')return 1;return 0}
function envSpace(){return{sun:V.norm([0.35,0.55,0.75]),sunCol:V.sc(hx('#fff1e0'),1.25),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.05,0.06,0.1]}}
function envAt(t){const S=scn(t);if(S==='r1')return envDay({sun:V.norm([-0.35,0.75,0.55]),fogD:320,fog:hx('#cfe0f0')});
  const e=envSpace();if(S==='r2'||S==='r3')e.sun=V.norm([0.85,0.32,0.55]);return e}
const CE_DIR=V.norm([1,0.42,1]);
function cutCam(d,yo,sw){return V.add(V.sc(V.norm([CE_DIR[0]+sw,CE_DIR[1]+yo,CE_DIR[2]-sw]),d),[0,0,0])}
function camAt(t){const S=scn(t);let eye=[0,0.35,4.4],at=[0,0,0],fov=0.9;
  if(S==='hook'){const k=ease(seg(t,0,3.5));eye=cutCam(lerp(3.3,3.6,k),0,lerp(-0.05,0.08,k));at=[0,lerp(0.05,0.12,k),0]}
  if(S==='idea'){const k=ease(seg(t,EV.idea,EV.r1));eye=cutCam(lerp(4.2,3.8,k),0.05,lerp(0.25,0.05,k));at=[0,0.15,0]}
  if(S==='r1'){const k=ease(seg(t,EV.r1,EV.r2));eye=[lerp(1.2,0.5,k),lerp(1.5,1.35,k),lerp(12.4,11.4,k)];at=[0,1.25,5.2];fov=0.85}
  if(S==='r2'){const k=seg(t,EV.r2,EV.r3);eye=[lerp(0.4,-0.4,k),0.25,lerp(5.6,5.1,k)];at=[0,0.15,0]}
  if(S==='r3'){const k=seg(t,EV.r3,EV.r4);eye=[lerp(0.6,-0.3,k),0.5,lerp(10.6,10.0,k)];at=[0,0.45,0]}
  if(S==='r4'){const k=ease(seg(t,EV.r4,EV.r5));eye=cutCam(lerp(3.3,2.8,k),0.02,lerp(0.05,-0.05,k));at=[0,lerp(0.05,0.0,k),0]}
  if(S==='r5'){const k=seg(t,EV.r5,EV.never);eye=cutCam(lerp(3.8,4.1,k),0.06,lerp(-0.1,0.1,k));at=[0,0.12,0]}
  if(S==='never'){const k=ease(seg(t,EV.never,EV.day));eye=cutCam(lerp(4.1,4.6,k),lerp(0.05,0.25,k),lerp(0.15,0.4,k));at=[0,0.15,0]}
  if(S==='day'){const k=ease(seg(t,EV.day,EV.endc));eye=cutCam(lerp(4.0,3.7,k),0.05,lerp(-0.25,-0.05,k));at=[0,0.18,0]}
  if(S==='end'){const k=ease(seg(t,EV.endc,EV.loop));eye=cutCam(lerp(3.7,3.3,k),0,lerp(-0.05,-0.05,k));at=[0,lerp(0.12,0.05,k),0]}
  return{eye,at,fov}}
let EARTHS=[],CEOBJ={};
function cutEarth(items,t,o){o=o||{};const cv=o.cv==null?coreVis(t):o.cv;const s=o.s||1;const M=M4.trs([0,0,0],0,0,0,s);
  items.push({mesh:CE_SHELL,M});items.push({mesh:CE_MANT,M});
  if(cv<0.999)items.push({mesh:CE_CAV,M:M4.trs([0,0,0],0,0,0,s*(o.cav||1))});
  if(cv>0.001)items.push({mesh:CE_CORE,M:M4.trs([0,0,0],0,0,0,s*cv)});
  EARTHS.push({p:[0,0,0],s:s,a:1})}
// falling rock chunks into the hole (r4 + never)
function rockItems(items,t,t0,n,spd){for(let i=0;i<n;i++){const st=t0+hsh(i,71)*2.2;const k=(t-st)*(spd||1);if(k<0)continue;const kk=k%1.4;
  const a=hsh(i,72)*Math.PI*0.5,el=(hsh(i,73)-0.5)*2.4;const dir=V.norm([Math.cos(a)*Math.cos(el)*0.9,Math.sin(el),Math.sin(a)*Math.cos(el)*0.9]);
  const pos=CR*(1-0.5*kk*kk*0.9);if(pos<0.05)continue;
  items.push({mesh:CE_ROCK,M:M4.trs(V.sc(dir,pos),kk*4+i,kk*3,0,0.018+hsh(i,74)*0.03)})}}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];CEOBJ={};
  if(S==='hook'||S==='idea'||S==='r4'||S==='r5'||S==='day'||S==='end')cutEarth(items,t);
  if(S==='never'){const mk=ease(seg(t,EV.morph,EV.morph+0.6));
    if(mk<1)cutEarth(items,t,{cv:0,cav:lerp(1,0.2,easeIn(seg(t,EV.never+1.4,EV.morph)))});
    if(mk>0){const s=lerp(1,0.945,ease(seg(t,EV.morph,EV.morph+1.5)));const M=M4.trs([0,0,0],t*0.08,0,0.2,s);items.push({mesh:F_LAVA,M,alpha:mk});items.push({mesh:F_LAVAG,M:M4.trs([0,0,0],t*0.08,0,0.2,s*1.002),alpha:mk,add:true,noShadow:true});EARTHS.length=0}
    if(t>EV.never+1.0&&t<EV.morph)rockItems(items,t,EV.never+1.0,40,1.6)}
  if(S==='r4'&&t>EV.r4+4.4)rockItems(items,t,EV.r4+4.4,26,1);
  if(S==='r2'){items.push({mesh:SPE,M:M4.trs([0,0,0],t*0.25,0,0.2,1)});items.push({mesh:SPCLOUD,M:M4.trs([0,0,0],t*0.29,0,0.2,1)});EARTHS.push({p:[0,0,0],s:1,a:1})}
  if(S==='r3'){items.push({mesh:SPE,M:M4.trs(CE_EP,t*0.25,0,0.2,CE_ER)});items.push({mesh:SPCLOUD,M:M4.trs(CE_EP,t*0.29,0,0.2,CE_ER)});EARTHS.push({p:CE_EP,s:CE_ER,a:1});
    items.push({mesh:SMOONM,M:M4.trs(CE_MP,t*0.1,0,0,CE_MR)})}
  if(S==='idea'){const k=seg(t,EV.idea+3.0,EV.idea+3.3);if(k>0&&t<EV.vanish)qItems(items,t,cm,{x:0.62,y:-0.52,s:0.14,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='r4'){const k=seg(t,EV.r4+3.4,EV.r4+3.7);if(k>0)qItems(items,t,cm,{x:-0.5,y:-0.42,s:0.14,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='r1'){items.push({mesh:SPTOWN,M:ID4});const J=jumpAt(t);for(const it of jumperItems([0,J.y,5.2],0.15,J.c,J.arm,0,1))items.push(it)}
  return items}
const CE_EP=[0,-1.55,0],CE_ER=1.25,CE_MP=[0.9,2.75,-1.2],CE_MR=0.34;
// jumper: crouch -> jump loop (lower gravity = higher, floatier)
const CE_JH=0.74; // jump height in reduced gravity (0.5 m normal / 0.675)
function jumpAt(t){const k=t-EV.r1;if(k<0.9)return{y:0,c:0,arm:0.08};const P=1.75;const ph=((k-0.9)%P)/P;
  if(ph<0.22){const c=Math.sin(ph/0.22*Math.PI);return{y:0,c:c*0.8,arm:0.08+c*0.05}}
  const q=(ph-0.22)/0.78;const h=4*q*(1-q);return{y:h*CE_JH,c:0,arm:0.08+h*0.85}}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  const town=S==='r1';if(!town)items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const shc=town?{center:[0,0,6],radius:30}:{center:[0,-9999,0],radius:1};
  if(town){env.ground=1;env.gndCol=hx('#4f7d3c')}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:town?0.05:0.02,far:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.gone,16,0.7);S(EV.vanish,12,0.6);S(EV.r1+0.9,8,0.5);S(EV.r2+1.2,6,0.5);S(EV.r3+1.0,5,0.4);S(EV.r4+4.4,10,1.5);S(EV.back,18,1.2);S(EV.morph,18,1.0);
  for(let i=0;i<3;i++)S(EV.r5+1.5+i*0.7,4,0.25);if(t>EV.never+1.0&&t<EV.morph)a+=3;return a}
