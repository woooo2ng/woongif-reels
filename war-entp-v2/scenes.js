
// ---------- ENTP 전용 ----------
{const st=document.createElement('style');st.textContent=`
.dopa{position:absolute;left:50%;top:330px;transform:translateX(-50%);display:flex;align-items:center;gap:22px;background:rgba(255,255,255,.95);border-radius:999px;padding:14px 34px;box-shadow:0 10px 30px rgba(0,0,0,.2);white-space:nowrap}
.dopa small{font-size:44px;font-weight:900;color:#3a2a4a}
.dopa .bar{width:330px;height:42px;border-radius:999px;background:#ece6f0;overflow:hidden;position:relative}
.dopa .fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#ffb3ec,#ff4fc4)}
.dopa b{font-size:54px;font-weight:900;color:#e2369f;min-width:150px;text-align:right}
.stat3{position:absolute;left:50%;top:330px;transform:translateX(-50%);background:rgba(255,255,255,.96);border-radius:34px;padding:22px 54px;box-shadow:0 14px 40px rgba(0,0,0,.25);text-align:center;white-space:nowrap}
.stat3 div{font-size:62px;font-weight:900;color:#2a2a2a;line-height:1.45}
.stat3 b{color:#e2369f}
.bino{position:absolute;inset:0;pointer-events:none}
.prof{position:absolute;left:150px;top:150px;width:780px;height:1060px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.prof .screen{position:relative;width:100%;height:100%;border-radius:60px;overflow:hidden;background:linear-gradient(#8d86c9,#5b5199)}
.prof img{position:absolute;left:50%;top:190px;transform:translateX(-50%);width:430px;height:430px;border-radius:150px;border:8px solid #fff;object-fit:cover}
.prof .nm{position:absolute;left:0;right:0;top:660px;text-align:center;font-size:72px;font-weight:900;color:#fff}
.prof .msg{position:absolute;left:0;right:0;top:770px;text-align:center;font-size:46px;font-weight:700;color:#f0ecff}
.prof .bt{position:absolute;left:60px;right:60px;bottom:60px;display:flex;justify-content:space-around;font-size:34px;color:#fff;font-weight:700}
.prof .x{position:absolute;left:40px;top:40px;font-size:50px;color:#fff;font-weight:900}
.flashW{position:absolute;inset:0;background:#fff;pointer-events:none}
`;document.head.appendChild(st)}
function dopaEl(){const d=div('dopa','<small>도파민 게이지</small><div class="bar"><div class="fill"></div></div><b>0%</b>');d.style.opacity=0;return d}
function setDopa(d,v,t,t0){const f=d.querySelector('.fill'),b=d.querySelector('b');f.style.width=Math.max(0,Math.min(100,v))+'%';b.textContent=v>=100?'MAX':Math.round(v)+'%';
  d.style.opacity=t>=t0?clamp01((t-t0)/0.1):0;d.style.transform=`translateX(-50%) scale(${pop((t-t0)/0.3)})`;b.style.color=v<10?(Math.floor(t*4)%2?'#e23b3b':'#999'):'#e2369f'}
function entpS(r,side){const p=brows(soldier(r,side),0.12);setFace(p,true);return p}
function entpG(r,side){const p=brows(general(r,side),0.12);setFace(p,true);return p}
function mouthO(p){const m=new THREE.Mesh(new THREE.CircleGeometry(0.055,16),basic(0x4a1a1a));m.position.set(0,0.15,0.249);m.visible=false;p.userData.head.add(m);p.userData.mo=m;return m}
function faceO(p,on){if(!p.userData.mo)mouthO(p);p.userData.mo.visible=on;if(on){p.userData.smile.visible=false;p.userData.flat.visible=false}}
function eyesBig(p,k){p.userData.head.children.forEach(c=>{if(c.geometry&&c.geometry.type==='BoxGeometry'&&c.geometry.parameters.height===0.07)c.scale.y=k})}
function lineMark(scene,z){const l=new THREE.Mesh(new THREE.PlaneGeometry(60,0.22),basic(0xfafafa));l.rotation.x=-Math.PI/2;l.position.set(0,0.02,z);scene.add(l);return l}
function signBoard(scene,text,x,z,ry=0,o={}){const g=new THREE.Group();const post=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.4,0.08),lamb(0x6b5238));post.position.y=0.7;g.add(post);
  const tex=canvasTex(512,256,(c,w,h)=>{c.fillStyle=o.bg||'#ffe066';rr(c,6,6,w-12,h-12,24);c.fill();c.lineWidth=12;c.strokeStyle='#2a2a2a';c.stroke();c.fillStyle=o.fg||'#c8231b';c.font=`900 ${o.fs||92}px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(text,w/2,h/2+6)});
  const b=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.7),new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));b.position.y=1.55;g.add(b);g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);return g}
function borderField(scene,r,o={}){
  ground(scene,o.g??0x9cb97a,300);
  const dirt=new THREE.Mesh(new THREE.PlaneGeometry(80,4),lamb(0xb9a47a));dirt.rotation.x=-Math.PI/2;dirt.position.set(0,0.01,-5);scene.add(dirt);
  lineMark(scene,-5);
  sandbags(scene,0,1.8,18,2);sandbags(scene,0,-11.8,18,2,0xb4a7d6);
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r(),-22-r()*4,1.2,0x76a866);
  for(let i=0;i<8;i++)tree(scene,(i-3.5)*6+r(),9+r()*3,1.1,0x76a866);
  for(let i=0;i<7;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-3)*14+r()*4,0,-42-r()*10);scene.add(h)}
  tent(scene,-9,6,0x667f48,1.3);tent(scene,9,-17,0x6d62ad,1.3);
  flag(scene,-7.5,2.8,0x7f9b5a,4.2,1.3);flag(scene,7.5,-12.8,0x7c74b8,4.2,1.3);
}
function ketchup(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.085,0.26,14),lamb(0xd8322a));g.add(b);
  const lb=new THREE.Mesh(new THREE.CylinderGeometry(0.077,0.087,0.1,14),lamb(0xf5f0e0));lb.position.y=-0.02;g.add(lb);
  const c=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.075,0.07,14),lamb(0xf2c21b));c.position.y=0.16;g.add(c);
  const n=new THREE.Mesh(new THREE.ConeGeometry(0.03,0.07,10),lamb(0xf2c21b));n.position.y=0.23;g.add(n);return g}
function stain(p){const m=new THREE.Mesh(new THREE.CircleGeometry(0.13,18),basic(0xd4241c));m.position.set(-0.05,0.38,0.162);m.scale.setScalar(0.01);p.userData.hip.add(m);return m}
function mag(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.26,0.13),lamb(0x3a3530));g.add(b);
  const tex=canvasTex(256,128,(c,w,h)=>{c.fillStyle='#ffe066';rr(c,4,4,w-8,h-8,14);c.fill();c.fillStyle='#c8231b';c.font=`900 66px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText('공포탄',w/2,h/2+4)});
  const l=new THREE.Mesh(new THREE.PlaneGeometry(0.12,0.06),new THREE.MeshBasicMaterial({map:tex}));l.position.set(0.047,0,0);l.rotation.y=Math.PI/2;g.add(l);
  const l2=l.clone();l2.position.x=-0.047;l2.rotation.y=-Math.PI/2;g.add(l2);return g}
function guitar(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.5,0.12),lamb(0xc98a4a));g.add(b);const n=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.6,0.05),lamb(0x6b4a2f));n.position.y=0.55;g.add(n);return g}
function laptop(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.03,0.32),lamb(0xbfc4cc));g.add(b);const s=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.3,0.02),lamb(0xa8adb6));s.position.set(0,0.15,-0.16);s.rotation.x=-0.25;g.add(s);return g}
function rod(){const g=new THREE.Group();const s=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.02,2.2,6),lamb(0x3a3a3a));s.position.y=1.0;g.add(s);return g}
function tangsu(scene,x,y,z,s=1){const g=new THREE.Group();const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.34,0.05,24),lamb(0xf4f4f4));g.add(pl);
  const N=[];const r=rng(5);for(let i=0;i<12;i++){const n=new THREE.Mesh(new THREE.IcosahedronGeometry(0.075,0),lamb(0xe0a24a).clone());const a=r()*Math.PI*2,d=r()*0.26;n.position.set(Math.cos(a)*d,0.07+r()*0.05,Math.sin(a)*d);n.scale.set(1.3,0.8,1);g.add(n);N.push(n)}
  const sauce=new THREE.Mesh(new THREE.CircleGeometry(0.36,24),new THREE.MeshLambertMaterial({color:0xb5542a,transparent:true,opacity:0.92}));sauce.rotation.x=-Math.PI/2;sauce.position.y=0.135;sauce.scale.setScalar(0.01);g.add(sauce);
  g.position.set(x,y,z);g.scale.setScalar(s);scene.add(g);g.userData={N,sauce};return g}
