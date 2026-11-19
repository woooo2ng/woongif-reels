# 온 세상이 ENTJ인데 무인도에 떨어진다면? — 음성 자르기 + 장면 배치 + 효과음 → audio/full.wav, timing.json
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


# 목소리: 내레이터 Taehyung 1.08배속 / 리더 Yu Bi(전쟁편 장군) / 구조대원 JunHo(전쟁편 아군 병사)
L = {
 'n1': cutp('raw/nar.mp3', 0.00, 3.43, 1.08),
 'n2': cutp('raw/nar.mp3', 3.95, 7.58, 1.08, squeeze=True),
 'n3': cutp('raw/nar.mp3', 8.00, 11.33, 1.08, squeeze=True),
 'n4': cutp('raw/nar.mp3', 11.81, 15.90, 1.08, squeeze=True),
 'n5': cutp('raw/nar.mp3', 16.08, 20.69, 1.05, squeeze=True),
 'n6': cutp('raw/nar.mp3', 21.17, 28.79, 1.08, squeeze=True),
 'n7': cutp('raw/nar.mp3', 29.21, 31.35, 1.05, squeeze=True),
 'n8': cutp('raw/nar.mp3', 31.82, 37.20, 1.05, squeeze=True),
 'n9': cutp('raw/nar_b.mp3', 0.00, 2.55, 1.05, squeeze=True),
 'l1': cutp('raw/lead.mp3', 0.00, 3.49, 1.05, squeeze=True),
 'l2': cutp('raw/lead.mp3', 4.18, 8.24, 1.05, squeeze=True),
 'l3': cutp('raw/lead.mp3', 8.79, 11.27, 1.05, squeeze=True),
 'l4': cutp('raw/lead.mp3', 11.79, 13.22),
 'l5': cutp('raw/lead.mp3', 13.72, 16.64, 1.05, squeeze=True),
 'r1': cutp('raw/res.mp3', 0.00, 1.34),
 'r2': cutp('raw/res.mp3', 2.03, 2.45),
}
TXT = {
 'n1': ['온 세상이 ENTJ인데,', '무인도에 떨어진다면?'],
 'l1': ['"다들 정신 차리시고요."', '"10분 뒤에 첫 회의 하죠."'],
 'n2': ['표류 3분 만에,', '모래 위에 4주 계획이 생겼습니다.'],
 'l2': ['"경력은 없으시고…"', '"나무 타기는 상위 1%네요."'],
 'n3': ['사흘 만에,', '섬 원숭이들은 정규직이 됐습니다.'],
 'n4': ['무인도에서의 첫날 밤.', '다들 별을 보며 울 줄 알았는데,'],
 'n9': ['첫날 밤부터, 회고를 했어요.'],
 'l3': ['"자, 오늘 회고 하죠."', '"아쉬운 점부터."'],
 'l4': ['"근데 이게 최선이에요?"'],
 'n5': ['구조 신호도 고쳤어요.', '구조받는 것보다, 사람 뽑는 게 더 급했거든요.'],
 'n6': ['3주째, 드디어 탈출용 배가 완성됐어요.', '근데 코코넛만 실어 보냈어요.', '아직 분기 목표를 못 채웠거든요.'],
 'r1': ['"구조하러 왔습니다!"'],
 'l5': ['"아, 공고 보고 오셨죠?"', '"자기소개 1분이요."'],
 'r2': ['"…네?"'],
 'n7': ['그날 구조대원은, 합격했습니다.'],
 'n8': ['표류 30일째, 그들은 드디어 섬을 떠났습니다.', '섬을 리조트로 팔고요.'],
}
WHO = {k: ('n' if k[0] == 'n' else 'l' if k[0] == 'l' else 'f') for k in TXT}
dur = {k: len(v) / SR for k, v in L.items()}
def kiki(vol=0.13):  # 원숭이 끼끼
    out = np.zeros(int(0.5 * SR))
    for k in range(2):
        n = int(0.13 * SR); t = np.arange(n) / SR; f = 1500 + 900 * np.sin(np.pi * t / 0.13)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, 0.06) * vol
        i = int(k * 0.17 * SR); out[i:i + n] += x
    return out
def scratch(vol=0.06, d=1.6):  # 모래에 막대기 긁기
    n = int(d * SR); t = np.arange(n) / SR
    return bp(rs.standard_normal(n), 1500, 6000) * (0.4 + 0.6 * (np.sin(2 * np.pi * 3 * t) > 0)) * vol
def stamp(vol=0.25): return thud(vol) + np.pad(click(vol * 0.6), (0, max(0, len(thud(vol)) - len(click(vol * 0.6)))))[:len(thud(vol))]
def guitar(d, vol=0.04):  # 감성 BGM: 느린 아르페지오
    n = int(d * SR); out = np.zeros(n); notes = [262, 330, 392, 523, 392, 330, 294, 349, 440, 587, 440, 349]
    t = 0.0; k = 0
    while t < d:
        x = tone(notes[k % 12], 1.0, 0.5, vol, (0.3, 0.1)); i = int(t * SR); out[i:i + len(x)] += x[:max(0, n - i)]; t += 0.32; k += 1
    f = int(0.3 * SR); out[:f] *= np.linspace(0, 1, f); return out
def scratchrec(vol=0.18):  # 음악 뚝 (레코드 긁힘)
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 900 * np.exp(-t * 8) + 100
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12) * vol + bp(rs.standard_normal(n), 800, 4000) * env(n, 0.002, 0.08) * vol * 0.5
def horn(vol=0.12):  # 뱃고동
    n = int(1.2 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 110 * t) + 0.5 * np.sin(2 * np.pi * 165 * t)) * np.minimum(1, t / 0.1) * np.minimum(1, (1.2 - t) / 0.3) * vol
