// ===================== CONTENT: Potenzen =====================
const SECH=[1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
const CHAPS=[[2,1,'Was ist eine Potenz?'],[7,2,'Die häufigste Verwechslung'],[11,3,'Die Treppe nach unten'],[17,4,'Die Potenzgesetze'],[24,5,'Potenz von einer Potenz'],[29,6,'Negative Exponenten'],[33,7,'Und 0 hoch 0?'],[35,8,'Die 3 häufigsten Fehler']];
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Potenzen: Warum ist 5^0 = 1?',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Potenzen: Warum ist 5^0 = 1?',86),198,C.red,4,k)});
 write(s,[0.4,Wd(0,'eins')-0.2],W/2-150,470,['5^0','= 1'],200,C.ink,{align:'c',cols:[C.ink,C.green]});
 note(s,Wd(0,'Nicht')-0.2,1350,430,'nicht 0!',90,C.red);
 note(s,Wd(0,'hundert')-0.2,W/2-150,680,'100^0 = 1',110,C.blue,{align:'c'});
 note(s,Wd(1,'falsch')-0.4,300,850,'klingt falsch?!',62,C.red);
 note(s,Wd(1,'Potenzregeln')-0.6,1000,850,'+ alle Potenzregeln für die Arbeit',58,C.green);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Was ist eine Potenz?');
 const w=write(s,[Wd(3,'Zwei hoch')-0.1,Wd(3,'Also')+0.1,Wd(3,'zweiunddreißig')-0.2],300,380,['2^5','=  2 · 2 · 2 · 2 · 2','=  32'],110,C.ink,{cols:[C.ink,C.blue,C.green]});
 const tb=Wd(4,'Basis')-0.2,te=Wd(4,'Exponent')-0.2;
 arrow(s,tb,240,560,310,430,C.blue,0,'');note(s,tb+0.2,150,600,'Basis',56,C.blue);
 arrow(s,te,480,230,395,300,C.red,0,'');note(s,te+0.2,490,225,'Exponent = wie oft',52,C.red);
 note(s,Wd(5,'Abkürzung')-0.3,300,640,'10 · 10 · 10  =  10^3  =  1000',80,C.ink);
 note(s,Wd(6,'Sieben')-0.2,300,790,'7^1 = 7',80,C.pur);note(s,Wd(6,'nichts')-0.4,660,790,'(hoch 1 ändert nichts)',52,'#7A869A');
}
// ---------- S2 Kap 2 ----------
camTo(E(7,-0.7),2);
{const s=2;headingE(s,E(7,0.2),2,'Die häufigste Verwechslung');
 note(s,Wd(8,'nicht')-0.4,300,320,'2^3  ≠  2 · 3',110,C.red);
 note(s,Wd(8,'sechs')-0.4,300,470,'2 · 3 = 6',76,C.ink);
 note(s,Wd(8,'Aber')-0.1,300,580,'2^3 = 2 · 2 · 2 = 8',76,C.green);check(s,Wd(8,'acht')+0.2,300+tw('2^3 = 2 · 2 · 2 = 8',76)+40,580,28);
 note(s,Wd(9,'hundert')-0.4,300,710,'10 · 10 = 100',66,C.ink);note(s,Wd(9,'Milliarden')-0.8,300,800,'10^{10} = 10 000 000 000',66,C.red);
 // doubling bars
 const t0=Wd(10,'Gerücht')-0.3;note(s,t0,1080,300,'🗣️ Gerücht: jeden Tag × 2',52,C.ink);
 for(let i=1;i<=10;i++){const ti=Wd(10,'zehn')-1.2+i*0.18;const h=Math.pow(2,i)/1024*400;custom(s,ti,t=>{const k=eo(prog(t,ti,0.35));if(k<=0)return;const x=1090+(i-1)*70,y=820;ctx.save();ctx.fillStyle=i==10?'rgba(214,58,58,0.6)':'rgba(77,163,255,0.5)';ctx.fillRect(x,y-h*k,50,h*k);ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.strokeRect(x,y-h*k,50,h*k);ctx.font=HF(26);ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(String(i),x+25,y+30);ctx.restore()});WRITES.push([ti,0.15])}
 note(s,Wd(10,'tausend')-0.3,1080,380,'Tag 10:  2^{10} = 1024 Leute',52,C.red);
}
// ---------- S3 Kap 3 ----------
camTo(E(11,-0.7),3);
{const s=3;headingE(s,E(11,0.2),3,'Die Treppe nach unten');
 const ST=[['2^4','16',Wd(12,'Zwei hoch vier')],['2^3','8',Wd(12,'Zwei hoch drei')],['2^2','4',Wd(12,'Zwei hoch zwei')],['2^1','2',Wd(12,'Zwei hoch eins')],['2^0','1',Wd(14,'zwei hoch null')-0.2],['2^{−1}','1/2',Wd(16,'minus eins')-0.3],['2^{−2}','1/4',Wd(16,'Viertel')-0.6]];
 ST.forEach(([a,b,t0],i)=>{const x=190+i*235,y=310+i*84;const col=i==4?C.green:i>4?C.blue:C.ink;WRITES.push([t0,0.3]);custom(s,t0-0.1,t=>{const k=eo(prog(t,t0-0.1,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k;hline(x,y+38,x+220,y+38,C.ink,3,1,i);if(i<6)hline(x+220,y+38,x+220,y+122,C.ink,3,1,i+9);ctx.restore()});
   note(s,t0,x+10,y,a+' = '+b,62,col);
   if(i<6){const ti=i<3?Wd(13,'geteilt')-0.3+i*0.35:ST[i+1][2]-0.4;note(s,ti,x+150,y+92,': 2',40,C.red)}});
 boxE(s,Wd(14,'gleich eins')+0.2,[190+4*235-8,310+4*84-50,240,90],C.green,5);
 note(s,Wd(15,'fünf hoch eins')-0.3,1150,330,'5^1 = 5',66,C.pur);note(s,Wd(15,'fünf hoch null')-0.6,1150,420,'5^0 = 5 : 5 = 1',66,C.green);
}
// ---------- S4 Kap 4 ----------
camTo(E(17,-0.7),4);
{const s=4;headingE(s,E(17,0.2),4,'Die Potenzgesetze');
 write(s,[Wd(18,'Zwei hoch drei mal')-0.2,Wd(18,'drei Zweien')-0.3,Wd(18,'Also zwei hoch fünf')],230,310,['2^3 · 2^2','=  (2·2·2) · (2·2)','=  2^5'],78,C.ink,{cols:[C.ink,C.blue,C.green]});
 const r1=note(s,Wd(19,'addiert')-0.6,230,430,'a^m · a^n = a^{m+n}',70,C.green);boxE(s,Wd(19,'addiert')+0.3,[210,385,tw('a^m · a^n = a^{m+n}',70)+40,90],C.green,4);note(s,Wd(19,'Nicht')-0.2,760,430,'(addieren, nicht mal!)',50,C.red);
 const fr=F('2·2·2·2·2','2·2·2');fr.cn=C.ink;fr.cd=C.ink;
 const w2=write(s,[Wd(20,'Zwei hoch fünf geteilt')-0.2,Wd(20,'Zwei hoch fünf geteilt')+0.6,Wd(20,'kürzen')-0.2,Wd(20,'Also zwei hoch zwei')],230,600,['2^5 : 2^3','=',fr,'=  2^2'],74,C.ink,{cols:[C.ink,C.ink,C.ink,C.green]});
 custom(s,Wd(20,'kürzen'),t=>{const k=eo(prog(t,Wd(20,'kürzen'),0.6));if(k<=0)return;const r=tokRect(w2,2,2,0);const x0=r[0]+8,ww=r[2]-16;ctx.save();ctx.globalAlpha=k;ctx.strokeStyle=C.red;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,r[1]+r[3]*0.38);ctx.lineTo(x0+ww*0.62*k,r[1]+r[3]*0.12);ctx.stroke();ctx.beginPath();ctx.moveTo(x0+ww*0.15,r[1]+r[3]*0.92);ctx.lineTo(x0+ww*0.15+ww*0.7*k,r[1]+r[3]*0.66);ctx.stroke();ctx.restore()});
 note(s,Wd(21,'subtrahiert')-0.6,1180,600,'a^m : a^n = a^{m−n}',64,C.blue);
 const w3=write(s,[Wd(21,'aufgepasst')+0.2,Wd(21,'natürlich')-0.3,Wd(21,'minus drei')-0.3,Wd(21,'also zwei hoch null')-0.2],230,790,['2^3 : 2^3','= 1','= 2^{3−3}','= 2^0'],76,C.ink,{cols:[C.ink,C.green,C.blue,C.green]});
 boxE(s,Wd(21,'Wieder')-0.1,tokRect(w3,3,3,14),C.green,5);note(s,Wd(21,'Beweis')-0.3,1180,790,'→ Beweis Nr. 2 ✓',58,C.green);
 note(s,Wd(22,'Merk')-0.2,1180,330,'hoch 0 = 1,  weil  a : a = 1',58,C.red);
}
// ---------- S5 CTA ----------
camTo(E(23,-0.7),5);
{const s=5;
 note(s,E(23,0.0),W/2,230,'Kurze Pause! ✋',110,C.red,{align:'c'});
 const btn=(t0,x,y,w,col,txt,ts)=>{custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-w/2,-70,w,140,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(ts||76);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)};
 btn(Wd(23,'Like')-0.2,620,470,420,'#1D6FE0','👍 Like',80);
 btn(Wd(23,'abonnier')-0.2,1300,470,520,'#E8344E','🔔 Abonnieren',76);
 note(s,Wd(23,'Woche')-0.4,W/2,660,'Jede Woche neue Mathe-Themen – einfach erklärt',62,C.ink,{align:'c'});
 note(s,Wd(23,'Tipps')-0.4,W/2,750,'+ Tipps für deine nächste Klassenarbeit ✏️',58,C.green,{align:'c'});
 note(s,Wd(23,'verwechseln')-0.6,W/2,860,'Weiter geht’s  →',60,C.blue,{align:'c'});
}
// ---------- S6 Kap 5 ----------
camTo(E(24,-0.7),6);
{const s=6;headingE(s,E(24,0.2),5,'Potenz von einer Potenz');
 write(s,[Wd(25,'Zwei hoch drei')-0.1,Wd(25,'heißt')+0.2,Wd(25,'sechs')-0.3],230,320,['(2^3)^2','=  2^3 · 2^3','=  2^6'],90,C.ink,{cols:[C.ink,C.blue,C.green]});
 note(s,Wd(26,'malgenommen')-0.5,230,450,'(a^m)^n = a^{m·n}',74,C.pur);boxE(s,Wd(26,'sechs')+0.2,[210,405,tw('(a^m)^n = a^{m·n}',74)+40,92],C.pur,4);
 note(s,Wd(26,'vierundsechzig')-0.4,900,450,'2^6 = 64',74,C.green);
 note(s,Wd(27,'nebeneinander')-0.5,230,610,'a^m · a^n   →   Exponenten  +',62,C.green);
 note(s,Wd(27,'hoch eine Zahl')-0.5,230,700,'(a^m)^n   →   Exponenten  ·',62,C.pur);
 note(s,Wd(28,'Drei hoch zwei')-0.3,230,830,'(3^2)^2 = 3^4 = 81',70,C.blue);check(s,Wd(28,'einundachtzig')+0.2,230+tw('(3^2)^2 = 3^4 = 81',70)+40,830,26);
}
// ---------- S7 Kap 6 ----------
camTo(E(29,-0.7),7);
{const s=7;headingE(s,E(29,0.2),6,'Negative Exponenten');
 note(s,Wd(30,'nicht negativ')-0.6,230,300,'negativer Exponent  ≠  negative Zahl!',62,C.red);
 const f1=F('1','10^3'),f2=F('1','1000');
 write(s,[Wd(30,'Zehn hoch minus')-0.1,Wd(30,'eins durch zehn')-0.2,Wd(30,'tausend')-0.3,Wd(31,'null Komma')-0.2],230,450,['10^{−3}','=',f1,'=',f2,'=  0,001'],84,C.ink,{cols:[C.blue,C.ink,C.ink,C.ink,C.ink,C.green]});
 note(s,Wd(30,'eins geteilt')-0.4,1250,450,'a^{−n} = 1 : a^n',66,C.pur);
 note(s,Wd(31,'Bakterium')-0.3,230,640,'🦠  Bakterium  ≈  10^{−6} m  =  0,000001 m',58,C.ink);
 note(s,Wd(32,'Erde')-0.3,230,750,'☀️  Erde – Sonne  ≈  1,5 · 10^{11} m',58,C.org);
 note(s,Wd(32,'Milliarden')-0.4,230,840,'(statt 150 000 000 000 m)',48,'#7A869A');
}
// ---------- S8 Kap 7 ----------
camTo(E(33,-0.7),8);
{const s=8;headingE(s,E(33,0.2),7,'Und 0 hoch 0?');
 note(s,E(33,0.6),W/2,400,'0^0 = ?',180,C.ink,{align:'c'});
 note(s,Wd(34,'auf eins')-0.6,460,640,'oft: = 1 (praktisch)',62,C.green,{align:'c'});
 note(s,Wd(34,'nicht definiert')-0.4,1460,640,'manche: nicht definiert',62,C.red,{align:'c'});
 note(s,Wd(34,'Schule')-0.3,W/2,800,'in der Schule fast nie gefragt 😌',62,C.blue,{align:'c'});
}
// ---------- S9 Kap 8 ----------
camTo(E(35,-0.7),9);
{const s=9;headingE(s,E(35,0.2),8,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,68,C.ink);const wx=290+tw(wrongS,68);cross(s,crossT,wx+52,y,28);
   const x2=wx+115;note(s,rightT,x2,y,rightS,68,C.green);check(s,checkT,x2+tw(rightS,68)+45,y,26)};
 row(330,'#1',E(36,0),Wd(36,'Basis')-0.2,'2^3 = 6',Wd(36,'Exponent')+0.2,Wd(36,'acht')-0.6,'→  2^3 = 8',Wd(36,'sechs')+0.2);
 row(560,'#2',E(37,0),Wd(37,'malnehmen')-0.4,'2^3 · 2^2 = 2^6',Wd(37,'malnehmen')+0.3,Wd(37,'zwei hoch fünf')-0.6,'→  = 2^5',Wd(37,'sechs')+0.2);
 row(790,'#3',E(38,0),Wd(38,'negativ')-0.6,'2^{−1} = −2',Wd(38,'negativ',2)+0.2,Wd(38,'ein halb')-0.6,'→  2^{−1} = 1/2',Wd(38,'minus zwei')+0.2);
}
// ---------- S10 Übung ----------
camTo(E(39,-0.7),10);
{const s=10;headingE(s,E(39,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(39,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(40,'Aufgabe',1),'a)','3^0 + 3^1  =  ?'],[Wd(40,'Aufgabe',2),'b)','2^4 · 2^3  =  ?'],[Wd(40,'Aufgabe',3),'c)','10^{−2}  =  ?  (als Kommazahl)']];
 T.forEach(([t0,lb,str],i)=>{const y=330+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,72,C.ink)});
 const T0=LE(40)+0.3,T1=E(41,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(41,'Drei hoch null')-0.2,'= 1 + 3 = 4',Wd(41,'vier')],[Wd(42,'Exponenten')-0.2,'= 2^7 = 128',Wd(42,'hundertachtundzwanzig')],[Wd(43,'eins durch')-0.2,'= 1/100 = 0,01',Wd(43,'null eins')]];
 SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200+80;note(s,t0,310,y,str,62,C.green);check(s,tc+0.3,310+tw(str,62)+40,y,26)});
 note(s,Wd(44,'Kommentare')-0.6,200,885,'Alles richtig?  →  schreib’s in die Kommentare 💬',56,C.blue);
}
// ---------- S11 Summary ----------
camTo(E(45,-0.7),11);
{const s=11;headingE(s,E(45,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(45,'wiederholtes')-0.6,'• Potenz = wiederholtes Malnehmen',C.ink],[Wd(45,'Treppe')-0.6,'• a^0 = 1  (die Treppe!)',C.green],[Wd(45,'addieren')-0.8,'• a^m · a^n = a^{m+n},   a^m : a^n = a^{m−n},   (a^m)^n = a^{m·n}',C.blue],[Wd(45,'eins durch')-0.6,'• a^{−n} = 1 : a^n',C.red]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,58,col));
 camTo(E(46,-0.4),11,180);
 custom(s,E(46,0),t=>{const k=eo(prog(t,E(46,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(46,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(46,'Pythagoras')-0.6,270,1020,'a^2 + b^2 = c^2  …  warum?',64,C.blue);
 custom(s,Wd(46,'Abonnier')-0.2,t=>{const k=prog(t,Wd(46,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(46,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
