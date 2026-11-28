// ---------- INFJ 전용: 가면 ----------
const ENV=await (await fetch('audio/env.json')).json();
// 맨얼굴 입모양: 대사 구간 동안 음량에 맞춰 입을 벌림
function talk(p,si,t,names){if(!p.userData.mo)mouthO(p);const mo=p.userData.mo;mo.visible=false;
  for(const n of names){const s=at(si,n),l=LN(si,n)[1];if(t>=s&&t<=s+l){const e=ENV[si]||[];const i=Math.round((t-LEAD)*30);
    const a=Math.max(e[i]||0,((e[i-1]||0)+(e[i+1]||0))/2);if(a>0.12){mo.visible=true;p.userData.smile.visible=false;p.userData.flat.visible=false;mo.scale.set(0.75+0.35*a,0.25+1.05*a,1)}}}}
{const st=document.createElement('style');st.textContent=`
.lab{position:absolute;left:36px;background:rgba(20,18,30,.78);color:#fff;font-weight:900;font-size:46px;padding:6px 26px;border-radius:999px;white-space:nowrap}
.lab.top{top:36px;background:rgba(255,255,255,.92);color:#3a2f5a}
.lab.bot{top:996px}
.divl{position:absolute;left:0;right:0;top:956px;height:8px;background:#1b1b22}
.midchip{position:absolute;left:50%;top:960px;transform:translate(-50%,-50%);background:#fff;color:#333;font-weight:900;font-size:54px;padding:10px 34px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.35);white-space:nowrap}
.midchip b{color:#e2552d}
.memchip{position:absolute;left:50%;transform:translateX(-50%);top:1100px;background:rgba(255,255,255,.12);border:3px solid rgba(255,255,255,.5);color:#fff;font-weight:900;font-size:44px;padding:8px 30px;border-radius:999px;white-space:nowrap}
.topic{position:absolute;left:50%;top:470px;transform:translateX(-50%);background:rgba(255,255,255,.9);color:#3a2f5a;font-weight:900;font-size:58px;padding:10px 36px;border-radius:24px;white-space:nowrap}
.battery{position:absolute;left:50%;top:330px;transform:translateX(-50%);display:flex;align-items:center;gap:20px;background:rgba(255,255,255,.95);border-radius:999px;padding:12px 34px;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.battery small{font-size:44px;font-weight:900;color:#333}
.battery .bt{width:150px;height:62px;border:7px solid #333;border-radius:14px;position:relative;box-sizing:border-box}
.battery .bt:after{content:'';position:absolute;right:-17px;top:14px;width:10px;height:22px;background:#333;border-radius:0 5px 5px 0}
.battery .fl{position:absolute;left:4px;top:4px;bottom:4px;background:#e23b3b;border-radius:5px}
.battery b{font-size:56px;font-weight:900;color:#e23b3b}
`;document.head.appendChild(st)}
const MCOL={smile:'#fdfbf7',tough:'#ff9f8f',polite:'#b9dcff',casual:'#ffe58a',wink:'#fdfbf7'};
const _mt={};
function maskTex(kind){if(_mt[kind])return _mt[kind];
  const t=canvasTex(256,288,(x,w,h)=>{x.clearRect(0,0,w,h);
    x.beginPath();x.ellipse(128,144,118,136,0,0,Math.PI*2);x.fillStyle=MCOL[kind];x.fill();x.lineWidth=9;x.strokeStyle='#3a3548';x.stroke();
    x.lineCap='round';x.strokeStyle='#2b2738';x.fillStyle='#2b2738';x.lineWidth=11;
    const arcEye=(cx)=>{x.beginPath();x.arc(cx,128,22,Math.PI*1.08,Math.PI*1.92);x.stroke()};
    const cheeks=()=>{x.fillStyle='rgba(255,130,150,.55)';for(const cx of[66,190]){x.beginPath();x.ellipse(cx,172,24,14,0,0,Math.PI*2);x.fill()}x.fillStyle='#2b2738'};
    if(kind==='smile'||kind==='wink'){arcEye(86);if(kind==='smile')arcEye(170);else{x.beginPath();x.moveTo(152,108);x.lineTo(186,122);x.lineTo(152,136);x.stroke()}
      cheeks();x.beginPath();x.arc(128,170,52,Math.PI*0.12,Math.PI*0.88);x.stroke();
      x.fillStyle='#c94a5e';x.beginPath();x.arc(128,170,52,Math.PI*0.25,Math.PI*0.75);x.lineTo(128,190);x.closePath();}
    if(kind==='tough'){for(const s of[-1,1]){x.beginPath();x.moveTo(128+s*84,92);x.lineTo(128+s*28,114);x.stroke()}
      for(const cx of[86,170]){x.beginPath();x.arc(cx,134,11,0,Math.PI*2);x.fill()}
      x.beginPath();x.moveTo(82,212);for(let i=0;i<=6;i++)x.lineTo(82+i*15.3,i%2?198:212);x.stroke();}
    if(kind==='polite'){arcEye(86);arcEye(170);cheeks();x.beginPath();x.arc(128,182,28,Math.PI*0.15,Math.PI*0.85);x.stroke();
      x.fillStyle='#5aa8ff';x.beginPath();x.moveTo(214,62);x.quadraticCurveTo(232,96,214,104);x.quadraticCurveTo(196,96,214,62);x.fill();}
    if(kind==='casual'){for(const cx of[86,170]){x.beginPath();x.moveTo(cx-22,130);x.lineTo(cx+22,130);x.stroke()}
      x.beginPath();x.moveTo(96,196);x.quadraticCurveTo(140,214,170,184);x.stroke();}
  });return _mt[kind]=t}
function maskMesh(kind,r=0.235){const m=new THREE.Mesh(new THREE.CircleGeometry(r,40),new THREE.MeshBasicMaterial({map:maskTex(kind),transparent:true,side:THREE.DoubleSide}));
  m.scale.y=1.1;m.userData.kind=kind;return m}
function setMask(m,kind){if(m.userData.kind!==kind){m.material.map=maskTex(kind);m.material.needsUpdate=true;m.userData.kind=kind}}
const MASK_ON=[0,0.22,0.35],MASK_OFF=[0,-0.45,0.4];
function wear(p,kind='smile'){const m=maskMesh(kind);m.position.set(...MASK_ON);p.userData.head.add(m);p.userData.mask=m;return m}
// k: 0=가슴(안 씀) → 1=얼굴
function maskK(p,k){const m=p.userData.mask;m.visible=k>0.02;const e=ease(k);
  m.position.set(0,MASK_OFF[1]+(MASK_ON[1]-MASK_OFF[1])*e,MASK_OFF[2]+(MASK_ON[2]-MASK_OFF[2])*e);m.scale.set(0.4+0.6*e,(0.4+0.6*e)*1.1,1)}
