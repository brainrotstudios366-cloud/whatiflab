// ================= environment =================
function envBase(){return{sun:[0.82,0.26,0.5],sunCol:hx('#ffd2a0'),sky:hx('#a8b4dc'),gnd:hx('#8a7a5a'),fog:hx('#f2b88e'),fogD:2600,zen:hx('#2f4192'),hor:hx('#ffad78'),stars:0,night:0,emis:1.2,ground:0,sunSize:3,fillD:[-0.4,0.5,0.75],fillC:[0.2,0.18,0.24]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb===undefined?va:vb,k):(typeof va==='number'?va+((vb===undefined?va:vb)-va)*k:va)}return r}
const ENV_TIT=Object.assign(envBase(),{sun:[0.45,0.35,0.82],zen:hx('#0c0f3a'),hor:hx('#8a5aa8'),sky:hx('#7a7ab0'),fog:hx('#6a5a90'),stars:0.9,sunCol:hx('#c8b8ff'),fillC:[0.25,0.22,0.38],fillD:[0,0.4,1],emis:1.6});
const ENV_DAY=Object.assign(envBase(),{sun:[0.55,0.6,0.58],sunCol:hx('#fff0d8'),sunSize:2,zen:hx('#2f62c8'),hor:hx('#cfe6ff'),sky:hx('#a8c8f0'),fog:hx('#d0e2f4'),gnd:hx('#7a8a5a'),fillC:[0.22,0.24,0.32],fillD:[-0.4,0.5,-0.75]});
const ENV_GOLD=Object.assign(envBase(),{sun:[0.7,0.32,0.62],sunCol:hx('#ffd8a8'),fillD:[-0.3,0.5,-0.8]});
const ENV_COLD=Object.assign(envBase(),{sun:[0.6,0.55,0.58],sunCol:hx('#e8f4ff'),sunSize:1.5,zen:hx('#3a5a9a'),hor:hx('#dceaff'),sky:hx('#b8d0ec'),fog:hx('#d8e8f8'),gnd:hx('#8a96a8'),fillC:[0.24,0.28,0.38],fillD:[-0.3,0.5,-0.8]});
const ENV_SET=Object.assign(envBase(),{sun:[0.92,0.3,0.25],sunCol:hx('#ffa060'),sunSize:5,zen:hx('#2a2a6a'),hor:hx('#ff8a5a'),sky:hx('#c88aa0'),fog:hx('#e8907a'),fillC:[0.3,0.2,0.28],fillD:[0,0.4,-1],emis:1.3});
const ENV_DUSK=Object.assign(envBase(),{sun:[0.5,0.3,-0.8],sunCol:hx('#c890d0'),sunSize:0.8,zen:hx('#0a0c2e'),hor:hx('#7a4a9a'),sky:hx('#5a4a8a'),fog:hx('#4a3a70'),gnd:hx('#3a3a4a'),stars:0.8,night:0.5,fillC:[0.24,0.2,0.36],fillD:[0,0.5,-1],emis:1.5});
const WTINT=[[0,0,0,0],[0,0,0,0],[0.95,0.75,0.5,0.12],[0.75,0.88,1,0.3],[1,0.6,0.5,0.2],[0.45,0.4,0.7,0.35]];
function worldTint(t){const rn=roundAt(t)+1;const prev=WTINT[Math.max(0,rn-1)],cur=WTINT[rn];const t0=rn>0?R[rn-1]:0;const k=ease((t-t0)/1.0);
  const a=prev[3]+(cur[3]-prev[3])*k;const c=mix3(prev[3]>0?prev.slice(0,3):cur.slice(0,3),cur[3]>0?cur.slice(0,3):prev.slice(0,3),k);
  let fz=0;if(t>=EV.vent&&t<R[3]){fz=ease((t-EV.vent)/2.5)*0.25}return{c:fz?mix3(c,[0.85,0.93,1],fz/(a+fz)):c,a:a+fz}}
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e;
  if(rn<0)e=ENV_TIT;
  else if(rn===0)e=mixEnv(ENV_TIT,ENV_DAY,tr(R[0],1.0));
  else if(rn===1)e=mixEnv(ENV_DAY,ENV_GOLD,tr(R[1],1.2));
  else if(rn===2)e=mixEnv(ENV_GOLD,ENV_COLD,tr(R[2],1.2));
  else if(rn===3)e=mixEnv(ENV_COLD,ENV_SET,tr(R[3],1.2));
  else e=mixEnv(ENV_SET,ENV_DUSK,tr(R[4],1.4));
  const fl=(t0,c,d)=>{const k=t-t0;if(k>=0&&k<d){const f=1-k/d;e=Object.assign({},e,{fillC:V.add(e.fillC,V.sc(c,f)),fillD:[0,0.6,-0.8]})}};
  // blast + booster + plasma + explosions as fill light
  if(t>=EV.ign&&t<EV.hit+3){const f=clamp((t-EV.ign)/2.5,0,1)*clamp((EV.hit+3-t)/1.2,0,1);e=Object.assign({},e,{fillC:V.add(e.fillC,V.sc([1.0,0.55,0.2],0.9*f)),fillD:[0,0.3,-1]})}
  if(t>=R[3]+0.5&&t<EV.slice){const f=clamp((t-EV.slice+3.5)/3,0,1);e=Object.assign({},e,{fillC:V.add(e.fillC,V.sc([1.0,0.45,0.35],0.4*f)),fillD:[0,1,0]})}
  if(rn===1){const f=clamp((t-EV.catch+1.5)/1.5,0,1);e=Object.assign({},e,{fillC:V.add(e.fillC,[0.3*f,0.3*f,0.28*f]),fillD:[0.2,-0.8,-0.5]})}
  fl(EV.slice,[0.5,0.5,0.55],0.3);fl(EV.boom,[0.7,0.35,0.12],1.4);fl(EV.catch,[0.5,0.5,0.4],0.4);
  return e}
