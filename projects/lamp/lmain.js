const FPS=30,DUR=66,SUB=1;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();
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
// ================= blocky character rig =================
function sbox(m,c,s,e,col,res,mat){const la=res||10,lo=(res||10)*2;const f=(v,p)=>Math.sign(v)*Math.pow(Math.abs(v),p);
  const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*TAU2;return[c[0]+s[0]/2*f(Math.sin(th),e)*f(Math.cos(ph),e),c[1]+s[1]/2*f(Math.cos(th),e),c[2]+s[2]/2*f(Math.sin(th),e)*f(Math.sin(ph),e)]};
  for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);if(i===0)m.tri(a,cc,b,col,mat);else if(i===la-1)m.tri(a,d,b,col,mat);else m.quad(a,d,cc,b,col,mat)}}
const HEADM=um(m=>sbox(m,[0,0,0],[1,1,1],0.3,[1,1,1],12),0.35);
const RBOX=um(m=>sbox(m,[0,0,0],[1,1,1],0.18,[1,1,1],8),0.35);
const DARK=[0.08,0.06,0.07];
function arcPts(a0,a1,rx,ry,n){const o=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([Math.cos(a)*rx,Math.sin(a)*ry,0])}return o}
function arcMesh(a0,a1,rx,ry,th,col){return um(m=>{const p=arcPts(a0,a1,rx,ry,10);for(let i=0;i<p.length-1;i++)tube(m,p[i],p[i+1],th,th,col,6);m.ico(p[0],th,col,0,1,[4,6]);m.ico(p[p.length-1],th,col,0,1,[4,6])})}
const M_SMILE=arcMesh(Math.PI+0.45,TAU2-0.45,0.11,0.06,0.016,DARK),M_SAD=arcMesh(0.5,Math.PI-0.5,0.09,0.045,0.016,DARK),M_SMIRK=arcMesh(Math.PI+0.9,TAU2-0.2,0.1,0.05,0.016,DARK);
const E_HAPPY=arcMesh(0.35,Math.PI-0.35,0.05,0.04,0.014,DARK),E_CLOSED=arcMesh(Math.PI+0.4,TAU2-0.4,0.05,0.025,0.013,DARK);
const M_LAUGH=um(m=>{const n=14;for(let i=0;i<n;i++){const a=Math.PI+i/n*Math.PI,b=Math.PI+(i+1)/n*Math.PI;m.tri([0,0,0],[Math.cos(a)*0.12,Math.sin(a)*0.11,0],[Math.cos(b)*0.12,Math.sin(b)*0.11,0],[0.25,0.04,0.06]);m.tri([0,0,0],[Math.cos(b)*0.12,Math.sin(b)*0.11,0],[Math.cos(a)*0.12,Math.sin(a)*0.11,0],[0.25,0.04,0.06])}
  for(let i=0;i<n;i++){const a=Math.PI+0.5+i/n*(Math.PI-1),b=Math.PI+0.5+(i+1)/n*(Math.PI-1);m.tri([0,-0.07,0.004],[Math.cos(a)*0.07,-0.07+Math.sin(a)*0.04+0.02,0.004],[Math.cos(b)*0.07,-0.07+Math.sin(b)*0.04+0.02,0.004],hx('#ff7a8a'))}
  m.box([0,-0.008,0.003],[0.2,0.02,0.004],[0.98,0.98,0.96])});
