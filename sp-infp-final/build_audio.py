# INFP 결승전편 1부 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) + audio/timing.json
from sfxlib import *

def load(name):
    tempo = '1.15' if name[0] == 'n' else '1.05' if name in ('g0', 's2', 'c2') else '1.1'
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-42dB:stop_silence=0.22,atempo=' + tempo, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    a = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, a[0] - 600):a[-1] + 2400] if len(a) else x

# ---------- 경기장 효과음 ----------
def crowd(dur, vol=0.1, seed=0):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    x = filt(r.standard_normal(n), 'bandpass', [250, 2600], 2)
    x += filt(r.standard_normal(n), 'bandpass', [600, 1400], 2) * 0.6 * (0.6 + 0.4 * np.sin(t * 1.3 + 2))
    x *= 0.75 + 0.25 * np.sin(t * 0.7) * np.sin(t * 2.3 + 1)
    return x / (np.abs(x).max() + 1e-9) * vol
def roar(dur=2.5, vol=0.3, seed=1):  # 함성 확 올라왔다 내려감
    x = crowd(dur, 1, seed); t = np.arange(len(x)) / SR
    e = np.minimum(1, t / 0.25) * np.exp(-np.maximum(0, t - 0.6) / (dur * 0.45))
    return x * e * vol
def whistle(vol=0.22, dur=0.55):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 2900 + 120 * np.sin(2 * np.pi * 34 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.minimum(1, t / 0.02) * np.minimum(1, (dur - t) / 0.05) * vol
def kick(vol=0.45):
    s = sine(160, 55, 0.25, 0.05, 0.0005); c = filt(noise(0.03), 'bandpass', [800, 4000], 2) * env(int(0.03 * SR), 0.0002, 0.006)
    x = np.zeros(int(0.3 * SR)); x[:len(s)] += s; x[:len(c)] += c * 0.8; return x * vol
def lock(vol=0.25):  # 화장실 문 '철컥'
    x = np.zeros(int(0.2 * SR)); place(x, tap(vol), 0); place(x, filt(noise(0.04), 'bandpass', [400, 2500], 2) * env(int(0.04 * SR), 0.0005, 0.01) * vol * 1.4, 0.07); return x
def bang(vol=0.5):  # 작전판 '쾅'
    return stamp(vol)
def sparkle(vol=0.12):  # 칭찬에 녹는 '뾰로롱'
    x = np.zeros(int(0.7 * SR))
    for i, f in enumerate([1046, 1318, 1568, 2093]): place(x, sine(f, f, 0.22, 0.09) * vol, i * 0.07)
    return x
def dream(dur, vol=0.12):  # 상상 화면 몽글몽글 패드 + 하프 아르페지오
    x = pad(dur, [523, 659, 784], vol, 0.4, 0.5)
    for i in range(int(dur / 0.16)): place(x, sine([1046, 1318, 1568, 2093][i % 4], [1046, 1318, 1568, 2093][i % 4], 0.3, 0.12) * vol * 0.6, i * 0.16)
    return x[:int(dur * SR)]
def heartbeat(vol=0.5):
    a = sine(62, 38, 0.22, 0.06, 0.002); b = sine(55, 34, 0.2, 0.05, 0.002) * 0.7
    x = np.zeros(int(0.5 * SR)); x[:len(a)] += a; o = int(0.17 * SR); x[o:o + len(b)] += b
    return filt(x, 'lowpass', 160) * vol * 1.6
def slowmo(vol=0.3):  # 슬로모션 진입 '우웅'
    return sine(220, 70, 1.0, 0.5, 0.01) * vol + filt(whoosh(1.0, vol * 0.6), 'lowpass', 900)
def shutter(vol=0.18):
    x = np.zeros(int(0.15 * SR)); place(x, tap(vol), 0); place(x, tap(vol * 0.8), 0.06); return x
def sadtone(vol=0.12):
    return sine(392, 370, 0.35, 0.3) * vol + 0

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('n0', 0.5), ('k1', 0.6)],
    [('c7', 6.6), ('n7', 0.35)],
    [('c6', 0.7), ('y0', 4.3), ('n8', 0.9)],
    [('c3', 0.55), ('n4', 3.5), ('r0', 2.4), ('c4', 0.9)],
    [('c5', 2.3)],
    [('g0', 0.5), ('s2', 0.95), ('g1', 0.7), ('n5', 0.55)],
    [('n6', 1.8)],
]
POST = {0: 0.9, 1: 0.5, 2: 0.6, 3: 0.5, 4: 1.3, 5: 0.5, 6: 2.0}
info = []
for si, lines in enumerate(SC):
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        x = load(name)
        t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t, name)); t += len(x) / SR
    T = t + POST.get(si, 0)
    v = np.zeros(int(T * SR) + 1)
    for x, st, name in xs: place(v, x * (1.15 if name in ('g1', 's0') else 1.0), st)
    save(v, f'audio/v{si + 1}.wav')
    info.append({'len': round(T, 3), 'lines': starts})

