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
R=[3.6,11.2,19.0,26.8,34.6,42.6,50.4,60.4]
def brass(f,d,g=1.0):
    n=int(d*SR);x=np.arange(n)/SR;ph=np.cumsum(np.full(n,f)*(1+0.004*np.sin(2*np.pi*5*x)))/SR
    s=sum((2*((ph*k)%1)-1)/k for k in (1,2,3))*0.5;s=lp(s,1800,2)*np.minimum(1,x/0.04)*np.minimum(1,(d-x)/0.12)
    return s*g
def fanfare(t0,g=0.2,root=196):
    for f,dt,d in [(root,0,0.25),(root*4/3,0.25,0.25),(root*5/3,0.5,0.25),(root*2,0.75,0.9)]: add(brass(f,d),t0+dt,g); add(brass(f*1.5,d),t0+dt,g*0.4)
def tramp(t0,g=0.5,pan=0.0):
    add(thud(70,0.3,1.0),t0,g,pan); add(bp(noise(0.08),300,2500)*env(int(0.08*SR),0.002,0.03),t0,g*0.5,pan)
def clink(t0,g=0.12,pan=0.0):
    n=int(0.15*SR);x=np.arange(n)/SR;f=rng.uniform(2500,4200);add((np.sin(2*np.pi*f*x)+0.5*np.sin(2*np.pi*f*1.47*x))*np.exp(-x*30),t0,g,pan)
def clang(t0,g=0.6):
    n=int(2.0*SR);x=np.arange(n)/SR;s=sum(a*np.sin(2*np.pi*f*x)*np.exp(-x*dk) for f,a,dk in [(820,1,2.2),(1312,0.7,3),(2190,0.5,4),(3470,0.35,6),(5210,0.2,9)])
    add(s,t0,g); add(hp(noise(0.05),3000)*env(int(0.05*SR),0.001,0.01),t0,0.6)
def boing(t0,g=0.3):
    n=int(0.6*SR);x=np.arange(n)/SR;f=220+140*np.sin(2*np.pi*9*x)*np.exp(-x*4)+x*300;add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*3),t0,g)
def squish(t0,g=0.5):
    n=int(0.4*SR);x=np.arange(n)/SR;add(bp(noise(0.4),200,1800)*np.exp(-x*9)+np.sin(2*np.pi*(180-120*x)*x)*np.exp(-x*10)*0.6,t0,g)
wind=lp(noise(D),500,2)*0.05; add(wind,0,1.0)
def birds(a,b):
    tt=a
    while tt<b:
        for k in range(rng.integers(2,4)): add(chirp(rng.uniform(2500,4200),0.07),tt+k*0.09,0.08,rng.uniform(-0.8,0.8))
        tt+=rng.uniform(0.6,1.3)
birds(0,4.0); birds(9.8,11.0); birds(50.6,53.0)
for tt in np.arange(0.2,R[0]+0.4,0.19): add(hp(noise(0.012),3000)*env(int(0.012*SR),0.001,0.004),tt,0.05,rng.uniform(-0.2,0.2))
# distant legion in title
for i,tt in enumerate(np.arange(0.3,3.6,0.42)): tramp(tt,0.12+0.03*i/8)
add(boom(60,0.8,5),0.0,0.6); fanfare(0.5,0.16)
# round stingers
for r0 in R[:7]:
    add(boom(70,0.5,7),r0,0.5); add(sweep(400,900,0.25,'saw')*env(int(0.25*SR),0.005,0.12),r0,0.12); add(beep(880,0.12),r0,0.15); add(beep(1320,0.18),r0+0.12,0.13)
cough(2.0)
# R1 soldier steps
for i,tt in enumerate(np.arange(3.8,6.7,0.44)): tramp(tt,0.3+0.5*i/7); clink(tt+0.05,0.1)
add(whoosh(0.5,False,200,2500),7.3,0.4); add(thud(45,0.8,1.6),7.7,1.2); add(boom(38,1.2,3),7.7,0.9); squish(7.72,0.6); add(crunch(0.6),7.75,0.3)
add(whoosh(0.4,True,200,1500),8.25,0.2)
boing(9.0,0.35)
for k in range(5): add(beep(1600+k*200,0.08),9.3+k*0.18,0.08)
cough(10.2)
# R2 army
fanfare(11.4,0.18,174)
tt=11.3
while tt<14.4: tramp(tt,0.55,rng.uniform(-0.5,0.5)); tramp(tt+0.04,0.3,rng.uniform(-0.8,0.8)); clink(tt+0.03,0.08,rng.uniform(-1,1)); clink(tt+0.09,0.06,rng.uniform(-1,1)); tt+=0.31
st=[14.4+i*0.18 for i in range(13)]; st.insert(5,14.4+0.85)
for s in st: add(whoosh(0.14,False,300,1800),s-0.14,0.15); add(thud(55,0.5,1.2),s,0.75,rng.uniform(-0.6,0.6))
for tt in np.arange(17.0,18.9,0.15): add(bp(noise(0.05),1500,6000)*env(int(0.05*SR),0.003,0.02),tt,0.12)
cough(17.4,0.4)
# R3 testudo
tt=19.1
while tt<26.6:
    zf=420-105*(tt-19) if tt<22.6 else 42-30*(tt-22.6); near=np.clip(1-abs(zf)/200,0.15,1)
    tramp(tt,0.6*near); clink(tt+0.05,0.12*near,rng.uniform(-1,1)); clink(tt+0.11,0.1*near,rng.uniform(-1,1)); tt+=0.4 if tt<22.6 else 0.55
