const FPS=30,DUR=66,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
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
  const R=M4.trs([pos[0],pos[1]+bob*sc,pos[2]],st.ry||0,0,0,sc);
  const B=mm(R,M4.trs([0,0.8,0],0,st.lean||0,st.side||0,1));// body pivot at hip
  const Bt=mm(B,TT([0,-0.8,0],1));
  // legs
  for(const[sx,f]of[[1,lf],[-1,rf]]){const H=mm(R,M4.trs([sx*0.2,0.8,0],0,-f,0,1));part(items,H,TT([0,-0.32,0],[0.39,0.64,0.39]),L.pants);part(items,H,TT([0,-0.72,0.02],[0.4,0.16,0.44]),L.shoes)}
  // torso
  part(items,Bt,TT([0,1.2,0],[0.8,0.8,0.4]),L.shirt);
  if(L.hood)part(items,Bt,TT([0,1.08,0.205],[0.42,0.2,0.02]),V.sc(L.shirt,0.8));
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
    else if(eyes==='happy')items.push({mesh:E_HAPPY,M:mm(HC,M4.trs([sx*0.12,0.03,z],0,0,0,1)),tint:null});
    else if(eyes==='closed')items.push({mesh:E_CLOSED,M:mm(HC,M4.trs([sx*0.12,0.05,z],0,0,0,1)),tint:null});
    else if(eyes==='half'){items.push({mesh:E_DOT,M:mm(HC,M4.trs([ex,ey-0.01,z],0,0,0,[0.042,0.03,0.014])),tint:null})}
    // brows
    const br=F.brow;if(br||L.messy){const ang=br==='angry'?0.45*sx:br==='sad'?-0.4*sx:br==='up'?0.15*sx:0;part(items,HC,M4.trs([sx*0.12,0.15+(br==='up'?0.03:0),z+0.003],0,0,ang,[0.12,0.028,0.012]),DARK)}}
  // mouth
  const mo=F.mouth||'smile';const MY=-0.12;
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
function hgt(x,z){const r=Math.hypot(x,z);return smst(40,160,r)*fbm(x*0.01+3,z*0.01+1,3)*40+0.08*(fbm(x*0.3,z*0.3,2)-0.5)}
function onRoad(x,z){return (x>4&&Math.abs(z-0.5)<2.4)}
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
  terrain(m,-60,-60,60,60,90,hgt,gcol);terrain(m,-1500,-1500,1500,1500,80,(x,z)=>hgt(x,z)-(Math.abs(x)<60&&Math.abs(z)<60?0.3:0),gcol);
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
  for(const[x,z,s]of[[-5,16,1.1],[5,17,1.2],[-13,15,1.0],[13.5,15.5,1.2],[-20,3,1.1],[20,-1,1.0],[-19,-15,1.1],[19,-14,1.2],[-3.5,-14,0.9],[13,-16,1.0],[24,8,1.3],[-24,10,1.2]])roundTree(m,x,z,s,x*3+z);
  // bushes
  for(let i=0;i<30;i++){const a=r()*TAU2,d=14+r()*8;const x=Math.cos(a)*d,z=Math.sin(a)*d*0.95;if(onRoad(x,z))continue;blob(m,[x,hgt(x,z)+0.3,z],0.6+r()*0.4,p=>mix3(hx('#3a7a30'),hx('#6aaa40'),clamp(p[1],0,1)),i+50,0.75,[6,9])}
  // grass tufts
  for(let i=0;i<2200;i++){const a=r()*TAU2,d=12+Math.pow(r(),0.8)*30;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z))continue;const y=hgt(x,z);const h=0.15+r()*0.2,yaw=r()*TAU2,w=0.04;const cb=hx('#4a8a2a'),ct=hx('#a8d060');
    m.tri([x+Math.cos(yaw)*w,y,z+Math.sin(yaw)*w],[x-Math.cos(yaw)*w,y,z-Math.sin(yaw)*w],[x+(r()-0.5)*0.1,y+h,z+(r()-0.5)*0.1],[cb,cb,ct])}
  // flowers
  for(let i=0;i<160;i++){const a=r()*TAU2,d=13+r()*14;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(onRoad(x,z))continue;m.ico([x,hgt(x,z)+0.18,z],0.07,[hx('#ff5a6a'),hx('#ffe04a'),hx('#ffffff'),hx('#b070ff')][i%4],0,1,[3,5])}
  WORLD=m.build(0.0)}
