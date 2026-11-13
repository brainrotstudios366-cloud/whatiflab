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
# ================= MUSIC =================
BPM=124; beat=60/BPM
def kick():
    n=int(0.4*SR); x=np.arange(n)/SR; f=48+130*np.exp(-x*32); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*6.5)
def hat(o=False):
    n=int((0.18 if o else 0.05)*SR); return hp(rng.standard_normal(n),7000)*env(n,0.001,0.06 if o else 0.015)*0.5
def clap():
    n=int(0.2*SR); s=bp(rng.standard_normal(n),900,3000)*env(n,0.002,0.07); return s*1.4
def saw(f,d,det=0.006):
    n=int(d*SR); x=np.arange(n)/SR; s=sum(2*((f*(1+det*k)*x)%1)-1 for k in (-1,0,1))/3; return s
bassN=[55,55,65.41,49]; chordN=[[220,261.6,329.6],[196,246.9,293.7],[261.6,329.6,392],[174.6,220,261.6]]
def music_block(t0,t1,energy=1.0):
    buf=np.zeros((N,2))
    b0=int(np.ceil(t0/beat))
    b=b0
    while b*beat<t1:
        st=b*beat; bar=(b//4)%4
        add(kick(),st,0.9,0,buf)
        add(hat(),st+beat/2,0.6,0.3,buf)
        if energy>1: add(hat(),st+beat/4,0.3,-0.3,buf); add(hat(),st+3*beat/4,0.3,-0.3,buf)
        if b%2==1: add(clap(),st,0.5,0,buf)
        bs=lp(saw(bassN[bar],beat*0.9,0.003)*np.exp(-np.arange(int(beat*0.9*SR))/SR*3),600)
        add(bs,st,0.55,0,buf)
        if b%4==0:
            for f in chordN[bar]:
                ch=lp(saw(f,beat*4),2500 if energy>1 else 1600)*np.minimum(1,np.arange(int(beat*4*SR))/SR/0.02)*np.exp(-np.arange(int(beat*4*SR))/SR*0.5)
                add(ch,st,0.16*energy,rng.uniform(-.5,.5),buf)
        if energy>1 and b%2==0:
            arp=[chordN[bar][i%3]*2 for i in range(4)]
            for i,f in enumerate(arp):
                n=int(beat/4*SR); x=np.arange(n)/SR; add(np.sin(2*np.pi*f*x)*np.exp(-x*12)*0.5,st+i*beat/4,0.25,0.4 if i%2 else -0.4,buf)
        b+=1
    i0,i1=int(t0*SR),int(t1*SR); buf[:i0]=0; buf[i1:]=0
    return buf
mA=music_block(0,3.0,1.0)
# tape stop 2.8-3.0
ts=int(2.80*SR); te=int(3.0*SR); seg=mA[ts:te].copy(); Lr=te-ts
pos=np.clip(np.cumsum(np.linspace(1,0.05,Lr)),0,Lr-1).astype(int); mA[ts:te]=seg[pos]*np.linspace(1,0.1,Lr)[:,None]; mA[te:]=0
pass
mB=music_block(42.0,48.6,1.4)
# fade/filter into twist at 48
i48=int(48.0*SR); i486=int(48.6*SR)
for c in range(2):
    tail=mB[i48-int(0.3*SR):i486,c]; filt=lp(tail,300); mB[i48:i486,c]=filt[int(0.3*SR):]*np.linspace(1,0,i486-i48)
pass
mC=music_block(56.0,60.0,1.2); fade=np.ones(N); fade[t>58.8]=np.clip(1-(t[t>58.8]-58.8)/1.2,0,1); pass
# ================= TENSION BED 3-42 & 48-56 =================
def drone(t0,t1,f=55,g=0.12):
    d=t1-t0; n=int(d*SR); x=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f*m*(1+0.002*k)*x+k) for m,k in [(1,0),(1,1),(1.5,2),(2,3),(0.5,4)])
    s=lp(s,400)*np.minimum(1,x/1.5)*np.minimum(1,(d-x)/0.8)*(0.8+0.2*np.sin(2*np.pi*0.2*x))
    add(s,t0,g)
