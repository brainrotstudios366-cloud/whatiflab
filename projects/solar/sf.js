// ===================== SOLAR STORM vs ONE DYING ANT =====================
// ---------- new meshes ----------
// unlit (glass-material) sphere: unfogged, tintable -> sun, halos, plasma (use add:1)
const GSPH=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.glass,1,[16,24]));
const SUNG=um(m=>sphC(m,[0,0,0],1,p=>{const n=vnoise(p[0]*6+2,p[1]*6+p[2]*3);return mix3([1,0.55,0.12],[1,0.9,0.55],clamp(0.2+n*0.9,0,1))},[24,36],MAT.glass));
// tube along a polyline
function tubeP(m,pts,rf,colF,mat,seg){seg=seg||8;let prevRing=null;for(let i=0;i<pts.length;i++){const p=pts[i];const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)];const d=V.norm(V.sub(b,a));const tmp=Math.abs(d[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(d,tmp)),y=V.cross(x,d);const f=i/(pts.length-1);const r=rf(f);
  const ring=[];for(let j=0;j<seg;j++){const an=j/seg*TAU2;ring.push(V.add(p,V.add(V.sc(x,Math.cos(an)*r),V.sc(y,Math.sin(an)*r))))}
  if(prevRing){const c0=colF((i-1)/(pts.length-1)),c1=colF(f);for(let j=0;j<seg;j++){const j1=(j+1)%seg;m.quad(prevRing[j],ring[j],ring[j1],prevRing[j1],[c0,c1,c1,c0],mat)}}prevRing=ring}}
// flare loop: arch in XY plane from (-1,0) to (1,0), height 1.25
const FLOOP=um(m=>{const pts=[];for(let i=0;i<=40;i++){const a=Math.PI*(1-i/40);pts.push([Math.cos(a),Math.sin(a)*1.25,0.05*Math.sin(a*3)])}
  tubeP(m,pts,f=>0.12+0.07*Math.sin(f*Math.PI),f=>mix3([1,0.55,0.15],[1,0.95,0.6],Math.sin(f*Math.PI)),MAT.glass,10)});
// magnetic field line (dipole-ish arc), XY plane, from (-1,0) to (1,0)
const FLINE=um(m=>{const pts=[];for(let i=0;i<=60;i++){const a=Math.PI*(1-i/60);pts.push([Math.cos(a),Math.pow(Math.sin(a),1.4)*0.75,0])}
  tubeP(m,pts,f=>0.02,f=>[1,1,1],MAT.glass,6)});
// cone (apex at origin, base at y=-1 radius 1) for the sunbeam
const BCONE=um(m=>{const s=28;for(let i=0;i<s;i++){const a=i/s*TAU2,b=(i+1)/s*TAU2;m.tri([0,0,0],[Math.cos(a),-1,Math.sin(a)],[Math.cos(b),-1,Math.sin(b)],[1,1,1],MAT.glass)}});
// magnifying glass (lens in XY plane, handle down -y)
const MAG_RIM=um(m=>{const pts=[];for(let i=0;i<=64;i++){const a=i/64*TAU2;pts.push([Math.cos(a),Math.sin(a),0])}tubeP(m,pts,f=>0.075,f=>hx('#d8b048'),0,10);
  m.prism([0,-2.35,0],0.13,0.11,1.25,14,hx('#2a1a14'));m.prism([0,-1.15,0],0.12,0.12,0.25,14,hx('#d8b048'));m.ico([0,-2.38,0],0.13,hx('#2a1a14'),0,1,[6,8])},0.5);
const MAG_LENS=um(m=>sphC(m,[0,0,0],0.97,p=>[0.75,0.9,1],[14,22],MAT.glass,1));
// sparks: short streak
const SPARK=um(m=>m.box([0,0,0],[0.06,0.06,1],[1,1,1],MAT.glass));
// ---------- background world: power line + village ----------
const SF_POLES=[];for(let i=-5;i<=5;i++)SF_POLES.push([i*28+8,0,38+Math.sin(i*1.3)*1.5]);
const TRANS_P=[SF_POLES[4][0],7.4,SF_POLES[4][2]];
function poleGeo(m,x,z,tel){m.prism([x,0,z],0.17,0.12,9.5,8,hx('#5a4030'));m.box([x,8.9,z],[3.0,0.18,0.2],hx('#4a3428'));for(const s of[-1.3,0,1.3])m.box([x+s,9.1,z],[0.1,0.25,0.1],hx('#c8c8c0'))}
let SF_BG,SF_LAMP=[],SF_WIN=[];{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#6a9850'));const r=rngG(55);
  for(let i=0;i<240;i++){const a=r()*TAU2,d=260+r()*3600;const tx=Math.cos(a)*d,tz=Math.sin(a)*d;if(tz>0&&Math.abs(tx+0.3*tz)<tz*0.75&&d<2200)continue;tree(m,Math.cos(a)*d,Math.sin(a)*d,5+r()*5,0,r()<0.45?'pine':'')}
  for(let i=0;i<14;i++){const sd=i<7?-1:1;const x=sd*(45+r()*60),z=60+r()*90;tree(m,x,z,3+r()*3,0,r()<0.5?'pine':'')}
  for(const p of SF_POLES)poleGeo(m,p[0],p[2]);
  // wires (slight sag, 3 per span)
  for(let i=0;i<SF_POLES.length-1;i++){const a=SF_POLES[i],b=SF_POLES[i+1];for(const s of[-1.3,0,1.3]){const pts=[];for(let k=0;k<=8;k++){const f=k/8;pts.push([lerp(a[0],b[0],f)+s,9.2-1.1*Math.sin(f*Math.PI),lerp(a[2],b[2],f)])}tubeP(m,pts,()=>0.035,()=>[0.12,0.12,0.13],0,4)}}
  // transformer can on one pole
  m.prism([TRANS_P[0],6.6,TRANS_P[2]-0.45],0.42,0.42,1.4,14,hx('#8a9098'));m.prism([TRANS_P[0],8.0,TRANS_P[2]-0.45],0.44,0.3,0.12,14,hx('#6a7078'));
  // village houses
  for(let i=0;i<11;i++){const x=-180+i*36+(r()-0.5)*12,z=190+r()*90,w=8+r()*4,d=7+r()*3,h=4.5+r()*2;house(m,x,z,w,d,h,hx(['#c8b8a0','#a88a70','#d8d0c0','#9a7a60'][i%4]),hx(['#7a3a2a','#4a4a5a','#6a3020'][i%3]),(r()-0.5)*0.4);
    for(const wx of[-0.25,0.25])SF_WIN.push([x+wx*w,h*0.45,z-d/2-0.08])}
  SF_BG=m.build(0.5)}
