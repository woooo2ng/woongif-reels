const SAND=0xf3deb0,WET=0xe0c690,SEA=0x63cdd2,SEA2=0x4fb9c8;
function palm(scene,x,z,s=1,lean=0.3,rot=0){
  const g=new THREE.Group();let px=0,py=0;const N=7;
  for(let i=0;i<N;i++){const k=i/N,ang=lean*k*1.5;const seg=new THREE.Mesh(new THREE.CylinderGeometry(0.1-0.035*k,0.13-0.035*k,0.52,7),lamb(i%2?0x9a7652:0x86643f));
    seg.position.set(px+Math.sin(ang)*0.26,py+Math.cos(ang)*0.26,0);seg.rotation.z=-ang;g.add(seg);px+=Math.sin(ang)*0.5;py+=Math.cos(ang)*0.5}
  const top=new THREE.Group();top.position.set(px,py,0);g.add(top);
  for(let i=0;i<9;i++){const h=new THREE.Group();h.rotation.y=i/9*Math.PI*2+i*0.3;const lf=new THREE.Mesh(new THREE.ConeGeometry(0.24,1.7,4),lamb(i%2?0x5fb36a:0x4ba05c));
    lf.geometry=lf.geometry.clone();lf.geometry.translate(0,0.85,0);lf.scale.set(1,1,0.22);lf.rotation.z=-1.75-(i%3)*0.18;h.add(lf);top.add(h)}
  for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry(0.11,0),lamb(0x6b4a2f));c.position.set(Math.cos(i*2.1)*0.12,-0.12,Math.sin(i*2.1)*0.12);top.add(c)}
  g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=rot;scene.add(g);g.userData.top=top;return g;
}
function rock(scene,x,z,s=1,col=0x9aa0a6){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(0.5,0),lamb(col));m.scale.set(s*1.3,s*0.7,s);m.position.set(x,s*0.2,z);scene.add(m);return m}
function shell(scene,x,z,col=0xffb3c6,s=1){const m=new THREE.Mesh(new THREE.ConeGeometry(0.09,0.12,6),lamb(col));m.rotation.x=-Math.PI/2.4;m.position.set(x,0.04,z);m.scale.setScalar(s);scene.add(m);return m}
function flower(scene,x,z,col=0xff8fb3,s=1){const g=new THREE.Group();for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),lamb(col));p.position.set(Math.cos(i*1.257)*0.07,0.03,Math.sin(i*1.257)*0.07);p.scale.y=0.4;g.add(p)}
  const c=new THREE.Mesh(new THREE.SphereGeometry(0.045,8,6),lamb(0xffe066));c.position.y=0.04;g.add(c);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}
function cloud(scene,x,y,z,s=1){const g=new THREE.Group();for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry(0.8+((i*7)%3)*0.2,1),lamb(0xffffff));c.position.set((i-2)*0.9,Math.sin(i*1.7)*0.25,0);c.scale.y=0.65;g.add(c)}g.position.set(x,y,z);g.scale.setScalar(s);scene.add(g);return g}
// 해변: 모래(+z쪽) · 젖은 모래 · 바다(-z쪽). shore = 물가 z
function beach(scene,r,o={}){
  const sh=o.shore??-3;
  const sand=new THREE.Mesh(new THREE.PlaneGeometry(200,60),lamb(SAND));sand.rotation.x=-Math.PI/2;sand.position.set(0,0,sh+30);scene.add(sand);
  const wet=new THREE.Mesh(new THREE.PlaneGeometry(200,1.6),lamb(WET));wet.rotation.x=-Math.PI/2;wet.position.set(0,0.004,sh+0.5);scene.add(wet);
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(400,200),lamb(o.sea??SEA));sea.rotation.x=-Math.PI/2;sea.position.set(0,-0.02,sh-100);scene.add(sea);
  const deep=new THREE.Mesh(new THREE.PlaneGeometry(400,160),lamb(o.sea2??SEA2));deep.rotation.x=-Math.PI/2;deep.position.set(0,-0.01,sh-95);scene.add(deep);
  const foams=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.BoxGeometry(200,0.03,0.18+i*0.06),lamb(0xffffff));scene.add(f);foams.push(f)}
  const bands=[];for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(200,0.02,0.12),new THREE.MeshLambertMaterial({color:0xd9f6f6,transparent:true,opacity:0.6}));scene.add(b);bands.push(b)}
  return {shore:sh,upd(t){foams.forEach((f,i)=>{const ph=t*0.55+i*0.33;const k=(ph%1);f.position.set(0,0.01,sh-1.2+ease(Math.sin(k*Math.PI))*1.4-i*0.25);f.scale.z=1-k*0.5});
    bands.forEach((b,i)=>{b.position.set(0,0.0,sh-3-i*3+((t*0.6)%3))})}};
}
function lie(p,x,z,yaw=0,o={}){const w=new THREE.Group();p.rotation.set(-Math.PI/2,0,0);p.position.set(0,0.2,0.95);w.add(p);w.position.set(x,0,z);w.rotation.y=yaw;
  const u=p.userData;if(o.star){u.arms[0].rotation.z=-1.0;u.arms[1].rotation.z=1.0;u.legs[0].rotation.z=-0.25;u.legs[1].rotation.z=0.25}
  if(o.arms==='head'){u.arms.forEach(a=>{a.rotation.x=-2.9});u.arms[0].rotation.z=-0.5;u.arms[1].rotation.z=0.5}
  w.userData.p=p;return w}
