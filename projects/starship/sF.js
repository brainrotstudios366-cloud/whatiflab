// ================= scene assembly =================
function lookZ(pos,dir,s){const z=V.norm(dir);let x=V.cross([0,1,0],z);if(V.len(x)<1e-4)x=[1,0,0];x=V.norm(x);const y=V.cross(z,x);s=s||1;return new Float32Array([x[0]*s,x[1]*s,x[2]*s,0,y[0]*s,y[1]*s,y[2]*s,0,z[0]*s,z[1]*s,z[2]*s,0,pos[0],pos[1],pos[2],1])}
function fireball(items,p,k,s){if(k<0)return;if(k<1.6){const r=s*(0.35+0.8*easeOut(k/0.35));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.35,0.08],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.6,0,1),add:1,noShadow:true})}
  if(k>0.3&&k<6){for(let j=0;j<6;j++){const f=clamp((k-0.3)/5.7,0,1);const q=[p[0]+Math.sin(j*2.1)*s*0.5*(0.5+f),p[1]+s*(0.6+f*2.2+j*0.12),p[2]+Math.cos(j*1.7)*s*0.5*(0.5+f)];items.push({mesh:PUFF,M:M4.trs(q,j,0,0,s*(0.6+f*1.2)),tint:[0.3,0.27,0.27],tintAmt:0.8,alpha:0.85*(1-f),noShadow:true})}}}
const glowS=(items,p,r,col,a)=>items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true});
let LASTVP=null,LASTSAM=null,TIP=null,FACE=null,TILEP=null,ICEP=null,SHIPC=null,BOOSTB=null;
function lazyInit(){if(!TIP){TIP=samItems(EV.catch).chopTip||[0,2.4,0]}if(!FACE){const S=samItems(EV.bonk);FACE=tp(S.Hm,[0.02,0.21,0.2])}}
// ---------- R1: stack on the pad, liftoff, blast wave ----------
const SDIR=V.norm([-PAD[0],0,-PAD[2]]),SPERP=[SDIR[2],0,-SDIR[0]],SDIST=Math.hypot(PAD[0],PAD[2]);
function rocketAlt(t){return t<EV.lift?0:0.5*11*Math.pow(t-EV.lift,2)}
function stackItems(items,t){const alt=rocketAlt(t);const b=[PAD[0],22+alt,PAD[2]];const tilt=t>EV.lift+3?Math.min(0.25,(t-EV.lift-3)*0.03):0;
  const M=M4.trs(b,0.4,0,-tilt,1);items.push({mesh:BOOST,M},{mesh:SHIP,M:M4.mul(M,M4.trs([0,71.8,0],0,0,0,1))});TRK.RK1=tp(M,[0,40,0]);
  if(t>=EV.ign){const k=clamp((t-EV.ign)/0.5,0,1);const fl=0.85+0.15*Math.sin(t*53);const L=(alt<5?12:30+Math.min(60,alt*0.2))*k*fl;
    const bot=tp(M,[0,-2,0]);items.push({mesh:UEMIS,M:M4.trs(V.add(bot,[0,-L*0.5,0]),0.4,0,-tilt,[4.2,L*0.5,4.2]),tint:[1,0.78,0.42],tintAmt:1,alpha:0.85,add:1,noShadow:true});
    items.push({mesh:UEMIS,M:M4.trs(V.add(bot,[0,-L*0.3,0]),0.4,0,-tilt,[2.6,L*0.35,2.6]),tint:[1,0.98,0.9],tintAmt:1,alpha:0.9,add:1,noShadow:true});
    glowS(items,V.add(bot,[0,-3,0]),9*k,[1,0.6,0.25],0.35)}
  // tower lights
  if(t<R[0]+1)for(let i=0;i<10;i++)glowS(items,[PAD[0]-17+(i%2?6:-6),12+i*14,PAD[2]-2+6],0.9,[1,0.85,0.6],0.8)}
