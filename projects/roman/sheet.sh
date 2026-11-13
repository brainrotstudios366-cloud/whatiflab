#!/bin/bash
# usage: sheet.sh out.jpg t1 t2 ... (uses rt_<t>.jpg), 5 per row
out=$1; shift; args=""; f=""; i=0; for t in "$@"; do args="$args -i rt_$t.jpg"; f="$f[$i]scale=300:-1[s$i];"; i=$((i+1)); done
n=$i; while [ $((n%5)) -ne 0 ]; do args="$args -i rt_$1.jpg"; f="$f[$n]scale=300:-1,drawbox=c=black:t=fill[s$n];"; n=$((n+1)); done
rows=""; r=0; for ((j=0;j<n;j+=5)); do f="$f[s$j][s$((j+1))][s$((j+2))][s$((j+3))][s$((j+4))]hstack=5[r$r];"; rows="$rows[r$r]"; r=$((r+1)); done
if [ $r -gt 1 ]; then f="$f${rows}vstack=$r"; else f="${f%;}"; f="${f%\[r0\]}"; fi
ffmpeg -v error -y $args -filter_complex "$f" $out
