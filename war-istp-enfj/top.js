// ===== ISTP 나라와 ENFJ 나라가 전쟁이 난다면? (전쟁편 × 나라 대결편 2) =====
const C_T='#ffb84d',C_J='#ff8fa8';
const TM=await (await fetch('audio/timing.json')).json();
const TXT={
 n1:['ISTP 나라와 ENFJ 나라가,','전쟁이 난다면?'],
 g1:['여러분! 우리는 싸우러 온 게 아닙니다.','여러분의 마음을… 열러 왔습니다!!'],
 n2:['ENFJ 나라의 무기는 총이 아니라,','감동 연설이었습니다.'],k1:['…아직 해?'],
 e1:['요즘 힘든 일 없어요?','표정이 안 좋아 보여서…'],s1:['원래 이래요.'],e2:['괜찮아요. 다 말해도 돼요.','저 들을 준비 됐어요.'],s2:['…없는데요.'],
 n3:['ISTP는,','고민이 진짜 없었습니다.'],
 e3:['총 잡는 자세 너무 멋있어요!'],e4:['당신은 정말 특별한 사람이에요!!'],s3:['…감사합니다.'],
 e5:['(속마음) 내가 너무 부담스러웠나…','아니면 칭찬이 부족했나…'],n4:['반응이 없으면,','ENFJ는 밤새 자기 탓을 했습니다.'],
 e6:['사실 저… 요즘 너무 힘들어요.','다들 챙기느라, 정작 저는…'],s4:['…그럼 안 챙기면 되잖아요.'],e7:['헉…!!'],
 n5:['ENFJ가 10년 동안 못 푼 고민을,','ISTP는 3초 만에 풀었습니다.'],
 g2:["…'수고'.",'이 세 글자에, 진심이 다 담겨 있어.'],n6:['ISTP는 3글자를 썼고,','ENFJ는 3시간 동안 감동했습니다.'],
 g3:['…혹시 이거, 장군님이…?'],k2:['남아서요.'],g4:['…아무것도 안 나오는데요?'],k3:['…연설,','다 들었어요.'],k4:['…길긴 했어요.'],
 n7:['ISTP는 위로하는 말 한마디 안 했지만,','ENFJ는 그날 처음으로 위로받았습니다.'],
 n8:['전쟁 1년째, 사상자 0명.','ENFJ 나라 사람들은 요즘,','주말마다 ISTP 나라로 쉬러 갑니다.'],
};
const CAPL={};
TM.forEach((sc,si)=>{const L=[];for(const [nm,[st,d]] of Object.entries(sc.lines)){const parts=TXT[nm]||[''];
  if(Array.isArray(parts[0])){parts.forEach(([p,o])=>L.push([st+o,p]))}
  else{const tot=parts.reduce((a,p)=>a+Math.max(1,p.length),0);let acc=st;parts.forEach(p=>{L.push([acc,p]);acc+=d*Math.max(1,p.length)/tot})}
  L.push([st+d+0.15,null])}
  L.sort((a,b)=>a[0]-b[0]);CAPL[si]=L});
const LN=(si,nm)=>TM[si].lines[nm]; // [시작, 길이] (음성 기준)
const EV=si=>TM[si].ev;
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function caption(si,t){if(window.noCap)return;
  const L=CAPL[si];if(!L)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  let idx=-1;for(let i=0;i<L.length;i++)if(t>=LEAD+L[i][0]-0.05)idx=i;
  // 다음 줄 전까지는 이전 자막 유지(null은 짧은 공백 뒤 다음 줄이 없을 때만 숨김)
  while(idx>=0&&L[idx][1]===null){const nx=L[idx+1];if(nx&&t>=LEAD+nx[0]-0.6){idx--;}else break}
  if(idx<0||!L[idx][1]){el.style.opacity=0;return}
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=L[idx][1]}
  const st=LEAD+L[idx][0];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const vt=x=>LEAD+x; // 음성 기준 초 -> 장면 시간
