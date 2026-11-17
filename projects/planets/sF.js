// ================= scene assembly =================
const TPL=[['mer',[-0.27,0.33],300],['ven',[-0.14,0.43],400],['mar',[0.0,0.32],330],['jup',[0.15,0.44],580],['nep',[0.29,0.33],430]];
const PL_D=8000;const dirP=(az,el)=>[-Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el)];
const RPL={1:['ven',[700,2500,6600],1400],2:['mar',[-700,2350,6800],1300],3:['jup',[-300,2900,6400],2100],4:['nep',[600,2500,6600],1500]};
const SUNP=V.sc(V.norm([0.28,0.3,0.91]),9000);
let SKYPL=[];// [{p,r,key}] for 2D halos
const MET_S0=[20,170,300],MET_C=[0,22,24],MET_R=30,MLAND=[[-30,20,40],[30,20,40]];
function metPos(t){const k=clamp((t-EV.grs0)/(EV.cut-EV.grs0),0,1);return lerp3(MET_S0,MET_C,Math.pow(k,1.7))}
function halfPos(t,sx){const k=clamp((t-EV.cut)/2.6,0,1);const p=lerp3(MET_C,MLAND[sx>0?1:0],easeOut(k));return p}
function dustZ(t){return 300-(t-R[2])*(300/(EV.dust-R[2]))}
// diamonds
const DIA=[];{const r=rngG(77);for(let i=0;i<70;i++){const te=EV.dia0+r()*(EV.spin1-0.7-EV.dia0);let x=(r()-0.5)*16,z=(r()-0.5)*14+2;const hit=i%2===0;if(hit){x=(r()-0.5)*1.2;z=0.3+(r()-0.5)*1.0}
  const vy=-16-r()*6;const y0=34;const arr=te+(y0-2)/(-vy);let miss=!hit||arr<EV.spin0+0.05;if(hit&&miss){x+=x<0?-3.5:3.5}DIA.push({te,x,z,vy,y0,hit:!miss,s:0.17+r()*0.12,sp:r()*10,dx:(r()-0.5)*2})}}
const DCEN=[0,1.55,0.45],DRAD=1.15;
function diaPos(d,t){const a=t-d.te;if(a<0)return null;let p=[d.x+d.dx*a*0.2,d.y0+d.vy*a,d.z];
  if(d.hit){const ah=(d.y0-(DCEN[1]+DRAD*0.7))/(-d.vy);if(a>ah){const b=a-ah;const h=[d.x+d.dx*ah*0.2,d.y0+d.vy*ah,d.z];const out=V.norm(V.add(V.sub(h,DCEN),[0,0.2,0]));const v=V.add(V.sc(out,9),[0,4,0]);return{p:[h[0]+v[0]*b,h[1]+v[1]*b-4.9*b*b,h[2]+v[2]*b],fly:1,b}}}
  const gy=hgt(p[0],p[2])+d.s*0.5;if(p[1]<gy){return{p:[p[0],gy,p[2]],land:1}}return{p}}
