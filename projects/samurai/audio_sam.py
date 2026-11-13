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
def taiko(t0,g=1.0,f=72,pan=0.0):
    add(boom(f,1.0,5),t0,1.1*g,pan); add(lp(noise(0.08),1500)*env(int(0.08*SR),0.001,0.02),t0,0.5*g,pan)
def shing(t0,g=1.0,d=1.4,pan=0.0):
    n=int(d*SR); x=np.arange(n)/SR; s=np.zeros(n)
    for f,a,dc in [(2150,1,2.5),(3170,0.7,3.2),(4430,0.55,4),(5930,0.4,5),(7810,0.3,6),(1230,0.3,3)]: s+=a*np.sin(2*np.pi*f*x*(1+0.002*np.sin(2*np.pi*5*x)))*np.exp(-x*dc)
    s*=np.minimum(1,x/0.004)*0.35; w=hp(noise(0.35),1800)*np.exp(-np.arange(int(0.35*SR))/SR*9)*0.7
    add(s,t0,g,pan); add(w,t0-0.04,g*0.9,pan)
def slashw(t0,g=1.0,d=0.35,pan=0.0): add(whoosh(d,True,600,9000),t0-d*0.5,0.6*g,pan)
def slide(t0,d,g=0.5):
    n=int(d*SR); x=np.arange(n)/SR; s=bp(noise(d),2500,7000)*(0.5+0.5*np.sin(2*np.pi*31*x)**2)*np.minimum(1,x/0.05); add(s,t0,g*0.5)
def click(t0,g=1.0):
    add(hp(noise(0.03),2000)*env(int(0.03*SR),0.0005,0.006),t0,1.4*g); add(np.sin(2*np.pi*1800*np.arange(int(0.05*SR))/SR)*env(int(0.05*SR),0.0005,0.012),t0,0.6*g)
def poof(t0,g=0.6,pan=0.0): add(lp(noise(0.5),1400)*env(int(0.5*SR),0.01,0.12),t0,g,pan)
def roarD(t0,d=1.3,g=1.0):
    n=int(d*SR); x=np.arange(n)/SR; f=110*(1+0.25*np.sin(2*np.pi*3*x))*(1.2-0.4*x/d); s=2*((np.cumsum(f)/SR)%1)-1
    s=lp(s,900,2)*0.6+bp(noise(d),200,1500)*0.6; s*=np.minimum(1,x/0.12)*np.minimum(1,(d-x)/0.3)*(1+0.4*np.sin(2*np.pi*13*x)); add(s,t0,g)
def flame(t0,d,g=1.0):
    n=int(d*SR); x=np.arange(n)/SR; s=lp(noise(d),700,2)*1.4+bp(noise(d),1500,5000)*0.25*(rng.random(n)>0.995)*8
    add(s*np.minimum(1,x/0.15)*np.minimum(1,(d-x)/0.3),t0,g)
def bird(t0,g=0.12,pan=0.0):
    for k in range(3): add(chirp(2600+k*300,0.07),t0+k*0.11,g,pan)
