// ---------- 크리스마스 모델 ----------
const WHITE=0xf7f7fb,SRED=0xd8343c,GOLD=0xf2c14e;
function flatMouth(p,o={}){const u=p.userData;const m=new THREE.Mesh(new THREE.BoxGeometry(o.w||0.08,0.016,0.01),basic(o.c||0x5a2a2a));m.position.set(0,o.y??0.135,o.z??0.248);u.head.add(m);u.flat=m;return m}
function mood(p,m){const u=p.userData;if(u.flat)u.flat.visible=m==='flat';u.smile.visible=m==='smile';u.mouth.visible=m==='open'}
// 산타: 빨간 옷 + 흰 털 + 검은 벨트·금 버클 + 흰 수염 + 고깔모자·방울
function makeSanta(){
  const p=makeHero({shirt:SRED,pants:SRED,shoe:0x1d1d22,hair:0xf1f1f4,skin:0xf3cfae});const u=p.userData;
  u.body.scale.set(1.28,1.04,1.4);
  const belly=new THREE.Mesh(new THREE.SphereGeometry(0.3,24,18),lamb(SRED));belly.scale.set(1.05,0.95,0.75);belly.position.set(0,0.24,0.1);u.hip.add(belly);
  const hem=new THREE.Mesh(new THREE.BoxGeometry(0.72,0.1,0.5),lamb(WHITE));hem.position.y=0.02;u.hip.add(hem);
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.56,0.04),lamb(WHITE));stripe.position.set(0,0.36,0.3);u.hip.add(stripe);
  const belt=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.09,0.5),lamb(0x1d1d22));belt.position.y=0.2;u.hip.add(belt);
  const bk=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.12,0.03),lamb(GOLD));bk.position.set(0,0.2,0.31);u.hip.add(bk);
  const bki=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.05,0.02),lamb(0x1d1d22));bki.position.set(0,0.2,0.32);u.hip.add(bki);
  const col=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.09,0.42),lamb(WHITE));col.position.y=0.63;u.hip.add(col);
  u.arms.forEach(a=>{const cf=new THREE.Mesh(new THREE.BoxGeometry(0.19,0.09,0.21),lamb(WHITE));cf.position.y=-0.52;a.add(cf);a.children[1].material=lamb(0x1d1d22)});
  u.legs.forEach(l=>{const sh=l.children[1];sh.scale.set(1.25,1.6,1.15);sh.position.y=-0.72;const bt=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.24,0.27),lamb(0x1d1d22));bt.position.y=-0.6;l.add(bt);const fur=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.07,0.29),lamb(WHITE));fur.position.y=-0.47;l.add(fur)});
  const h=u.head;
  const beard=new THREE.Mesh(new THREE.SphereGeometry(0.22,40,30),smooth(WHITE));beard.scale.set(1.15,1.05,0.8);beard.position.set(0,-0.03,0.1);h.add(beard);
  for(const s of[-1,1]){const ms=new THREE.Mesh(new THREE.SphereGeometry(0.075,24,16),smooth(WHITE));ms.scale.set(1.5,0.7,0.8);ms.position.set(s*0.065,0.165,0.225);ms.rotation.z=s*-0.25;h.add(ms);
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.03,0.02),lamb(WHITE));br.position.set(s*0.09,0.32,0.235);br.rotation.z=s*-0.12;h.add(br)}
  const nose=new THREE.Mesh(new THREE.SphereGeometry(0.04,20,14),smooth(0xf2a08a));nose.position.set(0,0.205,0.25);h.add(nose);
  u.cheeks.forEach(c=>{c.position.y=0.2;c.position.x*=1.05});
  // 모자
  const hat=new THREE.Group();hat.position.set(0,0.43,-0.01);h.add(hat);
  const cone=new THREE.Mesh(new THREE.ConeGeometry(0.255,0.5,40,1,true),smooth(SRED));cone.position.y=0.22;cone.rotation.x=-0.3;cone.rotation.z=0.25;hat.add(cone);
  const cap=new THREE.Mesh(new THREE.CircleGeometry(0.255,40),smooth(SRED));cap.rotation.x=Math.PI/2;hat.add(cap);
  const brim=new THREE.Mesh(new THREE.TorusGeometry(0.255,0.065,16,40),smooth(WHITE));brim.rotation.x=Math.PI/2;brim.position.y=0.0;hat.add(brim);
  const pom=new THREE.Mesh(new THREE.SphereGeometry(0.075,24,16),smooth(WHITE));pom.position.set(-0.13,0.41,-0.12);hat.add(pom);
  u.hat=hat;u.beard=beard;
  eyesK(p,0.75);return p;
}
function makeElf(o={}){
  const p=makeHero({shirt:o.shirt??0x4caf6a,pants:o.pants??0xd94848,shoe:0x2f7a45,hair:o.hair??0x6b4a2f,skin:0xf3cfae,long:o.long});const u=p.userData;
  const col=new THREE.Mesh(new THREE.ConeGeometry(0.4,0.16,8,1,true),lamb(0xffd84d));col.rotation.x=Math.PI;col.position.y=0.62;u.hip.add(col);
  const belt=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.07,0.34),lamb(0x4a3020));belt.position.y=0.12;u.hip.add(belt);
  for(const s of[-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.17,12),smooth(0xf3cfae));ear.rotation.z=s*-1.25;ear.position.set(s*0.27,0.27,0);u.head.add(ear)}
  const hat=new THREE.Group();hat.position.set(0,0.42,-0.02);u.head.add(hat);
  const cone=new THREE.Mesh(new THREE.ConeGeometry(0.25,0.55,36,1,true),smooth(o.hat??0x3f9e5c));cone.position.y=0.25;cone.rotation.z=-0.35;hat.add(cone);
  const brim=new THREE.Mesh(new THREE.TorusGeometry(0.25,0.05,12,36),smooth(0xd94848));brim.rotation.x=Math.PI/2;hat.add(brim);
  const bell=new THREE.Mesh(new THREE.SphereGeometry(0.06,16,12),smooth(GOLD));bell.position.set(0.2,0.48,0);hat.add(bell);
  u.legs.forEach(l=>{const sh=l.children[1];sh.scale.set(1,1,1.5);sh.position.z=0.1});
  flatMouth(p);mood(p,'flat');p.scale.setScalar(o.s||0.82);return p;
}
function makeKid(){
  const p=makeHero({shirt:0x8fb8f0,pants:0x8fb8f0,shoe:0xf0f0f0,hair:0x2a2220,skin:0xf6d3b4});const u=p.userData;
  u.head.scale.setScalar(1.22);u.head.position.y=0.64;
  // 잠옷 줄무늬
  for(let i=0;i<3;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(0.53,0.05,0.33),lamb(0xffffff));s.position.y=0.12+i*0.2;u.hip.add(s)}
  const fr=new THREE.Mesh(new THREE.SphereGeometry(0.2,40,20,0,Math.PI*2,0,Math.PI*0.32),smooth(0x2a2220));fr.position.set(0,0.27,0.05);fr.rotation.x=0.9;u.head.add(fr);
  flatMouth(p);mood(p,'flat');eyesK(p,0.8);p.scale.setScalar(0.7);return p;
}
function makeMom(){
  const p=makeHero({shirt:0xe8c9a0,pants:0x6a7fa8,shoe:0xf0f0f0,hair:0x3a2a22,skin:0xf3cfae,long:true});flatMouth(p);mood(p,'flat');eyesK(p,0.8);return p;
}
// 순록: 갈색 몸 + 뿔 + 빨간 하네스·금방울
function makeDeer(){
  const g=new THREE.Group();const br=lamb(0x9a6a44),lt=lamb(0xd8b48a),dk=lamb(0x4a3020);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.48,1.15),br);body.position.y=1.0;g.add(body);
  const chest=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.3,0.3),lt);chest.position.set(0,0.95,0.5);g.add(chest);
  const neck=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.55,0.26),br);neck.position.set(0,1.38,0.55);neck.rotation.x=0.35;g.add(neck);
  const head=new THREE.Group();head.position.set(0,1.68,0.7);g.add(head);
  const hm=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.36),br);head.add(hm);
  const sn=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.2,0.2),lt);sn.position.set(0,-0.05,0.25);head.add(sn);
  const ns=new THREE.Mesh(new THREE.SphereGeometry(0.05,12,8),basic(0x2a2020));ns.position.set(0,-0.01,0.36);head.add(ns);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.06,0.02),basic(0x111111));e.position.set(s*0.1,0.06,0.18);head.add(e);
    const ear=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.07,0.05),br);ear.position.set(s*0.2,0.1,-0.05);ear.rotation.z=s*0.4;head.add(ear);
    const ant=new THREE.Group();ant.position.set(s*0.1,0.15,-0.08);head.add(ant);const am=lamb(0xe6cf9e);
    const a1=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.03,0.42,6),am);a1.position.set(s*0.08,0.2,0);a1.rotation.z=s*-0.45;ant.add(a1);
    const a2=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.025,0.22,6),am);a2.position.set(s*0.08,0.3,0.06);a2.rotation.x=0.8;ant.add(a2);
    const a3=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.022,0.2,6),am);a3.position.set(s*0.2,0.4,0);a3.rotation.z=s*-1.0;ant.add(a3)}
  const legs=[];for(const [x,z] of [[-0.16,0.42],[0.16,0.42],[-0.16,-0.42],[0.16,-0.42]]){const l=new THREE.Group();l.position.set(x,0.85,z);g.add(l);const lm=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.8,0.11),br);lm.position.y=-0.4;l.add(lm);const hf=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.1,0.14),dk);hf.position.y=-0.8;l.add(hf);legs.push(l)}
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.12),lamb(WHITE));tail.position.set(0,1.15,-0.62);g.add(tail);
  const har=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.12,0.12),lamb(SRED));har.position.set(0,1.05,0.3);g.add(har);
  const har2=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.5,0.1),lamb(SRED));har2.position.set(0,1.0,0.02);har2.scale.set(1.0,1.02,1);g.add(har2);
  for(const s of[-1,1]){const bl=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,8),lamb(GOLD));bl.position.set(s*0.29,1.0,0.3);g.add(bl)}
  g.userData={legs,head};return g;
}
function gallop(d,t,ph=0,k=1){d.userData.legs.forEach((l,i)=>{l.rotation.x=Math.sin(t*14+ph+(i<2?0:Math.PI))*0.7*k});d.userData.head.rotation.x=Math.sin(t*14+ph)*0.08*k}
// 썰매
function makeSleigh(){
  const g=new THREE.Group();const red=lamb(0xc9303a),gd=lamb(GOLD),dk=lamb(0x3a2a22);
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.45,1.7),red);base.position.y=0.55;g.add(base);
  const back=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.75,0.2),red);back.position.set(0,0.95,-0.78);g.add(back);
  const backTop=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,1.04,12),gd);backTop.rotation.z=Math.PI/2;backTop.position.set(0,1.33,-0.78);g.add(backTop);
  const front=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.12,10,20,Math.PI),red);front.rotation.y=Math.PI/2;front.position.set(0,0.78,0.85);g.add(front);
  for(const s of[-1,1]){const tr=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.08,1.72),gd);tr.position.set(s*0.51,0.72,0);g.add(tr);
    const run=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,2.1),gd);run.position.set(s*0.42,0.1,0.05);g.add(run);
    const curl=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.035,8,16,Math.PI*1.2),gd);curl.rotation.y=Math.PI/2;curl.position.set(s*0.42,0.3,1.1);g.add(curl);
    for(const z of[-0.5,0.5]){const st=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.3,0.05),gd);st.position.set(s*0.42,0.25,z);g.add(st)}}
  const seat=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.12,0.8),lamb(0x7a2a2a));seat.position.set(0,0.82,-0.25);g.add(seat);
  const sack=new THREE.Mesh(new THREE.SphereGeometry(0.42,24,18),smooth(0x8a5a3a));sack.scale.set(1,0.9,0.9);sack.position.set(0.0,1.05,-0.95);g.add(sack);
  const tie=new THREE.Mesh(new THREE.ConeGeometry(0.14,0.3,12),smooth(0x8a5a3a));tie.position.set(0,1.45,-0.95);g.add(tie);
  const lantern=new THREE.Group();lantern.position.set(0.55,1.05,0.95);g.add(lantern);
  const lp=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.2,0.16),lamb(0x2a2a30));lantern.add(lp);
  const lg=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.14,0.17),basic(0xffd98a));lantern.add(lg);
  const glow=glowSprite('rgba(255,210,120,1)',1.1);lantern.add(glow);
  g.userData={sack,glow,lantern};return g;
}
function giftBox(col=0xd8343c,rib=GOLD,s=1){
  const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.6),lamb(col));b.position.y=0.25;g.add(b);
  const lid=new THREE.Group();lid.position.y=0.5;g.add(lid);
  const lm=new THREE.Mesh(new THREE.BoxGeometry(0.66,0.12,0.66),lamb(col));lm.position.y=0.03;lid.add(lm);
  for(const r of[0,Math.PI/2]){const rb=new THREE.Mesh(new THREE.BoxGeometry(0.67,0.13,0.1),lamb(rib));rb.position.y=0.03;rb.rotation.y=r;lid.add(rb);
    const rv=new THREE.Mesh(new THREE.BoxGeometry(0.61,0.5,0.1),lamb(rib));rv.position.y=-0.25;rv.rotation.y=r;g.add(rv);rv.position.y=0.25}
  const bow=new THREE.Group();bow.position.y=0.12;lid.add(bow);
  for(const s2 of[-1,1]){const lp=new THREE.Mesh(new THREE.TorusGeometry(0.09,0.035,8,16),smooth(rib));lp.position.set(s2*0.09,0.05,0);lp.rotation.z=s2*0.5;lp.scale.set(1,0.8,0.6);bow.add(lp)}
  const kn=new THREE.Mesh(new THREE.SphereGeometry(0.05,12,8),smooth(rib));bow.add(kn);
  g.scale.setScalar(s);g.userData={lid,bow};return g;
}
function barcodeTex(){return canvasTex(420,300,(x,w,h)=>{x.fillStyle='#ffffff';x.fillRect(0,0,w,h);
  x.fillStyle='#2b2b3a';x.font='900 44px "Noto Sans CJK KR"';x.textAlign='center';x.fillText('기프티콘',w/2,58);
  let px=50;const rr2=rng(77);while(px<w-50){const bw=2+Math.floor(rr2()*6);x.fillRect(px,84,bw,150);px+=bw+2+Math.floor(rr2()*5)}
  x.font='700 26px "Noto Sans CJK KR"';x.fillText('8 8 0 1 2 2 4 2 0 2 6',w/2,272)})}