const SF_WINM=um(m=>{for(const p of SF_WIN)m.box(p,[1.3,1.3,0.1],[1,1,1],MAT.glass)});
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={h0:0.3,loop1:4.0,fl1:6.4,res1:9.8,
  cme2:14.6,shield2:19.2,res2:20.4,dusk2:21.8,
  aur3:24.6,spark3:27.0,boom3:28.6,res3:30.6,
  aur4:35.9,snap4:38.8,land4:39.4,res4:42.4,
  dot5:48.6,look5:50.4,hit5:53.0,fall5:53.6,res5:54.0,loop:65.5};
const ROUNDS=[['ROUND 1','X-CLASS SOLAR FLARE ☀️','Not even a sunburn 😎',EV.res1],['ROUND 2','CME: A PLASMA CLOUD ☄️','Deflected. Rude. 🧲',EV.res2],['ROUND 3','GEOMAGNETIC STORM ⚡','Blackout. Ant: unbothered 💅',EV.res3],['ROUND 4','CARRINGTON EVENT 1859 🔥','Front-row seats 🍿',EV.res4],['FINAL ROUND','ONE sunbeam ☀️','Cause of death: ONE sunbeam 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function sfSpd(t){if(t<R[0])return 1;if(t<R[1])return t<EV.loop1+1.2?1:(t>=EV.res1+1.0?1:0);if(t<R[2])return t<EV.cme2+1.6?0.9:0;
  if(t<R[3])return t<EV.spark3-0.3?0.9:(t>=EV.res3+1.2?0.8:0);if(t<R[4])return t<EV.snap4-0.2?0.8:0;if(t<R[5])return t<EV.look5?0.75:0;return 0}
const SF_DT=1/120,SF_TAB=[0];for(let i=1;i<=DUR/SF_DT+10;i++){const tm=(i-0.5)*SF_DT;SF_TAB.push(SF_TAB[i-1]+sfSpd(tm)*SF_DT*1.1)}
function sfD(t){t=clamp(t,0,DUR+0.05);const f=t/SF_DT,i=Math.floor(f);return lerp(SF_TAB[i],SF_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const SUNDIR=V.norm([-0.3,0.15,1]),SUNDIR5=V.norm([0.42,0.1,1]);
const E_DAY=envBase({sun:SUNDIR,sunCol:hx('#ffd8a8'),sky:hx('#7aa0d8'),zen:hx('#173a90'),hor:hx('#d89a78'),fog:hx('#b8a8a8'),fogD:7000,gnd:hx('#6a7a58'),gndCol:hx('#a89888'),sunSize:0.6});
const E_FLASH=envBase({sun:SUNDIR,sunCol:hx('#ffffff'),sky:hx('#fff4e0'),zen:hx('#ffe8c0'),hor:hx('#ffffff'),fog:hx('#fff0dc'),fogD:7000,gnd:hx('#d0c8b0'),gndCol:hx('#fff0dc'),sunSize:8});
const E_CME=envBase({sun:SUNDIR,sunCol:hx('#ffc0a0'),sky:hx('#c090b0'),zen:hx('#4a2a78'),hor:hx('#ff9a80'),fog:hx('#d8a0a0'),fogD:7000,gnd:hx('#7a6a70'),gndCol:hx('#c8a0a0'),sunSize:2.5});
const E_DUSK=envBase({sun:V.norm([-0.3,-0.02,1]),sunCol:hx('#ff9a60'),sky:hx('#6a5a9a'),zen:hx('#141a4a'),hor:hx('#ff8a50'),fog:hx('#8a6a8a'),fogD:6000,gnd:hx('#3a3a48'),gndCol:hx('#5a4a60'),stars:0.3,night:0.5});
const E_NIGHT=envBase({sun:V.norm([0.3,0.25,-0.6]),sunCol:hx('#6a88b8'),sky:hx('#0e1a38'),gnd:hx('#1e2a30'),fog:hx('#0e2030'),fogD:6000,zen:hx('#03050f'),hor:hx('#1a5a4a'),gndCol:hx('#0e2030'),stars:1,night:1});
const E_RED=envBase({sun:V.norm([0.3,0.25,-0.6]),sunCol:hx('#c07090'),sky:hx('#3a1430'),gnd:hx('#2a1a28'),fog:hx('#3a1428'),fogD:6000,zen:hx('#0a0418'),hor:hx('#c02a4a'),gndCol:hx('#2a1020'),stars:0.8,night:1});
const E_DAWN=envBase({sun:SUNDIR5,sunCol:hx('#ffe0b0'),sky:hx('#9ab8e0'),zen:hx('#3a68c0'),hor:hx('#ffcf9a'),fog:hx('#e0d0c0'),fogD:7000,gnd:hx('#7a8060'),gndCol:hx('#d8c8a8'),sunSize:2.5});
function flashK(t){const k=t-EV.fl1;if(k<-0.25||k>2.2)return 0;return k<0?ease((k+0.25)/0.25):1-ease(k/2.2)}
function envAt(t){const rn=roundAt(t);let e=E_DAY;
  if(t<R[1]){const h=t-EV.h0;if(h>0&&h<0.8)e=mixEnv(E_DAY,E_FLASH,0.7*(1-h/0.8));const f=flashK(t);if(f>0)e=mixEnv(E_DAY,E_FLASH,f)}
  else if(rn===1){const c=ease((t-EV.cme2)/2.5);e=mixEnv(E_DAY,E_CME,c*(1-0.5*ease((t-EV.shield2-0.3)/0.8)));if(t>=EV.dusk2)e=mixEnv(e,E_DUSK,ease((t-EV.dusk2)/2.4))}
  else if(rn===2){e=mixEnv(E_DUSK,E_NIGHT,ease((t-R[2])/0.8));const b=t-EV.boom3;if(b>0&&b<0.7)e=mixEnv(e,envBase({sunCol:hx('#c0e0ff'),sky:hx('#a0c8ff'),zen:hx('#2a4a8a'),hor:hx('#c0e0ff'),fog:hx('#6a8ab8'),fogD:6000,gnd:hx('#6a7a9a'),gndCol:hx('#4a6a9a'),sun:E_NIGHT.sun,stars:0,night:1}),0.8*(1-b/0.7))}
  else if(rn===3){e=mixEnv(E_NIGHT,E_RED,ease((t-EV.aur4)/2.5));const b=t-EV.land4;if(b>0&&b<0.5)e=mixEnv(e,envBase({sun:E_NIGHT.sun,sunCol:hx('#d0e8ff'),sky:hx('#8ab0ff'),zen:hx('#203060'),hor:hx('#a0c0ff'),fog:hx('#405080'),fogD:6000,gnd:hx('#5a6a8a'),gndCol:hx('#405080'),night:1}),0.6*(1-b/0.5))}
  else if(rn>=4){e=mixEnv(E_RED,E_DAWN,ease((t-R[4])/1.2))}
  return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.8+k*0.1,-3.5-k*0.4];at=[0,0.95,0.4]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.2,1.5,k)+sway*0.2,lerp(0.9,0.55,k),lerp(-3.9,-3.4,k)];at=[0,lerp(0.95,1.1,k),0.4];
    if(t>=EV.res1){const kk=ease((t-EV.res1)/0.8);eye=[lerp(eye[0],1.4,kk),lerp(eye[1],0.95,kk),lerp(eye[2],-2.9,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.7,kk),lerp(at[2],0.2,kk)]}}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.6,1.1,k)+sway*0.2,lerp(1.0,0.45,k),lerp(-3.4,-4.2,k)];at=[lerp(0,-0.3,k),lerp(0.7,1.35,k),lerp(0.3,1.0,k)];
    if(t>=EV.res2){const kk=ease((t-EV.res2)/0.9);eye=[lerp(eye[0],1.75,kk),lerp(eye[1],1.0,kk),lerp(eye[2],-3.6,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.75,kk),lerp(at[2],0.4,kk)]}}
  if(rn===2){const k=ease((t-R[2])/1.4);eye=[lerp(1.75,2.2,k)+sway*0.2,lerp(1.0,0.7,k),lerp(-3.6,-4.4,k)];at=[lerp(0,0.4,k),lerp(0.75,1.2,k),lerp(0.4,1.2,k)];
    if(t>=EV.res3){const kk=ease((t-EV.res3)/0.9);eye=[lerp(eye[0],1.6,kk),lerp(eye[1],0.95,kk),lerp(eye[2],-3.2,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.7,kk),lerp(at[2],0.3,kk)]}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[lerp(1.6,-1.6,k)+sway*0.2,lerp(0.95,0.6,k),lerp(-3.2,-3.8,k)];at=[lerp(0,0.2,k),lerp(0.7,1.3,k),lerp(0.3,0.9,k)];
    if(t>=EV.snap4+0.2){const kk=ease((t-EV.snap4-0.2)/0.8);eye=[lerp(eye[0],-1.3,kk),lerp(eye[1],0.85,kk),lerp(eye[2],-3.3,kk)];at=[lerp(at[0],0.4,kk),lerp(at[1],0.6,kk),lerp(at[2],0.2,kk)]}
    if(t>=EV.res4){const kk=ease((t-EV.res4)/1.0);eye=[lerp(eye[0],-1.5,kk),lerp(eye[1],0.8,kk),lerp(eye[2],-3.2,kk)];at=[lerp(at[0],-0.1,kk),lerp(at[1],0.85,kk),lerp(at[2],0.5,kk)]}}
  if(rn===4){const k=ease((t-R[4])/1.0);eye=[lerp(-1.5,1.9,k)+sway*0.3,lerp(0.8,1.1,k),lerp(-3.2,-3.9,k)];at=[lerp(-0.1,0.3,k),lerp(0.85,0.6,k),lerp(0.5,0.2,k)];
    if(t>=EV.look5-0.3){const kk=ease((t-EV.look5+0.3)/1.0);eye=V.add(eye,[-0.5*kk,0.1*kk,1.4*kk]);at=V.add(at,[-0.2*kk,0.1*kk,-0.2*kk])}
    if(t>=EV.hit5-0.3){const kk=ease((t-EV.hit5+0.3)/0.9);eye=[lerp(eye[0],1.1,kk),lerp(eye[1],1.4,kk),lerp(eye[2],-3.1,kk)];at=[lerp(at[0],-0.2,kk),lerp(at[1],0.4,kk),lerp(at[2],0,kk)]}}
  if(t>=R[5])eye=[1.1,1.4,-3.1],at=[-0.2,0.4,0];
  return{eye,at}}
