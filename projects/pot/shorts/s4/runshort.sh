#!/bin/bash
cd /home/user/work/pot_s4; mkdir -p seg
H=$(( 679 / 2 ))
[ -f seg/a.mp4 ] || node rscene.js 0 $H seg/a.mp4 & [ -f seg/b.mp4 ] || node rscene.js $H 679 seg/b.mp4 & wait
printf "file 'seg/a.mp4'\nfile 'seg/b.mp4'\n" > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && ffmpeg -loglevel error -y -i video_only.mp4 -i sfx_norm.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart short.mp4 && echo ALL_OK
