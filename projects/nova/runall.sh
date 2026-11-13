#!/bin/bash
cd /home/claude/nova
S=(0 188 375 563 750)
w(){ for i in "$@"; do [ -f seg/s$i.mp4 ] && continue; node rscene.js nova.html ${S[$i]} ${S[$((i+1))]} seg/s$i.mp4; done; }
w 0 2 & w 1 3 & wait
printf "file 'seg/s%d.mp4'\n" 0 1 2 3 > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && ffmpeg -loglevel error -y -i video_only.mp4 -i sfx_norm.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart hypernova_vs_ant_25s.mp4 && echo ALL_OK
