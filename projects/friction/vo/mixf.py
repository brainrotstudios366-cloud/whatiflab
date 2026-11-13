import wave,subprocess,numpy as np
starts=[0.0,3.7,11.6,19.1,27.1,34.1,42.1,48.9,56.15]
SR=44100;N=int(60*SR);vo=np.zeros(N)
for k,a in enumerate(starts):
    af='highpass=f=70,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=20:release=200:makeup=2,afade=t=in:d=0.015,areverse,afade=t=in:d=0.04,areverse'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f't{k}.wav','-af',af,'-ar','44100','-ac','1',f's{k}.wav'],check=True)
    w=wave.open(f's{k}.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    i=int(a*SR);n=min(len(x),N-i);vo[i:i+n]+=x[:n];print(k,a,round(a+len(x)/SR,2))
vo=vo/np.max(np.abs(vo))*0.9
w=wave.open('../sfx.wav');sfx=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float).reshape(-1,2)/32768
act=(np.abs(vo)>0.015).astype(float);k=int(0.3*SR);act=np.convolve(act,np.ones(k)/k,'same');act=np.clip(act*4,0,1);act=np.convolve(act,np.ones(int(0.15*SR))/(0.15*SR),'same')
mix=sfx*(1-0.5*act)[:,None]*0.75+vo[:,None]*0.95
pcm=(np.clip(mix,-1,1)*32767).astype(np.int16)
o=wave.open('mix_raw.wav','wb');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes(pcm.tobytes());o.close()
subprocess.run(['ffmpeg','-loglevel','error','-y','-i','mix_raw.wav','-af','alimiter=limit=0.95:attack=5:release=80,loudnorm=I=-14:TP=-1:LRA=11','-ar','44100','../final_audio.wav'],check=True)
