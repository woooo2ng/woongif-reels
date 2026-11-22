// ---------- ISTJ 좀비편 전용 ----------
const SK='#dcebff',SKF='#23395b';
function bubJ(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||SK,fg:o.fg||SKF,fs:o.fs||64,size:o.size||0.0026}))}
const JC=[0x3d4a66,0x5a6478,0x2f3a52,0x6b7a90,0x4a5670];
function istj(r,o={}){const p=addFace(makePerson(r,{shirt:o.shirt??pick(r,JC),pants:o.pants??0x2c3448,hair:o.hair??0x1d1d24}));setFace(p,false);
  // 셔츠 깃 + 넥타이 (반듯한 출근 차림)
  const u=p.userData;const col=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.1,0.02),lamb(0xf4f4f4));col.position.set(0,0.6,0.165);u.hip.add(col);
  const tie=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.34,0.02),lamb(o.tie??0x3f6fb5));tie.position.set(0,0.4,0.172);u.hip.add(tie);return p}
function clerk(r){const p=addFace(makePerson(r,{shirt:0xb9a8d8,pants:0x3a3448,hair:0x2a201c}));setFace(p,false);const h=p.userData.head;
  const bun=new THREE.Mesh(new THREE.SphereGeometry(0.12,32,20),smooth(0x2a201c));bun.position.set(0,0.44,-0.14);h.add(bun);
  const tag=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.07,0.02),lamb(0xffffff));tag.position.set(0.12,0.48,0.17);p.userData.hip.add(tag);
  // 안경
  for(const s of[-1,1]){const g=new THREE.Mesh(new THREE.TorusGeometry(0.055,0.01,6,16),basic(0x2a2a2a));g.position.set(s*0.09,0.25,0.25);h.add(g)}return p}
const TKC={};
function tkTex(n){return TKC[n]||(TKC[n]=canvasTex(128,200,(c,w,h)=>{c.fillStyle='#ffffff';c.fillRect(0,0,w,h);c.fillStyle='#e2332d';c.fillRect(0,0,w,34);c.fillStyle='#fff';c.font=`900 22px ${FONT}`;c.textAlign='center';c.fillText('번호표',w/2,25);
  c.fillStyle='#222';c.font=`900 ${String(n).length>3?40:62}px ${FONT}`;c.fillText(n,w/2,120);c.fillStyle='#999';c.font=`700 16px ${FONT}`;c.fillText('감염 접수',w/2,175)}))}
function ticket(p,n){const u=p.userData;if(!u.tk){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.14,0.22),new THREE.MeshBasicMaterial({map:tkTex(n),side:THREE.DoubleSide}));u.arms[1].add(m);m.position.set(0,-0.68,0.1);m.rotation.x=-1.4;u.tk=m}
  else u.tk.material.map=tkTex(n);return u.tk}
const DPC={};
function dispTex(cur,lab='현재 번호'){const k=cur+lab;return DPC[k]||(DPC[k]=canvasTex(512,256,(c,w,h)=>{c.fillStyle='#1b1d26';c.fillRect(0,0,w,h);c.strokeStyle='#3b3f4f';c.lineWidth=12;c.strokeRect(6,6,w-12,h-12);
  c.fillStyle='#9aa3b8';c.font=`800 40px ${FONT}`;c.textAlign='center';c.fillText(lab,w/2,64);c.fillStyle='#ff4a3a';c.font=`900 ${String(cur).length>3?120:140}px ${FONT}`;c.fillText(cur,w/2,200)}))}
function display(sc,x,y,z,cur,s=1){const m=new THREE.Mesh(new THREE.BoxGeometry(1.4*s,0.7*s,0.1),[lamb(0x2a2a33),lamb(0x2a2a33),lamb(0x2a2a33),lamb(0x2a2a33),new THREE.MeshBasicMaterial({map:dispTex(cur)}),lamb(0x2a2a33)]);m.position.set(x,y,z);sc.add(m);
  m.userData.set=n=>{m.material[4].map=dispTex(n);m.userData.n=n};m.userData.n=cur;return m}
function tMachine(sc,x,z,ry=0){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,1.25,0.32),lamb(0xe8ecf2));b.position.y=0.62;g.add(b);
  const top=new THREE.Mesh(new THREE.BoxGeometry(0.52,0.18,0.34),lamb(0x3f6fb5));top.position.y=1.32;g.add(top);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.24),new THREE.MeshBasicMaterial({map:canvasTex(256,180,(c,w,h)=>{c.fillStyle='#d8ecff';c.fillRect(0,0,w,h);c.fillStyle='#23395b';c.font=`900 44px ${FONT}`;c.textAlign='center';c.fillText('감염 접수',w/2,74);c.fillStyle='#3f6fb5';c.fillRect(48,104,w-96,52);c.fillStyle='#fff';c.font=`900 32px ${FONT}`;c.fillText('번호표 ▶',w/2,141)})}));scr.position.set(0,0.98,0.165);g.add(scr);
  const slot=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.03,0.04),lamb(0x222228));slot.position.set(0,0.7,0.17);g.add(slot);
  const lab=labelSprite('감염 접수',{fs:64,bg:'#3f6fb5',fg:'#fff',size:0.0042});lab.position.set(0,1.72,0);g.add(lab);
  g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);return g}
function chairRow(sc,x0,x1,z,n,col=0x6f8fb5){const out=[];for(let i=0;i<n;i++){const x=x0+(x1-x0)*i/(n-1);const c=new THREE.Group();
  const s=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.08,0.48),lamb(col));s.position.y=0.44;c.add(s);const bk=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.06),lamb(col));bk.position.set(0,0.72,-0.22);c.add(bk);
  const lg=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.44,0.06),lamb(0x55555f));for(const a of[-0.2,0.2])for(const b2 of[-0.18,0.18]){const l=lg.clone();l.position.set(a,0.22,b2);c.add(l)}
  c.position.set(x,0,z);sc.add(c);out.push([x,z])}return out}
