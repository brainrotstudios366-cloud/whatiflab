// ================= scene assembly (deep space) =================
function lookZ(pos,dir,s){const z=V.norm(dir);let x=V.cross([0,1,0],z);if(V.len(x)<1e-4)x=[1,0,0];x=V.norm(x);const y=V.cross(z,x);s=s||1;return new Float32Array([x[0]*s,x[1]*s,x[2]*s,0,y[0]*s,y[1]*s,y[2]*s,0,z[0]*s,z[1]*s,z[2]*s,0,pos[0],pos[1],pos[2],1])}
const glowS=(items,p,r,col,a)=>{if(r>0.001&&a>0.001)items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r),tint:col,tintAmt:1,alpha:Math.min(1,a),add:1,noShadow:true})};
let LASTVP=null,LASTSAM=null,SKYPL=[],PLUMEB=null,HITS=null;
Object.assign(PL_HALO,{io:[1,0.85,0.4],sat:[1,0.85,0.6]});
const JUPP=[2600,1500,7000],IOP=TRK.IO,IOR=180,SATP=[1500,1300,5200],EARTHP=[700,1500,6000];
const HITP=tp(MIR_M,[HEXS[3][0]*0.6,HEXS[3][1]*0.6,MIRZ(HEXS[3][0]*0.6,HEXS[3][1]*0.6)-0.02]);const MIR_N=V.norm(td(MIR_M,[0,0,-1]));TRK.HIT=HITP;TRK.HITE=V.add(HITP,V.add(V.sc(MIR_N,2.2),[0.3,-0.2,0]));const RAYD=V.norm(V.add(MIR_N,[0.5,0.45,0.1]));
// ---- Voyager (spins after the thruster fires)
function voyItems(items,t){const a=voySpin(t);const M=M4.trs([0,0,0],a,0,0,1);items.push({mesh:JWS,M},{mesh:JWM,M:M4.mul(M,MIR_M)});
  // mirror glints
  for(let i=0;i<5;i++){const h=HEXS[(i*7)%18];const p=tp(M4.mul(M,MIR_M),[h[0],h[1],MIRZ(h[0],h[1])-0.05]);glowS(items,p,0.5,[1,0.85,0.45],0.08+0.06*Math.sin(t*2.2+i*1.7))}
  for(const[x,y,z,sg]of JTH)items.push({mesh:JNOZ,M:M4.mul(M,M4.trs([x,y,z],0,Math.PI/2*0,sg*Math.PI/2,1))});
  if(t>=EV.thrust&&t<EV.fling+2.5){const k=t-EV.thrust;const on=clamp(k/0.15,0,1)*clamp((EV.fling+2.5-t)/0.6,0,1);for(const[x,y,z,sg]of JTH){const p=tp(M,[x+sg*0.1,y,z]);const tg=td(M,[sg,0,0]);
      for(let j=0;j<7;j++){const f=((t*3+j/7)%1);const q=V.add(p,V.sc(tg,0.1+f*1.6));items.push({mesh:PUFF,M:M4.trs(q,j+t,0,0,0.08+f*0.34),tint:[0.95,0.97,1],tintAmt:0.6,alpha:0.55*(1-f)*on,noShadow:true})}
      jet(items,p,tg,0.6,0.07,[0.75,0.85,1],0.85*on);glowS(items,V.add(p,V.sc(tg,0.1)),0.25,[0.7,0.85,1],0.6*on)}}}
