// ---------- helpers ----------
const JAX=(()=>{const h=V.norm(V.cross(SDIR,[0,1,0]));let j=V.norm(V.add(V.sc(h,0.75),[0,0.66,0]));j=V.norm(V.sub(j,V.sc(SDIR,V.dot(j,SDIR))));return j})();
const PQ=V.norm(V.cross(SDIR,JAX));
const SC=V.sc(SDIR,60000);
const PW=TAU2/1.5;
function pulsarDir(t){const th=PW*(t-EV.ignite);const b=0.22;const p1=V.add(V.sc(SDIR,-Math.cos(b)),V.sc(JAX,Math.sin(b)));return V.norm(V.add(V.sc(p1,Math.cos(th)),V.sc(PQ,Math.sin(th))))}
function pulseK(t){if(roundAt(t)<3||t>=EV.loop)return 0;const a=pulsarDir(t);const d=Math.max(V.dot(a,V.sc(SDIR,-1)),V.dot(V.sc(a,-1),V.sc(SDIR,-1)));return Math.pow(Math.max(0,d),60)}
function walkDist(t){return 0.95*Math.min(t,EV.stopW)}
function beamK(t){if(t<EV.beam0||t>=EV.beam1+0.3)return 0;return clamp((t-EV.beam0)/0.08,0,1)*clamp((EV.beam1+0.3-t)/0.3,0,1)}
// ---------- environments ----------
function envAt(t){const e={sun:SDIR,sunCol:[1.0,1.08,1.3],sky:[0.17,0.19,0.32],gnd:[0.1,0.08,0.12],fog:[0,0,0],fogD:1e7,zen:[0.004,0.005,0.016],hor:[0.025,0.02,0.06],stars:1,night:0,emis:1,ground:0,neb:0.55,shI:0,sunSize:1.5};
  if(t>=EV.collapse&&t<EV.nova){const k=ease((t-EV.collapse)/0.6);e.sunCol=V.sc(e.sunCol,lerp(1,0.2,k))}
  const n=t-EV.nova;
  if(n>=0&&t<8.0){const f=Math.exp(-n*3.2)*1.8+1.2;e.sunCol=[f,f*0.97,f*1.08];e.sky=[0.35,0.36,0.5];e.shR=0.03+0.95*easeOut(n/1.4);e.shI=lerp(2.0,1.1,clamp(n/1.4,0,1));e.fill=0.28;e.shW=0.1;e.shC=[1,0.95,0.9];e.shC2=[0.55,0.75,1];e.hor=[0.1,0.09,0.16];
    if(t>=EV.wave-0.1){const k=clamp((t-EV.wave+0.1)/0.2,0,1)*clamp((8.0-t)/0.8,0,1);e.sunCol=mix3(e.sunCol,[3.2,2.3,1.7],k);e.sky=mix3(e.sky,[0.8,0.5,0.4],k);e.gnd=mix3(e.gnd,[0.5,0.3,0.2],k)}}
  if(t>=8.0){e.sunCol=[0.95,0.62,0.85];e.sky=[0.22,0.15,0.3];e.gnd=[0.12,0.07,0.1];e.shR=0.42;e.shI=0.95;e.fill=0.55;e.shW=0.2;e.shC=[1,0.38,0.62];e.shC2=[0.35,0.6,1];e.hor=[0.06,0.03,0.08];
    if(t<8.6){const k=1-clamp((t-8.0)/0.6,0,1);e.shI+=k*1.2}}
  if(t>=EV.warn&&t<EV.beam1+0.4){const w=clamp((t-EV.warn)/0.7,0,1)*0.5;const b=beamK(t)*(0.85+0.15*Math.sin(t*60));e.sunCol=V.add(e.sunCol,V.sc([0.8,1.2,1.7],w*0.3+b*0.6));e.sky=V.add(e.sky,V.sc([0.05,0.1,0.15],b))}
  if(roundAt(t)>=3){const p=pulseK(t);e.sunCol=V.add([0.7,0.62,0.95],V.sc([1.2,1.6,2.2],p));e.sky=[0.2,0.16,0.32]}
  return e}
