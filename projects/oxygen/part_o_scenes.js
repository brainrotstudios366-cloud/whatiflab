
// ======================================================================
// ============================ OXYGEN SCENES ===========================
// ======================================================================
const T_EAR=6.15,T_ENG=7.8,T_FLAME=9.5,T_CRUM=14.6,T_FO=20.5,T_EVAP=29.7,T_CRACK=36.9,T_BOOM=47.05;
R=rng(31);
// ---------------- CITY ----------------
const ocars=[];
function addOC(x,dir,z0,v0,col){ocars.push({x,dir,z0,v0,a:rr(3,4),col:hex(col||pick(carCols))})}
{let z=40;while(z>-180){addOC(-6.6,1,z,9);z-=rr(13,18)}z=50;while(z>-180){addOC(-3.5,-1,z,8);z-=rr(13,18)}}
function ocarZ(c,t){if(t<T_ENG)return c.z0+c.dir*c.v0*t;const k=t-T_ENG,ks=c.v0/c.a,kk=Math.min(k,ks);return c.z0+c.dir*(c.v0*T_ENG+c.v0*kk-0.5*c.a*kk*kk)}
const pcars=[];for(let z=34;z>-175;z-=rr(5.4,7)){if(R()<0.12)continue;pcars.push({x:-9.1,z,col:hex(pick(carCols))})}
const peopleO=[];
for(let i=0;i<240;i++){let x,z;if(R()<0.7){x=rr(-0.8,13);z=rr(-125,25)}else{x=rr(-13.6,-10.6);z=rr(-125,25)}
  if(Math.abs(x+1.2)<2.5&&Math.abs(z+13)<3)continue;
  peopleO.push({x,z,dir:R()<0.5?1:-1,sp:rr(1.0,1.6),ph:rr(0,6.28),shirt:hex(pick(shirts)),pant:hex(pick(pants)),h:rr(0.92,1.08),lk:rr(-1,1)})}
const SKIN=hex('#d9a68a'),HAIR=hex('#3a2a22');
function walkT(t){if(t<T_EAR)return t;const k=Math.min(t-T_EAR,0.5);return T_EAR+k-k*k}
function personO(p,t){const wt=walkT(t);let z=p.z+p.dir*p.sp*wt;while(z<-125)z+=150;while(z>25)z-=150;
  if(Math.hypot(p.x-cam.x,z-cam.z)<2.4&&cam.y<3)return null;
  const stop=t>T_EAR;const bob=stop?0:Math.abs(Math.sin(t*p.sp*4+p.ph))*0.06;
  const flinch=stop?Math.sin(Math.min(1,(t-T_EAR)/0.4)*Math.PI)*0.25:0;
  const yaw=(p.dir>0?0:Math.PI)+(stop?p.lk*0.7*ease((t-T_EAR)/0.8):0);const M=rotM(yaw,flinch*(p.lk>0?1:-1),0);const feet=[p.x,bob,z];const h=p.h;
  return{d:dist([p.x,0.8,z]),draw:()=>{const parts=[[mapL(feet,M,0,0.41*h,0),0.21,0.41*h,0.13,{top:p.pant,side:p.pant}],[mapL(feet,M,0,1.12*h,0),0.26,0.3*h,0.15,{top:p.shirt,side:p.shirt}],
      [mapL(feet,M,0,1.6*h,0),0.13,0.14*h,0.13,{top:HAIR,side:SKIN,front:SKIN,back:HAIR}]];stackDraw(parts,feet,M)}}}
const fires=[{x:-1.2,z:-13,y:1.15,s:1.0,cart:true},{x:-12,z:-30,y:1.0,s:1.3,cart:false},{x:9,z:-40,y:1.15,s:1.0,cart:true}];
const CART=hex('#c94b3a'),CARTT=hex('#d9d9de'),BARREL=hex('#3d4048');
function fireObj(f,t){return{d:dist([f.x,1,f.z]),draw:()=>{
  if(f.cart){oboxDraw([f.x,0.55,f.z],rotM(0.3,0,0),0.7,0.55,1.1,{top:CARTT,side:CART,front:CART,back:CART});oboxDraw([f.x,1.12,f.z],rotM(0.3,0,0),0.62,0.03,0.9,{top:hex('#2a2a2e'),side:hex('#2a2a2e')})}
  else oboxDraw([f.x,0.5,f.z],rotM(0,0,0),0.35,0.5,0.35,{top:hex('#1a1a1a'),side:BARREL});
  const k=t-T_FLAME;const amp=k<0?1:Math.max(0,1-k/0.18);const base=toCam([f.x,f.y,f.z]);if(base[2]<0.5)return;const s=scr(base);const sc=F/base[2];
  if(amp>0){ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1]-0.4*sc,1.8*sc*f.s*amp,[255,140,40],0.45);ctx.restore();
    for(let i=0;i<9;i++){const h=hash(i,Math.floor(t*14));const fx=(i/8-0.5)*0.9*f.s*sc,fh=(0.4+0.7*h)*f.s*sc*amp,fw=0.18*f.s*sc;
      ctx.fillStyle=i%3===0?'rgba(255,230,120,0.95)':i%3===1?'rgba(255,150,40,0.9)':'rgba(240,80,30,0.85)';ctx.beginPath();ctx.moveTo(s[0]+fx-fw,s[1]);ctx.quadraticCurveTo(s[0]+fx-fw*0.3,s[1]-fh*0.6,s[0]+fx+Math.sin(t*9+i)*fw*0.6,s[1]-fh);ctx.quadraticCurveTo(s[0]+fx+fw*0.3,s[1]-fh*0.6,s[0]+fx+fw,s[1]);ctx.fill()}}
  if(k>0&&k<4){for(let i=0;i<6;i++){const q=((k*0.8+i/6)%1);const a=0.45*(1-q)*Math.min(1,k*3)*(1-k/4);const yy=f.y+q*4;const c=toCam([f.x+Math.sin(i*2+k)*0.3*q,yy,f.z]);if(c[2]<0.5)continue;const p=scr(c);const r=(0.3+q*1.4)*F/c[2];ctx.fillStyle=`rgba(120,120,125,${a})`;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill()}}}}}
