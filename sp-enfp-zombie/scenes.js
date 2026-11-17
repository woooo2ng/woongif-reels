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
// ---------- ENFP 좀비편 전용 ----------
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
function cityHorde(r){
  const sA=new THREE.Scene();sA.fog=new THREE.Fog(0x1e2340,18,70);nightLights(sA,{hemi:1.0});makeStreet(sA,r,{ground:0x3a4048});
  const cars=[];for(let i=0;i<3;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.6,2.6),lamb(0xeef0f6));b.position.y=0.5;g.add(b);
    const top=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.45,1.3),lamb(0x2a3048));top.position.y=1.02;g.add(top);
    const R=glowSprite('rgba(255,60,60,1)',2.2),Bl=glowSprite('rgba(70,120,255,1)',2.2);R.position.set(-0.3,1.4,0);Bl.position.set(0.3,1.4,0);g.add(R,Bl);
    g.position.set(i%2?1.6:-1.6,0,-6-i*9);g.rotation.y=i%2?0.2:-0.15;sA.add(g);cars.push({R,Bl,ph:i*0.3})}
  const cone=new THREE.Mesh(new THREE.ConeGeometry(3.2,22,24,1,true),new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:0.13,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));sA.add(cone);
  const spot=new THREE.Mesh(new THREE.CircleGeometry(3.2,32),new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:0.3,depthWrite:false}));spot.rotation.x=-Math.PI/2;spot.position.y=0.05;sA.add(spot);
  const heli=glowSprite('rgba(255,255,255,1)',1.2);sA.add(heli);
  const horde=[];for(let i=0;i<28;i++){const z=zombie(r);z.position.set((r()-0.5)*5.2,0,-2-i*0.42-r()*0.6);z.rotation.y=(r()-0.5)*0.3;sA.add(z);horde.push({z,z0:z.position.z,sp:0.45+r()*0.25})}
  return {sA,upd:t=>{horde.forEach(q=>{q.z.position.z=q.z0+t*q.sp;zPose(q.z,t,0.7)});heli.position.set(6*Math.sin(t*0.7),18,-8);cone.position.set(heli.position.x*0.5+Math.sin(t*0.9)*2,9,-8+Math.cos(t*0.8)*3);cone.rotation.z=-heli.position.x*0.02;spot.position.set(cone.position.x,0.05,cone.position.z);
    cars.forEach(c=>{const on=Math.floor(t*4+c.ph*4)%2;c.R.visible=!!on;c.Bl.visible=!on})}}}
{const st=document.createElement('style');st.textContent=`
.tag{top:250px;background:#ff8fc8;color:#4a0f2e}
.title1{top:320px;font-size:118px}
.title2{top:450px;font-size:156px;letter-spacing:-4px}
.title3{top:640px;font-size:96px;letter-spacing:-4px}
.alertb{position:absolute;left:70px;right:70px;top:150px;background:rgba(250,250,252,.97);border-radius:36px;padding:26px 34px;box-shadow:0 18px 50px rgba(0,0,0,.4);color:#222}
.alertb .h{display:flex;align-items:center;gap:16px;font-size:36px;font-weight:800;color:#666}
.alertb .h i{font-style:normal;background:#ff3b3b;color:#fff;border-radius:12px;padding:4px 14px;font-weight:900}
.alertb .m{margin-top:14px;font-size:50px;font-weight:900;line-height:1.35}
.vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(60,0,0,.75) 100%)}
.judge{position:absolute;left:50%;top:330px;transform:translateX(-50%);background:#ff8fc8;color:#4a0f2e;font-weight:900;font-size:68px;padding:14px 50px;border-radius:999px;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.stat{position:absolute;left:50%;top:330px;transform:translateX(-50%);display:flex;gap:26px}
.stat div{background:rgba(255,255,255,.95);border-radius:30px;padding:14px 36px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.stat small{display:block;white-space:nowrap;font-size:40px;font-weight:700;color:#666}
.stat b{display:block;white-space:nowrap;font-size:96px;font-weight:900;color:#e0408f;line-height:1.1}
.stat .c2 b{color:#9a9a9a}
.end1{top:520px;font-size:110px}
.end2{top:690px;font-size:60px}
.diary{position:absolute;left:110px;top:170px;width:860px;height:1040px;background:#fff9e8;border-radius:24px;box-shadow:0 30px 70px rgba(0,0,0,.35);overflow:hidden;color:#3a2d2d}
.diary:before{content:'';position:absolute;left:0;top:0;bottom:0;width:60px;background:repeating-linear-gradient(#e8b4c8 0 22px,#fff9e8 22px 44px)}
.diary .pg{position:absolute;inset:0;padding:50px 60px 40px 110px;box-sizing:border-box;background:repeating-linear-gradient(#fff9e8 0 74px,#d9e6f5 74px 77px);background-position:0 30px}
.diary h2{margin:0 0 18px;font-size:66px;font-weight:900;color:#e0408f}
.diary h2 small{font-size:40px;color:#9a8a8a;margin-left:14px}
.diary .l{font-size:44px;line-height:77px;font-weight:700;white-space:nowrap}
.diary .l b{color:#e0408f}
.diary .stk{position:absolute;font-size:80px;font-weight:900}
.diary .big{font-size:150px;font-weight:900;text-align:center;margin-top:160px;color:#3a2d2d}
.diary .team{display:inline-block;margin-top:14px;background:#ffd84d;border-radius:18px;padding:6px 24px;font-size:46px;font-weight:900;transform:rotate(-3deg)}
.sign{position:absolute;left:50%;top:330px;transform:translateX(-50%) rotate(-2deg);width:760px;background:#fffbe0;border-radius:14px;padding:44px 40px;box-sizing:border-box;box-shadow:0 20px 50px rgba(0,0,0,.35);text-align:center;color:#2b2b3a}
.sign .a{font-size:52px;font-weight:800}
.sign .b{margin-top:16px;font-size:84px;font-weight:900;color:#e2332d}
.sign:before{content:'';position:absolute;left:50%;top:-24px;width:150px;height:46px;margin-left:-75px;background:rgba(255,220,120,.85);transform:rotate(3deg)}
.timer{position:absolute;left:50%;top:150px;transform:translateX(-50%);background:#2b2b3a;color:#fff;font-weight:900;font-size:58px;padding:10px 40px;border-radius:999px;white-space:nowrap}
.timer b{color:#ffd84d;font-variant-numeric:tabular-nums}
.stage{position:absolute;left:50%;top:260px;transform:translateX(-50%);background:#fff;color:#e0408f;font-weight:900;font-size:58px;padding:8px 36px;border-radius:999px;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.2)}
.flash{position:absolute;inset:0;pointer-events:none}
.kp{position:absolute;left:130px;top:150px;width:820px;height:1070px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.kp .screen{position:relative;width:100%;height:100%;border-radius:60px;background:#b2c7da;overflow:hidden}
.kp .head{height:120px;display:flex;align-items:center;gap:14px;padding:0 40px;font-size:46px;font-weight:900;color:#222;background:rgba(255,255,255,.4)}
.kp .head small{font-size:34px;color:#666;font-weight:800}
.kp .head .unread{margin-left:auto;background:#ff4d4d;color:#fff;border-radius:999px;padding:4px 20px;font-size:38px}
.kp .msgs{position:absolute;left:0;right:0;top:120px;bottom:110px;overflow:hidden}
.kp .inner{position:absolute;left:0;right:0;bottom:0;padding:20px 30px;display:flex;flex-direction:column;gap:14px}
.kp .row{display:flex;align-items:flex-start;gap:12px}
.kp .av{width:72px;height:72px;border-radius:26px;flex:none;background:#9cbb8c;position:relative}
.kp .av:after{content:'';position:absolute;left:18px;top:24px;width:12px;height:10px;background:#f4f6e6;box-shadow:24px 0 0 #f4f6e6}
.kp .who{font-size:30px;color:#445;margin:0 0 6px 4px;font-weight:700}
.kp .b{display:inline-block;font-size:46px;line-height:1.3;padding:14px 24px;border-radius:26px;background:#fff;color:#222;font-weight:700}
.kp .ph{width:330px;height:220px;border-radius:24px;background:linear-gradient(#ffd1e6,#fff0a8);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#7a1f52}
.kp .rc{display:inline-block;margin:8px 0 0 6px;background:#fff;border-radius:999px;padding:4px 18px;font-size:32px;font-weight:900;color:#e2557a;box-shadow:0 2px 6px rgba(0,0,0,.1)}
.kp .inp{position:absolute;left:0;right:0;bottom:0;height:110px;background:#fff;display:flex;align-items:center;padding:0 30px;box-sizing:border-box}
.kp .inp .box{flex:1;height:72px;border-radius:36px;background:#f1f1f4;font-size:40px;line-height:72px;padding-left:28px;color:#999;font-weight:700}
`;document.head.appendChild(st)}
function titleEls(){ui.insertAdjacentHTML('beforeend',`<div class="tag">ENFP × 좀비편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ENFP인데</div><div class="title3 out">좀비 사태가 터진다면?</div>`);
  const E=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return (t,TA)=>{const T0=0.05,out=clamp01((t-TA+0.25)/0.25),os=1-out;const [tag,t1,t2,t3]=E;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.7)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.7)/0.1)*os}}

