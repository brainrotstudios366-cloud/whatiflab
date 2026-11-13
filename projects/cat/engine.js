
// ===================== MINI WEBGL ENGINE =====================
const W=1080,H=1920;
const glc=document.createElement('canvas');glc.width=W;glc.height=H;
const gl=glc.getContext('webgl2',{antialias:true,preserveDrawingBuffer:true,premultipliedAlpha:false});
// ---------- math ----------
const M4={
  id:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
  mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o},
  persp(fy,asp,n,f){const t=1/Math.tan(fy/2);const o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o},
  ortho(l,r,b,t,n,f){const o=M4.id();o[0]=2/(r-l);o[5]=2/(t-b);o[10]=-2/(f-n);o[12]=-(r+l)/(r-l);o[13]=-(t+b)/(t-b);o[14]=-(f+n)/(f-n);return o},
  look(e,c,u){const z=V.norm(V.sub(e,c)),x=V.norm(V.cross(u,z)),y=V.cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-V.dot(x,e),-V.dot(y,e),-V.dot(z,e),1])},
  trs(t,ry,rx,rz,s){// translate * Ry * Rx * Rz * scale
    const cy=Math.cos(ry||0),sy=Math.sin(ry||0),cx=Math.cos(rx||0),sx=Math.sin(rx||0),cz=Math.cos(rz||0),sz=Math.sin(rz||0);
    const Ry=[cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1],Rx=[1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1],Rz=[cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1];
    let m=M4.mul(M4.mul(new Float32Array(Ry),new Float32Array(Rx)),new Float32Array(Rz));const S=s==null?[1,1,1]:(typeof s==='number'?[s,s,s]:s);
    for(let i=0;i<3;i++){m[i]*=S[0];m[4+i]*=S[1];m[8+i]*=S[2]}m[12]=t[0];m[13]=t[1];m[14]=t[2];return m},
  inv(m){const a=m,o=new Float32Array(16);const b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6],b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14];
    let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;d=1/d;
    o[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*d;o[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*d;o[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*d;o[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*d;o[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*d;o[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*d;o[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*d;o[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*d;o[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*d;o[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*d;o[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*d;o[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*d;o[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*d;o[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*d;o[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*d;o[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*d;return o}};
const V={add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],sc:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
  cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]},len:a=>Math.hypot(a[0],a[1],a[2])};
function rngG(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hx(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]}
function hsh(a,b){let h=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi;const u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);const a=hsh(xi,zi),b=hsh(xi+1,zi),c=hsh(xi,zi+1),d=hsh(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,z,o){let s=0,a=0.5,f=1;for(let i=0;i<(o||4);i++){s+=a*vnoise(x*f,z*f);f*=2;a*=0.5}return s}
// materials (alpha channel): 0 plain, 1 windows, 2 water, 3 emissive, 4 snow/sparkle, 5 glass
const MAT={plain:0.0,win:0.2,water:0.4,emis:0.6,glass:0.8};
// ---------- mesh builder ----------
let ICO_RES=[9,14];
function smoothNormals(d,cth){const map=new Map();const n=d.length/10;const key=i=>Math.round(d[i*10]*500)+','+Math.round(d[i*10+1]*500)+','+Math.round(d[i*10+2]*500);
  for(let i=0;i<n;i++){const k=key(i);let g=map.get(k);if(!g){g=[];map.set(k,g)}g.push(i)}const out=new Float32Array(n*3);
  for(const g of map.values())for(const i of g){let x=0,y=0,z=0;const nx=d[i*10+3],ny=d[i*10+4],nz=d[i*10+5];for(const j of g){const mx=d[j*10+3],my=d[j*10+4],mz=d[j*10+5];if(nx*mx+ny*my+nz*mz>=cth){x+=mx;y+=my;z+=mz}}const l=Math.hypot(x,y,z)||1;out[i*3]=x/l;out[i*3+1]=y/l;out[i*3+2]=z/l}
  for(let i=0;i<n;i++){d[i*10+3]=out[i*3];d[i*10+4]=out[i*3+1];d[i*10+5]=out[i*3+2]}}
class MB{constructor(){this.d=[]}
  v(p,n,c,m){this.d.push(p[0],p[1],p[2],n[0],n[1],n[2],c[0],c[1],c[2],m||0)}
  tri(a,b,c,col,m){const n=V.norm(V.cross(V.sub(b,a),V.sub(c,a)));if(Array.isArray(col[0])){this.v(a,n,col[0],m);this.v(b,n,col[1],m);this.v(c,n,col[2],m)}else{this.v(a,n,col,m);this.v(b,n,col,m);this.v(c,n,col,m)}}
  quad(a,b,c,d,col,m){if(Array.isArray(col[0])){this.tri(a,b,c,[col[0],col[1],col[2]],m);this.tri(a,c,d,[col[0],col[2],col[3]],m)}else{this.tri(a,b,c,col,m);this.tri(a,c,d,col,m)}}
  box(c,s,col,m,ry,colTop){const hx_=s[0]/2,hy=s[1]/2,hz=s[2]/2;const cs=Math.cos(ry||0),sn=Math.sin(ry||0);const P=(x,y,z)=>[c[0]+x*cs+z*sn,c[1]+y,c[2]-x*sn+z*cs];
    const v=[P(-hx_,-hy,-hz),P(hx_,-hy,-hz),P(hx_,-hy,hz),P(-hx_,-hy,hz),P(-hx_,hy,-hz),P(hx_,hy,-hz),P(hx_,hy,hz),P(-hx_,hy,hz)];const ct=colTop||col;
    this.quad(v[4],v[7],v[6],v[5],ct,m===MAT.win?0:m);this.quad(v[0],v[1],v[2],v[3],col,m===MAT.win?0:m);this.quad(v[1],v[5],v[6],v[2],col,m);this.quad(v[0],v[3],v[7],v[4],col,m);this.quad(v[3],v[2],v[6],v[7],col,m);this.quad(v[0],v[4],v[5],v[1],col,m)}
  prism(c,r0,r1,h,seg,col,m,rot){const top=[],bot=[];for(let i=0;i<seg;i++){const a=i/seg*Math.PI*2+(rot||0);bot.push([c[0]+Math.cos(a)*r0,c[1],c[2]+Math.sin(a)*r0]);top.push([c[0]+Math.cos(a)*r1,c[1]+h,c[2]+Math.sin(a)*r1])}
    for(let i=0;i<seg;i++){const j=(i+1)%seg;if(r1>0.0001)this.quad(bot[i],top[i],top[j],bot[j],col,m);else this.tri(bot[i],[c[0],c[1]+h,c[2]],bot[j],col,m)}
    if(r1>0.0001){const tc=[c[0],c[1]+h,c[2]];for(let i=0;i<seg;i++)this.tri(tc,top[(i+1)%seg],top[i],col,m)}}
  ico(c,r,col,m,sq,res){
    const la=res?res[0]:(ICO_RES[0]),lo=res?res[1]:(ICO_RES[1]);const P=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*Math.PI*2;return[c[0]+Math.sin(th)*Math.cos(ph)*r,c[1]+Math.cos(th)*r*(sq||1),c[2]+Math.sin(th)*Math.sin(ph)*r]};
    for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=P(i,j),b=P(i+1,j),cc=P(i+1,j+1),d=P(i,j+1);if(i===0)this.tri(a,cc,b,col,m);else if(i===la-1)this.tri(a,d,b,col,m);else this.quad(a,d,cc,b,col,m)}}
  build(smooth){if(smooth)smoothNormals(this.d,smooth===true?0.6:smooth);const a=new Float32Array(this.d);const vao=gl.createVertexArray();gl.bindVertexArray(vao);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,a,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,40,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,40,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,4,gl.FLOAT,false,40,24);
    gl.bindVertexArray(null);return{vao,n:a.length/10,raw:a}}}
// ---------- shaders ----------
function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
function prog(vs,fs){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(p,0,'aP');gl.bindAttribLocation(p,1,'aN');gl.bindAttribLocation(p,2,'aC');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
  const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const inf=gl.getActiveUniform(p,i);u[inf.name]=gl.getUniformLocation(p,inf.name)}return{p,u}}
const VS=`#version 300 es
in vec3 aP;in vec3 aN;in vec4 aC;uniform mat4 uM,uVP,uLVP;uniform float uNO;out vec3 vN,vW;out vec4 vC,vL;
void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=mat3(uM)*aN;vC=aC;vL=uLVP*vec4(w.xyz+normalize(vN)*uNO,1.);gl_Position=uVP*w;}`;
const FS=`#version 300 es
precision highp float;in vec3 vN,vW;in vec4 vC,vL;uniform vec3 uSun,uSunCol,uSky,uGnd,uFog,uCam;uniform float uFogD,uTime,uAlpha,uNight,uEmisBoost;uniform vec3 uTint;uniform float uTintAmt;uniform vec3 uFD,uFC;
uniform highp sampler2DShadow uSM;uniform float uSMsz;out vec4 o;
float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float shadowF(){vec3 p=vL.xyz/vL.w*0.5+0.5;if(p.x<0.||p.x>1.||p.y<0.||p.y>1.||p.z>1.)return 1.;float s=0.;for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++)s+=texture(uSM,vec3(p.xy+vec2(i,j)*1.5/uSMsz,p.z-0.0008));return s/9.;}
void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;float m=vC.a;vec3 base=mix(vC.rgb,uTint,uTintAmt);vec3 vd=normalize(uCam-vW);float dist=length(uCam-vW);
 if(m>0.7){o=vec4(base,uAlpha);return;}
 float sh_=shadowF();float diff=max(dot(n,uSun),0.)*sh_;vec3 hemi=mix(uGnd,uSky,n.y*0.5+0.5);float ao=0.75+0.25*clamp(n.y*0.5+0.5,0.,1.);vec3 col=base*(hemi*0.62*ao+uSunCol*diff*0.95+uFC*max(dot(n,normalize(uFD+vec3(0.,0.001,0.))),0.));
 vec3 hv=normalize(uSun+vd);col+=uSunCol*pow(max(dot(n,hv),0.),48.)*0.18*sh_;col+=uSky*pow(1.-max(dot(n,vd),0.),3.)*0.12;
 if(m>0.1&&m<0.3&&abs(n.y)<0.5){float u=abs(n.x)>abs(n.z)?vW.z:vW.x;vec2 g=vec2(u/2.4,vW.y/3.1);vec2 cell=floor(g);vec2 f=fract(g);float win=step(0.18,f.x)*step(f.x,0.82)*step(0.22,f.y)*step(f.y,0.82);
   float lit=step(0.45+0.25*(1.-uNight),h21(cell));vec3 glass=mix(vec3(0.16,0.2,0.28),vec3(0.55,0.68,0.85),pow(max(0.,1.-abs(dot(n,vd))),2.)*0.7)+uSunCol*pow(max(dot(reflect(-uSun,n),vd),0.),30.)*0.6;
   vec3 wl=mix(glass*hemi*1.2,vec3(1.,0.82,0.5)*1.25*uEmisBoost,lit*(0.3+0.7*uNight));col=mix(col,wl,win);}
 if(m>0.3&&m<0.5){vec3 wn=normalize(vec3(sin(vW.x*0.35+uTime*1.3)*0.06+sin(vW.z*0.6-uTime*1.7)*0.04,1.,cos(vW.z*0.3+uTime)*0.06+sin((vW.x+vW.z)*0.9+uTime*2.3)*0.03));
   float fr=pow(1.-max(dot(wn,vd),0.),3.);vec3 refl=mix(uSky*1.1,uFog,0.3);col=mix(base*(hemi*0.7+uSunCol*0.25)*(0.4+0.6*sh_),refl,0.25+0.6*fr)+uSunCol*pow(max(dot(reflect(-uSun,wn),vd),0.),120.)*1.6*sh_;}
 if(m>0.5&&m<0.7){col=base*uEmisBoost;}
 float fg=1.-exp(-dist/uFogD);col=mix(col,uFog,clamp(fg,0.,1.));o=vec4(col,uAlpha);}`;
const SVS=`#version 300 es
in vec3 aP;uniform mat4 uM,uLVP;void main(){gl_Position=uLVP*uM*vec4(aP,1.);}`;
const SFS=`#version 300 es
precision highp float;out vec4 o;void main(){o=vec4(1.);}`;
const SKYVS=`#version 300 es
in vec3 aP;out vec2 vU;void main(){vU=aP.xy;gl_Position=vec4(aP.xy,0.9999,1.);}`;
const SKYFS=`#version 300 es
precision highp float;in vec2 vU;uniform mat4 uIVP;uniform vec3 uZen,uHor,uSun,uSunCol,uCam;uniform float uStars,uSunSize,uGround;uniform vec3 uGndCol;out vec4 o;
uniform float uNeb,uShR,uShI,uShW,uFill;uniform vec3 uShC,uShC2;
float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,45.164)))*43758.5453);}
float h3(vec3 p){p=fract(p*0.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fb(vec3 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n3(p);p=p*2.07+vec3(1.3,0.7,2.1);a*=.5;}return s;}
void main(){vec4 a=uIVP*vec4(vU,1.,1.);vec3 d=normalize(a.xyz/a.w-uCam);float y=d.y;vec3 c=mix(uHor,uZen,pow(clamp(y,0.,1.),0.55));
 if(y<0.&&uGround>0.5)c=mix(uHor,uGndCol,clamp(-y*6.,0.,1.));
 float sd=max(dot(d,uSun),0.);c+=uSunCol*(pow(sd,800./uSunSize)*4.+pow(sd,12.)*0.25+pow(sd,3.)*0.08);
 if(uStars>0.){vec3 q=floor(d*420.);float s=step(0.9965,h(q));c+=vec3(s)*uStars*(0.5+0.5*h(q+1.));vec3 q2=floor(d*160.);c+=vec3(0.8,0.85,1.)*step(0.9992,h(q2+7.))*uStars*1.5;}
 if(uNeb>0.){float f=fb(d*2.3+vec3(3.1,1.7,0.4));float g=fb(d*5.1+vec3(f*2.2,0.,f));float m=smoothstep(0.42,0.8,f*0.55+g*0.6);
  vec3 nc=mix(vec3(0.30,0.10,0.50),vec3(0.85,0.25,0.50),smoothstep(0.35,0.75,g))*m+vec3(0.08,0.22,0.55)*smoothstep(0.55,0.85,g)*(1.-m)*0.8;c+=nc*uNeb*0.6;}
 if(uShI>0.){vec3 sdir=normalize(uSun);float ang=acos(clamp(dot(d,sdir),-1.,1.));float nn=fb(d*7.5+vec3(5.,2.,1.));float r=uShR*(0.82+0.36*nn);
  float shl=exp(-pow((ang-r)/max(uShW*r,0.002),2.));float fill=(1.-smoothstep(r*0.25,r,ang))*uFill;vec3 col=mix(uShC2,uShC,smoothstep(0.35,0.75,nn));
  c+=col*(shl*(0.5+0.9*nn)+fill*(0.3+0.7*nn*nn))*uShI;}
 o=vec4(c,1.);}`;
let P_MAIN,P_SH,P_SKY,skyVao,smTex,smFb;const SMSZ=2048;
function initGL(){P_MAIN=prog(VS,FS);P_SH=prog(SVS,SFS);P_SKY=prog(SKYVS,SKYFS);
  skyVao=gl.createVertexArray();gl.bindVertexArray(skyVao);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,12,0);gl.bindVertexArray(null);
  smTex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,smTex);gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT32F,SMSZ,SMSZ);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  smFb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,smFb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,smTex,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null)}
// ---------- render a frame ----------
// env:{sun,sunCol,sky,gnd,fog,fogD,zen,hor,stars,sunSize,night,emis,ground,gndCol}
// cam:{eye,at,up,fov,near,far}; shadow:{center,radius,depth} or null; items:[{mesh,M,alpha,tint,tintAmt,noShadow}]
function renderGL(env,cam,shadowCfg,items,time,opt){opt=opt||{};
  const VP=M4.mul(M4.persp(cam.fov||0.95,W/H,cam.near||0.3,cam.far||20000),M4.look(cam.eye,cam.at,cam.up||[0,1,0]));
  let LVP=M4.id();
  if(shadowCfg){const c=shadowCfg.center,r=shadowCfg.radius,sd=V.norm(env.sun);const eye=V.add(c,V.sc(sd,r*2));LVP=M4.mul(M4.ortho(-r,r,-r,r,0.1,r*4),M4.look(eye,c,Math.abs(sd[1])>0.99?[1,0,0]:[0,1,0]));
    gl.bindFramebuffer(gl.FRAMEBUFFER,smFb);gl.viewport(0,0,SMSZ,SMSZ);gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(P_SH.p);gl.uniformMatrix4fv(P_SH.u.uLVP,false,LVP);
    gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(2,4);for(const it of items){if(it.noShadow||(it.alpha!=null&&it.alpha<1))continue;gl.uniformMatrix4fv(P_SH.u.uM,false,it.M||ID4);gl.bindVertexArray(it.mesh.vao);gl.drawArrays(gl.TRIANGLES,0,it.mesh.n)}gl.disable(gl.POLYGON_OFFSET_FILL)}
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.clearColor(0,0,0,1);gl.clear(opt.noClear?gl.DEPTH_BUFFER_BIT:(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT));
  // sky
  gl.disable(gl.DEPTH_TEST);if(!opt.noSky){gl.useProgram(P_SKY.p);const u=P_SKY.u;gl.uniformMatrix4fv(u.uIVP,false,M4.inv(VP));gl.uniform3fv(u.uZen,env.zen);gl.uniform3fv(u.uHor,env.hor);gl.uniform3fv(u.uSun,V.norm(env.sun));gl.uniform3fv(u.uSunCol,env.sunCol);gl.uniform3fv(u.uCam,cam.eye);
  gl.uniform1f(u.uStars,env.stars||0);gl.uniform1f(u.uSunSize,env.sunSize||1);gl.uniform1f(u.uGround,env.ground?1:0);gl.uniform3fv(u.uGndCol,env.gndCol||env.fog);gl.uniform1f(u.uNeb,env.neb||0);gl.uniform1f(u.uShR,env.shR||0);gl.uniform1f(u.uShI,env.shI||0);gl.uniform1f(u.uShW,env.shW||0.15);gl.uniform1f(u.uFill,env.fill||0);gl.uniform3fv(u.uShC,env.shC||[1,1,1]);gl.uniform3fv(u.uShC2,env.shC2||[1,0.4,0.6]);gl.bindVertexArray(skyVao);gl.drawArrays(gl.TRIANGLES,0,6);}
  gl.enable(gl.DEPTH_TEST);gl.useProgram(P_MAIN.p);const m=P_MAIN.u;gl.uniformMatrix4fv(m.uVP,false,VP);gl.uniformMatrix4fv(m.uLVP,false,LVP);gl.uniform3fv(m.uSun,V.norm(env.sun));gl.uniform3fv(m.uSunCol,env.sunCol);gl.uniform3fv(m.uSky,env.sky);gl.uniform3fv(m.uGnd,env.gnd);gl.uniform3fv(m.uFog,env.fog);gl.uniform3fv(m.uCam,cam.eye);
  gl.uniform1f(m.uFogD,env.fogD);gl.uniform3fv(m.uFD,env.fillD||[0,1,0]);gl.uniform3fv(m.uFC,env.fillC||[0,0,0]);gl.uniform1f(m.uTime,time);gl.uniform1f(m.uNight,env.night||0);gl.uniform1f(m.uEmisBoost,env.emis||1);gl.uniform1f(m.uSMsz,SMSZ);gl.uniform1f(m.uNO,shadowCfg?shadowCfg.radius/500:0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,smTex);gl.uniform1i(m.uSM,0);
  if(!shadowCfg){/* bind empty: everything lit */}
  const opaque=items.filter(it=>it.alpha==null||it.alpha>=1),trans=items.filter(it=>it.alpha!=null&&it.alpha<1);
  gl.disable(gl.BLEND);for(const it of opaque)drawItem(it,m,shadowCfg);
  gl.enable(gl.BLEND);gl.depthMask(false);for(const it of trans){if(it.add)gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE,gl.ZERO,gl.ONE);else gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ZERO,gl.ONE);drawItem(it,m,shadowCfg)}gl.depthMask(true);gl.disable(gl.BLEND);
  return VP}
const ID4=M4.id();
function drawItem(it,m,sc){gl.uniformMatrix4fv(m.uM,false,it.M||ID4);gl.uniform1f(m.uAlpha,it.alpha==null?1:it.alpha);gl.uniform3fv(m.uTint,it.tint||[0,0,0]);gl.uniform1f(m.uTintAmt,it.tintAmt||0);gl.bindVertexArray(it.mesh.vao);gl.drawArrays(gl.TRIANGLES,0,it.mesh.n)}
function project(VP,p){const x=VP[0]*p[0]+VP[4]*p[1]+VP[8]*p[2]+VP[12],y=VP[1]*p[0]+VP[5]*p[1]+VP[9]*p[2]+VP[13],w=VP[3]*p[0]+VP[7]*p[1]+VP[11]*p[2]+VP[15];return w>0?[(x/w*0.5+0.5)*W,(1-(y/w*0.5+0.5))*H,w]:null}
