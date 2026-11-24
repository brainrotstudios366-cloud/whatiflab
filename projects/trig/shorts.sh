#!/bin/bash
# shorts.sh out.mp4 "TITLE1" "TITLE2" a1 b1 [a2 b2]
cd /home/user/work/trig; SRC=trig_lang.mp4; F=fonts/WnznHAc5bAfYB2QRah7pcpNvOx-pjRV6SII.ttf
OUT=$1; printf "Ganzes Video auf dem Kanal  " > t3.txt; printf "%s " "$2" > t1.txt; printf "%s " "$3" > t2.txt; shift 3
if [ $# -eq 4 ]; then
 ffmpeg -loglevel error -y -ss $1 -to $2 -i $SRC -ss $3 -to $4 -i $SRC -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 16 -preset veryfast -c:a aac -b:a 192k tmp_cut.mp4
else
 ffmpeg -loglevel error -y -ss $1 -to $2 -i $SRC -c:v libx264 -crf 16 -preset veryfast -c:a aac -b:a 192k tmp_cut.mp4
fi
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 tmp_cut.mp4)
ffmpeg -loglevel error -y -loop 1 -i paper_v.png -i tmp_cut.mp4 -filter_complex "\
[1:v]scale=1240:-2,crop=1080:ih:80:0[fg];[0:v][fg]overlay=0:600:shortest=1[c];\
[c]drawtext=fontfile=$F:textfile=t1.txt:expansion=none:fontcolor=0xD63A3A:fontsize=${FS:-110}:x=(w-tw)/2:y=250,\
drawtext=fontfile=$F:textfile=t2.txt:expansion=none:fontcolor=0x1D3B6E:fontsize=96:x=(w-tw)/2:y=390,\
drawtext=fontfile=$F:textfile=t3.txt:expansion=none:fontcolor=0x1D6FE0:fontsize=72:x=(w-tw)/2:y=1440:enable='gt(t,$D-7)',\
drawbox=x=0:y=1880:w='iw*t/$D':h=40:color=0x1D3B6E@0.85:t=fill[v]" -map "[v]" -map 1:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 30 -c:a copy -movflags +faststart -shortest $OUT
echo done $OUT $D
