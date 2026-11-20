import json
D=json.load(open('linedur.json'))
# (scene key, lines, extra tail, lead override)
SEQ=[(0,['n01'],1.2,0.5),(1,['k01'],0.2,None),(2,['n02'],0.3,None),(3,['n03','n04'],0.4,None),
(4,['c01','j01'],0.6,None),(5,['n05'],0.3,None),(6,['i01'],0.5,None),(7,['i02','a01'],0.6,None),
(8,['g01','n06'],0.3,None),(9,['n07'],0.5,None),(10,['n08'],0.6,None),(11,['n09'],0.4,None),
(12,['j02'],0.9,0.6),(13,['n10'],0.4,1.6),(14,['n11'],0.4,None),(15,['y01','n12'],0.6,0.6),
(16,['n13'],0.3,None),(17,['j03'],2.4,0.4),(18,[],3.2,None)]
LEAD,GAP,TAIL=0.3,0.35,0.45
GAPS={(4,'j01'):0.25,(7,'a01'):0.2,(8,'n06'):0.45,(15,'n12'):0.9}
out=[]
for k,ls,ex,ld in SEQ:
    t=LEAD if ld is None else ld;LL={}
    for i,x in enumerate(ls):
        if i: t+=GAPS.get((k,x),GAP)
        LL[x]=[round(t,3),D[x]];t+=D[x]
    dur=t+TAIL+ex
    out.append({'key':k,'dur':round(dur*30)/30,'lines':LL})
json.dump(out,open('timing.json','w'),ensure_ascii=False)
print(len(out),round(sum(o['dur'] for o in out),1))
for o in out: print(o['key'],o['dur'],o['lines'])
