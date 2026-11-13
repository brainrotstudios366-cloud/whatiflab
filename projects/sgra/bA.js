// ================= BLACK HOLE: timeline / camera / items =================
const EV={gal:5.81,size:12.85,suns:14.1,disk:19.37,friend:25.45,freeze:28.6,red:31.66,frz:32.43,fade:33.76,cross:35.17,horiz:37.6,wait:39.35,calm:41.5,inside:45.97,spag:50.55,stretch:51.19,nasa:56.68,timer:59.3,endc:62.93,loop:67.3};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.gal)return'hook';if(t<EV.size)return'galaxy';if(t<EV.disk)return'size';if(t<EV.friend)return'disk';if(t<EV.freeze)return'friend';if(t<EV.cross)return'freeze';if(t<EV.wait)return'cross';if(t<EV.calm)return'wait';if(t<EV.inside)return'calm';if(t<EV.spag)return'inside';if(t<EV.nasa)return'spag';if(t<EV.endc)return'nasa';return'end'}
const INSIDE=new Set(['calm','inside','spag','nasa']);
function envBase(){return{sun:[0.85,0.25,-0.45],sunCol:hx('#fff0dc'),sky:hx('#3a6ad0'),gnd:hx('#050816'),fog:hx('#000004'),fogD:1e7,zen:hx('#000004'),hor:hx('#04061a'),stars:1,night:0,emis:1.0,ground:0,sunSize:0.6,fillD:[-0.6,0.2,0.6],fillC:[0.05,0.05,0.08]}}
function envAt(t){const S=scn(t);const e=envBase();if(S==='galaxy'){e.stars=0.5}
  if(INSIDE.has(S)||S==='wait'){e.zen=hx('#120204');e.hor=hx('#3a0a06');e.fog=hx('#100204');e.stars=0.25;e.sunCol=hx('#ffb080');e.fillC=[0.12,0.04,0.03]}return e}
// astronaut path in hook / end (approach)
function hookA(t){const k=seg(t,0,5.8);return[lerp(1.6,0.9,k),lerp(1.2,0.7,k),lerp(10.5,7.2,k)]}
function camAt(t){const S=scn(t);let eye=[0,1,10],at=[0,0,0],fov=0.9;
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;const A=hookA(tt);eye=V.add(A,[1.1+0.2*Math.sin(tt*0.5),0.9,3.0-tt*0.08]);at=lerp3(A,[0,0,0],0.55);fov=0.95}
  if(S==='galaxy'){const k=ease(seg(t,EV.gal,EV.gal+5.5));eye=[lerp(4,1.5,k),lerp(34,17,k),lerp(30,14,k)];at=[0,0,lerp(0,1.5,k)];fov=0.9}
  if(S==='size'){const k=ease(seg(t,EV.size,EV.disk));eye=[lerp(-0.5,0.4,k),lerp(-0.1,0.0,k),lerp(5.6,5.1,k)];at=[0,-0.05,0];fov=0.9}
  if(S==='disk'){const k=seg(t,EV.disk,EV.friend);const a=lerp(0.25,1.25,k);const r=lerp(8.5,6.6,ease(k));eye=[Math.sin(a)*r,lerp(1.4,0.55,ease(k)),Math.cos(a)*r];at=[0,0.15,0];fov=0.85}
  if(S==='friend'){const k=ease(seg(t,EV.friend,EV.freeze));eye=[0,lerp(1.4,1.0,k),lerp(32,28,k)];at=[0,0.2,0];fov=0.75}
  if(S==='freeze'){eye=[0.2,1.3,15];at=[0,0.15,1.3];fov=0.3}
  if(S==='cross'){const A=crossA(t);eye=V.add(A,[0.95,0.35,2.4]);at=V.add(A,[-0.25,0.05,-1.2]);fov=0.95}
  if(S==='wait'){eye=[0,0,5];at=[0,0,0];fov=0.9}
  if(S==='calm'||S==='inside'||S==='spag'||S==='nasa'){const A=inA(t);const k=S==='spag'||S==='nasa'?ease(seg(t,EV.spag,EV.spag+1.5)):0;eye=V.add(A,[lerp(1.2,3.6,k),lerp(0.35,0.4,k),lerp(2.9,4.2,k)]);at=V.add(A,[0,lerp(0.1,-0.5,k),0]);fov=0.95}
  return{eye,at,fov}}
