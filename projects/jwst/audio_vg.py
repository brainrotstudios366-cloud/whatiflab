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
def tok(t0,g=0.2,f=1800,pan=0.0):
    n=int(0.04*SR); add(bp(noise(0.04),f*0.7,f*1.4)*env(n,0.0005,0.008)+np.sin(2*np.pi*f*np.arange(n)/SR)*env(n,0.0005,0.01)*0.5,t0,g,pan)
def ticks(a,b,r0,r1,g=0.18):
    t=a;i=0
    while t<b:
        k=(t-a)/(b-a); r=r0+(r1-r0)*np.sin(np.pi*k)**1.5; tok(t,g,1800 if i%2 else 1400); t+=1.0/max(r,0.5); i+=1
def jingle(t0,notes,d=0.12,g=0.12):
    for i,f in enumerate(notes):
        n=int(0.35*SR);x=np.arange(n)/SR; add((np.sin(2*np.pi*f*x)+0.3*np.sin(4*np.pi*f*x))*env(n,0.003,0.12),t0+i*d,g)
def shimmer(t0,d,f0,f1,g=0.06):
    n=int(d*SR);x=np.arange(n)/SR
    for m in [1,1.5,2.01]: add(sweep(f0*m,f1*m,d)*np.minimum(1,x/0.1)*np.minimum(1,(d-x)/0.2),t0,g/m)
def wobble(t0,d,f=300,g=0.08):
    n=int(d*SR);x=np.arange(n)/SR; s=np.sin(2*np.pi*(f*x+ (f*0.25/6)*np.sin(2*np.pi*6*x)))*np.minimum(1,x/0.1)*np.minimum(1,(d-x)/0.3); add(s,t0,g)
def glitch(t0,g=0.25):
    for k in range(5): add(hp(noise(0.02),1500)*(rng.random(int(0.02*SR))<0.5),t0+k*0.025,g*rng.uniform(0.5,1),rng.uniform(-0.7,0.7))
    add(sweep(1800,300,0.1,'saw')*env(int(0.1*SR),0.001,0.06),t0,g*0.4)
def bonk(t0,g=0.7):
    add(boom(140,0.4,10),t0,g); add(beep(2200,0.08),t0+0.01,g*0.3); 
    for k in range(3): add(chirp(2600+k*300,0.08),t0+0.25+k*0.12,0.05)
R=[3.0,13.5,24.5,35.5,46.0,61.0]
def bells(t0,d,g=0.06,rate=9):
    # sleigh bells: bursts of high metallic jingles
    k=0
    while k*1.0/rate<d:
        tt=t0+k/rate+rng.uniform(0,0.02); n=int(0.12*SR); x=np.arange(n)/SR
        s=sum(np.sin(2*np.pi*f*x) for f in rng.uniform(5000,9000,4))*np.exp(-x*40)
        add(hp(s,3000),tt,g*rng.uniform(0.6,1),rng.uniform(-0.5,0.5)); k+=1
def glass(t0,g=0.5):
    for k in range(10):
        n=int(0.5*SR);x=np.arange(n)/SR;f=rng.uniform(2500,7000)
        add(np.sin(2*np.pi*f*x)*np.exp(-x*rng.uniform(8,20)),t0+rng.uniform(0,0.12),g*0.2,rng.uniform(-0.7,0.7))
    add(hp(noise(0.3),2000)*env(int(0.3*SR),0.001,0.06),t0,g)
def ice_crack(t0,g=0.6):
    for k in range(8): add(bp(noise(0.04),1500,9000)*env(int(0.04*SR),0.0005,0.01),t0+k*0.03+rng.uniform(0,0.02),g*(1-k*0.08),rng.uniform(-0.6,0.6))
    add(boom(120,0.4,8),t0,g*0.6)
def wind(t0,d,g=0.5):
    n=int(d*SR); x=np.arange(n)/SR; s=noise(d); o_=np.zeros(n)
    for i in range(0,n,2048):
        fc=800+350*np.sin(2*np.pi*0.4*x[i])+200*np.sin(2*np.pi*1.3*x[i]); o_[i:i+2048]=bp(s[i:i+2048],max(150,fc*0.6),fc*1.8,1)
    add(o_*np.minimum(1,x/1.0)*np.minimum(1,(d-x)/1.0)*2.2,t0,g)
def roll(t0,d,g=0.6):
    n=int(d*SR);x=np.arange(n)/SR; s=lp(noise(d),180,3)*(x/d)**1.6*3; add(s,t0,g); add(boom(35,d,0.3)*(x/d)**2,t0,g*0.6)

def electric(t0,d,g=0.3,pan=0.0):
    n=int(d*SR);x=np.arange(n)/SR
    buzz=np.sign(np.sin(2*np.pi*120*x))*0.3+np.sin(2*np.pi*240*x)*0.3
    crackle=bp(noise(d),2000,9000)*(rng.random(n)<0.08)*3
    add(lp(buzz,3000)*np.minimum(1,x/0.05)*np.minimum(1,(d-x)/0.1)+crackle*np.minimum(1,(d-x)/0.1),t0,g,pan)
