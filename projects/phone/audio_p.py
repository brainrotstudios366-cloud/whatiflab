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
def tone(f,d,dec=6,harm=(1,0.5,0.25)):
    n=int(d*SR);x=np.arange(n)/SR;return sum(a*np.sin(2*np.pi*f*(k+1)*x)*np.exp(-x*dec*(1+k*0.6)) for k,a in enumerate(harm))*np.minimum(1,x/0.003)
def ring_marimba(f0,length):
    s=np.zeros(int(length*SR));pat=[0,4,7,12,7,4,0,7];step=0.11
    tt=0;i=0
    while tt<length-0.3:
        n=tone(f0*2**(pat[i%8]/12),0.3,14,(1,0.3,0.1));j=int(tt*SR);m=min(len(n),len(s)-j);s[j:j+m]+=n[:m];tt+=step;i+=1
        if i%8==0: tt+=0.5
    return s
def ring_bell(f0,length):
    n=int(length*SR);x=np.arange(n)/SR;gate=((x%1.6)<0.9).astype(float);trem=(np.sin(2*np.pi*22*x)>0).astype(float)
    return (np.sin(2*np.pi*f0*x)+0.6*np.sin(2*np.pi*f0*1.5*x))*gate*(0.5+0.5*trem)*0.6
def ring_beep(f0,length):
    n=int(length*SR);x=np.arange(n)/SR;gate=((x%0.5)<0.12).astype(float)*((x%2.0)<1.0)
    return np.sign(np.sin(2*np.pi*f0*x))*gate*0.25
def ring_chip(f0,length):
    s=np.zeros(int(length*SR));mel=[0,3,7,10,12,10,7,3];tt=0;i=0
    while tt<length-0.15:
        f=f0*2**(mel[i%8]/12);n=int(0.09*SR);x=np.arange(n)/SR;w=(2*((f*x)%1)-1)*0.3*np.exp(-x*8);j=int(tt*SR);m=min(n,len(s)-j);s[j:j+m]+=w[:m];tt+=0.1;i+=1
        if i%8==0: tt+=0.3
    return s
KINDS=[ring_marimba,ring_bell,ring_beep,ring_chip]
# city ambience
city=lp(noise(D),400,2)*0.12+bp(noise(D),300,1200)*0.05;add(city,0,1.0)
for tt in [1.5,4.2,6.8,13.0,26.0,58.0]: 
    n=int(0.5*SR);x=np.arange(n)/SR;h=(np.sign(np.sin(2*np.pi*420*x))+np.sign(np.sin(2*np.pi*530*x)))*0.15*np.minimum(1,x/0.02)*np.minimum(1,(0.5-x)/0.05);add(lp(h,3000),tt,0.25,rng.uniform(-0.8,0.8))
crowd=bp(noise(D),250,1500)*0.06;add(crowd,0,1.0)
for tt in np.arange(0.1,8,0.28): add(hp(noise(0.015),1500)*env(int(0.015*SR),0.001,0.006),tt,0.05,rng.uniform(-0.4,0.4))
# countdown ticks last 3 sec + riser
for k in range(3): add(beep(1000,0.06),5.0+k,0.12)
add(whoosh(1.5,True,200,6000),6.6,0.3)
# THE RING: 220 ringtones
ringbus=np.zeros((N,2))
for i in range(220):
    kind=KINDS[i%4];st=8.0+rng.uniform(0,0.9)**2*1.2;stop=20.2+rng.uniform(0,1.6)
    f=rng.uniform(500,1100) if kind!=ring_bell else rng.uniform(700,1300)
    s=kind(f,stop-st);fade=np.ones(len(s));fl=int(0.08*SR);fade[-fl:]=np.linspace(1,0,fl);s=s*fade
    add(s,st,0.05*rng.uniform(0.5,1.2),rng.uniform(-1,1),ringbus)
# duck rings during crane briefly louder
gain=np.ones(N);out+=ringbus*1.0
# a closer marimba hero ringtone
add(ring_marimba(880,12),8.05,0.35,0.2)
# taxi screeches
for tt in [11.0,11.4,12.0]:
    n=int(0.9*SR);x=np.arange(n)/SR;sc=bp(noise(0.9),2000,4500)*np.sin(np.pi*x/0.9)*0.6+np.sin(2*np.pi*(2600+200*np.sin(x*30))*x)*np.sin(np.pi*x/0.9)*0.15;add(sc,tt,0.3,rng.uniform(-0.6,0.6))
