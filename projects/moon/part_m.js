
// ======================================================================
// ============================== MOON VIDEO ============================
// ======================================================================
const T_TIDE=11.5,T_QUAKE=19.0,T_TURT=27.0,T_SPACEM=34.0,T_MBACK=42.0,T_WOLF=48.75,T_ENDM=56,T_WMOON=51.0;
const COLD=1.6,LOOP=59.45;
R=rng(31);
// ---------------- night sky helpers ----------------
const nstars=[];{const r=rng(5);for(let i=0;i<450;i++)nstars.push([r()*W,r()*H*0.75,r()*1.8+0.4,r()])}
function moonVis(t){if(t<T_GONE)return 1;if(t<T_GONE+0.35)return 1-(t-T_GONE)/0.35;if(t>=T_MBACK)return Math.min(1,(t-T_MBACK)/0.25);return 0}
function nightAmt(t){return(t>=T_GONE&&t<T_MBACK)?Math.min(1,(t-T_GONE)/0.5):(t>=T_MBACK?Math.max(0,1-(t-T_MBACK)/0.5):0)}
function drawNightSky(t,mpos,mrad){const dk=nightAmt(t);const g=ctx.createLinearGradient(0,0,0,H*0.62);g.addColorStop(0,css(mix(hex('#0b1236'),hex('#02030a'),dk)));g.addColorStop(1,css(mix(hex('#3a4a86'),hex('#121a38'),dk)));ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  for(const s of nstars){ctx.fillStyle=`rgba(255,255,255,${(0.25+0.45*dk)*(0.5+0.5*Math.abs(Math.sin(s[3]*40+t)))})`;ctx.fillRect(s[0],s[1],s[2],s[2])}
  if(mpos){const v=moonVis(t);const c=toCam(mpos);if(c[2]>0){const s=scr(c);const r=mrad*(t>=T_GONE&&t<T_MBACK?1+0.6*(1-v):1)*(t>=T_MBACK&&t<T_MBACK+0.25?0.6+0.4*v+0.3*Math.sin(v*Math.PI):1);
    if(v>0){ctx.save();ctx.globalAlpha=v;glow(s[0],s[1],r*4,[200,215,255],0.45);ctx.fillStyle='#eef0f6';ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill();ctx.fillStyle='rgba(160,165,185,0.55)';
      for(const[a,b,cr]of[[-0.3,-0.2,0.22],[0.25,0.1,0.16],[-0.05,0.35,0.12],[0.35,-0.35,0.1],[-0.4,0.25,0.09]]){ctx.beginPath();ctx.arc(s[0]+a*r,s[1]+b*r,cr*r,0,7);ctx.fill()}ctx.restore()}
    const pk=t-T_GONE;if(pk>0&&pk<1.2){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const a=hash(i,1)*6.283,d=(0.5+hash(i,2))*r*(1+pk*4);ctx.fillStyle=`rgba(220,230,255,${1-pk/1.2})`;const sz=3+hash(i,3)*5;ctx.fillRect(s[0]+Math.cos(a)*d,s[1]+Math.sin(a)*d,sz,sz)}ctx.restore()}
    const bk=t-T_MBACK;if(bk>0&&bk<0.8){ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1],r*(3+bk*10),[220,230,255],0.9*(1-bk/0.8));ctx.restore()}}}}
// ---------------- CITY AT NIGHT ----------------
const npeople=[];for(let i=0;i<230;i++){let x,z;if(R()<0.7){x=rr(-0.8,13);z=rr(-125,25)}else{x=rr(-13.6,-10.6);z=rr(-125,25)}npeople.push({x,z,dir:R()<0.5?1:-1,sp:rr(1.0,1.6),ph:rr(0,6.28),shirt:hex(pick(shirts)),pant:hex(pick(pants)),h:rr(0.92,1.08),lk:rr(-1.2,1.2),tl:T_GONE+0.3+R()*1.5})}

function personM(p,t){const wt=t<p.tl?t:p.tl+Math.min(0.5,t-p.tl)*0.5;let z=p.z+p.dir*p.sp*wt;while(z<-125)z+=150;while(z>25)z-=150;if(Math.hypot(p.x-cam.x,z-cam.z)<2.4&&cam.y<3)return null;
  const stop=t>p.tl;const bob=stop?0:Math.abs(Math.sin(t*p.sp*4+p.ph))*0.06;const yaw=(p.dir>0?0:Math.PI)+(stop?p.lk*ease((t-p.tl)/0.8):0);const M=rotM(yaw,stop?-0.12*ease((t-p.tl)/0.6):0,0);const feet=[p.x,bob,z];const h=p.h;
  return{d:dist([p.x,0.8,z]),draw:()=>{const parts=[[mapL(feet,M,0,0.41*h,0),0.21,0.41*h,0.13,{top:p.pant,side:p.pant}],[mapL(feet,M,0,1.12*h,0),0.26,0.3*h,0.15,{top:p.shirt,side:p.shirt}],[mapL(feet,M,0,1.6*h,0),0.13,0.14*h,0.13,{top:HAIR,side:SKIN,front:SKIN,back:HAIR}]];stackDraw(parts,feet,M)}}}
