// ================= PLANET PARADE: timeline / camera / items / overlays =================
const EV={danger:3.0,net:4.5,tides:5.8,quakes:6.4,doom:7.1,line:8.2,perf:9.4,eight:10.1,str:11.3,res:11.9,mm:14.0,hair:16.3,hairw:17.3,wait:18.0,what:18.5,
  far:19.3,moonp:21.6,lakh:23.6,person:26.1,pulls:28.0,mars:29.3,boring:30.3,cheat:31.4,putj:32.3,moonis:33.0,sky:33.8,forty:35.7,tide:38.0,k26:39.0,km:42.5,
  orbit:44.2,day:46.2,melt:47.6,meltw:49.0,io:51.0,volc:51.8,relax:53.8,harm:55.9,faraway:57.9,end:59.0,follow:60.8,loop:66.0};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const SCN=[['hook',0],['danger',EV.danger],['net',EV.net],['line',EV.line],['res',EV.res],['hair',EV.hair],['far',EV.far],['person',EV.person],['cheat',EV.boring],
  ['sky',EV.sky],['tide',EV.tide],['orbit',EV.orbit],['melt',EV.melt],['relax',EV.relax],['end',EV.end]];
function scn(t){let s='hook';for(const[n,a]of SCN)if(t>=a)s=n;return s}
const SUND=V.norm([0.9,0.35,0.45]);
const NIGHT=s=>s==='hook'||s==='sky'||s==='relax'||s==='end';
// lava Earth (copied from flat)
function pLavaCol(n){const v=fbm(n[0]*5+2,n[2]*5+n[1]*3,5);const cr=Math.abs(fbm(n[0]*9+7,n[1]*9-n[2]*4,3)-0.5);
  if(cr<0.05)return mix3([1,0.9,0.4],[1,0.4,0.05],cr/0.05);return mix3([0.12,0.06,0.05],[0.35,0.12,0.06],v)}
const P_LAVA=um(m=>sph(m,1,96,192,pLavaCol,0),0.3);
const P_LAVAG=um(m=>sph(m,1,96,192,n=>{const cr=Math.abs(fbm(n[0]*9+7,n[1]*9-n[2]*4,3)-0.5);return cr<0.06?mix3([1,0.85,0.35],[1,0.35,0.05],cr/0.06):[0,0,0]},MAT.emis),0.3);
function envAt(t){const S=scn(t);const e={sun:SUND,sunCol:V.sc(hx('#fff1e0'),1.35),sky:[0.05,0.06,0.1],gnd:[0.02,0.02,0.03],fog:[0,0,0.01],fogD:1e7,zen:hx('#03040f'),hor:hx('#0a0c2a'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.09,0.1,0.16]};
  if(NIGHT(S)){e.zen=hx('#040622');e.hor=hx('#3a2a5a');e.stars=1.0;e.sun=V.norm([0.35,0.75,-0.55]);e.sunCol=V.sc(hx('#ffe6c8'),1.25);e.sunSize=0.0001;e.ground=1;e.gndCol=hx('#0b1420');if(S==='sky')e.sun=V.norm([0.45,0.55,0.75]);e.fog=hx('#2a2346');e.fogD=160;e.sky=[0.12,0.12,0.2];e.gnd=[0.03,0.03,0.05];e.fillC=[0.12,0.12,0.2]}
  return e}