function blastItems(items,t){if(t<EV.ign+0.2||t>EV.hit+5)return;const s=12+90*(t-EV.ign-0.25);const fade=clamp((EV.cool-0.5-t)/1.5,0,1);
  // billowing pad clouds
  for(let j=0;j<26;j++){const a=hsh(j,9)*TAU2;const age=t-EV.ign-0.2-hsh(j,8)*0.6;if(age<0)continue;const r=Math.min(60,10+age*22)*(0.7+0.5*hsh(j,7));const p=[PAD[0]+Math.cos(a)*r,3+hsh(j,6)*8+age*2,PAD[2]+Math.sin(a)*r];
    items.push({mesh:PUFF,M:M4.trs(p,j,0,0,6+age*3.5),tint:[0.97,0.95,0.93],tintAmt:0.5,alpha:0.92*clamp((EV.hit+5-t)/1.8,0,1),noShadow:true});if(age<2.5)glowS(items,p,5+age*2,[1,0.55,0.2],0.25*(1-age/2.5))}
  for(let j=0;j<240;j++){const u=hsh(j,1)*260;const along=s-u;if(along<10)continue;let l=(hsh(j,2)-0.5)*2*(3.2+Math.min(u,120)*0.05);const zs=along-SDIST;
    if(zs>-5){const sg=l<0?-1:1;l+=sg*(clamp((zs+5)/4,0,1)*2.2+Math.max(0,zs)*0.5)}const r=1.2+Math.min(u,120)*0.03+hsh(j,4)*1.0;const y=r*0.5+hsh(j,3)*(0.8+Math.min(u,120)*0.03);
    const p=V.add(V.add(PAD,V.sc(SDIR,along)),V.add(V.sc(SPERP,l),[0,y,0]));const hot=clamp(1-u/320,0,1)*(0.6+0.4*hsh(j,5));
    items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r*0.9),tint:mix3([1,0.32,0.06],[1,0.9,0.5],hot),tintAmt:1,alpha:0.5*hot*fade,add:1,noShadow:true});
    if(hsh(j,6)>0.55)items.push({mesh:PUFF,M:M4.trs(V.add(p,[0,r*0.4,0]),j,0.3,0,r*1.1),tint:mix3([0.7,0.66,0.64],[1,0.7,0.4],hot*0.6),tintAmt:0.6,alpha:0.6*fade,noShadow:true})}}
// ---------- R2: booster comes back, chopsticks ----------
const BS0=[-150,560,-280];function boostDescent(t){const k=clamp((t-EV.bdesc)/(EV.catch-EV.bdesc),0,1);const e=1-Math.pow(1-k,2.2);const p=lerp3(BS0,[TIP[0],TIP[1]+2.02,TIP[2]],e);return{p,k}}
function boosterR2(items,t){lazyInit();const {p:bp,k}=boostDescent(t);let wob=0;if(t>=EV.catch){const b=t-EV.catch;wob=0.012*Math.sin(b*9)*Math.exp(-b*2.5)}
  const M=M4.trs(bp,0.3,wob,wob*0.7,1);items.push({mesh:BOOST,M,noShadow:true});BOOSTB=tp(M,[0,-2,0]);TRK.BST=tp(M,[0,25,0]);
  if(t<EV.catch-0.35){const fl=0.85+0.15*Math.sin(t*61);const L=(4+26*(1-k))*fl;for(let i=0;i<3;i++){const a=i/3*TAU2+0.5;const e=tp(M,[Math.sin(a)*0.9,-2.1,Math.cos(a)*0.9]);
      items.push({mesh:UEMIS,M:M4.trs(V.add(e,[0,-L*0.5,0]),0,0,0,[0.55,L*0.5,0.55]),tint:[0.6,0.75,1],tintAmt:1,alpha:0.8,add:1,noShadow:true})}glowS(items,tp(M,[0,-3,0]),5,[1,0.6,0.3],0.3)}
  if(t>=EV.catch&&t<EV.catch+4){for(let j=0;j<10;j++){const f=clamp((t-EV.catch-j*0.05)/3,0,1);if(f<=0)continue;const a=j/10*TAU2;const q=V.add(BOOSTB,[Math.cos(a)*(3+f*9),1+f*3,Math.sin(a)*(3+f*9)]);items.push({mesh:PUFF,M:M4.trs(q,j,0,0,1.2+f*3),tint:[1,1,1],tintAmt:0.3,alpha:0.7*(1-f),noShadow:true})}}}
