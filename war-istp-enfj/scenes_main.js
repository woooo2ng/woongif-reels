
// ================= ISTP 나라 vs ENFJ 나라 전쟁편 =================
const TB={bg:'#ffe2b8',fg:'#5a3500'},JB={bg:'#ffd9e0',fg:'#6a1a2e'},THB={bg:'#ffffff',fg:'#555566'};
const IST={shirt:0x7f8a5a,pants:0x4f5638,helm:0x6b7650};
const ENJ={shirt:0xf7d9cf,pants:0xc0607a,helm:0xf08aa0};
const GEN_T={shirt:0x5f6a44,pants:0x3f4530,cap:0x4f5838};
const GEN_J={shirt:0xf2cdbf,pants:0xa94f68,cap:0xe0708c};
function earbuds(p,col=0xffffff){const h=p.userData.head;const ebs=[];
  for(const s of[-1,1]){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.055,12,10),smooth(col));g.add(b);
    const st=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.11,0.03),lamb(col));st.position.set(0,-0.07,0.02);g.add(st);
    g.position.set(s*0.265,0.19,0.02);h.add(g);ebs.push(g)}
  p.userData.ebs=ebs;return p}
function budMesh(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.055,12,10),smooth(0xffffff));g.add(b);
  const st=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.11,0.03),lamb(0xffffff));st.position.set(0,-0.07,0.02);g.add(st);return g}
const HEART_T=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#ff5f86';x.font=`900 110px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('♥',w/2,h/2+6)});
function heartPatch(p,y=0.42,s=0.16){const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),new THREE.MeshBasicMaterial({map:HEART_T,transparent:true}));m.position.set(0.12,y,0.163);p.userData.hip.add(m);return p}
function istpS(r){const p=brows(earbuds(soldier(r,IST)),0.02);setFace(p,false);return p}
function istpG(r){const p=brows(earbuds(general(r,GEN_T)),0.02);setFace(p,false);return p}
function enfjS(r){const p=heartPatch(soldier(r,ENJ));setFace(p,true);p.userData.ph=r()*6;return p}
function enfjG(r){const p=heartPatch(general(r,GEN_J),0.4,0.15);setFace(p,true);return p}
function tears(p){const h=p.userData.head;const d=[];for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.SphereGeometry(0.032,12,10),smooth(0x8fd3ff));h.add(m);d.push({m,s})}p.userData.tears=d;return p}
function updTears(p,t,k=1){const d=p.userData.tears;if(!d)return;d.forEach((q,i)=>{const lt=(t*1.4+i*0.47)%1;q.m.visible=k>0.05;q.m.position.set(q.s*0.1,0.21-lt*0.2,0.245);q.m.scale.set(k,1.5*k,k)})}
function clapPose(p,t,k=1){const u=p.userData,s=Math.sin(t*16+(u.ph||0));u.arms[0].rotation.x=-1.35*k;u.arms[1].rotation.x=-1.35*k;u.arms[0].rotation.z=(-0.35-0.25*s)*k;u.arms[1].rotation.z=(0.35+0.25*s)*k}
function crate(scene,x,z,w=0.7,h=0.5,col=0x8a6a44){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.5),lamb(col));m.position.set(x,h/2,z);scene.add(m);return m}
function bench(scene,x,z,w=2.2){const g=new THREE.Group();const top=new THREE.Mesh(new THREE.BoxGeometry(w,0.08,0.5),lamb(0x9a7652));top.position.y=0.5;g.add(top);
  const back=new THREE.Mesh(new THREE.BoxGeometry(w,0.4,0.06),lamb(0x8a6644));back.position.set(0,0.85,-0.24);g.add(back);
  for(const sx of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.5,0.45),lamb(0x5a4a3a));l.position.set(sx*(w/2-0.15),0.25,0);g.add(l)}
  g.position.set(x,0,z);scene.add(g);return g}
