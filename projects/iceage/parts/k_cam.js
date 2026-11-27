// ---------- camera ----------
function camAt(t){let eye=[1.75,1.0,-3.9],at=[0,0.68,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.25;
  const to=(e2,a2,k)=>{eye=[lerp(eye[0],e2[0],k),lerp(eye[1],e2[1],k),lerp(eye[2],e2[2],k)];at=[lerp(at[0],a2[0],k),lerp(at[1],a2[1],k),lerp(at[2],a2[2],k)]};
  if(t<R[0]){const k=t/R[0];eye=[1.5-k*0.3,0.8+k*0.1,-3.5-k*0.4];at=[0.2,0.95,0.4]}
  if(rn===0){const k=ease((t-R[0])/1.2);eye=[lerp(1.2,1.4,k)+sway*0.2,lerp(0.9,0.85,k),-3.9];at=[lerp(0.2,0.0,k),lerp(0.95,0.8,k),lerp(0.4,0.6,k)];
    if(t>=EV.hit1-1.0){to([1.0,0.85,-2.5],[0.0,0.55,0.3],ease((t-EV.hit1+1.0)/0.9))}
    if(t>=EV.crk1){to([1.5,1.05,-3.4],[0.1,0.75,0.3],ease((t-EV.crk1)/0.6))}
    if(t>=EV.res1){to([1.5,0.95,-3.0],[0.2,0.65,0.2],ease((t-EV.res1)/0.8))}}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.5,1.7,k)+sway*0.2,lerp(0.95,1.35,k),lerp(-3.0,-3.9,k)];at=[lerp(0.2,0.0,k),lerp(0.65,0.85,k),lerp(0.2,1.4,k)];
    if(t>=EV.hit2-0.9){to([1.6,1.45,-3.7],[0.0,0.75,0.4],ease((t-EV.hit2+0.9)/0.8))}
    if(t>=EV.boom2-0.3){to([1.3,1.45,-3.0],[0.05,0.95,0.2],ease((t-EV.boom2+0.3)/0.8))}}
  if(rn===2){const k=ease((t-R[2])/1.2);eye=[lerp(1.3,0.7,k)+sway*0.15,lerp(1.45,0.3,k),lerp(-3.0,-3.2,k)];at=[lerp(0.05,-0.1,k),lerp(0.95,1.7,k),lerp(0.2,3.0,k)];
    if(t>=EV.hit3-1.6){to([3.0,0.9,-7.8],[-4.5,5.0,2.0],ease((t-EV.hit3+1.6)/0.6))}
    if(t>=EV.hit3-0.35){to([3.4,1.9,-7.8],[-1.4,1.5,0.6],ease((t-EV.hit3+0.35)/0.35))}
    if(t>=EV.res3-0.3){to([1.5,0.95,-3.0],[0.2,0.65,0.2],ease((t-EV.res3+0.3)/0.8))}}
  if(rn===3){const k=ease((t-R[3])/1.2);eye=[lerp(1.5,-1.3,k)+sway*0.2,lerp(0.95,0.75,k),lerp(-3.0,-3.8,k)];at=[lerp(0.2,0.2,k),lerp(0.65,0.95,k),lerp(0.2,0.9,k)];
    if(t>=EV.c4-0.6){to([-1.4,0.4,-3.4],[0.0,2.6,0.6],ease((t-EV.c4+0.6)/1.2))}
    if(t>=EV.res4-0.6){to([-1.2,0.85,-3.0],[0.1,0.65,0.2],ease((t-EV.res4+0.6)/1.0))}}
  if(rn===4){const k=ease((t-R[4])/1.0);eye=[lerp(-1.2,1.9,k)+sway*0.3,lerp(0.85,1.0,k),lerp(-3.0,-3.9,k)];at=[lerp(0.1,0.3,k),lerp(0.65,0.85,k),lerp(0.2,0.2,k)];
    if(t>=EV.dot5){const kk=ease((t-EV.dot5)/1.2);to([1.5,0.55,-3.0],[-0.1,1.4,0.1],kk)}
    if(t>=EV.hit5-0.6){to([1.1,1.3,-2.8],[-0.2,0.45,0],ease((t-EV.hit5+0.6)/0.9))}}
  if(t>=R[5])eye=[1.1,1.3,-2.8],at=[-0.2,0.45,0];
  return{eye,at}}
// ---------- helpers ----------
function streak(items,head,d,len,w,col,a){const c=V.sub(head,V.sc(d,len/2));items.push({mesh:SPARK,M:M4.mul(M4.trs(c,Math.atan2(d[0],d[2]),-Math.asin(clamp(d[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[w/0.06,w/0.06,len])),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
function burst(items,p,k,n,seed,sc,col,grav){for(let i=0;i<n;i++){const d=V.norm([hsh(i,seed)-0.5,0.25+hsh(i,seed+1)*0.9,hsh(i,seed+2)-0.5]);const v=(0.6+hsh(i,seed+3))*sc;const g=grav==null?4.9:grav;
  const q=[p[0]+d[0]*v*k,p[1]+d[1]*v*k-g*k*k*sc*0.3,p[2]+d[2]*v*k];if(q[1]<0)continue;const vel=V.norm([d[0],d[1]-g*0.6*k/v*sc,d[2]]);streak(items,q,vel,0.25*sc*Math.max(0.2,1-k),0.03*sc,col||mix3([1,1,0.85],[1,0.5,0.15],clamp(k,0,1)),Math.max(0,1-k/1.2))}}
function puff(items,p,k,n,sc,col,a0){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);if(k<0||k>1.6)continue;const d=easeOut(k/1.0)*sc*(0.8+0.4*hsh(j,3));items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1*sc+k*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+k*0.25)*sc),tint:col||[0.72,0.68,0.6],tintAmt:1,alpha:Math.max(0,(a0||0.7)*(1-k/1.6)),noShadow:true})}}
// jagged lightning polyline from a to b (seeded), with small branches
function boltPts(a,b,n,seed,jit){const P=[];for(let i=0;i<=n;i++){const f=i/n;const j=(i===0||i===n)?0:jit*Math.sin(f*Math.PI);P.push([lerp(a[0],b[0],f)+(hsh(i,seed)-0.5)*j,lerp(a[1],b[1],f),lerp(a[2],b[2],f)+(hsh(i,seed+1)-0.5)*j])}return P}
function bolt3D(items,a,b,seed,al,sc){const P=boltPts(a,b,16,seed,1.1*sc);const br=[];for(let i=3;i<12;i+=4){const q=P[i];br.push(boltPts(q,[q[0]+(hsh(i,seed+5)-0.5)*2.5*sc,q[1]-2.2*sc,q[2]+(hsh(i,seed+6)-0.3)*1.5*sc],6,seed+i*3,0.5*sc))}
  const seg=(L,w,col,aa)=>{for(let i=0;i<L.length-1;i++){const d=V.sub(L[i+1],L[i]);const len=V.len(d);streak(items,L[i+1],V.sc(d,1/len),len*1.04,w,col,aa)}};
  seg(P,0.22*sc,[0.55,0.7,1],0.45*al);seg(P,0.07*sc,[1,1,1],al);for(const L of br){seg(L,0.1*sc,[0.55,0.7,1],0.35*al);seg(L,0.035*sc,[0.95,0.97,1],0.8*al)}
  for(let i=0;i<P.length;i+=4)QPTS.push({p:P[i],c:'170,200,255',r:1.4*sc,a:0.55*al});return P}
