function prj(p){return LASTVP?project(LASTVP,p):null}
function bubble(s,p,size,col,rot,al){if(!p)return;ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(p[0],p[1]);ctx.rotate(rot||0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=10;txt(s,0,0,size,col||'#fff');ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  // dogs: woofs + twinkles
  if(rn===0){if(tt>=6.3&&tt<EV.swat){for(const[d,r]of DOGR){if(d.i%4)continue;const ph=(tt*2.2+hsh(d.i,9))%1;if(ph<0.45){const p=prj(r.head);if(p)bubble('WOOF!',[p[0]+(hsh(d.i,2)-0.5)*40,p[1]-70-ph*40],46,'#ffffff',(hsh(d.i,3)-0.5)*0.4,Math.sin(Math.PI*ph/0.45))}}}
    for(const[d,r]of DOGR){const tL=EV.swat+0.03+Math.max(0,d.z0-6.5*(EV.swat-R[0]))/28;const k=tt-tL;if(k>2.0&&k<3.0&&d.i%2===0){const p=prj(r.head);if(p){const a=Math.sin((k-2)*Math.PI);ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(k*3);emoji('✨',0,0,50+60*a,a);ctx.restore()}}}
    {const k=tt-EV.swat;if(k>=0&&k<0.5&&CATR){const p=prj(V.add(CAT.pos,[0.05,0.35,0.35]));if(p)glowAt(p,420,'255,250,220',0.8*(1-k/0.5))}}}
  // vacuum
  if(rn===1){if(tt>=EV.boop&&tt<EV.boop+1.0){const v=vacAt(tt);const p=prj(V.add(v.pos,[0,0.7,0]));if(p){const k=tt-EV.boop;bubble('beep boop 🤖',[p[0],p[1]-60-k*60],56,'#9ff0ff',0,Math.min(1,(1-k)*3))}}
    if(tt>=EV.suck0&&tt<EV.vjump){const p=prj([0,0.4,1.0]);if(p)bubble('VRRRRRR',[p[0],p[1]-120],60,'#ffffff',-0.08,0.85)}}
  // ufo chaos
  if(rn===2){const u=ufoAt(tt);if(u&&tt>=EV.chaos0&&tt<EV.drop){const E=['💥','⚡','👽','😾','💥','🛸','⚡','💫'];for(let i=0;i<8;i++){const ph=(tt*1.6+hsh(i,1))%1;const a=hsh(i,2)*TAU2+Math.floor(tt*1.6+hsh(i,1))*2.1;const p=prj(V.add(u.pos,[Math.cos(a)*3.2,Math.sin(a)*1.6+0.6,0]));if(p)emoji(E[i],p[0],p[1],70+ph*50,Math.sin(Math.PI*ph))}
      const p=prj(V.add(u.pos,[0,2.2,0]));if(p){const k=Math.floor(tt*3)%3;bubble(['*CRASH*','*BONK*','*HISS*'][k],[p[0],p[1]],64,'#ffef6a',(k-1)*0.15,0.95)}}
    if(tt>=EV.ufoCrash){const p=prj(V.add(UFO_END,[0,3,0]));const f=Math.exp(-(tt-EV.ufoCrash)*0.9);if(p){glowAt(p,520,'255,160,60',0.75*f);glowAt(p,160,'255,240,200',0.9*f)}}}
  // bear
  if(rn===3){if(tt>=EV.roar1&&tt<EV.roar1+1.0||tt>=EV.roar2&&tt<EV.hiss){const r0=tt<EV.roar2?EV.roar1:EV.roar2;const k=tt-r0;bubble(tt<EV.roar2?'ROAR!':'ROOOAAAR!!',[W/2+Math.sin(tt*40)*8,1250],tt<EV.roar2?110:130,'#ffd0a0',Math.sin(tt*30)*0.04,Math.min(1,k*6)*clamp((1.1-k)*3,0,1))}
    if(tt>=EV.hiss&&tt<EV.flee+0.4){const k=tt-EV.hiss;bubble('HISSSS!',[W/2+Math.sin(tt*50)*10,1300],120,'#e8b0ff',Math.sin(tt*40)*0.05,Math.min(1,k*8))}
    if(tt>=EV.flee&&BEARR){const p=prj(BEARR.head);if(p){emoji('😭',p[0]+90,p[1]-80,80);for(let i=0;i<3;i++){const ph=(tt*2+i/3)%1;emoji('💦',p[0]-60-i*20,p[1]-40-ph*80,44,1-ph)}}}}
  // final
  if(rn===4){if(tt>=EV.look+0.35&&tt<EV.jump+0.3&&CATR){const p=prj(V.add(CATR.head,[0,0.18,0]));if(p){const k=tt-EV.look-0.35;bubble('!',[p[0],p[1]-40],140*popS(k),'#ff4a4a',0,1)}}
    if(tt>=EV.koland+0.15&&CATR){const p=prj(CATR.head);if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*100,p[1]-150+Math.sin(a)*30,62)}}}
  {const k=ease((tt-EV.apex0+0.15)/0.2)*(1-ease((tt-EV.apex1)/0.2));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,100*k);ctx.fillRect(0,H-100*k,W,100*k)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.34)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.swat,0.7,0.3);flash(EV.boop,0.3,0.2,'160,240,255');flash(EV.ufoCrash,0.35,0.5,'255,190,120');flash(EV.hiss,0.5,0.3,'220,160,255');flash(EV.koland,0.5,0.25);flash(EV.look+0.35,0.35,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
