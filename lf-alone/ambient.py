# 앰비언트 BGM(합성 신스 패드) + 효과음 합성 → 음성과 섞어 mix_amb.m4a
import json,subprocess,numpy as np
from scipy.signal import butter,sosfilt,fftconvolve
SR=48000;rs=np.random.default_rng(3)
TM=json.load(open('timing.json'));ST={};acc=0
for o in TM: ST[o['key']]=(acc/30,o);acc+=round(o['dur']*30)
T=acc/30;N=int(T*SR)
def dec(f):return np.frombuffer(subprocess.check_output(['ffmpeg','-loglevel','error','-i',f,'-f','f32le','-ac','2','-ar',str(SR),'-']),np.float32).reshape(-1,2).copy()
V=dec('voice.m4a')[:N];V=np.pad(V,((0,N-len(V)),(0,0)))
def lp(x,f,o=2):return sosfilt(butter(o,f,'lowpass',fs=SR,output='sos'),x)
def hp(x,f,o=2):return sosfilt(butter(o,f,'highpass',fs=SR,output='sos'),x)
def bp(x,a,b,o=2):return sosfilt(butter(o,[a,b],'bandpass',fs=SR,output='sos'),x)
def mid(n):return 440*2**((n-69)/12)
# ---------- 패드 ----------
def pad(chords,dur,chord_len,bright=1800,vol=1.0):
    n=int(dur*SR);t=np.arange(n)/SR;out=np.zeros((n,2))
    for ci in range(int(np.ceil(dur/chord_len))+1):
        s=ci*chord_len-2.0;notes=chords[ci%len(chords)]
        a=max(0,int(s*SR));b=min(n,int((s+chord_len+4)*SR))
        if b<=a:continue
        tt=t[a:b];L=len(tt);env=np.minimum(1,np.minimum((tt-s)/3.0,(s+chord_len+4-tt)/3.0)).clip(0,1)
        for k,m in enumerate(notes):
            f=mid(m)
            for ch,det in enumerate([-0.18,0.21]):
                ph=2*np.pi*(f+det)*tt+rs.random()*6
                w=np.sin(ph)+0.25*np.sin(2*ph+0.3)+0.08*np.sin(3*ph)
                w*=0.8+0.2*np.sin(2*np.pi*(0.07+0.03*k)*tt+k)
                out[a:b,ch]+=w*env*(0.6 if m<48 else 0.35)
    out=lp(out.T,bright).T
    return out*vol
def reverb(x,sec=3.5,mix=0.45):
    L=int(sec*SR);ir=rs.standard_normal(L)*np.exp(-np.arange(L)/SR*3.2);ir=lp(ir,4000);ir/=np.sqrt((ir**2).sum())
    w=np.stack([fftconvolve(x[:,c],ir)[:len(x)] for c in range(2)],1)
    return x*(1-mix)+w*mix
CH={# 장별 화음(미디 번호) — 멜로디 없이 화음만 천천히
 'A':[[48,55,64,67,74],[53,60,64,69,72],[45,52,60,64,71],[50,57,62,65,72]],          # C add9 → F → Am → Dm (밝게)
 'B':[[45,52,57,60,64],[41,48,57,60,65],[43,50,55,62,67],[45,52,57,59,64]],          # Am → F → G → Asus (어둡고 잔잔)
 'C':[[41,48,57,60,64],[43,50,59,62,67],[48,55,64,67,71],[45,52,60,64,69]],          # Fmaj7 → G → Cmaj7 → Am (따뜻)
 'D':[[40,47,55,59,66],[48,55,62,64,71],[43,50,57,59,66],[45,52,57,62,64]],          # Em9 → Cmaj9 → G6/9 → Am11 (쓸쓸)
 'E':[[38,45,53,57,64],[34,41,50,53,57],[36,43,52,55,60],[41,48,57,60,64]]}          # Dm → Bb → C → F (끝에 밝아짐)
SEC=[('A',0,ST[18][0]),('B',ST[18][0],ST[30][0]),('C',ST[30][0],ST[44][0]),('D',ST[44][0],ST[53][0]),('E',ST[53][0],T)]
BR={'A':2200,'B':1300,'C':1900,'D':1600,'E':1400}
M=np.zeros((N,2));XF=3.0
for k,s,e in SEC:
    s0=max(0,s-XF/2);e0=min(T,e+XF/2);x=pad(CH[k],e0-s0,8.0,BR[k]);n=len(x)
    env=np.ones(n);f=int(XF*SR)
    if s0>0:env[:f]=np.linspace(0,1,f)
    if e0<T:env[-f:]=np.linspace(1,0,f)
    p=int(s0*SR);M[p:p+n]+=x*env[:,None]
