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
function banner(scene,text,x,y,z,w=4.2,h=0.8,ry=0){const T=canvasTex(1024,200,(c,W2,H2)=>{c.fillStyle='#ffffff';rr(c,6,6,W2-12,H2-12,40);c.fill();c.lineWidth=10;c.strokeStyle='#ff8fc8';rr(c,6,6,W2-12,H2-12,40);c.stroke();
  c.fillStyle='#e0408f';c.font=`900 96px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(text,W2/2,H2/2+6)});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:T,transparent:true}));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m);return m}
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

// ===== 0. 좀비 떼(타이틀) → 각자 숨으라는 재난문자 → 혼자 3시간 → 벽 똑똑 → 아파트 전체 똑똑 → 한 집에 30명 =====
S[0]=()=>{
  const E=EV(0);const r=rng(501);
  const {sA,upd}=cityHorde(r);
  // B: 혼자 숨은 방
  const sB=new THREE.Scene();warmLights(sB);sB.children[0].intensity=0.9;sB.children[1].intensity=0.35;
  room(sB,{wall:0x9a86a8,wall2:0x8a7698,floor:0x8a7468});bed(sB,0.3,-1.3);
  const moon=windowPlane(sB,1.6,2.5,-3.15,1.3,1.1,0x23305a);
  const H=enfp(r,{shirt:0xff9fc8,cape:0xffc2dc});H.position.set(0.3,0.42,-1.4);sitPose(H);sB.add(H);
  const tear=[];for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.SphereGeometry(0.025,10,8),basic(0x8fd3ff));d.scale.y=1.4;d.position.set(s*0.09,0.2,0.25);H.userData.head.add(d);tear.push(d)}
  const lampL=new THREE.PointLight(0xffd0a0,3,4,1.5);lampL.position.set(-1,1.6,-0.5);sB.add(lampL);
  const kn1=textSprite('똑똑',90,'#ffffff',0.004);kn1.position.set(-1.0,1.7,-1.4);sB.add(kn1);
  const bE=bubE(H,'…저기요. 살아 계세요?',{size:0.0016,y:1.8});bE.position.x=-0.35;
  // C: 아파트 단면(인형의 집)
  const sC=new THREE.Scene();warmLights(sC);
  const units=[];const UW=3.0,UH=2.6;
  for(let fl=0;fl<4;fl++)for(let c=0;c<3;c++){const x=(c-1)*UW,y=fl*UH;const col=pick(r,[0xf0d9e4,0xfff0c8,0xd9ecff,0xe4dcff,0xdff5e6]);
    const bw=new THREE.Mesh(new THREE.PlaneGeometry(UW,UH),lamb(col));bw.position.set(x,y+UH/2,-1);sC.add(bw);
    const fl2=new THREE.Mesh(new THREE.BoxGeometry(UW,0.14,2.2),lamb(0xb5a090));fl2.position.set(x,y,0.1);sC.add(fl2);
    const p=enfp(r,{cape:pick(r,BLK)});p.position.set(x+(r()-0.5)*0.6,y+0.07,0);sitPose(p);p.position.y=y+0.07-0.42;sC.add(p);
    const k=textSprite('똑똑',80,'#ff4d9a',0.0032);k.position.set(x+(c<2?UW/2-0.2:-UW/2+0.2),y+1.7,0);sC.add(k);
    units.push({p,k,c,fl,d:(fl*3+(fl%2?2-c:c))})}
  for(let fl=0;fl<=4;fl++){const s=new THREE.Mesh(new THREE.BoxGeometry(UW*3+0.3,0.2,2.4),lamb(0xe8e0d6));s.position.set(0,fl*UH-0.08,0.1);sC.add(s)}
  for(let c=0;c<=3;c++){const w=new THREE.Mesh(new THREE.BoxGeometry(0.18,UH*4,2.4),lamb(0xe8e0d6));w.position.set((c-1.5)*UW,UH*2,0.1);sC.add(w)}
  const roof=new THREE.Mesh(new THREE.ConeGeometry(6.6,2.2,4),lamb(0xc97a8a));roof.rotation.y=Math.PI/4;roof.scale.z=0.3;roof.position.set(0,UH*4+1.1,0);sC.add(roof);
  ground(sC,0x3a4050,100);
  const loud=units.find(u=>u.fl==1&&u.c==1);const bJ=bubE(loud.p,'헐 대박!! 다들 같이 숨어요!!',{size:0.0042,y:1.7});
  // D: 거실에 30명
  const sD=new THREE.Scene();warmLights(sD);room(sD);
  const crowd=[];for(let i=0;i<30;i++){const row=Math.floor(i/6),col=i%6;const p=enfp(r,{cape:pick(r,BLK)});p.position.set((col-2.5)*0.95+(row%2)*0.35+(r()-0.5)*0.15,0,-2.0+row*0.85);sitPose(p);p.position.y=-0.42;p.rotation.y=(r()-0.5)*0.4;sD.add(p);crowd.push({p,ph:r()*6})}
  garland(sD,-3,3,3.4,-3.1,12);
  const C=cam(50);const tUpd=titleEls();
  const al=div('alertb','<div class="h"><i>긴급재난문자</i> 지금</div><div class="m">[행정안전부] 전국 좀비 사태 발생. 생존자는 <b style="color:#e2332d">각자</b> 조용히 숨으십시오.</div>');
  const ch=chip('혼자 있은 시간: 0분');const st=div('stat','<div><small>각자 숨은 사람</small><b>0명</b></div><div><small>한 집에 숨은 사람</small><b>30명</b></div>');
  return t=>{
    const TA=E.alert,TH=E.hide,TL=E.lonely,TK=E.knock,TC=E.cascade,TG=E.gather;let sc;
    if(t<TH){sc=sA;upd(t);C.fov=50;C.updateProjectionMatrix();const k=t/TH;C.position.set(0.3,1.9,6.2-k*0.6);C.lookAt(0,1.2,-6)}
    else if(t<TC){sc=sB;const k=ease((t-TH)/(TC-TH));
      standPose(H);sitPose(H);shake(H,t,t<TK?1:0.3);
      const turn=ease((t-TK+0.4)/0.4);H.rotation.y=turn*0.9;
      if(t>=TK-0.2&&t<TK+0.6){const a=H.userData.arms[1];a.rotation.x=-1.6;a.rotation.z=-0.2;a.rotation.y=0;H.userData.arms[1].rotation.x=-1.6+Math.sin((t-TK)*25)*0.25}
      tear.forEach(d=>{d.visible=t>TL+1.0;d.position.y=0.2-((t*0.6)%0.12)});
      eyeOpen(H,1);
      kn1.visible=(t>TK&&t<TK+0.6);kn1.scale.set(kn1.userData.base[0]*pop((t-TK)/0.2),kn1.userData.base[1]*pop((t-TK)/0.2),1);
      C.fov=46;C.updateProjectionMatrix();C.position.set(1.3-k*0.3,2.0,2.9-k*0.5);C.lookAt(-0.1,1.5,-1.4);
      show(bE,t,at(0,'e1'),endOf(0,'e1',0.3))}
    else if(t<TG){sc=sC;const k=ease((t-TC)/(TG-TC));
      units.forEach(u=>{const t0=TC+u.d*0.17;const on=t>t0;standPose(u.p);sitPose(u.p);u.p.position.y=u.fl*UH+0.07-0.24;shake(u.p,t,on?0:1);
        u.p.rotation.y=on?(u.c<2?1.0:-1.0)*ease((t-t0)/0.25):0;
        if(on&&t<t0+0.5){u.p.userData.arms[1].rotation.x=-1.6+Math.sin((t-t0)*25)*0.25}
        const kk=t>t0&&t<t0+0.7?pop((t-t0)/0.2):0;u.k.visible=kk>0.01;u.k.scale.set(u.k.userData.base[0]*kk,u.k.userData.base[1]*kk,1);
        if(u===loud&&t>at(0,'j4')){u.p.rotation.y=0;armUp(u.p,0,1);armUp(u.p,1,1);mouth(u.p,true)}});
      C.fov=48;C.updateProjectionMatrix();C.position.set(0,5.4,13.5-k*1.5);C.lookAt(0,4.9,0);
      show(bJ,t,at(0,'j4'),endOf(0,'j4',0.3))}
    else{sc=sD;const k=ease((t-TG)/3);crowd.forEach(q=>{standPose(q.p);sitPose(q.p);q.p.position.y=-0.42;q.p.userData.hip.position.y=0.56+Math.abs(Math.sin(t*4+q.ph))*0.03;q.p.userData.head.rotation.z=Math.sin(t*2+q.ph)*0.1});
      C.fov=50;C.updateProjectionMatrix();C.position.set(0,3.4-k*0.4,6.5-k*1.2);C.lookAt(0,0.9,-1.2)}
    renderer.setClearColor(0x000000,0);
    if(sc===sA)setSky('#141a3a','#3a3f72 80%');else if(sc===sB)setSky('#1a1830','#2e2c50 80%');else if(sc===sC)setSky('#151a38','#3a3c6a 80%');else setSky('#f6e8f0','#e8d4e0');
    renderer.render(sc,C);
    tUpd(t,TA);
    sh(al,t>=TA&&t<TH);if(t>=TA){const k=ease((t-TA)/0.25);al.style.transform=`translateY(${(1-k)*-300}px) translateX(${Math.sin(t*60)*(t<TA+0.6?6:0)}px)`}
    if(t>=TL&&t<TC){const m=Math.min(180,Math.round(Math.pow(clamp01((t-TL)/(TK-TL-0.2)),1.6)*180));const s=m<60?`${m}분`:`${Math.floor(m/60)}시간${m%60?' '+m%60+'분':''}`;if(ch.dataset.s!=s){ch.dataset.s=s;ch.textContent='혼자 있은 시간: '+s}chipPop(ch,t,TL);ch.style.opacity=1}else ch.style.opacity=0;
    popEl(st,t,TG+0.4,'translateX(-50%)');st.style.opacity=t>TG+0.4?1:0;
    caption(0,t)};
};

// ===== 1. 생존 일지: 1일 차 빽빽 → 4일 만에 끝 =====
S[1]=()=>{
  const E=EV(1);const r=rng(511);
  const sc=new THREE.Scene();warmLights(sc);const R=room(sc);
  const dr=door3(sc,0,-3.12);
  // 바리케이드(소파·박스) + 가랜드·꼬마전구
  const boxes=[];[[-0.9,0.4,0],[0,0.4,0.1],[0.9,0.4,0],[-0.45,1.05,0.05],[0.45,1.05,0.05],[0,1.65,0.05]].forEach(([x,y,z],i)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.62,0.6),lamb(i%2?0xc9a070:0xd8b080));b.position.set(x,y,-2.5+z);sc.add(b);boxes.push(b)});
  const sofa=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.7,0.8),lamb(0xff9fc8));sofa.position.set(0,0.35,-1.9);sc.add(sofa);
  const G=garland(sc,-1.4,1.4,2.3,-2.15,9);
  const ban=banner(sc,'좀비 잡는 귀요미들 ♥',0,3.4,-3.15,4.4,0.85);
  const ppl=[];[-1.6,-0.55,0.55,1.6].forEach((x,i)=>{const p=enfp(r,{});p.position.set(x,0,-0.4+Math.abs(x)*0.2);p.rotation.y=-x*0.12;sc.add(p);ppl.push(p)});
  const bE=bubE(ppl[1],'우리 진짜 완벽하게 살아남자!!',{size:0.003,y:2.3});bE.position.x=0.4;
  const C=cam(50);
  const dia=div('diary','');const pg=div('pg','',dia);
  const PG=[
   `<h2>생존 일지 <small>1일 차 ★</small></h2><div class="l">06:00 기상 &amp; 스트레칭 ✔</div><div class="l">07:00 체력 훈련 (스쿼트 100개) ✔</div><div class="l">09:00 식량 체크 ✔✔</div><div class="l">10:00 바리케이드 꾸미기 <b>♥</b></div><div class="l">12:00 팀 회의 → 팀 이름 정함!!</div><div class="team">좀비 잡는 귀요미들 ♥</div><div class="l">14:00 생존 브이로그 촬영 ★</div><div class="l">16:00 다 같이 화이팅 구호 연습</div><div class="stk" style="right:60px;top:40px;color:#ff8fc8;transform:rotate(14deg)">♥</div><div class="stk" style="right:90px;top:430px;color:#ffd84d">★</div><div class="stk" style="right:50px;bottom:60px;color:#8fd3ff;transform:rotate(-10deg)">★</div>`,
   `<h2>생존 일지 <small>2일 차</small></h2><div class="l">09:30 기상 (조금 늦음)</div><div class="l">체력 훈련 → 내일부터</div><div class="l">바리케이드에 전구 추가 <b>♥</b></div>`,
   `<h2>생존 일지 <small>3일 차</small></h2><div class="big">배고파</div>`,
   `<h2>생존 일지 <small>4일 차</small></h2><svg viewBox="0 0 300 300" style="display:block;margin:120px auto 0;width:420px"><circle cx="150" cy="140" r="90" fill="none" stroke="#5a8a4a" stroke-width="10"/><circle cx="118" cy="125" r="14" fill="#5a8a4a"/><circle cx="182" cy="125" r="14" fill="#5a8a4a"/><path d="M110 185 Q150 165 190 185" fill="none" stroke="#5a8a4a" stroke-width="10"/><path d="M60 250 L100 215 M240 250 L200 215" stroke="#5a8a4a" stroke-width="10"/></svg><div class="l" style="text-align:center;color:#9a8a8a">(좀비 그림)</div>`,
  ];
  const ch=chip('생존 일지: 4일 · 바리케이드 꾸미기: 진행 중',80);ch.style.fontSize='46px';
  return t=>{
    const P=[E.p1,E.p2,E.p3,E.p4],TF=E.flip;
    // 3D: 팀 결성
    ppl.forEach((p,i)=>{standPose(p);const j=Math.abs(Math.sin(t*6+i));p.position.y=j*0.12;armUp(p,i%2,0.9);mouth(p,t>at(1,'e2')&&t<endOf(1,'e2'))});
    G.userData.bulbs.forEach((b,i)=>b.visible=Math.floor(t*4+i)%3!==0);
    C.fov=54;C.updateProjectionMatrix();C.position.set(0.2,2.3,6.2-t*0.25);C.lookAt(0,1.6,-2);
    show(bE,t,at(1,'e2'),P[0]);
    renderer.setClearColor(0x000000,0);setSky('#f6e8f0','#e8d4e0');renderer.render(sc,C);
    sh(dia,t>=P[0]-0.05);
    let idx=-1;P.forEach((p,i)=>{if(t>=p)idx=i});
    if(t>=TF){const n=Math.floor((t-TF)/0.09);const d=5+n;const k=((t-TF)/0.09)%1;
      if(pg.dataset.i!='f'+d){pg.dataset.i='f'+d;pg.innerHTML=`<h2>생존 일지 <small>${d}일 차</small></h2>`}
      pg.style.transform=`perspective(1600px) rotateY(${-k*80}deg)`;pg.style.transformOrigin='left center';
      if(t>TF+0.8){pg.style.transform='';if(pg.dataset.i!='end'){pg.dataset.i='end';pg.innerHTML=`<h2>생존 일지 <small>${d}일 차</small></h2>`}}}
    else if(idx>=0){if(pg.dataset.i!=idx){pg.dataset.i=idx;pg.innerHTML=PG[idx]}const k=ease((t-P[idx])/0.18);pg.style.transformOrigin='left center';pg.style.transform=`perspective(1600px) rotateY(${(1-k)*-70}deg)`}
    if(t>=P[0]){const k=ease((t-P[0]+0.05)/0.25);dia.style.transform=`translateY(${(1-k)*900}px) rotate(${(1-k)*8}deg)`}
    chipPop(ch,t,TF+0.3);ch.style.opacity=t>TF+0.3?1:0;
    caption(1,t)};
};

// ===== 2. 침묵 미션: 문밖 좀비 → '절대 말하지 말 것' → 눈빛·손짓·귓속말 → 빵 터짐(2분 47초) → 문 쾅 =====
S[2]=()=>{
  const E=EV(2);const r=rng(521);
  // 복도(문밖)
  const sH=new THREE.Scene();sH.fog=new THREE.Fog(0x2a2a3a,6,22);nightLights(sH,{hemi:0.9});
  ground(sH,0x5a5560,60);const hw=new THREE.Mesh(new THREE.PlaneGeometry(40,6),lamb(0x7a7488));hw.position.set(0,3,-1.6);sH.add(hw);
  const hdoor=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.3,0.1),lamb(0x8a6a8a));hdoor.position.set(0,1.15,-1.5);sH.add(hdoor);
  const plate=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.2),basic(0xf2e8c8));plate.position.set(0,2.0,-1.44);sH.add(plate);
  const hlamp=lamp(sH,2.6,-0.6,2.8);
  const HZ=[];for(let i=0;i<9;i++){const z=zombie(r);z.position.set(-3.6+i*0.9+(r()-0.5)*0.3,0,0.2+(i%3)*0.7);sH.add(z);HZ.push({z,x0:z.position.x})}
  const bZ1=bubZ(HZ[4].z,'으어…!',{size:0.0024,y:2.2});const bZ3=bubZ(HZ[4].z,'으어어어!!',{size:0.0028,y:2.2});
  // 거실 30명
  const sc=new THREE.Scene();warmLights(sc);room(sc);garland(sc,-3,3,3.4,-3.1,12);
  const dr=door3(sc,4.35,0.2,-Math.PI/2);
  const crowd=[];for(let i=0;i<30;i++){const row=Math.floor(i/6),col=i%6;const p=enfp(r,{cape:pick(r,BLK)});p.position.set((col-2.5)*0.95+(row%2)*0.35+(r()-0.5)*0.15,0,-2.0+row*0.85);p.rotation.y=(r()-0.5)*0.4;sc.add(p);
    const brow=[];for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.018,0.01),basic(0x3a2a2a));b.position.set(s*0.09,0.33,0.245);b.rotation.z=-s*0.15;p.userData.head.add(b);brow.push(b)}
    crowd.push({p,ph:r()*6,row,col,brow,dsec:Math.abs(col-2.5)+row*0.6})}
  const A=crowd[14],B=crowd[15];
  const bA=bubE(A.p,'(속닥) 근데 있잖아…',{size:0.0018,y:1.75});const bB=bubE(B.p,'(속닥) 헐 진짜??',{size:0.0018,y:2.2});bA.position.x=0.5;bB.position.x=-0.45;
  const wh=crowd.filter((q,i)=>i%3==0&&q!==A&&q!==B).map(q=>({q,b:bubE(q.p,'속닥속닥',{size:0.0013,y:1.7,fs:56})}));
  const ha=crowd.filter((q,i)=>i%4==1).map(q=>({q,b:bubE(q.p,pick(r,['푸핫!!','아하하하!!','ㅋㅋㅋㅋ!!']),{size:0.0016,y:1.75})}));
  const C=cam(50);const vig=div('vig');
  const sign=div('sign','<div class="a">좀비는 소리에 반응함</div><div class="b">절대 말하지 말 것!!</div>');
  const tm=div('timer','침묵 유지 <b>00:00</b>');const tb=tm.querySelector('b');const sg=div('stage','');
  const rec=div('judge','침묵 유지: 2분 47초 (역대 최고 기록)');rec.style.fontSize='54px';rec.style.top='150px';
  const fl=div('flash');
  return t=>{
    const TZ=E.tape,S3=[E.s30,E.s60,E.s120],TB=E.burst,TT=E.turn,TG=E.bang;const ZT=at(2,'z1')-0.6;
    const inHall=t<TZ||(t>=TT&&t<TT+1.3)||t>=TG-0.6;
    let sc0;
    if(inHall){sc0=sH;HZ.forEach((q,i)=>{zPose(q.z,t,t<TZ?0.5:0.2);q.z.position.x=q.x0+(t<TZ?Math.sin(t*0.6+i)*0.2:0);q.z.rotation.y=t>=TT?Math.PI*(1-ease((t-TT-0.1)/0.4)):Math.PI*0.5*(i%2?1:-1);
        if(t>=TG-0.6){q.z.rotation.y=Math.PI;q.z.position.z=0.2+(i%3)*0.7-ease((t-TG+0.6)/0.6)*0.8}});
      lampOn(hlamp,Math.sin(t*19)>0.9?0:1);
      if(t<TZ){C.fov=54;C.updateProjectionMatrix();C.position.set(0.3,2.0,7.4-t*0.3);C.lookAt(0,1.2,-1)}
      else if(t<TG-0.6){C.fov=40;C.updateProjectionMatrix();C.position.set(0,1.7,4.2);C.lookAt(0,1.4,-1)}
      else{C.fov=52;C.updateProjectionMatrix();C.position.set(0,1.7,-4.2);C.lookAt(0,1.3,1.5);const g=t-TG;hdoor.position.set(Math.sin(t*50)*(g<0?0.03:0),1.15,-1.5-Math.max(0,g)*5);hdoor.rotation.x=Math.max(0,g)*3;hdoor.rotation.z=Math.max(0,g)*1.5}
      show(bZ1,t,at(2,'z1'),endOf(2,'z1',0.4));show(bZ3,t,at(2,'z3'),99)}
    else{sc0=sc;
      crowd.forEach((q,i)=>{const p=q.p;standPose(p);sitPose(p);p.position.y=-0.42;mouth(p,false);q.brow.forEach(b=>{b.position.y=0.33;b.visible=t>S3[0]});
        // 단계별: 눈빛 → 손짓 → 귓속말 → 폭발
        if(t>=S3[0]&&t<TB){q.brow.forEach((b,k)=>b.position.y=0.33+Math.max(0,Math.sin(t*12+q.ph+k))*0.04)}
        if(t>=S3[1]&&t<TB){const u=p.userData;u.arms[1].rotation.x=-1.3+Math.sin(t*10+q.ph)*0.5;u.arms[1].rotation.z=Math.sin(t*7+q.ph)*0.3;u.arms[0].rotation.x=-0.9+Math.sin(t*9+q.ph+1)*0.4}
        if(t>=S3[2]&&t<TB){p.userData.hip.rotation.z=Math.sin(q.ph)*0.25;p.userData.head.rotation.z=Math.sin(q.ph)*0.25}
        else{p.userData.hip.rotation.z=0;p.userData.head.rotation.z=0}
        if(t>=TB){const k=clamp01((t-TB-q.dsec*0.05)/0.2);if(k>0){laughPose(p,t,k,q.ph);mouth(p,true);p.userData.hip.position.y=0.56+Math.abs(Math.sin(t*9+q.ph))*0.08*k}}
        if(t>=TT-0.1&&t<TT+1.3)p.rotation.y=Math.PI/2*0}
      );
      // A·B 귓속말
      if(t>=at(2,'e3')-0.2&&t<TB){A.p.userData.head.rotation.z=-0.35;A.p.userData.hip.rotation.z=-0.2;A.p.userData.arms[0].rotation.x=-2.2;A.p.userData.arms[0].rotation.z=0.6}
      if(t>=at(2,'j1')&&t<TB){mouth(B.p,true);B.p.userData.arms.forEach(a=>{a.rotation.x=-2.4;a.rotation.z=0})}
      show(bA,t,at(2,'e3'),TB);show(bB,t,at(2,'j1'),TB);
      wh.forEach((w,i)=>show(w.b,t,endOf(2,'j1',-0.3)+i*0.06,TB));
      ha.forEach((h,i)=>show(h.b,t,TB+0.1+i*0.05,TG));
      // 카메라
      if(t<S3[0]){C.fov=40;C.updateProjectionMatrix();C.position.set(0,2.3,5.5);C.lookAt(0,0.9,-0.8)}
      else if(t<at(2,'e3')-0.2){const k=ease((t-S3[0])/(at(2,'e3')-S3[0]));C.fov=46;C.updateProjectionMatrix();C.position.set(0,3.4-k*0.6,6.4-k*1.4);C.lookAt(0,0.8,-0.8)}
      else if(t<TB){C.fov=42;C.updateProjectionMatrix();const cx=(A.p.position.x+B.p.position.x)/2;C.position.set(cx+0.3,2.3,A.p.position.z+4.2);C.lookAt(cx,1.2,A.p.position.z)}
      else{const k=ease((t-TB)/2);C.fov=50;C.updateProjectionMatrix();C.position.set(0,3.4,6.6+k*0.3);C.lookAt(0,0.9,-0.8)}}
    const bp=beatPulse(2,t);vig.style.opacity=t<TB?0.25+0.4*bp:(t>TT?0.5:0);
    renderer.setClearColor(0x000000,0);if(sc0===sH)setSky('#1a1a2a','#3a3650');else setSky('#f6e8f0','#e8d4e0');renderer.render(sc0,C);
    // DOM
    sh(sign,t>=TZ&&t<S3[0]);popEl(sign,t,TZ,'translateX(-50%) rotate(-2deg)');
    const inRoom=!inHall&&t>=S3[0];
    sh(tm,inRoom&&t<TB);if(inRoom&&t<TB){const secs=Math.min(166,Math.floor(Math.pow(clamp01((t-S3[0])/(TB-S3[0])),1.25)*167));const s=`0${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;if(tb.textContent!=s)tb.textContent=s}
    let si=-1;S3.forEach((s,i)=>{if(t>=s)si=i});const SL=['눈빛 대화 중','손짓 수다 중','귓속말 퍼지는 중'];
    sh(sg,inRoom&&si>=0&&t<TB);if(si>=0&&t<TB){if(sg.dataset.i!=si){sg.dataset.i=si;sg.textContent=SL[si]}popEl(sg,t,S3[si],'translateX(-50%)')}
    sh(rec,t>=TB+0.3&&!inHall);popEl(rec,t,TB+0.3,'translateX(-50%)');
    fl.style.background=`rgba(255,255,255,${0.9*clamp01(1-(t-TG)/0.25)*(t>=TG?1:0)})`;
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
  const Z=[];for(let i=0;i<14;i++){const row=Math.floor(i/5),col=i%5;const z=zombie(r,{shirt:pick(r,[0xd98aa8,0xd8b070,0x80b0d0,0xa890d0,0x88c0a0])});z.position.set((col-2)*1.15+(row%2)*0.5,0,-1.8+row*1.1);sc.add(z);
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