function seatZ(p,x,z,ry=0){p.position.set(x,-0.12,z+0.05);p.rotation.y=ry;sitPose(p)}
const face=(p,x,z)=>{p.rotation.y=Math.atan2(x-p.position.x,z-p.position.z)};
function walkTo(p,a,b,k,t,zomb=true){p.position.set(a[0]+(b[0]-a[0])*ease(k),0,a[1]+(b[1]-a[1])*ease(k));if(k<1)p.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);
  if(zomb)zPose(p,t,k>0&&k<1?1:0);else if(k>0&&k<1)walkPose(p,t*8,0.5);else standPose(p)}
function cutFlash(el,t,ts){el.style.background=`rgba(255,255,255,${0.7*clamp01(1-(t-ts)/0.15)*(t>=ts?1:0)})`}
function pointAt(p,side,k){const a=p.userData.arms[side];a.rotation.x=-1.55*k;a.rotation.z=(side?0.9:-0.9)*k}
function titleEls(){ui.insertAdjacentHTML('beforeend',`<div class="tag">ISTJ × 좀비편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ISTJ인데</div><div class="title3 out">좀비 사태가 터진다면?</div>`);
  const E=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return (t,TA)=>{const T0=0.05,out=clamp01((t-TA+0.25)/0.25),os=1-out;const [tag,t1,t2,t3]=E;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.7)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.7)/0.1)*os}}
function playground(sc){
  const g=new THREE.Group();
  // 미끄럼틀
  const plat=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.12,1.2),lamb(0xf2c24d));plat.position.set(0,1.6,0);g.add(plat);
  for(const a of[-0.5,0.5])for(const b of[-0.5,0.5]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,1.6,8),lamb(0xe2553a));p.position.set(a,0.8,b);g.add(p)}
  const sl=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.08,2.6),lamb(0x5ab0e8));sl.position.set(0,0.82,1.65);sl.rotation.x=0.62;g.add(sl);
  const rf=new THREE.Mesh(new THREE.ConeGeometry(1.0,0.8,4),lamb(0xe2553a));rf.position.set(0,2.5,0);rf.rotation.y=Math.PI/4;g.add(rf);
  // 그네
  const sw=new THREE.Group();for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.2,0.1),lamb(0x6a8fc0));p.position.set(s*1.3,1.1,0);sw.add(p)}
  const bar=new THREE.Mesh(new THREE.BoxGeometry(2.8,0.1,0.1),lamb(0x6a8fc0));bar.position.y=2.2;sw.add(bar);
  for(const x of[-0.6,0.6]){const seat=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.06,0.25),lamb(0xf2c24d));seat.position.set(x,0.55,0);sw.add(seat);for(const s of[-1,1]){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.02,1.62,0.02),lamb(0x888888));ch.position.set(x+s*0.22,1.38,0);sw.add(ch)}}
  sw.position.set(-3.6,0,-0.6);g.add(sw);
  const sand=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.15,1.6),lamb(0xe8d6a8));sand.position.set(3.2,0.07,0.4);g.add(sand);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(10,6),lamb(0xd8a070));fl.rotation.x=-Math.PI/2;fl.position.set(0,0.01,0);g.add(fl);
  sc.add(g);return g}
function windowTex(){return canvasTex(512,384,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#5a6aa8');g.addColorStop(0.7,'#f2b8a0');g.addColorStop(1,'#f6d2a8');c.fillStyle=g;c.fillRect(0,0,w,h);
  c.fillStyle='#8a90b0';for(let i=0;i<5;i++)c.fillRect(i*110,h-160-(i%2)*60,90,200);
  c.fillStyle='#7f9a6a';c.fillRect(0,h-40,w,40);
  for(let i=0;i<6;i++){const x=40+i*80,y=h-40;c.fillStyle='#6f8f5f';c.fillRect(x-9,y-46,18,40);c.beginPath();c.arc(x,y-56,11,0,7);c.fill();c.fillRect(x+6,y-40,20,6)}
  c.strokeStyle='#f6f2ea';c.lineWidth=14;c.strokeRect(7,7,w-14,h-14);c.beginPath();c.moveTo(w/2,0);c.lineTo(w/2,h);c.stroke()})}
function clockTex(s,on){return canvasTex(256,128,(c,w,h)=>{c.fillStyle='#202028';c.fillRect(0,0,w,h);c.fillStyle=on?'#ff5040':'#5a2020';c.font=`900 92px ${FONT}`;c.textAlign='center';c.fillText(s,w/2,100)})}
function lobbyWall(){return canvasTex(1024,512,(c,w,h)=>{c.fillStyle='#e9e4dc';c.fillRect(0,0,w,h);c.fillStyle='#d8d0c4';c.fillRect(0,h-90,w,90);
  // 게시판 + 안내문
  c.fillStyle='#b89a6a';c.fillRect(30,100,420,240);c.fillStyle='#f2e6c8';c.fillRect(42,112,396,216);
  const P=[['#ffffff','전입신고 안내'],['#dff0ff','민원 서류 발급'],['#ffe4e4','좀비 사태 행동 요령'],['#fff4c8','번호표를 뽑아 주세요']];
  P.forEach(([col,tx],i)=>{const x=56+(i%2)*190,y=126+Math.floor(i/2)*100;c.fillStyle=col;c.fillRect(x,y,176,86);c.fillStyle='#333';c.font=`800 22px ${FONT}`;c.fillText(tx,x+10,y+48)});
  c.fillStyle='#3f6fb5';c.font=`900 56px ${FONT}`;c.fillText('행복동 주민센터',520,130);c.fillStyle='#777';c.font=`700 30px ${FONT}`;c.fillText('민원 접수 09:00 ~ 18:00',520,180)})}

