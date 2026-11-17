# ENFP 좀비편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성
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
    if name == 'q1':
        raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', 'lines/q1.wav', '-af', 'atempo=1.1', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
        x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]; return x[max(0, a[0] - 600):a[-1] + 2400]
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
def segs(x, thr=0.012, gap=0.15):
    # 말소리 구간 시작(초) 목록 — 자막 전환 시각용
    w = int(0.01 * SR); e = np.array([np.abs(x[i:i + w]).max() for i in range(0, len(x) - w, w)]) > thr
    out = []; quiet = 999
    for i, on in enumerate(e):
        if on:
            if quiet * 0.01 >= gap: out.append(round(i * 0.01, 3))
            quiet = 0
        else: quiet += 1
    return out
def knock(vol=0.45):  # 똑똑
    x = np.zeros(int(0.45 * SR))
    for k in (0, 0.16):
        s = filt(noise(0.06), 'bandpass', [180, 900], 2) * env(int(0.06 * SR), 0.0005, 0.012) + sine(210, 150, 0.06, 0.02) * 0.6
        place(x, s * vol, k)
    return x
def tick(vol=0.08): return filt(noise(0.02), 'highpass', 3000) * env(int(0.02 * SR), 0.0002, 0.004) * vol
def murmur(dur, vol=0.12):  # 웅성웅성
    n = noise(dur); t = np.arange(len(n)) / SR
    x = filt(n, 'bandpass', [250, 1400], 2) * (0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 3.1 * t) * np.sin(2 * np.pi * 1.7 * t + 1)))
    return x / (np.abs(x).max() + 1e-9) * vol
def bang(vol=0.7):
    x = boom(0.6); c = filt(noise(0.3), 'bandpass', [200, 3000], 2) * env(int(0.3 * SR), 0.0005, 0.05)
    x[:len(c)] += c * 0.8; return x / (np.abs(x).max() + 1e-9) * vol
def page(vol=0.12): return fadeout(filt(whoosh(0.22, 1), 'highpass', 1500)) * vol
def kakao(vol=0.16):
    a = sine(1180, 1180, 0.07, 0.04); b = sine(1560, 1560, 0.1, 0.05)
    x = np.zeros(int(0.22 * SR)); x[:len(a)] += a; o = int(0.08 * SR); x[o:o + len(b)] += b; return x * vol
def march(dur, bpm=128, vol=0.16):  # 우스꽝스러운 행진(튜바+스네어)
    out = np.zeros(int(dur * SR) + SR); st = 60 / bpm; i = 0; t = 0
    bass = [98, 147, 110, 147]
    while t < dur:
        p = int(t * SR)
        tu = sine(bass[i % 4], bass[i % 4], st * 0.5, 0.12, 0.004); tu = np.tanh(tu * 2) * 0.6; out[p:p + len(tu)] += tu
        sn = filt(noise(0.1), 'bandpass', [1200, 5000], 2) * env(int(0.1 * SR), 0.001, 0.03) * 0.35
        q = int((t + st / 2) * SR); out[q:q + len(sn)] += sn
        i += 1; t += st
    return out[:int(dur * SR)] / (np.abs(out).max() + 1e-9) * vol
def cute(dur, vol=0.09):  # 통통 튀는 실로폰
    notes = [523, 659, 784, 659, 587, 698, 880, 698]; out = np.zeros(int(dur * SR)); t = 0; i = 0
    while t < dur - 0.3:
        place(out, (sine(notes[i % 8], notes[i % 8], 0.3, 0.09) + 0.3 * sine(notes[i % 8] * 2, notes[i % 8] * 2, 0.3, 0.05)) * vol, t); t += 0.25; i += 1
    return out
def thudk(vol=0.6): return filt(sine(70, 45, 0.35, 0.09, 0.001), 'lowpass', 300) * vol + 0
def popper(vol=0.35):
    c = filt(noise(0.12), 'highpass', 1500) * env(int(0.12 * SR), 0.0005, 0.025); return c * vol
def sad(dur, vol=0.07): return pad(dur, [220, 261.6, 329.6], vol, 0.8, 0.5)

