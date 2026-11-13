import json,base64,glob,io,wave,numpy as np
from scipy.signal import resample_poly,butter,lfilter
d='/root/.claude/projects/-home-claude/3a7d62d4-6f3e-5dec-bec7-93e07b5a908f/tool-results/'
files=sorted(f for f in glob.glob(d+'mcp-Speko-audio_synthesize-*.txt') if '1793301709107' not in f)
targets=[0.0,3.25,4.5,6.75,9.0,11.0,13.0,15.8,19.2,22.6,27.2,30.3,34.2,36.8,42.2,45.0,48.3,50.9,53.6,56.2]
assert len(files)==20,len(files)
SR=44100;N=int(60*SR);vo=np.zeros(N);prev=0;log=[]
for f,tg in zip(files,targets):
    j=json.load(open(f));w=wave.open(io.BytesIO(base64.b64decode(j['audio_base64'])))
    x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    x=resample_poly(x,147,80)
    # trim silence
    a=np.where(np.abs(x)>0.01)[0];x=x[max(0,a[0]-400):a[-1]+2000]
    st=max(tg,prev+0.12);i=int(st*SR);n=min(len(x),N-i);vo[i:i+n]+=x[:n];prev=st+len(x)/SR
    log.append((round(tg,2),round(st,2),round(prev,2)))
print(log)
# voice EQ: high-pass 80, slight presence; compress
b,a=butter(2,80/(SR/2),'high');vo=lfilter(b,a,vo)
env=np.convolve(np.abs(vo),np.ones(441)/441,'same')
g=np.where(env>0.08,(0.08+(env-0.08)*0.35)/np.maximum(env,1e-9),1.0);vo=vo*g
vo=vo/np.max(np.abs(vo))*0.95
# sfx with ducking
w=wave.open('../audio60_sfx.wav');sfx=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float).reshape(-1,2)/32768
act=np.convolve((np.abs(vo)>0.02).astype(float),np.ones(int(0.25*SR))/(0.25*SR),'same');duck=1-0.5*np.clip(act*3,0,1)
mix=sfx*duck[:,None]*0.8+vo[:,None]*0.9
mix=np.tanh(mix*1.2)/np.tanh(1.2)
pcm=(np.clip(mix,-1,1)*32767).astype(np.int16)
o=wave.open('../audio60_voice.wav','wb');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes(pcm.tobytes());o.close()
