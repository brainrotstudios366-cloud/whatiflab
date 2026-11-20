#!/bin/bash
cd /home/user/work/gleich; mkdir -p seg
S=(0 956 1912 2868 3825 4781 5737 6693 7649 8606 9562 10518 11474)
w(){ for i in "$@"; do [ -f seg/s$i.mp4 ] && continue; rm -f seg/s$i.part.mp4; node rscene.js g.html ${S[$i]} ${S[$((i+1))]} seg/s$i.mp4; done; }
w 0 3 6 9 & w 1 4 7 10 & w 2 5 8 11 & wait
printf "file 'seg/s%d.mp4'\n" 0 1 2 3 4 5 6 7 8 9 10 11 > concat.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 && ffmpeg -loglevel error -y -i video_only.mp4 -i sfx_norm.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart gleichungen_umstellen_lang.mp4 && echo ALL_OK
