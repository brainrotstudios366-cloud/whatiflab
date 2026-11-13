initGL();initAssets();buildModels();buildPlanets();
// ---------- timeline ----------
const R=[2.2,5.6,9.8,13.6,17.2,21.6];
const EV={glasses:4.3,stopW:5.0,collapse:4.95,nova:5.6,wave:7.0,umb:10.35,warn:10.2,beam0:10.9,beam1:12.7,sit:13.85,ignite:14.55,peace:17.4,wait:18.4,drop0:19.0,bonk:20.25,endc:21.6,loop:24.6};
const ROUNDS=[['STAGE 1','The star is collapsing ⭐','He brought sunglasses 😎',4.6],['STAGE 2','HYPERNOVA 💥','Didn\'t even look back 😎',8.5],['STAGE 3','Gamma-ray burst ☢️','Blocked it with a leaf 🍃',11.7],['STAGE 4','Neutron star 🌀','Made a campfire 🔥😌',15.1],['FINAL ROUND','One space pebble 🪨','Cause of death: pebble 💀',20.7]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
