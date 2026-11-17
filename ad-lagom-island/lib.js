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
function sprk(scene,n,r,o){const a=[];for(let i=0;i<n;i++){const s=textSprite('✦',90,o.col||'#fff7c2',o.size||0.0013);scene.add(s);s.visible=false;a.push({s,x:o.x+(r()-0.5)*o.w,y:o.y+(r()-0.5)*o.h,z:o.z+(r()-0.5)*(o.d||0.1),ph:r()})}return a}
function updSprk(a,t,t0,t1=1e9){a.forEach(q=>{const lt=((t-t0)*1.3+q.ph)%1;const on=t>t0&&t<t1;q.s.visible=on;q.s.position.set(q.x,q.y+lt*0.05,q.z);const k=Math.sin(lt*Math.PI)*(on?1:0);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)})}

// ---------- 라곰 셀럽 마이크로 폼 클렌저 튜브 ----------
// 실제 제품: 흰 무광 튜브, 아래가 원형 캡(세워 두는 형태), 위는 납작하게 눌린 끝. 로고·문구는 정면(+z), 좌우반전 없음
// 로고: 라곰 1차 피드백 — 기존(300·자간18px)보다 굵게, 자간 좁게
let LOGO={w:500,ls:6,fs:150};
window.setLogo=(o)=>{LOGO=Object.assign(LOGO,o);_tubeTex=null};
function tubeLabel(){
  return canvasTex(4096,2800,(x,w,h)=>{x.scale(2,2);w=2048;h=1400;
    x.fillStyle='#f4f4f2';x.fillRect(0,0,w,h);
    {const g=x.createLinearGradient(0,0,w*0.5,0);g.addColorStop(0,'rgba(0,0,0,0.10)');g.addColorStop(0.2,'rgba(255,255,255,0)');g.addColorStop(0.3,'rgba(255,255,255,0.85)');g.addColorStop(0.36,'rgba(255,255,255,0.15)');g.addColorStop(0.75,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,0.12)');x.fillStyle=g;x.fillRect(0,0,w*0.5,h)}
    // 정면은 u=0.25(가로 512px 부근) — 아래에서 x 좌표를 u로 맞춰 그림
    const cx=w*0.25;x.fillStyle='#000';x.textAlign='center';x.textBaseline='middle';
    x.font=`${LOGO.w} ${LOGO.fs}px "Noto Sans CJK KR"`;x.letterSpacing=LOGO.ls+'px';x.fillText('LAGOM',cx+LOGO.ls/2,h*0.30);
    x.font=`700 34px "Noto Sans CJK KR"`;x.letterSpacing='1.5px';x.fillText('NOT TOO LITTLE, NOT TOO MUCH',cx,h*0.385);
    x.font=`900 46px "Noto Sans CJK KR"`;x.letterSpacing='2px';x.fillText('CELLUP',cx,h*0.55);x.fillText('MICRO FOAM CLEANSER',cx,h*0.597);
    // 저울 아이콘
    x.strokeStyle='#111';x.lineWidth=5;const iy=h*0.70;
    x.beginPath();x.moveTo(cx-46,iy);x.lineTo(cx+46,iy);x.moveTo(cx,iy-14);x.lineTo(cx,iy+30);x.moveTo(cx-20,iy+30);x.lineTo(cx+20,iy+30);x.stroke();
    for(const s of[-1,1]){x.beginPath();x.arc(cx+s*42,iy+14,16,0,Math.PI);x.stroke();x.beginPath();x.moveTo(cx+s*42-16,iy+14);x.lineTo(cx+s*42,iy);x.lineTo(cx+s*42+16,iy+14);x.stroke()}
    x.font=`700 30px "Noto Sans CJK KR"`;x.letterSpacing='1px';x.fillText('150mL · 5.07 FL.OZ.',cx,h*0.80);
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
