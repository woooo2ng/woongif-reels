# ISTJ 좀비편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) + timing.json
import numpy as np, subprocess, json, os
from sfxlib import *

def rd(name, af):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x
SQ = 'silenceremove=stop_periods=-1:stop_duration=0.22:stop_threshold=-42dB:stop_silence=0.18,'
def load(name):
    if name[0] == 'n': return rd(name, SQ + 'atempo=1.15')
    if name[0] == 'z':
        x = rd(name, 'asetrate=39000,aresample=48000,aecho=0.6:0.5:35:0.25,atempo=1.05')
        x = np.tanh(x * 2.2) * 0.55; return x
    if name[0] == 'a':  # 번호 호출 안내 방송: 스피커 + 잔향
        x = rd(name, 'atempo=1.05'); y = filt(x, 'bandpass', [350, 3800], 4); y = np.tanh(y * 1.8) * 0.6
        d = int(0.09 * SR); z = np.zeros(len(y) + d * 4); z[:len(y)] += y
        for k in (1, 2, 3): z[d * k:d * k + len(y)] += y * (0.28 ** k)
        return z / (np.abs(z).max() + 1e-9) * 0.7
    if name[0] == 'c': return rd(name, SQ + 'atempo=1.12')
    return rd(name, 'atempo=1.08')  # p: 주인공 JunHo

def dingdong(vol=0.28):  # 번호표 호출 '딩동'
    a = sine(1046, 1046, 0.45, 0.25) * 0.6; b = sine(784, 784, 0.7, 0.35) * 0.6
    x = np.zeros(int(1.0 * SR)); place(x, a, 0); place(x, b, 0.22); return filt(x, 'lowpass', 4000) * vol
def ticket(vol=0.2):  # 번호표 '삑' + 종이 '드르륵'
    x = np.zeros(int(0.6 * SR)); place(x, sine(2000, 2000, 0.09, 0.05) * 0.5, 0)
    p = filt(noise(0.35), 'bandpass', [1500, 6000], 2) * (0.5 + 0.5 * np.sign(np.sin(np.linspace(0, 120, int(0.35 * SR))))) * 0.35
    place(x, p, 0.12); return x * vol
def shutter(dur=1.4, vol=0.3):  # 셔터 드르륵
    n = int(dur * SR); t = np.arange(n) / SR
    x = filt(noise(dur), 'bandpass', [300, 2500], 2) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 26 * t)))
    x *= np.minimum(1, t / 0.05) * np.minimum(1, (dur - t) / 0.1)
    x = x / (np.abs(x).max() + 1e-9) * vol; place(x, thudk(0.5)[:int(0.3 * SR)] if False else np.zeros(1), 0)
    out = np.zeros(n + int(0.4 * SR)); out[:n] += x; place(out, filt(sine(90, 50, 0.35, 0.08, 0.001), 'lowpass', 400) * vol * 1.6, dur - 0.05); return out
def alarm(dur=1.2, vol=0.2):  # 삐비빅
    x = np.zeros(int(dur * SR)); k = 0
    while k < dur - 0.1:
        for j in range(3): place(x, np.sign(sine(2400, 2400, 0.06, None)) * env(int(0.06 * SR), 0.002) * 0.5, k + j * 0.09)
        k += 0.5
    return filt(x, 'lowpass', 5000) * vol
def chair(vol=0.15): return filt(noise(0.15), 'bandpass', [200, 900], 2) * env(int(0.15 * SR), 0.003, 0.05) * vol
def tick2(vol=0.12):
    x = np.zeros(int(1.2 * SR))
    for k in (0, 0.5, 1.0): place(x, tick(vol), k)
    return x