// ---------- planets in the line-up (not to scale) ----------
const PL=[['Sun',SUNM,-10.5,2.6],['Mercury',P_MER,-6.6,0.22],['Venus',P_VEN,-5.6,0.42],['Earth',SEARTH,-4.3,0.45],['Mars',SMARS,-3.1,0.3],['Jupiter',P_JUP,-0.6,1.25],['Saturn',SSAT,2.9,1.0],['Uranus',P_URA,5.6,0.62],['Neptune',SNEPM,7.6,0.6]];
const PLOFF=[[0,0],[0.9,-1.6],[-1.4,1.2],[1.6,0.8],[-1.2,-1.9],[2.2,-2.6],[-2.6,2.4],[2.9,1.6],[-3.2,-2.8]];
function linePos(i,t){const k=easeOut(seg(t,EV.perf-0.45,EV.perf));const o=PLOFF[i];const wob=i?(1-k):0;return[o[1]*1.3*(1-k),o[0]*0.4*(1-k)+Math.sin(t*1.3+i)*0.05*wob,PL[i][2]]}
// sky (pre-dawn parade) – 2D planet dots along the ecliptic
const SKYP=[['Mercury',[250,1010],9,'255,220,190',-0.5],['Venus',[430,860],15,'255,250,220',-4.9],['Mars',[640,700],9,'255,140,90',0.6],['Jupiter',[700,670],12,'255,235,200',-2.1]];
// ---------- camera ----------
function camAt(t){const S=scn(t);let eye=[0,0,8],at=[0,0,0],fov=0.9;
  if(NIGHT(S)&&S!=='sky'){let k=S==='hook'?seg(t,0,EV.danger):S==='relax'?seg(t,EV.relax,EV.end):seg(t,EV.end,EV.loop);
    // end flows into hook (same framing at loop)
    if(S==='hook'){eye=[lerp(0.4,0,k),lerp(1.9,1.8,k),lerp(7.6,6.2,k)];at=[0,lerp(4.4,4.6,k),-30]}
    else if(S==='relax'){eye=[lerp(-0.6,0.2,k),1.9,lerp(6.4,7.2,k)];at=[0,4.5,-30]}
    else{eye=[lerp(0.2,0.4,k),1.9,lerp(7.2,7.6,k)];at=[0,4.4,-30]}fov=0.95}
  if(S==='sky'){const k=ease(seg(t,EV.sky,EV.tide));eye=[0,lerp(1.4,1.7,k),lerp(7,6.4,k)];at=[0,lerp(5.5,8.5,k),-30];fov=1.0}
  if(S==='danger'){const k=ease(seg(t,EV.danger,EV.net));eye=[lerp(-0.8,0.3,k),lerp(0.5,0.4,k),lerp(4.4,3.7,k)];at=[0,0.1,0];fov=0.9}
  if(S==='net'){const k=ease(seg(t,EV.net,EV.line));eye=[lerp(0.3,1.1,k),lerp(0.4,0.6,k),lerp(3.7,3.4,k)];at=[0,0.25,0];fov=0.9}
  if(S==='line'){const k=ease(seg(t,EV.line,EV.res));const k2=ease(seg(t,EV.perf+0.3,EV.res));eye=[lerp(0,3.4,k2),lerp(15,2.6,k2)-k*1.0*(1-k2),lerp(15,14.5,k2)];at=[0,0,lerp(-1.5,-5,k2)];fov=lerp(1.0,0.85,k2)}
  if(S==='res'){const k=ease(seg(t,EV.res,EV.hair));eye=[lerp(1.0,0.6,k),lerp(0.3,0.2,k),lerp(3.6,3.1,k)];at=[0.15,0.25,0];fov=0.9}
  if(S==='hair'){const k=ease(seg(t,EV.hair,EV.far));eye=[0.6,0.2,lerp(3.1,2.9,k)];at=[0.15,0.25,0];fov=0.9}
  if(S==='far'){const k=ease(seg(t,EV.far,EV.person));eye=[lerp(-0.4,-2.0,k),lerp(0.8,3.0,k),lerp(3.4,7.5,k)];at=[lerp(-0.4,-1.5,k),0.1,lerp(0,-6,k)];fov=0.95}
  if(S==='person'){const k=ease(seg(t,EV.person,EV.boring));eye=[lerp(0.6,0.2,k),0.2,lerp(4.4,3.8,k)];at=[1.1,0.4,0];fov=0.9}
  if(S==='cheat'){const k=ease(seg(t,EV.boring,EV.sky));eye=[lerp(-1.2,-1.6,k),lerp(0.9,0.7,k),lerp(3.4,3.8,k)];at=[lerp(1.0,1.4,k),0.2,-1.2];fov=1.0}
  if(S==='tide'){const k=ease(seg(t,EV.tide,EV.orbit));eye=[lerp(0.9,1.3,k),lerp(2.0,1.6,k),lerp(4.8,4.3,k)];at=[-0.35,0,0];fov=0.95}
  if(S==='orbit'){const k=ease(seg(t,EV.orbit,EV.melt));eye=[0,lerp(13,11.5,k),lerp(7.5,6.0,k)];at=[0,0,0.3];fov=0.95}
  if(S==='melt'){const k=ease(seg(t,EV.melt,EV.relax));const k2=ease(seg(t,EV.io-0.5,EV.io+0.6));eye=[lerp(0.3,-0.3,k)+k2*0.9,lerp(0.4,0.3,k),lerp(3.8,3.4,k)+k2*1.3];at=[k2*1.0,0.15*k2,0];fov=0.9}
  return{eye,at,fov}}