def mixlines(names, shifts):
    # 여러 목소리를 겹쳐 떼창처럼 (피치 변형)
    xs = []
    for nm, rate in names:
        raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{nm}.wav', '-af', f'asetrate={int(48000 * rate)},aresample=48000', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
        x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]; xs.append(x[a[0]:a[-1] + 1200])
    n = max(len(x) + int(s * SR) for x, s in zip(xs, shifts)); out = np.zeros(n)
    for x, s in zip(xs, shifts): place(out, x, s)
    return out / (np.abs(out).max() + 1e-9) * 0.85
GROUP = {
    'L': lambda: mixlines([('e4', 1.0), ('j2', 1.0), ('e4', 1.12), ('j2', 0.9), ('e4', 0.93)], [0, 0.08, 0.2, 0.3, 0.12]),
    'G1': lambda: mixlines([('yc', 1.0), ('jc', 1.0), ('yc', 1.1), ('jc', 0.92), ('yc', 0.94)], [0, 0.04, 0.09, 0.13, 0.06]),
    'G1b': lambda: mixlines([('yc', 1.04), ('jc', 0.97), ('yc', 1.14), ('jc', 0.9), ('yc', 0.92), ('jc', 1.06), ('yc', 1.0)], [0, 0.05, 0.08, 0.12, 0.03, 0.1, 0.15]),
    'G2': lambda: mixlines([('yd', 1.0), ('jd', 1.0), ('yd', 1.1), ('jd', 0.92), ('yd', 0.94), ('jd', 1.07)], [0, 0.04, 0.09, 0.13, 0.06, 0.11]),
    'S': lambda: mixlines([('e5', 1.0), ('j3', 1.0), ('e5', 1.1), ('j3', 0.92), ('e5', 0.9)], [0, 0.05, 0.1, 0.14, 0.2]),
}

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('n1', 0.0), ('a1', 0.35), ('r1', 0.45), ('r2', 0.25), ('n2', 3.0)],
    [('e2', 0.5), ('n3', 9.6)],
    [('w1', 0.6), ('G1', 0.9), ('G1b', 1.7), ('g3', 1.7), ('G2', 1.3), ('z1', 0.5), ('n7', 1.35)],
    [('S', 0.15), ('z2', 2.6), ('e6', 0.3), ('n5', 0.35)],
    [('z4', 1.4), ('n6', 0.1)],
]
POST = {0: 0.2, 1: 0.9, 2: 0.5, 4: 2.2}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []; sg = {}
    for name, gap in lines:
        x = GROUP[name]() if name in GROUP else load(name)
        if name == 'z4': x = fadeout(x[:int(2.5 * SR)], 0.3)
        t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; sg[name] = segs(x); xs.append((x, t, name)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st, name in xs: place(v, x * (0.8 if name[0] == 'z' else 0.9 if name in GROUP else 1.0), st)
    save(v, f'audio/v{si + 1}.wav')
    info.append({'len': round(T, 3), 'lines': starts, 'segs': sg})

LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    ve = lambda name, k=0: LEAD + L[name][0] + L[name][1] + k
    b = np.zeros(int(T * SR)); N = len(b); tt = np.arange(N) / SR
    if si == 0:
        D = {'alert': vt('a1', -0.3), 'sms': ve('a1', 0.05), 'flood': vt('r2', 0.2), 'noreply': ve('r2', 1.25), 'hall': ve('r2', 1.95), 'room': vt('n2', 0.9)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += siren(T, 0.06) * np.clip((D['sms'] + 0.3 - tt) / 0.4, 0, 1)
        place(b, drone(D['sms'], 0.08, 49), 0.0); place(b, buzz(0.3), D['alert'])
        n = 0; t0 = D['sms'] + 0.2
        while t0 < D['noreply']:
            place(b, kakao(0.1 + 0.05 * (n % 2)), t0); n += 1; t0 += max(0.07, 0.45 - n * 0.04)
        place(b, sine(440, 300, 0.4, 0.15) * 0.12, D['noreply'])
        place(b, murmur(T - D['hall'], 0.05), D['hall']); place(b, cute(T - D['hall'], 0.06), D['hall'])
    elif si == 1:
        P0 = ve('e2', 0.3); D = {'p1': P0, 'p2': P0 + 3.1, 'p3': P0 + 5.4, 'p4': P0 + 7.3, 'flip': P0 + 9.5, 'pull': P0 + 10.6}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, cute(T, 0.06), 0.0)
        for k in ('p1', 'p2', 'p3', 'p4'): place(b, page(0.2), D[k])
        def scribble(t0, dur, vol=0.05):
            n = noise(dur); tt2 = np.arange(len(n)) / SR
            x = filt(n, 'bandpass', [2000, 7000], 2) * (0.4 + 0.6 * (np.sin(2 * np.pi * 7 * tt2) > 0)); place(b, x * vol, t0)
        for i in range(7): scribble(D['p1'] + 0.35 + i * 0.36, 0.25); place(b, blip(1320, 0.07), D['p1'] + 0.6 + i * 0.36)
        place(b, pop(0.35), D['p1'] + 2.95)
        scribble(D['p2'] + 0.3, 0.5); scribble(D['p2'] + 0.95, 0.5, 0.07); scribble(D['p2'] + 1.6, 0.6)
        scribble(D['p3'] + 0.35, 1.0, 0.09)
        for i in range(6): scribble(D['p4'] + 0.3 + i * 0.28, 0.22)
        for i in range(14): place(b, page(0.12), D['flip'] + i * 0.075)
        place(b, ding(0.2), D['pull'])
    elif si == 2:
        D = {'k1': vt('w1', -0.75), 'open1': ve('w1', 0.15), 'k2': vt('G1b', -1.2), 'open2': vt('G1b', -0.35), 'k3': vt('g3', -1.35), 'gather': ve('g3', 0.05), 'open3': ve('G2', 0.05), 'pop': ve('z1', 0.25), 'horde': ve('z1', 0.6)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, knock(0.45), D['k1']); place(b, knock(0.5), D['k2'])
        for k in (0, 0.6): place(b, thudk(0.6), D['k3'] + k)
        for k in ('open1', 'open2', 'open3'): place(b, whoosh(0.35, 0.1), D[k])
        for i in range(10): place(b, tap(0.25), ve('G1', 0.05) + i * 0.11 + (i % 3) * 0.02)
        for i in range(16): place(b, tap(0.28), ve('G1b', 0.05) + i * 0.09)
        for i in range(5): place(b, popper(0.4), D['open2'] + 0.1 + i * 0.12)
        place(b, cute(D['k3'], 0.05), 0.2)
        place(b, popper(0.3), D['pop']); place(b, sine(150, 140, 1.4, 0.6) * 0.25, D['horde'])
        b += drone(T, 0.1, 46) * np.clip((tt - D['horde']) / 0.3, 0, 1)
        h2, times = hb_track(T, D['horde'], T, 100, 120, 0.4); b += h2; ev['beats'] = times
    elif si == 3:
        D = {'top': vt('S', 1.25), 'sniff': vt('z2', -0.7)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += (drone(T, 0.1, 52) + scrape(T, 0.06)) * np.clip((D['top'] - tt) / 0.2, 0, 1)
        for i in range(int(D['top'] / 0.2)): place(b, step(0.1), i * 0.2)
        place(b, march(T - D['top'], 128, 0.15), D['top'])
        place(b, sine(500, 900, 0.25, 0.1) * 0.08, D['sniff'] + 0.3)
    elif si == 4:
        b += wind(T, 0.04)
        D = {'phone': vt('z4', -0.9), 'chat': vt('z4', -0.5), 'end': info[si]['len'] + LEAD + 0.75 - 1.6}
        ev.update({k: round(x, 3) for k, x in D.items()})
        for i in range(30): place(b, kakao(0.14 * (0.6 + 0.4 * ((i % 3) == 0))), D['chat'] + i * 0.28 * (1 - i / 60))
        place(b, ding(0.25), D['end'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], {k: v for k, v in x['ev'].items() if k != 'beats'})
print('segs', {k: v for x in info for k, v in x['segs'].items() if len(v) > 1})
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
