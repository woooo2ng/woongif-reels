// ===== #012 온 세상이 ENTP라면? =====
const C_T='#ffc04d';
const TB={bg:'#fff0c7',fg:'#5a3d00'};
const CAPS={
 0:["온 세상이 ENTP라면?","다들 도파민이 부족해서,","1배속으로는 아무것도 못 봐요.","그래서 요즘 영화관은,","2배속으로 틀어 줘요."],
 1:["시험 공부는 안 하고,","공부 잘하는 법만 3시간 찾아봐요.","그리고 결국 시험 전날 밤에,","다 같이 천재가 돼요."],
 2:["새 취미는 장비부터 풀세트로 사요.","그리고 3일 만에 중고로 팔아요.","제가 판 기타는,","동네를 한 바퀴 돌아서 다시 저한테 왔어요."],
 3:["다들 토론을 좋아해서, 회식 자리도 토론장이 돼요.","주제는 '고양이가 사람만 하면 누가 이길까'예요.","마지막엔 사장님도 끼어 있었어요."],
 4:["단톡에 공지가 올라오면, 드립이 300개 달려요.","공지는 드립에 묻혀서, 아무도 못 봤어요."],
 5:["평소엔 장난만 치지만,","친구가 억울한 일을 당하면 진지해져요.","그 말빨로 내 사람은","끝까지 지켜 주는 세상이에요."],
};
// 음성의 실제 쉼 위치(silencedetect)로 맞춘 자막 시작 시각(음성 기준 초) — capt.json에서 채움
const CAPT=/*CAPT*/{"0": [0.0, 2.0, 3.91, 6.18, 7.45], "1": [0.0, 1.27, 3.86, 5.83], "2": [0.0, 2.64, 5.05, 5.94], "3": [0.0, 3.4, 7.3], "4": [0.0, 3.2], "5": [0.0, 1.33, 4.13, 5.85], "6": [0.0, 2.61]}/*END*/;
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function capStarts(si){
  const parts=CAPS[si];if(CAPT[si])return CAPT[si].map(x=>LEAD+x);
  const L=parts.map(p=>p.length);const v=VOICE[si]||3,tot=L.reduce((a,b)=>a+b,0);const s=[];let acc=LEAD;
  for(let i=0;i<parts.length;i++){s.push(acc);acc+=v*L[i]/tot}return s}
function caption(si,t){
  const parts=CAPS[si];if(!parts)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const starts=capStarts(si);
  let idx=0;for(let i=0;i<parts.length;i++)if(t>=starts[i]-0.05)idx=i;
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=parts[idx]}
  const st=starts[idx];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const capAt=(si,i)=>capStarts(si)[i];
const vEnd=si=>LEAD+(VOICE[si]||3);
{const st=document.createElement('style');st.textContent=`
.card{position:absolute;left:80px;right:80px;top:640px;border-radius:44px;background:#fff;box-shadow:0 24px 60px rgba(30,20,70,.35);padding:30px 40px;box-sizing:border-box;text-align:center}
.card .k{font-size:40px;color:#999;font-weight:900}
.card .v{font-size:64px;font-weight:900;color:#222;margin-top:6px}
.btn2x{position:absolute;left:50%;top:420px;width:340px;height:340px;margin-left:-170px;border-radius:50%;background:#ffc04d;border:18px solid #fff;box-shadow:0 30px 70px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;font-size:150px;font-weight:900;color:#5a3d00;letter-spacing:-8px}
.mk{position:absolute;left:24px;right:24px;top:170px;bottom:0;overflow:hidden}
.mk .it{display:flex;gap:22px;align-items:center;padding:16px 10px;border-bottom:2px solid #eee}
.mk .th{width:150px;height:150px;border-radius:22px;flex:none}
.mk .tt{font-size:40px;font-weight:900;color:#222}
.mk .tg{display:inline-block;margin-top:8px;background:#ffe9b0;color:#a05a00;border-radius:12px;font-size:30px;font-weight:900;padding:4px 14px}
.mk .pr{font-size:34px;color:#666;font-weight:700;margin-top:6px}
.watch{position:absolute;left:50%;top:330px;width:330px;height:330px;margin-left:-165px;border-radius:50%;background:#fff;border:16px solid #333;box-shadow:0 20px 50px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:170px;font-weight:900;color:#e2335a}
.end3{position:absolute;left:50%;transform:translateX(-50%);top:1500px;white-space:nowrap;background:#ffd84d;color:#3a2a00;font-weight:900;font-size:48px;padding:14px 36px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.3)}
`;document.head.appendChild(st)}
