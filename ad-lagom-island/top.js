// ===== 라곰 협업 2차: 온 세상이 ISFP인데 무인도에 떨어진다면? =====
const C_I='#9df2c8';
let LEAD=0.25,TM={durs:[],lines:[]};
window.setTiming=(lead,tm)=>{LEAD=lead;TM=tm};
// 자막: timing.json 대사 배치를 그대로 따름. ISFP 대사는 민트, 친구 대사는 노랑
function caption(si,t,hideAfter){
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const ls=TM.lines.filter(l=>l.s===si);let txt='',st=0,who='n';
  for(const l of ls){if(t<l.t0-0.05)continue;if(t>l.t1+0.6&&l.who!=='n')continue;const L=l.parts.map(p=>p.length),tot=L.reduce((a,b)=>a+b,0);let acc=l.t0;
    for(let i=0;i<l.parts.length;i++){if(t>=acc-0.05){txt=l.parts[i];st=acc;who=l.who}acc+=(l.t1-l.t0)*L[i]/tot}}
  if(hideAfter!=null&&t>hideAfter)txt='';
  if(el.dataset.x!==txt){el.dataset.x=txt;el.textContent=txt;el.style.color=who==='i'?C_I:who==='f'?'#ffd84d':'#fff'}
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=txt?clamp01((t-st+0.1)/0.1):0;
}
const lineT=(si,k)=>TM.lines.find(l=>l.s===si&&l.k===k);
{const st=document.createElement('style');st.textContent=`
.t1b{position:absolute;left:0;right:0;top:330px;text-align:center;font-size:150px;letter-spacing:-4px;white-space:nowrap;color:#9df2c8}
.t2b{position:absolute;left:0;right:0;top:510px;text-align:center;font-size:116px;letter-spacing:-4px;white-space:nowrap}
.clock b{color:#e2335a}
.alarms{position:absolute;left:130px;right:130px;top:560px;border-radius:44px;background:#1d1d24;padding:26px 34px 18px;box-shadow:0 30px 70px rgba(30,20,60,.45)}
.alarms .hd{font-size:44px;font-weight:900;color:#fff;margin:0 0 8px 6px}
.alarms .row{display:flex;align-items:center;justify-content:space-between;padding:16px 8px;border-top:2px solid rgba(255,255,255,.08)}
.alarms .tm{font-size:74px;font-weight:300;color:#fff;letter-spacing:-2px}
.alarms .tm small{font-size:34px;font-weight:500;margin-right:10px}
.alarms .tg{width:120px;height:70px;border-radius:999px;background:#4cd964;position:relative;transition:none}
.alarms .tg i{position:absolute;top:5px;right:5px;width:60px;height:60px;border-radius:50%;background:#fff}
.alarms .row.off .tm{color:#666}
.alarms .row.off .tg{background:#555}
.alarms .row.off .tg i{right:55px}
.mirror{position:absolute;left:40px;right:40px;top:120px;bottom:120px;border:26px solid #e9eef0;border-radius:90px;box-shadow:inset 0 0 0 6px rgba(0,0,0,.08),0 0 0 6px rgba(0,0,0,.06);pointer-events:none}
.flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
.chat{position:absolute;left:150px;right:150px;top:330px;border-radius:44px;background:#b9cfe0;box-shadow:0 26px 60px rgba(30,30,60,.4);overflow:hidden}
.chat .hd{background:#a9c2d6;padding:20px 30px;font-size:40px;font-weight:900;color:#223}
.chat .ms{padding:24px 26px 30px;display:flex;flex-direction:column;gap:16px;min-height:300px;justify-content:flex-end}
.chat .r{display:flex;gap:14px;align-items:flex-end}
.chat .r.me{justify-content:flex-end}
.chat .av{width:70px;height:70px;border-radius:26px;background:#f4c27a;flex:none}
.chat .b{font-size:44px;font-weight:700;background:#fff;color:#222;border-radius:28px;padding:16px 26px}
.chat .me .b{background:#ffe86b}
.chat .in{margin:0 20px 20px;background:#fff;border-radius:999px;padding:14px 26px;font-size:40px;color:#222;min-height:56px}
.chat .in .cur{display:inline-block;width:4px;height:44px;background:#3a7bd5;vertical-align:middle;margin-left:2px}
.stat{white-space:nowrap;position:absolute;left:50%;transform:translateX(-50%);top:1120px;background:#2b2b3a;color:#fff;font-weight:900;font-size:46px;padding:12px 34px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.stat b{color:#ffd84d}
`;document.head.appendChild(st)}
