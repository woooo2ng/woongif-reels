# 음성 + 효과음 + 합성 BGM(경쾌한 플럭 / 감동 구간 패드) → mix.m4a
import json,subprocess,numpy as np
from scipy.signal import butter,sosfilt
SR=48000;import sys
TM=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'timing.json'));OUT=sys.argv[2] if len(sys.argv)>2 else 'mix.m4a';rs=np.random.default_rng(5)
starts=[];acc=0
for s in TM: starts.append(acc/30);acc+=round(s['dur']*30)
T=acc/30;N=int(T*SR);V=np.zeros(N+SR);X=np.zeros(N+SR)
def load(k):return np.frombuffer(subprocess.check_output(['ffmpeg','-loglevel','error','-i',f'lines/{k}.wav','-f','f32le','-ac','1','-ar',str(SR),'-']),np.float32).copy()
def place(buf,x,t,g=1.0):
    p=int(t*SR);n=min(len(x),len(buf)-p)
    if n>0:buf[p:p+n]+=x[:n]*g
def tt(d):return np.arange(int(d*SR))/SR
def sine(f,d,dec,a=0.004):t=tt(d);return np.sin(2*np.pi*f*t)*np.exp(-t/dec)*np.minimum(1,t/a)
def noise(d,dec):t=tt(d);return rs.standard_normal(len(t))*np.exp(-t/dec)
lp=lambda x,f:sosfilt(butter(2,f,'lowpass',fs=SR,output='sos'),x)
hp=lambda x,f:sosfilt(butter(2,f,'highpass',fs=SR,output='sos'),x)
def ding(fs=(988,1319),gap=0.1,g=0.22):
    x=np.zeros(int(1.4*SR))
    for i,f in enumerate(fs):s=sine(f,1.2,0.35)*g;p=int(i*gap*SR);x[p:p+len(s)]+=s[:len(x)-p]
    return x
def pop_():return sine(880,0.12,0.03)*0.18+sine(1320,0.12,0.02)*0.1
def thud():return lp(noise(0.4,0.06),400)*0.9+sine(70,0.4,0.12)*0.6
def buzz():t=tt(0.45);return np.sign(np.sin(2*np.pi*140*t))*0.09*np.exp(-t/0.3)
def sparkle():
    x=np.zeros(int(1.2*SR))
    for i,f in enumerate([1568,2093,2637,3136]):s=sine(f,0.6,0.18)*0.1;p=int(i*0.06*SR);x[p:p+len(s)]+=s
    return x
def chime():
    x=np.zeros(int(2.6*SR))
    for i,f in enumerate([784,988,1175,1568]):s=sine(f,2.2,0.7)*0.13;p=int(i*0.12*SR);x[p:p+len(s)]+=s
    return x
for si,s in enumerate(TM):
    for k,(st,d) in s['lines'].items():place(V,load(k),starts[si]+st)
KI={o['key']:i for i,o in enumerate(TM)}
L=lambda si,k:TM[KI[si]]['lines'][k][0]
S=lambda si:starts[KI[si]]
_place=place
def place(buf,x,t,g=1.0):
    _place(buf,x,t,g)
# 효과음
try:
    place(X,ding(),S(0)+0.2);
except KeyError: pass
try:
    for i in range(9):place(X,pop_(),S(0)+2.6+i*0.13,0.7)
except KeyError: pass
try:
    place(X,ding((1047,1047),0.18,0.18),S(1)+0.25)
except KeyError: pass
try:
    place(X,buzz(),S(2)+1.3)
except KeyError: pass
try:
    for i in range(10):place(X,pop_(),S(3)+0.4+i*0.82)
except KeyError: pass
try:
    place(X,thud(),S(3)+L(3,'n04')+3.135+0.6,0.6)
except KeyError: pass
try:
    place(X,sparkle(),S(4)+0.6)
except KeyError: pass
try:
    place(X,sparkle(),S(5)+L(5,'n05')+2.23+0.9,0.8)
