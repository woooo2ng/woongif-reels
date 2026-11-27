// ===== 온 세상이 ISTP인데 산타가 온다면? (크리스마스 특별편) =====
const C_RED='#ff5a5f',C_GRN='#5fd38a';
let LEAD=0.25,TM={durs:[],lines:[],m:{}};
window.setTiming=(lead,tm)=>{LEAD=lead;TM=tm};
const CAPCOL={n:'#fff',s:'#ff8a8a',e:'#8ff0b0',k:'#ffd84d',m:'#ffb3d9'};
function caption(si,t,hideAfter){
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const ls=TM.lines.filter(l=>l.s===si);let txt='',st=0,who='n';
  for(const l of ls){if(t<l.t0-0.05)continue;if(t>l.t1+0.45&&l.who!=='n')continue;if(l.who==='n'&&t>l.t1+0.6&&ls.some(o=>o.t0>l.t0&&o.t0<=t))continue;
    const L=l.parts.map(p=>p.length),tot=L.reduce((a,b)=>a+b,0);let acc=l.t0;
    for(let i=0;i<l.parts.length;i++){if(t>=acc-0.05){txt=l.parts[i];st=acc;who=l.who}acc+=(l.t1-l.t0)*L[i]/tot}}
  if(hideAfter!=null&&t>hideAfter)txt='';
  if(el.dataset.x!==txt){el.dataset.x=txt;el.textContent=txt;el.style.color=CAPCOL[who]||'#fff'}
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=txt?clamp01((t-st+0.1)/0.1):0;
}
const ln=(si,k)=>TM.lines.find(l=>l.s===si&&l.k===k);
const MK=k=>TM.m[k];
const speaking=(si,k,t)=>{const l=ln(si,k);return l&&t>l.t0&&t<l.t1};
{const st=document.createElement('style');st.textContent=`
.tag{top:250px;background:#ffd84d;white-space:nowrap}
.title1{top:330px;font-size:118px}
.title2{top:462px;font-size:168px;letter-spacing:-5px;color:${C_RED}}
.title3{position:absolute;left:0;right:0;top:668px;text-align:center;font-size:120px;letter-spacing:-4px;white-space:nowrap;color:${C_GRN}}
.clock b{color:#e2335a}
.fl{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
.end0{position:absolute;left:50%;top:470px;transform:translateX(-50%);background:#e2335a;color:#fff;font-weight:900;font-size:52px;padding:8px 30px;border-radius:16px;white-space:nowrap}
.end1{position:absolute;left:0;right:0;top:600px;text-align:center;font-size:124px;line-height:1.25;letter-spacing:-3px}
.end2{position:absolute;left:0;right:0;top:790px;text-align:center;font-size:62px}
.inbar{position:absolute;left:0;right:0;bottom:0;height:96px;background:#fff;display:flex;align-items:center;padding:0 26px;gap:16px;border-top:2px solid rgba(0,0,0,.06)}
.inbox{flex:1;height:62px;border-radius:31px;background:#f1f2f4;font-size:36px;line-height:62px;padding:0 26px;color:#222;font-weight:500}
.inbox .cur{display:inline-block;width:3px;height:40px;background:#3a7bd5;vertical-align:middle;margin-left:2px}
.sendb{width:62px;height:62px;border-radius:50%;background:#ffd84d;color:#3a2a00;font-weight:900;font-size:30px;display:flex;align-items:center;justify-content:center}
.wcard{position:absolute;left:110px;right:110px;top:200px;border-radius:44px;background:#fff8ee;box-shadow:0 30px 70px rgba(60,30,20,.35);padding:34px 40px 40px;box-sizing:border-box;border:10px solid #c93a3a}
.wcard h3{margin:0 0 18px;font-size:50px;font-weight:900;color:#c93a3a;letter-spacing:-1px;text-align:center}
.wrow{display:flex;align-items:center;gap:18px;background:#fff;border-radius:26px;padding:20px 24px;margin-top:16px;font-size:40px;font-weight:700;color:#2b2b3a;box-shadow:0 4px 12px rgba(0,0,0,.08)}
.wrow .ic{width:62px;height:62px;border-radius:20px;flex:none;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#fff}
.wrow .nm{font-size:26px;color:#888;font-weight:700;display:block;margin-bottom:2px}
.rank{position:absolute;left:90px;right:90px;top:180px;border-radius:44px;background:#fff;box-shadow:0 30px 70px rgba(20,30,60,.4);padding:36px 40px 44px;box-sizing:border-box}
.rank h3{margin:0;font-size:46px;font-weight:900;color:#2b2b3a;text-align:center;letter-spacing:-1px}
.rank .sub{text-align:center;font-size:30px;color:#999;font-weight:700;margin:6px 0 20px}
.rrow{display:flex;align-items:center;gap:22px;border-radius:28px;padding:22px 28px;margin-top:16px;font-size:50px;font-weight:900;color:#2b2b3a;background:#f4f6fa}
.rrow .no{width:110px;flex:none;font-size:46px;color:#7a8499}
.rrow.gold{background:linear-gradient(90deg,#fff1b8,#ffe07a);box-shadow:0 0 0 6px #ffcf3a inset}
.rrow.gold .no{color:#c98a00}
.pcard{position:absolute;left:50%;top:330px;transform:translateX(-50%);background:#fff;border-radius:40px;padding:30px 54px;box-shadow:0 24px 60px rgba(0,0,0,.25);text-align:center;white-space:nowrap}
.pcard .big{font-size:64px;font-weight:900;color:#2b2b3a}
.pcard .ok{display:inline-block;width:84px;height:84px;border-radius:50%;background:#5fd38a;color:#fff;font-size:56px;line-height:84px;font-weight:900;margin-bottom:10px}
.pcard .sm{font-size:34px;color:#888;font-weight:700;margin-top:4px}
`;document.head.appendChild(st)}
function chip(text,top){const el=document.createElement('div');el.className='clock';el.innerHTML=text;if(top!=null)el.style.top=top+'px';el.style.opacity=0;ui.appendChild(el);return el}
function chipPop(el,t,t0=0){el.style.transform=`translateX(-50%) scale(${pop((t-t0)/0.3)})`;el.style.opacity=t>=t0?clamp01((t-t0)/0.08):0}
function chipSet(el,html){if(el.dataset.h!==html){el.dataset.h=html;el.innerHTML=html}}
function labelSprite(text,o={}){
  const fs=o.fs||64;const c=document.createElement('canvas'),ctx=c.getContext('2d');
  ctx.font=`900 ${fs}px ${FONT}`;const tw=ctx.measureText(text).width;const pad=fs*0.5,h=fs*1.5;
  c.width=Math.ceil(tw+pad*2)+8;c.height=Math.ceil(h)+12;ctx.translate(4,4);
  ctx.fillStyle='rgba(0,0,0,0.2)';rr(ctx,0,5,c.width-8,h,o.r??18);ctx.fill();
  ctx.fillStyle=o.bg||'#fff';rr(ctx,0,0,c.width-8,h,o.r??18);ctx.fill();
  ctx.fillStyle=o.fg||'#333';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${fs}px ${FONT}`;ctx.fillText(text,(c.width-8)/2,h/2+fs*0.06);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));const k=o.size||0.006;
  s.scale.set(c.width*k,c.height*k,1);s.userData.base=[c.width*k,c.height*k];return s;
}
function armUp(p,side,k){const a=p.userData.arms[side];a.rotation.x=-2.95*k;a.rotation.z=(side?0.18:-0.18)*k}
function glowSprite(col,s){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sp.scale.set(s,s,1);return sp}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=16;return t}
function sky(top,mid,bot){bgEl.style.background=`linear-gradient(${top},${mid} 55%,${bot})`}
function mixc(a,b,k){const A=new THREE.Color(a),Bc=new THREE.Color(b);return '#'+A.lerp(Bc,clamp01(k)).getHexString()}
renderer.setClearColor(0x000000,0);
function title(){
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ISTP × 크리스마스 특별편</div><div class="title1 out">온 세상이</div><div class="title2 out">ISTP인데</div><div class="title3 out">산타가 온다면?</div>`);
  const el=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return (t,hide)=>{const o=hide?0:1;el[0].style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;el[0].style.opacity=o;
    el.slice(1).forEach((e,i)=>{const t0=0.1+i*0.25;e.style.transform=`scale(${pop((t-t0)/0.35)})`;e.style.opacity=clamp01((t-t0)/0.1)*o})};
}
function resetP(p){standPose(p);const u=p.userData;u.hip.rotation.set(0,0,0);u.head.rotation.set(0,0,0);u.hip.position.x=0;u.arms.forEach(a=>a.rotation.set(0,0,0));u.legs.forEach(l=>l.rotation.set(0,0,0))}
function wave(p,t,side=1,ph=0){armUp(p,side,1);p.userData.arms[side].rotation.z=(side?1:-1)*(0.25+Math.sin(t*9+ph)*0.35)}