const at=(si,nm,k=0)=>LEAD+LN(si,nm)[0]+k; // 줄 시작(장면 시간)
const endOf=(si,nm,k=0)=>LEAD+LN(si,nm)[0]+LN(si,nm)[1]+k;
{const st=document.createElement('style');st.textContent=`
.title3{position:absolute;left:0;right:0;top:640px;text-align:center;font-size:120px;letter-spacing:-3px}
.tag{top:250px}
.title1{top:320px;font-size:120px}
.title2{top:455px;font-size:150px;letter-spacing:-4px}
.flash{position:absolute;inset:0;pointer-events:none}
.kphone{position:absolute;left:150px;top:150px;width:780px;height:1060px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.kphone .screen{position:relative;width:100%;height:100%;border-radius:60px;background:#b2c7da;overflow:hidden}
.kphone .head{height:110px;display:flex;align-items:center;gap:14px;padding:0 40px;font-size:48px;font-weight:900;color:#222;background:rgba(255,255,255,.35)}
.kphone .head small{font-size:32px;color:#666;font-weight:700}
.kphone .msgs{position:absolute;left:0;right:0;top:180px;bottom:120px;padding:20px 30px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-end;gap:16px;overflow:hidden}
.kphone .row{display:flex;align-items:flex-end;gap:10px}
.kphone .row.me{justify-content:flex-end}
.kphone .b{max-width:500px;font-size:48px;line-height:1.35;padding:16px 24px;border-radius:28px;background:#fff;color:#222;font-weight:600}
.kphone .me .b{background:#ffe86b}
.kphone .un{font-size:38px;font-weight:900;color:#e8b400;min-width:10px;text-align:right}
.kphone .tm{font-size:26px;color:#556;}
.kphone .meta{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.kphone .sys{align-self:center;font-size:26px;color:#fff;background:rgba(0,0,0,.2);padding:6px 22px;border-radius:999px}
.kphone .inp{position:absolute;left:0;right:0;bottom:0;height:120px;background:#fff;display:flex;align-items:center;padding:0 30px;gap:18px;box-sizing:border-box}
.kphone .inp .box{flex:1;height:76px;border-radius:38px;background:#f1f1f4;display:flex;align-items:center;padding:0 28px;font-size:42px;color:#222;font-weight:600;white-space:nowrap;overflow:hidden}
.kphone .inp .sd{width:80px;height:72px;border-radius:24px;background:#ffe86b;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#3a3000}
.kphone .av{width:70px;height:70px;border-radius:26px;flex:none;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#fff}
.kphone .who{font-size:32px;color:#445;margin:0 0 6px 4px;font-weight:700}
.doc{position:absolute;left:150px;top:200px;width:780px;height:960px;background:#fffdf5;border-radius:18px;box-shadow:0 30px 70px rgba(0,0,0,.35);padding:60px 64px;box-sizing:border-box;color:#2a2a2a}
.doc h1{margin:0;text-align:center;font-size:76px;font-weight:900;letter-spacing:6px}
.doc .ln{height:4px;background:#2a2a2a;margin:26px 0 40px}
.doc p{font-size:40px;line-height:1.6;margin:0 0 18px;font-weight:600}
.doc .why{margin-top:40px;padding:34px;border:4px dashed #c9a96b;border-radius:20px;font-size:54px;font-weight:900;line-height:1.45;text-align:center}
.doc .why b{color:#e2552d}
.doc .sg{position:absolute;left:64px;right:64px;bottom:70px;display:flex;justify-content:space-between}
.doc .sg div{width:300px;text-align:center;font-size:32px;font-weight:700;color:#555}
.doc .sg span{display:block;margin-top:14px;border-bottom:4px solid #444;font-size:70px;font-weight:900;color:#1d3b8f;height:96px;font-family:'Noto Sans CJK KR'}
.stamp2{position:absolute;left:50%;top:600px;transform:translateX(-50%) rotate(-12deg);border:14px solid #e23b3b;color:#e23b3b;font-size:120px;font-weight:900;padding:4px 44px;border-radius:30px;white-space:nowrap;background:rgba(255,255,255,.55)}
.end1{position:absolute;left:0;right:0;top:300px;text-align:center;font-size:92px;letter-spacing:-3px}
.end2{position:absolute;left:0;right:0;top:440px;text-align:center;font-size:58px}
.cut{position:absolute;left:50%;top:150px;transform:translateX(-50%);background:#3b3466;color:#fff;font-weight:900;font-size:44px;padding:8px 30px;border-radius:999px;white-space:nowrap}
.cmpbox{position:absolute;left:50%;top:200px;transform:translateX(-50%);display:flex;gap:26px}
.cmpbox div{background:rgba(255,255,255,.94);border-radius:28px;padding:14px 34px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.15)}
.cmpbox small{display:block;font-size:40px;font-weight:700;color:#666}
.cmpbox b{display:block;white-space:nowrap;font-size:96px;font-weight:900}
.cmpbox .c1 b{color:#ff5a2d}.cmpbox .c2 b{color:#9a9a9a;font-size:76px;line-height:1.26}
.statbox{position:absolute;left:50%;top:330px;transform:translateX(-50%);display:flex;gap:30px}
.statbox div{background:rgba(255,255,255,.95);border-radius:30px;padding:16px 46px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.statbox small{display:block;font-size:40px;font-weight:700;color:#666}
.statbox b{display:block;white-space:nowrap;font-size:110px;font-weight:900;color:#e2552d;line-height:1.1}
`;document.head.appendChild(st)}