# 엔딩: 두 번째 불빛에서 살짝 차오름
p0=int(ST[62][0]*SR);sw=np.ones(N);sw[p0:]=1+0.8*np.clip((np.arange(N-p0)/SR)/6,0,1)
M=reverb(M);M*=sw[:,None]
M/=np.sqrt((M**2).mean())+1e-9;M*=10**(-30/20)   # 배경 레벨(대략 -30dBFS RMS)
# 음성 구간 덕킹
lvl=np.abs(V).max(1);w=int(0.05*SR);rms=np.sqrt(np.convolve(lvl**2,np.ones(w)/w,'same'))
tgt=np.where(rms>0.02,10**(-6/20),1.0);B=480;g=[];cur=1.0
for i in range(0,N,B):
    t_=tgt[i:i+B].min();c=0.08 if t_<cur else 0.015;cur+=(t_-cur)*c;g.append(cur)
G=np.repeat(g,B)[:N];M*=G[:,None]
# ---------- 효과음 ----------
FX=np.zeros((N,2))
def put(x,t,vol=1.0,pan=0.0):
    if x.ndim==1:x=np.stack([x*(1-max(0,pan)),x*(1+min(0,pan))],1)
    p=int(t*SR);n=min(len(x),N-p)
    if n>0:FX[p:p+n]+=x[:n]*vol
def noise(d):return rs.standard_normal(int(d*SR))
def fade(x,a=0.3,b=0.6):
    n=len(x);e=np.ones(n);ia=min(n,int(a*SR));ib=min(n,int(b*SR));e[:ia]=np.linspace(0,1,ia);e[n-ib:]=np.minimum(e[n-ib:],np.linspace(1,0,ib));return x*e
def wind(d):x=lp(noise(d),500);m=0.6+0.4*np.sin(2*np.pi*0.15*np.arange(len(x))/SR+rs.random()*6);return fade(x*m/np.abs(x).max(),1,1.5)
def chirp():
    d=0.12;t=np.arange(int(d*SR))/SR;f=3200+1600*np.sin(2*np.pi*12*t);ph=2*np.pi*np.cumsum(f)/SR;return np.sin(ph)*np.sin(np.pi*t/d)**2
def birds(d,dens=1.2):
    x=np.zeros(int(d*SR))
    for _ in range(int(d*dens)):
        p=int(rs.random()*(d-0.5)*SR);c=np.concatenate([chirp()*(0.6+0.4*rs.random()) for _ in range(rs.integers(1,4))]);x[p:p+len(c)]+=c[:len(x)-p]
    return fade(x,0.5,1)
def crickets(d):
    t=np.arange(int(d*SR))/SR;x=np.sin(2*np.pi*4300*t)*(np.sin(2*np.pi*28*t)>0.3)*(np.sin(2*np.pi*0.9*t)>-0.2)
    x+=0.6*np.sin(2*np.pi*3900*t)*(np.sin(2*np.pi*31*t+1)>0.4)*(np.sin(2*np.pi*0.7*t+2)>0)
    return fade(lp(x,6000),1,1.5)
def ding(f1=880,f2=698):
    t=np.arange(int(1.2*SR))/SR;a=np.sin(2*np.pi*f1*t)*np.exp(-t*4);b=np.sin(2*np.pi*f2*t)*np.exp(-np.maximum(0,t-0.3)*4)*(t>0.3);return a+b
def click(d=0.01,f=2500):x=bp(noise(d+0.02),f*0.6,f*1.4);return x*np.exp(-np.arange(len(x))/SR*200)
def keys(d):
    x=np.zeros(int(d*SR))
    for _ in range(int(d*9)):
        p=int(rs.random()*(d-0.1)*SR);c=click(0.01,rs.uniform(1800,3500))*rs.uniform(0.4,1);x[p:p+len(c)]+=c
    return x
def thump(f=55):t=np.arange(int(0.6*SR))/SR;return np.sin(2*np.pi*f*t*(1-0.3*t))*np.exp(-t*9)+0.3*lp(noise(0.6),300)*np.exp(-t*14)
def beep(d):t=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*1046*t)*((t%1.0)<0.25)*0.6
def hum(d,f=60):t=np.arange(int(d*SR))/SR;return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2*t))*0.5
def drip():t=np.arange(int(0.25*SR))/SR;f=1200+900*np.exp(-t*30);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*25)
def water(d,f=900):x=bp(noise(d),200,f);m=0.7+0.3*np.sin(2*np.pi*0.3*np.arange(len(x))/SR);return fade(x*m/np.abs(x).max(),1,1)
def waves(d):
    x=lp(noise(d),1200);t=np.arange(len(x))/SR;m=(0.5+0.5*np.sin(2*np.pi*t/6.5-1.5))**2;return fade(x*m/np.abs(x).max(),1,1.5)
def rain(d):x=hp(noise(d),1500);x+=0.5*lp(noise(d),800);return fade(x/np.abs(x).max(),1,1)
def flies(d):t=np.arange(int(d*SR))/SR;f=230+25*np.sin(2*np.pi*3*t)+15*np.sin(2*np.pi*7.3*t);s=np.sin(2*np.pi*np.cumsum(f)/SR);return fade(lp(np.sign(s)*0.3+s,2000)*(0.6+0.4*np.sin(2*np.pi*0.5*t)),0.5,0.5)
def hiss(d):return fade(bp(noise(d),2500,7000),0.4,0.6)
def crackle(d):
    x=lp(noise(d),400)*0.4;n=len(x)
    for _ in range(int(d*14)):
        p=rs.integers(0,n-2000);c=click(0.004,rs.uniform(1500,5000))*rs.uniform(0.3,1.2);x[p:p+len(c)]+=c
    return fade(x,0.6,1)
