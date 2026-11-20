// ================= environment (deep space) =================
function envBase(){return{sun:V.norm([0.45,0.55,-0.7]),sunCol:hx('#fff4e4'),sky:hx('#4a5a8a'),gnd:hx('#1a1830'),fog:hx('#05061a'),fogD:1e7,zen:hx('#05061a'),hor:hx('#0d1236'),stars:1.0,night:1,emis:1.35,ground:0,sunSize:0.5,fillD:[0,0.3,1],fillC:[0.1,0.12,0.2],neb:0.0}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb===undefined?va:vb,k):(typeof va==='number'?va+((vb===undefined?va:vb)-va)*k:va)}return r}
const ENV_TIT=Object.assign(envBase(),{fillC:[0.45,0.28,0.14],fillD:[-0.3,0.4,1],neb:0.15,hor:hx('#161030')});
const ENV_IO=Object.assign(envBase(),{fillC:[0.5,0.32,0.14],fillD:[-0.2,0.4,1],neb:0.1,hor:hx('#1a1228')});
const ENV_SAT=Object.assign(envBase(),{fillC:[0.42,0.36,0.24],fillD:[-0.2,0.5,1],neb:0.12,hor:hx('#14142c'),sky:hx('#5a6480')});
const ENV_HEL=Object.assign(envBase(),{fillC:[0.7,0.2,0.35],fillD:[0,0.2,1],neb:0.6,hor:hx('#2a0c2a'),zen:hx('#0a0418'),sunSize:0.3});
const ENV_FAR=Object.assign(envBase(),{fillC:[0.12,0.18,0.35],fillD:[0,-0.3,1],neb:0.25,hor:hx('#070a22'),zen:hx('#020310'),sunCol:hx('#e8eeff'),sunSize:0.25});
const ENV_FIN=Object.assign(envBase(),{fillC:[0.32,0.16,0.5],fillD:[0.3,0.5,1],neb:0.45,hor:hx('#0c0624'),zen:hx('#030210'),sunSize:0.25});
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e;
  if(rn<0)e=ENV_TIT;
  else if(rn===0)e=mixEnv(ENV_TIT,ENV_IO,tr(R[0],1.0));
  else if(rn===1)e=mixEnv(ENV_IO,ENV_SAT,tr(R[1],1.0));
  else if(rn===2)e=mixEnv(ENV_SAT,ENV_HEL,tr(R[2],2.5));
  else if(rn===3)e=mixEnv(ENV_HEL,ENV_FAR,tr(R[3],1.2));
  else e=mixEnv(ENV_FAR,ENV_FIN,tr(R[4],1.4));
  // heliopause: hot pink fill grows as the wall approaches, burst on pass
  if(rn===2){const f=clamp((t-EV.wall)/(EV.pass-EV.wall),0,1)*clamp((EV.pass+1.4-t)/1.4,0,1);e=Object.assign({},e,{fillC:V.add(e.fillC,V.sc([1.0,0.35,0.5],0.9*f*f)),fillD:[0,0.2,1]})}
  // plume glow on Io round
  if(rn===0&&t>EV.plume){const f=clamp((t-EV.plume)/1.5,0,1)*0.35;e=Object.assign({},e,{fillC:V.add(e.fillC,[f,f*0.8,f*0.2])})}
  // cosmic ray hit flash
  {const k=t-EV.ray;if(k>=0&&k<0.6){const f=1-k/0.6;e=Object.assign({},e,{fillC:V.add(e.fillC,V.sc([0.8,0.6,1],f)),fillD:[0.6,0.3,-0.7]})}}
  return e}
