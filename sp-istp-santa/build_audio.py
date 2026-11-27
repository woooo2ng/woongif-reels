# 온 세상이 ISTP인데 산타가 온다면? — 음성 자르기 + 장면 배치 + 효과음·BGM → audio/full.wav, timing.json
exec(open('fx_base.py').read())
from scipy.signal import butter, sosfilt
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def cutp(src, a, b, tempo=1.0):
    af = f'atrim={max(0,a-0.03):.3f}:{b+0.06:.3f},asetpts=PTS-STARTPTS'
    if abs(tempo - 1) > 0.001: af += f',atempo={tempo:.4f}'
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', src, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    n = min(len(x), int(0.02 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x

# ---------- 크리스마스 효과음·BGM ----------
def scratchrec(vol=0.18):  # 음악 뚝
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 900 * np.exp(-t * 8) + 100
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12) * vol + bp(rs.standard_normal(n), 800, 4000) * env(n, 0.002, 0.08) * vol * 0.5
def bell(f, d, vol):  # 맑은 종소리(비정수 배음)
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*6) + 0.25*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*10)
    return x * env(n, 0.002, d * 0.35) * vol
def sleighbells(d, vol=0.04, rate=7.5):  # 썰매 방울 '찰랑찰랑'
    out = np.zeros(int(d * SR)); t = 0.0; k = 0
    while t < d - 0.1:
        n = int(0.12 * SR); s = bp(rs.standard_normal(n), 5000, 11000) * env(n, 0.001, 0.03) * vol * rs.uniform(0.6, 1.2) * (1.3 if k % 2 == 0 else 0.8)
        for f in (6200, 7900):
            s = s + np.sin(2*np.pi*f*np.arange(n)/SR) * env(n, 0.001, 0.025) * vol * 0.25
        i = int(t * SR); out[i:i+n] += s[:len(out)-i]; t += 1 / rate; k += 1
    f = min(len(out)//3, int(0.3 * SR)); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f); return out
N = {'C4':262,'D4':294,'E4':330,'F4':349,'G4':392,'A4':440,'B4':494,'C5':523,'D5':587,'E5':659,'F5':698,'G5':784,'A5':880,'B3':247,'A3':220,'G3':196,'F3':175,'C3':131,'D3':147,'E3':165}
JINGLE = 'E5 E5 E5 - E5 E5 E5 - E5 G5 C5 D5 E5 - - - F5 F5 F5 F5 F5 E5 E5 E5 E5 D5 D5 E5 D5 - G5 -'.split()  # 징글벨(1857, 퍼블릭 도메인)
def jingle(d, vol=0.05, bpm=150):
    n = int(d * SR); out = np.zeros(n); beat = 60 / bpm; t = 0.0; k = 0
    bass = ['C3', 'C3', 'F3', 'C3', 'G3', 'G3', 'C3', 'G3']
    while t < d:
        i = int(t * SR); nt = JINGLE[k % len(JINGLE)]
        if nt != '-':
            m = bell(N[nt], 0.6, vol); tn = tone(N[nt], 0.35, 0.12, vol * 0.5, (0.3, 0.1)); m[:len(tn)] += tn; out[i:i+len(m)] += m[:max(0, n-i)]
        if k % 2 == 0:
            b = tone(N[bass[(k // 8) % 8]], beat * 1.8, 0.35, vol * 0.7, (0.4, 0.2)); out[i:i+len(b)] += b[:max(0, n-i)]
        t += beat; k += 1
    out += sleighbells(d, vol * 0.5, 1 / beat)[:n]
    f = int(0.3 * SR); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f); return out
def epic(d, vol=0.06):  # 웅장한 출정 화음(현악 패드 + 팀파니)
    n = int(d * SR); out = np.zeros(n); t = np.arange(n) / SR
    chords = [[131, 262, 330, 392], [175, 349, 440, 523], [196, 392, 494, 587], [131, 262, 330, 523]]
    seg = d / len(chords)
    for j, ch in enumerate(chords):
        a, b = int(j * seg * SR), int((j + 1) * seg * SR); tt = t[a:b] - t[a]
        x = sum(np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*f*2*tt) for f in ch) / len(ch)
        x *= np.minimum(1, tt / 0.25) * np.minimum(1, (seg - tt) / 0.2); out[a:b] += x * vol
        k = np.sin(2*np.pi*65*tt[:int(0.5*SR)]) * env(min(int(0.5*SR), b-a), 0.002, 0.15) * vol * 2.2; out[a:a+len(k)] += k
    out += sleighbells(d, vol * 0.45)[:n]
    f = int(0.4 * SR); out[-f:] *= np.linspace(1, 0, f); return out
SILENT = 'G4 - A4 G4 E4 - - - G4 - A4 G4 E4 - - - D5 - - D5 B4 - - - C5 - - C5 G4 - - -'.split()  # 고요한 밤(1818, 퍼블릭 도메인)
def musicbox(d, vol=0.045, bpm=150):
    n = int(d * SR); out = np.zeros(n); beat = 60 / bpm; t = 0.0; k = 0
    while t < d:
        nt = SILENT[k % len(SILENT)]; i = int(t * SR)
        if nt != '-':
            m = bell(N[nt] * 2, 1.2, vol); out[i:i+len(m)] += m[:max(0, n-i)]
        t += beat; k += 1
    f = int(0.4 * SR); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f); return out
def wind(d, vol=0.035):
    n = int(d * SR); t = np.arange(n) / SR; w = bp(rs.standard_normal(n), 250, 1200) * (0.6 + 0.4 * np.sin(2*np.pi*0.3*t)) * vol * 3
    f = int(0.4 * SR); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f); return w
def heartbeat(d, vol=0.3, bpm=70):
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.3:
        for o, v in ((0, 1), (0.16, 0.7)):
            x = thud(vol * v); i = int((t + o) * SR); out[i:i+len(x)] += x[:len(out)-i]
        t += 60 / bpm
    return out
def tension(d, vol=0.05):
    n = int(d * SR); t = np.arange(n) / SR
    x = (np.sin(2*np.pi*55*t) + 0.5*np.sin(2*np.pi*58.3*t) + 0.3*np.sin(2*np.pi*110*t)) * vol
    f = int(0.3 * SR); x[:f] *= np.linspace(0, 1, f); x[-int(0.05*SR):] *= np.linspace(1, 0, int(0.05*SR)); return x + heartbeat(d, vol * 4)
def msg(vol=0.12): return tone(1046, 0.18, 0.06, vol) + np.pad(tone(1568, 0.14, 0.05, vol*0.8), (int(0.06*SR), 0))[:int(0.18*SR)]
def typing(nk=4, vol=0.12):
    out = np.zeros(int((nk * 0.13 + 0.1) * SR))
    for k in range(nk):
        x = click(vol); i = int(k * 0.13 * SR); out[i:i+len(x)] += x
    return out
def printer(d=1.2, vol=0.1):
    n = int(d * SR); t = np.arange(n) / SR
    x = bp(rs.standard_normal(n), 400, 2500) * (0.6 + 0.4*np.sign(np.sin(2*np.pi*14*t))) * vol
    f = int(0.05 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f); return x
def rustle(d=0.6, vol=0.1):
    n = int(d * SR); return bp(rs.standard_normal(n), 1500, 7000) * np.sin(np.linspace(0, np.pi, n)) ** 2 * vol * 2
def plunk(vol=0.3):  # 굴뚝 '쏙'
    n = int(0.25 * SR); t = np.arange(n) / SR; f = 700 * np.exp(-t * 12) + 180
    x = np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.002, 0.06) * vol; th = thud(vol * 0.6); x[:len(th)] += th[:n]; return x
