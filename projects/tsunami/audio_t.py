import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; D=60.0; N=int(SR*D); t=np.arange(N)/SR
rng=np.random.default_rng(5)
out=np.zeros((N,2))
def add(sig,start,gain=1.0,pan=0.0,buf=None):
    b=out if buf is None else buf
    i=int(start*SR);
    if i<0: sig=sig[-i:]; i=0
    n=min(len(sig),N-i)
    if n<=0: return
    l=np.sqrt(0.5*(1-pan)); r=np.sqrt(0.5*(1+pan))
    b[i:i+n,0]+=sig[:n]*gain*l; b[i:i+n,1]+=sig[:n]*gain*r
def env(n,a=0.005,d=0.2):
    x=np.arange(n)/SR; return np.minimum(1,x/a)*np.exp(-x/d)
def lp(x,fc,o=2): b,a=butter(o,fc/(SR/2),'low'); return lfilter(b,a,x)
def hp(x,fc,o=2): b,a=butter(o,fc/(SR/2),'high'); return lfilter(b,a,x)
def bp(x,f1,f2,o=2): b,a=butter(o,[f1/(SR/2),f2/(SR/2)],'band'); return lfilter(b,a,x)
def noise(d): return rng.standard_normal(int(d*SR))
def sweep(f0,f1,d,shape='sin',expo=True):
    n=int(d*SR); x=np.linspace(0,1,n); f=f0*(f1/f0)**x if expo else f0+(f1-f0)*x
    ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph) if shape=='sin' else 2*((ph/(2*np.pi))%1)-1
def boom(f0=50,d=1.5,dec=3):
    n=int(d*SR); x=np.arange(n)/SR; f=f0*(1+1.8*np.exp(-x*14))
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*dec)
def whoosh(d,up=True,f0=300,f1=4000):
    n=int(d*SR); x=np.linspace(0,1,n); s=rng.standard_normal(n); out_=np.zeros(n)
    # time-varying lowpass via blocks
    blk=1024
    for i in range(0,n,blk):
        k=x[i]; fc=(f0*(f1/f0)**(k if up else 1-k)); out_[i:i+blk]=lp(s[i:i+blk],min(fc,18000),1)
    return out_*np.sin(np.pi*x)**1.5*2.0

import json
ev=json.load(open('ev.json'))
def beep(f,d=0.09):
    n=int(d*SR); x=np.arange(n)/SR; return np.sin(2*np.pi*f*x)*env(n,0.002,0.05)
def thud(f0=80,d=0.35,g=1.0):
    return boom(f0,d,9)*g+lp(noise(d),400)*np.exp(-np.arange(int(d*SR))/SR*25)*0.6
def crunch(d=0.8):
    n=int(d*SR); x=np.arange(n)/SR
    c=bp(rng.standard_normal(n),200,6000)*np.exp(-x*6)*1.1
    m=sum(np.sin(2*np.pi*fq*x)*np.exp(-x*dd) for fq,dd in [(523,5),(781,6),(1187,7),(1630,9)])*0.1
    return c+m
def glass(t0,n=12,g=0.07,pan=(-1,1)):
    for k in range(n):
        m=int(0.12*SR); add(np.sin(2*np.pi*rng.uniform(3000,6500)*np.arange(m)/SR)*env(m,0.001,0.03),t0+rng.uniform(0,0.5),g,rng.uniform(*pan))
def drone(t0,t1,f=55,g=0.12):
    d=t1-t0; n=int(d*SR); x=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f*m*(1+0.002*k)*x+k) for m,k in [(1,0),(1,1),(1.5,2),(2,3),(0.5,4)])
    s=lp(s,400)*np.minimum(1,x/1.5)*np.minimum(1,(d-x)/0.8)*(0.8+0.2*np.sin(2*np.pi*0.2*x)); add(s,t0,g)
def heartbeat(t0,t1,per,g):
    tt=t0
    while tt<t1: add(boom(55,0.35,14),tt,g); add(boom(50,0.35,14),tt+0.22,g*0.7); tt+=per
