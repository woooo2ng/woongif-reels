// ===== 온 세상이 ESFP인데 전쟁이 난다면? (전쟁편) =====
const C_T='#c8ff4d';
// [음성 기준 시작 초, 자막]
const CAPL={
 0:[[0,"오늘 우리는… 조국을 위해—"],[2.948,""]],
 1:[[0,"장군님, 한 번만 다시요."],[1.85,"역광이에요."],[3.237,"…처음부터 간다."]],
 2:[[3.605,"저기요! 저 나왔죠?"],[4.955,"그 사진 저도 보내 주세요!"],[7.122,"아 잘 나왔다… 아이디 뭐예요?"],[10.031,"첫 교전은, 맞팔이었습니다."]],
 3:[[0,"그날부터 전쟁은, 좋아요 수 싸움이 됐습니다."],[3.773,"질 수 없다. 전원, 각도 잡아!"]],
 4:[[0,"장군님! 적장이 라이브 켰습니다!"],[2.27,"별풍선 벌써 8천 개입니다!"],[4.425,"…우리도 켜."],[5.765,"좋아요 싸움은 곧, 별풍선 싸움이 됐습니다."],[9.945,"별풍선 1,000개."],[11.28,"장군님 무조건 이기세요."],[13.813,"감사합니다, ESFP짱 님~!"]],
 5:[[0,"저희…"],[0.85,"항복합니다."],[2.05,"…그럼 이제 스토리에 뭐 올려요?"],[4.95,"거절합니다."],[6.27,"인류 역사상 처음으로, 항복이 거절됐습니다."],[10.16,"전쟁이 끝나면, SNS에 올릴 게 없어지니까요."]],
 6:[[0,"전쟁 10년째."],[1.67,"사상자 0명,"],[3.14,"국경 포토존 웨이팅 3시간."],[5.737,"오늘 전쟁도 와 주셔서 감사합니다~"],[8.5,"태그 잊지 마세요!"]],
};
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function caption(si,t){if(window.noCap)return;
  const L=CAPL[si];if(!L)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  let idx=-1;for(let i=0;i<L.length;i++)if(t>=LEAD+L[i][0]-0.05)idx=i;
  if(idx<0||!L[idx][1]){el.style.opacity=0;return}
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=L[idx][1]}
  const st=LEAD+L[idx][0];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const vt=x=>LEAD+x; // 음성 기준 초 -> 장면 시간
{const st=document.createElement('style');st.textContent=`
.title3{position:absolute;left:0;right:0;top:775px;text-align:center;font-size:122px;letter-spacing:-3px}
.tag{top:290px}
.title1{top:380px}
.title2{top:540px;font-size:200px}
.notif{position:absolute;left:60px;right:60px;top:200px;background:rgba(255,255,255,.96);border-radius:36px;padding:22px 30px;display:flex;align-items:center;gap:22px;box-shadow:0 14px 40px rgba(0,0,0,.2);color:#222}
.notif .ic{width:100px;height:100px;border-radius:24px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:30px}
.notif .tx{font-size:42px;font-weight:700;line-height:1.3}
.notif .tx b{font-weight:900}
.notif .bt{margin-left:auto;background:#3b82f6;color:#fff;font-weight:900;font-size:32px;padding:12px 24px;border-radius:18px;white-space:nowrap}
.photo{position:absolute;left:190px;top:240px;width:700px;height:880px;background:#fff;padding:24px 24px 90px;box-sizing:border-box;border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,.35)}
.photo canvas{width:100%;height:100%;display:block;border-radius:6px}
.photo .pl{position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:40px;font-weight:900;color:#333}
.ring{position:absolute;border:8px solid #ff3b5c;border-radius:50%;box-shadow:0 0 0 4px #fff}
.flash{position:absolute;inset:0;background:#fff;pointer-events:none}
.feed{position:absolute;left:120px;top:250px;width:840px;height:960px;border-radius:70px;background:#1b1b22;padding:20px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.feed .scr{position:relative;width:100%;height:100%;border-radius:52px;background:#fff;overflow:hidden}
.post{position:absolute;left:0;right:0;height:450px}
.post .ph{display:flex;align-items:center;gap:16px;height:70px;padding:0 26px;font-size:32px;font-weight:900;color:#222}
.post .av{width:50px;height:50px;border-radius:50%}
.post canvas{display:block;width:100%;height:300px}
.post .lk{height:70px;display:flex;align-items:center;padding:0 26px;font-size:44px;font-weight:900;color:#222}
.post .lk span{color:#ff3b6b;margin-right:12px}
.big1{position:absolute;left:50%;top:360px;transform:translateX(-50%);background:#fff;border-radius:999px;padding:12px 40px;font-size:72px;font-weight:900;color:#222;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.big1 span{color:#ff3b6b}
.live{position:absolute;background:#ff2e4d;color:#fff;font-weight:900;border-radius:12px;padding:4px 16px;font-size:34px}
.pane{position:absolute;top:300px;width:495px;height:880px;border-radius:40px;box-shadow:0 0 0 10px #1b1b22,0 30px 60px rgba(0,0,0,.3);overflow:hidden}
.pane .nm{position:absolute;left:20px;top:70px;font-size:30px;font-weight:900;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.5)}
.pane .cnt{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:56px;font-weight:900;color:#fff;text-shadow:0 0 2px #111,3px 0 0 #111,-3px 0 0 #111,0 3px 0 #111,0 -3px 0 #111}
.pane .cnt span{color:#ffd84d}
.toast{position:absolute;left:16px;right:16px;background:rgba(0,0,0,.55);color:#fff;font-size:26px;font-weight:700;border-radius:16px;padding:6px 14px;white-space:nowrap;overflow:hidden}
.toast b{color:#ffd84d}
.alert{position:absolute;left:10px;right:10px;top:250px;background:#fff7d1;border:6px solid #ffb800;border-radius:30px;text-align:center;padding:20px 8px;color:#5a3a00}
.alert .s{font-size:90px;line-height:1;color:#ffb800}
.alert .a{font-size:34px;font-weight:900;margin-top:8px}
.alert .b{font-size:46px;font-weight:900;color:#ff6a00}
.stamp{position:absolute;left:50%;top:640px;transform:translateX(-50%) rotate(-10deg);border:12px solid #ff3b4f;color:#ff3b4f;font-size:110px;font-weight:900;padding:0 40px;border-radius:24px;white-space:nowrap;background:rgba(255,255,255,.75)}
.chatbox{position:absolute;left:40px;width:520px;top:640px;height:520px;overflow:hidden}
.chatbox .ln{color:#fff;font-size:34px;font-weight:700;padding:4px 0;white-space:nowrap;text-shadow:0 0 2px #111,2px 0 0 #111,-2px 0 0 #111,0 2px 0 #111,0 -2px 0 #111}
.chatbox .ln b{color:#c8ff4d;margin-right:10px}
.pscr{position:absolute;left:60px;top:330px;width:440px;height:600px;transform-origin:center;border-radius:60px;background:#1b1b22;padding:18px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.4)}
.pscr .in{position:relative;width:100%;height:100%;border-radius:44px;overflow:hidden;background:linear-gradient(#a8d58a,#e9f5d8)}
.pscr .bar{position:absolute;left:0;right:0;bottom:0;height:100px;background:rgba(0,0,0,.65);color:#fff;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900}
.pscr .bar b{color:#c8ff4d;margin-left:12px}
.end1{position:absolute;left:0;right:0;top:190px;text-align:center;font-size:96px;letter-spacing:-3px}
.end2{position:absolute;left:0;right:0;top:340px;text-align:center;font-size:58px}
`;document.head.appendChild(st)}
