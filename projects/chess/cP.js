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
