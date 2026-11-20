// ===================== OVERLAY ELEMENTS =====================
const EL=[];const add=(t0,t1,f)=>EL.push({t0,t1,f});
// step list (equations aligned on '=') with ops "| −5" and stamps
function steps(o){const t0=Math.min(...o.lines.map(l=>l.t));add(t0-0.01,o.t1,(t,a)=>{let i=0;for(const l of o.lines){if(t<l.t){i++;continue}const k=appear(t,l.t,0.4);const y=o.y0+i*o.dy;const al=a*k*(l.tOut&&t>l.tOut?1-appear(t,l.tOut,0.3):1);if(al<=0){i++;continue}
  const L=drawEq(l.s,o.x+(1-easeOut(k))*60,y,o.size,{align:'=',alpha:al,glow:l.glow,strike:l.strikeT?clamp((t-l.strikeT)/0.3,0,1):null});
  if(l.op&&t>=l.opT){const ka=appear(t,l.opT,0.3);const ox=o.x+(o.opx||o.size*4.2);ctx.save();ctx.globalAlpha*=al*ka;ctx.fillStyle=COL.y;ctx.fillRect(ox,y-o.size*0.55,o.size*0.07,o.size*1.1);txt(l.op.replace(/-/g,'−'),ox+o.size*0.3,y,o.size*0.85,COL.y,'left',900,0.14);ctx.restore()}
  if(l.ok!=null&&t>=l.ok)stamp(l.bad?false:true,o.x+(o.stx||o.size*3.4),y,o.size*0.42,appear(t,l.ok,0.35)*al);
  if(l.box&&t>=l.box.t)tokBox(L,l.box.i0,l.box.i1,y,o.size,l.box.col||COL.g,appear(t,l.box.t,0.3)*al,l.box.cross);
  i++}})}
const big=(t0,t1,s,x,y,size,col,o)=>add(t0,t1,(t,a)=>{const k=appear(t,t0,0.35);const sc=lerp(0.6,1,backOut(k));ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(sc,sc);if(o&&o.shake){const d=Math.max(0,1-(t-t0)/0.6);ctx.translate(Math.sin(t*90)*12*d,0)}
  if(o&&o.glow)glowTxt(s,0,0,size,col,'center',900);else txt(s,0,0,size,col,'center',900);ctx.restore()});
const pl=(t0,t1,s,x,y,size,col)=>add(t0,t1,(t,a)=>{const k=appear(t,t0,0.3);ctx.save();ctx.translate(x,y);ctx.scale(lerp(0.7,1,backOut(k)),lerp(0.7,1,backOut(k)));pill(s,0,0,size,col,a);ctx.restore()});
const eqE=(t0,t1,s,x,y,size,o)=>add(t0,t1,(t,a)=>{const k=appear(t,t0,0.4);drawEq(s,x,y+(1-easeOut(k))*30,size,Object.assign({alpha:a},o||{}))});
const stampE=(t0,t1,ok,x,y,s)=>add(t0,t1,(t,a)=>{ctx.save();ctx.globalAlpha*=a;stamp(ok,x,y,s,appear(t,t0,0.35));ctx.restore()});
const pin=(t0,t1,s,side,off,size,col)=>add(t0,t1,(t,a)=>{if(!SCN||!LASTVP)return;const pc=side==='L'?SCN.G.pL:SCN.G.pR;const p=project(LASTVP,[pc[0]+off[0],pc[1]+off[1],0.3]);if(!p)return;const k=appear(t,t0,0.3);ctx.save();ctx.translate(p[0],p[1]);ctx.scale(lerp(0.7,1,backOut(k)),lerp(0.7,1,backOut(k)));pill(s,0,0,size,col,a);ctx.restore()});
const cardE=(t0,t1,x,y,w,h,o)=>add(t0,t1,(t,a)=>{const k=appear(t,t0,0.4);card(x,y+(1-easeOut(k))*40,w,h,Object.assign({alpha:a*k},o||{}))});
// ================= HOOK =================
add(E(0,-0.4),15.9,(t,a)=>{// x + 5 = 12  ->  x = 12 − 5  (the "jump")
  const A=eqLayout('x + 5 = 12',150),B=eqLayout('x = 12 ^y− ^y5',150);const shrink=ease((t-E(1,0))/0.5);const size=lerp(150,84,shrink),cy=lerp(450,170,shrink);const sc=size/150;
  const tin=[0,0.2,0.6,1.0,1.2].map(r=>E(0,r));const k=ease((t-E(0,3.2))/1.3);
  const ax0=960-A.w/2,bx0=960-B.w/2;const map=[[0,0],[1,3],[2,4],[3,1],[4,2]];
  ctx.save();ctx.globalAlpha*=a;
  for(const[ia,ib]of map){const ta=A.T[ia],tb=B.T[ib];if(t<tin[ia])continue;const ka=appear(t,tin[ia],0.25);const mv=(ia===1||ia===2);
    let x=lerp(ax0+ta.x,bx0+tb.x,k),y=450-(mv?Math.sin(k*Math.PI)*190:0);x=960+(x-960)*sc;y=cy+(y-450)*sc;
    const s=mv&&k>0.5?tb.s:ta.s;const col=mv&&k>0.5?COL.y:ta.c;ctx.save();ctx.globalAlpha*=ka;
    if(mv&&k>0.02&&k<0.98){ctx.shadowColor=COL.y;ctx.shadowBlur=40}txt(s,x,y+(1-easeOut(ka))*40,size*lerp(0.7,1,backOut(ka)),col,'left',800,0.14);ctx.restore()}
  if(t>E(0,3.0)&&t<E(1,0.2)){const ka=life(t,E(0,3.0),E(1,0));ctx.save();ctx.globalAlpha*=ka*0.8;ctx.strokeStyle=COL.y;ctx.lineWidth=5;ctx.setLineDash([14,14]);ctx.lineDashOffset=-t*60;ctx.beginPath();
    const x1=ax0+A.T[1].x+60,x2=bx0+B.T[3].x+60;ctx.moveTo(x1,370);ctx.quadraticCurveTo((x1+x2)/2,120,x2,370);ctx.stroke();ctx.restore()}
  ctx.restore()});