def sip(t0): add(bp(noise(0.5),600,2500)*(0.5+0.5*np.sin(2*np.pi*9*np.arange(int(0.5*SR))/SR))*env(int(0.5*SR),0.05,0.3),t0,0.25)
# ---------- ambience ----------
wind=lp(noise(D),500,2)*0.05; add(wind,0,1.0)
for tb in [0.5,1.9,13.2,14.8,16.1,53.4,54.3,61.0]: bird(tb,0.11,rng.uniform(-0.7,0.7))
# ---------- title ----------
taiko(0.05,1.0);taiko(0.45,0.6,90);taiko(1.15,1.3,60);add(whoosh(0.6),0.6,0.4)
for t0 in [3.4,17.0,28.5,40.0]: taiko(t0,1.0);taiko(t0+0.18,0.7,95);add(whoosh(0.5),t0-0.3,0.35)
# ---------- stage 1 ----------
n=int(4.8*SR);x=np.arange(n)/SR;add(lp(noise(4.8),300,2)*np.minimum(1,x/2)*1.2,3.4,1.0)
for i in range(30): add(thud(70+rng.uniform(-10,10),0.2,0.25),3.4+i*0.16,0.4,rng.uniform(-0.6,0.6))
for i in range(6): add(whoosh(0.5,True,300,3000),6.8+i*0.08,0.25,rng.uniform(-0.8,0.8))
add(sweep(110,55,2.0)*np.minimum(1,np.arange(int(2.0*SR))/SR/0.2)*0.25,8.1,1.0)
shing(8.15,1.2);slashw(8.2,1.4);add(whoosh(0.4,True,800,9000),8.25,0.5,0.6);add(whoosh(0.4,True,800,9000),8.35,0.5,-0.6)
slide(9.0,1.0);click(10.0,1.3);taiko(10.02,1.2,55)
for i in range(10): poof(10.05+i*0.02,0.25,rng.uniform(-0.8,0.8));add(thud(90,0.3),10.35+rng.uniform(0,0.3),0.4,rng.uniform(-0.7,0.7))
add(lp(noise(1.5),300)*np.exp(-np.arange(int(1.5*SR))/SR*2),10.1,1.4)
sip(13.6);sip(15.3)
# ---------- stage 2 meteor ----------
n=int(4.6*SR);x=np.arange(n)/SR;add((lp(noise(4.6),220,2)*2.0+sweep(40,90,4.6)*0.3)*(x/4.6)**1.5,17.0,1.4)
add(whoosh(0.5,True,200,2000),20.9,0.5);shing(21.55,1.3);add(lp(noise(0.3),5000)*env(int(0.3*SR),0.001,0.05),21.55,0.9)
add(whoosh(1.6,False,3000,200),21.7,0.8,-0.7);add(whoosh(1.6,False,3000,200),21.8,0.8,0.7)
add(thud(60,0.5,1.2),22.4,1.0);slide(23.0,0.6);click(23.6,1.3)
nuke(23.9,0.9,-0.5);nuke(23.95,0.9,0.5)
# ---------- stage 3 tsunami ----------
n=int(5.3*SR);x=np.arange(n)/SR;add(lp(noise(5.3),600,2)*(x/5.3)**1.3*2.2,28.5,1.0);add(hp(noise(8),3000)*0.05,29.5,1.0)
shing(32.35,0.6);shing(33.6,1.3);add(boom(38,2.0,1.5),33.6,1.0)
for s_ in[-0.8,0.8]: add(lp(noise(3.6),900,2)*np.minimum(1,np.arange(int(3.6*SR))/SR/0.2)*np.exp(-np.arange(int(3.6*SR))/SR*0.5)*1.5,33.7,1.0,s_)
slide(36.4,0.6);click(37.0,1.3)
# ---------- stage 4 dragon ----------
for i in range(3): add(whoosh(1.2,True,150,1200),40.6+i*1.0,0.35,[-0.6,0.6,0][i])
roarD(43.2,1.3,1.1);shing(43.55,0.6);flame(44.2,2.5,1.3)
n=int(2.4*SR);x=np.arange(n)/SR;add(bp(noise(2.4),500,4000)*(0.5+0.5*np.sin(2*np.pi*22*x))*0.5,44.3,1.0)
add(whoosh(0.5,True,200,2000),46.8,0.5);shing(47.35,1.3);add(lp(noise(0.25),4000)*env(int(0.25*SR),0.001,0.06),47.4,0.8)
add(thud(70,0.4),48.1,0.9);slide(48.6,0.4);click(48.8,1.1)
n=int(1.2*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*np.cumsum(220+60*np.sin(2*np.pi*2*x))/SR)*np.minimum(1,x/0.1)*np.exp(-x*1.5)*0.25,49.3,1.0)
for i in range(5): add(thud(160,0.12,0.3),50.8+i*0.45,0.25)
for k,f in enumerate([660,880,990]): add(beep(f,0.18),51.0+k*0.12,0.25)
# ---------- final mosquito ----------
sip(53.8)
t0,t1=55.0,59.0;n=int((t1-t0)*SR);x=np.arange(n)/SR;f=620+40*np.sin(2*np.pi*7*x)+30*np.sin(2*np.pi*13*x)
mq=(np.sin(2*np.pi*np.cumsum(f)/SR)+0.4*np.sin(4*np.pi*np.cumsum(f)/SR))*0.12;amp=np.minimum(1,x/0.5)*(0.6+0.4*np.sin(2*np.pi*1.3*x));amp[x>(57.6-t0)]*=0.0;add(mq*amp,t0,1.0,0.3)
for ts in[55.6,56.15,56.6,57.0]: slashw(ts,1.0,0.3,rng.uniform(-0.5,0.5))
add(lp(noise(0.2),2000)*0.0,57.6,1.0)
add(hp(noise(0.12),1500)*env(int(0.12*SR),0.0005,0.03),59.0,2.0);add(thud(120,0.3,1.0),59.0,1.0)
add(thud(60,0.5,1.4),59.6,1.0);add(beep(1046,0.6),59.75,0.5)
for k,f in enumerate([392,370,349,330]):
    d=0.35 if k<3 else 0.9;n=int(d*SR);x=np.arange(n)/SR;s=2*((f*x*(1+0.01*np.sin(2*np.pi*5*x)))%1)-1;add(lp(s,1500)*env(n,0.02,d*0.8)*0.35,60.1+k*0.38,1.0)
t0,t1=59.1,61.0;n=int((t1-t0)*SR);x=np.arange(n)/SR;f=640+40*np.sin(2*np.pi*7*x);add(np.sin(2*np.pi*np.cumsum(f)/SR)*0.1*np.exp(-x*1.2),t0,1.0,0.8)
# ---------- end ----------
for k in range(3): add(beep(880 if k<2 else 1320,0.1),61.7+k*0.12,0.3)
add(whoosh(0.5),65.3,0.5)
m=np.max(np.abs(out));out=out/m*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
