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
