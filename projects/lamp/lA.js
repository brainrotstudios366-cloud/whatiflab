// ================= THE LAMPLIGHTER: timeline =================
const EV={hook:[1.9,0.6],street:3.0,fb:7.6,light:[8.7,10.5,12.2],kids:12.9,ball:[13.6,14.6,15.6],leave:17.9,fbEnd:22.6,stat:24.8,fl:[25.8,29.9,32.5,34.4],bed:35.6,flk:[39.3,41.3],dark0:45.2,dark:46.0,on:50.2,relief:52.5,off:54.0,eyes:57.6,black:58.35,endc:58.6,loop:65.6};
const K=[400,0,0];
const VL=[[6,-1.9],[12,3.0],[18,-1.9],[24,3.0],[30,-1.9],[36,3.0],[42,-1.9],[-4.5,4.5],[3.8,3.8]];
const KL=[[0.6,6.5],[-1.8,12],[1.8,18],[-1.8,24],[1.8,30],[-1.8,36]];
const yawTo=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function arc(a,b,k,h){const p=lerp3(a,b,k);p[1]+=h*4*k*(1-k);return p}
function flick(t,t0,d){if(t<t0||t>=t0+d)return 1;const f=Math.floor((t-t0)*22);return (hsh(f,Math.floor(t0*10))<0.45)?1:0}
function scn(t){if(t>=EV.fb&&t<EV.fbEnd)return 'fb';if(t>=EV.bed&&t<EV.endc)return 'bed';return 'vil'}
const isFB=t=>t>=EV.fb&&t<EV.fbEnd;
// lamp states: returns array of brightness (0..1) for village lamps
function vlamps(t){const L=VL.map(()=>1);
  if(isFB(t)){for(let i=0;i<VL.length;i++)L[i]=0;for(let i=0;i<3;i++){if(t>=EV.light[i])L[i]=1;if(t>=EV.ball[2-i]+0.35)L[i]=0}return L}
  if(t<EV.street){const f=flick(t,EV.hook[0],EV.hook[1]);L[4]=f;return L}
  for(const f0 of EV.fl){const d=f0===EV.fl[0]?0.8:0.6;if(t>=f0&&t<f0+d){const f=flick(t,f0,d);for(let i=0;i<7;i++)L[i]=f0===EV.fl[0]?(i===5?f:1):f}}
  return L}
function ghostVil(t){// which lamp he stands under (index) or -1
  if(t<EV.street){if(t>=EV.hook[0]&&t<EV.hook[0]+EV.hook[1]+0.5&&flick(t,EV.hook[0],EV.hook[1]))return 4;return -1}
  if(t<EV.stat)return -1;let g=-1;if(t>=EV.fl[0]+0.8)g=5;if(t>=EV.fl[1]+0.6)g=4;if(t>=EV.fl[2]+0.6)g=3;if(t>=EV.fl[3]+0.6)g=2;
  for(const f0 of EV.fl){const d=f0===EV.fl[0]?0.8:0.6;if(t>=f0&&t<f0+d)return -1}return g}
function klamps(t){const L=KL.map(()=>1);for(const f0 of EV.flk)if(t>=f0&&t<f0+0.6){const f=flick(t,f0,0.6);for(let i=0;i<L.length;i++)L[i]=f}
  if(t>=EV.dark0&&t<EV.dark)L[0]=flick(t,EV.dark0,0.8);if(t>=EV.dark&&t<EV.on)L[0]=0;if(t>=EV.on&&t<EV.on+0.35)L[0]=flick(t,EV.on,0.35);return L}
