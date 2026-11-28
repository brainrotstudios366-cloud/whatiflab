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
# ================= cat sfx =================
def meow(t0,g=0.5,f0=520,d=0.6,up=1.5):
    n=int(d*SR);x=np.arange(n)/SR;k=x/d;f=f0*(1+(up-1)*np.sin(np.pi*np.minimum(1,k*1.3))**1.5)*(1+0.01*np.sin(2*np.pi*6*x));ph=np.cumsum(f)/SR
    s=np.sin(2*np.pi*ph)+0.6*np.sin(4*np.pi*ph)+0.35*np.sin(6*np.pi*ph)+0.2*np.sin(8*np.pi*ph);s=bp(s,400,3500)*np.sin(np.pi*k)**0.6;add(s*0.5,t0,g)
def hiss(t0,d=0.9,g=0.6): n=int(d*SR);x=np.arange(n)/SR;add(hp(noise(d),2500)*np.minimum(1,x/0.04)*np.minimum(1,(d-x)/0.2)*(0.8+0.2*np.sin(2*np.pi*23*x)),t0,g)
def bark(t0,g=0.3,f=420,pan=0.0):
    d=0.16;n=int(d*SR);x=np.arange(n)/SR;ff=f*(1.2-0.4*x/d);ph=np.cumsum(ff)/SR;s=(2*(ph%1)-1)*0.7+bp(noise(d),500,2500)*0.6;add(bp(s,300,2600)*np.exp(-x*14)*np.minimum(1,x/0.005),t0,g,pan)
def roar(t0,d=1.0,g=1.0):
    n=int(d*SR);x=np.arange(n)/SR;f=90+30*np.sin(2*np.pi*3*x)+20*np.sin(2*np.pi*17*x);ph=np.cumsum(f)/SR;s=(2*(ph%1)-1)*0.6+lp(noise(d),900)*1.2*(0.7+0.3*np.sin(2*np.pi*31*x))
    add(lp(s,1600)*np.minimum(1,x/0.08)*np.minimum(1,(d-x)/0.3),t0,g);add(boom(45,d,2),t0,0.4*g)
def purr(t0,d,g=0.25): n=int(d*SR);x=np.arange(n)/SR;add(lp(noise(d),250)*(0.5+0.5*np.sin(2*np.pi*24*x))**2*np.minimum(1,x/0.3)*np.minimum(1,(d-x)/0.3),t0,g)
def lick(t0,n_=6,g=0.2):
    for i in range(n_): add(bp(noise(0.06),1500,6000)*env(int(0.06*SR),0.004,0.04),t0+i*0.31,g)
def hum(t0,d,f,g=0.2,wob=0.0):
    n=int(d*SR);x=np.arange(n)/SR;ff=f*(1+wob*np.sin(2*np.pi*1.7*x));ph=np.cumsum(ff)/SR;s=np.sin(2*np.pi*ph)+0.4*np.sin(4*np.pi*ph)+0.2*np.sin(6.03*np.pi*ph)
    add(s*np.minimum(1,x/0.4)*np.minimum(1,(d-x)/0.4),t0,g)
# ================= bread boy sfx =================
def saw(f,d):
    n=int(d*SR);x=np.arange(n)/SR;ph=np.cumsum(np.ones(n)*f/SR) if np.isscalar(f) else np.cumsum(f/SR);return 2*(ph%1)-1
def laugh(t0,n=5,f0=180,g=0.3,pan=0.0,sp=0.17):
    for k in range(n):
        d=0.13;m=int(d*SR);x=np.arange(m)/SR;f=f0*(1-0.03*k)*(1+0.06*np.sin(2*np.pi*7*x));s=bp(saw(f,d),450,1600)+0.35*bp(noise(d),1000,4000)*np.exp(-x*40)
        add(s*np.minimum(1,x/0.015)*np.exp(-x*9),t0+k*sp+rng.uniform(-0.01,0.01),g,pan)
def steps(t0,t1,dt,g=0.25,f=500,pan=0.0):
    tt=t0
    while tt<t1: tok(tt,g,f+rng.uniform(-60,60),pan);add(lp(noise(0.06),900)*env(int(0.06*SR),0.001,0.02),tt,g*0.6,pan);tt+=dt*rng.uniform(0.92,1.08)
