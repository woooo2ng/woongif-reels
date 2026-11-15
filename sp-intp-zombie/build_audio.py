# INTP 좀비편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def load(name):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'silenceremove=stop_periods=-1:stop_duration=0.25:stop_threshold=-42dB:stop_silence=0.2,atempo='+('1.15' if name[0]=='n' else '1.08' if name[0]=='z' else '1.1'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
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

_load = load
def load(name):
    if name[0] != 'z': return _load(name)
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'asetrate=39000,aresample=48000,aecho=0.6:0.5:35:0.25', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    x = np.tanh(x * 2.2) * 0.55  # 쉰 목소리 느낌
    a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x

# ---------- 좀비편 효과음 ----------
def heartbeat(vol=0.5):  # 둥-둥
    a = sine(62, 38, 0.22, 0.06, 0.002); b = sine(55, 34, 0.2, 0.05, 0.002) * 0.7
    x = np.zeros(int(0.5 * SR)); x[:len(a)] += a; o = int(0.17 * SR); x[o:o + len(b)] += b
    return filt(x, 'lowpass', 160) * vol * 1.6
def hb_track(dur, t0, t1, bpm0, bpm1, vol=0.5):
    out = np.zeros(int(dur * SR)); t = t0; times = []
    while t < t1:
        k = (t - t0) / max(1e-6, t1 - t0); bpm = bpm0 + (bpm1 - bpm0) * k
        place(out, heartbeat(vol), t); times.append(round(t, 3)); t += 60 / bpm
    return out, times
def scrape(dur, vol=0.12):  # 현악기 긁는 소리 + 불협 트레몰로
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t + rs.random() * 6) for f in (880, 932, 1245)) / 3
    x *= 0.6 + 0.4 * np.sin(2 * np.pi * 11 * t)
    sc = filt(noise(dur), 'bandpass', [2500, 6000], 2) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * t)) * 0.4
    y = (x + sc) * np.minimum(1, t / 1.5); return y / (np.abs(y).max() + 1e-9) * vol
def drone(dur, vol=0.18, f=55):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.7 * np.sin(2 * np.pi * (f * 1.06) * t) + 0.3 * np.sin(2 * np.pi * f * 2.02 * t)
    x = x * np.minimum(1, t / 1.0); return x / (np.abs(x).max() + 1e-9) * vol
def siren(dur, vol=0.07):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 750 + 300 * np.sin(2 * np.pi * 0.45 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sign(np.sin(ph)) * 0.3 + np.sin(ph); x = filt(x, 'lowpass', 1800)
    return x / (np.abs(x).max() + 1e-9) * vol
def buzz(vol=0.25):
    x = np.zeros(int(0.9 * SR))
    for k in (0, 0.45):
        s = np.sign(sine(170, 170, 0.3, None)) * env(int(0.3 * SR), 0.005); place(x, filt(s, 'lowpass', 600) * vol, k)
    return x
def thud(vol=0.5): return filt(sine(90, 50, 0.4, 0.08, 0.001) + filt(noise(0.05), 'lowpass', 800) * env(int(0.05 * SR), 0.0005, 0.01)[:int(0.4 * SR)].sum() * 0, 'lowpass', 400) * vol
def hum(dur, vol=0.03):
    n = int(dur * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 60 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)) * vol
def step(vol=0.12): return filt(noise(0.08), 'bandpass', [150, 1200], 2) * env(int(0.08 * SR), 0.001, 0.02) * vol
def pad(dur, freqs, vol=0.1, att=0.6, rel=0.8):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t) + 0.15 * np.sin(2 * np.pi * f * 3 * t) for f in freqs)
    e = np.minimum(1, t / att) * np.minimum(1, (dur - t) / rel).clip(0, 1)
    return x * e / len(freqs) * vol
def epic(dur, vol=0.22):  # 차오르는 웅장한 BGM
    n = int(dur * SR); t = np.arange(n) / SR
    x = pad(dur, [130.8, 196, 261.6, 329.6], 1, dur * 0.8, 0.02) + pad(dur, [65.4], 0.8, dur * 0.8, 0.02)
    tim = np.zeros(n); bt = 0
    while bt < dur: place(tim, sine(80, 40, 0.5, 0.12) * (0.3 + 0.7 * bt / dur), bt); bt += 0.5
    y = x * (t / dur) ** 1.5 + tim * 0.6; return y / (np.abs(y).max() + 1e-9) * vol
def birds(dur, vol=0.05):
    out = np.zeros(int(dur * SR)); t = 0.3
    while t < dur - 0.5:
        for k in range(rs.integers(2, 4)): place(out, sine(3200 + rs.random() * 900, 2500 + rs.random() * 900, 0.09, 0.04) * vol, t + k * 0.12)
        t += 1.2 + rs.random() * 1.5
    return out
