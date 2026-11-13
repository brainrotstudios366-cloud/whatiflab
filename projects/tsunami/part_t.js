
// ======================================================================
// ======================= TSUNAMI REPLY VIDEO ==========================
// ======================================================================
const TDUR=28,TB=1.8,T_WAVE=7.5,T_CITYW=14.5,T_FLOOD=21.0,T_ENDC=25.5,T_HIT=20.6;
// ---- falling water blobs ----
const fblobs=[];{const r=rng(21);for(let i=0;i<90;i++)fblobs.push({x:(r()-0.5)*420,z:-40-r()*460,y0:18+r()*110,r:3+r()*12,ph:r()*6})}
const fships=[{x:-60,z:-280,y0:28,yaw:Math.PI/2,big:1},{x:30,z:-95,y0:14,yaw:1.2},{x:-70,z:-120,y0:20,yaw:2.0},{x:65,z:-150,y0:11,yaw:0.2},{x:10,z:-190,y0:24,yaw:2.6}];
function fallY(y0,t){const k=Math.max(0,t-TB);return y0+(t<TB?0.6*Math.sin(t*1.3):0)-4.9*k*k}
function landT(y0){return TB+Math.sqrt(y0/4.9)}
function splashPuffs(x,z,t0,t,scale,objs){const k=t-t0;if(k<0||k>3.2)return;for(let i=0;i<7;i++){const a=i/7*6.283;const sp=(4+hash(i,3)*6)*scale;const y=(10+hash(i,4)*14)*scale*k-4.9*k*k*0.6;if(y<-2)continue;
  objs.push(puffObj(x+Math.cos(a)*sp*k,Math.max(0.5,y),z+Math.sin(a)*sp*k,(2+k*5)*scale,FOAM,0.85*(1-k/3.2)))}
  objs.push(puffObj(x,Math.max(1,(18*scale)*k-4.9*k*k),z,(3+k*3)*scale,FOAM,0.9*(1-k/3.2)))}
// ---- tsunami wave profile ----
function crestZ(t){const u=clamp((t-T_WAVE)/(T_CITYW-T_WAVE),0,1);return -520+528*Math.pow(u,1.25)}
function crestA(t){return 3+42*ease((t-8.3)/4.8)}
function tsunamiH(x,z,t){if(t<T_WAVE)return 0;const zc=crestZ(t),A=crestA(t);const d=z-zc;const sg=d>0?10+A*0.35:30+A;let h=A*Math.exp(-(d*d)/(2*sg*sg));
  // drawback ahead of crest (toward shore)
  if(d>0){h-=Math.min(6,A*0.25)*Math.exp(-Math.pow((d-90)/80,2))*clamp((t-T_WAVE)/2,0,1)}return h}
