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
    n=int(d*SR); x=np.linspace(0,1,n); s=rng.standard_normal(n); o_=np.zeros(n)
    for i in range(0,n,1024):
        k=x[i]; fc=(f0*(f1/f0)**(k if up else 1-k)); o_[i:i+1024]=lp(s[i:i+1024],min(fc,18000),1)
    return o_*np.sin(np.pi*x)**1.5*2.0
def beep(f,d=0.09):
    n=int(d*SR); x=np.arange(n)/SR; return np.sin(2*np.pi*f*x)*env(n,0.002,0.05)
def thud(f0=80,d=0.35,g=1.0):
    return boom(f0,d,9)*g+lp(noise(d),400)*np.exp(-np.arange(int(d*SR))/SR*25)*0.6
def crunch(d=0.8):
    n=int(d*SR); x=np.arange(n)/SR
    return bp(rng.standard_normal(n),200,6000)*np.exp(-x*6)*1.1
def nuke(t0,g=1.0,pan=0.0,dist=1.0):
    # crack + deep rumble + roar
    add(lp(noise(0.25),6000)*env(int(0.25*SR),0.001,0.06),t0,0.8*g/dist,pan)
    add(boom(32,5.0,0.7),t0,1.3*g,pan)
    r=lp(noise(5.5),250,3)*np.exp(-np.arange(int(5.5*SR))/SR*0.55)*np.minimum(1,np.arange(int(5.5*SR))/SR/0.15)
    add(r,t0+0.05,2.0*g,pan)
def blast_hit(t0,g=1.0,d=2.2):
    n=int(d*SR); x=np.arange(n)/SR
    s=lp(noise(d),1200,2)*np.minimum(1,x/0.04)*np.exp(-x*1.3); add(s,t0,1.4*g)
    add(boom(45,1.6,2.2),t0,1.2*g)
    for i in range(18): add(hp(noise(0.05),2500)*env(int(0.05*SR),0.001,0.015),t0+rng.uniform(0.05,d*0.8),0.25*g,rng.uniform(-1,1))
def whistle(t0,d=1.4):
    s=sweep(2400,700,d,expo=True)*np.minimum(1,np.arange(int(d*SR))/SR/0.2); add(s,t0,0.22)
def cough(t0,g=0.5):
    for k,dt in enumerate([0,0.22]):
        n=int(0.16*SR);x=np.arange(n)/SR
        s=bp(noise(0.16),500,2500)*env(n,0.004,0.05)+np.sin(2*np.pi*(320-k*40)*x)*env(n,0.003,0.04)*0.3
        add(s,t0+dt,g*(1-0.3*k))
def chirp(f,d=0.1):
    return sweep(f,f*1.6,d)*env(int(d*SR),0.005,0.04)
def munch(t0,n=6):
    for i in range(n): add(bp(noise(0.06),800,4000)*env(int(0.06*SR),0.002,0.02),t0+i*0.22,0.35,0.1)
R=[3.6,11.6,19.2,27.2,34.8,42.4,50.4,60.4]
# ambient: birds/wind in calm parts
wind=lp(noise(D),500,2)*0.05; add(wind,0,1.0)
def birds(a,b):
    tt=a
    while tt<b:
        for k in range(rng.integers(2,4)): add(chirp(rng.uniform(2500,4200),0.07),tt+k*0.09,0.08,rng.uniform(-0.8,0.8))
        tt+=rng.uniform(0.6,1.3)
birds(0,5.0); birds(9.5,12.4); birds(50.6,53.0)
# tiny footsteps (taps) while walking
for tt in np.arange(0.2,R[0]+1.6,0.19): add(hp(noise(0.012),3000)*env(int(0.012*SR),0.001,0.004),tt,0.05,rng.uniform(-0.2,0.2))
# round stingers
for i,r0 in enumerate(R[:7]):
    add(boom(70,0.5,7),r0,0.5); add(sweep(400,900,0.25,'saw')*env(int(0.25*SR),0.005,0.12),r0,0.12)
    add(beep(880,0.12),r0,0.15); add(beep(1320,0.18),r0+0.12,0.13)
