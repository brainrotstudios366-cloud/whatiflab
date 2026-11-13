// CHESS
const FPS=30,DUR=66,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();
// ---------- timeline ----------
const R=[3.4,15.2,27.0,38.8,51.0,61.6];
const EV={
  // knight
  kh:[4.3,5.2,6.1,7.0,7.9],kland:8.4,squint:9.1,cap1:9.7,hit1:10.15,
  // bishop
  bz:[16.0,17.4,17.95,18.5,19.0,19.55],rage:19.8,bfly:21.7,bfall:22.25,
  // rook
  rdrop:27.0,rland:27.55,snort1:28.3,snort2:28.9,charge:29.8,slow0:30.75,dstep:30.85,slow1:31.6,redge:31.95,rboom:33.9,
  // queen
  qdesc:38.8,qland:39.4,qs1:40.9,qs2:42.1,qcharge:43.3,qcap:43.6,qhit:44.05,promo0:44.5,promo:45.1,
  // final
  peace:51.0,dstep2:53.0,wake:54.4,turn:54.8,boss:55.2,ep:56.3,ephit:56.7,koland:57.7,
  endc:61.6,loop:65.6};
// caption sequence per round: [label, [time,text,bg]...]
const BGD='rgba(15,10,30,0.66)',BGG='rgba(40,140,60,0.88)',BGB='rgba(40,110,190,0.88)',BGR='rgba(200,40,40,0.88)',BGP='rgba(130,60,190,0.88)';
const ROUNDS=[
  ['STAGE 1',[[R[0],'A knight 🐴',BGD],[EV.kland+0.1,'Landed diagonal… 🤨',BGD],[EV.hit1+0.05,'Pawns capture diagonally 💀',BGG],[EV.hit1+1.6,'+1000 aura ♟️',BGB]]],
  ['STAGE 2',[[R[1],'A bishop ⛪',BGD],[EV.rage+0.1,"Can't reach light squares 🤡",BGG],[EV.bfall+0.7,'Fell off the board 💀',BGB]]],
  ['STAGE 3',[[R[2],'A rook 🏰',BGD],[EV.dstep+0.1,'First move: 2 squares 😎',BGG],[EV.rboom+0.05,'Rook: -1000 aura 💀',BGB]]],
  ['STAGE 4',[[R[3],'The queen 👑',BGD],[EV.qhit+0.05,'Pawn takes queen 💀',BGG],[EV.promo+0.1,'…and got PROMOTED 👑✨',BGP]]],
  ['FINAL BOSS',[[EV.boss,'One tiny pawn ♟️',BGD],[EV.ephit+0.25,'Google en passant 💀',BGR],[EV.ephit+1.9,'Holy hell 🔥',BGR]]]];
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
const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.55,0.48],[0.8,0.74,0.66],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1])}});
const PUFF=um(m=>blob(m,[0,0,0],1,p=>mix3([0.78,0.78,0.8],[0.97,0.97,0.98],clamp(p[1]*0.5+0.5,0,1)),3,0.9,[7,10]),0.5);
function fireball(items,p,k,s){if(k<0)return;if(k<1.6){const r=s*(0.35+0.8*easeOut(k/0.35));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.35,0.08],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.6,0,1),add:1,noShadow:true})}
  if(k<8){const rr=s*(0.6+3.0*easeOut(k/1.5));items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[rr,s*0.35*(1+k*0.3),rr]),alpha:clamp(1-(k-2.5)/5,0,1)*0.9});
    for(let i=0;i<7;i++){const a=i*1.3;const q=[p[0]+Math.cos(a)*s*0.4,p[1]+s*(0.5+k*0.9)+i*s*0.3,p[2]+Math.sin(a)*s*0.4];items.push({mesh:PUFF,M:M4.trs(q,i,0,0,s*(0.35+k*0.12)),tint:mix3([0.95,0.45,0.15],[0.25,0.22,0.22],clamp(k/1.2,0,1)),tintAmt:clamp(0.4+k*0.3,0,0.9),alpha:clamp(0.9-k/8,0,1),noShadow:true})}}}
// ================= chess pieces =================
const PC={w:hx('#f1e6d0'),w2:hx('#d9c8a6'),b:hx('#2c2833'),b2:hx('#433d4c'),gold:hx('#d4af37'),eye:[0.98,0.98,0.97],pup:[0.05,0.04,0.06]};
function lathe(m,prof,seg,col){for(let i=0;i<prof.length-1;i++){const[r0,y0]=prof[i],[r1,y1]=prof[i+1];for(let j=0;j<seg;j++){const a=j/seg*TAU2,b=(j+1)/seg*TAU2;
  const A=[Math.cos(a)*r0,y0,Math.sin(a)*r0],B=[Math.cos(b)*r0,y0,Math.sin(b)*r0],C=[Math.cos(b)*r1,y1,Math.sin(b)*r1],D=[Math.cos(a)*r1,y1,Math.sin(a)*r1];
  const c=typeof col==='function'?col((y0+y1)/2):col;if(r0<1e-5)m.tri(A,C,D,c);else if(r1<1e-5)m.tri(A,B,C,c);else m.quad(A,D,C,B,c)}}}
function arcProf(cy,rx,ry,a0,a1,n){const o=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([Math.max(0,rx*Math.cos(a)),cy+ry*Math.sin(a)])}return o}
const BASE=s=>[[0,0],[0.62*s,0],[0.645*s,0.05],[0.62*s,0.13],[0.52*s,0.17],[0.54*s,0.23],[0.46*s,0.28],[0.34*s,0.34]];
function ellM(m,M,col,res){const la=res?res[0]:12,lo=res?res[1]:18;const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return tp(M,[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)])};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);if(i===0)m.tri(a,c,b,col);else if(i===la-1)m.tri(a,d,b,col);else m.quad(a,d,c,b,col)}}
function mkPiece(kind,white){const c=white?PC.w:PC.b,c2=white?PC.w2:PC.b2;const m=new MB();const S=48;
  if(kind==='pawn'){lathe(m,[...BASE(1),[0.26,0.5],[0.22,0.68],[0.34,0.72],[0.35,0.76],[0.24,0.8],...arcProf(1.07,0.31,0.31,-0.98,Math.PI/2,16)],S,c)}
  if(kind==='bishop'){lathe(m,[...BASE(1.12),[0.28,0.8],[0.22,1.25],[0.38,1.3],[0.4,1.36],[0.26,1.42],...arcProf(1.78,0.31,0.43,-1.2,1.35,16),[0,2.21]],S,c);
    m.ico([0,2.27,0],0.085,c);tube(m,[0.1,2.1,0.19],[0.27,1.84,0.12],0.026,0.026,c2,8)}
  if(kind==='rook'){lathe(m,[...BASE(1.25),[0.48,0.45],[0.44,1.35],[0.56,1.42],[0.58,1.5],[0.6,1.72],[0.46,1.72],[0.46,1.62],[0,1.62]],S,c);
    for(let i=0;i<6;i++){const a=i/6*TAU2;const ry=Math.atan2(-Math.cos(a),-Math.sin(a));m.box([Math.cos(a)*0.53,1.84,Math.sin(a)*0.53],[0.36,0.25,0.14],c,0,ry)}}
  if(kind==='queen'){lathe(m,[...BASE(1.25),[0.3,1.0],[0.24,1.6],[0.42,1.66],[0.44,1.72],[0.28,1.8],[0.26,1.86],[0.45,2.38],[0.47,2.44],[0.3,2.44],[0.3,2.4],[0,2.4]],S,c);
    for(let i=0;i<9;i++){const a=i/9*TAU2;m.ico([Math.cos(a)*0.46,2.5,Math.sin(a)*0.46],0.07,c)}m.ico([0,2.5,0],0.17,c,0,0.8);m.ico([0,2.7,0],0.07,c)}
  if(kind==='knight'){lathe(m,[...BASE(1.18),[0.42,0.48],[0.4,0.56],[0,0.56]],S,c);
    ellM(m,M4.trs([0,0.98,-0.06],0,0.32,0,[0.31,0.5,0.3]),c);ellM(m,M4.trs([0,0.78,0.12],0,0,0,[0.33,0.28,0.3]),c);
    ellM(m,M4.trs([0,1.5,0.2],0,0.62,0,[0.25,0.27,0.43]),c);ellM(m,M4.trs([0,1.27,0.5],0,0.2,0,[0.2,0.17,0.23]),c);
    for(const sx of[-1,1]){m.ico([sx*0.08,1.25,0.71],0.035,PC.pup);m.prism([sx*0.11,1.74,-0.02],0.07,0,0.24,8,c)}
    for(let i=0;i<8;i++){const k=i/7;const p=lerp3([0,1.78,-0.1],[0,0.72,-0.38],k);const q=V.add(p,[0,0.04,-0.12]);tube(m,p,q,0.07-0.02*k,0.03,c2,7)}}
  return m.build(0.55)}