function drawSea(t,mode){F=900;FOG=hex('#bcd6ea');FOGD=1600;FOGMAX=0.88;setLight([0.4,0.8,0.4]);AMB=0.6;
  if(mode==='fall'){const u=(t)/T_WAVE;cam.x=-4+5*u;cam.y=18+4*u;cam.z=16-4*u;lookAt(0,40-30*ease((t-TB)/2.5),-220)}
  else{const u=(t-T_WAVE)/(T_CITYW-T_WAVE);F=1350-350*ease((t-12.5)/1.8);cam.x=1;cam.y=5;cam.z=10;lookAt(0,4+26*ease((t-11.5)/2.9),-300)}
  cam.roll=Math.sin(t*0.5)*0.02;const sk=mode==='wave'?clamp((t-11)/3,0,1)*0.012:0;cam.pitch+=Math.sin(t*37)*sk;cam.roll+=Math.cos(t*29)*sk;setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,'#2f78cf');g.addColorStop(0.7,'#8ebee8');g.addColorStop(1,'#e0edf5');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  poly([[-4000,0,-3200],[4000,0,-3200],[4000,0,-900],[-4000,0,-900]],fogC(WATER,1500));
  const zcq=crestZ(t);const quads=[];for(let zz=0;zz>-900;){const st=(Math.abs(zz-zcq)<130&&t>=T_WAVE)?5:(zz>-150?10:20);for(let xx=-320;xx<320;xx+=st){const P=(x,z)=>[x,waveH(x,z,t)*0.6+tsunamiH(x,z,t),z];const q=[P(xx,zz),P(xx+st,zz),P(xx+st,zz-st),P(xx,zz-st)];quads.push({q,d:dist([xx+st/2,q[0][1],zz-st/2])})}zz-=st}
  quads.sort((a,b)=>b.d-a.d);for(const qd of quads){const n=nrm([qd.q[0],qd.q[2],qd.q[1]]);const hh=(qd.q[0][1]+qd.q[2][1])/2;let col=mix(WATER,WATER2,clamp(0.5+hh*0.05,0,1));if(hh>6)col=mix(col,FOAM,clamp((hh-6)/18,0,0.8));if(n[2]>0.25&&hh>3)col=mix(col,hex('#0c3f63'),0.55);poly(qd.q,fogC(mul(col,0.78+0.32*Math.max(0,n[1])),qd.d))}
  poly([[-400,2,0],[400,2,0],[400,2,40],[-400,2,40]],fogC(hex('#9a9aa2'),20));poly([[-400,2.05,0],[400,2.05,0],[400,2.05,1.2],[-400,2.05,1.2]],fogC(hex('#d8d050'),15));
  const objs=[];
  if(mode==='fall'){for(const b of fblobs){const y=fallY(b.y0,t);const tl=landT(b.y0);if(t<tl){objs.push({d:dist([b.x,y,b.z]),draw:()=>{const c=toCam([b.x,y,b.z]);if(c[2]<1)return;const s=scr(c);const rp=b.r*F/c[2];if(rp<1)return;
        const gg=ctx.createRadialGradient(s[0]-rp*0.35,s[1]-rp*0.4,rp*0.05,s[0],s[1],rp);gg.addColorStop(0,'rgba(220,245,255,0.95)');gg.addColorStop(0.35,'rgba(90,170,220,0.85)');gg.addColorStop(1,'rgba(20,90,150,0.75)');ctx.fillStyle=gg;const st=1+Math.min(0.6,Math.max(0,t-TB)*0.25);ctx.beginPath();ctx.ellipse(s[0],s[1],rp/st,rp*st,0,0,7);ctx.fill()}})}
      else splashPuffs(b.x,b.z,tl,t,b.r/8,objs)}
    for(const s of fships){const y=fallY(s.y0,t);const tl=landT(s.y0);const yy=Math.max(t<tl?y:0.8*Math.abs(Math.sin(Math.min(1,(t-tl)*2)*Math.PI))*Math.exp(-(t-tl)),0);const M=rotM(s.yaw,t<tl?0.1:0,t<tl?0.15:0);const c=[s.x,yy+(s.big?1:0.4),s.z];
      if(s.big){const hull=hex('#9b2f2a');objs.push({d:dist(c),draw:()=>{oboxDraw(c,M,8,5,55,{top:hex('#5a5f66'),side:hull,front:hull,back:hull,bottom:hull});oboxDraw(mapL(c,M,0,11,44),M,7,6,4,{top:hex('#e8e8ea'),side:hex('#f2f2f4')})}})}
      else objs.push({d:dist(c),draw:()=>{oboxDraw(c,M,1.3,0.6,4,{top:hex('#d9cbb0'),side:hex('#f4f4f6'),front:hex('#f4f4f6'),back:hex('#f4f4f6'),bottom:hex('#f4f4f6')});const m0=mapL(c,M,0,0.6,0.5),m1=mapL(c,M,0,8,0.5),s1=mapL(c,M,0,1.2,3.3);facePoly([m0,m1,s1],hex('#fafafa'),true)}});
      if(t>=tl)splashPuffs(s.x,s.z,tl,t,s.big?4:1.2,objs)}}
  else{const zc=crestZ(t),A=crestA(t);
    if(A>4){const dW=Math.abs(zc-cam.z);const lean=A*0.28;for(let x=-480;x<480;x+=40){const P=[[x,-1,zc+3],[x+40,-1,zc+3],[x+40,A,zc+lean],[x,A,zc+lean]];const cp=clipNear(P.map(toCam));if(cp.length<3)continue;
        const st=scr(toCam([x+20,A,zc+lean])),sb=scr(toCam([x+20,-1,zc+3]));const gr=ctx.createLinearGradient(0,st[1],0,sb[1]);const ff=Math.min(0.5,dW/1600);
        gr.addColorStop(0,css(mix(hex('#5fb3cf'),FOG,ff)));gr.addColorStop(0.35,css(mix(hex('#1f6f95'),FOG,ff)));gr.addColorStop(1,css(mix(hex('#0b3a5a'),FOG,ff)));polyPath(cp);ctx.fillStyle=gr;ctx.fill();
        const L=[[x,A,zc+lean],[x+40,A,zc+lean],[x+40,A*0.93,zc+lean+A*0.22],[x,A*0.93,zc+lean+A*0.22]];const cl=clipNear(L.map(toCam));if(cl.length>=3){polyPath(cl);ctx.fillStyle=css(mix(hex('#e9f6fb'),FOG,ff));ctx.fill()}}}
    if(A>8){for(let i=0;i<40;i++){const x=-300+i*15+Math.sin(i*1.7+t*3)*4;const y=A*0.92+hash(i,Math.floor(t*6))*4;const z=zc+4+hash(i,2)*10;objs.push(puffObj(x,y,z,4+A*0.15,FOAM,0.75))}}}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---- wave rushing down the avenue ----
