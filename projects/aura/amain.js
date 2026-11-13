// ===================== AURA VIDEO =====================
const FPS=30,DUR=65,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
const RE=6371;
initGL();initAssets();buildSpace();buildModels();buildPlanets();
// ---------- timeline ----------
const DURS=[];for(let i=0;i<24;i++)DURS.push(i<12?2.55:i<22?2.35:i===22?2.0:3.4);
const STEPS=[];{let t=1.2;for(const d of DURS){STEPS.push([t,d]);t+=d}}const T_END=STEPS[23][0]+STEPS[23][1];
const CAP=['Normal guy, normal day 🚶','Dogs start following you 🐕','Pigeons bow to you 🐦','Traffic stops for you 🚗','Everyone turns to look 👀','Slow motion activated 😎','The ocean parts for you 🌊','The Sun puts a spotlight on you ☀️','Fireworks everywhere 🎆','Animals line up to watch 🦌','Mountains bow to you 🏔️','Snow melts where you walk 🌱','A whole stadium chants your name 🏟️','You start floating ☁️','Planes turn around to see you ✈️','Your aura is visible from space 🌍','The Moon turns to look at you 🌕','Satellites orbit YOU 🛰️','The Sun gets jealous 😤','Planets line up behind you 🪐','Galaxies spin around you 🌌','Even a black hole can\'t stop you 🕳️','INFINITE AURA ♾️','…then you tripped 💀'];
const LOCS=['park','suburb','city','highway','city','coast','seabed','desert','night','forest','mount2','ice','stadium','clouds','clouds'];
function stepAt(t){for(let i=STEPS.length-1;i>=0;i--)if(t>=STEPS[i][0])return i+1;return 0}
const auraVal=n=>1000*Math.pow(2,n-1);
// ---------- materials / extra meshes ----------
const um=(f,s)=>{const m=new MB();f(m);return m.build(s)};
const UCYLE=um(m=>m.prism([0,-0.5,0],1,1,1,24,[1,1,1],MAT.emis),0.7);
const DISC=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1],MAT.emis)}});
function person(mb,x,z,yaw,shirt,pant,skin,armsUp,s){s=s||1;const cs=Math.cos(yaw),sn=Math.sin(yaw);const P=(lx,ly,lz)=>[x+(lx*cs+lz*sn)*s,ly*s,z+(-lx*sn+lz*cs)*s];
  for(const sx of[-1,1]){const p=P(sx*0.1,0,0);mb.prism(p,0.08*s,0.08*s,0.9*s,8,pant);mb.ico(P(sx*0.1,0.05,0.05),0.08*s,hx('#eee'),0,0.6,[5,8])}
  mb.prism(P(0,0.88,0),0.17*s,0.19*s,0.55*s,10,shirt);mb.ico(P(0,1.43,0),0.19*s,shirt,0,0.45,[6,10]);mb.ico(P(0,1.64,0),0.12*s,skin,0,1.1,[7,10]);mb.ico(P(0,1.72,-0.01),0.12*s,hx(['#3a2a22','#1a1a1a','#8a5a30','#d8b060'][Math.floor(Math.abs(x*7+z*3))%4]),0,0.6,[6,10]);
  for(const sx of[-1,1]){if(armsUp){const p=P(sx*0.24,1.38,0);mb.prism(p,0.055*s,0.05*s,0.55*s,8,shirt);mb.ico(P(sx*0.26,1.95,0),0.055*s,skin,0,1,[5,8])}else{const p=P(sx*0.25,0.86,0);mb.prism(p,0.05*s,0.055*s,0.56*s,8,shirt);mb.ico(P(sx*0.25,0.84,0),0.05*s,skin,0,1,[5,8])}}}
