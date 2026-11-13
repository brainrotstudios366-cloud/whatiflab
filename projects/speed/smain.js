// ===================== SPEED VIDEO =====================
const FPS=30,DUR=60,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildSpace();buildModels();buildPlanets();
let BUSM;{const m=new MB();bus(m,0,0,0,hx('#f2c230'));BUSM=m.build()}
let CONE;{const m=new MB();m.prism([0,0,0],0.25,1.5,2.4,28,[1,1,1],MAT.emis);CONE=m.build()}
// ---------- timeline ----------
const DURS=[];for(let i=0;i<28;i++)DURS.push(i<8?2.6:i<13?2.2:i<27?1.5:2.0);
const STEPS=[];{let t=1.2;for(const d of DURS){STEPS.push([t,d]);t+=d}}
const CAP=['Jogging 🏃','Faster than a cyclist 🚲','Faster than the city bus 🚌','Highway speed 🚗','Faster than every car 🏎️','Bullet train speed 🚄','Faster than any race car 🏁','SONIC BOOM 💥','Faster than a fighter jet ✈️','Hypersonic 🔥 The air is burning','Paris → New York in 35 min','Around the world in 2 hours 🌍','ESCAPE VELOCITY 🚀','Leaving Earth behind…','Moon in 2 hours 🌕','Moon in 70 minutes','Almost the fastest spacecraft ever 🛰️','Faster than anything humans built','Moon in 9 minutes 🌕','Around the Earth in 28 seconds','Mars in 5 days 🔴','Mars in 2.5 days','Mars in 31 hours 🔴','Sun in under 2 hours ☀️','Jupiter in under 6 hours 🪐','Saturn in under 5 hours 🪐','62% of the speed of light ⚡','FASTER THAN LIGHT 🌌'];
const TRK=['park','suburb','city','highway','coast','train','f1','desert','ocean','canyon','ice','night'];
const RE=6371;const kmh=n=>10*Math.pow(2,n-1),mps=n=>kmh(n)/3.6;
function stepAt(t){for(let i=STEPS.length-1;i>=0;i--)if(t>=STEPS[i][0])return i+1;return 0}
// ---------- runner ----------
const RC={hood:hx('#e2483a'),hood2:hx('#c43a2e'),pant:hx('#2c3a5a'),shoe:hx('#f4f4f4'),sole:hx('#e2483a'),skin:hx('#e6b394'),hair:hx('#3a2a22'),cap:hx('#1f6fd8')};
function runnerItems(base,phase,lean,yaw){const items=[];const B=M4.trs(base,yaw==null?Math.PI:yaw,lean,0,1);
  const put=(M,mesh,off,s,col,ns)=>{items.push({mesh,M:M4.mul(M,M4.trs(off,0,0,0,s)),tint:col,tintAmt:1,noShadow:!!ns})};
  const J=(M,t,rx,rz)=>M4.mul(M,M4.trs(t,0,rx||0,rz||0,1));
  const hipY=0.94,Lt=0.44,Ls=0.44;
  // pelvis + torso
  const P=J(B,[0,hipY,0],0.06);put(P,USPH,[0,0.02,0],[0.17,0.11,0.11],RC.pant);
  const Tq=J(P,[0,0.05,0],0.12);put(Tq,UCYL,[0,0.24,0],[0.165,0.44,0.115],RC.hood);put(Tq,USPH,[0,0.02,0],[0.165,0.07,0.115],RC.hood);put(Tq,USPH,[0,0.46,0],[0.2,0.09,0.12],RC.hood);
  put(Tq,USPH,[0,0.43,-0.1],[0.13,0.1,0.07],RC.hood2);put(Tq,UB,[0,0.16,0.112],[0.18,0.1,0.01],RC.hood2);for(const sx of[-1,1])put(Tq,UCYL,[sx*0.04,0.36,0.118],[0.008,0.12,0.008],[0.95,0.95,0.95],1);
  // head
  const Hd=J(Tq,[0,0.52,0],-0.12);put(Hd,UCYL,[0,0.04,0],[0.05,0.08,0.05],RC.skin);put(Hd,USPH,[0,0.17,0.01],[0.105,0.125,0.11],RC.skin);put(Hd,USPH,[0,0.23,-0.012],[0.11,0.08,0.112],RC.hair,1);
  put(Hd,USPH,[0,0.255,0.0],[0.118,0.065,0.12],RC.cap,1);put(Hd,USPH,[0,0.235,0.1],[0.085,0.012,0.08],RC.cap,1);for(const sx of[-1,1]){put(Hd,USPH,[sx*0.04,0.18,0.098],[0.014,0.018,0.01],[0.08,0.08,0.1],1);put(Hd,USPH,[sx*0.105,0.17,0],[0.02,0.03,0.025],RC.skin,1)}
  put(Hd,USPH,[0,0.15,0.11],[0.016,0.02,0.02],[0.9,0.66,0.55],1);
  // legs
  for(const sx of[-1,1]){const p=phase+(sx>0?Math.PI:0);const th=-0.78*Math.sin(p);const kn=0.25+1.15*Math.pow(Math.max(0,Math.cos(p*1+0.2)),1.5)*0.9+0.2*Math.max(0,-Math.sin(p));
    const Hp=J(P,[sx*0.095,0,0],th);put(Hp,USPH,[0,0,0],[0.09,0.09,0.09],RC.pant);put(Hp,UCYL,[0,-Lt/2,0],[0.085,Lt,0.09],RC.pant);
    const K=J(Hp,[0,-Lt,0],kn);put(K,USPH,[0,0,0],[0.075,0.075,0.075],RC.pant);put(K,UCYL,[0,-Ls/2,0],[0.068,Ls,0.07],RC.pant);
    const A=J(K,[0,-Ls,0],-kn*0.4+th*0.2);put(A,USPH,[0,-0.035,0.06],[0.065,0.05,0.135],RC.shoe);put(A,USPH,[0,-0.07,0.06],[0.066,0.02,0.136],RC.sole)}
  // arms
  for(const sx of[-1,1]){const p=phase+(sx>0?0:Math.PI);const sh=0.85*Math.sin(p);
    const S=J(Tq,[sx*0.2,0.43,0],sh,sx*0.12);put(S,USPH,[0,0,0],[0.065,0.065,0.065],RC.hood);put(S,UCYL,[0,-0.14,0],[0.058,0.28,0.058],RC.hood);
    const E=J(S,[0,-0.28,0],-1.45);put(E,USPH,[0,0,0],[0.055,0.055,0.055],RC.hood);put(E,UCYL,[0,-0.12,0],[0.05,0.24,0.05],RC.hood);put(E,USPH,[0,-0.27,0],[0.045,0.055,0.05],RC.skin)}
  return items}
