// ===================== CONTENT: Lineare Regression =====================
const SECH=[1080,1080,1080,1080,1080,1080,1400,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
const CHAPS=[[2,1,'Was ist lineare Regression?'],[8,2,'Welche Gerade ist die beste?'],[12,3,'Die Methode der kleinsten Quadrate'],[17,4,'Die Formel'],[23,5,'Schritt für Schritt'],[32,6,'Vorhersagen'],[36,7,'Wie gut passt die Gerade?'],[41,8,'Die 3 häufigsten Fehler']];
const xAfter=(w,gap)=>w.ax+totalW(w.L.map(l=>l.tk),w.size)+(gap==null?w.size*0.28:gap);
const DATA=[[1,4],[2,5],[3,8],[4,9],[5,9]];const BA=2.8,BB=1.4;
const XB='x\u0304',YB='y\u0304';
// ---- plot helpers
const PP=(G,x,y)=>[G.ox+x*G.sx,G.oy-y*G.sy];
function axes2(s,t0,G,o){o=o||{};WRITES.push([t0,0.7]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.7));if(k<=0)return;const X1=G.ox+G.xm*G.sx,Y1=G.oy-G.ym*G.sy;
  hline(G.ox,G.oy,G.ox+(X1-G.ox)*k,G.oy,C.ink,3);hline(G.ox,G.oy,G.ox,G.oy-(G.oy-Y1)*k,C.ink,3);
  if(k<1)return;hline(X1,G.oy,X1-14,G.oy-8,C.ink,3);hline(X1,G.oy,X1-14,G.oy+8,C.ink,3);hline(G.ox,Y1,G.ox-8,Y1+14,C.ink,3);hline(G.ox,Y1,G.ox+8,Y1+14,C.ink,3);
  ctx.save();ctx.font=HF(o.fs||28);ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='top';const xs=o.xs||1,ys=o.ys||2;
  for(let x=xs;x<G.xm-0.3;x+=xs){hline(G.ox+x*G.sx,G.oy-6,G.ox+x*G.sx,G.oy+6,C.ink,2);ctx.fillText(String(x),G.ox+x*G.sx,G.oy+10)}
  ctx.textAlign='right';ctx.textBaseline='middle';for(let y=ys;y<G.ym-0.3;y+=ys){hline(G.ox-6,G.oy-y*G.sy,G.ox+6,G.oy-y*G.sy,C.ink,2);ctx.fillText(String(y),G.ox-12,G.oy-y*G.sy)}
  ctx.font=HF(o.ls||32);ctx.textAlign='right';ctx.textBaseline='top';ctx.fillStyle=C.blue;if(o.xl)ctx.fillText(o.xl,X1,G.oy+44);ctx.textAlign='left';if(o.yl)ctx.fillText(o.yl,G.ox+16,Y1-6);ctx.restore()})}
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
function pts(s,t0,G,D,col,per,r){D.forEach(([x,y],i)=>{const ti=t0+i*(per==null?0.25:per);WRITES.push([ti,0.15]);custom(s,ti,t=>{const k=eo(prog(t,ti,0.35));if(k<=0)return;const p=PP(G,x,y);ctx.save();ctx.fillStyle=col||C.blue;ctx.beginPath();ctx.arc(p[0],p[1],(r||11)*backK(k),0,7);ctx.fill();ctx.restore()})})}
function lineG(s,t0,G,a,b,x0,x1,col,lw,o){o=o||{};WRITES.push([t0,0.6]);custom(s,t0,t=>{let k=eo(prog(t,t0,0.7));if(k<=0)return;let al=1;if(o.tOut!=null)al=1-prog(t,o.tOut,0.5);if(al<=0)return;const p=PP(G,x0,a+b*x0),q=PP(G,x1,a+b*x1);ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=col;ctx.lineWidth=lw||5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore();
  if(o.label&&k>0.9){ctx.save();ctx.globalAlpha*=al*prog(t,t0+0.5,0.3);ctx.font=HF(o.ls||40);ctx.fillStyle=col;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(o.label,q[0]+12,q[1]+(o.ldy||0));ctx.restore()}})}
