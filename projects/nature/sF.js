// ================= scene assembly =================
function lookZ(pos,dir,s){const z=V.norm(dir);let x=V.cross([0,1,0],z);if(V.len(x)<1e-4)x=[1,0,0];x=V.norm(x);const y=V.cross(z,x);s=s||1;return new Float32Array([x[0]*s,x[1]*s,x[2]*s,0,y[0]*s,y[1]*s,y[2]*s,0,z[0]*s,z[1]*s,z[2]*s,0,pos[0],pos[1],pos[2],1])}
const BOULDER=um(m=>blob(m,[0,0,0],1,p=>mix3(hx('#6a665e'),hx('#a09a8a'),clamp(p[1]*0.5+0.5,0,1)*0.7+vnoise(p[0]*5,p[2]*5)*0.3),11,1,[9,14]),0.6);
let LASTVP=null,LASTSAM=null,MQ=null,MSH=null,BUB=null,WHEAD=null,CRJ=null;
// ---- mantis shrimp
const MSS=1.8,MS0=[0.08,0,2.45];let IMP=null,MSP=null;
function msInit(){if(IMP)return;const S=samItems(EV.punch);IMP=lerp3(S.base,S.tip,0.86);MSP=[IMP[0]+0.045*MSS,Math.max(0,IMP[1]-0.36),IMP[2]+0.25*MSS+0.27]}
function mantisState(t){msInit();let p=MS0.slice(),roll=0,pitch=0,arm=1.35,aim=false,hop=0,yaw=Math.PI;
  const idle=Math.abs(Math.sin(t*5))*0.03;p[1]=idle*(t<EV.mWind?1:0);yaw+=0.15*Math.sin(t*1.7);
  if(t>=EV.mWind)arm=lerp(1.35,2.5,ease((t-EV.mWind)/0.4));
  if(t>=EV.mDash&&t<EV.bounce){const k=clamp((t-EV.mDash)/(EV.punch-EV.mDash),0,1);p=lerp3(MS0,MSP,easeIn(k));yaw=Math.PI;if(t>=EV.punch-0.05)aim=true}
  if(t>=EV.bounce){const k=clamp((t-EV.bounce)/0.8,0,1);const land=[MS0[0]+0.3,0,MS0[2]+0.2];p=lerp3(MSP,land,easeOut(k));p[1]=Math.max(0,MSP[1]*(1-k)+1.3*k*(1-k)*1.0);roll=Math.PI*easeOut(k)*1.0;pitch=-k*TAU2*0.5;pitch=0;if(k>=1){p[1]=0.2+0.01*Math.sin(t*20)}else p[1]+=0.2*k;arm=1.6+0.4*Math.sin(t*14);yaw=Math.PI+0.3}
  return{p,roll,pitch,arm,aim,yaw}}
function mantisItems(items,t){const st=mantisState(t);const Mb=M4.trs(st.p,st.yaw,st.pitch,st.roll,MSS);items.push({mesh:MANTIS,M:Mb});MSH=tp(Mb,[0,0.2,0.28]);
  for(const sh of MS_SH){let M;if(st.aim){const s=tp(Mb,sh);M=lookZ(s,V.sub(IMP,s),MSS*1.1)}else M=M4.mul(Mb,M4.trs(sh,0,st.arm,0,1));items.push({mesh:MARM,M})}}
