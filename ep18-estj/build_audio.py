# #018 ESTJ 본편 — 대사 자르기 + 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) + timing.json/timing.js
import numpy as np, subprocess, json, os
from sfxlib import *
os.makedirs('lines', exist_ok=True)
CUT = {
 'raw/nar.mp3': {'n1': (0, 2.08), 'n2a': (2.60, 4.94), 'n2b': (5.25, 10.01), 'n3a': (10.37, 12.70), 'n3b': (13.05, 15.78),
                 'n4a': (16.18, 20.10), 'n4b': (20.10, 22.81), 'n5a': (23.19, 26.80), 'n5b': (26.98, 30.07),
                 'n6a': (30.45, 32.98), 'n6b': (32.98, 35.41), 'n7a': (35.74, 37.64), 'n7b': (37.96, 42.35),
                 'n8a': (42.70, 44.80), 'n8b': (45.09, 48.55), 'n9': (48.98, 54.16)},
 'raw/boss.mp3': {'b1': (0, 2.36)},
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
    if name[0] == 'n': return rd(name, SQ + 'atempo=1.12')
    return rd(name, 'atempo=1.0') * 1.05

SC = [
    [('n1', 0.0), ('n2a', 0.5), ('n2b', 0.35), ('b1', 0.35)],
    [('n3a', 0.0), ('n3b', 0.55)],
    [('n4a', 0.0), ('n4b', 1.0)],
    [('n5a', 0.3), ('n5b', 0.3)],
    [('n6a', 0.0), ('n6b', 0.55)],
    [('n7a', 0.0), ('n7b', 0.3)],
    [('n8a', 0.3), ('n8b', 0.8)],
    [('n9', 0.2)],
]
POST = {0: 0.6, 1: 0.6, 2: 0.9, 3: 0.6, 4: 0.9, 5: 0.9, 6: 1.0, 7: 0.8}
info = []
for si, lines in enumerate(SC):
    t = 0; L = {}; xs = []
    for name, gap in lines:
        x = ld(name); t += gap; L[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t)); t += len(x) / SR
    T = t + POST[si]; v = np.zeros(int(T * SR) + 1)
    for x, st in xs: place(v, x, st)
    save(v, f'audio/v{si + 1}.wav'); info.append({'len': round(T, 3), 'lines': L, 'ev': {}})

LEAD = 0.25
def chk(vol=0.3):  # 체크 '틱!'
    x = sine(2600, 2400, 0.06, 0.02) * 0.5; x[:int(0.03 * SR)] += filt(noise(0.03), 'highpass', 2500) * env(int(0.03 * SR), 0.0002, 0.006) * 0.6; return x * vol
def register(vol=0.25):  # 계산대 '띵'
    x = np.zeros(int(1.0 * SR)); place(x, sine(2093, 2093, 0.9, 0.35) * 0.6, 0); place(x, sine(4186, 4186, 0.5, 0.15) * 0.2, 0); return x * vol
def bell(vol=0.3):  # 타이머 '땡!'
    x = np.zeros(int(1.4 * SR))
    for f, a in [(880, 0.6), (1760, 0.3), (2637, 0.15)]: place(x, sine(f, f, 1.3, 0.5) * a, 0)
    return x * vol
def scribble(dur, vol=0.06):  # 펜 슥슥
    t = np.arange(int(dur * SR)) / SR
    return filt(noise(dur), 'bandpass', [1800, 6000], 2) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 4.5 * t))) * vol
def sparkle(vol=0.1):
    x = np.zeros(int(0.9 * SR))
    for k, f in enumerate([1568, 1976, 2349, 3136]): place(x, sine(f, f, 0.3, 0.12) * 0.5, k * 0.07)
    return x * vol
def rain(dur, vol=0.07): return filt(noise(dur), 'bandpass', [800, 7000], 2) * vol
def thunder(vol=0.35): return filt(brown(2.0), 'lowpass', 300, 4) * env(int(2.0 * SR), 0.05, 0.6) * vol
def mailding(vol=0.1): return sine(1760, 1760, 0.15, 0.06) * vol
def cheer(dur, vol=0.12):  # 웃음·박수 느낌의 웅성
    t = np.arange(int(dur * SR)) / SR
    cl = np.zeros(len(t))
    for k in range(int(dur * 14)):
        st = rs.uniform(0, dur - 0.05); place(cl, filt(noise(0.03), 'bandpass', [800, 4000], 2) * env(int(0.03 * SR), 0.0005, 0.008), st)
    return (cl * 0.8 + murmur(dur, 0.6)[:len(t)] * 0.4) * vol * np.minimum(1, (dur - t) / 0.3)

