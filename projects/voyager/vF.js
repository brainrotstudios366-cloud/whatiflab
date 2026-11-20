// ================= scene assembly (deep space) =================
function lookZ(pos,dir,s){const z=V.norm(dir);let x=V.cross([0,1,0],z);if(V.len(x)<1e-4)x=[1,0,0];x=V.norm(x);const y=V.cross(z,x);s=s||1;return new Float32Array([x[0]*s,x[1]*s,x[2]*s,0,y[0]*s,y[1]*s,y[2]*s,0,z[0]*s,z[1]*s,z[2]*s,0,pos[0],pos[1],pos[2],1])}
const glowS=(items,p,r,col,a)=>{if(r>0.001&&a>0.001)items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r),tint:col,tintAmt:1,alpha:Math.min(1,a),add:1,noShadow:true})};
let LASTVP=null,LASTSAM=null,SKYPL=[],PLUMEB=null,HITS=null;
Object.assign(PL_HALO,{io:[1,0.85,0.4],sat:[1,0.85,0.6]});
const JUPP=[-1900,1600,7000],IOP=TRK.IO,IOR=180,SATP=[-700,1100,5200],EARTHP=[80,-700,6000];
const HITP=[0.56,-0.2,-0.68],RAYD=V.norm([0.85,0.6,0.45]);
// ---- Voyager (spins after the thruster fires)
function voyItems(items,t){const a=voySpin(t);const M=M4.trs([0,0,0],a,0,0,1);items.push({mesh:VOY,M},{mesh:GREC,M:M4.mul(M,M4.trs(GREC_P,0,0,0,0.165)),noShadow:true});
  // golden-record sparkle
  {const p=tp(M,GREC_P);glowS(items,V.add(p,[0,0,-0.02]),0.12,[1,0.8,0.4],0.12+0.06*Math.sin(t*3))}
  // thruster firing (bit flip)
  if(t>=EV.thrust&&t<EV.fling+2.5){const k=t-EV.thrust;const on=clamp(k/0.15,0,1)*clamp((EV.fling+2.5-t)/0.6,0,1);for(const ang of[0.4,0.4+Math.PI]){const p=tp(M,[Math.cos(ang)*0.86,-0.46,Math.sin(ang)*0.86]);const tg=td(M,[-Math.sin(ang),0,Math.cos(ang)]);
      for(let j=0;j<7;j++){const f=((t*3+j/7)%1);const q=V.add(p,V.sc(tg,0.1+f*1.3));items.push({mesh:PUFF,M:M4.trs(q,j+t,0,0,0.06+f*0.28),tint:[0.95,0.97,1],tintAmt:0.6,alpha:0.55*(1-f)*on,noShadow:true})}
      jet(items,p,tg,0.45,0.05,[0.75,0.85,1],0.85*on);glowS(items,V.add(p,V.sc(tg,0.1)),0.18,[0.7,0.85,1],0.6*on)}}}
