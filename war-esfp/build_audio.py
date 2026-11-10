import subprocess, json
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
SR=48000
def trim(name, extra=''):
    out=f'trim/{name}.wav'
    af='silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse'
    if extra: af+=','+extra
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'lines/{name}.mp3','-af',af,'-ar',str(SR),'-ac','1',out],check=True)
    return out
# ding sound
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=f=1318:d=0.18','-f','lavfi','-i','sine=f=1760:d=0.35','-filter_complex','[0]volume=0.5,afade=t=out:st=0.1:d=0.08[a];[1]volume=0.5,afade=t=out:st=0.05:d=0.3[b];[a][b]concat=n=2:v=0:a=1,aresample=48000','-ac','1','trim/ding.wav'],check=True)
TTSFX='highpass=f=350,lowpass=f=3800,acrusher=bits=10:mix=0.35,volume=1.1'
PRE={2:2.75};POST={4:1.4}
SC=[[('g1',0),('n1',0.55)],
    [('s2',0),('g2',0.35)],
    [('shutter',0),('e3',0.73),('s3',0.3),('n3',0.45)],
    [('n4',0),('g4',0.35)],
    [('c5',0),('g5a',0.3),('n5',0.4),('ding',0.35),('t5',0.05),('g5b',0.35)],
    [('j6',0),('g6',0.4),('n6',0.5)],
    [('n7',0),('g7',0.4)]]
info=[]
for si,lines in enumerate(SC):
    files=[];t=PRE.get(si,0);starts=[]
    for name,gap in lines:
        f='trim/ding.wav' if name=='ding' else 'trim/shutter.wav' if name=='shutter' else trim(name, TTSFX if name=='t5' else 'atrim=0:3.5,afade=t=out:st=3.38:d=0.12' if name=='j6' else '')
        t+=gap; starts.append([name,round(t,3),round(dur(f),3)]); files.append((f,t)); t+=dur(f)
    t+=POST.get(si,0)
    inputs=[];flt=[]
    for i,(f,st) in enumerate(files):
        inputs+=['-i',f];d=int(st*1000);flt.append(f'[{i}]adelay={d}|{d}[a{i}]')
    flt.append(''.join(f'[a{i}]' for i in range(len(files)))+f'amix=inputs={len(files)}:normalize=0,apad,atrim=0:{t:.3f}[o]')
    subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(flt),'-map','[o]','-ar','48000','-ac','1',f'audio/v{si+1}.wav'],check=True)
    info.append({'len':round(dur(f'audio/v{si+1}.wav'),3),'lines':starts})
json.dump(info,open('audio/timing.json','w'),ensure_ascii=False,indent=1)
for i,x in enumerate(info): print(i+1,x)
print('total',sum(x['len']+0.7 for x in info)+0.3)
