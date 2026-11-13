// SAMURAI
const FPS=30,DUR=66,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();
// ---------- timeline ----------
const R=[3.4,17.0,28.5,40.0,53.0,61.6];
const EV={charge:3.4,leap:6.9,spin:8.15,sheath0:8.6,click:10.0,kneel:11.6,tea:12.6,
  met0:17.0,metUp:19.6,jump:20.9,cut:21.55,land:22.4,metClick:23.6,boom:23.9,
  wav0:28.5,raise:32.2,wcut:33.6,wClick:37.0,
  dra0:40.0,roar:43.2,fire0:44.2,fire1:46.6,djump:46.8,dcut:47.35,dland:48.1,bow:48.8,pat:50.4,
  peace:53.0,wait:55.0,swat0:55.6,swat1:57.3,land2:57.6,slap:59.0,
  endc:61.6,loop:65.6};
const ROUNDS=[['STAGE 1','1000 ninjas 🥷','*click* 😐',EV.click+0.05,'…then made tea 🍵',EV.tea+0.4],
  ['STAGE 2','A meteor ☄️','Cut in half 🔪',EV.cut+0.15,"Didn't even look back 😎",EV.boom+0.2],
  ['STAGE 3','A 100m tsunami 🌊','Split the ocean ⚔️🌊',EV.wcut+0.2,'Not even wet 💅',EV.wClick+0.1],
  ['STAGE 4','An ancient dragon 🐉','Blocked fire with a sword 🔥',EV.fire0+0.5,'Now it\'s his pet 🐶',EV.bow+0.4],
  ['FINAL BOSS','One mosquito 🦟','Cause of death: himself 💀',EV.slap+0.25]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
function blob(mb,c,r,colFn,seed,sq,res,mat){const la=res?res[0]:9,lo=res?res[1]:14;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];const n=1+0.32*(vnoise(d[0]*2.2+seed*7.3,d[1]*2.2+d[2]*1.7+seed)-0.5);return[c[0]+d[0]*r*n,c[1]+d[1]*r*n*(sq||1),c[2]+d[2]*r*n]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);const cl=[colFn(a),colFn(b),colFn(cc),colFn(d)];if(i===0)mb.tri(a,cc,b,[cl[0],cl[2],cl[1]],mat);else if(i===la-1)mb.tri(a,d,b,[cl[0],cl[3],cl[1]],mat);else mb.quad(a,d,cc,b,[cl[0],cl[3],cl[2],cl[1]],mat)}}
function segM(a,b,r){const y=V.sub(b,a);const L=V.len(y)||1e-6;const yn=V.sc(y,1/L);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);const mid=V.sc(V.add(a,b),0.5);
  return new Float32Array([x[0]*r,x[1]*r,x[2]*r,0,y[0],y[1],y[2],0,z[0]*r,z[1]*r,z[2]*r,0,mid[0],mid[1],mid[2],1])}