const SHIRTS=['#e04848','#3c8de0','#52c060','#f0d040','#f2f2f2','#e07fd0','#ff8a30','#40c8c8','#8a60d0','#2a2a2a'].map(hx),PANTS=['#2c3245','#3a4a6a','#5a4a3a','#1a1a1a','#6a6a70'].map(hx),SKINS=['#e6b394','#c88a62','#8a5a3c','#f2c8a8','#a8704a'].map(hx);
const rcol=(r,a)=>a[Math.floor(r()*a.length)];
let CROWD;{const m=new MB();const r=rngG(5);for(let z=-110;z<30;z+=1.3)for(const s of[-1,1])for(let row=0;row<2;row++){person(m,s*(3.0+row*0.9)+(r()-0.5)*0.3,z+(r()-0.5)*0.5+row*0.6,s>0?-Math.PI/2:Math.PI/2,rcol(r,SHIRTS),rcol(r,PANTS),rcol(r,SKINS),false)}CROWD=m.build(0.45)}
let MTN;{const m=new MB();m.prism([0,0,0],520,30,1500,16,hx('#7a7268'));m.prism([0,1000,0],180,30,505,16,C.snow);m.prism([0,0,0],560,400,300,16,hx('#5f7f45'));MTN=m.build(0.6)}
let SUNM,BHDISC,GALAXY,SATM;
{const m=new MB();m.ico([0,0,0],1,hx('#ffd060'),MAT.emis,1,[28,40]);SUNM=m.build(0.3)}
{const m=new MB();const seg=96;for(let k=0;k<10;k++){const r0=1.3+k*0.22,r1=r0+0.22;const f=k/10;const c=mix3(mix3([1,1,0.95],[1,0.7,0.3],Math.min(1,f*2)),[0.8,0.2,0.1],Math.max(0,f*2-1));for(let i=0;i<seg;i++){const a=i/seg*TAU2,b=(i+1)/seg*TAU2;m.quad([Math.cos(a)*r0,0,Math.sin(a)*r0],[Math.cos(a)*r1,0,Math.sin(a)*r1],[Math.cos(b)*r1,0,Math.sin(b)*r1],[Math.cos(b)*r0,0,Math.sin(b)*r0],c,MAT.emis)}}BHDISC=m.build()}
{const m=new MB();const r=rngG(9);for(let i=0;i<3500;i++){const arm=i%2,d=Math.pow(r(),0.7)*100,a=d*0.06+arm*Math.PI+(r()-0.5)*0.6;const x=Math.cos(a)*d,z=Math.sin(a)*d,y=(r()-0.5)*4*(1-d/110);const c=d<15?[1,0.95,0.8]:(r()<0.5?[0.7,0.8,1]:[1,0.75,0.9]);const s=0.25+r()*0.5;m.box([x,y,z],[s,s,s],c,MAT.emis)}GALAXY=m.build()}
{const m=new MB();m.box([0,0,0],[0.5,0.5,0.7],hx('#d8c070'));for(const s of[-1,1])m.box([s*0.9,0,0],[1.1,0.03,0.45],hx('#24407a'));m.prism([0,0.25,0],0.05,0.05,0.3,6,[0.8,0.8,0.8]);SATM=m.build()}
// ---------- extra tiles ----------
const AT={};
function atile(key){if(AT[key])return AT[key];if(['park','suburb','city','highway','coast','desert','night','ice'].includes(key)){AT[key]=tile(key);return AT[key]}
  const m=new MB(),sm=new MB(),wm=new MB();let T,env,cam;const r=rngG(key.length*31);
  if(key==='seabed'){T=80;ground(m,-7,-T,7,0,C.sand,0,4,(x,z)=>{const q=hsh(Math.floor(x/4)+3,Math.floor(-z/4));return q<0.5?hx('#e2cf9a'):hx('#d4bc84')});
    for(let i=0;i<14;i++){const x=(r()<0.5?-1:1)*(1.5+r()*4.5),z=-r()*T;if(r()<0.5){for(let k=0;k<4;k++)m.prism([x+(r()-0.5)*0.4,0,z+(r()-0.5)*0.4],0.06,0.02,0.8+r()*1.2,5,hx('#3a8a4a'))}else m.ico([x,0,z],0.3+r()*0.5,hx(['#e86a5a','#f0a040','#c07ad0'][i%3]),0,0.6,[6,8])}
    for(let i=0;i<6;i++)m.ico([(r()<0.5?-1:1)*(2+r()*4),0,-r()*T],0.4+r()*0.8,C.rock,0,0.7);
    for(const s of[-1,1]){wm.quad([s*7,0,-T],[s*7,0,0],[s*7,14,0],[s*7,14,-T],[hx('#0c3a70'),hx('#0c3a70'),hx('#3aa0d8'),hx('#3aa0d8')]);wm.box([s*7,14,-T/2],[0.6,0.4,T],[0.95,0.98,1])}
    sm.quad([-4000,14,-4000],[-4000,14,4000],[-7,14,4000],[-7,14,-4000],hx('#1f6fa8'),MAT.water);sm.quad([7,14,-4000],[7,14,4000],[4000,14,4000],[4000,14,-4000],hx('#1f6fa8'),MAT.water);
    env=envDay({fogD:160,sun:[0.3,0.85,0.4],fog:hx('#bfe0f0'),hor:hx('#d8eef8')});cam={eye:[1.6,1.2,-5.2],at:[0,1.2,0.5],orb:0.2}}
  if(key==='forest'){T=60;ground(m,-120,-T,120,0,C.grass2,0,6,(x,z)=>hsh(Math.floor(x/6)+11,Math.floor(-z/6))<0.5?hx('#4f8a3a'):hx('#5f9a45'));ground(m,-1.3,-T,1.3,0,hx('#9a7a55'),0.03,6);
    for(let i=0;i<34;i++){const s=r()<0.5?-1:1;tree(m,s*(6+r()*45),-r()*T,2+r()*1.6,0,r()<0.5?'pine':'')}
    for(let i=0;i<10;i++){const x=(r()<0.5?-1:1)*(2+r()*3),z=-r()*T;m.prism([x,0,z],0.05,0.05,0.18,6,[0.95,0.95,0.9]);m.ico([x,0.2,z],0.13,hx('#d03030'),0,0.5,[6,8])}
    for(let k=0;k<8;k++){const s=k%2?1:-1,z=-k*7.5-3,x=s*(2.6+r()*0.6);const dc=hx('#a0683a');const f=-s;m.ico([x,1.0,z],0.42,dc,0,0.6,[8,12]);m.ico([x+f*0.42,1.45,z],0.18,dc,0,1.1,[7,10]);m.ico([x+f*0.58,1.42,z],0.09,hx('#2a1a10'),0,1,[5,6]);for(const lz of[-0.2,0.2])for(const lx of[-0.25,0.25])m.prism([x+lx,0,z+lz],0.05,0.04,0.95,6,dc);for(const lz of[-0.1,0.1]){m.prism([x+f*0.4,1.58,z+lz],0.02,0.01,0.35,5,hx('#6a4a2a'))}}
    for(let k=0;k<10;k++){const s=k%2?1:-1,z=-k*6-1,x=s*(1.9+r()*0.4);m.ico([x,0.18,z],0.18,[0.9,0.9,0.9],0,0.9,[6,8]);m.ico([x-s*0.12,0.36,z],0.1,[0.9,0.9,0.9],0,1,[6,8]);for(const lz of[-0.04,0.04])m.prism([x-s*0.12,0.42,z+lz],0.025,0.015,0.18,5,[0.95,0.85,0.85])}
    env=envDay({fogD:140,sun:[0.4,0.8,0.4],sunCol:hx('#fff0c8'),fog:hx('#cfe0c8')});cam={eye:[0.3,1.7,-5.5],at:[0,1.1,0.5],orb:0.25}}
  if(key==='stadium'){T=60;ground(m,-60,-T,60,0,C.grass,0,6,(x,z)=>Math.floor(-z/6)%2?C.grass:C.grass2);ground(m,-5,-T,5,0,hx('#c0503a'),0.03,6);for(const x of[-5,-2.5,0,2.5,5])m.box([x,0.05,-T/2],[0.08,0.02,T],[1,1,1]);
    for(const s of[-1,1]){for(let k=0;k<9;k++){const x=s*(10+k*1.6),y=0.5+k*1.0;m.box([x,y/2,-T/2],[1.6,y,T],hx('#7a7a86'));}m.box([s*26,10,-T/2],[1,20,T],hx('#5a5a66'))}
    const cm=new MB(),cm2=new MB();for(const s of[-1,1])for(let k=0;k<9;k++)for(let z=-0.5;z>-T;z-=0.85){const x=s*(10+k*1.6)+(r()-0.5)*0.2,y=0.5+k*1.0;person((k+Math.floor(-z))%2?cm:cm2,x,z,s>0?-Math.PI/2:Math.PI/2,rcol(r,SHIRTS),rcol(r,PANTS),rcol(r,SKINS),r()<0.6,0.9);}
    for(const s of[-1,1])for(let z=-10;z>-T;z-=30){sm.d.length;m.prism([s*28,0,z],0.4,0.3,32,8,hx('#888'));m.box([s*27,32,z],[2,3,6],[1,1,0.9],MAT.emis)}
    AT[key]={mesh:m.build(0.45),crowdA:cm.build(0.45),crowdB:cm2.build(0.45),T,env:envDay({fogD:300,sun:[0.4,0.6,0.6],sunCol:hx('#ffe8c8'),zen:hx('#3a5ac0'),hor:hx('#f0c8a8'),fog:hx('#e8d0c0')}),cam:{eye:[2.4,1.3,-5.8],at:[0,1.4,0.5],orb:0.35}};return AT[key]}
  if(key==='mount2'){T=200;ground(m,-200,-T,200,0,C.grass,0,10,(x,z)=>hsh(Math.floor(x/10)+2,Math.floor(-z/10))<0.5?hx('#6a9a48'):hx('#5a8a40'));ground(m,-1.3,-T,1.3,0,hx('#a89070'),0.03,10);
    for(let i=0;i<16;i++)tree(m,(r()<0.5?-1:1)*(6+r()*80),-r()*T,2+r()*1.4,0,'pine');for(let i=0;i<10;i++)m.ico([(r()<0.5?-1:1)*(4+r()*40),0,-r()*T],0.5+r()*1.5,C.rock,0,0.6);
    env=envDay({fogD:3500,sun:[0.5,0.7,0.4],fog:hx('#d8e6f2'),zen:hx('#2f6fd0')});cam={eye:[-2.6,1.0,4.2],at:[0.4,2.6,-6],orb:0.2}}
  if(key==='clouds'){T=400;for(let i=0;i<90;i++){const x=(r()-0.5)*800,z=-r()*T,s=8+r()*22,y=-25-r()*15;if(Math.abs(x)<6)continue;for(let k=0;k<4;k++)m.ico([x+(r()-0.5)*s*1.6,y+(r()-0.5)*s*0.3,z+(r()-0.5)*s],s*(0.5+r()*0.5),[1,1,1],0,0.6,[9,14])}
    sm.quad([-9000,-40,-9000],[-9000,-40,9000],[9000,-40,9000],[9000,-40,-9000],[0.94,0.96,1]);
    env=envDay({fogD:1600,sun:[0.5,0.6,0.5],fog:hx('#e8f0fa'),zen:hx('#1a4ab8'),hor:hx('#cfe2f6'),sky:hx('#a8c8f0'),gnd:hx('#e8eef6')});cam={eye:[2.4,1.0,-6],at:[0,1.3,0.5],orb:0.3}}
  const L={mesh:m.build(0.45),T,env,cam,stat:sm.d.length?sm.build(0.45):null,walls:wm.d.length?wm.build():null};AT[key]=L;return L}
