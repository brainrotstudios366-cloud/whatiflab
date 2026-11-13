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
ev=json.load(open('events.json'))
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
# beds
drone(3.0,42.0,55,0.10); drone(3.0,42.0,82.4,0.035); drone(48.75,56.4,49,0.11)
heartbeat(3.6,11.3,0.9,0.3); heartbeat(19.3,26.8,0.85,0.3); heartbeat(43.0,46.6,1.1,0.35); heartbeat(49.2,56,1.0,0.35)
# city ambience 0-11.5 (+ cold open SF/collapse)
amb=lp(noise(11.5),500)*1.3+hp(lp(noise(11.5),3000),800)*0.15; add(amb,0,0.35)
# ===== cold open 0-1.6 (SF cars piling + collapse)
for k in range(4): add(crunch(0.6),0.1+k*0.17,0.45,rng.uniform(-.5,.5))
add(whoosh(0.35,True),0.55,0.5); rumble(0.85,1.0,0.6,120); add(boom(38,1.2,3),0.86,0.9)
for k in range(3): add(thud(60,0.5),0.95+k*0.2,0.5,rng.uniform(-.6,.6))
add(whoosh(0.4,True),1.25,0.6); add(boom(50,0.8,4),1.6,0.5)
# countdown + alert
add(beep(1300),2.0,0.3)
for k in range(3): add(beep(1050 if k%2==0 else 850,0.18),1.9+k*0.22,0.25)
# ===== friction gone 3.0
add(whoosh(0.6,False),2.6,0.5); add(boom(42,2.0,2.2),3.0,1.0); add(sweep(2000,60,0.6)*np.exp(-np.arange(int(0.6*SR))/SR*4)*0.3,3.0,0.6)
# phone slips: swish + clatter on ground ~3.9
add(whoosh(0.5,False,600,5000),3.05,0.35)
m=int(0.5*SR); x=np.arange(m)/SR
for k in range(4): add(bp(rng.standard_normal(int(0.06*SR)),1500,7000)*env(int(0.06*SR),0.001,0.015)*1.2,3.95+k*0.11*(1-k*0.15),0.5*(1-k*0.2),0.2)
add(np.sin(2*np.pi*2400*x)*np.exp(-x*12)*0.15,3.95,0.5)
# people falling ~5.6-6.5: many thuds + crowd gasp; POV fall 6.45
for k in range(40): add(thud(rng.uniform(70,110),0.3),5.6+rng.uniform(0,0.95),rng.uniform(0.08,0.2),rng.uniform(-1,1))
add(lp(noise(1.4),900)*np.sin(np.pi*np.linspace(0,1,int(1.4*SR)))**0.8*1.6,5.5,0.4)
add(whoosh(0.55,False,300,3000),5.85,0.5); add(thud(70,0.6,1.3),6.45,1.0); add(lp(noise(0.3),300)*np.exp(-np.arange(int(0.3*SR))/SR*20),6.45,0.6)
# car crashes from sim (no tire screech: no friction!)
for t0,rel in ev['crash']:
    g=min(1.0,0.25+rel/10); add(crunch(0.9),t0,0.75*g,-0.4); add(boom(70,0.5,7),t0,0.6*g,-0.3)
    if rel>4: glass(t0+0.05,10,0.06,(-0.9,0.1))
# car alarms after first crashes
def alarm(t0,t1,f1=1200,f2=900,per=0.5,g=0.06,pan=0):
    tt=t0;k=0
    while tt<t1:
        m=int(per/2*SR);x=np.arange(m)/SR;add(lp(np.sign(np.sin(2*np.pi*(f1 if k%2==0 else f2)*x)),3000)*0.5,tt,g,pan);tt+=per/2;k+=1
alarm(8.6,11.5,pan=-0.5); alarm(9.0,11.5,1500,1100,0.3,0.045,0.3)
add(whoosh(2.8,True,200,1200),8.0,0.3); add(whoosh(0.5,True),11.15,0.6)
# ===== buildings fall apart 11.5-19
wind=lp(noise(7.5),600)*1.2; add(wind,11.5,0.3)
for k in range(30):  # metal groans
    d=rng.uniform(0.4,1.2); m=int(d*SR); x=np.arange(m)/SR; f=rng.uniform(70,160)*(1+0.3*np.sin(2*np.pi*rng.uniform(0.5,2)*x))
    s=lp(2*((np.cumsum(f)/SR)%1)-1,900)*np.sin(np.pi*x/d)**2; add(s,12.3+rng.uniform(0,4.5),0.12,rng.uniform(-1,1))
for k in range(70):  # bolts popping
    m=int(0.15*SR); x=np.arange(m)/SR; f=rng.uniform(1800,4200); add(np.sin(2*np.pi*f*x)*np.exp(-x*30)*0.5+hp(rng.standard_normal(m),3000)*np.exp(-x*80)*0.4,12.8+rng.uniform(0,4.5),0.18,rng.uniform(-1,1))
rumble(13.6,5.6,0.7,140)
for ts,tl,a in ev['land']:
    g=min(1,0.25+a/400); add(boom(rng.uniform(32,50),1.2,3.5),tl,0.35*g,rng.uniform(-.7,.7)); add(lp(noise(0.8),700)*np.exp(-np.arange(int(0.8*SR))/SR*4),tl,0.25*g,rng.uniform(-.7,.7))
