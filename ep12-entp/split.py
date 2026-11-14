import subprocess,json,re
# 장면 구간(원본 초)과 장면 안 자막 시작(원본 기준, 장면 시작 대비)
SEG=[(0.0,9.30),(9.93,17.66),(18.24,27.53),(28.08,37.74),(38.28,45.46),(45.98,53.84),(54.47,59.84)]
CAP={0:[0,2.2,4.3,6.8,8.19],1:[0,1.4,4.25,6.41],2:[0,2.9,5.56,6.53],3:[0,1.49,4.09,8.09],4:[0,1.47,3.42,4.99],5:[0,1.46,4.54,6.43],6:[0,2.87]}
SP=1.1;V=[]
for i,(a,b) in enumerate(SEG):
    out=f'audio/v{i+1}.mp3'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',f'{max(0,a-0.04):.3f}','-to',f'{b+0.08:.3f}','-i','audio/full.mp3','-af',f'atempo={SP}','-ar','48000','-ac','1','-b:a','192k',out],check=True)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',out]));V.append(round(d,3))
capt={k:[round(x/SP,2) for x in v] for k,v in CAP.items()}
json.dump(V,open('voice.json','w'));print(V,sum(V))
s=open('top.js').read();s=re.sub(r'/\*CAPT\*/.*?/\*END\*/','/*CAPT*/'+json.dumps({str(k):v for k,v in capt.items()})+'/*END*/',s);open('top.js','w').write(s)
print(capt)
