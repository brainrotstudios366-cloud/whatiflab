const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
await p.goto('file://'+__dirname+'/h.html');await p.evaluate(async()=>{await document.fonts.load('700 40px Caveat');await document.fonts.ready});
for(const t of process.argv.slice(2).map(Number)){const a=Date.now();await p.evaluate(f=>frame(f),Math.round(t*30));await p.screenshot({path:`rt_${t}.jpg`,type:'jpeg',quality:88});}await b.close()})();