const M_O=um(m=>{m.ico([0,0,0],1,[0.2,0.03,0.05],0,0.001,[3,16])});
const E_DOT=um(m=>m.ico([0,0,0],1,DARK,0,1,[6,10]));
const E_WHITE=um(m=>m.ico([0,0,0],1,[0.98,0.98,0.98],0,1,[6,10]));
const DROP=um(m=>{m.ico([0,0,0],1,[0.55,0.8,1],MAT.glass,1,[6,10]);m.prism([0,0.5,0],0.85,0,1.2,10,[0.55,0.8,1],MAT.glass)});
const CONE6=um(m=>m.prism([0,0,0],1,0,1,6,[1,1,1]));
// appearance presets
const PAL={skin:hx('#f5c99a'),skin2:hx('#d9a070'),skin3:hx('#a8724a')};
function chr(o){return Object.assign({skin:PAL.skin,shirt:hx('#d04040'),pants:hx('#3a5a9a'),shoes:hx('#2a2a2a'),hair:'short',hairCol:hx('#5a3a20'),sleeve:null},o)}
const LOOK={
  kid:chr({shirt:hx('#8ab4e8'),pants:hx('#6a94c8'),shoes:hx('#e8e8f0'),hair:'short',hairCol:hx('#6a4022'),pj:1,sc:0.86}),
  old:chr({shirt:hx('#5a4a3a'),pants:hx('#3a3a3a'),shoes:hx('#2a2a2a'),hair:'cap',hairCol:hx('#d8d8d8'),coat:hx('#4a3a2c'),skin:hx('#e8c0a0'),sc:0.98}),
  ghost:chr({shirt:hx('#15151c'),pants:hx('#101015'),shoes:hx('#0a0a0c'),hair:'hood',hairCol:hx('#121218'),coat:hx('#121218'),skin:hx('#7a7a84'),sleeve:hx('#15151c'),stretch:[0.85,1.45,0.85],sc:1.0}),
  leo:chr({shirt:hx('#e8e2d0'),pants:hx('#6a5a48'),shoes:hx('#4a3a2a'),hair:'short',hairCol:hx('#7a4a22'),patch:1,sc:0.86}),
  leoA:chr({shirt:hx('#1c1c24'),pants:hx('#1c1c24'),shoes:hx('#111'),hair:'slick',hairCol:hx('#6a3c1a'),suit:1,glasses:1,sc:1.0}),
  max:chr({shirt:hx('#3a7ae0'),pants:hx('#2a2a36'),shoes:hx('#f2f2f2'),hair:'spiky',hairCol:hx('#f2d060'),hood:1,sc:0.9}),
  maxA:chr({shirt:hx('#7a8aa0'),pants:hx('#3a3a42'),shoes:hx('#5a4a3a'),hair:'spiky',hairCol:hx('#c8a850'),apron:1,messy:1,sc:1.0}),
  f1:chr({shirt:hx('#3aa050'),pants:hx('#3a3a3a'),hair:'cap',hairCol:hx('#e04a2a'),skin:PAL.skin2,sc:0.88}),
  f2:chr({shirt:hx('#8a4ad0'),pants:hx('#2a3a5a'),hair:'short',hairCol:hx('#1a1410'),sc:0.88}),
  dad:chr({shirt:hx('#f4f4f0'),pants:hx('#f4f4f0'),shoes:hx('#222'),hair:'chef',hairCol:hx('#4a3a2a'),check:1,sc:1.0,mus:1}),
  v1:chr({shirt:hx('#c0392b'),pants:hx('#2c4a8a'),hair:'short',hairCol:hx('#7a4a20'),plaid:1}),
  v2:chr({shirt:hx('#5a9a7a'),pants:hx('#3a5a8a'),hair:'bun',hairCol:hx('#d8d8d8'),skin:PAL.skin}),
  v3:chr({shirt:hx('#f2c230'),pants:hx('#e04a4a'),hair:'short',hairCol:hx('#2a1a10'),sc:0.72}),
  v4:chr({shirt:hx('#e8e8ee'),pants:hx('#1a1a1a'),hair:'long',hairCol:hx('#8a5a30'),skin:PAL.skin2}),
  v5:chr({shirt:hx('#2a4ab0'),pants:hx('#2a3a5a'),hair:'short',hairCol:hx('#3a2a1a'),skin:PAL.skin3}),
  v6:chr({shirt:hx('#4a7a50'),pants:hx('#4a6aa0'),hair:'short',hairCol:hx('#eeeeee'),skin:PAL.skin}),
  v7:chr({shirt:hx('#e07a30'),pants:hx('#3a3a3a'),hair:'long',hairCol:hx('#1a1410'),skin:PAL.skin3}),
};
const mm=(a,b)=>M4.mul(a,b);
function part(items,Mroot,local,col,mesh){items.push({mesh:mesh||UB,M:mm(Mroot,local),tint:col,tintAmt:1})}
const TT=(p,s)=>M4.trs(p,0,0,0,s);
// st: pos, ry, aL/aR {f,s}, lL/lR (fwd), walk{ph,amp}, head{y,p,r}, lean, side, bob, face{eyes,mouth,brow,tear,sweat,look}, glasses(0..1 down), pack, hide
function blocky(L,st,items){const sc=(L.sc||1)*(st.sc||1);let pos=st.pos;const wk=st.walk;let bob=st.bob||0;
  let lf=st.lL||0,rf=st.lR||0,af=0;if(wk&&wk.amp){const s=Math.sin(wk.ph);lf+=s*wk.amp;rf-=s*wk.amp;af=s*wk.amp*0.85;bob+=Math.abs(Math.cos(wk.ph))*0.05*wk.amp}
  const R=M4.trs([pos[0],pos[1]+bob*sc,pos[2]],st.ry||0,0,0,L.stretch?[sc*L.stretch[0],sc*L.stretch[1],sc*L.stretch[2]]:sc);
  const B=mm(R,M4.trs([0,0.8,0],0,st.lean||0,st.side||0,1));// body pivot at hip
  const Bt=mm(B,TT([0,-0.8,0],1));
  // legs
  for(const[sx,f]of[[1,lf],[-1,rf]]){const H=mm(R,M4.trs([sx*0.2,0.8,0],0,-f,0,1));part(items,H,TT([0,-0.32,0],[0.39,0.64,0.39]),L.pants);part(items,H,TT([0,-0.72,0.02],[0.4,0.16,0.44]),L.shoes)}
  // torso
  part(items,Bt,TT([0,1.2,0],[0.8,0.8,0.4]),L.shirt);
  if(L.hood)part(items,Bt,TT([0,1.08,0.205],[0.42,0.2,0.02]),V.sc(L.shirt,0.8));
  if(L.coat){part(items,Bt,TT([0,0.62,0],[0.86,0.5,0.46]),L.coat);part(items,R,TT([0,0.42,0],[0.9,0.42,0.48]),L.coat)}
  if(L.pj){for(let i=0;i<3;i++)part(items,Bt,TT([0,0.95+i*0.22,0.205],[0.8,0.06,0.02]),V.sc(L.shirt,0.75))}
  if(L.suit){part(items,Bt,TT([0,1.43,0.203],[0.26,0.3,0.02]),[0.96,0.96,0.96]);part(items,Bt,TT([0,1.33,0.214],[0.09,0.42,0.02]),hx('#f2c02a'));part(items,Bt,TT([0.25,1.42,0.206],[0.06,0.06,0.01]),hx('#f2c02a'))}
  if(L.apron){part(items,Bt,TT([0,1.1,0.208],[0.62,0.7,0.02]),hx('#ece4d0'));part(items,Bt,TT([0,0.75,0.21],[0.62,0.3,0.02]),hx('#ece4d0'))}
  if(L.check){for(let i=0;i<2;i++)for(let j=0;j<3;j++)part(items,Bt,TT([-0.06+i*0.12,1.42-j*0.13,0.205],[0.05,0.05,0.02]),[0.2,0.2,0.2]);part(items,Bt,TT([0,1.56,0.21],[0.5,0.06,0.03]),hx('#d03030'))}
  if(L.plaid){for(let i=0;i<3;i++){part(items,Bt,TT([0,1.0+i*0.22,0],[0.82,0.04,0.42]),V.sc(L.shirt,0.55));part(items,Bt,TT([-0.27+i*0.27,1.2,0],[0.04,0.82,0.42]),V.sc(L.shirt,0.55))}}
  if(L.patch)part(items,Bt,TT([0.2,1.05,0.205],[0.16,0.14,0.02]),hx('#a87a4a'));
  if(st.pack){part(items,Bt,TT([0,1.18,-0.33],[0.56,0.62,0.26]),hx('#b0602a'));part(items,Bt,TT([0,1.36,-0.47],[0.4,0.2,0.04]),hx('#8a4a1e'));for(const sx of[-1,1])part(items,Bt,TT([sx*0.24,1.25,0.205],[0.08,0.7,0.02]),hx('#8a4a1e'))}
  // arms
  const arm={};
  for(const[sx,a]of[[1,st.aL],[-1,st.aR]]){const f=(a&&a.f!=null?a.f:0)+(sx>0?-af:af),s=(a&&a.s)||0,tw=(a&&a.tw)||0;const S=mm(Bt,M4.trs([sx*0.6,1.52,0],tw,-f,sx*(0.06+s),1));
    part(items,S,TT([0,-0.24,0],[0.37,0.58,0.39]),L.sleeve||L.shirt);part(items,S,TT([0,-0.63,0],[0.36,0.22,0.38]),L.skin);if(L.suit)part(items,S,TT([0,-0.52,0],[0.38,0.05,0.4]),[0.96,0.96,0.96]);
    arm[sx>0?'L':'R']=tp(S,[0,-0.72,0])}
  // head
  const hd=st.head||{};const Hm=mm(Bt,M4.trs([0,1.6,0],hd.y||0,hd.p||0,hd.r||0,1));const HC=mm(Hm,TT([0,0.3,0],1));
  part(items,Bt,TT([0,1.63,0],[0.3,0.08,0.3]),L.skin,UB);
  items.push({mesh:HEADM,M:mm(HC,TT([0,0,0],[0.62,0.58,0.58])),tint:L.skin,tintAmt:1});
  const F=st.face||{};const z=0.292;const lk=F.look||[0,0];
  // eyes
  const eyes=F.eyes||'open';
  for(const sx of[-1,1]){const ex=sx*0.12+lk[0]*0.02,ey=0.05+lk[1]*0.015;
    if(eyes==='open'||eyes==='wide'){const big=eyes==='wide'?1.35:1;const bl=F.blink?0.12:1;if(eyes==='wide')items.push({mesh:E_WHITE,M:mm(HC,M4.trs([sx*0.12,0.05,z-0.004],0,0,0,[0.075,0.09*bl,0.012])),tint:null});
      items.push({mesh:E_DOT,M:mm(HC,M4.trs([ex,ey,z+0.004],0,0,0,[0.042*big*(eyes==='wide'?0.75:1),0.06*big*bl*(eyes==='wide'?0.75:1),0.014])),tint:null});
      if(!F.blink)items.push({mesh:E_WHITE,M:mm(HC,M4.trs([ex+0.012,ey+0.02,z+0.012],0,0,0,0.013)),tint:null})}
    else if(eyes==='ember'){items.push({mesh:E_DOT,M:mm(HC,M4.trs([sx*0.12,0.04,z+0.004],0,0,0,[0.038,0.022,0.014])),tint:[1,0.45,0.08],tintAmt:1,emis:1});items.push({mesh:UEMIS,M:mm(HC,M4.trs([sx*0.12,0.04,z+0.01],0,0,0,[0.05,0.03,0.02])),tint:[1,0.5,0.1],tintAmt:1})}
    else if(eyes==='happy')items.push({mesh:E_HAPPY,M:mm(HC,M4.trs([sx*0.12,0.03,z],0,0,0,1)),tint:null});
    else if(eyes==='closed')items.push({mesh:E_CLOSED,M:mm(HC,M4.trs([sx*0.12,0.05,z],0,0,0,1)),tint:null});
    else if(eyes==='half'){items.push({mesh:E_DOT,M:mm(HC,M4.trs([ex,ey-0.01,z],0,0,0,[0.042,0.03,0.014])),tint:null})}
    // brows
    const br=F.brow;if(br||L.messy){const ang=br==='angry'?0.45*sx:br==='sad'?-0.4*sx:br==='up'?0.15*sx:0;part(items,HC,M4.trs([sx*0.12,0.15+(br==='up'?0.03:0),z+0.003],0,0,ang,[0.12,0.028,0.012]),DARK)}}
  // mouth
  const mo=F.mouth||'smile';const MY=-0.12;if(mo==='none'){}
  if(mo==='smile')items.push({mesh:M_SMILE,M:mm(HC,TT([0,MY+0.04,z+0.002],1)),tint:null});
  else if(mo==='sad')items.push({mesh:M_SAD,M:mm(HC,TT([0,MY-0.02,z+0.002],1)),tint:null});
  else if(mo==='smirk')items.push({mesh:M_SMIRK,M:mm(HC,M4.trs([0.03,MY+0.04,z+0.002],0,0,0.15,1)),tint:null});
  else if(mo==='laugh')items.push({mesh:M_LAUGH,M:mm(HC,M4.trs([0,MY+0.03,z+0.002],0,0,0,[1,1+(F.open||0)*0.3,1])),tint:null});
  else if(mo==='o')items.push({mesh:M_O,M:mm(HC,M4.trs([0,MY,z+0.002],0,-Math.PI/2,0,[0.05,0.07,0.065*(F.open||1)])),tint:null});
  else if(mo==='flat')part(items,HC,TT([0,MY,z+0.002],[0.12,0.022,0.01]),DARK);
  // hair
  const hc=L.hairCol;const hs=L.hair;
  if(hs==='short'||hs==='spiky'||hs==='long'||hs==='bun'||hs==='slick'||hs==='cap'){part(items,HC,TT([0,0.25,-0.01],[0.66,0.16,0.62]),hc,RBOX);part(items,HC,TT([0,0.04,-0.27],[0.66,0.44,0.1]),hc);for(const sx of[-1,1])part(items,HC,TT([sx*0.315,0.1,-0.06],[0.05,0.3,0.42]),hc);
    if(hs!=='cap')part(items,HC,M4.trs([hs==='slick'?0.08:0,0.235,0.27],0,0,hs==='slick'?-0.12:0,[hs==='slick'?0.5:0.64,0.11,0.08]),hc)}
  if(hs==='spiky'){for(let i=0;i<6;i++){const a=i/6*TAU2;items.push({mesh:CONE6,M:mm(HC,M4.trs([Math.cos(a)*0.16,0.28,Math.sin(a)*0.14+0.04],0,Math.sin(a)*0.5,-Math.cos(a)*0.5,[0.1,0.24+(L.messy?0.05*Math.sin(i*3):0),0.1])),tint:hc,tintAmt:1})}
    for(let i=0;i<3;i++)items.push({mesh:CONE6,M:mm(HC,M4.trs([-0.18+i*0.18,0.24,0.25],0,1.1,0,[0.09,0.2,0.09])),tint:hc,tintAmt:1})}
  if(hs==='long'){part(items,HC,TT([0,-0.22,-0.28],[0.68,0.64,0.12]),hc);for(const sx of[-1,1])part(items,HC,TT([sx*0.33,-0.12,0.0],[0.06,0.56,0.5]),hc)}
  if(hs==='bun')items.push({mesh:USPH,M:mm(HC,TT([0,0.38,-0.12],0.15)),tint:hc,tintAmt:1});
  if(hs==='cap'){part(items,HC,TT([0,0.3,0],[0.66,0.12,0.62]),hx('#d03a2a'),RBOX);part(items,HC,TT([0,0.26,0.4],[0.5,0.03,0.26]),hx('#b02a1a'))}
  if(hs==='hood'){part(items,HC,TT([0,0.06,-0.1],[0.72,0.7,0.6]),hc,RBOX);part(items,HC,TT([0,0.33,0.06],[0.7,0.1,0.6]),hc);for(const sx of[-1,1])part(items,HC,TT([sx*0.34,0.02,0.18],[0.06,0.6,0.3]),hc);items.push({mesh:UB,M:mm(HC,TT([0,0.02,0.27],[0.6,0.58,0.04])),tint:[0.02,0.02,0.03],tintAmt:1})}
  if(hs==='chef'){part(items,HC,TT([0,0.22,0],[0.64,0.12,0.6]),hc);items.push({mesh:UCYL,M:mm(HC,TT([0,0.42,0],[0.3,0.3,0.3])),tint:[0.97,0.97,0.97],tintAmt:1});items.push({mesh:USPH,M:mm(HC,TT([0,0.62,0],[0.37,0.18,0.37])),tint:[0.98,0.98,0.98],tintAmt:1});
    if(L.mus)for(const sx of[-1,1])part(items,HC,M4.trs([sx*0.07,-0.06,z+0.01],0,0,sx*0.25,[0.13,0.04,0.02]),hc)}
  // glasses
  if(L.glasses){const g=clamp(st.glasses||0,0,1);const G=mm(HC,M4.trs([0,0.05-g*0.065,z+0.02+g*0.03],0,g*0.3,0,1));for(const sx of[-1,1])part(items,G,TT([sx*0.13,0,0],[0.2,0.11,0.025]),[0.04,0.04,0.05]);part(items,G,TT([0,0.03,0],[0.08,0.025,0.02]),[0.04,0.04,0.05]);for(const sx of[-1,1])part(items,G,TT([sx*0.31,0.03,-0.12],[0.02,0.025,0.26]),[0.04,0.04,0.05])}
  // tear / sweat
  if(F.tear!=null){const k=F.tear%1;items.push({mesh:DROP,M:mm(HC,TT([0.15,0.0-k*0.18,z+0.02],0.028)),alpha:0.9,noShadow:true})}
  if(F.sweat)items.push({mesh:DROP,M:mm(HC,TT([0.33,0.2,0.1],0.045)),alpha:0.9,noShadow:true});
  return{head:tp(HC,[0,0.1,0.3]),top:tp(HC,[0,0.5,0]),hL:arm.L,hR:arm.R,HC,R,Bt}}
