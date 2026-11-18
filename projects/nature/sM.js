initGL();initAssets();buildModels();
// ---------- timeline (NATURE'S HARDEST HITS vs ONE SAMURAI) ----------
const R=[3.4,14.0,24.6,35.6,46.4,61.6];
const EV={mWind:6.4,mDash:7.75,punch:8.0,bounce:8.15,dizzy:10.2,mSheath:11.6,
  dango:15.2,cock:16.6,snap:18.0,toast:18.4,yum:21.0,
  crocStop:28.4,lunge:29.5,jam:29.9,dent:32.4,
  surf:36.4,click:39.4,reach:40.6,bounceW:41.0,tiny:43.4,
  boss:47.2,buzz:47.6,sl1:49.0,sl2:49.75,sl3:50.5,mland:52.4,bite:53.2,slapUp:54.0,slap:54.45,floor:55.2,
  endc:61.6,loop:65.6};
const ROUNDS=[['ROUND 1','Mantis shrimp: fastest punch 🥊','Blocked with the sword ⚔️',EV.bounce,'Shrimp needs a minute 😵',EV.dizzy],
  ['ROUND 2','Pistol shrimp: its snap boils water 🔥','Used it to grill his dango 🍡',EV.toast,'Perfectly toasted 👌',EV.yum],
  ['ROUND 3','Saltwater croc: strongest bite 🐊','Jammed its jaws open 😎',EV.jam+0.1,'Free dental check 🦷',EV.dent],
  ['ROUND 4','Sperm whale: loudest animal 🐋','99.9% bounces off the water 🌊',EV.bounceW,'He heard… a tiny click 🤏',EV.tiny],
  ['FINAL BOSS','ONE mosquito 🦟','Missed. Missed. MISSED 😤',EV.sl1+0.25,'Slapped himself 💀',EV.slap+0.15]];
// stat chips [text, colour, t0, t1]
const STATS=[['🥊 23 m/s punch · 8,000× gravity','#FFD84A',4.0,13.6],['🔊 218 dB · bubble 4,000°F+','#FF5A8A',14.6,23.8],['🦷 Bite: 3,700 psi (record)','#FFB36A',25.2,34.8],
  ['🔊 236 dB · loudest animal ever','#5AF0FF',36.2,45.8],['☠️ Deadliest animal on Earth','#FF5A8A',47.6,53.0]];
const STATS2=[null,null,null,null,['🦟 ~610,000 malaria deaths (WHO, 2024)','#FFD84A',53.1,61.3]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