// ================= camera =================
// shot: [t, eye0, at0, eye1, at1, fov]  (strings = tracked targets in TRK; 'FOL' = follow the flung samurai)
const SHOTS=[[0,[1.1,1.25,-3.6],[0,1.35,0],[0.75,1.45,-2.6],[0,1.4,0],0.95],
 [R[0],[2.6,1.0,-6.5],[0,2.4,0],[2.2,1.1,-6.0],[0,2.6,0],0.95],[EV.plume-0.2,[0.6,1.5,-1.2],'IO',[0.6,1.5,-1.2],'IO',0.55],
 [EV.plume+1.6,[1.0,1.35,-2.6],[0,1.5,0],[0.9,1.4,-2.4],[0,1.55,0],0.9],[EV.umb+0.35,[2.4,1.8,-4.2],[0,1.4,2],[2.1,1.9,-3.8],[0,1.5,2],0.95],
 [EV.snow+1.4,[0.9,1.15,-2.2],[0,1.75,0],[0.82,1.15,-2.0],[0,1.78,0],0.9],[EV.cool,[1.1,1.5,-2.4],[0,1.45,0],[1.0,1.5,-2.2],[0,1.45,0],0.85],
 [R[1],[-2.2,1.3,-6.0],[0,2.8,4],[-2.0,1.3,-5.5],[0,3.0,4],0.95],[EV.chunks+0.6,[1.6,1.2,-3.6],[0,1.2,1.5],[1.4,1.2,-3.3],[0,1.2,1.5],0.95],
 [EV.cut1-0.6,[2.2,1.3,-2.6],[0,1.15,0],[2.0,1.3,-2.4],[0,1.15,0],0.95],[EV.cut3+0.6,[-1.8,1.6,-3.4],[0,1.0,0],[-1.6,1.6,-3.1],[0,1.0,0],0.95],
 [EV.ice-0.5,[0.8,1.6,-1.5],[0,1.5,0],[0.72,1.58,-1.38],[0,1.5,0],0.8],
 [R[2],[1.4,1.0,-4.2],[0,2.2,6],[1.2,1.0,-3.8],[0,2.4,6],0.95],[EV.wall+1.2,[0.2,1.4,-1.6],'WALL',[0.2,1.4,-1.6],'WALL',0.6],
 [EV.brace-0.3,[1.2,1.3,-2.5],[0,1.35,0],[1.1,1.3,-2.3],[0,1.35,0],0.9],[EV.pass-1.2,[2.6,1.6,-5.5],[0,1.2,1],[2.4,1.6,-5.2],[0,1.2,1],0.95],
 [EV.pass+0.6,[0.9,1.45,-2.1],[0,1.4,0],[0.85,1.45,-1.95],[0,1.42,0],0.85],
 [R[3],[3.6,2.4,-7.5],[0,-0.3,3],[3.2,2.2,-7.0],[0,-0.2,3],0.95],[EV.send-1.2,[0.7,1.45,-1.45],[0.1,1.45,0],[0.65,1.45,-1.35],[0.1,1.45,0],0.85],
 [EV.send+0.3,[-2.8,3.4,-5.5],[0,-1.5,8],[-2.6,3.2,-5.0],[0,-1.5,8],0.95],[EV.nap-0.4,[1.6,1.0,-2.6],[0,0.6,0],[1.45,1.0,-2.4],[0,0.6,0],0.95],
 [EV.reply-0.5,[0.7,1.45,-1.45],[0.1,1.45,0],[0.62,1.45,-1.32],[0.1,1.45,0],0.82],
 [R[4],[1.3,1.5,-3.0],[0,1.3,0],[1.2,1.5,-2.8],[0,1.3,0],0.9],[EV.ray-1.0,[3.0,1.6,-4.6],[0.3,0.4,0],[2.8,1.6,-4.3],[0.3,0.4,0],0.95],
 [EV.flip-0.15,[0.75,0.1,-2.2],[0.2,-0.2,-0.7],[0.7,0.1,-2.05],[0.2,-0.2,-0.7],0.8],[EV.thrust-0.2,[3.6,2.6,-5.6],[0,0.4,0],[3.3,2.4,-5.2],[0,0.4,0],0.95],
 [EV.fling+0.2,'FOL',0,0,0,0.95],[99,[0,0,0],[0,0,0],[0,0,0],[0,0,0]]];
let TRK={IO:[150,330,1500],WALL:[0,1.4,40]};
function camAt(t){for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));
    if(s[1]==='FOL'){const f=flingState(t);const d=t-EV.fling;const back=Math.min(1,d/2.5);const eye=V.add(f.c,[1.6+1.2*back,0.5+0.3*back,-2.6-1.0*back]);return{eye,at:lerp3([0,0.9,0],V.add(f.c,[0,0.2,0]),clamp(d/0.35,0,1)),fov:0.95}}
    const A=typeof s[2]==='string'?TRK[s[2]]:s[2],B=typeof s[4]==='string'?TRK[s[4]]:s[4];return{eye:lerp3(s[1],s[3],k),at:lerp3(A,B,k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
