import cv2,subprocess,sys,numpy as np
src,out=sys.argv[1],sys.argv[2]
SP=[(735,740),(806,813),(998,1003)]  # (last good, next good) — Korean letter leaks in between
c=cv2.VideoCapture(src)
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','1080x1920','-r','30','-i','-','-i',src,'-map','0:v','-map','1:a','-c:a','copy','-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
i=0;A=None;hold=0
def inside(i): return any(a<i<b for a,b in SP)
while True:
  ok,f=c.read()
  if not ok: break
  if any(i==a for a,b in SP): A=f.astype(np.float32); cur=[s for s in SP if s[0]==i][0]
  if inside(i): pass
  elif A is not None and i==cur[1]:
    B=f.astype(np.float32); a0,b0=cur
    for k in range(a0+1,b0):
      t=(k-a0)/(b0-a0); p.stdin.write((A*(1-t)+B*t).astype(np.uint8).tobytes())
    p.stdin.write(f.tobytes()); A=None
  else: p.stdin.write(f.tobytes())
  i+=1
p.stdin.close(); p.wait(); print(i)
