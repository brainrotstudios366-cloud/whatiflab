// ================= scene assembly =================
const MET_S0=[30,230,440],MET_C=[0,14,16],MET_R=15,MLAND=[[-16,0,-65],[16,0,-65]];
function metPos(t){const k=clamp((t-R[1])/(EV.cut-R[1]),0,1);return lerp3(MET_S0,MET_C,Math.pow(k,1.7))}
function halfPos(t,sx){const k=clamp((t-EV.cut)/(EV.boom-EV.cut),0,1);const kk=Math.pow(k,1.25);const p=lerp3(MET_C,MLAND[sx>0?1:0],kk);p[0]+=sx*6*Math.sin(Math.min(1,k*3)*Math.PI/2);p[1]+=8*Math.sin(k*Math.PI)*(1-k);return p}
function waveZ(t){if(t<31)return lerp(1500,420,(t-R[2])/(31-R[2]));if(t<EV.wcut)return lerp(420,42,easeOut((t-31)/(EV.wcut-31)));return 42-30*(t-EV.wcut)}
let LASTVP=null,LASTSAM=null,LASTDRA=null,LASTMOSQ=null;
function fgItems(t){const rn=roundAt(t);const items=[{mesh:WORLD},{mesh:SEA},{mesh:MOUNT}];
  const S=samItems(t);LASTSAM=S;items.push(...S.items);
  if(rn<=0||rn>=4)petals(items,t,[0,0,0],80);else if(rn===1&&t<EV.metUp)petals(items,t,[0,0,0],40);else if(rn===3&&t>=EV.bow)petals(items,t,[0,0,0],50);
  // ---- stage 1
  if(rn===0){if(t<EV.click){const z=crowdZ(t);const fr=t<EV.spin?Math.floor(t*6)%2:0;for(let n=0;n<4;n++)items.push({mesh:CROWD.run[(fr+n)%2],M:M4.trs([0,0,z+n*31],0,0,0,1),noShadow:true})}
      else{const z=crowdZ(t);for(let n=0;n<4;n++)items.push({mesh:CROWD.down,M:M4.trs([0,0,z+n*31],0,0,0,1),noShadow:true})}
    if(t>=5.4){for(const L of LEAP){const p=ninjaLeapPose(L,t);items.push(...charItems(p).items)}}
    {const k=t-EV.spin-0.12;if(k>=0&&k<0.9){const r=1+75*easeOut(k/0.9);items.push({mesh:DUSTRING,M:M4.trs([0,0.9,0],0,0,0,[r,0.25,r]),tint:[1,1,1],tintAmt:0.8,alpha:0.7*(1-k/0.9),add:1,noShadow:true})}}
    {const k=t-EV.click;if(k>=0&&k<1.0){for(const L of LEAP){const p=[Math.sin(L.a)*L.r1,L.h,Math.cos(L.a)*L.r1];for(let j=0;j<3;j++)items.push({mesh:PUFF,M:M4.trs(V.add(p,[Math.sin(j*2.1)*0.3,0.6+j*0.15,Math.cos(j*2.1)*0.3]),j,0,0,0.3+k*0.6),tint:[1,1,1],tintAmt:0.3,alpha:0.85*(1-k),noShadow:true})}
      const r=6+60*easeOut(k/1.0);items.push({mesh:DUSTRING,M:M4.trs([0,0,25],0,0,0,[r*1.5,1.2+k*2,r]),alpha:0.6*(1-k),noShadow:true})}}}
  if(rn===0&&t>=EV.tea-0.2||rn===1&&t<R[1]+1.2){/* tea already handled by cup */}
  // ---- stage 2 meteor
  if(rn===1){if(t<EV.cut){const p=metPos(t);items.push({mesh:METEOR,M:M4.trs(p,t*0.7,t*0.5,0,MET_R),tint:[1,0.4,0.1],tintAmt:clamp((t-EV.metUp)/2,0,0.25)});
      items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,MET_R*1.35),tint:[1,0.55,0.15],tintAmt:1,alpha:0.35,add:1,noShadow:true});
      for(let i=1;i<16;i++){const q=metPos(t-i*0.07);const d=V.sub(MET_S0,MET_C);const qq=V.add(q,V.sc(V.norm(d),i*2.2));items.push({mesh:UEMIS,M:M4.trs(qq,0,0,0,MET_R*(1.15-i*0.055)),tint:mix3([1,0.85,0.4],[0.6,0.15,0.05],i/16),tintAmt:1,alpha:0.4*(1-i/16),add:1,noShadow:true})}}
    else{for(const sx of[-1,1]){const p=halfPos(t,sx);const sp=(t-EV.cut)*1.2;const M=M4.trs(p,sx>0?0:Math.PI,sp*sx*0.3,sp*0.4*sx,MET_R);if(t<EV.boom){items.push({mesh:METHALF,M});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,MET_R*1.2),tint:[1,0.6,0.2],tintAmt:1,alpha:0.25,add:1,noShadow:true});
        for(let i=1;i<10;i++){const q=halfPos(t-i*0.05,sx);items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,MET_R*(0.9-i*0.07)),tint:mix3([1,0.8,0.4],[0.5,0.15,0.05],i/10),tintAmt:1,alpha:0.3*(1-i/10),add:1,noShadow:true})}}
        fireball(items,MLAND[sx>0?1:0],t-EV.boom,20)}}}
  // ---- stage 3 tsunami
  if(rn===2){const z=waveZ(t);const sy=t<EV.wcut?lerp(0.45,1,clamp((t-R[2])/4.5,0,1)):Math.max(0.05,1-smst(-60,-220,z));
    if(t<EV.wcut)items.push({mesh:WAVE,M:M4.trs([0,-0.6,z],0,0,0,[1,sy,1]),noShadow:true});
    else{const g=3.5*easeOut((t-EV.wcut)/0.8);items.push({mesh:WAVEL,M:M4.trs([-g,-0.6,z],0,0,0,[1,sy,1]),noShadow:true});items.push({mesh:WAVER,M:M4.trs([g,-0.6,z],0,0,0,[1,sy,1]),noShadow:true});
      for(let i=0;i<22;i++){const sx=i%2?1:-1;const k=((t-EV.wcut)*1.3+hsh(i,1))%1;const q=[sx*(g+3+hsh(i,2)*8),5+k*40*hsh(i,3)+10,z+hsh(i,4)*20-5];items.push({mesh:PUFF,M:M4.trs(q,i,0,0,3+k*8),tint:[0.9,0.96,0.98],tintAmt:0.6,alpha:0.5*(1-k),noShadow:true})}}
    for(let i=0;i<30;i++){const x=-300+i*20+hsh(i,7)*10;const k=((t*0.8+hsh(i,8))%1);items.push({mesh:PUFF,M:M4.trs([x,72*sy*0.95+k*8,z-10+hsh(i,9)*8],i,0,0,4+k*5),tint:[0.92,0.97,0.98],tintAmt:0.6,alpha:0.55*(1-k),noShadow:true})}}
  // ---- stage 4 dragon
  if(rn===3){LASTDRA=dragonItems(items,t);
    if(t>=EV.fire0&&t<EV.fire1+1.0){const M0=LASTDRA.mouth;const tgt=[0,1.4,0.9];for(let i=0;i<110;i++){const te=EV.fire0+i*0.022;if(te>t||te>EV.fire1)continue;const a=t-te;const d=V.sub(tgt,M0);const L=V.len(d);const s=a*16;let p;
        if(s<L)p=V.add(M0,V.sc(d,s/L));else{const ex=s-L;const ang=hsh(i,3)*TAU2;p=V.add(tgt,[Math.cos(ang)*ex*0.9,Math.sin(ang)*ex*0.6+ex*0.1,-ex*0.8])}if(a>1.1)continue;
        const sz=0.12+a*0.8;items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,sz),tint:mix3([1,0.8,0.35],[0.9,0.2,0.03],clamp(a/0.6,0,1)),tintAmt:1,alpha:clamp(0.26-a*0.2,0,1),add:1,noShadow:true})}}
    if(t>=EV.fire0&&t<EV.fire1+0.1){const H=S.hands[-1];items.push({mesh:DISC2,M:frameM(V.add(H,[0,0.0,0.05]),[0,0,1],[0,1,0],[0.85,1,0.85]),tint:[0.85,0.95,1],tintAmt:1,alpha:0.28,add:1,noShadow:true})}
    if(t>=EV.dcut&&t<EV.dcut+2){const k=t-EV.dcut;const p0=tp(LASTDRA.HM,[0.7,1.4,-1.2]);const y=Math.max(0.1,p0[1]-4.9*k*k);if(k<1.5)items.push({mesh:CONE,M:M4.trs([p0[0]+k*1.5,y,p0[2]],k*5,k*7,0,[0.1,0.5,0.1]),tint:DC.horn,tintAmt:1})}}
  // ---- final mosquito
  if(rn===4||t>=R[5]){const fwd=td(S.Hm,[0,0,1]);const hp=tp(S.Hm,[0,0.2,0.06]);const p=mosqPos(t,hp,fwd);LASTMOSQ=p;mosqItems(items,t,p,t>=EV.land2&&t<EV.slap)}
  return items}
function renderScene(t){let tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const c=camAt(tt);const items=fgItems(tt);const root=(LASTSAM&&LASTSAM.o.root)||[0,0,0];
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.05,far:14000},{center:[root[0],root[1]+0.4,root[2]],radius:6.5},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S_(EV.spin+0.1,10,0.5);S_(EV.click,14,0.6);if(t>=R[0]&&t<EV.spin)a+=2.5*clamp((t-R[0])/3,0,1);
  if(t>=EV.metUp&&t<EV.cut)a+=6*clamp((t-EV.metUp)/1.9,0,1);S_(EV.cut,22,0.5);S_(EV.land,16,0.5);S_(EV.boom,16,1.5);
  if(t>=31&&t<EV.wcut)a+=5*clamp((t-31)/2.6,0,1);S_(EV.wcut,24,0.6);if(t>=EV.wcut&&t<36.5)a+=8*(1-(t-EV.wcut)/2.9);
  S_(EV.roar,16,1.0);if(t>=EV.fire0&&t<EV.fire1)a+=5;S_(EV.dcut,20,0.5);S_(EV.dland,10,0.4);S_(EV.slap,18,0.4);S_(EV.slap+0.6,12,0.4);return a}
