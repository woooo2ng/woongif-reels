# [영어판] ENFP vs INFP 전쟁편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성 (헬퍼는 ESTJ 전쟁편과 동일)
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

def rd(name, rate=1.0):
    af = f'asetrate={int(48000*rate)},aresample=48000' if rate != 1 else 'anull'
    raw = subprocess.check_output(['ffmpeg','-loglevel','error','-i',f'lines/{name}.wav','-af',af,'-f','f32le','-ac','1','-ar',str(SR),'-'])
    return np.frombuffer(raw, np.float32).copy()
# ENFP 군중 '와아아!!' (장군·병사 환호 × 피치 변형)
parts = []
for n in ['gc', 'ec']:
    for rate, g in [(1.0, 1.0), (0.9, 0.6), (1.1, 0.55), (0.84, 0.4), (1.17, 0.4), (0.96, 0.5), (1.05, 0.45)]:
        parts.append((rd(n, rate) * g, rs.uniform(0, 0.25)))
L = max(len(x) + int(d * SR) for x, d in parts); out = np.zeros(L)
for x, d in parts: o = int(d * SR); out[o:o + len(x)] += x
save(out / np.abs(out).max() * 0.85, 'lines/crowd.wav')

def dingdong(vol=0.3):
    a = sine(784, 784, 0.6, 0.35, 0.002) + sine(1568, 1568, 0.6, 0.2) * 0.2
    b = sine(622, 622, 0.9, 0.45, 0.002) + sine(1244, 1244, 0.9, 0.25) * 0.2
    x = np.zeros(int(1.5 * SR)); x[:len(a)] += a; o = int(0.45 * SR); x[o:o + len(b)] += b; return x * vol
def heartbeat(dur, bpm=72, vol=0.35):
    out = np.zeros(int(dur * SR)); s = sine(60, 40, 0.18, 0.06, 0.003)
    t = 0
    while t < dur - 0.4:
        place(out, s, t); place(out, s * 0.7, t + 0.22); t += 60 / bpm
    return out * vol
def rumble(dur, vol=0.12):
    b = filt(brown(dur + 1), 'lowpass', 120)[:int(dur * SR)]; return b / (np.abs(b).max() + 1e-9) * vol
def plane(dur, vol=0.12):
    n = filt(brown(dur + 1), 'bandpass', [90, 700], 2)[:int(dur * SR)]; t = np.arange(len(n)) / SR
    x = n * np.sin(np.pi * np.clip(t / dur, 0, 1)) + sine(110, 96, dur, None, 0.3)[:len(n)] * 0.15 * np.sin(np.pi * t / dur)
    return x / (np.abs(x).max() + 1e-9) * vol
def ping(vol=0.12, f=1760):
    a = sine(f, f, 0.12, 0.05); b = sine(f * 1.5, f * 1.5, 0.15, 0.06)
    x = np.zeros(int(0.25 * SR)); x[:len(a)] += a; o = int(0.07 * SR); x[o:o + len(b)] += b; return x * vol
def flap(vol=0.12):
    out = np.zeros(int(1.2 * SR))
    for i in range(6):
        c = filt(noise(0.08), 'bandpass', [300, 1800], 2) * env(int(0.08 * SR), 0.01, 0.03); o = int(i * 0.18 * SR); out[o:o + len(c)] += c
    return out / (np.abs(out).max() + 1e-9) * vol
def chirp(vol=0.06):
    out = np.zeros(int(0.6 * SR))
    for i in range(3): s = sine(3200, 4200, 0.07, 0.03); o = int(i * 0.12 * SR); out[o:o + len(s)] += s
    return out * vol
def thud(vol=0.3):
    s = sine(120, 50, 0.3, 0.07, 0.001); n = filt(noise(0.1), 'lowpass', 600) * env(int(0.1 * SR), 0.001, 0.02) * 0.6
    s[:len(n)] += n; return s * vol
