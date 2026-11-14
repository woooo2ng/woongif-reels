import sys,json,os
from playwright.sync_api import sync_playwright
import threading,http.server,functools
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8131),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
VOICE=json.load(open('voice.json'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
os.makedirs('shots',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.on('pageerror',lambda e: print('ERR',e))
    pg.goto('http://localhost:8131/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(VOICE)})')
    for v in sys.argv[1].split(','):
        pg.evaluate(f"window.VAR='{v}';renderFrame(0,0.1);renderFrame(1,{sys.argv[2]})");pg.screenshot(path=f'shots/var_{v}.png')
    b.close()