function ghostK(t){if(t<EV.flk[0]+0.6)return -1;if(t<EV.flk[1])return 3;if(t<EV.flk[1]+0.6)return -1;if(t<EV.dark)return 1;if(t<EV.on)return 0;return -1}
function roomLight(t){if(t<EV.off)return 1;if(t<EV.off+0.12)return 0.5;return 0}
// ---------- characters ----------
let KIDR=null,GHOSTR=null,OLDR=null,KIDSR=[];
function oldSt(t){// flashback old man
  const P=[[6.0,0,-0.9],[12.0,0,2.0],[18.0,0,-0.9]];const arrive=[EV.fb,EV.light[0]+0.9,EV.light[1]+0.9];
  let st;if(t<EV.light[2]+0.6){let i=0;for(let k=1;k<3;k++)if(t>=EV.light[k-1]+0.35)i=k;
    const walkStart=i>0?EV.light[i-1]+0.35:EV.fb,walkEnd=i>0?arrive[i]:EV.fb;const from=i>0?P[i-1]:[3.5,0,0.3];
    if(t<walkEnd){const k=seg(t,walkStart,walkEnd);st={pos:lerp3(from,P[i],ease(k)),ry:yawTo(from,P[i]),walk:{ph:t*6,amp:0.4}}}
    else{const lam=VL[i];st={pos:P[i],ry:yawTo(P[i],[lam[0],0,lam[1]]),walk:{ph:0,amp:0}};const k=seg(t,EV.light[i]-0.55,EV.light[i]-0.15)*(1-seg(t,EV.light[i]+0.15,EV.light[i]+0.4));st.aR={f:2.7*k+0.6*(1-k),s:-0.1};st.aL={f:0.3}}}
  else if(t<EV.leave){st={pos:[18,0,-0.9],ry:yawTo([18,0,-0.9],[10,0,1.0]),aR:{f:0.6},face:{}};if(t>=EV.ball[0])st.ry=yawTo([18,0,-0.9],[10.5,0,1.2]);if(t>=EV.ball[2]+0.5)st.face={mouth:'sad',brow:'sad',eyes:'open'}}
  else{const k=seg(t,EV.leave,EV.fbEnd);st={pos:[18+k*22,0,0.6-0.4*k],ry:Math.PI/2,walk:{ph:t*5,amp:0.35},aR:{f:0.6},face:{mouth:'sad',brow:'sad'}}}
  st.lean=0.18;st.head={p:-0.1};st.face=st.face||{mouth:'flat',eyes:'open'};return st}
function kidsSt(t){const out=[];if(t<EV.kids)return out;const base=[[9.6,0,0.2],[10.6,0,1.4],[11.2,0,-0.4]];const looks=['v3','f1','f2'];
  base.forEach((p,i)=>{const k=seg(t,EV.kids,EV.kids+0.9);const from=[p[0]-6,0,p[2]];const st={pos:lerp3(from,p,ease(k)),ry:Math.PI/2,walk:{ph:t*9,amp:k<1?0.5:0}};
    const tb=EV.ball[i];const lam=VL[2-i];if(k>=1)st.ry=yawTo(p,[lam[0],0,lam[1]]);const th=seg(t,tb-0.35,tb-0.05)*(1-seg(t,tb+0.1,tb+0.4));st.aR={f:2.6*th,s:-0.2};
    if(t>=tb+0.3){Object.assign(st,{bob:Math.abs(Math.sin(t*14+i))*0.04,lean:-0.12,head:{p:-0.2},face:{eyes:'happy',mouth:'laugh',open:0.6}})}else st.face={mouth:'smirk'};
    if(t>=EV.leave+1.2){st.ry=yawTo(p,[30,0,0.5]);st.face={mouth:'o',eyes:'wide'};st.bob=0}
    out.push([looks[i],st])});return out}
function kidSt(t){const P=[K[0]-0.35,0,2.35];const st={pos:P,ry:0,face:{mouth:'flat',eyes:'open',brow:'up'},aL:{f:0.45},aR:{f:0.45},head:{p:0}};
  if(t>=EV.flk[0])st.face={mouth:'o',eyes:'wide',open:0.7,brow:'up'};
  if(t>=EV.dark0)st.face={mouth:'o',eyes:'wide',open:1.1,brow:'up',sweat:1};
  if(t>=EV.relief)st.face={mouth:'flat',eyes:'closed',brow:'sad'};
  if(t>=EV.relief+1.0)st.face={mouth:'smile',eyes:'open',brow:0};
  if(t>=EV.off+0.3)st.face={mouth:'o',eyes:'wide',open:0.6,brow:'up',look:[0.8,0]};
  if(t>=EV.eyes-0.1)st.face={mouth:'o',eyes:'wide',open:1.3,brow:'up',sweat:1,look:[0,0]};
  st.bob=t>=EV.dark0&&t<EV.on?Math.abs(Math.sin(t*30))*0.008:0;return st}
// ---------- items ----------
function lampItems(items,list,state,off){list.forEach((l,i)=>{const p=[l[0]+off[0],0,l[1]+off[2]];items.push({mesh:LAMPPOST,M:M4.trs(p,0,0,0,1)});const b=state[i];
  items.push({mesh:LGLASS,M:M4.trs(p,0,0,0,1),tint:b>0?[1,0.82,0.45]:[0.08,0.07,0.06],tintAmt:1});
  if(b>0){items.push({mesh:LGLOW,M:M4.trs([p[0],3.62,p[2]],0,0,0,0.75),tint:[1,0.7,0.3],tintAmt:1,alpha:0.16,add:1,noShadow:true});items.push({mesh:POOL,M:M4.trs([p[0],0.03,p[2]],0,0,0,2.6),tint:[1,0.6,0.3],tintAmt:1,alpha:0.13,add:1,noShadow:true});items.push({mesh:POOL,M:M4.trs([p[0],0.035,p[2]],0,0,0,1.4),tint:[1,0.7,0.4],tintAmt:1,alpha:0.12,add:1,noShadow:true})}})}