// ===== 0. 새벽 단지 놀이터 좀비 떼(타이틀) → 재난문자 → 07:00 알람, 기상 → 창밖 좀비 → 플래너 =====
S[0]=()=>{
  const E=EV(0);const r=rng(701);
  const sA=new THREE.Scene();sA.add(new THREE.HemisphereLight(0xd8d0f0,0x5a5068,1.5));{const d=new THREE.DirectionalLight(0xffc8a0,1.0);d.position.set(-8,5,6);sA.add(d)}
  ground(sA,0x7a866e,300);
  for(let i=0;i<5;i++){const b=makeBuilding(r,5,16+r()*5,4,{wall:pick(r,['#cfc6d8','#d8cfc4','#c4ccd8']),win:'#4a5470',lit:0.3});b.position.set(-12+i*6,b.position.y,-11);sA.add(b)}
  playground(sA);
  const hz=[];for(let i=0;i<11;i++){const z=zombie(r);const x=-4.6+r()*9.2,zz=-2.4+r()*4.4;z.position.set(x,0,zz);sA.add(z);hz.push({z,x,zz,ph:r()*6,ry:r()*6.28})}
  for(let i=0;i<6;i++){tree(sA,-7+i*2.8+r(),-5.5-r(),0.9+r()*0.4)}
  // B: 침실
  const sB=new THREE.Scene();sB.add(new THREE.HemisphereLight(0xe8e6f8,0x6a6070,1.5));{const d=new THREE.DirectionalLight(0xffd0b0,0.8);d.position.set(0,4,-2);sB.add(d)}
  room(sB,{wall:0xdfe6ee,wall2:0xd2dbe6,floor:0xb89a7a});
  bed(sB,-0.6,-1.2);const bl=new THREE.Mesh(new THREE.BoxGeometry(1.46,0.22,1.5),lamb(0x8fb0d8));bl.position.set(-0.6,0.64,-0.4);sB.add(bl);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.5),new THREE.MeshBasicMaterial({map:windowTex()}));win.position.set(1.0,1.9,-3.18);sB.add(win);
  const ns=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,0.5),lamb(0x8a6a4e));ns.position.set(0.55,0.3,-2.1);sB.add(ns);
  const ck=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.22,0.16),lamb(0x202028));ck.position.set(0.55,0.72,-2.05);sB.add(ck);
  const ckS=new THREE.Mesh(new THREE.PlaneGeometry(0.38,0.18),new THREE.MeshBasicMaterial({map:clockTex('07:00',true)}));ckS.position.set(0.55,0.72,-1.965);sB.add(ckS);
  const ckOff=new THREE.MeshBasicMaterial({map:clockTex('07:00',false)}),ckOn=ckS.material;
  // 옷걸이: 내일 입을 셔츠가 반듯하게
  const rack=new THREE.Mesh(new THREE.BoxGeometry(0.06,1.8,0.06),lamb(0x6a6a72));rack.position.set(-2.4,0.9,-2.6);sB.add(rack);
  const shirt=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.75,0.08),lamb(0xf4f4f4));shirt.position.set(-2.4,1.25,-2.5);sB.add(shirt);
  const me=istj(rng(11),{shirt:0xe8eef6,pants:0x8fa0c0});sB.add(me);me.userData.hip.children.slice(-2).forEach(m=>m.visible=false); // 잠옷이라 넥타이 없음
  const fl=div('flash');const tUpd=titleEls();
  const al=div('alertb','<div class="h"><i>긴급재난문자</i> 지금</div><div class="m">[행정안전부] 좀비 사태 발생. 전 국민 외출을 금지합니다.</div>');al.style.top='200px';
  const bP=bubJ(me,'…!',{y:1.65,size:0.0024,fs:72});
  const plan=div('plan',`<div class="rings"><b></b><b></b><b></b><b></b></div><h2>11월 23일 (월)</h2><h1>오늘 일정</h1>
   <p class="done"><i>07:00</i>기상 ✔</p><p><i>07:30</i>출근</p><p><i>12:00</i>점심</p><p><i>19:00</i>헬스</p><p class="zz"><i>??:??</i>좀비 사태</p>`);plan.style.top='290px';
  const rows=[...plan.querySelectorAll('p')];
  const ch=chip('일정에 없던 일 발생',180);ch.style.background='#e2332d';ch.style.color='#fff';
  const vig=div('vig');
  const C=cam(50);
  return t=>{
    const TA=E.alert,TAl=E.alarm,TW=E.wake,TL=E.look,TP=E.plan;
    hz.forEach((q,i)=>{const s=t*0.35+q.ph;q.z.position.set(q.x+Math.sin(s)*0.6,0,q.zz+Math.cos(s*0.8)*0.4);q.z.rotation.y=q.ry+Math.sin(s*0.5)*0.8;zPose(q.z,t,0.8)});
    let mode=t<TAl?'A':t<TP?'B':'C';
    if(mode==='A'){const k=ease(t/TAl);C.fov=50;C.position.set(0.7,3.9+k*0.3,11.8-k*2.0);C.lookAt(0.3,2.3,-3);C.updateProjectionMatrix();setSky('#3b4172','#f0b9a0 85%');renderer.render(sA,C)}
    else{
      // 알람 → 일어나 앉음 → 창밖을 봄
      const blink=t<TW+0.6&&Math.floor((t-TAl)*4)%2===0;ckS.material=blink?ckOff:ckOn;ck.position.x=0.55+(t<TW+0.5?Math.sin(t*60)*0.01:0);ckS.position.x=ck.position.x;
      const kw=ease((t-TW)/0.5);const u=me.userData;
      if(kw<=0){me.rotation.set(-Math.PI/2,0,0);me.position.set(-0.6,0.72,-1.55);standPose(me)}
      else{me.rotation.set(-Math.PI/2*(1-kw),0,0);me.position.set(-0.6,0.42+0.3*(1-kw),-1.55+kw*0.55);sitPose(me);u.legs.forEach(l=>l.rotation.x=-Math.PI/2*kw);u.hip.position.y=0.56}
      const kl=ease((t-TL)/0.35);u.head.rotation.y=-0.9*kl;u.head.rotation.x=-0.1*kl;me.rotation.y=-0.5*kl*kw;
      bl.position.z=-0.4+kw*0.3;bl.scale.z=1-kw*0.2;
      show(bP,t,TL+0.05,TP);
      if(t<TW){C.fov=38;C.position.set(0.55,1.15,-0.5);C.lookAt(0.55,0.75,-2.05)}
      else{const k=ease((t-TW)/2.5);C.fov=52;C.position.set(-0.3,2.0,3.0-k*0.4);C.lookAt(0.1,1.2,-2.4)}
      C.updateProjectionMatrix();setSky('#3a3a50','#3a3a50');renderer.render(sB,C)}
    tUpd(t,TA);
    sh(al,t>=TA&&t<TAl+0.05);if(t>=TA){const k=ease((t-TA)/0.25);const shk=t<TA+0.5?Math.sin((t-TA)*70)*10*(1-(t-TA)/0.5):0;al.style.transform=`translateY(${(1-k)*-300}px) translateX(${shk}px)`}
    vig.style.opacity=mode==='A'?0.35:0;
    cutFlash(fl,t,TAl);if(t>=TP)cutFlash(fl,t,TP);
    sh(plan,mode==='C');if(mode==='C'){const k=ease((t-TP)/0.3);plan.style.transform=`translateY(${(1-k)*1200}px) rotate(${-2*(1-k)}deg)`;
      rows.forEach((p,i)=>{const t0=TP+0.25+i*0.18+(i===4?0.9:0);p.style.opacity=clamp01((t-t0)/0.12);p.style.transform=i===4?`scale(${pop((t-t0)/0.3)}) translateX(${t>t0&&t<t0+0.5?Math.sin((t-t0)*60)*8:0}px)`:''})}
    const tc=TP+1.35;chipPop(ch,t,tc);ch.style.opacity=t>tc&&mode==='C'?1:0;
    if(mode==='C'){renderer.setClearColor(0x000000,0)}
    caption(0,t)};
};