const ncars=[];{let z=40;while(z>-180){ncars.push({x:-6.6,dir:1,z0:z,v0:9,col:hex(pick(carCols))});z-=rr(13,18)}z=50;while(z>-180){ncars.push({x:-3.5,dir:-1,z0:z,v0:8,col:hex(pick(carCols))});z-=rr(13,18)}}
const npark=[];for(let z=34;z>-175;z-=rr(5.4,7)){if(R()<0.12)continue;npark.push({x:-9.1,z,col:hex(pick(carCols))})}
const MOON_W=[-254,700,-1478];
function cityCamM(t){cam.x=0.4;cam.z=-0.55*Math.min(t,T_GONE+0.6);cam.y=1.7+(t<T_GONE?Math.abs(Math.sin(t*3.2))*0.03:0);cam.yaw=0.17;cam.pitch=0.07;cam.roll=0;
  if(t>T_GONE+0.4){const k=ease((t-T_GONE-0.4)/1.6);cam.pitch=0.07+0.16*k-0.12*ease((t-8.5)/2);cam.yaw=0.17+0.03*k}}
function drawCityM(t){const dk=nightAmt(t);F=930;FOG=mix(hex('#2a3264'),hex('#121733'),dk);FOGD=170;FOGMAX=0.85;setLight([-0.35,0.8,0.5]);AMB=0.42-0.1*dk;cityCamM(t);setCam();
  drawNightSky(t,MOON_W,70);cityGround();drawTower(t);buildings.slice().sort((a,b)=>Math.abs(b.z1+b.z0-2*cam.z)-Math.abs(a.z1+a.z0-2*cam.z)).forEach(b=>drawBuilding(b,t));
  const objs=[];for(const c of ncars){const z=c.z0+c.dir*c.v0*t;const o=carObj(c.x,z,c.dir>0?0:Math.PI,c.col,0);if(o.d>-3){objs.push(o);if(c.dir>0){const hc=toCam([c.x,0.75,z+2.3]);if(hc[2]>1){objs.push({d:o.d-0.1,draw:()=>{const s=scr(hc);ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1],Math.min(160,2600/hc[2]),[255,240,200],0.6);ctx.restore()}})}}}}
  for(const c of npark){const o=carObj(c.x,c.z,0,c.col,0);if(o.d>-3)objs.push(o)}
  for(const p of npeople){const o=personM(p,t);if(o&&o.d>0)objs.push(o)}
  for(const l of lamps){const o=lampObj(l,t);if(o.d>-2)objs.push(o)}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();ctx.fillStyle=`rgba(5,8,25,${0.18+0.22*dk})`;ctx.fillRect(0,0,W,H)}
// ---------------- BEACH / TIDE ----------------
function tideLevel(t){if(t<T_TIDE+1.2)return 0;return -Math.min(5.5,0.5*1.2*Math.pow(t-T_TIDE-1.2,2))}
const nboats=[[-20,-60,0.4],[30,-80,1.2],[-60,-100,2.0],[55,-120,0.2],[10,-150,2.6],[-100,-140,0.8]];
const SAND_N=hex('#8c8270'),SAND_D=hex('#5a5448'),WATER_N=hex('#173a5c');
function drawSeaNight(t,mode){const surge=mode==='surge';const tt=surge?60:t;const dk=surge?(t<T_MBACK?1:nightAmt(t)):1;F=900;FOG=mix(hex('#2a3264'),hex('#121733'),dk);FOGD=900;FOGMAX=0.85;setLight([0.3,0.8,0.5]);AMB=0.42-0.1*dk;
  const u=surge?(t-T_MBACK)/6.75:(t-T_TIDE)/7.5;if(surge)F=1250-300*ease((t-46.4)/1.2);cam.x=-3+5*u;cam.y=surge?6:14+4*u;cam.z=surge?14:16-5*u;lookAt(0,surge?2:-6-6*ease((t-13)/4),-220);cam.roll=Math.sin(t*0.5)*0.015;
  if(surge&&t>45.5){const k=Math.min(1,(t-45.5)/1.5);cam.pitch+=Math.sin(t*37)*0.01*k;cam.roll+=Math.cos(t*29)*0.012*k}setCam();
  drawNightSky(t,surge?[cam.x+200,260,cam.z-1400]:null,60);
  let wl=surge?-5.5:tideLevel(tt);
  poly([[-4000,-40,-3000],[4000,-40,-3000],[4000,-40,-700],[-4000,-40,-700]],fogC(SAND_D,1500));
  const zf=surge?-300+305*Math.pow(clamp((t-44.6)/3.0,0,1),1.3):0;const hs=surge?3+7*ease((t-44.6)/2.2):0;
  poly([[-4000,wl,0],[4000,wl,0],[4000,wl,-3000],[-4000,wl,-3000]],fogC(WATER_N,500));
  const tiles=[];for(let zz=0;zz>-700;zz-=25)for(let xx=-300;xx<300;xx+=25){const c=[[xx,zz],[xx+25,zz],[xx+25,zz-25],[xx,zz-25]].map(p=>[p[0],bedY(p[0],p[1])*0.45,p[1]]);const mx=Math.max(...c.map(p=>p[1]));if(mx<=wl+0.1)continue;if(surge&&zz-12<zf&&t>44.6)continue;tiles.push({c,d:dist([xx+12,mx,zz-12])})}
  tiles.sort((a,b)=>b.d-a.d);for(const tl of tiles)facePoly(tl.c.slice().reverse(),SAND_N,true);
  if(surge&&t>44.6){const top=1.2;poly([[-400,top,Math.min(zf,0)],[400,top,Math.min(zf,0)],[400,top,-700],[-400,top,-700]],fogC(mul(WATER_N,1.15),Math.abs(zf-cam.z)+60));
    if(zf<0){poly([[-400,-6,zf],[400,-6,zf],[400,top+hs,zf+2],[-400,top+hs,zf+2]],fogC(hex('#2c6b8f'),Math.abs(zf-cam.z)));}}
  poly([[-400,2,0],[400,2,0],[400,2,40],[-400,2,40]],fogC(hex('#5a5a66'),20));poly([[-400,2.05,0],[400,2.05,0],[400,2.05,1.2],[-400,2.05,1.2]],fogC(hex('#a8a040'),15));
  const objs=[];for(const bt of nboats){const b=bedY(bt[0],bt[1])*0.45;let lvl=wl;if(surge&&t>44.6&&bt[1]<zf)lvl=1.2+(bt[1]>zf-30?hs*0.6:0);const ground=b+0.5;const cy=Math.max(lvl+0.4,ground);const gk=lvl+0.4<ground?Math.min(1,(ground-(lvl+0.4))/2):0;const M=rotM(bt[2],0,0.9*gk);const c=[bt[0],cy,bt[1]];
    objs.push({d:dist(c),draw:()=>{oboxDraw(c,M,1.3,0.6,4,{top:hex('#9a8f80'),side:hex('#b8bcc4'),front:hex('#b8bcc4'),back:hex('#b8bcc4')});const m0=mapL(c,M,0,0.6,0.5),m1=mapL(c,M,0,8,0.5),s1=mapL(c,M,0,1.2,3.3);facePoly([m0,m1,s1],hex('#c8ccd4'),true)}})}
  if(surge&&t>44.6&&zf<0){for(let i=0;i<46;i++){const x=-330+i*15+Math.sin(i*1.3+t*4)*4;objs.push(puffObj(x,1.5+hs+hash(i,Math.floor(t*8))*2,zf+3,4+hs*0.5,hex('#d8e8f0'),0.7))}}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw();ctx.fillStyle=`rgba(5,8,25,${0.15+0.2*dk})`;ctx.fillRect(0,0,W,H)}
