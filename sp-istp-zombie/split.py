# 역할별 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect 구간)
import subprocess, os
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n1': (0, 3.51), 'n2': (4.07, 7.05), 'n3': (7.47, 11.37), 'n4': (11.85, 17.17), 'n5': (17.66, 20.88),
                 'n6': (21.26, 24.34), 'n7': (24.87, 28.32), 'n8': (28.93, 31.12)},
 'raw/jh.mp3': {'b1': (0, 2.55), 'c1': (2.98, 5.40), 'c2': (6.01, 7.88)},
 'raw/lon.mp3': {'h1': (1.62, 1.89), 'h2': (2.59, 3.00)},
 'raw/boss.mp3': {'t2': (4.07, 5.98)},
 'raw/boss2.mp3': {'t1': (0, 2.6)},
 'raw/nar9.mp3': {'n9': (0, 3.81)},
 'raw/lon2.mp3': {'p1': (1.18, 2.79)},
 'raw/mom.mp3': {'m1': (0, 1.00), 'm2': (1.54, 2.10), 'm3': (2.77, 3.11)},
 'raw/zom.mp3': {'z1': (0, 1.86), 'z2': (2.42, 2.91)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}', '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)
        print(k, round(b - a, 2))
