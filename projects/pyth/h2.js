// ===================== CONTENT: Pythagoras =====================
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
function tri(s,t0,P,dur,cols){dur=dur||0.45;seg(s,t0,P[0],P[1],cols?cols[0]:C.ink,4,dur);seg(s,t0+dur,P[1],P[2],cols?cols[1]:C.ink,4,dur);seg(s,t0+2*dur,P[2],P[0],cols?cols[2]:C.ink,4,dur)}
const CHAPS=[[2,1,'Das rechtwinklige Dreieck'],[7,2,'Was bedeutet a²?'],[13,3,'Der Beweis zum Sehen'],[18,4,'Die Hypotenuse berechnen'],[23,5,'Eine Kathete berechnen'],[29,6,'Pythagoras im Alltag'],[33,7,'Die Zauberzahlen'],[37,8,'Die 3 häufigsten Fehler']];
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};const D2R=Math.PI/180;const CA_=C.blue,CB_=C.org,CC_=C.red;
// filled polygon helper
function poly(s,t0,P,fill,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,o.dur||0.5));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.5);if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle=fill;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
  if(o.stroke){ctx.strokeStyle=o.stroke;ctx.lineWidth=3;ctx.stroke()}
  if(o.grid){const[n,A,B,D]=o.grid;ctx.strokeStyle='rgba(29,59,110,0.45)';ctx.lineWidth=1.6;for(let i=1;i<n;i++){const f=i/n;ctx.beginPath();ctx.moveTo(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f);ctx.lineTo(D[0]+(B[0]-A[0])*f,D[1]+(B[1]-A[1])*f);ctx.stroke();ctx.beginPath();ctx.moveTo(A[0]+(D[0]-A[0])*f,A[1]+(D[1]-A[1])*f);ctx.lineTo(B[0]+(D[0]-A[0])*f,B[1]+(D[1]-A[1])*f);ctx.stroke()}}
  if(o.label){ctx.font=HF(o.ls||48);ctx.fillStyle=o.lc||C.ink;ctx.textAlign='center';ctx.textBaseline='middle';const cx=P.reduce((a,p)=>a+p[0],0)/P.length,cy=P.reduce((a,p)=>a+p[1],0)/P.length;ftm(o.label,cx,cy)}ctx.restore()})}