function frontZ(t){return -260+(t-T_CITYW)/(T_HIT-T_CITYW)*258}
function drawCityWave(t){F=930;FOG=hex('#e9a991');FOGD=150;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;
  FOGD=320;const zf=frontZ(t);const hw=18+3*Math.sin(t*2);cam.x=0.4;cam.y=1.75;cam.z=0;cam.yaw=0.17;cam.pitch=0.1+0.05*clamp((t-17)/3,0,1);cam.roll=0;
  const sk=clamp((t-16)/4.5,0,1);cam.pitch+=Math.sin(t*41)*0.015*sk;cam.roll+=Math.cos(t*33)*0.02*sk;setCam();
  drawCitySky(t);cityGround();drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];
  for(const c of gpark){const pushed=c.z<zf+3;const z=pushed?zf+2+hash(c.z|0,1)*2:c.z;const y=pushed?hw*0.7:0;objs.push(carOObj([c.x,y,z],rotM(pushed?hash(c.z|0,2)*3:0,0,pushed?hash(c.z|0,3)*1.5:0),c.col))}
  for(const c of gcars){const z0=c.z0;if(z0<-200||z0>30)continue;const pushed=z0<zf+3;const z=pushed?zf+2:z0;objs.push(carOObj([c.x,pushed?hw*0.6:0,z],rotM(pushed?hash(z0|0,2)*3:(c.dir>0?0:Math.PI),0,pushed?hash(z0|0,5):0),c.col))}
  for(let i=0;i<gpeople.length;i+=2){const p=gpeople[i];if(p.z<zf+1)continue;const o=personG(p,0.5);if(o&&o.d>0)objs.push(o)}
  for(const l of lamps){if(l.z<zf)continue;const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  // water body
  objs.push({d:dist([0,hw/2,zf-40]),draw:()=>{const W1=hex('#2f6f8f'),W2=hex('#4a8fa8');poly([[-14,hw,zf],[14,hw,zf],[14,hw,zf-400],[-14,hw,zf-400]],fogC(W1,Math.abs(zf-cam.z)+40));
      poly([[-14,0,zf],[14,0,zf],[14,hw,zf],[-14,hw,zf]],fogC(W2,Math.abs(zf-cam.z)));
      for(let i=0;i<24;i++){const x=-14+i*1.2;const y=hw+Math.sin(i*1.3+t*8)*0.8;const c=toCam([x,y,zf+0.5]);if(c[2]<0.3)continue;const s=scr(c);const r=Math.min(400,(2+hash(i,Math.floor(t*10))*1.5)*F/c[2]);ctx.fillStyle='rgba(240,248,252,0.9)';ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill()}}});
  for(let i=0;i<30;i++){const k=((t*1.5+hash(i,1))%1);objs.push(puffObj(-13+hash(i,2)*26,hw+k*8,zf+1+k*4,1.5+k*3,FOAM,0.7*(1-k)))}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
function drawFlood(t){F=900;FOG=hex('#c9c4bc');FOGD=200;FOGMAX=0.9;setLight([-0.35,0.8,0.5]);AMB=0.58;const u=(t-T_FLOOD)/5;cam.x=-6+14*u;cam.y=45+15*u;cam.z=10-20*u;lookAt(-2,0,cam.z-110);cam.roll=0.02;setCam();
  drawCitySky(t);ctx.fillStyle='rgba(120,120,130,0.25)';ctx.fillRect(0,0,W,H);
  const wl=11;buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  // flood plane drawn over lower parts of buildings via clipping near street canyon
  const fw=hex('#4f6f7a');poly([[-14,wl,40],[14,wl,40],[14,wl,-330],[-14,wl,-330]],fogC(fw,80));
  for(let i=0;i<70;i++){const x=(hash(i,1)-0.5)*26,z=40-hash(i,2)*300;const c=toCam([x+Math.sin(t+i)*0.5,wl+0.1,z]);if(c[2]<1)continue;const s=scr(c);const r=Math.max(2,(1+hash(i,3)*2)*F/c[2]);ctx.fillStyle=`rgba(${hash(i,4)<0.5?'230,235,238':'120,90,70'},0.8)`;ctx.fillRect(s[0]-r,s[1]-r*0.4,r*2,r*0.8)}
  for(let i=0;i<14;i++){const x=(hash(i,5)-0.5)*20,z=20-hash(i,6)*200;const M=rotM(hash(i,7)*6,0.2,0.15*Math.sin(t+i));objs0(carOObj([x,wl-0.6+0.15*Math.sin(t*1.5+i),z],M,hex(carCols[i%carCols.length])))}}
function objs0(o){o.draw()}
// ---- overlays ----
const capsT=[[2.0,7.4,'All that floating water crashes back down 💥'],[7.6,11.0,'The sea pulls back first…'],[11.0,14.4,'…then a giant wave rises 🌊'],[14.6,21.0,'Coastal cities get hit first'],[21.2,25.5,'So yes… there would be a tsunami 😳']];
function drawCaptionT(t){for(const[a,b,s]of capsT){if(t<a||t>=b)continue;const k=t-a;const sc=k<0.18?0.6+0.4*ease(k/0.18)+Math.sin(k/0.18*Math.PI)*0.12:1;const al=Math.min(1,k/0.1,(b-t)/0.12);const size=fitSize(s,920,58);
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,640);ctx.scale(sc,sc);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function fitW2(s,size){ctx.font=`900 ${size}px Inter`;return ctx.measureText(s).width}
function statBoxT(label,val,col,a){ctx.save();ctx.globalAlpha=a;ctx.font='800 26px Inter';const w=Math.max(ctx.measureText(label).width,fitW2(val,64))+60;ctx.fillStyle='rgba(15,10,30,0.66)';rrect(56,1360,w,170,30);ctx.fill();ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText(label,86,1402);txt(val,86,1468,64,col,'left',900,false);ctx.restore()}
function overlaysT(t){ctx=ctx0;shakeX=0;shakeY=0;
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(TB,0.85,0.45);flash(T_WAVE,0.55,0.22);flash(T_CITYW,0.55,0.22);flash(T_HIT,1,0.5,'235,245,250');flash(T_FLOOD+0.05,0.6,0.4,'235,245,250');
  if(t>=T_HIT-0.05&&t<T_FLOOD+0.05){ctx.fillStyle='rgba(40,110,140,0.95)';ctx.fillRect(0,0,W,H)}
  if(t<TB){const a=Math.min(1,(TB-t)/0.25);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,420);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
    txt('When gravity comes back…',0,-55,fitSize('When gravity comes back…',980,80),'#ffd84a');txt('will there be a tsunami? 🌊',0,45,fitSize('will there be a tsunami? 🌊',980,80),'#ffd84a');ctx.restore()}
  if(t>=TB&&t<TB+1.5){const k=t-TB;const s=k<0.25?0.5+0.5*easeOut(k/0.25):1;const a=Math.min(1,(1.5-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('GRAVITY IS BACK',0,0,96,'#7dff9a');ctx.restore()}
  if(t>=11.0&&t<T_CITYW){const a=Math.min(1,(t-11)/0.25,(T_CITYW-t)/0.2);statBoxT('WAVE HEIGHT',Math.round(crestA(t))+' m','#ff6b6b',a)}
  drawCaptionT(t);
  const k=ease((t-T_ENDC)/0.5);if(k>0){ctx.fillStyle=`rgba(12,8,28,${0.78*k})`;ctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=k;const pop=t-T_ENDC<0.5?0.7+0.3*ease((t-T_ENDC-0.1)/0.4):1;ctx.translate(W/2,820);ctx.scale(pop,pop);
    txt('Got a question?',0,-90,96,'#ffd84a');txt('Comment it 👇',0,25,96,'#ffd84a');ctx.restore();ctx.save();ctx.globalAlpha=k*ease((t-T_ENDC-0.6)/0.4);txt('Follow for more What Ifs',W/2,1120,48,'#ffffff','center',800);ctx.restore()}}
function shakesT(t){shakeX=0;shakeY=0;const s=(t0,amp,dur)=>{const k=t-t0;if(k>0&&k<dur){const a=amp*(1-k/dur);shakeX+=Math.sin(k*61)*a;shakeY+=Math.cos(k*47)*a}};s(TB,14,0.5);for(const b of fblobs)if(b.r>9)s(landT(b.y0),6,0.4);s(landT(28),26,0.8);s(T_HIT,40,0.6)}
function renderSceneT(t){ctx.save();shakesT(t);if(t<T_WAVE)drawSea(t,'fall');else if(t<T_CITYW)drawSea(t,'wave');else if(t<T_FLOOD)drawCityWave(t);else drawFlood(t);ctx.restore()}
function frame(fi){const t0=fi/FPS;for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderSceneT(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;ctx0.drawImage(acc,0,0);overlaysT(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=TDUR*FPS;window.crashes=[];
</script></body></html>
