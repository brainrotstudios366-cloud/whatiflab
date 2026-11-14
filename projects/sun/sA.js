// ================= SUN VANISHES: timeline / camera / items =================
const EV={gone:1.3,idea:3.2,race:8.6,grav:15.4,later:21.4,r1:23.4,r2:28.0,r3:32.6,r4:37.2,r5:41.8,back:45.2,wave:47.4,prox:57.0,endc:61.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.race)return'idea';if(t<EV.grav)return'race';if(t<EV.later)return'grav';if(t<EV.r1)return'later';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.wave)return'r5';if(t<EV.prox)return'wave';if(t<EV.endc)return'prox';return'end'}
// how dark Earth is (0 = sunlit, 1 = Sun gone)
function darkAt(t){if(t<EV.r1)return 0;if(t<EV.back)return seg(t,EV.r1,EV.r1+0.12);return 1-seg(t,EV.back,EV.back+0.35)}
const SUNCOL=V.sc(hx('#fff1e0'),1.25);
function envBase(){return{sun:SLS,sunCol:SUNCOL,sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.035,0.04,0.07]}}
function yawFor(dir){return Math.atan2(SLS[2],SLS[0])-Math.atan2(dir[2],dir[0])}
function rotY(v,a){const c=Math.cos(a),s=Math.sin(a);return[c*v[0]+s*v[2],v[1],-s*v[0]+c*v[2]]}
// orbit view
const ORB=5.0;function orbTh(t){return 0.95+t*0.025}
function orbPos(t){const th=orbTh(Math.min(t,EV.r3));let p=[Math.cos(th)*ORB,0,Math.sin(th)*ORB];if(t>EV.r3){const tg=[-Math.sin(th),0,Math.cos(th)];p=V.add(p,V.sc(tg,(t-EV.r3)*0.025*ORB))}return p}
// solar-system wave
const AU2R=au=>2.2*Math.log2(1+au);
const PL=[['EARTH',1.0,'#5af0ff'],['MARS',1.524,'#ff8a5a'],['JUPITER',5.2,'#ffd84a'],['SATURN',9.54,'#ffe6a8'],['NEPTUNE',30.07,'#7fb2ff'],['VOYAGER 1',173,'#7dff9a']];
const PLANG=[0.35,2.4,4.1,1.3,5.3,0.9];
const WKEY=[[EV.wave,0.05],[EV.wave+0.6,1.0],[EV.wave+1.9,1.524],[EV.wave+3.3,5.2],[EV.wave+4.6,9.54],[EV.wave+6.1,30.07],[EV.wave+8.0,173],[EV.prox,320]];
function waveAU(t){if(t<=WKEY[0][0])return WKEY[0][1];for(let i=1;i<WKEY.length;i++){if(t<=WKEY[i][0]){const k=(t-WKEY[i-1][0])/(WKEY[i][0]-WKEY[i-1][0]);const a=AU2R(WKEY[i-1][1]),b=AU2R(WKEY[i][1]);const R=lerp(a,b,k);return Math.pow(2,R/2.2)-1}}return WKEY[WKEY.length-1][1]}
function plPos(i){const R=AU2R(PL[i][1]);return[Math.cos(PLANG[i])*R,0,Math.sin(PLANG[i])*R]}
function envAt(t){const S=scn(t);const e=envBase();const dk=darkAt(t);
  if(S==='grav'||S==='r3'){const ep=orbPos(t);const d=V.norm(V.sub([0,0,0],ep));e.sun=rotY(SLS,-0)/*placeholder*/;const y=yawFor(d);e.sun=rotY(SLS,y)}
  if(S==='race'){const a=Math.PI/2-0.22,c=Math.cos(a),q=Math.sin(a);e.sun=V.norm([c*SLS[0]-q*SLS[1],q*SLS[0]+c*SLS[1],SLS[2]])}
  if(S==='r2'){e.ground=1;e.gndCol=hx('#06070c');e.zen=hx('#02030b');e.hor=hx('#0d1236');e.stars=1.2;e.sky=[0.2,0.23,0.4];e.gnd=[0.06,0.06,0.09];e.fillC=[0.32,0.36,0.6];e.fillD=[-0.4,0.8,0.6];e.fog=hx('#0a0e2a');e.fogD=55;e.neb=0.7;e.sunCol=[0,0,0]}
  if(S==='wave'||S==='prox'){e.sun=V.norm([0.2,1,0.9])}
  if(S==='hook'||S==='end'){e.stars=0.7}
  if(S!=='r2')e.sunCol=V.sc(SUNCOL,1-dk);
  if(S==='r3'||S==='r4')e.sunCol=[0,0,0];
  return e}
