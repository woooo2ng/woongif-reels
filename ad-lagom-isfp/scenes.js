// ---------- 라곰 협업 ISFP 공용 ----------
const S=[];
const SKIN0=0xf0c9a5,HAIR0=0x1d1d24;
// 주인공: 매끈한 얼굴 + 바가지 머리(시안과 같은 느낌), 옷 색을 장면마다 바꿀 수 있게 메시 참조 보관
function makeHero(o={}){
  const g=new THREE.Group();const skin=o.skin??SKIN0,hair=o.hair??HAIR0;
  const hip=new THREE.Group();hip.position.y=0.8;g.add(hip);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.52,0.64,0.32),lamb(o.shirt??0x9cc3ec));body.position.y=0.32;hip.add(body);
  const legs=[],arms=[],legM=[],armM=[];
  for(const s of[-1,1]){
    const leg=new THREE.Group();leg.position.set(s*0.13,0.02,0);
    const lm=new THREE.Mesh(new THREE.BoxGeometry(0.19,0.8,0.23),lamb(o.pants??0x9cc3ec));lm.position.y=-0.4;leg.add(lm);legM.push(lm);
    const shoe=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.1,0.32),lamb(o.shoe??0x2b2b30));shoe.position.set(0,-0.77,0.05);leg.add(shoe);
    hip.add(leg);legs.push(leg);
    const arm=new THREE.Group();arm.position.set(s*0.34,0.6,0);
    const am=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.58,0.17),lamb(o.shirt??0x9cc3ec));am.position.y=-0.27;arm.add(am);armM.push(am);
    const hand=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.13,0.13),lamb(skin));hand.position.y=-0.6;arm.add(hand);
    hip.add(arm);arms.push(arm);
  }
  const head=new THREE.Group();head.position.y=0.66;hip.add(head);
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.25,48,36),smooth(skin));hm.position.y=0.24;head.add(hm);
  // 본편·전쟁편과 같은 기본 머리(반구를 뒤로 살짝 기울임)
  const top=new THREE.Mesh(new THREE.SphereGeometry(0.265,40,20,0,Math.PI*2,0,Math.PI*0.5),smooth(hair));top.position.y=0.26;top.rotation.x=-0.35;head.add(top);
  if(o.long){const lh=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,20),smooth(hair));lh.scale.set(1.35,1.6,0.6);lh.position.set(0,0.02,-0.16);head.add(lh)}
  const eyes=[],cheeks=[];
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.07,0.02),lamb(0x1a1a1a));e.position.set(s*0.09,0.25,0.24);head.add(e);eyes.push(e);
    const ch=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.035,0.01),basic(0xf2a3a3));ch.position.set(s*0.14,0.17,0.228);head.add(ch);cheeks.push(ch)}
  const mouth=new THREE.Mesh(new THREE.SphereGeometry(0.035,16,12),basic(0x7a2a2a));mouth.scale.set(1,1.25,0.4);mouth.position.set(0,0.12,0.24);mouth.visible=false;head.add(mouth);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(0.04,0.009,6,16,Math.PI),basic(0x5a2a2a));smile.rotation.z=Math.PI;smile.position.set(0,0.15,0.245);smile.visible=false;head.add(smile);
  g.userData={hip,legs,arms,head,body,legM,armM,eyes,cheeks,mouth,smile};
  return g;
}
// 등을 대고 눕기: 머리는 -x(베개), 얼굴은 위(+y)
function lieBack(p,hx,y){const m=new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,-1),new THREE.Vector3(-1,0,0),new THREE.Vector3(0,1,0));p.rotation.setFromRotationMatrix(m);p.position.set(hx+1.7,y,0)}
function eyesK(p,k){p.userData.eyes.forEach(e=>e.scale.y=Math.max(0.12,k))}           // 0.12=감음, 1=보통, 1.5=번쩍
function eyesW(p,k){p.userData.eyes.forEach(e=>{e.scale.x=k;e.scale.y=Math.max(e.scale.y,k)})}
function blush(p,k){p.userData.cheeks.forEach(c=>c.scale.set(k,k,1))}
function setOutfit(p,shirt,pants){const u=p.userData;u.body.material=lamb(shirt);u.armM.forEach(m=>m.material=lamb(shirt));if(pants!=null)u.legM.forEach(m=>m.material=lamb(pants))}
// 귀여운 잠옷: 무늬 텍스처 + 흰 카라 + 단추
const PJ={dot:{bg:'#a8dcc9',fg:'#ffffff',kind:'dot'},stripe:{bg:'#ffd7e4',fg:'#ffffff',kind:'stripe'},check:{bg:'#fff1b8',fg:'#f6c84a',kind:'check'}};
let PJ_STYLE='check';
const _pjTex={};
function pjTex(st){if(_pjTex[st])return _pjTex[st];const o=PJ[st];
  const t=canvasTex(256,256,(x,w,h)=>{x.fillStyle=o.bg;x.fillRect(0,0,w,h);x.fillStyle=o.fg;
    if(o.kind==='dot'){for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.beginPath();x.arc(i*64+32+(j%2)*32,j*64+32,11,0,7);x.fill()}}
    if(o.kind==='stripe'){for(let i=0;i<8;i++)x.fillRect(i*32,0,14,h)}
    if(o.kind==='check'){x.globalAlpha=0.55;for(let i=0;i<4;i++){x.fillRect(i*64,0,28,h);x.fillRect(0,i*64,w,28)}x.globalAlpha=1}});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;return _pjTex[st]=t}
function pajama(p,st=PJ_STYLE){const u=p.userData;const m=new THREE.MeshLambertMaterial({map:pjTex(st),flatShading:true});
  u.body.material=m;u.armM.forEach(a=>a.material=m);u.legM.forEach(a=>a.material=m);
  if(!u.pjExtra){const g=new THREE.Group();u.hip.add(g);u.pjExtra=g;const wc=lamb(0xffffff);
    for(const sd of[-1,1]){const c=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.05,0.12),wc);c.position.set(sd*0.09,0.62,0.15);c.rotation.z=sd*-0.35;c.rotation.x=-0.2;g.add(c)}
    for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.025,10,8),lamb(0xffffff));b.position.set(0,0.5-i*0.15,0.165);g.add(b)}
    // 소매·바짓단 흰 라인
    u.arms.forEach(a=>{const cf=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.05,0.18),wc);cf.position.y=-0.53;a.add(cf)});
    u.legs.forEach(l=>{const cf=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.05,0.24),wc);cf.position.y=-0.68;l.add(cf)});}
  u.pjExtra.visible=true}
function hood(p,col){const h=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.07,8,20,Math.PI),lamb(col));h.rotation.set(Math.PI/2,0,Math.PI);h.position.set(0,0.64,-0.1);p.userData.hip.add(h);return h}
function backpack(p,col=0x6b7fa8){const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.5,0.2),lamb(col));b.position.set(0,0.36,-0.27);p.userData.hip.add(b);return b}
function bub(p,text,o={}){const b=makeBubble(text,{bg:o.bg||'#d9fbe9',fg:o.fg||'#1f5a42',fs:o.fs||70,size:o.size||0.0024});b.position.set(o.x||0,o.y??2.08,o.z||0);p.add(b);scaleBubble(b,0);return b}
function showB(b,t,t0,t1=1e9){const k=t<t1?pop((t-t0)/0.25):1-clamp01((t-t1)/0.15);scaleBubble(b,t>=t0?k:0)}
function sprk(scene,n,r,o){const a=[];for(let i=0;i<n;i++){const s=textSprite('✦',90,o.col||'#fff7c2',o.size||0.0013);scene.add(s);a.push({s,x:o.x+(r()-0.5)*o.w,y:o.y+(r()-0.5)*o.h,z:o.z+(r()-0.5)*(o.d||0.1),ph:r()})}return a}
function updSprk(a,t,t0,t1=1e9){a.forEach(q=>{const lt=((t-t0)*1.3+q.ph)%1;const on=t>t0&&t<t1;q.s.visible=on;q.s.position.set(q.x,q.y+lt*0.05,q.z);const k=Math.sin(lt*Math.PI)*(on?1:0);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)})}

