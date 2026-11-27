import json, os, shutil, bisect
V=[3.29,2.35,3.98,2.31,2.51,5.30]
VS=[(0.0,3.29),(3.85,6.20),(6.57,10.55),(11.05,13.36),(13.56,16.07),(16.62,21.92)]
EXTRA=[0.4,1.0,1.3,1.3,5.66,0.6]
LEAD,TAIL=0.25,0.45
D=[round((v+LEAD+TAIL+e)*30)/30 for v,e in zip(V,EXTRA)]
m=json.load(open('raw/marks.json')); F=m['frames']
REC={1:(0.0,m['dress']),2:(m['dress'],m['story']),3:(m['story'],m['end'])}
phone={}
for si,(a,b) in REC.items():
    sp=(b-a)/D[si]; n=round(D[si]*30); d=f'frames/s{si}'; shutil.rmtree(d,ignore_errors=True); os.makedirs(d)
    for f in range(n):
        t=a+f/30*sp; i=max(0,min(len(F)-1,bisect.bisect(F,t)-1))
        shutil.copy(f'raw/cast/{i+1:05d}.jpg',f'{d}/{f+1:04d}.jpg')
    phone[si]={'a':a,'b':b,'speed':round(sp,3),'n':n}
    print(si,phone[si],D[si])
json.dump({'V':V,'VS':VS,'D':D,'LEAD':LEAD,'phone':phone,'taps':m['taps'],'keys':m['keys']},open('timing.json','w'),indent=1)
print('total',sum(D))