s=lp(noise(3.0),250)*np.sin(np.linspace(0,np.pi,int(3.0*SR))); add(s,23.6,0.5)
munch(24.2,9)
# R4 catapults
cats=[28.4,28.9,29.5,30.1,30.7,31.3,32.0,32.7,33.4]
for c in cats:
    add(whoosh(1.8,True,150,2500),c-1.9,0.18,rng.uniform(-0.5,0.5)); add(sweep(900,300,1.6)*np.linspace(0,1,int(1.6*SR))*0.06,c-1.7,1.0)
    add(boom(45,1.4,2.5),c,0.8); add(lp(noise(1.6),900)*np.exp(-np.arange(int(1.6*SR))/SR*2.2),c,0.7,rng.uniform(-0.4,0.4))
    for k in range(8): add(hp(noise(0.03),2000)*env(int(0.03*SR),0.001,0.01),c+rng.uniform(0.1,1.4),0.1,rng.uniform(-1,1))
add(whoosh(0.5,True,300,2000),27.9,0.25)
for i in range(16):
    tt=29.1+((i*0.6180339)%1)*3.6+0.5
    if i%3==0: add(np.sin(2*np.pi*620*np.arange(int(0.12*SR))/SR)*env(int(0.12*SR),0.001,0.04)+bp(noise(0.12),600,3000)*env(int(0.12*SR),0.001,0.03),tt,0.25,0.1)
    else: add(thud(120,0.25,0.5),tt,0.2,rng.uniform(-0.6,0.6))
# R5 caesar
for i,tt in enumerate(np.arange(34.8,37.1,0.5)): tramp(tt,0.4+0.5*i/5)
add(brass(98,1.2,1),37.4,0.28); add(brass(92.5,1.4,1),38.4,0.28); add(boom(40,1.5,2),37.4,0.6)
add(sweep(300,1500,0.4)*env(int(0.4*SR),0.01,0.3),39.55,0.12); add(whoosh(0.35,False,500,5000),39.65,0.45)
clang(40.0,0.7); add(boom(70,0.4,9),40.0,0.4)
add(sweep(600,200,0.5)*env(int(0.5*SR),0.01,0.3),41.65,0.15)
cough(41.0)
# R6 empire
fanfare(42.8,0.2,196); fanfare(44.2,0.14,262)
tt=42.7
while tt<50.3: tramp(tt,0.45,-0.6); tramp(tt+0.15,0.45,0.6); clink(tt+0.05,0.07,-0.7); clink(tt+0.2,0.07,0.7); tt+=0.31
for c in [43.6,44.7,45.9,47.1,48.4,49.5]: add(boom(40,1.6,2),c,0.5); add(lp(noise(1.2),600)*np.exp(-np.arange(int(1.2*SR))/SR*2.5),c,0.4)
add(np.sin(2*np.pi*1800*np.arange(int(0.2*SR))/SR)*env(int(0.2*SR),0.001,0.07),44.4,0.12)
# final
add(np.sin(2*np.pi*660*np.arange(int(0.8*SR))/SR)*env(int(0.8*SR),0.01,0.4)*0.1,53.0,1.0)
add(sweep(900,300,2.2)*0.08,53.4,1.0)
squish(55.6,1.0); add(boom(70,0.4,9),55.6,0.6); n=int(0.6*SR);x=np.arange(n)/SR; add(bp(noise(0.6),300,4000)*np.exp(-x*7),55.62,0.6)
add(np.sin(2*np.pi*1200*np.arange(int(1.2*SR))/SR)*env(int(1.2*SR),0.001,0.4),55.7,0.25)
for i,f in enumerate([392,370,349,330]):
    d=0.42 if i<3 else 1.0; n=int(d*SR);x=np.arange(n)/SR; ff=f*(1+0.01*np.sin(2*np.pi*5*x)) if i==3 else np.full(n,f)
    s=lp(2*((np.cumsum(ff)/SR)%1)-1,1600)*np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.08); add(s,56.4+i*0.42,0.18)
add(beep(880,0.15),60.5,0.15); add(beep(1320,0.25),60.65,0.13)
add(whoosh(0.5,True),64.3,0.2)
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
