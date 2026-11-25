// ---------- #018 ESTJ 본편 공용 ----------
const S=[];
renderer.setClearColor(0x000000,0);
const tickLabel=()=>labelSprite('✔',{bg:'#5ccf7a',fg:'#fff',fs:64,size:0.0034,r:40});
function hairColor(p){return p.userData.head.children[1].material.color.getHex()}
function mkWoman(r,o={}){const p=makePerson(r,o);const h=p.userData.head;const hc=o.hair??hairColor(p);
  h.children[1].material=smooth(hc);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI*0.75,Math.PI*1.5,0,Math.PI*0.72),smooth(hc));bk.position.y=0.25;bk.scale.set(1.04,1.18,1.04);h.add(bk);
  p.userData.hip.children[0].scale.x=0.9;return p}
function smileMouth(p){const m=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.011,8,16,Math.PI),basic(0xc0506a));m.rotation.z=Math.PI;m.position.set(0,0.165,0.245);p.userData.head.add(m);p.userData.smile=m;return m}
function notebook(p,col=0x5ccf7a){const g=new THREE.Group();const cv=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.03,0.38),lamb(col));g.add(cv);
  const pg=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.032,0.36),lamb(0xfffdf3));pg.position.y=0.012;g.add(pg);
  g.position.set(0,0.28,0.36);g.rotation.x=0.9;p.userData.hip.add(g);p.userData.arms.forEach(a=>{a.rotation.x=-1.05;a.rotation.z=0});return g}
function holdPose(p){p.userData.arms.forEach((a,i)=>{a.rotation.x=-1.05;a.rotation.z=i?-0.25:0.25})}
function crossArms(p){const u=p.userData;u.arms[0].rotation.set(-1.35,0,0.95);u.arms[1].rotation.set(-1.35,0,-0.95)}
function phoneIn(p,side=1){const ph=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.27,0.03),lamb(0x22222a));ph.position.set(0,-0.62,0.1);ph.rotation.x=-0.4;p.userData.arms[side].add(ph);
  const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.12,0.22),basic(0xbfe8ff));sc.position.set(0,0,0.017);ph.add(sc);p.userData.arms[side].rotation.x=-1.4;return ph}
function canvasPlane(w,h,px,draw){const c=document.createElement('canvas');c.width=Math.round(w*px);c.height=Math.round(h*px);const ctx=c.getContext('2d');
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true}));
  m.userData.redraw=(...a)=>{ctx.clearRect(0,0,c.width,c.height);draw(ctx,c.width,c.height,...a);t.needsUpdate=true};m.userData.redraw();return m}
function floorPlane(scene,col,w=60,d=60){const f=new THREE.Mesh(new THREE.PlaneGeometry(w,d),lamb(col));f.rotation.x=-Math.PI/2;scene.add(f);return f}
function wallBox(scene,col,z,w=30,h=8){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.2),lamb(col));m.position.set(0,h/2,z);scene.add(m);return m}
function sweatDrop(){const d=new THREE.Mesh(new THREE.SphereGeometry(0.05,12,10),new THREE.MeshBasicMaterial({color:0x8fd3ff}));d.scale.set(0.8,1.3,0.8);return d}
const pTitle=(t)=>{};