// ---------- background ----------
let BGPTS=[];
function bgItems(t){BGPTS=[];const items=[{mesh:SF_BG}];const rn=roundAt(t);const cam=camAt(t);const dir=V.norm([cam.at[0]-cam.eye[0],0,cam.at[2]-cam.eye[2]]);const side=[dir[2],0,-dir[0]];
  const P=(d,s,y)=>[dir[0]*d+side[0]*s,y||0,dir[2]*d+side[2]*s];
  const night=rn===2||rn===3;const out=t>=EV.boom3&&rn>=2&&rn<4;
  // village windows + street lamps on the poles
  if(rn>=1&&rn<=3&&!out){const a=rn===1?ease((t-EV.dusk2)/2):1;if(a>0.01){items.push({mesh:SF_WINM,M:M4.id(),tint:[1,0.8,0.45],tintAmt:1,alpha:a,add:1,noShadow:true});for(let i=0;i<SF_WIN.length;i+=2)BGPTS.push({p:SF_WIN[i],c:'255,200,120',r:5,a:0.35*a})}}
  if(rn>=1&&rn<=3){const a=rn===1?ease((t-EV.dusk2)/2):1;const fl=t>=EV.spark3&&t<EV.boom3?(hsh(Math.floor(t*14),3)<0.4?0.15:1):1;if(a>0.01&&!out)for(const p of SF_POLES){const q=[p[0]+1.6,8.4,p[2]-0.3];items.push({mesh:GSPH,M:M4.trs(q,0,0,0,0.28),tint:[1,0.85,0.55],tintAmt:1,alpha:a*fl,add:1,noShadow:true});BGPTS.push({p:q,c:'255,210,140',r:9,a:0.5*a*fl})}}
  // sun
  if(rn<=1||t<R[0]){const sp=V.sc(SUNDIR,30000);const fk=flashK(t);const pul=1+0.02*Math.sin(t*3);const RS=3200;items.push({mesh:SUNG,M:M4.trs(sp,t*0.05,0,0,RS*pul*(1+0.15*fk))});
    BGPTS.push({p:sp,c:'255,190,110',r:9000*(1+2*fk),a:0.6,sun:1});
    // flare loops (R1)
    const lk=rn===0?ease((t-EV.loop1)/1.6):(t<R[0]?0:0.6*(1-ease((t-R[1])/2)));
    if(lk>0.01){const LP=[[-0.55,0.62,0.9,0.3],[0.25,0.88,0.7,-0.2],[-0.2,0.95,0.55,0.15]];for(let i=0;i<LP.length;i++){const [lx,ly,s,rz]=LP[i];const c=V.add(sp,[lx*RS,ly*RS,-RS*1.1]);const gg=lk*(1+0.08*Math.sin(t*5+i));
      items.push({mesh:FLOOP,M:M4.trs(c,0,0,rz+Math.atan2(lx,ly)*-0.9,[s*RS*0.6*gg,s*RS*0.6*gg,s*RS*0.6]),tint:null,tintAmt:0,alpha:1,noShadow:true});BGPTS.push({p:V.add(c,[0,s*RS*0.45*gg,0]),c:'255,150,60',r:4000*s,a:0.45*lk})}}
    if(t>=EV.fl1-0.25&&t<EV.fl1+1.5){const k=t-EV.fl1;const s=Math.max(0,1-Math.abs(k)/1.5);BGPTS.push({p:V.add(sp,[-500,1300,-1600]),c:'255,255,230',r:14000*s,a:0.9*s})}
    // CME (R2): expanding plasma cloud travelling toward us
    if(rn===1&&t>=EV.cme2&&t<EV.shield2+1.6){const k=clamp((t-EV.cme2)/(EV.shield2-EV.cme2),0,1);const kk=Math.pow(k,1.6);const dist=lerp(28000,900,kk);const cen=V.sc(SUNDIR,dist);const rad=lerp(1600,9000,kk);const fade=t<EV.shield2?1:1-ease((t-EV.shield2)/1.4);
      for(let i=0;i<46;i++){const a=hsh(i,1)*TAU2,rr=Math.sqrt(hsh(i,2));const off=[Math.cos(a)*rr*rad,Math.sin(a)*rr*rad*0.8+rad*0.15,(hsh(i,3)-0.5)*rad*0.4];
        let p=V.add(cen,off);if(t>=EV.shield2){const q=t-EV.shield2;p=V.add(p,[Math.cos(a)*q*rad*1.3,Math.abs(Math.sin(a))*q*rad*0.6,-q*400])}
        const col=mix3([1,0.35,0.55],[1,0.75,0.35],hsh(i,4));items.push({mesh:GSPH,M:M4.trs(p,0,0,0,rad*(0.18+0.22*hsh(i,5))),tint:col,tintAmt:1,alpha:0.16*fade,add:1,noShadow:true})}
      BGPTS.push({p:cen,c:'255,120,150',r:rad*2.6,a:0.45*fade})}}
  // magnetosphere: cyan field lines (R2 impact)
  if(rn===1&&t>=EV.shield2-0.15&&t<EV.res2+2.5){const k=t-EV.shield2;const a=(k<0?ease((k+0.15)/0.15):1)*(1-ease((t-EV.res2-1.5)/1.0));const ang=Math.atan2(dir[0],dir[2]);
    for(let i=0;i<7;i++){const s=(260+i*110)*(1+0.03*Math.sin(t*4+i));const p=P(1400,(i-3)*40,-20);items.push({mesh:FLINE,M:M4.trs(p,ang+(i-3)*0.08,0,0,[s*1.4,s,s]),tint:[0.35,0.95,1],tintAmt:1,alpha:a*(0.6+0.4*Math.sin(t*9+i)),add:1,noShadow:true})}
    BGPTS.push({p:P(1500,0,500),c:'90,240,255',r:4200,a:0.35*a,cap:1400})}
  // aurora (R3 green, R4 big + red)
  if(rn===2||rn===3){const a=rn===2?ease((t-EV.aur3)/1.8):1;const red=rn===3?ease((t-EV.aur4)/2.5):0;const n=rn===3?5:3;
    for(let i=0;i<n;i++){const d=3000+i*1500,sd=(i-(n-1)/2)*1100;const p=P(d,sd,(600+i*220)*(1-red*0.6));const ang=Math.atan2(dir[0],dir[2]);const wob=Math.sin(t*0.9+i*2)*0.25;
      items.push({mesh:AUR[i%3],M:M4.trs(p,ang+wob*0.2,0,0,[5200+i*1500,(1500+i*500)*(0.85+0.15*Math.sin(t*1.7+i))*(1+red*0.9),900]),tint:red>0?mix3([0.3,1,0.55],[1,0.2,0.4],red*(i%2?1:0.7)):null,tintAmt:red>0?red*0.75:0,alpha:a*(rn===3?0.62:1)*(0.75+0.25*Math.sin(t*3.1+i*1.3)),add:1,noShadow:true})}}
  // transformer sparks + explosion (R3)
  if(rn===2&&t>=EV.spark3-0.2&&t<EV.boom3+2.5){const tp=[TRANS_P[0],8.1,TRANS_P[2]-0.45];
    if(t<EV.boom3){const on=hsh(Math.floor(t*20),7)<0.55;if(on){BGPTS.push({p:tp,c:'150,210,255',r:22,a:0.9});for(let i=0;i<6;i++){const d=V.norm([hsh(i,Math.floor(t*20))-0.5,hsh(i+9,Math.floor(t*20))-0.2,hsh(i+3,Math.floor(t*20))-0.5]);items.push({mesh:SPARK,M:M4.mul(M4.trs(V.add(tp,V.sc(d,0.8)),Math.atan2(d[0],d[2]),-Math.asin(d[1]),0,1),M4.trs([0,0,0],0,0,0,[1,1,1.2])),tint:[0.75,0.9,1],tintAmt:1,alpha:1,add:1,noShadow:true})}}}
    else{const k=t-EV.boom3;items.push({mesh:GSPH,M:M4.trs(tp,0,0,0,0.6+easeOut(k/0.4)*3.5),tint:mix3([0.8,0.9,1],[1,0.5,0.15],clamp(k/0.6,0,1)),tintAmt:1,alpha:Math.max(0,0.9*(1-k/0.9)),add:1,noShadow:true});
      BGPTS.push({p:tp,c:'170,220,255',r:160*(1-k/2.5),a:0.9*(1-k/2.5)});
      for(let i=0;i<30;i++){const d=V.norm([hsh(i,1)-0.5,hsh(i,2)-0.2,hsh(i,3)-0.5]);const v=8+hsh(i,4)*10;const q=V.add(tp,[d[0]*v*k,d[1]*v*k-4.9*k*k,d[2]*v*k]);if(q[1]<0)continue;items.push({mesh:GSPH,M:M4.trs(q,0,0,0,0.12),tint:[1,0.75,0.35],tintAmt:1,alpha:1-k/2.5,add:1,noShadow:true})}
      if(k<2.5)for(let i=0;i<5;i++){const q=V.add(tp,[Math.sin(i*2)*0.6,0.5+k*(1.5+i*0.5),0]);items.push({mesh:USPH,M:M4.trs(q,0,0,0,0.6+k*0.9),tint:[0.15,0.14,0.16],tintAmt:1,alpha:Math.max(0,0.6*(1-k/2.5)),noShadow:true})}}}
  // dawn sun (FINAL)
  if(rn>=4){const sp=V.sc(SUNDIR5,30000);items.push({mesh:SUNG,M:M4.trs(sp,0,0,0,1300)});BGPTS.push({p:sp,c:'255,215,150',r:6000,a:0.7*ease((t-R[4])/1.2),sun:1})}
  return{items,dir,side}}
