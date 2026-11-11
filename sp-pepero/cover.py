import os,json,threading,http.server,functools
from playwright.sync_api import sync_playwright
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8129),functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd()));threading.Thread(target=srv.serve_forever,daemon=True).start()
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto('http://localhost:8129/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.2,{json.dumps(json.load(open("voice.json")))})')
    pg.evaluate('renderFrame(0,1.2)')
    pg.evaluate("""()=>{const s=document.createElement('style');s.textContent=`
      .tag{top:290px!important;font-size:50px!important;white-space:nowrap!important}
      .title1{top:380px!important;font-size:122px!important}
      .title2{top:535px!important;font-size:186px!important;letter-spacing:-6px!important}`;document.head.appendChild(s)}""")
    pg.evaluate('renderFrame(0,1.21)')
    pg.screenshot(path='cover_pepero.jpg',type='jpeg',quality=95)
    b.close()