// ---------- S0: 타이틀 — 새해 헬스장, 12월 31일에도 꽉 참 ----------
S[0]=()=>{
  bgEl.style.background='linear-gradient(#bfe6cf,#e9f7ef 60%,#f6fbf8)';
  const r=rng(1801);const sc=new THREE.Scene();addLights(sc,{hemi:1.6,dir:1.2,dpos:[3,10,8]});
  floorPlane(sc,0xb9c4cf);
  const mat=new THREE.Mesh(new THREE.PlaneGeometry(9.6,6),lamb(0x55606e));mat.rotation.x=-Math.PI/2;mat.position.set(0,0.005,-0.6);sc.add(mat);
  wallBox(sc,0xe6f2ea,-3.6);
  // 계절 창문 (월마다 바뀜)
  const SEASON={jan:['#cfe3f5','#ffffff','눈'],mar:['#cdeaff','#ffc4dc','벚꽃'],jul:['#9fd8ff','#6fcf7a','여름'],dec:['#2f3b5e','#ffffff','눈']};
  const win=canvasPlane(7.6,1.7,90,(x,w,h,key='jan')=>{const s=SEASON[key];x.fillStyle=s[0];x.fillRect(0,0,w,h);const rr2=rng(5);
    if(key==='jul'){x.fillStyle='#ffe066';x.beginPath();x.arc(w*0.85,h*0.3,h*0.18,0,7);x.fill()}
    for(let i=0;i<9;i++){x.fillStyle=key==='jul'?'#5cb86a':key==='mar'?'#f7a8c8':'#e9eef5';x.beginPath();x.arc(w*(i+0.5)/9,h*1.02,h*0.35,0,7);x.fill()}
    if(key!=='jul')for(let i=0;i<70;i++){x.fillStyle=s[1];x.beginPath();x.arc(rr2()*w,rr2()*h*0.85,key==='mar'?5:4,0,7);x.fill()}
    if(key==='dec')for(let i=0;i<14;i++){x.fillStyle=['#ffd84d','#ff8fa8','#7dffa6'][i%3];x.beginPath();x.arc(w*(i+0.5)/14,h*0.12+Math.sin(i)*6,7,0,7);x.fill()}
    x.strokeStyle='#ffffff';x.lineWidth=14;for(let i=1;i<4;i++){x.beginPath();x.moveTo(w*i/4,0);x.lineTo(w*i/4,h);x.stroke()}x.strokeRect(0,0,w,h)});
  win.position.set(0,3.1,-3.48);sc.add(win);
  const cal=canvasPlane(1.2,1.3,200,(x,w,h,m='1월')=>{x.fillStyle='#fff';rr(x,0,0,w,h,20);x.fill();x.fillStyle='#e8324a';x.fillRect(0,0,w,h*0.28);
    x.fillStyle='#fff';x.font=`900 ${h*0.17}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('2027',w/2,h*0.14);
    x.fillStyle='#333';x.font=`900 ${h*0.4}px ${FONT}`;x.fillText(m,w/2,h*0.64)});
  cal.position.set(-4.2,2.4,-3.48);sc.add(cal);
  const sign=canvasPlane(2.4,0.5,200,(x,w,h)=>{x.fillStyle='#2f9a5a';rr(x,0,0,w,h,20);x.fill();x.fillStyle='#fff';x.font=`900 ${h*0.55}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('ESTJ 피트니스',w/2,h/2+3)});
  sign.position.set(2.6,4.5,-3.48);sc.add(sign);
  const ppl=[];
  const XS=[-3.3,-1.1,1.1,3.3],ZS=[-1.9,0.4];
  ZS.forEach((z,zi)=>XS.forEach((x,xi)=>{
    const tm=new THREE.Group();const base=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.16,1.7),lamb(0x3a3f4a));base.position.y=0.08;tm.add(base);
    const belt=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.02,1.5),lamb(0x22252c));belt.position.y=0.17;tm.add(belt);
    for(const s of[-1,1]){const pole=new THREE.Mesh(new THREE.BoxGeometry(0.06,1.1,0.06),lamb(0x8a93a0));pole.position.set(s*0.36,0.65,0.78);pole.rotation.x=-0.15;tm.add(pole)}
    const con=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.26,0.16),lamb(0x4a5260));con.position.set(0,1.2,0.86);con.rotation.x=0.5;tm.add(con);
    const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.14),basic(0x7dffa6));scr.position.set(0,1.25,0.95);scr.rotation.x=-0.9;tm.add(scr);
    tm.position.set(x,0,z);sc.add(tm);
    const p=(xi+zi)%2?mkWoman(r):makePerson(r);smileMouth(p);p.position.set(x,0.17,z-0.1);sc.add(p);
    const b=bT('ESTJ',{fs:66,size:0.0040});b.position.y=2.12;if(Math.abs(x)<3)p.add(b);
    const tk=tickLabel();tk.position.set(0.42,2.0,0);if(Math.abs(x)<3)p.add(tk);
    ppl.push({p,b,tk,ph:r()*6,d:(xi*0.07+zi*0.12)});
  }));
  // 사장님 (앞쪽 카운터)
  const cnt=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.05,0.7),lamb(0xf2f5f7));cnt.position.set(-3.5,0.52,2.7);sc.add(cnt);
  const ctop=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.06,0.8),lamb(0x2f9a5a));ctop.position.set(-3.5,1.07,2.7);sc.add(ctop);
  const boss=makePerson(rng(77),{shirt:0x2f9a5a,pants:0x33384a});boss.position.set(-3.5,0,2.05);boss.rotation.y=0.35;sc.add(boss);
  {const h=boss.userData.head;h.children[1].material=smooth(0x9a9aa2);const ms=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.035,0.02),basic(0x6a6a72));ms.position.set(0,0.165,0.248);h.add(ms);
   for(const s of[-1,1]){const br=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.018,0.012),basic(0x6a6a72));br.position.set(s*0.09,0.33,0.236);br.rotation.z=s*-0.35;h.add(br)}}
  {const bd=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.07),basic(0xffffff));bd.position.set(0.12,0.5,0.165);boss.userData.hip.add(bd);
   const bt=canvasPlane(0.15,0.065,800,(x,w,h)=>{x.fillStyle='#1f6a3a';x.font=`900 ${h*0.72}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('사장',w/2,h/2+2)});bt.position.set(0.12,0.5,0.167);boss.userData.hip.add(bt);
   const cord=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.008,6,24,Math.PI),basic(0xe8324a));cord.rotation.z=Math.PI;cord.position.set(0,0.62,0.17);boss.userData.hip.add(cord);
   const wh=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.04,0.04),lamb(0xd8dde4));wh.position.set(0,0.44,0.19);boss.userData.hip.add(wh)}
  const cfront=canvasPlane(1.7,0.5,300,(x,w,h)=>{x.fillStyle='#2f9a5a';rr(x,0,0,w,h,16);x.fill();x.fillStyle='#fff';x.font=`900 ${h*0.42}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('ESTJ 피트니스 · 회원 등록',w/2,h/2+2)});
  cfront.position.set(-3.5,0.72,3.06);sc.add(cfront);
  const ntag=labelSprite('헬스장 사장님',{bg:'#2f9a5a',fg:'#fff',fs:60,size:0.0019,r:30});ntag.position.set(-0.55,1.55,0.2);boss.add(ntag);
  const bb=bT('…원래 1월만 이래야 되는데.',{fs:60,size:0.0019});bb.position.set(0,2.22,0);boss.add(bb);
  const sw=sweatDrop();sw.position.set(0.24,0.42,0.12);boss.userData.head.add(sw);
  const cam=new THREE.PerspectiveCamera(56,W/H,0.1,200);
  ui.innerHTML=`<div class="tag">#018</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ESTJ라면?</div>`;
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2');
  const ch=chip('1월 2일 · 새해 첫 주');ch.style.opacity=0;
  const A=LS(0,'n2a',-0.15),F=EV(0,'flip'),TK=EV(0,'ticks')[0],B=EV(0,'boss');
  const MON=[['1월 2일 · 새해 첫 주','1월','jan'],['3월','3월','mar'],['7월','7월','jul'],['12월 31일','12월','dec']];
  let curM=-1;
  return t=>{
    const out=1-ease((t-A)/0.25);
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;tag.style.opacity=out;
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t1.style.opacity=clamp01((t-0.1)/0.1)*out;
    t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t2.style.opacity=clamp01((t-0.35)/0.1)*out;
    let m=0;F.forEach((f,i)=>{if(t>=f)m=i+1});
    if(m!==curM){curM=m;win.userData.redraw(MON[m][2]);cal.userData.redraw(MON[m][1]);ch.textContent=MON[m][0]}
    if(t>=B)ch.textContent='12월 31일 · 출석률 100% ✔';
    const fk=m>0?pop((t-F[m-1])/0.25):1;
    if(t>=A){ch.style.opacity=1;ch.style.transform=`translateX(-50%) scale(${t<F[0]?pop((t-A)/0.3):t>=B?pop((t-B)/0.3):0.9+0.1*fk})`}
    for(const q of ppl){walkPose(q.p,t*7+q.ph,0.5);bub(q.b,t,0.5+q.d);scaleBubble(q.tk,pop((t-TK-q.d*0.6)/0.22)*(t<B?1:1))}
    // 사장님
    const bk=ease((t-B+0.1)/0.5);
    scaleBubble(ntag,pop((t-B+0.45)/0.25));scaleBubble(bb,pop((t-B-0.25)/0.25));sw.visible=t>B+0.4;sw.position.y=0.42-((t-B)*0.3%0.25);
    boss.userData.head.rotation.y=-0.4*bk+Math.sin(t*2)*0.05*bk;boss.rotation.y=0.35+0.25*bk;
    // 카메라: 와이드 → 달 넘길 때 살짝 흔들림 → 사장님 클로즈업
    const sh=m>0&&t<B?Math.max(0,1-(t-F[m-1])/0.3)*0.08:0;
    const wp=new THREE.Vector3(0+sh*Math.sin(t*60),4.5,10.6-Math.min(t,B)*0.12);const wl=new THREE.Vector3(0,2.1,-0.6);
    const cp=new THREE.Vector3(-2.9,2.0,5.4),cl=new THREE.Vector3(-3.45,2.15,2.0);
    cam.position.lerpVectors(wp,cp,bk);const L=new THREE.Vector3().lerpVectors(wl,cl,bk);cam.lookAt(L);
    caption(0,t);renderer.render(sc,cam);
  };
};

