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
T_ENG=7.8
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

drone(3.0,42.0,55,0.10); drone(3.0,42.0,82.4,0.035); drone(42.0,47.0,46,0.12); drone(48.75,56.4,49,0.11)
heartbeat(19.4,26.8,0.85,0.28); heartbeat(42.6,46.9,0.75,0.4); heartbeat(49.2,56,1.0,0.32)
# city ambience, muffled after ear pop, quieter after engines die
n=int(11.5*SR); amb=lp(noise(11.5),500)*1.3+hp(lp(noise(11.5),3000),800)*0.15; tt_=np.arange(n)/SR
g=np.where(tt_<T_ENG,1.0,np.maximum(0.35,1-(tt_-T_ENG)/1.2)); amb*=g
i0=int(6.15*SR); i1=int(8.3*SR); amb[i0:i1]=lp(amb[i0:i1],350)*1.4
add(amb,0,0.35)
# cold open: crumble + giant explosion
rumble(0.0,0.9,0.7,140)
for k in range(6): add(lp(noise(0.2),900)*np.exp(-np.arange(int(0.2*SR))/SR*15),0.05+k*0.12,0.3,rng.uniform(-1,1))
add(boom(28,2.0,1.6),0.85,1.1); add(lp(noise(1.2),500)*np.exp(-np.arange(int(1.2*SR))/SR*2)*1.6,0.85,0.8)
add(whoosh(0.4,True),1.25,0.5); add(boom(50,0.8,4),1.6,0.4)
for k in range(3): add(beep(1050 if k%2==0 else 850,0.18),1.9+k*0.22,0.25)
add(beep(1300),2.0,0.3)
# oxygen gone 3.0: boom + air rushing out
add(whoosh(0.6,False),2.6,0.5); add(boom(42,2.0,2.2),3.0,1.0)
add(whoosh(1.6,False,200,4000),3.0,0.55)
# ear pop 6.15 + tinnitus
add(boom(90,0.25,25),6.15,1.0); add(hp(noise(0.03),500)*np.exp(-np.arange(int(0.03*SR))/SR*120),6.15,0.8)
m=int(2.6*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*4200*x)*np.minimum(1,x/0.05)*np.exp(-x*1.1)*0.18,6.17,0.7)
# engines die 7.8: sputters
for k in range(5):
    d=1.4; m=int(d*SR); x=np.arange(m)/SR; f=rng.uniform(90,140)*np.exp(-x*1.8)+25
    s=lp(2*((np.cumsum(f)/SR)%1)-1,900)*np.exp(-x*1.5)*(0.6+0.4*np.sign(np.sin(2*np.pi*rng.uniform(6,12)*x)))
    add(s,7.8+k*0.12,0.12,rng.uniform(-1,0.3))
n=int(0.8*SR); x=np.arange(n)/SR; add(np.sin(2*np.pi*(2600+120*np.sin(2*np.pi*9*x))*x)*0.05*np.sin(np.pi*x/0.8),8.4,0.5,-0.4)
# flames out 9.5
add(lp(noise(0.5),300)*np.exp(-np.arange(int(0.5*SR))/SR*8)*1.6,9.5,0.6,-0.1); add(hp(noise(0.8),2500)*np.exp(-np.arange(int(0.8*SR))/SR*4)*0.4,9.52,0.4)
fz=hp(lp(noise(9.5),3000),600)*0.15; fz=fz*(np.arange(len(fz))/SR<9.5); add(fz,0,0.25,-0.1)  # fire crackle bed
for k in range(60):
    tt=rng.uniform(1.6,9.5); add(hp(noise(0.01),2000)*np.exp(-np.arange(int(0.01*SR))/SR*300),tt,0.2,-0.1)
add(whoosh(0.5,True),11.15,0.6)
# crumble 11.5-19
add(lp(noise(7.5),600)*1.1,11.5,0.28)
for k in range(260):
    tt=14.4+rng.exponential(1.4); 
    if tt<19: add(bp(noise(0.03),800,6000)*np.exp(-np.arange(int(0.03*SR))/SR*120),tt,rng.uniform(0.05,0.18),rng.uniform(-1,1))
