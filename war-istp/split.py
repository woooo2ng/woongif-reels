import subprocess,re,sys,os
def sil(f):
    o=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=noise=-40dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)];e=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    return list(zip(s,e))
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
def split(f,n,prefix):
    S=sil(f);D=dur(f)
    # leading/trailing
    lead=S[0][1] if S and S[0][0]<0.05 else 0
    tail=[x for x in S if x[1]>=D-0.05];end=tail[0][0] if tail else D
    inner=[x for x in S if x[0]>lead+0.05 and x[1]<end-0.05]
    cuts=sorted(sorted(inner,key=lambda x:-(x[1]-x[0]))[:n-1])
    segs=[];a=lead
    for s,e in cuts: segs.append((a,s));a=e
    segs.append((a,end))
    os.makedirs('../lines',exist_ok=True)
    for i,(a,b) in enumerate(segs):
        out=f'../lines/{prefix}{i+1}.wav'
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f,'-ss',f'{max(0,a-0.03):.3f}','-to',f'{b+0.06:.3f}','-ar','48000','-ac','1',out],check=True)
        print(prefix+str(i+1),round(b-a,2))
for f,n,p in [('nar_a.mp3',9,'n'),('sol_a.mp3',8,'s'),('foe_a.mp3',8,'f'),('gen_a.mp3',3,'g'),('ej_a.mp3',3,'e')]: split(f,n,p)