// ================= camera =================
const SHOTS=[[0,[0.9,1.0,3.9],[-4,13,-60],[0.8,1.0,3.5],[-4,14,-60],0.95],
 [R[0],[3.2,1.7,6.5],[-9,22,-150],[2.8,1.6,6.0],[-9,22,-150],0.9],[EV.ign-0.15,[4,3,8],[PAD[0],40,PAD[2]],[4,3,8],[PAD[0],34,PAD[2]],0.42],
 [EV.lift+0.3,[5.0,1.1,1.2],[-2,2.4,-12],[4.6,1.1,0.8],[-2,2.4,-12],0.95],[EV.cut-0.35,[2.3,1.3,-1.4],[0,1.1,0],[2.1,1.3,-1.2],[0,1.1,0],0.85],
 [EV.hit,[0.7,1.5,3.4],[0,1.3,-12],[0.6,1.5,3.0],[0,1.4,-12],0.95],[EV.hit+1.6,[7,6,11],[0,1,-14],[6.5,6.5,10],[0,6,-20],0.95],
 [EV.cool-0.4,[1.0,1.5,-2.1],[0,1.3,0],[0.9,1.5,-1.9],[0,1.32,0],0.85],[R[1]-1.8,[1.2,0.7,2.6],'RK1',[1.1,0.7,2.4],'RK1',0.95],
 [R[1],[3,1.0,6],'BST',[2.6,1.0,5.6],'BST',0.5],[EV.chop-0.6,[1.3,1.15,-2.3],[0,1.85,0],[1.2,1.15,-2.15],[0,1.9,0],0.9],
 [EV.catch-1.6,[7,0.4,8],[0,9,0],[6.4,0.4,7.4],[0,8,0],1.0],[EV.catch-0.05,[5.5,0.9,6.5],[0,5.5,0],[5.1,0.9,6.1],[0,5.5,0],1.05],
 [EV.catch+1.6,[34,2.2,46],[0,20,0],[31,2.2,42],[0,20,0],0.9],[EV.jeal,[2.0,1.3,-3.0],[0,2.0,0],[1.85,1.3,-2.8],[0,2.0,0],0.95],
 [R[2],[7,2.2,8],[-6,10,-14],[6.4,2.1,7.4],[-6,10,-14],0.95],[EV.vent+0.2,[4.5,1.3,3.6],[-6,6,-12],[4.1,1.3,3.3],[-6,6,-12],0.95],
 [EV.freeze-0.9,[0.95,1.45,-2.4],[0,1.15,0],[0.85,1.4,-2.2],[0,1.15,0],0.9],[EV.freeze+0.8,[-2.0,1.25,-2.0],[0,1.0,0],[-2.3,1.2,-0.6],[0,1.0,0],0.9],
 [EV.crack-0.3,[1.7,1.3,-2.8],[0,1.1,0],[1.5,1.3,-2.6],[0,1.1,0],0.9],[EV.ice-0.2,[0.8,1.6,-1.45],[0,1.5,0],[0.72,1.58,-1.35],[0,1.5,0],0.8],
 [R[3],[2,1.0,6],'SHP',[2.5,1.0,6.5],'SHP',0.16],[R[3]+1.3,[3,1.2,7],'SHP',[3.4,1.2,7.4],'SHP',0.32],[EV.ready-0.3,[1.0,1.35,-2.4],[0,1.35,0],[0.9,1.35,-2.2],[0,1.4,0],0.85],
 [EV.ready+1.3,[-3.5,1.0,7.5],'SHP',[-3.2,1.0,7.0],'SHP',0.95],[EV.jump-0.35,[13,1.6,20],[0,6.5,0],[12,1.8,19],[0,6.5,0],0.9],
 [EV.land+0.1,[0,7,96],[0,9,0],[0,7.5,90],[0,9,0],0.9],[EV.walk-0.4,[1.0,1.3,-2.8],[0,1.3,0],[0.9,1.35,-2.6],[0,1.35,0],0.85],
 [R[4],[1.2,1.45,-2.9],[0,1.25,0],[1.1,1.45,-2.7],[0,1.25,0],0.9],[EV.boss-0.3,'TIL',0,0,0,0.85],
 [EV.look-0.2,[0.85,0.95,-2.1],[0,1.65,0],[0.8,0.98,-1.95],[0,1.65,0],0.9],[EV.bonk-0.9,[2.0,1.6,-2.4],[0,1.35,0],[1.9,1.6,-2.3],[0,1.25,0],0.95],
 [EV.floor+0.4,[1.9,1.5,-1.3],[0,0.35,0.8],[1.7,1.6,-1.1],[0,0.35,0.8],0.9],
 [R[5],[1.7,1.6,-1.0],[0,0.35,0.8],[1.6,1.6,-0.9],[0,0.35,0.8],0.9],[99,[0,0,0],[0,0,0],[0,0,0],[0,0,0]]];
let TRK={RK1:[0,100,-100],BST:[0,60,0],SHP:[0,100,-100],TIL:[0,10,0]};
function camAt(t){for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));
    if(s[1]==='TIL'){const p=TRK.TIL;return{eye:V.add(p,[0.55,0.12,-0.75]),at:V.add(p,[0,-0.05,0]),fov:s[5]}}
    const A=typeof s[2]==='string'?TRK[s[2]]:s[2],B=typeof s[4]==='string'?TRK[s[4]]:s[4];return{eye:lerp3(s[1],s[3],k),at:lerp3(A,B,k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
