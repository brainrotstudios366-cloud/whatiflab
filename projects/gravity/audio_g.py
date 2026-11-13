import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; D=60.0; N=int(SR*D); t=np.arange(N)/SR
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
    n=int(d*SR); x=np.linspace(0,1,n); s=rng.standard_normal(n); out_=np.zeros(n)
    # time-varying lowpass via blocks
    blk=1024
    for i in range(0,n,blk):
        k=x[i]; fc=(f0*(f1/f0)**(k if up else 1-k)); out_[i:i+blk]=lp(s[i:i+blk],min(fc,18000),1)
    return out_*np.sin(np.pi*x)**1.5*2.0

import json
land=json.load(open('land.json'))
def beep(f,d=0.09):
    n=int(d*SR); x=np.arange(n)/SR; return np.sin(2*np.pi*f*x)*env(n,0.002,0.05)
def thud(f0=80,d=0.35,g=1.0):
    return boom(f0,d,9)*g+lp(noise(d),400)*np.exp(-np.arange(int(d*SR))/SR*25)*0.6
def crunch(d=0.8):
    n=int(d*SR); x=np.arange(n)/SR
    c=bp(rng.standard_normal(n),200,6000)*np.exp(-x*6)*1.1
    m=sum(np.sin(2*np.pi*fq*x)*np.exp(-x*dd) for fq,dd in [(523,5),(781,6),(1187,7),(1630,9)])*0.1
    return c+m
def glass(t0,n=12,g=0.07,pan=(-1,1)):
    for k in range(n):
        m=int(0.12*SR); add(np.sin(2*np.pi*rng.uniform(3000,6500)*np.arange(m)/SR)*env(m,0.001,0.03),t0+rng.uniform(0,0.5),g,rng.uniform(*pan))
def drone(t0,t1,f=55,g=0.12):
    d=t1-t0; n=int(d*SR); x=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f*m*(1+0.002*k)*x+k) for m,k in [(1,0),(1,1),(1.5,2),(2,3),(0.5,4)])
    s=lp(s,400)*np.minimum(1,x/1.5)*np.minimum(1,(d-x)/0.8)*(0.8+0.2*np.sin(2*np.pi*0.2*x)); add(s,t0,g)
def heartbeat(t0,t1,per,g):
    tt=t0
    while tt<t1: add(boom(55,0.35,14),tt,g); add(boom(50,0.35,14),tt+0.22,g*0.7); tt+=per
def rumble(t0,d,g,fc=150):
    n=int(d*SR); x=np.arange(n)/SR; s=lp(rng.standard_normal(n),fc)*3*np.minimum(1,x/0.6)*np.minimum(1,(d-x)/0.8); add(s,t0,g)

drone(3.0,42.0,55,0.10); drone(3.0,42.0,82.4,0.035); drone(42.0,45.8,40,0.13); drone(50.4,56.4,49,0.1)
heartbeat(27.3,33.8,0.9,0.3); heartbeat(42.4,45.7,1.1,0.4)
amb=lp(noise(11.5),500)*1.3+hp(lp(noise(11.5),3000),800)*0.15; add(amb,0,0.33)
# cold open
for t0 in [0.12,0.3,0.45,0.62,0.75]: add(crunch(0.6),t0,0.45,rng.uniform(-.5,.5)); add(boom(70,0.5,7),t0,0.4)
add(boom(28,2.0,1.5),0.85,1.0); rumble(0.85,0.8,0.6,120); add(whoosh(0.4,True),1.25,0.5); add(boom(50,0.8,4),1.6,0.4)
for k in range(3): add(beep(1050 if k%2==0 else 850,0.18),1.9+k*0.22,0.25)
add(beep(1300),2.0,0.3)
# fountain splash bed (until 11.5)
fnt=hp(lp(noise(11.5),5000),1500)*0.25; add(fnt,0,0.25,0.4)
# gravity off
add(whoosh(0.6,False),2.6,0.5); add(boom(42,2.0,2.2),3.0,1.0); add(sweep(400,1600,1.2)*np.exp(-np.arange(int(1.2*SR))/SR*2)*0.15,3.0,0.5)
add(lp(noise(1.5),900)*np.sin(np.pi*np.linspace(0,1,int(1.5*SR)))**0.8*1.6,3.6,0.35)  # crowd gasp
add(whoosh(1.5,True,200,3000),4.8,0.45)
n=int(6.7*SR); x=np.arange(n)/SR; wind=bp(rng.standard_normal(n),150,1500)*1.2*np.minimum(1,x/2.5)*np.minimum(1,(6.7-x)/0.3); add(wind,4.8,0.45)
def horn(t0,f=380,d=0.6,pan=0):
    m=int(d*SR); x=np.arange(m)/SR; s=lp(np.sign(np.sin(2*np.pi*f*x))+0.6*np.sign(np.sin(2*np.pi*f*1.26*x)),2500)*np.minimum(1,x/0.02)*np.minimum(1,(d-x)/0.05); add(s,t0,0.05,pan)
