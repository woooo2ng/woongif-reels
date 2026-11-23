// ===== #017 궁합편: ISTP♂ × ESTJ♀ 커플이라면? (한 커플 시점) =====
const C_I='#ffb84d', C_T='#5ccf7a';
const IB={bg:'#fff0d6',fg:'#7a4a00'}, TB={bg:'#dcf7e4',fg:'#1f6a3a'};
// 내레이션 클립별 자막 (클립 안에서는 글자 수 비율로 나눔)
const CAPS={
 0:{n1:["ISTP 남자랑 ESTJ 여자가 사귀면?"],n2a:["그 뒤로 ISTP는,","정확히 2시간 59분마다 연락해요."],n2b:["'살아 있음' 한 줄씩이요."]},
 1:{n3:["ESTJ가 주말에 할 일 일곱 개를 적어 줬는데,","ISTP는 대답이 없어요."],n4:["화가 난 ESTJ가 메모를 봤더니,","이미 다 해 놨어요."],n5:["보고만 안 했어요."]},
 2:{n6a:["ESTJ는 데이트 통장 가계부를","영수증까지 붙여서 써요."],n6b:["그런데 ISTP는 그냥","자기가 계산해 버려요."],n7a:["다음 날엔 통장에 말없이","30만 원을 넣어 놔요."],n7b:["ESTJ는 그게 고마운데,","가계부가 안 맞아서 화가 나요."]},
 3:{n8a:["ISTP는 여행을 전날 밤에 통보해요."],n8b:["ESTJ는 화를 내면서,","밤새 일정표를 짜 줬어요."],n9:["그렇게 받아 갔는데,","사진첩을 보니 일정표 순서대로 다 다녀왔어요."]},
 4:{n10:["ESTJ는 식당 하나 고르는 데 비교표를 만들어요.","별점, 리뷰, 대기 시간까지요."],n11:["그사이 ISTP는 눈앞에 있는","국밥집에 그냥 들어가요.","근데 그게, 제일 맛있어요."]},
 5:{n12:["잔소리를 흘려듣는 줄 알았는데,","ISTP 메모장에는 ESTJ 잔소리가","다 적혀 있었어요.","그리고 하나씩, 체크하고 있었어요."]},
};
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
const LS=(si,n,k=0)=>LEAD+TM[si].lines[n][0]+k;           // 대사 시작
const LE=(si,n,k=0)=>LEAD+TM[si].lines[n][0]+TM[si].lines[n][1]+k; // 대사 끝
const EV=(si,k)=>TM[si].ev[k].map?TM[si].ev[k].map(x=>x):TM[si].ev[k];
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
.kphone{position:absolute;left:150px;top:250px;width:780px;height:960px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.kscr{position:relative;width:100%;height:100%;border-radius:60px;background:#b9d0e4;overflow:hidden}
.kscr.white{background:#f6f6f9}
.khd{height:96px;display:flex;align-items:center;padding:0 44px;font-size:42px;font-weight:900;color:#222;background:rgba(255,255,255,.6)}
.kms{position:absolute;left:0;right:0;top:96px;bottom:0;padding:20px 30px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-end;gap:16px;overflow:hidden}
.krw{display:flex;gap:12px;align-items:flex-end;transform-origin:left bottom}
.krw.me{justify-content:flex-end;transform-origin:right bottom}
.kav{width:68px;height:68px;border-radius:26px;flex:none}
.kb{font-size:44px;font-weight:700;background:#fff;color:#222;border-radius:28px;padding:16px 26px;max-width:470px}
.me .kb{background:#ffe86b}
.ktm{font-size:28px;color:#556;font-weight:700;margin-bottom:6px}
.kdiv{align-self:center;font-size:28px;color:#fff;background:rgba(0,0,0,.2);padding:6px 22px;border-radius:999px}
.memo{position:absolute;left:170px;right:170px;top:300px;background:#fffbd0;border-radius:10px;box-shadow:0 20px 50px rgba(60,50,0,.3);padding:44px 54px 50px;box-sizing:border-box;transform-origin:50% 0}
.memo::before{content:'';position:absolute;left:50%;top:-22px;width:60px;height:60px;margin-left:-30px;border-radius:50%;background:#e84a6a;box-shadow:0 4px 8px rgba(0,0,0,.3)}
.memo h2{margin:0 0 18px;font-size:54px;font-weight:900;color:#3a3000}
.mrow{display:flex;align-items:center;gap:22px;font-size:44px;font-weight:700;color:#333;height:84px}
.mbox{width:50px;height:50px;border:5px solid #444;border-radius:10px;flex:none;position:relative;box-sizing:border-box}
.mbox .ck{position:absolute;left:-6px;top:-22px;font-size:66px;font-weight:900;color:#2a9a5a;line-height:1}
.ledger{position:absolute;left:70px;right:70px;top:250px;background:#fff;border-radius:30px;box-shadow:0 24px 60px rgba(0,0,0,.3);overflow:hidden;transform-origin:50% 0}
.ledger .lh{height:90px;background:#2f9a5a;color:#fff;font-size:42px;font-weight:900;display:flex;align-items:center;padding:0 30px;justify-content:space-between}
.ledger .lh small{font-size:30px;opacity:.85}
.ledger table{border-collapse:collapse;width:100%;font-size:34px}
.ledger td{border-bottom:2px solid #e4ece6;padding:14px 16px;color:#333;font-weight:700;white-space:nowrap}
.ledger tr.hd td{background:#eef6f0;color:#557;font-weight:900;font-size:28px}
.ledger td.amt{text-align:right;font-weight:900}
.ledger .rc{display:inline-block;width:46px;height:56px;border-radius:6px;background:repeating-linear-gradient(#fff 0 8px,#ddd 8px 10px);border:2px solid #ccc;vertical-align:middle}
.ledger tr.new td{background:#ffe9e9}
.ledger .bad{color:#e2335a;font-weight:900}
.banner{position:absolute;left:90px;right:90px;top:220px;height:170px;border-radius:40px;background:rgba(255,255,255,.96);box-shadow:0 20px 50px rgba(0,0,0,.3);display:flex;align-items:center;gap:30px;padding:0 36px;box-sizing:border-box}
.banner .bi{width:100px;height:100px;border-radius:28px;background:#2f9a5a;color:#fff;font-size:56px;font-weight:900;display:flex;align-items:center;justify-content:center;flex:none}
.banner .bt{font-size:36px;color:#666;font-weight:700}
.banner .bm{font-size:50px;color:#222;font-weight:900}
.cmp{position:absolute;left:60px;right:60px;top:220px;background:#fff;border-radius:30px;box-shadow:0 24px 60px rgba(0,0,0,.3);overflow:hidden;transform-origin:50% 0}
.cmp .lh{height:86px;background:#2f9a5a;color:#fff;font-size:40px;font-weight:900;display:flex;align-items:center;padding:0 30px}
.cmp table{border-collapse:collapse;width:100%;font-size:32px}
.cmp td{border-bottom:2px solid #e4ece6;padding:11px 14px;color:#333;font-weight:700;text-align:center;white-space:nowrap}
.cmp td.nm{text-align:left}
.cmp tr.hd td{background:#eef6f0;color:#557;font-weight:900;font-size:27px}
.cmp tr.hl td{background:#fff4c2}
.cmp tr.win td{background:#ffe0e0;color:#c2304a;font-weight:900;font-size:36px}
.gal{position:absolute;left:150px;top:230px;width:780px;height:960px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.35)}
.gal .gs{position:relative;width:100%;height:100%;border-radius:60px;background:#111;overflow:hidden}
.gal .ph{position:absolute;left:0;top:120px;width:736px;height:620px;display:flex;align-items:flex-end;justify-content:center;font-size:52px;font-weight:900;color:#fff;text-shadow:0 3px 10px rgba(0,0,0,.4);padding-bottom:30px;box-sizing:border-box}
.gal .gh{position:absolute;left:0;right:0;top:0;height:110px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:36px;font-weight:700}
.gal .gb{position:absolute;left:30px;right:30px;bottom:40px;height:140px;display:flex;gap:12px}
.gal .gb div{flex:1;border-radius:14px}
.plan{position:absolute;right:60px;top:1000px;width:420px;background:#fff;border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.35);padding:18px 24px;box-sizing:border-box;transform:rotate(4deg)}
.plan .pt{font-size:30px;font-weight:900;color:#1f6a3a;margin-bottom:6px}
.plan .pr{font-size:28px;font-weight:700;color:#333;height:44px;display:flex;align-items:center;gap:10px}
.plan .pr b{color:#2a9a5a;font-size:34px;width:34px}
.nmemo .row{display:flex;align-items:center;gap:20px;height:92px;border-bottom:2px solid #eee;padding:0 40px;font-size:40px;font-weight:700;color:#333;background:#fff}
.nmemo .row b{width:52px;font-size:48px;color:#2a9a5a}
.nmemo .row.todo b{color:#999}
.nmemo .row.todo{background:#fff8e0}
`;document.head.appendChild(st)}