// ---------- 라곰 셀럽 마이크로 폼 클렌저 튜브 ----------
// 실제 제품: 흰 무광 튜브, 아래가 원형 캡(세워 두는 형태), 위는 납작하게 눌린 끝. 로고·문구는 정면(+z), 좌우반전 없음
function tubeLabel(){
  return canvasTex(4096,2800,(x,w,h)=>{x.scale(2,2);w=2048;h=1400;
    x.fillStyle='#f4f4f2';x.fillRect(0,0,w,h);
    {const g=x.createLinearGradient(0,0,w*0.5,0);g.addColorStop(0,'rgba(0,0,0,0.10)');g.addColorStop(0.2,'rgba(255,255,255,0)');g.addColorStop(0.3,'rgba(255,255,255,0.85)');g.addColorStop(0.36,'rgba(255,255,255,0.15)');g.addColorStop(0.75,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,0.12)');x.fillStyle=g;x.fillRect(0,0,w*0.5,h)}
    // 정면은 u=0.25(가로 512px 부근) — 아래에서 x 좌표를 u로 맞춰 그림
    const cx=w*0.25;x.fillStyle='#111';x.textAlign='center';x.textBaseline='middle';
    x.font=`300 150px "Noto Sans CJK KR"`;x.letterSpacing='18px';x.fillText('LAGOM',cx+9,h*0.30);
    x.font=`500 30px "Noto Sans CJK KR"`;x.letterSpacing='2px';x.fillText('NOT TOO LITTLE, NOT TOO MUCH',cx,h*0.38);
    x.font=`700 40px "Noto Sans CJK KR"`;x.letterSpacing='3px';x.fillText('CELLUP',cx,h*0.555);x.fillText('MICRO FOAM CLEANSER',cx,h*0.595);
    // 저울 아이콘
    x.strokeStyle='#111';x.lineWidth=5;const iy=h*0.70;
    x.beginPath();x.moveTo(cx-46,iy);x.lineTo(cx+46,iy);x.moveTo(cx,iy-14);x.lineTo(cx,iy+30);x.moveTo(cx-20,iy+30);x.lineTo(cx+20,iy+30);x.stroke();
    for(const s of[-1,1]){x.beginPath();x.arc(cx+s*42,iy+14,16,0,Math.PI);x.stroke();x.beginPath();x.moveTo(cx+s*42-16,iy+14);x.lineTo(cx+s*42,iy);x.lineTo(cx+s*42+16,iy+14);x.stroke()}
    x.font=`500 26px "Noto Sans CJK KR"`;x.letterSpacing='1px';x.fillText('150mL · 5.07 FL.OZ.',cx,h*0.80);
    x.letterSpacing='0px';
  });
}
let _tubeTex=null;
function makeTube(){
  const g=new THREE.Group();_tubeTex=_tubeTex||tubeLabel();
  // 단면: 아래(캡 쪽) 원형 → 위로 갈수록 가로로 넓어지고 앞뒤로 납작해짐
  const SEG=160,HS=80,H=1.5;const pos=[],uv=[],idx=[];
  for(let j=0;j<=HS;j++){const v=j/HS;const rx=0.36+0.17*Math.pow(v,1.1),rz=0.36*(1-Math.pow(v,1.6))+0.025;
    for(let i=0;i<=SEG;i++){const u=i/SEG,th=u*Math.PI*2;pos.push(-rx*Math.cos(th),v*H,rz*Math.sin(th));uv.push(u,v)}}
  for(let j=0;j<HS;j++)for(let i=0;i<SEG;i++){const a=j*(SEG+1)+i,b=a+SEG+1;idx.push(a,a+1,b,b,a+1,b+1)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
  const body=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:_tubeTex,roughness:0.5,metalness:0,emissive:0x343436}));body.position.y=0.36;g.add(body);
  const crimp=new THREE.Mesh(new THREE.BoxGeometry(1.08,0.1,0.06),new THREE.MeshLambertMaterial({color:0xefefec,emissive:0x2a2a28}));crimp.position.y=0.36+H+0.03;g.add(crimp);
  for(let i=0;i<9;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(0.008,0.08,0.065),basic(0xd8d8d4));l.position.set(-0.48+i*0.12,0.36+H+0.03,0);g.add(l)}
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.37,0.37,0.36,96),new THREE.MeshStandardMaterial({color:0xf7f7f5,roughness:0.4,emissive:0x343436}));cap.position.y=0.18;g.add(cap);
  const ring=new THREE.Mesh(new THREE.CylinderGeometry(0.372,0.372,0.02,48),basic(0xdcdcd8));ring.position.y=0.355;g.add(ring);
  // 바닥 접지 그림자(부드러운 원형 그라데이션)
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.0),new THREE.MeshBasicMaterial({map:canvasTex(256,256,(x,w,h)=>{const gr=x.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'rgba(40,50,48,0.55)');gr.addColorStop(0.45,'rgba(40,50,48,0.28)');gr.addColorStop(1,'rgba(40,50,48,0)');x.fillStyle=gr;x.fillRect(0,0,w,h)}),transparent:true,depthWrite:false}));
  sh.rotation.x=-Math.PI/2;sh.position.set(0.12,0.006,0.06);g.add(sh);
  g.userData={body};return g;
}
function tubeLights(scene,tube){ // 튜브 왼쪽 앞에서 비추는 소프트 키라이트 → 세로 하이라이트
  const k=new THREE.PointLight(0xffffff,6,4,1.6);k.position.set(tube.position.x-0.55,tube.position.y+0.75,tube.position.z+0.9);scene.add(k);
  const rim=new THREE.PointLight(0xe8fff6,3,3,1.6);rim.position.set(tube.position.x+0.5,tube.position.y+0.6,tube.position.z-0.4);scene.add(rim)}
// 쫀쫀한 미세 거품: 작은 매끈 구를 촘촘하게
function makeFoam(r,n,rad,o={}){const g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:0xffffff,emissive:0x3a3c40});
  const geo=new THREE.SphereGeometry(1,14,10);const items=[];
  for(let i=0;i<n;i++){const u=r(),v=r();const th=u*Math.PI*2,ph=Math.acos(2*v-1);const rr_=rad*Math.cbrt(r());
    const s=new THREE.Mesh(geo,m);const sz=(o.min??0.018)+r()*((o.max??0.04)-(o.min??0.018));s.scale.setScalar(sz);
    s.position.set(rr_*Math.sin(ph)*Math.cos(th)*(o.sx||1),rr_*Math.cos(ph)*(o.sy||0.75),rr_*Math.sin(ph)*Math.sin(th)*(o.sz||1));g.add(s);items.push({s,d:s.position.length()/rad,sz})}
  g.userData.items=items;return g}
function foamK(f,k){f.userData.items.forEach(q=>{const kk=clamp01((k-q.d*0.6)/0.4);q.s.scale.setScalar(q.sz*pop(kk));q.s.visible=kk>0.01})}
function tileTex(col,line,n=8){return canvasTex(512,512,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);x.strokeStyle=line;x.lineWidth=8;for(let i=0;i<=n;i++){x.beginPath();x.moveTo(i*w/n,0);x.lineTo(i*w/n,h);x.stroke();x.beginPath();x.moveTo(0,i*h/n);x.lineTo(w,i*h/n);x.stroke()}})}
function bubbles(scene,n,r,o){const a=[];const m=new THREE.MeshLambertMaterial({color:0xcfeee8,transparent:true,opacity:0.55,emissive:0x203a36});
  for(let i=0;i<n;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),m);const sz=0.04+r()*0.08;s.scale.setScalar(sz);scene.add(s);a.push({s,x:o.x+(r()-0.5)*o.w,y:o.y+r()*o.h,z:o.z+(r()-0.5)*o.d,ph:r(),sp:0.1+r()*0.15})}return a}
function updBubbles(a,t){a.forEach(q=>{q.s.position.set(q.x+Math.sin(t*1.5+q.ph*6)*0.05,q.y+((t*q.sp+q.ph)%1)*0.8,q.z)})}

