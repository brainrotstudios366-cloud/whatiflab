// ================= BLACK HOLE: overlays =================
let LASTVP=null;
function prj(p){return LASTVP&&p?project(LASTVP,p):null}
function popS(k){return k<0?0:k<0.16?0.6+0.4*easeOut(k/0.16)+Math.sin(k/0.16*Math.PI)*0.14:1}
function glowAt(p,r,col,a){if(r<=0||a<=0)return;ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,2*r,2*r);ctx.restore()}
function star4(x,y,s,a){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=a;ctx.translate(x,y);const g=ctx.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(200,230,255,0)');ctx.fillStyle=g;
  for(const r of[0,Math.PI/2]){ctx.save();ctx.rotate(r);ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*0.08,s,0);ctx.quadraticCurveTo(0,s*0.08,-s,0);ctx.fill();ctx.restore()}ctx.beginPath();ctx.arc(0,0,s*0.18,0,7);ctx.fill();ctx.restore()}
function fitS(s,maxW,size,font){ctx.font=`${font||'900'} ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;return w>maxW?size*maxW/w:size}
// captions: 1-3 words, big, center
const KEY=new Set(['BLACK','HOLE','GALAXY','SAGITTARIUS','A','MILLION','HEAVIER','TWENTYSIX','THOUSAND','EVENT','HORIZON','TWENTYFIVE','EIGHTEEN','SUNS','INSANELY','HOT','WEIRD','NEVER','FREEZE','FOREVER','RED','NOTHING','FLOAT','WAIT','WHAT','GENTLE','HUGE','NO','OUT','CENTER','SPAGHETTIFICATION','NOODLE','HARDER','NASA','TWELVE','POINT','EIGHT','SECONDS','NEUTRON','STAR','FOLLOW','SLOW'])
const GROUPS=[];{for(const c of VO){let g=null;for(const[w,a,b]of c.w){const cl=w.replace(/["]/g,'');if(!g||g.words.length>=2||g.len+cl.length>12||/[.,!?:]$/.test(g.words[g.words.length-1])){g={words:[],a,b,len:0};GROUPS.push(g)}g.words.push(cl);g.b=b;g.len+=cl.length+1}}}
function caption(t){for(let i=0;i<GROUPS.length;i++){const g=GROUPS[i];const nx=i+1<GROUPS.length?GROUPS[i+1].a:g.b+0.4;if(t>=g.a-0.05&&t<Math.min(nx,g.b+0.4)){
  const ws=g.words.map(w=>w.replace(/[.,:!?]+$/,'').replace(/\.\.\.$/,'').toUpperCase());let size=118;ctx.save();ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const sp=ctx.measureText(' ').width;const wd=ws.map(w=>ctx.measureText(w).width);const tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  const sc=Math.min(1,940/tot)*popS(t-g.a+0.05);ctx.translate(W/2,1270);ctx.scale(sc,sc);let x=-tot/2;ctx.textBaseline='middle';ctx.textAlign='left';ctx.lineJoin='round';
  ws.forEach((w,j)=>{const key=KEY.has(w.replace(/[^A-Z0-9]/g,''));ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(w,x,0);ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle=key?'#ffd84a':'#ffffff';ctx.fillText(w,x,0);ctx.shadowColor='transparent';x+=wd[j]+sp});ctx.restore();return}}}
function statCard(lab,val,col,k,y){if(k<=0)return;const s=popS(k);ctx.save();ctx.translate(W/2,y||330);ctx.scale(s,s);const vs=fitS(val,820,70);ctx.font=`900 ${vs}px Inter`;const w=Math.max(ctx.measureText(val).width,360)+90;ctx.fillStyle='rgba(8,10,30,0.82)';rrect(-w/2,-80,w,160,34);ctx.fill();ctx.strokeStyle='rgba(90,240,255,0.45)';ctx.lineWidth=3;rrect(-w/2,-80,w,160,34);ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='800 34px Inter';ctx.fillStyle='rgba(200,230,255,0.9)';ctx.fillText(lab,0,-40);ctx.font=`900 ${vs}px Inter, "Noto Color Emoji"`;ctx.fillStyle=col||'#ffd84a';ctx.fillText(val,0,22);ctx.restore()}
function tag(s,p,col,a){if(!p)return;ctx.save();ctx.globalAlpha=a;ctx.font='900 34px Inter';const w=ctx.measureText(s).width+40;ctx.fillStyle='rgba(8,10,30,0.8)';rrect(p[0]-w/2,p[1]-28,w,56,28);ctx.fill();ctx.fillStyle=col||'#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,p[0],p[1]+2);ctx.restore()}
const GST=[];{const r=rngG(5);for(let i=0;i<14000;i++){const arm=i%3,t=Math.pow(r(),0.8);const ang=arm/3*TAU2+t*7.5+(r()-0.5)*(0.22+t*0.18);const d=0.04+t*1.0;const sp=(r()-0.5)*0.05*(1-t*0.4);const y=(r()-0.5)*0.04*(1.2-t);
  GST.push([Math.cos(ang)*d+sp,y,Math.sin(ang)*d+sp*0.7,t<0.18?0:r()<0.12?2:1,0.5+r()*1.6,r()*6])}
  for(let i=0;i<3000;i++){const a=r()*TAU2,d=Math.pow(r(),1.6)*0.22;GST.push([Math.cos(a)*d,(r()-0.5)*0.07*(1-d*3),Math.sin(a)*d,0,0.5+r()*1.4,r()*6])}}
const GCOL=['rgba(255,226,170,0.75)','rgba(170,200,255,0.7)','rgba(255,150,210,0.75)'];
function drawGalaxy(t){const rot=t*0.04,c=Math.cos(rot),s=Math.sin(rot),S=26;ctx.save();ctx.globalCompositeOperation='lighter';
  const ce=prj([0,0,0]);if(ce){glowAt(ce,330,'255,200,140',0.5);glowAt(ce,110,'255,240,210',0.85)}
  for(let i=0;i<GST.length;i+=23){const g=GST[i];if(g[3]===0)continue;const x=(g[0]*c-g[2]*s)*S,z=(g[0]*s+g[2]*c)*S;const q=prj([x,g[1]*S,z]);if(q)glowAt(q,clamp(900/q[2],12,60),g[3]===2?'255,120,200':'120,160,255',0.13)}
  for(let b=0;b<3;b++){ctx.fillStyle=GCOL[b];for(const g of GST){if(g[3]!==b)continue;const x=(g[0]*c-g[2]*s)*S,z=(g[0]*s+g[2]*c)*S;const q=prj([x,g[1]*S,z]);if(!q||q[0]<-5||q[0]>W+5||q[1]<-5||q[1]>H+5)continue;const sz=clamp(g[4]*60/q[2],1,5);ctx.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz)}}
  ctx.restore()}
function emojiAt(s,x,y,size,a){ctx.save();ctx.globalAlpha=a;ctx.font=`${size}px "Noto Color Emoji"`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore()}