// ================= props =================
const FONT5={A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],
  K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],O:['01110','10001','10001','10001','10001','10001','01110'],
  P:['11110','10001','10001','11110','10000','10000','10000'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],
  W:['10001','10001','10001','10101','10101','10101','01010'],Y:['10001','10001','01010','00100','00100','00100','00100'],"'":['00100','00100','01000','00000','00000','00000','00000'],
  '0':['01110','10011','10101','10101','10101','11001','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],' ':['00000','00000','00000','00000','00000','00000','00000']};
// text in local xy plane, reading direction along +x (dir=1) or -x (dir=-1), facing +z (dir=1) or -z
function pixText(m,s,c,cell,col,dir,depth){dir=dir||1;depth=depth||cell*0.6;const adv=[];let wsum=0;for(const ch of s){const w=ch==="'"?3:ch===' '?3:6;adv.push(w);wsum+=w}wsum-=1;let x0=-wsum*cell/2;let k=0;
  for(const ch of s){const g=FONT5[ch]||FONT5[' '];const off=ch==="'"?-1:0;for(let r=0;r<7;r++)for(let q=0;q<5;q++){if(g[r][q]!=='1')continue;const lx=x0+(q+off)*cell+cell/2;
      m.box([c[0]+dir*lx,c[1]+(3-r)*cell,c[2]],[cell*0.96,cell*0.96,depth],col)}x0+=adv[k++]*cell}}
const LOAF=um(m=>{sbox(m,[0,0,0],[0.42,0.17,0.2],0.7,hx('#c9853a'),8);for(let i=0;i<3;i++)m.box([-0.1+i*0.1,0.075,0],[0.03,0.025,0.15],hx('#ecc27a'),0,-0.5)},0.4);
const CART=um(m=>{const w=hx('#9a6a3a'),w2=hx('#7a4e28'),w3=hx('#b8844a');
  m.box([0,0.72,0],[1.5,0.1,0.85],w);for(const sz of[-1,1])m.box([0,0.86,sz*0.4],[1.5,0.22,0.06],w3);for(const sx of[-1,1])m.box([sx*0.72,0.86,0],[0.06,0.22,0.86],w3);
  for(const sz of[-1,1]){const c=[0.15,0.4,sz*0.5];for(let i=0;i<14;i++){const a=i/14*TAU2,b=(i+1)/14*TAU2;const p=(r,an,dz)=>[c[0]+Math.cos(an)*r,c[1]+Math.sin(an)*r,c[2]+dz];
      m.quad(p(0.4,a,-0.05),p(0.4,b,-0.05),p(0.4,b,0.05),p(0.4,a,0.05),w2);m.quad(p(0.4,a,sz*0.05),p(0.4,b,sz*0.05),p(0.3,b,sz*0.05),p(0.3,a,sz*0.05),w2)}
    m.box([c[0],c[1],c[2]+sz*0.05],[0.62,0.05,0.04],w2);m.box([c[0],c[1],c[2]+sz*0.05],[0.05,0.62,0.04],w2);m.ico([c[0],c[1],c[2]+sz*0.05],0.07,w2,0,1,[4,6])}
  m.box([0.15,0.4,0],[0.06,0.06,1.0],w2);
  for(const sz of[-1,1])m.box([-1.05,0.82,sz*0.3],[0.7,0.06,0.06],w2);m.box([-1.38,0.82,0],[0.06,0.06,0.66],w3);
  m.box([0.68,0.36,0],[0.08,0.7,0.08],w2);
  // awning posts + canvas
  for(const sx of[-1,1])for(const sz of[-1,1])m.box([sx*0.68,1.35,sz*0.38],[0.05,1.1,0.05],w2);
  for(let i=0;i<6;i++){const x0=-0.8+i*0.267;m.quad([x0,1.92,-0.5],[x0,1.92,0.5],[x0+0.267,1.92,0.5],[x0+0.267,1.92,-0.5],i%2?hx('#f4f0e6'):hx('#d84a3a'))}
  for(let i=0;i<6;i++){const x0=-0.8+i*0.267;for(const sz of[-1,1])m.quad([x0,1.92,sz*0.5],[x0,1.75,sz*0.5],[x0+0.267,1.75,sz*0.5],[x0+0.267,1.92,sz*0.5],i%2?hx('#f4f0e6'):hx('#d84a3a'))}
  pixText(m,'BREAD',[0,0.85,-0.44],0.03,hx('#fff2c8'),-1,0.02)},0.0);
const PUDDLE=um(m=>{const n=28;for(let i=0;i<n;i++){const a=i/n*TAU2,b=(i+1)/n*TAU2;const r=a2=>1+0.18*Math.sin(a2*3+1)+0.1*Math.sin(a2*5);m.tri([0,0,0],[Math.cos(b)*r(b),0,Math.sin(b)*r(b)*0.7],[Math.cos(a)*r(a),0,Math.sin(a)*r(a)*0.7],hx('#4a3220'))}
  for(let i=0;i<n;i++){const a=i/n*TAU2,b=(i+1)/n*TAU2;const r=a2=>1+0.18*Math.sin(a2*3+1)+0.1*Math.sin(a2*5);m.quad([Math.cos(a)*r(a),0,Math.sin(a)*r(a)*0.7],[Math.cos(b)*r(b),0,Math.sin(b)*r(b)*0.7],[Math.cos(b)*r(b)*1.15,-0.02,Math.sin(b)*r(b)*0.8],[Math.cos(a)*r(a)*1.15,-0.02,Math.sin(a)*r(a)*0.8],hx('#6a4a2e'))}});
const GTRUCK=um(m=>{const g=hx('#e8b52a'),g2=hx('#f6d466'),ch=hx('#c8ccd4'),bk=hx('#1a1a1e');
  // cargo box (x from -3 to 1.2), cab x 1.3..3.1
  m.box([-0.9,2.1,0],[4.2,2.6,2.4],g,0,0,g2);m.box([-0.9,0.75,0],[4.4,0.18,2.2],hx('#3a3a40'));
  for(const sz of[-1,1])for(let i=0;i<5;i++)m.box([-2.9+i*1.0,2.1,sz*1.205],[0.06,2.5,0.02],hx('#d8a020'));
  m.box([2.15,1.55,0],[1.6,1.6,2.3],g,0,0,g2);m.box([3.15,1.05,0],[0.6,0.7,2.2],g);
  m.box([2.62,2.0,0],[0.62,0.7,2.1],hx('#2a3a50'),MAT.glass);for(const sz of[-1,1])m.box([2.2,1.95,sz*1.16],[0.8,0.6,0.02],hx('#2a3a50'),MAT.glass);
  m.box([3.48,0.75,0],[0.14,0.22,2.3],ch);m.box([3.46,1.05,0],[0.04,0.4,1.4],ch);for(const sz of[-1,1])m.box([3.47,1.1,sz*0.85],[0.05,0.2,0.3],[1,1,0.85],MAT.emis);
  for(const[x]of[[-2.2],[-1.0],[2.4]])for(const sz of[-1,1]){const c=[x,0.52,sz*1.0];for(let i=0;i<18;i++){const a=i/18*TAU2,b=(i+1)/18*TAU2;const p=(r,an,dz)=>[c[0]+Math.cos(an)*r,c[1]+Math.sin(an)*r,c[2]+dz];m.quad(p(0.5,a,-0.18),p(0.5,b,-0.18),p(0.5,b,0.18),p(0.5,a,0.18),bk);m.quad(p(0.5,a,sz*0.18),p(0.5,b,sz*0.18),p(0.25,b,sz*0.19),p(0.25,a,sz*0.19),bk);m.tri([c[0],c[1],c[2]+sz*0.19],p(0.25,b,sz*0.19),p(0.25,a,sz*0.19),ch)}}
  // letters on -z side (camera side), read along -x
  pixText(m,"LEO'S",[-0.9,2.75,-1.23],0.075,hx('#7a3a12'),-1,0.04);pixText(m,'BAKERY',[-0.9,2.05,-1.23],0.075,hx('#7a3a12'),-1,0.04);
  pixText(m,'200 SHOPS',[-0.9,1.32,-1.23],0.042,hx('#ffffff'),-1,0.03);
  pixText(m,"LEO'S",[-0.9,2.75,1.23],0.075,hx('#7a3a12'),1,0.04);pixText(m,'BAKERY',[-0.9,2.05,1.23],0.075,hx('#7a3a12'),1,0.04);pixText(m,'200 SHOPS',[-0.9,1.32,1.23],0.042,hx('#ffffff'),1,0.03)},0.0);
const BAG=um(m=>{blob(m,[0,0.2,0],0.24,p=>mix3(hx('#c8a050'),hx('#e8c870'),clamp(p[1]*2,0,1)),4,1.1,[7,10]);m.prism([0,0.38,0],0.1,0.14,0.12,10,hx('#e8c870'));m.prism([0,0.4,0],0.105,0.105,0.03,10,hx('#8a5a2a'))},0.4);
const COIN=um(m=>m.prism([0,-0.01,0],0.05,0.05,0.02,12,hx('#ffd23a')));
const BRICKDOME=um(m=>{const la=8,lo=18;for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const P=(ii,jj)=>{const th=ii/la*Math.PI/2,ph=jj/lo*TAU2;return[Math.sin(th)*Math.cos(ph),Math.cos(th)*0.9,Math.sin(th)*Math.sin(ph)]};
  const col=((i+(j%2))%2)?hx('#b8502e'):hx('#a8442a');if(j>=3&&j<6&&i>=4)continue;if(i===0)m.tri(P(i,j),P(i+1,j+1),P(i+1,j),col);else m.quad(P(i,j),P(i,j+1),P(i+1,j+1),P(i+1,j),col)}
  m.prism([0,-0.4,0],1.05,1.05,0.4,18,hx('#9a8a7a'))},0.3);