// ===== 1. 로비: 유리문 쾅 → 좀비 돌진 → '번호표 뽑으세요' → 대기 의자에 번호표 든 좀비들 → 번호표 뽑고 앉음 =====
S[1]=()=>{
  const E=EV(1);const r=rng(711);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xf4f6ff,0x8a8478,1.7));{const d=new THREE.DirectionalLight(0xffffff,0.7);d.position.set(2,6,5);sc.add(d)}
  const fl0=new THREE.Mesh(new THREE.PlaneGeometry(14,12),lamb(0xcfc8bc));fl0.rotation.x=-Math.PI/2;sc.add(fl0);
  for(let i=-6;i<=6;i++){const ln=new THREE.Mesh(new THREE.PlaneGeometry(0.02,12),basic(0xbab2a4));ln.rotation.x=-Math.PI/2;ln.position.set(i,0.002,0);sc.add(ln)}
  const back=new THREE.Mesh(new THREE.PlaneGeometry(10,4.2),new THREE.MeshLambertMaterial({map:lobbyWall()}));back.position.set(-1,2.1,-4);sc.add(back);
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(10,4.2),lamb(0xe2dcd2));rw.rotation.y=-Math.PI/2;rw.position.set(4,2.1,1);sc.add(rw);
  const lw=new THREE.Mesh(new THREE.PlaneGeometry(10,4.2),lamb(0xe2dcd2));lw.rotation.y=Math.PI/2;lw.position.set(-6,2.1,1);sc.add(lw);
  // 엘리베이터
  const desk=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.0,0.6),lamb(0x8a6f58));desk.position.set(0.9,0.5,-3.0);sc.add(desk);const dtop=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.05,0.7),lamb(0xe8dcc8));dtop.position.set(0.9,1.02,-3.0);sc.add(dtop);
  
  
  const ind=labelSprite('안내',{fs:60,bg:'#3f6fb5',fg:'#fff',size:0.004});ind.position.set(0.9,1.45,-3.0);sc.add(ind);
  // 유리 현관문 (오른쪽 벽)
  const gl=[];for(const s of[-1,1]){const g=new THREE.Mesh(new THREE.PlaneGeometry(0.9,2.4),new THREE.MeshBasicMaterial({color:0xbfe6ff,transparent:true,opacity:0.45,side:THREE.DoubleSide}));g.rotation.y=-Math.PI/2;g.position.set(3.97,1.2,-0.2+s*0.46);sc.add(g);gl.push(g)}
  const gfr=new THREE.Mesh(new THREE.BoxGeometry(0.12,2.6,2.0),lamb(0x6a6f7a));gfr.position.set(4.05,1.3,-0.2);sc.add(gfr);
  const shards=[];for(let i=0;i<26;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.08+r()*0.12,0.08+r()*0.14),new THREE.MeshBasicMaterial({color:0xdff4ff,transparent:true,opacity:0.8,side:THREE.DoubleSide}));m.visible=false;sc.add(m);shards.push({m,v:[-1.5-r()*3,1+r()*2.5,(r()-0.5)*3],p:[3.95,0.6+r()*1.8,-0.6+r()*0.8],rv:r()*10})}
  // 번호표 기계 + 전광판 + 대기 의자
  tMachine(sc,3.25,-3.75);
  const seats=chairRow(sc,-4.8,-0.2,-3.35,9);
  const disp=display(sc,-2.5,3.0,-3.94,47);
  const waiters=[];for(let i=0;i<8;i++){const z=zombie(r);seatZ(z,seats[i][0],seats[i][1]);sc.add(z);ticket(z,48+i);waiters.push(z)}
  // 주인공 + 좀비
  const me=istj(rng(11),{shirt:0x3d4a66});me.position.set(2.0,0,-2.7);me.rotation.y=0;sc.add(me);
  const nt=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.16,0.02),new THREE.MeshBasicMaterial({map:canvasTex(96,128,(c,w,h)=>{c.fillStyle='#fff';c.fillRect(0,0,w,h);c.fillStyle='#3f6fb5';c.fillRect(0,0,w,30);c.fillStyle='#222';c.font=`900 30px ${FONT}`;c.textAlign='center';c.fillText('안내',w/2,86)})}));nt.position.set(-0.13,0.2,0.0);me.userData.arms[0].position.z=0;me.userData.hip.add(nt);nt.position.set(-0.14,0.5,0.175);
  const Z=zombie(rng(713),{shirt:0x8a94a6});sc.add(Z);
  const bZ=bubZ(Z,'으어어어!!',{size:0.0034,y:2.25});const bZ2=bubZ(Z,'…으어?',{size:0.0026,y:2.2});
  const bP=bubJ(me,'번호표 뽑으세요',{size:0.0024,y:2.2}),bP2=bubJ(me,'순서대로 해야죠',{size:0.0024,y:2.2});
  const ch=chip('대기 인원 47명',1110);const cw=chip('AM 8:59 · 그래도 출근',200);ch.style.background='#2b2b3a';ch.style.color='#ffd84d';
  const vig=div('vig');const fl=div('flash');
  const C=cam(50);
  const P0=[4.6,-0.2],P1=[2.75,-2.25],PM=[3.25,-3.1],PS=[seats[8][0],-2.6];
  return t=>{
    const TB=E.bang,TS=E.stop,TPt=E.point,TR=E.reveal,TPu=E.pull,TSi=E.sit,Z1=at(1,'z1'),P2=at(1,'p2'),P3=at(1,'p3'),N3=at(1,'n3');
    waiters.forEach((w,i)=>{seatZ(w,seats[i][0],seats[i][1]);const u=w.userData;u.arms[0].rotation.x=-0.6;u.arms[1].rotation.x=-1.1+Math.sin(t*1.5+i)*0.04;u.head.rotation.z=0.25+Math.sin(t*1.3+i)*0.05;u.head.rotation.x=0.15});
    // 유리 파편
    gl.forEach(g=>g.visible=t<TB);shards.forEach(s=>{const d=t-TB;s.m.visible=d>0&&d<1.4;if(s.m.visible){s.m.position.set(s.p[0]+s.v[0]*d,Math.max(0.02,s.p[1]+s.v[1]*d-4.9*d*d),s.p[2]+s.v[2]*d);s.m.rotation.set(s.rv*d,s.rv*d*0.7,0)}});
    // 좀비 돌진
    const u=Z.userData;
    if(t<TB){Z.position.set(5.6,0,-0.2);Z.rotation.y=-Math.PI/2;zPose(Z,t,0)}
    else if(t<TS){const k=clamp01((t-TB)/1.3);Z.position.set(P0[0]+(P1[0]-P0[0])*ease(k)+1*(1-clamp01((t-TB)/0.25)),0,P0[1]+(P1[1]-P0[1])*ease(k));face(Z,me.position.x,me.position.z);zPose(Z,t*2,k<1?1:0);
      if(k>=1){u.arms[0].rotation.x=-2.0+Math.sin(t*14)*0.1;u.arms[1].rotation.x=-2.1+Math.cos(t*13)*0.1;u.head.rotation.x=-0.25;Z.position.x+=Math.sin(t*30)*0.01}}
    else if(t<TPu-0.5){Z.position.set(P1[0],0,P1[1]);zPose(Z,t,0);const kt=ease((t-TPt-0.2)/0.4);Z.rotation.y=Math.atan2(me.position.x-P1[0],me.position.z-P1[1])*(1-kt)+Math.atan2(PM[0]-P1[0],PM[1]-P1[1])*kt;
      if(t>at(1,'z2')&&t<TR+0.4){u.head.rotation.z=0.6}
      if(t>=TR&&t<P3){const kr=ease((t-TR)/0.4);Z.rotation.y=Math.PI/2+1.2*kr;u.head.rotation.z=0.3}}
    else if(t<TPu+0.1){walkTo(Z,P1,PM,clamp01((t-TPu+0.5)/0.5),t);}
    else if(t<TSi){const k=clamp01((t-TPu-0.3)/(TSi-TPu-0.3));Z.rotation.y=Math.PI;zPose(Z,t,0);if(k>0)walkTo(Z,PM,PS,k,t);ticket(Z,56);u.tk.visible=true}
    else{seatZ(Z,seats[8][0],seats[8][1]);u.arms[0].rotation.x=-0.6;u.arms[1].rotation.x=-1.1;u.head.rotation.z=0.3;u.head.rotation.x=0.15}
    if(u.tk)u.tk.visible=t>=TPu;
    // 주인공
    const um=me.userData;standPose(me);
    if(t<TB){me.rotation.y=0}else{const k=ease((t-TB)/0.4);me.rotation.y=Math.atan2(P1[0]-2.0,P1[1]+2.7)*k}
    if(t>=TPt&&t<TR+0.2){const k=Math.min(ease((t-TPt)/0.3),ease((TR+0.2-t)/0.3));me.rotation.y=0.2;pointAt(me,1,k)}
    if(t>=P3+1.0){me.rotation.y=-0.5}
    disp.userData.n!==47&&disp.userData.set(47);
    show(bZ,t,Z1+0.2,endOf(1,'z1',0.1));show(bZ2,t,at(1,'z2'),TR+0.5);show(bP,t,P2,endOf(1,'p2',0.5));show(bP2,t,P3,endOf(1,'p3',0.5));
    // 카메라
    let mode='A';if(t>=Z1+1.6)mode='B';if(t>=TPt)mode='M';if(t>=TR)mode='R';if(t>=P3-0.1)mode='P';if(t>=TPu-0.6)mode='W';
    if(mode==='A'){const k=ease(t/(Z1+1.6));C.fov=52;C.position.set(-0.4,1.9,4.2-k*0.6);C.lookAt(2.7,1.25,-1.6)}
    else if(mode==='B'){const sk=Math.sin(t*40)*0.02*(t<TS?1:0);C.fov=50;C.position.set(1.5+sk,1.95,2.0);C.lookAt(2.3,1.7,-2.5)}
    else if(mode==='M'){const k=ease((t-TPt)/1.2);C.fov=50;C.position.set(1.3,2.0,1.6-k*0.4);C.lookAt(2.8,1.6,-3.0)}
    else if(mode==='R'){const k=ease((t-TR)/1.4);C.fov=50;C.position.set(1.8-k*3.4,1.9,1.2);C.lookAt(-0.5-k*2.0,1.1,-3.4)}
    else if(mode==='P'){C.fov=50;C.position.set(1.5,1.95,2.0);C.lookAt(2.3,1.7,-2.5)}
    else{const k=ease((t-TPu+0.6)/3.5);C.fov=55;C.position.set(-0.6,2.4,4.8+k*0.6);C.lookAt(-0.6,1.15,-3.2)}
    C.updateProjectionMatrix();setSky('#d8d2c8','#d8d2c8');renderer.render(sc,C);
    vig.style.opacity=(t>TB-0.05&&t<TS)?(0.25+0.75*beatPulse(1,t)):0;
    cutFlash(fl,t,TB);if(t>=TR)cutFlash(fl,t,TR);
    chipPop(cw,t,0.1);cw.style.opacity=t<TB?1:0;chipPop(ch,t,TR+0.3);ch.style.opacity=t>TR+0.3&&t<P3-0.1?1:0;
    caption(1,t)};
};

