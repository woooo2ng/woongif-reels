# 역할별 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect 구간)
import subprocess, os
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n1': (0, 3.58), 'n2': (4.11, 9.0), 'n3': (9.48, 13.95), 'n4': (14.34, 16.99), 'n5': (17.44, 21.28)},
 'raw/jh.mp3': {'p1': (0, 2.61), 'p2': (3.10, 4.06), 'p3': (4.29, 5.33)},
 'raw/zom.mp3': {'z1': (0, 2.44), 'z2': (3.0, 3.42), 'z3': (4.17, 4.82), 'z4': (5.55, 6.11)},
 'raw/sk.mp3': {'a1': (0, 1.46), 'c1': (1.75, 5.57), 'c2': (5.97, 8.11), 'a2': (8.58, 10.61), 'c3': (11.01, 13.78)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}', '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)
        print(k, round(b - a, 2))