// ---------- 방(침실) 공용 ----------
function bedroom(scene,r,o={}){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xdcb58c));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(30,8,0.2),lamb(0xf7e6d6));wall.position.set(0,4,-2.2);scene.add(wall);
  const wall2=new THREE.Mesh(new THREE.BoxGeometry(0.2,8,30),lamb(0xf2dccb));wall2.position.set(-3.6,4,0);scene.add(wall2);
  // 창문 + 커튼(햇빛)
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.5),basic(0xfff3c4));win.position.set(1.6,2.5,-2.09);scene.add(win);
  const wf=new THREE.Mesh(new THREE.BoxGeometry(1.95,0.08,0.08),lamb(0xffffff));wf.position.set(1.6,2.5,-2.06);scene.add(wf);
  const wf2=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.6,0.08),lamb(0xffffff));wf2.position.set(1.6,2.5,-2.06);scene.add(wf2);
  for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.BoxGeometry(0.5,1.9,0.06),lamb(0xbfe8d6));c.position.set(1.6+s*1.05,2.45,-2.02);scene.add(c)}
  const sun=glowSprite('rgba(255,240,190,1)',4);sun.position.set(1.6,2.5,-1.9);scene.add(sun);
  // 침대: 머리맡은 -x 쪽 벽
  const bed=new THREE.Group();scene.add(bed);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.35,1.5),lamb(0xb98a62));fr.position.set(-2.1,0.18,0);bed.add(fr);
  const mt=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.22,1.42),lamb(0xffffff));mt.position.set(-2.1,0.46,0);bed.add(mt);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(0.12,1.1,1.5),lamb(0xa77a54));hb.position.set(-3.3,0.55,0);bed.add(hb);
  const pil=new THREE.Mesh(new THREE.SphereGeometry(0.4,24,16),smooth(0xfff9ee));pil.scale.set(0.65,0.28,1.25);pil.position.set(-2.95,0.66,0);bed.add(pil);
  // 협탁 + 폰
  const ns=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,0.6),lamb(0xc89c72));ns.position.set(-2.95,0.3,1.2);scene.add(ns);
  const ph=new THREE.Group();ph.position.set(-2.85,0.62,1.1);scene.add(ph);
  const pb=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.025,0.34),lamb(0x22222a));ph.add(pb);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.15,0.3),basic(0x2a3346));scr.rotation.x=-Math.PI/2;scr.position.y=0.014;ph.add(scr);
  // 러그·문
  const rug=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),lamb(0xf2c6d6));rug.rotation.x=-Math.PI/2;rug.position.set(0.4,0.01,0.6);scene.add(rug);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.3,0.08),lamb(0xe9d2b8));door.position.set(3.3,1.15,-2.07);scene.add(door);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),lamb(0xc9a050));knob.position.set(2.88,1.1,-2.0);scene.add(knob);
  return {bed,phone:ph,scr,mtTop:0.57};
}
// 이불 덩어리(매끈한 언덕)
function blanket(scene,col=0xbfe8d6){const b=new THREE.Mesh(new THREE.SphereGeometry(1,40,24,0,Math.PI*2,0,Math.PI/2),smooth(col));b.scale.set(1.0,0.56,0.8);b.position.set(-1.75,0.56,0);scene.add(b);return b}