// ===== 2. 관리사무소 창구: 48번 호출 → 감염 신청서 → '…으어.' → 반려 도장 → 다시 번호표, 맨 뒤로 → 타임랩스 단지 밖까지 줄 =====
function office(sc,r,o={}){
  const fl0=new THREE.Mesh(new THREE.PlaneGeometry(14,14),lamb(0xc4cbd2));fl0.rotation.x=-Math.PI/2;sc.add(fl0);
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(14,4.4),lamb(o.wall??0xe8e2d6));bw.position.set(0,2.2,-3.2);sc.add(bw);
  const lw=new THREE.Mesh(new THREE.PlaneGeometry(14,4.4),lamb(0xdcd6ca));lw.rotation.y=Math.PI/2;lw.position.set(-4.5,2.2,0);sc.add(lw);
  const rw=lw.clone();rw.rotation.y=-Math.PI/2;rw.position.set(4.5,2.2,0);sc.add(rw);
  const cn=new THREE.Mesh(new THREE.BoxGeometry(4.2,1.05,0.7),lamb(0x8a6f58));cn.position.set(0,0.52,-1.6);sc.add(cn);
  const top=new THREE.Mesh(new THREE.BoxGeometry(4.3,0.06,0.8),lamb(0xe8dcc8));top.position.set(0,1.07,-1.6);sc.add(top);
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.3),new THREE.MeshBasicMaterial({color:0xcfe8ff,transparent:true,opacity:0.22}));glass.position.set(0,1.75,-1.45);sc.add(glass);
  const hole=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.18),basic(0x6a6050));hole.position.set(0,1.18,-1.44);sc.add(hole);
  const sign=labelSprite('행복동 주민센터 · 민원 창구',{fs:64,bg:'#3f6fb5',fg:'#fff',size:0.0058});sign.position.set(0,3.55,-3.1);sc.add(sign);
  const disp=display(sc,1.6,2.85,-3.12,47,1.1);
  const shutter=new THREE.Mesh(new THREE.BoxGeometry(4.3,1.35,0.06),new THREE.MeshLambertMaterial({map:canvasTex(1024,330,(c,w,h)=>{c.fillStyle='#b8bec8';c.fillRect(0,0,w,h);for(let i=0;i<22;i++){c.fillStyle='rgba(60,60,80,.25)';c.fillRect(0,i*15,w,4)}
    c.fillStyle='#fff';c.fillRect(250,90,524,150);c.strokeStyle='#e2332d';c.lineWidth=8;c.strokeRect(250,90,524,150);c.fillStyle='#e2332d';c.font=`900 62px ${FONT}`;c.textAlign='center';c.fillText('업무 종료',w/2,160);c.fillStyle='#333';c.font=`800 40px ${FONT}`;c.fillText('내일 09:00 접수',w/2,218)})}));
  shutter.position.set(0,3.3,-1.38);sc.add(shutter);
  const cl=clerk(rng(31));cl.position.set(0,0,-2.3);sc.add(cl);
  const seats=chairRow(sc,-3.8,-1.4,0.9,4,0x6f8fb5).concat(chairRow(sc,1.4,3.8,0.9,4,0x6f8fb5));
  return {disp,shutter,cl,seats}}
