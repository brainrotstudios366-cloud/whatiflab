function drawCaptionA(t){for(const[a,b,s]of capsA){if(t<a||t>=b)continue;const k=t-a;const sc=k<0.18?0.6+0.4*ease(k/0.18)+Math.sin(k/0.18*Math.PI)*0.12:1;const al=Math.min(1,k/0.1,(b-t)/0.12);const size=fitSize(s,920,56);
  ctx.save();ctx.globalAlpha=al;ctx.translate(W/2,330);ctx.scale(sc,sc);ctx.font=`900 ${size}px Inter, "Noto Color Emoji"`;const w=ctx.measureText(s).width;ctx.fillStyle='rgba(15,10,30,0.72)';rrect(-w/2-34,-size*0.95,w+68,size*1.9,size*0.95);ctx.fill();txt(s,0,4,size,'#ffffff','center',900,false);ctx.restore()}}
function overlaysA(t){ctx=ctx0;const vg=ctx.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.5,H*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  const flash=(t0,a,d,col)=>{const k=t-t0;if(k>=0&&k<d){ctx.fillStyle=`rgba(${col||'255,255,255'},${a*(1-k/d)})`;ctx.fillRect(0,0,W,H)}};
  CUTS.forEach(tt=>flash(tt,0.45,0.22));(typeof FLASHES!=='undefined'?FLASHES:[]).forEach(f=>flash(...f));
  if(t<3.2)drawTitleA(t);drawStatsA(t);if(t<TA.endc)drawCaptionA(t);drawEndA(t);{const k=LOOPA-t;if(k>0&&k<0.2){ctx.fillStyle=`rgba(255,255,255,${0.6*(1-k/0.2)})`;ctx.fillRect(0,0,W,H)}}}
function frame(fi){const tf=fi/FPS;const t0=tf>=LOOPA?tf-LOOPA:tf;for(let k=0;k<SUB;k++){const t=t0+k/(FPS*SUB);ctx=scn.getContext('2d');ctx.setTransform(1,0,0,1,0,0);renderSceneA(t);actx.globalAlpha=1/(k+1);actx.drawImage(scn,0,0)}
  ctx0.globalAlpha=1;ctx0.drawImage(acc,0,0);overlaysA(t0)}
window.frame=frame;window.NFR=DURA*FPS;
