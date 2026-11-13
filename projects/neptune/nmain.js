const FPS=30,DUR=75.6,SUB=1;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
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
// ================= NEPTUNE: meshes =================
const HC=(h)=>hx(h);
function sph(m,R,NA,NO,colFn,mat,skip){const P=(i,j)=>{const th=i/NA*Math.PI,ph=j/NO*TAU2;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};
  for(let i=0;i<NA;i++)for(let j=0;j<NO;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);const cen=V.norm(V.add(V.add(a,b),V.add(c,d)));if(skip&&skip(cen))continue;
    const S=p=>V.sc(p,R);const ca=colFn(a),cb=colFn(b),cc=colFn(c),cd=colFn(d);if(i===0)m.tri(S(a),S(c),S(b),[ca,cc,cb],mat);else if(i===NA-1)m.tri(S(a),S(d),S(b),[ca,cd,cb],mat);else m.quad(S(a),S(d),S(c),S(b),[ca,cd,cc,cb],mat)}}
function nepCol(n){const lat=Math.asin(clamp(n[1],-1,1)),lon=Math.atan2(n[2],n[0]);const w=fbm(lon*2.2+3,lat*9,4);
  let c=mix3(HC('#1d3a9e'),HC('#3c7ae6'),0.5+0.5*Math.sin(lat*11+w*4));c=mix3(c,HC('#5fa8ff'),clamp((fbm(lon*1.5,lat*22,3)-0.55)*2.5,0,1)*0.6);
  // bright cirrus streaks
  const st=fbm(lon*3+lat*0.5,lat*40,3);const band=Math.exp(-Math.pow((Math.abs(lat)-0.42)/0.08,2))+0.6*Math.exp(-Math.pow((lat+0.9)/0.06,2));c=mix3(c,[0.92,0.96,1],clamp((st-0.52)*4,0,1)*band);
  // great dark spot
  const dl=(lat+0.36)/0.1,dlo=(Math.atan2(Math.sin(lon-0.7),Math.cos(lon-0.7)))/0.22;const dd=dl*dl+dlo*dlo;c=mix3(c,HC('#0e1d5a'),clamp(1.3-dd,0,1));if(dd>0.9&&dd<1.6)c=mix3(c,HC('#9fd0ff'),0.35*(1-Math.abs(dd-1.25)/0.35));
  const pole=Math.pow(Math.abs(n[1]),6);c=mix3(c,HC('#2a5ac8'),pole*0.5);return c}
const NEPTUNE=um(m=>sph(m,1,90,180,nepCol,0),0.3);
const CUTSKIP=c=>c[0]>0&&c[2]>0;
const NEPCUT=um(m=>sph(m,1,90,180,nepCol,0,CUTSKIP),0.3);
function layerCol(r){if(r>0.82)return mix3(HC('#3a6ad8'),HC('#6aa8ff'),(r-0.82)/0.18);if(r>0.3){const k=(r-0.3)/0.52;return mix3(HC('#ff7a2a'),HC('#22c8d8'),Math.pow(k,0.7))}return mix3(HC('#5a3a2a'),HC('#9a6a4a'),r/0.3)}
const WEDGE=um(m=>{const NR=60,NT=48;for(const face of[0,1]){for(let i=0;i<NR;i++)for(let j=0;j<NT;j++){const r0=i/NR,r1=(i+1)/NR,a0=j/NT*Math.PI-Math.PI/2,a1=(j+1)/NT*Math.PI-Math.PI/2;
  const P=(r,a)=>face===0?[0,Math.sin(a)*r,Math.cos(a)*r]:[Math.cos(a)*r,Math.sin(a)*r,0];const cr=layerCol((r0+r1)/2),cg=mix3(cr,[1,1,1],0.0);
  const n=hsh(i*7+face,j)*0.06;const col=V.sc(cg,0.94+n);m.quad(P(r0,a0),P(r1,a0),P(r1,a1),P(r0,a1),col,MAT.emis)}}});
const RINGN=um(m=>{const n=180;for(const[r0,r1,a]of[[1.53,1.56,0.5],[2.48,2.56,0.8],[2.0,2.02,0.3]]){for(let i=0;i<n;i++){const a0=i/n*TAU2,a1=(i+1)/n*TAU2;const col=V.sc(HC('#8aa8d8'),a);m.quad([Math.cos(a0)*r0,0,Math.sin(a0)*r0],[Math.cos(a0)*r1,0,Math.sin(a0)*r1],[Math.cos(a1)*r1,0,Math.sin(a1)*r1],[Math.cos(a1)*r0,0,Math.sin(a1)*r0],col,MAT.glass)}}});
// diamond (brilliant-ish: crown + pavilion)
function diamondMesh(m,s){const N=12;const top=0.3*s,bot=-0.8*s,R=0.62*s,Rt=0.36*s;const ring=(r,y,o)=>{const a=[];for(let i=0;i<N;i++){const an=(i+o)/N*TAU2;a.push([Math.cos(an)*r,y,Math.sin(an)*r])}return a};
  const T=ring(Rt,top,0.5),G=ring(R,0,0),Gm=ring(R*1.0,0,0.5);const cr=['#e8f8ff','#9fd8ff','#ffffff','#b8c4ff','#cfeeff','#7fc4ff'].map(HC),pv=['#3a8cf0','#9fe0ff','#2a5ad0','#d8f2ff','#5aa8ff','#c8b8ff','#1e4cc0','#7fd0ff'].map(HC);const tb=HC('#f4fbff');
  for(let i=0;i<N;i++){const j=(i+1)%N;m.tri([0,top,0],T[i],T[j],i%2?tb:HC('#e4f4ff'),MAT.emis);
    const mid=V.sc(V.add(G[i],G[j]),0.5);const midR=V.sc(V.norm([mid[0],0,mid[2]]),R);
    m.tri(T[i],G[i],midR,cr[i%6],MAT.emis);m.tri(T[i],midR,T[j],cr[(i+2)%6],MAT.emis);m.tri(T[j],midR,G[j],cr[(i+4)%6],MAT.emis);
    m.tri(G[j],midR,[0,bot,0],pv[i%8],MAT.emis);m.tri(midR,G[i],[0,bot,0],pv[(i+3)%8],MAT.emis)}}
