// ---------- ISTP 전쟁편 공용 (ESFP 전쟁편에서 가져옴) ----------
const S=[];
function addFace(p){const h=p.userData.head;
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.013,4,10,Math.PI),basic(0x5a2a2a));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.016,0.01),basic(0x5a2a2a));fl.position.set(0,0.145,0.248);h.add(fl);
  p.userData.smile=sm;p.userData.flat=fl;setFace(p,false);return p}
function setFace(p,smile){p.userData.smile.visible=smile;p.userData.flat.visible=!smile}
const ALLY={shirt:0x7f9b5a,pants:0x55663f,helm:0x667f48};
const FOE={shirt:0x9a8fd0,pants:0x5e5896,helm:0x7c74b8};
const TOUR=[0xf28b8b,0xf2c46b,0x8bd1f2,0xb58bf2,0x8bf2b0,0xf29bd8];
function soldier(r,side,o={}){const p=addFace(makePerson(r,{shirt:side.shirt,pants:side.pants}));
  const h=p.userData.head;h.children[1].visible=false;
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.29,12,8,0,Math.PI*2,0,Math.PI*0.5),lamb(side.helm));hm.position.y=0.27;h.add(hm);
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.33,0.035,14),lamb(side.helm));rim.position.y=0.28;h.add(rim);
  return p}
function general(r,o){const p=addFace(makePerson(r,{shirt:o.shirt,pants:o.pants}));const h=p.userData.head;
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.27,0.26,0.16,14),lamb(o.cap));cap.position.y=0.44;h.add(cap);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.31,0.27,0.07,14),lamb(o.cap));top.position.y=0.54;h.add(top);
  const brim=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.03,0.2),lamb(0x222222));brim.position.set(0,0.37,0.24);h.add(brim);
  const badge=new THREE.Mesh(new THREE.CircleGeometry(0.06,5),basic(0xffd84d));badge.position.set(0,0.46,0.27);h.add(badge);
  for(const s of[-1,1]){const ep=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.05,0.22),lamb(0xe8c050));ep.position.set(s*0.3,0.66,0);p.userData.hip.add(ep)}
  const md=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.1,0.02),lamb(0xe8c050));md.position.set(-0.13,0.45,0.17);p.userData.hip.add(md);
  p.scale.setScalar(1.15);return p}
const GEN={shirt:0x56703f,pants:0x3e4f2e,cap:0x4a6136};
const ENEMYG={shirt:0x6d62ad,pants:0x463f7d,cap:0x5b5199};
function tourist(r){const p=addFace(makePerson(r,{shirt:pick(r,TOUR)}));setFace(p,true);return p}
function phoneMesh(col=0xbfe3ff){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.3,0.03),lamb(0x24242c));g.add(b);
  const s=new THREE.Mesh(new THREE.PlaneGeometry(0.14,0.26),basic(col));s.position.z=-0.017;s.rotation.y=Math.PI;g.add(s);
  const rec=new THREE.Mesh(new THREE.CircleGeometry(0.02,10),basic(0xff3a3a));rec.position.set(-0.045,0.1,-0.019);rec.rotation.y=Math.PI;g.add(rec);
  g.userData.rec=rec;return g}
// 한 손으로 폰을 들어 앞을 찍는 자세(폰 화면이 본인 쪽)
const _v=new THREE.Vector3();
function phoneUp(p,side=1,k=1,ph=null){const a=p.userData.arms[side];a.rotation.x=-2.25*k;a.rotation.z=(side?0.12:-0.12)*k;
  if(!p.userData.phone){const ph=phoneMesh();p.userData.hip.add(ph);p.userData.phone=ph}
  const P=p.userData.phone;P.visible=k>0.05;P.rotation.set(-0.15,0,0);
  // 손 위치에 폰을 붙인다
  const hand=a.children[1];p.updateMatrixWorld(true);hand.getWorldPosition(_v);p.userData.hip.worldToLocal(_v);
  P.position.set(_v.x,_v.y+0.13,_v.z+0.03);}
function rifle(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.1,0.85),lamb(0x3a3530));g.add(b);
  const st=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.17,0.26),lamb(0x6b4a2f));st.position.set(0,-0.05,-0.36);g.add(st);
  const mz=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.2),lamb(0x222222));mz.position.z=0.5;g.add(mz);return g}
function aim(p){const u=p.userData;u.arms[0].rotation.x=-1.45;u.arms[0].rotation.z=0.35;u.arms[1].rotation.x=-1.5;u.arms[1].rotation.z=-0.1;
  if(!u.rifle){const R=rifle();u.hip.add(R);u.rifle=R}u.rifle.visible=true;u.rifle.position.set(0.12,0.62,0.45)}
