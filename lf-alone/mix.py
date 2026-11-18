import json,subprocess,numpy as np
from scipy.signal import butter,sosfilt
SR=48000;TM=json.load(open('timing.json'))
starts=[];acc=0
for s in TM: starts.append(acc/30);acc+=round(s['dur']*30)
T=acc/30;buf=np.zeros(int(T*SR)+SR)
def load(k):
    raw=subprocess.check_output(['ffmpeg','-loglevel','error','-i',f'lines/{k}.wav','-f','f32le','-ac','1','-ar',str(SR),'-']);return np.frombuffer(raw,np.float32).copy()
def place(x,t,g=1.0):
    p=int(t*SR);n=min(len(x),len(buf)-p);buf[p:p+n]+=x[:n]*g
def sine(f,d,dec):
    t=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*f*t)*np.exp(-t/dec)*np.minimum(1,t/0.004)
def chime():
    x=np.zeros(int(2.5*SR))
    for i,f in enumerate([784,1175,1568]):
        s=sine(f,2.4,0.7)*0.18;p=int(i*0.09*SR);x[p:p+len(s)]+=s[:len(x)-p]
    return x
for si,s in enumerate(TM):
    if 'card' in s: place(chime(),starts[si]+0.15)
    for k,(st,d) in s['lines'].items():
        x=load(k);g=1.0 if k[0]!='s' else 0.9
        if k[0]=='s': x=sosfilt(butter(2,[300,4500],'bandpass',fs=SR,output='sos'),x)*1.4
        place(x,starts[si]+st,g)
        if k=='j04':  # 메아리
            tail=x[int(len(x)*0.55):]
            for i,dl in enumerate([0.55,1.1,1.65]):
                e=sosfilt(butter(2,1800,'lowpass',fs=SR,output='sos'),tail)*(0.35/(i+1))
                place(e,starts[si]+st+len(x)/SR+dl-0.4)
# 냉장고 꺼짐 '띵', 스피커 꺼짐
def ding(): return sine(523,0.8,0.25)*0.2+np.pad(sine(392,0.8,0.25)*0.2,(int(0.12*SR),0))[:int(0.8*SR)]
i22=[i for i,o in enumerate(TM) if o['key']==22][0];place(ding(),starts[i22]+TM[i22]['lines']['j12'][0]-0.3)
buf=buf[:int(T*SR)]
fade=int(1.5*SR);buf[-fade:]*=np.linspace(1,0,fade)
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ac','2','-c:a','aac','-b:a','192k','voice.m4a'],input=buf.astype(np.float32).tobytes(),check=True)
print('T',T)
