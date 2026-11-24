// ===================== CONTENT: Minus mal Minus =====================
const SECH=[1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
const CHAPS=[[2,1,'Was bedeutet mal?'],[7,2,'Plus mal Minus'],[13,3,'Erklärung 1: Das Muster'],[19,4,'Erklärung 2: Die Drehung'],[25,5,'Erklärung 3: Die Schulden'],[31,6,'Der Beweis für Profis'],[35,7,'Die Vorzeichenregeln'],[39,8,'Die 3 häufigsten Fehler']];
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
// ---- number line helpers
function numline(s,t0,o){WRITES.push([t0,0.7]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.7));if(k<=0)return;const{cx,y,u,mn,mx}=o;const X0=cx+mn*u-30,X1=cx+mx*u+30;hline(X0,y,X0+(X1-X0)*k,y,C.ink,3.5);
  if(k<1)return;hline(X1,y,X1-16,y-9,C.ink,3.5);hline(X1,y,X1-16,y+9,C.ink,3.5);ctx.save();ctx.font=HF(34);ctx.textAlign='center';ctx.textBaseline='top';
  for(let v=mn;v<=mx;v++){const x=cx+v*u;hline(x,y-10,x,y+10,C.ink,v?2.5:4);ctx.fillStyle=v<0?C.red:v>0?C.blue:C.ink;ctx.fillText(String(v).replace('-','−'),x,y+18)}ctx.restore()})}