except KeyError: pass
try:
    place(X,thud(),S(6)+L(6,'i01')+3.95)
except KeyError: pass
try:
    place(X,pop_(),S(7)+0.15)
except KeyError: pass
try:
    place(X,ding((659,880),0.12,0.15),S(8)+L(8,'n06')+0.2)
except KeyError: pass
try:
    place(X,buzz(),S(9)+L(9,'n07')+3.554+1.55)
except KeyError: pass
try:
    place(X,chime(),S(9)+L(9,'n07')+6.22)
except KeyError: pass
try:
    place(X,thud(),S(10)+L(10,'n08')+6.85,1.2)
except KeyError: pass
try:
    place(X,pop_(),S(11)+L(11,'n09')+2.906)
except KeyError: pass
try:
    place(X,ding((784,1047),0.12,0.2),S(12)+L(12,'j02')-0.1)
except KeyError: pass
try:
    place(X,ding((1047,1319),0.1,0.15),S(16)+0.3)
except KeyError: pass
try:
    place(X,sparkle(),S(16)+L(16,'n13')+3.806)
except KeyError: pass
try:
    place(X,buzz(),S(17)+L(17,'j03')+TM[KI[17]]['lines']['j03'][1]+0.25)
except KeyError: pass
# BGM
B=np.zeros((N+SR,2));mid=lambda n:440*2**((n-69)/12)
beat=60/104;prog=[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]];bass=[36,33,29,31]
emo0,emo1=(S(14),S(16)) if 14 in KI else (1e9,1e9)
nb=int(T/beat)+1
for i in range(nb):
    t0=i*beat
    if emo0-0.5<t0<emo1: continue
    ch=prog[(i//8)%4];n=ch[[0,2,1,3,2,1,3,2][i%8]]
    s=sine(mid(n+12),0.5,0.12,0.002)*0.07;place(B[:,0],s,t0);place(B[:,1],s,t0+0.012)
    if i%4==0:
        b=sine(mid(bass[(i//8)%4]),0.9,0.35)*0.16;place(B[:,0],b,t0);place(B[:,1],b,t0)
    if i%2==1:
        h=hp(noise(0.06,0.015),6000)*0.025;place(B[:,0],h,t0);place(B[:,1],h,t0)
# 감동 구간 패드
if emo0<1e8:
  pass
pd=[[57,60,64],[53,57,60],[48,55,60],[55,59,62]];dur=emo1-emo0+1.5;n=int(dur*SR);t=np.arange(n)/SR;P=np.zeros((n,2))
for ci,ch in enumerate(pd):
    a=int(ci*dur/4*SR);b=min(n,int((ci+1)*dur/4*SR+1.5*SR));tt_=t[a:b]-t[a];env=np.minimum(1,np.minimum(tt_/1.2,(t[b-1]-t[a]-tt_)/1.2)).clip(0,1)
    for m in ch:
        for c,dt in enumerate([-0.2,0.2]):P[a:b,c]+=np.sin(2*np.pi*(mid(m)+dt)*tt_+rs.random()*6)*env*0.05
P=np.stack([lp(P[:,0],1500),lp(P[:,1],1500)],1)
if emo0<1e8:
    p0=int((emo0-0.5)*SR);B[p0:p0+n]+=P[:len(B)-p0]
# 덕킹
env=np.abs(V);k=int(0.25*SR);env=np.convolve(env,np.ones(k)/k,'same');duck=1-0.45*np.clip(env/0.03,0,1)
B*=duck[:,None]
fi=int(0.3*SR);B[:fi]*=np.linspace(0,1,fi)[:,None]
out=np.stack([V+X,V+X],1)+B
out=out[:N];fo=int(0.8*SR);out[-fo:]*=np.linspace(1,0,fo)[:,None]
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-c:a','aac','-b:a','192k',OUT],input=out.astype(np.float32).tobytes(),check=True)
print('T',round(T,2))
