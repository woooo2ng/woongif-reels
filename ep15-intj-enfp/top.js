// ===== #015 궁합편: INTJ♂ × ENFP♀ 커플이라면? (한 커플 시점) =====
const C_J='#7a8cff', C_E='#ff8fc8';
const JB={bg:'#e2e7ff',fg:'#26307a'}, EB={bg:'#ffe0f0',fg:'#8a1f5a'};
const CAPS={
 0:["INTJ 남자랑 ENFP 여자가 사귀면?","INTJ는 고백을 석 달 동안 준비했어요.","성공 확률 계산부터 장소까지요.","그런데 ENFP가,","만난 지 사흘 만에 먼저 고백했어요."],
 1:["INTJ는 데이트 코스를 미리 다 짜 와요.","대신 여자친구를 위해,","즉흥으로 놀 시간을 네 시간 비워 놔요."],
 2:["ENFP가 속상하다고 하면,","INTJ는 해결책을 세 개 가져와요.","\"공감해 달라고!\" 했더니,","그날 밤 공감하는 법을 공부했어요.","다음 날부터 \"그랬구나\"만 다섯 번씩 해요."],
 3:["ENFP 친구 모임에 가면,","INTJ 배터리는 한 시간 만에 바닥나요.","그럼 ENFP가 배 아픈 척을 해서","같이 빠져나와 줘요.","연기는 진짜 못해요."],
 4:["싸우고 나면 INTJ는 사과문을 써 와요.","원인 분석에 재발 방지 대책까지요.","ENFP는 화내다가,","그게 너무 웃겨서 풀려 버려요."],
 5:["ENFP가 카톡을 마흔일곱 개 보내면,","INTJ는 \"ㅇㅇ\"이라고 답해요.","서운했던 ENFP가 몰래 INTJ 폰을 봤는데,","알림이 켜져 있는 건 ENFP 한 명뿐이었어요."],
 6:["ENFP가 장난으로 \"우리 나중에~\" 하고 물어보면,","INTJ는 이미 10년 계획을 세워 놨어요.","강아지 이름까지요."],
};
// 음성의 실제 쉼 위치(silencedetect)로 맞춘 자막 시작 시각(음성 기준 초)
const CAPT={0:[0,3.11,5.95,8.29,9.81],1:[0,2.75,4.51],2:[0,2.06,4.66,6.66,8.95],3:[0,1.75,4.81,6.6,8.41],4:[0,3.06,5.57,7.30],5:[0,2.75,5.47,8.99],6:[0,3.66,6.34]};
const CAPW={};
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function caption(si,t){
  const parts=CAPS[si];if(!parts)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  let starts;
  if(CAPT[si])starts=CAPT[si].map(x=>LEAD+x);
  else{const L=CAPW[si]||parts.map(p=>p.length);const v=VOICE[si]||3,tot=L.reduce((a,b)=>a+b,0);starts=[];let acc=LEAD;for(let i=0;i<parts.length;i++){starts.push(acc);acc+=v*L[i]/tot}}
  let idx=0;for(let i=0;i<parts.length;i++)if(t>=starts[i]-0.05)idx=i;
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=parts[idx]}
  const st=starts[idx];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const capAt=(si,i)=>LEAD+CAPT[si][i];
{const st=document.createElement('style');st.textContent=`
.card{position:absolute;left:110px;right:110px;border-radius:40px;background:#fff;box-shadow:0 24px 60px rgba(30,30,80,.3);padding:26px 36px;box-sizing:border-box;transform-origin:50% 0}
.card .ct{font-size:44px;font-weight:900;color:#26307a;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
.card .ct small{font-size:30px;color:#8a90b8;font-weight:700}
.crow{display:flex;align-items:center;gap:22px;font-size:42px;font-weight:700;color:#333;padding:12px 10px;border-radius:20px}
.crow .tm{width:200px;flex:none;font-weight:900;color:#5a63a8;font-size:38px}
.crow.free{background:repeating-linear-gradient(-45deg,#ffe8f4,#ffe8f4 14px,#fff3f9 14px,#fff3f9 28px);color:#c2307a;font-weight:900}
.crow.free .tm{color:#c2307a}
.crow .ok{margin-left:auto;font-weight:900;color:#2a9a5a}
.paper{position:absolute;left:150px;width:780px;height:900px;top:230px;background:#fffdf6;border-radius:14px;box-shadow:0 20px 50px rgba(40,30,20,.3);padding:50px 60px;box-sizing:border-box;transform-origin:50% 100%}
.paper.back{background:#f4f0e4}
.paper h1{margin:0 0 6px;text-align:center;font-size:76px;font-weight:900;color:#222;letter-spacing:4px}
.paper .sub{text-align:center;font-size:30px;color:#999;font-weight:700;margin-bottom:28px}
.paper .ln{font-size:40px;font-weight:900;color:#26307a;margin:22px 0 10px}
.paper .tx{font-size:32px;color:#444;font-weight:500;line-height:1.5}
.paper .bars{display:flex;align-items:flex-end;gap:16px;height:150px;margin:6px 0 0 10px}
.paper .bars div{width:70px;border-radius:8px 8px 0 0;background:#7a8cff}
.paper .pg{position:absolute;bottom:26px;right:40px;font-size:28px;color:#aaa;font-weight:700}
.kphone{position:absolute;left:150px;top:200px;width:780px;height:1010px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.kscr{position:relative;width:100%;height:100%;border-radius:60px;background:#b9d0e4;overflow:hidden}
.kscr.white{background:#f6f6f9}
.khd{height:96px;display:flex;align-items:center;padding:0 44px;font-size:42px;font-weight:900;color:#222;background:rgba(255,255,255,.6)}
.kms{position:absolute;left:0;right:0;top:96px;bottom:0;padding:20px 30px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-end;gap:14px;overflow:hidden}
.krw{display:flex;gap:12px;align-items:flex-end;transform-origin:left bottom}
.krw.me{justify-content:flex-end;transform-origin:right bottom}
.kav{width:68px;height:68px;border-radius:26px;background:${C_E};flex:none}
.kb{font-size:40px;font-weight:600;background:#fff;color:#222;border-radius:28px;padding:14px 24px;max-width:470px}
.me .kb{background:#ffe86b}
.kpic{width:260px;height:190px;border-radius:24px;flex:none}
.kbig{font-size:110px;font-weight:900;padding:10px 60px}
.setrow{display:flex;align-items:center;justify-content:space-between;padding:0 44px;height:118px;border-bottom:2px solid #e6e6ee;font-size:42px;font-weight:700;color:#333;background:#fff}
.setrow .nm{display:flex;align-items:center;gap:20px}
.setrow .ic{width:66px;height:66px;border-radius:22px}
.tg{width:120px;height:66px;border-radius:999px;background:#d4d4dc;position:relative;flex:none}
.tg::after{content:'';position:absolute;left:6px;top:6px;width:54px;height:54px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.tg.on{background:#4cd27a}
.tg.on::after{left:60px}
.setrow.hi{background:#fff0f7;color:#c2307a;font-weight:900}
.sheet{position:absolute;left:60px;right:60px;top:300px;background:#fff;border-radius:26px;box-shadow:0 24px 60px rgba(0,0,0,.4);overflow:hidden;transform-origin:50% 0}
.sheet .sh{height:84px;background:#1f7a4a;color:#fff;font-size:38px;font-weight:900;display:flex;align-items:center;padding:0 30px;gap:16px}
.sheet table{border-collapse:collapse;width:100%;font-size:36px}
.sheet td{border:2px solid #dfe5e1;padding:16px 18px;color:#333;font-weight:700}
.sheet td.y{width:150px;text-align:center;color:#1f7a4a;font-weight:900;background:#f2f8f4}
.sheet tr.hd td{background:#e9f2ec;color:#557;font-weight:900;font-size:30px;text-align:center}
.sheet tr.hi td{background:#fff4c2}
.sheet .nm{display:inline-block;background:#ffd84d;border-radius:12px;padding:0 10px;color:#5a3a00;font-weight:900}
.note{position:absolute;left:170px;right:170px;top:330px;height:620px;background:#fffef2;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.35);background-image:repeating-linear-gradient(#fffef2 0 68px,#c9d8f0 68px 71px);padding:40px 50px;box-sizing:border-box}
.note .nt{font-size:46px;font-weight:900;color:#26307a;margin-bottom:30px}
.note .big{font-size:76px;font-weight:900;color:#222;position:relative;display:inline-block;margin-top:10px}
.note .ul{position:absolute;left:0;bottom:-8px;height:12px;border-radius:6px;background:#ff5a7a}
.note .sm{font-size:38px;color:#555;font-weight:700;margin-top:40px}
`;document.head.appendChild(st)}
