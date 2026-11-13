initGL();initAssets();buildModels();
// ---------- timeline ----------
const R=[3.4,16.4,28.0,39.6,51.6,61.6];
const EV={
  // dogs
  blink:5.6,stand:7.0,raise:7.5,swat:8.0,lick0:11.3,
  // vacuum
  vstop:19.4,suck0:19.6,suck1:21.5,vjump:21.5,vland:22.1,boop:22.6,ride:23.4,
  // ufo
  ufo0:28.0,ufoHover:29.6,beam0:30.0,lift0:30.4,inside:32.6,chaos0:32.8,drop:35.0,dland:35.9,ufoAway:35.3,ufoCrash:37.6,
  // bear
  bstop:42.3,roar1:42.6,yawn:43.9,roar2:45.4,hiss:46.6,flee:47.4,calm:49.6,
  // final
  eat:51.6,cuke:53.6,boss:55.0,look:55.6,jump:56.2,apex0:56.55,apex1:57.55,koland:58.0,
  endc:61.6,loop:65.6};
const BGD='rgba(15,10,30,0.66)',BGG='rgba(40,140,60,0.88)',BGB='rgba(40,110,190,0.88)',BGR='rgba(200,40,40,0.88)',BGP='rgba(130,60,190,0.88)';
const ROUNDS=[
  ['STAGE 1',[[R[0],'A dog army 🐕🐕🐕',BGD],[EV.swat+0.05,'One paw 🐾',BGG],[EV.lick0+0.5,'…then licked its paw 👅',BGB]]],
  ['STAGE 2',[[R[1],'A giant robot vacuum 🤖',BGD],[EV.boop+0.05,'Hacked it with one paw 🐾',BGG],[EV.ride+0.6,"Now it's his taxi 🚕",BGB]]],
  ['STAGE 3',[[R[2],'A UFO 🛸',BGD],[EV.lift0+0.1,'Abducted 👽',BGD],[EV.chaos0+0.1,'*chaos inside* 💥',BGR],[EV.dland+0.05,'Landed on its feet 😼',BGG],[EV.ufoCrash+0.05,'Aliens left Earth 🛸💨',BGB]]],
  ['STAGE 4',[[R[3],'A bear 🐻',BGD],[EV.yawn+0.1,'…yawned 🥱',BGD],[EV.hiss+0.05,'Hissed once 😾',BGG],[EV.flee+0.8,'Bear: -1000 aura 💀',BGB]]],
  ['FINAL BOSS',[[EV.boss,'One cucumber 🥒',BGD],[EV.koland+0.1,'Cause of death: cucumber 💀',BGR]]]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
