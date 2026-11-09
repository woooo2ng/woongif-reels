// ===== #008 온 세상이 INTJ라면? =====
const C_T='#8fa0ff';
const TB={bg:'#dfe4ff',fg:'#2a3570'};
const CAPS={
 0:["온 세상이 INTJ라면?","다들 웃고 있지만,","사실 전부 사회생활 중이에요."],
 1:["번개 모임엔 다들 선약이 있어요.","그 선약은 혼자 집에 있는 거예요."],
 2:["대표 선거도 모이는 건 비효율적이라","온라인으로 해요.","10분 전에 전원 입장하고,","지각은 법으로 금지예요."],
 3:["전 대표 퇴임 연설은 생략해요.","지난 일보다 앞으로가 중요하니까요.","후보 공약은 미리 나눠 줬고,","다들 당연히 다 읽고 왔어요."],
 4:["투표는 3초 만에 끝나고,","당선 공약은 대부분 동물 복지예요.","사람은 알아서 하래요."],
 5:["여행 갈 땐 플랜 A, B, C까지","다 짜 와서,","비가 와도 아무도 당황 안 해요."],
 6:["사랑에 빠지면 순애보가 되는 걸","본인이 너무 잘 알아서,","일단 부정부터 해요.","근데 결국 평생 한 사람만 봐요."],
 7:["로봇 같다고요?","사실 눈물이 제일 많아요.","동물 앞에서만요."],
};
// 음성의 실제 쉼 위치(silencedetect)로 맞춘 자막 시작 시각(음성 기준 초)
const CAPT={0:[0,2.6,4.05],1:[0,2.6],2:[0,2.35,4.0,5.95],3:[0,2.5,5.2,7.2],4:[0,1.85,4.8],5:[0,2.75,3.8],6:[0,2.15,3.95,5.8],7:[0,1.5,4.1]};
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
// 추가 스타일
{const st=document.createElement('style');st.textContent=`
.conf{position:absolute;left:50px;right:50px;top:300px;height:900px;border-radius:44px;background:#20243a;box-shadow:0 30px 70px rgba(30,30,80,.35);overflow:hidden}
.confh{height:84px;display:flex;align-items:center;justify-content:space-between;padding:0 34px;color:#fff;font-size:36px;font-weight:900}
.confh .rec{background:#ff5a6e;border-radius:999px;padding:4px 18px;font-size:28px}
.grid{position:absolute;left:18px;right:18px;top:96px;bottom:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.tile{position:relative;border-radius:20px;background:#3a4060;overflow:hidden}
.tile .nm{position:absolute;left:10px;bottom:6px;font-size:22px;color:#fff;font-weight:700;opacity:.9}
.tile .ok{position:absolute;right:10px;top:8px;font-size:30px;font-weight:900;color:#7dffb0}
.face{position:absolute;left:50%;top:50%;width:92px;height:92px;margin:-56px 0 0 -46px;border-radius:50%}
.face .hair{position:absolute;left:-4px;right:-4px;top:-8px;height:46px;border-radius:50px 50px 14px 14px}
.face .eye{position:absolute;top:44px;width:9px;height:13px;background:#1a1a1a;border-radius:4px}
.face .mouth{position:absolute;left:36px;top:68px;width:20px;height:4px;background:#5a2a2a;border-radius:2px}
.face .book{position:absolute;left:-22px;top:46px;width:136px;height:92px;border-radius:8px;background:#fff7d6;box-shadow:0 4px 0 rgba(0,0,0,.25)}
.face .book i{position:absolute;left:12px;height:9px;border-radius:3px;background:#fff06a}
.face .book b{position:absolute;top:-14px;width:16px;height:26px;border-radius:3px}
.wait{background:#2b2f45!important}
.wait .face{opacity:.35}
.wait .ld{position:absolute;left:0;right:0;top:50%;margin-top:-20px;text-align:center;color:#fff;font-size:30px;font-weight:900}
.big{position:absolute;left:0;right:0;text-align:center}
.poster{position:absolute;left:110px;right:110px;top:300px;height:880px;border-radius:30px;background:#fffdf4;box-shadow:0 30px 70px rgba(60,40,90,.35);padding:50px 56px;box-sizing:border-box;color:#2a3570}
.poster h1{margin:0;font-size:84px;letter-spacing:-3px;text-align:center}
.poster h2{margin:6px 0 34px;font-size:40px;text-align:center;color:#7a83b8}
.poster li{font-size:52px;font-weight:900;margin:10px 0;list-style:none}
.poster .small{position:absolute;right:56px;bottom:40px;font-size:30px;color:#9a9ab0;font-weight:700}
.chat{position:absolute;overflow:hidden;border-radius:30px;background:#2a2f48}
.chat .ln{color:#fff;font-size:30px;font-weight:700;padding:4px 18px;white-space:nowrap}
.chat .ln b{color:#9fb0ff;margin-right:8px}
.heartfill{position:absolute;left:50%;top:50%;font-size:300px;color:#ff7aa8;line-height:1;transform:translate(-50%,-50%)}
`;document.head.appendChild(st)}