function glowItems(c,g,t){if(g<=0)return[];const it=[];const f=(i)=>0.85+0.15*Math.sin(t*37+i*1.7);
  it.push({mesh:UEMIS,M:M4.trs([c[0],c[1]+1.0,c[2]+0.1],0,0,0,[0.62,1.12,0.7]),tint:[1,0.62,0.22],tintAmt:1,alpha:0.22*g,noShadow:true});
  it.push({mesh:UEMIS,M:M4.trs([c[0],c[1]+1.0,c[2]+0.5],0,0,0,[0.95,1.45,1.6]),tint:[1,0.4,0.12],tintAmt:1,alpha:0.09*g,noShadow:true});
  for(let i=0;i<7;i++){const z=0.9+i*0.55*g,s=(1-i/8)*f(i);it.push({mesh:UEMIS,M:M4.trs([c[0]+0.15*Math.sin(t*23+i),c[1]+1.0+0.12*Math.sin(t*19+i*2),c[2]+z],0,0,0,[0.45*s,0.8*s,0.6+0.3*g]),tint:i<2?[1,0.85,0.5]:[1,0.45,0.1],tintAmt:1,alpha:(0.3-i*0.035)*g,noShadow:true})}
  return it}
// ---------- dynamic objects per track ----------
function dynItems(n,tau,t){const it=[];const v=mps(n);const obj=(mesh,x,y,z0,vo,yaw,s)=>{const z=z0-(vo-v)*tau;it.push({mesh,M:M4.trs([x,y,z],yaw||0,0,0,s||1)});return z};
  if(n===2){obj(CYCLIST,4.4,0,-3.2,15/3.6,Math.PI)}
  if(n===3){obj(BUSM,3.8,0,-11,25/3.6,0);obj(SEDAN[0],9.5,0,-50,-40/3.6,Math.PI);obj(SEDAN[2],9.5,0,-120,-40/3.6,Math.PI)}
  if(n===4){const cs=[[-4,-9,79,1],[4,-3,82,3],[8,-16,77,4],[4,-30,80,0],[-4,7,81,5],[8,10,80,2]];for(const [x,z,s,c] of cs)obj(SEDAN[c],x,0,z,s/3.6,0);obj(TRUCK,8,0,-42,79/3.6,0);for(const [x,z] of[[16,-80],[20,-150],[16,-260]])obj(SEDAN[(x+z)&3],x,0,z,-90/3.6,Math.PI)}
  if(n===5){obj(SEDAN[3],4,0,-25,110/3.6,0);obj(SEDAN[1],4,0,-60,105/3.6,0);obj(SEDAN[4],0,0,-90,112/3.6,0);}
  if(n===6){obj(TRAIN,5,0.3,-2,300/3.6,0)}
  if(n===7){const cs=[[-5,-45,0],[4,-100,1],[-2,-170,2],[6,-250,3]];for(const [x,z,c] of cs)obj(F1CAR[c],x,0,z,300/3.6,0)}
  if(n===9){obj(JET,-15,7,-70,2414/3.6,0,1.1);for(let i=0;i<16;i++){const a=(tau*2.2+i/16)%1;it.push({mesh:USPH,M:M4.trs([(hsh(i,3)-0.5)*1.4*(0.4+a),0.15+a*1.4-a*a*0.9,0.4+a*7],0,0,0,0.25+a*0.55),tint:[0.95,0.98,1],tintAmt:1,alpha:0.7*(1-a),noShadow:true})}}
  if(n===8&&tau<1.4){const k=tau/1.4;
    for(let i=0;i<24;i++){const a=i/24*TAU2;const rr=1+tau*14;it.push({mesh:USPH,M:M4.trs([Math.cos(a)*rr,1+Math.sin(a)*rr*0.5,1+tau*3],0,0,0,0.5+tau*1.5),tint:[1,1,1],tintAmt:1,alpha:0.5*Math.max(0,1-tau/0.9),noShadow:true})}}
  return it}
