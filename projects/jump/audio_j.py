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

JUMPS=[[1.2,1.1],[2.3,1.1],[3.4,1.2],[4.6,1.3],[5.9,1.5],[7.4,1.6],[9.0,2.0],[11.0,2.0],[13.0,2.2],[15.2,2.4],[17.6,2.4],[20.0,2.4],[22.4,2.4],[24.8,2.4],[27.2,2.4],[29.6,2.6],[32.2,2.4],[34.6,2.4],[37.0,3.0],[40.0,2.6],[42.6,2.8],[45.4,1.2],[46.6,1.2],[47.8,1.2],[49.0,7.0]]
# beat-ish pulse that speeds up (energy)
tt=1.2;k=0
while tt<49:
    add(boom(55,0.3,14),tt,0.25); per=max(0.28,0.62-tt*0.008); tt+=per; k+=1
drone(9,49,55,0.07); drone(37,56,41,0.09)
# city ambience early
add(lp(noise(15),500)*1.2,0,0.28)
# cold open
add(lp(noise(1.2),200)*1.5,0,0.3); add(whoosh(0.4,True),0.8,0.5)
for i,(ts,D) in enumerate(JUMPS):
    n=i+1
    # counter blip rising pitch
    f=320*2**(min(n,24)/6); m=int(0.12*SR); x=np.arange(m)/SR; add((np.sin(2*np.pi*f*x)+0.4*np.sin(2*np.pi*2*f*x))*np.exp(-x*25),ts+0.02,0.16)
    # launch
    g=min(1,0.25+n*0.04); add(whoosh(min(1.2,0.35+n*0.04),True,300,3000+n*250),ts+0.05,0.4*g)
    if n<=9:
        tl=ts+D-0.25; add(thud(100-n*6,0.4+n*0.05,0.6+n*0.12),tl,min(1,0.3+n*0.08))
        if n>=5: add(crunch(0.4+n*0.05),tl,0.15+n*0.04); 
        if n>=7: add(boom(40,1.0,4),tl,0.5)
    elif n<=18:
        tl=ts+D-0.55; add(boom(max(22,50-n*1.5),1.6+n*0.05,2.5),tl,1.0); add(lp(noise(1.2),700)*np.exp(-np.arange(int(1.2*SR))/SR*2.5)*1.6,tl,0.7); add(crunch(0.9),tl,0.5); glass(tl+0.05,12,0.05)
        # wind during apex
        d=D-0.6; m=int(d*SR); x=np.arange(m)/SR; add(bp(rng.standard_normal(m),150,1500)*1.2*np.minimum(1,x/0.3)*np.minimum(1,(d-x)/0.2)*(1.0 if n<17 else 0.4),ts,0.35)
    elif n<=24:
        tl=ts+D-0.35; add(boom(30,1.4,2.2),tl,0.6)
add(sweep(200,1200,2.0)*np.minimum(1,np.arange(int(2*SR))/SR)*0.12,13.2,0.5)
add(whoosh(1.4,True,200,8000),35.6,0.5); add(boom(28,2.5,1.4),37.0,0.9)
# J25 escape: big riser + ethereal pad
m=int(2.4*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(90*np.exp(x*1.6))/SR)*(x/2.4)**2*0.3,47.0,0.9)
add(boom(30,3.0,1.0),49.0,1.0)
for f in [110,164.8,220,277.2]:
    m=int(7*SR); x=np.arange(m)/SR; s=np.sin(2*np.pi*f*x+np.sin(2*np.pi*0.2*x))*np.minimum(1,x/1.5)*np.minimum(1,(7-x)/1.5)*0.06; add(s,49.2,1.0,rng.uniform(-.5,.5))
# end
add(boom(40,2.5,1.5),56.0,1.0); add(whoosh(0.7,True),55.4,0.5)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*0.9)*0.12; add(s,56.0,1.0,rng.uniform(-.5,.5))
add(whoosh(0.5,True),59.0,0.55)
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