function jumps(s,t0,o,start,step,n,col,per){per=per||0.55;for(let i=0;i<n;i++){const ti=t0+i*per,a=start+i*step,b=a+step;WRITES.push([ti,0.35]);custom(s,ti,t=>{const k=eo(prog(t,ti,0.45));if(k<=0)return;const x1=o.cx+a*o.u,x2=o.cx+b*o.u,mx=(x1+x2)/2,h=Math.abs(x2-x1)*0.55;
  ctx.save();ctx.strokeStyle=col;ctx.lineWidth=4.5;ctx.lineCap='round';ctx.beginPath();const N=24;let px,py,qx,qy;for(let j=0;j<=Math.round(N*k);j++){const f=j/N;const x=(1-f)*(1-f)*x1+2*(1-f)*f*mx+f*f*x2,y=(1-f)*(1-f)*o.y+2*(1-f)*f*(o.y-h*2)+f*f*o.y;qx=px;qy=py;px=x;py=y;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  if(k>0.95&&qx!=null){const an=Math.atan2(py-qy,px-qx);hline(px,py,px-18*Math.cos(an-0.45),py-18*Math.sin(an-0.45),col,4);hline(px,py,px-18*Math.cos(an+0.45),py-18*Math.sin(an+0.45),col,4)}
  ctx.font=HF(38);ctx.fillStyle=col;ctx.textAlign='center';ctx.globalAlpha=prog(t,ti+0.2,0.25);ctx.fillText((step>0?'+':'−')+Math.abs(step),mx,o.y-h-16);ctx.restore()})}}
function ndot(s,t0,o,v,col,lab_){WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.35));if(k<=0)return;ctx.save();ctx.fillStyle=col;ctx.beginPath();ctx.arc(o.cx+v*o.u,o.y,13*backK(k),0,7);ctx.fill();if(lab_){ctx.globalAlpha=k;ctx.font=HF(46);ctx.textAlign='center';ctx.fillText(lab_,o.cx+v*o.u,o.y+86)}ctx.restore()})}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Minus mal Minus = Plus',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Minus mal Minus = Plus',86),198,C.red,4,k)});
 write(s,[Wd(0,'Minus',1)-0.1,Wd(0,'mal')-0.1,Wd(0,'Minus',2)-0.1,Wd(0,'ergibt')-0.1,Wd(0,'Plus')-0.1],W/2,450,['(−)','·','(−)','=','(+)'],170,C.ink,{align:'c',cols:[C.red,C.ink,C.red,C.ink,C.green]});
 note(s,Wd(0,'auswendig')-0.4,300,660,'auswendig gelernt …',64,C.ink);
 note(s,Wd(0,'warum')-0.3,1250,660,'… aber WARUM?',80,C.red);
 note(s,Wd(1,'halt')-0.5,300,780,'„Ist halt so.“',62,C.ink);cross(s,Wd(1,'halt')+0.2,300+tw('„Ist halt so.“',62)+40,780,26);
 note(s,Wd(1,'drei')-0.3,1000,780,'3 Erklärungen  +  1 Beweis',62,C.green);check(s,Wd(1,'beweisen')+0.2,1000+tw('3 Erklärungen  +  1 Beweis',62)+40,780,26);
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Was bedeutet mal?');
 const NLo={cx:960,y:620,u:100,mn:-7,mx:7};
 write(s,[Wd(3,'Drei'),Wd(3,'mal'),Wd(3,'zwei'),Wd(3,'Also')+0.2,Wd(3,'sechs')-0.2],230,320,['3 · 2','=','2 + 2 + 2','=','6'],80,C.ink,{cols:[C.ink,C.ink,C.blue,C.ink,C.green]});
 numline(s,Wd(4,'Zahlenstrahl')-0.4,NLo);jumps(s,Wd(4,'Sprünge')-0.1,NLo,0,2,3,C.blue,0.6);ndot(s,Wd(4,'landen')+0.1,NLo,6,C.green);
 const t5=Wd(5,'wiederholtes')-0.5;note(s,t5,230,800,'mal  =  wiederholtes Addieren',66,C.ink);boxE(s,LE(5)-0.4,[210,755,tw('mal  =  wiederholtes Addieren',66)+40,92],C.green,4);
 note(s,Wd(6,'null')-0.4,1150,320,'3 · 0 = 0 + 0 + 0 = 0',66,C.pur);
}
// ---------- S2 Kap 2 ----------
camTo(E(7,-0.7),2);
{const s=2;headingE(s,E(7,0.2),2,'Plus mal Minus');
 const NLo={cx:960,y:600,u:100,mn:-7,mx:7};
 write(s,[Wd(8,'Was')-0.1,Wd(8,'Also')+0.1,Wd(8,'gleich')],230,310,['3 · (−2)','=  (−2) + (−2) + (−2)','=  −6'],76,C.ink,{cols:[C.ink,C.red,C.red]});
 numline(s,E(8,0.3),NLo);jumps(s,Wd(9,'links')-0.4,NLo,0,-2,3,C.red,0.6);ndot(s,Wd(9,'landen'),NLo,-6,C.red);
 note(s,Wd(10,'Rechnungen')-0.5,230,770,'💶  3 Rechnungen à  −2 €  =  −6 €',58,C.ink);
 note(s,Wd(11,'umgekehrt')-0.3,230,420,'(−2) · 3  =  3 · (−2)  =  −6',62,C.pur);
 note(s,Wd(12,'minus mal minus')-0.3,1150,770,'(−) · (−)  =  ???',76,C.red);
}
// ---------- S3 Kap 3 ----------
camTo(E(13,-0.7),3);
{const s=3;headingE(s,E(13,0.2),3,'Erklärung 1: Das Muster');
 const R=[['3 · (−2)','−6',Wd(14,'Drei')],['2 · (−2)','−4',Wd(14,'Zwei mal')],['1 · (−2)','−2',Wd(14,'Eins mal')],['0 · (−2)','0',Wd(14,'Null mal')],['(−1) · (−2)','2',Wd(16,'Minus eins')-0.2],['(−2) · (−2)','4',Wd(16,'Und minus')]];
 R.forEach(([a,b,t0],i)=>{const y=300+i*82;const col=i>=4?C.green:C.ink;note(s,t0,620,y,a,62,col,{align:'r'});note(s,t0+0.5,660,y,'=  '+b,62,i>=4?C.green:C.ink)});
 for(let i=0;i<5;i++){const y=300+i*82;const tA=i<3?Wd(15,'kleiner')-0.3+i*0.3:Wd(16,'weiter')+(i-3)*1.2;const tB=i<3?Wd(15,'größer')-0.3+i*0.3:Wd(16,'weiter')+0.4+(i-3)*1.2;
   arrow(s,tA,230,y+18,230,y+64,C.red,0,'');note(s,tA+0.1,250,y+41,'−1',38,C.red);
   arrow(s,tB,880,y+18,880,y+64,C.green,0,'');note(s,tB+0.1,905,y+41,'+2',38,C.green)}
 const R2=['3 · (−5) = −15','2 · (−5) = −10','1 · (−5) = −5','0 · (−5) = 0','(−1) · (−5) = 5'];
 R2.forEach((str,i)=>note(s,Wd(17,'Zahl')+0.3+i*(i<3?1.1:0.9)+(i==4?2.5:0),1180,300+i*82,str,56,i==4?C.green:C.blue));
 note(s,Wd(17,'größer')-0.4,1560,628,'jeweils +5',44,C.blue);
 const w=note(s,Wd(18,'zwingt')-0.2,230,820,'Das Muster erzwingt:  (−) · (−) = (+)',64,C.green);boxE(s,Wd(18,'Plus')+0.2,[210,775,tw('Das Muster erzwingt:  (−) · (−) = (+)',64)+40,92],C.green,4);
}
// ---------- S4 Kap 4 ----------
camTo(E(19,-0.7),4);
{const s=4;headingE(s,E(19,0.2),4,'Erklärung 2: Die Drehung');
 const NLo={cx:760,y:600,u:72,mn:-5,mx:5};
 numline(s,E(20,0),NLo);ndot(s,Wd(20,'drei',1)-0.3,NLo,3,C.blue,'');
 const half=(t0,up,col,lab_)=>{WRITES.push([t0,0.8]);custom(s,t0,t=>{const k=eo(prog(t,t0,1.0));if(k<=0)return;const r=3*NLo.u;ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();if(up)ctx.arc(NLo.cx,NLo.y,r,0,-Math.PI*k,true);else ctx.arc(NLo.cx,NLo.y,r,Math.PI,Math.PI-Math.PI*k,true);ctx.stroke();ctx.setLineDash([]);
   const a=up?-Math.PI*k:Math.PI-Math.PI*k;const px=NLo.cx+Math.cos(a)*r,py=NLo.y+Math.sin(a)*r;ctx.fillStyle=col;ctx.beginPath();ctx.arc(px,py,12,0,7);ctx.fill();ctx.font=HF(44);ctx.textAlign='center';ctx.globalAlpha=prog(t,t0+0.4,0.3);ctx.fillText(lab_,NLo.cx,up?NLo.y-r-24:NLo.y+r+50);ctx.restore()})};
 half(Wd(20,'Dreh')-0.2,true,C.red,'· (−1)');ndot(s,Wd(20,'minus drei')-0.1,NLo,-3,C.red,'');
 note(s,Wd(20,'Richtung')-0.4,1320,330,'· (−1)  =  umdrehen',58,C.red);
 half(Wd(21,'zweimal')-0.2,false,C.green,'· (−1)');
 note(s,Wd(21,'Minus drei')-0.3,1320,430,'(−3) · (−1)  =  3',58,C.green);
 const tL=Wd(22,'links')-0.6,tR=Wd(22,'wieder')-0.4,ta=Wd(22,'Pfeil')-0.3;
 custom(s,ta,t=>{const k=eo(prog(t,ta,0.5));if(k<=0)return;const ang=Math.PI*eio(prog(t,tL,0.8))+Math.PI*eio(prog(t,tR,0.8));const cx=1560,cy=620;ctx.save();ctx.globalAlpha=k;ctx.translate(cx,cy);ctx.rotate(ang);const col=Math.cos(ang)>0?C.green:C.red;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-150,0);ctx.lineTo(110,0);ctx.stroke();ctx.beginPath();ctx.moveTo(160,0);ctx.lineTo(95,-42);ctx.lineTo(95,42);ctx.closePath();ctx.fill();ctx.restore();
   ctx.save();ctx.globalAlpha=k;ctx.font=HF(46);ctx.textAlign='center';ctx.fillStyle=C.ink;const n=(t>tR?2:t>tL?1:0);ctx.fillText(['Start','1× umgedreht','2× umgedreht = wie vorher'][n],cx,cy+100);ctx.restore()});WRITES.push([ta,0.5]);
 note(s,Wd(23,'zweimal')-0.4,230,850,'(−) · (−)  =  2× umdrehen  =  (+)',64,C.green);boxE(s,Wd(23,'Plus')+0.2,[210,805,tw('(−) · (−)  =  2× umdrehen  =  (+)',64)+40,92],C.green,4);
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
 note(s,Wd(24,'Sinn')-0.6,W/2,860,'Weiter geht’s  →',60,C.blue,{align:'c'});
}
// ---------- S6 Kap 5 ----------
camTo(E(25,-0.7),6);
{const s=6;headingE(s,E(25,0.2),5,'Erklärung 3: Die Schulden');
 const tGone=Wd(27,'weg')-0.3;
 for(let i=0;i<5;i++){const t0=Wd(26,'Rechnungen')-0.3+i*0.22;const x=240+i*170,y=300;WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;let dy=0,a=k;if(i>=3){const g=eio(prog(t,tGone+(i-3)*0.3,0.9));dy=-260*g;a*=1-g}if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.translate(x,y+dy);ctx.rotate((i%2?1:-1)*0.04);ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,0.12)';ctx.shadowBlur=10;ctx.fillRect(0,0,140,170);ctx.shadowBlur=0;hrect(0,0,140,170,C.ink,2.5,1);ctx.font='700 22px Inter';ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('RECHNUNG',70,34);for(let j=0;j<3;j++)hline(20,58+j*20,120,58+j*20,'#B8C4D6',2,1,j);ctx.font=HF(52);ctx.fillStyle=C.red;ctx.fillText('−3 €',70,145);ctx.restore()})}
 // account box
 const tA=Wd(26,'fünfzehn')-0.3,tUp=Wd(28,'steigt')-0.3;
 custom(s,tA,t=>{const k=eo(prog(t,tA,0.5));if(k<=0)return;const v=lerp(-15,-9,eio(prog(t,tUp,1.2)));ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(255,255,255,0.9)';ctx.beginPath();ctx.roundRect(1200,270,520,220,24);ctx.fill();hrect(1200,270,520,220,C.ink,3,1);ctx.font='700 26px Inter';ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('KONTOSTAND',1460,318);ctx.font=HF(110);ctx.fillStyle=v<0?C.red:C.green;ctx.fillText((v<0?'−':'')+Math.abs(Math.round(v))+' €',1460,440);ctx.restore()});WRITES.push([tA,0.4]);
 custom(s,tUp,t=>{const k=prog(t,tUp,0.5)*(1-prog(t,tUp+2.5,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.font=HF(64);ctx.fillStyle=C.green;ctx.textAlign='left';ctx.fillText('+6 € ↑',1740,420);ctx.restore()});CK.push(tUp+0.6);
 write(s,[Wd(27,'minus zwei')-0.2,Wd(28,'gleich')-0.1],230,600,['(−2) · (−3 €)','=  +6 €'],80,C.ink,{cols:[C.red,C.green]});
 note(s,Wd(29,'wegnehmen')-0.5,230,710,'Schulden wegnehmen  =  Geld bekommen',62,C.green);
 note(s,Wd(30,'Temperatur')-0.4,230,800,'🌡️  −2 °C pro Stunde,  vor 3 Stunden:',54,C.ink);
 note(s,Wd(30,'Minus drei')-0.2,1100,800,'(−3) · (−2) = +6 °C',58,C.green);
}
// ---------- S7 Kap 6 ----------
camTo(E(31,-0.7),7);
{const s=7;headingE(s,E(31,0.2),6,'Der Beweis für Profis');
 note(s,Wd(32,'drei plus')-0.2,230,320,'3 + (−3)  =  0',72,C.ink);
 note(s,Wd(32,'Klammer')-0.4,230,430,'(−2) · (3 + (−3))  =  0',72,C.ink);note(s,Wd(32,'alles')-0.2,1100,430,'(alles mal 0 ist 0)',48,'#7A869A');
 note(s,Wd(33,'auf')-0.1,230,550,'(−2) · 3  +  (−2) · (−3)  =  0',72,C.blue);
 note(s,Wd(34,'Minus zwei mal drei')-0.2,230,670,'−6  +  (−2) · (−3)  =  0',72,C.ink);marker(s,Wd(34,'minus sechs')-0.1,[222,630,tw('−6',72)+18,80]);
 const w=note(s,Wd(34,'genau')-0.3,230,800,'→  (−2) · (−3)  =  +6',84,C.green);boxE(s,Wd(34,'Bewiesen')-0.1,[205,750,tw('→  (−2) · (−3)  =  +6',84)+50,100],C.green,5);
 note(s,Wd(34,'Bewiesen'),1000,800,'Bewiesen! ✓',72,C.green);
}
// ---------- S8 Kap 7 ----------
camTo(E(35,-0.7),8);
{const s=8;headingE(s,E(35,0.2),7,'Die Vorzeichenregeln');
 const GX=300,GY=290,CS=150;
 custom(s,E(36,-0.2),t=>{const k=eo(prog(t,E(36,-0.2),0.6));if(k<=0)return;ctx.save();ctx.globalAlpha=k;for(let i=0;i<=3;i++){hline(GX,GY+i*CS,GX+3*CS,GY+i*CS,C.ink,i==1?4:2.5,1);hline(GX+i*CS,GY,GX+i*CS,GY+3*CS,C.ink,i==1?4:2.5,1)}ctx.font=HF(90);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=C.ink;ctx.fillText('·',GX+CS/2,GY+CS/2);ctx.fillStyle=C.blue;ctx.fillText('+',GX+CS*1.5,GY+CS/2);ctx.fillText('+',GX+CS/2,GY+CS*1.5);ctx.fillStyle=C.red;ctx.fillText('−',GX+CS*2.5,GY+CS/2);ctx.fillText('−',GX+CS/2,GY+CS*2.5);ctx.restore()});WRITES.push([E(36,-0.2),0.6]);
 const cell=(t0,r,c,sym,col)=>{WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k*0.25;ctx.fillStyle=col;ctx.fillRect(GX+c*CS+4,GY+r*CS+4,CS-8,CS-8);ctx.globalAlpha=k;ctx.font=HF(100);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(sym,GX+c*CS+CS/2,GY+r*CS+CS/2);ctx.restore()})};
 cell(Wd(36,'Plus mal Plus'),1,1,'+',C.green);cell(Wd(36,'Minus mal Minus'),2,2,'+',C.green);cell(Wd(36,'Plus mal Minus'),1,2,'−',C.red);cell(Wd(36,'Minus mal Plus'),2,1,'−',C.red);
 note(s,Wd(37,'Gleiche')-0.2,1000,320,'gleiche Vorzeichen  →  +',62,C.green);
 note(s,Wd(37,'Verschiedene')-0.2,1000,410,'verschiedene  →  −',62,C.red);
 note(s,Wd(37,'Teilen')-0.2,1000,500,'gilt auch beim Teilen ( : )',56,C.ink);
 custom(s,Wd(38,'Profi')-0.3,t=>{const k=eo(prog(t,Wd(38,'Profi')-0.3,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(255,224,70,0.28)';ctx.beginPath();ctx.roundRect(970,590,880,290,22);ctx.fill();hrect(970,590,880,290,C.org,3.5,1);ctx.restore()});
 note(s,Wd(38,'Profi'),1000,640,'💡 Profi-Tipp: Minuszeichen zählen',52,C.org);
 note(s,Wd(38,'gerade')-0.4,1000,720,'gerade Anzahl  →  +',52,C.green);note(s,Wd(38,'ungerade')-0.4,1000,790,'ungerade Anzahl  →  −',52,C.red);
 note(s,Wd(38,'negativ')-0.2,1000,855,'(−1)·(−2)·(−3) = −6',48,C.ink);
}
// ---------- S9 Kap 8 ----------
camTo(E(39,-0.7),9);
{const s=9;headingE(s,E(39,0.2),8,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,64,C.ink);const wx=290+tw(wrongS,64);cross(s,crossT,wx+52,y,28);
   const x2=wx+115;note(s,rightT,x2,y,rightS,64,C.green);check(s,checkT,x2+tw(rightS,64)+45,y,26)};
 row(330,'#1',E(40,0),Wd(40,'hoch')-0.4,'−3² = 9',Wd(40,'Ohne')-0.1,Wd(40,'minus neun')-0.6,'→  −3² = −9,   (−3)² = 9',Wd(40,'plus neun')+0.2);
 row(560,'#2',E(41,0),Wd(41,'Minus drei')-0.3,'−3 − 5 = 8',Wd(41,'nicht')+0.2,Wd(41,'links')-0.4,'→  −3 − 5 = −8',Wd(41,'minus acht')+0.2);
 row(790,'#3',E(42,0),Wd(42,'vergessen')-0.6,'Minus vergessen',Wd(42,'vergessen')+0.2,Wd(42,'zählen')-0.4,'→  erst Minuszeichen zählen',Wd(42,'aufschreiben'));
}
// ---------- S10 Übung ----------
camTo(E(43,-0.7),10);
{const s=10;headingE(s,E(43,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(43,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(44,'Aufgabe',1),'a)','(−4) · (−6)  =  ?'],[Wd(44,'Aufgabe',2),'b)','(−2) · (−3) · (−5)  =  ?'],[Wd(44,'Aufgabe',3),'c)','−5²   und   (−5)²  =  ?']];
 T.forEach(([t0,lb,str],i)=>{const y=330+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,68,C.ink)});
 const T0=LE(44)+0.3,T1=E(45,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(45,'gleiche')-0.2,'= +24   (gleiche Vorzeichen)',Wd(45,'vierundzwanzig')],[Wd(46,'drei')-0.2,'= −30   (3 Minus → ungerade)',Wd(46,'dreißig')],[Wd(47,'Ohne')-0.2,'−25   und   +25',Wd(47,'fünfundzwanzig',2)]];
 SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200+80;note(s,t0,310,y,str,58,C.green);check(s,tc+0.3,310+tw(str,58)+40,y,26)});
 note(s,Wd(48,'Kommentare')-0.6,200,885,'Alles richtig?  →  schreib’s in die Kommentare 💬',56,C.blue);
}
// ---------- S11 Summary ----------
camTo(E(49,-0.7),11);
{const s=11;headingE(s,E(49,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(49,'wiederholtes')-0.6,'• mal = wiederholtes Addieren',C.ink],[Wd(49,'Muster')-0.3,'• Muster, Drehung, Schulden:  (−) · (−) = (+)',C.green],[Wd(49,'Gleiche')-0.3,'• gleiche Vorzeichen → +,  verschiedene → −',C.blue],[Wd(49,'Potenzen')-0.3,'• −3² = −9,  aber  (−3)² = 9',C.red]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,60,col));
 camTo(E(50,-0.4),11,180);
 custom(s,E(50,0),t=>{const k=eo(prog(t,E(50,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(50,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(50,'null')-0.6,270,1020,'5⁰ = 1  …  warum?',64,C.blue);
 custom(s,Wd(50,'Abonnier')-0.2,t=>{const k=prog(t,Wd(50,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(50,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
