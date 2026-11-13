// ================= THE 13TH HOUSE =================
const EV={n13hook:3.9,count2:4.3,appear:9.6,mid:11.0,door:14.2,fb:18.8,enter:22.0,slam:22.45,fbm:23.4,fbEnd:27.8,wave:28.0,waveOn:30.4,kid:33.3,c11:37.0,c12:38.3,c13:39.8,run:41.4,inside:43.9,morn:44.7,only:47.4,missing:49.3,where:51.9,cut:54.25,black:57.6,endc:57.8,loop:65.6};
const K=[400,0,0];
const HW=6.2,HD=5;
const HL=[// [x,z,ry,h,sh,roof,door]
 [393,6,-Math.PI/2,4.2,'#3a5a7a','#5a3a2a',1],[407.5,6,Math.PI/2,4.4,'#7a3a3a','#4a3a2a',1],
 [393,14,-Math.PI/2,4.0,'#3a6a4a','#5a2a22',0],[407.5,14,Math.PI/2,4.2,'#3a5a7a','#4a3a2a',1],
 [393,22,-Math.PI/2,4.4,'#7a3a3a','#4a2a22',1],[407.5,22,Math.PI/2,4.0,'#3a6a4a','#5a3a2a',0],
 [407.5,30,Math.PI/2,4.2,'#2a5a8a','#5a3a2a',1],
 [393,38,-Math.PI/2,4.2,'#3a6a4a','#4a3a2a',1],[407.5,38,Math.PI/2,4.4,'#7a3a3a','#5a2a22',0],
 [393,46,-Math.PI/2,4.0,'#3a5a7a','#4a3a2a',1],[407.5,46,Math.PI/2,4.2,'#3a6a4a','#5a3a2a',1],
 [393,54,-Math.PI/2,4.4,'#7a3a3a','#4a2a22',1]];
const HOME=6;// index of kid's house (407.5,30)
const H13=[393.4,30,-Math.PI/2,4.8];
const HMESH=HL.map(h=>um(m=>vhouse(m,0,0,0,HW,HD,h[3],hx(h[4]),hx(h[5]),h[6]),0.0));
const HMESH13=um(m=>vhouse(m,0,0,0,5.2,HD,H13[3],hx('#1a1418'),hx('#120c0e'),1,{wall:hx('#3a3438'),tim:hx('#140e10'),win:[1,0.25,0.12],winMat:MAT.emis,door:[0.02,0.01,0.01]}),0.0);
const GLOWDOOR=um(m=>m.box([0,0,0],[1,1,1],[1,1,1],MAT.emis));
const KLAMPS=[[397.4,10],[402.8,18],[397.4,26],[402.8,34],[397.4,42],[402.8,50]];
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const yawTo=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
function scn(t){if(t>=EV.fb&&t<EV.fbm)return 'fbn';if(t>=EV.fbm&&t<EV.fbEnd)return 'fbd';if(t>=EV.morn&&t<EV.cut)return 'day';return 'night'}
const isFB=t=>t>=EV.fb&&t<EV.fbEnd;
function show13(t){if(t<EV.n13hook)return 0;if(t<EV.count2)return hsh(Math.floor(t*20),3)<0.6?1:0;if(t<EV.appear)return 0;if(t<EV.fbm){const k=seg(t,EV.appear,EV.appear+1.0);return k<1?(hsh(Math.floor(t*20),4)<k?1:0):1}
  if(t<EV.fbEnd)return 0;if(t<EV.kid)return 1;if(t<EV.c13-0.2)return 0;if(t<EV.morn){const k=seg(t,EV.c13-0.2,EV.c13+0.3);return k<1?(hsh(Math.floor(t*20),5)<k?1:0):1}if(t<EV.cut)return 0;return 1}
function homeOn(t){return !(t>=EV.morn&&t<EV.cut)}
// house anchor helpers
function hM(h){return M4.trs([h[0],0,h[1]],h[2],0,0,1)}
function hTop(h){return tp(hM(h),[0,(h[3]||4.2)*1.25,-HD/2-0.3])}
function winPt(h,w,side,dz){return tp(hM(h),[side*w/3,h[3]*0.76,-HD/2-0.04-(dz||0)])}
function doorPt(h,w,dz){return tp(hM(h),[w/6+0.55,1.0,-HD/2-0.04-(dz||0)])}
// count order (for number pops)
const ORDER=[0,1,2,3,4,5,6,7,8,9,10,11];
function countPops(t){// returns [{p,label,red,k}]
  const out=[];const pop=(t0,h,label,red)=>{if(t>=t0)out.push({p:h,label,red,k:t-t0})};
  if(t<EV.count2){ORDER.forEach((hi,j)=>pop(0.6+j*0.27,hTop(HL[hi]),String(j+1)));if(t>=EV.n13hook)pop(EV.n13hook,hTop(H13),'13?',1)}
  if(t>=EV.kid&&t<EV.run){ORDER.slice(0,10).forEach((hi,j)=>pop(EV.kid+0.4+j*0.3,hTop(HL[hi]),String(j+1)));pop(EV.c11,hTop(HL[10]),'11');pop(EV.c12,hTop(HL[11]),'12');pop(EV.c13,hTop(H13),'13',1)}
  if(t>=EV.morn&&t<EV.missing){const idx=ORDER.filter(i=>i!==HOME);idx.forEach((hi,j)=>pop(EV.morn+0.3+j*0.2,hTop(HL[hi]),String(j+1),j===10?1:0))}
  return out}
