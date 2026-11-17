// ================= environment =================
function envBase(){return{sun:[0.82,0.26,0.5],sunCol:hx('#ffd2a0'),sky:hx('#a8b4dc'),gnd:hx('#8a7a5a'),fog:hx('#f2b88e'),fogD:2600,zen:hx('#2f4192'),hor:hx('#ffad78'),stars:0,night:0,emis:1.2,ground:0,sunSize:3,fillD:[-0.4,0.5,0.75],fillC:[0.2,0.18,0.24]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb===undefined?va:vb,k):(typeof va==='number'?va+((vb===undefined?va:vb)-va)*k:va)}return r}
const ENV_TIT=Object.assign(envBase(),{sun:[0.3,0.3,0.9],zen:hx('#0c0f3a'),hor:hx('#8a5aa8'),sky:hx('#7a7ab0'),fog:hx('#6a5a90'),stars:0.9,sunCol:hx('#ffc890'),fillC:[0.25,0.2,0.35],fillD:[0,0.4,-1]});
const ENV_MER=Object.assign(envBase(),{sun:[0.28,0.3,0.91],sunCol:hx('#fff2d0'),sunSize:14,zen:hx('#05040c'),hor:hx('#6a5040'),sky:hx('#9a8a80'),fog:hx('#7a6250'),gnd:hx('#7a6a60'),stars:0.6,fillC:[0.18,0.14,0.12],fillD:[0,0.4,-1],emis:1.3});
const ENV_MERN=Object.assign(envBase(),{sun:[0.3,0.7,-0.6],sunCol:hx('#6a80c0'),sunSize:0.3,zen:hx('#010208'),hor:hx('#0a1430'),sky:hx('#3a4a7a'),fog:hx('#0a1228'),gnd:hx('#2a2a3a'),stars:1.4,night:1,fillC:[0.08,0.1,0.2],fillD:[0,0.5,1],emis:1.4});
const ENV_VEN=Object.assign(envBase(),{sun:[0.2,0.6,0.77],sunCol:hx('#ffb860'),sunSize:1.5,zen:hx('#8a5a1a'),hor:hx('#ffc060'),sky:hx('#d0a050'),fog:hx('#d8a050'),fogD:700,gnd:hx('#8a6030'),fillC:[0.35,0.22,0.08],fillD:[0,0.4,-1]});
const ENV_MAR=Object.assign(envBase(),{sun:[0.4,0.35,0.85],sunCol:hx('#ffc8a0'),sunSize:1.2,zen:hx('#5a2a20'),hor:hx('#e0905a'),sky:hx('#c07050'),fog:hx('#c07048'),fogD:1400,gnd:hx('#7a3a20'),fillC:[0.3,0.12,0.06],fillD:[0,0.4,-1]});
const ENV_MARS2=Object.assign({},ENV_MAR,{fog:hx('#b86a42'),fogD:90,hor:hx('#c87a50'),zen:hx('#8a4a30'),sunSize:0.4});
const ENV_JUP=Object.assign(envBase(),{sun:[0.82,0.26,0.5],sunCol:hx('#ffd8b0'),zen:hx('#120c20'),hor:hx('#c08a60'),sky:hx('#a08070'),fog:hx('#a07860'),gnd:hx('#7a5a40'),stars:0.5,fillC:[0.3,0.18,0.1],fillD:[0,0.4,-1]});
const ENV_NEP=Object.assign(envBase(),{sun:[0.5,0.5,0.7],sunCol:hx('#c8e0ff'),sunSize:0.5,zen:hx('#04103a'),hor:hx('#3a7ad0'),sky:hx('#5a8ac8'),fog:hx('#2a5aa0'),fogD:1600,gnd:hx('#2a4a6a'),stars:0.6,fillC:[0.12,0.2,0.4],fillD:[0,0.4,1],emis:1.3});
const ENV_EAR=Object.assign(envBase(),{sunCol:hx('#ffd8b0'),hor:hx('#ffb090'),zen:hx('#3a5aa8')});
const WTINT=[[0,0,0,0],[0.58,0.52,0.48,0.55],[0.9,0.62,0.25,0.5],[0.78,0.34,0.16,0.62],[0.7,0.52,0.4,0.3],[0.3,0.48,0.75,0.4],[0,0,0,0]];
function worldTint(t){const rn=roundAt(t)+1;const prev=WTINT[Math.max(0,rn-1)],cur=WTINT[rn];const t0=rn>0?R[rn-1]:0;let k=ease((t-t0)/1.0);if(rn===1)k=ease((t-R[0]-0.3)/1.5);
  let a=prev[3]+(cur[3]-prev[3])*k;let c=mix3(prev[3]>0?prev.slice(0,3):cur.slice(0,3),cur[3]>0?cur.slice(0,3):prev.slice(0,3),k);if(rn===1&&t>=EV.night){c=[0.25,0.3,0.45];a=0.45}return{c,a}}
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e;
  if(rn<0)e=ENV_TIT;
  else if(rn===0){e=mixEnv(ENV_TIT,ENV_MER,tr(R[0],1.6));if(t>=EV.night)e=mixEnv(ENV_MER,ENV_MERN,tr(EV.night,0.25))}
  else if(rn===1){e=mixEnv(ENV_MERN,ENV_VEN,tr(R[1],1.2));if(t>=EV.rain0)e=mixEnv(ENV_VEN,Object.assign({},ENV_VEN,{fogD:260,zen:hx('#6a4a1a'),hor:hx('#d8a050')}),tr(EV.rain0,1.5))}
  else if(rn===2){e=mixEnv(ENV_VEN,ENV_MAR,tr(R[2],1.2));if(t>=EV.dust-0.3)e=mixEnv(ENV_MAR,ENV_MARS2,tr(EV.dust-0.3,0.6))}
  else if(rn===3){e=mixEnv(ENV_MARS2,ENV_JUP,tr(R[3],1.2));const k=clamp((t-EV.metUp)/1.9,0,1)*(t<EV.cut+0.4?1:0);e.fillC=V.add(e.fillC,[1.2*k,0.4*k,0.15*k]);if(k>0)e.fillD=[0.05,0.8,0.6];
    const b=t-EV.cut;if(b>0){const f=Math.exp(-b*1.5);e.fillC=V.add(e.fillC,[1.2*f,0.5*f,0.2*f])}}
  else if(rn===4)e=mixEnv(ENV_JUP,ENV_NEP,tr(R[4],1.2));
  else e=mixEnv(ENV_NEP,ENV_EAR,tr(R[5],1.2));
  return e}