def slide(vol=0.12, d=0.5):  # 지붕 미끄러짐 '스르륵'
    n = int(d * SR); return bp(rs.standard_normal(n), 1200, 5000) * np.linspace(1, 0.2, n) * vol * 2
def scrape(d=1.2, vol=0.06):  # 굴뚝 타고 내려감
    n = int(d * SR); t = np.arange(n) / SR; return bp(rs.standard_normal(n), 300, 1800) * (0.5 + 0.5*np.abs(np.sin(2*np.pi*3*t))) * vol * 2
def beep(vol=0.12): return tone(2093, 0.12, 0.05, vol, (0.0, 0.0))
def plugin(vol=0.2): return np.concatenate([click(vol), np.zeros(int(0.03*SR)), tone(880, 0.12, 0.05, vol * 0.4)])
def drumroll(d, vol=0.06):
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.03:
        x = bp(rs.standard_normal(int(0.03*SR)), 200, 2500) * env(int(0.03*SR), 0.001, 0.01) * vol * (0.5 + t / d)
        i = int(t * SR); out[i:i+len(x)] += x[:len(out)-i]; t += 0.035
    return out
def tada(vol=0.08):
    out = np.zeros(int(1.2 * SR))
    for k, f in enumerate([523, 659, 784, 1047]):
        x = bell(f, 1.0, vol); out[:len(x)] += x
    sp = sparkle(vol); out[:len(sp)] += sp; return out