// ---------- track render ----------
let LASTVP=null,LASTMODE='';
function renderTrack(t,n,tau,D){const L=tile(TRK[n-1]);const v=mps(n);const d=v*tau+(n*137%L.T);const o=((d%L.T)+L.T)%L.T;
  const vis=Math.min(L.env.fogD*3.5,14000);const N=Math.ceil(vis/L.T)+1;const items=[];for(let k=-2;k<=N;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o],0,0,0,1)});if(L.stat)items.push({mesh:L.stat});
  const ph=t*Math.min(9*Math.sqrt(n),30);const lean=0.12+Math.min(0.32,n*0.03);const by=0.05*Math.abs(Math.cos(ph));
  items.push(...runnerItems([0,by,0],ph,lean));items.push(...dynItems(n,tau,t));
  const g=n>=10?(n===10?0.55:n===11?0.7:0.25):0;items.push(...glowItems([0,0,0],g,t));
  const c=L.cam;const u=tau/D;const a=c.orb*(u-0.5);const ca=Math.cos(a),sa=Math.sin(a);const e=[c.eye[0]*ca+c.eye[2]*sa,c.eye[1],-c.eye[0]*sa+c.eye[2]*ca];
  const fov=0.95+Math.min(0.25,n*0.022);const VP=renderGL(L.env,{eye:e,at:c.at,fov,near:0.2,far:40000},{center:[0,0,-1],radius:8},items,t);LASTVP=VP;LASTMODE='track'}