// ================= camera =================
const SHOTS=[[0,[0.55,0.75,-3.0],[0,9.5,20],[0.45,0.95,-2.5],[0,10.5,20],1.0],
 [R[0],[0.75,1.55,1.5],[0,1.56,0],[0.62,1.55,1.3],[0,1.56,0],0.8],[5.0,[0.7,1.0,-4.6],[0,11,30],[0.6,1.2,-4.0],[0,12,30],1.0],
 [EV.umb-0.2,[1.5,1.25,3.3],[0,1.45,0],[1.25,1.3,2.9],[0,1.45,0],0.9],[EV.night,[1.6,1.05,2.8],[0,0.8,0],[1.3,1.0,2.4],[0,0.75,0]],
 [R[1],[0.5,1.0,-5.5],[0,13,30],[0.45,1.0,-4.8],[0,14,30]],[EV.rain0,[2.0,0.4,4.6],[0,3.4,0],[1.8,0.42,4.2],[0,3.6,0],1.05],[EV.dry-0.4,[1.1,1.3,3.2],[0,1.25,0],[0.95,1.3,2.8],[0,1.25,0],0.9],
 [R[2],[0.6,1.5,-5.0],[0,9,40],[0.5,1.4,-4.4],[0,9,40]],[EV.dust,[1.4,1.4,3.1],[0,1.3,0],[1.2,1.35,2.7],[0,1.3,0],0.9],[EV.nap,[1.6,1.05,2.8],[0,0.8,0],[1.3,1.0,2.4],[0,0.75,0]],
 [R[3],[0.45,0.5,-3.2],[4,80,180],[0.4,0.55,-2.8],[4,84,180],1.0],[EV.metUp,[0.8,1.1,1.9],[0,1.25,0],[0.7,1.0,1.7],[0,1.15,0],0.85],
 [EV.jump,[-6,1.5,-4],[0,9,6],[-5.5,3,-3],[0,10,6]],[EV.cut,[-1.5,1.0,-9],[0,7,6],[-1.5,1.4,-8],[0,8,4]],[EV.land,[1.0,1.25,3.6],[0,1.0,0.6],[0.8,1.2,2.9],[0,1.0,0.6]],
 [R[4],[0.5,1.2,-5.5],[0,13,30],[0.45,1.1,-4.8],[0,14,30]],[EV.dia0,[1.3,0.6,3.0],[0,5,0],[1.15,0.65,2.7],[0,5.5,0],1.0],[EV.spin0,[1.7,1.35,3.7],[0,1.6,0.3],[1.45,1.3,3.2],[0,1.6,0.3],0.9],
 [EV.keep-0.2,[1.5,1.6,2.6],[0.1,1.6,0.2],[1.3,1.65,2.3],[0.1,1.7,0.2],0.85],
 [R[5],[1.3,1.4,3.4],[0,1.2,0],[1.1,1.35,3.0],[0,1.2,0],0.9],[EV.boss,[3.0,0.9,2.2],[0,0.45,0.4],[2.8,0.85,2.0],[0,0.45,0.4],0.8],[EV.step-0.3,[3.6,1.3,0.2],[0,1.15,0.15],[3.4,1.3,0.0],[0,1.1,-0.2],0.95],
 [EV.floor+0.5,[2.6,1.7,-0.4],[0,0.3,-1.0],[2.4,1.65,-0.5],[0,0.3,-1.0]],[R[6],[2.4,1.8,-0.5],[0,0.3,-1.0],[2.3,1.8,-0.6],[0,0.3,-1.0]],[99,[0,0,0],[0,0,0],[0,0,0],[0,0,0]]];
function camAt(t){for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
function fireball(items,p,k,s){if(k<0)return;if(k<1.6){const r=s*(0.35+0.8*easeOut(k/0.35));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.35,0.08],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.6,0,1),add:1,noShadow:true})}}
