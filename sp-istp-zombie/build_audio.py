# ISTP 좀비편 — 장면별 음성(v{i}.wav) + 효과음(x{i}.wav) 생성
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def load(name):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'silenceremove=stop_periods=-1:stop_duration=0.25:stop_threshold=-42dB:stop_silence=0.2,atempo='+('1.15' if name[0]=='n' else '1.0' if name[0] in 'phm' else '1.1'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
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
    if name == 'n1':  # 제목 멘트: 쉬는 틈 압축 + 1.3배속
        raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', 'lines/n1.wav', '-filter_complex', '[0]atrim=0:1.92,asetpts=N/SR/TB[a];[0]atrim=2.14,asetpts=N/SR/TB[b];[a][b]concat=n=2:v=0:a=1,atempo=1.2', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
        x = np.frombuffer(raw, np.float32).copy(); a = np.where(np.abs(x) > 0.01)[0]; return x[max(0, a[0] - 600):a[-1] + 2400]
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


def megaphone(x, echo=True):
    y = filt(x, 'bandpass', [450, 3200], 4); y = np.tanh(y * 3.0) * 0.5
    if echo:
        d = int(0.16 * SR); z = np.zeros(len(y) + d * 3); z[:len(y)] += y
        for k in (1, 2, 3): z[d * k:d * k + len(y)] += y * (0.32 ** k)
        y = z
    return y / (np.abs(y).max() + 1e-9) * 0.75
def radio(x):
    y = filt(x, 'bandpass', [500, 2800], 4); y = np.tanh(y * 2.2) * 0.6
    return y / (np.abs(y).max() + 1e-9) * 0.7 + filt(noise(len(y) / SR), 'highpass', 3000) * 0.01
def rumble(dur, vol=0.12):  # 지하철 덜컹
    n = int(dur * SR); t = np.arange(n) / SR
    b = filt(brown(dur + 0.5), 'lowpass', 180)[:n]; b = b / (np.abs(b).max() + 1e-9)
    clack = np.zeros(n); k = 0.0
    while k < dur:
        place(clack, filt(noise(0.05), 'bandpass', [200, 1400], 2) * env(int(0.05 * SR), 0.0005, 0.015) * 0.9, k)
        place(clack, filt(noise(0.05), 'bandpass', [200, 1400], 2) * env(int(0.05 * SR), 0.0005, 0.015) * 0.7, k + 0.14)
        k += 1.05
    return (b * (0.8 + 0.2 * np.sin(2 * np.pi * 0.6 * t)) + clack * 0.5) * vol
def flicker(vol=0.05):
    return filt(noise(0.12), 'bandpass', [2000, 7000], 2) * env(int(0.12 * SR), 0.001, 0.03) * vol
def glassbang(vol=0.55):
    x = filt(sine(95, 55, 0.5, 0.12, 0.001), 'lowpass', 500) * 0.9
    c = filt(noise(0.25), 'bandpass', [1500, 6000], 2) * env(int(0.25 * SR), 0.0005, 0.06) * 0.6
    x[:len(c)] += c; return x / (np.abs(x).max() + 1e-9) * vol
def doorslide(vol=0.25):
    x = filt(noise(0.7), 'bandpass', [300, 1800], 2) * np.sin(np.linspace(0, np.pi, int(0.7 * SR))); return x / (np.abs(x).max() + 1e-9) * vol
def swipe(vol=0.12): return fadeout(filt(whoosh(0.18, 1), 'highpass', 2500)) * vol
def scratch(dur, vol=0.12):  # 문 긁는 소리
    out = np.zeros(int(dur * SR)); t = 0.2
    while t < dur - 0.6:
        L = 0.35 + rs.random() * 0.3; n = int(L * SR)
        s = filt(noise(L), 'bandpass', [900, 4500], 2) * np.sin(np.linspace(0, np.pi, n)) ** 0.7 * (0.6 + 0.4 * np.sin(np.linspace(0, 40, n)))
        place(out, s * vol, t); t += L + 0.25 + rs.random() * 0.45
    return out
def heli(dur, vol=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    b = filt(brown(dur + 0.5), 'lowpass', 400)[:n]; b = b / (np.abs(b).max() + 1e-9)
    return b * (0.45 + 0.55 * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 11 * t)))) * vol
