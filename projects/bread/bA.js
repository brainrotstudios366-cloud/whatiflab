// ================= timeline & animation =================
const EV={laugh1:2.9,dad1:4.75,cartIn:7.4,maxIn:7.6,swipe:9.85,splat:10.7,mock:12.0,sad:13.5,night:14.9,look0:16.8,look1:17.7,kitch:19.0,fail:[21.95,22.75,24.1],gold:24.9,later:26.4,truck:28.0,villCut:29.8,stop:31.2,side:31.6,lb:34.1,shops:35.5,door:36.0,out:36.2,silent:38.0,saw:40.0,turn:40.9,cartPan:42.4,reveal:45.15,cant:46.4,walk2:46.4,arrive:50.0,bought:49.75,fly:50.3,said:51.5,never:52.6,away:54.6,endc:58.4,loop:65.6};
const C0=[0.5,0,4.0],PUD=[1.35,0.03,2.35],C2=[5.8,0,3.6],MAXP=[5.8,0,4.65],TP=[-1.0,0,0.3],K=[400,0,0];
const yawTo=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
const angL=(a,b,k)=>{let d=b-a;while(d>Math.PI)d-=TAU2;while(d<-Math.PI)d+=TAU2;return a+d*k};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){return t>=EV.kitch&&t<EV.later?'kitchen':'village'}
function era(t){return t>=EV.later?2:1}
// villagers
const VIL1=[['v1',[-2.9,0,1.5]],['v2',[-2.1,0,0.1]],['v4',[2.1,0,0.9]],['v5',[2.7,0,2.4]],['v6',[-3.1,0,4.4]],['v3',[1.0,0,0.4]],['v7',[2.9,0,5.4]]];
const VIL2=[['v1',[-4.6,0,4.6]],['v2',[-3.2,0,6.4]],['v4',[2.6,0,6.6]],['v6',[-6.2,0,2.8]],['v7',[-1.2,0,6.9]],['v3',[0.7,0,6.2]],['v5',[3.6,0,7.6]]];
const LEO1=[-0.9,0,3.0];
let LEOR=null,MAXR=null,DADR=null,VR=[],F1R=null;
function walkSt(t,t0,t1,a,b,spd){const k=seg(t,t0,t1);const kk=ease(k);const p=lerp3(a,b,kk);const moving=t>t0&&t<t1;const amp=moving?0.55*Math.min(1,Math.min(t-t0,t1-t)/0.25):0;return{pos:p,walk:{ph:(t-t0)*(spd||9),amp},ry:yawTo(a,b),k}}
function laughSt(t,i){return{bob:Math.abs(Math.sin(t*14+i))*0.05,lean:-0.12,head:{p:-0.25+0.05*Math.sin(t*14+i)},face:{eyes:'happy',mouth:'laugh',open:0.5+0.5*Math.sin(t*14+i)}}}
function cast(t){const L=[];const E=era(t);const S=scn(t);
  if(S==='kitchen'){L.push(['leo',leoKitchen(t)]);return L}
  if(E===1){const night=t>=EV.night;
    // villagers
    if(!night){VIL1.forEach(([k,p],i)=>{let st;if(t<EV.laugh1){st=laughSt(t,i);st.pos=p;st.ry=yawTo(p,LEO1);if(i%2===0)st.aR={f:1.45,s:0.1};else st.aL={f:0.6,s:-0.2},st.aR={f:0.6,s:-0.2}}
        else if(t<EV.mock){const a=p,b=[p[0]*2.4+(p[0]>0?1:-1)*1.5,0,8.5+i*0.3];const w=walkSt(t,EV.laugh1+i*0.08,EV.laugh1+i*0.08+1.8,a,b,9);st=w;st.face={}}
        else{st={pos:[p[0]*2.4+(p[0]>0?1:-1)*1.5,0,8.5+i*0.3]};st.ry=yawTo(st.pos,[-0.5,0,3]);st.face={mouth:'laugh',eyes:'happy',open:0.3};st.bob=Math.abs(Math.sin(t*12+i))*0.03}
        L.push([k,st])})}
    // dad
    if(!night){const wav=t>=EV.laugh1&&t<EV.dad1+1;L.push(['dad',{pos:[1.75,0,9.1],ry:Math.PI,aR:wav?{f:2.7,s:0.25+0.25*Math.sin(t*10)}:{f:0.2},face:{eyes:wav?'happy':'open',mouth:'smile'}}])}
    // leo
    let ls;
    if(t<EV.laugh1){ls={pos:LEO1,ry:Math.PI-0.25,head:{p:0.35,y:0.2},face:{mouth:'sad',brow:'sad',look:[0.6,-1]},aL:{f:0.15},aR:{f:0.15}}}
    else if(t<EV.cartIn+0.2){const cx=lerp(-7.5,C0[0],easeOut(seg(t,EV.dad1,EV.cartIn)));ls={pos:[cx-1.75,0,C0[2]],ry:Math.PI/2,walk:{ph:t*8,amp:t<EV.cartIn?0.5:0},aL:{f:1.2},aR:{f:1.2},face:{mouth:'flat'}}}
    else if(t<EV.night){const shock=t>=EV.swipe+0.1;ls={pos:[0.6,0,5.05],ry:Math.PI,face:{mouth:shock?'o':'smile',eyes:shock?'wide':'open',open:1.2},aL:shock?{f:2.4,s:0.3}:{f:0.3},aR:shock?{f:2.4,s:0.3}:{f:0.3}};
      if(t>=EV.splat+0.4){ls.aL={f:0.2};ls.aR={f:0.2};ls.head={p:0.4};ls.face={mouth:'sad',brow:'sad',tear:t>=EV.sad?(t-EV.sad)*0.8:null,look:[0,-1]}}}
    else{// night walk
      const x0=2.5;let x=x0+Math.max(0,Math.min(t,EV.look0)-EV.night)*1.6+Math.max(0,t-EV.look1)*1.6;const lk=t>=EV.look0&&t<EV.look1+0.3;const tb=seg(t,EV.look0,EV.look0+0.35)*(1-seg(t,EV.look1,EV.look1+0.3));
      ls={pos:[x,0,0.5],ry:Math.PI/2-2.3*tb,pack:1,walk:{ph:t*7,amp:lk?0.5*(1-tb):0.45},head:{p:0.15,y:-0.3*tb},face:{mouth:'sad',brow:'sad',eyes:'open',tear:lk?(t-EV.look0)*0.7:null},aL:{f:0},aR:{f:0}}}
    L.push(['leo',ls]);
    // max & friends
    if(t>=EV.maxIn&&t<EV.night){const MP=[-1.7,0,4.35],F1=[-2.7,0,3.4],F2=[-2.6,0,5.3];
      const mk=(p,off,k)=>{const w=walkSt(t,EV.maxIn+off,EV.maxIn+off+1.8,[p[0]-6,0,p[2]-1],p,8);return w};
      let m=mk(MP,0);if(t>=EV.maxIn+1.8){m.ry=yawTo(MP,[0.6,0,4.0]);m.face={mouth:'smirk',brow:'angry'}}
      if(t>=EV.swipe-0.35&&t<EV.mock){const k=(t-(EV.swipe-0.35))/0.45;m.aR={f:1.4,s:k<1?0.9-1.4*easeOut(k):-0.5,tw:0};m.face={mouth:k<1?'flat':'laugh',eyes:k<1?'open':'happy',brow:k<1?'angry':0,open:0.6}}
      if(t>=EV.mock){m.ry=yawTo(MP,[0.6,0,5.05]);Object.assign(m,laughSt(t,7));m.aR={f:1.5,s:0.0};m.aL={f:0.7,s:-0.35}}
      L.push(['max',m]);
      for(const[k,p,o]of[['f1',F1,0.25],['f2',F2,0.45]]){const f=mk(p,o);if(t>=EV.maxIn+o+1.8)f.ry=yawTo(p,[0.6,0,4.5]);if(t>=EV.swipe+0.3){Object.assign(f,laughSt(t,o*10));f.aL={f:0.7,s:-0.3}}else f.face={mouth:'smirk'};L.push([k,f])}}
    return L}
  // era 2
  const sil=t>=EV.silent-0.2&&t<EV.saw+0.3;
  VIL2.forEach(([k,p],i)=>{const tgt=t<EV.out?[TP[0],0,TP[2]]:(t<EV.walk2?[-2.6,0,-2.4]:LEOA(t).pos);let st={pos:p,ry:yawTo(p,tgt),face:{mouth:sil?'o':(t>=EV.truck?'o':'smile'),eyes:sil||t>=EV.truck&&t<EV.silent?'wide':'open',open:sil?1.3:0.8}};
    if(t<EV.truck){st.ry=yawTo(p,[0,0,0])+Math.sin(t*0.5+i)*0.4;st.face={mouth:'smile'}}
    if(t>=EV.bought&&t<EV.endc){st.face={mouth:'o',eyes:'wide',open:1}}
    if(t>=EV.away){st.face={mouth:'smile',eyes:'happy'};st.aL={f:1.2+0.25*Math.sin(t*16+i),s:-0.5};st.aR={f:1.2+0.25*Math.sin(t*16+i+1),s:-0.5}}
    L.push([k,st])});
  L.push(['dad',{pos:[1.75,0,9.1],ry:Math.PI,face:{mouth:t>=EV.out?'smile':'smile',eyes:t>=EV.silent?'happy':'open',tear:t>=EV.silent&&t<EV.endc?(t-EV.silent)*0.6:null},aL:t>=EV.silent?{f:0.5}:{f:0.1},aR:{f:0.1}}]);
  if(t>=EV.out)L.push(['leoA',LEOA(t)]);
  L.push(['maxA',MAXA(t)]);
  return L}
