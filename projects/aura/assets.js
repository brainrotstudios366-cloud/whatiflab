
// ===================== ASSETS =====================
const C={grass:hx('#6fa24a'),grass2:hx('#5e9140'),dirt:hx('#8a6a4a'),road:hx('#4a4c55'),side:hx('#b7b4ad'),line:hx('#f2f2f2'),yellow:hx('#f2cf2e'),sand:hx('#e2cf9a'),water:hx('#2f7fb0'),
  trunk:hx('#6b4a33'),leaf:hx('#4f8f3c'),leaf2:hx('#3f7d34'),leaf3:hx('#6aa84a'),snow:hx('#f4f7fb'),rock:hx('#857a70'),white:[1,1,1],wood:hx('#b08355'),roofR:hx('#b5482f'),roofG:hx('#5a5f6a')};
function tree(mb,x,z,s,y0,kind){y0=y0||0;mb.prism([x,y0,z],0.18*s,0.14*s,1.6*s,6,C.trunk);
  if(kind==='pine'){mb.prism([x,y0+1.2*s,z],1.5*s,0,2.6*s,7,C.leaf2);mb.prism([x,y0+2.4*s,z],1.1*s,0,2.2*s,7,C.leaf2)}
  else if(kind==='palm'){mb.prism([x,y0,z],0.18*s,0.12*s,5*s,6,hx('#8a6a45'));for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const t=[x,y0+5*s,z];const e=[x+Math.cos(a)*2.4*s,y0+4.2*s,z+Math.sin(a)*2.4*s];const sd=[Math.cos(a+1.57)*0.5*s,0,Math.sin(a+1.57)*0.5*s];mb.quad(t,V.add(e,sd),e,V.sub(e,sd),C.leaf3)}}
  else{const c=hsh(x*7|0,z*7|0)<0.5?C.leaf:C.leaf3;const c2=[c[0]*0.85,c[1]*0.9,c[2]*0.85];mb.ico([x,y0+2.5*s,z],1.3*s,c,0,0.9);mb.ico([x+0.65*s,y0+2.05*s,z+0.3*s],0.95*s,c2);mb.ico([x-0.55*s,y0+2.15*s,z-0.4*s],0.9*s,c2);mb.ico([x+0.1*s,y0+3.2*s,z+0.15*s],0.8*s,c);mb.ico([x-0.2*s,y0+2.0*s,z+0.7*s],0.75*s,c)}}
function house(mb,x,z,w,d,h,wall,roof,ry){mb.box([x,h/2,z],[w,h,d],wall,0,ry);const cs=Math.cos(ry||0),sn=Math.sin(ry||0);const P=(lx,y,lz)=>[x+lx*cs+lz*sn,y,z-lx*sn+lz*cs];const rh=h*0.55,o=0.4;
  mb.quad(P(-w/2-o,h-0.1,-d/2-o),P(-w/2-o,h-0.1,d/2+o),P(0,h+rh,d/2+o),P(0,h+rh,-d/2-o),roof);mb.quad(P(w/2+o,h-0.1,d/2+o),P(w/2+o,h-0.1,-d/2-o),P(0,h+rh,-d/2-o),P(0,h+rh,d/2+o),roof);
  mb.tri(P(-w/2,h,d/2),P(w/2,h,d/2),P(0,h+rh,d/2),wall);mb.tri(P(w/2,h,-d/2),P(-w/2,h,-d/2),P(0,h+rh,-d/2),wall);
  const gl_=hx('#2f3a4c');for(const sx of[-0.25,0.25])mb.box(P(sx*w,h*0.55,d/2+0.02),[w*0.18,h*0.28,0.06],gl_,0,ry);mb.box(P(0,h*0.25,d/2+0.02),[w*0.14,h*0.5,0.06],hx('#6b4a33'),0,ry)}
function car(mb,x,z,ry,col,y0){y0=y0||0;mb.box([x,y0+0.55,z],[1.9,0.7,4.4],col,0,ry);const cs=Math.cos(ry||0),sn=Math.sin(ry||0);mb.box([x-0.25*sn,y0+1.15,z-0.25*cs],[1.7,0.55,2.3],hx('#33405a'),0,ry,col);
  for(const sx of[-0.95,0.95])for(const sz of[-1.35,1.35])mb.box([x+sx*cs+sz*sn,y0+0.32,z-sx*sn+sz*cs],[0.3,0.64,0.64],hx('#1d1e22'),0,ry)}