def plasma(t0,d,g=0.4):
    n=int(d*SR);x=np.arange(n)/SR
    s=whoosh(d,True,200,2500)*(x/d)*1.5+lp(noise(d),300,2)*(x/d)**1.5*2.5+np.sin(2*np.pi*np.cumsum(40+60*(x/d))/SR)*(x/d)**2*0.6
    add(s,t0,g)
def choir(t0,d,f=220,g=0.08):
    n=int(d*SR);x=np.arange(n)/SR;s=0
    for m,a in [(1,1),(1.5,0.6),(2,0.5),(2.5,0.25)]:s=s+a*np.sin(2*np.pi*f*m*x+0.3*np.sin(2*np.pi*5*x+m))
    add(s*np.minimum(1,x/0.6)*np.minimum(1,(d-x)/0.8),t0,g)
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
R=[3.4,14.0,24.0,34.0,45.0,55.0,61.6]
R=[3.4,14.0,24.6,35.6,46.4,61.6]
EV=dict(mWind=6.4,mDash=7.75,punch=8.0,bounce=8.15,dizzy=10.2,mSheath=11.6,dango=15.2,cock=16.6,snap=18.0,toast=18.4,yum=21.0,crocStop=28.4,lunge=29.5,jam=29.9,dent=32.4,
  surf=36.4,click=39.4,reach=40.6,bounceW=41.0,tiny=43.4,boss=47.2,buzz=47.6,sl1=49.0,sl2=49.75,sl3=50.5,mland=52.4,bite=53.2,slapUp=54.0,slap=54.45,floor=55.2)
def buzz(t0,d,g=0.1,pan=0.0,f=560):
    n=int(d*SR);x=np.arange(n)/SR;fm=f*(1+0.03*np.sin(2*np.pi*3.1*x)+0.02*np.sin(2*np.pi*7.3*x));ph=2*np.pi*np.cumsum(fm)/SR;s=np.sign(np.sin(ph))*0.6+np.sin(2*ph)*0.3
    s=bp(s,300,4000)*np.minimum(1,x/0.15)*np.minimum(1,(d-x)/0.15);add(s,t0,g,pan)
def snapS(t0,g=1.0):
    add(hp(noise(0.06),1200)*env(int(0.06*SR),0.0003,0.012),t0,1.6*g);add(boom(60,0.8,4),t0,0.8*g);add(bp(noise(0.5),2000,8000)*env(int(0.5*SR),0.002,0.15),t0+0.02,0.4*g)
R=[3.4,14.2,25.0,36.0,47.0,61.6]
EV0=dict(ign=5.0,lift=6.3,cut=7.75,hit=7.95,cool=11.0,bdesc=14.2,chop=16.8,catch=19.6,jeal=21.8,vent=26.4,freeze=28.6,crack=31.2,ice=32.8,
  ready=37.4,jump=40.3,slice=40.75,land=41.2,boom=41.9,walk=43.6,boss=47.2,whistle=49.6,look=50.4,bonk=53.2,floor=54.0)
def rumble(t0,d,g=0.6,fc=180):
    n=int(d*SR);x=np.arange(n)/SR;s=lp(noise(d),fc,2)*(0.7+0.3*np.sin(2*np.pi*6.3*x))*np.minimum(1,x/0.4)*np.minimum(1,(d-x)/0.6);add(s,t0,g)
def hiss(t0,d,g=0.3,f1=2000,f2=9000):
    n=int(d*SR);x=np.arange(n)/SR;add(bp(noise(d),f1,f2)*np.minimum(1,x/0.2)*np.minimum(1,(d-x)/0.5),t0,g)
def fallwh(t0,d,g=0.2,f0=2600,f1=700):
    n=int(d*SR);x=np.arange(n)/SR;f=f0*(f1/f0)**(x/d);s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,x/0.3)*np.minimum(1,(d-x)/0.05);add(s,t0,g)
add(lp(noise(D),400,2)*0.03,0,1.0)
# title
taiko(0.02,1.1);taiko(0.3,0.7,90);taiko(0.62,1.3,58);add(whoosh(0.6),0.0,0.35)
for k,f in enumerate([523,659,784,1046,1318]): add(beep(f,0.12),0.05+k*0.07,0.12)
choir(0.2,3.0,196,0.05);hum(0.0,3.4,55,0.12)
for r0 in R[:5]: taiko(r0,1.0);taiko(r0+0.18,0.7,95);add(whoosh(0.5),r0-0.3,0.35)
EV=dict(plume=5.2,umb=7.2,snow=8.2,cool=11.4,chunks=15.4,cut1=17.6,cut2=18.5,cut3=19.3,ice=21.4,wall=25.2,brace=27.0,pass_=30.0,meh=31.4,
  send=38.2,nap=40.0,reply=43.4,react=44.2,boss=48.4,ray=50.8,flip=51.2,thrust=52.4,fling=54.4,ko=55.6)