// ================= helpers =================
const lerp3=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
function tube(m,a,b,r0,r1,col,seg,mat){seg=seg||10;const y=V.sub(b,a);const yn=V.norm(y);const tmp=Math.abs(yn[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(yn,tmp)),z=V.cross(x,yn);
  const ring=(c,r)=>{const o=[];for(let i=0;i<seg;i++){const ang=i/seg*TAU2;o.push(V.add(c,V.add(V.sc(x,Math.cos(ang)*r),V.sc(z,Math.sin(ang)*r))))}return o};const A=ring(a,r0),B=ring(b,r1);for(let i=0;i<seg;i++){const j=(i+1)%seg;m.quad(A[i],A[j],B[j],B[i],col,mat)}}
const tp=(M,p)=>[M[0]*p[0]+M[4]*p[1]+M[8]*p[2]+M[12],M[1]*p[0]+M[5]*p[1]+M[9]*p[2]+M[13],M[2]*p[0]+M[6]*p[1]+M[10]*p[2]+M[14]];
const td=(M,p)=>[M[0]*p[0]+M[4]*p[1]+M[8]*p[2],M[1]*p[0]+M[5]*p[1]+M[9]*p[2],M[2]*p[0]+M[6]*p[1]+M[10]*p[2]];
function frameM(pos,Y,hint,s){// matrix with local Y along Y (unit), X from hint
  const y=V.norm(Y);let x=V.cross(hint||[0,0,1],y);if(V.len(x)<1e-4)x=V.cross([1,0,0],y);x=V.norm(x);const z=V.cross(x,y);const S=s==null?[1,1,1]:(typeof s==='number'?[s,s,s]:s);
  return new Float32Array([x[0]*S[0],x[1]*S[0],x[2]*S[0],0,y[0]*S[1],y[1]*S[1],y[2]*S[1],0,z[0]*S[2],z[1]*S[2],z[2]*S[2],0,pos[0],pos[1],pos[2],1])}
function ik2(S,T,L1,L2,pole){let d=V.sub(T,S);let dl=V.len(d);const mx=(L1+L2)*0.999;if(dl>mx){d=V.sc(d,mx/dl);dl=mx}if(dl<1e-4)dl=1e-4;const dn=V.sc(d,1/dl);
  const a=(L1*L1-L2*L2+dl*dl)/(2*dl);const h=Math.sqrt(Math.max(0,L1*L1-a*a));let p=V.sub(pole,V.sc(dn,V.dot(pole,dn)));if(V.len(p)<1e-5)p=[0,1,0];p=V.norm(p);
  return{E:V.add(V.add(S,V.sc(dn,a)),V.sc(p,h)),H:V.add(S,d)}}
let USL,UCL,CONE;// low-res unit sphere / cyl, unit cone (y -0.5..0.5)
{const s=new MB();s.ico([0,0,0],1,[1,1,1],0,1,[5,7]);USL=s.build(0.3);const c=new MB();c.prism([0,-0.5,0],1,1,1,7,[1,1,1]);UCL=c.build(0.7);const k=new MB();k.prism([0,-0.5,0],1,0,1,12,[1,1,1]);CONE=k.build(0.5)}
function bake(items,mb){for(const it of items){const raw=it.mesh.raw,M=it.M||ID4;const I=M4.inv(M);const useT=it.tint&&(it.tintAmt||0)>=1;
  for(let i=0;i<raw.length;i+=10){const p=tp(M,[raw[i],raw[i+1],raw[i+2]]);const nx=raw[i+3],ny=raw[i+4],nz=raw[i+5];
    const n=V.norm([I[0]*nx+I[1]*ny+I[2]*nz,I[4]*nx+I[5]*ny+I[6]*nz,I[8]*nx+I[9]*ny+I[10]*nz]);mb.v(p,n,useT?it.tint:[raw[i+6],raw[i+7],raw[i+8]],raw[i+9])}}}
// ================= colours =================
const SC={kim:hx('#b3262a'),kim2:hx('#8e1a20'),under:hx('#efe8d8'),hak:hx('#272a40'),hak2:hx('#1d2032'),obi:hx('#e9e1cc'),skin:hx('#e3ae8a'),hair:hx('#141016'),band:hx('#d8222a'),tabi:hx('#f2efe8'),zori:hx('#6a4a2a'),
  steel:hx('#d8dde6'),edge:hx('#ffffff'),tsuba:hx('#c9a24a'),tsuka:hx('#191820'),wrap:hx('#e8e0c8'),saya:hx('#121014'),dark:[0.06,0.05,0.05],
  nin:hx('#1b1c28'),nin2:hx('#2a2c3c'),ninBelt:hx('#c0242a'),ninEye:hx('#e9b693')};
// ================= katana =================
function katanaMesh(L,curve,col,straight){const m=new MB();const N=14;const W_=0.034,T_=0.009;
  for(let i=0;i<N;i++){const y0=i/N*L,y1=(i+1)/N*L;const cx=y=>straight?0:curve*Math.pow(y/L,2);const w0=W_*(1-0.25*i/N),w1=W_*(1-0.25*(i+1)/N);
    const tip=i===N-1;const sp0=[-w0*0.5+cx(y0),y0,0],sp1=[-w1*0.5+cx(y1),y1,0],ed0=[w0*0.5+cx(y0),y0,0],ed1=tip?[cx(y1)-w1*0.5,y1+0.02,0]:[w1*0.5+cx(y1),y1,0];
    const f0=[cx(y0)-w0*0.1,y0,T_],f1=[cx(y1)-w1*0.1,y1,T_],b0=[cx(y0)-w0*0.1,y0,-T_],b1=[cx(y1)-w1*0.1,y1,-T_];
    m.quad(sp0,f0,f1,sp1,col);m.quad(f0,ed0,ed1,f1,[SC.edge,SC.edge,SC.edge,SC.edge].map((c,j)=>j<2?c:c));m.quad(b0,sp0,sp1,b1,col);m.quad(ed0,b0,b1,ed1,SC.edge)}
  m.prism([0,-0.008,0],0.048,0.048,0.012,18,SC.tsuba);m.box([0,0.012,0],[0.04,0.02,0.022],SC.tsuba);
  m.prism([0,-0.27,0],0.017,0.019,0.262,10,SC.tsuka);for(let k=0;k<7;k++){const y=-0.25+k*0.034;m.box([0,y,0.017],[0.02,0.012,0.006],SC.wrap,0,0);m.box([0,y,-0.017],[0.02,0.012,0.006],SC.wrap)}
  m.prism([0,-0.285,0],0.02,0.02,0.018,10,SC.tsuba);return m.build(0.5)}
const KATANA=katanaMesh(0.76,0.035,SC.steel);const NINJATO=katanaMesh(0.55,0,hx('#b8bcc6'),true);
const SAYA=um(m=>{tube(m,[0,0,0],[0,-0.78,0],0.022,0.02,SC.saya,10);m.prism([0,-0.8,0],0.02,0.022,0.03,10,SC.tsuba);tube(m,[0,-0.02,0],[0,-0.06,0],0.025,0.025,SC.tsuba,10);m.box([0,-0.12,0.024],[0.018,0.03,0.02],SC.wrap)},0.6);
// ================= character rig =================
// o: root,yaw, pel{y,z,p,r}, tor{tw,b,s}, head{y,p,r}, hR,hL (torso-local hand targets), fR,fL (root-local ankle targets), sd (torso-local sword dir), sw:'hand'|'sheath'|'none'|'spin'
const POSE0={pel:{y:0.93,z:0,p:0,r:0},tor:{tw:0,b:0,s:0},head:{y:0,p:0,r:0},hR:[-0.24,0.0,0.12],hL:[0.24,0.0,0.1],fR:[-0.13,0.07,0.0],fL:[0.13,0.07,0.0],sd:[0,0,1],sh:[0,1,0],lid:0.15};
function charItems(o){const ninja=o.style==='ninja',lo=!!o.lo;const items=[];const US=lo?USL:USPH,UC=lo?UCL:UCYL;
  const put=(M,mesh,off,s,col,rot,ns)=>items.push({mesh,M:M4.mul(M,M4.trs(off,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint:col,tintAmt:1,noShadow:!!ns});
  const seg=(a,b,r,col,ns)=>items.push({mesh:UC,M:segM(a,b,r),tint:col,tintAmt:1,noShadow:!!ns});
  const cone=(a,b,r0,r1,col)=>{// approximate flared tube with 2 cyls
    const m=lerp3(a,b,0.5);items.push({mesh:UC,M:segM(a,m,(r0*0.75+r1*0.25)),tint:col,tintAmt:1});items.push({mesh:UC,M:segM(m,b,(r0*0.25+r1*0.75)),tint:col,tintAmt:1})};
  const sc=o.s||1;const Rt=M4.trs(o.root||[0,0,0],o.yaw||0,o.rootP||0,o.rootR||0,sc);const pel=o.pel,tor=o.tor,hd=o.head;
  const Pm=M4.mul(Rt,M4.trs([0,pel.y,pel.z||0],0,pel.p||0,pel.r||0,1));const Tm=M4.mul(Pm,M4.trs([0,0.05,0],tor.tw||0,tor.b||0,tor.s||0,1));const Hm=M4.mul(Tm,M4.trs([0,0.5,0.0],hd.y||0,hd.p||0,hd.r||0,1));
  const wind=o.wind==null?1:o.wind,tt=o.t||0;
  // ---- torso
  const cT=ninja?SC.nin:SC.kim,cH=ninja?SC.nin2:SC.hak;
  put(Tm,UC,[0,0.24,0],[0.172,0.44,0.122],cT);put(Tm,US,[0,0.44,0],[0.205,0.085,0.13],cT);
  if(!lo){if(!ninja){for(const sx of[-1,1])put(Tm,UB,[sx*0.058,0.33,0.118],[0.035,0.3,0.012],SC.under,[0,0,-sx*0.38],1);put(Tm,UB,[0,0.215,0.12],[0.04,0.05,0.01],cT,null,1)}
    else{put(Tm,UB,[0,0.3,0.118],[0.03,0.3,0.012],SC.nin2,[0,0,0.35],1)}}
  put(Tm,UC,[0,0.03,0],[0.182,0.09,0.13],ninja?SC.ninBelt:SC.obi);if(!lo&&!ninja)put(Tm,UB,[0.06,0.03,0.128],[0.07,0.05,0.02],SC.hak2,[0,0,0.2],1);
  // ---- pelvis / hakama
  if(!ninja){put(Pm,UC,[0,-0.1,0],[0.205,0.24,0.15],cH);put(Pm,UC,[0,-0.24,0],[0.235,0.08,0.17],cH)}else put(Pm,UC,[0,-0.08,0],[0.17,0.2,0.125],cH);
  // ---- head
  const cS=SC.skin;put(Hm,UC,[0,0.04,0],[0.05,0.1,0.05],ninja?SC.nin:cS);
  if(!ninja){put(Hm,US,[0,0.19,0.01],[0.112,0.132,0.118],cS);put(Hm,US,[0,0.235,-0.02],[0.12,0.108,0.122],SC.hair);if(!lo){put(Hm,US,[0,0.15,-0.06],[0.112,0.1,0.08],SC.hair,null,1);
      put(Hm,UC,[0,0.36,-0.06],[0.026,0.11,0.026],SC.hair,[0,-1.1,0],1);put(Hm,US,[0,0.335,-0.04],[0.035,0.03,0.035],SC.hair,null,1);
      put(Hm,UC,[0,0.25,0.0],[0.123,0.035,0.126],SC.band,null,1);
      for(const k of[-1,1]){const fl=Math.sin(tt*9+k*1.3)*0.25*wind;put(Hm,UB,[k*0.03,0.24,-0.13],[0.03,0.008,0.24],SC.band,[k*0.25+fl*0.5,-0.4+fl,0],1)}
      for(const sx of[-1,1])put(Hm,US,[sx*0.112,0.19,0.0],[0.02,0.034,0.022],cS,null,1);
      put(Hm,US,[0,0.175,0.125],[0.016,0.026,0.02],mix3(cS,[0.7,0.35,0.3],0.15),null,1);put(Hm,US,[0,0.085,0.085],[0.034,0.032,0.026],SC.hair,null,1);
      const lid=o.lid==null?0.15:o.lid;
      for(const sx of[-1,1]){if(o.xeyes){for(const d of[-1,1])put(Hm,UB,[sx*0.043,0.2,0.112],[0.04,0.009,0.006],SC.dark,[0,0,d*0.78],1)}
        else{put(Hm,US,[sx*0.043,0.2,0.108],[0.02,Math.max(0.002,0.016*(1-lid)),0.008],SC.dark,null,1);if(lid<0.6)put(Hm,US,[sx*0.039,0.205,0.115],[0.004,0.004,0.002],[1,1,1],null,1)}
        put(Hm,UB,[sx*0.045,0.228+(o.brow||0),0.112],[0.05,0.011,0.012],SC.hair,[0,0,sx*(o.browA==null?0.28:o.browA)],1)}
      if(o.mouth==='open')put(Hm,US,[0,0.128,0.112],[0.022,0.02,0.01],[0.35,0.08,0.08],null,1);else put(Hm,UB,[0,0.132,0.112],[0.036,0.006,0.006],[0.4,0.15,0.12],null,1)}}
  else{put(Hm,US,[0,0.19,0.005],[0.118,0.138,0.124],SC.nin);if(!lo){put(Hm,UB,[0,0.2,0.098],[0.15,0.045,0.04],SC.ninEye,null,1);
      for(const sx of[-1,1]){put(Hm,US,[sx*0.04,0.2,0.118],[0.02,0.013,0.008],[1,1,1],null,1);put(Hm,US,[sx*0.038,0.198,0.124],[0.008,0.009,0.004],SC.dark,null,1);put(Hm,UB,[sx*0.042,0.222,0.12],[0.045,0.01,0.01],SC.nin,[0,0,sx*0.35],1)}
      put(Hm,UC,[0,0.26,0],[0.121,0.025,0.127],SC.ninBelt,null,1);for(const k of[-1,1]){const fl=Math.sin(tt*11+k)*0.3*wind;put(Hm,UB,[k*0.025,0.25,-0.13],[0.025,0.008,0.2],SC.ninBelt,[k*0.3+fl*0.4,-0.5+fl,0],1)}}}
  // ---- legs (IK)
  const kneePole=td(Rt,[0,0.25,1]);const feet={};
  for(const sx of[-1,1]){const hip=tp(Pm,[sx*0.1,-0.04,0]);const fT=tp(Rt,sx<0?o.fR:o.fL);const r=ik2(hip,fT,0.44,0.44,V.add(kneePole,td(Rt,[sx*0.25,0,0])));
    if(ninja){seg(hip,r.E,0.085,cH);seg(r.E,r.H,0.065,cH);if(!lo)seg(lerp3(r.E,r.H,0.55),r.H,0.072,SC.nin2)}else{cone(hip,r.E,0.125,0.14,cH);cone(r.E,lerp3(r.E,r.H,0.92),0.145,0.19,cH);seg(lerp3(r.E,r.H,0.85),r.H,0.045,SC.tabi)}
    items.push({mesh:US,M:frameM(r.E,V.sub(r.E,hip),null,ninja?0.085:0.14),tint:cH,tintAmt:1});
    const fwd=td(Rt,[0,0,1]);const fm=M4.mul(M4.trs(r.H,(o.yaw||0)+(sx*0.12),0,0,1),M4.id());
    put(fm,US,[0,-0.025,0.07],[0.055,0.04,0.12],ninja?SC.nin2:SC.tabi);if(!lo&&!ninja)put(fm,UB,[0,-0.065,0.06],[0.1,0.018,0.26],SC.zori);feet[sx]=r.H}
  // ---- arms (IK)
  const hands={};const sdir=o.sd?V.norm(td(Tm,o.sd)):null;let gripR=tp(Tm,o.hR),gripL=tp(Tm,o.hL);
  if(o.sw==='hand'&&o.twoHand){gripL=V.sub(gripR,V.sc(sdir,0.13))}
  for(const sx of[-1,1]){const shp=tp(Tm,[sx*0.2,0.43,0]);const T=sx<0?gripR:gripL;const pole=td(Tm,[sx*0.7,-0.5,-0.6]);const r=ik2(shp,T,0.29,0.27,pole);
    put(M4.mul(Tm,M4.id()),US,[sx*0.2,0.43,0],[0.075,0.075,0.075],cT);
    if(ninja)seg(shp,r.E,0.06,cT);else{cone(shp,r.E,0.07,0.12,cT)}
    seg(r.E,r.H,ninja?0.048:0.045,ninja?SC.nin2:cS);items.push({mesh:US,M:frameM(r.H,V.sub(r.H,r.E),null,ninja?0.052:0.05),tint:ninja?SC.nin:cS,tintAmt:1});hands[sx]=r.H}
  // ---- sword
  const swM=ninja?NINJATO:KATANA,swL=ninja?0.55:0.76;let tip=null,base=null;
  const sayaA=tp(Pm,[0.2,0.0,0.13]),sayaDir=V.norm(td(Pm,[0.06,0.33,1]));
  if(!ninja&&!lo){items.push({mesh:SAYA,M:frameM(sayaA,sayaDir,td(Pm,[1,0,0]))})}
  if(o.sw==='hand'||o.sw==='spin'){const H=hands[-1];let D=sdir;if(o.sw==='spin'){const a=o.spinA||0;D=V.norm(V.add(V.sc(td(Tm,[0,1,0]),Math.cos(a)),V.sc(td(Tm,[1,0,0]),Math.sin(a))))}
    const hint=o.sh?td(Tm,o.sh):[0,1,0];items.push({mesh:swM,M:frameM(V.add(H,V.sc(D,0.06)),D,hint)});base=V.add(H,V.sc(D,0.07));tip=V.add(H,V.sc(D,0.06+swL))}
  else if(o.sw==='sheath'&&!ninja){items.push({mesh:swM,M:frameM(V.add(sayaA,V.sc(sayaDir,0.0)),V.sc(sayaDir,-1),td(Pm,[1,0,0]))})}
  const head=tp(Hm,[0,0.2,0.05]);
  return{items,tip,base,head,hands,Hm,Tm,Pm,Rt}}
// ---- pose blending ----
function blendPose(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key]===undefined?va:b[key];
  if(Array.isArray(va))r[key]=va.map((x,i)=>x+((vb[i]===undefined?x:vb[i])-x)*k);else if(va&&typeof va==='object'){r[key]={};for(const kk in va)r[key][kk]=va[kk]+(((vb[kk]===undefined?va[kk]:vb[kk]))-va[kk])*k}else if(typeof va==='number')r[key]=va+(vb-va)*k;else r[key]=k<0.5?va:vb}
  for(const key in b)if(r[key]===undefined)r[key]=b[key];return r}
function P_(o){const r=JSON.parse(JSON.stringify(POSE0));for(const k in o){if(o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k]))r[k]=Object.assign({},r[k]||{},o[k]);else r[k]=o[k]}return r}
// ================= world =================
const smst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
function hgt(x,z){const r=Math.hypot(x,z*0.8);let h=smst(45,420,r)*(0.35+fbm(x*0.005+3,z*0.005+1,4))*110*(1-smst(40,120,z));h+=0.25*(fbm(x*0.08,z*0.08,2)-0.5)*smst(8,30,r);h-=smst(95,140,z)*1.3;return h}
function gcol(x,z,h,ny){const n=fbm(x*0.03+7,z*0.03,3),m=vnoise(x*0.25,z*0.25);let c=mix3(hx('#5d8f3a'),hx('#86a845'),n);c=mix3(c,hx('#4a7a30'),m*0.35);
  const sand=smst(100,124,z);c=mix3(c,hx('#d9c08a'),sand);if(ny<0.85)c=mix3(c,hx('#6a6a50'),(0.85-ny)*2);if(h>60)c=mix3(c,hx('#7a8a5a'),smst(60,110,h));
  const path=Math.abs(x+0.06*z*0)<1.2&&z<-1&&z>-40?1:0;return c}