const OVEN=BRICKDOME;
const VO=[{"t": 0.25, "d": 2.276, "w": [["Everyone", 0.28, 0.754], ["in", 0.754, 0.964], ["this", 0.964, 1.175], ["village", 1.175, 1.517], ["laughed", 1.517, 1.969], ["at", 1.969, 2.179], ["Leo.", 2.179, 2.39]]}, {"t": 2.9, "d": 4.297, "w": [["His", 2.94, 3.16], ["dad", 3.16, 3.381], ["was", 3.381, 3.691], ["a", 3.691, 3.912], ["poor", 3.912, 4.132], ["baker,", 4.132, 4.49], ["so", 4.75, 4.958], ["Leo", 4.958, 5.166], ["sold", 5.166, 5.373], ["bread", 5.373, 5.581], ["from", 5.581, 5.789], ["a", 5.789, 6.117], ["tiny", 6.117, 6.455], ["wooden", 6.455, 6.792], ["cart.", 6.792, 7.11]]}, {"t": 7.6, "d": 3.985, "w": [["Every", 7.63, 8.11], ["single", 8.11, 8.457], ["day,", 8.457, 8.67], ["Max", 8.85, 9.062], ["and", 9.062, 9.275], ["his", 9.275, 9.587], ["friends", 9.587, 9.8], ["knocked", 9.8, 10.145], ["his", 10.145, 10.477], ["bread", 10.477, 10.69], ["into", 10.69, 11.035], ["the", 11.035, 11.248], ["mud.", 11.248, 11.46]]}, {"t": 12.0, "d": 2.117, "w": [["\"Bread", 12.05, 12.294], ["boy", 12.294, 12.538], ["will", 12.538, 12.781], ["never", 12.781, 13.178], ["be", 13.178, 13.421], ["anything!\"", 13.421, 13.97]]}, {"t": 14.9, "d": 3.69, "w": [["One", 14.93, 15.2], ["night,", 15.2, 15.47], ["Leo", 15.61, 15.876], ["packed", 15.876, 16.308], ["his", 16.308, 16.574], ["bag,", 16.574, 16.84], ["and", 17.23, 17.417], ["left", 17.417, 17.723], ["without", 17.723, 18.027], ["a", 18.027, 18.213], ["word.", 18.213, 18.4]]}, {"t": 19.0, "d": 5.681, "w": [["In", 19.03, 19.212], ["the", 19.212, 19.393], ["big", 19.393, 19.575], ["city,", 19.575, 19.87], ["he", 20.15, 20.303], ["baked", 20.303, 20.691], ["day", 20.691, 20.844], ["and", 20.844, 20.997], ["night.", 20.997, 21.15], ["He", 21.79, 22.02], ["failed.", 22.02, 22.23], ["Again.", 22.75, 23.34], ["And", 23.9, 24.132], ["again.", 24.132, 24.51]]}, {"t": 26.4, "d": 1.142, "w": [["Five", 26.52, 26.771], ["years", 26.771, 27.022], ["later...", 27.022, 27.43]]}, {"t": 28.0, "d": 3.298, "w": [["A", 28.12, 28.373], ["giant", 28.373, 28.626], ["golden", 28.626, 29.037], ["truck", 29.037, 29.29], ["rolled", 29.29, 29.802], ["into", 29.802, 30.213], ["the", 30.213, 30.466], ["village", 30.466, 30.877], ["square.", 30.877, 31.13]]}, {"t": 31.6, "d": 5.881, "w": [["On", 31.63, 31.883], ["the", 31.883, 32.137], ["side,", 32.137, 32.39], ["in", 32.66, 32.983], ["huge", 32.983, 33.306], ["letters:", 33.306, 33.83], ["Leo's", 34.12, 34.397], ["Bakery.", 34.397, 35.02], ["Two", 35.53, 35.781], ["hundred", 35.781, 36.189], ["shops,", 36.189, 36.53], ["worldwide.", 36.72, 37.35]]}, {"t": 38.0, "d": 1.51, "w": [["The", 38.04, 38.242], ["whole", 38.242, 38.571], ["village", 38.571, 38.899], ["went", 38.899, 39.101], ["silent.", 39.101, 39.43]]}, {"t": 40.0, "d": 1.997, "w": [["Then", 40.03, 40.297], ["Leo", 40.297, 40.564], ["saw", 40.564, 40.832], ["someone", 40.832, 41.266], ["he", 41.266, 41.533], ["knew.", 41.533, 41.8]]}, {"t": 42.4, "d": 3.559, "w": [["Selling", 42.45, 42.846], ["bread", 42.846, 43.09], ["from", 43.09, 43.333], ["his", 43.333, 43.577], ["old", 43.577, 43.82], ["tiny", 43.82, 44.216], ["cart...", 44.216, 44.61], ["was", 45.12, 45.42], ["Max.", 45.42, 45.82]]}, {"t": 46.4, "d": 1.557, "w": [["Max", 46.43, 46.622], ["couldn't", 46.622, 46.903], ["even", 46.903, 47.215], ["look", 47.215, 47.407], ["at", 47.407, 47.598], ["him.", 47.598, 47.79]]}, {"t": 48.4, "d": 3.552, "w": [["Leo", 48.44, 48.666], ["walked", 48.666, 49.033], ["over,", 49.033, 49.4], ["bought", 49.67, 49.957], ["every", 49.957, 50.355], ["single", 50.355, 50.643], ["loaf,", 50.643, 50.82], ["and", 51.21, 51.53], ["said:", 51.53, 51.85]]}, {"t": 52.6, "d": 1.859, "w": [["\"Never", 52.64, 53.23], ["laugh", 53.23, 53.594], ["at", 53.594, 53.957], ["bread.\"", 53.957, 54.32]]}, {"t": 58.6, "d": 2.987, "w": [["Should", 58.65, 58.873], ["Leo", 58.873, 59.097], ["give", 59.097, 59.32], ["Max", 59.32, 59.543], ["a", 59.543, 59.767], ["job?", 59.767, 59.99], ["Tell", 60.48, 60.658], ["me", 60.658, 60.836], ["in", 60.836, 61.013], ["the", 61.013, 61.191], ["comments!", 61.191, 61.48]]}];
// ================= timeline & animation =================
const EV={laugh1:2.9,dad1:4.75,cartIn:7.4,maxIn:7.6,swipe:9.85,splat:10.7,mock:12.0,sad:13.5,night:14.9,look0:16.8,look1:17.7,kitch:19.0,fail:[21.95,22.75,24.1],gold:24.9,later:26.4,truck:28.0,villCut:29.8,stop:31.2,side:31.6,lb:34.1,shops:35.5,door:36.0,out:36.2,silent:38.0,saw:40.0,turn:40.9,cartPan:42.4,reveal:45.15,cant:46.4,walk2:46.4,arrive:50.0,bought:49.75,fly:50.3,said:51.5,never:52.6,away:54.6,endc:58.4,loop:65.6};
const C0=[0.5,0,4.0],PUD=[1.35,0.03,2.35],C2=[5.8,0,3.6],MAXP=[5.8,0,4.65],TP=[-1.0,0,0.3],K=[400,0,0];
const yawTo=(a,b)=>Math.atan2(b[0]-a[0],b[2]-a[2]);
const angL=(a,b,k)=>{let d=b-a;while(d>Math.PI)d-=TAU2;while(d<-Math.PI)d+=TAU2;return a+d*k};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){return t>=EV.kitch&&t<EV.later?'kitchen':'village'}
function era(t){return t>=EV.later?2:1}
// villagers
const VIL1=[['v1',[-2.9,0,1.5]],['v2',[-2.1,0,0.1]],['v4',[2.1,0,0.9]],['v5',[2.7,0,2.4]],['v6',[-3.1,0,4.4]],['v3',[1.0,0,0.4]],['v7',[2.9,0,5.4]]];
const VIL2=[['v1',[-4.6,0,4.6]],['v2',[-3.2,0,6.4]],['v4',[2.6,0,6.6]],['v6',[-6.2,0,2.8]],['v7',[-1.2,0,6.9]],['v3',[0.7,0,6.2]],['v5',[3.6,0,7.6]]];
const LEO1=[-0.9,0,3.0];
let LEOR=null,MAXR=null,DADR=null,VR=[],F1R=null;
function walkSt(t,t0,t1,a,b,spd){const k=seg(t,t0,t1);const kk=ease(k);const p=lerp3(a,b,kk);const moving=t>t0&&t<t1;const amp=moving?0.55*Math.min(1,Math.min(t-t0,t1-t)/0.25):0;return{pos:p,walk:{ph:(t-t0)*(spd||9),amp},ry:yawTo(a,b),k}}
function laughSt(t,i){return{bob:Math.abs(Math.sin(t*14+i))*0.05,lean:-0.12,head:{p:-0.25+0.05*Math.sin(t*14+i)},face:{eyes:'happy',mouth:'laugh',open:0.5+0.5*Math.sin(t*14+i)}}}
function cast(t){const L=[];const E=era(t);const S=scn(t);
  if(S==='kitchen'){L.push(['leo',leoKitchen(t)]);return L}
  if(E===1){const night=t>=EV.night;
    // villagers
    if(!night){VIL1.forEach(([k,p],i)=>{let st;if(t<EV.laugh1){st=laughSt(t,i);st.pos=p;st.ry=yawTo(p,LEO1);if(i%2===0)st.aR={f:1.45,s:0.1};else st.aL={f:0.6,s:-0.2},st.aR={f:0.6,s:-0.2}}
        else if(t<EV.mock){const a=p,b=[p[0]*2.4+(p[0]>0?1:-1)*1.5,0,8.5+i*0.3];const w=walkSt(t,EV.laugh1+i*0.08,EV.laugh1+i*0.08+1.8,a,b,9);st=w;st.face={}}
        else{st={pos:[p[0]*2.4+(p[0]>0?1:-1)*1.5,0,8.5+i*0.3]};st.ry=yawTo(st.pos,[-0.5,0,3]);st.face={mouth:'laugh',eyes:'happy',open:0.3};st.bob=Math.abs(Math.sin(t*12+i))*0.03}
        L.push([k,st])})}
    // dad
    if(!night){const wav=t>=EV.laugh1&&t<EV.dad1+1;L.push(['dad',{pos:[1.75,0,9.1],ry:Math.PI,aR:wav?{f:2.7,s:0.25+0.25*Math.sin(t*10)}:{f:0.2},face:{eyes:wav?'happy':'open',mouth:'smile'}}])}
    // leo
    let ls;
    if(t<EV.laugh1){ls={pos:LEO1,ry:Math.PI-0.25,head:{p:0.35,y:0.2},face:{mouth:'sad',brow:'sad',look:[0.6,-1]},aL:{f:0.15},aR:{f:0.15}}}
    else if(t<EV.cartIn+0.2){const cx=lerp(-7.5,C0[0],easeOut(seg(t,EV.dad1,EV.cartIn)));ls={pos:[cx-1.75,0,C0[2]],ry:Math.PI/2,walk:{ph:t*8,amp:t<EV.cartIn?0.5:0},aL:{f:1.2},aR:{f:1.2},face:{mouth:'flat'}}}
    else if(t<EV.night){const shock=t>=EV.swipe+0.1;ls={pos:[0.6,0,5.05],ry:Math.PI,face:{mouth:shock?'o':'smile',eyes:shock?'wide':'open',open:1.2},aL:shock?{f:2.4,s:0.3}:{f:0.3},aR:shock?{f:2.4,s:0.3}:{f:0.3}};
      if(t>=EV.splat+0.4){ls.aL={f:0.2};ls.aR={f:0.2};ls.head={p:0.4};ls.face={mouth:'sad',brow:'sad',tear:t>=EV.sad?(t-EV.sad)*0.8:null,look:[0,-1]}}}
    else{// night walk
      const x0=2.5;let x=x0+Math.max(0,Math.min(t,EV.look0)-EV.night)*1.6+Math.max(0,t-EV.look1)*1.6;const lk=t>=EV.look0&&t<EV.look1+0.3;const tb=seg(t,EV.look0,EV.look0+0.35)*(1-seg(t,EV.look1,EV.look1+0.3));
      ls={pos:[x,0,0.5],ry:Math.PI/2-2.3*tb,pack:1,walk:{ph:t*7,amp:lk?0.5*(1-tb):0.45},head:{p:0.15,y:-0.3*tb},face:{mouth:'sad',brow:'sad',eyes:'open',tear:lk?(t-EV.look0)*0.7:null},aL:{f:0},aR:{f:0}}}
    L.push(['leo',ls]);
    // max & friends
    if(t>=EV.maxIn&&t<EV.night){const MP=[-1.7,0,4.35],F1=[-2.7,0,3.4],F2=[-2.6,0,5.3];
      const mk=(p,off,k)=>{const w=walkSt(t,EV.maxIn+off,EV.maxIn+off+1.8,[p[0]-6,0,p[2]-1],p,8);return w};
      let m=mk(MP,0);if(t>=EV.maxIn+1.8){m.ry=yawTo(MP,[0.6,0,4.0]);m.face={mouth:'smirk',brow:'angry'}}
      if(t>=EV.swipe-0.35&&t<EV.mock){const k=(t-(EV.swipe-0.35))/0.45;m.aR={f:1.4,s:k<1?0.9-1.4*easeOut(k):-0.5,tw:0};m.face={mouth:k<1?'flat':'laugh',eyes:k<1?'open':'happy',brow:k<1?'angry':0,open:0.6}}
      if(t>=EV.mock){m.ry=yawTo(MP,[0.6,0,5.05]);Object.assign(m,laughSt(t,7));m.aR={f:1.5,s:0.0};m.aL={f:0.7,s:-0.35}}
      L.push(['max',m]);
      for(const[k,p,o]of[['f1',F1,0.25],['f2',F2,0.45]]){const f=mk(p,o);if(t>=EV.maxIn+o+1.8)f.ry=yawTo(p,[0.6,0,4.5]);if(t>=EV.swipe+0.3){Object.assign(f,laughSt(t,o*10));f.aL={f:0.7,s:-0.3}}else f.face={mouth:'smirk'};L.push([k,f])}}
    return L}
  // era 2
  const sil=t>=EV.silent-0.2&&t<EV.saw+0.3;
  VIL2.forEach(([k,p],i)=>{const tgt=t<EV.out?[TP[0],0,TP[2]]:(t<EV.walk2?[-2.6,0,-2.4]:LEOA(t).pos);let st={pos:p,ry:yawTo(p,tgt),face:{mouth:sil?'o':(t>=EV.truck?'o':'smile'),eyes:sil||t>=EV.truck&&t<EV.silent?'wide':'open',open:sil?1.3:0.8}};
    if(t<EV.truck){st.ry=yawTo(p,[0,0,0])+Math.sin(t*0.5+i)*0.4;st.face={mouth:'smile'}}
    if(t>=EV.bought&&t<EV.endc){st.face={mouth:'o',eyes:'wide',open:1}}
    if(t>=EV.away){st.face={mouth:'smile',eyes:'happy'};st.aL={f:1.2+0.25*Math.sin(t*16+i),s:-0.5};st.aR={f:1.2+0.25*Math.sin(t*16+i+1),s:-0.5}}
    L.push([k,st])});
  L.push(['dad',{pos:[1.75,0,9.1],ry:Math.PI,face:{mouth:t>=EV.out?'smile':'smile',eyes:t>=EV.silent?'happy':'open',tear:t>=EV.silent&&t<EV.endc?(t-EV.silent)*0.6:null},aL:t>=EV.silent?{f:0.5}:{f:0.1},aR:{f:0.1}}]);
  if(t>=EV.out)L.push(['leoA',LEOA(t)]);
  L.push(['maxA',MAXA(t)]);
  return L}