# space drone bed
hum(0.0,D,48,0.05,0.0,2.0)
# R1 Io volcano
wind(EV['plume']-0.3,R[1]-EV['plume'],0.7);hiss(EV['plume'],R[1]-EV['plume']-0.5,0.18,1500,7000);add(boom(45,1.4,2.2),EV['plume'],0.7)
add(whoosh(0.4,True,500,6000),EV['umb']-0.15,0.5);poof(EV['umb']+0.05,0.5)
for k in range(26): tok(EV['snow']+k*0.12+rng.uniform(0,0.06),0.06+0.04*rng.random(),rng.uniform(2500,4500),rng.uniform(-0.5,0.5))
for k,f in enumerate([659,784,1046]): add(beep(f,0.12),EV['cool']+0.3+k*0.1,0.1)
# R2 rings
for k in range(6): add(whoosh(0.5,True,300,3000),EV['chunks']+k*0.6,0.25,rng.uniform(-0.7,0.7))
for c,p in zip([EV['cut1'],EV['cut2'],EV['cut3']],[-0.4,0.4,0.0]): slashw(c,1.1,0.35,p);shing(c,1.0,1.2,p);glass(c+0.02,0.7);ice_crack(c+0.03,0.5)
slide(EV['ice']-0.6,0.4);click(EV['ice']-0.3,1.0);bells(EV['ice'],1.2,0.05)
for k,f in enumerate([784,988,1318]): add(beep(f,0.12),EV['ice']+0.6+k*0.1,0.12)
# R3 heliopause
plasma(EV['wall'],EV['pass_']-EV['wall'],0.35);rumble(EV['wall']+1.0,EV['pass_']-EV['wall']-0.6,0.7,220);choir(EV['wall']+0.5,4.5,147,0.06)
add(whoosh(1.4,True,200,6000),EV['pass_']-1.2,0.8);add(boom(50,1.6,2.5),EV['pass_'],1.0);wind(EV['pass_'],1.5,0.5)
add(sweep(300,200,0.6)*env(int(0.6*SR),0.01,0.5),EV['meh']+0.1,0.12)
for k in range(5): chime(EV['pass_']+0.8+k*0.7,0.06)
# R4 one light-day
for k in range(3): add(beep(1568,0.05),EV['send']-0.9+k*0.18,0.12)
add(sweep(600,1600,0.4)*env(int(0.4*SR),0.01,0.3),EV['send'],0.15)
for k in range(4): add(sweep(1200,500,0.6)*env(int(0.6*SR),0.005,0.5),EV['send']+0.05+k*0.22,0.08)
ticks(EV['send']+0.6,EV['reply'],4,22,0.12)
for k in range(3): add(sweep(250,180,0.5)*env(int(0.5*SR),0.05,0.4),EV['nap']+0.6+k*1.0,0.06)
add(beep(180,0.45),EV['reply'],0.35);add(beep(140,0.5),EV['reply']+0.5,0.3)
add(sweep(320,210,0.6)*env(int(0.6*SR),0.01,0.5),EV['react']+0.1,0.12)
# FINAL cosmic ray
add(sweep(220,110,1.0)*env(int(1.0*SR),0.02,0.8),EV['boss'],0.25);add(boom(40,1.5,2),EV['boss'],0.6)
add(whoosh(0.5,True,800,9000),EV['ray']-0.45,0.5);glass(EV['ray'],0.8);add(boom(110,0.5,8),EV['ray'],0.8);tok(EV['ray'],0.4,5200)
bonk(EV['flip']+0.5,0.5);add(beep(220,0.25),EV['flip']+0.55,0.2)
hiss(EV['thrust'],EV['fling']-EV['thrust']+2.0,0.5,1200,8000);wobble(EV['thrust']+0.5,EV['fling']-EV['thrust'],300,0.08)
add(whoosh(0.8,True,300,5000),EV['fling']-0.1,0.9);add(whoosh(1.5,False,4000,300),EV['fling']+0.5,0.4)
add(beep(1046,0.6),EV['ko'],0.3)
for k,f in enumerate([392,370,349,330]):
    d=0.35 if k<3 else 0.9;n=int(d*SR);x=np.arange(n)/SR;s=2*((f*x*(1+0.01*np.sin(2*np.pi*5*x)))%1)-1;add(lp(s,1500)*env(n,0.02,d*0.8)*0.35,EV['ko']+0.4+k*0.38,1.0)
for k in range(3): add(beep(880 if k<2 else 1320,0.1),61.7+k*0.12,0.3)
add(whoosh(0.5),65.3,0.5)
m=np.max(np.abs(out));out=out/m*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