// ---------- walker ----------
const RC={hood:hx('#e2483a'),hood2:hx('#c43a2e'),pant:hx('#2c3a5a'),shoe:hx('#f4f4f4'),sole:hx('#e2483a'),skin:hx('#e6b394'),hair:hx('#3a2a22'),cap:hx('#1f6fd8')};
function walker(base,phase,o){o=o||{};const items=[];const B=M4.trs(base,o.yaw==null?Math.PI:o.yaw,o.lean||0,o.roll||0,1);const amp=o.amp==null?1:o.amp;
  const put=(M,mesh,off,s,col,ns)=>{items.push({mesh,M:M4.mul(M,M4.trs(off,0,0,0,s)),tint:col,tintAmt:1,noShadow:!!ns})};const J=(M,t,rx,rz)=>M4.mul(M,M4.trs(t,0,rx||0,rz||0,1));
  const hipY=0.94,Lt=0.44,Ls=0.44;const P=J(B,[0,hipY+0.03*amp*Math.abs(Math.cos(phase)),0],0.02);put(P,USPH,[0,0.02,0],[0.17,0.11,0.11],RC.pant);
  const Tq=J(P,[0,0.05,0],-0.04+(o.chest||0));put(Tq,UCYL,[0,0.24,0],[0.165,0.44,0.115],RC.hood);put(Tq,USPH,[0,0.02,0],[0.165,0.07,0.115],RC.hood);put(Tq,USPH,[0,0.46,0],[0.2,0.09,0.12],RC.hood);
  put(Tq,USPH,[0,0.43,-0.1],[0.13,0.1,0.07],RC.hood2);put(Tq,UB,[0,0.16,0.112],[0.18,0.1,0.01],RC.hood2);for(const sx of[-1,1])put(Tq,UCYL,[sx*0.04,0.36,0.118],[0.008,0.12,0.008],[0.95,0.95,0.95],1);
  const Hd=J(Tq,[0,0.52,0],0.02+(o.head||0));put(Hd,UCYL,[0,0.04,0],[0.05,0.08,0.05],RC.skin);put(Hd,USPH,[0,0.17,0.01],[0.105,0.125,0.11],RC.skin);put(Hd,USPH,[0,0.23,-0.012],[0.11,0.08,0.112],RC.hair,1);
  put(Hd,USPH,[0,0.255,0.0],[0.118,0.065,0.12],RC.cap,1);put(Hd,USPH,[0,0.235,0.1],[0.085,0.012,0.08],RC.cap,1);for(const sx of[-1,1])put(Hd,USPH,[sx*0.105,0.17,0],[0.02,0.03,0.025],RC.skin,1);put(Hd,USPH,[0,0.15,0.11],[0.016,0.02,0.02],[0.9,0.66,0.55],1);
  if(o.glasses){for(const sx of[-1,1])put(Hd,USPH,[sx*0.045,0.185,0.1],[0.04,0.026,0.012],[0.04,0.04,0.06],1);put(Hd,UB,[0,0.19,0.106],[0.13,0.012,0.01],[0.04,0.04,0.06],1)}else for(const sx of[-1,1])put(Hd,USPH,[sx*0.04,0.18,0.098],[0.014,0.018,0.01],[0.08,0.08,0.1],1);
  for(const sx of[-1,1]){const p=phase+(sx>0?Math.PI:0);const th=o.legs!=null?o.legs*sx:-0.42*amp*Math.sin(p);const kn=o.knee!=null?o.knee:0.08+0.55*amp*Math.max(0,Math.cos(p+0.4));
    const Hp=J(P,[sx*0.095,0,0],th);put(Hp,USPH,[0,0,0],[0.09,0.09,0.09],RC.pant);put(Hp,UCYL,[0,-Lt/2,0],[0.085,Lt,0.09],RC.pant);const K=J(Hp,[0,-Lt,0],kn);put(K,USPH,[0,0,0],[0.075,0.075,0.075],RC.pant);put(K,UCYL,[0,-Ls/2,0],[0.068,Ls,0.07],RC.pant);
    const A=J(K,[0,-Ls,0],-kn*0.5-th*0.3);put(A,USPH,[0,-0.035,0.06],[0.065,0.05,0.135],RC.shoe);put(A,USPH,[0,-0.07,0.06],[0.066,0.02,0.136],RC.sole)}
  for(const sx of[-1,1]){const p=phase+(sx>0?0:Math.PI);const sh=o.arms!=null?o.arms:0.38*amp*Math.sin(p);const S=J(Tq,[sx*0.2,0.43,0],sh,sx*(o.armOut||0.1));put(S,USPH,[0,0,0],[0.065,0.065,0.065],RC.hood);put(S,UCYL,[0,-0.14,0],[0.058,0.28,0.058],RC.hood);
    const E=J(S,[0,-0.28,0],o.elbow!=null?o.elbow:-0.35);put(E,USPH,[0,0,0],[0.055,0.055,0.055],RC.hood);put(E,UCYL,[0,-0.12,0],[0.05,0.24,0.05],RC.hood);put(E,USPH,[0,-0.27,0],[0.045,0.055,0.05],RC.skin)}
  return items}
