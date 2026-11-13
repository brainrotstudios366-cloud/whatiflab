// usage: node rscene.js html startFrame endFrame out.mp4
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const {spawn}=require('child_process');const fs=require('fs');
const [html,a,b,out]=process.argv.slice(2);
(async()=>{const br=await chromium.launch({args:['--disable-gpu']});const p=await br.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/'+html);await p.evaluate(()=>document.fonts.ready);
const tmp=out.replace(/\.mp4$/,'.part.mp4');
const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30',tmp]);
for(let i=+a;i<+b;i++){await p.evaluate(f=>frame(f),i);const buf=await p.screenshot({type:'jpeg',quality:93});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();ff.on('close',code=>{if(code===0){fs.renameSync(tmp,out);console.log('ok',out)}else console.log('fail',code);br.close()})})();
