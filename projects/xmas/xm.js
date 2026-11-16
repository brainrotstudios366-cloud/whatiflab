// ===================== CHRISTMAS vs ONE DYING ANT =====================
// ---------- new meshes ----------
const XM_HAT=um(m=>{const red=hx('#d8202a'),red2=hx('#a8141e'),wh=[0.97,0.97,0.98];
  const seg=18,N=8,H=0.42,R0=0.17;const P=(f,a)=>{const r=R0*(1-f)*(1-0.15*f);const bx=f*f*0.16;return[Math.cos(a)*r,f*H,Math.sin(a)*r+bx]};
  for(let i=0;i<N;i++)for(let j=0;j<seg;j++){const f0=i/N,f1=(i+1)/N,a0=j/seg*TAU2,a1=(j+1)/seg*TAU2;const c0=mix3(red,red2,f0*0.5),c1=mix3(red,red2,f1*0.5);m.quad(P(f0,a0),P(f1,a0),P(f1,a1),P(f0,a1),[c0,c1,c1,c0])}
  for(let j=0;j<14;j++){const a=j/14*TAU2;m.ico([Math.cos(a)*0.175,0.01,Math.sin(a)*0.175],0.05,wh,0,0.9,[5,7])}
  m.ico([0,H*0.98,0.16+0.02],0.065,wh,0,1,[7,10])},0.4);
function sph3(m,c,r,col,mat,res){m.ico(c,r,col,mat||0,1,res||[10,14])}
// two-sided flat segment in XZ plane
function seg2(m,a,b,w,col,mat){const d=V.norm(V.sub(b,a));const n=[-d[2]*w/2,0,d[0]*w/2];const p0=V.add(a,n),p1=V.sub(a,n),p2=V.sub(b,n),p3=V.add(b,n);m.quad(p0,p3,p2,p1,col,mat);m.quad(p0,p1,p2,p3,col,mat)}
const XM_FLAKE=um(m=>{const c=[0.85,0.97,1];for(let k=0;k<6;k++){const a=k/6*TAU2;const dir=[Math.cos(a),0,Math.sin(a)];seg2(m,[0,0,0],V.sc(dir,1),0.09,c,MAT.emis);
  for(const f of[0.42,0.7]){const len=f<0.5?0.32:0.22;const p=V.sc(dir,f);for(const s of[-1,1]){const b=a+s*1.05;seg2(m,p,V.add(p,[Math.cos(b)*len,0,Math.sin(b)*len]),0.06,c,MAT.emis)}}
  m.ico(V.sc(dir,1),0.05,c,MAT.emis,0.3,[4,6])}
  for(let k=0;k<6;k++){const a=k/6*TAU2+0.5236;m.ico([Math.cos(a)*0.16,0,Math.sin(a)*0.16],0.06,c,MAT.emis,0.3,[4,6])}},0);
const XM_ICE=um(m=>{const c=[0.7,0.9,1];m.box([0,0.6,0],[1.35,1.2,1.75],c,MAT.glass,0,[0.9,0.97,1])},0);
const XM_SHARD=um(m=>{m.tri([0,0,0],[0.12,0.02,0.05],[0.03,0.14,0],[0.75,0.92,1],MAT.glass);m.tri([0,0,0],[0.03,0.14,0],[0.12,0.02,0.05],[0.75,0.92,1],MAT.glass)});
const XM_ORN=um(m=>{sphC(m,[0,0,0],1,p=>mix3(hx('#e02434'),hx('#ff8a8a'),clamp(p[1]*0.6+p[0]*0.3,0,1)),[18,26],0);m.prism([0,0.92,0],0.28,0.28,0.25,14,hx('#e8c050'));m.prism([0,1.17,0],0.1,0.1,0.12,8,hx('#c8a040'))},0.6);
const XM_RSHARD=um(m=>{m.tri([0,0,0],[0.25,0.03,0.08],[0.05,0.2,0],hx('#e02434'));m.tri([0,0,0],[0.05,0.2,0],[0.25,0.03,0.08],hx('#ff7070'))});
const SNOWB=um(m=>blob(m,[0,0,0],1,p=>mix3([0.82,0.87,0.96],[0.99,0.99,1],clamp(p[1]*0.5+0.5,0,1)),11,1,[20,30]),0.35);
const XM_PILE=um(m=>{blob(m,[0,0,0],1,p=>mix3([0.84,0.88,0.97],[0.99,0.99,1],clamp(p[1]+0.3,0,1)),4,0.45,[12,18])},0.4);
function giftGeo(col,rib){return um(m=>{m.box([0,0.25,0],[0.5,0.5,0.5],col,0,0,mix3(col,[1,1,1],0.12));m.box([0,0.25,0],[0.52,0.51,0.1],rib);m.box([0,0.25,0],[0.1,0.51,0.52],rib);
  for(const s of[-1,1])m.ico([s*0.08,0.56,0],0.085,rib,0,0.7,[6,9]);m.ico([0,0.53,0],0.04,rib,0,1,[5,7])},0.4)}
const GIFTS=[giftGeo(hx('#d8202a'),hx('#f2d060')),giftGeo(hx('#1f8a4a'),hx('#e8384a')),giftGeo(hx('#2a5ad8'),hx('#f4f4f4')),giftGeo(hx('#e8b030'),hx('#c8202a'))];
const XM_SLEIGH=um(m=>{const red=hx('#c81c24'),gold=hx('#f0c040');m.box([0,0.5,0],[1.2,0.6,2.2],red,0,0,hx('#8a1016'));m.box([0,1.0,0.85],[1.2,0.7,0.35],red);
  for(const s of[-1,1]){m.box([s*0.55,0.08,0],[0.08,0.08,2.6],gold);m.box([s*0.55,0.25,-1.3],[0.08,0.4,0.08],gold);m.box([s*0.55,0.25,0.9],[0.08,0.35,0.08],gold);m.box([s*0.55,0.25,-0.3],[0.08,0.35,0.08],gold)}
  m.box([0,0.95,-0.2],[1.0,0.5,0.9],hx('#7a4a22'))},0.4);
// star (flat, 5 points, XY plane)
const XM_STAR=um(m=>{const c=[1,0.86,0.35];const P=[];for(let i=0;i<10;i++){const a=Math.PI/2+i/10*TAU2;const r=i%2?0.42:1;P.push([Math.cos(a)*r,Math.sin(a)*r,0])}
  for(let i=0;i<10;i++){const a=P[i],b=P[(i+1)%10];m.tri([0,0,0.12],a,b,c,MAT.emis);m.tri([0,0,-0.12],b,a,c,MAT.emis)}},0);