# title hit
add(boom(60,0.8,5),0.0,0.6); add(beep(660),0.0,0.15)
cough(2.0)
# R1
whistle(4.2,1.4); nuke(5.6); blast_hit(7.0); cough(9.6)
# R2
for i,d in enumerate([12.6,12.85,13.1,13.3,13.55,13.8,14.0,14.25,14.5,14.75]): nuke(d,0.5,rng.uniform(-0.7,0.7),1.5)
blast_hit(15.6,1.1); cough(16.5,0.4)
for tt in np.arange(17.1,19.1,0.15): add(bp(noise(0.05),1500,6000)*env(int(0.05*SR),0.003,0.02),tt,0.12)  # dusting
# R3
add(whoosh(1.0,True,200,3000),19.4,0.2); nuke(20.4,1.5); blast_hit(22.2,1.4)
for i in range(10): add(crunch(0.8),21.3+i*0.1,0.25,rng.uniform(-0.8,0.8))
cough(23.8); munch(24.4,10)
# R4 asteroid
s=lp(noise(2.0),900,2)*np.linspace(0.1,1,int(2.0*SR))**2; add(s,27.6,1.2); add(sweep(300,80,2.0),27.6,0.15)
nuke(29.6,1.2); blast_hit(31.0,0.6)
add(whoosh(0.5,True,300,2000),28.2,0.25)  # umbrella pull
for i in range(16):
    tt=29.6+0.6+((i*0.6180339)%1)*3.2+0.5
    if i%3==0: add(np.sin(2*np.pi*620*np.arange(int(0.12*SR))/SR)*env(int(0.12*SR),0.001,0.04)+bp(noise(0.12),600,3000)*env(int(0.12*SR),0.001,0.03),tt,0.25,0.1)  # bonk on leaf
    else: add(thud(120,0.25,0.5),tt,0.25,rng.uniform(-0.6,0.6))
# R5 sun
s=sweep(60,40,2.2)*np.linspace(0,1,int(2.2*SR))+lp(noise(2.2),200)*np.linspace(0,1,int(2.2*SR))*0.8; add(s,35.2,0.8)
add(sweep(200,1200,1.2)*np.linspace(0,1,int(1.2*SR))**2,36.2,0.15)
add(np.sin(2*np.pi*1800*np.arange(int(0.2*SR))/SR)*env(int(0.2*SR),0.001,0.07),36.9,0.12)  # glasses *ting*
nuke(37.4,1.6); blast_hit(37.9,0.9)
# R6 black hole
s=sweep(120,30,4.0,'saw'); s=lp(s,400)*np.minimum(1,np.arange(len(s))/SR/0.8); add(s,42.6,0.35)
add(whoosh(3.8,True,100,1500),42.8,0.45); add(lp(noise(3.6),300)*np.linspace(0.3,1,int(3.6*SR)),43.0,0.9)
add(sweep(200,3000,0.4)*env(int(0.4*SR),0.01,0.3),46.4,0.25); add(boom(40,1.2,3),46.8,1.0)
add(sweep(1400,300,0.9)*0.3,46.9,0.35)  # falling whistle
add(thud(90,0.35,1.0),47.8,0.7)
for k in range(5): add(beep(1600+k*200,0.08),48.0+k*0.18,0.08)   # dizzy tweets
cough(48.4)
# final
add(np.sin(2*np.pi*660*np.arange(int(0.8*SR))/SR)*env(int(0.8*SR),0.01,0.4)*0.1,53.0,1.0)
s=sweep(900,300,2.2)*0.08; add(s,53.4,1.0)   # slow drop tone
# splash
n=int(0.9*SR);x=np.arange(n)/SR; sp=bp(noise(0.9),300,5000)*np.exp(-x*5)+np.sin(2*np.pi*(500+800*np.exp(-x*20))*x)*np.exp(-x*12)*0.5
add(sp,55.6,1.2); add(boom(70,0.4,9),55.6,0.6)
# K.O. bell + sad trombone
add(np.sin(2*np.pi*1200*np.arange(int(1.2*SR))/SR)*env(int(1.2*SR),0.001,0.4),55.7,0.25)
for i,f in enumerate([392,370,349,330]):
    d=0.42 if i<3 else 1.0; n=int(d*SR);x=np.arange(n)/SR; ff=f*(1+0.01*np.sin(2*np.pi*5*x)) if i==3 else f
    s=lp(2*((np.cumsum(np.full(n,ff) if np.isscalar(ff) else ff)/SR)%1)-1,1600)*np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.08); add(s,56.4+i*0.42,0.18)
# end card
add(beep(880,0.15),60.5,0.15); add(beep(1320,0.25),60.65,0.13)
add(whoosh(0.5,True),64.3,0.2)
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