let WORLD,SEA,MOUNT;{const m=new MB();
  terrain(m,-70,-70,70,140,70,hgt,gcol);
  terrain(m,-1600,-1600,1600,160,120,(x,z)=>hgt(x,z)-(Math.abs(x)<70&&z>-70&&z<140?0.6:0),gcol);
  // cherry trees
  const r=rngG(21);const TP=[[-24,5],[25,9],[-21,-5],[19,-9],[-9,-15],[11,-18],[-34,24],[36,28],[-36,-14],[38,4],[-30,44],[34,50],[-48,40],[48,-24],[-55,10],[6,-30],[-30,-30]];
  for(let i=0;i<80;i++){const a=r()*TAU2,d=60+r()*260;const x=Math.cos(a)*d,z=Math.sin(a)*d*0.8-40;if(z>70||(Math.abs(x)<60&&z>-10))continue;TP.push([x,z])}
  let ti=0;for(const[x,z]of TP){ti++;const s=0.8+r()*0.6;const y0=hgt(x,z)-0.1;const tr=hx('#4a3226');const top=[x+(r()-0.5)*1.5*s,y0+3.4*s,z+(r()-0.5)*1.5*s];tube(m,[x,y0,z],top,0.28*s,0.16*s,tr,7);
    for(let b=0;b<4;b++){const a=b/4*TAU2+r();const e=V.add(top,[Math.cos(a)*2.4*s,1.2*s+r()*1.2*s,Math.sin(a)*2.4*s]);tube(m,top,e,0.12*s,0.05*s,tr,5);
      const pk=[hx('#f6b6c8'),hx('#f19ab6'),hx('#fbd0dc')][b%3];blob(m,e,1.6*s,p=>mix3(pk,[1,0.92,0.95],clamp((p[1]-e[1])/(2*s)+0.4,0,1)*0.6),ti*7+b+x,0.75,[7,10])}
    blob(m,V.add(top,[0,1.6*s,0]),2.0*s,p=>mix3(hx('#f3a8c0'),hx('#ffe0ea'),clamp((p[1]-top[1])/(4*s),0,1)),x+z,0.7,[8,12])}
  // torii gate
  {const red=hx('#c8281e'),blk=hx('#1a1414');const gx=-12,gz=24,ry=0.35;const P=(lx,y,lz)=>{const c=Math.cos(ry),s=Math.sin(ry);return[gx+lx*c+lz*s,y,gz-lx*s+lz*c]};
    for(const sx of[-1,1]){tube(m,P(sx*2.6,0,0),P(sx*2.5,5.6,0),0.26,0.22,red,10);tube(m,P(sx*2.6,0,0),P(sx*2.6,0.5,0),0.32,0.32,blk,10)}
    m.box(P(0,4.7,0),[6.6,0.32,0.36],red,0,ry);m.box(P(0,5.85,0),[7.8,0.38,0.55],red,0,ry);m.box(P(0,6.15,0),[8.4,0.25,0.65],blk,0,ry);m.box(P(0,5.25,0),[0.35,0.8,0.25],red,0,ry)}
  // stone lanterns
  for(const[x,z]of[[-5,5],[5.5,7]]){const st=hx('#8c8a84'),st2=hx('#76746e');m.prism([x,0,z],0.45,0.45,0.25,6,st2);m.prism([x,0.25,z],0.14,0.14,0.9,6,st);m.prism([x,1.15,z],0.4,0.4,0.15,6,st2);m.box([x,1.5,z],[0.5,0.5,0.5],hx('#ffd890'),MAT.emis);m.prism([x,1.75,z],0.65,0.08,0.45,6,st2)}
  // grass tufts near hero
  const g=rngG(5);for(let i=0;i<3200;i++){const a=g()*TAU2,d=1.2+Math.pow(g(),0.7)*34;const x=Math.cos(a)*d,z=Math.sin(a)*d;const y=hgt(x,z);const h=0.18+g()*0.35;const yaw=g()*TAU2,w=0.025+g()*0.02;const lean=[(g()-0.5)*0.2,0,(g()-0.5)*0.2];
    const cb=mix3(hx('#4a7a2a'),hx('#6a9a38'),g()),ct=mix3(hx('#a8c860'),hx('#d0d070'),g());const b0=[x+Math.cos(yaw)*w,y,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,y,z-Math.sin(yaw)*w];m.tri(b0,b1,V.add([x,y+h,z],lean),[cb,cb,ct])}
  // rocks
  for(let i=0;i<40;i++){const a=g()*TAU2,d=6+g()*60;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.abs(x)<4&&z>0)continue;blob(m,[x,hgt(x,z),z],0.2+g()*0.6,p=>mix3(hx('#7a776e'),hx('#a09a8c'),vnoise(p[0]*4,p[2]*4)),i,0.6,[5,8])}
  WORLD=m.build(0.5)}
{const m=new MB();m.quad([-9000,-0.55,110],[-9000,-0.55,9000],[9000,-0.55,9000],[9000,-0.55,110],hx('#2a6c8a'),MAT.water);SEA=m.build()}
{const m=new MB();const MT=[[-2400,2600,1300,1500,1],[2900,3400,1100,1700,0],[-4200,1500,800,1100,0],[1200,-3200,1400,1400,1],[-2600,-2400,900,1200,0],[4200,-500,900,1100,0]];
  for(const[cx,cz,hh,rr,snow]of MT){const N=40,RR=10;for(let i=0;i<RR;i++)for(let j=0;j<N;j++){const P=(ii,jj)=>{const a=jj/N*TAU2,f=ii/RR;const rad=rr*(1-f)*(1+0.12*(vnoise(Math.cos(a)*3+cx,Math.sin(a)*3+f*2)-0.5))+rr*0.03;const y=hh*Math.pow(f,0.85)*(f>0.95?0.98:1);return[cx+Math.cos(a)*rad,y-40,cz+Math.sin(a)*rad]};
      const cf=(ii,jj)=>{const f=ii/RR;const sn=snow&&f>0.62+0.08*Math.sin(jj*1.7)?1:0;return sn?hx('#f2f0f4'):mix3(hx('#5a6a74'),hx('#7a8090'),f)};m.quad(P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),[cf(i,j),cf(i+1,j),cf(i+1,j+1),cf(i,j+1)])}}
  MOUNT=m.build(0.6)}
