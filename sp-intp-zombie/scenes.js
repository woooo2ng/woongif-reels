// ---------- INTP 좀비편 전용 ----------
function setSky(a,b){bgEl.style.background=`linear-gradient(${a},${b})`}
function topB(b){b.material.depthTest=false;b.renderOrder=10;return b}
function show(b,t,t0,t1){scaleBubble(b,t>=t0&&t<t1?pop((t-t0)/0.25):0)}
function bubH(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||'#ece4ff',fg:o.fg||'#3d2a6b',fs:o.fs||64,size:o.size||0.0026}))}
function bubZ(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||'#dcebc9',fg:o.fg||'#2f4020',fs:o.fs||64,size:o.size||0.0026}))}
const sh=(el,on)=>{el.style.display=on?'':'none'};
function fadeEl(el,t,t0,t1,d=0.12){el.style.opacity=Math.min(clamp01((t-t0)/d),clamp01((t1-t)/d))}
// 사람 얼굴 부품 찾기
function eyesOf(p){return p.userData.head.children.filter(m=>m.geometry&&m.geometry.parameters&&m.geometry.parameters.width===0.05)}
function cheeksOf(p){return p.userData.head.children.filter(m=>m.geometry&&m.geometry.parameters&&m.geometry.parameters.width===0.07)}
// INTP 주인공: 보라 후드티, 반쯤 감긴 눈, 다크서클
const HOOD=0x8a7fc0;
function hero(r,o={}){const p=addFace(makePerson(r,{shirt:o.shirt??HOOD,pants:0x3a3d4a,hair:0x2a2430}));const h=p.userData.head;
  eyesOf(p).forEach(e=>e.scale.y=0.42);h.children[0].material=smooth(0xf6d7bc);p.userData.arms.forEach(a=>a.children[1].material=lamb(0xf6d7bc));
  for(const s of[-1,1]){const bag=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.018,0.01),basic(0xb79fc9));bag.position.set(s*0.09,0.212,0.243);h.add(bag)}
  const hood=new THREE.Mesh(new THREE.SphereGeometry(0.305,40,20,0,Math.PI*2,0,Math.PI*0.62),smooth(o.shirt??HOOD));hood.position.y=0.24;hood.rotation.x=-0.62;h.add(hood);
  const hd=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.14,0.3),lamb(0x7a70b0));hd.position.set(0,0.66,-0.12);p.userData.hip.add(hd);// 내려간 후드
  for(const s of[-1,1]){const st=new THREE.Mesh(new THREE.BoxGeometry(0.025,0.18,0.02),lamb(0xf2f2f2));st.position.set(s*0.07,0.52,0.17);p.userData.hip.add(st)}
  p.userData.hood=hood;p.userData.hoodDown=hd;hoodUp(p,o.hood??1);return p}
function hoodUp(p,k){const u=p.userData;u.hood.visible=k>0.5;u.hoodDown.visible=k<=0.5;if(k>0.5){u.hood.rotation.x=-0.62-(1-k)*1.4}}
function eyeOpen(p,k){eyesOf(p).forEach(e=>e.scale.y=k)}
// 좀비: 초록 피부, 흰자 눈, 벌린 입, 찢어진 옷
const ZSKIN=[0xa6c494,0x9cbb8c,0xb1c99b];
const ZSHIRT=[0x8a94a6,0x9a8a78,0x7f9483,0xa08a9a,0x8899aa];
function zombie(r,o={}){const p=addFace(makePerson(r,{shirt:o.shirt??pick(r,ZSHIRT),pants:pick(r,[0x4a4f5a,0x55504a,0x4a5a50]),hair:pick(r,[0x3a3a30,0x4a4038,0x2e2e2a])}));
  const u=p.userData,h=u.head,sk=pick(r,ZSKIN);
  h.children[0].material=smooth(sk);
  u.arms.forEach(a=>a.children[1].material=lamb(sk));
  eyesOf(p).forEach(e=>{e.material=basic(0xf4f6e6);e.scale.set(1.25,0.85,1)});
  cheeksOf(p).forEach(c=>c.material=basic(0x8aa97c));
  setFace(p,false);u.flat.visible=false;u.smile.visible=false;
  const m=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.05,0.012),basic(0x3a2226));m.position.set(0,0.15,0.244);h.add(m);
  for(let i=0;i<3;i++){const t=new THREE.Mesh(new THREE.BoxGeometry(0.08+r()*0.06,0.05+r()*0.05,0.01),lamb(0x3e3a3a));t.position.set((r()-0.5)*0.36,0.12+r()*0.4,0.165);t.rotation.z=(r()-0.5);u.hip.add(t)}
  u.zph=r()*6;return p}
function zPose(p,t,walk=0){const u=p.userData,ph=u.zph;
  u.arms[0].rotation.x=-1.45+Math.sin(t*2+ph)*0.08;u.arms[1].rotation.x=-1.35+Math.sin(t*2.3+ph)*0.08;u.arms[0].rotation.z=-0.05;u.arms[1].rotation.z=0.05;
  u.head.rotation.z=0.28+Math.sin(t*1.3+ph)*0.06;u.head.rotation.x=0.12;u.hip.rotation.z=Math.sin(t*1.7+ph)*0.05;
  const s=Math.sin(t*3.2+ph)*walk;u.legs[0].rotation.x=s*0.35;u.legs[1].rotation.x=-s*0.35;u.hip.position.y=0.8+Math.abs(Math.cos(t*3.2+ph))*0.03*walk}
function slouch(p,k=1){const u=p.userData;u.head.rotation.x=0.12*k;u.arms.forEach(a=>a.rotation.z=0)}
function lie(p,y=0.71,z=0){p.rotation.set(-Math.PI/2,0,0);p.position.set(0,y,z)}
// ---------- 무대 ----------
function makeStreet(scene,r,o={}){
  const g=new THREE.Mesh(new THREE.PlaneGeometry(400,400),lamb(o.ground??0xa9b49a));g.rotation.x=-Math.PI/2;g.position.y=-0.02;scene.add(g);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(6,400),lamb(0x3b3f48));road.rotation.x=-Math.PI/2;scene.add(road);
  for(const s of[-1,1]){const sw=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.12,400),lamb(0x8a8690));sw.position.set(s*4.6,0.06,0);scene.add(sw)}
  for(let z=20;z>-200;z-=4){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.18,1.8),basic(0xd8d8d8));l.rotation.x=-Math.PI/2;l.position.set(0,0.01,z);scene.add(l)}
  for(const s of[-1,1]){let z=14;while(z>-140){const w=4+r()*3,h=8+r()*16,d=5;const b=makeBuilding(r,d,h,w,{wall:pick(r,['#5a5674','#4e5370','#615a6a','#525e66']),win:'#232a44',lit:0.3});b.position.set(s*(6.2+d/2+r()*0.6),b.position.y,z-w/2);scene.add(b);z-=w+0.4}}
}

function lamp(scene,x,z,h=3.6){const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,h,8),lamb(0x3a3a44));pole.position.y=h/2;g.add(pole);
  const arm=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.06,0.06),lamb(0x3a3a44));arm.position.set(x>0?-0.35:0.35,h,0);g.add(arm);
  const bulb=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.08,0.18),basic(0xfff2c0));bulb.position.set(x>0?-0.65:0.65,h-0.05,0);g.add(bulb);
  const gl=glowSprite('rgba(255,236,170,1)',3.2);gl.position.copy(bulb.position);gl.position.y-=0.1;g.add(gl);
  const pool=new THREE.Mesh(new THREE.CircleGeometry(1.5,24),new THREE.MeshBasicMaterial({color:0xffe9a8,transparent:true,opacity:0.22,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(bulb.position.x,0.02,0);g.add(pool);
  const L=new THREE.PointLight(0xffe2a0,6,7,1.6);L.position.copy(bulb.position);g.add(L);
  g.position.set(x,0,z);scene.add(g);g.userData={bulb,gl,pool,L};return g}
function lampOn(l,k){const u=l.userData;u.bulb.material.color.setHex(k>0.5?0xfff2c0:0x55554a);u.gl.visible=k>0.5;u.pool.visible=k>0.5;u.L.intensity=k>0.5?6:0}
function nightLights(scene,o={}){scene.add(new THREE.HemisphereLight(o.sky??0xb0b6ee,o.ground??0x4a4660,(o.hemi??1.1)*1.35));const f=new THREE.DirectionalLight(0xffe8d8,0.55);f.position.set(1,3,10);scene.add(f);const d=new THREE.DirectionalLight(o.sun??0xa8b4ff,o.dir??0.7);d.position.set(-5,10,6);scene.add(d)}
function alley(scene,r,o={}){
  ground(scene,0x4b4e58,200);
  for(const s of[-1,1])for(let z=8;z>-40;z-=4.6){const h=5+r()*5;const b=makeBuilding(r,3,h,4.4,{wall:pick(r,['#6b6478','#5d6175','#726a6a','#5f6a6e']),win:'#2a3048',lit:0.12});b.position.set(s*3.9,h/2,z);scene.add(b)}
  for(let i=0;i<6;i++){const bin=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.8,0.5),lamb(pick(r,[0x4f7a5a,0x5a6a8a])));bin.position.set((i%2?1:-1)*2.1,0.4,4-i*5.5);scene.add(bin);
    const bag=new THREE.Mesh(new THREE.IcosahedronGeometry(0.32,0),lamb(0x2a2a30));bag.position.set((i%2?1:-1)*1.8,0.25,3.2-i*5.5);scene.add(bag)}
}
function roomBox(scene,o={}){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(14,14),lamb(o.floor??0xb89a7a));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(14,6),lamb(o.wall??0x6f6a92));bw.position.set(0,3,-3);scene.add(bw);
  const lw=new THREE.Mesh(new THREE.PlaneGeometry(14,6),lamb(o.wall2??0x625d84));lw.rotation.y=Math.PI/2;lw.position.set(-3.2,3,0);scene.add(lw);
  return {fl,bw,lw}}
