# 첫 장면만 다시: 내레이션 "온 세상이…" 먼저 → 적장 선전포고 → 노캔 컷
import json,re
src=open('build_audio.py').read().split('# ---------- 장면 구성')[0]
src=src.replace("'-af', 'atempo=1.1', ","")
exec(src)
import numpy as np
v1=open('audio/v1.wav','rb')
raw=subprocess.check_output(['ffmpeg','-loglevel','error','-i','audio/v1.wav','-f','f32le','-ac','1','-ar',str(SR),'-'])
V=np.frombuffer(raw,np.float32).copy()
info=json.load(open('audio/timing.json'))
L=info[0]['lines'];seg=lambda nm:V[int(L[nm][0]*SR):int((L[nm][0]+L[nm][1])*SR)]
n1,e1=seg('n1'),seg('e1')
t_n1=0.0;t_e1=len(n1)/SR+0.35;POST0=1.7
T=t_e1+len(e1)/SR+POST0
v=np.zeros(int(T*SR)+1);place(v,n1,t_n1);place(v,e1,t_e1);save(v,'audio/v1.wav')
LEAD=0.25;TT=T+0.7
CUT=LEAD+t_e1+len(e1)/SR+0.3
b=np.zeros(int(TT*SR))
w=wind(TT,0.07);m=muffle(w);bm=beat(TT,vol=0.16)
k=np.clip((np.arange(len(b))/SR-CUT)/0.35,0,1)
b+=w*(1-k)+m*k+bm*k
place(b,boom(0.3),0.4);place(b,boom(0.35),LEAD+t_e1-0.2);place(b,chime(),CUT-0.05);place(b,muffle(boom(0.6)),CUT+0.9)
save(b,'audio/x1.wav')
info[0]={'len':round(T,3),'lines':{'n1':[round(t_n1,3),round(len(n1)/SR,3)],'e1':[round(t_e1,3),round(len(e1)/SR,3)]},'ev':{'cut':round(CUT,3)}}
json.dump(info,open('audio/timing.json','w'),ensure_ascii=False,indent=1)
vj=json.load(open('voice.json'));vj[0]=info[0]['len'];json.dump(vj,open('voice.json','w'))
print(info[0])
