// ================= world =================
const Q=2;const sq=(f,r)=>[(f-4.5)*Q,0,(r-4.5)*Q];const isLight=(f,r)=>(f+r)%2===1;
const smst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
let BOARD,CLOUDSEA,ISLES;
{const m=new MB();
  m.box([0,-0.47,0],[18.8,0.9,18.8],hx('#3e2416'),0,0,hx('#5b3520'));
  m.box([0,-0.012,0],[16.35,0.02,16.35],PC.gold);
  for(let f=1;f<=8;f++)for(let r=1;r<=8;r++){const p=sq(f,r);const L=isLight(f,r);const base=L?hx('#ecd8b0'):hx('#8a5836');const v=(hsh(f,r)-0.5)*0.05;m.box([p[0],-0.03,p[2]],[Q,0.06,Q],[base[0]+v,base[1]+v,base[2]+v*0.6])}
  // gold corner studs
  for(const sx of[-1,1])for(const sz of[-1,1])m.ico([sx*8.75,0.02,sz*8.75],0.22,PC.gold,0,0.5);
  // floating rock under the board
  blob(m,[0,-6.3,0],10.5,p=>mix3(hx('#6c6258'),hx('#8f8476'),vnoise(p[0]*0.4,p[1]*0.4+p[2]*0.3)),11,0.42,[14,22]);
  blob(m,[0,-9.5,0],7.0,p=>mix3(hx('#5d544c'),hx('#7c7166'),vnoise(p[0]*0.5+3,p[2]*0.5)),12,0.8,[10,16]);
  blob(m,[0.5,-13,0.5],3.6,p=>mix3(hx('#544b44'),hx('#6e645a'),vnoise(p[0]+3,p[2])),13,1.1,[8,12]);
  // grass rim of the rock
  for(let i=0;i<70;i++){const a=i/70*TAU2,d=10.0+hsh(i,2)*0.8;blob(m,[Math.cos(a)*d,-2.0-hsh(i,3)*0.4,Math.sin(a)*d],0.9+hsh(i,4)*0.7,p=>mix3(hx('#4f8a3a'),hx('#79ab4a'),hsh(i,5)),i,0.5,[5,8])}
  BOARD=m.build(0.55)}
{const m=new MB();const r=rngG(77);
  for(let i=0;i<520;i++){const a=r()*TAU2,d=40+Math.pow(r(),0.6)*1700;const x=Math.cos(a)*d,z=Math.sin(a)*d;const s=18+r()*55+d*0.03;const y=-34-r()*14-s*0.25;
    blob(m,[x,y,z],s,p=>mix3(hx('#c9c2d6'),[1,1,1],clamp((p[1]-y)/s*0.6+0.55,0,1)),i,0.42,[5,9])}
  CLOUDSEA=m.build(0.4)}
{const m=new MB();const L=[[-140,-10,260,14],[190,8,330,18],[-330,-30,-60,22],[310,-20,-180,16],[-90,25,-420,20],[60,-5,560,26]];
  for(const[x,y,z,s]of L){blob(m,[x,y-s*0.5,z],s,p=>mix3(hx('#5f564e'),hx('#857a6c'),vnoise(p[0]*0.1,p[2]*0.1)),x,0.55,[9,14]);blob(m,[x,y-s*1.3,z],s*0.55,p=>hx('#5a514a'),x+1,1.2,[7,10]);
    blob(m,[x,y-0.2*s,z],s*0.98,p=>mix3(hx('#4f8a3a'),hx('#7aac4c'),vnoise(p[0]*0.2,p[2]*0.2)),x+2,0.12,[7,14]);
    for(let k=0;k<5;k++){const a=k*1.7+x,d=s*0.5*hsh(k,x|0);tree(m,x+Math.cos(a)*d,z+Math.sin(a)*d,s*0.09,y-0.1*s,'')}}
  ISLES=m.build(0.5)}