// ---- pistol shrimp
const PSS=1.5;let PD=null;
function psInit(){if(PD)return;const S=samItems(EV.snap);PD=S.dango;PSH=V.add(PD,[0.055*PSS,-0.05*PSS-0.02,0.07+0.44*PSS])}
function pistolItems(items,t){psInit();const yaw=Math.PI+0.04*Math.sin(t*1.3);const p=V.add(PSH,[0,0.005*Math.abs(Math.sin(t*3)),0]);const Mb=M4.trs(p,yaw,0,0,PSS);items.push({mesh:PISTOL,M:Mb});
  items.push({mesh:BOULDER,M:M4.trs([PSH[0]-0.02,PSH[1]*0.48,PSH[2]+0.05],0.4,0,0,[0.26,PSH[1]*0.5+0.02,0.26]),tint:[0.35,0.42,0.3],tintAmt:0.5});
  let op=0;if(t>=EV.cock)op=ease((t-EV.cock)/0.5)*1.0;if(t>=EV.snap)op=Math.max(0,1-(t-EV.snap)/0.03);if(t>=EV.snap+1.5)op=0;
  const Mw=M4.mul(Mb,M4.trs(PCLAW_W,0,-0.05,0,1));items.push({mesh:PCLAW,M:Mw});items.push({mesh:PDACT,M:M4.mul(Mw,M4.trs(PDACT_H,0,-op*1.1,0,1))});
  BUB=tp(Mw,[0,0,0.28]);const k=t-EV.snap;
  if(k>=-0.02&&k<0.6){const r=k<0?0:(k<0.09?0.06*easeOut(k/0.09):0.06*Math.max(0,1-(k-0.09)/0.04));if(r>0.001)items.push({mesh:GSPH,M:M4.trs(BUB,0,0,0,r),alpha:0.5,noShadow:true});
    if(k>=0.1&&k<0.5){const f=(k-0.1)/0.4;items.push({mesh:UEMIS,M:M4.trs(BUB,0,0,0,0.03+0.35*easeOut(f)),tint:mix3([1,1,0.95],[1,0.5,0.15],f),tintAmt:1,alpha:1-f,add:1,noShadow:true});
      items.push({mesh:RING,M:M4.mul(lookZ(BUB,[0,1,0.0001],1),M4.trs([0,0,0],0,Math.PI/2,0,0.05+1.4*easeOut(f))),tint:[0.8,0.95,1],tintAmt:1,alpha:0.8*(1-f),add:1,noShadow:true})}}}
// ---- crocodile
function crocState(t){let z=9.6,hp=-0.04,jp=0.04,yw=Math.PI,stick=0;const crawl=clamp((t-R[2])/(EV.crocStop-R[2]),0,1);z=lerp(9.6,3.25,easeOut(crawl));
  const w=crawl<1?Math.sin(t*7):0;yw+=0.08*w;let tailS=0.25*Math.sin(t*(crawl<1?7:2));
  if(t>=EV.lunge-0.2){const k=clamp((t-EV.lunge+0.2)/0.3,0,1);hp=lerp(-0.04,-0.5,ease(k));jp=lerp(0.04,0.42,ease(k))}
  if(t>=EV.lunge){const k=clamp((t-EV.lunge)/0.25,0,1);z=lerp(3.25,2.55,easeOut(k))}
  if(t>=EV.jam){stick=1;hp=-0.42;jp=0.36;const k=clamp((t-EV.jam-0.1)/0.6,0,1);z=lerp(2.55,2.95,ease(k));const sh=clamp((t-EV.jam-0.2)/1.4,0,1);yw+=0.18*Math.sin((t-EV.jam)*16)*(sh<1?1-sh:0)*(t>EV.jam+0.2?1:0);tailS=0.5*Math.sin(t*9)*(1-sh)+0.15*Math.sin(t*2)}
  return{z,hp,jp,yw,stick,tailS}}
function crocItems(items,t){const st=crocState(t);const Mb=M4.trs([0,0,st.z],st.yw,0,0,1);items.push({mesh:CROC,M:Mb});
  const Mh=M4.mul(Mb,M4.trs(CR_HINGE,0,st.hp,0,1)),Mj=M4.mul(Mb,M4.trs(CR_HINGE,0,st.jp,0,1));items.push({mesh:CHEAD,M:Mh},{mesh:CJAW,M:Mj});
  let Mc=M4.mul(Mb,M4.trs([0,0.36,-1.0],0,0,0,1));for(let i=0;i<6;i++){const r=0.26*Math.pow(0.8,i),L=0.36;const sw=st.tailS*Math.sin(i*0.7+t*0)*(0.4+i*0.15);Mc=M4.mul(Mc,M4.trs([0,0,0],sw,0,0,1));items.push({mesh:CTAIL,M:M4.mul(Mc,M4.trs([0,0,0],0,0,0,[r*1.1,r*0.8,L]))});Mc=M4.mul(Mc,M4.trs([0,0,-L*0.95],0,0,0,1))}
  CRJ=tp(Mh,[0,0.1,0.7]);
  if(st.stick){const lo=tp(Mj,[0.02,0,0.62]),up=tp(Mh,[0.02,0.02,0.62]);const d=V.sub(up,lo);const L=V.len(d);const k=clamp((t-EV.jam)/0.08,0,1);items.push({mesh:STICK,M:frameM(V.sub(lo,V.sc(d,0.12)),d,[1,0,0],[1,(L*1.24)/0.5*k,1])})}}
