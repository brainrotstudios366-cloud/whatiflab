// ================= BLACK HOLE: meshes =================
function diskCol(r,a,r0,r1){const k=clamp((r-r0)/(r1-r0),0,1);let c=k<0.18?mix3([1,0.97,0.88],[1,0.78,0.4],k/0.18):k<0.55?mix3([1,0.78,0.4],[1,0.42,0.1],(k-0.18)/0.37):mix3([1,0.42,0.1],[0.35,0.06,0.02],(k-0.55)/0.45);
  const n=0.55+0.45*fbm(a*1.3+r*2.2,r*5.0,3)*(1+0.3*Math.sin(a*9+r*14));return V.sc(c,n*Math.pow(1-k,0.6))}
function annulus(m,r0,r1,NA,NR,colFn,plane){for(let i=0;i<NA;i++)for(let j=0;j<NR;j++){const a0=i/NA*TAU2,a1=(i+1)/NA*TAU2,q0=r0+(r1-r0)*j/NR,q1=r0+(r1-r0)*(j+1)/NR;
  const P=(r,a)=>plane==='xy'?[Math.cos(a)*r,Math.sin(a)*r,0]:[Math.cos(a)*r,0,Math.sin(a)*r];m.quad(P(q0,a0),P(q1,a0),P(q1,a1),P(q0,a1),[colFn(q0,a0),colFn(q1,a0),colFn(q1,a1),colFn(q0,a1)],MAT.emis)}}
const BHDISK=um(m=>annulus(m,1.75,6.5,180,26,(r,a)=>diskCol(r,a,1.75,6.5),'xz'));
const BHLENS=um(m=>annulus(m,1.08,2.5,140,14,(r,a)=>{const top=0.55+0.45*Math.max(0,Math.sin(a));return V.sc(diskCol(1.75+(r-1.08)*3.4,a*1.7,1.75,6.5),top*0.9)},'xy'));
const BHPR=um(m=>annulus(m,1.0,1.075,160,2,(r,a)=>V.sc([1,0.86,0.6],0.9+0.1*Math.sin(a*3)),'xy'));
// astronaut (~1.9 tall, facing +z)
const ASTRO=um(m=>{const suit=[0.93,0.94,0.96],sh=[0.78,0.8,0.84],dk=[0.25,0.27,0.32];
  blob(m,[0,0.05,0],0.36,p=>mix3(sh,suit,clamp(p[1]+0.6,0,1)),2,1.35,[12,18]);m.box([0,0.12,-0.3],[0.5,0.62,0.24],sh,0,0,suit);
  m.box([0,0.2,0.33],[0.28,0.2,0.06],dk);m.ico([-0.07,0.22,0.37],0.03,[0.3,1,1],MAT.emis,1,[4,6]);m.ico([0.06,0.22,0.37],0.03,[1,0.3,0.4],MAT.emis,1,[4,6]);m.ico([0.0,0.15,0.37],0.025,[1,0.85,0.3],MAT.emis,1,[4,6]);
  m.ico([0,0.72,0],0.33,suit,0,1,[16,24]);
  for(const s of[-1,1]){tube(m,[s*0.3,0.32,0],[s*0.62,0.48,0.06],0.11,0.1,suit,10);tube(m,[s*0.62,0.48,0.06],[s*0.9,0.66,0.14],0.1,0.09,suit,10);m.ico([s*0.95,0.7,0.16],0.11,sh,0,1,[8,10]);m.box([s*0.62,0.48,0.06],[0.2,0.06,0.2],sh);
    tube(m,[s*0.15,-0.38,0],[s*0.3,-0.8,0.05],0.14,0.12,suit,10);tube(m,[s*0.3,-0.8,0.05],[s*0.42,-1.15,0.02],0.12,0.11,suit,10);m.box([s*0.44,-1.2,0.08],[0.22,0.16,0.32],dk)}},0.45);
const VISOR=um(m=>sph(m,1,14,20,n=>mix3([1,0.62,0.18],[1,0.95,0.7],clamp(n[1]*0.6+n[0]*0.3+0.4,0,1)),MAT.emis,c=>c[2]<0.2),0.3);