// ================= environment =================
function envBase(){return{sun:[0.55,0.4,-0.73],sunCol:hx('#ffd6a8'),sky:hx('#b4b8e0'),gnd:hx('#8a7a6a'),fog:hx('#f3c49a'),fogD:1400,zen:hx('#33449a'),hor:hx('#ffb27e'),stars:0,night:0,emis:1.25,ground:0,sunSize:3,fillD:[0,0.45,1],fillC:[0.32,0.3,0.4]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_GOLD=envBase();
const E_DUSK=Object.assign(envBase(),{sun:[-0.5,0.35,-0.8],sunCol:hx('#ffb0a0'),sky:hx('#a890c8'),fog:hx('#c99ab8'),zen:hx('#241a5a'),hor:hx('#f08aa8'),fillC:[0.3,0.26,0.42]});
const E_STORM=Object.assign(envBase(),{sun:[0.3,0.6,-0.75],sunCol:hx('#c8d0dc'),sky:hx('#8e9ab0'),fog:hx('#7d889a'),zen:hx('#232a3c'),hor:hx('#9aa6b8'),gnd:hx('#5a5a60'),fillC:[0.3,0.32,0.38],fogD:1000});
const E_QUEEN=Object.assign(envBase(),{sun:[0.7,0.25,-0.67],sunCol:hx('#ff9a6a'),sky:hx('#a080b0'),fog:hx('#a2507a'),zen:hx('#1a0d33'),hor:hx('#ff6a5a'),fillC:[0.34,0.2,0.38],stars:0.4});
const E_FIN=Object.assign(envBase(),{sun:[0.5,0.45,-0.74],sunCol:hx('#ffe0c0'),sky:hx('#b8c4ec'),fog:hx('#f8c4b4'),zen:hx('#4a64c4'),hor:hx('#ffc0a8')});
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e=E_GOLD;
  if(rn===1)e=mixEnv(E_GOLD,E_DUSK,tr(R[1],0.8));if(rn===2)e=mixEnv(E_DUSK,E_STORM,tr(R[2],0.8));
  if(rn===3){e=mixEnv(E_STORM,E_QUEEN,tr(R[3],0.8));const p=t>=EV.promo0&&t<EV.promo+1.2?clamp(Math.min((t-EV.promo0)/0.4,(EV.promo+1.2-t)/0.8),0,1):0;if(p>0){e=Object.assign({},e);e.fillC=V.add(e.fillC,[1.2*p,1.0*p,0.6*p]);e.fillD=[0,1,0.2]}}
  if(rn>=4)e=mixEnv(E_QUEEN,E_FIN,tr(R[4],0.6));
  if(rn===2&&t>=EV.rboom){const f=Math.exp(-(t-EV.rboom)*1.3);e=Object.assign({},e);e.fillC=V.add(e.fillC,[1.4*f,0.7*f,0.25*f]);e.fillD=[-1,-0.3,0]}
  return e}
// ================= camera =================
// [t, eye0, at0, eye1, at1, fov]
const SHOTS=[
  [0,[2.6,1.9,-9.8],[0,1.2,3],[1.2,1.8,-10.1],[0,1.2,3],0.9],
  // knight
  [R[0],[3.0,2.0,-5.2],[-2,0.7,6],[2.7,2.0,-4.8],[-2,0.7,6]],
  [EV.kh[0]-0.1,[7.5,8.5,-9.5],[0,0,2.2],[5.5,9.2,-10],[0.5,0,2.2]],
  [EV.kland-0.05,[-3.6,2.0,4.6],[2,0.8,0],[-3.3,1.9,4.2],[2,0.8,0]],
  [EV.squint,[1.0,1.2,0.75],[1,1.1,-1],[1.0,1.17,0.6],[1,1.1,-1],0.8],
  [EV.cap1-0.05,[-3.6,1.6,-1.6],[2.4,1.1,0.4],[-3.4,1.7,-1.2],[2.6,1.4,0.6]],
  [EV.hit1+0.4,[-1.2,1.6,-3.6],[8,4,9],[-1.0,1.6,-3.4],[12,8,13]],
  [EV.hit1+2.3,[3.4,0.55,3.6],[3,1.0,1],[4.8,0.65,2.2],[3,1.0,1]],
  // bishop
  [R[1],[-0.1,1.25,-4.6],[5,1.3,6],[0.1,1.25,-4.3],[5,1.3,6]],
  [EV.bz[0]+0.2,[-5.4,1.9,0.3],[1,1.2,0],[-5.0,1.9,0.5],[1,1.2,0]],
  [EV.bz[1]-0.05,[0,24,-14],[0,0,0.8],[0,23,-13.5],[0,0,0.8],1.0],
  [EV.rage-0.1,[3.0,4.4,-5.0],[-0.5,1.6,1.5],[2.6,4.2,-4.6],[-0.5,1.6,1.5]],
  [EV.bfly-0.15,[-3.5,6.5,1.5],[8,-1.5,-7],[-3.0,6.2,1.0],[14,-9,-12]],
  [EV.bfall+1.3,[2.5,0.95,1.5],[1,1.0,-1],[1.9,1.05,2.1],[1,1.0,-1]],
  // rook
  [R[2],[-3.6,0.95,-7.6],[5,1.3,-4.5],[-3.3,1.0,-7.4],[5,1.2,-4.5]],
  [EV.rland+0.55,[4.3,1.35,-3.4],[7,1.3,-5],[4.5,1.3,-3.6],[7,1.3,-5]],
  [EV.charge-0.05,[3.5,1.0,-9.8],[4,1,-5],[-1.0,1.0,-9.8],[0,1.0,-5]],
  [EV.slow0,[-1.0,1.0,-9.8],[0,1.0,-5],[-2.4,1.1,-9.5],[-1.6,1.1,-4]],
  [EV.slow1,[2,4.0,-2.5],[-12,-5,-5],[2.5,4.4,-2.0],[-22,-13,-5]],
  [EV.rboom+0.8,[0.6,0.95,1.7],[-1,1.0,-1],[-0.3,1.0,1.9],[-1,1.0,-1]],
  // queen
  [R[3],[2.1,1.0,-2.7],[-1,3.4,7],[2.0,1.0,-2.5],[-1,2.2,7]],
  [EV.qland+0.4,[7.5,5.5,-1.5],[0,0.8,4.6],[7.2,5,0.5],[0,0.8,4.6]],
  [EV.qcap-0.15,[-4.4,2.2,3.0],[-0.4,1.3,6.6],[-4.2,2.1,3.3],[-0.4,1.3,6.6]],
  [EV.promo0,[-0.4,1.2,11.2],[-1,1.9,7],[-0.5,1.1,10.8],[-1,2.3,7]],
  [EV.promo+1.3,[1.6,1.0,11.2],[-1,2.4,7],[-3.6,1.5,11.0],[-1,2.4,7]],
  // final
  [R[4],[4.0,2.3,-9.2],[0,0.6,-2.6],[3.4,2.1,-8.6],[0,0.6,-2.6]],
  [EV.dstep2-0.1,[6.5,1.8,-5.2],[0,0.9,-2.8],[6.2,1.8,-4.9],[0,0.9,-2.6]],
  [EV.wake-0.1,[0.3,1.2,-0.7],[-1,1.0,-1.1],[0.25,1.2,-0.75],[-1,1.0,-1.1],0.85],
  [EV.ep-0.15,[-3.5,4.5,-10],[4,1.2,-1.5],[-3.2,4.6,-9.8],[5.5,1.4,-1.2]],
  [EV.koland+0.2,[9.0,1.45,2.3],[8.2,0.45,-0.6],[8.8,1.4,2.0],[8.2,0.45,-0.6]],
  [EV.loop,[1.9,1.05,-7.6],[0.2,1.5,2],[1.9,1.05,-7.6],[0.2,1.5,2],0.9],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){if(t>=EV.bfly-0.15&&t<EV.bfall+1.3){let p;if(t<EV.bfall)p=lerp3(BP[6],BEDGE,clamp((t-EV.bfly)/(EV.bfall-EV.bfly),0,1));else p=flyer(BEDGE,[9,1.5,-9],14,t-EV.bfall,1.1);p=[p[0],p[1]+1,p[2]];return{eye:[-3.5,9,1.5],at:p,fov:0.95}}
  if(t>=EV.charge-0.05&&t<EV.slow1){const x=rookX(Math.max(t,EV.charge));return{eye:[x-3.2,3.0,-10.6],at:[x-0.9,0.9,-4.2],fov:0.95}}
  if(t>=EV.slow1&&t<EV.rboom+0.8){const tr=Math.min(t,EV.rboom);let p;if(tr<EV.redge)p=[rookX(tr),1,-5];else{const k=tr-EV.redge;p=[-9.4-20*k,1-8.82*k*k,-5]}return{eye:[-6,8,-2],at:p,fov:0.95}}for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