function formEl(){return div('form',`<h1>감염 신청서</h1><p>물으실 분 성함 <span></span></p><p>동·호수 <span></span></p><p>감염 사유 <span></span></p><p>신분증 사본 <span>□ 첨부</span></p><p>신청인 서명 <span class="scr"></span></p>`)}
S[2]=()=>{
  const E=EV(2);const r=rng(721);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xf4f6ff,0x8a8478,1.7));{const d=new THREE.DirectionalLight(0xffffff,0.7);d.position.set(2,6,5);sc.add(d)}
  const O=office(sc,r);
  const tm=tMachine(sc,-4.1,1.9,Math.PI/2);
  const sitters=[];O.seats.forEach(([x,z],i)=>{if(i===3)return;const p=zombie(r);seatZ(p,x,z,Math.PI);sc.add(p);ticket(p,49+i);sitters.push(p)});
  sitters.forEach(p=>p.rotation.y=0);
  const Z=zombie(rng(713),{shirt:0x8a94a6});sc.add(Z);ticket(Z,48);
  const S3=O.seats[3];const PC=[0,-0.9],PB=[-3.6,1.9],PE=[-2.8,3.0];
  const bZ=bubZ(Z,'…으어.',{size:0.0024,y:2.15});
  const form=formEl();const scr=form.querySelector('.scr');const stp=div('stampR','반려');
  const vig=div('flash');
  // 타임랩스: 단지 밖으로 이어지는 줄
  const sL=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffffff,0x6a7060,1.6);sL.add(hemi);{const d=new THREE.DirectionalLight(0xffffff,0.7);d.position.set(-6,10,6);sL.add(d)}
  ground(sL,0x8fa27a,400);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(3,120),lamb(0xbdb6a8));road.rotation.x=-Math.PI/2;road.position.set(0,0.01,0);sL.add(road);
  for(let i=0;i<4;i++){const b=makeBuilding(r,7,20,5,{wall:'#e3dccf',win:'#5d7590',lit:0.15});b.position.set(-14,b.position.y,-14+i*12);sL.add(b);const b2=makeBuilding(r,7,20,5,{wall:'#d8d2c6',win:'#5d7590',lit:0.15});b2.position.set(14,b2.position.y,-14+i*12);sL.add(b2)}
  const path=[];for(let i=0;i<260;i++){const s=i*0.55;// 건물 입구에서 나와 도로 따라 지그재그
    const x=Math.sin(s*0.09)*1.0,z=-14+s;path.push([x,z])}
  const Q=[];const rq=rng(733);for(let i=0;i<path.length;i++){const z=zombie(rq);z.position.set(path[i][0],0,path[i][1]);z.rotation.y=Math.PI;z.visible=false;sL.add(z);Q.push(z)}
  const stat=div('stat','<div><small>물린 사람</small><b>0명</b></div><div><small>대기 좀비</small><b>0명</b></div>');const sb=stat.querySelectorAll('b')[1];
  const C=cam(50);
  return t=>{
    const TC=E.call,TW=E.walk,TSt=E.stamp,TBk=E.back,TPu=E.pull,TL=E.lapse,TS=E.stat,C1=at(2,'c1');
    sitters.forEach((p,i)=>{const s=O.seats[i<3?i:i+1];seatZ(p,s[0],s[1],Math.PI);const u=p.userData;u.arms[0].rotation.x=-0.6;u.arms[1].rotation.x=-1.1;u.head.rotation.z=0.25+Math.sin(t*1.3+i)*0.05;u.head.rotation.x=0.1});
    O.disp.userData.set(t>=TC?48:47);O.shutter.visible=false;
    const cl=O.cl,uc=cl.userData;standPose(cl);cl.rotation.y=0;
    if(t>C1-0.2&&t<TSt+0.4){uc.arms[1].rotation.x=-0.9;uc.arms[0].rotation.x=-0.5}
    if(t>TSt-0.25&&t<TSt+0.2){uc.arms[1].rotation.x=-2.2+ease((t-TSt+0.25)/0.25)*1.4}
    const u=Z.userData;
    if(t<TW){seatZ(Z,S3[0],S3[1],Math.PI);u.arms[0].rotation.x=-0.6;u.arms[1].rotation.x=-1.1;u.head.rotation.z=0.25;
      if(t>TC+0.2){const k=ease((t-TC-0.2)/0.3);u.head.rotation.x=-0.3*k;u.hip.position.y+=Math.abs(Math.sin((t-TC)*12))*0.04*(1-clamp01((t-TC-0.8)/0.3))}}
    else if(t<TBk){walkTo(Z,[S3[0],S3[1]-0.3],PC,clamp01((t-TW)/1.0),t);if(t>TW+1.0){Z.rotation.y=Math.PI;zPose(Z,t,0)}
      if(t>at(2,'z3')&&t<TBk){u.head.rotation.x=0.35;u.head.rotation.z=0.4}}
    else if(t<TPu){walkTo(Z,PC,PB,clamp01((t-TBk)/(TPu-TBk)),t);u.head.rotation.x=0.4;u.arms.forEach(a=>a.rotation.x*=0.55)}
    else{const k=clamp01((t-TPu-0.3)/0.9);walkTo(Z,PB,PE,k,t);u.head.rotation.x=0.4;u.arms.forEach(a=>a.rotation.x*=0.55)}
    ticket(Z,t>=TPu?3812:48);u.tk.visible=t<TBk-0.1||t>=TPu;
    show(bZ,t,at(2,'z3'),TSt);
    let mode=t<TW?'A':t<C1+0.9?'B':t<TBk-0.2?'F':t<TL?'W':'L';
    sh(form,mode==='F');sh(stp,mode==='F'&&t>=TSt);
    if(mode==='F'){const k=ease((t-C1-0.9)/0.3);form.style.transform=`translateY(${(1-k)*1200}px) rotate(${(1-k)*3}deg)`;scr.textContent=t>at(2,'z3')+0.2?'으어':'';
      if(t>=TSt){const k2=pop((t-TSt)/0.2);stp.style.transform=`translate(-50%,-50%) rotate(-14deg) scale(${2.4-1.4*Math.min(1,k2)})`;stp.style.opacity=clamp01((t-TSt)/0.05)}}
    if(mode==='L'){const k=clamp01((t-TL)/(VOICE[2]+0.7-(t-TL>0?0:0)-TL+0.25));const kk=ease(clamp01((t-TL)/2.6));
      const n=Math.floor(12+Math.pow(kk,1.2)*(Q.length-12));Q.forEach((z,i)=>{z.visible=i<n;if(z.visible)zPose(z,t,0)});
      const day=(t-TL)*2.2;const g=0.5+0.5*Math.cos(day*Math.PI);hemi.intensity=0.7+0.9*g;
      setSky(g>0.5?'#7fb8f0':'#2a3060',g>0.5?'#e6f2ff':'#5a5a90');
      C.fov=55;C.position.set(5-kk*2,5+kk*22,-26+kk*4);C.lookAt(0,0.5,-8+kk*40);C.updateProjectionMatrix();renderer.render(sL,C);
      const cnt=Math.round(48+Math.pow(kk,1.3)*(3812-48));sb.textContent=fmt(cnt)+'명'}
    else{
      if(mode==='A'){const k=ease(t/TW);C.fov=50;C.position.set(2.4,2.4,5.6-k*0.6);C.lookAt(0.6,1.75,-2.2)}
      else if(mode==='B'){const k=ease((t-TW)/2.5);C.fov=46;C.position.set(1.8-k*0.6,1.8,1.6-k*0.3);C.lookAt(-0.2,1.4,-1.8)}
      else if(mode==='F'){C.fov=46;C.position.set(1.2,1.8,1.2);C.lookAt(-0.1,1.4,-1.8)}
      else{const k=ease((t-TBk+0.2)/2);C.fov=52;C.position.set(0.5-k*0.4,2.2,4.6);C.lookAt(-2.8,1.2,1.4)}
      C.updateProjectionMatrix();setSky('#d8d2c8','#d8d2c8');renderer.render(sc,C)}
    sh(stat,mode==='L'&&t>=TS);if(t>=TS)popEl(stat,t,TS,'translateX(-50%)');
    cutFlash(vig,t,TL);
    caption(2,t)};
};

