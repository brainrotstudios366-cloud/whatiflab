// ===================== FX, render, overlays =====================
const PUDDLE=um(m=>{for(let i=0;i<32;i++){const a=i/32*TAU2,b=(i+1)/32*TAU2;const w=1+0.18*Math.sin(i*1.7),w2=1+0.18*Math.sin((i+1)*1.7);m.tri([0,0,0],[Math.cos(b)*w2,0,Math.sin(b)*w2],[Math.cos(a)*w,0,Math.sin(a)*w],hx('#4a5a70'),MAT.water)}});
const MROCK=um(m=>blob(m,[0,0,0],1,p=>{const n=vnoise(p[0]*3+1,p[1]*3+p[2]*2);return mix3([1,0.42,0.08],[1,0.78,0.3],n)},4,0.9,[10,14],MAT.emis),0.3);
let LASTVP=null,LASTVP_BG=null,HOTPTS=[],TAGS=[],FORKP=null,REXHEAD=null;
const gz=(t,t0)=>distAt(t)-distAt(t0);
function smoke(items,p,k,n,sc,col){for(let j=0;j<n;j++){const kk=k-j*0.18;if(kk<0||kk>2.4)continue;items.push({mesh:USPH,M:M4.trs([p[0]+Math.sin(kk*2+j)*0.15*kk,p[1]+kk*0.7,p[2]+kk*0.2],0,0,0,(0.1+kk*0.22)*sc),tint:col||[0.55,0.52,0.5],tintAmt:1,alpha:Math.max(0,0.2*(1-kk/2.4)),noShadow:true})}}
function rock(items,p,r,heat){items.push({mesh:MROCK,M:M4.trs(p,0,0,0,r),tint:[0.3,0.12,0.06],tintAmt:1-heat});if(heat>0.05){items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,r*1.6),tint:[1,0.5,0.15],tintAmt:1,alpha:0.2*heat,add:1,noShadow:true});HOTPTS.push([p,r*1.5,heat])}}
function fgItems(t){HOTPTS=[];TAGS=[];FORKP=null;REXHEAD=null;const rn=roundAt(t);const items=[];
  const d=distAt(t);const o_=((d%FARM.T)+FARM.T)%FARM.T;
  for(let k=-5;k<=0;k++){const zo=-k*FARM.T+o_;items.push({mesh:FARM.mesh,M:M4.trs([0,0,zo],0,0,0,1)});
    for(const p of PROPS){const z=p.z+zo;if(z<-8||z>150)continue;items.push({mesh:p.k==='p'?PUMP:HAY,M:M4.trs([p.x,0,z],p.yaw,p.k==='h'?1.5708:0,0,p.k==='h'?[0.62,0.62,0.62]:p.s),tint:null,tintAmt:0})}
    for(const tr of FTREES){const z=tr.z+zo;if(z<-6||z>190)continue;items.push({mesh:tr.mesh,M:M4.trs([tr.x,0,z],0,0,0,1),tint:tr.tint,tintAmt:tr.tint?0.35:0})}}
  // ---- R1 meteors ----
  if(rn===0||(t>=R[1]&&t<R[1]+0.5)){for(let i=0;i<26;i++){const t0=EV.met1-1.2+i*0.28+hsh(i,3)*0.2;const k=(t-t0)/0.45;if(k<0||k>1)continue;const st=[-16+hsh(i,1)*28,16+hsh(i,2)*12,18+hsh(i,4)*26];const dir=V.norm([0.6,-0.55,-0.25]);const p=V.add(st,V.sc(dir,k*12));const q=V.add(p,V.sc(dir,-3.5));
      items.push({mesh:ECYL,M:segM(q,p,0.06),tint:[0.75,0.95,1],tintAmt:1,alpha:0.8*Math.sin(k*Math.PI),add:1,noShadow:true});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.16),tint:[0.9,1,1],tintAmt:1,alpha:0.9*Math.sin(k*Math.PI),add:1,noShadow:true})}
    EV.fm.forEach((f,i)=>{const x0=i===0?0:(i<5?TKX[i-1]:(i%2?1.2:-1.25)),z0=i<5?0.05:(i%3-1)*0.8+0.6;const r=0.11;const k=t-f;const tf=0.42;
      if(k>-tf&&k<0){const q=clamp(1+k/tf,0,1);const st=[x0-4,10,z0+7];const p=V.add(st,V.sc(V.sub([x0,r,z0],st),q*q));rock(items,p,r,1);const tail=V.add(st,V.sc(V.sub([x0,r,z0],st),Math.max(0,q*q-0.3)));
        items.push({mesh:ECYL,M:segM(tail,p,r*0.9),tint:[1,0.6,0.2],tintAmt:1,alpha:0.45,add:1,noShadow:true});items.push({mesh:ECYL,M:segM(tail,p,r*2.2),tint:[1,0.4,0.1],tintAmt:1,alpha:0.15,add:1,noShadow:true})}
      if(k>=0){const z=z0+gz(t,f);if(z>12)return;rock(items,[x0,r*0.7,z],r,clamp(1-k/6,0.25,1));items.push({mesh:DISC2,M:M4.trs([x0,0.012,z],i,0,0,[0.32,1,0.32]),tint:[0.08,0.06,0.05],tintAmt:1,alpha:0.75,noShadow:true});
        if(k<0.5){items.push({mesh:RING,M:M4.trs([x0,0.04,z],0,0,0,0.15+k*2.2),tint:[1,0.65,0.25],tintAmt:1,alpha:0.75*(1-k/0.5),add:1,noShadow:true});
          for(let j=0;j<12;j++){const a=j/12*TAU2+i;const sp=1.0+hsh(i,j)*1.4;const p=[x0+Math.cos(a)*sp*k,0.05+k*(3-k*9)*(0.6+hsh(j,i)*0.6),z+Math.sin(a)*sp*k];if(p[1]<0)continue;items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.025),tint:[1,0.8,0.35],tintAmt:1,alpha:1,add:1,noShadow:true})}}
        smoke(items,[x0,0.15,z],k,5,0.8)}})}
  // ---- R2 Black Friday carts ----
  if(t>=EV.carts&&t<R[2]){let cz;if(t<EV.scare2)cz=lerp(24,5.5,ease((t-EV.carts)/(EV.scare2-EV.carts)));else if(t<EV.run2+0.4)cz=lerp(5.5,2.3,ease((t-EV.scare2)/0.8));else if(t<EV.res2)cz=2.3+0.4*Math.sin((t-EV.run2)*2.1);else cz=lerp(2.3+0.4*Math.sin((EV.res2-EV.run2)*2.1),34,easeIn((t-EV.res2)/2.2));
    const L=[[0,0],[-0.9,0.5],[0.9,0.4],[-1.8,1.1],[1.8,1.0],[-0.45,1.6],[0.45,1.7],[-1.35,2.3],[1.35,2.2],[0,2.8],[-2.0,3.2],[2.0,3.1]];
    L.forEach(([x,z],i)=>{const zz=cz+z*1.3+0.25*Math.sin(t*3+i);const y=0.025*Math.abs(Math.sin(t*19+i*1.7));const yaw=0.06*Math.sin(t*5+i);items.push({mesh:CART,M:M4.trs([x,y,zz],yaw,0,0.03*Math.sin(t*13+i),1)});
      if(i<5)TAGS.push([[x,1.25,zz],['-70%','-50%','-90%','-60%','-80%'][i]]);if(hsh(i,Math.floor(t*6))>0.6)smoke(items,[x,0.05,zz+0.5],((t*1.7+i*0.3)%1)*1.4,1,0.8,[0.7,0.62,0.52])})}
  // ---- R3 tornado ----
  if(t>=EV.torn3&&t<R[3]){const k0=ease((t-EV.torn3)/(EV.lift3-EV.torn3+0.2));let tx=0.4*Math.sin(t*1.3),tz=lerp(34,1.2,k0);let al=1;if(t>=EV.fly3){const kk=ease((t-EV.fly3)/2.6);tx+=kk*16;tz+=kk*10;al=1-ease((t-EV.fly3-1.2)/2.0)}
    if(al>0.01){const tp=[tx,0,tz];items.push({mesh:TORN,M:M4.trs(tp,-t*3.2,0,0,[1.25,1.3,1.25]),tint:null,tintAmt:0,alpha:0.7*al,noShadow:true});items.push({mesh:TORN,M:M4.trs(tp,-t*4.5+1,0,0,[1.5,1.36,1.5]),tint:[0.85,0.85,0.82],tintAmt:0.7,alpha:0.3*al,noShadow:true});
      
      for(let i=0;i<34;i++){const h=hsh(i,1)*9;const R2=0.6+Math.pow(h/14,1.7)*5.2+0.4;const a=-t*(3.5-h*0.15)+hsh(i,2)*TAU2;const p=[tx+Math.cos(a)*R2,h+0.2*Math.sin(t*3+i),tz+Math.sin(a)*R2];
        if(i%3===0)items.push({mesh:ALEAF,M:M4.trs(p,t*5+i,t*7,i,0.12),tint:null,tintAmt:0,noShadow:true});else items.push({mesh:UB,M:M4.trs(p,t*4+i,t*3,i,[0.06,0.015,0.1]),tint:i%2?hx('#e0c070'):hx('#7a5a3a'),tintAmt:1,alpha:al,noShadow:true})}}}
  // ---- R4 T. rex ----
  if(t>=EV.rex4&&t<R[4]){const S=4.6;let z=lerp(24,4.4,ease((t-EV.rex4)/(EV.stop4-EV.rex4)));if(t>=EV.back4)z+=gz(t,EV.back4);const walking=t<EV.stop4;const wph=(Math.min(t,EV.stop4)-EV.rex4)*TAU2/1.5;
    let pitch=0,dz=0;if(t>=EV.roar4&&t<EV.turn4)pitch=0.12*ease((t-EV.roar4)/0.3)+0.015*Math.sin(t*40);if(t>=EV.flinch4){pitch=-0.18*ease((t-EV.flinch4)/0.25);dz=0.6*ease((t-EV.flinch4)/0.3)}if(t>=EV.bow4){pitch=lerp(-0.18,0.32,ease((t-EV.bow4)/0.6))}
    const p=[-0.9,0,z+dz];const Rt=M4.trs(p,Math.PI+0.15,0,0,S);const B=M4.mul(Rt,M4.trs([0,walking?0.012*Math.abs(Math.sin(wph)):0,0],0,pitch,walking?0.04*Math.sin(wph):0,1));
    items.push({mesh:TXBODY,M:B});for(const s of[-1,1]){const sw=walking?s*0.38*Math.sin(wph):0;items.push({mesh:TXLEG,M:M4.mul(B,M4.trs([s*0.11,0.36,0],0,sw,0,1))})}
    REXHEAD=V.add(p,[0,0.9*S-pitch*S*0.6,-0.18*S]);if(walking){const st=Math.floor(wph/Math.PI);}}
  // ---- R5 rain ----
  if(t>=EV.rain5-0.3&&t<R[5]+0.3){const ra=ease((t-EV.rain5+0.3)/0.8)*(1-ease((t-EV.res5-0.6)/1.2));if(ra>0.01){for(let i=0;i<220;i++){const x=(hsh(i,1)-0.5)*7,z=-1.1+hsh(i,2)*9;const ph=((t*1.6+hsh(i,3))%1);const y=5.5*(1-ph);const p=[x-0.4*ph,y,z];
      items.push({mesh:ECYL,M:segM(p,V.add(p,[0.06,0.32,0]),0.008),tint:[0.75,0.85,1],tintAmt:1,alpha:0.45*ra,add:1,noShadow:true})}
    for(let i=0;i<40;i++){const ph=((t*2.3+hsh(i,7))%1);const x=(hsh(i,8)-0.5)*5,z=-2+hsh(i,9)*6;items.push({mesh:RING,M:M4.trs([x,0.02,z],0,0,0,0.02+ph*0.12),tint:[0.8,0.9,1],tintAmt:1,alpha:0.6*(1-ph)*ra,add:1,noShadow:true})}
    for(const [x,z,s] of[[0.8,-0.6,0.5],[-0.9,0.7,0.7],[0.2,1.8,0.6],[-0.4,-1.4,0.4]])items.push({mesh:PUDDLE,M:M4.trs([x,0.01,z+gz(t,EV.rain5)*0],0,0,0,[s*ra,1,s*0.7*ra]),tint:null,tintAmt:0,noShadow:true});
    const ts=tkState(t);if(ts.lookUp>0.3){for(let i=0;i<6;i++){const ph=((t*2.2+i/6)%1);items.push({mesh:DROP,M:M4.trs([0.04*Math.sin(i*2)+ph*0.2*Math.cos(i*2.4),1.25+ph*0.35-ph*ph*0.9,-0.38+ph*0.2*Math.sin(i*2.4)],0,0,0,0.018),tint:null,tintAmt:0,alpha:0.85,noShadow:true})}}}}
  // ---- FINAL fork ----
  if(t>=EV.fork6&&t<EV.up6+1.0){let y=lerp(8,1.42,easeOut((t-EV.fork6)/1.7));let roll=0.04*Math.sin(t*2),tx=0;if(t>=EV.conf6&&t<EV.up6){const k=t-EV.conf6;roll=0.3*Math.sin(k*5)*Math.min(1,k*3);tx=0.1*Math.sin(k*5)}if(t>=EV.up6)y+=easeIn((t-EV.up6)/0.8)*9;
    const fp=[tx,y,-0.15];items.push({mesh:FORK,M:M4.trs(fp,0.3,0,roll,1.0)});FORKP=V.add(fp,[0,2.4,0])}
  if(t>=EV.poof6-0.05&&t<EV.poof6+1.5){const k=t-EV.poof6+0.05;for(let i=0;i<16;i++){const a=i/16*TAU2;const r=0.25+easeOut(k/0.6)*0.6;items.push({mesh:USPH,M:M4.trs([Math.cos(a)*r,0.55+Math.sin(i*1.7)*0.35+k*0.2,Math.sin(a)*r*0.8],0,0,0,0.25+k*0.25),tint:[0.95,0.95,0.98],tintAmt:1,alpha:0.75*clamp(1-k/1.4,0,1),noShadow:true})}}
  // ---- turkey ----
  const ts=tkState(t);items.push(...tkItems(t,ts));
  // ---- real ant cameo ----
  if(t>=EV.ant6&&t<EV.loop){const k=ease((t-EV.ant6)/1.0);const x=lerp(1.8,0.82,k);const o={t,ph:t*5.2,walk:k<1?1:0,pose:'walk',lid:0.45};if(t>=EV.ant6+1.2&&t<EV.ant6+1.7)o.cough=t-EV.ant6-1.2;
    items.push(...antItems(M4.trs([x,0,-0.28],-1.5708,0,0,0.42),o))}
  return items}
