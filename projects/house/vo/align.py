import wave,numpy as np,json,re
L=['In my town, there are exactly twelve houses.', 'Everyone knows the number. We count them every night.', 'Because sometimes, there are thirteen.', 'The thirteenth house only shows up after midnight.', 'Its windows are always lit, and its door is always open.', 'Fifty years ago, a man walked inside, to see who lived there.', 'In the morning, the house was gone. And so was he.', 'But on some nights, you can still see him in the window... waving.', 'Last night, I counted the houses on my way home.', 'Eleven.', 'Twelve.', 'Thirteen.', "I ran home, and I didn't look back.", 'This morning, I counted again.', 'There were only eleven.', 'My house was the one missing.', 'So where did I sleep last night?', 'How many houses did you count? Tell me in the comments.']
ST=[0.4, 4.3, 7.6, 11.0, 14.2, 18.8, 23.6, 28.0, 33.4, 37.0, 38.3, 39.8, 41.6, 44.8, 47.4, 49.3, 51.9, 59.0]
def syl(w):
    w=re.sub('[^a-z]','',w.lower()) or 'x'
    if w in('two',):return 1
    if w=='hundred':return 2
    n=len(re.findall('[aeiouy]+',w));
    if w.endswith('e') and n>1 and not w.endswith('le'):n-=1
    return max(1,n)
out=[]
for k,(s,t0) in enumerate(zip(L,ST)):
    w=wave.open(f't{k}.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768;sr=w.getframerate()
    hop=int(sr*0.01);e=np.array([np.sqrt(np.mean(x[i:i+hop]**2)) for i in range(0,len(x)-hop,hop)])
    v=e>max(0.012,e.max()*0.06)
    # fill gaps < 90ms
    vv=v.copy();i=0;n=len(v)
    while i<n:
        if not vv[i]:
            j=i
            while j<n and not vv[j]:j+=1
            if j-i<9 and i>0 and j<n:vv[i:j]=True
            i=j
        else:i+=1
    segs=[];i=0
    while i<n:
        if vv[i]:
            j=i
            while j<n and vv[j]:j+=1
            segs.append((i*0.01,j*0.01));i=j
        else:i+=1
    words=s.split()
    import itertools
    grp=[[]]
    for i,wd in enumerate(words):
        grp[-1].append(i)
        if re.search(r'[,.!:?]$',wd) and i<len(words)-1:grp.append([])
    G=len(grp);S=len(segs)
    W=[syl(x)+0.6 for x in words]
    best=None
    gaps=list(range(1,S))
    if S>=G and G>1:
        for comb in itertools.combinations(gaps,G-1):
            bnd=[0]+list(comb)+[S]
            sc=0
            for g in range(G):
                d=sum(segs[j][1]-segs[j][0] for j in range(bnd[g],bnd[g+1]))
                sy=sum(W[i] for i in grp[g])
                sc+=(d/sy-0)**0
            # fit: per-group rate variance
            rates=[sum(segs[j][1]-segs[j][0] for j in range(bnd[g],bnd[g+1]))/sum(W[i] for i in grp[g]) for g in range(G)]
            m=sum(rates)/G;sc=sum((r-m)**2 for r in rates)/m/m
            if best is None or sc<best[0]:best=(sc,bnd)
    ws=[None]*len(words)
    if best:
        bnd=best[1]
        for g in range(G):
            sg=segs[bnd[g]:bnd[g+1]];tot=sum(b-a for a,b in sg);idx=grp[g];cum=np.cumsum([0]+[W[i] for i in idx]);cum=cum/cum[-1]*tot
            def tm(q,sg=sg):
                acc=0
                for a,b in sg:
                    if q<=acc+(b-a)+1e-9:return a+(q-acc)
                    acc+=b-a
                return sg[-1][1]
            for k2,i in enumerate(idx):ws[i]=[words[i],round(t0+tm(cum[k2]),3),round(t0+tm(cum[k2+1]),3)]
    else:
        tot=sum(b-a for a,b in segs);cum=np.cumsum([0]+W);cum=cum/cum[-1]*tot
        def tmap(q):
            acc=0
            for a,b in segs:
                if q<=acc+(b-a)+1e-9:return a+(q-acc)
                acc+=b-a
            return segs[-1][1]
        for i,wd in enumerate(words):ws[i]=[wd,round(t0+tmap(cum[i]),3),round(t0+tmap(cum[i+1]),3)]
    print(k,[(round(a,2),round(b,2)) for a,b in segs]);print('  ',ws)
    out.append({'t':t0,'d':round(len(x)/sr,3),'w':ws})
open('../vo.js','w').write('const VO='+json.dumps(out)+';\n')
