// ===================== CONTENT: Quadratische Gleichungen & pq-Formel =====================
const SECH=[1080,1080,1080,1500,1080,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
const CHAPS=[[2,1,'Was ist eine quadratische Gleichung?'],[7,2,'Der einfache Fall'],[12,3,'Das Quadrat ergänzen'],[22,4,'Die pq-Formel'],[28,5,'Wie viele Lösungen?'],[33,6,'Erst in die Normalform'],[37,7,'Die 3 häufigsten Fehler']];
const xAfter=(w,gap)=>w.ax+totalW(w.L.map(l=>l.tk),w.size)+(gap==null?w.size*0.28:gap);
const S_=(s,c)=>({s,c});
// ---- graph helpers
function axes(s,t0,o){const{ox,oy,sc,xr,yr}=o;custom(s,t0,t=>{const k=eo(prog(t,t0,0.7));if(k<=0)return;
  const X0=ox+xr[0]*sc,X1=ox+xr[1]*sc,Y0=oy-yr[0]*sc,Y1=oy-yr[1]*sc;
  hline(X0,oy,X0+(X1-X0)*k,oy,C.ink,3);hline(ox,Y0,ox,Y0+(Y1-Y0)*k,C.ink,3);
  if(k>=1){hline(X1,oy,X1-14,oy-8,C.ink,3);hline(X1,oy,X1-14,oy+8,C.ink,3);hline(ox,Y1,ox-8,Y1+14,C.ink,3);hline(ox,Y1,ox+8,Y1+14,C.ink,3)}
  ctx.save();ctx.globalAlpha=k;ctx.font=HF(26);ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='top';
  for(let x=Math.ceil(xr[0]);x<=Math.floor(xr[1]-0.5);x++){if(!x)continue;hline(ox+x*sc,oy-6,ox+x*sc,oy+6,C.ink,2);if(o.lab||x%2===0)ctx.fillText(String(x).replace('-','−'),ox+x*sc,oy+10)}
  ctx.textAlign='right';ctx.textBaseline='middle';for(let y=Math.ceil(yr[0]);y<=Math.floor(yr[1]-0.5);y++){if(!y)continue;hline(ox-6,oy-y*sc,ox+6,oy-y*sc,C.ink,2);if(y%(o.ystep||2)===0)ctx.fillText(String(y).replace('-','−'),ox-12,oy-y*sc)}
  ctx.font=HF(34);ctx.textAlign='left';ctx.fillText('x',X1-10,oy+30);ctx.fillText('y',ox+14,Y1+6);ctx.restore()})}
function curve(s,t0,o,f,col,dur,lw){custom(s,t0,t=>{const k=eo(prog(t,t0,dur||1.2));if(k<=0)return;const{ox,oy,sc,xr,yr}=o;ctx.save();ctx.beginPath();ctx.rect(ox+xr[0]*sc,oy-yr[1]*sc,(xr[1]-xr[0])*sc,(yr[1]-yr[0])*sc);ctx.clip();
  ctx.strokeStyle=col;ctx.lineWidth=lw||5;ctx.lineCap='round';ctx.beginPath();const n=160;const xe=xr[0]+(xr[1]-xr[0])*k;for(let i=0;i<=n;i++){const x=xr[0]+(xe-xr[0])*i/n;const px=ox+x*sc,py=oy-f(x)*sc;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();ctx.restore()})}
function dot(s,t0,o,x,y,col,label,dx,dy){WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.35));if(k<=0)return;const px=o.ox+x*o.sc,py=o.oy-y*o.sc;ctx.save();ctx.fillStyle=col;ctx.beginPath();ctx.arc(px,py,11*backK(k),0,7);ctx.fill();
  if(label){ctx.globalAlpha=k;ctx.font=HF(40);ctx.textAlign='center';ctx.fillText(label,px+(dx||0),py+(dy==null?-30:dy))}ctx.restore()})}
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
function tile(s,t0,x,y,w,h,fill,label,o){o=o||{};custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;let dx=0,dy=0;if(o.from){dx=(o.from[0])*(1-k);dy=(o.from[1])*(1-k)}
  let a=k;if(o.tOut!=null)a*=1-prog(t,o.tOut,0.3);if(a<=0)return;ctx.save();ctx.globalAlpha=a;if(o.dash){ctx.setLineDash([12,10]);ctx.strokeStyle=C.red;ctx.lineWidth=4;ctx.strokeRect(x+dx,y+dy,w,h)}else{ctx.fillStyle=fill;ctx.fillRect(x+dx,y+dy,w,h);hrect(x+dx,y+dy,w,h,C.ink,3.5)}
  if(label){ctx.font=HF(o.ls||64);ctx.fillStyle=o.lc||C.ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x+dx+w/2,y+dy+h/2)}ctx.restore()})}
