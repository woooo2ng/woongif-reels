# 라곰 협업 2차: 온 세상이 ISFP인데 무인도에 떨어진다면? — 음성 자르기 + 장면 배치 + 효과음 → audio/full.wav, timing.json
exec(open('fx_base.py').read())

def cutp(src, a, b, tempo=1.0, pitch=1.0, radio=False, squeeze=False):
    af = f'atrim={max(0,a-0.03):.3f}:{b+0.06:.3f},asetpts=PTS-STARTPTS'
    if squeeze: af += ',silenceremove=stop_periods=-1:stop_duration=0.28:stop_threshold=-40dB:stop_silence=0.2'
    if pitch != 1.0: af += f',asetrate={int(SR*pitch)},aresample={SR}'
    t2 = tempo / pitch
    if abs(t2 - 1) > 0.001: af += f',atempo={t2:.4f}'
    if radio: af += ',highpass=f=500,lowpass=f=3200,acrusher=bits=10:mix=0.25,volume=1.6'
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', src, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    n = min(len(x), int(0.02 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x
def mixl(parts):
    n = max(len(p) for p, _ in parts); out = np.zeros(n + int(0.1 * SR), np.float32)
    for p, off in parts:
        i = int(off * SR); out[i:i + len(p)] += p[:len(out) - i] * 0.55
    return out

# 목소리: 내레이터 Taehyung 1.1배속 / 리더 Yu Bi / 세수한 사람 JunHo / 구조대원 KKC / 무전 Yeonhee(무전 필터) / 본부장 Kang
L = {
 'n1': cutp('raw/nar.mp3', 0.00, 3.39, 1.1),
 'n2': cutp('raw/nar.mp3', 3.99, 6.33, 1.1),
 'n3': cutp('raw/nar.mp3', 6.87, 8.90, 1.1),
 'l1': cutp('raw/jivin.mp3', 0.00, 4.20, 1.2, squeeze=True),
 'l2': cutp('raw/jivin.mp3', 4.76, 10.19, 1.22, squeeze=True),
 'j1': cutp('raw/jh.mp3', 0.00, 1.78),
 'k1': cutp('raw/kkc.mp3', 0.00, 1.16),
 'y1': cutp('raw/yh.mp3', 0.00, 1.46, 1.05, radio=True),
 'b1': cutp('raw/kang.mp3', 0.00, 1.35),
 'l3': cutp('raw/jivin.mp3', 10.76, 14.44, 1.2, squeeze=True),
 'n4': cutp('raw/nar2.mp3', 0.00, 2.66, 1.1),
 'r1': cutp('raw/kkc2.mp3', 0.00, 3.68, 1.2, squeeze=True),
 'r2': cutp('raw/kkc2.mp3', 4.15, 5.66, 1.1),
 'l4': cutp('raw/jivin2.mp3', 0.00, 4.29, 1.25, squeeze=True),
 'n5': cutp('raw/nar3.mp3', 0.00, 2.50, 1.1),
}
# 군중 '네!' / '119! 119에 전화해!' — 4개 목소리 × 피치 변형 겹치기
NE = [('raw/ne_jh.mp3', 0.19, 0.87), ('raw/ne_kkc.mp3', 0.15, 0.89), ('raw/ne_yh.mp3', 0.0, 0.95), ('raw/jivin.mp3', 14.94, 15.52)]
L['c1'] = mixl([(cutp(s, a, b, 1.2, p), o) for (s, a, b), p, o in zip(NE * 2, [1, 1, 1, 1, 1.08, 0.93, 1.12, 0.9], [0, .03, .05, .02, .07, .04, .09, .06])])
L['c1'][:] = L['c1'] * 1.0
S119 = [('raw/jh.mp3', 2.93, 4.79), ('raw/kkc.mp3', 2.18, 3.82), ('raw/yh.mp3', 2.47, 4.44), ('raw/lead.mp3', 6.40, 8.13)]
L['c2'] = mixl([(cutp(s, a, b, 1.1, p), o) for (s, a, b), p, o in zip(S119 * 2, [1, 1, 1, 1, 1.07, 0.94, 1.1, 0.92], [0, .05, .02, .08, .1, .04, .12, .06])])
TXT = {
 'n1': ['온 세상이 ISFP인데', '무인도에 떨어진다면?'],
 'l1': ['"저기… 일단…"', '"살아남아야 하지 않을까요…?"'],
 'l2': ['"집 짓는 팀… 불 피우는 팀…"', '"구조 신호 팀…"', '"하고 싶은 사람만 해요…"'],
 'c1': ['"네에…"'],
 'n2': ['흩어지긴 했어요.', '누울 자리 찾으러요.'],
 'c2': ['"119! 119에 전화해!"'],
 'n3': ['좋아요는 32개 받았어요.'],
 'j1': ['"…살 것 같다."'],
 'k1': ['"모두 무사하십니까!"'],
 'y1': ['"2차 구조대 보낼까요?"'],
 'b1': ['"…내일 보내자."'],
 'l3': ['"뗏목… 다 만들었는데…"', '"탈출… 해 볼까요…?"'],
 'c1b': ['"네에…"'],
 'n4': ['뗏목은 아주 좋은 침대가 됐어요.'],
 'r1': ['"저… 다들 헬기에… 타실래요…?"'],
 'l4': ['"저… 해먹…"', '"한 번만 누워 보실래요…?"'],
 'r2': ['"…이거 왜 이렇게 편해요?"'],
 'n5': ['구조대도 ISFP였거든요.'],
}
WHO = {'n1': 'n', 'n2': 'n', 'n3': 'n', 'n4': 'n', 'n5': 'n', 'y1': 'f', 'r1': 'f', 'r2': 'f'}
L['c1b'] = L['c1']
dur = {k: len(v) / SR for k, v in L.items()}

