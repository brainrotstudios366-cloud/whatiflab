// ================= quadruped rig (cat / dog / bear) =================
const SP={
  cat:{main:hx('#ee963f'),main2:hx('#c86e22'),belly:hx('#fff3e2'),nose:hx('#f2909f'),len:0.34,chest:[0.125,0.14,0.15],hip:[0.125,0.14,0.14],mid:[0.115,0.13,0.17],shH:0.31,hpH:0.31,legX:0.065,legU:0.16,legL:0.16,legR:0.032,paw:[0.04,0.028,0.052],socks:1,
    head:0.125,headOff:[0,0.12,0.1],ear:'cat',muz:'cat',tail:[11,0.043,0.03,0.022],iris:hx('#a6d63c'),eye:[0.056,0.022,0.097,0.037],slit:1,gait:[0,0.5,0.5,0]},
  dog:{main:hx('#c98a4b'),main2:hx('#8a5428'),belly:hx('#f2e2c8'),nose:hx('#1a1414'),len:0.4,chest:[0.13,0.15,0.16],hip:[0.12,0.13,0.14],mid:[0.115,0.12,0.19],shH:0.36,hpH:0.35,legX:0.07,legU:0.18,legL:0.18,legR:0.034,paw:[0.042,0.028,0.055],
    head:0.12,headOff:[0,0.14,0.1],ear:'flop',muz:'dog',tail:[7,0.045,0.026,0.016],iris:hx('#3a2412'),eye:[0.052,0.035,0.1,0.03],gait:[0,0.12,0.5,0.62]},
  bear:{main:hx('#6e4526'),main2:hx('#4a2c16'),belly:hx('#9b6a42'),nose:hx('#151010'),len:0.42,chest:[0.17,0.2,0.19],hip:[0.165,0.19,0.18],mid:[0.16,0.19,0.2],shH:0.31,hpH:0.31,legX:0.09,legU:0.16,legL:0.15,legR:0.052,paw:[0.06,0.035,0.07],
    head:0.12,headOff:[0,0.12,0.13],ear:'round',muz:'bear',tail:[2,0.03,0.04,0.03],iris:hx('#2a1a10'),eye:[0.05,0.035,0.098,0.024],gait:[0,0.5,0.5,0]}};