// ---------- aura ----------
function auraCol(n){const cs=[[0.8,0.95,1],[0.5,0.8,1],[0.6,0.5,1],[0.85,0.45,1],[1,0.75,0.3],[1,0.85,0.4]];const f=clamp((n-1)/4.5,0,5);const i=Math.floor(f),k=f-i;return mix3(cs[Math.min(5,i)],cs[Math.min(5,i+1)],k)}
function auraItems(c,n,t,ground,space){const it=[];const col=auraCol(n);const g=Math.min(1,0.25+n*0.06);const pul=1+0.04*Math.sin(t*6);
  for(let L=0;L<4;L++){const sc=1+L*0.32;const al=[0.09,0.055,0.035,0.022][L]*g*(space?0.7:1);it.push({mesh:UEMIS,M:M4.trs([c[0],c[1]+1.0,c[2]],0,0,0,[0.42*sc*pul*(1+n*0.02),1.0*sc*pul*(1+n*0.01),0.38*sc*pul*(1+n*0.02)]),tint:col,tintAmt:1,alpha:al,noShadow:true,add:1})}
  const np=Math.min(26,6+n);for(let i=0;i<np;i++){const a=(t*0.6+i/np)%1;const ang=i*2.39+t*0.8;const rr=0.35+0.25*hsh(i,7)+n*0.012;it.push({mesh:UEMIS,M:M4.trs([c[0]+Math.cos(ang)*rr,c[1]+0.1+a*(2.0+n*0.05),c[2]+Math.sin(ang)*rr],0,0,0,0.025+0.02*hsh(i,3)),tint:mix3(col,[1,1,1],0.5),tintAmt:1,alpha:0.9*(1-a),noShadow:true,add:1})}
  if(ground){it.push({mesh:DISC,M:M4.trs([c[0],c[1]+0.02,c[2]],0,0,0,[0.7+n*0.05,1,0.7+n*0.05]),tint:col,tintAmt:1,alpha:0.18*g,noShadow:true,add:1})}
  if(n>=11&&!space){const bh=n>=14?400:120;it.push({mesh:UCYLE,M:M4.trs([c[0],c[1]+bh/2,c[2]],0,0,0,[0.5+n*0.02,bh,0.5+n*0.02]),tint:col,tintAmt:1,alpha:0.08,noShadow:true,add:1})}
  return it}
