# 음성 + 챕터 차임 + 앰비언트 패드(새 화음) + 효과음 → mix_amb.m4a
import json,subprocess,numpy as np
from scipy.signal import butter,sosfilt,fftconvolve
SR=48000;rs=np.random.default_rng(7)
TM=json.load(open('timing.json'));ST={};acc=0
for o in TM: ST[o['key']]=(acc/30,o);acc+=round(o['dur']*30)
T=acc/30;N=int(T*SR)
def lp(x,f,o=2):return sosfilt(butter(o,f,'lowpass',fs=SR,output='sos'),x)
def hp(x,f,o=2):return sosfilt(butter(o,f,'highpass',fs=SR,output='sos'),x)
def bp(x,a,b,o=2):return sosfilt(butter(o,[a,b],'bandpass',fs=SR,output='sos'),x)
def S(k):return ST[k][0]
def D(k):return ST[k][1]['dur']
def L(k,nm):return S(k)+ST[k][1]['lines'][nm][0]
def LE(k,nm):return L(k,nm)+ST[k][1]['lines'][nm][1]
def MK(k,i):return S(k)+ST[k][1]['marks'][i]
# ---------- 음성 ----------
VB=np.zeros(N+SR)
def load(k):return np.frombuffer(subprocess.check_output(['ffmpeg','-loglevel','error','-i',f'lines/{k}.wav','-f','f32le','-ac','1','-ar',str(SR),'-']),np.float32).copy()
for k,(t0,o) in ST.items():
    for nm,(st,d) in o['lines'].items():
        x=load(nm)
        if nm=='y05':x=bp(x,250,5000)*1.3   # 뉴스 앵커: 방송 느낌
        p=int((t0+st)*SR);n=min(len(x),len(VB)-p);VB[p:p+n]+=x[:n]
VB=VB[:N]
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ac','2','-ar',str(SR),'-f','f32le','voice.raw'],input=VB.astype(np.float32).tobytes(),check=True)
V=np.fromfile('voice.raw',np.float32).reshape(-1,2)[:N];V=np.pad(V,((0,N-len(V)),(0,0)))
# ---------- 패드 ----------
def mid(n):return 440*2**((n-69)/12)
def pad(chords,dur,cl,bright,):
    n=int(dur*SR);t=np.arange(n)/SR;out=np.zeros((n,2))
    for ci in range(int(np.ceil(dur/cl))+1):
        s=ci*cl-2.0;notes=chords[ci%len(chords)];a=max(0,int(s*SR));b=min(n,int((s+cl+4)*SR))
        if b<=a:continue
        tt=t[a:b];env=np.minimum(1,np.minimum((tt-s)/3.0,(s+cl+4-tt)/3.0)).clip(0,1)
        for k,m in enumerate(notes):
            f=mid(m)
            for ch,det in enumerate([-0.2,0.17]):
                ph=2*np.pi*(f+det)*tt+rs.random()*6;w=np.sin(ph)+0.3*np.sin(2*ph+0.4)+0.06*np.sin(3*ph)
                w*=0.8+0.2*np.sin(2*np.pi*(0.06+0.03*k)*tt+k);out[a:b,ch]+=w*env*(0.6 if m<48 else 0.33)
    return lp(out.T,bright).T
def reverb(x,sec=3.5,mix=0.45):
    Lr=int(sec*SR);ir=rs.standard_normal(Lr)*np.exp(-np.arange(Lr)/SR*3.0);ir=lp(ir,4500);ir/=np.sqrt((ir**2).sum())
    return x*(1-mix)+np.stack([fftconvolve(x[:,c],ir)[:len(x)] for c in range(2)],1)*mix
CH={'A':[[41,48,57,64,67],[43,50,59,62,69],[45,52,60,64,71],[43,50,55,62,66]],   # Fmaj9 → G6 → Am9 → G (궁금한 밝음)
    'B':[[38,45,53,60,64],[43,50,55,59,65],[36,43,52,55,62],[41,48,57,60,67]],   # Dm9 → G7 → Cadd9 → F (가벼운 일상)
    'C':[[44,51,60,63,67],[46,53,58,62,65],[39,46,55,58,62],[41,48,56,60,63]],   # Ab → Bb → Eb → Fm (따뜻·로맨틱)
    'D':[[40,47,55,59,66],[45,52,57,60,67],[38,45,53,57,64],[43,50,55,59,62]],   # Em9 → Am7 → Dm9 → G (세상이 바뀜)
    'E':[[36,43,52,55,62],[45,52,55,60,64],[41,48,55,60,64],[43,50,55,59,62]],   # Cadd9 → Am → Fadd9 → G (마음)
    'F':[[38,45,54,57,64],[43,50,54,59,62],[47,54,57,62,66],[45,52,57,61,64]]}   # D → G → Bm → A (1년 뒤, 열린 결말)
