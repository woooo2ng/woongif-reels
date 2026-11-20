import sys,json,os,time
from playwright.sync_api import sync_playwright
import threading,http.server,functools
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
PORT=int(os.environ.get('PORT',8150))
try:
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',PORT),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
except OSError: pass
TM=json.load(open('timing.json'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
spec=sys.argv[1]
pairs=[]
for x in spec.split(','):
    si,t=x.split(':');si=int(si)
    t=TM[si]['dur']*float(t[:-1])/100 if t.endswith('%') else float(t)
    pairs.append((si,t))
os.makedirs('shots',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,"height":1920})
    pg.on('console',lambda m: print('CONSOLE',m.text) if m.type in('error','warning') else None)
    pg.on('pageerror',lambda e: print('ERR',e))
    pg.goto(f'http://localhost:{PORT}/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    for si,t in pairs:
        t0=time.time();pg.evaluate(f'renderFrame({si},{t})');pg.screenshot(path=f'shots/s{si:02d}_{t:.1f}.jpg',type='jpeg',quality=80);print(si,round(t,1),round(time.time()-t0,2),flush=True)
    b.close()
