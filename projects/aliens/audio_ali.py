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
def hum(t0,d,f=90,g=0.3,pan=0.0,fade=0.8):
    n=int(d*SR); x=np.arange(n)/SR
    s=np.sin(2*np.pi*f*x+2.0*np.sin(2*np.pi*0.7*x))*0.6+np.sin(2*np.pi*f*2.01*x)*0.25+np.sin(2*np.pi*f*3.02*x+np.sin(2*np.pi*5*x))*0.12
    s*=np.minimum(1,x/fade)*np.minimum(1,(d-x)/fade); add(s,t0,g,pan)
def theremin(t0,d,f0=500,f1=900,g=0.08):
    n=int(d*SR); x=np.arange(n)/SR; f=f0+(f1-f0)*(0.5-0.5*np.cos(np.pi*x/d))+12*np.sin(2*np.pi*6*x)
    s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,x/0.2)*np.minimum(1,(d-x)/0.3); add(s,t0,g)
def pew(t0,g=0.3,pan=0.0):
    d=0.22; n=int(d*SR); s=sweep(2600,320,d,'saw')*env(n,0.002,0.12); add(lp(s,6000),t0,g,pan)
def zap(t0,g=0.4,pan=0.0):
    d=0.3; n=int(d*SR); x=np.arange(n)/SR; s=bp(noise(d),1500,8000)*(rng.random(n)<0.15)*2*np.exp(-x*12)
    add(s,t0,g,pan); add(boom(90,0.4,9),t0,0.6*g,pan)
def chime(t0,g=0.15):
    for k,f in enumerate([1318,1760,2637]): add(np.sin(2*np.pi*f*np.arange(int(0.8*SR))/SR)*env(int(0.8*SR),0.002,0.25),t0+k*0.04,g)
R=[3.6,12.0,21.0,31.0,41.0,50.5,60.2]
wind=lp(noise(D),500,2)*0.05; add(wind,0,1.0)
def birds(a,b):
    tt=a
    while tt<b:
        for k in range(rng.integers(2,4)): add(chirp(rng.uniform(2500,4200),0.07),tt+k*0.09,0.08,rng.uniform(-0.8,0.8))
        tt+=rng.uniform(0.6,1.3)
birds(50.8,52.5)
for tt in np.arange(0.2,R[0]+1.6,0.19): add(hp(noise(0.012),3000)*env(int(0.012*SR),0.001,0.004),tt,0.05,rng.uniform(-0.2,0.2))
for i,r0 in enumerate(R[:6]):
    add(boom(70,0.5,7),r0,0.5); add(sweep(400,900,0.25,'saw')*env(int(0.25*SR),0.005,0.12),r0,0.12)
    add(beep(880,0.12),r0,0.15); add(beep(1320,0.18),r0+0.12,0.13)
# intro: fleet drops in
add(boom(60,0.8,5),0.0,0.6); add(whoosh(0.7,False,200,3000),0.0,0.35)
hum(0.0,12.0,75,0.22); theremin(0.3,1.6,450,950,0.07); theremin(2.2,1.2,900,500,0.06)
cough(2.0)
# R1 lasers
for i,f in enumerate([5.0,5.7,6.4,7.1,7.8,8.5]):
    p=rng.uniform(-0.7,0.7); pew(f-0.3,0.3,p); zap(f,0.45,p); add(chirp(1800,0.08),f+0.05,0.12)
cough(9.9)
# R2 abduction
add(whoosh(1.2,False,150,2500),12.0,0.4); hum(12.0,4.2,110,0.35,0,0.6)
n=int(2.2*SR); x=np.arange(n)/SR; s=sweep(220,1300,2.2)*(0.6+0.4*np.sin(2*np.pi*14*x))*np.minimum(1,x/0.1); add(s,13.2,0.12)
for k in range(10): add(chirp(900+k*120,0.1),13.6+k*0.17,0.08,0.2)
add(sweep(300,2000,0.18)*env(int(0.18*SR),0.002,0.1),15.3,0.2)
add(whoosh(0.6,True,300,5000),15.75,0.5)
add(sweep(2000,500,1.3)*np.linspace(0.3,1,int(1.3*SR)),16.0,0.12)
add(thud(100,0.35,1.0),17.3,0.8)
for k in range(5): add(beep(1600+k*200,0.08),17.5+k*0.18,0.08)
cough(17.7)
# R3 mothership
add(sweep(80,40,1.0)*np.linspace(1,0,int(1.0*SR)),21.0,0.3)
hum(21.2,15.6,42,0.55,0,2.0); hum(21.2,15.6,63,0.18,0.3,2.0)
add(sweep(150,2200,0.6,'saw')*np.linspace(0.1,1,int(0.6*SR)),23.2,0.12); zap(23.2,0.4)
nuke(23.8,1.6); blast_hit(25.2,1.3)
for i in range(8): add(crunch(0.8),24.4+i*0.12,0.22,rng.uniform(-0.8,0.8))
cough(26.4); munch(26.9,8); chime(26.6,0.14)
# R4 scan + count
for k in range(18): add(beep(1900 if k%2 else 1500,0.05),32.0+k*0.26,0.06,np.sin(k))
for k in range(30): add(hp(noise(0.015),2500)*env(int(0.015*SR),0.001,0.005),32.6+k*0.075,0.18)
add(beep(1046,0.2),34.85,0.16); add(beep(1568,0.3),34.95,0.14)
add(sweep(200,3000,1.0)*env(int(1.0*SR),0.01,0.5),36.7,0.2); add(whoosh(1.0,True,200,6000),36.6,0.55); add(boom(50,0.8,4),36.7,0.5)
chime(37.7,0.12)
# R5 gravity ray
hum(41.2,9.0,95,0.25,-0.2,0.8)
n=int(8.0*SR); x=np.arange(n)/SR; s=np.sin(2*np.pi*55*x+3*np.sin(2*np.pi*3*x))*np.minimum(1,x/0.3)*np.minimum(1,(8.0-x)/0.8); add(lp(s,800),42.1,0.45)
add(thud(70,0.5,1.0),42.4,1.0); add(crunch(0.4),42.4,0.3)
add(sweep(200,500,0.6)*env(int(0.6*SR),0.05,0.3),42.5,0.15); chime(46.2,0.13)
cough(46.8)
# final: raindrop
add(np.sin(2*np.pi*660*np.arange(int(0.8*SR))/SR)*env(int(0.8*SR),0.01,0.4)*0.1,50.5,1.0)
for k in range(10): add(bp(noise(0.3),3000,9000)*env(int(0.3*SR),0.01,0.1),50.9+k*0.21,0.04,rng.uniform(-1,1))
add(sweep(900,300,2.6)*0.07,53.0,1.0)
add(sweep(900,2600,0.12)*env(int(0.12*SR),0.002,0.06),55.6,0.35); add(bp(noise(0.5),400,5000)*np.exp(-np.arange(int(0.5*SR))/SR*7),55.6,0.8); add(thud(70,0.4,1.0),55.6,0.7)
for i,f in enumerate([392,370,349,330]):
    d=0.42 if i<3 else 1.0; n=int(d*SR);x=np.arange(n)/SR; ff=f*(1+0.01*np.sin(2*np.pi*5*x)) if i==3 else f
    s=lp(2*((np.cumsum(np.full(n,ff) if np.isscalar(ff) else ff)/SR)%1)-1,1600)*np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.08); add(s,56.3+i*0.42,0.18)
add(beep(880,0.15),60.3,0.15); add(beep(1320,0.25),60.45,0.13)
add(whoosh(0.5,True),64.2,0.2)
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