// Moon position near Earth (cheat/far)
const MOONPOS=[1.9,0.3,-1.6];
function cheatJ(t){// jupiter fly-in from far to moon's place
  const k=easeOut(seg(t,EV.putj-0.3,EV.moonis));return lerp3([30,7,-90],MOONPOS,k)}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;const yaw=t*0.08+0.4;
  if(NIGHT(S)||S==='sky'){items.push({mesh:P_GROUND,M:M4.trs([0,0,0],0,0,0,1)});const r=rngG(12);
    for(let i=0;i<26;i++){const x=(r()-0.5)*70,z=-6-r()*60;items.push({mesh:P_TREE,M:M4.trs([x,0.3,z],r()*6,0,0,1.0+r()*1.4)})}
    if(S==='sky'){const k=easeOut(seg(t,EV.sky,EV.sky+1.6));items.push({mesh:P_JUP,M:M4.trs([-1,lerp(-6,14,k),-70],t*0.05,0.12,0,13)})}}
  if(S==='danger'||S==='net'){const red=S==='net'?0.18+0.1*Math.sin(t*10):0.15*seg(t,EV.danger,EV.net);items.push({mesh:SEARTH,M:M4.trs([0,0,0],yaw,0.2,0,1),tint:[1,0.3,0.12],tintAmt:red})}
  if(S==='line'){for(let i=0;i<PL.length;i++){const p=linePos(i,t);const[n,m,,r]=PL[i];const pop=easeOut(seg(t,EV.line+i*0.05,EV.line+0.3+i*0.05));
    items.push(i===0?{mesh:m,M:M4.trs(p,0,0,0,r*pop),noShadow:true,tint:[1,0.78,0.4],tintAmt:0.45}:{mesh:m,M:M4.trs(p,t*0.3+i,0.2,0,r*pop)});if(n==='Saturn')items.push({mesh:SSATRING,M:M4.trs(p,t*0.1,0.42,0,r*pop),noShadow:true})}}
  if(S==='res'||S==='hair'){items.push({mesh:SEARTH,M:M4.trs([0,0,0],yaw,0.2,0,1)})}
  if(S==='far'){items.push({mesh:SEARTH,M:M4.trs([0,0,0],yaw,0.2,0,0.6)});items.push({mesh:SMOONM,M:M4.trs([-1.05,0.5,0.5],t*0.1,0,0,0.16)});items.push({mesh:P_JUP,M:M4.trs([-14,2,-70],t*0.1,0.12,0,1.8)})}
  if(S==='person'){items.push({mesh:SMARS,M:M4.trs([1.5,0.55,-1.0],t*0.15,0.2,0,0.9)})}
  if(S==='cheat'){items.push({mesh:SEARTH,M:M4.trs([0,0,0],yaw,0.2,0,0.55)});
    if(t<EV.moonis)items.push({mesh:SMOONM,M:M4.trs(MOONPOS,t*0.1,0,0,0.15)});
    else{const k=seg(t,EV.moonis,EV.moonis+0.5);if(k<1)items.push({mesh:UEMIS,M:M4.trs(MOONPOS,0,0,0,0.2+k*1.2),tint:[1,0.9,0.6],tintAmt:1,alpha:1-k,add:1,noShadow:true})}
    if(t>EV.putj-0.3)items.push({mesh:P_JUP,M:M4.trs(cheatJ(t),t*0.12,0.12,0,lerp(2.2,1.6,seg(t,EV.putj,EV.moonis)))})}
  if(S==='tide'){const p=[0,0,0];items.push({mesh:SEARTH,M:M4.trs(p,yaw,0.2,0,0.6)});const k=easeOut(seg(t,EV.k26-0.3,EV.k26+1.2));const sl=1+0.04*Math.sin((t-EV.k26)*5)*k;
    const sx=lerp(0.61,0.88,k)*sl,syz=lerp(0.61,0.56,k);items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,[sx,syz,syz]),tint:[0.25,0.6,1],tintAmt:1,alpha:lerp(0.12,0.42,k),add:1,noShadow:true});
    items.push({mesh:P_JUP,M:M4.trs([-6.2,0.4,-1.0],t*0.1,0.12,0,4.2)})}
  if(S==='orbit'){items.push({mesh:P_JUP,M:M4.trs([0,0,0],t*0.4,0.12,0,1.6)});const a=orbA(t);items.push({mesh:SEARTH,M:M4.trs([Math.cos(a)*4.2,0,Math.sin(a)*4.2],t,0.2,0,0.42)})}
  if(S==='melt'){const hot=seg(t,EV.meltw-0.4,EV.meltw+1.2);if(hot<1)items.push({mesh:SEARTH,M:M4.trs([0,0,0],yaw,0.2,0,1),tint:[1,0.35,0.1],tintAmt:hot*0.8});
    if(hot>0){items.push({mesh:P_LAVA,M:M4.trs([0,0,0],yaw,0.2,0,1.001),alpha:hot<1?Math.max(0.01,hot):null});items.push({mesh:P_LAVAG,M:M4.trs([0,0,0],yaw,0.2,0,1.004),alpha:0.95*hot*(0.75+0.25*Math.sin(t*9)),add:1,noShadow:true})}
    items.push({mesh:P_JUP,M:M4.trs([-7,1.2,-9],t*0.1,0.12,0,5.2)});
    if(t>EV.io-0.4){const k=easeOut(seg(t,EV.io-0.4,EV.io+0.3));items.push({mesh:P_IO,M:M4.trs([1.55,0.55,0.9],t*0.2,0,0,0.42*k)});items.push({mesh:P_IOG,M:M4.trs([1.55,0.55,0.9],t*0.2,0,0,0.425*k),alpha:0.9*(0.7+0.3*Math.sin(t*11)),add:1,noShadow:true})}}
  if(S==='hair'&&t>EV.wait-0.1){const k=seg(t,EV.wait-0.1,EV.wait+0.25);qItems(items,t,cm,{x:-0.55,y:-0.55,s:0.15,d:3,pop:easeOut(k),expr:t>EV.what?'wide':'open'})}
  if(S==='cheat'&&t<EV.cheat+0.9&&t>EV.boring){const k=seg(t,EV.boring,EV.boring+0.25);qItems(items,t,cm,{x:-0.55,y:0.3,s:0.14,d:3,pop:easeOut(k)*(1-seg(t,EV.cheat+0.6,EV.cheat+0.9)),expr:'happy'})}
  return items}
