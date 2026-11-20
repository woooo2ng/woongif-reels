import json,re
NS=json.load(open('nseg.json'))
# sentence alignment from align_n output (recompute)
import subprocess
out=subprocess.check_output(['python3','align_n.py'],text=True).strip().split('\n')[:-1]
sent=[]
P=open('narr.txt').read().strip().split('\n\n')
ss=[]
for pi,p in enumerate(P):
    for s in re.findall(r'[^.?!]+[.?!]+"?',p):
        if s.strip(): ss.append((pi,s.strip()))
rows=[l.split() for l in out]
CAP={}
for (pi,txt),r in zip(ss,rows):
    a=float(r[1]);k=f'n{pi+1:02d}';p0=NS[k][0]
    CAP.setdefault(k,[]).append([round(max(0,(a-p0))/1.08,3),txt])
DLG={'j01':['…나 아직 로딩 중.'],'j02':['…전생: 우리 집 강아지?'],'j03':['…99퍼센트에서 왜 안 넘어가?'],
'k01':["정부가 오늘 전생 조회 앱 '전생24'를 출시했습니다.","본인 인증만 하면, 누구나 자신의 전생을 확인할 수 있습니다."],
'c01':['야, 나 전생에 왕이래. 너는?'],'i01':['전생에 장군이셨네요.','리더십은 검증됐고… 합격.'],'i02':['…전생에 피를 좀 빠셨네요.'],
'a01':['그래서 회식 때 잘 마십니다.'],'g01':['혹시… 전생 뭐였어요?'],'y01':['…밥은 먹고 다니니?']}
D=json.load(open('linedur.json'))
for k,parts in DLG.items():
    tot=sum(len(p) for p in parts);acc=0;L=[]
    for p in parts: L.append([round(D[k]*acc/tot,3),p]);acc+=len(p)
    CAP[k]=L
open('text.js','w').write('const CAPS='+json.dumps(CAP,ensure_ascii=False)+';\nconst NAMES={j:"웅이",k:"앵커",c:"친구",i:"면접관",a:"지원자",g:"소개팅 상대",y:"아이"};\n')
print(json.dumps(CAP,ensure_ascii=False)[:1500])
