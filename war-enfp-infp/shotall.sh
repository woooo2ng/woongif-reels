python3 shot.py "$1" && python3 - <<'P'
import glob,subprocess
fs=sorted(glob.glob('shots/*.png'))
subprocess.run(['ffmpeg','-y','-loglevel','error',*sum([['-i',f] for f in fs],[]),'-filter_complex',''.join(f'[{i}]scale=270:480[s{i}];' for i in range(len(fs)))+''.join(f'[s{i}]' for i in range(len(fs)))+f'xstack=inputs={len(fs)}:layout='+'|'.join(f'{(i%6)*270}_{(i//6)*480}' for i in range(len(fs)))+':fill=black','tile.jpg'],check=True)
P