# ---------- 추가 효과음 ----------
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def waves(d, vol=0.05, per=3.2):
    n = int(d * SR); t = np.arange(n) / SR
    w = bp(rs.standard_normal(n), 250, 2500) * (0.35 + 0.65 * np.sin(np.pi * ((t / per) % 1)) ** 2) * vol * 2
    f = min(n // 3, int(0.4 * SR)); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f); return w
def storm(d, vol=0.12):
    n = int(d * SR); w = lp(rs.standard_normal(n), 700) * vol * 3
    f = int(0.3 * SR); w[-f:] *= np.linspace(1, 0, f); return w
def thunder(vol=0.4):
    n = int(1.6 * SR); return lp(rs.standard_normal(n), 300) * env(n, 0.01, 0.5) * vol * 4
def lowbat(vol=0.12):
    return np.concatenate([tone(880, 0.12, 0.05, vol), np.zeros(int(0.06 * SR)), tone(660, 0.18, 0.08, vol)])
def poweroff(vol=0.15):
    n = int(0.5 * SR); t = np.arange(n) / SR; f = 700 - 600 * t / 0.5
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.25) * vol
def plane(d, vol=0.06):
    n = int(d * SR); t = np.arange(n) / SR; w = lp(rs.standard_normal(n), 900) * vol * 3
    return w * np.sin(np.pi * t / d)
def heli(d, vol=0.18, rate=11):
    n = int(d * SR); t = np.arange(n) / SR
    chop = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * rate * t))) * np.exp(-((t * rate) % 1) * 4)
    w = lp(rs.standard_normal(n), 500) * chop * vol * 4
    a = int(0.8 * SR); w[:a] *= np.linspace(0, 1, a) ** 2; return w
def fire(d, vol=0.05):
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        x = click(vol * rs.uniform(0.4, 1.2)); i = int(t * SR); out[i:i + len(x)] += x[:len(out) - i]; t += rs.uniform(0.04, 0.2)
    return out + lp(rs.standard_normal(len(out)), 400) * vol
def static(d, vol=0.04):
    n = int(d * SR); return bp(rs.standard_normal(n), 1500, 6000) * vol
