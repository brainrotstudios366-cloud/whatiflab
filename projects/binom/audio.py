import numpy as np,json,wave
SR=48000;d=json.load(open('vo/timing.json'));DUR=d['dur'];N=int(DUR*SR)+SR
sfx=json.load(open('sfx.json'))
fx=np.zeros(N);mus=np.zeros(N);rng=np.random.default_rng(5)
tt=lambda d:np.arange(int(d*SR))/SR
def add(buf,s,t0,g=1.0):
    i=int(t0*SR)
    if i<0:s=s[-i:];i=0
    n=min(len(s),N-i)
    if n>0:buf[i:i+n]+=s[:n]*g
def bandnoise(d,lo,hi):
    n=rng.standard_normal(int(d*SR));F=np.fft.rfft(n);f=np.fft.rfftfreq(len(n),1/SR);F[(f<lo)|(f>hi)]=0;return np.fft.irfft(F,len(n))
def pencil(d):
    x=tt(d);s=bandnoise(d,2500,7000);s/=np.max(np.abs(s))+1e-9
    # stroke modulation: short strokes ~6-9 per second
    m=0.5+0.5*np.sin(2*np.pi*(7+rng.random()*2)*x+rng.random()*6);m=m**2
    env=np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.05);return s*m*env
def chime(base=1046.5):
    x=tt(1.3);s=np.zeros(len(x))
    for i,f in enumerate([base,base*1.25,base*1.5]):
        o=int(i*0.06*SR);xx=x[:len(x)-o];y=np.zeros(len(x));y[o:]=np.sin(2*np.pi*f*xx)*np.exp(-xx*3.5);s+=y
    return s*0.35
def buzz():x=tt(0.35);return (np.sin(2*np.pi*180*x)+0.5*np.sin(2*np.pi*120*x))*np.exp(-x*7)*0.5
def page():d=0.9;x=tt(d);s=bandnoise(d,300,5000);s/=np.max(np.abs(s));env=np.sin(np.pi*x/d)**2*np.exp(-x*1.5);return s*env
for t0,du in sfx['W']: add(fx,pencil(max(0.15,du)),t0,0.06)
for t0 in sfx['X']: add(fx,pencil(0.3),t0,0.09);add(fx,buzz(),t0+0.15,0.22)
for t0 in sfx['K']: add(fx,chime(),t0+0.1,0.22)
for t0,y in sfx['CAM'][1:]: add(fx,page(),t0-0.05,0.10)
# countdown ticks
T0=d['lines'][42]['t1']+0.3;T1=d['lines'][43]['t0']-0.3
for i in range(10): x=tt(0.05);add(fx,np.sin(2*np.pi*1800*x)*np.exp(-x*90),T0+i*(T1-T0)/10,0.18)
# music: warm soft keys, Cmaj7 - Am7 - Fmaj7 - G
mf=lambda m:440*2**((m-69)/12)
ch=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,59]];bar=3.2;t=0;ci=0
while t<DUR:
    c=ch[ci%4];x=tt(bar+0.6)
    pad=sum(np.sin(2*np.pi*mf(m+12)*x)*0.6+np.sin(2*np.pi*mf(m+12)*2.001*x)*0.12 for m in c)/4
    env=np.minimum(1,x/0.8)*np.minimum(1,(bar+0.6-x)/0.8);add(mus,pad*env*0.45,t)
    for b in range(8):
        if b%2==0:
            y=tt(0.6);nt=c[(b//2)%4]+24;add(mus,np.sin(2*np.pi*mf(nt)*y)*np.exp(-y*6)*0.22,t+b*bar/8)
    t+=bar;ci+=1
w=wave.open('vo/vo_full.wav');vsr=w.getframerate();v=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float64)/32768
v=np.interp(np.arange(int(len(v)*SR/vsr))/SR,np.arange(len(v))/vsr,v);vo=np.zeros(N);vo[:min(N,len(v))]=v[:N]
_k=int(0.35*SR);_c=np.concatenate([[0],np.cumsum(np.abs(vo))]);_i=np.arange(len(vo));envv=(_c[np.clip(_i+_k//2,0,len(vo))]-_c[np.clip(_i-_k//2,0,len(vo))])/_k;sp=np.clip(envv/0.03,0,1)
duck=0.05*(1-sp)+0.018*sp;cd=(np.arange(N)/SR>T0-0.5)&(np.arange(N)/SR<T1+0.3);duck[cd]=0.09
out=vo+fx+mus*duck;out=out/np.max(np.abs(out))*0.9
w=wave.open('mix.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close();print('ok')
