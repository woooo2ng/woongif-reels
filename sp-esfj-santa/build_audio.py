# 온 세상이 ESFJ인데 산타가 온다면? — 음성 자르기 + 장면 배치 + 효과음·BGM → audio/full.wav, timing.json
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

# 타이틀용 징글벨 풀 편곡(1857, 퍼블릭 도메인): 종 멜로디 + 피아노 화음 + 베이스 + 썰매 방울 + 팀파니
JB = [('E5',1),('E5',1),('E5',2),('E5',1),('E5',1),('E5',2),('E5',1),('G5',1),('C5',1.5),('D5',0.5),('E5',4),
      ('F5',1),('F5',1),('F5',1.5),('F5',0.5),('F5',1),('E5',1),('E5',1),('E5',0.5),('E5',0.5),('E5',1),('D5',1),('D5',1),('E5',1),('D5',2),('G5',2),
      ('E5',1),('E5',1),('E5',2),('E5',1),('E5',1),('E5',2),('E5',1),('G5',1),('C5',1.5),('D5',0.5),('E5',4),
      ('F5',1),('F5',1),('F5',1.5),('F5',0.5),('F5',1),('E5',1),('E5',1),('E5',0.5),('E5',0.5),('G5',1),('G5',1),('F5',1),('D5',1),('C5',4)]
JCH = ['C','C','C','C','F','C','D','G','C','C','C','C','F','C','G','C']
CHN = {'C':[131,262,330,392],'F':[175,349,440,523],'G':[98,247,294,392],'D':[147,294,370,440]}
def piano(f, d, vol):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*f*2*t) + 0.15*np.sin(2*np.pi*f*3*t)) * env(n, 0.003, 0.35) * vol
def jingle_full(d, vol=0.07, bpm=152):
    n = int(d * SR); out = np.zeros(n); beat = 60 / bpm
    t = 0.0
    for nt, b in JB:
        i = int(t * SR)
        if i >= n: break
        m = bell(N[nt], 0.9, vol); m2 = piano(N[nt], beat * b * 0.95, vol * 0.55); m[:len(m2)] += m2[:len(m)] if len(m2) <= len(m) else m2[:len(m)]
        out[i:i+len(m)] += m[:max(0, n-i)]; t += beat * b
    for bar, ch in enumerate(JCH):
        for k in range(4):
            tt = (bar * 4 + k) * beat; i = int(tt * SR)
            if i >= n: break
            f = CHN[ch]
            if k % 2 == 0:
                x = tone(f[0] if k == 0 else f[0] * 1.5, beat * 0.9, 0.25, vol * 0.75, (0.5, 0.2))
            else:
                x = sum(piano(ff, beat * 0.6, vol * 0.22) for ff in f[1:])
            out[i:i+len(x)] += x[:max(0, n-i)]
        i = int(bar * 4 * beat * SR)
        if bar % 2 == 0 and i < n:
            k_ = np.sin(2*np.pi*70*np.arange(int(0.4*SR))/SR) * env(int(0.4*SR), 0.002, 0.12) * vol * 1.6; out[i:i+len(k_)] += k_[:max(0, n-i)]
    sb = sleighbells(d, vol * 0.55, 2 / beat); out += sb[:n]
    return out

# ---------- ESFJ편 추가 효과음 ----------
def popper(vol=0.3):  # 폭죽 '팡'
    n = int(0.5 * SR); x = bp(rs.standard_normal(n), 300, 6000) * env(n, 0.0005, 0.03) * vol * 3
    th = thud(vol * 0.5); x[:min(n,len(th))] += th[:n]; sp = sparkle(vol * 0.3)[:n]; x[:len(sp)] += sp; return x
def clap(d=1.5, vol=0.05, rate=14):  # 박수 소리(여럿)
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        n = int(0.04 * SR); x = bp(rs.standard_normal(n), 800, 5000) * env(n, 0.0005, 0.008) * vol * rs.uniform(0.5, 1.3) * 3
        i = int(t * SR); out[i:i+n] += x[:len(out)-i]; t += rs.uniform(0.3, 1.3) / rate
    f = int(0.2 * SR); out[-f:] *= np.linspace(1, 0, f); return out
def munch(n_=4, vol=0.12):  # 우적우적
    out = np.zeros(int((n_ * 0.16 + 0.1) * SR))
    for k in range(n_):
        m = int(0.07 * SR); x = bp(rs.standard_normal(m), 600, 3500) * env(m, 0.001, 0.02) * vol * 2.5
        i = int(k * 0.16 * SR); out[i:i+m] += x
    return out
def gulp(vol=0.15):
    n = int(0.18 * SR); t = np.arange(n) / SR; f = 300 + 500 * t / 0.18
    return np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.005, 0.06) * vol
