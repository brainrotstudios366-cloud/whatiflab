import numpy as np,json,wave
SR=48000
d=json.load(open('vo/timing.json'));VO=[(l['t0'],l['t1']) for l in d['lines']];DUR=d['dur']
E=lambda l,r=0:VO[l][0]+r
N=int(DUR*SR)+SR
fx=np.zeros(N);mus=np.zeros(N)
def add(buf,s,t0,g=1.0):
    i=int(t0*SR);
    if i<0: s=s[-i:];i=0
    n=min(len(s),N-i);buf[i:i+n]+=s[:n]*g
tt=lambda d:np.arange(int(d*SR))/SR
rng=np.random.default_rng(3)
def tok(f=800,d=0.09):x=tt(d);return np.sin(2*np.pi*f*x*(1+0.4*np.exp(-x*60)))*np.exp(-x*45)
def pop(f=600):x=tt(0.12);return (np.sin(2*np.pi*f*x*(1+1.5*np.exp(-x*40)))*np.exp(-x*30))
def whoosh(d=0.6,up=True):
    x=tt(d);n=rng.standard_normal(len(x));
    # simple band sweep via moving average of different widths
    out=np.zeros(len(x));env=np.sin(np.pi*x/d)**2
    k1=np.convolve(n,np.ones(6)/6,'same');k2=np.convolve(n,np.ones(40)/40,'same')
    mixk=x/d if up else 1-x/d
    return (k1*mixk+k2*(1-mixk))*env*1.6
def chime(base=1046.5):
    x=tt(1.2);s=np.zeros(len(x))
    for i,f in enumerate([base,base*1.26,base*1.5,base*2]):
        y=np.zeros(len(x));o=int(i*0.07*SR);xx=x[:len(x)-o];y[o:]=np.sin(2*np.pi*f*xx)*np.exp(-xx*4)*(0.6 if i<3 else 0.35);s+=y
    return s*0.5
def buzz():x=tt(0.45);return np.sign(np.sin(2*np.pi*140*x))*0.3*np.exp(-x*5)+np.sin(2*np.pi*95*x)*0.4*np.exp(-x*5)
def thud():x=tt(0.5);return np.sin(2*np.pi*(60+60*np.exp(-x*20))*x)*np.exp(-x*8)
def shing():x=tt(1.4);s=sum(np.sin(2*np.pi*f*x)*np.exp(-x*3)*a for f,a in [(1568,.4),(2349,.25),(3136,.15)]);return s+whoosh(0.5,True)[:len(x)].tolist().__len__()*0 if False else s
def tick():x=tt(0.05);return np.sin(2*np.pi*2000*x)*np.exp(-x*90)
# ---------- items (mirror of g4.js) ----------
def items(t0,n,stag,f):
    for i in range(n): add(fx,tok(f),t0+i*stag+0.25,0.22)
items(E(5,1.1),1,0,420);items(E(5,6.6),5,.12,760);items(E(6,0.9),12,.07,760)
items(E(9,3.9),5,.08,760)
items(E(19,4.1),3,.15,420);items(E(19,6.5),12,.05,760)
items(E(25,0),2,.12,420);items(E(25,1.0),3,.1,760);items(E(25,1.5),13,.04,760)
items(E(31,0),5,.1,420);items(E(31,2.2),2,.1,420);items(E(31,2.8),8,.06,760)
for i in range(4): add(fx,tok(1200,0.15),E(31,0.6)+i*.12+0.2,0.15)
for i in range(4): add(fx,tok(760),E(34,0.15)+i*.12+0.25,0.22);add(fx,pop(900),E(34,0.15)+i*.12+0.42,0.35)
items(E(34,0.15),4,.12,760)
# removals (whoosh up)
for t in [E(8,1.6),E(10,3.2),E(10,4.6),E(27,1.9),E(32,5.6)]: add(fx,whoosh(0.55,True),t,0.18)
for t in [E(22,0.6),E(28,1.2),E(34,3.8)]: add(fx,whoosh(0.7,False),t,0.14)
# tilts
for t in [E(8,1.9),E(10,3.5),E(5,1.4)]: add(fx,thud(),t,0.35)
# cuts + chapter cards
for t in [16.0,79.25,118.55,222.5]: add(fx,whoosh(0.5,True),t-0.25,0.25)
for l in [3,14,24,30,36,40]: add(fx,whoosh(0.6,True),E(l,-0.55),0.22);add(fx,shing(),E(l,-0.1),0.22)
# success / error
for t in [E(11,7.0),E(13,6.8),E(22,4.3),E(23,2.3),E(28,2.2),E(34,4.6),E(39,4.6),E(41,6.0),E(42,13.6),E(43,10.6),E(44,7.5),E(47,3.0),E(48,3.1),E(49,4.1)]: add(fx,chime(),t,0.3)
for t in [E(1,8.2),E(20,2.4),E(41,2.0),E(42,8.6),E(43,6.0),E(13,2.6)]: add(fx,buzz(),t,0.28)
# hook accents
add(fx,whoosh(0.9,True),E(0,3.1),0.22);add(fx,thud(),E(1,0.5),0.5);add(fx,chime(1318.5),E(2,1.4),0.25)
# step lines appear -> soft tick
for t in [E(6,4.6),E(11,6.3),E(12,0),E(12,7.3),E(13,6.5),E(19,0),E(25,0),E(27,3.7),E(28,1.7),E(31,0),E(33,2.7),E(34,1.5),E(38,2.6),E(39,1.2),E(39,4.2)]: add(fx,tok(1500,0.06),t,0.12)
# countdown ticks
T0=E(46,12.8);T1=E(47,-0.4)
for i in range(10): add(fx,tick(),T0+i*(T1-T0)/10,0.35)
add(fx,chime(784),E(47,0),0.3)
# subscribe pop
add(fx,pop(500),E(52,4.6),0.5)
# ---------- music bed: soft pad + light pulse ----------
chords=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]  # Am F C G
mf=lambda m:440*2**((m-69)/12)
bar=2.4;t=0.0;ci=0
while t<DUR:
    c=chords[ci%4];x=tt(bar+0.4)
    s=sum(np.sin(2*np.pi*mf(m)*x)+0.35*np.sin(2*np.pi*mf(m)*2*x+0.3) for m in c)/3
    env=np.minimum(1,x/0.5)*np.minimum(1,(bar+0.4-x)/0.5)
    add(mus,s*env*0.5,t,1)
    # pulse: soft pluck on beats
    for b in range(4):
        y=tt(0.3);add(mus,np.sin(2*np.pi*mf(c[b%3]+12)*y)*np.exp(-y*12)*0.25,t+b*bar/4,1)
    t+=bar;ci+=1
# ---------- VO + ducking ----------
w=wave.open('vo/vo_full.wav');vsr=w.getframerate();v=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float64)/32768
v=np.interp(np.arange(int(len(v)*SR/vsr))/SR,np.arange(len(v))/vsr,v)
vo=np.zeros(N);vo[:len(v)]=v[:N]
envv=np.convolve(np.abs(vo),np.ones(int(0.3*SR))/int(0.3*SR),'same');speech=np.clip(envv/0.03,0,1)
duck=0.06*(1-speech)+0.022*speech
# louder music in countdown pause
cd=(np.arange(N)/SR>E(46,12.6))&(np.arange(N)/SR<E(47,0))
duck[cd]=0.11
out=vo*1.0+fx*0.9+mus*duck
out=out/np.max(np.abs(out))*0.89
w=wave.open('mix.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
print('ok',DUR)