// christmas tree builder: returns lights list for glows
function xmTree(m,x,z,H,Rr,seed,emisOrn){const r=rngG(seed);const lights=[];m.prism([x,0,z],0.07*Rr,0.06*Rr,0.16*H,8,hx('#5a3a22'));
  const g1=hx('#1e5a32'),g2=hx('#2f7a44'),g3=hx('#174a2a');
  for(let i=0;i<5;i++){const by=H*(0.1+i*0.15),h=H*0.3,r0=Rr*(1-i*0.17);const sg=14;
    for(let j=0;j<sg;j++){const a0=j/sg*TAU2+i*0.3,a1=(j+1)/sg*TAU2+i*0.3;const jag=1+0.12*((j%2)?1:-1);
      const b0=[x+Math.cos(a0)*r0*jag,by-0.04*H*((j%2)),z+Math.sin(a0)*r0*jag],b1=[x+Math.cos(a1)*r0*(2-jag),by-0.04*H*((j+1)%2),z+Math.sin(a1)*r0*(2-jag)],tp=[x,by+h,z];
      m.tri(b0,tp,b1,[mix3(g3,g1,0.3),g2,g3]);m.tri(b0,b1,[x,by+h*0.25,z],g3)}
    // snow dusting on branch tips
    for(let j=0;j<sg;j+=2){const a=j/sg*TAU2+i*0.3;m.ico([x+Math.cos(a)*r0*1.0,by+0.01*H,z+Math.sin(a)*r0*1.0],0.05*Rr,[0.95,0.97,1],0,0.4,[4,6])}}
  const cols=[hx('#ff3a4a'),hx('#ffd84a'),hx('#5AF0FF'),hx('#7DFF9A'),hx('#ff7ad8')];
  // ornaments + string lights
  for(let i=0;i<5;i++){const by=H*(0.1+i*0.15),h=H*0.3,r0=Rr*(1-i*0.17);
    for(let k=0;k<9-i;k++){const a=r()*TAU2,f=0.12+r()*0.5;const rr=r0*(1-f)*1.0+0.03*Rr;const p=[x+Math.cos(a)*rr,by+f*h-0.03*H,z+Math.sin(a)*rr];const c=[hx('#d8202a'),hx('#e8c050'),hx('#2a5ad8'),hx('#c8c8d8')][k%4];
      m.ico(p,0.055*Rr,c,emisOrn?MAT.emis:0,1,[7,10])}
    for(let k=0;k<26;k++){const a=k/26*TAU2*1.0+i*1.1;const f=0.08+0.62*((k*7%26)/26);const rr=r0*(1-f)*1.02+0.02*Rr;const p=[x+Math.cos(a)*rr,by+f*h-0.02*H,z+Math.sin(a)*rr];const c=cols[(k+i)%5];m.ico(p,0.026*Rr,c,MAT.emis,1,[5,7]);lights.push({p,c})}}
  return{lights,top:[x,H*1.0,z]}}
// ---------- snow world ----------
let BGS,BGLIGHTS=[];{const m=new MB();m.quad([-2e5,0,-2e5],[-2e5,0,2e5],[2e5,0,2e5],[2e5,0,-2e5],hx('#e4eaf6'));const r=rngG(91);
  for(let i=0;i<300;i++){const a=r()*TAU2,d=150+r()*3500;const x=Math.cos(a)*d,z=Math.sin(a)*d,s=4+r()*6;m.prism([x,0,z],0.18*s,0.14*s,1.6*s,6,C.trunk);m.prism([x,1.2*s,z],1.5*s,0,2.6*s,7,hx('#1f4a30'));m.prism([x,2.4*s,z],1.1*s,0,2.2*s,7,hx('#24543a'));m.prism([x,3.6*s,z],0.55*s,0,1.0*s,7,[0.95,0.97,1]);m.prism([x,2.4*s,z],1.16*s,0.6*s,0.25*s,7,[0.93,0.95,1])}
  const hcol=['#8a3a2a','#c8a070','#5a6a8a','#a85a3a','#7a5a40'];const lc=[[1,0.25,0.3],[1,0.85,0.3],[0.35,0.95,1],[0.5,1,0.6]];
  for(let i=0;i<12;i++){const a=-0.9+i/11*(Math.PI+1.8)+(r()-0.5)*0.2;const d=45+r()*90;const x=Math.cos(a)*d,z=Math.abs(Math.sin(a))*d+10;const w=7+r()*4,dd=6+r()*3,h=4+r()*2;const ry=r()*0.6-0.3;
    m.box([x,h/2,z],[w,h,dd],hx(hcol[i%5]),0,ry);
    const cs=Math.cos(ry),sn=Math.sin(ry);const L=(px,py,pz)=>[x+px*cs+pz*sn,py,z-px*sn+pz*cs];
    m.quad(L(-w/2-0.4,h,-dd/2-0.5),L(-w/2-0.4,h+2.6,0),L(w/2+0.4,h+2.6,0),L(w/2+0.4,h,-dd/2-0.5),[0.96,0.97,1]);m.quad(L(-w/2-0.4,h,dd/2+0.5),L(w/2+0.4,h,dd/2+0.5),L(w/2+0.4,h+2.6,0),L(-w/2-0.4,h+2.6,0),[0.96,0.97,1]);
    m.tri(L(-w/2,h,-dd/2),L(-w/2,h,dd/2),L(-w/2,h+2.5,0),hx(hcol[i%5]));m.tri(L(w/2,h,dd/2),L(w/2,h,-dd/2),L(w/2,h+2.5,0),hx(hcol[i%5]));
    for(const fz of[-1,1])for(const wx of[-0.27,0.27]){const p=L(wx*w,h*0.48,fz*(dd/2+0.06));m.box(p,[1.2,1.3,0.12],[1,0.82,0.45],MAT.emis,ry)}
    for(let k=0;k<14;k++){const f=k/13;const p=L(-w/2-0.4+f*(w+0.8),h-0.15,-dd/2-0.5);const c=lc[k%4];m.ico(p,0.22,c,MAT.emis,1,[4,6]);if(k%3==0)BGLIGHTS.push({p,c})}
    for(let k=0;k<14;k++){const f=k/13;const p=L(-w/2-0.4+f*(w+0.8),h-0.15,dd/2+0.5);m.ico(p,0.22,lc[(k+1)%4],MAT.emis,1,[4,6])}}
  const T=xmTree(m,-22,62,16,5.5,7,false);BGLIGHTS.push(...T.lights.filter((q,i)=>i%4==0));
  m.ico([-22,16.4,62],0.7,[1,0.86,0.35],MAT.emis,1,[6,8]);BGLIGHTS.push({p:[-22,16.4,62],c:[1,0.86,0.35],big:1});
  BGS=m.build(0.5)}
function buildSnowTile(){const T=200,m=new MB();const r=rngG(12);
  ground(m,-400,-T,400,0,null,0,10,(x,z)=>{const n=0.92+0.06*fbm(x*0.03+3,z*0.03,3)+0.02*(hsh(x*3|0,z*3|0)-0.5);return[n*0.93,n*0.95,n]});
  // footpath (packed, slightly bluish-grey)
  ground(m,-2.2,-T,2.2,0,null,0.01,5,(x,z)=>{const n=0.8+0.06*fbm(x*0.3,z*0.08,2);return[n*0.86,n*0.89,n*0.96]});
  for(let i=0;i<70;i++){const s=r()<0.5?-1:1;const x=s*(4+Math.pow(r(),1.4)*120),z=-r()*T;const rad=0.6+r()*3.2;m.ico([x,0,z],rad,[0.94,0.96,1],0,0.32,[6,10])}
  for(let i=0;i<18;i++){const x=(r()<0.5?-1:1)*(3+r()*40),z=-r()*T,s=0.25+r()*0.6;m.ico([x,0,z],s,hx(['#6a645e','#7a7068','#5a5550'][i%3]),0,0.6,[6,9]);m.ico([x,s*0.45,z],s*0.85,[0.95,0.97,1],0,0.4,[6,9])}
  for(let i=0;i<260;i++){const s=r()<0.5?-1:1;const x=s*(6+Math.pow(r(),1.3)*150),z=-r()*T,sc=1.2+r()*3.2*(1+(Math.abs(x)-6)/60);
    m.prism([x,0,z],0.12*sc,0.1*sc,1.2*sc,5,C.trunk);m.prism([x,0.9*sc,z],1.3*sc,0,2.4*sc,7,hx(r()<0.5?'#1f4a30':'#2a5a3a'));m.prism([x,2.1*sc,z],0.9*sc,0,1.9*sc,7,hx('#24543a'));m.prism([x,3.15*sc,z],0.45*sc,0,0.85*sc,7,[0.96,0.97,1]);m.prism([x,0.9*sc,z],1.34*sc,1.0*sc,0.22*sc,7,[0.93,0.95,1])}
  // string of christmas lights lying in the snow
  const lc=[[1,0.25,0.3],[1,0.85,0.3],[0.35,0.95,1],[0.5,1,0.6],[1,0.45,0.85]];let prev=null;
  for(let k=0;k<=166;k++){const z=-k*1.2;const x=-3.3+0.35*Math.sin(k*0.7);const p=[x,0.07,z];if(prev)seg2(m,prev,p,0.04,[0.08,0.12,0.08]);prev=p;if(k<166)m.ico([x,0.13,z-0.6],0.1,lc[k%5],MAT.emis,1.3,[5,7])}
  return{mesh:m.build(0.45),T}}
