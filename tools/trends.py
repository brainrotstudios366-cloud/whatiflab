#!/usr/bin/env python3
"""Summarize saved TikTok discovery_trending_list results: python3 tools/trends.py file1 [file2 ...]"""
import json,sys
for f in sys.argv[1:]:
    d=json.loads(open(f).read())
    if isinstance(d,list): d=json.loads(d[0]['text'])
    L=d['data']['list']
    rows=[]
    for h in L:
        th=sorted(h.get('trending_history',[]),key=lambda x:x['date'])
        vv=[int(x.get('views_daily') or 0) for x in th]
        v7=sum(vv[-7:]);vp=sum(vv[-14:-7]) or 1
        rows.append((h['hashtag_name'],h.get('hashtag_id'),int(h.get('posts') or 0),round(v7/vp,2),h.get('rank_position'),h.get('rank_change')))
    print('=====',f)
    print('TOP 40 by rank:',', '.join(r[0] for r in rows[:40]))
    print('FASTEST RISING (views last 7d / previous 7d):')
    for r in sorted(rows,key=lambda r:-r[3])[:30]:print('  #%s id=%s posts=%d growth=x%.2f rank=%s change=%s'%r)
