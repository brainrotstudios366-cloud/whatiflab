// ===================== CONTENT: Sinus, Kosinus, Tangens =====================
const SECH=[1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
const CHAPS=[[2,1,'Die Seiten im rechtwinkligen Dreieck'],[8,2,'Das Geheimnis der Verhältnisse'],[14,3,'Sinus, Kosinus und Tangens'],[19,4,'Eine Seite berechnen'],[25,5,'Einen Winkel berechnen'],[30,6,'Der Einheitskreis'],[35,7,'Wie hoch ist der Baum?'],[39,8,'Die 3 häufigsten Fehler']];
const CG=C.blue,CA=C.org,CH=C.red; // Gegenkathete / Ankathete / Hypotenuse
const xAfter=(w,gap)=>w.ax+totalW(w.L.map(l=>l.tk),w.size)+(gap==null?w.size*0.28:gap);
const D2R=Math.PI/180;const fmt=(v,d)=>v.toFixed(d==null?2:d).replace('.',',');
// ---- geometry helpers
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
function dseg(s,t0,p,q,col,lw,dur,o){o=o||{};WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{let k=eo(prog(t,t0,dur||0.5));if(k<=0)return;let a=1;if(o.tOut!=null)a=1-prog(t,o.tOut,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([14,12]);ctx.strokeStyle=col||C.ink;ctx.lineWidth=lw||3.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore()})}
function hi(s,t0,p,q,col,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,0.45));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=0.28;ctx.strokeStyle=col;ctx.lineWidth=o.w||22;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore();if(k>0.99||o.line){ctx.save();ctx.globalAlpha=Math.min(1,k);hline(p[0],p[1],q[0],q[1],col,o.lw||5.5,1,p[0]+q[0]);ctx.restore()}})}
// angle arc: degrees math convention (ccw, y up)
function arcA(s,t0,c,r,a0,a1,col,label,lr,ls,o){o=o||{};WRITES.push([t0,0.3]);custom(s,t0,t=>{let k=eo(prog(t,t0,0.5));if(k<=0)return;let al=1;if(o.tOut!=null)al=1-prog(t,o.tOut,0.4);if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.lineCap='round';ctx.fillStyle=col.length===7?col+'33':col;ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.arc(c[0],c[1],r,-(a0+(a1-a0)*k)*D2R,-a0*D2R);ctx.closePath();ctx.globalAlpha*=0.5;ctx.fill();ctx.globalAlpha/=0.5;ctx.beginPath();ctx.arc(c[0],c[1],r,-(a0+(a1-a0)*k)*D2R,-a0*D2R);ctx.stroke();
  if(label&&k>0.6){const am=(a0+a1)/2*D2R,R=lr||r+34;ctx.globalAlpha*=prog(t,t0+0.3,0.3);ctx.font=HF(ls||44);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,c[0]+Math.cos(am)*R,c[1]-Math.sin(am)*R)}ctx.restore()})}
