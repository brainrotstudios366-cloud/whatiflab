// ---------- background world: snowy tundra, snowy pines, white mountains ----------
let SF_BG;{const m=new MB();ground(m,-2e4,-2e4,2e4,2e4,null,-0.05,4000,(x,z)=>iceCol(x*0.01,z*0.01));const r=rngG(55);
  for(let i=0;i<160;i++){const a=r()*TAU2,d=120+r()*1800;const s=1+r()*5;m.ico([Math.cos(a)*d,0,Math.sin(a)*d],s,mix3(hx('#3e4450'),hx('#6a707c'),r()),0,0.55,[5,7]);m.ico([Math.cos(a)*d,s*0.3,Math.sin(a)*d],s*0.85,hx('#f2f6fb'),0,0.3,[5,7])}
  for(let i=0;i<240;i++){const a=r()*TAU2,d=300+Math.pow(r(),0.7)*3200;const x=Math.cos(a)*d,z=Math.sin(a)*d;const h=30+r()*60;const c=mix3(hx('#14281e'),hx('#22402c'),r());
    m.prism([x,0,z],2,1.6,h*0.2,6,hx('#2a1e16'));m.prism([x,h*0.15,z],h*0.26,1,h*0.55,8,c);m.prism([x,h*0.2,z],h*0.2,0.8,h*0.42,8,hx('#eef4fa'));m.prism([x,h*0.45,z],h*0.19,0.5,h*0.55,8,c);m.prism([x,h*0.5,z],h*0.14,0.4,h*0.42,8,hx('#f4f8fc'))}
  for(let i=0;i<46;i++){const a=i*0.137+hsh(i,2)*0.1,d=4200+hsh(i,3)*1800;const s=700+hsh(i,4)*900;const x=Math.sin(a)*d,z=Math.cos(a)*d;
    m.ico([x,-150,z],s,mix3(hx('#8a98ac'),hx('#c8d4e2'),hsh(i,6)),0,0.6,[8,12]);m.ico([x,s*0.22-150,z],s*0.72,hx('#f4f8fc'),0,0.55,[8,12])}
  SF_BG=m.build(0.5)}
// overcast deck
const CEIL=[];{const r=rngG(77);for(let i=0;i<200;i++){const rad=180+Math.pow(r(),0.75)*7500,a=r()*TAU2;CEIL.push({rad,a,y:330+r()*170,s:150+r()*170+rad*0.04,sq:0.35+r()*0.2,sp:r()})}}
// mammoth state (bg meters)
function mamAt(t){const rn=roundAt(t);if(rn!==2)return null;
  if(t<EV.hit3-1.4){const k=clamp((t-R[2]+0.3)/(EV.hit3-1.4-R[2]+0.3),0,1);return{p:[-0.7,0,lerp(17,5.5,k)],yaw:0.12,ph:t*3.2,head:Math.sin(t*1.3)*0.06}}
  if(t<EV.res3+0.4)return null;
  const k=clamp((t-EV.res3-0.4)/4,0,1);return{p:[-1.2+k*1.5,0,lerp(6,13,k)],yaw:Math.PI+0.2,ph:t*3.2,head:0}}
