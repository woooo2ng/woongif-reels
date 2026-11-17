
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
function eyesBig(p,k){p.userData.head.children.forEach(c=>{if(c.geometry&&c.geometry.parameters&&c.geometry.parameters.height===0.07)c.scale.y=k})}
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

// ===== 0. 국경 대치 → 지루함 → '선전포고 언제 함?' (타이틀) =====
S[0]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(31);borderField(scene,r);
  const al=[];for(let i=0;i<12;i++){const p=entpS(r,ALLY);p.position.set((i-5.5)*1.35,0,0.2+(i%2)*0.25);p.rotation.y=Math.PI;setFace(p,false);scene.add(p);aim(p);noRifle(p);al.push({p,ph:r()*6})}
  const fo=[];for(let i=0;i<12;i++){const p=entpS(r,FOE);p.position.set((i-5.5)*1.35,0,-10.2-(i%2)*0.25);setFace(p,false);scene.add(p);fo.push({p,ph:r()*6})}
  const G=entpG(r,GEN);G.position.set(0.3,0,-1.9);scene.add(G);setFace(G,false);const MG=holdIn(G,megaphone(),1,0,-0.62,0.12);MG.rotation.x=Math.PI/2;MG.visible=false;
  const EG=entpG(r,ENEMYG);EG.position.set(0,0,-8.6);scene.add(EG);setFace(EG,false);
  const S1=al[6].p;
  const E=EV(0),g1=at(0,'g1'),SKIP=E.skip,s1=at(0,'s1'),g2=at(0,'g2'),g3=at(0,'g3'),MEGA=E.mega;
  const b1=bubS(G,'절대 움직이지 마라',{size:0.0017}),b2=bubS(S1,'장군님… 지루합니다',{size:0.004}),b3=bubS(G,'나도.',{size:0.0019}),b4=bubS(G,'야! 선전포고 언제 함?',{size:0.0017});
  const C=cam(50);const ch=chip('대치 3분째');ch.style.opacity=0;
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ENTP × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ENTP인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  return t=>{
    const bored=clamp01((t-SKIP)/0.4);
    al.forEach(q=>{standPose(q.p);if(bored>0){wiggle(q.p,t,q.ph,bored);q.p.userData.arms[0].rotation.x=-0.2*bored}});
    fo.forEach(q=>{standPose(q.p);if(bored>0)wiggle(q.p,t,q.ph+2,bored*0.8)});
    standPose(G);standPose(EG);
    // 장군: 명령(병사 쪽) → 하품 → 뒤돌아 확성기
    let gy=0;
    if(t<SKIP){gy=0;point(G,clamp01((t-g1)/0.2)*(t<SKIP-0.3?1:0),1.2)}
    else if(t<MEGA-0.4){const yk=clamp01((t-SKIP-0.2)/0.3)*(1-clamp01((t-s1+0.1)/0.3));G.userData.head.rotation.x=-0.45*yk;const a=G.userData.arms[0];a.rotation.x=-2.3*yk;a.rotation.z=-0.6*yk;
      faceO(G,yk>0.3);if(t>g2-0.1){faceO(G,false);setFace(G,false);const sh=clamp01((t-g2)/0.2)*(1-clamp01((t-g2-0.7)/0.2));G.userData.arms.forEach((a,i)=>{a.rotation.z=(i?0.7:-0.7)*sh;a.rotation.x=-0.3*sh})}}
    if(t>=MEGA-0.4){const k=ease((t-MEGA+0.4)/0.4);gy=Math.PI*k;faceO(G,false);setFace(G,true);
      const a=G.userData.arms[1];a.rotation.x=-1.6*k;a.rotation.z=-0.35*k;MG.visible=k>0.5;}
    G.rotation.y=gy;
    show(b1,t,g1+0.1,SKIP);show(b2,t,s1,g2);show(b3,t,g2,g2+0.9);show(b4,t,g3,99);
    S1.userData.head.rotation.x=t>s1&&t<g2+0.4?-0.15:S1.userData.head.rotation.x;
    // 카메라
    if(t<g1-0.15){const k=ease(t/(g1-0.15));setCam(C,[0,6.5-k*1.2,9.5-k*1.5],[0,1.2,-6],52)}
    else if(t<SKIP){const k=ease((t-g1+0.15)/2.5);setCam(C,lerp3([1.8,2.9,3.2],[1.4,2.7,2.4],k),[0.3,2.1,-1.9],46)}
    else if(t<g2-0.1){const k=ease((t-SKIP)/2.4);setCam(C,lerp3([0,7,9],[2,5,7.5],k),[0,1.4,-2.5],52)}
    else if(t<MEGA){setCam(C,[1.3,2.7,2.3],[0.3,2.1,-1.9],44)}
    else{const k=ease((t-MEGA)/1.2);setCam(C,lerp3([2.4,2.5,-5.6],[2.0,2.6,-6.4],k),[0.3,2.3,-1.9],46)}
    const TO=g1+0.15;
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t3.style.transform=`scale(${pop((t-0.6)/0.4)})`;
    [tag,t1,t2,t3].forEach((e,i)=>e.style.opacity=t<TO?clamp01((t-i*0.2)/0.1):clamp01(1-(t-TO)/0.2));
    ch.style.opacity=t>SKIP&&t<g2-0.1?1:0;chipPop(ch,t,SKIP);if(t<SKIP)ch.style.opacity=0;
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. '넘으면 쏜다' → 국경선 걸치기 → 깐족 =====
S[1]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(41);borderField(scene,r);
  signBoard(scene,'넘으면 발포',2.6,-5.6,0);signBoard(scene,'넘으면 발포',-6.5,-5.6,0);
  const al=[];for(let i=0;i<12;i++){const p=entpS(r,ALLY);const x=(i-5.5)*1.35;p.position.set(x,0,0.2);p.rotation.y=Math.PI;scene.add(p);al.push({p,x,ph:r()*6,d:Math.abs(i-6)*0.04})}
  const fo=[];for(let i=0;i<12;i++){const p=entpS(r,FOE);p.position.set((i-5.5)*1.35+0.3,0,-10.2);setFace(p,false);scene.add(p);fo.push({p,ph:r()*6,d:r()*0.25})}
  const S1=al[6].p;const SX=al[6].x;
  const EG=entpG(r,ENEMYG);EG.position.set(-1.2,0,-8.4);scene.add(EG);setFace(EG,false);const MG=holdIn(EG,megaphone(),1,0,-0.62,0.12);MG.rotation.x=Math.PI/2;
  const F1=fo[6].p;  // 부들부들 적 병사
  const sweat=[];for(let i=0;i<2;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),basic(0x9fd8ff));F1.userData.head.add(d);d.position.set(i?0.2:-0.2,0.38,0.12);sweat.push(d)}
  const E=EV(1),e1=at(1,'e1'),s2=at(1,'s2'),s3=at(1,'s3'),e2=at(1,'e2'),n2=at(1,'n2'),cr=at(1,'crowd'),LOOK=E.look,STEP=E.step,LAND=E.land,ALL=E.all,SHAKE=E.shake;
  const b1=bubF(EG,'넘어오면 바로 쏜다!',{size:0.0016}),b2=bubS(S1,"'넘는다'가 어디부터임?",{size:0.0034}),b3=bubS(S1,'넘은 건 아님. 걸친 거임.',{size:0.0015}),b4=bubF(EG,'…규칙상 맞긴 한데',{size:0.0016});
  const cb=[3,5,8].map(i=>bubS(al[i].p,'쏴 봐~',{size:0.0042}));
  const C=cam(50);
  return t=>{
    standPose(EG);
    const ek=t<s2-0.3?1:0;if(ek){const a=EG.userData.arms[1];a.rotation.x=-1.6;a.rotation.z=-0.35;MG.visible=true;point(EG,0);EG.userData.arms[0].rotation.x=-1.0;EG.userData.arms[0].rotation.z=0.5;setFace(EG,true)}
    else{MG.visible=false;setFace(EG,false)}
    if(t>e2-0.6&&t<e2+0.2){const k=clamp01((t-e2+0.6)/0.25);handUp(EG,k*0.8);}
    if(t>e2-0.2){EG.userData.head.rotation.y=0.9*clamp01((t-e2+0.2)/0.3)}else EG.userData.head.rotation.y=0;
    // 아군 병사 1: 내려다봄 → 천천히 걸어감 → 발끝 착지
    al.forEach(q=>{standPose(q.p);setFace(q.p,true)});
    const walkK=clamp01((t-STEP)/(LAND-STEP));
    let sz=0.2-walkK*5.05;if(t>STEP&&t<LAND)walkPose(S1,(t-STEP)*4.5,0.35);
    S1.position.z=sz;S1.userData.head.rotation.x=t>LOOK&&t<STEP+0.4?0.45:(t>STEP&&t<LAND?0.2:0);
    // 전원 국경선 위 한 발
    al.forEach((q,i)=>{if(q.p===S1){if(t>LAND){oneLeg(S1,clamp01((t-LAND-0.1)/0.25)*(t>s3?1:0.5),t,q.ph);}return}
      const k=clamp01((t-ALL-q.d)/0.5);q.p.position.z=0.2-ease(k)*5.05;if(k>0&&k<1)walkPose(q.p,t*10,0.5);if(k>=1)oneLeg(q.p,clamp01((t-ALL-q.d-0.5)/0.2),t,q.ph)});
    // 적군 조준
    fo.forEach(q=>{standPose(q.p);const k=clamp01((t-STEP-0.35-q.d)/0.15);if(k>0)aim(q.p);else noRifle(q.p);setFace(q.p,false)});
    const shake=t>SHAKE-1.5?Math.sin(t*70)*0.02:0;F1.position.x=fo[6].p.userData.x0??F1.position.x;F1.userData.hip.position.x=shake;
    sweat.forEach((d,i)=>{d.visible=t>STEP+0.6;d.position.y=0.38-((t*0.8+i*0.5)%1)*0.3});
    show(b1,t,e1+0.05,s2-0.3);show(b2,t,s2,STEP);show(b3,t,s3,e2);show(b4,t,e2,n2+0.3);cb.forEach((b,i)=>show(b,t,cr+i*0.15,99));
    // 카메라
    if(t<s2-0.4){const k=ease(t/2.2);setCam(C,lerp3([-0.2,2.3,-4.0],[-0.5,2.3,-4.6],k),[-1.2,2.3,-8.4],46)}
    else if(t<STEP){setCam(C,[SX+0.5,0.5,-6.2],[SX,1.25,0.2],52)}
    else if(t<LAND-0.3){setCam(C,[SX-0.9,2.2,S1.position.z+2.2],[SX+0.2,1.1,-9.5],50)}
    else if(t<s3-0.05){setCam(C,[SX+2.6,1.0,-8.2],[SX,0.45,-5.0],40)}
    else if(t<e2-0.2){setCam(C,[SX+1.0,2.2,-8.2],[SX,2.05,-4.9],46)}
    else if(t<ALL){setCam(C,[-0.5,2.3,-4.6],[-1.2,2.3,-8.4],46)}
    else if(t<SHAKE-0.2){const k=ease((t-ALL)/2.2);setCam(C,lerp3([0.5,5.2,-17],[0.3,4.6,-16],k),[0,1.3,-4.5],46)}
    else{setCam(C,[F1.position.x+0.9+Math.sin(t*60)*0.01,2.0,-7.6],[F1.position.x,1.5,-10.2],44)}
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 공포탄 → 케첩 몰카 → 도파민 =====
S[2]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(51);borderField(scene,r);
  const al=[];for(let i=0;i<12;i++){if(i>=5&&i<=7)continue;const p=entpS(r,ALLY);p.position.set((i-5.5)*1.35,0,-4.85);p.rotation.y=Math.PI;scene.add(p);al.push({p,ph:r()*6,x:(i-5.5)*1.35})}
  const fo=[];for(let i=0;i<12;i++){if(i===6)continue;const p=entpS(r,FOE);p.position.set((i-5.5)*1.35+0.3,0,-10.2);setFace(p,false);scene.add(p);aim(p);fo.push({p,ph:r()*6})}
  // 쓰러지는 아군 병사 (발 기준 피벗)
  const PV=new THREE.Group();PV.position.set(0.3,0,-4.85);PV.rotation.y=Math.PI;scene.add(PV);
  const A=entpS(r,ALLY);PV.add(A);const ST=stain(A);
  const KB=ketchup();holdIn(A,KB,1,0,-0.66,0.05);KB.visible=false;
  const sign=labelSprite('몰래카메라',{bg:'#ffe066',fg:'#c8231b',fs:80,size:0.0019});sign.center.set(0.5,0);A.userData.arms[0].add(sign);sign.position.set(0,-0.75,0.15);sign.visible=false;
  const F=entpS(r,FOE);F.position.set(0.3,0,-10.0);scene.add(F);setFace(F,false);const M=mag();scene.add(M);
  const E=EV(2),f1=at(2,'f1'),s4=at(2,'s4'),f2=at(2,'f2'),s5=at(2,'s5'),n3=at(2,'n3'),LOAD=E.load,SHOT=E.shot,RUN=E.run,UP=E.up,WIDE=E.wide;
  const flash=glowSprite('rgba(255,230,140,1)',1.2);scene.add(flash);
  const drops=[];for(let i=0;i<14;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,6),basic(0xd4241c));scene.add(d);d.visible=false;drops.push(d)}
  const T=tears(scene,8);
  const b1=bubF(F,'경고 사격이다!',{size:0.0022}),b2=bubS(A,'장군님… 제 몫까지…',{size:0.0014,y:1.0}),b3=bubF(F,'공포탄인데?!',{size:0.0018,y:1.6}),b4=bubF(F,'미안해!!',{size:0.0018,y:1.6}),b5=bubS(A,'몰카였죠~? ㅋㅋㅋ',{size:0.0015,y:2.3}),b6=bubF(F,'……',{size:0.0018,y:1.6});
  // 전장 곳곳 몰카
  const mini=[];al.concat(fo.map(q=>({p:q.p,ph:q.ph}))).forEach((q,i)=>{const s=labelSprite('몰카',{bg:'#ffe066',fg:'#c8231b',fs:70,size:0.004});s.center.set(0.5,0);s.position.set(0,2.2,0);s.material.depthTest=false;q.p.add(s);mini.push({p:q.p,s,ph:(i*0.37)%1})});
  const dopa=dopaEl();const st=div('stat3','<div>전사 <b>0명</b></div><div>몰카 <b class="c">0</b>건</div><div>케첩 소비량 <b>+3,000%</b></div>');st.style.top='450px';st.style.opacity=0;
  const C=cam(50);const _h=new THREE.Vector3();
  return t=>{
    // 적 병사 F: 탄창 장전 → 하늘로 경고 사격 → 달려와 무릎
    standPose(F);let fz=-10.0,fx=0.3;
    if(t<RUN){aim(F);const up=clamp01((t-f1+0.2)/0.3);F.userData.arms.forEach(a=>a.rotation.x-=0.9*up);F.userData.rifle.rotation.x=-0.9*up;F.userData.rifle.position.set(0.12,0.62+0.3*up,0.45-0.15*up)}
    else{noRifle(F);const k=clamp01((t-RUN)/1.1);fz=-10.0+ease(k)*4.0;if(k<1)runPose(F,t*13);else{kneel(F);F.userData.arms.forEach((a,i)=>{a.rotation.x=-1.2;a.rotation.z=i?-0.4:0.4})}}
    F.position.set(fx,0,fz);F.rotation.y=0;
    const lk=clamp01((t-LOAD)/0.5);M.visible=t<f1;F.updateMatrixWorld(true);
    if(F.userData.rifle){F.userData.rifle.getWorldPosition(_h);M.position.set(_h.x,_h.y-0.32+0.18*ease(lk),_h.z+0.08)}
    // 총구 섬광
    flash.visible=t>SHOT&&t<SHOT+0.12;if(F.userData.rifle){F.userData.rifle.getWorldPosition(_h);flash.position.set(_h.x,_h.y+0.7,_h.z+0.2)}
    // 아군 A: 맞은 척 슬로모션 → 누움 → 벌떡 + 케첩
    standPose(A);let fall=0;
    if(t>SHOT+0.1&&t<UP){fall=ease((t-SHOT-0.1)/1.6);A.userData.arms.forEach((a,i)=>{a.rotation.x=-1.4;a.rotation.z=i?0.9:-0.9});setFace(A,false);A.userData.head.rotation.x=-0.3*fall}
    if(t>=UP){fall=Math.max(0,1-ease((t-UP)/0.25));setFace(A,true);
      const a=A.userData.arms[1];a.rotation.x=-1.4;a.rotation.z=-0.2;KB.visible=true;KB.rotation.x=1.4;
      const sa=A.userData.arms[0];sa.rotation.x=-2.5;sa.rotation.z=-0.4;sign.visible=true;}
    else{KB.visible=false;sign.visible=false}
    PV.rotation.x=0;A.rotation.x=-fall*1.45;
    ST.scale.setScalar(t>SHOT+0.4?Math.min(1.2,0.2+(t-SHOT-0.4)*0.5):0.01);
    // 케첩 줄기
    const sq=t>UP+0.25&&t<UP+1.4;KB.updateMatrixWorld(true);KB.getWorldPosition(_h);
    drops.forEach((d,i)=>{d.visible=sq;if(!sq)return;const lt=((t-UP)*2.2+i/drops.length)%1;d.position.set(_h.x+lt*0.05,_h.y+0.1-lt*1.1+Math.sin(lt*Math.PI)*0.25,_h.z+0.25+lt*0.45)});
    F.updateMatrixWorld(true);F.userData.head.getWorldPosition(_h);updTears(T,t,t>f2-0.1&&t<UP+0.2,{x:_h.x,y:_h.y+0.27,z:_h.z+0.2});
    // 주변 병사
    al.forEach(q=>{standPose(q.p);setFace(q.p,true);q.p.userData.hip.rotation.x=0});fo.forEach(q=>{standPose(q.p);if(t<WIDE)aim(q.p);else noRifle(q.p)});
    const wk=t>WIDE;mini.forEach(q=>{if(!wk){q.s.visible=false;q.p.rotation.x=0;return}
      const lt=((t-WIDE)*0.6+q.ph)%1;const dn=lt<0.4?Math.sin(lt/0.4*Math.PI/2):lt<0.55?1:Math.max(0,1-(lt-0.55)/0.1);
      const base=q.p.rotation.y;q.p.userData.hip.rotation.x=-dn*1.1;q.p.userData.hip.position.y=0.8-dn*0.45;
      q.s.visible=lt>0.62;q.s.scale.set(q.s.userData.base[0]*pop((lt-0.62)/0.1),q.s.userData.base[1]*pop((lt-0.62)/0.1),1)});
    show(b1,t,f1,SHOT+0.3);show(b2,t,s4,f2-0.2);show(b3,t,f2,f2+1.1);show(b4,t,f2+1.1,UP);show(b5,t,s5,s5+1.9);show(b6,t,s5+0.6,s5+1.9);
    // 도파민 게이지 · 통계
    const DT=s5+1.75;setDopa(dopa,t<DT?0:Math.min(100,(t-DT)*260),t,DT);if(t>WIDE-0.1)dopa.style.opacity=0;
    st.style.opacity=t>WIDE+0.6?1:0;st.style.transform=`translateX(-50%) scale(${pop((t-WIDE-0.6)/0.3)})`;st.querySelector('.c').textContent=fmt(Math.min(1204,Math.max(0,(t-WIDE-0.6)*420)));
    // 카메라
    if(t<f1-0.1){setCam(C,[1.6,1.5,-8.2],[0.4,1.15,-9.9],36)}
    else if(t<SHOT+0.1){setCam(C,[2.2,1.6,-6.8],[0.3,1.9,-9.8],50)}
    else if(t<s4-0.2){const k=ease((t-SHOT-0.1)/1.7);setCam(C,lerp3([2.6,2.3,-8.8],[2.3,2.0,-8.2],k),lerp3([0.3,1.2,-4.6],[0.3,0.6,-4.0],k),46)}
    else if(t<RUN){setCam(C,[2.3,2.0,-8.2],[0.3,0.6,-4.0],46)}
    else if(t<UP-0.1){setCam(C,[2.4,2.1,-2.4],[0.7,1.0,-5.2],50)}
    else if(t<DT){setCam(C,[2.4,2.2,-8.2],[0.3,1.5,-5.0],48)}
    else if(t<WIDE){const k=ease((t-DT)/0.6);setCam(C,lerp3([0.35,1.95,-6.6],[0.35,1.9,-6.0],k),[0.3,1.75,-4.85],40)}
    else{const k=ease((t-WIDE)/5);setCam(C,lerp3([10,6,-1],[9,7,-2],k),[0,0.8,-7],52)}
    // 도파민 클로즈업 반짝이
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 부먹 발견 → 탕수육 토론 → 편 바꾸기 → 9시간 =====
S[3]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(61);borderField(scene,r);
  // 적진 점심 테이블
  table(scene,6,-13.5,1.6,1.0,0x8a6a4a);const TS1=tangsu(scene,6,0.93,-13.5,1);
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.08,0.1,14),lamb(0xf4f4f4));scene.add(bowl);
  const EG=entpG(r,ENEMYG);EG.position.set(6,0,-14.35);scene.add(EG);
  // 아군 망원경 병사 + 장군
  const B=entpS(r,ALLY);B.position.set(2.0,0,0.4);B.rotation.y=Math.PI-0.35;scene.add(B);const BN=binoc();B.userData.head.add(BN);BN.position.set(0,0.25,0.32);
  const G=entpG(r,GEN);G.position.set(0.8,0,0.9);G.rotation.y=Math.PI-0.2;scene.add(G);const MG=holdIn(G,megaphone(),1,0,-0.62,0.12);MG.rotation.x=Math.PI/2;MG.visible=false;
  // 토론 테이블 (국경선 위)
  table(scene,0,-5,2.6,1.1,0x9a7652);const TS2=tangsu(scene,0,0.93,-5,1.05);TS2.userData.sauce.scale.setScalar(1);
  micStand(scene,-0.7,-4.7);micStand(scene,0.7,-5.3);
  const watchA=[],watchF=[];for(let i=0;i<9;i++){const p=entpS(r,ALLY);p.position.set((i-4)*0.9,0,-2.4-Math.abs(i-4)*0.15);p.rotation.y=Math.PI;scene.add(p);watchA.push(p);
    const q=entpS(r,FOE);q.position.set((i-4)*0.9,0,-7.6+Math.abs(i-4)*0.15);scene.add(q);watchF.push(q)}
  const E=EV(3),s6=at(3,'s6'),g4=at(3,'g4'),e3=at(3,'e3'),g5=at(3,'g5'),e4=at(3,'e4'),n4=at(3,'n4'),TBL=E.table,FL=E.flurry,SW=E.swap,LP=E.lapse,COLD=E.cold;
  const bS=bubS(B,'적장이… 부먹입니다!',{size:0.0016}),bG=bubS(G,'부먹은 탕수육에 대한 모독임',{size:0.0015});
  const ARG=['근거 1: 바삭함 보존','근거 2: 선택권 존중','근거 3: 소스는 거들 뿐','반박 받음','재반박 함'];
  const bA=ARG.map((s,i)=>sb(scene,s,(i%2?0.45:-0.55),2.45+(i%3)*0.3,-4.4,{c:AB,size:0.0016}));
  const bEdots=sb(scene,'…',0.8,2.55,-5.7,{c:FB,size:0.003});
  const bG5=sb(scene,'…이기니까 재미없네',-0.8,2.75,-4.3,{c:AB,size:0.0022});const bE4=sb(scene,'오 그럼 나 찍먹',0.8,2.75,-5.7,{c:FB,size:0.0022});
  const LB=['찍먹이 맞다니까','아니 부먹이 맞음','근거 있음?','반박함','그것도 반박함','오 인정','근데 반대로 보면'];
  const bL=LB.map((s,i)=>sb(scene,s,(i%2?0.45:-0.45),2.6+((i*0.37)%1)*0.6,(i%2?-5.7:-4.3),{c:i%2?FB:AB,size:0.0022}));
  // 토론자: 아군 장군 G2(남쪽 z=-4.3, 북쪽 바라봄) · 적장 E2(북쪽)
  const G2=entpG(r,GEN);scene.add(G2);const E2=entpG(r,ENEMYG);scene.add(E2);const bE=bubF(E2,'근거 있음?',{size:0.0024});
  const dopa=dopaEl();const ch=div('stat3','<div>토론 <b class="h">0</b>시간째</div><div>입장 바꾼 횟수 <b class="n">0</b>회</div>');ch.style.opacity=0;
  const bino=div('bino','<svg width="1080" height="1920"><defs><mask id="bm"><rect width="1080" height="1920" fill="#fff"/><circle cx="350" cy="820" r="320" fill="#000"/><circle cx="730" cy="820" r="320" fill="#000"/></mask></defs><rect width="1080" height="1920" fill="#0b0b10" mask="url(#bm)"/></svg>');const C=cam(50);const _h=new THREE.Vector3();
  return t=>{
    // 하늘 타임랩스
    const lk=clamp01((t-LP)/2.0);setSky(lerpCol('#a9c9e8','#1d2346',lk),lerpCol('#eef4f8','#5a4c7a',lk)+' 70%');
    // 적장 점심: 소스 붓기
    standPose(EG);const pour=clamp01((t-0.3)/1.4);EG.userData.arms[1].rotation.x=-1.2;EG.userData.arms[1].rotation.z=-0.2;
    EG.updateMatrixWorld(true);EG.userData.arms[1].children[1].getWorldPosition(_h);bowl.position.set(_h.x,_h.y+0.05,_h.z+0.08);bowl.rotation.x=0.9*ease(pour);
    TS1.userData.sauce.scale.setScalar(Math.max(0.01,ease((pour-0.3)/0.7)));
    // 망원경 병사 · 장군
    standPose(B);B.userData.arms.forEach((a,i)=>{a.rotation.x=-2.3;a.rotation.z=i?0.5:-0.5});faceO(B,t>s6-0.2);BN.visible=true;
    standPose(G);setFace(G,true);if(t>g4-0.35){const a=G.userData.arms[1];a.rotation.x=-1.6;a.rotation.z=-0.35;MG.visible=true}else MG.visible=false;
    show(bS,t,s6,g4);show(bG,t,g4,TBL);
    // 토론 테이블
    const swk=clamp01((t-SW)/1.6);
    const gA=[-0.6,-4.35],gB=[0.6,-5.65];
    // 아군 장군: 남쪽에서 → 북쪽으로 / 적장: 북쪽 → 남쪽
    function walkAround(p,from,to,k,side){const mid=[side*1.9,-5];let pos;if(k<0.5){pos=lerp3([from[0],0,from[1]],[mid[0],0,mid[1]],ease(k*2))}else pos=lerp3([mid[0],0,mid[1]],[to[0],0,to[1]],ease((k-0.5)*2));p.position.set(pos[0],0,pos[2]);
      if(k>0&&k<1){walkPose(p,t*9,0.5);p.rotation.y=Math.atan2((k<0.5?mid[0]-from[0]:to[0]-mid[0]),(k<0.5?mid[1]-from[1]:to[1]-mid[1]))}else{standPose(p);p.rotation.y=pos[2]>-5?Math.PI:0}}
    standPose(G2);standPose(E2);walkAround(G2,gA,[gB[0]-1.2,gB[1]],swk,-1);walkAround(E2,gB,[gA[0]+1.2,gA[1]],swk,1);
    if(swk===0){G2.position.set(gA[0],0,gA[1]);G2.rotation.y=Math.PI;E2.position.set(gB[0],0,gB[1]);E2.rotation.y=0}
    setFace(G2,!(t>FL+bA.length*0.28&&t<SW));setFace(E2,!(t>FL&&t<SW));
    if(t>FL&&t<FL+2.2&&t<SW){point(G2,1,1.3)}
    [...watchA,...watchF].forEach((p,i)=>{standPose(p);setFace(p,true);p.userData.head.rotation.y=Math.sin(t*2+i)*0.3*(t>LP?1:0.3)});
    show(bE,t,e3,FL+0.2);
    bA.forEach((b,i)=>show(b,t,FL+i*0.28,Math.min(g5-0.2,FL+i*0.28+0.84)));show(bEdots,t,FL+0.6,g5);
    show(bG5,t,g5,SW+0.4);show(bE4,t,e4,LP);
    bL.forEach((b,i)=>show(b,t,LP+0.2+i*0.25,LP+0.2+i*0.25+0.6));
    // 도파민 게이지: 60% → MAX
    const dv=t<TBL?100-Math.min(40,t*80):Math.min(100,60+(t-TBL)*120);setDopa(dopa,dv,t,0);if(t>LP-0.2||t<0.05)dopa.style.opacity=t<LP-0.2?1:0;
    ch.style.opacity=t>LP?1:0;ch.style.transform=`translateX(-50%) scale(${pop((t-LP)/0.3)})`;ch.querySelector('.h').textContent=Math.min(9,Math.floor(Math.max(0,t-LP)*4.5));ch.querySelector('.n').textContent=Math.min(47,Math.floor(Math.max(0,t-LP)*24));
    // 식은 탕수육
    const ck=clamp01((t-COLD)/0.6);TS2.userData.N.forEach(n=>n.material.color.set(lerpCol('#e0a24a','#8c7a5c',ck)));TS2.userData.sauce.material.color.set(lerpCol('#b5542a','#6e5a48',ck));
    bino.style.opacity=t<s6-0.25?1:0;
    // 카메라
    if(t<s6-0.25){setCam(C,[6,2.2,-11.6],[6,1.1,-13.6],34)}
    else if(t<TBL){const k=ease((t-s6+0.25)/2);setCam(C,lerp3([2.6,2.3,-2.6],[2.4,2.3,-3.0],k),[1.3,1.9,0.6],48)}
    else if(t<SW){const k=ease((t-TBL)/2.5);setCam(C,lerp3([3.3,3.4,0.6],[2.9,3.2,0.0],k),[0,1.7,-5],50)}
    else if(t<LP){setCam(C,[0,6.8,-0.6],[0,0.6,-5],52)}
    else if(t<COLD){const k=ease((t-LP)/2);setCam(C,lerp3([5,4.5,-1],[4,5.5,-2],k),[0,1.2,-5],52)}
    else{const k=ease((t-COLD)/1.5);setCam(C,lerp3([0.05,3.4,-4.3],[0.05,2.6,-4.55],k),[0,0.93,-5],40)}
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 최후통첩 삑사리 → 밈 → 프사 =====
S[4]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(71);borderField(scene,r);
  // 단상 + 현수막
  const pod=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.6,1.6),lamb(0x7c74b8));pod.position.set(0,0.3,-7.6);scene.add(pod);
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(4.2,0.8),new THREE.MeshBasicMaterial({map:canvasTex(1050,200,(x,w,h)=>{x.fillStyle='#5b5199';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font=`900 104px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('최후통첩',w/2,h/2+4)})}));
  ban.position.set(0,3.6,-8.6);scene.add(ban);for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.08,4,0.08),lamb(0x6b5238));p.position.set(s*2.1,2,-8.6);scene.add(p)}
  const EG=entpG(r,ENEMYG);EG.position.set(0,0.6,-7.6);scene.add(EG);setFace(EG,false);const MG=holdIn(EG,megaphone(),1,0,-0.62,0.12);MG.rotation.x=Math.PI/2;mouthO(EG);
  const al=[];for(let i=0;i<10;i++){const p=entpS(r,ALLY);p.position.set((i-4.5)*1.3,0,-3.2-Math.abs(i-4.5)*0.2);p.rotation.y=Math.PI;scene.add(p);al.push(p)}
  const fo=[];for(let i=0;i<8;i++){const p=entpS(r,FOE);const s=i<4?-1:1;p.position.set(s*(2.2+(i%4)*1.1),0,-6.6-(i%2)*0.6);p.rotation.y=-s*0.6;scene.add(p);fo.push(p)}
  const PF=al[5];
  // --- 짤 만들기: 삑사리 얼굴을 미리 찍어 둔다 ---
  standPose(EG);faceO(EG,true);eyesBig(EG,1.8);EG.userData.head.rotation.x=-0.12;
  const CC=cam(30);setCam(CC,[0,2.85,-4.9],[0,2.55,-7.6],30);setSky('#c9b8ff','#ffd8f0');renderer.render(scene,CC);
  const memeC=document.createElement('canvas');memeC.width=memeC.height=640;{const x=memeC.getContext('2d');const g=x.createLinearGradient(0,0,0,640);g.addColorStop(0,'#c9b8ff');g.addColorStop(1,'#ffd8f0');x.fillStyle=g;x.fillRect(0,0,640,640);
    x.drawImage(renderer.domElement,0,(H-W)/2-40,W,W,0,0,640,640);x.font=`900 92px ${FONT}`;x.textAlign='center';x.lineWidth=16;x.strokeStyle='#111';x.fillStyle='#fff';x.strokeText('경고(삑)다',320,600);x.fillText('경고(삑)다',320,600)}
  const memeURL=memeC.toDataURL('image/jpeg',0.9);const memeT=new THREE.CanvasTexture(memeC);memeT.colorSpace=THREE.SRGBColorSpace;
  faceO(EG,false);eyesBig(EG,1);EG.userData.head.rotation.x=0;setSky('#a9c9e8','#eef4f8 70%');
  // 밈 세트 (3분 뒤)
  const memeSet=new THREE.Group();scene.add(memeSet);memeSet.visible=false;
  const bb=new THREE.Mesh(new THREE.PlaneGeometry(3.6,3.6),new THREE.MeshBasicMaterial({map:memeT}));bb.position.set(-4.6,3.6,-9.5);bb.rotation.y=0.35;memeSet.add(bb);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(3.9,3.9,0.12),lamb(0x2a2a30));fr.position.set(-4.6,3.6,-9.58);fr.rotation.y=0.35;memeSet.add(fr);
  for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.12,1.8,0.12),lamb(0x2a2a30));p.position.set(-4.6+s*1.2,0.9,-9.6+s*0.4);memeSet.add(p)}
  const flags=[];for(let i=0;i<5;i++){const f=flag(scene,(i-2)*3.0+1.0,-11.6,0xffffff,4.2,1.5);f.userData.f.material=new THREE.MeshLambertMaterial({map:memeT,side:THREE.DoubleSide});memeSet.add(f);flags.push(f)}
  const shirtT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#e2369f';x.font=`900 150px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('삑',w/2,h/2+8)});
  const tees=[];al.forEach(p=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.4),new THREE.MeshBasicMaterial({map:shirtT}));m.position.set(0,0.36,0.165);p.userData.hip.add(m);m.visible=false;tees.push(m)});
  const lol=fo.map((p,i)=>{const b=bubF(p,i%2?'ㅋㅋㅋㅋ':'ㅋㅋㅋ',{size:0.0026});return b});
  const piik=div('out','삑!');Object.assign(piik.style,{position:'absolute',left:'0',right:'0',top:'330px',textAlign:'center',fontSize:'230px',color:'#ff4fc4',opacity:0});
  const E=EV(4),e5a=at(4,'e5a'),CR=E.crack,s7=at(4,'s7'),MEME=E.meme,e6=at(4,'e6'),SM=E.smirk,PR=E.prof,n5=at(4,'n5');
  const b1=bubF(EG,'이것이… 우리의 마지막…',{size:0.0019,y:2.4}),b2=bubS(PF,'…푸흡',{size:0.0017}),b3=bubF(EG,'…웃지 마!',{size:0.0022,y:2.4}),b4=bubF(EG,'근데 그 짤 나도 하나 줘 봐',{size:0.0019,y:2.4});
  const st=div('stat3','<div>밈 생산 <b class="m">0</b>개</div><div>적장 짤 조회수 <b class="v">0</b></div>');st.style.opacity=0;
  const cut=div('cut','3분 뒤');cut.style.opacity=0;
  const ph=div('prof',`<div class="screen"><div class="x">✕</div><img src="${memeURL}"><div class="nm">적장</div><div class="msg">경고(삑)다</div><div class="bt"><span>1:1 채팅</span><span>프로필 편집</span><span>스토리</span></div></div>`);ph.style.opacity=0;
  const fl=div('flashW');fl.style.opacity=0;
  const C=cam(50);
  return t=>{
    standPose(EG);EG.position.y=0.6;const meme=t>MEME;
    EG.userData.arms[1].rotation.x=t<CR?-1.6:-0.2;EG.userData.arms[1].rotation.z=t<CR?-0.35:0;MG.visible=t<MEME;
    const cracked=t>CR&&t<MEME;faceO(EG,cracked);eyesBig(EG,cracked?1.8:1);if(!cracked)setFace(EG,t>SM);
    EG.userData.head.rotation.x=cracked?-0.12:0;
    if(meme){EG.position.set(1.6,0,-6.4);EG.rotation.y=-0.3;const tr=t<SM?Math.sin(t*60)*0.03:0;EG.userData.hip.position.x=tr;}else{EG.position.set(0,0.6,-7.6);EG.rotation.y=0}
    al.forEach((p,i)=>{standPose(p);setFace(p,true);if(meme&&i%3===0){vSign(p,1,1)}});fo.forEach((p,i)=>{standPose(p);setFace(p,true);if(meme)phoneUp(p,1,1)});
    PF.userData.head.rotation.x=0;if(t>s7-0.3&&t<MEME){faceO(PF,true);PF.userData.arms[1].rotation.x=-2.4;PF.userData.arms[1].rotation.z=0.4}else faceO(PF,false);
    memeSet.visible=meme;tees.forEach(m=>m.visible=meme);flags.forEach(f=>waveFlag(f,t));
    lol.forEach((b,i)=>show(b,t,MEME+0.4+i*0.15,PR));
    const pk=t>CR&&t<CR+1.1;piik.style.opacity=pk?1:0;piik.style.transform=`rotate(-8deg) scale(${pop((t-CR)/0.2)})`;
    show(b1,t,e5a,CR);show(b2,t,s7,MEME);show(b3,t,e6,SM);show(b4,t,SM,PR);
    st.style.opacity=t>MEME+0.5&&t<PR?1:0;st.style.transform=`translateX(-50%) scale(${pop((t-MEME-0.5)/0.3)})`;
    st.querySelector('.m').textContent=fmt(Math.min(3000,Math.max(0,(t-MEME-0.5)*1500)));
    const vv=Math.min(1e8,Math.max(0,(t-MEME-0.5)*5e7));st.querySelector('.v').textContent=vv>=1e8?'1억':fmt(vv);
    cut.style.opacity=t>MEME&&t<MEME+1.6?1:0;cut.style.transform=`translateX(-50%) scale(${pop((t-MEME)/0.3)})`;
    ph.style.opacity=t>PR?1:0;ph.style.transform=`scale(${0.8+0.2*pop((t-PR)/0.35)})`;
    fl.style.opacity=t>CR&&t<CR+0.15?0.8*(1-(t-CR)/0.15):0;
    // 카메라
    if(t<CR){const k=ease(t/(CR));setCam(C,lerp3([0,1.2,-2.0],[0,2.0,-4.2],k),[0,2.6,-7.6],48)}
    else if(t<s7-0.35){const j=Math.sin(t*80)*0.03;setCam(C,[j,2.85,-5.3],[0,2.55,-7.6],34)}
    else if(t<MEME){setCam(C,[PF.position.x+0.6,2.0,PF.position.z-2.8],[PF.position.x,1.95,PF.position.z],44)}
    else{const k=ease((t-MEME)/3.5);setCam(C,lerp3([2.6,3.0,1.2],[3.0,3.3,1.8],k),[-1.0,2.0,-6.2],54)}
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. 도파민 3% → 다들 떠남 → 노잼 엔딩 =====
S[5]=()=>{
  setSky('#f2b98a','#fbe3cf 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf3dcc8,30,110);addLights(scene,{hemi:1.4,sun:0xffd9b0});
  const r=rng(81);borderField(scene,r,{g:0xa8b47a});
  const items=[guitar,laptop,rod];
  const lv=[];for(let i=0;i<16;i++){const ally=i<8;const p=entpS(r,ally?ALLY:FOE);const x=((i%8)-3.5)*1.6+(ally?0:0.5);const z=ally?-1.2-(i%2)*0.8:-8.8+(i%2)*0.8;
    p.position.set(x,0,z);scene.add(p);setFace(p,false);const it=items[i%3]();const k=i%3;
    if(k===0){p.userData.hip.add(it);it.position.set(0,0.35,-0.22);it.rotation.z=0.5}else if(k===1){holdIn(p,it,1,0,-0.66,0.1)}else{holdIn(p,it,1,0,-0.62,0)}
    if(k===1&&i%2===0){const s=labelSprite('창업합니다',{bg:'#fff',fg:'#333',fs:56,size:0.0032});s.center.set(0.5,0);s.position.y=2.25;s.material.depthTest=false;p.add(s)}
    const ang=(ally?Math.PI:0)+(r()-0.5)*1.6;lv.push({p,x,z,ang,d:i*0.12+r()*0.3,k})}
  const G=entpG(r,GEN);G.position.set(-0.9,0,-4.4);G.rotation.y=Math.PI*0.5+0.2;scene.add(G);
  const EG=entpG(r,ENEMYG);EG.position.set(0.9,0,-5.6);EG.rotation.y=-Math.PI*0.5-0.2+Math.PI*0;scene.add(EG);
  const tw=new THREE.Mesh(new THREE.IcosahedronGeometry(0.35,1),new THREE.MeshLambertMaterial({color:0x9a7a4a,wireframe:true}));scene.add(tw);
  const E=EV(5),g6=at(5,'g6'),e7=at(5,'e7'),n6=at(5,'n6'),LV=E.leave,AL=E.alone,TU=E.turn,END=E.end;
  const b1=bubS(G,'근데… 전쟁 좀 질리지 않냐?',{size:0.0017}),b2=bubF(EG,'어 나도 그 말 하려고 했음',{size:0.0017});
  const dopa=dopaEl();const dim=div('dim');const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');e1.style.top='560px';e2.style.top='720px';
  const C=cam(50);
  return t=>{
    lv.forEach(q=>{standPose(q.p);const lt=t-LV-q.d;q.p.rotation.y=lt>0?q.ang:(q.z>-5?Math.PI:0);
      if(q.k===1){q.p.userData.arms[1].rotation.x=-0.9}
      if(lt>0){const d=lt*1.6;q.p.position.set(q.x+Math.sin(q.ang)*d,0,q.z+Math.cos(q.ang)*d);walkPose(q.p,lt*7,0.45);if(q.k===1)q.p.userData.arms[1].rotation.x=-0.9}});
    standPose(G);standPose(EG);setFace(G,false);setFace(EG,false);
    G.rotation.y=Math.atan2(EG.position.x-G.position.x,EG.position.z-G.position.z);EG.rotation.y=Math.atan2(G.position.x-EG.position.x,G.position.z-EG.position.z);
    if(t>TU){const k=t-TU;G.rotation.y=Math.PI;EG.rotation.y=0;G.position.set(-0.9,0,-4.4+k*1.2);EG.position.set(0.9,0,-5.6-k*1.2);walkPose(G,k*6,0.4);walkPose(EG,k*6+1,0.4)}
    show(b1,t,g6,e7);show(b2,t,e7,TU);
    tw.position.set(-6+((t*1.4)%12),0.35,-5+Math.sin(t)*0.3);tw.rotation.set(t*3,0,-t*4);
    setDopa(dopa,3,t,0.05);dopa.style.opacity=t<END?1:0;
    dim.style.opacity=t>END?clamp01((t-END)/0.3):0;e1.style.opacity=t>END?1:0;e2.style.opacity=t>END+0.2?1:0;popEl(e1,t,END);popEl(e2,t,END+0.2);
    if(t<AL){const k=ease(t/AL);setCam(C,lerp3([7,9,6],[5,5,2.5],k),[0,0.8,-5],52)}
    else if(t<TU){setCam(C,[-0.2,2.4,3.6],[-0.1,1.85,-5],40)}
    else{const k=ease((t-TU)/4);setCam(C,lerp3([-0.2,2.4,3.6],[6,10,3],k),[0,0.8,-5],lerp3([40],[52],k)[0])}
    caption(5,t);renderer.render(scene,C);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
