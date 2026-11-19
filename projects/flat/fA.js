// ================= FLAT EARTH: timeline / camera / items / overlays =================
const EV={squash:2.8,sqEnd:3.4,pan:5.35,mass:6.45,pancake:7.85,grav:9.3,weird:10.8,mid:11.7,third:12.9,hill:14.35,step:15.75,hillw:17.75,
  ocean:19.2,slide:19.9,midw:20.5,dome:22.4,air:24.25,storms:25.75,edges:27.35,breathe:28.35,mag:29.6,gone:31.1,wind:31.7,
  wait:34.3,what:35.4,hates:36.5,crash:38.15,crashing:39.85,center:40.85,hour:41.75,collEnd:42.6,tnt:43.25,blow:43.65,tntw:45.45,
  quake:46.85,melts:49.15,earthb:49.85,round:51.05,planets:53.0,wins:55.8,end:58.15,follow:60.15,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const SCN=[['hook',0],['pan',EV.pan],['grav',EV.grav],['hill',EV.hill],['ocean',EV.ocean],['air',EV.air],['mag',EV.mag],['wait',EV.wait],['crash',EV.crash],['tnt',EV.tnt],['quake',EV.quake],['planets',EV.planets],['end',EV.end]];
function scn(t){let s='hook';for(const[n,a]of SCN)if(t>=a)s=n;return s}
const FR=2.6,FY=1/(2.6*2.6);
const SUND=V.norm([0.8,0.45,0.5]);
function envAt(t){const S=scn(t);const e={sun:SUND,sunCol:V.sc(hx('#fff1e0'),1.3),sky:[0.05,0.06,0.1],gnd:[0.02,0.02,0.03],fog:[0,0,0.01],fogD:1e7,zen:hx('#03040f'),hor:hx('#0a0c2a'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.09,0.1,0.16]};
  if(S==='hill'){e.ground=1;e.gndCol=hx('#4f8a3e');e.zen=hx('#2a64c8');e.hor=hx('#bfe2ff');e.stars=0;e.sky=[0.55,0.62,0.8];e.gnd=[0.3,0.3,0.22];e.fog=hx('#bfe2ff');e.fogD=90;e.sun=V.norm([0.5,0.8,0.6]);e.fillC=[0.2,0.22,0.3]}
  if(S==='mag'){e.sun=V.norm([1,0.25,0.25])}
  return e}
// pancake shape: squash factor 0..1 (0 = sphere, 1 = flat pancake), volume preserving
function shp(f){const sy=Math.pow(FY,f);const sx=1/Math.sqrt(sy);return[sx,sy,sx]}
function nsOf(s){return[1/(s[0]*s[0]),1/(s[1]*s[1]),1/(s[2]*s[2])]}
function surfY(x,z){const r=Math.hypot(x,z)/FR;return FY*Math.sqrt(Math.max(0,1-r*r))}
function squashF(t){const S=scn(t);
  if(S==='hook'){if(t<EV.squash)return 0;const k=t-EV.squash;if(k<0.6)return easeOut(k/0.6)*1.04;return 1+0.05*Math.exp(-(k-0.6)*2.5)*Math.sin((k-0.6)*16)}
  if(S==='pan')return 1+0.02*Math.exp(-(t-EV.pan)*1.5)*Math.sin((t-EV.pan)*14);
  if(S==='crash'){return 1-easeIn(seg(t,EV.crashing-0.2,EV.collEnd))}
  return S==='tnt'||S==='quake'||S==='planets'||S==='end'?0:1}
function camAt(t){const S=scn(t);let eye=[0,0,8],at=[0,0,0],fov=0.9;
  if(S==='hook'){const k=ease(seg(t,EV.squash+0.1,EV.pan));const sh=t<EV.squash?seg(t,0,EV.squash)*0.4:0;eye=[lerp(0,-0.6,k),lerp(0.45+sh*0.5,3.0,k),lerp(5.6-sh,7.6,k)];at=[0,lerp(0.75,-0.35,k),0];fov=0.9}
  if(S==='pan'){const k=ease(seg(t,EV.pan,EV.grav));const a=lerp(-0.35,0.55,k);const r=lerp(7.4,6.6,k);eye=[Math.sin(a)*r,lerp(3.0,3.6,k),Math.cos(a)*r];at=[0,-0.35,0]}
  if(S==='grav'){const k=ease(seg(t,EV.grav,EV.hill));const a=lerp(0.5,0.8,k);eye=[Math.sin(a)*3.8,lerp(7.0,6.4,k),Math.cos(a)*3.8];at=[0,-0.6,0];fov=0.95}
  if(S==='hill'){const k=seg(t,EV.hill,EV.ocean);const x=1.2-(t-EV.hill)*0.28;eye=[x+lerp(0.9,0.5,k),1.6,lerp(6.8,6.3,k)];at=[x-0.3,0.65,0.3];fov=0.95}
  if(S==='ocean'){const k=ease(seg(t,EV.ocean,EV.air));const a=lerp(-0.5,0.1,k);const r=lerp(6.6,5.6,k);eye=[Math.sin(a)*r,lerp(3.3,2.6,k),Math.cos(a)*r];at=[0,lerp(-0.2,0.0,k),0]}
  if(S==='air'){const k=ease(seg(t,EV.air,EV.edges));const k2=ease(seg(t,EV.edges-0.2,EV.mag));const a=lerp(0.1,0.5,k)+k2*0.2;const r=lerp(5.8,5.2,k)-k2*1.6;eye=[Math.sin(a)*r,lerp(2.9,2.4,k)-k2*1.3,Math.cos(a)*r];
    at=lerp3([0,0.1,0],[Math.sin(a)*2.1,0.0,Math.cos(a)*2.1],k2)}
  if(S==='mag'){const k=ease(seg(t,EV.mag,EV.wait));eye=[lerp(-1.2,-0.4,k),lerp(2.6,1.8,k),lerp(7.4,6.6,k)];at=[0.3,-0.25,0];fov=0.95}
  if(S==='wait'){const k=ease(seg(t,EV.wait,EV.crash));eye=[0,lerp(1.6,1.9,k),lerp(7.4,7.8,k)];at=[0,-0.2,0]}
  if(S==='crash'){const k=ease(seg(t,EV.crash,EV.tnt));eye=[lerp(0.6,0,k),lerp(2.4,1.0,k),lerp(7.6,5.4,k)];at=[0,lerp(-0.2,0.25,k),0]}
  if(S==='tnt'){const k=ease(seg(t,EV.tnt,EV.quake));eye=[lerp(0.2,-0.3,k),lerp(0.9,0.7,k),lerp(4.9,4.2,k)];at=[0,0.3,0]}
  if(S==='quake'){const k=ease(seg(t,EV.quake,EV.planets));eye=[lerp(-0.3,0.4,k),lerp(0.7,0.9,k),lerp(4.3,4.6,k)];at=[0,0.4,0]}
  if(S==='planets'){const k=ease(seg(t,EV.planets,EV.end));eye=[lerp(-3.2,3.4,k),1.4,11.8];at=[lerp(-3.2,3.4,k),1.2,0];fov=0.85}
  if(S==='end'){const k=ease(seg(t,EV.end,EV.end+1.4));eye=[0,lerp(1.4,0.45,k),lerp(6.6,5.6,k)];at=[0,lerp(0.4,0.75,k),0]}
  return{eye,at,fov}}
// hydraulic press plate height (bottom face) over the Earth
function pressY(t){const S=scn(t);if(S==='hook'){if(t<2.3)return lerp(2.6,2.15,t/2.3);if(t<EV.squash)return lerp(2.15,1.0,easeIn(seg(t,2.3,EV.squash)));
    const k=t-EV.squash;if(k<0.6)return shp(squashF(t))[1];return shp(1)[1]+easeIn(seg(t,EV.sqEnd+0.6,EV.pan))*6}
  if(S==='end'&&t>EV.loop-1.6)return lerp(8,2.6,easeOut(seg(t,EV.loop-1.6,EV.loop)));return null}
let EARTHP=null,QR2=null;
function earthM(s,yaw){return M4.trs([0,0,0],yaw,0,0,s)}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHP=null;
  const f=squashF(t);const s=shp(f);const yaw=t*0.06+0.4;
  const flatMesh=(S==='ocean'&&t>EV.midw)||S==='air'||S==='mag'||S==='wait'||S==='crash'?F_DRY:F_EARTH;
  if(S==='hook'){if(t<EV.sqEnd)items.push({mesh:SEARTH,M:earthM(s,yaw),ns:nsOf(s)});else items.push({mesh:F_EARTH,M:earthM(s,yaw),ns:nsOf(s)})}
  if(['pan','grav','ocean','air','mag','wait'].includes(S))items.push({mesh:flatMesh,M:earthM(s,yaw),ns:nsOf(s)});
  if(S==='crash'){const hot=seg(t,EV.crashing,EV.collEnd);if(t<EV.collEnd)items.push({mesh:F_DRY,M:earthM(s,yaw),ns:nsOf(s),tint:[1,0.4,0.12],tintAmt:hot*0.7});
    else{items.push({mesh:F_LAVA,M:earthM(1,yaw)});items.push({mesh:F_LAVAG,M:earthM(1.003,yaw),alpha:0.95,add:1,noShadow:true})}}
  if(S==='tnt'||S==='quake'){const cool=S==='quake'?seg(t,EV.earthb,EV.round):0;const pul=0.75+0.25*Math.sin(t*9);
    if(cool<1)items.push({mesh:F_LAVA,M:earthM(1,yaw)});if(cool>0)items.push({mesh:SEARTH,M:earthM(1.001,yaw),alpha:cool<1?Math.max(0.01,cool):null,tint:[1,0.35,0.1],tintAmt:(1-cool)*0.6});
    items.push({mesh:F_LAVAG,M:earthM(1.004,yaw),alpha:0.95*pul*(1-cool),add:1,noShadow:true})}
  if(S==='end')items.push({mesh:SEARTH,M:earthM(1,0.4+0.06*(t-EV.loop))});
  if(S==='hook'||S==='end'||S==='pan'||S==='grav'||S==='ocean'||S==='air'||S==='mag'||S==='wait'||S==='crash')EARTHP={s};
  // press
  const py=pressY(t);if(py!=null&&py<7.5)items.push({mesh:F_PRESS,M:M4.trs([0,py+0.2,0],0.3,0,0,[0.75,1,0.75])});
  // ocean dome
  if(S==='ocean'||S==='air'||S==='mag'||S==='wait'||(S==='crash'&&t<EV.collEnd)){const k=S==='ocean'?easeOut(seg(t,EV.slide,EV.dome+0.3)):1;const sh=S==='crash'?1-seg(t,EV.crashing,EV.collEnd-0.3):1;
    const ds=[lerp(0.15,0.95,k)*sh+0.001,lerp(0.03,0.55,k)*sh+0.001,lerp(0.15,0.95,k)*sh+0.001];items.push({mesh:F_DOME,M:M4.trs([0,FY*0.6,0],t*0.1,0,0,ds),ns:nsOf(ds)})}
  // air dome
  if(S==='air'){const k=easeOut(seg(t,EV.air+0.2,EV.storms));const as=[lerp(0.6,1.7,k),lerp(0.3,0.95,k),lerp(0.6,1.7,k)];items.push({mesh:UEMIS,M:M4.trs([0,0,0],0,0,0,as),tint:[0.45,0.8,1],tintAmt:1,alpha:0.22*k,add:1,noShadow:true})}
  // local hill scene
  if(S==='hill'){items.push({mesh:F_GROUND,M:M4.trs([0,0,0],0,0,0,1)});const r=rngG(12);
    for(let i=0;i<22;i++){const x=(r()-0.5)*40,z=-4-r()*34;items.push({mesh:F_TREE,M:M4.trs([x,0,z],0,0,-0.62,0.9+r()*0.9)})}
    const k=t-EV.hill;const x=1.2-k*0.28;const bob=Math.abs(Math.sin(k*5))*0.06;for(const it of jumperItems([x,bob,0.3],-Math.PI/2,0.1,0.05,-0.62,1))items.push(it)}
  // Q mascot
  if(S==='wait'){const k=seg(t,EV.wait,EV.wait+0.35);qItems(items,t,cm,{x:0,y:0.2,s:0.36,d:3,pop:easeOut(k),expr:t>EV.what?'wide':'open'})}
  if(S==='grav'&&t>EV.third){const k=seg(t,EV.third,EV.third+0.3);qItems(items,t,cm,{x:0.62,y:-0.62,s:0.13,d:3,pop:easeOut(k),expr:'happy'})}
  // planets lineup
  if(S==='planets'){const P=[[SMOONM,-6.2,0.45],[SMARS,-4.4,0.6],[SEARTH,-2.2,1.0],[SNEPM,0.6,1.3],[SJUP,4.0,1.9]];
    for(const[m,x,r]of P)items.push({mesh:m,M:M4.trs([x,1.2,0],t*0.15+x,0,0,r)});items.push({mesh:SSAT,M:M4.trs([8.4,1.2,0],t*0.1,0.3,0,1.6)});items.push({mesh:SSATRING,M:M4.trs([8.4,1.2,0],t*0.1,0.42,0,1.6),noShadow:true})}
  return items}
