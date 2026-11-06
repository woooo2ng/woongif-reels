// ===== #003 ISTP — ENGLISH =====
const ORANGE='#ffa53a';
const CAPS={
 0:["What if everyone was ISTP?"],
 1:["Nobody answers their texts.","Three days later, every reply is just \"k.\""],
 2:["Their type is so specific,","dating rates hit an all-time low."],
 3:["But once they fall for someone,","they go all the way."],
 4:["Venting sessions last three seconds."],
 5:["Instead of comfort, you get barbecue."],
 6:["At parties, they sit there without a word...","then quietly vanish, one by one."],
 7:["Even the saddest movie gets zero tears.","All you hear is popcorn crunching."],
 8:["The hottest restaurants are all solo seating.","Even friends who come together sit apart."],
 9:["Say \"I'm sick,\" and all you get back is \"k.\"","But thirty minutes later,","there's soup at your door."],
};
// explicit caption start times (seconds into the voice), from the audio pauses
const CAPT={1:[0,1.95],6:[0,3.25],7:[0,2.85],8:[0,3.0],9:[0,3.75,5.0]};
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
const vt=(si,x)=>LEAD+x; // voice time -> scene time
