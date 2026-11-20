// ================= samurai timeline (deep space) =================
function voySpin(t){if(t<EV.thrust)return 0;const d=t-EV.thrust;const a=2.0;const tf=EV.fling-EV.thrust;if(d<tf)return 0.5*a*d*d;return 0.5*a*tf*tf+a*tf*(d-tf)}
const FL_DIR=V.norm([-0.85,0.22,-0.5]);
function flingState(t){const d=Math.max(0,t-EV.fling);const s=1.9*d-0.25*Math.min(d,3)*Math.min(d,3)*0.5;const c=V.add([0,0.9,0],V.sc(FL_DIR,Math.max(0,s)+0.0));
  const p=d*3.2-Math.min(d,2)*Math.min(d,2)*0.45;const yaw=Math.PI+voySpin(EV.fling)+d*1.6;return{c,p,yaw}}
function samAt(t){let o,extra={};const sur=P_(Object.assign({},PS.lookup,{lid:0,browA:0.6,mouth:'open'}));
  if(t<R[0]){o=PS.iai}
  // ---- R1 Io volcano: umbrella vs sulfur snow
  else if(t<R[1]){o=kf(t,[[R[0],PS.iai],[R[0]+0.6,PS.stand],[EV.plume+0.3,PS.stand],[EV.plume+0.8,PS.lookup],[EV.umb-0.3,PS.lookup],[EV.umb,PS.umb],[EV.cool,PS.umb],[EV.cool+0.4,P_(Object.assign({},PS.umb,{lid:0.75,head:{p:0.05}}))],[R[1],P_(Object.assign({},PS.umb,{lid:0.75,head:{p:0.05}}))]]);o=Object.assign({},o);
    if(t>=EV.umb-0.1)extra.umb=clamp((t-EV.umb+0.1)/0.35,0,1)*(1-clamp((t-R[1]+0.45)/0.4,0,1))}
  // ---- R2 Saturn's rings: slice the ice
  else if(t<R[2]){o=kf(t,[[R[1],PS.stand],[R[1]+0.8,PS.lookup],[EV.chunks+0.3,PS.lookup],[EV.chunks+0.8,PS.chudan],[EV.cut1-0.3,PS.s1a],[EV.cut1+0.05,PS.s1b],[EV.cut2-0.05,PS.s2b],[EV.cut3-0.25,PS.s3b],[EV.cut3+0.05,PS.cutlow],[EV.cut3+0.9,PS.cutlow],[EV.cut3+1.3,PS.rest],[EV.ice-0.7,PS.sheathA],[EV.ice-0.35,PS.stand],[EV.ice,PS.eat],[R[2]-0.4,PS.eat],[R[2],PS.stand]]);o=Object.assign({},o);
    if(t>=EV.ice-0.7&&t<EV.ice-0.35)o.sheathK=easeIn((t-EV.ice+0.7)/0.35);
    if(t>=EV.ice-0.2&&t<R[2]-0.3)extra.snow=1}
  // ---- R3 heliopause wall
  else if(t<R[3]){const meh=P_(Object.assign({},PS.cross,{lid:0.9}));o=kf(t,[[R[2],PS.stand],[R[2]+0.8,PS.lookup],[EV.brace-0.4,PS.lookup],[EV.brace,PS.chudan],[EV.pass-0.1,PS.chudan],[EV.pass+0.15,PS.frozen],[EV.meh-0.4,PS.frozen],[EV.meh,meh],[R[3],meh]]);o=Object.assign({},o);
    if(t>=EV.pass-0.05&&t<EV.pass+0.6){o.wind=3}}
  // ---- R4 one light-day: texting mom
  else if(t<R[4]){const rd=P_(Object.assign({},PS.hold,{head:{p:0.15,y:0.35},lid:0.25}));const waitP=P_(Object.assign({},PS.hold,{head:{p:0.15,y:0.35},lid:0.6,mouth:'flat'}));
    o=kf(t,[[R[3],PS.stand],[R[3]+0.9,PS.stand],[EV.send-1.0,rd],[EV.send+0.6,rd],[EV.send+1.0,waitP],[EV.nap-0.2,waitP],[EV.nap+0.3,PS.nap],[EV.reply-0.3,PS.nap],[EV.reply,rd],[EV.react,P_(Object.assign({},rd,{lid:0.85,mouth:'flat',head:{p:0.05,y:0.1}}))],[R[4],P_(Object.assign({},rd,{lid:0.85,mouth:'flat',head:{p:0.05,y:0.1}}))]]);o=Object.assign({},o);
    if((t>=EV.send-1.0&&t<EV.nap+0.05)||t>=EV.reply-0.25)extra.phone=1}
  // ---- FINAL: ONE cosmic ray -> bit flip -> spin -> yeet
  else{o=kf(t,[[R[4],PS.stand],[R[4]+0.6,PS.cross],[EV.ray-0.6,PS.cross],[EV.ray+0.1,PS.lookR],[EV.thrust,PS.lookR],[EV.thrust+0.35,PS.shock],[EV.fling,PS.shock],[EV.fling+0.3,PS.slip],[EV.ko-0.3,PS.slip],[EV.ko,PS.down],[99,PS.down]]);o=Object.assign({},o);
    if(t>=EV.thrust&&t<EV.fling){o.yawAdd=voySpin(t);o.wind=2}
    if(t>=EV.fling){const f=flingState(t);const Rm=M4.trs([0,0,0],f.yaw,f.p,0,1);const off=tp(Rm,[0,0.9,0]);o.root=V.sub(f.c,off);o.rootP=f.p;o.yawFix=f.yaw;o.wind=1.5}}
  o=Object.assign({},o);if(o.t==null)o.t=t;o.yaw=o.yawFix!=null?o.yawFix:Math.PI+(o.yawAdd||0);if(o.wind==null)o.wind=1;return{o,extra}}