// ---- whale
function whaleState(t){const x=-11+(t-R[3])*0.9;let y=-5.2;if(t>=EV.surf){y=lerp(-5.2,-0.75,easeOut((t-EV.surf)/1.4))}y+=0.12*Math.sin(t*1.3);return{p:[x,y,125],yaw:Math.PI/2,pitch:-0.05+0.03*Math.sin(t*1.1)}}
function whaleItems(items,t){const st=whaleState(t);const M=M4.trs(st.p,st.yaw,st.pitch,0,1);items.push({mesh:WHALE,M});WHEAD=tp(M,[0,0,7.6]);const bh=tp(M,[-0.6,1.75,7.0]);
  for(const ts of[EV.surf+1.3,EV.tiny+0.5]){const k=t-ts;if(k>=0&&k<2.5){for(let j=0;j<10;j++){const f=clamp(k/2.5,0,1);const q=V.add(bh,[Math.sin(j*2.3)*0.5*f*3,0.3+j*0.45*Math.min(1,k*3)+f*1.5,Math.cos(j*1.7)*0.5*f*3]);items.push({mesh:PUFF,M:M4.trs(q,j,0,0,0.35+f*1.2+j*0.05),tint:[1,1,1],tintAmt:0.4,alpha:0.7*(1-f),noShadow:true})}}}
  // underwater click rings
  const c=[WHEAD[0],-0.5,WHEAD[2]];for(let j=0;j<4;j++){const k=t-EV.click-j*0.22;if(k<0||k>2.2)continue;const r=0.5+k*13;const a=clamp(1-k/2.2,0,1);items.push({mesh:RING,M:M4.trs(c,0,0,0,[r,1,r]),tint:[0.35,0.95,1],tintAmt:1,alpha:0.75*a,add:1,noShadow:true})}
  // reflection at the shore (z=110)
  for(let j=0;j<3;j++){const k=t-EV.bounceW-j*0.22;if(k<0||k>1.8)continue;const c2=[WHEAD[0],-0.6,110-(WHEAD[2]-110)];const r=(WHEAD[2]-110)+0.5-k*4;const rr=(WHEAD[2]-110)+k*9;items.push({mesh:RING,M:M4.trs([WHEAD[0],-0.5,WHEAD[2]],0,0,0,[Math.max(0.5,15-k*9),1,Math.max(0.5,15-k*9)]),tint:[0.5,0.9,1],tintAmt:1,alpha:0.55*(1-k/1.8),add:1,noShadow:true})}}
// ---- mosquito
const MQS=0.07;const MQK=[[EV.sl1-0.15,[0.35,1.72,0.5]],[EV.sl1+0.1,[-0.45,1.95,0.35]],[EV.sl2-0.15,[-0.45,1.95,0.35]],[EV.sl2+0.1,[0.55,1.45,0.6]],[EV.sl3-0.15,[0.55,1.45,0.6]],[EV.sl3+0.1,[0.05,2.2,0.55]],[EV.sl3+0.6,[0.05,2.2,0.55]]];
function mosqPos(t,S){const wob=[0.02*Math.sin(t*23),0.025*Math.sin(t*17),0.02*Math.cos(t*19)];let p;
  if(t<EV.boss-0.4){const k=ease((t-R[4])/(EV.boss-0.4-R[4]));p=lerp3([2.5,2.4,3.5],MQH,k)}
  else if(t<EV.buzz)p=MQH;
  else if(t<MQK[0][0]){const a=(t-EV.buzz)*4.5;const k=clamp((t-EV.buzz)/0.4,0,1);p=lerp3(MQH,[Math.sin(a)*0.5,1.68+0.12*Math.sin(a*2.3),Math.cos(a)*0.5],k);const e=clamp((t-MQK[0][0]+0.3)/0.3,0,1);p=lerp3(p,MQK[0][1],e)}
  else if(t<MQK[MQK.length-1][0]){for(let i=0;i<MQK.length-1;i++){if(t<MQK[i+1][0]){const k=easeOut((t-MQK[i][0])/(MQK[i+1][0]-MQK[i][0]));p=lerp3(MQK[i][1],MQK[i+1][1],k);break}}}
  else if(t<EV.mland-0.5){const a=(t-MQK[MQK.length-1][0])*3.5;const k=clamp((t-MQK[MQK.length-1][0])/0.5,0,1);p=lerp3(MQK[MQK.length-1][1],[Math.sin(a+1)*0.45,1.85+0.1*Math.sin(a*2),Math.cos(a+1)*0.45],k)}
  else{const F=tp(S.Hm,[0.02,0.19,0.26]);if(t<EV.mland){const a=(EV.mland-0.5-MQK[MQK.length-1][0])*3.5;const p0=[Math.sin(a+1)*0.45,1.85+0.1*Math.sin(a*2),Math.cos(a+1)*0.45];p=lerp3(p0,F,ease((t-EV.mland+0.5)/0.5))}
    else if(t<EV.slap-0.08){return F}
    else if(t<EV.floor+0.6){const k=t-EV.slap+0.08;p=V.add(F,[0.5*k,0.9*k,0.7*k])}
    else{const H=S.head;const tgt=V.add(H,[0.15,0.35,0.15]);const k=ease((t-EV.floor-0.6)/1.0);const F2=V.add(F,[0.5*0.68,0.9*0.68,0.7*0.68]);p=lerp3(F2,tgt,k)}}
  return V.add(p,wob)}
