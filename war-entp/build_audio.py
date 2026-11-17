# ESTJ 전쟁편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성 (헬퍼는 ISTP 전쟁편과 동일)
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def load(name):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'atempo=1.2', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    # 앞뒤 무음 정리
    a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x
def save(x, path):
    x = np.clip(x, -1, 1).astype(np.float32)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', path], input=x.tobytes(), check=True)
def filt(x, kind, f, order=4):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)
def env(n, a=0.005, d=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) if a > 0 else np.ones(n)
    if d: e *= np.exp(-t / d)
    return e
def sine(f0, f1, dur, d=None, a=0.003):
    n = int(dur * SR); t = np.arange(n) / SR
    f = np.linspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, a, d)
def noise(dur): return rs.standard_normal(int(dur * SR))
def brown(dur):
    w = noise(dur); b = np.cumsum(w); b = filt(b, 'highpass', 20, 2); return b / (np.abs(b).max() + 1e-9)
def fadeout(x, s=0.05):
    n = min(len(x), int(s * SR)); x = x.copy(); x[-n:] *= np.linspace(1, 0, n); return x

# ---------- 효과음 ----------
def wind(dur, vol=0.06):
    b = filt(brown(dur + 1), 'lowpass', 500)[:int(dur * SR)]
    t = np.arange(len(b)) / SR
    return b / (np.abs(b).max() + 1e-9) * vol * (0.7 + 0.3 * np.sin(t * 0.9 + 1))
def boom(vol=0.55):
    n = brown(1.8); n = filt(n, 'lowpass', 900) * env(len(n), 0.01, 0.45)
    s = sine(70, 38, 1.8, 0.35)
    x = n / (np.abs(n).max() + 1e-9) * 0.8 + s * 0.6
    return x * vol
def gunshot(vol=0.5):
    n = filt(noise(0.25), 'highpass', 700) * env(int(0.25 * SR), 0.0005, 0.03)
    b = filt(noise(0.4), 'lowpass', 300) * env(int(0.4 * SR), 0.001, 0.08)
    x = n * 0.9 + np.pad(b, (0, 0))[:len(n)] if False else None
    x = np.zeros(int(0.4 * SR)); x[:len(n)] += n * 0.9; x += b * 0.8
    return x / (np.abs(x).max() + 1e-9) * vol
def ricochet(vol=0.18):
    return sine(3200, 1100, 0.32, 0.12, 0.002) * vol
def muffle(x, f=260): return filt(x, 'lowpass', f, 6) * 0.7
def chime(vol=0.22):  # 노이즈캔슬링 ON '뽀옹'
    a = sine(520, 560, 0.11, 0.08) * 0.8; b = sine(780, 820, 0.22, 0.12)
    x = np.zeros(int(0.42 * SR)); x[:len(a)] += a; o = int(0.1 * SR); x[o:o + len(b)] += b
    return filt(x, 'lowpass', 3000) * vol
def pop(vol=0.35):  # 이어폰 '뽁'
    x = sine(1400, 260, 0.07, 0.025, 0.0005); c = filt(noise(0.01), 'highpass', 2000) * env(int(0.01 * SR), 0.0002, 0.003) * 0.6
    x[:len(c)] += c; return x * vol
def ding(vol=0.3):
    a = sine(1318, 1318, 0.18, 0.08) * 0.5; b = sine(1760, 1760, 0.35, 0.15) * 0.5
    x = np.zeros(int(0.5 * SR)); x[:len(a)] += a; o = int(0.11 * SR); x[o:o + len(b)] += b; return x * vol
def tap(vol=0.18):
    n = int(0.03 * SR); return filt(noise(0.03), 'bandpass', [1500, 6000], 2) * env(n, 0.0003, 0.006) * vol
def whoosh(dur=0.9, vol=0.25):
    n = noise(dur); t = np.linspace(0, 1, len(n))
    x = filt(n, 'bandpass', [300, 2500], 2) * np.sin(np.pi * t) ** 2; return x / (np.abs(x).max() + 1e-9) * vol