def splat(t0,g=0.6):
    n=int(0.35*SR);x=np.arange(n)/SR;add(lp(noise(0.35),1100)*np.exp(-x*14)*np.minimum(1,x/0.004),t0,g);add(thud(90,0.25,1.0),t0,g*0.6)
    for k in range(4):add(bp(noise(0.05),1500,5000)*env(int(0.05*SR),0.001,0.02),t0+0.04+k*0.05,g*0.15)
def crickets(t0,t1,g=0.06):
    tt=t0
    while tt<t1:
        for k in range(3):n=int(0.03*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*4300*x)*np.sin(np.pi*x/0.03),tt+k*0.045,g,rng.uniform(-0.6,0.6))
        tt+=rng.uniform(0.35,0.7)
def buzzer(t0,g=0.35):
    n=int(0.42*SR);x=np.arange(n)/SR;s=np.sign(np.sin(2*np.pi*140*x))+0.5*np.sign(np.sin(2*np.pi*147*x));add(lp(s,2500)*np.minimum(1,x/0.01)*np.minimum(1,(0.42-x)/0.05),t0,g)
def engine(t0,t1,g0,g1,f=38):
    d=t1-t0;n=int(d*SR);x=np.arange(n)/SR;fr=f*(1+0.15*x/d);s=lp(saw(fr,d),400)+0.4*lp(noise(d),250);s*=1+0.25*np.sin(2*np.pi*11*x);s*=np.linspace(g0,g1,n)*np.minimum(1,x/0.2)*np.minimum(1,(d-x)/0.3);add(s,t0,1.0)
def horn(t0,g=0.35,d=0.45):
    n=int(d*SR);x=np.arange(n)/SR;s=saw(370,d)+saw(466,d);add(lp(s,2200)*np.minimum(1,x/0.02)*np.minimum(1,(d-x)/0.05),t0,g)
def brake(t0,g=0.12):
    n=int(0.7*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*(2600-300*x)*x)*np.exp(-x*3)*np.minimum(1,x/0.05),t0,g);add(hp(noise(0.6),3000)*np.exp(-np.arange(int(0.6*SR))/SR*4),t0+0.5,g*1.2)
def claps(t0,t1,dens=18,g=0.12):
    for i in range(int((t1-t0)*dens)):
        tt=rng.uniform(t0,t1);n=int(0.04*SR);x=np.arange(n)/SR;fade=min(1,(t1-tt)/0.8,(tt-t0)/0.4);add(bp(noise(0.04),900,3500)*np.exp(-x*90),tt,g*fade,rng.uniform(-0.7,0.7))
def jingle(t0,n=14,g=0.18):
    for k in range(n):
        f=rng.uniform(2800,5200);d=0.25;m=int(d*SR);x=np.arange(m)/SR;add(np.sin(2*np.pi*f*x)*np.exp(-x*18),t0+rng.uniform(0,0.45),g,rng.uniform(-0.5,0.5))
def stab(t0,g=0.5,notes=(73.4,87.3,110),d=1.4):
    n=int(d*SR);x=np.arange(n)/SR;s=sum(saw(f,d) for f in notes);add(lp(s,900)*np.exp(-x*1.8)*np.minimum(1,x/0.01),t0,g)
def wah(t0,g=0.3):
    for k,f in enumerate([311,294,277,262]):
        d=0.33 if k<3 else 0.95;n=int(d*SR);x=np.arange(n)/SR;s=saw(f*(1+0.012*np.sin(2*np.pi*5*x)),d);add(lp(s,1300)*env(n,0.02,d*0.8),t0+k*0.36,g)
def drip(t0,g=0.25): n=int(0.15*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*(900+2400*x/0.15)*x)*np.exp(-x*30),t0,g)
def ticks(t0,t1,dt,g=0.12):
    tt=t0;k=0
    while tt<t1: tok(tt,g,1800 if k%2 else 1400);tt+=dt;k+=1

def pad(t0,d,fs,g=0.06):
    n=int(d*SR);x=np.arange(n)/SR;s_=sum(np.sin(2*np.pi*f*x)+0.3*np.sin(2*np.pi*f*2*x) for f in fs);add(s_*np.minimum(1,x/0.8)*np.minimum(1,(d-x)/0.8),t0,g)