pl(E(0,2.0),E(0,3.3),'Easy, oder? 😎',960,700,46,COL.c);
pl(E(0,4.0),E(1,0),'„Die 5 kommt rüber“',960,700,46,COL.y);
big(E(1,0.5),E(1,3.6),'WARUM?',960,560,190,COL.p,{shake:1,glow:1});
eqE(E(1,3.8),15.9,'3x = 12',960,480,120);
eqE(E(1,5.7),15.9,'x = ^p12 ^p− ^p3 ^p= ^p9',960,680,120);
stampE(E(1,8.2),15.9,false,1600,680,70);
big(E(1,8.2),15.9,'FALSCH!',960,880,110,COL.p,{shake:1,glow:1});
// ================= INTRO (scale swoop) =================
big(E(2,1.4),E(3,-0.3),'GLEICHUNGEN UMSTELLEN',960,120,96,'#ffffff',{glow:1});
add(E(2,4.0),E(3,-0.3),(t,a)=>{const k=appear(t,E(2,4.0),0.5);txt('…so, dass du es nie wieder vergisst',960,215,44,COL.y,'center',800);});
pl(E(2,6.0),E(3,-0.3),'⚖️  Ein Bild: die Waage',960,950,46,COL.c);
// ================= S1 : x + 5 = 12 =================
pl(E(4,2.0),E(5,0),'Gleichgewicht',700,180,44,COL.g);
steps({x:1430,y0:300,dy:150,size:84,t1:79.2,opx:270,stx:330,lines:[{t:E(6,4.6),s:'x + 5 = 12',op:'-5',opT:E(10,1.7)},{t:E(11,6.3),s:'^gx = ^g7',ok:E(11,7.0),glow:COL.g}]});
pin(E(7,1.5),E(8,1.0),'x = ?','L',[-0.85,1.35],52,COL.c);
pl(E(8,3.6),E(10,0.2),'Ungleichgewicht!',700,180,50,COL.p);
pl(E(10,1.7),E(11,0.5),'Beide Seiten −5',700,180,50,COL.y);
// ================= BOARD : notation =================
steps({x:900,y0:270,dy:175,size:110,t1:95.6,opx:520,stx:620,lines:[
 {t:E(12,0),s:'x + 5 = 12',op:'-5',opT:E(12,5.2)},
 {t:E(12,7.3),s:'x + 5 ^y− ^y5 = 12 ^y− ^y5',box:{t:E(13,6.0),i0:1,i1:4,col:COL.g,cross:1}},
 {t:E(13,6.5),s:'^gx = ^g7',ok:E(13,6.8),glow:COL.g}]});