// ---------- S1: "언제 밥 한번 먹자"가 빈말이 아닌 세상 ----------
S[1]=()=>{
  bgEl.style.background='linear-gradient(#9fd3ff,#d6ecff 60%,#eef7ff)';
  const r=rng(1812);const sc=new THREE.Scene();addLights(sc,{hemi:1.7,dir:1.3,dpos:[5,10,8]});
  floorPlane(sc,0xa9b49a,200,200);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(200,6),lamb(0x5b5f68));road.rotation.x=-Math.PI/2;road.position.set(0,0.01,-4.2);sc.add(road);
  for(let x=-40;x<40;x+=4){const l=new THREE.Mesh(new THREE.PlaneGeometry(1.8,0.18),basic(0xf2f2f2));l.rotation.x=-Math.PI/2;l.position.set(x,0.02,-4.2);sc.add(l)}
  const walk=new THREE.Mesh(new THREE.BoxGeometry(200,0.12,9),lamb(0xd8d2c6));walk.position.set(0,0.06,1.6);sc.add(walk);
  for(let x=-30;x<30;){const w=3.5+r()*3,h=6+r()*12;const bd=makeBuilding(r,w,h,5);bd.position.set(x+w/2,bd.position.y,-10);sc.add(bd);x+=w+0.3}
  for(let x=-24;x<=24;x+=6)tree(sc,x,-1.6,1,0x6fae6a);
  // 주인공 두 사람
  const A=makePerson(rng(41),{shirt:0x6c8ebf});smileMouth(A);const B=mkWoman(rng(42),{shirt:0xe39a6b});smileMouth(B);sc.add(A,B);
  const ph=phoneIn(B,1);ph.visible=false;B.userData.arms[1].rotation.x=0;
  const ba=bT('언제 밥 한번 먹자!',{fs:62,size:0.0021}),bb=bT('언제요? 목요일 7시 어때요?',{fs:62,size:0.0021});
  ba.position.y=2.15;A.add(ba);bb.position.y=2.15;B.add(bb);
  // 거리 곳곳의 다른 사람들
  const pairs=[];const PP=[[-8.5,0.4],[-5.6,3.4],[-3.5,-0.8],[4.8,3.6],[5.6,0.0],[8.6,2.6],[-10.5,3.0],[10.6,-0.4],[-1.6,3.6],[2.4,-1.4]];
  PP.forEach(([x,z],i)=>{const p1=i%2?mkWoman(r):makePerson(r),p2=i%2?makePerson(r):mkWoman(r);smileMouth(p1);smileMouth(p2);
    p1.position.set(x-0.45,0.12,z);p2.position.set(x+0.45,0.12,z);p1.rotation.y=Math.PI/2-0.4;p2.rotation.y=-Math.PI/2+0.4;sc.add(p1,p2);
    const q=bT('언제 밥?',{fs:62,size:0.0042});q.position.y=2.25;p1.add(q);const k=tickLabel();k.scale.multiplyScalar(1.4);k.userData.base=[k.scale.x,k.scale.y];k.position.y=2.3;p2.add(k);
    pairs.push({q,k,d:i*0.11,p2})});
  const cam=new THREE.PerspectiveCamera(52,W/H,0.1,300);
  const ch=chip('PM 1:00 · 길에서 우연히');
  const cal=el(`<div class="card" style="opacity:0;top:330px"><div class="ch">캘린더<small>11월</small></div>
    <div class="rw" style="height:120px;font-size:46px"><b>✔</b><div>목 19:00 · 저녁 약속<div style="font-size:32px;color:#778;font-weight:700">강남역 2번 출구</div></div></div></div>`);
  const QA=EV(1,'ask'),QB=EV(1,'reply'),CL=EV(1,'cal'),WD=EV(1,'wide'),PS=EV(1,'pairs');
  let lastN=-1;
  return t=>{
    // 둘이 걸어와서 마주침
    const mk=ease(t/1.0);A.position.set(-2.6+1.95*mk,0.12,1.4);B.position.set(2.6-1.95*mk,0.12,1.4);
    if(mk<1){walkPose(A,t*8,0.5);walkPose(B,t*8+1,0.5);A.rotation.y=Math.PI/2;B.rotation.y=-Math.PI/2}
    else{standPose(A);standPose(B);A.rotation.y=Math.PI/2-0.5;B.rotation.y=-Math.PI/2+0.5;armUp(A,1,1);A.userData.arms[1].rotation.z=2.5+Math.sin(t*9)*0.3*(t<QA+0.8?1:0)}
    if(t>=QB-0.3){ph.visible=true;B.userData.arms[1].rotation.x=-1.4}
    bub(ba,t,QA,QB+0.2);bub(bb,t,QB,WD+0.3);
    popEl(cal,t,CL,'',WD);
    // 와이드: 거리 곳곳에서 약속 확정
    pairs.forEach(p=>{bub(p.q,t,WD+p.d,PS[0]+p.d);scaleBubble(p.k,pop((t-PS[0]-p.d)/0.22));p.p2.userData.head.rotation.x=t>WD+p.d?0.25:0});
    // 칩: 오늘 잡힌 약속 0 → 48만 건
    if(t>=WD){const k=ease((t-WD-0.2)/(PS[PS.length-1]-WD+0.4));const n=Math.round(480000*k);
      const s=n>=10000?`${Math.floor(n/10000)}만 ${String(n%10000).padStart(4,'0')}`:`${n}`;const txt=k>=1?'오늘 잡힌 약속 48만 건 ✔':`오늘 잡힌 약속 ${s}건`;
      if(txt!==ch.textContent){ch.textContent=txt}if(lastN<0){lastN=0}chipPop(ch,t,WD)}else chipPop(ch,t,0.1);
    const wk=ease((t-WD)/0.9);
    const p0=new THREE.Vector3(0,1.9,7.2),l0=new THREE.Vector3(0,1.9,1.2);const p1=new THREE.Vector3(0,7.2,13.5),l1=new THREE.Vector3(0,1.6,-0.2);
    cam.position.lerpVectors(p0,p1,wk);cam.lookAt(new THREE.Vector3().lerpVectors(l0,l1,wk));
    caption(1,t);renderer.render(sc,cam);
  };
};

