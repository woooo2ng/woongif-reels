# 역할별로 한 번에 뽑은 음성을 대사 단위로 자름 (silencedetect 구간)
import subprocess, os
os.makedirs('lines', exist_ok=True)
R = {
 'raw/nar.mp3': {'n1':(0,3.01),'n2':(3.59,6.93),'n3':(7.47,11.57),'n4':(12.09,16.20),'n5':(16.68,19.44),'n6':(22.49,30.15),'n7':(30.70,39.2)},
 'raw/gen.mp3': {'g1':(0,3.79),'g2':(4.27,7.47),'g3':(8.09,10.66),'g4':(11.49,12.31),'g5':(12.87,13.22),'g6':(14.04,16.26),'g7':(16.73,18.26)},
 'raw/ej.mp3': {'e1':(0,3.34),'e2':(3.93,7.33),'e3':(8.13,12.81),'e4':(13.59,15.28),'e5':(16.27,16.71),'e6':(17.44,19.19),'e7':(19.83,21.76)},
 'raw/sol.mp3': {'s1':(0,0.64),'s2':(1.05,1.60),'s3':(2.14,2.91),'s4':(3.29,4.97),'a1':(5.43,7.29)},
 'raw/foe.mp3': {'f1':(0,2.27)},
}
for f, d in R.items():
    for k, (a, b) in d.items():
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f,'-ss',f'{max(0,a-0.03):.3f}','-to',f'{b+0.06:.3f}','-ar','48000','-ac','1',f'lines/{k}.wav'],check=True)
        print(k, round(b-a,2))

# n5: '가면도,' 빼고 이어 붙임 (지웅 요청) — 앞 문장 + 0.45초 쉼 + '충전이 필요했거든요'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','raw/nar.mp3','-filter_complex',
  "[0]atrim=16.65:19.50,asetpts=N/SR/TB,aresample=48000[a];aevalsrc=0:d=0.39:s=48000[g];[0]atrim=20.72:21.96,asetpts=N/SR/TB,aresample=48000[b];[a][g][b]concat=n=3:v=0:a=1",
  '-ac','1','lines/n5.wav'],check=True)
print('n5 joined')
