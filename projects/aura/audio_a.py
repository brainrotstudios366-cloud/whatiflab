import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; D=65.0; N=int(SR*D); t=np.arange(N)/SR
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


DURS=[2.55 if i<12 else 2.35 if i<22 else 2.0 if i==22 else 3.4 for i in range(24)]
ST=[];tt=1.2
for d in DURS: ST.append((tt,d)); tt+=d
TEND=tt
def chime(f,d=1.2,g=1.0):
    n=int(d*SR); x=np.arange(n)/SR; s=sum(np.sin(2*np.pi*f*h*x)*np.exp(-x*(2.5+h)) /h for h in (1,2,3,4.01))
    return s*np.minimum(1,x/0.003)*g
def shimmer(d,g=1.0):
    n=int(d*SR); x=np.arange(n)/SR; s=np.zeros(n)
    for k in range(10):
        f=rng.uniform(2000,6000); s+=np.sin(2*np.pi*f*x+rng.uniform(0,6))*np.exp(-((x-rng.uniform(0,d))**2)/0.004)*0.3
    return s*g
def pad(t0,t1,root,g=0.08,bright=0.0):
    d=t1-t0; n=int(d*SR); x=np.arange(n)/SR; s=np.zeros(n)
    for m in (1,1.25,1.5,2,2.5 if bright else 3):
        for k in (-1,1): s+=np.sin(2*np.pi*root*m*(1+0.003*k)*x+k)
    s=lp(s,1500+bright*3000)*np.minimum(1,x/0.6)*np.minimum(1,(d-x)/0.4); add(s,t0,g)
def bark(t0,g=0.3,pan=0):
    for k in range(2):
        n=int(0.13*SR); x=np.arange(n)/SR; f=520*(1-0.4*x/0.13); s=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*np.exp(-x*20)*0.5; add(bp(s,300,2500),t0+k*0.22,g,pan)
def coo(t0,g=0.12,pan=0):
    n=int(0.35*SR); x=np.arange(n)/SR; s=np.sin(2*np.pi*(380+40*np.sin(2*np.pi*6*x))*x)*np.sin(np.pi*x/0.35)**2; add(s,t0,g,pan)
def pop(t0,g=0.5):
    add(boom(70,0.6,7),t0,g); n=int(1.2*SR); x=np.arange(n)/SR; add(hp(rng.standard_normal(n),3000)*(rng.random(n)<0.01)*np.exp(-x*2.5)*3,t0+0.05,g*0.5,rng.uniform(-.7,.7))
def crowd(t0,d,g):
    n=int(d*SR); x=np.arange(n)/SR; s=bp(rng.standard_normal(n),300,3000)*(0.7+0.3*np.sin(2*np.pi*1.6*x))*np.minimum(1,x/0.3)*np.minimum(1,(d-x)/0.3); add(s,t0,g)
# cold open: black hole rumble + title hit
rumble(0,1.3,0.6,90); add(boom(36,1.5,2),0.02,0.7); add(shimmer(1.2),0.0,0.5)
# footsteps (ground stages 1-13)
for i in range(13):
    ts,D=ST[i]; per=np.pi/(3.2 if i==5 else 6.2); tk=ts
    while tk<ts+D: add(thud(110,0.12,0.4),tk,0.18,rng.uniform(-.15,.15)); tk+=per
# stage hits: rising chime arpeggio + whoosh + shimmer
scale=[0,2,4,7,9,12,14,16,19,21,24,26,28,31,33,36,38,40,43,45,48,50,52,55]
for i,(ts,D) in enumerate(ST[:23]):
    f=392*2**(scale[i]/12/2); add(chime(f,1.4),ts+0.02,0.22); add(chime(f*1.5,1.0),ts+0.09,0.12); add(shimmer(0.8),ts,0.35+i*0.01); add(whoosh(0.5,True,500,6000),ts-0.15,0.2)