const TILES=buildSnowTile();
let FGTREE;{const m=new MB();FGTREE=xmTree(m,0,0,14,4.2,3,false);FGTREE.mesh=m.build(0.45)}
// ---------- timeline ----------
const R=[3.0,13.5,24.5,35.5,46.0,61.0];
const EV={orn0:0.85,ornHit:1.3,bliz1:4.2,frz1:6.4,crk1:9.5,res1:9.8,fade1:12.8,
  slip2:15.3,land2:18.3,up2:19.1,res2:19.4,go2:22.7,
  ball3:25.0,warn3:26.3,look3:27.3,hit3:28.3,pop3:30.5,res3:30.9,
  sl4a:37.9,exp4:39.6,boom4:40.2,gift4:40.8,land4:42.7,res4:43.3,
  up5:48.8,fl5a:49.2,hit5:53.0,fall5:53.35,res5:53.8,loop:65.5};
const ROUNDS=[['ROUND 1','BLIZZARD: -40° ❄️','Thawed. Mildly annoyed 😤',EV.res1],['ROUND 2','GIANT CHRISTMAS TREE 🎄','Not even a bruise 😎',EV.res2],['ROUND 3','AVALANCHE SNOWBALL ☃️','STILL ALIVE?! 😮‍💨',EV.res3],['ROUND 4','SANTA’S SLEIGH 🛷','Sleigh: gone. Ant: got a gift 🎁',EV.res4],['FINAL ROUND','ONE snowflake ❄️','Cause of death: ONE snowflake 💀',EV.res5]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
function xmSpd(t){if(t<R[0])return 1;if(t<R[1])return t<EV.bliz1+0.9?Math.max(0,1-(t-EV.bliz1)/0.9):0;if(t<R[2])return t>=EV.go2?1:0;
  if(t<R[3])return t<EV.look3?1.05:(t>=EV.res3+1.0?1:0);if(t<R[4])return t<EV.sl4a-0.6?0.8:0;if(t<R[5])return t<EV.up5?0.75:0;return 0}
const XM_DT=1/120,XM_TAB=[0];for(let i=1;i<=DUR/XM_DT+10;i++){const tm=(i-0.5)*XM_DT;XM_TAB.push(XM_TAB[i-1]+xmSpd(tm)*XM_DT*1.1)}
function xmD(t){t=clamp(t,0,DUR+0.05);const f=t/XM_DT,i=Math.floor(f);return lerp(XM_TAB[i],XM_TAB[i+1],f-i)}
function sceneT(t){return t>=EV.loop?t-EV.loop:t}
const TREE_X=-4.6,TREE_Z0=0.9;const treeZ=t=>TREE_Z0+(xmD(t)-xmD(R[1]));
const pileZ=t=>xmD(t)-xmD(EV.hit3);
const giftZ=t=>xmD(t)-xmD(EV.land4);
// ant position on the tree (R2)
const TOPP=[TREE_X,11.27,TREE_Z0-1.12];
function fallK(t){return clamp((t-EV.slip2-0.15)/(EV.land2-EV.slip2-0.15),0,1)}
function antPos2(t){if(t<EV.slip2)return TOPP.slice();const k=fallK(t);const y=TOPP[1]*(1-Math.pow(k,1.35));return[lerp(TOPP[0],0,easeOut(clamp(k*1.3,0,1))),Math.max(0,y),lerp(TOPP[2],0,ease(k))-1.3*Math.sin(Math.PI*clamp(k*1.1,0,1))]}
// sleigh path (R4)
const SL_A=[-350,165,550],SL_B=[350,80,450];
function slP(t){const k=(t-EV.sl4a)/(EV.exp4-EV.sl4a)*0.42;return V.add(SL_A,V.sc(V.sub(SL_B,SL_A),k))}
// ---------- environments ----------
function envBase(o){return Object.assign({sun:[0.45,0.75,-0.5],sunCol:hx('#fff1d8'),sky:hx('#9fc6ee'),gnd:hx('#8a8a70'),fog:hx('#cfe0f0'),fogD:5000,zen:hx('#3a7ad8'),hor:hx('#d8eaf6'),stars:0,night:0,emis:1,ground:1,gndCol:hx('#cfe0f0'),sunSize:1},o||{})}
function mixEnv(a,b,k){const o={};for(const key in a){const va=a[key],vb=b[key];o[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?lerp(va,vb,k):va)}return o}
const E_EVE=envBase({sun:V.norm([0.55,0.3,0.75]),sunCol:hx('#ffd0a0'),sky:hx('#7a88c8'),zen:hx('#1a2464'),hor:hx('#f2a68a'),fog:hx('#b8b8de'),fogD:4200,gnd:hx('#c8d0ea'),gndCol:hx('#c0c4e4'),stars:0.35,night:0.18});
const E_BLIZ=envBase({sun:V.norm([0.55,0.3,0.75]),sunCol:hx('#d0dcff'),sky:hx('#b8c4dc'),zen:hx('#7080a8'),hor:hx('#dde4f0'),fog:hx('#d4dcec'),fogD:260,gnd:hx('#d8e0f0'),gndCol:hx('#d4dcec'),stars:0,night:0.1});
function blizK(t){if(roundAt(t)!==0)return 0;return ease((t-EV.bliz1)/1.2)*(1-ease((t-EV.crk1-0.3)/1.4))}
function envAt(t){let e=E_EVE;const b=blizK(t);if(b>0)e=mixEnv(E_EVE,E_BLIZ,b);return e}
// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  if(t<R[0]){const k=t/R[0];eye=[1.6-k*0.4,0.9+k*0.1,-3.6-k*0.5];at=[0,0.9,0.3]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.6,2.1,k)+sway*0.2,lerp(1.0,1.35,k),lerp(-3.9,-3.3,k)];at=[0,0.7,0.1];
    if(t>=EV.frz1-0.3){const kk=ease((t-EV.frz1+0.3)/1.2)*(1-ease((t-EV.crk1-0.4)/1.0));eye=V.add(eye,[-0.4*kk,-0.25*kk,0.9*kk])}}
  if(rn===1){const p=antPos2(t);eye=[p[0]+2.3+sway*0.2,p[1]+0.95,p[2]-3.5];at=[p[0]-0.2,p[1]+0.45,p[2]+0.6];
    if(t<R[1]+1.9){const kk=1-ease((t-R[1]-0.5)/1.4);eye=V.add(eye,[5*kk,-2.5*kk,-9*kk]);at=V.add(at,[1.5*kk,-3.5*kk,0])}
    if(t>=EV.land2){const kk=ease((t-EV.land2)/0.8);eye=[lerp(eye[0],1.75,kk),lerp(eye[1],1.0,kk),lerp(eye[2],-3.9,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.68,kk),lerp(at[2],0.4,kk)]}}
  if(rn===2){const k=ease((t-R[2])/1.0);eye=[lerp(1.75,2.9,k),lerp(1.0,1.75,k),lerp(-3.9,-4.9,k)];at=[0,lerp(0.68,1.0,k),lerp(0.4,3.0,k)];
    if(t>=EV.hit3+0.8){const kk=ease((t-EV.hit3-0.8)/1.0);eye=[lerp(eye[0],1.6,kk),lerp(eye[1],1.05,kk),lerp(eye[2],-3.4,kk)];at=[lerp(at[0],0,kk),lerp(at[1],0.45,kk),lerp(at[2],0.2,kk)]}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[lerp(1.75,1.5,k)+sway*0.2,lerp(1.0,0.5,k),lerp(-3.9,-3.7,k)];at=[lerp(0,-0.1,k),lerp(0.68,1.6,k),lerp(0.4,3.0,k)];
    if(t>=EV.boom4-0.1&&t<EV.boom4+0.6){}
    if(t>=EV.gift4+0.6){const kk=ease((t-EV.gift4-0.6)/1.3);eye=[lerp(eye[0],1.9,kk),lerp(eye[1],0.95,kk),lerp(eye[2],-3.5,kk)];at=[lerp(at[0],0.35,kk),lerp(at[1],0.55,kk),lerp(at[2],0.0,kk)]}}
  if(rn===4){eye=[1.75+sway*0.3,1.0,-3.9];at=[0,0.68,0.4];
    if(t>=EV.up5-0.2){const kk=ease((t-EV.up5+0.2)/1.2);eye=V.add(eye,[-0.55*kk,0.05*kk,1.35*kk]);at=V.add(at,[0,0.75*kk,-0.6*kk])}
    if(t>=EV.fl5a+1.5){const kk=ease((t-EV.fl5a-1.5)/1.8);at=V.add(at,[0,-0.45*kk,0])}
    if(t>=EV.hit5-0.2){const kk=ease((t-EV.hit5+0.2)/0.9);eye=[lerp(eye[0],1.0,kk),lerp(eye[1],1.4,kk),lerp(eye[2],-3.2,kk)];at=[lerp(at[0],-0.3,kk),lerp(at[1],0.4,kk),lerp(at[2],0,kk)]}}
  if(t>=R[5])eye=[1.0,1.4,-3.2],at=[-0.3,0.4,0];
  return{eye,at}}
