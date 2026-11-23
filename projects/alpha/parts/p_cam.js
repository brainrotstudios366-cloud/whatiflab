// ---------- camera ----------
const DG=Math.PI/180;function D(az,el){return[Math.sin(az*DG)*Math.cos(el*DG),Math.sin(el*DG),Math.cos(az*DG)*Math.cos(el*DG)]}
function camAt(t){let eye=[1.4,1.3,-3.3],at=[0,0.45,0.4];const rn=roundAt(t);const sway=Math.sin(t*0.35)*0.2;
  const to=(e2,a2,k)=>{eye=[lerp(eye[0],e2[0],k),lerp(eye[1],e2[1],k),lerp(eye[2],e2[2],k)];at=[lerp(at[0],a2[0],k),lerp(at[1],a2[1],k),lerp(at[2],a2[2],k)]};
  if(t<R[0]){const k=t/R[0];eye=[1.55-k*0.25,1.45-k*0.15,-3.6+k*0.3];at=[0.05,0.45,0.4]}
  if(rn===0){eye=[1.3+sway*0.2,1.3,-3.3];at=[0.05,0.45,0.4];
    if(t>=EV.e1+1.2)to([1.0,0.95,-2.7],[0.05,0.4,0.3],ease((t-EV.e1-1.2)/1.6));
    if(t>=EV.hit1)to([1.5,1.6,-3.6],[0.0,0.3,0.4],easeOut((t-EV.hit1)/0.6));
    if(t>=EV.res1)to([1.25,0.95,-2.9],[0.1,0.55,0.2],ease((t-EV.res1)/0.8))}
  if(rn===1){const k=ease((t-R[1])/1.2);eye=[lerp(1.25,-2.1,k)+sway*0.2,lerp(0.95,0.8,k),lerp(-2.9,-2.6,k)];at=[lerp(0.1,0.15,k),lerp(0.55,0.5,k),lerp(0.2,0.4,k)];
    if(t>=EV.hit2-0.5&&t<EV.res2)to([-1.6,0.75,-2.2],[0.1,0.5,0.3],ease((t-EV.hit2+0.5)/0.6));
    if(t>=EV.res2)to([-1.9,0.85,-2.6],[0.15,0.55,0.3],ease((t-EV.res2)/0.8))}
  if(rn===2){const k=ease((t-R[2])/1.4);eye=[lerp(-1.9,1.0,k)+sway*0.15,lerp(0.85,0.32,k),lerp(-2.6,-3.3,k)];at=[lerp(0.15,0.0,k),lerp(0.55,1.45,k),lerp(0.3,0.9,k)];
    if(t>=EV.hit3-0.4&&t<EV.res3)to([0.9,0.7,-2.6],[0.0,0.75,0.2],ease((t-EV.hit3+0.4)/0.7));
    if(t>=EV.res3)to([1.0,0.4,-3.2],[0.0,1.3,0.9],ease((t-EV.res3)/0.9))}
  if(rn===3){eye=[1.0+sway*0.15,0.38,-3.3];at=[0.0,1.4,0.9];
    if(t>=EV.c4-0.3&&t<EV.res4+0.5)to([0.85,0.5,-2.8],[0.0,1.1,0.6],ease((t-EV.c4+0.3)/0.5));
    if(t>=EV.res4+0.5)to([1.1,0.75,-2.9],[0.05,0.7,0.3],ease((t-EV.res4-0.5)/0.8))}
  if(rn===4){const k=ease((t-R[4])/1.2);eye=[lerp(1.1,1.4,k)+sway*0.2,lerp(0.75,0.9,k),lerp(-2.9,-3.4,k)];at=[lerp(0.05,0.0,k),lerp(0.7,0.75,k),lerp(0.3,0.6,k)];
    if(t>=EV.look5)to([0.95,0.8,-2.5],[0.0,0.55,0.2],ease((t-EV.look5)/1.6));
    if(t>=EV.fall5-0.2)to([1.0,1.25,-2.7],[-0.15,0.3,0.1],ease((t-EV.fall5+0.2)/0.9))}
  if(t>=R[5])eye=[1.0,1.25,-2.7],at=[-0.15,0.3,0.1];
  eye=V.add(at,V.sc(V.sub(eye,at),1.17));return{eye,at}}
// ---------- helpers ----------
function streak(items,head,d,len,w,col,a){const c=V.sub(head,V.sc(d,len/2));items.push({mesh:SPARK,M:M4.mul(M4.trs(c,Math.atan2(d[0],d[2]),-Math.asin(clamp(d[1],-1,1)),0,1),M4.trs([0,0,0],0,0,0,[w/0.06,w/0.06,len])),tint:col,tintAmt:1,alpha:a,add:1,noShadow:true})}
function burst(items,p,k,n,seed,sc,col,grav){for(let i=0;i<n;i++){const d=V.norm([hsh(i,seed)-0.5,0.25+hsh(i,seed+1)*0.9,hsh(i,seed+2)-0.5]);const v=(0.6+hsh(i,seed+3))*sc;const g=grav==null?4.9:grav;
  const q=[p[0]+d[0]*v*k,p[1]+d[1]*v*k-g*k*k*sc*0.3,p[2]+d[2]*v*k];const vel=V.norm([d[0],d[1]-g*0.6*k/v*sc,d[2]]);streak(items,q,vel,0.25*sc*Math.max(0.2,1-k),0.03*sc,col||mix3([1,1,0.85],[1,0.5,0.15],clamp(k,0,1)),Math.max(0,1-k/1.2))}}
function puff(items,p,k,n,sc,col,a0){for(let j=0;j<n;j++){const a=j/n*TAU2+hsh(j,9);if(k<0||k>1.6)continue;const d=easeOut(k/1.0)*sc*(0.8+0.4*hsh(j,3));items.push({mesh:USPH,M:M4.trs([p[0]+Math.cos(a)*d,p[1]+0.1*sc+k*0.35*sc,p[2]+Math.sin(a)*d],0,0,0,(0.12+k*0.25)*sc),tint:col||[0.72,0.68,0.6],tintAmt:1,alpha:Math.max(0,(a0||0.7)*(1-k/1.6)),noShadow:true})}}
