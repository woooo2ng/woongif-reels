# 온 세상이 ENFP인데 무인도에 떨어진다면? — 음성 자르기(단어 타임스탬프) + 장면 배치 + 효과음 → audio/full.wav, timing.json
exec(open('fx_base.py').read())
from scipy.signal import butter, sosfilt
TEMPO = float(os.environ.get('TEMPO', '1.15'))
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def cutp(src, a, b, tempo=None, pitch=1.0, radio=False):
    tempo = TEMPO if tempo is None else tempo
    af = f'atrim={max(0,a-0.03):.3f}:{b+0.08:.3f},asetpts=PTS-STARTPTS'
    if pitch != 1.0: af += f',asetrate={int(SR*pitch)},aresample={SR}'
    t2 = tempo / pitch
    if abs(t2 - 1) > 0.001: af += f',atempo={t2:.4f}'
    if radio: af += ',highpass=f=450,lowpass=f=3000,acrusher=bits=10:mix=0.2,volume=1.7'
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', src, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    n = min(len(x), int(0.02 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x
def mixl(parts):  # [(배열, 시작오프셋)] 겹치기 → 떼창
    n = max(len(p) + int(o * SR) for p, o in parts); out = np.zeros(n, np.float32)
    for p, o in parts:
        i = int(o * SR); out[i:i + len(p)] += p * 0.5
    return out
# ---------- 효과음 ----------
def waves(d, vol=0.05, per=3.2):
    n = int(d * SR); t = np.arange(n) / SR
    w = bp(rs.standard_normal(n), 250, 2500) * (0.35 + 0.65 * np.sin(np.pi * ((t / per) % 1)) ** 2) * vol * 2
    f = min(n // 3, int(0.4 * SR)); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f); return w
def storm(d, vol=0.12):
    n = int(d * SR); w = lp(rs.standard_normal(n), 700) * vol * 3
    f = int(0.4 * SR); w[-f:] *= np.linspace(1, 0, f); return w
def thunder(vol=0.4):
    n = int(1.6 * SR); return lp(rs.standard_normal(n), 300) * env(n, 0.01, 0.5) * vol * 4
def heli(d, vol=0.18, rate=11):
    n = int(d * SR); t = np.arange(n) / SR
    chop = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * rate * t))) * np.exp(-((t * rate) % 1) * 4)
    w = lp(rs.standard_normal(n), 500) * chop * vol * 4
    a = int(0.8 * SR); w[:a] *= np.linspace(0, 1, a) ** 2; f = int(0.5 * SR); w[-f:] *= np.linspace(1, 0, f); return w
def horn(vol=0.14, d=1.4):  # 뱃고동 '뿌우~'
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 98 * t) + 0.6 * np.sin(2 * np.pi * 147 * t) + 0.3 * np.sin(2 * np.pi * 196 * t)) * np.minimum(1, t / 0.12) * np.minimum(1, (d - t) / 0.35) * vol
def static(d, vol=0.05):
    n = int(d * SR); x = bp(rs.standard_normal(n), 1500, 6000) * vol; f = int(0.05 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f); return x
def radio_click(vol=0.2): return np.concatenate([click(vol), static(0.18, 0.06)])
def crickets(d, vol=0.03):
    out = np.zeros(int(d * SR)); t = 0.1
    while t < d - 0.3:
        for k in range(3):
            x = tone(4200, 0.03, 0.01, vol, (0.0, 0.0)); i = int((t + k * 0.045) * SR); out[i:i + len(x)] += x[:len(out) - i]
        t += rs.uniform(0.35, 0.6)
    return out
def fire(d, vol=0.04):
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        x = click(vol * rs.uniform(0.4, 1.2)); i = int(t * SR); out[i:i + len(x)] += x[:len(out) - i]; t += rs.uniform(0.05, 0.22)
    return out + lp(rs.standard_normal(len(out)), 400) * vol
def sadpiano(d, vol=0.06):  # 슬픈 BGM (단조 아르페지오)
    n = int(d * SR); out = np.zeros(n); notes = [220, 262, 330, 262, 196, 247, 294, 247, 175, 220, 262, 220]
    t = 0.0; k = 0
    while t < d:
        x = tone(notes[k % 12], 1.2, 0.6, vol, (0.25, 0.05)); i = int(t * SR); out[i:i + len(x)] += x[:max(0, n - i)]; t += 0.4; k += 1
    f = int(0.3 * SR); out[:f] *= np.linspace(0, 1, f); return out
