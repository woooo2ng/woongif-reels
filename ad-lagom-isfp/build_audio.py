# 라곰 협업: ISFP가 약속 1시간 전이라면? — 음성 자르기 + 장면 배치 + 효과음 → audio/full.wav, timing.json
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def cut(src, a, b, tempo=1.0):
    af = f'atrim={max(0,a-0.03):.3f}:{b+0.06:.3f},asetpts=PTS-STARTPTS' + (f',atempo={tempo}' if tempo != 1 else '')
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', src, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    n = min(len(x), int(0.02 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x

# 내레이터 Taehyung 1.1배속 / ISFP JunHo / 친구1 KKC / 친구2 Yeonhee — 구간은 silencedetect로 확인
L = {
 'n1a': cut('raw/nar.mp3', 0.00, 2.59, 1.1),
 'n1b': cut('raw/nar.mp3', 3.08, 6.84, 1.1),
 'n2': cut('raw/nar.mp3', 7.36, 10.26, 1.1),
 'n3': cut('raw/nar.mp3', 10.69, 14.94, 1.1),
 'n4': cut('raw/nar.mp3', 15.38, 19.36, 1.1),
 'i1': cut('raw/isfp.mp3', 0.00, 0.95),
 'i2': cut('raw/isfp.mp3', 1.48, 4.36),
 'i3': cut('raw/isfp.mp3', 4.93, 6.76),
 'f1': cut('raw/f1.mp3', 0.00, 2.08),
 'f2': cut('raw/f2.mp3', 0.00, 2.70),
}
TXT = {
 'n1a': ['ISFP가 약속 1시간 전이라면?'],
 'n1b': ['알람은 5분마다 맞춰 놨어요.', '그리고, 전부 껐어요.'],
 'i1': ['"늦겠다!!"'],
 'n2': ['씻고 나니,', '급한 마음도 같이 씻겨 나갔어요.'],
 'i2': ['"오… 오늘 좀 괜찮은데?"'],
 'n3': ['옷은 일곱 벌을 입어 봤어요.', '결국, 늘 입던 옷을 입었죠.'],
 'i3': ['"…잠깐만 앉아 있을까."'],
 'f1': ['"야, 왜 이렇게 늦었어!"'],
 'f2': ['"근데… 너 오늘 피부 왜 이렇게 좋아?"'],
 'n4': ['가기 전엔 그렇게 싫더니,', '막상 가면 제일 잘 놀아요.'],
}
dur = {k: len(v) / SR for k, v in L.items()}

# ---------- 효과음 ----------
def env(n, a=0.003, d=None):
    t = np.arange(n) / SR; e = np.minimum(1, t / a)
    if d: e = e * np.exp(-t / d)
    return e
def tone(f, d, dec, vol, h=(0.35, 0.12)):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2*np.pi*f*t) + h[0]*np.sin(2*np.pi*f*2.01*t) + h[1]*np.sin(2*np.pi*f*3*t)
    return x * env(n, 0.004, dec) * vol
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def alarm(reps=3, vol=0.16):  # 삐비빅 삐비빅
    out = np.zeros(int(reps * 0.5 * SR))
    for r_ in range(reps):
        for k in range(3):
            n = int(0.07 * SR); t = np.arange(n) / SR
            b = np.sign(np.sin(2*np.pi*2100*t)) * 0.5 * env(n, 0.002) * np.linspace(1, 0.7, n) * vol
            i = int((r_ * 0.5 + k * 0.1) * SR); out[i:i+n] += b
    return out
def slap(vol=0.4):
    n = int(0.09 * SR); return bp(rs.standard_normal(n), 300, 3000) * env(n, 0.0005, 0.018) * vol * 3
def click(vol=0.3):
    n = int(0.04 * SR); return rs.standard_normal(n) * env(n, 0.0005, 0.005) * vol
def swoosh(vol=0.12, d=0.45, lo=600, hi=3000):
    n = int(d * SR); return bp(rs.standard_normal(n), lo, hi) * np.sin(np.linspace(0, np.pi, n)) * vol * 3
def ping(vol=0.16):
    return tone(1320, 0.25, 0.07, vol) + np.pad(tone(1760, 0.2, 0.05, vol*0.7), (int(0.05*SR), 0))[:int(0.25*SR)]
