// ================= FIRE DISAPPEARS 5s: meshes + timeline =================
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function fEll(mb,c,r3,colFn,res,mat){const la=res[0],lo=res[1];const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[c[0]+Math.sin(th)*Math.cos(ph)*r3[0],c[1]+Math.cos(th)*r3[1],c[2]+Math.sin(th)*Math.sin(ph)*r3[2]]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
// roast turkey (local origin = plate centre, y up, ~0.55 long)
const FK_SKIN=p=>{const v=fbm(p[0]*14+3,p[2]*14+p[1]*9,4);const top=clamp((p[1]-0.06)/0.16,0,1);return mix3(mix3(hx('#5e2a10'),hx('#a2551c'),v),hx('#d8933f'),top*0.45+v*0.2)};
const FK_ROAST=um(m=>{fEll(m,[0,0.13,0],[0.27,0.16,0.2],FK_SKIN,[16,28]);fEll(m,[-0.2,0.1,0],[0.12,0.1,0.15],FK_SKIN,[10,16]);
  for(const sz of[-1,1]){fEll(m,[0.16,0.1,sz*0.15],[0.15,0.075,0.075],FK_SKIN,[10,16]);m.prism([0.29,0.1,sz*0.15],0.018,0.014,0.07,8,hx('#f3ead8'),0);fEll(m,[0.335,0.1,sz*0.15],[0.03,0.028,0.028],()=>hx('#fbf4e6'),[6,10])}
  for(const sz of[-1,1])fEll(m,[-0.02,0.14,sz*0.21],[0.13,0.07,0.04],FK_SKIN,[8,12])},0.5);
const FK_PLATE=um(m=>{m.prism([0,0,0],0.42,0.46,0.025,40,hx('#f4f1ea'),0.2);m.prism([0,0.025,0],0.46,0.0,0.0001,40,hx('#e8e2d6'),0.2);
  for(let i=0;i<9;i++){const a=i/9*TAU2;fEll(m,[Math.cos(a)*0.38,0.04,Math.sin(a)*0.38],[0.05,0.03,0.05],p=>mix3(hx('#2f7a2a'),hx('#5aa83a'),fbm(p[0]*30,p[2]*30,2)),[6,10])}
  for(let i=0;i<6;i++){const a=i/6*TAU2+0.3;fEll(m,[Math.cos(a)*0.33,0.05,Math.sin(a)*0.33],[0.035,0.03,0.035],()=>hx('#c8202c'),[6,8])}},0.5);
function fPump(m,c,r,col){fEll(m,c,[r,r*0.75,r],p=>{const a=Math.atan2(p[2]-c[2],p[0]-c[0]);const rib=0.5+0.5*Math.cos(a*8);return mix3(V.sc(col,0.62),col,rib)},[14,32]);m.prism([c[0],c[1]+r*0.65,c[2]],r*0.09,r*0.06,r*0.3,8,hx('#5a4020'),0)}
const FCAND_X=[-0.5,-0.3,0.36,0.56];const FCAND_H=[0.42,0.32,0.38,0.28];const FCAND_Z=-0.42;
const FK_TABLE=um(m=>{m.box([0,-0.02,0],[14,0.04,10],hx('#3a2418'),0);m.box([0,1.6,-2.6],[14,3.4,0.1],hx('#3b1c22'),0);
  for(let x=-6;x<=6;x+=1.2)m.box([x,1.6,-2.54],[0.06,3.4,0.04],hx('#4a2630'),0);m.box([0,0.5,-2.52],[14,0.06,0.06],hx('#5c3a2a'),0);
  m.box([0,0.73,0],[3.0,0.06,1.5],hx('#5b3520'),0);for(const sx of[-1,1])for(const sz of[-1,1])m.box([sx*1.35,0.36,sz*0.6],[0.08,0.72,0.08],hx('#4a2a18'),0);
  m.box([0,0.765,0],[3.06,0.012,1.56],hx('#efe4cf'),0);m.box([0,0.773,0],[3.06,0.006,0.5],hx('#b4451f'),0);
  fPump(m,[-1.25,0.84,0.25],0.08,hx('#f07a1a'));fPump(m,[1.3,0.86,0.2],0.1,hx('#e8691a'));fPump(m,[-0.4,0.83,-0.45],0.07,hx('#f29a2a'));
  FCAND_X.forEach((x,i)=>{m.prism([x,0.776,FCAND_Z],0.07,0.05,0.03,16,hx('#c9a24a'),0.2);m.prism([x,0.8,FCAND_Z],0.032,0.032,FCAND_H[i],14,hx('#f6eed8'),0);m.prism([x,0.8+FCAND_H[i],FCAND_Z],0.004,0.003,0.025,4,hx('#222'),0)});},0.3);
function candleTip(i){return[FCAND_X[i],0.8+FCAND_H[i]+0.03,FCAND_Z]}
// ---------- oven / kitchen ----------
const FOV_BODY=um(m=>{const sc=hx('#c9ccd4');m.box([-0.48,0.475,0],[0.04,0.95,0.75],sc,0.2);m.box([0.48,0.475,0],[0.04,0.95,0.75],sc,0.2);m.box([0,0.94,0],[1.0,0.04,0.75],sc,0.2);m.box([0,0.07,0],[1.0,0.14,0.75],sc,0.2);m.box([0,0.475,-0.36],[1.0,0.95,0.03],sc,0.2);m.box([0,0.8,0.36],[1.0,0.28,0.03],sc,0.2);m.box([0,0.17,0.36],[1.0,0.06,0.03],sc,0.2);m.box([-0.43,0.42,0.36],[0.14,0.5,0.03],sc,0.2);m.box([0.43,0.42,0.36],[0.14,0.5,0.03],sc,0.2);m.box([0,0.96,0],[1.02,0.02,0.77],hx('#2a2c33'),0.2);
  for(const sx of[-1,1])for(const sz of[-1,1]){m.prism([sx*0.24,0.97,sz*0.17],0.11,0.11,0.012,20,hx('#15161a'),0);m.prism([sx*0.24,0.982,sz*0.17],0.05,0.05,0.01,16,hx('#3a3c44'),0)}
  m.box([0,1.1,-0.36],[1.0,0.3,0.04],hx('#b8bcc6'),0.2);for(let i=0;i<4;i++)m.prism([-0.3+i*0.2,1.08,-0.33],0.035,0.035,0.03,12,hx('#2a2c33'),0.2,0);
  m.box([0,0.74,0.4],[0.8,0.035,0.04],hx('#e8eaef'),0.2);
  m.box([0,-0.02,0],[14,0.04,10],hx('#d8d2c8'),0);m.box([0,1.6,-0.45],[14,3.4,0.1],hx('#e9e4da'),0);for(let x=-6;x<=6;x+=0.3)m.box([x,1.4,-0.395],[0.008,1.4,0.01],hx('#cfc8bc'),0);for(let y=0.7;y<=2.1;y+=0.3)m.box([0,y,-0.395],[14,0.008,0.01],hx('#cfc8bc'),0);
  for(const sx of[-1,1]){m.box([sx*1.25,0.45,0],[1.45,0.9,0.75],hx('#3d5a80'),0);m.box([sx*1.25,0.92,0],[1.5,0.05,0.8],hx('#f2efe8'),0.2);for(let i=0;i<2;i++)m.box([sx*(0.88+i*0.72),0.62,0.38],[0.18,0.025,0.03],hx('#d9dde4'),0.2)}},0.3);
const FOV_WIN=um(m=>m.box([0,0.42,0.37],[0.72,0.5,0.006],[1,1,1],0));
const FOV_IN=um(m=>{m.box([0,0.42,-0.28],[0.84,0.6,0.02],[1,1,1],MAT.emis);m.box([0,0.17,0],[0.84,0.02,0.6],[1,1,1],MAT.emis)});
// ---------- sun ----------
const FSUN=um(m=>sph(m,1,72,144,n=>{const v=fbm(n[0]*9+1,n[1]*9+n[2]*6,4);const g=Math.abs(fbm(n[0]*22,n[2]*22+n[1]*7,2)-0.5);return mix3(mix3([1,0.45,0.06],[1,0.82,0.35],v),[1,0.97,0.75],g<0.04?0.6:0)},MAT.emis),0.3);
// ---------- earth city lights (two halves, like zap) ----------
function fLights(part){return um(m=>{const r=rngG(77);let k=0;for(let i=0;i<140000&&k<11000;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const n=[s*Math.cos(a),u,s*Math.sin(a)];
  const rr=r(),sz=r(),cc=r();if(sLand(n)<0.512||Math.abs(n[1])>0.72)continue;if(fbm(n[0]*7+2,n[2]*7+n[1]*3,3)<0.4)continue;if(V.dot(n,SLS)>-0.02)continue;k++;
  const half=hsh(Math.floor(n[0]*9+20)*31+Math.floor(n[2]*9+20),Math.floor(n[1]*9+20))<0.6?0:1;if(half!==part)continue;
  const p=V.sc(n,1.004);const col=mix3([1,0.62,0.22],[1,0.9,0.6],cc);m.ico(p,0.0024+sz*0.0038,col,MAT.emis,1,[2,4])}})}
const FL1=fLights(0),FL2=fLights(1);
// fire points on the globe (2D glows)
const FFIRES=[];{const r=rngG(311);let k=0;for(let i=0;i<40000&&k<70;i++){const u=r()*1.6-0.8,a=r()*TAU2,s=Math.sqrt(1-u*u);const n=[s*Math.cos(a),u,s*Math.sin(a)];if(sLand(n)<0.52)continue;if(V.dot(n,SLS)>0.1)continue;k++;FFIRES.push({n:V.sc(n,1.006),s:0.5+r(),ph:r()*9})}}
// ================= timeline =================
const EV={off:1.25,idea:3.5,vanish:9.0,r1:9.6,r2:17.0,r3:24.0,r4:31.0,r5:37.4,back:41.0,never:43.6,day:51.6,endc:58.6,loop:66.0};
function scn(t){if(t<EV.idea)return'hook';if(t<EV.r1)return'idea';if(t<EV.r2)return'r1';if(t<EV.r3)return'r2';if(t<EV.r4)return'r3';if(t<EV.r5)return'r4';if(t<EV.back)return'r5';if(t<EV.never)return'back';if(t<EV.day)return'never';if(t<EV.endc)return'day';return'end'}
function fFlick(t,t0){const k=t-t0;if(k<0)return 1;if(k>0.4)return 0;return[1,0.3,0.8,0.1,0.5,0,0.2,0][Math.floor(k/0.4*8)]}
const FRELIT=[53.0,53.35,53.7,54.05];
// candle i flame level 0..1
function candleL(t,i){const S=scn(t);if(S==='hook')return fFlick(t,EV.off+i*0.06);if(S==='back')return 0;if(S==='day'){const k=t-FRELIT[i];return k<0?0:clamp(k/0.25,0,1)}if(S==='end')return 1;return 0}
function tableLight(t){let s=0;for(let i=0;i<4;i++)s+=candleL(t,i);return s/4}
function fireOn(t){if(t<EV.vanish)return!(t>=EV.off&&t<EV.idea);if(t<EV.back)return false;return t>=EV.day?true:t<EV.never}
function earthLights(t){const S=scn(t);if(S==='idea'){const a=fFlick(t,EV.vanish+0.1);return[1,a,1]}if(S==='r3'){return[1,fFlick(t,EV.r3+1.7),0]}if(S==='never'){const k=seg(t,EV.never+5.0,EV.never+5.6);return[1,0,0]}return[1,1,1]}
function envSpace(){return{sun:SLS,sunCol:V.sc(hx('#fff1e0'),1.3),sky:[0.02,0.025,0.05],gnd:[0.008,0.008,0.015],fog:[0,0,0.01],fogD:1e7,zen:hx('#02030c'),hor:hx('#060820'),stars:0.9,night:0,emis:1.0,ground:0,sunSize:0.02,fillD:[-0.6,0.3,0.7],fillC:[0.07,0.09,0.15]}}
function envRoom(L){const e=envSpace();e.stars=0;e.sun=V.norm([0.25,0.9,0.45]);e.sunCol=mix3([0.16,0.2,0.34],[1.15,0.72,0.42],L);e.fillD=[0.3,0.4,1];e.fillC=mix3([0.05,0.07,0.13],[0.24,0.14,0.09],L);e.sky=[0.01,0.01,0.02];e.zen=[0.01,0.01,0.02];e.hor=[0.02,0.015,0.02];return e}
function envKitchen(t){const e=envSpace();e.stars=0;e.sun=V.norm([0.35,0.85,0.6]);const on=ovenL(t);e.sunCol=mix3([0.55,0.62,0.8],[1.0,0.92,0.82],0.6+0.4*on);e.fillD=[0,0.3,1];e.fillC=mix3([0.25,0.27,0.33],[0.7,0.45,0.25],on);e.sky=[0.6,0.6,0.62];e.zen=e.sky;e.hor=e.sky;return e}
function ovenL(t){return fFlick(t,EV.r1+1.4)}
function envAt(t){const S=scn(t);if(S==='r2'||S==='r5')return envDay({sun:V.norm([-0.35,0.75,0.55]),fogD:320,fog:hx('#cfe0f0')});
  if(S==='hook'||S==='back'||S==='day'||S==='end')return envRoom(tableLight(t));if(S==='r1')return envKitchen(t);
  const e=envSpace();if(S==='r4'){e.sun=V.norm([0.4,0.6,0.8])}return e}
const ZN=V.norm([-0.85,0.45,0.22]);const ZUP=[0,1,0];const ZR=V.norm(V.cross(ZN,ZUP));
function eCam(d,ox,oy,tx,ty){const dir=V.norm(V.add(V.add(ZN,V.sc(ZR,ox)),V.sc(ZUP,oy)));const at=V.add(V.sc(ZR,tx||0),V.sc(ZUP,ty||0));return{eye:V.add(V.sc(dir,d),at),at}}
function tCam(t,a,b,e0,e1,a0,a1){const k=ease(seg(t,a,b));return{eye:V.add(e0,V.sc(V.sub(e1,e0),k)),at:V.add(a0,V.sc(V.sub(a1,a0),k))}}
function camAt(t){const S=scn(t);let c={eye:[0,0.35,4.4],at:[0,0,0]},fov=0.9;
  if(S==='hook')c=tCam(t,0,EV.idea,[0.3,1.62,1.45],[0.08,1.52,1.25],[0,0.84,-0.12],[0,0.86,-0.15]);
  if(S==='idea'){const k=ease(seg(t,EV.idea,EV.r1));c=eCam(lerp(3.6,3.0,k),lerp(0.25,0.05,k),lerp(0.25,0.1,k))}
  if(S==='r1'){c=tCam(t,EV.r1,EV.r2,[0.55,1.25,2.1],[0.15,0.95,1.55],[0,0.55,0],[0,0.48,0]);fov=0.85}
  if(S==='r2'){const k=seg(t,EV.r2,EV.r3);c={eye:[lerp(-3,10,k),lerp(3.6,3.0,k),15],at:[lerp(2,14,k),0.6,0]};fov=0.85}
  if(S==='r3'){const k=seg(t,EV.r3,EV.r4);c=eCam(lerp(2.4,2.1,k),lerp(-0.12,0.0,k),lerp(0.05,0.0,k));fov=0.85}
  if(S==='r4'){const k=ease(seg(t,EV.r4,EV.r5));c={eye:[lerp(0.5,-0.3,k),lerp(0.1,0.0,k),lerp(3.9,3.3,k)],at:[0,-0.05,0]};fov=0.9}
  if(S==='r5'){const k=ease(seg(t,EV.r5,EV.back));c={eye:[lerp(1.4,0.7,k),lerp(1.5,1.3,k),lerp(12.6,11.6,k)],at:[0,0.95,5.2]};fov=0.8}
  if(S==='back')c=tCam(t,EV.back,EV.never,[-0.5,1.6,1.5],[-0.25,1.5,1.3],[0,0.84,-0.12],[0,0.86,-0.15]);
  if(S==='never'){const k=ease(seg(t,EV.never,EV.day));c=eCam(lerp(3.0,4.2,k),lerp(0.1,0.3,k),lerp(0.1,0.3,k))}
  if(S==='day')c=tCam(t,EV.day,EV.endc,[0.75,1.7,1.75],[0.35,1.6,1.5],[0,0.84,-0.12],[0,0.86,-0.15]);
  if(S==='end')c=tCam(t,EV.endc,EV.loop,[0.6,1.75,1.7],[0.3,1.62,1.45],[0,0.84,-0.12],[0,0.84,-0.12]);
  return{eye:c.eye,at:c.at,fov}}
let EARTHS=[];
function fEarth(items,t){const la=earthLights(t);const M=M4.trs([0,0,0],0,0,0,1);items.push({mesh:SEARTH,M});
  if(la[0]>0.01)items.push({mesh:FL1,M,alpha:0.97*la[0],add:1,noShadow:true});if(la[1]>0.01)items.push({mesh:FL2,M,alpha:0.97*la[1],add:1,noShadow:true});EARTHS.push({p:[0,0,0],s:1,a:1})}
// cars (r2): lane z, start x, colour index, ev?
const FCARS=[[-2,-6,0,0],[-2,-15,1,0],[-2,3,2,0],[-2,-38,3,1],[2,30,1,0],[2,44,0,0]];
const FSTALL=EV.r2+1.4;
function carX(c,t){const v=c[0]<0?9:-8;const k=t-EV.r2;if(c[3]||t<FSTALL)return c[1]+v*k;const ks=FSTALL-EV.r2,d=Math.min(t-FSTALL,2.6);return c[1]+v*ks+v*d-v/(2*2.6)*d*d}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;EARTHS=[];
  if(S==='hook'||S==='back'||S==='day'||S==='end'){items.push({mesh:FK_TABLE,M:ID4});items.push({mesh:FK_PLATE,M:M4.trs([0.05,0.778,0.05],0,0,0,1)});items.push({mesh:FK_ROAST,M:M4.trs([0.05,0.8,0.05],0.5,0,0,1)})}
  if(S==='r1'){items.push({mesh:FOV_BODY,M:ID4});const on=ovenL(t);items.push({mesh:FK_ROAST,M:M4.trs([0,0.19,0.0],0.4,0,0,0.85),tint:[1,0.82,0.72],tintAmt:0.5});
    items.push({mesh:FOV_IN,M:ID4,tint:mix3([0.05,0.04,0.04],[1,0.42,0.1],on),tintAmt:1,noShadow:true});items.push({mesh:FOV_WIN,M:ID4,tint:[0.1,0.1,0.14],tintAmt:1,alpha:0.22,noShadow:true});
    const k=seg(t,EV.r1+4.6,EV.r1+4.9);if(k>0)qItems(items,t,cm,{x:0.6,y:-0.62,s:0.07,d:1.5,pop:easeOut(k),expr:'wide'})}
  if(S==='idea'||S==='r3'||S==='never')fEarth(items,t);
  if(S==='r2'||S==='r5')items.push({mesh:SPTOWN,M:ID4});
  if(S==='r2')for(const c of FCARS){const x=carX(c,t);if(Math.abs(x-cm.at[0])>60)continue;items.push({mesh:SPCAR[c[2]],M:M4.trs([x,0,c[0]],c[0]<0?0:Math.PI,0,0,1)})}
  if(S==='r5'){const br=Math.sin(t*3)*0.03;for(const it of jumperItems([0,0,5.2],0.15,0,0.06+br,0,1))items.push(it)}
  if(S==='r4'){items.push({mesh:FSUN,M:M4.trs([0,0,0],t*0.05,0.3,0,1),noShadow:true});const k=seg(t,EV.r4+2.0,EV.r4+2.3);if(k>0)qItems(items,t,cm,{x:0.6,y:-0.66,s:0.12,d:3,pop:easeOut(k),expr:'wide'})}
  if(S==='never'){const k=seg(t,EV.never+4.0,EV.never+4.3);if(k>0)qItems(items,t,cm,{x:-0.6,y:-0.05,s:0.07,d:1.5,pop:easeOut(k),expr:'wide'})}
  if(S==='idea'){const k=seg(t,EV.idea+3.0,EV.idea+3.3);if(k>0&&t<EV.vanish)qItems(items,t,cm,{x:0.62,y:-0.52,s:0.07,d:1.5,pop:easeOut(k),expr:'wide'})}
  return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);
  const town=S==='r2'||S==='r5';const room=S==='hook'||S==='back'||S==='day'||S==='end'||S==='r1';
  if(!town&&!room)items.unshift({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
  const shc=town?{center:[cm.at[0],0,4],radius:30}:room?{center:[0,0.8,0],radius:3.2}:{center:[0,-9999,0],radius:1};
  if(town){env.ground=1;env.gndCol=hx('#4f7d3c')}
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:town?0.05:room?0.02:0.02,far:3000},shc,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.off,12,0.6);S(EV.vanish,12,0.6);S(EV.r1+1.4,8,0.5);S(FSTALL,6,0.5);S(EV.r3+1.7,6,0.5);S(EV.back,12,0.7);S(EV.never,8,0.6);return a}
