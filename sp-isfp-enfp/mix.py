import subprocess, json
TM = json.load(open('timing.json'))
T = sum(round(d * 30) for d in TM['durs']) / 30
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/full.wav', '-af',
                f'apad,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={T-0.4:.3f}:d=0.4',
                '-ac', '2', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', 'voice.m4a'], check=True)
open('list.txt', 'w').write(''.join(f"file 'out/scene_{i}.mp4'\n" for i in range(len(TM['durs']))))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', 'video.mp4'], check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'video.mp4', '-i', 'voice.m4a', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy',
                '-shortest', '-movflags', '+faststart', 'woongif_ISFP_ENFP.mp4'], check=True)
print('T', T)