function LEOA(t){const P0=[-3.25,0,-1.2],P1=[-2.6,0,-2.4],P2=[5.25,0,2.35],P3=[-2.8,0,-2.0];
  if(t<EV.out+0.8){const w=walkSt(t,EV.out,EV.out+0.8,P0,P1,8);w.ry=Math.PI;w.face={mouth:'smirk'};return w}
  if(t<EV.walk2){const turnK=ease(seg(t,EV.turn,EV.turn+0.6));const st={pos:P1,ry:angL(Math.PI+0.25,yawTo(P1,MAXP),turnK),face:{mouth:t<EV.turn?'smirk':'flat',brow:t>=EV.turn?'up':0}};
    if(t>=EV.out+0.8&&t<EV.out+1.6){const k=seg(t,EV.out+0.8,EV.out+1.6);st.aR={f:2.7*Math.sin(Math.PI*k),s:-0.35*Math.sin(Math.PI*k)}}return st}
  if(t<EV.arrive){const w=walkSt(t,EV.walk2,EV.arrive,P1,P2,7.5);w.face={mouth:'flat'};return w}
  if(t<EV.away){const st={pos:P2,ry:yawTo(P2,MAXP),face:{mouth:t>=EV.never?'smirk':'flat',brow:t>=EV.never?'up':0}};const kb=seg(t,EV.bought-0.15,EV.bought+0.25)*(1-seg(t,EV.bought+0.6,EV.bought+0.9));st.aR={f:1.3*kb};
    if(t>=EV.never-0.1){const kg=seg(t,EV.never-0.1,EV.never+0.4);st.glasses=kg;st.aR={f:2.6*Math.sin(Math.PI*Math.min(1,kg*1.1)),s:-0.3}}return st}
  const w=walkSt(t,EV.away,EV.away+3.2,P2,P3,7.5);w.face={mouth:'smirk'};w.glasses=1;if(t>EV.away+3.2)w.ry=Math.PI;return w}