// ---------- liftoff (13) ----------
function earthEnvS(){return{sun:[0.45,0.8,0.4],sunCol:hx('#fff6e6'),sky:[0.25,0.3,0.45],gnd:[0.02,0.02,0.05],fog:[0,0,0],fogD:1e9,zen:[0,0,0.01],hor:[0.01,0.01,0.03],stars:1,night:0,emis:1,sunSize:1.5}}
let LIFT=null;
function runnerPass(t,n,env,jb,lean,extra){const ph=t*30;const it=runnerItems(jb,ph,lean,Math.PI-1.0);if(extra)it.push(...extra);
  renderGL({sun:env.sun,sunCol:env.sunCol,sky:[0.35,0.45,0.7],gnd:[0.25,0.35,0.6],fog:[0,0,0],fogD:1e9,zen:[0,0,0],hor:[0,0,0],stars:0,emis:1},{eye:[0,0,0],at:[0,0,-1],fov:0.98,near:0.1,far:100},{center:jb,radius:4},it,t,{noClear:true,noSky:true})}
function renderLift(t,tau,D){const u=tau/D;const h=300*Math.exp(u*4.3);const dip=Math.acos(RE/(RE+h));const gam=dip+0.06+(Math.PI/2-0.32-dip-0.06)*ease(u);
  const p=[0,RE+h,0];const look=V.norm([0,-Math.sin(gam),-Math.cos(gam)]);const env=earthEnvS();const EM=M4.trs([0,0,0],1.48+38*0.004,0.6,0,1);
  const items=[{mesh:EARTH,M:EM},{mesh:EPATCH,M:EM},{mesh:CPATCH,M:EM,alpha:0.85,noShadow:true}];
  const VP=renderGL(env,{eye:p,at:V.add(p,V.sc(look,1000)),up:[0,1,0],fov:0.98,near:1,far:200000},null,items,t);LIFT={VP,h};LASTMODE='lift';
  runnerPass(t,13,env,[0.35,-1.7+0.1*Math.sin(t*1.3),-5.2],0.3)}
// ---------- deep space (14-28) ----------
function fly(t,tA,tB,R,Dfar,ox,oy){const s=(t-tA)/(tB-tA);if(s<0||s>1.2)return null;const dc=3.2*R;let d;if(s<0.85)d=Dfar*Math.exp(-s*Math.log(Dfar/dc)/0.85);else d=dc-(s-0.85)/0.15*(dc-1.7*R);return[ox*R,oy*R,-d]}
function renderDeep(t,n,tau,D){const env={sun:V.norm([0.3,0.35,0.88]),sunCol:hx('#fff4e6'),sky:[0.22,0.24,0.32],gnd:[0.02,0.02,0.04],fog:[0,0,0],fogD:1e12,zen:[0,0,0.01],hor:[0.005,0.008,0.02],stars:1,night:0,emis:1,sunSize:1};
  const items=[];const T0=STEPS[13][0];const se=i=>STEPS[i-1][0]+STEPS[i-1][1];
  let p=fly(t,T0,se(19),1737,380000,0.8,-0.25);if(p)items.push({mesh:MOONH,M:M4.trs(p,t*0.05,0.3,0,1737)});
  p=fly(t,se(19),se(23),3390,3e6,0.8,0.3);if(p)items.push({mesh:MARS,M:M4.trs(p,t*0.2,0.4,0,3390)});
  p=fly(t,se(23),se(25),69911,6e7,0.9,-0.2);if(p)items.push({mesh:JUP,M:M4.trs(p,t*0.15,0.1,0,69911)});
  p=fly(t,se(25),se(26),58232,4e7,1.1,0.25);if(p){items.push({mesh:SAT,M:M4.trs(p,t*0.15,0.45,0,58232)});items.push({mesh:SATRING,M:M4.trs(p,0.3,0.45,0.2,58232),alpha:0.9,noShadow:true})}
  if(n===24){for(let i=0;i<46;i++){const z=-30000+((tau*26000+hsh(i,1)*30000)%30000);const x=(hsh(i,2)-0.5)*9000,y=(hsh(i,3)-0.5)*6000;if(Math.abs(x)<400&&Math.abs(y)<400)continue;items.push({mesh:ROCK[i%4],M:M4.trs([x,y,z],t*hsh(i,4),t*hsh(i,5),0,40+hsh(i,6)*260)})}}
  
  const VP=items.length?renderGL(env,{eye:[0,0,0],at:[0,0,-1],fov:1.0,near:20,far:1e8},null,items,t):renderGL(env,{eye:[0,0,0],at:[0,0,-1],fov:1.0,near:20,far:1e8},null,[],t);LASTVP=VP;LASTMODE='deep';
  runnerPass(t,n,env,[-0.55,-1.95+0.1*Math.sin(t*1.3),-6.6],0.35)}
