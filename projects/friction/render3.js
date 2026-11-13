const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--disable-gpu']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
await p.goto('file://'+__dirname+'/'+(process.env.SCN||'scene.html'));await p.evaluate(()=>document.fonts.ready);
const mode=process.argv[2];
if(mode==='test'){const ts=process.argv.slice(3).map(Number);
  for(const t of ts){await p.evaluate(f=>frame(f),Math.round(t*30));await p.screenshot({path:`test_${t}.jpg`,type:'jpeg',quality:80});}
  console.log('crashes',JSON.stringify(await p.evaluate(()=>crashes)));}
else{fs.mkdirSync('ffr',{recursive:true});const n=await p.evaluate(()=>NFR);const t0=Date.now();
  for(let i=0;i<n;i++){await p.evaluate(f=>frame(f),i);await p.screenshot({path:`ffr/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:93});}
  console.log('done',n,(Date.now()-t0)/1000+'s');}
await b.close()})();
