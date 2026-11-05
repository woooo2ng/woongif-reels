import sys,json
from playwright.sync_api import sync_playwright
VOICE=[2.05,5.88,4.13,3.97,5.41,5.25,5.56,4.6,3.87,3.16]
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
pairs=[tuple(map(float,x.split(':'))) for x in sys.argv[1].split(',')]
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS);pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.on('console',lambda m: print('CONSOLE',m.text) if m.type in('error','warning') else None)
    pg.on('pageerror',lambda e: print('ERR',e))
    pg.goto('http://localhost:8124/index.html');pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f'setTiming(0.25,{json.dumps(VOICE)})')
    for si,t in pairs:
        pg.evaluate(f'renderFrame({int(si)},{t})');pg.screenshot(path=f'shots/s{int(si)}_{t}.png')
    b.close()
