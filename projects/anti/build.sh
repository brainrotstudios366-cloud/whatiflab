cd /home/claude/anti; python3 - <<'P'
s=open('moon.html').read().replace('const W=1080,H=1920,FPS=30,DUR=60,SUB=3;','const W=1080,H=1920,FPS=30,DUR=73,SUB=2;')
i=s.rindex('</script></body></html>');s=s[:i]+'</script><script>\n'+open('aA.js').read()+'\n</script></body></html>'
open('anti.html','w').write(s)
P
