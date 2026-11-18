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
const teeCache={};
function teeTex(col){if(teeCache[col])return teeCache[col];return teeCache[col]=canvasTex(256,320,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.fillStyle='#ffffff';c.textAlign='center';c.textBaseline='middle';c.font=`900 54px ${FONT}`;c.fillText('좀비 잡는',w/2,120);c.font=`900 58px ${FONT}`;c.fillText('귀요미들',w/2,185);c.font=`900 50px ${FONT}`;c.fillStyle='#ffe066';c.fillText('♥',w/2,250)})}
function tee(p,col='#ff8fc8'){const body=p.userData.hip.children[0];const base=lamb(new THREE.Color(col).getHex());const front=new THREE.MeshLambertMaterial({map:teeTex(col)});body.material=[base,base,base,base,front,base];p.userData.arms.forEach(a=>a.children[0].material=base);return p}
function beatPulse(si,t){const B=EV(si).beats||[];let k=0;for(const b of B){const d=t-b;if(d>=0&&d<0.35)k=Math.max(k,1-d/0.35)}return k}
const PINK='#ffe0f0',PINKF='#7a1f52';
function bubE(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||PINK,fg:o.fg||PINKF,fs:o.fs||64,size:o.size||0.0026}))}
const EC=[0xff9fc8,0xffc46b,0x8fd3ff,0xb79bff,0x8fe3b0,0xffb38a,0xf5e36b,0xff8f8f];
const BLK=[0xffc2dc,0xfff0a8,0xbfe6ff,0xd9c8ff,0xc8f2d6,0xffd6b8];
function enfp(r,o={}){const p=addFace(makePerson(r,{shirt:o.shirt??pick(r,EC)}));setFace(p,true);
  const h=p.userData.head;const om=new THREE.Mesh(new THREE.CircleGeometry(0.055,16),basic(0x5a2a2a));om.scale.y=1.25;om.position.set(0,0.14,0.248);om.visible=false;h.add(om);p.userData.om=om;
  // 반짝이는 눈 하이라이트
  eyesOf(p).forEach(e=>{const hl=new THREE.Mesh(new THREE.BoxGeometry(0.018,0.018,0.01),basic(0xffffff));hl.position.set(0.012,0.016,0.012);e.add(hl)});
  if(o.cape!=null)cape(p,o.cape);return p}
function mouth(p,open){p.userData.om.visible=open;if(open){p.userData.smile.visible=false;p.userData.flat.visible=false}else setFace(p,true)}
function cape(p,col){const u=p.userData;
  const hood=new THREE.Mesh(new THREE.SphereGeometry(0.33,32,20,0,Math.PI*2,0,Math.PI*0.6),smooth(col));hood.position.y=0.25;hood.rotation.x=-1.05;u.head.add(hood);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.6,0.8,14,1,true),new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide}));body.position.set(0,0.2,-0.06);u.hip.add(body);
  u.cape=[hood,body];return p}
function shake(p,t,k=1){p.userData.hip.position.x=Math.sin(t*38)*0.012*k}
function laughPose(p,t,k=1,ph=0){const u=p.userData,s=Math.abs(Math.sin(t*9+ph));u.hip.rotation.x=-0.15*k*s;u.head.rotation.x=-0.25*k*s;u.arms[0].rotation.x=-0.8*k;u.arms[1].rotation.x=-0.8*k;u.arms[0].rotation.z=0.3*k;u.arms[1].rotation.z=-0.3*k}
function scream(p,k=1){armUp(p,0,k);armUp(p,1,k);const u=p.userData;u.arms[0].rotation.z=-0.5*k;u.arms[1].rotation.z=0.5*k}
function room(scene,o={}){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(16,16),lamb(o.floor??0xc9a888));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(16,6),lamb(o.wall??0xf0d9e4));bw.position.set(0,3,-3.2);scene.add(bw);
  const lw=new THREE.Mesh(new THREE.PlaneGeometry(16,6),lamb(o.wall2??0xe6cad8));lw.rotation.y=Math.PI/2;lw.position.set(-4.4,3,0);scene.add(lw);
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(16,6),lamb(o.wall2??0xe6cad8));rw.rotation.y=-Math.PI/2;rw.position.set(4.4,3,0);scene.add(rw);
  return {fl,bw,lw,rw}}
