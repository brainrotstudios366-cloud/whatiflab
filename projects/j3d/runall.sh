#!/bin/bash
cd /home/claude/j3d
S=(0 225 450 675 900 1125 1350 1575 1800)
w(){ for i in "$@"; do node rscene.js jump3d.html ${S[$i]} ${S[$((i+1))]} seg/s$i.mp4; done; }
w 0 2 4 6 & w 1 3 5 7 & wait
printf "file 'seg/s%d.mp4'\n" 0 1 2 3 4 5 6 7 > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && echo CONCAT_OK