add(E(12,3.7),E(12,5.2),(t,a)=>{const k=appear(t,E(12,3.7),0.3);ctx.save();ctx.globalAlpha*=a*k;ctx.fillStyle=COL.y;ctx.fillRect(1420,270-60,8,120);txt('Strich',1424,370,36,COL.y,'center',800);ctx.restore()});
cardE(E(13,2.0),95.6,260,820,620,150,{edge:'rgba(255,90,138,0.8)'});add(E(13,2.0),95.6,(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(13,2.0));txt('„Die 5 springt rüber“',570,895,46,'#ffffff','center',800);ctx.restore();ctx.save();ctx.globalAlpha*=a;stamp(false,850,830,44,appear(t,E(13,2.6)));ctx.restore()});
cardE(E(13,4.5),95.6,1040,820,620,150,{edge:'rgba(125,255,154,0.85)'});add(E(13,4.5),95.6,(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(13,4.5));txt('Auf BEIDEN Seiten −5',1350,895,46,'#ffffff','center',800);ctx.restore();ctx.save();ctx.globalAlpha*=a;stamp(true,1630,830,44,appear(t,E(13,5.0)));ctx.restore()});
// ================= BOARD : Gegenoperation =================
big(E(15,0.3),117.0,'Mach immer das GEGENTEIL',960,190,72,'#ffffff',{glow:0});
{const P=[[E(16,0.4),E(16,1.4),'+','−',730,450],[E(16,2.4),E(16,3.4),'−','+',1190,450],[E(17,0.4),E(17,1.0),'·',':',730,690],[E(17,2.1),E(17,3.1),':','·',1190,690]];
 for(const[ta,tb,s1,s2,x,y]of P){const d1=s1==='·'?'•':s1,d2=s2==='·'?'•':s2;cardE(ta,E(18,0.6),x-200,y-95,400,190);add(ta,E(18,0.6),(t,a)=>{const k=appear(t,ta);ctx.save();ctx.globalAlpha*=a*k;txt(d1,x-110,y,130,'#ffffff','center',900);
   const kb=appear(t,tb,0.3);ctx.globalAlpha*=1;txt('→',x,y,70,COL.d,'center',900);if(t>=tb){ctx.save();ctx.translate(x+110,y);const s=lerp(0.5,1,backOut(kb));ctx.scale(s,s);glowTxt(d2,0,0,130,COL.y,'center',900);ctx.restore()}ctx.restore()})}}
pl(E(18,0.4),118.5,'Der Klassiker:',960,380,50,COL.y);
eqE(E(18,1.4),118.5,'3x = 12',960,580,170);
// ================= S2 : 3x = 12 =================
steps({x:1430,y0:300,dy:150,size:84,t1:152.5,opx:270,stx:330,lines:[{t:E(19,0),s:'3x = 12',op:':3',opT:E(21,2.3)},{t:E(22,3.9),s:'^gx = ^g4',ok:E(22,4.3),glow:COL.g}]});
pl(E(19,0.8),E(20,0),'3x  =  3 · x',1530,450,44,COL.c);
cardE(E(20,0.8),E(21,0.2),1250,560,560,250,{edge:'rgba(255,90,138,0.8)'});
add(E(20,0.8),E(21,0.2),(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(20,0.8));drawEq('12 − 3 = 9',1500,640,74,{alpha:1,strike:clamp((t-E(20,2.4))/0.3,0,1)});
  if(t>E(20,5.0))txt('3 ist mal, nicht plus!',1530,750,40,COL.p,'center',800);ctx.restore();ctx.save();ctx.globalAlpha*=a;stamp(false,1740,640,40,appear(t,E(20,2.4)));ctx.restore()});
