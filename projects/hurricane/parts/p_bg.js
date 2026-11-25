// ---------- background world: meadow, hills, pines (wind-bent) ----------
let SF_BG;{const m=new MB();ground(m,-2e4,-2e4,2e4,2e4,null,-0.05,4000,(x,z)=>hurCol(x*0.01,z*0.01));const r=rngG(55);
  for(let i=0;i<160;i++){const a=r()*TAU2,d=120+r()*1800;m.ico([Math.cos(a)*d,0,Math.sin(a)*d],1+r()*5,mix3(hx('#4a4842'),hx('#8a847a'),r()),0,0.55,[5,7])}
  for(let i=0;i<260;i++){const a=r()*TAU2,d=260+Math.pow(r(),0.7)*3200;const x=Math.cos(a)*d,z=Math.sin(a)*d;const h=40+r()*70;const c=mix3(hx('#123020'),hx('#24482c'),r());
    m.prism([x,0,z],2.5,2,h*0.25,6,hx('#2a1e16'));m.prism([x-h*0.04,h*0.18,z],h*0.28,1,h*0.55,8,c);m.prism([x-h*0.12,h*0.48,z],h*0.2,0.5,h*0.55,8,c)}
  for(let i=0;i<40;i++){const a=i*0.157+hsh(i,2)*0.1,d=4600+hsh(i,3)*1600;m.ico([Math.sin(a)*d,-200,Math.cos(a)*d],700+hsh(i,4)*700,mix3(hx('#1a3022'),hx('#2a4a30'),hsh(i,6)),0,0.35,[8,12])}
  SF_BG=m.build(0.5)}
// cloud fields (bg units): low CEILING everywhere + the EYEWALL ring (stadium)
const CEIL=[],WALL=[];{const r=rngG(77);
  for(let i=0;i<230;i++){const rad=180+Math.pow(r(),0.75)*7500,a=r()*TAU2;CEIL.push({rad,a,y:330+r()*170,s:150+r()*170+rad*0.04,sq:0.35+r()*0.2,sp:r()})}
  for(let i=0;i<150;i++){const a=i/150*TAU2+r()*0.05;const rad=2700+r()*700;const y=Math.pow(r(),0.8)*1800;WALL.push({rad,a,y,s:420+r()*380,sp:r()})}}
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const env=envAt(t);
  // how much of the storm deck is present / how far the eye has opened / clearing
  const eyeK=rn===3?ease((t-EV.k4+0.8)/2.4):0;const clearK=rn===4?ease((t-R[4])/1.4):0;
  // clouds rotate around the storm (fast scud); slower in the eye
  const rot=t*0.018;
  const shade=mix3([0.28,0.31,0.36],[0.85,0.87,0.9],eyeK);
  for(const c of CEIL){let al=1-clearK;if(rn===3&&c.rad<3400)al*=1-eyeK;if(al<=0.02)continue;const a=c.a+rot*(1+c.sp*0.4)*(1200/(c.rad+600));const p=[Math.cos(a)*c.rad,c.y+(rn===3&&c.rad<3400?eyeK*500:0),Math.sin(a)*c.rad];
    const dist=c.rad;const ft=clamp(dist/7800,0,1);items.push({mesh:HCLOUD,M:M4.trs(p,a,0,0,[c.s*1.8,c.s*c.sq,c.s*1.5]),tint:mix3(shade,env.hor,ft*0.85),tintAmt:0.55+0.4*ft,alpha:al,noShadow:true})}
  if(eyeK>0.01)for(const w of WALL){const a=w.a+rot*0.5;const p=[Math.cos(a)*w.rad,w.y,Math.sin(a)*w.rad];const top=clamp(w.y/1800,0,1);
    items.push({mesh:HCLOUD,M:M4.trs(p,a,0,0,[w.s*1.3,w.s*1.1,w.s*1.3]),tint:mix3([0.42,0.46,0.52],[0.97,0.97,1],top),tintAmt:0.6,alpha:eyeK,noShadow:true})}
  // final: a few white fair-weather clouds
  if(clearK>0)for(let i=0;i<14;i++){const a=hsh(i,5)*TAU2,rad=1800+hsh(i,6)*4000;const p=[Math.cos(a+t*0.004)*rad,650+hsh(i,7)*300,Math.sin(a+t*0.004)*rad];const s=200+hsh(i,8)*200;
    items.push({mesh:HCLOUD,M:M4.trs(p,a,0,0,[s*1.6,s*0.6,s*1.3]),tint:[0.98,0.98,1],tintAmt:0.55,alpha:clearK,noShadow:true})}
  // eye / clear sky sun glow
  if(rn>=3){const sd=rn===3?HSUN:SUNDIR5;const sp=V.sc(sd,30000);const a=rn===3?eyeK:1;BGPTS.push({p:sp,c:'255,225,170',r:6000,a:0.6*a,sun:1})}
  return{items,dir,side}}
