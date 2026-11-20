// ===================== SCALE (Waage) simulation + render =====================
const PIV=[0,3.2,0],ARM=2.95,HANG=1.9,PANY=0.02;
function mkScene(o){o.items=[];o.groups=o.groups||[];return o}
function addItems(S,side,k,slots,tin,stag,extra){const out=[];slots.forEach((sl,i)=>{const it=Object.assign({s:side,k,slot:sl,tin:tin+i*(stag||0)},extra||{});S.items.push(it);out.push(it)});return out}
const rng=(a,b)=>{const r=[];for(let i=a;i<=b;i++)r.push(i);return r};
function setOut(S,side,k,slots,t,mode,stag){let i=0;for(const it of S.items)if(it.s===side&&it.k===k&&slots.includes(it.slot)&&it.tout==null&&it.tin<t){it.tout=t+(stag||0)*(i++);it.out=mode||'up'}}
function pres(it,t){if(t<it.tin)return 0;let p=ease((t-it.tin)/0.28);if(it.tout!=null&&t>it.tout)p*=1-ease((t-it.tout)/(it.out==='pop'?0.12:0.4));return p}
function val(S,it){return it.k==='x'?S.xv:it.k==='b'?-1:1}
function torque(S,t){let L=0,R=0;for(const it of S.items){const p=pres(it,t);if(!p)continue;if(it.s==='L')L+=p*val(S,it);else R+=p*val(S,it)}return L-R}
function simulate(S){const dt=1/120,n=Math.ceil((S.t1-S.t0)/dt)+4;S.th=new Float32Array(n);let th=0,v=0;
  for(let i=0;i<n;i++){const t=S.t0+i*dt;const tg=clamp(0.045*torque(S,t),-0.28,0.28);const a=-26*(th-tg)-3.6*v;v+=a*dt;th+=v*dt;S.th[i]=th}}
function thAt(S,t){const f=(t-S.t0)*120;const i=clamp(Math.floor(f),0,S.th.length-2);const k=clamp(f-i,0,1);return S.th[i]*(1-k)+S.th[i+1]*k}
function slotPos(S,it,t){if(it.k==='b'){const nb=S.items.filter(q=>q.k==='b'&&q.s===it.s).length;return[(it.slot-(nb-1)/2)*0.62,2.45+0.12*Math.sin(t*1.7+it.slot*1.9)+(it.slot%2)*0.25,0.15]}
  const cap=S.cap;const col=it.slot%cap,row=Math.floor(it.slot/cap);return[(col-(cap-1)/2)*0.56,0.27+row*0.53,0.05]}
function groupOf(S,it,t){for(const g of S.groups){if(t<g.t0||t>g.t1+0.6||g.side!=='both'&&g.side!==it.s)continue;const sets=it.s==='L'?g.L:g.R;for(let i=0;i<sets.length;i++)if(sets[i].includes(it.slot)&&it.k!=='b')return{i,a:ease((t-g.t0)/0.35)*(1-ease((t-g.t1)/0.6))}}return null}
const GCOL=[HC('#5AF0FF'),HC('#FFD84A'),HC('#FF5A8A'),HC('#7DFF9A')];
function scaleGeom(S,t){const th=thAt(S,t);const c=Math.cos(th),s=Math.sin(th);
  const eL=[PIV[0]-ARM*c,PIV[1]-ARM*s,0],eR=[PIV[0]+ARM*c,PIV[1]+ARM*s,0];return{th,eL,eR,pL:[eL[0],eL[1]-HANG,0],pR:[eR[0],eR[1]-HANG,0]}}