pl(E(21,4.3),E(22,1.0),'In 3 gleiche Teile',700,180,48,COL.y);
cardE(E(23,0.5),152.5,1250,560,560,180,{edge:'rgba(125,255,154,0.85)'});
add(E(23,0.5),152.5,(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(23,0.5));txt('PROBE',1530,605,34,COL.g,'center',900);drawEq('3 · 4 = 12',1500,672,70,{alpha:1});ctx.restore();ctx.save();ctx.globalAlpha*=a;stamp(true,1740,672,36,appear(t,E(23,2.3)));ctx.restore()});
// ================= S3 : 2x + 3 = 13 =================
steps({x:1430,y0:290,dy:130,size:76,t1:187.9,opx:250,stx:300,lines:[{t:E(25,0),s:'2x + 3 = 13',op:'-3',opT:E(27,1.1)},{t:E(27,3.7),s:'2x = 10',op:':2',opT:E(28,0.4)},{t:E(28,1.7),s:'^gx = ^g5',ok:E(28,2.2),glow:COL.g}]});
pin(E(25,5.3),E(26,0),'· 2','L',[-0.3,1.5],48,COL.y);pin(E(25,6.5),E(26,0),'+ 3','L',[0.85,1.5],48,COL.y);
cardE(E(26,0.8),E(29,0.3),1250,690,560,230);
add(E(26,0.8),E(29,0.3),(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(26,0.8));txt('REIHENFOLGE',1530,735,32,COL.c,'center',900);
  txt('1.  erst  + −',1350,800,52,'#ffffff','left',900);ctx.globalAlpha*=appear(t,E(26,2.9));txt('2.  dann  · :',1350,870,52,COL.y,'left',900);ctx.restore()});
cardE(E(29,2.0),187.9,1250,690,560,240,{edge:'rgba(255,90,138,0.85)'});
add(E(29,2.0),187.9,(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(29,2.0));txt('Erst  :2 ?',1530,735,40,COL.p,'center',900);
  if(t>E(29,4.6))drawEq('x + 3/2 = 13/2',1530,820,70,{alpha:appear(t,E(29,4.6))});if(t>E(29,6.6)){ctx.save();ctx.translate(1530,900);const s=lerp(0.5,1,backOut(appear(t,E(29,6.6))));ctx.scale(s,s);pill('Brüche! 😵',0,0,36,COL.p,1);ctx.restore()}ctx.restore()});
// ================= S4 : 5x − 4 = 2x + 8 =================
steps({x:1390,y0:270,dy:112,size:62,t1:222.4,opx:300,stx:350,lines:[{t:E(31,0),s:'5x − 4 = 2x + 8',op:'-2x',opT:E(33,0)},{t:E(33,2.7),s:'3x − 4 = 8',op:'+4',opT:E(34,0)},{t:E(34,1.5),s:'3x = 12',op:':3',opT:E(34,3.2)},{t:E(34,4.2),s:'^gx = ^g4',ok:E(34,4.6),glow:COL.g}]});
pin(E(31,1.4),E(34,2.2),'🎈 = −1','L',[0,3.45],40,COL.p);
pl(E(32,4.8),E(33,0.5),'Beide Seiten −2 Kisten',700,175,46,COL.y);
pl(E(34,0.0),E(34,1.6),'Beide Seiten +4',700,175,46,COL.y);
cardE(E(35,0),222.4,1190,790,660,170,{edge:'rgba(255,216,74,0.85)'});
add(E(35,0),222.4,(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(35,0));txt('💡 TIPP',1520,830,32,COL.y,'center',900);txt('x dahin, wo MEHR x sind',1520,885,44,'#ffffff','center',800);
  if(t>E(35,2.7)){ctx.globalAlpha*=appear(t,E(35,2.7));txt('5x > 2x  →  x bleibt positiv',1520,932,30,COL.g,'center',800)}ctx.restore()});
// ================= BOARD : Handyvertrag =================
cardE(E(37,0),254.9,80,170,620,740,{edge:'rgba(90,240,255,0.85)',r:60});
add(E(37,0),254.9,(t,a)=>{ctx.save();ctx.translate(-100,0);ctx.globalAlpha*=a*appear(t,E(37,0));ctx.fillStyle='rgba(90,240,255,0.25)';rrect(410,195,160,14,7);ctx.fill();
  txt('📱 Handyvertrag',490,270,46,'#ffffff','center',900);
  const row=(tt,y,l,r,c)=>{if(t<tt)return;const k=appear(t,tt);ctx.save();ctx.globalAlpha*=k;txt(l,240+(1-k)*30,y,40,'#c8d0ff','left',700,false);txt(r,740,y,52,c,'right',900);ctx.restore()};
  row(E(37,1.4),390,'Grundgebühr','10 €','#ffffff');row(E(37,3.0),490,'pro extra GB','2 €','#ffffff');
  if(t>E(37,7.4)){ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(240,560,500,3)}
  row(E(37,7.7),630,'Rechnung','24 €',COL.y);row(E(37,10.0),750,'extra GB?','x',COL.c);ctx.restore()});