function micStand(scene,x,z){const g=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.3,6),lamb(0x333333));p.position.y=0.15;g.add(p);
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.045,10,8),lamb(0x222222));h.position.y=0.32;g.add(h);g.position.set(x,0.9,z);scene.add(g);return g}
function tears(scene,n){const a=[];for(let i=0;i<n;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),basic(0x7fc8ff));scene.add(d);a.push(d)}return a}
function updTears(a,t,on,P){a.forEach((d,i)=>{const lt=(t*1.6+i/a.length)%1;d.visible=on;if(!on)return;const s=i%2?1:-1;d.position.set(P.x+s*(0.12+lt*0.25),P.y-0.03-lt*0.5+Math.sin(lt*Math.PI)*0.12,P.z+0.05)})}
function oneLeg(p,k,t,ph=0){const u=p.userData;u.legs[0].rotation.x=-1.2*k;u.legs[0].rotation.z=0;u.hip.position.y=0.8+0.02*Math.sin(t*6+ph)*k;u.hip.rotation.z=Math.sin(t*5+ph)*0.08*k;
  u.arms[0].rotation.x=-0.3*k;u.arms[0].rotation.z=-0.9*k;u.arms[1].rotation.x=-2.5*k;u.arms[1].rotation.z=(0.15+Math.sin(t*14+ph)*0.35)*k}
function wiggle(p,t,ph,k=1){const u=p.userData;u.hip.rotation.z=Math.sin(t*3+ph)*0.12*k;u.head.rotation.z=Math.sin(t*2.3+ph)*0.2*k;u.hip.position.y=0.8+Math.abs(Math.sin(t*3+ph))*0.03*k;u.arms[0].rotation.z=-0.2*k;u.arms[1].rotation.z=0.2*k}
function kneel(p){const u=p.userData;u.hip.position.y=0.45;u.legs[0].rotation.x=-1.3;u.legs[1].rotation.x=0.4;u.hip.rotation.x=0.25}
const _q=new THREE.Vector3();
function scrPos(o,C,dy=0){o.updateMatrixWorld(true);o.getWorldPosition(_q);_q.y+=dy;_q.project(C);return [(_q.x+1)/2*W,(1-_q.y)/2*H]}

// ---------- v15 추가 소품 ----------
{const st=document.createElement('style');st.textContent=`
.camui{position:absolute;inset:0;pointer-events:none}
.camui .tb{position:absolute;left:0;right:0;top:0;height:200px;background:rgba(0,0,0,.82);display:flex;align-items:flex-end;justify-content:center;padding-bottom:26px;box-sizing:border-box;gap:60px;color:#fff;font-size:34px;font-weight:700}
.camui .tb b{color:#ffd84d}
.camui .bb{position:absolute;left:0;right:0;bottom:0;height:420px;background:rgba(0,0,0,.82)}
.camui .sh{position:absolute;left:50%;bottom:150px;width:150px;height:150px;margin-left:-75px;border-radius:50%;background:#fff;box-shadow:0 0 0 12px rgba(255,255,255,.35)}
.camui .th{position:absolute;left:90px;bottom:170px;width:110px;height:110px;border-radius:20px;background-size:cover;background-position:center;border:4px solid #fff}
.camui .fc{position:absolute;left:50%;top:640px;width:560px;height:560px;margin-left:-280px;border:6px solid #ffd84d;border-radius:12px}
.camui .md{position:absolute;left:0;right:0;bottom:330px;text-align:center;color:#ffd84d;font-size:34px;font-weight:900;letter-spacing:4px}
`;document.head.appendChild(st)}
function mouthMega(p){const m=megaphone();m.rotation.x=-Math.PI/2;m.position.set(0,0.17,0.5);p.userData.head.add(m);m.visible=false;return m}
function megaArm(p){const a=p.userData.arms[1];a.rotation.x=-1.77;a.rotation.z=-0.60}
function bigButton(scene,x,z){const g=new THREE.Group();
  const stripe=canvasTex(512,128,(c,w,h)=>{c.fillStyle='#ffd84d';c.fillRect(0,0,w,h);c.fillStyle='#2a2a2a';for(let i=-2;i<14;i++){c.beginPath();c.moveTo(i*48,0);c.lineTo(i*48+24,0);c.lineTo(i*48-24,h);c.lineTo(i*48-48,h);c.closePath();c.fill()}});
  const ped=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.9,0.9,28),new THREE.MeshLambertMaterial({map:stripe}));ped.position.y=0.45;g.add(ped);
  const ring=new THREE.Mesh(new THREE.CylinderGeometry(0.66,0.66,0.12,32),lamb(0x55586a));ring.position.y=0.96;g.add(ring);
  const btn=new THREE.Mesh(new THREE.SphereGeometry(0.52,40,20,0,Math.PI*2,0,Math.PI*0.5),smooth(0xe8322a));btn.position.y=1.0;btn.scale.y=0.6;g.add(btn);
  const gl=glowSprite('rgba(255,90,70,1)',2.2);gl.position.y=1.2;g.add(gl);g.userData={btn,gl};
  g.position.set(x,0,z);scene.add(g);return g}
function warnSign(scene,x,z,ry=0){const g=new THREE.Group();for(const s of[-1,1]){const post=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.5,0.08),lamb(0x6b5238));post.position.set(s*0.75,0.75,0);g.add(post)}
  const tex=canvasTex(640,360,(c,w,h)=>{c.fillStyle='#fffdf2';rr(c,6,6,w-12,h-12,24);c.fill();c.lineWidth=14;c.strokeStyle='#c8231b';c.stroke();
    c.textAlign='center';c.textBaseline='middle';c.fillStyle='#2a2a2a';c.font=`900 84px ${FONT}`;c.fillText('전쟁 개시 버튼',w/2,h*0.33);
    c.fillStyle='#c8231b';c.font=`900 72px ${FONT}`;c.fillText('절대 누르지 마시오',w/2,h*0.7)});
  const b=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.0),new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));b.position.y=1.75;g.add(b);g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);return g}
const CONF=[0xff6b9a,0xffd84d,0x6bd1ff,0x8ef0a8,0xc58bff,0xff9f5a];
function confetti3(scene,n,r,o){const a=[];const geo=new THREE.PlaneGeometry(0.09,0.06);
  for(let i=0;i<n;i++){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:CONF[i%6],side:THREE.DoubleSide}));m.visible=false;scene.add(m);
    const ang=r()*Math.PI*2,sp=1.2+r()*3.2;a.push({m,vx:Math.cos(ang)*sp,vz:Math.sin(ang)*sp,vy:4+r()*5,ph:r()*6,rx:r()*8,ry:r()*8})}
  a.o=o;return a}
function updConf(a,t,t0){a.forEach(q=>{const lt=t-t0;q.m.visible=lt>0;if(lt<=0)return;
  const T=Math.min(lt,3.5);let y=a.o.y+q.vy*T-4.9*T*T*0.35;const drag=1-Math.exp(-T*1.4);
  let x=a.o.x+q.vx*drag/1.4*1.6,z=a.o.z+q.vz*drag/1.4*1.6;if(y<0.02)y=0.02;
  q.m.position.set(x+Math.sin(lt*3+q.ph)*0.15*(y>0.05?1:0),y,z);q.m.rotation.set(y>0.05?lt*q.rx:-Math.PI/2,y>0.05?lt*q.ry:0,0)})}
