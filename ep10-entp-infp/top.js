// ===== #010 궁합편: ENTP♂ × INFP♀ 커플이라면? (한 커플 시점) =====
const C_T='#ffc04d', C_F='#c9a8ff';
const TB={bg:'#fff0cc',fg:'#6a4300'}, FB={bg:'#ece2ff',fg:'#4a2f86'};
const CAPS={
 0:["ENTP 남자랑 INFP 여자가 사귀면?","\"나 바퀴벌레 되면 어떡할 거야?\"","하면, ENTP는 대답 대신 질문을 스무 개 해요.","언제부터야? 말은 할 수 있어?","그렇게 조건을 다 따지고 나서야, 답을 해 줘요.","\"키워야지.\""],
 1:["INFP는 프사 하나 바꾸는 데도,","후보를 47장이나 골라 놓고 사흘을 고민해요.","그런데 ENTP가 쓱 보더니","\"다 똑같은데?\" 한마디 했어요.","상처받은 INFP는 그날 밤 프사를 내려 버렸어요.","텅 빈 기본 사진을 보고, ENTP는 미안해졌어요."],
 2:["ENTP는 놀리는 게 애정 표현이에요.","그런데 INFP는 리액션까지 너무 귀여워서,","둘이 더 잘 맞아요."],
 3:["INFP는 답장에 찍힌 마침표 하나에도 소설을 써요.","권태기, 이별, 고양이랑 늙어 가는 엔딩까지 갔는데,","ENTP는 그냥 운전 중이라 음성으로 보낸 거였어요."],
 4:["ENTP는 약속이 너무 많아요.","INFP는 \"괜찮아~\"라고 하는데,","속으로는 서운함을 하나씩 적립하고 있어요.","ENTP는 진짜 괜찮은 줄 알아요."],
 5:["대신 \"만약에\" 이야기는 둘이 끝이 없어요.","\"지구에 우리 둘만 남으면?\"으로 시작해서,","새벽 4시엔 둘이 나라를 하나 세웠어요."],
 6:["ENTP는 이길 수 있는 말싸움도","INFP한테는 그냥 져 줘요.","그리고 INFP는, 석 달 전에 지나가듯 말한","한정판 운동화를 기억해 뒀다가 선물해요."],
};
// 음성의 실제 쉼 위치(silencedetect)로 맞춘 자막 시작 시각(음성 기준 초)
const CAPT={0:[0,3.15,4.88,8.49,10.37,13.58],1:[0,2.05,5.62,8.12,10.25,13.67],2:[0,2.8,6.13],3:[0,3.92,7.77],4:[0,2.62,4.75,8.24],5:[0,3.29,6.42],6:[0,2.05,4.57,7.27]};
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
.pgrid{position:absolute;left:24px;right:24px;top:180px;bottom:24px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:150px;gap:10px;align-content:start}
.pt{border-radius:16px;position:relative;overflow:hidden}
.pt .hd{position:absolute;left:50%;top:34px;width:56px;height:56px;margin-left:-28px;border-radius:50%;background:#f3cfae}
.pt .hr{position:absolute;left:50%;top:26px;width:64px;height:40px;margin-left:-32px;border-radius:32px 32px 10px 10px;background:#5a3826}
.pt .bd{position:absolute;left:50%;top:92px;width:86px;height:70px;margin-left:-43px;border-radius:30px 30px 0 0;background:#c9a8ff}
.pt .ck{position:absolute;right:8px;top:6px;font-size:26px;font-weight:900;color:#fff}
.prof{position:absolute;left:0;right:0;top:170px;text-align:center}
.prof .av{width:340px;height:340px;border-radius:50%;margin:0 auto;position:relative;overflow:hidden}
.prof .nm{margin-top:26px;font-size:54px;font-weight:900;color:#222}
.prof .st{margin-top:10px;font-size:34px;color:#888;font-weight:700}
.btn{position:absolute;left:60px;right:60px;height:110px;border-radius:30px;font-size:46px;font-weight:900;display:flex;align-items:center;justify-content:center}
.tap{position:absolute;width:90px;height:90px;border-radius:50%;background:rgba(80,80,90,.35);border:6px solid rgba(255,255,255,.9)}
.bigmsg{position:absolute;left:90px;right:90px;top:360px;border-radius:44px;background:#fff;box-shadow:0 24px 60px rgba(30,20,70,.35);padding:30px 40px;box-sizing:border-box}
.bigmsg .who{font-size:34px;color:#888;font-weight:700;margin:0 0 10px 4px}
.bigmsg .b{font-size:96px;font-weight:900;color:#222;max-width:none;background:#ffe3a8;display:inline-block;border-radius:40px;padding:14px 44px}
.chatp{position:absolute;left:80px;right:80px;top:330px;border-radius:44px;background:#c9dbea;box-shadow:0 24px 60px rgba(20,20,60,.4);padding:0 0 30px;overflow:hidden}
.chatp .cht{height:96px;display:flex;align-items:center;padding:0 40px;font-size:42px;font-weight:900;color:#222;background:rgba(255,255,255,.55);margin-bottom:20px}
.chatp .rw{display:flex;align-items:flex-end;gap:14px;padding:10px 34px;transform-origin:left bottom}
.chatp .av2{width:70px;height:70px;border-radius:26px;background:#ffc04d;flex:none}
.chatp .bb{font-size:46px;font-weight:700;background:#fff;color:#222;border-radius:30px;padding:16px 28px}
.chatp .old .bb{opacity:.75}
.chatp .tm{font-size:26px;color:#5a6a7a;font-weight:700}
.chatp .dv{align-self:center;margin:14px auto 4px;width:140px;text-align:center;font-size:28px;color:#fff;background:rgba(0,0,0,.2);border-radius:999px;padding:4px 0}
.chatp .big{font-size:84px;font-weight:900;padding:12px 70px 12px 36px;background:#fff}
.dot{display:inline-block;position:relative;color:#222}
.ring{position:absolute;border-radius:50%;border:12px solid #e2335a}
`;document.head.appendChild(st)}
