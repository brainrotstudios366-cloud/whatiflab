// ---------- background world: night meadow, hills, pines ----------
let SF_BG;{const m=new MB();ground(m,-2e4,-2e4,2e4,2e4,null,-0.05,4000,(x,z)=>gemCol(x*0.01,z*0.01));const r=rngG(55);
  for(let i=0;i<160;i++){const a=r()*TAU2,d=120+r()*1800;m.ico([Math.cos(a)*d,0,Math.sin(a)*d],1+r()*5,mix3(hx('#4a4842'),hx('#8a847a'),r()),0,0.55,[5,7])}
  // pines
  for(let i=0;i<260;i++){const a=r()*TAU2,d=260+Math.pow(r(),0.7)*3200;const x=Math.cos(a)*d,z=Math.sin(a)*d;const h=40+r()*70;const c=mix3(hx('#0e2418'),hx('#1e4026'),r());
    m.prism([x,0,z],2.5,2,h*0.25,6,hx('#2a1e16'));m.prism([x,h*0.18,z],h*0.28,1,h*0.55,8,c);m.prism([x,h*0.48,z],h*0.2,0.5,h*0.55,8,c)}
  // rolling hills
  for(let i=0;i<40;i++){const a=i*0.157+hsh(i,2)*0.1,d=4600+hsh(i,3)*1600;m.ico([Math.sin(a)*d,-200,Math.cos(a)*d],700+hsh(i,4)*700,mix3(hx('#14281c'),hx('#22402a'),hsh(i,6)),0,0.35,[8,12])}
  SF_BG=m.build(0.5)}
// ---------- background ----------
let BGPTS=[];
function phaePos(t){const c=camAt(t);const dir=V.norm([c.at[0]-c.eye[0],0,c.at[2]-c.eye[2]]);const side=[dir[2],0,-dir[0]];const k=ease((t-EV.k4)/(EV.res4+1.5-EV.k4));
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y,dir[2]*d+side[2]*s];return P(5200,lerp(-1300,1250,k),lerp(lerp(520,700,Math.sin(k*Math.PI)),300,ease((t-EV.c4+0.7)/0.8)))}
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  // R2: a FIREBALL crosses the sky and explodes
  if(rn===1&&t>=EV.s2-0.2){const k=clamp((t-EV.s2)/(EV.hit2-EV.s2),0,1);const st=P(14000,-9000,9000),en=P(11000,1200,4200);const cur=V.add(st,V.sc(V.sub(en,st),easeIn(k)*0.6+k*0.4));const d=V.norm(V.sub(en,st));
    if(t<EV.hit2){const g=0.6+0.4*k;items.push({mesh:GSPH,M:M4.trs(cur,0,0,0,120+180*k),tint:[0.9,1,0.85],tintAmt:1,add:1,alpha:1});
      for(let i=0;i<22;i++){const f=i/22;const q=V.sub(cur,V.sc(d,f*5200*g));items.push({mesh:GSPH,M:M4.trs(q,0,0,0,(150+120*k)*(1-f*0.85)),tint:mix3([0.75,1,0.6],[1,0.55,0.2],f),tintAmt:1,alpha:0.75*(1-f),add:1,noShadow:true})}
      BGPTS.push({p:cur,c:'190,255,190',r:1800+2600*k,a:0.85,cap:700})}
    else{const kk=t-EV.hit2;const fa=Math.max(0,1-kk/2.6);items.push({mesh:GSPH,M:M4.trs(cur,0,0,0,300+easeOut(kk/0.5)*1400),tint:[0.9,1,0.8],tintAmt:1,add:1,alpha:fa*0.8});
      BGPTS.push({p:cur,c:'210,255,200',r:9000*fa,a:fa,cap:1300});
      for(let i=0;i<26;i++){const dd=V.norm([hsh(i,3)-0.5,hsh(i,4)-0.7,hsh(i,5)-0.5]);const q=V.add(cur,V.sc(dd,kk*2600*(0.5+hsh(i,6))));q[1]-=kk*kk*500;if(kk<2.2)streak(items,q,dd,500*(1-kk/2.2),60,mix3([1,1,0.8],[1,0.5,0.15],kk/2),0.85*(1-kk/2.2))}}}
  // R4: 3200 PHAETHON looms past (red-hot side, crumb trail = the Geminids)
  if(rn===3&&t>=EV.k4-0.3){const a=ease((t-EV.k4+0.3)/1.0)*(1-ease((t-R[4]+0.6)/0.6));const pp=phaePos(t);const zoom=1+0.25*ease((t-EV.c4+0.8)/1.4);
    items.push({mesh:PHAE,M:M4.trs(pp,t*0.12,t*0.25,0.3,560*zoom),alpha:a});BGPTS.push({p:pp,c:'255,120,60',r:1600*zoom,a:0.3*a,cap:450});
    const pv=V.norm(V.sub(phaePos(t+0.1),pp));for(let i=0;i<60;i++){const f=hsh(i,21);const q=V.add(pp,V.add(V.sc(pv,-(600+f*5000)),[(hsh(i,22)-0.5)*600*(0.4+f),(hsh(i,23)-0.5)*450*(0.4+f),(hsh(i,24)-0.5)*600*(0.4+f)]));
      items.push({mesh:PCRUMB,M:M4.trs(q,t*0.6+i,i,0,(18+hsh(i,25)*50)*zoom),tint:[1,0.6,0.35],tintAmt:0.35*(1-f),alpha:a*(1-f*0.6)})}}
  // dawn sun (FINAL)
  if(rn>=4){const sp=V.sc(SUNDIR5,30000);items.push({mesh:SUNG,M:M4.trs(sp,0,0,0,1300)});BGPTS.push({p:sp,c:'255,215,150',r:6000,a:0.7*ease((t-R[4])/1.2),sun:1})}
  return{items,dir,side}}