// 누운 → 일어섬 (발 기준 회전). k=0 누움, 1 섬
function riseK(p,x,z,k,yaw=0){p.rotation.set(-Math.PI/2*(1-k),yaw,0,'YXZ');p.position.set(x,0.12*(1-k),z)}
function messy(p,hair=0x1d1d24){const h=p.userData.head;const g=new THREE.Group();h.add(g);
  for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.075+(i%3)*0.02,16,12),smooth(hair));const a=i/9*Math.PI*2;s.position.set(Math.cos(a)*0.17,0.43+Math.sin(i*2.3)*0.04,Math.sin(a)*0.15-0.03);g.add(s)}
  for(let i=0;i<3;i++){const tw=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.018,0.018),lamb(0x8a6a44));tw.position.set(-0.06+i*0.07,0.52,-0.02+i*0.03);tw.rotation.set(0.3*i,i*1.1,0.5-i*0.4);g.add(tw)}
  const leaf=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.2,4),lamb(0x5fb36a));leaf.scale.z=0.3;leaf.position.set(0.12,0.55,0.05);leaf.rotation.z=-0.9;g.add(leaf);
  const dirt=new THREE.Group();h.add(dirt);
  for(const [x,y,s] of [[-0.12,0.31,1],[0.1,0.12,1.3],[0.15,0.3,0.8],[-0.06,0.08,0.9],[0.02,0.38,0.7]]){const d=new THREE.Mesh(new THREE.CircleGeometry(0.028*s,10),basic(0xd8b98a));const n=new THREE.Vector3(x,y-0.24,Math.sqrt(Math.max(0.0001,0.0625-x*x-(y-0.24)**2))).normalize();d.position.copy(n.clone().multiplyScalar(0.252)).add(new THREE.Vector3(0,0.24,0));d.lookAt(d.position.clone().add(n));dirt.add(d)}
  // 모래알 덕지덕지(얼굴 앞쪽 반구에 작은 알갱이)
  const gr=rng(77+(p.id||0));const gm=[smooth(0xe3c690),smooth(0xd6b47a),smooth(0xf0dcae)];
  for(let i=0;i<70;i++){const th=(gr()-0.5)*2.2,ph=(gr()-0.35)*1.5;const n=new THREE.Vector3(Math.sin(th)*Math.cos(ph),Math.sin(ph),Math.cos(th)*Math.cos(ph));if(n.z<0.25)continue;
    if(Math.abs(n.x)<0.42&&Math.abs(n.y-0.04)<0.12&&gr()<0.7)continue;
    const g2=new THREE.Mesh(new THREE.SphereGeometry(0.007+gr()*0.01,6,5),gm[i%3]);g2.position.copy(n.multiplyScalar(0.252)).add(new THREE.Vector3(0,0.24,0));dirt.add(g2)}
  return {hair:g,dirt}}
function rescuer(r){const p=makePerson(r,{shirt:0xf28a3c,pants:0xf28a3c});const h=new THREE.Mesh(new THREE.SphereGeometry(0.285,40,20,0,Math.PI*2,0,Math.PI*0.52),smooth(0xfafafa));h.position.y=0.27;p.userData.head.add(h);
  const st=new THREE.Mesh(new THREE.BoxGeometry(0.53,0.06,0.33),lamb(0xfff2a8));st.position.y=0.42;p.userData.hip.add(st);return p}
function suitcase(){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.3,0.8),lamb(0xffc96b));base.position.y=0.15;g.add(base);
  const lidP=new THREE.Group();lidP.position.set(0,0.3,-0.4);g.add(lidP);const lid=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.24,0.8),lamb(0xffd88a));lid.position.set(0,0.12,0.4);lidP.add(lid);
  for(const x of[-0.35,0.35]){const s=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.25,0.82),lamb(0xd98b4a));s.position.set(x,0.12,0.4);lidP.add(s)}
  const hd=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.03,6,12,Math.PI),lamb(0x8a5a30));hd.position.set(0,0.15,0.81);hd.rotation.x=0;g.add(hd);
  const inner=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.02,0.7),lamb(0xbfe8d6));inner.position.y=0.29;g.add(inner);
  g.userData.lid=lidP;return g}