add(whoosh(0.5,True),18.65,0.6)
# ===== San Francisco 19-27
add(lp(noise(8),600)*1.0+hp(lp(noise(8),3000),900)*0.1,19.0,0.3)
for k in range(2):  # cable car bell
    m=int(0.9*SR); x=np.arange(m)/SR; add((np.sin(2*np.pi*1320*x)+0.6*np.sin(2*np.pi*2640*x)+0.3*np.sin(2*np.pi*3960*x))*np.exp(-x*5)*0.3,19.25+k*0.22,0.5,0.1)
for t0,cab in ev['sf']:
    if 19.0<t0<27.2: add(crunch(0.9 if cab else 0.6),t0,0.9 if cab else 0.5,rng.uniform(-.4,.4)); add(boom(60 if cab else 80,0.6,6),t0,0.8 if cab else 0.4)
    if cab and 19<t0<27.2: glass(t0,16,0.08)
alarm(22.0,27.0,1250,950,0.45,0.035,0.4)
add(whoosh(0.5,True),26.65,0.6)
# ===== highway 27-34: wind, engines revving with no grip
add(lp(noise(7),700)*1.4,27.0,0.32)
for k in range(5):
    d=3.5; m=int(d*SR); x=np.arange(m)/SR; f=rng.uniform(70,110)*(1+0.9*np.clip(x/2.0,0,1)); s=lp(2*((np.cumsum(f)/SR)%1)-1,1200)*np.minimum(1,x/0.3)*np.minimum(1,(d-x)/0.5)
    add(s,27.3+k*0.7,0.05,rng.uniform(-.8,.8))
for k in range(8): add(whoosh(1.2,True,300,2500),27.5+k*0.75,0.18,rng.uniform(-1,1))
add(whoosh(0.5,True),33.65,0.6)
# ===== Alps 34-42
add(lp(noise(8),500)*1.4,34.0,0.3)
add(boom(30,2.5,1.5),36.3,0.9); add(hp(noise(0.4),800)*np.exp(-np.arange(int(0.4*SR))/SR*8)*0.8,36.3,0.5)  # crack
for k in range(12): add(lp(noise(0.25),400)*np.exp(-np.arange(int(0.25*SR))/SR*15)*1.5,36.6+rng.uniform(0,1.2),0.25,rng.uniform(-1,1))  # roof snow whumps
n=int(5.6*SR); x=np.arange(n)/SR; roar=lp(rng.standard_normal(n),220)*3*np.minimum(1,x/1.8)*np.minimum(1,(5.6-x)/0.5)+bp(rng.standard_normal(n),400,2500)*0.5*np.minimum(1,x/2.5)*np.minimum(1,(5.6-x)/0.5)
add(roar,36.4,0.8)
# ===== friction back 42
m=int(1.6*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(80*np.exp(x*2.6))/SR)*(x/1.6)**2*0.3,40.4,1.0); add(whoosh(1.6,True,200,9000),40.4,0.6)
add(boom(45,2.0,2),42.0,1.1); add(hp(noise(1.0),3000)*np.exp(-np.arange(int(1.0*SR))/SR*3)*0.5,42.0,0.5)
# slow-mo: low stretched whoosh 42.5-46.7
add(lp(noise(4.2),300)*2*np.sin(np.pi*np.linspace(0,1,int(4.2*SR)))**0.7,42.5,0.35)
add(sweep(60,30,4.0)*np.minimum(1,np.arange(int(4*SR))/SR/1.0)*0.3,42.6,0.6)
# grip! screech + tumbles at 46.75
add(whoosh(0.4,True),46.35,0.5)
n=int(1.0*SR); x=np.arange(n)/SR; scr=np.sin(2*np.pi*(2000+300*np.sin(2*np.pi*11*x))*x)*0.12*np.exp(-x*2.5); add(scr+bp(rng.standard_normal(n),1500,5000)*0.18*np.exp(-x*3),46.75,0.8)
add(boom(40,1.5,3),46.75,1.0)
for k in range(14):
    tt=46.8+k*0.1*(1+k*0.08); add(crunch(0.5),tt,0.5*np.exp(-k*0.12),rng.uniform(-.8,.8)); add(thud(70,0.4),tt,0.5*np.exp(-k*0.1))
glass(46.9,24,0.07)
# ===== rubble 48.75-56
add(whoosh(1.0,True,300,6000),47.9,0.4); add(boom(36,2.5,1.3),48.75,0.8)
add(lp(noise(7.3),500)*1.2,48.75,0.3)
def siren(t0,d,g,pan):
    n=int(d*SR); x=np.arange(n)/SR; f=750+250*np.sin(2*np.pi*0.25*x); s=np.sin(2*np.pi*np.cumsum(f)/SR); s=lp(s,1800)*np.minimum(1,x/1)*np.minimum(1,(d-x)/1); add(s,t0,g,pan)
siren(49.3,6.5,0.04,-0.6); siren(50.5,5.5,0.03,0.6)
for k in range(10): add(lp(noise(0.5),600)*np.exp(-np.arange(int(0.5*SR))/SR*6),49.5+rng.uniform(0,6),0.12,rng.uniform(-1,1))
# end sting + loop
add(boom(40,2.5,1.5),56.0,1.0); add(whoosh(0.7,True),55.4,0.5)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; s=lp(np.sum([2*((f*(1+0.006*k)*x)%1)-1 for k in (-1,0,1)],axis=0)/3,2000)*np.exp(-x*0.9)*0.12; add(s,56.0,1.0,rng.uniform(-.5,.5))
add(whoosh(0.5,True),59.0,0.55)
for k in range(2): add(crunch(0.5),59.5+k*0.17,0.4)
# master
out=hp(out.T,25).T
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)*0.92
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok')