def sob(vol=0.0): return np.zeros(10)

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('n1', 0.2), ('crowd', 0.5), ('g1', -0.9), ('n2', 0.5), ('k1', 0.4)],
    [('e1', 1.5), ('n3', 0.6)],
    [('e4', 0.3), ('s4', 0.2), ('s5', 0.9), ('s6', 1.3), ('crowd', 0.25), ('n9', 0.35)],
    [('e2', 0.4), ('s1', 0.3), ('s2', 0.25), ('n5', 1.0)],
    [('k2', 0.3), ('g2', 3.7), ('n6', 0.5)],
    [('e3', 0.3), ('g3', 0.1), ('crowd', -0.3), ('s3', 3.4), ('n7', 0.8), ('n8', 1.0)],
]
POST = {0: 0.3, 2: 0.2, 3: 0.2, 4: 0.3, 5: 1.6}
SPEED = {'n8': 1.0, 'crowd': 1.0, 'n7': 1.05, 'n1': 1.05}
def loadv(name):
    sp = SPEED.get(name, 1.1)
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', f'atempo={sp}' if sp != 1 else 'anull', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        x = loadv(name)
        if name == 'crowd': x = x * 0.55
        t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t))
        t += len(x) / SR if name != 'crowd' else 0.6
    T = max(t, max(st + len(x) / SR for x, st in xs)) + POST.get(si, 0)
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
    if si == 0:
        b += wind(T, 0.03); place(b, heartbeat(end('n1', 0.6), 80, 0.35), 0.1); place(b, rumble(end('n1', 0.8), 0.14), 0.0)
        ev['reveal'] = round(vt('crowd', -0.2), 3); place(b, steps(4.5, 0.06, 0.12), ev['reveal'])
        ev['n2'] = round(vt('n2'), 3); ev['k1'] = round(vt('k1', -0.25), 3)
        place(b, sparkle(0.12), vt('n2', 1.6))
    elif si == 1:
        b += wind(T, 0.015)
        ev['dark'] = 0.45; place(b, click(0.35), 0.45)
        ev['ding'] = 1.0; place(b, dingdong(0.32), 1.0)
        ev['ding2'] = round(end('e1', 0.05), 3)
        for k in range(3): place(b, dingdong(0.26), ev['ding2'] + k * 0.38)
    elif si == 2:
        b += wind(T, 0.02)
        ev['pass'] = round(end('e4', 0.0), 3); ev['mic'] = round(vt('s5', -0.55), 3)
        # 마이크가 다가올수록 빨라지는 심장 박동 → 마이크 받는 순간 뚝
        tt = ev['pass']; bpm = 70
        while tt < ev['mic'] - 0.2:
            place(b, sine(60, 40, 0.18, 0.06, 0.003) * 0.4, tt); place(b, sine(60, 40, 0.18, 0.06, 0.003) * 0.28, tt + 0.2); bpm += 9; tt += 60 / bpm
        place(b, tap(0.3), ev['mic'])
        ev['quiet'] = round(end('s5', 0.1), 3)
        for k in range(3): place(b, chirp(0.035) * 0.8, ev['quiet'] + 0.2 + k * 0.45)
        ev['clap'] = round(vt('crowd', 0.0), 3); place(b, clap(0.35), ev['clap']); place(b, clap(0.3), ev['clap'] + 0.8)
        ev['n9'] = round(vt('n9'), 3)
    elif si == 3:
        b += wind(T, 0.025)
        ev['cut'] = round(end('s2', 0.15), 3); place(b, whoosh(0.4, 0.15), ev['cut'] - 0.1)
        for k in range(12): place(b, stick(0.18), ev['cut'] + 0.25 + k * 0.13)
        place(b, sparkle(0.1), ev['cut'] + 1.9)
    elif si == 4:
        b += wind(T, 0.02); place(b, scribble(2.8, 0.06), vt('k2', 0.2) + 2.2)
        ev['write'] = round(end('k2', 0.1), 3); ev['tear'] = round(ev['write'] + 1.8, 3)
        ev['fly'] = round(ev['write'] + 2.4, 3); place(b, flap(0.14), ev['fly'])
        ev['read'] = round(vt('g2', -0.5), 3)
        ev['pile'] = round(vt('n6', -0.15), 3)
        for k in range(14): place(b, thud(0.08), ev['pile'] + k * 0.16)
    elif si == 5:
        b += wind(T, 0.025)
        ev['run'] = round(end('g3', 0.0), 3); place(b, steps(2.2, 0.05, 0.13), ev['run'])
        ev['calm'] = round(ev['run'] + 1.3, 3)
        for k in range(4): place(b, chirp(0.05), ev['calm'] + 0.3 + k * 0.9)
        ev['day'] = round(vt('s3', -1.4), 3)
        ev['wide'] = round(vt('n7', -0.1), 3); place(b, stamp(0.4), vt('n7', 0.15))
        ev['last'] = round(vt('n8', -0.35), 3)
        ev['end'] = round(end('n8', 0.5), 3); place(b, chirp(0.04), ev['end'] - 0.2)
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], x['ev'])
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
