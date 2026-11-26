import sys,glob
from PIL import Image
fs=sys.argv[2:];out=sys.argv[1]
ims=[Image.open(f).resize((360,640)) for f in fs]
cols=min(6,len(ims));rows=(len(ims)+cols-1)//cols
t=Image.new('RGB',(cols*360,rows*640),'white')
for i,im in enumerate(ims):t.paste(im,((i%cols)*360,(i//cols)*640))
t.save(out,quality=85)
