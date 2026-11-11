import sys, subprocess, os
from playwright.sync_api import sync_playwright
import threading,http.server,functools
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
try:
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',8127),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
except OSError: pass
DURS=[2.4]+[3.0]*16+[3.8]  # 음성 없음: 장면 길이 고정
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
scenes=[int(x) for x in sys.argv[1].split(',')]
os.makedirs('out',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('http://localhost:8127/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    for si in scenes:
        n=round(DURS[si]*30);tmp,final=f'out/tmp_{si}.mp4',f'out/scene_{si}.mp4'
        ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30',tmp],stdin=subprocess.PIPE)
        for f in range(n):
            pg.evaluate(f'renderFrame({si},{f/30})');ff.stdin.write(pg.screenshot(type='jpeg',quality=92))
        ff.stdin.close()
        if ff.wait()==0: os.replace(tmp,final);print('done',si,n,flush=True)
    b.close()