// ---------- scene dispatcher ----------
function renderScene(t){LIFT=null;
  if(t<1.2||t>=59.45){renderTrack(t,8,t<1.2?t:0,2.6);return}
  const n=stepAt(t);const[ts,D]=STEPS[n-1];const tau=Math.min(t-ts,D);
  if(n<=12)renderTrack(t,n,tau,D);else if(n===13)renderLift(t,tau,D);else renderDeep(t,n,tau,D)}
function shakeAmt(t){if(t<1.2)return t<0.5?22*(1-t/0.5):3;const n=stepAt(t);if(n<1||t>=56)return 0;const k=t-STEPS[n-1][0];let a=n>=6?Math.min(9,(n-5)*1.2):0;if(n===8&&k<0.6)a+=30*(1-k/0.6);if(k<0.12)a+=4+n*0.4;return a}
// ---------- overlays ----------
function speedLines(t,n,vp,strength,col){if(strength<=0)return;const r=rngG(Math.floor(t*60));ctx.save();ctx.lineCap='round';
  for(let i=0;i<Math.floor(40+strength*90);i++){const a=r()*TAU2;const r0=260+r()*700,len=(120+r()*500)*strength;const x0=vp[0]+Math.cos(a)*r0,y0=vp[1]+Math.sin(a)*r0;ctx.strokeStyle=`rgba(${col||'255,255,255'},${(0.12+r()*0.4)*Math.min(1,strength)})`;ctx.lineWidth=1.5+r()*3.5;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+Math.cos(a)*len,y0+Math.sin(a)*len);ctx.stroke()}ctx.restore()}