function warmLights(scene){scene.add(new THREE.HemisphereLight(0xfff2f6,0x9a7a80,1.7));const d=new THREE.DirectionalLight(0xffeedd,0.9);d.position.set(3,8,6);scene.add(d)}
function garland(scene,x0,x1,y,z,n=10){const g=new THREE.Group();const cols=[0xff8fc8,0xffd84d,0x8fd3ff,0x9df2c8,0xc9a8ff];
  for(let i=0;i<n;i++){const k=i/(n-1);const x=x0+(x1-x0)*k,yy=y-Math.sin(k*Math.PI)*0.35;const f=new THREE.Mesh(new THREE.ConeGeometry(0.13,0.24,3),lamb(cols[i%5]));f.rotation.x=Math.PI;f.position.set(x,yy-0.12,z);g.add(f)}
  const bulbs=[];for(let i=0;i<n*2;i++){const k=i/(n*2-1);const b=new THREE.Mesh(new THREE.SphereGeometry(0.045,8,6),basic(cols[(i+2)%5]));b.position.set(x0+(x1-x0)*k,y+0.12-Math.sin(k*Math.PI)*0.3,z+0.02);g.add(b);bulbs.push(b)}
  scene.add(g);g.userData.bulbs=bulbs;return g}
function banner(scene,text,x,y,z,w=4.2,h=0.8,ry=0){
  // 가로 현수막: 천 느낌(진분홍 바탕 + 흰 글씨 + 노란 테두리), 모서리 고리와 끈, 살짝 처지고 주름진 천
  const T=canvasTex(1600,300,(c,W2,H2)=>{const g=c.createLinearGradient(0,0,0,H2);g.addColorStop(0,'#ff4f8b');g.addColorStop(1,'#e23a78');c.fillStyle=g;c.fillRect(0,0,W2,H2);
    c.strokeStyle='#ffe066';c.lineWidth=14;c.strokeRect(22,22,W2-44,H2-44);
    for(let i=0;i<14;i++){c.fillStyle='rgba(255,255,255,0.06)';c.fillRect(i*120+40,0,30,H2)}
    c.font=`900 150px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=16;c.strokeStyle='#b0144f';c.strokeText(text,W2/2,H2/2+8);c.fillStyle='#ffffff';c.fillText(text,W2/2,H2/2+8);
    for(const gx of[46,W2-46])for(const gy of[46,H2-46]){c.fillStyle='#d9d9d9';c.beginPath();c.arc(gx,gy,18,0,Math.PI*2);c.fill();c.fillStyle='#6a2040';c.beginPath();c.arc(gx,gy,9,0,Math.PI*2);c.fill()}});
  const geo=new THREE.PlaneGeometry(w,h,24,4);const P=geo.attributes.position;
  for(let i=0;i<P.count;i++){const px=P.getX(i),py=P.getY(i);const u=px/w+0.5;P.setY(i,py-Math.sin(u*Math.PI)*h*0.12);P.setZ(i,Math.sin(u*Math.PI*7)*0.025+Math.sin(u*Math.PI)*0.04)}
  geo.computeVertexNormals();
  const g=new THREE.Group();const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:T,side:THREE.DoubleSide}));g.add(m);
  for(const s2 of[-1,1]){const rope=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.45,6),lamb(0xf5f0e0));rope.position.set(s2*(w/2+0.12),h/2+0.12,0);rope.rotation.z=-s2*0.6;g.add(rope);
    const nail=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,6),lamb(0x888888));nail.position.set(s2*(w/2+0.28),h/2+0.3,0);g.add(nail)}
  g.position.set(x,y,z+0.05);g.rotation.y=ry;scene.add(g);return g}
function door3(scene,x,z,ry=0){const g=new THREE.Group();const fr=new THREE.Mesh(new THREE.BoxGeometry(1.4,2.5,0.14),lamb(0xf2f2f2));fr.position.y=1.25;g.add(fr);
  const d=new THREE.Group();const dm=new THREE.Mesh(new THREE.BoxGeometry(1.15,2.25,0.12),lamb(0x8a6a8a));dm.position.set(0.575,1.13,0);d.add(dm);
  const kn=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),lamb(0xe8c050));kn.position.set(1.0,1.1,0.08);d.add(kn);d.position.set(-0.575,0,0.08);g.add(d);
  g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);g.userData.d=d;return g}
// 좀비 떼 + 밤거리 (타이틀)
