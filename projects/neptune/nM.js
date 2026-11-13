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