function LEOA(t){const P0=[-3.25,0,-1.2],P1=[-2.6,0,-2.4],P2=[5.25,0,2.35],P3=[-2.8,0,-2.0];
  if(t<EV.out+0.8){const w=walkSt(t,EV.out,EV.out+0.8,P0,P1,8);w.ry=Math.PI;w.face={mouth:'smirk'};return w}
  if(t<EV.walk2){const turnK=ease(seg(t,EV.turn,EV.turn+0.6));const st={pos:P1,ry:angL(Math.PI+0.25,yawTo(P1,MAXP),turnK),face:{mouth:t<EV.turn?'smirk':'flat',brow:t>=EV.turn?'up':0}};
    if(t>=EV.out+0.8&&t<EV.out+1.6){const k=seg(t,EV.out+0.8,EV.out+1.6);st.aR={f:2.7*Math.sin(Math.PI*k),s:-0.35*Math.sin(Math.PI*k)}}return st}
  if(t<EV.arrive){const w=walkSt(t,EV.walk2,EV.arrive,P1,P2,7.5);w.face={mouth:'flat'};return w}
  if(t<EV.away){const st={pos:P2,ry:yawTo(P2,MAXP),face:{mouth:t>=EV.never?'smirk':'flat',brow:t>=EV.never?'up':0}};const kb=seg(t,EV.bought-0.15,EV.bought+0.25)*(1-seg(t,EV.bought+0.6,EV.bought+0.9));st.aR={f:1.3*kb};
    if(t>=EV.never-0.1){const kg=seg(t,EV.never-0.1,EV.never+0.4);st.glasses=kg;st.aR={f:2.6*Math.sin(Math.PI*Math.min(1,kg*1.1)),s:-0.3}}return st}
  const w=walkSt(t,EV.away,EV.away+3.2,P2,P3,7.5);w.face={mouth:'smirk'};w.glasses=1;if(t>EV.away+3.2)w.ry=Math.PI;return w}