// ---------------- EARTHQUAKE (other side of the world, daytime) ----------------
const PSZ=40,PX0=-260,PZ0=-460,PNX=13,PNZ=13;const pverts=[];R=rng(202);
for(let i=0;i<=PNX;i++){pverts.push([]);for(let j=0;j<=PNZ;j++){const ed=(i===0||j===0||i===PNX||j===PNZ);pverts[i].push([PX0+i*PSZ+(ed?0:rr(-12,12)),PZ0+j*PSZ+(ed?0:rr(-12,12))])}}
const plates=[];const FIELD=['#94b366','#a9bd63','#7a9b55','#c9b27a','#6f8f4e','#b5c46a'];
for(let i=0;i<PNX;i++)for(let j=0;j<PNZ;j++){const cs=[pverts[i][j],pverts[i+1][j],pverts[i+1][j+1],pverts[i][j+1]];const cx=cs.reduce((a,p)=>a+p[0],0)/4,cz=cs.reduce((a,p)=>a+p[1],0)/4;const town=Math.hypot(cx,cz+140)<110;const road=i===6;
  const pl={cs,cx,cz,col:hex(road?'#6b6d74':town?'#a8a39a':pick(FIELD)),road,amp:rr(0.4,2.6),ph:rr(0,6.28),td:23.0+R()*0.8+(cz-PZ0)/520*0.6,off:rr(-2.2,1.2),houses:[],trees:[]};
  if(town&&!road)for(let q=0;q<4;q++)pl.houses.push([cx+rr(-12,12),cz+rr(-12,12),rr(5,9),hex(pick(['#e8d9c0','#f2e6d0','#d9c3a5','#cfd8e0'])),hex(pick(['#b5482f','#8a3a2a','#5a5f6a'])),rr(-1,1)]);
  else if(!road)for(let q=0;q<5;q++)if(R()<0.6)pl.trees.push([cx+rr(-14,14),cz+rr(-14,14),rr(0.8,1.4)]);plates.push(pl)}