const DIAMOND=um(m=>diamondMesh(m,1));
const DGLOW=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[6,10]));
// atoms
const ATOM=um(m=>m.ico([0,0,0],1,[1,1,1],0,1,[16,24]),0.6);
const STICK=um(m=>tube(m,[0,0,0],[0,1,0],0.12,0.12,[0.85,0.85,0.9],10),0.5);
const TORUS=um(m=>{const n=96,k=10,R=1,r=0.035;for(let i=0;i<n;i++)for(let j=0;j<k;j++){const P=(a,b)=>{const A=a/n*TAU2,B=b/k*TAU2;return[(R+r*Math.cos(B))*Math.cos(A),r*Math.sin(B),(R+r*Math.cos(B))*Math.sin(A)]};m.quad(P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),[1,1,1],MAT.emis)}});
// mascot Q
const QL=V.norm([-0.45,0.7,0.6]);const QBODY=um(m=>sph(m,1,32,48,n=>{const d=Math.max(0,V.dot(n,QL));const rim=Math.pow(1-Math.max(0,n[2]),3);let c=mix3(HC('#e8780a'),HC('#ffd23a'),clamp(0.25+d*0.9,0,1));c=mix3(c,HC('#fffbe0'),Math.pow(d,10)*0.9);return mix3(c,HC('#ffe9a0'),rim*0.5)},MAT.emis));
const QWHITE=um(m=>sph(m,1,14,22,n=>mix3([0.75,0.78,0.86],[1,1,1],clamp(n[2]*0.8+n[1]*0.3+0.3,0,1)),MAT.emis));
const QDARK=um(m=>sph(m,1,14,22,()=>[0.07,0.05,0.12],MAT.emis));
const QMOUTH=um(m=>{const p=[];for(let i=0;i<=12;i++){const a=Math.PI+0.5+i/12*(Math.PI-1);p.push([Math.cos(a)*0.32,Math.sin(a)*0.2,0])}for(let i=0;i<12;i++)tube(m,p[i],p[i+1],0.045,0.045,[0.42,0.14,0.05],6,MAT.emis)});
// lab
const LABTABLE=um(m=>{m.box([0,0.9,0],[6,0.15,2.4],HC('#3a3f4a'),0,0,HC('#5a606c'));for(const sx of[-1,1])for(const sz of[-1,1])m.box([sx*2.8,0.45,sz*1.0],[0.15,0.9,0.15],HC('#2a2e36'))});
const LASER=um(m=>{m.box([0,0,0],[2.2,0.7,0.8],HC('#d8dce4'),0,0,HC('#eef0f4'));m.box([1.15,0,0],[0.2,0.5,0.5],HC('#2a2e36'));m.box([-0.3,0.37,0],[1.2,0.04,0.6],HC('#e8b830'));for(let i=0;i<3;i++)m.box([-0.8+i*0.25,0,0.41],[0.12,0.12,0.02],[0.2,1,0.4],MAT.emis)});
const SAMPLE=um(m=>{m.box([0,0,0],[0.15,0.9,0.9],HC('#c8d0e0'));m.box([-0.1,0,0],[0.06,1.1,1.1],HC('#5a606c'))});
const BEAM=um(m=>tube(m,[0,0,0],[1,0,0],0.06,0.06,[1,1,1],10,MAT.emis));
// galaxy points
const GALAXY=um(m=>{const r=rngG(5);for(let i=0;i<5200;i++){const arm=i%3,t=r();const ang=arm/3*TAU2+t*7.5+(r()-0.5)*0.55;const d=0.05+t*1.0;const y=(r()-0.5)*0.05*(1.2-t);const p=[Math.cos(ang)*d,y,Math.sin(ang)*d];
  const c=t<0.15?mix3(HC('#fff0c8'),HC('#ffd890'),r()):mix3(HC('#a8c8ff'),HC('#ffe8f8'),r()*0.6);const s=0.004+r()*0.006;m.ico(p,s,c,MAT.emis,1,[2,3])}
  for(let i=0;i<500;i++){const a=r()*TAU2,d=Math.sqrt(r())*0.18;m.ico([Math.cos(a)*d,(r()-0.5)*0.06,Math.sin(a)*d],0.007,HC('#fff4d8'),MAT.emis,1,[2,3])}});
const STARFIELD=um(m=>{const r=rngG(9);for(let i=0;i<900;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const p=[s*Math.cos(a)*400,u*400,s*Math.sin(a)*400];m.ico(p,0.4+r()*0.9,mix3([1,1,1],[0.7,0.8,1],r()),MAT.emis,1,[2,3])}});
const SUNM=um(m=>m.ico([0,0,0],1,HC('#fff6e0'),MAT.emis,1,[12,18]));
const CLOUDP=um(m=>{const r=rngG(17);for(let k=0;k<9;k++){const x=(k-4)*0.32+(r()-0.5)*0.2,y=0.18*Math.cos((k-4)*0.4)+(r()-0.5)*0.1,z=(r()-0.5)*0.4,rr=0.5-Math.abs(k-4)*0.05+r()*0.08;
  blob(m,[x,y,z],rr,p=>mix3(HC('#1c3c96'),HC('#e4f0ff'),clamp((p[1]+0.25)*1.4,0,1)),k*3.1,0.75,[14,22])}},0.6);