def stamp(vol=0.6):
    s = sine(110, 45, 0.5, 0.09, 0.001); n = filt(noise(0.2), 'lowpass', 1200) * env(int(0.2 * SR), 0.0005, 0.03)
    x = np.zeros(int(0.5 * SR)); x += s; x[:len(n)] += n * 0.8; return x / (np.abs(x).max() + 1e-9) * vol
def blip(f, vol=0.08): return sine(f, f, 0.08, 0.04) * vol
def beat(dur, bpm=86, vol=0.2):  # 이어폰 속 로파이 비트
    out = np.zeros(int(dur * SR) + SR); step = 60 / bpm / 2
    kick = sine(130, 45, 0.25, 0.08, 0.001)
    snare = filt(noise(0.18), 'bandpass', [900, 5000], 2) * env(int(0.18 * SR), 0.001, 0.05) * 0.45
    hat = filt(noise(0.04), 'highpass', 6500) * env(int(0.04 * SR), 0.0005, 0.01) * 0.25
    chord = [220, 261.6, 329.6, 392]; pad = sum(sine(f, f, step * 8, None, 0.2) for f in chord) * 0.06
    i = 0; t = 0
    while t < dur:
        p = int(t * SR)
        if i % 8 in (0, 5): out[p:p + len(kick)] += kick
        if i % 8 in (2, 6): out[p:p + len(snare)] += snare
        out[p:p + len(hat)] += hat
        if i % 8 == 0: seg = pad * np.sin(np.linspace(0, np.pi, len(pad))) ** 0.5; out[p:p + len(seg)] += seg[:len(out) - p]
        i += 1; t += step
    out = filt(out[:int(dur * SR)], 'lowpass', 4500)
    return out / (np.abs(out).max() + 1e-9) * vol

def place(buf, x, t):
    p = int(t * SR)
    if p >= len(buf): return
    n = min(len(x), len(buf) - p); buf[p:p + n] += x[:n]

def click(vol=0.25):  # 프로젝터 슬라이드 넘김
    n = int(0.05 * SR); x = filt(noise(0.05), 'bandpass', [800, 4000], 2) * env(n, 0.0003, 0.008)
    return np.concatenate([x, np.zeros(int(0.03 * SR)), x * 0.6]) * vol
def sparkle(vol=0.12):
    x = np.zeros(int(0.6 * SR))
    for i, f in enumerate([2093, 2637, 3136, 4186]): s = sine(f, f, 0.35, 0.1) * 0.5; o = int(i * 0.05 * SR); x[o:o + len(s)] += s
    return x * vol
def stick(vol=0.4):  # 계급장 '착'
    n = filt(noise(0.06), 'bandpass', [600, 3500], 2) * env(int(0.06 * SR), 0.0003, 0.012)
    t = sine(240, 120, 0.08, 0.03, 0.0005) * 0.6; x = np.zeros(int(0.1 * SR)); x[:len(n)] += n; x[:len(t)] += t
    return x / (np.abs(x).max() + 1e-9) * vol
def scribble(dur, vol=0.08):
    x = filt(noise(dur), 'bandpass', [2500, 7000], 2); t = np.arange(len(x)) / SR
    return x * (0.5 + 0.5 * np.abs(np.sin(t * 2 * np.pi * 3.3))) / (np.abs(x).max() + 1e-9) * vol
def drum(vol=0.25):  # 군대 북 '둥'
    return sine(95, 55, 0.5, 0.15, 0.002) * vol + filt(noise(0.1), 'lowpass', 400) * env(int(0.1 * SR), 0.001, 0.02) * vol * 0.4 if False else \
        np.concatenate([sine(95, 55, 0.5, 0.15, 0.002) * vol])
def fanfare(vol=0.12):  # 소박한 나팔
    x = np.zeros(int(1.4 * SR))
    for i, f in enumerate([392, 523.3, 659.3, 784]):
        a = sine(f, f, 0.5 if i < 3 else 0.8, 0.4); h = sine(f * 2, f * 2, len(a) / SR, 0.3) * 0.3; o = int(i * 0.16 * SR); x[o:o + len(a)] += a + h
    return filt(x, 'lowpass', 2500) * vol

def megaphone_fx(x):
    y = filt(x, 'bandpass', [450, 3400], 4); y = np.tanh(y * 3.0) * 0.55
    return y / (np.abs(y).max() + 1e-9) * 0.9
