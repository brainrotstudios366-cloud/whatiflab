initGL();initAssets();buildModels();
// ---------- timeline (EVERY PLANET vs ONE SAMURAI) ----------
const R=[3.4,14.0,24.0,34.0,45.0,55.0,61.6];
const EV={umb:7.2,night:10.0,kneel:10.4,tea:11.2,
  ven0:14.0,rain0:16.2,evap:19.0,dry:21.5,
  dust:27.6,breeze:29.4,nap:31.6,
  grs0:35.2,metUp:37.6,jump:39.2,cut:39.85,land:40.7,metClick:42.2,
  wind0:45.0,dia0:47.0,spin0:48.2,spin1:51.8,keep:52.6,
  home:55.0,boss:56.8,step:57.6,slip:58.0,floor:58.55,
  endc:61.6,loop:65.6};
const ROUNDS=[['STAGE 1','Mercury: 430°C 🔥','Opened an umbrella ☂️',EV.umb+0.1,'Night: -180°C… made hot tea 🍵',EV.tea],
  ['STAGE 2','Venus: acid rain ☠️','It evaporates mid-air 💨',EV.evap,"Didn't even get wet 😎",EV.dry],
  ['STAGE 3','Mars: planet-wide dust storm 🌪️','Air is 100× thinner = breeze 🍃',EV.breeze,'Took a nap 😴',EV.nap],
  ['STAGE 4','Jupiter: the Great Red Spot 🌀','Cut in half ⚔️',EV.cut+0.15,'Storm: cancelled ✅',EV.metClick+0.1],
  ['STAGE 5','Neptune: diamond rain 💎','Blocked EVERY diamond ⚔️',EV.spin0+0.4,'…kept one 😏💎',EV.keep+0.2],
  ['FINAL BOSS','Earth: one banana peel 🍌','Cause of death: gravity 💀',EV.slip+0.35]];
// small stat chip per stage [text, colour, t0, t1]
const STATS=[['☀️ 430°C day · -180°C night','#FFD84A',4.0,13.6],['⚖️ 90× Earth\'s air pressure','#FF5A8A',15.0,23.6],['💨 100 km/h · but 1% air','#FFB36A',25.2,33.6],
  ['🌍 Storm wider than Earth','#FF8A5A',35.4,44.6],['💨 2,000+ km/h winds','#5AF0FF',45.4,54.6],['🌍 Gravity: 9.8 m/s²','#7DFF9A',57.0,61.4]];
function roundAt(t){for(let i=5;i>=0;i--)if(t>=R[i])return i;return -1}