def send(vol=0.18): return tone(990, 0.12, 0.04, vol)
def gasp(vol=0.25):  # 띠용
    n = int(0.35 * SR); t = np.arange(n)/SR; f = 500 + 900*t/0.35
    return np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.003, 0.15) * vol
def steps(nst=6, gap=0.11, vol=0.25):
    out = np.zeros(int((nst*gap+0.1)*SR))
    for k in range(nst):
        n = int(0.05*SR); s = bp(rs.standard_normal(n), 150, 900) * env(n, 0.001, 0.015) * vol * 3
        i = int(k*gap*SR); out[i:i+n] += s
    return out
def water(d, vol=0.05):
    n = int(d * SR); w = bp(rs.standard_normal(n), 1500, 7000) * vol
    f = int(0.3*SR); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f); return w
def squish(vol=0.3):  # 펌프 '쭉'
    n = int(0.22 * SR); t = np.arange(n)/SR
    return bp(rs.standard_normal(n), 200, 1200) * np.sin(np.linspace(0, np.pi, n)) * vol * 2 + np.sin(2*np.pi*(180+200*t)*t) * env(n, 0.005, 0.08) * vol * 0.4
def foam(d=1.2, vol=0.05):  # 보글보글
    out = np.zeros(int(d*SR)); t = 0.0
    while t < d - 0.06:
        f = rs.uniform(900, 2200); n = int(0.035*SR); k = np.arange(n)/SR
        b = np.sin(2*np.pi*(f + 1500*k/0.035)*k) * env(n, 0.002, 0.01) * vol * rs.uniform(0.5, 1)
        i = int(t*SR); out[i:i+n] += b; t += rs.uniform(0.03, 0.09)
    return out
def splash(vol=0.25):
    n = int(0.5*SR); return bp(rs.standard_normal(n), 800, 6000) * env(n, 0.003, 0.15) * vol * 2
def sparkle(vol=0.08):
    out = np.zeros(int(0.7*SR))
    for k, f in enumerate([2093, 2637, 3136, 4186]):
        x = tone(f, 0.4, 0.12, vol, (0.1, 0.0)); i = int(k*0.07*SR); out[i:i+len(x)] += x
    return out
def shutter(vol=0.35):
    a = click(vol); b = np.pad(click(vol*0.8), (int(0.06*SR), 0)); x = np.zeros(int(0.12*SR)); x[:len(a)] += a; x[:len(b)] += b[:len(x)]; return x
def poof(vol=0.1): return swoosh(vol, 0.22, 400, 2500)
def shimmer(vol=0.07):  # 침대 후광 '아~'
    n = int(1.2*SR); t = np.arange(n)/SR
    x = sum(np.sin(2*np.pi*f*t) for f in [523, 659, 784, 1047]) / 4
    return x * np.sin(np.linspace(0, np.pi, n)) * vol
def thud(vol=0.3):
    n = int(0.18*SR); t = np.arange(n)/SR; return np.sin(2*np.pi*(90-40*t)*t) * env(n, 0.003, 0.06) * vol