def crackle(d, vol=0.03):
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        x = click(vol * rs.uniform(0.4, 1.2)); i = int(t * SR); out[i:i+len(x)] += x[:len(out)-i]; t += rs.uniform(0.05, 0.25)
    return out + lp(rs.standard_normal(len(out)), 400) * vol * 0.8
def bird(vol=0.04):
    out = np.zeros(int(0.5 * SR))
    for k in range(3):
        n = int(0.08 * SR); t = np.arange(n) / SR; x = np.sin(2*np.pi*(2800 + 1200*np.sin(2*np.pi*12*t))*t) * np.sin(np.linspace(0, np.pi, n)) * vol
        i = int(k * 0.12 * SR); out[i:i+n] += x
    return out

# ---------- 음성 ----------
TN = 1.15  # 내레이션 배속
R = {'n': 'raw/nar.mp3', 's': 'raw/santa.mp3', 'e': 'raw/elf.mp3', 'k': 'raw/kid.mp3', 'm': 'raw/mom.mp3'}
SEG = {
 'n1': ('n', 0.00, 3.31), 'n2': ('n', 3.92, 11.56), 'n3': ('n', 12.00, 17.99), 'n4': ('n', 18.56, 22.47), 'n5': ('n', 23.00, 28.08),
 'n6': ('n', 28.56, 34.50), 'n7': ('n', 35.04, 39.74), 'n8': ('n', 40.24, 43.10), 'n9': ('n', 43.52, 48.35),
 's1': ('s', 0.00, 1.73), 's2': ('s', 2.56, 2.94), 's3': ('s', 3.54, 3.95), 's4': ('s', 4.45, 5.52),
 'e1': ('e', 0.00, 2.08),
 'k1': ('k', 0.00, 1.15), 'k2': ('k', 1.96, 3.11), 'k3': ('k', 3.71, 4.06), 'k4': ('k', 4.67, 5.15),
 'm1': ('m', 0.00, 0.53),
}
L = {k: cutp(R[w], a, b, TN if k[0] == 'n' else 1.0) for k, (w, a, b) in SEG.items()}
dur = {k: len(v) / SR for k, v in L.items()}
def wt(key, word_t):  # 내레이션 원본 단어 시각 → 잘린 클립 안의 시각
    return (word_t - SEG[key][1]) / TN
TXT = {
 'n1': ['온 세상이 ISTP인데,', '산타가 온다면?'],
 'n2': ['올해도 산타는, 세상 모든 아이에게', '선물을 주러 출발합니다.', '문제는,', '산타도 ISTP였다는 거죠.'],
 'n3': ['이 세상에서 크리스마스에', '약속이 있는 사람은,', '산타 한 명뿐이었습니다.', '출근이었죠.'],
 'n4': ['이 세상 아이들은 깜짝 선물보다,', '내가 고르는 걸 좋아했습니다.'],
 'n5': ['굴뚝으로 내려갈 필요는', '없었습니다.', '어차피 종이 한 장이라,', '던지면 들어갔으니까요.'],
 'n6': ['크리스마스의 기적은', '일어나지 않았습니다.', '대신 둘 다,', '빨리 끝나서 다행이라고 생각했죠.'],
 'n7': ['리액션은 한 글자였습니다.', '대신 그날,', '충전기를 두 번 꽂았죠.'],
 'n8': ['그해 산타 만족도는,', '역대 최고였습니다.'],
 'n9': ['아이들이 꼽은 1위는', '선물이 아니었습니다.', '말을 안 걸어 준 거였죠.'],
 's1': ['"…그럼 썰매는 왜 타."'], 's2': ['"…하."'], 's3': ['"…네."'], 's4': ['"…메리 크리스마스."'],
 'e1': ['"규정상 실물 배송이래요."'],
 'k1': ['"…거기 두시면 돼요."'], 'k2': ['"네, 수고하세요."'], 'k3': ['"…오."'], 'k4': ['"응."'],
 'm1': ['"좋아?"'],
}
WHO = {k: k[0] for k in TXT}

