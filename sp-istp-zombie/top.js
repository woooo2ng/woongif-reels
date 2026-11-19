// ===== 온 세상이 ISTP인데 좀비 사태가 터진다면? (좀비편) =====
const C_T='#ffb84d';
const TM=await (await fetch('audio/timing.json')).json();
const TXT={
 n1:[''],z1:['으어어어!!'],p1:[['…뭐지.',0],['빌런인가.',0.89]],n2:[['좀비 사태가 터졌습니다.',0],['아무도 몰랐을 뿐이죠.',1.53]],
 b1:['안전을 위해 여럿이 함께 모여 계십시오!'],n3:['모이라고 했는데,','다들 혼자 있는 게 더 안전하다고 생각했습니다.'],
 n4:[['좀비는 작은 소리에도 반응합니다.',0],['하지만 이 나라 폰은,',2.29],['원래 무음이었습니다.',3.69]],
 m1:['살아 있냐.'],h1:['어.'],m2:['밥은.'],h2:['먹음.'],m3:['그래.'],z2:['…으어?'],n5:['좀비 사태에도,','가족 걱정은 3초면 끝났습니다.'],
 c1:['생존자는 창밖으로 손을 흔들어 주세요!'],n6:[['다들 살아 있었습니다.',0],['손을 안 흔들었을 뿐이죠.',1.33]],
 t1:['그럼, 오전 회의 시작하겠습니다.'],t2:['…김 대리님만 열정 있네요.'],n9:['이 나라에서 회의에 제일 적극적인 건,','좀비였습니다.'],
 c2:['…반응 없음.','좀비로 판정.'],n7:[['좀비 사태 1년째.',0],['공식 생존자는 0명입니다.',1.46]],n8:['…다들 잘 살고 있는 것 같습니다.'],
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
  while(idx>=0&&L[idx][1]===null){const nx=L[idx+1];if(nx&&t>=LEAD+nx[0]-0.6&&nx[0]-L[idx][0]<0.8){idx--;}else break}
  if(idx<0||!L[idx][1]){el.style.opacity=0;return}
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=L[idx][1]}
  const st=LEAD+L[idx][0];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const vt=x=>LEAD+x; // 음성 기준 초 -> 장면 시간