function putOn(p,t,t0,dur=0.35){const k=clamp01((t-t0)/dur);maskK(p,k);const a=p.userData.arms[1];const up=Math.sin(Math.PI*clamp01((t-t0+0.15)/(dur+0.3)));
  if(t>t0-0.15&&t<t0+dur+0.15){a.rotation.x=-2.0*up;a.rotation.z=0.5*up}return k}
// 주머니에서 가면 꺼내 쓰기: t0~t0+T (손 넣기 → 꺼내며 펴기 → 얼굴로) 후 쓰고 팔 내림
function pocketPull(p,t,t0,T=1.0){const u=p.userData,a=u.arms[1];
  if(!u.hm){u.hm=maskMesh(u.mask.userData.kind);u.hm.position.set(0,-0.68,0.1);a.add(u.hm)}
  const hm=u.hm,x=(t-t0)/T;
  if(x<0){maskK(p,0);hm.visible=false;return}
  if(x>=1){maskK(p,1);hm.visible=false;const d=clamp01((t-t0-T)/0.3);if(d<1){a.rotation.x=-2.3*(1-ease(d));a.rotation.z=0.45*(1-ease(d))}return}
  maskK(p,0);
  if(x<0.3){const k=ease(x/0.3);a.rotation.x=0.18*k;a.rotation.z=-0.12*k;a.position.y=0.6-0.06*k;hm.visible=false}
  else if(x<0.55){const k=ease((x-0.3)/0.25);a.position.y=0.54+0.06*k;a.rotation.x=0.18-0.6*k;a.rotation.z=-0.12+0.12*k;hm.visible=true;const s=0.25+0.75*pop(k);hm.scale.set(s,s*1.1,1)}
  else{const k=ease((x-0.55)/0.45);a.position.y=0.6;a.rotation.x=-0.42-1.88*k;a.rotation.z=0.45*k;hm.visible=true;hm.scale.set(1,1.1,1)}
  hm.rotation.set(-a.rotation.x,0,-a.rotation.z)}
function maskBelt(p,n,seed=3){const r=rng(seed),K=['smile','tough','polite','casual','smile','polite','casual'];const g=new THREE.Group();
  for(let i=0;i<n;i++){const a=-1.35+2.7*i/(n-1);const m=maskMesh(K[i%K.length],0.075);m.position.set(Math.sin(a)*0.29,0.02+(i%2)*0.04,Math.cos(a)*0.19);m.rotation.y=a;m.rotation.z=(r()-0.5)*0.5;g.add(m)}
  p.userData.hip.add(g);p.userData.belt=g;return g}
function addBrows(p){const h=p.userData.head;const B=[];
  for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.022,0.02),lamb(0x1a1a1a));b.position.set(s*0.095,0.32,0.238);h.add(b);B.push(b)}p.userData.brows=B;return p}
function setBrow(p,k){p.userData.brows.forEach((b,i)=>b.rotation.z=(i?1:-1)*k)}  // k<0: 화남
function tired(p,on){eyesBig(p,on?0.4:1);setFace(p,false);setBrow(p,on?-0.28:0)}
function infjG(r,side){const p=addBrows(general(r,side));setFace(p,false);return p}
function infjS(r,side){const p=addBrows(soldier(r,side));setFace(p,false);return p}
function lieDown(p){const u=p.userData;standPose(p);u.arms.forEach(a=>{a.rotation.x=-2.9;a.rotation.z=0})}
function sitEdge(p){const u=p.userData;u.hip.position.y=0.56;u.legs.forEach(l=>l.rotation.x=-1.25);u.arms.forEach(a=>{a.rotation.x=-0.35;a.rotation.z=0})}
function mug(col=0xf4f4f4){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.055,0.13,14),lamb(col));g.add(c);
  const d=new THREE.Mesh(new THREE.CircleGeometry(0.05,14),basic(0x6b3e26));d.rotation.x=-Math.PI/2;d.position.y=0.06;g.add(d);return g}
function clockTex(hh,mm){return canvasTex(256,256,(x,w,h)=>{x.fillStyle='#fffdf2';x.beginPath();x.arc(128,128,120,0,Math.PI*2);x.fill();x.lineWidth=10;x.strokeStyle='#3a3548';x.stroke();
  x.fillStyle='#3a3548';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.fillRect(128+Math.sin(a)*96-5,128-Math.cos(a)*96-5,10,10)}
  x.lineCap='round';const ha=((hh%12)+mm/60)/12*Math.PI*2,ma=mm/60*Math.PI*2;
  x.lineWidth=14;x.beginPath();x.moveTo(128,128);x.lineTo(128+Math.sin(ha)*55,128-Math.cos(ha)*55);x.stroke();
  x.lineWidth=9;x.strokeStyle='#c8231b';x.beginPath();x.moveTo(128,128);x.lineTo(128+Math.sin(ma)*88,128-Math.cos(ma)*88);x.stroke()})}
function bridge(scene,o={}){const g=new THREE.Group();const Y=o.y??1.0;
  const deck=new THREE.Mesh(new THREE.BoxGeometry(18,0.22,2.2),lamb(o.col??0x8a6a52));deck.position.y=Y;g.add(deck);
  for(const z of[-1.05,1.05]){const rail=new THREE.Mesh(new THREE.BoxGeometry(18,0.07,0.07),lamb(0x6b5238));rail.position.set(0,Y+0.75,z);g.add(rail);
    for(let x=-8.5;x<=8.5;x+=1.0){const p=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.75,0.08),lamb(0x6b5238));p.position.set(x,Y+0.38,z);g.add(p)}}
  for(const x of[-6,-2,2,6]){const pl=new THREE.Mesh(new THREE.BoxGeometry(0.5,Y+1.2,0.5),lamb(0x7a7f8a));pl.position.set(x,(Y-1.2)/2+0.0,0);g.add(pl)}
  scene.add(g);return g}
function riverSet(scene,r,night=true){
  const water=new THREE.Mesh(new THREE.PlaneGeometry(200,14),lamb(night?0x2f4a78:0x6fa8d8));water.rotation.x=-Math.PI/2;water.position.y=-0.25;scene.add(water);
  for(const s of[-1,1]){const bank=new THREE.Mesh(new THREE.BoxGeometry(200,0.6,40),lamb(night?0x3d5a46:0x8fb57a));bank.position.set(0,-0.3,s*27);scene.add(bank)}
  for(let i=0;i<14;i++)tree(scene,(i-6.5)*5+r()*2,-11-r()*5,1.2,night?0x3f6650:0x76a866);
  for(let i=0;i<6;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(10+r()*6,6+r()*5,6),lamb(night?0x2f3f5a:0x86a874));h.position.set((i-2.5)*16+r()*4,0,-34-r()*8);scene.add(h)}
}
function lampPost(scene,x,z,y=1.1){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,1.6,6),lamb(0x333333));p.position.set(x,y+0.8,z);scene.add(p);
  const gl=glowSprite('rgba(255,214,140,1)',1.3);gl.position.set(x,y+1.65,z);scene.add(gl);const b=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,8),basic(0xffe9b0));b.position.set(x,y+1.65,z);scene.add(b)}
