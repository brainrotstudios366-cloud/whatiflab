// ===================== CONTENT: Brüche malnehmen & teilen =====================
const SECH=[1080,1080,1560,1080,1080,1620,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
const CHAPS=[[2,1,'Die Regel'],[7,2,'Warum das stimmt'],[16,3,'Über Kreuz kürzen'],[22,4,'Ganze Zahl mal Bruch'],[27,5,'Geteilt durch einen Bruch'],[36,6,'Brüche im Alltag'],[40,7,'Die 3 häufigsten Fehler']];
const xAfter=(w,gap)=>w.ax+totalW(w.L.map(l=>l.tk),w.size)+(gap==null?w.size*0.28:gap);
// strike a digit of a fraction token and write a small replacement
function strikeDigit(s,t0,w,i,part,rep){const l=w.L[i];const cx=w.ax+l.x+l.w/2,cy=w.y+(part==='n'?-0.38:0.44)*w.size;const r=w.size*0.3;
  WRITES.push([t0,0.25]);el(t0,t=>{const k=eo(prog(t,t0,0.3));if(k<=0)return;hline(cx-r,cy+r,cx-r+2*r*k,cy+r-2*r*k,C.red,5);
    if(rep!=null&&k>=1){const k2=prog(t,t0+0.35,0.3);if(k2>0){ctx.save();ctx.globalAlpha=k2;ctx.font=HF(w.size*0.5);ctx.fillStyle=C.red;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(String(rep),cx+r*1.15,cy-r*1.05);ctx.restore()}}},{sec:s})}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Brüche malnehmen & teilen',92,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,200,170+tw('Brüche malnehmen & teilen',92),200,C.red,4,k)});
 write(s,[Wd(0,'Halb'),Wd(0,'plus'),Wd(0,'Drittel')],230,360,[F(1,2),'+',F(1,3)],90,'#8a96b8');
 note(s,Wd(0,'leicht')-0.3,560,360,'… war nicht so leicht 😅',56,'#8a96b8');
 const wh=write(s,[Wd(0,'Halb',2),Wd(0,'mal'),Wd(0,'Drittel',2),Wd(0,'Sekunden')],520,620,[F(1,2),'·',F(1,3),'='],170,C.ink);
 write(s,[Wd(1,'verstehst')],xAfter(wh,40),620,[F(1,6)],170,C.green);
 note(s,Wd(0,'fünf')-0.2,1250,500,'⏱ 5 Sekunden!',64,C.blue);
 note(s,Wd(1,'gemeinsamen'),1250,640,'gemeinsamer Nenner',52,C.ink);strike(s,Wd(1,'gemeinsamen')+0.6,[1245,610,tw('gemeinsamer Nenner',52)+10,60]);
 note(s,Wd(1,'Erweitern'),1250,720,'Erweitern',52,C.ink);strike(s,Wd(1,'Erweitern')+0.5,[1245,690,tw('Erweitern',52)+10,60]);
 note(s,Wd(1,'Heute'),230,860,'heute:  ·  und  :  mit Brüchen – und WARUM es klappt',58,C.red);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Die Regel');
 write(s,[Wd(3,'Zähler')],230,350,[F('Zähler · Zähler','Nenner · Nenner')],100,C.ink);
 marker(s,Wd(3,'Zähler',1),[225,265,560,85]);marker(s,Wd(3,'Nenner')+0.1,[225,355,560,85]);
 const w1=write(s,[Wd(4,'Zwei'),Wd(4,'mal'),Wd(4,'drei',1),Wd(4,'Oben')-0.2,Wd(4,'Oben')],230,640,[F(2,3),'·',F(3,4),'=',F('2·3','3·4')],120,C.ink);
 const w2=write(s,[Wd(4,'Also')-0.2,Wd(4,'Also')],xAfter(w1),640,['=',F(6,12)],120,C.ink);
 note(s,Wd(4,'Oben')+0.2,w1.ax+w1.L[4].x+w1.L[4].w+20,540,'2 · 3 = 6',48,C.blue);note(s,Wd(4,'Unten')+0.2,w1.ax+w1.L[4].x+w1.L[4].w+20,750,'3 · 4 = 12',48,C.red);
 const w3=write(s,[Wd(5,'kürzen'),Wd(5,'Halb')-0.3],xAfter(w2)+20,640,['=',F(1,2)],120,C.green,{cols:[C.ink,C.green]});
 note(s,Wd(5,'sechs',2)-0.2,xAfter(w2)-20,520,': 6',50,C.red);
 boxE(s,Wd(5,'Halb'),tokRect(w3,1,1,16));
 note(s,E(6,0.2),230,880,'✓ kein gemeinsamer Nenner, kein Erweitern',60,C.green);
}
// ---------- S2 Kap 2 ----------
camTo(E(7,-0.7),2);
{const s=2;headingE(s,E(7,0.2),2,'Warum das stimmt');
 note(s,Wd(8,'von')-0.2,230,300,'„mal“  =  „von“',72,C.red);
 note(s,Wd(8,'Hälfte')-0.2,760,300,'½ · ½  =  die Hälfte von der Hälfte',58,C.ink);
 // chocolate 4x2
 const CX=230,CY=420,cw=150,ch=120;
 custom(s,Wd(9,'Schokolade')-0.4,t=>{const k=eo(prog(t,Wd(9,'Schokolade')-0.4,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;
   for(let r=0;r<2;r++)for(let c=0;c<4;c++){ctx.fillStyle='#8B5A33';ctx.beginPath();ctx.roundRect(CX+c*cw+6,CY+r*ch+6,cw-12,ch-12,10);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.14)';ctx.fillRect(CX+c*cw+14,CY+r*ch+14,cw-28,8)}
   hrect(CX,CY,cw*4,ch*2,C.brown,3,1);
   const h1=eo(prog(t,Wd(9,'Hälfte')-0.1,0.5));if(h1>0){ctx.fillStyle='rgba(255,159,67,0.55)';ctx.fillRect(CX,CY,cw*2*h1,ch*2)}
   const h2=eo(prog(t,Wd(10,'Hälfte')-0.1,0.5));if(h2>0){ctx.fillStyle='rgba(77,163,255,0.65)';ctx.fillRect(CX,CY,cw*h2,ch*2)}
   ctx.restore()});
 note(s,Wd(9,'Hälfte'),CX+cw,CY+ch*2+50,'½',60,C.org,{align:'c'});
 note(s,Wd(10,'Viertel',1)-0.2,CX+cw*0.5,CY+ch*2+110,'½ von ½ = ¼',52,C.blu,{align:'c'});
 write(s,[Wd(10,'Halb',1),Wd(10,'mal',1),Wd(10,'Halb',2),Wd(10,'gleich'),Wd(10,'Viertel',2)],1000,560,[F(1,2),'·',F(1,2),'=',F(1,4)],120,C.ink,{cols:[C.org,C.ink,C.ink,C.ink,C.blu]});
 // area model (scroll down)
 camTo(E(11,-0.6),2,480);
 const RX=420,RY=900,RW=660,RH=440;
 custom(s,Wd(11,'Rechteck')-0.3,t=>{const k=eo(prog(t,Wd(11,'Rechteck')-0.3,0.5));if(k<=0)return;
   const f1=eo(prog(t,Wd(11,'zwei',2)-0.2,0.6));if(f1>0){ctx.fillStyle='rgba(255,159,67,0.5)';ctx.fillRect(RX,RY,RW*2/3*f1,RH)}
   const f2=eo(prog(t,Wd(12,'drei')-0.2,0.6));if(f2>0){ctx.fillStyle='rgba(77,163,255,0.45)';ctx.fillRect(RX+RW*2/3,RY,RW/3,RH*3/4*f2);ctx.fillStyle='rgba(155,89,208,'+(0.75*f2)+')';ctx.fillRect(RX,RY,RW*2/3,RH*3/4*f2)}
   hrect(RX,RY,RW,RH,C.ink,3.5,k);
   const v=eo(prog(t,Wd(11,'senkrecht')-0.1,0.5));for(let i=1;i<3;i++)hline(RX+RW*i/3,RY,RX+RW*i/3,RY+RH*v,C.ink,3,1,i*3);
   const h=eo(prog(t,Wd(12,'waagerecht')-0.1,0.5));for(let i=1;i<4;i++)hline(RX,RY+RH*i/4,RX+RW*h,RY+RH*i/4,C.ink,3,1,i*7);
   // counts in overlap
   for(let i=0;i<6;i++){const kk=prog(t,Wd(13,'sechs')-0.2+i*0.22,0.2);if(kk<=0)continue;const c=i%2,r=Math.floor(i/2);ctx.save();ctx.globalAlpha=kk;ctx.font=HF(60);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),RX+RW*(c+0.5)/3,RY+RH*(r+0.5)/4);ctx.restore()}
   const ob=eo(prog(t,Wd(13,'überlappen')-0.1,0.6));if(ob>0)hrect(RX-6,RY-6,RW*2/3+12,RH*3/4+12,C.green,5,ob)});
 note(s,Wd(11,'zwei',2)-0.1,RX+RW/3,RY-40,'⅔',60,C.org,{align:'c'});note(s,Wd(12,'drei')-0.1,RX-60,RY+RH*3/8,'¾',60,C.blu,{align:'c'});
 note(s,Wd(13,'zwölf')-0.2,RX+RW+30,RY+RH-30,'12 Felder',50,C.ink);
 const wa=write(s,[Wd(14,'Sechs'),Wd(14,'Sechs')+0.3,Wd(14,'Sechs')+0.6,Wd(14,'also'),Wd(14,'Zwölftel')-0.2],1220,1010,[F(2,3),'·',F(3,4),'=',F(6,12)],100,C.ink,{cols:[C.org,C.ink,C.blu,C.ink,C.green]});
 note(s,Wd(14,'Oben')-0.1,1220,1150,'oben = überlappende Felder',46,C.green);note(s,Wd(14,'unten')-0.1,1220,1210,'unten = alle Felder',46,C.ink);
 note(s,E(15,0.2),230,1420,'Mal einen Bruch kleiner als 1  →  das Ergebnis wird kleiner',54,C.red);
}
// ---------- S3 Kap 3 ----------
camTo(E(16,-0.7),3);
{const s=3;headingE(s,E(16,0.2),3,'Vorher kürzen: über Kreuz');
 note(s,Wd(17,'großen'),230,300,'große Zahlen?  →  am besten vorher kürzen',56,C.ink);
 const wA=write(s,[E(18,0)],400,580,[F(2,3)],180,C.ink);write(s,[E(18,0.3)],640,580,['·'],180,C.ink);const wB=write(s,[E(18,0.6)],820,580,[F(3,4)],180,C.ink);
 const p=(w,part)=>[w.ax+w.L[0].w/2,w.y+(part==='n'?-0.38:0.44)*w.size];
 custom(s,Wd(18,'Kreuz')-0.6,t=>{const k=eo(prog(t,Wd(18,'Kreuz')-0.6,0.5));if(k<=0)return;const a=p(wA,'d'),b=p(wB,'n');ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=C.red;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a[0]+60,a[1]-30);ctx.lineTo(a[0]+60+(b[0]-a[0]-120)*k,a[1]-30+(b[1]-a[1]+60)*k);ctx.stroke();ctx.restore()});
 custom(s,Wd(19,'durch')-0.4,t=>{const k=eo(prog(t,Wd(19,'durch')-0.4,0.5));if(k<=0)return;const a=p(wA,'n'),b=p(wB,'d');ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=C.blue;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a[0]+60,a[1]+30);ctx.lineTo(a[0]+60+(b[0]-a[0]-120)*k,a[1]+30+(b[1]-a[1]-60)*k);ctx.stroke();ctx.restore()});
 strikeDigit(s,Wd(18,'Kreuz'),wA,0,'d',1);strikeDigit(s,Wd(18,'Kreuz')+0.3,wB,0,'n',1);
 strikeDigit(s,Wd(19,'Eins'),wA,0,'n',1);strikeDigit(s,Wd(19,'Zwei',3)-0.1,wB,0,'d',2);
 note(s,Wd(18,'Kreuz')+0.6,690,730,': 3',52,C.red);note(s,Wd(19,'durch'),690,430,': 2',52,C.blue);
 const wr=write(s,[Wd(20,'eins'),Wd(20,'eins')+0.6,Wd(20,'Halb')-0.3],1080,580,['=',F('1·1','1·2'),'='],130,C.ink);
 const wr2=write(s,[Wd(20,'Halb')],xAfter(wr),580,[F(1,2)],130,C.green);boxE(s,Wd(20,'Halb')+0.4,tokRect(wr2,0,0,14));
 custom(s,E(21,0),t=>{const k=eo(prog(t,E(21,0),0.6));if(k>0)hrect(220,800,1260,110,C.red,3.5,k)});
 note(s,E(21,0.3),250,855,'⚠ Über Kreuz kürzen nur bei  ·  – niemals bei  +',58,C.red);
}
// ---------- S4 Kap 4 ----------
camTo(E(22,-0.7),4);
{const s=4;headingE(s,E(22,0.2),4,'Ganze Zahl mal Bruch');
 const w=write(s,[Wd(23,'Drei'),Wd(23,'mal'),Wd(23,'zwei')],230,350,['3','·',F(2,5)],120,C.ink);
 note(s,Wd(23,'Jede'),230,520,'jede ganze Zahl = Bruch mit Nenner 1',54,C.ink);
 write(s,[Wd(23,'Eintel')-0.4,Wd(23,'Eintel')-0.2,Wd(23,'Eintel')],1000,520,['3','=',F(3,1)],90,C.blue);
 const w2=write(s,[Wd(24,'drei',1),Wd(24,'drei',1)+0.4,Wd(24,'Sechs')-0.3,Wd(24,'Sechs')],xAfter(w,40),350,['=',F('3·2','1·5'),'=',F(6,5)],120,C.ink,{cols:[C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(24,'Sechs')+0.4,tokRect(w2,3,3,14));
 marker(s,Wd(25,'Zähler'),[w2.ax+w2.L[1].x-6,262,w2.L[1].w+12,80]);
 note(s,Wd(25,'Zähler')+0.2,xAfter(w2,70),320,'nur der Zähler · 3',54,C.red);note(s,Wd(25,'Nenner')+0.1,xAfter(w2,70),390,'Nenner bleibt 5',54,C.red);
 // portions
 [0,1,2].forEach(i=>{bar(s,Wd(26,'Portionen')-0.6+i*0.35,230,640+i*75,420,52,{n:5,fills:[[Wd(26,'Portionen')-0.3+i*0.35,0,2,C.grnF]]});note(s,Wd(26,'Portionen')-0.6+i*0.35,680,666+i*75,F?'2/5':'',44,C.green)});
 note(s,Wd(26,'Also')-0.1,800,740,'→ zusammen 6 Fünftel',58,C.green);
}
// ---------- S5 Kap 5 ----------
camTo(E(27,-0.7),5);
{const s=5;headingE(s,E(27,0.2),5,'Geteilt durch einen Bruch');
 const w=write(s,[Wd(28,'Drei'),Wd(28,'geteilt'),Wd(28,'Halb')],230,340,[F(3,4),':',F(1,2)],120,C.ink);
 note(s,Wd(29,'Kehrwert',1)-0.2,230,500,'teilen = mal den Kehrwert',62,C.red);
 const wk=write(s,[Wd(29,'Kopf')-0.4],1080,470,[F(1,2)],110,C.ink);
 arrow(s,Wd(29,'Kopf'),1180,420,1320,420,C.red,50,'umdrehen',44);
 write(s,[Wd(29,'Kopf')+0.4],1360,470,[F(2,1)],110,C.red);
 const w2=write(s,[Wd(30,'geteilt')-0.2,Wd(30,'geteilt'),Wd(30,'mal')-0.1,Wd(30,'mal')+0.2],230,680,['=',F(3,4),'·',F(2,1)],120,C.ink,{cols:[C.ink,C.ink,C.red,C.red]});
 const w3=write(s,[Wd(31,'sechs')-0.2,Wd(31,'sechs'),Wd(31,'drei',2)-0.3,Wd(31,'drei',2),Wd(31,'eineinhalb')-0.3,Wd(31,'eineinhalb')],xAfter(w2),680,['=',F(6,4),'=',F(3,2),'=','1,5'],120,C.ink,{cols:[C.ink,C.ink,C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(31,'eineinhalb')+0.4,tokRect(w3,5,5,14));
 camTo(E(32,-0.6),5,560);
 note(s,Wd(32,'Wie'),230,1010,'Wie oft passt  ½  in  ¾ ?',66,C.blue);
 const BX=230,BW=1000,BY=1120,BH=110;
 bar(s,Wd(32,'Viertel')-0.3,BX,BY,BW,BH,{n:4,fills:[[Wd(32,'Viertel'),0,3,C.orgF]]});
 note(s,Wd(32,'Viertel'),BX+BW+30,BY+55,'¾',64,C.org);
 custom(s,Wd(33,'einmal')-0.2,t=>{const k=eo(prog(t,Wd(33,'einmal')-0.2,0.5));if(k<=0)return;const y=BY+BH+30;hline(BX,y,BX+BW/2*k,y,C.blue,5);hline(BX,y-12,BX,y+12,C.blue,4);if(k>=1)hline(BX+BW/2,y-12,BX+BW/2,y+12,C.blue,4);
   ctx.save();ctx.globalAlpha=k;ctx.font=HF(56);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.fillText('½ → 1 ×',BX+BW/4,y+60);ctx.restore();
   const k2=eo(prog(t,Wd(33,'halbes')-0.3,0.5));if(k2>0){hline(BX+BW/2,y,BX+BW/2+BW/4*k2,y,C.green,5);if(k2>=1)hline(BX+BW*3/4,y-12,BX+BW*3/4,y+12,C.green,4);ctx.save();ctx.globalAlpha=k2;ctx.font=HF(52);ctx.fillStyle=C.green;ctx.textAlign='center';ctx.fillText('½ ×',BX+BW*5/8,y+60);ctx.restore()}});
 note(s,Wd(34,'eineinhalb')-0.2,230,1360,'→ ½ passt  1,5 ×  in  ¾',64,C.green);check(s,Wd(34,'Rechnung'),900,1360,32);
 note(s,E(35,0.3),230,1460,'durch einen Bruch kleiner als 1 teilen  →  Ergebnis wird größer',52,C.red);
}
// ---------- S6 Kap 6 ----------
camTo(E(36,-0.7),6);
{const s=6;headingE(s,E(36,0.2),6,'Brüche im Alltag');
 note(s,Wd(37,'Rezept'),230,320,'🥛 Rezept:  ¾ Liter Milch',64,C.ink);note(s,Wd(37,'halbe'),230,410,'nur das halbe Rezept  →  · ½',58,C.red);
 const w=write(s,[Wd(38,'drei'),Wd(38,'mal'),Wd(38,'Halb'),Wd(38,'acht')-0.6,Wd(38,'Achtel')-0.3],230,580,[F(3,4),'·',F(1,2),'=',F(3,8)],110,C.ink,{cols:[C.ink,C.ink,C.ink,C.ink,C.green]});
 note(s,Wd(38,'Liter')-0.2,xAfter(w,30),580,'Liter',58,C.green);
 // measuring jug
 const JX=1120,JY=240,JW=200,JH=420;
 custom(s,Wd(37,'Milch')-0.3,t=>{const k=eo(prog(t,Wd(37,'Milch')-0.3,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;
   const lv=lerp(6/8,3/8,eio(prog(t,Wd(38,'Achtel')-0.6,1.2)));ctx.fillStyle='rgba(225,240,255,0.95)';ctx.fillRect(JX,JY+JH*(1-lv),JW,JH*lv);
   hline(JX,JY,JX,JY+JH,C.ink,4);hline(JX+JW,JY,JX+JW,JY+JH,C.ink,4);hline(JX,JY+JH,JX+JW,JY+JH,C.ink,4);
   ctx.font=HF(34);ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.textBaseline='middle';for(let i=1;i<8;i++){const y=JY+JH*(1-i/8);hline(JX,y,JX+(i%2?30:55),y,C.ink,2.5);ctx.fillText(i%2?i+'/8':'',JX+JW+12,y)}ctx.fillText('1 l',JX+JW+12,JY);ctx.restore()});
 // pizza 1/2 of 1/4
 const PX=1620,PY=470,PR=160;
 pizza(s,Wd(39,'Pizza')-0.3,PX,PY,PR,{n:4,cutT:Wd(39,'geviertelt')-0.4,fills:[]});
 custom(s,Wd(39,'Hälfte')-0.2,t=>{const k=eo(prog(t,Wd(39,'Hälfte')-0.2,0.5));if(k<=0)return;const a0=-Math.PI/2,a1=a0+Math.PI/4;ctx.save();ctx.globalAlpha=k;ctx.fillStyle=C.orgF;ctx.beginPath();ctx.moveTo(PX,PY);ctx.arc(PX,PY,PR-3,a0,a1);ctx.closePath();ctx.fill();ctx.restore();hline(PX,PY,PX+Math.cos(a1)*PR*k,PY+Math.sin(a1)*PR*k,C.red,3.5)});
 write(s,[Wd(39,'Halb'),Wd(39,'mal'),Wd(39,'Viertel',1),Wd(39,'gleich'),Wd(39,'Achtel')-0.2],230,790,[F(1,2),'·',F(1,4),'=',F(1,8)],100,C.ink,{cols:[C.ink,C.ink,C.ink,C.ink,C.green]});
 note(s,Wd(39,'Achtel')+0.3,PX,PY+PR+60,'⅛ der Pizza',52,C.org,{align:'c'});
}
// ---------- S7 Kap 7 ----------
camTo(E(40,-0.7),7);
{const s=7;headingE(s,E(40,0.2),7,'Die 3 häufigsten Fehler');
 const SZ=84;
 const row=(y,num,tNum,wrongT,wrongToks,crossT,crossIdx,rightT,rightToks,checkT,noteT,noteS)=>{
   note(s,tNum,170,y,num,64,C.red);
   const wW=write(s,wrongT,290,y,wrongToks,SZ,C.ink,{per:0.16});const L=wW.L[crossIdx];cross(s,crossT,wW.ax+L.x+L.w/2,y,34);
   const x2=290+totalW(wrongToks,SZ)+80;write(s,rightT,x2,y,rightToks,SZ,C.green,{per:0.22});const x3=x2+totalW(rightToks,SZ)+50;check(s,checkT,x3,y,30);
   if(noteS)note(s,noteT,x3+70,y,noteS,48,C.green)};
 row(330,'#1',E(41,0),[Wd(41,'Zwei')],[F(2,5),'·',F(3,5),'=',F(6,5)],Wd(41,'nicht')+0.4,4,[Wd(41,'Auch')],['→',F(6,25)],Wd(41,'Fünfundzwanzigstel')+0.3,Wd(41,'Nenner'),'auch die Nenner mal!');
 row(560,'#2',E(42,0),[Wd(42,'falschen')],[F(3,4),':',F(1,2),'=',F(4,3),'·',F(1,2)],Wd(42,'umdrehen')+0.2,4,[Wd(42,'zweite')],['→',F(3,4),'·',F(2,1)],Wd(42,'erste')+0.4,Wd(42,'zweite'),'nur den 2. Bruch umdrehen');
 row(790,'#3',E(43,0),[Wd(43,'Drei')],['3','·',F(2,5),'=',F(6,15)],Wd(43,'nicht')+0.4,4,[Wd(43,'Drei',2)-0.3],['→',F(6,5)],Wd(43,'Zähler')+0.2,Wd(43,'Drei',2),'3 nur in den Zähler');
}
// ---------- S8 Übung ----------
camTo(E(44,-0.7),8);
{const s=8;headingE(s,E(44,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(44,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(45,'Aufgabe',1),'a)',[F(2,5),'·',F(3,4),'=']],[Wd(45,'Aufgabe',2),'b)',['4','·',F(2,9),'=']],[Wd(45,'Aufgabe',3),'c)',[F(2,3),':',F(4,5),'=']]];
 T.forEach(([t0,lab,tk],i)=>{const y=330+i*200;note(s,t0,200,y,lab,70,C.red);write(s,[t0+0.6],310,y,tk,100,C.ink,{per:0.3})});
 const T0=LE(45)+0.3,T1=E(46,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1550,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[[Wd(46,'Sechs')-0.2,Wd(46,'gekürzt'),Wd(46,'Zehntel')-0.3],[F(6,20),'=',F(3,10)]],[[Wd(47,'Acht')-0.2],[F(8,9)]],[[Wd(48,'zwei')-0.2,Wd(48,'mal',2),Wd(48,'fünf'),Wd(48,'zehn')-0.3,Wd(48,'zehn'),Wd(48,'Sechstel')-0.4,Wd(48,'Sechstel')-0.2],[F(2,3),'·',F(5,4),'=',F(10,12),'=',F(5,6)]]];
 SOL.forEach(([ts,tk],i)=>{const y=330+i*200;const x0=(i===1?720:770);write(s,ts,x0,y,tk,100,C.green);check(s,ts[ts.length-1]+0.5,x0+totalW(tk,100)+60,y,32)});
 note(s,Wd(49,'Kommentare')-0.6,200,900,'Alles richtig?  →  schreib’s in die Kommentare 💬',60,C.blue);
}
// ---------- S9 Summary ----------
camTo(E(50,-0.7),9);
{const s=9;headingE(s,E(50,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(50,'Zähler'),'• Zähler · Zähler,  Nenner · Nenner',C.ink],[Wd(50,'Kreuz')-0.4,'• vorher über Kreuz kürzen',C.red],[Wd(50,'ganze'),'• ganze Zahl nur in den Zähler',C.blue],[Wd(50,'Teilen'),'• teilen = mal den Kehrwert (vom 2. Bruch)',C.green]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,62,col));
 camTo(E(51,-0.4),9,180);
 custom(s,E(51,0),t=>{const k=eo(prog(t,E(51,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(51,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(51,'Prozentrechnung')-0.3,270,1020,'Prozentrechnung %  – mit nur 1 Formel',58,C.blue);
 custom(s,Wd(51,'Abonnier')-0.2,t=>{const k=prog(t,Wd(51,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1450,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(51,'Bis')-0.1,1250,860,'Bis dann! 👋',70,C.green);
}
