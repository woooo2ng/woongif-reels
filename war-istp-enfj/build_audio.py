# ISTP 나라 vs ENFJ 나라 전쟁편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) + audio/timing.json
from audiolib import *
SC = [
    [('n1', 0.2), ('g1', 0.45), ('n2', 0.4), ('k1', 1.1)],
    [('e1', 0.5), ('s1', 0.3), ('e2', 0.4), ('s2', 0.5), ('n3', 0.9)],
    [('e3', 0.3), ('e4', 0.05), ('s3', 0.5), ('e5', 1.3), ('n4', 0.3)],
    [('e6', 0.5), ('s4', 1.3), ('e7', 0.25), ('n5', 0.5)],
    [('g2', 2.0), ('n6', 0.5)],
    [('g3', 2.1), ('k2', 0.3), ('g4', 1.9), ('k3', 0.5), ('k4', 1.7), ('n7', 0.4), ('n8', 0.9)],
]
POST = {0: 0.3, 1: 0.3, 2: 0.2, 3: 0.3, 4: 0.3, 5: 1.7}
SPEED = {'g1': 1.1, 'g2': 1.05, 'k3': 1.05, 'k4': 1.05, 'n7': 1.12, 'n8': 1.08, 'n1': 1.12, 'e5': 1.1, 'e6': 1.05, 'e7': 1.0, 'g3': 1.1, 'g4': 1.1, 'k2': 1.1}
def loadv(name):
    sp = SPEED.get(name, 1.2)
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', f'atempo={sp}' if sp != 1 else 'anull', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]
    x = x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x
    # 문장 안 긴 쉼 압축 (0.3초 넘는 무음 → 0.28초)
    fr = int(0.02 * SR); n = len(x) // fr; lv = np.array([np.abs(x[i*fr:(i+1)*fr]).max() for i in range(n)]); keep = []; i = 0
    while i < n:
        j = i
        while j < n and lv[j] < 0.012: j += 1
        if j - i > 15 and i > 0 and j < n: keep.append((i, i + 7)); keep.append((j - 7, j)); i = j
        elif j > i: keep.append((i, j)); i = j
        else: keep.append((i, i + 1)); i += 1
    x = np.concatenate([x[a*fr:b*fr] for a, b in keep] + [x[n*fr:]])
    if name == 'e5': x = filt(x, 'highpass', 180) * 1.1  # 속마음: 살짝 가볍게
    return x
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        x = loadv(name); t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st in xs: place(v, x, st)
    save(v, f'audio/v{si + 1}.wav'); info.append({'len': round(T, 3), 'lines': starts})

def crickets(dur, vol=0.04):
    out = np.zeros(int(dur * SR)); tt = 0.1
    while tt < dur - 0.5:
        for k in range(3): place(out, sine(4300, 4500, 0.05, 0.02) * vol, tt + k * 0.07)
        tt += 0.8 + rs.random() * 0.5
    return out
def pad(dur, chord=(261.6, 329.6, 392.0, 523.3), vol=0.05):
    x = sum(sine(f, f, dur, None, 0.6) + sine(f * 2.0, f * 2.0, dur, None, 0.6) * 0.25 for f in chord)
    t = np.arange(len(x)) / SR; e = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2).clip(0)
    return filt(x * e, 'lowpass', 2500) / (np.abs(x).max() + 1e-9) * vol
def sniff(vol=0.08): return filt(noise(0.25), 'bandpass', [1500, 5000], 2) * env(int(0.25 * SR), 0.05, 0.08) * vol
def zap(vol=0.3):  # 깨달음 번개
    x = filt(noise(0.5), 'highpass', 1500) * env(int(0.5 * SR), 0.001, 0.12); s = sine(1800, 300, 0.5, 0.2, 0.001)
    return (x * 0.6 + s * 0.5) / 1.1 * vol
def can(vol=0.25):  # 캔 '치익'
    a = filt(noise(0.05), 'bandpass', [2000, 6000], 2) * env(int(0.05 * SR), 0.0005, 0.01); b = filt(noise(0.5), 'highpass', 3000) * env(int(0.5 * SR), 0.005, 0.2) * 0.5
    x = np.zeros(int(0.6 * SR)); x[:len(a)] += a; x[int(0.04 * SR):int(0.04 * SR) + len(b)] += b; return x * vol