def ding(t0,f=1568,g=0.3): chime(t0,g,f)
def zip_(t0,g=0.15): n=int(0.25*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*(3000-2500*x/0.25)*x)*np.exp(-x*8),t0,g,rng.uniform(-0.5,0.5))
EV=dict(off=1.25,idea=3.5,vanish=9.0,r1=9.6,r2=17.0,r3=24.0,r4=31.0,r5=37.4,back=41.0,never=43.6,day=51.6,endc=58.6,loop=66.0)
n=N;x=np.arange(n)/SR
def heart(t0,t1,dt=0.85,g=0.35):
    tt=t0
    while tt<t1: add(thud(55,0.3),tt,g);add(thud(48,0.3),tt+0.22,g*0.7);tt+=dt
def bubbl(t0,t1,rate=14,g=0.12,f0=500,f1=1400):
    for i in range(int((t1-t0)*rate)):
        tt=t0+rng.uniform(0,t1-t0);d=rng.uniform(0.03,0.07);m=int(d*SR);xx=np.arange(m)/SR;f=rng.uniform(f0,f1)*(1+2.5*xx/d)
        add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*xx/d),tt,g*rng.uniform(0.5,1),rng.uniform(-0.7,0.7))
def wind(t0,d,g=0.3):
    m=int(d*SR);xx=np.arange(m)/SR;s=bp(noise(d),200,1400)*(0.65+0.35*np.sin(2*np.pi*0.4*xx+np.sin(2*np.pi*0.13*xx)*2))+lp(noise(d),150)*0.5
    add(s*np.minimum(1,xx/0.3)*np.minimum(1,(d-xx)/0.3),t0,g)
def suck(t0,g=0.8):
    d=0.7;m=int(d*SR);xx=np.arange(m)/SR;s=whoosh(d,False,200,8000)[::-1]*0.8;add(s,t0-d,g);add(sweep(900,60,0.6)*np.exp(-np.arange(int(0.6*SR))/SR*3),t0,0.35*g)
def star(t0,g=0.12,pan=0.0): add(sweep(3000,1400,0.5)*np.exp(-np.arange(int(0.5*SR))/SR*6),t0,g,pan);add(hp(noise(0.4),3000)*np.exp(-np.arange(int(0.4*SR))/SR*8),t0,g*0.5,pan)
drone=(np.sin(2*np.pi*55*x)+0.6*np.sin(2*np.pi*82.5*x+0.3)+0.35*np.sin(2*np.pi*110.3*x))*0.5+lp(noise(D),300)*0.4
def sparkle(t0,n=10,g=0.08):
    for i in range(n): add(beep(rng.uniform(2200,4200),0.06),t0+rng.uniform(0,0.4),g,rng.uniform(-0.7,0.7))
def squish(t0,g=0.2,f=300):
    d=0.18;m=int(d*SR);xx=np.arange(m)/SR;add(np.sin(2*np.pi*np.cumsum(f*(1+1.5*np.sin(np.pi*xx/d)))/SR)*np.sin(np.pi*xx/d),t0,g,rng.uniform(-0.6,0.6))
def wobble(t0,t1,g=0.05):
    for i in range(int((t1-t0)*3)): squish(t0+i/3+rng.uniform(0,0.1),g,rng.uniform(180,420))
def moo(t0,g=0.35):
    d=1.1;m=int(d*SR);xx=np.arange(m)/SR;f=120+40*np.sin(np.pi*xx/d)-30*xx;s=sum(np.sin(2*np.pi*np.cumsum(f*k)/SR)/k for k in range(1,7));add(lp(s,1400)*np.minimum(1,xx/0.15)*np.minimum(1,(d-xx)/0.3),t0,g)
def waves(t0,d,g=0.25):
    m=int(d*SR);xx=np.arange(m)/SR;add(lp(noise(d),900)*(0.55+0.45*np.sin(2*np.pi*0.18*xx))*np.minimum(1,xx/0.4)*np.minimum(1,(d-xx)/0.4),t0,g)
def rumble(t0,d,g=0.5,fc=120):
    m=int(d*SR);xx=np.arange(m)/SR;add(lp(noise(d),fc,3)*(0.7+0.3*np.sin(2*np.pi*7*xx))*np.minimum(1,xx/0.2)*np.minimum(1,(d-xx)/0.3),t0,g)
def lava(t0,d,g=0.2):
    m=int(d*SR);xx=np.arange(m)/SR;add(lp(noise(d),500)*np.minimum(1,xx/0.5)*np.minimum(1,(d-xx)/0.5),t0,g);bubbl(t0,t0+d,6,g*0.4,90,300)