// ===== 0. 좀비 떼(타이틀) → '각자 숨으십시오' → 재난문자에 답장 폭주 → 회신 불가 → 302호로 줄 서기 → 거실 30명 =====
S[0]=()=>{
  const E=EV(0);const r=rng(501);
  const {sA,upd}=cityHorde(r);
  // B: 밤 아파트 — 답장할 때마다 창문에 폰 불빛
  const sB=new THREE.Scene();nightLights(sB,{hemi:1.0});ground(sB,0x2e3040,100);
  const fac=new THREE.Mesh(new THREE.BoxGeometry(11,16,1),lamb(0x4a4868));fac.position.set(0,8,-1);sB.add(fac);
  const wins=[];const r2=rng(9);for(let c=0;c<7;c++)for(let row=0;row<10;row++){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.85),basic(0x23263a));m.position.set((c-3)*1.45,1.3+row*1.45,-0.48);sB.add(m);wins.push({m,d:r2()})}
  // C: 302호 앞 복도 줄
  const sC=new THREE.Scene();warmLights(sC);sC.children[0].intensity=1.3;
  const hf=new THREE.Mesh(new THREE.PlaneGeometry(10,40),lamb(0xb8aab0));hf.rotation.x=-Math.PI/2;sC.add(hf);
  const hw=new THREE.Mesh(new THREE.PlaneGeometry(40,5),lamb(0xe8dce4));hw.rotation.y=Math.PI/2;hw.position.set(-1.6,2.5,-8);sC.add(hw);
  const hw2=new THREE.Mesh(new THREE.PlaneGeometry(40,5),lamb(0xddd0d8));hw2.rotation.y=-Math.PI/2;hw2.position.set(1.6,2.5,-8);sC.add(hw2);
  const d302=door3(sC,-1.55,-6,Math.PI/2);d302.userData.d.rotation.y=1.4;
  const pl=canvasTex(256,110,(c,w,h)=>{c.fillStyle='#fff';rr(c,4,4,w-8,h-8,16);c.fill();c.fillStyle='#e0408f';c.font=`900 80px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText('302',w/2,h/2+4)});
  const plate=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.24),new THREE.MeshBasicMaterial({map:pl}));plate.position.set(-1.52,2.35,-6);plate.rotation.y=Math.PI/2;sC.add(plate);
  for(const z of[-1,-11]){const dd=door3(sC,-1.55,z,Math.PI/2)}
  const q=[];for(let i=0;i<12;i++){const p=enfp(r,{cape:pick(r,BLK)});p.position.set(0.1+(i%2)*0.35,0,-5.2+i*1.0);p.rotation.y=Math.PI;sC.add(p);
    const it=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.3,0.2),lamb(i%3==0?0xffffff:pick(r,[0xffd84d,0xff8f8f,0x8fd3ff])));it.position.set(0,0.5,0.3);p.userData.hip.add(it);q.push({p,z0:p.position.z,ph:r()*6})}
  const qb=[bubE(q[2].p,'과자 가져왔어요!!',{size:0.0022}),bubE(q[5].p,'저 잠옷인데 괜찮죠?',{size:0.0022})];
  // D: 거실 30명
  const sD=new THREE.Scene();warmLights(sD);room(sD);
  const crowd=[];for(let i=0;i<30;i++){const row=Math.floor(i/6),col=i%6;const p=enfp(r,{cape:pick(r,BLK)});p.position.set((col-2.5)*0.95+(row%2)*0.35+(r()-0.5)*0.15,0,-2.0+row*0.85);sitPose(p);p.position.y=-0.42;p.rotation.y=(r()-0.5)*0.4;sD.add(p);crowd.push({p,ph:r()*6})}
  garland(sD,-3,3,3.4,-3.1,12);
  const C=cam(50);const tUpd=titleEls();
  const al=div('alertb','<div class="h"><i>긴급재난문자</i> 지금</div><div class="m">[행정안전부] 전국 좀비 사태 발생. 생존자는 <b style="color:#e2332d">각자</b> 조용히 숨으십시오.</div>');
  const RP=[['301호','헐 무서워요ㅠㅠ 다들 괜찮으세요?'],['302호','저 302호인데 같이 숨으실 분!'],['504호','저요!!'],['1203호','저도요!! 과자 가져갈게요'],['807호','잠옷 입고 가도 돼요?'],['205호','몇 시까지 가면 돼요?'],['1102호','헐 저 혼자 있었는데ㅠㅠ'],['403호','베개 챙겨요?'],['907호','저 보드게임 있어요!!'],['601호','ㅋㅋㅋ 다들 302호로!!'],['1001호','저도 가요!!!'],['303호','옆집이에요 지금 갈게요'],['708호','헐 저도 혼자예요ㅠㅠ'],['1504호','라면 챙겨 갈게요!!'],['202호','302호 몇 층이에요?'],['906호','ㄱㄱㄱㄱ'],['1302호','저 담요 3개 있어요'],['401호','나도나도!!'],['1110호','엘베 타고 가도 돼요?'],['804호','친구도 데려가도 돼요?'],['505호','지금 출발!!'],['1205호','헐 다 모이네ㅋㅋㅋ'],['306호','과자 뭐 좋아하세요?'],['1404호','저도 갈래요!!!'],['703호','우와 파티다'],['1001호','가는 중~'],['209호','302호 문 열어 주세요!!'],['1506호','ㅋㅋㅋㅋㅋ'],['610호','저도요!!'],['1108호','잠깐만요 머리 말리고 갈게요'],['402호','저 기타 가져가요'],['807호','이불 챙겼어요!!']];
  const rows=RP.map(([w,m],i)=>`<div class="row"><div class="av" style="background:${['#ffb3d4','#ffd98a','#a8dcff','#c9b4ff','#a8ecc4'][i%5]}"></div><div><div class="who">${w}</div><div class="b">${m}</div></div></div>`).join('');
  const kp=div('kp',`<div class="screen"><div class="head">긴급재난문자 <small>#행정안전부</small></div><div class="msgs"><div class="inner"><div class="row" style="justify-content:center"><div class="b" style="background:#eef0f4;font-size:38px;max-width:640px">[행정안전부] 생존자는 각자 조용히 숨으십시오.</div></div>${rows}<div class="row nr" style="justify-content:center"><div class="b" style="background:rgba(0,0,0,.45);color:#fff;font-size:38px">회신이 불가능한 번호입니다</div></div></div></div><div class="inp"><div class="box">메시지 입력</div></div></div>`);
  kp.querySelectorAll('.kp .av').forEach(a=>a.classList.add('h'));
  {const st=document.createElement('style');st.textContent='.kp .av.h:after{display:none}';kp.appendChild(st)}
  const rws=[...kp.querySelectorAll('.inner .row')];const inner=kp.querySelector('.inner');
  const ch=chip('답장 0개',95);ch.style.background='#2b2b3a';ch.style.color='#ffd84d';
  const st=div('stat','<div><small>각자 숨은 사람</small><b>0명</b></div><div><small>302호에 숨은 사람</small><b>30명</b></div>');
  return t=>{
    const TA=E.alert,TS=E.sms,TF=E.flood,TN=E.noreply,TH=E.hall,TR=E.room;let sc;
    if(t<TS){sc=sA;upd(t);C.fov=50;C.updateProjectionMatrix();const k=t/TS;C.position.set(0.3,1.9,6.2-k*0.6);C.lookAt(0,1.2,-6)}
    else if(t<TH){sc=sB;const k=clamp01((t-TS)/(TN-TS));wins.forEach(w=>w.m.material.color.setHex(k>w.d*0.9?0xbfe3ff:0x23263a));C.fov=52;C.updateProjectionMatrix();C.position.set(0,8,17-k);C.lookAt(0,8,-1)}
    else if(t<TR){sc=sC;const k=(t-TH);q.forEach((o,i)=>{standPose(o.p);walkPose(o.p,t*6+o.ph,0.4);o.p.position.z=o.z0-k*0.9});C.fov=52;C.updateProjectionMatrix();C.position.set(1.0,2.5,-8.6+k*0.2);C.lookAt(0,1.2,-1.5);
      qb.forEach((b,i)=>show(b,t,TH+0.2+i*0.5,TR))}
    else{sc=sD;const k=ease((t-TR)/3);crowd.forEach(o=>{standPose(o.p);sitPose(o.p);o.p.position.y=-0.42;o.p.userData.hip.position.y=0.56+Math.abs(Math.sin(t*4+o.ph))*0.03;o.p.userData.head.rotation.z=Math.sin(t*2+o.ph)*0.1});
      C.fov=50;C.updateProjectionMatrix();C.position.set(0,3.4-k*0.4,6.5-k*1.2);C.lookAt(0,0.9,-1.2)}
    renderer.setClearColor(0x000000,0);
    if(sc===sA||sc===sB)setSky('#141a3a','#3a3f72 80%');else setSky('#f6e8f0','#e8d4e0');
    renderer.render(sc,C);
    tUpd(t,TA);
    sh(al,t>=TA&&t<TS);if(t>=TA){const k=ease((t-TA)/0.25);al.style.transform=`translateY(${(1-k)*-300}px) translateX(${Math.sin(t*60)*(t<TA+0.6?6:0)}px)`}
    // 답장 폭주
    sh(kp,t>=TS&&t<TH);
    if(t>=TS&&t<TH){const k=ease((t-TS)/0.3);kp.style.transform=`translateY(${(1-k)*1100}px)`;
      const R1=at(0,'r1'),R2=at(0,'r2');
      const RT=E.rows;rws.forEach((rw,i)=>{let t0;if(i==rws.length-1)t0=TN;else t0=i<RT.length?RT[i]:999;rw.style.display=t>=t0?'':'none';if(t>=t0){const kk=pop((t-t0)/0.22);rw.style.transform=`scale(${kk})`;rw.style.transformOrigin=i==rws.length-1?'center':'left bottom'}})}
    if(t>=TS&&t<TH){const kk=clamp01((t-TF)/(TN-TF));const shown=E.rows.filter(x=>t>=x).length-1;const n=t<TF?Math.max(0,shown):Math.round(Math.max(shown,2+Math.pow(kk,2.2)*299998));const s2=`답장 ${fmt(n)}개`;if(ch.textContent!=s2)ch.textContent=s2;chipPop(ch,t,TS+0.2);ch.style.opacity=1}else ch.style.opacity=0;
    popEl(st,t,TR+0.4,'translateX(-50%)');st.style.opacity=t>TR+0.4?1:0;
    caption(0,t)};
  function R2c(){return at(0,'r2')+0.3}
};

// ===== 1. 1일 차 생존 회의: 아이디어 폭발 → '…근데 식량은?' → '그건 내일 하자~' → 똑똑 '새 손님 왔나 봐!!' =====
S[1]=()=>{
  const E=EV(1);const r=rng(511);
  const sc=new THREE.Scene();warmLights(sc);room(sc);
  door3(sc,0,-3.12);
  [[-0.9,0.4,0],[0,0.4,0.1],[0.9,0.4,0],[-0.45,1.05,0.05],[0.45,1.05,0.05],[0,1.65,0.05]].forEach(([x,y,z],i)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.62,0.6),lamb(i%2?0xc9a070:0xd8b080));b.position.set(x,y,-2.5+z);sc.add(b)});
  const sofa=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.7,0.8),lamb(0xff9fc8));sofa.position.set(0,0.35,-1.9);sc.add(sofa);
  const G=garland(sc,-1.4,1.4,2.3,-2.15,9);
  banner(sc,'좀비 잡는 귀요미들 ♥',0,3.4,-3.15,4.4,0.85);
  const ppl=[];[-1.6,-0.55,0.55,1.6].forEach((x,i)=>{const p=tee(enfp(r,{}));p.position.set(x,0,-0.4+Math.abs(x)*0.2);p.rotation.y=-x*0.12;sc.add(p);ppl.push(p)});
  const sit=[];[[-2.3,-1.3],[-1.2,-1.5],[1.2,-1.5],[2.3,-1.3],[-2.6,0.3],[2.7,0.4]].forEach(([x,z],i)=>{const p=tee(enfp(r,{}));p.position.set(x,0,z);sitPose(p);p.position.y=-0.42;p.rotation.y=-x*0.25;sc.add(p);sit.push(p)});
  // 식량 묻는 사람: 오른쪽 앞 구석 바닥, 빈 과자 봉지
  const F=tee(enfp(r,{}));F.position.set(2.3,0,1.6);sitPose(F);F.position.y=-0.42;F.rotation.y=-0.7;sc.add(F);
  
  // 좀비 키링
  const key=new THREE.Group();const kh=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),smooth(0xa6c494));kh.position.y=-0.16;key.add(kh);
  for(const s2 of[-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(0.018,0.018,0.01),basic(0xf4f6e6));e.position.set(s2*0.025,-0.15,0.068);key.add(e)}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.03,0.006,6,12),lamb(0xdddddd));ring.position.y=-0.06;key.add(ring);
  const str=new THREE.Mesh(new THREE.BoxGeometry(0.006,0.06,0.006),lamb(0xdddddd));str.position.y=-0.03;key.add(str);
  key.position.set(0,-0.68,0.02);ppl[1].userData.arms[1].add(key);
  const A=ppl[1],B=ppl[2];
  const BB={e2:[A,'우리 진짜 완벽하게 살아남자!!'],i1:[A,'우리 생존 브이로그 찍자!!'],i2:[B,'좀비랑 친해지는 법도 연구하자!'],i3:[A,'생존 굿즈 만들자! 좀비 키링!!'],i4:[B,'헐 이거 나중에 책으로 내자!!'],i5:[B,'새 생존자 오면 환영 파티 하자!!'],nw:[A,'어? 새 손님 왔나 봐!!']};
  const bubs={};for(const [k,[p,txt]] of Object.entries(BB)){const b=bubE(p,txt,{size:0.0027,y:2.3});b.position.x=p===A?0.45:-0.35;bubs[k]=b}
  
  const knk=topB(textSprite('똑똑',100,'#ff4d9a',0.0045));knk.position.set(3.0,2.3,-1.0);sc.add(knk);
  const C=cam(50);
  const ch=chip('1일 차 · 생존 회의');
  const cards=div('ideas','');{const st=document.createElement('style');st.textContent=`.ideas{position:absolute;left:60px;right:60px;top:330px;display:flex;flex-wrap:wrap;gap:16px;justify-content:center}.ideas .cd{background:#fff;border-radius:22px;padding:12px 26px;font-size:46px;font-weight:900;color:#e0408f;box-shadow:0 8px 20px rgba(0,0,0,.18);white-space:nowrap}.ideas .cd.food{background:#2b2b3a;color:#ffd84d}`;cards.appendChild(st)}
  const CT=['▶ 생존 브이로그 채널','좀비랑 친해지기 연구','좀비 키링 굿즈','생존 일지 출판','새 손님 환영 파티 ★'];
  const cds=CT.map(c=>div('cd',c,cards));
  const cnt=chip('아이디어 0개',230);cnt.style.background='#ff8fc8';cnt.style.color='#4a0f2e';
  return t=>{
    const I=['i1','i2','i3','i4','i5'].map(k=>at(1,k)),TG=at(1,'G3'),TK=E.knock,TN=at(1,'nw');
    const all=[...ppl,...sit];
    ppl.forEach((p,i)=>{standPose(p);const j=Math.abs(Math.sin(t*6+i));p.position.y=0;mouth(p,false);
      if(t<E.meet){p.position.y=j*0.12;armUp(p,i%2,0.9)}
      p.rotation.y=-p.position.x*0.12});
    sit.forEach(p=>{standPose(p);sitPose(p);p.position.y=-0.42});
    // 말하는 사람: 손 번쩍
    [['i1',A],['i2',B],['i3',A],['i4',B],['i5',B]].forEach(([k,p])=>{if(t>=at(1,k)&&t<endOf(1,k,0.2)){armUp(p,1,1);mouth(p,true);p.position.y=Math.abs(Math.sin(t*8))*0.08}});
    key.visible=t>=at(1,'i3')-0.1;
    if(t>=TG&&t<endOf(1,'G3',0.4)){all.forEach((p,i)=>{if(sit.includes(p)){standPose(p);p.position.y=0}armUp(p,0,1);armUp(p,1,1);mouth(p,true);p.position.y=Math.abs(Math.sin(t*9+i))*0.15})}
    // 식량 질문 → 정적 → 다 같이 돌아봄
    standPose(F);sitPose(F);F.position.y=-0.42;
    all.forEach(p=>{p.userData.head.rotation.y=0});
    // 노크 → 문 쪽(오른쪽) 돌아봄, A가 달려감
    const kk=t>TK&&t<TK+0.6?pop((t-TK)/0.2):0;knk.visible=kk>0.01;knk.scale.set(knk.userData.base[0]*kk,knk.userData.base[1]*kk,1);
    if(t>=TK+0.2){all.forEach(p=>{p.userData.head.rotation.y=0.8;setFace(p,true)});if(t>=endOf(1,'nw',-0.2)){const k=clamp01((t-endOf(1,'nw',-0.2))/1.2);A.rotation.y=Math.PI/2;A.position.x=-0.55+k*3.4;walkPose(A,t*8,0.6);armUp(A,1,0.9)}}
    G.userData.bulbs.forEach((b,i)=>b.visible=Math.floor(t*4+i)%3!==0);
    for(const k in bubs){const k2=k;show(bubs[k],t,at(1,k2),endOf(1,k2,0.35))}
    
    // 카메라
    {C.fov=54;C.updateProjectionMatrix();C.position.set(0.2,2.3,6.4-Math.min(t,10)*0.05);C.lookAt(0,1.6,-2)}
    renderer.setClearColor(0x000000,0);setSky('#f6e8f0','#e8d4e0');renderer.render(sc,C);
    chipPop(ch,t,E.meet);ch.style.opacity=t>E.meet&&t<I[0]?1:0;ch.style.top='230px';
    const n=t<endOf(1,'i5')?I.filter(x=>t>=x).length:Math.min(47,Math.round(5+(t-endOf(1,'i5'))*60));
    if(cnt.dataset.n!=n){cnt.dataset.n=n;cnt.textContent=`아이디어 ${n}개`}
    if(t>=I[0])chipPop(cnt,t,I[0]);cnt.style.opacity=t>=I[0]&&t<TK?1:0;
        cds.forEach((c,i)=>{const on=t>=I[i]&&t<TK;c.style.display=on?'':'none';if(on)c.style.transform=`scale(${pop((t-I[i])/0.25)})`});
        caption(1,t)};
};

