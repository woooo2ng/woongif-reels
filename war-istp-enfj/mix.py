import subprocess,json
VA=json.load(open('voice.json'))
INC=[0,1,2,3,5]  # 4번(롤링페이퍼) 장면은 뺌
V=[VA[i] for i in INC]
n=[round((v+0.7+(0.3 if i==len(V)-1 else 0))*30) for i,v in enumerate(V)]
starts=[];acc=0
for k in n: starts.append(acc/30); acc+=k
T=acc/30
inputs=[];filt=[];N=len(V)
for i in range(N):
    inputs+=['-i',f'audio/v{INC[i]+1}.wav'];d=int((starts[i]+0.25)*1000)
    filt.append(f'[{i}:a]adelay={d}|{d},aresample=48000[a{i}]')
for i in range(N):  # 효과음은 장면 시작 기준
    inputs+=['-i',f'audio/x{INC[i]+1}.wav'];d=int(starts[i]*1000)
    filt.append(f'[{N+i}:a]adelay={d}|{d},aresample=48000,volume=0.9[x{i}]')
filt.append(''.join(f'[a{i}]' for i in range(N))+f'amix=inputs={N}:normalize=0[vo]')
filt.append(''.join(f'[x{i}]' for i in range(N))+f'amix=inputs={N}:normalize=0[fx]')
filt.append(f'[vo][fx]amix=inputs=2:normalize=0,apad,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={T-0.4:.3f}:d=0.4[out]')
subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filt),'-map','[out]','-ac','2','-c:a','aac','-b:a','192k','-ar','48000','voice.m4a'],check=True)
open('list.txt','w').write(''.join(f"file 'out/scene_{INC[i]}.mp4'\n" for i in range(N)))
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','list.txt','-c','copy','video.mp4'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','video.mp4','-i','voice.m4a','-map','0:v','-map','1:a','-c:v','copy','-c:a','copy','-shortest','-movflags','+faststart','woongif_ISTP_ENFJ_war.mp4'],check=True)
print('T',T)