def tok(vol=0.15):  # 반찬통 '톡'
    x = tone(1500, 0.08, 0.02, vol, (0.2, 0.05)); c = click(vol * 0.5); x[:len(c)] += c; return x
def buzz(d=0.5, vol=0.08):  # 휴대폰 진동
    n = int(d * SR); t = np.arange(n) / SR
    return np.sign(np.sin(2*np.pi*170*t)) * 0.4 * (np.sin(2*np.pi*6*t) > 0) * vol * env(n, 0.005)
def creakw(vol=0.06):  # 창문 열림
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 500 + 200 * np.sin(2*np.pi*4*t)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.01, 0.15) * vol
def lightsw(vol=0.25): return click(vol) + np.pad(click(vol*0.6), (int(0.01*SR), 0))[:int(0.04*SR)]
def strain(d=1.0, vol=0.05):  # 썰매 끙끙(삐걱+눈 밟힘)
    n = int(d * SR); t = np.arange(n) / SR
    return bp(rs.standard_normal(n), 150, 900) * (0.5 + 0.5*np.abs(np.sin(2*np.pi*2.5*t))) * vol * 3
def alarmbell(vol=0.08):  # 출동 알람(종 3번)
    out = np.zeros(int(1.4 * SR))
    for k in range(3):
        x = bell(1320, 0.4, vol); i = int(k * 0.22 * SR); out[i:i+len(x)] += x[:len(out)-i]
    return out
def pitch(x, semis):
    r = 2 ** (semis / 12); idx = np.arange(0, len(x) - 1, r); return np.interp(idx, np.arange(len(x)), x).astype(np.float32)

# ---------- 음성 ----------
TN = 1.15  # 내레이션 배속
R = {'n': 'raw/nar.mp3', 's': 'raw/santa.mp3', 'e': 'raw/elf.mp3', 'k': 'raw/kid.mp3', 'm': 'raw/mom.mp3', 'b': 'raw/nb.mp3'}
SEG = {
 'n1': ('n', 0.00, 4.08), 'n2': ('n', 4.16, 8.00), 'n2b': ('n', 8.08, 12.56), 'n3': ('n', 12.64, 15.68), 'n4': ('n', 15.76, 20.72),
 'n5': ('n', 20.80, 24.40), 'n6': ('n', 24.48, 28.40), 'n7': ('n', 28.56, 31.28), 'n7b': ('n', 31.36, 34.72),
 's1': ('s', 0.00, 2.16), 's2': ('s', 2.56, 5.92), 's3': ('s', 6.08, 7.04), 's4': ('s', 7.68, 8.48),
 'k1': ('k', 0.00, 1.12), 'k2': ('k', 1.20, 4.40), 'kh': ('k', 1.20, 2.32), 'kc': ('k', 4.48, 6.00),
 'm1': ('m', 0.00, 2.31), 'mc': ('m', 2.58, 3.96),
 'e1': ('e', 0.00, 2.29), 'ec': ('e', 2.55, 4.60),
 'b1': ('b', 0.00, 3.84), 'bc': ('b', 3.92, 5.60),
}
L = {k: cutp(R[w], a, b, TN if k[0] == 'n' else 1.0) for k, (w, a, b) in SEG.items()}
# 합창 '산타님 오셨어요~!!': 네 목소리를 살짝 어긋나게 겹침
def chorus():
    parts = [(L['kc'], 0.0, 1.0), (L['mc'], 0.04, 0.9), (L['ec'], 0.09, 0.85), (L['bc'], 0.02, 0.8), (pitch(L['kc'], 3), 0.12, 0.5), (pitch(L['mc'], -2), 0.07, 0.5)]
    n = int((max(len(p[0]) / SR + p[1] for p in parts) + 0.05) * SR); out = np.zeros(n, np.float32)
    for x, o, v in parts:
        i = int(o * SR); out[i:i+len(x)] += x * v * 0.62
    return out