def flutter(d=1.0):t=np.arange(int(d*SR))/SR;x=bp(noise(d),300,2500)*(0.5+0.5*np.sign(np.sin(2*np.pi*14*t)));return x*np.exp(-t*2.2)
def bark():t=np.arange(int(0.22*SR))/SR;f=520-300*t;x=np.sin(2*np.pi*np.cumsum(f)/SR)+0.5*bp(noise(0.22),400,1800);return lp(x,2500)*np.sin(np.pi*t/0.22)**0.5
def clack():x=click(0.02,1800)+0.6*click(0.02,900);return x
def rumble(d):x=lp(noise(d),120);t=np.arange(len(x))/SR;return x/np.abs(x).max()*np.sin(np.pi*t/d)
def flashclick():return click(0.008,3000)*1.5
def chime_stairs():return 0
def S(k):return ST[k][0]
def D(k):return ST[k][1]['dur']
def L(k,nm):return S(k)+ST[k][1]['lines'][nm][0]
# D+1 아침
for k in [2,3,4]:put(birds(D(k),1.0),S(k),0.10,0.3)
for k in [5,'x1',6,7,8,15,45]:put(wind(D(k)),S(k),0.10)
put(birds(D(4),2.0),S(4),0.10,-0.3)
put(flutter(1.4),L(8,'j04')+1.0,0.35)
put(ding(988,784),S(11)+0.2,0.12)
put(keys(D(16)),S(16),0.25);put(keys(D(17)),S(17),0.2)
put(water(D('x8')),S('x8'),0.12);put(water(D('x18'),600),S('x18'),0.06)
# D+3 정전
put(beep(D(19)),S(19),0.10)
put(hum(5),S(21),0.05);[put(thump(50+i*4),S(21)+L(21,'n10')-S(21)+0.6+i*(D(21)-2.5)/6,0.45) for i in range(6)]
put(hum(L(22,'j12')-0.3-S(22)),S(22),0.06);put(thump(70),L(22,'j12')-0.3,0.4)
[put(drip(),L(23,'n11')+1.5+i*1.1,0.25) for i in range(4)]
for k in [26,27,28,'x13']:put(crickets(D(k)),S(k),0.04)
put(water(D(29),500),S(29),0.10)
# D+30·D+100
put(flies(D(31)),S(31),0.06)
put(hiss(D(33)),S(33),0.05);put(crackle(D(33))*0.3,S(33),0.15)
[put(bark(),S(35)+1+i*0.7+rs.random()*0.3,0.25,rs.uniform(-0.5,0.5)) for i in range(5)]
put(bark(),L(36,'j18')+1.6,0.3);put(bark(),S(37)+D(37)-1.2,0.25)
put(rain(D('x10')),S('x10'),0.10)
for k in [38,46]:put(birds(D(k),1.5),S(k),0.08)
# D+365·D+1000
put(waves(D('x16')),S('x16'),0.14);put(flutter(0.8),L('x16','k11')-1.5,0.2)
put(flutter(1.0),S('x17')+L('x17','m10')-S('x17')+0.8,0.3)
put(crickets(D('x18')),S('x18'),0.05)
put(wind(D(49)),S(49),0.08)
put(birds(D('x19'),1.5),S('x19'),0.09);put(birds(D('x23'),1.5),S('x23'),0.08)
put(crackle(D('x20')-(L('x20','k12')-0.8-S('x20'))),L('x20','k12')-0.8,0.25)
for i in range(int(D('x22')/2.4)+1):put(clack(),S('x22')+i*2.4+1.2,0.4)
# D+3650
put(wind(D(54)),S(54),0.08);put(water(D(55),500),S(55),0.08)
put(waves(D('x24')),S('x24'),0.14)
for k in [57,58,59,61,62,63,64]:put(crickets(D(k)),S(k),0.035)
put(rumble(7),L(58,'n30')+0.3,0.5)
T0=L(63,'j29')+0.5
[put(flashclick(),S(63)+t_,0.4) for t_ in np.arange(0.3,D(63),1/3)]
out=V+M+FX
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af','loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st=%.3f:d=1.5'%(T-1.5),'-c:a','aac','-b:a','192k','mix_amb.m4a'],input=out.astype(np.float32).tobytes(),check=True)
# 레벨 확인
w=SR//10;n=N//w
v=np.sqrt((V[:n*w,0].reshape(n,w)**2).mean(1));m=np.sqrt((M[:n*w,0].reshape(n,w)**2).mean(1))
print('voice dB',round(20*np.log10(v[v>0.03].mean()),1),'pad dB in gaps',round(20*np.log10(m[v<0.003].mean()),1),'pad under voice',round(20*np.log10(m[v>0.03].mean()),1))