function fillCol(t){let f=[0.42,0.4,0.55];const n=t-EV.nova;if(n>=0&&n<2.5)f=V.add(f,V.sc([0.8,0.85,1],Math.exp(-n*2)));if(t>=8)f=[0.48,0.38,0.52];if(t>=EV.ignite&&roundAt(t)>=3)f=V.add(f,[0.12,0.06,0]);return f}
// ---------- camera ----------
function aim(eye,tgt,w){const f=V.norm(V.add(V.sc(V.norm(V.sub(tgt,eye)),1-w),V.sc(SDIR,w)));return{eye,at:V.add(eye,V.sc(f,4))}}
function camAt(t){const rn=roundAt(t);const sw=Math.sin(t*0.4)*0.2;
  if(t<R[0]){const k=t/R[0];return aim([1.9-0.2*k,0.6,-4.8+0.4*k],[0,0.5,0],0.5)}
  if(rn===0){const k=ease((t-R[0])/2.0);let eye=[lerp(1.3,0.95,k),lerp(0.5,0.62,k),lerp(-3.7,-2.6,k)];let w=lerp(0.5,0.32,k);if(t>=EV.stopW){const kk=ease((t-EV.stopW)/0.6);eye=[lerp(0.95,1.6,kk),lerp(0.62,0.42,kk),lerp(-2.6,-4.2,kk)];w=lerp(0.22,0.56,kk)}return aim(eye,[0,0.55,0],w)}
  if(rn===1){if(t<7.7)return aim([1.6+sw*0.3,0.42,-4.2],[0,0.55,0],0.56);const k=ease((t-7.7)/0.8);return aim([lerp(1.6,1.15,k),lerp(0.42,0.68,k),lerp(-4.2,-2.6,k)],[0,0.6,0],lerp(0.56,0.18,k))}
  if(rn===2){if(t<EV.umb)return aim([1.3,0.6,-3.0],[0,0.6,0],0.3);return aim([1.9+sw*0.2,0.5,-3.9],[0,0.9,0],0.4)}
  if(rn===3){return aim([1.5+sw*0.3,0.55,-3.4],[0.1,0.5,0],0.4)}
  if(rn===4){const k=ease((t-R[4])/2.5);let r=aim([lerp(1.5,1.15,k),0.6,lerp(-3.4,-2.8,k)],[0.1,0.5,0],lerp(0.4,0.2,k));
    if(t>=EV.drop0-0.5){const kk=ease((t-EV.drop0+0.5)/0.7);const ku=ease((t-EV.bonk+0.5)/0.5);const eye=[lerp(1.15,1.5,kk),lerp(0.6,0.38,kk),lerp(-2.8,-3.1,kk)];const tg=[lerp(0.1,-0.4,kk*(1-ku)),lerp(0.5,1.9,kk)-1.4*ku,lerp(0,0.4,kk*(1-ku))];r={eye,at:V.add(eye,V.sc(V.norm(V.sub(tg,eye)),4))}}
    if(t>=R[5])r={eye:[1.4,1.0,-3.2],at:[0,0.4,0]};return r}
  return{eye:[1.4,1.0,-3.2],at:[0,0.4,0]}}
