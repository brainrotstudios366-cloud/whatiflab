// ===================== TIMELINE =====================
// ---------- scale scenes ----------
const S1=mkScene({t0:16.0,t1:79.25,xv:7,cap:4,ch:1});
addItems(S1,'L','x',[0],E(5,1.1));
addItems(S1,'L','w',rng(1,5),E(5,6.6),0.12);
addItems(S1,'R','w',rng(0,11),E(6,0.9),0.07);
setOut(S1,'L','w',rng(1,5),E(8,1.6),'up',0.05);
addItems(S1,'L','w',rng(1,5),E(9,3.9),0.08);
setOut(S1,'L','w',rng(1,5),E(10,3.2),'up',0.04);
setOut(S1,'R','w',rng(7,11),E(10,4.6),'up',0.04);
const S2=mkScene({t0:118.55,t1:152.6,xv:4,cap:4,ch:2});
addItems(S2,'L','x',[0,1,2],E(19,4.1),0.15);
addItems(S2,'R','w',rng(0,11),E(19,6.5),0.05);
S2.groups.push({t0:E(21,5.5),t1:E(22,0.9),side:'both',L:[[0],[1],[2]],R:[rng(0,3),rng(4,7),rng(8,11)]});
setOut(S2,'L','x',[1,2],E(22,0.6),'fade');setOut(S2,'R','w',rng(4,11),E(22,0.6),'fade');
const S3=mkScene({t0:152.6,t1:188.0,xv:5,cap:5,ch:3});
addItems(S3,'L','x',[0,1],E(25,0.0),0.12);
addItems(S3,'L','w',[2,3,4],E(25,1.0),0.1);
addItems(S3,'R','w',rng(0,12),E(25,1.5),0.04);
setOut(S3,'L','w',[2,3,4],E(27,1.9),'up',0.05);setOut(S3,'R','w',[10,11,12],E(27,1.9),'up',0.05);
S3.groups.push({t0:E(28,0.4),t1:E(28,1.4),side:'both',L:[[0],[1]],R:[rng(0,4),rng(5,9)]});
setOut(S3,'L','x',[1],E(28,1.2),'fade');setOut(S3,'R','w',rng(5,9),E(28,1.2),'fade');
const S4=mkScene({t0:188.0,t1:222.5,xv:4,cap:5,ch:4});
addItems(S4,'L','x',rng(0,4),E(31,0),0.1);
const S4B=addItems(S4,'L','b',[0,1,2,3],E(31,0.6),0.12);
addItems(S4,'R','x',[0,1],E(31,2.2),0.1);
addItems(S4,'R','w',rng(2,9),E(31,2.8),0.06);
setOut(S4,'L','x',[3,4],E(32,5.6),'up',0.05);setOut(S4,'R','x',[0,1],E(32,5.6),'up',0.05);
{const ws=addItems(S4,'L','w',[5,6,7,8],E(34,0.15),0.12);ws.forEach((w,i)=>{w.tout=w.tin+0.42;w.out='pop';S4B[i].tout=w.tin+0.42;S4B[i].out='pop'})}
addItems(S4,'R','w',[0,1,10,11],E(34,0.15),0.12);
S4.groups.push({t0:E(34,3.0),t1:E(34,4.0),side:'both',L:[[0],[1],[2]],R:[rng(0,3),rng(4,7),rng(8,11)]});
setOut(S4,'L','x',[1,2],E(34,3.8),'fade');setOut(S4,'R','w',rng(4,11),E(34,3.8),'fade');
const SCALES=[S1,S2,S3,S4];SCALES.forEach(simulate);
const MODES=[[0,'board'],[16.0,S1],[79.25,'board'],[118.55,S2],[152.6,S3],[188.0,S4],[222.5,'board']];
function modeAt(t){let m=MODES[0];for(const x of MODES)if(t>=x[0])m=x;return m}
const CUTS=[16.0,79.25,118.55,222.5];
// ---------- chapters ----------
const CHAP=[[3,1,'Die Waage'],[14,2,'Die Gegenoperation'],[24,3,'Zwei Schritte'],[30,4,'x auf beiden Seiten'],[36,5,'Gleichungen im echten Leben'],[40,6,'Die 3 häufigsten Fehler']];
// ---------- Q expressions ----------
const QEX=[[0,'open'],[E(1,0.5),'wide'],[E(2,0),'happy'],[E(4,0),'open'],[E(8,2.9),'wide'],[E(10,0),'open'],[E(11,6.3),'happy'],[E(13,0),'open'],[E(20,2.4),'wide'],[E(21,2),'open'],[E(22,3.9),'happy'],[E(25,0),'open'],
 [E(28,1.7),'happy'],[E(29,6.7),'wide'],[E(31,0),'open'],[E(31,4.3),'wide'],[E(33,0),'open'],[E(34,4.2),'happy'],[E(37,0),'open'],[E(39,4.2),'happy'],[E(41,0),'open'],[E(42,8.6),'wide'],[E(42,12.3),'happy'],[E(43,5.5),'wide'],[E(43,10.2),'happy'],[E(45,0),'happy']];
