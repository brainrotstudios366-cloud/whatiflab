function envT(){return{sun:[0.82,0.26,0.5],sunCol:hx('#ffe0b8'),sky:hx('#bcd4ec'),gnd:hx('#7a8a5a'),fog:hx('#f2d2b2'),fogD:900,zen:hx('#5a86c8'),hor:hx('#ffd0a8'),stars:0,night:0,emis:1.2,ground:1,sunSize:3,fillD:[-0.5,0.4,-0.7],fillC:[0.3,0.32,0.36]}}
function frame(fi){const t=fi/FPS;const items=[{mesh:WORLD},{mesh:SEA},{mesh:MOUNT}];
  const v=Math.floor(fi)%6;
  quad('cat',{pos:[-0.45,0,0],yaw:0.5,t,eyes:{lid:0.2,look:[0.3,0]},tail:{up:0.6,curl:0.8}},items);
  quad('cat',{pos:[0.05,0,0.1],yaw:-0.3,sit:1,t,eyes:{lid:0.45},tail:{up:-0.05,curl:0.2,side:1},tongue:1},items);
  quad('cat',{pos:[0.6,0,0],yaw:-1.2,arch:1,puff:1,ears:1,mouth:1,t,eyes:{glow:1},tail:{up:1,curl:0.1}},items);
  quad('dog',{pos:[-0.5,0,1.0],yaw:-0.3,gait:{ph:0.3,amp:0.3},col:DOGCOL[1],mouth:0.6,tongue:1,eyes:{brow:0.4}},items);
  quad('bear',{pos:[1.4,0,1.6],yaw:-0.6,sc:2.2,mouth:1,eyes:{brow:0.5}},items);
  renderGL(envT(),{eye:[0.9,1.1,4.6],at:[0.6,0.5,1.0],fov:0.9,near:0.03,far:14000},{center:[0,0,0],radius:3},items,t);
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(glc,0,0)}
window.frame=frame;window.NFR=DUR*FPS;