function cityCamO(t){const wt=walkT(t);cam.x=0.4;cam.z=-0.55*wt;cam.y=1.7+(t<T_EAR?Math.abs(Math.sin(t*3.2))*0.03:0);cam.yaw=0.17;cam.pitch=0.07;cam.roll=0;
  if(t>T_EAR){const k=t-T_EAR;cam.pitch+=-0.08*Math.sin(Math.min(1,k/0.5)*Math.PI)+0.0;cam.roll=Math.sin(k*20)*0.03*Math.exp(-k*3);cam.yaw=0.17+0.12*ease((t-7.4)/1.8)-0.06*ease((t-9.2)/1.2)}}
function drawCityO(t){F=930;FOG=hex('#e9a991');FOGD=150;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;cityCamO(t);setCam();drawCitySky(t);cityGround();drawTower(t);
  buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];for(const c of ocars){const z=ocarZ(c,t);const o=carObj(c.x,z,c.dir>0?0:Math.PI,c.col,t>T_ENG?1:0);if(o.d>-3)objs.push(o)}
  for(const c of pcars){const o=carObj(c.x,c.z,0,c.col,0);if(o.d>-3)objs.push(o)}
  for(const p of peopleO){const o=personO(p,t);if(o&&o.d>0)objs.push(o)}
  for(const l of lamps){const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  for(const f of fires){const o=fireObj(f,t);if(o.d>0)objs.push(o)}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- CONCRETE CRUMBLES ----------------
const chunks=[],cdust=[],cdeb=[];R=rng(57);
buildings.forEach((b,bi)=>{let y=0;const lv=[];while(y<b.h-4){const hh=Math.min(rr(9,15),b.h-y);lv.push([y,y+hh]);y+=hh}
  const n=lv.length;const zc=(b.z0+b.z1)/2;const tb=T_CRUM+hash(bi,1)*1.6+((-zc)/240)*0.7;b.m0=tb;b.m1=tb+n*0.32+1.3;b.mh=rr(5,9);
  lv.forEach(([y0,y1],i)=>{const fromTop=n-1-i;const c={b,x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1,y0,y1,col:mul(b.col,0.96+0.08*R()),seed:bi*13+i,ts:tb+fromTop*0.32,dur:rr(0.9,1.4)};chunks.push(c);
    for(let q=0;q<5;q++)cdust.push({t0:c.ts+R()*c.dur,x:rr(c.x0,c.x1),y:rr(y0,y1),z:rr(c.z0,c.z1),r0:rr(3,6),gr:rr(4,7),life:rr(3,5),vy:-rr(2,6)});
    for(let q=0;q<4;q++)cdeb.push({t0:c.ts+R()*c.dur*0.8,x:rr(c.x0,c.x1),y:y1,z:rr(c.z0,c.z1),vx:rr(-3,3),vz:rr(-3,3),s:rr(0.6,1.4)})})});
const MOUND=hex('#b9ab95'),DUSTC=hex('#cdbda4');
function moundDraw(b,f){const h=b.mh*f;if(h<0.2)return;const cx=(b.x0+b.x1)/2,cz=(b.z0+b.z1)/2,hx=(b.x1-b.x0)/2,hz=(b.z1-b.z0)/2;
  const B=[[cx-hx,0,cz-hz],[cx+hx,0,cz-hz],[cx+hx,0,cz+hz],[cx-hx,0,cz+hz]];const T=B.map(p=>[cx+(p[0]-cx)*0.45,h,cz+(p[2]-cz)*0.45]);
  for(let i=0;i<4;i++){const j=(i+1)%4;facePoly([B[i],B[j],T[j],T[i]].reverse(),MOUND)}facePoly([T[0],T[3],T[2],T[1]],mul(MOUND,1.05))}
function drawCrumbleCity(t,objs){
  for(const b of buildings){const f=clamp((t-b.m0)/(b.m1-b.m0),0,1);if(f>0)objs.push({d:dist([(b.x0+b.x1)/2,2,(b.z0+b.z1)/2])+2,draw:()=>moundDraw(b,f)})}
  for(const c of chunks){const f=clamp((t-c.ts)/c.dur,0,1);if(f>=1)continue;const hx=(c.x1-c.x0)/2,hz=(c.z1-c.z0)/2,hy=(c.y1-c.y0)/2*(1-f);const cy=c.y0+hy;const M=rotM(0,0,0);
    objs.push({d:dist([(c.x0+c.x1)/2,cy,(c.z0+c.z1)/2]),draw:()=>oboxDraw([(c.x0+c.x1)/2,cy,(c.z0+c.z1)/2],M,hx,hy,hz,{top:mul(c.col,f>0?0.8:0.92),side:c.col,front:c.col,back:c.col},fc=>{if(f===0&&fc.k!=='top')faceWindows(fc,c.seed,160)})})}
  for(const q of cdust){const k=t-q.t0;if(k<0||k>q.life)continue;objs.push(puffObj(q.x,Math.max(q.r0*0.5,q.y+q.vy*k),q.z,q.r0+q.gr*k,DUSTC,0.7*(1-k/q.life)))}
  for(const q of cdeb){const k=t-q.t0;if(k<0||k>3)continue;let y=q.y-4.9*k*k;if(y<0.3)continue;const x=q.x+q.vx*k,z=q.z+q.vz*k;
    objs.push({d:dist([x,y,z]),draw:()=>{const c=toCam([x,y,z]);if(c[2]<1)return;const s=scr(c);const r=q.s*F/c[2];ctx.fillStyle='#8f8a82';ctx.fillRect(s[0]-r/2,s[1]-r/2,r,r)}})}}
function drawCrumble(t,mode){const rain=mode==='rain';F=900;setLight([-0.35,0.8,0.5]);AMB=0.58;
  const haze=rain?1:clamp((t-14.8)/4,0,1)*0.7;FOG=rain?hex('#8a8580'):mix(hex('#e9a991'),hex('#c9b49a'),haze);FOGD=rain?110:150-haze*70;FOGMAX=0.9;
  if(!rain){const u=(t-11.5)/7.5;cam.x=4-3*u;cam.y=92+12*u;cam.z=-10-40*u;lookAt(-1,0,cam.z-120);cam.roll=Math.sin(t*0.7)*0.03}
  else{const u=clamp((t-48.75)/9,0,1);cam.x=-3+10*u;cam.y=26+22*u;cam.z=-30+40*u;lookAt(-2,0,cam.z-90);cam.roll=0.02}
  setCam();const tt=rain?80:t;
  if(rain){const g=ctx.createLinearGradient(0,0,0,H*0.6);g.addColorStop(0,'#3d3a40');g.addColorStop(1,'#a08a78');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400)}else{drawCitySky(t);if(haze>0){ctx.fillStyle=`rgba(190,170,150,${haze*0.45})`;ctx.fillRect(0,0,W,H)}}
  poly([[-2000,-0.05,300],[2000,-0.05,300],[2000,-0.05,-2000],[-2000,-0.05,-2000]],fogC(hex('#7f8090'),400));cityGround();
  const objs=[];if(!rain)drawTower(t);
  drawCrumbleCity(tt,objs);
  for(const c of ocars){const z=ocarZ(c,12);objs.push(carObj(c.x,z,c.dir>0?0:Math.PI,c.col,0))}
  for(const c of pcars)objs.push(carObj(c.x,c.z,0,c.col,0));
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();
  if(rain){// steam + boiling rain
    for(let i=0;i<40;i++){const ph=((t*0.35+hash(i,1))%1);const x=(hash(i,2)-0.5)*60,z=-hash(i,3)*170+cam.z*0.3;const c=toCam([x,ph*20,z]);if(c[2]<2)continue;const s=scr(c);const r=(3+ph*10)*F/c[2];
      ctx.fillStyle=`rgba(235,235,240,${0.35*(1-ph)*Math.sin(ph*Math.PI)})`;ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill()}
    ctx.strokeStyle='rgba(210,225,240,0.5)';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<260;i++){const sp=2200+hash(i,5)*900;const y=((hash(i,6)*H*1.3+t*sp)%(H*1.3))-H*0.15;const x=hash(i,7)*W*1.2-W*0.1+y*0.12;ctx.moveTo(x,y);ctx.lineTo(x+14,y+110)}ctx.stroke();
    ctx.fillStyle='rgba(255,120,60,0.08)';ctx.fillRect(0,0,W,H)}}
