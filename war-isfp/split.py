# 역할별 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect 결과로 구간 지정)
import subprocess, os
import numpy as np
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar_a.mp3': {'n1': (0, 3.27), 'n2': (3.84, 6.39), 'n3': (6.89, 13.41), 'n4': (13.94, 17.32), 'n5': (17.78, 25.02),
                   'n6': (25.55, 29.49), 'n7': (29.90, 32.85), 'n8': (33.28, 36.91), 'n9': (37.34, 40.79), 'n10': (41.27, 47.39)},
 'raw/gen_a.mp3': {'g1': (0, 2.50), 'g2': (3.09, 5.20), 'g3': (5.67, 6.15), 'g4': (6.85, 8.58), 'g5': (9.0, 10.14),
                   'g6': (10.63, 12.15), 'g7': (12.68, 14.79), 'g8': (15.16, 16.33), 'gy': (16.60, 17.46), 'gw': (17.79, 18.95)},
 'raw/ej_a.mp3': {'e1': (0, 2.52), 'e2': (3.18, 6.03), 'e3': (6.49, 7.55), 'e4': (7.94, 9.23), 'ey': (9.52, 10.36), 'ew': (10.58, 11.76)},
 'raw/sol_a.mp3': {'s1': (0, 1.80), 's2': (2.31, 5.33), 's3': (5.84, 7.52), 's4': (7.92, 9.51), 's5': (9.88, 11.75), 'sy': (12.04, 12.99), 'sw': (13.18, 14.32)},
 'raw/foe_a.mp3': {'f1': (0, 1.96), 'f2': (2.55, 3.34), 'fy': (3.71, 4.79), 'fw': (5.02, 6.17)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}',
                        '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)
        print(k, round(b - a, 2))
# 합창: '우와아아아!!' / '네 좋아요~!' 4개 목소리 × 피치 변형, '그럼 다음에 할까요?!' 장군+적장 동시
SR = 48000
def rd(p, rate=1.0):
    af = f'asetrate={int(48000*rate)},aresample=48000' if rate != 1 else 'anull'
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', p, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).copy()
def sv(x, p):
    x = x / np.abs(x).max() * 0.9
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', p], input=x.astype(np.float32).tobytes(), check=True)
rs = np.random.default_rng(3)
for out, names in [('cheer', ['gw', 'ew', 'sw', 'fw']), ('yes', ['gy', 'ey', 'sy', 'fy'])]:
    parts = []
    for n in names:
        for rate, g in [(1.0, 1.0), (0.93, 0.55), (1.07, 0.5), (0.88, 0.35), (1.12, 0.3)]:
            parts.append((rd(f'lines/{n}.wav', rate) * g, rs.uniform(0, 0.09)))
    L = max(len(x) + int(dl * SR) for x, dl in parts); o = np.zeros(L)
    for x, dl in parts: k = int(dl * SR); o[k:k + len(x)] += x
    sv(o, f'lines/{out}.wav')
a = rd('lines/g5.wav'); b = rd('lines/e3.wav'); L = max(len(a), len(b)); o = np.zeros(L); o[:len(a)] += a; o[:len(b)] += b * 0.9
sv(o, 'lines/both.wav')
print('ok')
