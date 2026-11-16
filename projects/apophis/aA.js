// ================= APOPHIS: timeline / camera / items =================
const EV={date:6.85,name:9.45,chaos:10.55,size:12.45,tons:15.55,sats:18.15,wsat:19.45,km:21.35,eye:24.05,tele:26.25,whatif:28.25,hit:29.75,boom:31.05,mt:32.05,x20:33.55,destr:36.6,panic:40.05,nope:41.75,radar:42.9,safe:44.3,quake:47.1,shake:49.7,slide:51.7,probe:53.25,apex:54.85,endc:57.5,few:59.7,follow:61.5,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const SCN=[['hook',0],['date',EV.date],['size',EV.size],['sats',EV.sats],['eye',EV.eye],['whatif',EV.whatif],['boom',EV.boom],['destr',EV.destr],['panic',EV.panic],['radar',EV.radar],['quake',EV.quake],['probe',EV.probe],['end',EV.endc]];
function scn(t){let s='hook';for(const[n,a]of SCN)if(t>=a)s=n;return s}
const SUND=V.norm([0.75,0.35,0.55]);
const SUNCOL=V.sc(hx('#fff1e0'),1.25);
function envBase(){return{sun:SUND,sunCol:SUNCOL,sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.05,0.055,0.09]}}
function envAt(t){const S=scn(t);const e=envBase();
  if(S==='eye'){e.ground=1;e.gndCol=hx('#05070a');e.zen=hx('#02030b');e.hor=hx('#101640');e.stars=1.2;e.sky=[0.16,0.18,0.32];e.gnd=[0.05,0.05,0.08];e.fillC=[0.18,0.2,0.38];e.fillD=[-0.4,0.8,0.6];e.fog=hx('#0a0e2a');e.fogD=70;e.neb=0.6;e.sunCol=[0,0,0]}
  return e}
function yawFor(dir){return Math.atan2(SLS[2],SLS[0])-Math.atan2(dir[2],dir[0])}
const EYAW=yawFor(SUND);
// flyby path (Earth radius = 1, GEO ring = 6.6, Apophis closest = 6.0)
const apPath=u=>[u,0.25,6.0+0.03*u*u];
function hookU(t){return S_END(t)?lerp(-3.4,-1.4,seg(t,EV.endc,EV.loop)):lerp(-1.4,0.2,t/EV.date)}
function S_END(t){return t>=EV.endc}
function heroCam(A,k){const eye=V.add(A,V.sc([0.05,-0.3,1.8],k));return{eye,at:lerp3(A,[0,0,0],0.1),fov:0.95}}
// impact
const IP=V.norm([0.22,0.28,1]);
function fallA(t){const k=easeIn(seg(t,EV.whatif,EV.boom));return lerp3([0.35,0.45,3.6],V.sc(IP,1.03),k)}
function camAt(t){const S=scn(t);let eye=[0,0,8],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='end'){const A=apPath(hookU(t));const k=S==='hook'?lerp(1.25,1.0,ease(t/3)):1.25;return heroCam(A,k)}
  if(S==='date'){const A=apPath(0.25);const a=(t-EV.date)*0.09;const r=1.25;eye=V.add(A,[Math.sin(a+0.3)*r,0.25+0.05*Math.sin(t),Math.cos(a+0.3)*r]);at=lerp3(A,[0,0,0],0.12);fov=0.9}
  if(S==='size'){const k=ease(seg(t,EV.size,EV.sats));eye=[lerp(-0.4,0.4,k),lerp(2.0,2.5,k),lerp(15.5,14.2,k)];at=[0,1.45,0];fov=0.85}
  if(S==='sats'){const k=ease(seg(t,EV.sats,EV.eye));const a=lerp(-0.35,0.1,k);const r=lerp(14.5,12.5,k);eye=[Math.sin(a)*r,lerp(8,6,k),Math.cos(a)*r];at=[0.3,-2.0,2.4];fov=0.9}
  if(S==='eye'){const k=seg(t,EV.eye,EV.whatif);eye=[0,1.4,6+k*0.8];at=[0.3,6.2,-20];fov=1.0}
  if(S==='whatif'){const A=fallA(t);eye=V.add(A,[0.28,0.32,1.55]);at=lerp3(A,[0,0,0],0.5);fov=0.95}
  if(S==='boom'){const k=ease(seg(t,EV.boom,EV.destr));eye=V.add(V.sc(IP,lerp(4.4,3.8,k)),[lerp(1.0,0.7,k),0.5,0]);at=V.sc(IP,0.6);fov=0.9}
  if(S==='destr'){const k=ease(seg(t,EV.destr,EV.panic));eye=V.add(V.sc(IP,lerp(2.8,2.5,k)),[0.2,0.15,0]);at=V.sc(IP,0.98);fov=0.85}
  if(S==='panic'){eye=[0.4,0.3,4.2];at=[0,0,0];fov=0.9}
  if(S==='radar'){const k=ease(seg(t,EV.radar,EV.quake));eye=[lerp(4.5,3,k),lerp(3.4,2.6,k),lerp(14.5,13)];eye[2]=lerp(14.5,13,k);at=[0.6,0,3.2];fov=0.85}
  if(S==='quake'){const A=apPath(0);const k=ease(seg(t,EV.quake,EV.probe));eye=V.add(A,[lerp(-0.35,0.25,k),0.28,lerp(1.5,1.3,k)]);at=lerp3(A,[0,0,0],0.18);fov=0.95}
  if(S==='probe'){const A=apPath(0);const k=ease(seg(t,EV.probe,EV.endc));eye=V.add(A,[lerp(2.3,1.9,k),lerp(0.5,0.65,k),lerp(1.0,1.4,k)]);at=V.add(A,[0.55,0.05,0]);fov=0.9}
  return{eye,at,fov}}
