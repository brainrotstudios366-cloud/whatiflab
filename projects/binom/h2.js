// ===================== CONTENT: Binomische Formeln =====================
const SECH=[1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
function dseg(s,t0,p,q,col,lw,dur,o){o=o||{};WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{let k=eo(prog(t,t0,dur||0.5));if(k<=0)return;let a=1;if(o.tOut!=null)a=1-prog(t,o.tOut,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([14,12]);ctx.strokeStyle=col||C.ink;ctx.lineWidth=lw||3.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore()})}
function hi(s,t0,p,q,col,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,0.45));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=0.28;ctx.strokeStyle=col;ctx.lineWidth=o.w||22;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore();if(k>0.99||o.line){ctx.save();ctx.globalAlpha=Math.min(1,k);hline(p[0],p[1],q[0],q[1],col,o.lw||5.5,1,p[0]+q[0]);ctx.restore()}})}
function arcA(s,t0,c,r,a0,a1,col,label,lr,ls,o){o=o||{};WRITES.push([t0,0.3]);custom(s,t0,t=>{let k=eo(prog(t,t0,0.5));if(k<=0)return;let al=1;if(o.tOut!=null)al=1-prog(t,o.tOut,0.4);if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.lineCap='round';ctx.fillStyle=col.length===7?col+'33':col;ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.arc(c[0],c[1],r,-(a0+(a1-a0)*k)*D2R,-a0*D2R);ctx.closePath();ctx.globalAlpha*=0.5;ctx.fill();ctx.globalAlpha/=0.5;ctx.beginPath();ctx.arc(c[0],c[1],r,-(a0+(a1-a0)*k)*D2R,-a0*D2R);ctx.stroke();
  if(label&&k>0.6){const am=(a0+a1)/2*D2R,R=lr||r+34;ctx.globalAlpha*=prog(t,t0+0.3,0.3);ctx.font=HF(ls||44);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,c[0]+Math.cos(am)*R,c[1]-Math.sin(am)*R)}ctx.restore()})}
function rsq(s,t0,c,u,v,sz){custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;sz=sz||38;const p1=[c[0]+u[0]*sz,c[1]+u[1]*sz],p2=[p1[0]+v[0]*sz,p1[1]+v[1]*sz],p3=[c[0]+v[0]*sz,c[1]+v[1]*sz];ctx.save();ctx.globalAlpha=k;hline(p1[0],p1[1],p2[0],p2[1],C.ink,3,1);hline(p2[0],p2[1],p3[0],p3[1],C.ink,3,1);ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(c[0]+(u[0]+v[0])*sz*0.5,c[1]+(u[1]+v[1])*sz*0.5,4.5,0,7);ctx.fill();ctx.restore()})}
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};const D2R=Math.PI/180;const CA_=C.blue,CB_=C.org,CC_=C.red;
// filled polygon helper
function poly(s,t0,P,fill,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,o.dur||0.5));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.5);if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle=fill;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
  if(o.stroke){ctx.strokeStyle=o.stroke;ctx.lineWidth=3;ctx.stroke()}
  if(o.grid){const[n,A,B,D]=o.grid;ctx.strokeStyle='rgba(29,59,110,0.45)';ctx.lineWidth=1.6;for(let i=1;i<n;i++){const f=i/n;ctx.beginPath();ctx.moveTo(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f);ctx.lineTo(D[0]+(B[0]-A[0])*f,D[1]+(B[1]-A[1])*f);ctx.stroke();ctx.beginPath();ctx.moveTo(A[0]+(D[0]-A[0])*f,A[1]+(D[1]-A[1])*f);ctx.lineTo(B[0]+(D[0]-A[0])*f,B[1]+(D[1]-A[1])*f);ctx.stroke()}}
  if(o.label){ctx.font=HF(o.ls||48);ctx.fillStyle=o.lc||C.ink;ctx.textAlign='center';ctx.textBaseline='middle';const cx=P.reduce((a,p)=>a+p[0],0)/P.length,cy=P.reduce((a,p)=>a+p[1],0)/P.length;ftm(o.label,cx,cy)}ctx.restore()})}
