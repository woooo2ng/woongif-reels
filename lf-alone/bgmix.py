import subprocess,numpy as np
SR=48000
def dec(f,af=None):
    cmd=['ffmpeg','-loglevel','error','-i',f]+(['-af',af] if af else [])+['-f','f32le','-ac','2','-ar',str(SR),'-']
    return np.frombuffer(subprocess.check_output(cmd),np.float32).reshape(-1,2).copy()
V=dec('voice.m4a');T=len(V)
SEC=[('a',0,116.1,0),('b',114.6,195.8,0),('c',194.3,326.6,0),('d',325.1,422.3,0),('e',420.8,T/SR,9.8)]
M=np.zeros_like(V);XF=1.5
for k,s,e,off in SEC:
    x=dec(f'bgm/{k}.mp3','loudnorm=I=-21:TP=-3:LRA=11')
    n=int((e-s)*SR);x=x[int(off*SR):int(off*SR)+n]
    if len(x)<n:x=np.pad(x,((0,n-len(x)),(0,0)))
    env=np.ones(n);fi=int(XF*SR)
    if s>0:env[:fi]=np.linspace(0,1,fi)
    env[-fi:]=np.minimum(env[-fi:],np.linspace(1,0,fi))
    p=int(s*SR);M[p:p+n]+=x*env[:,None]
# 음성 있을 때 BGM 낮추기(ducking)
lvl=np.abs(V).max(1);w=int(0.05*SR);k=np.ones(w)/w
rms=np.sqrt(np.convolve(lvl**2,k,'same'));act=(rms>0.02).astype(float)
g=np.empty(T);cur=1.0;duck=10**(-9/20);a=1-np.exp(-1/(0.12*SR));r=1-np.exp(-1/(0.7*SR))
tgt=np.where(act>0,duck,1.0)
# 블록 단위로 빠르게
B=480;gb=[]
for i in range(0,T,B):
    t=tgt[i:i+B].min();c=a*B if t<cur else r*B;cur+= (t-cur)*min(1,c);gb.append(cur)
g=np.repeat(gb,B)[:T]
out=V+M*g[:,None]
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af','loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st=%.3f:d=1.5'%(T/SR-1.5),'-c:a','aac','-b:a','192k','mix_bgm.m4a'],input=out.astype(np.float32).tobytes(),check=True)
print('ok',T/SR)