def blind(vol=0.3):  # 블라인드 촥
    x = filt(noise(0.35), 'bandpass', [1200, 6000], 2) * env(int(0.35 * SR), 0.002, 0.09)
    for i in range(10): place(x, filt(noise(0.012), 'highpass', 3000) * 0.6, i * 0.025)
    return x / (np.abs(x).max() + 1e-9) * vol
def crickets(dur, vol=0.04):
    out = np.zeros(int(dur * SR)); t = 0.1
    while t < dur - 0.3:
        for k in range(3): place(out, sine(4400, 4400, 0.03, 0.01) * vol, t + k * 0.05)
        t += 0.55
    return out
def static(vol=0.15): return filt(noise(0.35), 'bandpass', [1500, 5000], 2) * env(int(0.35 * SR), 0.003, 0.12) * vol
def slurp(vol=0.12):
    x = filt(noise(0.5), 'bandpass', [600, 3500], 2) * np.sin(np.linspace(0, np.pi, int(0.5 * SR))) * (0.5 + 0.5 * np.sin(np.linspace(0, 70, int(0.5 * SR))))
    return x / (np.abs(x).max() + 1e-9) * vol
def newsjingle(vol=0.12):
    x = np.zeros(int(1.2 * SR))
    for i, f in enumerate([523, 659, 784, 1046]): place(x, sine(f, f, 0.5, 0.2) * 0.5, i * 0.12)
    return x * vol
def hangup(vol=0.18):
    x = np.zeros(int(0.6 * SR))
    for k in (0, 0.22): place(x, sine(480, 480, 0.16, None) * env(int(0.16 * SR), 0.005), k)
    return filt(x, 'lowpass', 2000) * vol
def vib(vol=0.0): return np.zeros(int(0.1 * SR))

_load2 = load
def load(name):
    x = _load2(name)
    if name in ('b1', 'c1'): return megaphone(x)
    if name == 'c2': return radio(x)
    return x