function reach(p,k,t,ph){const u=p.userData;u.arms.forEach((a,i)=>{a.rotation.x=-1.45*k+Math.sin(t*22+ph+i)*0.05*k;a.rotation.z=(i?-0.12:0.12)*k})}
function fidget(p,k,t,ph){const u=p.userData;u.arms.forEach((a,i)=>{a.rotation.x=-0.55*k+Math.sin(t*26+ph+i*2)*0.12*k;a.rotation.z=Math.sin(t*19+ph+i)*0.1*k})}
function yeop(p,on){const u=p.userData,h=u.head;if(!u.mo)mouthO(p);
  if(!u.yp){const ns=[];for(const s of[-1,1]){const n=new THREE.Mesh(new THREE.CircleGeometry(0.02,12),basic(0x3a1a1a));n.position.set(s*0.03,0.205,0.25);n.scale.y=0.75;h.add(n);ns.push(n)}
    const sw=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),basic(0x9fd8ff));sw.scale.y=1.5;sw.position.set(0.19,0.36,0.17);h.add(sw);
    const eyes=h.children.filter(c=>c.geometry&&c.geometry.type==='BoxGeometry'&&c.geometry.parameters.height===0.07).sort((a,b)=>a.position.x-b.position.x);
    const br=h.children.filter(c=>c.geometry&&c.geometry.type==='BoxGeometry'&&c.geometry.parameters.height===0.025).sort((a,b)=>a.position.x-b.position.x);
    u.yp={ns,sw,eyes,br,brz:br.map(b=>b.rotation.z),bry:br.map(b=>b.position.y)}}
  const Y=u.yp;faceO(p,on);
  if(on){u.mo.scale.set(0.8,1.55,1);u.mo.position.y=0.115}else{u.mo.scale.set(1,1,1);u.mo.position.y=0.15}
  Y.ns.forEach(n=>n.visible=on);Y.sw.visible=on;
  Y.eyes[0].scale.set(on?1.55:1,on?2.2:1,1);Y.eyes[1].scale.set(on?1.3:1,on?0.28:1,1);Y.eyes[1].position.y=on?0.235:0.25;
  if(Y.br.length===2){Y.br[0].position.y=on?Y.bry[0]+0.05:Y.bry[0];Y.br[0].rotation.z=on?-0.35:Y.brz[0];Y.br[1].rotation.z=on?-0.45:Y.brz[1];Y.br[1].position.y=on?Y.bry[1]-0.02:Y.bry[1]}
  h.rotation.x=on?-0.16:0;h.rotation.z=on?0.13:0}
function bird(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),lamb(0x222228));b.scale.set(1.4,0.9,0.9);g.add(b);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),lamb(0x222228));hd.position.set(0.22,0.06,0);g.add(hd);
  const bk=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.12,6),lamb(0x444444));bk.rotation.z=-Math.PI/2;bk.position.set(0.34,0.05,0);g.add(bk);
  const W=[];for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.02,0.4),lamb(0x2a2a30));w.position.set(0,0.04,s*0.2);g.add(w);W.push(w)}g.userData.W=W;return g}
function flapBird(g,t){g.userData.W.forEach((w,i)=>{w.rotation.x=(i?1:-1)*Math.sin(t*16)*0.7})}
function waterGun(col){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.16,0.5),lamb(col));g.add(b);
  const tk=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.2,12),lamb(0xbfe9ff));tk.position.set(0,0.16,-0.05);g.add(tk);
  const nz=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.18,8),lamb(0xffd84d));nz.rotation.x=Math.PI/2;nz.position.z=0.32;g.add(nz);return g}
function pillow(){const m=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.38,0.16),smooth(0xfafaff));return m}
function snowman(scene,x,z,s=1){const g=new THREE.Group();[[0.5,0.45],[0.36,1.15],[0.24,1.65]].forEach(([r,y])=>{const b=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),smooth(0xffffff));b.position.y=y;g.add(b)});
  const n=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,8),lamb(0xff8a3a));n.rotation.x=Math.PI/2;n.position.set(0,1.65,0.26);g.add(n);
  for(const s2 of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,6),basic(0x222222));e.position.set(s2*0.08,1.72,0.21);g.add(e)}
  g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}

