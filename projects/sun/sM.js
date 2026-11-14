// ================= SUN VANISHES: meshes =================
const SLS=V.norm([1,0.22,0.32]); // Earth-local direction to the Sun (day side = +x)
function sLand(n){const a=fbm(n[0]*1.9+3.1,n[1]*1.9+n[2]*0.9,6),b=fbm(n[2]*1.9+7.3,n[1]*1.9-n[0]*0.9,6);return (a+b)*0.5}
const sst=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
function sEarthCol(n){const v=sLand(n);const lat=Math.abs(n[1]);
  const deep=clamp((0.5-v)/0.14,0,1);const ocean=mix3(HC('#2c8ad4'),HC('#0a2766'),Math.pow(deep,0.55));
  const dry=clamp((fbm(n[0]*3+11,n[2]*3+n[1],3)-0.45)*3+(lat<0.35?0.3:-0.25),0,1);const hi=clamp((v-0.57)*6,0,1);
  let land=mix3(HC('#3f8a3c'),HC('#cfa86a'),dry*0.85);land=mix3(land,HC('#7a6644'),hi*0.45);
  let c=mix3(ocean,land,sst(0.497,0.507,v));const ice=sst(0.8,0.88,lat+(v-0.5)*0.4);c=mix3(c,[0.93,0.95,1],ice);
  const cl=sst(0.52,0.62,sCloud(n))*0.85;return mix3(c,[1,1,1],cl)}
const SEARTH=um(m=>sph(m,1,128,256,sEarthCol,0),0.3);
function sCloud(n){return (fbm(n[0]*4.2+20,n[1]*4.2+n[2]*2.1,5)+fbm(n[2]*4.2+3,n[1]*4.2-n[0]*2.1,5))*0.5}

// city lights split by local day/night side
function sLights(night){return um(m=>{const r=rngG(night?77:78);let k=0;for(let i=0;i<120000&&k<9000;i++){const u=r()*2-1,a=r()*TAU2,s=Math.sqrt(1-u*u);const n=[s*Math.cos(a),u,s*Math.sin(a)];
  if(sLand(n)<0.512||Math.abs(n[1])>0.72)continue;if(fbm(n[0]*7+2,n[2]*7+n[1]*3,3)<0.4)continue;const d=V.dot(n,SLS);if(night?d>-0.04:d<=-0.04)continue;k++;
  const p=V.sc(n,1.004);const col=mix3([1,0.62,0.22],[1,0.88,0.55],r());m.ico(p,0.0022+r()*0.0035,col,MAT.emis,1,[2,4])}})}
const SLIGHTSN=sLights(true),SLIGHTSD=sLights(false);
const SMOONM=um(m=>sph(m,1,48,96,n=>{const v=fbm(n[0]*4+1,n[2]*4+n[1]*2,4);const mare=fbm(n[0]*1.4+9,n[1]*1.4+n[2],3);let c=mix3([0.52,0.52,0.55],[0.78,0.77,0.76],v);if(mare>0.55)c=V.sc(c,0.72);return c},0),0.3);
const SMARS=um(m=>sph(m,1,28,48,n=>mix3(HC('#b5532d'),HC('#e0884e'),fbm(n[0]*3+4,n[2]*3+n[1],3)),0),0.3);
const SJUP=um(m=>sph(m,1,32,56,n=>{const b=0.5+0.5*Math.sin(n[1]*16+fbm(n[0]*2,n[2]*2,3)*3);return mix3(HC('#b98a5e'),HC('#f1dcc0'),b)},0),0.3);
const SSAT=um(m=>sph(m,1,28,48,n=>mix3(HC('#cfb07a'),HC('#f3e2b8'),0.5+0.5*Math.sin(n[1]*12)),0),0.3);
const SSATRING=um(m=>annulusS(m,1.35,2.25,96,6,(r)=>V.sc(HC('#e8d5a8'),0.55+0.4*Math.sin(r*22)),0));
const SNEPM=um(m=>sph(m,1,28,48,n=>mix3(HC('#2a5ad0'),HC('#5f9cff'),0.5+0.5*Math.sin(n[1]*9+fbm(n[0]*2,n[2]*2,2)*2)),0),0.3);
function annulusS(m,r0,r1,NA,NR,colFn,mat){for(let i=0;i<NA;i++)for(let j=0;j<NR;j++){const a0=i/NA*TAU2,a1=(i+1)/NA*TAU2,q0=r0+(r1-r0)*j/NR,q1=r0+(r1-r0)*(j+1)/NR;
  const P=(r,a)=>[Math.cos(a)*r,0,Math.sin(a)*r];m.quad(P(q0,a0),P(q1,a0),P(q1,a1),P(q0,a1),[colFn(q0),colFn(q1),colFn(q1),colFn(q0)],mat)}}
// sun surface: emissive granulation
const SSUNS=um(m=>sph(m,1,48,96,n=>{const g=fbm(n[0]*7+n[1]*2,n[2]*7-n[1]*3,4);const s=fbm(n[0]*2.2+5,n[2]*2.2+n[1]*1.6,3);let c=mix3(HC('#ff8a1a'),HC('#fff1b0'),clamp(g*1.4-0.15,0,1));if(s>0.66)c=mix3(c,HC('#c24a0a'),0.5);return c},MAT.emis));
// solar panel (1.7 x 1.0, tilted toward +z sky), legs
const SPANEL=um(m=>{const fr=[0.55,0.57,0.62];m.box([0,0,0],[1.72,0.05,1.04],fr);for(let i=0;i<6;i++)for(let j=0;j<4;j++){const x=-0.71+i*0.284,z=-0.39+j*0.26;m.box([x,0.03,z],[0.26,0.02,0.24],HC('#2a4590'),0,0,HC('#3c62c0'))}},0);
const SPLEGS=um(m=>{const c=[0.4,0.42,0.46];tube(m,[-0.6,-0.9,0],[-0.6,0,0],0.035,0.035,c,6);tube(m,[0.6,-0.9,0],[0.6,0,0],0.035,0.035,c,6)});
const SLED=um(m=>m.ico([0,0,0],1,[1,1,1],MAT.emis,1,[6,8]));
const SGROUNDM=um(m=>{const r=rngG(3);for(let i=-20;i<20;i++)for(let j=-30;j<8;j++){const c=mix3(HC('#3b4a2a'),HC('#56653a'),r());m.quad([i*2,0,j*2],[i*2,0,j*2+2],[i*2+2,0,j*2+2],[i*2+2,0,j*2],c,0)}});
const SPROBE=um(m=>{const g=[0.75,0.76,0.8];m.box([0,0,0],[0.5,0.25,0.5],[0.55,0.5,0.4]);for(let i=0;i<24;i++){const a=i/24*TAU2,b=(i+1)/24*TAU2;m.tri([0,0.25,0],[Math.cos(b)*0.9,0.45,Math.sin(b)*0.9],[Math.cos(a)*0.9,0.45,Math.sin(a)*0.9],g)}tube(m,[0,0,0],[1.8,-0.2,0],0.02,0.02,g,5);tube(m,[0,0,0],[-1.2,-0.4,0.6],0.02,0.02,g,5)});
const SMOONE=um(m=>sph(m,1,40,80,n=>{const v=fbm(n[0]*4+1,n[1]*4+n[2]*2,4);const mare=fbm(n[0]*1.6+9,n[1]*1.6+n[2],3);let c=mix3([0.66,0.66,0.7],[0.95,0.94,0.92],v);if(mare>0.55)c=V.sc(c,0.7);return V.sc(c,0.45+0.6*Math.pow(Math.max(0,n[2]),0.5))},MAT.emis));
