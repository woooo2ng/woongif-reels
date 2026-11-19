// ===== 온 세상이 ENTJ인데 무인도에 떨어진다면? =====
const C_E='#ff6b5a';
let LEAD=0.25,TM={durs:[],lines:[],m:{}};
window.setTiming=(lead,tm)=>{LEAD=lead;TM=tm};
// 자막: timing.json 대사 배치를 따름. 리더(ENTJ) 대사는 코랄, 구조대원 대사는 노랑, 내레이션은 흰색
function caption(si,t,hideAfter){
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const ls=TM.lines.filter(l=>l.s===si);let txt='',st=0,who='n';
  for(const l of ls){if(t<l.t0-0.05)continue;if(t>l.t1+0.6&&l.who!=='n')continue;if(l.who==='n'&&t>l.t1+0.6&&ls.some(o=>o.t0>l.t0&&o.t0<=t))continue;const L=l.parts.map(p=>p.length),tot=L.reduce((a,b)=>a+b,0);let acc=l.t0;
    for(let i=0;i<l.parts.length;i++){if(t>=acc-0.05){txt=l.parts[i];st=acc;who=l.who}acc+=(l.t1-l.t0)*L[i]/tot}}
  if(hideAfter!=null&&t>hideAfter)txt='';
  if(el.dataset.x!==txt){el.dataset.x=txt;el.textContent=txt;el.style.color=who==='l'?C_E:who==='f'?'#ffd84d':'#fff'}
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=txt?clamp01((t-st+0.1)/0.1):0;
}
const ln=(si,k)=>TM.lines.find(l=>l.s===si&&l.k===k);
const MK=k=>TM.m[k];
{const st=document.createElement('style');st.textContent=`
.tag{top:250px}
.title1{top:320px;font-size:118px}
.title2{top:450px;font-size:156px;letter-spacing:-4px;color:#ff6b5a}
.title3{position:absolute;left:0;right:0;top:640px;text-align:center;font-size:104px;letter-spacing:-4px;white-space:nowrap}
.stat{white-space:nowrap;position:absolute;left:50%;transform:translateX(-50%);top:1120px;background:#2b2b3a;color:#fff;font-weight:900;font-size:50px;padding:12px 36px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.stat b{color:#ffd84d}
.clock b{color:#e2335a}
.fl{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
.end1{position:absolute;left:0;right:0;top:640px;text-align:center;font-size:118px;line-height:1.25;letter-spacing:-3px}
.end2{position:absolute;left:0;right:0;top:820px;text-align:center;font-size:62px}
.stampx{position:absolute;left:50%;top:560px;transform:translateX(-50%) rotate(-12deg);border:14px solid #e2335a;color:#e2335a;font-weight:900;font-size:150px;padding:0 50px;border-radius:30px;background:rgba(255,255,255,.85);letter-spacing:8px}
`;document.head.appendChild(st)}
