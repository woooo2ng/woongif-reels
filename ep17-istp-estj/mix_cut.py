# 3번(가계부) 장면을 통째로 뺀 버전 — 장면 0,1,3,4,5,6만 이어 붙임
import subprocess,json
V=json.load(open('voice.json'));KEEP=[0,1,3,4,5,6]
n=[round((V[i]+0.7+(0.3 if i==len(V)-1 else 0))*30) for i in KEEP]
starts=[];acc=0
for k in n: starts.append(acc/30); acc+=k
T=acc/30;N=len(KEEP);inputs=[];filt=[]
for j,i in enumerate(KEEP):
    inputs+=['-i',f'audio/v{i+1}.wav'];d=int((starts[j]+0.25)*1000);filt.append(f'[{j}:a]adelay={d}|{d},aresample=48000[a{j}]')
for j,i in enumerate(KEEP):
    inputs+=['-i',f'audio/x{i+1}.wav'];d=int(starts[j]*1000);filt.append(f'[{N+j}:a]adelay={d}|{d},aresample=48000,volume=0.9[x{j}]')
filt.append(''.join(f'[a{j}]' for j in range(N))+f'amix=inputs={N}:normalize=0[vo]')
filt.append(''.join(f'[x{j}]' for j in range(N))+f'amix=inputs={N}:normalize=0[fx]')
filt.append(f'[vo][fx]amix=inputs=2:normalize=0,apad,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={T-0.4:.3f}:d=0.4[out]')
subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filt),'-map','[out]','-ac','2','-c:a','aac','-b:a','192k','-ar','48000','voice_cut.m4a'],check=True)
open('list_cut.txt','w').write(''.join(f"file 'out/scene_{i}.mp4'\n" for i in KEEP))
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','list_cut.txt','-c','copy','video_cut.mp4'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','video_cut.mp4','-i','voice_cut.m4a','-map','0:v','-map','1:a','-c:v','copy','-c:a','copy','-shortest','-movflags','+faststart','woongif_017_ISTPxESTJ.mp4'],check=True)
print('T',T)
