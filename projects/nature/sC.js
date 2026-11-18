// ================= samurai poses =================
const PS={};
PS.stand=P_({pel:{y:0.92},fR:[-0.14,0.07,-0.02],fL:[0.15,0.07,0.06],hR:[-0.27,-0.08,0.06],hL:[0.19,-0.04,0.2],sw:'sheath',lid:0.25});
PS.iai=P_({pel:{y:0.86,p:0.06},tor:{tw:-0.12,b:0.08},head:{p:0.08},fR:[-0.22,0.07,-0.16],fL:[0.17,0.07,0.22],hR:[0.12,0.0,0.32],hL:[0.2,-0.05,0.2],sw:'sheath',lid:0.92});
PS.spin=P_({pel:{y:0.8,p:0.1},tor:{b:0.12},fR:[-0.36,0.07,-0.08],fL:[0.32,0.07,0.18],hR:[-0.6,0.3,0.12],hL:[0.55,0.28,-0.1],sd:[-1,0.02,0.2],sw:'hand',lid:0.4});
PS.follow=P_({pel:{y:0.68,p:0.25},tor:{tw:0.45,b:0.3},fR:[-0.5,0.07,-0.3],fL:[0.42,0.07,0.45],hR:[-0.55,0.1,0.35],hL:[0.5,0.15,-0.15],sd:[-0.75,-0.35,0.55],sw:'hand',lid:0.55});
PS.sheathA=P_({pel:{y:0.84,p:0.05},tor:{tw:0.4,b:0.05},fR:[-0.25,0.07,-0.12],fL:[0.2,0.07,0.2],hR:[0.0,0.12,0.5],hL:[0.21,-0.05,0.18],sw:'hand',lid:0.6});
PS.seiza=P_({pel:{y:0.47},fR:[-0.11,0.06,-0.22],fL:[0.11,0.06,-0.22],hR:[-0.16,-0.2,0.3],hL:[0.16,-0.2,0.3],sw:'sheath',lid:0.75});
PS.tea=P_(Object.assign({},PS.seiza,{hR:[-0.05,0.47,0.25],hL:[0.05,0.38,0.27],head:{p:0.18},lid:0.9}));
PS.lookup=P_(Object.assign({},PS.stand,{head:{p:-0.5},lid:0.05,browA:0.38}));
PS.crouch=P_({pel:{y:0.62,p:0.35},tor:{b:0.2},fR:[-0.3,0.07,-0.25],fL:[0.28,0.07,0.3],hR:[0.12,0.0,0.32],hL:[0.21,-0.05,0.2],sw:'sheath',head:{p:-0.55},lid:0.05,browA:0.4});
PS.jodan=P_({pel:{y:0.86},tor:{b:-0.05},fR:[-0.2,0.07,-0.2],fL:[0.15,0.07,0.25],hR:[-0.03,0.75,0.15],sd:[0,0.55,-0.83],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.15,head:{p:-0.2},browA:0.38});
PS.cutlow=P_({pel:{y:0.7,p:0.3},tor:{b:0.35},fR:[-0.25,0.07,-0.35],fL:[0.2,0.07,0.45],hR:[-0.03,0.0,0.5],sd:[0,-0.55,0.83],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.45});
PS.jump=P_({pel:{y:0.9},tor:{b:-0.1},fR:[-0.15,0.5,-0.15],fL:[0.15,0.45,0.1],hR:[-0.03,0.75,0.12],sd:[0,0.55,-0.83],sh:[1,0,0],sw:'hand',twoHand:true,head:{p:-0.35},lid:0.05,browA:0.4});
PS.jumpcut=P_({pel:{y:0.9},tor:{b:0.4},fR:[-0.15,0.35,-0.2],fL:[0.15,0.45,0.15],hR:[-0.03,0.05,0.55],sd:[0,-0.45,0.89],sh:[1,0,0],sw:'hand',twoHand:true,head:{p:0.0},lid:0.3,browA:0.4});
PS.land=P_({pel:{y:0.52,p:0.45},tor:{b:0.3,tw:0.2},fR:[-0.3,0.07,-0.45],fL:[0.28,0.07,0.35],hR:[-0.6,0.05,0.25],hL:[0.35,-0.05,0.35],sd:[-0.85,-0.45,0.25],sw:'hand',lid:0.55,head:{p:-0.1}});
PS.chudan=P_({pel:{y:0.84},fR:[-0.2,0.07,-0.2],fL:[0.16,0.07,0.25],hR:[-0.04,0.12,0.36],sd:[0,0.5,0.86],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.1,head:{p:-0.3},browA:0.4});
PS.block=P_(Object.assign({},PS.chudan,{hR:[-0.04,0.3,0.45],hL:[0.1,0.25,0.42],twoHand:false,sw:'spin'}));
PS.pat=P_(Object.assign({},PS.stand,{hL:[0.28,0.3,0.55],head:{p:0.0,y:0.4},lid:0.55}));
PS.s1a=P_({pel:{y:0.84},tor:{tw:-0.4},fR:[-0.22,0.07,-0.15],fL:[0.18,0.07,0.22],hR:[-0.35,0.62,0.15],sd:[-0.3,0.8,-0.4],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.0,browA:0.45,mouth:'open'});
PS.s1b=P_({pel:{y:0.78,p:0.2},tor:{tw:0.4,b:0.2},fR:[-0.22,0.07,-0.15],fL:[0.18,0.07,0.22],hR:[0.2,0.0,0.45],sd:[0.6,-0.5,0.6],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.0,browA:0.45,mouth:'open'});
PS.s2b=P_({pel:{y:0.8,p:0.1},tor:{tw:-0.5},fR:[-0.22,0.07,-0.15],fL:[0.18,0.07,0.22],hR:[-0.45,0.3,0.35],sd:[-0.9,0.1,0.4],sh:[0,1,0],sw:'hand',lid:0.0,browA:0.45,mouth:'open'});
PS.s3b=P_({pel:{y:0.88},tor:{tw:0.2,b:-0.15},fR:[-0.22,0.07,-0.15],fL:[0.18,0.07,0.22],hR:[0.05,0.75,0.3],sd:[0.2,0.95,0.2],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.0,browA:0.45,mouth:'open'});
PS.slapUp=P_(Object.assign({},PS.stand,{hR:[-0.35,0.75,0.05],lid:0.0,browA:0.45,head:{p:-0.05}}));
PS.slap=P_(Object.assign({},PS.stand,{hR:[-0.02,0.73,0.2],head:{p:-0.35},lid:1}));
function kf(t,list){// list [[t,pose],...] eased
  if(t<=list[0][0])return list[0][1];for(let i=0;i<list.length-1;i++){const[a,pa]=list[i],[b,pb]=list[i+1];if(t<b){return blendPose(pa,pb,ease((t-a)/(b-a)))}}return list[list.length-1][1]}