function ghostAt(items,p,face,noEyes,sc){const st={pos:p,ry:face,sc:sc||1,face:{eyes:noEyes?'void':'ember',mouth:'none'},aL:{f:0.05,s:-0.02},aR:{f:0.25,s:-0.02},head:{p:0.08}};const r=blocky(LOOK.ghost,st,items);
  items.push({mesh:POLE,M:mm(M4.trs(r.hR,face,0,0,1),M4.trs([0,-1.6,0],0,0,0,1.25))});return r}
function snow(items,t,c){for(let i=0;i<160;i++){const x=c[0]-9+((hsh(i,1)*18+Math.sin(t*0.6+i)*0.4)),z=c[2]-6+hsh(i,2)*16,y=((hsh(i,3)*7-t*0.9)%7+7)%7;items.push({mesh:SNOWF,M:M4.trs([x,y,z],0,0,0,0.028),tint:[1,1,1],tintAmt:1,noShadow:true})}}
function fgItems(t){const items=[{mesh:WORLD}];const S=scn(t);KIDR=null;GHOSTR=null;OLDR=null;KIDSR=[];
  if(S==='bed'){items.push({mesh:BEDROOM,M:M4.trs(K,0,0,0,1)});const rl=roomLight(t);items.push({mesh:CEILLAMP,M:M4.trs(K,0,0,0,1),tint:rl>0?[1,0.92,0.75]:[0.1,0.1,0.1],tintAmt:1});
    lampItems(items,KL,klamps(t),K);const g=ghostK(t);if(g>=0){const l=KL[g];GHOSTR=ghostAt(items,[K[0]+l[0]*0.75,0,l[1]-0.6],Math.PI)}
    KIDR=blocky(LOOK.kid,kidSt(t),items);
    if(t>=EV.off+0.6){GHOSTR=ghostAt(items,[K[0]-0.25,0,1.05+Math.min(0.2,(t-EV.off)*0.04)],0,t<EV.eyes,0.8);if(t<EV.eyes)GHOSTR=null}
    return items}
  lampItems(items,VL,vlamps(t),[0,0,0]);
  if(S==='fb'){snow(items,t,camAt(t).at);const o=oldSt(t);OLDR=blocky(LOOK.old,o,items);const pm=mm(M4.trs(OLDR.hR,o.ry,0,0,1),M4.trs([0,-1.2,0],0,0,0,1));items.push({mesh:POLE,M:pm});
    const tip=tp(pm,[0.13,2.72,0]);OLDR.tip=tip;const fl=t<EV.leave?1:1-seg(t,EV.leave+2.5,EV.fbEnd-0.5);if(fl>0)items.push({mesh:UEMIS,M:M4.trs(tip,0,0,0,0.06*(1+0.2*Math.sin(t*30))),tint:[1,0.7,0.25],tintAmt:1});
    for(const[k,st]of kidsSt(t)){KIDSR.push(blocky(LOOK[k],st,items))}
    // snowballs
    for(let i=0;i<3;i++){const tb=EV.ball[i];if(t>=tb-0.05&&t<tb+0.35){const kp=[[9.6,0,0.2],[10.6,0,1.4],[11.2,0,-0.4]][i];const lam=VL[2-i];const k=seg(t,tb-0.05,tb+0.35);items.push({mesh:USPH,M:M4.trs(arc([kp[0],1.8,kp[2]],[lam[0],3.62,lam[1]],k,1.2),0,0,0,0.09),tint:[1,1,1],tintAmt:1})}
      const kp2=t-tb-0.35;if(kp2>0&&kp2<1.4){const lam=VL[2-i];for(let j=0;j<6;j++){const kk=(kp2*0.8+j/6)%1;items.push({mesh:PUFF,M:M4.trs([lam[0]+Math.sin(j)*0.15,3.7+kk*1.4,lam[1]],j,0,0,0.08+kk*0.2),tint:[0.6,0.6,0.62],tintAmt:0.6,alpha:(1-kk)*0.6*clamp(1.4-kp2,0,1),noShadow:true})}}}
    return items}
  const g=ghostVil(t);if(g>=0){const l=VL[g];const p=g>=7?[l[0],0,l[1]-0.6]:[l[0],0,l[1]+(l[1]>0?-0.6:0.6)];GHOSTR=ghostAt(items,p,g>=7?Math.PI:-Math.PI/2)}
  if(t>=EV.endc)snow(items,t,[10,0,0.5]);
  return items}