# pads
pad(1.2,ST[12][0],196,0.05); pad(ST[12][0],ST[15][0],220,0.07,0.5); pad(ST[15][0],ST[22][0]+2.0,147,0.09,1.0)
# events
for k in range(4): bark(ST[1][0]+0.4+k*0.55,0.22,rng.uniform(-.5,.5))
for k in range(5): coo(ST[2][0]+0.3+k*0.4,0.12,rng.uniform(-.6,.6))
add(sweep(400,300,0.5,'saw')*0.3,ST[3][0]+0.5,0.05); add(sweep(500,380,0.4,'saw')*0.3,ST[3][0]+1.2,0.04)  # horns
crowd(ST[4][0],2.5,0.12); add(lp(noise(2.5),300)*np.minimum(1,np.arange(int(2.5*SR))/SR),ST[5][0],0.12)
n_=int(2.5*SR); add(lp(rng.standard_normal(n_),900)*2*np.minimum(1,np.arange(n_)/SR/0.3),ST[6][0],0.3)  # ocean walls roar
add(chime(880,2.0),ST[7][0]+0.2,0.2); add(sweep(200,1600,1.5)*0.2*np.sin(np.pi*np.linspace(0,1,int(1.5*SR))),ST[7][0],0.3)
for b in range(6): pop(ST[8][0]+b*0.42+0.05,0.45)
for k in range(3): add(sweep(1800,2600,0.08)*0.3,ST[9][0]+0.5+k*0.6,0.08,rng.uniform(-.5,.5))  # birds
rumble(ST[10][0],2.5,0.6,80)
crowd(ST[12][0],2.4,0.5)
for k in range(4): add(boom(60,0.3,10),ST[12][0]+0.2+k*0.55,0.35)
add(whoosh(2.0,True,200,4000),ST[13][0],0.35)
for k in range(3): add(sweep(160,120,1.2,'saw')*np.sin(np.pi*np.linspace(0,1,int(1.2*SR)))*0.2,ST[14][0]+k*0.6,0.2,rng.uniform(-.6,.6))
add(boom(30,2.5,1.4),ST[15][0],0.7)
for k in range(5): add(beep(1200+k*150,0.06),ST[17][0]+0.3+k*0.35,0.12,rng.uniform(-.7,.7))
rumble(ST[18][0],2.3,0.5,200)
rumble(ST[21][0],2.3,0.9,70); add(boom(25,2.5,1.2),ST[21][0],0.7)
# infinite: big riser + choir chord
ts,D=ST[22]; n_=int(D*SR); x=np.arange(n_)/SR; add(np.sin(2*np.pi*np.cumsum(150*np.exp(x*1.5))/SR)*(x/D)**2*0.35+shimmer(D)*0.6,ts,0.8)
for f in [261.6,329.6,392,523.2]: add(lp(np.sum([np.sin(2*np.pi*f*(1+0.004*k)*x) for k in (-1,0,1)],axis=0),2500)*np.minimum(1,x/0.3)*0.08,ts,1.0,rng.uniform(-.4,.4))
# trip: record scratch, bonk, sad trombone
t0=ST[23][0]; add(sweep(1200,200,0.25,'saw')*0.5,t0+0.0,0.4)
tb=t0+1.15; add(boom(90,0.4,12),tb,0.9); add(thud(140,0.3,1.0),tb,0.8); m=int(0.08*SR); add(np.sin(2*np.pi*900*np.arange(m)/SR)*np.exp(-np.arange(m)/SR*40),tb,0.3)
for k,(f0,dd) in enumerate([(293.7,0.38),(277.2,0.38),(261.6,0.38),(246.9,1.1)]):
    n=int(dd*SR); x=np.arange(n)/SR; vib=1+0.012*np.sin(2*np.pi*5.5*x)*(x>0.3)*(k==3); f=f0*vib*(1-0.03*x*(k==3))
    s=lp(2*((np.cumsum(f)/SR)%1)-1,1400)*np.minimum(1,x/0.03)*np.minimum(1,(dd-x)/0.08); add(s,tb+0.35+k*0.42,0.22)
# end
add(whoosh(0.6,True),TEND-0.3,0.4); add(chime(523,2),TEND+0.05,0.25); add(whoosh(0.5,True),64.0,0.5)
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