// ===== 0. '절대 누르지 마시오' 전쟁 개시 버튼 (타이틀) =====
S[0]=()=>{
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const LG=scene.children.filter(c=>c.isLight);LG.forEach(l=>l.userData.i0=l.intensity);
  const fogD=new THREE.Color(0x3a4066),fogL=new THREE.Color(0xe2ecf4);
  const r=rng(131);borderField(scene,r);
  const BZ=-5;const BT=bigButton(scene,0,BZ);const WS=warnSign(scene,-0.6,BZ-0.75,0.1);
  const al=[],fo=[];
  for(let i=0;i<14;i++){const p=entpS(r,ALLY);const x=(i-6.5)*1.2;p.position.set(x,0,0.2+(i%2)*0.3);p.rotation.y=Math.PI;scene.add(p);setFace(p,false);al.push({p,x0:x,z0:p.position.z,ph:r()*6})}
  for(let i=0;i<14;i++){const p=entpS(r,FOE);const x=(i-6.5)*1.2+0.3;p.position.set(x,0,-10.2-(i%2)*0.3);scene.add(p);setFace(p,false);fo.push({p,x0:x,z0:p.position.z,ph:r()*6})}
  // 버튼 둘레 목표 자리 (아군은 앞쪽 반원, 적군은 뒤쪽 반원)
  function ring(arr,base){arr.forEach((q,i)=>{const k=i/(arr.length-1);const a=base+(-1.25+2.5*k);const R=i%2?2.05:1.35;q.tx=Math.sin(a)*R;q.tz=BZ+Math.cos(a)*R;q.d=r()*0.4})}
  ring(al,0);ring(fo,Math.PI);
  const GX=-0.9,GZ=-0.9;const G=entpG(r,GEN);G.position.set(GX,0,GZ);G.rotation.y=Math.PI;scene.add(G);setFace(G,false);
  const EG=entpG(r,ENEMYG);EG.position.set(2.2,0,-8.8);scene.add(EG);setFace(EG,false);  const S1=al[5].p,S2=al[4].p;
  const E=EV(0),gb=at(0,'gb'),sq=at(0,'sq'),gn=at(0,'gn'),bt=at(0,'bt'),nb=at(0,'nb'),STARE=E.stare,APPR=E.appr,PRESS=E.press,POP=E.pop;
  const b1=bubS(G,'절대 누르지 마라',{size:0.0017}),b3=sb(scene,'…궁금하지 않냐?',-2.4,2.75,0.35,{c:{bg:'#ffe0dc',fg:'#5a1a12'},size:0.0016}),b4=bubS(G,'…나도.',{size:0.0019});
  const bB=sb(scene,'띵동~ 누르지 말랬잖아~ ㅋ',0,2.6,BZ,{c:{bg:'#fff0f7',fg:'#c2185b'},size:0.0034});
  const CF=confetti3(scene,260,r,{x:0,y:1.3,z:BZ});
  const C=cam(50);const ch=chip('누른 사람 0명');ch.style.opacity=0;
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ENTP × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ENTP인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  const look=(p,x,z)=>{p.rotation.y=Math.atan2(x-p.position.x,z-p.position.z)};
  return t=>{
    // 새벽 어둠 → 꽃가루 터지면 환하게
    const lit=clamp01((t-POP)/0.6);setSky(lit>0.5?'#a9c9e8':'#1e2546',lit>0.5?'#eef4f8 70%':'#5a5a8a 70%');
    LG.forEach(l=>l.intensity=l.userData.i0*(0.55+0.45*lit));scene.fog.color.copy(fogD).lerp(fogL,lit);
    const ak=clamp01((t-APPR)/(PRESS-0.3-APPR));const rk=clamp01((t-PRESS+0.55)/0.3);const fun=t>POP;
    const pressed=t>PRESS;
    [...al,...fo].forEach((q,j)=>{const p=q.p;standPose(p);setFace(p,fun);
      const k=ease(clamp01((ak*1.15)-q.d*0.35));p.position.set(q.x0+(q.tx-q.x0)*k,0,q.z0+(q.tz-q.z0)*k);
      if(ak>0&&k<1)runPose(p,t*14+q.ph);
      if(t>STARE){look(p,0,BZ)}else p.rotation.y=j<al.length?Math.PI:0;
      if(t>STARE&&t<APPR){fidget(p,clamp01((t-STARE)/0.4),t,q.ph);eyesBig(p,1.35)}else eyesBig(p,1);
      if(t>=PRESS-0.55&&!fun)reach(p,rk,t,q.ph);
      if(fun){const v=(j%3===0);if(v)vSign(p,1,1);p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*6+q.ph))*0.06}});
    standPose(G);standPose(EG);setFace(G,fun);setFace(EG,fun);if(t>STARE&&t<APPR){look(EG,0,BZ);eyesBig(EG,1.4);fidget(EG,1,t,2)}else eyesBig(EG,1);
    // 장군: 버튼 가리키며 선언 → (나도) → 같이 다가감
    if(t<STARE)point(G,clamp01((t-gb)/0.25),1.35);
    const PX=-2.4,PZ=1.05;
    if(t>APPR){const k=ease(ak);G.position.set(PX+(-0.55-PX)*k,0,PZ+(BZ+1.05-PZ)*k);look(G,0,BZ);if(k<1&&k>0)runPose(G,t*14);if(t>=PRESS-0.55&&!fun)reach(G,rk,t,1)}
    else if(t>gn-0.45){const k=ease((t-gn+0.45)/0.35);G.position.set(-0.6+(PX+0.6)*k,0,PZ);G.rotation.y=Math.PI;G.userData.hip.rotation.x=0.25*k;if(k<1)walkPose(G,t*9,0.4)}
    else if(t>sq-0.2){G.position.set(-0.6,0,PZ);G.rotation.y=Math.PI}
    else{G.position.set(GX,0,GZ);G.rotation.y=Math.PI}
    if(t>gn-0.2&&t<APPR){G.userData.head.rotation.y=0}
    if(t>sq-0.2&&t<APPR){look(S1,S2.position.x,S2.position.z-2.4);look(S2,S1.position.x,S1.position.z-2.4);S1.userData.hip.rotation.x=0.15;S2.userData.hip.rotation.x=0.15;if(t>gn-0.1){S1.userData.head.rotation.y=0.9;S2.userData.head.rotation.y=-0.9;eyesBig(S1,1.6);eyesBig(S2,1.6)}}
    if(t>APPR){const k=ease(ak);EG.position.set(2.2+(0.55-2.2)*k,0,-8.8+(BZ-1.15+8.8)*k);look(EG,0,BZ);if(k<1&&k>0)runPose(EG,t*14);if(t>=PRESS-0.55&&!fun)reach(EG,rk,t,2)}
    // 버튼
    const bk=pressed?(t<PRESS+0.12?1-((t-PRESS)/0.12)*0.6:0.4+0.6*clamp01((t-POP)/0.15)):1;BT.userData.btn.scale.y=0.6*bk;
    BT.userData.gl.material.opacity=0.5+0.4*Math.sin(t*6);
    updConf(CF,t,POP);
    show(b1,t,gb+0.1,STARE);show(b3,t,sq,gn);show(b4,t,gn,APPR+0.3);
    scaleBubble(bB,t>POP?pop((t-POP)/0.3):0);bB.visible=t>POP&&t<nb+0.2;
    const n=t<PRESS?0:t<POP?Math.min(4000,(t-PRESS)/0.25*4000):4000;ch.textContent='누른 사람 '+fmt(n)+'명';
    ch.style.opacity=t>PRESS?1:0;chipPop(ch,t,PRESS);if(t<PRESS)ch.style.opacity=0;
    // 카메라
    if(t<gb-0.05){const k=ease(t/(gb-0.05));setCam(C,lerp3([-0.45,2.0,BZ+3.6],[0,6.2,5.5],k),lerp3([-0.45,1.55,BZ],[0,0.8,BZ],k),46+6*k)}
    else if(t<STARE){const k=ease((t-gb)/3);setCam(C,lerp3([GX+0.8,2.3,GZ-2.9],[GX+0.65,2.3,GZ-2.6],k),[GX,2.2,GZ],44)}
    else if(t<sq-0.05){const k=ease((t-STARE)/(sq-STARE));setCam(C,lerp3([1.5,1.8,BZ+1.6],[1.45,1.75,BZ+1.1],k),[1.6,1.5,-10.2],46)}
    else if(t<APPR){setCam(C,[-2.4,2.25,-3.3],[-2.4,2.05,0.4],44)}
    else if(t<PRESS-0.25){const k=ease((t-APPR)/(PRESS-0.25-APPR));setCam(C,lerp3([0,7.5,1.0],[0,6.2,-0.6],k),[0,0.6,BZ],52)}
    else if(t<POP){const k=ease((t-PRESS+0.25)/1.0);setCam(C,lerp3([0,5.2,BZ+2.0],[0,4.7,BZ+1.5],k),[0,1.0,BZ],50)}
    else{const k=ease((t-POP)/5);setCam(C,lerp3([0,4.2,BZ+5.6],[0,5.6,BZ+8.2],k),[0,1.6,BZ],54)}
    const TO=gb+0.1;
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t3.style.transform=`scale(${pop((t-0.6)/0.4)})`;
    [tag,t1,t2,t3].forEach((e,i)=>e.style.opacity=t<TO?clamp01((t-i*0.2)/0.1):clamp01(1-(t-TO)/0.2));
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 이번엔 진짜 → 국경 넘는 병사 → 공포탄 → 케첩 몰카 =====
S[1]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(51);borderField(scene,r);
  // 바닥에 남은 꽃가루
  {const geo=new THREE.PlaneGeometry(0.09,0.06);for(let i=0;i<160;i++){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:CONF[i%6],side:THREE.DoubleSide}));m.rotation.set(-Math.PI/2,0,r()*6);const a=r()*Math.PI*2,d=Math.sqrt(r())*4.5;m.position.set(Math.cos(a)*d,0.02,-5+Math.sin(a)*d);scene.add(m)}}
  const BT=bigButton(scene,-3.6,-5);BT.userData.btn.scale.y=0.24;
  const AZ0=0.2,AS=-2.2,AZ=-6.4,FZ=-10.0,FE=AZ-1.15;
  const al=[];for(let i=0;i<12;i++){if(i>=5&&i<=7)continue;const p=entpS(r,ALLY);p.position.set((i-5.5)*1.35,0,AZ0);p.rotation.y=Math.PI;scene.add(p);al.push({p,ph:r()*6,x:(i-5.5)*1.35})}
  const fo=[];for(let i=0;i<12;i++){if(i===6)continue;const p=entpS(r,FOE);p.position.set((i-5.5)*1.35+0.3,0,-10.2);setFace(p,false);scene.add(p);aim(p);fo.push({p,ph:r()*6})}
  const G=entpG(r,GEN);G.position.set(-2.4,0,-0.9);G.rotation.y=Math.PI;scene.add(G);
  {const geo=new THREE.PlaneGeometry(0.06,0.04);for(let i=0;i<9;i++){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:CONF[i%6],side:THREE.DoubleSide}));const a=r()*Math.PI*2;m.position.set(Math.cos(a)*0.24,0.5+r()*0.06,Math.sin(a)*0.24);m.rotation.set(r()*3,r()*3,0);G.userData.head.add(m)}}
  const PV=new THREE.Group();PV.position.set(0.3,0,AS);PV.rotation.y=Math.PI;scene.add(PV);
  const A=entpS(r,ALLY);PV.add(A);const ST=stain(A);
  const KB=ketchup();KB.scale.setScalar(1.5);holdIn(A,KB,1,0,-0.72,0.08);KB.visible=false;
  const sign=labelSprite('몰래카메라',{bg:'#ffe066',fg:'#c8231b',fs:80,size:0.0019});sign.center.set(0.5,0);A.userData.arms[0].add(sign);sign.position.set(0,-0.75,0.15);sign.visible=false;
  const F=entpS(r,FOE);F.position.set(0.3,0,FZ);scene.add(F);setFace(F,false);const M=mag();scene.add(M);
  const sweat=[];for(let i=0;i<2;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),basic(0x9fd8ff));F.userData.head.add(d);d.position.set(i?0.2:-0.2,0.38,0.12);sweat.push(d)}
  const E=EV(1),gj=at(1,'gj'),fs=at(1,'fs'),f1=at(1,'f1'),s4=at(1,'s4'),f2=at(1,'f2'),sm=at(1,'sm'),WALK=E.walk,AIM=E.aim,LOAD=E.load,SHOT=E.shot,RUN=E.run,UP=E.up,DT=E.dt,WIDE=E.wide;
  const flash=glowSprite('rgba(255,230,140,1)',1.2);scene.add(flash);
  const drops=[];for(let i=0;i<26;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.065,10,8),basic(0xe0251b));scene.add(d);d.visible=false;drops.push(d)}
  const T=tears(scene,8);
  const bg=bubS(G,'이번엔 진짜다',{size:0.0019});
  const b0=bubF(F,'멈춰! 더 오면 쏜다!',{size:0.0018}),b1=bubF(F,'경고 사격이다!',{size:0.0022}),b2=bubS(A,'장군님… 제 몫까지…',{size:0.0014,y:1.0}),b3=bubF(F,'공포탄인데?!',{size:0.0018,y:1.6}),b4=bubF(F,'미안해!!',{size:0.0018,y:1.6}),b5=bubS(A,'몰카였지롱~ ㅋㅋㅋ',{size:0.0015,y:2.3}),b6=bubF(F,'……',{size:0.0018,y:1.6});
  const mini=[];al.concat(fo.map(q=>({p:q.p,ph:q.ph}))).forEach((q,i)=>{const s=labelSprite('몰카',{bg:'#ffe066',fg:'#c8231b',fs:70,size:0.004});s.center.set(0.5,0);s.position.set(0,2.2,0);s.material.depthTest=false;q.p.add(s);mini.push({p:q.p,s,ph:(i*0.37)%1})});
  const dopa=dopaEl();const st=div('stat3','<div>전사 <b>0명</b></div><div>몰카 <b class="c">0</b>건</div><div>케첩 소비량 <b>+3,000%</b></div>');st.style.top='450px';st.style.opacity=0;
  const C=cam(50);const _h=new THREE.Vector3();
  return t=>{
    // 장군: 꽃가루 털기 → 앞으로 가리킴
    standPose(G);setFace(G,false);
    if(t<gj+0.9){const a=G.userData.arms[1];a.rotation.x=-1.0;a.rotation.z=1.1+Math.sin(t*18)*0.25;G.userData.head.rotation.z=Math.sin(t*12)*0.08}
    else point(G,clamp01((t-gj-0.9)/0.25),1.5);
    // 아군 병사 A: 국경선을 넘어 적진으로 터벅터벅
    const wk=clamp01((t-WALK)/(f1-0.1-WALK));const pz=AS+(AZ-AS)*wk;PV.position.z=pz;
    // 적 병사 F
    standPose(F);let fz=FZ;
    if(t<RUN){if(t>AIM-0.2){aim(F);const up=clamp01((t-f1+0.2)/0.3);F.userData.arms.forEach(a=>a.rotation.x-=0.9*up);F.userData.rifle.rotation.x=-0.9*up;F.userData.rifle.position.set(0.12,0.62+0.3*up,0.45-0.15*up)}else noRifle(F)}
    else{noRifle(F);const k=clamp01((t-RUN)/1.1);fz=FZ+ease(k)*(FE-FZ);if(k<1)runPose(F,t*13);else{kneel(F);F.userData.arms.forEach((a,i)=>{a.rotation.x=-1.2;a.rotation.z=i?-0.4:0.4})}}
    F.position.set(0.3,0,fz);F.rotation.y=0;
    sweat.forEach((d,i)=>{d.visible=t>AIM&&t<SHOT;d.position.y=0.38-((t*0.8+i*0.5)%1)*0.3});
    const lk=clamp01((t-LOAD)/0.5);M.visible=t>LOAD-0.4&&t<f1;F.updateMatrixWorld(true);
    if(F.userData.rifle&&F.userData.rifle.visible){F.userData.rifle.getWorldPosition(_h);M.position.set(_h.x,_h.y-0.32+0.18*ease(lk),_h.z+0.08)}
    flash.visible=t>SHOT&&t<SHOT+0.12;if(F.userData.rifle){F.userData.rifle.getWorldPosition(_h);flash.position.set(_h.x,_h.y+0.7,_h.z+0.2)}
    standPose(A);let fall=0;setFace(A,true);
    if(t>WALK&&wk<1)walkPose(A,(t-WALK)*4.6,0.4);
    if(t>SHOT+0.1&&t<UP){fall=ease((t-SHOT-0.1)/1.6);A.userData.arms.forEach((a,i)=>{a.rotation.x=-1.4;a.rotation.z=i?0.9:-0.9});setFace(A,false);A.userData.head.rotation.x=-0.3*fall}
    if(t>=UP){fall=Math.max(0,1-ease((t-UP)/0.25));setFace(A,true);
      const a=A.userData.arms[1];const sqz=t<UP+1.8;a.rotation.x=sqz?-2.1:-1.0;a.rotation.z=sqz?-0.3:-0.2;KB.visible=true;KB.rotation.x=sqz?2.6:1.2;
      const sa=A.userData.arms[0];sa.rotation.x=-2.5;sa.rotation.z=-0.4;sign.visible=true}
    else{KB.visible=false;sign.visible=false}
    A.rotation.x=-fall*1.45;
    ST.scale.setScalar(t>SHOT+0.4?Math.min(1.2,0.2+(t-SHOT-0.4)*0.5):0.01);
    const sq=t>UP+0.25&&t<UP+1.8;KB.updateMatrixWorld(true);KB.getWorldPosition(_h);if(sq)KB.scale.set(1.5,1.5*(1-0.18*Math.abs(Math.sin(t*14))),1.5);else KB.scale.setScalar(1.5);
    drops.forEach((d,i)=>{d.visible=sq;if(!sq)return;const lt=((t-UP)*1.8+i/drops.length)%1;d.position.set(_h.x+Math.sin(i*2.3)*0.05,_h.y+0.15-lt*1.5,_h.z-0.12-lt*0.35)});
    F.updateMatrixWorld(true);F.userData.head.getWorldPosition(_h);updTears(T,t,t>f2-0.1&&t<UP+0.2,{x:_h.x,y:_h.y+0.27,z:_h.z+0.2});
    al.forEach(q=>{standPose(q.p);setFace(q.p,true);q.p.userData.hip.rotation.x=0});fo.forEach(q=>{standPose(q.p);if(t<WIDE)aim(q.p);else noRifle(q.p)});
    const wd=t>WIDE;mini.forEach(q=>{if(!wd){q.s.visible=false;return}
      const lt=((t-WIDE)*0.6+q.ph)%1;const dn=lt<0.4?Math.sin(lt/0.4*Math.PI/2):lt<0.55?1:Math.max(0,1-(lt-0.55)/0.1);
      q.p.userData.hip.rotation.x=-dn*1.1;q.p.userData.hip.position.y=0.8-dn*0.45;
      q.s.visible=lt>0.62;q.s.scale.set(q.s.userData.base[0]*pop((lt-0.62)/0.1),q.s.userData.base[1]*pop((lt-0.62)/0.1),1)});
    show(bg,t,gj+0.6,WALK+0.3);show(b0,t,fs,f1-0.2);show(b1,t,f1,SHOT+0.3);show(b2,t,s4,f2-0.2);show(b3,t,f2,f2+1.1);show(b4,t,f2+1.1,UP);show(b5,t,sm,DT+0.2);show(b6,t,sm+0.6,DT);
    setDopa(dopa,t<DT?0:Math.min(100,(t-DT)*95),t,DT);if(t>WIDE-0.1)dopa.style.opacity=0;
    st.style.opacity=t>WIDE+0.6?1:0;st.style.transform=`translateX(-50%) scale(${pop((t-WIDE-0.6)/0.3)})`;st.querySelector('.c').textContent=fmt(Math.min(1204,Math.max(0,(t-WIDE-0.6)*420)));
    // 카메라
    const dz=AZ+4.85;
    if(t<WALK){setCam(C,[-1.85,2.35,-3.4],[-2.4,2.15,-0.9],44)}
    else if(t<AIM){setCam(C,[1.3,1.9,pz-3.2],[0.3,1.4,pz],46)}
    else if(t<LOAD-0.4){setCam(C,[1.5,1.7,-7.7],[0.3,1.7,FZ],44)}
    else if(t<f1-0.1){setCam(C,[1.6,1.5,-8.2],[0.4,1.15,-9.9],36)}
    else if(t<SHOT+0.1){setCam(C,[2.4,1.6,-7.6],[0.3,1.9,-9.8],50)}
    else if(t<s4-0.2){const k=ease((t-SHOT-0.1)/1.7);setCam(C,lerp3([2.6,2.3,-8.8+dz],[2.3,2.0,-8.2+dz],k),lerp3([0.3,1.2,-4.6+dz],[0.3,0.6,-4.0+dz],k),46)}
    else if(t<RUN){setCam(C,[2.3,2.0,-8.2+dz],[0.3,0.6,-4.0+dz],46)}
    else if(t<UP-0.1){setCam(C,[2.4,2.1,-2.4+dz],[0.7,1.0,-5.2+dz],50)}
    else if(t<DT){setCam(C,[2.3,1.7,AZ-2.6],[0.3,1.5,AZ-0.5],44)}
    else if(t<WIDE){const k=ease((t-DT)/(WIDE-DT));setCam(C,lerp3([0.35,1.95,-6.6+dz],[0.35,1.9,-6.0+dz],k),[0.3,1.75,AZ],40)}
    else{const k=ease((t-WIDE)/5);setCam(C,lerp3([10,6,-1],[9,7,-2],k),[0,0.8,-6],52)}
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 적 병사 민초 발견 → 민초 토론 → 내분 → 민초 기준으로 국경 재조정 =====
function iceCream(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.ConeGeometry(0.075,0.24,14),lamb(0xe0b070));c.rotation.x=Math.PI;c.position.y=-0.12;g.add(c);
  const s=new THREE.Mesh(new THREE.SphereGeometry(0.09,16,12),smooth(0x9ef0d2));s.position.y=0.03;g.add(s);
  for(let i=0;i<7;i++){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.022,0.022,0.022),lamb(0x4a2a1a));const a=i*0.9,b=0.3+(i%3)*0.35;ch.position.set(Math.cos(a)*Math.sin(b)*0.09,0.03+Math.cos(b)*0.09,Math.sin(a)*Math.sin(b)*0.09);g.add(ch)}return g}
