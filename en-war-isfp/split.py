# 영어 음성: 역할별 한 번에 뽑은 파일(eleven_v4, 1테이크)을 Scribe 단어 타임스탬프 + 무음 구간 기준으로 대사 단위로 자름
import subprocess, os
import numpy as np
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n1':(0.0,3.26),'n2':(3.95,6.83),'n3':(7.29,11.94),'n4':(12.50,16.36),'n5':(16.83,23.19),
                 'n6':(23.72,27.11),'n7':(27.59,30.13),'n11':(30.63,33.90),'n10':(34.37,40.2)},
 'raw/gen.mp3': {'g1':(0.0,3.04),'g4':(3.62,5.53),'g5':(6.0,7.50),'g2':(7.90,10.84),'g3':(11.18,11.80),
                 'g6a':(12.07,12.32),'g6b':(12.82,13.43),'g8':(13.98,15.60),'gw':(15.91,17.2)},
 'raw/ej.mp3':  {'e1':(0.0,3.04),'e2':(3.67,6.68),'e3':(7.17,8.70),'e4':(9.24,10.69),'ew':(11.0,12.12)},
 'raw/sol.mp3': {'s1':(0.18,2.21),'s2':(2.94,6.68),'s3':(7.24,9.08),'s4':(9.66,11.56),'s6':(11.87,14.14),'sw':(14.33,15.36)},
 'raw/foe.mp3': {'f1':(0.50,1.56),'f3':(2.43,5.02),'fw':(5.47,6.68)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f,'-ss',f'{max(0,a-0.03):.3f}','-to',f'{b+0.05:.3f}','-ar','48000','-ac','1',f'lines/{k}.wav'],check=True)
# 합창 '우와아아' = 4명 × 피치 변형, '다음에 할까요?!' = 장군+적장 동시
SR = 48000
def rd(p, rate=1.0):
    af = f'asetrate={int(48000*rate)},aresample=48000' if rate != 1 else 'anull'
    raw = subprocess.check_output(['ffmpeg','-loglevel','error','-i',p,'-af',af,'-f','f32le','-ac','1','-ar',str(SR),'-'])
    return np.frombuffer(raw, np.float32).copy()
def sv(x, p):
    x = x / np.abs(x).max() * 0.9
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-',p], input=x.astype(np.float32).tobytes(), check=True)
rs = np.random.default_rng(3)
parts = []
for n in ['gw','ew','sw','fw']:
    for rate, g in [(1.0,1.0),(0.93,0.55),(1.07,0.5),(0.88,0.35),(1.12,0.3)]:
        parts.append((rd(f'lines/{n}.wav', rate)*g, rs.uniform(0,0.09)))
L = max(len(x)+int(dl*SR) for x, dl in parts); o = np.zeros(L)
for x, dl in parts: k = int(dl*SR); o[k:k+len(x)] += x
sv(o, 'lines/cheer.wav')
a = rd('lines/g5.wav'); b = rd('lines/e3.wav'); L = max(len(a),len(b)); o = np.zeros(L); o[:len(a)] += a; o[:len(b)] += b*0.9
sv(o, 'lines/both.wav')
# 7번 장면(작전회의)은 한국판처럼 최종본에서 뺌 → 자리만 채우는 짧은 무음
for k in ['g7','yes','n9']: sv(np.r_[np.zeros(SR//4), 1e-3, np.zeros(SR//4)], f'lines/{k}.wav')
print('ok')