// ---------------- PLANE ----------------
const PV=70,T_PLANE=19.0;
function planeState(t,off){const k=t-T_PLANE;let y=0,pitch=0;if(t>T_FO){const q=t-T_FO;y=-2.2*q*q;pitch=-0.06*Math.min(1,q/1.2)}
  return{p:[off[0],off[1]+y,off[2]-PV*k],pitch,roll:Math.sin(t*0.7+off[0])*0.02}}
const P_W=hex('#f2f4f7'),P_B=hex('#1f4fa8'),P_G=hex('#9aa0aa'),P_D=hex('#2a3140');
function planeDraw(pos,M,t,big){
  const parts=[[[0,0,0],1.9,1.9,17,{top:P_W,side:P_W,front:P_W,back:P_W,bottom:P_B},'fus'],[[0,-0.2,-18.6],1.45,1.45,1.8,{top:P_W,side:P_W,front:P_D,back:P_W,bottom:P_B}],
    [[0,4.8,15],0.22,3.4,2.6,{top:P_B,side:P_B,front:P_B,back:P_B},'',[0,-0.35,0]],[[-8.5,-0.9,1.5],8.5,0.3,3.2,{top:P_W,side:P_G},'',[0.45,0,0]],[[8.5,-0.9,1.5],8.5,0.3,3.2,{top:P_W,side:P_G},'',[-0.45,0,0]],
    [[-4.3,1.2,16.2],4.2,0.22,1.5,{top:P_W,side:P_G},'',[0.4,0,0]],[[4.3,1.2,16.2],4.2,0.22,1.5,{top:P_W,side:P_G},'',[-0.4,0,0]],
    [[-7,-2.3,-1.5],1.15,1.15,2.6,{top:P_G,side:P_G,front:P_D,back:P_D}],[[7,-2.3,-1.5],1.15,1.15,2.6,{top:P_G,side:P_G,front:P_D,back:P_D}]];
  const L=parts.map(p=>{const c=mapL(pos,M,p[0][0],p[0][1],p[0][2]);let MM=M;if(p[6]){const r=p[6];const lm=rotM(r[0],r[1],r[2]);MM=lm.map(v=>[M[0][0]*v[0]+M[1][0]*v[1]+M[2][0]*v[2],M[0][1]*v[0]+M[1][1]*v[1]+M[2][1]*v[2],M[0][2]*v[0]+M[1][2]*v[1]+M[2][2]*v[2]])}return{c,MM,p,d:dist(c)}});
  L.sort((a,b)=>b.d-a.d);for(const q of L)oboxDraw(q.c,q.MM,q.p[1],q.p[2],q.p[3],q.p[4],q.p[5]==='fus'&&big?(f=>{if(f.k!=='side')return;const o=[f.ctr[0]+f.n[0]*0.05,f.ctr[1]+f.n[1]*0.05,f.ctr[2]+f.n[2]*0.05];
      for(let zz=-14;zz<13;zz+=1.15){const P=(a,b)=>[o[0]+f.u[0]*a+f.v[0]*b,o[1]+f.u[1]*a+f.v[1]*b,o[2]+f.u[2]*a+f.v[2]*b];poly([P(0.35,zz),P(0.35,zz+0.5),P(0.95,zz+0.5),P(0.95,zz)],fogC(P_D,f.d))}
      const P=(a,b)=>[o[0]+f.u[0]*a+f.v[0]*b,o[1]+f.u[1]*a+f.v[1]*b,o[2]+f.u[2]*a+f.v[2]*b];poly([P(-0.9,-17),P(-0.9,17),P(-0.55,17),P(-0.55,-17)],fogC(P_B,f.d))}):null)}