function MAXA(t){const st={pos:MAXP,ry:Math.PI,face:{mouth:'flat',eyes:'half'},aL:{f:0.5},aR:{f:0.5},head:{p:0.25}};
  if(t<EV.reveal-0.3){st.ry=0.2;st.head={p:0.3};st.aL={f:0.9+0.2*Math.sin(t*3)};st.aR={f:0.9+0.2*Math.sin(t*3+1)};return st}
  if(t<EV.cant){const k=ease(seg(t,EV.reveal-0.3,EV.reveal+0.05));st.ry=angL(0.2,Math.PI,k);st.face={mouth:'o',eyes:'wide',open:1};st.head={p:0};return st}
  if(t<EV.bought){st.head={y:0.6,p:0.4};st.face={mouth:'sad',brow:'sad',sweat:1,look:[1,-1]};return st}
  if(t<EV.away){const lk=yawTo(MAXP,LEOA(t).pos);st.ry=Math.PI;st.head={y:clamp(angL(0,lk-Math.PI,1),-0.8,0.8),p:0.1};st.face={mouth:'o',eyes:'wide',open:0.9,brow:'up'};if(t>=EV.never)st.face={mouth:'sad',brow:'sad',eyes:'open',tear:(t-EV.never)*0.7};return st}
  st.aL={f:1.25,s:-0.15};st.aR={f:1.25,s:-0.15};st.head={p:0.45};st.face={mouth:'smile',brow:'sad',eyes:'open',tear:(t-EV.away)*0.7,look:[0,-1]};return st}
function leoKitchen(t){const P=[K[0]+0.4,0,2.45];const st={pos:P,ry:Math.PI,aL:{f:1.1},aR:{f:1.1},face:{mouth:'flat',brow:0}};
  if(t<EV.fail[0]-0.3){const k=Math.sin(t*9);st.aL={f:1.15+0.22*k};st.aR={f:1.15-0.22*k};st.head={p:0.35};st.bob=Math.abs(k)*0.02;st.face={mouth:'flat',brow:'angry',look:[0,-1]};return st}
  let last=-1;for(let i=0;i<3;i++)if(t>=EV.fail[i]+0.35)last=i;
  if(t<EV.gold){if(last>=0){const k=t-EV.fail[last]-0.35;const fp=clamp(k/0.25,0,1);st.aR={f:2.6*fp,s:-0.45*fp};st.head={p:0.3+0.15*fp,y:0};st.face={eyes:'closed',mouth:'sad',brow:'sad'}}else{st.head={y:-0.6};st.face={mouth:'flat',look:[-1,0]};st.aL={f:0.3};st.aR={f:0.3}}return st}
  const k=seg(t,EV.gold+0.3,EV.gold+0.6);st.aL={f:2.9*k,s:0.5*k};st.aR={f:2.9*k,s:0.5*k};st.bob=k*Math.abs(Math.sin(t*10))*0.12;st.face={mouth:'laugh',eyes:'happy',open:0.7};st.head={p:-0.2*k};return st}
