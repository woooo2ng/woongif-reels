import sys, json, subprocess, os
from playwright.sync_api import sync_playwright
import threading,http.server,functools
try:
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',8124),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
except OSError: pass
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
VOICE = [3.318,5.407,6.609,6.922,6.113,5.956,3.971,6.348,7.001,4.441]
LEAD, TAIL = 0.25, 0.45
DURS = [v + LEAD + TAIL for v in VOICE]
DURS[-1] += 0.3
EXTRA = {6: 2.0, 7: 0.2}
for k, e in EXTRA.items(): DURS[k] += e
ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
scenes = [int(x) for x in sys.argv[1].split(',')]
os.makedirs('out', exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=ARGS)
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.goto('http://localhost:8124/index.html')
    pg.wait_for_function('window.ready===true', timeout=60000)
    pg.evaluate(f'setTiming({LEAD},{json.dumps(VOICE)})')
    for si in scenes:
        n = round(DURS[si] * 30)
        tmp, final = f'out/tmp_{si}.mp4', f'out/scene_{si}.mp4'
        ff = subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30',tmp], stdin=subprocess.PIPE)
        for f in range(n):
            pg.evaluate(f'renderFrame({si},{f/30})')
            ff.stdin.write(pg.screenshot(type='jpeg', quality=92))
        ff.stdin.close()
        if ff.wait() == 0:
            os.replace(tmp, final); print('done', si, n, flush=True)
    b.close()
