# 주문 페이지 실제 화면 녹화 (390x603 휴대폰 화면, 2배 해상도)
import asyncio, json
from playwright.async_api import async_playwright
B="http://localhost:8788"
CSS="""
html{zoom:2}
.bar .px{display:none !important}
#stage{position:sticky;top:0;z-index:5}
.tapfx{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,216,77,.55);border:3px solid rgba(26,26,26,.7);pointer-events:none;z-index:99;animation:tp .5s ease-out forwards}
@keyframes tp{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.4);opacity:0}}
::-webkit-scrollbar{display:none}
"""
marks={}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width":780,"height":1206}, device_scale_factor=1, has_touch=False)
        async def route(r):
            u=r.request.url
            if "three.module.js" in u: return await r.fulfill(path="/tmp/three/node_modules/three/build/three.module.js", content_type="text/javascript", headers={"access-control-allow-origin":"*"})
            if u.startswith(B) or "jsdelivr" in u: return await r.continue_()
            return await r.abort()
        await ctx.route("**/*", route)
        pg = await ctx.new_page()
        import time
        t0 = time.time()
        def mark(k): marks[k]=round(time.time()-t0,3); print(k, marks[k], flush=True)
        await pg.goto(B+"/order"); await pg.evaluate("sessionStorage.clear()")
        await pg.goto(B+"/order"); await pg.wait_for_timeout(500)
        await pg.add_style_tag(content=CSS)
        await pg.click("#start"); await pg.wait_for_timeout(300)
        await pg.add_style_tag(content=CSS)
        import base64, os
        os.makedirs("raw/cast", exist_ok=True)
        for f in os.listdir("raw/cast"): os.remove("raw/cast/"+f)
        cdp = await ctx.new_cdp_session(pg)
        frames=[]
        async def on_frame(ev):
            frames.append(ev["metadata"]["timestamp"])
            open(f"raw/cast/{len(frames):05d}.jpg","wb").write(base64.b64decode(ev["data"]))
            await cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
        cdp.on("Page.screencastFrame", lambda ev: asyncio.ensure_future(on_frame(ev)))
        await cdp.send("Page.startScreencast", {"format":"jpeg","quality":92,"maxWidth":780,"maxHeight":1206,"everyNthFrame":1})
        await pg.wait_for_timeout(300)
        t0 = time.time()
        async def tap(sel, after=350):
            el = pg.locator(sel).first
            await el.evaluate("e=>e.scrollIntoView({block:'nearest'})")
            bb = await el.bounding_box()
            x,y = bb["x"]+bb["width"]/2, bb["y"]+bb["height"]/2
            await pg.evaluate(f"(()=>{{const d=document.createElement('div');d.className='tapfx';d.style.left='{x/2}px';d.style.top='{y/2}px';document.body.appendChild(d);setTimeout(()=>d.remove(),600)}})()")
            await pg.wait_for_timeout(120)
            marks.setdefault('taps',[]).append(round(time.time()-t0,3))
            await el.click()
            await pg.wait_for_timeout(after)
        async def typ(sel, text, delay=90):
            await pg.locator(sel).first.click()
            for ch in text:
                marks.setdefault('keys',[]).append(round(time.time()-t0,3))
                await pg.keyboard.type(ch); await pg.wait_for_timeout(delay)
        async def scroll_to(sel):
            await pg.locator(sel).first.evaluate("e=>{const r=e.getBoundingClientRect();window.scrollBy({top:r.top/2-340,behavior:'smooth'})}")
            await pg.wait_for_timeout(750)
        mark("s1")
        await pg.wait_for_timeout(500)
        await tap('[data-rel="커플"]', 400)
        await tap('#nx', 600)
        mark("s2")
        await pg.wait_for_timeout(900)
        await scroll_to('.tiles')
        await tap('[data-t="INTJ"]', 250)
        await typ('#nmI', '선우', 120)
        await tap('.tabs [data-slot="b"]', 300)
        await scroll_to('.tiles')
        await tap('[data-t="ISFP"]', 250)
        await typ('#nmI', '웅이', 120)
        mark("dress")
        await scroll_to('[data-hair]')
        await tap('[data-hair="dandy"]', 800)
        await scroll_to('[data-tg="gl"]')
        await tap('[data-tg="gl"]', 800)
        await scroll_to('[data-top]')
        await tap('[data-top="hood"]', 1000)
        await pg.evaluate("window.scrollTo({top:0,behavior:'smooth'})"); await pg.wait_for_timeout(700)
        mark("story")
        await tap('#nx', 700)
        await typ('#stI', '처음 만난 날 비가 와서 우산 하나를 같이 썼어요', 75)
        await pg.wait_for_timeout(900)
        mark("end")
        await cdp.send("Page.stopScreencast")
        marks["frames"]=[ts-t0 for ts in frames]
        await ctx.close(); await b.close()
        json.dump(marks, open("raw/marks.json","w"))
asyncio.run(main())
