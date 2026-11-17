# 라곰 협업: 무인도편 — 음성 자르기 + 장면 배치 + 효과음 → audio/full.wav, timing.json
import numpy as np, subprocess, json, os
from scipy.signal import butter, sosfilt
SR = 48000
os.makedirs('audio', exist_ok=True)
rs = np.random.default_rng(7)

def cut(src, a, b, tempo=1.0):
    af = f'atrim={max(0,a-0.03):.3f}:{b+0.06:.3f},asetpts=PTS-STARTPTS' + (f',atempo={tempo}' if tempo != 1 else '')
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', src, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    x = np.frombuffer(raw, np.float32).copy()
    n = min(len(x), int(0.02 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x
# ---------- 효과음 ----------
def env(n, a=0.003, d=None):
    t = np.arange(n) / SR; e = np.minimum(1, t / a)
    if d: e = e * np.exp(-t / d)
    return e
def tone(f, d, dec, vol, h=(0.35, 0.12)):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2*np.pi*f*t) + h[0]*np.sin(2*np.pi*f*2.01*t) + h[1]*np.sin(2*np.pi*f*3*t)
    return x * env(n, 0.004, dec) * vol
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def alarm(reps=3, vol=0.16):  # 삐비빅 삐비빅
    out = np.zeros(int(reps * 0.5 * SR))
    for r_ in range(reps):
        for k in range(3):
            n = int(0.07 * SR); t = np.arange(n) / SR
            b = np.sign(np.sin(2*np.pi*2100*t)) * 0.5 * env(n, 0.002) * np.linspace(1, 0.7, n) * vol
            i = int((r_ * 0.5 + k * 0.1) * SR); out[i:i+n] += b
    return out
def slap(vol=0.4):
    n = int(0.09 * SR); return bp(rs.standard_normal(n), 300, 3000) * env(n, 0.0005, 0.018) * vol * 3
def click(vol=0.3):
    n = int(0.04 * SR); return rs.standard_normal(n) * env(n, 0.0005, 0.005) * vol
def swoosh(vol=0.12, d=0.45, lo=600, hi=3000):
    n = int(d * SR); return bp(rs.standard_normal(n), lo, hi) * np.sin(np.linspace(0, np.pi, n)) * vol * 3
def ping(vol=0.16):
    return tone(1320, 0.25, 0.07, vol) + np.pad(tone(1760, 0.2, 0.05, vol*0.7), (int(0.05*SR), 0))[:int(0.25*SR)]
def send(vol=0.18): return tone(990, 0.12, 0.04, vol)
def gasp(vol=0.25):  # 띠용
    n = int(0.35 * SR); t = np.arange(n)/SR; f = 500 + 900*t/0.35
    return np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.003, 0.15) * vol
def steps(nst=6, gap=0.11, vol=0.25):
    out = np.zeros(int((nst*gap+0.1)*SR))
    for k in range(nst):
        n = int(0.05*SR); s = bp(rs.standard_normal(n), 150, 900) * env(n, 0.001, 0.015) * vol * 3
        i = int(k*gap*SR); out[i:i+n] += s
    return out
def water(d, vol=0.05):
    n = int(d * SR); w = bp(rs.standard_normal(n), 1500, 7000) * vol
    f = int(0.3*SR); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f); return w
def squish(vol=0.3):  # 펌프 '쭉'
    n = int(0.22 * SR); t = np.arange(n)/SR
    return bp(rs.standard_normal(n), 200, 1200) * np.sin(np.linspace(0, np.pi, n)) * vol * 2 + np.sin(2*np.pi*(180+200*t)*t) * env(n, 0.005, 0.08) * vol * 0.4
def foam(d=1.2, vol=0.05):  # 보글보글
    out = np.zeros(int(d*SR)); t = 0.0
    while t < d - 0.06:
        f = rs.uniform(900, 2200); n = int(0.035*SR); k = np.arange(n)/SR
        b = np.sin(2*np.pi*(f + 1500*k/0.035)*k) * env(n, 0.002, 0.01) * vol * rs.uniform(0.5, 1)
        i = int(t*SR); out[i:i+n] += b; t += rs.uniform(0.03, 0.09)
    return out
def splash(vol=0.25):
    n = int(0.5*SR); return bp(rs.standard_normal(n), 800, 6000) * env(n, 0.003, 0.15) * vol * 2
def sparkle(vol=0.08):
    out = np.zeros(int(0.7*SR))
    for k, f in enumerate([2093, 2637, 3136, 4186]):
        x = tone(f, 0.4, 0.12, vol, (0.1, 0.0)); i = int(k*0.07*SR); out[i:i+len(x)] += x
    return out
def shutter(vol=0.35):
    a = click(vol); b = np.pad(click(vol*0.8), (int(0.06*SR), 0)); x = np.zeros(int(0.12*SR)); x[:len(a)] += a; x[:len(b)] += b[:len(x)]; return x
def poof(vol=0.1): return swoosh(vol, 0.22, 400, 2500)
def shimmer(vol=0.07):  # 침대 후광 '아~'
    n = int(1.2*SR); t = np.arange(n)/SR
    x = sum(np.sin(2*np.pi*f*t) for f in [523, 659, 784, 1047]) / 4
    return x * np.sin(np.linspace(0, np.pi, n)) * vol
def thud(vol=0.3):
    n = int(0.18*SR); t = np.arange(n)/SR; return np.sin(2*np.pi*(90-40*t)*t) * env(n, 0.003, 0.06) * vol
def music(d, vol=0.07, bpm=128):  # 노래방 반주(간단한 신스 + 킥)
    n = int(d*SR); out = np.zeros(n); beat = 60/bpm
    mel = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587]
    bass = [131, 131, 175, 175, 147, 147, 196, 196]
    k = 0; t = 0.0
    while t < d:
        i = int(t*SR)
        kk = thud(vol*2.2); out[i:i+len(kk)] += kk[:max(0, n-i)]
        b = tone(bass[(k//2) % 8], beat*0.9, 0.2, vol*0.9, (0.5, 0.3)); out[i:i+len(b)] += b[:max(0, n-i)]
        for h in range(2):
            j = int((t + h*beat/2)*SR)
            if j < n:
                m = tone(mel[(k*2+h) % 16], beat*0.45, 0.12, vol*0.7, (0.6, 0.4)); out[j:j+len(m)] += m[:n-j]
        hh = int((t + beat/2)*SR)
        if hh < n:
            c = click(vol*0.6); out[hh:hh+len(c)] += c[:n-hh]
        t += beat; k += 1
    f = int(0.3*SR); out[-f:] *= np.linspace(1, 0, f); return out

