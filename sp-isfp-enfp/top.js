// ===== 나만 다른 MBTI #1: 온 세상이 ISFP인데 나만 ENFP라면? =====
const C_I='#9df2c8', C_E='#ff8fc8';
const IB={bg:'#d9fbe9',fg:'#1f5a42'}, EB={bg:'#ffe0f0',fg:'#8a1f5a'};
let LEAD=0.25,TM={durs:[],lines:[]};
window.setTiming=(lead,tm)=>{LEAD=lead;TM=tm};
// 자막: timing.json의 대사 배치를 그대로 따름. ENFP 대사는 분홍 글씨
function caption(si,t,hideAfter){
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const ls=TM.lines.filter(l=>l.s===si);let txt='',st=0,who='n';
  for(const l of ls){if(t<l.t0-0.05)continue;const L=l.parts.map(p=>p.length),tot=L.reduce((a,b)=>a+b,0);let acc=l.t0;
    for(let i=0;i<l.parts.length;i++){if(t>=acc-0.05){txt=l.parts[i];st=acc;who=l.who}acc+=(l.t1-l.t0)*L[i]/tot}}
  if(hideAfter!=null&&t>hideAfter)txt='';
  if(el.dataset.x!==txt){el.dataset.x=txt;el.textContent=txt;el.style.color=who==='e'?C_E:'#fff'}
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=txt?clamp01((t-st+0.1)/0.1):0;
}
const lineT=(si,k)=>TM.lines.find(l=>l.s===si&&l.k===k);
{const st=document.createElement('style');st.textContent=`
.tag2{position:absolute;left:50%;transform:translateX(-50%);top:250px;background:#ffd84d;color:#3a2a00;font-weight:900;font-size:50px;padding:6px 26px;border-radius:16px;white-space:nowrap}
.t1b{position:absolute;left:0;right:0;top:340px;text-align:center;font-size:118px;letter-spacing:-3px;white-space:nowrap}
.t2b{position:absolute;left:0;right:0;top:490px;text-align:center;font-size:150px;letter-spacing:-5px;white-space:nowrap}
.note{position:absolute;left:150px;right:150px;top:430px;background:#fffbea;border-radius:26px;padding:40px 46px 46px;box-shadow:0 26px 60px rgba(60,40,20,.35);transform-origin:50% 60%;font-weight:900;color:#3b3328;font-size:54px;line-height:1.4;text-align:center}
.note .dd{display:flex;justify-content:center;gap:34px;margin-bottom:22px;font-size:70px}
.note .tape{position:absolute;left:50%;top:-24px;width:170px;height:50px;margin-left:-85px;background:rgba(255,200,220,.85);transform:rotate(-3deg)}
.note .sm{display:block;margin-top:14px;color:#2f7a5a}
.stat{white-space:nowrap;position:absolute;left:50%;transform:translateX(-50%);top:1120px;background:#2b2b3a;color:#fff;font-weight:900;font-size:46px;padding:12px 34px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.stat b{color:#ffd84d}
.wx{display:inline-block;margin-left:10px;font-size:26px;font-weight:900;color:#c77700;background:#fff2c2;border-radius:999px;padding:2px 14px;vertical-align:middle}
.noti{position:absolute;left:90px;right:90px;height:118px;border-radius:30px;background:rgba(255,255,255,.96);box-shadow:0 14px 34px rgba(0,0,0,.22);display:flex;align-items:center;gap:22px;padding:0 28px;box-sizing:border-box}
.noti .ic{width:74px;height:74px;border-radius:22px;flex:none}
.noti .tx{font-size:40px;font-weight:800;color:#222;white-space:nowrap;overflow:hidden}
.noti .nm{font-size:26px;color:#888;font-weight:700}
.photo{width:430px;height:300px;border-radius:24px;background:linear-gradient(#5b4b9a,#c86fb0 45%,#ffb37a 75%,#ffd9a0);position:relative;overflow:hidden}
.photo .sun{position:absolute;left:50%;top:62%;width:110px;height:110px;margin-left:-55px;border-radius:50%;background:#ffe9a8;box-shadow:0 0 60px #ffd27a}
.photo .sea{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(#7a5fa8,#4a3f7a)}
.icom{position:absolute;left:170px;right:170px;top:360px;height:760px;border-radius:40px;background:#e9e6df;box-shadow:0 26px 60px rgba(0,0,0,.4);padding:30px;box-sizing:border-box}
.icom .scr{position:relative;height:440px;border-radius:24px;background:linear-gradient(#a9c8e8,#dde9f5);overflow:hidden}
.icom .lbl{margin-top:24px;text-align:center;font-size:40px;font-weight:900;color:#444}
.icom .live{position:absolute;left:22px;top:18px;font-size:30px;font-weight:900;color:#fff;background:#e2335a;border-radius:10px;padding:2px 14px}
.icom .bub{position:absolute;left:30px;right:30px;top:70px;text-align:center;font-size:44px;font-weight:900;color:#5a3a00;background:#fff3c4;border-radius:999px;padding:12px 10px}
.end1{position:absolute;left:0;right:0;top:520px;text-align:center;font-size:104px;line-height:1.25;letter-spacing:-3px}
.end2{position:absolute;left:0;right:0;top:830px;text-align:center;font-size:58px}
`;document.head.appendChild(st)}
