// ===================== CONTENT: Prozentrechnung =====================
const SECH=[1080,1080,1080,1080,1520,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
const CHAPS=[[2,1,'Was heißt Prozent?'],[8,2,'Die drei Begriffe'],[14,3,'Die Formel'],[21,4,'Die Formel umstellen'],[29,5,'Kopfrechen-Tricks'],[34,6,'Der Trick, der alle reinlegt'],[40,7,'Die 3 häufigsten Fehler']];
const xAfter=(w,gap)=>w.ax+totalW(w.L.map(l=>l.tk),w.size)+(gap==null?w.size*0.28:gap);
const S_=(s,c)=>({s,c});
// price tag
function tag(s,t0,x,y,price,sticker,tS){custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.translate(x,y);ctx.rotate(-0.08);
  ctx.fillStyle='#FFF6D8';ctx.beginPath();ctx.moveTo(-60,-120);ctx.lineTo(240,-120);ctx.lineTo(240,120);ctx.lineTo(-60,120);ctx.lineTo(-140,0);ctx.closePath();ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.stroke();
  ctx.beginPath();ctx.arc(-80,0,14,0,7);ctx.stroke();ctx.font=HF(120);ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(price,90,8);
  if(sticker&&t>tS){const k2=prog(t,tS,0.3);ctx.save();ctx.translate(210,-110);ctx.rotate(0.25);const sc=lerp(1.6,1,eo(k2));ctx.scale(sc,sc);ctx.globalAlpha*=k2;ctx.fillStyle='#E8344E';ctx.beginPath();ctx.arc(0,0,78,0,7);ctx.fill();ctx.font=HF(64);ctx.fillStyle='#fff';ctx.fillText(sticker,0,4);ctx.restore()}
  ctx.restore()})}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Prozentrechnung – mit 1 Formel',92,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,200,170+tw('Prozentrechnung – mit 1 Formel',92),200,C.red,4,k)});
 note(s,Wd(0,'Jacke')-0.3,230,400,'🧥 Jacke',90,C.ink);
 tag(s,Wd(0,'Jacke'),1250,450,'80 €','−30 %',Wd(0,'Prozent'));
 note(s,Wd(0,'Wie'),230,560,'Wie viel zahlst du?',80,C.blue);
 note(s,Wd(1,'Formel')-0.2,230,760,'✓ 1 Formel   ✓ 10 Sekunden',62,C.green);
 note(s,Wd(1,'Trick')-0.2,230,860,'+ ein Trick, der fast alle reinlegt 🤯',58,C.red);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Was heißt Prozent?');
 const GX=230,GY=280,CS=58;
 custom(s,Wd(3,'hundert',2)-0.3,t=>{const k=eo(prog(t,Wd(3,'hundert',2)-0.3,0.8));if(k<=0)return;
   // fills
   const tAll=Wd(6,'alle')-0.1;const aAll=eo(prog(t,tAll,0.8));
   for(let r=0;r<10;r++)for(let c=0;c<10;c++){const i=r*10+c;let col=null;
     if(aAll>0&&(r*10+c)/100<aAll)col='rgba(77,163,255,0.30)';
     const q=r<5&&c<5;const tq=Wd(5,'fünfundzwanzig',2)-0.2+(r*5+c)*0.03;if(q&&t>tq&&t<tAll+0.8)col=t<tAll?C.orgF:col||C.orgF;
     if(i===0&&t>Wd(4,'Kästchen')-0.3)col=t<Wd(5,'Fünfundzwanzig')?'rgba(214,58,58,0.65)':col||C.orgF;
     if(col){ctx.fillStyle=col;ctx.fillRect(GX+c*CS+2,GY+r*CS+2,CS-4,CS-4)}}
   for(let i=0;i<=10;i++){hline(GX+i*CS,GY,GX+i*CS,GY+10*CS*k,C.ink,i%10?2:3.5,1,i);hline(GX,GY+i*CS,GX+10*CS*k,GY+i*CS,C.ink,i%10?2:3.5,1,i+20)}});
 const RX=900;
 note(s,Wd(3,'Prozent')+0.1,RX,320,'Prozent = „von hundert“',64,C.red);
 write(s,[Wd(4,'Hundertstel')-0.4,Wd(4,'Hundertstel')-0.2,Wd(4,'Hundertstel')],RX,450,['1 %','=',F(1,100)],90,C.red);
 write(s,[Wd(5,'Fünfundzwanzig'),Wd(5,'sind'),Wd(5,'fünfundzwanzig',2),Wd(5,'Viertel')-0.3,Wd(5,'Viertel')],RX,610,['25 %','=',F(25,100),'=',F(1,4)],90,C.org);
 note(s,Wd(6,'alle')+0.2,RX,760,'100 %  =  das Ganze',64,C.blue);
 note(s,Wd(7,'Fünfzig'),RX,860,'50 % = ½ = 0,5',58,C.ink);note(s,Wd(7,'Zehn'),RX+460,860,'10 % = 0,1',58,C.ink);
}
// ---------- S2 Kap 2 ----------
camTo(E(8,-0.7),2);
{const s=2;headingE(s,E(8,0.2),2,'Die drei Begriffe');
 note(s,Wd(9,'Grundwert')-0.2,230,290,'G  Grundwert = das Ganze (100 %)',60,C.blue);
 note(s,Wd(10,'Prozentsatz')-0.2,230,370,'p  Prozentsatz = wie viel Prozent',60,C.org);
 note(s,Wd(11,'Prozentwert')-0.2,230,450,'W  Prozentwert = das Stück',60,C.green);
 const BX=230,BY=580,BW=1200,BH=110;
 bar(s,Wd(9,'Ganze')-0.2,BX,BY,BW,BH,{n:1,splits:[[Wd(10,'Prozent',2)-0.2,5]],fills:[[Wd(11,'Stück')-0.3,0,1,C.grnF,5]]});
 custom(s,Wd(9,'hundert')-0.2,t=>{const k=eo(prog(t,Wd(9,'hundert')-0.2,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.font=HF(56);ctx.fillStyle=C.blue;ctx.textAlign='right';ctx.fillText('100 %',BX+BW-170,BY-30);ctx.restore()});
 custom(s,Wd(11,'Stück')-0.2,t=>{const k=eo(prog(t,Wd(11,'Stück')-0.2,0.5));if(k<=0)return;const y=BY+BH+24;hline(BX,y,BX+BW/5*k,y,C.green,5);hline(BX,y-12,BX,y+12,C.green,4);if(k>=1)hline(BX+BW/5,y-12,BX+BW/5,y+12,C.green,4)});
 note(s,Wd(12,'fünfzig',2)-0.2,BX+BW-150,BY-30,'= 50 €',56,C.blue);
 note(s,Wd(12,'zwanzig',2)-0.2,BX+BW/10,BY+BH+80,'20 %',56,C.org,{align:'c'});
 note(s,Wd(12,'zehn')-0.2,BX+BW/10,BY+BH+140,'= 10 €',56,C.green,{align:'c'});
 note(s,Wd(13,'Trick'),600,860,'Tipp: Der Grundwert steht hinter „von“:',52,C.ink);
 const wv=write(s,[Wd(13,'Zwanzig')],1380,860,[S_('20 % von '),S_('50',C.blue)],58,C.ink,{per:0.3});
 marker(s,Wd(13,'Fünfzig')-0.1,tokRect(wv,1,1,6));
}
// ---------- S3 Kap 3 ----------
camTo(E(14,-0.7),3);
{const s=3;headingE(s,E(14,0.2),3,'Die Formel');
 const wf=write(s,[Wd(15,'Prozentwert'),Wd(15,'gleich'),Wd(15,'Grundwert'),Wd(15,'mal'),Wd(15,'Prozentsatz')],260,330,['W','=','G','·','p'],150,C.ink,{cols:[C.green,C.ink,C.blue,C.ink,C.org]});
 boxE(s,Wd(15,'Prozentsatz')+0.5,[220,250,totalW(['W','=','G','·','p'],150)+130,160],C.red,5);
 note(s,Wd(15,'Prozentsatz')+0.6,totalW(['W','=','G','·','p'],150)+390,330,'← die eine Formel!',58,C.red);
 write(s,[Wd(16,'Dreißig')-0.2,Wd(16,'Dreißig'),Wd(16,'Hundertstel')-0.3,Wd(16,'also'),Wd(16,'drei',3)],1330,330,['p:','30 %','=',F(30,100),'=','0,3'],70,C.org,{cols:[C.ink,C.org,C.ink,C.org,C.ink,C.org]});
 const w1=write(s,[Wd(17,'achtzig'),Wd(17,'mal'),Wd(17,'null'),Wd(17,'gleich'),Wd(17,'vierundzwanzig')],260,540,['W =','80','·','0,3','=','24 €'],96,C.ink,{cols:[C.green,C.blue,C.ink,C.org,C.ink,C.green]});
 note(s,Wd(17,'Rabatt')-0.2,xAfter(w1,30),540,'← Rabatt',58,C.green);
 const w2=write(s,[Wd(18,'achtzig'),Wd(18,'minus'),Wd(18,'vierundzwanzig'),Wd(18,'Sechsundfünfzig')-0.4,Wd(18,'Sechsundfünfzig')],260,690,['zahlen:','80','−','24','=','56 €'],96,C.ink,{cols:[C.ink,C.ink,C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(18,'Euro')-0.1,tokRect(w2,5,5,12));
 note(s,Wd(19,'schneller')-0.2,1150,640,'⚡ schneller:  100 % − 30 % = 70 %',54,C.blue);
 write(s,[Wd(19,'Achtzig'),Wd(19,'mal'),Wd(19,'null'),Wd(19,'gleich'),Wd(19,'sechsundfünfzig')],1150,750,['80','·','0,7','=','56 €'],86,C.blue,{cols:[C.blue,C.ink,C.org,C.ink,C.green]});
 note(s,Wd(20,'Aufschlag')-0.2,260,860,'Aufschlag:  +19 % MwSt  →  · 1,19',56,C.red);
 note(s,Wd(20,'hundert')-0.2,1000,860,'100 € · 1,19 = 119 €',56,C.red);
}
// ---------- S4 Kap 4 ----------
camTo(E(21,-0.7),4);
{const s=4;headingE(s,E(21,0.2),4,'Die Formel umstellen');
 note(s,Wd(22,'umstellen')-0.3,230,290,'gleiche Formel – nur umgestellt (wie bei Gleichungen ⚖️)',54,C.ink);
 note(s,Wd(23,'achtundvierzig')-0.3,230,390,'🚲  48 Schüler, 12 mit dem Rad  →  wie viel %?',56,C.ink);
 const wp=write(s,[Wd(24,'Prozentsatz')-0.2,Wd(24,'Prozentwert'),Wd(24,'Zwölf'),Wd(24,'gleich'),Wd(24,'null'),Wd(24,'fünfundzwanzig')-0.3,Wd(24,'fünfundzwanzig')],260,500,['p =','W : G','=','12 : 48','=','0,25','= 25 %'],80,C.ink,{cols:[C.org,C.ink,C.ink,C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(24,'Prozent',3)+0.3,tokRect(wp,6,6,12));
 note(s,Wd(25,'fünfzehn')-0.3,230,620,'💶  15 € gespart = 20 %  →  wie viel kostet das Ganze?',56,C.ink);
 const wg=write(s,[Wd(26,'Grundwert')-0.2,Wd(26,'Prozentwert'),Wd(26,'Fünfzehn'),Wd(26,'gleich'),Wd(26,'fünfundsiebzig')],260,730,['G =','W : p','=','15 : 0,2','= 75 €'],80,C.ink,{cols:[C.blue,C.ink,C.ink,C.ink,C.green]});
 boxE(s,Wd(26,'Euro')+0.1,tokRect(wg,4,4,12));
 note(s,Wd(27,'Probe'),1120,730,'Probe:  75 · 0,2 = 15 ✓',54,C.green);
 // triangle
 camTo(E(28,-0.5),4,480);
 const TX=1000,TY=990,TW=520,TH=380;
 custom(s,Wd(28,'Dreieck')-0.3,t=>{const k=eo(prog(t,Wd(28,'Dreieck')-0.3,0.7));if(k<=0)return;
   hline(TX,TY,TX-TW/2,TY+TH,C.ink,4,k);hline(TX-TW/2,TY+TH,TX+TW/2,TY+TH,C.ink,4,k);hline(TX+TW/2,TY+TH,TX,TY,C.ink,4,k);hline(TX-TW*0.33,TY+TH*0.55,TX+TW*0.33,TY+TH*0.55,C.ink,3.5,k);hline(TX,TY+TH*0.55,TX,TY+TH,C.ink,3.5,k);
   ctx.save();ctx.globalAlpha=k;ctx.font=HF(96);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=C.green;ctx.fillText('W',TX,TY+TH*0.32);ctx.fillStyle=C.blue;ctx.fillText('G',TX-TW*0.2,TY+TH*0.8);ctx.fillStyle=C.org;ctx.fillText('p',TX+TW*0.2,TY+TH*0.8);ctx.restore();
   // covering phases
   const t0=Wd(28,'Was')-0.1,ph=[[t0,'W',TX,TY+TH*0.32,'W = G · p'],[t0+1.6,'G',TX-TW*0.2,TY+TH*0.8,'G = W : p'],[t0+3.2,'p',TX+TW*0.2,TY+TH*0.8,'p = W : G']];
   ph.forEach(([ts,lab,cx,cy,res],i)=>{const a=prog(t,ts,0.25)*(i<2?1-prog(t,ts+1.5,0.2):1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(29,59,110,0.85)';ctx.beginPath();ctx.arc(cx,cy,62,0,7);ctx.fill();ctx.font=HF(40);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('✋',cx,cy+4);
     ctx.font=HF(80);ctx.fillStyle=C.red;ctx.textAlign='left';ctx.fillText(res,TX+TW/2+80,TY+TH*0.55);ctx.restore()})});
 note(s,Wd(28,'Oben')-0.2,230,1060,'oben: W',56,C.green);note(s,Wd(28,'unten')-0.2,230,1140,'unten: G und p',56,C.ink);
 note(s,Wd(28,'zu')-0.1,230,1240,'gesucht = zuhalten',56,C.red);
}
// ---------- S5 Kap 5 ----------
camTo(E(29,-0.7),5);
{const s=5;headingE(s,E(29,0.2),5,'Kopfrechen-Tricks');
 const row=(t0,y,a,b,col)=>{note(s,t0,230,y,a,64,col||C.ink);note(s,t0+0.6,780,y,b,64,C.green)};
 row(Wd(30,'Zehn'),320,'10 %  →  : 10','80  →  8',C.blue);
 row(Wd(31,'Fünfzig'),440,'50 %  →  Hälfte','80  →  40',C.org);
 row(Wd(31,'Fünfundzwanzig'),560,'25 %  →  Viertel','80  →  20',C.org);
 note(s,Wd(32,'Fünfzehn'),230,690,'15 %  =  10 %  +  5 %',64,C.red);note(s,Wd(32,'acht')-0.2,780,690,'8  +  4  =  12',64,C.green);
 row(Wd(33,'Prozent'),810,'1 %  →  : 100','80  →  0,8',C.blue);
 custom(s,Wd(32,'zusammen'),t=>{const k=eo(prog(t,Wd(32,'zusammen'),0.6));if(k>0)hrect(210,640,1000,100,C.red,3,k)});
}
// ---------- S6 Kap 6 ----------
camTo(E(34,-0.7),6);
{const s=6;headingE(s,E(34,0.2),6,'Der Trick, der fast alle reinlegt');
 note(s,Wd(35,'steigt')-0.2,230,290,'+10 %,  dann  −10 %   →   wieder gleich?',62,C.ink);
 const BASE=900,K=3.6;const bars=[[400,100,C.blue,Wd(36,'hundert'),'100 €'],[760,110,C.green,Wd(36,'hundertzehn'),'110 €'],[1120,99,C.red,Wd(37,'neunundneunzig')-0.2,'99 €']];
 bars.forEach(([x,v,col,t0,lab])=>custom(s,t0-0.3,t=>{const k=eo(prog(t,t0-0.3,0.7));if(k<=0)return;const h=v*K*k;ctx.save();ctx.fillStyle=col+'55';ctx.fillRect(x-70,BASE-h,140,h);ctx.restore();hrect(x-70,BASE-h,140,h,col,3.5);
   ctx.save();ctx.globalAlpha=k;ctx.font=HF(60);ctx.fillStyle=col;ctx.textAlign='center';ctx.fillText(lab,x,BASE-h-30);ctx.restore()}));
 arrow(s,Wd(36,'Plus')-0.2,480,BASE-380,680,BASE-420,C.green,40,'+10 %',48);
 arrow(s,Wd(37,'minus')-0.2,840,BASE-420,1040,BASE-380,C.red,40,'−10 %',48);
 note(s,Wd(37,'elf')-0.4,1240,450,'10 % von 110 = 11',54,C.red);
 note(s,Wd(37,'neunundneunzig')-0.1,1240,520,'110 − 11 = 99',54,C.red);
 custom(s,Wd(38,'Grundwert')-0.4,t=>{const k=eo(prog(t,Wd(38,'Grundwert')-0.4,0.6));if(k>0)hrect(1220,580,620,170,C.red,3.5,k)});
 note(s,Wd(38,'Grundwert')-0.2,1250,630,'neuer Grundwert!',58,C.red);note(s,Wd(38,'wovon')-0.6,1250,700,'→ Prozent WOVON?',58,C.red);
 note(s,Wd(39,'umgekehrt')-0.2,1240,820,'umgekehrt:  100 → 90 → 99',52,C.ink);
}
// ---------- S7 Kap 7 ----------
camTo(E(40,-0.7),7);
{const s=7;headingE(s,E(40,0.2),7,'Die 3 häufigsten Fehler');
 const SZ=76;
 const row=(y,num,tNum,wrongT,wrongToks,crossT,crossIdx,rightT,rightToks,checkT,noteT,noteS)=>{
   note(s,tNum,170,y,num,64,C.red);
   const wW=write(s,wrongT,290,y,wrongToks,SZ,C.ink,{per:0.16});const L=wW.L[crossIdx];cross(s,crossT,wW.ax+L.x+L.w/2,y,34);
   const x2=290+totalW(wrongToks,SZ)+70;write(s,rightT,x2,y,rightToks,SZ,C.green,{per:0.2});const x3=x2+totalW(rightToks,SZ)+45;check(s,checkT,x3,y,30);
   if(noteS)note(s,noteT,x3+60,y,noteS,46,C.green)};
 row(330,'#1',E(41,0),[Wd(41,'Achtzig')],['80','·','30','=','2400 €'],Wd(41,'nicht')+0.3,4,[Wd(41,'Dreißig',2)],['→','80','·','0,3','=','24 €'],Wd(41,'Komma')+0.7,Wd(41,'Dreißig',2),'30 % = 0,3');
 row(560,'#2',E(42,0),[Wd(42,'Vierundzwanzig')],['Preis','=','24 €'],Wd(42,'Rabatt',2)+0.2,2,[Wd(42,'Zahlen')],['→','80','−','24','=','56 €'],Wd(42,'sechsundfünfzig')+0.3,Wd(42,'Zahlen'),'24 € ist nur der Rabatt');
 row(790,'#3',E(43,0),[Wd(43,'Fünfzehn')],['15','·','0,2','=','3 €'],Wd(43,'kann')+0.2,4,[Wd(43,'Richtig')],['→','15',':','0,2','=','75 €'],Wd(43,'zwei',2)+0.4,Wd(43,'Richtig'),'Grundwert → teilen');
}
// ---------- S8 Übung ----------
camTo(E(44,-0.7),8);
{const s=8;headingE(s,E(44,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(44,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(45,'Aufgabe',1),'a)','15 % von 60  ='],[Wd(45,'Aufgabe',2),'b)','18 von 72  =  ? %'],[Wd(45,'Aufgabe',3),'c)','30 % = 45 €   G = ?']];
 T.forEach(([t0,lab,str],i)=>{const y=330+i*200;note(s,t0,200,y,lab,70,C.red);note(s,t0+0.6,310,y,str,76,C.ink)});
 const T0=LE(45)+0.3,T1=E(46,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1600,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(46,'sechs'),'6 + 3 = 9',Wd(46,'neun')],[Wd(47,'achtzehn'),'18 : 72 = 0,25 = 25 %',Wd(47,'fünfundzwanzig')],[Wd(48,'fünfundvierzig'),'45 : 0,3 = 150 €',Wd(48,'hundertfünfzig')]];
 const XS=[820,880,1010];SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200;note(s,t0,XS[i],y,str,76,C.green);check(s,tc+0.3,XS[i]+tw(str,76)+50,y,30)});
 note(s,Wd(49,'Kommentare')-0.6,200,900,'Alles richtig?  →  schreib’s in die Kommentare 💬',60,C.blue);
}
// ---------- S9 Summary ----------
camTo(E(50,-0.7),9);
{const s=9;headingE(s,E(50,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(50,'Prozent',1),'• Prozent = „von hundert“',C.ink],[Wd(50,'Prozentwert'),'• W = G · p',C.green],[Wd(50,'Kommazahl')-0.4,'• p als Kommazahl:  30 % = 0,3',C.org],[Wd(50,'anderes'),'• etwas anderes gesucht  →  umstellen',C.blue]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,62,col));
 camTo(E(51,-0.4),9,180);
 custom(s,E(51,0),t=>{const k=eo(prog(t,E(51,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(51,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(51,'minus')-0.3,270,1020,'(−) · (−) = (+)  …  warum?',64,C.blue);
 custom(s,Wd(51,'Abonnier')-0.2,t=>{const k=prog(t,Wd(51,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(51,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