for si, d in enumerate(info):
    T = d['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = d['lines']; vt = lambda n, k=0: LEAD + L[n][0] + k; ve = lambda n, k=0: LEAD + L[n][0] + L[n][1] + k
    b = np.zeros(int(T * SR) + SR); ev = d['ev']
    if si == 0:
        ev['flip'] = [round(vt('n2b', k * 0.45), 3) for k in range(3)]
        for k in ev['flip']: place(b, swipe(0.16), k)
        ev['ticks'] = [round(vt('n2b', 2.0 + k * 0.07), 3) for k in range(10)]
        for k in ev['ticks']: place(b, chk(0.18), k)
        ev['boss'] = round(vt('b1'), 3)
    if si == 1:
        ev['write'] = round(vt('n3a', 0.6), 3); place(b, scribble(1.4, 0.05), ev['write'])
        ev['ticks'] = [round(vt('n3b', 0.1 + k * 0.06), 3) for k in range(12)]
        for k in ev['ticks']: place(b, chk(0.2), k)
        ev['ticks2'] = [round(vt('n3b', 0.9 + k * 0.06), 3) for k in range(12)]
        for k in ev['ticks2']: place(b, chk(0.2), k)
        place(b, rumble(T, 0.05)[:len(b)], 0)
    if si == 2:
        ev['mail0'] = round(ve('n4a', -1.2), 3)
        ts = [ev['mail0'] + 1.9 * (k / 31) ** 0.8 for k in range(32)]; ev['mails'] = [round(x, 3) for x in ts]
        for k in ts[::2]: place(b, mailding(0.09), k)
        ev['sweat'] = round(ve('n4b', 0.05), 3)
    if si == 3:
        ev['reg'] = 0.3; place(b, register(0.22), 0.3)
        ev['bill'] = round(vt('n5a', 1.6), 3); place(b, kakao(0.18), ev['bill'])
        ev['pays'] = [round(vt('n5b', 0.2 + k * 0.16), 3) for k in range(10)]
        for k in ev['pays']: place(b, chk(0.2), k)
    if si == 4:
        ev['board'] = round(ve('n6a', 0.0), 3); place(b, whoosh(0.6, 0.15), ev['board'])
        ev['write'] = round(ve('n6a', 0.45), 3); place(b, scribble(1.6, 0.05), ev['write'])
        ev['sign'] = [round(ve('n6b', -0.5), 3), round(ve('n6b', -0.2), 3)]
        for k in ev['sign']: place(b, chk(0.25), k)
        ev['love'] = round(ve('n6b', 0.25), 3); place(b, sparkle(0.12), ev['love'])
    if si == 5:
        ev['ding'] = round(vt('n7b', 0.5), 3); place(b, bell(0.28), ev['ding'])
        place(b, cheer(1.4, 0.10), ev['ding'] + 0.15)
        ev['ding2'] = round(ve('n7b', 0.2), 3); place(b, bell(0.22), ev['ding2'])
        place(b, cheer(1.2, 0.08), ev['ding2'] + 0.15)
    if si == 6:
        place(b, rain(T + 1, 0.05)[:len(b)], 0); place(b, wind(T + 1, 0.05)[:len(b)], 0)
        place(b, newsjingle(0.12), 0.1)
        ev['news'] = round(ve('n8a', 0.3), 3); place(b, newsjingle(0.10), ev['news'])
        ev['thunder'] = round(vt('n8a', 0.0), 3); place(b, thunder(0.3), ev['thunder'])
    if si == 7:
        place(b, crickets(T + 1, 0.025)[:len(b)], 0)
    save(b[:int(T * SR)], f'audio/x{si + 1}.wav')
json.dump([d['len'] for d in info], open('voice.json', 'w'))
json.dump(info, open('timing.json', 'w'), ensure_ascii=False, indent=1)
open('timing.js', 'w').write('const TM=' + json.dumps(info) + ';\n')
for i, d in enumerate(info): print(i, d['len'], d['lines'], d['ev'])
