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
# ================= chess sfx =================
def tok(t0,g=1.0,f=900,pan=0.0):
    n=int(0.25*SR);x=np.arange(n)/SR
    s=(np.sin(2*np.pi*f*x)*np.exp(-x*45)+0.6*np.sin(2*np.pi*f*2.27*x)*np.exp(-x*70)+0.8*np.sin(2*np.pi*190*x)*np.exp(-x*30))
    s+=bp(noise(0.25),800,5000)*np.exp(-x*120)*0.8
    add(s*0.6,t0,g,pan)
def clack(t0,g=1.0): tok(t0,1.6*g,760);add(thud(70,0.5,1.0),t0,0.9*g);add(crunch(0.4),t0,0.35*g)
def zap(t0,g=0.5,d=0.35):
    n=int(d*SR);x=np.arange(n)/SR;f=3200*(400/3200)**(x/d);ph=np.cumsum(f)/SR;s=(2*(ph%1)-1)*0.5+np.sin(2*np.pi*ph)*0.5
    add(lp(s,6000)*env(n,0.002,d*0.6),t0,g)
def chime(t0,g=0.4,base=1568):
    for k,f in enumerate([base,base*1.5,base*2]):
        n=int(1.2*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*f*x)*np.exp(-x*3.5)*np.minimum(1,x/0.003),t0+k*0.06,g*(1-0.2*k))
def vboom(t0,g=1.0): add(boom(42,2.2,1.4),t0,1.4*g);add(lp(noise(0.15),800)*env(int(0.15*SR),0.001,0.05),t0,0.5*g)
def fallw(t0,d=1.2,g=0.25): s=sweep(1500,350,d)*np.minimum(1,np.arange(int(d*SR))/SR/0.1)*np.minimum(1,(d-np.arange(int(d*SR))/SR)/0.2);add(s,t0,g)
def risew(t0,d=1.0,g=0.2): s=sweep(400,1800,d)*np.minimum(1,np.arange(int(d*SR))/SR/0.05)*np.exp(-np.arange(int(d*SR))/SR*1.5);add(s,t0,g)
def snort(t0,g=0.8): n=int(0.45*SR);x=np.arange(n)/SR;add(bp(noise(0.45),300,2500)*np.minimum(1,x/0.03)*np.exp(-x*6),t0,g)
def choir(t0,d,freqs,g=0.12):
    n=int(d*SR);x=np.arange(n)/SR;s=np.zeros(n)
    for f in freqs:
        for dt in(-0.004,0,0.005):
            ff=f*(1+dt)*(1+0.004*np.sin(2*np.pi*5.2*x+f));ph=np.cumsum(ff)/SR;s+=np.sin(2*np.pi*ph)+0.3*np.sin(4*np.pi*ph)+0.15*np.sin(6*np.pi*ph)
    s=lp(s,3000)*np.minimum(1,x/(d*0.35))*np.minimum(1,(d-x)/0.5);add(s,t0,g)
def boing(t0,g=0.4):
    n=int(0.5*SR);x=np.arange(n)/SR;f=180+260*np.exp(-x*6)*(1+0.3*np.sin(2*np.pi*14*x));add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*5),t0,g)
def scratch(t0,g=0.5):
    n=int(0.45*SR);x=np.arange(n)/SR;f=600+500*np.sin(2*np.pi*3.2*x);s=bp(noise(0.45),400,4000)*(0.5+0.5*np.sin(2*np.pi*np.cumsum(f)/SR*0.05));add(s*env(n,0.01,0.25),t0,g)
# ---------- ambience ----------
wind=lp(noise(D),380,2)*0.06*(1+0.3*np.sin(2*np.pi*0.07*t))[:N];add(wind,0,1.0)
# ---------- title ----------
taiko(0.05,1.0);taiko(0.45,0.6,90)
for i in range(4): add(whoosh(0.25,True,800,6000),0.1+i*0.18,0.15,rng.uniform(-0.5,0.5))
taiko(0.95,0.9,80);taiko(1.15,1.4,58);add(boom(40,1.6,2.0),1.15,0.9);shing(1.2,0.5)
# stage hits
for r in[3.4,15.2,27.0,38.8]: taiko(r,1.1,62);add(boom(45,1.2,3),r,0.5)
# ---------- stage 1 knight ----------
KH=[4.3,5.2,6.1,7.0,7.9]
for i,k in enumerate(KH): add(whoosh(0.5,True,300,3000),k,0.35,rng.uniform(-0.6,0.6));tok(k+0.5,1.3,820);add(thud(65,0.4,1.0),k+0.5,0.7)
for i in range(5): boing(8.5+i*0.21,0.12)
shing(9.1,0.6);add(whoosh(0.45,True,500,5000),9.7,0.45)
clack(10.15,1.2);vboom(10.15,0.6);risew(10.3,1.6,0.18);chime(12.9,0.3,2093)
vboom(11.75,1.0)
# ---------- stage 2 bishop ----------
BZ=[16.0,17.4,17.95,18.5,19.0,19.55];BD=[0.45,0.3,0.33,0.25,0.3,0.25]
for k,d in zip(BZ,BD): add(whoosh(d+0.1,True,1200,12000),k-0.03,0.55,rng.uniform(-0.7,0.7));tok(k+d,0.7,1100)
add(boom(55,1.5,2.5),16.45,0.4)
n=int(1.9*SR);x=np.arange(n)/SR;add(bp(noise(1.9),80,600)*(0.6+0.4*np.sin(2*np.pi*11*x))*np.minimum(1,x/0.2)*np.minimum(1,(1.9-x)/0.2),19.8,0.45)
for i in range(6): tok(19.85+i*0.31,0.25,500)
add(whoosh(0.6,True,800,12000),21.7,0.7);fallw(22.25,1.4,0.22);poof(23.6,0.25)
add(beep(660,0.09),20.0,0.3);add(beep(880,0.09),20.1,0.3)
# ---------- stage 3 rook ----------
fallw(26.9,0.65,0.3);add(boom(38,2.0,1.6),27.55,1.6);tok(27.55,1.4,600);add(crunch(0.7),27.55,0.5)
snort(28.3,0.9);snort(28.9,1.1);add(thud(60,0.3,1.0),28.3,0.6);add(thud(60,0.3,1.0),28.9,0.6)
for k in range(30):
    tt=29.8+k*0.11
    if tt>31.95: break
    slow=30.75<=tt<31.6
    if slow and k%2: continue
    add(thud(55 if not slow else 40,0.3,1.0),tt,0.55 if not slow else 0.35,-0.3)