const CHAPS=[[2,1,'Was heißt hoch zwei?'],[7,2,'Das Bild, das alles erklärt'],[14,3,'Ausmultiplizieren'],[19,4,'Die 2. binomische Formel'],[25,5,'Die 3. binomische Formel'],[29,6,'Kopfrechnen wie ein Profi'],[33,7,'Die Formeln rückwärts'],[37,8,'Die 3 häufigsten Fehler']];

function stampL(s,t0,x,y,txt,size,rot){CK.push(t0);custom(s,t0,t=>{const k=prog(t,t0,0.3);if(k<=0)return;const sc=lerp(2.2,1,eo(k));ctx.save();ctx.translate(x,y);ctx.rotate(rot||-0.12);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,k*1.5);ctx.font=HF(size||90);const w=ctx.measureText(txt).width+60,h=(size||90)*1.25;ctx.strokeStyle=C.red;ctx.lineWidth=7;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,16);ctx.stroke();ctx.fillStyle=C.red;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,6);ctx.restore()})}
function tipBox(s,t0,x,y,w,h){custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(255,224,70,0.30)';ctx.beginPath();ctx.roundRect(x,y,w*k,h,18);ctx.fill();ctx.restore();hrect(x,y,w,h,'#C9A000',3.5,k)})}
// square picture: X,Y top-left, A,B pixel parts
function sqPic(s,o){const{X,Y,A,B,tOut,tDiv,tA,tB,tR,nums}=o;const L=A+B;
 seg(s,tOut,[X,Y],[X+L,Y],C.ink,4.5,0.35);seg(s,tOut+0.2,[X+L,Y],[X+L,Y+L],C.ink,4.5,0.35);seg(s,tOut+0.4,[X+L,Y+L],[X,Y+L],C.ink,4.5,0.35);seg(s,tOut+0.6,[X,Y+L],[X,Y],C.ink,4.5,0.35);
 dseg(s,tDiv,[X+A,Y],[X+A,Y+L],C.ink,3.5,0.5);dseg(s,tDiv+0.2,[X,Y+A],[X+L,Y+A],C.ink,3.5,0.5);
 custom(s,tDiv+0.3,t=>{const k=eo(prog(t,tDiv+0.3,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.font=HF(46);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=CA_;ctx.fillText(nums?nums[0]:'a',X+A/2,Y-30);ctx.fillText(nums?nums[0]:'a',X-34,Y+A/2);ctx.fillStyle=CB_;ctx.fillText(nums?nums[1]:'b',X+A+B/2,Y-30);ctx.fillText(nums?nums[1]:'b',X-34,Y+A+B/2);ctx.restore()});
 poly(s,tA,[[X,Y],[X+A,Y],[X+A,Y+A],[X,Y+A]],'rgba(77,163,255,0.38)',{label:nums?nums[2]:'a^2',ls:64,lc:CA_});
 poly(s,tB,[[X+A,Y+A],[X+L,Y+A],[X+L,Y+L],[X+A,Y+L]],'rgba(255,159,67,0.40)',{label:nums?nums[3]:'b^2',ls:54,lc:CB_});
 poly(s,tR,[[X+A,Y],[X+L,Y],[X+L,Y+A],[X+A,Y+A]],'rgba(38,194,129,0.36)',{label:nums?nums[4]:'ab',ls:54,lc:C.green});
 poly(s,tR+0.35,[[X,Y+A],[X+A,Y+A],[X+A,Y+L],[X,Y+L]],'rgba(38,194,129,0.36)',{label:nums?nums[4]:'ab',ls:54,lc:C.green});
}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Die binomischen Formeln',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Die binomischen Formeln',86),198,C.red,4,k)});
 const w=write(s,[0.3,Wd(0,'ist a Quadrat')-0.1,Wd(0,'plus b Quadrat')-0.1],230,420,['(a + b)^2','= a^2','+ b^2'],120,C.ink);
 note(s,Wd(0,'fast alle')-0.2,230,580,'✍️ So schreiben es fast alle …',60,'#7A869A');
 cross(s,Wd(0,'falsch')-0.3,230+tw('(a + b)^2 = a^2 + b^2',120)+95,420,36);
 stampL(s,Wd(0,'falsch')-0.1,1500,420,'FALSCH!',100,-0.12);
 note(s,Wd(1,'Bild')-0.3,230,700,'👀 Ein Bild zeigt, was wirklich rauskommt',58,C.green);
 note(s,Wd(1,'alle drei')-0.3,230,790,'①  ②  ③  alle drei binomischen Formeln',58,C.blue);
 note(s,Wd(1,'Kopfrechentricks')-0.3,230,880,'🧠 99^2 im Kopf?  Kein Problem!',58,C.pur);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Was heißt hoch zwei?');
 note(s,Wd(3,'mit sich selbst')-0.3,230,320,'7^2 = 7 · 7     x^2 = x · x',64,C.ink);
 write(s,[Wd(3,'a plus b zum')-0.2,Wd(3,'a plus b mal')-0.1],230,430,['(a + b)^2','= (a + b) · (a + b)'],76,C.blue);
 const w1=write(s,[Wd(4,'Drei plus vier')-0.1,Wd(4,'Sieben zum')-0.1,Wd(4,'neunundvierzig')-0.1],230,570,['(3 + 4)^2','= 7^2','= 49'],76,C.ink);
 boxE(s,Wd(4,'neunundvierzig')+0.4,tokRect(w1,2,2,12),C.green,5);
 const w2=write(s,[Wd(5,'drei Quadrat plus')-0.1,Wd(5,'neun plus')-0.1,Wd(5,'fünfundzwanzig')-0.1],230,700,['3^2 + 4^2','= 9 + 16','= 25'],76,C.ink);
 cross(s,Wd(5,'fünfundzwanzig')+0.5,230+tw('3^2 + 4^2 = 9 + 16 = 25',76)+60,700,30);
 note(s,Wd(5,'fehlen')-0.2,1250,630,'49 − 25 = 24 fehlen!',70,C.red);
 note(s,Wd(5,'vergessen')-0.3,1250,730,'Was haben wir vergessen? 🤔',56,C.ink);
 note(s,Wd(6,'Punkte')-0.3,230,840,'😬 Der Punkte-Killer Nr. 1 in Klassenarbeiten',56,C.red);
 note(s,Wd(6,'Bild')-0.3,1250,840,'→ ein Bild hilft!',56,C.green);
}
// ---------- S2 Kap 2 ----------
camTo(E(7,-0.7),2);
{const s=2;headingE(s,E(7,0.2),2,'Das Bild, das alles erklärt');
 sqPic(s,{X:330,Y:300,A:330,B:220,tOut:Wd(8,'Quadrat mit')-0.3,tDiv:Wd(9,'teilen')-0.3,tA:Wd(9,'a mal a')-0.1,tB:Wd(9,'b mal b')-0.1,tR:Wd(10,'zwei Rechtecke')-0.2});
 note(s,Wd(8,'Seitenlänge')-0.1,1000,320,'Seite:  a + b',62,C.ink);
 note(s,Wd(8,'Fläche')-0.2,1000,410,'Fläche:  (a + b)^2',62,C.ink);
 note(s,Wd(10,'vergessen')-0.4,1000,500,'2 Rechtecke  a · b  ← vergessen fast alle!',54,C.red);
 const w=write(s,[Wd(11,'Zusammen')-0.1,Wd(11,'a Quadrat plus')-0.1,Wd(11,'zwei a b')-0.1,Wd(11,'plus b Quadrat')-0.1],1000,630,['(a + b)^2','= a^2','+ 2ab','+ b^2'],76,C.ink,{cols:[C.ink,CA_,C.green,CB_]});
 marker(s,Wd(11,'zwei a b')+0.2,tokRect(w,2,2,8));
 boxE(s,Wd(11,'erste binomische')-0.2,tokRect(w,0,3,16),C.green,5);
 note(s,Wd(11,'erste binomische')+0.3,1000,740,'= 1. binomische Formel',56,C.green);
 const w2=write(s,[Wd(12,'neun plus')-0.1,Wd(12,'zweimal zwölf')-0.1,Wd(12,'Zusammen')-0.1],1000,850,['9 + 16','+ 2 · 12','= 49'],64,C.ink);
 marker(s,Wd(12,'fehlenden')-0.1,tokRect(w2,1,1,8));check(s,Wd(12,'Passt')-0.1,1000+tw('9 + 16 + 2 · 12 = 49',64)+50,850,24);
 note(s,Wd(13,'großes Quadrat')-0.3,1480,740,'🧠 Bild merken!',56,C.pur);
}
// ---------- S3 Kap 3 ----------
camTo(E(14,-0.7),3);
{const s=3;headingE(s,E(14,0.2),3,'Ausmultiplizieren');
 note(s,Wd(15,'ohne Bild')-0.3,230,320,'(a + b) · (a + b)',76,C.ink);
 note(s,Wd(15,'Jeder Teil')-0.2,980,320,'→ jeder mit jedem ✕',60,C.blue);
 const w=write(s,[Wd(16,'a mal a')-0.1,Wd(16,'a mal b')-0.1,Wd(16,'b mal a')-0.1,Wd(16,'b mal b')-0.1],230,440,['= a·a','+ a·b','+ b·a','+ b·b'],72,C.ink,{cols:[CA_,C.green,C.green,CB_]});
 const w2=write(s,[Wd(16,'Zweimal')-0.3,Wd(16,'Zweimal')-0.1,Wd(16,'Zweimal')+0.1],1020,440,['= a^2','+ 2ab','+ b^2'],72,C.ink,{cols:[CA_,C.green,CB_]});
 marker(s,Wd(16,'genau wie')-0.1,tokRect(w2,1,1,8));
 const w3=write(s,[Wd(17,'x plus drei')-0.1,Wd(17,'Das ist x')-0.1,Wd(17,'zweimal drei')-0.1,Wd(17,'plus neun')-0.1],230,590,['(x + 3)^2','= x^2','+ 2·3·x','+ 9'],70,C.ink);
 const w4=write(s,[Wd(17,'Also')-0.1],230+tw('(x + 3)^2 = x^2 + 2·3·x + 9',70)+70,590,['= x^2 + 6x + 9'],70,C.green);
 boxE(s,Wd(17,'sechs x')+0.6,tokRect(w4,0,0,12),C.green,4);
 const w5=write(s,[Wd(18,'zwei x plus eins')-0.1,Wd(18,'vier x Quadrat')-0.1,Wd(18,'Mitte')+1.0,Wd(18,'Am Ende')-0.1],230,740,['(2x + 1)^2','= 4x^2','+ 4x','+ 1'],76,C.ink,{cols:[C.ink,CA_,C.green,CB_]});
 boxE(s,Wd(18,'Ergebnis')-0.1,tokRect(w5,0,3,14),C.green,5);
 note(s,Wd(18,'Vorne')-0.2,1150,700,'vorne:  (2x)^2 = 4x^2',50,CA_);
 note(s,Wd(18,'Mitte')-0.2,1150,770,'Mitte:  2 · 2x · 1 = 4x',50,C.green);
 note(s,Wd(18,'Am Ende')-0.2,1150,840,'hinten:  1^2 = 1',50,CB_);
}
// ---------- S4 Kap 4 ----------
camTo(E(19,-0.7),4);
{const s=4;headingE(s,E(19,0.2),4,'Die 2. binomische Formel');
 const w=write(s,[Wd(20,'a minus b')-0.1,Wd(20,'ergibt')-0.1,Wd(20,'minus zwei')-0.1,Wd(20,'plus b Quadrat')-0.1],230,340,['(a − b)^2','= a^2','− 2ab','+ b^2'],90,C.ink,{cols:[C.ink,CA_,C.red,CB_]});
 boxE(s,LE(20)-0.2,tokRect(w,0,3,16),C.green,5);
 marker(s,Wd(21,'mittlere')-0.2,tokRect(w,2,2,8));
 note(s,Wd(21,'Nur das')-0.2,1150,320,'⚠️ nur die Mitte wird minus!',56,C.red);
 note(s,Wd(21,'bleibt immer')-0.3,1150,400,'b^2 bleibt immer  +',56,C.green);
 note(s,Wd(21,'denn minus')-0.2,230,480,'denn:  (−b) · (−b) = +b^2',62,C.ink);
 const w2=write(s,[Wd(22,'x minus fünf')-0.1,Wd(22,'Das ist')-0.1,Wd(22,'minus zehn')-0.1,Wd(22,'fünfundzwanzig')-0.1],230,620,['(x − 5)^2','= x^2','− 10x','+ 25'],76,C.ink,{cols:[C.ink,CA_,C.red,CB_]});
 note(s,Wd(23,'Mit Zahlen')-0.2,230,740,'Test:',60,C.blue);
 write(s,[Wd(23,'zehn minus eins')-0.1,Wd(23,'neun zum')-0.1,Wd(23,'einundachtzig')-0.1],400,740,['(10 − 1)^2','= 9^2','= 81'],66,C.ink);
 const w3=write(s,[Wd(23,'hundert minus')-0.1,Wd(23,'Auch einundachtzig')-0.2],400,850,['100 − 20 + 1','= 81'],66,C.ink);
 check(s,Wd(23,'Auch einundachtzig')+0.4,400+tw('100 − 20 + 1 = 81',66)+50,850,26);
 note(s,Wd(23,'Formel')-0.2,1100,850,'← mit der Formel: a^2 − 2ab + b^2',50,'#7A869A');
}
// ---------- S5 CTA ----------
camTo(E(24,-0.7),5);
{const s=5;
 note(s,E(24,0.0),W/2,230,'Kurze Pause! ✋',110,C.red,{align:'c'});
 const btn=(t0,x,y,w,col,txt,ts)=>{custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-w/2,-70,w,140,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(ts||76);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)};
 btn(Wd(24,'Like')-0.2,620,470,420,'#1D6FE0','👍 Like',80);
 btn(Wd(24,'abonnier')-0.2,1300,470,520,'#E8344E','🔔 Abonnieren',76);
 note(s,Wd(24,'Woche')-0.4,W/2,660,'Jede Woche neue Mathe-Themen – einfach erklärt',62,C.ink,{align:'c'});
 note(s,Wd(24,'Tipps')-0.4,W/2,750,'+ Tipps für deine nächste Klassenarbeit ✏️',58,C.green,{align:'c'});
 note(s,Wd(24,'coolste')-0.6,W/2,860,'Gleich: die coolste Formel  →',60,C.blue,{align:'c'});
}
// ---------- S6 Kap 5 ----------
camTo(E(25,-0.7),6);
{const s=6;headingE(s,E(25,0.2),5,'Die 3. binomische Formel');
 const w=write(s,[Wd(26,'a plus b mal')-0.1,Wd(26,'Ergebnis')-0.1,Wd(26,'minus b Quadrat')-0.1],230,340,['(a + b)(a − b)','= a^2','− b^2'],90,C.ink,{cols:[C.ink,CA_,CB_]});
 boxE(s,LE(26)-0.2,tokRect(w,0,2,16),C.green,5);
 note(s,Wd(26,'Schönes')-0.2,1250,340,'✨ ohne Mitte!',62,C.pur);
 const w2=write(s,[Wd(27,'Ausmultiplizieren')-0.1,Wd(27,'minus a b')-0.1,Wd(27,'plus a b')-0.1,Wd(27,'Die heben')-0.6],230,520,['= a^2','− ab','+ ab','− b^2'],80,C.ink,{cols:[CA_,C.red,C.green,CB_]});
 strike(s,Wd(27,'heben sich')-0.1,tokRect(w2,1,1,6));strike(s,Wd(27,'heben sich')+0.2,tokRect(w2,2,2,6));
 note(s,Wd(27,'heben sich')+0.1,230+tw('= a^2 − ab + ab − b^2',80)+50,520,'→ heben sich auf = 0',56,C.red);
 note(s,Wd(27,'Übrig')-0.2,230,640,'Übrig:  a^2 − b^2',66,C.green);
 const w3=write(s,[Wd(28,'x plus sieben')-0.1,Wd(28,'Das ist')-0.1,Wd(28,'neunundvierzig')-0.1],230,790,['(x + 7)(x − 7)','= x^2','− 49'],80,C.ink,{cols:[C.ink,CA_,CB_]});
 boxE(s,Wd(28,'Ohne')-0.1,tokRect(w3,0,2,14),C.green,5);
 note(s,Wd(28,'Ohne')-0.1,1150,790,'7^2 = 49   ·   kein Mittelteil 🎉',56,C.green);
}
// ---------- S7 Kap 6 ----------
camTo(E(29,-0.7),7);
{const s=7;headingE(s,E(29,0.2),6,'Kopfrechnen wie ein Profi');
 const w=write(s,[Wd(30,'neunundneunzig')-0.1,Wd(30,'hundert minus')-0.1,Wd(30,'zehntausend')-0.1,Wd(30,'Also')-0.1],230,330,['99^2','= (100 − 1)^2','= 10000 − 200 + 1','= 9801'],70,C.ink,{cols:[C.ink,C.blue,C.ink,C.green]});
 marker(s,Wd(30,'neuntausend')+0.6,tokRect(w,3,3,8));
 note(s,Wd(30,'hundert minus')+0.3,230,420,'2. Formel',44,C.blue);
 const w2=write(s,[Wd(31,'einundzwanzig')-0.1,Wd(31,'zwanzig plus')-0.1,Wd(31,'Vierhundert plus')-0.1,Wd(31,'gleich')-0.1],230,540,['21^2','= (20 + 1)^2','= 400 + 40 + 1','= 441'],70,C.ink,{cols:[C.ink,C.blue,C.ink,C.green]});
 marker(s,LE(31)-0.2,tokRect(w2,3,3,8));
 note(s,Wd(31,'zwanzig plus')+0.3,230,630,'1. Formel',44,C.blue);
 const w3=write(s,[Wd(32,'neunundvierzig mal')-0.1,Wd(32,'fünfzig minus')-0.1,Wd(32,'zweitausendfünfhundert')-0.1,Wd(32,'also zweitausend')-0.1],230,750,['49 · 51','= (50 − 1)(50 + 1)','= 2500 − 1','= 2499'],70,C.ink,{cols:[C.ink,C.blue,C.ink,C.green]});
 marker(s,Wd(32,'In zwei')-0.1,tokRect(w3,3,3,8));
 note(s,Wd(32,'Dritte Formel')-0.2,230,840,'3. Formel',44,C.blue);
 note(s,Wd(32,'In zwei')-0.1,1450,840,'⚡ in 2 Sekunden!',60,C.red);
}
// ---------- S8 Kap 7 ----------
camTo(E(33,-0.7),8);
{const s=8;headingE(s,E(33,0.2),7,'Die Formeln rückwärts');
 note(s,Wd(34,'andere Richtung')-0.3,1250,150,'⟵ andersrum erkennen',52,C.blue);
 const w=write(s,[Wd(34,'x Quadrat plus')-0.1,Wd(34,'acht x')-0.1,Wd(34,'plus sechzehn')-0.1],230,340,['x^2','+ 8x','+ 16'],84,C.ink,{cols:[CA_,C.green,CB_]});
 note(s,Wd(34,'sechzehn gleich')-0.2,230,460,'16 = 4^2',60,CB_);
 note(s,Wd(34,'acht x ist')-0.2,560,460,'8x = 2 · 4 · x',60,C.green);
 const w2=write(s,[Wd(34,'Also ist')-0.1],230+tw('x^2 + 8x + 16',84)+60,340,['= (x + 4)^2'],84,C.green);boxE(s,LE(34)-0.2,tokRect(w2,0,0,14),C.green,5);
 const w3=write(s,[Wd(35,'x Quadrat minus')-0.1,Wd(35,'Also x plus')-0.1],230,620,['x^2 − 36','= (x + 6)(x − 6)'],84,C.ink,{cols:[C.ink,C.green]});
 note(s,Wd(35,'a Quadrat minus')-0.2,1250,620,'a^2 − b^2  mit  b = 6',56,C.blue);
 boxE(s,LE(35)-0.2,tokRect(w3,0,1,14),C.green,5);
 tipBox(s,Wd(36,'Profi')-0.3,210,740,1500,150);
 note(s,Wd(36,'Profi')-0.1,250,790,'💡 Profi-Tipp',56,'#9A7A00');
 note(s,Wd(36,'Quadrat ergänzen')-0.4,250,860,'brauchst du beim Quadrat ergänzen & bei der pq-Formel!',52,C.ink);
}
// ---------- S9 Kap 8 ----------
camTo(E(37,-0.7),9);
{const s=9;headingE(s,E(37,0.2),8,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,62,C.ink);const wx=290+tw(wrongS,62);cross(s,crossT,wx+52,y,28);
   const x2=wx+115;note(s,rightT,x2,y,rightS,62,C.green);check(s,checkT,x2+tw(rightS,62)+45,y,26)};
 row(330,'#1',E(38,0),Wd(38,'a plus b')-0.3,'(a + b)^2 = a^2 + b^2',Wd(38,'mittlere')-0.3,Wd(38,'zwei a b')-0.3,'→  a^2 + 2ab + b^2',LE(38)-0.2);
 row(560,'#2',E(39,0),Wd(39,'x minus drei')-0.3,'(x − 3)^2 = x^2 − 9',Wd(39,'Richtig')-0.3,Wd(39,'Richtig')+0.1,'→  x^2 − 6x + 9',LE(39)-0.2);
 row(790,'#3',E(40,0),Wd(40,'x plus fünf')-0.3,'(x + 5)^2 = x^2 + 5x + 25',Wd(40,'nicht fünf')-0.2,Wd(40,'zehn x')-0.3,'→  10x',LE(40)-0.2);
 note(s,Wd(40,'Zwei im')-0.3,290,880,'Mitte = 2 · a · b  (die 2 nie vergessen!)',48,'#7A869A');
}
// ---------- S10 Übung ----------
camTo(E(41,-0.7),10);
{const s=10;headingE(s,E(41,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(41,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(42,'Aufgabe',1),'a)','(x + 4)^2 = ?'],[Wd(42,'Aufgabe',2),'b)','(y − 6)^2 = ?'],[Wd(42,'Aufgabe',3),'c)','31 · 29 = ?   (im Kopf!)']];
 T.forEach(([t0,lb,str],i)=>{const y=310+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,68,C.ink)});
 const T0=LE(42)+0.3,T1=E(43,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(43,'x Quadrat')-0.2,'= x^2 + 8x + 16',LE(43)],[Wd(44,'y Quadrat')-0.2,'= y^2 − 12y + 36',LE(44)],[Wd(45,'dreißig plus')-0.2,'= (30 + 1)(30 − 1) = 900 − 1 = 899',LE(45)]];
 SOL.forEach(([t0,str,tc],i)=>{const y=310+i*200+85;note(s,t0,310,y,str,60,C.green);check(s,tc-0.2,310+tw(str,60)+40,y,26)});
 note(s,Wd(46,'Kommentare')-0.6,200,890,'Alles richtig?  →  schreib’s in die Kommentare 💬',56,C.blue);
}
// ---------- S11 Summary ----------
camTo(E(47,-0.7),11);
{const s=11;headingE(s,E(47,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(47,'a plus b zum')-0.3,'①  (a + b)^2 = a^2 + 2ab + b^2',C.ink],[Wd(47,'Bei minus')-0.3,'②  (a − b)^2 = a^2 − 2ab + b^2',C.blue],[Wd(47,'Und a plus')-0.3,'③  (a + b)(a − b) = a^2 − b^2',C.green],[Wd(47,'Vergiss')-0.3,'⚠️  nie das mittlere Glied  2ab  vergessen!',C.red]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*105,str,62,col));
 camTo(E(48,-0.4),11,180);
 custom(s,E(48,0),t=>{const k=eo(prog(t,E(48,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(48,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(48,'Punkt vor')-0.3,270,980,'Punkt vor Strich',62,C.blue);
 note(s,Wd(48,'Internet')-0.4,270,1060,'6 : 2(1 + 2) = ?  🤯',62,C.red);
 custom(s,Wd(48,'Abonnier')-0.2,t=>{const k=prog(t,Wd(48,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(48,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
