# 역할별 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect 구간)
import subprocess, os
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n1': (0, 2.01), 'n2': (2.32, 5.83), 'n3': (6.14, 9.15), 'n4': (9.47, 14.03), 'n5': (14.46, 19.89), 'n6': (20.36, 27.36)},
 'raw/anc.mp3': {'a1': (0, 3.42)},
 'raw/yh.mp3': {'e1': (0, 2.03), 'e2': (2.41, 4.57), 'e3': (4.92, 5.91), 'e4': (6.18, 7.64), 'e5': (7.96, 8.83), 'e6': (9.18, 10.27)},
 'raw/jh.mp3': {'j1': (0.15, 1.23), 'j2': (1.47, 3.26), 'j3': (3.44, 4.33), 'j4': (4.52, 6.79)},
 'raw/zom.mp3': {'z1': (0, 0.80), 'z2': (1.32, 2.10), 'z3': (2.38, 3.15), 'z4': (3.55, 7.78)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}', '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)
        print(k, round(b - a, 2))
