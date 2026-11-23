function basisM(p,X,Y,Z,s){return new Float32Array([X[0]*s,X[1]*s,X[2]*s,0,Y[0]*s,Y[1]*s,Y[2]*s,0,Z[0]*s,Z[1]*s,Z[2]*s,0,p[0],p[1],p[2],1])}
// ---------- background: Earth, Alpha Centauri A/B, Proxima, Proxima b ----------
const EARTHB=planetMesh(90,180,p=>{const n=fbm(p[0]*2.4+10,p[2]*2.4+p[1]*1.3,6),d=fbm(p[0]*7+1,p[2]*7-p[1]*3,3);const lat=Math.abs(p[1]);
  const oc=mix3(hx('#0c3070'),hx('#2a7ab8'),clamp((n-0.35)*4,0,1));let land=mix3(mix3(hx('#3a7a32'),hx('#6a9a45'),d),hx('#c8a868'),clamp((d-0.5)*3,0,1)*clamp(1-lat*1.5,0,1));
  let c=n>0.53?land:oc;if(lat>0.86)c=mix3(c,[0.95,0.96,0.98],clamp((lat-0.86)*12,0,1));const cl=fbm(p[0]*4-2,p[2]*4+p[1]*3,5);c=mix3(c,[0.96,0.97,0.99],clamp((cl-0.56)*5,0,0.9));return c});
const DIRE=V.norm([-0.342*0.67,-0.743,0.94*0.67]);
function earthR(t){return t<EV.hit1?22000:22000*Math.exp(-1.5*(t-EV.hit1))}
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[];const rn=roundAt(t);
  // EARTH below (hook + R1), shrinking fast after launch
  if(t<R[1]){const er=earthR(t);if(er>40){const ep=V.sc(DIRE,30000);items.push({mesh:EARTHB,M:M4.trs(ep,0.3,t*0.01,0.4,er)});
      items.push({mesh:GSPH,M:M4.trs(ep,0,0,0,er*1.025),tint:[0.25,0.5,1],tintAmt:1,add:1,alpha:0.22,noShadow:true});
      // laser array glow on the surface
      const lp=V.sc(DIRE,30000-er*1.01);const on=t>=EV.e1?1:((Math.abs(t-EV.h0)<0.3||Math.abs(t-EV.h1)<0.3)?0.6:0);if(on)BGPTS.push({p:lp,c:'230,140,255',r:er*0.05+300,a:0.9*on,cap:260})}}
  // R3: ALPHA CENTAURI A + B (+ far Proxima)
  if(rn===2&&t>=EV.b3-0.4){const a=ease((t-EV.b3+0.4)/1.2);const g=lerp(0.6,1.25,ease((t-EV.b3)/(EV.res3-EV.b3+2)));
    const ap=V.sc(ADIR,30000),ob=t*0.15;const bp=V.add(V.sc(BDIR,30000),[Math.cos(ob)*260,Math.sin(ob)*200,0]);const pp=V.sc(V.norm([-0.36,0.53,0.77]),30000);
    items.push({mesh:SUNG,M:M4.trs(ap,0,t*0.2,0,420*g),tint:[1,0.97,0.85],tintAmt:0.35,alpha:a});BGPTS.push({p:ap,c:'255,240,200',r:5200*g,a:0.85*a,cap:520});
    items.push({mesh:SUNG,M:M4.trs(bp,0,t*0.25,0,300*g),tint:[1,0.6,0.25],tintAmt:0.55,alpha:a});BGPTS.push({p:bp,c:'255,170,90',r:3800*g,a:0.8*a,cap:420});
    items.push({mesh:PROXS,M:M4.trs(pp,0,t*0.3,0,95*g),alpha:a});BGPTS.push({p:pp,c:'255,80,50',r:1500*g,a:0.75*a,cap:200})}
  // R4: PROXIMA up close + SUPERFLARE
  if(rn===3){const z=lerp(1,1.3,ease((t-R[3])/(EV.c4-R[3])));const pp=V.sc(PDIR,30000);const pr=1500*z;
    items.push({mesh:PROXS,M:M4.trs(pp,0.2,t*0.12,0,pr)});BGPTS.push({p:pp,c:'255,90,50',r:pr*5.5,a:0.65,cap:700});
    // little A+B far behind
    const ab=V.sc(V.norm([0.03,0.6,0.8]),30000);items.push({mesh:SUNG,M:M4.trs(ab,0,0,0,110),tint:[1,0.92,0.75],tintAmt:0.4});BGPTS.push({p:ab,c:'255,230,180',r:1600,a:0.6,cap:160});
    // loops on the limb (always a few, growing at the flare)
    const fk=t>=EV.c4?easeOut((t-EV.c4)/0.8):0;const fa=t>=EV.c4?Math.max(0,1-(t-EV.c4)/3.2):0;
    const cam=camAt(t);const vd=V.norm(V.sub(cam.at,cam.eye));const side=V.norm(V.cross(vd,[0,1,0])),up=V.norm(V.cross(side,vd));
    for(let i=0;i<5;i++){const an=-0.9+i*0.55+Math.sin(t*0.3+i)*0.05;const rad=V.add(V.sc(side,Math.cos(an)),V.sc(up,Math.sin(an)));const base=V.add(pp,V.sc(rad,pr*0.96));
      const s=pr*(0.18+0.08*hsh(i,4))*(1+fk*(i===2?2.6:1.2));const yaw=Math.atan2(rad[0],rad[2]);
      const tg=V.norm(V.cross(vd,rad));const M=basisM(base,tg,rad,vd,s);
      items.push({mesh:FLOOP,M,tint:mix3([1,0.45,0.15],[1,0.95,0.9],fa),tintAmt:0.6,add:1,alpha:0.55+0.45*fa,noShadow:true})}
    if(t>=EV.c4){const k=t-EV.c4;items.push({mesh:GSPH,M:M4.trs(pp,0,0,0,pr*(1.05+easeOut(k/0.6)*1.8)),tint:[0.85,0.8,1],tintAmt:1,add:1,alpha:fa*0.75,noShadow:true});
      BGPTS.push({p:pp,c:'235,220,255',r:pr*30*fa,a:fa,cap:1600})}}
  // FINAL: PROXIMA b (tidally locked) with Proxima in the sky
  if(rn>=4){const a=ease((t-R[4]+0.2)/1.0);const z=lerp(0.85,1.05,ease((t-R[4])/8));const bp=V.sc(PBDIR,30000);const ps=V.sc(P5DIR,30000);
    items.push({mesh:PROXB,M:M4.trs(bp,0,0,0,7600*z),alpha:a});
    items.push({mesh:PROXS,M:M4.trs(ps,0,t*0.2,0,260),alpha:a});BGPTS.push({p:ps,c:'255,100,60',r:3600,a:0.8*a,cap:380})}
  return{items}}