function bus(mb,x,z,ry,col){mb.box([x,1.7,z],[2.6,2.8,11],col,0,ry);const cs=Math.cos(ry||0),sn=Math.sin(ry||0);for(const s of[-1,1])mb.box([x+s*1.31*cs,2.2,z-s*1.31*sn],[0.04,0.9,9.8],hx('#2f3a4c'),0,ry);
  for(const sz of[-3.8,3.8])for(const sx of[-1.2,1.2])mb.box([x+sx*cs+sz*sn,0.5,z-sx*sn+sz*cs],[0.4,1,1],hx('#1d1e22'),0,ry)}
function fence(mb,x0,z0,x1,z1,h){const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/0.35);const ry=Math.atan2(x1-x0,z1-z0);for(let i=0;i<=n;i++){const f=i/n;mb.box([x0+(x1-x0)*f,h/2,z0+(z1-z0)*f],[0.12,h,0.12],C.wood,0,ry)}
  for(const y of[h*0.3,h*0.8])mb.box([(x0+x1)/2,y,(z0+z1)/2],[0.06,0.12,Math.hypot(x1-x0,z1-z0)],C.wood,0,ry)}
function ground(mb,x0,z0,x1,z1,col,y,step,colFn){step=step||(x1-x0);const cf=colFn?((x,z)=>colFn(x,z)):null;for(let z=z0;z<z1-1e-6;z+=step)for(let x=x0;x<x1-1e-6;x+=step){const xs=Math.min(step,x1-x),zs=Math.min(step,z1-z);const c=cf?[cf(x,z),cf(x,z+zs),cf(x+xs,z+zs),cf(x+xs,z)]:col;mb.quad([x,y||0,z],[x,y||0,z+zs],[x+xs,y||0,z+zs],[x+xs,y||0,z],c)}}
function terrain(mb,x0,z0,x1,z1,n,hf,cf,m){const sx=(x1-x0)/n,sz=(z1-z0)/n;const H_=[];for(let i=0;i<=n;i++){H_.push([]);for(let j=0;j<=n;j++)H_[i].push(hf(x0+i*sx,z0+j*sz))}
  const Cc=[];for(let i=0;i<=n;i++){Cc.push([]);for(let j=0;j<=n;j++){const hl=H_[Math.max(0,i-1)][j],hr=H_[Math.min(n,i+1)][j],hd=H_[i][Math.max(0,j-1)],hu=H_[i][Math.min(n,j+1)];const nn=V.norm([(hl-hr)/(2*sx),1,(hd-hu)/(2*sz)]);Cc[i].push(cf(x0+i*sx,z0+j*sz,H_[i][j],nn[1]))}}
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const a=[x0+i*sx,H_[i][j],z0+j*sz],b=[x0+i*sx,H_[i][j+1],z0+(j+1)*sz],c=[x0+(i+1)*sx,H_[i+1][j+1],z0+(j+1)*sz],d=[x0+(i+1)*sx,H_[i+1][j],z0+j*sz];
    mb.tri(a,b,c,[Cc[i][j],Cc[i][j+1],Cc[i+1][j+1]],m);mb.tri(a,c,d,[Cc[i][j],Cc[i+1][j+1],Cc[i+1][j]],m)}}