function mammothItems(items,st){const B=M4.trs(st.p,st.yaw,0,0,1);const bob=Math.abs(Math.sin(st.ph))*0.06;const B2=M4.mul(B,M4.trs([0,bob,0],0,0,0,1));
  const F=(M,pos,sc,rot)=>items.push({mesh:MFUR,M:M4.mul(M,M4.trs(pos,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,sc))});
  F(B2,[0,2.35,0.25],[1.45,1.35,2.1]);F(B2,[0,3.2,-0.55],[1.0,0.8,1.1]);F(B2,[0,1.6,0.3],[1.2,0.7,1.7]);
  // legs swing
  for(const [lx,lz,ph] of[[-0.75,-0.95,0],[0.75,-0.95,Math.PI],[-0.75,1.2,Math.PI],[0.75,1.2,0]]){const sw=Math.sin(st.ph+ph)*0.28;const H=M4.mul(B,M4.trs([lx,1.95,lz],0,sw,0,1));
    items.push({mesh:MFUR,M:M4.mul(H,M4.trs([0,-0.95,0],0,0,0,[0.46,1.05,0.46]))});items.push({mesh:USPH,M:M4.mul(H,M4.trs([0,-1.88,0],0,0,0,[0.42,0.12,0.42])),tint:hx('#2a201a'),tintAmt:1})}
  const Hd=M4.mul(B2,M4.trs([0,3.05,-1.75],0,st.head,0,1));
  F(Hd,[0,0,0],[0.85,0.95,0.8]);F(Hd,[0,0.45,0.1],[0.6,0.55,0.6]);for(const s of[-1,1])F(Hd,[s*0.68,0.05,0.25],[0.18,0.32,0.14]);
  items.push({mesh:MTRUNK,M:M4.mul(Hd,M4.trs([0,-0.15,-0.55],0,Math.sin(st.ph*0.5)*0.12,0,1))});
  for(let s=0;s<2;s++)items.push({mesh:MTUSKS[s],M:M4.mul(Hd,M4.trs([s?0.32:-0.32,-0.55,-0.45],0,0,0,1))});
  for(const s of[-1,1]){items.push({mesh:USPH,M:M4.mul(Hd,M4.trs([s*0.42,0.12,-0.6],0,0,0,0.075)),tint:[0.03,0.02,0.02],tintAmt:1});items.push({mesh:USPH,M:M4.mul(Hd,M4.trs([s*0.43,0.14,-0.66],0,0,0,0.025)),tint:[1,1,1],tintAmt:1})}
  items.push({mesh:MFUR,M:M4.mul(B2,M4.trs([0,2.4,2.3],0,0.6,0,[0.12,0.5,0.12]))})}
// ice sheet distance (bg meters)
function iceZ(t){return lerp(5200,1500,ease((t-R[3])/(R[4]-R[3]-0.5)))}
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const env=envAt(t);
  // overcast deck: during hook, R1, R2; clears in R3
  const ov=rn<=1?1:(rn===2?1-ease((t-R[2])/1.0):0);const rot=t*0.01;const shade=rn===0?mix3([0.62,0.66,0.72],[0.42,0.46,0.54],ease((t-EV.e1)/2)):[0.68,0.72,0.78];
  if(ov>0.02)for(const c of CEIL){const a=c.a+rot*(1+c.sp*0.4)*(1200/(c.rad+600));const p=[Math.cos(a)*c.rad,c.y,Math.sin(a)*c.rad];const ft=clamp(c.rad/7800,0,1);
    items.push({mesh:HCLOUD,M:M4.trs(p,a,0,0,[c.s*1.8,c.s*c.sq,c.s*1.5]),tint:mix3(shade,env.hor,ft*0.85),tintAmt:0.55+0.4*ft,alpha:ov,noShadow:true})}
  if(rn>=2)for(let i=0;i<14;i++){const a=hsh(i,5)*TAU2,rad=1800+hsh(i,6)*4000;const p=[Math.cos(a+t*0.004)*rad,650+hsh(i,7)*300,Math.sin(a+t*0.004)*rad];const s=200+hsh(i,8)*200;
    items.push({mesh:HCLOUD,M:M4.trs(p,a,0,0,[s*1.6,s*0.6,s*1.3]),tint:[0.98,0.98,1],tintAmt:0.55,alpha:rn===2?ease((t-R[2])/1.0):1,noShadow:true})}
  // R2: avalanche powder cloud rolling in
  if(rn===1&&t>=EV.s2&&t<EV.hit2+0.2){const k=clamp((t-EV.s2)/(EV.hit2-EV.s2),0,1);const zc=lerp(420,0.4,Math.pow(k,1.6));
    for(let i=0;i<60;i++){const x=(hsh(i,31)-0.5)*500,z=zc+hsh(i,32)*30*(zc/420+0.05);const s=(14+hsh(i,33)*26)*(0.3+0.7*Math.min(1,zc/60+0.2));const y=s*0.5+hsh(i,34)*s*0.8;
      items.push({mesh:HCLOUD,M:M4.trs([x,y,z],t*0.4+i,0,0,[s,s*0.8,s]),tint:[0.97,0.98,1],tintAmt:0.7,noShadow:true})}}
  // R3: woolly mammoth
  const st=mamAt(t);if(st)mammothItems(items,st);
  // R4: the ice sheet
  if(rn===3){items.push({mesh:ICEWALL,M:M4.trs([0,0,iceZ(t)],0,0,0,1)})}
  if(rn===2||rn===4){const sp=V.sc(HSUN,30000);BGPTS.push({p:sp,c:'255,235,200',r:5000,a:rn===2?0.5*ease((t-R[2])/1.0):0.5,sun:1})}
  return{items,dir,side}}