function samItems(t){const{o,extra}=samAt(t);if(o.sheathK!=null&&o.sheathK>=0){const pre=charItems(Object.assign({},o,{sw:'none'}));
    const sayaA=tp(pre.Pm,[0.2,0.0,0.13]),sd=V.norm(td(pre.Pm,[0.06,0.33,1]));const k=o.sheathK;const hw=V.add(sayaA,V.sc(sd,0.1+0.34*(1-k)));const I=M4.inv(pre.Tm);o.hR=tp(I,hw);o.sd=td(I,V.sc(sd,-1));o.sw='hand';o.twoHand=false}
  const r=charItems(o);
  if(extra.umb){const H=r.hands[1];const s=0.25+0.75*easeOut(extra.umb);r.items.push({mesh:UMB,M:M4.trs(V.add(H,[0,-0.02,0]),0.3,0,0,[s,1,s])});r.umbC=V.add(H,[0,0.7,0]);r.umbR=0.6*s}
  if(extra.snow){const H=r.hands[1];const p=V.add(H,[0,0.03,-0.03]);r.items.push({mesh:CUP,M:M4.trs(p,0,0,0,1.15)});r.items.push({mesh:SNOW,M:M4.trs(V.add(p,[0,0.045,0]),0,0,0,[0.045,0.035,0.045]),tint:[0.95,0.97,1],tintAmt:0.3});
    r.items.push({mesh:SNOW,M:M4.trs(V.add(p,[0.01,0.07,0]),0,0,0,[0.022,0.018,0.022]),tint:[0.55,0.85,1],tintAmt:1})}
  if(extra.phone){const H=r.hands[1];const M=M4.mul(lookZ(V.add(H,[0,0.06,-0.01]),V.norm(V.sub(r.head,H)),1),M4.trs([0,0,0],0,-1.2,0,1));r.items.push({mesh:PHONE,M:lookZ(V.add(H,[0,0.07,0]),[0.2,-0.5,1],1),noShadow:true});r.phone=V.add(H,[0,0.07,0])}
  r.o=o;return r}
const CUP=um(m=>{m.prism([0,-0.04,0],0.032,0.042,0.075,14,hx('#3a5a4a'));m.prism([0,0.03,0],0.036,0.036,0.002,14,hx('#9ac860'))},0.5);