// ---------- environment ----------
function envBase(){return{sun:[-0.4,0.55,0.6],sunCol:hx('#5a66a8'),sky:hx('#2a3466'),gnd:hx('#1a2028'),fog:hx('#1c2340'),fogD:90,zen:hx('#04050f'),hor:hx('#26305a'),stars:1,night:0.35,emis:1.3,ground:1,sunSize:2.5,fillD:[0.3,0.5,-1],fillC:[0.1,0.11,0.2]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_N=envBase();
const E_FB=Object.assign(envBase(),{sunCol:hx('#8a7a9a'),sky:hx('#4a4a6a'),fog:hx('#4a4a5e'),fogD:70,zen:hx('#2a2a40'),hor:hx('#6a6070'),stars:0,fillC:[0.2,0.2,0.24],night:0.2});
const E_ROOM=Object.assign(envBase(),{sun:[0.3,0.8,-0.5],sunCol:hx('#7a7068'),fillC:[0.36,0.33,0.32],fillD:[0,0.3,-1],fogD:120});
const E_DARK=Object.assign(envBase(),{sun:[0.2,0.4,-1],sunCol:hx('#3a4670'),fillC:[0.16,0.18,0.28],fillD:[0,0.3,-1],fogD:120});
function envAt(t){const S=scn(t);if(S==='fb'){return E_FB}if(S==='bed'){const rl=roomLight(t);let e=mixEnv(E_DARK,E_ROOM,rl);if(t>=EV.dark0&&t<EV.on+0.4){const L=klamps(t)[0];e=mixEnv(e,E_DARK,(1-L)*0.25)}return e}return E_N}
// ---------- camera ----------
const SH=[
  [0,[2.6,1.7,0.6],[26,2.2,0.6],[2.6,1.7,0.6],[24,2.1,0.6],0.55],
  [EV.street,[3.6,1.35,0.3],[24,2.4,0.8],[8.0,1.5,0.6],[28,2.2,0.6],0.9],
  [EV.fb,[8.2,1.9,-3.6],[5.6,2.3,-0.9],[8.0,1.9,-3.4],[5.8,2.4,-1.0],0.95],
  [EV.light[0]+0.6,null],
  [EV.kids,[5.0,2.2,-4.6],[13.5,2.0,0.6],[5.6,2.2,-4.2],[13.5,2.0,0.6],0.95],
  [EV.leave,[13.0,1.6,1.4],[30,1.4,0.4],[15.0,1.6,1.2],[34,1.4,0.4],0.9],
  [EV.fbEnd,[2.6,1.7,0.6],[24,2.0,0.6],[2.6,1.7,0.6],[24,2.0,0.6],0.7],
  [EV.stat,[2.6,1.7,0.6],[28,2.2,0.6],[2.6,1.7,0.6],[24,2.1,0.6],0.42],
  [EV.bed,[K[0]+0.55,1.7,0.5],[K[0]+0.1,1.65,12],[K[0]+0.5,1.68,0.8],[K[0]+0.0,1.7,12],0.95],
  [EV.flk[0]-0.2,[K[0]+0.25,1.64,1.2],[K[0]-0.6,1.95,20],[K[0]+0.22,1.64,1.3],[K[0]-0.8,1.95,14],0.5],
  [43.6,[K[0]-0.1,1.55,4.4],[K[0]-0.35,1.5,2.4],[K[0]-0.15,1.55,4.0],[K[0]-0.35,1.52,2.4],0.75],
  [EV.dark+0.7,[K[0]+0.35,1.85,1.2],[K[0]+0.5,2.0,6],[K[0]+0.36,1.85,1.5],[K[0]+0.5,2.05,6],0.72],
  [EV.relief,[K[0]-0.1,1.55,4.4],[K[0]-0.35,1.5,2.4],[K[0]-0.12,1.55,4.2],[K[0]-0.35,1.5,2.4],0.75],
  [EV.off,[K[0]-0.3,1.8,5.9],[K[0]-0.33,1.95,1.5],[K[0]-0.32,1.8,5.0],[K[0]-0.33,2.0,1.5],0.75],
  [EV.endc,[2.6,1.7,0.6],[20,2.4,0.6],[3.2,1.7,0.6],[20,2.4,0.6],0.8],
  [EV.loop,[2.6,1.7,0.6],[26,2.2,0.6],[2.6,1.7,0.6],[26,2.2,0.6],0.55],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){
  if(t>=EV.light[0]+0.6&&t<EV.kids){const o=oldSt(t).pos;return{eye:[o[0]+3.6,1.85,0.4],at:[o[0],2.0,o[2]],fov:0.95}}
  for(let i=0;i<SH.length-1;i++){const s=SH[i],n=SH[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SH[0][1],at:SH[0][2],fov:0.9}}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const S=scn(tt);
  const ctr=S==='bed'?null:{center:[cm.at[0]*0.3+cm.eye[0]*0.7,0,cm.at[2]*0.3+cm.eye[2]*0.7],radius:12};
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:3000},ctr,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.fl[0]+0.8,5,0.4);S(EV.dark,4,0.4);S(EV.eyes,14,0.7);if(t>=EV.dark&&t<EV.on)a+=0.8;return a}
