import seg,json,re
P=open('narr.txt').read().strip().split('\n\n')
sents=[]  # (para, text)
for pi,p in enumerate(P):
    for s in re.findall(r'[^.?!]+[.?!]+"?',p):
        if s.strip(): sents.append((pi,s.strip()))
S,dur=seg.sil('raw/n.mp3')
cand=[(a,b) for a,b in S if b<dur-0.1]
N=len(sents);M=len(cand)
ch=[len(re.sub(r'[\s,."?!…]','',t)) for _,t in sents]
start=0.0;end=S[-1][0] if S[-1][1]>dur-0.1 else dur
rate=(end-start-sum(b-a for a,b in cand)*0.9)/sum(ch)
import functools,math
INF=1e9
# dp[i][j]: first i sentences ended using boundary j (cand index), cost
from functools import lru_cache
@lru_cache(None)
def f(i,j):  # sentence i starts after boundary j (j=-1 means start)
    st=start if j<0 else cand[j][1]
    if i==N-1:
        return ((end-st)-rate*ch[i])**2,()
    best=(INF,())
    for k in range(j+1,M-(N-2-i)):
        d=cand[k][0]-st
        c=(d-rate*ch[i])**2
        r=f(i+1,k)
        if c+r[0]<best[0]: best=(c+r[0],(k,)+r[1])
    return best
cost,ks=f(0,-1)
bounds=[start]+[x for k in ks for x in (cand[k][0],cand[k][1])]+[end]
segs=[(bounds[2*i],bounds[2*i+1]) for i in range(N)]
for (pi,t),(a,b),c in zip(sents,segs,ch): print(pi,round(a,2),round(b,2),round((b-a)/c,3),t[:24])
# paragraph segments
para={}
for (pi,t),(a,b) in zip(sents,segs):
    para.setdefault(pi,[a,b]);para[pi][1]=b
json.dump({f'n{pi+1:02d}':[round(a,3),round(b,3)] for pi,(a,b) in para.items()},open('nseg.json','w'))
print(para)