LEAD = 0.25
def sfx(si, ev):
    T = info[si]['len'] + 0.7 + (0.3 if si == len(SC) - 1 else 0)
    L = info[si]['lines']; vt = lambda name, k=0: LEAD + L[name][0] + k
    ve = lambda name, k=0: LEAD + L[name][0] + L[name][1] + k
    b = np.zeros(int(T * SR)); N = len(b); tt = np.arange(N) / SR
    def D_(**d):
        ev.update({k: round(x, 3) for k, x in d.items()}); return {k: x for k, x in d.items()}
    if si == 0:  # 입장 터널
        b += filt(crowd(T, 0.07, 3), 'lowpass', 900); place(b, roar(3.5, 0.08, 4), 0)
        D = D_(walk=0.2, comfort=vt('k1', -0.1))
        for i in range(int(T / 0.45)): place(b, step(0.06), 0.2 + i * 0.45)
    elif si == 1:  # 응원가
        b += crowd(T, 0.06, 5) * np.clip(1 - (tt - 2.2) / 0.5, 0.25, 1)
        D = D_(run=0.2, song=2.35, stop1=3.6, stop2=5.3, sob=vt('c7', -0.1))
        for i in range(int(2.2 / 0.3)): place(b, sine(70, 45, 0.25, 0.08) * 0.35, 0.2 + i * 0.3)  # 북소리
        for i in range(7): place(b, step(0.1), 0.25 + i * 0.28)
        sg = load('song')
        ch = sg * 0.55
        for rate, dl, g in ((40000, 0.03, 0.45), (55000, 0.06, 0.35), (44000, 0.09, 0.3)):
            raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', 'lines/song.wav', '-af', f'asetrate={rate},aresample=48000,atempo={48000/rate:.4f}', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
            x = np.frombuffer(raw, np.float32).copy(); y = np.zeros(len(ch) + int(0.2 * SR)); y[int(dl * SR):int(dl * SR) + len(x)] += x[:len(y) - int(dl * SR)] * g; ch = np.pad(ch, (0, len(y) - len(ch))) + y
        ch = filt(ch, 'lowpass', 5000); rv = np.zeros(len(ch) + int(0.6 * SR))
        for k, g in ((0.0, 1), (0.11, 0.35), (0.23, 0.22), (0.37, 0.12)): rv[int(k * SR):int(k * SR) + len(ch)] += ch * g
        place(b, rv / (np.abs(rv).max() + 1e-9) * 0.42, D['song'])
        place(b, pad(T - D['song'], [261.6, 329.6, 392], 0.08, 0.6, 1.0), D['song'])
        place(b, pad(T - D['song'] - 2.6, [220, 277, 330], 0.07, 0.6, 1.0), D['song'] + 2.6)
    elif si == 2:  # 손편지
        b += crowd(T, 0.06, 6)
        D = D_(tackle=0.35, whistle=0.6, run=ve('c6', 0.05), pocket=ve('c6', 0.9), letter=ve('c6', 1.5), cry=vt('y0', -0.1), wave=ve('y0', 0.3))
        place(b, kick(0.4), D['tackle']); place(b, whoosh(0.4, 0.2), D['tackle'] - 0.1); place(b, whistle(0.22, 0.7), D['whistle'])
        for i in range(4): place(b, step(0.12), D['run'] + i * 0.22)
        place(b, sine(180, 120, 0.8, 0.4) * 0.12, D['pocket'] - 0.1)
        place(b, sparkle(0.12), D['letter']); place(b, filt(noise(0.25), 'bandpass', [2000, 6000], 2) * env(int(0.25 * SR), 0.01, 0.08) * 0.06, D['letter'])
        place(b, pad(T - D['letter'], [349, 440, 523], 0.07, 0.5, 0.8), D['letter'])
        place(b, roar(2.0, 0.1, 7), D['wave'])
    elif si == 3:  # 1대1
        b += crowd(T, 0.08, 10)
        D = D_(run=0.2, slow=ve('c3', 0.05), real=ve('c3', 2.1), pass1=vt('n4', -0.1), ref=vt('r0', -0.6), boot=ve('r0', 0.2))
        place(b, roar(2.0, 0.2, 11), 0.2)
        for i in range(6): place(b, kick(0.16), 0.25 + i * 0.3)
        place(b, slowmo(0.25), D['slow']); place(b, dream(D['real'] - D['slow'] - 0.2, 0.1), D['slow'] + 0.2)
        h = np.zeros(N)
        for i in range(3): place(h, heartbeat(0.45), D['real'] + i * 0.42)
        b += h; place(b, boom(0.12), D['real'])
        passes = [round(D['pass1'] + i * 0.62, 3) for i in range(int((D['ref'] - D['pass1']) / 0.62) + 1)]; ev['passes'] = passes
        for x in passes: place(b, kick(0.2), x)
        place(b, kick(0.45), D['boot']); place(b, whoosh(0.7, 0.2), D['boot']); place(b, roar(1.0, 0.12, 12), D['boot'] + 0.3)
    elif si == 4:
        b += crowd(T, 0.06, 12) * np.clip(1 - (tt - vt('c5', -0.6)) / 0.5, 0.0, 1) + crowd(T, 0.012, 13)
        D = D_(m1=0.25, m2=0.95, m3=1.65, walk=2.35, place=ve('c5', 0.25), breath=ve('c5', 0.8))
        for k in ('m1', 'm2', 'm3'): place(b, kick(0.3), D[k] + 0.25); place(b, roar(0.6, 0.08, 14), D[k] + 0.3)
        for i in range(5): place(b, step(0.1), D['walk'] + i * 0.4)
        h = np.zeros(N)
        for i in range(int((T - D['place']) / 0.75)): place(h, heartbeat(0.4), D['place'] + i * 0.75)
        b += h
    elif si == 5:
        b += crowd(T, 0.012, 15) + drone(T, 0.05, 55)
        D = D_(mom=ve('g0', 0.2), gran=ve('s2', -0.6), both=ve('g1', 0.1))
        h = np.zeros(N)
        for i in range(int(T / 0.85)): place(h, heartbeat(0.32), 0.2 + i * 0.85)
        b += h
        place(b, pad(D['gran'] - D['mom'] + 1.5, [392, 494, 587], 0.07, 0.4, 0.6), D['mom'])
        place(b, pad(T - D['gran'], [349, 440, 523], 0.07, 0.5, 0.8), D['gran'])
    elif si == 6:
        D = D_(run=0.25, shot=1.35, freeze=vt('n6', L['n6'][1] + 0.35))
        for i in range(4): place(b, step(0.12), D['run'] + i * 0.26)
        place(b, kick(0.55), D['shot']); place(b, slowmo(0.3), D['shot'] + 0.05)
        h = np.zeros(N)
        for i in range(int((D['freeze'] - D['shot']) / 0.6)): place(h, heartbeat(0.45), D['shot'] + 0.3 + i * 0.6)
        b += h * np.clip((D['freeze'] - tt) / 0.05, 0, 1)
        place(b, roar(0.6, 0.1, 16) * 0.5, D['shot'] + 0.1)
        place(b, filt(boom(0.25), 'lowpass', 300), D['freeze'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], {k: v for k, v in x['ev'].items() if k not in ('locks', 'ping', 'passes')})
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