const EASE_SW=(t,a,b)=>clamp((t-a)/(b-a),0,1);
PS.umb=P_(Object.assign({},PS.stand,{hL:[0.1,0.36,0.22],head:{p:-0.12},lid:0.55,browA:0.2}));
PS.squint=P_(Object.assign({},PS.stand,{head:{p:-0.35},lid:0.8,browA:0.45,hR:[-0.06,0.56,0.24]}));
PS.nap=P_(Object.assign({},PS.seiza,{head:{p:0.35,r:0.15},lid:1}));
PS.hold=P_(Object.assign({},PS.stand,{hL:[0.36,0.5,0.4],head:{p:-0.15,y:0.45},lid:0.35,browA:0.15,mouth:'flat'}));
PS.peace=P_(Object.assign({},PS.stand,{lid:0.7,head:{p:0.1}}));
PS.stepA=P_(Object.assign({},PS.stand,{fL:[0.13,0.18,0.3],lid:0.7}));
PS.slip=P_({pel:{y:0.9,p:-0.5},tor:{b:-0.5},head:{p:-0.6},fR:[-0.14,0.55,0.7],fL:[0.14,0.75,0.55],hR:[-0.55,0.55,-0.1],hL:[0.55,0.6,-0.1],sw:'sheath',lid:0,browA:0.6,mouth:'open'});
PS.down=P_({pel:{y:0.9,p:0},tor:{b:0},head:{p:0.2},fR:[-0.16,0.35,0.55],fL:[0.16,0.2,0.6],hR:[-0.5,0.1,0.0],hL:[0.5,0.15,0.0],sw:'sheath',lid:0,mouth:'open',xeyes:true});
PS.gedan=P_({pel:{y:0.8,p:0.15},tor:{b:0.15},fR:[-0.22,0.07,-0.2],fL:[0.17,0.07,0.25],hR:[-0.04,0.0,0.36],sd:[0,-0.62,0.78],sh:[1,0,0],sw:'hand',twoHand:true,lid:0.1,head:{p:0.25},browA:0.4});
PS.rest=P_(Object.assign({},PS.stand,{hR:[-0.27,0.0,0.15],sd:[0.05,-0.7,0.7],sh:[1,0,0],sw:'hand',lid:0.6}));
PS.peer=P_(Object.assign({},PS.rest,{pel:{y:0.86,p:0.25},tor:{b:0.25},head:{p:0.35,y:0.0},hL:[0.25,0.25,0.5],lid:0.3,browA:0.2}));
PS.holdLow=P_(Object.assign({},PS.stand,{hL:[0.3,0.22,0.42],head:{p:0.35,y:0.3},lid:0.4,browA:0.15}));
PS.eat=P_(Object.assign({},PS.stand,{hL:[0.08,0.52,0.28],head:{p:0.05},lid:0.9,mouth:'open'}));
PS.lookR=P_(Object.assign({},PS.stand,{head:{p:-0.15,y:-0.5},lid:0.15,browA:0.4}));
PS.cross=P_(Object.assign({},PS.stand,{head:{p:-0.3},lid:0.85,browA:0.5,mouth:'flat'}));
function samAt(t){let o,extra={};
  if(t<R[0]){o=PS.iai}
  // ---- R1 mantis shrimp: low guard, punch hits the blade
  else if(t<R[1]){o=kf(t,[[R[0],PS.iai],[R[0]+0.6,PS.stand],[EV.mWind-0.8,PS.stand],[EV.mWind-0.3,PS.iai],[EV.mWind+0.05,PS.gedan],[EV.punch,PS.gedan],[EV.punch+0.12,P_(Object.assign({},PS.gedan,{pel:{y:0.78,p:0.05,z:-0.06},lid:0.3}))],[EV.punch+0.5,PS.gedan],[EV.mSheath,PS.gedan],[EV.mSheath+0.3,PS.sheathA],[EV.mSheath+0.9,PS.sheathA],[EV.mSheath+0.91,PS.stand],[R[1],PS.stand]]);o=Object.assign({},o);
    if(t>=EV.mSheath+0.3&&t<EV.mSheath+0.9)o.sheathK=easeIn((t-EV.mSheath-0.3)/0.6);if(t>=EV.mSheath+0.9)o.lid=0.6}
  // ---- R2 pistol shrimp: dango
  else if(t<R[2]){o=kf(t,[[R[1],PS.stand],[EV.dango-0.4,PS.stand],[EV.dango,PS.hold],[EV.cock-0.5,PS.hold],[EV.cock,PS.holdLow],[EV.snap+0.6,PS.holdLow],[EV.snap+1.2,PS.hold],[EV.yum-0.3,PS.hold],[EV.yum+0.1,PS.eat],[R[2]-0.6,PS.eat],[R[2],PS.stand]]);o=Object.assign({},o);
    if(t>=EV.dango-0.15&&t<EV.yum+0.45){extra.dango=clamp((t-EV.dango+0.15)/0.25,0,1);extra.toast=t>=EV.snap?1:0}}
  // ---- R3 crocodile
  else if(t<R[3]){o=kf(t,[[R[2],PS.stand],[EV.crocStop,PS.stand],[EV.crocStop+0.4,PS.iai],[EV.lunge+0.1,PS.iai],[EV.lunge+0.25,PS.s1b],[EV.jam+0.25,PS.s1b],[EV.jam+0.7,PS.rest],[EV.dent-0.4,PS.rest],[EV.dent,PS.peer],[R[3]-0.6,PS.peer],[R[3],PS.rest]]);o=Object.assign({},o);
    if(t>=EV.lunge+0.15&&t<EV.jam+0.6){const k=clamp((t-EV.lunge-0.15)/0.3,0,1)*(1-clamp((t-EV.jam-0.1)/0.5,0,1));o.root=[0,0,0.35*easeOut(k)]}}
  // ---- R4 whale: tea time
  else if(t<R[4]){o=kf(t,[[R[3],PS.rest],[R[3]+0.3,PS.sheathA],[R[3]+0.8,PS.sheathA],[R[3]+0.81,PS.stand],[R[3]+1.4,PS.stand],[R[3]+2.0,PS.seiza],[R[3]+2.6,PS.tea],[EV.reach+0.6,PS.tea],[EV.reach+1.0,PS.seiza],[EV.tiny-0.2,PS.seiza],[EV.tiny+0.2,PS.tea],[R[4]-0.9,PS.tea],[R[4]-0.2,PS.stand]]);o=Object.assign({},o);
    if(t>=R[3]+0.3&&t<R[3]+0.8)o.sheathK=easeIn((t-R[3]-0.3)/0.5);if(t>=R[3]+2.3&&t<R[4]-0.6)extra.cup=1;if(t>=EV.reach+0.6&&t<EV.tiny)o.head={y:0.25,p:-0.1,r:0};}
  // ---- FINAL mosquito
  else{o=kf(t,[[R[4],PS.stand],[EV.buzz,PS.stand],[EV.buzz+0.4,PS.lookR],[EV.sl1-0.6,PS.lookR],[EV.sl1-0.3,PS.s1a],[EV.sl1,PS.s1b],[EV.sl2-0.2,PS.s1b],[EV.sl2,PS.s2b],[EV.sl3-0.2,PS.s2b],[EV.sl3,PS.s3b],[EV.sl3+0.5,PS.s3b],[EV.sl3+0.8,PS.sheathA],[EV.sl3+1.4,PS.sheathA],[EV.sl3+1.41,PS.cross],[EV.mland-0.2,PS.cross],[EV.mland+0.3,P_(Object.assign({},PS.stand,{head:{p:-0.2},lid:0.0,browA:0.6}))],[EV.slapUp-0.3,P_(Object.assign({},PS.stand,{head:{p:-0.2},lid:0.0,browA:0.6}))],[EV.slapUp,PS.slapUp],[EV.slap-0.05,PS.slapUp],[EV.slap,PS.slap],[EV.slap+0.15,PS.slap],[EV.slap+0.4,PS.slip],[EV.floor,PS.slip],[EV.floor+0.25,PS.down],[R[5]+9,PS.down]]);o=Object.assign({},o);
    if(t>=EV.sl3+0.8&&t<EV.sl3+1.4)o.sheathK=easeIn((t-EV.sl3-0.8)/0.6);
    if(t>=EV.slap+0.1){const k=clamp((t-EV.slap-0.1)/(EV.floor-EV.slap-0.1),0,1);o.rootP=-easeIn(k)*1.42;o.root=[0,0.3*Math.sin(Math.min(1,k*1.6)*Math.PI*0.5)*(1-k)+0.06*k,-0.25*k];
      if(t>=EV.floor){const b=t-EV.floor;o.rootP=-1.42+Math.abs(Math.sin(b*14))*0.08*Math.exp(-b*6);o.root=[0,0.06,-0.25]}}}
  o=Object.assign({},o);o.t=t;if(o.wind==null)o.wind=1;return{o,extra}}
