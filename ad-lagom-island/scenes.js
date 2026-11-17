// ===== 무인도편 장면 =====
const C_T='#9df2c8';
{const st=document.createElement('style');st.textContent=`
.tag{top:250px}
.title1{top:320px;font-size:118px}
.title2{top:450px;font-size:156px;letter-spacing:-4px;color:#9df2c8}
.title3{position:absolute;left:0;right:0;top:640px;text-align:center;font-size:104px;letter-spacing:-4px;white-space:nowrap}
.big{white-space:nowrap;position:absolute;left:50%;transform:translateX(-50%);top:560px;background:rgba(255,255,255,.95);color:#2b2b3a;font-weight:900;font-size:76px;padding:20px 50px;border-radius:999px;box-shadow:0 12px 30px rgba(0,0,0,.2)}
.big b{color:#e2335a}
.gauge{position:absolute;left:240px;right:240px;top:420px;height:70px;border-radius:999px;background:rgba(40,40,60,.85);padding:10px;box-sizing:border-box;box-shadow:0 10px 26px rgba(0,0,0,.25)}
.gauge i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#9df2c8,#5fd6a3)}
.gauge span{position:absolute;left:0;right:0;top:-92px;text-align:center;font-size:66px}
.ph{position:absolute;left:320px;top:130px;width:440px;height:800px;border-radius:66px;background:#1b1b22;padding:18px;box-sizing:border-box;box-shadow:0 30px 70px rgba(30,30,60,.45)}
.ph .sc{position:relative;width:100%;height:100%;border-radius:50px;overflow:hidden;background:#0f1218}
.ph .bat{position:absolute;right:30px;top:22px;font-size:30px;font-weight:900;color:#ff4d5e}
.ph .lock{position:absolute;left:0;right:0;top:170px;text-align:center;color:#fff}
.ph .lock .tm{font-size:120px;font-weight:300;letter-spacing:-3px}
.ph .warn{position:absolute;left:30px;right:30px;top:470px;background:rgba(255,255,255,.95);border-radius:30px;padding:26px;text-align:center}
.ph .warn b{display:block;font-size:40px;color:#e2335a;font-weight:900}
.ph .warn small{font-size:28px;color:#555;font-weight:700}
.ph .batbig{position:absolute;left:50%;top:680px;transform:translateX(-50%);width:170px;height:80px;border:7px solid #fff;border-radius:18px}
.ph .batbig:after{content:'';position:absolute;right:-22px;top:20px;width:12px;height:28px;background:#fff;border-radius:4px}
.ph .batbig i{position:absolute;left:6px;top:6px;bottom:6px;width:8px;background:#ff4d5e;border-radius:4px}
.ph canvas{position:absolute;left:0;top:0;width:100%;height:100%}
.ph .shut{position:absolute;left:50%;bottom:40px;transform:translateX(-50%);width:110px;height:110px;border-radius:50%;border:8px solid #fff;box-sizing:border-box}
.ph .shut i{position:absolute;inset:8px;border-radius:50%;background:#fff}
.ph .post{position:absolute;inset:0;background:#fff}
.ph .post .hd{height:120px;display:flex;align-items:center;padding:0 28px;gap:16px;font-size:32px;font-weight:900;color:#222;margin-top:40px}
.ph .post .hd i{width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#9df2c8,#7fb8f0)}
.ph .post .im{position:absolute;left:0;right:0;top:170px;height:444px}
.ph .post .lk{position:absolute;left:28px;top:640px;font-size:38px;font-weight:900;color:#222}
.ph .post .lk b{color:#e2335a}
.ph .post .cp{position:absolute;left:28px;right:28px;top:700px;font-size:30px;color:#333;line-height:1.4}
.ph .toast{position:absolute;left:40px;right:40px;top:60px;background:#2b2b3a;color:#fff;border-radius:22px;padding:16px;font-size:30px;font-weight:900;text-align:center}
.ph .off{position:absolute;inset:0;background:#000;opacity:0}
.fl{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
`;document.head.appendChild(st)}
const ln=(si,k)=>TM.lines.find(l=>l.s===si&&l.k===k);
function title(t){
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ISFP × 무인도편</div><div class="title1 out">온 세상이</div><div class="title2 out">ISFP인데</div><div class="title3 out">무인도에 떨어진다면?</div>`);
  const el=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return t=>{el[0].style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    el.slice(1).forEach((e,i)=>{const t0=0.1+i*0.25;e.style.transform=`scale(${pop((t-t0)/0.35)})`;e.style.opacity=clamp01((t-t0)/0.1)})};
}
// ---------- 섬 환경 ----------
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
function riseK(p,x,z,k,yaw=0){p.rotation.set(-Math.PI/2*(1-k),yaw,0,'YXZ');p.position.set(x,0.2*(1-k),z)}
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

// ---------- S0 타이틀: 폭풍 → 해변에 떠밀려옴 → "일단 살아남아야 합니다!" ----------
S[0]=()=>{
  const scene=IS();const r=rng(501);const B=beach(scene,r,{shore:-2.5});
  palm(scene,-4.6,-0.5,1.3,0.35,0.3);palm(scene,5.0,0.5,1.2,-0.4,2.4);palm(scene,-6.5,2,1.1,0.2,1.2);rock(scene,3.6,-1.2,0.9);rock(scene,-3.2,1.8,0.6);
  // 부서진 배(멀리)
  const ship=new THREE.Group();scene.add(ship);const hull=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.9,1.2),lamb(0x8a6a4a));hull.position.y=0.2;ship.add(hull);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,2.2,6),lamb(0x6b4a2f));mast.position.set(0.3,1.4,0);mast.rotation.z=0.6;ship.add(mast);
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(1,1.2),new THREE.MeshLambertMaterial({color:0xf2efe6,side:THREE.DoubleSide}));sail.position.set(0.8,1.6,0.05);sail.rotation.z=0.7;ship.add(sail);
  ship.position.set(4.5,0,-13);ship.rotation.set(0.1,0.4,-0.35);
  // 판자들
  for(let i=0;i<6;i++){const pl=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.06,0.22),lamb(0x9a7652));pl.position.set(-3+i*1.3+r()*0.4,0.03,-0.6+r()*2.4);pl.rotation.y=r()*3;scene.add(pl)}
  const ppl=crowd(r,13);const lay=[];
  const spots=[[-2.6,0.2],[-1.2,1.2],[0.6,0.5],[2.0,1.4],[3.0,0.2],[-3.4,1.6],[1.2,2.3],[-0.4,2.8],[2.8,2.9],[-2.0,3.2],[0.2,-0.6],[-1.6,-0.4],[1.8,-0.5]];
  ppl.forEach((p,i)=>{const [x,z]=spots[i];const w=lie(p,x,z,r()*Math.PI*2,{star:i%3===0});scene.add(w);lay.push({w,p,z,x,del:r()*0.6})});
  // 리더(앞줄 가운데)
  const L=makeHero({shirt:0x7fb7c9,pants:0x55506a});scene.add(L);const Lb=bub(L,'살아남아 볼까요…?',{y:2.1,size:0.0024,fs:68});
  const nods=[];
  const l1=ln(0,'l1');const T1=LEAD+0,TS=l1.t0-0.6;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const tl=title();const fl=document.createElement('div');fl.className='fl';ui.appendChild(fl);
  return t=>{
    // 폭풍 → 갬
    const k=ease((t-0.4)/1.8);
    bgEl.style.background=`linear-gradient(${k<1?mixc('#4b566b','#7fc6ef',k):'#7fc6ef'},${mixc('#8e9aab','#c9eef6',k)} 55%,${mixc('#a9b3bf','#eafaf8',k)})`;
    fl.style.opacity=t>0.3&&t<0.5?0.85*(1-(t-0.3)/0.2):0;
    B.upd(t*(1.6-k*0.8));
    lay.forEach(q=>{const sl=1-ease((t-q.del)/2.0);q.w.position.z=q.z-sl*2.2;q.w.position.y=-0.05*sl});
    // 리더 일어섬
    const rk=ease((t-TS)/0.55);riseK(L,0,4.2,rk,0);standPose(L);if(rk>=1){const lt=t-l1.t0;L.userData.arms[1].rotation.x=-1.1*ease(lt/0.4);L.userData.arms[1].rotation.z=0.15;L.userData.head.rotation.z=0.12*ease(lt/0.4)}
    showB(Lb,t,l1.t0+0.2);
    // 다들 고개 끄덕(누운 채 머리만 들고)
    lay.forEach((q,i)=>{const hk=ease((t-(l1.t1+0.05+i*0.03))/0.25);q.p.userData.head.rotation.x=-0.7*hk+Math.sin(Math.max(0,t-l1.t1-0.3)*12)*0.15*hk});
    cam.position.set(0,4.8,11.2-t*0.2);cam.lookAt(0,0.9,-2.5);
    tl(t);caption(0,t);renderer.render(scene,cam);
  };
};
function mixc(a,b,k){const A=new THREE.Color(a),Bc=new THREE.Color(b);return '#'+A.lerp(Bc,clamp01(k)).getHexString()}

// ---------- S1 팀 나누기 → "네!" → 컷: 전원 누움(부감) ----------
S[1]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(611);const B=beach(scene,r,{shore:-5});
  palm(scene,-4.2,-2.5,1.3,0.3,0.4);palm(scene,4.0,-2.0,1.25,-0.35,2.2);rock(scene,-3,-3.5,0.8);
  const L=makeHero({shirt:0x7fb7c9,pants:0x55506a});L.position.set(0,0,-1.6);scene.add(L);
  const front=crowd(r,10);const fr=[];
  front.forEach((p,i)=>{const row=i<5?0:1;const x=(i%5-2)*1.15+(row?0.55:0);p.position.set(x,0,2.0+row*1.2);p.rotation.y=Math.PI+(r()-0.5)*0.2;scene.add(p);const b=bub(p,'네에…',{y:2.05,size:0.0024,fs:68});fr.push({p,b,i})});
  const labs=[['집 짓는 팀',-1.25,'#ffe0a8'],['불 피우는 팀',1.25,'#ffc2b0'],['구조 신호 팀',0,'#cfe3ff']].map(([tx,x,bg],i)=>{const s=labelSprite(tx,{bg,fg:'#2b2b3a',fs:66,size:0.0040});s.position.set(x,i===2?4.1:3.4,-2.2);scene.add(s);scaleBubble(s,0);return s});
  // 컷 뒤: 부감 — 팀별로 둥글게 누워 있음
  const top=new THREE.Group();top.visible=false;scene.add(top);
  const groups=[[-1.7,-2.6,'집 짓는 팀','#ffe0a8'],[1.8,0.3,'불 피우는 팀','#ffc2b0'],[-1.5,3.1,'구조 신호 팀','#cfe3ff'],[2.0,5.0,null]];
  const tops=[];const zz=[];
  groups.forEach(([gx,gz,tx,bg],gi)=>{const n=gi===3?4:5;const ps=crowd(rng(700+gi),n);ps.forEach((p,i)=>{const a=i/n*Math.PI*2+gi;const w=lie(p,gx+Math.cos(a)*1.2,gz+Math.sin(a)*1.2,-a+Math.PI/2+(r()-0.5)*0.6,{star:(i+gi)%2===0,arms:(i+gi)%3===0?'head':null});top.add(w);
      if(i%2===0){const z=textSprite('Zz',70,'#ffffff',0.006);z.position.set(gx+Math.cos(a)*1.2,0.9,gz+Math.sin(a)*1.2);top.add(z);zz.push({z,ph:r(),y0:0.9})}});
    if(tx){const s=labelSprite(tx,{bg,fg:'#2b2b3a',fs:66,size:0.0072});s.position.set(gx,2.2,gz);top.add(s);tops.push(s)}});
  const mats=[];for(let i=0;i<4;i++){const towel=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.02,2.0),lamb([0xff9fb8,0x9fd8ff,0xffe08a,0xb8f0c8][i]));towel.position.set([-2.6,2.9,0.4,-2.9][i],0.01,[5.6,-2.8,1.4,0.4][i]);towel.rotation.y=0.3*i;top.add(towel)}
  const l2=ln(1,'l2'),c1=ln(1,'c1'),CUT=TM.cut1;
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,300);
  return t=>{B.upd(t);
    const u=L.userData;standPose(L);
    const d=l2.t1-l2.t0;const seg=[l2.t0,l2.t0+d*0.24,l2.t0+d*0.48,l2.t0+d*0.66];
    // 왼쪽 → 오른쪽 → 위(가운데) → 양팔 '흩어져!'
    let ax0=0,az0=0,ax1=0,az1=0;
    if(t>seg[0]&&t<seg[1]){ax0=-1.0;az0=-0.6}
    else if(t>=seg[1]&&t<seg[2]){ax1=-1.0;az1=0.6}
    else if(t>=seg[2]&&t<seg[3]){ax1=-1.5;az1=0.2}
    else if(t>=seg[3]&&t<CUT){ax0=-0.5;az0=-0.55;ax1=-0.5;az1=0.55}
    u.arms[0].rotation.set(ax0,0,az0);u.arms[1].rotation.set(ax1,0,az1);u.mouth.visible=t>l2.t0&&t<l2.t1&&Math.sin(t*22)>0;
    labs.forEach((s,i)=>scaleBubble(s,pop((t-seg[i]-0.05)/0.3)));
    fr.forEach(q=>{const k=ease((t-c1.t0+0.05-q.i*0.03)/0.4)*0.45;standPose(q.p);if(k>0)armUp(q.p,1,k);showB(q.b,t,c1.t0+q.i*0.04)});
    const after=t>=CUT;top.visible=after;[L,...front].forEach(p=>p.visible=!after);labs.forEach(s=>s.visible=s.visible&&!after);
    if(!after){cam.fov=42;cam.position.set(0,4.4,8.6);cam.lookAt(0,1.7,-1.6)}
    else{const k=ease((t-CUT)/3);cam.fov=46;cam.position.set(0,15-k*1.2,7.5);cam.lookAt(0,0,1.0);
      tops.forEach((s,i)=>scaleBubble(s,pop((t-CUT-0.15-i*0.12)/0.3)));zz.forEach(q=>{const lt=((t*0.6)+q.ph)%1;q.z.position.y=q.y0+lt*0.8;const s=Math.sin(lt*Math.PI);q.z.scale.set(q.z.userData.base[0]*s,q.z.userData.base[1]*s,1)})}
    cam.updateProjectionMatrix();
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- S2 SOS 대신 S 하나 꾸미기 → 감성 해먹 ----------
S[2]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(721);const B=beach(scene,r,{shore:-4});
  // A: 모래 위 S
  const A=new THREE.Group();scene.add(A);
  const pts=[[0.9,0.9],[0.2,1.2],[-0.6,0.9],[-0.7,0.3],[0,0],[0.7,-0.3],[0.6,-0.9],[-0.2,-1.2],[-0.9,-0.9]].map(([x,z])=>new THREE.Vector3(x,0.0,z));
  const curve=new THREE.CatmullRomCurve3(pts);const groove=new THREE.Mesh(new THREE.TubeGeometry(curve,60,0.1,8,false),lamb(0xc9ad7a));groove.scale.y=0.25;A.add(groove);
  const decos=[];const along=[0.02,0.2,0.38,0.55,0.72,0.9];
  along.forEach((u,i)=>{const p=curve.getPoint(u);const tg=curve.getTangent(u);const nx=-tg.z,nz=tg.x;const side=i%2?1:-1;
    const d=i%2?shell(scene,0,0,[0xffb3c6,0xfff0b3,0xb3e6ff][i%3],1.6):flower(scene,0,0,[0xff8fb3,0xffb84d,0xc79bff][i%3],1.5);A.add(d);d.position.set(p.x+nx*0.32*side,0.05,p.z+nz*0.32*side);decos.push(d)});
  const extra=[];for(let i=0;i<10;i++){const u=i/9;const p=curve.getPoint(u);const tg=curve.getTangent(u);const f=flower(scene,0,0,[0xff8fb3,0xffd166,0xffffff][i%3],0.8);A.add(f);f.position.set(p.x-tg.z*0.32*(i%2?-1:1)*1.3,0.03,p.z+tg.x*0.32*(i%2?-1:1)*1.3);extra.push(f)}
  const dec=makePerson(r,{shirt:0xc7a3c9});dec.position.set(0.95,0,-0.55);dec.rotation.y=-1.3;sitPose(dec);dec.userData.hip.position.y=0.42;A.add(dec);
  const db=bub(dec,'예쁘다…',{y:2.0,size:0.0024});
  const sTag=labelSprite('구조 신호',{bg:'#cfe3ff',fg:'#2b2b3a',fs:60,size:0.0045});sTag.position.set(-0.2,0.6,2.0);
  // B: 해먹
  const Bg=new THREE.Group();Bg.position.set(30,0,0);scene.add(Bg);
  const p1=palm(scene,0,0,1.25,-0.15,0);Bg.add(p1);p1.position.set(-1.9,0,0);const p2=palm(scene,0,0,1.25,0.15,Math.PI);Bg.add(p2);p2.position.set(1.9,0,0);
  const hm=new THREE.Group();hm.position.set(0,1.55,0);Bg.add(hm);
  const net=new THREE.Mesh(new THREE.SphereGeometry(1,32,12,0,Math.PI*2,Math.PI*0.62,Math.PI*0.38),new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide,map:canvasTex(256,256,(x,w,h)=>{const c=['#ff9fb8','#ffe08a','#9fd8ff','#b8f0c8'];for(let i=0;i<8;i++){x.fillStyle=c[i%4];x.fillRect(i*32,0,32,h)}})}));
  net.scale.set(1.55,0.9,0.75);net.position.y=0.6;hm.add(net);
  for(const s of[-1,1]){const rope=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.75,5),lamb(0xd9c39a));rope.position.set(s*1.62,0.82,0);rope.rotation.z=s*0.75;hm.add(rope)}
  const hp=makePerson(r,{shirt:0x8cc9a0});const hw=lie(hp,0,0,Math.PI/2,{arms:'head'});hw.position.set(0,0.0,0);hm.add(hw);
  const lei=new THREE.Group();for(let i=0;i<10;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.045,8,6),lamb([0xff8fb3,0xffd166,0xffffff][i%3]));f.position.set(Math.cos(i/10*Math.PI*2)*0.2,Math.sin(i/10*Math.PI*2)*0.2,0);lei.add(f)}
  lei.position.set(0,0.63,0.17);hp.userData.hip.add(lei);
  for(let i=0;i<7;i++){const f=flower(scene,0,0,[0xff8fb3,0xffd166,0xc79bff][i%3],1.3);Bg.add(f);f.position.set(-1.6+i*0.55,0.0,0.9+Math.sin(i)*0.3)}
  const hb=labelSprite('완벽한 집',{bg:'#ffe0a8',fg:'#2b2b3a',fs:66,size:0.0055});hb.position.set(0,3.6,0);Bg.add(hb);
  const sp=sprk(scene,10,r,{x:30,y:2.4,z:0.4,w:3.2,h:1.6,col:'#fffbd8',size:0.004});
  const ck=chip('');const CUT=2.75;
  const cam=new THREE.PerspectiveCamera(40,W/H,0.1,200);
  return t=>{B.upd(t);
    if(t<CUT){decos.forEach((d,i)=>{const k=pop((t-0.65-i*0.35)/0.25);d.scale.setScalar(k*2.3);d.visible=k>0.01});extra.forEach((f,i)=>{const k=pop((t-1.0-i*0.12)/0.25);f.scale.setScalar(0.8*k);f.visible=k>0.01});
      const u=dec.userData;u.arms[1].rotation.x=-1.0-Math.max(0,Math.sin(t*6))*0.5;u.head.rotation.x=0.35;showB(db,t,1.6);
      cam.fov=40;cam.position.set(0.3,3.9,3.9-t*0.12);cam.lookAt(0.2,0.2,0.0);ck.textContent='구조 신호 팀';}
    else{const lt=t-CUT;hm.rotation.x=Math.sin(lt*1.6)*0.12;scaleBubble(hb,pop((lt-0.3)/0.3));updSprk(sp,t,CUT+0.3);
      cam.fov=40;cam.position.set(30+Math.sin(lt*0.3)*0.4,4.6,9.6-lt*0.3);cam.lookAt(30,1.9,0);ck.textContent='집 짓는 팀';}
    cam.updateProjectionMatrix();chipPop(ck,t<CUT?t:t-CUT,0.05);
    caption(2,t);renderer.render(scene,cam);
  };
};

// ---------- S3 배터리 1% → 119! → 경치 사진 → 업로드 → 꺼짐 ----------
function scenery(cv,k){const x=cv.getContext('2d');const w=cv.width,h=cv.height;
  const g=x.createLinearGradient(0,0,0,h*0.55);g.addColorStop(0,'#7fc6ef');g.addColorStop(1,'#d6f3f8');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#ffffff';for(const [cx,cy,s] of [[0.25,0.18,1],[0.7,0.12,0.8]]){for(let i=0;i<4;i++){x.beginPath();x.arc(w*cx+(i-1.5)*30*s,h*cy+Math.sin(i)*8,26*s,0,7);x.fill()}}
  x.fillStyle='#4fb9c8';x.fillRect(0,h*0.5,w,h*0.2);x.fillStyle='#63cdd2';x.fillRect(0,h*0.6,w,h*0.12);
  x.fillStyle='#7a9a6a';x.beginPath();x.ellipse(w*0.72,h*0.5,w*0.16,h*0.05,0,Math.PI,0);x.fill();
  x.fillStyle='#f3deb0';x.beginPath();x.moveTo(0,h);x.lineTo(0,h*0.72);x.quadraticCurveTo(w*0.5,h*0.66,w,h*0.75);x.lineTo(w,h);x.fill();
  x.fillStyle='#fff';x.fillRect(0,h*0.705,w,6);
  // 야자수 실루엣
  x.strokeStyle='#86643f';x.lineWidth=16;x.beginPath();x.moveTo(w*0.15,h*0.95);x.quadraticCurveTo(w*0.1,h*0.6,w*0.2,h*0.38);x.stroke();
  x.fillStyle='#4ba05c';for(let i=0;i<7;i++){x.save();x.translate(w*0.2,h*0.38);x.rotate(-2.6+i*0.75);x.beginPath();x.ellipse(70,0,72,16,0,0,7);x.fill();x.restore()}
}
S[3]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(833);const B=beach(scene,r,{shore:-2.6});
  palm(scene,-3.6,0.6,1.3,0.3,0.5);palm(scene,-4.6,-1.2,1.2,0.2,1.6);rock(scene,2.9,-1.6,0.7);
  // 출발 지점 팻말
  const post=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.1,0.08),lamb(0x8a6846));post.position.set(2.0,0.55,0.0);scene.add(post);
  const sign=labelSprite('출발 지점',{bg:'#f2d9a8',fg:'#5a3a1a',fs:60,size:0.0036});sign.position.set(2.0,1.25,0.0);scene.add(sign);
  // 뗏목
  const raft=new THREE.Group();scene.add(raft);const TOP=0.32;
  for(let i=0;i<9;i++){const lg=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,3.0,8),lamb(i%2?0x9a7652:0x8a6846));lg.rotation.x=Math.PI/2;lg.position.set(-1.4+i*0.35,0.16,0);raft.add(lg)}
  for(const z of[-1.15,1.15]){const rp=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.06,0.12),lamb(0xd9c39a));rp.position.set(0,0.33,z);raft.add(rp)}
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.06,2.4,6),lamb(0x6b4a2f));mast.position.set(1.25,1.4,-1.2);raft.add(mast);
  const sail=new THREE.Mesh(new THREE.ConeGeometry(0.7,1.5,4),new THREE.MeshLambertMaterial({color:0x5fb36a,side:THREE.DoubleSide}));sail.scale.z=0.12;sail.position.set(0.75,1.75,-1.2);sail.rotation.z=-0.15;raft.add(sail);
  const flag=labelSprite('탈출호',{bg:'#ffe08a',fg:'#2b2b3a',fs:60,size:0.0036});flag.position.set(1.25,2.85,-1.2);raft.add(flag);
  // 리더(뗏목 위) + 미는 사람들(뗏목 뒤 모래)
  const L=makeHero({shirt:0x7fb7c9,pants:0x55506a});const Lg=new THREE.Group();Lg.position.y=TOP;raft.add(Lg);Lg.add(L);
  const ps=crowd(r,4);const riders=[{p:L,g:Lg,sx:0,hx:0,hz:0.2}];
  const xs=[-1.05,-0.52,0.52,1.05];
  ps.forEach((p,i)=>{const g=new THREE.Group();raft.add(g);g.add(p);riders.push({p,g,sx:xs[i]*1.15,hx:xs[i],hz:1.85,b:bub(p,'네에…',{y:2.05,size:0.0024,fs:68})})});
  const zz=riders.map(q=>{const z=textSprite('Zz',70,'#ffffff',0.005);raft.add(z);return z});
  const l3=ln(3,'l3'),c1=ln(3,'c1b'),n4=ln(3,'n4');const TP=c1.t1+0.35,TL=n4.t1+0.4;
  const ck=chip('탈출 시도 1회차');
  const cam=new THREE.PerspectiveCamera(44,W/H,0.1,300);
  return t=>{B.upd(t);
    // 뗏목 위치: 모래 → 바다(-5) → 밀려서 해변(-2.3) 복귀
    const pk=ease((t-TP)/1.2);const back=ease((t-(n4.t0-0.2))/(TL-n4.t0+0.2));
    let rz=0-4.8*pk;rz=rz+(2.4)*back;const onW=pk>0.4&&t<TL;
    raft.position.set(0,onW?-0.08+Math.sin(t*2.2)*0.04:0,rz);raft.rotation.set(onW?Math.sin(t*1.7)*0.04:0,0,onW?Math.sin(t*2.1)*0.05:0);
    if(t>TL){const j=Math.max(0,1-(t-TL)/0.25);raft.position.z+=Math.sin((t-TL)*30)*0.05*j}
    riders.forEach((q,i)=>{const p=q.p;
      // 미는 사람: 뗏목 뒤에서 걷다가(0.0~0.9) 올라탐(0.9~1.25)
      let y=0,x=q.hx,z=q.hz;
      if(i>0){const hop=ease((t-TP-0.9-i*0.06)/0.35);x=q.hx+(q.sx-q.hx)*hop;z=q.hz+(1.15-q.hz)*hop;y=TOP*hop+Math.sin(hop*Math.PI)*0.45}
      else{x=0;z=0.2;y=0}
      q.g.position.set(0,i===0?TOP:0,0);
      const lk=1-ease((t-(TP+1.4+(i===0?0.7:i*0.18)))/0.4); // 1 서 있음 → 0 누움
      const lx=i===0?0:q.sx,lz=i===0?1.15:1.15;
      if(lk<1){riseK(p,i===0?0:lx,lz,lk,0);p.position.y+=(i===0?0:TOP)}
      else{p.rotation.set(0,0,0);p.position.set(x,y,z);}
      standPose(p);
      if(i===0&&t>l3.t0&&t<TP){p.userData.arms[1].rotation.x=-1.0;p.userData.arms[1].rotation.z=0.15;p.userData.mouth.visible=t<l3.t1&&Math.sin(t*22)>0}
      if(i>0){const push=t>TP&&t<TP+0.95;if(push){walkPose(p,t*12,0.6);p.userData.arms.forEach(a=>a.rotation.x=-1.4)}
        if(t>c1.t0-0.05&&t<TP){armUp(p,1,0.45*ease((t-c1.t0+0.05)/0.4))}
        p.rotation.y=lk<1?0:Math.PI;if(lk>=1)p.rotation.y=Math.PI;showB(q.b,t,c1.t0+i*0.03,TP)}
      const z0=zz[i];const on=lk<0.2;z0.visible=on;const lt=((t*0.6)+i*0.23)%1;z0.position.set((i===0?0:lx)+0.2,0.9+lt*0.7,0.6);const sk=Math.sin(lt*Math.PI)*(on?1:0);z0.scale.set(z0.userData.base[0]*sk,z0.userData.base[1]*sk,1)});
    const fz=raft.position.z;cam.fov=46;cam.position.set(5.2,7.0,6.0+fz*0.5);cam.lookAt(-0.2,0.5,fz*0.8-0.4);
    chipPop(ck,t,0.05);ck.innerHTML=t>TL+0.15?'탈출 시도 1회차 · <b>원위치</b>':'탈출 시도 1회차';
    caption(3,t);renderer.render(scene,cam);
  };
};

// ---------- S4 무인도 3일째: 꼬질꼬질 → 비행기 지나가는데 손가락만 까딱 ----------
S[4]=()=>{
  sky('#6fbfee','#c4ecf7','#eafaf8');
  const scene=IS();const r=rng(941);const B=beach(scene,r,{shore:-9});
  const ps=[makeHero({shirt:0xd98c8c,pants:0x55506a}),makeHero({shirt:0x8cc9a0,pants:0x3d3a36}),makeHero({shirt:0xa58cd0,pants:0x2c4058})];
  const ws=ps.map((p,i)=>{const w=lie(p,(i-1)*0.78,0,0,{});scene.add(w);const tw=new THREE.Mesh(new THREE.BoxGeometry(0.66,0.03,2.0),lamb([0xff9fb8,0x9fd8ff,0xffe08a][i]));tw.position.set((i-1)*0.78,0.015,0.1);scene.add(tw);messy(p);eyesK(p,0.35);return w});
  const flagTex=canvasTex(256,180,(x,w,h)=>{x.fillStyle='#ffffff';x.fillRect(0,0,w,h);x.fillStyle='#e2335a';x.font=`900 92px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('SOS',w/2,h/2+6)});
  const fingers=ps.map(p=>{const g=new THREE.Group();g.position.set(0,-0.62,0.02);p.userData.arms[1].add(g);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.75,6),lamb(0x8a6846));st.rotation.x=Math.PI/2;st.position.z=0.33;g.add(st);
    const cl=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.24),new THREE.MeshLambertMaterial({map:flagTex,side:THREE.DoubleSide}));cl.rotation.x=Math.PI/2;cl.position.set(0.18,0,0.58);g.add(cl);
    return g});
  const kk=ps.map(p=>bub(p,'(휘적휘적)',{x:0.0,y:0.4,z:1.0,size:0.0024,fs:60}));for(let i=0;i<8;i++)shell(scene,-1.6+i*0.45,1.4+Math.sin(i*2)*0.3,[0xffb3c6,0xfff0b3,0xb3e6ff][i%3],1.3);
  palm(scene,-3.4,-1.5,1.4,0.35,0.8);palm(scene,3.2,-2.2,1.3,-0.3,2.2);
  const pl=plane();scene.add(pl);const cl=[cloud(scene,-6,9,-14,1.2),cloud(scene,5,11,-18,1.4)];
  const ck=chip('무인도 3일째');const CUT=1.7;
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,300);
  return t=>{B.upd(t);
    // 손가락 까딱(팔이 아주 살짝만 들림)
    ps.forEach((p,i)=>{const t0=2.3+i*0.2;const on=t>t0;const a=p.userData.arms[1];a.rotation.x=-0.25*ease((t-t0)/0.3);fingers[i].rotation.y=on?Math.sin((t-t0)*(5+i*1.3)+i)*0.55*ease((t-t0)/0.3):0;showB(kk[i],t,t0+0.05)});
    const pt=(t-1.6)/3.4;pl.position.set(-12+pt*24,7.2,-10);pl.rotation.y=0;pl.visible=t>1.6;pl.userData.trail.scale.y=8;pl.userData.trail.position.x=-5.5;
    if(t<CUT){cam.fov=40;cam.position.set(0,3.2,2.6);cam.lookAt(0,0.1,-0.35);}
    else{cam.fov=56;cam.position.set(0,2.3,4.6);cam.lookAt(0,2.5,-1.5)}
    cam.updateProjectionMatrix();chipPop(ck,t,0.05);
    caption(4,t);renderer.render(scene,cam);
  };
};

