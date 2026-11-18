// ================= environment =================
function envBase(){return{sun:[0.82,0.26,0.5],sunCol:hx('#ffd2a0'),sky:hx('#a8b4dc'),gnd:hx('#8a7a5a'),fog:hx('#f2b88e'),fogD:2600,zen:hx('#2f4192'),hor:hx('#ffad78'),stars:0,night:0,emis:1.2,ground:0,sunSize:3,fillD:[-0.4,0.5,0.75],fillC:[0.2,0.18,0.24]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb===undefined?va:vb,k):(typeof va==='number'?va+((vb===undefined?va:vb)-va)*k:va)}return r}
const ENV_TIT=Object.assign(envBase(),{sun:[0.3,0.3,0.9],zen:hx('#0c0f3a'),hor:hx('#8a5aa8'),sky:hx('#7a7ab0'),fog:hx('#6a5a90'),stars:0.9,sunCol:hx('#ffc890'),fillC:[0.25,0.2,0.35],fillD:[0,0.4,-1]});
const ENV_DAY=Object.assign(envBase(),{sun:[0.45,0.62,0.64],sunCol:hx('#fff0d8'),sunSize:2,zen:hx('#2f62c8'),hor:hx('#cfe6ff'),sky:hx('#a8c8f0'),fog:hx('#d0e2f4'),gnd:hx('#7a8a5a'),fillC:[0.2,0.22,0.3],fillD:[-0.4,0.5,0.75]});
const ENV_GOLD=Object.assign(envBase(),{sunCol:hx('#ffd8a8')});
const ENV_RIV=Object.assign(envBase(),{sun:[0.6,0.5,0.62],sunCol:hx('#fff0d0'),zen:hx('#3a6aa8'),hor:hx('#e0e8d0'),sky:hx('#b0c8c0'),fog:hx('#c8d8c8'),fillC:[0.2,0.24,0.22]});
const ENV_SET=Object.assign(envBase(),{sun:[0.92,0.3,0.25],sunCol:hx('#ffa060'),sunSize:5,zen:hx('#2a2a6a'),hor:hx('#ff8a5a'),sky:hx('#c88aa0'),fog:hx('#e8907a'),fillC:[0.3,0.18,0.25],fillD:[0,0.4,-1],emis:1.3});
const ENV_DUSK=Object.assign(envBase(),{sun:[-0.4,0.25,0.88],sunCol:hx('#c890d0'),sunSize:0.8,zen:hx('#0a0c2e'),hor:hx('#7a4a9a'),sky:hx('#5a4a8a'),fog:hx('#4a3a70'),gnd:hx('#3a3a4a'),stars:0.8,night:0.5,fillC:[0.2,0.16,0.32],fillD:[0,0.5,1],emis:1.5});
const WTINT=[[0,0,0,0],[0,0,0,0],[0.95,0.75,0.5,0.15],[0.55,0.7,0.5,0.12],[1,0.6,0.5,0.22],[0.45,0.4,0.7,0.35]];
function worldTint(t){const rn=roundAt(t)+1;const prev=WTINT[Math.max(0,rn-1)],cur=WTINT[rn];const t0=rn>0?R[rn-1]:0;const k=ease((t-t0)/1.0);
  const a=prev[3]+(cur[3]-prev[3])*k;const c=mix3(prev[3]>0?prev.slice(0,3):cur.slice(0,3),cur[3]>0?cur.slice(0,3):prev.slice(0,3),k);return{c,a}}
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e;
  if(rn<0)e=ENV_TIT;
  else if(rn===0)e=mixEnv(ENV_TIT,ENV_DAY,tr(R[0],1.0));
  else if(rn===1)e=mixEnv(ENV_DAY,ENV_GOLD,tr(R[1],1.2));
  else if(rn===2)e=mixEnv(ENV_GOLD,ENV_RIV,tr(R[2],1.2));
  else if(rn===3)e=mixEnv(ENV_RIV,ENV_SET,tr(R[3],1.2));
  else e=mixEnv(ENV_SET,ENV_DUSK,tr(R[4],1.4));
  // impact flashes as fill light
  const fl=(t0,c,d)=>{const k=t-t0;if(k>=0&&k<d){const f=1-k/d;e=Object.assign({},e,{fillC:V.add(e.fillC,V.sc(c,f)),fillD:[0,0.6,0.8]})}};
  fl(EV.punch,[0.5,0.6,0.8],0.3);fl(EV.snap,[0.8,0.7,0.5],0.35);
  return e}