// ---------- props ----------
function arc(a,b,k,h){const p=lerp3(a,b,k);p[1]+=h*4*k*(1-k);return p}
const LOAFS1=[[-0.15,0.87,3.85],[0.2,0.87,4.15],[0.55,0.87,3.85],[0.9,0.87,4.15],[1.15,0.87,3.85],[0.35,1.01,4.0]];
function props(t,items){const S=scn(t),E=era(t);
  if(S==='kitchen'){items.push({mesh:KITCHEN,M:M4.trs(K,0,0,0,1)});items.push({mesh:BRICKDOME,M:M4.trs([K[0]-2.25,0.4,1.9],Math.PI/2,0,0,0.95)});
    items.push({mesh:UB,M:M4.trs([K[0]-2.25,0.2,1.9],0,0,0,[2.1,0.4,2.1]),tint:hx('#8a7a6a'),tintAmt:1});
    for(let i=0;i<5;i++){const a=t*7+i*1.7;items.push({mesh:UEMIS,M:M4.trs([K[0]-2.2+Math.sin(a)*0.15,0.6+0.12*Math.abs(Math.sin(a*1.3)),1.9+Math.cos(a)*0.15],0,0,0,0.16+0.05*Math.sin(a*2)),tint:mix3([1,0.85,0.3],[1,0.35,0.05],i/5),tintAmt:1,alpha:0.9,add:1,noShadow:true})}
    items.push({mesh:CLOCKRIM,M:M4.trs([K[0]+2.2,2.0,2.955],Math.PI,0,0,1)});const ca=t*14;items.push({mesh:UB,M:mm(M4.trs([K[0]+2.2,2.0,2.94],0,0,ca,1),TT([0,0.09,0],[0.025,0.18,0.01])),tint:DARK,tintAmt:1});items.push({mesh:UB,M:mm(M4.trs([K[0]+2.2,2.0,2.94],0,0,ca/12,1),TT([0,0.06,0],[0.035,0.12,0.01])),tint:DARK,tintAmt:1});
    // dough
    if(t<EV.fail[0]){const sq=1+0.18*Math.sin(t*9);items.push({mesh:DOUGH,M:M4.trs([K[0]+0.4,1.03,1.65],0,0,0,[0.32/sq,0.16*sq,0.26])})}
    for(let i=0;i<3;i++){const t0=EV.fail[i]-0.3;if(t<t0)continue;const k=seg(t,t0,t0+0.4);const A=[K[0]-1.45,0.75,1.9],B=[K[0]-0.45+i*0.45,1.07,1.45];const p=arc(A,B,k,0.6);items.push({mesh:LOAF,M:M4.trs(p,0.3+i,k<1?k*6:0,0,1),tint:[0.12,0.09,0.08],tintAmt:1});
      const ks=t-t0-0.4;if(ks>0&&ks<1.6)for(let j=0;j<3;j++){const kk=(ks*0.9+j/3)%1;items.push({mesh:PUFF,M:M4.trs([B[0]+Math.sin(j*2+ks)*0.06,B[1]+0.08+kk*0.7,B[2]],j,0,0,0.04+kk*0.07),tint:[0.2,0.2,0.22],tintAmt:0.9,alpha:(1-kk)*0.6*clamp((1.6-ks)*2,0,1),noShadow:true})}}
    if(t>=EV.gold-0.35){const k=seg(t,EV.gold-0.35,EV.gold+0.15);const p=arc([K[0]-1.45,0.75,1.9],[K[0]+0.4,1.12,1.45],k,0.9);items.push({mesh:LOAF,M:M4.trs(p,k*TAU2,0,0,1.35),tint:[1,0.75,0.3],tintAmt:0.35});items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,0.32+0.04*Math.sin(t*12)),tint:[1,0.8,0.4],tintAmt:1,alpha:0.12,add:1,noShadow:true})}
    return}
  items.push({mesh:BRICKDOME,M:M4.trs([4.4,0.4,7.4],-Math.PI/2,0,0,1.15)});
  if(E===1){// cart
    let cp=C0.slice(),crx=0;if(t>=EV.laugh1&&t<EV.cartIn+0.2)cp[0]=lerp(-7.5,C0[0],easeOut(seg(t,EV.dad1,EV.cartIn)));if(t>=EV.night)cp=[-30,0,-30];
    if(t>=EV.swipe&&t<EV.swipe+1.5){const k=t-EV.swipe;crx=-0.28*Math.sin(k*9)*Math.exp(-k*3)}
    items.push({mesh:CART,M:M4.trs(cp,0,crx,0,1)});
    items.push({mesh:PUDDLE,M:M4.trs(PUD,0.3,0,0,1.15)});
    LOAFS1.forEach((l,i)=>{let p=V.add(l,[cp[0]-C0[0],0,0]),rot=[0.2*i,0,0],tint=null,ta=0;if(t>=EV.night)return;
      const t0=EV.swipe-0.05+i*0.06;if(t>=t0){const k=seg(t,t0,t0+0.75);const land=[PUD[0]-0.7+(i%3)*0.55+hsh(i,2)*0.2,0.06,PUD[2]-0.25+Math.floor(i/3)*0.45];p=arc(l,land,easeIn(k)*0.4+k*0.6,0.9);rot=[0.2*i+k*5,k*4*(i%2?1:-1),0];if(k>=1){rot=[0.2*i+(i%3)*0.4,0,0.15*(i%2)];tint=hx('#5a3a22');ta=clamp((t-t0-0.75)*2,0,0.75)}}
      items.push({mesh:LOAF,M:M4.trs(p,rot[0],rot[2],rot[1],1),tint,tintAmt:ta})});
    // mud splashes
    for(let i=0;i<6;i++){const t0=EV.swipe-0.05+i*0.06+0.75;const k=t-t0;if(k<0||k>0.6)continue;for(let j=0;j<5;j++){const a=j/5*TAU2+i;const p=[PUD[0]-0.7+(i%3)*0.55+Math.cos(a)*k*0.9,0.05+Math.max(0,k*2.2-k*k*6),PUD[2]-0.25+Math.floor(i/3)*0.45+Math.sin(a)*k*0.6];items.push({mesh:USPH,M:M4.trs(p,0,0,0,0.04*(1-k/0.6)+0.01),tint:hx('#4a3020'),tintAmt:1,noShadow:true})}}
    return}
  // era 2: truck, cart2, loaves, bag, coins
  let tx=TP[0];if(t<EV.stop){const k=seg(t,EV.truck-0.2,EV.stop);tx=lerp(48,TP[0],1-Math.pow(1-k,2.2))}
  if(t<EV.truck-0.2)tx=999;
  items.push({mesh:GTRUCK,M:M4.trs([tx,0,TP[2]],Math.PI,0,0,1)});
  items.push({mesh:CART,M:M4.trs(C2,0,0,0,1)});
  const L2=[[5.15,0.87,3.45],[5.5,0.87,3.75],[5.85,0.87,3.45],[6.2,0.87,3.75],[6.45,0.87,3.45],[5.35,1.01,3.6],[5.95,1.01,3.6],[6.3,1.01,3.45]];
  L2.forEach((l,i)=>{const t0=EV.fly+i*0.11;let p=l,r=[0.2*i,0,0];if(t>=t0){const k=seg(t,t0,t0+0.8);if(k>=1)return;p=arc(l,[2.3,1.7,TP[2]],k,2.4);r=[k*8,k*5,0]}items.push({mesh:LOAF,M:M4.trs(p,r[0],r[2],r[1],1)})});
  // bag
  if(t>=EV.walk2){const L=LEOAR;let bp=null;if(t<EV.bought+0.15&&L)bp=V.add(L.hR,[0,-0.3,0]);else if(t<EV.away)bp=[5.55,0.82,3.35];else{const k=seg(t,EV.away,EV.away+0.5);bp=MAXR?lerp3([5.55,0.82,3.35],V.add(lerp3(MAXR.hL,MAXR.hR,0.5),[0,-0.25,0.05]),ease(k)):null}
    if(bp)items.push({mesh:BAG,M:M4.trs(bp,0.5,0,0,1.1)})}
  if(t>=EV.bought+0.15&&t<EV.bought+1.6){const k=t-EV.bought-0.15;for(let i=0;i<14;i++){const a=i/14*TAU2+hsh(i,3);const v=[Math.cos(a)*(0.8+hsh(i,1)),2.6+hsh(i,2)*1.5,Math.sin(a)*(0.8+hsh(i,1))];const p=[5.55+v[0]*k,0.95+v[1]*k-4.9*k*k,3.35+v[2]*k];if(p[1]<0.03)p[1]=0.03;items.push({mesh:COIN,M:M4.trs(p,k*9+i,k*11,0,1.4),noShadow:true})}}}