const PETAL=um(m=>{m.quad([-1,0,-0.6],[1,0,-0.6],[1,0.15,0.6],[-1,0.15,0.6],hx('#ffc2d4'))});
function petals(items,t,ctr,n){ctr=ctr||[0,0,0];n=n||70;for(let i=0;i<n;i++){const sp=2+hsh(i,1)*2.5;const ph=hsh(i,2)*40;const x=ctr[0]-14+((hsh(i,3)*28+(t+ph)*sp)%28),z=ctr[2]-6+hsh(i,4)*20+Math.sin(t*0.7+i)*1.2,y=ctr[1]+0.2+((hsh(i,5)*5-(t+ph)*0.5)%5+5)%5;
  items.push({mesh:PETAL,M:M4.trs([x,y,z],t*2+i,t*3+i*0.7,t*1.7,0.035),tint:null,tintAmt:0,noShadow:true})}}
// ================= opponents =================
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.55,0.48],[0.8,0.74,0.66],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1])}});
const PUFF=um(m=>blob(m,[0,0,0],1,p=>mix3([0.78,0.78,0.8],[0.97,0.97,0.98],clamp(p[1]*0.5+0.5,0,1)),3,0.9,[7,10]),0.5);
// ---- meteor ----
const metCol=p=>{const n=vnoise(p[0]*3+1,p[2]*3+p[1]*2);const cr=vnoise(p[0]*9,p[1]*9+p[2]*3);return mix3(hx('#3a2e2a'),hx('#6a5a50'),n)};
const METEOR=um(m=>blob(m,[0,0,0],1,metCol,5,0.92,[16,24]),0.3);
const METHALF=um(m=>{const la=16,lo=24;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;const d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];const n=1+0.32*(vnoise(d[0]*2.2+5*7.3,d[1]*2.2+d[2]*1.7+5)-0.5);return[Math.max(0,d[0]*n),d[1]*n*0.92,d[2]*n]};
  const C_=p=>p[0]<0.04?mix3(hx('#ffdd66'),hx('#ff6a1a'),Math.hypot(p[1],p[2])):metCol(p);
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const emis=a[0]<0.02&&b[0]<0.02&&c[0]<0.02&&d[0]<0.02;m.quad(a,d,c,b,[C_(a),C_(d),C_(c),C_(b)],emis?MAT.emis:0)}},0.2);
// ---- tsunami ----
const WPROF=[[1.5,0],[1.0,0.2],[0.6,0.5],[0.28,0.82],[0.06,0.98],[-0.12,1.0],[-0.27,0.92],[-0.36,0.78],[-0.34,0.64],[-0.24,0.57],[-0.13,0.6],[-0.08,0.48],[-0.12,0.28],[-0.22,0.1],[-0.3,0]];
function waveMesh(x0,x1,taperSide){const m=new MB();const NX=90,NP=WPROF.length;const H0=72;
  const colP=j=>{if(j>=7&&j<=10)return hx('#e8f4f4');if(j>=5)return hx('#4fb8b8');if(j<=1)return hx('#165a6e');if(j>=13)return hx('#d8eeee');return mix3(hx('#1a6a80'),hx('#2c9aa8'),j/5)};
  const pt=(i,j)=>{const x=x0+(x1-x0)*i/NX;let s=1+0.1*(vnoise(x*0.02,3)-0.5);if(taperSide){const e=taperSide>0?x-x0:x1-x;s*=smst(0,6,e)}const[pz,py]=WPROF[j];return[x,py*H0*s,pz*H0*0.9*Math.max(0.35,s)]};
  for(let i=0;i<NX;i++)for(let j=0;j<NP-1;j++){const a=pt(i,j),b=pt(i+1,j),c=pt(i+1,j+1),d=pt(i,j+1);m.quad(a,b,c,d,[colP(j),colP(j),colP(j+1),colP(j+1)])}
  if(taperSide){const i=taperSide>0?0:NX;for(let j=0;j<NP-2;j++){const a=pt(i,j),b=pt(i,j+1),c=pt(i,NP-1-0);m.tri(a,b,[a[0],0,(a[2]+c[2])/2],hx('#bfe6e6'))}}
  return m.build(0.5)}