// ---------- S5 (제품) 떠밀려온 가방 → 라곰 클렌저 → 빗물 세수 → "…살 것 같다." ----------
S[5]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(1051);const B=beach(scene,r,{shore:-2.2});
  palm(scene,-3.6,-0.6,1.35,0.3,0.4);palm(scene,3.8,0.2,1.3,-0.3,2.4);rock(scene,3.0,-1.0,0.8);
  const sc=suitcase();scene.add(sc);
  const tube=makeTube();tube.scale.setScalar(0.27);scene.add(tube);const kl=new THREE.PointLight(0xffffff,0.9,1.0,1.6);scene.add(kl);
  // 가방 속 잡동사니
  const hat=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.03,24),lamb(0xe8d29a));hat.add(b);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.2,0.16,20),lamb(0xe8d29a));c.position.y=0.09;hat.add(c);const bd=new THREE.Mesh(new THREE.CylinderGeometry(0.205,0.205,0.04,20),lamb(0xe2557a));bd.position.y=0.04;hat.add(bd)}
  const duck=new THREE.Group();{const b=new THREE.Mesh(new THREE.SphereGeometry(0.14,16,12),smooth(0xffd84d));b.scale.set(1.2,0.85,1);duck.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(0.09,16,12),smooth(0xffd84d));h.position.set(0.12,0.13,0);duck.add(h);const bk=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.08,8),lamb(0xff8a3c));bk.rotation.z=-Math.PI/2;bk.position.set(0.22,0.12,0);duck.add(bk);for(const z of[-0.045,0.045]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.013,8,6),basic(0x1a1a1a));e.position.set(0.17,0.16,z);duck.add(e)}}
  const uke=new THREE.Group();{for(const [y,r_] of [[0,0.13],[0.15,0.1]]){const b=new THREE.Mesh(new THREE.CylinderGeometry(r_,r_,0.06,20),lamb(0xc98a4a));b.rotation.x=Math.PI/2;b.position.y=y;uke.add(b)}const hole=new THREE.Mesh(new THREE.CircleGeometry(0.035,12),basic(0x4a2a14));hole.position.set(0,0.06,0.031);uke.add(hole);const nk=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.32,0.03),lamb(0x7a5230));nk.position.y=0.38;uke.add(nk)}
  const ball=new THREE.Mesh(new THREE.SphereGeometry(0.13,20,14),new THREE.MeshLambertMaterial({map:canvasTex(256,128,(x,w,h)=>{const c=['#ff6b6b','#ffffff','#4fb9ff','#ffffff','#ffd84d','#ffffff'];for(let k=0;k<6;k++){x.fillStyle=c[k];x.fillRect(k*w/6,0,w/6,h)}})}));
  const book=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.06,0.34),lamb(0x7fb7c9));
  const glass=new THREE.Group();for(const x of[-0.07,0.07]){const g=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.07,0.02),lamb(0x22222a));g.position.x=x;glass.add(g)}
  const towel=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.08,0.26),lamb(0xff9fb8));
  const items=[[hat,0.33,0.33,-0.12],[duck,-0.3,0.4,0.12],[uke,-0.22,0.36,-0.18],[ball,0.36,0.43,0.2],[book,0.02,0.33,0.24],[glass,0.12,0.34,-0.27],[towel,-0.45,0.34,0.05]];
  items.forEach(([o,x,y,z])=>{scene.add(o);o.position.set(x,y,z);o.userData.home=new THREE.Vector3(x,y,z);o.visible=false});uke.rotation.set(-Math.PI/2,0,0.4);
  // 주변에 누운 셋(모자·오리·우쿨렐레) + 클렌저 고르는 주인공(가방 뒤)
  const pA=makePerson(r,{shirt:0x8cc9a0}),pB=makePerson(r,{shirt:0xc7a3c9}),pC=makePerson(r,{shirt:0xe0c070});
  const wA=lie(pA,1.0,-0.45,0,{}),wB=lie(pB,-0.75,1.55,0,{}),wC=lie(pC,0.8,1.55,0,{});[wA,wB,wC].forEach(w=>scene.add(w));
  const H0=makeHero({shirt:0xd98c8c,pants:0x55506a});H0.position.set(-0.85,0,-0.8);H0.rotation.y=0.55;scene.add(H0);messy(H0);eyesK(H0,0.35);
  scene.updateMatrixWorld(true);const wp=o=>o.getWorldPosition(new THREE.Vector3());
  const hA=wp(pA.userData.head).add(new THREE.Vector3(0,0.3,0)),hB=wp(pB.userData.hip).add(new THREE.Vector3(0,0.25,0)),hC=wp(pC.userData.hip).add(new THREE.Vector3(0,0.28,0));
  const bA=bub(pA,'완벽해',{y:0,size:0.0028,fs:64});pA.remove(bA);scene.add(bA);bA.position.copy(hA).add(new THREE.Vector3(-0.1,0.45,0));
  const bB=bub(pB,'귀여워…',{y:0,size:0.0028,fs:64});pB.remove(bB);scene.add(bB);bB.position.copy(hB).add(new THREE.Vector3(0.15,0.5,0));
  const bC=bub(pC,'띵~',{y:0,size:0.0028,fs:64});pC.remove(bC);scene.add(bC);bC.position.copy(hC).add(new THREE.Vector3(-0.1,0.55,0));
  const bH=bub(H0,'음…',{y:2.1,size:0.0028,fs:64});
  const fly=(o,t,t0,to,rot)=>{const k=ease((t-t0)/0.35);o.position.lerpVectors(o.userData.home,to,k);o.position.y+=Math.sin(k*Math.PI)*0.6;if(rot)o.rotation.y=k*rot};
  // 세안 파트(별도 공간, x=40)
  const HR=makeHero({shirt:0xd98c8c,pants:0x55506a});HR.position.set(40,0,0);scene.add(HR);const M=messy(HR);eyesK(HR,0.35);
  const rk2=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.34,0.86,12),lamb(0x9a7652));rk2.scale.set(1,1.15,1);rk2.position.set(39.58,0.495,1.85);scene.add(rk2);const rkTop=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.02,12),lamb(0xd9b98a));rkTop.position.set(39.58,0.995,1.85);scene.add(rkTop);
  const tube2=makeTube();tube2.scale.setScalar(0.3);tube2.position.set(39.58,1.0,1.85);scene.add(tube2);// 참고 이미지처럼: 밝게 날리지 않는 연회색 튜브 + 진한 글씨
  tube2.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial){o.material=o.material.clone();o.material.color=new THREE.Color(0xcfcfcc);o.material.emissive=new THREE.Color(0x101010);o.material.roughness=0.75}});
  const kl2=new THREE.PointLight(0xffffff,0.0,1.4,1.6);kl2.position.set(39.25,1.6,2.5);scene.add(kl2);
  const leaf=new THREE.Mesh(new THREE.ConeGeometry(0.5,2.2,4),lamb(0x4ba05c));leaf.scale.z=0.2;leaf.rotation.set(0,0,-1.35);leaf.position.set(40.95,2.75,0.4);scene.add(leaf);
  const p3=palm(scene,41.9,-1.2,1.35,-0.3,2.0);
  const drops=[];for(let i=0;i<14;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.013,8,6),basic(0x8fd0ee));d.scale.y=1.8;scene.add(d);drops.push({d,ph:i/14,x:40.0+(r()-0.5)*0.1})}
  const fh=makeFoam(r,140,0.16,{min:0.014,max:0.034,sy:0.6});scene.add(fh);
  const u=HR.userData;const ff=[];for(const [x,y,z,rad,n] of [[-0.12,0.2,0.2,0.09,60],[0.12,0.2,0.2,0.09,60],[0,0.36,0.2,0.08,50],[0,0.08,0.22,0.07,40],[0,0.24,0.25,0.05,25]]){const f=makeFoam(r,n,rad,{min:0.012,max:0.028});f.position.set(x,y,z);u.head.add(f);ff.push(f)}
  const spl=[];for(let i=0;i<16;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.025,8,6),basic(0xa9dcf2));scene.add(d);spl.push({d,vx:(r()-0.5)*1.6,vy:0.5+r()*1.2,vz:0.4+r()*0.6})}
  const sp2=sprk(scene,9,r,{x:40,y:2.15,z:0.3,w:0.9,h:0.6,col:'#fffbd8',size:0.0013});
  const j1=ln(5,'j1');const CUT=4.2;
  const ck=chip('무인도 3일째');
  const cam=new THREE.PerspectiveCamera(40,W/H,0.1,200);
  return t=>{B.upd(t);
    if(t<CUT){
      // 가방: 굴러와 착지(0.7) → 1.45 열림 → 잡동사니를 하나씩 집어 감 → 주인공은 클렌저를 고름
      const k=ease(t/0.7);sc.position.set(0,Math.max(0,Math.sin(Math.min(t/0.7,1)*Math.PI)*0.3)-0.02*(1-k),-3.4+3.4*k);sc.rotation.set(0,(1-k)*1.2,(1-k)*0.8);
      const lk=ease((t-1.4)/0.35);sc.userData.lid.rotation.x=-1.9*lk;
      const open=t>1.5;items.forEach(([o])=>o.visible=open);tube.visible=open;
      [pA,pB,pC].forEach((p,i)=>{p.userData.head.rotation.x=-0.7*ease((t-1.7-i*0.08)/0.25)*(1-ease((t-2.3-i*0.35)/0.3))});
      fly(hat,t,2.0,hA,0);if(t>2.35){hat.rotation.set(0,0,0)}
      fly(duck,t,2.35,hB,0);fly(uke,t,2.7,hC,0);if(t>3.05){uke.rotation.set(-Math.PI/2,0,0.4+Math.sin(t*20)*0.04);pC.userData.arms[1].rotation.x=-0.6+Math.sin(t*18)*0.25}
      showB(bA,t,2.45);showB(bB,t,2.8);showB(bC,t,3.1);
      // 주인공: 가방 뒤에서 잡동사니 보다가(음…) 클렌저 집어 들기
      standPose(H0);const u0=H0.userData;u0.head.rotation.x=0.35*(1-ease((t-3.6)/0.3));showB(bH,t,3.0,3.5);
      const reach=ease((t-3.15)/0.25)*(1-ease((t-3.45)/0.25)*0.35);u0.arms[1].rotation.x=-1.3*reach;u0.arms[1].rotation.z=0.25*reach;
      const tk=ease((t-3.4)/0.3);const hand=wp(u0.arms[1].children[1]);
      const homeT=new THREE.Vector3(0.08,0.29,0.02);tube.position.lerpVectors(homeT,hand.clone().add(new THREE.Vector3(0,-0.12,0.1)),tk);tube.rotation.set(0,0,0);
      kl.position.copy(tube.position).add(new THREE.Vector3(-0.3,0.45,0.7));kl.visible=open;
      cam.fov=46;const ck2=ease((t-1.2)/1.2);cam.position.set(0.5,4.8-ck2*0.4,6.6-ck2*0.6);cam.lookAt(0,0.3,0.15);
      fh.visible=false;
    }else{
      const lt=t-CUT;
      // 세안: 0.15 손 모으기 → 0.5 펌프 → 0.75 거품 → 1.55 얼굴 거품 → 2.25 헹굼(물 튐) → 깨끗
      const C2=1.55,R=2.25;
      const hu=ease((lt-0.05)/0.35);u.arms.forEach((a,i)=>{a.rotation.x=-1.5*hu-(lt>=C2&&lt<R?0.45+Math.sin(lt*14+i)*0.12:0);a.rotation.z=(i?-0.42:0.42)*hu});
      const press=lt>0.45&&lt<0.7?Math.sin((lt-0.45)/0.25*Math.PI):0;tube2.scale.set(0.3*(1+press*0.06),0.3*(1-press*0.05),0.3);
      fh.visible=lt<C2+0.3;fh.position.set(40,1.62,0.42);foamK(fh,lt<C2?clamp01((lt-0.75)/0.7):1-clamp01((lt-C2)/0.3));
      const fk=lt<C2?0:lt<R?clamp01((lt-C2)/0.5):1-clamp01((lt-R)/0.15);ff.forEach(f=>foamK(f,fk));
      const clean=lt>R+0.05;M.hair.visible=!clean;M.dirt.visible=!clean;
      eyesK(HR,lt<C2?0.35:lt<R?0.12:1);u.mouth.visible=false;u.smile.visible=lt>j1.t0-CUT+0.3;blush(HR,clean?1.5:1);
      drops.forEach(q=>{const k=((lt*2.2+q.ph)%1);q.d.visible=lt<C2;q.d.position.set(q.x+0.42-k*0.37,2.6-k*0.95,0.6)});
      spl.forEach(q=>{const s=lt-R;q.d.visible=s>0&&s<0.8;q.d.position.set(40+q.vx*s,2.15+q.vy*s-3*s*s,0.3+q.vz*s)});
      updSprk(sp2,lt,R+0.4);
      const ck3=ease(lt/4);cam.fov=40;cam.position.set(39.82,1.9,4.05-ck3*0.08);cam.lookAt(39.8,1.15,0);
    }
    cam.updateProjectionMatrix();chipPop(ck,t,0.05);ck.style.display=t<2.0||t>CUT?'block':'none';
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6 의욕 충전 → SOS 완성·불 → 헬기 → "모두 무사하십니까!" ----------
S[6]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(1161);const B=beach(scene,r,{shore:-7});
  palm(scene,-5,-4,1.4,0.3,0.4);palm(scene,5.4,-3,1.3,-0.3,2.2);palm(scene,-6,2,1.2,0.2,1);
  const HR=makeHero({shirt:0xd98c8c,pants:0x55506a});scene.add(HR);
  // SOS 통나무 글자
  const logM=lamb(0x8a6846);const letters=[];
  const mkS=(cx)=>{const g=new THREE.Group();const c=new THREE.CatmullRomCurve3([[0.6,-0.9],[-0.2,-1.0],[-0.6,-0.5],[0,0],[0.6,0.5],[0.2,1.0],[-0.6,0.9]].map(([x,z])=>new THREE.Vector3(x,0.08,z)));g.add(new THREE.Mesh(new THREE.TubeGeometry(c,40,0.1,6,false),logM));g.position.set(cx,0,0.8);return g};
  const mkO=(cx)=>{const g=new THREE.Group();const o=new THREE.Mesh(new THREE.TorusGeometry(0.75,0.1,6,24),logM);o.rotation.x=Math.PI/2;o.scale.y=1.3;o.position.y=0.08;g.add(o);g.position.set(cx,0,0.8);return g};
  [mkS(-2.0),mkO(0),mkS(2.0)].forEach(g=>{scene.add(g);letters.push(g)});
  const F=fireMake(scene,2.3,-0.9);
  const bg=crowd(r,8);bg.forEach((p,i)=>{const w=lie(p,-4.5+i*1.3,3.6+(i%2)*0.8,r()*6,{star:i%2===0});scene.add(w);const z=textSprite('Zz',70,'#ffffff',0.005);z.position.set(-4.5+i*1.3,0.9,3.6+(i%2)*0.8);scene.add(z)});
  const hc=heli();hc.scale.setScalar(0.85);scene.add(hc);
  const rs_=[];for(let i=0;i<5;i++){const p=rescuer(rng(1200+i));scene.add(p);rs_.push(p)}
  const kb=bub(rs_[0],'구조대입니다!',{y:2.15,size:0.0034,fs:68,bg:'#ffe0c2',fg:'#7a3a10'});
  ui.insertAdjacentHTML('beforeend','<div class="gauge"><span class="out">의욕 충전</span><i></i></div>');const ga=ui.querySelector('.gauge'),gi=ga.querySelector('i'),gs=ga.querySelector('span');
  const sp=sprk(scene,10,r,{x:0,y:2.1,z:0.4,w:0.9,h:0.6,col:'#fffbd8',size:0.0013});
  const k1=ln(6,'k1');
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,300);
  return t=>{B.upd(t);
    // 0~0.75 얼굴 클로즈업 + 게이지
    const gk=ease((t-0.05)/0.6);gi.style.width=(gk*100)+'%';gs.textContent=`의욕 ${Math.round(gk*100)}%`;ga.style.opacity=t<0.95?1:clamp01(1-(t-0.95)/0.15);
    ga.style.transform=`scale(${pop(t/0.25)})`;
    if(t<0.8){rs_.forEach(p=>p.visible=false);hc.visible=false;HR.position.set(0,0,0);HR.rotation.y=0;standPose(HR);eyesW(HR,1.4);HR.userData.smile.visible=true;updSprk(sp,t,0);
      cam.fov=34;cam.position.set(0,2.1,2.4);cam.lookAt(0,1.9,0);}
    else{updSprk(sp,-1,0);
      // 글자 하나씩 완성하며 달림(0.9~2.0), 불 2.2
      const run=t<2.2;const px=run?-2.2+((t-0.8)/1.4)*4.0:1.8;HR.position.set(px,0,1.9);HR.rotation.y=run?Math.PI/2:Math.PI*0.75;run?walkPose(HR,t*16,0.8):standPose(HR);
      if(!run){HR.userData.arms[1].rotation.x=-2.6;HR.userData.arms[1].rotation.z=0.2+Math.sin(t*10)*0.15}
      letters.forEach((g,i)=>{const k=pop((t-0.95-i*0.38)/0.25);g.scale.setScalar(Math.max(0.001,k))});
      F.upd(t,ease((t-2.2)/0.3));
      // 헬기 2.6~4.6 하강, 4.6~ 대원 뛰어내림
      const hk=ease((t-2.6)/2.0);hc.position.set(5-hk*3.6,9-hk*5.4,-3.2);hc.rotation.set(0,0.25,0.12*(1-hk));hc.userData.rot.rotation.y=t*30;hc.visible=t>2.5;
      rs_.forEach((p,i)=>{const t0=4.55+i*0.12;const s=t-t0;if(s<0){p.visible=false;return}p.visible=true;const k=clamp01(s/0.35);
        p.position.set(1.6+(i-2)*0.55*k-0.2,Math.max(0,2.4*(1-k)+Math.sin(k*Math.PI)*0.4),-2.6+k*1.6+(i%2)*0.4);p.rotation.y=0;standPose(p);if(i===0&&t>k1.t0){armUp(p,1,ease((t-k1.t0)/0.2))}});
      showB(kb,t,k1.t0+0.05);
      const ck=ease((t-0.8)/0.5);const k2=ease((t-4.6)/0.8);
      cam.fov=46;cam.position.set(0.6-k2*0.4,6.2-k2*2.6,11-k2*3.5);cam.lookAt(0.6,1.4+k2*0.8,-0.5);
    }
    cam.updateProjectionMatrix();
    caption(6,t);renderer.render(scene,cam);
  };
};

