// ================= NO EMPTY SPACE: meshes =================
const WSP=2.2;
// nucleus: packed protons (pink) + neutrons (cyan-grey), slightly emissive
const VNUC=um(m=>{const r=rngG(77);const pts=[];for(let i=0;i<26;i++){let p;for(let tries=0;tries<60;tries++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const d=Math.pow(r(),0.33)*0.62;p=[s*Math.cos(a)*d,u*d,s*Math.sin(a)*d];if(pts.every(q=>V.len(V.sub(p,q))>0.3))break}pts.push(p)}
  pts.forEach((p,i)=>{const pr=i%2===0;m.ico(p,0.24,pr?HC('#ff4f7e'):HC('#7fb8d8'),MAT.emis*0+0,1,[10,14])})},0.5);
const VNUCG=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[12,18]),0.6);
const VELEC=um(m=>m.ico([0,0,0],1,HC('#8ff6ff'),MAT.emis,1,[8,12]),0.6);
// sugar cube: slightly rough white cube built of grains
const VCUBE=um(m=>{const r=rngG(9);m.box([0,0.5,0],[1,1,1],[0.93,0.94,0.97],0,0,[1,1,1]);for(let i=0;i<2600;i++){const f=Math.floor(r()*5);const u=r()-0.5,v=r()-0.5;let p;
  if(f===0)p=[u,1.0,v];else if(f===1)p=[0.5,0.5+v,u];else if(f===2)p=[-0.5,0.5+v,u];else if(f===3)p=[u,0.5+v,0.5];else p=[u,0.5+v,-0.5];const g=0.012+r()*0.018;m.box(p,[g,g,g],mix3([0.85,0.87,0.92],[1,1,1],r()))}},0);
const VTABLE=um(m=>{m.box([0,-0.08,0],[14,0.16,7],HC('#2c3140'),0,0,HC('#3d4456'));for(let i=-6;i<=6;i++)m.box([i,0.005,0],[0.02,0.01,7],HC('#4a5570'));for(let j=-3;j<=3;j++)m.box([0,0.005,j],[14,0.01,0.02],HC('#4a5570'))},0);
const VLAB=um(m=>{for(let i=-4;i<=4;i++){m.box([i*3,4,-6],[2.6,8,0.3],HC('#141a30'),0,0,HC('#1d2645'));m.box([i*3,4,-5.84],[2.2,0.08,0.02],HC('#5af0ff'),MAT.emis)}},0);
// crowd field (many people) for "all of humanity"
const VCROWD=um(m=>{ground(m,-120,-120,120,60,null,0,10,(x,z)=>mix3(C.grass,C.grass2,fbm(x*0.05,z*0.05,3)));people(m,-60,-70,60,8,2600,4)},0);
// ================= timeline =================
const EV={snap:0.9,idea:3.5,r1:10.0,shrink:12.0,fall:15.6,r2:17.0,gone:19.1,r3:24.0,r4:31.0,r5:37.0,back:41.0,touch:46.5,endc:58.6,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.back)return'r5';if(t<EV.touch)return'back';if(t<EV.endc)return'touch';return'end'}
function envBase(){return{sun:V.norm([0.85,0.32,0.55]),sunCol:V.sc(hx('#fff1e0'),1.25),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.05,0.06,0.1]}}
function envAt(t){const S=scn(t);if(S==='r1'||(S==='r2'&&t<EV.gone)||S==='r3'){return envDay({sun:V.norm([-0.35,0.75,0.55]),fogD:S==='r3'?2600:320,fog:hx('#cfe0f0')})}
  const e=envBase();if(S==='r2'){e.sun=V.norm([0.4,0.9,0.5]);e.fillC=[0.12,0.14,0.22]}if(S==='touch'){e.fillC=[0.1,0.12,0.2]}return e}
// earth scale over time (hook/back): 1 normal -> tiny
const TINY=0.035;
function earthScale(t){const S=scn(t);if(S==='hook'){if(t<EV.snap)return 1;const k=seg(t,EV.snap,EV.snap+0.32);return lerp(1,TINY,easeIn(k))}
  if(S==='back'){const k=seg(t,EV.back+0.15,EV.back+0.9);return k<=0?TINY:lerp(TINY,1,easeOut(k))*(1+0.06*Math.sin(k*9)*(1-k))}return 1}
