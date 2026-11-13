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
