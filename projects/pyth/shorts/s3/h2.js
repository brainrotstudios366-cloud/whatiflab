// ===== PORTRAIT SHORT (1080x1920) – safe zone x 60..960, y 230..1420; captions at y 1430 =====
const SECH=[1920];const SECY=[0];const CAM=[[0,0]];const CHAPS=[];
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
function stamp(s,t0,x,y,txt,size,col,rot){CK.length;XS.push(t0);custom(s,t0,t=>{const k=prog(t,t0,0.35);if(k<=0)return;const sc=lerp(2.2,1,eo(k));ctx.save();ctx.globalAlpha=Math.min(1,k*2);ctx.translate(x,y);ctx.rotate(rot||-0.12);ctx.scale(sc,sc);ctx.font=HF(size);const w=ctx.measureText(txt).width;ctx.strokeStyle=col;ctx.lineWidth=7;ctx.strokeRect(-w/2-24,-size*0.62,w+48,size*1.2);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,4);ctx.restore()})}
function ctaBtn(s,t0){custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(540,1650);ctx.scale(sc,sc);ctx.fillStyle='#E8344E';ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-380,-62,760,124,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(70);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Folge für mehr Tricks',0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)}
function brand(s){custom(s,-1,t=>{ctx.save();ctx.font='800 34px Inter';ctx.fillStyle='rgba(29,59,110,0.75)';ctx.textAlign='center';ctx.fillText('√ Wurzelwerk.Mathe',540,150);ctx.restore()})}
function numline(s,t0,o){WRITES.push([t0,0.7]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.7));if(k<=0)return;const{cx,y,u,mn,mx}=o;const X0=cx+mn*u-30,X1=cx+mx*u+30;hline(X0,y,X0+(X1-X0)*k,y,C.ink,4);
  if(k<1)return;hline(X1,y,X1-16,y-9,C.ink,4);hline(X1,y,X1-16,y+9,C.ink,4);ctx.save();ctx.font=HF(38);ctx.textAlign='center';ctx.textBaseline='top';
  for(let v=mn;v<=mx;v++){const x=cx+v*u;hline(x,y-12,x,y+12,C.ink,v?3:5);ctx.fillStyle=v<0?C.red:v>0?C.blue:C.ink;ctx.fillText(String(v).replace('-','−'),x,y+20)}ctx.restore()})}
function jumps(s,t0,o,start,step,n,col,per){per=per||0.4;for(let i=0;i<n;i++){const ti=t0+i*per,a=start+i*step,b=a+step;WRITES.push([ti,0.3]);custom(s,ti,t=>{const k=eo(prog(t,ti,0.35));if(k<=0)return;const x1=o.cx+a*o.u,x2=o.cx+b*o.u,mx=(x1+x2)/2,h=Math.abs(x2-x1)*0.7;
  ctx.save();ctx.strokeStyle=col;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();const N=20;let px,py,qx,qy;for(let j=0;j<=Math.round(N*k);j++){const f=j/N;const x=(1-f)*(1-f)*x1+2*(1-f)*f*mx+f*f*x2,y=(1-f)*(1-f)*o.y+2*(1-f)*f*(o.y-h*2)+f*f*o.y;qx=px;qy=py;px=x;py=y;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  if(k>0.95&&qx!=null){const an=Math.atan2(py-qy,px-qx);hline(px,py,px-16*Math.cos(an-0.45),py-16*Math.sin(an-0.45),col,4);hline(px,py,px-16*Math.cos(an+0.45),py-16*Math.sin(an+0.45),col,4)}ctx.restore()})}}
function ndot(s,t0,o,v,col){WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.35));if(k<=0)return;ctx.save();ctx.fillStyle=col;ctx.beginPath();ctx.arc(o.cx+v*o.u,o.y,15*backK(k),0,7);ctx.fill();ctx.restore()})}
function seg(s,t0,p,q,col,lw,dur){WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{const k=eo(prog(t,t0,dur||0.5));if(k>0)hline(p[0],p[1],q[0],q[1],col||C.ink,lw||4,k,p[0]*0.3+q[1])})}
const lab=(s,t0,x,y,str,size,col,o)=>note(s,t0,x,y,str,size||48,col||C.ink,Object.assign({align:'c'},o||{}));
function hi(s,t0,p,q,col,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,0.45));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=0.28;ctx.strokeStyle=col;ctx.lineWidth=o.w||22;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore();if(k>0.99||o.line){ctx.save();ctx.globalAlpha=Math.min(1,k);hline(p[0],p[1],q[0],q[1],col,o.lw||5.5,1,p[0]+q[0]);ctx.restore()}})}
function rsq(s,t0,c,u,v,sz){custom(s,t0,t=>{const k=eo(prog(t,t0,0.4));if(k<=0)return;sz=sz||38;const p1=[c[0]+u[0]*sz,c[1]+u[1]*sz],p2=[p1[0]+v[0]*sz,p1[1]+v[1]*sz],p3=[c[0]+v[0]*sz,c[1]+v[1]*sz];ctx.save();ctx.globalAlpha=k;hline(p1[0],p1[1],p2[0],p2[1],C.ink,3,1);hline(p2[0],p2[1],p3[0],p3[1],C.ink,3,1);ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(c[0]+(u[0]+v[0])*sz*0.5,c[1]+(u[1]+v[1])*sz*0.5,4.5,0,7);ctx.fill();ctx.restore()})}
function tri(s,t0,P,dur,cols){dur=dur||0.45;seg(s,t0,P[0],P[1],cols?cols[0]:C.ink,4,dur);seg(s,t0+dur,P[1],P[2],cols?cols[1]:C.ink,4,dur);seg(s,t0+2*dur,P[2],P[0],cols?cols[2]:C.ink,4,dur)}
const D2R=Math.PI/180;const CA_=C.blue,CB_=C.org,CC_=C.red;
// filled polygon helper
function poly(s,t0,P,fill,o){o=o||{};custom(s,t0,t=>{let k=eo(prog(t,t0,o.dur||0.5));if(o.tOut!=null)k*=1-prog(t,o.tOut,0.5);if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle=fill;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
  if(o.stroke){ctx.strokeStyle=o.stroke;ctx.lineWidth=3;ctx.stroke()}
  if(o.grid){const[n,A,B,D]=o.grid;ctx.strokeStyle='rgba(29,59,110,0.45)';ctx.lineWidth=1.6;for(let i=1;i<n;i++){const f=i/n;ctx.beginPath();ctx.moveTo(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f);ctx.lineTo(D[0]+(B[0]-A[0])*f,D[1]+(B[1]-A[1])*f);ctx.stroke();ctx.beginPath();ctx.moveTo(A[0]+(D[0]-A[0])*f,A[1]+(D[1]-A[1])*f);ctx.lineTo(B[0]+(D[0]-A[0])*f,B[1]+(D[1]-A[1])*f);ctx.stroke()}}
  if(o.label){ctx.font=HF(o.ls||48);ctx.fillStyle=o.lc||C.ink;ctx.textAlign='center';ctx.textBaseline='middle';const cx=P.reduce((a,p)=>a+p[0],0)/P.length,cy=P.reduce((a,p)=>a+p[1],0)/P.length;ftm(o.label,cx,cy)}ctx.restore()})}
