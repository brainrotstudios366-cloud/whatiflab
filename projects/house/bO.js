// ================= props =================
const FONT5={A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],
  K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],O:['01110','10001','10001','10001','10001','10001','01110'],
  P:['11110','10001','10001','11110','10000','10000','10000'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],
  W:['10001','10001','10001','10101','10101','10101','01010'],Y:['10001','10001','01010','00100','00100','00100','00100'],"'":['00100','00100','01000','00000','00000','00000','00000'],
  '0':['01110','10011','10101','10101','10101','11001','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],' ':['00000','00000','00000','00000','00000','00000','00000']};
// text in local xy plane, reading direction along +x (dir=1) or -x (dir=-1), facing +z (dir=1) or -z
function pixText(m,s,c,cell,col,dir,depth){dir=dir||1;depth=depth||cell*0.6;const adv=[];let wsum=0;for(const ch of s){const w=ch==="'"?3:ch===' '?3:6;adv.push(w);wsum+=w}wsum-=1;let x0=-wsum*cell/2;let k=0;
  for(const ch of s){const g=FONT5[ch]||FONT5[' '];const off=ch==="'"?-1:0;for(let r=0;r<7;r++)for(let q=0;q<5;q++){if(g[r][q]!=='1')continue;const lx=x0+(q+off)*cell+cell/2;
      m.box([c[0]+dir*lx,c[1]+(3-r)*cell,c[2]],[cell*0.96,cell*0.96,depth],col)}x0+=adv[k++]*cell}}
const LOAF=um(m=>{sbox(m,[0,0,0],[0.42,0.17,0.2],0.7,hx('#c9853a'),8);for(let i=0;i<3;i++)m.box([-0.1+i*0.1,0.075,0],[0.03,0.025,0.15],hx('#ecc27a'),0,-0.5)},0.4);
const CART=um(m=>{const w=hx('#9a6a3a'),w2=hx('#7a4e28'),w3=hx('#b8844a');
  m.box([0,0.72,0],[1.5,0.1,0.85],w);for(const sz of[-1,1])m.box([0,0.86,sz*0.4],[1.5,0.22,0.06],w3);for(const sx of[-1,1])m.box([sx*0.72,0.86,0],[0.06,0.22,0.86],w3);
  for(const sz of[-1,1]){const c=[0.15,0.4,sz*0.5];for(let i=0;i<14;i++){const a=i/14*TAU2,b=(i+1)/14*TAU2;const p=(r,an,dz)=>[c[0]+Math.cos(an)*r,c[1]+Math.sin(an)*r,c[2]+dz];
      m.quad(p(0.4,a,-0.05),p(0.4,b,-0.05),p(0.4,b,0.05),p(0.4,a,0.05),w2);m.quad(p(0.4,a,sz*0.05),p(0.4,b,sz*0.05),p(0.3,b,sz*0.05),p(0.3,a,sz*0.05),w2)}
    m.box([c[0],c[1],c[2]+sz*0.05],[0.62,0.05,0.04],w2);m.box([c[0],c[1],c[2]+sz*0.05],[0.05,0.62,0.04],w2);m.ico([c[0],c[1],c[2]+sz*0.05],0.07,w2,0,1,[4,6])}
  m.box([0.15,0.4,0],[0.06,0.06,1.0],w2);
  for(const sz of[-1,1])m.box([-1.05,0.82,sz*0.3],[0.7,0.06,0.06],w2);m.box([-1.38,0.82,0],[0.06,0.06,0.66],w3);
  m.box([0.68,0.36,0],[0.08,0.7,0.08],w2);
  // awning posts + canvas
  for(const sx of[-1,1])for(const sz of[-1,1])m.box([sx*0.68,1.35,sz*0.38],[0.05,1.1,0.05],w2);
  for(let i=0;i<6;i++){const x0=-0.8+i*0.267;m.quad([x0,1.92,-0.5],[x0,1.92,0.5],[x0+0.267,1.92,0.5],[x0+0.267,1.92,-0.5],i%2?hx('#f4f0e6'):hx('#d84a3a'))}
  for(let i=0;i<6;i++){const x0=-0.8+i*0.267;for(const sz of[-1,1])m.quad([x0,1.92,sz*0.5],[x0,1.75,sz*0.5],[x0+0.267,1.75,sz*0.5],[x0+0.267,1.92,sz*0.5],i%2?hx('#f4f0e6'):hx('#d84a3a'))}
  pixText(m,'BREAD',[0,0.85,-0.44],0.03,hx('#fff2c8'),-1,0.02)},0.0);
const PUDDLE=um(m=>{const n=28;for(let i=0;i<n;i++){const a=i/n*TAU2,b=(i+1)/n*TAU2;const r=a2=>1+0.18*Math.sin(a2*3+1)+0.1*Math.sin(a2*5);m.tri([0,0,0],[Math.cos(b)*r(b),0,Math.sin(b)*r(b)*0.7],[Math.cos(a)*r(a),0,Math.sin(a)*r(a)*0.7],hx('#4a3220'))}
  for(let i=0;i<n;i++){const a=i/n*TAU2,b=(i+1)/n*TAU2;const r=a2=>1+0.18*Math.sin(a2*3+1)+0.1*Math.sin(a2*5);m.quad([Math.cos(a)*r(a),0,Math.sin(a)*r(a)*0.7],[Math.cos(b)*r(b),0,Math.sin(b)*r(b)*0.7],[Math.cos(b)*r(b)*1.15,-0.02,Math.sin(b)*r(b)*0.8],[Math.cos(a)*r(a)*1.15,-0.02,Math.sin(a)*r(a)*0.8],hx('#6a4a2e'))}});
const GTRUCK=um(m=>{const g=hx('#e8b52a'),g2=hx('#f6d466'),ch=hx('#c8ccd4'),bk=hx('#1a1a1e');
  // cargo box (x from -3 to 1.2), cab x 1.3..3.1
  m.box([-0.9,2.1,0],[4.2,2.6,2.4],g,0,0,g2);m.box([-0.9,0.75,0],[4.4,0.18,2.2],hx('#3a3a40'));
  for(const sz of[-1,1])for(let i=0;i<5;i++)m.box([-2.9+i*1.0,2.1,sz*1.205],[0.06,2.5,0.02],hx('#d8a020'));
  m.box([2.15,1.55,0],[1.6,1.6,2.3],g,0,0,g2);m.box([3.15,1.05,0],[0.6,0.7,2.2],g);
  m.box([2.62,2.0,0],[0.62,0.7,2.1],hx('#2a3a50'),MAT.glass);for(const sz of[-1,1])m.box([2.2,1.95,sz*1.16],[0.8,0.6,0.02],hx('#2a3a50'),MAT.glass);
  m.box([3.48,0.75,0],[0.14,0.22,2.3],ch);m.box([3.46,1.05,0],[0.04,0.4,1.4],ch);for(const sz of[-1,1])m.box([3.47,1.1,sz*0.85],[0.05,0.2,0.3],[1,1,0.85],MAT.emis);
  for(const[x]of[[-2.2],[-1.0],[2.4]])for(const sz of[-1,1]){const c=[x,0.52,sz*1.0];for(let i=0;i<18;i++){const a=i/18*TAU2,b=(i+1)/18*TAU2;const p=(r,an,dz)=>[c[0]+Math.cos(an)*r,c[1]+Math.sin(an)*r,c[2]+dz];m.quad(p(0.5,a,-0.18),p(0.5,b,-0.18),p(0.5,b,0.18),p(0.5,a,0.18),bk);m.quad(p(0.5,a,sz*0.18),p(0.5,b,sz*0.18),p(0.25,b,sz*0.19),p(0.25,a,sz*0.19),bk);m.tri([c[0],c[1],c[2]+sz*0.19],p(0.25,b,sz*0.19),p(0.25,a,sz*0.19),ch)}}
  // letters on -z side (camera side), read along -x
  pixText(m,"LEO'S",[-0.9,2.75,-1.23],0.075,hx('#7a3a12'),-1,0.04);pixText(m,'BAKERY',[-0.9,2.05,-1.23],0.075,hx('#7a3a12'),-1,0.04);
  pixText(m,'200 SHOPS',[-0.9,1.32,-1.23],0.042,hx('#ffffff'),-1,0.03);
  pixText(m,"LEO'S",[-0.9,2.75,1.23],0.075,hx('#7a3a12'),1,0.04);pixText(m,'BAKERY',[-0.9,2.05,1.23],0.075,hx('#7a3a12'),1,0.04);pixText(m,'200 SHOPS',[-0.9,1.32,1.23],0.042,hx('#ffffff'),1,0.03)},0.0);
const BAG=um(m=>{blob(m,[0,0.2,0],0.24,p=>mix3(hx('#c8a050'),hx('#e8c870'),clamp(p[1]*2,0,1)),4,1.1,[7,10]);m.prism([0,0.38,0],0.1,0.14,0.12,10,hx('#e8c870'));m.prism([0,0.4,0],0.105,0.105,0.03,10,hx('#8a5a2a'))},0.4);
const COIN=um(m=>m.prism([0,-0.01,0],0.05,0.05,0.02,12,hx('#ffd23a')));
const BRICKDOME=um(m=>{const la=8,lo=18;for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const P=(ii,jj)=>{const th=ii/la*Math.PI/2,ph=jj/lo*TAU2;return[Math.sin(th)*Math.cos(ph),Math.cos(th)*0.9,Math.sin(th)*Math.sin(ph)]};
  const col=((i+(j%2))%2)?hx('#b8502e'):hx('#a8442a');if(j>=3&&j<6&&i>=4)continue;if(i===0)m.tri(P(i,j),P(i+1,j+1),P(i+1,j),col);else m.quad(P(i,j),P(i,j+1),P(i+1,j+1),P(i+1,j),col)}
  m.prism([0,-0.4,0],1.05,1.05,0.4,18,hx('#9a8a7a'))},0.3);
