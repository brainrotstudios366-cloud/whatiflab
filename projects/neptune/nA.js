// ================= NEPTUNE: timeline, scenes, camera =================
const EV={fly:5.85,close:10.53,dive:18.68,cut:20.65,meth:26.1,split:30.61,form:31.99,gem:35.4,sink:36.83,layer:40.8,lab:46.08,fire:52.6,giant:56.7,galaxy:60.64,endc:69.73,loop:75.19};
const R=10;
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.fly)return'rain';if(t<EV.dive+1.9)return t<EV.dive?'space':'dive';if(t<EV.meth)return'cut';if(t<EV.sink)return'deep';if(t<EV.lab)return'sink';if(t<EV.giant)return'lab';if(t<EV.galaxy)return'giant';return'galaxy'}
const CLOUDSHELL=um(m=>sph(m,1,90,180,()=>[0.95,0.98,1],0,c=>{const lat=Math.asin(clamp(c[1],-1,1)),lon=Math.atan2(c[2],c[0]);const st=fbm(lon*3.3+lat*0.6+9,lat*38,3);const band=Math.exp(-Math.pow((Math.abs(lat)-0.4)/0.1,2))+0.5*Math.exp(-Math.pow((lat-0.15)/0.05,2));return !(st>0.6&&band>0.4)}),0.3);
// ---------- env ----------
function envBase(){return{sun:[0.85,0.25,-0.45],sunCol:hx('#fff4e4'),sky:hx('#3a6ad0'),gnd:hx('#050816'),fog:hx('#000004'),fogD:1e7,zen:hx('#000004'),hor:hx('#04061a'),stars:1,night:0,emis:1.0,ground:0,sunSize:0.6,fillD:[-0.6,0.2,0.6],fillC:[0.02,0.03,0.07]}}
const E_SPACE=envBase();
const E_RAIN=Object.assign(envBase(),{sun:[0.2,1,0.15],sunCol:hx('#d8ecff'),sky:hx('#5aa0ff'),gnd:hx('#0a1a50'),fog:hx('#0b2a72'),fogD:38,zen:hx('#03103a'),hor:hx('#1a56b8'),stars:0,sunSize:3,fillC:[0.1,0.2,0.45],fillD:[0,-1,0.3]});
const E_DEEP=Object.assign(envBase(),{sun:[-0.4,0.8,-0.5],sunCol:hx('#fff0e0'),sky:hx('#9a7a80'),gnd:hx('#3a1a10'),fog:hx('#2a1208'),fogD:80,zen:hx('#0a0310'),hor:hx('#5a1e10'),stars:0,sunSize:3,fillC:[0.5,0.3,0.15],fillD:[0.6,-0.2,-0.8]});
const E_LAB=Object.assign(envBase(),{sun:[0.3,0.9,-0.4],sunCol:hx('#dfe8ff'),sky:hx('#6a7aa0'),gnd:hx('#1a1e2a'),fog:hx('#070a14'),fogD:60,zen:hx('#05070e'),hor:hx('#0e1424'),stars:0,sunSize:3,fillC:[0.15,0.35,0.5],fillD:[-0.5,0.2,-1]});
function envAt(t){const S=scn(t);if(S==='rain')return E_RAIN;if(S==='deep')return E_DEEP;if(S==='lab')return E_LAB;if(S==='giant')return Object.assign({},E_RAIN,{fogD:200,zen:hx('#02041a'),hor:hx('#0a2470')});return E_SPACE}
// ---------- camera ----------
function camAt(t){const S=scn(t);
  if(S==='rain'){const k=t/EV.fly;return{eye:[0,1.0-k*1.2,-2],at:[0.2,-0.6-k*0.8,10],fov:0.95}}
  if(S==='space'&&t<EV.close){const k=ease(seg(t,EV.fly,EV.close));return{eye:lerp3([-8,10,-140],[-14,4,-42],k),at:lerp3([0,0,0],[0,0.5,0],k),fov:0.75}}
  if(S==='space'){const k=ease(seg(t,EV.close,EV.dive));const a=-1.9+k*0.9;const d=lerp(36,25,k);return{eye:[Math.cos(a)*d,lerp(4.5,2.6,k),Math.sin(a)*d],at:[0,lerp(0.5,-0.5,k),0],fov:0.85}}
  if(S==='dive'){const k=easeIn2(seg(t,EV.dive,EV.dive+1.9));const a=-1.0;const d=lerp(25,10.3,k);return{eye:[Math.cos(a)*d,2.6-k*2.2,Math.sin(a)*d],at:[0,-0.5,0],fov:0.85+k*0.3}}
  if(S==='cut'||S==='sink'){const t0=S==='cut'?EV.cut:EV.sink,t1=S==='cut'?EV.meth:EV.lab;const k=ease(seg(t,t0,t1));const d=S==='cut'?lerp(46,38,k):lerp(40,27,k);const dir=V.norm(S==='cut'?[1,0.5,0.42]:[1,0.45,0.5]);const tgt=S==='sink'?[R*0.12*k,R*0.05,R*0.12*k]:[0,0,0];return{eye:V.add(tgt,V.sc(dir,d)),at:tgt,fov:0.8}}
  if(S==='deep'){const k=seg(t,EV.meth,EV.sink);const a=k*1.2;return{eye:[Math.sin(a)*7,1.2+Math.sin(k*3)*0.4,-Math.cos(a)*7],at:[0,0,0],fov:0.8}}
  if(S==='lab'){const k=ease(seg(t,EV.lab,EV.giant));return{eye:lerp3([-5.5,3.2,-6.5],[1.8,2.0,-3.2],k),at:lerp3([0,1.4,0],[1.6,1.4,0],k),fov:0.85}}
  if(S==='giant'){const k=seg(t,EV.giant,EV.galaxy);return{eye:[Math.sin(k)*1.5,0.8,-9+k*1.5],at:[0,0,0],fov:0.8}}
  const k=ease(seg(t,EV.galaxy,EV.endc+3));return{eye:[0,lerp(16,36,k),lerp(-20,-30,k)],at:[0,0,lerp(-2,1,k)],fov:0.85}}
