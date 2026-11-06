import subprocess
V=[2.508,3.709,4.676,5.407,6.191,6.426,4.206,6.269,5.251]
n=[round((v+0.7+(0.3 if i==len(V)-1 else 0))*30) for i,v in enumerate(V)]
starts=[];acc=0
for k in n: starts.append(acc/30); acc+=k
T=acc/30
inputs=[];filt=[]
for i in range(len(V)):
    inputs+=['-i',f'audio/v{i+1}.mp3'];d=int((starts[i]+0.25)*1000)
    filt.append(f'[{i}:a]adelay={d}|{d},aresample=48000[a{i}]')
filt.append(''.join(f'[a{i}]' for i in range(len(V)))+f'amix=inputs={len(V)}:normalize=0,apad,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={T-0.4:.3f}:d=0.4[out]')
subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filt),'-map','[out]','-ac','2','-c:a','aac','-b:a','192k','-ar','48000','voice.m4a'],check=True)
open('list.txt','w').write(''.join(f"file 'out/scene_{i}.mp4'\n" for i in range(len(V))))
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','list.txt','-c','copy','video.mp4'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','video.mp4','-i','voice.m4a','-map','0:v','-map','1:a','-c:v','copy','-c:a','copy','-shortest','-movflags','+faststart','woongif_EN_004_ESTP.mp4'],check=True)
print('T',T)
