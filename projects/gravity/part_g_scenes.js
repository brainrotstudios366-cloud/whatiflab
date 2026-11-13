
// ======================================================================
// ============================ GRAVITY SCENES ==========================
// ======================================================================
const T_STEP=4.8,T_GB=43.9,T_FALLN=45.8,T_IMP=50.2,T_PHONE=52.24,T_ORB=29.1,T_ERUPT=38.3;
const SKIN=hex('#d9a68a'),HAIR=hex('#3a2a22');
R=rng(31);
// ---------------- CITY (gravity off) ----------------
const gcars=[];{let z=40;while(z>-180){gcars.push({x:-6.6,dir:1,z0:z,v0:9,vy:R()<0.6?rr(0.1,0.9):0,wr:rr(-0.3,0.3),wp:rr(-0.2,0.2),col:hex(pick(carCols))});z-=rr(13,18)}
  z=50;while(z>-180){gcars.push({x:-3.5,dir:-1,z0:z,v0:8,vy:R()<0.6?rr(0.1,0.9):0,wr:rr(-0.3,0.3),wp:rr(-0.2,0.2),col:hex(pick(carCols))});z-=rr(13,18)}}
const gpark=[];for(let z=34;z>-175;z-=rr(5.4,7)){if(R()<0.12)continue;gpark.push({x:-9.1,z,col:hex(pick(carCols)),vy:R()<0.3?rr(0.05,0.3):0,wr:rr(-0.15,0.15)})}
function carGState(c,t){const z=c.z0+c.dir*c.v0*t;const k=Math.max(0,t-T_GONE-0.3);return{x:c.x,y:c.vy*k,z,M:rotM(c.dir>0?0:Math.PI,c.wp*k,c.wr*k)}}
const gpeople=[];for(let i=0;i<240;i++){let x,z;if(R()<0.7){x=rr(-0.8,13);z=rr(-125,25)}else{x=rr(-13.6,-10.6);z=rr(-125,25)}
  if(Math.hypot(x-6,z+24)<4.5)continue;gpeople.push({x,z,dir:R()<0.5?1:-1,sp:rr(1.0,1.6),ph:rr(0,6.28),shirt:hex(pick(shirts)),pant:hex(pick(pants)),h:rr(0.92,1.08),ts:T_GONE+R()*2.2,vy:rr(0.35,1.4),wp:rr(-0.6,0.6),wr:rr(-0.4,0.4)})}
function personG(p,t,mode){let z=p.z+p.dir*p.sp*Math.min(t,48);while(z<-125)z+=150;while(z>25)z-=150;
  let y=0,pit=0,rol=0;const k=t-p.ts;
  if(mode==='fall'){const y0=Math.min(5,p.vy*3);const tau=fallTau(t);y=Math.max(0,y0-4.9*tau*tau);pit=y>0?p.wp*2:0;rol=y>0?p.wr*2:0}
  else if(k>0){y=p.vy*k;pit=p.wp*k;rol=p.wr*k}
  if(Math.hypot(p.x-cam.x,z-cam.z)<2.4&&Math.abs(y-cam.y)<2.5)return null;
  const bob=(t<T_GONE&&mode!=='fall')?Math.abs(Math.sin(t*p.sp*4+p.ph))*0.06:0;const yaw=p.dir>0?0:Math.PI;const M=rotM(yaw,pit,rol);const ctr=[p.x,y+bob+0.87*p.h,z];const feet=mapL(ctr,M,0,-0.87*p.h,0);const h=p.h;
  return{d:dist(ctr),draw:()=>{const parts=[[mapL(feet,M,0,0.41*h,0),0.21,0.41*h,0.13,{top:p.pant,side:p.pant}],[mapL(feet,M,0,1.12*h,0),0.26,0.3*h,0.15,{top:p.shirt,side:p.shirt}],[mapL(feet,M,0,1.6*h,0),0.13,0.14*h,0.13,{top:HAIR,side:SKIN,front:SKIN,back:HAIR}]];stackDraw(parts,feet,M)}}}
const gdebris=[];{const cols=['#e04848','#3c8de0','#f0d040','#f2f2f2','#52c060','#ff8a30','#8a5a3c','#9aa0aa'];for(let i=0;i<170;i++)gdebris.push({x:rr(-13,13),z:rr(-110,5),s:rr(0.2,0.6),vy:rr(0.2,1.6),ts:T_GONE+R()*2.5,w:rr(-2,2),col:hex(pick(cols)),fy:rr(6,30)})}
function debrisObj(q,t,mode){let y;if(mode==='fall'){const tau=fallTau(t);y=Math.max(q.s,q.fy-4.9*tau*tau)}else{const k=t-q.ts;if(k<0)return null;y=q.s+q.vy*k}
  const M=rotM(q.w*t,q.w*t*0.7,0);const c=[q.x,y,q.z];return{d:dist(c),draw:()=>oboxDraw(c,M,q.s,q.s*0.6,q.s,{top:q.col,side:q.col,front:q.col,back:q.col,bottom:q.col})}}
// fountain
const FX=6,FZ=-24;
function fountainDraw(t){const basin=hex('#b9b4ad'),water=hex('#5fa8d8');drawFaces(boxFaces(FX,FZ,0,0.6,6,6,0,{top:water,side:basin,front:basin,back:basin}));drawFaces(boxFaces(FX,FZ,0.6,1.6,0.8,0.8,0,{top:basin,side:basin}));
  ctx.save();ctx.fillStyle='rgba(200,230,255,0.85)';const g=9.8;
  for(let i=0;i<220;i++){const per=2.2;const te=Math.floor((t-hash(i,9)*per)/per)*per+hash(i,9)*per;for(let rep=0;rep<3;rep++){const e=te-rep*per;const tau=t-e;if(tau<0)continue;
      const D=clamp(T_GONE-e,0,tau);const v0=6+hash(i,2)*2;const ang=hash(i,3)*6.283;const sp=0.6+hash(i,4)*0.6;const y=1.6+v0*tau-0.5*g*D*D-g*D*(tau-D);if(y<0.5){continue}
      if(tau>8)continue;const x=FX+Math.cos(ang)*sp*tau,z=FZ+Math.sin(ang)*sp*tau;const c=toCam([x,y,z]);if(c[2]<0.5)continue;const s=scr(c);const r=Math.max(1.5,0.12*F/c[2]);ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill()}}
  ctx.restore()}