const KITCHEN=um(m=>{const S=4.5,Hh=3.4;// floor checker
  for(let i=-6;i<6;i++)for(let j=-6;j<6;j++){const c=(i+j)%2?hx('#e8e2d6'):hx('#3a3a44');m.quad([i*0.6,0,j*0.6],[i*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,(j+1)*0.6],[(i+1)*0.6,0,j*0.6],c)}
  const wall=hx('#e9dcc0');m.quad([-S,0,3.0],[-S,Hh,3.0],[S,Hh,3.0],[S,0,3.0],wall);m.quad([-3.2,0,-S],[-3.2,Hh,-S],[-3.2,Hh,S],[-3.2,0,S],wall);m.quad([3.2,0,S],[3.2,Hh,S],[3.2,Hh,-S],[3.2,0,-S],wall);m.quad([-S,0,-3.6],[S,0,-3.6],[S,Hh,-3.6],[-S,Hh,-3.6],wall);
  m.quad([-S,Hh,-S],[S,Hh,-S],[S,Hh,S],[-S,Hh,S],hx('#d8ccb0'));
  for(let i=0;i<14;i++)for(let j=0;j<4;j++)m.box([-3.1+i*0.45+(j%2)*0.22,1.0+j*0.2,2.98],[0.42,0.17,0.02],hx('#f4f2ec'));
  // window with city
  m.box([-1.6,2.1,2.97],[1.6,1.1,0.04],hx('#1a2440'),MAT.emis);m.box([-1.6,2.1,2.94],[1.7,0.08,0.06],hx('#6a4a2a'));m.box([-1.6,2.1,2.94],[0.08,1.2,0.06],hx('#6a4a2a'));
  const r=rngG(9);for(let i=0;i<9;i++){const x=-2.3+i*0.16,h=0.2+r()*0.5;m.box([x,1.55+h/2,2.95],[0.14,h,0.02],hx('#0e1424'));for(let k=0;k<3;k++)if(r()<0.6)m.box([x+(r()-0.5)*0.06,1.6+r()*h*0.8,2.94],[0.025,0.03,0.01],hx('#ffd870'),MAT.emis)}
  // counter
  m.box([0.6,0.47,1.6],[3.2,0.94,0.9],hx('#8a5a32'),0,0,hx('#c8a070'));m.box([0.6,0.95,1.6],[3.3,0.06,0.95],hx('#d8b888'));
  // shelf with flour
  m.box([1.6,2.2,2.85],[2.0,0.06,0.3],hx('#7a4e28'));for(let i=0;i<3;i++)m.box([1.0+i*0.5,2.45,2.85],[0.3,0.42,0.22],hx('#efe8d8'),0,0,hx('#e8e0cc'));
  // clock
  m.prism([2.2,2.0,2.96],0.28,0.28,0.001,20,hx('#f8f8f4'));},0.0);
const CLOCKRIM=um(m=>{for(let i=0;i<20;i++){const a=i/20*TAU2,b=(i+1)/20*TAU2;m.quad([Math.cos(a)*0.28,Math.sin(a)*0.28,0],[Math.cos(b)*0.28,Math.sin(b)*0.28,0],[Math.cos(b)*0.32,Math.sin(b)*0.32,-0.03],[Math.cos(a)*0.32,Math.sin(a)*0.32,-0.03],hx('#3a2a20'))}});
const DOUGH=um(m=>blob(m,[0,0,0],1,p=>hx('#f2e2c0'),5,0.55,[6,10]),0.5);
