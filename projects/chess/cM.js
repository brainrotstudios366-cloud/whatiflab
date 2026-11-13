initGL();initAssets();buildModels();
// ---------- timeline ----------
const R=[3.4,15.2,27.0,38.8,51.0,61.6];
const EV={
  // knight
  kh:[4.3,5.2,6.1,7.0,7.9],kland:8.4,squint:9.1,cap1:9.7,hit1:10.15,
  // bishop
  bz:[16.0,17.4,17.95,18.5,19.0,19.55],rage:19.8,bfly:21.7,bfall:22.25,
  // rook
  rdrop:27.0,rland:27.55,snort1:28.3,snort2:28.9,charge:29.8,slow0:30.75,dstep:30.85,slow1:31.6,redge:31.95,rboom:33.9,
  // queen
  qdesc:38.8,qland:39.4,qs1:40.9,qs2:42.1,qcharge:43.3,qcap:43.6,qhit:44.05,promo0:44.5,promo:45.1,
  // final
  peace:51.0,dstep2:53.0,wake:54.4,turn:54.8,boss:55.2,ep:56.3,ephit:56.7,koland:57.7,
  endc:61.6,loop:65.6};
// caption sequence per round: [label, [time,text,bg]...]
const BGD='rgba(15,10,30,0.66)',BGG='rgba(40,140,60,0.88)',BGB='rgba(40,110,190,0.88)',BGR='rgba(200,40,40,0.88)',BGP='rgba(130,60,190,0.88)';
const ROUNDS=[
  ['STAGE 1',[[R[0],'A knight 🐴',BGD],[EV.kland+0.1,'Landed diagonal… 🤨',BGD],[EV.hit1+0.05,'Pawns capture diagonally 💀',BGG],[EV.hit1+1.6,'+1000 aura ♟️',BGB]]],
  ['STAGE 2',[[R[1],'A bishop ⛪',BGD],[EV.rage+0.1,"Can't reach light squares 🤡",BGG],[EV.bfall+0.7,'Fell off the board 💀',BGB]]],
  ['STAGE 3',[[R[2],'A rook 🏰',BGD],[EV.dstep+0.1,'First move: 2 squares 😎',BGG],[EV.rboom+0.05,'Rook: -1000 aura 💀',BGB]]],
  ['STAGE 4',[[R[3],'The queen 👑',BGD],[EV.qhit+0.05,'Pawn takes queen 💀',BGG],[EV.promo+0.1,'…and got PROMOTED 👑✨',BGP]]],
  ['FINAL BOSS',[[EV.boss,'One tiny pawn ♟️',BGD],[EV.ephit+0.25,'Google en passant 💀',BGR],[EV.ephit+1.9,'Holy hell 🔥',BGR]]]];
function roundAt(t){for(let i=4;i>=0;i--)if(t>=R[i])return i;return -1}