const planesO=[[0,0,0,1],[-180,45,-320,0],[260,-25,-620,0],[-420,85,-900,0],[380,60,-1150,0]];
const cloudsO=[];{const r=rng(44);for(let i=0;i<70;i++)cloudsO.push({x:(r()-0.5)*1400,y:-80-r()*70,z:200-r()*2600,s:25+r()*30,seed:i});for(let i=0;i<14;i++)cloudsO.push({x:(r()-0.5)*700,y:-20+r()*50,z:100-r()*2200,s:14+r()*16,seed:100+i})}
const CLOUDW=hex('#ffffff');
function drawPlane(t){F=900;FOG=hex('#cfe0f2');FOGD=1800;FOGMAX=0.85;setLight([0.4,0.85,0.35]);AMB=0.6;
  const me=planeState(t,[0,0,0]);const u=(t-T_PLANE)/8;const a=0.95-0.35*u;cam.x=me.p[0]+Math.sin(a)*29;cam.y=me.p[1]+6-1.5*u;cam.z=me.p[2]+Math.cos(a)*29;lookAt(me.p[0]-2,me.p[1]+1,me.p[2]+1);cam.roll=Math.sin(t*0.6)*0.03;setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,'#0c3486');g.addColorStop(0.7,'#5c95da');g.addColorStop(1,'#cfe0f2');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  const sn=toCam([cam.x-600,500,cam.z-1800]);if(sn[2]>0){const s=scr(sn);glow(s[0],s[1],260,[255,250,230],0.9)}
  poly([[cam.x-6000,-140,cam.z+500],[cam.x+6000,-140,cam.z+500],[cam.x+6000,-140,cam.z-6000],[cam.x-6000,-140,cam.z-6000]],fogC(hex('#e9eef6'),1200));
  const objs=[];const zoff=me.p[2];
  for(const c of cloudsO){let z=c.z;while(z>zoff+300)z-=2800;while(z<zoff-2500)z+=2800;for(let i=0;i<5;i++){const x=c.x+(hash(c.seed,i)-0.5)*c.s*2.4,y=c.y+(hash(c.seed,i+7)-0.5)*c.s*0.5,zz=z+(hash(c.seed,i+3)-0.5)*c.s*1.6;objs.push(puffObj(x,y,zz,c.s*(0.6+0.5*hash(c.seed,i+5)),CLOUDW,0.9))}}
  for(const pl of planesO){const st=planeState(t,pl);const M=rotM(0,st.pitch,st.roll);const pos=st.p;
    objs.push({d:dist(pos),draw:()=>planeDraw(pos,M,t,pl[3])});
    for(const ex of[-7,7]){// contrails
      for(let tau=Math.max(T_PLANE-4,t-5);tau<=Math.min(t,T_FO);tau+=0.05){const s2=planeState(tau,pl);const M2=rotM(0,s2.pitch,s2.roll);const e=mapL(s2.p,M2,ex,-2.3,1.3);const age=t-tau;
        objs.push(puffObj(e[0],e[1]+age*0.4,e[2],1.1+age*1.2,CLOUDW,0.75*(1-age/5.2)))}
      if(t<T_FO+0.2){const e=mapL(pos,M,ex,-2.3,1.3);objs.push({d:dist(e)-0.5,draw:()=>{const c=toCam(e);if(c[2]<1)return;const s=scr(c);ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1],2.4*F/c[2],[255,190,120],t<T_FO?0.8:0.8*(1-(t-T_FO)/0.2));ctx.restore()}})}
      for(let q=0;q<10;q++){const t0=T_FO+q*0.06;const k=t-t0;if(k<0||k>3)continue;const s0=planeState(t0,pl);const e=mapL(s0.p,rotM(0,s0.pitch,0),ex,-2.3,1.3);objs.push(puffObj(e[0],e[1]+k,e[2],0.8+k*2.2,hex('#4a4a50'),0.6*(1-k/3)))}}}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- OCEAN ----------------
function seaLevel(t){if(t<T_EVAP)return 0;const k=t-T_EVAP;return -Math.min(72,0.5*7*k*k)}
function bedY(x,z){if(z>=0)return 0;const d=-z;const m=Math.min(1,d/70);return -3-0.13*d+m*(6*Math.sin(x*0.013+1.3)*Math.sin(d*0.011)+3*Math.sin(x*0.031+d*0.02))}
const SAND1=hex('#cdb98e'),SAND2=hex('#7a6d58'),WATER=hex('#1f5f8f');
const shipC={x:-60,z:-280,yaw:Math.PI/2};
const boats=[[-20,-70,0.4],[30,-95,1.2],[-70,-120,2.0],[65,-150,0.2],[10,-190,2.6],[100,-230,1.5],[-120,-210,0.8]];
const mistO=[];{const r=rng(66);for(let i=0;i<160;i++)mistO.push({x:(r()-0.5)*500,z:-20-r()*700,ph:r(),s:r()})}
function shipDraw(t){const wl=seaLevel(t);const b=bedY(shipC.x,shipC.z);const ground=b+1.2;let cy=Math.max(wl+1,ground);const gk=wl+1<ground?Math.min(1,(ground-(wl+1))/8):0;
  const M=rotM(shipC.yaw,0,0.12*gk);const c=[shipC.x,cy,shipC.z];const hull=hex('#9b2f2a'),hullT=hex('#1f2228');
  const parts=[[mapL(c,M,0,0,0),8,5,55,{top:hex('#5a5f66'),side:hull,front:hull,back:hull,bottom:hull}],[mapL(c,M,0,4.2,0),8.05,0.9,55.05,{top:hex('#5a5f66'),side:hullT,front:hullT,back:hullT}],
    [mapL(c,M,0,11,44),7,6,4,{top:hex('#e8e8ea'),side:hex('#f2f2f4'),front:hex('#f2f2f4'),back:hex('#f2f2f4')}]];
  const cc=['#d6453d','#3e6fd8','#f2c230','#3dbb6a','#e07a2a','#8a5ad8','#2ab0c2'];
  for(let i=0;i<9;i++)parts.push([mapL(c,M,0,7.4,-38+i*8.6),7.2,2.4,3.9,{top:hex(cc[i%7]),side:hex(cc[(i*3)%7])}]);
  return{d:dist(c),draw:()=>{parts.forEach(p=>p.d=dist(p[0]));parts.sort((a,b)=>b.d-a.d);for(const p of parts)oboxDraw(p[0],M,p[1],p[2],p[3],p[4])}}}
function boatObj(bt,t){const wl=seaLevel(t);const b=bedY(bt[0],bt[1]);const ground=b+0.5;const cy=Math.max(wl+0.4,ground);const gk=wl+0.4<ground?Math.min(1,(ground-(wl+0.4))/3):0;
  const M=rotM(bt[2],0,1.1*gk);const c=[bt[0],cy,bt[1]];return{d:dist(c),draw:()=>{oboxDraw(c,M,1.3,0.6,4,{top:hex('#d9cbb0'),side:hex('#f4f4f6'),front:hex('#f4f4f6'),back:hex('#f4f4f6')});
    const m0=mapL(c,M,0,0.6,0.5),m1=mapL(c,M,0,8,0.5),s1=mapL(c,M,0,1.2,3.3);facePoly([m0,m1,s1],hex('#fafafa'),true);oboxDraw(mapL(c,M,0,4.3,0.5),M,0.07,3.7,0.07,{top:P_D,side:P_D})}}}