function paperMesh(s=0.5){const m=new THREE.Mesh(new THREE.PlaneGeometry(s*1.4,s),new THREE.MeshLambertMaterial({map:barcodeTex(),side:THREE.DoubleSide}));return m}
// 지붕이 하얀 집 + 굴뚝 + 따뜻한 창 + 리스 + 처마 전구
function makeXHouse(r,o={}){
  const g=new THREE.Group();const w=o.w||3.2,hh=o.h||2.2,d=o.d||2.6;
  const wall=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),lamb(o.wall??pick(r,[0xe8c9a8,0xc9d7ea,0xf0dcc0,0xd9c2e0,0xcfe3d2,0xf2d0c4])));wall.position.y=hh/2;g.add(wall);
  const rh=o.rh||1.4;const sh=new THREE.Shape();sh.moveTo(-w/2-0.25,0);sh.lineTo(w/2+0.25,0);sh.lineTo(0,rh);sh.closePath();
  const rg=new THREE.ExtrudeGeometry(sh,{depth:d+0.4,bevelEnabled:false});rg.translate(0,0,-(d+0.4)/2);
  const roof=new THREE.Mesh(rg,lamb(o.roof??pick(r,[0x8a3a3a,0x3a5a8a,0x5a4a7a,0x3f6a4a])));roof.position.y=hh;g.add(roof);
  const s2=new THREE.Shape();const k=0.55;s2.moveTo(-(w/2+0.25)*k-0.02,rh*(1-k));s2.lineTo((w/2+0.25)*k+0.02,rh*(1-k));s2.lineTo(0,rh+0.05);s2.closePath();
  const sg=new THREE.ExtrudeGeometry(s2,{depth:d+0.46,bevelEnabled:false});sg.translate(0,0.06,-(d+0.46)/2);
  const snow=new THREE.Mesh(sg,lamb(0xfafcff));snow.position.y=hh;g.add(snow);
  // 굴뚝
  const cx=o.cx??w*0.22;const slopeY=hh+rh*(1-Math.abs(cx)/(w/2+0.25));
  const ch=new THREE.Mesh(new THREE.BoxGeometry(0.5,1.2,0.5),lamb(0xa0483c));ch.position.set(cx,slopeY+0.3,-d*0.15);g.add(ch);
  const chs=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.12,0.6),lamb(0xfafcff));chs.position.set(cx,slopeY+0.96,-d*0.15);g.add(chs);
  const hole=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.34),basic(0x1a1414));hole.rotation.x=-Math.PI/2;hole.position.set(cx,slopeY+1.03,-d*0.15);g.add(hole);
  g.userData.chim=new THREE.Vector3(cx,slopeY+1.03,-d*0.15);
  // 창·문
  const lit=o.lit??0xffd98a;
  for(const x of[-w*0.28,w*0.28]){const wn=new THREE.Mesh(new THREE.PlaneGeometry(0.62,0.7),basic(lit));wn.position.set(x,hh*0.6,d/2+0.01);g.add(wn);
    const fx=new THREE.Mesh(new THREE.PlaneGeometry(0.05,0.7),basic(0x5a4030));fx.position.set(x,hh*0.6,d/2+0.02);g.add(fx);
    const fy=new THREE.Mesh(new THREE.PlaneGeometry(0.62,0.05),basic(0x5a4030));fy.position.set(x,hh*0.6,d/2+0.02);g.add(fy)}
  const door=new THREE.Mesh(new THREE.PlaneGeometry(0.62,1.15),lamb(0x6a3f2a));door.position.set(0,0.58,d/2+0.01);g.add(door);
  const wr=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.06,8,18),lamb(0x2f7a45));wr.position.set(0,0.85,d/2+0.06);g.add(wr);
  const wb=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),basic(0xe2335a));wb.position.set(0,0.7,d/2+0.1);g.add(wb);
  // 처마 전구
  const bulbs=[];const cols=[0xff4d5e,0xffd84d,0x5fd38a,0x5fb0ff];const n=Math.round(w*3);
  for(let i=0;i<=n;i++){const x=-w/2-0.2+(w+0.4)*i/n;const b=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),basic(cols[i%4]));b.position.set(x,hh-0.06-Math.sin(i/n*Math.PI*4)*0.0,d/2+0.24);g.add(b);bulbs.push(b)}
  g.userData.bulbs=bulbs;return g;
}
function twinkle(bulbs,t,ph=0){bulbs.forEach((b,i)=>{b.scale.setScalar(0.75+0.45*Math.max(0,Math.sin(t*5+i*1.7+ph)))})}
function xmasTree(s=1,o={}){
  const g=new THREE.Group();const gm=lamb(o.col??0x2f8a4f);
  [[1.0,1.3,0.9],[0.8,1.1,1.6],[0.55,0.9,2.2]].forEach(([r,h,y])=>{const c=new THREE.Mesh(new THREE.ConeGeometry(r,h,8),gm);c.position.y=y;g.add(c);
    if(o.snow){const sc=new THREE.Mesh(new THREE.ConeGeometry(r*0.55,h*0.4,8),lamb(0xfafcff));sc.position.y=y+h*0.32;g.add(sc)}});
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,0.5,6),lamb(0x7a5a3c));tr.position.y=0.25;g.add(tr);
  const orn=[];if(o.lights!==false){const cols=[0xff4d5e,0xffd84d,0x5fb0ff,0xff9ad8,0xffffff];const rr2=rng(o.seed||5);
    for(let i=0;i<22;i++){const y=0.6+rr2()*1.9;const rad=(1.05-(y-0.4)/2.4*0.85)*0.92;const a=rr2()*Math.PI*2;const b=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),basic(cols[i%5]));b.position.set(Math.cos(a)*rad,y,Math.sin(a)*rad);g.add(b);orn.push(b)}}
  const star=new THREE.Mesh(new THREE.OctahedronGeometry(0.2,0),basic(0xffd84d));star.position.y=2.78;star.scale.set(1,1.2,0.5);g.add(star);
  const sg=glowSprite('rgba(255,220,120,1)',1.2);sg.position.y=2.78;g.add(sg);
  g.scale.setScalar(s);g.userData={orn,star};return g;
}
function snowfall(scene,n,r,o={}){const g=new THREE.BufferGeometry();const pos=new Float32Array(n*3);const base=[];
  for(let i=0;i<n;i++){base.push([(r()-0.5)*(o.w||30),r()*(o.h||14),(o.z??0)+(r()-0.5)*(o.d||20),r()]);}
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));const m=new THREE.PointsMaterial({color:0xffffff,size:o.size||0.09,transparent:true,opacity:0.9,depthWrite:false});
  const p=new THREE.Points(g,m);scene.add(p);
  return {p,upd(t,sp=1){const H0=o.h||14;for(let i=0;i<n;i++){const b=base[i];const y=(b[1]-t*(0.9+b[3]*0.6)*sp)%H0;pos[i*3]=b[0]+Math.sin(t*0.8+b[3]*9)*0.3;pos[i*3+1]=(y<0?y+H0:y)+(o.y0||0);pos[i*3+2]=b[2]}g.attributes.position.needsUpdate=true}};
}
function snowGround(scene,c=0xeef3ff){const g=new THREE.Mesh(new THREE.PlaneGeometry(400,400),lamb(c));g.rotation.x=-Math.PI/2;g.position.y=-0.01;scene.add(g);return g}
function starField(scene,n,r,o={}){const g=new THREE.BufferGeometry();const pos=[];for(let i=0;i<n;i++){pos.push((r()-0.5)*(o.w||120),(o.y0??6)+r()*(o.h||40),(o.z??-60)-r()*20)}g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const p=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff6d8,size:o.size||0.25}));scene.add(p);return p}
function nightScene(){const scene=new THREE.Scene();addLights(scene,{hemi:1.25,sky:0xbcd0ff,ground:0x8a8fb0,dir:1.1,sun:0xfff0dd,dpos:[5,10,8]});return scene}
function roomScene(){const scene=new THREE.Scene();addLights(scene,{hemi:1.45,sky:0xfff1dd,ground:0x9a7a6a,dir:1.2,sun:0xffe2b8,dpos:[4,9,7]});return scene}
// 거실: 벽난로 + 양말 + 트리 + 소파 + TV + 현관문
function livingRoom(scene,o={}){
  const g=new THREE.Group();scene.add(g);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xc9a27a));fl.rotation.x=-Math.PI/2;g.add(fl);
  const rug=new THREE.Mesh(new THREE.CircleGeometry(2.2,32),lamb(0xb84a4a));rug.rotation.x=-Math.PI/2;rug.position.set(0.3,0.01,1.2);rug.scale.set(1.4,1,1);g.add(rug);
  const wallB=new THREE.Mesh(new THREE.BoxGeometry(20,7,0.2),lamb(o.wall??0xf1e3cf));wallB.position.set(0,3.5,-3.2);g.add(wallB);
  const wallL=new THREE.Mesh(new THREE.BoxGeometry(0.2,7,14),lamb(0xe8d6bf));wallL.position.set(-6.5,3.5,2);g.add(wallL);
  // 벽지 줄무늬
  for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(0.18,7),lamb(0xe9d6bd));s.position.set(-6.4+i*1.0,3.5,-3.09);g.add(s)}
  // 벽난로
  const fp=new THREE.Group();fp.position.set(-2.4,0,-2.9);g.add(fp);
  const fb=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.0,0.7),lamb(0xb05a48));fb.position.y=1.0;fp.add(fb);
  const op=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.0,0.1),basic(0x2a1612));op.position.set(0,0.62,0.33);fp.add(op);
  const fire=glowSprite('rgba(255,150,60,1)',1.6);fire.position.set(0,0.5,0.45);fp.add(fire);
  const flames=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.14,0.45,6),basic([0xffb347,0xff7a3a,0xffd36b][i]));f.position.set(-0.25+i*0.25,0.35,0.36);fp.add(f);flames.push(f)}
  const mantel=new THREE.Mesh(new THREE.BoxGeometry(2.8,0.16,0.9),lamb(0xf2ebe0));mantel.position.y=2.05;fp.add(mantel);
  for(let i=0;i<3;i++){const st=new THREE.Group();st.position.set(-0.8+i*0.8,1.7,0.5);fp.add(st);const sk=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.45,0.08),lamb([0xd8343c,0x2f8a4f,0xd8343c][i]));st.add(sk);const ft=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.12,0.09),lamb([0xd8343c,0x2f8a4f,0xd8343c][i]));ft.position.set(0.06,-0.2,0);st.add(ft);const cf=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.1,0.1),lamb(WHITE));cf.position.y=0.2;st.add(cf)}
  const gar=[];for(let i=0;i<12;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),basic([0xff4d5e,0xffd84d,0x5fd38a,0x5fb0ff][i%4]));b.position.set(-1.3+i*0.24,2.0-Math.sin(i/11*Math.PI)*0.18,0.48);fp.add(b);gar.push(b)}
  // 트리 + 선물
  const tree=xmasTree(1.0,{seed:9});tree.position.set(2.8,0,-2.0);g.add(tree);
  // 소파 + TV
  const sofa=new THREE.Group();sofa.position.set(1.0,0,2.4);sofa.rotation.y=Math.PI;g.add(sofa);
  const sb=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.55,1.0),lamb(0x5b7bb5));sb.position.y=0.4;sofa.add(sb);
  const sbk=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.9,0.3),lamb(0x4d6aa0));sbk.position.set(0,0.85,-0.38);sofa.add(sbk);
  for(const s of[-1,1]){const ar=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.75,1.0),lamb(0x4d6aa0));ar.position.set(s*1.3,0.5,0);sofa.add(ar)}
  const cush=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.15),lamb(0xd8343c));cush.position.set(-0.9,0.85,-0.18);cush.rotation.z=0.2;sofa.add(cush);
  const blanket=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.06,0.9),lamb(0xf2e6c9));blanket.position.set(0.6,0.7,0.05);sofa.add(blanket);
  const tv=new THREE.Group();tv.position.set(1.0,0,-2.9);g.add(tv);
  const stand=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.6,0.5),lamb(0x8a6a4a));stand.position.y=0.3;tv.add(stand);
  const sc=new THREE.Mesh(new THREE.BoxGeometry(2.0,1.15,0.1),lamb(0x1d1d22));sc.position.y=1.25;tv.add(sc);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.86,1.0),new THREE.MeshBasicMaterial({map:canvasTex(372,200,(x,w,h)=>{const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#4a6cff');gr.addColorStop(1,'#62d6ff');x.fillStyle=gr;x.fillRect(0,0,w,h);x.fillStyle='#7be37b';x.fillRect(0,150,w,50);x.fillStyle='#ffd84d';x.fillRect(150,110,34,40);x.fillStyle='#ff5a5f';x.fillRect(60,60,60,22);x.fillRect(260,40,70,22);x.fillStyle='#fff';x.font='900 22px sans-serif';x.fillText('STAGE 7',12,26)})}));scr.position.set(0,1.25,0.06);tv.add(scr);
  const tvg=glowSprite('rgba(120,170,255,1)',2.6);tvg.position.set(0,1.25,0.4);tv.add(tvg);
  // 현관문(오른쪽 벽)
  const wallR=new THREE.Mesh(new THREE.BoxGeometry(0.2,7,14),lamb(0xe8d6bf));wallR.position.set(6.3,3.5,2);g.add(wallR);
  const door=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.3,1.2),lamb(0x7a4a2e));door.position.set(6.18,1.15,0.6);g.add(door);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),lamb(GOLD));knob.position.set(6.1,1.1,0.2);g.add(knob);
  const dwr=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.07,8,18),lamb(0x2f7a45));dwr.rotation.y=Math.PI/2;dwr.position.set(6.1,1.75,0.6);g.add(dwr);
  // 창문(밤/낮)
  const winMat=new THREE.MeshBasicMaterial({color:0x2a3a6a});const win=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.6),winMat);win.position.set(-4.6,3.0,-3.08);g.add(win);
  for(const [w2,h2,x,y] of[[0.08,1.6,-4.6,3.0],[1.8,0.08,-4.6,3.0]]){const f=new THREE.Mesh(new THREE.PlaneGeometry(w2,h2),basic(0xf2ebe0));f.position.set(x,y,-3.07);g.add(f)}
  return {g,fp,fire,flames,gar,tree,sofa,tv,tvg,door,winMat,scr};
}
function updRoom(R,t){R.flames.forEach((f,i)=>{f.scale.set(1,0.8+0.35*Math.abs(Math.sin(t*9+i*2)),1)});R.fire.scale.setScalar(1.5+Math.sin(t*7)*0.12);twinkle(R.gar,t);twinkle(R.tree.userData.orn,t,1);R.tvg.material.opacity=0.6+0.2*Math.sin(t*5)}
// 북극 작업장
function workshop(){const g=new THREE.Group();
  const wall=new THREE.Mesh(new THREE.BoxGeometry(7,3.4,4),lamb(0x9a5a3a));wall.position.y=1.7;g.add(wall);
  for(let i=0;i<7;i++){const pl=new THREE.Mesh(new THREE.BoxGeometry(0.05,3.4,0.02),lamb(0x7a4428));pl.position.set(-3.5+i+0.5,1.7,2.01);g.add(pl)}
  const sh=new THREE.Shape();sh.moveTo(-3.9,0);sh.lineTo(3.9,0);sh.lineTo(0,2.3);sh.closePath();const rg=new THREE.ExtrudeGeometry(sh,{depth:4.6,bevelEnabled:false});rg.translate(0,0,-2.3);
  const roof=new THREE.Mesh(rg,lamb(0xfafcff));roof.position.y=3.4;g.add(roof);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(2.0,2.4),basic(0xffd98a));door.position.set(0,1.2,2.02);g.add(door);
  const dg=glowSprite('rgba(255,210,130,1)',4.5);dg.position.set(0,1.3,2.3);g.add(dg);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.4,0.75),new THREE.MeshBasicMaterial({map:canvasTex(680,150,(x,w,h)=>{x.fillStyle='#c9303a';rr(x,0,0,w,h,30);x.fill();x.fillStyle='#fff';x.font='900 84px "Noto Sans CJK KR"';x.textAlign='center';x.textBaseline='middle';x.fillText('산타 작업장',w/2,h/2+4)})}));sign.position.set(0,2.95,2.04);g.add(sign);
  for(const x of[-2.6,2.6]){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.9),basic(0xffd98a));w.position.set(x,1.9,2.02);g.add(w)}
  const bulbs=[];for(let i=0;i<=24;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),basic([0xff4d5e,0xffd84d,0x5fd38a,0x5fb0ff][i%4]));b.position.set(-3.6+7.2*i/24,3.35,2.35);g.add(b);bulbs.push(b)}
  g.userData.bulbs=bulbs;return g}