function podium(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.1,2.2),lamb(0xfff3ec));b.position.y=0.55;g.add(b);
  const tr=new THREE.Mesh(new THREE.BoxGeometry(3.5,0.08,2.3),lamb(0xe0708c));tr.position.y=1.12;g.add(tr);
  const fr=canvasTex(1024,300,(x,w,h)=>{x.fillStyle='#ff5f86';rr(x,0,0,w,h,50);x.fill();x.strokeStyle='#fff';x.lineWidth=16;rr(x,18,18,w-36,h-36,38);x.stroke();
    x.fillStyle='#fff';x.font=`900 190px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=14;x.strokeStyle='#b8264d';x.strokeText('♥ 마음 열기',w/2,h/2+10);x.fillText('♥ 마음 열기',w/2,h/2+10)});
  const f=new THREE.Mesh(new THREE.PlaneGeometry(3.3,0.97),new THREE.MeshBasicMaterial({map:fr,transparent:true}));f.position.set(0,0.56,1.112);g.add(f);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,1.3,8),lamb(0x333333));st.position.set(0,1.8,0.75);g.add(st);
  const mic=new THREE.Mesh(new THREE.SphereGeometry(0.07,12,10),smooth(0x222222));mic.position.set(0,2.47,0.75);g.add(mic);
  for(const sx of[-1,1]){const sp=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.9,0.5),lamb(0x2a2a30));sp.position.set(sx*2.2,0.45,0.6);g.add(sp)}
  return g}
function canMesh(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.065,0.2,16),lamb(0x6b4a2f));c.position.y=0.1;g.add(c);
  const lb=new THREE.Mesh(new THREE.CylinderGeometry(0.067,0.067,0.09,16),lamb(0xf2e2c2));lb.position.y=0.1;g.add(lb);return g}
function blanket(col=0x8a9560){const g=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(0.86,0.62,0.07),lamb(col));m.position.set(0,0.3,-0.2);g.add(m);
  const cap=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.07,0.46),lamb(col));cap.position.set(0,0.63,0);g.add(cap);
  for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.42,0.42),lamb(col));sd.position.set(sx*0.44,0.42,0);g.add(sd)}return g}
function steam(scene,n,r){const a=[];for(let i=0;i<n;i++){const s=glowSprite('rgba(255,255,255,1)',0.09);s.material.opacity=0.6;s.userData.base=[0.09,0.09];scene.add(s);a.push({s,ph:r()})}return a}
function updSteam(a,t,x,y,z,on=1){a.forEach(q=>{const lt=(t*0.7+q.ph)%1;const k=Math.sin(lt*Math.PI)*on;q.s.visible=k>0.03;q.s.position.set(x+Math.sin(lt*6+q.ph*9)*0.05,y+lt*0.45,z);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)})}
function titleUI(){ui.insertAdjacentHTML('beforeend',`<div class="tag">ISTP vs ENFJ × 전쟁편</div><div class="title1 out" style="color:${C_T};font-size:150px;letter-spacing:-4px;top:315px">ISTP 나라와</div><div class="title2 out" style="color:${C_J};top:480px">ENFJ 나라가</div><div class="title3 out" style="top:655px">전쟁이 난다면?</div>`);
  return ['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s))}
{const st=document.createElement('style');st.textContent=`
.tag{white-space:nowrap}
.spk{position:absolute;left:50%;top:250px;transform:translateX(-50%);background:#fff;border:10px solid #ff5f86;border-radius:40px;padding:18px 60px 22px;text-align:center;box-shadow:0 18px 44px rgba(0,0,0,.3);white-space:nowrap}
.spk small{display:block;font-size:52px;font-weight:900;color:#555}
.spk b{display:block;font-size:150px;font-weight:900;color:#e2335f;line-height:1.1;letter-spacing:-4px}
.spk i{display:block;font-style:normal;font-size:40px;font-weight:700;color:#888}
.rp{position:absolute;left:70px;top:150px;width:940px;height:1060px;background:#fffaf0;border-radius:26px;box-shadow:0 30px 70px rgba(0,0,0,.35);padding:34px 34px;box-sizing:border-box;transform-origin:780px 930px;overflow:hidden}
.rp h2{margin:0 0 18px;text-align:center;font-size:58px;font-weight:900;color:#e0567a;letter-spacing:-1px}
.rp .g{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.rp .n{border-radius:18px;padding:14px 18px;font-size:23px;line-height:1.38;font-weight:600;color:#5a2a3a;height:200px;overflow:hidden}
.rp .n b{display:block;font-size:24px;font-weight:900;margin-bottom:4px}
.rp .n i{font-style:normal;color:#ff5f86}
.rp .me{background:#fff;border:3px dashed #c8c0b8;display:flex;align-items:center;justify-content:center;flex-direction:column}
.rp .me b{color:#777;font-size:24px}
.rp .me span{font-size:30px;font-weight:500;color:#222}
.ph2{position:absolute;left:50%;top:170px;transform:translateX(-50%);width:620px;background:#1b1b22;border-radius:60px;padding:20px;box-shadow:0 30px 70px rgba(0,0,0,.4)}
.ph2 .sc{background:#f4f4f8;border-radius:44px;padding:44px 40px 50px;text-align:center}
.ph2 .art{width:300px;height:300px;margin:0 auto 26px;border-radius:30px;background:#d8d8e2;display:flex;align-items:center;justify-content:center;font-size:150px;color:#aaa;font-weight:900}
.ph2 .tt{font-size:46px;font-weight:900;color:#333}
.ph2 .sub{font-size:30px;color:#888;margin-top:8px;font-weight:700}
.ph2 .bar{height:10px;border-radius:5px;background:#ddd;margin:30px 0 12px}
.ph2 .tm{display:flex;justify-content:space-between;font-size:26px;color:#999;font-weight:700}
.ph2 .btn{margin-top:18px;font-size:70px;color:#555}
.fb{position:absolute;inset:0;background:#000}
.fb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(.75) brightness(1.05) contrast(.95) blur(1px)}
.fb .vg{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(40,25,10,.75) 100%)}
.fb .lb{position:absolute;left:50%;top:240px;transform:translateX(-50%);background:rgba(255,255,255,.9);color:#6a4a20;font-weight:900;font-size:52px;padding:8px 34px;border-radius:999px;white-space:nowrap}
.wf{position:absolute;inset:0;background:#fff;pointer-events:none}
`;document.head.appendChild(st)}


// 말풍선이 화면 밖으로 잘리지 않게: 렌더 직전에 화면 안쪽으로 밀어 넣음
const _render=renderer.render.bind(renderer);const _p=new THREE.Vector3(),_r=new THREE.Vector3(),_u=new THREE.Vector3(),_f=new THREE.Vector3();
renderer.render=(sc,cm)=>{cm.updateMatrixWorld(true);cm.matrixWorld.extractBasis(_r,_u,_f);
  sc.traverse(o=>{if(!o.isSprite||!o.visible||o.material.depthTest!==false||!o.userData.base)return;
    o.getWorldPosition(_p);const d=_p.clone().sub(cm.position).dot(_f.clone().negate());if(d<=0.05)return;
    const ppu=H/(2*d*Math.tan(cm.fov*Math.PI/360));const n=_p.clone().project(cm);const x=(n.x+1)/2*W,y=(1-n.y)/2*H;
    let hw=o.scale.x/2*ppu,th=o.scale.y*ppu;let dx=0,dy=0;
    if(hw>460){const f=460/hw;o.scale.set(o.scale.x*f,o.scale.y*f,1);hw*=f;th*=f}
    if(x-hw<40)dx=40-(x-hw);else if(x+hw>W-40)dx=(W-40)-(x+hw);
    if(y-th<310)dy=310-(y-th);
    if(dx||dy){const wp=_p.clone().addScaledVector(_r,dx/ppu).addScaledVector(_u,-dy/ppu);o.parent.worldToLocal(wp);o.position.copy(wp)}});
  _render(sc,cm)};

// ===== 0. 감동 연설 (타이틀) =====
S[0]=()=>{
  const scene=new THREE.Scene();const fog=new THREE.Fog(0xf0dcd0,28,95);scene.fog=fog;
  scene.add(new THREE.HemisphereLight(0xffffff,0x8a8070,1.35));const dl=new THREE.DirectionalLight(0xfff0e0,1.45);dl.position.set(-6,12,8);scene.add(dl);
  const r=rng(41);field(scene,r,{mz:-5.5});
  sandbags(scene,0,1.3,18,3);
  const IT=[];for(let i=0;i<10;i++){const p=istpS(r);p.position.set(-5.4+i*1.2,0,2.0+(i%2)*0.3);p.rotation.y=Math.PI;scene.add(p);IT.push(p)}
  const IG=istpG(r);IG.position.set(2.1,0,3.5);IG.rotation.y=Math.PI;scene.add(IG);
  const bud=budMesh();bud.visible=false;IG.userData.arms[1].add(bud);bud.position.set(0,-0.66,0.05);
  const EA=[];for(let row=0;row<5;row++)for(let c=0;c<11;c++){const p=enfjS(r);if(row<2)tears(p);scene.add(p);EA.push({p,x:(c-5)*1.2+(row%2)*0.5+(r()-0.5)*0.2,row})}
  const PD=podium();scene.add(PD);const EG=enfjG(r);tears(EG);scene.add(EG);
  const spot=glowSprite('rgba(255,225,190,1)',7);scene.add(spot);
  flag(scene,-7,-11,0xff8fa8,5);flag(scene,7,-11,0xff8fa8,5);
  const C=cam(50);const T=titleUI();const E=EV(0);
  const ch=div('spk','<small>⏱ 연설 시간</small><b>2시간 40분</b><i>…그리고 아직 하는 중</i>');
  const bK=sb(scene,'…아직 해?',0,0,0,{c:TB,size:0.0019});
  const PZ=-10.5;
  return t=>{
    const RS=E.rise,g1=at(0,'g1'),n2=at(0,'n2'),k1=at(0,'k1'),POP=E.pop;
    setSky('#ffc9b8','#fff1e4 75%');
    // 대군 행진 → 정지
    const zf=Math.min(-40+t*7.2,-15);const arr=zf>=-15;
    EA.forEach(q=>{q.p.position.set(q.x,0,zf-q.row*1.4);if(!arr){walkPose(q.p,t*9+q.p.userData.ph,0.5);setFace(q.p,false)}else{standPose(q.p);setFace(q.p,true);
      const cr=clamp01((t-g1-2.2)/0.6);if(cr>0){q.p.userData.head.rotation.x=0.15*cr;q.p.userData.arms[0].rotation.x=-2.2*cr;q.p.userData.arms[0].rotation.z=0.6*cr}updTears(q.p,t,cr)}});
    // 연단이 땅에서 올라옴
    const up=ease((t-RS)/0.9);PD.position.set(0,-1.25+up*1.25,PZ);PD.visible=t>RS-0.1;
    EG.position.set(0,PD.position.y+1.16,PZ-0.2);EG.visible=t>RS+0.3;standPose(EG);
    const sp=t-g1;if(sp>0){const w=Math.sin(sp*3.2);armUp(EG,1,0.55+0.35*w);armUp(EG,0,0.25+0.3*Math.max(0,-w));EG.userData.head.rotation.x=-0.1}
    updTears(EG,t,clamp01((t-g1-3.4)/0.5));
    spot.position.set(0,3.4,PZ-1.2);spot.material.opacity=up*0.85;
    IT.forEach(p=>{standPose(p);aim(p)});standPose(IG);
    // 이어폰 빼기
    const pk=clamp01((t-POP+0.45)/0.4);if(t>POP-0.5){const a=IG.userData.arms[1];a.rotation.x=-2.75*pk;a.rotation.z=0.75*pk}
    IG.userData.ebs[1].visible=t<POP;bud.visible=t>=POP;
    // 카메라
    if(t<RS){const k=ease(t/RS);setCam(C,[0.9,2.3,8.2-k*0.8],[0,1.3,-20],50)}
    else if(t<n2+1.6){const k=ease((t-RS)/5);setCam(C,[0.3,2.6,PZ+9.0-k*0.7],[0,2.55,PZ],46)}
    else if(t<POP-0.6){const k=ease((t-n2-1.6)/2.5);setCam(C,lerp3([-1.5,1.9,-3.2],[-1.0,2.0,-2.6],k),[0.8,1.5,3],48)}
    else{setCam(C,[1.55,2.45,1.05],[2.1,2.35,3.5],42)}
    bK.position.copy(headPos(IG,0.78));show(bK,t,k1,99);
    T.forEach((e,i)=>{const T0=[0.05,0.1,0.15,0.2][i];e.style.transform=(i==0?'translateX(-50%) ':'')+`scale(${pop((t-T0)/0.35)})`;e.style.opacity=t<RS?clamp01((t-T0)/0.1):clamp01(1-(t-RS)/0.2)});
    {const k=pop((t-E.chip)/0.35),sh=t>E.chip&&t<E.chip+0.5?Math.sin((t-E.chip)*60)*4*(1-(t-E.chip)/0.5):0;ch.style.transform=`translateX(calc(-50% + ${sh}px)) scale(${k})`;ch.style.opacity=t>E.chip?1:0}
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 고민 상담 =====
S[1]=()=>{
  setSky('#bfe0ff','#f2f8ff 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe6f0fa,20,80);addLights(scene,{hemi:1.5});
  const r=rng(52);field(scene,r,{mz:-8});
  sandbags(scene,0,0,9,4);crate(scene,-0.35,0.75,0.75,0.5);
  const A=istpS(r);A.position.set(-0.35,0,0.8);sitPose(A);A.userData.hip.position.y=0.62;scene.add(A);
  const rf=rifle();rf.rotation.x=-1.25;rf.position.set(-1.1,0.45,0.45);scene.add(rf);
  const B=enfjS(r);B.position.set(0.6,0,0.95);B.rotation.y=-1.25;scene.add(B);
  const clip=paper('#fffdf2',(x,w,h)=>{x.fillStyle='#e0708c';x.font=`900 46px ${FONT}`;x.fillText('상담 일지',30,70);x.fillStyle='#bbb';for(let i=0;i<6;i++)x.fillRect(30,120+i*50,w-60,6)},0.3,0.4);
  holdIn(B,clip,0,0.05,-0.6,0.12);clip.rotation.set(-0.6,0.3,0);
  const C=cam(48);const E=EV(1);
  const ch=chip('고민 상담 신청 1건');const ch2=chip('ISTP 고민 개수: 0개');
  const b1=sb(scene,'요즘 힘든 일 없어요?',0,0,0,{c:JB,size:0.0021}),b2=sb(scene,'원래 이래요.',0,0,0,{c:TB,size:0.0021}),
    b3=sb(scene,'저 들을 준비 됐어요.',0,0,0,{c:JB,size:0.0021}),b4=sb(scene,'…없는데요.',0,0,0,{c:TB,size:0.0021});
  const spk=sparkles(scene,6,r);
  return t=>{
    standPose(B);sitPose(B);B.userData.hip.position.y=0.42;B.userData.legs.forEach(l=>l.rotation.x=-2.0);
    B.userData.head.rotation.x=-0.05;B.userData.arms[0].rotation.x=-1.2;
    const lean=t>at(1,'e2')?ease((t-at(1,'e2'))/0.5):0;B.userData.arms[1].rotation.x=-1.4*lean;B.userData.arms[1].rotation.z=-0.5*lean;
    sitPose(A);A.userData.hip.position.y=0.62;A.userData.arms.forEach(a=>{a.rotation.x=-0.7});A.userData.head.rotation.y=t>at(1,'s1')-0.2?0.35:0;
    const hA=headPos(A,0.62),hB=headPos(B,0.62);
    b1.position.copy(hB);b3.position.copy(hB);b2.position.copy(hA);b4.position.copy(hA);
    show(b1,t,at(1,'e1'),endOf(1,'e1',0.2));show(b2,t,at(1,'s1'),endOf(1,'s1',0.3));show(b3,t,at(1,'e2',1.2),endOf(1,'e2',0.2));show(b4,t,at(1,'s2'),E.close);
    const CL=E.close;
    if(t<CL){const k=ease(t/CL);setCam(C,[0.1+k*0.1,1.75,4.3-k*0.3],[0.1,1.15,0.8],46)}
    else{const k=ease((t-CL)/0.6);setCam(C,lerp3([0.1,1.7,3.9],[-0.3,1.6,3.45],k),[-0.35,1.3,0.8],42)}
    updSpk(spk,t,[{x:hB.x-0.1,y:hB.y-0.35,z:hB.z}],t>at(1,'e2')&&t<CL?1:0);
    chipPop(ch,t,E.chip);ch.style.opacity=t>E.chip&&t<CL?1:0;
    chipPop(ch2,t,CL+0.35);ch2.style.opacity=t>CL+0.35?1:0;
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 칭찬 폭격 → 새벽 4시 자기반성 =====
S[2]=()=>{
  const r=rng(63);
  // 낮: 칭찬 링
  const s1=new THREE.Scene();s1.fog=new THREE.Fog(0xe6f0fa,20,80);addLights(s1,{hemi:1.5});field(s1,r,{mz:-9});
  const A=istpS(r);A.position.set(0,0,0);s1.add(A);
  const port=new THREE.Group();{const R=rifle();R.rotation.y=Math.PI/2;port.add(R)}port.rotation.z=0.75;port.position.set(0,0.3,0.33);A.userData.hip.add(port);
  const carry=rifle();A.userData.arms[1].add(carry);carry.position.set(0.02,-0.66,0.1);carry.rotation.x=-1.25;carry.visible=false;
  const ring=[];for(let i=0;i<7;i++){const a=Math.PI*(0.9+i*0.2);const p=enfjS(r);p.position.set(Math.cos(a)*1.9,0,Math.sin(a)*1.9);p.rotation.y=Math.atan2(-p.position.x,-p.position.z);s1.add(p);ring.push(p)}
  const hearts=sprinkleHearts(s1,10,r,{w:4,dz:3,col:'#ff8fa8',size:0.005});
  // 밤: 막사
  const s2=new THREE.Scene();s2.add(new THREE.HemisphereLight(0x8a90c0,0x302838,0.55));
  const lamp=new THREE.PointLight(0xffc27a,6,9,1.6);lamp.position.set(0.3,1.6,0.6);s2.add(lamp);
  const room=new THREE.Mesh(new THREE.BoxGeometry(7,5,7),new THREE.MeshLambertMaterial({color:0x8a6f8a,side:THREE.BackSide,flatShading:true}));room.position.y=2.5;s2.add(room);
  const tb=table(s2,0,0,1.6,0.9);const B=enfjS(r);B.position.set(0,0,-0.75);s2.add(B);chair(s2,0,-0.8,0);
  const lan=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.26,10),new THREE.MeshBasicMaterial({color:0xffd08a}));lan.position.set(0.55,1.03,0.1);s2.add(lan);
  const gl=glowSprite('rgba(255,200,120,1)',1.6);gl.position.set(0.55,1.05,0.12);s2.add(gl);
  const pile=[];for(let i=0;i<3;i++){const pp=paper('#fffdf2',(x,w,h)=>{x.fillStyle='#555';for(let j=0;j<9;j++)x.fillRect(24,40+j*42,w-48-(j%3)*40,8)},0.42,0.56);pp.rotation.x=-Math.PI/2;pp.rotation.z=(i-1)*0.12;pp.position.set(-0.05+i*0.06,0.905+i*0.004,0.05);s2.add(pp);pile.push(pp)}
  const pg=labelSprite('일기 3장째',{bg:'#fff',fg:'#e0567a',fs:60,size:0.0024});pg.position.set(-0.1,1.25,0.35);s2.add(pg);
  const C=cam(50);const E=EV(2);
  const ch=chip('칭찬 87개 · 리액션 0'),ch2=chip('AM 4:00 · 자기반성 중');
  const fr=ring[5],fl=ring[1];
  const b1=sb(s1,'총 잡는 자세 너무 멋있어요!',0,0,0,{c:JB,size:0.0024}),b2=sb(s1,'당신은 정말 특별한 사람이에요!!',0,0,0,{c:JB,size:0.0024}),b3=sb(s1,'…감사합니다.',0,0,0,{c:TB,size:0.0024});
  const bT=sb(s2,'내가 너무 부담스러웠나…',0,0,0,{c:THB,size:0.0019}),bT2=sb(s2,'칭찬이 부족했나…',0,0,0,{c:THB,size:0.0019});
  return t=>{
    const N=E.night,W=E.walk;
    if(t<N){
      setSky('#bfe0ff','#f2f8ff 70%');
      ring.forEach((p,i)=>{standPose(p);if(t<W)clapPose(p,t);else{clapPose(p,W);}});
      standPose(A);if(t<W){port.visible=true;carry.visible=false;A.userData.arms[0].rotation.set(-0.95,0,0.5);A.userData.arms[1].rotation.set(-1.05,0,-0.5)}else{port.visible=false;carry.visible=true;A.userData.arms[1].rotation.x=-0.25}
      if(t>W){const k=t-W;A.rotation.y=Math.PI*0.5*ease(k/0.25);walkPose(A,k*7,0.5);A.position.x=Math.max(0,k-0.2)*1.5}
      b1.position.copy(headPos(fl,0.65));b2.position.copy(headPos(fr,0.65));b3.position.copy(headPos(A,0.65));
      show(b1,t,at(2,'e3'),endOf(2,'e3',0.1));show(b2,t,at(2,'e4'),endOf(2,'e4',0.3));show(b3,t,at(2,'s3'),W+0.3);
      updHearts(hearts,t,0.2,1.6,1.6);
      setCam(C,[0.2,2.9,5.6-ease(t/W)*0.5],[0,1.2,-0.4],48);
      chipPop(ch,t,E.chip);ch.style.opacity=t>E.chip?1:0;ch2.style.opacity=0;
      caption(2,t);renderer.render(s1,C);return;
    }
    setSky('#1a1d3a','#3a3460 80%');ch.style.opacity=0;
    standPose(B);sitPose(B);B.userData.hip.position.y=0.58;B.userData.head.rotation.x=0.35;
    const w=Math.sin(t*14);B.userData.arms[1].rotation.x=-1.15+w*0.06;B.userData.arms[1].rotation.z=-0.25+w*0.08;B.userData.arms[0].rotation.x=-1.0;
    gl.material.opacity=0.75+Math.sin(t*7)*0.08;
    const k=ease((t-N)/3);setCam(C,lerp3([2.0,2.35,3.4],[1.7,2.2,3.0],k),[0,1.15,-0.3],48);
    bT.position.copy(headPos(B,0.72));bT2.position.copy(headPos(B,0.72));
    const e5=at(2,'e5');show(bT,t,e5,e5+1.85);show(bT2,t,e5+1.85,endOf(2,'e5',0.6));
    chipPop(ch2,t,N+0.2);ch2.style.opacity=t>N+0.2?1:0;
    caption(2,t);renderer.render(s2,C);
  };
};

// ===== 3. 3초 해결 =====
S[3]=()=>{
  setSky('#cfe3f5','#fbf4ec 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xeef0f0,20,80);addLights(scene,{hemi:1.45});
  const r=rng(74);field(scene,r,{mz:-8});sandbags(scene,0,-0.6,7,3);
  const lg=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,2.4,10),lamb(0x8a6644));lg.rotation.z=Math.PI/2;lg.position.set(0,0.3,0);scene.add(lg);
  const A=istpS(r);A.position.set(0.5,0,0.05);scene.add(A);
  const B=tears(enfjS(r));B.position.set(-0.5,0,0.05);scene.add(B);
  const bolts=[];for(let i=0;i<4;i++){const s=textSprite('⚡',90,'#ffd84d',0.0045);scene.add(s);bolts.push(s)}
  const ex=labelSprite('!!',{bg:'#ffd84d',fg:'#5a3a00',fs:80,size:0.0026});scene.add(ex);
  const C=cam(46);const E=EV(3);const wf=div('wf','');wf.style.opacity=0;
  const ch=chip('해결 시간 3초');
  const b1=sb(scene,'다들 챙기느라, 정작 저는…',0,0,0,{c:JB,size:0.002}),b2=sb(scene,'…그럼 안 챙기면 되잖아요.',0,0,0,{c:TB,size:0.002});
  return t=>{
    const P=E.pause,BO=E.bolt;
    for(const p of[A,B]){standPose(p);sitPose(p);p.userData.hip.position.y=0.62}
    A.userData.arms.forEach(a=>a.rotation.x=-0.7);
    const sad=t<BO;setFace(B,!sad);B.userData.head.rotation.x=sad?0.32:-0.12;B.userData.arms.forEach(a=>{a.rotation.x=sad?-1.0:-0.6});
    updTears(B,t,sad?1:0);
    const turn=ease((t-P)/0.8);A.userData.head.rotation.y=-0.55*turn;
    const jb=t>BO?Math.exp(-(t-BO)*5)*Math.abs(Math.sin((t-BO)*18)):0;B.userData.hip.position.y=0.62+jb*0.25;
    if(t>BO){armUp(B,0,0.4);armUp(B,1,0.4)}
    const hB=headPos(B,0.62),hA=headPos(A,0.62);
    bolts.forEach((s,i)=>{const a=i*1.57+t*2;const k=t>BO&&t<BO+2.2?pop((t-BO-i*0.05)/0.2):0;s.position.set(hB.x+Math.cos(a)*0.45,hB.y-0.35+Math.sin(a)*0.25,hB.z+0.1);s.scale.set(s.userData.base[0]*k,s.userData.base[1]*k,1);s.visible=k>0.02});
    ex.position.copy(hB);scaleBubble(ex,t>BO&&t<at(3,'n5',0.8)?pop((t-BO)/0.2):0);
    wf.style.opacity=t>BO?clamp01(1-(t-BO)/0.25)*0.85:0;
    b1.position.copy(hB);b2.position.copy(hA);show(b1,t,at(3,'e6',2.6),endOf(3,'e6',0.2));show(b2,t,at(3,'s4'),BO);
    if(t<P){const k=ease(t/P);setCam(C,[0,1.55,3.6-k*0.3],[0,1.25,0],44)}
    else if(t<BO){const k=ease((t-P)/1.2);setCam(C,lerp3([0,1.55,3.3],[0.75,1.55,2.3],k),[0.45,1.4,0],40)}
    else if(t<at(3,'n5',0.6)){setCam(C,[-0.55,1.6,2.2],[-0.5,1.45,0],40)}
    else{const k=ease((t-at(3,'n5',0.6))/3);setCam(C,[0,1.7+k*0.2,3.8+k*0.4],[0,1.2,0],46)}
    chipPop(ch,t,E.chip);ch.style.opacity=t>E.chip?1:0;
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 롤링페이퍼 =====
const NOTES=[
 ['#ffe3ea','민지 (ENFJ)','처음 국경에서 만난 날 기억나요? 그날 하늘이 정말 예뻤는데… 무표정 뒤에 숨은 따뜻함, 저는 다 알아요 <i>♥</i> 앞으로도 서로의 빛이 되어 줘요!! 우리 꼭 또 봐요 ✿'],
 ['#fff1c9','준호 (ENFJ)','당신이 총 잡는 자세를 보고 처음으로 군 생활이 행복했어요. 힘들 땐 언제든 말해 줘요. 24시간 대기 중!! 사랑해요 양국 <i>♥♥♥</i>'],
 ['#e3f3ff','서연 (ENFJ)','우리 나라 사람들 다 대신해서 말할게요. 고마워요, 그리고 미안해요. 연설이 좀 길었죠? 다음엔 3시간으로 늘려 볼게요 <i>♥</i> 항상 응원해요!!'],
 ['#eadcff','도윤 (ENFJ)','오늘 하루도 정말 수고 많았어요. 당신은 존재만으로 충분히 소중한 사람이에요. 잊지 마요!! 밥 잘 챙겨 먹고, 잠 푹 자고, 행복해야 해요 <i>♥</i>'],
 ['#ddf5e4','하은 (ENFJ)','편지 쓰다가 세 번 울었어요ㅠㅠ 우리가 적이었다는 게 믿기지 않아요. 전쟁 끝나면 꼭 같이 캠핑 가요!! 텐트는 제가 칠게요 <i>♥</i>'],
 ['#ffe3ea','장군 (ENFJ)','사랑하는 ISTP 나라 여러분께. 여러분의 고요함은 우리의 등불입니다. 오늘 저는 여러분에게서 진정한 평화를 배웠습니다. 영원히 함께해요 <i>♥</i>'],
 ['#fff1c9','지우 (ENFJ)','당신 덕분에 웃는 날이 많아졌어요! 우리 단톡방 만들었어요 초대할게요!! 답장 안 해도 괜찮아요 (근데 해 주면 좋아요) <i>♥♥</i>'],
];
S[4]=()=>{
  const r=rng(85);
  const scene=new THREE.Scene();addLights(scene,{hemi:1.4});
  const room=new THREE.Mesh(new THREE.BoxGeometry(10,6,10),new THREE.MeshLambertMaterial({color:0xf3d6cf,side:THREE.BackSide,flatShading:true}));room.position.y=3;scene.add(room);
  const bn=canvasTex(1024,200,(x,w,h)=>{x.fillStyle='#ff8fa8';rr(x,0,0,w,h,40);x.fill();x.fillStyle='#fff';x.font=`900 110px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('양국 화합의 날 ♥',w/2,h/2+6)});
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(4,0.8),new THREE.MeshBasicMaterial({map:bn,transparent:true}));ban.position.set(0,3.2,-4.9);scene.add(ban);
  const G=tears(enfjG(r));G.position.set(0,0,0);scene.add(G);
  const pap=paper('#fffaf0',(x,w,h)=>{const cs=['#ffe3ea','#fff1c9','#e3f3ff','#eadcff','#ddf5e4','#ffe3ea'];for(let i=0;i<6;i++){x.fillStyle=cs[i];x.fillRect(14+(i%2)*150,40+Math.floor(i/2)*120,140,110)}x.fillStyle='#fff';x.strokeStyle='#bbb';x.lineWidth=3;x.strokeRect(164,400,140,30);x.fillStyle='#e0567a';x.font=`900 26px ${FONT}`;x.fillText('롤링페이퍼 ♥',80,30)},0.6,0.82);
  G.userData.hip.add(pap);pap.position.set(0,0.2,0.42);pap.rotation.set(-0.35,0,0);
  const hearts=sprinkleHearts(scene,8,r,{w:1.6,dz:0.6,z:0.3,col:'#ff8fa8',size:0.004});
  const C=cam(44);const E=EV(4);
  const rp=div('rp',`<h2>양국 화합 롤링페이퍼 ♥</h2><div class="g">${NOTES.map(n=>`<div class="n" style="background:${n[0]};transform:rotate(${(Math.random()-0.5)*0}deg)"><b>${n[1]}</b>${n[2]}</div>`).join('')}<div class="n me"><b>ISTP 장군</b><span>ㅇㅇ 수고</span></div></div>`);
  const ch=chip('ENFJ 평균 412자 · ISTP 3자');ch.style.top='160px';
  return t=>{
    const g2=at(4,'g2');
    if(t<g2-0.15){
      setSky('#f3d6cf','#f3d6cf');rp.style.display='block';
      const z=ease((t-E.zoom)/0.6);rp.style.transform=`scale(${0.92+0.08*ease(t/0.4)+z*1.55})`;rp.style.opacity=clamp01(t/0.2);
      chipPop(ch,t,E.chip);ch.style.opacity=t>E.chip?1:0;
      caption(4,t);renderer.render(scene,C);return;
    }
    rp.style.display='none';ch.style.opacity=0;setSky('#f6d9d0','#fbeee8 70%');
    standPose(G);const u=G.userData;
    const hug=ease((t-at(4,'n6',0.2))/0.6);
    u.arms[1].rotation.x=-1.1+hug*0.2;u.arms[1].rotation.z=-0.2-0.3*hug;u.arms[0].rotation.x=-1.1+hug*0.2;u.arms[0].rotation.z=0.2+0.3*hug;pap.position.z=0.42-hug*0.18;
    G.rotation.z=Math.sin(t*38)*0.012*(1-hug*0.5);u.head.rotation.x=0.18-hug*0.25;
    updTears(G,t,clamp01((t-g2-0.6)/0.4));updHearts(hearts,t,at(4,'n6'),2.2,1.2);
    const k=ease((t-g2)/4);setCam(C,lerp3([0.25,2.45,3.0],[0.3,2.5,3.9],k),[0,1.85,0],42);
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. 엔딩: 담요·캔커피 → 옆에 앉아 이어폰 한쪽 → 무음 → 노을 → 쉬러 감 =====
const CAN_T=canvasTex(512,160,(x,w,h)=>{x.fillStyle='#7a4a2a';x.fillRect(0,0,w,h);x.fillStyle='#f6e6c8';x.fillRect(0,30,w,100);x.fillStyle='#5a2e14';x.font=`900 50px ${FONT}`;x.textAlign='center';x.textBaseline='middle';for(const cx of[w*0.25,w*0.75])x.fillText('COFFEE',cx,82)});
function canBig(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.095,0.095,0.27,24,1,true),new THREE.MeshLambertMaterial({map:CAN_T}));c.position.y=0.135;g.add(c);
  for(const y of[0,0.27]){const cp=new THREE.Mesh(new THREE.CylinderGeometry(0.093,0.093,0.012,24),lamb(0xc8c8d0));cp.position.y=y;g.add(cp)}return g}
S[5]=()=>{
  const r=rng(96);
  const scene=new THREE.Scene();const fog=new THREE.Fog(0xe8e0f0,22,90);scene.fog=fog;
  const hemi=new THREE.HemisphereLight(0xffffff,0x706070,1.4);scene.add(hemi);const dl=new THREE.DirectionalLight(0xfff0e0,1.4);dl.position.set(-5,10,8);scene.add(dl);
  ground(scene,0x9cb97a,300);fence(scene,-1.6,60);
  for(let i=0;i<9;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4)*13+r()*4,0,-50-r()*12);scene.add(h)}
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r()*2,-14-r()*6,1.1,0x76a866);
  for(let i=0;i<6;i++)tree(scene,(i-2.5)*7+r()*2,24+r()*6,1.2,0x76a866);
  bench(scene,0,0,2.2);
  const J=tears(enfjG(r));scene.add(J);const T=istpG(r);scene.add(T);
  const bl=blanket();J.userData.hip.add(bl);bl.position.set(0,0.02,0);
  const cn=canBig();scene.add(cn);const stm=steam(scene,4,r);
  const budT=budMesh();T.userData.arms[0].add(budT);budT.position.set(0,-0.68,0.06);budT.visible=false;
  const budJ=budMesh();J.userData.arms[1].add(budJ);budJ.position.set(0,-0.68,0.06);budJ.visible=false;
  const budB=budMesh();scene.add(budB);budB.visible=false;budB.rotation.z=Math.PI/2;
  const budE=budMesh();J.userData.head.add(budE);budE.position.set(0.265,0.19,0.02);budE.visible=false;
  const zz=textSprite('Zz',90,'#ffffff',0.004);scene.add(zz);
  const sun=glowSprite('rgba(255,170,110,1)',16);sun.position.set(-2,4,40);scene.add(sun);
  const crowd=[];for(let i=0;i<26;i++){const isJ=i%2==0;const p=isJ?enfjS(r):istpS(r);const x=(r()-0.5)*22,z=4+r()*16;
    p.rotation.set(-Math.PI/2,0,(r()-0.5)*1.2);p.position.set(x,0.2,z);p.visible=false;scene.add(p);
    const mat=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.04,2.1),lamb(isJ?0xffc9d4:0xd8d0b0));mat.position.set(x,0.02,z+0.1);mat.rotation.y=-p.rotation.z;mat.visible=false;scene.add(mat);if(isJ)earbuds(p);{const hd=p.userData.head;hd.children.forEach(c=>{if(c.material===smooth(IST.helm)||c.material===smooth(ENJ.helm))c.visible=false});hd.children[1].visible=true;setFace(p,true)}const nt=[];for(let k=0;k<2;k++){const n=textSprite(k?'♫':'♪',90,k?'#ffd56b':'#ffffff',0.007);n.visible=false;scene.add(n);nt.push({n,ph:r()})}crowd.push({p,mat,nt})}
  const walkers=[];for(let i=0;i<8;i++){const p=enfjS(r);p.visible=false;scene.add(p);walkers.push(p)}
  const C=cam(46);const E=EV(5);
  const bG3=sb(scene,'…혹시 이거, 장군님이…?',0,0,0,{c:JB,size:0.0026}),bK2=sb(scene,'남아서요.',0,0,0,{c:TB,size:0.0026}),bQ=sb(scene,'?',0,0,0,{c:JB,size:0.0024}),
    bG4=sb(scene,'…아무것도 안 나오는데요?',0,0,0,{c:JB,size:0.0019}),bK3=sb(scene,'…연설, 다 들었어요.',0,0,0,{c:TB,size:0.0019}),bK4=sb(scene,'…길긴 했어요.',0,0,0,{c:TB,size:0.0019});
  const ph=div('ph2',`<div class="sc"><div class="art">♪</div><div class="tt">재생 중인 곡 없음</div><div class="sub">ISTP 장군의 이어폰</div><div class="bar"></div><div class="tm"><span>0:00</span><span>0:00</span></div><div class="btn">▶</div></div>`);ph.style.opacity=0;
  const fb=div('fb','<img src="flash.jpg"><div class="vg"></div><div class="lb">2시간 40분 전</div>');fb.style.opacity=0;
  const chD=chip('AM 6:00 · 다음 날 아침'),chC=chip('따뜻한 캔커피'),chB=chip('이어폰 한쪽'),ch=chip('2시간 40분 완청'),ch2=chip('ENFJ 나라 주말 여행지 1위: ISTP 나라');ch2.style.fontSize='48px';
  const stat=div('statbox','<div><small>전쟁</small><b>1년째</b></div><div><small>사상자</small><b>0명</b></div>');stat.style.top='330px';
  const endd=div('dim','');endd.style.opacity=0;const e1=div('end1 out','다음 나라 대결은?'),e2=div('end2 out','댓글로 신청해 주세요');e1.style.opacity=e2.style.opacity=0;
  const hp=new THREE.Vector3();
  return t=>{
    const WK=E.wake,CN=E.can,g3=at(5,'g3'),k2=at(5,'k2'),SIT=E.sit,PL=E.pull,OF=E.offer,Q=E.q,TK=E.take,IN=E.insert,SC=E.screen,g4=at(5,'g4'),k3=at(5,'k3'),FL=E.flash,TR=E.tears,k4=at(5,'k4'),SS=E.sunset,TL=E.tl,END=E.end;
    const m=ease(t/2.4),sset=ease((t-SS+0.3)/1.2);
    let top=lerpCol('#7a86b8','#bfe0ff',m),bot=lerpCol('#ffc49a','#fff3e4',m);
    if(t>SS-0.3&&t<TL){top=lerpCol(top,'#ff9a7a',sset);bot=lerpCol(bot,'#ffe0a8',sset)}
    setSky(top,bot+' 72%');hemi.intensity=0.8+m*0.6;dl.intensity=0.6+m*0.8;fog.color.set(lerpCol('#e8c8c0','#eef0f6',m));
    sun.material.opacity=t>SS-0.3&&t<TL?sset:0;
    // ENFJ 장군 (벤치 왼쪽)
    standPose(J);sitPose(J);J.userData.hip.position.y=0.6;J.position.set(-0.65,0,0.05);J.rotation.set(0,0,0);
    const sleep=t<WK;J.userData.head.rotation.x=sleep?0.55:0;setFace(J,!sleep);
    J.userData.head.rotation.y=(t>g3-0.3&&t<SIT+1.2)?0.5:(t>Q-0.2&&t<TK+0.4)?0.45:0;
    if(t>WK+0.3&&t<CN-0.55){J.userData.head.rotation.x=0.45;J.userData.head.rotation.y=-0.5}
    else if(t>=CN-0.55&&t<CN+0.2){J.userData.head.rotation.x=0.35;J.userData.head.rotation.y=-0.75}
    if(t>Q-0.2&&t<TK+0.4)J.userData.head.rotation.x=0.3;
    const holdCan=t>CN;const aL=J.userData.arms[0];
    if(holdCan){const k=ease((t-CN)/0.4),up=t<g3-0.3?1:ease(1-(t-g3+0.3)/0.4);aL.rotation.x=-1.2*k-0.45*k*up;aL.rotation.z=0.45*k*up+0.1*k}
    J.updateMatrixWorld(true);
    if(holdCan){aL.children[1].getWorldPosition(hp);cn.position.set(hp.x+0.05,hp.y-0.12,hp.z+0.05);cn.rotation.y=Math.PI/2}else{cn.position.set(-1.05,0.54,0.14);cn.rotation.y=0}
    // ISTP 장군
    standPose(T);const ebL=T.userData.ebs[0];const aT=T.userData.arms[0];
    if(t<SIT){T.position.set(2.4,0,-0.35);T.rotation.y=-2.2}
    else if(t<SIT+1.15){const k=ease((t-SIT)/1.15);T.position.set(2.4-k*1.65,0,-0.35+k*0.75);T.rotation.y=-2.2+k*0.8;walkPose(T,t*7,0.45)}
    else{sitPose(T);T.userData.hip.position.y=0.6;T.position.set(0.75,0,0.05);T.rotation.y=0}
    if(t>PL-0.1&&t<OF){const k=ease((t-PL+0.1)/0.35);aT.rotation.x=-2.75*k;aT.rotation.z=-0.55*k}
    else if(t>=OF&&t<OF+0.55){const k=ease((t-OF)/0.35);aT.rotation.x=-2.75+(2.75-0.8)*k;aT.rotation.z=-0.55-0.1*k}
    else if(t>=OF+0.55&&t<SS-0.3){const k=ease((t-OF-0.55)/0.35);aT.rotation.x=-0.8+0.3*k;aT.rotation.z=-0.65*(1-k)+0.12*k}
    else if(t>=SS-0.3){aT.rotation.x=-0.7}
    ebL.visible=t<PL+0.25;budT.visible=t>=PL+0.25&&t<OF+0.35;
    budB.visible=t>=OF+0.35&&t<TK+0.15;if(budB.visible){const dr=1-ease((t-OF-0.35)/0.15);budB.position.set(0.05,0.6+dr*0.08,0.2)}
    // ENFJ가 받아서 귀에 꽂음
    const aR=J.userData.arms[1];
    if(t>TK-0.35&&t<TK+0.3){const k=ease((t-TK+0.35)/0.45);aR.rotation.x=-0.55*k;aR.rotation.z=0.55*k}
    else if(t>=TK+0.3&&t<IN+0.4){const k=ease((t-TK-0.3)/(IN-TK-0.3));aR.rotation.x=-0.55-(2.2)*k;aR.rotation.z=0.55+0.05*k}
    else if(t>=IN+0.4&&t<IN+0.9){const k=ease((t-IN-0.4)/0.5);aR.rotation.x=-2.75*(1-k);aR.rotation.z=0.6*(1-k)}
    budJ.visible=t>=TK+0.15&&t<IN;budE.visible=t>=IN;
    updSteam(stm,t,cn.position.x,cn.position.y+0.24,cn.position.z+0.05,t>WK&&t<CN?1:0);
    zz.position.copy(headPos(J,0.75));zz.visible=sleep;zz.position.y+=Math.sin(t*3)*0.05;
    updTears(J,t,t>TR&&t<SS?1:0);if(t>TR&&t<SS){J.userData.head.rotation.x=0.1;setFace(J,true)}
    bl.visible=t<TL;cn.visible=t<TL;
    const hJ=headPos(J,0.85),hT=headPos(T,0.85);
    bG3.position.copy(hJ);bG4.position.copy(hJ);bQ.position.copy(hJ);bK2.position.copy(hT);bK3.position.copy(hT);bK4.position.copy(hT);
    show(bG3,t,g3,endOf(5,'g3',0.4));show(bK2,t,k2,endOf(5,'k2',0.5));show(bQ,t,Q,TK+0.3);show(bG4,t,g4,endOf(5,'g4',0.3));show(bK3,t,k3,FL);show(bK4,t,k4,endOf(5,'k4',0.5));
    const tl=t>TL;crowd.forEach((q,i)=>{const v=tl&&t>TL+0.2+i*0.09;q.p.visible=v;q.mat.visible=v;
      q.p.updateMatrixWorld(true);q.p.userData.head.getWorldPosition(hp);q.nt.forEach((o,k)=>{const lt=((t-TL)*0.55+o.ph)%1;const kk=Math.sin(lt*Math.PI)*(v?1:0);o.n.visible=kk>0.03;o.n.position.set(hp.x+(k?0.35:-0.35)+Math.sin(lt*6+o.ph*9)*0.12,hp.y+0.25+lt*1.1,hp.z);o.n.scale.set(o.n.userData.base[0]*kk,o.n.userData.base[1]*kk,1)})});
    walkers.forEach((p,i)=>{p.visible=false;const lt=((t-TL)*0.35+i/8)%1;p.position.set(-10+lt*11,0,7+(i%3)*1.2);p.rotation.y=Math.PI/2;walkPose(p,t*8+i,0.5)});
    for(const p of[J,T])p.visible=!tl;
    // 카메라
    if(t<WK+0.3){const k=ease(t/(WK+0.3));setCam(C,[1.2,1.9,4.0-k*0.4],[-0.3,1.3,0],44)}
    else if(t<CN-0.6){setCam(C,[0.15,1.75,1.85],[-0.7,1.45,0],42)}
    else if(t<g3-0.3){const k=ease((t-CN-0.05)/0.6);const c=cn.position;setCam(C,lerp3([-0.25,1.5,2.1],[c.x+0.55,c.y+0.45,c.z+1.85],k),lerp3([-0.9,0.85,0.1],[c.x-0.1,c.y+0.35,c.z],k),44)}
    else if(t<SIT+1.3){setCam(C,[0.8,1.95,7.4],[0.85,1.3,0],46)}
    else if(t<PL-0.15){setCam(C,[0.05,1.75,3.6],[0.05,1.25,0],44)}
    else if(t<OF+0.2){setCam(C,[1.0,1.8,1.65],[0.75,1.7,0],40)}
    else if(t<TK+0.4){setCam(C,[0.05,1.5,3.0],[0.05,0.95,0],44)}
    else if(t<SC){setCam(C,[0.55,1.8,0.95],[-0.65,1.72,0],42)}
    else if(t<k3-0.1){setCam(C,[-0.95,1.75,1.85],[-0.65,1.6,0],40)}
    else if(t<FL){setCam(C,[1.0,1.85,1.75],[0.75,1.72,0],40)}
    else if(t<k4-0.05){setCam(C,[-0.8,1.75,1.75],[-0.65,1.62,0],38)}
    else if(t<SS-0.3){setCam(C,[0.05,1.85,3.7],[0.05,1.45,0],44)}
    else if(t<TL){const k=ease((t-SS)/6);setCam(C,lerp3([0.0,2.0,-4.4],[0.0,2.2,-5.4],k),[0,1.1,10],50)}
    else{const k=ease((t-TL)/7);setCam(C,lerp3([0,4.4,-1.2],[0.6,5.2,-3.0],k),[0,0.3,10],52)}
    // UI
    chipPop(chC,t,CN+0.15);chC.style.opacity=t>CN+0.15&&t<g3-0.3?1:0;
    chipPop(chD,t,0.25);chD.style.opacity=t>0.25&&t<CN-0.6?1:0;
    chipPop(chB,t,OF+0.2);chB.style.opacity=t>OF+0.2&&t<SC?1:0;
    const pO=t>SC&&t<endOf(5,'g4',0.5);ph.style.opacity=pO?1:0;ph.style.transform=`translateX(-50%) scale(${0.85+0.15*pop((t-SC)/0.3)})`;
    const fO=t>FL&&t<TR;fb.style.opacity=fO?clamp01(Math.min((t-FL)/0.15,(TR-t)/0.15)):0;
    chipPop(ch,t,E.chip);ch.style.opacity=t>E.chip&&t<SS-0.3?1:0;
    chipPop(ch2,t,TL+0.4);ch2.style.opacity=t>TL+0.4&&t<END?1:0;ch2.style.top='230px';
    popEl(stat,t,E.stat,'translateX(-50%)');stat.style.display=t>E.stat&&t<END?'flex':'none';
    const ke=t>END;endd.style.opacity=ke?clamp01((t-END)/0.3)*0.9:0;e1.style.opacity=e2.style.opacity=ke?1:0;popEl(e1,t,END+0.1);popEl(e2,t,END+0.3);
    caption(5,t);renderer.render(scene,C);
  };
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