pl(E(38,1.2),254.9,'x = extra GB',1220,250,44,COL.c);
steps({x:1220,y0:420,dy:150,size:80,t1:254.9,opx:380,stx:270,lines:[{t:E(38,2.6),s:'2 · x + 10 = 24',op:'-10',opT:E(39,0)},{t:E(39,1.2),s:'2x = 14',op:':2',opT:E(39,3.0)},{t:E(39,4.2),s:'^gx = ^g7',ok:E(39,4.6),glow:COL.g}]});
pl(E(39,6.0),254.9,'✅ 7 GB extra verbraucht',1100,900,46,COL.g);
// ================= BOARD : 3 Fehler =================
function errHead(l,t1,n,title){add(E(l,-0.3),t1,(t,a)=>{const k=appear(t,E(l,-0.3));ctx.save();ctx.globalAlpha*=a*k;pill('FEHLER #'+n,960,150,40,COL.p,1,'rgba(80,15,35,0.9)');txt(title,960,255,70,'#ffffff','center',900);ctx.restore()})}
errHead(41,E(42,-0.4),1,'Nur EINE Seite verändern');
steps({x:900,y0:470,dy:200,size:100,t1:E(42,-0.4),stx:700,lines:[{t:E(41,1.2),s:'x + 5 ^p− ^p5 = 12',ok:E(41,2.0),bad:1},{t:E(41,4.9),s:'x + 5 ^y− ^y5 = 12 ^y− ^y5',ok:E(41,6.0)}]});
errHead(42,E(43,-0.4),2,'Nur EINEN Teil teilen');
steps({x:880,y0:430,dy:165,size:92,t1:E(43,-0.4),opx:430,stx:620,lines:[{t:E(42,3.9),s:'2x + 4 = 10',op:':2',opT:E(42,4.6)},{t:E(42,6.7),s:'x + ^p4 = 5',ok:E(42,8.6),bad:1,strikeT:E(42,8.6)},{t:E(42,12.3),s:'x + ^g2 = 5',ok:E(42,13.6)}]});
pl(E(42,10.3),E(43,-0.4),'JEDEN Teil teilen!',1480,595,42,COL.y);
pl(E(42,16.6),E(43,-0.4),'oder erst −4:  2x = 6  →  x = 3',960,960,40,COL.c);
errHead(43,E(44,-0.4),3,'Das Minus vor dem x');
steps({x:900,y0:450,dy:190,size:104,t1:E(44,-0.4),opx:420,stx:620,lines:[{t:E(43,3.7),s:'^p−x = 5',op:':(-1)',opT:E(43,8.2)},{t:E(43,5.5),s:'x = 5',ok:E(43,6.0),bad:1,strikeT:E(43,6.0),tOut:E(43,8.0)},{t:E(43,10.2),s:'^gx = ^g−5',ok:E(43,10.6),glow:COL.g}]});
add(E(44,-0.3),E(45,-0.3),(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(44,-0.3));pill('🛟 SICHERHEITSNETZ',960,150,40,COL.g,1,'rgba(20,70,40,0.9)');txt('Die Probe',960,255,80,'#ffffff','center',900);ctx.restore()});
eqE(E(44,1.9),E(45,-0.3),'x + 5 = 12',960,430,96);
pl(E(44,3.4),E(45,-0.3),'x = 7 einsetzen',960,560,44,COL.c);
eqE(E(44,5.8),E(45,-0.3),'^y7 + 5 = 12',960,690,110);stampE(E(44,7.5),E(45,-0.3),true,1330,690,52);
pl(E(44,9.0),E(45,-0.3),'⏱ 10 Sekunden = sichere Punkte',960,880,46,COL.y);
// ================= BOARD : Übung =================
big(E(45,0.4),E(46,1.2),'DU BIST DRAN!',960,420,150,COL.y,{glow:1});
pl(E(45,2.2),E(46,1.2),'⏸  Video pausieren & mitrechnen',960,640,50,COL.c);
const TASKS=[['A1','x − 7 = 2',E(46,1.5),[[E(47,1.8),'| +7'],[E(47,3.0),'x = 9']]],['A2','4x = 28',E(46,5.6),[[E(48,1.3),'| :4'],[E(48,3.1),'x = 7']]],['A3','3x + 5 = 20',E(46,10.0),[[E(49,1.3),'| −5 → 3x = 15'],[E(49,2.7),'| :3'],[E(49,4.1),'x = 5']]]];
TASKS.forEach(([n,eq,t0,sol],i)=>{const x=380+i*580;cardE(t0,E(50,0.2),x-260,170,520,620);add(t0,E(50,0.2),(t,a)=>{const k=appear(t,t0);ctx.save();ctx.globalAlpha*=a*k;pill('AUFGABE '+(i+1),x,240,34,COL.c,1);drawEq(eq,x,370,74,{alpha:1});
  sol.forEach(([ts,s],j)=>{if(t<ts)return;const kk=appear(t,ts);const last=j===sol.length-1;ctx.save();ctx.globalAlpha*=kk;if(last){drawEq('^gx = ^g'+s.split('= ')[1],x,470+j*85+20,80,{alpha:1,glow:COL.g});stamp(true,x+190,470+j*85+20,34,kk)}else txt(s.replace('-','−'),x,470+j*85,44,COL.y,'center',800);ctx.restore()});ctx.restore()})});
