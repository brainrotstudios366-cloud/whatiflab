// ===================== CONTENT: Order of Operations (EN) =====================
const SECH=[1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1080,1300];
const SECY=[];{let y=0;for(const h of SECH){SECY.push(y);y+=h}}
const CAM=[[0,0]];const camTo=(t,sec,off)=>CAM.push([t,SECY[sec]+(off||0)]);
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
function dseg(s,t0,p,q,col,lw,dur,o){o=o||{};WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{let k=eo(prog(t,t0,dur||0.5));if(k<=0)return;let a=1;if(o.tOut!=null)a=1-prog(t,o.tOut,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([14,12]);ctx.strokeStyle=col||C.ink;ctx.lineWidth=lw||3.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore()})}
function hi(s,t0,p,q,col,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,0.45));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=0.28;ctx.strokeStyle=col;ctx.lineWidth=o.w||22;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore();if(k>0.99||o.line){ctx.save();ctx.globalAlpha=Math.min(1,k);hline(p[0],p[1],q[0],q[1],col,o.lw||5.5,1,p[0]+q[0]);ctx.restore()}})}
function arcA(s,t0,c,r,a0,a1,col,label,lr,ls,o){o=o||{};WRITES.push([t0,0.3]);custom(s,t0,t=>{let k=eo(prog(t,t0,0.5));if(k<=0)return;let al=1;if(o.tOut!=null)al=1-prog(t,o.tOut,0.4);if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.lineCap='round';ctx.fillStyle=col.length===7?col+'33':col;ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.arc(c[0],c[1],r,-(a0+(a1-a0)*k)*D2R,-a0*D2R);ctx.closePath();ctx.globalAlpha*=0.5;ctx.fill();ctx.globalAlpha/=0.5;ctx.beginPath();ctx.arc(c[0],c[1],r,-(a0+(a1-a0)*k)*D2R,-a0*D2R);ctx.stroke();
  if(label&&k>0.6){const am=(a0+a1)/2*D2R,R=lr||r+34;ctx.globalAlpha*=prog(t,t0+0.3,0.3);ctx.font=HF(ls||44);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,c[0]+Math.cos(am)*R,c[1]-Math.sin(am)*R)}ctx.restore()})}
function rsq(s,t0,c,u,v,sz){custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;sz=sz||38;const p1=[c[0]+u[0]*sz,c[1]+u[1]*sz],p2=[p1[0]+v[0]*sz,p1[1]+v[1]*sz],p3=[c[0]+v[0]*sz,c[1]+v[1]*sz];ctx.save();ctx.globalAlpha=k;hline(p1[0],p1[1],p2[0],p2[1],C.ink,3,1);hline(p2[0],p2[1],p3[0],p3[1],C.ink,3,1);ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(c[0]+(u[0]+v[0])*sz*0.5,c[1]+(u[1]+v[1])*sz*0.5,4.5,0,7);ctx.fill();ctx.restore()})}
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};const D2R=Math.PI/180;const CA_=C.blue,CB_=C.org,CC_=C.red;
const CHAPS=[[2,'Level 1','× ÷ before + −'],[11,'Level 2','Parentheses & exponents'],[20,'Level 3','The PEMDAS trap'],[27,'Finale','The internet problem'],[35,'','The 4 most common mistakes']];
const PUR='#0E9AA7';
// level heading: coloured badge + title (purple accent, different from chapter style)
function headingV(s,t0,badge,title,col){col=col||PUR;custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const sc=lerp(0.5,1,backK(eo(k)));ctx.save();ctx.font='800 34px Inter';const bw=ctx.measureText(badge).width+44;ctx.translate(170+bw/2,140);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(-bw/2,-30,bw,60,30);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(badge,0,2);ctx.restore()});WRITES.push([t0,0.3]);
 ctx.font='800 34px Inter';const bw=ctx.measureText(badge).width+44;const w=note(s,t0+0.25,170+bw+28,150,title,78,col);el(t0+0.7,t=>{const k=eo(prog(t,t0+0.7,0.6));if(k>0)hline(170+bw+28,196,170+bw+28+tw(title,78),196,col,4,k,7)},{sec:s});return w}
