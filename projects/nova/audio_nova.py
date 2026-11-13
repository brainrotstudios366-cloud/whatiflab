import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; D=25.0; N=int(SR*D); t=np.arange(N)/SR
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
R=[2.2,5.6,9.8,13.6,17.2,21.6]
NOVA=5.6; WAVE=7.0
def saw(f,d):
    n=int(d*SR); return 2*((np.arange(n)*f/SR)%1)-1
def ping(f,d,dec=0.15):
    n=int(d*SR); x=np.arange(n)/SR; return np.sin(2*np.pi*f*x)*env(n,0.002,dec)
# ---- space drone (ducked at collapse silence)
n=N; x=t
drone=np.sin(2*np.pi*55*x)*0.06+np.sin(2*np.pi*82.5*x+0.3)*0.03+lp(noise(D),300,2)*0.05
duck=np.ones(N); a=int(5.35*SR); b=int(5.6*SR); duck[a:b]=np.linspace(1,0.05,b-a)
add(drone*duck,0,1.0)
shim=bp(noise(D),3000,9000)*0.008; add(shim,0,1.0)
# star throb 0..collapse, accelerating
tt=0.2
while tt<4.95:
    rate=0.9 if tt<2.2 else max(0.18,0.9-(tt-2.2)*0.27)
    add(boom(42,0.5,8),tt,0.45); tt+=rate
# title hit + stingers
add(boom(55,1.0,4),0.0,0.7); add(sweep(200,1200,0.35)*env(int(0.35*SR),0.01,0.2),0.0,0.08)
for r0 in R[:5]:
    add(boom(70,0.5,7),r0,0.45); add(beep(880,0.12),r0,0.13); add(beep(1320,0.18),r0+0.12,0.11)
cough(1.2,0.45)
# glasses
add(whoosh(0.35,True,400,3000),4.25,0.12); add(ping(1800,0.3,0.08),4.55,0.13)
# collapse: implosion suck
s=whoosh(0.6,False,200,6000); add(s[::-1],4.95,0.45)
add(sweep(900,60,0.6)*np.linspace(0.3,1,int(0.6*SR)),4.95,0.18)
# HYPERNOVA
add(lp(noise(0.3),9000)*env(int(0.3*SR),0.0005,0.05),NOVA,1.2)
add(boom(28,6.0,0.55),NOVA,1.6)
r=lp(noise(5.0),220,3)*np.exp(-np.arange(int(5.0*SR))/SR*0.6)*np.minimum(1,np.arange(int(5.0*SR))/SR/0.1); add(r,NOVA+0.03,2.2)
add(sweep(3000,300,2.5)*np.exp(-np.arange(int(2.5*SR))/SR*1.2),NOVA,0.07)
add(hp(noise(2.0),4000)*np.exp(-np.arange(int(2.0*SR))/SR*1.5),NOVA+0.1,0.12)
# wave approach + hit
s=lp(noise(0.8),1500,2)*np.linspace(0,1,int(0.8*SR))**2; add(s,WAVE-0.8,1.0)
blast_hit(WAVE,1.3,2.4)
add(whoosh(1.6,False,200,5000),WAVE,0.7)
for i in range(14): add(crunch(0.5),WAVE+0.05+i*0.07,0.18,rng.uniform(-0.9,0.9))
# sizzle smoke
for k in range(40): add(hp(noise(0.03),3000)*env(int(0.03*SR),0.001,0.01),7.4+rng.uniform(0,2.2),0.06,rng.uniform(-0.5,0.5))
cough(8.9,0.5)
# GRB: charge, leaf, beam
add(sweep(250,2600,0.7)*np.linspace(0.1,1,int(0.7*SR)),10.2,0.1)
add(whoosh(0.4,True,500,4000),10.3,0.2)
bd=12.7-10.9; nb=int(bd*SR); xb=np.arange(nb)/SR
beam=lp(saw(110,bd)+0.6*saw(165,bd),2500)*0.5+bp(noise(bd),1500,7000)*0.6
beam*=(0.8+0.2*np.sin(2*np.pi*13*xb))*np.minimum(1,xb/0.03)*np.minimum(1,(bd-xb)/0.25)
add(beam,10.9,0.32)
add(lp(noise(0.25),8000)*env(int(0.25*SR),0.0005,0.06),10.9,0.9); add(boom(60,0.6,6),10.9,0.7)
for k in range(30): add(hp(noise(0.02),5000)*env(int(0.02*SR),0.001,0.006),10.95+rng.uniform(0,1.7),0.1,rng.uniform(-0.8,0.8))
add(sweep(1200,80,0.6)*np.linspace(1,0,int(0.6*SR)),12.7,0.12)
# pulsar pulses
for k in range(-1,10):
    tp=14.55+k*0.75
    if tp<13.7 or tp>24.4: continue
    add(bp(noise(0.25),500,3000)*env(int(0.25*SR),0.03,0.07),tp-0.08,0.12); add(ping(620,0.2,0.05),tp,0.05)
# ignite + crackle
add(bp(noise(0.25),1500,8000)*env(int(0.25*SR),0.002,0.08),14.5,0.5); add(whoosh(0.5,True,200,2500),14.55,0.35)
for k in range(120): add(hp(noise(0.012),2000)*env(int(0.012*SR),0.0005,0.004),14.7+rng.uniform(0,9.8),0.07,rng.uniform(-0.3,0.3))
add(lp(noise(9.8),600)*0.05,14.7,1.0)
# peace chime
for i,f in enumerate([660,880,990]): add(ping(f,0.8,0.35),17.4+i*0.12,0.06)
# pebble fall + bonk
add(sweep(1100,350,1.3)*0.25,19.0,0.6)
nk=int(0.35*SR);xk=np.arange(nk)/SR
bonk=np.sin(2*np.pi*np.cumsum(220*np.exp(-xk*5))/SR)*np.exp(-xk*12)+bp(noise(0.35),800,3000)*np.exp(-xk*40)*0.6
add(bonk,20.25,1.0); add(boom(90,0.3,10),20.25,0.5)
add(np.sin(2*np.pi*1200*np.arange(int(1.2*SR))/SR)*env(int(1.2*SR),0.001,0.4),20.35,0.22)
for i,f in enumerate([392,370,349,330]):
    d=0.42 if i<3 else 1.0; n2=int(d*SR);x2=np.arange(n2)/SR; ff=f*(1+0.01*np.sin(2*np.pi*5*x2)) if i==3 else np.full(n2,f)
    s=lp(2*((np.cumsum(ff)/SR)%1)-1,1600)*np.minimum(1,x2/0.03)*np.minimum(1,(d-x2)/0.08); add(s,20.9+i*0.42,0.17)
# end card + loop
add(beep(880,0.15),21.7,0.14); add(beep(1320,0.25),21.85,0.12)
add(whoosh(0.5,True),24.45,0.2)
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