const DOGCOL=[[hx('#c98a4b'),hx('#8a5428'),hx('#f2e2c8')],[hx('#2e2a2a'),hx('#1a1616'),hx('#d8c8b0')],[hx('#efe6d8'),hx('#b89878'),hx('#ffffff')],[hx('#a8642e'),hx('#5a3418'),hx('#f0d8b0')]];
const ell=(c,dir,s)=>frameM(c,V.norm(dir),Math.abs(V.norm(dir)[1])>0.95?[0,0,1]:[0,1,0],s);
function quad(spName,st,items){const sp=SP[spName];const col=st.col||[sp.main,sp.main2,sp.belly];const[MAIN,MAIN2,BELLY]=col;const sc=st.sc||1;
  const RM=M4.mul(M4.mul(M4.trs(st.pos,st.yaw||0,st.rx||0,st.rz||0,1),M4.trs([0,-(st.piv||0),0],0,0,0,1)),M4.trs([0,0,0],0,0,0,sc));
  const sh=st.noShadow;const put=(mesh,M,tint,ns,extra)=>items.push(Object.assign({mesh,M:M4.mul(RM,M),tint,tintAmt:tint?1:0,noShadow:ns||sh},extra||{}));
  const sit=st.sit||0,cr=st.crouch||0,ar=st.arch||0,pf=st.puff||0,ph=st.gait?st.gait.ph:0,ga=st.gait?st.gait.amp:0;
  const bob=st.gait?0.012*Math.sin(ph*TAU2*2)*Math.min(1,ga*8):0;const br=(st.breath==null?1:st.breath)*0.004*Math.sin((st.t||0)*3);
  const S=[0,sp.shH-cr*0.08+sit*0.03+bob+br+ar*0.03,sp.len/2-sit*0.04],H=[0,sp.hpH-cr*0.08-sit*(sp.hpH-0.11)+bob*0.6+ar*0.03,-sp.len/2+sit*0.06];
  const dir=V.sub(S,H),mid=V.add(lerp3(H,S,0.5),[0,ar*0.1,0]);const pk=1+0.22*pf;
  const sv=a=>[a[0]*pk,a[2],a[1]*pk];
  put(USPH,ell(H,dir,sv(sp.hip)),MAIN);put(USPH,ell(mid,dir,[sp.mid[0]*pk,sp.mid[2]*0.8,sp.mid[1]*pk]),MAIN);put(USPH,ell(S,dir,sv(sp.chest)),MAIN);
  put(USPH,ell(V.add(S,[0,-0.035,0.04]),dir,V.sc(sv(sp.chest),0.82)),BELLY,1);put(USPH,ell(V.add(mid,[0,-0.045,0]),dir,[sp.mid[0]*0.8*pk,sp.mid[2]*0.7,sp.mid[1]*0.8*pk]),BELLY,1);
  if(pf>0.05){for(let i=0;i<11;i++){const k=0.1+i*0.08;const p=V.add(lerp3(H,S,k),[0,(sp.mid[1]*pk)*0.95+ar*0.1*Math.sin(Math.PI*k),0]);put(CONE,M4.trs(V.add(p,[(hsh(i,4)-0.5)*0.04,0.02*pf,0]),0,(hsh(i,5)-0.5)*0.6,(hsh(i,6)-0.5)*0.9,[0.022,0.07*pf,0.022]),MAIN,1)}}
  // legs
  const paws=st.paws||{};const L=[['FL',1,S,1,sp.gait[0]],['FR',-1,S,1,sp.gait[1]],['BL',1,H,0,sp.gait[2]],['BR',-1,H,0,sp.gait[3]]];
  for(const[nm,sx,base,front,off]of L){const A=V.add(base,[sx*sp.legX,front?-0.05:-0.03,front?0.02:-0.02]);
    let T;if(paws[nm])T=paws[nm];else{let z=front?S[2]+0.02:H[2]+(sit?0.13*sit:0);let y=0;
      if(st.gait&&ga>0){const f=((ph+off)%1+1)%1;if(f<0.45){const k=f/0.45;z+=lerp(-ga/2,ga/2,ease(k));y=0.06*Math.sin(Math.PI*k)*Math.min(1,ga*5)}else{z+=lerp(ga/2,-ga/2,(f-0.45)/0.55)}}
      T=[sx*(sp.legX+(front?-0.01*sit:0.02*sit)),y,z]}
    if(st.splay){T=V.add(A,[sx*0.16,-0.08,front?0.12:-0.12])}
    if(st.dangle){T=V.add(A,[sx*0.02,-0.27,front?0.04:-0.04])}
    const r=ik2(A,T,sp.legU,sp.legL,front?[0,0,-1]:[0,0,1]);const E=r.E,F=r.H;
    put(USPH,ell(lerp3(A,E,0.5),V.sub(E,A),[sp.legR*(front?1.25:1.7)*pk,sp.legU*0.62,sp.legR*(front?1.25:1.7)*pk]),MAIN);
    put(USPH,ell(lerp3(E,F,0.5),V.sub(F,E),[sp.legR*pk,sp.legL*0.58,sp.legR*pk]),MAIN);
    put(USPH,M4.trs(V.add(F,[0,sp.paw[1]*0.6,0.012]),0,0,0,sp.paw),sp.socks&&front?BELLY:MAIN,0)}
  // tail
  {const[n,sl,r0,r1]=sp.tail;const tl=st.tail||{};const up=tl.up==null?0.35:tl.up,curl=tl.curl==null?0.6:tl.curl,wag=tl.wag||0,wp=tl.ph||0,side=tl.side||0;let p=V.add(H,[0,0.05,-sp.hip[2]*0.8]);let th=up*Math.PI/2;
    for(let i=0;i<n;i++){const k=i/(n-1);const phi=side*k*1.6+wag*Math.sin(wp*TAU2-i*0.55)*(0.3+k);th+=curl*1.2/n;const d=[Math.sin(phi)*Math.cos(th),Math.sin(th),-Math.cos(phi)*Math.cos(th)];p=V.add(p,V.sc(d,sl));
      const rr=lerp(r0,r1,k)*(1+pf*1.1);put(USL,M4.trs(p,0,0,0,rr*1.15),i>=n-2&&spName==='cat'?MAIN2:MAIN,i>2)}}
  // head
  const HC=V.add(S,V.add(sp.headOff,[0,sit*0.04-cr*0.03,-sit*0.02]));const hs=sp.head/0.125;
  put(USPH,ell(lerp3(V.add(S,[0,0.04,0.03]),HC,0.5),V.sub(HC,V.add(S,[0,0.04,0.03])),[0.075*hs*pk,0.09*hs,0.07*hs*pk]),MAIN);
  const HM=M4.mul(M4.trs(HC,st.headY||0,st.headP||0,st.headR||0,1),M4.trs([0,0,0],0,0,0,hs));
  const hp=(mesh,p,s,tint,rot,ns,extra)=>put(mesh,M4.mul(HM,M4.trs(p,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint,ns==null?1:ns,extra);
  hp(USPH,[0,0,0],[0.14,0.12,0.125],MAIN,null,0);
  const mo=st.mouth||0;const E=st.eyes||{};const lid=clamp(E.lid||0,0,1);
  if(sp.muz==='cat'){for(const sx of[-1,1])hp(USPH,[sx*0.034,-0.045,0.093],[0.044,0.038,0.04],BELLY);hp(USPH,[0,-0.07-mo*0.03,0.08],[0.03,0.022,0.026],BELLY);hp(USPH,[0,-0.018,0.124],[0.019,0.012,0.012],sp.nose)}
  else{const L=sp.muz==='dog'?0.1:0.08;hp(USPH,[0,-0.04,0.1],[0.066,0.055,L],sp.muz==='dog'?BELLY:SP.bear.belly);hp(USPH,[0,-0.018,0.1+L*0.98],[0.03,0.022,0.02],sp.nose);
    hp(USPH,[0,-0.08-mo*0.035,0.095],[0.05,0.022,L*0.8],sp.muz==='dog'?BELLY:SP.bear.belly)}
  const ef=st.ears||0;
  if(sp.ear==='cat')for(const sx of[-1,1]){const rz=-sx*(0.32+ef*1.15),rx=-0.15-ef*0.5;hp(CONE,[sx*0.07,0.118-ef*0.04,-0.01],[0.06,0.115,0.032],MAIN,[0,rx,rz],0);hp(CONE,[sx*0.068,0.112-ef*0.04,0.006],[0.04,0.085,0.016],sp.nose,[0,rx,rz])}
  if(sp.ear==='flop')for(const sx of[-1,1])hp(USPH,[sx*0.115,-0.01,-0.005],[0.026,0.085,0.055],MAIN2,[0,0,sx*(0.25+0.25*Math.sin(ph*TAU2*2+sx)*Math.min(1,ga*5))]);
  if(sp.ear==='round')for(const sx of[-1,1]){hp(USPH,[sx*0.09,0.095,-0.01],[0.043,0.043,0.025],MAIN);hp(USPH,[sx*0.09,0.093,0.006],[0.026,0.026,0.012],MAIN2)}
  // eyes
  const[ex,ey,ez,er]=sp.eye;const lk=E.look||[0,0];
  for(const sx of[-1,1]){const p=[sx*ex,ey,ez];
    if(E.x){for(const d of[-1,1])hp(UB,[p[0],p[1],p[2]+0.012],[er*2.0,er*0.4,er*0.4],[0.08,0.06,0.08],[0,0,d*0.78]);continue}
    if(lid>=0.97){hp(UB,[p[0],p[1]-er*0.1,p[2]+0.004],[er*1.8,er*0.3,er*0.3],MAIN2,[0,0,sx*(E.happy?-0.35:0)]);continue}
    const ir=E.glow?[1,0.3,0.15]:sp.iris;hp(USPH,p,[er,er*1.15*(1-lid),er*0.5],ir,null,1,E.glow?{mesh:UEMIS}:null);
    const pw=sp.slit?(E.tiny?0.16:(E.wide?0.75:0.3)):(E.tiny?0.3:0.62);const pp=[p[0]+lk[0]*er*0.35,p[1]+lk[1]*er*0.3,p[2]+er*0.4];hp(USPH,pp,[er*pw,er*0.9*(1-lid)*(sp.slit&&!E.tiny?1:0.7),er*0.15],[0.04,0.03,0.04]);
    hp(USPH,[p[0]+er*0.3,p[1]+er*0.35*(1-lid),p[2]+er*0.48],[er*0.2,er*0.2,er*0.06],[1,1,1]);
    if(lid>0.05)hp(USPH,[p[0],p[1]+er*(1.1-lid*1.1),p[2]+0.004],[er*1.08,er*0.35,er*0.48],MAIN);
    if(E.brow!=null)hp(UB,[p[0],p[1]+er*1.45-lid*er*0.6,p[2]+0.004],[er*1.7,er*0.32,er*0.35],spName==='cat'?MAIN2:[0.1,0.07,0.06],[0,0,sx*E.brow])}
  // mouth
  if(mo>0.02){const mz=sp.muz==='cat'?0.1:0.12+(sp.muz==='dog'?0.04:0.02);hp(USPH,[0,-0.062-mo*0.015,mz],[0.036,0.032*mo,0.018],[0.28,0.06,0.08]);hp(USPH,[0,-0.07-mo*0.03,mz-0.002],[0.022,0.008,0.016],hx('#e86a80'));
    if(sp.muz!=='dog'||mo>0.5)for(const sx of[-1,1])hp(CONE,[sx*0.017,-0.06-mo*0.004,mz+0.008],[0.006,0.018*Math.min(1,mo*2),0.006],[1,1,1],[0,0,Math.PI])}
  if(st.tongue)hp(USPH,[0.004,-0.075,0.128+(sp.muz==='dog'?0.06:0)],[0.02,0.008+0.02*(sp.muz==='dog'?1:0),0.026],hx('#ef7088'),[0,0.4,0]);
  if(sp.muz==='cat')for(const sx of[-1,1])for(let j=0;j<3;j++){const a=tp(HM,[sx*0.05,-0.042+j*0.008,0.112]),b=tp(HM,[sx*0.17,-0.03+j*0.02-0.02,0.1-j*0.012]);items.push({mesh:UCL,M:M4.mul(RM,segM(a,b,0.0022)),tint:[0.95,0.93,0.9],tintAmt:1,noShadow:true})}
  return{RM,HM:M4.mul(RM,HM),head:tp(M4.mul(RM,HM),[0,0.05,0])}}
