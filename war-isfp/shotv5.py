import sys,json,os,threading,http.server,functools
from playwright.sync_api import sync_playwright
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8132),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
VOICE=json.load(open('voice.json'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
os.makedirs('shots',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.on('pageerror',lambda e: print('ERR',e))
    pg.goto('http://localhost:8132/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(VOICE)})')
    for v in sys.argv[1].split(','):
        for tt in sys.argv[2].split(','):
            pg.evaluate(f"window.VAR5='{v}';renderFrame(0,0.1);renderFrame(5,{tt})");pg.screenshot(path=f'shots/v5_{v}_{tt}.png')
    b.close()
