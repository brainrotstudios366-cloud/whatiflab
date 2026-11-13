cd "$(dirname "$0")"; P=$1; python3 - "$P" <<'PY'
import sys,re
P=sys.argv[1]
src=open(P+'.js').read()
m=re.search(r'const DURA=(\d+)',src);dur=m.group(1)
src=src.replace('//@@HELPERS@@',open('helpers.js').read()).replace('//@@COMMON@@',open('common.js').read())
s=open('moon.html').read().replace('const W=1080,H=1920,FPS=30,DUR=60,SUB=3;','const W=1080,H=1920,FPS=30,DUR=%s,SUB=2;'%dur)
i=s.rindex('</script></body></html>');s=s[:i]+'</script><script>\n'+src+'\n</script></body></html>'
open(P+'.html','w').write(s)
PY
