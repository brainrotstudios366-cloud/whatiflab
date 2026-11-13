import json,base64,glob,io,wave,subprocess,numpy as np
from scipy.signal import butter,lfilter
d='/root/.claude/projects/-home-claude/3a7d62d4-6f3e-5dec-bec7-93e07b5a908f/tool-results/'
files=sorted(f for f in glob.glob(d+'mcp-Speko-audio_synthesize-*.txt') if '1793301709107' not in f)
new=[f for f in files if '1793301857346' in f or '1793301859482' in f];files=[f for f in files if f not in new];files[4]=new[0];files[5]=new[1];assert len(files)==20
targets=[0.05,3.15,4.5,6.65,9.0,10.95,13.35,15.8,19.1,22.6,27.1,30.3,34.1,36.7,42.15,45.0,48.2,50.85,53.5,56.15]
ends=   [3.1, 4.45, 6.4, 8.95,10.9,13.25,15.75,18.9,22.5,26.6,30.2,33.8,36.6,41.5,44.9,47.9,50.8,53.4,55.9,59.6]
SR=44100;N=int(60*SR);vo=np.zeros(N);log=[]
for k,(f,tg,en) in enumerate(zip(files,targets,ends)):
    j=json.load(open(f));open(f'r{k}.wav','wb').write(base64.b64decode(j['audio_base64']))
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'r{k}.wav','-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse','-ar','44100','-ac','1',f't{k}.wav'],check=True)
    w=wave.open(f't{k}.wav');dur=w.getnframes()/SR
    win=en-tg;tempo=min(1.5,max(1.0,dur/win))
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f't{k}.wav','-af',f'atempo={tempo:.3f}','-ar','44100','-ac','1',f's{k}.wav'],check=True)
    w=wave.open(f's{k}.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    i=int(tg*SR);n=min(len(x),N-i);vo[i:i+n]+=x[:n];log.append((k,round(dur,2),round(win,2),round(tempo,2),round(tg+len(x)/SR,2)))
for l in log:print(l)
b,a=butter(2,90/(SR/2),'high');vo=lfilter(b,a,vo)
env=np.convolve(np.abs(vo),np.ones(441)/441,'same');g=np.where(env>0.08,(0.08+(env-0.08)*0.35)/np.maximum(env,1e-9),1.0);vo=vo*g;vo=vo/np.max(np.abs(vo))*0.95
w=wave.open('../audio60_sfx.wav');sfx=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float).reshape(-1,2)/32768
act=np.convolve((np.abs(vo)>0.02).astype(float),np.ones(int(0.25*SR))/(0.25*SR),'same');duck=1-0.55*np.clip(act*3,0,1)
mix=sfx*duck[:,None]*0.8+vo[:,None]*0.9;mix=np.tanh(mix*1.2)/np.tanh(1.2)
pcm=(np.clip(mix,-1,1)*32767).astype(np.int16)
o=wave.open('../audio60_voice.wav','wb');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes(pcm.tobytes());o.close()