function skyscraper(mb,x,z,w,d,h,col,ry){mb.box([x,h/2,z],[w,h,d],col,MAT.win,ry);if(h>60)mb.box([x,h+3,z],[w*0.6,6,d*0.6],col,MAT.win,ry);if(h>120)mb.prism([x,h+6,z],0.4,0.1,h*0.12,6,hx('#b0b4bc'))}
const unitBox=(()=>null)();let UB,USPH;
let UCYL;function initAssets(){const b=new MB();b.box([0,0,0],[1,1,1],[1,1,1]);UB=b.build();const s=new MB();s.ico([0,0,0],1,[1,1,1],0,1,[20,32]);USPH=s.build(0.3);const c=new MB();c.prism([0,-0.5,0],1,1,1,28,[1,1,1]);UCYL=c.build(0.7)}
// ---------- jumper (dynamic) ----------
const JC={hood:hx('#e2483a'),pant:hx('#2c3245'),shoe:hx('#f2f2f2'),skin:hx('#e0ad8f'),hair:hx('#3a2a22'),cap:hx('#1f6fd8')};
function jumperItems(base,yaw,crouch,arms,tilt,scale){scale=scale||1;const items=[];const B=M4.trs(base,yaw,tilt||0,0,scale);const lh=0.86*(1-crouch*0.3);
  const P=(mesh,t,s,col,rx,rz,piv)=>{let M=M4.mul(B,M4.trs(t,0,rx||0,rz||0,1));if(piv)M=M4.mul(M,M4.trs(piv,0,0,0,1));M=M4.mul(M,M4.trs([0,0,0],0,0,0,s));items.push({mesh,M,tint:col,tintAmt:1})};
  const kb=crouch*0.5;
  for(const sx of[-1,1]){P(UCYL,[sx*0.12,lh*0.5,0],[0.105,lh,0.115],JC.pant,kb*0.3,0);P(USPH,[sx*0.12,0.07,0.07],[0.12,0.075,0.2],JC.shoe)}
  P(UCYL,[0,lh+0.3,0],[0.27,0.6,0.17],JC.hood);P(USPH,[0,lh+0.6,0],[0.27,0.1,0.17],JC.hood);P(USPH,[0,lh+0.62,-0.13],[0.2,0.13,0.1],hx('#c83a2e'));
  P(USPH,[0,lh+0.86,0.01],[0.155,0.17,0.155],JC.skin);P(USPH,[0,lh+0.95,-0.01],[0.16,0.1,0.16],JC.hair);P(UB,[0,lh+0.995,0.03],[0.31,0.06,0.31],JC.cap);P(UB,[0,lh+0.975,0.2],[0.24,0.025,0.16],JC.cap);for(let q=items.length-3;q<items.length;q++)items[q].noShadow=true;
  P(USPH,[-0.055,lh+0.88,0.145],[0.025,0.03,0.015],[0.1,0.1,0.12]);P(USPH,[0.055,lh+0.88,0.145],[0.025,0.03,0.015],[0.1,0.1,0.12]);
  for(const sx of[-1,1]){const ang=sx*(0.18+arms*2.7);P(UCYL,[sx*0.33,lh+0.55,0],[0.075,0.6,0.075],JC.hood,0,ang,[0,-0.3,0]);P(USPH,[sx*0.33,lh+0.55,0],[0.065,0.07,0.065],JC.skin,0,ang,[0,-0.64,0])}
  return items}
function jumperItemsOld(base,yaw,crouch,arms,tilt,scale){scale=scale||1;const items=[];const B=M4.trs(base,yaw,tilt||0,0,scale);const lh=0.84*(1-crouch*0.35);
  const part=(t,s,col,rx,rz,piv)=>{let M=M4.mul(B,M4.trs(t,0,rx||0,rz||0,1));if(piv)M=M4.mul(M,M4.trs(piv,0,0,0,1));M=M4.mul(M,M4.trs([0,0,0],0,0,0,s));items.push({mesh:UB,M,tint:col,tintAmt:1})};
  for(const sx of[-1,1]){part([sx*0.12,lh/2,0],[0.2,lh,0.24],JC.pant);part([sx*0.12,0.06,0.05],[0.22,0.12,0.34],JC.shoe)}
  part([0,lh+0.32,0],[0.54,0.64,0.32],JC.hood);part([0,lh+0.82,0],[0.3,0.32,0.3],JC.skin);part([0,lh+0.98,0],[0.32,0.08,0.32],JC.hair);part([0,lh+1.0,0.12],[0.34,0.05,0.2],JC.cap);
  for(const sx of[-1,1]){const ang=sx*(0.15+arms*2.75);part([sx*0.36,lh+0.6,0],[0.16,0.66,0.16],JC.hood,0,ang,[0,-0.33,0])}
  return items}