function resid(s,t0,G,D,a,b,o){o=o||{};WRITES.push([t0,0.5]);custom(s,t0,t=>{let al=1;if(o.tOut!=null)al=1-prog(t,o.tOut,0.5);if(al<=0)return;D.forEach(([x,y],i)=>{const k=eo(prog(t,t0+i*0.12,0.4));if(k<=0)return;const p=PP(G,x,y),q=PP(G,x,a+b*x);ctx.save();ctx.globalAlpha=al;hline(p[0],p[1],p[0],p[1]+(q[1]-p[1])*k,o.col||C.red,4,1,i*7);
  if(o.sign&&k>=1&&t>o.sign){ctx.globalAlpha=al*prog(t,o.sign,0.3);ctx.font=HF(44);ctx.textAlign='center';ctx.textBaseline='middle';const r=y-(a+b*x);ctx.fillStyle=r>0?C.green:C.red;ctx.fillText(r>0?'+':'−',p[0]-26,(p[1]+q[1])/2)}ctx.restore()})})}
function squares(s,t0,G,D,a,b,col,o){o=o||{};WRITES.push([t0,0.8]);custom(s,t0,t=>{let al=1;if(o.tOut!=null)al=1-prog(t,o.tOut,0.5);if(al<=0)return;D.forEach(([x,y],i)=>{const k=eo(prog(t,t0+i*0.15,0.5));if(k<=0)return;const p=PP(G,x,y),q=PP(G,x,a+b*x);const sd=Math.abs(q[1]-p[1]);const top=Math.min(p[1],q[1]);ctx.save();ctx.globalAlpha=al;ctx.fillStyle=col;ctx.fillRect(p[0],top,sd*k,sd);ctx.strokeStyle=col.replace(/[\d.]+\)$/,'0.9)');ctx.lineWidth=2.5;ctx.strokeRect(p[0],top,sd*k,sd);ctx.restore()})})}
function star(s,t0,G,x,y,col,label){WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;const p=PP(G,x,y);ctx.save();ctx.translate(p[0],p[1]);ctx.scale(backK(k),backK(k));ctx.fillStyle=col;ctx.beginPath();for(let i=0;i<10;i++){const r=i%2?9:22,a=-Math.PI/2+i*Math.PI/5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.restore();
  if(label){ctx.save();ctx.globalAlpha=k;ctx.font=HF(40);ctx.fillStyle=col;ctx.textAlign='left';ctx.textBaseline='middle';ftm(label,p[0]+30,p[1]+34);ctx.restore()}})}
