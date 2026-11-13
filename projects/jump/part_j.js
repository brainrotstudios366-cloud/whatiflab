
// ======================================================================
// ========================= JUMP DOUBLES VIDEO =========================
// ======================================================================
const JX=4,JZ=-16;const COLD=1.2,LOOP=59.45,T_ENDJ=56;
const JUMPS=[[1.2,1.1],[2.3,1.1],[3.4,1.2],[4.6,1.3],[5.9,1.5],[7.4,1.6],[9.0,2.0],[11.0,2.0],[13.0,2.2],[15.2,2.4],[17.6,2.4],[20.0,2.4],[22.4,2.4],[24.8,2.4],[27.2,2.4],[29.6,2.6],[32.2,2.4],[34.6,2.4],[37.0,3.0],[40.0,2.6],[42.6,2.8],[45.4,1.2],[46.6,1.2],[47.8,1.2],[49.0,7.0]];
const CMP=['Normal jump 🧍','Over a fence','Over a car 🚗','Over a bus 🚌','Onto a house roof 🏠','Higher than a tree 🌳','A 10-story building 🏢','A 20-story building 🏙️','Higher than the Statue of Liberty 🗽','Almost the Eiffel Tower 🗼','Higher than the Empire State Building','Higher than the Burj Khalifa','Inside the clouds ☁️','Above the clouds','Almost Mount Everest 🏔️','Higher than airplanes ✈️','The sky turns dark…','Higher than any balloon ever 🎈','You just reached SPACE 🚀','Low Earth orbit','Higher than the ISS 🛰️','Earth is getting smaller…','','','Faster than escape velocity…'];
function jh(n){return 0.5*Math.pow(2,n-1)}
function jumpAt(t){for(let i=JUMPS.length-1;i>=0;i--)if(t>=JUMPS[i][0])return i+1;return 0}
function fmtH(h){if(h<10)return h.toFixed(1).replace('.0','')+' m';if(h<100000)return Math.round(h).toLocaleString('en-US')+' m';return Math.round(h/1000).toLocaleString('en-US')+' km'}
// ---------------- jumper model ----------------
const HOOD=hex('#d9443a'),PANT=hex('#2c3245'),SHOE=hex('#f2f2f2'),SKN=hex('#d9a68a'),HR=hex('#3a2a22');
function jumperDraw(base,yaw,crouch,armsUp,tilt){const M=rotM(yaw,tilt||0,0);const lh=0.84*(1-crouch*0.35);const parts=[];
  for(const sx of[-1,1]){parts.push([mapL(base,M,sx*0.12,lh/2,0),M,0.1,lh/2,0.12,{top:PANT,side:PANT,front:PANT,back:PANT,bottom:SHOE}]);parts.push([mapL(base,M,sx*0.12,0.05,0.04),M,0.11,0.05,0.16,{top:SHOE,side:SHOE,front:SHOE,back:SHOE}])}
  const tc=mapL(base,M,0,lh+0.32,0);parts.push([tc,M,0.27,0.32,0.16,{top:HOOD,side:HOOD,front:HOOD,back:HOOD,bottom:HOOD}]);
  parts.push([mapL(base,M,0,lh+0.81,0),M,0.14,0.15,0.14,{top:HR,side:SKN,front:SKN,back:HR,bottom:SKN}]);
  for(const sx of[-1,1]){const ang=sx*(0.15+armsUp*2.75);const AM=rotM(yaw,tilt||0,ang);const sh=mapL(base,M,sx*0.36,lh+0.58,0);const c=mapL(sh,AM,0,-0.33,0);parts.push([c,AM,0.08,0.33,0.08,{top:HOOD,side:HOOD,front:HOOD,back:HOOD,bottom:SKN}])}
  parts.forEach(p=>p.d=dist(p[0]));parts.sort((a,b)=>b.d-a.d);for(const p of parts)oboxDraw(p[0],p[1],p[2],p[3],p[4],p[5])}