// ---------- S7 구조대: "헬기 타실래요…?" → ISFP "해먹 한 번만 누워 보실래요…?" → 해먹에 누운 구조대장 "…이거 왜 이렇게 편해요?" → 대원들 줄 서다 눕기 ----------
S[7]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(1271);const B=beach(scene,r,{shore:-5});
  const tm=TM.tm7;
  // 해먹(왼쪽 뒤)
  palm(scene,-2.5,-1.6,1.3,-0.15,0);palm(scene,0.75,-1.6,1.3,0.15,Math.PI);
  const hm=new THREE.Group();hm.position.set(-0.88,1.3,-1.6);scene.add(hm);
  const net=new THREE.Mesh(new THREE.SphereGeometry(1,32,12,0,Math.PI*2,Math.PI*0.62,Math.PI*0.38),new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide,map:canvasTex(256,256,(x,w,h)=>{const c=['#ff9fb8','#ffe08a','#9fd8ff','#b8f0c8'];for(let k=0;k<8;k++){x.fillStyle=c[k%4];x.fillRect(k*32,0,32,h)}})}));
  net.scale.set(1.45,0.85,0.65);net.position.y=0.55;hm.add(net);
  for(const sd of[-1,1]){const rope=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.75,5),lamb(0xd9c39a));rope.position.set(sd*1.52,0.82,0);rope.rotation.z=sd*0.75;hm.add(rope)}
  // 헬기(오른쪽 뒤에 착륙)
  const hc=heli();hc.scale.setScalar(0.7);hc.position.set(2.7,0.85,-3.6);hc.rotation.y=-0.5;scene.add(hc);
  // ISFP 리더(해먹 옆 모래에 누움) + 다른 ISFP들
  const IL=makeHero({shirt:0x7fb7c9,pants:0x55506a});const wIL=lie(IL,-1.35,0.55,0.25,{});scene.add(wIL);
  const isf=crowd(r,3);[[-0.35,1.5,0.1],[1.45,1.8,-0.2],[-1.85,1.9,0.3]].forEach(([x,z,y],i)=>{const w=lie(isf[i],x,z,y,{arms:i===1?'head':null});scene.add(w)});
  const dots=[IL,...isf].map((p,i)=>{const b=bub(p,'…',{y:0,size:0.0022,fs:66});p.remove(b);scene.add(b);p.updateMatrixWorld(true);return b});
  scene.updateMatrixWorld(true);[IL,...isf].forEach((p,i)=>{const v=p.userData.head.getWorldPosition(new THREE.Vector3());dots[i].position.copy(v).add(new THREE.Vector3(0,0.45,0))});
  const ilB=bub(IL,'해먹 어때요…?',{y:0,size:0.0032,fs:64});IL.remove(ilB);scene.add(ilB);ilB.position.copy(dots[0].position).add(new THREE.Vector3(0.3,0.25,0));
  // 구조대 5명
  const rs_=[];for(let i=0;i<5;i++){const p=rescuer(rng(1200+i));scene.add(p);rs_.push(p)}
  const st=[[0.35,0.55],[1.05,0.0],[1.55,0.6],[0.85,1.0],[1.7,-0.5]];
  const Q=[[0.05,-0.75],[0.2,-0.05],[0.35,0.65],[0.5,1.35]]; // 해먹 대기줄(해먹 오른쪽 끝에서 앞으로)
  const r0B=bub(rs_[0],'헬기 타실래요…?',{y:2.15,size:0.0032,fs:64,bg:'#ffe0c2',fg:'#7a3a10'});
  const r0C=bub(rs_[0],'편하다…',{y:0,size:0.0034,fs:64,bg:'#ffe0c2',fg:'#7a3a10'});rs_[0].remove(r0C);scene.add(r0C);r0C.position.set(-0.9,2.6,-1.6);
  const qL=labelSprite('해먹 대기줄',{bg:'#ffe08a',fg:'#2b2b3a',fs:60,size:0.0036});qL.position.set(0.55,2.35,-0.2);scene.add(qL);scaleBubble(qL,0);
  const zz=rs_.map(()=>{const z=textSprite('Zz',70,'#ffffff',0.005);scene.add(z);z.visible=false;return z});
  ui.insertAdjacentHTML('beforeend','<div class="big" style="top:300px">무인도 인구 <b>47</b>명</div>');const big=ui.querySelector('.big'),bn=big.querySelector('b');
  const r1=ln(7,'r1'),l4=ln(7,'l4'),r2=ln(7,'r2'),n5=ln(7,'n5');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  return t=>{B.upd(t);hc.userData.rot.rotation.y=t*2*Math.max(0,1-t/3);
    const sw=t>tm.go+0.75?Math.sin((t-tm.go)*1.8)*0.1:Math.sin(t*1.2)*0.03;hm.rotation.x=sw;
    // ISFP 반응: 조용(…) → 리더가 고개 들고 해먹 가리킴
    dots.forEach((b,i)=>showB(b,t,tm.silent+0.05+i*0.1,l4.t0+0.2));
    const ik=ease((t-l4.t0+0.1)/0.4)*(1-ease((t-tm.go-0.6)/0.4));IL.userData.head.rotation.x=-0.6*ik;IL.userData.arms[0].rotation.x=-1.6*ik;IL.userData.arms[0].rotation.z=-0.7*ik;
    showB(ilB,t,l4.t0+0.3,tm.go+0.3);
    rs_.forEach((p,i)=>{standPose(p);const [sx,sz]=st[i];
      if(i===0){
        const wk=ease((t-tm.go)/0.7);
        if(t<tm.go+0.75){const x=sx+(0.0-sx)*wk,z=sz+(-1.2-sz)*wk;p.rotation.set(0,wk>0&&wk<1?Math.atan2(0.0-sx,-1.2-sz):(t<tm.go?-0.5:Math.PI),0,'YXZ');p.position.set(x,0,z);if(wk>0&&wk<1)walkPose(p,t*12,0.6);
          if(t>r1.t0&&t<tm.go){p.userData.arms[1].rotation.x=-1.4;p.userData.arms[1].rotation.z=0.6;p.userData.head.rotation.y=Math.sin(t*0.8)*0.2}}
        else{const lk=ease((t-tm.go-0.75)/0.25);riseK(p,-0.02,-1.6,1-lk,Math.PI/2);p.position.y+=1.12*lk;p.position.x+=0;
          p.userData.arms.forEach(a=>a.rotation.x=-2.9*lk);}
        showB(r0B,t,r1.t0+0.2,tm.go);showB(r0C,t,r2.t0+0.2);
        return}
      // 대원들: 구경 → 해먹 줄 서기 → 줄 선 채로 하나씩 눕기
      const qk=ease((t-tm.go-1.0-i*0.12)/0.8);const [qx,qz]=Q[i-1];const x=sx+(qx-sx)*qk,z=sz+(qz-sz)*qk;
      const dk=ease((t-tm.down-(i-1)*0.3)/0.35);
      if(dk<=0){p.position.set(x,0,z);p.rotation.set(0,qk>0&&qk<1?Math.atan2(qx-sx,qz-sz):(qk>=1?Math.PI:-0.5),0,'YXZ');if(qk>0&&qk<1)walkPose(p,t*12+i,0.6);p.userData.head.rotation.y=qk>=1?Math.sin(t*1.5+i)*0.3:0}
      else{riseK(p,qx,qz,1-dk,Math.PI*0.08);p.userData.arms.forEach(a=>a.rotation.x=-2.9*dk)}
      const z0=zz[i];z0.visible=dk>0.8;const lt=((t*0.6)+i*0.23)%1;z0.position.set(qx+0.2,0.6+lt*0.7,qz-0.6);const sk=Math.sin(lt*Math.PI);z0.scale.set(z0.userData.base[0]*sk,z0.userData.base[1]*sk,1)});
    {const z0=zz[0];z0.visible=t>r2.t1;const lt=((t*0.6))%1;z0.position.set(-0.6,2.3+lt*0.6,-1.6);const sk=Math.sin(lt*Math.PI);z0.scale.set(z0.userData.base[0]*sk,z0.userData.base[1]*sk,1)}
    scaleBubble(qL,t>tm.go+1.4&&t<tm.down+1.0?pop((t-tm.go-1.4)/0.3):0);
    big.style.opacity=t>n5.t0?1:0;big.style.transform=`translateX(-50%) scale(${pop((t-n5.t0)/0.3)})`;bn.textContent=t>n5.t1?'52':'47';
    if(t>n5.t1){bn.style.display='inline-block';bn.style.transform=`scale(${pop((t-n5.t1)/0.25)})`}
    cam.position.set(0.15,5.6,9.4);cam.lookAt(-0.1,0.9,-1.5);
    caption(7,t);renderer.render(scene,cam);
  };
};