const WAVE=waveMesh(-900,900,0),WAVEL=waveMesh(-900,0,-1),WAVER=waveMesh(0,900,1);
// ---- dragon head (local: +z forward, y up) ----
const DC={body:hx('#c42a22'),body2:hx('#8a1a16'),belly:hx('#f0c050'),gold:hx('#e8b840'),mane:hx('#f4f0e8'),horn:hx('#efe2c0'),eye:hx('#ffe040'),dark:[0.05,0.03,0.03],teeth:[0.98,0.97,0.92],tongue:hx('#e05070')};
const DHEAD=um(m=>{blob(m,[0,0,0],1,()=>DC.body,2,0.8,[10,14]);
  m.box([0,0.05,1.1],[1.1,0.55,1.5],DC.body);m.box([0,0.36,0.75],[0.9,0.25,0.9],DC.body2);m.ico([0,0.1,1.9],0.42,DC.body,0,0.7,[6,9]);
  for(const sx of[-1,1]){m.ico([sx*0.24,0.32,1.95],0.09,DC.dark,0,1,[4,6]);m.ico([sx*0.42,0.42,0.55],0.2,DC.eye,0,1,[6,8]);m.ico([sx*0.47,0.44,0.62],0.09,DC.dark,0,1.3,[4,6]);m.box([sx*0.42,0.63,0.55],[0.42,0.1,0.3],DC.body2,0,sx*0.3);
    tube(m,[sx*0.3,0.5,0.0],[sx*0.6,1.3,-0.9],0.12,0.06,DC.horn,7);tube(m,[sx*0.6,1.3,-0.9],[sx*0.7,1.7,-1.5],0.06,0.02,DC.horn,6);tube(m,[sx*0.48,1.0,-0.6],[sx*0.95,1.35,-0.55],0.05,0.02,DC.horn,5);
    for(let k=0;k<5;k++)m.prism([sx*(0.3+k*0.04),-0.2,1.2-k*0.3],0.05,0,-0.18,5,DC.teeth);
    for(let k=0;k<7;k++){const a=k/7*Math.PI;blob(m,[sx*0.75,0.1+Math.sin(a)*0.5,-0.2-Math.cos(a)*0.5],0.32,()=>DC.mane,k+sx,1.2,[5,7])}}
  for(let k=0;k<6;k++)blob(m,[0,0.6-k*0.1,-0.5-k*0.25],0.38,()=>DC.mane,k*3,1,[5,7])},0.5);
const DJAW=um(m=>{m.box([0,-0.1,0.9],[0.95,0.22,1.4],DC.body);m.box([0,0.02,0.9],[0.75,0.05,1.2],DC.tongue);for(const sx of[-1,1])for(let k=0;k<5;k++)m.prism([sx*0.36,0.01,1.4-k*0.25],0.045,0,0.16,5,DC.teeth);
  blob(m,[0,-0.3,0.6],0.3,()=>DC.mane,9,1.2,[5,7])},0.5);
const DCLAW=um(m=>{tube(m,[0,0,0],[0,-1,0.3],0.22,0.16,DC.body,7);m.ico([0,-1.05,0.35],0.2,DC.belly,0,1,[5,7]);for(let k=-1;k<=1;k++)tube(m,[k*0.12,-1.1,0.4],[k*0.2,-1.3,0.75],0.05,0.01,DC.horn,5)},0.5);
// ---- mosquito (local +z forward) ----
const MOSQ=um(m=>{blob(m,[0,0,-0.6],0.3,p=>Math.sin(p[2]*30)>0.3?hx('#e8e8e8'):hx('#2a2a30'),1,0.7,[8,10]);m.ico([0,0.05,0],0.22,hx('#3a3a42'),0,1,[7,9]);m.ico([0,0.08,0.3],0.14,hx('#2a2a30'),0,1,[6,8]);
  for(const sx of[-1,1])m.ico([sx*0.08,0.12,0.38],0.07,hx('#c02020'),0,1,[5,6]);tube(m,[0,0.04,0.42],[0,-0.1,1.0],0.025,0.008,hx('#2a2a30'),5);
  for(const sx of[-1,1])for(let k=0;k<3;k++){const h=[sx*0.12,0,0.1-k*0.12],kn=[sx*0.55,0.25,0.25-k*0.35],f=[sx*0.8,-0.6,0.3-k*0.5];tube(m,h,kn,0.02,0.015,hx('#2a2a30'),4);tube(m,kn,f,0.015,0.008,hx('#2a2a30'),4)}},0.4);
const WING=um(m=>{const N=10;for(let i=0;i<N;i++){const a=i/N*Math.PI,b=(i+1)/N*Math.PI;m.tri([0,0,0],[Math.sin(a)*0.25,0,-Math.cos(a)*0.25+0.1-a*0.2],[Math.sin(b)*0.25,0,-Math.cos(b)*0.25+0.1-b*0.2],[0.85,0.9,0.95])}});
// ---- ninja crowd (baked) ----
function ninjaPose(ph,kind,seed){const r=rngG(seed);const p=P_({});p.style='ninja';
  if(kind==='run'){const s=Math.sin(ph),c=Math.cos(ph);p.pel={y:0.86+0.04*Math.abs(c),z:0,p:0.35,r:0};p.tor={tw:0,b:0.15,s:0};p.fR=[-0.12,0.1+Math.max(0,s)*0.25,0.45*s];p.fL=[0.12,0.1+Math.max(0,-s)*0.25,-0.45*s];
    p.hR=[-0.32,-0.05-0.05*s,0.1-0.2*s];p.hL=[0.3,0.05,0.1+0.25*s];p.sd=[-0.15,0.2,-1];p.sw='hand';p.head={y:0,p:-0.35,r:0}}
  else{p.pel={y:0.14,z:0,p:0,r:0};p.rootP=-Math.PI/2;p.fR=[-0.15,0.07,0.1];p.fL=[0.18,0.07,0];p.hR=[-0.5,0.3,0.1];p.hL=[0.5,0.25,0.1];p.sw='none'}
  return p}
function buildCrowd(){const out={run:[new MB(),new MB()],down:new MB()};const r=rngG(31);
  for(let j=0;j<10;j++)for(let i=0;i<25;i++){const x=(i-12)*4.6+(r()-0.5)*2.6,z=j*3.0+(r()-0.5)*1.6;const yaw=Math.PI+(r()-0.5)*0.25;const sd=i*31+j;
    for(let f=0;f<2;f++){const p=ninjaPose(f*Math.PI+(i+j)%2*Math.PI*0.5,'run',sd);p.root=[x,0,z];p.yaw=yaw;p.lo=true;p.t=0;p.wind=0;bake(charItems(p).items,out.run[f])}
    const p=ninjaPose(0,'down',sd);p.root=[x,0.0,z+0.8];p.yaw=yaw+(r()-0.5)*1.2;p.lo=true;p.t=0;p.wind=0;bake(charItems(p).items,out.down)}
  return{run:[out.run[0].build(),out.run[1].build()],down:out.down.build()}}
