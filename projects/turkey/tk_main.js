// ===================== EVERYTHING vs ONE TURKEY (main) =====================
function ell(mb,c,r3,colFn,res,mat){const la=res[0],lo=res[1];const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[c[0]+Math.sin(th)*Math.cos(ph)*r3[0],c[1]+Math.cos(th)*r3[1],c[2]+Math.sin(th)*Math.sin(ph)*r3[2]]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
// ---------- turkey (faces -z, feet at y=0, ~1.05 tall) ----------
const TKC={b1:hx('#2e1c10'),b2:hx('#5e3a1e'),bronze:hx('#b07a34'),gold:hx('#d8a050'),wing:hx('#4a3020'),bar:hx('#efe6d4'),tail1:hx('#6a4426'),tailB:hx('#140d08'),tailT:hx('#d8aa68'),skin:hx('#9ccbea'),red:hx('#e2283c'),beak:hx('#ecd29a'),leg:hx('#d0988c'),beard:hx('#16110c')};
const fCol=p=>{const u=p[1]*26+Math.sin(p[0]*16)*0.7,v=p[0]*12+p[2]*12;const s=0.5+0.5*Math.sin(u);const sc=Math.abs(Math.sin(v+u*0.5));const tip=clamp((s-0.72)*5,0,1);
  return mix3(mix3(TKC.b1,TKC.b2,sc*0.55+0.15),mix3(TKC.bronze,TKC.gold,sc*0.5),tip*0.6)};
const TBODY=um(m=>{ell(m,[0,0.47,0.06],[0.26,0.235,0.37],fCol,[18,26]);ell(m,[0,0.53,-0.17],[0.21,0.23,0.19],fCol,[14,20]);ell(m,[0,0.43,0.3],[0.19,0.16,0.19],fCol,[12,18]);
  ell(m,[0,0.3,0.08],[0.18,0.08,0.22],p=>mix3(TKC.b1,hx('#3a2818'),0.5),[8,14])},0.5);
const wCol=p=>{const bar=clamp(Math.sin(p[2]*44)*3-1.6,0,1)*clamp((p[2]-0.12)*6,0,1)*clamp((-p[1]-0.02)*12+0.5,0,1);return mix3(mix3(TKC.wing,TKC.bronze,clamp(0.4-p[1]*4,0,0.5)),TKC.bar,bar*0.9)};
const TWING=um(m=>ell(m,[0,-0.08,0.16],[0.06,0.15,0.27],wCol,[10,16]),0.5); // pivot at shoulder
const TWINGO=um(m=>{ // open wing: extends along +x from pivot, primaries as separate fingers
  ell(m,[0.22,0,0.04],[0.24,0.035,0.15],p=>mix3(TKC.wing,TKC.bronze,0.25),[8,14]);
  for(let i=0;i<8;i++){const f=i/7;const x0=0.3+f*0.12,z0=0.02+f*0.12;const a=-0.5+f*1.1;const L=0.32-f*0.06;const dx=Math.cos(a)*L,dz=Math.sin(a)*L+0.12;
    for(let k=0;k<6;k++){const g0=k/6,g1=(k+1)/6;const w0=0.035*(1-g0*0.4),w1=0.035*(1-g1*0.4);const c0=mix3(TKC.wing,TKC.bar,(k%2)*0.85),c1=c0;
      const p0=[x0+dx*g0,0,z0+dz*g0],p1=[x0+dx*g1,0,z0+dz*g1];const n=[-dz/L*w0,0,dx/L*w0],n1=[-dz/L*w1,0,dx/L*w1];m.quad(V.sub(p0,n),V.sub(p1,n1),V.add(p1,n1),V.add(p0,n),c0)}}},0.4);
const TFEATH=um(m=>{const n=12;for(let i=0;i<n;i++){const f0=i/n,f1=(i+1)/n;const W=f=>0.06*(0.55+0.45*Math.sin(Math.min(1,f*1.15)*Math.PI*0.5))*(f>0.9?Math.sqrt(Math.max(0,1-(f-0.9)/0.1*0.8)):1);
  const C=f=>f<0.72?mix3(TKC.tail1,mix3(TKC.b2,TKC.bronze,0.5),Math.sin(f*40)*0.3+0.3):(f<0.84?TKC.tailB:TKC.tailT);
  m.quad([-W(f0),f0,0],[W(f0),f0,0],[W(f1),f1,0],[-W(f1),f1,0],[C(f0),C(f0),C(f1),C(f1)])}});
const TBEAKU=um(m=>{const tip=[0,-0.015,-0.075];const seg=10;for(let i=0;i<seg;i++){const a=i/seg*Math.PI,b=(i+1)/seg*Math.PI;const p=a2=>[Math.cos(a2)*0.026,Math.sin(a2)*0.022,0];m.tri(p(a),tip,p(b),TKC.beak)}m.quad([-0.026,0,0],[0.026,0,0],[0.02,-0.005,-0.05],[-0.02,-0.005,-0.05],hx('#b8986a'))},0.5);
const TBEAKL=um(m=>{const tip=[0,-0.005,-0.06];const seg=8;for(let i=0;i<seg;i++){const a=Math.PI+i/seg*Math.PI,b=Math.PI+(i+1)/seg*Math.PI;const p=a2=>[Math.cos(a2)*0.022,Math.sin(a2)*0.016,0];m.tri(p(a),p(b),tip,hx('#d8bc88'))}},0.5);
const FORK=um(m=>{const s=hx('#d8dde6'),s2=hx('#a8b0bc');m.box([0,1.7,0],[0.22,2.2,0.07],s,0,s2);m.box([0,0.52,0],[0.5,0.18,0.06],s);for(let i=0;i<4;i++){const x=-0.21+i*0.14;m.box([x,0.18,0],[0.07,0.62,0.05],s);m.prism([x,-0.18,0],0.0,0.035,0.06,6,s)}},0.3);
// shopping cart (faces -z, wheels on y=0, ~0.95 tall)
const CART=um(m=>{const wc=hx('#c8ccd4'),w2=hx('#9aa0aa');const B=(c,s,col)=>m.box(c,s,col||wc);
  for(let i=0;i<=6;i++){const z=-0.45+i*0.15;for(const s of[-1,1])B([s*0.3,0.68,z],[0.02,0.42,0.02])}for(let i=0;i<=4;i++){const x=-0.3+i*0.15;B([x,0.68,-0.45],[0.02,0.42,0.02]);B([x,0.68,0.45],[0.02,0.42,0.02])}
  for(const y of[0.47,0.68,0.89]){for(const s of[-1,1])B([s*0.3,y,0],[0.025,0.025,0.92]);B([0,y,-0.45],[0.62,0.025,0.025]);B([0,y,0.45],[0.62,0.025,0.025])}
  for(let i=0;i<=6;i++)B([0,0.47,-0.45+i*0.15],[0.6,0.02,0.02]);B([0,1.02,0.55],[0.66,0.05,0.05],hx('#e8323a'));for(const s of[-1,1]){B([s*0.31,0.95,0.5],[0.025,0.15,0.1]);B([s*0.22,0.22,0.3],[0.03,0.48,0.03],w2);B([s*0.22,0.22,-0.38],[0.03,0.48,0.03],w2);B([s*0.22,0.06,0],[0.03,0.03,0.9],w2)}
  for(const s of[-1,1])for(const z of[-0.38,0.38]){m.box([s*0.22,0.05,z],[0.035,0.1,0.1],hx('#202228'))}
  B([0,0.36,0.1],[0.5,0.02,0.6],w2)},0.3);
// pumpkin, hay bale
const PUMP=um(m=>{sphC(m,[0,0.42,0],0.5,p=>{const a=Math.atan2(p[2],p[0]);const r=Math.abs(Math.sin(a*4));return mix3(hx('#c85a10'),hx('#f08a24'),r)},[14,24],0,0.78);m.prism([0,0.75,0],0.06,0.04,0.18,6,hx('#4a5a22'))},0.5);
const HAY=um(m=>{m.prism([0,0,0],0.55,0.55,1.0,22,hx('#d8b05a'));m.ico([0,1.0,0],0.53,hx('#e8c46c'),0,0.05,[6,22]);},0.4);
// tornado funnel: surface of revolution, bands
const TORN=um(m=>{const NY=26,NA=30;const R=y=>0.35+Math.pow(y/14,1.7)*5.2;for(let i=0;i<NY;i++)for(let j=0;j<NA;j++){const y0=i/NY*14,y1=(i+1)/NY*14,a0=j/NA*TAU2,a1=(j+1)/NA*TAU2;const w=y=>Math.sin(y*0.5)*0.35;
  const P=(y,a)=>{const r=R(y)*(1+0.12*Math.sin(a*3+y*1.3));return[Math.cos(a)*r+w(y),y,Math.sin(a)*r]};const C=(y,a)=>mix3(hx('#77766e'),hx('#c4c2b8'),0.5+0.5*Math.sin(a*5+y*2.2));m.quad(P(y0,a0),P(y1,a0),P(y1,a1),P(y0,a1),[C(y0,a0),C(y1,a0),C(y1,a1),C(y0,a1)])}},0.6);
// ---------- farm tile ----------
function buildFarm(){const T=40,m=new MB();const r=rngG(12);
  ground(m,-1.5,-T,1.5,0,null,0.0,0.5,(x,z)=>{const n=0.5+0.25*fbm(x*0.9+3,z*0.9,3);const rut=Math.exp(-Math.pow((Math.abs(x)-0.75)/0.18,2));return mix3([0.46*n+0.18,0.33*n+0.12,0.2*n+0.08],[0.28,0.19,0.12],rut*0.5)});
  for(const s of[-1,1])ground(m,s>0?1.5:-60,-T,s>0?60:-1.5,0,null,0.0,1.0,(x,z)=>{const q=fbm(x*0.12,z*0.12+s*9,3);const lf=clamp((fbm(x*0.5+5,z*0.5,2)-0.6)*5,0,1);return mix3([0.34+q*0.12,0.48+q*0.12,0.18],[0.78,0.42,0.12],lf*0.7)});
  for(let i=0;i<1400;i++){const s=r()<0.5?-1:1;const x=s*(1.45+Math.pow(r(),1.8)*14),z=-r()*T;const h=0.07+r()*0.2,yaw=r()*TAU2,w=0.02+r()*0.02;const lx=(r()-0.5)*h*0.6,lz=(r()-0.5)*h*0.6;
    const b0=[x+Math.cos(yaw)*w,0,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,0,z-Math.sin(yaw)*w],tip=[x+lx,h,z+lz];const ct=r()<0.2?hx('#d8a040'):hx(r()<0.5?'#8ac050':'#a8c860');m.tri(b0,b1,tip,[hx('#3a6a22'),hx('#3a6a22'),ct])}
  for(let k=0;k<16;k++){const z=-k*2.5;for(const s of[-1,1]){m.box([s*2.6,0.45,z],[0.1,0.9,0.1],hx('#7a5a3a'),0,hx('#9a7a52'));}}
  for(const s of[-1,1])for(const y of[0.35,0.72])m.box([s*2.6,y,-T/2],[0.05,0.09,T],hx('#8a6a46'),0,hx('#a8865a'));
  return{mesh:m.build(0.45),T}}
const FARM=buildFarm();
const PROPS=[];{const r=rngG(5);for(let i=0;i<10;i++){const s=r()<0.5?-1:1;PROPS.push({k:r()<0.6?'p':'h',x:s*(3.3+r()*4),z:-r()*40,s:r()<0.6?0.35+r()*0.25:0.9,yaw:r()*6})}
  PROPS.push({k:'p',x:-1.9,z:-6,s:0.4,yaw:1},{k:'p',x:2.0,z:-22,s:0.32,yaw:2},{k:'h',x:-4.2,z:-14,s:1,yaw:0},{k:'h',x:4.6,z:-31,s:1,yaw:0})}
const FTREES=[];{const r=rngG(8);for(let i=0;i<14;i++){const m=new MB();tree(m,0,0,1.5+r()*1.1,0,r()<0.3?'pine':'');FTREES.push({mesh:m.build(0.4),x:(r()<0.5?-1:1)*(8+r()*18),z:-r()*40,tint:[[0.85,0.42,0.12],[0.9,0.62,0.15],[0.7,0.25,0.12],null][i%4]})}}
// background (meters, static)
let BGG;{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#7a9a4a'));const r=rngG(77);for(let i=0;i<300;i++){const a=r()*TAU2,d=300+r()*3000;tree(m,Math.cos(a)*d,Math.sin(a)*d,8+r()*8,0,r()<0.4?'pine':'')}
  house(m,-70,330,40,26,18,hx('#a8322a'),hx('#4a3a36'),0.2);m.prism([-25,0,345],7,7,34,20,hx('#c8c4bc'));m.ico([-25,34,345],7,hx('#8a8e96'),0,0.6,[8,20]);house(m,90,420,24,18,10,hx('#e8e0d0'),hx('#5a4a44'),-0.3);BGG=m.build(0.5)}
// ---------- timeline ----------
const R=[3.0,12.0,21.5,31.0,41.5,52.0,61.0];
const EV={fan0:0.25,gob0:0.55,
  met1:5.0,fm:[5.9,6.5,7.0,7.5,8.0,8.4,8.8,9.2],res1:9.8,
  carts:12.6,scare2:14.6,run2:15.0,res2:18.6,slow2:19.8,
  torn3:21.8,lift3:24.6,fly3:26.6,land3:29.0,res3:28.0,
  rex4:31.3,stop4:34.0,roar4:34.6,turn4:36.0,gob4:36.6,flinch4:37.2,bow4:38.0,res4:38.0,back4:39.6,
  rain5:42.0,look5:44.3,myth5:45.0,bust5:47.3,res5:48.8,bolt5a:42.9,bolt5b:47.0,
  wait6:53.4,fin6:54.3,fork6:54.6,poof6:56.7,conf6:57.2,up6:58.3,res6:58.6,ant6:59.3,endc:61.0,loop:65.5};
const ROUNDS=[['ROUND 1','Meteor shower ☄️ 71 km/s','270° vision 👀 dodged ALL',EV.res1],['ROUND 2','BLACK FRIDAY stampede 🛒','Outran Black Friday 💨',EV.res2],['ROUND 3','TORNADO 🌪️','Just… flew away 🪽',EV.res3],['ROUND 4','T. REX 🦖','It’s family 🤝',EV.res4],['ROUND 5','Thunderstorm 🌧️⚡','Free shower 🚿',EV.res5],['FINAL ROUND','THANKSGIVING 🍽️','#DisguiseATurkey 10/10 🐜',EV.res6]];
function roundAt(t){for(let i=5;i>=0;i--)if(t>=R[i])return i;return -1}
const TKX=[0.38,-0.38,0.4,-0.36,0.34,-0.4,0.36,0];
const HPV=[100,88,71,52,40,23,23];
function hpAt(t){const rn=roundAt(t);if(rn<0)return 100;const hits=[EV.fm[3],EV.scare2+0.5,EV.lift3+0.6,EV.roar4,EV.bolt5b,1e9];let v=HPV[rn];if(t>=hits[rn])v=lerp(HPV[rn],HPV[rn+1],ease((t-hits[rn])/0.6));return v}
// ground speed (scroll) multiplier
function spd(t){let s=1;if(t>=EV.run2&&t<EV.slow2+1.5)s=1+2.6*ease((t-EV.run2)/0.4)*(1-ease((t-EV.slow2)/1.5));
  if(t>=EV.lift3&&t<EV.land3+0.3)s=0.0+(t>EV.fly3?1.8*ease((t-EV.fly3)/0.6)*(1-ease((t-EV.land3+0.2)/0.5)):0);
  if(t>=EV.stop4-0.6&&t<EV.back4)s=1-ease((t-EV.stop4+0.6)/0.6);if(t>=EV.back4&&t<R[4])s=ease((t-EV.back4)/0.8);
  if(t>=EV.look5-0.5&&t<EV.res5+0.4)s=1-ease((t-EV.look5+0.5)/0.5);if(t>=EV.res5+0.4&&t<R[5])s=ease((t-EV.res5-0.4)/0.6);
  if(t>=EV.wait6-0.4&&t<EV.ant6)s=1-ease((t-EV.wait6+0.4)/0.5);if(t>=EV.ant6)s=0;
  if(t>=EV.fm[0]-0.6&&t<EV.res1+0.2)s=0.35;return s}
const DTAB=[];{let d=0;for(let i=0;i<=DUR*60;i++){DTAB.push(d);d+=spd(i/60)/60}}
function distAt(t){const f=clamp(t*60,0,DUR*60);const i=Math.floor(f),k=f-i;return lerp(DTAB[i],DTAB[Math.min(i+1,DTAB.length-1)],k)}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.6,-0.6],sunCol:hx('#fff0d4'),sky:hx('#a8c8ea'),gnd:hx('#8a8a60'),fog:hx('#d8e2e6'),fogD:5000,zen:hx('#3c78d0'),hor:hx('#f0e6d4'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#d8e2e6')},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const E_DAY=envBase();
const E_NIGHT=envBase({sun:[0.3,0.5,-0.7],sunCol:hx('#7088c8'),sky:hx('#2a3a68'),gnd:hx('#2a3040'),fog:hx('#141a34'),hor:hx('#2a3466'),zen:hx('#03040f'),stars:1,night:1,fogD:2200,gndCol:hx('#141a34')});
const E_TORN=envBase({sun:[0.3,0.45,-0.6],sunCol:hx('#a8b098'),sky:hx('#5a6a5e'),gnd:hx('#3a4232'),fog:hx('#6a7468'),hor:hx('#8a9484'),zen:hx('#2a3430'),fogD:2600,gndCol:hx('#6a7468')});
const E_RAIN=envBase({sun:[0.3,0.5,-0.6],sunCol:hx('#7a88a8'),sky:hx('#3a4660'),gnd:hx('#2a3038'),fog:hx('#4a5468'),hor:hx('#5a6478'),zen:hx('#1a2030'),fogD:1800,night:0.5,gndCol:hx('#4a5468')});
const E_GOLD=envBase({sun:[0.6,0.28,-0.5],sunCol:hx('#ffc888'),sky:hx('#e8b890'),fog:hx('#f0c8a0'),hor:hx('#ffc890'),zen:hx('#5a6ad0'),gnd:hx('#8a6a50'),gndCol:hx('#f0c8a0')});
function envAt(t){const rn=roundAt(t);let e=E_DAY;
  if(rn===0)e=mixEnv(E_DAY,E_NIGHT,ease((t-R[0]-0.2)/1.4)*(1-ease((t-R[1]+0.6)/0.6)));
  if(rn===2)e=mixEnv(E_DAY,E_TORN,ease((t-R[2])/1.2)*(1-ease((t-EV.land3)/1.5)));
  if(rn===4)e=mixEnv(E_DAY,E_RAIN,ease((t-R[4])/1.0)*(1-ease((t-EV.res5-0.4)/1.4)));
  if(rn===5)e=mixEnv(E_DAY,E_GOLD,ease((t-EV.wait6)/1.0));
  return e}
// ---------- turkey state ----------
function tkState(t){const s={x:0,y:0,z:0,yaw:0,pose:'walk',walk:1,fan:0,gob:-1,lookUp:0,beak:0,lid:0.35,shiver:0,disg:0,spin:0,pitch:0};const rn=roundAt(t);
  if(t<R[0]){s.fan=lerp(0.55,1,ease(t/0.3));s.walk=0.6;if(t>=EV.gob0&&t<EV.gob0+1.0)s.gob=t-EV.gob0}
  if(t>=R[0]&&t<R[0]+0.6)s.fan=1-ease((t-R[0])/0.6);
  if(rn===0){if(t>=EV.met1)s.lid=0.05;s.walk=0.5;let x=0;EV.fm.forEach((f,i)=>{const k=ease((t-(f-0.24))/0.22);x=lerp(x,TKX[i],k);const kh=(t-(f-0.24))/0.4;if(kh>=0&&kh<1)s.y=Math.max(s.y,Math.sin(kh*Math.PI)*0.38)});
    s.x=x*(1-ease((t-EV.res1)/0.8));if(t>=EV.fm[0]-0.3&&t<EV.res1)s.lid=0}
  if(rn===1){if(t>=EV.scare2&&t<EV.run2){s.lid=0;s.y=Math.sin(clamp((t-EV.scare2)/0.4,0,1)*Math.PI)*0.35;s.walk=0;s.fan=0.5}
    if(t>=EV.run2&&t<EV.slow2+1.2){s.pose='run';s.lid=0.05}if(t>=EV.res2)s.lid=0.3}
  if(rn===2){if(t>=EV.torn3+1.2&&t<EV.lift3)s.lid=0.0;
    if(t>=EV.lift3&&t<EV.land3){const k=t-EV.lift3;const up=easeIn(clamp(k/1.6,0,1));s.pose=t<EV.fly3?'tumble':'fly';s.lid=0;
      if(t<EV.fly3){s.y=up*2.3;s.spin=k*k*5;s.x=Math.sin(k*5)*0.5*up;s.z=0.4*up}
      else{const f=ease((t-EV.fly3)/(EV.land3-EV.fly3));s.y=lerp(2.3,0,f)+Math.sin(f*Math.PI)*0.6;s.x=lerp(Math.sin((EV.fly3-EV.lift3)*5)*0.5,0,f);s.z=lerp(0.4,0,f);s.spin=(EV.fly3-EV.lift3)**2*5*(1-ease((t-EV.fly3)/0.5));s.pitch=0.25*(1-f)}}
    if(t>=EV.land3&&t<EV.land3+0.3){s.y=0;s.walk=0}}
  if(rn===3){if(t>=EV.rex4+0.8)s.lid=0.1;if(t>=EV.turn4-0.5&&t<EV.back4+0.5){const a=ease((t-EV.turn4+0.5)/0.5)*(1-ease((t-EV.back4)/0.5));s.yaw=Math.PI*a;s.walk=0}
    if(t>=EV.gob4&&t<EV.gob4+1.3){s.gob=t-EV.gob4;s.fan=1}if(t>=EV.gob4-0.3&&t<EV.back4)s.fan=Math.max(s.fan,ease((t-EV.gob4+0.3)/0.25));if(t>=EV.roar4&&t<EV.turn4){s.shiver=1;s.lid=0}
    if(t>=EV.back4)s.fan=Math.max(s.fan,1-ease((t-EV.back4)/0.6))}
  if(rn===4){if(t>=EV.look5&&t<EV.res5+0.3){s.lookUp=ease((t-EV.look5)/0.5);s.beak=0.6+0.2*Math.sin(t*7);s.walk=0}if(t>=EV.res5-0.3&&t<EV.res5+0.5)s.shiver=1}
  if(rn===5){if(t>=EV.wait6)s.walk=0;if(t>=EV.fork6&&t<EV.poof6){s.shiver=1;s.lid=0}if(t>=EV.poof6)s.disg=1;if(t>=EV.poof6&&t<EV.up6)s.lid=0.55;
    if(t>=EV.up6+0.5){s.lid=0.3}if(t>=EV.res6+0.2&&t<EV.ant6+0.3)s.fan=ease((t-EV.res6-0.2)/0.3)}
  if(t>=R[6]){s.walk=0;s.disg=1;s.fan=1}
  return s}
function tkItems(t,s){const it=[];const P=(M,mesh,c,sc,col,rot,ns)=>it.push({mesh,M:M4.mul(M,M4.trs(c,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,sc)),tint:col,tintAmt:col?1:0,noShadow:!!ns});
  const run=s.pose==='run',fly=s.pose==='fly'||s.pose==='tumble';const fr=run?11:5.6;const ph=t*fr;const walk=fly?0:(run?1.4:s.walk);
  const bob=walk*0.025*Math.abs(Math.sin(ph));const sh=s.shiver?0.012*Math.sin(t*70):0;
  let Root=M4.trs([s.x+sh,s.y,s.z],s.yaw+s.spin,0,0,1);
  let B=M4.mul(Root,M4.trs([0,bob,0],0,(run?0.32:0)+s.pitch+(fly?0.15:0),walk*0.05*Math.sin(ph),1));
  it.push({mesh:TBODY,M:B});
  // tail fan
  const fan=s.fan,nf=15;for(let i=0;i<nf;i++){const f=i/(nf-1)-0.5;const spread=lerp(0.25,2.75,fan);const a=f*spread;const L=lerp(0.42,0.62,fan)*(1-Math.abs(f)*0.25*fan);const tilt=lerp(1.25,0.22,fan)+(s.gob>=0?0.05*Math.sin(t*30):0);
    it.push({mesh:TFEATH,M:M4.mul(B,M4.mul(M4.trs([0,0.53,0.34+0.02*Math.abs(f)],0,tilt,0,1),M4.trs([0,0,0.004*i],0,0,-a,[L*lerp(0.7,1,fan),L,1]))),tint:null,tintAmt:0})}
  // wings
  for(const sd of[-1,1]){const sp=[sd*0.23,0.58,-0.1];if(fly){const fl=s.pose==='tumble'?Math.sin(t*20+sd)*0.9:Math.sin(t*15)*0.65;const Mw=M4.mul(B,M4.trs(sp,0,0,sd*fl,1));it.push({mesh:TWINGO,M:M4.mul(Mw,M4.trs([0,0,0],0,0,0,[sd,1,1]))})}
    else{const op=run?0.35+0.15*Math.sin(t*22):(s.gob>=0?0.15:0)+(s.shiver?0.1:0);it.push({mesh:TWING,M:M4.mul(B,M4.trs(sp,sd*op,0,sd*op*0.6,1))})}}
  // neck + head
  const hb=walk*0.05*Math.sin(ph*2);const gk=s.gob>=0&&s.gob<1.0?1:0;const gs=gk?Math.sin(s.gob*40)*0.12:0;
  const lu=s.lookUp;const hp=[0+gs*0.3,0.87+0.03*lu-(run?0.05:0),-0.3-hb-(run?0.08:0)+lu*0.04];const nb=[0,0.62,-0.22];
  it.push({mesh:UCYL,M:M4.mul(B,segM(nb,V.add(hp,[0,-0.04,0.01]),0.055)),tint:TKC.skin,tintAmt:1});
  for(let i=0;i<4;i++){const f=0.25+i*0.15;const q=V.add(V.add(nb,V.sc(V.sub(hp,nb),f)),[0,-0.02,-0.04]);P(B,USPH,q,[0.035,0.035,0.03],TKC.red,null,1)}
  const Hd=M4.mul(B,M4.trs(hp,0,-0.6*lu+gs*0.5,gs,1));
  P(Hd,USPH,[0,0,0],[0.07,0.075,0.08],TKC.skin);P(Hd,USPH,[0,0.06,0.01],[0.045,0.03,0.05],mix3(TKC.skin,[1,1,1],0.3),null,1);
  P(Hd,USPH,[0,-0.08,-0.02],[0.035,0.06,0.035],TKC.red,[0,0.2,gs],1);P(Hd,USPH,[0.012,-0.12,-0.03],[0.028,0.035,0.028],TKC.red,null,1);
  const bo=s.beak+(gk?0.4+0.4*Math.sin(s.gob*36):0);it.push({mesh:TBEAKU,M:M4.mul(Hd,M4.trs([0,0.0,-0.065],0,0,0,1)),tint:null,tintAmt:0,noShadow:true});it.push({mesh:TBEAKL,M:M4.mul(Hd,M4.trs([0,-0.006,-0.065],0,-bo*0.6,0,1)),tint:null,tintAmt:0,noShadow:true});
  // snood
  const sw=Math.sin(t*3.1)*0.15+gs*2+(run?0.5:0);const s0=[0,0.035,-0.07],s1=[0.012+sw*0.04,-0.03,-0.11],s2=[0.02+sw*0.07,-0.1,-0.115];it.push({mesh:UCYL,M:M4.mul(Hd,segM(s0,s1,0.015)),tint:TKC.red,tintAmt:1,noShadow:true});it.push({mesh:UCYL,M:M4.mul(Hd,segM(s1,s2,0.013)),tint:TKC.red,tintAmt:1,noShadow:true});P(Hd,USPH,s2,0.016,TKC.red,null,1);
  // eyes
  const lid=s.lid;for(const sd of[-1,1]){const ec=[sd*0.05,0.025,-0.045];P(Hd,USPH,ec,[0.032,0.04,0.03],[0.97,0.97,0.97],null,1);P(Hd,USPH,[ec[0]+sd*0.004,ec[1]-0.004,ec[2]-0.024],[0.018,0.024,0.012],[0.03,0.03,0.04],null,1);P(Hd,USPH,[ec[0]-sd*0.004,ec[1]+0.008,ec[2]-0.034],[0.006,0.007,0.003],[1,1,1],null,1);
    if(lid>0.02)P(Hd,USPH,[ec[0],ec[1]+0.05-lid*0.05,ec[2]+0.002],[0.035,0.032,0.033],TKC.skin,[0,0,sd*-0.12],1)}
  // legs
  for(const sd of[-1,1]){const hip=[sd*0.1,0.27,0.04];const g=ph+(sd>0?Math.PI:0);let foot;
    if(fly){foot=[sd*0.08,0.22,0.3]}else{const lift=Math.max(0,Math.sin(g))*0.1*walk;foot=[sd*0.12,lift,-0.02+0.14*Math.cos(g)*walk]}
    const ank=V.add(V.sc(V.add(hip,foot),0.45),[0,0.0,0.05]);const lc=TKC.leg;it.push({mesh:UCYL,M:M4.mul(Root,segM(hip,ank,0.03)),tint:lc,tintAmt:1});it.push({mesh:UCYL,M:M4.mul(Root,segM(ank,foot,0.022)),tint:lc,tintAmt:1});P(Root,USPH,ank,0.03,lc);
    for(const a of[-0.45,0,0.45]){const toe=V.add(foot,fly?[Math.sin(a)*0.06,-0.02,0.06]:[Math.sin(a)*0.09,0.0,-Math.cos(a)*0.09]);it.push({mesh:UCYL,M:M4.mul(Root,segM(foot,toe,0.012)),tint:lc,tintAmt:1})}
    it.push({mesh:UCYL,M:M4.mul(Root,segM(foot,V.add(foot,[0,0.005,0.06]),0.011)),tint:lc,tintAmt:1})}
  // disguise: antennae + bandage + matchstick crutch
  if(s.disg>0){const d=s.disg;for(const sd of[-1,1]){const base=M4.mul(Hd,M4.trs([sd*0.03,0.07,-0.01],0,0,0,1));const e1=[sd*0.05,0.12,-0.02],droop=sd<0;const e2=V.add(e1,droop?[sd*0.06,-0.1,-0.08]:[sd*0.05,0.06,-0.1]);
      it.push({mesh:UCYL,M:M4.mul(base,segM([0,0,0],e1,0.009)),tint:AC.leg,tintAmt:1,noShadow:true});it.push({mesh:UCYL,M:M4.mul(base,segM(e1,e2,0.008)),tint:AC.leg,tintAmt:1,noShadow:true});P(base,USPH,e2,0.017,AC.leg,null,1);P(base,USPH,e1,0.012,AC.leg,null,1)}
    P(Hd,UB,[0.015,0.07,0],[0.13,0.022,0.04],AC.band,[0.3,0,0.45],1);P(Hd,UB,[0.015,0.07,0],[0.13,0.022,0.04],AC.band,[0.3,0,-0.45],1);
    const g0=[0.42,0,-0.12],top=[0.3,0.54,-0.06];it.push({mesh:UCYL,M:M4.mul(Root,segM(g0,top,0.022)),tint:AC.wood,tintAmt:1});P(Root,USPH,top,[0.04,0.05,0.04],AC.match);
    P(Root,USPH,[0,0.02,0.05],[0.32,0.012,0.4],[0.05,0.04,0.04],null,1)}
  return it}
// ---------- camera ----------
function camAt(t){let eye=[1.45,1.05,-3.4],at=[0,0.62,0.3];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.22;
  if(t<R[0]){const k=ease(t/R[0]);eye=[lerp(0.75,1.2,k),lerp(0.82,1.0,k),lerp(-2.1,-3.1,k)];at=[0,lerp(0.78,0.7,k),0.2]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.2,1.9,k)+sway,lerp(1.0,0.75,k),lerp(-3.1,-4.0,k)];at=[0,lerp(0.7,1.4,k),1.0];if(t>EV.fm[0]-0.8){const kk=ease((t-EV.fm[0]+0.8)/0.8);at=V.add(at,[0,-0.6*kk,-0.4*kk])}}
  if(rn===1){const k=ease((t-R[1])/1.0);eye=[lerp(-1.6,-1.9,k),lerp(1.5,1.2,k),-4.0];at=[0,0.7,2.4];if(t>=EV.run2){const kk=ease((t-EV.run2)/0.8);eye=V.add(eye,[0.6*kk,-0.35*kk,0.4*kk])}}
  if(rn===2){const k=ease((t-R[2])/1.5);eye=[lerp(1.7,2.6,k),lerp(0.9,0.55,k),lerp(-3.6,-6.8,k)];at=[0,lerp(0.8,3.4,k),4.0];
    if(t>=EV.lift3){const ts=tkState(t);const kk=ease((t-EV.lift3)/0.8);at=[lerp(at[0],ts.x,kk),lerp(at[1],ts.y+0.6,kk),lerp(at[2],ts.z,kk)];eye=[lerp(2.6,2.2,kk),lerp(0.55,ts.y*0.8+0.9,kk),lerp(-6.8,-4.6,kk)]}
    if(t>=EV.land3){const kk=ease((t-EV.land3)/1.0);eye=[lerp(2.2,1.5,kk),lerp(0.9,1.0,kk),-4.0];at=[0,lerp(0.6,0.65,kk),0.3]}}
  if(rn===3){const k=ease((t-R[3])/1.5);eye=[lerp(2.2,2.7,k)+sway*0.3,lerp(0.9,0.5,k),lerp(-4.2,-5.2,k)];at=[0,lerp(0.9,2.0,k),2.6];if(t>=EV.turn4-0.3&&t<EV.back4+0.4){const kk=ease((t-EV.turn4+0.3)/0.8);eye=V.add(eye,[-0.4*kk,0.15*kk,1.1*kk]);at=V.add(at,[0,-0.5*kk,-0.6*kk])}}
  if(rn===4){const k=ease((t-R[4])/1.5);eye=[lerp(1.4,1.1,k)+sway*0.2,lerp(1.0,0.7,k),lerp(-3.2,-2.7,k)];at=[0,lerp(0.7,0.95,k),0.2];if(t>=EV.look5){const kk=ease((t-EV.look5)/1.0);eye=V.add(eye,[-0.2*kk,-0.15*kk,0.25*kk]);at=V.add(at,[0,0.2*kk,0])}}
  if(rn===5){const k=ease((t-R[5])/2);eye=[lerp(1.6,1.2,k),lerp(1.0,0.95,k),lerp(-3.6,-3.3,k)];at=[0,0.7,0.2];if(t>=EV.fork6-0.2&&t<EV.poof6){const kk=ease((t-EV.fork6+0.2)/0.8);eye=V.add(eye,[0.2*kk,-0.25*kk,-0.6*kk]);at=V.add(at,[0,0.75*kk,0])}
    if(t>=EV.poof6){const kk=ease((t-EV.poof6)/0.6);eye=[lerp(1.4,1.25,kk),lerp(0.7,0.85,kk),lerp(-3.9,-2.9,kk)];at=[0,lerp(1.45,0.65,kk),0.1]}
    if(t>=EV.ant6-0.3){const kk=ease((t-EV.ant6+0.3)/1);eye=V.add(eye,[0.25*kk,-0.25*kk,-0.2*kk]);at=V.add(at,[0.25*kk,-0.2*kk,0])}}
  if(t>=R[6]){const kk=ease((t-R[6])/1.5);eye=[1.5,0.6+kk*0.2,-3.2];at=[0.25,0.45+kk*0.1,0.1]}
  return{eye,at}}