// ---------- R3: liquid oxygen venting, ice ----------
const BP3=[-15,2.0,-21];
function frostItems(items,t){const M=M4.trs(BP3,0.3,0,0,1);items.push({mesh:BOOST,M});TRK.BST=tp(M,[0,25,0]);if(t<EV.vent)return;
  const to=V.norm(V.sub([0,0,0],BP3));for(let j=0;j<70;j++){const t0=EV.vent+hsh(j,1)*3.2;const age=t-t0;if(age<0||age>4.5)continue;const h=3+hsh(j,2)*50;const a=Math.atan2(to[0],to[2])+(hsh(j,3)-0.5)*2.2;
    const st=[BP3[0]+Math.sin(a)*4.6,h,BP3[2]+Math.cos(a)*4.6];const v=V.add(V.sc([Math.sin(a),0,Math.cos(a)],2.5+hsh(j,4)*2),[0,-h/5,0]);let p=V.add(st,V.sc(v,age));p[1]=Math.max(0.6,p[1]);
    const r=0.8+age*1.4;items.push({mesh:PUFF,M:M4.trs(p,j,0,0,r),tint:[0.88,0.95,1],tintAmt:0.4,alpha:0.5*clamp(1-age/4.5,0,1)*clamp(age*3,0,1)*clamp((EV.freeze+1.2-t)/1.0,0,1),noShadow:true})}
  // ground fog rolling to the samurai
  for(let j=0;j<26;j++){const f=clamp((t-EV.vent-0.6-hsh(j,5)*0.8)/2.4,0,1);if(f<=0)continue;const p=lerp3(V.add(BP3,[(hsh(j,6)-0.5)*8,0,(hsh(j,7)-0.5)*8]),[(hsh(j,6)-0.5)*7,0,(hsh(j,7)-0.5)*7],f);p[1]=0.35;
    const fo=t<EV.crack?1:clamp(1-(t-EV.crack)/2.5,0,1);items.push({mesh:PUFF,M:M4.trs(p,j,0,0,[1.5+f*1.2,0.5+f*0.4,1.5+f*1.2]),tint:[0.9,0.96,1],tintAmt:0.4,alpha:0.45*fo,noShadow:true})}
  // ice block
  if(t>=EV.freeze-0.15&&t<EV.crack){const g=easeOut(clamp((t-EV.freeze+0.15)/0.35,0,1));items.push({mesh:ICEB,M:M4.trs([0,0,0],0.2,0,0,[1.0,2.15*g,0.85]),alpha:0.3,noShadow:true});
    items.push({mesh:ICEB,M:M4.trs([0,0,0],0.2,0,0,[1.04,2.19*g,0.89]),alpha:0.12,noShadow:true});ICEP=[0,1.1,0]}
  if(t>=EV.crack&&t<EV.crack+2.2){const k=t-EV.crack;for(let j=0;j<18;j++){const a=hsh(j,11)*TAU2;const sp=2.5+hsh(j,12)*3.5;const v=[Math.cos(a)*sp,2+hsh(j,13)*4,Math.sin(a)*sp];const y0=0.2+hsh(j,14)*1.8;
      const p=[v[0]*k,Math.max(0.05,y0+v[1]*k-4.9*k*k),v[2]*k];items.push({mesh:SHARD,M:M4.trs(p,k*7+j,k*5,j,0.18+hsh(j,15)*0.2),alpha:0.45*clamp(2.2-k,0,1),noShadow:true})}}}
// ---------- R4: ship reentry + slice ----------
const S0=[160,950,-750],S1=[0,10.2,0];
function shipM(c,roll,pitch){// local Y -> world +x (nose), local Z (heat shield) -> world -y
  const cr=Math.cos(roll),sr=Math.sin(roll);const Y=[Math.cos(pitch),Math.sin(pitch),0];const Z0=[Math.sin(pitch),-Math.cos(pitch),0];const Z=V.add(V.sc(Z0,cr),V.sc([0,0,1],sr));const X=V.cross(Y,Z);
  const o=V.sub(c,V.sc(Y,26));return new Float32Array([X[0],X[1],X[2],0,Y[0],Y[1],Y[2],0,Z[0],Z[1],Z[2],0,o[0],o[1],o[2],1])}