function noRifle(p){if(p.userData.rifle)p.userData.rifle.visible=false}
function vSign(p,side=1,k=1){const a=p.userData.arms[side];a.rotation.x=-2.7*k;a.rotation.z=(side?0.5:-0.5)*k}
function lPose(p,t,k=1,hop=true){// L을 가져가: 한 손 L 이마, 한 손 배, 옆으로 뛰기
  const u=p.userData;u.arms[1].rotation.x=-2.75*k;u.arms[1].rotation.z=1.15*k;
  u.arms[0].rotation.x=-0.9*k;u.arms[0].rotation.z=0.9*k;
  if(!u.L){const L=textSprite('L',90,'#c8ff4d',0.0045);u.head.add(L);u.L=L;L.position.set(0.02,0.55,0.32)}u.L.visible=k>0.5;
  if(hop){const s=Math.sin(t*Math.PI*2*1.6);u.legs[0].rotation.z=-0.45*Math.max(0,s)*k;u.legs[1].rotation.z=0.45*Math.max(0,-s)*k;u.hip.position.y=0.8+Math.abs(s)*0.12*k;u.hip.position.x=s*0.12*k}
}
function terminalPose(p,t,k=1){// 뒤돌아 엉덩이 흔들기 + 머리 쓸어올리기, 고개는 뒤를 돌아봄
  const u=p.userData,w=Math.sin(t*Math.PI*2*2.2);
  u.hip.position.x=w*0.09*k;u.hip.rotation.z=w*0.16*k;u.hip.rotation.x=-0.18*k;u.hip.position.y=0.78;
  u.legs[0].rotation.x=0.2*k;u.legs[1].rotation.x=0.2*k;u.legs[0].rotation.z=-0.12*k;u.legs[1].rotation.z=0.12*k;
  u.arms[1].rotation.x=-2.7*k;u.arms[1].rotation.z=(0.6+Math.sin(t*Math.PI*2*1.1)*0.5)*k;
  u.arms[0].rotation.x=-0.5*k;u.arms[0].rotation.z=0.5*k;
  u.head.rotation.y=0.9*k;u.head.rotation.z=-0.1*k}
function resetLegs(p){const u=p.userData;u.legs.forEach(l=>{l.rotation.z=0;l.rotation.x=0});u.hip.position.x=0;u.hip.position.y=0.8;u.hip.rotation.set(0,0,0);u.head.rotation.set(0,0,0);if(u.L)u.L.visible=false}
function sandbags(scene,x,z,w,rows=3,col=0xc9b48a){const g=new THREE.Group();const n=Math.round(w/0.62);
  for(let j=0;j<rows;j++)for(let i=0;i<n;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.28,0.42),lamb(j%2?col:0xbfa97e));b.position.set(-w/2+0.31+i*0.62+(j%2)*0.3,0.14+j*0.27,0);b.rotation.y=(i*7+j)%3*0.04-0.04;g.add(b)}
  g.position.set(x,0,z);scene.add(g);return g}
function flag(scene,x,z,col,h=4.5,w=1.6){const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,h,6),lamb(0xdddddd));pole.position.y=h/2;g.add(pole);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(w,w*0.62,6,1),new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide,flatShading:true}));f.position.set(w/2,h-w*0.35,0);g.add(f);g.userData.f=f;
  const ball=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6),lamb(0xe8c050));ball.position.y=h;g.add(ball);g.position.set(x,0,z);scene.add(g);return g}
function waveFlag(fl,t){const pos=fl.userData.f.geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setZ(i,Math.sin(t*4+x*3)*0.12*(x+0.8))}pos.needsUpdate=true}
function ground(scene,col,size=200){const g=new THREE.Mesh(new THREE.PlaneGeometry(size,size),lamb(col));g.rotation.x=-Math.PI/2;scene.add(g);return g}
function fence(scene,z,w=40){const g=new THREE.Group();for(let x=-w/2;x<=w/2;x+=2.2){const p=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.3,0.1),lamb(0x6b5a48));p.position.set(x,0.65,0);g.add(p)}
  for(const y of[0.45,0.8,1.15]){const l=new THREE.Mesh(new THREE.BoxGeometry(w,0.025,0.025),lamb(0x8a8a8a));l.position.set(0,y,0);g.add(l)}g.position.z=z;scene.add(g);return g}
function tent(scene,x,z,col,s=1){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.ConeGeometry(2.2,2.6,4),lamb(col));c.rotation.y=Math.PI/4;c.position.y=1.3;g.add(c);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(0.9,1.3),basic(0x2a2a30));door.position.set(0,0.65,1.12);door.rotation.x=-0.36;g.add(door);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}
function tank(col){const g=new THREE.Group();const tr=lamb(0x3a3a3a);
  for(const s of[-1,1]){const t=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,4.2),tr);t.position.set(s*1.25,0.35,0);g.add(t)}
  const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.8,3.8),lamb(col));b.position.y=1.0;g.add(b);
  const tu=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.6,1.8),lamb(col));tu.position.set(0,1.7,-0.3);g.add(tu);
  const br=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,2.4,8),lamb(0x55663f));br.rotation.x=Math.PI/2;br.position.set(0,1.75,1.6);g.add(br);return g}
function popEl(el,t,t0,base=''){const k=pop((t-t0)/0.3);el.style.transform=`${base} scale(${k})`;el.style.opacity=clamp01((t-t0)/0.08)}
function div(cls,html,parent=ui){const d=document.createElement('div');d.className=cls;if(html!=null)d.innerHTML=html;parent.appendChild(d);return d}
function bub(p,text,o={}){const b=makeBubble(text,{bg:o.bg||'#f2ffd0',fg:o.fg||'#2b3a10',fs:o.fs||64,size:o.size});b.position.y=o.y??2.35;p.add(b);scaleBubble(b,0);return b}
function cam(fov=50,asp=W/H){return new THREE.PerspectiveCamera(fov,asp,0.1,400)}
const fmt=n=>Math.round(n).toLocaleString('en-US');