// ---------- S2: 조별과제 — 다음 날 32조 제출, 교수님 멘붕 ----------
S[2]=()=>{
  bgEl.style.background='linear-gradient(#f6efe2,#fbf7ef)';
  const r=rng(1821);const sc=new THREE.Scene();addLights(sc,{hemi:1.6,dir:1.1,dpos:[-3,9,6]});
  floorPlane(sc,0xc8a77e);wallBox(sc,0xf1e6d2,-6.2);
  const wb=canvasPlane(4.6,1.6,160,(x,w,h)=>{x.fillStyle='#fdfdfd';x.fillRect(0,0,w,h);x.strokeStyle='#8a93a0';x.lineWidth=18;x.strokeRect(0,0,w,h);
    x.fillStyle='#2a4a8a';x.font=`900 ${h*0.28}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('조별과제 마감: 2주 뒤!',w/2,h*0.38);
    x.fillStyle='#e8324a';x.font=`900 ${h*0.2}px ${FONT}`;x.fillText('12월 14일 23:59',w/2,h*0.72)});
  wb.position.set(-0.6,2.9,-6.08);sc.add(wb);
  const prof=makePerson(rng(5),{shirt:0x6b5a8a,pants:0x3d3a36});prof.position.set(1.6,0,-5.2);prof.rotation.y=-0.3;sc.add(prof);
  {const h=prof.userData.head;h.children[1].material=smooth(0x8a8a90);for(const s of[-1,1]){const g=new THREE.Mesh(new THREE.TorusGeometry(0.055,0.01,8,20),basic(0x333333));g.position.set(s*0.09,0.25,0.25);h.add(g)}}
  const lap=new THREE.Group();const lb=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.03,0.42),lamb(0xb8bec8));lap.add(lb);const ls=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.4,0.02),lamb(0xb8bec8));ls.position.set(0,0.2,-0.2);lap.add(ls);
  const lsc=new THREE.Mesh(new THREE.PlaneGeometry(0.54,0.34),basic(0x9fc3ff));lsc.position.set(0,0.2,-0.188);lap.add(lsc);
  const lect=new THREE.Mesh(new THREE.BoxGeometry(1.0,1.05,0.6),lamb(0x8a6a4a));lect.position.set(1.6,0.52,-4.4);sc.add(lect);lap.position.set(1.6,1.08,-4.4);lap.rotation.y=Math.PI;sc.add(lap);
  const pb=bT('조별과제 마감은 2주 뒤예요!',{fs:60,size:0.0030});pb.position.set(-0.3,2.3,0);prof.add(pb);
  const pb2=bT('…벌써요? 2주 남았는데요?',{fs:60,size:0.0019});pb2.position.set(0,2.2,0);prof.add(pb2);
  const sw=sweatDrop();sw.position.set(0.25,0.4,0.12);prof.userData.head.add(sw);
  for(let row=0;row<4;row++){const y=row*0.35,z=-2.4+row*1.5;
    const step=new THREE.Mesh(new THREE.BoxGeometry(9,y+0.02,1.5),lamb(0xbf9c72));step.position.set(0,(y+0.02)/2,z+0.2);sc.add(step);
    const dk=new THREE.Mesh(new THREE.BoxGeometry(7.4,0.06,0.5),lamb(0xe9d8b8));dk.position.set(0,y+0.9,z-0.35);sc.add(dk);
    for(let i=0;i<6;i++){const x=-3+i*1.2;const p=(i+row)%2?mkWoman(r):makePerson(r);p.position.set(x,y,z);p.rotation.y=Math.PI;sitPose(p);sc.add(p)}}
  const cam=new THREE.PerspectiveCamera(52,W/H,0.1,100);
  const ch=chip('D-14 · 조별과제 공지');
  const mail=el(`<div class="mail" style="opacity:0"><div class="mh">받은편지함<span class="badge">0</span></div><div class="ml"></div></div>`);
  const badge=mail.querySelector('.badge'),ml=mail.querySelector('.ml');
  const COL=['#5ccf7a','#7fb7c9','#e0c070','#d98c8c','#a58cd0','#90b86c'];
  const MS=EV(2,'mails'),M0=EV(2,'mail0'),N4B=MS[MS.length-1]+0.45;let shown=0;
  return t=>{
    let n=0;MS.forEach(m=>{if(t>=m)n++});
    if(n!==shown){shown=n;badge.textContent=n;ml.innerHTML='';for(let k=n;k>=Math.max(1,n-8);k--)ml.insertAdjacentHTML('beforeend',`<div class="it"><i style="background:${COL[k%6]}"></i>${k}조 · 조별과제 제출합니다<span>오전 9:${String(k).padStart(2,'0')}</span></div>`)}
    if(t>=M0)ch.textContent='D-13 · 제출 32조 · 무임승차 0명 ✔';
    chipPop(ch,t,t>=M0?M0:0.1);
    popEl(mail,t,M0-0.15,'',N4B-0.15);
    bub(pb,t,0.4,M0-0.3);
    const ck=ease((t-N4B+0.15)/0.45);
    scaleBubble(pb2,pop((t-N4B-0.6)/0.25));sw.visible=t>N4B+0.8;sw.position.y=0.4-((t-N4B)*0.3%0.25);
    prof.userData.head.rotation.x=0.08*ck;prof.rotation.y=-0.3+0.3*ck;
    const wp=new THREE.Vector3(0,4.6,6.4-t*0.1),wl=new THREE.Vector3(0,2.4,-4.0);
    const cp=new THREE.Vector3(1.0,1.95,-2.2),cl=new THREE.Vector3(1.6,2.05,-5.2);
    cam.position.lerpVectors(wp,cp,ck);cam.lookAt(new THREE.Vector3().lerpVectors(wl,cl,ck));
    caption(2,t);renderer.render(sc,cam);
  };
};

// ---------- S3: 회식 정산 — 가게 문 나서기도 전에 10명 입금 ----------
S[3]=()=>{
  bgEl.style.background='linear-gradient(#24305a,#4a4f86 60%,#7a6f9e)';
  const r=rng(1831);const sc=new THREE.Scene();addLights(sc,{sky:0xc8d0ff,ground:0x40384a,hemi:1.25,dir:0.8,sun:0xffe2b8,dpos:[2,6,8]});
  floorPlane(sc,0x6a6878);
  const shop=new THREE.Mesh(new THREE.BoxGeometry(9,4.2,1),lamb(0x8a5a4a));shop.position.set(0,2.1,-2.6);sc.add(shop);
  const sg=canvasPlane(3.6,0.8,180,(x,w,h)=>{x.fillStyle='#ffe9a8';rr(x,0,0,w,h,24);x.fill();x.fillStyle='#8a2a1a';x.font=`900 ${h*0.56}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('원조 숯불갈비',w/2,h/2+3)});
  sg.position.set(0,3.55,-2.08);sc.add(sg);
  for(const x of[-3,3]){const wn=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),basic(0xffd98a));wn.position.set(x,1.7,-2.09);sc.add(wn)}
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.3,2.3),basic(0xffe9b8));door.position.set(0,1.15,-2.09);sc.add(door);
  const ppl=[];const POS=[[-3.2,0.2],[-2.2,0.9],[-1.2,0.1],[-0.3,1.0],[0.6,0.2],[1.5,1.0],[2.4,0.3],[3.3,1.0],[-1.7,1.9],[1.0,1.9]];
  POS.forEach(([x,z],i)=>{const p=i%2?mkWoman(r):makePerson(r);smileMouth(p);p.position.set(x,0,z-0.4);p.rotation.y=(r()-0.5)*0.4;phoneIn(p,1);sc.add(p);
    const b=bT('입금 ✔',{fs:56,size:0.0028});b.position.y=2.15;if(Math.abs(x)<1.3)p.add(b);ppl.push({p,b})});
  const cam=new THREE.PerspectiveCamera(52,W/H,0.1,100);
  const ch=chip('PM 10:12 · 회식 끝');
  const names=['김','이','박','최','정','강','조','윤','장','임'];
  const card=el(`<div class="card" style="opacity:0;top:330px"><div class="ch">회식 정산<small>방금</small></div>
   <div class="rw">총 금액<span class="r">234,500원</span></div><div class="rw">1인<span class="r">23,450원 × 10명</span></div>
   <div class="rw" style="height:auto;padding:16px 26px;flex-wrap:wrap;gap:12px">${names.map(n=>`<span class="nm" style="display:inline-flex;align-items:center;gap:6px;width:150px;font-size:36px">${n}○○ <b style="width:auto;font-size:40px;opacity:0">✔</b></span>`).join('')}</div></div>`);
  const nk=card.querySelectorAll('.nm b');
  const BL=EV(3,'bill'),PY=EV(3,'pays');
  return t=>{
    chipPop(ch,t,0.1);if(t>=PY[9]+0.3){ch.textContent='회식 끝 → 정산 완료 1분 ✔';chipPop(ch,t,PY[9]+0.3)}
    popEl(card,t,BL);
    PY.forEach((p,i)=>{nk[i].style.opacity=t>=p?1:0;nk[i].style.display='inline-block';nk[i].style.transform=`scale(${pop((t-p)/0.2)})`;bub(ppl[i].b,t,p)});
    ppl.forEach((q,i)=>{q.p.userData.head.rotation.x=0.3;q.p.position.z=POS[i][1]-0.4+Math.min(t,1.2)*0.25});
    cam.position.set(0,2.4,8.6-t*0.15);cam.lookAt(0,2.25,-0.5);
    caption(3,t);renderer.render(sc,cam);
  };
};