function bed(scene,x=0,z=-0.95){const g=new THREE.Group();
  const fr=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.35,2.5),lamb(0x8a6a4e));fr.position.y=0.175;g.add(fr);
  const mat=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.2,2.4),lamb(0xf2efe8));mat.position.y=0.45;g.add(mat);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.0,0.12),lamb(0x7a5a40));hb.position.set(0,0.5,-1.25);g.add(hb);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.16,0.42),lamb(0xffffff));pil.position.set(0,0.62,-0.95);g.add(pil);
  g.position.set(x,0,z);scene.add(g);return g}
function blanket(scene,col=0xb7a6e6){const m=new THREE.Mesh(new THREE.BoxGeometry(1.46,0.3,1),lamb(col));scene.add(m);
  return k=>{// k: 덮인 정도 0(가슴)~1(머리 끝)
    const z0=0.32,z1=-1.35-k*0.75;m.scale.z=z0-z1;m.position.set(0,0.66+k*0.05,(z0+z1)/2)}}
function windowPlane(scene,x,y,z,w,h,col,ry=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),basic(col));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(w+0.12,h+0.12,0.04),lamb(0xe8e2d6));fr.position.set(x,y,z-0.03);fr.rotation.y=ry;scene.add(fr);return m}
function wb(scene,x,y,z,w=3.2,h=1.8){// 화이트보드(캔버스)
  const c=document.createElement('canvas');c.width=1280;c.height=720;const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}));m.position.set(x,y,z);scene.add(m);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(w+0.12,h+0.12,0.05),lamb(0xbfc3cc));fr.position.set(x,y,z-0.03);scene.add(fr);
  return {c,x:c.getContext('2d'),tex,k:-1}}
function wbDraw(B,k,eu=0){k=Math.round(clamp01(k)*60)/60;const key=k+'_'+Math.round(eu*30);if(key===B.k)return;B.k=key;const x=B.x;
  x.fillStyle='#fbfbf7';x.fillRect(0,0,1280,720);x.lineCap='round';x.lineJoin='round';
  const pen=(c,w)=>{x.strokeStyle=c;x.fillStyle=c;x.lineWidth=w};
  const txt=(s,px,py,fs,c='#2b2b3a')=>{x.font=`900 ${fs}px ${FONT}`;x.fillStyle=c;x.textAlign='center';x.textBaseline='middle';x.fillText(s,px,py)};
  // 좀비 머리 스케치
  if(k>0.02){pen('#2f6b3a',9);x.beginPath();x.arc(200,250,110,0,Math.PI*2);x.stroke()}
  if(k>0.08){pen('#2f6b3a',9);for(const ex of[160,240]){x.beginPath();x.arc(ex,230,18,0,Math.PI*2);x.stroke()}x.beginPath();x.moveTo(165,300);x.lineTo(235,300);x.stroke()}
  if(k>0.14)txt('좀비 A',200,410,48,'#2f6b3a');
  if(k>0.2){pen('#3a5bd9',8);x.beginPath();x.moveTo(330,200);x.lineTo(520,130);x.stroke();x.beginPath();x.moveTo(520,130);x.lineTo(490,118);x.moveTo(520,130);x.lineTo(500,155);x.stroke()}
  if(k>0.26)txt('배고픔?',640,120,58,'#3a5bd9');
  if(k>0.32){pen('#3a5bd9',8);x.beginPath();x.moveTo(330,290);x.lineTo(520,330);x.stroke()}
  if(k>0.38)txt('본능?',640,335,58,'#3a5bd9');
  if(k>0.44){pen('#d94a3a',7);x.beginPath();x.moveTo(760,120);x.bezierCurveTo(900,120,900,330,760,335);x.stroke()}
  if(k>0.5)txt('뇌 신호 Δ',1040,220,54,'#d94a3a');
  if(k>0.58)txt('f(배고픔) = 본능²',330,560,56,'#2b2b3a');
  if(k>0.68)txt('∴ ?',800,560,64,'#2b2b3a');
  if(k>0.78)txt('→ 해독 가능?',1030,560,52,'#2b2b3a');
  if(k>0.88){pen('#555',5);for(let i=0;i<5;i++){x.beginPath();x.moveTo(100+i*40,640);x.lineTo(130+i*40,690);x.stroke()}}
  if(eu>0){txt('치료제?!',1010,400,88,'#d92a2a');pen('#d92a2a',10);x.beginPath();x.ellipse(1010,400,190,80,-0.05,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp01(eu));x.stroke()}
  B.tex.needsUpdate=true}
{const st=document.createElement('style');st.textContent=`
.tag{top:250px}
.title1{top:320px;font-size:118px}
.title2{top:450px;font-size:156px;letter-spacing:-4px}
.title3{top:640px;font-size:96px;letter-spacing:-4px}
.alertb{position:absolute;left:70px;right:70px;top:150px;background:rgba(250,250,252,.97);border-radius:36px;padding:26px 34px;box-shadow:0 18px 50px rgba(0,0,0,.4);color:#222}
.alertb .h{display:flex;align-items:center;gap:16px;font-size:36px;font-weight:800;color:#666}
.alertb .h i{font-style:normal;background:#ff3b3b;color:#fff;border-radius:12px;padding:4px 14px;font-weight:900}
.alertb .m{margin-top:14px;font-size:50px;font-weight:900;line-height:1.35}
.tv{position:absolute;left:50px;right:50px;top:330px;height:760px;background:#1b2140;border:20px solid #101014;border-radius:34px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.tv .live{position:absolute;left:30px;top:26px;background:#ff2d2d;color:#fff;font-weight:900;font-size:40px;padding:4px 18px;border-radius:10px}
.tv .ch{position:absolute;right:30px;top:26px;color:#fff;opacity:.8;font-weight:800;font-size:38px}
.tv .map{position:absolute;left:50%;top:110px;transform:translateX(-50%);width:420px;height:300px}
.tv .bar{position:absolute;left:0;right:0;bottom:150px;background:#d61f2b;color:#fff;font-weight:900;font-size:78px;padding:14px 34px;white-space:nowrap}
.tv .bar b{background:#fff;color:#d61f2b;padding:0 18px;border-radius:10px;margin-right:24px}
.tv .sub{position:absolute;left:0;right:0;bottom:84px;background:#fff;color:#1b2140;font-weight:900;font-size:44px;padding:8px 34px;white-space:nowrap}
.tv .tick{position:absolute;left:0;bottom:0;height:84px;width:4000px;background:#11162c;color:#ffd84d;font-weight:800;font-size:40px;line-height:84px;white-space:nowrap}
.app{position:absolute;left:150px;top:170px;width:780px;height:1040px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.app .screen{position:relative;width:100%;height:100%;border-radius:60px;background:#f6f6f9;overflow:hidden;text-align:center;color:#333}
.app .top{height:150px;background:#ffd84d;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:900;color:#3a2a00}
.app .srch{margin:30px 40px;height:80px;border-radius:40px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08);font-size:38px;line-height:80px;color:#999;text-align:left;padding-left:34px}
.app .ic{margin:90px auto 0;width:230px;height:230px;border-radius:50%;background:#e4e4ea;display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:900;color:#aaa}
.app .t1{margin-top:50px;font-size:56px;font-weight:900}
.app .t2{margin-top:20px;font-size:38px;color:#888;font-weight:700}
.app .t3{margin-top:60px;display:inline-block;background:#eee;border-radius:24px;padding:14px 34px;font-size:36px;color:#999;font-weight:800}
.lap{position:absolute;left:60px;right:60px;top:300px;height:700px;background:#2a2a33;border-radius:30px;padding:22px;box-sizing:border-box;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.lap .screen{width:100%;height:100%;background:#fff;border-radius:14px;overflow:hidden;position:relative}
.lap .tb{height:70px;background:#ececf2;display:flex;align-items:center;padding:0 26px;gap:12px;font-size:32px;color:#666;font-weight:800}
.lap .tb i{width:20px;height:20px;border-radius:50%;display:inline-block}
.lap .doc{padding:50px 60px;font-size:60px;font-weight:900;color:#bbb}
.lap .cur{display:inline-block;width:6px;height:70px;background:#222;vertical-align:middle;margin-left:4px}
.lap .body{padding:0 60px;font-size:44px;color:#333;font-weight:700}
.dlg{position:absolute;left:50%;top:430px;transform:translateX(-50%);width:820px;background:#fafafd;border-radius:26px;box-shadow:0 20px 60px rgba(0,0,0,.45);padding:34px 40px;box-sizing:border-box;color:#222}
.dlg .h{font-size:44px;font-weight:900}
.dlg .f{margin-top:24px;font-size:38px;color:#777;font-weight:700}
.dlg .in{margin-top:12px;height:86px;border:4px solid #7c6cf0;border-radius:16px;font-size:40px;line-height:78px;padding:0 20px;font-weight:800;white-space:nowrap;overflow:hidden}
.dlg .bt{margin-top:26px;display:flex;justify-content:flex-end;gap:18px}
.dlg .bt span{font-size:38px;font-weight:900;padding:12px 34px;border-radius:16px;background:#e8e8ee;color:#555}
.dlg .bt .ok{background:#7c6cf0;color:#fff}
.okp{position:absolute;left:50%;top:1000px;transform:translateX(-50%);background:#2b2b3a;color:#fff;font-weight:900;font-size:52px;padding:12px 40px;border-radius:999px;white-space:nowrap}
.judge{position:absolute;left:50%;top:330px;transform:translateX(-50%);background:#8fd46a;color:#173a07;font-weight:900;font-size:76px;padding:14px 50px;border-radius:999px;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.lineup{position:absolute;left:0;right:0;top:1090px}
.lineup span{font-size:54px;font-weight:900;padding:8px 26px;border-radius:999px;background:rgba(255,255,255,.92);color:#444}
.lineup span.me{background:#c9a8ff;color:#2a1660}
.memo{position:absolute;left:150px;top:170px;width:780px;height:1040px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.35)}
.memo .screen{width:100%;height:100%;border-radius:60px;background:#fffdf3;overflow:hidden}
.memo .top{height:150px;display:flex;align-items:flex-end;padding:0 46px 20px;font-size:64px;font-weight:900;color:#222;box-sizing:border-box}
.memo .it{margin:0 30px;padding:30px 20px;border-bottom:3px solid #eee6cf}
.memo .it b{display:block;font-size:42px;color:#222}
.memo .it small{display:block;margin-top:8px;font-size:32px;color:#999;font-weight:700}
.memo .it.hl{background:#fff1a8;border-radius:24px;border:none}
.vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(60,0,0,.75) 100%)}
.end1{top:520px;font-size:110px}
.end2{top:690px;font-size:60px}
.stat{position:absolute;left:50%;top:330px;transform:translateX(-50%);display:flex;gap:26px}
.stat div{background:rgba(255,255,255,.95);border-radius:30px;padding:14px 40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.stat small{display:block;font-size:40px;font-weight:700;color:#666}
.stat b{display:block;white-space:nowrap;font-size:96px;font-weight:900;color:#7c4ce0;line-height:1.1}
`;document.head.appendChild(st)}
const _w=new THREE.Vector3();
function beatPulse(si,t){const B=EV(si).beats||[];let k=0;for(const b of B){const d=t-b;if(d>=0&&d<0.35)k=Math.max(k,1-d/0.35)}return k}