function cityCamG(t){cam.x=0.4;cam.yaw=0.17;cam.pitch=0.07;cam.roll=0;
  if(t<T_STEP){cam.z=-0.55*t;cam.y=1.7+(t<T_GONE?Math.abs(Math.sin(t*3.2))*0.03:0)}
  else{const k=t-T_STEP;cam.z=-0.55*t;cam.y=1.7+1.1*k;cam.pitch=0.07-0.22*ease(k/4);cam.roll=0.12*Math.sin(k*0.45);cam.yaw=0.17+0.05*Math.sin(k*0.35)}}
function drawCityG(t){F=930;FOG=hex('#e9a991');FOGD=150;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;cityCamG(t);setCam();drawCitySky(t);cityGround();drawTower(t);
  buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];for(const c of gcars){const s=carGState(c,t);const o=carOObj([s.x,s.y,s.z],s.M,c.col);if(o.d>-3)objs.push(o)}
  for(const c of gpark){const k=Math.max(0,t-T_GONE-0.3);objs.push(carOObj([c.x,c.vy*k,c.z],rotM(0,0,c.wr*k),c.col))}
  for(const p of gpeople){const o=personG(p,t);if(o&&o.d>0)objs.push(o)}
  for(const q of gdebris){const o=debrisObj(q,t);if(o&&o.d>0)objs.push(o)}
  for(const l of lamps){const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  objs.push({d:dist([FX,1,FZ]),draw:()=>fountainDraw(t)});
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- OCEAN (waves keep rising) ----------------
function bedY(x,z){if(z>=0)return 0;const d=-z;const m=Math.min(1,d/70);return -3-0.13*d+m*(6*Math.sin(x*0.013+1.3)*Math.sin(d*0.011)+3*Math.sin(x*0.031+d*0.02))}
const WATER=hex('#1f6a9a'),WATER2=hex('#3f8fc0'),FOAM=hex('#e8f4fb');
function waveH(x,z,t){return 0.8*Math.sin(x*0.05+t*1.3)+0.6*Math.sin(z*0.07-t*1.7+x*0.02)+0.35*Math.sin((x+z)*0.11+t*2.3)}
const blobs=[];{const r=rng(12);for(let i=0;i<90;i++)blobs.push({x:(r()-0.5)*360,z:-30-r()*420,t0:13.0+r()*5.2,vy:2+r()*5,r0:2+r()*9,ph:r()*6})}
const shipG={x:-60,z:-280,yaw:Math.PI/2};const boatsG=[[-20,-70,0.4],[30,-95,1.2],[-70,-120,2.0],[65,-150,0.2],[10,-190,2.6],[100,-230,1.5],[-120,-210,0.8]];
function shipGDraw(t){const k=Math.max(0,t-14.2);const M=rotM(shipG.yaw,0.04*k,0.06*k);const c=[shipG.x,1+0.9*k*k*0.3,shipG.z];const hull=hex('#9b2f2a'),hullT=hex('#1f2228');
  const parts=[[mapL(c,M,0,0,0),8,5,55,{top:hex('#5a5f66'),side:hull,front:hull,back:hull,bottom:hull}],[mapL(c,M,0,4.2,0),8.05,0.9,55.05,{top:hex('#5a5f66'),side:hullT,front:hullT,back:hullT}],[mapL(c,M,0,11,44),7,6,4,{top:hex('#e8e8ea'),side:hex('#f2f2f4')}]];
  const cc=['#d6453d','#3e6fd8','#f2c230','#3dbb6a','#e07a2a','#8a5ad8','#2ab0c2'];for(let i=0;i<9;i++){const lift=k>0.8?Math.max(0,(k-0.8)*(0.6+hash(i,4)))*1.5:0;parts.push([mapL(c,M,0,7.4+lift,-38+i*8.6),7.2,2.4,3.9,{top:hex(cc[i%7]),side:hex(cc[(i*3)%7])}])}
  return{d:dist(c),draw:()=>{parts.forEach(p=>p.d=dist(p[0]));parts.sort((a,b)=>b.d-a.d);for(const p of parts)oboxDraw(p[0],M,p[1],p[2],p[3],p[4])}}}
function boatGObj(bt,t){const k=Math.max(0,t-13.6-hash(bt[0],1));const M=rotM(bt[2]+0.3*k,0.25*k,0.4*k*Math.sin(bt[2]));const c=[bt[0],0.4+waveH(bt[0],bt[1],t)*(k>0?0:1)+1.4*k,bt[1]];
  return{d:dist(c),draw:()=>{oboxDraw(c,M,1.3,0.6,4,{top:hex('#d9cbb0'),side:hex('#f4f4f6'),front:hex('#f4f4f6'),back:hex('#f4f4f6'),bottom:hex('#f4f4f6')});const m0=mapL(c,M,0,0.6,0.5),m1=mapL(c,M,0,8,0.5),s1=mapL(c,M,0,1.2,3.3);facePoly([m0,m1,s1],hex('#fafafa'),true);oboxDraw(mapL(c,M,0,4.3,0.5),M,0.07,3.7,0.07,{top:hex('#2a3140'),side:hex('#2a3140')})}}}
function blobObj(b,t){const k=t-b.t0;if(k<0)return null;const y=waveH(b.x,b.z,b.t0)+b.vy*k;const r=b.r0*(0.6+0.4*Math.min(1,k*1.5));return{d:dist([b.x,y,b.z]),draw:()=>{const c=toCam([b.x,y,b.z]);if(c[2]<1)return;const s=scr(c);const rp=r*F/c[2];if(rp<1)return;
  const wob=1+0.12*Math.sin(t*5+b.ph);const g=ctx.createRadialGradient(s[0]-rp*0.35,s[1]-rp*0.4,rp*0.05,s[0],s[1],rp);g.addColorStop(0,'rgba(220,245,255,0.95)');g.addColorStop(0.35,'rgba(90,170,220,0.85)');g.addColorStop(1,'rgba(20,90,150,0.75)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(s[0],s[1],rp*wob,rp/wob,Math.sin(t+b.ph)*0.5,0,7);ctx.fill()}}}
function drawOceanG(t){F=900;FOG=hex('#d8e6f0');FOGD=1100;FOGMAX=0.88;setLight([0.4,0.8,0.4]);AMB=0.6;
  const u=(t-11.5)/7.5;cam.x=-4+6*u;cam.y=16+10*u;cam.z=14-6*u;lookAt(0,4+40*ease((t-14)/4.5),-220);cam.roll=Math.sin(t*0.5)*0.02;setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,'#2f78cf');g.addColorStop(0.7,'#8ebee8');g.addColorStop(1,'#e0edf5');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  poly([[-4000,0,-3200],[4000,0,-3200],[4000,0,-600],[-4000,0,-600]],fogC(WATER,1500));
  const quads=[];for(let zz=0;zz>-600;zz-=(zz>-120?10:25)){const st=zz>-120?10:25;for(let xx=-300;xx<300;xx+=st){const P=(x,z)=>[x,waveH(x,z,t),z];const q=[P(xx,zz),P(xx+st,zz),P(xx+st,zz-st),P(xx,zz-st)];quads.push({q,d:dist([xx+st/2,0,zz-st/2])})}}
  quads.sort((a,b)=>b.d-a.d);for(const qd of quads){const n=nrm([qd.q[0],qd.q[2],qd.q[1]]);const hh=(qd.q[0][1]+qd.q[2][1])/2;const col=mix(mix(WATER,WATER2,clamp(0.5+hh*0.4,0,1)),FOAM,hh>1.2?0.4:0);poly(qd.q,fogC(mul(col,0.8+0.3*Math.max(0,n[1])),qd.d))}
  poly([[-400,2,0],[400,2,0],[400,2,40],[-400,2,40]],fogC(hex('#9a9aa2'),20));poly([[-400,2.05,0],[400,2.05,0],[400,2.05,1.2],[-400,2.05,1.2]],fogC(hex('#d8d050'),15));
  const objs=[shipGDraw(t)];for(const bt of boatsG)objs.push(boatGObj(bt,t));for(const b of blobs){const o=blobObj(b,t);if(o)objs.push(o)}
  for(let i=0;i<160;i++){const t0=13.2+hash(i,1)*5.5;const k=t-t0;if(k<0)continue;const x=(hash(i,2)-0.5)*300,z=-20-hash(i,3)*300;const y=1+(2+hash(i,4)*6)*k;objs.push({d:dist([x,y,z]),draw:()=>{const c=toCam([x,y,z]);if(c[2]<1)return;const s=scr(c);const r=Math.max(1.5,0.5*F/c[2]);ctx.fillStyle='rgba(220,240,255,0.85)';ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill()}})}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- SKY FADES ----------------
const cloudsG=[];{const r=rng(44);for(let i=0;i<70;i++)cloudsG.push({x:(r()-0.5)*1400,y:-80-r()*70,z:200-r()*2200,s:25+r()*30,seed:i,vy:6+r()*10});for(let i=0;i<16;i++)cloudsG.push({x:(r()-0.5)*700,y:-20+r()*50,z:100-r()*1800,s:14+r()*16,seed:100+i,vy:8+r()*8})}
const CLOUDW=hex('#ffffff');const starsG=[];{const r=rng(5);for(let i=0;i<400;i++)starsG.push([r()*W,r()*H*0.7,r()*1.8+0.4,r()])}
function drawSkyG(t){const dk=ease((t-21.8)/3.2);F=900;FOG=mix(hex('#cfe0f2'),hex('#2a3550'),dk);FOGD=1800;FOGMAX=0.85;setLight([0.4,0.85,0.35]);AMB=0.6;
  const u=(t-19)/8;cam.x=0;cam.y=30*u;cam.z=-60*u;cam.yaw=0.15*Math.sin(u*1.5);cam.pitch=0.04+0.12*u;cam.roll=0.03*Math.sin(t*0.5);setCam();
  const top=mix(hex('#0c3486'),hex('#000005'),dk),mid=mix(hex('#5c95da'),hex('#0a1030'),dk),hor=mix(hex('#cfe0f2'),hex('#3b5a8a'),dk*0.85);
  const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,css(top));g.addColorStop(0.7,css(mid));g.addColorStop(1,css(hor));ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  if(dk>0){for(const s of starsG){ctx.fillStyle=`rgba(255,255,255,${dk*(0.3+0.6*Math.abs(Math.sin(s[3]*40+t)))})`;ctx.fillRect(s[0],s[1],s[2],s[2])}}
  const sn=toCam([cam.x-600,500,cam.z-1800]);if(sn[2]>0){const s=scr(sn);glow(s[0],s[1],260-120*dk,[255,250,230],0.9)}
  poly([[cam.x-6000,-140,cam.z+500],[cam.x+6000,-140,cam.z+500],[cam.x+6000,-140,cam.z-6000],[cam.x-6000,-140,cam.z-6000]],fogC(mix(hex('#e9eef6'),hex('#8a96aa'),dk),1200));
  const objs=[];const k=Math.max(0,t-19.4);
  for(const c of cloudsG){let z=c.z;for(let i=0;i<5;i++){const x=c.x+(hash(c.seed,i)-0.5)*c.s*2.4,y=c.y+(hash(c.seed,i+7)-0.5)*c.s*0.5+c.vy*k*(1+0.3*hash(c.seed,i)),zz=z+(hash(c.seed,i+3)-0.5)*c.s*1.6;objs.push(puffObj(x,y,zz,c.s*(0.6+0.5*hash(c.seed,i+5))*(1+0.05*k),CLOUDW,0.9*(1-0.5*dk)))}}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();
  ctx.save();ctx.strokeStyle=`rgba(255,255,255,${0.18+0.1*Math.min(1,k)})`;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<60;i++){const sp=900+hash(i,1)*900;const y=H-((hash(i,2)*H*1.4+t*sp)%(H*1.4));const x=hash(i,3)*W;ctx.moveTo(x,y);ctx.lineTo(x+4,y-120-hash(i,4)*160)}ctx.stroke();ctx.restore()}
// ---------------- SPACE / ORBIT ----------------
const SUN=[-250,760],RO=1050,TH0=0.39,OMG=0.06;const contG=[];{const r=rng(77);for(let i=0;i<9;i++){const n=12;const lat=(r()-0.5)*2.2,lon=r()*6.283;const pts=[];for(let k=0;k<n;k++){const a=k/n*6.283;const rad=0.25+r()*0.25;pts.push([lon+Math.cos(a)*rad*(1+r()*0.3),lat+Math.sin(a)*rad*0.8])}contG.push({pts,col:r()<0.6?'#4f9a4a':'#b59a5a'})}}
const starsS=[];{const r=rng(9);for(let i=0;i<500;i++)starsS.push([r()*W*1.6-W*0.3,r()*H*1.4-H*0.2,r()*1.8+0.4,r()])}
function earthPos(t){const k=t-T_SPACE;const th=TH0-OMG*Math.min(t,T_ORB)+OMG*T_SPACE;const kk=Math.max(0,t-T_ORB);const E0=[SUN[0]+RO*Math.cos(th),SUN[1]+RO*Math.sin(th)];const tan=[Math.sin(th),-Math.cos(th)];const v=RO*OMG;return[E0[0]+tan[0]*v*kk,E0[1]+tan[1]*v*kk,th]}
function drawEarth2D(x,y,r,rot){ctx.save();const ag=ctx.createRadialGradient(x,y,r*0.9,x,y,r*1.25);ag.addColorStop(0,'rgba(120,180,255,0.5)');ag.addColorStop(1,'rgba(120,180,255,0)');ctx.fillStyle=ag;ctx.beginPath();ctx.arc(x,y,r*1.25,0,7);ctx.fill();
  ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.clip();ctx.fillStyle='#1f5fb0';ctx.fillRect(x-r,y-r,2*r,2*r);
  for(const c of contG){ctx.fillStyle=c.col;ctx.beginPath();let first=true;for(const p of c.pts){const lo=p[0]+rot;const cx=Math.sin(lo)*Math.cos(p[1]),cz=Math.cos(lo)*Math.cos(p[1]),cy=Math.sin(p[1]);if(cz<-0.05){continue}const px=x+cx*r,py=y-cy*r;if(first){ctx.moveTo(px,py);first=false}else ctx.lineTo(px,py)}ctx.closePath();ctx.fill()}
  for(let i=0;i<14;i++){const lo=hash(i,1)*6.283+rot*1.2,la=(hash(i,2)-0.5)*2.4;const cx=Math.sin(lo)*Math.cos(la),cz=Math.cos(lo)*Math.cos(la),cy=Math.sin(la);if(cz<0)continue;ctx.fillStyle='rgba(255,255,255,0.75)';ctx.beginPath();ctx.ellipse(x+cx*r,y-cy*r,r*0.18*cz,r*0.06,0.3,0,7);ctx.fill()}
  const dx=SUN[0]-x,dy=SUN[1]-y,dl=Math.hypot(dx,dy);const sg=ctx.createLinearGradient(x+dx/dl*r,y+dy/dl*r,x-dx/dl*r,y-dy/dl*r);sg.addColorStop(0,'rgba(0,0,10,0)');sg.addColorStop(0.55,'rgba(0,0,10,0.15)');sg.addColorStop(1,'rgba(0,0,10,0.85)');ctx.fillStyle=sg;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore()}
function drawSpace(t){ctx.fillStyle='#02030a';ctx.fillRect(0,0,W,H);const E=earthPos(t);const z=1+0.25*ease((t-T_SPACE)/7);const ox=W*0.55-E[0],oy=H*0.55-E[1];const camX=(1-0.6)*ox,camY=(1-0.6)*oy;
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2+camX*0.6,-H/2+camY*0.6);
  for(const s of starsS){ctx.fillStyle=`rgba(255,255,255,${0.3+0.6*Math.abs(Math.sin(s[3]*40+t*0.5))})`;ctx.fillRect(s[0],s[1],s[2],s[2])}
  ctx.save();ctx.globalCompositeOperation='lighter';glow(SUN[0],SUN[1],900,[255,170,60],0.55);glow(SUN[0],SUN[1],420,[255,220,140],0.9);ctx.restore();ctx.fillStyle='#fff6d8';ctx.beginPath();ctx.arc(SUN[0],SUN[1],230,0,7);ctx.fill();
  ctx.setLineDash([18,16]);ctx.lineWidth=5;ctx.strokeStyle='rgba(255,255,255,0.45)';ctx.beginPath();ctx.arc(SUN[0],SUN[1],RO,-0.9,1.3);ctx.stroke();ctx.setLineDash([]);
  if(t>T_ORB){const E0=earthPos(T_ORB);ctx.strokeStyle='rgba(255,93,93,0.85)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(E0[0],E0[1]);ctx.lineTo(E[0],E[1]);ctx.stroke()}
  const mA=t*0.7;const mx=E[0]+Math.cos(mA)*260+(t>T_ORB?(t-T_ORB)*12:0),my=E[1]+Math.sin(mA)*130;
  const behind=Math.sin(mA)<0;if(behind){ctx.fillStyle='#9a9aa2';ctx.beginPath();ctx.arc(mx,my,34,0,7);ctx.fill()}
  drawEarth2D(E[0],E[1],150,t*0.35);if(!behind){ctx.fillStyle='#b0b0b8';ctx.beginPath();ctx.arc(mx,my,34,0,7);ctx.fill()}
  ctx.restore()}
// ---------------- VOLCANOES ----------------
R=rng(123);
const vpeaks=[{cx:-170,cz:-820,H:380,r:330},{cx:270,cz:-840,H:360,r:300},{cx:-410,cz:-590,H:280,r:250},{cx:400,cz:-560,H:300,r:240},{cx:20,cz:-440,H:320,r:270}];
vpeaks.forEach((p,pi)=>{const N=8;p.ap=[p.cx,p.H,p.cz];p.base=[];p.rim=[];const cr=0.13;for(let i=0;i<N;i++){const a=i/N*Math.PI*2+rr(-0.12,0.12);const rad=p.r*rr(0.85,1.1);p.base.push([p.cx+Math.cos(a)*rad,-4,p.cz+Math.sin(a)*rad]);p.rim.push([p.cx+Math.cos(a)*rad*cr,p.H*(1-0.03),p.cz+Math.sin(a)*rad*cr])}
  p.te=T_ERUPT+rr(-0.2,0.25)+pi*0.03;p.lava=[];for(let q=0;q<120;q++)p.lava.push({t0:p.te+R()*3.5,ang:R()*6.283,sp:rr(0,18),vy:rr(35,90),s:rr(6,14)});p.ash=[];for(let q=0;q<26;q++)p.ash.push({t0:34+R()*8,ang:R()*6.283,sp:rr(1,6),vy:rr(8,20),r0:rr(15,30)})});
const VROCK=hex('#4f433f'),VROCK2=hex('#3e3431'),LAVA=hex('#ff6a1a');
function drawVolcano(t){F=880;const er=clamp((t-T_ERUPT)/1.5,0,1);FOG=mix(hex('#8a7a78'),hex('#5a3a34'),er);FOGD=1300;FOGMAX=0.85;setLight([0.35,0.7,0.65]);AMB=0.55;
  const u=(t-T_VOLC)/8;cam.x=-12+18*u;cam.y=36+10*u;cam.z=60-55*u;lookAt(0,160,-450);cam.roll=Math.sin(t*0.5)*0.02;
  {const k=t-34;const a=(t<T_ERUPT?0.002+0.002*k/4:0.012);cam.pitch+=Math.sin(t*37)*a;cam.roll+=Math.cos(t*29)*a}setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,css(mix(hex('#3a4660'),hex('#2a1210'),er)));g.addColorStop(1,css(mix(hex('#b8a8a0'),hex('#c2603a'),er)));ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  poly([[-4000,0,300],[4000,0,300],[4000,0,-3000],[-4000,0,-3000]],fogC(hex('#2f2a28'),600));
  for(let i=0;i<40;i++){const x=(hash(i,1)-0.5)*600,z=-30-hash(i,2)*300;const len=10+hash(i,3)*30;const a=hash(i,4)*3;const p1=[x,0.05,z],p2=[x+Math.cos(a)*len,0.05,z+Math.sin(a)*len];const c1=toCam(p1),c2=toCam(p2);if(c1[2]<1||c2[2]<1)continue;const s1=scr(c1),s2=scr(c2);
    ctx.strokeStyle=`rgba(255,${120+Math.round(60*Math.sin(t*3+i))},40,${0.4+0.5*er})`;ctx.lineWidth=Math.max(1.5,30/c1[2]*(1+er));ctx.beginPath();ctx.moveTo(s1[0],s1[1]);ctx.lineTo(s2[0],s2[1]);ctx.stroke()}
  const ps=vpeaks.slice().sort((a,b)=>dist([b.cx,0,b.cz])-dist([a.cx,0,a.cz]));
  for(const p of ps){const N=p.base.length;const fs=[];for(let i=0;i<N;i++)fs.push(i);fs.sort((a,b)=>dist(p.rim[b])-dist(p.rim[a]));
    for(const i of fs){const j=(i+1)%N;facePoly([p.rim[i],p.base[i],p.base[j],p.rim[j]],i%2?VROCK:VROCK2)}
    const ce=t-p.te;const glowA=ce>0?1:0.35;const top=p.rim.map(q=>q);const cp=clipNear(top.map(toCam));if(cp.length>=3){polyPath(cp);ctx.fillStyle=css(mix(hex('#5a1a10'),LAVA,glowA));ctx.fill()}
    const tc=toCam([p.cx,p.H,p.cz]);if(tc[2]>0){const s=scr(tc);ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1],(ce>0?320:90)*600/tc[2]*(ce>0&&ce<0.4?1.8:1),[255,110,30],ce>0?0.8:0.4);ctx.restore()}
    const cl=[];for(const q of p.ash){const k=t-q.t0;if(k<0||k>8)continue;const x=p.cx+Math.cos(q.ang)*q.sp*k,z=p.cz+Math.sin(q.ang)*q.sp*k,y=p.H+q.vy*k*(ce>0&&q.t0>p.te?2.5:1);cl.push(puffObj(x,y,z,q.r0+k*12,hex('#3a3330'),0.75*(1-k/8)))}
    cl.sort((a,b)=>b.d-a.d);for(const o of cl)o.draw();
    if(ce>0){ctx.save();ctx.globalCompositeOperation='lighter';for(const q of p.lava){const k=t-q.t0;if(k<0||k>5)continue;const x=p.cx+Math.cos(q.ang)*q.sp*k,z=p.cz+Math.sin(q.ang)*q.sp*k,y=p.H+q.vy*k;
        const c1=toCam([x,y,z]),c2=toCam([x-Math.cos(q.ang)*q.sp*0.08,y-q.vy*0.08,z-Math.sin(q.ang)*q.sp*0.08]);if(c1[2]<1||c2[2]<1)continue;const s1=scr(c1),s2=scr(c2);const fd=1-k/5;
        ctx.strokeStyle=`rgba(255,${Math.round(140+100*fd)},${Math.round(40*fd)},${fd})`;ctx.lineWidth=Math.max(2,q.s*F/c1[2]);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(s1[0],s1[1]);ctx.lineTo(s2[0],s2[1]);ctx.stroke()}ctx.restore()}}
  if(er>0){ctx.fillStyle=`rgba(255,90,30,${0.12*er})`;ctx.fillRect(0,0,W,H)}}