drone(3.0,42.0,55,0.10); drone(3.0,42.0,82.4,0.04)
drone(48.0,56.4,49,0.11)
def heartbeat(t0,t1,per,g):
    tt=t0
    while tt<t1:
        add(boom(55,0.35,14),tt,g); add(boom(50,0.35,14),tt+0.22,g*0.7); tt+=per
heartbeat(3.4,11,0.9,0.35); heartbeat(19.2,27,0.85,0.4); heartbeat(34.2,40.5,0.75,0.4); heartbeat(48.4,56,1.0,0.4)
# ambience city
amb=lp(noise(D),500)*1.3+hp(lp(noise(D),3000),800)*0.15
ag=np.zeros(N); ag[(t<11)]=0.35; ag[(t>=6.6)&(t<11)]=0.2; ag[(t>=48)&(t<60)]=0.25
out[:,0]+=amb*ag; out[:,1]+=np.roll(amb,3000)*ag
# electric hum dies at blackout
hum=(np.sin(2*np.pi*60*t)+0.4*np.sin(2*np.pi*120*t))*0.03; hg=((t<6.6)|(t>=48)).astype(float); out+=(hum*hg)[:,None]
# ================= HOOK 0-3 =================
def beep(f,d=0.09):
    n=int(d*SR); x=np.arange(n)/SR; return np.sin(2*np.pi*f*x)*env(n,0.002,0.05)
for s in [2.0]: add(beep(1300),s,0.35)
add(whoosh(0.6,False),2.6,0.5); add(boom(42,2.0,2.2),3.0,1.0); add(hp(noise(0.03),200)*env(int(0.03*SR),0.0005,0.008),3.0,0.6)
add(sweep(2000,60,0.6)*np.exp(-np.arange(int(0.6*SR))/SR*4)*0.3,3.0,0.6)
# ================= CITY 3-11 =================
n=int(0.9*SR); x=np.arange(n)/SR; f=320*np.exp(-x*2.2)+40
add(lp(np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.15*np.exp(-x*2),900),4.2,1.0,-0.3)
n=int(0.7*SR); x=np.arange(n)/SR
scr=np.sin(2*np.pi*(1900+250*np.sin(2*np.pi*13*x))*x)*0.10*np.sin(np.pi*x/0.7); add(scr+bp(rng.standard_normal(n),1500,4000)*0.15*np.sin(np.pi*x/0.7),4.45,0.8,-0.5)
CR=5.118
n=int(1.4*SR); x=np.arange(n)/SR
crash=bp(rng.standard_normal(n),200,6000)*np.exp(-x*5)*1.2
metal=sum(np.sin(2*np.pi*fq*x)*np.exp(-x*dd) for fq,dd in [(523,4),(781,5),(1187,6),(1630,8),(2210,9)])*0.12
add(crash+metal,CR,0.8,-0.5); add(boom(70,0.6,6),CR,0.9,-0.3)
for k in range(16):
    m=int(0.12*SR); add(np.sin(2*np.pi*rng.uniform(3000,6500)*np.arange(m)/SR)*env(m,0.001,0.03),CR+0.08+rng.uniform(0,0.5),0.07,rng.uniform(-.8,0))
# blackout: cascade of electrical clunks approaching
for k in range(7):
    tt=6.6+k*0.13; add(boom(40+k*4,0.8,5),tt,0.5+0.07*k,rng.uniform(-.6,.6)); add(bp(noise(0.05),2000,8000)*env(int(0.05*SR),0.001,0.01),tt,0.25)
add(lp(noise(1.3),900)*np.sin(np.pi*np.linspace(0,1,int(1.3*SR)))**0.8*1.6,7.0,0.45)  # crowd gasp
add(whoosh(2.8,True,200,1200),8.0,0.35)  # drone wind
add(whoosh(0.5,True),10.65,0.6)
# ================= MAGLEV 11-19 =================
V0=120.0
def trainV(u): return V0 if u<3.5 else V0*np.exp(-(u-3.5)/3.6)
rush=bp(noise(8.0),300,5000); uu=np.arange(len(rush))/SR
rg=np.array([0.0]*0)
vv=np.where(uu<3.5,1.0,np.exp(-(uu-3.5)/3.6))
rush=rush*(0.25+0.75*vv)*np.minimum(1,uu/0.3)*np.minimum(1,(8-uu)/0.2)
add(rush,11.0,0.35)
# pillar passes
u=0.15
while u<7.8:
    v=trainV(u); m=int(0.12*SR); add(bp(rng.standard_normal(m),300,2500)*np.sin(np.pi*np.linspace(0,1,m))**2*1.5,11+u,0.35*v/V0+0.05,0.5)
    u+=30.0/max(v,20)