const CROWD=buildCrowd();
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
function samAt(t){let o,extra={};const rn=roundAt(t);
  if(t<EV.spin){o=kf(t,[[0,PS.iai],[EV.leap,PS.iai]])}
  else if(t<EV.sheath0){if(t<8.45){o=PS.spin;o=Object.assign({},o);o.yaw=-TAU2*easeOut((t-EV.spin)/0.3)}else o=kf(t,[[8.45,PS.follow],[EV.sheath0,PS.follow]])}
  else if(t<EV.click){o=kf(t,[[EV.sheath0,PS.follow],[9.0,PS.sheathA],[EV.click,PS.sheathA]]);o=Object.assign({},o);o.sheathK=t<9.0?-1:easeIn((t-9.0)/(EV.click-9.0))}
  else if(t<R[1]){o=kf(t,[[EV.click,PS.stand],[EV.kneel,PS.stand],[EV.kneel+0.7,PS.seiza],[EV.tea,PS.seiza],[EV.tea+0.6,PS.tea]]);if(t>=EV.tea-0.2)extra.cup=1}
  // ---- meteor
  else if(t<R[2]){o=kf(t,[[R[1],PS.tea],[R[1]+0.9,PS.tea],[R[1]+1.4,PS.lookup],[EV.metUp,PS.lookup],[EV.jump-0.5,PS.crouch],[EV.jump,PS.crouch],[EV.jump+0.25,PS.jump],[EV.cut-0.08,PS.jump],[EV.cut+0.05,PS.jumpcut],[EV.land-0.05,PS.jumpcut],[EV.land+0.08,PS.land],[EV.land+0.7,PS.land],[EV.land+0.95,PS.sheathA],[EV.metClick,PS.sheathA],[EV.metClick+0.01,PS.stand],[R[2],PS.stand]]);o=Object.assign({},o);
    if(t<R[1]+1.2)extra.cup=1;if(t>=EV.land+0.95&&t<EV.metClick)o.sheathK=easeIn((t-EV.land-0.95)/(EV.metClick-EV.land-0.95));
    if(t>=EV.jump&&t<EV.land){const k=(t-EV.jump)/(EV.land-EV.jump);o.root=[0,Math.max(0,12.5*k*(1-k)*4*0.55),0.6*k]}else if(t>=EV.land)o.root=[0,0,0.6];if(t>=EV.metClick)o.lid=0.6}
  // ---- tsunami
  else if(t<R[3]){o=kf(t,[[R[2],PS.stand],[EV.raise,PS.stand],[EV.raise+0.25,PS.chudan],[EV.raise+0.9,PS.jodan],[EV.wcut-0.06,PS.jodan],[EV.wcut+0.08,PS.cutlow],[EV.wClick-1.4,PS.cutlow],[EV.wClick-1.0,PS.sheathA],[EV.wClick,PS.sheathA],[EV.wClick+0.01,PS.stand],[R[3],PS.stand]]);o=Object.assign({},o);
    if(t>=EV.wClick-1.0&&t<EV.wClick)o.sheathK=easeIn((t-EV.wClick+1.0)/1.0);if(t<EV.raise){o.head={y:0,p:-0.25,r:0};o.lid=0.3}if(t>=EV.wClick)o.lid=0.7}
  // ---- dragon
  else if(t<R[4]){o=kf(t,[[R[3],PS.lookup],[EV.roar,PS.lookup],[EV.roar+0.35,PS.chudan],[EV.fire0,PS.chudan],[EV.fire0+0.15,PS.block],[EV.fire1,PS.block],[EV.djump,PS.jump],[EV.dcut-0.06,PS.jump],[EV.dcut+0.06,PS.jumpcut],[EV.dland,PS.land],[EV.dland+0.25,PS.land],[EV.bow-0.2,PS.sheathA],[EV.bow+0.3,PS.sheathA],[EV.bow+0.31,PS.stand],[EV.pat,PS.stand],[EV.pat+0.4,PS.pat],[R[4],PS.pat]]);o=Object.assign({},o);
    if(t>=EV.fire0&&t<EV.fire1+0.1)o.spinA=(t-EV.fire0)*38;if(t>=EV.bow-0.2&&t<EV.bow+0.3)o.sheathK=easeIn((t-EV.bow+0.2)/0.5);
    if(t>=EV.djump&&t<EV.dland){const k=(t-EV.djump)/(EV.dland-EV.djump);o.root=[0,9.5*4*k*(1-k)*0.9,2.4*Math.sin(k*Math.PI)]}
    if(t>=EV.pat+0.4){const w=Math.sin((t-EV.pat)*7);o.hL=[0.28,0.3+w*0.05,0.55];o.mouth='flat'}}
  // ---- mosquito
  else{const L=[[R[4],PS.tea],[EV.swat0-0.35,PS.tea],[EV.swat0-0.1,PS.stand],[EV.swat0,PS.s1a],[EV.swat0+0.25,PS.s1b],[EV.swat0+0.55,PS.s1b],[EV.swat0+0.75,PS.s2b],[EV.swat0+1.05,PS.s2b],[EV.swat0+1.3,PS.s3b],[EV.swat1,PS.s3b],[EV.swat1+0.3,P_(Object.assign({},PS.stand,{sw:'sheath',lid:0.1}))],[EV.slap-0.6,P_(Object.assign({},PS.stand,{lid:0.0,browA:0.5}))],[EV.slap-0.25,PS.slapUp],[EV.slap,PS.slap],[R[5]+9,PS.slap]];
    o=kf(t,L);o=Object.assign({},o);if(t<EV.swat0-0.1)extra.cup=1;if(t>=EV.swat1+0.15&&t<EV.slap)o.sw='sheath';
    if(t>=EV.land2&&t<EV.slap){o.lid=0;o.browA=0.6;o.brow=0.01;o.head={y:0,p:-0.15,r:0}}
    if(t>=EV.slap){const k=clamp((t-EV.slap-0.1)/0.5,0,1);o.rootP=-easeIn(k)*Math.PI/2*0.98;o.root=[0,0.05*easeIn(k),0];o.xeyes=t>EV.slap+0.15;o.mouth='open';o.sw='sheath';if(k>=1){const b=Math.max(0,t-EV.slap-0.6);o.rootP+=Math.abs(Math.sin(b*14))*0.06*Math.exp(-b*6)}}}
  o=Object.assign({},o);o.t=t;if(t>=EV.loop)o.t=t;o.wind=1;return{o,extra}}
function samItems(t){const{o,extra}=samAt(t);if(o.sheathK!=null&&o.sheathK>=0){/* place hand along saya */const pre=charItems(Object.assign({},o,{sw:'none'}));
    const sayaA=tp(pre.Pm,[0.2,0.0,0.13]),sd=V.norm(td(pre.Pm,[0.06,0.33,1]));const k=o.sheathK;const hw=V.add(sayaA,V.sc(sd,0.1+0.34*(1-k)));const I=M4.inv(pre.Tm);o.hR=tp(I,hw);o.sd=td(I,V.sc(sd,-1));o.sw='hand';o.twoHand=false}
  const r=charItems(o);if(extra.cup){const H=r.hands[-1];const M=M4.trs(V.add(H,[0.0,0.03,0.04]),0,0,0,1);r.items.push({mesh:CUP,M});}
  r.o=o;return r}
