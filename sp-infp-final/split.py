# 역할별 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect + 받아쓰기 시각)
import subprocess, os
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n0': (0, 3.93), 'n1': (4.44, 8.81), 'n2': (9.41, 12.71), 'n3': (13.24, 17.62), 'n4': (18.15, 22.49), 'n5': (22.99, 27.34), 'n6': (27.87, 29.41)},
 'raw/coach.mp3': {'k0': (0, 5.04)},
 'raw/cas.mp3': {'c0': (0, 0.80), 'c1': (1.08, 2.88), 'c2': (3.41, 7.53), 'c3': (8.05, 10.03), 'c4': (10.52, 11.69), 'c5': (12.10, 16.29)},
 'raw/st.mp3': {'s0': (0, 1.58), 's1': (2.11, 4.91), 's2': (5.39, 9.68)},
 'raw/df.mp3': {'d0': (0, 3.43), 'd1': (3.72, 5.2)},
 'raw/gk.mp3': {'g0': (0, 4.09), 'g1': (4.57, 4.89)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ss', f'{max(0, a - 0.03):.3f}', '-to', f'{b + 0.06:.3f}', '-ar', '48000', '-ac', '1', f'lines/{k}.wav'], check=True)
        print(k, round(b - a, 2))