// ===== 3. 1년 후: 3812번 호출 → 벌떡 일어나 창구로 → 18:00 셔터 → '…으어.' → 뒤로 끝없는 줄 =====
S[3]=()=>{
  const E=EV(3);const r=rng(731);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffe8d8,0x7a6a68,1.6));{const d=new THREE.DirectionalLight(0xffb080,0.9);d.position.set(-4,4,5);sc.add(d)}
  const O=office(sc,r,{wall:0xeadccc});
  // 거미줄·먼지: 1년 동안 기다림
  const web=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.9),new THREE.MeshBasicMaterial({map:canvasTex(256,256,(c,w,h)=>{c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=3;for(let i=0;i<8;i++){c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(i*0.2)*w*1.2,Math.sin(i*0.2)*h*1.2);c.stroke()}for(let k=1;k<6;k++){c.beginPath();c.arc(0,0,k*40,0,Math.PI/2);c.stroke()}}),transparent:true,side:THREE.DoubleSide}));
  const Z=zombie(rng(713),{shirt:0x8a94a6});sc.add(Z);ticket(Z,3812);
  const S0=O.seats[3];
  // 줄: 사무실 안에서 문 밖까지
  const line=[];const rq=rng(741);for(let i=0;i<22;i++){const z=zombie(rq);const k=i;const x=S0[0]-0.2-(k%2)*0.15+(k>4?Math.min(4,(k-4))*-0.0:0);const zz=S0[1]+0.9+k*0.75;z.position.set(-0.2+Math.sin(k*0.7)*0.3,0,1.9+k*0.7);z.rotation.y=Math.PI;sc.add(z);ticket(z,3813+i);line.push(z)}
  O.seats.forEach(([x,z],i)=>{if(i===3)return;const p=zombie(r);seatZ(p,x,z,Math.PI);sc.add(p);ticket(p,3813+40+i);line.push(p);p.userData.seated=true});
  const bZ=bubZ(Z,'!!',{size:0.003,y:2.2}),bZ2=bubZ(Z,'…으어.',{size:0.0024,y:2.15});
  const yr=div('yr out','1년 후');
  const ck=chip('PM 5:59',1110);ck.style.fontVariantNumeric='tabular-nums';
  const stat=div('stat','<div><small>좀비 사태</small><b>1년째</b></div><div><small>물린 사람</small><b style="color:#2a9d5c">0명</b></div>');
  const fl=div('flash');const dim=div('flash');const e1=div('end1 out','다음 좀비편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');
  const C=cam(50);const PC=[0,-0.9];
  return t=>{
    const TLb=E.lobby,TC=E.call,TU=E.up,TCk=E.clock,TSh=E.shut,TS=E.stat,TE=E.end,Z4=at(3,'z4');
    sh(yr,t<TLb);
    line.forEach((z,i)=>{if(z.userData.seated){const u=z.userData;sitPose(z);z.position.y=-0.12;u.arms[0].rotation.x=-0.6;u.arms[1].rotation.x=-1.1;u.head.rotation.z=0.25;u.head.rotation.x=0.1}else zPose(z,t,0)});
    O.disp.userData.set(t>=TC?3812:3811);
    const cl=O.cl;standPose(cl);cl.visible=t<TSh+0.6;
    const ks=ease((t-TSh)/0.9);O.shutter.visible=ks>0.01;O.shutter.scale.y=Math.max(0.01,ks);O.shutter.position.y=2.45-1.35*ks/2;
    const u=Z.userData;
    if(t<TU){seatZ(Z,S0[0],S0[1],Math.PI);u.arms[0].rotation.x=-0.6;u.arms[1].rotation.x=-1.1;u.head.rotation.z=0.3;u.head.rotation.x=0.25;
      if(t>TC+0.3){u.head.rotation.x=-0.3;u.head.rotation.z=0}}
    else if(t<TU+0.35){const k=(t-TU)/0.35;Z.position.set(S0[0],Math.sin(k*Math.PI)*0.35,S0[1]);Z.rotation.y=Math.PI;standPose(Z);armUp(Z,0,1);armUp(Z,1,1)}
    else if(t<Z4-0.2){walkTo(Z,[S0[0],S0[1]-0.2],PC,clamp01((t-TU-0.35)/1.0),t*1.4);if(t>TU+1.35){Z.rotation.y=Math.PI;zPose(Z,t,0);u.arms[0].rotation.x=-1.8;u.arms[1].rotation.x=-1.8}}
    else{Z.position.set(PC[0],0,PC[1]);Z.rotation.y=Math.PI;zPose(Z,t,0);const k=ease((t-Z4+0.2)/1.2);u.arms[0].rotation.x=-1.4+1.3*k;u.arms[1].rotation.x=-1.35+1.25*k;u.head.rotation.x=0.12+0.4*k}
    show(bZ,t,TU,TU+1.2);show(bZ2,t,Z4,TS+0.4);
    ck.textContent=t<TSh-0.3?'PM 5:59':'PM 6:00';chipPop(ck,t,TLb+0.1);ck.style.opacity=t>TLb&&t<TS?1:0;
    if(t>=TSh-0.3&&t<TSh+0.2)ck.style.background='#ffd84d';else ck.style.background='';
    let mode=t<TU?'A':t<TSh-0.3?'B':t<TS?'S':'P';
    if(mode==='A'&&t<TC+0.8){C.fov=40;C.position.set(1.6,2.5,0.6);C.lookAt(1.6,2.7,-3.1)}
    else if(mode==='A'){const k=ease((t-TC-0.8)/(TU-TC-0.8));C.fov=50;C.position.set(-0.7,2.0,-0.9+k*0.15);C.lookAt(-1.5,1.05,1.2)}
    else if(mode==='B'){const k=ease((t-TU)/2);C.fov=50;C.position.set(1.8,2.5,4.4-k*0.5);C.lookAt(-0.7,1.3,-0.4)}
    else if(mode==='S'){const k=ease((t-TSh+0.3)/3);C.fov=46;C.position.set(0.5,1.75,1.5+k*0.5);C.lookAt(0,1.5,-1.4)}
    else{const k=ease((t-TS)/3.6);C.fov=52;C.position.set(0.6+k*0.8,2.0+k*2.2,2.6+k*12);C.lookAt(0,1.0,-1.0+k*6)}
    C.updateProjectionMatrix();setSky('#d8c8b8','#d8c8b8');if(t>=TLb)renderer.render(sc,C);
    sh(stat,t>=TS&&t<TE);if(t>=TS)popEl(stat,t,TS,'translateX(-50%)');
    cutFlash(fl,t,TLb);
    dim.style.background=`rgba(10,10,25,${0.55*clamp01((t-TE)/0.3)})`;popEl(e1,t,TE);popEl(e2,t,TE+0.25);sh(e1,t>=TE);sh(e2,t>=TE);
    caption(3,t)};
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
