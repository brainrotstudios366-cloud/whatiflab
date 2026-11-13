const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
await p.goto('file://'+__dirname+'/'+(process.argv[2]||'test.html'));const ts=process.argv.slice(3).map(Number);
for(const t of ts){const t0=Date.now();await p.evaluate(t=>frame(t),t);const dt=Date.now()-t0;await p.screenshot({path:`gt_${t}.jpg`,type:'jpeg',quality:90});console.log('t',t,'ms',dt)}await b.close()})();
