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
function samAt(t){let o,extra={};
  if(t<R[0]){o=PS.iai}
  // ---- Mercury
  else if(t<R[1]){o=kf(t,[[R[0],PS.iai],[R[0]+0.5,PS.squint],[EV.umb-0.3,PS.squint],[EV.umb,PS.umb],[EV.night,PS.umb],[EV.kneel,PS.stand],[EV.kneel+0.7,PS.seiza],[EV.tea,PS.seiza],[EV.tea+0.6,PS.tea]]);o=Object.assign({},o);
    if(t>=EV.umb-0.05&&t<EV.night)extra.umb=clamp((t-EV.umb+0.05)/0.25,0,1);if(t>=EV.tea-0.2)extra.cup=1}
  // ---- Venus
  else if(t<R[2]){o=kf(t,[[R[1],PS.tea],[R[1]+0.8,PS.tea],[R[1]+1.5,PS.stand],[EV.rain0,PS.stand],[EV.rain0+0.6,PS.lookup],[EV.dry-0.4,PS.lookup],[EV.dry,P_(Object.assign({},PS.stand,{lid:0.65,browA:0.15}))]]);o=Object.assign({},o);if(t<R[1]+1.2)extra.cup=1}
  // ---- Mars
  else if(t<R[3]){o=kf(t,[[R[2],PS.stand],[EV.dust-1.2,PS.stand],[EV.dust-0.6,PS.lookup],[EV.dust+0.3,PS.lookup],[EV.breeze,P_(Object.assign({},PS.stand,{lid:0.7}))],[EV.nap,P_(Object.assign({},PS.stand,{lid:0.85}))],[EV.nap+0.8,PS.nap]]);o=Object.assign({},o);
    if(t>=EV.dust)o.wind=2.2}
  // ---- Jupiter (Great Red Spot)
  else if(t<R[4]){o=kf(t,[[R[3],PS.nap],[EV.grs0,PS.nap],[EV.grs0+0.6,PS.seiza],[EV.grs0+1.3,PS.lookup],[EV.metUp,PS.lookup],[EV.jump-0.5,PS.crouch],[EV.jump,PS.crouch],[EV.jump+0.25,PS.jump],[EV.cut-0.08,PS.jump],[EV.cut+0.05,PS.jumpcut],[EV.land-0.05,PS.jumpcut],[EV.land+0.08,PS.land],[EV.land+0.7,PS.land],[EV.land+0.95,PS.sheathA],[EV.metClick,PS.sheathA],[EV.metClick+0.01,PS.stand],[R[4],PS.stand]]);o=Object.assign({},o);
    if(t>=EV.land+0.95&&t<EV.metClick)o.sheathK=easeIn((t-EV.land-0.95)/(EV.metClick-EV.land-0.95));
    if(t>=EV.jump&&t<EV.land){const k=(t-EV.jump)/(EV.land-EV.jump);o.root=[0,Math.max(0,12.5*k*(1-k)*4*0.55),0.6*k]}else if(t>=EV.land)o.root=[0,0,0.6];if(t>=EV.metClick)o.lid=0.6}
  // ---- Neptune
  else if(t<R[5]){o=kf(t,[[R[4],PS.stand],[EV.dia0,PS.stand],[EV.dia0+0.5,PS.lookup],[EV.spin0-0.3,PS.chudan],[EV.spin0,PS.block],[EV.spin1,PS.block],[EV.spin1+0.25,PS.sheathA],[EV.spin1+0.6,PS.sheathA],[EV.spin1+0.61,PS.stand],[EV.keep-0.1,PS.stand],[EV.keep+0.4,PS.hold],[R[5],PS.hold]]);o=Object.assign({},o);
    if(t>=EV.spin0&&t<EV.spin1)o.spinA=(t-EV.spin0)*34;if(t>=EV.spin1+0.25&&t<EV.spin1+0.6)o.sheathK=easeIn((t-EV.spin1-0.25)/0.35);if(t>=EV.keep)extra.gem=clamp((t-EV.keep)/0.2,0,1);o.wind=1.8}
  // ---- Earth: banana peel
  else{o=kf(t,[[R[5],PS.stand],[R[5]+0.6,PS.peace],[EV.step-0.4,PS.peace],[EV.step,PS.stepA],[EV.slip,PS.stepA],[EV.slip+0.22,PS.slip],[EV.floor,PS.slip],[EV.floor+0.25,PS.down],[R[6]+9,PS.down]]);o=Object.assign({},o);
    const zs=clamp((t-EV.step+0.4)/0.4,0,1)*0.32;o.root=[0,0,zs];
    if(t>=EV.slip){const k=clamp((t-EV.slip)/(EV.floor-EV.slip),0,1);o.rootP=-easeIn(k)*1.42;o.root=[0,0.55*Math.sin(Math.min(1,k*1.6)*Math.PI*0.5)*(1-k)+0.06*k,zs-0.25*k];
      if(t>=EV.floor){const b=t-EV.floor;o.rootP=-1.42+Math.abs(Math.sin(b*14))*0.08*Math.exp(-b*6);o.root=[0,0.06,zs-0.25]}}}
  o=Object.assign({},o);o.t=t;if(o.wind==null)o.wind=1;return{o,extra}}
function samItems(t){const{o,extra}=samAt(t);if(o.sheathK!=null&&o.sheathK>=0){const pre=charItems(Object.assign({},o,{sw:'none'}));
    const sayaA=tp(pre.Pm,[0.2,0.0,0.13]),sd=V.norm(td(pre.Pm,[0.06,0.33,1]));const k=o.sheathK;const hw=V.add(sayaA,V.sc(sd,0.1+0.34*(1-k)));const I=M4.inv(pre.Tm);o.hR=tp(I,hw);o.sd=td(I,V.sc(sd,-1));o.sw='hand';o.twoHand=false}
  const r=charItems(o);if(extra.cup){const H=r.hands[-1];r.items.push({mesh:CUP,M:M4.trs(V.add(H,[0.0,0.03,0.04]),0,0,0,1)})}
  if(extra.umb){const H=r.hands[1];const s=0.25+0.75*easeOut(extra.umb);r.items.push({mesh:UMB,M:M4.trs(V.add(H,[0,-0.02,0]),0.3,0,0,[s,1,s])})}
  if(extra.gem){const H=r.hands[1];const s=0.11*easeOut(extra.gem);r.items.push({mesh:DIAM,M:M4.trs(V.add(H,[0,0.1,0.02]),t*1.5,0,0.2,s),noShadow:true});r.gem=V.add(H,[0,0.1,0.02])}
  r.o=o;return r}
const CUP=um(m=>{m.prism([0,-0.04,0],0.032,0.042,0.075,14,hx('#3a5a4a'));m.prism([0,0.03,0],0.036,0.036,0.002,14,hx('#9ac860'))},0.5);
