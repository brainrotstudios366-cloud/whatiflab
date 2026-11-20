const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
const t0=Date.now();await p.goto('file://'+__dirname+'/g.html');await p.evaluate(()=>document.fonts.ready);console.log('load ms',Date.now()-t0);
for(const t of process.argv.slice(2).map(Number)){const a=Date.now();await p.evaluate(f=>frame(f),Math.round(t*30));const dt=Date.now()-a;await p.screenshot({path:`rt_${t}.jpg`,type:'jpeg',quality:88});console.log('t',t,'ms',dt)}await b.close()})();
