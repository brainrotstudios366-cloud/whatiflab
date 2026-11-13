const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/friction.html');
const d=await p.evaluate(()=>({crash:cityCrashes.map(c=>[+c.t.toFixed(3),+c.rel.toFixed(2)]),
 land:chunks.filter(c=>!c.base).map(c=>[+(c.ts).toFixed(3),+(c.ts+c.kl).toFixed(3),+((c.y1-c.y0)*(c.x1-c.x0)).toFixed(0)]),
 sf:sfCars.map(c=>[+(T_SF-SF_K0+c.delay+c.kS).toFixed(3),c.cable?1:0])}));
require('fs').writeFileSync('events.json',JSON.stringify(d));console.log(d.crash.length,d.land.length,d.sf.length);
console.log(Math.min(...d.land.map(x=>x[1])),Math.max(...d.land.map(x=>x[1])));
await b.close()})();