function drawHUD(t){const n=stepAt(t);if(n<1||t>=56)return;const[ts,D]=STEPS[n-1];const k=t-ts;const pop=k<0.15?0.6+0.4*easeOut(k/0.15)+Math.sin(k/0.15*Math.PI)*0.15:1;
  const mult='×'+Math.pow(2,n-1).toLocaleString('en-US');const sp=Math.round(kmh(n)).toLocaleString('en-US')+' km/h';
  ctx.save();ctx.translate(W/2,250);ctx.scale(pop,pop);txt(mult,0,0,fitSize(mult,900,92),'#ffd84a');ctx.restore();ctx.save();ctx.translate(W/2,368);ctx.scale(pop,pop);txt(sp,0,0,fitSize(sp,980,112),n>=13?'#8fe0ff':(n===8?'#ffb070':'#ffffff'));ctx.restore();
  const s=CAP[n-1];if(s&&k>0.1){const size=fitSize(s,920,58);const al=Math.min(1,(k-0.1)/0.12,(D-k)/0.1);ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,522);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=n===8||n===13||n===28?'rgba(200,40,40,0.75)':'rgba(15,10,30,0.62)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function drawTitle(t){const a=t<2.9?1:clamp((3.2-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,t<1.2?560:1480);ctx.scale(pop,pop);
  const l1='Every second your',l2='speed DOUBLES';const s=Math.min(fitSize(l1,980,96),fitSize(l2,980,104));ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffffff');txt(l2,0,s*0.6,s*1.08,'#ffd84a');ctx.restore()}
function drawEnd(t){const k=ease((t-56)/0.5)*clamp((59.45-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.72*k})`;ctx.fillRect(0,0,W,H);const pop=t-56<0.5?0.7+0.3*ease((t-56.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);
  txt('At which speed',0,-100,92,'#ffd84a');txt('would YOU stop?',0,10,92,'#ffd84a');txt('👇',0,190+Math.abs(Math.sin((t-56)*5))*26,120,'#fff','center',900,false);ctx.restore();ctx.save();ctx.globalAlpha=k*ease((t-56.6)/0.4);txt('What should double next?',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const n=t<1.2||t>=59.45?8:stepAt(t);const tau=t<1.2?t:(t>=59.45?0:t-STEPS[n-1][0]);
  if(LIFT){const h=LIFT.h,d=RE+h,dip=Math.acos(RE/d),L=Math.sqrt(d*d-RE*RE);const hp=project(LIFT.VP,[0,d-Math.sin(dip)*L,-Math.cos(dip)*L]);if(hp&&h<4000){const y=hp[1],th=60+Math.min(200,h*0.25);const g=ctx.createLinearGradient(0,y-th*0.7,0,y+th*0.8);g.addColorStop(0,'rgba(110,170,255,0)');g.addColorStop(0.33,'rgba(150,200,255,0.85)');g.addColorStop(0.45,'rgba(200,230,255,0.55)');g.addColorStop(1,'rgba(160,200,255,0)');ctx.fillStyle=g;ctx.fillRect(0,y-th*0.7,W,th*1.5)}
    const pc=project(LIFT.VP,[0,0,0]);if(pc&&h>2500){const fpx=H/2/Math.tan(0.49);const rpx=fpx*Math.tan(Math.asin(RE/d));const g=ctx.createRadialGradient(pc[0],pc[1],rpx*0.985,pc[0],pc[1],rpx*1.07);g.addColorStop(0,'rgba(120,180,255,0)');g.addColorStop(0.15,'rgba(120,180,255,0.7)');g.addColorStop(1,'rgba(120,180,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
  if(LASTMODE==='track'&&LASTVP){const vp=project(LASTVP,[0,1.0,-3000])||[W/2,H*0.45];speedLines(t,n,vp,n<4?0:Math.min(1.3,(n-3)*0.18),n>=10?'255,210,160':'255,255,255');
    if(n>=10){const g=ctx.createRadialGradient(W/2,H*0.55,H*0.2,W/2,H*0.55,H*0.75);g.addColorStop(0,'rgba(255,120,30,0)');g.addColorStop(1,`rgba(255,90,20,${0.12+0.08*(n-10)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
  if(LASTMODE==='lift'||LASTMODE==='deep'){const s=n===13?0.3:Math.min(1.6,0.2+(n-14)*0.1);speedLines(t,n,[W/2,H*0.47],s,n>=26?'170,210,255':'255,255,255')}
  if(n===28&&t<56){const k=tau/2;ctx.fillStyle=`rgba(20,30,90,${0.35*k})`;ctx.fillRect(0,0,W,H);const r=rngG(Math.floor(t*60)+7);ctx.save();ctx.lineCap='round';for(let i=0;i<260;i++){const a=r()*TAU2,r0=60+r()*900*(1-k*0.5),len=300+r()*1400*k;ctx.strokeStyle=`rgba(${r()<0.5?'200,230,255':'255,255,255'},${0.3+r()*0.6})`;ctx.lineWidth=2+r()*5;ctx.beginPath();ctx.moveTo(W/2+Math.cos(a)*r0,H*0.47+Math.sin(a)*r0);ctx.lineTo(W/2+Math.cos(a)*(r0+len),H*0.47+Math.sin(a)*(r0+len));ctx.stroke()}ctx.restore();
    const g=ctx.createRadialGradient(W/2,H*0.47,0,W/2,H*0.47,300+900*k);g.addColorStop(0,`rgba(255,255,255,${0.9*k})`);g.addColorStop(1,'rgba(160,200,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);if(tau>1.55){ctx.fillStyle=`rgba(255,255,255,${clamp((tau-1.55)/0.3,0,1)})`;ctx.fillRect(0,0,W,H)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<28;i++)flash(STEPS[i][0],0.3,0.12);flash(STEPS[7][0],0.85,0.35);flash(0,0.85,0.35);flash(STEPS[12][0],0.6,0.3,'255,200,150');flash(STEPS[13][0],0.5,0.25);flash(56,0.9,0.5);
  if(t>=1.2)drawHUD(t);if(t<3.2)drawTitle(t);drawEnd(t);{const k=59.45-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();overlays(t0+(SUB-1)/(2*FPS*SUB))}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.imageSmoothingQuality='high';ctx.drawImage(bc,0,0,W,H);ctx.restore()}
window.frame=frame;window.NFR=DUR*FPS;
