// ===== #004 ESTP — ENGLISH =====
const RED='#ff5c3a';
const CAPS={
 0:["What if everyone was ESTP?"],
 1:["First of all, nobody's home.","They're all out having fun."],
 2:["They plan the trip after they board the plane.","They pick where to go when they land."],
 3:["Even rock-paper-scissors for coffee...","everyone plays like their life depends on it."],
 4:["Nobody sugarcoats anything.","If it looks bad, they say it looks bad...","and nobody gets upset."],
 5:["Arguments are gone.","If you fight, you spar one round.","Shake hands when it's over.","No hard feelings."],
 6:["No mind games when they have a crush.","If they like you, they just say it."],
 7:["Most of all, it's a world where one text,","\"Come out!\"","turns even the gloomiest day around."],
};
const CAPT={1:[0,2.2],2:[0,2.8],3:[0,2.7],4:[0,2.1,4.65],5:[0,1.6,4.0,5.4],6:[0,2.2],7:[0,2.9,3.95]};
const CAPW={};
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function caption(si,t){
  const parts=CAPS[si];if(!parts)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const v=VOICE[si]||3;let starts;
  if(CAPT[si])starts=CAPT[si].map(x=>LEAD+x);
  else{const L=CAPW[si]||parts.map(p=>p.length);const tot=L.reduce((a,b)=>a+b,0);starts=[];let acc=LEAD;for(const l of L){starts.push(acc);acc+=v*l/tot}}
  let idx=0;for(let i=0;i<parts.length;i++)if(t>=starts[i]-0.05)idx=i;
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=parts[idx]}
  const st=starts[idx];
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const vt=(si,x)=>LEAD+x;