// rearrangement proof: big square at (X,Y), legs a,b (units), scale u
function proof(s,o){const{X,Y,a,b,u,tIn,tC,tMove,tAB,tEnd}=o;const L=(a+b)*u,A=a*u,B=b*u;
 seg(s,tIn,[X,Y],[X+L,Y],C.ink,4,0.4);seg(s,tIn+0.2,[X+L,Y],[X+L,Y+L],C.ink,4,0.4);seg(s,tIn+0.4,[X+L,Y+L],[X,Y+L],C.ink,4,0.4);seg(s,tIn+0.6,[X,Y+L],[X,Y],C.ink,4,0.4);
 custom(s,tIn+0.8,t=>{const k=eo(prog(t,tIn+0.8,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.font=HF(40);ctx.textAlign='center';ctx.fillStyle=CA_;ctx.fillText('a',X+A/2,Y-18);ctx.fillStyle=CB_;ctx.fillText('b',X+A+B/2,Y-18);ctx.fillStyle=CA_;ctx.fillText('a',X-26,Y+B+A/2+12);ctx.fillStyle=CB_;ctx.fillText('b',X-26,Y+B/2+12);hline(X+A,Y-12,X+A,Y+12,C.ink,3,1);hline(X-12,Y+B,X+12,Y+B,C.ink,3,1);ctx.restore()});
 // c^2 inner square (config A) & a^2, b^2 (config B)
 const P=(x,y)=>[X+x*u,Y+y*u],Lu=a+b;
 poly(s,tC,[P(a,0),P(Lu,a),P(b,Lu),P(0,b)],'rgba(214,58,58,0.28)',{tOut:tMove,label:'c^2',ls:64,lc:CC_});
 poly(s,tAB,[P(0,0),P(a,0),P(a,a),P(0,a)],'rgba(77,163,255,0.4)',{label:'a^2',ls:52,lc:CA_});
 poly(s,tAB+0.3,[P(a,a),P(Lu,a),P(Lu,Lu),P(a,Lu)],'rgba(255,159,67,0.4)',{label:'b^2',ls:64,lc:CB_});
 // triangles: [P0,ang0] -> [P1,ang1]; a-leg dir angle, b-leg = a rotated +90 (y-down)
 const T=[[[0,0],0,[a,a],-90],[[Lu,0],90,[Lu,0],90],[[Lu,Lu],180,[a,Lu],180],[[0,Lu],-90,[0,a],0]];
 T.forEach(([p0,a0,p1,a1],i)=>{const ti=tIn+1.0+i*0.25;WRITES.push([ti,0.3]);custom(s,ti,t=>{const k=eo(prog(t,ti,0.4));if(k<=0)return;const m=eio(prog(t,tMove+i*0.15,1.6));const px=lerp(p0[0],p1[0],m),py=lerp(p0[1],p1[1],m),an=lerp(a0,a1,m)*D2R;
   const O=P(px,py),va=[Math.cos(an),Math.sin(an)],vb=[-va[1],va[0]];const Pa=[O[0]+va[0]*A,O[1]+va[1]*A],Pb=[O[0]+vb[0]*B,O[1]+vb[1]*B];
   ctx.save();ctx.globalAlpha=k;ctx.fillStyle='rgba(38,194,129,0.35)';ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(Pa[0],Pa[1]);ctx.lineTo(Pb[0],Pb[1]);ctx.closePath();ctx.fill();ctx.strokeStyle=C.green;ctx.lineWidth=3.5;ctx.stroke();ctx.restore()})});
 if(tEnd)custom(s,tEnd,t=>{const k=eo(prog(t,tEnd,0.5));if(k<=0)return;hrect(X-10,Y-10,L+20,L+20,C.green,5,k)});
}
// triangle with squares on sides (3-4-5), right angle at Cc, a up, b right
function sqTri(s,o){const{cx,cy,u,t0,ta,tb,tc}=o;const Cc=[cx,cy],Bv=[cx,cy-3*u],Av=[cx+4*u,cy];
 tri(s,t0,[Cc,Av,Bv],0.35,[CB_,CC_,CA_]);rsq(s,t0+1,Cc,[1,0],[0,-1],26);
 poly(s,ta,[[cx-3*u,cy-3*u],[cx,cy-3*u],[cx,cy],[cx-3*u,cy]],'rgba(77,163,255,0.35)',{stroke:CA_,grid:[3,[cx-3*u,cy-3*u],[cx,cy-3*u],[cx-3*u,cy]],label:'9',ls:56,lc:CA_});
 poly(s,tb,[[cx,cy],[cx+4*u,cy],[cx+4*u,cy+4*u],[cx,cy+4*u]],'rgba(255,159,67,0.35)',{stroke:CB_,grid:[4,[cx,cy],[cx+4*u,cy],[cx,cy+4*u]],label:'16',ls:56,lc:CB_});
 const n=[3*u,-4*u];const Q=[Bv,Av,[Av[0]+n[0],Av[1]+n[1]],[Bv[0]+n[0],Bv[1]+n[1]]];
 poly(s,tc,Q,'rgba(214,58,58,0.28)',{stroke:CC_,grid:[5,Bv,Av,Q[3]],label:'25',ls:60,lc:CC_});
}
{const s=0;brand(s);
 note(s,-1,540,390,'55" = 55" breit ?',130,C.ink,{align:'c'});
 stamp(s,Wd(0,'FALSCH')-0.15,540,600,'FALSCH!',120,C.red,-0.12);
 const X=120,Y=760,Wt=840,Ht=472;
 custom(s,E(1,-0.5),t=>{const k=eo(prog(t,E(1,-0.5),0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#1b2333';ctx.beginPath();ctx.roundRect(X-16,Y-16,Wt+32,Ht+32,16);ctx.fill();const g=ctx.createLinearGradient(X,Y,X+Wt,Y+Ht);g.addColorStop(0,'#2b5a9e');g.addColorStop(1,'#7cc4ff');ctx.fillStyle=g;ctx.fillRect(X,Y,Wt,Ht);ctx.restore()});WRITES.push([E(1,-0.5),0.5]);
 seg(s,Wd(1,'Diagonale')-0.3,[X,Y+Ht],[X+Wt,Y],C.red,7,0.6);note(s,Wd(1,'Diagonale'),X+Wt/2+40,Y+Ht/2-50,'55"',80,'#fff');
 note(s,Wd(2,'sechzehn')-0.3,X+Wt/2,Y-50,'16 : 9',56,C.ink,{align:'c'});
 custom(s,Wd(2,'achtundvierzig')-0.4,t=>{const k=eo(prog(t,Wd(2,'achtundvierzig')-0.4,0.5));if(k<=0)return;ctx.save();ctx.globalAlpha=k;hline(X,Y+Ht+50,X+Wt,Y+Ht+50,C.green,5,1);hline(X,Y+Ht+35,X,Y+Ht+65,C.green,5,1);hline(X+Wt,Y+Ht+35,X+Wt,Y+Ht+65,C.green,5,1);ctx.restore()});
 note(s,Wd(2,'achtundvierzig')-0.2,540,1340,'Breite ≈ 48"',90,C.green,{align:'c',tOut:E(3,-0.2)});
 const w=write(s,[Wd(3,'hundertzweiundzwanzig')-0.4],540,1340,['≈ 122 cm breit'],90,C.green,{align:'c'});boxE(s,Wd(3,'Miss')-0.1,tokRect(w,0,0,14),C.green,5);
 ctaBtn(s,E(4,0));
}