const KITCHEN=um(m=>{const S=4.5,Hh=3.4;// floor checker
  for(let i=-6;i<6;i++)for(let j=-6;j<6;j++){const c=(i+j)%2?hx('#e8e2d6'):hx('#3a3a44');m.quad([i*0.6,0,j*0.6],[i*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,j*0.6],c)}
  const wall=hx('#e9dcc0');m.quad([-S,0,3.0],[-S,Hh,3.0],[S,Hh,3.0],[S,0,3.0],wall);m.quad([-3.2,0,-S],[-3.2,Hh,-S],[-3.2,Hh,S],[-3.2,0,S],wall);m.quad([3.2,0,S],[3.2,Hh,S],[3.2,Hh,-S],[3.2,0,-S],wall);m.quad([-S,0,-3.6],[S,0,-3.6],[S,Hh,-3.6],[-S,Hh,-3.6],wall);
  m.quad([-S,Hh,-S],[S,Hh,-S],[S,Hh,S],[-S,Hh,S],hx('#d8ccb0'));
  for(let i=0;i<14;i++)for(let j=0;j<4;j++)m.box([-3.1+i*0.45+(j%2)*0.22,1.0+j*0.2,2.98],[0.42,0.17,0.02],hx('#f4f2ec'));
  // window with city
  m.box([-1.6,2.1,2.97],[1.6,1.1,0.04],hx('#1a2440'),MAT.emis);m.box([-1.6,2.1,2.94],[1.7,0.08,0.06],hx('#6a4a2a'));m.box([-1.6,2.1,2.94],[0.08,1.2,0.06],hx('#6a4a2a'));
  const r=rngG(9);for(let i=0;i<9;i++){const x=-2.3+i*0.16,h=0.2+r()*0.5;m.box([x,1.55+h/2,2.95],[0.14,h,0.02],hx('#0e1424'));for(let k=0;k<3;k++)if(r()<0.6)m.box([x+(r()-0.5)*0.06,1.6+r()*h*0.8,2.94],[0.025,0.03,0.01],hx('#ffd870'),MAT.emis)}
  // counter
  m.box([0.6,0.47,1.6],[3.2,0.94,0.9],hx('#8a5a32'),0,0,hx('#c8a070'));m.box([0.6,0.95,1.6],[3.3,0.06,0.95],hx('#d8b888'));
  // shelf with flour
  m.box([1.6,2.2,2.85],[2.0,0.06,0.3],hx('#7a4e28'));for(let i=0;i<3;i++)m.box([1.0+i*0.5,2.45,2.85],[0.3,0.42,0.22],hx('#efe8d8'),0,0,hx('#e8e0cc'));
  // clock
  m.prism([2.2,2.0,2.96],0.28,0.28,0.001,20,hx('#f8f8f4'));},0.0);
const CLOCKRIM=um(m=>{for(let i=0;i<20;i++){const a=i/20*TAU2,b=(i+1)/20*TAU2;m.quad([Math.cos(a)*0.28,Math.sin(a)*0.28,0],[Math.cos(b)*0.28,Math.sin(b)*0.28,0],[Math.cos(b)*0.32,Math.sin(b)*0.32,-0.03],[Math.cos(a)*0.32,Math.sin(a)*0.32,-0.03],hx('#3a2a20'))}});
const DOUGH=um(m=>blob(m,[0,0,0],1,p=>hx('#f2e2c0'),5,0.55,[6,10]),0.5);
// ================= village world =================
const smst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
function hgt(x,z){if(Math.abs(x-400)<70&&z>-40&&z<80)return 0.06*(fbm(x*0.3,z*0.3,2)-0.5);const r=Math.hypot(x,z);return smst(40,160,r)*fbm(x*0.01+3,z*0.01+1,3)*40+0.08*(fbm(x*0.3,z*0.3,2)-0.5)}
function onRoad(x,z){return (x>4&&x<300&&Math.abs(z-0.5)<2.4)||(Math.abs(x-400)<2.6&&z>3)}
function gcol(x,z,h,ny){const n=fbm(x*0.08+7,z*0.08,3);const dirt=1-smst(11,14.5,Math.hypot(x,z*1.15)+2.5*(fbm(x*0.2,z*0.2,2)-0.5));const rd=onRoad(x,z)?1-smst(1.6,2.4,Math.abs(z-0.5)):0;
  const d=Math.max(dirt,rd);let g=mix3(hx('#5a9a38'),hx('#7ab448'),n);let c=mix3(g,mix3(hx('#b0905e'),hx('#c8aa78'),n),d);return c}
function vhouse(m,x,z,ry,w,d,h,sh,roof,door){const cs=Math.cos(ry),sn=Math.sin(ry);const P=p=>[x+p[0]*cs+p[2]*sn,p[1],z-p[0]*sn+p[2]*cs];
  const B=(c,s,col,mat)=>{// axis aligned in local; ry multiples of 90 assumed for box -> use box with ry
    m.box(P(c),s,col,mat,ry)};
  const cream=hx('#f2e4bc'),tim=hx('#5a3a22');const fz=-d/2-0.04;// front face local -z
  B([0,h/2,0],[w,h,d],cream);B([0,0.25,0],[w+0.1,0.5,d+0.1],hx('#9a8a78'));
  // timber
  for(const y of[0.5,h*0.52,h-0.08])B([0,y,fz],[w+0.04,0.16,0.1],tim);
  for(const xx of[-w/2+0.08,w/2-0.08,-w/6,w/6])B([xx,h/2,fz],[0.16,h,0.1],tim);
  for(const xx of[-w/2+0.08,w/2-0.08])for(const zz of[-d/2+0.08,d/2-0.08])B([xx,h/2,zz],[0.18,h,0.18],tim);
  // diagonal braces (as tubes)
  const tb=(a,b)=>tube(m,P(a),P(b),0.07,0.07,tim,4);tb([-w/2+0.1,h*0.53,fz],[-w/6,h-0.1,fz]);tb([w/2-0.1,h*0.53,fz],[w/6,h-0.1,fz]);tb([-w/2+0.1,0.5,fz],[-w/6,h*0.5,fz]);tb([w/2-0.1,0.5,fz],[w/6,h*0.5,fz]);
  // windows
  const win=(xx,yy)=>{B([xx,yy,fz-0.02],[0.9,1.0,0.06],hx('#ffe6a0'),MAT.win);B([xx,yy,fz-0.06],[0.08,1.0,0.04],tim);B([xx,yy,fz-0.06],[0.9,0.08,0.04],tim);B([xx,yy-0.55,fz-0.1],[1.1,0.1,0.18],tim);
    for(const s of[-1,1]){B([xx+s*0.62,yy,fz-0.05],[0.34,1.05,0.06],sh);for(let k=0;k<3;k++)B([xx+s*0.62,yy-0.35+k*0.35,fz-0.09],[0.3,0.04,0.02],V.sc(sh,0.7))}};
  win(-w/3,h*0.76);win(w/3,h*0.76);if(!door){win(-w/3,h*0.27);win(w/3,h*0.27)}else{win(-w/3+0.1,h*0.27)}
  if(door){B([w/6+0.55,1.0,fz-0.02],[1.0,2.0,0.08],hx('#6a3e22'));B([w/6+0.55,2.05,fz-0.05],[1.2,0.14,0.1],tim);B([w/6+0.85,1.0,fz-0.08],[0.08,0.08,0.06],hx('#d8b040'))}
  // roof (gable along local x)
  const ov=0.45,rh=h*0.55;const L=[-w/2-ov,h-0.05,-d/2-ov],Rr=[w/2+ov,h-0.05,-d/2-ov],L2=[-w/2-ov,h-0.05,d/2+ov],R2=[w/2+ov,h-0.05,d/2+ov],T1=[-w/2-ov,h+rh,0],T2=[w/2+ov,h+rh,0];
  const rc=roof,rc2=V.sc(roof,0.8);m.quad(P(L),P(T1),P(T2),P(Rr),rc);m.quad(P(R2),P(T2),P(T1),P(L2),rc2);
  // roof tiles rows
  for(let i=1;i<5;i++){const k=i/5;const a=lerp3(L,T1,k),b=lerp3(Rr,T2,k);tube(m,P(V.add(a,[0,0.02,-0.02])),P(V.add(b,[0,0.02,-0.02])),0.04,0.04,V.sc(roof,0.7),4);const a2=lerp3(L2,T1,k),b2=lerp3(R2,T2,k);tube(m,P(V.add(a2,[0,0.02,0.02])),P(V.add(b2,[0,0.02,0.02])),0.04,0.04,V.sc(roof,0.6),4)}
  for(const sx of[-1,1]){m.tri(P([sx*w/2,h,-d/2]),P([sx*w/2,h+rh*0.92,0]),P([sx*w/2,h,d/2]),cream);m.tri(P([sx*w/2,h,d/2]),P([sx*w/2,h+rh*0.92,0]),P([sx*w/2,h,-d/2]),cream)}
  B([w*0.25,h+rh*0.8,d*0.15],[0.6,1.6,0.6],hx('#9a4a32'));B([w*0.25,h+rh*0.8+0.8,d*0.15],[0.75,0.15,0.75],hx('#7a3a2a'))}
function pine(m,x,z,s,r){const y=hgt(x,z);m.prism([x,y,z],0.18*s,0.12*s,1.2*s,6,hx('#5a3a22'));const c1=hx('#2f6a3a'),c2=hx('#3f8a48');
  for(let i=0;i<4;i++){const yy=y+0.9*s+i*1.05*s;m.prism([x,yy,z],(1.7-i*0.33)*s,0,1.9*s,9,mix3(c1,c2,i/4))}}
function roundTree(m,x,z,s,seed){const y=hgt(x,z);tube(m,[x,y,z],[x,y+2.2*s,z],0.25*s,0.18*s,hx('#6a4228'),7);
  for(let i=0;i<5;i++){const a=i*1.3+seed;const c=[x+Math.cos(a)*1.0*s*(i?1:0),y+2.9*s+(i?0:0.7*s)+hsh(i,seed)*0.4*s,z+Math.sin(a)*1.0*s*(i?1:0)];blob(m,c,(i?1.25:1.6)*s,p=>mix3(hx('#3e8a36'),hx('#7ac04a'),clamp((p[1]-c[1])/(2*s)+0.5,0,1)),seed*3+i,0.9,[7,10])}}