// ---------- foreground ----------
let LASTVP=null,QPTS=[],DOTP=null,SFLASH=0;
const MAG_Z0=-0.55;const magZ=t=>MAG_Z0+(sfD(t)-sfD(EV.look5));
function sparkBurst(items,p,t,n,seed,sc){for(let i=0;i<n;i++){const ph=((t*3.2+hsh(i,seed))%1);const d=V.norm([hsh(i,seed+1)-0.5,0.4+hsh(i,seed+2),hsh(i,seed+3)-0.5]);const v=(1.5+hsh(i,seed+4)*2.5)*sc;
  const q=[p[0]+d[0]*v*ph,p[1]+d[1]*v*ph-4.9*ph*ph*sc,p[2]+d[2]*v*ph];if(q[1]<0)continue;const vel=V.norm([d[0],d[1]-9.8*ph/v,d[2]]);
  items.push({mesh:SPARK,M:M4.mul(M4.trs(q,Math.atan2(vel[0],vel[2]),-Math.asin(clamp(vel[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[0.35*sc,0.35*sc,1.6*sc*(1-ph)])),tint:mix3([1,1,0.85],[1,0.55,0.15],ph),tintAmt:1,alpha:1-ph,add:1,noShadow:true})}}
function puff(items,p,k,n,sc,col){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);if(k<0||k>1.4)continue;const d=easeOut(k/1.0)*sc;items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1+k*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+k*0.25)*sc),tint:col||[0.72,0.68,0.6],tintAmt:1,alpha:Math.max(0,0.7*(1-k/1.4)),noShadow:true})}}
function fgItems(t){QPTS=[];DOTP=null;const rn=roundAt(t);const items=[];const L=TILE;
  let pose='walk',walk=sfSpd(t)>0?1:0,o={t};let hide=false;
  const dist=sfD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  let Rm=M4.id();
  // HOOK: sun flash, ant flinches
  if(t<R[0]){const h=t-EV.h0;if(h>0&&h<0.5){const j=Math.sin(h/0.5*Math.PI);Rm=M4.trs([0,0.18*j,0],0,0,0.08*j,1);o.lid=0;o.flail=1}if(t>=1.6)o.lid=0.3}
  // R1: flare
  if(rn===0){if(t>=EV.loop1+0.8&&t<EV.fl1){o.lid=0;o.headDown=-0.25}
    const f=flashK(t);if(t>=EV.fl1-0.1&&t<EV.res1){walk=0;o.lid=0;o.flail=t<EV.fl1+1.2?1:0;const j=t<EV.fl1+1.0?Math.sin(t*50)*0.03:0;Rm=M4.trs([j,0,0],0,0,0,1);o.soot=0.0}
    if(t>=EV.res1){o.glasses=easeOut((t-EV.res1)/0.5);o.lid=0.4}}
  // R2: CME
  if(rn===1){if(t>=EV.cme2+1.0&&t<EV.res2){o.lid=0;o.headDown=-0.3;walk=0;if(t>=EV.shield2-0.6&&t<EV.shield2+0.4)o.flail=1}
    if(t>=EV.res2&&t<EV.res2+2.6){o.glasses=1-ease((t-EV.res2-2.2)/0.4);o.lid=0.35}}
  // R3: geomagnetic storm
  if(rn===2){if(t>=EV.spark3-0.3&&t<EV.res3){walk=0;o.lid=0;o.headDown=-0.15;if(t>=EV.boom3&&t<EV.boom3+0.5){const k=(t-EV.boom3)/0.5;Rm=M4.trs([0,0.2*Math.sin(k*Math.PI),0],0,0,0,1);o.flail=1}}
    if(t>=EV.res3&&t<EV.res3+2.4){o.glasses=easeOut((t-EV.res3)/0.5)*(1-ease((t-EV.res3-2.0)/0.4));o.lid=0.4}}
  // R4: Carrington – telegraph wire snaps down next to him
  if(rn===3){const end=[1.15,0.03,-0.2];
    if(t>=EV.snap4){const k=clamp((t-EV.snap4)/(EV.land4-EV.snap4),0,1);const top=[3.5,40,60];const swing=t<EV.land4?0:Math.sin((t-EV.land4)*9)*0.2*Math.exp(-(t-EV.land4)*1.5);
      const e=k<1?V.add(V.add(top,V.sc(V.sub(end,top),easeIn(k))),[0,2*(1-k),0]):V.add(end,[swing,0,swing*0.5]);
      const mid=V.add(V.sc(V.add(top,e),0.5),[0,-1.5,0]);const pts=[];for(let i=0;i<=24;i++){const f=i/24;const a=V.add(V.sc(top,(1-f)*(1-f)),V.add(V.sc(mid,2*f*(1-f)),V.sc(e,f*f)));pts.push(a)}
      for(let i=0;i<24;i++)items.push({mesh:UCYL,M:segM(pts[i],pts[i+1],0.025),tint:[0.15,0.13,0.12],tintAmt:1});
      if(t>=EV.land4){const on=hsh(Math.floor(t*16),5)<0.7;sparkBurst(items,V.add(e,[0,0.05,0]),t,on?18:6,11,0.35);if(on)QPTS.push({p:e,c:'180,220,255',r:0.9,a:0.9});else QPTS.push({p:e,c:'255,190,110',r:0.5,a:0.5})}}
    if(t>=EV.snap4-0.2&&t<EV.res4){walk=0;o.lid=0;o.flail=t>=EV.land4&&t<EV.land4+1.6?1:0;if(t>=EV.land4&&t<EV.land4+1.6){const k=t-EV.land4;Rm=M4.trs([-0.25*ease(k/0.4),Math.abs(Math.sin(k*9))*0.18*(1-k/1.6),0],0,0,0,1)}else if(t>=EV.land4+1.6)Rm=M4.trs([-0.25,0,0],0,0,0,1)}
    if(t>=EV.res4){pose='sit';walk=0;Rm=M4.trs([-0.25,0,0],0,0,0,1);o.glasses=easeOut((t-EV.res4)/0.5);o.lid=0.35;o.headDown=-0.35}}
  // FINAL: magnifying glass + ONE sunbeam
  if(rn===4){const mz=magZ(t);const LC=[1.05,1.15,mz+1.3];
    if(mz<9){items.push({mesh:MAG_RIM,M:M4.trs(LC,-0.55,0.2,-0.42,0.42)});items.push({mesh:MAG_LENS,M:M4.trs(LC,-0.55,0.2,-0.42,[0.42,0.42,0.04]),tint:[0.6,0.8,1],tintAmt:1,alpha:0.12,add:1,noShadow:true});
      QPTS.push({p:V.add(LC,[0.08,0.15,0]),c:'255,255,240',r:0.08,a:0.5,cap:50})}
    // focal dot path: on the ground, crawling to the ant, then up onto his back
    if(t>=EV.dot5){const k=clamp((t-EV.dot5)/(EV.hit5-EV.dot5),0,1);let dp;const g0=[2.0,0.02,mz-1.3],g1=[0.35,0.02,-0.05];
      if(k<0.85){const kk=ease(k/0.85);dp=[lerp(g0[0],g1[0],kk),0.02,lerp(g0[2],g1[2],kk)+0.25*Math.sin(kk*5)]}else{const kk=ease((k-0.85)/0.15);dp=[lerp(g1[0],0.08,kk),lerp(0.02,0.72,kk),lerp(g1[2],0.35,kk)]}
      if(t>=EV.fall5)dp=V.add(dp,[0,-0.35*easeIn(clamp((t-EV.fall5)/0.35,0,1)),0]);
      const ap=clamp((t-EV.dot5)/0.4,0,1)*(t>=EV.res5+0.6?1-ease((t-EV.res5-0.6)/0.6):1);
      const lv=V.sub(LC,dp);const L_=V.len(lv);if(ap>0.01){
        DOTP={p:dp,lc:LC,a:ap,big:t>=EV.hit5}}
      if(ap>0.01){items.push({mesh:GSPH,M:M4.trs(dp,0,0,0,[0.07,0.02,0.07]),tint:[1,1,0.9],tintAmt:1,alpha:ap,add:1,noShadow:true});
        if(t<EV.hit5&&hsh(Math.floor(t*12),2)<0.6){const q=V.add(dp,[0,0.05+((t*0.8)%0.3),0]);items.push({mesh:USPH,M:M4.trs(q,0,0,0,0.035+((t*0.8)%0.3)*0.2),tint:[0.8,0.78,0.75],tintAmt:1,alpha:0.45*ap,noShadow:true})}}}
    if(t>=EV.look5&&t<EV.hit5){walk=0;o.lid=0;o.headDown=0.25*ease((t-EV.look5)/0.5);if(t>=EV.hit5-0.9){const j=Math.sin(t*40)*0.015;Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;o.soot=0.45*ease(k/0.5);
      for(let i=0;i<7;i++){const kk=k-i*0.18;if(kk<0||kk>2.4)continue;items.push({mesh:USPH,M:M4.trs([0.05+Math.sin(i*2.3+kk*2)*0.1,0.8+kk*0.55,0.3+kk*0.12],0,0,0,0.06+kk*0.16),tint:[0.55,0.53,0.52],tintAmt:1,alpha:Math.max(0,0.55*(1-kk/2.4)),noShadow:true})}
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,1);o.xeyes=t>=EV.fall5+0.3}
      else{Rm=M4.trs([Math.sin(k*70)*0.03,Math.abs(Math.sin(k*18))*0.08,0],0,0,0,1);o.flail=1}}}
  if(t>=R[5])walk=0;
  o.ph=walk?sfD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.0,EV.res1+1.8,EV.res2+2.8,EV.res3+2.6,R[4]+0.9];for(const c of coughs)if(t>=c&&t<c+1.4)o.cough=t-c;
  if(!hide)items.push(...antItems(Rm,o));
  return items}