function camAt(t){const S=scn(t);let eye=[0,0.35,4.4],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;eye=[0.2*Math.sin(tt*0.3),0.55,lerp(4.7,4.3,ease(tt/3))];at=[0,0.05,0];if(S==='hook'&&t>EV.snap+0.3){const k=ease(seg(t,EV.snap+0.3,EV.idea));eye=[0.1,lerp(0.55,0.2,k),lerp(4.4,1.3,k)]}}
  if(S==='idea'){const k=seg(t,EV.idea,EV.r1);const z=lerp(1,0,ease(seg(t,EV.idea+3.0,EV.idea+5.6)));eye=[Math.sin(t*0.25)*2.2*(0.2+0.8*z),0.9*(0.2+0.8*z),lerp(11.5,1.25,1-z)];if(t<EV.idea+3.0)eye=[Math.sin(t*0.25)*2.6,1.2,lerp(10.5,11.5,seg(t,EV.idea,EV.idea+3))];at=[0,0,0];fov=0.9}
  if(S==='r1'){const k=seg(t,EV.r1,EV.r2);const zin=ease(seg(t,EV.shrink+0.3,EV.shrink+2.6));eye=[lerp(-3.2,-1.6,k)*(1-zin*0.75),lerp(1.6,1.1,k)*(1-zin*0.7)+0.06,lerp(5.2,4.6,k)*(1-zin*0.86)];at=[0,lerp(1.05,0.05,zin),0];fov=0.85;
    }
  if(S==='r2'){if(t<EV.gone){const k=seg(t,EV.r2,EV.gone);eye=[lerp(-30,-20,k),lerp(38,30,k),lerp(55,45,k)];at=[0,0,-28];fov=0.95}else{const k=seg(t,EV.gone,EV.r3);eye=[lerp(1.6,-1.2,k),lerp(1.5,1.2,k),lerp(2.8,2.4,k)];at=[0,0.45,0];fov=0.85}}
  if(S==='r3'){const k=seg(t,EV.r3,EV.r4);eye=[lerp(-700,-560,k),lerp(260,300,k),lerp(1250,1120,k)];at=[lerp(-40,0,k),170,-60];fov=0.95}
  if(S==='r4'){const k=seg(t,EV.r4,EV.r5);eye=[lerp(-1.5,1.5,k),lerp(2.6,2.0,k),lerp(6.5,6.0,k)];at=[0.4,-0.9,0];fov=0.9}
  if(S==='r5'){const k=seg(t,EV.r5,EV.back);eye=[lerp(0.6,-0.6,k),0.3,lerp(1.4,1.1,k)];at=[0,0,0];fov=0.9}
  if(S==='back'){const k=ease(seg(t,EV.back,EV.back+1.2));eye=[0.1,lerp(0.2,0.5,k),lerp(1.2,4.5,k)];at=[0,0.03,0];const s=t-EV.back;if(s>1.2)eye=[0.1+0.3*Math.sin((s-1.2)*0.4),0.5,4.5-0.1*(s-1.2)]}
  if(S==='touch'){const k=seg(t,EV.touch,EV.endc);eye=[Math.sin(t*0.2)*1.2,0.8,lerp(9.6,8.6,k)];at=[0,0,0];fov=0.9}
  return{eye,at,fov}}
