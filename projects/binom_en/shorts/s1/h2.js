// ===== PORTRAIT SHORT (1080x1920) – safe zone x 60..960, y 230..1420; captions at y 1430 =====
const SECH=[1920];const SECY=[0];const CAM=[[0,0]];const CHAPS=[];
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
function stamp(s,t0,x,y,txt,size,col,rot){CK.length;XS.push(t0);custom(s,t0,t=>{const k=prog(t,t0,0.35);if(k<=0)return;const sc=lerp(2.2,1,eo(k));ctx.save();ctx.globalAlpha=Math.min(1,k*2);ctx.translate(x,y);ctx.rotate(rot||-0.12);ctx.scale(sc,sc);ctx.font=HF(size);const w=ctx.measureText(txt).width;ctx.strokeStyle=col;ctx.lineWidth=7;ctx.strokeRect(-w/2-24,-size*0.62,w+48,size*1.2);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,4);ctx.restore()})}
function ctaBtn(s,t0){custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(540,1650);ctx.scale(sc,sc);ctx.fillStyle='#E8344E';ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-380,-62,760,124,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(70);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Follow for more tricks',0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)}
function brand(s){custom(s,-1,t=>{ctx.save();ctx.font='800 34px Inter';ctx.fillStyle='rgba(29,59,110,0.75)';ctx.textAlign='center';ctx.fillText('√ RootWork Math',540,150);ctx.restore()})}
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
function dseg(s,t0,p,q,col,lw,dur,o){o=o||{};WRITES.push([t0,dur||0.5]);custom(s,t0,t=>{let k=eo(prog(t,t0,dur||0.5));if(k<=0)return;let a=1;if(o.tOut!=null)a=1-prog(t,o.tOut,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([14,12]);ctx.strokeStyle=col||C.ink;ctx.lineWidth=lw||3.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k);ctx.stroke();ctx.restore()})}
// square picture: X,Y top-left, A,B pixel parts
function sqPic(s,o){const{X,Y,A,B,tOut,tDiv,tA,tB,tR,nums}=o;const L=A+B;
 seg(s,tOut,[X,Y],[X+L,Y],C.ink,4.5,0.35);seg(s,tOut+0.2,[X+L,Y],[X+L,Y+L],C.ink,4.5,0.35);seg(s,tOut+0.4,[X+L,Y+L],[X,Y+L],C.ink,4.5,0.35);seg(s,tOut+0.6,[X,Y+L],[X,Y],C.ink,4.5,0.35);
 dseg(s,tDiv,[X+A,Y],[X+A,Y+L],C.ink,3.5,0.5);dseg(s,tDiv+0.2,[X,Y+A],[X+L,Y+A],C.ink,3.5,0.5);
 custom(s,tDiv+0.3,t=>{const k=eo(prog(t,tDiv+0.3,0.4));if(k<=0)return;ctx.save();ctx.globalAlpha=k;ctx.font=HF(46);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=CA_;ctx.fillText(nums?nums[0]:'a',X+A/2,Y-30);ctx.fillText(nums?nums[0]:'a',X-34,Y+A/2);ctx.fillStyle=CB_;ctx.fillText(nums?nums[1]:'b',X+A+B/2,Y-30);ctx.fillText(nums?nums[1]:'b',X-34,Y+A+B/2);ctx.restore()});
 poly(s,tA,[[X,Y],[X+A,Y],[X+A,Y+A],[X,Y+A]],'rgba(77,163,255,0.38)',{label:nums?nums[2]:'a^2',ls:64,lc:CA_});
 poly(s,tB,[[X+A,Y+A],[X+L,Y+A],[X+L,Y+L],[X+A,Y+L]],'rgba(255,159,67,0.40)',{label:nums?nums[3]:'b^2',ls:54,lc:CB_});
 poly(s,tR,[[X+A,Y],[X+L,Y],[X+L,Y+A],[X+A,Y+A]],'rgba(38,194,129,0.36)',{label:nums?nums[4]:'ab',ls:54,lc:C.green});
 poly(s,tR+0.35,[[X,Y+A],[X+A,Y+A],[X+A,Y+L],[X,Y+L]],'rgba(38,194,129,0.36)',{label:nums?nums[4]:'ab',ls:54,lc:C.green});
}
{const s=0;brand(s);
 note(s,-1,540,420,'(a + b)^2 = a^2 + b^2 ?',96,C.ink,{align:'c'});
 stamp(s,Wd(0,'WRONG')-0.15,540,590,'WRONG!',120,C.red,-0.12);
 sqPic(s,{X:290,Y:740,A:310,B:210,tOut:E(1,-0.2),tDiv:Wd(1,'side')+0.2,tA:Wd(2,'a squared')-0.1,tB:Wd(2,'b squared')-0.1,tR:Wd(2,'two rectangles')-0.1});
 note(s,Wd(1,'side')+0.2,540,1340,'Side:  a + b',80,C.ink,{align:'c',tOut:E(2,-0.1)});
 note(s,Wd(2,'two rectangles')+0.2,540,1340,'+ 2 rectangles  a · b  !',80,C.green,{align:'c',tOut:E(3,-0.1)});
 const w=write(s,[Wd(3,'So')-0.1],540,1340,['= a^2 + 2ab + b^2'],92,C.green,{align:'c'});boxE(s,Wd(3,'b squared')+0.2,tokRect(w,0,0,14),C.green,5);
 ctaBtn(s,E(4,0));
}