function camAt(t){const S=scn(t);let eye=[0,0,4],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;eye=[0.15*Math.sin(tt*0.4),0.12,lerp(4.6,4.2,ease(tt/3))];at=[0,0,0];fov=0.9}
  if(S==='idea'||S==='later'||S==='r1'||S==='r5'){const tt=t;const a=0.25+0.03*tt;eye=[Math.sin(a)*4.3,0.6+0.1*Math.sin(tt*0.2),Math.cos(a)*4.3];at=[0.05,-0.15,0];fov=0.9;
    if(S==='idea'){const k=ease(seg(t,EV.idea,EV.idea+1.2));eye=V.sc(eye,lerp(1.5,1,k))}
    if(S==='r1'){const k=ease(seg(t,EV.r1,EV.r2));eye=V.sc(eye,lerp(1.0,0.9,k))}}
  if(S==='race'){const k=ease(seg(t,EV.race,EV.grav));eye=[lerp(1.5,-1.0,k),lerp(0.5,0.0,k),lerp(16.5,15.5,k)];at=[0,0.7,0];fov=0.95}
  if(S==='grav'||S==='r3'){const ep=orbPos(t);const k=S==='grav'?ease(seg(t,EV.grav,EV.later)):1;const base=[0,8.5,10.5];eye=lerp3(base,V.add(ep,[0.9,2.4,3.4]),S==='r3'?ease(seg(t,EV.r3,EV.r3+1.2))*0.6:k*0.15);at=V.add(lerp3([0,0,1.2],ep,S==='r3'?0.6:0.25),[0,S==='r3'?-1.3:-2.8,0]);fov=0.9}
  if(S==='r2'){const k=seg(t,EV.r2,EV.r3);eye=[lerp(3.2,1.8,k),lerp(2.3,1.9,k),lerp(6.5,4.5,k)];at=[-0.5,1.2,-8];fov=0.95}
  if(S==='r4'){const k=seg(t,EV.r4,EV.r5);eye=[lerp(-0.4,0.3,k),0.9,4.4];at=[0.2,0.75,0];fov=0.9}
  if(S==='wave'){const au=waveAU(t);const R=AU2R(au);const d=clamp(R*3.4+6,9,66);eye=[d*0.1,d*0.78,d*0.62];at=[0,0,-d*0.04];fov=0.9}
  if(S==='prox'){eye=[0,0,0.01];at=[0,0,-1];fov=0.9}
  return{eye,at,fov}}
function sBB(p,s,cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);const z=V.sc(f,-1);return[r[0]*s,r[1]*s,r[2]*s,0,u[0]*s,u[1]*s,u[2]*s,0,z[0]*s,z[1]*s,z[2]*s,0,p[0],p[1],p[2],1]}
let LEDP=[],EARTHS=[],SUNP=null,MOONP=null;
function earthItems(items,p,s,yaw,dk,spin,rz){const M=M4.trs(p,yaw+(spin||0),0,rz||0,s);items.push({mesh:SEARTH,M});
    items.push({mesh:SLIGHTSN,M,alpha:0.95,add:1,noShadow:true});if(dk>0)items.push({mesh:SLIGHTSD,M,alpha:0.98*dk,add:1,noShadow:true});EARTHS.push({p,s,dk})}
function sunItems(items,p,s,t){if(s<=0.001)return;items.push({mesh:SSUNS,M:M4.trs(p,t*0.05,0.2,0,s),noShadow:true});SUNP={p,s}}
function sunScaleHook(tt){if(tt<EV.gone)return 1;const k=(tt-EV.gone)/0.28;return k>=1?0:(1+0.12*Math.sin(k*Math.PI))*(1-easeIn(k))}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];LEDP=[];SUNP=null;MOONP=null;const dk=darkAt(t);
  if(S==='hook')sunItems(items,[0,0,0],sunScaleHook(t),t);
  if(S==='end')sunItems(items,[0,0,0],1,t-EV.endc);
  if(S==='idea'||S==='later'||S==='r1'||S==='r5')earthItems(items,[0,0,0],1,0,dk,t*0.012);
  if(S==='race')earthItems(items,[0,-5.4,0],1.7,0,0,0,Math.PI/2-0.22);
  if(S==='grav'||S==='r3'){const ep=orbPos(t);earthItems(items,ep,0.62,yawFor(V.norm(V.sub([0,0,0],ep))),S==='r3'?1:0,t*0.02);
    if(S==='grav'){const k=seg(t,EV.grav+2.6,EV.grav+3.0);if(k>0)qItems(items,t,cm,{x:-0.6,y:-0.62,s:0.15,d:3,pop:easeOut(k),expr:'wide'})}}
  if(S==='r4'){earthItems(items,[0,-1.25,0],1,0.5,1,t*0.012);const mp=[1.25,2.15,-3.2];MOONP=mp;const off=seg(t,EV.r4+1.4,EV.r4+1.7);
    items.push({mesh:SMOONE,M:sBB(mp,0.42,cm),tint:[0.015,0.015,0.025],tintAmt:off*0.88,noShadow:true})}
  if(S==='r5'&&t>EV.back-0.01){}
  if(S==='r2'){items.push({mesh:SGROUNDM,M:M4.trs([0,0,0],0,0,0,1)});const off=seg(t,EV.r2+2.6,EV.r2+3.4);
    for(let r=0;r<8;r++)for(let c=-4;c<=4;c++){const x=c*2.05,z=-1.5-r*3.1;const p=[x,1.05,z];items.push({mesh:SPANEL,M:M4.trs(p,0,0.5,0,1)});items.push({mesh:SPLEGS,M:M4.trs([x,1.05,z],0,0,0,[1,1.15,1])});
      const led=mix3([0.3,1,0.5],[1,0.15,0.2],clamp(off*1.6-hsh(r,c+9)*0.6,0,1));items.push({mesh:SLED,M:M4.trs([x+0.6,0.55,z+0.05],0,0,0,0.07),tint:led,tintAmt:1,noShadow:true});if(r<4)LEDP.push([[x+0.6,0.55,z+0.05],led])}}
  if(S==='wave'){sunItems(items,[0,0,0],0.55,t);for(let i=0;i<5;i++){const p=plPos(i);const sc=[0.3,0.24,0.55,0.48,0.42][i];const mesh=[SEARTH,SMARS,SJUP,SSAT,SNEPM][i];items.push({mesh,M:M4.trs(p,t*0.3,0.3,0,sc)});
      if(i===3)items.push({mesh:SSATRING,M:M4.trs(p,0,0.35,0.1,sc),alpha:0.8,noShadow:true})}
    const vp=plPos(5);items.push({mesh:SPROBE,M:M4.trs(vp,t*0.4,0.3,0.2,0.55)})}
  return items}