// ---------- render ----------
let LASTBGVP=null;
function renderScene(t){const tt=sceneT(t);const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  LASTBGVP=renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:2,far:4e5},null,items,tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:900});
  const sd={center:[0,0,-0.4],radius:4.5};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:4000},sd,fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.h0,22,0.5);S(EV.fl1,34,1.0);S(EV.shield2,40,0.9);S(EV.boom3,30,0.7);S(EV.land4,22,0.5);S(EV.hit5,10,0.4);S(EV.fall5+0.35,14,0.4);
  if(roundAt(tt)===1&&tt>=EV.cme2&&tt<EV.shield2)a+=7*ease((tt-EV.cme2)/(EV.shield2-EV.cme2));
  if(roundAt(tt)===2&&tt>=EV.spark3&&tt<EV.boom3)a+=3;if(roundAt(tt)===3&&tt>=EV.land4&&tt<EV.res4)a+=2.5;return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
const BLUE='rgba(20,110,170,0.92)',DARK='rgba(15,10,30,0.8)',PINK='rgba(200,40,110,0.92)',GREEN='rgba(40,140,60,0.9)',RED='rgba(200,30,40,0.92)',ORANGE='rgba(210,100,20,0.92)';
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?54:58,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  const C1=1400,C2=1520;
  // R1
  if(rn===0&&t>=EV.loop1+0.3&&t<EV.fl1)card('Energy ≈ millions of H-bombs 💣',C1,ORANGE,50,EV.loop1+0.3,t);
  if(rn===0&&t>=EV.loop1+1.1&&t<EV.fl1)card('Its light hits Earth in ~8 minutes ⏱️',C2,DARK,44,EV.loop1+1.1,t);
  if(rn===0&&t>=EV.fl1+0.6&&t<EV.res1)card('X-RAY BLAST ☢️',660,PINK,70,EV.fl1+0.6,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: our air blocks flare X-rays 🛡️',C1,BLUE,48,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.3&&t<R[1]-0.2)card('(radio & GPS get messed up though 📡)',C2,DARK,42,EV.res1+1.3,t);
  // R2
  if(rn===1&&t>=EV.cme2+0.5&&t<EV.shield2)card('Billions of tons of plasma 😳',C1,PINK,50,EV.cme2+0.5,t);
  if(rn===1&&t>=EV.cme2+1.5&&t<EV.shield2)card('Up to 3,000 km/s 💨',C2,DARK,56,EV.cme2+1.5,t);
  if(rn===1&&t>=EV.shield2&&t<EV.res2)card('MAGNETIC SHIELD 🧲',660,'rgba(20,140,170,0.92)',66,EV.shield2,t);
  if(rn===1&&t>=EV.res2+0.5&&t<R[2]-0.2)card('Real: Earth’s magnetic field is our shield 🌍',C1,BLUE,42,EV.res2+0.5,t);
  if(rn===1&&t>=EV.res2+1.3&&t<R[2]-0.2)card('…but some energy still gets in 👀',C2,DARK,46,EV.res2+1.3,t);
  // R3
  if(rn===2&&t>=EV.aur3+0.8&&t<EV.spark3)card('Auroras = the storm hitting our air 🌌',C1,GREEN,44,EV.aur3+0.8,t);
  if(rn===2&&t>=EV.spark3+0.2&&t<EV.res3)card('Storm currents overload the grid 🔌',C1,PINK,46,EV.spark3+0.2,t);
  if(rn===2&&t>=EV.boom3+0.3&&t<EV.res3+2.6)card('BLACKOUT 🌑',660,DARK,74,EV.boom3+0.3,t);
  if(rn===2&&t>=EV.res3+0.4&&t<R[3]-0.2)card('Real: 1989, Québec – 6 million people,',C1,BLUE,44,EV.res3+0.4,t);
  if(rn===2&&t>=EV.res3+0.9&&t<R[3]-0.2)card('9 hours without power ⚡',C2,BLUE,50,EV.res3+0.9,t);
  // R4
  if(rn===3&&t>=R[3]+0.7&&t<EV.snap4)card('Strongest solar storm EVER recorded',C1,RED,46,R[3]+0.7,t);
  if(rn===3&&t>=R[3]+1.5&&t<EV.snap4+0.6)card('Auroras seen as far as the Caribbean 🌴',C2,DARK,42,R[3]+1.5,t);
  if(rn===3&&t>=EV.land4&&t<EV.res4)card('Telegraph wires threw SPARKS ⚡',660,PINK,54,EV.land4,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('Real: telegraph operators got shocked 😵',C1,BLUE,44,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.2&&t<R[4]-0.2)card('Ant: “10/10 light show” 🤩',C2,DARK,52,EV.res4+1.2,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.dot5+0.4)card('Sunrise. Peace at last… 😌',C1,DARK,52,R[4]+0.6,t);
  if(rn===4&&t>=EV.dot5+0.6&&t<EV.hit5)card('…wait 😳',660,'rgba(30,120,190,0.92)',66,EV.dot5+0.6,t);
  if(rn===4&&t>=EV.look5+0.3&&t<EV.hit5)card('ONE sunbeam 🔍',780,ORANGE,60,EV.look5+0.3,t);
  if(rn===4&&t>=EV.res5+0.7)card('A lens can focus sunlight',C1,BLUE,52,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.3)card('hot enough to light paper 🔥',C2,BLUE,52,EV.res5+1.3,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('SOLAR STORM ☀️',0,-110,fitSize('SOLAR STORM ☀️',980,116),'#FFD84A');txt('vs',0,-5,76,'#ffffff');txt('ONE DYING ANT 🐜',0,95,96,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived a solar flare, a CME,';txt(l1,0,-260,fitSize(l1,980,60),'#FFD84A');const l2='a blackout & Carrington ⚡';txt(l2,0,-180,fitSize(l2,960,60),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('sunbeam ☀️🔍',0,60,fitSize('sunbeam ☀️🔍',960,110),'#FF9A3A');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1100,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const q of BGPTS){const s=project(LASTBGVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||(q.sun?1100:700),q.r*1900/s[2]),q.c,q.a)}
  for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.05)glowAt(s,Math.min(q.cap||600,q.r*1900/s[2]),q.c,q.a)}
  if(DOTP){const a=project(LASTVP,DOTP.lc),b=project(LASTVP,DOTP.p);if(a&&b&&a[2]>0.05&&b[2]>0.05){const ra=0.6*1900/a[2]*0.62;
      ctx.globalAlpha=DOTP.a;const g=ctx.createLinearGradient(a[0],a[1],b[0],b[1]);g.addColorStop(0,'rgba(255,235,170,0.10)');g.addColorStop(1,'rgba(255,245,200,0.5)');ctx.fillStyle=g;
      const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;ctx.beginPath();ctx.moveTo(a[0]+nx*ra,a[1]+ny*ra);ctx.lineTo(a[0]-nx*ra,a[1]-ny*ra);ctx.lineTo(b[0],b[1]);ctx.closePath();ctx.fill();
      const fl=0.85+0.15*Math.sin(tt*37);glowAt(b,(DOTP.big?150:85)*fl,'255,240,190',1);glowAt(b,(DOTP.big?60:32),'255,255,255',1);ctx.globalAlpha=1}}
  ctx.restore();
  // final letterbox
  if(rn===4&&tt>=EV.look5&&tt<EV.res5+0.8){const k=ease((tt-EV.look5)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.h0,0.75,0.45,'255,240,200');flash(EV.fl1,0.95,1.1,'255,250,235');flash(EV.shield2,0.6,0.4,'140,240,255');flash(EV.boom3,0.6,0.35,'170,220,255');flash(EV.land4,0.45,0.25,'190,225,255');flash(EV.hit5,0.45,0.3,'255,240,190');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
