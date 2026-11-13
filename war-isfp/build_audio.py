# ISFP 전쟁편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성 (헬퍼는 ISTP 전쟁편과 동일)
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def load(name):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'silenceremove=stop_periods=-1:stop_duration=0.2:stop_threshold=-42dB:stop_silence=0.16,atempo='+('1.24' if name[0]=='n' else '1.15'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
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

def buzz(vol=0.3):  # 폰 진동 '드르륵'
    n = int(0.5 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 150 * t) * (np.sin(2 * np.pi * 22 * t) > 0) * env(n, 0.01, None)
    return filt(x, 'lowpass', 600) * vol
def alarm(vol=0.18):  # 알람 '삐비빅'
    x = np.zeros(int(1.6 * SR))
    for k in range(4):
        for j in range(3):
            s = sine(1980, 1980, 0.07, None, 0.002) * vol; o = int((k * 0.4 + j * 0.1) * SR); x[o:o + len(s)] += s
    return x
def crack(vol=0.5):  # 도장 부러지는 '빠직'
    n = filt(noise(0.18), 'bandpass', [1200, 6000], 2) * env(int(0.18 * SR), 0.0005, 0.04)
    return n / (np.abs(n).max() + 1e-9) * vol
def shutter(vol=0.25):
    a = filt(noise(0.03), 'highpass', 2500) * env(int(0.03 * SR), 0.0002, 0.006)
    x = np.zeros(int(0.12 * SR)); x[:len(a)] += a; o = int(0.06 * SR); x[o:o + len(a)] += a * 0.7; return x * vol
def softsong(dur, vol=0.12):  # 블루투스 스피커 감성 노래(잔잔한 코드)
    out = np.zeros(int(dur * SR) + SR)
    prog = [[261.6, 329.6, 392, 493.9], [220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [196, 246.9, 293.7, 392]]
    bar = 2.0; t = 0; i = 0
    while t < dur:
        ch = prog[i % 4]; p = int(t * SR)
        for j, f in enumerate(ch):
            s = sine(f, f, 0.9, 0.6, 0.01) * 0.25; o = p + int(j * 0.12 * SR); out[o:o + len(s)] += s[:len(out) - o]
        pad = sum(sine(f / 2, f / 2, bar, None, 0.3) for f in ch[:2]) * 0.08 * np.sin(np.linspace(0, np.pi, int(bar * SR)))
        out[p:p + len(pad)] += pad[:len(out) - p]
        t += bar; i += 1
    out = filt(out[:int(dur * SR)], 'lowpass', 3000)
    return out / (np.abs(out).max() + 1e-9) * vol

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('n1', 0.0), ('e1', 0.2), ('g1', 0.1), ('cheer', -0.1), ('n2', 0.25)],
    [('s1', 1.3), ('n3', 0.35)],
    [('e2', 0.9), ('g4', 0.45), ('both', 0.35), ('n4', 0.5)],
    [('n5', 0.4)],
    [('g2', 0.3), ('n6', 0.25), ('s2', 0.5), ('s3', 1.1), ('g3', 0.5), ('s4', 0.3), ('f1', 0.4), ('n7', 0.3)],
    [('g6', 0.2), ('f2', 1.5), ('s5', 0.25), ('n8', 0.4)],
    [('g7', 0.25), ('yes', 0.1), ('n9', 2.0)],
    [('e4', 2.7), ('g8', 0.25), ('n10', 1.4)],
]
POST = {0: 0.2, 2: 0.3, 3: 0.5, 4: 0.2, 5: 0.5, 6: 0.6, 7: 1.6}
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

LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    en = lambda name, k=0: LEAD + L[name][0] + L[name][1] + k
    b = np.zeros(int(T * SR))
    if si == 0:
        b += wind(T, 0.05)
        for tt in (0.1, 2.0): place(b, boom(0.6), tt)
        ev['decl'] = round(vt('e1'), 3); place(b, drum(0.5), vt('e1') - 0.1)
        ev['reply'] = round(vt('g1'), 3); place(b, drum(0.5), vt('g1') - 0.05)
        ev['cheer'] = round(vt('cheer'), 3); place(b, fanfare(0.14), vt('cheer') + 0.1); place(b, boom(0.25), vt('cheer'))
    elif si == 1:
        place(b, alarm(0.2), LEAD + 0.05); ev['alarm'] = LEAD + 0.05
        ev['freeze'] = round(LEAD + 0.9, 3)
        ev['type'] = round(vt('n3', 0.2), 3)
        for i in range(int((L['n3'][1] - 0.6) / 0.25)): place(b, tap(0.1), vt('n3', 0.2) + i * 0.25 + rs.random() * 0.06)
    elif si == 2:
        ev['buzz'] = round(LEAD + 0.25, 3); place(b, buzz(0.35), LEAD + 0.25)
        ev['m1'] = round(vt('e2', -0.1), 3); place(b, ding(0.2), vt('e2', -0.1))
        ev['m2'] = round(vt('g4', -0.1), 3); place(b, ding(0.2), vt('g4', -0.1))
        ev['both'] = round(vt('both'), 3); place(b, sparkle(0.2), vt('both'))
        ev['run'] = round(en('both', 0.1), 3); place(b, fanfare(0.1), en('both', 0.15))
    elif si == 3:
        st = LEAD + 0.15; ev['stamps'] = round(st, 3); n = 9
        ts = [st + 4.8 * (1 - (1 - i / n) ** 1.6) for i in range(n)]; ev['stampT'] = [round(x, 3) for x in ts]
        for x in ts: place(b, stamp(0.35), x)
    elif si == 4:
        b += wind(T, 0.04)
        ev['crack'] = round(vt('g2', -0.15), 3); place(b, crack(0.5), vt('g2', -0.15))
        ev['march'] = round(en('g2', 0.0), 3)
        for i in range(8): place(b, drum(0.3), en('g2', 0.0) + i * 0.45)
        ev['draw'] = round(vt('s2', -0.2), 3); place(b, scribble(L['s2'][1] + 1.6, 0.07), vt('s2', 0.2))
        ev['name'] = round(vt('s3', 0.6), 3); place(b, sparkle(0.16), vt('s3', 0.7))
        ev['load'] = round(vt('g3'), 3); place(b, drum(0.5), vt('g3'))
        ev['hug'] = round(vt('s4', -0.2), 3)
        ev['foe'] = round(vt('f1', -0.3), 3); place(b, whoosh(0.6, 0.15), vt('f1', -0.4))
    elif si == 5:
        b += wind(T, 0.03)
        ev['sunset'] = round(vt('g6', 0.35), 3)
        ev['song'] = round(en('g6', 0.2), 3); place(b, softsong(T - en('g6', 0.2), 0.13), en('g6', 0.2))
        ev['share'] = round(vt('n8', 0.3), 3)
        for i in range(6): place(b, blip(990 + i * 30, 0.05), vt('n8', 0.3) + i * 0.35)
    elif si == 6:
        ev['yes'] = round(vt('yes'), 3)
        ev['dawn'] = round(en('yes', 0.5), 3); place(b, alarm(0.08), en('yes', 0.5))
        st = en('yes', 0.9); ev['flood'] = round(st, 3)
        for i in range(22): place(b, ding(0.07), st + i * 0.13 * (1 - i / 40))
        ev['last'] = round(T - 1.6, 3); place(b, ding(0.2), T - 1.6)
    elif si == 7:
        b += wind(T, 0.05)
        ev['m1'] = round(LEAD + 0.15, 3); place(b, ding(0.18), LEAD + 0.15)
        ev['m2'] = round(LEAD + 0.75, 3); place(b, ding(0.18), LEAD + 0.75)
        ev['cal'] = round(LEAD + 1.3, 3); place(b, whoosh(0.4, 0.15), LEAD + 1.2)
        st = vt('e4', -0.35); ev['call'] = round(st, 3); place(b, ding(0.15), st)
        ev['none'] = round(en('g8', 0.1), 3); place(b, pop(0.25), en('g8', 0.1))
        ss = [LEAD + 1.65 + i * 0.3 for i in range(3)]; ev['stampT'] = [round(x, 3) for x in ss]
        for x in ss: place(b, stamp(0.35), x)
        ev['empty'] = round(vt('n10', -0.2), 3)
        ev['stat'] = round(vt('n10', 2.2), 3)
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'])
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