let LASTVP=null,LASTSAM=null,LASTPEEL=null;
function fgItems(t){const rn=roundAt(t);const wt=worldTint(t);const W_={tint:wt.c,tintAmt:wt.a};const items=[Object.assign({mesh:WORLD},W_),{mesh:SEA,tint:wt.c,tintAmt:wt.a*0.6},Object.assign({mesh:MOUNT},W_)];
  const S=samItems(t);LASTSAM=S;items.push(...S.items);SKYPL=[];
  // ---- sky planets
  if(rn<0){for(const[key,[az,el],r]of TPL){const k=clamp((t+0.3-TPL.findIndex(q=>q[0]===key)*0.05)/0.3,0,1);if(k<=0)continue;const p=V.sc(dirP(az,el),PL_D);const rr=r*(0.6+0.4*easeOut(k));items.push({mesh:PLAN[key],M:M4.trs(p,0,0,0,rr),noShadow:true});SKYPL.push({p,r:rr,key,a:k});
      if(key==='jup'){}}}
  else if(rn===0){const k=ease((t-R[0])/1.2)*(t<EV.night?1:0);if(k>0){const r=1100*(0.7+0.3*k);items.push({mesh:SUNM,M:M4.trs(SUNP,0,0,0,r),noShadow:true,alpha:k});SKYPL.push({p:SUNP,r,key:'sun',a:k})}}
  else if(RPL[rn]){const[key,p,r]=RPL[rn];const k=ease((t-R[rn])/1.1)*(rn===1&&t>EV.rain0?1-0.7*ease((t-EV.rain0)/1.5):1)*(rn===2&&t>EV.dust-0.5?1-ease((t-EV.dust+0.5)/0.6):1);if(k>0.01){const rr=r*(0.8+0.2*k);items.push({mesh:PLAN[key],M:M4.trs(p,0,0,0,rr),alpha:k,noShadow:true});SKYPL.push({p,r:rr,key,a:k})}}
  // ---- petals (Earth & title)
  if(rn<0||rn===5)petals(items,t,[0,0,0],rn<0?40:80);
  // ---- Mercury: heat shimmer puffs / night
  if(rn===0&&t>=EV.night-0.05&&t<EV.night+0.8){const H=S.hands[1];const k=(t-EV.night+0.05)/0.85;for(let j=0;j<6;j++)items.push({mesh:PUFF,M:M4.trs(V.add(H,[Math.sin(j*2)*0.3,0.6+j*0.05,Math.cos(j*2)*0.3]),j,0,0,0.12+k*0.3),tint:[1,1,1],tintAmt:0.3,alpha:0.8*(1-k),noShadow:true})}
  if(rn===0&&t>=EV.tea){const H=S.hands[-1];for(let j=0;j<5;j++){const k=((t-EV.tea)*0.6+j/5)%1;items.push({mesh:PUFF,M:M4.trs(V.add(H,[Math.sin(k*6+j)*0.03,0.08+k*0.35,0.04]),j,0,0,0.02+k*0.05),tint:[1,1,1],tintAmt:0.5,alpha:0.45*(1-k),noShadow:true})}}
  // ---- Venus acid rain (evaporates ~9-13 m up)
  if(rn===1&&t>=EV.rain0){const a0=clamp((t-EV.rain0)/0.8,0,1);for(let i=0;i<300;i++){const x=(hsh(i,1)-0.5)*16,z=-7+hsh(i,2)*16;const ph=hsh(i,3);const y=46-((t-EV.rain0)*24+ph*36)%36;const ev=6.2+hsh(i,4)*2.2;
      const al=a0*clamp((y-ev)/3.5,0,1);if(al>0.02)items.push({mesh:UEMIS,M:M4.trs([x,y,z],0,0,0,[0.035,0.7,0.035]),tint:[0.85,0.95,0.35],tintAmt:1,alpha:0.55*al,add:1,noShadow:true});
      if(y<ev+1.5&&y>ev-2&&i%2===0){const k=clamp((ev+1.5-y)/3.5,0,1);items.push({mesh:PUFF,M:M4.trs([x,ev+k*1.2,z],i,0,0,0.35+k*0.9),tint:[0.95,0.92,0.7],tintAmt:0.5,alpha:0.6*(1-k)*a0,noShadow:true})}}}
  // ---- Mars dust wall + storm puffs
  if(rn===2){const dc=[0.72,0.38,0.2];if(t<EV.dust+0.4){const z=dustZ(t);for(let i=0;i<44;i++){const x=(i-21.5)*16+hsh(i,1)*8;for(let j=0;j<4;j++){const y=j*22+hsh(i*7+j,2)*10-2;const s=16+hsh(i,j+3)*14;
        items.push({mesh:PUFF,M:M4.trs([x,y,z+hsh(i,j)*20],i+j,t*0.2,0,[s*1.3,s,s]),tint:mix3(dc,[0.9,0.6,0.38],j/4),tintAmt:0.85,alpha:0.95,noShadow:true})}}}
    if(t>=EV.dust-0.2){const a0=clamp((t-EV.dust+0.2)/0.5,0,1);for(let i=0;i<60;i++){const x=(hsh(i,5)-0.5)*20,y=hsh(i,6)*5;const z=16-((t*11+hsh(i,7)*30)%30);
      items.push({mesh:PUFF,M:M4.trs([x,y,z],i,t,0,0.8+hsh(i,8)*1.8),tint:mix3(dc,[0.95,0.7,0.45],hsh(i,9)),tintAmt:0.85,alpha:0.5*a0,noShadow:true})}}}
  // ---- Jupiter: Great Red Spot vortex
  if(rn===3&&t>=EV.grs0-0.01){if(t<EV.cut){const p=metPos(t);const nrm=V.norm(V.sub([0,1,0],p));const sc=MET_R*(1+0.1*Math.sin(t*3));
      items.push({mesh:GRS,M:M4.mul(frameM(p,V.sc(nrm,-1),[1,0,0],[sc,sc*0.9,sc]),M4.trs([0,0,0],t*2.2,0,0,1)),noShadow:true});
      items.push({mesh:UEMIS,M:M4.trs(p,0,0,0,MET_R*1.15),tint:[1,0.45,0.2],tintAmt:1,alpha:0.22,add:1,noShadow:true})}
    else{const k=(t-EV.cut);for(const sx of[-1,1]){const p=halfPos(t,sx);const nrm=V.norm(V.sub([0,1,0],MET_C));const a=clamp(1-(k-0.9)/1.3,0,1);if(a<=0)continue;const sc=MET_R*(1+k*0.4);
      items.push({mesh:sx>0?GRSR:GRSL,M:M4.mul(frameM(p,V.sc(nrm,-1),[1,0,0],[sc,sc*0.9,sc]),M4.trs([0,0,0],sx*k*0.6,0,sx*k*0.5,1)),alpha:a,noShadow:true});
      for(let j=0;j<8;j++){const q=V.add(p,[sx*j*3,Math.sin(j*1.7)*6,Math.cos(j*2.1)*6]);items.push({mesh:PUFF,M:M4.trs(q,j,0,0,4+k*5),tint:[1,0.55,0.3],tintAmt:0.8,alpha:0.5*a*(1-j/9),noShadow:true})}}}}
  // ---- Neptune: diamonds
  if(rn===4){for(const d of DIA){const q=diaPos(d,t);if(!q)continue;const sp=q.land?0:t*6+d.sp;items.push({mesh:DIAM,M:M4.trs(q.p,sp,q.land?0.3:sp*0.7,q.land?1.2:0,d.s*(q.fly?1:1)),noShadow:true})}
    if(false){const H=S.hands[-1];items.push({mesh:DISC2,M:frameM(V.add(H,[0,0.0,0.05]),[0,0,1],[0,1,0],[0.8,1,0.8]),tint:[0.7,0.95,1],tintAmt:1,alpha:0.09,add:1,noShadow:true})}}
  // ---- Earth: banana peel
  if(rn===5||t>=R[6]){let p=[0,0.0,0.62],ry=0.4,rp=0;if(t>=EV.slip){const k=t-EV.slip;p=[0.4*k,Math.max(0,4*k-6*k*k),0.62+3.2*Math.min(k,1.2)];ry=0.4+k*9;rp=k*6;if(p[1]<=0)rp=0}p[1]+=hgt(p[0],p[2])-0.02;
    items.push({mesh:PEEL,M:M4.trs(p,ry,rp,0,1.1)});LASTPEEL=p}
  return items}