// ===== 2. 새 생존자 환영식: 31번째 박수 → 32번째 현수막·폭죽 → 33번째 손님은 좀비 =====
S[2]=()=>{
  const E=EV(2);const r=rng(521);
  const sc=new THREE.Scene();warmLights(sc);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(16,16),lamb(0xc9a888));fl.rotation.x=-Math.PI/2;sc.add(fl);
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(16,6),lamb(0xf0d9e4));bw.position.set(0,3,-3.2);sc.add(bw);
  const lw=new THREE.Mesh(new THREE.PlaneGeometry(16,6),lamb(0xe6cad8));lw.rotation.y=Math.PI/2;lw.position.set(-4.4,3,0);sc.add(lw);
  const WM=lamb(0xe6cad8);// 오른쪽 벽(문 구멍)
  const wa=new THREE.Mesh(new THREE.BoxGeometry(0.1,6,7.6),WM);wa.position.set(4.45,3,-0.4-3.8);sc.add(wa);
  const wb2=new THREE.Mesh(new THREE.BoxGeometry(0.1,6,7.6),WM);wb2.position.set(4.45,3,0.8+3.8);sc.add(wb2);
  const wc=new THREE.Mesh(new THREE.BoxGeometry(0.1,3.7,1.2),WM);wc.position.set(4.45,2.3+1.85,0.2);sc.add(wc);
  garland(sc,-3,3,3.4,-3.1,12);banner(sc,'좀비 잡는 귀요미들 ♥',-1.2,2.5,-3.15,3.6,0.7);
  const dr=door3(sc,4.4,0.2,-Math.PI/2);const D=dr.userData.d;dr.children[0].visible=false;
  [[0,2.33,0,1.4,0.16],[-0.65,1.15,0,0.1,2.3],[0.65,1.15,0,0.1,2.3]].forEach(([x,y,z,w,h])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.16),lamb(0xf2f2f2));m.position.set(x,y,z);dr.add(m)});
  // 문밖 복도 + 좀비 떼
  const cf=new THREE.Mesh(new THREE.PlaneGeometry(10,20),lamb(0x6a6470));cf.rotation.x=-Math.PI/2;cf.position.set(9.5,0.005,0);sc.add(cf);
  const cw=new THREE.Mesh(new THREE.PlaneGeometry(20,6),lamb(0x5a5468));cw.rotation.y=-Math.PI/2;cw.position.set(8.2,3,0);sc.add(cw);
  const hl=new THREE.PointLight(0x9ab0ff,4,8,1.5);hl.position.set(6.2,2.6,0.2);sc.add(hl);
  const Z33=zombie(r,{shirt:0x8a94a6});Z33.position.set(5.0,0,0.2);Z33.rotation.y=-Math.PI/2;sc.add(Z33);
  const ZH=[];for(let i=0;i<14;i++){const z=zombie(r);z.position.set(5.6+(i%4)*0.55+r()*0.2,0,-1.6+Math.floor(i/4)*0.9+(i%2)*0.3+r()*0.2);z.rotation.y=-Math.PI/2+(r()-0.5)*0.4;sc.add(z);ZH.push(z)}
  // 30명 + 손님
  const crowd=[];for(let i=0;i<30;i++){const row=Math.floor(i/6),col=i%6;const p=enfp(r,{cape:pick(r,BLK)});const x=-2.4+row*0.75+(r()-0.5)*0.15,z=-2.4+col*0.85+(row%2)*0.3;p.position.set(x,0,z);sc.add(p);
    const hat=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.42,12),smooth(pick(r,[0xff8fc8,0xffd84d,0x8fd3ff,0x9df2c8,0xc9a8ff])));hat.position.set(0,0.66,0);hat.rotation.z=(r()-0.5)*0.3;p.userData.head.add(hat);hat.visible=false;
    crowd.push({p,x0:x,z0:z,hat,ph:r()*6,gx:1.3+(i%5)*0.5+r()*0.15,gz:0.2+(i%2?1:-1)*(0.85+Math.floor(i/10)*0.5+((i>>1)%5)*0.04)})}
  const G31=enfp(r,{cape:0xfff0a8}),G32=enfp(r,{cape:0xbfe6ff});sc.add(G31,G32);
  [G31,G32].forEach(g=>{const it=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.3,0.2),lamb(0xffffff));it.position.set(0,0.5,0.3);g.userData.hip.add(it)});
  const nearTo=(x,z)=>crowd.map((q,i)=>[Math.hypot(q.x0-x,q.z0-z),i]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);const nA=nearTo(0.6,0.6),nB=nearTo(0.6,-1.2);
  const bW=bubE(crowd[nA[0]].p,'새 생존자다!!',{size:0.0032,y:2.2});
  const bG=[[0.9,2.35,0.9],[1.7,2.65,-0.5]].map(([x,y,z])=>{const b=bubE(crowd[0].p,'어서 오세요!!',{size:0.003,y:0});crowd[0].p.remove(b);b.position.set(x,y,z);sc.add(b);return b});
  const bO=bubE(crowd[nA[1]].p,'오늘 손님 많다!!',{size:0.0032,y:2.25});
  const bZ=bubZ(Z33,'으어…!',{size:0.0034,y:2.2});
  const ban32=banner(sc,'환영해요 32번째 생존자님 ♥',3.5,3.1,-1.2,2.6,0.5,-0.6);ban32.visible=false;const b32=div('stage','환영해요 32번째 생존자님 ♥');b32.style.top='380px';b32.style.fontSize='66px';b32.style.border='8px solid #ff8fc8';b32.style.padding='10px 40px';b32.style.display='none';
  // 꽃가루
  const conf=[];for(let i=0;i<90;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.07,0.11),new THREE.MeshBasicMaterial({color:pick(r,[0xff8fc8,0xffd84d,0x8fd3ff,0x9df2c8,0xc9a8ff,0xff8f8f]),side:THREE.DoubleSide}));sc.add(m);conf.push({m,x:2.6+(r()-0.5)*2.4,z:0.2+(r()-0.5)*3,y0:3.4+r()*0.8,sp:0.9+r()*0.7,rx:r()*6,ry:r()*6,d:r()*0.4})}
  const knock=topB(textSprite('똑똑',100,'#ff4d9a',0.0045));knock.position.set(3.7,2.1,0.2);sc.add(knock);
  const kung=topB(textSprite('쿵…',120,'#ffffff',0.005));kung.position.set(3.7,2.0,0.2);sc.add(kung);
  const ppop=topB(textSprite('뿅',90,'#ffd84d',0.004));sc.add(ppop);
  const C=cam(50);const vig=div('vig');
  const c1=chip('31번째 생존자 · 환영식: 박수');const c2=chip('32번째 생존자 · 환영식: 현수막 + 폭죽');c2.style.fontSize='50px';
  const c3=div('judge','33번째 손님: 좀비');c3.style.background='#2b2b3a';c3.style.color='#9df27a';
  return t=>{
    const K1=E.k1,O1=E.open1,K2=E.k2,O2=E.open2,K3=E.k3,GA=E.gather,O3=E.open3,PP=E.pop,HO=E.horde;
    // 문
    const op=t<O1?0:t<O1+2.6?ease((t-O1)/0.35)*(1-ease((t-O1-2.2)/0.35)):t<O2?0:t<O2+2.4?ease((t-O2)/0.35)*(1-ease((t-O2-2.0)/0.35)):t<O3?0:ease((t-O3)/0.4);
    D.rotation.y=-1.7*op;
    // 노크 표시
    {const kk=t>K1&&t<K1+0.6?pop((t-K1)/0.2):t>K2&&t<K2+0.6?pop((t-K2)/0.2):0;knock.visible=kk>0.01;knock.scale.set(knock.userData.base[0]*kk,knock.userData.base[1]*kk,1);
     const ku=(t>K3&&t<K3+0.5)||(t>K3+0.6&&t<K3+1.1)?1:0;kung.visible=!!ku}
    // 손님
    const guest=(g,t0,t1)=>{const k=clamp01((t-t0-0.2)/1.4);g.visible=t>t0&&t<t1;g.position.set(5.3-k*2.4,0,0.2+k*0.3);g.rotation.y=-Math.PI/2;standPose(g);if(k<1)walkPose(g,t*6,0.4);else{armUp(g,1,0.8)}};
    guest(G31,O1,K2);guest(G32,O2,K3);
    // 좀비
    Z33.visible=t>=O3-0.2;zPose(Z33,t,0);ZH.forEach(z=>{z.visible=t>=O3;zPose(z,t,0.3)});
    if(t>HO)Z33.position.x=5.0-ease((t-HO)/2)*0.6;
    // 군중
    crowd.forEach((q,i)=>{const p=q.p;standPose(p);mouth(p,false);
      const g=ease((t-GA-q.ph*0.04)/0.9);p.position.set(q.x0+(q.gx-q.x0)*g,0,q.z0+(q.gz-q.z0)*g);p.rotation.y=0.45+(Math.PI/2-0.45)*g;
      if(g>0&&g<1)walkPose(p,t*7+q.ph,0.4);
      q.hat.visible=t>GA+0.3;
      const clap=(t>at(2,'G1')&&t<endOf(2,'G1',0.4))||(t>at(2,'G1b')&&t<endOf(2,'G1b',0.6));
      if(clap){const u=p.userData,s=Math.sin(t*22+q.ph);u.arms[0].rotation.x=-1.35;u.arms[1].rotation.x=-1.35;u.arms[0].rotation.z=-0.25-0.2*s;u.arms[1].rotation.z=0.25+0.2*s;mouth(p,true)}
      if(t>at(2,'G1b')-0.1&&t<endOf(2,'G1b',0.3)&&i%3==0){armUp(p,0,1);armUp(p,1,1)}
      if(t>=at(2,'G2')&&t<O3+0.3){armUp(p,1,1);mouth(p,true)}
      if(t>=O3+0.3){const fz=ease((t-O3-0.3)/0.3);p.userData.arms.forEach(a=>{a.rotation.x=-0.3*fz;a.rotation.z=0});p.userData.smile.visible=false;p.userData.flat.visible=false;p.userData.om.visible=true;p.userData.om.scale.set(0.7,0.9,1)}
      if(t>=HO+0.4){const s=Math.sin(t*40+q.ph);p.userData.hip.position.x=s*0.015}});
    sh(b32,t>=O2+0.1&&t<endOf(2,'G1b',0.6));if(t>=O2+0.1)popEl(b32,t,O2+0.1,'translateX(-50%) rotate(-3deg)');
    conf.forEach(c=>{const lt=t-O2-0.1-c.d;c.m.visible=lt>0&&lt<3.2;if(lt>0){c.m.position.set(c.x+Math.sin(lt*3+c.rx)*0.2,c.y0-lt*c.sp,c.z);c.m.rotation.set(c.rx+lt*5,c.ry+lt*4,0)}});
    {const lt=t-PP;ppop.visible=lt>0&&lt<0.6;ppop.position.set(3.4,2.4+lt*0.4,0.3);const kk=pop(lt/0.2);ppop.scale.set(ppop.userData.base[0]*kk,ppop.userData.base[1]*kk,1)}
    bG.forEach((b,i)=>{show(b,t,at(2,'G1')+i*0.05,endOf(2,'G1',0.3));if(t>=at(2,'G1b'))show(b,t,at(2,'G1b')+i*0.05,endOf(2,'G1b',0.3));if(t>=at(2,'G2'))show(b,t,at(2,'G2')+i*0.05,O3+0.4)});
    show(bO,t,at(2,'g3'),endOf(2,'g3',0.5));show(bZ,t,at(2,'z1'),endOf(2,'z1',1.0));
    // 카메라
    if(t<GA){C.fov=54;C.updateProjectionMatrix();C.position.set(-2.6,3.1,5.8);C.lookAt(2.4,1.1,-0.3)}
    else if(t<HO){const k=ease((t-GA)/1.2);C.fov=54-k*4;C.updateProjectionMatrix();C.position.set(-2.6-k*0.2,3.1+k*0.4,5.8-k*5.6);C.lookAt(2.4+k*2.2,1.1+k*0.2,-0.3+k*0.5)}
    else{const k=ease((t-HO)/2.5);C.fov=50-k*6;C.updateProjectionMatrix();C.position.set(-2.8+k*2.0,3.5-k*1.1,0.2);C.lookAt(4.6+k*1.5,1.3,0.2)}
    const bp=beatPulse(2,t);vig.style.opacity=t>HO?0.3+0.5*bp:0;
    renderer.setClearColor(0x000000,0);setSky('#f6e8f0','#e8d4e0');renderer.render(sc,C);
    chipPop(c1,t,O1+0.6);c1.style.opacity=t>O1+0.6&&t<K2?1:0;chipPop(c2,t,O2+0.5);c2.style.opacity=t>O2+0.5&&t<K3?1:0;
    popEl(c3,t,HO+0.2,'translateX(-50%)');c3.style.opacity=t>HO+0.2?1:0;
    caption(2,t)};
};

