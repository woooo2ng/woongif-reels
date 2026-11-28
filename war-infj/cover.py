import json,os
from playwright.sync_api import sync_playwright
import threading,http.server,functools
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8133),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
VOICE=json.load(open('voice.json'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('http://localhost:8133/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(VOICE)})')
    pg.evaluate('window.noCap=true;renderFrame(0,5.34)')
    pg.evaluate('''()=>{const u=document.getElementById('ui');u.querySelectorAll('.clock,.cap').forEach(e=>e.remove());
      u.insertAdjacentHTML('beforeend',`<div class="tag" style="top:250px">INFJ × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:#c9a7ff">INFJ인데</div><div class="title3 out">전쟁이 난다면?</div>`)}''')
    pg.screenshot(path='cover_INFJ_war.jpg',type='jpeg',quality=92)
    b.close()
