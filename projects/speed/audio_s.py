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


DURS=[2.6 if i<8 else 2.2 if i<13 else 1.5 if i<27 else 2.0 for i in range(28)]
ST=[];tt=1.2
for d in DURS: ST.append((tt,d)); tt+=d
def sonic(t0,g=1.0):
    add(boom(38,2.2,1.6),t0,1.0*g); m=int(0.25*SR); x=np.arange(m)/SR; add(hp(rng.standard_normal(m),800)*np.exp(-x*30)*1.5,t0,0.8*g)
    add(boom(60,0.8,5),t0+0.08,0.6*g); add(lp(noise(1.5),900)*np.exp(-np.arange(int(1.5*SR))/SR*2.5)*1.4,t0,0.6*g)
def doppler(t0,d,f0,f1,g,pan=0):
    add(sweep(f0,f1,d,'saw')*np.sin(np.pi*np.linspace(0,1,int(d*SR)))**2*0.5+whoosh(d,True,400,5000)*0.3,t0,g,pan)
# cold open sonic boom
sonic(0.03,0.9); add(whoosh(1.2,True,300,6000),0,0.35)
# wind bed rising across ground steps
for i in range(12):
    ts,D=ST[i]; n=i+1; m=int(D*SR); x=np.arange(m)/SR
    w=bp(rng.standard_normal(m),120+n*60,800+n*500)*(0.5+n*0.12); add(w*np.minimum(1,x/0.1)*np.minimum(1,(D-x)/0.05),ts,0.18+n*0.03)
# footsteps
for i in range(7):
    ts,D=ST[i]; n=i+1; om=min(9*np.sqrt(n),30); per=np.pi/om; tk=ts
    while tk<ts+D: add(thud(120,0.12,0.5),tk,0.25*(1 if n<5 else 0.6),rng.uniform(-.2,.2)); tk+=per
# per-step blip + launch whoosh
for i,(ts,D) in enumerate(ST):
    n=i+1; f=300*2**(min(n,28)/7); m=int(0.12*SR); x=np.arange(m)/SR
    add((np.sin(2*np.pi*f*x)+0.4*np.sin(2*np.pi*2*f*x))*np.exp(-x*25),ts+0.01,0.16)
    add(whoosh(min(1.0,0.3+n*0.03),True,300,3000+n*200),ts,0.25+min(0.3,n*0.015))
# passes
doppler(ST[1][0]+0.6,1.2,900,600,0.08,0.4)       # cyclist bell-ish
add(np.sin(2*np.pi*1800*np.arange(int(0.25*SR))/SR)*env(int(0.25*SR),0.002,0.08),ST[1][0]+1.0,0.06,0.5)
doppler(ST[2][0]+0.4,2.0,110,80,0.18,0.5)        # bus
for k in range(4): doppler(ST[3][0]+0.3+k*0.55,0.6,180,120,0.1,rng.uniform(-.6,.6))
for k in range(4): doppler(ST[4][0]+0.4+k*0.5,0.7,220,130,0.16,0.4)
doppler(ST[5][0]+0.2,2.3,160,120,0.2,0.6); m=int(1.0*SR); x=np.arange(m)/SR; add((np.sin(2*np.pi*440*x)+np.sin(2*np.pi*554*x))*np.minimum(1,x/0.05)*np.minimum(1,(1-x)/0.1)*0.3,ST[5][0]+0.6,0.12,0.6)
for k in range(4): doppler(ST[6][0]+0.2+k*0.55,0.5,900,350,0.18,rng.uniform(-.6,.6))
sonic(ST[7][0]+0.02,1.0)
doppler(ST[8][0]+0.6,1.4,300,120,0.25,-0.5)      # jet
add(lp(noise(2.2),2500)*0.6,ST[8][0],0.15)       # spray
# fire roar 10-12
t0=ST[9][0]; d=ST[12][0]-t0; m=int(d*SR); x=np.arange(m)/SR; fire=lp(rng.standard_normal(m),600)*2+bp(rng.standard_normal(m),1500,5000)*(rng.random(m)<0.002)*8
add(fire*np.minimum(1,x/0.3)*np.minimum(1,(d-x)/0.2),t0,0.35)
# lift-off rumble + riser
rumble(ST[12][0],2.4,0.9,120); m=int(2.2*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(80*np.exp(x*1.2))/SR)*(x/2.2)*0.3,ST[12][0],0.6)
add(boom(30,2.5,1.4),ST[13][0],0.8)
# space drones
drone(ST[13][0],ST[27][0]+2.0,41,0.12); drone(ST[13][0]+0.5,ST[27][0]+2.0,55,0.06)
for tf,g in [(41.6,0.6),(47.6,0.6),(50.6,0.8),(52.2,0.7)]:
    add(whoosh(1.4,True,150,3000),tf-0.7,g); add(boom(32,1.5,2),tf+0.05,0.5*g)
for k in range(14): add(thud(90,0.2,0.4),ST[23][0]+rng.uniform(0,1.4),0.25,rng.uniform(-.8,.8))
# light speed
ts,D=ST[27]; m=int(D*SR); x=np.arange(m)/SR
add(np.sin(2*np.pi*np.cumsum(120*np.exp(x*2.0))/SR)*(x/D)**2*0.35+hp(rng.standard_normal(m),2000)*(x/D)**3*0.35,ts,0.9)
add(whoosh(1.0,True,400,12000),ts+0.9,0.6)
# end
add(boom(40,2.5,1.5),56.0,1.0)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*0.9)*0.12; add(s,56.0,1.0,rng.uniform(-.5,.5))
add(whoosh(0.5,True),59.0,0.55)
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
