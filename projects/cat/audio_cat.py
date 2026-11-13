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
# ---------- ambience ----------
wind=lp(noise(D),300,2)*0.035;add(wind,0,1.0)
for k in range(10): bird(0.5+k*1.37+rng.uniform(0,0.4),0.06) if (0.5+k*1.37)<16 else None
# ---------- title ----------
taiko(0.05,1.0);taiko(0.45,0.6,90)
for i in range(4): add(whoosh(0.25,True,800,6000),0.1+i*0.18,0.15,rng.uniform(-0.5,0.5))
taiko(0.95,0.9,80);taiko(1.15,1.4,58);add(boom(40,1.6,2.0),1.15,0.9);meow(1.3,0.45,560,0.5,1.4)
for r in[3.4,16.4,28.0,39.6]: taiko(r,1.1,62);add(boom(45,1.2,3),r,0.5)
# ---------- stage 1 dogs ----------
n=int(4.6*SR);x=np.arange(n)/SR;add(lp(noise(4.6),220,2)*np.minimum(1,x/3),3.4,0.9)
for k in range(70):
    tt=3.6+k*0.065
    if tt>=8.0: break
    bark(tt+rng.uniform(0,0.05),0.06+0.3*(tt-3.4)/4.6,rng.uniform(330,560),rng.uniform(-0.7,0.7))
add(beep(0,0.01),5.6,0.0);shing(7.55,0.35)
add(whoosh(0.2,True,800,8000),7.92,0.6);vboom(8.0,1.2);add(crunch(0.5),8.0,0.4);add(boom(40,1.8,1.6),8.0,0.9)
for k in range(10): add(sweep(500+rng.uniform(0,300),1400+rng.uniform(0,600),0.6)*np.exp(-np.arange(int(0.6*SR))/SR*3),8.1+k*0.11,0.05,rng.uniform(-0.6,0.6))
for k in range(5): chime(10.2+k*0.25,0.12,1800+k*200)
lick(11.6,8,0.2);purr(11.4,5.0,0.25)
# ---------- stage 2 vacuum ----------
n=int(5.2*SR);x=np.arange(n)/SR;mot=(np.sin(2*np.pi*180*x)*0.3+bp(noise(5.2),300,3000)*0.8)*np.minimum(1,x/1.5);add(mot,16.4,0.35)
n=int(1.9*SR);x=np.arange(n)/SR;add(bp(noise(1.9),400,6000)*np.minimum(1,x/0.3)*(0.9+0.1*np.sin(2*np.pi*40*x)),19.6,0.6);meow(19.8,0.35,620,0.7,1.6)
add(whoosh(0.6,True,300,3000),21.5,0.4);tok(22.1,0.8,500)
add(beep(1320,0.08),22.6,0.4);add(beep(990,0.08),22.72,0.4);add(beep(1568,0.12),22.84,0.4)
for k in range(6): add(beep(880*(1.12**k),0.07),23.0+k*0.08,0.25)
n=int(4.6*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*170*x)*0.2*np.minimum(1,x/0.3),23.4,0.6);purr(24.0,3.8,0.25)
# ---------- stage 3 ufo ----------
hum(28.0,4.6,110,0.35,0.06);hum(28.0,4.6,165,0.18,0.08)
n=int(2.7*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*(600+200*np.sin(2*np.pi*3*x))*x)*0.15*np.minimum(1,x/0.2),30.0,0.6)
meow(30.6,0.3,480,0.9,1.25)
hum(32.6,2.6,120,0.3,0.25)
for k in range(9):
    tt=32.85+k*0.24;r=k%3
    if r==0: clack(tt,0.6)
    elif r==1: boing(tt,0.3)
    else: hiss(tt,0.25,0.4)
    meow(tt+0.1,0.25,700+rng.uniform(-100,200),0.25,1.3) if k%2==0 else None
fallw(35.0,0.85,0.25);tok(35.9,1.0,600);add(thud(70,0.3,1.0),35.9,0.7)
hum(35.3,2.3,100,0.25,0.4);nuke(37.6,0.5,0.0,2.0)
lick(38.7,5,0.18)
# ---------- stage 4 bear ----------
for k in range(9):
    tt=39.8+k*0.3
    if tt>42.2: break
    add(thud(48,0.35,1.0),tt,0.4+0.06*k)
roar(42.6,1.1,0.9);add(lp(noise(1.1),400)*0.6,42.6,0.6)
n=int(1.0*SR);x=np.arange(n)/SR;f=380*(1-0.35*x);ph=np.cumsum(f)/SR;add(bp((2*(ph%1)-1),300,2000)*np.sin(np.pi*x)*0.35,43.9,0.6)
roar(45.4,1.2,1.2);add(boom(40,1.2,1.5),45.4,0.7)
hiss(46.6,1.0,1.0);add(boom(50,1.0,2),46.6,0.8);vboom(46.65,0.6)
meow(47.5,0.35,300,0.6,0.7);meow(48.0,0.3,320,0.5,0.75)
for k in range(10): add(thud(55,0.25,1.0),47.9+k*0.2,max(0.05,0.4-k*0.035))
vboom(48.25,1.0);lick(50.3,5,0.18);purr(50.1,1.4,0.2)
# ---------- final ----------
for k in range(12): add(crunch(0.08),51.8+k*0.27,0.25)
purr(51.7,1.8,0.18)
add(whoosh(0.5,True,200,1500),53.6,0.18)
n=int(1.2*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*58*x)*0.35*np.minimum(1,x/0.6),53.9,1.0)
taiko(55.0,1.2,55);add(boom(40,1.6,2),55.0,0.8);shing(55.95,0.6)
meow(56.1,0.8,900,0.7,1.9);boing(56.2,0.6);add(whoosh(0.4,True,500,5000),56.2,0.5)
n=int(1.0*SR);x=np.arange(n)/SR;add(np.sin(2*np.pi*(300+40*np.sin(2*np.pi*5*x))*x)*0.15*np.minimum(1,x/0.1),56.55,1.0)
fallw(57.55,0.45,0.25);add(thud(60,0.5,1.0),58.0,1.0);tok(58.0,1.0,500);vboom(58.1,1.1)
for k,f in enumerate([392,370,349,330]):
    d=0.35 if k<3 else 0.9;n=int(d*SR);x=np.arange(n)/SR;s=2*((f*x*(1+0.01*np.sin(2*np.pi*5*x)))%1)-1;add(lp(s,1500)*env(n,0.02,d*0.8)*0.35,58.6+k*0.38,1.0)
# ---------- end ----------
add(whoosh(0.5),61.4,0.4)
for k in range(3): add(beep(880 if k<2 else 1320,0.1),61.7+k*0.12,0.3)
add(whoosh(0.5),65.3,0.5)
m=np.max(np.abs(out));out=out/m*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
