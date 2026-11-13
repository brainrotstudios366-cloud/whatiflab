import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; D=73.0; N=int(SR*D); t=np.arange(N)/SR
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
def zip_(t0,g=0.15): n=int(0.25*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*(3000-2500*x/0.25)*x)*np.exp(-x*8),t0,g,rng.uniform(-0.5,0.5))
def thunder(t0,g=0.5): n=int(2.5*SR);x=np.arange(n)/SR;add(lp(noise(2.5),300)*np.exp(-x*1.4)*(1+0.5*np.sin(2*np.pi*3*x)),t0,g)
def ding(t0,f=1568,g=0.3): chime(t0,g,f)
TA=dict(twins=3.2,names=7.65,ann=11.2,touch=13.0,boom=13.9,energy=16.15,eflash=17.6,bang=22.4,count=25.2,wipe=30.35,left=33.0,earth=35.5,storm=38.3,banana=40.4,cern=45.45,trap=48.0,cost=50.9,bulb=56.4,pet=60.75,why=65.8,endc=68.9)
pad(0,73,[110,165,220],0.03)
for k in['twins','ann','energy','bang','earth','storm','banana','cern','cost','bulb','pet','why']: add(whoosh(0.4),TA[k]-0.3,0.25)
add(whoosh(0.5),-0.0+0.0,0.0)
add(boom(60,1.2,2.0),0.1,0.3);chime(0.2,0.2,1046)
chime(TA['twins']+0.3,0.15,880);chime(TA['twins']+0.5,0.15,1175)
add(beep(660,0.1),TA['twins']+1.6,0.15);add(beep(880,0.1),TA['twins']+2.7,0.15);add(beep(990,0.1),TA['names'],0.15)
risew(TA['ann'],TA['touch']-TA['ann']+0.8,0.25)
add(boom(45,2.0,1.5),TA['boom'],0.8);shing(TA['boom'],0.4);chime(TA['boom']+0.5,0.25,1318)
risew(TA['energy']+0.2,1.3,0.25);add(boom(35,2.5,1.2),TA['eflash'],0.9);add(lp(noise(2.0),500)*np.exp(-np.arange(int(2.0*SR))/SR*1.5),TA['eflash'],0.5)
add(boom(30,3.0,1.0),TA['bang'],1.0);shing(TA['bang']+0.1,0.3)
for i in range(30): ding(TA['wipe']+i*0.08,rng.uniform(1500,3500),0.05)
choir(TA['left'],2.4,[523,659,784],0.08)
for i in range(8): zip_(TA['earth']+0.3+i*0.33,0.12)
thunder(TA['storm']+0.25,0.5);thunder(TA['storm']+0.9,0.4);thunder(TA['storm']+1.5,0.45)
poof(TA['banana']+0.05,0.3);add(beep(1320,0.08),TA['banana']+1.6,0.18);add(beep(1320,0.08),TA['banana']+3.3,0.18)
n=int(5.4*SR);x=np.arange(n)/SR;add((np.sin(2*np.pi*120*x)+0.3*np.sin(2*np.pi*240*x))*np.minimum(1,x/0.3)*np.minimum(1,(5.4-x)/0.3),TA['cern'],0.04)
for i in range(6): zip_(TA['cern']+0.2+i*0.4,0.08)
jingle(TA['cost']+0.3,20,0.12);chime(TA['cost']+2.2,0.35,2093)
click(TA['bulb']+0.6,0.6);n=int(2.8*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*120*x)*0.5,TA['bulb']+0.6,0.03);click(TA['bulb']+3.4,0.5)
for i in range(4): add(beep(1000,0.08),TA['pet']+0.5+i*1.0,0.12)
pad(TA['why'],3.2,[220,262,330],0.08);add(boom(50,1.5,2),TA['why'],0.3)
chime(TA['endc'],0.3,1046);chime(TA['endc']+0.15,0.3,1318)
add(whoosh(0.5),72.3,0.4)
m=np.max(np.abs(out));sfx=out/m*0.9
# ---------- narration ----------
import json,subprocess
VO=json.loads(open('vo.js').read()[len('const VO='):-2])
vo=np.zeros(N)
for k,c in enumerate(VO):
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'vo/t{k}.wav','-af','atempo=1.1,highpass=f=70,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=20:release=200:makeup=2,afade=t=in:d=0.015,areverse,afade=t=in:d=0.04,areverse','-ar','44100','-ac','1',f'vo/s{k}.wav'],check=True)
    w=wave.open(f'vo/s{k}.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    i=int(c['t']*SR);n=min(len(x),N-i);vo[i:i+n]+=x[:n]
vo=vo/np.max(np.abs(vo))*0.92
act=(np.abs(vo)>0.015).astype(float);k=int(0.3*SR);act=np.convolve(act,np.ones(k)/k,'same');act=np.clip(act*4,0,1);act=np.convolve(act,np.ones(int(0.15*SR))/(0.15*SR),'same')
mix=sfx*(1-0.55*act)[:,None]*0.7+vo[:,None]*1.0
mix=mix/np.max(np.abs(mix))*0.95
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close()
subprocess.run(['ffmpeg','-loglevel','error','-y','-i','sfx_raw.wav','-af','alimiter=limit=0.95:attack=5:release=80,loudnorm=I=-14:TP=-1:LRA=11','-ar','44100','sfx_norm.wav'],check=True)
print('audio ok')