// ---------------- crater ----------------
function craterR(t){let r=0;for(let i=4;i<JUMPS.length&&i<18;i++){const n=i+1;const tl=JUMPS[i][0]+JUMPS[i][1]-0.25;if(t>=tl)r=Math.max(r,0.6*Math.pow(n-4,1.55))}return r}
function drawCrater(t){const r=craterR(t);if(r<0.2)return;const N=28;const P=(rad,a,y)=>[JX+Math.cos(a)*rad,y,JZ+Math.sin(a)*rad];
  const rim=[];const pit=[];for(let i=0;i<N;i++){const a=i/N*6.283;const j=0.85+0.3*hash(i,7);rim.push(P(r*1.25*j,a,0.03));pit.push(P(r*j,a,0.04))}
  poly(rim,fogC(hex('#8f877c'),dist([JX,0,JZ])));poly(pit,fogC(hex('#3a3430'),dist([JX,0,JZ])));
  ctx.strokeStyle=css(fogC(hex('#2a2622'),dist([JX,0,JZ])));ctx.lineWidth=Math.max(1.5,30/Math.max(5,dist([JX,0,JZ])));ctx.beginPath();
  for(let i=0;i<14;i++){let a=hash(i,3)*6.283,rad=r*0.9;let p=P(rad,a,0.05);let c=toCam(p);if(c[2]<0.5)continue;let s=scr(c);ctx.moveTo(s[0],s[1]);for(let k=0;k<5;k++){a+=(hash(i,k+9)-0.5)*0.5;rad+=r*0.35;p=P(rad,a,0.05);c=toCam(p);if(c[2]<0.5)break;s=scr(c);ctx.lineTo(s[0],s[1])}}ctx.stroke()}
// ---------------- ground jump shots (J1-J9) ----------------
function groundJump(t,n){const[ts,D]=JUMPS[n-1];const tau=t-ts;const h=jh(n);let y=0,crouch=0,arms=0;
  if(tau<0.18){crouch=tau/0.18;arms=0}else if(tau<D-0.25){const u=(tau-0.18)/(D-0.43);y=h*4*u*(1-u);crouch=Math.max(0,1-(tau-0.18)/0.12);arms=Math.min(1,(tau-0.18)/0.15)*(1-Math.max(0,(u-0.75)/0.25))}else{const k=(tau-(D-0.25))/0.25;crouch=Math.sin(k*Math.PI)*0.9}
  return{y,crouch,arms,h,landT:ts+D-0.25}}