// ---------- background (meters) ----------
function spindle(items,a,b,r,col,al){items.push({mesh:UGLASS,M:segM(lerp3(a,b,0.25),lerp3(a,b,0.75),r),tint:col,tintAmt:1,alpha:al,add:1,noShadow:true})}
function bgItems(t){const items=[];const G=(r,col,a,add)=>items.push({mesh:UGLASS,M:M4.trs(SC,0,0,0,r),tint:col,tintAmt:1,alpha:a,add:add?1:0,noShadow:true});
  if(t<EV.nova){let rad=5600;if(t>=R[0]){const q=t-R[0];rad*=1+0.045*Math.sin(q*(5+q*4))*clamp(q/0.5,0,1)}const pre=t-EV.collapse;if(pre>0)rad*=lerp(1,0.03,easeIn(clamp(pre/0.62,0,1)));
    const col=mix3([0.72,0.84,1],[1,1,1],clamp(pre/0.5,0,1));G(rad,col,1,0);G(rad*1.06,[0.55,0.72,1],0.4,1);G(rad*1.2,[0.4,0.6,1],0.2,1);G(rad*1.5,[0.3,0.45,1],0.09,1);G(rad*2.3,[0.2,0.32,0.9],0.045,1);G(rad*3.6,[0.15,0.25,0.8],0.025,1)}
  else{const n=t-EV.nova;
    if(n<0.9)G(lerp(400,11000,easeOut(n/0.25)),[1,1,1],clamp(1-n/0.9,0,1)*0.85,1);
    if(n<4.6){const L=75000*easeOut(n/1.1);const a=clamp(1-(n-2.6)/2,0,1);for(const s of[-1,1]){const tip=V.add(SC,V.sc(JAX,s*L));spindle(items,SC,tip,1300,[0.85,0.95,1],0.8*a);spindle(items,SC,tip,3600,[0.4,0.6,1],0.25*a)}}
    if(n>=0.8){const k=clamp((n-0.8)/0.6,0,1);G(1300,[0.85,0.92,1],k,0);G(3500,[0.6,0.75,1],0.3*k,1);G(9000,[0.9,0.4,0.7],0.1*k,1)}
    if(t>=EV.warn&&t<EV.beam1+0.4){const w=clamp((t-EV.warn)/0.7,0,1);const b=beamK(t);G(lerp(3000,11000,w)*(1+0.1*Math.sin(t*40)),[0.6,0.9,1],0.45*w*(1-b*0.3),1);G(20000,[0.5,0.8,1],0.2*b,1)}
    if(roundAt(t)>=3){const a=pulsarDir(t);for(const s of[-1,1]){const tip=V.add(SC,V.sc(a,s*48000));spindle(items,SC,tip,650,[0.85,0.97,1],0.85);spindle(items,SC,tip,2200,[0.4,0.7,1],0.22)}const p=pulseK(t);G(1700+p*6000,[0.9,0.97,1],1,0);G(5000,[0.5,0.8,1],0.3+p*0.5,1)}}
  return{items}}