def sizzle(dur, vol=0.05):
    n = filt(noise(dur), 'bandpass', [2500, 9000], 2); t = np.arange(len(n)) / SR
    crack = (rs.random(len(n)) > 0.9993) * rs.standard_normal(len(n)) * 3
    x = n * (0.6 + 0.4 * np.sin(t * 7.3) ** 2) + filt(crack, 'highpass', 3000)
    return x / (np.abs(x).max() + 1e-9) * vol
def ting(vol=0.35):
    a = sine(2350, 2300, 0.9, 0.35, 0.0005); b = sine(3720, 3680, 0.7, 0.25, 0.0005) * 0.5
    x = np.zeros(int(0.9 * SR)); x += a; x[:len(b)] += b; return x * vol
def clap(vol=0.25):
    out = np.zeros(int(1.0 * SR))
    for i in range(4):
        c = filt(noise(0.06), 'bandpass', [900, 4000], 2) * env(int(0.06 * SR), 0.0005, 0.012); o = int(i * 0.2 * SR); out[o:o + len(c)] += c
    return out / (np.abs(out).max() + 1e-9) * vol
def screech(vol=0.12):  # 확성기 하울링 '삐-'
    return filt(sine(2900, 3100, 0.45, None, 0.02) * env(int(0.45 * SR), 0.03, 0.3), 'bandpass', [2000, 4000], 2) * vol
def thump(vol=0.4):  # 확성기 발사 '퐁'
    x = sine(180, 70, 0.3, 0.08, 0.001); n = filt(noise(0.15), 'lowpass', 700) * env(int(0.15 * SR), 0.001, 0.03) * 0.5
    x[:len(n)] += n; return x * vol
def steps(dur, rate=0.11, vol=0.1):
    out = np.zeros(int(dur * SR))
    for i in range(int(dur / rate)):
        s = filt(noise(0.04), 'lowpass', 900) * env(int(0.04 * SR), 0.0005, 0.01); o = int((i * rate + rs.random() * 0.04) * SR)
        out[o:o + len(s)] += s[:len(out) - o] * (0.6 + 0.4 * rs.random())
    return out / (np.abs(out).max() + 1e-9) * vol
def scratch(vol=0.25):  # 급정거 '끽'
    return filt(sine(1800, 600, 0.35, None, 0.005) * env(int(0.35 * SR), 0.005, 0.2) + noise(0.35) * 0.3 * env(int(0.35 * SR), 0.005, 0.15), 'bandpass', [400, 4000], 2) * vol

# ===================== ENTP 전쟁편 =====================
def rd(name, rate=1.0, tempo=1.2):
    af = (f'asetrate={int(48000*rate)},aresample=48000,' if rate != 1 else '') + f'atempo={tempo}'
    raw = subprocess.check_output(['ffmpeg','-loglevel','error','-i',f'lines/{name}.wav','-af',af,'-f','f32le','-ac','1','-ar',str(SR),'-'])
    return np.frombuffer(raw, np.float32).copy()
def trim(x):
    a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x
# 군중 '쏴 봐~ 쏴 보라고~' (아군 목소리 여러 겹)
parts = []
for n in ['sc', 'fc']:
    for rate, g in [(1.0, 1.0), (0.9, 0.6), (1.1, 0.55), (0.84, 0.4), (1.16, 0.35), (0.96, 0.5)]:
        parts.append((rd(n, rate, 1.15) * g, rs.uniform(0, 0.12)))
L = max(len(x) + int(d * SR) for x, d in parts); out = np.zeros(L)
for x, d in parts: o = int(d * SR); out[o:o + len(x)] += x
save(out / np.abs(out).max() * 0.9, 'lines/crowd.wav')
# 삑사리: '경고다!'를 확 높여서 갈라지게
x = trim(rd('e5b', 1.55, 0.85)); t = np.arange(len(x)) / SR
x = x * (1 + 0.25 * np.sin(2 * np.pi * 9 * t))
save(x / (np.abs(x).max() + 1e-9) * 0.9, 'lines/e5p.wav')

def blank(vol=0.5):  # 공포탄: 총성 + 하늘로 퍼지는 메아리
    g = gunshot(vol); e = filt(noise(1.2), 'lowpass', 600) * env(int(1.2 * SR), 0.01, 0.35) * vol * 0.35
    x = np.zeros(int(1.3 * SR)); x[:len(g)] += g; x[:len(e)] += e; return x