SEC=[('A',0,S('c3')),('B',S('c3'),S('c5')),('C',S('c5'),S('c7')),('D',S('c7'),S('c8')),('E',S('c8'),S('c9')),('F',S('c9'),T)]
BR={'A':2100,'B':2000,'C':1700,'D':1600,'E':1500,'F':1700}
M=np.zeros((N,2));XF=3.0
for k,s,e in SEC:
    s0=max(0,s-XF/2);e0=min(T,e+XF/2);x=pad(CH[k],e0-s0,8.0,BR[k]);n=len(x);env=np.ones(n);f=int(XF*SR)
    if s0>0:env[:f]=np.linspace(0,1,f)
    if e0<T:env[-f:]=np.linspace(1,0,f)
    p=int(s0*SR);M[p:p+n]+=x*env[:,None]
M=reverb(M);M/=np.sqrt((M**2).mean())+1e-9;M*=10**(-30/20)
# 말풍선이 사라진 아침(y4~y7): 패드를 반으로 줄여 허전함
g=np.ones(N);a,b=int(S('y4')*SR),int(S('y8')*SR);g[a:b]=0.5;g=np.convolve(g,np.ones(SR)/SR,'same');M*=g[:,None]
lvl=np.abs(V).max(1);w=int(0.05*SR);rms=np.sqrt(np.convolve(lvl**2,np.ones(w)/w,'same'))
tgt=np.where(rms>0.02,10**(-6/20),1.0);Bk=480;gg=[];cur=1.0
for i in range(0,N,Bk):
    t_=tgt[i:i+Bk].min();c=0.08 if t_<cur else 0.015;cur+=(t_-cur)*c;gg.append(cur)
M*=np.repeat(gg,Bk)[:N][:,None]
# ---------- 효과음 ----------
FX=np.zeros((N,2))
def put(x,t,vol=1.0,pan=0.0):
    if x.ndim==1:x=np.stack([x*(1-max(0,pan)),x*(1+min(0,pan))],1)
    p=int(t*SR);n=min(len(x),N-p)
    if n>0 and p>=0:FX[p:p+n]+=x[:n]*vol
def noise(d):return rs.standard_normal(int(d*SR))
def fade(x,a=0.3,b=0.6):
    n=len(x);e=np.ones(n);ia=min(n,int(a*SR));ib=min(n,int(b*SR));e[:ia]=np.linspace(0,1,ia);e[n-ib:]=np.minimum(e[n-ib:],np.linspace(1,0,ib));return x*e
def chirp():
    d=0.12;t=np.arange(int(d*SR))/SR;f=3200+1600*np.sin(2*np.pi*12*t);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/d)**2
def birds(d,dens=1.2):
    x=np.zeros(int(d*SR))
    for _ in range(int(d*dens)):
        p=int(rs.random()*(d-0.5)*SR);c=np.concatenate([chirp()*(0.6+0.4*rs.random()) for _ in range(rs.integers(1,4))]);x[p:p+len(c)]+=c[:len(x)-p]
    return fade(x,0.5,1)
def murmur(d):x=bp(noise(d),250,1400);m=0.7+0.3*np.sin(2*np.pi*0.4*np.arange(len(x))/SR);return fade(x*m/np.abs(x).max(),0.6,0.8)
def crickets(d):
    t=np.arange(int(d*SR))/SR;x=np.sin(2*np.pi*4300*t)*(np.sin(2*np.pi*28*t)>0.3)*(np.sin(2*np.pi*0.9*t)>-0.2);return fade(lp(x,6000),1,1.5)
def click(d=0.01,f=2500):x=bp(noise(d+0.02),f*0.6,f*1.4);return x*np.exp(-np.arange(len(x))/SR*200)
def keys(d):
    x=np.zeros(int(d*SR))
    for _ in range(int(d*9)):
        p=int(rs.random()*(d-0.1)*SR);c=click(0.01,rs.uniform(1800,3500))*rs.uniform(0.4,1);x[p:p+len(c)]+=c
    return x
def rumble(d):x=lp(noise(d),140);return fade(x/np.abs(x).max(),0.4,0.6)
def clack():return click(0.02,1800)+0.6*click(0.02,900)
def tone(f,d,dec):t=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*f*t)*np.exp(-t/dec)*np.minimum(1,t/0.004)
def chime():
    x=np.zeros(int(2.5*SR))
    for i,f in enumerate([784,1175,1568]):
        s=tone(f,2.4,0.7)*0.18;p=int(i*0.09*SR);x[p:p+len(s)]+=s[:len(x)-p]
    return x
def bub():  # 말풍선 '뽁'
    d=0.12;t=np.arange(int(d*SR))/SR;f=500+900*(t/d);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*30)*0.8