def bell(t0,g=0.4,f=196):
    n_=int(4*SR);xx=np.arange(n_)/SR;s=np.zeros(n_)
    for k,(r,a,dc) in enumerate([(1,1,0.6),(2.0,0.6,0.9),(2.76,0.5,1.2),(5.4,0.3,2),(8.9,0.2,3)]): s+=a*np.sin(2*np.pi*f*r*xx*(1+0.001*np.sin(2*np.pi*3*xx)))*np.exp(-xx*dc)
    add(s*np.minimum(1,xx/0.003)*0.4,t0,g)
def warble(t0,d,g=0.15):
    m=int(d*SR);xx=np.arange(m)/SR;f=700+500*np.sin(2*np.pi*6*xx)+300*np.sin(2*np.pi*1.3*xx);add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,xx/0.1)*np.minimum(1,(d-xx)/0.2),t0,g)
g=np.ones(n)
def gseg(a,b,v):
    i,j=int(a*SR),int(b*SR);g[i:j]=v
def buzz(t0,d,gg=0.12,f=60):
    m=int(d*SR);xx=np.arange(m)/SR;s=sum(np.sin(2*np.pi*f*k*xx)/k for k in range(1,9))*(0.85+0.15*np.sin(2*np.pi*3*xx))
    add(lp(s,1800)*np.minimum(1,xx/0.05)*np.minimum(1,(d-xx)/0.03),t0,gg)
def pdown(t0,gg=0.6):
    d=0.9;m=int(d*SR);xx=np.arange(m)/SR;f=320*np.exp(-xx*3.2)+30;s=2*((np.cumsum(f)/SR)%1)-1
    add(lp(s,1500)*np.exp(-xx*2.5),t0,gg*0.5);click(t0,1.0);add(hp(noise(0.12),1500)*env(int(0.12*SR),0.001,0.03),t0,0.4*gg)
def pup(t0,gg=0.5):
    d=0.8;m=int(d*SR);xx=np.arange(m)/SR;f=40+400*(xx/d)**1.5;s=2*((np.cumsum(f)/SR)%1)-1;add(lp(s,2000)*np.minimum(1,xx/0.05)*np.exp(-np.maximum(0,xx-0.6)*8),t0,gg*0.4)
def thunder(t0,gg=0.6,pan=0.0):
    add(hp(noise(0.08),1200)*env(int(0.08*SR),0.0005,0.02),t0,0.9*gg,pan);zap(t0,0.35*gg,0.25)
    m=int(2.2*SR);xx=np.arange(m)/SR;add(lp(noise(2.2),220,3)*np.minimum(1,xx/0.06)*np.exp(-xx*1.6)*(0.7+0.3*np.sin(2*np.pi*9*xx)),t0+0.05,1.6*gg,pan)
def ecgbeeps(t0,t1,gg=0.13):
    k=int(np.ceil((t0-0.216)/0.8))
    while k*0.8+0.216<t1:
        add(beep(1046,0.09),k*0.8+0.216,gg);k+=1
g=np.ones(n)
gseg(0,EV['off'],0.7);gseg(EV['day'],EV['loop'],0.7)
g=np.convolve(g,np.ones(int(0.1*SR))/(0.1*SR),'same')
add(drone*g*(0.6+0.4*np.sin(2*np.pi*0.1*x)),0,0.15)
# data chatter (modem-ish blips) while the internet is on
def chatter(t0,t1,gg=0.05):
    tt=t0
    while tt<t1:
        add(beep(rng.choice([1760,2093,2637,3136]),0.035),tt,gg*rng.uniform(0.5,1),rng.uniform(-0.7,0.7));tt+=rng.uniform(0.05,0.14)
def notif(t0,gg=0.22): add(beep(1568,0.08),t0,gg);add(beep(2093,0.12),t0+0.09,gg)
def errb(t0,gg=0.3): add(beep(330,0.16),t0,gg);add(beep(220,0.26),t0+0.17,gg)
chatter(0,EV['off'],0.05);chatter(EV['idea']+0.2,EV['vanish'],0.04);chatter(EV['r2'],EV['r2']+1.5,0.04);chatter(EV['back']+0.3,EV['never'],0.035);chatter(EV['day']+1.5,EV['loop'],0.03)
for tt in [0.15,0.6,1.0]: notif(tt,0.15)
for T in [EV['off'],EV['vanish']]:
    pdown(T,0.9);vboom(T,0.9);taiko(T,1.0,60);sparkle(T,10,0.07)
