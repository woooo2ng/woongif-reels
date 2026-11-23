import json,os,threading,http.server,functools
from playwright.sync_api import sync_playwright
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8129),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('http://localhost:8129/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(json.load(open("voice.json")))})');pg.evaluate('window.noCap=true')
    pg.evaluate('renderFrame(0,13.15)');pg.screenshot(path='flash.jpg',type='jpeg',quality=90);b.close()
