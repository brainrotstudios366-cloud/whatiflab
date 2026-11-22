// ===================== CONTENT: Brüche addieren =====================
const SECH=[1080,1080,1080,1080,1520,1400,1080,1080,1420,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
const CHAPS=[[3,1,'Was ist ein Bruch?'],[8,2,'Warum 2/5 nicht stimmen kann'],[14,3,'Gleiche Nenner'],[19,4,'Ungleiche Nenner'],[27,5,'Gemeinsamer Nenner'],[33,6,'Kürzen'],[38,7,'Minus geht genauso'],[42,8,'Die 3 häufigsten Fehler']];
// ---------- S0 HOOK ----------
{const s=0;
 const w0=write(s,[Wd(0,'Halb')-0.3,Wd(0,'plus'),Wd(0,'Drittel')-0.2,Wd(0,'Was')],520,500,[F(1,2),'+',F(1,3),'='],170);
 const RX=w0.ax+w0.L[3].x+w0.L[3].w+48;
 write(s,[Wd(0,'Was')+0.25],RX,500,['?'],170,C.ink,{tOut:Wd(1,'Also')-0.1});
 const wq=write(s,[Wd(1,'Also')+0.1],RX,500,[F(2,5)],170,C.ink);const RW=wq.L[0].w;
 note(s,Wd(1,'eins'),RX+RW+80,330,'1 + 1 = 2',62,C.red);arrow(s,Wd(1,'eins')+0.6,RX+RW+70,345,RX+RW+12,410,C.red,0);
 note(s,Wd(1,'drei')-0.6,RX+RW+80,690,'2 + 3 = 5',62,C.red);arrow(s,Wd(1,'drei'),RX+RW+70,675,RX+RW+12,600,C.red,0);
 cross(s,Wd(2,'falsch')-0.2,RX+RW/2,500,100);
 note(s,Wd(2,'warum')-0.1,520,800,'warum?',72,C.red);note(s,Wd(2,'richtig')-0.3,800,800,'→  und wie geht’s richtig?',72,C.green);
 note(s,0.3,170,150,'Brüche addieren',92,C.red);custom(s,0.9,t=>{const k=eo(prog(t,0.9,0.6));if(k>0)hline(170,200,170+tw('Brüche addieren',92),200,C.red,4,k)});
}
// hide '?' when 2/5 written: draw a paper patch over '?'
// ---------- S1 Kap 1 ----------
camTo(E(3,-0.7),1);
{const s=1;headingE(s,E(3,0.2),1,'Was ist ein Bruch?');
 pizza(s,E(4,0.4),520,580,250,{n:4,cutT:Wd(4,'geschnitten')-0.6,fills:[[Wd(6,'drei',1),0,C.orgF],[Wd(6,'drei',1)+0.35,1,C.orgF],[Wd(6,'drei',1)+0.7,2,C.orgF]]});
 const fr=write(s,[Wd(4,'Nenner')-0.4],1080,560,[F(3,4)],260,C.ink);
 marker(s,Wd(4,'unten'),[fr.ax-8,590,fr.L[0].w+16,165]);
 note(s,Wd(4,'unten')+0.3,1290,690,'Nenner: in wie viele',58,C.red);note(s,Wd(4,'gleich')+0.2,1290,750,'gleiche Stücke?',58,C.red);
 arrow(s,Wd(4,'unten')+0.5,1280,700,1240,670,C.red,0);
 marker(s,Wd(5,'Zähler'),[fr.ax-8,375,fr.L[0].w+16,165]);
 note(s,Wd(5,'oben')+0.2,1290,390,'Zähler: wie viele',58,C.blue);note(s,Wd(5,'Wie')+0.3,1290,450,'Stücke hast du?',58,C.blue);
 note(s,Wd(6,'Drei'),330,890,'3/4: 4 Stücke, 3 davon',54,C.ink);
 custom(s,Wd(7,'Unten')-0.4,t=>{const k=eo(prog(t,Wd(7,'Unten')-0.4,0.5));if(k>0)hrect(1060,840,780,100,C.ink,2.5,k)});
 note(s,Wd(7,'Unten')-0.1,1090,890,'unten = wie groß',54,C.red);note(s,Wd(7,'Oben')-0.1,1480,890,'oben = wie viele',54,C.blue);
}
// ---------- S2 Kap 2 ----------
camTo(E(8,-0.7),2);
{const s=2;headingE(s,E(8,0.2),2,'Warum 2/5 nicht stimmen kann');
 const BX=520,BW=1100;
 bar(s,E(9,0),BX,330,BW,110,{n:1,fills:[[Wd(9,'Halb')-0.2,0,1,C.orgF,2],[Wd(10,'Drittel')-0.2,3,5,C.bluF,6]]});
 custom(s,Wd(10,'Drittel')-0.2,t=>{const k=prog(t,Wd(10,'Drittel')-0.2,0.5);if(k<=0)return;hline(BX+BW/2,330,BX+BW/2,440,C.ink,3,eo(k));hline(BX+BW*5/6,330,BX+BW*5/6,440,C.ink,3,eo(k))});
 write(s,[Wd(9,'Halb'),Wd(10,'Drittel')],250,385,[F(1,2),'+',F(1,3)],78,C.ink,{cols:[C.org,C.ink,C.blu]});
 bar(s,Wd(11,'Fünftel')-0.4,BX,600,BW,110,{n:5,fills:[[Wd(11,'Fünftel')+0.2,0,2,C.purF]]});
 write(s,[Wd(11,'Fünftel')-0.2],330,655,[F(2,5)],78,C.pur);
 // half line
 custom(s,Wd(9,'Hälfte'),t=>{const k=eo(prog(t,Wd(9,'Hälfte'),0.7));if(k<=0)return;ctx.save();ctx.setLineDash([16,14]);ctx.strokeStyle=C.red;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(BX+BW/2,290);ctx.lineTo(BX+BW/2,290+(500)*k);ctx.stroke();ctx.restore();
   ctx.save();ctx.globalAlpha=k;ctx.font=HF(52);ctx.fillStyle=C.red;ctx.textAlign='center';ctx.fillText('Hälfte',BX+BW/2,268);ctx.restore()});
 note(s,Wd(10,'mehr')-0.2,BX+BW*5/6+20,480,'mehr als die Hälfte!',52,C.blue,{align:'c'});
 note(s,Wd(11,'weniger')-0.1,BX+BW*0.4,760,'weniger als die Hälfte!',52,C.red,{align:'c'});
 note(s,Wd(12,'Unmöglich')-0.2,1120,880,'Unmöglich!',90,C.red);cross(s,Wd(12,'stimmen')-0.4,340,655,60);
 note(s,Wd(13,'verschieden')-0.2,170,880,'½ und ⅓ = verschieden große Stücke',56,C.ink);
}
// ---------- S3 Kap 3 ----------
camTo(E(14,-0.7),3);
{const s=3;headingE(s,E(14,0.2),3,'Gleiche Nenner');
 const w=write(s,[Wd(15,'Zwei'),Wd(15,'plus'),Wd(15,'drei')],230,340,[F(2,7),'+',F(3,7)],120,C.ink);
 const BX=230,BW=1000,BY=490;
 bar(s,Wd(15,'gleich')-0.4,BX,BY,BW,120,{n:7,fills:[[Wd(15,'Zwei')+0.5,0,2,C.grnF],[Wd(15,'drei')+0.5,2,5,C.grnF2]]});
 note(s,Wd(15,'lauter'),BX+BW/2,670,'lauter Siebtel',56,C.green,{align:'c'});
 custom(s,Wd(16,'zählst'),t=>{for(let i=0;i<5;i++){const k=prog(t,Wd(16,'zählst')+0.3+i*0.28,0.25);if(k<=0)continue;ctx.save();ctx.globalAlpha=k;ctx.font=HF(56);ctx.fillStyle=C.green;ctx.textAlign='center';ctx.fillText(String(i+1),BX+BW*(i+0.5)/7,BY-28);ctx.restore()}});
 const w2=write(s,[Wd(16,'gleich'),Wd(16,'Ergebnis')+0.3],w.ax+totalW(w.L.map(l=>l.tk),120)+34,340,['=',F(5,7)],120,C.ink,{cols:[C.ink,C.green]});
 note(s,Wd(16,'zwei'),1330,520,'Zähler:  2 + 3 = 5',58,C.blue);
 marker(s,Wd(17,'Nenner'),[w2.ax+w2.L[1].x-6,348,w2.L[1].w+12,92]);
 note(s,Wd(17,'bleibt')+0.2,1330,600,'Nenner bleibt 7!',58,C.red);
 note(s,Wd(18,'Äpfel',1)-0.3,230,800,'2 🍎 + 3 🍎 = 5 🍎',72,C.ink);
 note(s,Wd(18,'Sorte',2)-0.3,870,800,'→ die Sorte (der Nenner) bleibt gleich',54,C.red);
}
// ---------- S4 Kap 4 ----------
camTo(E(19,-0.7),4);
{const s=4;headingE(s,E(19,0.2),4,'Ungleiche Nenner: der Trick');
 const BX=170,BW=900;
 write(s,[Wd(20,'Halb'),Wd(20,'plus'),Wd(20,'Drittel')],1250,320,[F(1,2),'+',F(1,3)],88,C.ink,{cols:[C.org,C.ink,C.blu]});
 bar(s,Wd(20,'Halb')+0.2,BX,280,BW,90,{n:2,fills:[[Wd(20,'Halb')+0.5,0,1,C.orgF]],splits:[[Wd(21,'drei')-0.3,6]],splitRange:[0,0.5]});
 bar(s,Wd(20,'Drittel')+0.2,BX,410,BW,90,{n:3,fills:[[Wd(20,'Drittel')+0.5,0,1,C.bluF]],splits:[[Wd(22,'zwei')-0.3,6]],splitRange:[0,0.34]});
 custom(s,Wd(20,'verschieden'),t=>{const a=prog(t,Wd(20,'verschieden'),0.4)*(1-prog(t,Wd(23,'Menge')-0.2,0.3));if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.font=HF(52);ctx.fillStyle=C.red;ctx.fillText('verschieden große Stücke …',BX,560);ctx.restore()});
 custom(s,Wd(23,'Menge'),t=>{const a=prog(t,Wd(23,'Menge'),0.4);if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.font=HF(52);ctx.fillStyle=C.green;ctx.fillText('gleiche Menge, nur kleinere Stücke',BX,560);ctx.restore()});
 write(s,[Wd(21,'Halb',1)+0.2,Wd(21,'werden'),Wd(21,'Sechstel')-0.2],1250,480,[F(1,2),'=',F(3,6)],88,C.ink,{cols:[C.org,C.ink,C.org]});
 write(s,[Wd(22,'Drittel',2)-0.2,Wd(22,'werden'),Wd(22,'Sechstel')-0.2],1250,640,[F(1,3),'=',F(2,6)],88,C.ink,{cols:[C.blu,C.ink,C.blu]});
 note(s,Wd(23,'Erweitern')-0.2,1580,560,'= Erweitern',58,C.red);
 bar(s,Wd(24,'alles'),BX,650,BW,90,{n:6,fills:[[Wd(24,'Drei')+0.1,0,3,C.orgF],[Wd(24,'zwei')+0.1,3,5,C.bluF]]});
 const ws=write(s,[Wd(24,'Drei'),Wd(24,'plus'),Wd(24,'zwei'),Wd(24,'gleich'),Wd(24,'fünf')],1150,810,[F(3,6),'+',F(2,6),'=',F(5,6)],88,C.ink,{cols:[C.org,C.ink,C.blu,C.ink,C.green]});
 boxE(s,Wd(25,'fünf')-0.3,tokRect(ws,4,4,16));
 note(s,Wd(25,'Nicht'),BX,820,'… und nicht 2/5!',64,C.red);
 camTo(E(26,-0.6),4,560);
 note(s,E(26,0.2),BX,1110,'Erweitern = oben und unten mal die gleiche Zahl',58,C.ink);
 const wx=write(s,[Wd(26,'Halb')-0.2,Wd(26,'oben'),Wd(26,'gibt')],560,1320,[F(1,2),'=',F(3,6)],150,C.ink);
 arrow(s,Wd(26,'oben'),wx.ax+wx.L[0].x+wx.L[0].w*0.6,1238,wx.ax+wx.L[2].x+wx.L[2].w*0.4,1238,C.red,45,'· 3',50);
 arrow(s,Wd(26,'unten')-0.1,wx.ax+wx.L[0].x+wx.L[0].w*0.6,1405,wx.ax+wx.L[2].x+wx.L[2].w*0.4,1405,C.red,-45,'· 3',50);
}
// ---------- S5 Kap 5 ----------
camTo(E(27,-0.7),5);
{const s=5;headingE(s,E(27,0.2),5,'Gemeinsamer Nenner');
 write(s,[E(28,0.2),E(28,0.5),E(28,0.8)],230,330,[F(1,4),'+',F(1,6)],100,C.ink,{cols:[C.org,C.ink,C.blu]});
 note(s,Wd(28,'sichere'),230,470,'sicher:  4 · 6 = 24',58,C.ink);
 note(s,Wd(29,'schlaue'),230,560,'schlau:  kleinstes gemeinsames Vielfaches (kgV)',58,C.ink);
 note(s,Wd(30,'Viererreihe'),300,660,'4er:',58,C.org);note(s,Wd(30,'Sechserreihe'),300,740,'6er:',58,C.blu);
 [['vier',2,'4',430],['acht',1,'8',520],['zwölf',1,'12',610]].forEach(([wd,o,s2,x])=>note(s,Wd(30,wd,o),x,660,s2,58,C.ink));
 [['sechs',1,'6',430],['zwölf',2,'12',610]].forEach(([wd,o,s2,x])=>note(s,Wd(30,wd,o),x,740,s2,58,C.ink));
 custom(s,Wd(30,'Treffer'),t=>{const k=prog(t,Wd(30,'Treffer'),0.6);if(k<=0)return;hcircle(640,700,82,C.green,4,eo(k))});
 note(s,Wd(30,'Treffer')+0.3,760,700,'kgV = 12',60,C.green);
 const w12=write(s,[Wd(31,'drei'),Wd(31,'Zwölfteln',1),Wd(31,'zwei'),Wd(31,'Zusammen'),Wd(31,'fünf')],230,880,['=',F(3,12),'+',F(2,12),'=',F(5,12)],100,C.ink,{cols:[C.ink,C.org,C.ink,C.blu,C.ink,C.green]});
 bar(s,Wd(31,'Viertel')-0.2,1150,300,620,90,{n:12,fills:[[Wd(31,'drei')+0.2,0,3,C.orgF],[Wd(31,'zwei')+0.2,3,5,C.bluF]]});
 note(s,Wd(31,'Viertel'),1150,440,'Zwölftel',50,C.ink);
 boxE(s,Wd(31,'fünf')+0.4,tokRect(w12,5,5,14));
 camTo(E(32,-0.6),5,300);
 const w24=write(s,[Wd(32,'vierundzwanzig')+0.1,Wd(32,'zehn')-0.6,Wd(32,'zehn')-0.3,Wd(32,'zehn'),Wd(32,'kürzen'),Wd(32,'fünf')],230,1100,['mit 24:',F(6,24),'+',F(4,24),'=',F(10,24),'=',F(5,12)],90,C.ink,{cols:[C.ink,C.org,C.ink,C.blu,C.ink,C.ink,C.ink,C.green]});
 // that call has 8 tokens but 6 times -> rest sequential
 note(s,Wd(32,'kürzen')+0.2,1180,1240,'kürzen:  : 2',54,C.red);
}
// ---------- S6 Kap 6 ----------
camTo(E(33,-0.7),6);
{const s=6;headingE(s,E(33,0.2),6,'Kürzen');
 note(s,Wd(34,'teilst'),230,300,'Kürzen = oben und unten durch die gleiche Zahl teilen',56,C.ink);
 const wk=write(s,[Wd(35,'Sechs'),Wd(35,'gleich',2)-0.2,Wd(35,'Also')+0.2],330,560,[F(6,8),'=',F(3,4)],170,C.ink,{cols:[C.ink,C.ink,C.green]});
 arrow(s,Wd(35,'durch')-0.2,wk.ax+wk.L[0].x+wk.L[0].w*0.6,450,wk.ax+wk.L[2].x+wk.L[2].w*0.4,450,C.red,55,': 2',50);
 arrow(s,Wd(35,'acht',2)-0.2,wk.ax+wk.L[0].x+wk.L[0].w*0.6,680,wk.ax+wk.L[2].x+wk.L[2].w*0.4,680,C.red,-55,': 2',50);
 bar(s,Wd(35,'Sechs')+0.3,1060,470,720,110,{n:8,fills:[[Wd(35,'Sechs')+0.6,0,6,C.grnF]],merges:[[Wd(36,'weniger')-0.3,4]]});
 note(s,Wd(36,'Menge'),1420,640,'gleiche Menge – größere Stücke',50,C.green,{align:'c'});
 custom(s,E(37,0),t=>{const k=eo(prog(t,E(37,0),0.6));if(k>0){hrect(220,760,1200,130,C.red,3.5,k)}});
 note(s,E(37,0.3),250,825,'💡 Tipp: am Ende immer so weit wie möglich kürzen!',56,C.red);
}
// ---------- S7 Kap 7 ----------
camTo(E(38,-0.7),7);
{const s=7;headingE(s,E(38,0.2),7,'Minus geht genauso');
 write(s,[E(39,0),E(39,0.4),E(39,0.9)],230,330,[F(3,4),'−',F(1,3)],100,C.ink);
 note(s,Wd(39,'Gemeinsamer'),620,330,'gemeinsamer Nenner: 12',56,C.red);
 const wm=write(s,[Wd(40,'neun')-0.3,Wd(40,'neun'),Wd(40,'minus')-0.4,Wd(40,'vier'),Wd(40,'Ergebnis'),Wd(40,'fünf',2)],230,500,['=',F(9,12),'−',F(4,12),'=',F(5,12)],100,C.ink,{cols:[C.ink,C.ink,C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(40,'fünf',2)+0.4,tokRect(wm,5,5,14));
 // chocolate 3x2
 const CX=1330,CY=300,cw=130,ch=110;
 custom(s,Wd(41,'Schokolade')-0.4,t=>{const k=eo(prog(t,Wd(41,'Schokolade')-0.4,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;
   for(let r=0;r<2;r++)for(let c=0;c<3;c++){const i=r*3+c;const half=i<3;const eaten=(i===1||i===2)?prog(t,Wd(41,'isst')+0.4+(i-1)*0.4,0.4):0;const show=half?1:0.45;if(eaten>=1){ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=C.red;ctx.lineWidth=2.5;ctx.strokeRect(CX+c*cw+8,CY+r*ch+8,cw-16,ch-16);ctx.restore();continue}
     ctx.save();ctx.globalAlpha*=show*(1-eaten);ctx.fillStyle=half?'#8B5A33':'#C9A88A';ctx.beginPath();ctx.roundRect(CX+c*cw+6,CY+r*ch+6,cw-12,ch-12,10);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(CX+c*cw+14,CY+r*ch+14,cw-28,8);ctx.restore()}
   hrect(CX,CY,cw*3,ch*2,C.brown,3,1);ctx.restore()});
 note(s,Wd(41,'halbe'),CX,CY+ch*2+50,'½ Tafel = 3 von 6 Stücken',48,C.brown);
 note(s,Wd(41,'isst')+0.4,CX,CY+ch*2+110,'⅓ der Tafel = 2 Stücke weg',48,C.red);
 write(s,[Wd(41,'Drei'),Wd(41,'minus'),Wd(41,'zwei'),Wd(41,'Also'),Wd(41,'Sechstel',3)],230,760,[F(3,6),'−',F(2,6),'=',F(1,6)],100,C.ink,{cols:[C.ink,C.ink,C.ink,C.ink,C.green]});
}
// ---------- S8 Kap 8 ----------
camTo(E(42,-0.7),8);
{const s=8;headingE(s,E(42,0.2),8,'Die 3 häufigsten Fehler');
 const SZ=84;
 const row=(y,num,tNum,wrongT,wrongToks,crossT,crossIdx,rightT,rightToks,checkT,noteT,noteS)=>{
   note(s,tNum,170,y,num,64,C.red);
   const wW=write(s,wrongT,290,y,wrongToks,SZ,C.ink,{per:0.16});const L=wW.L[crossIdx];cross(s,crossT,wW.ax+L.x+L.w/2,y,34);
   const x2=290+totalW(wrongToks,SZ)+80;const wR=write(s,rightT,x2,y,rightToks,SZ,C.green,{per:0.22});const x3=x2+totalW(rightToks,SZ)+50;check(s,checkT,x3,y,30);
   if(noteS)note(s,noteT,x3+70,y,noteS,48,C.green)};
 row(330,'#1',E(43,0),[E(43,0.3)],[F(1,2),'+',F(1,3),'=',F(2,5)],Wd(43,'nie')-0.2,4,[Wd(43,'Erst')],['→',F(5,6)],Wd(43,'Zähler',1)+0.3,Wd(43,'Erst'),'erst gleicher Nenner, dann Zähler');
 row(560,'#2',E(44,0),[E(44,0.4)],[F(1,2),'=',F(1,6)],Wd(44,'Sechstel')-0.1,2,[Wd(44,'Wenn')],['→',F(1,2),'=',F(3,6)],Wd(44,'oben')+0.3,Wd(44,'oben')-0.3,'oben UND unten · 3');
 row(790,'#3',E(45,0),[E(45,0.6)],['1','+',F(1,4),'=',F(2,5)],Wd(45,'Fünftel')-0.2,4,[Wd(45,'Eins',2)-0.2,Wd(45,'vier')],['→',F(4,4),'+',F(1,4),'=',F(5,4)],Wd(45,'fünf')+0.4,Wd(45,'Eins',2),'denn 1 = 4/4');
 camTo(E(46,-0.6),8,360);
 custom(s,E(46,0),t=>{const k=eo(prog(t,E(46,0),0.6));if(k>0)hrect(200,1080,1500,230,C.blue,3.5,k)});
 note(s,E(46,0.2),240,1140,'🎯 Profi-Trick: vorher schätzen!',60,C.blue);
 write(s,[Wd(46,'Halb',1),Wd(46,'plus')],260,1240,[F(1,2),'+',F(1,3),'>',F(1,2)],80,C.ink,{per:0.3});
 note(s,Wd(46,'kleiner')-0.2,820,1240,'Ergebnis kleiner?  →  verrechnet!',54,C.red);
}
// ---------- S9 Übung ----------
camTo(E(47,-0.7),9);
{const s=9;headingE(s,E(47,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(47,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(48,'Aufgabe',1),'a)',[F(2,9),'+',F(5,9),'=']],[Wd(48,'Aufgabe',2),'b)',[F(1,2),'+',F(1,4),'=']],[Wd(48,'Aufgabe',3),'c)',[F(2,3),'−',F(1,4),'=']]];
 T.forEach(([t0,lab,tk],i)=>{const y=330+i*200;note(s,t0,200,y,lab,70,C.red);write(s,[t0+0.6],310,y,tk,100,C.ink,{per:0.3})});
 // countdown clock
 const T0=LE(48)+0.3,T1=E(49,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1550,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[[Wd(49,'Sieben')-0.2],[F(7,9)]],[[Wd(50,'zwei')-0.2,Wd(50,'Plus'),Wd(50,'Plus')+0.4,Wd(50,'gleich'),Wd(50,'drei')],[F(2,4),'+',F(1,4),'=',F(3,4)]],[[Wd(51,'Acht')-0.2,Wd(51,'minus'),Wd(51,'drei'),Wd(51,'gleich'),Wd(51,'fünf')],[F(8,12),'−',F(3,12),'=',F(5,12)]]];
 SOL.forEach(([ts,tk],i)=>{const y=330+i*200;const w=write(s,ts,770,y,tk,100,C.green);const ex=770+totalW(tk,100)+60;check(s,ts[ts.length-1]+0.5,ex,y,32)});
 note(s,Wd(52,'Kommentare')-0.6,200,900,'Alle richtig?  →  schreib’s in die Kommentare 💬',60,C.blue);
}
// ---------- S10 Summary ----------
camTo(E(53,-0.7),10);
{const s=10;headingE(s,E(53,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(53,'Nenner'),'• Nenner = wie groß die Stücke sind',C.red],[Wd(53,'Zähler'),'• Zähler = wie viele Stücke du hast',C.blue],[Wd(53,'Addieren'),'• nur gleich große Stücke addieren',C.ink],[Wd(53,'erst'),'• erst gleicher Nenner, dann Zähler rechnen',C.ink],[Wd(53,'bleibt')-0.3,'• der Nenner bleibt!',C.green]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,310+i*95,str,62,col));
 camTo(E(54,-0.4),10,180);
 custom(s,E(54,0),t=>{const k=eo(prog(t,E(54,0),0.6));if(k>0)hrect(230,850,900,260,C.ink,3.5,k)});
 note(s,E(54,0.2),270,905,'Nächstes Video:',56,C.ink);
 write(s,[Wd(54,'malnehmen')-0.4],270,1020,[F(2,3),'·',F(3,4),'=','?'],90,C.blue,{per:0.25});
 custom(s,Wd(54,'Abonnier')-0.2,t=>{const k=prog(t,Wd(54,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1450,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(54,'Bis')-0.1,1250,860,'Bis dann! 👋',70,C.green);
}