// ---------- animals ----------
function dog(x,z,t,col,ph){const it=[];const b=0.04*Math.abs(Math.sin(t*9+ph));const S=(m,p,s,c)=>it.push({mesh:m,M:M4.trs([x+p[0],p[1]+b,z+p[2]],0,p[3]||0,0,s),tint:c,tintAmt:1});
  S(USPH,[0,0.42,0],[0.17,0.16,0.34],col);S(USPH,[0,0.62,-0.38],[0.14,0.13,0.15],col);S(USPH,[0,0.58,-0.52],[0.07,0.06,0.09],col);S(USPH,[0,0.61,-0.6],[0.03,0.025,0.025],[0.08,0.06,0.06]);
  for(const s of[-1,1]){S(USPH,[s*0.1,0.72,-0.36,0.3],[0.04,0.08,0.05],[col[0]*0.7,col[1]*0.7,col[2]*0.7]);S(USPH,[s*0.05,0.66,-0.5],[0.018,0.022,0.012],[0.05,0.05,0.05])}
  for(const sx of[-1,1])for(const sz of[-0.22,0.22]){const sw=0.5*Math.sin(t*9+ph+(sx*sz>0?0:Math.PI));it.push({mesh:UCYL,M:M4.mul(M4.trs([x+sx*0.1,0.4+b,z+sz],0,sw,0,1),M4.trs([0,-0.2,0],0,0,0,[0.05,0.4,0.05])),tint:col,tintAmt:1})}
  it.push({mesh:UCYL,M:M4.mul(M4.trs([x,0.5+b,z+0.32],0,-0.8,Math.sin(t*14+ph)*0.6,1),M4.trs([0,0.14,0],0,0,0,[0.03,0.28,0.03])),tint:col,tintAmt:1});return it}
function pigeon(x,z,bow){const it=[];const R=M4.trs([x,0,z],x<0?-Math.PI/2:Math.PI/2,0,0,1.8);const Bw=M4.mul(R,M4.trs([0,0.12,0],0,bow,0,1));const g=hx('#8a8e9a');
  const S=(p,s,c)=>it.push({mesh:USPH,M:M4.mul(Bw,M4.trs(p,0,0,0,s)),tint:c,tintAmt:1});S([0,0.05,0],[0.09,0.08,0.14],g);S([0,0.14,0.09],[0.055,0.055,0.055],hx('#5a6a7a'));S([0,0.13,0.15],[0.015,0.012,0.03],hx('#e0a040'));S([0,0.06,-0.14],[0.06,0.02,0.08],hx('#5a5e6a'));
  for(const s of[-1,1])it.push({mesh:UCYL,M:M4.mul(R,M4.trs([s*0.03,0.06,0],0,0,0,[0.01,0.12,0.01])),tint:hx('#e07060'),tintAmt:1});return it}
// ---------- render helpers ----------
let LASTVP=null,LASTMODE='',SPACEN=0;
function scrollItems(L,d){const o=((d%L.T)+L.T)%L.T;const vis=Math.min(L.env.fogD*3.2,6000);const N=Math.ceil(vis/L.T)+1;const it=[];
  for(let k=-2;k<=N;k++){const M=M4.trs([0,0,-k*L.T+o],0,0,0,1);it.push({mesh:L.mesh,M});if(L.walls)it.push({mesh:L.walls,M,alpha:0.88,noShadow:true})}if(L.stat)it.push({mesh:L.stat});return{it,o}}