// ---------- S0 알람 5분마다, 전부 끄기 (타이틀) ----------
S[0]=()=>{
  bgEl.style.background='linear-gradient(#fff4e3,#ffe9d2)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sky:0xfff6e8,ground:0xb08a6a,dir:1.3,dpos:[3,8,6]});
  const r=rng(1101);const R=bedroom(scene,r);const bl=blanket(scene);
  const hero=makeHero({shirt:0x9cc3ec,pants:0x9cc3ec});lieBack(hero,-2.72,0.72);eyesK(hero,0.12);scene.add(hero);pajama(hero);
  // 주인공의 진짜 오른팔이 이불 밖으로 나와 협탁 폰을 탁 (폰은 손이 닿는 자리로)
  R.phone.position.set(-2.8,0.62,1.02);
  const hArm=hero.userData.arms[0];
  const dW=new THREE.Vector3(-2.8-(-2.42),0.66-0.72,1.02-0.34).normalize();
  const dL=new THREE.Vector3(-dW.z,-dW.x,dW.y).normalize();
  const qTarget=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0),dL);
  const qRest=new THREE.Quaternion();
  const zz=[];for(let i=0;i<3;i++){const z=textSprite('Z',70+i*14,'#8fb0ff',0.004);scene.add(z);zz.push(z)}
  const beep=textSprite('삐비빅!',80,'#ff6a6a',0.0028);scene.add(beep);
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,100);
  ui.innerHTML='<div class="t1b out">ISFP가</div><div class="t2b out">약속 1시간 전이라면?</div><div class="clock">AM 11:00 · 약속 12:00</div>';
  const t1=ui.querySelector('.t1b'),t2=ui.querySelector('.t2b'),ck=ui.querySelector('.clock');
  const ROWS=['11:00','11:05','11:10','11:15'];
  const al=document.createElement('div');al.className='alarms';al.innerHTML='<div class="hd">알람</div>'+ROWS.map(x=>`<div class="row"><div class="tm"><small>오전</small>${x}</div><div class="tg"><i></i></div></div>`).join('');ui.appendChild(al);
  const rows=[...al.querySelectorAll('.row')];
  const RING=[[0.15,1.1],[1.6,2.5]];
  return t=>{
    // 알람 울림 → 손이 쑥 나와 탁 → 다시 들어감
    let ring=false,reach=0;
    for(const [a,b] of RING){if(t>=a&&t<b)ring=true;if(t>=b-0.35&&t<b+0.4){reach=t<b?ease((t-(b-0.35))/0.3):1-ease((t-b-0.1)/0.3)}}
    R.phone.position.x=-2.8+(ring?Math.sin(t*90)*0.012:0);R.scr.material.color.set(ring?0xbfe6ff:0x2a3346);
    beep.visible=ring;beep.position.set(-2.3,1.15+Math.sin(t*20)*0.02,1.3);beep.visible=ring&&t>0.5;
    const tap=(t>1.1&&t<1.25)||(t>2.5&&t<2.65)?1:0;
    hArm.quaternion.copy(qRest).slerp(qTarget,reach);hArm.scale.y=1+reach*0.12-tap*0.06;
    bl.scale.y=0.56+Math.sin(t*2.2)*0.012;
    zz.forEach((z,i)=>{const lt=((t*0.5+i/3)%1);z.position.set(-2.6+lt*0.3,1.15+lt*0.6,0.1);const k=Math.sin(lt*Math.PI)*(ring?0.2:1)*(t>2.9?1:0);z.scale.set(z.userData.base[0]*k,z.userData.base[1]*k,1)});
    // 타이틀 → 알람 목록
    const tOut=1-clamp01((t-2.75)/0.25);
    t1.style.transform=`scale(${pop(t/0.35)*tOut})`;t1.style.opacity=clamp01(t/0.1)*tOut;
    t2.style.transform=`scale(${pop((t-0.25)/0.4)*tOut})`;t2.style.opacity=clamp01((t-0.25)/0.1)*tOut;
    ck.textContent=t<1.6?'AM 11:00 · 약속 12:00':t<3.0?'AM 11:05 · 약속 12:00':'AM 11:15 · 약속 12:00';chipPop(ck,t,0);
    al.style.opacity=clamp01((t-2.95)/0.12);al.style.transform=`scale(${0.7+0.3*pop((t-2.95)/0.35)})`;
    rows.forEach((rw,i)=>rw.classList.toggle('off',t>5.05+i*0.32));
    cam.position.set(-0.5,3.3,3.9);cam.lookAt(-2.35,0.82,0.35);
    caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- S1 기상: 11:20, 늦겠다!! ----------
S[1]=()=>{
  bgEl.style.background='linear-gradient(#fff4e3,#ffe9d2)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sky:0xfff6e8,ground:0xb08a6a,dir:1.3,dpos:[3,8,6]});
  const r=rng(1102);const R=bedroom(scene,r);const bl=blanket(scene);
  const p=makeHero({shirt:0x9cc3ec,pants:0x9cc3ec});scene.add(p);pajama(p);
  const u=p.userData;
  const sl1=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.08,0.34),lamb(0xffb3c7));scene.add(sl1);
  const ex=textSprite('!',140,'#ff5a7a',0.0018);scene.add(ex);
  const cam=new THREE.PerspectiveCamera(40,W/H,0.1,100);
  const ck=chip('');
  return t=>{
    const T0=1.95; // 이불 걷어차는 시각
    if(t<T0){ // 누워 있음: 얼굴만 이불 위로
      standPose(p);lieBack(p,-2.72,0.72);
      eyesK(p,t<0.55?0.12:1);eyesW(p,t<0.55?1:1+0.5*pop((t-0.55)/0.2));
      u.mouth.visible=t>1.0&&t<1.9;
      bl.position.set(-1.75,0.56,0);bl.rotation.set(0,0,0);
    }else{ // 벌떡 → 오른쪽 문으로 질주
      const run=clamp01((t-T0-0.15)/1.4);p.rotation.set(0,Math.PI/2,0);
      p.position.set(-1.2+run*5.0,Math.max(0,Math.sin(clamp01((t-T0)/0.3)*Math.PI)*0.5),0.95+run*0.3);
      walkPose(p,t*16,0.9);eyesK(p,1);eyesW(p,1.5);u.mouth.visible=true;
      const bk=ease((t-T0)/0.5);bl.position.set(-1.75-bk*0.6,0.56+Math.sin(bk*Math.PI)*1.2,-bk*0.3);bl.rotation.z=bk*1.2;
    }
    // 슬리퍼 한 짝 날아감
    const sk=clamp01((t-2.3)/0.7);sl1.position.set(-1.0+sk*2.2,0.05+Math.sin(sk*Math.PI)*1.3,0.7-sk*0.6);sl1.rotation.set(sk*9,sk*5,0);
    ex.visible=false;ex.position.set(-3.0,1.3,0.35);ex.scale.set(ex.userData.base[0]*pop((t-0.55)/0.2),ex.userData.base[1]*pop((t-0.55)/0.2),1);
    ck.innerHTML='AM 11:20 · 약속까지 <b>40분</b>';chipPop(ck,t,0.45);
    const zk=1+0.12*Math.max(0,Math.sin(clamp01((t-0.45)/0.5)*Math.PI));ck.style.transform+=` scale(${zk})`;
    const pull=ease((t-T0)/0.8);
    cam.position.set(-2.1+pull*3.4,2.15+pull*1.4,1.15+pull*3.6);cam.lookAt(-2.72+pull*2.6,1.0+pull*0.4,-0.05);
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- S2 샤워 + 세안 (제품 노출) ----------
function bathroom(scene){
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(14,10),new THREE.MeshLambertMaterial({map:(()=>{const t=tileTex('#a9d3c6','#93c0b2',8);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2);return t})()}));wall.position.set(0,3,-1.6);scene.add(wall);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(14,10),lamb(0xe8e2d6));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(5,1.1,1.1),lamb(0xd9cdbd));cab.position.set(0,0.55,-0.2);scene.add(cab);
  for(const x of[-1.25,1.25]){const d=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.95,0.02),lamb(0xe6dccf));d.position.set(x,0.52,0.36);scene.add(d);const hd=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.05,0.04),lamb(0x9a8f84));hd.position.set(x,0.86,0.39);scene.add(hd)}
  const top=new THREE.Mesh(new THREE.BoxGeometry(5.1,0.1,1.2),lamb(0xf2f1ee));top.position.set(0,1.15,-0.2);scene.add(top);
  const sink=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.3,0.12,24),lamb(0xd7dcde));sink.position.set(0.3,1.24,-0.35);scene.add(sink);
  
  // 뒤쪽 샤워기 + 물줄기
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.1,0.08,16),lamb(0xb0b6ba));sh.position.set(-1.9,3.2,-1.3);sh.rotation.x=0.4;scene.add(sh);
  const pipe=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.2,8),lamb(0xb0b6ba));pipe.position.set(-1.9,3.7,-1.5);scene.add(pipe);
  const drops=[];const dm=basic(0xbfe3f2);for(let i=0;i<26;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(0.012,0.18,0.012),dm);scene.add(d);drops.push({d,x:-1.9+(Math.random()-0.5)*0.28,z:-1.25+(Math.random()-0.5)*0.2,ph:Math.random()})}
  const steam=[];for(let i=0;i<5;i++){const s=glowSprite('rgba(255,255,255,1)',1.4);scene.add(s);steam.push({s,ph:i/5})}
  return {drops,steam,sinkY:1.24};
}
function updBath(B,t){B.drops.forEach(q=>{const lt=(t*2.2+q.ph)%1;q.d.position.set(q.x,3.1-lt*1.9,q.z)});
  B.steam.forEach(q=>{const lt=(t*0.25+q.ph)%1;q.s.position.set(-1.9+Math.sin(lt*5)*0.4,1.6+lt*1.6,-1.1);q.s.material.opacity=Math.sin(lt*Math.PI)*0.35})}
S[2]=()=>{
  bgEl.style.background='linear-gradient(#bfe0d6,#d9eee8)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,sky:0xffffff,ground:0x9ab0a8,dir:1.2,dpos:[2,6,6]});
  const r=rng(1103);const B=bathroom(scene);
  const p=makeHero({shirt:0x9cc3ec,pants:0x9cc3ec});p.position.set(0.3,0,-1.05);scene.add(p);pajama(p);const u=p.userData;
  const tube=makeTube();tube.scale.setScalar(0.36);tube.position.set(-0.1,1.2,0.3);scene.add(tube);
  // 손 위 거품
  const fh=makeFoam(r,140,0.16,{min:0.014,max:0.034,sy:0.6});scene.add(fh);
  // 얼굴 거품(볼·이마·턱)
  const ff=[];for(const [x,y,z,rad,n] of [[-0.12,0.2,0.2,0.09,60],[0.12,0.2,0.2,0.09,60],[0,0.36,0.2,0.08,50],[0,0.08,0.22,0.07,40],[0,0.24,0.25,0.05,25]]){const f=makeFoam(r,n,rad,{min:0.012,max:0.028});f.position.set(x,y,z);u.head.add(f);ff.push(f)}
  const bb=bubbles(scene,14,r,{x:0.2,y:1.9,z:-0.6,w:3,h:1.6,d:0.6});
  const sp=sprk(scene,8,r,{x:0.3,y:2.15,z:-0.75,w:0.8,h:0.55,col:'#fffbd8'});
  const drops=[];for(let i=0;i<16;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.025,8,6),basic(0xa9dcf2));scene.add(d);drops.push({d,vx:(r()-0.5)*1.6,vy:0.5+r()*1.2,vz:0.4+r()*0.6})}
  const cam=new THREE.PerspectiveCamera(36,W/H,0.1,100);
  const ck=chip('');
  return t=>{
    updBath(B,t);updBubbles(bb,t);
    const CUT=2.4;
    // 손 동작: 0~1 손 모으기, 1.0 펌프(튜브 살짝 눌림), 1.25~2.2 거품 커짐 → 2.4부터 얼굴에
    const handsUp=t<CUT?ease((t-0.2)/0.5):1;
    u.arms.forEach((a,i)=>{a.rotation.x=-1.5*handsUp-(t>=CUT&&t<3.7?0.45+Math.sin(t*14+i)*0.12:0);a.rotation.z=(i?-0.42:0.42)*handsUp});
    const press=t>0.9&&t<1.15?Math.sin((t-0.9)/0.25*Math.PI):0;tube.scale.set(0.36*(1+press*0.06),0.36*(1-press*0.05),0.36);
    fh.position.set(0.3,1.62,-0.62);foamK(fh,t<CUT?clamp01((t-1.2)/1.0):1-clamp01((t-CUT)/0.3));fh.visible=t<CUT+0.3;
    const faceF=t<CUT?0:t<3.7?clamp01((t-CUT)/0.8):1-clamp01((t-3.7)/0.15);ff.forEach(f=>foamK(f,faceF));
    eyesK(p,t<CUT?1:0.12);eyesW(p,t<CUT?1.35:1);u.mouth.visible=t<CUT;u.smile.visible=t>=4.0;
    drops.forEach(q=>{const lt=t-3.7;q.d.visible=lt>0&&lt<0.8;q.d.position.set(0.3+q.vx*lt,2.15+q.vy*lt-3*lt*lt,-0.65+q.vz*lt)});
    updSprk(sp,t,4.6);
    if(t<CUT){cam.fov=36;cam.position.set(0.02,1.85,2.6);cam.lookAt(0.05,1.62,-0.3)}
    else{const k=ease((t-CUT)/3.5);cam.fov=34;cam.position.set(0.0,2.3,2.6-k*0.15);cam.lookAt(0.1,2.0,-0.5)}
    cam.updateProjectionMatrix();
    ck.innerHTML=t<CUT?'AM 11:28 · 약속까지 <b>32분</b>':'AM 11:35 · 약속까지 <b>25분</b>';chipPop(ck,t,0.1);
    caption(2,t);renderer.render(scene,cam);
  };
};