def music(d, vol=0.07, bpm=128):  # 노래방 반주(간단한 신스 + 킥)
    n = int(d*SR); out = np.zeros(n); beat = 60/bpm
    mel = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587]
    bass = [131, 131, 175, 175, 147, 147, 196, 196]
    k = 0; t = 0.0
    while t < d:
        i = int(t*SR)
        kk = thud(vol*2.2); out[i:i+len(kk)] += kk[:max(0, n-i)]
        b = tone(bass[(k//2) % 8], beat*0.9, 0.2, vol*0.9, (0.5, 0.3)); out[i:i+len(b)] += b[:max(0, n-i)]
        for h in range(2):
            j = int((t + h*beat/2)*SR)
            if j < n:
                m = tone(mel[(k*2+h) % 16], beat*0.45, 0.12, vol*0.7, (0.6, 0.4)); out[j:j+len(m)] += m[:n-j]
        hh = int((t + beat/2)*SR)
        if hh < n:
            c = click(vol*0.6); out[hh:hh+len(c)] += c[:n-hh]
        t += beat; k += 1
    f = int(0.3*SR); out[-f:] *= np.linspace(1, 0, f); return out

# ---------- 장면 배치 (장면 시작 기준 초) ----------
P = []; X = []; D = []
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀: 알람 울리고 손이 꺼버림 ×2 → 알람 목록 → 전부 꺼짐
X += [(0, alarm(2), 0.15), (0, slap(), 1.1), (0, alarm(2), 1.6), (0, slap(), 2.5)]
e = place(0, 'n1a', 0.25)
e = place(0, 'n1b', 3.0)
X += [(0, click(0.25), 5.05 + i*0.32) for i in range(4)]
D.append(e + 1.0)
# 1 기상: 눈 번쩍 → 늦겠다!! → 질주
X += [(1, gasp(), 0.55)]
e = place(1, 'i1', 1.0)
X += [(1, swoosh(0.12), 1.9), (1, steps(6), 2.2)]
D.append(3.7)
# 2 샤워·세안: 물소리, 펌프, 거품, 헹굼, 반짝
X += [(2, water(6.6), 0.0), (2, squish(), 1.0), (2, foam(1.3), 1.25), (2, foam(1.2, 0.04), 2.6), (2, splash(), 3.7), (2, sparkle(), 4.8)]
e = place(2, 'n2', 3.0)
D.append(max(e + 1.0, 6.6))
# 3 거울 셀카
X += [(3, sparkle(0.06), 0.2)]
e = place(3, 'i2', 0.9)
X += [(3, shutter(), e + 0.25), (3, shutter(), e + 0.65), (3, shutter(), e + 1.05)]
D.append(e + 1.7)
# 4 옷 고르기 ×7
CH = [0.45, 0.85, 1.2, 1.5, 1.78, 2.04, 2.28]
X += [(4, poof(), c) for c in CH] + [(4, thud(0.2), 3.55)]
e = place(4, 'n3', 0.5)
D.append(max(e + 1.0, 5.6))
# 5 침대 유혹 → 거의 다 왔어 → 뛰쳐나감
X += [(5, steps(4, 0.18, 0.18), 0.0), (5, shimmer(), 1.15), (5, thud(0.25), 2.05), (5, swoosh(0.05, 0.7, 250, 900), 3.5), (5, swoosh(0.08, 0.8, 250, 1000), 4.5), (5, thud(0.3), 5.3)]
e = place(5, 'i3', 1.5)
X += [(5, ping(), 5.5)] + [(5, click(0.12), 5.95 + i*0.08) for i in range(7)] + [(5, send(), 6.65), (5, gasp(0.22), 7.25), (5, swoosh(0.14), 7.55), (5, steps(6), 7.7)]
D.append(8.6)
# 6 도착: 헐레벌떡 → 왜 이렇게 늦었어 → 피부 칭찬
X += [(6, steps(7, 0.1), 0.0)]
e = place(6, 'f1', 1.05)
X += [(6, sparkle(0.05), e + 0.2)]
D.append(e + 1.5)
# 7 노래방 → 네컷 사진 (반주 깔고 내레이션)
X += [(7, music(7.0), 0.0), (7, shutter(0.3), 4.5), (7, shutter(0.3), 4.9), (7, shutter(0.3), 5.3), (7, shutter(0.3), 5.7)]
e = place(7, 'n4', 1.2)
D.append(max(e + 1.6, 7.0))

nf = [round(d * 30) for d in D]
starts = [sum(nf[:i]) / 30 for i in range(len(nf))]; T = sum(nf) / 30
full = np.zeros(int((T + 1) * SR), np.float32)
def put(x, t):
    i = int(t * SR); j = min(len(full), i + len(x)); full[i:j] += x[:j - i]
for si, k, t in P: put(L[k], starts[si] + t)
for si, x, t in X: put(x, starts[si] + t)
full = full[:int(T * SR)]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/full.wav'], input=np.clip(full, -1, 1).astype(np.float32).tobytes(), check=True)
lines = [{'s': si, 'k': k, 't0': round(t, 3), 't1': round(t + dur[k], 3), 'who': k[0], 'parts': TXT[k]} for si, k, t in P]
json.dump({'durs': [n / 30 for n in nf], 'lines': lines}, open('timing.json', 'w'), ensure_ascii=False, indent=1)
print('scenes', [round(n / 30, 2) for n in nf], 'total', round(T, 2))
print({k: round(v, 2) for k, v in dur.items()})