SC = [
    [('n1', 0.35), ('p1', 2.3), ('n2', 0.5)],
    [('z1', 1.2), ('p2', 0.5), ('z2', 0.45), ('p3', 1.7), ('n3', 1.1)],
    [('a1', 1.2), ('c1', 1.5), ('z3', 0.4), ('c2', 0.45), ('n4', 2.4)],
    [('a2', 1.9), ('c3', 2.0), ('z4', 0.6), ('n5', 0.9)],
]
POST = {0: 0.2, 1: 0.3, 2: 0.3, 3: 2.4}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []; sg = {}
    for name, gap in lines:
        x = load(name)
        t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; sg[name] = segs(x); xs.append((x, t, name)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st, name in xs: place(v, x * (0.8 if name[0] == 'z' else 1.0), st)
    save(v, f'audio/v{si + 1}.wav')
    info.append({'len': round(T, 3), 'lines': starts, 'segs': sg})

LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    ve = lambda name, k=0: LEAD + L[name][0] + L[name][1] + k
    b = np.zeros(int(T * SR)); N = len(b); tt = np.arange(N) / SR
    if si == 0:
        D = {'alert': 1.25, 'alarm': ve('n1', 0.6), 'wake': ve('n1', 0.9), 'look': ve('n1', 1.6), 'plan': vt('n2', -0.1)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += (drone(T, 0.12, 49) + scrape(T, 0.04)) * np.clip((D['alarm'] - tt) / 0.08, 0, 1)
        b += siren(T, 0.05) * np.clip((D['alarm'] - tt) / 0.2, 0, 1)
        place(b, buzz(0.2), D['alert']); place(b, ding(0.2), D['alert'])
        place(b, alarm(1.0, 0.22), D['alarm'])
        b += birds(T, 0.04) * (tt > D['alarm'])
        place(b, sine(330, 300, 0.25, 0.1) * 0.12, D['look'])
        place(b, page(0.2), D['plan'])
    elif si == 1:
        D = {'bang': 0.45, 'lunge': vt('z1', -0.2), 'stop': ve('z1', 0.1), 'point': vt('p2', 0.1), 'reveal': ve('z2', 0.15), 'pull': ve('p3', 0.35), 'sit': ve('p3', 0.95)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, glassbang(0.6), D['bang']); place(b, glassbang(0.35), D['bang'] + 0.4)
        b += (drone(T, 0.13, 47) + scrape(T, 0.05)) * np.clip((D['stop'] - tt) / 0.08, 0, 1)
        h2, times = hb_track(T, D['bang'] + 0.2, D['stop'], 90, 160, 0.45); b += h2; ev['beats'] = times
        for i in range(5): place(b, step(0.16), D['bang'] + 0.3 + i * 0.28)
        b += hum(T, 0.02) * (tt > D['stop'])
        place(b, ticket(0.3), D['pull'])
        place(b, chair(0.2), D['sit'])
        b += murmur(T, 0.03) * (tt > D['reveal'])
    elif si == 2:
        D = {'call': vt('a1', -0.5), 'walk': ve('a1', 0.1), 'stamp': vt('c2', -0.25), 'back': ve('c2', 0.3), 'pull': ve('c2', 1.0), 'lapse': ve('c2', 1.5), 'stat': vt('n4', 0.3)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += hum(T, 0.02); b += murmur(T, 0.025)
        place(b, dingdong(0.3), D['call'])
        for i in range(4): place(b, step(0.13), D['walk'] + i * 0.3)
        place(b, page(0.15), vt('c1', 0.2))
        place(b, stamp(0.45), D['stamp'])
        for i in range(3): place(b, step(0.1), D['back'] + i * 0.35)
        place(b, ticket(0.25), D['pull'])
        place(b, whoosh(1.0, 0.2), D['lapse'])
        for i in range(6): place(b, tick(0.06), D['lapse'] + 0.1 + i * 0.16)
        place(b, ding(0.2), D['stat'])
    elif si == 3:
        D = {'card': 0.0, 'lobby': 1.35, 'call': vt('a2', -0.5), 'up': ve('a2', 0.15), 'clock': vt('c3', -0.9), 'shut': vt('c3', -0.35), 'stat': vt('n5', 0.1),
             'end': info[si]['len'] + LEAD + 0.75 - 1.6}
        ev.update({k: round(x, 3) for k, x in D.items()})
        place(b, newsjingle(0.12), 0.1)
        b += hum(T, 0.02) * (tt > D['lobby'])
        place(b, dingdong(0.32), D['call'])
        place(b, chair(0.25), D['up'])
        for i in range(4): place(b, step(0.14), D['up'] + 0.2 + i * 0.22)
        place(b, tick2(0.1), D['clock'])
        place(b, shutter(1.3, 0.32), D['shut'])
        place(b, calm(T - D['stat'] + 0.2, 0.05), D['stat'] - 0.2)
        place(b, ding(0.25), D['end'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], {k: v for k, v in x['ev'].items() if k != 'beats'})
print('segs', {k: v for x in info for k, v in x['segs'].items() if len(v) > 1})
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
