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

drone(3.0,42.0,55,0.10); drone(3.0,42.0,82.4,0.035); drone(48.75,51.0,49,0.12)
heartbeat(11.8,18.8,0.9,0.28); heartbeat(42.4,46.8,0.9,0.3)
# night city ambience + crickets
amb=lp(noise(11.5),450)*1.1+hp(lp(noise(11.5),3000),800)*0.1; add(amb,0,0.3)
def crickets(t0,d,g):
    n=int(d*SR); x=np.arange(n)/SR; s=np.sin(2*np.pi*4300*x)*(np.sin(2*np.pi*28*x)>0.3)*(np.sin(2*np.pi*0.9*x)>0)*0.2; add(s*np.minimum(1,x/0.5)*np.minimum(1,(d-x)/0.5),t0,g,0.3)
crickets(0,11.5,0.12); crickets(27,7,0.15)
# cold open
n=int(0.85*SR); x=np.arange(n)/SR; add(lp(rng.standard_normal(n),400)*3*np.minimum(1,x/0.2),0,0.6); add(boom(40,0.8,4),0.6,0.6)
add(whoosh(0.4,True),0.5,0.4); add(sweep(1800,200,0.6)*np.exp(-np.arange(int(0.6*SR))/SR*5)*0.3,0.85,0.5); add(whoosh(0.4,True),1.25,0.5); add(boom(50,0.8,4),1.6,0.4)
for k in range(3): add(beep(1050 if k%2==0 else 850,0.18),1.9+k*0.22,0.25)
add(beep(1300),2.0,0.3)
# moon pops out at 3.0: magical "pop" + reverse sparkle + boom
add(whoosh(0.6,False),2.6,0.4); add(boom(42,2.0,2.2),3.0,0.9)
m=int(0.8*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(2400*np.exp(-x*3))/SR)*np.exp(-x*4)*0.25,3.0,0.6)
for k in range(20): add(np.sin(2*np.pi*rng.uniform(2500,6000)*np.arange(int(0.1*SR))/SR)*env(int(0.1*SR),0.001,0.03),3.0+rng.uniform(0,0.8),0.06,rng.uniform(-1,1))
add(lp(noise(1.3),900)*np.sin(np.pi*np.linspace(0,1,int(1.3*SR)))**0.8*1.4,3.6,0.3)  # crowd murmur
add(whoosh(0.5,True),11.15,0.6)
# tide drains: waves fading + draining hiss/suck
n=int(7.5*SR); x=np.arange(n)/SR; waves=lp(rng.standard_normal(n),600)*(0.6+0.4*np.sin(2*np.pi*0.2*x)**2)*1.4*np.clip(1-(x-1.2)/5,0.25,1); add(waves,11.5,0.35)
n=int(6*SR); x=np.arange(n)/SR; add(bp(rng.standard_normal(n),60,500)*1.5*np.minimum(1,x/1.5)*np.minimum(1,(6-x)/0.5),12.7,0.35)
add(whoosh(0.5,True),18.65,0.6)
# quake (daytime) 19-27
add(lp(noise(8),600)*0.8+hp(lp(noise(8),3000),900)*0.08,19.0,0.25)
add(boom(24,4.0,0.8),23.0,1.1); rumble(22.9,4.1,1.0,90)
for k in range(30): add(crunch(0.4),23.1+rng.uniform(0,3.5),0.15,rng.uniform(-1,1))
for k in range(12): add(lp(noise(0.3),500)*np.exp(-np.arange(int(0.3*SR))/SR*10),23.2+rng.uniform(0,3),0.3,rng.uniform(-1,1))
def alarm(t0,t1,f1=1200,f2=900,per=0.5,g=0.04,pan=0):
    tt=t0;k=0
    while tt<t1:
        m=int(per/2*SR);x=np.arange(m)/SR;add(lp(np.sign(np.sin(2*np.pi*(f1 if k%2==0 else f2)*x)),3000)*0.5,tt,g,pan);tt+=per/2;k+=1
alarm(24.0,27.0,pan=-0.4); add(whoosh(0.5,True),26.65,0.6)
# turtles: soft waves, tiny scuttles
n=int(7*SR); x=np.arange(n)/SR; add(lp(rng.standard_normal(n),500)*(0.6+0.4*np.sin(2*np.pi*0.25*x)**2)*1.2,27.0,0.3,0.6)
for k in range(80): add(hp(noise(0.01),3000)*np.exp(-np.arange(int(0.01*SR))/SR*300),27.2+rng.uniform(0,6.6),0.08,rng.uniform(-1,1))
m=int(0.5*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(500*(1-0.4*x))/SR)*np.exp(-x*5)*0.2,30.4,0.5)  # "uh-oh" turn
add(whoosh(0.5,True),33.65,0.6)
# space wobble
add(lp(noise(8),200)*1.4,34.0,0.25)
n=int(4*SR); x=np.arange(n)/SR; wob=np.sin(2*np.pi*np.cumsum(70+20*np.sin(2*np.pi*0.35*x))/SR)*0.25*np.minimum(1,x/1); add(wob,38.0,0.6)
m=int(1.6*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(80*np.exp(x*2.6))/SR)*(x/1.6)**2*0.3,40.4,1.0); add(whoosh(1.6,True,200,9000),40.4,0.6)
# moon back 42 + surge
add(boom(45,2.0,2),42.0,1.0); m=int(0.8*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(300*np.exp(x*2.5))/SR)*np.exp(-x*3)*0.2,42.0,0.6)
n=int(3.2*SR); x=np.arange(n)/SR; roar=lp(rng.standard_normal(n),300)*3*(x/3.2)**1.5+bp(rng.standard_normal(n),300,2500)*0.8*(x/3.2)**2; add(roar,44.5,0.8)
add(boom(30,1.8,1.6),47.6,1.0); add(lp(noise(1.2),700)*np.exp(-np.arange(int(1.2*SR))/SR*2)*1.8,47.6,0.8)
# werewolf: quiet night, confused "hmm", moon pop, howl
crickets(48.75,2.3,0.15)
m=int(0.6*SR); x=np.arange(m)/SR; add(lp(2*((np.cumsum(140+30*np.sin(2*np.pi*1.2*x))/SR)%1)-1,700)*np.sin(np.pi*x/0.6)*0.25,49.4,0.5)  # "hmm?"
add(boom(45,1.0,3),51.0,0.7); for_=0
m=int(2.4*SR); x=np.arange(m)/SR; f=420+380*np.minimum(1,x/0.5)-120*np.maximum(0,x-1.4)+18*np.sin(2*np.pi*5*x)
howl=(np.sin(2*np.pi*np.cumsum(f)/SR)+0.35*np.sin(2*np.pi*np.cumsum(2*f)/SR)+0.15*np.sin(2*np.pi*np.cumsum(3*f)/SR))*np.minimum(1,x/0.25)*np.minimum(1,(2.4-x)/0.6)
howl=howl+bp(rng.standard_normal(m),500,2500)*0.12*np.minimum(1,x/0.25)*np.minimum(1,(2.4-x)/0.6); add(howl*0.45,51.35,0.8)
add(howl*0.15,51.65,0.4,0.6)  # echo
# end
add(boom(40,2.5,1.5),56.0,1.0); add(whoosh(0.7,True),55.4,0.5)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*0.9)*0.12; add(s,56.0,1.0,rng.uniform(-.5,.5))
add(whoosh(0.5,True),59.0,0.55); add(boom(40,0.6,4),59.5,0.5)
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