function easeIn2(x){x=clamp(x,0,1);return x*x}
// ---------- mascot Q ----------
let QR=null;
function camBasis(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function qItems(items,t,cm,o){const b=camBasis(cm);const d=o.d||3;const tanH=Math.tan(cm.fov/2)*d,tanW=tanH*W/H;const bob=Math.sin(t*2.2)*0.04;
  const p=V.add(cm.eye,V.add(V.sc(b.f,d),V.add(V.sc(b.r,-o.x*tanW),V.sc(b.u,o.y*tanH+bob))));const s=(o.s||0.16)*d/3*(o.pop==null?1:o.pop);if(s<=0.001)return;
  const toC=V.sc(b.f,-1);const rx=V.norm(V.cross([0,1,0],toC)),ry=V.cross(toC,rx);const tilt=Math.sin(t*1.7)*0.12;
  const rot=(v)=>V.add(V.add(V.sc(rx,v[0]),V.sc(ry,v[1])),V.sc(toC,v[2]));const Mx=(lp,sc)=>{const c=V.add(p,V.sc(rot(lp),s));const X=V.sc(rx,s*sc[0]),Y=V.sc(ry,s*sc[1]),Z=V.sc(toC,s*sc[2]);return[X[0],X[1],X[2],0,Y[0],Y[1],Y[2],0,Z[0],Z[1],Z[2],0,c[0],c[1],c[2],1]};
  items.push({mesh:QBODY,M:Mx([0,0,0],[1,1,1])});
  // rings
  const cols=[[0.35,0.95,1],[1,0.85,0.3],[1,0.4,0.6]];for(let i=0;i<3;i++){const a=t*1.4+i*TAU2/3;const ax=V.norm([Math.cos(i*2.1),0.6,Math.sin(i*2.1)]);
    const R0=1.75;const M0=M4.mul(M4.trs([0,0,0],a,i*1.05+0.4,0.3*i,R0),M4.id());const base=[R0,0,0,0,0,R0,0,0,0,0,R0,0,0,0,0,1];
    const L=M4.trs([0,0,0],a+i,0.9+i*0.5,i*0.8,R0);const W2=[rx[0]*s,rx[1]*s,rx[2]*s,0,ry[0]*s,ry[1]*s,ry[2]*s,0,toC[0]*s,toC[1]*s,toC[2]*s,0,p[0],p[1],p[2],1];items.push({mesh:TORUS,M:M4.mul(W2,L),tint:cols[i],tintAmt:1})}
  const ex=o.expr||'open';const blink=(t%3.1)<0.12;
  for(const sx of[-1,1]){if(ex==='happy'){items.push({mesh:QDARK,M:Mx([sx*0.36,0.22,0.9],[0.2,0.06,0.06])})}else{const big=ex==='wide'?1.25:1;items.push({mesh:QWHITE,M:Mx([sx*0.36,0.2,0.84],[0.27*big,blink?0.04:0.32*big,0.18])});if(!blink){items.push({mesh:QDARK,M:Mx([sx*0.34,0.17,0.99],[0.13*big,0.16*big,0.06])});items.push({mesh:QWHITE,M:Mx([sx*0.3,0.24,1.04],[0.045,0.045,0.03])})}}}
  if(ex==='wide'||ex==='o')items.push({mesh:QDARK,M:Mx([0,-0.32,0.93],[0.14,0.17,0.06])});else items.push({mesh:QMOUTH,M:Mx([0,-0.25,0.94],[1,1,1])});
  QR={p,s}}
// ---------- items ----------
const RAIN=[];{const r=rngG(3);for(let i=0;i<70;i++)RAIN.push({x:(r()-0.5)*9,z:2+r()*20,y0:r()*14,v:1.2+r()*1.4,s:0.12+r()*0.22,rs:(r()-0.5)*4,ph:r()*6})}
const CL=[];{const r=rngG(4);for(let i=0;i<26;i++)CL.push({x:(r()-0.5)*40,y:-2-r()*12,z:10+r()*30,s:2+r()*4,v:0.2+r()*0.4})}
function rainPos(d,t){const span=14;const y=6-(((d.y0+t*d.v)%span)+span)%span;return[d.x,y,d.z]}
let GLINTS=[];
function addDiamond(items,p,s,t,rs,ph,glow){items.push({mesh:DIAMOND,M:M4.trs(p,t*rs+ph,0.5+Math.sin(t+ph)*0.3,0.2,s),noShadow:true});GLINTS.push([p,s,ph])}
function planetItems(items,t,cut){const rot=t*0.05;const M=M4.trs([0,0,0],rot+(cut?-rot-0.0:0),0,0,R);
  if(cut){items.push({mesh:NEPCUT,M:M4.trs([0,0,0],0,0,0,R)});items.push({mesh:WEDGE,M:M4.trs([0,0,0],0,0,0,R)})}
  else{items.push({mesh:NEPTUNE,M});items.push({mesh:RINGN,M:M4.trs([0,0,0],0,0.42,0.12,R),alpha:0.35,noShadow:true})}}
function fgItems(t){const items=[];GLINTS=[];const S=scn(t);const cm=camAt(t);QR=null;
  if(S==='rain'){for(const c of CL){items.push({mesh:CLOUDP,M:M4.trs([c.x+t*c.v,c.y,c.z],0,0,0,c.s),tint:hx('#3a6ad0'),tintAmt:0.7,noShadow:true})}
    for(const d of RAIN)addDiamond(items,rainPos(d,t),d.s,t,d.rs,d.ph,true);
    qItems(items,t,cm,{x:-0.62,y:-0.6,s:0.15,expr:'wide',pop:ease(seg(t,1.3,1.7))})}
  else if(S==='space'||S==='dive'){items.push({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});planetItems(items,t,false);
    if(S==='space'&&t>=EV.close+0.5&&t<EV.dive-0.3)qItems(items,t,cm,{x:-0.62,y:-0.6,s:0.13,expr:'o',pop:ease(seg(t,EV.close+0.5,EV.close+0.9))})}
  else if(S==='cut'||S==='sink'){items.push({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});planetItems(items,t,true);
    if(S==='sink'){const r=rngG(11);const dirs=[];for(let i=0;i<46;i++){const face=i%2,ang=(r()-0.5)*Math.PI*0.95,ph=r(),sp=0.06+r()*0.05;let rr=0.8-((ph+(t-EV.sink)*sp)%0.5);const k=clamp(rr,0.33,0.8);const off=0.012;
        const p=face===0?[off*R,Math.sin(ang)*k*R,Math.cos(ang)*k*R]:[Math.cos(ang)*k*R,Math.sin(ang)*k*R,off*R];if(Math.cos(ang)<0.05)continue;addDiamond(items,p,0.22+r()*0.15,t,2,i,false)}
      const lay=seg(t,EV.layer,EV.lab-0.5);if(lay>0){for(const face of[0,1]){const n=40;for(let j=0;j<n;j++){const a=-Math.PI/2+j/n*Math.PI;const rr=0.31+lay*0.035*hsh(j,face);const p=face===0?[0.013*R,Math.sin(a)*rr*R,Math.cos(a)*rr*R]:[Math.cos(a)*rr*R,Math.sin(a)*rr*R,0.013*R];if(Math.cos(a)<0.02)continue;items.push({mesh:DIAMOND,M:M4.trs(p,j,0.3,0,0.18*lay+0.02),noShadow:true});GLINTS.push([p,0.12,j])}}}}
    if(S==='cut'&&t>EV.cut+1)qItems(items,t,cm,{x:0.6,y:-0.6,s:0.13,expr:'open',pop:ease(seg(t,EV.cut+1,EV.cut+1.4))})}
  else if(S==='deep'){deepItems(items,t,cm)}
  else if(S==='lab'){labItems(items,t)}
  else if(S==='giant'){const k=ease(seg(t,EV.giant,EV.giant+0.8));addDiamond(items,[0,0,0],3.2*k+0.01,t*0.4,1,0,false);for(const d of RAIN.slice(0,40))addDiamond(items,V.add(rainPos(d,t),[0,0,6]),d.s,t,d.rs,d.ph,false);
    for(const c of CL){items.push({mesh:CLOUDP,M:M4.trs([c.x*0.6+t*c.v,c.y*0.5+3,c.z+6],0,0,0,c.s),tint:hx('#2a5ab0'),tintAmt:0.7,noShadow:true})}
    qItems(items,t,cm,{x:0.6,y:-0.6,s:0.14,expr:'wide',pop:ease(seg(t,EV.giant+0.6,EV.giant+1.0))})}
  else{items.push({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
    if(t>=EV.endc)qItems(items,t,cm,{x:0,y:-0.36,s:0.16,expr:'happy',pop:ease(seg(t,EV.endc+0.3,EV.endc+0.8))})}
  return items}
// methane & diamond formation
const HDIR=[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]].map(V.norm);
const LAT=[];{for(let i=0;i<14;i++){const a=i/14*TAU2*2.3,y=(i%3-1)*0.7;LAT.push([Math.cos(a)*(0.9+0.2*(i%2)),y,Math.sin(a)*(0.9+0.2*(i%2))])}}
function deepItems(items,t,cm){const lt=t-EV.meth;const sq=t<EV.split?1-0.12*seg(t,EV.meth+0.5,EV.split)*(0.6+0.4*Math.sin(t*30)):1;
  // background hot particles
  
  if(t<EV.form){const ox=0;// methane molecule
    const C0=[ox,0,0];const sp=t<EV.split?1:1+(t-EV.split)*6;items.push({mesh:ATOM,M:M4.trs(C0,0,0,0,0.75*sq),tint:hx('#7a8090'),tintAmt:1});
    HDIR.forEach((d,i)=>{const hp=V.add(C0,V.sc(d,1.55*sq*sp));const a=t<EV.split?1:clamp(1-(t-EV.split)*0.8,0,1);if(a<=0)return;items.push({mesh:ATOM,M:M4.trs(hp,0,0,0,0.45*sq),tint:[1,1,1],tintAmt:1});
      if(t<EV.split){const bl=1.55*sq;const dirn=d;const up=[0,1,0];const ax=V.norm(V.cross(up,dirn));const ang=Math.acos(clamp(V.dot(up,dirn),-1,1));// stick along d
        const M=stickM(C0,hp);items.push({mesh:STICK,M})}});
    if(t>=EV.split){for(let i=0;i<7;i++){const k=seg(t,EV.split+0.3+i*0.15,EV.split+0.9+i*0.15);const from=V.sc(V.norm([Math.cos(i*0.9),Math.sin(i*1.7)*0.5,Math.sin(i*0.9)]),14);const to=V.sc(LAT[i],1.6);const p=lerp3(from,to,ease(k));if(k>0)items.push({mesh:ATOM,M:M4.trs(p,0,0,0,0.5),tint:hx('#7a8090'),tintAmt:1})}}}
  else{const k=seg(t,EV.form,EV.gem);const shrink=1-0.55*ease(k);if(t<EV.gem){LAT.forEach((q,i)=>{const p=V.sc(q,1.6*shrink);items.push({mesh:ATOM,M:M4.trs(p,0,0,0,0.5*shrink+0.05),tint:mix3(hx('#7a8090'),[0.8,0.95,1],k),tintAmt:1});const j=(i+1)%LAT.length;if(i%2===0)items.push({mesh:STICK,M:stickM(p,V.sc(LAT[j],1.6*shrink),0.7)})})}
    else{const g=ease(seg(t,EV.gem,EV.gem+0.4));addDiamond(items,[0,0,0],1.9*g+0.01,t*0.7,1,0,false);}
    if(t>=EV.gem+0.3)qItems(items,t,cm,{x:0.62,y:-0.6,s:0.14,expr:'happy',pop:ease(seg(t,EV.gem+0.3,EV.gem+0.7))})}}
function stickM(a,b,w){const d=V.sub(b,a),L=V.len(d);const y=V.norm(d);const tmp=Math.abs(y[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(tmp,y)),z=V.cross(x,y);const s=w||1;return[x[0]*s,x[1]*s,x[2]*s,0,y[0]*L,y[1]*L,y[2]*L,0,z[0]*s,z[1]*s,z[2]*s,0,a[0],a[1],a[2],1]}
function labItems(items,t){items.push({mesh:UB,M:M4.trs([0,-0.05,0],0,0,0,[40,0.1,40]),tint:hx('#1a1e26'),tintAmt:1});items.push({mesh:UB,M:M4.trs([0,6,8],0,0,0,[40,12,0.2]),tint:hx('#1c2232'),tintAmt:1});
  for(let i=-3;i<=3;i++){items.push({mesh:EBOX,M:M4.trs([i*3.2,4.6,7.85],0,0,0,[2.6,0.08,0.05]),tint:[0.55,0.85,1],tintAmt:1});items.push({mesh:UB,M:M4.trs([i*3.2,2.4,7.85],0,0,0,[2.4,3.2,0.1]),tint:hx('#262d40'),tintAmt:1})}
  for(const[x,w]of[[-3.2,1.8],[3.2,1.8]]){items.push({mesh:EBOX,M:M4.trs([x,2.6,7.78],0,0,0,[w,1.1,0.02]),tint:hx('#0a2a40'),tintAmt:1});for(let k=0;k<5;k++)items.push({mesh:EBOX,M:M4.trs([x-0.6+k*0.3,2.3+0.25*hsh(k,x>0?1:2)+0.12*Math.sin(t*3+k),7.76],0,0,0,[0.16,0.25+0.5*hsh(k,x>0?3:4)+0.1*Math.sin(t*2.3+k*1.7),0.02]),tint:k%2?[0.35,1,0.6]:[0.35,0.85,1],tintAmt:1})}
  items.push({mesh:EBOX,M:M4.trs([0,0.02,0],0,0,0,[7,0.02,0.05]),tint:[0.3,0.8,1],tintAmt:1});
  items.push({mesh:LABTABLE,M:M4.trs([0,0,0],0,0,0,1)});items.push({mesh:LASER,M:M4.trs([-1.6,1.33,0],0,0,0,1)});items.push({mesh:SAMPLE,M:M4.trs([2.2,1.42,0],0,0,0,1)});
  // vacuum chamber ring around sample
  items.push({mesh:TORUS,M:M4.trs([2.2,1.42,0],0,0,Math.PI/2,0.75),tint:[0.4,0.5,0.6],tintAmt:1});
  const f=t-EV.fire;if(f>-0.4&&f<1.2){const len=clamp((f+0.4)/0.25,0,1)*2.95;const a=f<0.8?1:clamp((1.2-f)/0.4,0,1);items.push({mesh:BEAM,M:M4.mul(M4.trs([-0.45,1.33,0],0,0,0,1),[len,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),tint:[0.4,1,0.5],tintAmt:1,alpha:a,add:1,noShadow:true});items.push({mesh:BEAM,M:M4.mul(M4.trs([-0.45,1.33,0],0,0,0,1),[len,0,0,0,0,3,0,0,0,0,3,0,0,0,0,1]),tint:[0.3,1,0.4],tintAmt:1,alpha:0.25*a,add:1,noShadow:true})}
  if(f>0.15){for(let i=0;i<16;i++){const k=clamp((f-0.15)*0.6,0,1);const a=i/16*TAU2;const d=0.2+k*(0.6+hsh(i,2)*0.6);const p=[2.0-k*0.4,1.42+Math.sin(a)*d,Math.cos(a)*d];addDiamond(items,p,0.06*(1-k*0.3),t,3,i,true)}}}