const PIECES={};const PH={pawn:1.38,knight:1.9,bishop:2.35,rook:1.97,queen:2.77};
// eye anchors: [y, x-sep, z(front), radius]
const EYE={pawn:[1.1,0.115,0.27,0.085],knight:[1.6,0.13,0.33,0.075],bishop:[1.74,0.12,0.27,0.08],rook:[1.12,0.15,0.43,0.095],queen:[2.08,0.13,0.33,0.09]};
let SQ,BEAM,SGLASS;
function buildPieces(){for(const k of['pawn','knight','bishop','rook','queen']){PIECES[k+'W']=mkPiece(k,true);PIECES[k+'B']=mkPiece(k,false)}
  SQ=um(m=>m.quad([-0.5,0,-0.5],[-0.5,0,0.5],[0.5,0,0.5],[0.5,0,-0.5],[1,1,1],MAT.glass));
  BEAM=um(m=>m.prism([0,-0.5,0],1,1,1,14,[1,1,1],MAT.emis));
  SGLASS=um(m=>{const k=[0.03,0.03,0.035];for(const sx of[-1,1]){m.box([sx*0.115,0,0],[0.17,0.11,0.03],k);m.box([sx*0.115,0.05,0.0],[0.19,0.03,0.035],k)}m.box([0,0.03,0],[0.07,0.025,0.03],k);
    for(const sx of[-1,1])m.box([sx*0.07,0.02,0.018],[0.03,0.03,0.005],[0.5,0.5,0.55])})}
