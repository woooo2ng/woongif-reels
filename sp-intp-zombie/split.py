# 역할별 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect 구간)
import subprocess, os
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n1': (0, 3.63), 'n2': (4.24, 7.85), 'n3': (8.31, 11.34), 'n5': (18.36, 21.89)},
 'raw/nar2.mp3': {'n6': (0, 3.87), 'n7': (4.46, 10.88)},
 'raw/sol2.mp3': {'s7': (0, 3.13), 's8': (3.75, 5.38)},
 'raw/nar5.mp3': {'n4': (0, 3.68)},
 'raw/sol3.mp3': {'s3': (0, 3.04)},
 'raw/sol5a.mp3': {'q1': (0.15, 8.15)},
 'raw/zom3.mp3': {'zs': (0, 3.34)},
 'raw/nar4.mp3': {'n8': (0, 5.11)},
 'raw/zom2.mp3': {'z5': (0, 2.02)},
 'raw/sol.mp3': {'s1': (0, 1.40), 's2': (2.02, 2.72), 's4': (4.24, 7.88), 's5': (8.24, 9.57), 's6': (10.06, 11.28)},
 'raw/zom.mp3': {'z1': (0, 1.43), 'z2': (1.86, 2.43), 'z3': (2.98, 6.67), 'z4': (6.95, 9.14)},
 'raw/anc.mp3': {'a1': (0, 5.52)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}', '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)
        print(k, round(b - a, 2))