function orbA(t){const k=t-EV.orbit;return 2.2+k*1.9+0.0}
// ---------- overlays ----------
function arrow2(a,b,col,w,al){if(!a||!b||al<=0)return;const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<6)return;const ux=dx/L,uy=dy/L;ctx.save();ctx.globalAlpha=al;ctx.strokeStyle='rgba(0,0,0,0.7)';ctx.lineCap='round';
  ctx.lineWidth=w+6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]-ux*w*1.5,b[1]-uy*w*1.5);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]-ux*w*1.5,b[1]-uy*w*1.5);ctx.stroke();
  const h=w*2.6;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]-ux*h-uy*h*0.6,b[1]-uy*h+ux*h*0.6);ctx.lineTo(b[0]-ux*h+uy*h*0.6,b[1]-uy*h-ux*h*0.6);ctx.closePath();ctx.fill();ctx.restore()}
function glowSph(p,R,a,col,cm){const P=pRad(p,R,cm);if(!P)return;const[c,r]=P;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],r*0.9,c[0],c[1],r*1.3);
  g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(0.25,`rgba(${col},${0.55*a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(c[0]-r*1.5,c[1]-r*1.5,r*3,r*3);ctx.restore()}
function chip(s,y,col,k,x){if(k<=0)return;const p=popS(k);ctx.save();ctx.translate(x||W/2,y);ctx.scale(p,p);ctx.rotate(Math.sin(y)*0.04);ctx.font='900 62px Inter, "Noto Color Emoji"';const w=ctx.measureText(s).width+70;
  ctx.fillStyle='rgba(30,6,16,0.88)';rrect(-w/2,-52,w,104,30);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=5;rrect(-w/2,-52,w,104,30);ctx.stroke();ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,4);ctx.restore()}
function skyDots(t,a){if(a<=0)return;const n=SKYP.length;
  // ecliptic guide line
  const lk=seg(t%EV.loop,0.15,1.0);ctx.save();ctx.globalAlpha=a*0.55;ctx.strokeStyle='#5af0ff';ctx.lineWidth=3;ctx.setLineDash([16,14]);ctx.beginPath();ctx.moveTo(140,1100);ctx.lineTo(lerp(140,900,lk),lerp(1100,560,lk));ctx.stroke();ctx.restore();
  for(let i=0;i<n;i++){const[nm,p,r,col]=SKYP[i];const tw=0.85+0.15*Math.sin(t*3+i*2);glowAt(p,r*12,col,0.6*a*tw);glowAt(p,r*3.2,'255,255,255',0.95*a);star4(p[0],p[1],r*5*tw,a*0.8);
    const lp=nm==='Jupiter'?[p[0]+110,p[1]-55]:nm==='Mars'?[p[0]-70,p[1]-70]:[p[0]+(i%2?-150:150),p[1]+(i%2?-10:30)];tag(nm,lp,'#ffffff',a*0.95)}}
function moonRing(c,r,a){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(c[0],c[1],r,0,TAU2);ctx.stroke();ctx.fillStyle='rgba(230,230,240,0.9)';ctx.beginPath();ctx.arc(c[0],c[1],r,0,TAU2);ctx.fill();ctx.restore()}
function hairCompare(t,k){if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(6,8,26,0.82)';rrect(110,520,860,520,40);ctx.fill();ctx.strokeStyle='rgba(90,240,255,0.5)';ctx.lineWidth=3;rrect(110,520,860,520,40);ctx.stroke();
  ctx.font='800 36px Inter';ctx.fillStyle='rgba(200,230,255,0.9)';ctx.textAlign='center';ctx.fillText('🔬 ZOOMED IN',W/2,580);
  const g=easeOut(seg(t,EV.hair+0.1,EV.hair+0.6));// hair ~0.07 mm -> 140 px ; tide 0.04 mm -> 80 px
  ctx.fillStyle='#8a5a3a';ctx.fillRect(170,650,740*g,140);ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(170,650,740*g,30);
  const g2=easeOut(seg(t,EV.hairw-0.3,EV.hairw+0.2));ctx.fillStyle='#5af0ff';ctx.fillRect(170,860,740*g2,80);
  ctx.font='900 44px Inter, "Noto Color Emoji"';ctx.textAlign='left';ctx.lineWidth=8;ctx.strokeStyle='#000';
  if(g>0.3){ctx.strokeText('💇 one hair ≈ 0.07 mm',190,720);ctx.fillStyle='#fff';ctx.fillText('💇 one hair ≈ 0.07 mm',190,720)}
  if(g2>0.3){ctx.strokeText('🌊 tide: 0.04 mm',190,900);ctx.fillStyle='#fff';ctx.fillText('🌊 tide: 0.04 mm',190,900)}ctx.restore()}
function tideGauge(t,a){if(a<=0)return;const x=880,y0=560,h=560;ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(6,8,26,0.8)';rrect(x-70,y0-40,170,h+80,30);ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=4;
  for(let i=0;i<=10;i++){const y=y0+i*h/10;ctx.beginPath();ctx.moveTo(x-40,y);ctx.lineTo(x+(i%5?-5:20),y);ctx.stroke()}
  const lv=y0+h*0.6-easeOut(seg(t,EV.mm,EV.mm+1.2))*1.2;ctx.fillStyle='rgba(63,156,255,0.75)';ctx.fillRect(x-60,lv,150,y0+h-lv+20);ctx.font='800 28px Inter';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('TIDE',x+15,y0-10);ctx.restore()}
function drawEnd(t){const k=ease((t-EV.end-0.1)/0.4)*clamp((EV.loop-0.25-t)/0.3,0,1);if(k<=0)return;const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.75*k})`);gg.addColorStop(0.42,`rgba(4,4,20,${0.25*k})`);gg.addColorStop(0.6,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;bigLabel([['Which planet should we',-60,76,'#ffffff'],['MOVE NEXT? 🪐👇',50,100,'#ffd84a']],330,t-EV.end-0.1);ctx.restore();
  if(t>EV.follow){ctx.save();ctx.globalAlpha=k*clamp((t-EV.follow)*3,0,1);ctx.textAlign='center';ctx.lineJoin='round';ctx.font='900 54px Inter, "Noto Color Emoji"';ctx.lineWidth=10;ctx.strokeStyle='#000';ctx.strokeText('Follow for more WHAT IFs 🔔',W/2,1580);ctx.fillStyle='#5af0ff';ctx.fillText('Follow for more WHAT IFs 🔔',W/2,1580);ctx.restore()}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  if(NIGHT(S)&&S!=='sky'){const a=S==='hook'?1:S==='end'?1-0.4*seg(tt,EV.end,EV.end+0.5):1;skyDots(tt,a)}
  if(S==='hook'){statCard('🧪 THE WHAT IF LAB','WHAT IF ALL PLANETS LINED UP?','#ffd84a',tt+0.25,300);tag('🔴 HAPPENING NOW · Nov 13–22',[W/2,450],'#ff5a8a',seg(tt,0.5,0.8))}
  if(S==='danger'){glowSph([0,0,0],1,1,'110,210,255',cm);vignette('255,30,70',0.35+0.15*Math.sin(tt*14));statCard('⚠️ QUESTION','IS EARTH IN DANGER?','#ff5a8a',tt-EV.danger+0.05,330);flash(0.5*(1-seg(tt,EV.danger,EV.danger+0.2)))}
  if(S==='net'){glowSph([0,0.15,0],1,0.8,'255,90,120',cm);vignette('255,30,70',0.35);tag('📱 the internet says…',[W/2,260],'#ffffff',seg(tt,EV.net,EV.net+0.3));
    chip('🌊 GIANT TIDES!!',400,'#5af0ff',tt-EV.tides,W/2-60);chip('🌋 EARTHQUAKES!!',530,'#ffb070',tt-EV.quakes,W/2+60);chip('💀 DOOMSDAY!!',660,'#ff5a8a',tt-EV.doom);
    for(const e of[EV.tides,EV.quakes,EV.doom])if(tt>=e)flash(0.35*(1-seg(tt,e,e+0.15)),'255,90,138')}
  if(S==='line'){const s0=prj(linePos(0,tt));if(s0)glowAt(s0,420,'255,200,120',0.55);glowSph(linePos(0,tt),PL[0][3],1.3,'255,190,90',cm);
    if(tt>EV.str-0.1){const a=prj([0,0,PL[0][2]]),b=prj([0,0,PL[8][2]+1.5]);if(a&&b){const k=easeOut(seg(tt,EV.str-0.1,EV.str+0.4));strokePts([a,[lerp(a[0],b[0],k),lerp(a[1],b[1],k)]],'#5af0ff',5,0.9,[22,14])}}
    if(tt>EV.perf){flash(0.6*(1-seg(tt,EV.perf,EV.perf+0.25)));tag('✨ PERFECT LINE-UP',[W/2,330],'#7dff9a',seg(tt,EV.perf,EV.perf+0.3))}
    if(tt>EV.eight){statCard('🪐 PLANETS ALIGNED','8 / 8 ✅','#7dff9a',tt-EV.eight,470)}
    if(tt>EV.perf+0.4&&tt<EV.str)for(let i=1;i<PL.length;i++){const p=prj(V.add(linePos(i,tt),[0,PL[i][3]+0.35,0]));if(p&&p[1]>560&&p[0]>40&&p[0]<W-40&&(i===3||i===5||i===6))tag(PL[i][0],p,'#ffffff',seg(tt,EV.perf+0.4,EV.perf+0.7))}
    if(tt<EV.perf)tag('🧲 lining them up…',[W/2,330],'#9fe8ff',seg(tt,EV.line+0.2,EV.line+0.5))}
  if(S==='res'){glowSph([0,0,0],1,1,'110,210,255',cm);flash(0.4*(1-seg(tt,EV.res,EV.res+0.2)));tideGauge(tt,seg(tt,EV.res+0.6,EV.res+0.9));
    if(tt>EV.mm-0.1)statCard('🌊 OCEAN TIDES RISE BY','0.04 mm 🤏','#ffd84a',tt-EV.mm+0.1,330);else tag('🔬 calculating…',[W/2,330],'#9fe8ff',seg(tt,EV.res+0.2,EV.res+0.5))}
  if(S==='hair'){glowSph([0,0,0],1,0.6,'110,210,255',cm);vignette('0,0,0',0.4);hairCompare(tt,seg(tt,EV.hair,EV.hair+0.25));if(tt>EV.what)flash(0.4*(1-seg(tt,EV.what,EV.what+0.25)),'90,240,255');
    if(tt>EV.what-0.1)statCard('🤯 PLANET POWER','THINNER THAN A HAIR','#7dff9a',tt-EV.what+0.1,330)}
  if(S==='far'){flash(0.4*(1-seg(tt,EV.far,EV.far+0.2)));const e=prj([0,0,0]),m=prj([-1.05,0.5,0.5]),j=prj([-14,2,-70]);
    if(e&&m)strokePts([e,m],'#ffffff',4,0.8*seg(tt,EV.far+0.4,EV.far+0.8),[12,10]);if(e&&j)strokePts([e,j],'#ffd84a',4,0.8*seg(tt,EV.far+0.9,EV.far+1.3),[12,10]);
    if(m)tag('🌕 Moon: 384,000 km',[clamp(m[0],260,W-260),m[1]-70],'#ffffff',seg(tt,EV.far+0.4,EV.far+0.8));if(j)tag('🪐 Jupiter: 590–970 million km',[clamp(j[0],300,W-300),j[1]-80],'#ffd84a',seg(tt,EV.far+0.9,EV.far+1.3));
    if(tt>EV.lakh-0.1)statCard("🌕 MOON'S TIDAL PULL",'100,000× JUPITER\'S 💪','#ffd84a',tt-EV.lakh+0.1,330);else if(tt>EV.moonp)tag('⚔️ TIDAL TUG-OF-WAR',[W/2,330],'#9fe8ff',seg(tt,EV.moonp,EV.moonp+0.3))}
  if(S==='person'){flash(0.4*(1-seg(tt,EV.person,EV.person+0.2)));const mp=prj([1.5,0.55,-1.0]);const pk=seg(tt,EV.person+0.5,EV.person+0.9);const px=230,py=880;
    glowAt([px,py],170,'255,216,74',0.4*pk);emojiAt('🧍',px,py,200,pk);tag('🧍 1 m away',[px,py+150],'#ffd84a',pk);
    if(mp)tag('🔴 Mars: 100+ million km',[clamp(mp[0],300,W-300),mp[1]+260],'#ffb070',seg(tt,EV.person+0.9,EV.person+1.2));
    if(tt>EV.pulls){const k=seg(tt,EV.pulls,EV.pulls+0.4);arrow2([px+120,py-140],[px+280,py-140],'#ffd84a',26,k);if(mp)arrow2([mp[0]-170,mp[1]-280],[mp[0]-230,mp[1]-280],'#ffb070',8,k)}
    if(tt>EV.mars-0.1)statCard('🧲 GRAVITY ON YOU','PERSON > MARS 😳','#7dff9a',tt-EV.mars+0.1,330)}
  if(S==='cheat'){if(tt<EV.cheat)statCard('😴 VERDICT','BORING','#9fe8ff',tt-EV.boring,330);else statCard('😈 CHEAT MODE','JUPITER → MOON\'S SPOT','#ff5a8a',tt-EV.cheat,330);
    if(tt>EV.cheat){flash(0.45*(1-seg(tt,EV.cheat,EV.cheat+0.2)),'255,90,138');vignette('255,40,90',0.25)}const m=prj(MOONPOS);if(m&&tt<EV.moonis)tag('🌕 Moon',[m[0],m[1]-70],'#ffffff',seg(tt,EV.boring+0.2,EV.boring+0.5));
    if(tt>EV.putj-0.3&&tt<EV.moonis+0.2){const j=prj(cheatJ(tt));if(j)glowAt(j,200,'255,200,140',0.5)}if(tt>EV.moonis)flash(0.7*(1-seg(tt,EV.moonis,EV.moonis+0.3)),'255,230,200')}
  if(S==='sky'){flash(0.5*(1-seg(tt,EV.sky,EV.sky+0.25)));const k=easeOut(seg(tt,EV.sky,EV.sky+1.6));const jc=prj([-1,lerp(-6,14,k),-70]);const P=jc?pRad([-1,lerp(-6,14,k),-70],13,cm):null;
    if(P){glowAt(P[0],P[1]*1.25,'255,210,160',0.25)}
    if(tt>EV.forty-0.1&&P){const mr=P[1]/41;const mc=[W-170,P[0][1]+P[1]*0.2];moonRing(mc,Math.max(mr,4),seg(tt,EV.forty,EV.forty+0.3));tag('🌕 the Moon (same scale)',[W-250,mc[1]+60],'#ffffff',seg(tt,EV.forty,EV.forty+0.3))}
    if(tt>EV.forty-0.1)statCard('🪐 JUPITER IN YOUR SKY','40× WIDER THAN THE MOON','#ffd84a',tt-EV.forty+0.1,330);else tag('🪐 JUPITER-RISE…',[W/2,330],'#ffd84a',seg(tt,EV.sky+0.3,EV.sky+0.6))}
  if(S==='tide'){glowSph([0,0,0],0.6,0.8,'110,210,255',cm);flash(0.4*(1-seg(tt,EV.tide,EV.tide+0.2)));const e=prj([0,0,0]);const k=easeOut(seg(tt,EV.k26-0.3,EV.k26+1.2));
    if(e&&k>0){const l=prj([-0.9,0,0]),r=prj([0.9,0,0]);if(l)arrow2(e,l,'#5af0ff',12,k*0.9);if(r)arrow2(e,r,'#5af0ff',12,k*0.9)}
    if(tt>EV.k26-0.1)statCard('🌊 TIDES','26,000× STRONGER','#ff5a8a',tt-EV.k26+0.1,330);else tag('🌊 tides?',[W/2,330],'#9fe8ff',seg(tt,EV.tide+0.2,EV.tide+0.5));
    if(tt>EV.km)tag('🌊 tides could be KILOMETERS high',[W/2,1480],'#ffd84a',seg(tt,EV.km,EV.km+0.3));if(tt>EV.k26)vignette('20,80,200',0.25)}
  if(S==='orbit'){flash(0.4*(1-seg(tt,EV.orbit,EV.orbit+0.2)));const P=[];for(let q=0;q<=40;q++){const a=orbA(tt)-q*0.06;P.push(prj([Math.cos(a)*4.2,0,Math.sin(a)*4.2]))}strokePts(P,'#5af0ff',8,0.85);
    const R=[];for(let q=0;q<=96;q++){const a=q/96*TAU2;R.push(prj([Math.cos(a)*4.2,0,Math.sin(a)*4.2]))}strokePts(R,'#ffffff',2,0.3,[10,12]);
    const ea=orbA(tt);const ep=prj([Math.cos(ea)*4.2,0,Math.sin(ea)*4.2]);if(ep)glowAt(ep,90,'110,210,255',0.6);
    tag('🌍 Earth = Jupiter\'s new moon',[W/2,1480],'#ffffff',seg(tt,EV.orbit+0.3,EV.orbit+0.6));if(tt>EV.day-0.1)statCard('⏱️ ONE ORBIT','≈ 1.5 DAYS 🌀','#ffd84a',tt-EV.day+0.1,330)}
  if(S==='melt'){const hot=seg(tt,EV.meltw-0.4,EV.meltw+1.2);glowSph([0,0,0],1,1-hot,'110,210,255',cm);glowSph([0,0,0],1,hot*1.2,'255,120,40',cm);flash(0.4*(1-seg(tt,EV.melt,EV.melt+0.2)));
    if(tt<EV.meltw)tag('🤏 SQUEEZE… SQUEEZE…',[W/2,330],'#ffb070',seg(tt,EV.melt+0.2,EV.melt+0.5));
    if(tt>EV.meltw&&tt<EV.io-0.2)statCard('🔥 TIDAL HEATING','EARTH COULD MELT','#ff5a8a',tt-EV.meltw,330);
    if(tt>EV.io-0.2){const ip=prj([1.55,0.55,0.9]);if(ip){glowAt(ip,140,'255,200,80',0.4);tag('Io 🌋',[ip[0],ip[1]-120],'#ffd84a',seg(tt,EV.io,EV.io+0.3))}
      if(tt>EV.volc-0.1)statCard('🌋 IO: MOST VOLCANIC WORLD','~400 ACTIVE VOLCANOES','#ffd84a',tt-EV.volc+0.1,330);if(tt>EV.volc+0.6)tag('Io orbits Jupiter ≈ the Moon\'s distance from us',[W/2,1480],'#9fe8ff',seg(tt,EV.volc+0.6,EV.volc+0.9))}}
  if(S==='relax'){flash(0.4*(1-seg(tt,EV.relax,EV.relax+0.2)),'125,255,154');if(tt>EV.harm-0.1)statCard('✅ PLANET PARADES','HARMLESS','#7dff9a',tt-EV.harm+0.1,330);else tag('😌 relax…',[W/2,330],'#7dff9a',seg(tt,EV.relax+0.2,EV.relax+0.5));
    if(tt>EV.faraway)tag('🪐 just keep Jupiter FAR away 😅',[W/2,470],'#ffd84a',seg(tt,EV.faraway,EV.faraway+0.3))}
  if(S==='end'){drawEnd(tt)}
  caption(tt)}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const S=scn(tt);if(!NIGHT(S)&&S!=='sky')items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.02,far:3000},{center:[0,-9999,0],radius:1},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.tides,8,0.3);S(EV.quakes,10,0.4);S(EV.doom,14,0.5);S(EV.perf,10,0.5);S(EV.what,6,0.4);
  S(EV.moonis,16,0.7);S(EV.k26,10,0.6);if(t>EV.meltw&&t<EV.io)a+=3+2*Math.sin(t*5);return a}