let LEOAR=null;
function charItems(t,items){LEOR=null;MAXR=null;DADR=null;VR=[];F1R=null;LEOAR=null;for(const[k,st]of cast(t)){if(st.hide)continue;const r=blocky(LOOK[k],st,items);
  if(k==='leo')LEOR=r;if(k==='leoA'){LEOR=r;LEOAR=r}if(k==='max'||k==='maxA')MAXR=r;if(k==='dad')DADR=r;if(k==='f1')F1R=r;if(k[0]==='v')VR.push([k,r])}}
// ---------- environment ----------
function envBase(){return{sun:[0.45,0.75,-0.5],sunCol:hx('#fff0d8'),sky:hx('#bfe6f6'),gnd:hx('#8a9a5a'),fog:hx('#d8eef6'),fogD:600,zen:hx('#4ab4e8'),hor:hx('#d8f2fa'),stars:0,night:0,emis:1.0,ground:1,sunSize:2,fillD:[-0.5,0.4,-0.7],fillC:[0.28,0.3,0.34]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_DAY=envBase();
const E_NIGHT=Object.assign(envBase(),{sun:[-0.3,0.5,0.8],sunCol:hx('#7a86c8'),sky:hx('#3a4480'),gnd:hx('#2a3a40'),fog:hx('#26305a'),fogD:300,zen:hx('#080a24'),hor:hx('#3a3a7a'),stars:1,night:0.7,fillD:[0,0.5,-1],fillC:[0.16,0.18,0.32],sunSize:3});
const E_KIT=Object.assign(envBase(),{sun:[0.3,0.75,-0.55],sunCol:hx('#ffe2b8'),sky:hx('#d8c8b0'),gnd:hx('#8a7a6a'),fillC:[0.42,0.36,0.32],fillD:[0,0.3,-1]});
const E_MORN=Object.assign(envBase(),{sun:[0.55,0.55,-0.6],sunCol:hx('#ffe6c0'),hor:hx('#fff0dc'),fog:hx('#f0eadc')});
function envAt(t){if(scn(t)==='kitchen')return E_KIT;if(t>=EV.night&&t<EV.kitch)return E_NIGHT;if(era(t)===2)return E_MORN;return E_DAY}
// ---------- camera ----------
const SH=[
  [0,[0.4,3.2,-8.6],[-0.2,1.1,2.8],[0.2,2.8,-7.4],[-0.3,1.15,2.8]],
  [EV.laugh1,[1.3,2.0,4.4],[1.75,1.8,9.1],[1.45,1.95,4.9],[1.75,1.85,9.1],0.85],
  [EV.dad1,null],
  [EV.maxIn,[0.2,2.4,-3.6],[-0.6,1.1,4.2],[0.1,2.3,-3.2],[-0.5,1.1,4.2]],
  [EV.swipe+0.35,[2.9,0.75,-0.2],[1.0,0.45,2.8],[2.7,0.7,-0.05],[1.1,0.4,2.8],0.9],
  [EV.mock,[-0.2,1.85,3.0],[-1.7,1.7,4.35],[-0.4,1.85,3.2],[-1.7,1.7,4.35],0.85],
  [EV.sad,[0.65,1.42,2.5],[0.6,1.55,5.05],[0.65,1.42,2.8],[0.6,1.55,5.05],0.7],
  [EV.night,null],
  [EV.kitch,[K[0]+0.3,2.15,-0.9],[K[0]+0.4,1.25,2.2],[K[0]+0.35,2.05,-0.3],[K[0]+0.4,1.3,2.2],0.85],
  [21.7,[K[0]-0.9,2.3,-3.3],[K[0]-0.9,1.2,1.9],[K[0]-0.8,2.25,-3.0],[K[0]-0.8,1.2,1.9],1.15],
  [EV.gold-0.4,[K[0]+0.3,1.6,-0.6],[K[0]+0.3,1.5,2.0],[K[0]+0.35,1.55,0.2],[K[0]+0.4,1.6,2.2],0.85],
  [EV.later,[-11,8.5,-17],[0.5,1.5,4],[-9,7.8,-15.5],[0.5,1.5,4],0.85],
  [EV.truck,[7.2,0.9,-4.6],[22,1.8,0.8],[6.4,0.9,-4.4],[12,1.6,0.6],0.9],
  [EV.villCut,[-4.5,2.2,-9.5],[1.0,1.5,2.5],[-4.0,2.1,-8.8],[0.0,1.5,2.5],0.9],
  [EV.side,[1.0,2.2,-6.8],[-0.4,2.1,0.3],[0.5,2.2,-5.4],[-0.4,2.1,0.3],0.85],
  [EV.door,[-1.1,0.7,-5.6],[-3.0,1.5,-1.6],[-1.2,0.75,-5.7],[-2.7,1.75,-2.3],0.9],
  [EV.silent,[2.4,1.8,2.3],[-1.0,1.4,6.4],[2.2,1.8,2.6],[-1.0,1.4,6.4],0.95],
  [EV.saw,null],
  [EV.cartPan,[0.6,1.7,-2.4],[5.8,1.4,4.2],[3.6,1.95,1.1],[5.8,1.8,4.6],0.9],
  [EV.reveal+0.1,[4.45,2.12,3.0],[5.8,1.95,4.65],[4.55,2.1,3.1],[5.8,1.95,4.65],0.8],
  [EV.cant,[3.9,1.8,3.6],[5.8,1.75,4.65],[4.05,1.8,3.65],[5.8,1.75,4.65],0.8],
  [48.3,null],
  [EV.never,[3.8,2.3,4.4],[5.25,1.95,2.35],[3.95,2.25,4.2],[5.25,1.97,2.35],0.85],
  [EV.away,[9.5,2.2,-1.5],[4.0,1.2,3.0],[9.0,2.1,-1.0],[3.6,1.2,3.0],0.95],
  [EV.endc,[-1.5,5.2,-10.5],[1.0,1.5,3.5],[1.5,5.4,-10.5],[1.0,1.5,3.5],0.85],
  [EV.loop,[0.4,3.2,-8.6],[-0.2,1.1,2.8],[0.4,3.2,-8.6],[-0.2,1.1,2.8]],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){
  if(t>=EV.night&&t<EV.kitch){const x=2.5+Math.max(0,Math.min(t,EV.look0)-EV.night)*1.6+Math.max(0,t-EV.look1)*1.6;const k=seg(t,EV.night,EV.kitch);return{eye:[x-3.9+k*0.6,1.85,-1.9],at:[x+1.5,1.15,0.9],fov:0.9}}
  if(t>=EV.saw&&t<EV.cartPan){const P1=[-2.6,0,-2.4];const d=yawTo(P1,MAXP)+0.55;const k=seg(t,EV.saw,EV.cartPan);return{eye:[P1[0]+Math.sin(d)*(2.3-0.4*k),2.0,P1[2]+Math.cos(d)*(2.3-0.4*k)],at:[P1[0],1.92,P1[2]],fov:0.8}}
  if(t>=48.3&&t<EV.never){const p=LEOA(t).pos;const k=seg(t,48.3,EV.said);return{eye:[lerp(9.4,8.7,k),2.2,lerp(-0.2,0.8,k)],at:[lerp(p[0],5.5,0.5+0.5*seg(t,48.3,EV.arrive)),1.3,lerp(p[2],3.3,0.5+0.5*seg(t,48.3,EV.arrive))],fov:0.92}}
  if(t>=EV.dad1&&t<EV.maxIn){const cx=lerp(-7.5,C0[0],easeOut(seg(t,EV.dad1,EV.cartIn)));return{eye:[cx-0.6,1.9,-1.9],at:[cx-0.4,1.1,4.0],fov:0.95}}
  for(let i=0;i<SH.length-1;i++){const s=SH[i],n=SH[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SH[0][1],at:SH[0][2],fov:0.95}}
function fgItems(t){const items=[{mesh:WORLD}];props(t,items);charItems(t,items);return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const S=scn(tt);
  const ctr=S==='kitchen'?null:{center:[cm.at[0]*0.5+cm.eye[0]*0.5,0,cm.at[2]*0.5+cm.eye[2]*0.5],radius:Math.min(16,4+V.len(V.sub(cm.at,cm.eye))*0.7)};
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:4000},ctr,items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.swipe,8,0.4);S(EV.splat,4,0.3);for(const f of EV.fail)S(f,5,0.3);S(EV.stop,6,0.4);if(t>=EV.truck&&t<EV.stop)a+=1.5;S(EV.reveal,9,0.4);S(EV.bought,6,0.3);S(EV.never,4,0.3);return a}
// ================= overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.18?0.55+0.45*easeOut(k/0.18)+Math.sin(k/0.18*Math.PI)*0.16:1}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function pill(s,y,bg,size,al,x){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(x||W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
// white speech sign with black border + tail (like the trend videos)
function sign(s,x,y,size,k,tail,col){if(k<=0)return;size=fitSize(s,900,size);ctx.save();ctx.translate(x,y);const p=popS(k);ctx.scale(p,p);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;const bw=w+size*1.2,bh=size*1.75;
  ctx.fillStyle='rgba(0,0,0,0.35)';rrect(-bw/2+6,-bh/2+10,bw,bh,size*0.5);ctx.fill();ctx.fillStyle='#ffffff';ctx.strokeStyle='#111';ctx.lineWidth=size*0.12;rrect(-bw/2,-bh/2,bw,bh,size*0.5);ctx.fill();ctx.stroke();
  if(tail){ctx.beginPath();ctx.moveTo(-size*0.5*tail,bh/2-2);ctx.lineTo(-size*0.95*tail,bh/2+size*0.55);ctx.lineTo(size*0.1*tail,bh/2-2);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillRect(-size*0.5*tail-2,bh/2-size*0.14,size*0.62,size*0.14)}
  ctx.fillStyle=col||'#111';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,size*0.06);ctx.restore()}