// ===== 3. 비명 → 팔 벌리고 달리는 ENFP와 좀비, 탑뷰 구분 불가 → 킁킁 '…으어?' '…꺄아?' =====
S[3]=()=>{
  const E=EV(3);const r=rng(531);
  const sc=new THREE.Scene();sc.fog=new THREE.Fog(0x1e2340,20,70);nightLights(sc,{hemi:1.15});makeStreet(sc,r,{ground:0x3a4048});
  const lamps=[];for(let z=6;z>-60;z-=12){lamps.push(lamp(sc,-3.2,z));lamps.push(lamp(sc,3.2,z-6))}
  const mix=[];for(let i=0;i<34;i++){const isZ=i%2==1;const p=isZ?zombie(r):enfp(r,{});p.position.set((r()-0.5)*5.2,0,i*0.5+r()*0.4);sc.add(p);mix.push({p,isZ,z0:p.position.z-1.5,ph:r()*6,sp:4.35+r()*0.1})}
  const Z1=zombie(r,{shirt:0x8a94a6}),E1=enfp(r,{shirt:0xff9fc8});sc.add(Z1,E1);
  const bZ=bubZ(Z1,'…으어?',{size:0.0021,y:2.25}),bE=bubE(E1,'…꺄아?',{size:0.0021,y:2.25});
  const sb=mix.filter(q=>!q.isZ&&Math.abs(q.p.position.x)<1.2).slice(0,5).map(q=>bubE(q.p,'꺄아아악!!',{size:0.0024,y:2.25,bg:'#ffffff',fg:'#e0408f'}));
  const C=cam(50);const ch=div('judge','좀비 · 생존자 구분 불가');
  return t=>{
    const TT=E.top,TS=E.sniff,base=-t*4.4;
    mix.forEach((q,i)=>{const p=q.p;q.p.position.z=q.z0+base*(q.sp/4.4)+(q.isZ?0:0);
      if(q.isZ){standPose(p);walkPose(p,t*11+q.ph,0.7);const u=p.userData;u.arms[0].rotation.x=-1.5;u.arms[1].rotation.x=-1.4;u.head.rotation.z=0.25}
      else{standPose(p);walkPose(p,t*11+q.ph,0.7);scream(p,1);p.userData.arms[0].rotation.x=-1.9;p.userData.arms[1].rotation.x=-1.9;mouth(p,true)}
      p.rotation.y=Math.PI});
    // 사이드 트래킹 짝
    const pz=base-1.0;Z1.position.set(0.55,0,pz);E1.position.set(-0.45,0,pz);Z1.visible=E1.visible=t>=TS;[Z1,E1].forEach(p=>{standPose(p);walkPose(p,t*11,0.7);p.rotation.y=Math.PI});
    {const u=Z1.userData;u.arms[0].rotation.x=-1.5;u.arms[1].rotation.x=-1.4;const sn=t>=TS&&t<at(3,'e6',0.9);u.head.rotation.y=sn?-0.9:0;u.hip.rotation.z=sn?0.15:0;u.head.rotation.z=sn?0.35*Math.sin(t*3):0.25}
    {const u=E1.userData;scream(E1,1);u.arms[0].rotation.x=-1.9;u.arms[1].rotation.x=-1.9;const tl=t>=at(3,'e6')-0.1&&t<at(3,'e6',1.0);u.head.rotation.y=tl?0.8:0;u.head.rotation.z=tl?-0.35:0;mouth(E1,!tl)}
    if(t<TT){const k=t/TT;C.fov=52;C.updateProjectionMatrix();C.up.set(0,1,0);C.position.set(0.3,2.0,base-7+k*0.8);C.lookAt(0,1.4,base+3)}
    else if(t<TS){const k=ease((t-TT)/0.5);C.fov=48;C.updateProjectionMatrix();C.up.set(0,0,-1);C.position.set(0,17-k*2,base+6);C.lookAt(0,0,base+5.99)}
    else{const k=ease((t-TS)/6);C.fov=40;C.updateProjectionMatrix();C.up.set(0,1,0);C.position.set(0.1,1.8,pz-4.2-k*1.5);C.lookAt(0.05,1.4,pz)}
    show(bZ,t,at(3,'z2'),at(3,'e6',1.1));show(bE,t,at(3,'e6'),at(3,'e6',1.2));
    sb.forEach((b,i)=>show(b,t,0.1+i*0.08,TT));
    renderer.setClearColor(0x000000,0);setSky('#141a3a','#3a3f72 80%');renderer.render(sc,C);
    popEl(ch,t,TT+0.3,'translateX(-50%)');ch.style.opacity=t>TT+0.3&&t<TS?1:0;
    caption(3,t)};
};

