import json,subprocess,re
NS=json.load(open('nseg.json'))
def dur(f):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
def cut(src,a,b,out,tempo=1.0):
    af=f'atrim={a}:{b},asetpts=PTS-STARTPTS,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
    if tempo!=1.0: af+=f',atempo={tempo}'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-af',af,'-ar','48000','-ac','1',out],check=True)
import os;os.makedirs('lines',exist_ok=True)
L={}
for k,(a,b) in NS.items(): cut('raw/n.mp3',max(0,a-0.02),b+0.05,f'lines/{k}.wav',1.08)
cut('raw/j.mp3',0,1.9,'lines/j01.wav');cut('raw/j.mp3',2.2,4.3,'lines/j02.wav');cut('raw/j.mp3',4.5,7.0,'lines/j03.wav')
cut('raw/i.mp3',0,5.0,'lines/i01.wav');cut('raw/i.mp3',5.0,7.63,'lines/i02.wav')
for x,y in [('k','k01'),('c','c01'),('a','a01'),('g','g01'),('y','y01')]: cut(f'raw/{x}.mp3',0,99,f'lines/{y}.wav')
D={os.path.splitext(f)[0]:round(dur('lines/'+f),3) for f in sorted(os.listdir('lines'))}
json.dump(D,open('linedur.json','w'));print(D)
