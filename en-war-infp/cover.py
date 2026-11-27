import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src,out=sys.argv[1],sys.argv[2]
im=Image.open(src).convert('RGB')
W,H=im.size
z=1.3; cw,ch=int(W/z),int(H/z); cx=(W-cw)//2; cy=int(H*0.52)-ch//2
im=im.crop((cx,cy,cx+cw,cy+ch)).resize((W,H),Image.LANCZOS)
F='/usr/share/fonts/opentype/inter/'
def font(n,s): return ImageFont.truetype(F+n,s)
d=ImageDraw.Draw(im)
def text(y,t,f,fill,stroke=(42,34,56),sw=14,shadow=True):
    w=d.textlength(t,font=f); x=(W-w)/2
    if shadow:
        sh=Image.new('RGBA',im.size,(0,0,0,0)); sd=ImageDraw.Draw(sh)
        sd.text((x+6,y+10),t,font=f,fill=(30,20,50,120),stroke_width=sw,stroke_fill=(30,20,50,120))
        sh=sh.filter(ImageFilter.GaussianBlur(8)); im.paste(sh,(0,0),sh)
    d.text((x,y),t,font=f,fill=fill,stroke_width=sw,stroke_fill=stroke)
    return w
# chip
cf=font('Inter-ExtraBold.otf',58); ct='INFP × WAR'; cwid=d.textlength(ct,font=cf)
px,py=40,20; y0=230
d.rounded_rectangle(((W-cwid)/2-px,y0,(W+cwid)/2+px,y0+58+2*py+10),radius=30,fill=(255,214,74))
d.text(((W-cwid)/2,y0+py-4),ct,font=cf,fill=(42,34,56))
text(400,'If everyone',font('Inter-Black.otf',130),(255,255,255))
text(560,'was INFP',font('Inter-Black.otf',200),(196,160,255))
text(800,'and a war',font('Inter-Black.otf',130),(255,255,255))
text(950,'broke out?',font('Inter-Black.otf',130),(255,255,255))
im.save(out,quality=92)
