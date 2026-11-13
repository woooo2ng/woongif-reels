# 군중 '제가 지휘하겠습니다' (4개 목소리 + 피치 변형 복제) / '…재투표' (장군+적장 동시)
import numpy as np, subprocess
SR=48000
def rd(p,rate=1.0):
    af=f'asetrate={int(48000*rate)},aresample=48000' if rate!=1 else 'anull'
    raw=subprocess.check_output(['ffmpeg','-loglevel','error','-i',p,'-af',af,'-f','f32le','-ac','1','-ar',str(SR),'-'])
    return np.frombuffer(raw,np.float32).copy()
def sv(x,p):
    x=x/np.abs(x).max()*0.9
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-',p],input=x.astype(np.float32).tobytes(),check=True)
rs=np.random.default_rng(3)
parts=[]
for n in ['gc','ec','sc','fc']:
    for rate,g in [(1.0,1.0),(0.93,0.55),(1.07,0.5),(0.88,0.35),(1.12,0.3)]:
        parts.append((rd(f'lines/{n}.wav',rate)*g, rs.uniform(0,0.09)))
L=max(len(x)+int(d*SR) for x,d in parts)
out=np.zeros(L)
for x,d in parts: o=int(d*SR); out[o:o+len(x)]+=x
sv(out,'lines/crowd.wav')
a=rd('lines/g7.wav'); b=rd('lines/e8.wav'); L=max(len(a),len(b)); o=np.zeros(L); o[:len(a)]+=a; o[:len(b)]+=b*0.9
sv(o,'lines/redo.wav')
print('ok')