# drop impact + grind
add(boom(38,2.0,2.0),14.5,1.0); add(bp(noise(1.0),150,5000)*np.exp(-np.arange(int(SR))/SR*4)*1.5,14.5,0.8)
mt=np.arange(int(1.6*SR))/SR; add(sum(np.sin(2*np.pi*fq*mt)*np.exp(-mt*dd) for fq,dd in [(311,2),(467,2.5),(733,3),(1097,4),(1453,5)])*0.15,14.5,0.8)
gd=4.45; m=int(gd*SR); gx=np.arange(m)/SR; vg=np.exp(-gx/3.6)
grind=bp(rng.standard_normal(m),1500,7000)*(0.5+0.5*np.abs(np.sin(2*np.pi*23*gx)))*vg*1.2
squeal=np.sin(2*np.pi*np.cumsum(2400+600*vg+80*np.sin(2*np.pi*7*gx))/SR)*0.12*vg
crack=np.zeros(m); idx=rng.integers(0,m,1800); crack[idx]=rng.uniform(-1,1,1800)*vg[idx]; crack=hp(crack,2000)*2
GR=(grind+squeal+crack)
add(GR*np.minimum(1,(gd-gx)/0.3),14.55,0.7)
# cold open (0-1.6) + loop tail (59.45-60)
add(boom(38,1.2,3),0.0,0.9); add(GR[:int(0.9*SR)]*np.minimum(1,(0.9-gx[:int(0.9*SR)])/0.08),0.0,0.7)
add(whoosh(0.35,True),0.6,0.5)
for k in range(5): add(boom(rng.uniform(32,55),0.6,5),0.86+k*0.13,0.45,rng.uniform(-.8,.8))
add(whoosh(0.4,True),1.3,0.6); add(boom(50,0.8,4),1.6,0.6)
add(whoosh(0.5,True),59.0,0.55); add(GR[:int(0.55*SR)],59.45,0.7); add(boom(38,0.6,3),59.45,0.7)
add(whoosh(0.5,True),18.65,0.6)
# ================= SPACE 19-27 =================
add(boom(30,3.0,1.2),19.0,0.7)
sp_d=8; m=int(sp_d*SR); sx=np.arange(m)/SR
spd=lp(rng.standard_normal(m),180)*2*np.minimum(1,sx/1)*np.minimum(1,(sp_d-sx)/0.5); add(spd,19,0.35)
for k in range(26):
    tt=19.8+k*0.22+rng.uniform(0,0.12); add(boom(rng.uniform(32,60),0.9,4),tt,0.35,rng.uniform(-0.9,0.9))
    if k%3==0: add(bp(noise(0.15),3000,9000)*env(int(0.15*SR),0.001,0.04),tt,0.12,rng.uniform(-1,1))
add(sweep(400,40,2.0)*np.exp(-np.arange(int(2*SR))/SR*1.2),24.5,0.2)  # power-down
add(whoosh(0.5,True),26.65,0.6)
# ================= BIRDS 27-34 =================
wind=lp(noise(7.0),700)*1.4; wx=np.arange(len(wind))/SR; add(wind*(0.6+0.4*np.sin(2*np.pi*0.3*wx))*np.minimum(1,wx/0.4),27,0.35)
def honk(f=380,d=0.22):
    m=int(d*SR); x=np.arange(m)/SR; ff=f*(1+0.08*np.sin(2*np.pi*9*x))*(1-0.15*x/d)
    s=2*((np.cumsum(ff)/SR)%1)-1; s=bp(s,600,2600); return s*np.sin(np.pi*x/d)**0.6
for k in range(5): add(honk(rng.uniform(340,420)),27.2+k*0.35,0.25,rng.uniform(-.6,.6))
for k in range(26): add(honk(rng.uniform(300,520),rng.uniform(0.12,0.3)),28.0+rng.uniform(0,5.5),0.28,rng.uniform(-1,1))
for k in range(60):
    m=int(0.08*SR); add(lp(rng.standard_normal(m),900)*env(m,0.004,0.025)*2,27.0+rng.uniform(0,6.8),0.35,rng.uniform(-1,1))