let EARTHP=null,APOP=null,PROBEP=null,SATP=[];
function earthItems(items,p,s){const M=M4.trs(p,EYAW,0,0,s);items.push({mesh:SEARTH,M});items.push({mesh:SLIGHTSN,M,alpha:0.95,add:1,noShadow:true});EARTHP={p,s}}
function apoItems(items,A,t,s,o){o=o||{};const M=M4.trs(A,t*0.22+0.6,0.35,0.25+t*0.07,s);items.push({mesh:A_APO,M,tint:o.tint||null,tintAmt:o.tintAmt||0});APOP={p:A,s}}
function satRing(items,t,s,n,a0,a1){SATP=[];for(let i=0;i<n;i++){const a=lerp(a0,a1,n>1?i/(n-1):0)+t*0.004;const p=[Math.sin(a)*6.6,0,Math.cos(a)*6.6];items.push({mesh:A_GSAT,M:M4.trs(p,-a+Math.PI/2,0.2,0,s)});
  items.push({mesh:A_LED,M:M4.trs(V.add(p,[0,s*0.32,0]),0,0,0,s*0.05),tint:(Math.floor(t*2+i)%2)?[1,0.3,0.3]:[0.4,1,0.6],tintAmt:1,noShadow:true});SATP.push(p)}}
