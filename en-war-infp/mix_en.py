import subprocess
# (소스, 시작, 끝, 영상 위치, 배속)
C=[('narr',0.0,3.2,0.18,1.0),('narr',3.6,4.9,2.4,1.0),
('sol',0.1,1.8,4.4,1.0),('sol',3.25,4.3,5.9,1.0),
('cap',0.35,4.6,8.35,1.1),
('sol',5.55,6.45,12.45,1.0),('sol',7.4,9.3,13.65,1.0),('sol',10.1,11.55,15.9,1.0),('sol',12.1,13.8,17.4,1.0),
('sol',14.4,16.4,19.65,1.0),
('cap',5.75,7.8,22.45,1.0),
('esol',0.05,2.5,27.95,1.0),('esol',3.6,5.85,32.3,1.15),('esol',6.7,7.85,34.15,1.0),('esol',8.8,10.85,36.3,1.0),
('ecap',0.1,2.65,39.45,1.07),('ecap',3.65,4.95,41.85,1.0),
('narr',6.2,7.8,44.95,1.0),('narr',8.8,10.8,46.55,1.0)]
inp=[];fl=[]
for i,(n,a,b,at,sp) in enumerate(C):
    inp+=['-i',n+'.wav'];d=int(at*1000)
    tempo=f',atempo={sp}' if sp!=1.0 else ''
    fl.append(f'[{i}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={(b-a)-0.05}:d=0.05{tempo},adelay={d},aresample=48000[a{i}]')
fl.append(''.join(f'[a{i}]' for i in range(len(C)))+f'amix=inputs={len(C)}:normalize=0,apad,atrim=0:49.03,loudnorm=I=-14:TP=-1.5:LRA=11[out]')
subprocess.run(['ffmpeg','-y','-v','error',*inp,'-filter_complex',';'.join(fl),'-map','[out]','-ac','2','-ar','48000','-c:a','aac','-b:a','192k','../voice_en.m4a'],check=True)