def popb():  # 말풍선 터짐
    d=0.15;t=np.arange(int(d*SR))/SR;return (bp(noise(d),800,4000)*np.exp(-t*45)+np.sin(2*np.pi*np.cumsum(1200-4000*t)/SR)*np.exp(-t*35))*0.6
def alarm(d):t=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*1320*t)*((t%0.5)<0.12)*((t%2)<1.2)*0.5
def bell(d=2.5):return sum(tone(f,d,0.8)*a for f,a in [(660,0.3),(990,0.15),(1320,0.08)])
def ring(d):t=np.arange(int(d*SR))/SR;x=(np.sin(2*np.pi*440*t)+np.sin(2*np.pi*480*t))*((t%3)<1.2)*0.25;return x
def popper():d=0.5;t=np.arange(int(d*SR))/SR;return bp(noise(d),600,6000)*np.exp(-t*12)*1.2+lp(noise(d),200)*np.exp(-t*20)
def bark():t=np.arange(int(0.22*SR))/SR;f=520-300*t;x=np.sin(2*np.pi*np.cumsum(f)/SR)+0.5*bp(noise(0.22),400,1800);return lp(x,2500)*np.sin(np.pi*t/0.22)**0.5
def whine(d):t=np.arange(int(d*SR))/SR;return fade(np.sin(2*np.pi*np.cumsum(2400+200*np.sin(2*np.pi*6*t))/SR)*0.2,0.1,0.2)
def traffic(d):x=lp(noise(d),400);return fade(x/np.abs(x).max(),1,1)
def tick(d):x=np.zeros(int(d*SR));c=click(0.006,3500)
for _ in []:pass
# 챕터 차임
for k,(t0,o) in ST.items():
    if 'card' in o:put(chime(),t0+0.15,1.0)
# 말풍선 '뽁' — 장면 마크마다
for k,(t0,o) in ST.items():
    if 'card' in o or k in('w4','x5','g8','v2','v6','v8','r3','y4','y7'):continue
    for m in o['marks']:put(bub(),t0+m,0.10,rs.uniform(-0.3,0.3))
# 장소별 바탕 소리
for k in ['o1','o2','y1','y6','y7','y9']:put(murmur(D(k)),S(k),0.05);put(birds(D(k),0.8),S(k),0.06,0.3)
for k in ['h1','h2','h3','h4','h5','h6','y5','y8']:put(birds(D(k),0.8),S(k),0.06,-0.3)
put(alarm(3.0),S('h1')+0.2,0.10);put(alarm(D('y4')-0.4),S('y4')+0.2,0.10)
for k in ['s1','s2','s3','s4','s5','s6']:
    put(rumble(D(k)),S(k),0.12)
    for i in range(int(D(k)/1.6)):put(clack(),S(k)+0.6+i*1.6,0.25)
for k in ['w1','w2','w3','w5','w6','w7','w8','w9']:put(keys(D(k)),S(k),0.12)
put(bell(),S('x1')+0.1,0.25);put(tone(880,1,0.3)*0.3,S('x5')+0.1,0.5)
for k in ['d1','d2','d3','d4','d5','d6','g1','g2','g4','g5']:put(murmur(D(k)),S(k),0.04)
for k in ['d7','d8','g3','g7','v9','r1','r2']:put(traffic(D(k)),S(k),0.05)
put(whine(1.5),MK('g6',0)-0.3,0.25)
put(popper(),L('v5','a02')-0.1,0.4,-0.3);put(popper(),L('v5','a02'),0.4,0.3)
[put(bark(),S('v7')+0.8+i*0.6+rs.random()*0.3,0.22,rs.uniform(-0.5,0.3)) for i in range(6)]
put(murmur(D('v8')),S('v8'),0.05)
for k in ['r5']:put(birds(D(k),1.2),S(k),0.07)
for i in range(26):put(popb(),S('y6')+ST['y6'][1]['lines']['n23'][0]+1.5+i*0.12,0.14,rs.uniform(-0.6,0.6))
put(ring(L('y8','j13')-S('y8')-0.3),S('y8')+0.2,0.12)
put(crickets(D('y10')),S('y10'),0.04)
out=V+M+FX
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af','loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st=%.3f:d=1.5'%(T-1.5),'-c:a','aac','-b:a','192k','mix_amb.m4a'],input=out.astype(np.float32).tobytes(),check=True)
w=SR//10;n=N//w;v=np.sqrt((V[:n*w,0].reshape(n,w)**2).mean(1));m=np.sqrt((M[:n*w,0].reshape(n,w)**2).mean(1))
print('T',T,'voice dB',round(20*np.log10(v[v>0.03].mean()),1),'pad gaps',round(20*np.log10(m[v<0.003].mean()),1))
