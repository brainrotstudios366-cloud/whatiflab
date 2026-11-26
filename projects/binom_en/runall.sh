#!/bin/bash
cd /home/user/work/binom_en; mkdir -p seg
S=(0 1225 2450 3675 4900 6125 7350 8575 9800 11025 12250 13475 14700)
w(){ for i in "$@"; do [ -f seg/s$i.mp4 ] && continue; rm -f seg/s$i.part.mp4; node rscene.js ${S[$i]} ${S[$((i+1))]} seg/s$i.mp4; done; }
w 0 3 6 9 & w 1 4 7 10 & w 2 5 8 11 & wait
printf "file 'seg/s%d.mp4'\n" 0 1 2 3 4 5 6 7 8 9 10 11 > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && ffmpeg -loglevel error -y -i video_only.mp4 -i sfx_norm.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart binom_en_long.mp4 && echo ALL_OK