function bigWord(s,y,size,k,col){if(k<=0)return;size=fitSize(s,980,size);ctx.save();ctx.translate(W/2,y);const p=popS(k);ctx.scale(p,p);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  ctx.lineWidth=size*0.26;ctx.strokeStyle='#000';ctx.strokeText(s,0,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=14;ctx.shadowOffsetY=6;ctx.fillStyle=col||'#ffffff';ctx.fillText(s,0,0);ctx.restore()}
const HOT=new Set(['LEO','MAX','BREAD','MUD','NIGHT','FAILED','AGAIN','AGAIN.','GOLDEN','BAKERY','WORLDWIDE','SILENT','NEVER','LAUGH','JOB','FIVE','YEARS','LATER','HUNDRED','TWO']);
function caption(t){for(const c of VO){for(let i=0;i<c.w.length;i++){const[w,a,b]=c.w[i];const nx=i+1<c.w.length?c.w[i+1][1]:b+0.3;if(t>=a-0.04&&t<Math.max(nx,b+0.05)){const s=w.replace(/["]/g,'').replace(/[.,:!?]+$/,'').toUpperCase();if(!s)return;
      const key=s.replace(/[^A-Z]/g,'');const col=HOT.has(key)?'#ffd84a':'#ffffff';bigWord(s,1290,150,t-a+0.04,col);return}}}}
function sunRays(t,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<6;i++){const x=W*(-0.1+i*0.24)+Math.sin(t*0.3+i)*30;const g=ctx.createLinearGradient(x,0,x+500,H*0.7);g.addColorStop(0,`rgba(255,250,220,${0.16*a})`);g.addColorStop(1,'rgba(255,250,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+70+i*8,0);ctx.lineTo(x+600,H*0.75);ctx.lineTo(x+420,H*0.75);ctx.closePath();ctx.fill()}ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);
  const day=S==='village'&&!(tt>=EV.night&&tt<EV.kitch);sunRays(tt,day?1:0);
  // laughter
  if(tt<EV.laugh1){VR.forEach(([k,r],i)=>{const ph=(tt*1.8+i*0.37)%1;const p=prj(r.top);if(p&&i<6)bubbleTxt(['HAHA','LOL','HAHAHA','😂','HAHA','🤣'][i],p[0]+(i%2?40:-40),p[1]-40-ph*40,i%3==2?60:52,Math.sin(Math.PI*Math.min(1,ph*1.3)))})}
  if(tt>=EV.laugh1&&tt<EV.dad1){const p=prj(DADR&&DADR.top);if(p)sign('Fresh bread! 🥖',clamp(p[0]-60,320,760),p[1]-110,54,tt-EV.laugh1-0.2,1)}
  if(tt>=EV.swipe+0.25&&tt<EV.mock){VR.length;const p=prj(F1R&&F1R.top);if(p)bubbleTxt('HAHAHA 😂',p[0],p[1]-60,52,1)}
  if(tt>=EV.mock&&tt<EV.sad){const p=prj(MAXR&&MAXR.top);if(p)sign('BREAD BOY 🤡',clamp(p[0]+40,330,750),p[1]-110,64,tt-EV.mock-0.05,1)}
  if(tt>=EV.splat&&tt<EV.mock){const p=prj(PUD);if(p)bubbleTxt('*SPLAT*',p[0],p[1]-120,64,clamp((tt-EV.splat)*5,0,1),'#c8a070')}
  if(S==='kitchen'){EV.fail.forEach((f,i)=>{if(tt>=f&&tt<EV.gold-0.4){const p=prj([K[0]-0.45+i*0.45,1.3,1.45]);if(p)emoji('❌',p[0],p[1]-60,90*popS(tt-f))}});
    if(tt>=EV.gold+0.1){const p=prj([K[0]+0.4,1.3,1.45]);if(p){glowAt(p,300,'255,220,120',0.6);for(let i=0;i<5;i++){const a=tt*2+i*1.26;emoji('✨',p[0]+Math.cos(a)*170,p[1]-40+Math.sin(a)*90,56)}sign('PERFECT ✨',W/2,560,70,tt-EV.gold-0.2,0)}}}
  if(tt>=EV.later&&tt<EV.truck){const k=tt-EV.later;sign('5 YEARS LATER ⏳',W/2,640,84,k,0)}
  if(tt>=EV.shops&&tt<EV.door)sign('200 SHOPS WORLDWIDE 🌍',W/2,640,62,tt-EV.shops,0);
  if(tt>=EV.lb&&tt<EV.shops)sign("LEO'S BAKERY 🥖",W/2,640,72,tt-EV.lb,0);
  if(tt>=EV.out+0.9&&tt<EV.silent){const p=prj(LEOR&&LEOR.top);if(p){pill('+1000 AURA 😎',p[1]-90,'rgba(240,170,20,0.92)',58,clamp((tt-EV.out-0.9)*6,0,1),p[0]);for(let i=0;i<4;i++){const a=tt*3+i*1.57;emoji('✨',p[0]+Math.cos(a)*160,p[1]+120+Math.sin(a)*120,48)}}}
  if(tt>=EV.silent&&tt<EV.saw){for(let i=0;i<2;i++){const ph=(tt*1.3+i*0.5)%1;emoji('🦗',260+i*560,900+Math.sin(ph*TAU2)*20,80,Math.sin(Math.PI*ph))}bubbleTxt('*cricket noises*',W/2,700,56,clamp((tt-EV.silent)*4,0,1),'#ffffff')}
  if(tt>=EV.turn+0.4&&tt<EV.cartPan){const p=prj(LEOR&&LEOR.top);if(p)bubbleTxt('!',p[0],p[1]-50,140*popS(tt-EV.turn-0.4),1,'#ff4a4a')}
  if(tt>=EV.reveal&&tt<EV.cant){const p=prj(MAXR&&MAXR.top);if(p)emoji('😳',p[0]+170,p[1]-20,110*popS(tt-EV.reveal))}
  if(tt>=EV.bought+0.15&&tt<EV.said){const p=prj([5.55,1.3,3.35]);if(p)emoji('💰',p[0],p[1]-80,110*popS(tt-EV.bought-0.15))}
  if(tt>=EV.fly+0.8&&tt<EV.never){const p=prj([5.8,2.2,3.6]);if(p)sign('SOLD OUT ✅',p[0],p[1]-60,60,tt-EV.fly-0.8,0)}
  if(tt>=EV.away+0.3&&tt<EV.endc){pill('Part 2? 👀',560,'rgba(15,10,30,0.7)',62,clamp((tt-EV.away-0.3)*4,0,1))}
  // captions
  caption(tt);
  // series tag
  if(tt<3.2){const a=clamp((3.2-tt)/0.4,0,1)*clamp(tt*5,0,1);pill('The Bread Boy 🥖  Part 1',300,'rgba(200,60,40,0.9)',54,a)}
  // vignette
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.32)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  const blk=(t0,d)=>{const k=tt-t0;if(k>-d&&k<d){ctx.fillStyle=`rgba(0,0,0,${1-Math.abs(k)/d})`;ctx.fillRect(0,0,W,H)}};
  blk(EV.night,0.3);blk(EV.kitch,0.25);flash(EV.later,0.9,0.5);flash(EV.reveal,0.5,0.25);flash(EV.gold,0.5,0.3,'255,230,150');flash(EV.never,0.3,0.2);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function bubbleTxt(s,x,y,size,al,col){ctx.save();ctx.globalAlpha=clamp(al,0,1);ctx.translate(x,y);txt(s,0,0,size,col||'#ffffff');ctx.restore()}
function drawEnd(t){const t0=EV.endc;const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.62*k})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=k;const pop=popS(t-t0);ctx.translate(W/2,640);ctx.scale(pop,pop);txt('Should Leo give',0,-100,fitSize('Should Leo give',960,96),'#ffffff');txt('Max a job? 💼',0,10,104,'#ffd84a');ctx.restore();
  const kk=t-t0-0.5;if(kk>0){ctx.save();ctx.globalAlpha=k;pill('✅ YES',960,'rgba(40,160,70,0.92)',70*popS(kk),1,W/2-210);pill('❌ NO',960,'rgba(200,40,40,0.92)',70*popS(kk-0.12),1,W/2+210);ctx.restore()}
  if(t-t0>1.0){ctx.save();ctx.globalAlpha=k*clamp((t-t0-1.0)*3,0,1);txt('👇',W/2,1110+Math.abs(Math.sin((t-t0)*5))*24,110,'#fff','center',900,false);txt('Follow for Part 2 👀',W/2,1500,60,'#ffffff');ctx.restore()}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
