# 나만 다른 MBTI #1 — ISFP 나라 × ENFP : 음성 자르기 + 장면 배치 + 효과음 → audio/full.wav, timing.json
import numpy as np, subprocess, json, os
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(3)

def cut(src, a, b, tempo=1.0):
    af = f'atrim={max(0,a-0.03):.3f}:{b+0.06:.3f},asetpts=PTS-STARTPTS' + (f',atempo={tempo}' if tempo != 1 else '')
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', src, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    n = min(len(x), int(0.02 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x

# 내레이터 Taehyung(1.1배속), ENFP Yeonhee — 구간은 silencedetect로 확인
L = {
 'n1': cut('raw/nar.mp3', 0.00, 3.97, 1.1),
 'n2': cut('raw/nar.mp3', 4.58, 9.38, 1.1),
 'n3a': cut('raw/nar_s2.mp3', 0.00, 2.52, 1.1),
 'n3b': cut('raw/nar_s2.mp3', 2.97, 6.86, 1.1),
 'n4': cut('raw/nar.mp3', 13.17, 16.75, 1.1),
 'n5': cut('raw/nar.mp3', 17.18, 19.87, 1.1),
 'n6': cut('raw/nar.mp3', 20.44, 24.27, 1.1),
 'e1': cut('raw/enfp.mp3', 0.00, 2.5),
 'e2': cut('raw/enfp.mp3', 2.61, 3.97),
 'e3': cut('raw/enfp.mp3', 4.12, 5.15),
 'e4': cut('raw/enfp.mp3', 5.47, 7.01),
 'e5': cut('raw/enfp.mp3', 7.56, 9.63),
}
TXT = {
 'n1': ['온 세상이 ISFP인데, 나만 ENFP라면?'],
 'e1': ['"안녕하세요!! 새로 이사 왔어요!!"'],
 'n2': ['이사 떡을 돌렸어요.', '떡은 다 가져갔는데,', '문을 연 사람은 없어요.'],
 'e2': ['"헐 다 온대!!"'],
 'n3a': ['약속 당일 아침부터 문자가 왔어요.'],
 'n3b': ["'꼭 갈게요'는,", "'그날 기분 봐서요'라는 뜻이었나 봐요."],
 'n4': ['부를 땐 안 오는데,', '삘 받으면 안 불러도 알아서 나와요.'],
 'e3': ['"2차 노래방 가자!!"'],
 'n5': ['노을이 지자,', '사람들도 같이 사라졌어요.'],
 'e4': ['"근데 우리 이제 뭐 해?"'],
 'e5': ['"…어? 이거 좀 좋은데?"'],
 'n6': ['이사 7일 차.', 'ENFP도 이제 없는 척을 합니다.'],
}
dur = {k: len(v) / SR for k, v in L.items()}

# ---------- 효과음 ----------
def env(n, a=0.003, d=None):
    t = np.arange(n) / SR; e = np.minimum(1, t / a)
    if d: e = e * np.exp(-t / d)
    return e
def tone(f, d, dec, vol):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.01 * t) + 0.12 * np.sin(2 * np.pi * f * 3 * t)
    return x * env(n, 0.004, dec) * vol
def dingdong(vol=0.32):
    a = tone(784, 1.0, 0.45, vol); b = tone(622, 1.4, 0.6, vol)
    x = np.zeros(int(1.9 * SR)); x[:len(a)] += a; o = int(0.42 * SR); x[o:o + len(b)] += b; return x
def ping(vol=0.16):
    return tone(1320, 0.25, 0.07, vol) + np.pad(tone(1760, 0.2, 0.05, vol * 0.7), (int(0.05 * SR), 0))[:int(0.25 * SR)]
def click(vol=0.35):
    n = int(0.05 * SR); return rs.standard_normal(n) * env(n, 0.0005, 0.006) * vol
def swoosh(vol=0.12):
    n = int(0.45 * SR); w = rs.standard_normal(n); from scipy.signal import butter, sosfilt
    w = sosfilt(butter(2, [600, 3000], 'bandpass', fs=SR, output='sos'), w)
    return w * np.sin(np.linspace(0, np.pi, n)) * vol * 3
def send(vol=0.18):
    return tone(990, 0.12, 0.04, vol)

# ---------- 장면 배치 (장면 시작 기준 초) ----------
P = []   # (scene, key, t)
X = []   # (scene, sfx, t)
D = []
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀
e = place(0, 'n1', 0.25); e = place(0, 'e1', e + 0.25); X.append((0, swoosh(), e + 0.1)); D.append(e + 1.3)
# 1 이사 떡 — 초인종 3번, 불 꺼짐
X += [(1, dingdong(), 0.25), (1, click(), 1.25)]
e = place(1, 'n2', 1.55); X += [(1, dingdong(0.22), 2.55), (1, click(0.3), 3.05)]; D.append(e + 1.0)
# 2 파티 초대 — 초대장, 답장 폭주, 알림 폭탄
X += [(2, send(), 0.4)] + [(2, ping(0.1), 1.0 + i * 0.12) for i in range(8)]
e = place(2, 'e2', 2.1)
X += [(2, ping(0.13), 3.9 + i * 0.28) for i in range(6)]
place(2, 'n3a', 3.8)
e = place(2, 'n3b', 6.5); D.append(e + 1.0)
# 3 노을 사진 — 업로드, 무응답, 문 열림
X += [(3, send(), 0.6)]
e = place(3, 'n4', 2.3); D.append(e + 1.4)
# 4 강변 — 2차 제안, 해 지며 사라짐
e = place(4, 'e3', 0.3)
X += [(4, swoosh(0.08), 2.0 + i * 0.55) for i in range(5)]
e = place(4, 'n5', e + 1.6); D.append(e + 1.0)
# 5 공원 — 뭐 해? / 이게 하는 거예요 / 이거 좀 좋은데?
e = place(5, 'e4', 0.6)
X += [(5, ping(0.08), e + 0.35)]
e = place(5, 'e5', e + 2.0); D.append(e + 1.3)
# 6 엔딩 — 초인종, 불 끄기, 문자 전송, 내레이션, 엔드카드
X += [(6, dingdong(), 0.3), (6, click(), 2.2), (6, send(), 3.6)]
e = place(6, 'n6', 4.1); D.append(e + 3.0)

starts = [0.0]
for d in D[:-1]: starts.append(starts[-1] + d)
T = starts[-1] + D[-1]
nf = [round(d * 30) for d in D]
# 프레임 단위로 시작 시각 맞춤
starts = [sum(nf[:i]) / 30 for i in range(len(nf))]; T = sum(nf) / 30
full = np.zeros(int((T + 0.5) * SR), np.float32)
def put(x, t):
    i = int(t * SR); j = min(len(full), i + len(x)); full[i:j] += x[:j - i]
for si, k, t in P: put(L[k], starts[si] + t)
for si, x, t in X: put(x, starts[si] + t)
full = full[:int(T * SR)]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/full.wav'], input=np.clip(full, -1, 1).astype(np.float32).tobytes(), check=True)
lines = [{'s': si, 'k': k, 't0': round(t, 3), 't1': round(t + dur[k], 3), 'who': k[0], 'parts': TXT[k]} for si, k, t in P]
json.dump({'durs': [n / 30 for n in nf], 'lines': lines}, open('timing.json', 'w'), ensure_ascii=False, indent=1)
print('scenes', [round(n / 30, 2) for n in nf], 'total', round(T, 2))