n=int(2.2*SR);x=np.arange(n)/SR;add(lp(noise(2.2),300,2)*np.minimum(1,x/1.0)*np.minimum(1,(2.2-x)/0.2),29.8,0.9)
add(sweep(300,60,0.6)*env(int(0.6*SR),0.05,0.5),30.75,0.35)
add(whoosh(0.6,True,200,2500),30.85,0.5);tok(31.45,1.1,880)
for k in range(3): add(beep(1760+k*220,0.06),31.55+k*0.06,0.18)
fallw(31.95,1.9,0.28);nuke(33.9,0.55,0.0,2.0);vboom(33.95,1.0)
# ---------- stage 4 queen ----------
choir(38.6,1.4,[98,147,196,233],0.08);add(boom(36,2.4,1.3),39.4,1.6);tok(39.4,1.2,650)
n=int(4.6*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*55*x+2*np.sin(2*np.pi*0.5*x))*0.25*np.minimum(1,x/0.5)*np.minimum(1,(4.6-x)/0.3),39.45,1.0)
for tb in[40.95,41.5,42.15,42.7,43.9]: zap(tb,0.5);add(boom(60,0.9,4),tb+0.05,0.7);add(crunch(0.5),tb+0.05,0.3)
for tq in[40.9,42.1]: add(whoosh(0.4,True,400,4000),tq,0.3);tok(tq+0.4,0.9,900)
risew(43.3,0.65,0.25);add(whoosh(0.45,True,500,6000),43.6,0.45)
clack(44.05,1.3);vboom(44.05,0.7);risew(44.2,1.5,0.15);chime(46.7,0.3,2093)
choir(44.5,2.4,[262,330,392,523,659],0.07);add(boom(40,2.5,1.2),45.1,1.4);shing(45.1,0.9)
for k in range(8): chime(45.15+k*0.11,0.08,2093+k*120)
# ---------- final ----------
for k in range(3):
    n=int(1.0*SR);x=np.arange(n)/SR;add(lp(noise(1.0),500)*np.sin(np.pi*x)**2*0.6,51.3+k*1.0,0.25)
add(beep(1320,0.05),52.45,0.25);add(whoosh(0.55,True,300,3000),53.0,0.35);tok(53.55,1.1,900)
add(beep(392,0.15),54.4,0.0);scratch(54.35,0.6)
n=int(1.9*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*58*x)*0.4*np.minimum(1,x/0.6),54.45,1.0)
taiko(55.2,1.2,55);add(boom(40,1.6,2),55.2,0.8);shing(55.25,0.4)
add(whoosh(0.4,True,500,5000),56.3,0.4);clack(56.7,1.3);boing(56.72,0.35);vboom(56.7,0.6)
fallw(56.75,1.0,0.18);tok(57.7,1.2,700);add(thud(70,0.4,1.0),57.7,0.8);tok(57.95,0.4,1200)
vboom(58.6,1.1)
for k,f in enumerate([392,370,349,330]):
    d=0.35 if k<3 else 0.9;n=int(d*SR);x=np.arange(n)/SR;s=2*((f*x*(1+0.01*np.sin(2*np.pi*5*x)))%1)-1;add(lp(s,1500)*env(n,0.02,d*0.8)*0.35,59.4+k*0.38,1.0)
# ---------- end ----------
add(whoosh(0.5),61.4,0.4)
for k in range(3): add(beep(880 if k<2 else 1320,0.1),61.7+k*0.12,0.3)
add(whoosh(0.5),65.3,0.5)
m=np.max(np.abs(out));out=out/m*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