function drawGround(t){const n=Math.max(1,jumpAt(t));const s=groundJump(t,n);F=930;FOG=hex('#e9a991');FOGD=170;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;
  if(n<=6){cam.x=JX+2.2;cam.z=JZ+4.2;cam.y=1.4+s.y*0.7;lookAt(JX,1.0+s.y*0.85,JZ);}else{cam.x=JX-4;cam.z=JZ+9;cam.y=1.6+s.y*0.9;lookAt(JX,0.9+s.y*0.97,JZ)}cam.roll=0.01*Math.sin(t);setCam();
  drawCitySky(t);cityGround();drawCrater(t);drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];const r=craterR(t);
  for(const c of gpark){objs.push(carOObj([c.x,0,c.z],rotM(0,0,0),c.col))}
  for(let i=0;i<gpeople.length;i++){const p=gpeople[i];if(Math.hypot(p.x-JX,p.z-JZ)<Math.max(3,r*1.4))continue;if(Math.abs(p.x-JX)<4&&p.z>JZ&&p.z<JZ+14)continue;const o=personG(p,1.0);if(o&&o.d>0)objs.push(o)}
  for(const l of lamps){const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  const base=[JX,s.y,JZ];objs.push({d:dist([JX,s.y+0.9,JZ]),draw:()=>jumperDraw(base,0.5,s.crouch,s.arms,0)});
  const k=t-s.landT;if(k>0&&k<1.5){const rr_=(0.6+Math.sqrt(s.h))*(0.4+k);for(let i=0;i<12;i++){const a=i/12*6.283;objs.push(puffObj(JX+Math.cos(a)*rr_,0.4+k*0.6,JZ+Math.sin(a)*rr_,0.4+Math.sqrt(s.h)*0.3*(0.5+k),hex('#c9bba5'),0.6*(1-k/1.5)))}}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- landing impact (J10-J18) ----------------
function drawImpact(t,n,k){F=900;FOG=hex('#e9a991');FOGD=260;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;cam.x=JX-60;cam.y=70;cam.z=JZ+95;lookAt(JX,0,JZ);setCam();
  drawCitySky(t);cityGround();drawCrater(t+1);drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];const R0=12+n*9;const ring=R0*easeOut(k/0.5);
  for(let i=0;i<36;i++){const a=i/36*6.283;objs.push(puffObj(JX+Math.cos(a)*ring,2+k*4,JZ+Math.sin(a)*ring,4+n*0.6,hex('#d8ccb8'),0.75*(1-k/0.6)))}
  for(const c of gpark){const dd=Math.hypot(c.x-JX,c.z-JZ);const hit=dd<ring;const y=hit?Math.max(0,(ring-dd)*0.3*(1-k)):0;objs.push(carOObj([c.x,y,c.z],rotM(0,hit?0.6:0,hit?1.2*(1-dd/ring):0),c.col))}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();
  ctx.save();ctx.globalCompositeOperation='lighter';const c=toCam([JX,0,JZ]);if(c[2]>0){const s=scr(c);glow(s[0],s[1],400*(1-k/0.6)+50,[255,230,190],0.7*(1-k/0.6))}ctx.restore()}