function moon(scene,x,y,z,s=2.2){const m=new THREE.Mesh(new THREE.CircleGeometry(s*0.45,30),basic(0xfff3c4));m.position.set(x,y,z);scene.add(m);const gl=glowSprite('rgba(255,240,190,1)',s*2.2);gl.position.set(x,y,z-0.1);scene.add(gl);return [m,gl]}
function thoughtB(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:'#2b2738',fg:'#ffffff',fs:o.fs||64,size:o.size||0.0017}))}
const faceAt=(a,b)=>Math.atan2(b.x-a.x,b.z-a.z);
function chipShow(el,t,t0,t1=99){chipPop(el,t,t0);if(!(t>t0&&t<t1))el.style.opacity=0}

// ===== 0. 국경 대치 → 두 장군 걸어나옴 → 품에서 꺼낸 건 가면 (타이틀) =====
S[0]=()=>{
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xd8dde2,30,110);addLights(scene,{hemi:1.45});
  const r=rng(11);borderField(scene,r);
  const al=[];for(let i=0;i<14;i++){const p=infjS(r,ALLY);p.position.set((i-6.5)*1.3,0,0.4+(i%2)*0.35);p.rotation.y=Math.PI;scene.add(p);aim(p);wear(p,'smile');maskK(p,0);al.push({p,d:r()})}
  const fo=[];for(let i=0;i<14;i++){const p=infjS(r,FOE);p.position.set((i-6.5)*1.3,0,-10.4-(i%2)*0.35);scene.add(p);aim(p);wear(p,'smile');maskK(p,0);fo.push({p,d:r()})}
  const G=infjG(r,GEN);G.rotation.y=Math.PI;scene.add(G);wear(G);maskK(G,0);setBrow(G,-0.22);
  const EG=infjG(r,ENEMYG);scene.add(EG);wear(EG);maskK(EG,0);setBrow(EG,-0.22);
  const E=EV(0),WK=E.walk,ST=E.stop,RC=E.reach,MK=E.mask,e1=at(0,'e1'),g1=at(0,'g1'),n2=at(0,'n2');
  const b1=sb(scene,'먼 길 오셨네요~ㅎㅎ',0,3.05,-5.25,{c:FB,size:0.0026}),b2=sb(scene,'날씨가 너무 좋네요~ㅎㅎ',0,3.05,-4.75,{c:AB,size:0.0026});
  const C=cam(50);const ch=chip('선전포고 전 날씨 얘기: 4분');ch.style.opacity=0;
  ui.insertAdjacentHTML('beforeend',`<div class="tag">INFJ × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">INFJ인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  return t=>{
    const sk=clamp01((t-MK)/0.6);setSky(lerpCol('#8f99a6','#8fc3f0',sk),lerpCol('#d6dade','#eef6ff',sk)+' 70%');
    // 걸어나오기
    const wk=clamp01((t-WK)/(ST-WK));
    standPose(G);standPose(EG);
    G.position.set(0,0,-0.9-3.4*wk);EG.position.set(0,0,-9.6+3.4*wk);
    const turn=ease((t-ST)/0.4);G.rotation.y=Math.PI-0.55*turn;EG.rotation.y=0.55*turn;
    if(t>WK&&t<ST){walkPose(G,(t-WK)*4.2,0.4);walkPose(EG,(t-WK)*4.2+1,0.4)}
    // 품에 손
    [G,EG].forEach(p=>p.userData.arms[1].position.y=0.6);
    pocketPull(G,t,ST+0.05,MK-ST-0.05);pocketPull(EG,t,ST+0.1,MK-ST-0.1);
    const smile=t>MK+0.2;[G,EG].forEach(p=>{setBrow(p,smile?0.1:-0.22)});
    al.forEach(q=>{standPose(q.p);q.p.userData.arms[1].position.y=0.6;const tt=n2+0.3+q.d*1.2;if(t<tt-0.8)aim(q.p);else noRifle(q.p);pocketPull(q.p,t,tt-0.8,0.8)});
    fo.forEach(q=>{standPose(q.p);q.p.userData.arms[1].position.y=0.6;const tt=n2+0.3+q.d*1.2;if(t<tt-0.8)aim(q.p);else noRifle(q.p);pocketPull(q.p,t,tt-0.8,0.8)});
    if(t>g1&&t<n2){const w=Math.sin((t-g1)*9)*0.5+0.5;G.userData.arms[0].rotation.x=-2.6;G.userData.arms[0].rotation.z=-0.6-0.4*w}
    if(t>e1&&t<g1){EG.userData.arms[0].rotation.x=-1.0;EG.userData.arms[0].rotation.z=-0.7;EG.userData.hip.rotation.x=0.18}
    show(b1,t,e1,g1+0.4);show(b2,t,g1,n2+0.2);
    // 카메라
    if(t<ST){const k=ease(t/ST);setCam(C,lerp3([0,7.5,9.5],[0,3.6,3.2],k),[0,1.4,-5],52)}
    else if(t<n2){const k=ease((t-ST)/(n2-ST));setCam(C,lerp3([9.0,2.6,-5.0],[8.2,2.55,-5.0],k),[0,2.45,-5.0],36)}
    else{const k=ease((t-n2)/3.0);setCam(C,lerp3([7.5,5.5,1.5],[10,8,4],k),[0,1.0,-5],50)}
    const TO=at(0,'n1')+LN(0,'n1')[1]+0.25;
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t3.style.transform=`scale(${pop((t-0.6)/0.4)})`;
    [tag,t1,t2,t3].forEach((e,i)=>e.style.opacity=t<TO?clamp01((t-i*0.2)/0.1):clamp01(1-(t-TO)/0.2));
    chipShow(ch,t,n2);
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 협상 테이블 — 분할 화면(위: 가면 / 아래: 가면 뒤) =====
S[1]=()=>{
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffffff,0x8a8070,1.5);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(6,12,8);scene.add(sun);
  const r=rng(21);ground(scene,0x9cb97a,200);
  const canopy=new THREE.Mesh(new THREE.BoxGeometry(5.5,0.12,3.6),lamb(0xf2efe6));canopy.position.set(0,3.4,-0.6);scene.add(canopy);
  for(const x of[-2.6,2.6])for(const z of[-2.3,1.1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,3.4,6),lamb(0xdddddd));p.position.set(x,1.7,z);scene.add(p)}
  flag(scene,-3.4,-2.4,0x7f9b5a,3.8,1.2);flag(scene,3.4,-2.4,0x7c74b8,3.8,1.2);
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*4+r(),-9-r()*4,1.1,0x76a866);
  table(scene,0,0,2.2,1.0,0xf4f1ea);chair(scene,-0.95,0.15,Math.PI/2);chair(scene,0.95,0.15,-Math.PI/2);
  const doc=paper('#fffdf2',(x,w,h)=>{x.fillStyle='#2a2a2a';x.font=`900 46px ${FONT}`;x.textAlign='center';x.fillText('선전포고문',w/2,70);x.fillRect(30,90,w-60,4);
    for(let i=0;i<8;i++)x.fillRect(36,130+i*30,w-72-(i%3)*40,8)},0.5,0.68);doc.rotation.x=-Math.PI/2;doc.position.set(0,0.91,0.05);scene.add(doc);
  for(const x of[-0.6,0.6]){const c=mug(0xffffff);c.position.set(x,0.97,-0.2);scene.add(c)}
  const G=infjG(r,GEN),EG=infjG(r,ENEMYG);
  G.position.set(-0.95,0,0.15);G.rotation.y=Math.PI/2-0.6;EG.position.set(0.95,0,0.15);EG.rotation.y=-Math.PI/2+0.6;scene.add(G);scene.add(EG);
  [G,EG].forEach(p=>{sitPose(p);wear(p,'smile')});
  const E=EV(1),e2=at(1,'e2'),e3=at(1,'e3'),g2=at(1,'g2'),g3=at(1,'g3'),n3=at(1,'n3'),IN1=E.in1,OUT1=E.out1,IN2=E.in2,OUT2=E.out2,SG=E.sign;
  const tb1=sb(scene,'좀 서운한 게 있어서요~ㅎㅎ',0.45,2.2,0.2,{c:FB,size:0.0017}),tb2=sb(scene,'ㅎㅎ',0.8,2.2,0.2,{c:FB,size:0.002}),tb3=sb(scene,'제가 몰랐네요~ㅎㅎ',-0.45,2.2,0.2,{c:AB,size:0.0017}),tb4=sb(scene,'ㅎㅎ',-0.8,2.2,0.2,{c:AB,size:0.002});
  const ib1=thoughtB(EG,'토씨 하나 안 틀리고 기억한다',{size:0.0017,y:1.85}),ib2=thoughtB(G,'그날 니 표정, 나도 다 봤다',{size:0.0017,y:1.85});
  const top=[tb1,tb2,tb3,tb4],bot=[ib1,ib2];bot.forEach(b=>b.parent.remove(b));
  div('divl');const L1=div('lab top','겉 · 가면'),L2=div('lab bot','속 · 가면 뒤');
  const mem=div('memchip','3년 전 국경 회의 · 기억 보관 중');mem.style.top='1450px';mem.style.opacity=0;
  const mid=div('midchip','겉 미소 <b>100%</b> · 속 서운함 <b>100%</b>');mid.style.opacity=0;
  const stp=div('stamp2','선전포고');stp.style.opacity=0;stp.style.top='420px';stp.style.fontSize='100px';
  const C=cam(36,W/(H/2));
  return t=>{
    [G,EG].forEach(p=>{sitPose(p);p.userData.head.rotation.set(0,0,0)});
    // 대화 손짓 / 서명
    if(t>e2&&t<IN1){const a=EG.userData.arms[1];a.rotation.x=-1.3+Math.sin(t*6)*0.15;a.rotation.z=0.3}
    if(t>g2&&t<IN2){const a=G.userData.arms[1];a.rotation.x=-1.3+Math.sin(t*6)*0.15;a.rotation.z=-0.3}
    if(t>SG-1.0&&t<SG){[G,EG].forEach((p,i)=>{const a=p.userData.arms[1];a.rotation.x=-0.95+Math.sin(t*22+i)*0.08;a.rotation.z=(i?1:-1)*0.25})}
    // 말풍선
    show(tb1,t,e2,IN1);show(tb2,t,IN1,OUT1);show(tb3,t,g2,IN2);show(tb4,t,IN2,OUT2);
    mem.style.opacity=t>IN1&&t<OUT1?1:0;
    mid.style.opacity=t>n3?1:0;mid.style.transform=`translate(-50%,-50%) scale(${pop((t-n3)/0.3)})`;
    stp.style.opacity=t>SG?1:0;stp.style.transform=`translateX(-50%) rotate(-12deg) scale(${1+2*(1-pop((t-SG)/0.25))})`;
    const k=ease(Math.min(1,t/6));
    setCam(C,lerp3([0,2.15,4.4],[0,2.1,3.9],k),[0,1.95,0],36);
    setSky('#9cc9ef','#eaf4fb 70%');
    renderer.setScissorTest(true);
    // 위: 가면(겉)
    renderer.setViewport(0,960,1080,960);renderer.setScissor(0,960,1080,960);renderer.setClearColor(0x000000,0);
    hemi.intensity=1.5;sun.intensity=1.6;
    [G,EG].forEach(p=>{p.userData.mask.visible=true;setFace(p,true);eyesBig(p,1);setBrow(p,0.1)});[G,EG].forEach(p=>{if(p.userData.mo)p.userData.mo.visible=false});
    top.forEach(b=>b.material.opacity=1);bot.forEach(b=>b.visible=false);
    renderer.render(scene,C);
    // 아래: 가면 뒤(속)
    renderer.setViewport(0,0,1080,960);renderer.setScissor(0,0,1080,960);renderer.setClearColor(0x2a2638,1);
    hemi.intensity=0.75;sun.intensity=0.6;
    [G,EG].forEach(p=>{p.userData.mask.visible=false;tired(p,true)});
    top.forEach(b=>b.visible=false);talk(EG,1,t,['e3']);talk(G,1,t,['g3']);
    setCam(C,lerp3([0,2.05,4.4],[0,2.0,3.9],k),[0,2.3,0],36);
    renderer.render(scene,C);
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.setClearColor(0x000000,0);
    caption(1,t);
  };
};

// ===== 2. 참호 — 상대 따라 가면 갈아 끼우기 → 꼬임 → 적에게 90도 인사 → 적도 가면 7개 =====
S[2]=()=>{
  setSky('#b8c4cf','#eef1f4 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe0e5ea,25,90);addLights(scene,{hemi:1.45});
  const r=rng(31);ground(scene,0x9cb97a,200);
  const mud=new THREE.Mesh(new THREE.PlaneGeometry(60,3.6),lamb(0xa8946e));mud.rotation.x=-Math.PI/2;mud.position.set(0,0.01,-1.2);scene.add(mud);
  fence(scene,-1.25,30);sandbags(scene,0,-0.45,10,2);sandbags(scene,0,-2.05,10,2,0xb4a7d6);
  for(let i=0;i<12;i++)tree(scene,(i-5.5)*4.5+r(),-14-r()*5,1.1,0x76a866);
  for(let i=0;i<6;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-2.5)*14+r()*4,0,-36-r()*8);scene.add(h)}
  const P=infjS(r,ALLY);P.position.set(0,0,0.3);scene.add(P);wear(P,'tough');maskBelt(P,5,4);
  const F=infjS(r,FOE);F.position.set(0.15,0,-2.7);scene.add(F);wear(F,'tough');const FB=maskBelt(F,7,9);
  const G=infjG(r,GEN);G.position.set(-3.5,0,1.3);scene.add(G);wear(G,'smile');
  const B=infjS(r,ALLY);B.position.set(3.5,0,1.1);scene.add(B);wear(B,'casual');
  // 줄지어 선 다른 병사들(와이드용)
  const extras=[];for(let i=0;i<10;i++){const ally=i<5;const p=infjS(r,ally?ALLY:FOE);const x=(i%5<2?-1:1)*(2.6+(i%5)*1.5);p.position.set(x,0,ally?0.3:-2.7);p.rotation.y=ally?Math.PI:0;scene.add(p);wear(p,'tough');maskBelt(p,4+(i%4),20+i);aim(p);extras.push(p)}
  const fx=[];for(let i=0;i<5;i++){const gl=glowSprite('rgba(255,190,120,1)',4);gl.position.set((i-2)*9+r()*3,1.5,-20-r()*8);scene.add(gl);fx.push({gl,ph:r()})}
  const E=EV(2),s1=at(2,'s1'),SW1=E.sw1,SW2=E.sw2,AL=E.all,BW=E.bow,FZ=E.freeze,BL=E.belt,f1=at(2,'f1'),n4=at(2,'n4');
  const b1=bubS(P,'덤벼!!',{size:0.0024,y:2.25}),b2=bubS(P,'충성!',{size:0.0024,y:2.25}),b3=bubS(P,'야 밥 뭐냐',{size:0.0024,y:2.25}),b4=bubS(P,'아 네 감사합니다~',{size:0.0022,y:2.25});
  const bg=bubS(G,'…?',{size:0.0024,y:2.6}),bb=bubS(B,'…?',{size:0.0024,y:2.3}),b5=bubF(F,'…아. 저도 그거 알아요',{size:0.0019,y:2.25});
  const ch=chip('가면 교체 1초에 4회');ch.style.opacity=0;const ch2=chip('적군과 처음 통한 순간');ch2.style.opacity=0;
  const C=cam(50);const K=['tough','polite','casual'];
  return t=>{
    [P,F,G,B].forEach(p=>{standPose(p);p.userData.hip.rotation.set(0,0,0)});
    extras.forEach(p=>{standPose(p);aim(p);p.visible=!(t>=BW&&t<BL-0.2&&p.position.x>0)});
    // 장군·동기 등장
    const gk=ease((t-SW1+0.6)/0.8),bk=ease((t-SW2+0.6)/0.8);
    G.position.x=-3.5+2.3*gk;B.position.x=3.5-2.2*bk;if(gk>0&&gk<1)walkPose(G,t*7,0.4);if(bk>0&&bk<1)walkPose(B,t*7,0.4);
    G.rotation.y=gk<1?Math.PI/2:faceAt(G.position,P.position);B.rotation.y=bk<1?-Math.PI/2:faceAt(B.position,P.position);
    // 병사 P
    let ry=Math.PI,kind='tough';
    if(t<SW1){aim(P);kind='tough'}
    else if(t<SW2){noRifle(P);ry=faceAt(P.position,G.position);kind='polite';salute(P,clamp01((t-SW1-0.1)/0.2))}
    else if(t<AL){noRifle(P);ry=faceAt(P.position,B.position);kind='casual';P.userData.arms[1].rotation.x=-1.1;P.userData.arms[1].rotation.z=-0.4}
    else if(t<BW){noRifle(P);const sp=(t-AL);ry=Math.PI+sp*16;kind=K[Math.floor(sp/0.12)%3];P.userData.hip.position.y=0.8+Math.abs(Math.sin(sp*20))*0.05}
    else{noRifle(P);ry=0;kind='polite';const bw=ease((t-BW)/0.25)*(t<FZ+0.6?1:1-ease((t-FZ-0.6)/0.4));P.userData.hip.rotation.x=1.15*bw;P.userData.arms.forEach(a=>a.rotation.x=0.1)}
    // P는 적을 볼 때 -z(=Math.PI)... 인사는 적(F) 방향
    if(t>=BW)ry=faceAt(P.position,F.position);
    P.rotation.y=ry;setMask(P.userData.mask,kind);
    if(t<BW)aim(F);else noRifle(F);F.rotation.y=0;
    if(t>BL){const k=ease((t-BL)/0.35);F.userData.arms.forEach((a,i)=>{a.rotation.x=-0.55*k;a.rotation.z=(i?-0.45:0.45)*k});F.userData.head.rotation.x=0.35*k}
    FB.scale.setScalar(t>BL?1+0.35*Math.sin(Math.PI*clamp01((t-BL)/0.4)):1);
    show(b1,t,s1,SW1);show(b2,t,SW1+0.2,SW2);show(b3,t,SW2+0.2,AL);show(b4,t,BW+0.2,FZ+0.4);
    show(bg,t,AL+0.1,BW);show(bb,t,AL+0.25,BW);show(b5,t,f1,n4);
    chipShow(ch,t,AL,BW+0.4);chipShow(ch2,t,f1,n4);
    fx.forEach(q=>{const lt=(t*0.7+q.ph)%1;q.gl.material.opacity=t<BW?Math.max(0,1-lt*3):0});
    // 카메라
    if(t<BW){const sh=t>AL?Math.sin(t*70)*0.03:0;const k=ease(Math.min(1,t/2));setCam(C,lerp3([1.5,2.2,-2.3],[1.2,2.1,-2.0],k).map((v,i)=>i==0?v+sh:v),[0,1.6,0.6],56)}
    else if(t<BL-0.2){setCam(C,[7.6,2.4,-1.0],[0,1.05,-1.0],50)}
    else if(t<n4){const k=ease((t-BL+0.2)/1.2);setCam(C,lerp3([0.9,1.3,-0.2],[0.8,1.25,-0.4],k),[0.15,1.0,-2.7],50)}
    else{const k=ease((t-n4)/3.5);setCam(C,lerp3([5,4,4],[8,8,8]),[0,0.8,-1.2],50);setCam(C,lerp3([5,4,4],[8,7.5,8],k),[0,0.8,-1.2],50)}
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 오후 6시 — 전쟁 멈춤 → 막사에서 가면 벗고 충전 → '…내일 얘기해' =====
S[3]=()=>{
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe9d8c8,30,110);addLights(scene,{hemi:1.4,sun:0xffd9b0});
  const r=rng(41);borderField(scene,r,{g:0xa8b47a});
  const tower=new THREE.Group();const tb=new THREE.Mesh(new THREE.BoxGeometry(1.6,7,1.6),lamb(0xd9cbb8));tb.position.y=3.5;tower.add(tb);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(1.4,1.4,4),lamb(0x8a4f5a));roof.rotation.y=Math.PI/4;roof.position.y=7.7;tower.add(roof);
  const ct1=clockTex(5,59),ct2=clockTex(6,0);const face=new THREE.Mesh(new THREE.CircleGeometry(0.62,32),new THREE.MeshBasicMaterial({map:ct1}));face.position.set(0,6.0,0.81);tower.add(face);
  tower.position.set(4.5,0,-5);scene.add(tower);
  const sol=[];for(let i=0;i<16;i++){const ally=i<8;const p=infjS(r,ally?ALLY:FOE);const x=((i%8)-3.5)*1.6;p.position.set(x,0,ally?0.2:-10.2);p.rotation.y=ally?Math.PI:0;scene.add(p);wear(p,'tough');aim(p);sol.push({p,ally,x,z:p.position.z,d:r()*0.4})}
  const booms=[];for(let i=0;i<6;i++){const gl=glowSprite('rgba(255,170,90,1)',3.5);gl.position.set((i-2.5)*4+r()*2,1,-5+(r()-0.5)*4);scene.add(gl);booms.push({gl,ph:r()})}
  // 막사 안 (멀리 떨어진 세트)
  const IN=new THREE.Group();IN.position.set(200,0,0);scene.add(IN);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(8,8),lamb(0x8a7458));fl.rotation.x=-Math.PI/2;IN.add(fl);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(8,5),lamb(0x6f7d55));wall.position.set(0,2.5,-1.6);IN.add(wall);
  const side=new THREE.Mesh(new THREE.PlaneGeometry(8,5),lamb(0x667248));side.position.set(-2.4,2.5,0);side.rotation.y=Math.PI/2;IN.add(side);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.0,2.0),lamb(0x4f5a3a));door.position.set(1.9,1.0,-1.58);IN.add(door);
  const cot=new THREE.Mesh(new THREE.BoxGeometry(0.95,0.45,2.2),lamb(0x5a6b45));cot.position.set(-0.8,0.22,-0.3);IN.add(cot);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.12,0.45),lamb(0xeeeeee));pil.position.set(-0.8,0.5,0.55);IN.add(pil);
  const peg=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.15,6),lamb(0x333333));peg.rotation.x=Math.PI/2;peg.position.set(0.8,2.1,-1.52);IN.add(peg);
  const wm=maskMesh('smile');wm.position.set(0.8,1.85,-1.5);IN.add(wm);
  const lamp=glowSprite('rgba(255,200,120,1)',1.4);lamp.position.set(1.2,2.6,-1.2);IN.add(lamp);
  const G=infjG(r,GEN);IN.add(G);wear(G,'smile');
  // 밤 막사촌 (와이드)
  const camp=new THREE.Group();camp.position.set(-200,0,0);scene.add(camp);
  const cg=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(0x3a4a3a));cg.rotation.x=-Math.PI/2;camp.add(cg);
  const sighs=[];for(let i=0;i<36;i++){const x=(i%9-4)*3.2,z=-Math.floor(i/9)*3.6-(i%2)*0.8;const tt=new THREE.Group();
    const c=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.6,4),lamb(i%2?0x55663f:0x5e5896));c.rotation.y=Math.PI/4;c.position.y=0.8;tt.add(c);
    const g=glowSprite('rgba(255,210,140,1)',1.6);g.position.y=0.7;tt.add(g);tt.position.set(x,0,z);camp.add(tt);
    const s=labelSprite('하아…',{bg:'#ffffff',fg:'#5a5470',fs:56,size:0.0055});s.center.set(0.5,0);s.position.set(x,1.7,z);s.material.depthTest=false;camp.add(s);sighs.push({s,d:r()*0.6})}
  const cstars=stars(scene,160,r,{w:120,y0:4,h:40,z:-30});cstars.position.x=-200;
  const E=EV(3),BEL=E.bell,HM=E.home,TN=E.tent,KN=E.knock,WD=E.wide,a1=at(3,'a1'),g4=at(3,'g4'),n5=at(3,'n5');
  const ab=topB(labelSprite('장군님, 야간 작전 회의를…',{bg:'#f2ffd0',fg:'#2b3a10',fs:64,size:0.0021}));ab.center.set(0.5,0);ab.position.set(-0.4,2.45,-1.3);IN.add(ab);
  const gb=bubS(G,'…내일 얘기해.',{size:0.0021,y:1.2});
  const bat=div('battery','<small>혼자 충전 중</small><div class="bt"><div class="fl"></div></div><b>3%</b>');bat.style.opacity=0;
  const ch=chip('PM 6:00 · 사회생활 종료');ch.style.opacity=0;
  const C=cam(50);
  return t=>{
    const night=t>WD;
    setSky(night?'#1d2346':'#f2b98a',night?'#3d4a7a 70%':'#fbe3cf 70%');
    face.material.map=t>BEL?ct2:ct1;
    sol.forEach(q=>{standPose(q.p);const lt=t-HM-q.d;
      if(t<BEL){aim(q.p);q.p.rotation.y=q.ally?Math.PI:0;q.p.position.set(q.x,0,q.z)}
      else if(lt<0){noRifle(q.p);q.p.rotation.y=q.ally?Math.PI:0}
      else{noRifle(q.p);q.p.rotation.y=q.ally?0:Math.PI;const d=lt*1.4;q.p.position.set(q.x,0,q.z+(q.ally?d:-d));walkPose(q.p,lt*6,0.4)}});
    booms.forEach(q=>{const lt=(t*1.3+q.ph)%1;q.gl.material.opacity=t<BEL?Math.max(0,1-lt*2.5):0});
    // 막사 안: 가면 벗고 걸기 → 침대에 엎어짐
    const it=t-TN;
    standPose(G);G.rotation.set(0,0,0);G.position.set(0.3,0,0.2);
    if(it<0.6){G.rotation.y=0;wm.visible=false;G.userData.mask.visible=true;const k=ease(it/0.5);const a=G.userData.arms[1];a.rotation.x=-2.0*k;G.userData.mask.position.set(0,0.22+0.1*k,0.35+0.15*k)}
    else{G.userData.mask.visible=false;wm.visible=true}
    if(it>=0.6){const k=ease((it-0.6)/0.4);G.position.set(0.3-1.1*k,0.52*k,0.2-1.6*k);G.rotation.x=Math.PI/2*k;tired(G,true);if(k>0.5)lieDown(G)}
    else tired(G,true);
    show(gb,t,g4,WD);ab.visible=t>a1&&t<g4+0.3;if(ab.visible)ab.scale.set(ab.userData.base[0]*pop((t-a1)/0.25),ab.userData.base[1]*pop((t-a1)/0.25),1);
    chipShow(bat,t,TN+1.0,WD);const pc=3+Math.max(0,(t-TN-1.0))*1.2;bat.querySelector('b').textContent=Math.floor(pc)+'%';bat.querySelector('.fl').style.width=Math.min(100,pc)+'%';
    chipShow(ch,t,BEL,TN);
    sighs.forEach(q=>{const lt=t-WD-0.3-q.d;const k=lt>0?pop(lt/0.3):0;q.s.visible=lt>0;q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1);q.s.position.y=1.7+Math.max(0,lt)*0.25});
    // 카메라
    if(t<BEL){const k=ease(t/BEL);setCam(C,lerp3([9,5,5],[8,4.5,3.5],k),[0,1.6,-5],52)}
    else if(t<HM){const k=ease((t-BEL)/0.5);setCam(C,lerp3([6,4.5,1.5],[4.5,6.0,-1.4],k),[4.5,5.8,-5],lerp3([52],[40],k)[0])}
    else if(t<TN){setCam(C,[7,4.5,6],[0,1.2,-5],52)}
    else if(t<WD){const k=ease((t-TN)/3);setCam(C,lerp3([202.6,2.9,3.8],[202.3,2.8,3.4],k),[199.7,0.9,-0.6],55)}
    else{const k=ease((t-WD)/4);setCam(C,lerp3([-200,4,9],[-200,9,14],k),[-200,0.8,-6],52)}
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 밤 국경 다리 — 가면 없이 마주침 → 딥토크 7시간 =====
S[4]=()=>{
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x2a3360,25,90);
  const hemi=new THREE.HemisphereLight(0xb8c4ff,0x2a2a3a,1.0);scene.add(hemi);const dl=new THREE.DirectionalLight(0xc9d4ff,0.9);dl.position.set(-4,10,6);scene.add(dl);
  const r=rng(51);riverSet(scene,r,true);bridge(scene);
  lampPost(scene,-4,1.0);lampPost(scene,4,1.0);
  const [mn,mg]=moon(scene,-5,8,-26,3);
  const st=stars(scene,220,r,{w:120,y0:5,h:40,z:-30});
  const sun=glowSprite('rgba(255,190,120,1)',10);sun.position.set(6,-2,-30);scene.add(sun);const sd=new THREE.Mesh(new THREE.CircleGeometry(1.4,30),basic(0xffd27a));sd.position.set(6,-2,-29.9);scene.add(sd);
  const G=infjG(r,GEN),EG=infjG(r,ENEMYG);scene.add(G);scene.add(EG);[G,EG].forEach(p=>{wear(p);p.userData.mask.visible=false});
  const E=EV(4),MT=E.meet,PK=E.pocket,SM=E.smile,SIT=E.sit,LP=E.lapse,SUN=E.sun,e4=at(4,'e4'),g5=at(4,'g5'),e5=at(4,'e5'),g6=at(4,'g6'),e6=at(4,'e6'),n6=at(4,'n6');
  const ex1=topB(textSprite('!',120,'#ffd84d',0.004)),ex2=topB(textSprite('!',120,'#ffd84d',0.004));G.add(ex1);EG.add(ex2);ex1.position.y=2.3;ex2.position.y=2.3;
  const b1=bubF(EG,'…가면, 안 가져오셨어요?',{size:0.0017}),b2=bubS(G,'…네.',{size:0.002}),b3=bubF(EG,'…저도요.',{size:0.002}),b4=bubS(G,'사람은 왜 가면을 쓸까요',{size:0.0017,y:2.0}),b5=bubF(EG,'저 그 생각… 매일 해요',{size:0.0017,y:2.0});
  const ch=chip('가면: 막사 벽에 걸려 있음');ch.style.opacity=0;const ch2=chip('스몰토크 0분 · 딥토크 7시간');ch2.style.opacity=0;
  const tp=div('topic','');tp.style.opacity=0;const TOP=['인생','죽음','우주','사람은 왜 가면을 쓸까'];
  const C=cam(50);const DY=1.11;
  return t=>{
    const dawn=clamp01((t-LP)/(SUN-LP+1.5));
    setSky(lerpCol('#141a3a','#f5a77a',dawn),lerpCol('#2f3a6e','#ffe2b8',dawn)+' 75%');
    st.material.opacity=1-dawn;st.material.transparent=true;mn.material.opacity=1-dawn;mn.material.transparent=true;mg.material.opacity=1-dawn;
    hemi.intensity=1.0+dawn*0.6;scene.fog.color.set(lerpCol('#2a3360','#f3c9a8',dawn));
    sun.position.y=-2+ease((t-SUN+1)/3)*7;sd.position.y=sun.position.y;
    [G,EG].forEach(p=>{standPose(p);tired(p,t<SM)});
    const wk=clamp01(t/MT);
    if(t<SIT){G.position.set(-7+6.35*wk,DY,0);EG.position.set(7-6.35*wk,DY,0);G.rotation.y=Math.PI/2;EG.rotation.y=-Math.PI/2;
      if(t<MT){walkPose(G,t*5,0.35);walkPose(EG,t*5+1,0.35)}}
    if(t>PK&&t<g5){[G,EG].forEach(p=>{p.userData.arms.forEach((a,i)=>{a.rotation.x=0.2;a.rotation.z=(i?-0.35:0.35)});p.userData.head.rotation.x=0.4})}
    if(t>SM){setFace(G,true);setFace(EG,true);eyesBig(G,1);eyesBig(EG,1);setBrow(G,0.05);setBrow(EG,0.05)}
    if(t>=SIT){const k=ease((t-SIT)/0.6);G.rotation.y=Math.PI/2*(1-k);EG.rotation.y=-Math.PI/2*(1-k);G.position.set(-0.45,DY-0.5*k,0.75*k);EG.position.set(0.45,DY-0.5*k,0.75*k);if(k>0.5){sitEdge(G);sitEdge(EG)}}
    if(t>g6&&t<SIT+99){[G,EG].forEach((p,i)=>{p.userData.head.rotation.y=(i?-0.35:0.35)})}
    talk(EG,4,t,['e4','e5','e6']);talk(G,4,t,['g5','g6']);
    scaleBubble(ex1,t>MT&&t<e4?pop((t-MT)/0.2):0);scaleBubble(ex2,t>MT+0.1&&t<e4?pop((t-MT-0.1)/0.2):0);
    show(b1,t,e4,g5);show(b2,t,g5,e5);show(b3,t,e5,SM+0.4);show(b4,t,g6,e6);show(b5,t,e6,LP+0.2);
    chipShow(ch,t,PK,SM);chipShow(ch2,t,LP);
    const ti=Math.floor((t-LP)/0.9);tp.style.opacity=t>LP&&ti<TOP.length+1?1:0;if(t>LP){tp.textContent=TOP[Math.min(ti,TOP.length-1)];tp.style.transform=`translateX(-50%) scale(${pop(((t-LP)%0.9)/0.25)})`}
    // 카메라
    if(t<MT){const k=ease(t/MT);setCam(C,lerp3([0,4.5,10],[0,3.2,6.5],k),[0,1.8,0],50)}
    else if(t<SIT){const k=ease((t-MT)/(SIT-MT));setCam(C,lerp3([0,3.3,6.4],[0,3.25,5.8],k),[0,3.0,0],44)}
    else if(t<n6){setCam(C,[0,2.6,5.6],[0,2.3,0],42)}
    else{const k=ease((t-n6)/6);setCam(C,lerp3([0,2.6,5.6],[0,3.6,13],k),lerp3([0,2.3,0],[0,2.6,-6],k),lerp3([42],[48],k)[0])}
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. 엔딩 — 낮엔 가면 쓰고 싸우는 척(윙크) → 밤엔 가면 벗고 코코아 =====
S[5]=()=>{
  const day=new THREE.Scene();day.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(day,{hemi:1.5});
  const r=rng(61);borderField(day,r);
  const al=[];for(let i=0;i<12;i++){const p=infjS(r,ALLY);p.position.set((i-5.5)*1.35,0,0.3+(i%2)*0.3);p.rotation.y=Math.PI;day.add(p);aim(p);wear(p,'tough');al.push(p)}
  const fo=[];for(let i=0;i<12;i++){const p=infjS(r,FOE);p.position.set((i-5.5)*1.35,0,-10.3-(i%2)*0.3);day.add(p);aim(p);wear(p,'tough');fo.push(p)}
  const G=infjG(r,GEN);G.position.set(0,0,-4.3);G.rotation.y=Math.PI-0.55;day.add(G);wear(G,'smile');
  const EG=infjG(r,ENEMYG);EG.position.set(0,0,-5.7);EG.rotation.y=0.55;day.add(EG);wear(EG,'smile');
  // 밤 다리
  const night=new THREE.Scene();night.fog=new THREE.Fog(0x2a3360,25,90);
  night.add(new THREE.HemisphereLight(0xb8c4ff,0x2a2a3a,1.05));const dl=new THREE.DirectionalLight(0xc9d4ff,0.9);dl.position.set(-4,10,6);night.add(dl);
  const r2=rng(62);riverSet(night,r2,true);bridge(night);lampPost(night,-4,1.0);lampPost(night,4,1.0);moon(night,-5,8,-26,3);stars(night,220,r2,{w:120,y0:5,h:40,z:-30});
  const NG=infjG(r2,GEN),NE=infjG(r2,ENEMYG);[NG,NE].forEach((p,i)=>{p.position.set(i?0.45:-0.45,0.61,0.75);night.add(p);sitEdge(p);setFace(p,true);p.userData.head.rotation.y=i?-0.3:0.3;
    const m=mug(i?0xffd6e0:0xd6f0ff);holdIn(p,m,i?0:1,0,-0.62,0.08);const mk=maskMesh('smile',0.2);mk.rotation.x=-Math.PI/2;mk.position.set(i?1.05:-1.05,1.13,0.6);night.add(mk)});
  // 강가에 둘씩 앉은 양국 병사들
  for(let i=0;i<10;i++){const x=(i%5-2)*3.4+(i>4?1.7:0),z=i>4?4.6:-4.6;for(let k=0;k<2;k++){const p=infjS(r2,k?FOE:ALLY);p.position.set(x+(k?0.45:-0.45),-0.15,z);p.rotation.y=i>4?Math.PI:0;night.add(p);sitPose(p);setFace(p,true);
    const mk=maskMesh(k?'polite':'smile',0.18);mk.rotation.x=-Math.PI/2;mk.position.set(x+(k?1.0:-1.0),0.02,z);night.add(mk)}}
  const E=EV(5),e7=at(5,'e7'),g7=at(5,'g7'),WK=E.wink,NT=E.night,PL=E.pull,END=E.end;
  const b1=bubF(EG,'오늘은 가만 안 두겠습니다~ㅎㅎ',{size:0.0015,y:2.35}),b2=bubS(G,'저야말로요~ㅎㅎ',{size:0.0017,y:2.35});
  const wk1=topB(textSprite('찡긋',90,'#ffd84d',0.0011));G.add(wk1);wk1.position.set(0.3,2.15,0.3);const wk2=topB(textSprite('찡긋',90,'#ffd84d',0.0011));EG.add(wk2);wk2.position.set(-0.3,2.15,0.3);
  const ch=chip('전쟁 3년째 · 사상자 0명');ch.style.opacity=0;
  const dim=div('dim');const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');e1.style.top='560px';e2.style.top='720px';
  const C=cam(50);
  return t=>{
    const isN=t>NT;
    if(!isN){setSky('#8fc3f0','#eef6ff 70%');
      al.forEach(p=>{standPose(p);aim(p)});fo.forEach(p=>{standPose(p);aim(p)});standPose(G);standPose(EG);
      const k=clamp01((t-e7)/0.3);G.userData.arms[1].rotation.x=-1.6*k;EG.userData.arms[1].rotation.x=-1.6*clamp01((t-0.1)/0.3);
      const w=t>WK&&t<WK+0.5;setMask(G.userData.mask,w?'wink':'smile');setMask(EG.userData.mask,t>WK+0.15&&t<WK+0.65?'wink':'smile');
      scaleBubble(wk1,w?pop((t-WK)/0.2):0);scaleBubble(wk2,t>WK+0.15&&t<WK+0.65?pop((t-WK-0.15)/0.2):0);
      show(b1,t,e7,g7);show(b2,t,g7,WK-0.05);
      if(t<WK-0.05){const k=ease(t/(WK));setCam(C,lerp3([7.6,2.6,-5.0],[6.6,2.5,-5.0],k),[0,2.3,-5.0],36)}
      else{setCam(C,lerp3([3.6,2.45,-4.9],[3.3,2.45,-4.9],ease((t-WK)/0.5)),[0,2.3,-5.0],34)}
      ch.style.opacity=0;dim.style.opacity=0;e1.style.opacity=0;e2.style.opacity=0;caption(5,t);renderer.render(day,C);return}
    setSky('#141a3a','#2f3a6e 75%');
    const k=ease((t-PL)/(END-PL));
    if(t<PL){const k0=ease((t-NT)/2.5);setCam(C,lerp3([0,2.6,5.2],[0,2.6,5.6],k0),[0,2.15,0],42)}
    else setCam(C,lerp3([0,2.6,5.6],[0,9,17],k),lerp3([0,2.15,0],[0,0.2,-1],k),lerp3([42],[55],k)[0]);
    chipShow(ch,t,NT+0.3,END);
    dim.style.opacity=t>END?clamp01((t-END)/0.3):0;e1.style.opacity=t>END?1:0;e2.style.opacity=t>END+0.2?1:0;popEl(e1,t,END);popEl(e2,t,END+0.2);
    caption(5,t);renderer.render(night,C);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.setClearColor(0x000000,0);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
