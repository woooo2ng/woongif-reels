# 홍보 릴스: 내레이션 배치 + 효과음(탭·타자·비·우산·하트·카드) + 오르골 BGM → voice.m4a
import numpy as np, subprocess, json
from fx_base import SR, cut, env, tone, bp, click, swoosh, ping, sparkle, rs
T = json.load(open('timing.json'))
D, VS, LEAD = T['D'], T['VS'], T['LEAD']
starts = [sum(D[:i]) for i in range(len(D))]; TOT = sum(D)
out = np.zeros(int((TOT + 0.5) * SR))
def put(x, t, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x))
    if i < len(out): out[i:j] += x[:j - i] * g
voice = np.zeros_like(out)
for si, (a, b) in enumerate(VS):
    x = cut('raw/narr.mp3', a, b); i = int((starts[si] + LEAD) * SR); voice[i:i+len(x)] += x[:len(voice)-i]
# ---------- 효과음 ----------
def bell(f, d, vol):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*6) + 0.25*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*10)
    return x * env(n, 0.002, d * 0.35) * vol
def raintex(d, vol=0.035):
    n = int(d * SR); x = bp(rs.standard_normal(n), 1500, 7000) * vol
    for _ in range(int(d * 40)):   # 빗방울 톡톡
        i = rs.integers(0, n - 2000); x[i:i+600] += bp(rs.standard_normal(600), 2500, 6000) * env(600, 0.0005, 0.004) * vol * 3
    f = int(0.3 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f); return x
def tap(vol=0.22): c = click(vol); t = tone(1800, 0.04, 0.012, vol * 0.25, (0, 0)); return c + t[:len(c)]
def key(vol=0.12): return click(vol) * 0.8
def umbrella_open(vol=0.3):
    s = swoosh(0.1, 0.3, 300, 1500); p = bp(rs.standard_normal(int(0.12 * SR)), 150, 900) * env(int(0.12 * SR), 0.001, 0.03) * vol * 2.5
    return np.concatenate([s, p])
def pop_(vol=0.25): n = int(0.12 * SR); t = np.arange(n) / SR; return np.sin(2*np.pi*(500 + 900*t/0.12)*t) * env(n, 0.002, 0.04) * vol
# 원곡 오르골(직접 만든 멜로디, C장조)
N = {'C':261.6,'D':293.7,'E':329.6,'F':349.2,'G':392.0,'A':440.0,'B':493.9,'c':523.3,'d':587.3,'e':659.3,'g':784.0}
MEL = list('EGcG' 'EGcd' 'cBAG' 'E-G-' 'FAcA' 'FAcd' 'edcB' 'c---')
def musicbox(d, vol=0.03, bpm=132, oct=2):
    n = int(d * SR); x = np.zeros(n); beat = 60 / bpm; t = 0.0; k = 0
    while t < d:
        nt = MEL[k % len(MEL)]; i = int(t * SR)
        if nt != '-': m = bell(N[nt] * oct, 1.3, vol); x[i:i+len(m)] += m[:max(0, n - i)]
        if k % 4 == 0: m = bell(N['C'] if (k // 16) % 2 == 0 else N['F'], 1.6, vol * 0.6); x[i:i+len(m)] += m[:max(0, n - i)]
        t += beat / 2; k += 1
    f = int(0.4 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f); return x

# 0: 비 오는 골목 + 오르골
put(raintex(D[0] + 0.2, 0.03), 0)
put(sparkle(0.05), starts[0] + 0.3)
# 1~3: 화면 탭·타자 (녹화 시각 → 장면 시각)
ph = T['phone']
for tt in T['taps']:
    for si in ('1', '2', '3'):
        a, b, sp = ph[si]['a'], ph[si]['b'], ph[si]['speed']
        if a <= tt < b: put(tap(), starts[int(si)] + (tt - a) / sp)
for tt in T['keys']:
    for si in ('1', '2', '3'):
        a, b, sp = ph[si]['a'], ph[si]['b'], ph[si]['speed']
        if a <= tt < b: put(key(), starts[int(si)] + (tt - a) / sp)
for si in (1, 2, 3): put(ping(0.08), starts[si] + 0.05)   # STEP 칩 팝
# 4: 비 → 우산 펼침 → 하트
put(raintex(D[4] + 0.1, 0.04), starts[4])
put(pop_(0.15), starts[4] + 0.2)                 # 아 비 온다…
put(pop_(0.15), starts[4] + 1.95)                # 같이 쓸래요?
put(umbrella_open(), starts[4] + 2.9)
put(pop_(0.18), starts[4] + 3.6)                 # …네!
put(sparkle(0.07), starts[4] + 4.4); put(pop_(0.2), starts[4] + 4.4)
# 5: 카드 팝 + 질문
put(pop_(0.25), starts[5] + 0.05); put(ping(0.12), starts[5] + 0.1)
Q = LEAD + T['V'][5] * 0.47; put(sparkle(0.06), starts[5] + Q)
# BGM: 처음부터 끝까지 오르골, 마지막 장면은 한 옥타브 밝게 살짝 크게
put(musicbox(starts[5] + 0.3, 0.034), 0)
put(musicbox(D[5] + 0.2, 0.042, 140, 4), starts[5])
mix = voice * 1.0 + out
mix = mix[:int(TOT * SR)]
mix.astype(np.float32).tofile('audio/full.f32')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'audio/full.f32',
    '-af', f'loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={TOT-0.4:.3f}:d=0.4', '-ac', '2', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', 'voice.m4a'], check=True)
def rms(x): return 20 * np.log10(np.sqrt(np.mean(x**2)) + 1e-9)
print('voice rms', round(rms(voice[voice != 0]), 1), 'bgm/fx rms', round(rms(out), 1), 'total', round(TOT, 2))