let EARTHS=[],VQ=null,VMOONP=null,VPERS=null,VNS=null,VATOMS=[];
function spEarth(items,p,s,ang,cang,tint,ta){const M=M4.trs(p,ang,0,0,s);items.push({mesh:SPE,M,tint,tintAmt:ta||0});if(s>0.2)items.push({mesh:SPCLOUD,M:M4.trs(p,cang,0,0,s),alpha:0.75,noShadow:true});EARTHS.push({p,s})}
// an atom: nucleus + 3 tilted orbits with electrons; R=orbit radius, ns=nucleus scale
function atomItems(items,c,R,ns,t,a){a=a==null?1:a;items.push({mesh:VNUC,M:M4.trs(c,t*0.4,0.3,0,ns),noShadow:true});
  const cols=[HC('#5af0ff'),HC('#ffd84a'),HC('#ff5a8a')];for(let i=0;i<3;i++){const L=M4.trs(c,i*1.05+0.2,0.9+i*0.55,i*0.7,R);items.push({mesh:TORUS,M:L,tint:cols[i],tintAmt:1,alpha:0.85*a,noShadow:true});
    const an=t*(1.6+i*0.35)+i*2;const lp=[Math.cos(an),0,Math.sin(an),1];const wp=[L[0]*lp[0]+L[8]*lp[2]+L[12],L[1]*lp[0]+L[9]*lp[2]+L[13],L[2]*lp[0]+L[10]*lp[2]+L[14]];items.push({mesh:VELEC,M:M4.trs(wp,0,0,0,R*0.045),noShadow:true});VATOMS.push({e:wp,c,R})}}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];VMOONP=null;VPERS=null;VNS=null;VATOMS=[];
  if(S==='hook'||S==='end'||S==='back'){const s=S==='end'?1:earthScale(t);spEarth(items,[0,0,0],s,t*0.25,t*0.27);
    if(S==='hook'&&t>EV.snap+0.5){const k=seg(t,EV.snap+0.9,EV.snap+1.2);if(k>0)qItems(items,t,cm,{x:0.6,y:-0.72,s:0.13,d:3,pop:easeOut(k),expr:'wide'})}}
  if(S==='idea'){atomItems(items,[0,0,0],3.2,0.055,t);const k=seg(t,EV.idea+1.0,EV.idea+1.3);if(k>0&&t<EV.idea+3.0)qItems(items,t,cm,{x:0.62,y:-0.72,s:0.13,d:3,pop:easeOut(k)*clamp((EV.idea+3.0-t)/0.2,0,1),expr:'wide'})}
  if(S==='r1'){items.push({mesh:SPTOWN,M:ID4});const sk=ease(seg(t,EV.shrink,EV.shrink+0.9));const sc=lerp(1,0.004,sk);const fall=t>EV.fall?Math.pow(t-EV.fall,2)*3:0;
    if(sc>0.01)for(const it of jumperItems([0,0.04-fall,0],0.25,0,0.05+sk*0.3,0,sc))items.push(it);VPERS=[0,0.04+sc*1.0-fall,0];
    if(t>EV.fall){const kk=t-EV.fall;for(let j=0;j<6;j++){const p=[Math.cos(j)*0.08*(1+kk),0.03+kk*0.08,Math.sin(j)*0.08*(1+kk)];items.push({mesh:PUFF,M:M4.trs(p,j,0,0,0.008+kk*0.012),tint:hx('#b8b2a4'),tintAmt:0.7,alpha:clamp(0.7-kk*0.5,0,0.7),noShadow:true})}}
    const kq=seg(t,EV.shrink+1.0,EV.shrink+1.3);if(kq>0)qItems(items,t,cm,{x:0.58,y:-0.72,s:0.12,d:3,pop:easeOut(kq),expr:'o'})}
  if(S==='r2'){if(t<EV.gone)items.push({mesh:VCROWD,M:ID4});else{items.push({mesh:VTABLE,M:ID4});items.push({mesh:VLAB,M:ID4});const p=easeOut(seg(t,EV.gone,EV.gone+0.4));items.push({mesh:VCUBE,M:M4.trs([0,0,0],0.5+t*0.15,0,0,0.6*p)});
    const kq=seg(t,EV.gone+1.6,EV.gone+1.9);if(kq>0)qItems(items,t,cm,{x:-0.58,y:-0.72,s:0.12,d:3,pop:easeOut(kq),expr:'wide'})}}
  if(S==='r3'){items.push({mesh:SPCOAST,M:ID4});items.push({mesh:SPWATER,M:ID4});const p=easeOut(seg(t,EV.r3+0.4,EV.r3+1.2));const R=184*p;if(R>1){spEarth(items,[-150,R+2,-40],R,t*0.2,t*0.22);EARTHS[EARTHS.length-1].hot=1}}
  if(S==='r4'){spEarth(items,[0,0,0],TINY,t*0.6,t*0.6);const a=(t-EV.r4)*0.55+0.6;const R=1.7;const mp=[Math.cos(a)*R,Math.sin(a)*0.25,Math.sin(a)*R];VMOONP=mp;items.push({mesh:SMOONE,M:M4.trs(mp,0,0,0,0.27*0.6),tint:[0.85,0.85,0.9],tintAmt:0.3});
    const kq=seg(t,EV.r4+4.0,EV.r4+4.3);if(kq>0)qItems(items,t,cm,{x:0.58,y:-0.72,s:0.12,d:3,pop:easeOut(kq),expr:'happy'})}
  if(S==='r5'){const k=ease(seg(t,EV.r5+1.4,EV.r5+2.0));items.push({mesh:SSUNS,M:M4.trs([0,0,0],t*2,0,0,TINY*1.05),tint:mix3([1,1,1],[0.55,0.8,1],k),tintAmt:0.85*k+0.1});if(k<1)spEarth(items,[0,0,0],TINY*1.0,t*0.6,t*0.6,[1,0.7,0.4],0.4*k);VNS=k}
  if(S==='touch'){const s=t-EV.touch;const gap=lerp(5.5,2.25,easeOut(seg(s,0.3,3.5)))+0.25*Math.sin(s*3)*seg(s,3.5,4.5)+0.06*Math.sin(s*9)*seg(s,4.5,5);atomItems(items,[-gap/2,0,0],1.1,0.06,t);atomItems(items,[gap/2,0,0],1.1,0.06,t+1.7)}
  return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  const day=S==='r1'||(S==='r2'&&tt<EV.gone)||S==='r3';const lab=S==='r2'&&tt>=EV.gone;
  if(!day&&!lab)items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const shc=S==='r1'?{center:[0,0,0],radius:6}:(S==='r2'&&!lab)?{center:[0,0,-28],radius:70}:lab?{center:[0,0,0],radius:3}:S==='r3'?{center:[0,0,-60],radius:420}:{center:[0,-9999,0],radius:1};
  if(day){env.ground=1;env.gndCol=S==='r3'?hx('#1d5b92'):C.grass}
  if(lab){env.zen=hx('#05061a');env.hor=hx('#0b1030');env.stars=0}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:S==='r3'?2:(S==='r1'?0.005:0.02),far:S==='r3'?6000:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.snap,14,0.6);S(EV.fall,10,0.5);S(EV.gone,8,0.5);S(EV.r3+0.4,8,0.6);S(EV.back+0.1,26,1.4);S(EV.touch+4.5,5,0.6);return a}