// ---------- S3 거울 셀카 (제품 없음 — 좌우반전 방지) ----------
S[3]=()=>{
  bgEl.style.background='linear-gradient(#bfe0d6,#d9eee8)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,sky:0xffffff,ground:0x9ab0a8,dir:1.2,dpos:[1,5,7]});
  const r=rng(1104);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(14,10),new THREE.MeshLambertMaterial({map:(()=>{const t=tileTex('#a9d3c6','#93c0b2',8);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2);return t})()}));wall.position.set(0,3,-1.5);scene.add(wall);
  const p=makeHero({shirt:0x9cc3ec,pants:0x9cc3ec});scene.add(p);pajama(p);const u=p.userData;
  const tw=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.05,10,24),lamb(0xd7f2ea));tw.rotation.x=Math.PI/2;tw.scale.set(1.3,1,1);tw.position.set(0,0.64,0.02);u.hip.add(tw);
  const ph=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a));
  const sp=sprk(scene,10,r,{x:0,y:2.1,z:0.32,w:0.8,h:0.55,col:'#fffbd8',size:0.0012});
  const cam=new THREE.PerspectiveCamera(32,W/H,0.1,100);
  const ck=chip('');
  ui.insertAdjacentHTML('beforeend','<div class="mirror"></div><div class="flash"></div>');const fl=ui.querySelector('.flash');
  return t=>{
    const iE=lineT(3,'i2').t1;
    standPose(p);
    // 볼 콕(0.4~1.0), 미소, 셀카(대사 끝 후)
    const poke=ease((t-0.4)/0.3)*(1-ease((t-1.6)/0.3));
    u.arms[0].rotation.x=-2.3*poke;u.arms[0].rotation.z=-0.55*poke;
    const sf=ease((t-(iE+0.0))/0.25);
    u.arms[1].rotation.x=-2.2*sf;u.arms[1].rotation.z=0.35*sf;
    if(sf>0&&!ph.parent){ph.position.set(0,-0.68,0.08);u.arms[1].add(ph)}
    const SH=[iE+0.25,iE+0.65,iE+1.05];
    let pose=-1;SH.forEach((s,i)=>{if(t>=s-0.05)pose=i});
    u.head.rotation.z=pose<0?Math.sin(t*1.2)*0.04:[0.22,-0.2,0.08][pose];
    if(pose===1){u.arms[0].rotation.x=-2.6;u.arms[0].rotation.z=-0.2}
    eyesK(p,t>0.9&&t<iE+0.2?0.12:1);u.smile.visible=t>0.9;blush(p,1+0.4*clamp01((t-0.9)/0.4));
    let fk=0;SH.forEach(s=>{if(t>s&&t<s+0.18)fk=1-(t-s)/0.18});fl.style.opacity=fk*0.85;
    updSprk(sp,t,0.15);
    cam.position.set(0,2.0,3.3);cam.lookAt(0,1.72,0);
    ck.innerHTML=`AM 11:42 · 약속까지 <b>18분</b>`;chipPop(ck,t,0.1);
    caption(3,t);renderer.render(scene,cam);
  };
};

// ---------- S4 옷 7벌 → 늘 입던 후드 ----------
S[4]=()=>{
  bgEl.style.background='linear-gradient(#fff4e3,#ffe9d2)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sky:0xfff6e8,ground:0xb08a6a,dir:1.3,dpos:[2,7,6]});
  const r=rng(1105);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xdcb58c));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(30,8,0.2),lamb(0xf7e6d6));wall.position.set(0,4,-2);scene.add(wall);
  // 열린 옷장 + 걸린 옷
  const wd=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.6,0.7),lamb(0xc89c72));wd.position.set(-0.2,1.3,-1.6);scene.add(wd);
  const inn=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.4,0.1),lamb(0x8a6a4a));inn.position.set(-0.2,1.3,-1.22);scene.add(inn);
  for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.BoxGeometry(1.25,2.5,0.06),lamb(0xd6ac80));d.position.set(-0.2+s*1.75,1.3,-0.95);d.rotation.y=s*0.9;scene.add(d)}
  const rod=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,2.3,8),lamb(0xb0b0b0));rod.rotation.z=Math.PI/2;rod.position.set(-0.2,2.3,-1.15);scene.add(rod);
  const HC=[0xe39a6b,0xa58cd0,0x8cc9a0,0xe0c070,0xd98c8c,0x6c8ebf,0xc7a3c9,0x90b86c,0xffffff,0xf2b8c6];
  HC.forEach((c,i)=>{const h=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.75,0.4),lamb(c));h.position.set(-1.25+i*0.235,1.88,-1.15);h.rotation.y=(r()-0.5)*0.3;scene.add(h)});
  const mir=new THREE.Mesh(new THREE.BoxGeometry(0.7,2.0,0.06),lamb(0xe9eef0));mir.position.set(2.4,1.1,-1.6);scene.add(mir);
  const p=makeHero({shirt:0x9cc3ec,pants:0x9cc3ec});p.position.set(0.1,0,0.3);scene.add(p);const u=p.userData;pajama(p);
  const OUT=[[0xe39a6b,0x33384a],[0xa58cd0,0xe8e2d6],[0x8cc9a0,0x2c4058],[0xe0c070,0x3d3a36],[0xd98c8c,0x55506a],[0x6c8ebf,0xe8e2d6],[0xffffff,0x2c4058]];
  const CH=[0.45,0.85,1.2,1.5,1.78,2.04,2.28],FINAL=3.55,GREY=0x9a9ca6;
  const pile=[];OUT.concat([[0x9cc3ec,0x9cc3ec]]).forEach((o,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.08,0.48),lamb(o[0]));m.rotation.y=(r()-0.5)*1.2;scene.add(m);pile.push(m)});
  const hd=hood(p,GREY);hd.visible=false;
  const puff=glowSprite('rgba(255,255,255,1)',2.4);scene.add(puff);
  const lbl=labelSprite('늘 입던 그 후드 ✔',{fs:62,bg:'#2b2b3a',fg:'#ffd84d',size:0.0034});lbl.position.set(-0.75,1.2,0.6);scene.add(lbl);
  const cam=new THREE.PerspectiveCamera(40,W/H,0.1,100);
  const ck=chip('');
  return t=>{
    standPose(p);
    let n=0;CH.forEach(c=>{if(t>=c)n++});
    const fin=t>=FINAL;
    if(fin){setOutfit(p,GREY,0x3d3a36);hd.visible=true;u.pjExtra.visible=false}else if(n>0){setOutfit(p,OUT[n-1][0],OUT[n-1][1]);u.pjExtra.visible=false}else pajama(p);
    // 바닥 옷 더미: 벗은 옷이 하나씩 쌓임
    pile.forEach((m,i)=>{const on=fin?i<=7:i<n;m.visible=on&&i<n+ (fin?1:0);m.position.set(1.25+((i*37)%5-2)*0.05,0.04+i*0.075,0.55+((i*53)%5-2)*0.04)});
    // 갈아입을 때마다 펑 + 살짝 점프
    let pk=0;CH.concat([FINAL]).forEach(c=>{if(t>c-0.05&&t<c+0.25)pk=1-(t-c+0.05)/0.3});
    puff.position.set(0.1,1.35,0.4);puff.material.opacity=pk*0.95;puff.visible=pk>0;
    p.position.y=pk>0?Math.sin(pk*Math.PI)*0.08:0;
    u.arms.forEach((a,i)=>{a.rotation.z=(i?-1:1)*(fin?0.1:0.35+0.25*Math.sin(t*9))});
    eyesK(p,1);u.smile.visible=fin;p.rotation.y=fin?0:Math.sin(t*6)*0.25;
    scaleBubble(lbl,0);
    cam.position.set(0.8,2.1,4.4);cam.lookAt(0.3,1.25,0);
    const left=t<CH[0]?12:t<FINAL?12-Math.min(n,7)*0.25:10;
    ck.innerHTML=`AM 11:50 · 약속까지 <b>${Math.round(left)}분</b>`;chipPop(ck,t,0.1);
    let st=ui.querySelector('.stat');if(!st){st=document.createElement('div');st.className='stat';ui.appendChild(st)}
    st.innerHTML=`입어 본 옷 <b>${Math.min(n,7)}벌</b>`;st.style.opacity=t>CH[0]?1:0;st.style.transform=`translateX(-50%) scale(${pop((t-CH[0])/0.3)})`;
    caption(4,t);renderer.render(scene,cam);
  };
};

