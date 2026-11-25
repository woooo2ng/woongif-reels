// ===== #018 온 세상이 ESTJ라면? =====
const C_T='#5ccf7a';
const TB={bg:'#dcf7e4',fg:'#1f6a3a'};
// 내레이션 클립별 자막 (클립 안에서는 글자 수 비율로 나눔)
const CAPS={
 0:{n1:["온 세상이 ESTJ라면?"],n2a:["새해 첫 주엔 헬스장이 꽉 차요."],n2b:["근데 12월에도 꽉 차요.","다들 새해 목표를 진짜 지키거든요."]},
 1:{n3a:["아침이면 다들 투두리스트부터 써요."],n3b:["이미 한 일도 적어요.","체크하는 맛이 있거든요."]},
 2:{n4a:["조별과제는 마감 2주 전에 내요.","무임승차도 없어요."],n4b:["그래서 교수님이","채점 기준을 못 만들었어요."]},
 3:{n5a:["회식이 끝나면, 신발 신기도 전에","정산이 끝나 있어요."],n5b:["다들 1분 안에 보내요.","늦게 보내는 사람이 없어요."]},
 4:{n6a:["연인끼리 싸우면, 그날 바로 풀어요."],n6b:["회의로요.","재발 방지책까지 나와요."]},
 5:{n7a:["모임에선 다들 진행을 봐요."],n7b:["근황 토크도 1인 1분이에요.","30명이라 딱 30분 걸렸어요."]},
 6:{n8a:["태풍이 와도, 약속엔 다 와요."],n8b:["늦은 건 태풍뿐이었어요.","예보보다 10분 늦었거든요."]},
};
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
const LS=(si,n,k=0)=>LEAD+TM[si].lines[n][0]+k;
const LE=(si,n,k=0)=>LEAD+TM[si].lines[n][0]+TM[si].lines[n][1]+k;
const EV=(si,k)=>TM[si].ev[k];
function caption(si,t){
  const C=CAPS[si];if(!C)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const names=Object.keys(TM[si].lines);let txt=null,st=0;
  for(const n of Object.keys(C)){
    const a=LS(si,n),b=LE(si,n);const ni=names.indexOf(n);const nx=names[ni+1];
    const until=nx?Math.min(b+0.45,LS(si,nx)-0.05):b+1.5;
    if(t>=a-0.05&&t<until){const parts=C[n];const L=parts.map(p=>p.length),tot=L.reduce((x,y)=>x+y,0);
      let acc=a;for(let i=0;i<parts.length;i++){if(t>=acc-0.05){txt=parts[i];st=acc}acc+=(b-a)*L[i]/tot}}
  }
  if(txt===null){el.style.opacity=0;return}
  if(el.textContent!==txt)el.textContent=txt;
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
{const st=document.createElement('style');st.textContent=`
.card{position:absolute;left:110px;right:110px;top:300px;background:#fff;border-radius:34px;box-shadow:0 24px 60px rgba(0,0,0,.3);overflow:hidden;transform-origin:50% 0}
.card .ch{height:92px;background:#2f9a5a;color:#fff;font-size:42px;font-weight:900;display:flex;align-items:center;justify-content:space-between;padding:0 34px}
.card .ch small{font-size:30px;opacity:.9}
.card .rw{display:flex;align-items:center;gap:22px;height:92px;border-bottom:2px solid #eef2ef;padding:0 34px;font-size:40px;font-weight:700;color:#333;transform-origin:0 50%}
.card .rw b{width:52px;font-size:50px;color:#2a9a5a;flex:none;text-align:center}
.card .rw .r{margin-left:auto;font-size:34px;color:#2a9a5a;font-weight:900}
.card .rw.bx b{color:#999}
.nb{position:absolute;left:190px;right:190px;top:300px;background:#fffdf3;border-radius:16px;box-shadow:0 22px 50px rgba(60,50,0,.3);padding:40px 50px 30px;box-sizing:border-box;transform-origin:50% 0;
  background-image:repeating-linear-gradient(#fffdf3 0 88px,#cfe0f0 88px 91px);background-position:0 120px}
.nb::before{content:'';position:absolute;left:0;top:0;bottom:0;width:22px;background:repeating-linear-gradient(#5ccf7a 0 26px,transparent 26px 40px)}
.nb h2{margin:0 0 14px;font-size:48px;font-weight:900;color:#1f6a3a}
.nb .rw{display:flex;align-items:center;gap:22px;height:91px;font-size:48px;font-weight:700;color:#333}
.mbox{width:56px;height:56px;border:6px solid #444;border-radius:12px;flex:none;position:relative;box-sizing:border-box}
.mbox .ck{position:absolute;left:-4px;top:-26px;font-size:76px;font-weight:900;color:#2a9a5a;line-height:1}
.mail{position:absolute;left:120px;right:120px;top:270px;height:900px;background:#f4f6fa;border-radius:34px;box-shadow:0 24px 60px rgba(0,0,0,.3);overflow:hidden}
.mail .mh{height:100px;background:#3b6fd8;color:#fff;font-size:42px;font-weight:900;display:flex;align-items:center;justify-content:space-between;padding:0 34px}
.mail .badge{background:#ff4d6a;border-radius:999px;padding:4px 20px;font-size:36px}
.mail .ml{position:absolute;left:0;right:0;top:100px;bottom:0;overflow:hidden}
.mail .it{height:96px;background:#fff;border-bottom:2px solid #e6eaf2;display:flex;align-items:center;gap:20px;padding:0 30px;font-size:34px;color:#333;font-weight:700}
.mail .it i{width:56px;height:56px;border-radius:50%;flex:none}
.mail .it span{color:#889;font-size:28px;margin-left:auto;font-weight:700}
.news{position:absolute;left:80px;right:80px;top:260px;height:520px;border-radius:30px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.4);background:linear-gradient(#5a6a86,#2e3a52)}
.news .lv{position:absolute;left:30px;top:26px;background:#e8324a;color:#fff;font-size:34px;font-weight:900;padding:4px 18px;border-radius:8px}
.news .tt{position:absolute;left:0;right:0;bottom:0;height:150px;background:#fff;display:flex;align-items:center;gap:20px;padding:0 30px;font-size:52px;font-weight:900;color:#222}
.news .tt b{background:#e8324a;color:#fff;font-size:38px;padding:6px 16px;border-radius:8px;flex:none}
.timer{white-space:nowrap;position:absolute;left:50%;top:330px;transform:translateX(-50%);background:#1f2a24;color:#7dffa6;font-size:120px;font-weight:900;font-family:monospace;padding:10px 46px;border-radius:30px;box-shadow:0 20px 50px rgba(0,0,0,.35);letter-spacing:4px}
.end3{position:absolute;left:0;right:0;top:1500px;text-align:center;font-size:46px}
`;document.head.appendChild(st)}
function el(html){const d=document.createElement('div');d.innerHTML=html;const n=d.firstElementChild;ui.appendChild(n);return n}
function popEl(e,t,t0,base='',out=null){const o=out==null?1:1-ease((t-out)/0.2);e.style.transform=`${base}scale(${pop((t-t0)/0.3)*(0.9+0.1*o)})`;e.style.opacity=clamp01((t-t0)/0.08)*o}
const bT=(txt,o={})=>makeBubble(txt,{...TB,fs:o.fs||64,size:o.size||0.0042});
const bub=(b,t,a,z)=>scaleBubble(b,pop((t-a)/0.22)*(z==null?1:1-ease((t-z)/0.18)));