def rustle(dur=0.6, vol=0.1): return filt(noise(dur), 'bandpass', [1200, 6000], 2) * np.sin(np.linspace(0, np.pi, int(dur * SR))) * vol
LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda n, k=0: LEAD + L[n][0] + k; end = lambda n, k=0: LEAD + L[n][0] + L[n][1] + k
    b = np.zeros(int(T * SR))
    if si == 0:
        b += wind(T, 0.025)
        for k in range(int(end('n1', 0.3) / 0.5)): place(b, drum(0.3), 0.15 + k * 0.5)
        place(b, steps(end('n1', 0.4), 0.09, 0.1), 0.1)
        ev['rise'] = round(end('n1', 0.05), 3); place(b, rumble(1.2, 0.15), ev['rise']); place(b, fanfare(0.14), ev['rise'] + 0.5)
        place(b, pad(end('n2') - ev['rise'] + 0.8, vol=0.06), ev['rise'] + 0.4)
        ev['cry'] = round(end('g1', 0.0), 3); place(b, clap(0.25), ev['cry']); place(b, clap(0.2), ev['cry'] + 0.9)
        ev['chip'] = round(end('n2', 0.15), 3); place(b, ding(0.25), ev['chip'])
        ev['pop'] = round(vt('k1', -0.55), 3); place(b, pop(0.4), ev['pop'])
    elif si == 1:
        b += wind(T, 0.02); ev['chip'] = 0.25; place(b, ping(0.12), 0.25)
        ev['close'] = round(end('s2', 0.25), 3); place(b, chirp(0.04), ev['close'] + 0.3)
    elif si == 2:
        b += wind(T, 0.02)
        place(b, sparkle(0.12), vt('e3', 0.2)); place(b, sparkle(0.12), vt('e4', 0.2))
        ev['chip'] = round(end('e4', 0.0), 3); place(b, ping(0.1), ev['chip'])
        ev['walk'] = round(end('s3', 0.1), 3); place(b, steps(1.2, 0.3, 0.07), ev['walk'])
        ev['night'] = round(vt('e5', -0.55), 3); place(b, whoosh(0.5, 0.15), ev['night'] - 0.2)
        place(b, crickets(T - ev['night'], 0.03), ev['night']); place(b, scribble(T - ev['night'] - 0.3, 0.035), ev['night'] + 0.3)
    elif si == 3:
        b += wind(T, 0.018); place(b, sniff(0.06), vt('e6', 1.2)); place(b, sniff(0.05), vt('e6', 3.4))
        ev['pause'] = round(end('e6', 0.1), 3)
        ev['bolt'] = round(vt('e7', -0.05), 3); place(b, zap(0.35), ev['bolt'])
        ev['chip'] = round(vt('n5', 0.1), 3); place(b, ding(0.2), ev['chip'] + 0.6)
    elif si == 4:
        b += wind(T, 0.015); place(b, rustle(0.7, 0.12), 0.2)
        ev['zoom'] = round(vt('g2', -1.2), 3); place(b, whoosh(0.4, 0.12), ev['zoom'] - 0.15)
        ev['chip'] = round(vt('g2', -0.6), 3); place(b, ping(0.1), ev['chip'])
        place(b, pad(T - vt('g2'), (220, 277.2, 329.6, 440), 0.045), vt('g2'))
    elif si == 5:
        b += wind(T, 0.02)
        ev['wake'] = 0.9; place(b, chirp(0.05), 1.0); place(b, chirp(0.04), 2.0)
        ev['find'] = 1.5
        ev['hand'] = round(end('k2', 0.35), 3); ev['insert'] = round(ev['hand'] + 0.9, 3); place(b, pop(0.35), ev['insert'])
        ev['screen'] = round(ev['insert'] + 0.5, 3)
        ev['flash'] = round(end('k3', 0.15), 3); place(b, whoosh(0.5, 0.14), ev['flash'] - 0.1)
        ev['tears'] = round(ev['flash'] + 1.1, 3); ev['chip'] = round(ev['tears'] + 0.15, 3); place(b, ping(0.1), ev['chip'])
        ev['sunset'] = round(vt('n7', -0.3), 3)
        place(b, pad(T - ev['flash'], (261.6, 329.6, 392.0, 493.9), 0.05), ev['flash'])
        ev['tl'] = round(vt('n8', -0.2), 3); place(b, whoosh(0.6, 0.12), ev['tl'] - 0.1)
        ev['stat'] = round(vt('n8', 0.05), 3); place(b, stamp(0.3), ev['stat'] + 0.1)
        ev['end'] = round(end('n8', 0.4), 3); place(b, chirp(0.04), ev['end'])
    save(b, f'audio/x{si + 1}.wav')
for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], x['ev'])
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