// ---------------- apex views (J10-J18) ----------------
const cloudsJ=[];{const r=rng(61);for(let i=0;i<90;i++)cloudsJ.push({x:(r()-0.5)*16000,z:-r()*16000+3000,s:300+r()*500,seed:i})}
function skyCols(h){const k=clamp(Math.log10(Math.max(1,h)/500)/2.2,0,1);return[mix(hex('#3f7ed4'),hex('#030616'),k),mix(hex('#cfe0f2'),hex('#2a4a8a'),k*0.9)]}
function drawApex(t,n,u){const h=jh(n);const yC=h*(0.94+0.06*Math.sin(u*Math.PI));
  if(h<=600){F=900;FOG=hex('#e9a991');FOGD=260+h;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;cam.x=JX+1.0;cam.y=yC+3.6;cam.z=JZ+3.2;cam.yaw=0.3;cam.pitch=-0.62;cam.roll=0.03*Math.sin(t);setCam();
    drawCitySky(t);poly([[-2000,-0.05,300],[2000,-0.05,300],[2000,-0.05,-2000],[-2000,-0.05,-2000]],fogC(hex('#7f8090'),400));cityGround();drawCrater(t);drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
    const objs=[];for(const c of gpark)objs.push(carOObj([c.x,0,c.z],rotM(0,0,0),c.col));objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
  else{F=900;const sc=skyCols(h);FOG=sc[1];FOGD=h*2.5;FOGMAX=0.92;setLight([0.4,0.85,0.35]);AMB=0.6;cam.x=JX+1.0;cam.y=yC+3.6;cam.z=JZ+3.2;cam.yaw=0.3;cam.pitch=-0.62;cam.roll=0.03*Math.sin(t);setCam();
    const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,css(sc[0]));g.addColorStop(1,css(sc[1]));ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
    poly([[-60000,0,40000],[60000,0,40000],[60000,0,-60000],[-60000,0,-60000]],fogC(hex('#7c9a5c'),h*2));
    const sz=Math.max(40,h/5);for(let zz=-12;zz<=4;zz++)for(let xx=-8;xx<=8;xx++){const hh=hash(zz,xx);const col=hh<0.3?hex('#94b366'):hh<0.55?hex('#a9bd63'):hh<0.75?hex('#7a9b55'):hh<0.88?hex('#c9b27a'):hex('#6f8f4e');const X=JX+xx*sz,Z=JZ+zz*sz;poly([[X,0.1,Z],[X+sz*0.97,0.1,Z],[X+sz*0.97,0.1,Z+sz*0.97],[X,0.1,Z+sz*0.97]],fogC(col,Math.hypot(X-cam.x,cam.y,Z-cam.z)))}
    const cr=Math.max(140,h/9);const cpts=[];for(let i=0;i<20;i++){const a=i/20*6.283;cpts.push([JX+Math.cos(a)*cr*(0.8+0.3*hash(i,2)),0.3,JZ+Math.sin(a)*cr*(0.8+0.3*hash(i,2))])}poly(cpts,fogC(hex('#8a8a92'),cam.y));
    const objs=[];if(h>=1500&&h<=20000){for(const c of cloudsJ){for(let i=0;i<4;i++){const x=c.x+(hash(c.seed,i)-0.5)*c.s*2,z=c.z+(hash(c.seed,i+5)-0.5)*c.s*1.4;objs.push(puffObj(x,2000+(hash(c.seed,i+9)-0.5)*200,z,c.s*(0.6+0.5*hash(c.seed,i+3)),CLOUDW,0.92))}}}
    if(n===16){const k=u;const px=JX-90+180*k,py=yC-14,pz=JZ-55;const M=rotM(Math.PI/2,0,0);const W_=hex('#f2f4f7'),B_=hex('#1f4fa8');objs.push({d:dist([px,py,pz]),draw:()=>{oboxDraw([px,py,pz],M,1.9,1.9,17,{top:W_,side:W_,front:W_,back:W_,bottom:B_});oboxDraw(mapL([px,py,pz],M,0,-0.9,1),M,16,0.3,3.2,{top:W_,side:hex('#9aa0aa')});oboxDraw(mapL([px,py,pz],M,0,4.6,15),M,0.22,3.2,2.4,{top:B_,side:B_})}})}
    objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
  const base=[JX,yC,JZ];const tilt=0.15*Math.sin(t*1.7);jumperDraw(base,Math.PI+0.4,0,1,tilt)}
// ---------------- space views (J17-J25) ----------------
const EARTHP={17:[12000,1180],18:[6000,1120],19:[3200,1060],20:[2000,1000],21:[1300,960]};
function spaceBg(t,n,u){ctx.fillStyle='#02030a';ctx.fillRect(0,0,W,H);
  const dark=n<=18?(n===17?0.55:0.85):1;if(dark<1){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(20,40,110,${1-dark})`);g.addColorStop(1,`rgba(80,130,220,${1-dark})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  for(const s of starsS){ctx.fillStyle=`rgba(255,255,255,${dark*(0.3+0.6*Math.abs(Math.sin(s[3]*40+t*0.5)))})`;ctx.fillRect(s[0]*0.75,s[1]*0.8,s[2],s[2])}
  let ex,ey,er;if(EARTHP[n]){const[r,top]=EARTHP[n];er=r;ex=W/2;ey=top+r}else{const R0={22:900,23:650,24:450}[n];if(R0){er=R0;ex=W/2;ey=1250+R0*0.4}else{const k=clamp(u,0,1);er=380-280*k;ex=W/2-60*k;ey=1250-200*k}}
  ctx.save();const ag=ctx.createRadialGradient(ex,ey,er*0.97,ex,ey,er*1.08);ag.addColorStop(0,'rgba(120,180,255,0.8)');ag.addColorStop(1,'rgba(120,180,255,0)');ctx.fillStyle=ag;ctx.beginPath();ctx.arc(ex,ey,er*1.08,0,7);ctx.fill();ctx.restore();
  drawEarth2D(ex,ey,er,t*0.15+n);return[ex,ey,er]}
function drawSpaceJ(t,n,u){const[ex,ey,er]=spaceBg(t,n,u);
  if(n===21){// ISS
    cam.x=0;cam.y=0;cam.z=0;cam.yaw=0;cam.pitch=0;cam.roll=0;setCam();F=900;FOG=hex('#000000');FOGD=1e9;FOGMAX=0;setLight([-0.6,0.5,0.6]);AMB=0.55;
    const ic=[-2.6+u*1.2,0.6,-14];const M=rotM(0.5,0.2,0.1);const G=hex('#c8a24a'),T=hex('#9aa0aa'),BL=hex('#24407a');
    oboxDraw(ic,M,4.5,0.12,0.12,{top:T,side:T});for(const sx of[-3.6,-2.2,2.2,3.6])for(const sz of[-1,1])oboxDraw(mapL(ic,M,sx,0,sz*1.3),M,0.55,0.02,1.1,{top:BL,side:G,bottom:BL});oboxDraw(mapL(ic,M,0,0,0),M,0.35,0.35,1.2,{top:hex('#e6e6ea'),side:hex('#d0d0d6')})}
  if(n<=24){const k=t-(JUMPS[n-1][0]+JUMPS[n-1][1]-0.35);if(n>=19&&k>0&&k<0.35){const fx=ex-er*0.1,fy=ey-er*0.55;ctx.save();ctx.globalCompositeOperation='lighter';glow(fx,fy,er*0.5*(k/0.35)+20,[255,220,160],0.9*(1-k/0.35));ctx.restore();ctx.strokeStyle=`rgba(255,255,255,${0.8*(1-k/0.35)})`;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(fx,fy,er*0.6*(k/0.35),er*0.25*(k/0.35),0,0,7);ctx.stroke()}}
  if(n===25){const k=t-JUMPS[24][0];const mx=W*0.8,my=H*0.42,mr=40+k*14;ctx.fillStyle='#d8d8de';ctx.beginPath();ctx.arc(mx,my,mr,0,7);ctx.fill();ctx.fillStyle='rgba(150,150,165,0.6)';ctx.beginPath();ctx.arc(mx-mr*0.3,my-mr*0.2,mr*0.25,0,7);ctx.fill();ctx.beginPath();ctx.arc(mx+mr*0.25,my+mr*0.2,mr*0.18,0,7);ctx.fill()}
  cam.x=0;cam.y=0;cam.z=0;cam.yaw=0;cam.pitch=0;cam.roll=0;setCam();F=900;FOG=hex('#000000');FOGD=1e9;FOGMAX=0;setLight([-0.6,0.5,0.6]);AMB=0.5;
  const fl=n===25?Math.min(1,(t-JUMPS[24][0])/6):0;const base=[0.45-fl*0.8,-1.25+0.1*Math.sin(t*1.3)+fl*1.2,-4.8-fl*3];jumperDraw(base,Math.PI+0.55+(n===25?fl*2.5:0.1*Math.sin(t*0.7)),0,1,0.2*Math.sin(t*0.9)+(n===25?fl*1.2:0))}
// ---------------- HUD ----------------
function drawHUD(t){const n=jumpAt(t);if(n<1||t>=T_ENDJ)return;const h=jh(n);const[ts,D]=JUMPS[n-1];const k=t-ts;const pop=k<0.15?0.6+0.4*easeOut(k/0.15)+Math.sin(k/0.15*Math.PI)*0.15:1;
  ctx.save();ctx.translate(W/2,250);ctx.scale(pop,pop);txt('JUMP #'+n,0,0,96,'#ffd84a');ctx.restore();
  ctx.save();ctx.translate(W/2,365);ctx.scale(pop,pop);txt(fmtH(h),0,0,110,n>=19?'#7dd8ff':'#ffffff');ctx.restore();
  const s=CMP[n-1];if(s&&k>0.12){const size=fitSize(s,920,56);const al=Math.min(1,(k-0.12)/0.12,(D-k)/0.1);ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,520);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
  if(n===25&&k>2.3){const a=Math.min(1,(k-2.3)/0.3);const s2='You\'re never coming back down 😳';const size=fitSize(s2,920,60);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,640);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s2).width;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s2,0,4,size,'#ff8a8a','center',900,false);ctx.restore()}
  if(n===25&&k>4.6){const a=Math.min(1,(k-4.6)/0.3);ctx.save();ctx.globalAlpha=a;txt('Next stop: the Moon 🌕',W/2,1500,64,'#ffffff','center',900);ctx.restore()}}
