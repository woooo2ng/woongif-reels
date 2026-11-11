import subprocess,json
V=json.load(open('voice.json'))
n=[round((v+0.7+(0.3 if i==len(V)-1 else 0))*30) for i,v in enumerate(V)]
starts=[];acc=0
for k in n: starts.append(acc/30); acc+=k
T=acc/30
inputs=[];filt=[];N=len(V)
for i in range(N):
    inputs+=['-i',f'audio/v{i+1}.wav'];d=int((starts[i]+0.25)*1000)
    filt.append(f'[{i}:a]adelay={d}|{d},aresample=48000[a{i}]')
for i in range(N):  # 효과음은 장면 시작 기준
    inputs+=['-i',f'audio/x{i+1}.wav'];d=int(starts[i]*1000)
    filt.append(f'[{N+i}:a]adelay={d}|{d},aresample=48000,volume=0.9[x{i}]')
filt.append(''.join(f'[a{i}]' for i in range(N))+f'amix=inputs={N}:normalize=0[vo]')
filt.append(''.join(f'[x{i}]' for i in range(N))+f'amix=inputs={N}:normalize=0[fx]')
filt.append(f'[vo][fx]amix=inputs=2:normalize=0,apad,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={T-0.4:.3f}:d=0.4[out]')
subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filt),'-map','[out]','-ac','2','-c:a','aac','-b:a','192k','-ar','48000','voice.m4a'],check=True)
open('list.txt','w').write("file 'out/scene_0.mp4'\nfile 'out/rest.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','list.txt','-c','copy','video.mp4'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','video.mp4','-i','voice.m4a','-map','0:v','-map','1:a','-c:v','copy','-c:a','copy','-shortest','-movflags','+faststart','woongif_ISTP_war.mp4'],check=True)
print('T',T)