// rearrangement proof: big square at (X,Y), legs a,b (units), scale u
function proof(s,o){const{X,Y,a,b,u,tIn,tC,tMove,tAB,tEnd}=o;const L=(a+b)*u,A=a*u,B=b*u;
 seg(s,tIn,[X,Y],[X+L,Y],C.ink,4,0.4);seg(s,tIn+0.2,[X+L,Y],[X+L,Y+L],C.ink,4,0.4);seg(s,tIn+0.4,[X+L,Y+L],[X,Y+L],C.ink,4,0.4);seg(s,tIn+0.6,[X,Y+L],[X,Y],C.ink,4,0.4);
 custom(s,tIn+0.8,t=>{const k=eo(prog(t,tIn+0.8,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.font=HF(40);ctx.textAlign='center';ctx.fillStyle=CA_;ctx.fillText('a',X+A/2,Y-18);ctx.fillStyle=CB_;ctx.fillText('b',X+A+B/2,Y-18);ctx.fillStyle=CA_;ctx.fillText('a',X-26,Y+B+A/2+12);ctx.fillStyle=CB_;ctx.fillText('b',X-26,Y+B/2+12);hline(X+A,Y-12,X+A,Y+12,C.ink,3,1);hline(X-12,Y+B,X+12,Y+B,C.ink,3,1);ctx.restore()});
 // c^2 inner square (config A) & a^2, b^2 (config B)
 const P=(x,y)=>[X+x*u,Y+y*u],Lu=a+b;
 poly(s,tC,[P(a,0),P(Lu,a),P(b,Lu),P(0,b)],'rgba(214,58,58,0.28)',{tOut:tMove,label:'c^2',ls:64,lc:CC_});
 poly(s,tAB,[P(0,0),P(a,0),P(a,a),P(0,a)],'rgba(77,163,255,0.4)',{label:'a^2',ls:52,lc:CA_});
 poly(s,tAB+0.3,[P(a,a),P(Lu,a),P(Lu,Lu),P(a,Lu)],'rgba(255,159,67,0.4)',{label:'b^2',ls:64,lc:CB_});
 // triangles: [P0,ang0] -> [P1,ang1]; a-leg dir angle, b-leg = a rotated +90 (y-down)
 const T=[[[0,0],0,[a,a],-90],[[Lu,0],90,[Lu,0],90],[[Lu,Lu],180,[a,Lu],180],[[0,Lu],-90,[0,a],0]];
 T.forEach(([p0,a0,p1,a1],i)=>{const ti=tIn+1.0+i*0.25;WRITES.push([ti,0.3]);custom(s,ti,t=>{const k=eo(prog(t,ti,0.4));if(k<=0)return;const m=eio(prog(t,tMove+i*0.15,1.6));const px=lerp(p0[0],p1[0],m),py=lerp(p0[1],p1[1],m),an=lerp(a0,a1,m)*D2R;
   const O=P(px,py),va=[Math.cos(an),Math.sin(an)],vb=[-va[1],va[0]];const Pa=[O[0]+va[0]*A,O[1]+va[1]*A],Pb=[O[0]+vb[0]*B,O[1]+vb[1]*B];
   ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(38,194,129,0.35)';ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(Pa[0],Pa[1]);ctx.lineTo(Pb[0],Pb[1]);ctx.closePath();ctx.fill();ctx.strokeStyle=C.green;ctx.lineWidth=3.5;ctx.stroke();ctx.restore()})});
 if(tEnd)custom(s,tEnd,t=>{const k=eo(prog(t,tEnd,0.5));if(k<=0)return;hrect(X-10,Y-10,L+20,L+20,C.green,5,k)});
}
// triangle with squares on sides (3-4-5), right angle at Cc, a up, b right
function sqTri(s,o){const{cx,cy,u,t0,ta,tb,tc}=o;const Cc=[cx,cy],Bv=[cx,cy-3*u],Av=[cx+4*u,cy];
 tri(s,t0,[Cc,Av,Bv],0.35,[CB_,CC_,CA_]);rsq(s,t0+1,Cc,[1,0],[0,-1],26);
 poly(s,ta,[[cx-3*u,cy-3*u],[cx,cy-3*u],[cx,cy],[cx-3*u,cy]],'rgba(77,163,255,0.35)',{stroke:CA_,grid:[3,[cx-3*u,cy-3*u],[cx,cy-3*u],[cx-3*u,cy]],label:'9',ls:56,lc:CA_});
 poly(s,tb,[[cx,cy],[cx+4*u,cy],[cx+4*u,cy+4*u],[cx,cy+4*u]],'rgba(255,159,67,0.35)',{stroke:CB_,grid:[4,[cx,cy],[cx+4*u,cy],[cx,cy+4*u]],label:'16',ls:56,lc:CB_});
 const n=[3*u,-4*u];const Q=[Bv,Av,[Av[0]+n[0],Av[1]+n[1]],[Bv[0]+n[0],Bv[1]+n[1]]];
 poly(s,tc,Q,'rgba(214,58,58,0.28)',{stroke:CC_,grid:[5,Bv,Av,Q[3]],label:'25',ls:60,lc:CC_});
}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Der Satz des Pythagoras',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Der Satz des Pythagoras',86),198,C.red,4,k)});
 const X=260,Y=330,Wt=640,Ht=360;
 custom(s,0.3,t=>{const k=eo(prog(t,0.3,0.6));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#1b2333';ctx.beginPath();ctx.roundRect(X-14,Y-14,Wt+28,Ht+28,14);ctx.fill();const g=ctx.createLinearGradient(X,Y,X+Wt,Y+Ht);g.addColorStop(0,'#2b5a9e');g.addColorStop(1,'#7cc4ff');ctx.fillStyle=g;ctx.fillRect(X,Y,Wt,Ht);ctx.fillStyle='#1b2333';ctx.fillRect(X+Wt/2-60,Y+Ht+14,120,30);ctx.fillRect(X+Wt/2-140,Y+Ht+40,280,14);ctx.restore()});WRITES.push([0.3,0.5]);
 seg(s,Wd(0,'Diagonale')-0.4,[X,Y+Ht],[X+Wt,Y],C.red,6,0.6);note(s,Wd(0,'Diagonale')-0.1,X+Wt/2+30,Y+Ht/2-40,'55 Zoll',56,'#fff');
 note(s,Wd(0,'breit')-0.4,X+Wt/2,Y+Ht+110,'Breite = ?',56,C.red,{align:'c'});
 write(s,[Wd(1,'a Quadrat')-0.1,Wd(1,'b Quadrat')-0.1,Wd(1,'c Quadrat')-0.1],1080,470,['a^2 +','b^2 =','c^2'],120,C.ink,{cols:[CA_,CB_,CC_]});
 note(s,Wd(1,'Satz')-0.2,1080,620,'= Satz des Pythagoras',62,C.ink);
 note(s,Wd(1,'Beweis')-0.3,1080,730,'+ Beweis zum Sehen 👀',62,C.green);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Das rechtwinklige Dreieck');
 const Cc=[330,800],Av=[930,800],Bv=[330,380];
 tri(s,Wd(3,'rechtwinkligen')-0.3,[Cc,Av,Bv],0.35);rsq(s,Wd(3,'neunzig')-0.2,Cc,[1,0],[0,-1],40);lab(s,Wd(3,'neunzig'),395,745,'90°',38);
 hi(s,Wd(4,'Katheten')-0.4,Cc,Bv,CA_);hi(s,Wd(4,'Katheten')-0.2,Cc,Av,CB_);note(s,Wd(4,'a und b')-0.2,270,590,'a',64,CA_,{align:'r'});lab(s,Wd(4,'a und b'),630,860,'b',64,CB_);
 note(s,Wd(4,'Katheten')+0.2,1080,330,'Katheten:  a  und  b',62,C.ink);
 hi(s,Wd(5,'längste')-0.2,Bv,Av,CC_);lab(s,Wd(5,'nennen')-0.2,660,555,'c',68,CC_);
 note(s,Wd(5,'Hypotenuse')-0.3,1080,430,'Hypotenuse:  c  (längste Seite)',62,CC_);
 const w=write(s,[Wd(6,'a Quadrat')-0.1,Wd(6,'b Quadrat')-0.1,Wd(6,'c Quadrat')-0.1],1080,600,['a^2 +','b^2 =','c^2'],110,C.ink,{cols:[CA_,CB_,CC_]});
 note(s,Wd(6,'bedeuten')-0.5,1080,760,'… aber was heißt das?',58,'#7A869A');
}
// ---------- S2 Kap 2 ----------
camTo(E(7,-0.7),2);
{const s=2;headingE(s,E(7,0.2),2,'Was bedeutet a²?');
 note(s,Wd(8,'Seitenlänge')-0.3,1150,300,'a^2 = a · a  =  Fläche',62,C.ink);
 sqTri(s,{cx:560,cy:640,u:52,t0:Wd(9,'Katheten')-0.3,ta:Wd(9,'malen')-0.2,tb:Wd(10,'vier mal vier')-0.4,tc:Wd(11,'Hypotenuse')-0.3});
 note(s,Wd(9,'neun')-0.3,1150,410,'3^2 = 9 Kästchen',62,CA_);
 note(s,Wd(10,'sechzehn')-0.3,1150,500,'4^2 = 16 Kästchen',62,CB_);
 note(s,Wd(10,'Zusammen')-0.1,1150,590,'9 + 16 = 25',62,C.ink);
 note(s,Wd(11,'genau')-0.2,1150,690,'c^2 = 25  →  c = 5',62,CC_);check(s,Wd(11,'fünf lang')+0.2,1150+tw('c^2 = 25  →  c = 5',62)+40,690,26);
 const w=note(s,Wd(12,'kleinen')-0.4,1150,820,'a^2 + b^2 = c^2',80,C.green);boxE(s,Wd(12,'große Quadrat')+0.1,[1130,770,tw('a^2 + b^2 = c^2',80)+40,100],C.green,5);
}
// ---------- S3 Kap 3 ----------
camTo(E(13,-0.7),3);
{const s=3;headingE(s,E(13,0.2),3,'Der Beweis zum Sehen');
 const tMove=Wd(16,'schieben')-0.3;
 proof(s,{X:330,Y:290,a:3,b:4,u:75,tIn:Wd(14,'Quadrat')-0.4,tC:Wd(15,'schräges')-0.3,tMove,tAB:tMove+2.3,tEnd:Wd(17,'Bewiesen')-0.4});
 note(s,Wd(14,'Seite')-0.2,1050,320,'großes Quadrat:  Seite a + b',60,C.ink);
 note(s,Wd(15,'vier')-0.2,1050,410,'+ 4 gleiche Dreiecke',60,C.green);
 note(s,Wd(15,'freie')-0.3,1050,500,'frei:  c^2',66,CC_);
 note(s,Wd(16,'zwei Quadrate')-0.4,1050,600,'umgelegt → frei:  a^2 + b^2',62,C.blue);
 const w=note(s,Wd(17,'a Quadrat plus')-0.3,1050,740,'a^2 + b^2 = c^2',84,C.green);boxE(s,Wd(17,'Bewiesen')-0.2,[1030,690,tw('a^2 + b^2 = c^2',84)+40,100],C.green,5);
 note(s,Wd(17,'Bewiesen'),1050,860,'Bewiesen! ✓',66,C.green);
}
// ---------- S4 Kap 4 ----------
camTo(E(18,-0.7),4);
{const s=4;headingE(s,E(18,0.2),4,'Die Hypotenuse berechnen');
 const Cc=[1250,800],Av=[1610,800],Bv=[1250,530];
 tri(s,Wd(19,'Katheten')-0.3,[Cc,Av,Bv],0.3,[CB_,CC_,CA_]);rsq(s,Wd(19,'Katheten')+0.6,Cc,[1,0],[0,-1],28);
 note(s,Wd(19,'sechs')-0.1,1225,665,'6',56,CA_,{align:'r'});lab(s,Wd(19,'acht')-0.1,1430,855,'8',56,CB_);lab(s,Wd(19,'Hypotenuse')-0.2,1470,630,'c = ?',56,CC_);
 note(s,Wd(19,'Katheten')-0.2,230,320,'a = 6 cm,   b = 8 cm,   c = ?',64,C.ink);
 note(s,Wd(20,'quadrieren')-0.3,170,450,'①',56,C.red);note(s,Wd(20,'Sechs Quadrat')-0.2,275,450,'6^2 = 36,    8^2 = 64',66,C.ink);
 note(s,Wd(21,'addieren')-0.3,170,580,'②',56,C.red);note(s,Wd(21,'Sechsunddreißig plus')-0.2,275,580,'c^2 = 36 + 64 = 100',66,C.ink);
 note(s,Wd(22,'Wurzel')-0.4,170,710,'③',56,C.red);
 const w=write(s,[Wd(22,'Wurzel aus')-0.1,Wd(22,'zehn')-0.2],275,710,['c = √100','= 10 cm'],76,C.green);boxE(s,Wd(22,'Zentimeter')-0.1,tokRect(w,1,1,14),C.green,5);

}
// ---------- S5 Kap 5 ----------
camTo(E(23,-0.7),5);
{const s=5;headingE(s,E(23,0.2),5,'Eine Kathete berechnen');
 const Cc=[1250,820],Av=[1730,820],Bv=[1250,620];
 tri(s,Wd(24,'Hypotenuse')-0.3,[Cc,Av,Bv],0.3,[CB_,CC_,CA_]);rsq(s,Wd(24,'Hypotenuse')+0.6,Cc,[1,0],[0,-1],26);
 lab(s,Wd(24,'dreizehn')-0.1,1520,680,'13',56,CC_);note(s,Wd(24,'fünf')-0.1,1225,725,'5',56,CA_,{align:'r'});lab(s,Wd(24,'andere')-0.1,1490,875,'b = ?',56,CB_);
 note(s,Wd(24,'Hypotenuse')-0.2,230,320,'c = 13,   a = 5,   b = ?',64,C.ink);
 note(s,Wd(25,'umstellen')-0.3,230,450,'b^2 = c^2 − a^2',72,C.blue);
 note(s,Wd(25,'hundertneunundsechzig')-0.3,230,570,'b^2 = 169 − 25 = 144',68,C.ink);
 const w=write(s,[Wd(26,'Wurzel')-0.2,Wd(26,'zwölf')-0.3],230,690,['b = √144','= 12'],76,C.green);boxE(s,Wd(26,'zwölf lang')-0.1,tokRect(w,1,1,14),C.green,5);
 note(s,Wd(27,'längste')-0.3,230,830,'c gesucht → addieren (+)',56,C.green);note(s,Wd(27,'kürzere')-0.3,900,830,'a oder b gesucht → subtrahieren (−)',56,C.red);
}
// ---------- S5 CTA ----------
camTo(E(28,-0.7),6);
{const s=6;
 note(s,E(28,0.0),W/2,230,'Kurze Pause! ✋',110,C.red,{align:'c'});
 const btn=(t0,x,y,w,col,txt,ts)=>{custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-w/2,-70,w,140,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(ts||76);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)};
 btn(Wd(28,'Like')-0.2,620,470,420,'#1D6FE0','👍 Like',80);
 btn(Wd(28,'abonnier')-0.2,1300,470,520,'#E8344E','🔔 Abonnieren',76);
 note(s,Wd(28,'Woche')-0.4,W/2,660,'Jede Woche neue Mathe-Themen – einfach erklärt',62,C.ink,{align:'c'});
 note(s,Wd(28,'Tipps')-0.4,W/2,750,'+ Tipps für deine nächste Klassenarbeit ✏️',58,C.green,{align:'c'});
 note(s,Wd(28,'echten')-0.6,W/2,860,'Weiter geht’s  →',60,C.blue,{align:'c'});
}
// ---------- S7 Kap 6 ----------
camTo(E(29,-0.7),7);
{const s=7;headingE(s,E(29,0.2),6,'Pythagoras im Alltag');
 const W0=[560,280],G0=[560,800];
 seg(s,Wd(30,'Leiter')-0.4,[560,260],[560,800],C.ink,6,0.4);seg(s,Wd(30,'Leiter')-0.3,[200,800],[700,800],C.ink,4,0.4);
 const F0=[560-3*100,800],T0=[560,800-4*100];
 custom(s,Wd(30,'Leiter')-0.1,t=>{const k=eo(prog(t,Wd(30,'Leiter')-0.1,0.7));if(k<=0)return;const ux=T0[0]-F0[0],uy=T0[1]-F0[1],L=Math.hypot(ux,uy),nx=-uy/L*12,ny=ux/L*12;ctx.save();for(const sg of[-1,1])hline(F0[0]+nx*sg,F0[1]+ny*sg,F0[0]+nx*sg+ux*k,F0[1]+ny*sg+uy*k,C.brown,5,1,sg);for(let f=0.1;f<k;f+=0.11)hline(F0[0]-nx+ux*f,F0[1]-ny+uy*f,F0[0]+nx+ux*f,F0[1]+ny+uy*f,C.brown,4,1,f*40);ctx.restore()});WRITES.push([Wd(30,'Leiter')-0.1,0.7]);
 note(s,Wd(30,'fünf Meter')-0.2,390,560,'5 m',52,CC_,{align:'r'});lab(s,Wd(30,'drei Meter')-0.2,410,850,'3 m',50,CB_);
 note(s,Wd(30,'hoch')-0.4,590,600,'h = ?',52,CA_);
 note(s,Wd(30,'Fünf Quadrat')-0.2,590,700,'h = √(25 − 9) = 4 m',46,C.green);
 const X=1150,Y=320,Wt=560,Ht=315;
 custom(s,Wd(31,'Fernseher')-0.3,t=>{const k=eo(prog(t,Wd(31,'Fernseher')-0.3,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#1b2333';ctx.beginPath();ctx.roundRect(X-12,Y-12,Wt+24,Ht+24,12);ctx.fill();const g=ctx.createLinearGradient(X,Y,X+Wt,Y+Ht);g.addColorStop(0,'#2b5a9e');g.addColorStop(1,'#7cc4ff');ctx.fillStyle=g;ctx.fillRect(X,Y,Wt,Ht);ctx.restore()});WRITES.push([Wd(31,'Fernseher')-0.3,0.5]);
 seg(s,Wd(31,'fünfundfünfzig')-0.3,[X,Y+Ht],[X+Wt,Y],C.red,5,0.5);note(s,Wd(31,'fünfundfünfzig'),X+Wt/2+20,Y+Ht/2-30,'55"',52,'#fff');
 note(s,Wd(31,'sechzehn zu neun')-0.3,X+Wt+30,Y+Ht/2,'9',50,C.ink);lab(s,Wd(31,'sechzehn zu neun')-0.3,X+Wt/2,Y-40,'16',50,C.ink);
 lab(s,Wd(31,'achtundvierzig')-0.3,X+Wt/2,Y+Ht+70,'Breite ≈ 48"  ≈ 122 cm',54,C.green);
 note(s,Wd(32,'Handwerker')-0.3,1150,800,'🔨 3–4–5-Trick: Ecke prüfen',54,C.ink);note(s,Wd(32,'Diagonale')-0.3,1150,880,'Diagonale 5 → genau 90°',50,C.green);
}
// ---------- S8 Kap 7 ----------
camTo(E(33,-0.7),8);
{const s=8;headingE(s,E(33,0.2),7,'Die Zauberzahlen');
 const R=[[Wd(34,'Drei, vier')-0.1,'3, 4, 5','9 + 16 = 25'],[Wd(35,'fünf, zwölf')-0.2,'5, 12, 13','25 + 144 = 169'],[Wd(35,'acht, fünfzehn')-0.2,'8, 15, 17','64 + 225 = 289'],[Wd(35,'sechs, acht, zehn')-0.2,'6, 8, 10','= 2 · (3, 4, 5)']];
 R.forEach(([t0,a,b],i)=>{const y=320+i*110;note(s,t0,250,y,a,72,i==3?C.pur:C.ink);note(s,t0+0.5,650,y,b,62,i==3?C.pur:C.green);if(i<3)check(s,t0+1.1,650+tw(b,62)+40,y,24)});
 note(s,Wd(34,'Tripel')-0.4,1250,320,'= pythagoreische Tripel',56,C.red);
 custom(s,Wd(36,'Babylonier')-0.4,t=>{const k=eo(prog(t,Wd(36,'Babylonier')-0.4,0.6));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.translate(1430,640);ctx.rotate(-0.05);ctx.fillStyle='#C9A271';ctx.beginPath();ctx.roundRect(-190,-120,380,240,30);ctx.fill();ctx.strokeStyle='#8a6a40';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#7a5a32';for(let r=0;r<5;r++)for(let c=0;c<7;c++){if(hsh(r,c)>0.75)continue;ctx.beginPath();ctx.moveTo(-160+c*48,-88+r*42);ctx.lineTo(-146+c*48,-80+r*42);ctx.lineTo(-160+c*48,-72+r*42);ctx.fill()}ctx.restore()});WRITES.push([Wd(36,'Babylonier')-0.4,0.6]);
 note(s,Wd(36,'viertausend')-0.4,1430,820,'Babylonier, ca. 1800 v. Chr.',50,'#7A5A32',{align:'c'});
}
// ---------- S9 Kap 8 ----------
camTo(E(37,-0.7),9);
{const s=9;headingE(s,E(37,0.2),8,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,64,C.ink);const wx=290+tw(wrongS,64);cross(s,crossT,wx+52,y,28);
   const x2=wx+115;note(s,rightT,x2,y,rightS,64,C.green);check(s,checkT,x2+tw(rightS,64)+45,y,26)};
 row(330,'#1',E(38,0),Wd(38,'a plus b')-0.3,'c = 3 + 4 = 7',Wd(38,'sieben')+0.2,Wd(38,'Hypotenuse')-0.3,'→  c = √(9 + 16) = 5',Wd(38,'Quadrate')+0.2);
 row(560,'#2',E(39,0),Wd(39,'Wenn')-0.3,'c^2 = 25 → c = 25',Wd(39,'nicht')+0.2,Wd(39,'sondern')-0.2,'→  c = 5',Wd(39,'sondern')+0.6);
 row(790,'#3',E(40,0),Wd(40,'addieren')-0.4,'b^2 = 13^2 + 5^2',Wd(40,'subtrahieren')-0.2,Wd(40,'kürzer')-0.5,'→  13^2 − 5^2',Wd(40,'Hypotenuse')+0.2);
}
// ---------- S10 Übung ----------
camTo(E(41,-0.7),10);
{const s=10;headingE(s,E(41,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(41,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(42,'Aufgabe',1),'a)','a = 9,  b = 12   →   c = ?'],[Wd(42,'Aufgabe',2),'b)','c = 10,  a = 6   →   b = ?'],[Wd(42,'Aufgabe',3),'c)','7, 24, 25  –  rechtwinklig?']];
 T.forEach(([t0,lb,str],i)=>{const y=330+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,68,C.ink)});
 const T0=LE(42)+0.3,T1=E(43,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(43,'einundachtzig')-0.2,'c = √(81 + 144) = √225 = 15',Wd(43,'fünfzehn')],[Wd(44,'hundert minus')-0.2,'b = √(100 − 36) = √64 = 8',Wd(44,'acht')],[Wd(45,'neunundvierzig')-0.2,'49 + 576 = 625 = 25^2  →  ja!',Wd(45,'rechtwinklig')]];
 SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200+80;note(s,t0,310,y,str,60,C.green);check(s,tc+0.3,310+tw(str,60)+40,y,26)});
 note(s,Wd(46,'Kommentare')-0.6,200,885,'Alles richtig?  →  schreib’s in die Kommentare 💬',56,C.blue);
}
// ---------- S11 Summary ----------
camTo(E(47,-0.7),11);
{const s=11;headingE(s,E(47,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(47,'rechtwinkligen')-0.4,'• nur im rechtwinkligen Dreieck:  a^2 + b^2 = c^2',C.ink],[Wd(47,'Flächen')-0.6,'• Quadrate = echte Flächen  (Umleg-Beweis)',C.green],[Wd(47,'addieren')-0.6,'• c gesucht: +    ·    a oder b gesucht: −',C.blue],[Wd(47,'Wurzel')-0.6,'• am Ende: Wurzel ziehen!',C.red]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,58,col));
 camTo(E(48,-0.4),11,180);
 custom(s,E(48,0),t=>{const k=eo(prog(t,E(48,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(48,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(48,'binomischen')-0.4,270,1020,'(a + b)^2 = a^2 + b^2 ?  ❌',64,C.blue);
 custom(s,Wd(48,'Abonnier')-0.2,t=>{const k=prog(t,Wd(48,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(48,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