function drawOcean(t,mode){const boom=mode==='boom';const tt=boom?60:t;F=900;FOG=boom?hex('#b9c2c8'):hex('#d8e6f0');FOGD=boom?800:1100;FOGMAX=0.88;setLight([0.4,0.8,0.4]);AMB=0.6;
  const wl=seaLevel(tt);
  if(!boom){const u=(t-T_OCEAN)/7;cam.x=-4+6*u;cam.y=22+6*u;cam.z=14-6*u;lookAt(0,-10-30*clamp((t-T_EVAP)/3.5,0,1),-220)}
  else{const u=(t-T_BACK)/6.75;cam.x=4;cam.y=30+4*u;cam.z=10-4*u;lookAt(0,-25,-300)}
  cam.roll=Math.sin(t*0.5)*0.02;if(!boom&&t>T_EVAP){const k=t-T_EVAP;const a=Math.min(0.006,k*0.003);cam.pitch+=Math.sin(t*31)*a}setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.62);if(boom){g.addColorStop(0,'#5a6470');g.addColorStop(1,'#c9cdd0')}else{g.addColorStop(0,'#2f78cf');g.addColorStop(0.7,'#8ebee8');g.addColorStop(1,'#e0edf5')}ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  poly([[-4000,-90,-3200],[4000,-90,-3200],[4000,-90,-900],[-4000,-90,-900]],fogC(SAND2,2000));
  poly([[-4000,wl,0],[4000,wl,0],[4000,wl,-3200],[-4000,wl,-3200]],fogC(WATER,600));
  const tiles=[];for(let zz=0;zz>-900;zz-=30)for(let xx=-330;xx<330;xx+=30){const c=[[xx,zz],[xx+30,zz],[xx+30,zz-30],[xx,zz-30]].map(p=>[p[0],bedY(p[0],p[1]),p[1]]);const mx=Math.max(...c.map(p=>p[1]));if(mx<=wl+0.2)continue;tiles.push({c,d:dist([xx+15,mx,zz-15]),dep:-mx})}
  tiles.sort((a,b)=>b.d-a.d);for(const tl of tiles){const col=mix(SAND1,SAND2,clamp(tl.dep/60,0,1));facePoly(tl.c.slice().reverse(),col,true)}
  poly([[-400,2,0],[400,2,0],[400,2,40],[-400,2,40]],fogC(hex('#9a9aa2'),20));poly([[-400,2.05,0],[400,2.05,0],[400,2.05,1.2],[-400,2.05,1.2]],fogC(hex('#d8d050'),15));
  const objs=[shipDraw(tt)];for(const bt of boats)objs.push(boatObj(bt,tt));
  const inten=boom?1:clamp((t-T_EVAP+0.3)/1.0,0,1);
  if(inten>0)for(const m of mistO){const ph=((t*0.4+m.ph)%1);const y=Math.max(wl,bedY(m.x,m.z))+2+ph*18;objs.push(puffObj(m.x,y,m.z,6+ph*16,hex('#eef4f8'),(boom?0.22:0.45)*inten*Math.sin(ph*Math.PI)))}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();
  if(!boom&&t>T_EVAP){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<220;i++){const x=(hash(i,1)-0.5)*500,z=-30-hash(i,2)*400;if(bedY(x,z)>wl)continue;const fl=Math.sin(t*12+i)*0.5+0.5;if(fl<0.5)continue;const c=toCam([x,wl+0.2,z]);if(c[2]<2)continue;const s=scr(c);const r=Math.max(1.5,60/c[2]);ctx.fillStyle=`rgba(255,255,255,${0.5*fl})`;ctx.fillRect(s[0]-r,s[1]-r*0.3,r*2,r*0.6)}ctx.restore()}
  if(boom){ctx.fillStyle='rgba(220,225,230,0.08)';ctx.fillRect(0,0,W,H);
    const k=t-T_BOOM;if(k>0){const c=toCam([0,0,-1800]);const Rr=2600*(1-Math.exp(-k/0.55));if(c[2]>0){const s=scr(c);const rp=Rr*F/c[2];
      ctx.save();ctx.globalCompositeOperation='lighter';const gg=ctx.createRadialGradient(s[0],s[1],0,s[0],s[1],rp);gg.addColorStop(0,'rgba(255,255,240,1)');gg.addColorStop(0.35,'rgba(255,220,120,0.95)');gg.addColorStop(0.7,'rgba(255,120,40,0.8)');gg.addColorStop(1,'rgba(200,40,20,0)');
      ctx.fillStyle=gg;ctx.beginPath();ctx.arc(s[0],s[1],rp,Math.PI,0);ctx.fill();ctx.restore();ctx.fillStyle=`rgba(255,140,60,${Math.min(0.45,k*0.5)})`;ctx.fillRect(0,0,W,H)}}}}
// ---------------- CRUST ----------------
const PSZ=40,PX0=-260,PZ0=-460,PNX=13,PNZ=13;const pverts=[];R=rng(202);
for(let i=0;i<=PNX;i++){pverts.push([]);for(let j=0;j<=PNZ;j++){const ed=(i===0||j===0||i===PNX||j===PNZ);pverts[i].push([PX0+i*PSZ+(ed?0:rr(-12,12)),PZ0+j*PSZ+(ed?0:rr(-12,12))])}}
const plates=[];const FIELD=['#94b366','#a9bd63','#7a9b55','#c9b27a','#6f8f4e','#b5c46a'];
for(let i=0;i<PNX;i++)for(let j=0;j<PNZ;j++){const cs=[pverts[i][j],pverts[i+1][j],pverts[i+1][j+1],pverts[i][j+1]];const cx=cs.reduce((a,p)=>a+p[0],0)/4,cz=cs.reduce((a,p)=>a+p[1],0)/4;
  const town=Math.hypot(cx,cz+140)<110;const road=i===6;
  const pl={cs,cx,cz,col:hex(road?'#6b6d74':town?'#a8a39a':pick(FIELD)),road,td:T_CRACK+(cz-PZ0)/520*1.9+R()*0.6,houses:[],trees:[]};
  if(town&&!road)for(let q=0;q<4;q++)pl.houses.push([cx+rr(-12,12),cz+rr(-12,12),rr(5,9),hex(pick(['#e8d9c0','#f2e6d0','#d9c3a5','#cfd8e0'])),hex(pick(['#b5482f','#8a3a2a','#5a5f6a']))]);
  else if(!road)for(let q=0;q<5;q++)if(R()<0.6)pl.trees.push([cx+rr(-14,14),cz+rr(-14,14),rr(0.8,1.4)]);
  plates.push(pl)}
