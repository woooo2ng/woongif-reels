import json,re
exec(open('seg.py').read());exec(open('lines.py').read())
def w(t): return len(re.sub(r'[\s]','',t))+t.count(',')*2+t.count('.')*3+t.count('…')*4+t.count('?')*3+t.count('!')*2
def align(f,T):
    S,dur=sil(f,0.15,-40)
    S=[x for x in S if x[0]>0.1 and x[1]<dur-0.1]
    W=[w(t) for t in T];tot=sum(W)
    import itertools
    cum=[sum(W[:i+1])/tot*dur for i in range(len(T)-1)]
    N=len(cum);M=len(S);INF=1e18
    # dp[i][k]: boundary i uses silence k
    dp=[[INF]*M for _ in range(N)];bk=[[-1]*M for _ in range(N)]
    def cost(i,k):
        a,b=S[k];m=(a+b)/2;L=b-a
        return ((m-cum[i])/3.0)**2 - 6*L
    for k in range(M): dp[0][k]=cost(0,k)
    for i in range(1,N):
        best=INF;bj=-1
        for k in range(M):
            if k-1>=0 and dp[i-1][k-1]<best: best=dp[i-1][k-1];bj=k-1
            if best<INF: dp[i][k]=best+cost(i,k);bk[i][k]=bj
    k=min(range(M),key=lambda k:dp[N-1][k]);ch=[k]
    for i in range(N-1,0,-1): k=bk[i][k];ch.append(k)
    ch=ch[::-1];segs=[];a=0
    for k in ch: segs.append((a,S[k][0]));a=S[k][1]
    segs.append((a,dur))
    for i,((a,b),t) in enumerate(zip(segs,T)): print(i,round(a,2),round(b,2),round((b-a)/w(t),3),t[:18])
    return segs
R={}
for f,T,p in [('raw/nar.mp3',NAR,'n'),('raw/jh.mp3',JH,'j'),('raw/spk.mp3',SPK,'s')]:
    print('==',f);R[p]=align(f,T)
json.dump(R,open('segs.json','w'))
