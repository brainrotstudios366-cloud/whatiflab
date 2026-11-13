import json,base64,glob,wave,subprocess,numpy as np
d='/root/.claude/projects/-home-claude/3a7d62d4-6f3e-5dec-bec7-93e07b5a908f/tool-results/'
files=sorted(f for f in glob.glob(d+'mcp-Speko-audio_synthesize-*.txt') if int(f.split('-')[-1][:-4])>=1793301978841)
assert len(files)==9,len(files)
win=[(0.0,3.6),(3.7,11.45),(11.55,20.55),(20.65,26.8),(27.1,33.8),(34.1,41.7),(42.15,47.9),(48.2,55.9),(56.1,59.6)]
SR=44100;N=int(60*SR);vo=np.zeros(N)
for k,(f,(a,b)) in enumerate(zip(files,win)):
    open(f'r{k}.wav','wb').write(base64.b64decode(json.load(open(f))['audio_base64']))
    trim='silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'r{k}.wav','-af',trim,f't{k}.wav'],check=True)
    w=wave.open(f't{k}.wav');dur=w.getnframes()/w.getframerate()
    tempo=min(1.12,max(1.0,dur/(b-a)))
    af=f'atempo={tempo:.3f},' if tempo>1.001 else ''
    af+='highpass=f=70,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=20:release=200:makeup=2,afade=t=in:d=0.015,areverse,afade=t=in:d=0.04,areverse'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f't{k}.wav','-af',af,'-ar','44100','-ac','1',f's{k}.wav'],check=True)
    w=wave.open(f's{k}.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    i=int(a*SR);n=min(len(x),N-i);vo[i:i+n]+=x[:n]
    print(k,round(dur,2),round(b-a,2),round(tempo,3),'ends',round(a+len(x)/SR,2))
vo=vo/np.max(np.abs(vo))*0.9
w=wave.open('../audio60_sfx.wav');sfx=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float).reshape(-1,2)/32768
# smooth ducking envelope
act=(np.abs(vo)>0.015).astype(float)
k=int(0.3*SR);act=np.convolve(act,np.ones(k)/k,'same');act=np.clip(act*4,0,1)
# smooth again
act=np.convolve(act,np.ones(int(0.15*SR))/(0.15*SR),'same')
duck=1-0.5*act
mix=sfx*duck[:,None]*0.75+vo[:,None]*0.95
pcm=(np.clip(mix,-1,1)*32767).astype(np.int16)
o=wave.open('mix_raw.wav','wb');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes(pcm.tobytes());o.close()
subprocess.run(['ffmpeg','-loglevel','error','-y','-i','mix_raw.wav','-af','alimiter=limit=0.95:attack=5:release=80,loudnorm=I=-14:TP=-1:LRA=11','-ar','44100','../audio60_voice2.wav'],check=True)
