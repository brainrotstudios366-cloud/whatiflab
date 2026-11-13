import wave,numpy as np,json,re
L=["Everyone in this village laughed at Leo.","His dad was a poor baker, so Leo sold bread from a tiny wooden cart.","Every single day, Max and his friends knocked his bread into the mud.","\"Bread boy will never be anything!\"","One night, Leo packed his bag, and left without a word.","In the big city, he baked day and night. He failed. Again. And again.","Five years later...","A giant golden truck rolled into the village square.","On the side, in huge letters: Leo's Bakery. Two hundred shops, worldwide.","The whole village went silent.","Then Leo saw someone he knew.","Selling bread from his old tiny cart... was Max.","Max couldn't even look at him.","Leo walked over, bought every single loaf, and said:","\"Never laugh at bread.\"","Should Leo give Max a job? Tell me in the comments!"]
ST=[0.25,2.9,7.6,12.0,14.9,19.0,26.4,28.0,31.6,38.0,40.0,42.4,46.4,48.4,52.6,58.6]
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