// ---------- background ----------
function bgItems(t){return{items:[{mesh:BGS}]}}
// ---------- foreground ----------
let LASTVP=null,QPTS=[],FLAKEP=null,SPLAT=0;
function xmAnt(Rm,o){o.hat=true;return antItems(Rm,o)}
function snowFall(items,t,amt){if(amt<=0)return;for(let i=0;i<90;i++){const sp=0.35+hsh(i,7)*0.3;const ph=(hsh(i,3)+t*sp/3.2)%1;const x=(hsh(i,1)-0.5)*7+0.25*Math.sin(t*0.9+i),z=(hsh(i,2)-0.55)*8,y=3.2-ph*3.3;
  items.push({mesh:USPH,M:M4.trs([x,y,z],0,0,0,0.018+0.016*hsh(i,5)),tint:[1,1,1],tintAmt:1,alpha:0.85*amt*Math.min(1,ph*8),noShadow:true})}}
function blizzard(items,t,b){if(b<=0.01)return;for(let i=0;i<170;i++){const sp=7+hsh(i,4)*6;const x=((hsh(i,1)*14+t*sp)%14)-7;const y=0.05+hsh(i,2)*2.6+0.2*Math.sin(t*3+i),z=(hsh(i,3)-0.5)*7;
  items.push({mesh:USPH,M:M4.trs([x,y,z],0.15*Math.sin(i),0,-0.15,[0.16,0.012,0.012]),tint:[1,1,1],tintAmt:1,alpha:0.75*b,noShadow:true})}}