function samItems(t){const{o,extra}=samAt(t);if(o.sheathK!=null&&o.sheathK>=0){const pre=charItems(Object.assign({},o,{sw:'none'}));
    const sayaA=tp(pre.Pm,[0.2,0.0,0.13]),sd=V.norm(td(pre.Pm,[0.06,0.33,1]));const k=o.sheathK;const hw=V.add(sayaA,V.sc(sd,0.1+0.34*(1-k)));const I=M4.inv(pre.Tm);o.hR=tp(I,hw);o.sd=td(I,V.sc(sd,-1));o.sw='hand';o.twoHand=false}
  const r=charItems(o);if(extra.cup){const H=r.hands[-1];r.items.push({mesh:CUP,M:M4.trs(V.add(H,[0.0,0.03,0.04]),0,0,0,1)})}
  if(extra.dango){const H=r.hands[1];const s=extra.dango;const p=V.add(H,[0,0.02,0.02]);r.dango=V.add(p,[0,0.085*1.3,0]);r.items.push({mesh:DANGO,M:M4.trs(p,0,0.15,-0.2,1.3*s)});
    if(extra.toast)r.items.push({mesh:TOASTM,M:M4.trs(p,0,0.15,-0.2,1.3*s)})}
  r.o=o;return r}
const CUP=um(m=>{m.prism([0,-0.04,0],0.032,0.042,0.075,14,hx('#3a5a4a'));m.prism([0,0.03,0],0.036,0.036,0.002,14,hx('#9ac860'))},0.5);