function rsq(s,t0,c,u,v,sz){custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;sz=sz||38;const p1=[c[0]+u[0]*sz,c[1]+u[1]*sz],p2=[p1[0]+v[0]*sz,p1[1]+v[1]*sz],p3=[c[0]+v[0]*sz,c[1]+v[1]*sz];ctx.save();ctx.globalAlpha=k;hline(p1[0],p1[1],p2[0],p2[1],C.ink,3,1);hline(p2[0],p2[1],p3[0],p3[1],C.ink,3,1);ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(c[0]+(u[0]+v[0])*sz*0.5,c[1]+(u[1]+v[1])*sz*0.5,4.5,0,7);ctx.fill();ctx.restore()})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
function tri(s,t0,P,dur,cols){dur=dur||0.45;seg(s,t0,P[0],P[1],cols?cols[0]:C.ink,4,dur);seg(s,t0+dur,P[1],P[2],cols?cols[1]:C.ink,4,dur);seg(s,t0+2*dur,P[2],P[0],cols?cols[2]:C.ink,4,dur)}
// tree scene: eye at (ex,ey), tree at tx, ground gy
const TR={ex:300,ey:715,gy:800,tx:860,top:323};
function treeScene(s,t0){const{ex,ey,gy,tx,top}=TR;
 seg(s,t0,[180,gy],[1000,gy],C.ink,3.5,0.6);
 custom(s,t0+0.3,t=>{const k=eo(prog(t,t0+0.3,0.7));if(k<=0)return;ctx.save();ctx.globalAlpha=k;
   ctx.fillStyle='rgba(122,74,42,0.75)';const th=(gy-430)*k;ctx.fillRect(tx-14,gy-th,28,th);hrect(tx-14,gy-th,28,th,C.brown,3,1);
   const cr=[[tx,top+77,77],[tx-58,top+125,58],[tx+58,top+125,58],[tx,top+150,62]];for(const[cx,cy,r]of cr){ctx.fillStyle='rgba(38,194,129,0.5)';ctx.beginPath();ctx.arc(cx,cy,r*k,0,7);ctx.fill()}
   for(const[cx,cy,r]of cr)hcircle(cx,cy,r*k,C.green,3,1);ctx.restore()});
 custom(s,t0+0.5,t=>{const k=eo(prog(t,t0+0.5,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;hcircle(ex,ey-3,16,C.ink,3.5,1);hline(ex,ey+13,ex,gy-32,C.ink,3.5,1);hline(ex,gy-32,ex-16,gy,C.ink,3.5,1);hline(ex,gy-32,ex+16,gy,C.ink,3.5,1);hline(ex,ey+28,ex-18,ey+50,C.ink,3.5,1);hline(ex,ey+28,ex+20,ey+46,C.ink,3.5,1);ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(ex+7,ey-5,3,0,7);ctx.fill();ctx.restore()});
 WRITES.push([t0,1.2])}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Sinus, Kosinus & Tangens',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Sinus, Kosinus & Tangens',86),198,C.red,4,k)});
 treeScene(s,0.3);
 note(s,Wd(0,'hoch')-0.2,960,560,'h = ?',96,C.red);
 note(s,Wd(0,'hochzuklettern')-0.2,1250,330,'ohne Klettern',64,C.ink);cross(s,Wd(0,'hochzuklettern')+0.5,1220,330,26);
 note(s,Wd(0,'Maßband')-0.3,1250,430,'ohne Maßband',64,C.ink);cross(s,Wd(0,'Maßband')+0.3,1220,430,26);
 dseg(s,Wd(1,'Abstand')-0.2,[TR.ex,TR.ey],[TR.tx,TR.ey],CA,4,0.6);lab(s,Wd(1,'Abstand'),(TR.ex+TR.tx)/2,TR.ey+40,'20 m',50,CA);
 dseg(s,Wd(1,'Winkel')-0.4,[TR.ex,TR.ey],[TR.tx,TR.top],C.ink,3,0.6);arcA(s,Wd(1,'Winkel'),[TR.ex,TR.ey],90,0,35,C.pur,'35°',135,42);
 check(s,Wd(1,'Abstand')+0.6,670,TR.ey+40,24);
 const ws=write(s,[Wd(1,'Sinus'),Wd(1,'Kosinus'),Wd(1,'Tangens')],1200,620,['sin','·','cos','·','tan'],110,C.ink,{cols:[CG,C.ink,CA,C.ink,CH]});
 note(s,Wd(1,'dahintersteckt')-0.6,1200,760,'… und WARUM es klappt',58,C.green);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Die Seiten im rechtwinkligen Dreieck');
 const A=[260,780],B=[900,780],P=[900,400];
 tri(s,Wd(3,'Dreieck')-0.3,[A,B,P],0.4);
 rsq(s,Wd(3,'neunzig'),B,[-1,0],[0,-1],42);lab(s,Wd(3,'neunzig')+0.2,850,700,'90°',40,C.ink);
 hi(s,Wd(4,'längste')-0.1,P,A,CH);lab(s,Wd(4,'Hypotenuse')-0.2,520,545,'Hypotenuse',56,CH);
 arcA(s,Wd(5,'Alpha',1)-0.2,A,95,0,30.7,C.pur,'α',130,52);
 hi(s,Wd(5,'gegenüberliegt')-0.2,B,P,CG);note(s,Wd(5,'Gegenkathete')-0.2,935,590,'Gegen-',52,CG);note(s,Wd(5,'Gegenkathete'),935,650,'kathete',52,CG);
 hi(s,Wd(6,'anliegt')-0.3,A,B,CA);lab(s,Wd(6,'Ankathete')-0.2,580,835,'Ankathete',56,CA);
 note(s,Wd(6,'wie')-0.2,1230,300,'An-kathete  =  an-liegend',58,CA);
 note(s,Wd(5,'Gegenkathete')+0.3,1230,380,'Gegen-kathete  =  gegenüber',58,CG);
 // swapped view from the other angle
 const A2=[1230,780],B2=[1700,780],P2=[1700,500];
 tri(s,Wd(7,'Winkel')-0.3,[A2,B2,P2],0.3);rsq(s,Wd(7,'Winkel')+0.4,B2,[-1,0],[0,-1],34);
 arcA(s,Wd(7,'anderen')-0.2,P2,80,180+30.8,270,C.pur,'β',110,48);
 hi(s,Wd(7,'tauschen')-0.2,A2,B2,CG,{w:16});lab(s,Wd(7,'tauschen'),1465,830,'Gegenkathete',44,CG);
 hi(s,Wd(7,'Rollen')-0.4,B2,P2,CA,{w:16});note(s,Wd(7,'Rollen')-0.2,1720,640,'Ankathete',44,CA);
 note(s,Wd(7,'anderen')+0.2,1230,470,'von β aus:',48,C.pur);
}
// ---------- S2 Kap 2 ----------
camTo(E(8,-0.7),2);
{const s=2;headingE(s,E(8,0.2),2,'Das Geheimnis der Verhältnisse');
 const u=90,gy=640,r3=Math.sqrt(3);
 const T=[[230,1,Wd(9,'Klein')],[500,2,Wd(9,'mittel')],[900,3,Wd(9,'groß')]];
 const RT=[[Wd(10,'Eins',2),'1 : 2 = 0,5'],[Wd(11,'Wieder',1)-0.3,'2 : 4 = 0,5'],[Wd(11,'Wieder',2)-0.3,'3 : 6 = 0,5']];
 const LT=[[Wd(10,'eins',1),Wd(10,'zwei',1)],[Wd(11,'zwei'),Wd(11,'vier')],[Wd(11,'drei'),Wd(11,'sechs')]];
 T.forEach(([x0,m,t0],i)=>{const A=[x0,gy],B=[x0+r3*u*m,gy],P=[x0+r3*u*m,gy-u*m];tri(s,t0-0.2,[A,B,P],0.25);rsq(s,t0+0.4,B,[-1,0],[0,-1],22);
   arcA(s,Wd(9,'dreißig')-0.2+i*0.25,A,48+8*m,0,30,C.pur,'30°',90+10*m,34);
   note(s,LT[i][0]-0.1,B[0]+14,gy-u*m/2,String(m),50,CG);hi(s,LT[i][0]-0.2,B,P,CG,{w:12,lw:4.5});
   lab(s,LT[i][1]-0.1,(A[0]+P[0])/2-22,(A[1]+P[1])/2-30,String(2*m),50,CH);hi(s,LT[i][1]-0.2,A,P,CH,{w:12,lw:4.5});
   const cx=(A[0]+B[0])/2;lab(s,RT[i][0],cx,gy+70,RT[i][1],52,C.ink);marker(s,RT[i][0]+0.6,[cx+tw(RT[i][1],52)/2-tw('0,5',52)-8,gy+40,tw('0,5',52)+16,60])});
 note(s,Wd(12,'immer')-0.3,1460,300,'Bei 30° immer 0,5!',56,C.ink);
 const w=write(s,[Wd(12,'Sinus',2)-0.1],1460,430,['sin 30°','=','0,5'],88,C.ink,{per:0.3,cols:[C.blue,C.ink,C.green]});boxE(s,LE(12)-0.4,tokRect(w,0,2,18),C.green,5);
 note(s,Wd(13,'bestimmt')-0.3,230,830,'Winkel  →  bestimmt das Seiten-Verhältnis',58,C.ink);
 note(s,Wd(13,'Taschenrechner')-0.2,1460,560,'Taschenrechner kennt',50,C.blue);note(s,Wd(13,'Taschenrechner')+0.4,1460,620,'den Wert für jeden Winkel',50,C.blue);
}
// ---------- S3 Kap 3 ----------
camTo(E(14,-0.7),3);
{const s=3;headingE(s,E(14,0.2),3,'Sinus, Kosinus und Tangens');
 const A=[1240,600],B=[1740,600],P=[1740,300];
 tri(s,E(14,0.6),[A,B,P],0.3,[CA,CG,CH]);rsq(s,E(14,1.4),B,[-1,0],[0,-1],30);arcA(s,E(14,1.6),A,80,0,31,C.pur,'α',112,46);
 lab(s,E(14,1.8),1490,650,'A',50,CA);note(s,E(14,1.8),1760,450,'G',50,CG);lab(s,E(14,1.8),1460,410,'H',50,CH);
 const rows=[[15,'sin α',F('Gegenkathete','Hypotenuse'),CG,CH,'Hypotenuse'],[16,'cos α',F('Ankathete','Hypotenuse'),CA,CH,'Hypotenuse'],[17,'tan α',F('Gegenkathete','Ankathete'),CG,CA,'Ankathete']];
 rows.forEach(([l,nm,fr,cn,cd,dw,occ],i)=>{fr.cn=cn;fr.cd=cd;const y=320+i*175;const w=write(s,[Wd(l,nm.split(' ')[0]==='sin'?'Sinus':nm.split(' ')[0]==='cos'?'Kosinus':'Tangens')-0.1,Wd(l,'ist')],230,y,[nm,'='],76,C.ink);
   const x=xAfter(w);const t1=Wd(l,dw,occ||1)-0.5;write(s,[t1],x,y,[fr],76,C.ink)});
 note(s,Wd(18,'Trick')-0.3,230,800,'Merktrick:',56,C.ink);
 const mt=write(s,[Wd(18,'Gaga')-0.1,Wd(18,'Hühnerhof')-0.1,Wd(18,'hof AG')-0.1],520,800,['GAGA','HühnerHof','AG'],66,C.red,{cols:[C.red,C.red,C.red]});
 [['G','H',Wd(18,'G durch H'),'sin',Wd(18,'Sinus')],['A','H',Wd(18,'A durch H'),'cos',Wd(18,'Kosinus')],['G','A',Wd(18,'G durch A'),'tan',Wd(18,'Tangens')]].forEach(([n,d,t0,nm,t1],i)=>{const x=1180+i*150;const f=F(n,d);write(s,[t0],x,790,[f],84,C.red);lab(s,t1-0.1,x+tokW(f,84)/2,880,nm,42,C.ink)});
}
// ---------- S4 Kap 4 ----------
camTo(E(19,-0.7),4);
{const s=4;headingE(s,E(19,0.2),4,'Eine Seite berechnen');
 const wx=760,gy=820,F0=[572,820],T0=[760,303];
 seg(s,Wd(20,'Wand')-0.4,[wx,250],[wx,gy],C.ink,6,0.5);custom(s,Wd(20,'Wand'),t=>{const k=prog(t,Wd(20,'Wand'),0.5);if(k<=0)return;ctx.save();ctx.globalAlpha=k*0.6;for(let y=270;y<gy;y+=36)hline(wx,y,wx+22,y-16,C.ink,2,1);ctx.restore()});
 seg(s,Wd(20,'Wand')-0.2,[330,gy],[900,gy],C.ink,4,0.5);
 custom(s,Wd(20,'Leiter')-0.2,t=>{const k=eo(prog(t,Wd(20,'Leiter')-0.2,0.8));if(k<=0)return;const ux=(T0[0]-F0[0]),uy=(T0[1]-F0[1]),L=Math.hypot(ux,uy),nx=-uy/L*13,ny=ux/L*13;
   ctx.save();for(const sg of[-1,1])hline(F0[0]+nx*sg,F0[1]+ny*sg,F0[0]+nx*sg+ux*k,F0[1]+ny*sg+uy*k,C.brown,5,1,sg*9);for(let f=0.08;f<k;f+=0.1)hline(F0[0]-nx+ux*f,F0[1]-ny+uy*f,F0[0]+nx+ux*f,F0[1]+ny+uy*f,C.brown,4,1,f*50);ctx.restore()});
 WRITES.push([Wd(20,'Leiter')-0.2,0.8]);
 note(s,Wd(20,'fünf')-0.1,560,520,'5 m',56,CH,{align:'r'});
 arcA(s,Wd(20,'siebzig')-0.4,F0,62,0,70,C.pur,'70°',100,40);
 note(s,Wd(20,'weg')-0.6,666,875,'? m',50,CA,{align:'c'});
 note(s,Wd(21,'Hypotenuse')-0.3,1000,300,'Leiter  =  Hypotenuse',60,CH);hi(s,Wd(21,'Hypotenuse')-0.3,F0,T0,CH,{w:20,lw:1});
 note(s,Wd(21,'Ankathete')-0.3,1000,380,'Abstand  =  Ankathete',60,CA);hi(s,Wd(21,'Ankathete')-0.3,F0,[wx,gy],CA,{w:20});
 const fc=F('A','5');fc.cn=CA;fc.cd=CH;
 const w1=write(s,[Wd(22,'Kosinus',2)-0.1,Wd(22,'gleich'),Wd(22,'Ankathete',2)],1000,510,['cos 70°','=',fc],74,C.ink);
 note(s,Wd(23,'Mal')-0.1,1450,510,'| · 5',60,C.red);
 note(s,Wd(23,'Ankathete')-0.2,1000,640,'A  =  5 · cos 70°',70,C.ink);
 note(s,Wd(23,'null')-0.2,1000,735,'≈ 5 · 0,34  ≈  1,7 m',70,C.green);boxE(s,Wd(23,'Meter')+0.1,[985,695,tw('≈ 5 · 0,34  ≈  1,7 m',70)+30,82],C.green,4);
 note(s,Wd(23,'Meter')+0.2,666,875,'≈ 1,7 m',50,C.green,{align:'c'});
 hi(s,Wd(24,'Gegenkathete')-0.4,[wx,gy],T0,CG,{w:20});note(s,Wd(24,'Gegenkathete')-0.2,790,560,'h',56,CG);
 note(s,Wd(24,'Sinus')-0.2,1000,840,'h  =  5 · sin 70°  ≈  4,7 m',62,CG);
}
// ---------- S5 Kap 5 ----------
camTo(E(25,-0.7),5);
{const s=5;headingE(s,E(25,0.2),5,'Einen Winkel berechnen');
 const L=[300,640],R=[700,640],Tp=[700,340],RR=[1100,640];
 custom(s,Wd(26,'Dach')-0.4,t=>{const k=eo(prog(t,Wd(26,'Dach')-0.4,0.6));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(214,58,58,0.12)';ctx.beginPath();ctx.moveTo(L[0],L[1]);ctx.lineTo(Tp[0],Tp[1]);ctx.lineTo(RR[0],RR[1]);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,224,170,0.35)';ctx.fillRect(340,640,720,220);hrect(340,640,720,220,C.ink,3,1);hrect(640,730,120,130,C.ink,3,1);hrect(420,690,110,90,C.ink,3,1);hrect(870,690,110,90,C.ink,3,1);ctx.restore()});
 seg(s,Wd(26,'Dach')-0.3,L,Tp,C.red,5,0.4);seg(s,Wd(26,'Dach'),Tp,RR,C.red,5,0.4);WRITES.push([Wd(26,'Dach')-0.4,0.6]);
 dseg(s,Wd(26,'hoch')-0.4,R,Tp,CG,4,0.5);note(s,Wd(26,'hoch')-0.2,718,490,'3 m',52,CG);
 dseg(s,Wd(26,'Breite')-0.4,L,R,CA,4,0.5);lab(s,Wd(26,'Breite')-0.2,585,682,'4 m',48,CA);
 rsq(s,Wd(26,'Breite')+0.2,R,[-1,0],[0,-1],28);
 arcA(s,Wd(26,'steil')-0.3,L,80,0,36.87,C.pur);lab(s,Wd(26,'steil'),435,597,'α = ?',46,C.pur,{tOut:Wd(29,'Grad')});
 const f34=F(3,4);f34.cn=CG;f34.cd=CA;
 const w=write(s,[Wd(27,'Tangens',2)-0.1,Wd(27,'gleich'),Wd(27,'Viertel')-0.3,Wd(27,'null')-0.2,Wd(27,'sieben')],1220,330,['tan α','=',f34,'=','0,75'],76,C.ink);
 custom(s,Wd(28,'Shift')-0.3,t=>{const k=eo(prog(t,Wd(28,'Shift')-0.3,0.4));if(k<=0)return;const key=(x,y,w,s1,c)=>{ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(x,y,w,80,14);ctx.fill();hrect(x,y,w,80,c,3.5,1);ctx.font='700 34px Inter';ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s1,x+w/2,y+42)};
   ctx.save();ctx.globalAlpha=k;key(1220,450,150,'SHIFT',C.org);ctx.restore();const k2=eo(prog(t,Wd(28,'Tangens')-0.3,0.4));if(k2>0){ctx.save();ctx.globalAlpha=k2;ctx.font=HF(60);ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('+',1410,490);key(1450,450,120,'tan',C.ink);ctx.restore()}});
 WRITES.push([Wd(28,'Shift')-0.3,0.4]);
 note(s,Wd(28,'hoch')-0.3,1610,490,'→  tan⁻¹',64,C.red);
 const w2=write(s,[Wd(29,'Tangens')-0.1,Wd(29,'ergibt')-0.2,Wd(29,'sechsunddreißig')-0.1],1220,650,['α = tan⁻¹(0,75)','≈',' ','36,9°'],70,C.ink,{cols:[C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(29,'Grad')+0.2,tokRect(w2,3,3,12),C.green,5);
 lab(s,Wd(29,'Grad')+0.3,435,597,'36,9°',46,C.green);
 note(s,Wd(29,'steil')-0.3,1220,780,'Rückwärts:  sin⁻¹, cos⁻¹, tan⁻¹',54,C.blue);
}
// ---------- S6 Kap 6 Einheitskreis ----------
camTo(E(30,-0.7),6);
{const s=6;headingE(s,E(30,0.2),6,'Der Einheitskreis');
 const O=[560,600],R=280;
 const tA=Wd(33,'Dreh')-0.2,tB=Wd(33,'kleiner'),tZ=Wd(33,'null',1)-0.6,tN=Wd(33,'neunzig')-0.6,tBack=LE(33)+0.6;
 const ang=t=>{let a=35;a=lerp(a,75,eio(prog(t,tA,tB-tA)));a=lerp(a,0,eio(prog(t,tZ,0.9)));a=lerp(a,90,eio(prog(t,tN,1.0)));a=lerp(a,35,eio(prog(t,tBack,1.2)));return a};
 const t0c=Wd(31,'Kreis')-0.4;
 custom(s,t0c,t=>{const k=eo(prog(t,t0c,0.9));if(k<=0)return;ctx.save();ctx.globalAlpha=k;hline(O[0]-R-50,O[1],O[0]+R+60,O[1],C.ink,2.5,1);hline(O[0],O[1]+R+40,O[0],O[1]-R-50,C.ink,2.5,1);ctx.restore();hcircle(O[0],O[1],R,C.ink,3.5,k);
   if(k>=1){ctx.save();ctx.font=HF(32);ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('1',O[0]+R+14,O[1]+34);ctx.fillText('1',O[0]-22,O[1]-R-10);ctx.restore()}});
 WRITES.push([t0c,0.9]);
 const tT=Wd(31,'Hypotenuse')-0.4,tS=Wd(32,'Höhe')-0.3,tC=Wd(32,'Breite')-0.3;
 custom(s,tT,t=>{const k=eo(prog(t,tT,0.6));if(k<=0)return;const a=ang(t)*D2R,px=O[0]+Math.cos(a)*R,py=O[1]-Math.sin(a)*R;ctx.save();ctx.globalAlpha=k;
   // cos (width)
   const kc=eo(prog(t,tC,0.5));ctx.strokeStyle=CA;ctx.lineWidth=7+kc*4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(px,O[1]);ctx.stroke();
   // sin (height)
   const ks=eo(prog(t,tS,0.5));ctx.strokeStyle=CG;ctx.lineWidth=5+ks*6;ctx.beginPath();ctx.moveTo(px,O[1]);ctx.lineTo(px,py);ctx.stroke();
   ctx.strokeStyle=CH;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(px,py);ctx.stroke();
   // angle arc
   ctx.fillStyle='rgba(155,89,208,0.25)';ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.arc(O[0],O[1],60,-a,0);ctx.closePath();ctx.fill();ctx.strokeStyle=C.pur;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(O[0],O[1],60,-a,0);ctx.stroke();
   ctx.fillStyle=CH;ctx.beginPath();ctx.arc(px,py,12,0,7);ctx.fill();
   ctx.font=HF(40);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=CH;ctx.fillText('1',O[0]+Math.cos(a)*R*0.5-Math.sin(a)*28,O[1]-Math.sin(a)*R*0.5-Math.cos(a)*28);
   if(ks>0){ctx.globalAlpha=k*ks;ctx.fillStyle=CG;ctx.textAlign='left';ctx.fillText('sin α',px+16,(O[1]+py)/2)}
   if(kc>0){ctx.globalAlpha=k*kc;ctx.fillStyle=CA;ctx.textAlign='center';ctx.fillText('cos α',(O[0]+px)/2,O[1]+36)}
   ctx.restore()});
 WRITES.push([tT,0.6]);
 const tR=Wd(32,'Sinus')-0.2;
 custom(s,tR,t=>{const k=eo(prog(t,tR,0.5));if(k<=0)return;const a=ang(t);ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(255,255,255,0.85)';ctx.beginPath();ctx.roundRect(1000,270,560,250,22);ctx.fill();hrect(1000,270,560,250,C.ink,3,1);
   ctx.font=HF(62);ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=C.pur;ctx.fillText('α = '+Math.round(a)+'°',1040,325);
   ctx.fillStyle=CG;ctx.fillText('sin α = '+fmt(Math.sin(a*D2R)),1040,400);ctx.fillStyle=CA;ctx.fillText('cos α = '+fmt(Math.cos(a*D2R)),1040,470);ctx.restore()});
 note(s,Wd(32,'Gegenkathete',2)-0.6,1000,600,'sin α  =  G : 1  =  G  (Höhe)',56,CG);
 note(s,Wd(32,'Breite')-0.4,1000,680,'cos α  =  A : 1  =  A  (Breite)',56,CA);
 const w=write(s,[Wd(34,'zwischen')-0.2],1000,790,['0  ≤  sin, cos  ≤  1'],64,C.green);boxE(s,Wd(34,'eins')+0.2,tokRect(w,0,0,14),C.green,4);
 note(s,Wd(34,'mehr')-0.2,1000,880,'Ergebnis > 1  →  verrechnet!',54,C.red);
}
// ---------- S7 Kap 7 Baum ----------
camTo(E(35,-0.7),7);
{const s=7;headingE(s,E(35,0.2),7,'Wie hoch ist der Baum?');
 treeScene(s,E(35,0.6));const{ex,ey,tx,top}=TR;
 dseg(s,Wd(36,'zwanzig')-0.3,[ex,ey],[tx,ey],CA,4,0.6);lab(s,Wd(36,'zwanzig')+0.2,(ex+tx)/2,ey+40,'20 m',50,CA);
 dseg(s,Wd(36,'Spitze')-0.3,[ex,ey],[tx,top],C.ink,3,0.6);arcA(s,Wd(36,'fünfunddreißig')-0.3,[ex,ey],90,0,35,C.pur,'35°',135,42);
 hi(s,Wd(37,'Höhe')-0.3,[tx,ey],[tx,top],CG,{w:18});note(s,Wd(37,'Höhe'),tx+100,500,'h',64,CG);
 note(s,Wd(37,'Gegenkathete')-0.2,1150,300,'h  =  Gegenkathete',58,CG);
 note(s,Wd(37,'Ankathete')-0.2,1150,375,'20 m  =  Ankathete',58,CA);
 const ft=F('h','20');ft.cn=CG;ft.cd=CA;
 write(s,[Wd(37,'Tangens')-0.4,Wd(37,'Tangens')-0.1,Wd(37,'Tangens')+0.1],1150,490,['tan 35°','=',ft],72,C.ink);
 note(s,Wd(38,'Höhe')-0.2,1150,620,'h  =  20 · tan 35°',72,C.ink);
 const w=write(s,[Wd(38,'ungefähr')-0.1,Wd(38,'vierzehn')-0.3],1150,720,['≈ 20 · 0,7',' ','≈ 14 m'],72,C.ink,{cols:[C.ink,C.ink,C.green]});boxE(s,Wd(38,'Meter')+0.1,tokRect(w,2,2,12),C.green,5);
 note(s,Wd(38,'Klettern')-0.4,1150,820,'(+ Augenhöhe ≈ 1,6 m)',44,'#7A869A');
 lab(s,Wd(38,'Meter'),tx+100,580,'≈ 14 m',50,C.green);
}
// ---------- S8 Kap 8 Fehler ----------
camTo(E(39,-0.7),8);
{const s=8;headingE(s,E(39,0.2),8,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,64,C.ink);const wx=290+tw(wrongS,64);cross(s,crossT,wx+52,y,28);
   const x2=wx+115;note(s,rightT,x2,y,rightS,64,C.green);check(s,checkT,x2+tw(rightS,64)+45,y,26)};
 row(330,'#1',E(40,0),Wd(40,'RAD')-0.3,'RAD:  sin 30 = −0,99 ?!',Wd(40,'Unsinn')-0.2,Wd(40,'Achte')-0.2,'→  DEG:  sin 30° = 0,5',Wd(40,'DEG',2)+0.2);
 row(560,'#2',E(41,0),Wd(41,'verwechseln')-0.6,'G und A vertauscht',Wd(41,'verwechseln')+0.2,Wd(41,'Frag')-0.2,'→  erst den Winkel markieren',Wd(41,'schaue')+0.1);
 row(790,'#3',E(42,0),Wd(42,'ohne')-0.4,'Dreieck ohne 90°',Wd(42,'benutzen')-0.1,Wd(42,'nur')-0.2,'→  nur im rechtwinkligen Dreieck',Wd(42,'Dreieck',2)+0.4);
}
// ---------- S9 Übung ----------
camTo(E(43,-0.7),9);
{const s=9;headingE(s,E(43,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(43,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(44,'Aufgabe',1),'a)','H = 8,  α = 30°   →   G = ?'],[Wd(44,'Aufgabe',2),'b)','A = 12,  α = 45°   →   G = ?'],[Wd(44,'Aufgabe',3),'c)','G = 5,  H = 10   →   α = ?']];
 T.forEach(([t0,lb,str],i)=>{const y=330+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,64,C.ink)});
 const T0=LE(44)+0.3,T1=E(45,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(45,'Gegenkathete'),'G = 8 · sin 30° = 8 · 0,5 = 4',Wd(45,'vier')],[Wd(46,'Gegenkathete'),'G = 12 · tan 45° = 12 · 1 = 12',Wd(46,'zwölf',2)],[Wd(47,'Sinus'),'sin α = 5 : 10 = 0,5  →  α = 30°',Wd(47,'dreißig')]];
 SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200+80;note(s,t0,310,y,str,58,C.green);check(s,tc+0.3,310+tw(str,58)+40,y,26)});
 note(s,Wd(48,'Kommentare')-0.6,200,885,'Alles richtig?  →  schreib’s in die Kommentare 💬',56,C.blue);
}
// ---------- S10 Summary ----------
camTo(E(49,-0.7),10);
{const s=10;headingE(s,E(49,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(49,'Verhältnisse')-0.4,'• sin, cos, tan = Verhältnisse von Seiten',C.ink],[Wd(49,'Gaga')-0.2,'• GAGA HühnerHof AG:  G/H,  A/H,  G/A',C.red],[Wd(49,'Seiten',2)-0.2,'• Seite: mal rechnen  ·  Winkel: tan⁻¹ / sin⁻¹ / cos⁻¹',C.blue],[Wd(49,'stell')-0.2,'• Taschenrechner auf DEG!',C.green]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,60,col));
 camTo(E(50,-0.4),10,180);
 custom(s,E(50,0),t=>{const k=eo(prog(t,E(50,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(50,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(50,'minus')-0.3,270,1020,'(−) · (−) = (+)  …  warum?',64,C.blue);
 custom(s,Wd(50,'Abonnier')-0.2,t=>{const k=prog(t,Wd(50,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(50,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