// ===== 0. 속보 → "…아 그렇구나." → 불 꺼지는 창문 (타이틀) =====
S[0]=()=>{
  const E=EV(0);
  // A: 밤 도시
  const sA=new THREE.Scene();sA.fog=new THREE.Fog(0x1e2340,18,70);nightLights(sA,{hemi:1.0});
  const r=rng(301);makeStreet(sA,r,{ground:0x3a4048});
  const cars=[];for(let i=0;i<3;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.6,2.6),lamb(0xeef0f6));b.position.y=0.5;g.add(b);
    const top=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.45,1.3),lamb(0x2a3048));top.position.y=1.02;g.add(top);
    const R=glowSprite('rgba(255,60,60,1)',2.2),Bl=glowSprite('rgba(70,120,255,1)',2.2);R.position.set(-0.3,1.4,0);Bl.position.set(0.3,1.4,0);g.add(R,Bl);
    g.position.set(i%2?1.4:-1.4,0,-4-i*9);g.rotation.y=i%2?0.2:-0.15;sA.add(g);cars.push({R,Bl,ph:i*0.3})}
  const cone=new THREE.Mesh(new THREE.ConeGeometry(3.2,22,24,1,true),new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:0.13,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));sA.add(cone);
  const spot=new THREE.Mesh(new THREE.CircleGeometry(3.2,32),new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:0.3,depthWrite:false}));spot.rotation.x=-Math.PI/2;spot.position.y=0.05;sA.add(spot);
  const heli=glowSprite('rgba(255,255,255,1)',1.2);sA.add(heli);
  const horde=[];for(let i=0;i<26;i++){const z=zombie(r);z.position.set((r()-0.5)*5.2,0,-2-i*0.42-r()*0.6);z.rotation.y=(r()-0.5)*0.3;sA.add(z);horde.push({z,z0:z.position.z,sp:0.45+r()*0.25})}
  // B: 침대
  const sB=new THREE.Scene();nightLights(sB,{hemi:0.9,sky:0x7a80c0});
  roomBox(sB,{wall:0x55507a,wall2:0x4a466e,floor:0x7a6a5e});bed(sB);windowPlane(sB,1.6,2.4,-2.95,1.4,1.2,0x23305a);
  const moon=new THREE.Mesh(new THREE.CircleGeometry(0.16,20),basic(0xfff3c4));moon.position.set(1.9,2.65,-2.93);sB.add(moon);
  const H=hero(r,{hood:0});lie(H,0.72);sB.add(H);setFace(H,false);
  const cover=blanket(sB);
  const ph=new THREE.Group();const pb=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.025,0.36),lamb(0x24242c));ph.add(pb);
  const psc=new THREE.Mesh(new THREE.PlaneGeometry(0.17,0.32),basic(0xff6b6b));psc.rotation.x=Math.PI/2;psc.position.y=-0.014;ph.add(psc);sB.add(ph);
  const pgl=new THREE.PointLight(0xffb0b0,2.5,2.2,1.5);sB.add(pgl);
  const bS=topB(makeBubble('…아 그렇구나',{bg:'#ece4ff',fg:'#3d2a6b',fs:64,size:0.0011}));bS.position.set(0.05,1.0,-2.3);sB.add(bS);scaleBubble(bS,0);
  // C: 아파트 창문
  const sC=new THREE.Scene();nightLights(sC,{hemi:1.0});
  const fac=new THREE.Mesh(new THREE.BoxGeometry(9,14,1),lamb(0x4a4868));fac.position.set(0,7,-1);sC.add(fac);
  const wins=[];const r2=rng(9);for(let c=0;c<6;c++)for(let row=0;row<9;row++){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.85),basic(0x9fb8ff));m.position.set((c-2.5)*1.35,1.3+row*1.4,-0.48);sC.add(m);wins.push({m,d:r2()*2.2})}
  ground(sC,0x2e3040,100);
  const C=cam(50);
  ui.insertAdjacentHTML('beforeend',`<div class="tag">INTP × 좀비편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">INTP인데</div><div class="title3 out">좀비 사태가 터진다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  const al=div('alertb','<div class="h"><i>긴급재난문자</i> 지금</div><div class="m">[행정안전부] 전국 좀비 사태 발생. 절대 외출하지 마십시오.</div>');
  const tv=div('tv',`<div class="live">LIVE</div><div class="ch">뉴스 속보</div><canvas class="map" width="420" height="300"></canvas><div class="bar"><b>속보</b>전국 좀비 사태 발생</div><div class="sub">외출 금지 · 문단속 철저 · 집 안에 머무르세요</div><div class="tick">● 좀비 사태 전국 확산 ● 외출 자제 권고 ● 편의점·마트 영업 중단 ● 배달 서비스 전면 중단 ● 좀비 사태 전국 확산 ● 외출 자제 권고 ●</div>`);
  const mx=tv.querySelector('canvas').getContext('2d');const tick=tv.querySelector('.tick');
  const ch=chip('생활 변화: 0%');
  return t=>{
    const TA=E.alert,TV=TA+0.95,TB=E.bed,TW=E.win;
    let sc,cm=C;
    if(t<TV){sc=sA;const k=t/TV;horde.forEach(q=>{q.z.position.z=q.z0+t*q.sp;zPose(q.z,t,0.7)});C.fov=50;C.updateProjectionMatrix();C.position.set(0.3,1.9,6.2-k*0.6);C.lookAt(0,1.2,-6);
      const a=Math.sin(t*1.3)*0.5;heli.position.set(6*Math.sin(t*0.7),18,-8);cone.position.set(heli.position.x*0.5+Math.sin(t*0.9)*2,9,-8+Math.cos(t*0.8)*3);cone.rotation.z=-heli.position.x*0.02;spot.position.set(cone.position.x,0.05,cone.position.z);
      cars.forEach(c=>{const on=Math.floor(t*4+c.ph*4)%2;c.R.visible=!!on;c.Bl.visible=!on})}
    else if(t<TB){sc=null}
    else if(t<TW){sc=sB;const k=ease((t-TB)/(TW-TB));
      const up=t<endOf(0,'s1',0.1);const dn=ease((t-endOf(0,'s1',0.1))/0.35);
      const arm=up?1:1-dn;H.userData.arms[0].rotation.set(0,0,0);H.userData.arms[1].rotation.set(-1.45*arm,0,-0.35*arm);
      ph.position.set(0.12+(1-arm)*0.6,0.72+0.56*arm-0.1*(1-arm),-1.3+(1-arm)*0.2);ph.rotation.set(-0.45*arm,0,0);ph.visible=true;psc.visible=arm>0.3;pgl.position.set(0,1.1,-1.68);pgl.intensity=arm*2.5;
      const cv=ease((t-endOf(0,'s1',0.35))/0.45);cover(cv);ph.visible=cv<0.6;
      C.fov=44;C.updateProjectionMatrix();C.position.set(0.15,3.3-k*0.2,-0.75);C.lookAt(0.05,0.8,-1.5);
      show(bS,t,at(0,'s1'),endOf(0,'s1',0.4))}
    else{sc=sC;const k=(t-TW);C.fov=50;C.updateProjectionMatrix();C.position.set(0,6.5,15+k*0.8);C.lookAt(0,6.5,-1);
      wins.forEach(w=>{w.m.material.color.setHex(k>0.5+w.d?0x23263a:0x9fb8ff)})}
    // DOM
    const T0=0.05,out=clamp01((t-TA+0.25)/0.25),os=1-out;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.7)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.7)/0.1)*os;
    sh(al,t>=TA&&t<TV+0.1);if(t>=TA){const k=ease((t-TA)/0.25);al.style.transform=`translateY(${(1-k)*-300}px) translateX(${Math.sin(t*60)*(t<TA+0.6?6:0)}px)`}
    sh(tv,t>=TV&&t<TB);if(t>=TV){tick.style.transform=`translateX(${-(t-TV)*220}px)`;
      mx.clearRect(0,0,420,300);mx.fillStyle='#2e3a6e';mx.beginPath();mx.moveTo(180,20);mx.lineTo(300,40);mx.lineTo(320,140);mx.lineTo(290,270);mx.lineTo(160,280);mx.lineTo(120,180);mx.lineTo(140,80);mx.closePath();mx.fill();
      const pts=[[220,90],[260,170],[190,210],[240,240],[170,130],[280,110]];pts.forEach(([x,y],i)=>{const k=clamp01((t-TV-i*0.35)/0.4);const pr=(Math.sin(t*6+i)*0.5+0.5);mx.fillStyle=`rgba(255,50,50,${0.35+0.4*pr})`;mx.beginPath();mx.arc(x,y,(14+pr*12)*k,0,Math.PI*2);mx.fill()})}
    renderer.setClearColor(0x000000,0);
    if(sc){setSky(sc===sA?'#141a3a':sc===sB?'#1a1830':'#151a38',sc===sA?'#3a3f72 80%':'#2e2c50 80%');renderer.render(sc,cm)}else{setSky('#0d0f1a','#1a1c2c');renderer.clear()}
    chipPop(ch,t,endOf(0,'s1',0.3));ch.style.opacity=t>endOf(0,'s1',0.3)?1:0;
    caption(0,t)};
};

// ===== 1. 3주 후: 배달 끊김 → 텅 빈 냉장고 → 후드 쓰고 출동 =====
S[1]=()=>{
  const E=EV(1);const r=rng(311);
  const app=div('app',`<div class="screen"><div class="top">배달 앱</div><div class="srch">무엇이든 배달해 드려요… (아마도)</div><div class="ic">텅</div><div class="t1">주문 가능한 가게가 없어요</div><div class="t2">근처 가게 0곳 · 배달 기사 0명</div><div class="t3">좀비 사태로 전체 휴업 중</div></div>`);
  // 냉장고 안에서 본 시점
  const sF=new THREE.Scene();nightLights(sF,{hemi:0.8});
  roomBox(sF,{wall:0x6a6488,floor:0x9a8a78});
  const H=hero(r,{hood:0});H.position.set(0,0,1.9);H.rotation.y=Math.PI;sF.add(H);
  const fr=new THREE.Group();const back=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2),basic(0xfdf8ec));back.position.set(0,1.1,-0.75);
  fr.add(back);for(const y of[0.55,1.06,1.6]){const s=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.03,0.7),new THREE.MeshBasicMaterial({color:0xe8f2ff,transparent:true,opacity:0.7}));s.position.set(0,y,0);fr.add(s)}
  for(const x of[-0.57,0.57]){const w=new THREE.Mesh(new THREE.BoxGeometry(0.04,2.1,1.4),basic(0xf2f2ee));w.position.set(x,1.1,0);fr.add(w)}
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.18,0.04,0.8),basic(0xf2f2ee));top.position.set(0,2.15,0);fr.add(top);
  const kb=new THREE.Group();const kc=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.32,14),smooth(0xe03a2a));kb.add(kc);const kcap=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,0.08,12),smooth(0xffffff));kcap.position.y=0.2;kb.add(kcap);kb.position.set(-0.2,1.26,0.25);kb.rotation.z=0;fr.add(kb);
  fr.position.set(0,0,0.2);sF.add(fr);
  const fl=new THREE.PointLight(0xfff6e0,5,4,1.2);fl.position.set(0,1.3,0.4);sF.add(fl);
  const bF=bubH(H,'…',{size:0.0018,y:2.25});
  // 현관
  const sD=new THREE.Scene();nightLights(sD,{hemi:1.0,sky:0x9a9ad8});
  roomBox(sD,{wall:0x6f6a92,floor:0x8a7a68});
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.3,0.1),lamb(0x4a3a5a));door.position.set(0,1.15,-2.9);sD.add(door);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,8),lamb(0xe8c050));knob.position.set(0.45,1.1,-2.83);sD.add(knob);
  const shoes=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.12,0.3),lamb(0x2b2b30));shoes.position.set(-0.4,0.06,-2.4);sD.add(shoes);
  const H2=hero(r,{hood:0});H2.position.set(0,0,-1.6);sD.add(H2);setFace(H2,false);
  const bD=bubH(H2,'…나가야 돼.',{size:0.0019,y:2.3});
  const C=cam(50);
  const ch=chip('3주 후',95);const ch2=chip('냉장고: 케첩 1개');const ch3=chip('외출: 21일 만');
  return t=>{
    const TF=E.fridge,TH=E.hood;let sc=null;
    sh(app,t<TF);if(t<TF)app.style.transform=`scale(${0.92+0.08*pop(t/0.3)})`;
    if(t>=TF&&t<TH){sc=sF;const k=ease((t-TF)/(TH-TF));standPose(H);slouch(H);eyeOpen(H,0.42+0.2*clamp01((t-TF-0.4)/0.2));
      C.fov=58;C.updateProjectionMatrix();C.position.set(-0.08,1.2,-0.5);C.lookAt(0.05,1.62-k*0.05,1.9);
      show(bF,t,TF+0.6,TH);fl.intensity=5*clamp01((t-TF)/0.15)}
    else if(t>=TH){sc=sD;const k=ease((t-TH)/1.8);const hk=ease((t-TH-0.3)/0.35);hoodUp(H2,hk);
      standPose(H2);const pull=clamp01((t-TH)/0.6);H2.userData.arms.forEach((a,i)=>{a.rotation.x=-2.3*Math.sin(Math.PI*pull);a.rotation.z=(i?-0.6:0.6)*Math.sin(Math.PI*pull)});
      eyeOpen(H2,0.42+0.18*hk);H2.userData.head.rotation.x=-0.05*hk;
      C.fov=42-k*6;C.updateProjectionMatrix();C.position.set(0.25,0.75,1.9-k*0.5);C.lookAt(0,1.8,-1.6);
      show(bD,t,at(1,'s2'),99)}
    renderer.setClearColor(0x000000,0);
    if(sc){setSky('#22203a','#4a4570');renderer.render(sc,C)}else{setSky('#e9e6f6','#cfc9ec');renderer.clear()}
    chipPop(ch,t,0.05);ch.style.opacity=t<TF?1:0;
    chipPop(ch2,t,TF+0.5);ch2.style.opacity=t>TF+0.5&&t<TH?1:0;
    chipPop(ch3,t,TH+0.6);ch3.style.opacity=t>TH+0.6?1:0;
    caption(1,t)};
};

// ===== 2. 골목: 긴장 → 좀비 무리 먼저 보여 줌 → 아는 사람 피하던 기술 4단계 → 회피 성공 =====
S[2]=()=>{
  const E=EV(2);const r=rng(321);
  const sc=new THREE.Scene();sc.fog=new THREE.Fog(0x161a2c,8,30);nightLights(sc,{hemi:0.85,dir:0.5});
  ground(sc,0x4b4e58,200);
  for(const sd of[-1,1])for(let z=8;z>-40;z-=4.6){if(sd>0&&Math.abs(z-3.4)<0.1)continue;const h=5+r()*5;const bl=makeBuilding(r,3,h,4.4,{wall:pick(r,['#6b6478','#5d6175','#726a6a','#5f6a6e']),win:'#2a3048',lit:0.12});bl.position.set(sd*3.9,h/2,z);sc.add(bl)}
  for(let i=0;i<5;i++){const bin=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.8,0.5),lamb(pick(r,[0x4f7a5a,0x5a6a8a])));bin.position.set(-2.1,0.4,6-i*5.5);sc.add(bin)}
  const side=new THREE.Mesh(new THREE.PlaneGeometry(10,4.2),lamb(0x55586a));side.rotation.x=-Math.PI/2;side.position.set(6,0.01,3.4);sc.add(side);
  const lamps=[lamp(sc,-1.9,4.5),lamp(sc,-1.9,-2.0),lamp(sc,1.9,-9),lamp(sc,5.5,2.0)];
  const H=hero(r,{hood:1});H.rotation.y=Math.PI;sc.add(H);
  const ph=phoneMesh(0x9fd0ff);ph.position.set(0,-0.62,0.06);ph.rotation.x=-Math.PI/2;H.userData.arms[1].add(ph);
  // 앞발 신발 끈(리본)
  const lace=new THREE.Group();for(const s2 of[-1,1]){const lp=new THREE.Mesh(new THREE.TorusGeometry(0.045,0.012,6,12),lamb(0xffffff));lp.position.set(s2*0.045,0.02,0);lp.rotation.y=s2*0.5;lace.add(lp)}
  lace.position.set(0,-0.7,0.12);H.userData.legs[0].add(lace);
  const Z=[];const ZL=zombie(r,{shirt:0x8a94a6});sc.add(ZL);
  const spots=[[-1.5,-1.2],[-0.7,-1.0],[0.1,-1.6],[-1.9,-2.2],[-1.0,-2.1],[-0.1,-2.3],[-1.5,-3.2],[-0.5,-3.1],[-2.1,-3.3],[-1.0,-4.1],[0.0,-4.2]];
  spots.forEach(([x,z])=>{const q=zombie(r);q.position.set(x,0,z);sc.add(q);Z.push({z:q,x0:x,z0:z})});
  const bCall=bubH(H,'아 네네~',{size:0.0022,y:2.25}),bZ=bubZ(ZL,'으어…?',{size:0.0024,y:2.2});
  const qs=Z.slice(0,5).map(q=>bubZ(q.z,'?',{size:0.0026,y:2.15,bg:'#f1f1f4',fg:'#555'}));
  const C=cam(50);const vig=div('vig');
  const ch=chip('PM 11:40 · 편의점까지 200m');const ch2=chip('아는 사람 회피 경력 15년');
  const sk=div('judge','');sk.style.background='#ffffff';sk.style.color='#3d2a6b';sk.style.fontSize='60px';
  const jd=div('judge','회피 성공 ✔ · 성공률 100%');
  const SK=['기술 1 · 폰 보는 척','기술 2 · 신발 끈 묶는 척','기술 3 · 통화하는 척','기술 4 · 자연스럽게 꺾기'];
  return t=>{
    const TE=E.enc,K=[E.k1,E.k2,E.k3,E.k4],TL=E.lost,TD=E.ding;
    const fl=t<TE?(Math.sin(t*23)>0.85||Math.sin(t*7.3)>0.95?0:1):1;lampOn(lamps[0],fl);lampOn(lamps[1],1);lampOn(lamps[2],1);lampOn(lamps[3],1);
    // 좀비 무리: 처음부터 골목 안쪽에 있음(주인공이 모퉁이를 돌기 전엔 어둠 속)
    Z.forEach((q,i)=>{const k=clamp01((t-TE)/3);q.z.position.z=q.z0+k*0.5;zPose(q.z,t,t>TE&&t<TE+3?0.45:0);q.z.rotation.y=0;q.z.visible=t>=TE});
    standPose(H);slouch(H);ph.visible=false;lace.visible=false;H.userData.hip.position.y=0.8;H.userData.hip.rotation.x=0;H.userData.head.rotation.x=0.12;
    if(t<TE){const k=t/TE;H.position.set(0.1,0,4.6-k*2.6);walkPose(H,t*5.5,0.4)}
    else if(t<K[3]){H.position.set(0.1,0,2.0);H.rotation.y=Math.PI;
      if(t>=K[0]&&t<K[1]){ph.visible=true;const a=H.userData.arms[1];a.rotation.x=-1.35;a.rotation.z=-0.55;H.userData.head.rotation.x=0.5}
      else if(t>=K[1]&&t<K[2]){const u=H.userData;const c=ease((t-K[1])/0.3);const L=0.45*c;lace.visible=true;
        u.hip.position.y=0.8-0.25*c;u.hip.rotation.x=L;u.legs[0].rotation.x=-0.8*c-L;u.legs[1].rotation.x=0.8*c-L;u.head.rotation.x=0.45*c;
        u.arms.forEach((a,i)=>{a.rotation.x=(-0.35+Math.sin(t*16+i*2)*0.12)*c;a.rotation.z=(i?0.3:-0.3)*c});
        lace.rotation.z=Math.sin(t*14)*0.3}
      else if(t>=K[2]){ph.visible=true;const a=H.userData.arms[1];a.rotation.x=-2.5;a.rotation.z=-0.5;ph.rotation.set(-Math.PI/2,0,0);H.userData.head.rotation.x=0;H.rotation.y=Math.PI-0.35}}
    else{const k=clamp01((t-K[3])/2.4);H.rotation.y=Math.PI*0.5-0.25;H.position.set(0.1+k*3.4,0,2.0+k*1.2);walkPose(H,t*4.5,0.35);ph.visible=true;const a=H.userData.arms[1];a.rotation.x=-2.5;a.rotation.z=-0.5}
    // 대장 좀비: 1.3m 앞까지만 다가옴
    const ap=ease((t-TE)/(K[1]+0.4-TE));ZL.position.set(-0.75,0,-0.5+ap*1.15);ZL.rotation.y=0;zPose(ZL,t,t>TE&&t<K[1]+0.4?0.6:0);ZL.userData.hip.rotation.x=0;
    if(t>=K[1]+0.4&&t<K[2]){ZL.userData.head.rotation.x=0.5+Math.sin(t*9)*0.06;ZL.userData.hip.rotation.x=0.22}
    if(t>=TL){ZL.userData.head.rotation.y=Math.sin((t-TL)*3)*0.7;Z.forEach((q,i)=>{q.z.userData.head.rotation.y=Math.sin((t-TL)*2.5+i)*0.6})}
    show(bCall,t,K[2]+0.3,K[3]+0.6);show(bZ,t,TL,TD+1.2);qs.forEach((b,i)=>show(b,t,TL+0.2+i*0.12,TD+1.2));
    // 카메라
    if(t<TE){C.fov=46;C.updateProjectionMatrix();C.position.set(1.0,2.0,H.position.z+4.4);C.lookAt(-0.1,1.3,H.position.z-3)}
    else if(t<K[0]){// 좀비 무리 공개: 주인공 어깨 너머
      const k=ease((t-TE)/(K[0]-TE));C.fov=50-k*4;C.updateProjectionMatrix();C.position.set(1.0,2.5,5.8);C.lookAt(-0.5,1.2,-2.0)}
    else if(t>=K[1]&&t<K[2]){// 신발 끈: 쪼그려 앉은 주인공 쪽으로 다가감
      const k=ease((t-K[1])/1.2);C.fov=44;C.updateProjectionMatrix();C.position.set(2.0-k*0.2,2.0-k*0.3,-3.2+k*0.6);C.lookAt(-0.3,0.8,1.5)}
    else{// 마스터 숏: 좀비 무리 뒤쪽에서 주인공 얼굴 쪽
      const k=ease((t-K[0])/6);C.fov=48;C.updateProjectionMatrix();C.position.set(2.3,2.6,-4.9+k*0.5);C.lookAt(-0.35,1.0,1.1)}
    const bp=beatPulse(2,t);vig.style.opacity=t<TL?0.35+0.5*bp:0;
    renderer.setClearColor(0x000000,0);setSky('#0e1022','#262a48');renderer.render(sc,C);
    chipPop(ch,t,0.1);ch.style.opacity=t<TE?1:0;
    chipPop(ch2,t,TE+0.3);ch2.style.opacity=t>TE+0.3&&t<TD?1:0;
    let idx=-1;K.forEach((k,i)=>{if(t>=k)idx=i});
    if(idx>=0&&t<TL){sk.style.display='';if(sk.dataset.i!=idx){sk.dataset.i=idx;sk.textContent=SK[idx]}popEl(sk,t,K[idx],'translateX(-50%)')}else sk.style.display='none';
    popEl(jd,t,TD,'translateX(-50%)');jd.style.opacity=t>TD?1:0;
    caption(2,t)};
};

// ===== 3. 편의점: 따라오는 좀비 → "근데 님은 왜 물어요?" → 새벽 4시 좀비 연구 =====
S[3]=()=>{
  const E=EV(3);const r=rng(331);
  const sc=new THREE.Scene();scene_store(sc,r);
  const H=hero(r,{hood:1});H.position.set(0,0,0.6);sc.add(H);
  const Zm=zombie(r,{shirt:0x9a8a78});sc.add(Zm);
  const basket=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.25,0.3),lamb(0xe85a5a));basket.position.set(0,-0.62,0.1);H.userData.arms[0].add(basket);
  const ramen=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.08,0.14,14),lamb(0xffe08a));ramen.position.set(0,-0.62,0.08);H.userData.arms[1].add(ramen);
  const bH=bubH(H,'근데 왜 물어요?',{size:0.0013,y:2.2}),bZ=bubZ(Zm,'…으어.',{size:0.0013,y:2.2}),bH2=bubH(H,'…저도요.',{size:0.0013,y:2.2});
  const spk=textSprite('✦',90,'#fff5a0',0.004);spk.position.set(0.22,0.42,0.25);H.userData.head.add(spk);
  // 새벽 방
  const sR=new THREE.Scene();nightLights(sR,{hemi:1.0,sky:0x9a9ad8});roomBox(sR,{wall:0x5f5a86,floor:0x8a7a68});
  const B=wb(sR,0,1.9,-2.9);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.08,0.6),lamb(0x9a7652));desk.position.set(2.2,0.8,-2.3);sR.add(desk);
  const mon=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.5,0.05),basic(0x9fd0ff));mon.position.set(2.2,1.2,-2.5);sR.add(mon);
  const chair=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.6),lamb(0x4a4a5a));chair.position.set(-0.9,0.25,-0.3);sR.add(chair);
  const ZS=zombie(r,{shirt:0x9a8a78});ZS.position.set(-0.9,0.06,-0.3);ZS.rotation.y=Math.PI*0.92;sR.add(ZS);
  const HR=hero(r,{hood:0});HR.position.set(1.0,0,-2.2);HR.rotation.y=-Math.PI*0.85;sR.add(HR);
  const mk=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.16,8),lamb(0x3a5bd9));mk.position.set(0,-0.66,0.04);mk.rotation.x=Math.PI/2;HR.userData.arms[1].add(mk);
  const thought=bubH(HR,'근데 왜…?',{size:0.0017,y:2.3});
  const C=cam(50);const vig=div('vig');
  const ch=chip('AM 12:05 · 편의점');const ch2=chip('AM 4:00 · 좀비 연구 3일째');
  return t=>{
    const TT=E.turn,TL=E.lab;
    if(t<TL){
      // 주인공이 컵라면 담는 동안 등 뒤로 좀비 접근
      const zk=clamp01(t/TT);Zm.position.set(0.15,0,-4.2+zk*3.45);Zm.rotation.y=0;zPose(Zm,t,t<TT?0.7:0);if(t>TT)Zm.userData.arms.forEach(a=>a.rotation.x=-1.0);
      const tk=ease((t-TT)/0.4);H.rotation.y=Math.PI*tk;standPose(H);slouch(H);
      if(t<TT){H.userData.arms[1].rotation.x=-0.9-Math.sin(t*3)*0.3;H.userData.arms[0].rotation.x=-0.4}
      else{H.userData.arms[1].rotation.x=-0.2;H.userData.arms[0].rotation.x=-0.4;
        const cu=ease((t-at(3,'s4'))/0.3);eyeOpen(H,0.42+0.45*cu);H.userData.head.rotation.z=-0.18*cu;spk.visible=t>at(3,'s4')&&t<endOf(3,'s5',0.5)&&Math.sin(t*10)>-0.3}
      if(t<TT){spk.visible=false;eyeOpen(H,0.42);C.fov=40;C.updateProjectionMatrix();C.position.set(0.5,1.7,3.6-t*0.15);C.lookAt(0.1,1.5,-1.5)}
      else if(t<at(3,'z2')-0.1||t>=at(3,'s5')-0.1){C.fov=52;C.updateProjectionMatrix();C.position.set(1.55,1.9,-1.7);C.lookAt(0.0,1.75,0.6)}else{C.fov=52;C.updateProjectionMatrix();C.position.set(1.5,1.9,2.3);C.lookAt(0.15,1.75,-0.75)}
      show(bH,t,at(3,'s4'),endOf(3,'s4',0.2));show(bZ,t,at(3,'z2'),endOf(3,'z2',0.3));show(bH2,t,at(3,'s5'),TL);
      const bp=beatPulse(3,t);vig.style.opacity=t<TT+0.3?0.3+0.5*bp:0;
      renderer.setClearColor(0x000000,0);setSky('#e8eef6','#c9d6e6');renderer.render(sc,C)}
    else{vig.style.opacity=0;const k=(t-TL);wbDraw(B,k/3.6);sitPose(ZS);zPose(ZS,t,0);ZS.userData.arms.forEach(a=>a.rotation.x=-0.9);ZS.userData.head.rotation.x=0.12+Math.max(0,Math.sin(k*5))*0.25;ZS.userData.hip.position.y=0.56;ZS.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);
      standPose(HR);HR.userData.arms[1].rotation.x=-2.1+Math.sin(k*9)*0.15;HR.userData.arms[1].rotation.z=0.3;eyeOpen(HR,0.75);
      show(thought,t,TL+0.4,99);
      C.fov=50;C.updateProjectionMatrix();C.position.set(0.4,2.2,3.9-ease(k/3)*0.6);C.lookAt(0,1.5,-1.6);
      renderer.setClearColor(0x000000,0);setSky('#1c1a34','#3a3660');renderer.render(sR,C)}
    chipPop(ch,t,0.1);ch.style.opacity=t<TT?1:0;chipPop(ch2,t,TL+0.15);ch2.style.opacity=t>TL+0.15?1:0;
    caption(3,t)};
};
function scene_store(sc,r){
  sc.add(new THREE.HemisphereLight(0xffffff,0x9a9aa8,1.7));const d=new THREE.DirectionalLight(0xffffff,0.8);d.position.set(3,8,6);sc.add(d);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xe6e8ee));fl.rotation.x=-Math.PI/2;sc.add(fl);
  for(let i=-6;i<=6;i++){const tl=new THREE.Mesh(new THREE.PlaneGeometry(0.02,30),basic(0xd0d2da));tl.rotation.x=-Math.PI/2;tl.position.set(i*1,0.005,0);sc.add(tl)}
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(30,8),lamb(0xdfe6ee));bw.position.set(0,4,-6);sc.add(bw);
  const gd=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.6),basic(0x1e2440));gd.position.set(0.2,1.3,-5.98);sc.add(gd);// 밤 유리문
  for(const x of[-2.2,2.2])for(let z=2;z>-5;z-=0.01){break}
  for(const x of[-2.0,2.0]){const sh=new THREE.Group();const fr=new THREE.Mesh(new THREE.BoxGeometry(0.7,2.2,7),lamb(0xf2f2f2));fr.position.y=1.1;sh.add(fr);
    for(let y=0;y<4;y++)for(let z=0;z<14;z++){const c=pick(r,[0xff8a8a,0xffd36b,0x8ad0ff,0xa8e08a,0xc9a8ff,0xff9fd0]);const b=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.32,0.38),lamb(c));b.position.set(x>0?-0.42:0.42,0.4+y*0.5,-3.2+z*0.48);sh.add(b)}
    sh.position.set(x,0,-0.5);sc.add(sh)}
  for(let z=2;z>-6;z-=2){const lt=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.04,1.4),basic(0xffffff));lt.position.set(0,3.3,z);sc.add(lt)}
}

// ===== 4. 치료제?! → "근데 좀비가 꼭 나쁜 건가?" → 좀비어 연구 → "으어어… 으어?" "으어어!!" =====
function wbLang(B,k){k=Math.round(clamp01(k)*40)/40;const key='L'+k;if(key===B.k)return;B.k=key;const x=B.x;
  x.fillStyle='#fbfbf7';x.fillRect(0,0,1280,720);x.lineCap='round';
  const txt=(s,px,py,fs,c='#2b2b3a',al='center')=>{x.font=`900 ${fs}px ${FONT}`;x.fillStyle=c;x.textAlign=al;x.textBaseline='middle';x.fillText(s,px,py)};
  // 지운 자국 + 줄 그은 치료제
  x.fillStyle='rgba(180,180,190,.25)';x.fillRect(820,320,380,170);
  txt('치료제?!',1010,400,70,'rgba(217,42,42,.55)');x.strokeStyle='#d92a2a';x.lineWidth=10;x.beginPath();x.moveTo(850,400);x.lineTo(1170,400);x.stroke();
  txt('좀비어 문법 노트',420,90,74,'#2f6b3a');
  const rows=[['으어','네'],['으어?','왜요?'],['으어어!!','좋아요!!'],['그르르','배고파요'],['으어…','오늘 좀 피곤해요']];
  rows.forEach(([a,b2],i)=>{if(k>0.1+i*0.16){txt(a,90,210+i*100,56,'#2b2b3a','left');txt('=',330,210+i*100,56,'#888');txt(b2,390,210+i*100,56,'#3a5bd9','left')}});
  if(k>0.92){x.strokeStyle='#2f6b3a';x.lineWidth=8;x.beginPath();x.ellipse(1010,620,200,60,0,0,Math.PI*2);x.stroke();txt('자연스러움 92%',1010,620,48,'#2f6b3a')}
  B.tex.needsUpdate=true}
S[4]=()=>{
  const E=EV(4);const r=rng(341);
  const sR=new THREE.Scene();nightLights(sR,{hemi:1.0,sky:0x9a9ad8});roomBox(sR,{wall:0x5f5a86,floor:0x8a7a68});
  const B=wb(sR,0,1.9,-2.9);
  const HR=hero(r,{hood:0});HR.position.set(-0.7,0,-1.7);HR.rotation.y=0.45;sR.add(HR);
  const gl=glowSprite('rgba(255,240,160,1)',1.2);gl.position.set(0,0.3,0.3);HR.userData.head.add(gl);
  const chair=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.6),lamb(0x4a4a5a));chair.position.set(1.05,0.25,-0.9);sR.add(chair);
  const ZS=zombie(r,{shirt:0x9a8a78});ZS.position.set(1.05,0.06,-0.9);ZS.rotation.y=-2.5;sR.add(ZS);
  const bQ=bubH(HR,'근데 좀비가 꼭 나쁜 건가?',{size:0.0019,y:2.2});bQ.position.x=0.45;
  // 마주 앉아 대화
  const sT=new THREE.Scene();nightLights(sT,{hemi:1.05,sky:0x9a9ad8});roomBox(sT,{wall:0x5f5a86,floor:0x8a7a68});
  const B2=wb(sT,0,1.9,-2.9);
  const tbl=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.08,0.8),lamb(0x9a7652));tbl.position.set(0,0.75,-0.8);sT.add(tbl);
  const tl=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.75,0.1),lamb(0x6a5040));tl.position.set(0,0.375,-0.8);sT.add(tl);
  const nb=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.03,0.3),lamb(0xfff6d0));nb.position.set(-0.15,0.8,-0.8);sT.add(nb);
  const H2=hero(r,{hood:0});H2.position.set(-0.85,0.06,-0.8);H2.rotation.y=Math.PI/2;sT.add(H2);
  const Z2=zombie(r,{shirt:0x9a8a78});Z2.position.set(0.85,0.06,-0.8);Z2.rotation.y=-Math.PI/2;sT.add(Z2);
  for(const x of[-0.85,0.85]){const c=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.5,0.55),lamb(0x4a4a5a));c.position.set(x,0.25,-0.8);sT.add(c)}
  const bS=bubH(H2,'으어어… 으어?',{size:0.0019,y:2.0}),bZ=bubZ(Z2,'으어어!!',{size:0.0022,y:2.0});bS.position.z=0.45;bZ.position.z=0.35;
  const hearts=sprinkleHearts(sT,6,r,{x:0.85,z:-0.8,w:0.8,col:'#ff8fb3',size:0.004});
  const C=cam(50);const ch=chip('좀비어 연구 30일째');
  return t=>{
    const TEu=E.eureka,TC=E.cut,TX=E.cross,TK=E.talk;
    let S_=sR;
    sitPose(ZS);zPose(ZS,t,0);ZS.userData.arms.forEach(a=>a.rotation.x=-0.9);ZS.userData.hip.position.y=0.56;ZS.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);
    if(t<TX){wbDraw(B,1,clamp01((t-TEu)/0.5));standPose(HR);
      if(t<TC){const eu=ease((t-TEu)/0.25);eyeOpen(HR,0.75+0.6*eu);gl.visible=t>TEu&&t<TEu+1.2;gl.scale.setScalar(1.2*(1+0.3*Math.sin(t*12)));
        HR.userData.arms.forEach((a,i)=>{a.rotation.x=-2.6*eu;a.rotation.z=(i?0.3:-0.3)*eu});HR.rotation.y=0.45;
        const k=ease(t/TC);C.fov=52-k*6;C.updateProjectionMatrix();C.position.set(0.25,1.95,3.1-k*0.6);C.lookAt(0.15,1.7,-2.0)}
      else{gl.visible=false;const d=ease((t-TC)/0.4);HR.userData.arms.forEach((a,i)=>{a.rotation.x=-2.6*(1-d);a.rotation.z=(i?0.3:-0.3)*(1-d)});eyeOpen(HR,0.75);
        const tr=ease((t-at(4,'s7')-0.6)/0.5);HR.rotation.y=0.45+tr*0.9;
        const k=ease((t-TC)/2.5);C.fov=54;C.updateProjectionMatrix();C.position.set(-0.2-k*0.2,1.9,3.3-k*0.3);C.lookAt(0.0,1.55,-1.4)}
      show(bQ,t,at(4,'s7'),TX)}
    else if(t<TK){S_=sR;wbLang(B,(t-TX-0.4)/2.6);standPose(HR);HR.rotation.y=0.15;eyeOpen(HR,0.8);HR.userData.arms[1].rotation.x=-2.0+Math.sin(t*9)*0.15;HR.userData.arms[1].rotation.z=0.3;
      scaleBubble(bQ,0);const k=ease((t-TX)/3);C.fov=60;C.updateProjectionMatrix();C.position.set(0.0,1.95,2.6-k*0.3);C.lookAt(0.0,1.8,-2.6)}
    else{S_=sT;wbLang(B2,1);sitPose(H2);H2.userData.arms.forEach(a=>a.rotation.x=-1.1);eyeOpen(H2,0.75);
      sitPose(Z2);zPose(Z2,t,0);Z2.userData.hip.position.y=0.56;Z2.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);Z2.userData.arms.forEach(a=>a.rotation.x=-1.1);
      const yay=t>at(4,'z5');if(yay){Z2.userData.hip.position.y=0.56+Math.abs(Math.sin((t-at(4,'z5'))*9))*0.12;Z2.userData.arms.forEach((a,i)=>{a.rotation.x=-2.8;a.rotation.z=(i?0.3:-0.3)})}
      show(bS,t,at(4,'s8'),at(4,'z5')+0.1);show(bZ,t,at(4,'z5'),99);updHearts(hearts,t,at(4,'z5')+0.1,1.8,1.4);
      const k=ease((t-TK)/3);C.fov=54;C.updateProjectionMatrix();C.position.set(0,1.95,3.9-k*0.4);C.lookAt(0,1.4,-0.8)}
    renderer.setClearColor(0x000000,0);setSky('#1c1a34','#3a3660');renderer.render(S_,C);
    chipPop(ch,t,TX+0.2);ch.style.opacity=t>TX+0.2?1:0;
    caption(4,t)};
};

// ===== 5. 1년 후: 사람·좀비가 '으어'로 수다 → 좀비어 사전 3권 베스트셀러 → 엔딩 =====
function bookCover(n,sub,col){return canvasTex(300,420,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.9)';x.fillRect(20,20,w-40,h-40);
  x.fillStyle=col;x.font=`900 46px ${FONT}`;x.textAlign='center';x.fillText('좀비어',w/2,95);x.fillText('사전',w/2,150);
  x.fillStyle='#2b2b3a';x.font=`900 64px ${FONT}`;x.fillText(n+'권',w/2,250);x.font=`800 30px ${FONT}`;x.fillStyle='#666';x.fillText(sub,w/2,315);
  x.fillStyle='#9cbb8c';x.beginPath();x.arc(w/2,370,22,0,Math.PI*2);x.fill()})}
S[5]=()=>{
  const E=EV(5);const r=rng(351);
  const sc=new THREE.Scene();addLights(sc,{hemi:1.5});
  ground(sc,0xa9b49a,200);
  const shop=new THREE.Mesh(new THREE.BoxGeometry(9,4,3),lamb(0xe9ecf2));shop.position.set(0,2,-3);sc.add(shop);
  const sign=new THREE.Mesh(new THREE.BoxGeometry(6,0.7,0.1),lamb(0x7c6cf0));sign.position.set(0,3.4,-1.45);sc.add(sign);
  const gls=new THREE.Mesh(new THREE.PlaneGeometry(5,2.2),basic(0xbfdcef));gls.position.set(0,1.3,-1.48);sc.add(gls);
  const side=new THREE.Mesh(new THREE.BoxGeometry(9,0.12,2.5),lamb(0xd8d2c6));side.position.set(0,0.06,-0.4);sc.add(side);
  for(const bx of[-1.7,1.7]){const bench=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.12,0.6),lamb(0x9a7652));bench.position.set(bx,0.5,-0.6);sc.add(bench);
    for(const s of[-1,1]){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.5,0.5),lamb(0x5a4a3a));leg.position.set(bx+s*0.95,0.25,-0.6);sc.add(leg)}}
  const ppl=[];[[-2.2,'h',0.5],[-1.2,'z',-0.5],[1.2,'h',0.5],[2.2,'z',-0.5]].forEach(([x,k,ry])=>{const p=k==='z'?zombie(r):hero(r,{hood:0,shirt:pick(r,[0x8a7fc0,0x7f9bb8,0xa88fb0])});p.position.set(x,0.06,-0.6);p.rotation.y=ry;sc.add(p);ppl.push({p,z:k==='z'})});
  const talk=[bubH(ppl[0].p,'으어?',{size:0.0024,y:2.0}),bubZ(ppl[1].p,'으어어~',{size:0.0024,y:2.0}),bubH(ppl[2].p,'으어 ㅋㅋ',{size:0.0024,y:2.0}),bubZ(ppl[3].p,'으어!!',{size:0.0024,y:2.0})];
  // 서점 진열대
  const sB=new THREE.Scene();addLights(sB,{hemi:1.6});
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xe8dccb));fl.rotation.x=-Math.PI/2;sB.add(fl);
  const wl=new THREE.Mesh(new THREE.PlaneGeometry(30,10),lamb(0xf3ece0));wl.position.set(0,4,-3);sB.add(wl);
  for(let i=0;i<4;i++)for(let j=0;j<12;j++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.5,0.3),lamb(pick(r,[0xd98c8c,0x8cc9a0,0xe0c070,0xa58cd0,0x7fb7c9])));b.position.set(-3+j*0.55+(r()-0.5)*0.1,1.0+i*0.75,-2.85);sB.add(b)}
  const stand=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.9,1.0),lamb(0x8a6a4e));stand.position.set(0,0.45,-0.5);sB.add(stand);
  const books=[[1,'기초 으어','#7c6cf0'],[2,'존댓말 으어','#e2557a'],[3,'감정 표현','#3a9a6a']].map(([n,sub,col],i)=>{const g=new THREE.Group();
    const bd=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.86,0.1),[lamb(0xffffff),lamb(0xffffff),lamb(0xffffff),lamb(0xffffff),new THREE.MeshBasicMaterial({map:bookCover(n,sub,col)}),lamb(0xffffff)]);g.add(bd);
    g.position.set((i-1)*0.8,1.33,-0.4);g.rotation.x=-0.15;sB.add(g);return g});
  const badge=labelSprite('베스트셀러 1위',{bg:'#ffd84d',fg:'#3a2a00',fs:64,size:0.0028});badge.position.set(0,2.15,-0.4);sB.add(badge);
  const crowd=[];[[-2.0,'z'],[-1.35,'h'],[1.35,'z'],[2.0,'h']].forEach(([x,k])=>{const p=k==='z'?zombie(r):hero(r,{hood:1,shirt:pick(r,[0x8a7fc0,0x7f9bb8])});p.position.set(x,0,0.9);p.rotation.y=Math.PI+(x<0?-0.3:0.3);sB.add(p);crowd.push({p,z:k==='z'})});
  const st=div('stat','<div><small>좀비 사태</small><b>1년째</b></div><div><small>감염자</small><b>0명</b></div>');
  const e1=div('end1 out','다음 좀비편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');
  const C=cam(50);const ch=chip('1년 후');const ch2=chip('좀비어 사전 누적 판매 300만 부');
  return t=>{
    const TN=at(5,'n7'),TB=E.books,TE=VOICE[5]+LEAD+0.45+0.3-1.5;
    let S_=sc;
    if(t<TB){ppl.forEach(q=>{if(q.z){zPose(q.p,t,0);q.p.userData.arms.forEach(a=>a.rotation.x=-0.9);q.p.userData.head.rotation.z=0.28}else standPose(q.p);sitPose(q.p)});
      talk.forEach((b,i)=>show(b,t,0.3+i*0.35,99));
      const k=ease(t/TB);C.fov=50;C.updateProjectionMatrix();C.position.set(-0.3+k*0.6,1.7,6.3);C.lookAt(0,1.25,-0.6)}
    else{S_=sB;crowd.forEach((q,i)=>{if(q.z)zPose(q.p,t,0);else standPose(q.p)});
      books.forEach((g,i)=>{const k=pop((t-TB-0.1-i*0.15)/0.3);g.scale.setScalar(Math.max(0.001,k))});scaleBubble(badge,t<TE?pop((t-TB-0.7)/0.3):0);
      const k=ease((t-TB)/2.5);C.fov=44;C.updateProjectionMatrix();C.position.set(0,2.4,4.6-k*0.8);C.lookAt(0,1.35,-0.4)}
    renderer.setClearColor(0x000000,0);setSky('#9fd0f5','#e8f4ff 70%');renderer.render(S_,C);
    popEl(st,t,TN,'translateX(-50%)');st.style.opacity=t>TN&&t<TB?1:0;
    chipPop(ch,t,0.1);ch.style.opacity=t<TN?1:0;chipPop(ch2,t,TB+1.0);ch2.style.opacity=t>TB+1.0&&t<TE?1:0;
    popEl(e1,t,TE);popEl(e2,t,TE+0.25);sh(e1,t>=TE);sh(e2,t>=TE);
    caption(5,t)};
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
