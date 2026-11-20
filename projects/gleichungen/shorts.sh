#!/bin/bash
# usage: shorts.sh out.mp4 "TITLE1" "TITLE2" seg1start seg1end [seg2start seg2end]
cd /home/user/work/gleich; SRC=gleichungen_umstellen_lang.mp4; F=/usr/share/fonts/opentype/inter/Inter-Black.otf
OUT=$1; printf "%s" "$2" > t1.txt; printf "%s" "$3" > t2.txt; shift 3
if [ $# -eq 4 ]; then
 ffmpeg -loglevel error -y -ss $1 -to $2 -i $SRC -ss $3 -to $4 -i $SRC -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 16 -preset veryfast -c:a aac -b:a 192k tmp_cut.mp4
else
 ffmpeg -loglevel error -y -ss $1 -to $2 -i $SRC -c:v libx264 -crf 16 -preset veryfast -c:a aac -b:a 192k tmp_cut.mp4
fi
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 tmp_cut.mp4)
ffmpeg -loglevel error -y -i tmp_cut.mp4 -filter_complex "\
[0:v]scale=-2:1920,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];\
[0:v]scale=1080:-2[fg];\
[bg][fg]overlay=0:(H-h)/2-40[c];\
[c]drawtext=fontfile=$F:textfile=t1.txt:fontcolor=white:fontsize=78:x=(w-tw)/2:y=250:borderw=8:bordercolor=0x05061A,\
drawtext=fontfile=$F:textfile=t2.txt:fontcolor=0xFFD84A:fontsize=78:x=(w-tw)/2:y=350:borderw=8:bordercolor=0x05061A,\
drawtext=fontfile=$F:text='Ganzes Video auf dem Kanal':fontcolor=0x5AF0FF:fontsize=54:x=(w-tw)/2:y=1500:borderw=6:bordercolor=0x05061A:enable='gt(t,$D-6)',\
drawbox=x=0:y=1890:w='iw*t/$D':h=30:color=0x5AF0FF@0.9:t=fill[v]" -map "[v]" -map 0:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart $OUT
echo done $OUT $D
