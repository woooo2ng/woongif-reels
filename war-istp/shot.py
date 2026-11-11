import sys,json,os
from playwright.sync_api import sync_playwright
import threading,http.server,functools
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
try:
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',8126),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
except OSError: pass
VOICE=json.load(open('voice.json'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
pairs=[tuple(map(float,x.split(':'))) for x in sys.argv[1].split(',')]
os.makedirs('shots',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.on('console',lambda m: print('CONSOLE',m.text) if m.type in('error','warning') else None)
    pg.on('pageerror',lambda e: print('ERR',e))
    pg.goto('http://localhost:8126/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(VOICE)})')
    for si,t in pairs:
        # 순서대로 진행시켜 사진 캡처 등 상태 재현
        pg.evaluate(f'renderFrame({int(si)},{t})');pg.screenshot(path=f'shots/s{int(si)}_{t}.png',type='png')
    b.close()
