initGL();initAssets();buildModels();
// ---------- timeline (STARSHIP vs ONE SAMURAI) ----------
const R=[3.4,14.0,24.6,35.6,46.4,61.6];
const EV={ign:5.0,lift:6.3,cut:7.75,hit:7.95,cool:11.0,
  bdesc:14.2,chop:16.8,catch:19.6,jeal:21.8,
  vent:26.4,freeze:28.6,crack:31.2,ice:32.8,
  ready:37.4,jump:40.3,slice:40.75,land:41.2,boom:41.9,walk:43.6,
  boss:47.2,whistle:49.6,look:50.4,bonk:53.2,floor:54.0,
  endc:61.6,loop:65.6};
const ROUNDS=[['ROUND 1','Liftoff: 33 engines 🔥','Cut the blast in half ⚔️',EV.cut+0.15,'Not one hair burned 😎',EV.cool],
  ['ROUND 2','The 70 m booster comes back ⬇️','Caught it with chopsticks 🥢',EV.catch+0.1,'The launch tower is jealous 🗼',EV.jeal],
  ['ROUND 3','Fuel: liquid oxygen, −183 °C 🧊','Frozen solid… 🥶',EV.freeze+0.4,'Broke out + free shaved ice 🍧',EV.ice],
  ['ROUND 4','Reentry: 1,400 °C plasma ☄️','Sliced it in HALF ⚔️',EV.slice+0.1,"Didn't even look back 😎",EV.walk],
  ['FINAL BOSS','ONE heat-shield tile 🖤','It came loose… 😬',EV.whistle,'BONK. 💀',EV.bonk+0.1]];
const STATS=[['🔥 33 engines · 18 million+ lbs of thrust','#FFD84A',4.0,13.6],['🥢 Real boosters get caught by tower "chopsticks"','#5AF0FF',14.6,23.8],['🧊 Liquid oxygen boils at −183 °C','#9ad8ff',25.2,34.8],
  ['☄️ 124 m tall · reentry heat 1,400 °C+','#FF8A5A',36.2,45.8],['🖤 Thousands of hexagon tiles… ONE fell','#FF5A8A',47.6,53.0]];
const STATS2=[null,null,null,null,['🚀 Beat the biggest rocket ever. Not the tile.','#FFD84A',53.4,61.3]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