// ---------- characters ----------
LOOK.kid2=chr({shirt:hx('#3a8a5a'),pants:hx('#3a4a6a'),shoes:hx('#e8e8e8'),hair:'short',hairCol:hx('#6a4022'),hood:1,sc:0.86});
LOOK.man=chr({shirt:hx('#5a4a3a'),pants:hx('#3a3a3a'),shoes:hx('#2a2a2a'),hair:'cap',hairCol:hx('#8a8a8a'),coat:hx('#4a3a2c'),skin:hx('#e8c0a0'),sc:0.98});
LOOK.pale=chr({shirt:hx('#5a4a3a'),pants:hx('#3a3a3a'),hair:'cap',hairCol:hx('#8a8a8a'),skin:hx('#b8b8b0'),sc:0.98});
LOOK.palekid=chr({shirt:hx('#3a8a5a'),pants:hx('#3a4a6a'),hair:'short',hairCol:hx('#6a4022'),hood:1,skin:hx('#b8b4ac'),sc:0.86});
let KIDR=null,MANR=null;
function bust(items,L,h,w,side,t,t0,sc){// figure standing in upper window, waving
  const wp=winPt(h,w,side,0.12);const ry=h[2]+Math.PI;const k=seg(t,t0,t0+0.4);
  const st={pos:[wp[0],wp[1]-0.62-1.6*0.62*0+(-0.55),wp[2]],ry:h[2]-Math.PI,sc:sc||0.62,face:{eyes:'hollow',mouth:'flat'},aR:{f:2.8*k,s:-0.25+0.35*Math.sin(t*5)*k},aL:{f:0.1},head:{y:0,p:0,r:0.12*Math.sin(t*1.3)},bust:1};
  st.pos=[wp[0],wp[1]-0.62*1.55,wp[2]];return blocky(L,st,items)}
function kidSt(t){// night counting / run
  if(t<EV.run){const P=[K[0]-0.6,0,-3.5];const st={pos:P,ry:0.05,face:{mouth:'flat',eyes:'open'},aL:{f:0.2},aR:{f:0.2},head:{p:-0.12}};const c=Math.floor((t-EV.kid)/0.3);
    if(t<EV.c12+0.6){st.aR={f:1.5+0.05*Math.sin(t*20),s:-0.1+0.05*(c%3)};st.face={mouth:'o',open:0.4,eyes:'open'}}
    if(t>=EV.c13-0.05){st.face={mouth:'o',eyes:'wide',open:1.2,brow:'up',sweat:1};st.aR={f:0.3};st.lean=-0.08}return st}
  const A=[K[0]-0.6,0,-3.5],B=[K[0]-1.0,0,24.5],C=[H13[0]+3.2,0,H13[1]+0.75];const k=seg(t,EV.run,EV.inside-0.6);let p,ry;
  if(k<1){p=lerp3(A,B,easeIn(k)*0.3+k*0.7);ry=yawTo(A,B)}else{const k2=seg(t,EV.inside-0.6,EV.inside);p=lerp3(B,C,k2);ry=yawTo(B,C)}
  return{pos:p,ry,walk:{ph:t*13,amp:0.9},lean:0.2,face:{mouth:'o',eyes:'wide',open:1,brow:'up'},aL:{f:0.0},aR:{f:0.0}}}
function manSt(t){const A=[K[0]+0.5,0,22],B=[H13[0]+3.0,0,H13[1]+0.75],C=[H13[0]+2.2,0,H13[1]+0.75];
  if(t<EV.enter-0.8){const k=seg(t,EV.fb,EV.enter-0.8);return{pos:lerp3(A,B,k),ry:yawTo(A,B),walk:{ph:t*6,amp:0.4},face:{mouth:'flat',eyes:'open',brow:'up'},head:{p:-0.15}}}
  const k=seg(t,EV.enter-0.8,EV.enter+0.3);return{pos:lerp3(B,C,k),ry:-Math.PI/2,walk:{ph:t*6,amp:0.35*(1-k)},face:{mouth:'flat',eyes:'open'}}}
