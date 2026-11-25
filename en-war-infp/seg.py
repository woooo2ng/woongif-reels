import numpy as np,wave,sys
def load(n):
    w=wave.open(n+'.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768;return x,w.getframerate()
def segs(n,th=0.012,mingap=0.35):
    x,sr=load(n);hop=int(sr*0.01)
    e=np.array([np.sqrt((x[i:i+hop]**2).mean()) for i in range(0,len(x)-hop,hop)])
    on=e>th;out=[];s=None;last=0
    for i,v in enumerate(on):
        if v:
            if s is not None and (i-last)*0.01>mingap: out.append((s,last));s=None
            if s is None: s=i
            last=i
    if s is not None: out.append((s,last))
    return [(a*0.01,(b+1)*0.01) for a,b in out if (b-a)>5]
if __name__=='__main__':
    for n in ['narr','sol','cap','esol','ecap']:
        x,sr=load(n);print(n,round(len(x)/sr,2),[(round(a,2),round(b-a,2)) for a,b in segs(n)])