let WORLD,BAKSIGN;{const m=new MB();
  terrain(m,-60,-60,60,60,90,hgt,gcol);terrain(m,345,-30,455,70,70,hgt,gcol);terrain(m,-1500,-1500,1500,1500,80,(x,z)=>hgt(x,z)-((Math.abs(x)<60&&Math.abs(z)<60)||(Math.abs(x-400)<55&&z>-30&&z<70)?0.4:0),gcol);
  vhouse(m,393,14,Math.PI/2,6.2,5,4.2,hx('#3a5a7a'),hx('#5a3a2a'),1);vhouse(m,407.5,22,-Math.PI/2,6.2,5,4.4,hx('#7a3a3a'),hx('#4a3a2a'),1);vhouse(m,393,30,Math.PI/2,6.2,5,4.0,hx('#3a6a4a'),hx('#5a2a22'),0);vhouse(m,407.5,38,-Math.PI/2,6.2,5,4.2,hx('#3a5a7a'),hx('#4a3a2a'),0);
  for(const[x,z,s]of[[395,46,1.2],[405,50,1.0],[392,6,1.0],[409,8,1.1]])roundTree(m,x,z,s,x+z);
  const SH=[hx('#c03a2a'),hx('#3a7a3a'),hx('#2a5a9a'),hx('#c03a2a'),hx('#3a7a3a')];const RF=[hx('#8a3a22'),hx('#7a3020'),hx('#6a3a2a'),hx('#8a4a2a')];
  // back row (facing -z toward camera)
  vhouse(m,0,12,0,7.2,5,4.6,hx('#c03a2a'),hx('#8a3a22'),1);// bakery
  vhouse(m,-9,13,0.12,6.2,5,4.2,SH[1],RF[1],1);vhouse(m,9.5,13.2,-0.15,6.4,5,4.4,SH[2],RF[2],1);
  vhouse(m,-17,10,0.5,6,5,4.0,SH[0],RF[3],0);vhouse(m,17.5,9,-0.6,6,5,4.2,SH[1],RF[0],1);
  // side rows
  vhouse(m,-14,-2,Math.PI/2,6.4,5,4.2,SH[2],RF[0],1);vhouse(m,-15,-10,Math.PI/2,6,5,4.0,SH[0],RF[2],0);
  vhouse(m,15,-6,-Math.PI/2,6.4,5,4.4,SH[0],RF[1],1);
  // back houses (behind camera)
  vhouse(m,-6,-17,Math.PI,6.4,5,4.2,SH[1],RF[2],1);vhouse(m,6,-18,Math.PI,6.4,5,4.0,SH[2],RF[0],0);
  // bakery sign
  m.box([1.75,2.62,9.38],[2.5,0.66,0.1],hx('#7a3a1a'));m.box([1.75,2.62,9.36],[2.62,0.76,0.06],hx('#4a2a14'));pixText(m,'BAKERY',[1.75,2.62,9.3],0.06,hx('#fff0c0'),-1,0.04);
  // stone oven dome right of bakery
  // barrels, crates, well
  for(const[x,z]of[[-4.2,9.0],[-4.9,9.4],[6.6,8.4],[-12,4],[11.5,3.5]]){const y=hgt(x,z);m.prism([x,y,z],0.42,0.42,0.95,12,hx('#8a5a30'));for(const yy of[0.15,0.8])m.prism([x,y+yy,z],0.44,0.44,0.07,12,hx('#4a4a4a'))}
  for(const[x,z]of[[6.3,9.2],[-12.6,3.2]])m.box([x,0.35,z],[0.7,0.7,0.7],hx('#a8743e'),0,0,hx('#b8844e'));
  // well
  {const x=-7.5,z=2.5;m.prism([x,0,z],1.0,1.0,0.8,14,hx('#8a8a88'));m.prism([x,0.8,z],1.05,1.05,0.1,14,hx('#6a6a68'));m.prism([x,0.02,z],0.85,0.85,0.8,14,hx('#2a3a4a'));for(const s of[-1,1])m.box([x+s*0.9,1.4,z],[0.12,1.3,0.12],hx('#6a4228'));m.prism([x,2.0,z],0.0001,0.0001,0,4,hx('#6a4228'));
    m.quad([x-1.3,2.0,z-0.8],[x-1.3,2.6,z],[x+1.3,2.6,z],[x+1.3,2.0,z-0.8],hx('#8a3a22'));m.quad([x+1.3,2.0,z+0.8],[x+1.3,2.6,z],[x-1.3,2.6,z],[x-1.3,2.0,z+0.8],hx('#7a3020'))}
  // fences along road
  for(let i=0;i<14;i++){const x=16+i*2.2;for(const zz of[-2.6,3.6]){m.box([x,0.5,zz],[0.14,1.0,0.14],hx('#8a6a42'));m.box([x+1.1,0.7,zz],[2.2,0.1,0.08],hx('#9a7a4a'));m.box([x+1.1,0.35,zz],[2.2,0.1,0.08],hx('#9a7a4a'))}}
  // trees
  const r=rngG(7);
  for(let i=0;i<70;i++){const a=r()*TAU2,d=24+r()*55;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z)||Math.abs(z-0.5)<6&&x>0)continue;pine(m,x,z,1.0+r()*0.9,r)}
  for(const[x,z,s]of[[-5,16,1.1],[5,17,1.2],[-13,15,1.0],[13.5,15.5,1.2],[-20,3,1.1],[-19,-15,1.1],[19,-14,1.2],[-3.5,-14,0.9],[13,-16,1.0],[24,8,1.3],[-24,10,1.2]])roundTree(m,x,z,s,x*3+z);
  // bushes
  for(let i=0;i<30;i++){const a=r()*TAU2,d=14+r()*8;const x=Math.cos(a)*d,z=Math.sin(a)*d*0.95;if(onRoad(x,z))continue;blob(m,[x,hgt(x,z)+0.3,z],0.6+r()*0.4,p=>mix3(hx('#3a7a30'),hx('#6aaa40'),clamp(p[1],0,1)),i+50,0.75,[6,9])}
  // grass tufts
  for(let i=0;i<2200;i++){const a=r()*TAU2,d=12+Math.pow(r(),0.8)*30;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z))continue;const y=hgt(x,z);const h=0.15+r()*0.2,yaw=r()*TAU2,w=0.04;const cb=hx('#4a8a2a'),ct=hx('#a8d060');
    m.tri([x+Math.cos(yaw)*w,y,z+Math.sin(yaw)*w],[x-Math.cos(yaw)*w,y,z-Math.sin(yaw)*w],[x+(r()-0.5)*0.1,y+h,z+(r()-0.5)*0.1],[cb,cb,ct])}
  // flowers
  for(let i=0;i<160;i++){const a=r()*TAU2,d=13+r()*14;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z))continue;m.ico([x,hgt(x,z)+0.18,z],0.07,[hx('#ff5a6a'),hx('#ffe04a'),hx('#ffffff'),hx('#b070ff')][i%4],0,1,[3,5])}
  WORLD=m.build(0.0)}
const OVEN=BRICKDOME;
// ================= lamp props =================
const LAMPPOST=um(m=>{const ir=hx('#1c1c22'),ir2=hx('#2a2a32');m.prism([0,0,0],0.22,0.18,0.25,8,ir);m.prism([0,0.25,0],0.08,0.06,3.0,8,ir2);m.prism([0,3.25,0],0.13,0.13,0.08,8,ir);
  // lantern frame
  for(const sx of[-1,1])for(const sz of[-1,1])m.box([sx*0.19,3.62,sz*0.19],[0.04,0.62,0.04],ir);m.prism([0,3.92,0],0.32,0.0,0.32,4,ir,0,Math.PI/4);m.box([0,3.33,0],[0.44,0.06,0.44],ir);m.prism([0,4.22,0],0.04,0.0,0.12,6,ir)});
const LGLASS=um(m=>m.box([0,3.62,0],[0.34,0.56,0.34],[1,1,1],MAT.emis));
const LGLOW=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[8,12]));
const POOL=um(m=>{const n=32;for(let i=0;i<n;i++){const a=i/n*TAU2,b=(i+1)/n*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1],MAT.emis)}});
const POLE=um(m=>{tube(m,[0,0,0],[0,2.6,0],0.025,0.02,hx('#3a2a1e'),6);tube(m,[0,2.6,0],[0.12,2.75,0],0.02,0.02,hx('#2a2a2a'),5);m.box([0.13,2.72,0],[0.06,0.1,0.06],hx('#3a3a3a'))});
const BEDROOM=um(m=>{const S=4.5,Hh=3.0,wall=hx('#3a4a78'),wall2=hx('#34426c');
  for(let i=-5;i<5;i++)for(let j=-5;j<5;j++)m.quad([i*0.6,0,j*0.6],[i*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,j*0.6],(i+j)%2?hx('#7a5a3e'):hx('#6e5036'));
  // back wall z=3 with window hole x -0.8..0.8, y 1.0..2.3
  const wz=3.0;m.quad([-S,0,wz],[-S,Hh,wz],[-0.8,Hh,wz],[-0.8,0,wz],wall);m.quad([0.8,0,wz],[0.8,Hh,wz],[S,Hh,wz],[S,0,wz],wall);m.quad([-0.8,2.3,wz],[-0.8,Hh,wz],[0.8,Hh,wz],[0.8,2.3,wz],wall);m.quad([-0.8,0,wz],[-0.8,1.0,wz],[0.8,1.0,wz],[0.8,0,wz],wall);
  m.quad([-3.0,0,-S],[-3.0,Hh,-S],[-3.0,Hh,S],[-3.0,0,S],wall2);m.quad([3.0,0,S],[3.0,Hh,S],[3.0,Hh,-S],[3.0,0,-S],wall2);m.quad([-S,0,-3.4],[S,0,-3.4],[S,Hh,-3.4],[-S,Hh,-3.4],wall);m.quad([-S,Hh,-S],[S,Hh,-S],[S,Hh,S],[-S,Hh,S],hx('#2c3658'));
  // window frame + sill
  const fr=hx('#e8e4dc');m.box([0,1.0,2.95],[1.8,0.1,0.25],fr);m.box([0,2.3,2.97],[1.8,0.1,0.1],fr);for(const sx of[-1,1])m.box([sx*0.85,1.65,2.97],[0.1,1.4,0.1],fr);m.box([0,1.65,2.97],[0.06,1.3,0.06],fr);
  // curtains
  for(const sx of[-1,1])for(let k=0;k<4;k++)m.box([sx*(1.0+k*0.12),1.6,2.88],[0.12,2.2,0.08+0.05*(k%2)],hx('#7a2a3a'));
  // bed
  m.box([-1.9,0.25,1.2],[1.6,0.5,2.6],hx('#5a3a24'));m.box([-1.9,0.6,1.2],[1.5,0.22,2.5],hx('#e8e8f0'));m.box([-1.9,0.74,0.6],[1.52,0.12,1.4],hx('#c84a4a'));m.box([-1.9,0.78,2.2],[1.0,0.16,0.45],hx('#f4f4f8'));m.box([-1.9,0.9,2.5],[1.6,1.3,0.12],hx('#5a3a24'));
  // desk + posters + door
  m.box([2.0,0.75,1.9],[1.6,0.08,0.9],hx('#8a6a4a'));for(const sx of[1.3,2.7])m.box([sx,0.37,1.9],[0.08,0.74,0.8],hx('#6a4a2a'));m.box([2.0,0.95,2.1],[0.5,0.3,0.05],hx('#2a2a30'));
  m.box([-1.9,2.0,2.98],[0.7,0.9,0.02],hx('#e8b84a'));m.box([2.0,2.0,2.98],[0.8,0.6,0.02],hx('#4ab4a8'));
  m.box([0.8,1.05,-3.38],[1.0,2.1,0.04],hx('#4a3020'));m.box([1.15,1.05,-3.34],[0.08,0.08,0.06],hx('#c8a040'))});