const FQ=()=>['x','=','−',F('p',2),'±','√(',F('p',2),'²','−','q',')'];
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.2,170,150,'Quadratische Gleichungen & pq-Formel',86,C.red);custom(s,0.8,t=>{const k=eo(prog(t,0.8,0.6));if(k>0)hline(170,198,170+tw('Quadratische Gleichungen & pq-Formel',86),198,C.red,4,k)});
 write(s,[Wd(0,'Quadrat'),Wd(0,'plus'),Wd(0,'sechs'),Wd(0,'gleich'),Wd(0,'sechzehn')],420,430,['x²','+','6x','=','16'],170,C.ink,{cols:[C.blue,C.ink,C.org,C.ink,C.ink]});
 note(s,Wd(0,'findest'),1380,430,'x = ?',140,C.red);
 note(s,Wd(1,'auswendig')-0.3,230,660,'pq-Formel auswendig lernen …',64,C.ink);strike(s,Wd(1,'vergessen')-0.2,[225,620,tw('pq-Formel auswendig lernen …',64)+10,80]);
 note(s,Wd(1,'herkommt')-0.4,230,790,'heute: WOHER die Formel kommt',66,C.green);
 tile(s,Wd(1,'Quadrat')-0.3,1250,640,180,180,'rgba(77,163,255,0.35)','x²');
}
// ---------- S1 Kap 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingE(s,E(2,0.2),1,'Was ist eine quadratische Gleichung?');
 note(s,Wd(3,'Quadrat')-0.2,230,320,'x²  =  x · x',80,C.blue);
 note(s,Wd(4,'Parabel')-0.2,230,450,'Graph = Parabel (U-Form)',60,C.ink);
 note(s,Wd(5,'Lösungen')-0.1,230,560,'Lösungen = Schnittpunkte',60,C.green);note(s,Wd(5,'Achse')-0.3,230,630,'mit der x-Achse',60,C.green);
 const G={ox:1260,oy:620,sc:56,xr:[-3.6,5.6],yr:[-4.6,5.2]};
 axes(s,Wd(4,'Graph')-0.4,G);curve(s,Wd(4,'Parabel')-0.2,G,x=>x*x-2*x-3,C.blue,1.4);
 dot(s,Wd(5,'schneidet')-0.2,G,-1,0,C.green,'x₁',0,-34);dot(s,Wd(5,'schneidet'),G,3,0,C.green,'x₂',0,-34);
 note(s,Wd(5,'zwei')-0.2,1480,860,'2 Lösungen',56,C.green);
 // three mini graphs
 const M=[[Wd(6,'zweimal'),230,x=>x*x-1.2,'2'],[Wd(6,'einmal'),470,x=>x*x,'1'],[Wd(6,'gar')-0.2,710,x=>x*x+0.8,'0']];
 M.forEach(([t0,x0,f,lab])=>{const g={ox:x0+100,oy:790,sc:50,xr:[-1.9,1.9],yr:[-1.4,2.2]};custom(s,t0-0.2,t=>{const k=eo(prog(t,t0-0.2,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k;hline(g.ox-95,g.oy,g.ox+95,g.oy,C.ink,2.5);ctx.restore()});curve(s,t0,g,f,C.org,0.7,4);
   note(s,t0+0.4,x0+100,870,lab,56,C.red,{align:'c'})});
}
// ---------- S2 Kap 2 ----------
camTo(E(7,-0.7),2);
{const s=2;headingE(s,E(7,0.2),2,'Der einfache Fall');
 write(s,[Wd(8,'Quadrat'),Wd(8,'gleich'),Wd(8,'neun')],230,330,['x²','=','9'],130,C.ink,{cols:[C.blue,C.ink,C.ink]});
 note(s,Wd(9,'Drei',1)-0.1,230,480,'3 · 3 = 9',72,C.ink);check(s,Wd(9,'neun')+0.2,600,480,30);
 note(s,Wd(9,'Minus')-0.1,230,590,'(−3) · (−3) = 9',72,C.red);check(s,Wd(9,'auch')+0.3,760,590,30);
 const wr=write(s,[Wd(10,'schreibt')+0.2,Wd(10,'plus')-0.1,Wd(10,'plus')+0.2],230,740,['x','=','±3'],120,C.green);boxE(s,Wd(10,'drei',3)+0.2,tokRect(wr,0,2,16));
 note(s,Wd(11,'Genauso')-0.1,230,875,'x² − 9 = 0   | +9   →   x² = 9',58,C.ink);
 const G={ox:1380,oy:860,sc:40,xr:[-5.5,5.5],yr:[-0.6,12],ystep:3};
 axes(s,Wd(8,'Zahl')-0.4,G);curve(s,Wd(8,'Zahl'),G,x=>x*x,C.blue,1.2);
 curve(s,Wd(9,'neun',1)-0.2,G,x=>9,C.red,0.8,3);
 note(s,Wd(9,'neun',1),G.ox+5.6*G.sc-10,G.oy-9*G.sc-30,'y = 9',40,C.red,{align:'r'});
 dot(s,Wd(10,'drei',1)-0.2,G,3,9,C.green,'3',30,10);dot(s,Wd(10,'minus')-0.1,G,-3,9,C.green,'−3',-34,10);
}
// ---------- S3 Kap 3 ----------
camTo(E(12,-0.7),3);
{const s=3;headingE(s,E(12,0.2),3,'Das Quadrat ergänzen');
 write(s,[Wd(13,'zurück'),Wd(13,'Quadrat'),Wd(13,'sechs'),Wd(13,'gleich'),Wd(13,'sechzehn')],230,300,['x²','+','6x','=','16'],100,C.ink,{cols:[C.blue,C.ink,C.org,C.ink,C.ink]});
 const TX=300,TY=420,A=300,B=90;
 tile(s,Wd(14,'Quadrat',2)-0.3,TX,TY,A,A,'rgba(77,163,255,0.35)','x²');
 note(s,Wd(14,'Seitenlänge'),TX+A/2,TY-28,'x',48,C.blue,{align:'c'});note(s,Wd(14,'Seitenlänge'),TX-30,TY+A/2,'x',48,C.blue,{align:'c'});
 note(s,Wd(15,'zweimal')-0.2,1000,420,'6x  =  3x + 3x',62,C.org);
 tile(s,Wd(15,'rechts')-0.2,TX+A,TY,B,A,'rgba(255,159,67,0.5)','3x',{from:[260,0],ls:46});
 tile(s,Wd(15,'unten')-0.2,TX,TY+A,A,B,'rgba(255,159,67,0.5)','3x',{from:[0,220],ls:46});
 note(s,Wd(15,'rechts')+0.3,TX+A+B/2,TY-28,'3',48,C.org,{align:'c'});note(s,Wd(15,'unten')+0.3,TX-30,TY+A+B/2,'3',48,C.org,{align:'c'});
 tile(s,Wd(16,'Ecke')-0.4,TX+A,TY+A,B,B,null,'?',{dash:1,lc:C.red,ls:56,tOut:Wd(17,'ergänzen')});
 note(s,Wd(16,'Drei')-0.1,1000,520,'Ecke fehlt:  3 · 3 = 9',62,C.red);
 tile(s,Wd(17,'ergänzen')-0.1,TX+A,TY+A,B,B,'rgba(38,194,129,0.55)','9',{ls:52});
 write(s,[Wd(17,'Links'),Wd(17,'Links')+0.4,Wd(17,'rechts')-0.3,Wd(17,'rechts')],1000,640,['x² + 6x','+ 9','=','16 + 9'],70,C.ink,{cols:[C.ink,C.green,C.ink,C.ink]});
 note(s,Wd(17,'fünfundzwanzig')-0.4,1440,730,'= 25',70,C.ink);
 custom(s,Wd(18,'komplettes')-0.2,t=>{const k=eo(prog(t,Wd(18,'komplettes')-0.2,0.6));if(k>0)hrect(TX-8,TY-8,A+B+16,A+B+16,C.green,5,k)});
 note(s,Wd(18,'Seite')-0.1,TX+(A+B)/2,TY+A+B+50,'Seite:  x + 3',56,C.green,{align:'c'});
 const w18=write(s,[Wd(18,'Also')-0.1],1000,810,['(x + 3)²','=','25'],86,C.green,{per:0.35});
 write(s,[Wd(19,'Wurzel')],1000,930,['x + 3','=','±5'],86,C.ink,{per:0.35,cols:[C.ink,C.ink,C.red]});
 camTo(E(20,-0.5),3,400);
 note(s,Wd(20,'Erste'),230,1170,'x + 3 = 5    →    x = 2',72,C.ink);note(s,Wd(20,'zwei')-0.1,1000,1170,'x₁ = 2',72,C.green);
 note(s,Wd(20,'Zweite'),230,1270,'x + 3 = −5   →    x = −8',72,C.ink);note(s,Wd(20,'acht')-0.1,1000,1270,'x₂ = −8',72,C.green);
 note(s,Wd(21,'Probe'),230,1380,'Probe:  2² + 6 · 2 = 4 + 12 = 16',60,C.green);check(s,Wd(21,'Stimmt'),1110,1380,30);
}
// ---------- S4 Kap 4 ----------
camTo(E(22,-0.7),4);
{const s=4;headingE(s,E(22,0.2),4,'Die pq-Formel');
 note(s,Wd(23,'aussehen')-0.1,230,300,'Normalform:   x² + p·x + q = 0',66,C.ink);
 const wf=write(s,[Wd(24,'minus',1)-0.4],330,470,FQ(),110,C.ink,{per:0.22,cols:[C.ink,C.ink,C.ink,C.org,C.red,C.ink,C.green,C.green,C.ink,C.ink,C.ink]});
 boxE(s,LE(24)-0.3,[290,370,totalW(FQ(),110)+80,200],C.red,5);
 marker(s,Wd(25,'Hälfte')-0.2,tokRect(wf,3,3,6));note(s,Wd(25,'drei')-0.1,wf.ax+wf.L[3].x-30,600,'= 3 (Rechtecke)',48,C.org);
 marker(s,Wd(25,'Ecke',1)-0.6,tokRect(wf,6,7,6));note(s,Wd(25,'Ecke',1)-0.4,wf.ax+wf.L[6].x,600,'= 9 (die Ecke!)',48,C.green);
 note(s,Wd(26,'Rechnen'),230,710,'x² + 6x − 16 = 0',72,C.ink);note(s,Wd(26,'sechs',2)-0.2,820,710,'p = 6',72,C.org);note(s,Wd(26,'minus',2)-0.1,1060,710,'q = −16',72,C.blue);
 const w1=write(s,[Wd(27,'Minus',1),Wd(27,'plus',1),Wd(27,'Wurzel',1),Wd(27,'fünf',2)-0.6,Wd(27,'fünf',2)-0.3,Wd(27,'fünf',2)],230,830,['x','=','−3 ±','√(9 + 16)','=','−3 ± 5'],80,C.ink);
 note(s,Wd(27,'zwei')-0.2,1150,830,'x₁ = 2',72,C.green);note(s,Wd(27,'acht')-0.2,1400,830,'x₂ = −8',72,C.green);
 note(s,Wd(27,'Genau')-0.1,1150,920,'✓ genau wie mit dem Quadrat!',52,C.green);
}
// ---------- S5 Kap 5 ----------
camTo(E(28,-0.7),5);
{const s=5;headingE(s,E(28,0.2),5,'Wie viele Lösungen?');
 note(s,Wd(29,'Wurzel')-0.2,230,300,'entscheidend: der Teil unter der Wurzel',58,C.ink);
 note(s,Wd(29,'positiv')-0.2,230,400,'> 0   →   2 Lösungen',64,C.green);
 note(s,Wd(29,'null')-0.2,230,490,'= 0   →   1 Lösung',64,C.org);
 note(s,Wd(30,'negativ')-0.2,230,580,'< 0   →   keine Lösung',64,C.red);
 const G={ox:1470,oy:760,sc:52,xr:[-4.2,2.4],yr:[-1.2,7.4]};
 axes(s,Wd(30,'Parabel')-0.6,G);
 curve(s,Wd(31,'Beispiel'),G,x=>x*x+2*x+5,C.red,1.1);note(s,Wd(31,'Lösung')-0.3,G.ox+2.6*G.sc,G.oy-4.2*G.sc,'trifft nicht!',44,C.red);
 note(s,Wd(31,'Beispiel')+0.2,230,700,'x² + 2x + 5 = 0:   1 − 5 = −4   →   keine Lösung',52,C.red);
 curve(s,Wd(32,'Beispiel')+0.2,G,x=>x*x+2*x+1,C.green,1.1);dot(s,Wd(32,'einzige')-0.1,G,-1,0,C.green,'−1',0,40);
 note(s,Wd(32,'Beispiel')+0.4,230,800,'x² + 2x + 1 = 0:   1 − 1 = 0   →   x = −1',52,C.green);
}
// ---------- S6 Kap 6 ----------
camTo(E(33,-0.7),6);
{const s=6;headingE(s,E(33,0.2),6,'Erst in die Normalform');
 custom(s,E(34,0),t=>{const k=eo(prog(t,E(34,0),0.6));if(k>0)hrect(210,250,1300,110,C.red,3.5,k)});
 note(s,E(34,0.3),240,305,'⚠ pq-Formel nur, wenn vor x² eine 1 steht!',60,C.red);
 note(s,Wd(35,'zwei')-0.2,230,450,'2x² + 8x − 10 = 0',76,C.ink);note(s,Wd(35,'durch')-0.1,900,450,'| : 2',76,C.red);
 note(s,Wd(35,'Dann'),230,570,'x² + 4x − 5 = 0',76,C.ink);
 note(s,Wd(36,'p')-0.1,820,570,'p = 4,   q = −5',70,C.org);
 note(s,Wd(36,'Minus')-0.1,230,690,'x = −2 ± √(4 + 5) = −2 ± 3',72,C.ink);
 note(s,Wd(36,'Lösungen')-0.1,230,810,'x₁ = 1,    x₂ = −5',80,C.green);check(s,Wd(36,'fünf',3)+0.3,880,810,32);
}
// ---------- S7 Kap 7 ----------
camTo(E(37,-0.7),7);
{const s=7;headingE(s,E(37,0.2),7,'Die 3 häufigsten Fehler');
 const row=(y,num,tNum,wrongT,wrongS,crossT,crossX,rightT,rightS,checkT,noteT,noteS)=>{note(s,tNum,170,y,num,64,C.red);note(s,wrongT,290,y,wrongS,68,C.ink);cross(s,crossT,290+crossX,y,32);
   const x2=290+tw(wrongS,68)+70;note(s,rightT,x2,y,rightS,68,C.green);const x3=x2+tw(rightS,68)+45;check(s,checkT,x3,y,28);if(noteS)note(s,noteT,x3+60,y,noteS,46,C.green)};
 row(330,'#1',E(38,0),Wd(38,'negative'),'x² = 9  →  x = 3',Wd(38,'auch')-0.3,tw('x² = 9  →  x = 3',68)-25,Wd(38,'minus')-0.2,'→  x = ±3',Wd(38,'Lösung',2)+0.2,Wd(38,'minus'),'auch −3!');
 row(560,'#2',E(39,0),Wd(39,'Quadrat')-0.2,'x² − 6x + 8:  p = 6',Wd(39,'minus',1)+0.2,tw('x² − 6x + 8:  p = 6',68)-30,Wd(39,'Halbe')-0.4,'→  p = −6,  x = 3 ± 1',Wd(39,'zwei',2)+0.3,Wd(39,'vier'),'x = 4 und 2');
 row(790,'#3',E(40,0),Wd(40,'teilen')-0.2,'2x² + 8x − 10:  p = 8',Wd(40,'Normalform')-0.2,tw('2x² + 8x − 10:  p = 8',68)-30,Wd(40,'Normalform'),'→  erst : 2',Wd(40,'falsche')+0.2,Wd(40,'Ergebnisse'),'');
}
// ---------- S8 Übung ----------
camTo(E(41,-0.7),8);
{const s=8;headingE(s,E(41,0.1),0,'Jetzt du! ✏️');
 note(s,Wd(41,'Pausiere'),1150,150,'⏸ Video pausieren!',60,C.blue);
 const T=[[Wd(42,'Aufgabe',1),'a)','x² = 49'],[Wd(42,'Aufgabe',2),'b)','x² + 4x − 12 = 0'],[Wd(42,'Aufgabe',3),'c)','x² + 4x + 5 = 0']];
 T.forEach(([t0,lab,str],i)=>{const y=330+i*200;note(s,t0,200,y,lab,70,C.red);note(s,t0+0.6,310,y,str,76,C.ink)});
 const T0=LE(42)+0.3,T1=E(43,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(77,163,255,0.18)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,C.blue,4,1);
   ctx.font=HF(110);ctx.fillStyle=C.blue;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*10))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Denk-Pause',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(43,'plus'),'x = ±7',Wd(43,'sieben',2)],[Wd(44,'minus'),'−2 ± √16 = −2 ± 4  →  2 und −6',Wd(44,'sechs')],[Wd(45,'Unter'),'4 − 5 = −1  →  keine Lösung',Wd(45,'Keine')]];
 const XS=[640,850,830];SOL.forEach(([t0,str,tc],i)=>{const y=330+i*200;note(s,t0,XS[i],y,str,64,C.green);check(s,tc+0.3,XS[i]+tw(str,64)+40,y,28)});
 note(s,Wd(46,'Kommentare')-0.6,200,900,'Alles richtig?  →  schreib’s in die Kommentare 💬',60,C.blue);
}
// ---------- S9 Summary ----------
camTo(E(47,-0.7),9);
{const s=9;headingE(s,E(47,0.1),0,'Kurz zusammengefasst');
 const B=[[Wd(47,'null'),'• 0, 1 oder 2 Lösungen',C.ink],[Wd(47,'ergänztes')-0.4,'• pq-Formel = ergänztes Quadrat',C.green],[Wd(47,'Normalform')-0.4,'• erst Normalform (vor x² steht 1)',C.red],[Wd(47,'vergiss'),'• das ± nicht vergessen!',C.blue]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,320+i*100,str,62,col));
 camTo(E(48,-0.4),9,180);
 custom(s,E(48,0),t=>{const k=eo(prog(t,E(48,0),0.6));if(k>0)hrect(230,850,1000,260,C.ink,3.5,k)});
 note(s,E(48,0.2),270,905,'Nächstes Video:',56,C.ink);
 note(s,Wd(48,'minus')-0.3,270,1020,'(−) · (−) = (+)  …  warum?',64,C.blue);
 custom(s,Wd(48,'Abonnier')-0.2,t=>{const k=prog(t,Wd(48,'Abonnier')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1500,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Abonnieren',0,6);ctx.restore()});
 note(s,Wd(48,'Bis')-0.1,1300,860,'Bis dann! 👋',70,C.green);
}