# ---------- 장면 구성: (이름, 직전 줄 끝에서 띄우는 간격) ----------
SC = [
    [('n1', 0.35), ('z1', 2.3), ('p1', 0.9), ('n2', 3.7)],
    [('b1', 1.0), ('n3', 0.7)],
    [('n4', 1.5), ('m1', 0.7), ('h1', 0.3), ('m2', 0.3), ('h2', 0.3), ('m3', 0.3), ('z2', 0.9), ('n5', 0.5)],
    [('t1', 0.9), ('z1', 1.7), ('t2', 0.6), ('n9', 1.1)],
    [('c2', 4.3), ('n7', 2.6), ('n8', 1.7)],
]
POST = {0: 0.2, 1: 0.3, 2: 0.3, 3: 0.2, 4: 2.3}
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
        D = {'bang': ve('n1', 0.25), 'turn': ve('n1', 1.0), 'door': vt('z1', -0.3), 'quiet': ve('z1', 0.15), 'look': ve('z1', 0.35),
             'sit': ve('p1', 0.5), 'notif': vt('n2', -2.75), 'press': vt('n2', -1.6), 'swipe': vt('n2', -1.25)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += rumble(T, 0.14)
        for k in (0.4, 0.55, 1.6, 2.9): place(b, flicker(0.06), k)
        place(b, glassbang(0.6), D['bang']); place(b, glassbang(0.4), D['bang'] + 0.45)
        tension = (drone(T, 0.12, 49) + scrape(T, 0.05)) * np.clip((D['quiet'] - tt) / 0.08, 0, 1)
        b += tension
        h2, times = hb_track(T, D['bang'] + 0.3, D['door'] + 0.05, 80, 150, 0.45); b += h2; ev['beats'] = times
        place(b, doorslide(0.3), D['door'] - 0.2)
        place(b, sine(150, 140, 0.05, 0.02) * 0, D['quiet'])
        place(b, ding(0.22), D['notif']); place(b, buzz(0.18), D['notif'])
        place(b, tap(0.35), D['press']); place(b, whoosh(0.45, 0.3), D['swipe'] + 0.15)
    elif si == 1:
        D = {'chat': ve('b1', 0.35)}
        m = [D['chat'] + 0.15, D['chat'] + 0.95, D['chat'] + 1.85]
        D.update({'m1': m[0], 'm2': m[1], 'm3': m[2], 'read': m[2] + 0.7, 'cross': vt('n3', -0.15), 'shelter': vt('n3', 2.0)})
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += wind(T, 0.04)
        place(b, calm(T - D['cross'], 0.05), D['cross'])
        place(b, wind(T - D['shelter'], 0.06), D['shelter'])
    elif si == 2:
        D = {'ring': vt('n4', 2.15), 'answer': vt('m1', -0.45), 'hang': ve('m3', 0.1), 'pass': vt('z2', -0.3), 'calm': ve('m3', 0.1)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += (drone(T, 0.1, 47) + scrape(T, 0.04)) * np.clip((D['hang'] - tt) / 0.3, 0, 1)
        b += scratch(T, 0.14) * np.clip((D['pass'] + 0.6 - tt) / 0.4, 0, 1)
        h2, times = hb_track(T, 0.2, D['ring'], 90, 140, 0.42); b += h2; ev['beats'] = times
        place(b, hangup(0.2), D['hang'])
        for i in range(5): place(b, step(0.13), D['pass'] + 0.4 + i * 0.35)
        place(b, hum(T - D['calm'], 0.02), D['calm'])
    elif si == 3:
        D = {'grid': ve('t1', 0.1), 'camon': vt('z1', -0.7), 'big': vt('z1', 0.6), 'award': ve('t2', 0.25)}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += hum(T, 0.02)
        place(b, ding(0.18), 0.15)
        for i in range(12): place(b, tick(0.06), D['grid'] + i * 0.05)
        place(b, buzz(0.12), D['camon'] - 0.05); place(b, ding(0.2), D['camon'])
        place(b, stamp(0.3), D['award']); place(b, ding(0.22), D['award'] + 0.05)
    elif si == 4:
        D = {'land': vt('c2', -2.75), 'nod': vt('c2', -1.6), 'radio': vt('c2', -0.35), 'leave': ve('c2', 0.4), 'slurp': ve('c2', 1.2), 'year': vt('n7', -1.0),
             'pull': ve('n7', 0.25), 'end': info[si]['len'] + LEAD + 0.75 - 1.6}
        ev.update({k: round(x, 3) for k, x in D.items()})
        b += heli(T, 0.13) * np.clip((D['leave'] + 1.6 - tt) / 1.6, 0, 1)
        b += drone(T, 0.1, 50) * np.clip((D['nod'] + 0.1 - tt) / 0.1, 0, 1)
        h2, times = hb_track(T, 0.2, D['nod'], 90, 150, 0.45); b += h2; ev['beats'] = times
        place(b, sine(220, 180, 0.4, 0.15) * 0.15, D['land'])
        place(b, static(0.18), D['radio']); place(b, static(0.14), ve('c2', 0.05))
        place(b, slurp(0.18), D['slurp'])
        place(b, newsjingle(0.14), D['year'])
        place(b, calm(T - D['pull'], 0.05), D['pull'])
        place(b, ding(0.25), D['end'])
    save(b, f'audio/x{si + 1}.wav')

for si in range(len(SC)):
    ev = {}; sfx(si, ev); info[si]['ev'] = ev
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
for i, x in enumerate(info): print(i, x['len'], x['lines'], {k: v for k, v in x['ev'].items() if k != 'beats'})
print('segs', {k: v for x in info for k, v in x['segs'].items() if len(v) > 1})
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