const CEILLAMP=um(m=>{m.prism([0,2.9,0],0.02,0.02,0.1,6,hx('#222'));m.ico([0,2.75,0],0.18,[1,1,1],MAT.emis,0.7,[6,10])});
const SNOWF=um(m=>m.ico([0,0,0],1,[1,1,1],0,1,[3,5]));
const VO=[{"t": 0.4, "d": 2.143, "w": [["In", 0.43, 0.717], ["this", 0.717, 1.003], ["town,", 1.003, 1.29], ["there's", 1.48, 1.847], ["one", 1.847, 2.073], ["rule.", 2.073, 2.44]]}, {"t": 3.0, "d": 3.679, "w": [["Every", 3.03, 3.643], ["streetlamp", 3.643, 4.085], ["stays", 4.085, 4.358], ["on.", 4.358, 4.63], ["All", 5.02, 5.245], ["night.", 5.245, 5.47], ["No", 5.98, 6.137], ["matter", 6.137, 6.393], ["what.", 6.393, 6.55]]}, {"t": 7.6, "d": 4.77, "w": [["Seventy", 7.65, 8.213], ["years", 8.213, 8.463], ["ago,", 8.463, 8.87], ["an", 9.16, 9.382], ["old", 9.382, 9.604], ["man", 9.604, 9.826], ["lit", 9.826, 10.048], ["them,", 10.048, 10.4], ["every", 10.9, 11.37], ["single", 11.37, 11.71], ["evening.", 11.71, 12.18]]}, {"t": 12.9, "d": 4.122, "w": [["One", 12.93, 13.159], ["winter", 13.159, 13.531], ["night,", 13.531, 13.76], ["some", 14.06, 14.325], ["kids", 14.325, 14.59], ["blew", 14.59, 14.855], ["them", 14.855, 15.12], ["all", 15.12, 15.385], ["out,", 15.385, 15.65], ["just", 15.96, 16.148], ["to", 16.148, 16.336], ["laugh", 16.336, 16.524], ["at", 16.524, 16.712], ["him.", 16.712, 16.9]]}, {"t": 17.9, "d": 2.529, "w": [["He", 17.96, 18.154], ["walked", 18.154, 18.469], ["into", 18.469, 18.785], ["the", 18.785, 18.979], ["dark", 18.979, 19.293], ["to", 19.293, 19.487], ["light", 19.487, 19.771], ["them", 19.771, 19.965], ["again...", 19.965, 20.28]]}, {"t": 21.3, "d": 1.301, "w": [["and", 21.33, 21.51], ["he", 21.51, 21.689], ["never", 21.689, 21.981], ["came", 21.981, 22.16], ["back.", 22.16, 22.34]]}, {"t": 24.8, "d": 3.244, "w": [["Now,", 24.84, 25.41], ["when", 25.59, 25.794], ["a", 25.794, 25.998], ["lamp", 25.998, 26.202], ["goes", 26.202, 26.406], ["out,", 26.406, 26.61], ["he's", 26.9, 27.102], ["standing", 27.102, 27.43], ["under", 27.43, 27.758], ["it.", 27.758, 27.96]]}, {"t": 29.0, "d": 1.681, "w": [["And", 29.03, 29.239], ["every", 29.239, 29.711], ["time", 29.711, 30.02], ["it", 30.02, 30.23], ["flickers...", 30.23, 30.57]]}, {"t": 31.6, "d": 1.635, "w": [["he", 31.64, 31.866], ["gets", 31.866, 32.092], ["one", 32.092, 32.317], ["lamp", 32.317, 32.543], ["closer.", 32.543, 33.07]]}, {"t": 35.6, "d": 3.201, "w": [["Last", 35.63, 35.955], ["night,", 35.955, 36.28], ["the", 36.52, 36.733], ["lamps", 36.733, 36.946], ["on", 36.946, 37.159], ["my", 37.159, 37.372], ["street", 37.372, 37.585], ["started", 37.585, 37.931], ["to", 37.931, 38.304], ["flicker.", 38.304, 38.65]]}, {"t": 40.0, "d": 0.667, "w": [["Once.", 40.03, 40.56]]}, {"t": 42.0, "d": 0.618, "w": [["Twice.", 42.03, 42.5]]}, {"t": 43.8, "d": 2.764, "w": [["Then", 43.84, 44.106], ["the", 44.106, 44.372], ["lamp", 44.372, 44.638], ["outside", 44.638, 45.07], ["my", 45.07, 45.336], ["window", 45.336, 45.768], ["went", 45.768, 46.034], ["dark.", 46.034, 46.3]]}, {"t": 49.2, "d": 1.38, "w": [["When", 49.23, 49.452], ["it", 49.452, 49.674], ["turned", 49.674, 50.036], ["back", 50.036, 50.258], ["on...", 50.258, 50.48]]}, {"t": 51.5, "d": 0.815, "w": [["he", 51.55, 51.753], ["was", 51.753, 51.957], ["gone.", 51.957, 52.16]]}, {"t": 55.0, "d": 2.392, "w": [["So", 55.06, 55.303], ["who", 55.303, 55.546], ["just", 55.546, 55.79], ["turned", 55.79, 56.185], ["off", 56.185, 56.428], ["my", 56.428, 56.671], ["bedroom", 56.671, 57.067], ["light?", 57.067, 57.31]]}, {"t": 59.8, "d": 2.403, "w": [["Comment", 59.89, 60.246], ["a", 60.246, 60.464], ["candle,", 60.464, 60.82], ["to", 61.05, 61.232], ["keep", 61.232, 61.414], ["your", 61.414, 61.596], ["lamp", 61.596, 61.868], ["on.", 61.868, 62.05]]}];
// ================= THE LAMPLIGHTER: timeline =================
const EV={hook:[1.9,0.6],street:3.0,fb:7.6,light:[8.7,10.5,12.2],kids:12.9,ball:[13.6,14.6,15.6],leave:17.9,fbEnd:22.6,stat:24.8,fl:[25.8,29.9,32.5,34.4],bed:35.6,flk:[39.3,41.3],dark0:45.2,dark:46.0,on:50.2,relief:52.5,off:54.0,eyes:57.6,black:58.35,endc:58.6,loop:65.6};
const K=[400,0,0];
const VL=[[6,-1.9],[12,3.0],[18,-1.9],[24,3.0],[30,-1.9],[36,3.0],[42,-1.9],[-4.5,4.5],[3.8,3.8]];
const KL=[[0.6,6.5],[-1.8,12],[1.8,18],[-1.8,24],[1.8,30],[-1.8,36]];
const yawTo=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function arc(a,b,k,h){const p=lerp3(a,b,k);p[1]+=h*4*k*(1-k);return p}
function flick(t,t0,d){if(t<t0||t>=t0+d)return 1;const f=Math.floor((t-t0)*22);return (hsh(f,Math.floor(t0*10))<0.45)?1:0}
function scn(t){if(t>=EV.fb&&t<EV.fbEnd)return 'fb';if(t>=EV.bed&&t<EV.endc)return 'bed';return 'vil'}
const isFB=t=>t>=EV.fb&&t<EV.fbEnd;
// lamp states: returns array of brightness (0..1) for village lamps
function vlamps(t){const L=VL.map(()=>1);
  if(isFB(t)){for(let i=0;i<VL.length;i++)L[i]=0;for(let i=0;i<3;i++){if(t>=EV.light[i])L[i]=1;if(t>=EV.ball[2-i]+0.35)L[i]=0}return L}
  if(t<EV.street){const f=flick(t,EV.hook[0],EV.hook[1]);L[4]=f;return L}
  for(const f0 of EV.fl){const d=f0===EV.fl[0]?0.8:0.6;if(t>=f0&&t<f0+d){const f=flick(t,f0,d);for(let i=0;i<7;i++)L[i]=f0===EV.fl[0]?(i===5?f:1):f}}
  return L}
function ghostVil(t){// which lamp he stands under (index) or -1
  if(t<EV.street){if(t>=EV.hook[0]&&t<EV.hook[0]+EV.hook[1]+0.5&&flick(t,EV.hook[0],EV.hook[1]))return 4;return -1}
  if(t<EV.stat)return -1;let g=-1;if(t>=EV.fl[0]+0.8)g=5;if(t>=EV.fl[1]+0.6)g=4;if(t>=EV.fl[2]+0.6)g=3;if(t>=EV.fl[3]+0.6)g=2;
  for(const f0 of EV.fl){const d=f0===EV.fl[0]?0.8:0.6;if(t>=f0&&t<f0+d)return -1}return g}
function klamps(t){const L=KL.map(()=>1);for(const f0 of EV.flk)if(t>=f0&&t<f0+0.6){const f=flick(t,f0,0.6);for(let i=0;i<L.length;i++)L[i]=f}
  if(t>=EV.dark0&&t<EV.dark)L[0]=flick(t,EV.dark0,0.8);if(t>=EV.dark&&t<EV.on)L[0]=0;if(t>=EV.on&&t<EV.on+0.35)L[0]=flick(t,EV.on,0.35);return L}
function ghostK(t){if(t<EV.flk[0]+0.6)return -1;if(t<EV.flk[1])return 3;if(t<EV.flk[1]+0.6)return -1;if(t<EV.dark)return 1;if(t<EV.on)return 0;return -1}
function roomLight(t){if(t<EV.off)return 1;if(t<EV.off+0.12)return 0.5;return 0}
// ---------- characters ----------
let KIDR=null,GHOSTR=null,OLDR=null,KIDSR=[];
function oldSt(t){// flashback old man
  const P=[[6.0,0,-0.9],[12.0,0,2.0],[18.0,0,-0.9]];const arrive=[EV.fb,EV.light[0]+0.9,EV.light[1]+0.9];
  let st;if(t<EV.light[2]+0.6){let i=0;for(let k=1;k<3;k++)if(t>=EV.light[k-1]+0.35)i=k;
    const walkStart=i>0?EV.light[i-1]+0.35:EV.fb,walkEnd=i>0?arrive[i]:EV.fb;const from=i>0?P[i-1]:[3.5,0,0.3];
    if(t<walkEnd){const k=seg(t,walkStart,walkEnd);st={pos:lerp3(from,P[i],ease(k)),ry:yawTo(from,P[i]),walk:{ph:t*6,amp:0.4}}}
    else{const lam=VL[i];st={pos:P[i],ry:yawTo(P[i],[lam[0],0,lam[1]]),walk:{ph:0,amp:0}};const k=seg(t,EV.light[i]-0.55,EV.light[i]-0.15)*(1-seg(t,EV.light[i]+0.15,EV.light[i]+0.4));st.aR={f:2.7*k+0.6*(1-k),s:-0.1};st.aL={f:0.3}}}
  else if(t<EV.leave){st={pos:[18,0,-0.9],ry:yawTo([18,0,-0.9],[10,0,1.0]),aR:{f:0.6},face:{}};if(t>=EV.ball[0])st.ry=yawTo([18,0,-0.9],[10.5,0,1.2]);if(t>=EV.ball[2]+0.5)st.face={mouth:'sad',brow:'sad',eyes:'open'}}
  else{const k=seg(t,EV.leave,EV.fbEnd);st={pos:[18+k*22,0,0.6-0.4*k],ry:Math.PI/2,walk:{ph:t*5,amp:0.35},aR:{f:0.6},face:{mouth:'sad',brow:'sad'}}}
  st.lean=0.18;st.head={p:-0.1};st.face=st.face||{mouth:'flat',eyes:'open'};return st}
