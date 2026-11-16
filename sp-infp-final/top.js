
// ===== 온 세상이 INFP인데 월드컵 결승을 한다면? 1부 (결승전편) =====
const C_T='#e0b3ff';
const TM=await (await fetch('audio/timing.json')).json();
// 줄 이름 -> 자막. 조각이 [문장, 시작오프셋(초)]이면 그 시각에, 문자열이면 글자 수 비율로 나눔
const TXT={
 n0:[''],
 k0:['오늘 골 넣는 사람이 영웅이다!','8만 명이, 너 하나만 본다!!'],
 n1:['감독은 몰랐습니다.','그게 이 나라에서 제일 무서운 말이라는 걸.'],
 d0:['와… 드리블 진짜 예쁘게 하시네요.'],s0:['아… 아니에요…'],
 s1:['그쪽도 태클 자세 엄청 정갈하세요.'],d1:['헉… 진짜요?'],
 n2:['이 나라에서 가장 강한 수비는,','칭찬이었습니다.'],
 c0:['좋은 기회!'],c1:['아~ 이건 좀 아쉽네요.'],
 c2:['…아, 아니에요.','제가 말을 너무 세게 했네요.','죄송합니다…'],
 n3:['그날 경기는, 해설위원이','선수한테 사과하느라 3분 멈췄습니다.'],
 c3:['1대1! 이건 골입니다!!'],
 n4:['골 넣고 할 세리머니는 다 준비했는데,','골 넣을 용기는 없었습니다.'],
 c4:['…어디로 가는 거죠?'],
 c5:['승부차기, 아직 0 대 0!','이 공 하나로, 우승이 결정됩니다!'],
 g0:['…저 이거 못 막으면,','엄마가 TV로 보고 계세요.'],
 s2:['…저도요.','저희 할머니, 오늘 처음 경기장 오셨어요.'],
 g1:['…아.'],
 n5:['막아야 하는 사람에게도,','넣어야 하는 사람에게도, 사연이 있었습니다.'],
 n6:['그리고 공은…'],
};
const CAPL={};
TM.forEach((sc,si)=>{const L=[];for(const [nm,[st,d]] of Object.entries(sc.lines)){const parts=TXT[nm]||[''];
  if(Array.isArray(parts[0])){parts.forEach(([p,o])=>L.push([st+o,p]))}
  else{const tot=parts.reduce((a,p)=>a+Math.max(1,p.length),0);let acc=st;parts.forEach(p=>{L.push([acc,p]);acc+=d*Math.max(1,p.length)/tot})}
  L.push([st+d+0.15,null])}
  L.sort((a,b)=>a[0]-b[0]);CAPL[si]=L});
const LN=(si,nm)=>TM[si].lines[nm];
const EV=si=>TM[si].ev;
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function caption(si,t){if(window.noCap)return;
  const L=CAPL[si];if(!L)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  let idx=-1;for(let i=0;i<L.length;i++)if(t>=LEAD+L[i][0]-0.05)idx=i;
  while(idx>=0&&L[idx][1]===null){const nx=L[idx+1];if(nx&&t>=LEAD+nx[0]-0.6){idx--;}else break}
  if(idx<0||!L[idx][1]){el.style.opacity=0;return}
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=L[idx][1]}
  const st=LEAD+L[idx][0];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const at=(si,nm,k=0)=>LEAD+LN(si,nm)[0]+k;
const endOf=(si,nm,k=0)=>LEAD+LN(si,nm)[0]+LN(si,nm)[1]+k;
{const st=document.createElement('style');st.textContent=`
.tag{top:250px}
.title1{top:320px;font-size:120px}
.title2{top:455px;font-size:150px;letter-spacing:-4px}
.title3{position:absolute;left:0;right:0;top:640px;text-align:center;font-size:104px;letter-spacing:-3px}
.lbl{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;background:#3b3466;color:#fff;font-weight:900;font-size:44px;padding:8px 30px;border-radius:999px}
.dream{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,0) 40%,rgba(255,214,240,.85) 100%)}
.dlist{position:absolute;left:90px;top:300px;display:flex;flex-direction:column;gap:18px}
.dlist div{background:rgba(255,255,255,.95);color:#7a3b8f;font-weight:900;font-size:46px;padding:10px 30px;border-radius:999px;box-shadow:0 8px 20px rgba(150,60,140,.25);white-space:nowrap}
.rec{position:absolute;right:70px;top:150px;color:#fff;font-weight:900;font-size:44px;background:#e23b3b;padding:6px 22px;border-radius:12px}
.flashw{position:absolute;inset:0;background:#fff;pointer-events:none}
.board{position:absolute;left:50%;top:150px;transform:translateX(-50%);display:flex;align-items:center;gap:0;background:#1d1f33;border-radius:22px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.35)}
.board span{white-space:nowrap;font-weight:900;font-size:48px;color:#fff;padding:12px 26px}
.board .a{background:#a77bd6}.board .b{background:#55b39b}.board .s{font-size:64px;color:#ffe680;padding:6px 30px;letter-spacing:4px}
.split{position:absolute;left:0;right:0;height:8px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.4)}
.who2{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;background:rgba(255,255,255,.95);color:#3b3466;font-weight:900;font-size:40px;padding:6px 26px;border-radius:999px}
.cont1{position:absolute;left:0;right:0;top:500px;text-align:center;font-size:120px;letter-spacing:-3px}
.cont2{position:absolute;left:0;right:0;top:680px;text-align:center;font-size:56px}
`;document.head.appendChild(st)}