// ---------- S8 쿠키: 구조본부 — 소파에 누운 본부장에게 전화 → 누운 채 받음 → "2차 구조대 보낼까요?" → "…내일 보내자." ----------
{const st=document.createElement('style');st.textContent=`
.call{position:absolute;left:170px;right:170px;top:330px;border-radius:44px;background:rgba(32,34,44,.93);color:#fff;padding:30px 34px;box-shadow:0 24px 60px rgba(20,20,40,.4);text-align:center}
.call .nm{font-size:56px;font-weight:900}.call .st{font-size:36px;color:#b8c0d0;margin-top:6px;font-weight:700}
.call .bt{display:flex;justify-content:center;gap:120px;margin-top:26px}.call .bt i{width:110px;height:110px;border-radius:50%;display:block}
.call .bt .n{background:#ff5a5f}.call .bt .y{background:#34c759}`;document.head.appendChild(st)}
S[8]=()=>{
  bgEl.style.background='linear-gradient(#cfd8e8,#e6ecf5)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,ground:0x9a9aa8,dir:1.2,dpos:[3,6,6]});const r=rng(1381);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xc9c1b4));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(30,8,0.2),lamb(0xdfe6f0));wall.position.set(0,4,-2.4);scene.add(wall);
  const map=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.3),new THREE.MeshLambertMaterial({map:canvasTex(440,260,(x,w,h)=>{x.fillStyle='#bfe3f2';x.fillRect(0,0,w,h);x.fillStyle='#f3deb0';x.beginPath();x.ellipse(w*0.6,h*0.55,40,26,0.3,0,7);x.fill();x.fillStyle='#e2335a';x.beginPath();x.arc(w*0.6,h*0.5,9,0,7);x.fill();x.strokeStyle='#7fa8c0';x.lineWidth=3;x.strokeRect(6,6,w-12,h-12)})}));map.position.set(-0.6,2.1,-2.28);scene.add(map);
  const sofa=new THREE.Group();scene.add(sofa);const seat=new THREE.Mesh(new THREE.BoxGeometry(2.8,0.45,1.0),lamb(0x7a8fb8));seat.position.y=0.3;sofa.add(seat);const back=new THREE.Mesh(new THREE.BoxGeometry(2.8,0.7,0.25),lamb(0x6a7fa8));back.position.set(0,0.75,-0.4);sofa.add(back);
  for(const sd of[-1,1]){const arm=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.6,1.0),lamb(0x6a7fa8));arm.position.set(sd*1.4,0.5,0);sofa.add(arm)}sofa.position.set(0.6,0,-1.2);
  const chief=makeHero({shirt:0x4f74a8,pants:0x3d5a80});const w=lie(chief,0.0,0,-Math.PI/2,{});w.position.set(0.6,0.55,-1.15);scene.add(w);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.28,32,16,0,Math.PI*2,0,Math.PI*0.5),smooth(0x1f2c40));cap.position.y=0.28;chief.userData.head.add(cap);
  const badge=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.08,0.02),lamb(0xffd84d));badge.position.set(0,0.42,0.22);chief.userData.head.add(badge);
  // 스마트폰(오른손)
  const ph=new THREE.Group();const pb=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.2,0.025),lamb(0x22222a));ph.add(pb);const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.09,0.17),basic(0x34c759));scr.position.z=0.014;ph.add(scr);
  ph.position.set(0,-0.66,0.08);chief.userData.arms[1].add(ph);
  const waves=[];for(let i=0;i<3;i++){const s=textSprite(')',90,'#34c759',0.004);scene.add(s);waves.push(s)}
  const callB=bub(chief,'2차 구조대 보낼까요?',{y:0,size:0.0019,fs:58,bg:'#fff1b8',fg:'#5a4300'});chief.remove(callB);scene.add(callB);
  const zz=bub(chief,'…내일 보내자',{y:0,size:0.0024,fs:62});chief.remove(zz);scene.add(zz);
  const Zz=textSprite('Zz',80,'#5a6a8a',0.0024);scene.add(Zz);Zz.visible=false;
  ui.insertAdjacentHTML('beforeend','<div class="call"><div class="nm">구조 2팀</div><div class="st">전화 왔어요</div><div class="bt"><i class="n"></i><i class="y"></i></div></div>');
  const call=ui.querySelector('.call'),cst=call.querySelector('.st'),cbt=call.querySelector('.bt');
  const ck=chip('같은 시각 · 구조본부');
  const y1=ln(8,'y1'),b1=ln(8,'b1');const ANS=1.5,HANG=b1.t1+0.35;
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,100);
  return t=>{
    const u=chief.userData;
    // 울림: 폰이 가슴 위에서 떨림 → 받기(귀로) → 끊기(다시 가슴 위로)
    const up=ease((t-ANS)/0.3)*(1-ease((t-HANG)/0.3));
    u.arms[1].rotation.x=-0.6-1.9*up;u.arms[1].rotation.z=0.25+0.35*up;
    ph.rotation.set(0,0,t<ANS?Math.sin(t*60)*0.12:0);scr.material.color.set(t<HANG?0x34c759:0x22222a);
    scene.updateMatrixWorld(true);const pp=ph.getWorldPosition(new THREE.Vector3());
    waves.forEach((s,i)=>{const on=t<ANS&&t>0.15;const lt=((t*2)+i/3)%1;s.visible=on;s.position.set(pp.x+0.1+lt*0.35,pp.y+0.05+lt*0.1,pp.z+0.05);const k=Math.sin(lt*Math.PI);s.scale.set(s.userData.base[0]*k,s.userData.base[1]*k,1)});
    callB.position.set(pp.x-0.75,pp.y+0.45,pp.z);{const hp=u.head.getWorldPosition(new THREE.Vector3());zz.position.set(hp.x-0.55,hp.y+0.55,hp.z)}showB(callB,t,y1.t0,y1.t1+0.3);showB(zz,t,b1.t0+0.05,HANG+0.6);
    eyesK(chief,t>b1.t0?0.15:(t<ANS?0.15:0.6));
    Zz.visible=t>HANG+0.35;{const hp=u.head.getWorldPosition(new THREE.Vector3());Zz.position.set(hp.x-0.25,hp.y+0.45+((t*0.5)%1)*0.2,hp.z)}
    // 통화 UI
    call.style.transform=`scale(${pop((t-0.15)/0.3)})`;call.style.opacity=t<HANG+0.7?1:Math.max(0,1-(t-HANG-0.7)/0.2);
    if(t<ANS){cst.textContent='전화 왔어요';cbt.style.display='flex'}else if(t<HANG){cst.textContent='통화 중 00:0'+Math.min(9,Math.floor(t-ANS));cbt.style.display='none'}else{cst.textContent='통화 종료';cbt.style.display='none'}
    const k=ease(t/5);cam.position.set(0.95,2.15,3.2-k*0.3);cam.lookAt(0.9,1.05,-1.15);
    chipPop(ck,t,0.05);caption(8,t);renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';const ss=si===5?2:1;renderer.setPixelRatio(ss);renderer.setSize(W,H,false);curUpd=S[si]();cur=si}curUpd(t)};  // 제품 장면만 2배 슈퍼샘플링
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>document.fonts.load(`500 150px ${FONT}`)).then(()=>document.fonts.load(`300 100px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