// fix lookZ scale for jets: unit sphere stretched along z
function jet(items,p,d,len,rad,col,a){const z=V.norm(d);let x=V.cross([0,1,0],z);if(V.len(x)<1e-4)x=[1,0,0];x=V.norm(x);const y=V.cross(z,x);const c=V.add(p,V.sc(z,len*0.5));
  items.push({mesh:UEMIS,M:new Float32Array([x[0]*rad,x[1]*rad,x[2]*rad,0,y[0]*rad,y[1]*rad,y[2]*rad,0,z[0]*len*0.5,z[1]*len*0.5,z[2]*len*0.5,0,c[0],c[1],c[2],1]),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
// ---- space dust streaks (we are moving at 61,000 km/h)
function dust(items,t,cam,amt){if(amt<=0)return;for(let j=0;j<70;j++){const x=(hsh(j,1)-0.5)*14,y=(hsh(j,2)-0.5)*10+1,zz=((hsh(j,3)*30-t*9)%30+30)%30-12;const p=[x,y,zz];
  jet(items,p,[0,0,1],0.35+hsh(j,4)*0.5,0.008+hsh(j,5)*0.01,[0.75,0.85,1],0.5*amt*clamp((18-Math.abs(zz))/6,0,1))}}
// ---- R1: Io + plume + sulfur snow
const PL_N=V.norm([-0.38,0.92,-0.05]);
function ioItems(items,t,k){items.push({mesh:PLAN.jup,M:M4.trs(JUPP,0,0,0,2600),noShadow:true,alpha:k});SKYPL.push({p:JUPP,r:2600,key:'jup',a:k});
  items.push({mesh:IOM,M:M4.trs(IOP,0.4,0,0,IOR),noShadow:true,alpha:k});SKYPL.push({p:IOP,r:IOR,key:'io',a:k*0.8});
  const base=V.add(IOP,V.sc(PL_N,IOR*0.99));PLUMEB=base;if(t<EV.plume)return;const on=clamp((t-EV.plume)/0.6,0,1)*k;const H=IOR*0.55;
  const tA=V.norm(V.cross(PL_N,[0,0,1])),tB=V.cross(PL_N,tA);
  for(let j=0;j<150;j++){const s_=(t-EV.plume)*0.45-hsh(j,1)*0.999;if(s_<0)continue;const u=s_%1;
    const a=hsh(j,2)*TAU2,sp=0.25+0.75*Math.sqrt(hsh(j,3));const out=V.add(V.sc(tA,Math.cos(a)*sp),V.sc(tB,Math.sin(a)*sp));const h=H*4*u*(1-u)*(0.75+0.25*hsh(j,4));
    const p=V.add(V.add(base,V.sc(PL_N,h)),V.sc(out,IOR*0.42*u));const hot=1-u;
    glowS(items,p,3.2+4*u*hsh(j,5),mix3([1,0.55,0.15],[1,0.95,0.65],hot),0.55*on*(1-u*0.6))}
  glowS(items,base,14,[1,0.7,0.3],0.7*on);glowS(items,V.add(base,V.sc(PL_N,H*0.5)),H*0.9,[1,0.75,0.35],0.12*on)}
function snowItems(items,t,S){if(t<EV.snow-0.4)return;const fade=clamp((R[1]-0.2-t)/0.5,0,1);for(let j=0;j<110;j++){const t0=EV.snow-0.4+hsh(j,1)*3.2;const age=t-t0;if(age<0)continue;
    const p0=[(hsh(j,2)-0.5)*3.0,6.5,(hsh(j,3)-0.5)*2.6+0.2];const v=[0.35,-4.2,-0.25];let p=V.add(p0,V.sc(v,age));let stuck=false;
    if(S.umbC){const c=S.umbC;const ah=(p0[1]-(c[1]-0.05))/4.2;const ph=V.add(p0,V.sc(v,ah));const dr=Math.hypot(ph[0]-c[0],ph[2]-c[2]);if(dr<S.umbR*0.98&&age>=ah){const yc=c[1]+0.04-0.28*Math.pow(dr/0.6,2)*0.6;p=[ph[0],yc+0.02*hsh(j,6),ph[2]];stuck=true}}
    if(p[1]<-4)continue;const s=0.03+0.03*hsh(j,4);const hot=hsh(j,5)>0.82&&!stuck;
    if(hot){glowS(items,p,s*1.6,[1,0.6,0.2],0.8*fade);continue}
    items.push({mesh:SNOW,M:M4.trs(p,j,j*0.7,0,s*(stuck?0.85:1)),tint:hx('#f2dc3a'),tintAmt:1,alpha:fade,noShadow:!stuck})}}
// ---- R2: Saturn + ice chunks
const CD=V.norm([0.55,0.12,0.83]),CS=V.norm(V.cross(CD,[0,1,0]));const CHP=[[0.55,1.35,0.15],[-0.5,1.05,0.1],[0.05,1.75,0.25]];const CUTT=[EV.cut1,EV.cut2,EV.cut3];
function satItems(items,t,k){items.push({mesh:SATB,M:M4.trs(SATP,0.35,-0.42,0.25,1250),noShadow:true,alpha:k});SKYPL.push({p:SATP,r:1250,key:'sat',a:k*0.7})}
function chunkItems(items,t){if(t<EV.chunks-1)return;
  for(let i=0;i<3;i++){const tc=CUTT[i];const hp=CHP[i];const r=0.22-i*0.025;
    if(t<tc){const p=V.add(hp,V.sc(CD,(tc-t)*24));if(V.len(p)<200)items.push({mesh:CHUNK,M:M4.trs(p,t*1.3+i,t*0.9,i,r),tint:[0.72,0.86,1],tintAmt:0.35})}
    else{const d=t-tc;if(d>3)continue;for(const sx of[-1,1]){const p=V.add(V.add(hp,V.sc(CD,-d*5)),V.add(V.sc(CS,sx*(0.05+d*2.2)),[0,d*0.6*sx,0]));items.push({mesh:CHALF,M:M4.trs(p,d*3*sx+i,d*2,0,[r,r*0.55,r])})}
      if(d<0.5)glowS(items,hp,0.25+d*1.8,[0.8,0.95,1],0.8*(1-d/0.5));
      for(let j=0;j<10;j++){const a=hsh(j+i*10,3)*TAU2;const v=V.add(V.sc(CS,Math.cos(a)*2.5),[0,Math.sin(a)*2.5,0]);const p=V.add(V.add(hp,V.sc(v,d)),V.sc(CD,-d*3));if(d<1.6)items.push({mesh:SHARD,M:M4.trs(p,d*6+j,d*4,j,0.06+hsh(j,4)*0.06),alpha:0.6*(1-d/1.6),noShadow:true})}}}
  // ring particles streaming past
  for(let j=0;j<50;j++){const t0=EV.chunks-1+hsh(j,1)*8;const d=t-t0;if(d<0||d>4)continue;const off=V.add(V.sc(CS,(hsh(j,2)-0.5)*9),[0,(hsh(j,3)-0.5)*5+1.2,0]);if(Math.abs(off[0])<1.2&&off[1]>-0.3&&off[1]<2.4)off[0]+=Math.sign(off[0]||1)*1.6;
    const p=V.add(V.add([0,0,0],off),V.sc(CD,(2-d)*22));items.push({mesh:CHUNK,M:M4.trs(p,d*2+j,j,0,0.04+0.14*hsh(j,4)),noShadow:true})}}
// ---- R3: heliopause wall
function wallZ(t){return 300-(300/(EV.pass-EV.wall))*(t-EV.wall)}
function wallItems(items,t){if(t<R[2])return;const z=Math.max(wallZ(Math.max(t,EV.wall)),-80);TRK.WALL=[0,1.4,Math.max(z,8)];
  if(z>-2){const a=clamp((t-R[2])/1.2,0,1);items.push({mesh:WALL,M:M4.trs([0,1.4,z],0,0,t*0.05,1),alpha:0.75*a,add:1,noShadow:true});items.push({mesh:WALL,M:M4.trs([0,1.4,z+6],0,0,-t*0.04+1,[1.15,1.15,1]),alpha:0.35*a,add:1,noShadow:true})}
  // the "few particles" after the pass
  if(t>=EV.pass){const a=clamp((t-EV.pass)/0.6,0,1)*clamp((R[3]-0.2-t)/0.5,0,1);for(let j=0;j<9;j++){const p=[(hsh(j,1)-0.5)*3.4+0.3*Math.sin(t*0.7+j),0.4+hsh(j,2)*2.4+0.2*Math.cos(t*0.9+j),(hsh(j,3)-0.5)*2.4-0.4];
    glowS(items,p,0.035,[1,0.6,0.8],0.95*a);glowS(items,p,0.1,[1,0.4,0.6],0.25*a)}}}
// ---- R4: one light-day; signal rings to/from Earth
const EDIR=V.norm(V.sub(EARTHP,[0,-1.3,0]));
function signalItems(items,t){items.push({mesh:EDOT,M:M4.trs(EARTHP,0,0,0,40),noShadow:true});SKYPL.push({p:EARTHP,r:40,key:'ear',a:1});
  const src=[0,-1.85,0];const ring=(d,dir,from)=>{if(d<0||d>4)return;const p=V.add(from,V.sc(dir,d*7));items.push({mesh:RING,M:frameM(p,dir,[0,0,1],0.6+d*0.5),tint:[0.35,0.95,1],tintAmt:1,alpha:0.85*(1-d/4),add:1,noShadow:true})};
  for(let i=0;i<4;i++){ring(t-EV.send-i*0.22,EDIR,src)}
  for(let i=0;i<4;i++){const d=EV.reply-t-i*0.22;if(d>=0&&d<4)ring(d,EDIR,src)}
  if(t>=EV.reply&&t<EV.reply+0.6)glowS(items,LASTSAM&&LASTSAM.phone?LASTSAM.phone:[0.3,1.4,0],0.12+(t-EV.reply)*0.6,[0.4,0.95,1],0.8*(1-(t-EV.reply)/0.6))}
// ---- FINAL: one cosmic ray
function rayItems(items,t){if(t<EV.ray-0.5)return;const hp=HITP;
  if(t<EV.ray){const d=(EV.ray-t);const p=V.add(hp,V.sc(RAYD,d*900));jet(items,p,RAYD,30,0.05,[0.85,0.7,1],1);jet(items,p,RAYD,18,0.15,[0.6,0.4,1],0.5);glowS(items,p,0.4,[0.9,0.8,1],0.9);HITS=p}
  else{const k=t-EV.ray;if(k<0.8){glowS(items,hp,0.08+k*0.9,[0.9,0.8,1],0.9*(1-k/0.8));glowS(items,hp,0.3+k*2,[0.6,0.4,1],0.35*(1-k/0.8));
    for(let j=0;j<12;j++){const a=hsh(j,7)*TAU2,b=hsh(j,8)*Math.PI;const v=[Math.cos(a)*Math.sin(b),Math.cos(b),Math.sin(a)*Math.sin(b)-0.6];const q=V.add(hp,V.sc(v,k*1.8));glowS(items,q,0.025,[1,0.9,1],1-k/0.8)}}}}
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