function scaleItems(items,S,t,vis){vis=vis==null?1:vis;if(vis<=0)return null;const G=scaleGeom(S,t);
  items.push({mesh:SBASE,M:M4.trs([0,0,0],0,0,0,1)});items.push({mesh:SHADOW,M:M4.trs([0,0.01,0],0,0,0,[3.4,1,1.6]),alpha:0.55});
  items.push({mesh:BEAM,M:M4.trs(PIV,0,0,G.th,1)});items.push({mesh:PIVOT,M:M4.trs([0,PIV[1],0.18],0,0,0,1)});
  items.push({mesh:POINTER,M:M4.trs([0,PIV[1],0.2],0,0,G.th,1)});
  for(const[e,p]of[[G.eL,G.pL],[G.eR,G.pR]]){items.push({mesh:PAN,M:M4.trs(p,0,0,0,1)});const hk=[e[0],e[1]-0.12,e[2]];
    items.push({mesh:USPH,M:M4.trs(hk,0,0,0,0.09),tint:CY,tintAmt:1});
    for(let i=0;i<3;i++){const a=i/3*TAU2+0.5;const q=[p[0]+Math.cos(a)*1.38,p[1]+0.03,p[2]+Math.sin(a)*0.9];items.push({mesh:UCYL,M:segM(hk,q,0.018),tint:HC('#9ab8ff'),tintAmt:1})}
    items.push({mesh:SHADOW,M:M4.trs([p[0],0.012,0],0,0,0,[1.5,1,0.7]),alpha:0.35})}
  const lab=[];
  for(const it of S.items){const pr=pres(it,t);if(t<it.tin)continue;const outK=it.tout!=null?clamp((t-it.tout)/(it.out==='pop'?0.15:0.45),0,1):0;if(outK>=1)continue;
    const pc=it.s==='L'?G.pL:G.pR;const lp=slotPos(S,it,t);let y0=pc[1]+PANY+lp[1];
    const ink=clamp((t-it.tin)/0.35,0,1);let drop=it.k==='b'?(1-easeOut(ink))*-1.6:(1-easeOut(ink))*1.4;
    let rise=0,al=1,sc=1;if(it.tout!=null&&t>it.tout){if(it.out==='up'){rise=easeIn(outK)*1.8;al=1-outK}else if(it.out==='pop'){sc=1+outK*0.6;al=1-outK}else{al=1-outK;sc=1-outK*0.3}}
    sc*=0.6+0.4*backOut(ink);
    const pos=[pc[0]+lp[0],y0+drop+rise,pc[2]+lp[2]];
    const gr=groupOf(S,it,t);let tint=null,ta=0;if(gr){tint=GCOL[gr.i%4];ta=0.55*gr.a}
    const mark=it.tout!=null&&it.out!=='pop'&&t>it.tout-0.55&&t<it.tout?ease((t-(it.tout-0.55))/0.25):0;if(mark>ta){tint=PK;ta=mark*0.7}
    const alpha=al<0.999?al:null;
    if(it.k==='x'){items.push({mesh:XBOX,M:M4.trs(pos,0.18*Math.sin(t*0.6+it.slot),0,0,0.5*sc),tint,tintAmt:ta*0.8,alpha});lab.push({k:'x',p:[pos[0],pos[1],pos[2]+0.26],a:al*clamp(ink*2,0,1),gi:gr?gr.i:-1,ga:gr?gr.a:0})}
    else if(it.k==='w'){items.push({mesh:WGT,M:M4.trs(pos,0,0,0,[0.44*sc,0.5*sc,0.44*sc]),tint,tintAmt:ta,alpha})}
    else{const bp=[pos[0],pos[1]+(it.tout!=null&&it.out!=='pop'?rise:0),pos[2]];items.push({mesh:BALL,M:M4.trs(bp,0,0,0.12*Math.sin(t*1.3+it.slot),[0.3*sc,0.36*sc,0.3*sc]),alpha});
      const an=[pc[0]+lp[0]*0.55,pc[1]+0.05,0.4];items.push({mesh:UCYL,M:segM(an,[bp[0],bp[1]-0.46*sc,bp[2]],0.012),tint:HC('#ffc0d0'),tintAmt:1,alpha});lab.push({k:'b',p:[bp[0],bp[1],bp[2]+0.3],a:al})}}
  return{G,lab}}
// side-badge text from present items
function sideText(S,side,t){let nx=0,nw=0,nb=0;for(const it of S.items){if(it.s!==side)continue;const p=pres(it,t);if(p<0.5)continue;if(it.k==='x')nx++;else if(it.k==='w')nw++;else nb++}
  const parts=[];if(nx)parts.push(nx===1?'x':nx+'x');if(nw)parts.push(String(nw));let s=parts.join(' + ');if(nb)s+=' − '+nb;return s||'0'}