const DIRT=hex('#6b4a33'),DIRT2=hex('#4a3324'),TRK=hex('#5a3d2a'),LEAF=hex('#4f7d3c');
function plateY(pl,t){const k=t-pl.td;return k>0?-0.5*24*k*k:0}
function drawCrust(t){F=900;FOG=hex('#dfe6ea');FOGD=900;FOGMAX=0.85;setLight([0.4,0.85,0.3]);AMB=0.55;
  const u=(t-T_CRUST)/8;cam.x=0;cam.y=140-20*u;cam.z=130-40*u;lookAt(0,0,-150);cam.roll=0.02*Math.sin(t*0.5);
  if(t>T_CRACK){const k=t-T_CRACK;const a=Math.min(0.012,k*0.004);cam.pitch+=Math.sin(t*33)*a;cam.roll+=Math.cos(t*27)*a}setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.5);g.addColorStop(0,'#5b9be0');g.addColorStop(1,'#dfe6ea');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  poly([[-3000,0,-3000],[3000,0,-3000],[3000,0,-470],[-3000,0,-470]],fogC(hex('#8aa463'),900));
  poly([[-3000,0,60],[-270,0,60],[-270,0,-470],[-3000,0,-470]],fogC(hex('#8aa463'),500));poly([[270,0,60],[3000,0,60],[3000,0,-470],[270,0,-470]],fogC(hex('#8aa463'),500));poly([[-3000,0,400],[3000,0,400],[3000,0,60],[-3000,0,60]],fogC(hex('#8aa463'),300));
  const dropped=plates.filter(p=>t>p.td).length/plates.length;
  poly([[-270,-300,60],[270,-300,60],[270,-300,-470],[-270,-300,-470]],hex('#1a0c08'));
  if(dropped>0){const c=toCam([0,-300,-180]);if(c[2]>0){const s=scr(c);ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1],900,[255,90,20],0.6*dropped);ctx.restore()}}
  const ps=plates.slice().sort((a,b)=>dist([b.cx,plateY(b,t),b.cz])-dist([a.cx,plateY(a,t),a.cz]));
  const dropP=ps.filter(p=>plateY(p,t)<-0.01),upP=ps.filter(p=>plateY(p,t)>=-0.01);
  for(const pl of upP){const top=pl.cs.map(p=>[p[0],0,p[1]]),bot=pl.cs.map(p=>[p[0],-70,p[1]]);pl._w=()=>{for(let i=0;i<4;i++){const j=(i+1)%4;facePoly([top[i],bot[i],bot[j],top[j]],i%2?DIRT:DIRT2)}}}
  const order=[...dropP.map(p=>[p,1]),...upP.map(p=>[p,0])];
  for(const pl of upP)pl._w();
  for(const [pl,isDrop] of order){const y=plateY(pl,t);if(y<-280)continue;const top=pl.cs.map(p=>[p[0],y,p[1]]);const bot=pl.cs.map(p=>[p[0],y-70,p[1]]);
    if(isDrop)for(let i=0;i<4;i++){const j=(i+1)%4;facePoly([top[i],bot[i],bot[j],top[j]],i%2?DIRT:DIRT2)}
    facePoly([top[0],top[3],top[2],top[1]],pl.col);
    if(pl.road){const a=[(top[0][0]+top[1][0])/2,y+0.05,top[0][2]],b=[(top[3][0]+top[2][0])/2,y+0.05,top[3][2]];poly([[a[0]-0.3,a[1],a[2]],[a[0]+0.3,a[1],a[2]],[b[0]+0.3,b[1],b[2]],[b[0]-0.3,b[1],b[2]]],fogC(hex('#e8e8e8'),dist(a)))}
    for(const h of pl.houses){drawFaces(boxFaces(h[0],h[1],y,y+4,7,9,0.3,{top:h[3],side:h[3],front:h[3],back:h[3]}));const cs=Math.cos(0.3),sn=Math.sin(0.3);const P=(lx,yy,lz)=>[h[0]+lx*cs+lz*sn,y+yy,h[1]-lx*sn+lz*cs];
      facePoly([P(-3.9,3.8,-4.9),P(0,6.5,-4.9),P(0,6.5,4.9),P(-3.9,3.8,4.9)],h[4],true);facePoly([P(3.9,3.8,-4.9),P(0,6.5,-4.9),P(0,6.5,4.9),P(3.9,3.8,4.9)],h[4],true)}
    for(const tr of pl.trees){const s=tr[2];drawFaces(boxFaces(tr[0],tr[1],y,y+1.6*s,0.5*s,0.5*s,0,{top:TRK,side:TRK}));const ap=[tr[0],y+6.5*s,tr[1]],r=2*s,b=y+1.4*s;const Q=[[tr[0]-r,b,tr[1]-r],[tr[0]+r,b,tr[1]-r],[tr[0]+r,b,tr[1]+r],[tr[0]-r,b,tr[1]+r]];for(let i=0;i<4;i++)facePoly([Q[i],Q[(i+1)%4],ap],LEAF)}
    const k=t-pl.td;if(k>0&&k<2.5)for(let q=0;q<3;q++){const p=pl.cs[q];const c=toCam([p[0],-4+k*3,p[1]]);if(c[2]<2)continue;const s=scr(c);const r=(6+k*8)*F/c[2];ctx.fillStyle=`rgba(150,120,95,${0.45*(1-k/2.5)})`;ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill()}}}
