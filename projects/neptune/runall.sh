#!/bin/bash
cd /home/claude/neptune; mkdir -p seg
S=(0 284 568 852 1136 1420 1704 1988 2268)
w(){ for i in "$@"; do [ -f seg/s$i.mp4 ] && continue; rm -f seg/s$i.part.mp4; node rscene.js neptune.html ${S[$i]} ${S[$((i+1))]} seg/s$i.mp4; done; }
w 0 2 4 6 & w 1 3 5 7 & wait
printf "file 'seg/s%d.mp4'\n" 0 1 2 3 4 5 6 7 > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && ffmpeg -loglevel error -y -i video_only.mp4 -i sfx_norm.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart diamond_rain_neptune.mp4 && echo ALL_OK
