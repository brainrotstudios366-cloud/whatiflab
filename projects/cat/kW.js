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