function renderGround(t,n,tau,D){const L=atile(LOCS[n-1]);const slow=n===6;const v=slow?0.55:1.45;const d=v*tau+n*41;const {it,o}=scrollItems(L,d);const items=it;
  const ph=t*(slow?3.2:6.2);let base=[0,0,0];let wo={amp:slow?0.8:1,glasses:n>=6};
  if(n===14||n===15){const up=n===14?ease(tau/D)*1.4:1.4+0.1*Math.sin(t*2);base=[0,up,0];wo={amp:0.25,glasses:true,arms:0.1,armOut:0.35,elbow:-0.2,legs:0.08,knee:0.25}}
  items.push(...walker(base,ph,wo));items.push(...auraItems(base,n,t,n<14));
  const wz=z0=>z0+d; // world-anchored z -> local
  if(n===2){const cols=[hx('#c8904a'),hx('#f2f2f2'),hx('#3a2a22'),hx('#e0c080')];for(let i=0;i<4;i++){const k=Math.min(1,tau*0.8+i*0.15);items.push(...dog((i%2?0.9:-0.9)+(i>1?0.5:0),1.4+i*0.9-0.3*k,t,cols[i],i*1.3))}}
  if(n===3){for(let i=0;i<14;i++){const z=-i*2.2-4+((d)%0);const zz=wz(-i*2.2+12-n*41);const rel=zz;const bow=clamp((3.5-Math.abs(rel))/2.5,0,1)*0.9+0.1;if(rel>-30&&rel<6)items.push(...pigeon((i%2?1:-1)*(1.0+hsh(i,2)*0.8),rel,bow))}}
  if(n===4){const lanes=[-4,4,8];for(let i=0;i<14;i++){const zz=wz(-i*7-10-n*41);if(zz>-80&&zz<20)items.push({mesh:SEDAN[i%6],M:M4.trs([lanes[i%3],0,zz],0,0,0,1)})}}
  if(n===5){const zz=wz(-n*41-40);items.push({mesh:CROWD,M:M4.trs([0,0,zz+40],0,0,0,1)})}
  if(n===8){items.push({mesh:UCYLE,M:M4.trs([0,150,0],0,0,0,[1.3,300,1.3]),tint:[1,0.95,0.8],tintAmt:1,alpha:0.22,noShadow:true,add:1});items.push({mesh:DISC,M:M4.trs([0,0.03,0],0,0,0,[2.6,1,2.6]),tint:[1,0.95,0.75],tintAmt:1,alpha:0.5,noShadow:true})}
  if(n===9){for(let b=0;b<6;b++){const t0=b*0.42;const k=tau-t0;if(k<0||k>1.6)continue;const c=[(hsh(b,1)-0.5)*50,16+hsh(b,2)*20,35+hsh(b,3)*35];const col=[[1,0.3,0.3],[0.3,1,0.5],[0.4,0.6,1],[1,0.85,0.3],[1,0.4,1],[0.4,1,1]][b];
    for(let i=0;i<60;i++){const a=i*2.39,e=Math.acos(1-2*((i+0.5)/60));const sp=easeOut(k/1.2)*13;const dir=[Math.sin(e)*Math.cos(a),Math.cos(e),Math.sin(e)*Math.sin(a)];items.push({mesh:UEMIS,M:M4.trs([c[0]+dir[0]*sp,c[1]+dir[1]*sp-k*k*3,c[2]+dir[2]*sp],0,0,0,0.8*(1-k/1.8)+0.25),tint:col,tintAmt:1,alpha:Math.max(0,1-k/1.6),noShadow:true,add:1})}}}
  if(n===11){for(let i=0;i<6;i++){const s=i%2?1:-1;const x=s*(700+i*150),z=-1400-i*500;const bow=ease(tau/D)*0.4;const sc=0.45+0.06*i;items.push({mesh:MTN,M:M4.trs([x,0,z],0,0,s*bow,[sc,sc,sc])})}}
  if(n===12){for(let i=0;i<60;i++){const zz=wz(-i*0.8-n*41)+0;if(zz<0.3||zz>40)continue;const x=(hsh(i,1)-0.5)*1.6;items.push({mesh:DISC,M:M4.trs([x*0.3,0.02,zz],0,0,0,[1.0+hsh(i,4),1,1.0]),tint:hx('#4f9a3a'),tintAmt:1,noShadow:true});items.push({mesh:USPH,M:M4.trs([x,0.12,zz],0,0,0,0.07),tint:[[1,0.4,0.6],[1,0.9,0.3],[0.7,0.5,1],[1,1,1]][i%4],tintAmt:1})}}
  if(n===13){const A=L.crowdA,Bm=L.crowdB;const jA=Math.max(0,Math.sin(t*10))*0.25,jB=Math.max(0,Math.sin(t*10+Math.PI))*0.25;for(let k=-1;k<=3;k++){items.push({mesh:A,M:M4.trs([0,jA,-k*L.T+o],0,0,0,1)});items.push({mesh:Bm,M:M4.trs([0,jB,-k*L.T+o],0,0,0,1)})}}
  if(n===15){for(let i=0;i<3;i++){const a=t*0.5+i*2.1;items.push({mesh:PLANE,M:M4.trs([Math.cos(a)*55,4+i*7,Math.sin(a)*55+60],-a,0,0.3,0.6)})}}
  const c=L.cam;const u=tau/D;const a=c.orb*(u-0.5);const ca=Math.cos(a),sa=Math.sin(a);const e=[c.eye[0]*ca+c.eye[2]*sa,c.eye[1]+base[1],-c.eye[0]*sa+c.eye[2]*ca];const at=[c.at[0],c.at[1]+base[1],c.at[2]];
  let cam={eye:e,at,fov:0.95,near:0.2,far:9000};const CO={2:[[3.4,1.5,5.6],[0,0.7,0.6]],3:[[1.6,0.8,-4.2],[0,0.7,1.0]],6:[[1.1,1.0,-4.4],[0,1.35,0.5]],9:[[1.6,0.8,-4.8],[0,2.6,1]],12:[[1.8,2.6,7.0],[0,0.4,-0.5]]};if(CO[n]){const [ce,ca_]=CO[n];const ee=[ce[0]*ca+ce[2]*sa,ce[1]+base[1],-ce[0]*sa+ce[2]*ca];cam={eye:ee,at:ca_,fov:0.95,near:0.2,far:9000}}if(n===11)cam={eye:[-2.2,0.9,3.6],at:[0.3,3.0,-6],fov:1.05,near:0.2,far:9000};
  LASTVP=renderGL(L.env,cam,{center:[base[0],0,base[2]],radius:7},items,t);LASTMODE='ground'}
function spaceEnv(){return{sun:V.norm([0.3,0.35,0.88]),sunCol:hx('#fff4e6'),sky:[0.22,0.24,0.32],gnd:[0.02,0.02,0.04],fog:[0,0,0],fogD:1e12,zen:[0,0,0.01],hor:[0.005,0.008,0.02],stars:1,night:0,emis:1,sunSize:1}}
function walkerPass(t,n,env,jb,extra){const ph=t*4.5;const it=walker(jb,ph,{yaw:0.55,amp:0.6,glasses:true});it.push(...auraItems(jb,n,t,false,true));if(extra)it.push(...extra);
  renderGL({sun:env.sun,sunCol:env.sunCol,sky:[0.35,0.45,0.7],gnd:[0.25,0.35,0.6],fog:[0,0,0],fogD:1e9,zen:[0,0,0],hor:[0,0,0],stars:0,emis:1},{eye:[0,0,0],at:[0,0,-1],fov:0.98,near:0.05,far:200},{center:jb,radius:4},it,t,{noClear:true,noSky:true})}
