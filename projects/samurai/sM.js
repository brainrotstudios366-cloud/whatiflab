initGL();initAssets();buildModels();
// ---------- timeline ----------
const R=[3.4,17.0,28.5,40.0,53.0,61.6];
const EV={charge:3.4,leap:6.9,spin:8.15,sheath0:8.6,click:10.0,kneel:11.6,tea:12.6,
  met0:17.0,metUp:19.6,jump:20.9,cut:21.55,land:22.4,metClick:23.6,boom:23.9,
  wav0:28.5,raise:32.2,wcut:33.6,wClick:37.0,
  dra0:40.0,roar:43.2,fire0:44.2,fire1:46.6,djump:46.8,dcut:47.35,dland:48.1,bow:48.8,pat:50.4,
  peace:53.0,wait:55.0,swat0:55.6,swat1:57.3,land2:57.6,slap:59.0,
  endc:61.6,loop:65.6};
const ROUNDS=[['STAGE 1','1000 ninjas 🥷','*click* 😐',EV.click+0.05,'…then made tea 🍵',EV.tea+0.4],
  ['STAGE 2','A meteor ☄️','Cut in half 🔪',EV.cut+0.15,"Didn't even look back 😎",EV.boom+0.2],
  ['STAGE 3','A 100m tsunami 🌊','Split the ocean ⚔️🌊',EV.wcut+0.2,'Not even wet 💅',EV.wClick+0.1],
  ['STAGE 4','An ancient dragon 🐉','Blocked fire with a sword 🔥',EV.fire0+0.5,'Now it\'s his pet 🐶',EV.bow+0.4],
  ['FINAL BOSS','One mosquito 🦟','Cause of death: himself 💀',EV.slap+0.25]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