const CUP=um(m=>{m.prism([0,-0.04,0],0.032,0.042,0.075,14,hx('#3a5a4a'));m.prism([0,0.03,0],0.036,0.036,0.002,14,hx('#9ac860'))},0.5);
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
// ================= scene assembly =================
const MET_S0=[30,230,440],MET_C=[0,14,16],MET_R=15,MLAND=[[-16,0,-65],[16,0,-65]];
function metPos(t){const k=clamp((t-R[1])/(EV.cut-R[1]),0,1);return lerp3(MET_S0,MET_C,Math.pow(k,1.7))}
function halfPos(t,sx){const k=clamp((t-EV.cut)/(EV.boom-EV.cut),0,1);const kk=Math.pow(k,1.25);const p=lerp3(MET_C,MLAND[sx>0?1:0],kk);p[0]+=sx*6*Math.sin(Math.min(1,k*3)*Math.PI/2);p[1]+=8*Math.sin(k*Math.PI)*(1-k);return p}
function waveZ(t){if(t<31)return lerp(1500,420,(t-R[2])/(31-R[2]));if(t<EV.wcut)return lerp(420,42,easeOut((t-31)/(EV.wcut-31)));return 42-30*(t-EV.wcut)}
let LASTVP=null,LASTSAM=null,LASTDRA=null,LASTMOSQ=null;
function fgItems(t){const rn=roundAt(t);const items=[{mesh:WORLD},{mesh:SEA},{mesh:MOUNT}];
  const S=samItems(t);LASTSAM=S;items.push(...S.items);
  if(rn<=0||rn>=4)petals(items,t,[0,0,0],80);else if(rn===1&&t<EV.metUp)petals(items,t,[0,0,0],40);else if(rn===3&&t>=EV.bow)petals(items,t,[0,0,0],50);
  // ---- stage 1
  if(rn===0){if(t<EV.click){const z=crowdZ(t);const fr=t<EV.spin?Math.floor(t*6)%2:0;for(let n=0;n<4;n++)items.push({mesh:CROWD.run[(fr+n)%2],M:M4.trs([0,0,z+n*31],0,0,0,1),noShadow:true})}
      else{const z=crowdZ(t);for(let n=0;n<4;n++)items.push({mesh:CROWD.down,M:M4.trs([0,0,z+n*31],0,0,0,1),noShadow:true})}
    if(t>=5.4){for(const L of LEAP){const p=ninjaLeapPose(L,t);items.push(...charItems(p).items)}}
    {const k=t-EV.spin-0.12;if(k>=0&&k<0.9){const r=1+75*easeOut(k/0.9);items.push({mesh:DUSTRING,M:M4.trs([0,0.9,0],0,0,0,[r,0.25,r]),tint:[1,1,1],tintAmt:0.8,alpha:0.7*(1-k/0.9),add:1,noShadow:true})}}
    {const k=t-EV.click;if(k>=0&&k<1.0){for(const L of LEAP){const p=[Math.sin(L.a)*L.r1,L.h,Math.cos(L.a)*L.r1];for(let j=0;j<3;j++)items.push({mesh:PUFF,M:M4.trs(V.add(p,[Math.sin(j*2.1)*0.3,0.6+j*0.15,Math.cos(j*2.1)*0.3]),j,0,0,0.3+k*0.6),tint:[1,1,1],tintAmt:0.3,alpha:0.85*(1-k),noShadow:true})}
      const r=6+60*easeOut(k/1.0);items.push({mesh:DUSTRING,M:M4.trs([0,0,25],0,0,0,[r*1.5,1.2+k*2,r]),alpha:0.6*(1-k),noShadow:true})}}}
  if(rn===0&&t>=EV.tea-0.2||rn===1&&t<R[1]+1.2){/* tea already handled by cup */}
  // ---- stage 2 meteor
  if(rn===1){if(t<EV.cut){const p=metPos(t);items.push({mesh:METEOR,M:M4.trs(p,t*0.7,t*0.5,0,MET_R),tint:[1,0.4,0.1],tintAmt:clamp((t-EV.metUp)/2,0,0.25)});
      items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,MET_R*1.35),tint:[1,0.55,0.15],tintAmt:1,alpha:0.35,add:1,noShadow:true});
      for(let i=1;i<16;i++){const q=metPos(t-i*0.07);const d=V.sub(MET_S0,MET_C);const qq=V.add(q,V.sc(V.norm(d),i*2.2));items.push({mesh:UEMIS,M:M4.trs(qq,0,0,0,MET_R*(1.15-i*0.055)),tint:mix3([1,0.85,0.4],[0.6,0.15,0.05],i/16),tintAmt:1,alpha:0.4*(1-i/16),add:1,noShadow:true})}}
    else{for(const sx of[-1,1]){const p=halfPos(t,sx);const sp=(t-EV.cut)*1.2;const M=M4.trs(p,sx>0?0:Math.PI,sp*sx*0.3,sp*0.4*sx,MET_R);if(t<EV.boom){items.push({mesh:METHALF,M});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,MET_R*1.2),tint:[1,0.6,0.2],tintAmt:1,alpha:0.25,add:1,noShadow:true});
        for(let i=1;i<10;i++){const q=halfPos(t-i*0.05,sx);items.push({mesh:UEMIS,M:M4.trs(q,0,0,0,MET_R*(0.9-i*0.07)),tint:mix3([1,0.8,0.4],[0.5,0.15,0.05],i/10),tintAmt:1,alpha:0.3*(1-i/10),add:1,noShadow:true})}}
        fireball(items,MLAND[sx>0?1:0],t-EV.boom,20)}}}
  // ---- stage 3 tsunami
  if(rn===2){const z=waveZ(t);const sy=t<EV.wcut?lerp(0.45,1,clamp((t-R[2])/4.5,0,1)):Math.max(0.05,1-smst(-60,-220,z));
    if(t<EV.wcut)items.push({mesh:WAVE,M:M4.trs([0,-0.6,z],0,0,0,[1,sy,1]),noShadow:true});
    else{const g=3.5*easeOut((t-EV.wcut)/0.8);items.push({mesh:WAVEL,M:M4.trs([-g,-0.6,z],0,0,0,[1,sy,1]),noShadow:true});items.push({mesh:WAVER,M:M4.trs([g,-0.6,z],0,0,0,[1,sy,1]),noShadow:true});
      for(let i=0;i<22;i++){const sx=i%2?1:-1;const k=((t-EV.wcut)*1.3+hsh(i,1))%1;const q=[sx*(g+3+hsh(i,2)*8),5+k*40*hsh(i,3)+10,z+hsh(i,4)*20-5];items.push({mesh:PUFF,M:M4.trs(q,i,0,0,3+k*8),tint:[0.9,0.96,0.98],tintAmt:0.6,alpha:0.5*(1-k),noShadow:true})}}
    for(let i=0;i<30;i++){const x=-300+i*20+hsh(i,7)*10;const k=((t*0.8+hsh(i,8))%1);items.push({mesh:PUFF,M:M4.trs([x,72*sy*0.95+k*8,z-10+hsh(i,9)*8],i,0,0,4+k*5),tint:[0.92,0.97,0.98],tintAmt:0.6,alpha:0.55*(1-k),noShadow:true})}}
  // ---- stage 4 dragon
  if(rn===3){LASTDRA=dragonItems(items,t);
    if(t>=EV.fire0&&t<EV.fire1+1.0){const M0=LASTDRA.mouth;const tgt=[0,1.4,0.9];for(let i=0;i<110;i++){const te=EV.fire0+i*0.022;if(te>t||te>EV.fire1)continue;const a=t-te;const d=V.sub(tgt,M0);const L=V.len(d);const s=a*16;let p;
        if(s<L)p=V.add(M0,V.sc(d,s/L));else{const ex=s-L;const ang=hsh(i,3)*TAU2;p=V.add(tgt,[Math.cos(ang)*ex*0.9,Math.sin(ang)*ex*0.6+ex*0.1,-ex*0.8])}if(a>1.1)continue;
        const sz=0.12+a*0.8;items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,sz),tint:mix3([1,0.8,0.35],[0.9,0.2,0.03],clamp(a/0.6,0,1)),tintAmt:1,alpha:clamp(0.26-a*0.2,0,1),add:1,noShadow:true})}}
    if(t>=EV.fire0&&t<EV.fire1+0.1){const H=S.hands[-1];items.push({mesh:DISC2,M:frameM(V.add(H,[0,0.0,0.05]),[0,0,1],[0,1,0],[0.85,1,0.85]),tint:[0.85,0.95,1],tintAmt:1,alpha:0.28,add:1,noShadow:true})}
    if(t>=EV.dcut&&t<EV.dcut+2){const k=t-EV.dcut;const p0=tp(LASTDRA.HM,[0.7,1.4,-1.2]);const y=Math.max(0.1,p0[1]-4.9*k*k);if(k<1.5)items.push({mesh:CONE,M:M4.trs([p0[0]+k*1.5,y,p0[2]],k*5,k*7,0,[0.1,0.5,0.1]),tint:DC.horn,tintAmt:1})}}
  // ---- final mosquito
  if(rn===4||t>=R[5]){const fwd=td(S.Hm,[0,0,1]);const hp=tp(S.Hm,[0,0.2,0.06]);const p=mosqPos(t,hp,fwd);LASTMOSQ=p;mosqItems(items,t,p,t>=EV.land2&&t<EV.slap)}
  return items}
function renderScene(t){let tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const c=camAt(tt);const items=fgItems(tt);const root=(LASTSAM&&LASTSAM.o.root)||[0,0,0];
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.05,far:14000},{center:[root[0],root[1]+0.4,root[2]],radius:6.5},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S_(EV.spin+0.1,10,0.5);S_(EV.click,14,0.6);if(t>=R[0]&&t<EV.spin)a+=2.5*clamp((t-R[0])/3,0,1);
  if(t>=EV.metUp&&t<EV.cut)a+=6*clamp((t-EV.metUp)/1.9,0,1);S_(EV.cut,22,0.5);S_(EV.land,16,0.5);S_(EV.boom,16,1.5);
  if(t>=31&&t<EV.wcut)a+=5*clamp((t-31)/2.6,0,1);S_(EV.wcut,24,0.6);if(t>=EV.wcut&&t<36.5)a+=8*(1-(t-EV.wcut)/2.9);
  S_(EV.roar,16,1.0);if(t>=EV.fire0&&t<EV.fire1)a+=5;S_(EV.dcut,20,0.5);S_(EV.dland,10,0.4);S_(EV.slap,18,0.4);S_(EV.slap+0.6,12,0.4);return a}
// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const [lab,c1,c2,t2,c3,t3]=ROUNDS[rn];const fin=rn===4;const ts=fin?EV.swat0:R[rn];const k=t-ts;
  if(!fin||t>=EV.swat0){ctx.save();ctx.translate(W/2,250);const pp=popS(k);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cap=c1,bg='rgba(15,10,30,0.66)',ka=k;if(t>=t2){cap=c2;bg=fin?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)';ka=t-t2}if(c3&&t>=t3){cap=c3;bg='rgba(40,110,190,0.88)';ka=t-t3}pill(cap,385,bg,60,Math.min(1,ka/0.12))}
  else{if(t>R[4]+0.3&&t<EV.wait)pill('Finally… peace 😌',385,'rgba(15,10,30,0.62)',60,Math.min(1,(t-R[4]-0.3)/0.15));if(t>=EV.wait)pill('Wait…',385,'rgba(15,10,30,0.62)',64)}
  const ko=t>=EV.slap+0.1;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('⚔️ HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330,34,17);ctx.fill()}
  txt(ko?'K.O.':'100%',258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['1000 NINJAS 🥷','#d9d0ff'],['A METEOR ☄️','#ffb36a'],['A TSUNAMI 🌊','#7fe0ff'],['A DRAGON 🐉','#ff7a6a']];
  L.forEach(([s,c],i)=>{const kk=clamp((t-0.15-i*0.18)/0.25,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-190+i*78,62,c);ctx.restore()});
  const kv=clamp((t-0.95)/0.25,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,140,74,'#ffffff');ctx.restore()}
  const ks=clamp((t-1.15)/0.25,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,250);const p2=popS(t-1.15);ctx.scale(p2,p2);txt('ONE SAMURAI ⚔️',0,0,fitSize('ONE SAMURAI ⚔️',980,112),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.6){ctx.save();ctx.globalAlpha=a*clamp((t-1.6)/0.3,0,1);pill('Who wins? 🤔',1560,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should he',0,-110,88,'#ffffff');txt('fight NEXT? ⚔️',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('T-Rex? 🦖   A black hole? 🕳️',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
// ---- sword trail ----
function swordTrail(t){if(!LASTVP)return;const N=9,dt=0.012;const P=[];for(let i=0;i<N;i++){const S=i===0?LASTSAM:samItems(t-i*dt);if(!S.tip){break}const a=project(LASTVP,S.base),b=project(LASTVP,S.tip);if(!a||!b)break;P.push([a,b])}
  if(P.length<2)return;let sp=0;for(let i=1;i<P.length;i++)sp+=Math.hypot(P[i][1][0]-P[i-1][1][0],P[i][1][1]-P[i-1][1][1]);sp/=P.length-1;const al=clamp((sp-12)/50,0,1);if(al<=0)return;
  ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<P.length-1;i++){const f=1-i/(P.length-1);ctx.fillStyle=`rgba(${200+55*f|0},${230+25*f|0},255,${0.75*al*f})`;ctx.beginPath();ctx.moveTo(P[i][0][0],P[i][0][1]);ctx.lineTo(P[i][1][0],P[i][1][1]);ctx.lineTo(P[i+1][1][0],P[i+1][1][1]);ctx.lineTo(P[i+1][0][0],P[i+1][0][1]);ctx.closePath();ctx.fill()}ctx.restore()}
function slashLine(cx,cy,ang,k,wid,col){if(k<0||k>1)return;const L=2600;const w=wid*Math.sin(k*Math.PI)*(1-k*0.5);const dx=Math.cos(ang),dy=Math.sin(ang);const ext=easeOut(clamp(k/0.25,0,1));ctx.save();ctx.globalCompositeOperation='screen';
  const x0=cx-dx*L*ext,y0=cy-dy*L*ext,x1=cx+dx*L*ext,y1=cy+dy*L*ext;ctx.strokeStyle=`rgba(${col},${0.35*(1-k)})`;ctx.lineWidth=w*4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${0.95*(1-k*0.7)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  if(LASTSAM&&LASTSAM.tip)swordTrail(tt);
  // stage 1: spin + click cuts
  {const k=(tt-EV.click)/0.35;if(k>=0&&k<1){const r=rngG(4);for(let i=0;i<7;i++)slashLine(r()*W,300+r()*1300,(r()-0.5)*1.2,clamp(k*1.3-i*0.04,0,1),14,'170,220,255')}}
  // meteor
  if(rn===1){if(tt<EV.cut&&LASTVP){const p=project(LASTVP,metPos(tt));if(p)glowAt(p,900*clamp((tt-R[1])/4.5,0.25,1),'255,140,50',0.55)}
    {const k=(tt-EV.cut+0.03)/0.45;if(LASTVP){const p=project(LASTVP,MET_C);slashLine(p?p[0]:W/2,p?p[1]:H/2,Math.PI/2+0.12,k,26,'255,220,160')}}
    if(tt>=EV.boom&&LASTVP){const fa=Math.exp(-(tt-EV.boom)*0.9);for(const L of MLAND){const p=project(LASTVP,[L[0],12,L[2]]);if(p){glowAt(p,700,'255,150,50',0.75*fa);glowAt(p,260,'255,240,190',0.8*fa)}}}
    if(tt>=EV.boom){const r=rngG(9);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<60;i++){const sp=120+r()*260;const x=(r()*W+Math.sin(tt*0.7+i)*60);const y=H-((tt-EV.boom)*sp+r()*H)%H;ctx.fillStyle=`rgba(255,${120+r()*100|0},40,${0.7*clamp(1-(tt-EV.boom)/5,0.25,1)})`;ctx.beginPath();ctx.arc(x,y,3+r()*4,0,TAU2);ctx.fill()}ctx.restore()}}
  // tsunami: wind/spray streaks + vertical cut
  if(rn===2){const a=clamp((tt-30.5)/1.5,0,1)*clamp((R[3]-tt)/1.5,0,1);if(a>0){const r=rngG(12);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<40;i++){const sp=1400+r()*900;const x0=r()*W*1.4;const y=((tt*sp+r()*2000)%(H+300))-150;const x=x0-y*0.35;ctx.strokeStyle=`rgba(210,235,245,${0.28*a})`;ctx.lineWidth=2+r()*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+40,y-110);ctx.stroke()}ctx.restore()}
    slashLine(W/2+10,H*0.45,Math.PI/2,(tt-EV.wcut+0.02)/0.55,34,'160,230,255')}
  // dragon: fire glow, cut, hearts
  if(rn===3&&LASTDRA&&LASTVP){if(tt>=EV.fire0&&tt<EV.fire1+0.4){const fa=tt<EV.fire1?1:1-(tt-EV.fire1)/0.4;const m=project(LASTVP,LASTDRA.mouth);if(m)glowAt(m,300,'255,170,60',0.45*fa);const h=project(LASTVP,[0,1.4,0.8]);if(h)glowAt(h,380,'255,140,40',0.35*fa)}
    {const p=project(LASTVP,LASTDRA.head);slashLine(p?p[0]:W/2,p?p[1]:H*0.4,-0.6,(tt-EV.dcut+0.02)/0.45,24,'255,230,200')}
    if(tt>=EV.pat+0.3){const p=project(LASTVP,V.add(LASTDRA.head,[0,1.6,0]));if(p)for(let i=0;i<3;i++){const k=((tt-EV.pat)*0.6+i/3)%1;emoji(i===1?'💕':'❤️',p[0]+Math.sin(k*9+i*2)*50+(i-1)*90,p[1]-k*260,70+30*k,clamp(Math.min(k/0.15,(1-k)/0.3),0,1))}}}
  // mosquito: KO stars + letterbox
  if(rn===4||tt>=R[5]){if(tt>=EV.slap+0.6&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*110,p[1]-40+Math.sin(a)*35,70)}}
    {const k=ease((tt-EV.land2+0.1)/0.3)*(1-ease((tt-EV.slap-0.2)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}}
    if(tt>=EV.wait-0.1&&tt<EV.slap&&LASTMOSQ&&LASTVP){const p=project(LASTVP,LASTMOSQ);if(p&&tt<EV.land2){/* buzz marks */ctx.save();ctx.strokeStyle='rgba(255,255,255,0.75)';ctx.lineWidth=5;for(let i=0;i<3;i++){const a=-0.9+i*0.5+Math.sin(tt*30+i)*0.1;ctx.beginPath();ctx.arc(p[0],p[1],45+i*18,a,a+0.35);ctx.stroke()}ctx.restore()}}
    {const k=(tt-EV.slap)/0.3;if(k>=0&&k<1&&LASTSAM&&LASTVP){const p=project(LASTVP,LASTSAM.head);if(p){emoji('💥',p[0]+30,p[1]-60,160*(0.7+0.3*easeOut(k*3)),1-k)}}}}
  // slow-mo bars around the freeze
  {const k=ease((tt-EV.spin+0.4)/0.3)*(1-ease((tt-EV.click-0.1)/0.3));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,100*k);ctx.fillRect(0,H-100*k,W,100*k)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.spin,0.75,0.25);flash(EV.click,0.45,0.2);flash(EV.cut,0.9,0.35);flash(EV.boom,0.45,0.7,'255,190,120');flash(EV.wcut,0.85,0.35,'220,245,255');flash(EV.dcut,0.85,0.3);flash(EV.slap,0.4,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
