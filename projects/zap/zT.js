// ================= ELECTRICITY DISAPPEARS 5s: meshes + timeline =================
// city lights split into two halves (patchy restart), night side only (SLS = sun dir, Earth-local)
function zLights(seed,part){return um(m=>{const r=rngG(77);let k=0;for(let i=0;i<140000&&k<11000;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const n=[s*Math.cos(a),u,s*Math.sin(a)];
  const rr=r(),sz=r(),cc=r();if(sLand(n)<0.512||Math.abs(n[1])>0.72)continue;if(fbm(n[0]*7+2,n[2]*7+n[1]*3,3)<0.4)continue;if(V.dot(n,SLS)>-0.02)continue;k++;
  const half=hsh(Math.floor(n[0]*9+20)*31+Math.floor(n[2]*9+20),Math.floor(n[1]*9+20))<0.5?0:1;if(half!==part)continue;
  const p=V.sc(n,1.004);const col=mix3([1,0.62,0.22],[1,0.9,0.6],cc);m.ico(p,0.0024+sz*0.0038,col,MAT.emis,1,[2,4])}})}
const ZL1=zLights(77,0),ZL2=zLights(77,1);
// phone
const ZP_BODY=um(m=>{m.box([0,0,0],[0.8,1.62,0.085],HC('#15182a'),MAT.glass);m.box([0,0,-0.046],[0.76,1.58,0.01],HC('#2a2f4a'),MAT.plain);
  m.box([0.2,0.62,-0.055],[0.24,0.24,0.02],HC('#0a0c16'),MAT.glass);for(const y of[0.3,0.12])m.box([0.405,y,0],[0.012,0.12,0.03],HC('#3a3f5a'),MAT.plain)},0.2);
const ZP_SCR=um(m=>m.box([0,0,0.044],[0.74,1.54,0.004],[1,1,1],MAT.emis));
// ================= timeline =================
const EV={off:1.25,idea:3.5,vanish:9.0,r1:9.6,r2:17.0,r3:24.0,r4:31.0,r5:37.4,back:41.0,never:43.6,day:51.6,endc:58.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.never)return'r5';if(t<EV.day)return'never';if(t<EV.endc)return'day';return'end'}
// flicker-off: 1 before t0, stutters, 0 after t0+0.45
function zFlick(t,t0){const k=t-t0;if(k<0)return 1;if(k>0.45)return 0;const st=[1,0.15,0.85,0.05,0.6,0,0.25,0][Math.floor(k/0.45*8)];return st}
function zFlickOn(t,t0,lv){const k=t-t0;if(k<0)return 0;if(k>0.6)return lv;return lv*[0,0.6,0.1,0.9,0.3,1,0.5,1][Math.floor(k/0.6*8)]}
function lightsA(t){const S=scn(t);
  if(S==='hook')return[zFlick(t,EV.off),zFlick(t,EV.off)];
  if(S==='idea'){const a=Math.min(zFlickOn(t,EV.idea,1)+0,1)*zFlick(t,EV.vanish);return[a,a]}
  if(S==='r2'){const a=zFlick(t,EV.r2+1.6);return[a,zFlick(t,EV.r2+1.9)]}
  if(S==='r5')return[zFlickOn(t,EV.back+0.9,0.55)*(t>EV.back+2.2?1:1),0];
  if(S==='end')return[1,1];return[0,0]}
// electricity on? (for heart/ECG)
function powerOn(t){if(t<EV.vanish)return t<EV.off||t>=EV.idea;if(t<EV.back)return false;if(t<EV.never)return true;if(t<EV.day)return false;return true}
function envSpace(){return{sun:SLS,sunCol:V.sc(hx('#fff1e0'),1.3),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.07,0.09,0.15]}}
function envAt(t){const S=scn(t);if(S==='r1'||S==='day')return envDay({sun:V.norm([-0.35,0.75,0.55]),fogD:320,fog:hx('#cfe0f0')});
  const e=envSpace();if(S==='r4'){e.sun=V.norm([0.4,0.6,0.8]);e.fillC=[0.12,0.14,0.22];e.sunCol=V.sc(hx('#e8f0ff'),1.0)}return e}
