import numpy as np, wave
SR=44100; D=13.0; N=int(SR*D); t=np.arange(N)/SR
rng=np.random.default_rng(3)
out=np.zeros((N,2))
def add(sig,start,gain=1.0,pan=0.0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n<=0: return
    l=np.sqrt(0.5*(1-pan)); r=np.sqrt(0.5*(1+pan))
    out[i:i+n,0]+=sig[:n]*gain*l; out[i:i+n,1]+=sig[:n]*gain*r
def env(n,a=0.005,d=0.2):
    x=np.arange(n)/SR; return np.minimum(1,x/a)*np.exp(-x/d)
def lp(x,k):  # one-pole lowpass
    y=np.zeros_like(x); a=k; acc=0.0
    for i in range(len(x)): acc+=a*(x[i]-acc); y[i]=acc
    return y
# ---- music (120bpm) ----
BPM=124; beat=60/BPM
def kick():
    n=int(0.35*SR); x=np.arange(n)/SR; f=50+120*np.exp(-x*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*7)
def hat():
    n=int(0.06*SR); s=rng.standard_normal(n); s=s-np.concatenate([[0],s[:-1]]); return s*env(n,0.001,0.02)*0.3
def clap():
    n=int(0.18*SR); s=rng.standard_normal(n)*env(n,0.002,0.06); return s*0.5
def synth(freq,dur):
    n=int(dur*SR); x=np.arange(n)/SR
    w=sum(np.sin(2*np.pi*freq*k*x+0.3*k)/k for k in range(1,6))
    return w*np.minimum(1,x/0.01)*np.exp(-x*3.5)*0.35
bass=[55,55,65.4,49]; chords=[[220,277.2,329.6],[196,246.9,293.7],[261.6,329.6,392],[174.6,220,261.6]]
music=np.zeros((N,2))
def mus_add(sig,start,g,pan=0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n>0: music[i:i+n,0]+=sig[:n]*g*np.sqrt(0.5*(1-pan)); music[i:i+n,1]+=sig[:n]*g*np.sqrt(0.5*(1+pan))
nb=int(D/beat)+1
for b in range(nb):
    st=b*beat; bar=(b//4)%4
    mus_add(kick(),st,0.9)
    mus_add(hat(),st+beat/2,0.7,0.3)
    if b%2==1: mus_add(clap(),st,0.5)
    n=int(beat*0.9*SR); x=np.arange(n)/SR
    bs=np.sign(np.sin(2*np.pi*bass[bar]*x))*0.25*np.exp(-x*4)
    mus_add(lp(bs,0.08),st,0.9)
    if b%4 in (0,2):
        for f in chords[bar]: mus_add(synth(f,beat*1.8),st+beat*0.5,0.35,rng.uniform(-.4,.4))
# music gating: on until 3.0 (tape stop), off until 8.0, on after (lower under end card)
g=np.ones(N); g[(t>=3.0)&(t<8.0)]=0
g[t>=10.6]=np.clip(1-(t[t>=10.6]-10.6)/0.6*0.45,0.55,1)
# tape stop effect 2.85-3.0: time-stretched slowdown
ts=int(2.82*SR); te=int(3.0*SR); seg=music[ts:te].copy()
L=te-ts; pos=np.cumsum(np.linspace(1,0.05,L)); pos=np.clip(pos,0,L-1).astype(int)
music[ts:te]=seg[pos]*np.linspace(1,0.2,L)[:,None]
fadein=(t>=8.0)&(t<8.08); g[fadein]=(t[fadein]-8.0)/0.08
out+=music*g[:,None]*0.55
# ---- city ambience ----
noise=rng.standard_normal(N)
amb=lp(noise,0.02)*2.2+lp(rng.standard_normal(N),0.15)*0.15
ag=np.ones(N)*0.5
ag[(t>=5.6)&(t<8.0)]=0.32
out[:,0]+=amb*ag*0.5; out[:,1]+=np.roll(amb,2000)*ag*0.5
# electric hum that dies at blackout
hum=(np.sin(2*np.pi*60*t)+0.4*np.sin(2*np.pi*120*t))*0.05
hg=np.ones(N); hg[(t>=5.6)&(t<8.0)]=0
out+=(hum*hg)[:,None]
# ---- countdown ticks ----
def beep(f,d=0.09):
    n=int(d*SR); x=np.arange(n)/SR; return np.sin(2*np.pi*f*x)*env(n,0.002,0.05)
for s in [0.0,1.0,2.0]: add(beep(1200),s,0.35)
for s in [4.0,5.0,6.0,7.0]: add(beep(900),s,0.25)
# ---- magnets vanish: whoosh + low boom ----
def whoosh(d,up=True):
    n=int(d*SR); x=np.linspace(0,1,n); s=rng.standard_normal(n)
    out_=np.zeros(n); acc=0
    k=0.02+0.25*(x if up else 1-x)
    for i in range(n): acc+=k[i]*(s[i]-acc); out_[i]=acc
    return out_*np.sin(np.pi*x)**1.5*2.5
def boom(f0=60,d=1.2):
    n=int(d*SR); x=np.arange(n)/SR; f=f0*(1+1.5*np.exp(-x*12))
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*3)
add(whoosh(0.5,False),2.75,0.6); add(boom(48,1.3),3.0,0.9)
# speaker pop
add(rng.standard_normal(int(0.02*SR))*env(int(0.02*SR),0.0005,0.005),3.0,0.5)
# ---- engines die: descending whine ----
n=int(0.9*SR); x=np.arange(n)/SR; f=320*np.exp(-x*2.2)+40
w=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.12*np.exp(-x*2); add(lp(w,0.1),4.2,1.0,-0.4)
# tire screech before crash
n=int(0.7*SR); x=np.arange(n)/SR
scr=np.sin(2*np.pi*(1900+250*np.sin(2*np.pi*13*x))*x)*0.12*np.sin(np.pi*x/0.7)
add(scr+rng.standard_normal(n)*0.03*np.sin(np.pi*x/0.7),4.45,0.8,-0.5)
# ---- crash at 5.12 ----
n=int(1.4*SR); x=np.arange(n)/SR
crash=rng.standard_normal(n)*np.exp(-x*5)*0.8
metal=sum(np.sin(2*np.pi*f*x)*np.exp(-x*d) for f,d in [(523,4),(781,5),(1187,6),(1630,8),(2210,9)])*0.12
add(crash+metal+boom(70,0.6)[:n].tolist()+[0]*0 if False else crash+metal,5.12,0.9,-0.5)
add(boom(70,0.6),5.12,0.8,-0.3)
# glass tinkle
for k in range(14):
    add(np.sin(2*np.pi*rng.uniform(3000,6000)*np.arange(int(0.12*SR))/SR)*env(int(0.12*SR),0.001,0.03),5.2+rng.uniform(0,0.5),0.08,rng.uniform(-.8,0))
# ---- blackout thunk at 5.6 ----
add(boom(42,1.6),5.6,1.0)
n=int(0.25*SR); add(np.sin(2*np.pi*100*np.arange(n)/SR)*np.linspace(0.2,0,n)*np.sign(np.sin(2*np.pi*7*np.arange(n)/SR)),5.62,0.4)
# crowd gasp (filtered noise swell)
n=int(1.2*SR); xx=np.linspace(0,1,n); gs=lp(rng.standard_normal(n),0.25)*np.sin(np.pi*xx)**0.8*1.5
add(gs,5.75,0.5)
# ---- birds at 7.0: flaps + chirps ----
for k in range(30):
    s=7.0+rng.uniform(0,1.0); n=int(0.07*SR)
    add(lp(rng.standard_normal(n),0.3)*env(n,0.003,0.02)*1.2,s,0.5,rng.uniform(-1,1))
for k in range(12):
    s=7.0+rng.uniform(0,0.95); n=int(0.12*SR); x=np.arange(n)/SR; f=2600+1800*np.sin(2*np.pi*18*x)
    add(np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,0.004,0.05),s,0.12,rng.uniform(-1,1))
# ---- return at 8.0: riser + impact ----
n=int(0.6*SR); x=np.arange(n)/SR; f=100*np.exp(x*4.2)
add(np.sin(2*np.pi*np.cumsum(f)/SR)*(x/0.6)**2*0.25,7.4,1.0)
add(whoosh(0.6,True),7.42,0.5)
add(boom(55,1.0),8.0,0.9)
# ---- end card whoosh ----
add(whoosh(0.5,True),10.35,0.4)
# master
out*=0.9/np.max(np.abs(out))
fade=np.ones(N); fade[t>12.4]=np.linspace(1,0,(t>12.4).sum()); out*=fade[:,None]
pcm=(out*32767).astype(np.int16)
w=wave.open('audio.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('ok')
