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
    [('n0', 0.7)],
    [('k0', 0.35), ('n1', 0.55)],
    [('d0', 0.9), ('s0', 0.25), ('s1', 0.7), ('d1', 0.3), ('n2', 0.6)],
    [('c0', 0.25), ('c1', 0.9), ('c2', 0.9), ('n3', 0.45)],
    [('c3', 0.55), ('n4', 3.1), ('c4', 0.35)],
    [('c5', 2.3)],
    [('g0', 0.5), ('s2', 0.95), ('g1', 0.7), ('n5', 0.55)],
    [('n6', 1.8)],
]
POST = {0: 0.3, 1: 0.9, 2: 0.3, 3: 0.4, 4: 0.6, 5: 1.3, 6: 0.5, 7: 2.0}
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
    if si == 0:
        b += crowd(T, 0.08, 3); place(b, roar(2.5, 0.22, 4), 0.1)
        D = D_(fw1=0.35, fw2=1.4, fw3=2.6)
        for k in ('fw1', 'fw2', 'fw3'): place(b, boom(0.18), D[k])
    elif si == 1:
        D = D_(bang=vt('k0', -0.25), stiff=ve('k0', -1.4), go=vt('n1', 0.2))
        b += filt(crowd(T, 0.05, 5), 'lowpass', 400)  # 벽 너머 함성
        place(b, bang(0.55), D['bang'])
        locks = [round(D['go'] + i * (L['n1'][1] - 0.2) / 11, 3) for i in range(11)]; ev['locks'] = locks
        for i, x in enumerate(locks): place(b, step(0.08), x - 0.15); place(b, lock(0.22), x)
    elif si == 2:
        b += crowd(T, 0.07, 6)
        D = D_(drib=0.25, face=vt('d0', -0.3), blush=vt('s0', -0.1), steal=ve('s0', 0.2), blush2=vt('d1', -0.05), back=ve('d1', 0.15))
        for i in range(5): place(b, kick(0.18), 0.3 + i * 0.32)
        place(b, roar(1.6, 0.15, 7), 0.3)
        place(b, sparkle(0.12), D['blush']); place(b, kick(0.2), D['steal']); place(b, sparkle(0.12), D['blush2']); place(b, kick(0.2), D['back'])
        ping = [round(ve('d1', 0.6) + i * 0.32, 3) for i in range(int((T - ve('d1', 0.6)) / 0.32))]; ev['ping'] = ping
        for x in ping: place(b, kick(0.12), x)
    elif si == 3:
        b += crowd(T, 0.07, 8) * np.clip(1 - (tt - ve('c1', 0.3)) / 0.6, 0.15, 1)
        D = D_(cross=0.2, whiff=ve('c0', 0.45), sit=ve('c1', 0.25), booth=vt('c2', -0.35), stop=ve('c2', 0.1))
        place(b, kick(0.25), D['cross']); place(b, whoosh(0.5, 0.18), D['whiff'] - 0.25); place(b, roar(1.2, 0.12, 9), D['whiff'])
        place(b, sadtone(0.1), D['sit']); place(b, whistle(0.16, 0.8), D['stop'])
    elif si == 4:
        b += crowd(T, 0.08, 10)
        D = D_(run=0.2, slow=ve('c3', 0.05), real=ve('c3', 2.3), pass1=vt('n4', 0.7), keep=ve('n4', -0.4), boot=ve('n4', 0.05))
        place(b, roar(2.0, 0.2, 11), 0.2)
        for i in range(6): place(b, kick(0.16), 0.25 + i * 0.3)
        place(b, slowmo(0.25), D['slow']); place(b, dream(D['real'] - D['slow'] - 0.2, 0.1), D['slow'] + 0.2)
        h = np.zeros(N)
        for i in range(4): place(h, heartbeat(0.45), D['real'] + i * 0.42)
        b += h
        for i in range(5): place(b, shutter(0.12), D['real'] + 0.1 + i * 0.13)
        passes = [round(D['pass1'] + i * 0.55, 3) for i in range(int((D['keep'] - D['pass1']) / 0.55) + 1)]; ev['passes'] = passes
        for x in passes: place(b, kick(0.2), x)
        place(b, kick(0.4), D['boot']); place(b, whoosh(0.7, 0.2), D['boot'])
    elif si == 5:
        b += crowd(T, 0.06, 12) * np.clip(1 - (tt - vt('c5', -0.6)) / 0.5, 0.0, 1) + crowd(T, 0.012, 13)
        D = D_(m1=0.25, m2=0.95, m3=1.65, walk=2.35, place=ve('c5', 0.25), breath=ve('c5', 0.8))
        for k in ('m1', 'm2', 'm3'): place(b, kick(0.3), D[k] + 0.25); place(b, roar(0.6, 0.08, 14), D[k] + 0.3)
        for i in range(5): place(b, step(0.1), D['walk'] + i * 0.4)
        h = np.zeros(N)
        for i in range(int((T - D['place']) / 0.75)): place(h, heartbeat(0.4), D['place'] + i * 0.75)
        b += h
    elif si == 6:
        b += crowd(T, 0.012, 15) + drone(T, 0.05, 55)
        D = D_(mom=ve('g0', 0.2), gran=ve('s2', -0.6), both=ve('g1', 0.1))
        h = np.zeros(N)
        for i in range(int(T / 0.85)): place(h, heartbeat(0.32), 0.2 + i * 0.85)
        b += h
        place(b, pad(D['gran'] - D['mom'] + 1.5, [392, 494, 587], 0.07, 0.4, 0.6), D['mom'])
        place(b, pad(T - D['gran'], [349, 440, 523], 0.07, 0.5, 0.8), D['gran'])
    elif si == 7:
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