rumble(14.4,4.6,0.85,120)
for k in range(16): add(boom(rng.uniform(30,50),1.0,4),14.8+rng.uniform(0,3.8),0.3,rng.uniform(-.8,.8))
add(whoosh(0.5,True),18.65,0.6)
# plane 19-27: jet roar then spool down
n=int(8*SR); x=np.arange(n)/SR; on=np.where(x<1.5,1.0,np.exp(-(x-1.5)/0.9))
jet=lp(rng.standard_normal(n),900)*1.6*on+np.sin(2*np.pi*np.cumsum(np.where(x<1.5,420,420*np.exp(-(x-1.5)/1.4)+60))/SR)*0.12*on
wind=bp(rng.standard_normal(n),200,2500)*0.6*(0.6+0.4*np.sin(2*np.pi*0.2*x))
add((jet+wind)*np.minimum(1,x/0.2)*np.minimum(1,(8-x)/0.3),19.0,0.4)
add(boom(70,0.4,10),20.5,0.5); add(lp(noise(0.3),400)*np.exp(-np.arange(int(0.3*SR))/SR*10)*1.5,20.52,0.4)
add(whoosh(0.5,True),26.65,0.6)
# ocean 27-34
n=int(7*SR); x=np.arange(n)/SR; waves=lp(rng.standard_normal(n),700)*(0.6+0.4*np.sin(2*np.pi*0.18*x)**2)*1.5*np.where(x<2.7,1,np.maximum(0,1-(x-2.7)/1.0)); add(waves,27.0,0.35)
n=int(4.3*SR); x=np.arange(n)/SR; fizz=hp(rng.standard_normal(n),2500)*0.5*np.minimum(1,x/0.8)*np.minimum(1,(4.3-x)/0.3)
for k in range(400): 
    i=rng.integers(0,n-200); fizz[i:i+200]+=np.sin(2*np.pi*rng.uniform(1500,4000)*np.arange(200)/SR)*np.exp(-np.arange(200)/40)*0.3
add(fizz,29.7,0.45); rumble(29.7,4.3,0.6,90)
m=int(2*SR); x=np.arange(m)/SR; add(lp(2*((np.cumsum(55+15*np.sin(2*np.pi*0.7*x))/SR)%1)-1,500)*np.sin(np.pi*x/2)*0.5,31.3,0.4,-0.4)  # hull groan
add(whoosh(0.5,True),33.65,0.6)
# crust 34-42
add(lp(noise(8),500)*1.0,34.0,0.25)
for k in range(10): add(hp(noise(0.12),600)*np.exp(-np.arange(int(0.12*SR))/SR*25)*1.2,36.9+rng.uniform(0,1.8),0.35,rng.uniform(-1,1))
add(boom(26,3.0,1.0),38.8,1.0); rumble(36.9,5.0,0.95,100)
for k in range(20): add(boom(rng.uniform(30,45),1.0,3),37.2+rng.uniform(0,3.5),0.25,rng.uniform(-1,1))
# oxygen back 42
m=int(1.6*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(80*np.exp(x*2.6))/SR)*(x/1.6)**2*0.3,40.4,1.0); add(whoosh(1.6,True,200,9000),40.4,0.6)
add(boom(45,2.0,2),42.0,1.0); add(whoosh(1.2,True,200,3000),42.0,0.45)
add(lp(noise(5),400)*1.2,42.0,0.25); add(hp(lp(noise(5),5000),2000)*0.2,42.0,0.2)
# BOOM 47.05
add(whoosh(0.7,True,200,8000),46.35,0.5)
add(boom(22,5.0,0.7),47.05,1.4); add(boom(40,3.0,1.2),47.1,0.9)
n=int(4*SR); x=np.arange(n)/SR; roar=lp(rng.standard_normal(n),600)*3*np.exp(-x*0.6)+bp(rng.standard_normal(n),300,4000)*0.8*np.exp(-x*1.2); add(roar,47.05,0.9)
for k in range(80): add(bp(noise(0.02),1000,8000)*np.exp(-np.arange(int(0.02*SR))/SR*150),47.2+rng.exponential(0.6),0.3,rng.uniform(-1,1))
# rain 48.75-56: rain + sizzle + thunder
n=int(8.5*SR); x=np.arange(n)/SR; rain=hp(lp(rng.standard_normal(n),6000),900)*0.9*np.minimum(1,x/0.5)+lp(rng.standard_normal(n),400)*0.5
add(rain,48.75,0.45); add(hp(rng.standard_normal(int(7*SR)),3500)*0.35,49.0,0.35)
for k in range(300): add(hp(noise(0.006),2500)*np.exp(-np.arange(int(0.006*SR))/SR*500),48.8+rng.uniform(0,7),0.25,rng.uniform(-1,1))
add(boom(35,3.0,1.0),50.6,0.5,-0.4); add(boom(38,2.5,1.2),54.2,0.4,0.5)
# end
add(boom(40,2.5,1.5),56.0,1.0); add(whoosh(0.7,True),55.4,0.5)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*0.9)*0.12; add(s,56.0,1.0,rng.uniform(-.5,.5))
add(whoosh(0.5,True),59.0,0.55); rumble(59.45,0.55,0.6,140)
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
