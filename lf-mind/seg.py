import subprocess,re,sys,json
def sil(f,d=0.2,n=-38):
    o=subprocess.run(['ffmpeg','-i',f,'-af',f'silencedetect=noise={n}dB:d={d}','-f','null','-'],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)];e=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
    return list(zip(s,e)),dur
def split(f,N,texts):
    S,dur=sil(f)
    S=[x for x in S if x[0]>0.05 and x[1]<dur-0.05]
    top=sorted(S,key=lambda x:x[1]-x[0],reverse=True)[:N-1];top.sort()
    segs=[];a=0
    for s,e in top: segs.append((a,s));a=e
    segs.append((a,dur))
    # trim leading silence of first
    for i,((a,b),t) in enumerate(zip(segs,texts)):
        print(i,round(a,2),round(b,2),round(b-a,2),round((b-a)/len(t),3),t[:20])
    return segs