// ---------------- HAND / PHONE ----------------
function drawHandO(t,dropY){const walk=t<T_EAR;const bx=Math.sin(t*3.2)*5*(walk?1:0.3),by=Math.abs(Math.sin(t*3.2))*9*(walk?1:0.3);
  ctx.save();ctx.translate(735+bx+shakeX*0.5,1610+by+dropY);ctx.rotate(-0.13+dropY/2500);
  const skin='#d8a58d',skinD='#b98670',skinL='#e8bba3';const pw=410,ph=800,px=-pw/2,py=-ph/2;
  [[-150,175],[-60,215],[35,200],[125,160]].forEach(([fx,fh])=>{ctx.fillStyle=skinD;capsule(fx-36,py-fh+40,74,fh+80);ctx.fill();ctx.fillStyle=skin;capsule(fx-32,py-fh+40,64,fh+76);ctx.fill();ctx.fillStyle='rgba(255,230,215,0.35)';capsule(fx-18,py-fh+52,20,fh*0.55);ctx.fill()});
  ctx.fillStyle=skin;rrect(px+pw-70,py+80,170,560,80);ctx.fill();
  ctx.fillStyle='#232a3f';ctx.beginPath();ctx.moveTo(px+40,py+ph-40);ctx.lineTo(px+pw+190,py+ph-140);ctx.lineTo(px+pw+260,py+ph+260);ctx.lineTo(px-20,py+ph+260);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2b2f3a';rrect(px-10,py-10,pw+20,ph+20,58);ctx.fill();ctx.fillStyle='#3a3f4c';rrect(px,py,pw,ph,50);ctx.fill();ctx.fillStyle='#0b0b12';rrect(px+16,py+16,pw-32,ph-32,40);ctx.fill();
  ctx.save();rrect(px+22,py+22,pw-44,ph-44,36);ctx.clip();const sg=ctx.createLinearGradient(px,py,px+pw,py+ph);sg.addColorStop(0,'#0f4a6a');sg.addColorStop(0.5,'#1f7a8a');sg.addColorStop(1,'#7ac0b0');ctx.fillStyle=sg;ctx.fillRect(px,py,pw,ph);
  txt('Friday, October 30',0,py+120,24,'rgba(255,255,255,0.85)','center',600,false);txt('9:41',0,py+200,110,'#ffffff','center',300,false);
  const na=clamp((t-1.9)/0.3,0,1);if(na>0){const ny=py+300+(1-easeOut(na))*-60;ctx.globalAlpha=na;ctx.fillStyle='rgba(250,250,252,0.95)';rrect(px+36,ny,pw-72,190,28);ctx.fill();
    txt('⚠️ EMERGENCY ALERT',px+62,ny+42,22,'#d42a2a','left',900,false);txt('Oxygen levels dropping',px+62,ny+88,22,'#111','left',700,false);txt('worldwide. Take a deep',px+62,ny+120,22,'#111','left',700,false);txt('breath.',px+62,ny+152,22,'#111','left',700,false);ctx.globalAlpha=1}
  ctx.restore();ctx.fillStyle=skinD;ctx.save();ctx.translate(px-30,py+560);ctx.rotate(-0.55);capsule(-40,-30,84,250);ctx.fill();ctx.fillStyle=skin;capsule(-36,-30,76,244);ctx.fill();ctx.fillStyle=skinL;rrect(-22,-16,46,60,22);ctx.fill();ctx.restore();ctx.restore()}
// ---------------- OVERLAYS ----------------
const capsO=[[3.7,6.1,'🌬️ Air pressure drops by a fifth'],[6.1,7.75,'👂 Every ear on Earth pops'],[7.75,9.45,'🚗 Every combustion engine dies'],[9.45,11.5,'🔥 …and every flame goes out'],
 [11.6,14.8,'🧱 Concrete needs oxygen to hold together'],[14.8,19.0,'So every building… crumbles to dust'],
 [19.1,22.5,'✈️ At 10,000 m, every jet engine shuts off'],[22.5,27.0,'Thousands of planes… gliding in silence'],
 [27.1,29.7,'💧 Water = hydrogen + oxygen'],[29.7,34.0,'So the oceans… turn into hydrogen gas'],
 [34.1,37.1,'🌍 Earth\'s crust is almost half oxygen'],[37.1,42.0,'The ground beneath your feet… crumbles'],
 [42.1,44.45,'⚡ 5 seconds later… oxygen is back'],[44.45,47.05,'And it meets trillions of tons of hydrogen'],
 [48.9,52.45,'✅ Good news: the explosion makes water again'],[52.45,56.0,'Bad news: it\'s raining… boiling 🥵']];