// sticky note
function sticky(s,t0,x,y,w,h,rot,col){custom(s,t0,t=>{const k=prog(t,t0,0.4);if(k<=0)return;const sc=lerp(0.6,1,backK(eo(k)));ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,k*2);ctx.shadowColor='rgba(0,0,0,0.18)';ctx.shadowBlur=18;ctx.shadowOffsetY=8;ctx.fillStyle=col||'#FFE97A';ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fillRect(-w/2,-h/2,w,22);ctx.restore()});WRITES.push([t0,0.3])}
// hand-drawn ring around a token rect
function ring(s,t0,r,col){WRITES.push([t0,0.4]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;const cx=r[0]+r[2]/2,cy=r[1]+r[3]/2,rx=r[2]/2+8,ry=r[3]/2+6;ctx.save();ctx.strokeStyle=col||C.org;ctx.lineWidth=4.5;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<=60*k;i++){const a=-Math.PI*0.6+i/60*Math.PI*2.15,wob=1+0.03*Math.sin(i*1.7);const px=cx+Math.cos(a)*rx*wob,py=cy+Math.sin(a)*ry*wob;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();ctx.restore()})}
function tipBox(s,t0,x,y,w,h){custom(s,t0,t=>{const k=eo(prog(t,t0,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(255,224,70,0.30)';ctx.beginPath();ctx.roundRect(x,y,w*k,h,18);ctx.fill();ctx.restore();hrect(x,y,w,h,'#C9A000',3.5,k)})}
function pill(s,t0,x,y,w,txt,col){custom(s,t0,t=>{const k=prog(t,t0,0.4);if(k<=0)return;const sc=lerp(0.5,1,backK(eo(k)));ctx.save();ctx.translate(x+w/2,y);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.globalAlpha=0.16;ctx.beginPath();ctx.roundRect(-w/2,-42,w,84,22);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();ctx.font=HF(52);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ftm(txt,0,4);ctx.restore()});WRITES.push([t0,0.3])}
// ---------- S0 HOOK ----------
{const s=0;
 note(s,0.1,170,150,'The internet is fighting:',80,PUR);custom(s,0.6,t=>{const k=eo(prog(t,0.6,0.6));if(k>0)hline(170,196,170+tw('The internet is fighting:',80),196,PUR,4,k)});
 note(s,0.2,230,410,'6 ÷ 2(1 + 2) = ?',150,C.ink);
 sticky(s,Wd(0,'one or')-0.2,1250,280,240,220,-0.06,'#BFE3FF');note(s,Wd(0,'one or'),1370,400,'1 ?',110,C.blue,{align:'c'});
 sticky(s,Wd(0,'nine')-0.2,1560,300,240,220,0.05,'#FFD9A8');note(s,Wd(0,'nine'),1680,420,'9 ?',110,C.org,{align:'c'});
 note(s,Wd(0,'whole internet')-0.2,230,580,'💬 Millions of comments – who is right?',58,'#7A869A');
 pill(s,Wd(1,'three levels')-0.2,230,720,420,'Level 1',C.green);pill(s,Wd(1,'three levels')+0.3,690,720,420,'Level 2',C.blue);pill(s,Wd(1,'three levels')+0.8,1150,720,420,'Level 3',PUR);
 note(s,Wd(1,'adults')-0.3,230,860,'🤯 Finale: the problem even adults get wrong',56,C.red);
}
// ---------- S1 LEVEL 1 ----------
camTo(E(2,-0.7),1);
{const s=1;headingV(s,E(2,0.1),'LEVEL 1','× ÷ before + −',C.green);
 note(s,Wd(3,'What is')-0.1,230,330,'3 + 4 × 2 = ?',90,C.ink);
 note(s,Wd(3,'three plus four is')-0.2,230,450,'(3 + 4) × 2 = 14',62,'#9AA4B5');cross(s,Wd(3,'Sadly')-0.1,230+tw('(3 + 4) × 2 = 14',62)+50,450,26);
 note(s,Wd(4,'strong operations')-0.6,1100,320,'strong:   ×   and   ÷',62,C.green);
 note(s,Wd(4,'weak ones')-0.6,1100,410,'weak:   +   and   −',62,C.blue);
 const w=write(s,[E(5,0),Wd(5,'first four')-0.1,Wd(5,'Then three')-0.1,Wd(5,'Result')-0.1],230,590,['3 +','4 × 2','= 3 + 8','= 11'],80,C.ink,{cols:[C.ink,C.green,C.ink,C.green]});
 ring(s,Wd(5,'first four')+0.1,tokRect(w,1,1,4),C.org);marker(s,Wd(5,'eleven')+0.2,tokRect(w,3,3,6));
 note(s,Wd(6,'pen')-0.2,230,730,'✏️ $1   +   3 × 📒 $2 each',60,C.ink);
 const w2=write(s,[Wd(6,'one plus three')-0.1,Wd(7,'three times two')-0.1,Wd(7,'Plus the pen')-0.1],230,850,['1 + 3 × 2','= 1 + 6','= $7'],70,C.ink);
 check(s,Wd(7,'real life')-0.2,230+tw('1 + 3 × 2 = 1 + 6 = $7',70)+50,850,26);note(s,Wd(7,'real life')-0.2,1150,850,'rule = real life ✓ ',56,C.green);
}
// ---------- S2 LEVEL 1: Quiz + Tipp ----------
camTo(E(8,-0.6),2);
{const s=2;headingV(s,E(8,-0.3),'LEVEL 1','Mini quiz',C.green);
 sticky(s,E(8,0),230,270,720,330,-0.03);note(s,E(8,0.2),280,345,'Mini quiz! 🧠',62,'#8A6A00');note(s,Wd(8,'ten minus')-0.1,280,490,'10 − 2 × 3 = ?',96,C.ink);
 const w=write(s,[E(9,0),E(9,0),Wd(9,'Then ten')-0.1,Wd(9,'Result')-0.1],1080,380,['10 −','2 × 3','= 10 − 6','= 4'],76,C.ink,{cols:[C.ink,C.green,C.ink,C.green]});
 ring(s,E(9,0.3),tokRect(w,1,1,4),C.org);marker(s,Wd(9,'Result')+0.3,tokRect(w,3,3,6));
 note(s,Wd(9,'Not twenty')-0.2,1080,510,'not 24!',64,C.red);cross(s,Wd(9,'Not twenty')+0.3,1080+tw('not 24!',64)+45,510,24);
 tipBox(s,Wd(10,'Pro tip')-0.3,210,690,1500,200);note(s,Wd(10,'Pro tip')-0.1,250,745,'💡 Pro tip: circle every × and ÷ first!',56,'#9A7A00');
 const w2=write(s,[Wd(10,'circle every')-0.1],250,840,['5 +','3 × 4','−','6 ÷ 2'],70,C.ink);ring(s,Wd(10,'and division')-0.2,tokRect(w2,1,1,4),C.org);ring(s,Wd(10,'and division')+0.4,tokRect(w2,3,3,4),C.org);
 note(s,Wd(10,'instantly')-0.2,900,840,'→ you instantly see what comes first',52,C.green);
}
// ---------- S3 LEVEL 2 ----------
camTo(E(11,-0.7),3);
{const s=3;headingV(s,E(11,0.1),'LEVEL 2','Parentheses & exponents',C.blue);
 note(s,Wd(12,'beat everything')-0.4,230,320,'( Parentheses ) beat everything!',64,C.blue);
 note(s,E(13,0),230,440,'without:',50,'#7A869A');note(s,E(13,0.3),230,520,'3 + 4 × 2 = 11',72,C.ink);
 note(s,E(13,0),1050,440,'with parentheses:',50,'#7A869A');
 const w=write(s,[E(13,0.3),Wd(13,'come first: seven')-0.1,Wd(13,'times two: fourteen')-0.1],1050,520,['(3 + 4) × 2','= 7 × 2','= 14'],72,C.ink,{cols:[C.blue,C.ink,C.green]});
 ring(s,Wd(13,'come first: seven')-0.2,[1050,470,tw('(3 + 4)',72),100],C.blue);
 const w2=write(s,[E(14,0.2),Wd(14,'two plus nine')-0.1,Wd(14,'so eleven')-0.1],230,660,['2 + 3^2','= 2 + 9','= 11'],72,C.ink,{cols:[C.ink,PUR,C.green]});
 note(s,Wd(14,'Not five')-0.2,1050,660,'≠ 5^2 = 25',64,C.red);cross(s,Wd(14,'Not five')+0.3,1050+tw('≠ 5^2 = 25',64)+45,660,24);
 const P=[['P  ( )',C.blue],['E  x^2',PUR],['MD  × ÷',C.green],['AS  + −',C.org]];
 P.forEach(([txt,col],i)=>{pill(s,Wd(15,'full order')+i*0.6,230+i*390,800,340,txt,col);if(i<3)note(s,Wd(15,'full order')+i*0.6+0.4,230+i*390+347,805,'→',50,'#7A869A')});
}
// ---------- S4 LEVEL 2: alles zusammen ----------
camTo(E(16,-0.7),4);
{const s=4;headingV(s,E(16,-0.3),'LEVEL 2','Everything together',C.blue);
 note(s,E(16,0.3),230,330,'20 − (2 + 1) × 2^2',90,C.ink);
 const st=[[Wd(17,'First the parentheses'),'= 20 − 3 × 2^2','P: parentheses',C.blue],[Wd(17,'Then the exponent'),'= 20 − 3 × 4','E: exponent',PUR],[Wd(17,'Then multiply'),'= 20 − 12','M: multiply',C.green],[Wd(17,'Result'),'= 8','S: subtract',C.org]];
 st.forEach(([t0,str,lb,col],i)=>{const y=450+i*105;note(s,t0-0.1,230,y,str,72,i==3?C.green:C.ink);note(s,t0,760,y,lb,50,col)});
 boxE(s,Wd(17,'eight')+0.2,[215,720,tw('= 8',72)+30,96],C.green,5);
 sticky(s,E(18,-0.2),1150,280,640,330,0.03);note(s,E(18,0),1200,350,'Mini quiz! 🧠',58,'#8A6A00');note(s,Wd(18,'five minus')-0.1,1200,500,'(5 − 3)^3 + 1 = ?',80,C.ink);
 const w=write(s,[E(19,0),Wd(19,'Exponent')-0.1,Wd(19,'Plus one')-0.1],1170,720,['= 2^3 + 1','= 8 + 1','= 9'],66,C.ink,{cols:[C.ink,C.ink,C.green]});
 marker(s,LE(19)-0.1,tokRect(w,2,2,6));
}
// ---------- S5 LEVEL 3 ----------
camTo(E(20,-0.7),5);
{const s=5;headingV(s,E(20,0.1),'LEVEL 3','The PEMDAS trap',PUR);
 note(s,Wd(21,'eight divided')-0.2,230,340,'8 ÷ 2 × 2 = ?',100,C.ink);
 note(s,E(22,0),230,480,'8 ÷ (2 × 2) = 8 ÷ 4 = 2',64,'#9AA4B5');cross(s,Wd(22,'wrong')-0.2,230+tw('8 ÷ (2 × 2) = 8 ÷ 4 = 2',64)+50,480,26);
 note(s,Wd(23,'equally strong')-0.2,230,610,'×  and  ÷  equally strong  →  left to right',60,PUR);
 custom(s,Wd(23,'left to right')-0.1,t=>{const k=eo(prog(t,Wd(23,'left to right')-0.1,0.7));if(k<=0)return;hline(240,675,240+900*k,675,PUR,5,1,3);if(k>0.95){hline(1140,675,1115,660,PUR,5,1);hline(1140,675,1115,690,PUR,5,1)}});
 const w=write(s,[Wd(23,'Eight divided')-0.1,Wd(23,'is four')-0.1,Wd(23,'times two is eight')+0.2],230,790,['8 ÷ 2 × 2','= 4 × 2','= 8'],84,C.ink,{cols:[C.ink,C.ink,C.green]});
 ring(s,Wd(23,'Eight divided')+0.2,[230,740,tw('8 ÷ 2',84),100],C.org);marker(s,LE(23)-0.1,tokRect(w,2,2,6));
}
// ---------- S6 CTA ----------
camTo(E(24,-0.7),6);
{const s=6;
 note(s,E(24,0.0),W/2,230,'Quick break! ✋',110,C.red,{align:'c'});
 const btn=(t0,x,y,w,col,txt,ts)=>{custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle=col;ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-w/2,-70,w,140,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(ts||76);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)};
 btn(Wd(24,'like')-0.2,620,470,420,'#1D6FE0','👍 Like',80);
 btn(Wd(24,'subscribe')-0.2,1300,470,520,'#E8344E','🔔 Subscribe',76);
 note(s,Wd(24,'Every week')-0.4,W/2,660,'New math topics every week – explained simply',62,C.ink,{align:'c'});
 note(s,Wd(24,'tips')-0.4,W/2,750,'+ tips for your next test ✏️',58,C.green,{align:'c'});
 note(s,Wd(24,'keep going')-0.6,W/2,860,'Let’s keep going  →',60,C.blue,{align:'c'});
}
// ---------- S7 LEVEL 3 cont ----------
camTo(E(25,-0.7),7);
{const s=7;headingV(s,E(25,-0.3),'LEVEL 3','Same with + and −',PUR);
 const w=write(s,[Wd(25,'ten minus three plus')-0.1,Wd(25,'is seven')-0.1,Wd(25,'is nine')-0.1],230,340,['10 − 3 + 2','= 7 + 2','= 9'],84,C.ink,{cols:[C.ink,C.ink,C.green]});
 marker(s,Wd(25,'Not five')-0.1,tokRect(w,2,2,6));
 note(s,Wd(25,'Not five')-0.2,230,470,'10 − (3 + 2) = 5',64,'#9AA4B5');cross(s,Wd(25,'Not five')+0.2,230+tw('10 − (3 + 2) = 5',64)+50,470,26);
 tipBox(s,Wd(26,'Pro tip')-0.3,210,580,1500,320);note(s,Wd(26,'Pro tip')-0.1,250,640,'💡 Pro tip:  division  =  fraction',60,'#9A7A00');
 const w2=write(s,[Wd(26,'Eight divided')-0.1,Wd(26,'eight over two')-0.1,Wd(26,'instantly')-0.1],250,790,['8 ÷ 2 × 2','= ',F('8','2'),'× 2','= 8'],76,C.ink);
}
// ---------- S8 FINALE ----------
camTo(E(27,-0.7),8);
{const s=8;headingV(s,E(27,0.1),'FINALE','The internet problem 🤯',C.red);
 const w=write(s,[E(28,0),E(28,0)],230,340,['6 ÷ 2','(1 + 2)'],110,C.ink,{cols:[C.ink,C.blue]});
 ring(s,Wd(28,'First the parentheses')-0.1,tokRect(w,1,1,4),C.blue);note(s,Wd(28,'is three')-0.2,800,340,'1 + 2 = 3',64,C.blue);
 note(s,E(29,0),230,480,'= 6 ÷ 2 × 3',84,C.ink);note(s,Wd(29,'Only multiplication')-0.2,900,480,'only × ÷ → left to right  ⟶',58,PUR);
 const w2=write(s,[Wd(30,'Six divided')-0.1,Wd(30,'Three times three')-0.1],230,620,['= 3 × 3','= 9'],84,C.ink,{cols:[C.ink,C.green]});
 marker(s,Wd(30,'standard rule')-0.2,tokRect(w2,1,1,6));note(s,Wd(30,'standard rule')-0.2,900,620,'standard rule:  9  ✓ ',64,C.green);
 sticky(s,E(31,-0.2),210,710,1500,190,0.005,'#FFD9C2');note(s,E(31,0.1),250,760,'Why do so many say 1? 🤔',58,C.red);
 note(s,Wd(31,'one block')-0.2,250,850,'they do  6 ÷ [2 × 3]  =  6 ÷ 6  =  1',60,C.org);
}
// ---------- S9 FINALE cont ----------
camTo(E(32,-0.7),9);
{const s=9;headingV(s,E(32,-0.3),'FINALE','Who is right?',C.red);
 note(s,E(32,0.1),230,320,'⚠️ written in a confusing way on purpose',62,C.red);
 note(s,Wd(32,'calculators')-0.2,230,410,'some calculators: 2(…) first  →  1',56,'#7A869A');
 note(s,E(33,0.1),230,530,'How pros write it clearly:',60,C.ink);
 write(s,[Wd(33,'fraction bar')-0.1,Wd(33,'fraction bar')+0.2],230,690,[F('6','2'),'× (1 + 2) = 9'],76,C.green);
 write(s,[Wd(33,'more parentheses')-0.1,Wd(33,'more parentheses')+0.2],1050,690,[F('6','2 × (1 + 2)'),'= 1'],76,C.org);
 const w=write(s,[E(34,0)],230,860,['standard rule → 9'],80,C.green);boxE(s,E(34,0.8),tokRect(w,0,0,14),C.green,5);
 note(s,Wd(34,'explain')-0.3,980,860,'🧠 Now you can explain it to anyone!',56,PUR);
}
// ---------- S10 FEHLER ----------
camTo(E(35,-0.7),10);
{const s=10;headingE(s,E(35,0.1),0,'The 4 most common mistakes');
 const row=(y,num,tNum,wrongT,wrongS,crossT,rightT,rightS,checkT)=>{note(s,tNum,170,y,num,62,C.red);note(s,wrongT,290,y,wrongS,62,C.ink);const wx=290+tw(wrongS,62);cross(s,crossT,wx+52,y,26);
   const x2=wx+115;note(s,rightT,x2,y,rightS,62,C.green);check(s,checkT,x2+tw(rightS,62)+45,y,24)};
 row(310,'#1',E(36,0),Wd(36,'Two plus')-0.3,'2 + 3 × 4 = 20',Wd(36,'not twenty')-0.1,Wd(36,'fourteen')-0.2,'→  14',LE(36)-0.1);
 row(460,'#2',E(37,0),Wd(37,'Two times')-0.3,'2 × 3^2 = 36',Wd(37,'not thirty')-0.1,Wd(37,'eighteen')-0.2,'→  18',LE(37)-0.1);
 row(610,'#3',E(38,0),Wd(38,'Twelve')-0.3,'12 ÷ 3 × 2 = 2',Wd(38,'not two')-0.1,Wd(38,'is eight')-0.2,'→  8',LE(38)-0.1);
 row(760,'#4',E(39,0),Wd(39,'Ten minus')-0.3,'10 − (3 + 2) = 9',Wd(39,'not nine')-0.1,Wd(39,'is five')-0.2,'→  5',LE(39)-0.1);
 const tip=[[E(36,0.3),'just left to right'],[E(37,0.3),'forgot the exponent'],[E(38,0.3),'× always before ÷'],[E(39,0.3),'missed the minus']];
 tip.forEach(([t0,str],i)=>note(s,t0,1200,310+i*150,str,48,'#7A869A'));
}
// ---------- S11 Übung ----------
camTo(E(40,-0.7),11);
{const s=11;headingE(s,E(40,0.1),0,'Your turn! ✏️');
 note(s,Wd(40,'Pause'),1150,150,'⏸ Pause the video!',60,C.blue);
 const T=[[Wd(41,'Problem',1),'a)','5 + 3 × 4 = ?'],[Wd(41,'Problem',2),'b)','(6 − 2)^2 ÷ 8 = ?'],[Wd(41,'Problem',3),'c)','18 ÷ 3 × 3 = ?']];
 T.forEach(([t0,lb,str],i)=>{const y=310+i*200;note(s,t0,200,y,lb,70,C.red);note(s,t0+0.6,310,y,str,68,C.ink)});
 const T0=LE(41)+0.3,T1=E(42,-0.3);
 custom(s,T0-0.3,t=>{const a=prog(t,T0-0.3,0.4)*(1-prog(t,T1,0.4));if(a<=0)return;const k=clamp((t-T0)/(T1-T0),0,1);ctx.save();ctx.globalAlpha=a;const cx=1620,cy=530,r=130;
   ctx.fillStyle='rgba(155,89,208,0.16)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();hcircle(cx,cy,r,PUR,4,1);
   ctx.font=HF(110);ctx.fillStyle=PUR;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.max(1,Math.ceil((1-k)*15))),cx,cy+6);ctx.font=HF(50);ctx.fillText('Think!',cx,cy+r+50);ctx.restore()});
 const SOL=[[Wd(42,'three times four')-0.2,'= 5 + 12 = 17',LE(42)],[Wd(43,'parentheses give')-0.2,'= 4^2 ÷ 8 = 16 ÷ 8 = 2',LE(43)],[Wd(44,'Eighteen divided')-0.2,'= 6 × 3 = 18',LE(44)]];
 SOL.forEach(([t0,str,tc],i)=>{const y=310+i*200+85;note(s,t0,310,y,str,60,C.green);check(s,tc-0.2,310+tw(str,60)+40,y,26)});
 note(s,Wd(45,'comments')-0.6,200,860,'All correct?  →  tell me in the comments 💬',56,C.blue);
 sticky(s,Wd(45,'internet problem')-0.4,1330,700,420,130,-0.04,'#FFE97A');note(s,Wd(45,'internet problem')-0.2,1540,775,'1 or 9? 👇',62,C.ink,{align:'c'});
}
// ---------- S12 Summary ----------
camTo(E(46,-0.7),12);
{const s=12;headingE(s,E(46,0.1),0,'Quick summary');
 const B=[[Wd(46,'parentheses first')-0.2,'P  Parentheses  ( )',C.blue],[Wd(46,'exponents')-0.2,'E  Exponents  x^2',PUR],[Wd(46,'multiplication and')-0.2,'MD  Multiply / Divide  × ÷',C.green],[Wd(46,'addition and')-0.2,'AS  Add / Subtract  + −',C.org],[Wd(46,'equal operations')-0.2,'⟶  equal operations: left to right',C.ink]];
 B.forEach(([t0,str,col],i)=>note(s,t0,230,310+i*95,str,60,col));
 camTo(E(47,-0.4),12,180);
 custom(s,E(47,0),t=>{const k=eo(prog(t,E(47,0),0.6));if(k>0)hrect(230,850,1050,260,C.ink,3.5,k)});
 note(s,E(47,0.2),270,905,'Next video:',56,C.ink);
 note(s,Wd(47,'percentages')-0.3,270,980,'Percentages',62,C.blue);
 note(s,Wd(47,'goes up')-0.3,270,1060,'+20 %  then  −20 %  =  same? 🤔',60,C.red);
 custom(s,Wd(47,'Subscribe')-0.2,t=>{const k=prog(t,Wd(47,'Subscribe')-0.2,0.4);if(k<=0)return;const pu=1+0.04*Math.sin(t*7);ctx.save();ctx.translate(1550,980);ctx.rotate(-0.05);ctx.scale(lerp(0.5,1,eo(k))*pu,lerp(0.5,1,eo(k))*pu);ctx.fillStyle='#E8344E';ctx.beginPath();ctx.roundRect(-230,-62,460,124,20);ctx.fill();ctx.font=HF(72);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Subscribe',0,6);ctx.restore()});
 note(s,Wd(47,'See you')-0.1,1350,860,'See you! 👋',70,C.green);
}