# compass wobble ticks
for k in range(40): add(hp(noise(0.006),3000)*0.5,27.0+k*0.17,0.15,-0.7)
add(whoosh(0.5,True),33.65,0.6)
# ================= DATA CENTER 34-42 =================
fan=bp(noise(8.0),300,1800)*0.8; fx=np.arange(len(fan))/SR; hum2=np.sin(2*np.pi*120*fx)*0.25
fg=np.where(fx<2.0,1.0,np.maximum(0.25,1-(fx-2.0)/4)); add((fan+hum2)*fg*np.minimum(1,fx/0.3),34,0.35)
for k in range(10): add(beep(rng.choice([1800,2400,3000]),0.05),34.2+k*0.19,0.08,rng.uniform(-1,1))
# alarm from 36
tt=37.6;k=0
while tt<41.7:
    m=int(0.25*SR); x=np.arange(m)/SR; f=880 if k%2==0 else 660; s=np.sign(np.sin(2*np.pi*f*x))*np.minimum(1,x/0.005)*np.minimum(1,(0.25-x)/0.01)
    add(lp(s,3000)*0.18,tt,0.6); tt+=0.25; k+=1
# glitch bursts + click-of-death
for k in range(22):
    tt=37.6+rng.uniform(0,4.0); m=int(rng.uniform(0.03,0.12)*SR); s=np.round(rng.standard_normal(m)*3)/3; s=np.repeat(s[::8],8)[:m]
    add(s*0.25,tt,0.45,rng.uniform(-.8,.8))
for k in range(22):
    tt=37.8+k*0.18; m=int(0.01*SR); add(hp(rng.standard_normal(m),1500)*np.exp(-np.arange(m)/SR*400),tt,0.5,0.3)
add(boom(45,1.2,4),37.6,0.8)
# ================= RETURN 42 =================
m=int(1.6*SR); x=np.arange(m)/SR; add(np.sin(2*np.pi*np.cumsum(80*np.exp(x*2.6))/SR)*(x/1.6)**2*0.3,40.4,1.0)
add(whoosh(1.6,True,200,9000),40.4,0.6)
add(boom(45,2.0,2),42.0,1.1); add(hp(noise(1.2),3000)*np.exp(-np.arange(int(1.2*SR))/SR*3)*0.6,42.0,0.6)
# power-on zaps across globe
for k in range(14): add(sweep(200,1600,0.18)*np.exp(-np.arange(int(0.18*SR))/SR*10)*0.4,42.7+k*0.25+rng.uniform(0,0.1),0.3,rng.uniform(-1,1))
# ================= TWIST 48-56 =================
rw=whoosh(1.0,True,300,6000); add(rw,47.0,0.5)
add(boom(36,2.5,1.3),48.0,0.9)
# phone notification ding + error buzz
m=int(0.5*SR); x=np.arange(m)/SR; ding=(np.sin(2*np.pi*1568*x)+0.5*np.sin(2*np.pi*2093*x))*np.exp(-x*6)
add(ding,53.3,0.35)
for k in range(3):
    m=int(0.12*SR); x=np.arange(m)/SR; add(lp(np.sign(np.sin(2*np.pi*150*x)),1200)*0.25,53.9+k*0.18,0.8)
# end sting
add(boom(40,2.5,1.5),56.0,1.0); add(whoosh(0.7,True),55.4,0.5)
for f in [220,261.6,329.6,440]:
    m=int(3.5*SR); x=np.arange(m)/SR; add(lp(saw(f,3.5),2000)*np.exp(-x*0.9)*0.12,56.0,1.0,rng.uniform(-.5,.5))
# ================= MASTER =================
out=hp(out.T,25).T
# soft clip
out/=np.percentile(np.abs(out),99.9)*1.15
out=np.tanh(out*1.3)/np.tanh(1.3)
out*=0.92
fade=np.ones(N); fade[t>59.97]=np.linspace(1,0,(t>59.97).sum()); out*=fade[:,None]
pcm=(np.clip(out,-1,1)*32767).astype(np.int16)
w=wave.open('audio60_sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('ok')
