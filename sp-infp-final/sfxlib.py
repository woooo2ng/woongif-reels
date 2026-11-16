# 공통 효과음 도구 (좀비편 build_audio.py에서 가져옴)
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def load(name):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f'lines/{name}.wav', '-af', 'silenceremove=stop_periods=-1:stop_duration=0.25:stop_threshold=-42dB:stop_silence=0.2,atempo='+('1.15' if name[0]=='n' else '1.08' if name[0]=='z' else '1.1'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
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
def drone(dur, vol=0.18, f=55):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.7 * np.sin(2 * np.pi * (f * 1.06) * t) + 0.3 * np.sin(2 * np.pi * f * 2.02 * t)
    x = x * np.minimum(1, t / 1.0); return x / (np.abs(x).max() + 1e-9) * vol
def step(vol=0.12): return filt(noise(0.08), 'bandpass', [150, 1200], 2) * env(int(0.08 * SR), 0.001, 0.02) * vol
def drone(dur, vol=0.18, f=55):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.7 * np.sin(2 * np.pi * (f * 1.06) * t) + 0.3 * np.sin(2 * np.pi * f * 2.02 * t)
    x = x * np.minimum(1, t / 1.0); return x / (np.abs(x).max() + 1e-9) * vol
def pad(dur, freqs, vol=0.1, att=0.6, rel=0.8):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t) + 0.15 * np.sin(2 * np.pi * f * 3 * t) for f in freqs)
    e = np.minimum(1, t / att) * np.minimum(1, (dur - t) / rel).clip(0, 1)
    return x * e / len(freqs) * vol