const DIRT=hex('#6b4a33'),DIRT2=hex('#4a3324'),TRK=hex('#5a3d2a'),LEAF=hex('#4f7d3c');
function plateYQ(pl,t){const k=t-pl.td;if(k<0)return 0;return pl.off*ease(k/0.35)+Math.sin(k*18+pl.ph)*pl.amp*Math.exp(-k*0.9)}
function drawQuake(t){F=900;FOG=hex('#dfe6ea');FOGD=900;FOGMAX=0.85;setLight([0.4,0.85,0.3]);AMB=0.55;const u=(t-T_QUAKE)/8;cam.x=0;cam.y=140-20*u;cam.z=130-40*u;lookAt(0,0,-150);cam.roll=0.02*Math.sin(t*0.5);
  if(t>22.8){const k=t-22.8;const a=0.02*Math.exp(-Math.max(0,k-1)*0.6);cam.pitch+=Math.sin(t*43)*a;cam.roll+=Math.cos(t*31)*a}setCam();
  const g=ctx.createLinearGradient(0,0,0,H*0.5);g.addColorStop(0,'#5b9be0');g.addColorStop(1,'#dfe6ea');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  poly([[-3000,0,-3000],[3000,0,-3000],[3000,0,-470],[-3000,0,-470]],fogC(hex('#8aa463'),900));poly([[-3000,0,60],[-270,0,60],[-270,0,-470],[-3000,0,-470]],fogC(hex('#8aa463'),500));poly([[270,0,60],[3000,0,60],[3000,0,-470],[270,0,-470]],fogC(hex('#8aa463'),500));poly([[-3000,0,400],[3000,0,400],[3000,0,60],[-3000,0,60]],fogC(hex('#8aa463'),300));
  poly([[-270,-80,60],[270,-80,60],[270,-80,-470],[-270,-80,-470]],hex('#1a120c'));
  const ps=plates.slice().sort((a,b)=>dist([b.cx,0,b.cz])-dist([a.cx,0,a.cz]));
  for(const pl of ps){const y=plateYQ(pl,t);const top=pl.cs.map(p=>[p[0],y,p[1]]),bot=pl.cs.map(p=>[p[0],y-30,p[1]]);for(let i=0;i<4;i++){const j=(i+1)%4;facePoly([top[i],bot[i],bot[j],top[j]],i%2?DIRT:DIRT2)}}
  for(const pl of ps){const y=plateYQ(pl,t);const top=pl.cs.map(p=>[p[0],y,p[1]]);facePoly([top[0],top[3],top[2],top[1]],pl.col);
    if(pl.road){const a=[(top[0][0]+top[1][0])/2,y+0.05,top[0][2]],b=[(top[3][0]+top[2][0])/2,y+0.05,top[3][2]];poly([[a[0]-0.3,a[1],a[2]],[a[0]+0.3,a[1],a[2]],[b[0]+0.3,b[1],b[2]],[b[0]-0.3,b[1],b[2]]],fogC(hex('#e8e8e8'),dist(a)))}
    const k=t-pl.td;const sway=k>0?Math.sin(k*14+pl.ph)*0.12*Math.exp(-k*0.8):0;
    for(const h of pl.houses){const tilt=sway+(k>0.5&&h[5]>0.6?Math.min(0.5,(k-0.5)*0.8):0);const M=rotM(0.3,0,tilt);const c=[h[0],y+2,h[1]];oboxDraw(c,M,3.5,2,4.5,{top:h[3],side:h[3],front:h[3],back:h[3]});
      const P=(lx,ly,lz)=>mapL(c,M,lx,ly,lz);facePoly([P(-3.9,1.8,-4.9),P(0,4.5,-4.9),P(0,4.5,4.9),P(-3.9,1.8,4.9)],h[4],true);facePoly([P(3.9,1.8,-4.9),P(0,4.5,-4.9),P(0,4.5,4.9),P(3.9,1.8,4.9)],h[4],true)}
    for(const tr of pl.trees){const s=tr[2];const sx=sway*6;drawFaces(boxFaces(tr[0],tr[1],y,y+1.6*s,0.5*s,0.5*s,0,{top:TRK,side:TRK}));const ap=[tr[0]+sx,y+6.5*s,tr[1]],r=2*s,b=y+1.4*s;const Q=[[tr[0]-r,b,tr[1]-r],[tr[0]+r,b,tr[1]-r],[tr[0]+r,b,tr[1]+r],[tr[0]-r,b,tr[1]+r]];for(let i=0;i<4;i++)facePoly([Q[i],Q[(i+1)%4],ap],LEAF)}
    if(k>0&&k<2.5)for(let q=0;q<2;q++){const p=pl.cs[q];const c=toCam([p[0],1+k*3,p[1]]);if(c[2]<2)continue;const s=scr(c);const r=(5+k*7)*F/c[2];ctx.fillStyle=`rgba(150,120,95,${0.4*(1-k/2.5)})`;ctx.beginPath();ctx.arc(s[0],s[1],r,0,7);ctx.fill()}}}