function puff(items,p,k,n,sc,col){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);const kk=k;if(kk<0||kk>1.4)continue;const d=easeOut(kk/1.0)*sc;items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1+kk*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+kk*0.25)*sc),tint:col||[0.96,0.97,1],tintAmt:1,alpha:Math.max(0,0.75*(1-kk/1.4)),noShadow:true})}}
function fgItems(t){QPTS=[];FLAKEP=null;SPLAT=0;const rn=roundAt(t);const items=[];const L=TILES;
  let pose='walk',walk=xmSpd(t)>0?1:0,o={t};let hide=false;
  const dist=xmD(t);const o_=((dist%L.T)+L.T)%L.T;
  for(let k=-1;k<=10;k++)items.push({mesh:L.mesh,M:M4.trs([0,0,-k*L.T+o_],0,0,0,1)});
  // glows for the lights string near the ant
  for(let k=0;k<10;k++){const z=-k*1.2-0.6+(o_%1.2);const zz=z-((dist%1.2+1.2)%1.2)+(o_%1.2);}
  let Rm=M4.id();
  const b=blizK(t);snowFall(items,t,1-b*0.7);blizzard(items,t,b);
  // ---- HOOK: falling ornament smashes next to him ----
  if(t<R[0]){if(t>=EV.orn0&&t<EV.ornHit){const k=(t-EV.orn0)/(EV.ornHit-EV.orn0);const y=lerp(5,0.3,k*k);items.push({mesh:XM_ORN,M:M4.trs([0.95,y,-0.75],t*3,0.3,0,0.3)});QPTS.push({p:[0.95,y,-0.75],c:'255,80,90',r:0.5,a:0.25})}
    if(t>=EV.ornHit){const k=t-EV.ornHit;for(let i=0;i<16;i++){const d=V.norm([hsh(i,1)-0.5,0,hsh(i,2)-0.5]);const v=0.8+hsh(i,3)*1.6;const up=1.2+hsh(i,4)*2.2;const y=Math.max(0.01,0.15+up*k-4.9*k*k);const kk=Math.min(k,0.5+hsh(i,5)*0.3);
      items.push({mesh:XM_RSHARD,M:M4.trs([0.95+d[0]*v*kk,y,-0.75+d[2]*v*kk],i+k*(y>0.02?9:0),i*0.7,k*(y>0.02?7:0),0.5+hsh(i,6)*0.6)})}
      puff(items,[0.95,0,-0.75],k*1.6,8,0.5);if(k<0.6)o.lid=0;
      if(k<0.35){const j=Math.sin(k/0.35*Math.PI);Rm=M4.trs([-0.15*j,0.25*j,0],0,0,0.1*j,1);o.flail=1}}
    if(t>=1.9)o.lid=0.3}
  // ---- R1: blizzard, frozen in ice ----
  if(rn===0){if(t>=EV.bliz1+0.6&&t<EV.frz1+0.3){const j=Math.sin(t*55)*0.025*ease((t-EV.bliz1-0.6)/0.5);Rm=M4.trs([j,0,0],0,0,0,1);o.lid=0.15;o.frost=0.35*ease((t-EV.bliz1-0.6)/1.2)}
    if(t>=EV.frz1&&t<EV.crk1){const k=ease((t-EV.frz1)/0.7);o.frost=0.35+0.45*k;o.lid=0.15;walk=0;items.push({mesh:XM_ICE,M:M4.trs([0,0,-0.05],0.04,0,0,[1,Math.max(0.02,k),1]),tint:[0.8,0.95,1],tintAmt:0.2,alpha:0.5,noShadow:true});QPTS.push({p:[0,0.6,-0.05],c:'150,230,255',r:1.3,a:0.18*k})
      if(t>=EV.crk1-1.0){const j=Math.sin(t*70)*0.012*ease((t-EV.crk1+1.0)/1.0);Rm=M4.trs([j,0,0],0,0,0,1)}}
    if(t>=EV.crk1){const k=t-EV.crk1;for(let i=0;i<22;i++){const d=V.norm([hsh(i,1)-0.5,0,hsh(i,2)-0.5]);const v=1.2+hsh(i,3)*2.5;const up=1.4+hsh(i,4)*2.5;const y=Math.max(0.01,0.6+(hsh(i,7)-0.5)*0.8+up*k-4.9*k*k);const kk=Math.min(k,0.6);
      if(k<2.5)items.push({mesh:XM_SHARD,M:M4.trs([d[0]*(0.4+v*kk),y,-0.05+d[2]*(0.5+v*kk)],i+k*(y>0.02?8:0),i*1.1,k*(y>0.02?6:0),1.2+hsh(i,6)*1.2),tint:[0.85,0.97,1],tintAmt:0.2,alpha:0.7*clamp((2.5-k)/0.5,0,1),noShadow:true})}
      o.frost=0.8*(1-ease(k/1.6));if(k<1.2){o.lid=0.1;const j=Math.sin(t*40)*0.03*(1-k/1.2);Rm=M4.trs([j,0,0],0,0,0,1)}else o.lid=0.6;walk=0}}
  // ---- R2: giant christmas tree ----
  if(rn===1){const tz=treeZ(t);const fa=1-ease((t-R[2]+0.6)/0.6);if(fa>0.01){items.push({mesh:FGTREE.mesh,M:M4.trs([TREE_X,0,tz-TREE_Z0],0,0,0,[1,fa,1])});
      const star=[TREE_X,14.2*fa,tz];items.push({mesh:XM_STAR,M:M4.trs(star,t*0.8,0,0,0.62),tint:[1,1,1],tintAmt:0});QPTS.push({p:star,c:'255,220,110',r:2.2,a:0.55});
      const p2=antPos2(t);for(let i=0;i<FGTREE.lights.length;i+=2){const q=FGTREE.lights[i];const pp=[q.p[0]+TREE_X,q.p[1]*fa,q.p[2]+tz];if(Math.abs(pp[1]-p2[1])<4)QPTS.push({p:pp,cap:110,c:(q.c.map(v=>Math.round(v*255))).join(','),r:0.28,a:0.5*(0.7+0.3*Math.sin(t*4+i))})}}
    const p=antPos2(t);
    if(t<EV.slip2){walk=0;o.lid=t<R[1]+1.2?0.1:0.4;Rm=M4.trs(p,0,0,0,1);if(t>=EV.slip2-0.35){const k=(t-EV.slip2+0.35)/0.35;Rm=M4.trs(p,0,0,0.25*Math.sin(k*9)*k,1);o.lid=0}}
    else if(t<EV.land2){pose='fall';walk=0;o.lid=0;o.flail=1;const k=fallK(t);const rz=k*TAU2*1.5+(t-EV.slip2)*0.8;Rm=M4.mul(M4.trs(V.add(p,[0,0.45,0]),k*2,0,rz,1),M4.trs([0,-0.45,0],0,0,0,1))}
    else if(t<EV.up2){walk=0;pose='fall';o.lid=0.2;o.dizzy=true;const k=t-EV.land2;const bb=k<0.3?Math.sin(k/0.3*Math.PI)*0.18:0;Rm=M4.mul(M4.trs([0,0.45+bb,0],0,0,Math.PI,1),M4.trs([0,-0.45,0],0,0,0,1));puff(items,[0,0,0],k*1.4,10,0.9)}
    else{walk=xmSpd(t)>0?1:0;const k=t-EV.up2;if(k<0.3){const j=Math.sin(k/0.3*Math.PI);Rm=M4.trs([0,0.3*j,0],0,0,(1-k/0.3)*0.5,1)}if(t>=EV.res2&&t<EV.res2+2.6)o.glasses=easeOut((t-EV.res2)/0.5);puff(items,[0,0,0],(t-EV.land2)*1.4,10,0.9)}
    if(t>=EV.land2-0.05&&t<EV.land2+0.6){/* impact dust handled by puff */}}
  // ---- R3: giant snowball from behind ----
  if(rn===2){const V3=4.7,rad=2.0;const zb=rad-(t-EV.hit3)*V3;const ang=-(t-EV.ball3)*V3/rad;
    if(t>=EV.ball3-0.2&&t<EV.hit3+0.9){items.push({mesh:SNOWB,M:M4.trs([0,rad*0.97,zb],0.2,ang,0,rad)});
      for(let i=0;i<10;i++){const ph=(t*1.8+hsh(i,2))%1;items.push({mesh:USPH,M:M4.trs([(hsh(i,1)-0.5)*3.4,0.1+ph*0.8,zb+rad*0.8+ph*1.2],0,0,0,0.12+ph*0.25),tint:[0.97,0.98,1],tintAmt:1,alpha:0.5*(1-ph),noShadow:true})}}
    if(t<EV.look3){}else if(t<EV.hit3){walk=0;o.lid=0;const k=(t-EV.look3);Rm=M4.trs([0,0,0],Math.PI*ease(k/0.35),0,0,1);o.flail=1}
    if(t>=EV.hit3){const pz=pileZ(t);hide=t<EV.pop3;items.push({mesh:XM_PILE,M:M4.trs([0,0,pz],0,0,0,[1.1,0.75,1.2])});
      // squashed trail
      items.push({mesh:UB,M:M4.trs([0,0.02,pz+9],0,0,0,[3.4,0.04,18]),tint:[0.86,0.9,0.98],tintAmt:1});
      if(t>=EV.pop3){const k=t-EV.pop3;const y=-0.55+0.55*easeOut(clamp(k/0.35,0,1));Rm=M4.trs([0,y,pz],0,0,0,1);o.frost=0.45*(1-ease((k-1.5)/1.5));o.lid=k<0.8?0.1:0.45;
        if(k<1.3)for(let i=0;i<14;i++){const d=V.norm([hsh(i,1)-0.5,0,hsh(i,2)-0.5]);const up=1.5+hsh(i,4)*2;const y2=0.4+up*k-4.9*k*k;if(y2>0)items.push({mesh:USPH,M:M4.trs([d[0]*k*1.2,y2,pz+d[2]*k*1.2],0,0,0,0.06+hsh(i,6)*0.06),tint:[0.97,0.98,1],tintAmt:1})}
        if(t>=EV.res3+0.2&&t<EV.res3+0.9){const kk=(t-EV.res3-0.2)/0.7;Rm=M4.mul(Rm,M4.trs([0,0,0],0.4*Math.sin(kk*TAU2*2)*(1-kk),0,0,1))}}}
    if(t>=EV.hit3+0.15&&t<EV.hit3+1.3)SPLAT=1-ease((t-EV.hit3-0.15-0.35)/0.8)}
  // ---- R4: Santa's sleigh at 1,000 km/s ----
  if(rn===3){if(t>=EV.sl4a&&t<EV.exp4){const p=slP(t);const dir=V.norm(V.sub(SL_B,SL_A));const yaw=Math.atan2(dir[0],dir[2]);
      items.push({mesh:XM_SLEIGH,M:M4.trs(p,yaw,-0.25,0,13),tint:null,tintAmt:0,noShadow:true});
      items.push({mesh:UEMIS,M:M4.trs(V.add(p,V.sc(dir,11)),yaw,0,0,[15,12,26]),tint:[1,0.45,0.12],tintAmt:1,alpha:0.5,add:1,noShadow:true});
      items.push({mesh:UEMIS,M:M4.trs(V.add(p,V.sc(dir,9)),yaw,0,0,[7,6,13]),tint:[1,0.85,0.5],tintAmt:1,alpha:0.5,add:1,noShadow:true});
      for(let i=1;i<40;i++){const q=V.sub(p,V.sc(dir,i*11));const s=18*(1-i/44);items.push({mesh:UEMIS,M:M4.trs(V.add(q,[Math.sin(i*1.7+t*9)*3,Math.cos(i*2.1)*2.5,0]),0,0,0,s),tint:mix3([1,0.62,0.2],[0.75,0.15,0.08],i/40),tintAmt:1,alpha:0.85*(1-i/40),noShadow:true})}
      QPTS.push({p,c:'255,150,60',r:100,a:0.6});
      for(let i=0;i<8;i++){const ph=((t-EV.sl4a)*3+i/8)%1;const q=V.sub(p,V.sc(dir,ph*150));items.push({mesh:UEMIS,M:M4.trs(V.add(q,[(hsh(i,1)-0.5)*30,-ph*40,(hsh(i,2)-0.5)*30]),0,0,0,2.5),tint:[1,0.85,0.4],tintAmt:1,alpha:1-ph,add:1,noShadow:true})}}
    if(t>=EV.exp4&&t<EV.exp4+3.0){const k=t-EV.exp4;const p=slP(EV.exp4);items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,25+easeOut(k/1.2)*60),tint:mix3([1,0.6,0.15],[0.6,0.12,0.06],clamp(k/1.5,0,1)),tintAmt:1,alpha:Math.max(0,0.9*(1-k/1.5)),noShadow:true});if(k<0.8)items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,15+k*40),tint:[1,0.85,0.4],tintAmt:1,alpha:0.6*(1-k/0.8),add:1,noShadow:true});for(let i=0;i<16;i++){const d=V.norm([hsh(i,1)-0.5,hsh(i,2)-0.4,hsh(i,3)-0.5]);items.push({mesh:UEMIS,M:M4.trs(V.add(p,V.add(V.sc(d,k*110),[0,-30*k*k,0])),0,0,0,4*(1-k/3)),tint:[1,0.7,0.25],tintAmt:1,alpha:1-k/3,add:1,noShadow:true})}
      QPTS.push({p,c:'255,170,80',r:220*(1-k/3),a:0.8*(1-k/3)})}
    if(t>=EV.boom4&&t<EV.boom4+1.2){const k=t-EV.boom4;items.push({mesh:RING,M:M4.trs([0,0.05,0],0,0,0,0.3+k*6),tint:[1,1,1],tintAmt:1,alpha:0.7*(1-k/1.2),add:1,noShadow:true});
      for(let i=0;i<40;i++){const a=i/40*TAU2;const r0=0.5+hsh(i,2)*2;const d=r0+k*4;items.push({mesh:USPH,M:M4.trs([Math.cos(a)*d,0.08+k*0.5*hsh(i,3),Math.sin(a)*d],0,0,0,0.05+k*0.05),tint:[0.97,0.98,1],tintAmt:1,alpha:0.7*(1-k/1.2),noShadow:true})}
      if(k<0.5){o.lid=0;Rm=M4.trs([0,0,0],0,-0.15*Math.sin(k/0.5*Math.PI),0,1)}}
    if(t>=EV.sl4a-0.6&&t<EV.boom4){walk=0;o.lid=0.05;o.headDown=-0.3}
    // gifts rain
    const GL=[[0.95,-0.45,EV.land4,0,1.0],[-2.2,1.5,EV.gift4+0.7,1,1.6],[2.6,2.4,EV.gift4+1.0,2,1.8],[-1.2,3.2,EV.gift4+1.3,3,1.5],[3.4,-1.6,EV.gift4+1.5,1,1.4],[-3.0,-0.8,EV.gift4+1.15,2,1.7],[1.6,4.5,EV.gift4+1.7,3,2]];
    for(let i=0;i<GL.length;i++){const [gx,gz,tl,gi,gs]=GL[i];const fallD=1.1;if(t<tl-fallD)continue;const k=clamp((t-(tl-fallD))/fallD,0,1);const y=lerp(6,0,k*k);const zz=gz+(t>=EV.land4?giftZ(t):0);
      const sq=t>=tl&&t<tl+0.2?1-0.25*Math.sin((t-tl)/0.2*Math.PI):1;items.push({mesh:GIFTS[gi],M:M4.trs([gx,y,zz],i*0.9+(1-k)*4,(1-k)*0.6,0,[gs*0.5,gs*0.5*sq,gs*0.5])});if(t>=tl)puff(items,[gx,0,zz],(t-tl)*1.6,8,0.6*gs)}
    if(t>=EV.land4-0.05&&t<EV.res4){o.lid=0;const k=t-EV.land4;if(k>0&&k<0.3){Rm=M4.trs([0,0.2*Math.sin(k/0.3*Math.PI),0],0,0,0,1)}}
    if(t>=EV.res4){pose='sit';walk=0;o.glasses=easeOut((t-EV.res4)/0.5);o.lid=0.35}}
  // ---- FINAL: ONE snowflake ----
  if(rn===4){const gz=giftZ(t);if(gz<12)items.push({mesh:GIFTS[0],M:M4.trs([0.95,0,-0.45+gz],0,0,0,0.5)});
    if(t>=EV.up5){walk=0;o.headDown=-0.35*ease((t-EV.up5)/0.6);o.lid=0.15}
    const HEADP=[0,1.05,-0.42];
    if(t>=EV.fl5a-0.6){const k=clamp((t-EV.fl5a)/(EV.hit5-EV.fl5a),0,1);let p;if(t<EV.hit5){p=[0.12*Math.sin(k*7)*(1-k)+0.02,lerp(3.0,HEADP[1],k),HEADP[2]+0.1*Math.cos(k*5)*(1-k)]}else{const sq=easeIn(clamp((t-EV.hit5)/0.3,0,1));p=[0,lerp(HEADP[1],0.62,sq),HEADP[2]];if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));p=[-0.12*fk-0.25*fk,0.62-0.25*fk,HEADP[2]]}}
      const rot=t<EV.hit5?t*0.9:EV.hit5*0.9;const tilt=t<EV.hit5?0.35*Math.sin(t*1.7):0;FLAKEP=p;const sa=t<EV.fl5a?clamp((t-EV.fl5a+0.6)/0.6,0,1):1;
      items.push({mesh:XM_FLAKE,M:M4.trs(p,rot,tilt,0.2*Math.cos(t*1.3),0.22),tint:[1,1,1],tintAmt:0,alpha:sa*0.95,noShadow:true});
      items.push({mesh:XM_FLAKE,M:M4.trs(p,rot,tilt,0.2*Math.cos(t*1.3),0.235),tint:[0.6,0.9,1],tintAmt:1,alpha:sa*0.35,add:1,noShadow:true})}
    if(t>=EV.hit5){const k=t-EV.hit5;walk=0;o.lid=0;o.headDown=0;if(k<0.5)for(let i=0;i<12;i++){const d=V.norm([hsh(i,1)-0.5,hsh(i,2)-0.3,hsh(i,3)-0.5]);items.push({mesh:UEMIS,M:M4.trs(V.add([0,0.9,-0.42],V.sc(d,k*0.9)),0,0,0,0.02*(1-k/0.5)),tint:[0.8,0.95,1],tintAmt:1,alpha:1,add:1,noShadow:true})}
      const sq=1-0.35*easeOut(clamp(k/0.25,0,1));
      if(t>=EV.fall5){const fk=easeIn(clamp((t-EV.fall5)/0.35,0,1));const bb=t>=EV.fall5+0.35&&t<EV.fall5+0.6?Math.sin((t-EV.fall5-0.35)/0.25*Math.PI)*0.05:0;Rm=M4.trs([-0.12*fk,bb,0],0,0,1.45*fk,[1,sq,1]);o.xeyes=t>=EV.fall5+0.3}
      else{pose='squash';Rm=M4.trs([Math.sin(k*60)*0.02,0,0],0,0,0,[1+0.15*(1-sq),sq,1+0.1*(1-sq)])}}}
  if(t>=R[5]){walk=0}
  o.ph=walk?xmD(t)*4.7:0;o.walk=walk;o.pose=pose;
  const coughs=[2.2,EV.res1+1.6,EV.up2+1.2,EV.res3+1.4,R[4]+1.2];for(const c of coughs)if(t>=c&&t<c+1.4&&!(rn===0&&t<EV.crk1))o.cough=t-c;
  if(!hide)items.push(...xmAnt(Rm,o));
  return items}
