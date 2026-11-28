# INFJ 전쟁편(가면 버전) — 장면별 음성(v{i}.wav) + 효과음·BGM(x{i}.wav) + audio/timing.json
from fxlib import *

def inner(x):  # 속마음: 살짝 낮고 먹먹하게
    y = filt(x, 'lowpass', 3200, 2) * 0.95
    return y
# ---------- 새 효과음·BGM ----------
def mar(f, dur=0.35, vol=1.0):  # 마림바 한 음
    a = sine(f, f, dur, 0.12, 0.002) + sine(f * 4, f * 4, dur, 0.03, 0.001) * 0.25
    return a * vol
NOTES = {'C5': 523.3, 'D5': 587.3, 'E5': 659.3, 'G5': 784.0, 'A5': 880.0, 'C6': 1046.5, 'G4': 392.0, 'A4': 440.0, 'E4': 329.6, 'C4': 261.6, 'F4': 349.2, 'F5': 698.5, 'B4': 493.9, 'D4': 293.7}
def plink(dur, vol=0.08, bpm=112):  # '가면 모드' 해맑은 마림바 루프 (직접 작곡)
    seq = ['C5', 'E5', 'G5', 'E5', 'A5', 'G5', 'E5', 'D5', 'C5', 'E5', 'G5', 'C6', 'A5', 'G5', 'E5', 'G5']
    bass = ['C4', 'C4', 'A4', 'A4', 'F4', 'F4', 'G4', 'G4']
    step = 60 / bpm / 2; out = np.zeros(int(dur * SR) + 2 * SR)
    i = 0; t = 0
    while t < dur:
        p = int(t * SR); m = mar(NOTES[seq[i % 16]], 0.3); out[p:p + len(m)] += m
        if i % 2 == 0: b = mar(NOTES[bass[(i // 2) % 8]] / 2, 0.4, 0.6); out[p:p + len(b)] += b
        i += 1; t += step
    out = out[:int(dur * SR)]; return out / (np.abs(out).max() + 1e-9) * vol
def musicbox(dur, vol=0.07):  # 밤 다리 — 잔잔한 오르골 (직접 작곡)
    seq = ['E5', 'G5', 'C6', 'B4', 'A4', 'C5', 'E5', None, 'D5', 'F5', 'A5', 'G5', 'E5', 'D5', 'C5', None]
    step = 0.42; out = np.zeros(int(dur * SR) + 2 * SR); i = 0; t = 0
    while t < dur:
        n = seq[i % 16]
        if n:
            p = int(t * SR); f = NOTES[n]; a = sine(f, f, 1.4, 0.5, 0.002) + sine(f * 2, f * 2, 1.4, 0.25, 0.002) * 0.35 + sine(f * 3, f * 3, 1.4, 0.1, 0.001) * 0.12
            out[p:p + len(a)] += a
        i += 1; t += step
    out = out[:int(dur * SR)]; t = np.arange(len(out)) / SR
    out *= np.minimum(1, t / 1.2)
    return out / (np.abs(out).max() + 1e-9) * vol
def crickets(dur, vol=0.025):
    out = np.zeros(int(dur * SR)); t0 = 0
    while t0 < dur:
        for k in range(3):
            c = sine(4300, 4300, 0.03, 0.01, 0.002); o = int((t0 + k * 0.05) * SR)
            if o + len(c) < len(out): out[o:o + len(c)] += c
        t0 += 0.55 + rs.random() * 0.5
    return out * vol / 0.6
def bell(vol=0.22):  # 시계탑 '댕'
    x = sum(sine(f, f, 2.4, 1.1, 0.002) * g for f, g in [(392, 1), (784, 0.5), (1046, 0.3), (523, 0.4)])
    return x / (np.abs(x).max() + 1e-9) * vol
def sigh(vol=0.16, dur=1.2):  # '하아…' 한숨(숨소리)
    n = filt(noise(dur), 'bandpass', [300, 2200], 2); t = np.linspace(0, 1, len(n))
    e = np.sin(np.pi * np.minimum(1, t * 3)) ** 2 * np.exp(-t * 1.6)
    x = n * e; return x / (np.abs(x).max() + 1e-9) * vol
def knock(vol=0.3):
    out = np.zeros(int(0.5 * SR))
    for i in range(3):
        k = filt(noise(0.05), 'lowpass', 700) * env(int(0.05 * SR), 0.0005, 0.01) + sine(160, 110, 0.05, 0.02, 0.0005)[:int(0.05 * SR)] * 0.5
        o = int(i * 0.14 * SR); out[o:o + len(k)] += k
    return out / (np.abs(out).max() + 1e-9) * vol
def clack(vol=0.2):  # 가면 딸깍(나무)
    x = sine(1900, 1500, 0.05, 0.015, 0.0003) + filt(noise(0.03), 'bandpass', [1500, 5000], 2) * env(int(0.03 * SR), 0.0002, 0.005) * 0.5 if False else None
    a = sine(1900, 1500, 0.06, 0.015, 0.0003); b = filt(noise(0.06), 'bandpass', [1500, 5000], 2) * env(int(0.06 * SR), 0.0002, 0.006) * 0.5
    return (a + b) * vol
def rattle(vol=0.18, n=6):  # 허리띠 가면 달그락
    out = np.zeros(int(0.7 * SR))
    for i in range(n):
        c = clack(1.0) * (0.5 + 0.5 * rs.random()); o = int((i * 0.09 + rs.random() * 0.03) * SR); out[o:o + len(c)] += c
    return out / (np.abs(out).max() + 1e-9) * vol
def recscratch(vol=0.22):
    return filt(sine(900, 200, 0.28, None, 0.003) * env(int(0.28 * SR), 0.003, 0.15) + noise(0.28) * 0.4 * env(int(0.28 * SR), 0.002, 0.1), 'bandpass', [300, 3500], 2) * vol
def battle(dur, vol=0.18):  # 먼 전투음
    out = np.zeros(int(dur * SR)); t = 0.1
    while t < dur - 0.3:
        x = boom(0.6) if rs.random() < 0.35 else gunshot(0.4); x = filt(x, 'lowpass', 1500)
        o = int(t * SR); n = min(len(x), len(out) - o); out[o:o + n] += x[:n]; t += 0.25 + rs.random() * 0.45
    return out / (np.abs(out).max() + 1e-9) * vol
def wardrums(dur, vol=0.22, bpm=100):
    out = np.zeros(int(dur * SR)); step = 60 / bpm
    for i in range(int(dur / step)):
        d = sine(90, 50, 0.5, 0.16, 0.002) * (1.0 if i % 4 == 0 else 0.6); o = int(i * step * SR)
        out[o:o + len(d)] += d[:len(out) - o]
        if i % 2 == 1:
            s = filt(noise(0.12), 'bandpass', [800, 4000], 2) * env(int(0.12 * SR), 0.001, 0.04) * 0.25; out[o:o + len(s)] += s[:len(out) - o]
    return out / (np.abs(out).max() + 1e-9) * vol
def cutoff(x, t, fade=0.05):  # t초 이후 소리 끊기
    p = int(t * SR); x = x.copy()
    if p < len(x):
        n = int(fade * SR); x[p:p + n] *= np.linspace(1, 0, min(n, len(x) - p)); x[p + n:] = 0
    return x

SC = [
    [('n1', 0.0), ('e1', 2.6), ('g1', 0.25), ('n2', 0.35)],
    [('e2', 0.45), ('e3', 0.35), ('g2', 0.45), ('g3', 0.35), ('n3', 0.45)],
    [('s1', 0.6), ('s2', 0.55), ('s3', 0.55), ('s4', 1.6), ('f1', 1.3), ('n4', 0.45)],
    [('a1', 4.0), ('g4', 0.45), ('n5', 1.3)],
    [('e4', 2.2), ('g5', 0.8), ('e5', 0.35), ('g6', 1.6), ('e6', 0.45), ('n6', 0.35)],
    [('e7', 0.8), ('g7', 0.2), ('n7', 1.0)],
]
POST = {0: 0.3, 1: 0.5, 2: 0.3, 3: 0.3, 4: 0.4, 5: 2.0}
INNER = {'e3', 'g3'}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        if name[0] == 'n': x = trim(rd(name, 1.0, 1.15))
        elif name == 'a1': x = trim(rd(name, 1.08, 1.1))
        elif name in INNER: x = inner(trim(rd(name, 0.96, 1.15)))
        else: x = load(name)
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
    if si == 0:
        b += wind(T, 0.03)
        ev['walk'] = 0.55; ev['stop'] = round(vt('e1', -1.7), 3); ev['reach'] = round(vt('e1', -1.2), 3); ev['mask'] = round(vt('e1', -0.55), 3)
        place(b, cutoff(wardrums(ev['mask'] + 0.2, 0.2), ev['mask'] - 0.05), 0)
        place(b, cutoff(drone(ev['mask'], 0.08), ev['mask'] - 0.05), 0)
        place(b, steps(ev['stop'] - ev['walk'], 0.45, 0.08), ev['walk'])
        place(b, heart(ev['mask'] - ev['stop'], 70, 0.3), ev['stop'])
        place(b, clack(0.35), ev['mask']); place(b, sparkle(0.18), ev['mask'] + 0.05)
        place(b, plink(T - ev['mask'] - 0.2, 0.065), ev['mask'] + 0.2)
    elif si == 1:
        b += wind(T, 0.02)
        ev['in1'] = round(vt('e3', -0.25), 3); ev['out1'] = round(end('e3', 0.2), 3)
        ev['in2'] = round(vt('g3', -0.25), 3); ev['out2'] = round(end('g3', 0.2), 3)
        ev['sign'] = round(vt('n3', 1.3), 3)
        place(b, cutoff(plink(ev['in1'], 0.055), ev['in1']), 0)
        place(b, drone(ev['out1'] - ev['in1'], 0.09), ev['in1'])
        place(b, heart(ev['out1'] - ev['in1'], 80, 0.28), ev['in1'])
        place(b, cutoff(plink(ev['in2'] - ev['out1'], 0.055), ev['in2'] - ev['out1']), ev['out1'])
        place(b, drone(ev['out2'] - ev['in2'], 0.09), ev['in2']); place(b, heart(ev['out2'] - ev['in2'], 80, 0.28), ev['in2'])
        place(b, plink(T - ev['out2'], 0.06), ev['out2'])
        place(b, scribble(0.9, 0.08), ev['sign'] - 0.9); place(b, stamp(0.35), ev['sign'])
    elif si == 2:
        ev['sw1'] = round(vt('s2', -0.3), 3); ev['sw2'] = round(vt('s3', -0.3), 3)
        ev['all'] = round(end('s3', 0.15), 3); ev['bow'] = round(vt('s4', -0.3), 3); ev['freeze'] = round(end('s4', 0.15), 3)
        ev['belt'] = round(vt('f1', -0.75), 3)
        place(b, cutoff(battle(ev['bow'], 0.12), ev['bow']), 0)
        for k in ('sw1', 'sw2'): place(b, whoosh(0.3, 0.2), ev[k]); place(b, clack(0.25), ev[k] + 0.15)
        tt = ev['all']
        while tt < ev['bow'] - 0.1: place(b, whoosh(0.18, 0.13), tt); place(b, clack(0.15), tt + 0.06); tt += 0.12
        place(b, recscratch(0.2), ev['bow'])
        place(b, rattle(0.22), ev['belt'])
        place(b, wind(T - ev['freeze'], 0.03), ev['freeze'])
    elif si == 3:
        ev['bell'] = 1.4; ev['home'] = 2.3; ev['tent'] = 3.0; ev['knock'] = round(vt('a1', -0.55), 3); ev['wide'] = round(end('g4', 0.25), 3)
        place(b, cutoff(battle(ev['bell'] + 0.3, 0.16), ev['bell'] + 0.25), 0)
        for k in range(2): place(b, bell(0.24), ev['bell'] + k * 0.75)
        place(b, steps(ev['tent'] - ev['home'] + 0.2, 0.25, 0.06), ev['home'])
        place(b, sigh(0.2, 1.3), ev['tent'] + 0.35)
        place(b, knock(0.3), ev['knock'])
        for k in range(9): place(b, sigh(0.07, 1.4), ev['wide'] + rs.random() * 0.5)
        place(b, crickets(T - ev['wide'], 0.02), ev['wide'])
        place(b, musicbox(T - ev['wide'] - 0.6, 0.045), ev['wide'] + 0.6)
    elif si == 4:
        b += crickets(T, 0.03)
        ev['meet'] = round(vt('e4', -1.4), 3); ev['pocket'] = round(end('e4', 0.05), 3); ev['smile'] = round(end('e5', 0.35), 3)
        ev['sit'] = round(end('e5', 0.9), 3); ev['lapse'] = round(end('e6', 0.25), 3); ev['sun'] = round(end('n6', -2.2), 3)
        place(b, steps(ev['meet'] - 0.2, 0.42, 0.05), 0.2)
        place(b, filt(noise(0.5), 'bandpass', [1200, 5000], 2) * env(int(0.5 * SR), 0.02, 0.15) * 0.08, ev['pocket'])
        place(b, giggle(0.07), ev['smile'])
        place(b, musicbox(T - ev['sit'], 0.06), ev['sit'])
        for i in range(16): place(b, tick(0.08), ev['lapse'] + i * 0.14)
        place(b, sparkle(0.12), ev['sun'])
    elif si == 5:
        b += wind(T, 0.02)
        ev['wink'] = round(end('g7', 0.15), 3); ev['night'] = round(vt('n7', -0.45), 3); ev['pull'] = round(vt('n7', 3.0), 3); ev['end'] = round(end('n7', 0.5), 3)
        place(b, cutoff(wardrums(ev['night'], 0.16), ev['wink'] - 0.1), 0)
        place(b, ting(0.22), ev['wink'])
        place(b, whoosh(0.4, 0.15), ev['night'])
        place(b, crickets(T - ev['night'], 0.02), ev['night'])
        place(b, musicbox(T - ev['night'], 0.065), ev['night'])
        place(b, sparkle(0.15), ev['end'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['ev'])
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
