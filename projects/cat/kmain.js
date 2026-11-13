// CAT
const FPS=30,DUR=66,SUB=2;const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const acc=document.createElement('canvas');acc.width=W;acc.height=H;const actx=acc.getContext('2d');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ease=x=>x<0?0:x>1?1:x*x*(3-2*x),easeOut=x=>x<0?0:x>1?1:1-Math.pow(1-x,3),easeIn=x=>x<0?0:x>1?1:x*x*x;
const lerp=(a,b,k)=>a+(b-a)*k;
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function txt(s,x,y,size,col,align,weight,stroke){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;ctx.textAlign=align||'center';ctx.textBaseline='middle';if(stroke!==false){ctx.lineJoin='round';ctx.lineWidth=size*0.2;ctx.strokeStyle='rgba(20,12,30,0.92)';ctx.strokeText(s,x,y)}ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitSize(s,maxW,size,weight){ctx.font=`${weight||900} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
initGL();initAssets();buildModels();
// ---------- timeline ----------
const R=[3.4,16.4,28.0,39.6,51.6,61.6];
const EV={
  // dogs
  blink:5.6,stand:7.0,raise:7.5,swat:8.0,lick0:11.3,
  // vacuum
  vstop:19.4,suck0:19.6,suck1:21.5,vjump:21.5,vland:22.1,boop:22.6,ride:23.4,
  // ufo
  ufo0:28.0,ufoHover:29.6,beam0:30.0,lift0:30.4,inside:32.6,chaos0:32.8,drop:35.0,dland:35.9,ufoAway:35.3,ufoCrash:37.6,
  // bear
  bstop:42.3,roar1:42.6,yawn:43.9,roar2:45.4,hiss:46.6,flee:47.4,calm:49.6,
  // final
  eat:51.6,cuke:53.6,boss:55.0,look:55.6,jump:56.2,apex0:56.55,apex1:57.55,koland:58.0,
  endc:61.6,loop:65.6};
const BGD='rgba(15,10,30,0.66)',BGG='rgba(40,140,60,0.88)',BGB='rgba(40,110,190,0.88)',BGR='rgba(200,40,40,0.88)',BGP='rgba(130,60,190,0.88)';
const ROUNDS=[
  ['STAGE 1',[[R[0],'A dog army 🐕🐕🐕',BGD],[EV.swat+0.05,'One paw 🐾',BGG],[EV.lick0+0.5,'…then licked its paw 👅',BGB]]],
  ['STAGE 2',[[R[1],'A giant robot vacuum 🤖',BGD],[EV.boop+0.05,'Hacked it with one paw 🐾',BGG],[EV.ride+0.6,"Now it's his taxi 🚕",BGB]]],
  ['STAGE 3',[[R[2],'A UFO 🛸',BGD],[EV.lift0+0.1,'Abducted 👽',BGD],[EV.chaos0+0.1,'*chaos inside* 💥',BGR],[EV.dland+0.05,'Landed on its feet 😼',BGG],[EV.ufoCrash+0.05,'Aliens left Earth 🛸💨',BGB]]],
  ['STAGE 4',[[R[3],'A bear 🐻',BGD],[EV.yawn+0.1,'…yawned 🥱',BGD],[EV.hiss+0.05,'Hissed once 😾',BGG],[EV.flee+0.8,'Bear: -1000 aura 💀',BGB]]],
  ['FINAL BOSS',[[EV.boss,'One cucumber 🥒',BGD],[EV.koland+0.1,'Cause of death: cucumber 💀',BGR]]]];
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
// ================= world =================
const smst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
function hgt(x,z){const r=Math.hypot(x,z*0.8);let h=smst(45,420,r)*(0.35+fbm(x*0.005+3,z*0.005+1,4))*110*(1-smst(40,120,z));h+=0.25*(fbm(x*0.08,z*0.08,2)-0.5)*smst(8,30,r);h-=smst(95,140,z)*1.3;return h}
function gcol(x,z,h,ny){const n=fbm(x*0.03+7,z*0.03,3),m=vnoise(x*0.25,z*0.25);let c=mix3(hx('#5d8f3a'),hx('#86a845'),n);c=mix3(c,hx('#4a7a30'),m*0.35);
  const sand=smst(100,124,z);c=mix3(c,hx('#d9c08a'),sand);if(ny<0.85)c=mix3(c,hx('#6a6a50'),(0.85-ny)*2);if(h>60)c=mix3(c,hx('#7a8a5a'),smst(60,110,h));
  const path=Math.abs(x+0.06*z*0)<1.2&&z<-1&&z>-40?1:0;return c}
let WORLD,SEA,MOUNT;{const m=new MB();
  terrain(m,-70,-70,70,140,70,hgt,gcol);
  terrain(m,-1600,-1600,1600,160,120,(x,z)=>hgt(x,z)-(Math.abs(x)<70&&z>-70&&z<140?0.6:0),gcol);
  // cherry trees
  const r=rngG(21);const TP=[[-24,5],[25,9],[-21,-5],[19,-9],[-9,-15],[11,-18],[-34,24],[36,28],[-36,-14],[38,4],[-30,44],[34,50],[-48,40],[48,-24],[-55,10],[6,-30],[-30,-30]];
  for(let i=0;i<80;i++){const a=r()*TAU2,d=60+r()*260;const x=Math.cos(a)*d,z=Math.sin(a)*d*0.8-40;if(z>70||(Math.abs(x)<60&&z>-10))continue;TP.push([x,z])}
  let ti=0;for(const[x,z]of TP){ti++;const s=0.8+r()*0.6;const y0=hgt(x,z)-0.1;const tr=hx('#4a3226');const top=[x+(r()-0.5)*1.5*s,y0+3.4*s,z+(r()-0.5)*1.5*s];tube(m,[x,y0,z],top,0.28*s,0.16*s,tr,7);
    for(let b=0;b<4;b++){const a=b/4*TAU2+r();const e=V.add(top,[Math.cos(a)*2.4*s,1.2*s+r()*1.2*s,Math.sin(a)*2.4*s]);tube(m,top,e,0.12*s,0.05*s,tr,5);
      const pk=[hx('#f6b6c8'),hx('#f19ab6'),hx('#fbd0dc')][b%3];blob(m,e,1.6*s,p=>mix3(pk,[1,0.92,0.95],clamp((p[1]-e[1])/(2*s)+0.4,0,1)*0.6),ti*7+b+x,0.75,[7,10])}
    blob(m,V.add(top,[0,1.6*s,0]),2.0*s,p=>mix3(hx('#f3a8c0'),hx('#ffe0ea'),clamp((p[1]-top[1])/(4*s),0,1)),x+z,0.7,[8,12])}
  // grass tufts near hero
  const g=rngG(5);for(let i=0;i<2600;i++){const a=g()*TAU2,d=2.6+Math.pow(g(),0.7)*34;const x=Math.cos(a)*d,z=Math.sin(a)*d;const y=hgt(x,z);const h=0.1+g()*0.16;const yaw=g()*TAU2,w=0.025+g()*0.02;const lean=[(g()-0.5)*0.2,0,(g()-0.5)*0.2];
    const cb=mix3(hx('#4a7a2a'),hx('#6a9a38'),g()),ct=mix3(hx('#a8c860'),hx('#d0d070'),g());const b0=[x+Math.cos(yaw)*w,y,z+Math.sin(yaw)*w],b1=[x-Math.cos(yaw)*w,y,z-Math.sin(yaw)*w];m.tri(b0,b1,V.add([x,y+h,z],lean),[cb,cb,ct])}
  // rocks
  for(let i=0;i<40;i++){const a=g()*TAU2,d=6+g()*60;const x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.hypot(x,z)<5)continue;blob(m,[x,hgt(x,z),z],0.2+g()*0.6,p=>mix3(hx('#7a776e'),hx('#a09a8c'),vnoise(p[0]*4,p[2]*4)),i,0.6,[5,8])}
  WORLD=m.build(0.5)}
{const m=new MB();m.quad([-9000,-0.55,110],[-9000,-0.55,9000],[9000,-0.55,9000],[9000,-0.55,110],hx('#2a6c8a'),MAT.water);SEA=m.build()}
{const m=new MB();const MT=[[-2400,2600,1300,1500,1],[2900,3400,1100,1700,0],[-4200,1500,800,1100,0],[1200,-3200,1400,1400,1],[-2600,-2400,900,1200,0],[4200,-500,900,1100,0]];
  for(const[cx,cz,hh,rr,snow]of MT){const N=40,RR=10;for(let i=0;i<RR;i++)for(let j=0;j<N;j++){const P=(ii,jj)=>{const a=jj/N*TAU2,f=ii/RR;const rad=rr*(1-f)*(1+0.12*(vnoise(Math.cos(a)*3+cx,Math.sin(a)*3+f*2)-0.5))+rr*0.03;const y=hh*Math.pow(f,0.85)*(f>0.95?0.98:1);return[cx+Math.cos(a)*rad,y-40,cz+Math.sin(a)*rad]};
      const cf=(ii,jj)=>{const f=ii/RR;const sn=snow&&f>0.62+0.08*Math.sin(jj*1.7)?1:0;return sn?hx('#f2f0f4'):mix3(hx('#5a6a74'),hx('#7a8090'),f)};m.quad(P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1),[cf(i,j),cf(i+1,j),cf(i+1,j+1),cf(i,j+1)])}}
  MOUNT=m.build(0.6)}
const PETAL=um(m=>{m.quad([-1,0,-0.6],[1,0,-0.6],[1,0.15,0.6],[-1,0.15,0.6],hx('#ffc2d4'))});
function petals(items,t,ctr,n){ctr=ctr||[0,0,0];n=n||70;for(let i=0;i<n;i++){const sp=2+hsh(i,1)*2.5;const ph=hsh(i,2)*40;const x=ctr[0]-14+((hsh(i,3)*28+(t+ph)*sp)%28),z=ctr[2]-6+hsh(i,4)*20+Math.sin(t*0.7+i)*1.2,y=ctr[1]+0.2+((hsh(i,5)*5-(t+ph)*0.5)%5+5)%5;
  items.push({mesh:PETAL,M:M4.trs([x,y,z],t*2+i,t*3+i*0.7,t*1.7,0.035),tint:null,tintAmt:0,noShadow:true})}}
// ================= quadruped rig (cat / dog / bear) =================
const SP={
  cat:{main:hx('#ee963f'),main2:hx('#c86e22'),belly:hx('#fff3e2'),nose:hx('#f2909f'),len:0.34,chest:[0.125,0.14,0.15],hip:[0.125,0.14,0.14],mid:[0.115,0.13,0.17],shH:0.31,hpH:0.31,legX:0.065,legU:0.16,legL:0.16,legR:0.032,paw:[0.04,0.028,0.052],socks:1,
    head:0.125,headOff:[0,0.12,0.1],ear:'cat',muz:'cat',tail:[11,0.043,0.03,0.022],iris:hx('#a6d63c'),eye:[0.056,0.022,0.097,0.037],slit:1,gait:[0,0.5,0.5,0]},
  dog:{main:hx('#c98a4b'),main2:hx('#8a5428'),belly:hx('#f2e2c8'),nose:hx('#1a1414'),len:0.4,chest:[0.13,0.15,0.16],hip:[0.12,0.13,0.14],mid:[0.115,0.12,0.19],shH:0.36,hpH:0.35,legX:0.07,legU:0.18,legL:0.18,legR:0.034,paw:[0.042,0.028,0.055],
    head:0.12,headOff:[0,0.14,0.1],ear:'flop',muz:'dog',tail:[7,0.045,0.026,0.016],iris:hx('#3a2412'),eye:[0.052,0.035,0.1,0.03],gait:[0,0.12,0.5,0.62]},
  bear:{main:hx('#6e4526'),main2:hx('#4a2c16'),belly:hx('#9b6a42'),nose:hx('#151010'),len:0.42,chest:[0.17,0.2,0.19],hip:[0.165,0.19,0.18],mid:[0.16,0.19,0.2],shH:0.31,hpH:0.31,legX:0.09,legU:0.16,legL:0.15,legR:0.052,paw:[0.06,0.035,0.07],
    head:0.12,headOff:[0,0.12,0.13],ear:'round',muz:'bear',tail:[2,0.03,0.04,0.03],iris:hx('#2a1a10'),eye:[0.05,0.035,0.098,0.024],gait:[0,0.5,0.5,0]}};
const DOGCOL=[[hx('#c98a4b'),hx('#8a5428'),hx('#f2e2c8')],[hx('#2e2a2a'),hx('#1a1616'),hx('#d8c8b0')],[hx('#efe6d8'),hx('#b89878'),hx('#ffffff')],[hx('#a8642e'),hx('#5a3418'),hx('#f0d8b0')]];
const ell=(c,dir,s)=>frameM(c,V.norm(dir),Math.abs(V.norm(dir)[1])>0.95?[0,0,1]:[0,1,0],s);
function quad(spName,st,items){const sp=SP[spName];const col=st.col||[sp.main,sp.main2,sp.belly];const[MAIN,MAIN2,BELLY]=col;const sc=st.sc||1;
  const RM=M4.mul(M4.mul(M4.trs(st.pos,st.yaw||0,st.rx||0,st.rz||0,1),M4.trs([0,-(st.piv||0),0],0,0,0,1)),M4.trs([0,0,0],0,0,0,sc));
  const sh=st.noShadow;const put=(mesh,M,tint,ns,extra)=>items.push(Object.assign({mesh,M:M4.mul(RM,M),tint,tintAmt:tint?1:0,noShadow:ns||sh},extra||{}));
  const sit=st.sit||0,cr=st.crouch||0,ar=st.arch||0,pf=st.puff||0,ph=st.gait?st.gait.ph:0,ga=st.gait?st.gait.amp:0;
  const bob=st.gait?0.012*Math.sin(ph*TAU2*2)*Math.min(1,ga*8):0;const br=(st.breath==null?1:st.breath)*0.004*Math.sin((st.t||0)*3);
  const S=[0,sp.shH-cr*0.08+sit*0.03+bob+br+ar*0.03,sp.len/2-sit*0.04],H=[0,sp.hpH-cr*0.08-sit*(sp.hpH-0.11)+bob*0.6+ar*0.03,-sp.len/2+sit*0.06];
  const dir=V.sub(S,H),mid=V.add(lerp3(H,S,0.5),[0,ar*0.1,0]);const pk=1+0.22*pf;
  const sv=a=>[a[0]*pk,a[2],a[1]*pk];
  put(USPH,ell(H,dir,sv(sp.hip)),MAIN);put(USPH,ell(mid,dir,[sp.mid[0]*pk,sp.mid[2]*0.8,sp.mid[1]*pk]),MAIN);put(USPH,ell(S,dir,sv(sp.chest)),MAIN);
  put(USPH,ell(V.add(S,[0,-0.035,0.04]),dir,V.sc(sv(sp.chest),0.82)),BELLY,1);put(USPH,ell(V.add(mid,[0,-0.045,0]),dir,[sp.mid[0]*0.8*pk,sp.mid[2]*0.7,sp.mid[1]*0.8*pk]),BELLY,1);
  if(pf>0.05){for(let i=0;i<11;i++){const k=0.1+i*0.08;const p=V.add(lerp3(H,S,k),[0,(sp.mid[1]*pk)*0.95+ar*0.1*Math.sin(Math.PI*k),0]);put(CONE,M4.trs(V.add(p,[(hsh(i,4)-0.5)*0.04,0.02*pf,0]),0,(hsh(i,5)-0.5)*0.6,(hsh(i,6)-0.5)*0.9,[0.022,0.07*pf,0.022]),MAIN,1)}}
  // legs
  const paws=st.paws||{};const L=[['FL',1,S,1,sp.gait[0]],['FR',-1,S,1,sp.gait[1]],['BL',1,H,0,sp.gait[2]],['BR',-1,H,0,sp.gait[3]]];
  for(const[nm,sx,base,front,off]of L){const A=V.add(base,[sx*sp.legX,front?-0.05:-0.03,front?0.02:-0.02]);
    let T;if(paws[nm])T=paws[nm];else{let z=front?S[2]+0.02:H[2]+(sit?0.13*sit:0);let y=0;
      if(st.gait&&ga>0){const f=((ph+off)%1+1)%1;if(f<0.45){const k=f/0.45;z+=lerp(-ga/2,ga/2,ease(k));y=0.06*Math.sin(Math.PI*k)*Math.min(1,ga*5)}else{z+=lerp(ga/2,-ga/2,(f-0.45)/0.55)}}
      T=[sx*(sp.legX+(front?-0.01*sit:0.02*sit)),y,z]}
    if(st.splay){T=V.add(A,[sx*0.16,-0.08,front?0.12:-0.12])}
    if(st.dangle){T=V.add(A,[sx*0.02,-0.27,front?0.04:-0.04])}
    const r=ik2(A,T,sp.legU,sp.legL,front?[0,0,-1]:[0,0,1]);const E=r.E,F=r.H;
    put(USPH,ell(lerp3(A,E,0.5),V.sub(E,A),[sp.legR*(front?1.25:1.7)*pk,sp.legU*0.62,sp.legR*(front?1.25:1.7)*pk]),MAIN);
    put(USPH,ell(lerp3(E,F,0.5),V.sub(F,E),[sp.legR*pk,sp.legL*0.58,sp.legR*pk]),MAIN);
    put(USPH,M4.trs(V.add(F,[0,sp.paw[1]*0.6,0.012]),0,0,0,sp.paw),sp.socks&&front?BELLY:MAIN,0)}
  // tail
  {const[n,sl,r0,r1]=sp.tail;const tl=st.tail||{};const up=tl.up==null?0.35:tl.up,curl=tl.curl==null?0.6:tl.curl,wag=tl.wag||0,wp=tl.ph||0,side=tl.side||0;let p=V.add(H,[0,0.05,-sp.hip[2]*0.8]);let th=up*Math.PI/2;
    for(let i=0;i<n;i++){const k=i/(n-1);const phi=side*k*1.6+wag*Math.sin(wp*TAU2-i*0.55)*(0.3+k);th+=curl*1.2/n;const d=[Math.sin(phi)*Math.cos(th),Math.sin(th),-Math.cos(phi)*Math.cos(th)];p=V.add(p,V.sc(d,sl));
      const rr=lerp(r0,r1,k)*(1+pf*1.1);put(USL,M4.trs(p,0,0,0,rr*1.15),i>=n-2&&spName==='cat'?MAIN2:MAIN,i>2)}}
  // head
  const HC=V.add(S,V.add(sp.headOff,[0,sit*0.04-cr*0.03,-sit*0.02]));const hs=sp.head/0.125;
  put(USPH,ell(lerp3(V.add(S,[0,0.04,0.03]),HC,0.5),V.sub(HC,V.add(S,[0,0.04,0.03])),[0.075*hs*pk,0.09*hs,0.07*hs*pk]),MAIN);
  const HM=M4.mul(M4.trs(HC,st.headY||0,st.headP||0,st.headR||0,1),M4.trs([0,0,0],0,0,0,hs));
  const hp=(mesh,p,s,tint,rot,ns,extra)=>put(mesh,M4.mul(HM,M4.trs(p,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,s)),tint,ns==null?1:ns,extra);
  hp(USPH,[0,0,0],[0.14,0.12,0.125],MAIN,null,0);
  const mo=st.mouth||0;const E=st.eyes||{};const lid=clamp(E.lid||0,0,1);
  if(sp.muz==='cat'){for(const sx of[-1,1])hp(USPH,[sx*0.034,-0.045,0.093],[0.044,0.038,0.04],BELLY);hp(USPH,[0,-0.07-mo*0.03,0.08],[0.03,0.022,0.026],BELLY);hp(USPH,[0,-0.018,0.124],[0.019,0.012,0.012],sp.nose)}
  else{const L=sp.muz==='dog'?0.1:0.08;hp(USPH,[0,-0.04,0.1],[0.066,0.055,L],sp.muz==='dog'?BELLY:SP.bear.belly);hp(USPH,[0,-0.018,0.1+L*0.98],[0.03,0.022,0.02],sp.nose);
    hp(USPH,[0,-0.08-mo*0.035,0.095],[0.05,0.022,L*0.8],sp.muz==='dog'?BELLY:SP.bear.belly)}
  const ef=st.ears||0;
  if(sp.ear==='cat')for(const sx of[-1,1]){const rz=-sx*(0.32+ef*1.15),rx=-0.15-ef*0.5;hp(CONE,[sx*0.07,0.118-ef*0.04,-0.01],[0.06,0.115,0.032],MAIN,[0,rx,rz],0);hp(CONE,[sx*0.068,0.112-ef*0.04,0.006],[0.04,0.085,0.016],sp.nose,[0,rx,rz])}
  if(sp.ear==='flop')for(const sx of[-1,1])hp(USPH,[sx*0.115,-0.01,-0.005],[0.026,0.085,0.055],MAIN2,[0,0,sx*(0.25+0.25*Math.sin(ph*TAU2*2+sx)*Math.min(1,ga*5))]);
  if(sp.ear==='round')for(const sx of[-1,1]){hp(USPH,[sx*0.09,0.095,-0.01],[0.043,0.043,0.025],MAIN);hp(USPH,[sx*0.09,0.093,0.006],[0.026,0.026,0.012],MAIN2)}
  // eyes
  const[ex,ey,ez,er]=sp.eye;const lk=E.look||[0,0];
  for(const sx of[-1,1]){const p=[sx*ex,ey,ez];
    if(E.x){for(const d of[-1,1])hp(UB,[p[0],p[1],p[2]+0.012],[er*2.0,er*0.4,er*0.4],[0.08,0.06,0.08],[0,0,d*0.78]);continue}
    if(lid>=0.97){hp(UB,[p[0],p[1]-er*0.1,p[2]+0.004],[er*1.8,er*0.3,er*0.3],MAIN2,[0,0,sx*(E.happy?-0.35:0)]);continue}
    const ir=E.glow?[1,0.3,0.15]:sp.iris;hp(USPH,p,[er,er*1.15*(1-lid),er*0.5],ir,null,1,E.glow?{mesh:UEMIS}:null);
    const pw=sp.slit?(E.tiny?0.16:(E.wide?0.75:0.3)):(E.tiny?0.3:0.62);const pp=[p[0]+lk[0]*er*0.35,p[1]+lk[1]*er*0.3,p[2]+er*0.4];hp(USPH,pp,[er*pw,er*0.9*(1-lid)*(sp.slit&&!E.tiny?1:0.7),er*0.15],[0.04,0.03,0.04]);
    hp(USPH,[p[0]+er*0.3,p[1]+er*0.35*(1-lid),p[2]+er*0.48],[er*0.2,er*0.2,er*0.06],[1,1,1]);
    if(lid>0.05)hp(USPH,[p[0],p[1]+er*(1.1-lid*1.1),p[2]+0.004],[er*1.08,er*0.35,er*0.48],MAIN);
    if(E.brow!=null)hp(UB,[p[0],p[1]+er*1.45-lid*er*0.6,p[2]+0.004],[er*1.7,er*0.32,er*0.35],spName==='cat'?MAIN2:[0.1,0.07,0.06],[0,0,sx*E.brow])}
  // mouth
  if(mo>0.02){const mz=sp.muz==='cat'?0.1:0.12+(sp.muz==='dog'?0.04:0.02);hp(USPH,[0,-0.062-mo*0.015,mz],[0.036,0.032*mo,0.018],[0.28,0.06,0.08]);hp(USPH,[0,-0.07-mo*0.03,mz-0.002],[0.022,0.008,0.016],hx('#e86a80'));
    if(sp.muz!=='dog'||mo>0.5)for(const sx of[-1,1])hp(CONE,[sx*0.017,-0.06-mo*0.004,mz+0.008],[0.006,0.018*Math.min(1,mo*2),0.006],[1,1,1],[0,0,Math.PI])}
  if(st.tongue)hp(USPH,[0.004,-0.075,0.128+(sp.muz==='dog'?0.06:0)],[0.02,0.008+0.02*(sp.muz==='dog'?1:0),0.026],hx('#ef7088'),[0,0.4,0]);
  if(sp.muz==='cat')for(const sx of[-1,1])for(let j=0;j<3;j++){const a=tp(HM,[sx*0.05,-0.042+j*0.008,0.112]),b=tp(HM,[sx*0.17,-0.03+j*0.02-0.02,0.1-j*0.012]);items.push({mesh:UCL,M:M4.mul(RM,segM(a,b,0.0022)),tint:[0.95,0.93,0.9],tintAmt:1,noShadow:true})}
  return{RM,HM:M4.mul(RM,HM),head:tp(M4.mul(RM,HM),[0,0.05,0])}}
// ================= objects =================
function lathe(m,prof,seg,col,mat){for(let i=0;i<prof.length-1;i++){const[r0,y0]=prof[i],[r1,y1]=prof[i+1];for(let j=0;j<seg;j++){const a=j/seg*TAU2,b=(j+1)/seg*TAU2;
  const A=[Math.cos(a)*r0,y0,Math.sin(a)*r0],B=[Math.cos(b)*r0,y0,Math.sin(b)*r0],C=[Math.cos(b)*r1,y1,Math.sin(b)*r1],D=[Math.cos(a)*r1,y1,Math.sin(a)*r1];
  const c=typeof col==='function'?col((y0+y1)/2,(r0+r1)/2):col;if(r0<1e-5)m.tri(A,C,D,c,mat);else if(r1<1e-5)m.tri(A,B,C,c,mat);else m.quad(A,D,C,B,c,mat)}}}
const VAC=um(m=>{lathe(m,[[0,0.03],[1.24,0.03],[1.3,0.08],[1.3,0.25],[1.26,0.31],[1.12,0.34],[0,0.34]],56,(y,r)=>y>0.3?(r>0.9&&r<1.0?hx('#4a4d56'):hx('#2a2c33')):hx('#6a6e78'));
  lathe(m,[[0,0.341],[0.17,0.341],[0.17,0.36],[0.15,0.372],[0,0.372]],28,hx('#d8dade'));
  m.box([0,0.3,1.12],[0.6,0.08,0.22],hx('#121318'),0,0)});
const VLED=um(m=>lathe(m,[[0.6,0.343],[0.68,0.343]],48,[1,1,1],MAT.emis));
const BRUSH=um(m=>{for(let i=0;i<3;i++){const a=i/3*TAU2;tube(m,[0,0.02,0],[Math.cos(a)*0.32,0.012,Math.sin(a)*0.32],0.012,0.006,hx('#3a3c44'),5)}m.ico([0,0.025,0],0.05,hx('#1a1a20'))});
const UFO=um(m=>{lathe(m,[[0,-0.62],[1.2,-0.56],[2.6,-0.26],[3.6,0],[3.55,0.1],[2.5,0.38],[1.4,0.55],[0,0.6]],60,(y,r)=>r>3.3?hx('#8a8e9a'):(y<0?hx('#7d818c'):hx('#c4c8d2')));
  lathe(m,[[0,-0.64],[0.75,-0.64]],32,[1,1,1],MAT.emis)});
const DOME=um(m=>m.ico([0,0,0],1,[0.6,0.9,1],MAT.glass,1,[12,20]));
const TRACT=um(m=>m.prism([0,-0.5,0],1,0.32,1,32,[1,1,1],MAT.emis));
const ALIEN=um(m=>{m.ico([0,0.2,0],0.38,hx('#7ad860'));m.ico([0,-0.25,0],0.25,hx('#7ad860'));for(const sx of[-1,1])m.ico([sx*0.15,0.22,0.3],0.11,[0.03,0.03,0.05])});
const CUKE=um(m=>{const c=hx('#3f8a32'),c2=hx('#2d6a24');const N=28,Mr=12;for(let i=0;i<Mr;i++)for(let j=0;j<N;j++){const P=(ii,jj)=>{const u=ii/Mr,a=jj/N*TAU2;const r=0.055*Math.pow(Math.sin(Math.PI*clamp(u,0.001,0.999)),0.45)*(1+0.03*Math.sin(a*6));return[(u-0.5)*0.34,r*Math.cos(a),r*Math.sin(a)]};
  const cc=(ii,jj)=>((jj+(ii%2))%4<2)?c:c2;m.quad(P(i,j),P(i,j+1),P(i+1,j+1),P(i+1,j),[cc(i,j),cc(i,j+1),cc(i+1,j+1),cc(i+1,j)])}
  for(let k=0;k<26;k++){const u=0.12+hsh(k,1)*0.76,a=hsh(k,2)*TAU2;const r=0.055*Math.pow(Math.sin(Math.PI*u),0.45);m.ico([(u-0.5)*0.34,r*Math.cos(a),r*Math.sin(a)],0.007,hx('#a8c870'))}
  m.ico([0.172,0,0],0.012,hx('#8a7a40'))});
const BOWL=um(m=>{lathe(m,[[0,0.005],[0.1,0.005],[0.13,0.065],[0.115,0.068],[0.09,0.02],[0,0.02]],32,hx('#e85060'));for(let k=0;k<26;k++){const a=hsh(k,1)*TAU2,r=Math.sqrt(hsh(k,2))*0.085;m.ico([Math.cos(a)*r,0.035+hsh(k,3)*0.012,Math.sin(a)*r],0.014,hx('#9a6232'))}});
// ================= environment =================
function envBase(){return{sun:[0.82,0.3,0.48],sunCol:hx('#ffe2b8'),sky:hx('#bcd4ec'),gnd:hx('#7a8a5a'),fog:hx('#f2d6b8'),fogD:900,zen:hx('#5a8ad0'),hor:hx('#ffd6ae'),stars:0,night:0,emis:1.2,ground:1,sunSize:3,fillD:[-0.5,0.4,-0.7],fillC:[0.3,0.32,0.36]}}
function mixEnv(a,b,k){const r={};for(const key in a){const va=a[key],vb=b[key];r[key]=Array.isArray(va)?mix3(va,vb,k):(typeof va==='number'?va+(vb-va)*k:va)}return r}
const E_DAY=envBase();
const E_NOON=Object.assign(envBase(),{sun:[0.5,0.6,0.62],sunCol:hx('#fff2dc'),fog:hx('#dde6ee'),hor:hx('#e8eef4'),zen:hx('#4a82d0')});
const E_NIGHT=Object.assign(envBase(),{sun:[0.6,0.35,-0.7],sunCol:hx('#8a90c8'),sky:hx('#4a4a80'),gnd:hx('#3a4a40'),fog:hx('#3a3a6a'),fogD:700,zen:hx('#0c0c2a'),hor:hx('#5a4a8a'),stars:1,night:0.6,fillD:[0,0.5,1],fillC:[0.22,0.24,0.38]});
const E_SUNSET=Object.assign(envBase(),{sun:[0.7,0.18,0.69],sunCol:hx('#ffb27a'),fog:hx('#f0a880'),hor:hx('#ff9a6a'),zen:hx('#4a4a9a'),fillC:[0.32,0.28,0.36]});
function envAt(t){const rn=roundAt(t);const tr=(t0,d)=>ease((t-t0)/d);let e=E_DAY;
  if(rn===1)e=mixEnv(E_DAY,E_NOON,tr(R[1],0.6));if(rn===2)e=mixEnv(E_NOON,E_NIGHT,tr(R[2],1.6));if(rn===3)e=mixEnv(E_NIGHT,E_SUNSET,tr(R[3],0.6));if(rn>=4)e=mixEnv(E_SUNSET,E_DAY,tr(R[4],0.6));
  if(rn===2){const u=ufoAt(t);if(u&&t>=EV.beam0&&t<EV.inside+0.1){e=Object.assign({},e);const k=clamp((t-EV.beam0)/0.3,0,1);e.fillC=V.add(e.fillC,[0.3*k,0.9*k,0.7*k]);e.fillD=[0,1,0]}
    if(t>=EV.ufoCrash){const f=Math.exp(-(t-EV.ufoCrash)*1.2);e=Object.assign({},e);e.fillC=V.add(e.fillC,[0.9*f,0.45*f,0.15*f])}}
  return e}
// ================= camera =================
const SHOTS=[
  [0,[0.32,0.62,1.4],[0,0.56,0],[0.22,0.6,1.25],[0,0.56,0],0.85],
  // dogs
  [R[0],[0.25,0.5,-1.3],[0,0.4,8],[0.2,0.48,-1.1],[0,0.4,8]],
  [5.3,[0.14,0.5,0.8],[0,0.46,0.15],[0.12,0.49,0.72],[0,0.46,0.15],0.8],
  [6.4,[0.55,0.2,-0.25],[0,0.45,6],[0.5,0.22,-0.2],[0,0.45,6],0.95],
  [EV.raise-0.2,[-1.3,0.55,-1.2],[0,0.35,1.0],[-1.2,0.55,-1.1],[0,0.35,1.0]],
  [EV.swat+0.05,[1.0,0.55,-1.4],[0,2.5,6],[1.5,0.9,-2.2],[0,6,10]],
  [9.7,[0.45,0.35,-1.0],[0,8,14],[0.4,0.35,-0.9],[0,10,17]],
  [EV.lick0-0.1,[0.72,0.55,0.95],[0,0.44,0.08],[0.58,0.5,0.8],[0,0.44,0.08]],
  // vacuum
  [R[1],[-0.45,0.4,-1.2],[0.2,0.35,6],[-0.42,0.38,-1.1],[0.2,0.35,5]],
  [18.3,[-2.7,0.6,0.3],[0,0.3,1.6],[-2.5,0.6,0.5],[0,0.3,1.6]],
  [EV.suck0,[-0.75,0.32,0.55],[0,0.33,0.2],[-0.72,0.32,0.6],[0,0.33,0.3],0.85],
  [20.6,[-2.2,0.6,-0.6],[0,0.3,0.5],[-2.1,0.6,-0.5],[0,0.3,0.6]],
  [EV.vjump-0.05,[-2.7,0.9,0.6],[0,0.5,1.4],[-2.6,0.9,0.8],[0,0.5,1.8]],
  [EV.boop-0.25,[0.6,0.95,2.95],[0,0.75,2.0],[0.55,0.92,2.85],[0,0.75,2.0],0.85],
  [EV.ride,[-2.6,1.3,-1.8],[2,0.3,2.4],[-2.2,1.2,-1.4],[2,0.3,2.4]],
  // ufo
  [R[2],[0.4,0.3,-1.6],[0,3,6],[0.35,0.3,-1.5],[0,3,4]],
  [EV.ufoHover,[-5.5,0.6,-3.2],[0,2.6,0],[-5.2,0.7,-3.0],[0,2.6,0]],
  [EV.chaos0,[-5.8,1.8,-6.4],[0,6.4,0],[-5.4,1.7,-6.0],[0,6.4,0]],
  [EV.drop,[-1.9,0.45,-1.9],[0,3,0],[-1.8,0.4,-1.8],[0,0.4,0]],
  [EV.dland+0.6,[0.5,0.45,-1.2],[-12,4,30],[0.45,0.42,-1.1],[-14,3,36]],
  [EV.ufoCrash+0.9,[0.7,0.55,0.9],[0,0.42,0.05],[0.58,0.5,0.8],[0,0.42,0.05]],
  // bear
  [R[3],[-0.4,0.38,-1.2],[0.15,0.8,8],[-0.38,0.37,-1.1],[0.15,0.8,6]],
  [41.3,[-3.4,0.8,-1.8],[0,0.7,1.0],[-3.2,0.8,-1.6],[0,0.7,1.0]],
  [EV.roar1-0.1,[0.38,0.5,-0.95],[0,0.95,1.6],[0.34,0.48,-0.85],[0,0.95,1.6]],
  [EV.yawn-0.15,[-0.55,0.5,0.75],[0,0.45,0.2],[-0.5,0.5,0.7],[0,0.45,0.2],0.85],
  [EV.roar2-0.1,[-3.1,0.9,0.4],[0,0.75,1.4],[-2.9,0.9,0.6],[0,0.75,1.4]],
  [EV.hiss-0.05,[-0.5,0.3,-1.6],[0.2,0.7,1.6],[-0.55,0.28,-1.65],[0.2,0.72,1.6],1.0],
  [EV.flee+0.1,[0.55,0.6,-1.5],[0,0.9,7],[0.5,0.55,-1.4],[0,0.9,10]],
  [EV.calm+0.2,[0.72,0.55,0.95],[0,0.44,0.08],[0.6,0.5,0.82],[0,0.44,0.08]],
  // final
  [R[4],[0.95,0.45,0.75],[0,0.2,0.15],[0.82,0.42,0.62],[0,0.2,0.15]],
  [EV.cuke,[0.95,0.17,-1.35],[0,0.14,-0.25],[0.85,0.17,-1.25],[0,0.14,-0.3]],
  [54.6,[1.3,0.62,-0.9],[0,0.25,-0.05],[1.2,0.6,-0.8],[0,0.25,-0.05]],
  [EV.look,[0.15,0.36,-0.98],[0,0.42,0],[0.13,0.37,-0.9],[0,0.43,0],0.8],
  [EV.jump,[1.6,0.3,-1.7],[0,0.8,0],[1.6,0.35,-1.7],[0,1.6,0]],
  [EV.apex0,[0.3,1.95,-1.05],[0,1.85,0],[0.22,1.9,-0.95],[0,1.85,0],0.85],
  [EV.apex1,[1.5,0.6,-1.6],[0,0.9,0],[1.4,0.55,-1.5],[0.1,0.3,0]],
  [EV.koland+0.2,[0.35,0.75,-1.0],[0.2,0.12,-0.25],[0.32,0.7,-0.92],[0.2,0.12,-0.25]],
  [EV.loop,[0.32,0.62,1.4],[0,0.56,0],[0.32,0.62,1.4],[0,0.56,0],0.85],[999,[0,0,0],[0,0,1],[0,0,0],[0,0,1]]];
function camAt(t){if(t>=EV.apex1&&t<EV.koland+0.2){const p=catAt(Math.min(t,EV.koland)).pos;return{eye:[1.3,0.55,-1.4],at:[p[0],p[1]*0.8,p[2]],fov:0.95}}
  if(t>=24.0&&t<R[2]){const v=vacAt(t);const p=v.pos;const o=V.norm(V.sub(p,[2.2,0,2.2]));return{eye:[p[0]+o[0]*1.7,0.8,p[2]+o[2]*1.7],at:[p[0],0.55,p[2]],fov:0.9}}
  if(t>=EV.drop&&t<EV.dland+0.6){const y=catAt(Math.min(t,EV.dland)).pos[1];return{eye:[-2.2,0.5+y*0.4,-2.2],at:[0,y*0.9+0.2,0],fov:0.95}}
  
  if(t>=EV.lift0&&t<EV.chaos0){const c=catAt(t);const y=c.pos[1];return{eye:[-3.0,1.0+y*0.55,-2.6],at:[0,y+0.6,0],fov:0.95}}
  for(let i=0;i<SHOTS.length-1;i++){const s=SHOTS[i],n=SHOTS[i+1];if(t>=s[0]&&t<n[0]){const k=ease((t-s[0])/(n[0]-s[0]));return{eye:lerp3(s[1],s[3],k),at:lerp3(s[2],s[4],k),fov:s[5]||0.95}}}return{eye:SHOTS[0][1],at:SHOTS[0][2],fov:0.85}}
// ================= animation =================
const env01=(t,a,b,fi,fo)=>clamp(Math.min((t-a)/fi,(b-t)/fo),0,1);
const FR0=[-0.065,0,0.19];
function catAt(t){const rn=roundAt(t);
  const c={pos:[0,0,0],yaw:0,sit:1,t,eyes:{lid:0.35,look:[0,0.1]},tail:{up:-0.12,curl:0.25,side:0.9,wag:0.12,ph:t*0.4},headY:0.08*Math.sin(t*0.6),headP:0,mouth:0,ears:0};
  const lick=(t0,t1)=>{if(t<t0||t>=t1)return;const k=env01(t,t0,t1,0.35,0.35);c.paws={FR:lerp3(FR0,[-0.025,0.37,0.29],k)};c.headP=0.32*k;c.headR=-0.22*k;c.headY=0;
    c.eyes={lid:lerp(0.35,1,k),happy:1};if(k>0.9&&Math.sin(t*10)>0)c.tongue=1;if(k>0.9)c.paws.FR=V.add(c.paws.FR,[0,0.012*Math.sin(t*10),0])};
  if(rn<0){c.eyes.lid=0.3+0.7*clamp(1-Math.abs(t-1.6)/0.12,0,1);c.tail.wag=0.25}
  if(rn===0){c.eyes={lid:0.45,look:[0,0.05]};if(t>=EV.blink&&t<EV.blink+0.45)c.eyes.lid=lerp(0.45,1,Math.sin(Math.PI*(t-EV.blink)/0.45));
    if(t>=6.3)c.eyes={lid:0.3,brow:0.28,look:[0,0]};
    if(t>=EV.stand){c.sit=1-ease((t-EV.stand)/0.4);c.tail={up:0.7,curl:0.7,wag:0.25,ph:t*0.8}}
    if(t>=EV.raise&&t<EV.swat+0.7){let p;if(t<EV.swat)p=lerp3(FR0,[-0.1,0.2,0.27],ease((t-EV.raise)/0.4));else if(t<EV.swat+0.13)p=lerp3([-0.1,0.2,0.27],[0.12,0.13,0.33],easeOut((t-EV.swat)/0.13));else p=lerp3([0.12,0.13,0.33],FR0,ease((t-EV.swat-0.13)/0.5));c.paws={FR:p};
      if(t>=EV.swat&&t<EV.swat+0.4)c.headY=0.25*Math.sin(Math.PI*(t-EV.swat)/0.4)}
    if(t>=EV.swat+0.7){c.eyes={lid:0.4,look:[0,0.35]}}
    if(t>=11.0){c.sit=ease((t-11.0)/0.3);c.tail={up:-0.12,curl:0.25,side:0.9,wag:0.12,ph:t*0.4}}lick(EV.lick0,16.6)}
  if(rn===1){c.eyes={lid:0.4,look:[0,0]};
    if(t>=EV.suck0&&t<EV.vjump){const k=t-EV.suck0;c.sit=1-ease(k/0.25);c.crouch=0.8;c.ears=0.8;c.eyes={lid:0.18,brow:0.4};c.pos=[0.01*Math.sin(t*40),0,0.25*ease(k/1.9)];c.tail={up:1.1,curl:0.9,wag:0.4,ph:t*3};c.headP=-0.05}
    if(t>=EV.vjump-0.12&&t<EV.ride){const s=hopK(t,EV.vjump,EV.vland-EV.vjump,[0,0,0.25],[0,0.345,1.85],0.55);c.pos=s.p;c.sit=0;c.crouch=s.sq>0?s.sq*3:0;c.ears=0.2;c.eyes={lid:0.25,brow:0.2};c.tail={up:0.8,curl:0.6};
      if(t>=EV.boop-0.3&&t<EV.boop+0.6){let p;const k=t-EV.boop;if(k<0)p=lerp3(FR0,[-0.03,0.14,0.29],ease((k+0.3)/0.25));else if(k<0.12)p=lerp3([-0.03,0.14,0.29],[-0.03,0.035,0.34],easeOut(k/0.12));else p=lerp3([-0.03,0.035,0.34],FR0,ease((k-0.12)/0.45));c.paws={FR:p};c.headP=0.3;c.eyes={lid:0.35,look:[0,-0.6]}}}
    if(t>=EV.ride){const v=vacAt(t);c.pos=tp(M4.trs(v.pos,v.yaw,0,0,1),[0,0.345,-0.05]);c.yaw=v.yaw;c.sit=1;c.eyes={lid:0.5,look:[0.2,0]};c.headY=0.25*Math.sin(t*0.9);c.tail={up:0.3,curl:0.5,wag:0.4,ph:t*0.6}}}
  if(rn===2){c.eyes={lid:0.4,look:[0,0.3]};if(t>=R[2]+1.0){c.headP=-0.35*ease((t-R[2]-1)/0.5);c.eyes={lid:0.45,look:[0,0.9]}}
    if(t>=EV.lift0&&t<EV.inside){const k=(t-EV.lift0)/(EV.inside-EV.lift0);c.pos=[0,6.2*ease(k),0];c.sit=0.3;c.dangle=1;c.yaw=(t-EV.lift0)*0.9;c.headP=0;c.eyes={lid:0.55,look:[0,-0.2]};c.tail={up:-1.2,curl:-0.2};
      if(t>EV.inside-0.18)c.sc=clamp((EV.inside-t)/0.18,0.02,1)}
    if(t>=EV.inside&&t<EV.drop)c.hidden=1;
    if(t>=EV.drop&&t<EV.dland){const k=(t-EV.drop)/(EV.dland-EV.drop);c.pos=[0,6.2*(1-k*k)+0.3,0];c.piv=0.3;c.rz=Math.PI*(1-ease(clamp(k/0.6,0,1)));c.sit=0;c.splay=k<0.5?1:0;c.eyes={lid:0,wide:1,look:[0,-0.5]};c.ears=0.6;c.tail={up:0.9,curl:-0.6,wag:1,ph:t*3}}
    if(t>=EV.dland){const k=t-EV.dland;c.sit=ease((k-0.5)/0.4);c.crouch=0.9*Math.exp(-k*6);c.eyes={lid:0.45,look:[0,0]};if(t>=EV.ufoCrash){c.headY=-0.45*env01(t,EV.ufoCrash,EV.ufoCrash+0.9,0.2,0.3);}lick(EV.ufoCrash+1.0,R[3]+0.2)}}
  if(rn===3){c.eyes={lid:0.45,look:[0,0.4]};
    if(t>=EV.roar1&&t<EV.roar1+1.1){c.ears=0.7;c.eyes={lid:0.65,look:[0,0.2]};c.headP=0.06}
    if(t>=EV.yawn&&t<EV.yawn+1.0){const k=(t-EV.yawn)/1.0;const m=Math.sin(Math.PI*k);c.mouth=m;c.eyes={lid:1};c.headP=-0.28*m;c.ears=0.3*m}
    if(t>=EV.roar2&&t<EV.hiss){c.ears=0.7;c.eyes={lid:0.6,look:[0,0.2]}}
    if(t>=EV.hiss&&t<EV.calm+0.5){const k=t-EV.hiss;const pop=easeOut(clamp(k/0.18,0,1));const off=t<EV.calm?1:1-ease((t-EV.calm)/0.5);c.sit=1-pop*off;c.arch=pop*off;c.puff=pop*off;c.ears=off;c.mouth=t<EV.flee+0.3?pop:0.15*off;c.eyes=off>0.5?{glow:1,brow:0.6}:{lid:0.4};
      c.tail={up:1.0,curl:0.15,wag:0.15,ph:t*4};c.pos=[0.006*Math.sin(t*60)*off,0,0]}
    lick(EV.calm+0.6,R[4]+0.2)}
  if(rn>=4){c.sit=0;c.crouch=0.35;c.headP=0.75+0.06*Math.sin(t*12);c.eyes={lid:1,happy:1};c.tail={up:0.5,curl:0.6,wag:0.3,ph:t*0.5};
    if(t>=EV.boss){c.headP=lerp(0.75,0.15,ease((t-EV.boss)/0.3));c.eyes={lid:0.35,look:[0,0]}}
    if(t>=EV.look){const k=ease((t-EV.look)/0.35);c.headY=2.2*k;c.yaw=0.7*k;c.headP=0.15;c.eyes={lid:0,tiny:t>EV.look+0.4?1:0,look:[0,0]};if(t>EV.look+0.4){c.ears=0.5;c.puff=0.4}}
    if(t>=EV.jump){const k=t-EV.jump;let y;if(t<EV.apex0)y=1.5*easeOut((t-EV.jump)/(EV.apex0-EV.jump));else if(t<EV.apex1)y=1.5+0.1*(t-EV.apex0);else{const q=(t-EV.apex1)/(EV.koland-EV.apex1);y=1.6*(1-q*q)}
      const kk=Math.min(1,(t-EV.jump)/0.35);c.pos=[0.2*kk,y+0.3,-0.05*kk];c.piv=0.3;c.yaw=lerp(0.7,Math.PI,easeOut(kk));c.headY=lerp(2.2,0,kk);c.headP=0;c.crouch=0;c.splay=1;c.puff=1;c.arch=0.6;c.ears=1;c.mouth=0.8;c.eyes={lid:0,tiny:1,wide:1};c.tail={up:1.1,curl:0.1};
      if(t>=EV.apex1){c.rz=Math.PI*ease((t-EV.apex1)/(EV.koland-EV.apex1))}}
    if(t>=EV.koland){const k=t-EV.koland;c.pos=[0.2,0.15+0.05*Math.exp(-k*7)*Math.abs(Math.cos(k*18)),-0.05];c.rz=Math.PI;c.yaw=Math.PI;c.piv=0.3;c.splay=1;c.puff=0.6*Math.exp(-k*0.6);c.arch=0;c.ears=0.6;c.mouth=0.3;c.tongue=1;c.eyes={x:1};c.tail={up:-0.4,curl:-0.2}}}
  return c}
function hopK(t,t0,d,a,b,h){if(t<t0)return{p:a.slice(),sq:0.12*clamp((t-t0+0.12)/0.12,0,1)};if(t<t0+d){const k=(t-t0)/d;const p=lerp3(a,b,k);p[1]+=4*h*k*(1-k);return{p,sq:0}}const k=t-t0-d;return{p:b.slice(),sq:0.3*Math.exp(-k*8)}}
// ---- dogs
const DOGS=[];for(let r=0;r<3;r++)for(let c=0;c<6;c++){const i=r*6+c;DOGS.push({i,x:(c-2.5)*0.72+(hsh(i,1)-0.5)*0.25,z0:31.2+r*1.15+hsh(i,3)*0.45,sc:0.85+hsh(i,4)*0.4,col:DOGCOL[i%4],h:hsh(i,5)})}
function dogsAt(t){if(t>=R[1])return[];const out=[];for(const d of DOGS){const z=d.z0-6.5*(t-R[0]);const tL=EV.swat+0.03+Math.max(0,z)/28;const st={pos:[d.x,0,z],yaw:Math.PI+(d.h-0.5)*0.2,sc:d.sc,col:d.col,t};
    if(t<tL){st.gait={ph:t*2.8+d.h,amp:0.34};st.mouth=0.35+0.45*Math.abs(Math.sin(t*7+d.i));st.eyes={lid:0.1,brow:0.45};st.tongue=d.i%3===0?1:0;st.tail={up:0.5,curl:0.3,wag:0.6,ph:t*3}}
    else{const k=t-tL;if(k>4)continue;const v=[d.x*1.1+(d.h-0.5)*2.5,6+d.h*4,7+d.h*5];st.pos=[d.x+v[0]*k,0.35*d.sc+v[1]*k-1.5*k*k,z+v[2]*k];st.piv=0.35;st.rx=k*(5+d.h*4);st.rz=k*(2+d.h*3)*(d.i%2?1:-1);st.mouth=0.8;st.eyes={lid:0,tiny:1};st.splay=1;st.tail={up:1,curl:0.2}}
    out.push(st)}return out}
// ---- vacuum
function vacAt(t){if(t<R[1]||t>=R[2])return null;const v={pos:[0,0,2.2],yaw:Math.PI,led:0,happy:0};
  if(t<EV.vstop){const k=(t-R[1])/(EV.vstop-R[1]);v.pos=[0,0,lerp(14,2.2,1-Math.pow(1-k,2))]}
  if(t>=EV.boop){v.led=1;v.happy=1}
  if(t>=EV.ride&&t<24.2)v.yaw=Math.PI+3*Math.PI*ease((t-EV.ride)/0.8);
  if(t>=24.2){const a=(t-24.2)*0.85;v.pos=[2.2-2.2*Math.cos(a),0,2.2+2.2*Math.sin(a)];v.yaw=a}
  return v}
function vacItems(items,t){const v=vacAt(t);if(!v)return;const M=M4.trs(v.pos,v.yaw,0,0,1);items.push({mesh:VAC,M});
  const ledC=v.led?(t<EV.boop+0.5?hsv((t*3)%1,0.8,1):[0.25,1,0.45]):[1,0.2,0.15];items.push({mesh:VLED,M,tint:ledC,tintAmt:1,noShadow:true});
  for(const sx of[-1,1])items.push({mesh:BRUSH,M:M4.mul(M,M4.trs([sx*0.85,0,0.95],t*14*sx,0,0,1)),noShadow:true});
  const ec=v.happy?[0.3,1,0.5]:[1,0.18,0.12];for(const sx of[-1,1]){if(v.happy){for(const d of[-1,1])items.push({mesh:UEMIS,M:M4.mul(M,M4.trs([sx*0.17+d*0.035,0.305+(d<0?0:0)+0.012,1.235],0,0,d*0.6,[0.045,0.012,0.012])),tint:ec,tintAmt:1,noShadow:true})}
    else items.push({mesh:UEMIS,M:M4.mul(M,M4.trs([sx*0.17,0.3,1.235],0,0,-sx*0.35,[0.07,0.025,0.012])),tint:ec,tintAmt:1,noShadow:true})}
  if(t>=EV.suck0&&t<EV.vjump+0.3){const a=env01(t,EV.suck0,EV.vjump+0.3,0.3,0.3);for(let i=0;i<46;i++){const k=(t*1.4+hsh(i,1))%1;const s=[(hsh(i,2)-0.5)*1.8,0.02+hsh(i,3)*0.5,-0.7+hsh(i,4)*1.2];const e=[0,0.08,0.92];const p=lerp3(s,e,k*k);
      items.push({mesh:i%3?PETAL:UB,M:M4.trs(p,t*5+i,t*7+i,0,i%3?0.03:0.012),tint:i%3?null:[0.55,0.5,0.4],tintAmt:i%3?0:1,alpha:a*Math.min(1,(1-k)*4),noShadow:true})}}
  {const k=t-EV.boop;if(k>=0&&k<0.6){const c=tp(M,[0,0.38,0]);for(let j=0;j<14;j++){const a=j/14*TAU2;items.push({mesh:UEMIS,M:M4.trs(V.add(c,[Math.cos(a)*k*1.2,k*1.5-k*k*2,Math.sin(a)*k*1.2]),0,0,0,0.018*(1-k/0.6)),tint:[0.6,0.9,1],tintAmt:1,alpha:1,add:1,noShadow:true})}}}}
function hsv(h,s,v){const f=n=>{const k=(n+h*6)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1))};return[f(5),f(3),f(1)]}
// ---- ufo
const UFO_END=[-45,0,90];
function ufoAt(t){if(t<R[2]||t>=EV.ufoCrash)return null;const u={pos:[0,7+0.15*Math.sin(t*2),0.3],rx:0,rz:0.05*Math.sin(t*1.3),chaos:0};
  if(t<EV.ufoHover){const k=(t-R[2])/(EV.ufoHover-R[2]);u.pos=lerp3([3,30,30],[0,7,0.3],1-Math.pow(1-k,2.5));u.rz=-0.2*(1-k)}
  if(t>=EV.chaos0&&t<EV.drop+0.2){u.chaos=1;u.pos=V.add(u.pos,[0.25*Math.sin(t*37),0.2*Math.sin(t*29),0.2*Math.sin(t*41)]);u.rx=0.15*Math.sin(t*23);u.rz=0.18*Math.sin(t*31)}
  if(t>=EV.ufoAway){const k=(t-EV.ufoAway)/(EV.ufoCrash-EV.ufoAway);u.pos=V.add(lerp3([0,7,0.3],UFO_END,Math.pow(k,1.5)),[3*Math.sin(t*5)*(1-k),4*Math.sin(Math.PI*k),0]);u.rx=0.45*Math.sin(t*8);u.rz=0.6*Math.sin(t*6.5);u.chaos=0.6}
  return u}
function ufoItems(items,t){const u=ufoAt(t);if(!u)return;const M=M4.trs(u.pos,t*0.6,u.rx,u.rz,1);items.push({mesh:UFO,M,tint:null,tintAmt:0});
  items.push({mesh:DOME,M:M4.mul(M,M4.trs([0,0.55,0],0,0,0,[1.25,0.9,1.25])),tint:[0.6,0.95,1],tintAmt:1,alpha:0.55,noShadow:true});
  for(let i=0;i<14;i++){const a=i/14*TAU2;let c=hsv(((i/14)+t*0.5)%1,0.7,1);if(u.chaos&&Math.sin(t*30+i)>0)c=[1,0.15,0.1];items.push({mesh:UEMIS,M:M4.mul(M,M4.trs([Math.cos(a)*3.48,0.05,Math.sin(a)*3.48],0,0,0,0.13)),tint:c,tintAmt:1,noShadow:true})}
  if(t>=EV.beam0&&t<EV.inside+0.15){const a=env01(t,EV.beam0,EV.inside+0.15,0.25,0.15)*(0.85+0.15*Math.sin(t*25));const b=[u.pos[0],u.pos[1]-0.6,u.pos[2]];
    items.push({mesh:TRACT,M:segM([b[0],0,b[2]],b,1.25),tint:[0.45,1,0.8],tintAmt:1,alpha:0.2*a,add:1,noShadow:true});items.push({mesh:TRACT,M:segM([b[0],0,b[2]],b,0.7),tint:[0.7,1,0.9],tintAmt:1,alpha:0.2*a,add:1,noShadow:true});
    for(let j=0;j<30;j++){const k=(t*0.35+hsh(j,1))%1;const ang=j*2.4+t;const r=0.2+hsh(j,2)*0.9*(1-k*0.6);items.push({mesh:UEMIS,M:M4.trs([b[0]+Math.cos(ang)*r,k*b[1],b[2]+Math.sin(ang)*r],0,0,0,0.03),tint:[0.7,1,0.85],tintAmt:1,alpha:a*0.9,add:1,noShadow:true})}
    items.push({mesh:DISC2,M:M4.trs([b[0],0.02,b[2]],0,0,0,1.3),tint:[0.5,1,0.8],tintAmt:1,alpha:0.35*a,add:1,noShadow:true})}
  if(t>=EV.ufoAway){for(let j=0;j<18;j++){const tj=t-j*0.06;if(tj<EV.ufoAway)break;const q=ufoAt(tj);if(!q)break;items.push({mesh:PUFF,M:M4.trs(V.add(q.pos,[0,0.3,0]),j,0,0,0.6+j*0.12),tint:[0.25,0.24,0.26],tintAmt:0.8,alpha:0.6*(1-j/18),noShadow:true})}}}
// ---- bear
const BSC=3.2;
function bearAt(t){if(t<R[3]||t>=R[4])return null;const b={pos:[0,0,2.6],yaw:Math.PI,sc:BSC,t,eyes:{lid:0.15,brow:0.5},headP:0.05,mouth:0,tail:{up:0.2}};
  if(t<EV.bstop){const k=(t-R[3])/(EV.bstop-R[3]);const z=lerp(16,2.6,1-Math.pow(1-k,1.6));b.pos=[0,0,z];b.gait={ph:(16-z)/0.75,amp:0.22*(1-k*0.6)}}
  if(t>=EV.roar1&&t<EV.roar1+1.1){const m=env01(t,EV.roar1,EV.roar1+1.1,0.15,0.3);b.mouth=m;b.headP=0.05+0.3*m;b.headY=0.06*Math.sin(t*30)*m;b.crouch=0.25*m;b.eyes={lid:0.1,brow:0.6}}
  if(t>=EV.yawn&&t<EV.roar2){b.headR=0.3*env01(t,EV.yawn,EV.roar2,0.3,0.3);b.eyes={lid:0,brow:-0.2}}
  if(t>=EV.roar2&&t<EV.hiss){const m=env01(t,EV.roar2,EV.hiss,0.12,0.2);b.mouth=m;b.headP=0.05+0.38*m;b.headY=0.08*Math.sin(t*34)*m;b.crouch=0.35*m;b.eyes={lid:0.05,brow:0.75}}
  if(t>=EV.hiss){const k=t-EV.hiss;b.eyes={lid:0,tiny:1,brow:-0.5};b.mouth=0.35;b.pos=[0,0.25*Math.sin(Math.PI*clamp(k/0.35,0,1)),2.6+0.5*easeOut(clamp(k/0.35,0,1))];b.headP=-0.15}
  if(t>=EV.flee){const k=t-EV.flee;b.yaw=Math.PI-Math.PI*ease(clamp(k/0.4,0,1));if(k>0.35){const q=k-0.35;b.pos=[0.3*Math.sin(q*3),0,3.1+3*q*q+2*q];b.gait={ph:t*2.4,amp:0.3}}b.mouth=0.5}
  return b}
function cukeItems(items,t){if(t<R[4])return;let x=0;if(t<EV.cuke)x=1.6;else x=lerp(1.4,0,easeOut(clamp((t-EV.cuke)/0.55,0,1)));if(x>1.5)return;items.push({mesh:CUKE,M:M4.trs([x,0.05,-0.5],0.12,0,0,1)});
  if(t<EV.jump)items.push({mesh:BOWL,M:M4.trs([0,0,0.33],0,0,0,1)});else items.push({mesh:BOWL,M:M4.trs([0,0,0.33],0,0,0,1)})}
// ---- effects
function ring(items,p,k,d,rmax,col,a0,add){if(k<0||k>d)return;const r=0.2+rmax*easeOut(k/d);items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[r,0.25+r*0.03,r]),tint:col||null,tintAmt:col?1:0,alpha:(a0||0.6)*(1-k/d),add:add?1:0,noShadow:true})}
function effects(items,t){const rn=roundAt(t);
  if(rn===0){ring(items,[0,0.2,0.3],t-EV.swat,0.7,16,[1,1,1],0.7,1);ring(items,[0,0.02,0.3],t-EV.swat,0.9,9,null,0.6)}
  if(rn===1){ring(items,[0,0.36,1.85],t-EV.vland,0.5,0.8,null,0.5)}
  if(rn===2){ring(items,[0,0.02,0],t-EV.dland,0.6,1.4,null,0.35);if(t>=EV.ufoCrash-0.05)fireball(items,UFO_END,t-EV.ufoCrash,6)}
  if(rn===3){ring(items,[0,0.25,0.2],t-EV.hiss,0.7,9,[0.8,0.4,1],0.7,1);const b=bearAt(t);if(b&&t<EV.bstop)for(let s=0;s<6;s++){}
    if(t>=EV.roar1&&t<EV.roar1+1.1||t>=EV.roar2&&t<EV.hiss){for(let i=0;i<26;i++){const k=(t*1.8+hsh(i,1))%1;const p=[(hsh(i,2)-0.5)*0.9,0.2+hsh(i,3)*0.6,1.3-k*2.2];items.push({mesh:PUFF,M:M4.trs(p,i,0,0,0.025+k*0.035),tint:[1,1,1],tintAmt:0.6,alpha:0.2*Math.sin(Math.PI*k),noShadow:true})}}}
  if(rn>=4){ring(items,[0.2,0.02,-0.05],t-EV.koland,0.5,0.9,null,0.6);ring(items,[0,0.02,0],t-EV.jump,0.5,0.8,null,0.5)}}
// ---- scene
let LASTVP=null,CAT=null,CATR=null,BEAR=null,BEARR=null,DOGR=[];
function fgItems(t){const rn=roundAt(t);const items=[{mesh:WORLD},{mesh:SEA},{mesh:MOUNT}];if(rn!==2)petals(items,t,[0,0,0],60);
  const c=catAt(t);CAT=c;CATR=null;if(!c.hidden)CATR=quad('cat',c,items);
  DOGR=[];for(const d of dogsAt(t))DOGR.push([d,quad('dog',d,items)]);
  vacItems(items,t);ufoItems(items,t);const b=bearAt(t);BEAR=b;BEARR=b?quad('bear',b,items):null;cukeItems(items,t);effects(items,t);return items}
function renderScene(t){const tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const cm=camAt(tt);const items=fgItems(tt);const cp=CAT.pos;
  LASTVP=renderGL(env,{eye:cm.eye,at:cm.at,fov:cm.fov,near:0.03,far:14000},{center:[cp[0],0,cp[2]+0.8],radius:roundAt(tt)===3?4.5:3.2},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S(EV.swat,16,0.6);if(t>=R[0]&&t<EV.swat)a+=1.5*clamp((t-R[0])/3,0,1);if(t>=EV.suck0&&t<EV.vjump)a+=3;S(EV.vland,5,0.3);S(EV.boop,6,0.3);
  if(t>=EV.chaos0&&t<EV.drop)a+=7;S(EV.dland,8,0.4);S(EV.ufoCrash,12,1.2);
  if(t>=R[3]&&t<EV.bstop){const ph=((16-(bearAt(t)||{pos:[0,0,16]}).pos[2])/0.75)%0.5;if(ph<0.08)a+=4}
  if(t>=EV.roar1&&t<EV.roar1+1.1)a+=7;if(t>=EV.roar2&&t<EV.hiss)a+=10;S(EV.hiss,18,0.6);S(EV.koland,12,0.4);S(EV.jump,5,0.3);return a}
// ================= overlays =================
function pill(s,y,bg,size,al){size=fitSize(s,930,size||58);ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(W/2,y);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle=bg;rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}
function popS(k){return k<0.2?0.6+0.4*easeOut(k/0.2)+Math.sin(k/0.2*Math.PI)*0.18:1}
function drawHUD(t){const rn=roundAt(t);if(rn<0||t>=R[5])return;const[lab,caps]=ROUNDS[rn];const fin=rn===4;
  if(!fin||t>=EV.boss){const ts=fin?EV.boss:R[rn];ctx.save();ctx.translate(W/2,250);const pp=popS(t-ts);ctx.scale(pp,pp);txt(lab,0,0,fin?118:120,fin?'#ff5a5a':'#ffd84a');ctx.restore();
    let cur=null;for(const c of caps)if(t>=c[0])cur=c;if(cur)pill(cur[1],385,cur[2],60,Math.min(1,(t-cur[0])/0.12))}
  else{let s=null,t0=0;if(t>=R[4]+0.3){s='Finally… peace 😌';t0=R[4]+0.3}if(t>=EV.cuke+0.2){s='Wait…';t0=EV.cuke+0.2}
    if(s)pill(s,385,BGD,s==='Wait…'?64:60,Math.min(1,(t-t0)/0.15))}
  const ko=t>=EV.koland;ctx.save();ctx.translate(W/2,520);ctx.scale(0.8,0.8);ctx.fillStyle='rgba(15,10,30,0.7)';rrect(-340,-50,680,100,50);ctx.fill();txt('🐾 HP',-238,2,44,'#fff','center',900,false);
  ctx.fillStyle='rgba(255,255,255,0.18)';rrect(-150,-17,330,34,17);ctx.fill();if(!ko){ctx.fillStyle='#3ee07a';rrect(-150,-17,330,34,17);ctx.fill()}
  txt(ko?'K.O.':'100%',258,2,ko?46:42,ko?'#ff4a4a':'#fff','center',900,false);ctx.restore()}
function drawTitle(t){if(t>=R[0]+0.2)return;const a=t<R[0]-0.3?1:clamp((R[0]+0.2-t)/0.5,0,1);const pop=t<0.3?0.7+0.3*easeOut(t/0.3):1;ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,330);ctx.scale(pop,pop);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  const L=[['A DOG ARMY 🐕','#ffcf8a'],['A ROBOT VACUUM 🤖','#9fe0ff'],['A UFO 🛸','#b8ff9a'],['A BEAR 🐻','#ff9a7a']];
  L.forEach(([s,c],i)=>{const kk=clamp((t-0.15-i*0.18)/0.25,0,1);if(kk<=0)return;ctx.save();ctx.globalAlpha=a*kk;txt(s,0,-190+i*78,62,c);ctx.restore()});
  const kv=clamp((t-0.95)/0.25,0,1);if(kv>0){ctx.save();ctx.globalAlpha=a*kv;txt('vs',0,140,74,'#ffffff');ctx.restore()}
  const ks=clamp((t-1.15)/0.25,0,1);if(ks>0){ctx.save();ctx.globalAlpha=a*ks;ctx.translate(0,250);const p2=popS(t-1.15);ctx.scale(p2,p2);txt('ONE CAT 🐱',0,0,fitSize('ONE CAT 🐱',980,118),'#ffd84a');ctx.restore()}ctx.restore();
  if(t>1.6){ctx.save();ctx.globalAlpha=a*clamp((t-1.6)/0.3,0,1);pill('Who wins? 🤔',1560,'rgba(15,10,30,0.66)',62);ctx.restore()}}
function drawEnd(t){const t0=R[5];const k=ease((t-t0)/0.5)*clamp((EV.loop-t)/0.25,0,1);if(k<=0)return;ctx.fillStyle=`rgba(10,8,25,${0.66*k})`;ctx.fillRect(0,0,W,H);const pop=t-t0<0.5?0.7+0.3*ease((t-t0-0.1)/0.4):1;ctx.save();ctx.globalAlpha=k;ctx.translate(W/2,700);ctx.scale(pop,pop);
  txt('Who should the cat',0,-110,fitSize('Who should the cat',960,84),'#ffffff');txt('fight NEXT? 🐱',0,0,96,'#ffd84a');txt('👇',0,180+Math.abs(Math.sin((t-t0)*5))*26,120,'#fff','center',900,false);ctx.restore();
  ctx.save();ctx.globalAlpha=k*ease((t-t0-0.6)/0.4);txt('A bath? 🛁   The vet? 💉',W/2,1080,54,'#ffffff','center',800);ctx.restore()}
function glowAt(p,r,col,a){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function emoji(s,x,y,size,al){ctx.save();ctx.globalAlpha=al==null?1:al;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
function prj(p){return LASTVP?project(LASTVP,p):null}
function bubble(s,p,size,col,rot,al){if(!p)return;ctx.save();ctx.globalAlpha=al==null?1:al;ctx.translate(p[0],p[1]);ctx.rotate(rot||0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=10;txt(s,0,0,size,col||'#fff');ctx.restore()}
function overlays(t){ctx.setTransform(1,0,0,1,0,0);const tt=t>=EV.loop?t-EV.loop:t;const rn=roundAt(tt);
  // dogs: woofs + twinkles
  if(rn===0){if(tt>=6.3&&tt<EV.swat){for(const[d,r]of DOGR){if(d.i%4)continue;const ph=(tt*2.2+hsh(d.i,9))%1;if(ph<0.45){const p=prj(r.head);if(p)bubble('WOOF!',[p[0]+(hsh(d.i,2)-0.5)*40,p[1]-70-ph*40],46,'#ffffff',(hsh(d.i,3)-0.5)*0.4,Math.sin(Math.PI*ph/0.45))}}}
    for(const[d,r]of DOGR){const tL=EV.swat+0.03+Math.max(0,d.z0-6.5*(EV.swat-R[0]))/28;const k=tt-tL;if(k>2.0&&k<3.0&&d.i%2===0){const p=prj(r.head);if(p){const a=Math.sin((k-2)*Math.PI);ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(k*3);emoji('✨',0,0,50+60*a,a);ctx.restore()}}}
    {const k=tt-EV.swat;if(k>=0&&k<0.5&&CATR){const p=prj(V.add(CAT.pos,[0.05,0.35,0.35]));if(p)glowAt(p,420,'255,250,220',0.8*(1-k/0.5))}}}
  // vacuum
  if(rn===1){if(tt>=EV.boop&&tt<EV.boop+1.0){const v=vacAt(tt);const p=prj(V.add(v.pos,[0,0.7,0]));if(p){const k=tt-EV.boop;bubble('beep boop 🤖',[p[0],p[1]-60-k*60],56,'#9ff0ff',0,Math.min(1,(1-k)*3))}}
    if(tt>=EV.suck0&&tt<EV.vjump){const p=prj([0,0.4,1.0]);if(p)bubble('VRRRRRR',[p[0],p[1]-120],60,'#ffffff',-0.08,0.85)}}
  // ufo chaos
  if(rn===2){const u=ufoAt(tt);if(u&&tt>=EV.chaos0&&tt<EV.drop){const E=['💥','⚡','👽','😾','💥','🛸','⚡','💫'];for(let i=0;i<8;i++){const ph=(tt*1.6+hsh(i,1))%1;const a=hsh(i,2)*TAU2+Math.floor(tt*1.6+hsh(i,1))*2.1;const p=prj(V.add(u.pos,[Math.cos(a)*3.2,Math.sin(a)*1.6+0.6,0]));if(p)emoji(E[i],p[0],p[1],70+ph*50,Math.sin(Math.PI*ph))}
      const p=prj(V.add(u.pos,[0,2.2,0]));if(p){const k=Math.floor(tt*3)%3;bubble(['*CRASH*','*BONK*','*HISS*'][k],[p[0],p[1]],64,'#ffef6a',(k-1)*0.15,0.95)}}
    if(tt>=EV.ufoCrash){const p=prj(V.add(UFO_END,[0,3,0]));const f=Math.exp(-(tt-EV.ufoCrash)*0.9);if(p){glowAt(p,520,'255,160,60',0.75*f);glowAt(p,160,'255,240,200',0.9*f)}}}
  // bear
  if(rn===3){if(tt>=EV.roar1&&tt<EV.roar1+1.0||tt>=EV.roar2&&tt<EV.hiss){const r0=tt<EV.roar2?EV.roar1:EV.roar2;const k=tt-r0;bubble(tt<EV.roar2?'ROAR!':'ROOOAAAR!!',[W/2+Math.sin(tt*40)*8,1250],tt<EV.roar2?110:130,'#ffd0a0',Math.sin(tt*30)*0.04,Math.min(1,k*6)*clamp((1.1-k)*3,0,1))}
    if(tt>=EV.hiss&&tt<EV.flee+0.4){const k=tt-EV.hiss;bubble('HISSSS!',[W/2+Math.sin(tt*50)*10,1300],120,'#e8b0ff',Math.sin(tt*40)*0.05,Math.min(1,k*8))}
    if(tt>=EV.flee&&BEARR){const p=prj(BEARR.head);if(p){emoji('😭',p[0]+90,p[1]-80,80);for(let i=0;i<3;i++){const ph=(tt*2+i/3)%1;emoji('💦',p[0]-60-i*20,p[1]-40-ph*80,44,1-ph)}}}}
  // final
  if(rn===4){if(tt>=EV.look+0.35&&tt<EV.jump+0.3&&CATR){const p=prj(V.add(CATR.head,[0,0.18,0]));if(p){const k=tt-EV.look-0.35;bubble('!',[p[0],p[1]-40],140*popS(k),'#ff4a4a',0,1)}}
    if(tt>=EV.koland+0.15&&CATR){const p=prj(CATR.head);if(p)for(let i=0;i<3;i++){const a=tt*4+i/3*TAU2;emoji('💫',p[0]+Math.cos(a)*100,p[1]-150+Math.sin(a)*30,62)}}}
  {const k=ease((tt-EV.apex0+0.15)/0.2)*(1-ease((tt-EV.apex1)/0.2));if(k>0){ctx.fillStyle=`rgba(0,0,0,${0.9*k})`;ctx.fillRect(0,0,W,100*k);ctx.fillRect(0,H-100*k,W,100*k)}}
  const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.34)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=tt-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  for(let i=0;i<5;i++)flash(R[i],0.3,0.15);flash(EV.swat,0.7,0.3);flash(EV.boop,0.3,0.2,'160,240,255');flash(EV.ufoCrash,0.35,0.5,'255,190,120');flash(EV.hiss,0.5,0.3,'220,160,255');flash(EV.koland,0.5,0.25);flash(EV.look+0.35,0.35,0.15);
  if(t<EV.loop){drawHUD(tt);drawTitle(tt);drawEnd(tt)}else drawTitle(tt);
  {const k=EV.loop-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.7*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
const bc=document.createElement('canvas');bc.width=270;bc.height=480;const bctx=bc.getContext('2d');
function bloom(){bctx.filter='brightness(0.9) contrast(2.4) blur(5px)';bctx.drawImage(acc,0,0,270,480);bctx.filter='none';ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.36;ctx.drawImage(bc,0,0,W,H);ctx.restore()}
function frame(fi){const t0=fi/FPS;actx.setTransform(1,0,0,1,0,0);
  for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);renderScene(t);const sa=shakeAmt(t);actx.globalAlpha=1/(k+1);actx.drawImage(glc,Math.sin(t*27)*sa,Math.cos(t*21)*sa)}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter='saturate(1.12) contrast(1.05)';ctx.drawImage(acc,0,0);ctx.filter='none';bloom();const tm=t0+(SUB-1)/(2*FPS*SUB);overlays(tm)}
window.frame=frame;window.NFR=DUR*FPS;