P = []; X = []; D = []; M = {}
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀: 북극 출정 → 이륙 → 산타 얼굴 클로즈업
X += [(0, epic(5.0, 0.055), 0.0), (0, wind(11, 0.02), 0.0)]
e = place(0, 'n1', 0.25)
t2 = e + 0.3
M['lift'] = t2 + wt('n2', 6.3)
X += [(0, sleighbells(4.0, 0.06, 9), M['lift'] - 0.3), (0, swoosh(0.12, 1.0, 400, 2000), M['lift'] + 0.4)]
M['close'] = t2 + wt('n2', 8.25)
X += [(0, scratchrec(0.1), M['close'] - 0.1)]
e = place(0, 'n2', t2)
D.append(e + 0.6)

# 1 단톡 '크리스마스 뭐 해요?'
X += [(1, crackle(12, 0.02), 0.0)]
M['c_q'] = 0.45; X += [(1, msg(), M['c_q'])]
M['c_r'] = [1.25, 1.8, 2.35, 2.95]; X += [(1, msg(0.09), x) for x in M['c_r']]
M['c_type'] = 3.75; X += [(1, typing(1, 0.14), M['c_type'])]
M['c_del'] = 4.45; X += [(1, click(0.12), M['c_del'])]
M['c_down'] = 4.9; X += [(1, thud(0.15), M['c_down'] + 0.3)]
t3 = 5.0
M['c_work'] = t3 + wt('n3', 17.28)
X += [(1, ping(0.08), M['c_work'])]
e = place(1, 'n3', t3)
D.append(e + 0.6)

# 2 소원은 기프티콘 → 바코드 한 장 → 큰 상자
X += [(2, musicbox(14, 0.03), 0.0)]
M['g_tab'] = 0.6; X += [(2, swoosh(0.08), M['g_tab'])]
M['g_w'] = [1.0, 1.5, 2.0]; X += [(2, msg(0.08), x) for x in M['g_w']]
M['g_chip'] = 2.45; X += [(2, ping(0.06), M['g_chip'])]
e = place(2, 's1', 2.9)
e = place(2, 'e1', e + 0.3)
e = place(2, 's2', e + 0.35)
M['g_print'] = e + 0.25; X += [(2, printer(1.1, 0.08), M['g_print'])]
M['g_box'] = M['g_print'] + 1.3; X += [(2, rustle(0.5, 0.1), M['g_box']), (2, sparkle(0.06), M['g_box'] + 0.6)]
M['g_chip2'] = M['g_box'] + 0.7
e = place(2, 'n4', M['g_print'] + 0.15)
D.append(max(e, M['g_chip2'] + 1.0) + 0.6)

# 3 던지기 배송
X += [(3, jingle(8, 0.04), 0.0), (3, wind(8, 0.025), 0.0)]
M['slip'] = 0.7; X += [(3, slide(0.14), M['slip']), (3, gasp(0.08), M['slip'] + 0.15)]
M['throw'] = 2.0; X += [(3, swoosh(0.1, 0.35), M['throw']), (3, plunk(0.3), M['throw'] + 0.45)]
M['mont'] = [2.8, 3.35, 3.9, 4.45, 5.0, 5.5]
X += [(3, plunk(0.22), x + 0.3) for x in M['mont']]
e = place(3, 'n5', 1.0)
D.append(e + 0.7)