const EBOX=um(m=>m.box([0,0,0],[1,1,1],[1,1,1],MAT.emis));
const VO=[{"t": 0.3, "d": 5.103, "w": [["It", 0.3, 0.659], ["rains", 0.659, 1.088], ["diamonds", 1.088, 1.51], ["on", 1.51, 1.769], ["Neptune.", 1.769, 2.29], ["Real", 2.64, 2.869], ["diamonds.", 2.869, 3.24], ["And", 3.35, 3.92], ["no,", 3.92, 4.09], ["this", 4.3, 4.502], ["is", 4.502, 4.704], ["not", 4.704, 4.906], ["a", 4.906, 5.108], ["joke!", 5.108, 5.4]]}, {"t": 5.85, "d": 4.28, "w": [["Neptune", 5.85, 6.176], ["is", 6.176, 6.376], ["the", 6.376, 6.577], ["farthest", 6.577, 6.903], ["planet", 6.903, 7.318], ["from", 7.318, 7.519], ["the", 7.519, 7.719], ["Sun.", 7.719, 7.92], ["Four", 8.2, 8.369], ["and", 8.369, 8.538], ["a", 8.538, 8.707], ["half", 8.707, 9.066], ["billion", 9.066, 9.34], ["kilometers", 9.34, 9.826], ["away.", 9.826, 10.1]]}, {"t": 10.53, "d": 7.704, "w": [["Up", 10.53, 10.565], ["there,", 10.565, 10.6], ["it's", 10.71, 11.042], ["minus", 11.042, 11.581], ["two", 11.581, 11.912], ["hundred", 11.912, 12.451], ["degrees,", 12.451, 12.99], ["and", 13.25, 13.447], ["the", 13.447, 13.643], ["winds", 13.643, 13.84], ["hit", 13.84, 14.136], ["over", 14.136, 14.456], ["two", 14.456, 14.892], ["thousand", 14.892, 15.212], ["kilometers", 15.212, 15.777], ["per", 15.777, 15.973], ["hour.", 15.973, 16.17], ["The", 16.52, 16.699], ["fastest", 16.699, 16.99], ["in", 16.99, 17.169], ["the", 17.169, 17.348], ["whole", 17.348, 17.638], ["solar", 17.638, 17.929], ["system!", 17.929, 18.22]]}, {"t": 18.68, "d": 7.016, "w": [["But", 18.68, 18.815], ["the", 18.815, 18.949], ["craziest", 18.949, 19.168], ["part", 19.168, 19.303], ["is", 19.303, 19.438], ["hidden", 19.438, 19.656], ["deep", 19.656, 19.791], ["inside.", 19.791, 20.01], ["Under", 20.1, 20.391], ["the", 20.391, 20.571], ["clouds,", 20.571, 20.75], ["there's", 21.42, 22.083], ["a", 22.083, 22.492], ["hot,", 22.492, 22.9], ["dense", 23.03, 23.567], ["ocean", 23.567, 24.26], ["of", 24.26, 24.687], ["water,", 24.687, 25.38], ["ammonia", 25.47, 25.562], ["and", 25.562, 25.603], ["methane.", 25.603, 25.67]]}, {"t": 26.1, "d": 5.536, "w": [["Go", 26.1, 26.529], ["thousands", 26.529, 26.852], ["of", 26.852, 27.05], ["kilometers", 27.05, 27.621], ["down,", 27.621, 27.82], ["and", 27.95, 28.288], ["the", 28.288, 28.506], ["pressure", 28.506, 28.86], ["gets", 28.86, 29.078], ["so", 29.078, 29.296], ["insane,", 29.296, 29.65], ["it", 29.91, 30.104], ["literally", 30.104, 30.664], ["rips", 30.664, 30.858], ["methane", 30.858, 31.174], ["apart.", 31.174, 31.6]]}, {"t": 31.99, "d": 4.444, "w": [["And", 31.99, 32.134], ["the", 32.134, 32.278], ["carbon", 32.278, 32.512], ["that's", 32.512, 32.656], ["left?", 32.656, 32.8], ["Scientists", 33.19, 33.553], ["think", 33.553, 33.777], ["it", 33.777, 34.09], ["gets", 34.09, 34.314], ["squeezed", 34.314, 34.677], ["together...", 34.677, 35.18], ["into", 35.45, 35.885], ["diamonds!", 35.885, 36.43]]}, {"t": 36.83, "d": 8.803, "w": [["Then", 36.83, 36.937], ["they", 36.937, 37.043], ["fall.", 37.043, 37.15], ["Diamonds,", 37.25, 37.47], ["sinking", 37.85, 38.348], ["through", 38.348, 38.654], ["the", 38.654, 38.96], ["planet", 38.96, 39.458], ["like", 39.458, 39.764], ["rain.", 39.764, 40.07], ["Over", 40.9, 41.475], ["thousands", 41.475, 41.93], ["of", 41.93, 42.21], ["years,", 42.21, 42.49], ["they", 42.58, 42.757], ["might", 42.757, 42.935], ["pile", 42.935, 43.223], ["up", 43.223, 43.4], ["into", 43.4, 43.869], ["a", 43.869, 44.046], ["whole", 44.046, 44.334], ["layer", 44.334, 44.511], ["of", 44.511, 44.689], ["diamond", 44.689, 44.977], ["around", 44.977, 45.265], ["the", 45.265, 45.443], ["core.", 45.443, 45.62]]}, {"t": 46.08, "d": 10.221, "w": [["Sounds", 46.09, 46.38], ["fake?", 46.38, 46.67], ["In", 47.05, 47.374], ["twenty", 47.374, 47.901], ["seventeen,", 47.901, 48.63], ["scientists", 48.76, 49.063], ["actually", 49.063, 49.483], ["did", 49.483, 49.76], ["it", 49.76, 49.947], ["on", 49.947, 50.133], ["Earth.", 50.133, 50.32], ["They", 50.59, 50.822], ["blasted", 50.822, 51.198], ["plastic", 51.198, 51.574], ["with", 51.574, 51.806], ["super", 51.806, 52.182], ["powerful", 52.182, 52.704], ["lasers,", 52.704, 53.08], ["and", 53.19, 53.389], ["for", 53.389, 53.588], ["a", 53.588, 53.787], ["split", 53.787, 53.986], ["second...", 53.986, 54.31], ["tiny", 54.75, 55.164], ["diamonds", 55.164, 55.577], ["appeared!", 55.577, 56.27]]}, {"t": 56.7, "d": 3.539, "w": [["And", 56.7, 56.954], ["on", 56.954, 57.208], ["Neptune,", 57.208, 57.62], ["some", 57.86, 58.078], ["of", 58.078, 58.296], ["these", 58.296, 58.514], ["diamonds", 58.514, 58.868], ["could", 58.868, 59.086], ["weigh", 59.086, 59.304], ["millions", 59.304, 59.658], ["of", 59.658, 59.876], ["carats.", 59.876, 60.23]]}, {"t": 60.64, "d": 8.938, "w": [["Here's", 60.66, 61.032], ["the", 61.032, 61.262], ["wild", 61.262, 61.491], ["part:", 61.491, 61.81], ["planets", 62.14, 62.507], ["like", 62.507, 62.734], ["Neptune", 62.734, 63.101], ["might", 63.101, 63.327], ["be", 63.327, 63.553], ["the", 63.553, 63.779], ["most", 63.779, 64.095], ["common", 64.095, 64.463], ["type", 64.463, 64.689], ["in", 64.689, 64.915], ["our", 64.915, 65.141], ["galaxy.", 65.141, 65.65], ["So", 66.06, 66.29], ["right", 66.29, 66.52], ["now,", 66.52, 66.75], ["it", 66.87, 67.07], ["could", 67.07, 67.269], ["be", 67.269, 67.469], ["raining", 67.469, 67.793], ["diamonds", 67.793, 68.117], ["all", 68.117, 68.597], ["over", 68.597, 68.921], ["the", 68.921, 69.121], ["universe.", 69.121, 69.57]]}, {"t": 70.13, "d": 3.957, "w": [["Next", 70.13, 70.305], ["time:", 70.305, 70.48], ["what", 70.48, 70.805], ["happens", 70.805, 71.089], ["if", 71.089, 71.264], ["you", 71.264, 71.439], ["fall", 71.439, 71.613], ["into", 71.613, 71.898], ["a", 71.898, 72.072], ["black", 72.072, 72.247], ["hole?", 72.247, 72.531], ["Follow,", 72.531, 72.816], ["so", 72.816, 73.381], ["you", 73.381, 73.555], ["don't", 73.555, 73.73], ["miss", 73.73, 73.905], ["it!", 73.905, 74.08]]}];
// ================= NEPTUNE: timeline, scenes, camera =================
const EV={fly:5.85,close:10.53,dive:18.68,cut:20.65,meth:26.1,split:30.61,form:31.99,gem:35.4,sink:36.83,layer:40.8,lab:46.08,fire:52.6,giant:56.7,galaxy:60.64,endc:69.73,loop:75.19};
const R=10;
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function scn(t){if(t<EV.fly)return'rain';if(t<EV.dive+1.9)return t<EV.dive?'space':'dive';if(t<EV.meth)return'cut';if(t<EV.sink)return'deep';if(t<EV.lab)return'sink';if(t<EV.giant)return'lab';if(t<EV.galaxy)return'giant';return'galaxy'}
const CLOUDSHELL=um(m=>sph(m,1,90,180,()=>[0.95,0.98,1],0,c=>{const lat=Math.asin(clamp(c[1],-1,1)),lon=Math.atan2(c[2],c[0]);const st=fbm(lon*3.3+lat*0.6+9,lat*38,3);const band=Math.exp(-Math.pow((Math.abs(lat)-0.4)/0.1,2))+0.5*Math.exp(-Math.pow((lat-0.15)/0.05,2));return !(st>0.6&&band>0.4)}),0.3);
// ---------- env ----------
function envBase(){return{sun:[0.85,0.25,-0.45],sunCol:hx('#fff4e4'),sky:hx('#3a6ad0'),gnd:hx('#050816'),fog:hx('#000004'),fogD:1e7,zen:hx('#000004'),hor:hx('#04061a'),stars:1,night:0,emis:1.0,ground:0,sunSize:0.6,fillD:[-0.6,0.2,0.6],fillC:[0.02,0.03,0.07]}}
const E_SPACE=envBase();
const E_RAIN=Object.assign(envBase(),{sun:[0.2,1,0.15],sunCol:hx('#d8ecff'),sky:hx('#5aa0ff'),gnd:hx('#0a1a50'),fog:hx('#0b2a72'),fogD:38,zen:hx('#03103a'),hor:hx('#1a56b8'),stars:0,sunSize:3,fillC:[0.1,0.2,0.45],fillD:[0,-1,0.3]});
const E_DEEP=Object.assign(envBase(),{sun:[-0.4,0.8,-0.5],sunCol:hx('#fff0e0'),sky:hx('#9a7a80'),gnd:hx('#3a1a10'),fog:hx('#2a1208'),fogD:80,zen:hx('#0a0310'),hor:hx('#5a1e10'),stars:0,sunSize:3,fillC:[0.5,0.3,0.15],fillD:[0.6,-0.2,-0.8]});
const E_LAB=Object.assign(envBase(),{sun:[0.3,0.9,-0.4],sunCol:hx('#dfe8ff'),sky:hx('#6a7aa0'),gnd:hx('#1a1e2a'),fog:hx('#070a14'),fogD:60,zen:hx('#05070e'),hor:hx('#0e1424'),stars:0,sunSize:3,fillC:[0.15,0.35,0.5],fillD:[-0.5,0.2,-1]});
function envAt(t){const S=scn(t);if(S==='rain')return E_RAIN;if(S==='deep')return E_DEEP;if(S==='lab')return E_LAB;if(S==='giant')return Object.assign({},E_RAIN,{fogD:200,zen:hx('#02041a'),hor:hx('#0a2470')});return E_SPACE}
// ---------- camera ----------
function camAt(t){const S=scn(t);
  if(S==='rain'){const k=t/EV.fly;return{eye:[0,1.0-k*1.2,-2],at:[0.2,-0.6-k*0.8,10],fov:0.95}}
  if(S==='space'&&t<EV.close){const k=ease(seg(t,EV.fly,EV.close));return{eye:lerp3([-8,10,-140],[-14,4,-42],k),at:lerp3([0,0,0],[0,0.5,0],k),fov:0.75}}
  if(S==='space'){const k=ease(seg(t,EV.close,EV.dive));const a=-1.9+k*0.9;const d=lerp(36,25,k);return{eye:[Math.cos(a)*d,lerp(4.5,2.6,k),Math.sin(a)*d],at:[0,lerp(0.5,-0.5,k),0],fov:0.85}}
  if(S==='dive'){const k=easeIn2(seg(t,EV.dive,EV.dive+1.9));const a=-1.0;const d=lerp(25,10.3,k);return{eye:[Math.cos(a)*d,2.6-k*2.2,Math.sin(a)*d],at:[0,-0.5,0],fov:0.85+k*0.3}}
  if(S==='cut'||S==='sink'){const t0=S==='cut'?EV.cut:EV.sink,t1=S==='cut'?EV.meth:EV.lab;const k=ease(seg(t,t0,t1));const d=S==='cut'?lerp(46,38,k):lerp(40,27,k);const dir=V.norm(S==='cut'?[1,0.5,0.42]:[1,0.45,0.5]);const tgt=S==='sink'?[R*0.12*k,R*0.05,R*0.12*k]:[0,0,0];return{eye:V.add(tgt,V.sc(dir,d)),at:tgt,fov:0.8}}
  if(S==='deep'){const k=seg(t,EV.meth,EV.sink);const a=k*1.2;return{eye:[Math.sin(a)*7,1.2+Math.sin(k*3)*0.4,-Math.cos(a)*7],at:[0,0,0],fov:0.8}}
  if(S==='lab'){const k=ease(seg(t,EV.lab,EV.giant));return{eye:lerp3([-5.5,3.2,-6.5],[1.8,2.0,-3.2],k),at:lerp3([0,1.4,0],[1.6,1.4,0],k),fov:0.85}}
  if(S==='giant'){const k=seg(t,EV.giant,EV.galaxy);return{eye:[Math.sin(k)*1.5,0.8,-9+k*1.5],at:[0,0,0],fov:0.8}}
  const k=ease(seg(t,EV.galaxy,EV.endc+3));return{eye:[0,lerp(16,36,k),lerp(-20,-30,k)],at:[0,0,lerp(-2,1,k)],fov:0.85}}
