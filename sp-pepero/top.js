// ===== 빼빼로데이 특별편: 빼빼로 받았을 때 MBTI별 반응 (음성 없음) =====
const TYPES=[
 ['ENTP','#ffa94d','굳이 가래떡데이를 꺼냄'],
 ['ISFP','#6fe0aa','답장 쓰고 지우고 10분째… 결국 ♥ 하나'],
 ['ISTJ','#8fbfff','받자마자 간식 칸에 줄 맞춰 정리'],
 ['ENFP','#ff8fc8','먹기 전에 인스타 스토리 먼저'],
 ['INFP','#c3a6ff','아까워서 포장 그대로 며칠째'],
 ['INTP','#6fd3e0','"상술이야" 하면서 다 먹음'],
 ['ESFP','#c8ff4d','주변에 다 들리게 자랑'],
 ['INFJ','#e0a3ff','집 가는 길에 계속 생각남'],
 ['ISTP','#ffd166','기념일엔 관심 없지만 일단 먹음'],
 ['ESFJ','#ff9e8a','미리 사 둔 빼빼로 바로 꺼냄'],
 ['INTJ','#8fa0ff','고맙다면서 취향은 확실하게 말함'],
 ['ESTP','#ff6b6b','한 입에 세 개'],
 ['ISFJ','#a8e6a1','누가 줬는지 기억해 뒀다가 꼭 답례'],
 ['ENFJ','#ffb3d9','손편지 붙여서 한 명씩 돌려줌'],
 ['ESTJ','#66c2a5','전날 미리 인원수대로 준비 완료'],
 ['ENTJ','#b58cff','칼로리 계산해서 딱 2개만 먹음'],
];
let DURS=[2.4,...TYPES.map(()=>3.0),3.8],LEAD=0.2;
window.setTiming=(lead,voice)=>{LEAD=lead;DURS=voice.map((v,i)=>v+lead+0.35+(i==voice.length-1?0.3:0))};
{const st=document.createElement('style');st.textContent=`
.ptag{position:absolute;left:50%;transform:translateX(-50%);top:215px;background:#ffd84d;color:#3a2a00;font-weight:900;font-size:50px;padding:6px 28px;border-radius:16px;white-space:nowrap}
.mb{position:absolute;left:0;right:0;top:290px;text-align:center;font-size:190px;letter-spacing:-4px;line-height:1.1}
.num{position:absolute;right:60px;top:228px;font-size:40px;font-weight:900;color:#fff;background:rgba(0,0,0,.28);border-radius:999px;padding:4px 20px}
.tag{top:240px}
.title1{top:330px;font-size:120px}
.title2{top:480px;font-size:170px;color:#ff5a6e}
.cap{font-size:60px}
.flash{position:absolute;inset:0;background:#fff;pointer-events:none;opacity:0}
.end1{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:100px;letter-spacing:-3px;line-height:1.2}
.end2{position:absolute;left:0;right:0;top:520px;text-align:center;font-size:56px}
`;document.head.appendChild(st)}
function div(cls,html,parent=ui){const d=document.createElement('div');d.className=cls;if(html!=null)d.innerHTML=html;parent.appendChild(d);return d}
function popEl(el,t,t0,base=''){const k=pop((t-t0)/0.3);el.style.transform=`${base} scale(${k})`;el.style.opacity=clamp01((t-t0)/0.08)}
