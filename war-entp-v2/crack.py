# 삑사리: '경고다!'에서 '고'만 한 옥타브+ 올리고 끝을 뒤집히게 꺾음 → '다!'는 원래 낮게
import numpy as np, subprocess
SR=48000
def rd(f,af=None):
    cmd=['ffmpeg','-loglevel','error','-i',f]+(['-af',af] if af else [])+['-f','f32le','-ac','1','-ar',str(SR),'-']
    return np.frombuffer(subprocess.check_output(cmd),np.float32).copy()
def seg(a,b,af):
    return rd('lines/e5b.wav',f'atrim={a}:{b},asetpts=PTS-STARTPTS,{af}')
x=rd('lines/e5b.wav')
A=x[:int(0.268*SR)]
B1=seg(0.262,0.32,'rubberband=pitch=1.85:tempo=0.42')
B2=seg(0.31,0.372,'rubberband=pitch=2.45:tempo=0.38')
D=seg(0.366,0.65,'rubberband=pitch=0.92')
def fade(y,n=240):
    y=y.copy();n=min(n,len(y)//2);y[:n]*=np.linspace(0,1,n);y[-n:]*=np.linspace(1,0,n);return y
B=np.concatenate([fade(B1),fade(B2)])
t=np.arange(len(B))/SR;B*=1+0.35*np.sin(2*np.pi*13*t)  # 떨림
B=B/ (np.abs(B).max()+1e-9)*np.abs(A).max()*1.15
# 얇은 '삑' 휘슬을 살짝 겹침
sq=np.sin(2*np.pi*np.cumsum(np.linspace(1450,2100,len(B)))/SR)*np.sin(np.pi*np.linspace(0,1,len(B)))*0.06
B=B+sq
gap=np.zeros(int(0.06*SR))
out=np.concatenate([fade(A),gap[:int(0.02*SR)],B,gap,fade(D)])
out=np.clip(out/ (np.abs(out).max()+1e-9)*0.9,-1,1).astype(np.float32)
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-','lines/e5c.wav'],input=out.tobytes(),check=True)
print(len(out)/SR)