function easeIn2(x){x=clamp(x,0,1);return x*x}
// ---------- mascot Q ----------
let QR=null;
function camBasis(cm){const f=V.norm(V.sub(cm.at,cm.eye));const r=V.norm(V.cross(f,[0,1,0]));const u=V.cross(r,f);return{f,r,u}}
function qItems(items,t,cm,o){const b=camBasis(cm);const d=o.d||3;const tanH=Math.tan(cm.fov/2)*d,tanW=tanH*W/H;const bob=Math.sin(t*2.2)*0.04;
  const p=V.add(cm.eye,V.add(V.sc(b.f,d),V.add(V.sc(b.r,-o.x*tanW),V.sc(b.u,o.y*tanH+bob))));const s=(o.s||0.16)*d/3*(o.pop==null?1:o.pop);if(s<=0.001)return;
  const toC=V.sc(b.f,-1);const rx=V.norm(V.cross([0,1,0],toC)),ry=V.cross(toC,rx);const tilt=Math.sin(t*1.7)*0.12;
  const rot=(v)=>V.add(V.add(V.sc(rx,v[0]),V.sc(ry,v[1])),V.sc(toC,v[2]));const Mx=(lp,sc)=>{const c=V.add(p,V.sc(rot(lp),s));const X=V.sc(rx,s*sc[0]),Y=V.sc(ry,s*sc[1]),Z=V.sc(toC,s*sc[2]);return[X[0],X[1],X[2],0,Y[0],Y[1],Y[2],0,Z[0],Z[1],Z[2],0,c[0],c[1],c[2],1]};
  items.push({mesh:QBODY,M:Mx([0,0,0],[1,1,1])});
  // rings
  const cols=[[0.35,0.95,1],[1,0.85,0.3],[1,0.4,0.6]];for(let i=0;i<3;i++){const a=t*1.4+i*TAU2/3;const ax=V.norm([Math.cos(i*2.1),0.6,Math.sin(i*2.1)]);
    const R0=1.75;const M0=M4.mul(M4.trs([0,0,0],a,i*1.05+0.4,0.3*i,R0),M4.id());const base=[R0,0,0,0,0,R0,0,0,0,0,R0,0,0,0,0,1];
    const L=M4.trs([0,0,0],a+i,0.9+i*0.5,i*0.8,R0);const W2=[rx[0]*s,rx[1]*s,rx[2]*s,0,ry[0]*s,ry[1]*s,ry[2]*s,0,toC[0]*s,toC[1]*s,toC[2]*s,0,p[0],p[1],p[2],1];items.push({mesh:TORUS,M:M4.mul(W2,L),tint:cols[i],tintAmt:1})}
  const ex=o.expr||'open';const blink=(t%3.1)<0.12;
  for(const sx of[-1,1]){if(ex==='happy'){items.push({mesh:QDARK,M:Mx([sx*0.36,0.22,0.9],[0.2,0.06,0.06])})}else{const big=ex==='wide'?1.25:1;items.push({mesh:QWHITE,M:Mx([sx*0.36,0.2,0.84],[0.27*big,blink?0.04:0.32*big,0.18])});if(!blink){items.push({mesh:QDARK,M:Mx([sx*0.34,0.17,0.99],[0.13*big,0.16*big,0.06])});items.push({mesh:QWHITE,M:Mx([sx*0.3,0.24,1.04],[0.045,0.045,0.03])})}}}
  if(ex==='wide'||ex==='o')items.push({mesh:QDARK,M:Mx([0,-0.32,0.93],[0.14,0.17,0.06])});else items.push({mesh:QMOUTH,M:Mx([0,-0.25,0.94],[1,1,1])});
  QR={p,s}}
