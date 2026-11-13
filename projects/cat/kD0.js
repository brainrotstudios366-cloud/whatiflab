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
