// ===== PORTRAIT SHORT (1080x1920) – safe zone x 60..960, y 230..1420; captions at y 1430 =====
const SECH=[1920];const SECY=[0];const CAM=[[0,0]];const CHAPS=[];
const backK=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
function stamp(s,t0,x,y,txt,size,col,rot){CK.length;XS.push(t0);custom(s,t0,t=>{const k=prog(t,t0,0.35);if(k<=0)return;const sc=lerp(2.2,1,eo(k));ctx.save();ctx.globalAlpha=Math.min(1,k*2);ctx.translate(x,y);ctx.rotate(rot||-0.12);ctx.scale(sc,sc);ctx.font=HF(size);const w=ctx.measureText(txt).width;ctx.strokeStyle=col;ctx.lineWidth=7;ctx.strokeRect(-w/2-24,-size*0.62,w+48,size*1.2);ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,4);ctx.restore()})}
function ctaBtn(s,t0){custom(s,t0,t=>{const k=prog(t,t0,0.45);if(k<=0)return;const pu=1+0.035*Math.sin((t-t0)*6);const sc=lerp(0.4,1,backK(eo(k)))*pu;ctx.save();ctx.translate(540,1580);ctx.scale(sc,sc);ctx.fillStyle='#E8344E';ctx.shadowColor='rgba(0,0,0,0.15)';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(-380,-62,760,124,28);ctx.fill();ctx.shadowBlur=0;ctx.font=HF(70);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🔔 Folge für mehr Tricks',0,6);ctx.restore()});WRITES.push([t0,0.3]);CK.push(t0+0.2)}
function brand(s){custom(s,-1,t=>{ctx.save();ctx.font='800 34px Inter';ctx.fillStyle='rgba(29,59,110,0.75)';ctx.textAlign='center';ctx.fillText('√ Wurzelwerk.Mathe',540,150);ctx.restore()})}
function numline(s,t0,o){WRITES.push([t0,0.7]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.7));if(k<=0)return;const{cx,y,u,mn,mx}=o;const X0=cx+mn*u-30,X1=cx+mx*u+30;hline(X0,y,X0+(X1-X0)*k,y,C.ink,4);
  if(k<1)return;hline(X1,y,X1-16,y-9,C.ink,4);hline(X1,y,X1-16,y+9,C.ink,4);ctx.save();ctx.font=HF(38);ctx.textAlign='center';ctx.textBaseline='top';
  for(let v=mn;v<=mx;v++){const x=cx+v*u;hline(x,y-12,x,y+12,C.ink,v?3:5);ctx.fillStyle=v<0?C.red:v>0?C.blue:C.ink;ctx.fillText(String(v).replace('-','−'),x,y+20)}ctx.restore()})}
function jumps(s,t0,o,start,step,n,col,per){per=per||0.4;for(let i=0;i<n;i++){const ti=t0+i*per,a=start+i*step,b=a+step;WRITES.push([ti,0.3]);custom(s,ti,t=>{const k=eo(prog(t,ti,0.35));if(k<=0)return;const x1=o.cx+a*o.u,x2=o.cx+b*o.u,mx=(x1+x2)/2,h=Math.abs(x2-x1)*0.7;
  ctx.save();ctx.strokeStyle=col;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();const N=20;let px,py,qx,qy;for(let j=0;j<=Math.round(N*k);j++){const f=j/N;const x=(1-f)*(1-f)*x1+2*(1-f)*f*mx+f*f*x2,y=(1-f)*(1-f)*o.y+2*(1-f)*f*(o.y-h*2)+f*f*o.y;qx=px;qy=py;px=x;py=y;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  if(k>0.95&&qx!=null){const an=Math.atan2(py-qy,px-qx);hline(px,py,px-16*Math.cos(an-0.45),py-16*Math.sin(an-0.45),col,4);hline(px,py,px-16*Math.cos(an+0.45),py-16*Math.sin(an+0.45),col,4)}ctx.restore()})}}
function ndot(s,t0,o,v,col){WRITES.push([t0,0.2]);custom(s,t0,t=>{const k=eo(prog(t,t0,0.35));if(k<=0)return;ctx.save();ctx.fillStyle=col;ctx.beginPath();ctx.arc(o.cx+v*o.u,o.y,15*backK(k),0,7);ctx.fill();ctx.restore()})}
{const s=0;brand(s);
 note(s,-1,540,360,'(−) · (−) = (+)',150,C.ink,{align:'c'});
 stamp(s,Wd(0,'WARUM')-0.15,540,560,'WARUM?',120,C.red,-0.1);
 note(s,Wd(0,'Beweis')-0.2,540,700,'Beweis in 30 Sekunden:',58,C.green,{align:'c'});
 const R=[['3 · (−2)','−6',Wd(1,'Drei')],['2 · (−2)','−4',Wd(1,'Zwei mal')],['1 · (−2)','−2',Wd(1,'Eins mal')],['0 · (−2)','0',Wd(1,'Null mal')],['(−1) · (−2)','+2',Wd(2,'Minus eins')-0.2],['(−2) · (−2)','+4',Wd(3,'minus zwei mal')-0.2]];
 R.forEach(([a,b,t0],i)=>{const y=810+i*88;const col=i>=4?C.green:C.ink;note(s,t0,560,y,a,72,col,{align:'r'});note(s,t0+0.4,600,y,'=  '+b,72,col)});
 for(let i=0;i<5;i++){const y=810+i*88;const tB=i<3?Wd(2,'größer')-0.6+i*0.25:Wd(2,'weiter')+(i-3)*1.3;arrow(s,tB,850,y+20,850,y+70,C.green,0,'');note(s,tB+0.1,880,y+45,'+2',40,C.green)}
 note(s,Wd(3,'Muster')-0.3,540,1345,'Das Muster lässt nichts anderes zu!',52,C.green,{align:'c',tOut:E(4,-0.3)});
 ctaBtn(s,E(4,0));
}