def cock(vol=0.35):  # 철컥
    a = filt(noise(0.03), 'bandpass', [1500, 6000], 2) * env(int(0.03 * SR), 0.0002, 0.006)
    b = filt(noise(0.05), 'bandpass', [700, 3000], 2) * env(int(0.05 * SR), 0.0002, 0.01)
    x = np.zeros(int(0.2 * SR)); x[:len(a)] += a; o = int(0.09 * SR); x[o:o + len(b)] += b
    return x / (np.abs(x).max() + 1e-9) * vol
def squeeze(vol=0.35):  # 케첩 '뿌직'
    n = 0.45; w = filt(noise(n), 'lowpass', 900) * env(int(n * SR), 0.005, 0.15)
    s = sine(260, 90, n, 0.12, 0.003) * 0.6; t = np.arange(len(w)) / SR
    x = (w + s[:len(w)]) * (0.6 + 0.4 * np.abs(np.sin(t * 2 * np.pi * 11)))
    return x / (np.abs(x).max() + 1e-9) * vol
def heart(dur, bpm=96, vol=0.3):  # 긴장 심장박동
    out = np.zeros(int(dur * SR)); step = 60 / bpm
    for i in range(int(dur / step)):
        for k, g in ((0, 1.0), (0.17, 0.7)):
            s = sine(62, 42, 0.18, 0.06, 0.002) * g; o = int((i * step + k) * SR)
            if o < len(out): out[o:o + len(s)] += s[:len(out) - o]
    return out * vol
def drone(dur, vol=0.06):  # 긴장 저음
    t = np.arange(int(dur * SR)) / SR; x = sum(np.sin(2 * np.pi * f * t) for f in (55, 58.3, 82.4))
    return x * np.minimum(1, t / 1.0) * vol / 3
def giggle(vol=0.12):
    x = np.zeros(int(0.9 * SR))
    for i in range(5): s = sine(700 + i * 30, 500, 0.09, 0.04) * (1 - i * 0.12); o = int(i * 0.15 * SR); x[o:o + len(s)] += s
    return filt(x, 'lowpass', 2500) * vol
def tick(vol=0.12): return filt(noise(0.02), 'bandpass', [2000, 6000], 2) * env(int(0.02 * SR), 0.0002, 0.004) * vol
def boing(vol=0.25): return sine(180, 520, 0.25, 0.12, 0.002) * vol

SC = [
    [('n1', 0.0), ('g1', 0.35), ('s1', 1.1), ('g2', 0.15), ('g3', 0.4)],
    [('e1', 0.3), ('s2', 0.7), ('s3', 2.1), ('e2', 0.35), ('n2', 0.3), ('crowd', 0.35)],
    [('f1', 1.1), ('s4', 1.0), ('f2', 0.35), ('s5', 0.8), ('n3', 0.9)],
    [('s6', 1.9), ('g4', 0.3), ('e3', 0.3), ('g5', 1.5), ('e4', 0.15), ('n4', 0.9)],
    [('e5a', 0.5), ('e5p', 0.15), ('s7', 0.9), ('e6', 2.6), ('n5', 0.4)],
    [('g6', 1.8), ('e7', 0.25), ('n6', 0.6)],
]
POST = {1: 0.7, 2: 0.3, 3: 0.4, 4: 0.4, 5: 1.9}
MEGA = {'g3', 'e1', 'g4', 'e5a', 'e5p'}
RAW = {'crowd', 'e5p'}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        if name in RAW: x = trim(rd(name, 1.0, 1.0))
        elif name == 's7': x = trim(rd(name, 1.0, 1.0))
        elif name[0] == 'n': x = trim(rd(name, 1.0, 1.2))
        else: x = load(name)
        if name in MEGA: x = megaphone_fx(x)
        if name == 'crowd': x = x * 0.8
        t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st in xs: place(v, x, st)
    save(v, f'audio/v{si + 1}.wav')
    info.append({'len': round(T, 3), 'lines': starts})

LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    end = lambda name, k=0: LEAD + L[name][0] + L[name][1] + k
    b = np.zeros(int(T * SR))
    b += wind(T, 0.04)
    if si == 0:
        for k in range(4): place(b, drum(0.4), 0.1 + k * 0.6)
        place(b, drone(vt('s1', -0.6), 0.07), 0)
        ev['skip'] = round(end('g1', 0.3), 3); place(b, whoosh(0.5, 0.2), ev['skip'])
        ev['yawn'] = round(end('s1', 0.0), 3)
        ev['mega'] = round(vt('g3', -0.35), 3); place(b, screech(0.08), ev['mega'] + 0.1)
    elif si == 1:
        place(b, screech(0.07), LEAD + 0.05)
        ev['look'] = round(vt('s2', -0.5), 3)
        ev['step'] = round(end('s2', 0.15), 3)
        place(b, heart(L['s3'][0] - L['s2'][0] - L['s2'][1], 100, 0.35), ev['step'])
        for i in range(3): place(b, cock(0.3), ev['step'] + 0.35 + i * 0.07)
        ev['land'] = round(vt('s3', -0.35), 3); place(b, stamp(0.35), ev['land'])
        ev['all'] = round(vt('crowd', -0.25), 3); place(b, whoosh(0.4, 0.15), ev['all'])
        ev['shake'] = round(end('crowd', 0.05), 3)
    elif si == 2:
        place(b, drone(vt('f1') + 0.2, 0.08), 0)
        ev['load'] = round(LEAD + 0.15, 3); place(b, cock(0.45), ev['load'] + 0.5)
        ev['shot'] = round(end('f1', 0.15), 3); place(b, blank(0.55), ev['shot'])
        place(b, whoosh(1.0, 0.18), ev['shot'] + 0.15)
        ev['run'] = round(vt('f2', -0.35), 3)
        ev['up'] = round(vt('s5', -0.5), 3); place(b, boing(0.3), ev['up']); place(b, squeeze(0.45), ev['up'] + 0.25)
        place(b, sparkle(0.15), end('s5', 0.05))
        ev['wide'] = round(vt('n3', -0.3), 3)
        for i in range(8): place(b, squeeze(0.12), ev['wide'] + 0.3 + i * 0.55); place(b, giggle(0.06), ev['wide'] + 0.5 + i * 0.55)
    elif si == 3:
        ev['bino'] = round(LEAD + 0.05, 3)
        ev['table'] = round(vt('e3', -0.25), 3); place(b, whoosh(0.4, 0.15), ev['table'])
        ev['flurry'] = round(end('e3', 0.1), 3)
        for i in range(10): place(b, blip(600 + (i % 4) * 140, 0.08), ev['flurry'] + i * 0.13)
        ev['swap'] = round(vt('g5', 1.4), 3); place(b, whoosh(0.4, 0.15), ev['swap'])
        ev['lapse'] = round(vt('n4', -0.6), 3)
        for i in range(24): place(b, tick(0.1), ev['lapse'] + i * 0.12)
        ev['cold'] = round(vt('n4', 1.4), 3)
    elif si == 4:
        place(b, fanfare(0.08), LEAD + 0.0)
        ev['crack'] = round(vt('e5p'), 3); place(b, screech(0.1), ev['crack'] + 0.05)
        ev['meme'] = round(end('s7', 0.35), 3); place(b, whoosh(0.5, 0.2), ev['meme'])
        for i in range(6): place(b, blip(1200, 0.05), ev['meme'] + 0.2 + i * 0.12)
        for i in range(4): place(b, giggle(0.07), ev['meme'] + 0.4 + i * 0.5)
        ev['smirk'] = round(vt('e6', 1.1), 3)
        ev['prof'] = round(vt('n5', -0.35), 3); place(b, ding(0.2), ev['prof'] + 0.1)
    elif si == 5:
        ev['leave'] = round(LEAD + 0.2, 3)
        for k in range(6): place(b, steps(0.8, 0.12, 0.06), LEAD + 0.2 + k * 0.4)
        ev['alone'] = round(vt('g6', -0.4), 3)
        ev['turn'] = round(end('e7', 0.25), 3)
        ev['end'] = round(end('n6', 0.5), 3); place(b, fanfare(0.1), ev['end'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['ev'])
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