// night-side camera: looks at Earth from the dark side, a thin day crescent at the limb
const ZN=V.norm([-0.85,0.45,0.22]);const ZUP=[0,1,0];const ZR=V.norm(V.cross(ZN,ZUP));
function eCam(d,ox,oy,tx,ty){const dir=V.norm(V.add(V.add(ZN,V.sc(ZR,ox)),V.sc(ZUP,oy)));const at=V.add(V.sc(ZR,tx||0),V.sc(ZUP,ty||0));return{eye:V.add(V.sc(dir,d),at),at}}
function camAt(t){const S=scn(t);let c={eye:[0,0.35,4.4],at:[0,0,0]},fov=0.9;
  if(S==='hook'){const k=ease(seg(t,0,3.5));c=eCam(lerp(3.15,2.9,k),lerp(-0.08,0.02,k),0.12)}
  if(S==='idea'){const k=ease(seg(t,EV.idea,EV.r1));c=eCam(lerp(3.6,3.0,k),lerp(0.25,0.05,k),lerp(0.25,0.1,k))}
  if(S==='r1'||S==='day'){const k=ease(seg(t,S==='r1'?EV.r1:EV.day,S==='r1'?EV.r2:EV.endc));const sw=S==='day'?-1:1;c={eye:[lerp(1.4,0.6,k)*sw,lerp(1.45,1.2,k),lerp(11.8,10.8,k)],at:[0,1.0,5.2]};fov=0.8}
  if(S==='r2'){const k=seg(t,EV.r2,EV.r3);c=eCam(lerp(2.0,1.8,k),lerp(-0.12,0.02,k),lerp(0.05,-0.02,k));fov=0.85}
  if(S==='r3'){const k=seg(t,EV.r3,EV.r4);c=eCam(lerp(2.3,2.1,k),lerp(-1.05,-0.95,k),-0.1,0,0);fov=0.85}
  if(S==='r4'){const k=ease(seg(t,EV.r4,EV.r5));c={eye:[lerp(0.55,-0.3,k),lerp(0.1,0.0,k),lerp(3.75,3.3,k)],at:[0,-0.05,0]};fov=0.9}
  if(S==='r5'){const k=seg(t,EV.r5,EV.never);c=eCam(lerp(3.7,3.2,k),lerp(-0.1,0.1,k),0.1)}
  if(S==='never'){const k=ease(seg(t,EV.never,EV.day));c=eCam(lerp(3.0,4.2,k),lerp(0.1,0.3,k),lerp(0.1,0.3,k))}
  if(S==='end'){const k=ease(seg(t,EV.endc,EV.loop));c=eCam(lerp(3.5,3.15,k),lerp(0.1,-0.08,k),0.12)}
  return{eye:c.eye,at:c.at,fov}}
let EARTHS=[];
function zEarth(items,t){const la=lightsA(t);const M=M4.trs([0,0,0],0,0,0,1);items.push({mesh:SEARTH,M});
  if(la[0]>0.01)items.push({mesh:ZL1,M,alpha:0.97*la[0],add:1,noShadow:true});if(la[1]>0.01)items.push({mesh:ZL2,M,alpha:0.97*la[1],add:1,noShadow:true});
  EARTHS.push({p:[0,0,0],s:1,a:1})}
// person: collapse (r1) / get up (day)
function zPose(t){const S=scn(t);if(S==='r1'){const k=t-EV.r1-3.8;if(k<0)return{tilt:0,c:0,arm:0.06};const f=easeIn(clamp(k/0.55,0,1));const b=k>0.55&&k<0.85?Math.sin((k-0.55)/0.3*Math.PI)*0.06:0;return{tilt:-f*1.42+b,c:f*0.25,arm:0.06+f*0.2}}
  if(S==='day'){const k=t-EV.day-0.4;const f=1-ease(clamp(k/0.9,0,1));const w=k>1.2?Math.max(0,Math.sin((k-1.2)*5))*0.35:0;return{tilt:-f*1.42,c:f*0.25,arm:0.06+f*0.2+w+(k>1.2?0.55:0)*seg(k,1.2,1.5)}}return{tilt:0,c:0,arm:0.06}}
function phoneItems(items,t,cm){const k=t-EV.r4;const M=M4.trs([0,-0.08,0],Math.sin(k*0.7)*0.28-0.1,0.08+Math.sin(k*0.5)*0.05,0.06,0.75);items.push({mesh:ZP_BODY,M});
  const on=t<EV.r4+3.0?1:0;const fl=t<EV.r4+3.0?1:zFlick(t,EV.r4+3.0);const col=on?[0.25,0.55,1.0]:[0.02,0.02,0.03];items.push({mesh:ZP_SCR,M,tint:fl>0.5?[0.35,0.6,1.0]:[0.015,0.015,0.02],tintAmt:1});ZPM=M}
let ZPM=null;
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];ZPM=null;
  if(S==='hook'||S==='idea'||S==='r2'||S==='r3'||S==='r5'||S==='never'||S==='end')zEarth(items,t);
  if(S==='r1'||S==='day'){items.push({mesh:SPTOWN,M:ID4});const P=zPose(t);for(const it of jumperItems([0,0,5.2],0.15,P.c,P.arm,P.tilt,1))items.push(it)}
  if(S==='r4'){phoneItems(items,t,cm);const k=seg(t,EV.r4+3.4,EV.r4+3.7);if(k>0)qItems(items,t,cm,{x:0.6,y:-0.66,s:0.14,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='never'){const k=seg(t,EV.never+4.0,EV.never+4.3);if(k>0)qItems(items,t,cm,{x:-0.6,y:-0.05,s:0.07,d:1.5,pop:easeOut(k),expr:'wide'})}
  if(S==='idea'){const k=seg(t,EV.idea+3.0,EV.idea+3.3);if(k>0&&t<EV.vanish)qItems(items,t,cm,{x:0.62,y:-0.52,s:0.07,d:1.5,pop:easeOut(k),expr:'wide'})}
  return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  const town=S==='r1'||S==='day';if(!town)items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const shc=town?{center:[0,0,6],radius:30}:{center:[0,-9999,0],radius:1};
  if(town){env.ground=1;env.gndCol=hx('#4f7d3c')}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:town?0.05:0.02,far:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.off,14,0.6);S(EV.vanish,12,0.6);S(EV.r1+4.35,10,0.5);S(EV.r2+1.6,6,0.5);S(EV.r4+3.0,6,0.4);S(EV.back,14,0.8);S(EV.never,8,0.6);
  for(const b of ZBOLTS)if(b<EV.r3+4.6)S(b,3,0.2);return a}
// lightning flash times in r3 (until cancelled)
const ZBOLTS=[];{let x=EV.r3+0.15;let i=0;while(x<EV.r3+4.5){ZBOLTS.push(x);x+=0.18+hsh(i,91)*0.32;i++}}
