# 표정 PNG 뽑기: python3 render_portraits.py → ../public/img/enfp-f/<표정>.png
import base64, os, threading, http.server, functools
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8131), functools.partial(http.server.SimpleHTTPRequestHandler, directory=HERE))
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()
OUT = os.path.join(HERE, '..', 'public', 'img', 'enfp-f')
os.makedirs(OUT, exist_ok=True)
ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
with sync_playwright() as p:
    b = p.chromium.launch(args=ARGS)
    pg = b.new_page(viewport={'width': 900, 'height': 1100})
    pg.on('pageerror', lambda e: print('ERR', e))
    pg.goto('http://127.0.0.1:8131/portraits.html')
    pg.wait_for_function('window.ready===true', timeout=60000)
    for name in pg.evaluate('EXPRS'):
        data = pg.evaluate(f'shot("{name}")').split(',', 1)[1]
        open(os.path.join(OUT, f'{name}.png'), 'wb').write(base64.b64decode(data))
        print('saved', name)
    b.close()