for k in range(7): horn(5.2+rng.uniform(0,5),rng.uniform(330,450),rng.uniform(0.3,0.9),rng.uniform(-1,0))
add(whoosh(0.5,True),11.15,0.6)
# ocean
n=int(7.5*SR); x=np.arange(n)/SR; waves=lp(rng.standard_normal(n),700)*(0.6+0.4*np.sin(2*np.pi*0.18*x)**2)*1.5; add(waves,11.5,0.35)
for k in range(45):
    tt=13.0+rng.uniform(0,5.8); m=int(0.25*SR); x=np.arange(m)/SR; f=rng.uniform(140,320)*(1+2*x); add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*10)*0.5,tt,0.25,rng.uniform(-1,1))
rumble(13.5,5.5,0.5,90)
add(whoosh(0.5,True),18.65,0.6)
# sky: wind rush then thinning
n=int(8*SR); x=np.arange(n)/SR; w2=bp(rng.standard_normal(n),200,3000)*1.5; fade=np.clip(1-(x-2.5)/4,0.08,1); w2=w2*fade*np.minimum(1,x/0.3)
w2=lp(w2,2500); add(w2,19.0,0.45)
add(sweep(300,60,5)*np.minimum(1,np.arange(int(5*SR))/SR)*0.12,21.0,0.6)
add(whoosh(0.5,True),26.65,0.6)
# space
add(lp(noise(7),200)*1.5,27.0,0.25)
add(whoosh(1.0,True,300,5000),28.6,0.4); add(boom(35,2.5,1.4),29.1,0.7); add(sweep(200,900,2.5)*np.exp(-np.arange(int(2.5*SR))/SR*0.8)*0.15,29.1,0.6)
add(whoosh(0.5,True),33.65,0.6)
# volcano
rumble(34.0,8.0,0.6,90)
for k in range(8): add(boom(rng.uniform(30,45),1.0,4),34.3+k*0.5,0.2,rng.uniform(-1,1))
for k in range(5): add(boom(rng.uniform(22,32),2.5,1.2),38.25+k*0.11,0.7,rng.uniform(-.8,.8))
n=int(3.7*SR); x=np.arange(n)/SR; roar=lp(rng.standard_normal(n),300)*3*np.minimum(1,x/0.3)*np.minimum(1,(3.7-x)/0.5)+hp(lp(rng.standard_normal(n),3000),800)*0.6*np.minimum(1,(3.7-x)/0.5); add(roar,38.3,0.7)
for k in range(120): add(hp(noise(0.012),2000)*np.exp(-np.arange(int(0.012*SR))/SR*250),38.4+rng.uniform(0,3.4),0.2,rng.uniform(-1,1))
# gravity back
m=int(1.6*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(80*np.exp(x*2.6))/SR)*(x/1.6)**2*0.3,40.4,1.0); add(whoosh(1.6,True,200,9000),40.4,0.6)
add(boom(45,2.0,2),42.0,1.0)
add(lp(noise(3.8),300)*2*np.sin(np.pi*np.linspace(0,1,int(3.8*SR)))**0.7,42.0,0.35)
# falling whistles + landings
for k in range(6):
    d=1.6; m=int(d*SR); x=np.arange(m)/SR; f=1400*np.exp(-x*0.9); add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,x/0.2)*0.08,45.6+k*0.12,0.6,rng.uniform(-1,1))
for t0 in land: add(crunch(0.7),t0,0.55,rng.uniform(-.7,.7)); add(boom(70,0.5,7),t0,0.5); 
glass(47.4,20,0.06)
# twist: fall, impact, dazed, phone, sad trombone
n=int(1.45*SR); x=np.arange(n)/SR; add(bp(rng.standard_normal(n),200,4000)*1.5*(x/1.45)**1.5,48.75,0.5)
add(thud(60,0.7,1.5),50.2,1.0); add(boom(40,1.0,4),50.2,0.8)
m=int(2.0*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*3800*x)*np.minimum(1,x/0.05)*np.exp(-x*1.3)*0.15,50.5,0.7)
d=0.9; m=int(d*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(1800*np.exp(-x*1.2))/SR)*np.minimum(1,x/0.2)*0.1,51.35,0.6)
add(thud(120,0.25,0.8),52.24,0.8); glass(52.25,22,0.08)
for i,(f,d) in enumerate([(233,0.45),(220,0.45),(207,0.45),(196,1.3)]):
    m=int(d*SR); x=np.arange(m)/SR; vib=1+0.015*np.sin(2*np.pi*5.5*x)*(x/d); s=lp(2*((np.cumsum(f*vib)/SR)%1)-1,1400)*np.minimum(1,x/0.03)*np.minimum(1,(d-x)/0.08); add(s*0.35,52.75+i*0.48,0.7)
add(lp(noise(5),600)*0.8,50.5,0.25)
# end
add(boom(40,2.5,1.5),56.0,1.0); add(whoosh(0.7,True),55.4,0.5)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*0.9)*0.12; add(s,56.0,1.0,rng.uniform(-.5,.5))
add(whoosh(0.5,True),59.0,0.55); add(crunch(0.5),59.55,0.4)
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
