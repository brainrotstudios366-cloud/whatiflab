const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:600,height:200}});
await p.setContent('<canvas id=c width=600 height=200></canvas><script>const x=document.getElementById("c").getContext("2d");x.fillStyle="#123";x.fillRect(0,0,600,200);x.font=\'900 60px Inter, "Noto Color Emoji"\';x.fillStyle="#ffd84a";x.fillText("Hi 🧲 🔇 🚗 ⚡ 🐦 👇",10,120);</script>');
await p.screenshot({path:'t2.png'});await b.close();})();