function drawCaptionO(t){for(const[a,b,s]of capsO){if(t<a||t>=b)continue;const k=t-a;const sc=k<0.18?0.6+0.4*ease(k/0.18)+Math.sin(k/0.18*Math.PI)*0.12:1;const al=Math.min(1,k/0.1,(b-t)/0.12);const size=fitSize(s,920,58);
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,640);ctx.scale(sc,sc);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function drawTitleO(t){const a=t<2.75?1:clamp((3.0-t)/0.25,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,400);ctx.scale(pop,pop);
  const l1='What if oxygen disappeared',l2='for 5 seconds?';const s=Math.min(fitSize(l1,980,88),fitSize(l2,980,88));ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffd84a');txt(l2,0,s*0.56,s,'#ffd84a');ctx.restore()}
function drawTimerO(t){if(t<COLD||t>=T_BACK)return;
  if(t<T_GONE){const v=T_GONE-t;ctx.save();ctx.font='800 30px Inter';let x=56;const lab='OXYGEN DISAPPEARS IN';ctx.textBaseline='middle';ctx.lineWidth=6;ctx.strokeStyle='rgba(20,15,30,0.85)';ctx.lineJoin='round';
    for(const ch of lab){ctx.strokeText(ch,x,850);ctx.fillStyle='rgba(255,255,255,0.92)';ctx.fillText(ch,x,850);x+=ctx.measureText(ch).width+4}ctx.restore();txt(v.toFixed(1)+' S',56,920,96,'#ffd84a','left',900);return}
  const v=(t-T_GONE)/(T_BACK-T_GONE)*5;ctx.save();ctx.fillStyle='rgba(15,10,30,0.66)';rrect(40,190,380,150,28);ctx.fill();ctx.font='800 24px Inter';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText('TIME WITHOUT OXYGEN',66,228);
  txt(v.toFixed(2)+' s',66,282,58,'#ff5d5d','left',900,false);ctx.fillStyle='rgba(255,255,255,0.2)';rrect(262,268,132,14,7);ctx.fill();ctx.fillStyle='#ff5d5d';rrect(262,268,132*v/5,14,7);ctx.fill();ctx.restore()}
function fitW(s,size){ctx.font=`900 ${size}px Inter`;return ctx.measureText(s).width}
function statBox(label,val,col,a){ctx.save();ctx.globalAlpha=a;ctx.font='800 26px Inter';const w=Math.max(ctx.measureText(label).width,fitW(val,64))+60;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(56,1360,w,170,30);ctx.fill();ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText(label,86,1402);txt(val,86,1468,64,col,'left',900,false);ctx.restore()}
function drawStatsO(t){
  if(t>=T_GONE+0.2&&t<6.0){const a=Math.min(1,(t-T_GONE-0.2)/0.25,(6.0-t)/0.2);const f=clamp((t-3.3)/0.9,0,1);statBox('AIR PRESSURE',Math.round(100-21*f)+'%',f<1?'#ffffff':'#ff6b6b',a)}
  if(t>=T_FO-0.2&&t<T_OCEAN){const a=Math.min(1,(t-T_FO+0.2)/0.25,(T_OCEAN-t)/0.2);statBox('ENGINES RUNNING','0','#ff6b6b',a)}
  if(t>=T_EVAP+0.1&&t<T_CRUST){const a=Math.min(1,(t-T_EVAP-0.1)/0.25,(T_CRUST-t)/0.2);statBox('SEA LEVEL',Math.round(seaLevel(t))+' m','#ff6b6b',a)}}
function drawEndO(t){const k=ease((t-T_END)/0.5)*clamp((LOOP-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.74*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-T_END<0.5?0.7+0.3*ease((t-T_END-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);txt('Would you survive',0,-100,92,'#ffd84a');txt('these 5 seconds?',0,10,92,'#ffd84a');const bounce=Math.abs(Math.sin((t-T_END)*5))*26;txt('👇',0,190+bounce,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-T_END-0.6)/0.4);txt('What should disappear next?',W/2,1150,50,'#ffffff','center',800);txt('Follow for Part 4',W/2,1230,40,'rgba(255,255,255,0.8)','center',800);ctx.restore()}
// ---------------- FRAME ----------------
const COLD=1.6,LOOP=59.45;
function sceneAtO(t){if(t<11.5)return'city';if(t<T_PLANE)return'crum';if(t<T_OCEAN)return'plane';if(t<T_CRUST)return'ocean';if(t<T_BACK)return'crust';if(t<T_RAIN)return'boom';return'rain'}
function shakesO(t){shakeX=0;shakeY=0;const s=(t0,amp,dur)=>{const k=t-t0;if(k>0&&k<dur){const a=amp*(1-k/dur);shakeX+=Math.sin(k*61)*a;shakeY+=Math.cos(k*47)*a}};
  s(T_GONE,12,0.4);s(T_EAR,26,0.6);s(T_FO,8,0.5);s(T_BACK,14,0.5);s(T_BOOM,40,1.5);s(T_BOOM+0.6,25,1.2);s(38.84,14,1.0);s(T_CRUM+0.6,8,2)}
function renderSceneO(t){ctx.save();shakesO(t);
  if(t<COLD||t>=LOOP){const tt=t>=LOOP?t-60:t;if(tt<0.85)drawCrumble(16.4+tt*1.4);else drawOcean(T_BOOM+0.12+(tt-0.85)*0.8,'boom');ctx.restore();return}
  const sc=sceneAtO(t);if(sc==='city')drawCityO(t);else if(sc==='crum')drawCrumble(t);else if(sc==='plane')drawPlane(t);else if(sc==='ocean')drawOcean(t);else if(sc==='crust')drawCrust(t);else if(sc==='boom')drawOcean(t,'boom');else drawCrumble(t,'rain');
  ctx.restore()}
function overlaysO(t){ctx=ctx0;shakeX=0;shakeY=0;
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(t>=COLD&&t<T_EAR+0.7){const drop=t<T_EAR?0:Math.pow(clamp((t-T_EAR)/0.6,0,1),2)*1300;shakesO(t);drawHandO(t,drop);shakeX=0;shakeY=0}
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(T_GONE,0.8,0.35);flash(T_BACK,0.85,0.45);flash(T_BOOM,1.0,0.9,'255,250,235');flash(0.85,0.9,0.4,'255,250,235');flash(COLD,0.7,0.25);flash(0,0.5,0.15);flash(T_EAR,0.35,0.2,'255,255,255');
  [11.5,T_PLANE,T_OCEAN,T_CRUST,T_RAIN].forEach(tt=>flash(tt,0.55,0.22));[11.5,T_PLANE,T_OCEAN,T_CRUST,T_RAIN].forEach(tt=>{const k=tt-t;if(k>0&&k<0.18){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.18)})`;ctx.fillRect(0,0,W,H)}});
  if(t<3)drawTitleO(t);drawTimerO(t);drawStatsO(t);drawCaptionO(t);
  if(t>=T_GONE&&t<T_GONE+1.1){const k=t-T_GONE;const s=k<0.2?1.6-0.6*easeOut(k/0.2):1;const a=Math.min(1,(1.1-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('OXYGEN: GONE',0,0,100,'#ff5d5d');ctx.restore()}
  if(t>=T_BACK&&t<T_BACK+1.6){const k=t-T_BACK;const s=k<0.25?0.5+0.5*easeOut(k/0.25):1;const a=Math.min(1,(1.6-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('OXYGEN IS BACK',0,0,96,'#7dff9a');ctx.restore()}
  drawEndO(t);{const k=LOOP-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const t0=fi/FPS;
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderSceneO(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;const te=t0-T_EAR;if(te>0&&te<0.7){const z=1+0.06*Math.sin(te/0.7*Math.PI)*(1-te/0.7);ctx0.filter=`blur(${(5*(1-te/0.7)).toFixed(1)}px)`;ctx0.drawImage(acc,W/2-W*z/2,H/2-H*z/2,W*z,H*z);ctx0.filter='none'}else ctx0.drawImage(acc,0,0);
  overlaysO(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;window.crashes=[];
</script></body></html>