buildPieces();
// st: {pos,yaw,rx,rz,piv,sq(+squash/-stretch),sc, eyes:{lid,look:[x,y],brow,x,glow,closed}, sg, mouth}
function pieceItems(kind,white,st,items){const mesh=PIECES[kind+(white?'W':'B')];const sq=st.sq||0,sc=st.sc||1;const sy=(1-sq)*sc,sxz=(1+sq*0.5)*sc;
  const M=M4.mul(M4.mul(M4.trs(st.pos,st.yaw||0,st.rx||0,st.rz||0,1),M4.trs([0,-(st.piv||0),0],0,0,0,1)),M4.trs([0,0,0],0,0,0,[sxz,sy,sxz]));
  items.push({mesh,M,alpha:st.alpha,add:st.add,tint:st.tint,tintAmt:st.tintAmt||0,noShadow:st.noShadow});
  const e=st.eyes||{};const[ey,ex,ez,er]=EYE[kind];const lid=clamp(e.lid||0,0,1);const lk=e.look||[0,0];
  const put=(mesh_,off,s,col,rot,extra)=>items.push(Object.assign({mesh:mesh_,M:M4.mul(M,M4.trs(off,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint:col,tintAmt:1,noShadow:true},extra||{}));
  if(st.alpha!=null)return M;
  for(const sx of[-1,1]){const p=[sx*ex,ey,ez];
    if(e.x){for(const d of[-1,1])put(UB,[p[0],p[1],p[2]+0.02],[er*1.9,er*0.38,er*0.3],PC.pup,[0,0,d*0.78]);continue}
    if(lid>=0.97){put(UB,[p[0],p[1]-er*0.1,p[2]+0.015],[er*1.7,er*0.3,er*0.3],white?PC.pup:[0.75,0.7,0.8],[0,0,0]);}
    else{put(USPH,p,[er,er*1.2*(1-lid),er*0.45],e.glow?[1,0.25,0.2]:PC.eye,null,e.glow?{mesh:UEMIS}:null);
      const pr=er*(e.tiny?0.22:0.5);put(USPH,[p[0]+lk[0]*er*0.45,p[1]+lk[1]*er*0.4-lid*er*0.3,p[2]+er*0.36],[pr,pr*1.15*(1-lid*0.7),er*0.18],e.glow?[0.5,0,0]:PC.pup);
      if(!e.glow)put(USPH,[p[0]+lk[0]*er*0.45+er*0.18,p[1]+lk[1]*er*0.4+er*0.22-lid*er*0.3,p[2]+er*0.44],[er*0.15,er*0.15,er*0.06],[1,1,1])}
    const ba=e.brow==null?(white?0:0.35):e.brow;put(UB,[p[0],p[1]+er*(1.45-lid*0.5)+(e.browY||0),p[2]+0.005],[er*1.7,er*0.32,er*0.35],white?hx('#5a4630'):hx('#0d0b10'),[0,0,sx*ba])}
  if(e.mouth==='o')put(USPH,[0,ey-er*1.9,ez-0.01],[er*0.45,er*0.55,er*0.3],[0.25,0.05,0.07]);
  if(e.mouth==='smirk')put(UB,[er*0.35,ey-er*1.8,ez-0.012],[er*1.8,er*0.34,er*0.3],[0.3,0.12,0.1],[0,0,0.25]);
  if(e.mouth==='grin')put(USPH,[0,ey-er*1.75,ez-0.02],[er*1.0,er*0.38,er*0.3],[0.3,0.06,0.08]);
  if(st.sg!=null){const k=st.sg;items.push({mesh:SGLASS,M:M4.mul(M,M4.trs([0,ey+0.02+k,ez+0.06],0,0,0,er/0.085)),tint:null,tintAmt:0,noShadow:true})}
  return M}
function headPos(kind,M){const e=EYE[kind];return tp(M,[0,e[0]+0.2,0])}
// ================= world =================
const Q=2;const sq=(f,r)=>[(f-4.5)*Q,0,(r-4.5)*Q];const isLight=(f,r)=>(f+r)%2===1;
const smst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
let BOARD,CLOUDSEA,ISLES;
{const m=new MB();
  m.box([0,-0.47,0],[18.8,0.9,18.8],hx('#3e2416'),0,0,hx('#5b3520'));
  m.box([0,-0.012,0],[16.35,0.02,16.35],PC.gold);
  for(let f=1;f<=8;f++)for(let r=1;r<=8;r++){const p=sq(f,r);const L=isLight(f,r);const base=L?hx('#ecd8b0'):hx('#8a5836');const v=(hsh(f,r)-0.5)*0.05;m.box([p[0],-0.03,p[2]],[Q,0.06,Q],[base[0]+v,base[1]+v,base[2]+v*0.6])}
  // gold corner studs
  for(const sx of[-1,1])for(const sz of[-1,1])m.ico([sx*8.75,0.02,sz*8.75],0.22,PC.gold,0,0.5);
  // floating rock under the board
  blob(m,[0,-6.3,0],10.5,p=>mix3(hx('#6c6258'),hx('#8f8476'),vnoise(p[0]*0.4,p[1]*0.4+p[2]*0.3)),11,0.42,[14,22]);
  blob(m,[0,-9.5,0],7.0,p=>mix3(hx('#5d544c'),hx('#7c7166'),vnoise(p[0]*0.5+3,p[2]*0.5)),12,0.8,[10,16]);
  blob(m,[0.5,-13,0.5],3.6,p=>mix3(hx('#544b44'),hx('#6e645a'),vnoise(p[0]+3,p[2])),13,1.1,[8,12]);
  // grass rim of the rock
  for(let i=0;i<70;i++){const a=i/70*TAU2,d=10.0+hsh(i,2)*0.8;blob(m,[Math.cos(a)*d,-2.0-hsh(i,3)*0.4,Math.sin(a)*d],0.9+hsh(i,4)*0.7,p=>mix3(hx('#4f8a3a'),hx('#79ab4a'),hsh(i,5)),i,0.5,[5,8])}
  BOARD=m.build(0.55)}
{const m=new MB();const r=rngG(77);
  for(let i=0;i<520;i++){const a=r()*TAU2,d=40+Math.pow(r(),0.6)*1700;const x=Math.cos(a)*d,z=Math.sin(a)*d;const s=18+r()*55+d*0.03;const y=-34-r()*14-s*0.25;
    blob(m,[x,y,z],s,p=>mix3(hx('#c9c2d6'),[1,1,1],clamp((p[1]-y)/s*0.6+0.55,0,1)),i,0.42,[5,9])}
  CLOUDSEA=m.build(0.4)}
{const m=new MB();const L=[[-140,-10,260,14],[190,8,330,18],[-330,-30,-60,22],[310,-20,-180,16],[-90,25,-420,20],[60,-5,560,26]];
  for(const[x,y,z,s]of L){blob(m,[x,y-s*0.5,z],s,p=>mix3(hx('#5f564e'),hx('#857a6c'),vnoise(p[0]*0.1,p[2]*0.1)),x,0.55,[9,14]);blob(m,[x,y-s*1.3,z],s*0.55,p=>hx('#5a514a'),x+1,1.2,[7,10]);
    blob(m,[x,y-0.2*s,z],s*0.98,p=>mix3(hx('#4f8a3a'),hx('#7aac4c'),vnoise(p[0]*0.2,p[2]*0.2)),x+2,0.12,[7,14]);
    for(let k=0;k<5;k++){const a=k*1.7+x,d=s*0.5*hsh(k,x|0);tree(m,x+Math.cos(a)*d,z+Math.sin(a)*d,s*0.09,y-0.1*s,'')}}
  ISLES=m.build(0.5)}
// ================= environment =================
function envBase(){return{sun:[0.55,0.4,-0.73],sunCol:hx('#ffd6a8'),sky:hx('#b4b8e0'),gnd:hx('#8a7a6a'),fog:hx('#f3c49a'),fogD:1400,zen:hx('#33449a'),hor:hx('#ffb27e'),stars:0,night:0,emis:1.25,ground:0,sunSize:3,fillD:[0,0.45,1],fillC:[0.32,0.3,0.4]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_GOLD=envBase();
const E_DUSK=Object.assign(envBase(),{sun:[-0.5,0.35,-0.8],sunCol:hx('#ffb0a0'),sky:hx('#a890c8'),fog:hx('#c99ab8'),zen:hx('#241a5a'),hor:hx('#f08aa8'),fillC:[0.3,0.26,0.42]});
const E_STORM=Object.assign(envBase(),{sun:[0.3,0.6,-0.75],sunCol:hx('#c8d0dc'),sky:hx('#8e9ab0'),fog:hx('#7d889a'),zen:hx('#232a3c'),hor:hx('#9aa6b8'),gnd:hx('#5a5a60'),fillC:[0.3,0.32,0.38],fogD:1000});
const E_QUEEN=Object.assign(envBase(),{sun:[0.7,0.25,-0.67],sunCol:hx('#ff9a6a'),sky:hx('#a080b0'),fog:hx('#a2507a'),zen:hx('#1a0d33'),hor:hx('#ff6a5a'),fillC:[0.34,0.2,0.38],stars:0.4});
const E_FIN=Object.assign(envBase(),{sun:[0.5,0.45,-0.74],sunCol:hx('#ffe0c0'),sky:hx('#b8c4ec'),fog:hx('#f8c4b4'),zen:hx('#4a64c4'),hor:hx('#ffc0a8')});
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e=E_GOLD;
  if(rn===1)e=mixEnv(E_GOLD,E_DUSK,tr(R[1],0.8));if(rn===2)e=mixEnv(E_DUSK,E_STORM,tr(R[2],0.8));
  if(rn===3){e=mixEnv(E_STORM,E_QUEEN,tr(R[3],0.8));const p=t>=EV.promo0&&t<EV.promo+1.2?clamp(Math.min((t-EV.promo0)/0.4,(EV.promo+1.2-t)/0.8),0,1):0;if(p>0){e=Object.assign({},e);e.fillC=V.add(e.fillC,[1.2*p,1.0*p,0.6*p]);e.fillD=[0,1,0.2]}}
  if(rn>=4)e=mixEnv(E_QUEEN,E_FIN,tr(R[4],0.6));
  if(rn===2&&t>=EV.rboom){const f=Math.exp(-(t-EV.rboom)*1.3);e=Object.assign({},e);e.fillC=V.add(e.fillC,[1.4*f,0.7*f,0.25*f]);e.fillD=[-1,-0.3,0]}
  return e}
// ================= camera =================
// [t, eye0, at0, eye1, at1, fov]
const SHOTS=[
  [0,[2.6,1.9,-9.8],[0,1.2,3],[1.2,1.8,-10.1],[0,1.2,3],0.9],
  // knight
  [R[0],[3.0,2.0,-5.2],[-2,0.7,6],[2.7,2.0,-4.8],[-2,0.7,6]],
  [EV.kh[0]-0.1,[7.5,8.5,-9.5],[0,0,2.2],[5.5,9.2,-10],[0.5,0,2.2]],
  [EV.kland-0.05,[-3.6,2.0,4.6],[2,0.8,0],[-3.3,1.9,4.2],[2,0.8,0]],
  [EV.squint,[1.0,1.2,0.75],[1,1.1,-1],[1.0,1.17,0.6],[1,1.1,-1],0.8],
  [EV.cap1-0.05,[-3.6,1.6,-1.6],[2.4,1.1,0.4],[-3.4,1.7,-1.2],[2.6,1.4,0.6]],
  [EV.hit1+0.4,[-1.2,1.6,-3.6],[8,4,9],[-1.0,1.6,-3.4],[12,8,13]],
  [EV.hit1+2.3,[3.4,0.55,3.6],[3,1.0,1],[4.8,0.65,2.2],[3,1.0,1]],
  // bishop
  [R[1],[-0.1,1.25,-4.6],[5,1.3,6],[0.1,1.25,-4.3],[5,1.3,6]],
  [EV.bz[0]+0.2,[-5.4,1.9,0.3],[1,1.2,0],[-5.0,1.9,0.5],[1,1.2,0]],
  [EV.bz[1]-0.05,[0,24,-14],[0,0,0.8],[0,23,-13.5],[0,0,0.8],1.0],
  [EV.rage-0.1,[3.0,4.4,-5.0],[-0.5,1.6,1.5],[2.6,4.2,-4.6],[-0.5,1.6,1.5]],
  [EV.bfly-0.15,[-3.5,6.5,1.5],[8,-1.5,-7],[-3.0,6.2,1.0],[14,-9,-12]],
  [EV.bfall+1.3,[2.5,0.95,1.5],[1,1.0,-1],[1.9,1.05,2.1],[1,1.0,-1]],
  // rook
  [R[2],[-3.6,0.95,-7.6],[5,1.3,-4.5],[-3.3,1.0,-7.4],[5,1.2,-4.5]],
  [EV.rland+0.55,[4.3,1.35,-3.4],[7,1.3,-5],[4.5,1.3,-3.6],[7,1.3,-5]],
  [EV.charge-0.05,[3.5,1.0,-9.8],[4,1,-5],[-1.0,1.0,-9.8],[0,1.0,-5]],
  [EV.slow0,[-1.0,1.0,-9.8],[0,1.0,-5],[-2.4,1.1,-9.5],[-1.6,1.1,-4]],
  [EV.slow1,[2,4.0,-2.5],[-12,-5,-5],[2.5,4.4,-2.0],[-22,-13,-5]],
  [EV.rboom+0.8,[0.6,0.95,1.7],[-1,1.0,-1],[-0.3,1.0,1.9],[-1,1.0,-1]],
  // queen
  [R[3],[2.1,1.0,-2.7],[-1,3.4,7],[2.0,1.0,-2.5],[-1,2.2,7]],
  [EV.qland+0.4,[7.5,5.5,-1.5],[0,0.8,4.6],[7.2,5,0.5],[0,0.8,4.6]],
  [EV.qcap-0.15,[-4.4,2.2,3.0],[-0.4,1.3,6.6],[-4.2,2.1,3.3],[-0.4,1.3,6.6]],
  [EV.promo0,[-0.4,1.2,11.2],[-1,1.9,7],[-0.5,1.1,10.8],[-1,2.3,7]],
  [EV.promo+1.3,[1.6,1.0,11.2],[-1,2.4,7],[-3.6,1.5,11.0],[-1,2.4,7]],
  // final
  [R[4],[4.0,2.3,-9.2],[0,0.6,-2.6],[3.4,2.1,-8.6],[0,0.6,-2.6]],
  [EV.dstep2-0.1,[6.5,1.8,-5.2],[0,0.9,-2.8],[6.2,1.8,-4.9],[0,0.9,-2.6]],
  [EV.wake-0.1,[0.3,1.2,-0.7],[-1,1.0,-1.1],[0.25,1.2,-0.75],[-1,1.0,-1.1],0.85],
  [EV.ep-0.15,[-3.5,4.5,-10],[4,1.2,-1.5],[-3.2,4.6,-9.8],[5.5,1.4,-1.2]],
  [EV.koland+0.2,[9.0,1.45,2.3],[8.2,0.45,-0.6],[8.8,1.4,2.0],[8.2,0.45,-0.6]],
  [EV.loop,[1.9,1.05,-7.6],[0.2,1.5,2],[1.9,1.05,-7.6],[0.2,1.5,2],0.9],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){if(t>=EV.bfly-0.15&&t<EV.bfall+1.3){let p;if(t<EV.bfall)p=lerp3(BP[6],BEDGE,clamp((t-EV.bfly)/(EV.bfall-EV.bfly),0,1));else p=flyer(BEDGE,[9,1.5,-9],14,t-EV.bfall,1.1);p=[p[0],p[1]+1,p[2]];return{eye:[-3.5,9,1.5],at:p,fov:0.95}}
  if(t>=EV.charge-0.05&&t<EV.slow1){const x=rookX(Math.max(t,EV.charge));return{eye:[x-3.2,3.0,-10.6],at:[x-0.9,0.9,-4.2],fov:0.95}}
  if(t>=EV.slow1&&t<EV.rboom+0.8){const tr=Math.min(t,EV.rboom);let p;if(tr<EV.redge)p=[rookX(tr),1,-5];else{const k=tr-EV.redge;p=[-9.4-20*k,1-8.82*k*k,-5]}return{eye:[-6,8,-2],at:p,fov:0.95}}for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.9}}
// ================= animation =================
function hop(t,t0,d,a,b,h,an){an=an==null?0.14:an;if(t<t0-an)return{p:a.slice(),sq:0};if(t<t0)return{p:a.slice(),sq:0.16*ease((t-t0+an)/Math.max(an,1e-3))};
  if(t<t0+d){const k=(t-t0)/d;const p=lerp3(a,b,k);p[1]+=4*h*k*(1-k);return{p,sq:-0.12*Math.sin(Math.PI*k)*(h>0.2?1:0.3),air:k}}
  const k=t-t0-d;return{p:b.slice(),sq:0.2*Math.exp(-k*9)*Math.cos(k*22)*(h>0.2?1:0.4),landed:k}}
function seq(t,start,moves){let st={p:start.slice(),sq:0};let cur=start;for(const mv of moves){const[t0,d,to,h,an]=mv;if(t>=t0-(an==null?0.14:an))st=hop(t,t0,d,cur,to,h,an);else break;cur=to}return st}
const faceYaw=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
function lookAt(st,kind,tgt){const e=EYE[kind];const h=[st.pos[0],st.pos[1]+e[0],st.pos[2]];const d=V.norm(V.sub(tgt,h));const y=st.yaw||0;const lx=d[0]*Math.cos(y)-d[2]*Math.sin(y);return[clamp(lx*1.3,-1,1),clamp(d[1]*1.5,-1,1)]}
function flyer(p0,v,g,k,piv){return[p0[0]+v[0]*k,p0[1]+piv+v[1]*k-0.5*g*k*k,p0[2]+v[2]*k]}
const S_=sq;
// ---- squares
const KP=[S_(2,8),S_(3,6),S_(5,7),S_(7,6),S_(8,4),S_(6,5)];
const BP=[S_(8,8),S_(5,5),S_(8,2),S_(4,6),S_(1,3),S_(6,8),S_(4,6)];const BD=[0.45,0.3,0.33,0.25,0.3,0.25];const BEDGE=[9.4,0,-7.4];
const QB=[[40.95,S_(5,5)],[41.5,S_(6,6)],[42.15,S_(5,6)],[42.7,S_(3,6)],[43.9,S_(5,7)]];
function rookX(t){if(t<EV.charge)return 7;if(t<EV.slow0)return 7-6*Math.pow((t-EV.charge)/(EV.slow0-EV.charge),2);if(t<EV.slow1)return 1-3.5*(t-EV.slow0)/(EV.slow1-EV.slow0);
  if(t<EV.redge)return -2.5-6.9*(t-EV.slow1)/(EV.redge-EV.slow1);return -9.4-20*(t-EV.redge)}
// ---- per-piece states for time t; returns list of {kind,white,st}
let HERO=null,STATE=null;
function piecesAt(t){const rn=roundAt(t);const P=[];const breath=0.012*Math.sin(t*3.1);
  const hero={kind:'pawn',white:true,st:{pos:S_(5,4),yaw:0,sq:breath,eyes:{lid:0.15}}};
  if(rn<0){hero.st.pos=S_(5,2);const L=[['knight',S_(6,6)],['bishop',S_(5,6)],['rook',S_(4,6)],['queen',S_(3,6)]];
    for(const[k,p]of L){const ph=t*3+p[0];P.push({kind:k,white:false,st:{pos:p,yaw:Math.PI,sq:0.02*Math.sin(ph),eyes:{lid:0.25,brow:0.45,look:lookAt({pos:p,yaw:Math.PI},k,[1,1.1,-5])}}})}
    hero.st.eyes={lid:0.3,brow:0.25,look:[0,0.2]}}
  if(rn===0){const moves=EV.kh.map((t0,i)=>[t0,0.5,KP[i+1],1.6]);let kn;
    const hs=seq(t,S_(5,4),[[EV.cap1,0.45,S_(6,5),0.9]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;
    if(t<EV.hit1){const s=seq(t,KP[0],moves);kn={kind:'knight',white:false,st:{pos:s.p,sq:s.sq,yaw:faceYaw(s.p,hero.st.pos),eyes:{lid:0.2,brow:0.5}}};
      if(t>EV.kland+0.1&&t<EV.cap1){const k=t-EV.kland;kn.st.sq+=0.06*Math.abs(Math.sin(k*14));kn.st.rz=0.08*Math.sin(k*9);kn.st.eyes={lid:0.45,brow:0.2,mouth:'grin'}}
      if(t>=EV.cap1){kn.st.eyes={lid:0,brow:-0.4,tiny:1,mouth:'o'}}kn.st.eyes.look=lookAt(kn.st,'knight',V.add(hero.st.pos,[0,1,0]))}
    else{const k=t-EV.hit1;kn={kind:'knight',white:false,st:{pos:flyer(S_(6,5),[10,13,11],3.5,k,0.95),piv:0.95,yaw:0.6,rx:k*8,rz:k*5,eyes:{x:1}}}}
    if(t<EV.hit1+3.2)P.push(kn);
    hero.st.eyes={lid:0.15,look:lookAt(hero.st,'pawn',V.add(kn.st.pos,[0,1.4,0]))};
    if(t>=EV.squint&&t<EV.hit1+1.5)Object.assign(hero.st.eyes,{lid:0.4,brow:0.32});if(t>=EV.hit1+1.5)Object.assign(hero.st.eyes,{lid:0.3,brow:-0.15,mouth:'smirk',look:[0.3,0.1]})}
  if(rn===1){let bs,yaw=0;const mv=EV.bz.map((t0,i)=>[t0,BD[i],BP[i+1],0.03,0.06]);
    if(t<EV.bfly)bs=seq(t,BP[0],mv);else if(t<EV.bfall)bs=hop(t,EV.bfly,EV.bfall-EV.bfly,BP[6],BEDGE,0.03,0.08);
    const b={kind:'bishop',white:false,st:{pos:null,sq:0,eyes:{lid:0.15,brow:0.5}}};
    if(t<EV.bfall){b.st.pos=bs.p;b.st.sq=bs.sq;b.st.yaw=faceYaw(bs.p,hero.st.pos);if(bs.air!=null&&t>=EV.bfly)b.st.yaw=faceYaw(BP[6],BEDGE);if(bs.air!=null)b.st.rx=0.18}
    else{const k=t-EV.bfall;b.st.pos=flyer(BEDGE,[9,1.5,-9],14,k,1.1);b.st.piv=1.1;b.st.yaw=faceYaw(BP[6],BEDGE);b.st.rx=0.3+k*4;b.st.eyes={lid:0,tiny:1,mouth:'o',brow:-0.5}}
    if(t>=EV.rage&&t<EV.bfly){const k=t-EV.rage;b.st.rz=0.035*Math.sin(k*70);b.st.eyes={lid:0.1,brow:0.75,browY:-0.02};b.st.sq=0.03*Math.sin(k*40)}
    b.st.eyes.look=b.st.eyes.look||lookAt(b.st,'bishop',V.add(hero.st.pos,[0,1,0]));b.trail=t>=EV.bz[0]-0.05&&t<EV.bfall;
    if(t<EV.bfall+2.5)P.push(b);
    hero.st.eyes={lid:0.42,look:lookAt(hero.st,'pawn',V.add(b.st.pos,[0,1.6,0]))};if(t>=EV.rage+0.3)Object.assign(hero.st.eyes,{mouth:'smirk',brow:-0.1})}
  if(rn===2){const hs=seq(t,S_(4,2),[[EV.dstep,0.6,S_(4,4),1.2,0.1]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;
    const r={kind:'rook',white:false,st:{pos:[7,0,-5],yaw:-Math.PI/2,sq:0,eyes:{lid:0.1,brow:0.6}}};
    if(t<EV.rland){const k=(t-EV.rdrop)/(EV.rland-EV.rdrop);r.st.pos=[7,30*(1-k*k),-5];r.st.sq=-0.12}
    else if(t<EV.charge){const k=t-EV.rland;r.st.sq=0.25*Math.exp(-k*8)*Math.cos(k*20);for(const s of[EV.snort1,EV.snort2]){const q=t-s;if(q>-0.15&&q<0.4)r.st.sq+=q<0?0.12*(q+0.15)/0.15:0.12*Math.exp(-q*10)*Math.cos(q*25)}
      if(t>EV.snort2+0.3){r.st.rx=0.12*ease((t-EV.snort2-0.3)/0.5)}}
    else{const x=rookX(t);r.st.pos=[x,0,-5];r.st.rx=0.22+0.04*Math.sin(t*30);r.st.sq=0.03*Math.sin(t*38);if(t>=EV.redge){const k=t-EV.redge;r.st.pos=[x,1.0-4.9*1.8*k*k,-5];r.st.piv=1.0;r.st.rx=0.22+k*2.5;r.st.eyes={lid:0,tiny:1,mouth:'o',brow:-0.5}}}
    r.st.eyes.look=lookAt(r.st,'rook',V.add(hero.st.pos,[0,1,0]));if(t<EV.rboom)P.push(r);r.dust=t>=EV.charge&&t<EV.redge;
    hero.st.eyes={lid:0.2,look:lookAt(hero.st,'pawn',V.add(r.st.pos,[0,1.2,0]))};
    if(t>=EV.slow0-0.3&&t<EV.dstep+0.3)Object.assign(hero.st.eyes,{lid:0,tiny:1,mouth:'o'});
    if(t>=EV.dstep+0.45){hero.st.sg=0.6*(1-ease((t-EV.dstep-0.45)/0.22));hero.st.eyes={lid:0.2,mouth:'smirk'}}}
  if(rn===3){const hs=seq(t,S_(5,5),[[EV.qs1,0.4,S_(5,6),0.8],[EV.qs2,0.4,S_(5,7),0.8],[EV.qcap,0.45,S_(4,8),1.4]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;
    const q={kind:'queen',white:false,st:{pos:S_(4,8),yaw:Math.PI,sq:0.015*Math.sin(t*2.6),eyes:{lid:0.2,brow:0.45}}};
    if(t<EV.qland){const k=(t-EV.qdesc)/(EV.qland-EV.qdesc);q.st.pos=V.add(S_(4,8),[0,14*(1-k*k),0]);q.st.sq=-0.1}
    else if(t<EV.qhit){const k=t-EV.qland;q.st.sq+=0.22*Math.exp(-k*8)*Math.cos(k*20);if(t>=39.8)q.st.eyes={lid:0.1,brow:0.55,glow:1};
      if(t>=EV.qcharge&&t<EV.qhit){const c=t-EV.qcharge;q.st.sq=-0.08*ease(c/0.4)+0.02*Math.sin(c*50)}q.st.yaw=faceYaw(q.st.pos,hero.st.pos)}
    else{const k=t-EV.qhit;q.st.pos=flyer(S_(4,8),[-8,14,10],4,k,1.3);q.st.piv=1.3;q.st.rx=-k*7;q.st.rz=k*4;q.st.eyes={x:1}}
    if(t<EV.qhit)q.st.eyes.look=lookAt(q.st,'queen',V.add(hero.st.pos,[0,1,0]));q.aura=t<EV.qhit;if(t<EV.qhit+3.2)P.push(q);
    hero.st.eyes={lid:0.12,brow:0.25,look:lookAt(hero.st,'pawn',V.add(S_(4,8),[0,2,0]))};if(t>=EV.qs1-0.2&&t<EV.qcap)hero.st.eyes.mouth='o';
    if(t>=EV.qhit){hero.st.eyes={lid:0.2,brow:-0.1,look:[0,0.3]}}
    if(t>=EV.promo){hero.kind='queen';const k=t-EV.promo;hero.st.sc=1+0.25*Math.exp(-k*6)*Math.cos(k*14);hero.st.yaw=0;hero.st.eyes={lid:0.22,brow:0.1,mouth:'smirk',look:[0,0.1]}}
    else if(t>=EV.promo0){const k=(t-EV.promo0)/(EV.promo-EV.promo0);hero.st.pos=V.add(S_(4,8),[0,0.6*ease(k),0]);hero.st.rx=0;hero.st.yaw=k*k*TAU2*2;hero.st.eyes={lid:1}}}
  if(rn>=4){const hs=seq(t,S_(5,2),[[EV.dstep2,0.55,S_(5,4),1.0]]);hero.st.pos=hs.p;hero.st.sq=hs.sq+breath;hero.st.eyes={lid:0.3,look:[0,0.1]};
    if(t>=EV.dstep2-0.6){hero.st.sg=0.5*(1-ease((t-EV.dstep2+0.6)/0.2));hero.st.eyes.mouth='smirk'}
    const bp={kind:'pawn',white:false,st:{pos:S_(4,4),yaw:Math.PI,sq:breath*0.7,eyes:{lid:1,brow:0}}};
    if(t>=EV.wake)bp.st.eyes={lid:clamp(1-(t-EV.wake)/0.15,0,1),brow:0.2,look:[0,0]};
    if(t>=EV.turn){bp.st.yaw=lerp(Math.PI,Math.PI/2,ease((t-EV.turn)/0.3));bp.st.eyes={lid:0.15,brow:0.55,look:[0,0]}}
    if(t>=EV.boss){bp.st.eyes.mouth='grin';bp.st.sq+=0.02*Math.sin(t*30)*(t<EV.ep?1:0)}
    if(t>=EV.ep-0.14){const s=hop(t,EV.ep,0.4,S_(4,4),S_(5,3),0.9);bp.st.pos=s.p;bp.st.sq=s.sq;bp.st.yaw=Math.PI/2}
    if(t>=EV.ephit+0.5)bp.st.eyes={lid:0.35,brow:0.3,mouth:'smirk',look:lookAt(bp.st,'pawn',[8,0.5,-0.6])};
    P.push(bp);
    if(t>=EV.wake&&t<EV.ephit)hero.st.eyes.look=[-0.6,0];
    if(t>=EV.boss-0.2&&t<EV.ephit){hero.st.eyes={lid:0,tiny:1,look:[-0.8,0]};hero.st.sg=null}
    if(t>=EV.ephit){const k=Math.min(t,EV.koland)-EV.ephit,K=EV.koland-EV.ephit;const kk=k/K;const a=[1,0.69,-1],b=[8.2,0.64,-0.6];const p=lerp3(a,b,kk);p[1]+=4*2.0*kk*(1-kk);
      hero.st.pos=p;hero.st.piv=0.69;hero.st.rz=-(Math.PI/2+TAU2)*easeOut(kk)*(kk<1?1:1);hero.st.rx=0.3*Math.sin(kk*Math.PI);hero.st.sq=0;hero.st.sg=null;hero.st.eyes={lid:0,tiny:1,mouth:'o'};
      if(t>=EV.koland){const q=t-EV.koland;hero.st.pos=V.add(b,[0,0.06*Math.exp(-q*8)*Math.abs(Math.cos(q*20)),0]);hero.st.rz=-Math.PI/2;hero.st.rx=0;hero.st.eyes={x:1,mouth:'o'}}}}
  P.unshift(hero);HERO=hero;STATE=P;return P}
// ---- highlights
const YEL=[0.96,0.93,0.35],RED=[0.95,0.22,0.2],BLU=[0.3,0.6,1.0],GLD=[1,0.85,0.35];
function hl(items,p,col,a){if(a<=0.01)return;items.push({mesh:SQ,M:M4.trs([p[0],0.015,p[2]],0,0,0,[Q*0.97,1,Q*0.97]),tint:col,tintAmt:1,alpha:a*0.55,noShadow:true})}
function highlights(items,t){const rn=roundAt(t);const fade=(t0,t1)=>clamp((t-t0)/0.12,0,1)*clamp((t1-t)/0.15,0,1);
  if(rn===0){for(let i=0;i<5;i++){const t1=i<4?EV.kh[i+1]:EV.cap1;const a=fade(EV.kh[i],t1);hl(items,KP[i],YEL,a);hl(items,KP[i+1],YEL,a)}
    hl(items,S_(6,5),RED,fade(EV.squint,EV.cap1)*(0.7+0.3*Math.sin(t*20)));const a=fade(EV.cap1+0.1,R[1]);hl(items,S_(5,4),YEL,a);hl(items,S_(6,5),YEL,a)}
  if(rn===1){for(let i=0;i<6;i++){const t1=i<5?EV.bz[i+1]:EV.bfly;const a=fade(EV.bz[i],t1);hl(items,BP[i],YEL,a);hl(items,BP[i+1],YEL,a)}
    const d=fade(EV.rage+0.05,EV.bfly-0.1);if(d>0)for(let f=1;f<=8;f++)for(let r=1;r<=8;r++)if(!isLight(f,r))hl(items,S_(f,r),BLU,d*(0.55+0.25*Math.sin(t*9+(f+r)*0.5)));
    if(d>0)hl(items,S_(5,4),[0.35,1,0.45],d*0.9)}
  if(rn===2){const a=fade(EV.snort2-0.2,EV.slow1+0.2);for(let f=1;f<=8;f++)hl(items,S_(f,2),RED,a*(0.6+0.3*Math.sin(t*14-f*0.8)));const b=fade(EV.dstep+0.6,R[3]);hl(items,S_(4,2),YEL,b);hl(items,S_(4,4),YEL,b)}
  if(rn===3){for(const[tb,p]of QB)hl(items,p,RED,fade(tb-0.35,tb+0.5)*(0.6+0.4*Math.sin(t*25)));const a=fade(EV.qcap+0.3,R[4]);hl(items,S_(5,7),YEL,a);hl(items,S_(4,8),t>=EV.promo0&&t<EV.promo+1?GLD:YEL,a)}
  if(rn>=4){const a=fade(EV.dstep2+0.5,EV.ep);hl(items,S_(5,2),YEL,a);hl(items,S_(5,4),YEL,a);const b=fade(EV.ep+0.4,99);hl(items,S_(4,4),YEL,b);hl(items,S_(5,3),YEL,b);hl(items,S_(5,4),RED,fade(EV.ephit,99))}}
// ---- effects
function dust(items,p,k,s,col,a0){if(k<0||k>0.7)return;const r=s*(0.6+2.2*easeOut(k/0.7));items.push({mesh:DUSTRING,M:M4.trs([p[0],p[1]+0.02,p[2]],0,0,0,[r,0.35*s,r]),tint:col||null,tintAmt:col?0.6:0,alpha:(a0||0.6)*(1-k/0.7),noShadow:true})}
function effects(items,t){const rn=roundAt(t);
  if(rn===0){EV.kh.forEach((t0,i)=>dust(items,KP[i+1],t-t0-0.5,0.8));dust(items,S_(6,5),t-EV.cap1-0.45,0.7);
    {const k=t-EV.hit1;if(k>=0&&k<0.5)for(let j=0;j<8;j++){const a=j/8*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(S_(6,5),[Math.cos(a)*k*5,1.2+Math.sin(a)*k*4,0.3]),0,0,0,0.12*(1-k/0.5)),tint:[1,0.9,0.5],tintAmt:1,alpha:0.9,add:1,noShadow:true})}}}
  if(rn===1){EV.bz.forEach((t0,i)=>dust(items,BP[i+1],t-t0-BD[i],0.5,null,0.4))}
  if(rn===2){dust(items,[7,0,-5],t-EV.rland,2.0,null,0.8);dust(items,S_(4,4),t-EV.dstep-0.6,0.7);
    for(const s of[EV.snort1,EV.snort2]){const k=t-s;if(k>=0&&k<1.2)for(let j=0;j<4;j++){const a=j*1.6;items.push({mesh:PUFF,M:M4.trs([7+Math.cos(a)*0.3,2.0+k*1.6+j*0.1,-5+Math.sin(a)*0.3],j,0,0,0.18+k*0.4),tint:[1,1,1],tintAmt:0.5,alpha:0.7*(1-k/1.2),noShadow:true})}}
    if(t>=EV.charge&&t<EV.redge+0.3){for(let j=0;j<10;j++){const tj=t-j*0.07;if(tj<EV.charge)break;const x=rookX(tj)+0.9;const k=j*0.07;items.push({mesh:PUFF,M:M4.trs([x+k*1.5,0.3+k*0.8,-5+Math.sin(j*2.1)*0.5],j,0,0,0.3+k*1.2),tint:[0.85,0.8,0.75],tintAmt:0.5,alpha:0.6*(1-j/10),noShadow:true})}}
    if(t>=EV.rboom-0.05)fireball(items,[-48,-34,-5],t-EV.rboom,8)}
  if(rn===3){dust(items,S_(4,8),t-EV.qland,1.8,[0.6,0.3,0.9],0.8);[EV.qs1+0.4,EV.qs2+0.4].forEach(tt=>dust(items,[1,0,tt<42?3:5],t-tt,0.6));
    const Q_=STATE.find(p=>p.kind==='queen'&&!p.white);
    if(Q_&&Q_.aura&&t>=EV.qland){const c=V.add(Q_.st.pos,[0,1.5,0]);const pl=0.8+0.2*Math.sin(t*6);items.push({mesh:UEMIS,M:M4.trs(c,0,0,0,[1.4,2.0,1.4]),tint:[0.55,0.2,0.9],tintAmt:1,alpha:0.13*pl,add:1,noShadow:true});
      const rr=1.3+0.15*Math.sin(t*4);items.push({mesh:DUSTRING,M:M4.trs([c[0],0.05,c[2]],t*0.5,0,0,[rr,0.25,rr]),tint:[0.7,0.35,1],tintAmt:1,alpha:0.35,add:1,noShadow:true});
      if(t>=EV.qcharge){const c2=V.add(Q_.st.pos,[0,2.3,0.25]);items.push({mesh:UEMIS,M:M4.trs(c2,0,0,0,0.15+0.5*ease((t-EV.qcharge)/0.6)),tint:[1,0.3,0.25],tintAmt:1,alpha:0.6,add:1,noShadow:true})}}
    for(const[tb,p]of QB){const k=t-tb;const src=V.add(S_(4,8),[0,2.1,0.3]);if(k>=0&&k<0.3&&tb<EV.qhit){const tg=[p[0],0.1,p[2]];const w=0.09*(1-k/0.3)+0.03;items.push({mesh:BEAM,M:segM(src,tg,w),tint:[1,0.25,0.2],tintAmt:1,alpha:0.95,add:1,noShadow:true});items.push({mesh:BEAM,M:segM(src,tg,w*3),tint:[1,0.4,0.3],tintAmt:1,alpha:0.3,add:1,noShadow:true})}
      if(k>=0.03&&k<2.2)fireball(items,[p[0],0,p[2]],k-0.03,0.55);if(k>=0.2)items.push({mesh:DISC2,M:M4.trs([p[0],0.02,p[2]],0,0,0,0.8),tint:[0.08,0.06,0.06],tintAmt:1,alpha:0.55,noShadow:true})}
    {const k=t-EV.qhit;if(k>=0&&k<0.5)for(let j=0;j<10;j++){const a=j/10*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(S_(4,8),[Math.cos(a)*k*6,1.6+Math.sin(a)*k*5,0]),0,0,0,0.14*(1-k/0.5)),tint:[1,0.85,0.5],tintAmt:1,alpha:0.9,add:1,noShadow:true})}}
    if(t>=EV.promo0){const k=t-EV.promo0;const a=clamp(k/0.3,0,1)*clamp((EV.promo+1.4-t)/0.8,0,1);const p=S_(4,8);if(a>0){items.push({mesh:BEAM,M:segM([p[0],0,p[2]],[p[0],60,p[2]],1.1+0.1*Math.sin(t*20)),tint:[1,0.92,0.6],tintAmt:1,alpha:0.18*a,add:1,noShadow:true});
      items.push({mesh:BEAM,M:segM([p[0],0,p[2]],[p[0],60,p[2]],0.45),tint:[1,1,0.9],tintAmt:1,alpha:0.3*a,add:1,noShadow:true});
      for(let j=0;j<26;j++){const ph=(k*0.9+hsh(j,1))%1;const ang=j*2.4+k*3;const r=0.6+hsh(j,2)*1.0;items.push({mesh:UEMIS,M:M4.trs([p[0]+Math.cos(ang)*r,ph*5,p[2]+Math.sin(ang)*r],0,0,0,0.05+0.05*hsh(j,3)),tint:[1,0.9,0.5],tintAmt:1,alpha:a*(1-ph),add:1,noShadow:true})}}
      const r2=t-EV.promo;if(r2>=0&&r2<0.9){const rr=0.5+9*easeOut(r2/0.9);items.push({mesh:DUSTRING,M:M4.trs([p[0],0.1,p[2]],0,0,0,[rr,0.3,rr]),tint:[1,0.9,0.5],tintAmt:1,alpha:0.7*(1-r2/0.9),add:1,noShadow:true})}
      if(t>=EV.promo){items.push({mesh:UEMIS,M:M4.trs(V.add(p,[0,1.6,0]),0,0,0,[1.3,2.1,1.3]),tint:[1,0.85,0.4],tintAmt:1,alpha:0.05+0.02*Math.sin(t*5),add:1,noShadow:true})}}}
  if(rn>=4){dust(items,S_(5,4),t-EV.dstep2-0.55,0.7);dust(items,S_(5,3),t-EV.ep-0.4,0.7);dust(items,[8.2,0,-0.6],t-EV.koland,0.9);
    {const k=t-EV.ephit;if(k>=0&&k<0.5)for(let j=0;j<10;j++){const a=j/10*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(S_(5,4),[Math.cos(a)*k*5,0.9+Math.sin(a)*k*4,0]),0,0,0,0.13*(1-k/0.5)),tint:[1,0.9,0.5],tintAmt:1,alpha:0.9,add:1,noShadow:true})}}
    if(t>=EV.ephit){const k=Math.min(t-EV.ephit,1.4);const p=[1+3.0*k,1.15+3.2*k-4.9*k*k,-0.6-1.6*k];if(p[1]<0.03)p[1]=0.03;items.push({mesh:SGLASS,M:M4.trs(p,k*9,k<1.3?k*6:0,k<1.3?k*4:0,1),noShadow:true})}}}