// ---------- overlays ----------
function arrow2(a,b,col,w,al){if(!a||!b||al<=0)return;const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<6)return;const ux=dx/L,uy=dy/L;ctx.save();ctx.globalAlpha=al;ctx.strokeStyle='rgba(0,0,0,0.7)';ctx.lineCap='round';
  ctx.lineWidth=w+6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]-ux*w*1.5,b[1]-uy*w*1.5);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]-ux*w*1.5,b[1]-uy*w*1.5);ctx.stroke();
  const h=w*2.6;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]-ux*h-uy*h*0.6,b[1]-uy*h+ux*h*0.6);ctx.lineTo(b[0]-ux*h+uy*h*0.6,b[1]-uy*h-ux*h*0.6);ctx.closePath();ctx.fill();ctx.restore()}
function pancakeGlow(cm,a,col){const c=prj([0,0,0]),e=prj([FR,0,0]),e2=prj([0,0,FR]);if(!c||!e||!e2)return;const r=Math.max(Math.hypot(e[0]-c[0],e[1]-c[1]),Math.hypot(e2[0]-c[0],e2[1]-c[1]));ctx.save();ctx.globalCompositeOperation='screen';ctx.translate(c[0],c[1]);
  const ry=Math.abs(prj([0,0,FR])[1]-c[1])/r;ctx.scale(1,Math.max(0.25,ry+0.08));const g=ctx.createRadialGradient(0,0,r*0.9,0,0,r*1.18);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(0.3,`rgba(${col},${0.5*a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(-r*1.3,-r*1.3,r*2.6,r*2.6);ctx.restore()}
function sphereGlow(cm,R,a,col){const c=prj([0,0,0]);if(!c)return;const P=pRad([0,0,0],R,cm);if(!P)return;const r=P[1];ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.25);
  g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(0.28,`rgba(${col},${0.55*a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.4,c[1]-r*1.4,r*2.8,r*2.8);ctx.restore()}
function gravArrows(t,al){const R=[0.35,1.05,1.75,2.35];for(let ri=0;ri<R.length;ri++){const n=ri===0?4:8;for(let i=0;i<n;i++){const a=i/n*TAU2+ri*0.3;const x=Math.cos(a)*R[ri],z=Math.sin(a)*R[ri];const y=surfY(x,z)+0.02;const rr=R[ri]/FR;
  const g=V.norm([-x*0.9,-(1-rr)*1.4-0.05,-z*0.9]);const L=0.42+rr*0.25;const p0=[x-g[0]*L,y-g[1]*L,z-g[2]*L];const ph=(t*1.2+i*0.13)%1;
  arrow2(prj(lerp3(p0,[x,y,z],ph*0.25)),prj(lerp3(p0,[x,y,z],0.25+ph*0.75+0.0)),rr>0.6?'#ff5a8a':'#ffd84a',9,al*clamp(Math.sin(ph*Math.PI)*2,0,1))}}}
function flowArrows(t,al){for(let i=0;i<10;i++){const a=i/10*TAU2+0.2;const ph=(t*0.8+i*0.37)%1;const r0=lerp(2.4,1.0,ph),r1=lerp(2.4,1.0,Math.min(1,ph+0.22));
  arrow2(prj([Math.cos(a)*r0,surfY(Math.cos(a)*r0,Math.sin(a)*r0)+0.03,Math.sin(a)*r0]),prj([Math.cos(a)*r1,surfY(Math.cos(a)*r1,Math.sin(a)*r1)+0.03,Math.sin(a)*r1]),'#5af0ff',8,al*Math.sin(ph*Math.PI))}}
function storms(t,al){if(al<=0)return;const c=prj([0,0.45,0]);if(!c)return;ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';
  for(let s=0;s<5;s++){const sc=[[0,0],[-230,40],[220,60],[-120,-60],[140,-50]][s];const rot=t*(2.2+s*0.4)*(s%2?-1:1);ctx.save();ctx.translate(c[0]+sc[0],c[1]+sc[1]);ctx.scale(1,0.42);
    for(let arm=0;arm<3;arm++){ctx.strokeStyle=`rgba(230,245,255,${0.55*al})`;ctx.lineWidth=7-arm;ctx.beginPath();for(let i=0;i<=40;i++){const q=i/40;const ang=rot+arm*TAU2/3+q*4.2;const r=(s?60:110)*q;const x=Math.cos(ang)*r,y=Math.sin(ang)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}ctx.restore()}
  if(Math.floor(t*7)%9===0){const x=c[0]+Math.sin(t*13)*180,y=c[1]-30;ctx.strokeStyle=`rgba(255,250,200,${0.9*al})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y-120);ctx.lineTo(x+25,y-60);ctx.lineTo(x-10,y-40);ctx.lineTo(x+20,y+10);ctx.stroke()}ctx.restore()}
function fieldLines(al){if(al<=0)return;for(let i=1;i<=4;i++){const L=1.6+i*0.9;const P=[];for(let q=0;q<=60;q++){const th=0.08+q/60*(Math.PI-0.16);const r=L*Math.sin(th)*Math.sin(th);P.push([r*Math.sin(th)*1.0,r*Math.cos(th)*0.9,0])}
  for(const sx of[-1,1])strokePts(P.map(p=>prj([p[0]*sx,p[1],p[2]+0.2])),'#5af0ff',6,al*0.8,[14,10])}}
function solarWind(t,al){if(al<=0)return;const r=rngG(3);ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';for(let i=0;i<70;i++){const y0=(r()-0.5)*2.2,z0=(r()-0.5)*4;const sp=1.5+r()*1.5;const ph=(t*sp*0.5+r())%1;
  const x=lerp(9,-0.2+r()*2.5,ph);const a=prj([x,y0*0.6+0.25,z0*0.5]),b=prj([x+0.7,y0*0.6+0.25,z0*0.5]);if(!a||!b)continue;ctx.strokeStyle=`rgba(255,${180+r()*60|0},120,${0.75*al*(1-ph*0.4)})`;ctx.lineWidth=3+r()*3;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  if(ph>0.9){const h=prj([x,surfY(x,z0*0.5)+0.02,z0*0.5]);if(h)glowAt(h,30,'255,200,120',0.6*al)}}ctx.restore()}
function lavaGlow(cm,a){sphereGlow(cm,1,a,'255,120,40')}
function drawEnd(t){const k=ease((t-EV.end-0.2)/0.4)*clamp((EV.loop-0.25-t)/0.3,0,1);if(k<=0)return;const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.42,`rgba(4,4,20,${0.3*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;bigLabel([['Which planet should we',-60,76,'#ffffff'],['FLATTEN NEXT? 🥞👇',50,96,'#ffd84a']],330,t-EV.end-0.2);ctx.restore();
  if(t>EV.follow){ctx.save();ctx.globalAlpha=k*clamp((t-EV.follow)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1580);ctx.fillStyle='#fff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1580);ctx.restore()}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  const flatS=['pan','grav','ocean','air','mag','wait'].includes(S)||(S==='hook'&&tt>EV.sqEnd);
  if(flatS)pancakeGlow(cm,S==='air'?1.3:0.9,'110,210,255');else if(S==='hook'||S==='end'||(S==='quake'&&tt>EV.round))sphereGlow(cm,1,1,'110,210,255');
  if(S==='hook'||S==='end'||S==='pan'||S==='planets')sunFlare(cm,0.7);
  if(S==='hook'){if(tt<EV.squash){statCard('🧪 THE WHAT IF LAB','WHAT IF EARTH WAS FLAT?','#ffd84a',tt+0.2,300);const w=seg(tt,1.2,EV.squash);vignette('255,40,80',0.35*w+0.1*Math.sin(tt*20)*w);
      if(tt>1.2)tag('⚠️ FLATTENING IN 3… 2… 1…',[W/2,500],'#ff5a8a',seg(tt,1.2,1.4))}
    else{flash(clamp(1-(tt-EV.squash)/0.35,0,1));if(tt>EV.sqEnd)flash(0.6*(1-seg(tt,EV.sqEnd,EV.sqEnd+0.25)));if(tt>3.7)tag('🥞 FLAT EARTH: ACTIVATED',[W/2,340],'#7dff9a',seg(tt,3.7,4.0))}}
  if(S==='pan'){const c=prj([0,0.2,0]);if(tt>EV.mass&&c)tag('⚖️ SAME MASS ✅',[W/2,330],'#7dff9a',seg(tt,EV.mass,EV.mass+0.3));
    if(tt>EV.pancake){const e=prj([0,0,FR]);if(e)tag('🧊 ice wall = Antarctica',[clamp(e[0],300,W-300),e[1]+80],'#9fe8ff',seg(tt,EV.pancake,EV.pancake+0.3))}flash(0.35*(1-seg(tt,EV.pan,EV.pan+0.2)))}
  if(S==='grav'){gravArrows(tt,seg(tt,EV.grav+0.3,EV.grav+0.8));if(tt>EV.weird-0.2)tag('⬇️ "DOWN" points to the CENTER',[W/2,330],'#ffd84a',seg(tt,EV.weird-0.2,EV.weird+0.1));
    if(tt>EV.mid){const c=prj([0,surfY(0,0),0]);if(c){const hop=Math.abs(Math.sin((tt-EV.mid)*2.6))*90;glowAt([c[0],c[1]-20],120,'255,216,74',0.5);emojiAt('🧍',c[0],c[1]-60-hop,90,seg(tt,EV.mid,EV.mid+0.3))}}
    if(tt>EV.third-0.1)statCard('⚖️ GRAVITY IN THE MIDDLE','only ~30% 🪶','#7dff9a',tt-EV.third+0.1,470);flash(0.4*(1-seg(tt,EV.grav,EV.grav+0.2)))}
  if(S==='hill'){const k=tt-EV.hill;const x=1.2-k*0.28;const f=prj([x,1.0,0.3]);const g=prj(V.add([x,1.0,0.3],V.sc(V.norm([-1,-1.2,0]),1.6)));
    if(f&&g){arrow2(f,g,'#ff5a8a',14,seg(tt,EV.hill+0.3,EV.hill+0.6));tag('GRAVITY',[g[0]-10,g[1]+50],'#ff5a8a',seg(tt,EV.hill+0.4,EV.hill+0.7))}
    const a=prj([3,-0.4+3*0.0,0.3]),b0=prj([-6,0,0.3]);const sl=seg(tt,EV.step,EV.step+0.5);if(sl>0){const A=prj([x+2.4,-2.0,0.3]),B=prj([x-5,4.15,0.3]);strokePts([A,B],'#ffd84a',12,sl,[26,18]);tag('🏔️ feels like THIS',[W/2+80,500],'#ffd84a',sl)}
    if(tt>EV.hill+0.2)tag('🧭 center of the disc ⬅️',[300,240],'#ffffff',seg(tt,EV.hill+0.2,EV.hill+0.5));if(tt>EV.hillw)tag('😩 UPHILL. FOREVER.',[W/2,700],'#ff5a8a',seg(tt,EV.hillw,EV.hillw+0.3));flash(0.5*(1-seg(tt,EV.hill,EV.hill+0.2)))}
  if(S==='ocean'){flowArrows(tt,seg(tt,EV.slide,EV.slide+0.3)*(1-seg(tt,EV.dome,EV.dome+0.5)));if(tt>EV.dome-0.1){const d=prj([0,0.62,0]);if(d)tag('🌊 ~860 km DEEP ocean dome',[W/2,Math.max(380,d[1]-90)],'#5af0ff',seg(tt,EV.dome-0.1,EV.dome+0.2))}
    if(tt>EV.midw){const e=prj([FR*0.75,0.05,FR*0.2]);if(e)tag('🏜️ dry seabed',[clamp(e[0],250,W-250),e[1]+70],'#ffd84a',seg(tt,EV.midw,EV.midw+0.3))}flash(0.4*(1-seg(tt,EV.ocean,EV.ocean+0.2)))}
  if(S==='air'){storms(tt,seg(tt,EV.storms-0.2,EV.storms+0.3)*(1-seg(tt,EV.edges,EV.edges+0.4)));if(tt>EV.air+0.3&&tt<EV.edges)tag('💨 all the AIR rushes to the middle',[W/2,330],'#9fe8ff',seg(tt,EV.air+0.3,EV.air+0.6));
    if(tt>EV.storms&&tt<EV.edges)tag('🌪️ MEGA STORMS',[W/2,430],'#ffd84a',seg(tt,EV.storms,EV.storms+0.3));
    if(tt>EV.edges){vignette('200,20,40',0.45*seg(tt,EV.edges,EV.edges+0.4));tag('😵 EDGE: almost NO AIR',[W/2,380],'#ff5a8a',seg(tt,EV.edges+0.1,EV.edges+0.4))}}
  if(S==='mag'){fieldLines(1-seg(tt,EV.gone-0.1,EV.gone+0.4));if(tt<EV.gone)tag('🧲 magnetic field',[W/2,420],'#5af0ff',seg(tt,EV.mag,EV.mag+0.3));
    if(tt>EV.gone-0.1)statCard('🧲 MAGNETIC FIELD','PROBABLY GONE ❌','#ff5a8a',tt-EV.gone+0.1,330);solarWind(tt,seg(tt,EV.wind-0.3,EV.wind+0.2));if(tt>EV.wind)tag('☀️ SOLAR WIND ➜',[W-260,560],'#ffb070',seg(tt,EV.wind,EV.wind+0.3));sunFlare(cm,1);flash(0.4*(1-seg(tt,EV.mag,EV.mag+0.2)))}
  if(S==='wait'){vignette('0,0,0',0.45);if(tt>EV.what)flash(0.45*(1-seg(tt,EV.what,EV.what+0.25)),'255,90,138');if(tt>EV.hates-0.4)statCard('⚠️ PLOT TWIST','GRAVITY HATES FLAT','#ff5a8a',tt-EV.hates+0.4,330)}
  if(S==='crash'){const hot=seg(tt,EV.crashing,EV.collEnd);if(tt<EV.collEnd){pancakeGlow(cm,0.9*(1-hot),'110,210,255');if(hot>0){const c=prj([0,0,0]);if(c)glowAt(c,lerp(300,520,hot),'255,130,50',0.55*hot)}}else{lavaGlow(cm,1);flash(0.8*(1-seg(tt,EV.collEnd,EV.collEnd+0.3)),'255,200,150')}
    if(tt>EV.crash+0.3&&tt<EV.crashing){for(let i=0;i<6;i++){const a=i/6*TAU2;const p=[Math.cos(a)*FR*0.95,0,Math.sin(a)*FR*0.95];arrow2(prj(p),prj(V.sc(p,0.55)),'#ff5a8a',10,seg(tt,EV.crash+0.3,EV.crash+0.6))}}
    if(tt>EV.crash+0.2)tag('🔬 scientists think…',[W/2,250],'#9fe8ff',seg(tt,EV.crash+0.2,EV.crash+0.5));if(tt>EV.hour-0.1)statCard('⏱️ COLLAPSE BACK INTO A BALL','in ~1 HOUR','#ffd84a',tt-EV.hour+0.1,400);vignette('200,40,20',0.3*hot)}
  if(S==='tnt'){lavaGlow(cm,1.2);const k=tt-EV.blow;if(k>0){flash(clamp(1-k/0.45,0,1),'255,230,200');const c=prj([0,0,0]);if(c){for(let i=0;i<3;i++){const kk=k-i*0.35;if(kk<0||kk>2.2)continue;ctx.save();ctx.globalAlpha=clamp(1-kk/2.2,0,1);ctx.strokeStyle=i?'#ffb070':'#fff2d0';ctx.lineWidth=12-i*3;ctx.beginPath();ctx.arc(c[0],c[1],300+kk*420,0,TAU2);ctx.stroke();ctx.restore()}}}
    if(tt>44.85)statCard('💥 ENERGY RELEASED','= an Earth made of TNT 🧨','#ff5a8a',tt-44.85,330)}
  if(S==='quake'){const cool=seg(tt,EV.earthb,EV.round);lavaGlow(cm,1-cool);tag('🌋 EARTHQUAKES EVERYWHERE',[W/2,330],'#ffb070',seg(tt,EV.quake,EV.quake+0.3)*(1-seg(tt,EV.round-0.3,EV.round)));
    if(tt>EV.melts&&tt<EV.round)tag('🔥 the crust MELTS',[W/2,430],'#ff5a8a',seg(tt,EV.melts,EV.melts+0.3));
    if(tt>EV.round){flash(0.45*(1-seg(tt,EV.round,EV.round+0.3)),'125,255,154');statCard('🌍 EARTH','ROUND AGAIN ✅','#7dff9a',tt-EV.round,330)}flash(0.3*(1-seg(tt,EV.quake,EV.quake+0.2)))}
  if(S==='planets'){if(tt<EV.wins)tag('every big planet = ROUND 🔵',[W/2,330],'#ffffff',seg(tt,EV.planets+0.3,EV.planets+0.6));if(tt>EV.wins-0.1)statCard('🏆 WINNER','GRAVITY','#ffd84a',tt-EV.wins+0.1,330);flash(0.4*(1-seg(tt,EV.planets,EV.planets+0.2)))}
  if(S==='end'){flash(0.4*(1-seg(tt,EV.end,EV.end+0.2)));drawEnd(tt)}
  caption(tt)}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);if(scn(tt)!=='hill')items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const sc=scn(tt)==='hill'?{center:[0,0,0],radius:9}:{center:[0,-9999,0],radius:1};LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.02,far:3000},sc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.squash,22,0.9);S(EV.what,6,0.4);S(EV.crashing,6,2.8);S(EV.collEnd,14,0.8);S(EV.blow,22,1.2);
  if(t>EV.quake&&t<EV.earthb)a+=5+3*Math.sin(t*3);S(EV.hates,5,0.4);return a}
