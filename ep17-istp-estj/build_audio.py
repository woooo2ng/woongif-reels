# #017 ISTP×ESTJ 궁합편 — 대사 자르기 + 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) + timing.json/timing.js
import numpy as np, subprocess, json, os
from sfxlib import *
os.makedirs('lines', exist_ok=True)
CUT = {
 'raw/nar.mp3': {'n1': (0, 3.17), 'n2a': (3.74, 8.04), 'n2b': (8.52, 10.18), 'n3': (10.75, 16.09), 'n4': (16.55, 20.02), 'n5': (20.25, 21.17),
                 'n6a': (21.74, 25.94), 'n6b': (26.34, 29.35), 'n7a': (29.85, 32.89), 'n7b': (33.45, 37.19), 'n8a': (37.79, 40.74), 'n8b': (41.23, 44.77),
                 'n9': (45.13, 49.70), 'n10': (50.22, 56.29), 'n11': (56.81, 62.74), 'n12': (63.28, 72.12), 'n13': (72.74, 78.32)},
 'raw/estj.mp3': {'e1': (0, 1.95), 'e2': (2.18, 3.38), 'e3': (3.78, 5.55), 'e4': (5.82, 7.63), 'e5': (8.15, 11.48)},
 'raw/istp.mp3': {'i1': (0, 0.46), 'i2': (0.78, 1.18), 'i3': (1.70, 2.44), 'i4': (2.95, 4.47), 'i5': (5.14, 5.84)},
}
for f, d in CUT.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}', '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)

SQ = 'silenceremove=stop_periods=-1:stop_duration=0.22:stop_threshold=-42dB:stop_silence=0.16,'
def rd(name, af):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x
def ld(name):
    if name[0] == 'n': return rd(name, SQ + 'atempo=1.15')
    if name[0] == 'e': return rd(name, 'atempo=1.05') * 0.95
    return rd(name, 'atempo=1.0')

SC = [
    [('n1', 0.0), ('e1', 0.35), ('i1', 0.3), ('n2a', 0.55), ('n2b', 0.12), ('e2', 0.55)],
    [('n3', 0.0), ('n4', 0.25), ('e3', 0.3), ('i2', 0.35), ('n5', 0.4)],
    [('n6a', 0.0), ('n6b', 0.12), ('i3', 0.25), ('e4', 0.2), ('n7a', 0.5), ('n7b', 0.12)],
    [('i4', 0.3), ('n8a', 0.4), ('n8b', 0.12), ('i5', 0.35), ('n9', 0.4)],
    [('n10', 0.0), ('e5', 0.25), ('n11', 0.3)],
    [('n12', 0.2)],
    [('n13', 0.0)],
]
POST = {0: 0.4, 1: 0.3, 2: 0.5, 3: 0.7, 4: 0.8, 5: 0.9, 6: 0.0}
info = []
for si, lines in enumerate(SC):
    t = 0; L = {}; xs = []
    for name, gap in lines:
        x = ld(name); t += gap; L[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t)); t += len(x) / SR
    T = t + POST[si]; v = np.zeros(int(T * SR) + 1)
    for x, st in xs: place(v, x, st)
    save(v, f'audio/v{si + 1}.wav'); info.append({'len': round(T, 3), 'lines': L, 'ev': {}})

LEAD = 0.25
def chaching(vol=0.22):  # 입금 '띠링'
    x = np.zeros(int(0.7 * SR)); place(x, sine(1568, 1568, 0.25, 0.1) * 0.5, 0); place(x, sine(2093, 2093, 0.45, 0.18) * 0.5, 0.1); return x * vol
def beep(vol=0.12): return sine(2200, 2200, 0.1, 0.05) * vol
def door(vol=0.22):  # 미닫이 문 '드르륵'
    dur = 0.6; t = np.arange(int(dur * SR)) / SR
    x = filt(noise(dur), 'bandpass', [200, 1600], 2) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 18 * t))) * np.sin(np.pi * t / dur)
    return x / (np.abs(x).max() + 1e-9) * vol
def sparkle(vol=0.1):
    x = np.zeros(int(0.9 * SR))
    for k, f in enumerate([1568, 1976, 2349, 3136]): place(x, sine(f, f, 0.3, 0.12) * 0.5, k * 0.07)
    return x * vol
for si, d in enumerate(info):
    T = d['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = d['lines']; vt = lambda n, k=0: LEAD + L[n][0] + k; ve = lambda n, k=0: LEAD + L[n][0] + L[n][1] + k
    b = np.zeros(int(T * SR) + SR); ev = d['ev']
    if si == 0:
        ev['msgs'] = [round(vt('n2a', 0.35 + k * 0.95), 3) for k in range(4)]
        for k in ev['msgs']: place(b, kakao(0.2), k)
    if si == 1:
        ev['ticks'] = [round(vt('n4', 1.2 + k * 0.13), 3) for k in range(7)]
        for k in ev['ticks']: place(b, tap(0.35), k)
    if si == 2:
        ev['card'] = round(vt('i3', 0.35), 3); place(b, beep(0.12), ev['card'])
        ev['dep'] = round(vt('n7a', 0.2), 3); place(b, chaching(0.24), ev['dep'])
    if si == 3:
        ev['photos'] = [round(vt('n9', 1.0 + k * 0.55), 3) for k in range(5)]
        for k in ev['photos']: place(b, swipe(0.14) if 'swipe' in globals() else page(0.12), k)
        ev['wow'] = round(ve('n9', 0.05), 3); place(b, sparkle(0.12), ev['wow'])
    if si == 4:
        ev['door'] = round(vt('n11', 0.9), 3); place(b, door(0.2), ev['door'])
        ev['wow'] = round(vt('n11', 3.6), 3); place(b, sparkle(0.14), ev['wow'])
    if si == 5:
        ev['ticks'] = [round(vt('n12', 2.6 + k * 0.35), 3) for k in range(4)]
        for k in ev['ticks']: place(b, tap(0.3), k)
    save(b[:int(T * SR)], f'audio/x{si + 1}.wav')
json.dump([d['len'] for d in info], open('voice.json', 'w'))
json.dump(info, open('timing.json', 'w'), ensure_ascii=False, indent=1)
open('timing.js', 'w').write('const TM=' + json.dumps(info) + ';\n')
for i, d in enumerate(info): print(i, d['len'], d['lines'], d['ev'])