function shipItems(items,t){const k=clamp((t-R[3]-0.2)/(EV.slice-R[3]-0.2),0,1);if(k<=0)return;
  if(t<EV.slice){const c=lerp3(S0,S1,1-Math.pow(1-k,2.0));SHIPC=c;TRK.SHP=c;const M=shipM(c,0.05*Math.sin(t*1.3),0.04*Math.sin(t*0.9));items.push({mesh:SHIP,M});
    const pl=clamp(1-(k-0.55)/0.35,0,1);if(pl>0){const below=V.add(c,[0,-RK-0.6,0]);items.push({mesh:UEMIS,M:M4.trs(below,0,0,0,[29,2.2+pl*1.5,6.5]),tint:[1,0.45,0.55],tintAmt:1,alpha:0.7*pl,add:1,noShadow:true});
      items.push({mesh:UEMIS,M:M4.trs(below,0,0,0,[27,1.2,5]),tint:[1,0.85,0.7],tintAmt:1,alpha:0.8*pl,add:1,noShadow:true});
      const back=V.norm(V.sub(S0,S1));for(let i=1;i<14;i++){const q=V.add(c,V.sc(back,i*16+Math.sin(t*20+i)*2));glowS(items,q,(6+i*2.2),mix3([1,0.5,0.6],[1,0.3,0.15],i/14),0.3*pl*(1-i/14))}}
    return}
  const d=t-EV.slice;SHIPC=S1;const fall=Math.min(0.5*15*d*d,S1[1]-RK*0.6);
  for(const sx of[-1,1]){const c=V.add(S1,[sx*(2+16*d),-fall,6*d]);const rz=sx*Math.min(0.5,d*0.5);if(t>EV.boom+0.25)continue;    if(sx<0){const MA=shipM(V.add(c,[13,0,0]),0,-rz);items.push({mesh:SHIPA,M:MA},{mesh:CUTF,M:M4.mul(MA,M4.trs([0,26,0],0,0,0,1)),tint:[1,0.75,0.4],tintAmt:1,noShadow:true})}
    else{const MB_=shipM(V.add(c,[-13,0,0]),0,-rz);items.push({mesh:SHIPB,M:MB_},{mesh:CUTF,M:M4.mul(MB_,M4.trs([0,26,0],0,0,0,1)),tint:[1,0.75,0.4],tintAmt:1,noShadow:true})}}
  for(const sx of[-1,1]){const dd=EV.boom-EV.slice;const p=[sx*(2+16*dd),0,6*dd];fireball(items,p,t-EV.boom,10)}}
// ---------- FINAL: the tile ----------
function tilePos(t){lazyInit();if(t<EV.bonk){const d=EV.bonk-t;return[FACE[0]+0.6*d*0.2,FACE[1]+0.5*9.8*d*d,FACE[2]-0.3*d*0.2]}
  const d=t-EV.bonk;const land=0.62;if(d<land){return[FACE[0]+0.55*d/land,Math.max(0.02,FACE[1]+2.2*d-9.8*d*d*1.3),FACE[2]+0.9*d/land]}return[FACE[0]+0.55,0.025,FACE[2]+0.9]}
function tileItems(items,t){if(t<EV.boss-0.6)return;const p=tilePos(t);TILEP=p;TRK.TIL=p;const d=t-EV.bonk;let M;
  if(d<0.62){M=M4.trs(p,t*3.1,t*5.3,t*2.2,1)}else M=M4.trs(p,0.7,0,0,1);items.push({mesh:TILE,M});if(t<EV.bonk&&EV.bonk-t>0.3)glowS(items,p,0.5,[1,0.5,0.4],0.25)}
function fgItems(t){const rn=roundAt(t);const wt=worldTint(t);const W_={tint:wt.c,tintAmt:wt.a};const items=[Object.assign({mesh:WORLD},W_),{mesh:SEA,tint:wt.c,tintAmt:wt.a*0.6},Object.assign({mesh:MOUNT},W_),Object.assign({mesh:TOWER},W_)];
  const S=samItems(t);LASTSAM=S;items.push(...S.items);TILEP=null;ICEP=null;SHIPC=null;
  if(rn<0)petals(items,t,[0,0,0],40);
  if(rn<=0)stackItems(items,t);
  if(rn===0)blastItems(items,t);
  if(rn===1)boosterR2(items,t);
  if(rn===2)frostItems(items,t);
  if(rn===3)shipItems(items,t);
  if(rn>=3&&t>=EV.boom&&t<EV.boom+6)for(const sx of[-1,1]){const dd=EV.boom-EV.slice;if(rn===4)fireball(items,[sx*(2+16*dd),0,6*dd],t-EV.boom,10)}
  if(rn===4||t>=R[5])tileItems(items,t);
  return items}
function renderScene(t){lazyInit();let tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const items=fgItems(tt);const c=camAt(tt);const root=(LASTSAM&&LASTSAM.o.root)||[0,0,0];
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.02,far:14000},{center:[root[0],root[1]+0.4,root[2]],radius:6.5},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S_(R[0],6,0.4);if(t>EV.ign&&t<EV.hit+2.5)a+=4*clamp((t-EV.ign)/2,0,1);S_(EV.hit,16,0.8);S_(EV.catch,18,0.5);S_(EV.crack,14,0.4);S_(EV.slice,16,0.4);S_(EV.boom,24,0.9);S_(EV.bonk,12,0.3);S_(EV.floor,20,0.45);return a}