// ===== 4. 1년 후: 다 좀비가 됨 → 폰 속 단톡방 '으어ㅋㅋㅋ' 999+ =====
S[4]=()=>{
  const E=EV(4);const r=rng(541);
  const sc=new THREE.Scene();warmLights(sc);sc.children[0].intensity=1.2;room(sc,{wall:0xc9b4c4,wall2:0xb8a4b4,floor:0x9a8478});garland(sc,-3,3,3.4,-3.1,12);
  banner(sc,'좀비 잡는 귀요미들 ♥',0,2.5,-3.15,4.4,0.85);
  const Z=[];for(let i=0;i<14;i++){const row=Math.floor(i/5),col=i%5;const z=tee(zombie(r,{shirt:0xc98aa4}),'#c98aa4');z.position.set((col-2)*1.15+(row%2)*0.5,0,-1.8+row*1.1);sc.add(z);
    const ph=phoneMesh(0x9fd0ff);ph.userData.rec.visible=false;z.userData.hip.add(ph);ph.position.set(0,0.42,0.42);ph.rotation.set(0.75,0,0);
    Z.push({z,ph:r()*6})}
  const C=cam(50);const ch=chip('1년 후');const ch2=chip('생존자: 0명',345);ch2.style.background='#2b2b3a';ch2.style.color='#ffd84d';
  const NM=['민지','준호','하린','도윤','서아','지우','예준','수빈'];const MS=['으어ㅋㅋㅋ','으어ㅋㅋㅋㅋ','으어?? ㅋㅋ','ㅋㅋㅋ으어','으어 ♥','으어ㅋㅋㅋㅋㅋㅋ','으어어ㅋㅋ'];
  let html='';for(let i=0;i<40;i++){if(i==9){html+=`<div class="row"><div class="av"></div><div><div class="who">${NM[i%8]}</div><div class="ph">(단체 사진)</div><div><span class="rc">으어 ♥ 30</span></div></div></div>`;continue}
    html+=`<div class="row"><div class="av"></div><div><div class="who">${NM[(i*3)%8]}</div><div class="b">${MS[(i*5)%7]}</div></div></div>`}
  const kp=div('kp',`<div class="screen"><div class="head">좀비 잡는 귀요미들 <small>30</small><span class="unread">999+</span></div><div class="msgs"><div class="inner">${html}</div></div><div class="inp"><div class="box">으어…</div></div></div>`);
  const inner=kp.querySelector('.inner');const un=kp.querySelector('.unread');
  const dim=div('flash');const e1=div('end1 out','다음 좀비편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');
  return t=>{
    const TP=E.phone,TC=E.chat,TE=E.end,N0=at(4,'n6'),N1=at(4,'n6',1.79),N3=at(4,'n6',3.76);
    const showPhone=(t>=TC&&t<N1)||t>=N3;
    Z.forEach((q,i)=>{zPose(q.z,t,0);const u=q.z.userData;u.arms[1].rotation.x=-1.05;u.arms[1].rotation.z=-0.35;u.arms[0].rotation.x=-0.6;u.head.rotation.x=0.4;
      const lg=t>at(4,'z4')&&t<endOf(4,'z4');u.hip.position.y=0.8+(lg?Math.abs(Math.sin(t*14+q.ph))*0.04:0);u.head.rotation.z=0.2+(lg?Math.sin(t*12+q.ph)*0.12:0)});
    if(t<TC){const k=ease(t/TC);C.fov=50;C.updateProjectionMatrix();C.position.set(0,2.6,6.4-k*1.4);C.lookAt(0,1.2,-1.2)}
    else{const k=ease((t-N1)/3);C.fov=50;C.updateProjectionMatrix();C.position.set(0.4,2.9,6.8-k*0.8);C.lookAt(0,1.1,-1.2)}
    renderer.setClearColor(0x000000,0);setSky('#e8d6dc','#c9b4c4');renderer.render(sc,C);
    sh(kp,showPhone&&t<TE);if(showPhone){const k=ease((t-(t<N1?TC:N3))/0.3);kp.style.transform=`translateY(${(1-k)*1100}px)`;
      const sc2=Math.max(0,(t-TC)*260);inner.style.transform=`translateY(${Math.min(sc2,inner.scrollHeight-850)}px)`;inner.style.bottom='auto';inner.style.top=`${-(inner.scrollHeight-850)}px`;
      const n=Math.min(999,Math.round(120+(t-TC)*180));un.textContent=n>=999?'999+':`${n}`}
    chipPop(ch,t,0.1);ch.style.opacity=t<TC?1:0;chipPop(ch2,t,TP);ch2.style.opacity=(t>TP&&t<TC)||(t>N1&&t<N3)?1:0;
    dim.style.background=`rgba(10,10,25,${0.55*clamp01((t-TE)/0.3)})`;popEl(e1,t,TE);popEl(e2,t,TE+0.25);sh(e1,t>=TE);sh(e2,t>=TE);
    caption(4,t)};
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