function kidsSt(t){const out=[];if(t<EV.kids)return out;const base=[[9.6,0,0.2],[10.6,0,1.4],[11.2,0,-0.4]];const looks=['v3','f1','f2'];
  base.forEach((p,i)=>{const k=seg(t,EV.kids,EV.kids+0.9);const from=[p[0]-6,0,p[2]];const st={pos:lerp3(from,p,ease(k)),ry:Math.PI/2,walk:{ph:t*9,amp:k<1?0.5:0}};
    const tb=EV.ball[i];const lam=VL[2-i];if(k>=1)st.ry=yawTo(p,[lam[0],0,lam[1]]);const th=seg(t,tb-0.35,tb-0.05)*(1-seg(t,tb+0.1,tb+0.4));st.aR={f:2.6*th,s:-0.2};
    if(t>=tb+0.3){Object.assign(st,{bob:Math.abs(Math.sin(t*14+i))*0.04,lean:-0.12,head:{p:-0.2},face:{eyes:'happy',mouth:'laugh',open:0.6}})}else st.face={mouth:'smirk'};
    if(t>=EV.leave+1.2){st.ry=yawTo(p,[30,0,0.5]);st.face={mouth:'o',eyes:'wide'};st.bob=0}
    out.push([looks[i],st])});return out}
function kidSt(t){const P=[K[0]-0.35,0,2.35];const st={pos:P,ry:0,face:{mouth:'flat',eyes:'open',brow:'up'},aL:{f:0.45},aR:{f:0.45},head:{p:0}};
  if(t>=EV.flk[0])st.face={mouth:'o',eyes:'wide',open:0.7,brow:'up'};
  if(t>=EV.dark0)st.face={mouth:'o',eyes:'wide',open:1.1,brow:'up',sweat:1};
  if(t>=EV.relief)st.face={mouth:'flat',eyes:'closed',brow:'sad'};
  if(t>=EV.relief+1.0)st.face={mouth:'smile',eyes:'open',brow:0};
  if(t>=EV.off+0.3)st.face={mouth:'o',eyes:'wide',open:0.6,brow:'up',look:[0.8,0]};
  if(t>=EV.eyes-0.1)st.face={mouth:'o',eyes:'wide',open:1.3,brow:'up',sweat:1,look:[0,0]};
  st.bob=t>=EV.dark0&&t<EV.on?Math.abs(Math.sin(t*30))*0.008:0;return st}
// ---------- items ----------
function lampItems(items,list,state,off){list.forEach((l,i)=>{const p=[l[0]+off[0],0,l[1]+off[2]];items.push({mesh:LAMPPOST,M:M4.trs(p,0,0,0,1)});const b=state[i];
  items.push({mesh:LGLASS,M:M4.trs(p,0,0,0,1),tint:b>0?[1,0.82,0.45]:[0.08,0.07,0.06],tintAmt:1});
  if(b>0){items.push({mesh:LGLOW,M:M4.trs([p[0],3.62,p[2]],0,0,0,0.75),tint:[1,0.7,0.3],tintAmt:1,alpha:0.16,add:1,noShadow:true});items.push({mesh:POOL,M:M4.trs([p[0],0.03,p[2]],0,0,0,2.6),tint:[1,0.6,0.3],tintAmt:1,alpha:0.13,add:1,noShadow:true});items.push({mesh:POOL,M:M4.trs([p[0],0.035,p[2]],0,0,0,1.4),tint:[1,0.7,0.4],tintAmt:1,alpha:0.12,add:1,noShadow:true})}})}
function ghostAt(items,p,face,noEyes,sc){const st={pos:p,ry:face,sc:sc||1,face:{eyes:noEyes?'void':'ember',mouth:'none'},aL:{f:0.05,s:-0.02},aR:{f:0.25,s:-0.02},head:{p:0.08}};const r=blocky(LOOK.ghost,st,items);
  items.push({mesh:POLE,M:mm(M4.trs(r.hR,face,0,0,1),M4.trs([0,-1.6,0],0,0,0,1.25))});return r}
function snow(items,t,c){for(let i=0;i<160;i++){const x=c[0]-9+((hsh(i,1)*18+Math.sin(t*0.6+i)*0.4)),z=c[2]-6+hsh(i,2)*16,y=((hsh(i,3)*7-t*0.9)%7+7)%7;items.push({mesh:SNOWF,M:M4.trs([x,y,z],0,0,0,0.028),tint:[1,1,1],tintAmt:1,noShadow:true})}}
function fgItems(t){const items=[{mesh:WORLD}];const S=scn(t);KIDR=null;GHOSTR=null;OLDR=null;KIDSR=[];
  if(S==='bed'){items.push({mesh:BEDROOM,M:M4.trs(K,0,0,0,1)});const rl=roomLight(t);items.push({mesh:CEILLAMP,M:M4.trs(K,0,0,0,1),tint:rl>0?[1,0.92,0.75]:[0.1,0.1,0.1],tintAmt:1});
    lampItems(items,KL,klamps(t),K);const g=ghostK(t);if(g>=0){const l=KL[g];GHOSTR=ghostAt(items,[K[0]+l[0]*0.75,0,l[1]-0.6],Math.PI)}
    KIDR=blocky(LOOK.kid,kidSt(t),items);
    if(t>=EV.off+0.6){GHOSTR=ghostAt(items,[K[0]-0.25,0,1.05+Math.min(0.2,(t-EV.off)*0.04)],0,t<EV.eyes,0.8);if(t<EV.eyes)GHOSTR=null}
    return items}
  lampItems(items,VL,vlamps(t),[0,0,0]);
  if(S==='fb'){snow(items,t,camAt(t).at);const o=oldSt(t);OLDR=blocky(LOOK.old,o,items);const pm=mm(M4.trs(OLDR.hR,o.ry,0,0,1),M4.trs([0,-1.2,0],0,0,0,1));items.push({mesh:POLE,M:pm});
    const tip=tp(pm,[0.13,2.72,0]);OLDR.tip=tip;const fl=t<EV.leave?1:1-seg(t,EV.leave+2.5,EV.fbEnd-0.5);if(fl>0)items.push({mesh:UEMIS,M:M4.trs(tip,0,0,0,0.06*(1+0.2*Math.sin(t*30))),tint:[1,0.7,0.25],tintAmt:1});
    for(const[k,st]of kidsSt(t)){KIDSR.push(blocky(LOOK[k],st,items))}
    // snowballs
    for(let i=0;i<3;i++){const tb=EV.ball[i];if(t>=tb-0.05&&t<tb+0.35){const kp=[[9.6,0,0.2],[10.6,0,1.4],[11.2,0,-0.4]][i];const lam=VL[2-i];const k=seg(t,tb-0.05,tb+0.35);items.push({mesh:USPH,M:M4.trs(arc([kp[0],1.8,kp[2]],[lam[0],3.62,lam[1]],k,1.2),0,0,0,0.09),tint:[1,1,1],tintAmt:1})}
      const kp2=t-tb-0.35;if(kp2>0&&kp2<1.4){const lam=VL[2-i];for(let j=0;j<6;j++){const kk=(kp2*0.8+j/6)%1;items.push({mesh:PUFF,M:M4.trs([lam[0]+Math.sin(j)*0.15,3.7+kk*1.4,lam[1]],j,0,0,0.08+kk*0.2),tint:[0.6,0.6,0.62],tintAmt:0.6,alpha:(1-kk)*0.6*clamp(1.4-kp2,0,1),noShadow:true})}}}
    return items}
  const g=ghostVil(t);if(g>=0){const l=VL[g];const p=g>=7?[l[0],0,l[1]-0.6]:[l[0],0,l[1]+(l[1]>0?-0.6:0.6)];GHOSTR=ghostAt(items,p,g>=7?Math.PI:-Math.PI/2)}
  if(t>=EV.endc)snow(items,t,[10,0,0.5]);
  return items}
