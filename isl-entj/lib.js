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
function bub(p,text,o={}){const b=makeBubble(text,{bg:o.bg||'#d9fbe9',fg:o.fg||'#1f5a42',fs:o.fs||70,size:o.size||0.0024});b.position.set(o.x||0,o.y??2.08,o.z||0);p.add(b);scaleBubble(b,0);return b}
function showB(b,t,t0,t1=1e9){const k=t<t1?pop((t-t0)/0.25):1-clamp01((t-t1)/0.15);scaleBubble(b,t>=t0?k:0)}
function sprk(scene,n,r,o){const a=[];for(let i=0;i<n;i++){const s=textSprite('✦',90,o.col||'#fff7c2',o.size||0.0013);scene.add(s);s.visible=false;a.push({s,x:o.x+(r()-0.5)*o.w,y:o.y+(r()-0.5)*o.h,z:o.z+(r()-0.5)*(o.d||0.1),ph:r()})}return a}
function updSprk(a,t,t0,t1=1e9){a.forEach(q=>{const lt=((t-t0)*1.3+q.ph)%1;const on=t>t0&&t<t1;q.s.visible=on;q.s.position.set(q.x,q.y+lt*0.05,q.z);const k=Math.sin(lt*Math.PI)*(on?1:0);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)})}