// ---------- S4: 연인 싸움 → 화이트보드 회의로 12분 만에 화해 ----------
S[4]=()=>{
  bgEl.style.background='linear-gradient(#ffe9d8,#fff6ee)';
  const sc=new THREE.Scene();addLights(sc,{hemi:1.6,dir:1.1,dpos:[4,9,8]});
  floorPlane(sc,0xd8b48a);wallBox(sc,0xfbeedd,-2.4);
  const lamp=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.35,0.4,12),lamb(0xffe39a));lamp.position.set(-3,2.2,-2.2);sc.add(lamp);
  const pl=new THREE.Mesh(new THREE.IcosahedronGeometry(0.5,0),lamb(0x7cbf74));pl.position.set(3.2,0.9,-1.9);sc.add(pl);
  const M=makePerson(rng(31),{shirt:0x6c8ebf,pants:0x33384a});smileMouth(M).visible=false;sc.add(M);
  const F=mkWoman(rng(32),{shirt:0xe39a6b,pants:0x55506a});smileMouth(F).visible=false;sc.add(F);
  const bdG=new THREE.Group();const frame=new THREE.Mesh(new THREE.BoxGeometry(2.7,1.8,0.06),lamb(0x9aa3ad));frame.position.y=1.75;bdG.add(frame);
  for(const s of[-1,1]){const lg=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.9,0.06),lamb(0x9aa3ad));lg.position.set(s*1.2,0.45,0);bdG.add(lg);
    const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.05,10),lamb(0x333));wh.rotation.x=Math.PI/2;wh.position.set(s*1.2,0.07,0);bdG.add(wh)}
  const LINES=[['안건: 어제 답장 3시간 늦은 건','#2a4a8a',0.15],['원인: 회의 중이었음','#333',0.15],['재발 방지: 늦으면 "회의 중" 한 줄','#e8324a',0.13]];
  const bd=canvasPlane(2.56,1.66,300,(x,w,h,k=0,sg=0)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.textAlign='left';x.textBaseline='middle';
    const tot=LINES.length;LINES.forEach((L,i)=>{const kk=clamp01(k*tot-i);if(kk<=0)return;x.save();x.beginPath();x.rect(0,0,60+kk*(w-60),h);x.clip();
      x.fillStyle=L[1];x.font=`900 ${h*L[2]*0.62}px ${FONT}`;x.fillText(L[0],50,h*(0.17+i*0.22));x.restore()});
    x.fillStyle='#555';x.font=`900 ${h*0.075}px ${FONT}`;x.fillText('서명',50,h*0.86);
    for(let i=0;i<sg;i++){x.fillStyle='#2a9a5a';x.font=`900 ${h*0.16}px ${FONT}`;x.fillText('✔',w*0.3+i*w*0.22,h*0.85)}});
  bd.position.set(0,1.75,0.04);bdG.add(bd);sc.add(bdG);
  const bm=bT('…',{fs:66,size:0.0026}),bf=bT('흥.',{fs:66,size:0.0026});bm.position.y=2.1;bf.position.y=2.1;M.add(bm);F.add(bf);
  const hs=[];for(let i=0;i<5;i++){const h=textSprite('♥',80,'#ff8fb3',0.005);sc.add(h);hs.push({h,ph:i/5,x:(i-2)*0.18})}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  const ch=chip('PM 9:00 · 냉전 중');
  const BD=EV(4,'board'),WR=EV(4,'write'),SG=EV(4,'sign'),LV=EV(4,'love');
  return t=>{
    chipPop(ch,t,0.1);if(t>=LV){ch.textContent='싸움 → 화해 12분 ✔';chipPop(ch,t,LV)}
    const bk=ease((t-BD)/0.5);bdG.position.set(3.8-3.8*bk,0,-1.2);
    const wk=clamp01((t-WR)/(SG[0]-WR-0.1));let sg=0;SG.forEach(s=>{if(t>=s)sg++});bd.userData.redraw(wk,sg);
    const lk=ease((t-LV+0.25)/0.5);
    // 처음: 서로 등지고 팔짱 → 보드 등장하면 보드 쪽으로 → 화해하면 마주 보고 가까이
    const turn=ease((t-BD-0.2)/0.4);
    M.position.set(-1.0+0.55*lk,0,0.6);F.position.set(1.0-0.55*lk,0,0.6);
    M.rotation.y=(-2.2)*(1-turn)+(Math.PI+0.5)*turn*(1-lk)+(1.2)*lk;F.rotation.y=(2.2)*(1-turn)+(Math.PI-0.5)*turn*(1-lk)+(-1.2)*lk;
    if(lk<0.5){crossArms(M);crossArms(F)}else{standPose(M);standPose(F);M.userData.arms[0].rotation.set(-0.6,0,-0.5);F.userData.arms[1].rotation.set(-0.6,0,0.5)}
    M.userData.smile.visible=F.userData.smile.visible=t>=LV;
    bub(bm,t,0.3,BD);bub(bf,t,0.55,BD);
    hs.forEach(q=>{const lt=((t-LV)*0.6+q.ph)%1;q.h.visible=t>LV;q.h.position.set(q.x,2.0+lt*1.0,0.6);const k=Math.sin(lt*Math.PI);q.h.scale.set(q.h.userData.base[0]*k,q.h.userData.base[1]*k,1)});
    const zk=ease((t-WR+0.2)/0.4)*(1-ease((t-SG[1]-0.25)/0.4));
    const p0=new THREE.Vector3(0,2.0,6.0),l0=new THREE.Vector3(0,1.75,0);const p1=new THREE.Vector3(0,1.85,3.7),l1=new THREE.Vector3(0,1.72,-1.2);
    cam.position.lerpVectors(p0,p1,zk);cam.lookAt(new THREE.Vector3().lerpVectors(l0,l1,zk));
    caption(4,t);renderer.render(sc,cam);
  };
};

