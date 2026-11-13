
// ===================== JUMP VIDEO (WebGL) =====================
const FPS=30,DUR=60,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
function glow2(x,y,r,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}
initGL();initAssets();buildSpace();
const JUMPS=[[1.2,1.1],[2.3,1.1],[3.4,1.2],[4.6,1.3],[5.9,1.5],[7.4,1.6],[9.0,2.0],[11.0,2.0],[13.0,2.2],[15.2,2.4],[17.6,2.4],[20.0,2.4],[22.4,2.4],[24.8,2.4],[27.2,2.4],[29.6,2.6],[32.2,2.4],[34.6,2.4],[37.0,3.0],[40.0,2.6],[42.6,2.8],[45.4,1.2],[46.6,1.2],[47.8,1.2],[49.0,7.0]];
const CMP=['Normal jump 🧍','Over the fence','Over a car 🚗','Over a bus 🚌','Onto a house roof 🏠','Higher than the trees 🌳','A 10-story building 🏢','Higher than the lighthouse','Higher than the skyscrapers 🏙️','Almost the Eiffel Tower 🗼','Higher than the Empire State Building','Higher than the Burj Khalifa','Inside the clouds ☁️','Above the clouds','Almost Mount Everest 🏔️','Higher than airplanes ✈️','The sky turns dark…','Higher than any balloon ever 🎈','You just reached SPACE 🚀','Low Earth orbit','Higher than the ISS 🛰️','Earth is getting smaller…','','','Faster than escape velocity…'];
const LOCN=['yard','yard','suburb','city','suburb','park','city','beach','downtown','paris','ny','desert','islands','mount','himalaya','plane'];
const ORIG=[[0,0,1],[0,0,-1.2],[-6.6,0,-4],[-7.6,0,-6],[10.5,0,-8],[3,0,0],[10.5,0,-10],[4,1.4,30],[0,0,8],[70,0,330],[0,0,300],[120,0,700],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
const TRAVEL=[[0,0,0],[0,0,-6],[6.6,0,0],[8.2,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
const ALT_DRAW=[0,0,0,0,0,0,0,0,0,0,0,0,2050,4096,8192,4000];
function jh(n){return 0.5*Math.pow(2,n-1)}
function jumpAt(t){for(let i=JUMPS.length-1;i>=0;i--)if(t>=JUMPS[i][0])return i+1;return 0}
function fmtH(h){if(h<10)return h.toFixed(1).replace('.0','')+' m';if(h<100000)return Math.round(h).toLocaleString('en-US')+' m';return Math.round(h/1000).toLocaleString('en-US')+' km'}
// ---------- impact effects ----------
function impactItems(c,k,n,scale){const it=[];if(k<0)return it;const s=scale||1;const R=(1.5+n*0.9)*s;const ring=R*easeOut(k/0.6)*1.6;
  for(let i=0;i<22;i++){const a=i/22*6.283;const rr_=ring*(0.8+0.3*Math.sin(i*2.7));it.push({mesh:USPH,M:M4.trs([c[0]+Math.cos(a)*rr_,c[1]+0.3*s+k*1.2*s,c[2]+Math.sin(a)*rr_],0,0,0,(0.4+n*0.12)*s*(0.6+k)),tint:[0.85,0.8,0.72],tintAmt:1,alpha:Math.max(0,0.85*(1-k/1.4))})}
  for(let i=0;i<10;i++){const a=hsh(i,n)*6.283,sp=(3+hsh(i,n+1)*5)*s;const y=c[1]+(6*s)*k-4.9*k*k*s;if(y<c[1])continue;it.push({mesh:UB,M:M4.trs([c[0]+Math.cos(a)*sp*k,y,c[2]+Math.sin(a)*sp*k],k*5,k*3,0,0.25*s*(0.5+n*0.05)),tint:[0.45,0.4,0.35],tintAmt:1})}
  return it}
function craterItems(c,n,s){if(n<5)return[];const r=0.5*Math.pow(n-4,1.5)*(s||1);return[{mesh:UCYL,M:M4.trs([c[0],c[1]-0.02,c[2]],0,0,0,[r*1.3,0.08,r*1.3]),tint:[0.55,0.52,0.48],tintAmt:1,noShadow:true},{mesh:UCYL,M:M4.trs([c[0],c[1]+0.0,c[2]],0,0,0,[r,0.1,r]),tint:[0.22,0.2,0.19],tintAmt:1,noShadow:true}]}
// ---------- jump state ----------
function jstate(t,n){const[ts,D]=JUMPS[n-1];const tau=t-ts;const h=jh(n);let y=0,cr=0,arms=0,u=0;
  if(tau<0.18){cr=tau/0.18}else if(tau<D-0.25){u=(tau-0.18)/(D-0.43);y=h*4*u*(1-u);cr=Math.max(0,1-(tau-0.18)/0.12);arms=Math.min(1,(tau-0.18)/0.15)*(1-Math.max(0,(u-0.75)/0.25))}else{u=1;const k=(tau-(D-0.25))/0.25;cr=Math.sin(k*Math.PI)*0.9}
  return{tau,D,h,y,cr,arms,u}}
// ---------- scene renderers ----------
function renderGround(t,n){const L=build(LOCN[n-1]);const s=jstate(t,n);const o=ORIG[n-1],tr=TRAVEL[n-1];const fu=clamp(s.u,0,1);const base=[o[0]+tr[0]*fu,o[1]+s.y,o[2]+tr[2]*fu];
  const big=n>=5;const R=n<=4?4.6:(n<=6?7:13);const a0=[0.6,-0.5,0.9,0.8,-0.9,0.5,-1.0,0.7][n-1];const a=a0+0.12*s.tau;const fy=n<=4?0.6:(n<=6?0.75:0.9);
  const ctr=[o[0]+tr[0]*0.5,o[1],o[2]+tr[2]*0.5];const eye=[ctr[0]+Math.sin(a)*R,o[1]+1.5+s.y*fy,ctr[2]+Math.cos(a)*R];const at=[base[0],base[1]+0.9,base[2]];
  const items=[{mesh:L.mesh}];if(n>=5){const landed=s.tau>=s.D-0.25;items.push(...craterItems(o,landed?n:n-1))}
  items.push(...jumperItems(base,Math.atan2(eye[0]-base[0],eye[2]-base[2])+0.5,s.cr,s.arms,0));
  const k=s.tau-(s.D-0.25);if(k>0)items.push(...impactItems([base[0],o[1],base[2]],k,n,1));
  const fov=n<=4?0.9:0.98;renderGL(L.env,{eye,at,fov,near:0.2,far:3000},{center:[base[0],o[1],base[2]],radius:big?Math.max(20,s.y*1.2+15):16},items,t)}
function apexCam(J,h,n){if(n===10||n===12)return{eye:[J[0]+2.5,J[1]+1.0,J[2]+6.0],at:[J[0]-1.2,J[1]-1.6,J[2]-10]};if(n>=13&&n<=15){const k=h>3000?1.4:1;const dy=n===15?-4:-7;return{eye:[J[0]+2.2*k,J[1]+3.0*k,J[2]+5.5*k],at:[J[0]-4*k,J[1]+dy*k,J[2]-16*k]}}const k=h>3000?1.4:1;return{eye:[J[0]+2.2*k,J[1]+4.2*k,J[2]+5.5*k],at:[J[0]-4*k,J[1]-12*k,J[2]-16*k]}}
function renderApex(t,n,u){const L=build(LOCN[n-1]);const h=jh(n);const o=ORIG[n-1];const yv=(ALT_DRAW[n-1]||h)*(0.94+0.06*Math.sin(u*Math.PI));const J=[o[0],o[1]+yv,o[2]];const c=apexCam(J,yv,n);
  const items=[];if(L.mesh)items.push({mesh:L.mesh});if(L.cloudMesh)items.push({mesh:L.cloudMesh,tint:[1,1,1],tintAmt:0,alpha:0.93,noShadow:true});
  if(n===16){const px=-260+520*u;items.push({mesh:PLANE,M:M4.trs([J[0]+px,J[1]-16,J[2]-70],Math.PI/2,0,0.05,1)})}
  items.push(...jumperItems(J,Math.PI+0.35,0,1,0.12*Math.sin(t*1.7)));
  const env=Object.assign({},L.env);if(n>=13){env.fogD=L.env.fogD;}
  renderGL(env,{eye:c.eye,at:c.at,fov:0.98,near:0.5,far:200000},{center:J,radius:6},items,t)}
function renderLaunch(t,n,k){const L=build(LOCN[n-1]);const o=ORIG[n-1];const y=jh(n)*easeOut(k/0.35)*0.25;const J=[o[0],o[1]+y,o[2]];const eye=[o[0]+9,o[1]+1.2,o[2]+11];
  const items=[{mesh:L.mesh},...craterItems(o,n-1,1),...jumperItems(J,0.6,k<0.06?1:0,1,0),...impactItems(o,k*0.8,n*0.6,1)];
  renderGL(L.env,{eye,at:[J[0],J[1]+1+y*0.4,J[2]],fov:1.0,near:0.3,far:20000},{center:o,radius:30},items,t)}
function renderImpact(t,n,k){const L=build(LOCN[n-1]);const o=ORIG[n-1];const sc=1+(n-9)*0.6;const eye=[o[0]-55*sc,o[1]+40*sc,o[2]+70*sc];
  const items=[{mesh:L.mesh},...craterItems(o,n,sc),...impactItems(o,k,n,sc)];
  renderGL(L.env,{eye,at:o,fov:1.0,near:0.5,far:20000},{center:o,radius:60*sc},items,t);return{eye,o}}
// ---------- space ----------
const RE=6371;const SPACE_H={17:32.8,18:65.5,19:131,20:262,21:524,22:1049,23:2097,24:4194};
function earthEnv(n){const dark=n<=17?0.5:(n<=18?0.8:1);return{sun:n<=22?[0.45,0.8,0.4]:[0.75,0.35,0.55],sunCol:hx('#fff6e6'),sky:[0.25,0.3,0.45],gnd:[0.02,0.02,0.05],fog:[0,0,0],fogD:1e9,zen:mix3(hx('#0a2a7a'),[0,0,0.01],dark),hor:mix3(hx('#5a8ad8'),[0.01,0.01,0.03],dark),stars:dark,night:0,emis:1,sunSize:1.5}}
function renderSpace(t,n,u){let h,gam;if(n<25){h=SPACE_H[n]*(1+0.04*u);const dip=Math.acos(RE/(RE+h));gam=n<=18?dip+0.1:n<=21?dip+0.18:Math.min(1.45,dip+0.5)}else{const k=clamp((t-JUMPS[24][0])/7,0,1);h=8389+18000*k*k;gam=Math.min(1.45,Math.acos(RE/(RE+h))+0.45)}
  const p=[0,RE+h,0];const look=V.norm([0,-Math.sin(gam),-Math.cos(gam)]);const env=earthEnv(n);
  const EM=M4.trs([0,0,0],1.48+t*0.004,0.6,0,1);const items=[{mesh:EARTH,M:EM},{mesh:CLOUDS,M:EM,alpha:0.85,noShadow:true}];if(n<=22){items.length=0;items.push({mesh:EARTH,M:EM},{mesh:EPATCH,M:EM},{mesh:CPATCH,M:EM,alpha:0.85,noShadow:true})}if(n===25){items.push({mesh:MOON,M:M4.trs([9000,RE+h+9000,-26000],0,0,0,2600)})}
  const VP=renderGL(env,{eye:p,at:V.add(p,V.sc(look,1000)),up:[0,1,0],fov:0.98,near:1,far:200000},null,items,t);
  // jumper pass
  const fl=n===25?clamp((t-JUMPS[24][0])/6,0,1):0;const jb=[0.45-fl*0.8,(n<=22?-1.75:-1.25)+0.1*Math.sin(t*1.3)+fl*1.4,-4.8-fl*2.5];
  const jit=jumperItems(jb,Math.PI+0.55+(n===25?fl*2.5:0.1*Math.sin(t*0.7)),0,1,0.2*Math.sin(t*0.9)+(n===25?fl*1.2:0));
  if(n===21)jit.push({mesh:ISS,M:M4.trs([-9+u*4,1.5,-30],0.6+u*0.2,0.2,0.1,0.55)});
  renderGL({sun:env.sun,sunCol:env.sunCol,sky:[0.35,0.45,0.7],gnd:[0.25,0.35,0.6],fog:[0,0,0],fogD:1e9,zen:[0,0,0],hor:[0,0,0],stars:0,emis:1},{eye:[0,0,0],at:[0,0,-1],fov:0.98,near:0.1,far:100},{center:jb,radius:4},jit,t,{noClear:true,noSky:true});
  return{VP,h,n}}
// ---------- HUD ----------
function drawHUD(t){const n=jumpAt(t);if(n<1||t>=56)return;const h=jh(n);const[ts,D]=JUMPS[n-1];const k=t-ts;const pop=k<0.15?0.6+0.4*easeOut(k/0.15)+Math.sin(k/0.15*Math.PI)*0.15:1;
  ctx.save();ctx.translate(W/2,250);ctx.scale(pop,pop);txt('JUMP #'+n,0,0,96,'#ffd84a');ctx.restore();ctx.save();ctx.translate(W/2,365);ctx.scale(pop,pop);txt(fmtH(h),0,0,110,n>=19?'#8fe0ff':'#ffffff');ctx.restore();
  const s=CMP[n-1];if(s&&k>0.12){const size=fitSize(s,920,56);const al=Math.min(1,(k-0.12)/0.12,(D-k)/0.1);ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,520);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.62)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
  if(n===25&&k>2.3){const a=Math.min(1,(k-2.3)/0.3);const s2='You\'re never coming back down 😳';const size=fitSize(s2,920,60);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,640);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s2).width;ctx.fillStyle='rgba(15,10,30,0.62)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s2,0,4,size,'#ff9a9a','center',900,false);ctx.restore()}
  if(n===25&&k>4.6){const a=Math.min(1,(k-4.6)/0.3);ctx.save();ctx.globalAlpha=a;txt('Next stop: the Moon 🌕',W/2,1500,64,'#ffffff','center',900);ctx.restore()}}
function drawTitle(t){const a=t<2.9?1:clamp((3.2-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,t<1.2?560:1480);ctx.scale(pop,pop);
  const l1='Every jump DOUBLES',l2='your jump height';const s=Math.min(fitSize(l1,980,96),fitSize(l2,980,96));ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffd84a');txt(l2,0,s*0.56,s,'#ffd84a');ctx.restore()}
function drawEnd(t){const k=ease((t-56)/0.5)*clamp((59.45-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.72*k})`;ctx.fillRect(0,0,W,H);const pop=t-56<0.5?0.7+0.3*ease((t-56.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);
  txt('How many jumps',0,-100,92,'#ffd84a');txt('would YOU take?',0,10,92,'#ffd84a');txt('👇',0,190+Math.abs(Math.sin((t-56)*5))*26,120,'#fff','center',900,false);ctx.restore();ctx.save();ctx.globalAlpha=k*ease((t-56.6)/0.4);txt('What should double next?',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
// ---------- frame ----------
let lastSpace=null;
function renderScene(t){lastSpace=null;let shk=0;
  if(t<1.2||t>=59.45){const tt=t>=59.45?t-60:t;lastSpace=renderSpace(50.5+tt,25,0.3);return}
  const n=jumpAt(t);const[ts,D]=JUMPS[n-1];const tau=t-ts;
  if(n<=8)renderGround(t,n);
  else if(n<=12){if(tau<0.35)renderLaunch(t,n,tau);else if(tau<D-0.6)renderApex(t,n,(tau-0.35)/(D-0.95));else renderImpact(t,n,tau-(D-0.6))}
  else if(n<=16)renderApex(t,n,tau/D);
  else lastSpace=renderSpace(t,n,tau/D)}
function shakeAmt(t){let a=0;for(let i=0;i<24;i++){const n=i+1;const tl=JUMPS[i][0]+JUMPS[i][1]-(n<=8?0.25:(n<=12?0.6:0.3));const k=t-tl;if(k>0&&k<0.5&&(n<=12))a+=Math.min(40,2+n*3)*(1-k/0.5)}return a}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);
  if(lastSpace){const VP=lastSpace.VP;const pc=project(VP,[0,0,0]);if(pc){const d=RE+lastSpace.h;const fpx=H/2/Math.tan(0.49);const rpx=fpx*Math.tan(Math.asin(RE/d));const g=ctx.createRadialGradient(pc[0],pc[1],rpx*0.985,pc[0],pc[1],rpx*1.06);g.addColorStop(0,'rgba(120,180,255,0.0)');g.addColorStop(0.15,'rgba(120,180,255,0.75)');g.addColorStop(1,'rgba(120,180,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
  if(lastSpace&&lastSpace.n<=22){const h=lastSpace.h,d=RE+h,dip=Math.acos(RE/d),L=Math.sqrt(d*d-RE*RE);const hp=project(lastSpace.VP,[0,d-Math.sin(dip)*L,-Math.cos(dip)*L]);if(hp){const y=hp[1],th=60+Math.min(200,h*0.25);const g=ctx.createLinearGradient(0,y-th*0.7,0,y+th*0.8);g.addColorStop(0,'rgba(110,170,255,0)');g.addColorStop(0.33,'rgba(150,200,255,0.85)');g.addColorStop(0.45,'rgba(200,230,255,0.55)');g.addColorStop(1,'rgba(160,200,255,0)');ctx.fillStyle=g;ctx.fillRect(0,y-th*0.7,W,th*1.5)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<25;i++){flash(JUMPS[i][0],0.35,0.14);const n=i+1;if(n>=9&&n<=12)flash(JUMPS[i][0]+JUMPS[i][1]-0.6,0.8,0.3,'255,240,220')}flash(1.2,0.7,0.25);flash(0,0.5,0.15);flash(JUMPS[18][0],0.6,0.3);
  if(t>=1.2)drawHUD(t);if(t<3.2)drawTitle(t);drawEnd(t);{const k=59.45-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.drawImage(acc,0,0);overlays(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;
