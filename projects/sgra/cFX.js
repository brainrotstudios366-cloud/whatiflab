const DUSTRING=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2;blob(m,[Math.cos(a),0.4,Math.sin(a)],0.09,p=>mix3([0.6,0.55,0.48],[0.8,0.74,0.66],clamp(p[1],0,1)),i,4.5,[6,10])}},0.5);
const DISC2=um(m=>{for(let i=0;i<40;i++){const a=i/40*TAU2,b=(i+1)/40*TAU2;m.tri([0,0,0],[Math.cos(b),0,Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[1,1,1])}});
const PUFF=um(m=>blob(m,[0,0,0],1,p=>mix3([0.78,0.78,0.8],[0.97,0.97,0.98],clamp(p[1]*0.5+0.5,0,1)),3,0.9,[7,10]),0.5);
function fireball(items,p,k,s){if(k<0)return;if(k<1.6){const r=s*(0.35+0.8*easeOut(k/0.35));items.push({mesh:UEMIS,M:M4.trs([p[0],p[1]+r*0.5,p[2]],0,0,0,r),tint:mix3([1,0.95,0.7],[1,0.35,0.08],clamp(k/1.2,0,1)),tintAmt:1,alpha:clamp(1.2-k/1.6,0,1),add:1,noShadow:true})}
  if(k<8){const rr=s*(0.6+3.0*easeOut(k/1.5));items.push({mesh:DUSTRING,M:M4.trs(p,0,0,0,[rr,s*0.35*(1+k*0.3),rr]),alpha:clamp(1-(k-2.5)/5,0,1)*0.9});
    for(let i=0;i<7;i++){const a=i*1.3;const q=[p[0]+Math.cos(a)*s*0.4,p[1]+s*(0.5+k*0.9)+i*s*0.3,p[2]+Math.sin(a)*s*0.4];items.push({mesh:PUFF,M:M4.trs(q,i,0,0,s*(0.35+k*0.12)),tint:mix3([0.95,0.45,0.15],[0.25,0.22,0.22],clamp(k/1.2,0,1)),tintAmt:clamp(0.4+k*0.3,0,0.9),alpha:clamp(0.9-k/8,0,1),noShadow:true})}}}