let DUST=[];
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHP=null;APOP=null;PROBEP=null;SATP=[];DUST=[];
  if(S==='hook'||S==='end'){earthItems(items,[0,0,0],1);satRing(items,t,0.09,7,-0.5,0.5);apoItems(items,apPath(hookU(t)),S==='end'?t-EV.loop:t,0.36)}
  if(S==='date'){earthItems(items,[0,0,0],1);const red=seg(t,EV.chaos,EV.chaos+0.4);apoItems(items,apPath(0.25),t,0.36,{tint:[1,0.3,0.2],tintAmt:red*0.18})}
  if(S==='size'){const k=seg(t,EV.size+0.2,EV.size+0.8);items.push({mesh:A_TOWER,M:M4.trs([-1.45,0,0],0.5,0,0,[1,easeOut(k),1]),alpha:0.75,add:1,noShadow:true});
    const A=[1.25,2.25,0];items.push({mesh:A_APO,M:M4.mul(M4.trs(A,t*0.15,0,0,1),M4.trs([0,0,0],0,0,Math.PI/2,2.5))});APOP={p:A,s:2.5}}
  if(S==='sats'){earthItems(items,[0,0,0],1);satRing(items,t,0.4,18,-Math.PI,Math.PI*0.94);const u=lerp(-7,2.2,seg(t,EV.sats,EV.eye));apoItems(items,apPath(u),t,0.32)}
  if(S==='eye'){items.push({mesh:A_GROUND,M:M4.trs([0,-0.4,0],0,0,0,1)});const r=rngG(4);for(let i=0;i<26;i++){const x=(r()-0.5)*44,z=-8-r()*40;items.push({mesh:A_TREE,M:M4.trs([x,0.1,z],r()*3,0,0,0.9+r()*1.3)})}
    const k=seg(t,EV.eye+0.2,EV.eye+0.6);qItems(items,t,cm,{x:-0.5,y:-0.6,s:0.15,d:3,pop:easeOut(k),expr:t>EV.tele?'happy':'wide'})}
  if(S==='whatif'){earthItems(items,[0,0,0],1);const A=fallA(t);const hot=seg(t,EV.hit-0.3,EV.boom);apoItems(items,A,t,0.12,{tint:[1,0.45,0.15],tintAmt:hot*0.55});
    if(hot>0){const v=V.norm(V.sub(V.sc(IP,1.03),[0.35,0.45,3.6]));const L=0.12+0.9*hot;items.push({mesh:UEMIS,M:frameM(V.sub(A,V.sc(v,L*0.8)),v,[0,1,0],[0.15*(0.8+hot*0.4),L,0.15*(0.8+hot*0.4)]),tint:[1,0.55,0.2],tintAmt:1,alpha:0.55*hot,add:1,noShadow:true});
      items.push({mesh:UEMIS,M:M4.trs(A,0,0,0,0.17+0.05*hot),tint:[1,0.75,0.4],tintAmt:1,alpha:0.5*hot,add:1,noShadow:true})}}
  if(S==='boom'||S==='destr'){earthItems(items,[0,0,0],1);const k=t-EV.boom;const r=0.03+0.09*easeOut(clamp(k/1.6,0,1));
    items.push({mesh:UEMIS,M:M4.trs(V.sc(IP,1.0),0,0,0,r),tint:mix3([1,0.95,0.75],[1,0.35,0.1],clamp(k/2.5,0,1)),tintAmt:1,alpha:clamp(1.1-k/5,0.25,1),add:1,noShadow:true})}
  if(S==='panic'){earthItems(items,[0,0,0],1);const k=seg(t,EV.panic,EV.panic+0.3);qItems(items,t,cm,{x:0,y:0.12,s:0.33,d:3,pop:easeOut(k),expr:t>EV.nope?'happy':'wide'})}
  if(S==='radar'){earthItems(items,[0,0,0],1);satRing(items,t,0.16,10,-1.2,1.2);const u=lerp(-3,2.5,seg(t,EV.radar,EV.quake));apoItems(items,apPath(u),t,0.34)}
  if(S==='quake'||S==='probe'){earthItems(items,[0,0,0],1);const A0=apPath(0);let A=A0;
    if(S==='quake'){const sh=seg(t,EV.shake,EV.shake+0.2)*(1-seg(t,EV.probe-0.6,EV.probe))*(t>EV.slide?1.6:1);A=V.add(A0,[Math.sin(t*61)*0.006*sh,Math.cos(t*53)*0.006*sh,0]);
      const r=rngG(17);for(let i=0;i<34;i++){const t0=EV.shake+r()*3.4+(i%2?0.9:0);const k=t-t0;const dirn=V.norm([r()*2-1,r()*2-1,r()*2-1]);if(k<0||k>2.6)continue;const lob=dirn[0]<0?[-0.42,0,0]:[0.45,0.04,0.02];
        const base=V.add(A,V.sc(V.add(lob,V.sc(dirn,0.38)),0.36));const p=V.add(base,V.sc(dirn,0.01+k*0.025));items.push({mesh:PUFF,M:M4.trs(p,i,i,0,0.006+k*0.011),tint:[0.6,0.55,0.5],tintAmt:0.6,alpha:clamp(1-k/2.6,0,1)*0.85,noShadow:true});DUST.push(p)}}
    apoItems(items,A,t,0.36);
    if(S==='probe'){const k=ease(seg(t,EV.probe,EV.endc));const P=V.add(A0,[lerp(1.6,0.85,k),lerp(0.42,0.32,k),lerp(0.35,0.5,k)]);items.push({mesh:A_PROBE,M:M4.trs(P,0.9+t*0.05,0.25,0.15,0.16)});PROBEP=P;
      items.push({mesh:A_LED,M:M4.trs(V.add(P,[0,0.05,0.03]),0,0,0,0.006),tint:[0.4,1,0.6],tintAmt:1,noShadow:true})}}
  return items}