function dseg2(s,t0,p,q,col){WRITES.push([t0,0.4]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=col;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore()})}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Lineare Regression',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Lineare Regression',86),198,C.red,4,k)});
 const G={ox:260,oy:820,sx:120,sy:42,xm:7,ym:14};
 axes2(s,0.4,G,{xl:'Lernstunden',yl:'Punkte'});pts(s,Wd(0,'Stunde')-0.6,G,DATA,C.blue,0.18);
 note(s,Wd(0,'Punkte')-0.3,1180,330,'+1 Stunde lernen  =  ?  Punkte',64,C.ink);
 lineG(s,Wd(1,'Geraden')-0.3,G,BA,BB,0.3,6.6,C.red,5);
 dseg2(s,Wd(1,'vorhersagen')-0.4,PP(G,6,0),PP(G,6,BA+BB*6),C.green);star(s,Wd(1,'vorhersagen'),G,6,BA+BB*6,C.green,'?');
 note(s,Wd(1,'Regression')-0.5,1180,470,'= lineare Regression',72,C.red);
 note(s,Wd(1,'funktioniert')-0.8,1180,600,'Heute: WIE sie funktioniert',58,C.green);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Was ist lineare Regression?');
 const G={ox:260,oy:830,sx:120,sy:40,xm:7,ym:13};
 note(s,Wd(3,'Stunden')-0.3,1200,300,'Stunden:   1    2    3    4    5',56,C.ink);
 note(s,Wd(3,'Punkte')-0.3,1200,380,'Punkte:     4    5    8    9    9',56,C.blue);
 axes2(s,Wd(4,'Koordinatensystem')-0.6,G,{xl:'Lernstunden  x',yl:'Punkte  y'});
 pts(s,Wd(4,'Punkt')-0.2,G,DATA,C.blue,0.3);
 note(s,Wd(5,'Trend')-0.3,1200,500,'Trend:  mehr lernen  →  mehr Punkte',54,C.green);
 lineG(s,Wd(6,'Gerade')-0.2,G,BA,BB,0.3,6.6,C.red,5,{label:'Regressionsgerade',ldy:-10,ls:36});
 note(s,Wd(6,'Ausgleichsgerade')-0.2,1200,610,'= Ausgleichsgerade',54,C.red);
 note(s,Wd(7,'künstliche')-0.3,1200,740,'🤖 Grundlage von KI /',54,C.pur);note(s,Wd(7,'maschinellen')-0.3,1200,810,'maschinellem Lernen',54,C.pur);
}
// ---------- S2 Kap 2 ----------
camTo(E(8,-0.7),2);
{const s=2;headingE(s,E(8,0.2),2,'Welche Gerade ist die beste?');
 const G={ox:260,oy:830,sx:120,sy:40,xm:7,ym:13};
 axes2(s,E(8,0.6),G,{xl:'Stunden',yl:'Punkte'});pts(s,E(8,0.9),G,DATA,C.blue,0.1);
 lineG(s,Wd(9,'flach')-0.4,G,7,0,0.3,6.6,C.org,4,{label:'zu flach',ls:36,tOut:Wd(10,'Abstand')-0.3});
 lineG(s,Wd(9,'steil')-0.4,G,-2,3,1,4.9,C.pur,4,{label:'zu steil',ls:36,tOut:Wd(10,'Abstand')-0.3});
 lineG(s,Wd(9,'besser')-0.4,G,BA,BB,0.3,6.6,C.green,5,{label:'besser?',ls:36});
 note(s,Wd(9,'misst')-0.5,1180,330,'Wie misst man „am besten“?',58,C.ink);
 resid(s,Wd(10,'Abstand')-0.2,G,DATA,BA,BB,{sign:Wd(11,'positiv')-0.4});
 note(s,Wd(10,'senkrecht')-0.3,1180,440,'Abstand senkrecht  ↕',58,C.red);
 note(s,Wd(11,'Residuen')-0.3,1180,560,'= Residuen (Fehler)',58,C.red);
 note(s,Wd(11,'positiv')-0.4,1180,670,'+  Punkt über der Geraden',52,C.green);
 note(s,Wd(11,'negativ')-0.4,1180,750,'−  Punkt unter der Geraden',52,C.red);
}
// ---------- S3 Kap 3 ----------
camTo(E(12,-0.7),3);
{const s=3;headingE(s,E(12,0.2),3,'Die Methode der kleinsten Quadrate');
 const G={ox:260,oy:830,sx:120,sy:40,xm:7,ym:13};
 axes2(s,E(12,0.6),G,{xl:'Stunden',yl:'Punkte'});pts(s,E(12,0.9),G,DATA,C.blue,0.1);
 const tF=Wd(13,'addieren')-0.4,tB=Wd(15,'beste')-0.3;
 lineG(s,tF,G,7,0,0.3,6.6,C.org,4,{label:'schlecht',ls:34,tOut:tB});
 resid(s,tF+0.4,G,DATA,7,0,{col:C.org,tOut:tB});
 note(s,Wd(13,'addieren')-0.2,1180,300,'Fehler addieren:',54,C.ink);
 note(s,Wd(13,'gegenseitig')-0.4,1180,375,'−3 − 2 + 1 + 2 + 2  =  0  ?!',58,C.red);
 note(s,Wd(14,'quadriert')-0.3,1180,480,'Quadrieren:',54,C.ink);
 note(s,Wd(14,'positiv')-0.4,1180,555,'9 + 4 + 1 + 4 + 4  =  22',58,C.org);
 note(s,Wd(14,'bestraft')-0.5,1180,630,'große Fehler zählen extra',46,C.ink);
 squares(s,Wd(15,'Quadrat')-0.4,G,DATA,7,0,'rgba(255,159,67,0.35)',{tOut:tB});
 lineG(s,tB,G,BA,BB,0.3,6.6,C.green,5,{label:'beste',ls:36});
 squares(s,tB+0.6,G,DATA,BA,BB,'rgba(38,194,129,0.45)');
 note(s,Wd(15,'kleinsten')-0.6,1180,730,'beste Gerade:  Fläche = 2,4',58,C.green);check(s,Wd(15,'kleinsten')+0.4,1180+tw('beste Gerade:  Fläche = 2,4',58)+40,730,26);
 note(s,Wd(16,'Methode')-0.2,1180,850,'Methode der kleinsten Quadrate',56,C.red);boxE(s,LE(16)-0.2,[1165,808,tw('Methode der kleinsten Quadrate',56)+30,84],C.red,4);
}
// ---------- S4 Kap 4 ----------
camTo(E(17,-0.7),4);
{const s=4;headingE(s,E(17,0.2),4,'Die Formel');
 write(s,[Wd(18,'Form')+0.1],230,310,['y = a + b · x'],84,C.ink);
 note(s,Wd(18,'Steigung')-0.2,820,290,'b = Steigung',50,C.red);note(s,Wd(18,'Achsenabschnitt')-0.4,820,350,'a = Achsenabschnitt',50,C.blue);
 const fb=F('Σ (x − '+XB+') · (y − '+YB+')','Σ (x − '+XB+')²');fb.cn=C.ink;fb.cd=C.ink;
 const wb=write(s,[Wd(19,'Steigung')-0.2,Wd(19,'Steigung'),Wd(19,'Summe')-0.2],230,520,['b','=',fb],84,C.ink,{cols:[C.red,C.ink,C.ink]});
 boxE(s,LE(19)-0.2,[205,420,xAfter(wb)-180,200],C.red,4);
 note(s,Wd(20,'Mittelwerte')-0.4,230,700,XB+' , '+YB+'  =  Mittelwerte',58,C.blue);
 const G={ox:1220,oy:820,sx:90,sy:32,xm:7,ym:13};
 axes2(s,Wd(20,'Trick')-0.6,G,{fs:24,ls:28});pts(s,Wd(20,'Trick')-0.3,G,DATA,C.blue,0.08,9);lineG(s,Wd(20,'Trick'),G,BA,BB,0.3,6.6,C.green,4);
 star(s,Wd(20,'Punkt')-0.2,G,3,7,C.red,'('+XB+' | '+YB+')');
 note(s,Wd(20,'immer')-0.3,1320,300,'Schwerpunkt liegt IMMER',48,C.red);note(s,Wd(20,'immer'),1320,355,'auf der Geraden!',48,C.red);
 const wa=write(s,[Wd(21,'gleich')-0.2],230,830,['a = '+YB+' − b · '+XB],84,C.ink);boxE(s,LE(21)-0.2,tokRect(wa,0,0,16),C.blue,4);
}
// ---------- S5 CTA ----------
camTo(E(22,-0.7),5);
{const s=5;
 note(s,E(22,0.0),W/2,230,'Kurze Pause! ✋',110,C.red,{align:'c'});
 const btn=(t0,x,y,w,col,txt,ts)=>{custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-w/2,-70,w,140,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(ts||76);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)};
 btn(Wd(22,'Like')-0.2,620,470,420,'#1D6FE0','👍 Like',80);
 btn(Wd(22,'abonnier')-0.2,1300,470,520,'#E8344E','🔔 Abonnieren',76);
 note(s,Wd(22,'Woche')-0.4,W/2,660,'Jede Woche neue Mathe-Themen – einfach erklärt',62,C.ink,{align:'c'});
 note(s,Wd(22,'Tipps')-0.4,W/2,750,'+ Tipps für deine nächste Klassenarbeit ✏️',58,C.green,{align:'c'});
 note(s,Wd(22,'komplett')-0.6,W/2,860,'Weiter geht’s  →',60,C.blue,{align:'c'});
}
// ---------- S6 Kap 5 ----------
camTo(E(23,-0.7),6);
{const s=6;headingE(s,E(23,0.2),5,'Schritt für Schritt');
 const CX=[300,440,620,820,1060,1320],HD=['x','y','x − '+XB,'y − '+YB,'(x−'+XB+')(y−'+YB+')','(x−'+XB+')²'];
 const HC=[C.ink,C.blue,C.ink,C.blue,C.pur,C.org];
 const col=(c,t0,vals,sum,tSum,per)=>{note(s,t0-0.3,CX[c],290,HD[c],46,HC[c],{align:'c'});vals.forEach((v,i)=>note(s,t0+i*(per||0.3),CX[c],365+i*62,v,52,HC[c],{align:'c'}));if(sum!=null)note(s,tSum,CX[c],700,sum,54,HC[c],{align:'c'})};
 custom(s,E(24,0),t=>{const k=eo(prog(t,E(24,0),0.6));if(k<=0)return;hline(220,320,220+1240*k,320,C.ink,2.5);hline(220,660,220+1240*k,660,C.ink,2.5)});
 note(s,E(24,0.2),170,700,'Σ',54,C.red);
 col(0,Wd(24,'eins'),['1','2','3','4','5'],null,0,0.35);col(1,Wd(24,'vier',2),['4','5','8','9','9'],null,0,0.35);
 note(s,Wd(25,'fünfzehn')-0.3,CX[0],700,'15',54,C.ink,{align:'c'});note(s,Wd(25,'fünfunddreißig')-0.3,CX[1],700,'35',54,C.blue,{align:'c'});
 note(s,Wd(25,'quer')-0.2,1500,365,XB+' = 15 : 5 = 3',54,C.ink);note(s,Wd(25,'quer',2)-0.2,1500,440,YB+' = 35 : 5 = 7',54,C.blue);
 marker(s,Wd(25,'drei')+0.1,[1500+tw(XB+' = 15 : 5 = ',54)-6,335,tw('3',54)+14,60]);marker(s,Wd(25,'sieben')+0.1,[1500+tw(YB+' = 35 : 5 = ',54)-6,410,tw('7',54)+14,60]);
 col(2,Wd(26,'minus',1)-0.2,['−2','−1','0','1','2'],'0',Wd(26,'Bei y')-0.3,0.35);
 col(3,Wd(26,'minus',3)-0.2,['−3','−2','1','2','2'],'0',LE(26)-0.2,0.35);
 col(4,Wd(27,'Sechs')-0.3,['6','2','0','2','4'],'14',Wd(27,'vierzehn')-0.2,0.42);
 col(5,Wd(28,'Vier plus')-0.3,['4','1','0','1','4'],'10',Wd(28,'zehn')-0.2,0.42);
 boxE(s,Wd(27,'vierzehn')+0.2,[CX[4]-50,668,100,64],C.pur,4);boxE(s,Wd(28,'zehn')+0.2,[CX[5]-50,668,100,64],C.org,4);
 camTo(E(29,-0.5),6,300);
 const fb=F('14','10');fb.cn=C.pur;fb.cd=C.org;
 write(s,[Wd(29,'Steigung'),Wd(29,'gleich'),Wd(29,'vierzehn'),Wd(29,'eins')-0.2],230,820,['b','=',fb,'= 1,4'],76,C.ink,{cols:[C.red,C.ink,C.ink,C.red]});
 note(s,Wd(29,'sieben')-0.3,900,820,'a = 7 − 1,4 · 3 = 2,8',70,C.blue);
 const wr=write(s,[Wd(30,'lautet')],230,980,['y = 2,8 + 1,4 · x'],96,C.green);boxE(s,LE(30)-0.3,tokRect(wr,0,0,18),C.green,5);
 custom(s,Wd(31,'Profi')-0.3,t=>{const k=eo(prog(t,Wd(31,'Profi')-0.3,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(255,224,70,0.28)';ctx.beginPath();ctx.roundRect(980,920,860,250,22);ctx.fill();hrect(980,920,860,250,C.org,3.5,1);ctx.restore()});
 note(s,Wd(31,'Profi'),1010,965,'💡 Profi-Tipp:',54,C.org);
 note(s,Wd(31,'Statistik')-0.4,1010,1040,'Taschenrechner: Statistik-Modus',48,C.ink);
 note(s,Wd(31,'Rechenweg')-0.4,1010,1110,'aber: Rechenweg zeigen können!',48,C.red);
}
// ---------- S7 Kap 6 ----------
camTo(E(32,-0.7),7);
{const s=7;headingE(s,E(32,0.2),6,'Vorhersagen');
 const G={ox:230,oy:830,sx:105,sy:36,xm:7.4,ym:15};
 axes2(s,E(32,0.6),G,{xl:'Stunden',yl:'Punkte'});pts(s,E(32,0.9),G,DATA,C.blue,0.08);lineG(s,E(32,1.2),G,BA,BB,0.3,7,C.green,5);
 dseg2(s,Wd(33,'sechs')-0.3,PP(G,6,0),PP(G,6,11.2),C.red);dseg2(s,Wd(33,'elf')-0.4,PP(G,6,11.2),PP(G,0,11.2),C.red);star(s,Wd(33,'elf')-0.2,G,6,11.2,C.red,'');
 note(s,Wd(33,'einsetzen')-0.3,1100,300,'y = 2,8 + 1,4 · 6',64,C.ink);note(s,Wd(33,'elf')-0.3,1100,380,'= 11,2 Punkte',64,C.green);
 custom(s,Wd(34,'Stunde')-0.3,t=>{const k=eo(prog(t,Wd(34,'Stunde')-0.3,0.6));if(k<=0)return;const p=PP(G,3,7),q=PP(G,4,7),r=PP(G,4,8.4);ctx.save();ctx.globalAlpha=k;hline(p[0],p[1],q[0],q[1],C.pur,4.5,1);hline(q[0],q[1],r[0],r[1],C.pur,4.5,1);ctx.font=HF(36);ctx.fillStyle=C.pur;ctx.textAlign='center';ctx.fillText('+1',(p[0]+q[0])/2,p[1]+34);ctx.textAlign='left';ctx.fillText('+1,4',q[0]+10,(q[1]+r[1])/2+6);ctx.restore()});
 note(s,Wd(34,'Schnitt')-0.3,1100,490,'+1 Stunde  →  +1,4 Punkte',58,C.pur);
 const H={ox:1150,oy:850,sx:32,sy:9.5,xm:21.5,ym:34};
 axes2(s,Wd(35,'zwanzig')-0.8,H,{xs:5,ys:10,fs:22,ls:26});
 custom(s,Wd(35,'zwanzig')-0.5,t=>{const k=eo(prog(t,Wd(35,'zwanzig')-0.5,0.5));if(k<=0)return;const a=PP(H,1,0),b=PP(H,5,15);ctx.save();ctx.globalAlpha=0.18*k;ctx.fillStyle=C.green;ctx.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);ctx.restore()});
 pts(s,Wd(35,'zwanzig')-0.4,H,DATA,C.blue,0.04,6);
 lineG(s,Wd(35,'zwanzig')-0.2,H,BA,BB,0.3,21,C.green,4);
 dseg2(s,Wd(35,'fünfzehn')-0.4,PP(H,0,15),PP(H,21,15),C.red);note(s,Wd(35,'fünfzehn')-0.2,PP(H,21,15)[0],PP(H,21,15)[1]+34,'max. 15',38,C.red,{align:'r'});
 cross(s,Wd(35,'dreißig')+0.2,PP(H,20,30.8)[0],PP(H,20,30.8)[1],20);note(s,Wd(35,'dreißig')+0.2,PP(H,20,30.8)[0]-30,PP(H,20,30.8)[1]-10,'30,8 ?!',44,C.red,{align:'r'});
 note(s,Wd(35,'Bereich')-0.3,1180,890,'nur im Datenbereich gültig!',48,C.green);
}
// ---------- S8 Kap 7 ----------
camTo(E(36,-0.7),8);
{const s=8;headingE(s,E(36,0.2),7,'Wie gut passt die Gerade?');
 const NX=(r)=>960+r*600,NY=330;
 note(s,Wd(37,'Korrelationskoeffizienten')-0.4,230,270,'Korrelation r',52,C.ink);
 seg(s,Wd(37,'zwischen')-0.3,[NX(-1),NY],[NX(1),NY],C.ink,4,0.6);
 [[-1,'−1'],[0,'0'],[1,'+1']].forEach(([r,l],i)=>{const t0=Wd(37,'zwischen')+0.1+i*0.2;seg(s,t0,[NX(r),NY-14],[NX(r),NY+14],C.ink,4,0.2);lab(s,t0,NX(r),NY+50,l,46,C.ink)});
 const mini=(t0,cx,rr,col,lab_)=>{const pts_=[];for(let i=0;i<9;i++){const x=(i-4)/4;const n=(hsh(i,cx)-0.5)*2;pts_.push([x,rr*x*0.8+n*(1-Math.abs(rr))*0.8+(rr?n*0.12:0)])}
   custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;hrect(cx-130,470,260,220,C.grid,2,1);ctx.fillStyle=col;pts_.forEach(([x,y])=>{ctx.beginPath();ctx.arc(cx+x*100,580-y*90,8,0,7);ctx.fill()});ctx.restore()});WRITES.push([t0,0.4]);
   note(s,t0+0.2,cx,730,lab_,40,col,{align:'c'})};
 mini(Wd(38,'plus')-0.2,NX(1),1,C.green,'stark steigend');mini(Wd(38,'minus')-0.2,NX(-1),-1,C.red,'stark fallend');mini(Wd(38,'null')-0.2,NX(0),0,C.ink,'kein Zusammenhang');
 custom(s,Wd(39,'null')-0.3,t=>{const k=eo(prog(t,Wd(39,'null')-0.3,0.8));if(k<=0)return;const x=lerp(NX(0),NX(0.94),k);ctx.save();ctx.fillStyle=C.green;ctx.beginPath();ctx.moveTo(x,NY-12);ctx.lineTo(x-14,NY-40);ctx.lineTo(x+14,NY-40);ctx.closePath();ctx.fill();ctx.font=HF(44);ctx.textAlign='center';ctx.fillText('r ≈ 0,94',x-40,NY-66);ctx.restore()});WRITES.push([Wd(39,'null')-0.3,0.6]);
 note(s,Wd(40,'Achtung')-0.2,230,830,'Korrelation ≠ Ursache!',58,C.red);
 note(s,Wd(40,'Eisverkauf')-0.3,880,800,'🍦 Eisverkauf ↑   &   Sonnenbrand ↑',50,C.ink);
 note(s,Wd(40,'Trotzdem')-0.2,880,870,'Ursache von beidem: ☀️ die Sonne',50,C.org);
}
// ---------- S9 Kap 8 ----------
camTo(E(41,-0.7),9);
{const s=9;headingE(s,E(41,0.2),8,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,62,C.ink);const wx=290+tw(wrongS,62);cross(s,crossT,wx+52,y,28);
   const x2=wx+115;note(s,rightT,x2,y,rightS,62,C.green);check(s,checkT,x2+tw(rightS,62)+45,y,26)};
 row(330,'#1',E(42,0),Wd(42,'außerhalb')-0.3,'20 h  →  30,8 Punkte',Wd(42,'vorhersagen'),Wd(42,'Gerade')-0.2,'→  nur im Datenbereich',Wd(42,'gesehen')+0.2);
 row(560,'#2',E(43,0),Wd(43,'Korrelation')-0.3,'Korrelation = Ursache',Wd(43,'Ursache')+0.2,Wd(43,'Zusammenhang')-0.3,'→  erst Ursache prüfen',Wd(43,'nichts'));
 row(790,'#3',E(44,0),Wd(44,'Ausreißer')-0.3,'Ausreißer übersehen',Wd(44,'übersehen')+0.2,Wd(44,'Schau')-0.3,'→  erst die Punkte anschauen',Wd(44,'Punkte')+0.2);
}
// ---------- S10 Übung ----------
camTo(E(45,-0.7),10);
{const s=10;headingE(s,E(45,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(45,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(46,'Aufgabe',1),'a)',XB+' = 4,  '+YB+' = 10,  b = 2   →   a = ?'],[Wd(46,'Aufgabe',2),'b)','y = 2 + 2x,   x = 5   →   y = ?'],[Wd(46,'Aufgabe',3),'c)','r = −0,9   →   Bedeutung?']];
 T.forEach(([t0,lb,str],i)=>{const y=330+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,62,C.ink)});
 const T0=LE(46)+0.3,T1=E(47,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(47,'gleich'),'a = 10 − 2 · 4 = 2',Wd(47,'zwei',2)],[Wd(48,'zwei')-0.1,'y = 2 + 2 · 5 = 12',Wd(48,'zwölf')],[Wd(49,'starker')-0.2,'stark fallender Zusammenhang',Wd(49,'kleiner')]];
 SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200+80;note(s,t0,310,y,str,58,C.green);check(s,tc+0.3,310+tw(str,58)+40,y,26)});
 note(s,Wd(50,'Kommentare')-0.6,200,885,'Alles richtig?  →  schreib’s in die Kommentare 💬',56,C.blue);
}
// ---------- S11 Summary ----------
camTo(E(51,-0.7),11);
{const s=11;headingE(s,E(51,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(51,'Punktwolke')-0.6,'• Regression = beste Gerade durch die Punktwolke',C.ink],[Wd(51,'quadrierten')-0.6,'• beste Gerade = kleinste Summe der Fehler-Quadrate',C.green],[Wd(51,'Mittelwert')-0.3,'• Schwerpunkt ('+XB+' | '+YB+') liegt immer auf ihr',C.red],[Wd(51,'vorsichtig')-0.2,'• Vorhersagen nur im Datenbereich!',C.blue]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,58,col));
 camTo(E(52,-0.4),11,180);
 custom(s,E(52,0),t=>{const k=eo(prog(t,E(52,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(52,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(52,'minus')-0.3,270,1020,'(−) · (−) = (+)  …  warum?',64,C.blue);
 custom(s,Wd(52,'Abonnier')-0.2,t=>{const k=prog(t,Wd(52,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(52,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
