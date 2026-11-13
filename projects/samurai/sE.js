// ================= environment =================
function envBase(){return{sun:[0.82,0.26,0.5],sunCol:hx('#ffd2a0'),sky:hx('#a8b4dc'),gnd:hx('#8a7a5a'),fog:hx('#f2b88e'),fogD:2600,zen:hx('#2f4192'),hor:hx('#ffad78'),stars:0,night:0,emis:1.2,ground:0,sunSize:3,fillD:[-0.4,0.5,0.75],fillC:[0.2,0.18,0.24]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const ENV_MET=Object.assign(envBase(),{sunCol:hx('#ff9a5a'),sky:hx('#c08070'),fog:hx('#c86848'),zen:hx('#3a1424'),hor:hx('#ff7038'),gnd:hx('#7a4a30'),fillC:[0.3,0.12,0.05]});
const ENV_WAV=Object.assign(envBase(),{sun:[0.3,0.55,-0.75],fillD:[0,0.4,-1],sunCol:hx('#9ab0bc'),sky:hx('#8aa0b0'),fog:hx('#6e8792'),zen:hx('#1c2a36'),hor:hx('#8aa4ae'),gnd:hx('#5a6660'),fillC:[0.3,0.36,0.4],fogD:2000});
const ENV_DRA=Object.assign(envBase(),{sun:[0.85,0.18,0.4],sunCol:hx('#ff9070'),sky:hx('#9a80b8'),fog:hx('#9a6290'),zen:hx('#171338'),hor:hx('#e07aa0'),gnd:hx('#6a5070'),fillC:[0.16,0.12,0.24],stars:0.5});
const ENV_FIN=Object.assign(envBase(),{sunCol:hx('#ffc8a0'),hor:hx('#ff9a88'),zen:hx('#3a3a8a'),fog:hx('#f0a898')});
function envAt(t){const rn=roundAt(t);let e=envBase();
  const tr=(t0,d)=>ease((t-t0)/d);
  if(rn===1){e=mixEnv(envBase(),ENV_MET,tr(R[1]+0.5,2.5));const k=clamp((t-EV.metUp)/1.9,0,1)*(t<EV.cut+0.4?1:0);e.fillC=V.add(e.fillC,[1.3*k,0.6*k,0.2*k]);e.fillD=[0.05,0.8,0.6];
    const b=t-EV.boom;if(b>0){const f=Math.exp(-b*1.2);e.fillC=V.add(e.fillC,[1.6*f,0.7*f,0.25*f]);e.fillD=[0,0.5,-1];e.hor=mix3(e.hor,hx('#ffb060'),f*0.6)}}
  if(rn===2){e=mixEnv(ENV_MET,ENV_WAV,tr(R[2],1.2));}
  if(rn===3){e=mixEnv(ENV_WAV,ENV_DRA,tr(R[3],1.0));const f=t>=EV.fire0&&t<EV.fire1+0.3?0.8+0.2*Math.sin(t*40):0;e.fillC=V.add(e.fillC,[1.4*f,0.6*f,0.15*f]);if(f>0)e.fillD=[0,0.4,1]}
  if(rn>=4){e=mixEnv(ENV_DRA,ENV_FIN,tr(R[4],1.0))}
  return e}
// ================= camera =================
const SHOTS=[[0,[2.4,1.35,3.2],[0,1.25,0],[1.0,1.25,3.8],[0,1.25,0],0.9],
 [R[0],[0.6,2.1,-5.5],[0,1.0,20],[0.5,1.9,-4.6],[0,1.0,20]],[5.4,[0.75,1.55,1.5],[0,1.56,0],[0.62,1.55,1.3],[0,1.56,0],0.8],
 [EV.leap,[-2.8,0.6,-3.6],[0,1.8,3],[-3.3,0.8,-2.4],[0,1.8,3]],[EV.spin,[0,6.5,-5],[0,0.5,1.5],[0,7,-4.6],[0,0.5,1.5]],
 [EV.sheath0,[-1.3,1.0,-3.2],[0.2,1.8,3.0],[-1.1,1.0,-2.8],[0.2,1.8,3.0],0.95],[EV.click,[0.8,2.4,-5.5],[0,0.6,12],[0.7,2.2,-4.8],[0,0.6,12]],
 [EV.tea,[1.5,1.05,2.7],[0,0.75,0],[1.25,1.0,2.3],[0,0.75,0]],
 [R[1],[0.9,0.5,-3.2],[-4,45,160],[0.8,0.55,-2.8],[-4,48,160]],[EV.metUp,[0.8,1.1,1.9],[0,1.25,0],[0.7,1.0,1.7],[0,1.15,0],0.85],
 [EV.jump,[-15,3,-3],[0,7,2],[-14,5,-1],[0,8,3]],[EV.cut,[-1.5,1.0,-9],[0,7,6],[-1.5,1.4,-8],[0,8,4]],[EV.land,[1.0,1.25,3.6],[0,1.0,0.6],[0.8,1.2,2.9],[0,1.0,0.6]],
 [R[2],[0.5,3.0,-8],[0,10,60],[0.4,2.6,-7],[0,10,60]],[31.0,[0.6,1.0,-5.5],[0,14,30],[0.5,0.9,-4.8],[0,14,30]],[EV.wcut,[0.6,1.0,-6],[0,12,30],[0.4,0.9,-5],[0,12,30]],[36.6,[1.0,1.3,3.2],[0,1.2,0],[0.8,1.3,2.8],[0,1.2,0]],
 [R[3],[-1.0,0.7,-4.5],[0,10,30],[-0.8,0.7,-4],[0,10,30]],[EV.roar,[-1.2,1.1,-4.0],[0,4.6,9],[-1.1,1.1,-3.7],[0,4.6,9]],[EV.fire0,[-1.6,0.9,-4.4],[0,4.3,8],[-1.3,0.8,-3.9],[0,4.3,8]],
 [EV.djump,[-2,0.5,-12],[0,8.5,5],[-1.8,0.6,-11],[0,8.5,5]],[EV.dland,[-3.4,2.1,7.8],[1.5,1.3,1.0],[-3.0,2.0,7.0],[1.5,1.3,1.0]],
 [R[4],[0.9,1.0,2.4],[0,0.95,0],[0.7,1.0,2.0],[0,0.95,0]],[EV.swat0,[1.3,1.5,3.4],[0,1.3,0],[1.2,1.5,3.2],[0,1.3,0]],[EV.land2,[0.32,1.8,0.78],[0,1.74,0],[0.28,1.79,0.7],[0,1.74,0],0.8],
 [EV.slap,[2.5,1.6,1.5],[0,0.4,-0.6],[2.4,1.6,1.4],[0,0.4,-0.6]],[R[5],[2.3,1.8,1.2],[0,0.3,-0.8],[2.2,1.8,1.1],[0,0.3,-0.8]],[99,[0,0,0],[0,0,0],[0,0,0],[0,0,0]]];
function camAt(t){for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
// ================= ninjas =================
const LEAP=[];{const r=rngG(8);for(let i=0;i<10;i++){const a=-1.15+2.3*i/9+(r()-0.5)*0.15;LEAP.push({a,r0:9+r()*3,r1:2.1+r()*0.7,h:1.0+r()*2.0,sd:i*7})}}
function crowdZ(t){return 58-9.5*(Math.min(t,EV.spin)-R[0])}
function ninjaLeapPose(L,t){const p=ninjaPose(0,'run',L.sd);p.style='ninja';p.t=t;
  let r,y,rp=0,pos;
  if(t<EV.leap){const k=t-EV.leap;r=L.r0-11*k;y=0;const ph=t*11+L.sd;const q=ninjaPose(ph,'run',L.sd);Object.assign(p,q)}
  else if(t<EV.click){const u=clamp((t-EV.leap)/(EV.spin-EV.leap),0,1);const k=1-Math.pow(1-u,2.2);r=lerp(L.r0,L.r1,k)-(t>EV.spin?(t-EV.spin)*0.05:0);y=L.h*Math.sin(Math.min(1,k*1.15)*Math.PI/2)+(t>EV.spin?(t-EV.spin)*0.03:0);
    Object.assign(p,{pel:{y:0.9,z:0,p:0.2,r:0},tor:{tw:0,b:0.1,s:0},fR:[-0.15,0.45,-0.25],fL:[0.15,0.62,0.15],hR:[-0.05,0.72,0.05],sd:[0,0.6,-0.8],sh:[1,0,0],sw:'hand',twoHand:true,head:{y:0,p:-0.25,r:0}})}
  else{const d=t-EV.click;r=L.r1+d*0.3;const y0=L.h+0.03*(EV.click-EV.spin);y=Math.max(0.12,y0-4.9*d*d);rp=-clamp(d/0.55,0,1)*Math.PI/2*0.95;
    Object.assign(p,{pel:{y:0.9,z:0,p:0,r:0},fR:[-0.2,0.07,0.1],fL:[0.2,0.07,0.0],hR:[-0.5,0.2,0.1],hL:[0.5,0.25,0.0],sw:'none'})}
  p.root=[Math.sin(L.a)*r,y,Math.cos(L.a)*r];p.yaw=L.a+Math.PI;p.rootP=rp;return p}
// ================= dragon =================
const DN=50;
function dragonPts(t){const pts=[];const pathA=τ=>{const w=0.72;return[12*Math.sin(w*τ),16+3*Math.sin(1.3*τ),40+12*Math.cos(w*τ)]};
  const Hh=[0,7.2+0.5*Math.sin(t*2),12.5];const kB=ease((t-EV.roar+0.9)/0.9);const kD=ease((t-EV.bow)/1.3);let rec=0;if(t>=EV.dcut&&t<EV.bow+0.5)rec=Math.exp(-(t-EV.dcut)*2.5)*Math.min(1,(t-EV.dcut)/0.12);
  for(let i=0;i<DN;i++){const A=pathA(t-i*0.075);const s=i/DN;
    const B=V.add(Hh,[5.5*Math.sin(i*0.17+t*1.4)*s+2.5*s,i*0.18+2.2*Math.sin(i*0.14+t*1.1)*s,i*0.72]);
    const ga=i*0.33,rad=4.2-i*0.04;const D=i<5?lerp3([3.6,1.45,2.0],[5.2,1.1,4.8],i/5):[8+rad*Math.cos(ga+3.6),0.9+0.1*Math.sin(i),8+rad*Math.sin(ga+3.6)];
    let p=lerp3(A,B,kB);p=lerp3(p,D,kD);if(rec>0)p=V.add(p,V.sc([0,3,4],rec*Math.max(0,1-i/12)));pts.push(p)}
  return pts}
function dragonItems(items,t){const pts=dragonPts(t);
  for(let i=1;i<DN;i++){const s=i/DN;const r=1.05*(1-0.75*Math.pow(s,1.4))*(i<4?0.85:1);const p=pts[i];const d=V.sub(pts[i-1],p);
    items.push({mesh:USPH,M:frameM(p,d,[0,1,0],[r,r*0.9,r]),tint:i%2?DC.body:DC.body2,tintAmt:1});items.push({mesh:USPH,M:frameM(V.add(p,[0,-r*0.42,0]),d,[0,1,0],[r*0.75,r*0.7,r*0.62]),tint:DC.belly,tintAmt:1,noShadow:true});
    if(i%2===0)items.push({mesh:CONE,M:frameM(V.add(p,[0,r*0.95,0]),V.add([0,1,0],V.sc(V.norm(d),-0.6)),[1,0,0],[r*0.3,r*0.7,r*0.15]),tint:DC.gold,tintAmt:1,noShadow:true});
    if(i===9||i===30){const sd=V.norm(V.cross(d,[0,1,0]));for(const sx of[-1,1])items.push({mesh:DCLAW,M:frameM(V.add(p,V.sc(sd,sx*r*0.8)),[0,1,0],V.sc(d,1),r*1.1)})}}
  items.push({mesh:USPH,M:M4.trs(pts[DN-1],0,0,0,0.25),tint:DC.mane,tintAmt:1});
  // head
  const H=pts[0];const heroH=[0,1.5,0];let fwd;if(t<EV.roar-0.5)fwd=V.norm(V.sub(pts[0],pts[1]));else fwd=V.norm(V.sub(heroH,H));if(t>=EV.dcut&&t<EV.bow)fwd=V.norm(V.add(fwd,[0,0.6*Math.exp(-(t-EV.dcut)*2),0]));
  const yaw=Math.atan2(fwd[0],fwd[2]),pit=-Math.asin(clamp(fwd[1],-1,1));const HM=M4.trs(H,yaw,pit+(t>=EV.bow+0.8?0.15:0),0,1.35);
  items.push({mesh:DHEAD,M:HM});let jaw=0;if(t>=EV.roar&&t<EV.fire1+0.2)jaw=0.55*ease((t-EV.roar)/0.2)*(t>EV.fire1?1-(t-EV.fire1)/0.2:1);
  items.push({mesh:DJAW,M:M4.mul(HM,M4.trs([0,-0.15,0.1],0,jaw,0,1))});
  // whiskers
  for(const sx of[-1,1]){let prev=tp(HM,[sx*0.3,0.0,1.9]);for(let k=1;k<=6;k++){const q=tp(HM,[sx*(0.3+k*0.35),-0.1-k*0.12+0.15*Math.sin(t*3+k*0.8+sx),1.9-k*0.25]);items.push({mesh:UCYL,M:segM(prev,q,0.035),tint:DC.gold,tintAmt:1,noShadow:true});prev=q}}
  if(t>=EV.bow+1.2){const k=ease((t-EV.bow-1.2)/0.4);/* closed eyes: lids */for(const sx of[-1,1])items.push({mesh:USPH,M:M4.mul(HM,M4.trs([sx*0.43,0.45,0.58],0,0,0,[0.22,0.2*k,0.22])),tint:DC.body2,tintAmt:1,noShadow:true})}
  return{HM,mouth:tp(HM,[0,-0.05,2.3]),head:H}}
// ================= mosquito =================
function mosqPos(t,headP,fwd){const jit=[0.15*Math.sin(t*13)+0.08*Math.sin(t*31),0.1*Math.sin(t*17+1),0.12*Math.cos(t*11)];
  if(t<EV.wait)return[6,2.5,3];if(t<EV.swat0){const k=ease((t-EV.wait)/0.6);return V.add(lerp3([3,2,2],V.add(headP,[0.45,0.15,0.35]),k),jit)}
  if(t<EV.swat1){const ph=(t-EV.swat0)*6.5;return V.add(headP,V.add([0.5*Math.sin(ph),0.25+0.2*Math.cos(ph*1.3),0.45+0.15*Math.cos(ph)],V.sc(jit,1.6)))}
  const fh=V.add(headP,V.add(V.sc(fwd,0.11),[0,0.07,0]));if(t<EV.land2){const k=ease((t-EV.swat1)/(EV.land2-EV.swat1));return lerp3(V.add(headP,[0.4,0.3,0.4]),fh,k)}
  if(t<EV.slap-0.02)return fh;const d=t-EV.slap;return V.add(fh,[d*2.5,0.3+d*1.8,d*1.2])}
function mosqItems(items,t,p,landed){const yaw=landed?Math.PI:Math.atan2(Math.cos(t*3),Math.sin(t*2))+t;const M=M4.trs(p,yaw,landed?0.3:0.1*Math.sin(t*9),0,0.075);items.push({mesh:MOSQ,M});
  const fl=landed?0.2:Math.sin(t*260)*0.9;for(const sx of[-1,1])items.push({mesh:WING,M:M4.mul(M,M4.trs([sx*0.1,0.2,0.05],sx>0?0:Math.PI,0,sx*fl,[1.6,1,1.6])),tint:null,alpha:0.55,noShadow:true})}
// ================= fx helpers =================
function fireball(items,p,k,s){if(k<0)return;if(k<1.6){const r=s*(0.35+0.8*easeOut(k/0.35));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.35,0.08],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.6,0,1),add:1,noShadow:true})}
  if(k<8){const rr=s*(0.6+3.0*easeOut(k/1.5));items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[rr,s*0.35*(1+k*0.3),rr]),alpha:clamp(1-(k-2.5)/5,0,1)*0.9});
    for(let i=0;i<7;i++){const a=i*1.3;const q=[p[0]+Math.cos(a)*s*0.4,p[1]+s*(0.5+k*0.9)+i*s*0.3,p[2]+Math.sin(a)*s*0.4];items.push({mesh:PUFF,M:M4.trs(q,i,0,0,s*(0.35+k*0.12)),tint:mix3([0.95,0.45,0.15],[0.25,0.22,0.22],clamp(k/1.2,0,1)),tintAmt:clamp(0.4+k*0.3,0,0.9),alpha:clamp(0.9-k/8,0,1),noShadow:true})}}}