// ---------- items ----------
const RAIN=[];{const r=rngG(3);for(let i=0;i<70;i++)RAIN.push({x:(r()-0.5)*9,z:2+r()*20,y0:r()*14,v:1.2+r()*1.4,s:0.12+r()*0.22,rs:(r()-0.5)*4,ph:r()*6})}
const CL=[];{const r=rngG(4);for(let i=0;i<26;i++)CL.push({x:(r()-0.5)*40,y:-2-r()*12,z:10+r()*30,s:2+r()*4,v:0.2+r()*0.4})}
function rainPos(d,t){const span=14;const y=6-(((d.y0+t*d.v)%span)+span)%span;return[d.x,y,d.z]}
let GLINTS=[];
function addDiamond(items,p,s,t,rs,ph,glow){items.push({mesh:DIAMOND,M:M4.trs(p,t*rs+ph,0.5+Math.sin(t+ph)*0.3,0.2,s),noShadow:true});GLINTS.push([p,s,ph])}
function planetItems(items,t,cut){const rot=t*0.05;const M=M4.trs([0,0,0],rot+(cut?-rot-0.0:0),0,0,R);
  if(cut){items.push({mesh:NEPCUT,M:M4.trs([0,0,0],0,0,0,R)});items.push({mesh:WEDGE,M:M4.trs([0,0,0],0,0,0,R)})}
  else{items.push({mesh:NEPTUNE,M});items.push({mesh:RINGN,M:M4.trs([0,0,0],0,0.42,0.12,R),alpha:0.35,noShadow:true})}}
function fgItems(t){const items=[];GLINTS=[];const S=scn(t);const cm=camAt(t);QR=null;
  if(S==='rain'){for(const c of CL){items.push({mesh:CLOUDP,M:M4.trs([c.x+t*c.v,c.y,c.z],0,0,0,c.s),tint:hx('#3a6ad0'),tintAmt:0.7,noShadow:true})}
    for(const d of RAIN)addDiamond(items,rainPos(d,t),d.s,t,d.rs,d.ph,true);
    qItems(items,t,cm,{x:-0.62,y:-0.6,s:0.15,expr:'wide',pop:ease(seg(t,1.3,1.7))})}
  else if(S==='space'||S==='dive'){items.push({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});planetItems(items,t,false);
    if(S==='space'&&t>=EV.close+0.5&&t<EV.dive-0.3)qItems(items,t,cm,{x:-0.62,y:-0.6,s:0.13,expr:'o',pop:ease(seg(t,EV.close+0.5,EV.close+0.9))})}
  else if(S==='cut'||S==='sink'){items.push({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});planetItems(items,t,true);
    if(S==='sink'){const r=rngG(11);const dirs=[];for(let i=0;i<46;i++){const face=i%2,ang=(r()-0.5)*Math.PI*0.95,ph=r(),sp=0.06+r()*0.05;let rr=0.8-((ph+(t-EV.sink)*sp)%0.5);const k=clamp(rr,0.33,0.8);const off=0.012;
        const p=face===0?[off*R,Math.sin(ang)*k*R,Math.cos(ang)*k*R]:[Math.cos(ang)*k*R,Math.sin(ang)*k*R,off*R];if(Math.cos(ang)<0.05)continue;addDiamond(items,p,0.22+r()*0.15,t,2,i,false)}
      const lay=seg(t,EV.layer,EV.lab-0.5);if(lay>0){for(const face of[0,1]){const n=40;for(let j=0;j<n;j++){const a=-Math.PI/2+j/n*Math.PI;const rr=0.31+lay*0.035*hsh(j,face);const p=face===0?[0.013*R,Math.sin(a)*rr*R,Math.cos(a)*rr*R]:[Math.cos(a)*rr*R,Math.sin(a)*rr*R,0.013*R];if(Math.cos(a)<0.02)continue;items.push({mesh:DIAMOND,M:M4.trs(p,j,0.3,0,0.18*lay+0.02),noShadow:true});GLINTS.push([p,0.12,j])}}}}
    if(S==='cut'&&t>EV.cut+1)qItems(items,t,cm,{x:0.6,y:-0.6,s:0.13,expr:'open',pop:ease(seg(t,EV.cut+1,EV.cut+1.4))})}
  else if(S==='deep'){deepItems(items,t,cm)}
  else if(S==='lab'){labItems(items,t)}
  else if(S==='giant'){const k=ease(seg(t,EV.giant,EV.giant+0.8));addDiamond(items,[0,0,0],3.2*k+0.01,t*0.4,1,0,false);for(const d of RAIN.slice(0,40))addDiamond(items,V.add(rainPos(d,t),[0,0,6]),d.s,t,d.rs,d.ph,false);
    for(const c of CL){items.push({mesh:CLOUDP,M:M4.trs([c.x*0.6+t*c.v,c.y*0.5+3,c.z+6],0,0,0,c.s),tint:hx('#2a5ab0'),tintAmt:0.7,noShadow:true})}
    qItems(items,t,cm,{x:0.6,y:-0.6,s:0.14,expr:'wide',pop:ease(seg(t,EV.giant+0.6,EV.giant+1.0))})}
  else{items.push({mesh:STARFIELD,M:M4.trs(cm.eye,0,0,0,1),noShadow:true});
    if(t>=EV.endc)qItems(items,t,cm,{x:0,y:-0.36,s:0.16,expr:'happy',pop:ease(seg(t,EV.endc+0.3,EV.endc+0.8))})}
  return items}
// methane & diamond formation
const HDIR=[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]].map(V.norm);
const LAT=[];{for(let i=0;i<14;i++){const a=i/14*TAU2*2.3,y=(i%3-1)*0.7;LAT.push([Math.cos(a)*(0.9+0.2*(i%2)),y,Math.sin(a)*(0.9+0.2*(i%2))])}}
function deepItems(items,t,cm){const lt=t-EV.meth;const sq=t<EV.split?1-0.12*seg(t,EV.meth+0.5,EV.split)*(0.6+0.4*Math.sin(t*30)):1;
  // background hot particles
  
  if(t<EV.form){const ox=0;// methane molecule
    const C0=[ox,0,0];const sp=t<EV.split?1:1+(t-EV.split)*6;items.push({mesh:ATOM,M:M4.trs(C0,0,0,0,0.75*sq),tint:hx('#7a8090'),tintAmt:1});
    HDIR.forEach((d,i)=>{const hp=V.add(C0,V.sc(d,1.55*sq*sp));const a=t<EV.split?1:clamp(1-(t-EV.split)*0.8,0,1);if(a<=0)return;items.push({mesh:ATOM,M:M4.trs(hp,0,0,0,0.45*sq),tint:[1,1,1],tintAmt:1});
      if(t<EV.split){const bl=1.55*sq;const dirn=d;const up=[0,1,0];const ax=V.norm(V.cross(up,dirn));const ang=Math.acos(clamp(V.dot(up,dirn),-1,1));// stick along d
        const M=stickM(C0,hp);items.push({mesh:STICK,M})}});
    if(t>=EV.split){for(let i=0;i<7;i++){const k=seg(t,EV.split+0.3+i*0.15,EV.split+0.9+i*0.15);const from=V.sc(V.norm([Math.cos(i*0.9),Math.sin(i*1.7)*0.5,Math.sin(i*0.9)]),14);const to=V.sc(LAT[i],1.6);const p=lerp3(from,to,ease(k));if(k>0)items.push({mesh:ATOM,M:M4.trs(p,0,0,0,0.5),tint:hx('#7a8090'),tintAmt:1})}}}
  else{const k=seg(t,EV.form,EV.gem);const shrink=1-0.55*ease(k);if(t<EV.gem){LAT.forEach((q,i)=>{const p=V.sc(q,1.6*shrink);items.push({mesh:ATOM,M:M4.trs(p,0,0,0,0.5*shrink+0.05),tint:mix3(hx('#7a8090'),[0.8,0.95,1],k),tintAmt:1});const j=(i+1)%LAT.length;if(i%2===0)items.push({mesh:STICK,M:stickM(p,V.sc(LAT[j],1.6*shrink),0.7)})})}
    else{const g=ease(seg(t,EV.gem,EV.gem+0.4));addDiamond(items,[0,0,0],1.9*g+0.01,t*0.7,1,0,false);}
    if(t>=EV.gem+0.3)qItems(items,t,cm,{x:0.62,y:-0.6,s:0.14,expr:'happy',pop:ease(seg(t,EV.gem+0.3,EV.gem+0.7))})}}
