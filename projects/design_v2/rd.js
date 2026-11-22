// node rd.js theme mode(still|video) [times...]
const {chromium}=require('playwright');const {spawn}=require('child_process');
const [theme,mode,...ts]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/d.html#'+theme);await p.evaluate(async()=>{await document.fonts.load('700 40px Caveat');await document.fonts.load('400 40px PatrickHand');await document.fonts.ready});
if(mode==='still'){for(const t of ts){await p.evaluate(f=>frame(f),Math.round(t*30));await p.screenshot({path:`st_${theme}_${t}.jpg`,type:'jpeg',quality:90})}}
else{const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',`entwurf_${theme}.mp4`]);
 for(let i=0;i<14*30;i++){await p.evaluate(f=>frame(f),i);const buf=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
 ff.stdin.end();await new Promise(r=>ff.on('close',r))}
await b.close()})();