const at=(si,nm,k=0)=>LEAD+LN(si,nm)[0]+k; // 줄 시작(장면 시간)
const endOf=(si,nm,k=0)=>LEAD+LN(si,nm)[0]+LN(si,nm)[1]+k;
{const st=document.createElement('style');st.textContent=`
.tag{top:250px;background:#ffb84d;color:#4a2a00}
.title1{top:320px;font-size:118px}
.title2{top:450px;font-size:156px;letter-spacing:-4px}
.title3{position:absolute;left:0;right:0;text-align:center;top:640px;font-size:96px;letter-spacing:-4px}
.flash{position:absolute;inset:0;pointer-events:none}
.vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(70,0,0,.8) 100%)}
.alertb{position:absolute;left:44px;right:44px;top:40px;background:rgba(250,250,252,.97);border-radius:30px;padding:22px 30px;box-shadow:0 12px 30px rgba(0,0,0,.35);color:#222}
.alertb .h{display:flex;align-items:center;gap:14px;font-size:36px;font-weight:800;color:#666}
.alertb .h i{font-style:normal;background:#ff3b3b;color:#fff;border-radius:10px;padding:2px 12px;font-weight:900}
.alertb .m{margin-top:10px;font-size:50px;font-weight:900;line-height:1.3}
.ph2{position:absolute;left:190px;top:170px;width:700px;height:1040px;border-radius:76px;background:#1b1b22;padding:20px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.ph2 .screen{position:relative;width:100%;height:100%;border-radius:58px;overflow:hidden;background:linear-gradient(160deg,#ffcf8a,#ff9f8a 45%,#8fb8ff)}
.ph2 .vid{position:absolute;left:0;right:0;top:260px;text-align:center}
.ph2 .ui{position:absolute;right:30px;bottom:180px;display:flex;flex-direction:column;gap:40px;align-items:center;color:#fff;font-size:30px;font-weight:900;text-shadow:0 2px 6px rgba(0,0,0,.4)}
.ph2 .ui b{display:block;width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,.35)}
.ph2 .cap2{position:absolute;left:36px;bottom:70px;color:#fff;font-size:36px;font-weight:800;text-shadow:0 2px 6px rgba(0,0,0,.45)}
.thumb2{position:absolute;filter:drop-shadow(0 14px 20px rgba(0,0,0,.35));transform-origin:50% 10%}
.arw{position:absolute;font-size:150px;color:#fff}
.thumb{position:absolute;width:150px;height:150px;border-radius:50%;background:rgba(240,200,170,.95);box-shadow:0 10px 30px rgba(0,0,0,.35)}
.kp{position:absolute;left:130px;top:170px;width:820px;height:1040px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.45)}
.kp .screen{position:relative;width:100%;height:100%;border-radius:60px;background:#b2c7da;overflow:hidden}
.kp .head{height:120px;display:flex;align-items:center;gap:14px;padding:0 40px;font-size:46px;font-weight:900;color:#222;background:rgba(255,255,255,.4)}
.kp .head small{font-size:34px;color:#666;font-weight:800}
.kp .inner{position:absolute;left:0;right:0;top:140px;padding:20px 30px;display:flex;flex-direction:column;gap:20px}
.kp .row{display:flex;align-items:flex-start;gap:12px}
.kp .row.me{justify-content:flex-end}
.kp .av{width:72px;height:72px;border-radius:26px;flex:none}
.kp .who{font-size:30px;color:#445;margin:0 0 6px 4px;font-weight:700}
.kp .b{display:inline-block;font-size:48px;line-height:1.3;padding:14px 26px;border-radius:26px;background:#fff;color:#222;font-weight:700}
.kp .me .b{background:#ffe86b}
.kp .un{font-size:36px;font-weight:900;color:#e8b400;align-self:flex-end;margin:0 8px 6px}
.kp .inp{position:absolute;left:0;right:0;bottom:0;height:110px;background:#fff;display:flex;align-items:center;padding:0 30px;box-sizing:border-box}
.kp .inp .box{flex:1;height:72px;border-radius:36px;background:#f1f1f4;font-size:40px;line-height:72px;padding-left:28px;color:#999;font-weight:700}
.stat{position:absolute;left:50%;top:330px;transform:translateX(-50%);display:flex;gap:26px}
.stat div{background:rgba(255,255,255,.95);border-radius:30px;padding:14px 40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.stat small{display:block;white-space:nowrap;font-size:40px;font-weight:700;color:#666}
.stat b{display:block;white-space:nowrap;font-size:100px;font-weight:900;color:#e2552d;line-height:1.1}
.callui{position:absolute;left:50%;transform:translateX(-50%);background:rgba(30,30,40,.88);color:#fff;border-radius:999px;padding:10px 34px;font-size:44px;font-weight:900;white-space:nowrap;display:flex;gap:18px;align-items:center}
.callui i{font-style:normal;color:#7dff9a;font-variant-numeric:tabular-nums}
.splitline{position:absolute;left:0;right:0;top:958px;height:6px;background:#fff}
.who2{position:absolute;left:40px;background:#fff;color:#333;font-weight:900;font-size:40px;padding:6px 22px;border-radius:999px}
.clip{position:absolute;left:170px;top:200px;width:740px;height:980px;background:#c9a46b;border-radius:30px;box-shadow:0 30px 70px rgba(0,0,0,.4)}
.clip .pp{position:absolute;left:40px;right:40px;top:90px;bottom:40px;background:#fffdf5;border-radius:10px;padding:50px 50px;box-sizing:border-box;color:#2a2a2a}
.clip .cl{position:absolute;left:50%;top:-20px;width:260px;height:100px;margin-left:-130px;background:#8a8a92;border-radius:18px}
.clip h1{margin:0 0 30px;font-size:64px;font-weight:900;text-align:center}
.clip p{font-size:44px;font-weight:700;margin:0 0 26px;display:flex;justify-content:space-between;border-bottom:3px dashed #ccc;padding-bottom:16px}
.clip p b{color:#999}
.clip .tot{margin-top:40px;font-size:62px;font-weight:900;text-align:center}
.clip .tot b{color:#e2332d;font-size:110px}
.tv{position:absolute;left:60px;right:60px;top:230px;height:620px;border-radius:30px;background:#1a1d2e;border:18px solid #2b2b33;box-sizing:border-box;overflow:hidden;color:#fff}
.tv .live{position:absolute;left:30px;top:26px;background:#e2332d;font-size:36px;font-weight:900;padding:4px 18px;border-radius:8px}
.tv .hd{position:absolute;left:0;right:0;top:150px;text-align:center;font-size:56px;font-weight:800;color:#c8d0ff}
.tv .big{position:absolute;left:0;right:0;top:260px;text-align:center;font-size:118px;font-weight:900;color:#ffd84d}
.tv .tick{position:absolute;left:0;right:0;bottom:0;height:80px;background:#ffd84d;color:#222;font-size:40px;font-weight:900;line-height:80px;white-space:nowrap}
.end1{position:absolute;left:0;right:0;text-align:center;top:520px;font-size:110px}
.end2{position:absolute;left:0;right:0;text-align:center;top:690px;font-size:60px}
.bino{position:absolute;inset:0;pointer-events:none}
.zst{position:absolute;left:540px;top:860px;border:16px solid #e2332d;color:#e2332d;font-size:170px;font-weight:900;padding:0 50px;border-radius:30px;background:rgba(255,255,255,.18);white-space:nowrap}
.meet{position:absolute;inset:0;background:#15171f}
.mbar{position:absolute;left:0;right:0;top:0;height:120px;background:#20232e;display:flex;align-items:center;justify-content:space-between;padding:0 40px;color:#dfe3ee;font-size:34px;font-weight:800;box-sizing:border-box}
.mbar i{font-style:normal;color:#ff6b6b}
.tile{position:absolute;width:320px;height:200px;border-radius:18px;background:#2a2d38;overflow:hidden;box-sizing:border-box;border:4px solid transparent}
.tile .ini{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:86px;height:86px;border-radius:50%;color:#fff;font-size:40px;font-weight:900;display:flex;align-items:center;justify-content:center}
.tile .nm{position:absolute;left:12px;bottom:10px;background:rgba(0,0,0,.55);color:#fff;font-size:26px;font-weight:800;padding:2px 12px;border-radius:8px}
.tile .mu{position:absolute;right:12px;bottom:10px;color:#ff6b6b;font-size:22px;font-weight:900;background:rgba(0,0,0,.55);padding:2px 10px;border-radius:8px}
.tile.live{background:transparent;border-color:#5ad17a}
.mbot{position:absolute;left:0;right:0;bottom:0;height:150px;background:#20232e;display:flex;align-items:center;justify-content:center;gap:40px}
.mbot b{display:block;width:96px;height:96px;border-radius:50%;background:#3a3e4c}
.mbot b.red{background:#e2332d}
.yr{position:absolute;inset:0;background:#111;display:flex;align-items:center;justify-content:center;font-size:140px}
`;document.head.appendChild(st)}