function mosqItems(items,t,S){const p=mosqPos(t,S);const q=mosqPos(t+0.03,S);let d=V.sub(q,p);d[1]=0;let yaw=V.len(d)>0.002?Math.atan2(d[0],d[2]):Math.atan2(1.5-p[0],2.5-p[2]);const onF=t>=EV.mland&&t<EV.slap-0.08;if(onF)yaw=Math.PI;
  const pitch=onF?0.5:0.1;const M=M4.trs(p,yaw,pitch,0,MQS);items.push({mesh:MOSQ,M,noShadow:true});if(t>=EV.bite+0.4)items.push({mesh:MBLOOD,M,noShadow:true});
  const fl=onF?0.15:0.7*Math.sin(t*157);for(const sx of[-1,1]){items.push({mesh:WING,M:M4.mul(M,M4.trs([sx*0.08,0.12,0.18],sx>0?0.2:-0.2+Math.PI*0,0,0,[sx,1,1])),alpha:0.45,noShadow:true});
    items.push({mesh:WING,M:M4.mul(M,M4.mul(M4.trs([sx*0.08,0.12,0.18],0,0,sx*fl,1),M4.trs([0,0,0],0,0,0,[sx,1,1]))),alpha:0.35,noShadow:true})}
  MQ=p}
function fgItems(t){const rn=roundAt(t);const wt=worldTint(t);const W_={tint:wt.c,tintAmt:wt.a};const items=[Object.assign({mesh:WORLD},W_),{mesh:SEA,tint:wt.c,tintAmt:wt.a*0.6},Object.assign({mesh:MOUNT},W_)];
  const S=samItems(t);LASTSAM=S;items.push(...S.items);MQ=null;MSH=null;BUB=null;WHEAD=null;CRJ=null;
  if(rn<0||rn===0)petals(items,t,[0,0,0],rn<0?40:30);
  if(rn===0)mantisItems(items,t);
  if(rn===1)pistolItems(items,t);
  if(rn===2)crocItems(items,t);
  if(rn===3)whaleItems(items,t);
  if(rn===4||t>=R[5])mosqItems(items,t,S);
  return items}
function renderScene(t){psInit();msInit();let tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const c=camAt(tt);const items=fgItems(tt);const root=(LASTSAM&&LASTSAM.o.root)||[0,0,0];
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.02,far:14000},{center:[root[0],root[1]+0.4,root[2]+(roundAt(tt)===2?1.4:0)],radius:roundAt(tt)===2?7:6.5},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S_(R[0],6,0.4);S_(EV.punch,18,0.5);S_(EV.snap,14,0.45);S_(EV.lunge,10,0.4);S_(EV.jam,8,0.3);S_(EV.click,6,0.5);S_(EV.boss,6,0.4);S_(EV.slap,10,0.3);S_(EV.floor,20,0.45);return a}