function renderSpace(t,n,tau,D){const env=spaceEnv();const items=[];const u=tau/D;SPACEN=n;let extra=[];const jb=[-0.2,-1.75+0.08*Math.sin(t*1.3),-6.4];
  if(n===16){const h=900;const dip=Math.acos(RE/(RE+h));const gam=dip+0.32;const p=[0,RE+h,0];const look=V.norm([0,-Math.sin(gam),-Math.cos(gam)]);const EM=M4.trs([0,0,0],1.48+38*0.004+u*0.02,0.6,0,1);
    LASTVP=renderGL(earthEnvA(),{eye:p,at:V.add(p,V.sc(look,1000)),fov:0.98,near:1,far:200000},null,[{mesh:EARTH,M:EM},{mesh:EPATCH,M:EM}],t);LASTMODE='earth';walkerPass(t,n,env,jb);return}
  if(n===17)items.push({mesh:MOONH,M:M4.trs([1500,300,-7400+u*900],-0.8+u*1.2,0.2,0,1737)});
  if(n===18){items.push({mesh:ISS,M:M4.trs([60,-20,-260],t*0.2,0.3,0,1)});for(let i=0;i<7;i++){const a=t*(0.9+i*0.07)+i*0.9;const r=1.2+i*0.18;extra.push({mesh:SATM,M:M4.trs([jb[0]+Math.cos(a)*r,jb[1]+1.0+Math.sin(a*1.3)*0.5,jb[2]+Math.sin(a)*r],a,0.3,0,0.18)})}}
  if(n===19){const sp=[75,50,-420];const R=95;items.push({mesh:SUNM,M:M4.trs(sp,0,0,0,R)});const dk=[0.3,0.08,0.02];const Z=f=>sp[2]+R*f;const wob=Math.sin(t*3)*0.08;
    for(const s of[-1,1]){items.push({mesh:USPH,M:M4.trs([sp[0]+s*28,sp[1]+14,Z(0.95)],0,0,0,[13,15,5]),tint:[1,1,1],tintAmt:1});items.push({mesh:USPH,M:M4.trs([sp[0]+s*28-s*5,sp[1]+11,Z(0.99)],0,0,0,[6,7,3]),tint:dk,tintAmt:1});
      items.push({mesh:UB,M:M4.trs([sp[0]+s*28,sp[1]+33,Z(0.9)],0,0,-s*(0.5+wob),[30,5,8]),tint:dk,tintAmt:1})}
    for(let i=0;i<9;i++){const a=(i/8-0.5)*1.5;items.push({mesh:UB,M:M4.trs([sp[0]+Math.sin(a)*28,sp[1]-38+(1-Math.cos(a))*14,Z(0.9)],0,0,-a*0.6,[8,4,8]),tint:dk,tintAmt:1})}
    const sm=Math.max(0,Math.sin(t*8));items.push({mesh:USPH,M:M4.trs([sp[0]+52,sp[1]-10+sm*6,Z(0.8)],0,0,0,[6,9,6]),tint:[0.6,0.85,1],tintAmt:1})}
  if(n===20){const P=[[MARS,3390*2.4,[-0.2,0.36]],[JUP,69911,[0.07,0.25]],[SAT,58232,[0.22,0.15]]];const ds=[42000,700000,1300000];P.forEach(([m,R,dir],i)=>{const d=ds[i];const pos=[dir[0]*d,dir[1]*d,-d];items.push({mesh:m,M:M4.trs(pos,t*0.1,0.3,0,R)});if(i===2)items.push({mesh:SATRING,M:M4.trs(pos,0.3,0.45,0.2,R),alpha:0.9,noShadow:true})})}
  if(n===21)items.push({mesh:GALAXY,M:M4.trs([0,-30,-60],t*0.25,0.35,0.1,1)});
  if(n===22){items.push({mesh:BHDISC,M:M4.trs([10,6,-110],t*0.6,0.28,0.12,9)});items.push({mesh:USPH,M:M4.trs([10,6,-110],0,0,0,10.5),tint:[0,0,0],tintAmt:1})}
  if(n===23){items.push({mesh:GALAXY,M:M4.trs([0,-10,-40],t*1.2,0.6,0.2,0.8)})}
  LASTVP=renderGL(env,{eye:[0,0,0],at:[0,0,-1],fov:1.0,near:20,far:1e8},null,items,t);LASTMODE='space';walkerPass(t,n,env,jb,extra)}
function earthEnvA(){return{sun:[0.45,0.8,0.4],sunCol:hx('#fff6e6'),sky:[0.25,0.3,0.45],gnd:[0.02,0.02,0.05],fog:[0,0,0],fogD:1e9,zen:[0,0,0.01],hor:[0.01,0.01,0.03],stars:1,night:0,emis:1,sunSize:1.5}}
function renderTrip(t,tau,D){const L=atile('park');const k=clamp((tau-0.75)/0.45,0,1);const v=1.45*(1-ease(k));const d=1.45*Math.min(tau,0.75)+(tau>0.75?0.3*ease(k):0)+7;const {it}=scrollItems(L,d);const items=it;
  const fall=easeOut(k);const base=[0,0.12*Math.sin(Math.min(1,k)*Math.PI)*0.5+(k>0.9?-0.0:0),-fall*0.6];
  const wo=k<=0?{amp:1,glasses:true}:{yaw:Math.PI,lean:fall*1.45,legs:-0.3*fall,knee:0.3,arms:-2.6*fall,elbow:-0.2,armOut:0.3,glasses:true};
  items.push(...walker([0,base[1]+fall*0.1,base[2]],t*6.2,wo));
  items.push({mesh:ROCK[1],M:M4.trs([0.12,0.03,(tau<0.75?-1.1+1.45*tau:0)+0.0],0,0,0,0.09)});
  if(k>0.85){const kk=(tau-1.13)*1.2;for(let i=0;i<10;i++){const a=i/10*TAU2;items.push({mesh:USPH,M:M4.trs([Math.cos(a)*kk*1.2,0.2+kk*0.4,-1.4+Math.sin(a)*kk*1.2],0,0,0,0.12+kk*0.2),tint:[0.75,0.7,0.6],tintAmt:1,alpha:Math.max(0,0.6-kk*0.5),noShadow:true})}}
  const cam={eye:[3.0,1.0,1.2],at:[0,0.6,-0.8],fov:0.95,near:0.2,far:3000};LASTVP=renderGL(L.env,cam,{center:[0,0,-0.6],radius:6},items,t);LASTMODE='ground'}