// ---------- S5 준비 끝 → 침대 유혹 → 누워서 '거의 다 왔어!' ----------
S[5]=()=>{
  bgEl.style.background='linear-gradient(#fff4e3,#ffe9d2)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sky:0xfff6e8,ground:0xb08a6a,dir:1.3,dpos:[3,8,6]});
  const r=rng(1106);const R=bedroom(scene,r);
  const bl=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.08,1.38),lamb(0xbfe8d6));bl.position.set(-1.7,0.6,0);scene.add(bl);
  const p=makeHero({shirt:0x9a9ca6,pants:0x3d3a36});scene.add(p);const u=p.userData;hood(p,0x9a9ca6);backpack(p);
  const halo=glowSprite('rgba(255,236,170,1)',3.0);halo.position.set(-2.0,1.2,0.1);scene.add(halo);
  const rays=[];for(let i=0;i<8;i++){const ry=new THREE.Mesh(new THREE.PlaneGeometry(0.06,1.4),new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:0.7,side:THREE.DoubleSide}));scene.add(ry);rays.push(ry)}
  const think=bub(p,'…잠깐만',{y:2.2,size:0.0026});const phn=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a));
  const ex=textSprite('!!',130,'#ff5a7a',0.0045);scene.add(ex);
  const cam=new THREE.PerspectiveCamera(40,W/H,0.1,100);
  const ck=chip('');
  const chat=document.createElement('div');chat.className='chat';chat.innerHTML='<div class="hd">우리 넷 (4)</div><div class="ms"><div class="r"><div class="av"></div><div class="b">어디야?</div></div><div class="r me" style="display:none"><div class="b">거의 다 왔어!</div></div></div><div class="in"></div>';ui.appendChild(chat);
  const inp=chat.querySelector('.in'),mine=chat.querySelector('.me');
  return t=>{
    const SIT=2.05,LIE0=3.5,LIE1=5.3,TOP=5.75,UP=7.25,BX=-1.0,BZ=0.98;
    standPose(p);u.hip.rotation.set(0,0,0);p.rotation.set(0,0,0);
    if(t<1.0){p.position.set(-0.2+t*1.3,0,1.1);p.rotation.y=Math.PI/2;walkPose(p,t*9,0.5)}
    else if(t<SIT){const k=ease((t-1.15)/0.85);p.rotation.y=Math.PI/2+k*Math.PI*0.5+(t<1.15?0:0);p.position.set(1.1+(BX-1.1)*k,0,1.1+(BZ-1.1)*k);
      if(k<0.85)walkPose(p,t*8,0.4);if(k>0.5)p.rotation.y=Math.PI*1.0+ (k-0.5)*2*Math.PI; }
    const LYING=t>=TOP&&t<UP;
    // 스르륵: 천천히 기울다 → 멈칫 버티기 → 다시 스르륵 → 털썩
    const sl=clamp01((t-LIE0)/(LIE1-LIE0));let th;
    if(sl<0.35)th=0.38*ease(sl/0.35);else if(sl<0.55)th=0.38-0.07*Math.sin((sl-0.35)/0.2*Math.PI);else{const q=(sl-0.55)/0.45;th=0.38+1.07*q*q*q}
    if(t>LIE1)th=1.45+0.05*Math.sin(clamp01((t-LIE1)/0.25)*Math.PI)*Math.exp(-(t-LIE1)*6);
    if(t>=SIT&&t<UP&&!LYING){p.rotation.y=0;sitPose(p);const hx=BX-0.1*th/1.45,hy=0.64+0.19*th/1.45;p.rotation.z=th;p.position.set(hx+0.56*Math.sin(th),hy-0.56*Math.cos(th),BZ)}
    else if(LYING){standPose(p);lieBack(p,-2.72,0.74);u.legs[0].rotation.x=0.15;u.legs[1].rotation.x=-0.1;
      u.arms[1].rotation.x=-1.25;u.arms[1].rotation.z=-0.25;u.arms[0].rotation.z=0.4;if(!phn.parent){phn.position.set(0,-0.68,0.1);u.arms[1].add(phn)}}
    if(t>=UP&&phn.parent)phn.parent.remove(phn);
    if(t<UP&&!LYING&&phn.parent)phn.parent.remove(phn);
    if(t>=UP){const k=ease((t-UP)/0.2);const run=clamp01((t-UP-0.25)/1.1);
      if(t<UP+0.25){p.rotation.y=0;sitPose(p);p.position.set(BX,0.08+Math.sin(k*Math.PI)*0.3,BZ)}
      else{p.rotation.y=Math.PI/2;p.position.set(BX+run*5.4,0,BZ+run*0.2);walkPose(p,t*16,0.9)}}
    const lk2=clamp01((t-LIE0)/(LIE1-LIE0));eyesK(p,t<LIE0?1:t<UP?Math.max(0.15,1-0.85*lk2):1);eyesW(p,t>=UP?1.5:1);u.mouth.visible=t>=UP;u.smile.visible=t>SIT&&t<UP;
    const hk=t>1.1&&t<UP?pop((t-1.1)/0.4):0;halo.material.opacity=hk*0.55*(t<LIE0?1:0.5);halo.scale.setScalar(3.0+Math.sin(t*3)*0.15);
    rays.forEach((ry,i)=>{ry.visible=hk>0.05;const a=i/8*Math.PI*2+t*0.4;ry.position.set(-2.0+Math.cos(a)*1.1*hk,1.2+Math.sin(a)*1.1*hk,0.2);ry.rotation.z=a-Math.PI/2;ry.material.opacity=0.45*hk*(t<LIE0?1:0.4)})
    scaleBubble(think,0);
    ex.visible=t>UP&&t<UP+0.5;ex.position.set(BX-0.3,1.9,BZ);
    // 채팅: 4.7 '어디야?' → 5.15부터 입력 → 5.85 전송 → 6.6 사라짐
    const cIn=t>5.4&&t<7.4;chat.style.opacity=cIn?1:0;chat.style.transform=`scale(${0.7+0.3*pop((t-5.4)/0.3)})`;
    const msg='거의 다 왔어!';const nch=Math.max(0,Math.min(msg.length,Math.floor((t-5.95)/0.085)));
    inp.innerHTML=t<6.65?(msg.slice(0,nch)+'<span class="cur"></span>'):'<span class="cur"></span>';mine.style.display=t>=6.65?'flex':'none';
    const left=t<1.0?8:t<LIE0?6:t<UP?Math.max(0,Math.round(5-5*clamp01((t-LIE0)/(UP-0.25-LIE0)))):0;
    ck.innerHTML=`약속까지 <b>${left}분</b>`;chipPop(ck,t,0.1);
    const zk=t<1.0?0:ease((t-1.0)/1.2)*(1-ease((t-UP)/0.5));
    if(LYING){const k=ease((t-TOP)/1.5);cam.position.set(-1.75,3.2-k*0.35,2.6-k*0.3);cam.lookAt(-2.45,0.85,-0.1)}else{cam.position.set(1.3-zk*1.8,2.7-zk*0.1,6.0-zk*0.6);cam.lookAt(-0.3-zk*1.3,0.95-zk*0.05,0.3)}
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6 도착: 지각 15분 → 피부 칭찬 ----------
function streetMeet(scene,r){
  const g=new THREE.Mesh(new THREE.PlaneGeometry(60,60),lamb(0xd8d2c6));g.rotation.x=-Math.PI/2;scene.add(g);
  const bld=new THREE.Mesh(new THREE.BoxGeometry(12,6,1),lamb(0xf2d9e6));bld.position.set(0,3,-2.6);scene.add(bld);
  const sign=signPlane('코인노래방 ♪',3.6,0.8,{bg:'#3a2a5a',fg:'#ffd84d',r:24});sign.position.set(-0.6,3.4,-2.08);scene.add(sign);
  const glow=glowSprite('rgba(255,140,220,1)',4.5);glow.position.set(-0.6,3.4,-1.9);scene.add(glow);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.4,2.4,0.06),lamb(0x6a5a8a));door.position.set(-0.6,1.2,-2.08);scene.add(door);
  for(const x of[-4,3.2]){const w=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),basic(0xcfe8ff));w.position.set(x,2.2,-2.08);scene.add(w)}
  tree(scene,4.6,-1.2,1.0);tree(scene,-4.6,-1.2,0.9);
}
function signPlane(text,w,h,o={}){const t=canvasTex(Math.round(w*300),Math.round(h*300),(x,cw,ch)=>{x.fillStyle=o.bg||'#fff';rr(x,0,0,cw,ch,o.r??30);x.fill();
  x.fillStyle=o.fg||'#333';x.font=`900 ${Math.round(ch*0.5)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,cw/2,ch/2+4)});
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true}))}
S[6]=()=>{
  bgEl.style.background='linear-gradient(#8fc6ff,#d9efff)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,dir:1.4,dpos:[4,9,7]});
  const r=rng(1107);streetMeet(scene,r);
  const f1=makeHero({shirt:0xe39a6b,pants:0x33384a,hair:0x4a3426,skin:0xebb995});f1.position.set(-1.25,0,-0.2);f1.rotation.y=0.45;scene.add(f1);
  const f2=makeHero({shirt:0xf2b8c6,pants:0xe8e2d6,hair:0x6b4a2f,skin:0xf3cfae,long:true});f2.position.set(-0.35,0,-0.5);f2.rotation.y=0.3;scene.add(f2);
  const f3=makeHero({shirt:0x8cc9a0,pants:0x2c4058,hair:0x2a2220,skin:0xdfa882});f3.position.set(-2.0,0,-0.7);f3.rotation.y=0.6;scene.add(f3);
  const p=makeHero({shirt:0x9a9ca6,pants:0x3d3a36});scene.add(p);hood(p,0x9a9ca6);backpack(p);const u=p.userData;
  const drops=[];for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.04,10,8),basic(0x8fd0ff));d.scale.y=1.4;scene.add(d);drops.push(d)}
  const sp=sprk(scene,10,r,{x:0.9,y:2.05,z:0.3,w:0.7,h:0.55,col:'#fffbd8',size:0.0012});
  const ex=textSprite('!',120,'#ff5a7a',0.0038);scene.add(ex);
  const cam=new THREE.PerspectiveCamera(40,W/H,0.1,100);
  const ck=chip('');
  return t=>{
    const a=lineT(6,'f1'),b=lineT(6,'f2');
    // 주인공: 오른쪽에서 뛰어 들어와 숨 고르기
    const run=clamp01(t/0.9);standPose(p);p.rotation.y=run<1?-Math.PI/2:-0.25+ (t>3.5?0.25:0);p.position.set(3.4-run*2.5,0,0.25);
    if(run<1)walkPose(p,t*16,0.9);else{u.hip.rotation.x=0.25*(1-clamp01((t-1.6)/0.6));p.position.y=Math.sin(t*10)*0.015}
    eyesK(p,t<b.t0?0.6+0.4*clamp01((t-1.6)/0.4):1);u.mouth.visible=t<1.8;
    drops.forEach((d,i)=>{d.visible=t>0.8&&t<2.4;const lt=((t*1.6+i/3)%1);d.position.set(p.position.x+0.25+i*0.04,2.15-lt*0.4,0.35)});
    // 친구1: 팔짱 + 발 구르기 → 친구2: 다가와서 얼굴 들여다봄
    standPose(f1);f1.userData.arms.forEach((ar,i)=>{ar.rotation.x=-1.4;ar.rotation.z=(i?-0.9:0.9)});f1.position.y=t>a.t0&&t<a.t1?Math.abs(Math.sin(t*12))*0.03:0;
    standPose(f2);const lean=ease((t-b.t0+0.2)/0.6);f2.position.set(-0.35+lean*0.55,0,-0.5+lean*0.2);f2.rotation.y=0.3+lean*0.9;f2.userData.hip.rotation.x=lean*0.28;
    standPose(f3);f3.userData.arms[1].rotation.x=t>0.6&&t<1.6?-2.6:0;
    // 칭찬 받고 수줍음: 볼 커짐 + 머리 긁기
    const shy=clamp01((t-b.t1+0.2)/0.4);blush(p,1+shy*0.9);u.smile.visible=shy>0;
    if(shy>0){u.arms[1].rotation.x=-2.7*ease(shy);u.arms[1].rotation.z=0.5;u.head.rotation.z=Math.sin(t*5)*0.05}
    updSprk(sp,t,b.t0+0.3);sp.forEach(q=>q.x=q.x);
    ex.visible=t>b.t0&&t<b.t0+0.8;ex.position.set(f2.position.x,2.15,f2.position.z);ex.scale.set(ex.userData.base[0]*pop((t-b.t0)/0.2),ex.userData.base[1]*pop((t-b.t0)/0.2),1);
    const zk=ease((t-b.t0+0.3)/1.0);
    cam.position.set(0.2+zk*1.4,2.3-zk*0.15,5.6-zk*2.4);cam.lookAt(-0.3+zk*0.8,1.25+zk*0.5,-0.2);
    ck.innerHTML='PM 12:15 · 지각 <b>15분</b>';chipPop(ck,t,0.1);
    caption(6,t);renderer.render(scene,cam);
  };
};

// ---------- S7 노래방 → 네컷 사진 (제일 잘 노는 ISFP) ----------
S[7]=()=>{
  bgEl.style.background='linear-gradient(#2a1d4a,#4a2f6a)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.3,sky:0xd8c8ff,ground:0x3a2a5a,dir:1.0,dpos:[0,6,6]});
  const r=rng(1108);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0x3a2a52));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(30,8,0.2),lamb(0x4a3366));wall.position.set(0,4,-2.4);scene.add(wall);
  const scr=liveScreen();scr.position.set(0,2.6,-2.28);scene.add(scr);
  const sofa=new THREE.Mesh(new THREE.BoxGeometry(5,0.5,0.9),lamb(0xd94f7a));sofa.position.set(0,0.25,0.9);scene.add(sofa);
  const sofaB=new THREE.Mesh(new THREE.BoxGeometry(5,0.9,0.25),lamb(0xc2456d));sofaB.position.set(0,0.7,1.35);scene.add(sofaB);
  const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(0.3,1),new THREE.MeshLambertMaterial({color:0xdde4ff,flatShading:true,emissive:0x555577}));ball.position.set(0,4.0,-0.2);scene.add(ball);
  const spots=[];const SC=['rgba(255,120,200,1)','rgba(120,200,255,1)','rgba(255,230,120,1)','rgba(150,255,170,1)'];
  for(let i=0;i<8;i++){const s=glowSprite(SC[i%4],1.4);scene.add(s);spots.push({s,ph:r()*6,sp:0.6+r()})}
  // 주인공(가운데, 마이크) + 친구들(소파, 탬버린)
  const p=makeHero({shirt:0x9a9ca6,pants:0x3d3a36});p.position.set(0,0,-0.2);scene.add(p);hood(p,0x9a9ca6);const u=p.userData;
  const mic=new THREE.Group();const mh=new THREE.Mesh(new THREE.SphereGeometry(0.07,12,10),lamb(0x333333));mh.position.y=0.14;mic.add(mh);const mb=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.025,0.25,8),lamb(0x222222));mic.add(mb);
  mic.position.set(0,-0.68,0.1);mic.rotation.x=Math.PI;u.arms[1].add(mic);
  const fr=[makeHero({shirt:0xe39a6b,pants:0x33384a,hair:0x4a3426,skin:0xebb995}),makeHero({shirt:0xf2b8c6,pants:0xe8e2d6,hair:0x6b4a2f,skin:0xf3cfae,long:true}),makeHero({shirt:0x8cc9a0,pants:0x2c4058,hair:0x2a2220,skin:0xdfa882})];
  fr.forEach((f,i)=>{f.position.set([-1.6,1.6,-0.9][i],0.08,[0.75,0.75,0.9][i]);f.rotation.y=Math.PI;scene.add(f)});
  const notes=[];for(let i=0;i<8;i++){const n=textSprite(i%2?'♪':'♬',90,['#ffd84d','#9df2c8','#ff8fc8'][i%3],0.0045);scene.add(n);notes.push({n,ph:r(),x:(r()-0.5)*1.4})}
  // 네컷 사진 부스
  const booth=new THREE.Group();scene.add(booth);
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,100);
  const ck=chip('');
  ui.insertAdjacentHTML('beforeend','<div class="flash"></div>');const flsh=ui.querySelector('.flash');
  const st=document.createElement('div');st.className='stat';ui.appendChild(st);
  const BOOTH=4.35,SH=[4.5,4.9,5.3,5.7];
  return t=>{
    const inBooth=t>=BOOTH;
    // 노래방
    updLive(scr,t);ball.rotation.y=t*1.5;
    spots.forEach((q,i)=>{q.s.position.set(Math.sin(t*q.sp+q.ph)*2.5,0.05,Math.cos(t*q.sp*0.8+q.ph)*1.2);q.s.scale.set(1.6,0.5,1)});
    standPose(p);const beat=Math.abs(Math.sin(t*Math.PI*128/60));
    if(!inBooth){p.position.y=beat*0.18;u.arms[1].rotation.x=-2.3;u.arms[1].rotation.z=0.2;u.arms[0].rotation.x=-2.8+Math.sin(t*8)*0.3;u.arms[0].rotation.z=-0.4;u.head.rotation.z=Math.sin(t*6.7)*0.15;
      eyesK(p,0.12);u.mouth.visible=true;u.smile.visible=false;u.mouth.scale.y=1.25*(0.7+beat*0.6);mic.visible=true;
      fr.forEach((f,i)=>{standPose(f);sitPose(f);f.position.y=0.08+Math.abs(Math.sin(t*8.4+i))*0.06;f.userData.arms[i%2].rotation.x=-2.6+Math.sin(t*16+i)*0.4;f.userData.arms[i%2].rotation.z=(i%2?0.3:-0.3)})}
    notes.forEach((q,i)=>{const lt=((t*0.6+q.ph)%1);q.n.visible=!inBooth;q.n.position.set(q.x+Math.sin(lt*6)*0.2,2.3+lt*1.6,-0.1);const k=Math.sin(lt*Math.PI);q.n.scale.set(q.n.userData.base[0]*k,q.n.userData.base[1]*k,1)});
    // 네컷 부스: 4명 나란히, 플래시마다 포즈 바뀜
    if(inBooth){
      let pose=0;SH.forEach((s,i)=>{if(t>=s-0.02)pose=i});
      const all=[fr[0],p,fr[1],fr[2]];const XS=[-0.95,-0.3,0.35,1.0];
      all.forEach((f,i)=>{standPose(f);f.position.set(XS[i],0,-0.2);f.rotation.y=0;f.userData.hip.rotation.x=0;
        const U=f.userData;U.head.rotation.z=[0.15,-0.15,0.1,-0.1][(i+pose)%4];
        if(pose===0){U.arms[1].rotation.x=-2.9;U.arms[1].rotation.z=-0.3}
        if(pose===1){U.arms[0].rotation.z=-2.4;U.arms[1].rotation.z=2.4}
        if(pose===2){U.arms[i%2].rotation.x=-1.6}
        if(pose===3){U.arms[0].rotation.x=-2.9;U.arms[1].rotation.x=-2.9}
      });
      // 주인공만 제일 크게: 점프 + 활짝
      p.position.y=pose>=1?0.12+Math.abs(Math.sin(t*9))*0.08:0.05;eyesK(p,0.12);u.mouth.visible=false;u.smile.visible=true;mic.visible=false;blush(p,1.5);
      fr.forEach(f=>{eyesK(f,1);f.userData.smile.visible=true});
      wall.material=lamb(0xffd6e6);
    }
    let fk=0;SH.forEach(s=>{if(t>s&&t<s+0.18)fk=1-(t-s)/0.18});flsh.style.opacity=fk*0.9;
    if(inBooth){cam.fov=34;cam.position.set(0,1.9,4.2);cam.lookAt(0,1.6,0)}else{const k=t/BOOTH;cam.fov=42;cam.position.set(-0.6+k*1.2,2.4,4.6-k*0.6);cam.lookAt(0,1.5,0)}
    cam.updateProjectionMatrix();
    ck.innerHTML=inBooth?'PM 3:40 · 네컷 사진':'PM 12:30 · 코인노래방';chipPop(ck,t,0.1);
    const sk=pop((t-5.85)/0.35);st.innerHTML='가기 전 의욕 <b>0%</b> → 지금 <b>200%</b>';st.style.opacity=t>5.85?1:0;st.style.transform=`translateX(-50%) scale(${sk})`;
    caption(7,t);renderer.render(scene,cam);
  };
};
function liveScreen(){const c=document.createElement('canvas');c.width=800;c.height=450;const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.36),new THREE.MeshBasicMaterial({map:tx}));m.userData={c,x:c.getContext('2d'),tx};return m}
function updLive(m,t){const {c,x,tx}=m.userData;const w=c.width,h=c.height;
  const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#3b6fd8');g.addColorStop(1,'#9a4fd0');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<6;i++){x.fillStyle=`rgba(255,255,255,${0.08+0.05*i})`;x.beginPath();x.arc((i*170+t*60)%(w+200)-100,h*0.35+Math.sin(t+i)*30,40+i*6,0,7);x.fill()}
  x.font=`900 54px ${FONT}`;x.textAlign='center';x.textBaseline='middle';
  const p=(t*0.35)%1;const L1='오늘 하루 너무 좋아 ♪',L2='다 같이 노래해 ♪';
  x.fillStyle='#fff';x.fillText(L1,w/2,h*0.68);x.save();x.beginPath();const tw=x.measureText(L1).width;x.rect(w/2-tw/2,0,tw*p,h);x.clip();x.fillStyle='#ffd84d';x.fillText(L1,w/2,h*0.68);x.restore();
  x.fillStyle='rgba(255,255,255,.8)';x.font=`900 44px ${FONT}`;x.fillText(L2,w/2,h*0.85);tx.needsUpdate=true}

let curUpd=null,cur=-1;
window.setPJ=(st)=>{PJ_STYLE=st;cur=-1};
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';const ss=si===2?2:1;renderer.setPixelRatio(ss);renderer.setSize(W,H,false);curUpd=S[si]();cur=si}curUpd(t)};  // 세안(제품) 장면만 2배 슈퍼샘플링
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>document.fonts.load(`300 100px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