// ---------- S5: 동창회 — 다들 진행, 근황 토크 1인 1분 '땡!' ----------
S[5]=()=>{
  bgEl.style.background='linear-gradient(#fff1d6,#fff9ee)';
  const r=rng(1851);const sc=new THREE.Scene();addLights(sc,{hemi:1.6,dir:1.1,dpos:[3,10,8]});
  floorPlane(sc,0xc9a27a);wallBox(sc,0xf6e7cf,-3.0);
  const ban=canvasPlane(5.2,0.8,180,(x,w,h)=>{x.fillStyle='#2f9a5a';rr(x,0,0,w,h,20);x.fill();x.fillStyle='#fff';x.font=`900 ${h*0.52}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('3학년 2반 동창회 ♥ 10주년',w/2,h/2+3)});
  ban.position.set(0,3.4,-2.88);sc.add(ban);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(7.6,0.08,1.3),lamb(0xffffff));tb.position.set(0,0.9,0);sc.add(tb);
  const tl=new THREE.Mesh(new THREE.BoxGeometry(7.4,0.86,1.1),lamb(0xe8d6bc));tl.position.set(0,0.45,0);sc.add(tl);
  for(let i=0;i<10;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.16,10),lamb(0xffd98a));c.position.set(-3.3+i*0.73,1.02,(i%2?0.3:-0.3));sc.add(c)}
  const back=[],front=[];
  for(let i=0;i<7;i++){const x=-3.0+i*1.0;const p=i%2?mkWoman(r):makePerson(r);smileMouth(p);p.position.set(x,0,-1.05);sitPose(p);sc.add(p);back.push(p)}
  for(let i=0;i<7;i++){const x=-3.0+i*1.0;const p=i%2?makePerson(r):mkWoman(r);p.position.set(x,0,1.05);p.rotation.y=Math.PI;sitPose(p);sc.add(p);front.push(p)}
  // 진행 담당: 왼쪽 끝 마이크, 오른쪽 끝 순서표, 타이머
  const mc=makePerson(rng(9),{shirt:0x2f9a5a});smileMouth(mc);mc.position.set(-4.4,0,-0.2);mc.rotation.y=0.9;sc.add(mc);
  const mic=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.02,0.22,8),lamb(0x333));mic.position.set(0,-0.62,0.1);mic.rotation.x=-0.8;mc.userData.arms[1].add(mic);mc.userData.arms[1].rotation.x=-1.9;
  const cl=mkWoman(rng(10),{shirt:0xa58cd0});smileMouth(cl);cl.position.set(4.4,0,-0.2);cl.rotation.y=-0.9;sc.add(cl);
  const clip=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.4,0.03),lamb(0xd9b48a));clip.position.set(0,-0.62,0.12);clip.rotation.x=-1.0;cl.userData.arms[0].add(clip);cl.userData.arms[0].rotation.x=-1.2;
  const bmc=bT('다음 분!',{fs:60,size:0.0026});bmc.position.y=2.15;mc.add(bmc);
  const sp=bT('저는 요즘…',{fs:60,size:0.0026});sc.add(sp);
  const ding=labelSprite('땡!',{bg:'#ffd84d',fg:'#7a4a00',fs:90,size:0.006,r:60});ding.position.set(0,3.0,0);sc.add(ding);
  const cam=new THREE.PerspectiveCamera(52,W/H,0.1,100);
  const ch=chip('PM 7:00 · 근황 토크');ch.style.top='230px';
  const tm=el(`<div class="timer" style="top:340px">00:52</div>`);
  const D1=EV(5,'ding'),D2=EV(5,'ding2');
  return t=>{
    chipPop(ch,t,0.1);if(t>=D2){ch.textContent='근황 토크 30명 · 30분 정각 종료 ✔';chipPop(ch,t,D2)}
    // 타이머
    if(t<D1){const s=Math.min(59,52+Math.floor((t/D1)*8));tm.textContent='00:'+String(s).padStart(2,'0');tm.style.color='#7dffa6'}
    else if(t<D1+0.9){tm.textContent='01:00';tm.style.color='#ff6b7a'}
    else if(t<D2){const k=clamp01((t-D1-0.9)/(D2-D1-0.9));const n=2+Math.floor(k*28.99);tm.textContent=`${n}/30`;tm.style.color='#7dffa6'}
    else{tm.textContent='30/30 · 30:00';tm.style.color='#ffd84d';tm.style.fontSize='96px'}
    popEl(tm,t,0.2,'translateX(-50%) ');
    // 발표자: 1회차는 뒷줄 3번, 그다음엔 순서대로 빠르게
    let idx=2;if(t>=D1+0.9&&t<D2){const k=clamp01((t-D1-0.9)/(D2-D1-0.9));idx=3+Math.floor(k*11)%11}else if(t>=D2)idx=-1;
    const all=back.concat(front);
    all.forEach((p,i)=>{const u=p.userData;const on=(i<7?i:i)===idx;
      if(on){standPose(p);u.hip.position.y=0.8;u.arms[1].rotation.x=-0.9;u.arms[1].rotation.z=-0.3}else{sitPose(p)}
      const laugh=(t>=D1&&t<D1+0.9)||(t>=D2&&t<D2+1.0);if(laugh){u.arms.forEach((a,j)=>{a.rotation.x=-2.7;a.rotation.z=(j?0.35:-0.35)});u.head.rotation.x=-0.25+Math.sin(t*30)*0.05}else u.head.rotation.x=0});
    if(idx>=0){const p=all[idx];sp.position.set(p.position.x,2.25,p.position.z);scaleBubble(sp,t<D1?pop((t-0.4)/0.22):1)}else scaleBubble(sp,0);
    if(t>=D1+0.9)setBubble(sp,'저는 요즘…',{...TB,fs:60,size:0.0026});
    scaleBubble(ding,(t>=D1&&t<D1+0.9?pop((t-D1)/0.2):0)+(t>=D2&&t<D2+1.2?pop((t-D2)/0.2):0));
    bub(bmc,t,D1+0.3,D1+1.4);
    cam.position.set(0,4.2,7.6-t*0.12);cam.lookAt(0,2.35,0);
    caption(5,t);renderer.render(sc,cam);
  };
};

// ---------- S6: 태풍 — 약속 정각에 전원 도착, 늦은 건 태풍뿐 ----------
S[6]=()=>{
  bgEl.style.background='linear-gradient(#56647e,#8796ad 60%,#a9b5c6)';
  const r=rng(1861);const sc=new THREE.Scene();sc.fog=new THREE.Fog(0x8f9db2,10,40);addLights(sc,{sky:0xd8e0ee,ground:0x404858,hemi:1.4,dir:0.6,dpos:[2,8,6]});
  floorPlane(sc,0x6e7686);
  const plaza=new THREE.Mesh(new THREE.CircleGeometry(4.5,40),lamb(0x8a92a2));plaza.rotation.x=-Math.PI/2;plaza.position.y=0.01;sc.add(plaza);
  for(let i=0;i<10;i++){const b=makeBuilding(r,3+r()*2,6+r()*8,3,{wall:'#9aa3b4',lit:0.15});b.position.set(-14+i*3.2,b.position.y,-12-r()*3);sc.add(b)}
  const trees=[];for(const x of[-5.5,5.5]){const t0=new THREE.Group();const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.14,1.6,6),lamb(0x6a5a4c));tr.position.y=0.8;t0.add(tr);
    const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(0.9,0),lamb(0x5f8f6a));cr.position.y=2.1;t0.add(cr);t0.position.set(x,0,-2.5);sc.add(t0);trees.push(t0)}
  // 시계 기둥
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,3.2,10),lamb(0x3a4050));pole.position.set(0,1.3,-1.6);pole.scale.y=0.8;sc.add(pole);
  const clk=canvasPlane(1.3,1.3,200,(x,w,h,mm=0)=>{x.fillStyle='#fff';x.beginPath();x.arc(w/2,h/2,w*0.48,0,7);x.fill();x.strokeStyle='#3a4050';x.lineWidth=w*0.05;x.stroke();
    x.strokeStyle='#333';x.lineCap='round';const a1=(2/12+mm/720)*Math.PI*2,a2=mm/60*Math.PI*2;x.lineWidth=w*0.05;x.beginPath();x.moveTo(w/2,h/2);x.lineTo(w/2+Math.sin(a1)*w*0.22,h/2-Math.cos(a1)*w*0.22);x.stroke();
    x.lineWidth=w*0.03;x.beginPath();x.moveTo(w/2,h/2);x.lineTo(w/2+Math.sin(a2)*w*0.34,h/2-Math.cos(a2)*w*0.34);x.stroke()});
  clk.position.set(0,2.75,-1.5);sc.add(clk);
  const ppl=[];const N=9;
  for(let i=0;i<N;i++){const p=makePerson(r,{shirt:0xffd23f,pants:0x3d4a5c});const h=p.userData.head;h.children[1].visible=false;
    const hood=new THREE.Mesh(new THREE.SphereGeometry(0.29,32,16,0,Math.PI*2,0,Math.PI*0.6),smooth(0xffd23f));hood.position.y=0.25;hood.rotation.x=-0.35;h.add(hood);
    p.userData.arms.forEach(a=>a.children[0].material=lamb(0xffd23f));
    const side=i%2?1:-1;const ang=-Math.PI*0.85+i*(Math.PI*0.7/(N-1));const tx=Math.cos(ang+Math.PI/2)*2.6*(i%2?1:1),tz=-1.6+Math.abs(Math.sin(ang+Math.PI/2))*0+(i%3)*0.6+0.4;
    const fx=-0.5*Math.PI;const ex=(i-(N-1)/2)*0.85,ez=0.2+(i%3)*0.75;const sx=ex+side*9,sz=ez+1.2;
    let um=null;if(i%3===0){um=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.9,6),lamb(0x333));st.position.y=0.45;um.add(st);
      const cn=new THREE.Mesh(new THREE.ConeGeometry(0.55,0.4,8,1,true),new THREE.MeshLambertMaterial({color:[0xe8324a,0x3b6fd8,0x7a5ad8][i%3===0?(i/3)%3:0],side:THREE.DoubleSide,flatShading:true}));cn.position.y=1.0;um.add(cn);
      um.position.set(0,-0.6,0.05);um.rotation.x=Math.PI*0.95;p.userData.arms[1].add(um);}
    const dots=bT('…',{fs:64,size:0.0028});dots.position.y=2.15;p.add(dots);
    sc.add(p);ppl.push({p,sx,sz,ex,ez,dots,um,d:r()*0.4})}
  // 비
  const RN=900;const rg=new THREE.BufferGeometry();const rp=new Float32Array(RN*6);const rs0=[];
  for(let i=0;i<RN;i++){rs0.push([(r()-0.5)*18,r()*9,(r()-0.5)*14+0])}
  rg.setAttribute('position',new THREE.BufferAttribute(rp,3));const rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xdde6f5,transparent:true,opacity:0.55}));sc.add(rain);
  const cam=new THREE.PerspectiveCamera(54,W/H,0.1,100);
  const news=el(`<div class="news"><div class="lv">속보</div><div class="tt"><b>날씨</b>태풍 북상 · 외출 자제</div></div>`);
  const news2=el(`<div class="news" style="opacity:0;top:250px;height:330px;background:linear-gradient(#3b5a8a,#24365a)"><div class="lv">LIVE</div><div class="tt" style="font-size:44px"><b>기상</b>태풍, 예보보다 10분 늦게 상륙</div></div>`);
  const ch=chip('PM 1:55 · 약속 장소');ch.style.opacity=0;
  const NA=LS(6,'n8a'),ARR=LS(6,'n8a')+1.9,NW=EV(6,'news');
  return t=>{
    popEl(news,t,0.05,'',NA+0.3);popEl(news2,t,NW,'');
    const mm=Math.min(0,-5+5*clamp01((t-NA)/(ARR-NA)));clk.userData.redraw(60+mm);
    if(t>=NA+0.3){ch.style.opacity=1;if(t<ARR){ch.textContent='PM 1:5'+(5+Math.floor(4.99*clamp01((t-NA)/(ARR-NA))))+' · 약속 장소';ch.style.transform='translateX(-50%) scale(1)'}
      else if(t<NW){ch.textContent='PM 2:00 · 약속 취소 0건 ✔';chipPop(ch,t,ARR)}else{ch.textContent='지각: 태풍 1건';chipPop(ch,t,NW+0.6)}}
    ppl.forEach(q=>{const k=ease((t-NA-q.d+0.2)/(ARR-NA-0.3));q.p.position.set(q.sx+(q.ex-q.sx)*k,0,q.sz+(q.ez-q.sz)*k);
      const walking=k>0&&k<1;if(walking){walkPose(q.p,t*9,0.6);q.p.rotation.y=Math.atan2(q.ex-q.sx,q.ez-q.sz)}else{standPose(q.p);q.p.rotation.y=k>=1?(t>NW?Math.PI*0.0:0):Math.atan2(q.ex-q.sx,q.ez-q.sz)}
      if(q.um){q.p.userData.arms[1].rotation.x=-2.6;q.p.userData.arms[1].rotation.z=0.2+Math.sin(t*7+q.d*9)*0.15}
      const look=ease((t-NW-0.3)/0.4);q.p.userData.head.rotation.x=-0.5*look;if(look>0.5&&!q.um)crossArms(q.p);else if(look>0.5){q.p.userData.arms[0].rotation.set(-1.35,0,0.95)}
      bub(q.dots,t,NW+0.6+q.d*0.5);q.p.userData.hip.rotation.z=walking?Math.sin(t*3)*0.04+0.06:0.04});
    trees.forEach((tr,i)=>{tr.rotation.z=0.18+Math.sin(t*3+i)*0.08});
    for(let i=0;i<RN;i++){const s=rs0[i];const y=((s[1]-t*14)%9+9)%9;const x=s[0]+(9-y)*0.25;rp.set([x,y,s[2],x+0.12,y+0.5,s[2]],i*6)}rg.attributes.position.needsUpdate=true;
    const sh=Math.sin(t*17)*0.02;
    cam.position.set(0+sh,3.0,9.4-t*0.15);cam.lookAt(0,2.25,-0.5);
    caption(6,t);renderer.render(sc,cam);
  };
};

// ---------- S7: 질문 장면 — 밤 동네, 수첩 든 3명 ----------
S[7]=()=>{
  bgEl.style.background='linear-gradient(#1c2350,#3a3f7a 55%,#6a5f96)';
  const r=rng(1871);const sc=new THREE.Scene();addLights(sc,{sky:0xb8c0ff,ground:0x40384a,hemi:1.3,dir:0.8,sun:0xffe2b8,dpos:[-4,6,8]});
  floorPlane(sc,0x5a6a5e);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(40,3),lamb(0x8a8e9a));road.rotation.x=-Math.PI/2;road.position.set(0,0.01,0.6);sc.add(road);
  for(let i=0;i<6;i++){const h=makeHouse(r,{w:2.2+r()*0.6,h:1.8+r()*0.6});h.position.set(-6.5+i*2.6,0,-2.8-(i%2)*0.6);sc.add(h)}
  stars(sc,180,r,{y0:6,h:14,z:-20,w:40});
  const moon=glowSprite('rgba(255,246,216,1)',2.2);moon.position.set(3.5,7.5,-12);sc.add(moon);
  const ppl=[];[[-1.1,0],[0,0.3],[1.1,0]].forEach(([x,z],i)=>{const p=i===1?mkWoman(r,{shirt:0x5ccf7a}):makePerson(r);smileMouth(p);p.position.set(x,0,z+0.6);p.rotation.y=(1-i)*0.15;sc.add(p);
    const b=bT('✔',{fs:70,size:0.0034});b.position.y=2.15;p.add(b);ppl.push({p,b,i})});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out" style="font-size:100px">여러분 주변의<br><span style="color:${C_T}">ESTJ</span>는<br>어떤가요?</div><div class="end2 out" style="top:860px">댓글에 ESTJ 친구를 태그해 주세요!</div><div class="end3 out" style="top:1530px">다음 본편은? 신청소에서 골라 주세요</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2'),e3=ui.querySelector('.end3');
  const T2=LS(7,'n9',2.3);
  return t=>{
    ppl.forEach(q=>{armUp(q.p,1,1);q.p.userData.arms[1].rotation.z=2.55+Math.sin(t*8+q.i)*0.35;q.p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*5+q.i))*0.04;bub(q.b,t,0.4+q.i*0.12)});
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    e2.style.transform=`scale(${pop((t-T2)/0.3)})`;e2.style.opacity=clamp01((t-T2)/0.1);
    e3.style.transform=`scale(${pop((t-T2-0.8)/0.3)})`;e3.style.opacity=clamp01((t-T2-0.8)/0.1);
    cam.position.set(0,1.4,7.4-t*0.12);cam.lookAt(0,2.85,0);
    renderer.render(sc,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';bgEl.style.background='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