# 4 굴뚝에 걸림 → 거실에서 아이와 마주침
X += [(4, wind(1.2, 0.02), 0.0)]
M['stuck'] = 0.35; X += [(4, thud(0.35), M['stuck']), (4, click(0.15), M['stuck'])]
M['m_down'] = 1.2; X += [(4, tension(2.4, 0.045), 0.9), (4, scrape(1.2, 0.06), M['m_down'])]
M['land'] = 2.5; X += [(4, thud(0.3), M['land'])]
M['eye'] = 2.75; X += [(4, crackle(16, 0.022), M['eye'])]
e = place(4, 'k1', 4.6)
M['k1e'] = e
e = place(4, 's3', e + 0.75)
M['walk'] = e + 0.3; X += [(4, steps(6, 0.28, 0.12), M['walk'])]
M['stop'] = M['walk'] + 1.8
e = place(4, 's4', M['stop'] + 0.55)
e = place(4, 'k2', e + 0.12)
M['m_chip'] = e + 0.2; X += [(4, ping(0.06), M['m_chip'])]
e = place(4, 'n6', e + 0.5)
D.append(e + 0.6)

# 5 크리스마스 아침
X += [(5, musicbox(12, 0.035), 0.0), (5, bird(0.03), 0.2)]
M['open'] = 0.4; X += [(5, rustle(0.7, 0.12), M['open'])]
M['paper'] = 1.1
e = place(5, 'k3', 1.6)
e = place(5, 'm1', e + 0.5)
e = place(5, 'k4', e + 0.35)
M['scan'] = e + 0.45; X += [(5, beep(0.12), M['scan']), (5, sparkle(0.06), M['scan'] + 0.3)]
M['tl'] = M['scan'] + 0.9
t7 = M['tl'] + 0.1
M['plug1'] = t7 + wt('n7', 38.4); M['plug2'] = M['plug1'] + 0.55
X += [(5, plugin(0.2), M['plug1']), (5, plugin(0.2), M['plug2'])]
e = place(5, 'n7', t7)
D.append(e + 0.8)

# 6 엔딩: 산타 만족도 조사
X += [(6, crackle(12, 0.02), 0.0)]
M['sit'] = 0.3; X += [(6, thud(0.25), M['sit'] + 0.2)]
M['noti'] = 0.95; X += [(6, ping(0.1), M['noti'])]
e = place(6, 'n8', 1.25)
M['r3'] = 1.9; M['r2'] = 2.6
X += [(6, click(0.15), M['r3']), (6, click(0.15), M['r2'])]
t9 = e + 0.25
M['r1'] = t9 + wt('n9', 46.64) - 0.05
X += [(6, drumroll(M['r1'] - (t9 + 0.2), 0.05), t9 + 0.2), (6, tada(0.07), M['r1'])]
M['nod'] = M['r1'] + 0.9
e = place(6, 'n9', t9)
M['card'] = e + 0.5
X += [(6, musicbox(4.5, 0.04), M['card'] - 0.4), (6, sleighbells(2.5, 0.03), M['card'])]
D.append(e + 2.6)

nf = [round(d * 30) for d in D]
starts = [sum(nf[:i]) / 30 for i in range(len(nf))]; T = sum(nf) / 30
full = np.zeros(int((T + 1) * SR), np.float32)
def put(x, t):
    i = int(t * SR); j = min(len(full), i + len(x)); full[i:j] += np.asarray(x[:j - i], np.float32)
for si, k, t in P: put(L[k], starts[si] + t)
for si, x, t in X: put(x, starts[si] + t)
full = full[:int(T * SR)]
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/full.wav'], input=np.clip(full, -1, 1).astype(np.float32).tobytes(), check=True)
lines = [{'s': si, 'k': k, 't0': round(t, 3), 't1': round(t + dur[k], 3), 'who': WHO[k], 'parts': TXT[k]} for si, k, t in P]
Mo = {k: (round(v, 3) if not isinstance(v, list) else [round(x, 3) for x in v]) for k, v in M.items()}
json.dump({'durs': [n / 30 for n in nf], 'lines': lines, 'm': Mo}, open('timing.json', 'w'), ensure_ascii=False, indent=1)
print('scenes', [round(n / 30, 2) for n in nf], 'total', round(T, 2))
