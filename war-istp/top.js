// ===== 온 세상이 ISTP인데 전쟁이 난다면? (전쟁편) =====
const C_T='#ffb84d';
const TM=await (await fetch('audio/timing.json')).json();
// 줄 이름 -> 자막(여러 조각이면 글자 수 비율로 나눔)
const TXT={
 e1:['지금부터 너희에게 전쟁을 선포한다!!'],n1:[''],
 n2:['진짜 전쟁이었습니다.','다만, 아무도 듣고 있지 않았을 뿐이죠.'],
 s1:['…아 왜요.'],g1:['전쟁 났다고.'],s2:['…하.'],n3:['그렇게 병사들은,','세상에서 제일 하기 싫은 표정으로 전쟁터에 나갔습니다.'],
 f1:['…화났어요?'],s3:['아뇨.'],f2:['표정이 화났는데.'],s4:['원래 이래요.'],f3:['아 저도긴 해요.'],
 n4:['양쪽 다 상대가 화난 줄 알았지만,','아무도 화나지 않았습니다.','원래 얼굴이었죠.'],
 f4:['…일부러 빗나가게 쐈죠?'],s5:['맞히면 보고서 써야 돼서.'],f5:['아 저도긴 해요.'],
 s6:['…그거 몇 티어예요?'],f6:['다이아요.'],s7:['…듀오 할래요?'],n5:['관심 없는 건 1도 안 하지만,','꽂힌 건 전쟁보다 중요했습니다.'],
 n6:['다음 날 작전은 단톡방으로 전달됐습니다.','아무도 읽지 않았죠.'],n7:['노이즈캔슬링도, 안 읽음도,','관심 있는 말은 막지 못했습니다.'],g2:['…아니 그게 아니라.'],
 n8:['그날 이후, 양국 누구도','집 밖으로 나오지 않았습니다.'],e2:['종전 서명… 국경에서 만날까요?'],g3:['…굳이?'],e3:['아 저도긴 해요.'],
 n9:['그렇게 이 전쟁은,','인류 역사상 최초로','집이 좋아서 끝난 전쟁이 됐습니다.'],
};
const CAPL={};
TM.forEach((sc,si)=>{const L=[];for(const [nm,[st,d]] of Object.entries(sc.lines)){const parts=TXT[nm]||[''];const tot=parts.reduce((a,p)=>a+Math.max(1,p.length),0);let acc=st;
  parts.forEach(p=>{L.push([acc,p]);acc+=d*Math.max(1,p.length)/tot});L.push([st+d+0.15,null])}
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
.title3{position:absolute;left:0;right:0;top:775px;text-align:center;font-size:122px;letter-spacing:-3px}
.tag{top:290px}
.title1{top:380px}
.title2{top:540px;font-size:200px}
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
`;document.head.appendChild(st)}
