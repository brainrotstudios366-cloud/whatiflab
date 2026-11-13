initGL();initAssets();buildModels();buildPlanets();
// ---------- timeline ----------
const R=[3.6,11.2,19.0,26.8,34.6,42.6,50.4,60.4];
const EV={stomp1:7.7,lift1:8.5,pop1:9.0,army0:11.2,stompA:14.4,stompB:16.8,tst0:19.0,cat0:26.8,umb:27.9,caes0:34.6,thumb:37.4,stab0:39.4,clang:40.0,emp0:42.6,drop0:53.4,splash:55.6,endc:60.4,loop:64.4};
const ROUNDS=[['ROUND 1','1 Roman soldier ⚔️','…he got back up 🐜',9.5],['ROUND 2','100 Roman soldiers 🛡️','Not even a scratch 💅',17.1],['ROUND 3','Testudo formation 🐢','He\'s having a picnic 🍞',24.9],['ROUND 4','Flaming catapults 🔥','Same trick again ☂️',30.3],['ROUND 5','Julius Caesar himself 👑','PARRIED 😎🗡️',40.2],['ROUND 6','The ENTIRE Roman Empire 🏛️','He just walked through 🚶',46.6],['FINAL ROUND','One grape 🍇','Cause of death: grape 💀',56.2]];
function roundAt(t){for(let i=6;i>=0;i--)if(t>=R[i])return i;return -1}