def calm(dur, vol=0.09):
    seq = [[220, 277, 330], [196, 247, 294], [175, 220, 262], [196, 247, 294]]; out = np.zeros(int(dur * SR)); seg = 2.0
    for i in range(int(dur / seg) + 1): place(out, pad(seg + 0.5, seq[i % 4], vol, 0.4, 0.5), i * seg)
    return out[:int(dur * SR)]

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('n1', 0.0), ('a1', 0.45), ('s1', 0.7), ('n2', 0.55)],
    [('n3', 0.9), ('s2', 0.6)],
    [('z3', 3.3), ('z1', 0.15), ('s3', 0.55), ('n4', 1.2)],
    [('s4', 2.3), ('z2', 0.35), ('s5', 0.4), ('n5', 0.6)],
    [('s7', 2.4), ('n6', 0.45), ('s8', 0.6), ('z5', 0.35)],
    [('n7', 1.0)],
]
POST = {1: 0.9, 3: 0.6, 4: 0.9, 5: 1.6}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        x = load(name)
        if name == 'z3': x = fadeout(x[:int(2.7 * SR)], 0.4)
        t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t, name)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st, name in xs: place(v, x * (0.8 if name[0] == 'z' else 1.0), st)
    save(v, f'audio/v{si + 1}.wav')
    info.append({'len': round(T, 3), 'lines': starts})

LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    ve = lambda name, k=0: LEAD + L[name][0] + L[name][1] + k
    b = np.zeros(int(T * SR)); N = len(b); tt = np.arange(N) / SR
    if si == 0:
        b += siren(T, 0.06) * np.clip(1 - (tt - vt('s1') + 1) / 1.0, 0.25, 1)
        D = {'alert': vt('a1', -0.35), 'bed': vt('s1', -0.7), 'win': vt('n2', 0.1)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, buzz(0.3), D['alert']); place(b, drone(vt('s1') - 0.2, 0.08, 49), 0.0)
        place(b, fadeout(whoosh(0.5, 0.12)), ve('s1', 0.2))  # 이불 덮기
    elif si == 1:
        D = {'app': LEAD + 0.15, 'fridge': vt('n3', 1.4), 'hood': ve('n3', 0.1)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, ding(0.15), D['app']); place(b, hum(1.8, 0.03), D['fridge']); place(b, whoosh(0.4, 0.12), D['fridge'])
        place(b, epic(T - D['hood'], 0.16), D['hood'])
    elif si == 2:
        ENC = vt('z3', -1.0); PASS = ve('s3', 0.35)
        D = {'enc': ENC, 'sniff': vt('z3', 0.2), 'pass': PASS, 'ding': PASS + 0.55}
        ev.update({k: round(x, 3) for k, x in D.items()})
        h, times = hb_track(T, 0.1, ENC, 70, 115, 0.5); b += h
        h2, times2 = hb_track(T, ENC + 0.2, PASS, 58, 58, 0.62); b += h2; ev['beats'] = times + times2
        k1 = np.clip((ENC - tt) / 0.05, 0, 1)  # 마주치는 순간 BGM 뚝
        b += (scrape(T, 0.1) + drone(T, 0.16, 46)) * k1
        for i in range(int((ENC - 0.3) / 0.42)): place(b, step(0.1), 0.3 + i * 0.42)
        place(b, gunshot(0.0), 0)
        place(b, filt(whoosh(0.3, 0.25), 'lowpass', 1500), ENC - 0.05)  # 휙 마주침 스팅
        place(b, sine(150, 140, 1.2, 0.5) * 0.25, ENC - 0.05)
        place(b, sine(330, 220, 0.6, 0.25) * 0.12, PASS)  # 맥 빠지는 '뿌우'
        place(b, ding(0.3), D['ding'])
    elif si == 3:
        TURN = vt('s4', -0.5); LAB = vt('n5', -0.15)
        D = {'turn': TURN, 'lab': LAB}; ev.update({k: round(x, 3) for k, x in D.items()})
        for i in range(int((TURN - 0.3) / 0.5)): place(b, step(0.09), 0.3 + i * 0.5 + 0.22)  # 등 뒤 발소리
        h, times = hb_track(T, 0.25, TURN + 0.3, 80, 105, 0.45); b += h; ev['beats'] = times
        b += drone(T, 0.12, 46) * np.clip((TURN + 0.3 - tt) / 0.05, 0, 1)
        place(b, calm(T - LAB, 0.07), LAB)
        for i in range(8): place(b, tap(0.12), LAB + 0.4 + i * 0.27)  # 화이트보드 마커
    elif si == 4:
        EU = LEAD + 0.5; CUT = vt('s7', -0.25)
        D = {'eureka': EU, 'cut': CUT, 'cross': vt('n6', 0.15), 'talk': vt('s8', -0.45), 'yay': vt('z5')}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, ding(0.3), EU)
        place(b, epic(CUT - EU + 0.02, 0.24), EU)
        place(b, filt(noise(0.25), 'bandpass', [1500, 5000], 2) * env(int(0.25 * SR), 0.005, 0.08) * 0.12, D['cross'])  # 지우개 쓱
        for i in range(10): place(b, tap(0.12), D['cross'] + 0.5 + i * 0.22)
        place(b, calm(T - D['talk'], 0.07), D['talk'])
        place(b, ding(0.25), D['yay'] + 0.1)
    elif si == 5:
        b += birds(T, 0.05) + calm(T, 0.06)
        BK = vt('n7', 2.55); ev['books'] = round(BK, 3); place(b, whoosh(0.5, 0.15), BK - 0.15); place(b, ding(0.25), BK + 0.2)
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], {k: v for k, v in x['ev'].items() if k != 'beats'})
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