S[2]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(77);borderField(scene,r);
  // 새 국경선 (민초 / 반민초)
  const nl=new THREE.Mesh(new THREE.PlaneGeometry(0.3,22),basic(0xfafafa));nl.rotation.x=-Math.PI/2;nl.position.set(0,0.03,-5);scene.add(nl);
  const zm=new THREE.Mesh(new THREE.PlaneGeometry(14,22),new THREE.MeshBasicMaterial({color:0x7fe8c4,transparent:true,opacity:0}));zm.rotation.x=-Math.PI/2;zm.position.set(-7.15,0.025,-5);scene.add(zm);
  const zc=new THREE.Mesh(new THREE.PlaneGeometry(14,22),new THREE.MeshBasicMaterial({color:0x8a5a3c,transparent:true,opacity:0}));zc.rotation.x=-Math.PI/2;zc.position.set(7.15,0.025,-5);scene.add(zc);
  const pm=signBoard(scene,'민초파',-4.2,0.8,0,{bg:'#9ef0d2',fg:'#1d5a46'}),pc=signBoard(scene,'반민초파',4.2,0.8,0,{bg:'#e8c9a8',fg:'#5a2e14',fs:80});pm.visible=pc.visible=false;
  const al=[],fo=[];
  for(let i=0;i<12;i++){const p=entpS(r,ALLY);const x=(i-5.5)*1.3;p.position.set(x,0,0.2);p.rotation.y=Math.PI;scene.add(p);al.push({p,x0:x,z0:0.2,ph:r()*6})}
  for(let i=0;i<12;i++){const p=entpS(r,FOE);const x=(i-5.5)*1.3+0.3;p.position.set(x,0,-10.2);scene.add(p);fo.push({p,x0:x,z0:-10.2,ph:r()*6})}
  const B=al[8].p,M2=al[3].p,FE=fo[3].p,F2=fo[9].p;   // 망원경 병사, 민초파 고백, 민초 먹는 적, 치약파 적
  const BN=binoc();B.userData.head.add(BN);BN.position.set(0,0.25,0.32);
  const IC=iceCream();scene.add(IC);const _ic=new THREE.Vector3();
  const G=entpG(r,GEN);G.position.set(1.0,0,1.6);G.rotation.y=Math.PI;scene.add(G);const MG=mouthMega(G);
  const EG=entpG(r,ENEMYG);EG.position.set(-1.6,0,-11.6);scene.add(EG);
  // 새 자리: 민초파는 x<0, 반민초파는 x>0
  const MINT=new Set([al[1],al[3],al[6],al[10],fo[0],fo[3],fo[5],fo[7],fo[11]].map(q=>q.p));
  const all=[...al,...fo];let mi=0,ci=0;
  all.forEach(q=>{const m=MINT.has(q.p);q.m=m;const k=m?mi++:ci++;const col=k%3,row=Math.floor(k/3);q.tx=(m?-1:1)*(1.3+col*1.25);q.tz=-1.6-row*1.5;q.d=r()*0.5});
  const GT=[-1.5,-0.5],ET=[-2.7,-0.5];  // 장군·적장도 민초파 맨 앞줄
  const E=EV(2),sm1=at(2,'sm1'),gm1=at(2,'gm1'),fm1=at(2,'fm1'),sm2=at(2,'sm2'),fm2=at(2,'fm2'),gm2=at(2,'gm2'),eo2=at(2,'eo2'),nm=at(2,'nm'),EAT=E.eat,BI=E.bino,SH=E.shock,HAND=E.hand,MUR=E.mur,REG=E.reg,LOOK=E.look,TOP=E.top;
  const b1=bubS(B,'장군님! 적이 민초를…!',{size:0.0017}),b2=bubS(G,'그걸 돈 주고 먹냐?',{size:0.0019}),b3=bubF(FE,'민초가 어때서?',{size:0.0022}),b4=bubS(M2,'…저 민초파인데요',{size:0.0019}),b5=bubF(F2,'솔직히 민초는 치약이지',{size:0.0017});
  const bq=[...al.slice(1,6),...fo.slice(7,12)].map((q,i)=>bub(q.p,'?!',{bg:i<5?'#f2ffd0':'#e4e0ff',fg:'#333',fs:70,size:0.0028}));
  const bG=bubS(G,'…어?',{size:0.0016}),bE=bubF(EG,'…어?',{size:0.0016});
  // 아군·적군 이름표 (머리 바로 위, 말풍선 아래)
  const TAGA={bg:'#d8f0c0',fg:'#2f5a14',fs:60,size:0.0022},TAGF={bg:'#e4e0ff',fg:'#3a2f8a',fs:60,size:0.0022};
  const nt=[];all.forEach((q,j)=>{const s=labelSprite(j<12?'아군':'적군',j<12?TAGA:TAGF);s.center.set(0.5,0);s.position.y=2.02;q.p.add(s);nt.push(s)});
  [[G,'아군'],[EG,'적군']].forEach(([p,tx])=>{const s=labelSprite(tx,tx==='아군'?TAGA:TAGF);s.center.set(0.5,0);s.position.y=2.0;p.add(s);nt.push(s)});
  const lab=[];all.forEach((q,i)=>{if(i%2)return;const s=labelSprite(q.m?'민초':'반민초',{bg:q.m?'#9ef0d2':'#e8c9a8',fg:q.m?'#1d5a46':'#5a2e14',fs:64,size:0.0034});s.center.set(0.5,0);s.position.y=2.25;s.material.depthTest=false;q.p.add(s);s.visible=false;lab.push(s)});
  const bino=div('bino','<svg width="1080" height="1920"><defs><mask id="bm2"><rect width="1080" height="1920" fill="#fff"/><circle cx="350" cy="820" r="320" fill="#000"/><circle cx="730" cy="820" r="320" fill="#000"/></mask></defs><rect width="1080" height="1920" fill="#0b0b10" mask="url(#bm2)"/></svg>');
  const ch=div('stat3','<div>아군 · 적군</div><div style="font-size:52px;color:#999">↓</div><div><b style="color:#2fb98a">민초파</b> · <b style="color:#8a5a3c">반민초파</b></div>');ch.style.opacity=0;
  const C=cam(50);
  const look=(p,x,z)=>{p.rotation.y=Math.atan2(x-p.position.x,z-p.position.z)};
  return t=>{
    const rk=clamp01((t-REG)/(LOOK-0.3-REG));
    all.forEach((q,j)=>{const p=q.p;standPose(p);setFace(p,true);p.userData.head.rotation.set(0,0,0);
      const k=ease(clamp01(rk*1.25-q.d*0.25));p.position.set(q.x0+(q.tx-q.x0)*k,0,q.z0+(q.tz-q.z0)*k);
      if(k>0&&k<1){walkPose(p,t*7+q.ph,0.45);look(p,q.tx,q.tz)}else if(k>=1){p.rotation.y=0}else p.rotation.y=j<12?Math.PI:0;
      if(t<REG&&t>MUR-0.3&&j<12&&p!==M2){p.userData.head.rotation.y=(p.position.x>M2.position.x?-0.6:0.6)}   // 고백한 병사 쳐다봄
      if(t<REG&&t>fm2&&j>=12&&p!==F2&&p!==FE){p.userData.head.rotation.y=(p.position.x>F2.position.x?0.6:-0.6)}
      if(t<SH&&j<12)setFace(p,false)});
    lab.forEach(s=>{const on=rk>0.9&&!(t>LOOK-0.05&&t<TOP);scaleBubble(s,on?pop((rk-0.9)/0.1):0)});
    nt.forEach((s,i)=>{s.visible=i>=all.length||rk<0.9})
    // 민초 먹는 적 병사: 두리번 → 한 입
    standPose(FE);FE.userData.arms[1].rotation.x=-1.886;FE.userData.arms[1].rotation.z=-0.708;
    if(t<BI){FE.userData.head.rotation.y=Math.sin(t*6)*0.6*(t<EAT+0.5?1:0);if(t>EAT+0.5)FE.userData.head.rotation.x=0.25*Math.abs(Math.sin((t-EAT)*7))}
    IC.visible=true;FE.updateMatrixWorld(true);FE.userData.arms[1].children[1].getWorldPosition(_ic);IC.position.set(_ic.x+0.07,_ic.y+0.04,_ic.z+0.04);IC.rotation.set(0,0,0);
    // 망원경 병사
    standPose(B);if(t<sm1+1.6){B.userData.arms.forEach((a,i)=>{a.rotation.x=-2.3;a.rotation.z=i?0.5:-0.5});BN.visible=true;faceO(B,t>SH-0.2)}else{BN.visible=false;faceO(B,false)}
    // 민초파 고백
    if(t>HAND&&t<REG){handUp(M2,clamp01((t-HAND)/0.3)*0.9,1);setFace(M2,true)}
    if(t>fm2&&t<REG){F2.userData.head.rotation.y=Math.sin(t*9)*0.35;setFace(F2,false)}
    // 장군 · 적장
    standPose(G);standPose(EG);setFace(G,t<LOOK);setFace(EG,t<LOOK);
    MG.visible=t>gm1-0.4&&t<fm1;if(MG.visible)megaArm(G)
    const gk=ease(clamp01((t-REG-0.3)/(LOOK-0.4-REG)));
    G.position.set(1.0+(GT[0]-1.0)*gk,0,1.6+(GT[1]-1.6)*gk);EG.position.set(-1.6+(ET[0]+1.6)*gk,0,-11.6+(ET[1]+11.6)*gk);
    if(gk>0&&gk<1){walkPose(G,t*7,0.4);walkPose(EG,t*7+1,0.4);look(G,GT[0],GT[1]);look(EG,ET[0],ET[1])}
    else if(gk>=1){G.rotation.y=0;EG.rotation.y=0}
    else{G.rotation.y=Math.PI;EG.rotation.y=0}
    if(t>LOOK){G.userData.head.rotation.y=t>gm2-0.15?-0.95:0;EG.userData.head.rotation.y=t>eo2-0.15?0.95:0;faceO(G,t>gm2&&t<TOP);faceO(EG,t>eo2&&t<TOP);if(t>gm2)eyesBig(G,1.5);if(t>eo2)eyesBig(EG,1.5)}
    zm.material.opacity=0.35*clamp01((t-TOP)/0.6);zc.material.opacity=0.3*clamp01((t-TOP)/0.6);pm.visible=pc.visible=t>TOP;
    show(b1,t,sm1,gm1-0.2);show(b2,t,gm1,fm1);show(b3,t,fm1,sm2);show(b4,t,sm2,fm2);show(b5,t,fm2,REG);
    bq.forEach((b,i)=>show(b,t,i<5?MUR+i*0.06:fm2+0.8+(i-5)*0.06,REG));
    show(bG,t,gm2,TOP);show(bE,t,eo2,TOP);
    bino.style.opacity=t>BI&&t<SH-0.1?1:0;
    ch.style.opacity=t>TOP+0.3?1:0;ch.style.transform=`translateX(-50%) scale(${pop((t-TOP-0.3)/0.3)})`;
    // 카메라
    if(t<BI){const k=ease(t/BI);setCam(C,lerp3([FE.position.x+1.4,1.9,-7.6],[FE.position.x+1.0,1.85,-8.2],k),[FE.position.x,1.6,-10.2],44)}
    else if(t<SH-0.1){setCam(C,[B.position.x+0.2,2.1,-1.0],[FE.position.x,1.6,-10.2],12)}
    else if(t<gm1-0.1){setCam(C,[B.position.x-0.4,2.2,-2.2],[B.position.x,2.0,0.2],44)}
    else if(t<fm1-0.1){setCam(C,[1.5,2.4,-1.3],[1.0,2.25,1.6],44)}
    else if(t<sm2-0.1){setCam(C,[FE.position.x+0.6,2.0,-7.8],[FE.position.x,1.8,-10.2],44)}
    else if(t<fm2-0.1){const k=ease((t-sm2)/1.6);setCam(C,lerp3([M2.position.x+0.4,2.2,-2.4],[M2.position.x+0.3,2.15,-2.0],k),[M2.position.x,1.95,0.2],48)}
    else if(t<REG){setCam(C,[F2.position.x-0.5,2.2,-7.6],[F2.position.x,1.95,-10.2],48)}
    else if(t<LOOK){const k=ease((t-REG)/(LOOK-REG));setCam(C,lerp3([0,12,4],[0,13,3],k),[0,0,-5],52)}
    else if(t<TOP){setCam(C,[-2.1,2.6,5.6],[-2.1,1.95,-0.5],38)}
    else{const k=ease((t-TOP)/3);setCam(C,lerp3([0,10,3.5],[0,15,6],k),[0,0,-5],50)}
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 도파민 3% → 총싸움 질림 → 물총·눈싸움·베개 → 끝말잇기 =====
S[3]=()=>{
  setSky('#f2c79a','#fbe8d6 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf3e2cf,30,110);addLights(scene,{hemi:1.45,sun:0xffe2c0});
  const r=rng(91);borderField(scene,r,{g:0xa8b47a});
  // 장르별 세트
  const snowG=new THREE.Mesh(new THREE.PlaneGeometry(80,60),lamb(0xf4f8ff));snowG.rotation.x=-Math.PI/2;snowG.position.y=0.03;snowG.position.z=-5;scene.add(snowG);
  const SNOW=new THREE.Group();scene.add(SNOW);snowman(SNOW,-3.2,-2.2,1.1);snowman(SNOW,3.4,-8.2,1.1);
  for(const z of[-2.6,-7.6]){for(let i=0;i<9;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.35,14,10),smooth(0xffffff));b.scale.y=0.7;b.position.set((i-4)*0.7,0.25,z);SNOW.add(b)}}
  const rainbow=new THREE.Group();scene.add(rainbow);['#ff6b6b','#ffb36b','#ffe66b','#7be38a','#6bc5ff','#9d7bff'].forEach((c,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(6-i*0.22,0.11,6,40,Math.PI),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.75}));rainbow.add(m)});rainbow.position.set(0,0,-14);
  const tbl=new THREE.Group();scene.add(tbl);{const top=new THREE.Mesh(new THREE.BoxGeometry(9,0.1,1.4),lamb(0x9a7652));top.position.y=0.86;tbl.add(top);for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.86,0.1),lamb(0x6b5238));l.position.set(sx*4.3,0.43,sz*0.6);tbl.add(l)}tbl.position.z=-5}
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(4.6,0.9),new THREE.MeshBasicMaterial({map:canvasTex(1150,224,(x,w,h)=>{x.fillStyle='#2a2a2a';x.fillRect(0,0,w,h);x.fillStyle='#ffd84d';x.font=`900 108px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('끝말잇기 전쟁',w/2,h/2+4)})}));ban.position.set(0,3.4,-11.0);tbl.add(ban);ban.position.z=-6;
  const N=6,al=[],fo=[];
  for(let i=0;i<N;i++){const p=entpS(r,ALLY);scene.add(p);al.push({p,x:(i-2.5)*1.45,ph:r()*6});const q=entpS(r,FOE);scene.add(q);fo.push({p:q,x:(i-2.5)*1.45+0.2,ph:r()*6})}
  const G=entpG(r,GEN);scene.add(G);const EG=entpG(r,ENEMYG);scene.add(EG);
  const props=[];[...al,...fo].forEach((q,i)=>{const wg=waterGun(i<N?0x4fa8ff:0xff6bb5);q.p.userData.hip.add(wg);wg.position.set(0.12,0.62,0.4);
    const pl=pillow();q.p.userData.arms[1].add(pl);pl.position.set(0,-0.75,0);
    const sbl=new THREE.Mesh(new THREE.SphereGeometry(0.11,10,8),smooth(0xffffff));q.p.userData.arms[1].add(sbl);sbl.position.set(0,-0.68,0);props.push({wg,pl,sbl})});
  // 날아다니는 것들
  const jets=[];for(let i=0;i<60;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,5),basic(0x7fd0ff));scene.add(d);jets.push({d,i:i%(2*N),ph:r()})}
  const balls=[];for(let i=0;i<14;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,8),smooth(0xffffff));scene.add(b);balls.push({b,x:(r()-0.5)*7,ph:r(),dir:i%2?1:-1})}
  const feath=[];const fg=new THREE.PlaneGeometry(0.1,0.04);for(let i=0;i<120;i++){const m=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));scene.add(m);feath.push({m,x:(r()-0.5)*8,z:-5+(r()-0.5)*4,ph:r(),sp:0.4+r()*0.6})}
  const E=EV(3),gq=at(3,'gq'),en=at(3,'en'),gw=at(3,'gw'),eo=at(3,'eo'),ne=at(3,'ne'),MO=E.mont,WD=E.word,END=E.end;
  const D=WD-MO;const P1=MO,P2=MO+D/3,P3=MO+2*D/3;
  const b1=sb(scene,'총싸움 좀 질리지 않냐?',0,2.95,-4.55,{c:{bg:'#ffe0dc',fg:'#5a1a12'},size:0.0026}),b2=sb(scene,'어, 나도 그 말 하려고 했는데',0,2.95,-5.45,{c:FB,size:0.0019}),b3=sb(scene,'내일은 물총 어때?',0,2.95,-4.55,{c:{bg:'#ffe0dc',fg:'#5a1a12'},size:0.0021}),b4=sb(scene,'오, 좋아.',0,2.95,-5.45,{c:FB,size:0.0024});
  const W1=bubS(G,'전쟁!',{size:0.0026}),W2=bubF(EG,'쟁반!',{size:0.0026}),W3=bubS(G,'반장!!',{size:0.0026});
  const dopa=dopaEl();const ch=div('stat3','<div>전쟁 장르 변경 <b class="n">0</b>회</div><div class="g" style="font-size:54px;color:#555">총싸움</div>');ch.style.opacity=0;
  const dim=div('dim');const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');e1.style.top='560px';e2.style.top='720px';
  const C=cam(50);
  return t=>{
    const mode=t<P1?0:t<P2?1:t<P3?2:t<WD?3:4; // 0 총, 1 물총, 2 눈, 3 베개, 4 끝말잇기
    snowG.visible=SNOW.visible=mode===2;rainbow.visible=mode===1;tbl.visible=mode===4;
    rainbow.children.forEach(m=>m.material.opacity=0.75*clamp01((t-P1-0.2)/0.4));
    const tt=t*1.0;
    al.forEach((q,i)=>{const p=q.p;standPose(p);setFace(p,mode>0);noRifle(p);const pr=props[i];pr.wg.visible=mode===1;pr.pl.visible=mode===3;pr.sbl.visible=mode===2;
      p.rotation.y=Math.PI;p.position.set(q.x,0,mode===4?-4.15:-2.0);
      if(mode===0){aim(p);p.userData.hip.rotation.x=0;wiggle(p,t,q.ph,0.6)}
      if(mode===1){aim(p);noRifle(p);pr.wg.visible=true;p.position.x=q.x+Math.sin(t*4+q.ph)*0.25}
      if(mode===2){const s=Math.sin(t*9+q.ph);p.userData.arms[1].rotation.x=-1.5-1.3*Math.max(0,s);p.position.x=q.x+Math.sin(t*3+q.ph)*0.3}
      if(mode===3){const s=Math.sin(t*10+q.ph);p.userData.arms[1].rotation.x=-2.6+1.4*Math.max(0,s);p.userData.arms[1].rotation.z=0.4;p.position.z=-3.6;p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*7+q.ph))*0.12}
      if(mode===4){sitPose(p);p.position.z=-4.15}});
    fo.forEach((q,i)=>{const p=q.p;standPose(p);setFace(p,mode>0);noRifle(p);const pr=props[N+i];pr.wg.visible=mode===1;pr.pl.visible=mode===3;pr.sbl.visible=mode===2;
      p.rotation.y=0;p.position.set(q.x,0,mode===4?-5.85:-8.0);
      if(mode===0){aim(p);wiggle(p,t,q.ph+2,0.6)}
      if(mode===1){aim(p);noRifle(p);pr.wg.visible=true;p.position.x=q.x+Math.sin(t*4+q.ph)*0.25}
      if(mode===2){const s=Math.sin(t*9+q.ph);p.userData.arms[1].rotation.x=-1.5-1.3*Math.max(0,s);p.position.x=q.x+Math.sin(t*3+q.ph)*0.3}
      if(mode===3){const s=Math.sin(t*10+q.ph+1);p.userData.arms[1].rotation.x=-2.6+1.4*Math.max(0,s);p.userData.arms[1].rotation.z=-0.4;p.position.z=-6.4;p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*7+q.ph))*0.12}
      if(mode===4){sitPose(p);p.position.z=-5.85}});
    // 장군 · 적장
    standPose(G);standPose(EG);
    if(mode===0){G.position.set(-0.45,0,-4.1);EG.position.set(0.45,0,-5.9);G.rotation.y=Math.atan2(0.9,-1.8);EG.rotation.y=Math.atan2(-0.9,1.8);setFace(G,t>gw-0.2);setFace(EG,t>eo-0.2);aim(G);aim(EG);
      if(t<gq+0.2){const y=clamp01((t-0.3)/0.3)*(1-clamp01((t-gq+0.2)/0.3));G.userData.head.rotation.x=-0.4*y;faceO(G,y>0.3);EG.userData.head.rotation.x=-0.3*y}else{faceO(G,false)}
      if(t>eo-0.3){noRifle(EG);handUp(EG,1,0)}}
    else if(mode<4){G.position.set(-1.6,0,-2.6);EG.position.set(1.8,0,-7.4);G.rotation.y=Math.PI;EG.rotation.y=0;noRifle(G);noRifle(EG);setFace(G,true);setFace(EG,true);handUp(G,0.6+0.4*Math.sin(t*8),1);handUp(EG,0.6+0.4*Math.sin(t*8+1),1)}
    else{noRifle(G);noRifle(EG);G.position.set(-0.3,0,-4.0);G.rotation.y=Math.PI;EG.position.set(0.5,0,-6.0);EG.rotation.y=0;setFace(G,true);setFace(EG,true);
      const w=t-WD;if(w>0.3&&w<1.6||w>3.0){handUp(G,1,1)}if(w>1.6&&w<3.0)point(EG,1,1.2)}
    // 날아다니는 것
    jets.forEach(q=>{q.d.visible=mode===1;if(mode!==1)return;const lt=(t*1.6+q.ph)%1;const ally=q.i<N;const sx=ally?al[q.i].p.position.x:fo[q.i-N].p.position.x;const z0=ally?-2.4:-7.6,z1=ally?-7.6:-2.4;q.d.position.set(sx+lt*0.3,1.4+Math.sin(lt*Math.PI)*0.7,z0+(z1-z0)*lt)});
    balls.forEach(q=>{q.b.visible=mode===2;if(mode!==2)return;const lt=(t*1.2+q.ph)%1;const z0=q.dir>0?-2.3:-7.7,z1=q.dir>0?-7.7:-2.3;q.b.position.set(q.x,1.6+Math.sin(lt*Math.PI)*1.6,z0+(z1-z0)*lt)});
    feath.forEach(q=>{q.m.visible=mode===3;if(mode!==3)return;const lt=(t*q.sp*0.5+q.ph)%1;q.m.position.set(q.x+Math.sin(t*2+q.ph*9)*0.4,0.3+(1-lt)*3.2,q.z);q.m.rotation.set(t*3+q.ph*5,t*2,q.ph*3)});
    show(b1,t,gq,en);show(b2,t,en,gw);show(b3,t,gw,eo);show(b4,t,eo,MO);
    show(W1,t,WD+0.3,WD+1.6);show(W2,t,WD+1.6,WD+3.0);show(W3,t,WD+3.0,END);
    setDopa(dopa,3,t,0.05);dopa.style.opacity=t<MO?1:0;
    const n=t<MO?0:t<WD?Math.min(46,Math.floor((t-MO)/D*46)+1):47;ch.querySelector('.n').textContent=n;
    ch.querySelector('.g').textContent=['총싸움','물총 전쟁','눈싸움','베개 싸움','끝말잇기'][mode];
    ch.style.opacity=t>MO&&t<END?1:0;ch.style.transform=`translateX(-50%) scale(${pop((t-MO)/0.3)})`;
    const fl2=[P1,P2,P3,WD].some(x=>t>x&&t<x+0.12);if(fl2)ch.style.transform+=` scale(1.06)`;
    dim.style.opacity=t>END?clamp01((t-END)/0.3):0;e1.style.opacity=t>END?1:0;e2.style.opacity=t>END+0.2?1:0;popEl(e1,t,END);popEl(e2,t,END+0.2);
    // 카메라
    if(mode===0){if(t<gq-0.1){const k=ease(t/gq);setCam(C,lerp3([4,7,3],[3,5,0],k),[0,1.0,-5],52)}
      else{const k=ease((t-gq)/(MO-gq));setCam(C,lerp3([7.2,2.6,-5.0],[6.8,2.55,-5.0],k),[0,2.0,-5],38)}}
    else if(mode===1){const k=(t-P1)/(P2-P1);setCam(C,[2.5-k*0.8,5.5,1.5-k*0.4],[0,0.8,-5.5],55)}
    else if(mode===2){const k=(t-P2)/(P3-P2);setCam(C,[-2.5+k*0.8,5.8,1.2-k*0.4],[0,0.8,-5.5],55)}
    else if(mode===3){const k=(t-P3)/(WD-P3);setCam(C,[0.5,6.0-k*0.6,1.8-k*0.5],[0,0.9,-5.5],55)}
    else{const k=ease((t-WD)/3.5);setCam(C,lerp3([0.2,3.4,0.8],[0.2,3.6,1.4],k),[0.1,1.6,-5.5],50)}
    caption(3,t);renderer.render(scene,C);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