def rumble(t0,d,g,fc=150):
    n=int(d*SR); x=np.arange(n)/SR; s=lp(rng.standard_normal(n),fc)*3*np.minimum(1,x/0.6)*np.minimum(1,(d-x)/0.8); add(s,t0,g)

D=28.0
drone(0.5,21.0,49,0.10); heartbeat(7.6,14.3,0.85,0.35)
# hook: floating ambience
add(lp(noise(2),400)*1.2,0,0.3); add(sweep(500,700,1.8)*0.05,0,0.5)
# gravity back
add(whoosh(0.5,True),1.35,0.5); add(boom(45,2.0,2),1.8,1.0)
for t0,r in ev['blobs']:
    if t0>7.4: continue
    g=min(1,0.15+r/14); m=int(0.6*SR); x=np.arange(m)/SR
    add(lp(rng.standard_normal(m),900+r*80)*np.exp(-x*(6-r*0.2))*1.4,t0,0.35*g,rng.uniform(-1,1)); add(boom(60+40/r,0.4,8),t0,0.3*g)
for t0,big in ev['ships']:
    add(boom(35 if big else 60,1.2,3),t0,0.9 if big else 0.4); add(lp(noise(1.2),700)*np.exp(-np.arange(int(1.2*SR))/SR*2.5)*1.6,t0,0.7 if big else 0.3)
add(lp(noise(5.5),600)*1.1,2.0,0.35)
# drawback: eerie suction + calm, then wave roar building
n=int(3.4*SR); x=np.arange(n)/SR; add(bp(rng.standard_normal(n),80,600)*1.4*np.minimum(1,x/1.0),7.5,0.3)
n=int(3.6*SR); x=np.arange(n)/SR; roar=lp(rng.standard_normal(n),250)*3*(x/3.6)**1.6+bp(rng.standard_normal(n),300,2500)*0.9*(x/3.6)**2; add(roar,10.9,0.85)
add(whoosh(0.5,True),14.05,0.6); add(boom(30,1.5,2.5),14.5,0.7)
# city: sirens + growing roar, people panic murmur, hit
def siren(t0,d,g,pan):
    n=int(d*SR); x=np.arange(n)/SR; f=750+250*np.sin(2*np.pi*0.3*x); s=np.sin(2*np.pi*np.cumsum(f)/SR); s=lp(s,1800)*np.minimum(1,x/0.5)*np.minimum(1,(d-x)/0.2); add(s,t0,g,pan)
siren(14.6,6.0,0.05,-0.5); siren(15.2,5.4,0.035,0.6)
amb=lp(noise(6.1),500)*1.2; add(amb,14.5,0.25)
n=int(6.1*SR); x=np.arange(n)/SR; r2=lp(rng.standard_normal(n),300)*3*np.minimum(1,(x/6.1)**1.3)+hp(lp(rng.standard_normal(n),4000),600)*0.6*(x/6.1)**2; add(r2,14.5,0.9)
add(lp(noise(1.2),900)*np.sin(np.pi*np.linspace(0,1,int(1.2*SR)))*1.5,17.5,0.35)
for k in range(10): add(crunch(0.5),18.3+k*0.22,0.3*(0.5+k/10),rng.uniform(-.8,.8))
add(boom(28,2.2,1.5),20.6,1.2); add(lp(noise(1.5),600)*np.exp(-np.arange(int(1.5*SR))/SR*1.5)*2,20.6,0.9)
# flood aftermath: water lapping, distant alarms
n=int(4.6*SR); x=np.arange(n)/SR; lap=lp(rng.standard_normal(n),500)*(0.6+0.4*np.sin(2*np.pi*0.4*x)**2)*1.3; add(lap,21.0,0.35)
siren(21.3,4.5,0.03,0.4)
# end
add(whoosh(0.6,True),25.0,0.5); add(boom(45,2.0,1.6),25.5,0.8)
for f in [220,261.6,329.6,440]:
    m=int(2.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*1.0)*0.12; add(s,25.5,1.0,rng.uniform(-.5,.5))
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
fade=np.ones(N); tt=np.arange(N)/SR; fade[tt>27.3]=np.linspace(1,0,(tt>27.3).sum()); out*=fade[:,None]
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