L['ch'] = chorus()
L['kh2'] = pitch(L['kh'], 2.5); L['kh3'] = pitch(L['kh'], -1.5)
dur = {k: len(v) / SR for k, v in L.items()}
TXT = {
 'n1': ['온 세상이 ESFJ인데,', '산타가 온다면?'],
 'n2': ['이 세상엔 산타를 기다리다', '잠든 아이가 없었습니다.'],
 'n2b': ['문제는,', '산타도 ESFJ라', '거절을 못 한다는 거였죠.'],
 'n3': ['남이 차려 준 건,', '남길 수가 없었습니다.'],
 'n4': ['이 세상 아이들은 뭘 받든,', '일단 세상에서 제일 기뻐했습니다.'],
 'n5': ['선물을 내려놓을수록,', '썰매는 무거워졌습니다.'],
 'n6': ['산타가 못 돌린 선물은,', '동네 사람들이 다 돌렸습니다.'],
 'n7': ['선물을 돌리는 데는', '하루가 걸렸습니다.'],
 'n7b': ['고맙다는 연락에', '답장하는 데는,', '1년이 걸렸고요.'],
 's1': ['"아이고, 뭘 이런 걸 다~"'], 's2': ['"아니야!"', '"너무 맛있어서 아껴 먹은 거야!!"'], 's3': ['"아이, 괜찮은데~"'], 's4': ['"…다 했다!"'],
 'k1': ['"…맛없으세요?"'], 'k2': ['"헐 대박!!"', '"이거 진짜 갖고 싶었던 거야!!"'], 'kh': ['"헐 대박!!"'], 'kh2': ['"헐 대박!!"'], 'kh3': ['"헐 대박!!"'],
 'ch': ['"산타님 오셨어요~!!"'],
 'm1': ['"잠깐만요!"', '"이것 좀 가져가세요~"'],
 'e1': ['"산타님, 출발하실 시간이에요."'],
 'b1': ['"어머, 산타님 힘드시잖아요~"', '"저희가 돌릴게요!"'],
}
WHO = {k: ('c' if k == 'ch' else k[0]) for k in TXT}
def wt(key, word_t): return (word_t - SEG[key][1]) / TN

P = []; X = []; D = []; M = {}
def place(si, key, t): P.append((si, key, t)); return t + dur[key]

# 0 타이틀: 0초 착지 → 불 탁 → 폭죽 → 합창 → 산타 '뭘 이런 걸 다~' 하며 앉음 → '문제는,' 클로즈업
M['land'] = 0.15; X += [(0, thud(0.35), M['land']), (0, crackle(16, 0.018), 0.0)]
M['light'] = 0.45; X += [(0, lightsw(0.22), M['light'])]
M['pop'] = 0.6; X += [(0, popper(0.28), M['pop']), (0, popper(0.2), M['pop'] + 0.12), (0, clap(3.4, 0.045), M['pop'] + 0.2)]
e = place(0, 'n1', 0.75)
M['ch'] = e + 0.15; e = place(0, 'ch', M['ch']); X += [(0, clap(1.6, 0.05), M['ch'] + 0.9)]
M['s1'] = e + 0.2; e = place(0, 's1', M['s1'])
M['sit'] = M['s1'] + 1.1; X += [(0, thud(0.18), M['sit'] + 0.25)]
t2 = e + 0.25; M['t_chip'] = t2 + 0.3; X += [(0, ping(0.07), M['t_chip'])]
e = place(0, 'n2', t2)
M['close'] = e + 0.1; X += [(0, scratchrec(0.16), M['close'] - 0.1)]
e = place(0, 'n2b', M['close'])
jd = M['close'] - 0.05; jb = jingle_full(jd + 0.1, 0.11)
tt = np.arange(len(jb)) / SR; g = np.clip(1 - 0.6 * np.clip((tt - 0.55) / 0.25, 0, 1), 0.4, 1)
cut = int(jd * SR); jb = jb[:cut] * g[:cut]; f_ = int(0.06 * SR); jb[-f_:] *= np.linspace(1, 0, f_)
X += [(0, jb, 0.0)]
X += [(0, tension(e - M['close'] + 0.4, 0.03), M['close'] + 0.15)]
D.append(e + 0.6)

# 1 쿠키·우유: 망설임 → 아이 눈 → 우적우적 → 집마다 빨리 감기
X += [(1, musicbox(11, 0.03), 0.0), (1, crackle(11, 0.015), 0.0)]
M['hes'] = 0.5
e = place(1, 'k1', 1.4); M['peek'] = 1.2
M['s2'] = e + 0.35; e = place(1, 's2', M['s2'])
M['eat'] = M['s2'] + 0.9; X += [(1, munch(10, 0.1), M['eat'])] + [(1, gulp(0.12), M['eat'] + 1.7)]
M['ff'] = e + 0.2; ffd = 2.6
M['ffh'] = [M['ff'] + i * ffd / 5 for i in range(5)]
X += [(1, swoosh(0.06, 0.2), x) for x in M['ffh']] + [(1, munch(3, 0.07), x + 0.1) for x in M['ffh']] + [(1, gulp(0.09), x + 0.4) for x in M['ffh']]
e = place(1, 'n3', M['ff'] + 0.3)
D.append(max(e, M['ff'] + ffd) + 0.6)

