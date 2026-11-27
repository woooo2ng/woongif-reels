import sys, json
from playwright.sync_api import sync_playwright
T=json.load(open('timing.json'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
shots=[tuple(map(float,x.split(':'))) for x in sys.argv[1:]]
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS); pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.on('pageerror',lambda e:print('ERR',e)); pg.on('console',lambda m:print('C',m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8124/index.html'); pg.wait_for_function('window.ready===true',timeout=60000)
    pg.evaluate(f"setTiming({T['LEAD']},{json.dumps(T['V'])})")
    pg.evaluate(f"setPhone({json.dumps({k:v['n'] for k,v in T['phone'].items()})})")
    for si,t in shots:
        pg.evaluate(f'renderFrame({int(si)},{t})')
        pg.screenshot(path=f'/tmp/oshot/a_{int(si)}_{t}.jpg',type='jpeg',quality=80)
    b.close()