// ---------- render ----------
function renderScene(t){const tt=sceneT(t);const env=envAt(tt);const c=camAt(tt);
  const {items}=bgItems(tt);const fd=V.norm(V.sub(c.at,c.eye));const be=V.sc(c.eye,0.01);
  renderGL(Object.assign({},env,{fogD:env.fogD*2.4}),{eye:be,at:V.add(be,fd),fov:0.95,near:4,far:4e5},null,items,tt);
  const bvp=LASTVP;LASTBG={eye:be,fd};
  const fitems=fgItems(tt);const rn=roundAt(tt);const fenv=Object.assign({},env,{fogD:rn===3?2600:900*(1-0.7*blizK(tt))});
  let sd={center:[0,0,-0.6],radius:5.0};if(rn===1){const p=antPos2(tt);sd={center:[-0.6,p[1]*0.6+0.5,0.3],radius:Math.max(5,p[1]*0.7+3)}}if(rn===2)sd={center:[0,0.5,1.5],radius:7};
  LASTVP=renderGL(fenv,{eye:c.eye,at:c.at,fov:0.95,near:0.05,far:4000},sd,fitems,tt,{noClear:true,noSky:true})}
let LASTBG=null;
function shakeAmt(t){const tt=sceneT(t);let a=0;const S=(t0,amp,d)=>{const k=tt-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.ornHit,16,0.35);S(EV.frz1,8,0.3);S(EV.crk1,26,0.5);S(EV.land2,30,0.5);S(EV.hit3,40,0.7);S(EV.pop3,10,0.3);S(EV.exp4,10,0.6);S(EV.boom4,38,0.8);S(EV.land4,14,0.3);S(EV.hit5,12,0.3);S(EV.fall5+0.35,14,0.4);
  if(roundAt(tt)===2&&tt>=EV.ball3&&tt<EV.hit3)a+=6*ease((tt-EV.ball3)/(EV.hit3-EV.ball3));
  if(blizK(tt)>0.3)a+=2.5*blizK(tt);if(tt<0.6)a+=6*(1-tt/0.6);return a}