// ---- scene
let LASTVP=null;
function fgItems(t){const items=[{mesh:BOARD},{mesh:CLOUDSEA},{mesh:ISLES}];const P=piecesAt(t);
  for(const pc of P){pc.M=pieceItems(pc.kind,pc.white,pc.st,items);
    if(pc.trail){const H0=HERO,S0=STATE;for(let i=1;i<=6;i++){const tt=t-i*0.03;if(tt<R[1])break;const P2=piecesAt(tt);const b=P2.find(p=>p.kind==='bishop');if(!b||V.len(V.sub(b.st.pos,pc.st.pos))<0.05)continue;pieceItems('bishop',false,Object.assign({},b.st,{alpha:0.28*(1-i/7),add:1,tint:[0.55,0.3,1],tintAmt:1,noShadow:true}),items)}HERO=H0;STATE=S0}}
  highlights(items,t);effects(items,t);return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const c=camAt(tt);const items=fgItems(tt);const hp=HERO.st.pos;
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.05,far:14000},{center:[hp[0],0,hp[2]+1],radius:9},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  EV.kh.forEach(t0=>S(t0+0.5,5,0.25));S(EV.hit1,14,0.45);S(EV.rland,18,0.6);S(EV.snort1,4,0.3);S(EV.snort2,5,0.3);if(t>=EV.charge&&t<EV.redge)a+=3+5*clamp((t-EV.charge)/1,0,1)*(t>=EV.slow0&&t<EV.slow1?0.3:1);
  S(EV.rboom,10,1.2);S(EV.qland,14,0.6);for(const[tb]of QB)S(tb,6,0.35);S(EV.qhit,16,0.5);S(EV.promo,10,0.6);S(EV.ephit,16,0.45);S(EV.koland,9,0.35);return a}
// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const[lab,caps]=ROUNDS[rn];const fin=rn===4;
  if(!fin||t>=EV.boss){const ts=fin?EV.boss:R[rn];ctx.save();ctx.translate(W/2,250);const pp=popS(t-ts);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cur=null;for(const c of caps)if(t>=c[0])cur=c;if(cur)pill(cur[1],385,cur[2],60,Math.min(1,(t-cur[0])/0.12))}
  else{let s=null,t0=0;if(t>=R[4]+0.3){s='New game… finally peace 😌';t0=R[4]+0.3}if(t>=EV.dstep2){s='First move: 2 squares 😎';t0=EV.dstep2}if(t>=EV.wake){s='Wait…';t0=EV.wake}
    if(s)pill(s,385,BGD,s==='Wait…'?64:60,Math.min(1,(t-t0)/0.15))}
  const ko=t>=EV.ephit+0.05;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('♟️ HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330,34,17);ctx.fill()}
  txt(ko?'K.O.':'100%',258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['A KNIGHT 🐴','#d9d0ff'],['A BISHOP ⛪','#ffcf8a'],['A ROOK 🏰','#9fe0ff'],['THE QUEEN 👑','#ff8ab4']];
  L.forEach(([s,c],i)=>{const kk=clamp((t-0.15-i*0.18)/0.25,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-190+i*78,62,c);ctx.restore()});
  const kv=clamp((t-0.95)/0.25,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,140,74,'#ffffff');ctx.restore()}
  const ks=clamp((t-1.15)/0.25,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,250);const p2=popS(t-1.15);ctx.scale(p2,p2);txt('ONE PAWN ♟️',0,0,fitSize('ONE PAWN ♟️',980,118),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.6){ctx.save();ctx.globalAlpha=a*clamp((t-1.6)/0.3,0,1);pill('Who wins? 🤔',1560,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should the pawn',0,-110,fitSize('Who should the pawn',960,84),'#ffffff');txt('fight NEXT? ♟️',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('The King? 🤴   A chess bot? 🤖',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function badge(p,sym,col,k){if(!p)return;const s=k<0.18?0.4+0.6*easeOut(k/0.18)+0.25*Math.sin(k/0.18*Math.PI):1;ctx.save();ctx.translate(p[0]+60,p[1]-40);ctx.scale(s,s);ctx.shadowColor='rgba(0,0,0,0.45)';ctx.shadowBlur=12;ctx.shadowOffsetY=4;
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,52,0,TAU2);ctx.fill();ctx.shadowColor='transparent';ctx.lineWidth=7;ctx.strokeStyle='#ffffff';ctx.stroke();txt(sym,0,4,sym.length>1?50:58,'#ffffff','center',900,false);ctx.restore()}
function pcHead(kind,white,dy){if(!STATE||!LASTVP)return null;const pc=STATE.find(p=>p.kind===kind&&p.white===white);if(!pc||!pc.M)return null;return project(LASTVP,V.add(headPos(kind,pc.M),[0,dy||0.35,0]))}
const BADGES=[[EV.kland+0.05,EV.cap1+0.2,'knight',false,'??','#e0413a'],[EV.hit1+0.05,EV.hit1+1.6,'pawn',true,'!!','#1fb5a8'],[EV.bfly,EV.bfall+0.6,'bishop',false,'??','#e0413a'],
  [EV.slow1,EV.redge+0.6,'rook',false,'??','#e0413a'],[EV.dstep+0.6,EV.dstep+2.2,'pawn',true,'!!','#1fb5a8'],[EV.qhit+0.05,EV.promo0,'pawn',true,'!!','#1fb5a8'],[EV.ephit+0.1,R[5]+0.3,'pawn',false,'!!','#1fb5a8']];
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  // rook speed lines
  if(rn===2&&tt>=EV.charge&&tt<EV.redge+0.2){const a=clamp((tt-EV.charge)/0.6,0,1)*(tt>=EV.slow0&&tt<EV.slow1?0.45:1);const r=rngG(12);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<34;i++){const y=r()*H;const sp=2600+r()*1800;const x=W-((tt*sp+r()*3000)%(W+600));ctx.strokeStyle=`rgba(255,255,255,${0.32*a})`;ctx.lineWidth=2+r()*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+220+r()*200,y);ctx.stroke()}ctx.restore()}
  // queen beam glows
  if(rn===3&&LASTVP){for(const[tb,p]of QB){const k=tt-tb;if(k>=0&&k<0.6){const q=project(LASTVP,[p[0],0.4,p[2]]);if(q){glowAt(q,260,'255,120,60',0.65*(1-k/0.6));glowAt(q,90,'255,240,200',0.8*(1-k/0.6))}}}
    if(tt>=EV.qcharge&&tt<EV.qhit){const q=project(LASTVP,V.add(S_(4,8),[0,2.3,0.3]));if(q)glowAt(q,120+180*ease((tt-EV.qcharge)/0.6),'255,80,60',0.6)}
    if(tt>=EV.promo0&&tt<EV.promo+1.5){const q=project(LASTVP,V.add(S_(4,8),[0,1.5,0]));const a=clamp((tt-EV.promo0)/0.4,0,1)*clamp((EV.promo+1.5-tt)/0.8,0,1);if(q){glowAt(q,600,'255,220,140',0.3*a);glowAt(q,220,'255,255,235',0.35*a)}}}
  if(rn===2&&tt>=EV.rboom&&LASTVP){const q=project(LASTVP,[-48,-30,-5]);const f=Math.exp(-(tt-EV.rboom)*1.0);if(q){glowAt(q,600,'255,150,60',0.7*f);glowAt(q,200,'255,240,200',0.8*f)}}
  // twinkles for pieces sent into the sky
  for(const[t0,p0,v,g,pv]of[[EV.hit1,S_(6,5),[10,13,11],3.5,0.95],[EV.qhit,S_(4,8),[-8,14,10],4,1.3]]){const k=tt-t0;if(k>2.5&&k<3.4&&LASTVP){const q=project(LASTVP,flyer(p0,v,g,2.6,pv));if(q){const a=Math.sin((k-2.5)/0.9*Math.PI);ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(k*3);emoji('✨',0,0,90+60*a,a);ctx.restore()}}}
  // bishop rage
  if(rn===1&&tt>=EV.rage&&tt<EV.bfly){const p=pcHead('bishop',false,0.3);if(p){const k=tt-EV.rage;emoji('💢',p[0]+70+Math.sin(k*20)*6,p[1]-40,80*(0.9+0.15*Math.abs(Math.sin(k*8))),1)}}
  // sleeping black pawn
  if(rn===4&&tt<EV.wake){const p=pcHead('pawn',false,0.25);if(p)for(let i=0;i<3;i++){const k=((tt*0.5)+i/3)%1;emoji('💤',p[0]+40+k*70,p[1]-k*170,46+k*30,clamp(Math.min(k/0.2,(1-k)/0.3),0,1))}}
  // annotation badges
  for(const[t0,t1,kind,wh,sym,col]of BADGES){if(tt>=t0&&tt<t1){if(kind==='pawn'&&wh&&HERO.kind!=='pawn')continue;badge(pcHead(kind,wh,0.35),sym,col,tt-t0)}}
  // KO stars
  if(rn===4&&tt>=EV.koland+0.1&&LASTVP&&HERO.M){const p=project(LASTVP,tp(HERO.M,[0,1.2,0]));if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*100,p[1]-150+Math.sin(a)*32,64)}}
  // slow-mo bars
  {const k=ease((tt-EV.slow0+0.2)/0.25)*(1-ease((tt-EV.slow1)/0.25));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,100*k);ctx.fillRect(0,H-100*k,W,100*k)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.36)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.hit1,0.6,0.25);flash(EV.rland,0.25,0.2);flash(EV.rboom,0.35,0.5,'255,190,120');flash(EV.qhit,0.7,0.3);flash(EV.promo,0.95,0.6,'255,245,215');flash(EV.ephit,0.6,0.25);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