function renderScene(t){let tt=t;if(t>=EV.loop)tt=t-EV.loop;const env=envAt(tt);const c=camAt(tt);
  const fd=V.norm(V.sub(c.at,c.eye));const be=[0,c.eye[1]+1.0,0];
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,[{mesh:BGG}],tt);
  const fitems=fgItems(tt);const fenv=Object.assign({},env,{fogD:env.night>0.5?90:120});const rn=roundAt(tt);const sc=rn===3?{center:[-0.5,0,2.5],radius:9}:{center:[0,0,0.2],radius:4.2};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:3000},sc,fitems,tt,{noClear:true,noSky:true})}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};EV.fm.forEach(d=>S(d,14,0.4));S(EV.scare2,10,0.4);if(t>=EV.run2&&t<EV.res2)a+=3;
  if(t>=EV.torn3+1&&t<EV.fly3)a+=3+5*ease((t-EV.torn3-1)/2);if(t>=EV.rex4&&t<EV.stop4){const ph=((t-EV.rex4)/0.75)%1;a+=9*Math.max(0,1-ph*4)}S(EV.roar4,16,1.4);S(EV.gob4,9,1.0);S(EV.bolt5a,8,0.5);S(EV.bolt5b,10,0.6);S(EV.poof6,10,0.4);if(t<0.6)a+=6*(1-t/0.6);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function pop(s,x,y,size,col,t0,t,d,rot){const k=t-t0;if(k<0||k>d)return;const pp=k<0.15?0.4+0.6*easeOut(k/0.15):1+0.08*(k-0.15);ctx.save();ctx.globalAlpha=clamp((d-k)/0.3,0,1);ctx.translate(x+Math.sin(k*70)*5,y);ctx.rotate(rot||0);ctx.scale(pp,pp);txt(s,0,0,size,col);ctx.restore()}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[6])return;const ts=R[rn];const k=t-ts;
  const [lab,cap1,cap2,t2]=ROUNDS[rn];const hideLab=rn===5&&t<EV.fin6;
  if(!hideLab){const kk=rn===5?t-EV.fin6:k;const pp=kk<0.2?0.6+0.4*easeOut(kk/0.2)+Math.sin(kk/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===5?104:120,rn===5?'#FF8A3A':'#ffd84a');ctx.restore();
    if(t<t2)pill(cap1,385,rn===5?'rgba(200,70,20,0.88)':'rgba(15,10,30,0.72)',60,Math.min(1,kk/0.12));else pill(cap2,385,'rgba(40,140,60,0.88)',60,Math.min(1,(t-t2)/0.12))}
  else{if(t>R[5]+0.3&&t<EV.wait6)pill('Storm’s gone… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[5]-0.3)/0.15));if(t>=EV.wait6)card('Wait… what’s the date? 📅',385,'rgba(15,10,30,0.66)',60,EV.wait6,t)}
  const hp=hpAt(t);const f=hp/100;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🦃 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();ctx.fillStyle=f>0.6?'#7DFF9A':f>0.3?'#FFD84A':'#FF5A5A';rrect(-150,-17,Math.max(14,330*f),34,17);ctx.fill();
  txt(Math.round(hp)+'%',250,2,44,'#fff','center',900,false);ctx.restore();
  if(rn===0&&t>=EV.met1+0.3&&t<R[1]-0.2)card('Leonids hit our air at 71 km/s ☄️',660,'rgba(40,90,200,0.92)',50,EV.met1+0.3,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: turkeys see ~270° around them 👀',770,'rgba(15,10,30,0.72)',44,EV.res1+0.5,t);
  if(rn===1&&t>=EV.carts+0.6&&t<EV.scare2)card('Black Friday: Nov 27 🛍️',660,'rgba(220,40,60,0.92)',54,EV.carts+0.6,t);
  if(rn===1&&t>=EV.run2+0.8&&t<R[2]-0.2)card('Real: turkeys can sprint ~20 mph 🏃',660,'rgba(220,120,20,0.92)',50,EV.run2+0.8,t);
  if(rn===2&&t>=EV.fly3+0.4&&t<R[3]-0.2)card('Real: wild turkeys CAN fly 🪽',660,'rgba(40,140,90,0.92)',54,EV.fly3+0.4,t);
  if(rn===2&&t>=EV.fly3+1.2&&t<R[3]-0.2)card('Bursts up to ~55 mph 💨',770,'rgba(15,10,30,0.72)',48,EV.fly3+1.2,t);
  if(rn===3&&t>=EV.bow4+0.3&&t<R[4]-0.2)card('Real: birds ARE living dinosaurs 🦖🐦',660,'rgba(90,60,200,0.92)',48,EV.bow4+0.3,t);
  if(rn===3&&t>=EV.bow4+1.2&&t<R[4]-0.2)card('T. rex is his distant cousin 🧬',770,'rgba(15,10,30,0.72)',46,EV.bow4+1.2,t);
  if(rn===4&&t>=EV.myth5&&t<R[5]-0.2)card('Myth: turkeys drown looking up at rain 🌧️',660,'rgba(15,10,30,0.78)',42,EV.myth5,t);
  if(rn===4&&t>=EV.bust5&&t<R[5]-0.2)card('BUSTED ❌ totally false',770,'rgba(255,60,90,0.92)',54,EV.bust5,t);
  if(rn===5&&t>=EV.fin6+0.5&&t<EV.poof6)card('Thanksgiving: Nov 26 🍽️',660,'rgba(200,70,20,0.92)',54,EV.fin6+0.5,t);
  if(rn===5&&t>=EV.ant6+1.0)card('🐜: …bro? 😐',660,'rgba(15,10,30,0.75)',58,EV.ant6+1.0,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pp=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pp,pp);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('EVERYTHING ☄️🦖🌪️',0,-110,fitSize('EVERYTHING ☄️🦖🌪️',980,104),'#FFD84A');txt('vs',0,-5,76,'#ffffff');txt('ONE TURKEY 🦃',0,95,fitSize('ONE TURKEY 🦃',980,110),'#FF8A3A');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1560,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[6];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.62*k})`;ctx.fillRect(0,0,W,H);const pp=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,560);ctx.scale(pp,pp);
  txt('Survived EVERYTHING 🦃',0,-230,fitSize('Survived EVERYTHING 🦃',960,80),'#7DFF9A');txt('…even Thanksgiving 🍽️',0,-130,fitSize('…even Thanksgiving 🍽️',960,70),'#FFD84A');
  txt('Who wins:',0,10,84,'#ffffff');txt('YOU or this turkey? 🦃',0,115,fitSize('YOU or this turkey? 🦃',960,86),'#FF8A3A');txt('👇',0,280+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1050,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;
  ctx.save();ctx.globalCompositeOperation='screen';for(const [p,r,h] of HOTPTS){const q=project(LASTVP,p);if(!q)continue;const rad=Math.min(700,r*1900/q[2]*1.6);glowAt(q,rad,'255,110,30',0.3*h)}ctx.restore();
  // price tags
  for(const [p,s] of TAGS){const q=project(LASTVP,p);if(!q||q[2]<0.5)continue;const sz=clamp(260/q[2],18,80);ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(-0.12);ctx.fillStyle='#ff3a4a';rrect(-sz*1.3,-sz*0.62,sz*2.6,sz*1.24,sz*0.3);ctx.fill();txt(s,0,2,sz,'#fff','center',900,false);ctx.restore()}
  if(tt>=R[2]&&tt<R[3]){ctx.fillStyle=`rgba(40,60,40,${0.12*ease((tt-R[2])/1)*(1-ease((tt-EV.land3)/1.5))})`;ctx.fillRect(0,0,W,H)}
  if(tt>=R[4]&&tt<R[5]){ctx.fillStyle=`rgba(20,30,60,${0.12*ease((tt-R[4])/1)*(1-ease((tt-EV.res5-0.4)/1.4))})`;ctx.fillRect(0,0,W,H)}
  // pops
  if(tt<R[0])pop('GOBBLE! 🦃',W/2,1380,96,'#FF8A3A',EV.gob0,tt,1.2,-0.06);
  pop('RUN!!! 🏃',W/2,1380,104,'#FF5A8A',EV.scare2,tt,1.0,0.05);
  pop('ROOOAR!',W/2,820,110,'#7DFF9A',EV.roar4,tt,1.3,-0.05);pop('GOBBLE GOBBLE!!! 🦃',W/2,1380,fitSize('GOBBLE GOBBLE!!! 🦃',980,92),'#FF8A3A',EV.gob4,tt,1.3,0.04);
  pop('*POOF* 💨',W/2,860,110,'#ffffff',EV.poof6,tt,0.9,-0.05);
  if(tt>=EV.conf6&&tt<EV.up6&&FORKP){const q=project(LASTVP,FORKP);if(q){ctx.save();ctx.translate(q[0]+90,q[1]);const k=tt-EV.conf6;const pp=k<0.15?easeOut(k/0.15):1;ctx.scale(pp,pp);txt('?',0,0,150,'#FFD84A');ctx.restore()}}
  if(tt>=EV.conf6+0.2&&tt<EV.up6+0.3)card('🍴: …just an ant? 🤔',1560,'rgba(15,10,30,0.72)',56,EV.conf6+0.2,tt);
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<6;i++)flash(R[i],0.35,0.15);EV.fm.forEach(d=>flash(d,0.22,0.18,'255,170,90'));flash(EV.scare2,0.2,0.15);flash(EV.lift3,0.25,0.3,'200,220,200');flash(EV.roar4,0.2,0.25,'150,255,170');flash(EV.gob4,0.25,0.25,'255,160,80');
  for(const b of[EV.bolt5a,EV.bolt5b]){const k=tt-b;if(k>=0&&k<0.5){const a=k<0.07?1:k<0.11?0.15:k<0.2?1:1-(k-0.2)/0.3;ctx.fillStyle=`rgba(220,230,255,${0.45*a})`;ctx.fillRect(0,0,W,H)}}
  flash(EV.poof6,0.6,0.35);flash(EV.fork6+1.6,0.15,0.2);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.34;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.1) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