// ---------------- TURTLES ----------------
const turtles=[];{const r=rng(88);for(let i=0;i<46;i++)turtles.push({x:-1.0-r()*6,z:(r()-0.5)*5,sp:0.25+r()*0.25,ph:r()*6,tt:30.3+r()*0.8,wob:r()*0.6})}
const SHELL=hex('#4f6a3a'),TSKIN=hex('#7a8a5a');
function turtleState(q,t){const k1=Math.min(t,q.tt)-T_TURT;let z=q.z-q.sp*k1;let yaw=Math.PI+Math.sin(t*2+q.ph)*0.2;if(t>q.tt){const k2=t-q.tt;const turn=ease(k2/0.8);yaw=Math.PI*(1-turn)+Math.sin(t*2+q.ph)*0.2;z+=q.sp*Math.max(0,k2-0.4)}return{x:q.x+Math.sin(t*1.3+q.ph)*q.wob*0.2,z,yaw}}
function drawTurtles(t){F=950;FOG=hex('#141a36');FOGD=60;FOGMAX=0.85;setLight([0.2,0.9,0.3]);AMB=0.5;cam.x=0.6;cam.y=0.42;cam.z=0;cam.yaw=Math.PI/2+0.08*Math.sin(t*0.3);cam.pitch=-0.1;cam.roll=0;setCam();
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#3a2a3a');g.addColorStop(0.45,'#0a0e22');g.addColorStop(1,'#050713');ctx.fillStyle=g;ctx.fillRect(-200,-200,W+400,H+400);
  for(const s of nstars){ctx.fillStyle=`rgba(255,255,255,${0.5*(0.5+0.5*Math.abs(Math.sin(s[3]*40+t)))})`;ctx.fillRect(s[0],s[1]*0.6,s[2],s[2])}
  const cg=toCam([-40,4,200]);if(cg[2]>0){const s=scr(cg);ctx.save();ctx.globalCompositeOperation='lighter';glow(s[0],s[1],700,[255,170,90],0.5);ctx.restore()}
  for(let i=0;i<14;i++){const x=-60+i*8,z=160+hash(i,1)*40;drawFaces(boxFaces(x,z,0,10+hash(i,2)*30,6,6,0,{top:hex('#1a1c26'),side:hex('#1e2130')}),f=>{for(let w=0;w<5;w++){const y=3+w*4;if(hash(i*7+w,3)<0.5)continue;const c=toCam([x+(hash(w,i)-0.5)*4,y,z-3.05]);if(c[2]<1)continue;const s=scr(c);const r=Math.max(1.5,40/c[2]);ctx.fillStyle='#ffd27a';ctx.fillRect(s[0]-r,s[1]-r,r*2,r*1.4)}})}
  poly([[-300,0,-8],[300,0,-8],[300,0,300],[-300,0,300]],fogC(hex('#6e6656'),30));
  for(let i=0;i<10;i++){const zz=-8-i*6;poly([[-300,-0.05-i*0.02,zz],[300,-0.05-i*0.02,zz],[300,-0.05-i*0.02,zz-6],[-300,-0.05-i*0.02,zz-6]],fogC(hex('#1c3a58'),30+i*6))}
  const fw=-8+Math.sin(t*1.2)*0.6;poly([[-300,0.02,fw],[300,0.02,fw],[300,0.02,fw+0.7],[-300,0.02,fw+0.7]],fogC(hex('#c8d8e0'),20));
  const objs=[];for(const q of turtles){const s=turtleState(q,t);const M=rotM(s.yaw,0,0);const c=[s.x,0.07,s.z];objs.push({d:dist(c),draw:()=>{oboxDraw(c,M,0.13,0.05,0.16,{top:SHELL,side:mul(SHELL,0.8)});oboxDraw(mapL(c,M,0,-0.01,0.2),M,0.05,0.04,0.06,{top:TSKIN,side:TSKIN});
      const fl=Math.sin(t*8+q.ph)*0.04;for(const sx of[-1,1])oboxDraw(mapL(c,M,sx*0.16,-0.02,0.06+fl*sx),M,0.06,0.015,0.03,{top:TSKIN,side:TSKIN})}})}
  objs.sort((a,b)=>b.d-a.d);for(const o of objs)o.draw()}
// ---------------- EARTH WOBBLE (space) ----------------
function drawWobble(t){ctx.fillStyle='#02030a';ctx.fillRect(0,0,W,H);for(const s of nstars){ctx.fillStyle=`rgba(255,255,255,${0.3+0.6*Math.abs(Math.sin(s[3]*40+t*0.5))})`;ctx.fillRect(s[0],s[1]*1.3,s[2],s[2])}
  ctx.save();ctx.globalCompositeOperation='lighter';glow(-250,500,900,[255,170,60],0.4);glow(-250,500,420,[255,220,140],0.8);ctx.restore();
  const z=1+0.15*ease((t-T_SPACEM)/7);const ex=W*0.55,ey=H*0.56,er=230*z;
  ctx.setLineDash([16,16]);ctx.lineWidth=4;ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.beginPath();ctx.ellipse(ex,ey,er*2.2,er*0.75,-0.15,0,7);ctx.stroke();ctx.setLineDash([]);
  txt('🌑 ?',ex+er*2.0,ey-er*0.55,46,'#ffffff','center',800,false);
  const wob=t>38?Math.sin((t-38)*2.2)*0.22*Math.min(1,(t-38)/1.2)+Math.sin((t-38)*3.7)*0.08*Math.min(1,(t-38)/1.5):0;const tilt=0.41+wob;
  ctx.save();ctx.translate(ex,ey);ctx.rotate(tilt);ctx.strokeStyle='rgba(255,255,255,0.8)';ctx.lineWidth=5;ctx.setLineDash([22,14]);ctx.beginPath();ctx.moveTo(0,-er*1.55);ctx.lineTo(0,er*1.55);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  drawEarth2D(ex,ey,er,t*0.6);
  ctx.save();ctx.translate(ex,ey);ctx.rotate(tilt);ctx.strokeStyle='#ff5d5d';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,-er*1.02);ctx.lineTo(0,-er*1.55);ctx.stroke();ctx.restore();
  txt('AXIS TILT: '+(tilt*57.3).toFixed(1)+'°',W/2,ey+er+170,52,t>38?'#ff6b6b':'#ffffff','center',900)}