def scratchrec(vol=0.18):  # 음악 뚝
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 900 * np.exp(-t * 8) + 100
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12) * vol + bp(rs.standard_normal(n), 800, 4000) * env(n, 0.002, 0.08) * vol * 0.5
def marimba(d, vol=0.05, bpm=118):  # 신나는 섬 BGM
    n = int(d * SR); out = np.zeros(n); beat = 60 / bpm
    mel = [523, 659, 784, 880, 784, 659, 784, 1047, 880, 784, 659, 587, 659, 784, 880, 1047]
    bass = [131, 131, 175, 175, 196, 196, 165, 165]
    k = 0; t = 0.0
    while t < d:
        i = int(t * SR)
        b = tone(bass[(k // 4) % 8], beat * 0.9, 0.25, vol * 0.8, (0.2, 0.05)); out[i:i + len(b)] += b[:max(0, n - i)]
        m = tone(mel[k % 16], beat * 0.6, 0.12, vol, (0.25, 0.08)); out[i:i + len(m)] += m[:max(0, n - i)]
        t += beat / 2; k += 1
    f = int(0.4 * SR); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f); return out
def warm(d, vol=0.04):  # 따뜻한 밤 기타
    n = int(d * SR); out = np.zeros(n); notes = [262, 330, 392, 523, 392, 330, 294, 349, 440, 587, 440, 349]
    t = 0.0; k = 0
    while t < d:
        x = tone(notes[k % 12], 1.0, 0.5, vol, (0.3, 0.1)); i = int(t * SR); out[i:i + len(x)] += x[:max(0, n - i)]; t += 0.3; k += 1
    f = int(0.3 * SR); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f); return out
def popper(vol=0.3):  # 폭죽 '팡'
    n = int(0.3 * SR); return bp(rs.standard_normal(n), 300, 5000) * env(n, 0.001, 0.05) * vol * 2
def giggle(vol=0.05, d=1.2):  # 킥킥 (짧은 높은 톤 반복)
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.1:
        x = tone(rs.uniform(700, 1000), 0.06, 0.02, vol, (0.5, 0.2)); i = int(t * SR); out[i:i + len(x)] += x[:len(out) - i]; t += rs.uniform(0.08, 0.16)
    return out
def whistle(d=2.6, vol=0.06):  # 어색한 휘파람 (멜로디)
    out = np.zeros(int(d * SR)); notes = [784, 880, 988, 880, 784, 659, 784, 0, 784, 880, 1047, 988]; t = 0.0; k = 0
    while t < d - 0.2:
        f = notes[k % len(notes)]
        if f:
            n = int(0.2 * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * (f + 12 * np.sin(2 * np.pi * 6 * tt)) * tt) * np.sin(np.linspace(0, np.pi, n)) * vol
            x = x + bp(rs.standard_normal(n), f * 0.8, f * 1.3) * 0.15 * vol * np.sin(np.linspace(0, np.pi, n)); i = int(t * SR); out[i:i + n] += x[:len(out) - i]
        t += 0.22; k += 1
    return out
def ding(vol=0.1): return tone(1568, 0.5, 0.2, vol, (0.2, 0.05))

R = {'k': 'raw/nar3.mp3', 'm': 'raw/nar2.mp3', 'h': 'raw/e2m.mp3', 'n': 'raw/nar.mp3', 'a': 'raw/e1.mp3', 'b': 'raw/e2.mp3', 'c': 'raw/e3.mp3', 'l': 'raw/lead.mp3', 'r': 'raw/res.mp3'}
SEG = {  # 단어 타임스탬프(ElevenLabs scribe)로 자른 구간
 'n6a': ('k', 0.00, 5.08), 'n6b': ('k', 5.58, 8.23), 'n3b': ('m', 0.00, 5.72), 'n1': ('n', 0.00, 3.68), 'n2': ('n', 3.76, 7.20), 'n3': ('n', 7.28, 13.20), 'n4': ('n', 13.24, 16.52),
 'n5': ('n', 18.44, 23.68), 'n6': ('n', 23.76, 31.44), 'n7': ('n', 31.52, 36.88),
 'a_cry': ('a', 0.00, 2.48), 'a_seo': ('a', 2.64, 4.72), 'a_first': ('a', 5.10, 6.88), 'a_chuk': ('a', 7.28, 9.24), 'a_again': ('a', 9.44, 10.24),
 'b_movie': ('h', 1.36, 3.36), 'b_nado': ('h', 3.95, 4.64), 'b_morning': ('h', 5.90, 7.23), 'b_shh': ('h', 7.42, 8.72), 'b_happy': ('h', 9.22, 11.44),  # ENFP2: Henry(남)
 'c_urgent': ('c', 0.08, 2.56), 'c_s1': ('c', 3.04, 6.80), 'c_s2': ('c', 8.96, 10.36), 'c_remember': ('c', 14.06, 15.88),
 'c_bday': ('c', 16.32, 18.04), 'c_acting': ('c', 18.56, 19.96), 'c_knew': ('c', 20.08, 22.08),
 'l1': ('l', 0.08, 2.72), 'l2': ('l', 3.35, 4.28), 'l3': ('l', 4.90, 6.64),
 'r1': ('r', 0.08, 2.72), 'r2': ('r', 3.20, 6.00), 'r3': ('r', 6.40, 9.68), 'r4': ('r', 10.16, 13.64), 'r5': ('r', 14.00, 17.52), 'r6': ('r', 17.84, 19.00), 'r7': ('r', 19.50, 20.16),
}
GSEG = {  # 떼창: 4명 목소리(연희·유비·JY·KKC)
 'g_matja': [('a', 10.64, 11.44), ('b', 12.08, 12.88), ('c', 22.48, 23.12), ('l', 7.04, 7.76)],
 'g_jinjja': [('a', 11.52, 12.88), ('b', 12.96, 14.32), ('c', 23.16, 24.32), ('l', 7.92, 9.20)],
 'g_whistle': [('a', 13.12, 16.72), ('b', 14.64, 18.32), ('l', 9.28, 13.04)],
 'g_surp': [('a', 16.88, 18.00), ('b', 18.48, 19.48), ('l', 13.20, 14.32)],
 'g_gaja': [('a', 18.24, 18.80), ('b', 19.68, 20.24), ('c', 24.64, 25.20), ('l', 14.48, 15.12)],
}
RADIO = {'r2', 'r3', 'r4', 'r5'}
L = {}
for k, (w, a, b) in SEG.items():
    L[k] = cutp(R[w], a, b, tempo=(1.2 if k in ('c_s1', 'c_s2') or k[0]=='n' else None), radio=k in RADIO)
for k, segs in GSEG.items():
    parts = []
    for j, (w, a, b) in enumerate(segs):
        parts.append((cutp(R[w], a, b), [0, 0.05, 0.09, 0.03][j]))
        if k != 'g_whistle': parts.append((cutp(R[w], a, b, pitch=[1.08, 0.94, 1.12, 0.9][j]), [0.07, 0.12, 0.02, 0.1][j]))
    L[k] = mixl(parts)
TXT = {
 'n1': ['온 세상이 ENFP인데,', '무인도에 떨어진다면?'],
 'a_cry': ['"우리 이제 어떡해…"'],
 'b_movie': ['"…근데 이거 완전', '영화 같지 않아?"'],
 'g_matja': ['"헐 맞아!!"'],
 'n2': ['조난은 4초 만에,', '평생 써먹을 썰이 됐어요.'],
 'l1': ['"두 명만 섬 정찰 다녀와!"', '"나머진 짐 지키고!"'],
 'b_nado': ['"…나도 갈래."'],
 'a_seo': ['"나 빼고 재밌는 거 하면 서운해!"'],
 'l2': ['"…야, 같이 가!"'],
 'c_urgent': ['"얘들아 큰일 났어!!"', '"저쪽에 배 지나가!!"'],
 'c_s1': ['"아 근데 그 전에,"', '"나 오다가 게가 옆으로 걷다', '넘어지는 거 봤거든?"'],
 'g_jinjja': ['"헐 진짜??"'],
 'c_s2': ['"…나 전생에 게였나?"'],
 'c_remember': ['"…아 맞다!"', '"배 지나간다고!"'],
 'n6a': ['8분 동안, 구조대원은', '이름과 MBTI와 연애사를', '다 털렸어요.'],
 'n6b': ['그리고 헤어질 때,', '제일 많이 울었어요.'],
 'n3b': ['정찰대는 두 명이었는데,', '일곱 명이 다 갔어요.', '짐은, 바다가 챙겨 갔고요.'],
 'n3': ['한 명은 썰을 풀고,', '여섯 명은 리액션을 해 줬어요.', '그사이에 구조선이 지나갔어요.'],
 'l3': ['"내일 할 거 많으니까', '일찍 자자!"'],
 'a_first': ['"…근데 너 첫사랑 누구야?"'],
 'b_morning': ['"…헐 벌써 아침이야?"'],
 'n4': ["'이제 진짜 자자'는", '스물세 번 나왔어요.'],
 'c_bday': ['"…아, 오늘 내 생일이네."'],
 'g_whistle': ['"아~ 오늘 그냥', '평범한 날이다~"'],
 'b_shh': ['"야 쉿!! 들려!!"'],
 'c_acting': ['"어~? 아무도 없네~?"'],
 'g_surp': ['"서프라이즈~!!"'],
 'c_knew': ['"…나 아침부터 알았어ㅋㅋ"'],
 'a_chuk': ['"그래도 축하해ㅠㅠㅠ"'],
 'n5': ['깜짝 파티는 여섯 시간 준비했어요.', '그리고 여섯 시간 내내 들켰어요.'],
 'r1': ['"구조하러 왔습니다."', '"질문은 받지 않습니다."'],
 'r2': ['"본부, 구조 대상자 7명 확보."', '"이상."'],
 'r3': ['"본부, 대상자들이…"', '"MBTI를 물어봅니다."'],
 'r4': ['"본부… 저 여자친구랑', '싸운 거 얘기했습니다."'],
 'r5': ['"본부, 저 오늘 애들이랑', '저녁 먹고 들어갈게요ㅎㅎ"'],
 'r6': ['"…가지 마요."'],
 'n6': ['8분 동안, 구조대원은', '이름과 MBTI와 연애사를', '다 털렸어요.', '그리고 제일 많이 울었어요.'],
 'b_happy': ['"…거기 진짜 행복했지."'],
 'a_again': ['"우리 또 갈래?"'],
 'g_gaja': ['"가자!!"'],
 'n7': ['구조된 지 사흘 만에,', '그들은 다시 무인도로 갔습니다.', '이번엔 자기 발로요.'],
 'r7': ['"…또요?"'],
}
WHO = {k: ('n' if k[0] == 'n' else 'f' if k[0] == 'r' else 'e') for k in TXT}
dur = {k: len(v) / SR for k, v in L.items()}

P = []; X = []; D = []; M = {}
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀: 폭풍 해변 → 오열 → "근데 이거 영화 같지 않아?" → 헐 맞아!! → 바다로
X += [(0, storm(3.0), 0.0), (0, thunder(), 0.2), (0, waves(14, 0.05), 0.5)]
e = place(0, 'n1', 0.25)
X += [(0, sadpiano(4.2, 0.05), 2.2)]
M['cry0'] = e + 0.05
e = place(0, 'a_cry', e + 0.15)
M['real'] = e + 0.1
X += [(0, gasp(0.12), M['real'])]
e = place(0, 'b_movie', e + 0.2)
M['cheer'] = e + 0.1
X += [(0, scratchrec(0.14), M['cheer'] - 0.05), (0, sparkle(0.08), M['cheer'])]
e = place(0, 'g_matja', M['cheer'])
X += [(0, marimba(6.5, 0.045), M['cheer'] + 0.3), (0, steps(16, 0.12, 0.14), e + 0.1)]
M['run'] = e + 0.1
e = place(0, 'n2', e + 0.25)
M['splash'] = e - 1.4
X += [(0, splash(0.18), M['splash']), (0, splash(0.14), M['splash'] + 0.25)]
D.append(e + 0.5)

# 1 정찰대 2명 → 7명 → 몇 시간 뒤 돌아오니 짐이 바다로 떠내려감
X += [(1, waves(14, 0.035), 0.0), (1, marimba(7.5, 0.03), 0.0)]
e = place(1, 'l1', 0.3)
M['go'] = e - 0.5
X += [(1, steps(10, 0.14, 0.12), M['go'])]
M['f1'] = e + 0.15
e = place(1, 'b_nado', e + 0.2)
M['f2'] = e + 0.05
e = place(1, 'a_seo', e + 0.15)
M['f3'] = e - 0.4
M['lead'] = e + 0.75
e = place(1, 'l2', e + 0.25)
X += [(1, steps(8, 0.11, 0.14), e)]
M['later'] = e + 0.6
X += [(1, swoosh(0.1), M['later'] - 0.1), (1, steps(14, 0.13, 0.12), M['later'] + 0.2), (1, giggle(0.04, 1.0), M['later'] + 0.2)]
M['freeze'] = M['later'] + 1.5
X += [(1, scratchrec(0.14), M['freeze']), (1, gasp(0.12), M['freeze'] + 0.1), (1, splash(0.08), M['freeze'] + 0.6)]
e = place(1, 'n3b', M['freeze'] + 0.5)
D.append(e + 0.6)

# 2 첫날 밤 모닥불 → "이제 자자" → 첫사랑? → 몽타주 → 아침
X += [(2, fire(20, 0.035), 0.0), (2, waves(20, 0.02), 0.0)]
e = place(2, 'l3', 0.3)
M['close'] = e + 0.1
X += [(2, crickets(1.6, 0.03), M['close'])]
e = place(2, 'a_first', M['close'] + 1.0)
M['up'] = e + 0.05
X += [(2, swoosh(0.14, 0.3), M['up']), (2, thud(0.22), M['up'] + 0.12)]
X += [(2, warm(3.6, 0.04), M['up'] + 0.3)]
M['dawn'] = M['up'] + 2.6
X += [(2, sparkle(0.06), M['dawn'])]
e = place(2, 'b_morning', M['dawn'] + 0.5)
e = place(2, 'n4', e + 0.2)
D.append(e + 0.5)

# 3 깜짝 생일파티 — 지웅 결정으로 뺌 (길이 0, 렌더·합치기에서 제외)
D.append(0.0)

# 4 구조: 헬기 → 무전(확보. 이상. → MBTI 물어봄) → 질문 폭탄 → 몽타주로 친해짐(내레이션) → 헤어질 때 오열
X += [(4, waves(30, 0.02), 0.0), (4, heli(3.2, 0.2), 0.0), (4, thud(0.3), 1.2)]
M['land'] = 1.2
e = place(4, 'r1', 1.5)
M['in'] = e + 0.2
M['m1'] = M['in'] + 0.1
X += [(4, radio_click(), M['m1'] + 0.15)]
e = place(4, 'r2', M['m1'] + 0.35)
M['m3'] = e + 0.2
X += [(4, swoosh(0.08), M['m3'] - 0.05), (4, radio_click(), M['m3'] + 0.15)]
e = place(4, 'r3', M['m3'] + 0.35)
M['ask'] = e + 0.1
X += [(4, ping(0.09), M['ask'] + k * 0.18) for k in range(4)]
M['m5'] = M['ask'] + 1.6
X += [(4, swoosh(0.1), M['m5'] - 0.05), (4, marimba(5.5, 0.035, 132), M['m5'])]
e = place(4, 'n6a', M['m5'] + 0.15)
M['m8'] = M['m5'] + 2.2
X += [(4, thud(0.18), M['m8']), (4, sparkle(0.06), M['m8'] + 0.1)]
X += [(4, heli(e - M['in'] + 0.3, 0.06, 13), M['in'])]
M['bye'] = e + 0.15
X += [(4, sadpiano(4.0, 0.04), M['bye']), (4, steps(10, 0.15, 0.1), M['bye'])]
e = place(4, 'n6b', M['bye'] + 0.2)
e = place(4, 'r6', e + 0.2)
D.append(e + 0.6)

# 5 카페 재회 → 회상 → 또 갈래? → 자진 재입도 → "…또요?" → 엔딩 카드
X += [(5, warm(2.6, 0.035), 0.0)]
e = place(5, 'b_happy', 0.35)
M['flash'] = e + 0.1
X += [(5, swoosh(0.1), M['flash']), (5, horn(0.06, 0.9), M['flash'] + 0.2), (5, swoosh(0.08), M['flash'] + 0.8), ]
M['back'] = M['flash'] + 1.5
e = place(5, 'a_again', M['back'] + 0.2)
e = place(5, 'g_gaja', e + 0.1)
M['beach'] = e + 0.15
X += [(5, marimba(8, 0.04), M['beach']), (5, waves(10, 0.04), M['beach']), (5, splash(0.12), M['beach'] + 1.2)]
e = place(5, 'n7', M['beach'] + 0.35)
M['heli'] = e - 0.6
X += [(5, heli(3.5, 0.12), M['heli'])]
e = place(5, 'r7', e + 0.25)
M['card'] = e + 0.5
X += [(5, sparkle(0.08), M['card'])]
D.append(e + 2.3)

nf = [round(d * 30) for d in D]
starts = [sum(nf[:i]) / 30 for i in range(len(nf))]; T = sum(nf) / 30
full = np.zeros(int((T + 1) * SR), np.float32)
def put(x, t):
    i = int(t * SR); j = min(len(full), i + len(x)); full[i:j] += x[:j - i]
for si, k, t in P: put(L[k] * (0.85 if k.startswith('g_') else 1.0), starts[si] + t)
for si, x, t in X: put(x, starts[si] + t)
full = full[:int(T * SR)]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/full.wav'], input=np.clip(full, -1, 1).astype(np.float32).tobytes(), check=True)
lines = [{'s': si, 'k': k, 't0': round(t, 3), 't1': round(t + dur[k], 3), 'who': WHO[k], 'parts': TXT[k]} for si, k, t in P]
json.dump({'durs': [n / 30 for n in nf], 'lines': lines, 'm': {k: round(v, 3) for k, v in M.items()}}, open('timing.json', 'w'), ensure_ascii=False, indent=1)
print('scenes', [round(n / 30, 2) for n in nf], 'total', round(T, 2))