def marimba(d, vol=0.05, bpm=96):  # 느긋한 섬 BGM (펜타토닉)
    n = int(d * SR); out = np.zeros(n); beat = 60 / bpm
    mel = [523, 587, 659, 784, 880, 784, 659, 587, 659, 784, 1047, 880, 784, 659, 587, 523]
    bass = [131, 131, 196, 196, 175, 175, 196, 196]
    k = 0; t = 0.0
    while t < d:
        i = int(t * SR)
        b = tone(bass[(k // 4) % 8], beat * 0.9, 0.25, vol * 0.8, (0.2, 0.05)); out[i:i + len(b)] += b[:max(0, n - i)]
        if k % 2 == 0 or mel[k % 16] > 700:
            m = tone(mel[k % 16], beat * 0.8, 0.13, vol, (0.25, 0.08)); out[i:i + len(m)] += m[:max(0, n - i)]
        t += beat / 2; k += 1
    f = int(0.4 * SR); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f); return out

# ---------- 장면 배치 (장면 시작 기준 초) ----------
P = []; X = []; D = []
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀: 폭풍우 난파 → 해변에 떠밀려옴 → 리더 "일단 살아남아야 합니다!"
X += [(0, storm(2.6), 0.0), (0, thunder(), 0.3), (0, waves(5.5, 0.06), 2.0), (0, thud(0.25), 2.3), (0, thud(0.2), 2.6)]
e = place(0, 'n1', 0.25)
e = place(0, 'l1', e + 0.3)
D.append(e + 0.9)
# 1 팀 나누기 → "네!" → 컷: 전원 누움
X += [(1, waves(8.0, 0.04), 0.0)]
e = place(1, 'l2', 0.3)
e = place(1, 'c1', e + 0.15)
CUT1 = e + 0.35
X += [(1, swoosh(0.1), CUT1 - 0.1), (1, thud(0.2), CUT1 + 0.2)]
e = place(1, 'n2', CUT1 + 0.35)
D.append(e + 0.9)
# 2 SOS 꾸미기 + 감성 해먹 (BGM)
X += [(2, waves(5.6, 0.035), 0.0), (2, marimba(5.6, 0.05), 0.0)] + [(2, click(0.18), 0.9 + i * 0.35) for i in range(6)] + [(2, sparkle(0.07), 3.0), (2, sparkle(0.06), 5.0)]
D.append(5.6)
# 3 뗏목 완성! 탈출한다! → "네!" → 바다로 밀기 → 위에서 다 누워 잠 → 파도에 밀려 해변으로 복귀
X += [(3, waves(8.8, 0.04), 0.0)]
e = place(3, 'l3', 0.3)
e = place(3, 'c1b', e + 0.1)
T_PUSH = e + 0.35
X += [(3, steps(6, 0.1), T_PUSH), (3, swoosh(0.12), T_PUSH + 0.5), (3, splash(0.22), T_PUSH + 0.75), (3, marimba(4.8, 0.045), T_PUSH + 1.2)]
e = place(3, 'n4', T_PUSH + 1.7)
T_LAND = e + 0.4
X += [(3, thud(0.3), T_LAND), (3, splash(0.1), T_LAND)]
D.append(T_LAND + 1.1)
T_SHOT = T_PUSH
# 4 무인도 3일째 — 비행기 지나감, 손가락만 까딱
X += [(4, waves(5.3, 0.03), 0.0), (4, marimba(5.3, 0.04), 0.0), (4, plane(3.8), 0.9)]
D.append(5.3)
# 5 (제품) 떠밀려온 가방 → 잡동사니(모자·오리·우쿨렐레)를 하나씩 집어 감 → 주인공은 클렌저를 고름 → 빗물 세수 → "…살 것 같다."
def squeak(vol=0.12):
    n = int(0.18 * SR); t = np.arange(n) / SR; f = 1400 + 500 * np.sin(np.pi * t / 0.18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.005, 0.08) * vol
def strum(vol=0.09):
    out = np.zeros(int(0.9 * SR))
    for k, f in enumerate([392, 523, 659, 880]):
        x = tone(f, 0.8, 0.35, vol, (0.4, 0.15)); i = int(k * 0.025 * SR); out[i:i + len(x)] += x[:len(out) - i]
    return out
O = 0.75  # 세안 파트 시작이 3.45 → 4.2초로 늦춰짐
X += [(5, waves(10.0, 0.035), 0.0), (5, thud(0.3), 0.7), (5, click(0.3), 1.45),
      (5, swoosh(0.08, 0.3), 2.0), (5, poof(0.08), 2.35), (5, swoosh(0.08, 0.3), 2.35), (5, squeak(), 2.7), (5, swoosh(0.08, 0.3), 2.7), (5, strum(), 3.05), (5, strum(0.07), 3.45), (5, click(0.2), 3.55),
      (5, water(3.2, 0.04), 3.6 + O), (5, squish(), 3.95 + O), (5, foam(1.4), 4.2 + O), (5, splash(0.2), 5.7 + O)]
e = place(5, 'j1', 6.3 + O)
X += [(5, sparkle(0.06), e + 0.1)]
D.append(e + 1.0)
# 6 의욕 충전 → SOS 완성·불 → 헬기 → "모두 무사하십니까!"
X += [(6, waves(7.5, 0.03), 0.0), (6, gasp(0.18), 0.2), (6, steps(8, 0.09), 0.7), (6, swoosh(0.12), 1.6), (6, fire(5.2), 2.2), (6, heli(4.8), 2.6), (6, thud(0.3), 4.6), (6, thud(0.3), 4.8)]
e = place(6, 'k1', 5.1)
D.append(e + 0.9)
# 7 구조대: "헬기에 타실래요…?" → 아무도 안 움직임 → ISFP "해먹 한 번만 누워 보실래요…?" → 구조대장 해먹에 누움 "…이거 왜 이렇게 편해요?" → 대원들 해먹 줄 서다 하나씩 눕기 → "구조대도 ISFP였거든요." → 인구 47→52
def creak(vol=0.06):
    n = int(0.5 * SR); t = np.arange(n) / SR; f = 300 + 80 * np.sin(2 * np.pi * 3 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.5) * vol
X += [(7, waves(14.0, 0.035), 0.0), (7, marimba(14.0, 0.04), 0.0)]
e = place(7, 'r1', 0.3)
T_SILENT = e
e = place(7, 'l4', e + 0.3)
T_GO = e + 0.15
X += [(7, steps(5, 0.12), T_GO), (7, thud(0.2), T_GO + 0.75), (7, creak(), T_GO + 0.85), (7, creak(), T_GO + 1.6)]
e = place(7, 'r2', T_GO + 0.95)
T_DOWN = e + 0.1
X += [(7, steps(6, 0.1, 0.18), T_GO + 1.0)] + [(7, thud(0.15), T_DOWN + i * 0.3) for i in range(4)]
e = place(7, 'n5', T_DOWN + 0.6)
X += [(7, ping(0.12), e + 0.05)]
D.append(e + 0.9)
TM7 = dict(silent=T_SILENT, go=T_GO, down=T_DOWN)
# 8 쿠키: 구조본부 — 소파에 누운 본부장 폰이 울림 → 누운 채 받음 → "2차 구조대 보낼까요?" → "…내일 보내자." → 뚝
def ring(vol=0.1):
    out = np.zeros(int(1.0 * SR))
    for k in range(8):
        x = tone([1320, 1660][k % 2], 0.05, 0.02, vol, (0.2, 0.0)); i = int(k * 0.055 * SR); out[i:i + len(x)] += x
    return out
X += [(8, ring(), 0.2), (8, ring(), 0.95), (8, click(0.3), 1.5)]
e = place(8, 'y1', 1.7)
e = place(8, 'b1', e + 0.45)
X += [(8, click(0.25), e + 0.35), (8, tone(440, 0.25, 0.1, 0.06), e + 0.4)]
D.append(e + 1.0)
nf = [round(d * 30) for d in D]
starts = [sum(nf[:i]) / 30 for i in range(len(nf))]; T = sum(nf) / 30
full = np.zeros(int((T + 1) * SR), np.float32)
def put(x, t):
    i = int(t * SR); j = min(len(full), i + len(x)); full[i:j] += x[:j - i]
for si, k, t in P: put(L[k], starts[si] + t)
for si, x, t in X: put(x, starts[si] + t)
full = full[:int(T * SR)]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/full.wav'], input=np.clip(full, -1, 1).astype(np.float32).tobytes(), check=True)
lines = [{'s': si, 'k': k, 't0': round(t, 3), 't1': round(t + dur[k], 3), 'who': WHO.get(k, 'i'), 'parts': TXT[k]} for si, k, t in P]
json.dump({'durs': [n / 30 for n in nf], 'lines': lines, 'cut1': CUT1, 'shot': T_SHOT, 'tm7': TM7}, open('timing.json', 'w'), ensure_ascii=False, indent=1)
print('scenes', [round(n / 30, 2) for n in nf], 'total', round(T, 2))
print({k: round(v, 2) for k, v in dur.items()})
