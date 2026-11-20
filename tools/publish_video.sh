#!/bin/bash
# Publish a finished video to the "videos" branch (the owner's download place on github.com).
# usage: tools/publish_video.sh <final.mp4> <slot: morgens|mittags|abends> <slug> [texts.txt]
# - makes a chat/download copy (<10 MB, 2-pass x264) next to the input: <name>_chat.mp4  (send THIS one with SendUserFile)
# - makes an upload copy (~15 MB, crf 22) and pushes it as videos/<date>_<slot>_<slug>_<sec>s.mp4 (+ .txt with the texts)
# - the branch is ONE orphan commit, force-pushed; files older than KEEP_DAYS are dropped, so the repo never grows.
set -e
IN="$1"; SLOT="$2"; SLUG="$3"; TXT="$4"; KEEP_DAYS=${KEEP_DAYS:-7}
REPO_URL=$(git -C "$(dirname "$0")/.." remote get-url origin)
D=$(TZ=Europe/Vienna date +%F)
SEC=$(printf "%.0f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")")
NAME="${D}_${SLOT}_${SLUG}_${SEC}s"
BASE="${IN%.mp4}"
# chat copy < 10 MB
VB=$(( (9300*8/SEC) - 96 ))k
( cd /tmp && ffmpeg -loglevel error -y -i "$IN" -c:v libx264 -preset slower -b:v $VB -pass 1 -passlogfile /tmp/pv2 -an -f mp4 /dev/null && \
  ffmpeg -loglevel error -y -i "$IN" -c:v libx264 -preset slower -b:v $VB -pass 2 -passlogfile /tmp/pv2 -c:a aac -b:a 96k -movflags +faststart "${BASE}_chat.mp4" )
# upload copy
ffmpeg -loglevel error -y -i "$IN" -c:v libx264 -preset slow -crf 22 -maxrate 3M -bufsize 6M -c:a aac -b:a 160k -movflags +faststart /tmp/pv_up.mp4
W=/tmp/videos_branch; rm -rf $W; mkdir -p $W; cd $W; git init -q
git remote add origin "$REPO_URL"
if git fetch -q --depth 1 origin videos 2>/dev/null; then git checkout -q -b videos FETCH_HEAD; else git checkout -q --orphan videos; fi
mkdir -p videos
cp /tmp/pv_up.mp4 "videos/$NAME.mp4"; [ -n "$TXT" ] && cp "$TXT" "videos/$NAME.txt"
CUT=$(TZ=Europe/Vienna date -d "-$KEEP_DAYS days" +%F)
for f in videos/*; do d=$(basename "$f" | cut -c1-10); [[ "$d" < "$CUT" ]] && rm -f "$f"; done
{ echo "# The What If Lab – fertige Videos (letzte $KEEP_DAYS Tage)"; echo; echo "Tippe auf ein Video → oben rechts **Download** (⋯ → Download auf dem Handy)."; echo;
  for f in $(ls -r videos/*.mp4); do n=$(basename "$f" .mp4); echo "- [$n]($f)$( [ -f videos/$n.txt ] && echo " · [Texte](videos/$n.txt)")"; done; } > README.md
printf '*.wav\n' > .gitignore
git add -A
TREE=$(git write-tree)
C=$(git -c user.name="What If Lab Bot" -c user.email="noreply@anthropic.com" commit-tree $TREE -m "videos: $NAME")
git -c push.negotiate=true push -q -f origin $C:refs/heads/videos
echo "PUBLISHED videos/$NAME.mp4"
echo "CHAT_FILE ${BASE}_chat.mp4"