// ---------------- WEREWOLF TWIST ----------------
function drawWolf(t){const back=t>=T_WMOON;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a1238');g.addColorStop(0.7,'#2a3a78');g.addColorStop(1,'#141a3a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(const s of nstars){ctx.fillStyle=`rgba(255,255,255,${0.35+0.5*Math.abs(Math.sin(s[3]*40+t))})`;ctx.fillRect(s[0],s[1],s[2],s[2])}
  const mx=W*0.62,my=H*0.33,mr=230;if(back){const k=Math.min(1,(t-T_WMOON)/0.25);ctx.save();ctx.globalAlpha=k;glow(mx,my,mr*3,[200,215,255],0.5);ctx.fillStyle='#eef0f6';ctx.beginPath();ctx.arc(mx,my,mr*(0.6+0.4*k),0,7);ctx.fill();ctx.fillStyle='rgba(160,165,185,0.5)';for(const[a,b,cr]of[[-0.3,-0.2,0.22],[0.25,0.1,0.16],[-0.05,0.35,0.12]]){ctx.beginPath();ctx.arc(mx+a*mr,my+b*mr,cr*mr,0,7);ctx.fill()}ctx.restore()}
  else{ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.setLineDash([14,12]);ctx.lineWidth=5;ctx.beginPath();ctx.arc(mx,my,mr,0,7);ctx.stroke();ctx.setLineDash([])}
  ctx.fillStyle='#05060c';ctx.beginPath();ctx.moveTo(-50,H);ctx.lineTo(-50,H*0.78);ctx.quadraticCurveTo(W*0.35,H*0.6,W*0.7,H*0.72);ctx.quadraticCurveTo(W*0.9,H*0.77,W+50,H*0.74);ctx.lineTo(W+50,H);ctx.closePath();ctx.fill();
  const fx=W*0.38,fy=H*0.655;ctx.fillStyle='#05060c';ctx.save();ctx.translate(fx,fy);
  const morph=back?Math.min(1,(t-T_WMOON-0.1)/0.5):0;const shake=morph>0&&morph<1?Math.sin(t*60)*8:0;ctx.translate(shake,0);
  if(morph<0.5){// human: confused, scratching head
    const sc=1-morph*0.3;ctx.scale(sc,sc);ctx.beginPath();ctx.ellipse(0,-150,40,46,0,0,7);ctx.fill();ctx.fillRect(-42,-105,84,140);ctx.fillRect(-38,30,30,120);ctx.fillRect(8,30,30,120);ctx.fillRect(-70,-100,26,110);
    ctx.save();ctx.translate(48,-95);ctx.rotate(-2.3+Math.sin(t*10)*0.15);ctx.fillRect(-12,0,24,105);ctx.restore();
    if(!back){const bob=Math.sin(t*4)*6;ctx.restore();ctx.save();txt('?',fx+95,fy-260+bob,110,'#ffd84a','center',900);txt('?',fx-80,fy-300-bob,70,'#ffd84a','center',900);ctx.restore();return}}
  else{// wolf howling
    const sc=0.7+0.3*morph;ctx.scale(sc,sc);ctx.beginPath();ctx.ellipse(0,-30,70,110,0.15,0,7);ctx.fill();
    ctx.beginPath();ctx.moveTo(-20,-120);ctx.lineTo(10,-210);ctx.lineTo(75,-300);ctx.lineTo(95,-290);ctx.lineTo(60,-215);ctx.lineTo(40,-170);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.ellipse(25,-200,52,48,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(0,-235);ctx.lineTo(-10,-300);ctx.lineTo(25,-245);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(35,-240);ctx.lineTo(45,-305);ctx.lineTo(62,-238);ctx.closePath();ctx.fill();
    ctx.fillRect(-45,50,28,110);ctx.fillRect(15,50,28,110);ctx.beginPath();ctx.moveTo(-60,20);ctx.quadraticCurveTo(-170,10,-190,-70);ctx.quadraticCurveTo(-140,-10,-55,-15);ctx.closePath();ctx.fill()}
  ctx.restore();
  if(morph>0){const k=t-T_WMOON-0.3;if(k>0){const a=Math.min(1,k/0.2)*Math.max(0,1-(k-2.2)/0.5);const s=1+0.08*Math.sin(k*12);ctx.save();ctx.globalAlpha=a;ctx.translate(fx+190,fy-480);ctx.rotate(-0.15);ctx.scale(s,s);txt('AWOOOO!',0,0,100,'#ffd84a');ctx.restore()}}}
// ---------------- HAND / PHONE ----------------
function drawHandM(t,dropY){const walk=t<T_GONE;const bx=Math.sin(t*3.2)*5*(walk?1:0.3),by=Math.abs(Math.sin(t*3.2))*9*(walk?1:0.3);
  ctx.save();ctx.translate(735+bx+shakeX*0.5,1610+by+dropY);ctx.rotate(-0.13+dropY/2500);const skin='#c9977f',skinD='#a97a65',skinL='#d9ad95';const pw=410,ph=800,px=-pw/2,py=-ph/2;
  [[-150,175],[-60,215],[35,200],[125,160]].forEach(([fx,fh])=>{ctx.fillStyle=skinD;capsule(fx-36,py-fh+40,74,fh+80);ctx.fill();ctx.fillStyle=skin;capsule(fx-32,py-fh+40,64,fh+76);ctx.fill()});
  ctx.fillStyle=skin;rrect(px+pw-70,py+80,170,560,80);ctx.fill();ctx.fillStyle='#1a1f30';ctx.beginPath();ctx.moveTo(px+40,py+ph-40);ctx.lineTo(px+pw+190,py+ph-140);ctx.lineTo(px+pw+260,py+ph+260);ctx.lineTo(px-20,py+ph+260);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2b2f3a';rrect(px-10,py-10,pw+20,ph+20,58);ctx.fill();ctx.fillStyle='#3a3f4c';rrect(px,py,pw,ph,50);ctx.fill();ctx.fillStyle='#0b0b12';rrect(px+16,py+16,pw-32,ph-32,40);ctx.fill();
  ctx.save();rrect(px+22,py+22,pw-44,ph-44,36);ctx.clip();const sg=ctx.createLinearGradient(px,py,px+pw,py+ph);sg.addColorStop(0,'#101a40');sg.addColorStop(1,'#3a4a8a');ctx.fillStyle=sg;ctx.fillRect(px,py,pw,ph);
  txt('Saturday, October 31',0,py+120,24,'rgba(255,255,255,0.85)','center',600,false);txt('23:41',0,py+200,110,'#ffffff','center',300,false);
  const na=clamp((t-1.9)/0.3,0,1);if(na>0){const ny=py+300+(1-easeOut(na))*-60;ctx.globalAlpha=na;ctx.fillStyle='rgba(250,250,252,0.95)';rrect(px+36,ny,pw-72,190,28);ctx.fill();
    txt('⚠️ EMERGENCY ALERT',px+62,ny+42,22,'#d42a2a','left',900,false);txt('Moon no longer detected.',px+62,ny+88,22,'#111','left',700,false);txt('Please look up.',px+62,ny+120,22,'#111','left',700,false);ctx.globalAlpha=1}
  ctx.restore();ctx.fillStyle=skinD;ctx.save();ctx.translate(px-30,py+560);ctx.rotate(-0.55);capsule(-40,-30,84,250);ctx.fill();ctx.fillStyle=skin;capsule(-36,-30,76,244);ctx.fill();ctx.fillStyle=skinL;rrect(-22,-16,46,60,22);ctx.fill();ctx.restore();ctx.restore()}
// ---------------- OVERLAYS ----------------
const capsM=[[3.3,6.3,'🌑 The Moon is gone'],[6.3,11.5,'Every night on Earth instantly gets darker'],
 [11.6,15.0,'🌊 The Moon\'s gravity holds up the tides'],[15.0,19.0,'Without it, the sea drains away from the coast'],
 [19.1,23.0,'🌍 The Moon even stretches Earth\'s crust'],[23.0,27.0,'It snaps back… earthquakes everywhere'],
 [27.1,30.5,'🐢 Baby turtles find the sea by moonlight'],[30.5,34.0,'Now they crawl toward city lights instead'],
 [34.1,38.0,'🌎 The Moon keeps Earth\'s tilt steady'],[38.0,42.0,'Without it… Earth starts to wobble'],
 [42.1,45.0,'⚡ 5 seconds later… the Moon is back'],[45.0,48.75,'And it pulls the oceans back 🌊'],
 [48.9,51.9,'Meanwhile… every werewolf on Earth 🐺'],[51.9,56.0,'just had a VERY confusing 5 seconds 😅']];
function drawCaptionM(t){for(const[a,b,s]of capsM){if(t<a||t>=b)continue;const k=t-a;const sc=k<0.18?0.6+0.4*ease(k/0.18)+Math.sin(k/0.18*Math.PI)*0.12:1;const al=Math.min(1,k/0.1,(b-t)/0.12);const size=fitSize(s,920,58);
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,640);ctx.scale(sc,sc);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function drawTitleM(t){const a=t<2.75?1:clamp((3.0-t)/0.25,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha=a;const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.translate(W/2,400);ctx.scale(pop,pop);
  const l1='What if the Moon disappeared',l2='for 5 seconds?';const s=Math.min(fitSize(l1,980,88),fitSize(l2,980,88));ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;txt(l1,0,-s*0.56,s,'#ffd84a');txt(l2,0,s*0.56,s,'#ffd84a');ctx.restore()}
function drawTimerM(t){if(t<COLD||t>=T_MBACK)return;
  if(t<T_GONE){const v=T_GONE-t;ctx.save();ctx.font='800 30px Inter';let x=56;const lab='THE MOON DISAPPEARS IN';ctx.textBaseline='middle';ctx.lineWidth=6;ctx.strokeStyle='rgba(20,15,30,0.85)';ctx.lineJoin='round';
    for(const ch of lab){ctx.strokeText(ch,x,850);ctx.fillStyle='rgba(255,255,255,0.92)';ctx.fillText(ch,x,850);x+=ctx.measureText(ch).width+4}ctx.restore();txt(v.toFixed(1)+' S',56,920,96,'#ffd84a','left',900);return}
  const v=(t-T_GONE)/(T_MBACK-T_GONE)*5;ctx.save();ctx.fillStyle='rgba(15,10,30,0.7)';rrect(40,190,410,150,28);ctx.fill();ctx.font='800 24px Inter';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText('TIME WITHOUT THE MOON',66,228);
  txt(v.toFixed(2)+' s',66,282,58,'#ff5d5d','left',900,false);ctx.fillStyle='rgba(255,255,255,0.2)';rrect(262,268,160,14,7);ctx.fill();ctx.fillStyle='#ff5d5d';rrect(262,268,160*v/5,14,7);ctx.fill();ctx.restore()}
function fitWM(s,size){ctx.font=`900 ${size}px Inter`;return ctx.measureText(s).width}
function statBoxM(label,val,col,a){ctx.save();ctx.globalAlpha=a;ctx.font='800 26px Inter';const w=Math.max(ctx.measureText(label).width,fitWM(val,64))+60;ctx.fillStyle='rgba(15,10,30,0.7)';rrect(56,1360,w,170,30);ctx.fill();ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillText(label,86,1402);txt(val,86,1468,64,col,'left',900,false);ctx.restore()}
function drawStatsM(t){if(t>=T_GONE+0.2&&t<7.5){const a=Math.min(1,(t-T_GONE-0.2)/0.25,(7.5-t)/0.2);const f=clamp((t-T_GONE)/0.5,0,1);statBoxM('MOONLIGHT',Math.round(100*(1-f))+'%',f<1?'#ffffff':'#ff6b6b',a)}}
function drawEndM(t){const k=ease((t-T_ENDM)/0.5)*clamp((LOOP-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(12,8,28,${0.74*k})`;ctx.fillRect(0,0,W,H);
  const pop=t-T_ENDM<0.5?0.7+0.3*ease((t-T_ENDM-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,780);ctx.scale(pop,pop);txt('Would you survive',0,-100,92,'#ffd84a');txt('these 5 seconds?',0,10,92,'#ffd84a');const bounce=Math.abs(Math.sin((t-T_ENDM)*5))*26;txt('👇',0,190+bounce,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-T_ENDM-0.6)/0.4);txt('What should disappear next?',W/2,1150,50,'#ffffff','center',800);txt('Follow for Part 6',W/2,1230,40,'rgba(255,255,255,0.8)','center',800);ctx.restore()}
// ---------------- FRAME ----------------
function sceneAtM(t){if(t<T_TIDE)return'city';if(t<T_QUAKE)return'tide';if(t<T_TURT)return'quake';if(t<T_SPACEM)return'turtle';if(t<T_MBACK)return'space';if(t<T_WOLF)return'surge';return'wolf'}
function shakesM(t){shakeX=0;shakeY=0;const s=(t0,amp,dur)=>{const k=t-t0;if(k>0&&k<dur){const a=amp*(1-k/dur);shakeX+=Math.sin(k*61)*a;shakeY+=Math.cos(k*47)*a}};s(T_GONE,14,0.5);s(T_MBACK,14,0.5);s(23.0,30,2.5);s(47.6,30,1.0);s(T_WMOON+0.1,12,0.6)}
function renderSceneM(t){ctx.save();shakesM(t);
  if(t<COLD||t>=LOOP){const tt=t>=LOOP?t-60:t;if(tt<0.85)drawSeaNight(46.6+tt*1.0,'surge');else drawCityM(T_GONE-0.05+(tt-0.85)*0.8);ctx.restore();return}
  const sc=sceneAtM(t);if(sc==='city')drawCityM(t);else if(sc==='tide')drawSeaNight(t);else if(sc==='quake')drawQuake(t);else if(sc==='turtle')drawTurtles(t);else if(sc==='space')drawWobble(t);else if(sc==='surge')drawSeaNight(t,'surge');else drawWolf(t);
  ctx.restore()}
function overlaysM(t){ctx=ctx0;shakeX=0;shakeY=0;
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.4)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(t>=COLD&&t<T_GONE+1.6){const drop=t<T_GONE+0.6?0:Math.pow(clamp((t-T_GONE-0.6)/0.8,0,1),2)*1300;shakesM(t);drawHandM(t,drop);shakeX=0;shakeY=0}
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  flash(T_GONE,0.6,0.3,'200,215,255');flash(T_MBACK,0.7,0.4,'200,215,255');flash(T_WMOON,0.85,0.35,'220,230,255');flash(0.85,0.6,0.2);flash(COLD,0.7,0.25);flash(0,0.5,0.15);
  [T_TIDE,T_QUAKE,T_TURT,T_SPACEM,T_WOLF].forEach(tt=>flash(tt,0.5,0.22));[T_TIDE,T_QUAKE,T_TURT,T_SPACEM,T_WOLF].forEach(tt=>{const k=tt-t;if(k>0&&k<0.18){ctx.fillStyle=`rgba(255,255,255,${0.45*(1-k/0.18)})`;ctx.fillRect(0,0,W,H)}});
  if(t<3)drawTitleM(t);drawTimerM(t);drawStatsM(t);drawCaptionM(t);
  if(t>=T_GONE&&t<T_GONE+1.1){const k=t-T_GONE;const s=k<0.2?1.6-0.6*easeOut(k/0.2):1;const a=Math.min(1,(1.1-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('MOON: GONE',0,0,100,'#ff5d5d');ctx.restore()}
  if(t>=T_MBACK&&t<T_MBACK+1.6){const k=t-T_MBACK;const s=k<0.25?0.5+0.5*easeOut(k/0.25):1;const a=Math.min(1,(1.6-k)/0.3);ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,960);ctx.scale(s,s);txt('THE MOON IS BACK',0,0,90,'#7dff9a');ctx.restore()}
  drawEndM(t);{const k=LOOP-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const t0=fi/FPS;for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderSceneM(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;ctx0.drawImage(acc,0,0);overlaysM(t0+(SUB-1)/(2*FPS*SUB))}
window.frame=frame;window.NFR=DUR*FPS;window.crashes=[];
</script></body></html>
