import os
from playwright.sync_api import sync_playwright
import threading,http.server,functools
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8179),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1080})
    pg.on('pageerror',lambda e:print('ERR',e))
    pg.goto('http://localhost:8179/pfp.html');pg.wait_for_function('window.ready===true',timeout=60000)
    for i in range(3):
        pg.evaluate(f'renderPfp({i})');pg.screenshot(path=f'pfp_{"ABC"[i]}.png')
    b.close()