function fireMake(scene,x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  for(let i=0;i<5;i++){const l=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.06,0.7,6),lamb(0x7a5a3c));l.rotation.z=Math.PI/2.3;l.rotation.y=i*1.25;l.position.y=0.06;g.add(l)}
  const fl=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.22-i*0.05,0.6-i*0.1,7),basic([0xff9a3c,0xffc94a,0xfff1a0][i]));f.position.y=0.3;g.add(f);fl.push(f)}
  const smoke=[];for(let i=0;i<10;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(0.25,1),new THREE.MeshLambertMaterial({color:0xdedede,transparent:true,opacity:0.8}));g.add(s);smoke.push({s,ph:i/10})}
  return {g,upd(t,k){g.visible=k>0;fl.forEach((f,i)=>{f.scale.set(k*(1+Math.sin(t*20+i)*0.1),k*(1+Math.sin(t*17+i*2)*0.2),k*(1+Math.sin(t*20+i)*0.1))});
    smoke.forEach(q=>{const lt=(t*0.35+q.ph)%1;q.s.visible=k>0.5;q.s.position.set(Math.sin(lt*5+q.ph*9)*0.3+lt*0.8,0.6+lt*5,0);q.s.scale.setScalar((0.5+lt*1.6)*k);q.s.material.opacity=0.8*(1-lt)})}};
}
function heli(){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),smooth(0xff6b5a));body.scale.set(1.5,0.9,0.95);g.add(body);
  const win=new THREE.Mesh(new THREE.SphereGeometry(0.7,20,14,0,Math.PI,0,Math.PI/2),smooth(0xbfe8ff));win.rotation.y=Math.PI/2;win.position.set(0.8,0.1,0);win.scale.set(1,0.9,1.2);g.add(win);
  const tail=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.25,2.4,8),lamb(0xff6b5a));tail.rotation.z=Math.PI/2;tail.position.set(-2.4,0.2,0);g.add(tail);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.8,0.08),lamb(0xffffff));fin.position.set(-3.5,0.5,0);g.add(fin);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.4,6),lamb(0x444));mast.position.y=1.0;g.add(mast);
  const rot=new THREE.Group();rot.position.y=1.2;g.add(rot);for(let i=0;i<2;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(5.2,0.04,0.22),lamb(0x333338));b.rotation.y=i*Math.PI/2;rot.add(b)}
  for(const z of[-0.6,0.6]){const sk=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.08,0.1),lamb(0x444));sk.position.set(0,-1.15,z);g.add(sk);for(const x of[-0.5,0.5]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.4,0.06),lamb(0x444));l.position.set(x,-0.95,z);g.add(l)}}
  const cross=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5),basic(0xffffff));cross.position.set(-0.2,0.1,0.92);g.add(cross);
  g.userData.rot=rot;return g}
function plane(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.25,3.4,10),smooth(0xffffff));b.rotation.z=Math.PI/2;g.add(b);
  const n=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,10),smooth(0xffffff));n.position.x=1.7;g.add(n);
  const w=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.06,4.2),lamb(0xdfe7f2));g.add(w);const tw=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.8,0.06),lamb(0x7fb8f0));tw.position.set(-1.6,0.45,0);g.add(tw);
  const t2=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.05,1.4),lamb(0xdfe7f2));t2.position.set(-1.6,0.1,0);g.add(t2);
  const trail=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.04,1,8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.7}));trail.rotation.z=Math.PI/2;g.add(trail);g.userData.trail=trail;return g}
function sky(top,mid,bot){bgEl.style.background=`linear-gradient(${top},${mid} 55%,${bot})`}
const IS=()=>{const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sky:0xffffff,ground:0xc9b48a,dir:1.5,dpos:[5,10,6]});return scene};
const PSHIRT=[0x9cc3ec,0xd98c8c,0x8cc9a0,0xe0c070,0xa58cd0,0x7fb7c9,0xe39a6b,0xc7a3c9,0x90b86c,0xf2b8c6];
function crowd(r,n){const a=[];for(let i=0;i<n;i++)a.push(makePerson(r,{shirt:PSHIRT[i%PSHIRT.length],hair:pick(r,[0x1d1d24,0x2a2220,0x4a3426])}));return a}
function mixc(a,b,k){const A=new THREE.Color(a),Bc=new THREE.Color(b);return '#'+A.lerp(Bc,clamp01(k)).getHexString()}
// 누웠다 → 앉았다 → 일어섬 (몸이 판자처럼 들리지 않게). z = 다 일어섰을 때 위치, 누우면 머리가 -z
function riseUp(p,x,z,k,yaw=0){const u=p.userData;standPose(p);const G=0.12;
  const kA=ease(clamp01(k*1.8)),kB=ease(clamp01((k-0.5)*2));
  const a=-Math.PI/2*(1-kA);const legR=-Math.PI/2-a;
  const hipY=0.8+(G-0.8)*0;let hy=G+(0.8-G)*kB;const lr=legR*(1-kB);
  u.legs.forEach(l=>l.rotation.x=lr);
  // 엉덩이 월드 위치 = (x, hy, z) 고정, 몸통 각도 a
  const oy=-0.8*Math.cos(a),oz=-0.8*Math.sin(a);
  p.rotation.set(a,yaw,0,'YXZ');p.position.set(x+oz*Math.sin(yaw),hy+oy,z+oz*Math.cos(yaw));
  if(kA<1){u.arms.forEach(a2=>{a2.rotation.x=0.4*(1-kA)})}}