function renderScene(t){let tt=t>=EV.loop?t-EV.loop:t;const env=envAt(tt);const c=camAt(tt);const items=fgItems(tt);const root=(LASTSAM&&LASTSAM.o.root)||[0,0,0];
  LASTVP=renderGL(env,{eye:c.eye,at:c.at,fov:c.fov,near:0.05,far:14000},{center:[root[0],root[1]+0.4,root[2]],radius:6.5},items,tt)}
function shakeAmt(t){if(t>=EV.loop)t=t-EV.loop;let a=0;const S_=(t0,amp,d)=>{const k=t-t0;if(k>=0&&k<d)a+=amp*(1-k/d)};
  S_(R[0],6,0.4);S_(EV.night,8,0.4);if(t>=EV.dust-1.5&&t<EV.dust)a+=6*clamp((t-EV.dust+1.5)/1.5,0,1);S_(EV.dust,18,0.8);if(t>=EV.dust&&t<EV.breeze)a+=2.5;
  if(t>=EV.metUp&&t<EV.cut)a+=6*clamp((t-EV.metUp)/1.9,0,1);S_(EV.cut,22,0.5);S_(EV.land,14,0.5);
  if(t>=R[4]&&t<EV.spin1)a+=1.6;S_(EV.spin0,8,0.3);S_(EV.slip,6,0.3);S_(EV.floor,20,0.45);return a}
