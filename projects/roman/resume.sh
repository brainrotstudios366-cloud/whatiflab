#!/bin/bash
cd /home/claude/roman
S=(0 244 488 732 976 1220 1464 1708 1950)
r(){ [ -f seg/s$1.mp4 ] || node rscene.js roman.html ${S[$1]} ${S[$(($1+1))]} seg/s$1.mp4; }
r 5 & r 6 & r 7 & wait
./runall.sh