// ---------- foreground ----------
let LASTVP=null,LASTVP_BG=null;const MATCHP=[0.78,0,0.3],MTOP=[0.78,0.9,0.3];
const SOOT=[0.07,0.06,0.06];
function hitP(){return[0.04,1.25,0.42]}
function fgItems(t){const rn=roundAt(t);const items=[];let pose='walk',walk=t<EV.stopW?1:0,o={t};
  items.push({mesh:PLANET,M:M4.trs([0,-RP,0],0,walkDist(t)/RP,0,1)});
  if(t>=EV.glasses)o.glasses=easeOut((t-EV.glasses)/0.5);
  if(t>=EV.wave&&t<EV.wave+1.2)o.flail=1;
  if(rn===2&&t>=EV.umb){pose='umb';o.shield=true;o.leafGlow=beamK(t)*0.12}
  if(t>=EV.sit&&rn>=3){pose='sit';o.noCrumb=true}
  if(rn===4&&t<EV.wait)o.lid=0.62;if(rn===4&&t>=EV.wait)o.lid=0;
  if(t>=EV.bonk){pose='squash';o.xeyes=true}
  const slow=t>=EV.drop0&&t<EV.bonk+0.4;o.ph=t*(slow?1.2:5.2);o.walk=walk;o.pose=pose;if(pose!=='walk')o.crutch=false;if(rn>=3&&pose==='walk')o.crutch=false;
  const coughs=[1.2,8.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  let Rm=M4.id();
  if(t>=EV.wave&&t<EV.wave+0.9){const k=t-EV.wave;Rm=M4.trs([Math.sin(t*70)*0.04*(1-k/0.9),0,0],0,-0.08*(1-k/0.9),Math.sin(t*53)*0.05*(1-k/0.9),1)}
  if(pose==='squash'){const k=clamp((t-EV.bonk)/0.1,0,1);Rm=M4.trs([0,0,0],0,0,0,[lerp(1,1.35,k),lerp(1,0.25,k),lerp(1,1.15,k)])}
  let ai=antItems(Rm,o);const soot=t<EV.wave?0:t<R[2]?clamp((t-EV.wave)/0.25,0,1)*0.8:0.45;
  if(soot>0)for(const it of ai){if(!it.tint||it.tint[0]===0.97||it.mesh===LEAF)continue;if(it.tint[0]>0.9&&it.tint[1]>0.9&&it.tint[2]>0.9&&it.mesh===USPH)continue;it.tint=mix3(it.tint,SOOT,soot*(it.tint[0]>0.8?0.6:0.85))}
  items.push(...ai);
  // smoke from sooty ant
  if(t>=EV.wave+0.3&&t<R[2]+0.6){for(let i=0;i<7;i++){const ph=((t*0.8+i/7)%1);const age=ph;const p=[(hsh(i,2)-0.5)*0.5+Math.sin(t*2+i)*0.05,0.8+age*1.1,0.2+(hsh(i,3)-0.5)*0.4];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.03+age*0.11),tint:[0.72,0.7,0.72],tintAmt:1,alpha:0.28*(1-age)*clamp((R[2]+0.6-t)/0.6,0,1),noShadow:true})}}
  // fire wall
  if(t>=EV.wave-0.6&&t<EV.wave+0.25){const n=t-EV.nova;const r=1500*n/(EV.wave-EV.nova);const a=easeIn(clamp((t-EV.wave+0.6)/0.6,0,1))*clamp((EV.wave+0.25-t)/0.25,0,1);const c=V.sc(SDIR,1500);items.push({mesh:UGLASS,M:M4.trs(c,0,0,0,r),tint:[1,0.88,0.75],tintAmt:1,alpha:0.32*a,add:1,noShadow:true});items.push({mesh:UGLASS,M:M4.trs(c,0,0,0,Math.max(1,r-14)),tint:[1,0.45,0.25],tintAmt:1,alpha:0.25*a,add:1,noShadow:true})}
  // debris
  if(t>=EV.wave-0.4&&t<EV.wave+1.6){for(let i=0;i<46;i++){const t0=EV.wave-0.35+hsh(i,1)*0.9;const k=t-t0;if(k<0)continue;const x=(hsh(i,2)-0.5)*14,y=0.15+Math.pow(hsh(i,3),2)*4.5;const z=36-62*k;if(z<-9||z>40)continue;const s=0.06+Math.pow(hsh(i,4),2)*0.5;
    items.push({mesh:ROCK[i%4],M:M4.trs([x,y+Math.sin(k*3+i)*0.2,z],k*6+i,k*4,0,s),tint:[1,0.55,0.2],tintAmt:0.35});if(i%3===0)items.push({mesh:UGLASS,M:segM([x,y,z+0.2],[x,y,z+1.6+s*4],s*0.6),tint:[1,0.6,0.25],tintAmt:1,alpha:0.4,add:1,noShadow:true})}}
  // gamma ray beam on leaf
  {const b=beamK(t);if(b>0){const h=hitP();const far=V.add(h,V.sc(SDIR,1400));const fl=0.85+0.15*Math.sin(t*70);spindle(items,h,far,0.12*fl,[0.95,1,1],0.95*b);spindle(items,h,far,0.38,[0.45,0.8,1],0.35*b);spindle(items,h,far,1.0,[0.3,0.55,1],0.12*b);
    items.push({mesh:UGLASS,M:M4.trs(h,0,0,0,0.35*fl),tint:[0.9,1,1],tintAmt:1,alpha:0.8*b,add:1,noShadow:true});items.push({mesh:UGLASS,M:M4.trs(h,0,0,0,0.9),tint:[0.4,0.75,1],tintAmt:1,alpha:0.3*b,add:1,noShadow:true});
    for(let i=0;i<6;i++){const a=i/6*TAU2+t*0.6;const d=V.norm([Math.cos(a),0.35+0.3*Math.sin(a*2),Math.sin(a)*0.6+0.25]);spindle(items,h,V.add(h,V.sc(d,9+3*Math.sin(t*9+i))),0.05,[0.8,0.95,1],0.6*b)}
    for(let i=0;i<24;i++){const ph=(t*2.2+hsh(i,1))%1;const d=V.norm([hsh(i,2)-0.5,hsh(i,3)*0.8,hsh(i,4)-0.6]);const p=V.add(h,V.sc(d,ph*3));items.push({mesh:UGLASS,M:M4.trs(p,0,0,0,0.04*(1-ph)),tint:[0.85,1,1],tintAmt:1,alpha:b,add:1,noShadow:true})}}}
  // campfire match
  if(t>=EV.sit&&rn>=3||t>=R[5]){items.push({mesh:UCYL,M:segM(MATCHP,MTOP,0.032),tint:AC.wood,tintAmt:1});const lit=t>=EV.ignite;items.push({mesh:USPH,M:M4.trs(V.add(MTOP,[0,0.04,0]),0,0,0,[0.06,0.075,0.06]),tint:lit?[0.12,0.08,0.06]:AC.match,tintAmt:1});
    if(lit){const k=t-EV.ignite;const g=k<0.25?easeOut(k/0.25)*1.6:1+0.12*Math.sin(t*23)+0.08*Math.sin(t*37);const fp=V.add(MTOP,[0,0.09,0]);const sw=0.06*Math.sin(t*11);
      items.push({mesh:FLAME,M:M4.trs(fp,0,0,sw,[0.13*g,0.15*g,0.13*g]),tint:[1,0.42,0.08],tintAmt:1,alpha:0.6,add:1,noShadow:true});items.push({mesh:FLAME,M:M4.trs(V.add(fp,[0,-0.01,0]),0,0,sw,[0.075*g,0.09*g,0.075*g]),tint:[1,0.88,0.45],tintAmt:1,alpha:0.95,add:1,noShadow:true});items.push({mesh:UGLASS,M:M4.trs(V.add(fp,[0,0.08,0]),0,0,0,0.55*g),tint:[1,0.5,0.15],tintAmt:1,alpha:0.12,add:1,noShadow:true})}}
  // pebble
  if(t>=EV.drop0-0.3){const S0=[-1.7,6.8,1.1],HIT=[0.0,1.0,-0.22],REST=[0.05,0.5,-0.12];let p,rot;
    if(t<EV.bonk){const k=(t-EV.drop0+0.3)/(EV.bonk-EV.drop0+0.3);p=lerp3(S0,HIT,Math.pow(k,1.15));rot=t*1.2}else{const k=clamp((t-EV.bonk)/0.55,0,1);p=lerp3([0,0.62,-0.22],REST,k);p[1]+=Math.abs(Math.sin(Math.PI*2*k))*0.35*(1-k);rot=EV.bonk*1.2+k*1.5}
    items.push({mesh:PEBBLE,M:M4.trs(p,rot,rot*0.7,0.3,0.32)})}
  return items}
// ---------- render ----------
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);env.fillD=V.norm(V.add(V.norm(V.sub(c.eye,[0,0.5,0])),[0.3,0.9,0]));env.fillC=fillCol(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  LASTVP_BG=renderGL(env,{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const fitems=fgItems(tt);
  LASTVP=renderGL(Object.assign({},env,{fogD:1e7}),{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},{center:[0,0.3,-0.2],radius:4.5},fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  if(t>=R[0]&&t<EV.nova)a+=1.5+4*clamp((t-3.5)/1.5,0,1);S_(EV.nova,26,1.4);S_(EV.wave,48,1.8);a+=7*beamK(t);S_(EV.beam0,16,0.5);S_(EV.ignite,5,0.3);S_(EV.bonk,20,0.5);return a}
