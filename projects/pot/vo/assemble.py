import numpy as np,json,wave
L=json.load(open('lines.json'))
CH=[i for i,p in enumerate(L) if p.startswith('Kapitel')]
segs=[];sr=None
for i in range(len(L)):
    w=wave.open(f'l{i:02d}.wav');sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    e=np.abs(a);thr=0.02;idx=np.where(e>thr)[0];s=max(0,idx[0]-int(0.05*sr));t=min(len(a),idx[-1]+int(0.12*sr));a=a[s:t].copy()
    n=int(0.015*sr);a[:n]*=np.linspace(0,1,n);a[-n:]*=np.linspace(1,0,n);segs.append(a)
t=0.6;lt=[];parts=[]
for i,a in enumerate(segs):
    lt.append({'i':i,'t0':round(t,3),'t1':round(t+len(a)/sr,3)});parts.append((t,a))
    gap=0.8
    if i<3: gap=0.35
    if i in CH: gap=0.8
    if i+1 in CH: gap=1.0
    if L[i].startswith('Aufgabe eins: drei hoch'): gap=13.0
    t+=len(a)/sr+gap
tot=t+6.6
buf=np.zeros(int(tot*sr),np.float32)
for st,a in parts:k=int(st*sr);buf[k:k+len(a)]+=a
w=wave.open('vo_full.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(buf,-1,1)*32767).astype(np.int16).tobytes());w.close()
json.dump({'lines':lt,'dur':tot,'text':L},open('timing.json','w'),ensure_ascii=False)
open('../vo.js','w').write('const VO='+json.dumps([[l['t0'],l['t1']] for l in lt])+';const VOTXT='+json.dumps(L,ensure_ascii=False)+f';const VO_DUR={round(tot,2)};\n')
print('dur',round(tot,2),'chapters',CH)