function stickM(a,b,w){const d=V.sub(b,a),L=V.len(d);const y=V.norm(d);const tmp=Math.abs(y[1])<0.9?[0,1,0]:[1,0,0];const x=V.norm(V.cross(tmp,y)),z=V.cross(x,y);const s=w||1;return[x[0]*s,x[1]*s,x[2]*s,0,y[0]*L,y[1]*L,y[2]*L,0,z[0]*s,z[1]*s,z[2]*s,0,a[0],a[1],a[2],1]}
function labItems(items,t){items.push({mesh:UB,M:M4.trs([0,-0.05,0],0,0,0,[40,0.1,40]),tint:hx('#1a1e26'),tintAmt:1});items.push({mesh:UB,M:M4.trs([0,6,8],0,0,0,[40,12,0.2]),tint:hx('#1c2232'),tintAmt:1});
  for(let i=-3;i<=3;i++){items.push({mesh:EBOX,M:M4.trs([i*3.2,4.6,7.85],0,0,0,[2.6,0.08,0.05]),tint:[0.55,0.85,1],tintAmt:1});items.push({mesh:UB,M:M4.trs([i*3.2,2.4,7.85],0,0,0,[2.4,3.2,0.1]),tint:hx('#262d40'),tintAmt:1})}
  for(const[x,w]of[[-3.2,1.8],[3.2,1.8]]){items.push({mesh:EBOX,M:M4.trs([x,2.6,7.78],0,0,0,[w,1.1,0.02]),tint:hx('#0a2a40'),tintAmt:1});for(let k=0;k<5;k++)items.push({mesh:EBOX,M:M4.trs([x-0.6+k*0.3,2.3+0.25*hsh(k,x>0?1:2)+0.12*Math.sin(t*3+k),7.76],0,0,0,[0.16,0.25+0.5*hsh(k,x>0?3:4)+0.1*Math.sin(t*2.3+k*1.7),0.02]),tint:k%2?[0.35,1,0.6]:[0.35,0.85,1],tintAmt:1})}
  items.push({mesh:EBOX,M:M4.trs([0,0.02,0],0,0,0,[7,0.02,0.05]),tint:[0.3,0.8,1],tintAmt:1});
  items.push({mesh:LABTABLE,M:M4.trs([0,0,0],0,0,0,1)});items.push({mesh:LASER,M:M4.trs([-1.6,1.33,0],0,0,0,1)});items.push({mesh:SAMPLE,M:M4.trs([2.2,1.42,0],0,0,0,1)});
  // vacuum chamber ring around sample
  items.push({mesh:TORUS,M:M4.trs([2.2,1.42,0],0,0,Math.PI/2,0.75),tint:[0.4,0.5,0.6],tintAmt:1});
  const f=t-EV.fire;if(f>-0.4&&f<1.2){const len=clamp((f+0.4)/0.25,0,1)*2.95;const a=f<0.8?1:clamp((1.2-f)/0.4,0,1);items.push({mesh:BEAM,M:M4.mul(M4.trs([-0.45,1.33,0],0,0,0,1),[len,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),tint:[0.4,1,0.5],tintAmt:1,alpha:a,add:1,noShadow:true});items.push({mesh:BEAM,M:M4.mul(M4.trs([-0.45,1.33,0],0,0,0,1),[len,0,0,0,0,3,0,0,0,0,3,0,0,0,0,1]),tint:[0.3,1,0.4],tintAmt:1,alpha:0.25*a,add:1,noShadow:true})}
  if(f>0.15){for(let i=0;i<16;i++){const k=clamp((f-0.15)*0.6,0,1);const a=i/16*TAU2;const d=0.2+k*(0.6+hsh(i,2)*0.6);const p=[2.0-k*0.4,1.42+Math.sin(a)*d,Math.cos(a)*d];addDiamond(items,p,0.06*(1-k*0.3),t,3,i,true)}}}
// ================= NEPTUNE: overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.16?0.6+0.4*easeOut(k/0.16)+Math.sin(k/0.16*Math.PI)*0.14:1}
function glowAt(p,r,col,a){if(r<=0||a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function star4(x,y,s,a){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;ctx.translate(x,y);const g=ctx.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(200,230,255,0)');ctx.fillStyle=g;
  for(const r of[0,Math.PI/2]){ctx.save();ctx.rotate(r);ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*0.08,s,0);ctx.quadraticCurveTo(0,s*0.08,-s,0);ctx.fill();ctx.restore()}ctx.beginPath();ctx.arc(0,0,s*0.18,0,7);ctx.fill();ctx.restore()}
function fitS(s,maxW,size,font){ctx.font=`${font||'900'} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
// captions: 1-3 words, big, center
const KEY=new Set(['DIAMONDS','NEPTUNE','FARTHEST','BILLION','MINUS','FASTEST','WINDS','THOUSAND','DEEP','INSIDE','OCEAN','PRESSURE','METHANE','CARBON','DIAMOND','FALL','RAIN','CORE','LAYER','LASERS','PLASTIC','TINY','MILLIONS','CARATS','COMMON','GALAXY','UNIVERSE','BLACK','HOLE','2017','TWENTY','SEVENTEEN','REAL','INSANE','FAKE','WILD','CRAZIEST','RIPS','LITERALLY','JOKE']);
const GROUPS=[];{for(const c of VO){let g=null;for(const[w,a,b]of c.w){const cl=w.replace(/["]/g,'');if(!g||g.words.length>=2||g.len+cl.length>12||/[.,!?:]$/.test(g.words[g.words.length-1])){g={words:[],a,b,len:0};GROUPS.push(g)}g.words.push(cl);g.b=b;g.len+=cl.length+1}}}
function caption(t){for(let i=0;i<GROUPS.length;i++){const g=GROUPS[i];const nx=i+1<GROUPS.length?GROUPS[i+1].a:g.b+0.4;if(t>=g.a-0.05&&t<Math.min(nx,g.b+0.4)){
  const ws=g.words.map(w=>w.replace(/[.,:!?]+$/,'').replace(/\.\.\.$/,'').toUpperCase());let size=118;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const wd=ws.map(w=>ctx.measureText(w).width);const tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  const sc=Math.min(1,940/tot)*popS(t-g.a+0.05);ctx.translate(W/2,1270);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const key=KEY.has(w.replace(/[^A-Z0-9]/g,''));ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(w,x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=key?'#ffd84a':'#ffffff';ctx.fillText(w,x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}}
function statCard(lab,val,col,k,y){if(k<=0)return;const s=popS(k);ctx.save();ctx.translate(W/2,y||330);ctx.scale(s,s);const vs=fitS(val,820,70);ctx.font=`900 ${vs}px Inter`;const w=Math.max(ctx.measureText(val).width,360)+90;ctx.fillStyle='rgba(8,10,30,0.82)';rrect(-w/2,-80,w,160,34);ctx.fill();ctx.strokeStyle='rgba(90,240,255,0.45)';ctx.lineWidth=3;rrect(-w/2,-80,w,160,34);ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='800 34px Inter';ctx.fillStyle='rgba(200,230,255,0.9)';ctx.fillText(lab,0,-40);ctx.font=`900 ${vs}px Inter, "Noto Color Emoji"`;ctx.fillStyle=col||'#ffd84a';ctx.fillText(val,0,22);ctx.restore()}
function tag(s,p,col,a){if(!p)return;ctx.save();ctx.globalAlpha=a;ctx.font='900 34px Inter';const w=ctx.measureText(s).width+40;ctx.fillStyle='rgba(8,10,30,0.8)';rrect(p[0]-w/2,p[1]-28,w,56,28);ctx.fill();ctx.fillStyle=col||'#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,p[0],p[1]+2);ctx.restore()}
const GST=[];{const r=rngG(5);for(let i=0;i<14000;i++){const arm=i%3,t=Math.pow(r(),0.8);const ang=arm/3*TAU2+t*7.5+(r()-0.5)*(0.22+t*0.18);const d=0.04+t*1.0;const sp=(r()-0.5)*0.05*(1-t*0.4);const y=(r()-0.5)*0.04*(1.2-t);
  GST.push([Math.cos(ang)*d+sp,y,Math.sin(ang)*d+sp*0.7,t<0.18?0:r()<0.12?2:1,0.5+r()*1.6,r()*6])}
  for(let i=0;i<3000;i++){const a=r()*TAU2,d=Math.pow(r(),1.6)*0.22;GST.push([Math.cos(a)*d,(r()-0.5)*0.07*(1-d*3),Math.sin(a)*d,0,0.5+r()*1.4,r()*6])}}
const GCOL=['rgba(255,226,170,0.75)','rgba(170,200,255,0.7)','rgba(255,150,210,0.75)'];
function drawGalaxy(t){const rot=t*0.04,c=Math.cos(rot),s=Math.sin(rot),S=26;ctx.save();ctx.globalCompositeOperation='lighter';
  const ce=prj([0,0,0]);if(ce){glowAt(ce,330,'255,200,140',0.5);glowAt(ce,110,'255,240,210',0.85)}
  for(let i=0;i<GST.length;i+=23){const g=GST[i];if(g[3]===0)continue;const x=(g[0]*c-g[2]*s)*S,z=(g[0]*s+g[2]*c)*S;const q=prj([x,g[1]*S,z]);if(q)glowAt(q,clamp(900/q[2],12,60),g[3]===2?'255,120,200':'120,160,255',0.13)}
  for(let b=0;b<3;b++){ctx.fillStyle=GCOL[b];for(const g of GST){if(g[3]!==b)continue;const x=(g[0]*c-g[2]*s)*S,z=(g[0]*s+g[2]*c)*S;const q=prj([x,g[1]*S,z]);if(!q||q[0]<-5||q[0]>W+5||q[1]<-5||q[1]>H+5)continue;const sz=clamp(g[4]*60/q[2],1,5);ctx.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz)}}
  ctx.restore()}
const BOK=[];{const r=rngG(31);for(let i=0;i<34;i++)BOK.push([r()*W,r()*H,20+r()*90,0.3+r()*0.8,r()*6])}
function drawBokeh(t){for(const[x,y,s,v,ph]of BOK){const yy=((y-t*v*120)%(H+200)+H+200)%(H+200)-100;glowAt([x+Math.sin(t*0.7+ph)*30,yy],s,'255,140,60',0.22+0.12*Math.sin(t*2+ph))}}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const S=scn(tt);const cm=camAt(tt);
  // planet rim + sun
  if(S==='space'||S==='dive'||S==='cut'||S==='sink'){const c=prj([0,0,0]);const b=camBasis(cm);const e=prj(V.sc(b.r,R));if(c&&e){const rr=Math.hypot(e[0]-c[0],e[1]-c[1]);ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(c[0],c[1],rr*0.93,c[0],c[1],rr*1.16);g.addColorStop(0,'rgba(90,170,255,0)');g.addColorStop(0.35,'rgba(110,190,255,0.55)');g.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(c[0],c[1],rr*1.2,0,7);ctx.fill();ctx.restore()}
    const sp=prj(V.add(cm.eye,V.sc(V.norm(envAt(tt).sun),500)));if(sp){glowAt(sp,180,'255,240,210',0.6);glowAt(sp,40,'255,255,255',1)}}
  if(S==='galaxy')drawGalaxy(tt);if(S==='deep')drawBokeh(tt);
  if(S==='giant'){const c=prj([0,0,0]);if(c)glowAt(c,700,'140,200,255',0.4*ease(seg(tt,EV.giant,EV.giant+0.8)))}
  // diamond glints
  for(const[p,s,ph]of GLINTS){const q=prj(p);if(!q||q[2]<0.2)continue;const k=Math.pow(Math.max(0,Math.sin(tt*3+ph*7)),8);if(k<0.05)continue;const sz=clamp(s*2600/q[2],10,220);star4(q[0],q[1],sz*(0.5+k),k)}
  // Q glow
  if(QR){const q=prj(QR.p);if(q)glowAt(q,clamp(QR.s*2400/q[2],20,300),'255,210,90',0.35)}
  // cutaway labels
  if(S==='cut'&&tt>EV.cut+2.4){const a=clamp((tt-EV.cut-2.4)*3,0,1);tag('☁️ ATMOSPHERE',prj([0,R*0.93,R*0.25]),'#9fd0ff',a);if(tt>EV.cut+3.2)tag('🌊 HOT ICY OCEAN',prj([R*0.4,R*0.15,0]),'#5af0ff',clamp((tt-EV.cut-3.2)*3,0,1));if(tt>EV.cut+4.2)tag('🪨 CORE',prj([R*0.12,-R*0.1,0]),'#e8b88a',clamp((tt-EV.cut-4.2)*3,0,1))}
  if(S==='sink'&&tt>EV.layer+0.5)tag('💎 DIAMOND LAYER?',prj([R*0.2,R*0.05,R*0.2]),'#ffffff',clamp((tt-EV.layer-0.5)*3,0,1));
  // pressure arrows
  if(S==='deep'&&tt<EV.split+0.4){const a=clamp((tt-EV.meth-0.6)*3,0,1)*clamp((EV.split+0.4-tt)*4,0,1);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#ff6b4a';ctx.strokeStyle='#ff6b4a';ctx.lineWidth=16;const pu=Math.sin(tt*14)*14;
    for(let i=0;i<8;i++){const an=i/8*TAU2;const r1=520+pu,r0=360+pu;const cx=W/2,cy=960;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r1,cy+Math.sin(an)*r1);ctx.lineTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*(r0-40),cy+Math.sin(an)*(r0-40));ctx.lineTo(cx+Math.cos(an+0.08)*(r0+10),cy+Math.sin(an+0.08)*(r0+10));ctx.lineTo(cx+Math.cos(an-0.08)*(r0+10),cy+Math.sin(an-0.08)*(r0+10));ctx.fill()}ctx.restore()}
  if(S==='deep'&&tt>=EV.split&&tt<EV.form){tag('H₂ flies away 💨',[W/2,620],'#ffffff',clamp((tt-EV.split-0.2)*3,0,1));tag('C = carbon',[W/2,1500],'#cfd6e8',clamp((tt-EV.split-0.8)*3,0,1))}
  if(S==='deep'&&tt>=EV.gem){const c=[W/2,960];glowAt(c,520,'150,220,255',0.35+0.1*Math.sin(tt*5));for(let i=0;i<6;i++){const a=tt*1.2+i*1.05;star4(c[0]+Math.cos(a)*300,c[1]+Math.sin(a)*220,70,Math.pow(Math.max(0,Math.sin(tt*4+i)),4))}}
  if(S==='lab'){const f=tt-EV.fire;if(f>0.1&&f<1.0){const p=prj([2.1,1.42,0]);if(p){glowAt(p,700*(1-(f-0.1)),'200,255,210',0.9*(1-(f-0.1)));glowAt(p,160,'255,255,255',1-(f-0.1))}}}
  if(S==='galaxy'&&tt<EV.endc+0.5){for(let i=0;i<16;i++){const a=hsh(i,1)*TAU2,d=0.2+hsh(i,2)*0.75;const p=prj([Math.cos(a+tt*0.04)*d*26,0,Math.sin(a+tt*0.04)*d*26]);if(!p)continue;const k=Math.pow(Math.max(0,Math.sin(tt*2.5+i*1.7)),6);if(k>0.05){star4(p[0],p[1],70*(0.5+k),k);if(k>0.6)emojiAt('💎',p[0],p[1]-50,40,k)}}}
  // dive whiteout
  if(S==='dive'){const k=seg(tt,EV.dive+0.9,EV.dive+1.9);ctx.fillStyle=`rgba(120,180,255,${k})`;ctx.fillRect(0,0,W,H)}
  // vignette
  const vg=ctx.createRadialGradient(W/2,H*0.46,H*0.28,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  // title / stats
  if(tt<3.4){const a=clamp((3.4-tt)/0.35,0,1);ctx.save();ctx.globalAlpha=a;const p=tt<0.35?0.7+0.3*easeOut(tt/0.35):1;ctx.translate(W/2,560);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=24;
    ctx.font='900 92px Inter';ctx.fillStyle='#fff';ctx.fillText('It rains',0,-70);ctx.font=`900 ${fitS('DIAMONDS 💎',980,140)}px Inter, "Noto Color Emoji"`;ctx.fillStyle='#9fe8ff';ctx.fillText('DIAMONDS 💎',0,50);ctx.font='900 72px Inter';ctx.fillStyle='#fff';ctx.fillText('on Neptune',0,160);ctx.restore()}
  const card=(a,b,l,v,c)=>{if(tt>=a&&tt<b)statCard(l,v,c,Math.min(tt-a,(b-tt)*4))};
  card(EV.fly+0.6,EV.close,'DISTANCE FROM SUN','4.5 BILLION km','#ffd84a');card(EV.close+0.9,EV.close+3.6,'TEMPERATURE','−200 °C 🥶','#9fe8ff');card(EV.close+3.6,EV.dive,'WIND SPEED','2,000+ km/h 🌪️','#ffd84a');
  card(EV.meth+0.7,EV.split,'PRESSURE','MILLIONS × EARTH','#ff8a6a');card(EV.lab+0.6,EV.fire,'2017 · STANFORD (SLAC)','LASER vs PLASTIC','#7dff9a');card(EV.fire+1.2,EV.giant,'RESULT','NANO-DIAMONDS 💎','#9fe8ff');
  card(EV.giant+0.8,EV.galaxy,'SIZE (PREDICTED)','MILLIONS OF CARATS','#ffd84a');card(EV.galaxy+2.2,EV.endc,'ICE GIANTS','MOST COMMON PLANETS?','#9fe8ff');
  if(tt<EV.endc)caption(tt);
  // cut flashes
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(EV.fly,0.5,0.3);flash(EV.cut,0.9,0.5,'140,200,255');flash(EV.meth,0.6,0.3,'255,170,120');flash(EV.gem,0.85,0.4,'200,240,255');flash(EV.sink,0.5,0.3);flash(EV.lab,0.5,0.3);flash(EV.fire+0.1,0.6,0.3,'210,255,220');flash(EV.giant,0.7,0.4,'200,240,255');flash(EV.galaxy,0.5,0.3);
  drawEnd(tt);
  {const k=EV.loop-t;if(k>0&&k<0.25){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.25)})`;ctx.fillRect(0,0,W,H)}}}