function MAXA(t){const st={pos:MAXP,ry:Math.PI,face:{mouth:'flat',eyes:'half'},aL:{f:0.5},aR:{f:0.5},head:{p:0.25}};
  if(t<EV.reveal-0.3){st.ry=0.2;st.head={p:0.3};st.aL={f:0.9+0.2*Math.sin(t*3)};st.aR={f:0.9+0.2*Math.sin(t*3+1)};return st}
  if(t<EV.cant){const k=ease(seg(t,EV.reveal-0.3,EV.reveal+0.05));st.ry=angL(0.2,Math.PI,k);st.face={mouth:'o',eyes:'wide',open:1};st.head={p:0};return st}
  if(t<EV.bought){st.head={y:0.6,p:0.4};st.face={mouth:'sad',brow:'sad',sweat:1,look:[1,-1]};return st}
  if(t<EV.away){const lk=yawTo(MAXP,LEOA(t).pos);st.ry=Math.PI;st.head={y:clamp(angL(0,lk-Math.PI,1),-0.8,0.8),p:0.1};st.face={mouth:'o',eyes:'wide',open:0.9,brow:'up'};if(t>=EV.never)st.face={mouth:'sad',brow:'sad',eyes:'open',tear:(t-EV.never)*0.7};return st}
  st.aL={f:1.25,s:-0.15};st.aR={f:1.25,s:-0.15};st.head={p:0.45};st.face={mouth:'smile',brow:'sad',eyes:'open',tear:(t-EV.away)*0.7,look:[0,-1]};return st}
