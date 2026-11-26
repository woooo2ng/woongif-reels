// ---------- ENFP 무인도편 공용 ----------
function title(){
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ENFP × 무인도편</div><div class="title1 out">온 세상이</div><div class="title2 out">ENFP인데</div><div class="title3 out">무인도에 떨어진다면?</div>`);
  const el=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return (t,hide)=>{const o=hide?0:1;el[0].style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;el[0].style.opacity=o;
    el.slice(1).forEach((e,i)=>{const t0=0.1+i*0.25;e.style.transform=`scale(${pop((t-t0)/0.35)})`;e.style.opacity=clamp01((t-t0)/0.1)*o})};
}
// ENFP 7명: 0 리더(남) · 1 연희(긴머리) · 2 남(Henry) · 3 지은(번 머리, 생일 주인공·썰) · 4~6
const CAST=[
  {shirt:0x8fd3ff,pants:0x4a5a7a,hair:0x2a2220},
  {shirt:0xff9fc8,pants:0xf5f0e6,hair:0x3a2a22,long:true},
  {shirt:0xffc46b,pants:0x6a7fa8,hair:0x1d1d24},  // ENFP2: 남자(목소리 Henry)
  {shirt:0xb79bff,pants:0xf2e6ff,hair:0x4a3426,bun:true},
  {shirt:0x8fe3b0,pants:0x55506a,hair:0x1d1d24},
  {shirt:0xffb38a,pants:0x5a6a8a,hair:0x3a2f2a,long:true},
  {shirt:0xf5e36b,pants:0x3d3a36,hair:0x2a2220},
];
function enfp(i){const o=CAST[i];const p=makeHero({shirt:o.shirt,pants:o.pants,hair:o.hair,long:o.long||o.bob});const u=p.userData;
  if(o.bob){u.head.children.forEach(c=>{if(c.geometry&&c.geometry.parameters&&c.geometry.parameters.radius===0.2){c.scale.set(1.45,1.0,0.75);c.position.set(0,0.12,-0.12)}})}
  if(o.bun){const b=new THREE.Mesh(new THREE.SphereGeometry(0.11,28,20),smooth(o.hair));b.position.set(0,0.56,-0.05);u.head.add(b);
    const band=new THREE.Mesh(new THREE.TorusGeometry(0.075,0.022,8,20),smooth(0xff8fc8));band.rotation.x=Math.PI/2;band.position.set(0,0.48,-0.04);u.head.add(band)}
  u.smile.visible=true;
  // 반짝 눈 하이라이트
  u.eyes.forEach(e=>{const hl=new THREE.Mesh(new THREE.BoxGeometry(0.018,0.018,0.01),basic(0xffffff));hl.position.set(0.012,0.016,0.012);e.add(hl)});
  // 슬픈 입(뒤집힌 미소)
  const fr=new THREE.Mesh(new THREE.TorusGeometry(0.04,0.009,6,16,Math.PI),basic(0x5a2a2a));fr.position.set(0,0.12,0.245);fr.visible=false;u.head.add(fr);u.frown=fr;
  // 다크서클
  u.dark=[];for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.BoxGeometry(0.075,0.03,0.01),basic(0x8a6a9a));d.position.set(s*0.09,0.2,0.243);d.visible=false;u.head.add(d);u.dark.push(d)}
  // 눈물
  u.tears=[];for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.SphereGeometry(0.024,10,8),basic(0x7fd0ff));d.visible=false;u.head.add(d);u.tears.push({d,s})}
  p.userData.idx=i;return p}
function face(p,m){const u=p.userData;u.smile.visible=m==='smile';u.mouth.visible=m==='open';u.frown.visible=m==='sad';if(m==='open')u.mouth.scale.set(1,1.25,0.4)}
function cry(p,t,on,ph=0){const u=p.userData;u.tears.forEach((q,i)=>{const lt=((t*1.6+ph+i*0.5)%1);q.d.visible=on;q.d.position.set(q.s*0.1,0.2-lt*0.18,0.25);q.d.scale.setScalar(on?1-lt*0.4:0)});if(on){u.hip.position.x=Math.sin(t*30+ph)*0.01;face(p,'sad')}}
function dark(p,on){p.userData.dark.forEach(d=>d.visible=on)}
function resetP(p){standPose(p);const u=p.userData;u.hip.rotation.set(0,0,0);u.head.rotation.set(0,0,0);u.hip.position.x=0;u.arms.forEach(a=>{a.rotation.set(0,0,0)});u.legs.forEach(l=>l.rotation.set(0,0,0));if(u.eyes)eyesK(p,1);if(u.tears)u.tears.forEach(q=>q.d.visible=false)}
const SPK={l:0,a:1,b:2,c:3};
function talk(si,t,cast,o={}){ // 말하는 사람 입 뻥긋
  const ls=TM.lines.filter(l=>l.s===si);const on=new Set();
  for(const l of ls){if(t<l.t0||t>l.t1)continue;const k=l.k[0]==='g'?'g':l.k[0];if(k==='g')cast.forEach((p,i)=>on.add(i));else if(SPK[k]!=null)on.add(SPK[k])}
  cast.forEach((p,i)=>{if(!p||o.skip&&o.skip.includes(i))return;if(on.has(i)){face(p,Math.sin(t*22+i)>-0.2?'open':'smile')}})}
function chipSet(el,html){if(el.dataset.h!==html){el.dataset.h=html;el.innerHTML=html}}
function rain(scene,n,r){const g=new THREE.Group();scene.add(g);const m=new THREE.MeshBasicMaterial({color:0xcfd8e6,transparent:true,opacity:0.55});const a=[];
  for(let i=0;i<n;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.5,0.02),m);s.rotation.z=0.25;g.add(s);a.push({s,x:(r()-0.5)*24,z:-6+r()*14,ph:r()})}
  return {g,upd(t,k){g.visible=k>0.02;m.opacity=0.55*k;a.forEach(q=>{const y=8-((t*9+q.ph*8)%9);q.s.position.set(q.x-y*0.25,y,q.z)})}}}
function confetti(scene,n,r,o){const a=[];const cols=[0xff8fc8,0xffd84d,0x8fd3ff,0x8fe3b0,0xb79bff,0xffb38a];
  for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.06,0.01),basic(cols[i%6]));scene.add(m);m.visible=false;a.push({m,vx:(r()-0.5)*4,vy:2.5+r()*3,vz:(r()-0.5)*2,ph:r()*6})}
  return {upd(t,t0){a.forEach(q=>{const d=t-t0;q.m.visible=d>0&&d<3;if(!q.m.visible)return;q.m.position.set(o.x+q.vx*d,o.y+q.vy*d-4.5*d*d*0.5,o.z+q.vz*d);q.m.rotation.set(d*5+q.ph,d*7,d*3)})}}}
function noteB(p,o={}){return bub(p,o.text||'♪',{y:o.y??2.15,bg:'#fff3fa',fg:'#e2557a',fs:70,size:o.size||0.0026})}
function bubE(p,text,o={}){return bub(p,text,{y:o.y??2.15,bg:o.bg||'#ffe0f0',fg:o.fg||'#7a1f52',fs:o.fs||66,size:o.size||0.0026})}
function suitcaseS(col){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.42,0.22),lamb(col));b.position.y=0.21;g.add(b);const h=new THREE.Mesh(new THREE.TorusGeometry(0.08,0.02,6,10,Math.PI),lamb(0x3a3a44));h.position.y=0.43;g.add(h);return g}
function ferry(){const g=new THREE.Group();const hull=new THREE.Mesh(new THREE.BoxGeometry(6,1.1,1.6),lamb(0xffffff));hull.position.y=0.55;g.add(hull);
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(6.02,0.22,1.62),lamb(0xe2553f));stripe.position.y=0.45;g.add(stripe);
  const bow=new THREE.Mesh(new THREE.ConeGeometry(0.8,1.4,4),lamb(0xffffff));bow.rotation.z=-Math.PI/2;bow.rotation.x=Math.PI/4;bow.scale.set(1,1,0.75);bow.position.set(3.6,0.55,0);g.add(bow);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(3,0.9,1.3),lamb(0xf2f6ff));cab.position.set(-0.4,1.55,0);g.add(cab);
  for(let i=0;i<6;i++){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3),basic(0x5d7590));w.position.set(-1.6+i*0.48,1.6,0.66);g.add(w)}
  const fun=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.34,0.9,10),lamb(0xe2553f));fun.position.set(-0.9,2.45,0);g.add(fun);
  const fl=labelSprite('구조선',{bg:'#e2553f',fg:'#ffffff',fs:70,size:0.012,r:14});fl.position.set(0,3.9,0);g.add(fl);g.userData.label=fl;
  return g}
function cakeMake(){const g=new THREE.Group();const t1=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,0.35,18),lamb(0xe9cf9a));t1.position.y=0.17;g.add(t1);
  const t2=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.42,0.3,18),lamb(0xf0dcae));t2.position.y=0.5;g.add(t2);
  const t3=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.25,0.25,18),lamb(0xe9cf9a));t3.position.y=0.77;g.add(t3);
  const cs=[];for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const c=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.12,6),lamb(0xffb3c6));c.position.set(Math.cos(a)*0.15,0.95,Math.sin(a)*0.15);g.add(c);
    const f=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),basic(0xffd36b));f.position.set(Math.cos(a)*0.15,1.06,Math.sin(a)*0.15);g.add(f);cs.push(c,f)}
  g.userData={tiers:[t1,t2,t3],cs};return g}
function banner(){const g=new THREE.Group();const tex=canvasTex(1400,380,(x,w,h)=>{x.fillStyle='#7fbf6a';x.fillRect(0,0,w,h);for(let i=0;i<14;i++){x.fillStyle=i%2?'#6aac58':'#8fcf78';x.fillRect(i*100,0,100,h)}
    x.fillStyle='#fff6fb';x.textAlign='center';x.textBaseline='middle';x.font='900 150px "Noto Sans CJK KR"';x.lineWidth=16;x.strokeStyle='#e2557a';x.strokeText('생일 축하해 ♥ 지은아',w/2,h*0.54);x.fillText('생일 축하해 ♥ 지은아',w/2,h*0.54)});
  const b=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.25),new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));b.position.y=2.75;g.add(b);
  for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,3.4,6),lamb(0x8a6a44));p.position.set(s*2.35,1.7,-0.02);g.add(p)}
  g.userData.b=b;return g}
function bush(scene,x,z,s=1){const g=new THREE.Group();for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry(0.7,1),lamb(i%2?0x5fb36a:0x4ba05c));c.position.set((i-2)*0.65,0.55+((i*7)%3)*0.1,(i%2)*0.2);c.scale.y=0.8;g.add(c)}g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}
function rescuerP(r){const p=rescuer(r);const u=p.userData;const helm=u.head.children[u.head.children.length-1];u.helm=helm;addFaceTo(p);
  const rad=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.18,0.05),lamb(0x2b2b30));rad.position.set(0,-0.66,0.05);u.arms[1].add(rad);const ant=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.12,4),lamb(0x2b2b30));ant.position.set(0.025,-0.52,0.05);u.arms[1].add(ant);u.radio=[rad,ant];
  u.bands=[];for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.018,6,12),lamb([0xffb3c6,0xfff0a8,0xbfe6ff,0xd9c8ff,0xc8f2d6,0xffd6b8,0xff8fc8][i]));b.rotation.x=Math.PI/2;b.position.y=-0.42-i*0.028;u.arms[0].add(b);b.visible=false;u.bands.push(b)}
  return p}
function addFaceTo(p){const u=p.userData;const h=u.head;
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.013,4,10,Math.PI),basic(0x5a2a2a));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.016,0.01),basic(0x5a2a2a));fl.position.set(0,0.145,0.248);h.add(fl);
  const om=new THREE.Mesh(new THREE.CircleGeometry(0.05,16),basic(0x5a2a2a));om.scale.y=1.2;om.position.set(0,0.14,0.248);h.add(om);
  const fr=new THREE.Mesh(new THREE.TorusGeometry(0.045,0.012,6,16,Math.PI),basic(0x5a2a2a));fr.position.set(0,0.12,0.246);h.add(fr);
  u.rf={sm,fl,om,fr};u.tears=[];for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.SphereGeometry(0.026,10,8),basic(0x7fd0ff));d.visible=false;h.add(d);u.tears.push({d,s})}
  u.rblush=[];for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.CircleGeometry(0.04,12),basic(0xff9aa8));b.position.set(s*0.14,0.18,0.236);b.visible=false;h.add(b);u.rblush.push(b)}
  rface(p,'flat')}
function rface(p,m){const f=p.userData.rf;f.sm.visible=m==='smile';f.fl.visible=m==='flat';f.om.visible=m==='open';f.fr.visible=m==='sad'}
function rcry(p,t,on){p.userData.tears.forEach((q,i)=>{const lt=((t*1.8+i*0.5)%1);q.d.visible=on;q.d.position.set(q.s*0.1,0.21-lt*0.2,0.25);q.d.scale.setScalar(on?1.2-lt*0.5:0)})}
function heliOpen(){const g=new THREE.Group();const red=lamb(0xff6b5a),wh=lamb(0xffffff),dk=lamb(0x3a3a44);
  const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o};
  add(new THREE.BoxGeometry(3.0,0.14,1.6),red,0,-0.72,0);
  add(new THREE.BoxGeometry(3.1,0.14,1.7),red,0,0.78,0);
  add(new THREE.BoxGeometry(3.0,1.5,0.1),red,0,0.03,-0.78);
  add(new THREE.BoxGeometry(0.1,1.5,1.6),red,-1.5,0.03,0);
  add(new THREE.BoxGeometry(3.0,1.48,0.04),lamb(0x8a4a48),0,0.03,-0.72);
  add(new THREE.BoxGeometry(3.0,0.3,0.08),red,0,-0.58,0.78);
  add(new THREE.BoxGeometry(3.0,0.08,0.09),wh,0,-0.4,0.79);
  for(const x of[-1.48,1.45])add(new THREE.BoxGeometry(0.12,1.5,0.12),red,x,0.03,0.78);
  add(new THREE.BoxGeometry(2.8,0.18,0.5),lamb(0x4a5a7a),0,-0.52,-0.35);
  add(new THREE.BoxGeometry(2.8,0.6,0.12),lamb(0x4a5a7a),0,-0.2,-0.6);
  const nose=add(new THREE.SphereGeometry(0.85,24,16,0,Math.PI),red,1.5,0.03,0);nose.rotation.y=Math.PI/2;nose.scale.set(1,0.9,0.95);
  const glass=add(new THREE.SphereGeometry(0.7,24,16,0,Math.PI,0,Math.PI/2),smooth(0xbfe8ff),1.55,0.12,0);glass.rotation.y=Math.PI/2;glass.scale.set(1.15,1,0.95);
  const tail=add(new THREE.CylinderGeometry(0.12,0.26,2.6,8),red,-2.8,0.35,0);tail.rotation.z=Math.PI/2;
  add(new THREE.BoxGeometry(0.4,0.9,0.08),wh,-4.0,0.7,0);
  add(new THREE.CylinderGeometry(0.08,0.08,0.35,6),dk,0,1.0,0);
  const rot=new THREE.Group();rot.position.y=1.2;g.add(rot);for(let i=0;i<2;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(6.0,0.04,0.22),lamb(0x333338));b.rotation.y=i*Math.PI/2;rot.add(b)}
  for(const z of[-0.7,0.7]){add(new THREE.BoxGeometry(3.0,0.08,0.1),dk,0,-1.15,z);for(const x of[-0.7,0.7])add(new THREE.BoxGeometry(0.06,0.4,0.06),dk,x,-0.95,z)}
  g.userData.rot=rot;return g}

// ===== S0 타이틀: 폭풍 해변 오열 → "근데 이거 영화 같지 않아?" → 헐 맞아!! → 바다로 =====
S[0]=()=>{
  const scene=IS();const r=rng(1201);const B=beach(scene,r,{shore:-2.2});
  palm(scene,-4.6,-0.6,1.35,0.35,0.3);palm(scene,4.9,0.2,1.25,-0.4,2.4);rock(scene,3.7,-1.0,0.9);rock(scene,-3.4,3.2,0.6);
  for(let i=0;i<6;i++){const pl=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.06,0.22),lamb(0x9a7652));pl.position.set(-3+i*1.3+r()*0.4,0.03,-0.6+r()*1.6);pl.rotation.y=r()*3;scene.add(pl)}
  const C=CAST.map((_,i)=>enfp(i));C.forEach(p=>scene.add(p));
  const seat=[[-1.6,2.2],[-0.55,2.0],[0.55,2.05],[1.6,2.25],[-1.1,3.15],[0.0,3.25],[1.1,3.1]];
  const RN=rain(scene,160,r);
  const fl=document.createElement('div');fl.className='fl';ui.appendChild(fl);
  const ck=chip('절망한 시간 <b>4초</b>');ck.innerHTML='절망한 시간 <b>4초</b>';ck.style.opacity=0;
  const CR=MK('cry0'),RL=MK('real'),CH=MK('cheer'),RUN=MK('run'),SP=MK('splash');
  const sp=bubE(C[2],'!!',{y:2.2,size:0.003});
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);const tl=title();
  const dropl=[];for(let i=0;i<24;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),basic(0xffffff));scene.add(d);d.visible=false;dropl.push({d,vx:(r()-0.5)*3,vy:2+r()*2.5,i})}
  return t=>{
    const k=ease((t-CH)/0.6);
    bgEl.style.background=`linear-gradient(${mixc('#4b566b','#7fc6ef',k)},${mixc('#8e9aab','#c9eef6',k)} 55%,${mixc('#a9b3bf','#eafaf8',k)})`;
    fl.style.opacity=(t>0.2&&t<0.4?0.8*(1-(t-0.2)/0.2):0)+(t>CH-0.05&&t<CH+0.25?0.5*(1-(t-CH+0.05)/0.3):0);
    B.upd(t*(1.6-k*0.8));RN.upd(t,1-k);
    C.forEach((p,i)=>{resetP(p);const [x,z]=seat[i];
      if(t<RUN){p.position.set(x,0,z);p.rotation.y=(i%2?0.15:-0.15);sitPose(p);const u=p.userData;
        if(t<CR){u.hip.rotation.x=0.2;u.head.rotation.x=0.15;face(p,'sad');eyesK(p,0.6)}
        else if(t<CH){const s=Math.sin(t*14+i);u.hip.rotation.x=0.15;u.head.rotation.x=0.05+s*0.05;u.arms.forEach(a=>{a.rotation.x=-1.9;a.rotation.z=(a===u.arms[0]?0.6:-0.6)});face(p,'sad');eyesK(p,0.25);cry(p,t,true,i);
          if(i===2&&t>RL){const kk=ease((t-RL)/0.3);u.hip.rotation.x=0.3*(1-kk);u.head.rotation.x=-0.15*kk;u.arms.forEach(a=>a.rotation.x=-1.9*(1-kk));eyesK(p,0.25+1.25*kk);cry(p,t,false);face(p,'smile');if(kk>0.5)p.rotation.y=-0.3}
          if(i!==2&&t>RL+0.9){const kk=ease((t-RL-0.9-i*0.05)/0.25);if(kk>0){u.head.rotation.x=0.25*(1-kk);eyesK(p,0.25+0.9*kk);if(kk>0.6){cry(p,t,false);face(p,'smile')}}}}
        else{const j=Math.max(0,Math.sin((t-CH)*12+i))*0.35*(1-ease((t-RUN)/0.2));standPose(p);p.position.y=j;armUp(p,0,1);armUp(p,1,1);eyesK(p,1.4);face(p,'open');p.rotation.y=0}}
      else{const d=t-RUN-i*0.05;p.rotation.y=Math.PI;walkPose(p,d*14,0.9);const z0=z;const zz=z0-Math.max(0,d)*3.2;p.position.set(x*(1-clamp01(d*0.3)*0.2),0,Math.max(zz,-3.6));
        if(zz<-2.6){const sk=clamp01((-2.6-zz)/1.0);p.position.y=-sk*0.75;p.userData.arms.forEach(a=>{a.rotation.x=-2.6});}
        face(p,'open')}});
    dropl.forEach(q=>{const d=t-SP-(q.i%7)*0.08;q.d.visible=d>0&&d<0.9;if(q.d.visible){q.d.position.set(-1.8+(q.i%7)*0.6+q.vx*d,q.vy*d-5*d*d,-2.9)}});
    showB(sp,t,RL+0.05,CH);
    if(t<RUN){cam.position.set(0,5.0,13.8-t*0.12);cam.lookAt(0,2.1,0.8)}
    else{const c=ease((t-RUN)/1.6);cam.position.set(0,5.0,13.8-RUN*0.12-c*2.5);cam.lookAt(0,2.3-c*0.8,0.6-c*2.6)}
    if(t>CH)chipPop(ck,t,CH+0.15);
    tl(t,t>RUN+0.2);caption(0,t);renderer.render(scene,cam);
  };
};

// ===== S1 정찰대 2명 → 7명 → 몇 시간 뒤 돌아오니 짐이 바다로 =====
S[1]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(1211);const B=beach(scene,r,{shore:-3});
  palm(scene,-5.2,-0.8,1.6,0.3,0.3);palm(scene,6.0,0.2,1.7,-0.3,1.4);rock(scene,-3.8,3.2,0.6);
  const pile=new THREE.Group();pile.position.set(-1.2,0,1.0);scene.add(pile);
  const PC=[0xff8fc8,0x8fd3ff,0xffc46b,0xb79bff,0x8fe3b0];
  [[0,0],[0.65,0.1],[-0.6,0.25],[0.2,0.6],[0.9,0.55]].forEach(([x,z],i)=>{const s=suitcaseS(PC[i]);s.position.set(x,i>2?0.42:0,z);s.rotation.y=(i-2)*0.3;pile.add(s)});
  // 떠내려가는 가방들 + 파도 자국
  const fl=PC.map((c,i)=>{const s=suitcaseS(c);s.scale.setScalar(1.7);scene.add(s);return {s,x:-2.2+i*1.1,ph:i*1.3}});
  const wet=new THREE.Mesh(new THREE.CircleGeometry(1.7,24),lamb(WET));wet.rotation.x=-Math.PI/2;wet.scale.set(1.3,0.8,1);wet.position.set(-1.0,0.006,1.2);scene.add(wet);
  const C=CAST.map((_,i)=>enfp(i));C.forEach(p=>scene.add(p));
  const L1=ln(1,'l1');const GO=MK('go'),F1=MK('f1'),F2=MK('f2'),F3=MK('f3'),LD=MK('lead'),LT=MK('later'),FZ=MK('freeze');
  const ck=chip('');ck.style.opacity=0;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,400);
  const leave={4:0.0,5:0.15,2:F1,1:F2,6:F3,3:F3+0.25,0:LD};
  const home=[[-1.8,2.9],[0.6,2.2],[1.4,2.0],[-0.3,2.6],[0.3,0.9],[1.1,0.8],[2.0,2.6]];
  const ret=[[-1.8,3.6],[-1.1,3.2],[-0.4,3.6],[0.3,3.2],[1.0,3.6],[1.7,3.2],[2.4,3.6]];
  const qs=C.map(p=>bubE(p,'?!',{y:2.15,size:0.0024}));
  return t=>{B.upd(t);
    const later=t>=LT;pile.visible=!later;wet.visible=later;
    fl.forEach((q,i)=>{q.s.visible=later;const d=t-LT;q.s.position.set(q.x+Math.sin(d*0.8+q.ph)*0.2,-0.12+Math.sin(d*2.4+q.ph)*0.06,-4.2-i*0.7-d*0.5);q.s.rotation.set(Math.sin(d*2+q.ph)*0.2,q.ph+d*0.3,Math.sin(d*1.7+q.ph)*0.25)});
    C.forEach((p,i)=>{resetP(p);face(p,'smile');
      if(!later){const [hx,hz]=home[i];const t0=i===4||i===5?GO+leave[i]:leave[i];
        if(i===0&&t<LD){p.position.set(hx,0,hz);p.rotation.y=0.5;if(t<L1.t1){armUp(p,1,0.7);p.userData.arms[1].rotation.z=0.9}
          if(t>LD-0.9){p.rotation.y=-2.2;p.userData.head.rotation.y=0.5}}
        else if(t<t0){p.position.set(hx,0,hz);if(i===4||i===5){p.rotation.y=-0.3}else{sitPose(p);p.rotation.y=i===2?0.3:0.1;p.userData.head.rotation.y=0.6*ease((t-GO)/0.5)}}
        else{const d=t-t0;p.rotation.y=Math.PI*0.62;walkPose(p,d*11,0.7);p.position.set(hx+d*2.1,0,hz-d*1.0)}
        if(i!==0&&t>t0-0.25&&t<t0+0.4&&(i===2||i===1))face(p,'open')}
      else{const [rx,rz]=ret[i];const d=t-LT-i*0.06;const k=clamp01(d/1.3);
        p.position.set(rx+(1-ease(k))*6.5,0,rz);
        if(t<FZ){p.rotation.y=-Math.PI/2+0.3;walkPose(p,d*10,0.6);laughPose(p,t,0.6,i);face(p,'open')}
        else{const fz=ease((t-FZ-i*0.03)/0.2);p.rotation.y=(-Math.PI/2+0.3)*(1-fz)+Math.PI*fz;eyesK(p,1+0.6*fz);face(p,'open');p.userData.mouth.scale.set(1.3,2.0,0.4);
          if(i%2)armUp(p,0,0.8*fz)}}});
    qs.forEach((b,i)=>showB(b,t,FZ+0.35+i*0.03));
    if(!later){const n=2+[F1,F2,F3,F3+0.25,LD].filter(x=>t>x).length;chipSet(ck,`정찰대 <b>2명 → ${n}명</b>`);chipPop(ck,t,F1-0.1)}
    else if(t<FZ){chipSet(ck,'몇 시간 뒤');chipPop(ck,t,LT)}
    else{chipSet(ck,'정찰대 <b>2명 → 7명</b> · 남은 짐 <b>0개</b>');chipPop(ck,t,FZ+0.2)}
    if(!later){cam.position.set(0.1,4.6,11.5);cam.lookAt(0.1,1.4,0.8)}
    else if(t<FZ){cam.position.set(0.3,4.2,11.5);cam.lookAt(0.3,1.6,1.0)}
    else{const c=ease((t-FZ)/0.6);cam.position.set(0.3,4.2+c*2.4,11.5+c*1.5);cam.lookAt(0.3,1.6-c*1.2,1.0-c*4.0)}
    caption(1,t);renderer.render(scene,cam);
  };
};

// ===== S2 첫날 밤 모닥불 → "일찍 자자" → 첫사랑? → 밤새 수다 → 아침 다크서클 =====
S[2]=()=>{
  const scene=IS();const r=rng(1221);const B=beach(scene,r,{shore:-6,sea:0x3a5a8a,sea2:0x2e4a78});
  palm(scene,-5,-3,1.6,0.3,0.3);palm(scene,5.4,-2.6,1.5,-0.3,2);rock(scene,-3.6,2.2,0.6);
  const st=stars(scene,220,r,{y0:4,h:26,z:-60,w:120});
  const sun=new THREE.Mesh(new THREE.SphereGeometry(2.4,24,16),basic(0xffd36b));scene.add(sun);const sunG=glowSprite('rgba(255,210,120,1)',16);scene.add(sunG);
  const F=fireMake(scene,0,0.8);const fg=glowSprite('rgba(255,170,80,1)',6);fg.position.set(0,0.6,0.8);scene.add(fg);
  const C=CAST.map((_,i)=>enfp(i));
  const seats=[];C.forEach((p,i)=>{const a=-Math.PI/2+(i-3)*0.62+Math.PI;const x=Math.cos(a)*1.9,z=0.8+Math.sin(a)*1.6;const w=new THREE.Group();w.position.set(x,0,z);w.rotation.y=Math.atan2(-x,0.8-z);w.add(p);scene.add(w);seats.push(w)});
  const zz=C.map(p=>{const b=bub(p,'Zz',{y:1.2,bg:'#e8ecff',fg:'#4a5a9a',fs:60,size:0.0022});return b});
  const L3=ln(2,'l3'),AF=ln(2,'a_first');const CL=MK('close'),UP=MK('up'),DW=MK('dawn');
  const ck=chip('');ck.style.opacity=0;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const nb=bub(C[1],'…근데',{y:2.0,bg:'#fff3c2',fg:'#7a5a12',fs:60,size:0.0022});
  const ev=[];[[0,'ㅋㅋㅋㅋ'],[2,'헐 대박'],[4,'ㅠㅠㅠ'],[5,'나도!!'],[6,'그래서??'],[3,'ㅋㅋㅋ']].forEach(([i,s])=>ev.push({b:bubE(C[i],s,{y:2.0,size:0.0022}),i}));
  return t=>{B.upd(t*0.6);
    const dk=ease((t-DW+0.8)/1.4);
    bgEl.style.background=`linear-gradient(${mixc('#141a3a','#ff9e7a',dk)},${mixc('#2a2f5a','#ffd0a0',dk)} 55%,${mixc('#3a3a64','#fff0d6',dk)})`;
    st.material.opacity=1-dk;st.material.transparent=true;sun.position.set(-4,-2.2+dk*4.2,-60);sunG.position.copy(sun.position);sunG.visible=dk>0.02;
    F.upd(t,1-dk*0.7);fg.material.opacity=1-dk*0.8;
    C.forEach((p,i)=>{resetP(p);face(p,'smile');const u=p.userData;
      const lie=t>CL&&t<UP;const bolt=ease((t-UP-i*0.03)/0.18);
      if(lie&&bolt<=0){p.rotation.x=-Math.PI/2;p.position.set(0,0.18,0.4);eyesK(p,0.12);face(p,'none')}
      else{p.rotation.x=0;p.position.set(0,0,0);sitPose(p);if(t>UP&&t<UP+0.5)eyesK(p,1.5)}
      if(t>UP+0.4&&t<DW){const ph=Math.floor((t-UP)*2.2+i)%3;
        if(ph===0)laughPose(p,t,1,i);else if(ph===1){cry(p,t,true,i);u.arms[0].rotation.set(-1.9,0,0.5)}else{u.hip.rotation.z=(i%2?1:-1)*0.25;u.arms.forEach(a=>a.rotation.set(-1.0,0,0))}
        if(ph!==1)face(p,i%2?'open':'smile')}
      if(t>DW){dark(p,true);eyesK(p,0.5);u.hip.rotation.x=0.12}else dark(p,false);
      scaleBubble(zz[i],lie&&bolt<=0?pop((t-CL-0.3-i*0.05)/0.3):0)});
    talk(2,t,C);
    showB(nb,t,AF.t0,AF.t1+0.2);
    ev.forEach((q,j)=>{const t0=UP+0.5+j*0.42;showB(q.b,t,t0,Math.min(t0+1.0,DW-0.2))});
    if(t>UP+0.3){const n=Math.min(23,1+Math.floor((t-UP-0.3)/((DW-UP-0.4)/22)));chipSet(ck,`"이제 진짜 자자" <b>${n}번</b>`);chipPop(ck,t,UP+0.3)}
    if(t<UP){cam.position.set(0,7.2,11.5);cam.lookAt(0,1.6,0.6)}
    else if(t<DW){const c=ease((t-UP)/2.5);cam.position.set(Math.sin(t*0.4)*1.0,6.6-c*0.8,11.0-c*0.6);cam.lookAt(0,1.6,0.6)}
    else{const c=ease((t-DW)/1.6);cam.position.set(0,5.0,11.5-c*0.8);cam.lookAt(0,2.2,-1.5)}
    caption(2,t);renderer.render(scene,cam);
  };
};

// ===== S3 무인도 깜짝 생일파티 =====
S[3]=()=>{
  const scene=IS();const r=rng(1231);const B=beach(scene,r,{shore:-4});
  palm(scene,-5,-1.6,1.6,0.3,0.3);palm(scene,5.6,-1.2,1.7,-0.3,1.4);palm(scene,3.6,-2.2,1.5,-0.1,2.0);rock(scene,-4,3,0.6);
  const C=CAST.map((_,i)=>enfp(i));C.forEach(p=>scene.add(p));const J=C[3];const stk=stick(J,0.7);
  const cake=cakeMake();cake.position.set(1.0,0,1.5);scene.add(cake);const ban=banner();ban.position.set(1.0,0,0.2);ban.scale.x=0.72;scene.add(ban);
  const bs=bush(scene,0.3,1.2,1.1);const glow=glowSprite('rgba(255,190,90,1)',3.2);glow.position.set(0.3,1.0,1.0);scene.add(glow);
  const CF=confetti(scene,90,r,{x:0.3,y:1.6,z:1.6});
  const BD=ln(3,'c_bday'),SH=ln(3,'b_shh'),AC=ln(3,'c_acting'),KN=ln(3,'c_knew');const EA=MK('ears'),WK=MK('walk'),PR=MK('prep'),EV=MK('eve'),SU=MK('surp'),CRY=MK('cry');
  const others=[0,1,2,4,5,6];
  const bang=others.map(i=>bubE(C[i],'!',{y:2.1,size:0.0024}));
  const notes=others.map(i=>noteB(C[i],{y:2.1,size:0.0024}));
  const sq=bubE(J,'…',{y:2.1,size:0.0024,bg:'#f2f2f2',fg:'#555'});
  const shh=bubE(C[2],'쉿!!!',{y:2.15,size:0.003,bg:'#ffe066',fg:'#7a4a00'});
  const kk=others.map((i,j)=>bubE(C[i],'ㅋㅋ',{y:1.0,size:0.0018,bg:'#fff3fa'}));
  const ck=chip('무인도 5일째');const ck2=chip('깜짝 파티 준비 <b>6시간</b> · 들킨 시간 <b>6시간</b>');ck2.innerHTML='깜짝 파티 준비 <b>6시간</b> · 들킨 시간 <b>6시간</b>';ck2.style.opacity=0;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  return t=>{B.upd(t);
    const eve=t>=EV;const dk=ease((t-EV)/0.4);
    bgEl.style.background=eve?`linear-gradient(${mixc('#7fc6ef','#6a5a9a',dk)},${mixc('#c9eef6','#ff9e7a',dk)} 55%,${mixc('#eafaf8','#ffd0a0',dk)})`:'linear-gradient(#7fc6ef,#c9eef6 55%,#eafaf8)';
    C.forEach(p=>{resetP(p);face(p,'smile')});stk.visible=false;
    const cakeK=ease((t-PR-0.2)/1.4);cake.userData.tiers.forEach((m,i)=>{const s=clamp01(cakeK*3-i);m.scale.set(s,s,s);m.visible=s>0.01});cake.userData.cs.forEach(m=>m.visible=cakeK>0.95||eve);
    const banK=ease((t-PR-0.6)/0.8);ban.scale.set(0.72,banK||0.001,0.72);ban.visible=banK>0.01;
    bs.visible=eve&&t<SU;glow.visible=eve&&t<SU;glow.material.opacity=0.6+Math.sin(t*12)*0.2;
    if(!eve){
      // 지은: 앞쪽에 앉아 모래에 낙서
      J.position.set(-1.0,0,3.0);J.rotation.y=0.2;sitPose(J);stk.visible=true;J.userData.arms[1].rotation.set(-0.9+Math.sin(t*8)*0.15,0,0);J.userData.head.rotation.x=0.3;
      if(t>BD.t0){J.userData.head.rotation.x=0.1}
      if(t>WK){J.userData.head.rotation.y=0.35*Math.sin(t*1.5);eyesK(J,0.35)}
      if(t>PR){J.rotation.y=0.0;J.userData.head.rotation.y=(Math.sin((t-PR)*2.2)>0.6?0.9:0);}
      others.forEach((i,j)=>{const p=C[i];
        if(t<WK){p.position.set(0.2+j*0.5,0,-0.6+(j%2)*0.5);p.rotation.y=-0.4;if(t>EA){p.rotation.y=-0.9;eyesK(p,1.5);p.userData.head.rotation.y=-0.2}}
        else if(t<PR){const d=t-WK-j*0.18;const x=3.0-Math.max(0,d)*2.0;p.position.set(x,0,4.3);p.rotation.y=-Math.PI/2;walkPose(p,d*8,0.45);p.userData.head.rotation.y=-1.0;face(p,'open');}
        else{const look=Math.sin((t-PR)*2.2)>0.6;const work=[[0.3,1.1],[1.7,1.1],[0.4,2.2],[1.6,2.2],[-0.2,0.4],[2.2,0.4]][j];
          if(look){p.position.set(-0.3+j*0.45,0,1.1);p.rotation.y=-0.1;eyesK(p,1.3);face(p,'smile');p.userData.arms.forEach(a=>a.rotation.x=0)}
          else{p.position.set(work[0],0,work[1]);p.rotation.y=Math.atan2(1.0-work[0],1.5-work[1]);p.userData.hip.rotation.x=0.35;p.userData.arms.forEach((a,k)=>a.rotation.x=-1.0+Math.sin(t*12+j+k)*0.4)}
          if(i===2&&t>SH.t0-0.1&&t<SH.t1+0.3){p.position.set(0.0,0,2.2);p.rotation.y=-0.6;p.userData.arms[1].rotation.set(-2.2,0,0.2);face(p,'open');p.userData.mouth.scale.set(1.6,1.8,0.4)}}});
      showB(sq,t,WK+0.6,PR);
    }else{
      // 저녁: 덤불 뒤 머리 6개, 지은이 걸어옴 → 서프라이즈 → 오열 포옹
      others.forEach((i,j)=>{const p=C[i];const x=-0.9+j*0.48,z=0.6;
        if(t<SU){p.position.set(x,-0.55+Math.sin(t*9+j)*0.04,z);p.rotation.y=0}
        else{const k2=ease((t-SU-j*0.03)/0.25);p.position.set(x,(-0.55+0.55*k2)+Math.max(0,Math.sin((t-SU)*10+j))*0.25*(1-ease((t-SU-1.2)/0.3)),z+k2*0.9);armUp(p,0,k2);armUp(p,1,k2);face(p,'open');eyesK(p,1.4)}
        if(t>CRY){const a=(j-2.5)*0.5;p.position.set(-0.4+Math.sin(a)*1.0,0,2.6+Math.cos(a)*0.6-0.9);p.rotation.y=Math.atan2(-0.4-p.position.x,3.2-p.position.z);p.userData.arms.forEach(a2=>a2.rotation.set(-1.3,0,0));cry(p,t,true,j)}});
      const jx=t<AC.t0?-3.4+ease((t-EV)/0.8)*1.6:-1.8;J.position.set(t>CRY?-0.4:jx,0,3.2);J.rotation.y=t<AC.t0?Math.PI/2*(1-ease((t-EV-0.6)/0.3)):0.3;if(t<AC.t0)walkPose(J,t*8,0.4);
      if(t>AC.t0&&t<SU){J.userData.arms[0].rotation.set(-0.6,0,0.9);J.userData.arms[1].rotation.set(-0.6,0,-0.9);J.userData.head.rotation.y=Math.sin(t*3)*0.4}
      if(t>SU&&t<KN.t0)eyesK(J,1.3);
      if(t>KN.t0&&t<CRY){laughPose(J,t,1);eyesK(J,0.3)}
      if(t>CRY){J.rotation.y=0;cry(J,t,true,9)}
      kk.forEach((b,j)=>showB(b,t,EV+0.4+j*0.12,SU));CF.upd(t,SU);
    }
    talk(3,t,C);bang.forEach((b,j)=>showB(b,t,EA+j*0.04,WK));notes.forEach((b,j)=>showB(b,t,WK+j*0.1,PR));
    chipPop(ck,t,0.05);if(t>CRY-0.1){ck.style.opacity=0;chipPop(ck2,t,CRY)}
    if(!eve){cam.position.set(0.3,4.6,13.5);cam.lookAt(0.3,1.9,1.2)}
    else if(t<CRY){cam.position.set(-0.4,4.0,12.0);cam.lookAt(-0.4,1.7,1.2)}
    else{const c=ease((t-CRY)/1.5);cam.position.set(-0.4,4.0-c*0.4,11.0-c*1.2);cam.lookAt(-0.4,1.8,1.8)}
    caption(3,t);renderer.render(scene,cam);
  };
};

// ===== S4 구조: 헬기 → 무전 보고 말투 변화(1분 이상. → 8분 ㅎㅎ) → 오열 =====
S[4]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(1241);const B=beach(scene,r,{shore:-4});
  palm(scene,-5,-1.4,1.6,0.3,0.3);palm(scene,5.4,-1.0,1.7,-0.3,1.4);
  const HL=heliOpen();HL.scale.setScalar(1.25);scene.add(HL);
  const R=rescuerP(r);scene.add(R);const C=CAST.map((_,i)=>enfp(i));C.forEach(p=>scene.add(p));
  // 하늘 세트(비행 중)
  const air=new THREE.Group();air.position.set(0,40,0);scene.add(air);
  const H2=heliOpen();H2.scale.setScalar(1.6);air.add(H2);
  const cl=[cloud(air,-6,2,-8,1.4),cloud(air,7,-2,-10,1.6),cloud(air,-3,-4,-6,1.0),cloud(air,4,4,-12,1.2)];
  // 착륙장 세트
  const pad=new THREE.Group();pad.position.set(-80,0,0);scene.add(pad);
  const pg=new THREE.Mesh(new THREE.BoxGeometry(14,0.1,14),lamb(0xbfc4cc));pg.position.y=-0.05;pad.add(pg);
  const hm=canvasTex(512,512,(x,w,h)=>{x.fillStyle='#bfc4cc';x.fillRect(0,0,w,h);x.strokeStyle='#ffd84d';x.lineWidth=26;x.beginPath();x.arc(w/2,h/2,200,0,Math.PI*2);x.stroke();x.fillStyle='#ffffff';x.font='900 300px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('H',w/2,h/2+10)});
  const hpl=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshLambertMaterial({map:hm}));hpl.rotation.x=-Math.PI/2;hpl.position.set(0,0.01,-1);pad.add(hpl);
  for(let i=0;i<5;i++){const b=makeBuilding(r,4,8+r()*10,4);b.position.set(-10+i*5,b.position.y,-12);pad.add(b)}
  const R1=ln(4,'r1'),R6=ln(4,'r6');const LD=MK('land'),IN=MK('in'),M1=MK('m1'),M3=MK('m3'),M8=MK('m8'),BY=MK('bye');const GJ=ln(4,'g_jinjja');
  const q=[bubE(C[1],'MBTI 뭐예요?',{y:1.5,size:0.0019}),bubE(C[2],'몇 살이에요?!',{y:1.5,size:0.0019}),bubE(C[5],'여친 있어요?',{y:1.5,size:0.0019})];
  const lol=bubE(R,'ㅎㅎ',{y:2.0,size:0.0022,bg:'#fff3c2',fg:'#7a5a12'});
  const ck=chip('');ck.style.opacity=0;const ck2=chip('구조대원 말투: <b>이상.</b> → <b>ㅎㅎ</b>',1120);ck2.innerHTML='구조대원 말투: <b>이상.</b> → <b>ㅎㅎ</b>';ck2.className='stat';ck2.style.opacity=0;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const seatX=[-1.05,-0.6,0.6,1.05];
  return t=>{B.upd(t);
    resetP(R);rface(R,'flat');R.userData.helm.visible=true;R.userData.bands.forEach(b=>b.visible=false);R.userData.radio.forEach(m=>m.visible=false);rcry(R,t,false);R.userData.rblush.forEach(b=>b.visible=false);
    C.forEach(p=>{resetP(p);face(p,'smile')});
    const phase=t<IN?0:t<BY?1:2;
    if(phase===0){
      const dn=ease(t/LD);HL.position.set(1.6,1.45+(1-dn)*6,-1.0);HL.rotation.y=-0.25;HL.userData.rot.rotation.y=t*30;
      R.position.set(0.4,0,1.6);R.rotation.y=0.15;R.visible=t>LD;crossArms(R,1);
      C.forEach((p,i)=>{p.position.set(-1.9+(i%2)*0.45,0,0.4+i*0.5);p.rotation.y=1.1;eyesK(p,1.5)});
      cam.position.set(0,4.0,12.5);cam.lookAt(0,1.9,0.8);
    }else if(phase===1){
      H2.userData.rot.rotation.y=t*40;H2.position.set(0,Math.sin(t*2)*0.1,0);cl.forEach((c,i)=>c.position.x+=0);cl.forEach((c,i)=>{c.position.x=((-8+i*5-(t-IN)*3)%20+20)%20-10});
      // 기내: 가운데 구조대원, 양옆 ENFP
      H2.add(R);R.scale.setScalar(1);R.position.set(0,-0.62,-0.25);R.rotation.y=0;sitPose(R);R.userData.legs.forEach(l=>l.rotation.x=-1.3);
      const kids=[1,2,5,6].map(i=>C[i]);kids.forEach((p,j)=>{H2.add(p);p.position.set(seatX[j],-0.62,-0.25);p.rotation.y=(j<2?0.5:-0.5);sitPose(p);p.userData.legs.forEach(l=>l.rotation.x=-1.3);p.scale.setScalar(0.92)});
      [0,3,4].forEach(i=>{C[i].visible=false});
      const u=R.userData;const rad=t<M8+0.2||true;u.radio.forEach(m=>m.visible=true);u.arms[1].rotation.set(-2.6,0,-0.5);
      if(t<M3){rface(R,'flat');kids.forEach(p=>{eyesK(p,1.4);p.userData.hip.rotation.x=0.15})}
      else if(t<M8){u.helm.rotation.x=-0.35;u.helm.position.y=0.33;u.hip.rotation.x=0.1;u.rblush.forEach(b=>b.visible=true);rface(R,'smile');kids.forEach((p,j)=>{p.userData.hip.rotation.x=0.3;p.userData.hip.rotation.z=(j<2?-1:1)*0.18});
        if(t>GJ.t0-0.05&&t<GJ.t1+0.2)kids.forEach(p=>{p.userData.arms[0].rotation.set(-2.3,0,0.4);p.userData.arms[1].rotation.set(-2.3,0,-0.4);eyesK(p,1.5)})}
      else{u.helm.visible=false;u.bands.forEach(b=>b.visible=true);rface(R,'open');u.hip.rotation.x=-0.15+Math.sin(t*10)*0.05;u.arms[0].rotation.set(-1.0,0,0.3);kids.forEach((p,j)=>laughPose(p,t,1,j))}
      if(t>M8+0.5&&Math.sin(t*14)>0)rface(R,'open');
      q.forEach((b,j)=>showB(b,t,M3+0.1+j*0.3,M3+2.4));showB(lol,t,M8+0.3,BY);
      const mm=t<M3?1:t<M8?4:8;chipSet(ck,`비행 <b>${mm}분째</b>`);chipPop(ck,t,IN+0.05);if(t>M8)chipPop(ck2,t,M8+0.2);
      cam.position.set(0,40+0.9,13.5);cam.lookAt(0,40+0.7,0);
    }else{
      // 착륙장: ENFP들은 손 흔들며 떠나고, 구조대원 오열
      pad.add(R);R.scale.setScalar(1);R.position.set(-1.1,0,2.0);R.rotation.y=0.6;const u=R.userData;u.helm.visible=false;u.bands.forEach(b=>b.visible=true);rface(R,'sad');rcry(R,t,true);u.arms[1].rotation.set(-1.6,0,-0.2);u.arms[1].rotation.x=-1.6+Math.sin(t*6)*0.1;u.hip.position.x=Math.sin(t*30)*0.012;
      C.forEach((p,i)=>{p.visible=true;pad.add(p);const d=t-BY;p.position.set(0.0+(i%4)*0.5+d*0.7,0,0.8+Math.floor(i/4)*0.7-d*0.3);p.rotation.y=Math.PI*0.62;walkPose(p,d*7,0.45);p.userData.head.rotation.y=-1.2;wave(p,t,0,i);p.scale.setScalar(1)});
      ck.style.opacity=0;ck2.style.opacity=0;
      const c=ease((t-BY)/2);cam.position.set(-80+0.4,3.6,11.5-c*0.8);cam.lookAt(-80+0.4,1.8,0.8);
    }
    talk(4,t,C);if(phase===1){const on=TM.lines.some(l=>l.s===4&&l.k[0]==='r'&&t>l.t0&&t<l.t1);if(on&&t<M8)rface(R,Math.sin(t*20)>0?'open':(t<M3?'flat':'smile'))}
    if(phase===0){const on=t>R1.t0&&t<R1.t1;if(on)rface(R,Math.sin(t*20)>0?'open':'flat')}
    caption(4,t);renderer.render(scene,cam);
  };
};

// ===== S5 카페 재회 → 회상 → 또 갈래? → 자진 재입도 → "…또요?" → 엔딩 카드 =====
S[5]=()=>{
  const scene=IS();const r=rng(1251);
  // 카페
  const cafe=new THREE.Group();scene.add(cafe);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xe6cfa8));fl.rotation.x=-Math.PI/2;cafe.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(30,8,0.2),lamb(0xf5ece0));wall.position.set(0,4,-3);cafe.add(wall);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(5,2.6),basic(0xbfe8ff));win.position.set(0,2.6,-2.88);cafe.add(win);
  const tb=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,0.1,24),lamb(0xffffff));tb.position.set(0,0.95,0.4);cafe.add(tb);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.15,0.9,8),lamb(0x8a6a44));leg.position.set(0,0.45,0.4);cafe.add(leg);
  for(let i=0;i<5;i++){const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.08,0.2,10),lamb([0xff8fc8,0x8fd3ff,0xffc46b,0xb79bff,0x8fe3b0][i]));const a=i/5*Math.PI*2;cup.position.set(Math.cos(a)*0.9,1.1,0.4+Math.sin(a)*0.7);cafe.add(cup)}
  const ph=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.02,0.5),lamb(0x24242c));ph.position.set(0,1.02,1.0);cafe.add(ph);
  const C=CAST.map((_,i)=>enfp(i));C.forEach(p=>cafe.add(p));
  const seat=[[0,-0.9],[-1.5,-0.3],[-1.6,0.9],[-0.7,1.7],[0.7,1.7],[1.6,0.9],[1.5,-0.3]];
  // 회상 세트 3개 (멀리)
  const fb=new THREE.Group();fb.position.set(100,0,0);scene.add(fb);
  const fsea=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(SEA));fsea.rotation.x=-Math.PI/2;fsea.position.set(0,-0.2,-60);fb.add(fsea);
  const fsc=[0xff8fc8,0x8fd3ff,0xffc46b].map((c,i)=>{const g=suitcaseS(c);g.position.set(1.5+i*1.4,-0.3,-8-i*2.5);g.rotation.set(0.2,i,0.25);fb.add(g);return g});
  const fbFaces=[0,1,2].map(i=>{const p=enfp(i+1);dark(p,true);eyesK(p,0.45);fb.add(p);p.position.set(-0.8+i*0.8,-1.0,20);return p});
  const fban=banner();fban.position.set(0,-0.5,40);fban.scale.setScalar(0.6);fb.add(fban);const hid=[4,5,6].map(i=>{const p=enfp(i);fb.add(p);p.position.set(-0.7+(i-4)*0.7,-0.5,41.0);return p});
  // 재입도 해변
  const isl=new THREE.Group();isl.position.set(-100,0,0);scene.add(isl);const B=beach(isl,r,{shore:-3});
  // beach()는 scene에 붙이므로 isl 기준으로 옮길 수 없음 → 해변 메쉬를 직접 만듦
  palm(isl,-4.6,-0.8,1.6,0.3,0.3);palm(isl,4.8,-0.4,1.7,-0.3,1.4);
  
  const IC=CAST.map((_,i)=>enfp(i));IC.forEach(p=>{isl.add(p);const tube=new THREE.Mesh(new THREE.TorusGeometry(0.36,0.11,10,20),smooth([0xff8fc8,0xffd84d,0x8fd3ff,0x8fe3b0,0xb79bff,0xffb38a,0xff8f8f][p.userData.idx]));tube.rotation.x=Math.PI/2;tube.position.y=0.25;p.userData.hip.add(tube)});
  const HL=heliOpen();HL.scale.setScalar(0.9);isl.add(HL);const R=rescuerP(r);R.scale.setScalar(0.62);R.position.set(0.9,-0.82,0.2);R.rotation.y=0.4;HL.add(R);sitPose(R);
  const rb=bub(R,'…또요?',{y:2.3,bg:'#fff3c2',fg:'#7a5a12',fs:70,size:0.0042});
  const FL=MK('flash'),BK=MK('back'),BE=MK('beach'),HE=MK('heli'),CD=MK('card');const R7=ln(5,'r7');const AG=ln(5,'a_again'),GZ=ln(5,'g_gaja');
  const ck=chip('3일 뒤');const ck2=chip('구조 <b>3일</b> · 자진 재입도 <b>1회</b>');ck2.innerHTML='구조 <b>3일</b> · 자진 재입도 <b>1회</b>';ck2.style.opacity=0;
  const memo=document.createElement('div');memo.className='clock';memo.textContent='회상';memo.style.top='230px';memo.style.opacity=0;ui.appendChild(memo);
  const dim=document.createElement('div');dim.className='fl';dim.style.background='rgba(20,15,35,1)';ui.appendChild(dim);
  const e1=document.createElement('div');e1.className='end1 out';e1.textContent='다음 무인도편은?';ui.appendChild(e1);
  const e2=document.createElement('div');e2.className='end2 out';e2.textContent='팔로우하고 기다려 주세요';ui.appendChild(e2);
  const canvasEl=document.getElementById('c');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  return t=>{
    const isFlash=t>=FL&&t<BK;canvasEl.style.filter=isFlash?'sepia(0.75) saturate(0.8) brightness(1.05)':'none';bgEl.style.filter=isFlash?'sepia(0.75)':'none';
    memo.style.opacity=isFlash?1:0;
    if(t<BE){
      if(!isFlash){bgEl.style.background='linear-gradient(#f5ece0,#f5ece0)';
        C.forEach((p,i)=>{resetP(p);face(p,'smile');const [x,z]=seat[i];p.position.set(x,0,z+0.4);p.rotation.y=Math.atan2(-x,-z);sitPose(p);p.userData.legs.forEach(l=>l.rotation.x=-1.4);
          if(t<FL){p.userData.head.rotation.x=0.25;eyesK(p,0.7);p.userData.hip.rotation.x=0.1}
          if(t>AG.t0-0.1&&i===1){p.userData.hip.rotation.x=0.2;eyesK(p,1.4)}
          if(t>GZ.t0-0.05){standPose(p);armUp(p,0,1);armUp(p,1,1);eyesK(p,1.5);face(p,'open');p.position.y=Math.max(0,Math.sin((t-GZ.t0)*12+i))*0.2}});
        talk(5,t,C);
        cam.position.set(0,5.6,10.5);cam.lookAt(0,2.0,0.4);
      }else{
        const k=(t-FL)/(BK-FL);const sh=Math.min(1,Math.floor(k*2));
        bgEl.style.background='linear-gradient(#7fc6ef,#c9eef6 55%,#eafaf8)';
        fbFaces.forEach(p=>{resetP(p);dark(p,true);eyesK(p,0.45);face(p,'none')});hid.forEach(p=>{resetP(p);face(p,'smile')});
        if(sh===0){fsc.forEach((g,i)=>g.position.y=-0.3+Math.sin(t*2.4+i)*0.06);cam.position.set(100,1.4,4);cam.lookAt(100+2.2,-0.2,-10)}
        else if(sh===1){cam.position.set(100,0.6,24.6);cam.lookAt(100,0.5,20)}
        else{cam.position.set(100,2.4,47);cam.lookAt(100,1.4,40)}
      }
      chipPop(ck,t,0.05);ck.style.opacity=isFlash?0:1;
    }else{
      ck.style.opacity=0;bgEl.style.background='linear-gradient(#7fc6ef,#c9eef6 55%,#eafaf8)';B.upd(t);
      IC.forEach((p,i)=>{resetP(p);face(p,'open');eyesK(p,1.3);const d=t-BE;p.rotation.y=0;walkPose(p,d*9,0.6);p.position.set((i-3)*0.6,0,-2.8+Math.min(d*1.3,4.6)+(i%2)*0.3);if(i%3===0)armUp(p,1,1)});
      const hk=ease((t-HE)/1.0);HL.position.set(1.4-(1-hk)*6,5.0,-3);HL.rotation.y=-0.3;HL.userData.rot.rotation.y=t*32;HL.visible=t>HE-0.2;
      resetP(R);sitPose(R);R.userData.legs.forEach(l=>l.rotation.x=-1.3);R.userData.helm.visible=true;R.userData.bands.forEach(b=>b.visible=true);rface(R,t>R7.t0&&t<R7.t1&&Math.sin(t*20)>0?'open':'flat');if(R.userData.eyes)eyesK(R,0.6);
      showB(rb,t,R7.t0,CD);
      chipPop(ck2,t,BE+0.4);if(t>CD)ck2.style.opacity=0;
      const c=ease((t-BE)/3);cam.position.set(-100,4.4,13.5-c*1.0);cam.lookAt(-100,2.4+(t>HE?ease((t-HE)/0.8)*1.4:0),-0.6);
    }
    const ek=clamp01((t-CD)/0.3);dim.style.opacity=ek*0.78;
    e1.style.opacity=ek;e1.style.transform=`scale(${pop((t-CD)/0.35)})`;e2.style.opacity=clamp01((t-CD-0.3)/0.2);e2.style.transform=`scale(${pop((t-CD-0.3)/0.35)})`;
    caption(5,t,CD);renderer.render(scene,cam);
  };
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';document.getElementById('c').style.filter='none';bgEl.style.filter='none';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
