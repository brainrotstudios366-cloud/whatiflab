initGL();initAssets();buildModels();
// ---------- timeline (DEEP SPACE vs ONE SAMURAI – riding Voyager 1) ----------
const R=[3.4,14.2,25.0,36.0,47.0,61.6];
const EV={plume:5.2,umb:7.2,snow:8.2,cool:11.4,
  chunks:15.4,cut1:17.6,cut2:18.5,cut3:19.3,ice:21.4,
  wall:25.2,brace:27.0,pass:30.0,meh:31.4,
  send:38.2,nap:40.0,reply:43.4,react:44.2,
  boss:48.4,ray:50.8,flip:51.2,thrust:52.4,fling:54.4,ko:55.6,
  endc:61.6,loop:65.6};
const ROUNDS=[['ROUND 1',"Io: volcanoes shoot 300 km high 🌋",'Opened his umbrella ☂️',EV.umb+0.1,'Sulfur snow? Cute. 😎',EV.cool],
  ['ROUND 2',"Saturn's rings: billions of ice chunks 🧊",'Sliced every single one ⚔️',EV.cut1+0.1,'Free shaved ice 🍧',EV.ice],
  ['ROUND 3','The edge of the Sun’s bubble: ~50,000 °C 🔥','He went straight through… 😳',EV.pass,'…and felt NOTHING 😐',EV.meh],
  ['ROUND 4','1 LIGHT-DAY from home 📡','Texted mom 📱',EV.send+0.1,'Reply took 2 DAYS 💀',EV.reply+0.3],
  ['FINAL BOSS','ONE cosmic ray ⚡','It flipped ONE bit… 😬',EV.flip+0.2,'YEET. 💀',EV.fling]];
const STATS=[['🌋 Voyager 1 discovered these volcanoes in 1979','#FFD84A',4.0,13.8],['🪐 Rings ~280,000 km wide… often only ~10 m thick','#5AF0FF',14.8,24.6],
  ['🔥 Voyager 1 crossed this wall in 2012','#FF8A5A',25.6,29.6],['📡 25.9 billion km · light needs 24 hours one way','#9ad8ff',36.6,46.6],['⚡ A single flipped bit once scrambled Voyager 2’s data (2010)','#FF5A8A',48.8,55.4]];
const STATS2=[null,null,['🤷 Super hot… but so empty it can’t heat you','#7DFF9A',31.6,35.6],null,['🛰️ Beat volcanoes, rings & a 50,000 °C wall. Not ONE particle.','#FFD84A',55.8,61.3]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