function emojiAt(s,x,y,size,a){ctx.save();ctx.globalAlpha=a;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function drawEnd(t){const k=ease((t-EV.endc)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;{const gg=ctx.createLinearGradient(0,0,0,H);gg.addColorStop(0,`rgba(4,4,20,${0.6*k})`);gg.addColorStop(0.45,`rgba(4,4,20,${0.35*k})`);gg.addColorStop(0.62,'rgba(4,4,20,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H)}
  const p=popS(t-EV.endc);ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,600);ctx.scale(p,p);ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=20;ctx.font='900 54px Inter';ctx.fillStyle='#fff';ctx.fillText('NEXT VIDEO:',0,-150);
  ctx.font=`900 ${fitS('What if you fall into',980,84)}px Inter`;ctx.fillStyle='#ffd84a';ctx.fillText('What if you fall into',0,-50);ctx.font=`900 ${fitS('a BLACK HOLE? 🕳️',980,96)}px Inter, "Noto Color Emoji"`;ctx.fillText('a BLACK HOLE? 🕳️',0,60);ctx.restore();
  ctx.save();ctx.globalAlpha=k*clamp((t-EV.endc-0.7)*3,0,1);ctx.textAlign='center';ctx.font='800 50px Inter, "Noto Color Emoji"';ctx.fillStyle='#fff';ctx.fillText('Follow so you don\'t miss it 🔔',W/2,1560);ctx.restore()}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.05,far:3000},{center:[0,-9999,0],radius:1},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t-=EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};S(EV.cut,8,0.5);S(EV.gem,8,0.5);S(EV.fire+0.1,10,0.5);S(EV.giant,6,0.5);if(t>=EV.meth&&t<EV.split)a+=2.5*seg(t,EV.meth,EV.split);if(t>=EV.dive&&t<EV.cut)a+=3;return a}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;{const q=t0>=EV.loop?t0-EV.loop:t0;ctx.filter=scn(q)==='fb'?'sepia(0.8) saturate(0.8) contrast(1.15) brightness(1.0)':'saturate(1.08) contrast(1.08)'};ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
