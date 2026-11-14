import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; D=66.0; N=int(SR*D); t=np.arange(N)/SR
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
def sizzle(t0,d,g=0.3,pan=0.0):
    n=int(d*SR); x=np.arange(n)/SR
    s=hp(noise(d),2500)*(0.5+0.5*(rng.random(n)<0.3))*np.minimum(1,x/0.05)*np.exp(-x*1.2/d*2)
    add(s,t0,g,pan)
def roar(t0,d=1.6,g=0.6):
    n=int(d*SR); x=np.arange(n)/SR
    f=110*(1+0.25*np.sin(np.pi*x/d))*(1+0.04*np.sin(2*np.pi*23*x))
    s=(2*((np.cumsum(f)/SR)%1)-1)*0.6+bp(noise(d),200,1800)*0.8
    s=lp(s,1400)*np.minimum(1,x/0.15)*np.minimum(1,(d-x)/0.4); add(s,t0,g)
def thunder(t0,g=1.0):
    add(hp(noise(0.12),1500)*env(int(0.12*SR),0.0005,0.03),t0,1.0*g)
    add(boom(40,2.5,1.5),t0+0.02,1.0*g)
    r=lp(noise(3.0),500,2)*np.exp(-np.arange(int(3*SR))/SR*1.1)*(1+0.6*np.sin(2*np.pi*3.3*np.arange(int(3*SR))/SR)); add(r,t0+0.05,1.6*g)
def crack(t0,g=0.6):
    for k in range(4): add(bp(noise(0.05),800,7000)*env(int(0.05*SR),0.0005,0.012),t0+k*0.035,g*(1-k*0.15))
R=[3.0,12.0,21.5,31.0,41.5,52.0,61.0]
wind=lp(noise(D),500,2)*0.05; add(wind,0,1.0)
for i,r0 in enumerate(R[:6]):
    add(boom(70,0.5,7),r0,0.5); add(sweep(400,900,0.25,'saw')*env(int(0.25*SR),0.005,0.12),r0,0.12)
    add(beep(880,0.12),r0,0.15); add(beep(1320,0.18),r0+0.12,0.13)
# intro: hot ball hum
add(boom(60,0.8,5),0.0,0.6); add(whoosh(0.7,False,200,3000),0.0,0.35)
hum(0.0,6.0,60,0.18); sizzle(0.0,6.0,0.05)
cough(2.0)
# R1 drop
whistle(6.0,0.35); add(thud(60,0.6,1.2),6.35,1.0); sizzle(6.35,2.5,0.45); add(crunch(0.5),6.35,0.3)
add(whoosh(0.9,True,200,1500),8.0,0.3); cough(8.5); chime(9.2,0.12)
# R2 rain of balls
for f in [13.2,13.8,14.4,15.0,15.5,16.0,16.4,16.8,17.2,17.6]:
    p=rng.uniform(-0.7,0.7); add(whoosh(0.45,True,500,4000),f-0.45,0.25,p); add(thud(70,0.4,1.0),f,0.7,p); sizzle(f,1.0,0.22,p)
chime(18.4,0.12); cough(19.2)
# R3 leaf + lava
add(sweep(1200,600,0.9)*env(int(0.9*SR),0.05,0.4)*0.1,21.9,1.0)
add(sweep(300,900,0.3)*env(int(0.3*SR),0.01,0.1),22.95,0.15)
n=int(8.5*SR); x=np.arange(n)/SR; lava=lp(noise(8.5),300,2)*np.minimum(1,x/1.0)*np.minimum(1,(8.5-x)/1.0); add(lava,22.6,1.2)
for k in range(30): add(boom(150+rng.uniform(0,200),0.15,30),22.8+k*0.27,0.15,rng.uniform(-0.8,0.8))
add(boom(40,2.0,1.5),23.8,0.8); sizzle(23.8,3,0.15); chime(26.2,0.13)
# R4 storm
add(lp(noise(10),2500)*0.06,31.0,1.0)
thunder(33.6,1.0); thunder(36.3,0.9)
for t0 in [34.0,36.6]:
    for k in range(12): add(bp(noise(0.03),2000,9000)*env(int(0.03*SR),0.001,0.01),t0+k*0.15+rng.uniform(0,0.1),0.15,rng.uniform(-0.5,0.5))
add(beep(1046,0.12),37.0,0.15); add(beep(1568,0.25),37.12,0.15); cough(37.5)
# R5 kaiju
for k in range(5): add(thud(45,0.7,1.3),41.5+k*0.9,0.9)
roar(44.0,1.6,0.7); add(thud(40,0.8,1.3),45.9,0.6)
crack(46.5,0.8); crack(46.75,0.6); add(sweep(300,90,1.3)*0.15,46.6,1.0)
add(whoosh(1.0,False,200,2000),47.0,0.4); blast_hit(47.9,1.4); add(boom(30,4.0,0.8),47.9,1.3)
chime(48.5,0.12); cough(49.1)
# final: snowflake
for k in range(8): add(chirp(rng.uniform(2500,4000),0.07),52.4+k*0.25,0.06,rng.uniform(-0.8,0.8))
n=int(3.0*SR); x=np.arange(n)/SR
for k,f in enumerate([1568,2093,2637,3136]): add(np.sin(2*np.pi*f*x)*np.exp(-x*1.5)*0.05,54.0+k*0.7,1.0)
add(sweep(900,300,2.6)*0.05,54.4,1.0)
add(hp(noise(0.6),3000)*np.exp(-np.arange(int(0.6*SR))/SR*5),57.0,0.6); add(sweep(4000,1200,0.5)*env(int(0.5*SR),0.002,0.2),57.0,0.15); add(thud(90,0.3,1.0),57.05,0.4)
for i,f in enumerate([392,370,349,330]):
    d=0.42 if i<3 else 1.0; n=int(d*SR);x=np.arange(n)/SR
    s=lp(2*((np.cumsum(np.full(n,f))/SR)%1)-1,1600)*np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.08); add(s,57.6+i*0.42,0.18)
add(beep(880,0.15),61.1,0.15); add(beep(1320,0.25),61.25,0.13)
add(whoosh(0.5,True),65.2,0.2)
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
