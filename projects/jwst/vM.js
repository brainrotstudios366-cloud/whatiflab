initGL();initAssets();buildModels();
// ---------- timeline (WEBB'S UNIVERSE vs ONE SAMURAI – riding the James Webb Space Telescope) ----------
const R=[3.4,14.2,25.0,36.0,47.0,61.6];
const EV={plume:5.2,umb:7.2,snow:8.2,cool:11.4,
  chunks:15.4,cut1:17.6,cut2:18.5,cut3:19.3,ice:21.4,
  wall:25.2,brace:27.0,pass:30.0,meh:31.4,
  send:38.2,nap:40.0,reply:43.4,react:44.2,
  boss:48.4,ray:50.8,flip:51.2,thrust:52.4,fling:54.4,ko:55.6,
  endc:61.6,loop:65.6};
const ROUNDS=[['ROUND 1',"WASP-107b: a planet where it RAINS SAND ⏳",'Opened his umbrella ☂️',EV.umb+0.1,'Sand rain? Cute. 😎',EV.cool],
  ['ROUND 2',"WASP-17b: clouds made of QUARTZ crystals 💎",'Sliced every single one ⚔️',EV.cut1+0.1,'Free bling 💎✌️',EV.ice],
  ['ROUND 3','The Cosmic Cliffs: 7 light-years tall ☁️','He flew straight through… 😳',EV.pass,'…and felt NOTHING 😐',EV.meh],
  ['ROUND 4','MoM-z14: the most distant galaxy ever seen 🌌','Texted it 📱',EV.send+0.1,'It will NEVER arrive 💀',EV.reply+0.3],
  ['FINAL BOSS','ONE micrometeoroid 🪨','It DENTED the mirror… 😬',EV.flip+0.2,'YEET. 💀',EV.fling]];
const STATS=[['🔭 Webb found sand clouds on WASP-107b (2023)','#FFD84A',4.0,13.8],['🔭 Webb spotted tiny quartz crystals in its clouds (2023)','#5AF0FF',14.8,24.6],
  ['📸 One of Webb’s very first images (July 2022)','#FF9A4A',25.6,29.6],['🌌 Its light traveled ~13.5 billion years to reach Webb','#ff8a7a',36.6,46.6],['🪨 Smaller than a grain of sand… way faster than a bullet','#FF5A8A',48.8,55.4]];
const STATS2=[null,null,['🤷 Nebula gas is thinner than most lab vacuums','#7DFF9A',31.6,35.6],null,['🔭 Beat sand rain, quartz clouds & 7-ly cliffs. Not ONE dust speck.','#FFD84A',55.8,61.3]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