// ================= camera =================
let PSH=[0.3,0.75,0.9];// pistol-shrimp body pos (computed in sF)
const MQH=[0.6,1.85,0.85];// mosquito intro hover
const SHOTS=[[0,[1.0,0.55,2.8],[0,1.45,0],[0.8,0.6,2.4],[0,1.5,0],1.0],
 [R[0],[1.3,0.5,4.3],[0,0.16,2.45],[1.1,0.45,4.0],[0,0.16,2.45],0.75],[5.4,[0.35,0.45,3.9],[0,0.75,0.6],[0.3,0.5,3.6],[0,0.8,0.6],0.9],
 [EV.mWind,[2.7,0.7,1.35],[0,0.42,1.3],[2.4,0.65,1.3],[0,0.4,1.3],0.85],[EV.punch-0.06,[1.55,0.42,1.05],[0,0.3,0.95],[1.35,0.45,1.0],[0,0.3,0.95],0.85],
 [EV.bounce+0.1,[2.4,1.0,3.3],[0.2,0.3,2.0],[2.2,0.9,3.1],[0.2,0.3,2.0],0.9],[EV.dizzy,[1.5,0.75,3.9],[0.3,0.2,2.6],[1.35,0.7,3.7],[0.3,0.2,2.6],0.8],[EV.mSheath,[1.5,1.3,2.9],[0,1.2,0],[1.3,1.3,2.6],[0,1.2,0],0.9],
 [R[1],[1.4,1.4,2.7],[0.1,1.25,0],[1.25,1.4,2.4],[0.1,1.25,0],0.9],[EV.cock-0.6,'P1'],[EV.snap,'P2'],[EV.toast+1.2,[1.5,1.35,2.2],[0.15,1.2,0.2],[1.35,1.35,2.0],[0.15,1.2,0.2],0.85],
 [EV.yum-0.3,[0.95,1.6,1.5],[0.05,1.45,0],[0.85,1.6,1.35],[0.05,1.45,0],0.8],
 [R[2],[0.9,1.25,-2.4],[0,0.5,6],[0.85,1.2,-2.1],[0,0.5,5],0.9],[26.8,[1.3,0.35,1.4],[0,0.45,5.5],[1.2,0.35,1.6],[0,0.45,4.6],0.85],
 [EV.crocStop,[4.4,1.35,1.8],[0,0.7,1.7],[4.1,1.3,1.7],[0,0.7,1.6],0.9],[EV.lunge,[3.3,1.05,1.4],[0,0.7,1.3],[3.1,1.0,1.4],[0,0.7,1.3],0.9],
 [EV.jam+0.6,[1.9,1.05,0.15],[0,0.65,2.1],[1.75,1.05,0.25],[0,0.65,2.1],0.85],[EV.dent,[2.3,1.45,0.6],[0,0.85,1.5],[2.1,1.45,0.7],[0,0.85,1.5],0.9],
 [R[3],[0.6,1.7,-3.2],[0,3,120],[0.55,1.6,-2.8],[0,3,120],0.8],[EV.surf-0.4,[3,2.2,110],[-5,0.6,125],[2.4,2.0,110.5],[-4.5,0.6,125],0.8],
 [EV.click-0.2,[6,4.5,106],[-6,-0.3,123],[5.5,4.2,107],[-5.5,-0.3,122],0.95],[EV.bounceW-0.2,[3.5,2.6,99],[0,0,113],[3.0,2.4,99.5],[0,0,113],0.95],
 [EV.reach+0.9,[1.5,1.05,2.4],[0,0.8,0],[1.3,1.0,2.2],[0,0.8,0],0.9],
 [R[4],[1.3,1.4,3.0],[0,1.2,0],[1.2,1.4,2.8],[0,1.2,0],0.9],[EV.boss-0.3,[0.95,1.85,1.65],MQH,[0.88,1.85,1.52],MQH,0.7],[EV.buzz+0.3,[1.7,1.6,2.5],[0,1.45,0],[1.55,1.6,2.3],[0,1.45,0],0.9],
 [EV.sl1-0.35,[2.5,1.45,2.6],[0,1.3,0],[2.3,1.45,2.5],[0,1.3,0],0.95],[EV.mland-0.15,[0.8,1.9,1.1],[0,1.9,0.15],[0.72,1.89,1.0],[0,1.9,0.15],0.75],
 [EV.slap-0.3,[1.9,1.6,2.5],[0,1.3,0],[1.9,1.5,2.6],[0,1.0,0],0.9],[EV.floor+0.4,[1.9,1.5,1.3],[0,0.35,-0.8],[1.7,1.6,1.1],[0,0.35,-0.8],0.9],
 [R[5],[1.7,1.6,1.1],[0,0.35,-0.8],[1.6,1.6,1.0],[0,0.35,-0.8],0.9],[99,[0,0,0],[0,0,0],[0,0,0],[0,0,0]]];
function shotRes(s){const mid=V.add(PSH,[-0.04,0.07,-0.45]);if(s[1]==='P1')return[s[0],V.add(mid,[2.2,0.6,0.1]),mid,V.add(mid,[1.95,0.5,0.1]),mid,0.8];
  if(s[1]==='P2')return[s[0],V.add(mid,[1.7,0.3,0.05]),mid,V.add(mid,[1.55,0.26,0.03]),mid,0.8];return s}
function camAt(t){for(let i=0;i<SHOTS.length-1;i++){const s=shotRes(SHOTS[i]),n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
function fireball(items,p,k,s){if(k<0)return;if(k<1.6){const r=s*(0.35+0.8*easeOut(k/0.35));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.35,0.08],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.6,0,1),add:1,noShadow:true})}}
