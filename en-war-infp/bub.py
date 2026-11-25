import cv2,numpy as np
def detect(f,ref,box,tol=16):
    x0,y0,x1,y1=box
    r=f[y0:y1,x0:x1].astype(int)
    m=(np.abs(r-ref).max(2)<tol).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
    n,l,st,c=cv2.connectedComponentsWithStats(m)
    if n<2: return None
    i=1+np.argmax(st[1:,4])
    if st[i,4]<1500: return None
    comp=(l==i)
    rows=comp.sum(1); mx=rows.max()
    ys=np.nonzero(rows>0.6*mx)[0]
    cols=comp[ys.min():ys.max()+1].sum(0); xs=np.nonzero(cols>0)[0]
    return (x0+xs.min(),y0+ys.min(),x0+xs.max(),y0+ys.max())