def jingle(vol=0.07):
    out = np.zeros(int(1.2 * SR))
    for k, f in enumerate([523, 659, 784, 1047]):
        x = tone(f, 0.5, 0.25, vol); i = int(k * 0.12 * SR); out[i:i + len(x)] += x[:len(out) - i]
    return out

P = []; X = []; D = []; M = {}
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀: 폭풍 → 떠밀려옴 → 일어나 손목시계 → 명함 교환 → 모래 로드맵
X += [(0, storm(2.6), 0.0), (0, thunder(), 0.3), (0, waves(13.0, 0.06), 2.0), (0, thud(0.25), 2.3), (0, thud(0.2), 2.6)]
e = place(0, 'n1', 0.25)
M['rise'] = e - 0.4; M['watch'] = e + 0.05
X += [(0, ping(0.08), M['watch'] + 0.15)]
e = place(0, 'l1', e + 0.45)
M['card'] = e - 1.6
X += [(0, swoosh(0.05, 0.2), M['card']), (0, swoosh(0.05, 0.2), M['card'] + 0.35)]
M['draw'] = e + 0.1
X += [(0, scratch(0.07, 2.6), M['draw'])]
e = place(0, 'n2', e + 0.35)
D.append(e + 0.8)
# 1 원숭이 면접 → 사원증 → 코코넛
X += [(1, waves(10.5, 0.035), 0.0), (1, kiki(0.1), 0.3)]
e = place(1, 'l2', 0.9)
X += [(1, kiki(), e + 0.15)]
M['badge'] = e + 0.55
X += [(1, sparkle(0.07), M['badge'])]
e = place(1, 'n3', e + 0.8)
M['coco'] = e - 2.6
X += [(1, thud(0.18), M['coco'] + k * 0.3) for k in range(7)] + [(1, ping(0.1), e - 0.5)]
D.append(e + 0.9)
# 2 첫날 밤 감성 → 회고
X += [(2, fire(10, 0.04), 0.0), (2, waves(10, 0.025), 0.0)]
e = place(2, 'n4', 0.4)
X += [(2, guitar(e + 0.1), 0.0)]
M['cut'] = e + 0.1
X += [(2, scratchrec(), M['cut'])]
e = place(2, 'n9', e + 0.45)
e = place(2, 'l3', e + 0.3)
M['hands'] = e - 0.4
D.append(e + 1.0)
# 3 SOS → "근데 이게 최선이에요?" → 통나무 다시 옮겨 '채용 중' → 비행기
X += [(3, waves(9, 0.035), 0.0), (3, thud(0.2), 0.5)]
e = place(3, 'l4', 1.0)
M['move'] = e + 0.3
X += [(3, steps(8, 0.12), M['move']), (3, thud(0.2), M['move'] + 1.0), (3, thud(0.2), M['move'] + 1.4)]
M['aerial'] = M['move'] + 1.7
X += [(3, swoosh(0.1), M['aerial'] - 0.1), (3, plane(3.5, 0.07), M['aerial'] + 0.5)]
e = place(3, 'n5', M['aerial'] + 0.3)
D.append(e + 0.8)
# 4 3주째 — 코코넛 수출 배
X += [(4, waves(9.5, 0.04), 0.0), (4, swoosh(0.1, 0.3), 0.1)]
e = place(4, 'n6', 0.6)
X += [(4, horn(), 2.4), (4, splash(0.12), 2.9), (4, ping(0.1), e - 1.5)]
D.append(e + 0.9)
# 5 구조 헬기 → 면접
X += [(5, waves(11, 0.03), 0.0), (5, heli(2.6, 0.2), 0.0), (5, thud(0.3), 1.6)]
e = place(5, 'r1', 1.9)
M['sit'] = e + 0.2
e = place(5, 'l5', e + 0.35)
e = place(5, 'r2', e + 0.4)
M['pass'] = e + 0.5
X += [(5, stamp(0.3), M['pass']), (5, jingle(), M['pass'] + 0.1)]
e = place(5, 'n7', e + 0.6)
D.append(e + 1.0)
# 6 30일째 — 리조트 매각 → 헬기 출발 → 엔딩 카드
X += [(6, waves(9, 0.03), 0.0), (6, stamp(0.25), 0.6), (6, sparkle(0.07), 0.8), (6, heli(6.0, 0.14), 1.6)]
e = place(6, 'n8', 0.6)
M['end'] = e + 0.5
X += [(6, sparkle(0.08), M['end'])]
D.append(e + 2.8)

nf = [round(d * 30) for d in D]
starts = [sum(nf[:i]) / 30 for i in range(len(nf))]; T = sum(nf) / 30
full = np.zeros(int((T + 1) * SR), np.float32)
def put(x, t):
    i = int(t * SR); j = min(len(full), i + len(x)); full[i:j] += x[:j - i]
for si, k, t in P: put(L[k], starts[si] + t)
for si, x, t in X: put(x, starts[si] + t)
full = full[:int(T * SR)]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/full.wav'], input=np.clip(full, -1, 1).astype(np.float32).tobytes(), check=True)
lines = [{'s': si, 'k': k, 't0': round(t, 3), 't1': round(t + dur[k], 3), 'who': WHO[k], 'parts': TXT[k]} for si, k, t in P]
json.dump({'durs': [n / 30 for n in nf], 'lines': lines, 'm': {k: round(v, 3) for k, v in M.items()}}, open('timing.json', 'w'), ensure_ascii=False, indent=1)
print('scenes', [round(n / 30, 2) for n in nf], 'total', round(T, 2))
print({k: round(v, 2) for k, v in dur.items()})