function leoKitchen(t){const P=[K[0]+0.4,0,2.45];const st={pos:P,ry:Math.PI,aL:{f:1.1},aR:{f:1.1},face:{mouth:'flat',brow:0}};
  if(t<EV.fail[0]-0.3){const k=Math.sin(t*9);st.aL={f:1.15+0.22*k};st.aR={f:1.15-0.22*k};st.head={p:0.35};st.bob=Math.abs(k)*0.02;st.face={mouth:'flat',brow:'angry',look:[0,-1]};return st}
  let last=-1;for(let i=0;i<3;i++)if(t>=EV.fail[i]+0.35)last=i;
  if(t<EV.gold){if(last>=0){const k=t-EV.fail[last]-0.35;const fp=clamp(k/0.25,0,1);st.aR={f:2.6*fp,s:-0.45*fp};st.head={p:0.3+0.15*fp,y:0};st.face={eyes:'closed',mouth:'sad',brow:'sad'}}else{st.head={y:-0.6};st.face={mouth:'flat',look:[-1,0]};st.aL={f:0.3};st.aR={f:0.3}}return st}
  const k=seg(t,EV.gold+0.3,EV.gold+0.6);st.aL={f:2.9*k,s:0.5*k};st.aR={f:2.9*k,s:0.5*k};st.bob=k*Math.abs(Math.sin(t*10))*0.12;st.face={mouth:'laugh',eyes:'happy',open:0.7};st.head={p:-0.2*k};return st}