// ---------- environment ----------
function envBase(){return{sun:[-0.4,0.55,0.6],sunCol:hx('#5a66a8'),sky:hx('#2a3466'),gnd:hx('#1a2028'),fog:hx('#1c2340'),fogD:90,zen:hx('#04050f'),hor:hx('#26305a'),stars:1,night:0.35,emis:1.3,ground:1,sunSize:2.5,fillD:[0.3,0.5,-1],fillC:[0.1,0.11,0.2]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_N=envBase();
const E_FB=Object.assign(envBase(),{sunCol:hx('#8a7a9a'),sky:hx('#4a4a6a'),fog:hx('#4a4a5e'),fogD:70,zen:hx('#2a2a40'),hor:hx('#6a6070'),stars:0,fillC:[0.2,0.2,0.24],night:0.2});
const E_ROOM=Object.assign(envBase(),{sun:[0.3,0.8,-0.5],sunCol:hx('#7a7068'),fillC:[0.36,0.33,0.32],fillD:[0,0.3,-1],fogD:120});
const E_DARK=Object.assign(envBase(),{sun:[0.2,0.4,-1],sunCol:hx('#3a4670'),fillC:[0.16,0.18,0.28],fillD:[0,0.3,-1],fogD:120});
function envAt(t){const S=scn(t);if(S==='fb'){return E_FB}if(S==='bed'){const rl=roomLight(t);let e=mixEnv(E_DARK,E_ROOM,rl);if(t>=EV.dark0&&t<EV.on+0.4){const L=klamps(t)[0];e=mixEnv(e,E_DARK,(1-L)*0.25)}return e}return E_N}
// ---------- camera ----------
const SH=[
  [0,[2.6,1.7,0.6],[26,2.2,0.6],[2.6,1.7,0.6],[24,2.1,0.6],0.55],
  [EV.street,[3.6,1.35,0.3],[24,2.4,0.8],[8.0,1.5,0.6],[28,2.2,0.6],0.9],
  [EV.fb,[8.2,1.9,-3.6],[5.6,2.3,-0.9],[8.0,1.9,-3.4],[5.8,2.4,-1.0],0.95],
  [EV.light[0]+0.6,null],
  [EV.kids,[5.0,2.2,-4.6],[13.5,2.0,0.6],[5.6,2.2,-4.2],[13.5,2.0,0.6],0.95],
  [EV.leave,[13.0,1.6,1.4],[30,1.4,0.4],[15.0,1.6,1.2],[34,1.4,0.4],0.9],
  [EV.fbEnd,[2.6,1.7,0.6],[24,2.0,0.6],[2.6,1.7,0.6],[24,2.0,0.6],0.7],
  [EV.stat,[2.6,1.7,0.6],[28,2.2,0.6],[2.6,1.7,0.6],[24,2.1,0.6],0.42],
  [EV.bed,[K[0]+0.55,1.7,0.5],[K[0]+0.1,1.65,12],[K[0]+0.5,1.68,0.8],[K[0]+0.0,1.7,12],0.95],
  [EV.flk[0]-0.2,[K[0]+0.25,1.64,1.2],[K[0]-0.6,1.95,20],[K[0]+0.22,1.64,1.3],[K[0]-0.8,1.95,14],0.5],
  [43.6,[K[0]-0.1,1.55,4.4],[K[0]-0.35,1.5,2.4],[K[0]-0.15,1.55,4.0],[K[0]-0.35,1.52,2.4],0.75],
  [EV.dark+0.7,[K[0]+0.35,1.85,1.2],[K[0]+0.5,2.0,6],[K[0]+0.36,1.85,1.5],[K[0]+0.5,2.05,6],0.72],
  [EV.relief,[K[0]-0.1,1.55,4.4],[K[0]-0.35,1.5,2.4],[K[0]-0.12,1.55,4.2],[K[0]-0.35,1.5,2.4],0.75],
  [EV.off,[K[0]-0.3,1.8,5.9],[K[0]-0.33,1.95,1.5],[K[0]-0.32,1.8,5.0],[K[0]-0.33,2.0,1.5],0.75],
  [EV.endc,[2.6,1.7,0.6],[20,2.4,0.6],[3.2,1.7,0.6],[20,2.4,0.6],0.8],
  [EV.loop,[2.6,1.7,0.6],[26,2.2,0.6],[2.6,1.7,0.6],[26,2.2,0.6],0.55],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){
  if(t>=EV.light[0]+0.6&&t<EV.kids){const o=oldSt(t).pos;return{eye:[o[0]+3.6,1.85,0.4],at:[o[0],2.0,o[2]],fov:0.95}}
  for(let i=0;i<SH.length-1;i++){const s=SH[i],n=SH[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SH[0][1],at:SH[0][2],fov:0.9}}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const S=scn(tt);
  const ctr=S==='bed'?null:{center:[cm.at[0]*0.3+cm.eye[0]*0.7,0,cm.at[2]*0.3+cm.eye[2]*0.7],radius:12};
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:3000},ctr,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.fl[0]+0.8,5,0.4);S(EV.dark,4,0.4);S(EV.eyes,14,0.7);if(t>=EV.dark&&t<EV.on)a+=0.8;return a}
// ================= overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.18?0.55+0.45*easeOut(k/0.18)+Math.sin(k/0.18*Math.PI)*0.16:1}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function pill(s,y,bg,size,al,x,fg){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(x||W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.9,w+68,size*1.8,size*0.5);ctx.fill();ctx.fillStyle=fg||'#ffffff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,4);ctx.restore()}
// captions: groups of up to 3 words, italic, key words green
const KEY=new Set(['RULE','STREETLAMP','NIGHT','SEVENTY','OLD','MAN','KIDS','LAUGH','DARK','NEVER','BACK','STANDING','UNDER','FLICKERS','CLOSER','LAMP','FLICKER','ONCE','TWICE','WINDOW','GONE','BEDROOM','LIGHT','CANDLE','ON']);
const GROUPS=[];{for(const c of VO){let g=null;for(const[w,a,b]of c.w){const clean=w.replace(/["]/g,'');if(!g||g.words.length>=3||g.len+clean.length>14||/[.,!?:]$/.test(g.words[g.words.length-1])){g={words:[],a,b,len:0};GROUPS.push(g)}g.words.push(clean);g.b=b;g.len+=clean.length+1}}}
function caption(t){for(let i=0;i<GROUPS.length;i++){const g=GROUPS[i];const nx=i+1<GROUPS.length?GROUPS[i+1].a:g.b+0.4;if(t>=g.a-0.05&&t<Math.min(nx,g.b+0.45)){
  const ws=g.words.map(w=>w.replace(/[.,:!?]+$/,'').replace(/\.\.\.$/,''));const size=104;ctx.save();ctx.font=`italic 900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;let tot=0;const wd=ws.map(w=>ctx.measureText(w).width);tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  const sc=Math.min(1,960/tot)*popS(t-g.a+0.05);ctx.translate(W/2,1250);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const key=KEY.has(w.toUpperCase().replace(/[^A-Z]/g,''));ctx.lineWidth=size*0.2;ctx.strokeStyle='#000';ctx.strokeText(w,x,0);ctx.fillStyle=key?'#86ff5c':'#ffffff';ctx.fillText(w,x,0);x+=wd[j]+sp});ctx.restore();return}}}
function lampGlows(t){const S=scn(t);let list,st,off;if(S==='bed'){list=KL;st=klamps(t);off=K}else{list=VL;st=vlamps(t);off=[0,0,0]}
  list.forEach((l,i)=>{if(st[i]<=0)return;const p=prj([l[0]+off[0],3.62,l[1]+off[2]]);if(!p||p[2]<0.3)return;const r=clamp(1400/p[2],30,520);glowAt(p,r,'255,190,110',0.55);glowAt(p,r*0.25,'255,240,210',0.8)})}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);
  lampGlows(tt);
  if(S==='fb'&&OLDR&&OLDR.tip){const fl=tt<EV.leave?1:1-seg(tt,EV.leave+2.5,EV.fbEnd-0.5);const p=prj(OLDR.tip);if(p&&fl>0){const r=clamp(500/p[2],20,200)*fl;glowAt(p,r,'255,180,90',0.7*fl)}}
  if(GHOSTR){const p=prj(GHOSTR.head);if(p&&p[2]>0.2){const r=clamp(160/p[2],8,90);glowAt([p[0],p[1]-r*0.3],r,'255,90,20',0.55)}}
  if(S==='bed'&&tt>=EV.eyes){const k=tt-EV.eyes;const p=prj(GHOSTR&&GHOSTR.head);if(p)glowAt([p[0],p[1]-20],200,'255,80,20',0.6*clamp(k*6,0,1))}
  // grade: darker vignette
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.22,W/2,H*0.5,H*0.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${S==='fb'?0.6:0.55})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(S==='fb'){// film grain + scratches
    ctx.save();ctx.globalAlpha=0.08;for(let i=0;i<220;i++){const x=hsh(i,Math.floor(tt*24))*W,y=hsh(i+999,Math.floor(tt*24))*H;ctx.fillStyle=i%2?'#fff':'#000';ctx.fillRect(x,y,3,3)}ctx.restore();
    if(hsh(Math.floor(tt*24),5)<0.3){ctx.fillStyle='rgba(255,255,240,0.25)';ctx.fillRect(hsh(Math.floor(tt*24),6)*W,0,2,H)}
    const k=tt-EV.fb;if(k<3.5)pill('70 YEARS AGO',300,'rgba(0,0,0,0.55)',52,clamp(k*4,0,1)*clamp((3.5-k)*3,0,1),W/2,'#f2e6c8')}
  // title + hook
  const titleOn=tt<EV.fb||(tt>=EV.stat&&tt<EV.bed)||tt>=EV.endc;if(titleOn)pill('THE LAMPLIGHTER',250,'rgba(0,0,0,0.82)',60,1,W/2,'#ffffff');
  if(tt<EV.street){const a=clamp(tt*5,0,1);pill('NEVER LET THE LAMPS GO OUT 🕯️',400,'rgba(210,30,30,0.92)',52,a)}
  if(tt>=EV.fbEnd-0.1&&tt<EV.stat+0.4){const k=tt-EV.fbEnd;pill('TODAY',300,'rgba(0,0,0,0.6)',52,clamp(k*4,0,1)*clamp((EV.stat+0.4-tt)*3,0,1))}
  if(S==='bed'&&tt<EV.bed+2.6){const k=tt-EV.bed;pill('LAST NIGHT · 3:07 AM',300,'rgba(0,0,0,0.6)',50,clamp(k*4,0,1)*clamp((EV.bed+2.6-tt)*3,0,1))}
  if(tt<EV.endc)caption(tt);
  // flicker darkening on whole screen during village flickers
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  const blk=(t0,d)=>{const k=tt-t0;if(k>-d&&k<d){ctx.fillStyle=`rgba(0,0,0,${1-Math.abs(k)/d})`;ctx.fillRect(0,0,W,H)}};
  blk(EV.fb,0.25);blk(EV.fbEnd,0.4);blk(EV.bed,0.3);flash(EV.fl[0]+0.8,0.25,0.15,'255,120,60');
  if(tt>=EV.black&&tt<EV.endc){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H)}
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(0,0,0,${1-k/0.25})`;ctx.fillRect(0,0,W,H)}}}
function drawEnd(t){const t0=EV.endc;const k=ease((t-t0)/0.4)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(0,0,0,${0.55*k})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);const p=popS(t-t0);ctx.scale(p,p);txt('Comment 🕯️',0,-70,110,'#ffd27a');txt('to keep your lamp on',0,60,fitSize('to keep your lamp on',960,72),'#ffffff');ctx.restore();
  if(t-t0>0.8){ctx.save();ctx.globalAlpha=k*clamp((t-t0-0.8)*3,0,1);txt('👇',W/2,900+Math.abs(Math.sin((t-t0)*4))*22,100,'#fff','center',900,false);pill('PART 2? 👀',1500,'rgba(210,30,30,0.92)',58,1);ctx.restore()}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;{const q=t0>=EV.loop?t0-EV.loop:t0;ctx.filter=scn(q)==='fb'?'sepia(0.8) saturate(0.8) contrast(1.15) brightness(1.0)':'saturate(1.08) contrast(1.08)'};ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