function drawTitleJ(t){const a=t<2.9?1:clamp((3.2-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,t<COLD?560:700);ctx.scale(pop,pop);
  const l1='Every jump DOUBLES',l2='your jump height';const s=Math.min(fitSize(l1,980,96),fitSize(l2,980,96));ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffd84a');txt(l2,0,s*0.56,s,'#ffd84a');ctx.restore()}
function drawEndJ(t){const k=ease((t-T_ENDJ)/0.5)*clamp((LOOP-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.74*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-T_ENDJ<0.5?0.7+0.3*ease((t-T_ENDJ-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);txt('How many jumps',0,-100,92,'#ffd84a');txt('would YOU take?',0,10,92,'#ffd84a');const bounce=Math.abs(Math.sin((t-T_ENDJ)*5))*26;txt('👇',0,190+bounce,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-T_ENDJ-0.6)/0.4);txt('What should double next?',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
// ---------------- FRAME ----------------
function shakesJ(t){shakeX=0;shakeY=0;const s=(t0,amp,dur)=>{const k=t-t0;if(k>0&&k<dur){const a=amp*(1-k/dur);shakeX+=Math.sin(k*61)*a;shakeY+=Math.cos(k*47)*a}};
  for(let i=0;i<24;i++){const n=i+1;const tl=JUMPS[i][0]+JUMPS[i][1]-(n<=9?0.25:0.55);s(tl,Math.min(45,2+n*2),0.4+n*0.02)}}
function renderJ(t){ctx.save();shakesJ(t);
  if(t<COLD||t>=LOOP){const tt=t>=LOOP?t-60:t;drawSpaceJ(50.2+tt,25,0.2+tt*0.1);ctx.restore();return}
  const n=jumpAt(t);const[ts,D]=JUMPS[n-1];const tau=t-ts;
  if(n<=9)drawGround(t);
  else if(n<=16){if(tau<D-0.55)drawApex(t,n,tau/(D-0.55));else drawImpact(t,n,tau-(D-0.55))}
  else if(n<=18){if(tau<D-0.55){if(n===17)drawApexHigh(t,n,tau/(D-0.55));else drawSpaceJ(t,n,tau/D)}else drawImpact(t,n,tau-(D-0.55))}
  else drawSpaceJ(t,n,tau/D);
  ctx.restore()}
function drawApexHigh(t,n,u){drawSpaceJ(t,n,u)}
function overlaysJ(t){ctx=ctx0;shakeX=0;shakeY=0;const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=9;i<24;i++){const n=i+1;const tl=JUMPS[i][0]+JUMPS[i][1]-0.55;if(n<=18)flash(tl,0.7,0.25,'255,240,220');flash(JUMPS[i][0],0.4,0.15)}flash(COLD,0.7,0.25);flash(0,0.5,0.15);flash(JUMPS[18][0],0.6,0.3);flash(JUMPS[24][0],0.5,0.3);
  if(t>=COLD)drawHUD(t);if(t<3.2)drawTitleJ(t);drawEndJ(t);{const k=LOOP-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const t0=fi/FPS;for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderJ(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;ctx0.drawImage(acc,0,0);overlaysJ(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;window.crashes=[];
</script></body></html>