// ---------- dispatcher ----------
function renderScene(t){if(t<1.2||t>=64.45){renderSpace(t,22,1.2,2.35);return}
  if(t>=T_END){renderTrip(t,STEPS[23][1],STEPS[23][1]);return}
  const n=stepAt(t);const[ts,D]=STEPS[n-1];const tau=Math.min(t-ts,D);
  if(n<=15)renderGround(t,n,tau,D);else if(n<=23)renderSpace(t,n,tau,D);else renderTrip(t,tau,D)}
function shakeAmt(t){if(t<1.2)return 2;const n=stepAt(t);if(t>=T_END)return 0;const k=t-STEPS[n-1][0];let a=0;if(k<0.15)a+=3+n*0.3;if(n===24){const kk=k-1.15;if(kk>0&&kk<0.4)a+=26*(1-kk/0.4)}if(n===23)a+=6;if(n===22)a+=3;return a}
// ---------- overlays ----------
function drawHUD(t){const n=stepAt(t);if(n<1||t>=T_END+0.3)return;const[ts,D]=STEPS[n-1];const k=t-ts;const pop=k<0.15?0.6+0.4*easeOut(k/0.15)+Math.sin(k/0.15*Math.PI)*0.15:1;
  let val,col='#ffffff';if(n<=22){val='+'+auraVal(n).toLocaleString('en-US');col=n>=16?'#ffe08a':'#ffffff'}else if(n===23){val='∞';col='#ffe08a'}else{const tr=k-1.15;if(tr<0){val='∞';col='#ffe08a'}else{val='-∞';col='#ff4a4a'}}
  const tripPop=n===24&&k>1.15&&k<1.45?1+0.5*Math.sin((k-1.15)/0.3*Math.PI):1;
  ctx.save();ctx.translate(W/2,245);ctx.scale(pop,pop);txt('✨ AURA ✨',0,0,78,'#ffd84a');ctx.restore();ctx.save();ctx.translate(W/2,365);ctx.scale(pop*tripPop,pop*tripPop);txt(val,0,0,fitSize(val,980,n>=23?150:118),col);ctx.restore();
  const s=CAP[n-1];const ks=n===24?k-1.2:k-0.1;if(s&&ks>0){const size=fitSize(s,920,58);const al=Math.min(1,ks/0.12,n===24?1:(D-k)/0.1);ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,522);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=n===24?'rgba(200,40,40,0.8)':(n===23?'rgba(190,140,20,0.85)':'rgba(15,10,30,0.62)');rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function drawTitle(t){const a=t<2.9?1:clamp((3.2-t)/0.3,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,t<1.2?560:1480);ctx.scale(pop,pop);
  const l1='Every second your',l2='AURA DOUBLES ✨';const s=Math.min(fitSize(l1,980,96),fitSize(l2,980,104));ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffffff');txt(l2,0,s*0.6,s*1.08,'#ffd84a');ctx.restore()}
function drawEnd(t){const t0=T_END;const k=ease((t-t0)/0.5)*clamp((64.45-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.72*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);
  txt('How much aura',0,-100,92,'#ffd84a');txt('do YOU have?',0,10,92,'#ffd84a');txt('👇',0,190+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('What should double next?',W/2,1150,50,'#ffffff','center',800);ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const n=t<1.2||t>=64.45?22:(t>=T_END?24:stepAt(t));const tau=t<1.2?t:(t>=T_END?3.4:t-STEPS[n-1][0]);
  if(LASTMODE==='earth'){const g=ctx.createRadialGradient(W*0.5,H*0.62,0,W*0.5,H*0.62,700);g.addColorStop(0,'rgba(255,230,140,0.55)');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  if(n===19){const p=project(LASTVP,[75,50,-420]);if(p){const g=ctx.createRadialGradient(p[0],p[1],100,p[0],p[1],800);g.addColorStop(0,'rgba(255,200,80,0.5)');g.addColorStop(1,'rgba(255,150,40,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
  if(n===22){const p=project(LASTVP,[10,6,-110]);if(p){const g=ctx.createRadialGradient(p[0],p[1],120,p[0],p[1],600);g.addColorStop(0,'rgba(255,170,90,0.35)');g.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
  if(n===23&&t<T_END){const k=tau/2;const r=rngG(Math.floor(t*60));ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<8;i++){const a=t*0.8+i/8*TAU2;ctx.strokeStyle=`hsla(${(i*45+t*200)%360},100%,65%,0.35)`;ctx.lineWidth=60;ctx.beginPath();ctx.arc(W/2,H*0.55,200+i*70+k*200,a,a+1.2);ctx.stroke()}ctx.restore();
    const g=ctx.createRadialGradient(W/2,H*0.55,0,W/2,H*0.55,900);g.addColorStop(0,`rgba(255,250,220,${0.35+0.4*k})`);g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);if(tau>1.7){ctx.fillStyle=`rgba(255,255,255,${clamp((tau-1.7)/0.3,0,1)})`;ctx.fillRect(0,0,W,H)}}
  if(n===6&&t<STEPS[6][0]){ctx.fillStyle='rgba(255,170,80,0.08)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,W,70);ctx.fillRect(0,H-70,W,70)}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<23;i++)flash(STEPS[i][0],0.32,0.14,i>=15?'255,235,170':'255,255,255');flash(0,0.6,0.3);flash(STEPS[15][0],0.6,0.3);flash(STEPS[23][0],1.0,0.4);flash(STEPS[23][0]+1.15,0.5,0.15,'255,60,60');flash(T_END,0.4,0.3);
  if(t>=1.2)drawHUD(t);if(t<3.2)drawTitle(t);drawEnd(t);{const k=64.45-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.6) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.4;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*61)*sa,Math.cos(t*47)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();overlays(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;