// ---------- overlays ----------
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function card(s,y,bg,size,t0,t){const k=t-t0;const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.15:1;ctx.save();ctx.translate(W/2,y);ctx.scale(pp,pp);ctx.translate(-W/2,0);pill(s,0,bg,size,Math.min(1,k/0.1));ctx.restore()}
function drawHP(t,pct,col,label){ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-330,-50,660,100,50);ctx.fill();txt('🐜 HP',-235,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(pct>0){ctx.fillStyle=col;rrect(-150,-17,Math.max(14,330*pct),34,17);ctx.fill()}
  txt(label,250,2,label==='K.O.'?46:40,label==='K.O.'?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
const BLUE='rgba(20,110,170,0.92)',DARK='rgba(15,10,30,0.8)',PINK='rgba(200,40,110,0.92)',GREEN='rgba(40,140,60,0.9)',RED='rgba(200,30,40,0.92)';
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const k=t-R[rn];
  const [lab,cap1,cap2,t2]=ROUNDS[rn];
  const pp=k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1;ctx.save();ctx.translate(W/2,250);ctx.scale(pp,pp);txt(lab,0,0,rn===4?104:120,rn===4?'#5AF0FF':'#ffd84a');ctx.restore();
  if(t<t2)pill(cap1,385,rn===4?'rgba(30,90,160,0.85)':'rgba(15,10,30,0.72)',60,Math.min(1,k/0.12));else pill(cap2,385,rn===4?'rgba(200,40,40,0.88)':'rgba(40,140,60,0.88)',rn===4?54:58,Math.min(1,(t-t2)/0.12));
  const ko=t>=EV.fall5+0.3;drawHP(t,ko?0:0.03+0.01*Math.sin(t*9),'#ff4a4a',ko?'K.O.':'1%');
  // R1
  if(rn===0&&t>=EV.bliz1+0.5&&t<EV.frz1)card('Wind chill: -40° 🥶',660,BLUE,58,EV.bliz1+0.5,t);
  if(rn===0&&t>=EV.frz1+0.5&&t<EV.crk1)card('FROZEN SOLID 🧊',660,BLUE,62,EV.frz1+0.5,t);
  if(rn===0&&t>=EV.frz1+1.3&&t<EV.crk1)card('(-40° is the same in °C AND °F 🤯)',780,DARK,42,EV.frz1+1.3,t);
  if(rn===0&&t>=EV.res1+0.5&&t<R[1]-0.2)card('Real: some insects survive -40° ❄️',660,BLUE,48,EV.res1+0.5,t);
  if(rn===0&&t>=EV.res1+1.3&&t<R[1]-0.2)card('(they make their own antifreeze 🧪)',780,DARK,44,EV.res1+1.3,t);
  // R2
  if(rn===1&&t>=R[1]+0.6&&t<EV.slip2)card('Top of a GIANT tree 😳',660,GREEN,56,R[1]+0.6,t);
  if(rn===1&&t>=EV.slip2+0.2&&t<EV.land2)card('AAAAAAA 😱',660,PINK,72,EV.slip2+0.2,t);
  if(rn===1&&t>=EV.res2+0.5&&t<R[2]-0.2)card('Real: tiny bugs hit terminal velocity FAST 🪂',660,BLUE,40,EV.res2+0.5,t);
  if(rn===1&&t>=EV.res2+1.3&&t<R[2]-0.2)card('Falls basically can’t hurt an ant 🐜',780,DARK,46,EV.res2+1.3,t);
  // R3
  if(rn===2&&t>=EV.warn3&&t<EV.hit3)card('BEHIND YOU 😱',660,PINK,72,EV.warn3,t);
  if(rn===2&&t>=EV.hit3+0.9&&t<EV.pop3)card('Flattened? 🫓',660,DARK,60,EV.hit3+0.9,t);
  if(rn===2&&t>=EV.res3+0.5&&t<R[3]-0.2)card('Real: fresh snow is 90–95% AIR 🌨️',660,BLUE,48,EV.res3+0.5,t);
  if(rn===2&&t>=EV.res3+1.3&&t<R[3]-0.2)card('He just… breathed 🫁',780,DARK,52,EV.res3+1.3,t);
  // R4
  if(rn===3&&t>=R[3]+0.6&&t<EV.sl4a)card('To visit every home in ONE night…',1430,DARK,46,R[3]+0.6,t);
  if(rn===3&&t>=R[3]+1.4&&t<EV.exp4+0.4)card('Santa needs ~1,000 km/s 🦌💨',1550,RED,50,R[3]+1.4,t);
  if(rn===3&&t>=EV.sl4a+0.3&&t<EV.exp4+0.4)card('≈ 3,000× the speed of sound 💥',1310,PINK,50,EV.sl4a+0.3,t);
  if(rn===3&&t>=EV.exp4+0.5&&t<EV.res4)card('It burned up like a meteor ☄️',1310,PINK,52,EV.exp4+0.5,t);
  if(rn===3&&t>=EV.res4+0.4&&t<R[4]-0.2)card('(Santa bailed out. He’s fine 🎅)',660,DARK,48,EV.res4+0.4,t);
  if(rn===3&&t>=EV.res4+1.2&&t<R[4]-0.2)card('Classic “physics of Santa” math 🧮',780,BLUE,44,EV.res4+1.2,t);
  // FINAL
  if(rn===4&&t>=R[4]+0.6&&t<EV.up5)card('Nothing left… 😌',660,DARK,56,R[4]+0.6,t);
  if(rn===4&&t>=EV.fl5a+0.3&&t<EV.hit5)card('1 snowflake ❄️ (slow-mo)',660,'rgba(30,120,190,0.92)',54,EV.fl5a+0.3,t);
  if(rn===4&&t>=EV.res5+0.7)card('A snowflake ≈ 3 mg ❄️',660,BLUE,52,EV.res5+0.7,t);
  if(rn===4&&t>=EV.res5+1.6)card('An ant ≈ 1–5 mg 🐜 …same weight 😳',780,DARK,44,EV.res5+1.6,t)}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  txt('CHRISTMAS 🎄',0,-110,fitSize('CHRISTMAS 🎄',980,120),'#7DFF9A');txt('vs',0,-5,76,'#ffffff');txt('ONE DYING ANT 🐜',0,95,96,'#ff6a5a');ctx.restore();
  if(t>0.9){ctx.save();ctx.globalAlpha=a*clamp((t-0.9)/0.3,0,1);pill('Who wins? 🤔',1500,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,640);ctx.scale(pop,pop);
  const l1='Survived -40°, a tree, an avalanche';txt(l1,0,-260,fitSize(l1,980,60),'#FFD84A');const l2='& Santa’s sleigh ☄️';txt(l2,0,-180,fitSize(l2,960,60),'#FFD84A');
  txt('Lost to ONE',0,-50,fitSize('Lost to ONE',960,96),'#ffffff');txt('snowflake ❄️',0,60,fitSize('snowflake ❄️',960,110),'#5AF0FF');txt('👇',0,240+Math.abs(Math.sin((t-t0)*5))*26,110,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should fight him next?',W/2,1100,52,'#ffffff','center',800);ctx.restore()}
function glowAt(p,rad,col,a){if(!p)return;const g=ctx.createRadialGradient(p[0],p[1],rad*0.1,p[0],p[1],rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-rad,p[1]-rad,rad*2,rad*2)}
// snow splat on the "lens"
const SPL=[];{for(let i=0;i<26;i++)SPL.push([hsh(i,1)*W,hsh(i,2)*H,120+hsh(i,3)*300])}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=sceneT(t);const rn=roundAt(tt);
  ctx.save();ctx.globalCompositeOperation='screen';for(const q of QPTS){const s=project(LASTVP,q.p);if(s&&s[2]>0.1)glowAt(s,Math.min(q.cap||900,q.r*1900/s[2]),q.c,q.a)}
  // lights string glows near camera
  {const dist=xmD(tt);for(let k=-2;k<9;k++){const kk=Math.floor(dist/1.2)+k;const z=-kk*1.2-0.6+dist;const idx=((kk%5)+5)%5;const x=-3.3+0.35*Math.sin(kk*0.7);const s=project(LASTVP,[x,0.13,z]);if(s&&s[2]>0.2){const lc=['255,70,80','255,220,80','90,240,255','125,255,154','255,110,220'][idx];glowAt(s,Math.min(160,0.5*1900/s[2]),lc,0.55)}}}
  if(FLAKEP){const s=project(LASTVP,FLAKEP);if(s)glowAt(s,Math.min(500,0.5*1900/s[2]),'170,230,255',0.55)}
  ctx.restore();
  // snow splat
  if(SPLAT>0.01){ctx.save();ctx.globalAlpha=Math.min(1,SPLAT*1.2);ctx.fillStyle='rgba(246,248,255,0.96)';ctx.fillRect(0,0,W,H);ctx.restore();ctx.save();ctx.globalAlpha=clamp(SPLAT*2,0,1);for(const [x,y,r] of SPL){const g=ctx.createRadialGradient(x,y,r*0.2,x,y,r);g.addColorStop(0,'rgba(255,255,255,0.95)');g.addColorStop(1,'rgba(220,230,250,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU2);ctx.fill()}ctx.restore()}
  // final letterbox
  if(rn===4&&tt>=EV.fl5a&&tt<EV.res5+0.8){const k=ease((tt-EV.fl5a)/0.4)*(1-ease((tt-EV.res5-0.4)/0.4));ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,110*k);ctx.fillRect(0,H-110*k,W,110*k)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.35,0.15);flash(EV.ornHit,0.4,0.2,'255,120,120');flash(EV.frz1,0.5,0.3,'160,230,255');flash(EV.crk1,0.6,0.3,'200,240,255');flash(EV.land2,0.4,0.25);
  flash(EV.exp4,0.45,0.5,'255,190,110');flash(EV.boom4,0.5,0.3);flash(EV.land4,0.25,0.2,'255,230,150');flash(EV.hit5,0.5,0.3,'200,240,255');flash(EV.fall5+0.35,0.3,0.25);
  if(t<EV.loop){drawHUD(t);drawTitle(t);drawEnd(t)}else{drawTitle(tt)}
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.38;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);sceneT(tm);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
