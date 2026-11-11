import subprocess,json
V=json.load(open('voice.json'));LEAD,TAIL=0.2,0.35
n=[round((v+LEAD+TAIL+(0.3 if i==len(V)-1 else 0))*30) for i,v in enumerate(V)]
starts=[];acc=0
for k in n: starts.append(acc/30);acc+=k
T=acc/30;inputs=[];filt=[]
for i in range(len(V)):
    inputs+=['-i',f'audio/v{i+1}.wav'];d=int((starts[i]+LEAD)*1000)
    filt.append(f'[{i}:a]adelay={d}|{d},aresample=48000[a{i}]')
filt.append(''.join(f'[a{i}]' for i in range(len(V)))+f'amix=inputs={len(V)}:normalize=0,apad,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={T-0.4:.3f}:d=0.4[out]')
subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filt),'-map','[out]','-ac','2','-c:a','aac','-b:a','192k','-ar','48000','voice.m4a'],check=True)
print(T)