errb(EV['off']+0.5,0.22)
add(whoosh(0.55),EV['idea']-0.3,0.4);pup(EV['idea'],0.5);pad(EV['idea'],EV['vanish']-EV['idea'],[220,277.2,329.6],0.035)
for tt in [EV['idea']+0.3,5.0,6.4]: chime(tt,0.2,1318);add(thud(80,0.25),tt,0.25)
boing(EV['idea']+3.0,0.3)
for k in ['r1','r2','r3','r4','r5']: taiko(EV[k],0.9);click(EV[k],0.6)
# r1 shop: tap, spinner ticks, payment failed
click(EV['r1']+1.6,1.2);ticks(EV['r1']+1.7,EV['r1']+3.0,0.12,0.12);errb(EV['r1']+3.0,0.35);buzzer(EV['r1']+3.0,0.2);boing(EV['r1']+3.2,0.25);chime(11.0,0.2,1318);fallw(14.0,0.8,0.15)
# r2 ocean cables
waves(EV['r2'],EV['r3']-EV['r2'],0.18);pdown(EV['r2']+1.5,0.8);add(boom(45,1.2,2),EV['r2']+1.5,0.45);chime(18.7,0.2,1318);chime(21.9,0.2,1046)
# r3 messages fail
for i,d in enumerate([0.0,0.5,1.0,1.5,2.0]): add(whoosh(0.25,True,800,5000),EV['r3']+0.3+d,0.15);notif(EV['r3']+0.35+d,0.12);errb(EV['r3']+1.6+d,0.15)
for i in range(4): bird(EV['r3']+0.1+i*0.4,0.08,rng.uniform(-0.6,0.6))
buzzer(EV['r3']+5.0,0.18);chime(25.6,0.2,1318)
# r4 GPS still works: pings
for i in range(8): add(beep(2637,0.05),EV['r4']+1.4+i*0.55,0.12,rng.uniform(-0.5,0.5))
risew(EV['r4']+2.4,0.6,0.15);ding(EV['r4']+2.4,1568,0.2);chime(32.6,0.2,1318)
# r5 countdown + return
for i,tt in enumerate([1.5,2.2,2.9]): add(beep(1000 if i<2 else 1500,0.15),EV['r5']+tt,0.32)
ticks(EV['r5']+0.2,EV['back']-0.2,0.25,0.08)
add(whoosh(1.0,True,200,9000),EV['back']-0.9,0.6);vboom(EV['back'],1.1);pup(EV['back'],0.8);sparkle(EV['back'],24,0.1)
add(sweep(500,250,0.6)*np.exp(-np.arange(int(0.6*SR))/SR*3),42.3,0.15)
# never
add(whoosh(0.6),EV['never']-0.3,0.4);add(boom(36,2.5,1.0),EV['never'],0.8);stab(EV['never']+0.1,0.3,(55,65.4,82.4),2.0)
for i in range(4): add(thud(90,0.25),EV['never']+1.8+i*0.25,0.3)
choir(EV['never']+3.0,4.5,[220,261.6,329.6],0.045);chime(49.4,0.18,1046)
# day: reconnect + order confirmed
add(whoosh(0.55),EV['day']-0.3,0.4);pad(EV['day']+0.3,6.5,[220,277.2,329.6],0.05);ticks(EV['day']+0.2,EV['day']+1.5,0.12,0.1);ding(EV['day']+1.5,1046,0.3);jingle(EV['day']+1.6,10,0.12);chime(55.0,0.25,1318)
# end
add(boom(40,2.2,1.2),EV['endc']-0.3,0.5);chime(EV['endc'],0.3,1046);chime(EV['endc']+0.15,0.3,1318);add(whoosh(0.5),EV['loop']-0.3,0.35)
mix=out/np.max(np.abs(out))*0.95
import subprocess
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close()
subprocess.run(['ffmpeg','-loglevel','error','-y','-i','sfx_raw.wav','-af','alimiter=limit=0.9:attack=5:release=80,loudnorm=I=-12:TP=-1.5:LRA=11','-ar','44100','sfx_norm.wav'],check=True)
print('audio ok')
