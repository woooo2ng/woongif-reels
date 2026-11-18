import json
D=json.load(open('linedur.json'))
SC=[['n01'],'D1',['j01'],['j02'],['n02'],['j03'],['n03'],['n04'],['j04'],['j05','s01'],['j06'],['j07'],['n05'],['j08'],['j09','n06'],['j10'],['n07'],['j11'],
'D3',['n08'],['n09'],['n10'],['j12'],['n11'],['j13'],['s02','j14'],['n12'],['j15'],['n13'],['n14'],
'D30',['n15'],['j16'],['n16'],['n17','j17'],['n18'],['j18'],['j19'],['n19'],['j20'],['n20'],['j21'],['n21'],['j22'],
'D365',['n22'],['n23'],['n24'],['j23'],['n25'],['j24'],['n26'],['j25'],
'D3650',['n27'],['n28'],['j26'],['n29','j27'],['n30'],['j28'],['n31'],[],['n32'],['j29'],['n33']]
# 장면별 추가 여유(가중치): 볼거리 있는 장면은 더 길게
W={0:2.0,8:1.6,10:1.3,14:1.4,15:1.6,21:1.8,26:2.0,27:1.4,29:1.2,36:1.4,37:1.3,46:1.6,47:1.4,49:1.3,51:1.4,52:1.2,54:1.8,55:1.4,58:1.8,61:0,62:1.6,63:1.4,64:1.5}
LEAD,GAP,TAIL=0.9,0.7,1.3
TARGET=506
out=[];nat=[]
for i,s in enumerate(SC):
    if isinstance(s,str): nat.append(4.2);continue
    if not s: nat.append(4.5);continue
    nat.append(LEAD+sum(D[k] for k in s)+GAP*(len(s)-1)+TAIL)
extra=TARGET-sum(nat)
ws=[0 if isinstance(s,str) or not s else W.get(i,1.0) for i,s in enumerate(SC)]
tot=sum(ws)
for i,s in enumerate(SC):
    e=extra*ws[i]/tot
    if isinstance(s,str): out.append({'card':s[1:],'dur':round(nat[i]*30)/30,'lines':{}});continue
    lead=LEAD+e*0.3;t=lead;L={}
    for k in s: L[k]=[round(t,3),D[k]];t+=D[k]+GAP
    dur=round((nat[i]+e)*30)/30
    out.append({'dur':dur,'lines':L})
json.dump(out,open('timing.json','w'),ensure_ascii=False)
print(len(out),round(sum(o['dur'] for o in out),2),round(extra/len(SC),2))