add(E(46,12.6),E(47,0.2),(t,a)=>{const T0=E(46,12.8),T1=E(47,-0.4);const k=clamp((t-T0)/(T1-T0),0,1);const n=Math.max(1,Math.ceil((1-k)*10));ctx.save();ctx.globalAlpha*=a*appear(t,E(46,12.6));
  ctx.lineWidth=16;ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.beginPath();ctx.arc(960,920,90,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=COL.y;ctx.shadowColor=COL.y;ctx.shadowBlur=24;ctx.beginPath();ctx.arc(960,920,90,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-k));ctx.stroke();ctx.shadowBlur=0;
  txt(String(n),960,922,80,'#ffffff','center',900);txt('⏸ Pause drücken!',1300,920,44,COL.c,'left',800);ctx.restore()});
big(E(47,0),E(47,1.8),'LÖSUNGEN',960,100,70,COL.g,{glow:1});
pl(E(50,0.4),360.5,'Alle 3 richtig?  💬  Schreib’s in die Kommentare!',960,900,48,COL.g);
// ================= SUMMARY + END =================
add(E(51,-0.3),373.5,(t,a)=>{ctx.save();ctx.globalAlpha*=a*appear(t,E(51,-0.3));txt('KURZ ZUSAMMENGEFASST',960,140,64,'#ffffff','center',900);ctx.restore();
  const R=[[E(51,2.6),'⚖️','Gleichung = Waage'],[E(51,4.8),'↔️','Beide Seiten gleich behandeln'],[E(51,7.3),'🔄','Immer die Gegenoperation'],[E(51,8.9),'1️⃣','erst  + −   dann  · :']];
  R.forEach(([tt,ic,s],i)=>{if(t<tt)return;const k=appear(t,tt,0.4);const y=290+i*165;card(420+(1-easeOut(k))*60,y-62,1080,124,{alpha:a*k,r:62});ctx.save();ctx.globalAlpha*=a*k;txt(ic,520+(1-easeOut(k))*60,y,60,'#ffffff','center',400,false);txt(s,600+(1-easeOut(k))*60,y,54,i===3?COL.y:'#ffffff','left',900);ctx.restore()})});
add(E(52,-0.3),DUR,(t,a)=>{const k=appear(t,E(52,-0.3));ctx.save();ctx.globalAlpha*=k;txt('NÄCHSTES VIDEO',960,190,44,COL.c,'center',900);ctx.restore();
  if(t>E(52,1.0)){const k2=appear(t,E(52,1.0),0.4);card(460,260,1000,250,{alpha:k2,edge:'rgba(255,216,74,0.9)'});ctx.save();ctx.globalAlpha*=k2;drawEq('1/2 + 1/3 = ?',960,345,80,{alpha:1});txt('Brüche: der Fehler, den fast alle machen',960,455,44,'#ffffff','center',800);ctx.restore()}
  if(t>E(52,4.5)){const k3=appear(t,E(52,4.5),0.4);const pu=1+0.05*Math.sin(t*8);ctx.save();ctx.translate(960,700);ctx.scale(lerp(0.6,1,backOut(k3))*pu,lerp(0.6,1,backOut(k3))*pu);ctx.globalAlpha*=k3;
    ctx.shadowColor='#ff2d55';ctx.shadowBlur=40;rrect(-300,-70,600,140,70);ctx.fillStyle='#ff2d55';ctx.fill();ctx.shadowBlur=0;txt('🔔  ABONNIEREN',0,4,64,'#ffffff','center',900,false);ctx.restore()}
  if(t>E(52,6.2)){ctx.save();ctx.globalAlpha*=appear(t,E(52,6.2));txt('Bis dann! 👋',960,900,60,COL.y,'center',900);ctx.restore()}});
