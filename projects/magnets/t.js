const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
await p.setContent('<body style="margin:0;background:#123;font:900 60px Inter;color:#ffd84a">Hi 🧲</body>');
await p.screenshot({path:'t.png'});await b.close();console.log('ok')})();