// ---------- props ----------
function arc(a,b,k,h){const p=lerp3(a,b,k);p[1]+=h*4*k*(1-k);return p}
const LOAFS1=[[-0.15,0.87,3.85],[0.2,0.87,4.15],[0.55,0.87,3.85],[0.9,0.87,4.15],[1.15,0.87,3.85],[0.35,1.01,4.0]];
function props(t,items){const S=scn(t),E=era(t);
  if(S==='kitchen'){items.push({mesh:KITCHEN,M:M4.trs(K,0,0,0,1)});items.push({mesh:BRICKDOME,M:M4.trs([K[0]-2.25,0.4,1.9],Math.PI/2,0,0,0.95)});
    items.push({mesh:UB,M:M4.trs([K[0]-2.25,0.2,1.9],0,0,0,[2.1,0.4,2.1]),tint:hx('#8a7a6a'),tintAmt:1});
    for(let i=0;i<5;i++){const a=t*7+i*1.7;items.push({mesh:UEMIS,M:M4.trs([K[0]-2.2+Math.sin(a)*0.15,0.6+0.12*Math.abs(Math.sin(a*1.3)),1.9+Math.cos(a)*0.15],0,0,0,0.16+0.05*Math.sin(a*2)),tint:mix3([1,0.85,0.3],[1,0.35,0.05],i/5),tintAmt:1,alpha:0.9,add:1,noShadow:true})}
    items.push({mesh:CLOCKRIM,M:M4.trs([K[0]+2.2,2.0,2.955],Math.PI,0,0,1)});const ca=t*14;items.push({mesh:UB,M:mm(M4.trs([K[0]+2.2,2.0,2.94],0,0,ca,1),TT([0,0.09,0],[0.025,0.18,0.01])),tint:DARK,tintAmt:1});items.push({mesh:UB,M:mm(M4.trs([K[0]+2.2,2.0,2.94],0,0,ca/12,1),TT([0,0.06,0],[0.035,0.12,0.01])),tint:DARK,tintAmt:1});
    // dough
    if(t<EV.fail[0]){const sq=1+0.18*Math.sin(t*9);items.push({mesh:DOUGH,M:M4.trs([K[0]+0.4,1.03,1.65],0,0,0,[0.32/sq,0.16*sq,0.26])})}
    for(let i=0;i<3;i++){const t0=EV.fail[i]-0.3;if(t<t0)continue;const k=seg(t,t0,t0+0.4);const A=[K[0]-1.45,0.75,1.9],B=[K[0]-0.45+i*0.45,1.07,1.45];const p=arc(A,B,k,0.6);items.push({mesh:LOAF,M:M4.trs(p,0.3+i,k<1?k*6:0,0,1),tint:[0.12,0.09,0.08],tintAmt:1});
      const ks=t-t0-0.4;if(ks>0&&ks<1.6)for(let j=0;j<3;j++){const kk=(ks*0.9+j/3)%1;items.push({mesh:PUFF,M:M4.trs([B[0]+Math.sin(j*2+ks)*0.06,B[1]+0.08+kk*0.7,B[2]],j,0,0,0.04+kk*0.07),tint:[0.2,0.2,0.22],tintAmt:0.9,alpha:(1-kk)*0.6*clamp((1.6-ks)*2,0,1),noShadow:true})}}
    if(t>=EV.gold-0.35){const k=seg(t,EV.gold-0.35,EV.gold+0.15);const p=arc([K[0]-1.45,0.75,1.9],[K[0]+0.4,1.12,1.45],k,0.9);items.push({mesh:LOAF,M:M4.trs(p,k*TAU2,0,0,1.35),tint:[1,0.75,0.3],tintAmt:0.35});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.32+0.04*Math.sin(t*12)),tint:[1,0.8,0.4],tintAmt:1,alpha:0.12,add:1,noShadow:true})}
    return}
  items.push({mesh:BRICKDOME,M:M4.trs([4.4,0.4,7.4],-Math.PI/2,0,0,1.15)});
  if(E===1){// cart
    let cp=C0.slice(),crx=0;if(t>=EV.laugh1&&t<EV.cartIn+0.2)cp[0]=lerp(-7.5,C0[0],easeOut(seg(t,EV.dad1,EV.cartIn)));if(t>=EV.night)cp=[-30,0,-30];
    if(t>=EV.swipe&&t<EV.swipe+1.5){const k=t-EV.swipe;crx=-0.28*Math.sin(k*9)*Math.exp(-k*3)}
    items.push({mesh:CART,M:M4.trs(cp,0,crx,0,1)});
    items.push({mesh:PUDDLE,M:M4.trs(PUD,0.3,0,0,1.15)});
    LOAFS1.forEach((l,i)=>{let p=V.add(l,[cp[0]-C0[0],0,0]),rot=[0.2*i,0,0],tint=null,ta=0;if(t>=EV.night)return;
      const t0=EV.swipe-0.05+i*0.06;if(t>=t0){const k=seg(t,t0,t0+0.75);const land=[PUD[0]-0.7+(i%3)*0.55+hsh(i,2)*0.2,0.06,PUD[2]-0.25+Math.floor(i/3)*0.45];p=arc(l,land,easeIn(k)*0.4+k*0.6,0.9);rot=[0.2*i+k*5,k*4*(i%2?1:-1),0];if(k>=1){rot=[0.2*i+(i%3)*0.4,0,0.15*(i%2)];tint=hx('#5a3a22');ta=clamp((t-t0-0.75)*2,0,0.75)}}
      items.push({mesh:LOAF,M:M4.trs(p,rot[0],rot[2],rot[1],1),tint,tintAmt:ta})});
    // mud splashes
    for(let i=0;i<6;i++){const t0=EV.swipe-0.05+i*0.06+0.75;const k=t-t0;if(k<0||k>0.6)continue;for(let j=0;j<5;j++){const a=j/5*TAU2+i;const p=[PUD[0]-0.7+(i%3)*0.55+Math.cos(a)*k*0.9,0.05+Math.max(0,k*2.2-k*k*6),PUD[2]-0.25+Math.floor(i/3)*0.45+Math.sin(a)*k*0.6];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.04*(1-k/0.6)+0.01),tint:hx('#4a3020'),tintAmt:1,noShadow:true})}}
    return}
  // era 2: truck, cart2, loaves, bag, coins
  let tx=TP[0];if(t<EV.stop){const k=seg(t,EV.truck-0.2,EV.stop);tx=lerp(48,TP[0],1-Math.pow(1-k,2.2))}
  if(t<EV.truck-0.2)tx=999;
  items.push({mesh:GTRUCK,M:M4.trs([tx,0,TP[2]],Math.PI,0,0,1)});
  items.push({mesh:CART,M:M4.trs(C2,0,0,0,1)});
  const L2=[[5.15,0.87,3.45],[5.5,0.87,3.75],[5.85,0.87,3.45],[6.2,0.87,3.75],[6.45,0.87,3.45],[5.35,1.01,3.6],[5.95,1.01,3.6],[6.3,1.01,3.45]];
  L2.forEach((l,i)=>{const t0=EV.fly+i*0.11;let p=l,r=[0.2*i,0,0];if(t>=t0){const k=seg(t,t0,t0+0.8);if(k>=1)return;p=arc(l,[2.3,1.7,TP[2]],k,2.4);r=[k*8,k*5,0]}items.push({mesh:LOAF,M:M4.trs(p,r[0],r[2],r[1],1)})});
  // bag
  if(t>=EV.walk2){const L=LEOAR;let bp=null;if(t<EV.bought+0.15&&L)bp=V.add(L.hR,[0,-0.3,0]);else if(t<EV.away)bp=[5.55,0.82,3.35];else{const k=seg(t,EV.away,EV.away+0.5);bp=MAXR?lerp3([5.55,0.82,3.35],V.add(lerp3(MAXR.hL,MAXR.hR,0.5),[0,-0.25,0.05]),ease(k)):null}
    if(bp)items.push({mesh:BAG,M:M4.trs(bp,0.5,0,0,1.1)})}
  if(t>=EV.bought+0.15&&t<EV.bought+1.6){const k=t-EV.bought-0.15;for(let i=0;i<14;i++){const a=i/14*TAU2+hsh(i,3);const v=[Math.cos(a)*(0.8+hsh(i,1)),2.6+hsh(i,2)*1.5,Math.sin(a)*(0.8+hsh(i,1))];const p=[5.55+v[0]*k,0.95+v[1]*k-4.9*k*k,3.35+v[2]*k];if(p[1]<0.03)p[1]=0.03;items.push({mesh:COIN,M:M4.trs(p,k*9+i,k*11,0,1.4),noShadow:true})}}}