function crossA(t){const k=seg(t,EV.cross,EV.wait);return[0.15,0.05,lerp(2.3,0.55,k)]}
function inA(t){return[0.0,-0.2*Math.sin(t*0.3),-(t-EV.calm)*0.15]}
function camBasisB(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function bbM(p,s,cm){const b=camBasisB(cm);const z=V.sc(b.f,-1);return[b.r[0]*s,b.r[1]*s,b.r[2]*s,0,b.u[0]*s,b.u[1]*s,b.u[2]*s,0,z[0]*s,z[1]*s,z[2]*s,0,p[0],p[1],p[2],1]}
function bhItems(items,t,cm,o){o=o||{};const s=o.s||1,p=o.p||[0,0,0];const da=o.disk==null?1:o.disk;
  items.push({mesh:USPH,M:M4.trs(p,0,0,0,s*0.995),tint:[0,0,0],tintAmt:1,noShadow:true});
  if(da>0)items.push({mesh:BHDISK,M:M4.trs(p,-t*0.35,0.12,0.05,s),tint:null,tintAmt:0,alpha:da,add:1,noShadow:true});
  items.push({mesh:BHLENS,M:bbM(p,s,cm),tint:null,tintAmt:0,alpha:(o.lens==null?1:o.lens)*0.95,add:1,noShadow:true});
  items.push({mesh:BHPR,M:bbM(p,s,cm),tint:null,tintAmt:0,alpha:1,add:1,noShadow:true})}
function astroItems(items,M,o){o=o||{};const tint=o.tint,ta=o.tintAmt||0,al=o.alpha==null?1:o.alpha;
  items.push({mesh:ASTRO,M,tint:tint||null,tintAmt:ta,alpha:al,noShadow:true});
  items.push({mesh:VISOR,M:M4.mul(M,M4.trs([0,0.72,0.065],0,0,0,0.3)),tint:tint||null,tintAmt:ta*0.6,alpha:al,noShadow:true})}
function fgItems(t){const items=[];const S=scn(t);const cm=camAt(t);QR=null;
  if(S==='hook'||S==='end'){const tt=S==='end'?t-EV.endc:t;bhItems(items,t,cm);const A=hookA(tt);astroItems(items,M4.trs(A,tt*0.5+2.6,0.5+0.25*Math.sin(tt*0.8),0.3*Math.sin(tt*0.6),0.32))}
  if(S==='size'){bhItems(items,t,cm,{disk:0,lens:0.55});for(let i=0;i<18;i++){const k=seg(t,EV.suns+i*0.1,EV.suns+i*0.1+0.25);if(k<=0)continue;const r=1/18;items.push({mesh:SUNM,M:M4.trs([-1+r+i*2*r,-1.35,0.3],0,0,0,r*(0.98*easeOut(k)+0.15*Math.sin(k*Math.PI))),tint:[1,0.82,0.35],tintAmt:0.6,noShadow:true})}}
  if(S==='disk'){bhItems(items,t,cm);astroItems(items,M4.trs([2.8,0.75,4.1],t*0.4,0.4,0.2,0.16))}
  if(S==='friend'){bhItems(items,t,cm);astroItems(items,M4.trs([0.05,0.12,1.9],t*0.3,0,0,0.12));const k=seg(t,EV.friend,EV.friend+0.35);qItems(items,t,cm,{x:0.4,y:-0.74,s:0.2,d:3,pop:easeOut(k),expr:'open'})}
  if(S==='freeze'){bhItems(items,t,cm);const k=t-EV.freeze;const z=1.08+1.4*Math.exp(-k*0.75);const red=seg(t,EV.red-0.2,EV.frz+0.6);const fade=seg(t,EV.fade-0.3,EV.cross);
    astroItems(items,M4.trs([0.0,0.08,z],1.2+0.8*Math.exp(-k*0.75)*Math.sin(k),0.3,0.2,0.16),{tint:[1,0.12,0.05],tintAmt:red*0.85,alpha:1-fade*0.75})}
  if(S==='cross'){bhItems(items,t,cm,{lens:0.8});const A=crossA(t);const w=Math.sin(t*6)*0.5;const M=M4.trs(A,0.35,0.05,0,0.32);astroItems(items,M);
    items.push({mesh:USPH,M:M4.trs([0,0,0],0,0,0,1.0+0.004*Math.sin(t*30)),tint:[0.6,0.25,1],tintAmt:1,alpha:0.12+0.08*seg(t,EV.horiz-1,EV.horiz),add:1,noShadow:true})}
  if(S==='wait'){qItems(items,t,cm,{x:0,y:0.0,s:0.55,d:3,pop:easeOut(seg(t,EV.wait,EV.wait+0.3)),expr:'wide'})}
  if(S==='calm'||S==='inside'){const A=inA(t);astroItems(items,M4.trs(A,0.5+Math.sin(t*0.4)*0.2,0.15,0.1*Math.sin(t*0.7),0.32))}
  if(S==='spag'||S==='nasa'){const A=inA(t);const k=easeIn(seg(t,EV.stretch,EV.nasa+0.6));const ys=1+5.5*k,xs=1-0.68*k;const spin=S==='nasa'?(t-EV.nasa)*0.6:0;
    const M=M4.mul(M4.trs(A,0.5+spin,0.0,Math.PI/2*ease(seg(t,EV.spag,EV.stretch))+0.05,1),M4.trs([0,0,0],0,0,0,[0.32*xs,0.32*ys,0.32*xs]));astroItems(items,M,{tint:[1,0.45,0.25],tintAmt:k*0.5})}
  return items}
