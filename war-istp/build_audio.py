# ISTP 전쟁편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def load(name):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'atempo=1.1', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
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

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('e1', 0.0), ('n1', 0.6)],
    [('n2', 1.2)],
    [('s1', 0.85), ('g1', 0.3), ('s2', 0.35), ('n3', 0.35)],
    [('f1', 0.2), ('s3', 0.4), ('f2', 0.3), ('s4', 0.35), ('f3', 0.55), ('n4', 0.45)],
    [('f4', 1.75), ('s5', 0.35), ('f5', 0.45)],
    [('s6', 0.5), ('f6', 0.3), ('s7', 0.35), ('n5', 0.55)],
    [('n6', 0.0), ('n7', 2.65), ('g2', 0.35)],
    [('n8', 0.3), ('e2', 0.45), ('g3', 0.4), ('e3', 0.45), ('n9', 0.85)],
]
POST = {6: 1.3, 7: 0.2}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        x = load(name); t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st in xs: place(v, x, st)
    save(v, f'audio/v{si + 1}.wav')
    info.append({'len': round(T, 3), 'lines': starts})

# 장면 영상 시간 = 0.25(앞) + 음성 시간 → 효과음은 장면 시간 기준으로 만든다
LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    b = np.zeros(int(T * SR))
    if si == 0:
        CUT = vt('n1') - 0.3; ev['cut'] = round(CUT, 3)
        w = wind(T, 0.07); m = muffle(w + 0); bm = beat(T, vol=0.16)
        k = np.clip((np.arange(len(b)) / SR - CUT) / 0.35, 0, 1)
        b += w * (1 - k) + m * k + bm * k
        place(b, boom(0.35), 0.15); place(b, muffle(boom(0.6)), CUT + 1.6)
        place(b, chime(), CUT - 0.05)
        e1 = load('e1'); place(b, muffle(e1, 320) * 0.5, CUT + 0.25)  # 적장 계속 외치는 중(먹먹)
    elif si == 1:
        b += muffle(wind(T, 0.08)) + beat(T, vol=0.16)
        for tt in (0.55, 3.3): place(b, muffle(boom(1.0), 220), tt); ev.setdefault('booms', []).append(tt)
    elif si == 2:
        P = LEAD + 0.45; ev['pull'] = round(P, 3)
        k = np.clip((np.arange(len(b)) / SR - P) / 0.06, 0, 1)
        w = wind(T, 0.08)
        b += muffle(w) * (1 - k) + beat(T, vol=0.16) * (1 - k) + w * k
        place(b, pop(), P)
        for tt in (P + 0.4, P + 3.2, P + 6.5): place(b, boom(0.18), tt)
        for tt in (P + 1.6, P + 1.75, P + 5.0): place(b, gunshot(0.08), tt)
    elif si == 3:
        b += wind(T, 0.06)
        place(b, boom(0.12), 1.5); place(b, boom(0.1), 8.0)
    elif si == 4:
        b += wind(T, 0.06); shots = [0.2, 0.55, 0.85, 1.2, 1.5]; ev['shots'] = shots
        for i, tt in enumerate(shots): place(b, gunshot(0.45 if i % 2 else 0.38), tt); place(b, ricochet(), tt + 0.12)
    elif si == 5:
        b += wind(T, 0.05)
        st = vt('s7', 0.9)
        for i in range(14): place(b, blip([660, 880, 990, 1320][i % 4], 0.05), st + i * 0.33)
    elif si == 6:
        b += wind(T, 0.025)
        E = vt('n6') + L['n6'][1]
        D = {'post': LEAD + 0.6, 'req1': E + 0.25, 'req2': E + 0.85, 'type': E + 1.35, 'send': E + 2.3,
             'zero': E + 2.42, 'leave': E + 2.6, 'oops': vt('g2', 0.05), 'back': vt('g2', 1.0), 'foe': vt('g2', 1.6)}
        ev.update({k: round(v, 3) for k, v in D.items()})
        for k in ('post', 'req1', 'req2', 'send', 'oops'): place(b, ding(0.22), D[k])
        for i in range(10): place(b, tap(), D['type'] + i * 0.1 + rs.random() * 0.03)
        for i in range(6): place(b, tap(), D['oops'] - 0.7 + i * 0.1)
        place(b, whoosh(1.0, 0.3), D['leave'])
    elif si == 7:
        b += wind(T, 0.07)
        D = {'stamp': vt('e3') + L['e3'][1] + 0.35}; ev.update({k: round(v, 3) for k, v in D.items()})
        place(b, ding(0.18), vt('e2', -0.2)); place(b, ding(0.18), vt('g3', -0.15)); place(b, ding(0.18), vt('e3', -0.15))
        place(b, stamp(0.7), D['stamp'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x)
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
