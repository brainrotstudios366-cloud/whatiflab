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
# bed
add(lp(noise(D),300,2)*0.03,0,1.0)
for r0 in R[:5]:
    add(boom(70,0.5,7),r0,0.5); add(sweep(400,900,0.25,'saw')*env(int(0.25*SR),0.005,0.12),r0,0.12)
    add(beep(880,0.12),r0,0.15); add(beep(1320,0.18),r0+0.12,0.13)
def zoom(t0,g=0.4,pan=0.0,d=0.35):
    n=int(d*SR);x=np.arange(n)/SR;f=2400*np.exp(-x*6)+180
    s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*7)*0.5+hp(noise(d),2500)*np.exp(-x*12)*0.6
    add(s,t0-0.08,g,pan)



# hook: laser test pulses
for h,pn in [(0.45,-0.4),(1.35,0.4)]:
    pew(h-0.05,0.35,pn); zap(h,0.45,pn); add(boom(55,0.8,4),h,0.7,pn); electric(h,0.35,0.18,pn)
cough(2.2)
# R1 charge -> countdown -> LAUNCH
n=int(3.4*SR);x=np.arange(n)/SR
add(np.sin(2*np.pi*np.cumsum(60+500*(x/3.4)**2)/SR)*(x/3.4)**1.2*0.5,4.0,0.35); electric(4.0,3.4,0.12); plasma(4.6,2.8,0.35)
for k,tb in enumerate([6.2,6.6,7.0]): add(beep(880,0.12),tb,0.16)
add(hp(noise(0.3),1200)*env(int(0.3*SR),0.001,0.1),7.4,1.0); add(boom(36,2.6,1.2),7.4,1.5); add(boom(70,0.7,5),7.42,0.9)
add(whoosh(2.4,True,200,6000),7.4,0.7); roar(7.5,2.2,0.35); add(crunch(0.6),7.45,0.5)
add(lp(noise(2.6),1500,2)*np.exp(-np.arange(int(2.6*SR))/SR*1.2),7.4,1.1)
chime(9.95,0.12); cough(11.7); add(whoosh(0.8,False,300,3000),12.8,0.18)
# R2 deep space: drone, snack, cosmic-ray zaps
hum(13.6,10.5,55,0.12); shimmer(14.0,9.5,300,420,0.02)
munch(15.0,9)
for tz in [17.6,18.6]: zap(tz,0.6,-0.3); electric(tz,0.25,0.25,0.3); add(beep(2400,0.05),tz+0.05,0.1)
jingle(20.65,[523,659,784],0.1,0.1); munch(21.6,5); cough(23.0)
# R3 three suns
choir(25.0,5.4,165,0.07); choir(25.6,4.8,247,0.05); shimmer(25.2,5.0,700,1800,0.04)
for k,f in enumerate([880,1108,1318]): add(beep(f,0.2),25.6+k*0.5,0.1)
wobble(28.4,1.9,300,0.1)
for k in range(10): add(beep(1200+k*80,0.06),28.4+k*0.16,0.05)
add(thud(110,0.25,1.0),30.0,0.4); chime(30.75,0.12); cough(32.3)
# R4 Proxima superflare
hum(35.6,6.0,42,0.22); add(lp(noise(3.0),400,2)*(np.arange(int(3*SR))/SR/3)**1.5*2.2,36.0,0.4)
plasma(37.2,1.8,0.5)
add(hp(noise(0.4),900)*env(int(0.4*SR),0.0005,0.15),39.0,1.0); add(boom(32,3.0,1.0),39.0,1.5); add(boom(80,0.6,6),39.02,0.7)
sizzle(39.05,2.4,0.4); glitch(39.1,0.35); glitch(39.6,0.25); add(whoosh(1.8,False,300,5000),39.2,0.4)
jingle(41.65,[523,659,784,1046],0.1,0.12); cough(44.0)
# FINAL: arrival party -> calendar -> old age
jingle(46.5,[523,659,784,1046,1318],0.09,0.13)
for k in range(18): tok(46.55+rng.uniform(0,0.9),0.09,rng.uniform(2500,6000),rng.uniform(-0.9,0.9))
add(beep(700,0.25),48.45,0.1)
ticks(48.6,53.0,2,14,0.15)
for k in range(14): add(hp(noise(0.05),2000)*env(int(0.05*SR),0.001,0.02),50.4+k*0.18+rng.uniform(0,0.03),0.12,0.4)
theremin(50.4,2.6,600,300,0.06)
add(thud(90,0.35,1.0),53.95,0.6)
for i,f in enumerate([392,370,349,330]):
    d=0.42 if i<3 else 1.0; n=int(d*SR);x=np.arange(n)/SR
    s=lp(2*((np.cumsum(np.full(n,f))/SR)%1)-1,1600)*np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.08); add(s,54.1+i*0.42,0.16)
add(beep(880,0.15),61.1,0.15); add(beep(1320,0.25),61.25,0.13)
add(whoosh(0.5,True),65.2,0.2)
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
