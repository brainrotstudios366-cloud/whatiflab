#!/bin/bash
cd /home/claude/jump
S=(0 345 570 810 1020 1260 1463 1800)
w(){ for i in "$@"; do node rscene.js jump.html ${S[$i]} ${S[$((i+1))]} seg/s$i.mp4; done; }
w 0 3 5 & w 1 2 4 6 & wait
printf "file 'seg/s%d.mp4'\n" 0 1 2 3 4 5 6 > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && echo CONCAT_OK