add(crunch(0.6),12.1,0.3,0.4)
# pigeons wings
for i in range(60):
    tt=16.4+rng.uniform(0,1.5)
    for k in range(6): add(bp(noise(0.04),400,2500)*env(int(0.04*SR),0.002,0.015),tt+k*0.07,0.08,rng.uniform(-1,1))
# answering: phone pickups clicks + murmur hellos (no words)
for i in range(80): add(hp(noise(0.02),2000)*env(int(0.02*SR),0.001,0.008),20.3+rng.uniform(0,1.6),0.12,rng.uniform(-1,1))
mur=bp(noise(6),300,2200)*np.sin(np.pi*np.linspace(0,1,int(6*SR)))*np.abs(np.sin(2*np.pi*3.3*np.arange(int(6*SR))/SR))*0.5; add(mur,20.8,0.5)
# earth: whoosh + data blips + pad
add(whoosh(1.2,True,300,5000),26.6,0.4)
pad=sum(np.sin(2*np.pi*f*np.arange(int(6*SR))/SR) for f in [110,165,220.5])*np.sin(np.pi*np.linspace(0,1,int(6*SR)))*0.12;add(pad,27,1.0)
for i in range(160): add(beep(rng.uniform(1500,3500),0.03),27.3+rng.uniform(0,5.6),0.05,rng.uniform(-1,1))
# tower: hum rising, crackles, explosion, power down
n=int(4*SR);x=np.arange(n)/SR;hum=(np.sin(2*np.pi*60*x)+0.5*np.sin(2*np.pi*120*x)+0.3*np.sign(np.sin(2*np.pi*180*x)))*np.linspace(0.2,1,n)*0.25;add(hum,33,1.0)
for i in range(70): add(hp(noise(0.03),3000)*env(int(0.03*SR),0.001,0.01)*rng.uniform(0.5,1),33.6+rng.uniform(0,3.4)**1.2,0.2,rng.uniform(-0.8,0.8))
for k in range(5): add(bp(noise(0.25),1000,8000)*env(int(0.25*SR),0.002,0.08),34.2+k*0.6,0.35,rng.uniform(-0.5,0.5))
add(boom(55,2.0,2.5),37.0,1.2); add(lp(noise(1.5),2500)*env(int(1.5*SR),0.002,0.4),37.0,0.9)
for i in range(30): add(hp(noise(0.03),3000)*env(int(0.03*SR),0.001,0.01),37.05+rng.uniform(0,1.5),0.25,rng.uniform(-1,1))
add(sweep(400,40,1.4)*np.linspace(1,0,int(1.4*SR))*0.4,38.0,0.6)
# silence: kill ambience 40-46 (handled by mask below), crickets
for tt in np.arange(40.6,45.8,0.45):
    for k in range(3): add(np.sin(2*np.pi*4300*np.arange(int(0.03*SR))/SR)*env(int(0.03*SR),0.003,0.01),tt+k*0.05,0.06,0.5)
# vibration + mom ring
n=int(2.6*SR);x=np.arange(n)/SR;vib=lp(np.sign(np.sin(2*np.pi*150*x)),400)*((x%1.0)<0.45)*0.4;add(vib,46.0,0.5)
add(ring_marimba(660,2.8),46.1,0.25)
# all phones mom ring (wide)
for i in range(60): add(ring_marimba(rng.uniform(600,900),3.0),49.2+rng.uniform(0,0.8),0.03,rng.uniform(-1,1))
# declines
for i in range(90): add(tone(rng.uniform(380,460),0.12,20,(1,0.2)),52.6+rng.uniform(0,1.3)**1.5,0.08,rng.uniform(-1,1))
add(tone(330,0.4,6),52.7,0.3)
# one guy answers: click + tiny chime
add(hp(noise(0.02),2000)*env(int(0.02*SR),0.001,0.008),55.6,0.5); add(tone(1320,0.4,8),55.65,0.15); add(tone(1760,0.5,8),55.8,0.12)
# end card
add(tone(880,0.5,5),60.5,0.2); add(tone(1320,0.6,5),60.65,0.17); add(whoosh(0.5,True),64.2,0.25)
# ambience mask: silence section & earth/tower
mask=np.ones(N);tt=np.arange(N)/SR
for a,b,v in [(27,40,0.15),(40,46,0.03)]:
    m=(tt>=a)&(tt<b);mask[m]=v
mask=np.convolve(mask,np.ones(2205)/2205,mode='same')
amb=np.zeros((N,2));amb[:,0]=city+crowd;amb[:,1]=city+crowd
out-= amb*0.7071*(1-mask)[:,None]
o=out/np.max(np.abs(out))*0.9
w=wave.open('sfx_raw.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close()