const QJUMP=[E(11,7.0),E(22,4.3),E(28,2.2),E(34,4.6),E(39,4.6),E(44,7.5),E(47,3.0),E(48,3.1),E(49,4.1),E(52,6.3)];
function qState(t){let e='open';for(const q of QEX)if(t>=q[0])e=q[1];let j=0;for(const s of QJUMP){const d=t-s;if(d>0&&d<0.8)j+=Math.sin(d/0.8*Math.PI)*0.35}return{e,j}}
// ---------- camera ----------
function camAt(t,m){if(m==='board'){return{eye:[Math.sin(t*0.09)*1.2,2.6,14.5],at:[0,2.0,0],fov:0.55}}
  const S=m;let ax=1.75;if(S===S1)ax=lerp(0,1.75,ease((t-E(4,-0.8))/1.2));
  let eye=[ax+Math.sin(t*0.11)*0.9,3.0+Math.sin(t*0.07)*0.2,14.2],at=[ax,2.25,0];
  if(S===S1&&t<E(2,3.5)){const k=ease((t-16.0)/(E(2,3.5)-16.0));eye=[lerp(-7,eye[0],k),lerp(7.5,eye[1],k),lerp(22,eye[2],k)];at=[lerp(0,at[0],k),lerp(1.2,at[1],k),0]}
  return{eye,at,fov:0.55}}
const ENV={sun:[0.5,0.75,0.6],sunCol:hx('#fff0dc'),sky:hx('#3a5ad0'),gnd:hx('#0a0c24'),fog:hx('#04061a'),fogD:120,zen:hx('#020210'),hor:hx('#0a1036'),stars:0.8,neb:0.55,night:0,emis:1.0,ground:0,sunSize:0.01,fillD:[-0.7,0.3,0.6],fillC:hx('#3a2a6a')};
let LASTVP=null,CAM=null,SCN=null;
function renderScene(t){const md=modeAt(t);const m=md[1];const cm=camAt(t,m);CAM=cm;const items=[];
  items.push({mesh:FLOOR,M:M4.trs([m==='board'?0:(cm.at[0]),0,0],t*0.02,0,0,1)});
  SCN=null;if(m!=='board'){SCN=scaleItems(items,m,t);SCN.S=m}
  const q=qState(t);const qo=m==='board'?{x:0.82,y:-0.66,s:0.125,d:3,expr:q.e,jump:q.j*0.5}:{x:-0.84,y:-0.66,s:0.105,d:3,expr:q.e,jump:q.j*0.4};
  qItems(items,t,cm,qo);
  LASTVP=renderGL(ENV,cm,{center:[0,-9999,0],radius:1},items,t)}