# 2 크리스마스 아침: 양말 '헐 대박' → 문제집·빈 상자·감자 몽타주 → 창밖 산타 눈물 → 칩
X += [(2, musicbox(15, 0.03), 0.0), (2, bird(0.03), 0.3)]
M['g_chip0'] = 0.2; X += [(2, ping(0.06), M['g_chip0'])]
M['open'] = 0.5; X += [(2, rustle(0.6, 0.12), M['open'])]
M['sock'] = 1.1; X += [(2, sparkle(0.06), M['sock'])]
e = place(2, 'k2', 1.3); X += [(2, clap(1.6, 0.05), 2.4)]
M['mt'] = [e + 0.25, e + 1.6, e + 2.95]
for i, k in enumerate(['kh2', 'kh', 'kh3']):
    X += [(2, swoosh(0.08, 0.25), M['mt'][i] - 0.05), (2, rustle(0.3, 0.08), M['mt'][i])]
    place(2, k, M['mt'][i] + 0.2)
    X += [(2, clap(0.8, 0.04), M['mt'][i] + 0.7)]
M['cry'] = M['mt'][2] + 1.45; M['g_chip'] = M['cry'] + 0.5; X += [(2, ping(0.07), M['g_chip'])]
e = place(2, 'n4', M['cry'] + 0.1)
D.append(max(e, M['g_chip'] + 1.5) + 0.6)

# 3 반찬 싸 주기 → 썰매 이륙 실패
X += [(3, crackle(4.2, 0.015), 0.0)]
M['b_walk'] = 0.1; X += [(3, steps(3, 0.28, 0.07), M['b_walk'])]
e = place(3, 'm1', 0.5)
M['give'] = [0.9, 1.4, 1.9, 2.4, 2.9, 3.3]; X += [(3, tok(0.13), x) for x in M['give']]
e = place(3, 's3', e + 0.2)
M['b_out'] = e + 0.3
X += [(3, wind(7, 0.02), M['b_out']), (3, jingle(7, 0.025), M['b_out'])]
M['stack'] = [M['b_out'] + 0.4 + i * 0.32 for i in range(10)]; X += [(3, tok(0.1), x) for x in M['stack']]
M['b_chip'] = M['b_out'] + 0.8; X += [(3, ping(0.06), M['b_chip'])]
e = place(3, 'n5', M['b_out'] + 0.5)
M['try'] = e - 1.4; X += [(3, strain(1.6, 0.06), M['try']), (3, thud(0.25), M['try'] + 1.5)]
M['fail'] = M['try'] + 1.5; X += [(3, ping(0.06), M['fail'])]
D.append(max(e, M['fail'] + 1.0) + 0.5)

# 4 이웃 릴레이
X += [(4, wind(11, 0.022), 0.0)]
M['r_chip0'] = 0.2; X += [(4, ping(0.06), M['r_chip0'])]
M['sigh'] = 0.7; X += [(4, gasp(0.05), M['sigh'])]
M['win'] = [1.2, 1.45, 1.7, 1.95]; X += [(4, creakw(0.05), x) for x in M['win']]
e = place(4, 'b1', 2.1)
M['r_out'] = e - 1.2; X += [(4, steps(8, 0.15, 0.08), M['r_out'])]
M['relay'] = e + 0.15; X += [(4, jingle(6, 0.035), M['relay']), (4, clap(4, 0.02), M['relay'] + 0.5)]
M['pass'] = [M['relay'] + 0.3 + i * 0.28 for i in range(10)]; X += [(4, swoosh(0.04, 0.15, 800, 3000), x) for x in M['pass']]
M['r_chip'] = M['relay'] + 1.0; X += [(4, ping(0.07), M['r_chip'])]
e = place(4, 'n6', M['relay'] + 0.4)
D.append(max(e, M['relay'] + 3.0) + 0.6)

# 5 엔딩: 답장 1년 → '다 했다!' → 출동 알람
X += [(5, crackle(15, 0.015), 0.0)]
M['buzz'] = [0.2, 0.55, 0.9]; X += [(5, buzz(0.3, 0.07), x) for x in M['buzz']]
e = place(5, 'n7', 0.8)
M['tl'] = e - 0.6  # 계절 타임랩스 시작
e = place(5, 'n7b', e + 0.15)
M['tle'] = e + 0.4
X += [(5, musicbox(M['tle'] - M['tl'] + 0.5, 0.03), M['tl'])]
X += [(5, typing(int((M['tle'] - 0.3) / 0.13), 0.06), 0.3)]
M['done'] = M['tle'] + 0.15; X += [(5, tada(0.06), M['done'])]
e = place(5, 's4', M['done'] + 0.1)
M['alarm'] = e + 0.35; X += [(5, alarmbell(0.08), M['alarm'])]
e = place(5, 'e1', M['alarm'] + 0.5)
M['card'] = e + 0.45
X += [(5, sleighbells(2.8, 0.03), M['card']), (5, musicbox(3.0, 0.035), M['card'] - 0.2)]
D.append(e + 2.8)

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
