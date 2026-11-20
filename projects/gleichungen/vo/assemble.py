import numpy as np,json,wave
exec(open('lines_t.py').read())
def load(i):
    w=wave.open(f'c{i}.wav');a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768;return a,w.getframerate()
C=[load(i) for i in range(7)];sr=C[0][1]
out=[];t=0.5;lt=[]
for k,(c,s,e) in enumerate(T):
    a=C[c][0];s0=max(0,s-0.12);e0=min(len(a)/sr,e+0.3)
    if k+1<len(T) and T[k+1][0]==c: e0=min(e0,T[k+1][1]-0.08)
    if k>0 and T[k-1][0]==c: s0=max(s0,T[k-1][2]+0.08)
    seg=a[int(s0*sr):int(e0*sr)].copy();n=int(0.02*sr);seg[:n]*=np.linspace(0,1,n);seg[-n:]*=np.linspace(1,0,n)
    gap=0.9 if (k in CH or (k+1) in CH) else 0.35
    if k<3: gap=0.3
    if k==46: gap=11.0
    lt.append({'i':k,'t0':round(t+(s-s0),3),'t1':round(t+(e-s0),3),'off':round(t-s0,3),'c':c})
    out.append((t,seg));t+=len(seg)/sr+gap
tot=t+1.5
buf=np.zeros(int(tot*sr),np.float32)
for st,seg in out:i=int(st*sr);buf[i:i+len(seg)]+=seg
w=wave.open('vo_full.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(buf,-1,1)*32767).astype(np.int16).tobytes());w.close()
json.dump({'lines':lt,'dur':tot},open('timing.json','w'))
print('dur',round(tot,2))
for x in lt:print(x['i'],x['t0'],x['t1'])