// ---------- items ----------
function lampItems(items){KLAMPS.forEach(l=>{const p=[l[0],0,l[1]];items.push({mesh:LAMPPOST,M:M4.trs(p,0,0,0,1)});items.push({mesh:LGLASS,M:M4.trs(p,0,0,0,1),tint:[1,0.82,0.45],tintAmt:1});
  items.push({mesh:LGLOW,M:M4.trs([p[0],3.62,p[2]],0,0,0,0.7),tint:[1,0.7,0.3],tintAmt:1,alpha:0.14,add:1,noShadow:true});items.push({mesh:POOL,M:M4.trs([p[0],0.03,p[2]],0,0,0,2.4),tint:[1,0.6,0.3],tintAmt:1,alpha:0.12,add:1,noShadow:true})})}
function fgItems(t){const items=[{mesh:WORLD}];const S=scn(t);KIDR=null;MANR=null;
  HL.forEach((h,i)=>{if(i===HOME&&!homeOn(t))return;items.push({mesh:HMESH[i],M:hM(h)})});
  if(S!=='day'&&S!=='fbd')lampItems(items);else KLAMPS.forEach(l=>items.push({mesh:LAMPPOST,M:M4.trs([l[0],0,l[1]],0,0,0,1)}));
  if(show13(t)){items.push({mesh:HMESH13,M:M4.trs([H13[0],0,H13[1]],H13[2],0,0.025,[1,1.0,1])});const dp=doorPt(H13,5.2,-0.3);items.push({mesh:GLOWDOOR,M:M4.trs(dp,H13[2],0,0,[0.9,1.9,0.05]),tint:[0.35,0.05,0.03],tintAmt:1})}
  // window figures
  if(show13(t)&&t>=EV.wave&&t<EV.fb+999&&((t>=EV.wave&&t<EV.kid)||(t>=EV.c13+0.4&&t<EV.run))){MANR=bust(items,LOOK.pale,H13,5.2,-1,t,t>=EV.kid?EV.c13+0.6:EV.waveOn)}
  if(t>=EV.cut){KIDR=bust(items,LOOK.palekid,H13,5.2,-1,t,EV.cut+0.9,0.6)}
  if(S==='fbn'){MANR=blocky(LOOK.man,manSt(t),items)}
  if(S==='fbd'){const cp=[H13[0]+2.6,0.06,H13[1]+0.4];items.push({mesh:UB,M:M4.trs(cp,0.5,0,0.2,[0.3,0.1,0.3]),tint:hx('#b8402a'),tintAmt:1});items.push({mesh:UB,M:M4.trs([cp[0]+0.12,0.03,cp[2]+0.1],0.5,0,0,[0.2,0.02,0.18]),tint:hx('#a8301a'),tintAmt:1})}
  if(t>=EV.kid&&t<EV.inside+0.1)KIDR=blocky(LOOK.kid2,Object.assign(kidSt(t),{pack:1}),items);
  if(S==='day'){const h=HL[HOME];const bp=[h[0]-1.2,0.25,h[1]-0.5];items.push({mesh:UB,M:M4.trs(bp,0.7,0.25,0,[0.5,0.55,0.25]),tint:hx('#b0602a'),tintAmt:1})}
  if(S==='fbn'||S==='night'){for(let i=0;i<60;i++){const c=camAt(t).eye;const x=c[0]-6+hsh(i,1)*12,z=c[2]+hsh(i,2)*20,y=0.3+((hsh(i,3)*4+t*0.15)%4);items.push({mesh:PUFF,M:M4.trs([x,y,z],i,0,0,0.6+hsh(i,4)),tint:[0.5,0.55,0.7],tintAmt:1,alpha:0.035,noShadow:true})}}
  return items}