let LEOAR=null;
function charItems(t,items){LEOR=null;MAXR=null;DADR=null;VR=[];F1R=null;LEOAR=null;for(const[k,st]of cast(t)){if(st.hide)continue;const r=blocky(LOOK[k],st,items);
  if(k==='leo')LEOR=r;if(k==='leoA'){LEOR=r;LEOAR=r}if(k==='max'||k==='maxA')MAXR=r;if(k==='dad')DADR=r;if(k==='f1')F1R=r;if(k[0]==='v')VR.push([k,r])}}
// ---------- environment ----------
function envBase(){return{sun:[0.45,0.75,-0.5],sunCol:hx('#fff0d8'),sky:hx('#bfe6f6'),gnd:hx('#8a9a5a'),fog:hx('#d8eef6'),fogD:600,zen:hx('#4ab4e8'),hor:hx('#d8f2fa'),stars:0,night:0,emis:1.0,ground:1,sunSize:2,fillD:[-0.5,0.4,-0.7],fillC:[0.28,0.3,0.34]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_DAY=envBase();
const E_NIGHT=Object.assign(envBase(),{sun:[-0.3,0.5,0.8],sunCol:hx('#7a86c8'),sky:hx('#3a4480'),gnd:hx('#2a3a40'),fog:hx('#26305a'),fogD:300,zen:hx('#080a24'),hor:hx('#3a3a7a'),stars:1,night:0.7,fillD:[0,0.5,-1],fillC:[0.16,0.18,0.32],sunSize:3});
const E_KIT=Object.assign(envBase(),{sun:[0.3,0.75,-0.55],sunCol:hx('#ffe2b8'),sky:hx('#d8c8b0'),gnd:hx('#8a7a6a'),fillC:[0.42,0.36,0.32],fillD:[0,0.3,-1]});
const E_MORN=Object.assign(envBase(),{sun:[0.55,0.55,-0.6],sunCol:hx('#ffe6c0'),hor:hx('#fff0dc'),fog:hx('#f0eadc')});
function envAt(t){if(scn(t)==='kitchen')return E_KIT;if(t>=EV.night&&t<EV.kitch)return E_NIGHT;if(era(t)===2)return E_MORN;return E_DAY}
// ---------- camera ----------
const SH=[
  [0,[0.4,3.2,-8.6],[-0.2,1.1,2.8],[0.2,2.8,-7.4],[-0.3,1.15,2.8]],
  [EV.laugh1,[1.3,2.0,4.4],[1.75,1.8,9.1],[1.45,1.95,4.9],[1.75,1.85,9.1],0.85],
  [EV.dad1,null],
  [EV.maxIn,[0.2,2.4,-3.6],[-0.6,1.1,4.2],[0.1,2.3,-3.2],[-0.5,1.1,4.2]],
  [EV.swipe+0.35,[2.9,0.75,-0.2],[1.0,0.45,2.8],[2.7,0.7,-0.05],[1.1,0.4,2.8],0.9],
  [EV.mock,[-0.2,1.85,3.0],[-1.7,1.7,4.35],[-0.4,1.85,3.2],[-1.7,1.7,4.35],0.85],
  [EV.sad,[0.65,1.42,2.5],[0.6,1.55,5.05],[0.65,1.42,2.8],[0.6,1.55,5.05],0.7],
  [EV.night,null],
  [EV.kitch,[K[0]+0.3,2.15,-0.9],[K[0]+0.4,1.25,2.2],[K[0]+0.35,2.05,-0.3],[K[0]+0.4,1.3,2.2],0.85],
  [21.7,[K[0]-0.9,2.3,-3.3],[K[0]-0.9,1.2,1.9],[K[0]-0.8,2.25,-3.0],[K[0]-0.8,1.2,1.9],1.15],
  [EV.gold-0.4,[K[0]+0.3,1.6,-0.6],[K[0]+0.3,1.5,2.0],[K[0]+0.35,1.55,0.2],[K[0]+0.4,1.6,2.2],0.85],
  [EV.later,[-11,8.5,-17],[0.5,1.5,4],[-9,7.8,-15.5],[0.5,1.5,4],0.85],
  [EV.truck,[7.2,0.9,-4.6],[22,1.8,0.8],[6.4,0.9,-4.4],[12,1.6,0.6],0.9],
  [EV.villCut,[-4.5,2.2,-9.5],[1.0,1.5,2.5],[-4.0,2.1,-8.8],[0.0,1.5,2.5],0.9],
  [EV.side,[1.0,2.2,-6.8],[-0.4,2.1,0.3],[0.5,2.2,-5.4],[-0.4,2.1,0.3],0.85],
  [EV.door,[-1.1,0.7,-5.6],[-3.0,1.5,-1.6],[-1.2,0.75,-5.7],[-2.7,1.75,-2.3],0.9],
  [EV.silent,[2.4,1.8,2.3],[-1.0,1.4,6.4],[2.2,1.8,2.6],[-1.0,1.4,6.4],0.95],
  [EV.saw,null],
  [EV.cartPan,[0.6,1.7,-2.4],[5.8,1.4,4.2],[3.6,1.95,1.1],[5.8,1.8,4.6],0.9],
  [EV.reveal+0.1,[4.45,2.12,3.0],[5.8,1.95,4.65],[4.55,2.1,3.1],[5.8,1.95,4.65],0.8],
  [EV.cant,[3.9,1.8,3.6],[5.8,1.75,4.65],[4.05,1.8,3.65],[5.8,1.75,4.65],0.8],
  [48.3,null],
  [EV.never,[3.8,2.3,4.4],[5.25,1.95,2.35],[3.95,2.25,4.2],[5.25,1.97,2.35],0.85],
  [EV.away,[9.5,2.2,-1.5],[4.0,1.2,3.0],[9.0,2.1,-1.0],[3.6,1.2,3.0],0.95],
  [EV.endc,[-1.5,5.2,-10.5],[1.0,1.5,3.5],[1.5,5.4,-10.5],[1.0,1.5,3.5],0.85],
  [EV.loop,[0.4,3.2,-8.6],[-0.2,1.1,2.8],[0.4,3.2,-8.6],[-0.2,1.1,2.8]],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){
  if(t>=EV.night&&t<EV.kitch){const x=2.5+Math.max(0,Math.min(t,EV.look0)-EV.night)*1.6+Math.max(0,t-EV.look1)*1.6;const k=seg(t,EV.night,EV.kitch);return{eye:[x-3.9+k*0.6,1.85,-1.9],at:[x+1.5,1.15,0.9],fov:0.9}}
  if(t>=EV.saw&&t<EV.cartPan){const P1=[-2.6,0,-2.4];const d=yawTo(P1,MAXP)+0.55;const k=seg(t,EV.saw,EV.cartPan);return{eye:[P1[0]+Math.sin(d)*(2.3-0.4*k),2.0,P1[2]+Math.cos(d)*(2.3-0.4*k)],at:[P1[0],1.92,P1[2]],fov:0.8}}
  if(t>=48.3&&t<EV.never){const p=LEOA(t).pos;const k=seg(t,48.3,EV.said);return{eye:[lerp(9.4,8.7,k),2.2,lerp(-0.2,0.8,k)],at:[lerp(p[0],5.5,0.5+0.5*seg(t,48.3,EV.arrive)),1.3,lerp(p[2],3.3,0.5+0.5*seg(t,48.3,EV.arrive))],fov:0.92}}
  if(t>=EV.dad1&&t<EV.maxIn){const cx=lerp(-7.5,C0[0],easeOut(seg(t,EV.dad1,EV.cartIn)));return{eye:[cx-0.6,1.9,-1.9],at:[cx-0.4,1.1,4.0],fov:0.95}}
  for(let i=0;i<SH.length-1;i++){const s=SH[i],n=SH[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SH[0][1],at:SH[0][2],fov:0.95}}
function fgItems(t){const items=[{mesh:WORLD}];props(t,items);charItems(t,items);return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const S=scn(tt);
  const ctr=S==='kitchen'?null:{center:[cm.at[0]*0.5+cm.eye[0]*0.5,0,cm.at[2]*0.5+cm.eye[2]*0.5],radius:Math.min(16,4+V.len(V.sub(cm.at,cm.eye))*0.7)};
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:4000},ctr,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.swipe,8,0.4);S(EV.splat,4,0.3);for(const f of EV.fail)S(f,5,0.3);S(EV.stop,6,0.4);if(t>=EV.truck&&t<EV.stop)a+=1.5;S(EV.reveal,9,0.4);S(EV.bought,6,0.3);S(EV.never,4,0.3);return a}
