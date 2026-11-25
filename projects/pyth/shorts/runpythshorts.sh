#!/bin/bash
for n in 1 2 3 4 5; do d=/home/user/work/pyth_s$n; cd $d; node dump.js >/dev/null; python3 audio.py >/dev/null; ffmpeg -loglevel error -y -i mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11,volume=2dB,alimiter=limit=0.93:level=false" -ar 48000 -ac 2 sfx_norm.wav; rm -rf seg; ./runshort.sh > render.log 2>&1; done
echo DONE > /home/user/work/pythshorts.done