// ---------- env ----------
function envBase(){return{sun:[-0.4,0.55,0.6],sunCol:hx('#5a66a8'),sky:hx('#2a3466'),gnd:hx('#1a2028'),fog:hx('#1c2340'),fogD:80,zen:hx('#04050f'),hor:hx('#26305a'),stars:1,night:0.2,emis:1.4,ground:1,sunSize:2.5,fillD:[0.3,0.5,-1],fillC:[0.1,0.11,0.2]}}
const E_N=envBase();
const E_FBN=Object.assign(envBase(),{sunCol:hx('#7a7088'),fog:hx('#3a3a48'),fillC:[0.16,0.16,0.2],stars:0});
const E_FBD=Object.assign(envBase(),{sun:[0.4,0.7,-0.5],sunCol:hx('#9a9488'),sky:hx('#8a8a88'),fog:hx('#8a8884'),fogD:110,zen:hx('#6a7078'),hor:hx('#9a9894'),stars:0,night:0,fillC:[0.26,0.26,0.27]});
const E_DAY=Object.assign(envBase(),{sun:[0.4,0.6,-0.6],sunCol:hx('#8a909a'),sky:hx('#8a94a4'),fog:hx('#9aa2ae'),fogD:100,zen:hx('#5a6a84'),hor:hx('#a8b0b8'),stars:0,night:0,fillC:[0.26,0.28,0.32]});
function envAt(t){const S=scn(t);return S==='fbn'?E_FBN:S==='fbd'?E_FBD:S==='day'?E_DAY:E_N}
// ---------- camera ----------
const D13=doorPt(H13,5.2,0),W13=winPt(H13,5.2,-1,0);
const SH=[
  [0,[K[0]+0.4,12,-13],[K[0],0.5,30],[K[0]+0.3,11,-11],[K[0],0.5,31],0.9],
  [EV.count2,[K[0]+1.6,1.6,4],[K[0]-6,2.6,20],[K[0]+1.6,1.6,7],[K[0]-6,2.6,24],0.9],
  [7.6,[K[0]+4.6,1.7,24.5],[H13[0],2.6,30],[K[0]+4.2,1.7,25.2],[H13[0],2.6,30],0.9],
  [EV.mid,[K[0]+5.2,1.9,30.8],[H13[0],3.0,30],[K[0]+4.2,1.85,30.4],[H13[0],3.0,30],0.85],
  [EV.door,[D13[0]+9,1.8,D13[2]-1.5],[D13[0],2.0,D13[2]],[D13[0]+6.0,1.6,D13[2]-0.8],[D13[0],1.4,D13[2]],0.85],
  [EV.fb,[K[0]+4.6,1.7,24.0],[K[0]-2,1.4,28.5],[K[0]+4.6,1.7,25.0],[H13[0]+2.5,1.6,30.5],0.9],
  [EV.fbm,[K[0]+4.6,1.6,26.0],[H13[0]+1.5,0.8,30.3],[K[0]+4.2,1.5,27.0],[H13[0]+2.0,0.5,30.3],0.85],
  [EV.wave,[W13[0]+8,2.4,W13[2]+0.6],W13,[W13[0]+4.6,3.0,W13[2]+0.3],W13,0.7],
  [EV.kid,[K[0]+0.4,1.9,-6.4],[K[0]-0.6,2.4,26],[K[0]+0.3,1.9,-6.1],[K[0]-0.6,2.4,26],0.75],
  [EV.c13+0.4,[W13[0]+6,2.6,W13[2]-1.5],[W13[0],2.8,W13[2]],[W13[0]+4.8,2.7,W13[2]-1.0],[W13[0],2.9,W13[2]],0.7],
  [EV.run,null],
  [EV.morn,[K[0]+0.4,12,-13],[K[0],0.5,30],[K[0]+0.3,11.2,-11.5],[K[0],0.5,31],0.9],
  [EV.missing,[K[0]-3.0,1.7,26.5],[HL[HOME][0],1.0,30],[K[0]-2.4,1.7,27.2],[HL[HOME][0],0.9,30],0.85],
  [EV.cut,[W13[0]+3.2,3.0,W13[2]-0.2],W13,[W13[0]+2.3,3.0,W13[2]-0.1],W13,0.75],
  [EV.endc,[K[0]+0.4,1.8,-6],[K[0],2.3,30],[K[0]+0.4,1.8,-5],[K[0],2.3,30],0.75],
  [EV.loop,[K[0]+0.4,12,-13],[K[0],0.5,30],[K[0]+0.4,12,-13],[K[0],0.5,30],0.9],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){if(t>=EV.run&&t<EV.morn){const k=kidSt(Math.min(t,EV.inside-0.01)).pos;return{eye:[k[0]+2.6,1.9,k[2]-4.2],at:[k[0]-0.5,1.3,k[2]+3],fov:0.9}}
  for(let i=0;i<SH.length-1;i++){const s=SH[i],n=SH[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.9}}}return{eye:SH[0][1],at:SH[0][2],fov:0.8}}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:3000},{center:[cm.at[0]*0.4+cm.eye[0]*0.6,0,cm.at[2]*0.4+cm.eye[2]*0.6],radius:16},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.appear+1.0,4,0.4);S(EV.slam,8,0.4);S(EV.c13,6,0.4);S(EV.inside,7,0.4);S(EV.cut,12,0.6);if(t>=EV.run&&t<EV.inside)a+=1.5;return a}