// fix lookZ scale for jets: unit sphere stretched along z
function jet(items,p,d,len,rad,col,a){const z=V.norm(d);let x=V.cross([0,1,0],z);if(V.len(x)<1e-4)x=[1,0,0];x=V.norm(x);const y=V.cross(z,x);const c=V.add(p,V.sc(z,len*0.5));
  items.push({mesh:UEMIS,M:new Float32Array([x[0]*rad,x[1]*rad,x[2]*rad,0,y[0]*rad,y[1]*rad,y[2]*rad,0,z[0]*len*0.5,z[1]*len*0.5,z[2]*len*0.5,0,c[0],c[1],c[2],1]),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
// ---- space dust streaks (we are moving at 61,000 km/h)
function dust(items,t,cam,amt){if(amt<=0)return;for(let j=0;j<70;j++){const x=(hsh(j,1)-0.5)*14,y=(hsh(j,2)-0.5)*10+1,zz=((hsh(j,3)*30-t*9)%30+30)%30-12;const p=[x,y,zz];
  jet(items,p,[0,0,1],0.35+hsh(j,4)*0.5,0.008+hsh(j,5)*0.01,[0.75,0.85,1],0.5*amt*clamp((18-Math.abs(zz))/6,0,1))}}
// ---- R1: Io + plume + sulfur snow
const PL_N=V.norm([-0.38,0.92,-0.05]);
function ioItems(items,t,k){items.push({mesh:W107,M:M4.trs(JUPP,0.3,0,0.12,1700),noShadow:true,alpha:k});SKYPL.push({p:JUPP,r:1700,key:'w107',a:k});PLUMEB=JUPP;
  if(t>=EV.plume){const on=clamp((t-EV.plume)/0.8,0,1)*clamp((R[1]-t)/0.6,0,1);// incoming sand front: tan haze blobs drifting past
    for(let j=0;j<26;j++){const ph=((t-EV.plume)*0.35+hsh(j,1))%1;const p=[(hsh(j,2)-0.5)*16-6+ph*14,(hsh(j,3))*7-1.5,6-ph*16+hsh(j,4)*6];glowS(items,p,1.2+2.2*hsh(j,5),[0.85,0.62,0.35],0.13*on*Math.sin(ph*Math.PI))}}}
function snowItems(items,t,S){if(t<EV.snow-0.4)return;const fade=clamp((R[1]-0.2-t)/0.5,0,1);for(let j=0;j<110;j++){const t0=EV.snow-0.4+hsh(j,1)*3.2;const age=t-t0;if(age<0)continue;
    const p0=[(hsh(j,2)-0.5)*3.0-1.2,6.5,(hsh(j,3)-0.5)*2.6+0.2];const v=[1.0,-4.2,-0.25];let p=V.add(p0,V.sc(v,age));let stuck=false;
    if(S.umbC){const c=S.umbC;const ah=(p0[1]-(c[1]-0.05))/4.2;const ph=V.add(p0,V.sc(v,ah));const dr=Math.hypot(ph[0]-c[0],ph[2]-c[2]);if(dr<S.umbR*0.98&&age>=ah){const yc=c[1]+0.04-0.28*Math.pow(dr/0.6,2)*0.6;p=[ph[0],yc+0.02*hsh(j,6),ph[2]];stuck=true}}
    if(p[1]<-4)continue;const s=0.022+0.026*hsh(j,4);const hot=hsh(j,5)>0.8&&!stuck;
    if(hot){glowS(items,p,s*1.8,[1,0.55,0.2],0.85*fade);continue}
    items.push({mesh:SNOW,M:M4.trs(p,j,j*0.7,0,s*(stuck?0.85:1)),tint:hx('#d9ac6a'),tintAmt:1,alpha:fade,noShadow:!stuck})}}
// ---- R2: Saturn + ice chunks
const CD=V.norm([0.55,0.12,0.83]),CS=V.norm(V.cross(CD,[0,1,0]));const CHP=[[0.55,1.35,0.15],[-0.5,1.05,0.1],[0.05,1.75,0.25]];const CUTT=[EV.cut1,EV.cut2,EV.cut3];
function satItems(items,t,k){items.push({mesh:W17,M:M4.trs(SATP,0.35,-0.2,0.15,1250),noShadow:true,alpha:k});SKYPL.push({p:SATP,r:1250,key:'w17',a:k*0.9})}
function chunkItems(items,t){if(t<EV.chunks-1)return;
  for(let i=0;i<3;i++){const tc=CUTT[i];const hp=CHP[i];const r=0.22-i*0.025;
    if(t<tc){const p=V.add(hp,V.sc(CD,(tc-t)*24));if(V.len(p)<200){items.push({mesh:CRYS,M:M4.trs(p,t*1.3+i,t*0.9,i+0.8,r)});glowS(items,p,r*1.8,[0.6,0.8,1],0.12)}}
    else{const d=t-tc;if(d>3)continue;for(const sx of[-1,1]){const p=V.add(V.add(hp,V.sc(CD,-d*5)),V.add(V.sc(CS,sx*(0.05+d*2.2)),[0,d*0.6*sx,0]));items.push({mesh:CRYH,M:M4.trs(p,d*3*sx+i,d*2+(sx>0?0:Math.PI),0,r)})}
      if(d<0.4)glowS(items,hp,0.12+d*0.8,[0.6,0.85,1],0.55*(1-d/0.4));
      for(let j=0;j<10;j++){const a=hsh(j+i*10,3)*TAU2;const v=V.add(V.sc(CS,Math.cos(a)*2.5),[0,Math.sin(a)*2.5,0]);const p=V.add(V.add(hp,V.sc(v,d)),V.sc(CD,-d*3));if(d<1.6)items.push({mesh:SHARD,M:M4.trs(p,d*6+j,d*4,j,0.06+hsh(j,4)*0.06),alpha:0.6*(1-d/1.6),noShadow:true})}}}
  // ring particles streaming past
  for(let j=0;j<50;j++){const t0=EV.chunks-1+hsh(j,1)*8;const d=t-t0;if(d<0||d>4)continue;const off=V.add(V.sc(CS,(hsh(j,2)-0.5)*9),[0,(hsh(j,3)-0.5)*5+1.2,0]);if(Math.abs(off[0])<1.2&&off[1]>-0.3&&off[1]<2.4)off[0]+=Math.sign(off[0]||1)*1.6;
    const p=V.add(V.add([0,0,0],off),V.sc(CD,(2-d)*22));const rr=0.04+0.12*hsh(j,4);items.push({mesh:CRYS,M:M4.trs(p,d*2+j,j,0,rr),noShadow:true});glowS(items,p,rr*2.2,[0.6,0.85,1],0.12)}}
// ---- R3: heliopause wall
function wallZ(t){return 300-(300/(EV.pass-EV.wall))*(t-EV.wall)}
function wallItems(items,t){if(t<R[2])return;const z=Math.max(wallZ(Math.max(t,EV.wall)),-80);TRK.WALL=[0,1.4,Math.max(z,8)];
  if(z>-2){const a=clamp((t-R[2])/1.2,0,1);items.push({mesh:CLIFF,M:M4.trs([0,1.4,z],0,0,t*0.02,1),alpha:0.8*a,add:1,noShadow:true});items.push({mesh:CLIFF,M:M4.trs([0,1.4,z+6],0,0,-t*0.015+0.6,[1.15,1.15,1]),alpha:0.35*a,add:1,noShadow:true})}
  // the "few particles" after the pass
  if(t>=EV.pass){const a=clamp((t-EV.pass)/0.6,0,1)*clamp((R[3]-0.2-t)/0.5,0,1);for(let j=0;j<9;j++){const p=[(hsh(j,1)-0.5)*3.4+0.3*Math.sin(t*0.7+j),0.4+hsh(j,2)*2.4+0.2*Math.cos(t*0.9+j),(hsh(j,3)-0.5)*2.4-0.4];
    glowS(items,p,0.035,[1,0.8,0.5],0.95*a);glowS(items,p,0.1,[1,0.6,0.3],0.25*a)}}}
// ---- R4: one light-day; signal rings to/from Earth
const EDIR=V.norm(V.sub(EARTHP,[0,-1.3,0]));
function signalItems(items,t){items.push({mesh:GAL,M:M4.trs(EARTHP,0,0,0.4,[80,26,80]),noShadow:true,alpha:0.55,add:1});SKYPL.push({p:EARTHP,r:110,key:'gal',a:1});glowS(items,EARTHP,520,[1,0.3,0.2],0.4);glowS(items,EARTHP,200,[1,0.6,0.4],0.55);
  const src=LASTSAM&&LASTSAM.phone?LASTSAM.phone:[0.3,1.4,0];const ring=(d,dir,from)=>{if(d<0||d>4)return;const p=V.add(from,V.sc(dir,d*7));items.push({mesh:RING,M:frameM(p,dir,[0,0,1],0.6+d*0.5),tint:[0.35,0.95,1],tintAmt:1,alpha:0.85*(1-d/4),add:1,noShadow:true})};
  for(let i=0;i<4;i++){ring(t-EV.send-i*0.22,EDIR,src)}
  
  if(t>=EV.reply&&t<EV.reply+0.6)glowS(items,src,0.12+(t-EV.reply)*0.6,[1,0.3,0.4],0.8*(1-(t-EV.reply)/0.6))}
// ---- FINAL: one cosmic ray
function rayItems(items,t){if(t<EV.ray-0.5)return;const hp=HITP;
  if(t<EV.ray){const d=(EV.ray-t);const p=V.add(hp,V.sc(RAYD,d*900));jet(items,p,RAYD,22,0.03,[1,0.85,0.6],1);jet(items,p,RAYD,12,0.1,[1,0.55,0.25],0.5);glowS(items,p,0.3,[1,0.9,0.7],0.9);HITS=p}
  else{const k=t-EV.ray;if(k<5){if(k<0.8){glowS(items,hp,0.08+k*0.9,[1,0.9,0.7],0.9*(1-k/0.8));glowS(items,hp,0.3+k*2,[1,0.5,0.2],0.35*(1-k/0.8));
    for(let j=0;j<12;j++){const a=hsh(j,7)*TAU2,b=hsh(j,8)*Math.PI;const v=[Math.cos(a)*Math.sin(b),Math.cos(b),Math.sin(a)*Math.sin(b)-0.6];const q=V.add(hp,V.sc(v,k*1.8));glowS(items,q,0.025,[1,0.9,0.7],1-k/0.8)}}
    if(t<EV.thrust)glowS(items,hp,0.09,[1,0.4,0.2],0.6*clamp(1-(k-0.8)/2,0.25,1))}}}
function fgItems(t){const rn=roundAt(t);const items=[];SKYPL=[];
  const S=samItems(t);LASTSAM=S;items.push(...S.items);voyItems(items,t);
  const c=camAt(t);
  if(rn<=0){const k=rn<0?1:1;ioItems(items,t,k)}
  if(rn===0)snowItems(items,t,S);
  if(rn===1){satItems(items,t,ease((t-R[1])/1.0));chunkItems(items,t)}
  if(rn===2)wallItems(items,t);
  if(rn===3)signalItems(items,t);
  if(rn===4||t>=R[5])rayItems(items,t);
  dust(items,t,c,rn===2&&t>EV.pass-0.5&&t<EV.pass+0.5?0:1);
  return items}
function renderScene(t){let tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const items=fgItems(tt);const c=camAt(tt);const root=(LASTSAM&&LASTSAM.o.root)||[0,0,0];
  const sc=tt>=EV.fling+1.5?{center:[0,-9999,0],radius:1}:{center:[0,0.6,0],radius:3.2};
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.02,far:20000},sc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S_(R[0],6,0.4);S_(EV.plume,8,0.6);S_(EV.snow,4,0.4);S_(EV.cut1,12,0.35);S_(EV.cut2,12,0.35);S_(EV.cut3,16,0.45);if(t>EV.pass-1.5&&t<EV.pass)a+=6*clamp((t-EV.pass+1.5)/1.5,0,1);S_(EV.pass,22,0.8);
  S_(EV.reply,6,0.3);S_(EV.ray,16,0.5);S_(EV.thrust,8,0.6);if(t>EV.thrust&&t<EV.fling)a+=3;S_(EV.fling,20,0.5);return a}