// ---------------- EVERYTHING COMES DOWN ----------------
function fallTau(t){if(t<T_GB)return 0;if(t<T_FALLN)return(t-T_GB)*0.15;return(T_FALLN-T_GB)*0.15+(t-T_FALLN)}
const fcars=[];{const r=rng(3);for(let i=0;i<16;i++)fcars.push({x:-11+r()*12,z:-14-r()*60,y0:9+r()*26,yaw:r()*6.28,wp:r()-0.5,wr:r()-0.5,col:hex(carCols[i%carCols.length])})}
function fcarState(c,t){const tau=fallTau(t);const yl=c.y0-4.9*tau*tau;const landed=yl<=0;const tl=landed?Math.sqrt(c.y0/4.9):tau;const sp=0.6*(1-Math.min(1,tl/3));
  let y=Math.max(0,yl),pit=c.wp*(0.3+sp*tl),rol=c.wr*(0.3+sp*tl);if(landed){const after=tau-tl;y=Math.abs(Math.sin(Math.min(after,0.5)/0.5*Math.PI))*0.8*Math.exp(-after*3);pit=0;rol=(c.wr>0.3?Math.PI:0)}
  return{pos:[c.x,y,c.z],M:rotM(c.yaw,pit,rol),landed,tl}}
function drawFall(t){F=930;FOG=hex('#e9a991');FOGD=150;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;
  const pu=1-ease((t-T_FALLN+0.2)/1.6);cam.x=0.4;cam.y=1.8;cam.z=-2;cam.yaw=0.17;cam.pitch=-0.02+0.55*pu;cam.roll=0.02*Math.sin(t*0.6);setCam();
  drawCitySky(t);cityGround();drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];for(const c of fcars){const s=fcarState(c,t);objs.push(carOObj(s.pos,s.M,c.col));if(s.landed){const k=fallTau(t)-s.tl;if(k<2.5)objs.push(puffObj(c.x,1+k,c.z,1.5+k*2.5,hex('#b8a888'),0.6*(1-k/2.5)))}}
  for(const c of gpark)objs.push(carOObj([c.x,0,c.z],rotM(0,0,0),c.col));
  for(let i=0;i<gpeople.length;i+=2){const o=personG(gpeople[i],t,'fall');if(o&&o.d>0)objs.push(o)}
  for(const q of gdebris){const o=debrisObj(q,t,'fall');if(o&&o.d>0)objs.push(o)}
  for(const l of lamps){const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- TWIST ----------------
function drawTwist(t){F=930;FOG=hex('#e9a991');FOGD=150;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;
  if(t<T_IMP){const k=t-T_RAIN;const y0=0.5*9.8*(T_IMP-T_RAIN)*(T_IMP-T_RAIN)+0.4;cam.x=1.5;cam.z=-12;cam.y=Math.max(0.4,y0-4.9*k*k);cam.yaw=0.3+0.3*k;cam.pitch=-1.2+0.25*k;cam.roll=0.4*Math.sin(k*2)}
  else{cam.x=1.5;cam.y=0.35;cam.z=-12;cam.yaw=0.2;cam.pitch=1.05;cam.roll=0.3}
  setCam();drawCitySky(t);cityGround();drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];for(const c of fcars){const s=fcarState(c,60);objs.push(carOObj(s.pos,s.M,c.col))}for(const c of gpark)objs.push(carOObj([c.x,0,c.z],rotM(0,0,0),c.col));
  for(let i=0;i<gpeople.length;i+=2){const o=personG(gpeople[i],60,'fall');if(o&&o.d>0)objs.push(o)}for(const l of lamps){const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();
  if(t>=T_IMP&&t<T_PHONE){// phone falling from sky toward camera
    const k=(t-T_IMP)/(T_PHONE-T_IMP);const sx=W*0.52+Math.sin(k*3)*40,sy=H*0.15+k*k*H*0.55;const sc=0.15+k*k*1.1;ctx.save();ctx.translate(sx,sy);ctx.rotate(k*9);ctx.scale(sc,sc);ctx.fillStyle='#2b2f3a';rrect(-110,-220,220,440,34);ctx.fill();ctx.fillStyle='#16324a';rrect(-98,-206,196,412,26);ctx.fill();ctx.restore();
    const bl=0.35*(1-k);ctx.fillStyle=`rgba(0,0,0,${bl})`;ctx.fillRect(0,0,W,H)}}
function drawCrackedPhone(t){const k=t-T_PHONE;ctx.fillStyle='#3d3f46';ctx.fillRect(0,0,W,H);
  for(let i=0;i<500;i++){ctx.fillStyle=`rgba(${hash(i,1)<0.5?255:0},${hash(i,1)<0.5?255:0},${hash(i,1)<0.5?255:0},0.06)`;const s=2+hash(i,2)*5;ctx.fillRect(hash(i,3)*W,hash(i,4)*H,s,s)}
  ctx.fillStyle='rgba(242,207,46,0.9)';ctx.fillRect(0,H*0.82,W,26);
  const z=0.82+0.03*Math.min(1,k/3);ctx.save();ctx.translate(W/2,H*0.6);ctx.scale(z,z);ctx.rotate(-0.12);
  ctx.fillStyle='rgba(0,0,0,0.35)';rrect(-250+20,-480+30,500,960,64);ctx.fill();
  ctx.fillStyle='#2b2f3a';rrect(-250,-480,500,960,64);ctx.fill();ctx.fillStyle='#0b0b12';rrect(-232,-462,464,924,52);ctx.fill();
  ctx.save();rrect(-226,-456,452,912,48);ctx.clip();const sg=ctx.createLinearGradient(-226,-456,226,456);sg.addColorStop(0,'#3a2a7a');sg.addColorStop(0.5,'#7a3a8a');sg.addColorStop(1,'#e07a5a');ctx.fillStyle=sg;ctx.fillRect(-226,-456,452,912);
  txt('Saturday, October 31',0,-330,30,'rgba(255,255,255,0.85)','center',600,false);txt('9:41',0,-230,140,'#ffffff','center',300,false);
  ctx.fillStyle='rgba(250,250,252,0.95)';rrect(-200,-90,400,160,28);ctx.fill();txt('✅ Gravity restored',-176,-48,26,'#1a7a3a','left',900,false);txt('Have a nice day :)',-176,4,26,'#111','left',700,false);
  // cracks
  const cx=60,cy=140;ctx.strokeStyle='rgba(255,255,255,0.9)';ctx.lineWidth=3;
  for(let i=0;i<16;i++){let a=hash(i,7)*6.283,x=cx,y=cy;ctx.beginPath();ctx.moveTo(x,y);for(let s=0;s<7;s++){a+=(hash(i,s+20)-0.5)*0.8;const l=40+hash(i,s+40)*90;x+=Math.cos(a)*l;y+=Math.sin(a)*l;ctx.lineTo(x,y)}ctx.stroke()}
  for(let r=40;r<260;r+=55){ctx.beginPath();for(let i=0;i<=16;i++){const a=i/16*6.283;const rr_=r*(0.8+0.4*hash(i,r));ctx.lineTo(cx+Math.cos(a)*rr_,cy+Math.sin(a)*rr_)}ctx.strokeStyle='rgba(255,255,255,0.45)';ctx.lineWidth=2;ctx.stroke()}
  ctx.fillStyle='rgba(255,255,255,0.18)';ctx.beginPath();ctx.arc(cx,cy,28,0,7);ctx.fill();ctx.restore();ctx.restore()}
// ---------------- HAND / PHONE ----------------
function drawHandG(t,dropY){const walk=t<T_GONE;const bx=Math.sin(t*3.2)*5*(walk?1:0.3),by=Math.abs(Math.sin(t*3.2))*9*(walk?1:0.3);
  ctx.save();ctx.translate(735+bx+shakeX*0.5,1610+by+dropY);ctx.rotate(-0.13+dropY/2500);
  const skin='#d8a58d',skinD='#b98670',skinL='#e8bba3';const pw=410,ph=800,px=-pw/2,py=-ph/2;const kf=t-T_STEP-0.2;const fl=kf>0?kf:0;
  [[-150,175],[-60,215],[35,200],[125,160]].forEach(([fx,fh])=>{const curl=Math.min(1,fl*2)*50;ctx.fillStyle=skinD;capsule(fx-36,py-fh+40+curl,74,fh+80-curl);ctx.fill();ctx.fillStyle=skin;capsule(fx-32,py-fh+40+curl,64,fh+76-curl);ctx.fill()});
  ctx.fillStyle=skin;rrect(px+pw-70,py+80,170,560,80);ctx.fill();ctx.fillStyle='#232a3f';ctx.beginPath();ctx.moveTo(px+40,py+ph-40);ctx.lineTo(px+pw+190,py+ph-140);ctx.lineTo(px+pw+260,py+ph+260);ctx.lineTo(px-20,py+ph+260);ctx.closePath();ctx.fill();
  ctx.save();ctx.translate(-fl*120,-fl*fl*260-fl*140);ctx.rotate(-fl*0.6);ctx.scale(1-Math.min(0.5,fl*0.12),1-Math.min(0.5,fl*0.12));
  ctx.fillStyle='#2b2f3a';rrect(px-10,py-10,pw+20,ph+20,58);ctx.fill();ctx.fillStyle='#3a3f4c';rrect(px,py,pw,ph,50);ctx.fill();ctx.fillStyle='#0b0b12';rrect(px+16,py+16,pw-32,ph-32,40);ctx.fill();
  ctx.save();rrect(px+22,py+22,pw-44,ph-44,36);ctx.clip();const sg=ctx.createLinearGradient(px,py,px+pw,py+ph);sg.addColorStop(0,'#3a2a7a');sg.addColorStop(0.5,'#7a3a8a');sg.addColorStop(1,'#e07a5a');ctx.fillStyle=sg;ctx.fillRect(px,py,pw,ph);
  txt('Saturday, October 31',0,py+120,24,'rgba(255,255,255,0.85)','center',600,false);txt('9:41',0,py+200,110,'#ffffff','center',300,false);
  const na=clamp((t-1.9)/0.3,0,1);if(na>0){const ny=py+300+(1-easeOut(na))*-60;ctx.globalAlpha=na;ctx.fillStyle='rgba(250,250,252,0.95)';rrect(px+36,ny,pw-72,190,28);ctx.fill();
    txt('⚠️ EMERGENCY ALERT',px+62,ny+42,22,'#d42a2a','left',900,false);txt('Gravity failing worldwide.',px+62,ny+88,22,'#111','left',700,false);txt('Hold on to something',px+62,ny+120,22,'#111','left',700,false);txt('heavy.',px+62,ny+152,22,'#111','left',700,false);ctx.globalAlpha=1}
  ctx.restore();ctx.restore();
  ctx.fillStyle=skinD;ctx.save();ctx.translate(px-30,py+560);ctx.rotate(-0.55+Math.min(1,fl*2)*0.5);capsule(-40,-30,84,250);ctx.fill();ctx.fillStyle=skin;capsule(-36,-30,76,244);ctx.fill();ctx.fillStyle=skinL;rrect(-22,-16,46,60,22);ctx.fill();ctx.restore();ctx.restore()}
// ---------------- OVERLAYS ----------------
const capsG=[[3.7,7.2,'🦶 Every step launches you into the air'],[7.2,11.5,'Everything not tied down… floats away'],
 [11.6,14.1,'🌊 The oceans aren\'t held down anymore'],[14.1,19.0,'Every wave just… keeps rising'],
 [19.1,22.1,'💨 Even the air drifts into space'],[22.1,27.0,'The sky… fades to black'],
 [27.1,29.1,'☀️ Without the Sun\'s pull…'],[29.1,34.0,'🌍 Earth flies out of its orbit at 30 km/s'],
 [34.1,38.2,'🌋 Deep inside Earth, pressure is released'],[38.2,42.0,'Every volcano erupts… at once'],
 [42.1,45.7,'⚡ 5 seconds later… gravity is back'],[45.7,48.75,'Everything that went up… comes down'],
 [49.2,50.5,'Including you 😳'],[50.5,56.0,'And yes… your phone too 📱💀']];
function drawCaptionG(t){for(const[a,b,s]of capsG){if(t<a||t>=b)continue;const k=t-a;const sc=k<0.18?0.6+0.4*ease(k/0.18)+Math.sin(k/0.18*Math.PI)*0.12:1;const al=Math.min(1,k/0.1,(b-t)/0.12);const size=fitSize(s,920,58);
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,640);ctx.scale(sc,sc);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function drawTitleG(t){const a=t<2.75?1:clamp((3.0-t)/0.25,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,400);ctx.scale(pop,pop);
  const l1='What if gravity disappeared',l2='for 5 seconds?';const s=Math.min(fitSize(l1,980,88),fitSize(l2,980,88));ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffd84a');txt(l2,0,s*0.56,s,'#ffd84a');ctx.restore()}
function drawTimerG(t){if(t<COLD||t>=T_BACK)return;
  if(t<T_GONE){const v=T_GONE-t;ctx.save();ctx.font='800 30px Inter';let x=56;const lab='GRAVITY DISAPPEARS IN';ctx.textBaseline='middle';ctx.lineWidth=6;ctx.strokeStyle='rgba(20,15,30,0.85)';ctx.lineJoin='round';
    for(const ch of lab){ctx.strokeText(ch,x,850);ctx.fillStyle='rgba(255,255,255,0.92)';ctx.fillText(ch,x,850);x+=ctx.measureText(ch).width+4}ctx.restore();txt(v.toFixed(1)+' S',56,920,96,'#ffd84a','left',900);return}
  const v=(t-T_GONE)/(T_BACK-T_GONE)*5;ctx.save();ctx.fillStyle='rgba(15,10,30,0.66)';rrect(40,190,380,150,28);ctx.fill();ctx.font='800 24px Inter';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText('TIME WITHOUT GRAVITY',66,228);
  txt(v.toFixed(2)+' s',66,282,58,'#ff5d5d','left',900,false);ctx.fillStyle='rgba(255,255,255,0.2)';rrect(262,268,132,14,7);ctx.fill();ctx.fillStyle='#ff5d5d';rrect(262,268,132*v/5,14,7);ctx.fill();ctx.restore()}
function fitW(s,size){ctx.font=`900 ${size}px Inter`;return ctx.measureText(s).width}
function statBox(label,val,col,a){ctx.save();ctx.globalAlpha=a;ctx.font='800 26px Inter';const w=Math.max(ctx.measureText(label).width,fitW(val,64))+60;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(56,1360,w,170,30);ctx.fill();ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText(label,86,1402);txt(val,86,1468,64,col,'left',900,false);ctx.restore()}
function drawStatsG(t){
  if(t>=T_GONE+0.2&&t<T_STEP+0.1){const a=Math.min(1,(t-T_GONE-0.2)/0.25,(T_STEP+0.1-t)/0.2);const f=clamp((t-3.3)/0.8,0,1);statBox('GRAVITY',(9.81*(1-f)).toFixed(2)+' m/s²',f<1?'#ffffff':'#ff6b6b',a)}
  if(t>=T_STEP+0.3&&t<11.5){const a=Math.min(1,(t-T_STEP-0.3)/0.25,(11.5-t)/0.2);statBox('YOUR HEIGHT',(cam.y>0?Math.max(0,1.1*(t-T_STEP)):0).toFixed(1)+' m','#ffffff',a)}
  if(t>=T_ORB+0.2&&t<T_VOLC){const a=Math.min(1,(t-T_ORB-0.2)/0.25,(T_VOLC-t)/0.2);statBox('DISTANCE OFF ORBIT',Math.round((t-T_ORB)/(T_BACK-T_GONE)*5*30)+' km','#ff6b6b',a)}}
function drawEndG(t){const k=ease((t-T_END)/0.5)*clamp((LOOP-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.74*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-T_END<0.5?0.7+0.3*ease((t-T_END-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);txt('Would you survive',0,-100,92,'#ffd84a');txt('these 5 seconds?',0,10,92,'#ffd84a');const bounce=Math.abs(Math.sin((t-T_END)*5))*26;txt('👇',0,190+bounce,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-T_END-0.6)/0.4);txt('What should disappear next?',W/2,1150,50,'#ffffff','center',800);txt('Follow for Part 5',W/2,1230,40,'rgba(255,255,255,0.8)','center',800);ctx.restore()}
// ---------------- FRAME ----------------
const COLD=1.6,LOOP=59.45;
function sceneAtG(t){if(t<11.5)return'city';if(t<T_SKY)return'ocean';if(t<T_SPACE)return'sky';if(t<T_VOLC)return'space';if(t<T_BACK)return'volc';if(t<T_RAIN)return'fall';return'twist'}
function shakesG(t){shakeX=0;shakeY=0;const s=(t0,amp,dur)=>{const k=t-t0;if(k>0&&k<dur){const a=amp*(1-k/dur);shakeX+=Math.sin(k*61)*a;shakeY+=Math.cos(k*47)*a}};
  s(T_GONE,12,0.4);s(T_BACK,14,0.5);s(T_ERUPT,26,1.5);s(T_IMP,40,0.6);s(T_PHONE,25,0.4);for(const c of fcars){s(T_FALLN+Math.sqrt(c.y0/4.9)-(T_FALLN-T_GB)*0.15,8,0.4)}}
function renderSceneG(t){ctx.save();shakesG(t);
  if(t<COLD||t>=LOOP){const tt=t>=LOOP?t-60:t;if(tt<0.85)drawFall(46.35+tt*0.9);else drawVolcano(T_ERUPT+0.3+(tt-0.85)*1.2);ctx.restore();return}
  const sc=sceneAtG(t);if(sc==='city')drawCityG(t);else if(sc==='ocean')drawOceanG(t);else if(sc==='sky')drawSkyG(t);else if(sc==='space')drawSpace(t);else if(sc==='volc')drawVolcano(t);else if(sc==='fall')drawFall(t);else drawTwist(t);
  ctx.restore()}
function overlaysG(t){ctx=ctx0;shakeX=0;shakeY=0;
  if(t>=T_PHONE&&t<T_END+0.6){drawCrackedPhone(t)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(t>=COLD&&t<T_STEP+2.2){const drop=t<T_STEP+1.2?0:Math.pow(clamp((t-T_STEP-1.2)/0.8,0,1),2)*1300;shakesG(t);drawHandG(t,drop);shakeX=0;shakeY=0}
  if(t>=T_IMP&&t<T_IMP+0.3){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H)}else if(t>=T_IMP+0.3&&t<T_IMP+0.8){ctx.fillStyle=`rgba(0,0,0,${1-(t-T_IMP-0.3)/0.5})`;ctx.fillRect(0,0,W,H)}
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(T_GONE,0.8,0.35);flash(T_BACK,0.85,0.45);flash(T_PHONE,0.9,0.3);flash(T_ERUPT,0.5,0.4,'255,160,80');flash(0.85,0.6,0.25,'255,160,80');flash(COLD,0.7,0.25);flash(0,0.5,0.15);
  [11.5,T_SKY,T_SPACE,T_VOLC,T_RAIN].forEach(tt=>flash(tt,0.55,0.22));[11.5,T_SKY,T_SPACE,T_VOLC,T_RAIN].forEach(tt=>{const k=tt-t;if(k>0&&k<0.18){ctx.fillStyle=`rgba(255,255,255,${0.5*(1-k/0.18)})`;ctx.fillRect(0,0,W,H)}});
  if(t<3)drawTitleG(t);drawTimerG(t);drawStatsG(t);drawCaptionG(t);
  if(t>=T_GONE&&t<T_GONE+1.1){const k=t-T_GONE;const s=k<0.2?1.6-0.6*easeOut(k/0.2):1;const a=Math.min(1,(1.1-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('GRAVITY: OFF',0,0,100,'#ff5d5d');ctx.restore()}
  if(t>=T_BACK&&t<T_BACK+1.6){const k=t-T_BACK;const s=k<0.25?0.5+0.5*easeOut(k/0.25):1;const a=Math.min(1,(1.6-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('GRAVITY IS BACK',0,0,96,'#7dff9a');ctx.restore()}
  drawEndG(t);{const k=LOOP-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const t0=fi/FPS;
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderSceneG(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;ctx0.drawImage(acc,0,0);overlaysG(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;window.crashes=[];
</script></body></html>
