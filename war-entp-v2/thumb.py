import json,os,sys,threading,http.server,functools
from playwright.sync_api import sync_playwright
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8133),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
T=json.loads(sys.argv[1]);out=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('http://localhost:8133/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(json.load(open("voice.json")))})')
    pg.evaluate(f'window.THUMB={json.dumps(T)}')
    pg.evaluate('renderFrame(0,1.4)')
    pg.evaluate("document.querySelectorAll('.cap').forEach(e=>e.style.display='none')")
    pg.screenshot(path=out,type='jpeg',quality=92);b.close()
