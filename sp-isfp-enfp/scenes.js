// ---------- 공용 ----------
const S=[];
function mkE(){ // ENFP 여자 (시안 C): 양갈래 번, 큰 눈, 웃는 입, 분홍 티 + 노란 치마, 매끈한 얼굴
  const p=makePerson(rng(31),{shirt:0xff9fcf,pants:0x55506a});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;u.hip.children[0].scale.x=0.9;const skin=u.arms[0].children[1].material;u.legs.forEach(l=>{l.children[0].material=skin});
  const skirt=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.36,0.36,16),lamb(0xfff0a8));skirt.position.y=-0.14;u.hip.add(skirt);
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  for(const sx of[-1,1]){
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.045,20,16),basic(0x2a1a14));e.scale.set(0.9,1.2,0.5);e.position.set(sx*0.095,0.25,0.232);e.userData.eye=1;h.add(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.015,12,8),basic(0xffffff));hl.position.set(sx*0.095+0.015,0.27,0.252);hl.userData.eye=1;h.add(hl);
    const la=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.012,0.012),basic(0x2a1a14));la.position.set(sx*0.135,0.29,0.226);la.rotation.z=sx*0.6;h.add(la);
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.045,20),new THREE.MeshBasicMaterial({color:0xff9fb8,transparent:true,opacity:0.75}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.04,0.011,8,16,Math.PI),basic(0xd8506e));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  // 머리: 두피에 딱 붙는 캡 + 얇은 앞머리 + 양갈래 번
  const m=smooth(0x7a4a32);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.262,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.22;h.add(cap);
  const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.85,0.22,0.42);bang.position.set(0,0.39,0.14);h.add(bang);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.266,40,24,Math.PI,Math.PI,0,Math.PI*0.72),m);bk.position.y=0.25;h.add(bk);
  for(const sx of[-1,1]){const bun=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,18),m);bun.position.set(sx*0.17,0.47,-0.06);h.add(bun);
    const tie=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.018,8,16),smooth(0xff4d8d));tie.position.set(sx*0.15,0.42,-0.05);tie.rotation.set(0.3,0,sx*0.75);h.add(tie)}
  // 2등신 느낌: 몸은 줄이고 머리는 키움
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  return p}
const ISHIRT=[0x9fd8c0,0xb8e0d2,0xc7d9b7,0xa8c8e0,0xd8c8e8,0xe8d8b8,0xb0d8d0];
function mkI(r){return makePerson(r,{shirt:pick(r,ISHIRT)})}
function eyesClose(p,k){p.userData.head.children.forEach(c=>{if(c.userData.eye){if(!c.userData.sy)c.userData.sy=c.scale.y;c.scale.y=c.userData.sy*(1-0.85*k)}})}
function riceBox(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.2,0.3),lamb(0xffffff));g.add(b);
  const band=new THREE.Mesh(new THREE.BoxGeometry(0.43,0.21,0.08),lamb(0xff8fc8));g.add(band);return g}
function holdObj(p,side,obj,y=-0.62,z=0.12){obj.position.set(0,y,z);p.userData.arms[side].add(obj);return obj}
function camMesh(){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(0.22,0.14,0.1),lamb(0x2b2b30)));const l=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.08,10),lamb(0x55555f));l.rotation.x=Math.PI/2;l.position.z=0.08;g.add(l);return g}
function bookMesh(){return new THREE.Mesh(new THREE.BoxGeometry(0.34,0.26,0.03),lamb(0xfff3d6))}
function phoneMesh(){return new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a))}
// 집: 정면 창문 2개(불·커튼), 문(경첩)
function home(r,o={}){
  const g=new THREE.Group();const w=o.w||2.6,h=o.h||2.4,d=2.4;
  const wall=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lamb(o.wall??pick(r,[0xf2e3d0,0xe6efe0,0xf3dfe3,0xdfe8f2,0xf0ead8])));wall.position.y=h/2;g.add(wall);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(w*0.86,1.1,4),lamb(o.roof??pick(r,[0xd9776f,0x7aa6c9,0x8cc9a0,0xc99ad9,0xe0b060])));roof.rotation.y=Math.PI/4;roof.position.y=h+0.55;roof.scale.z=d/w;g.add(roof);
  const wins=[];
  for(const x of(o.wx||[-w*0.24])){
    const fr=new THREE.Mesh(new THREE.BoxGeometry(0.78,0.78,0.06),lamb(0xffffff));fr.position.set(x,h*0.6,d/2+0.02);g.add(fr);
    const glass=new THREE.Mesh(new THREE.PlaneGeometry(0.64,0.64),new THREE.MeshBasicMaterial({color:0xffe39a}));glass.position.set(x,h*0.6,d/2+0.06);g.add(glass);
    let face=null;if(o.peek){face=new THREE.Group();const hd=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,8),lamb(pick(r,SKIN)));face.add(hd);
      const hr=new THREE.Mesh(new THREE.SphereGeometry(0.17,12,8,0,Math.PI*2,0,Math.PI*0.5),lamb(pick(r,HAIR)));hr.position.y=0.02;hr.rotation.x=-0.3;face.add(hr);
      for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.05,0.02),lamb(0x1a1a1a));e.position.set(s*0.06,0.01,0.15);face.add(e)}
      face.position.set(x+(r()-0.5)*0.15,h*0.6-0.2,d/2+0.12);g.add(face)}
    const cm=lamb(o.curtain??pick(r,[0xbfe8d6,0xf7d3e0,0xd6e4f7,0xf2e6b8]));
    const cl=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.68,0.03),cm),cr=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.68,0.03),cm);
    cl.position.set(x,h*0.6,d/2+0.3);cr.position.set(x,h*0.6,d/2+0.3);g.add(cl,cr);
    wins.push({x,glass,cl,cr,face});
  }
  const dx=o.dx??w*0.24;
  const dfr=new THREE.Mesh(new THREE.BoxGeometry(0.86,1.5,0.06),lamb(0xffffff));dfr.position.set(dx,0.75,d/2+0.01);g.add(dfr);
  const dark=new THREE.Mesh(new THREE.PlaneGeometry(0.72,1.38),basic(0x3a3040));dark.position.set(dx,0.7,d/2+0.045);g.add(dark);
  const hinge=new THREE.Group();hinge.position.set(dx-0.36,0,d/2+0.06);g.add(hinge);
  const door=new THREE.Mesh(new THREE.BoxGeometry(0.72,1.4,0.06),lamb(o.door??0x9a6a4a));door.position.set(0.36,0.7,0);hinge.add(door);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,6),lamb(0xffd84d));knob.position.set(0.6,0.7,0.05);hinge.add(knob);
  const bell=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.16,0.04),lamb(0xeeeeee));bell.position.set(dx+0.52,1.0,d/2+0.03);g.add(bell);
  g.userData={wins,hinge,dx,d,h};return g}
function setWin(hm,i,lit,ck){const w=hm.userData.wins[i];w.glass.material.color.set(lit?0xffe39a:0x3d4560);
  const k=clamp01(ck);w.cl.position.x=w.x-0.33+0.17*k;w.cr.position.x=w.x+0.33-0.17*k;w.cl.scale.x=w.cr.scale.x=0.05+0.95*k;
  w.cl.position.x=w.x-0.32+0.15*k;w.cr.position.x=w.x+0.32-0.15*k}
function signPlane(text,w,h,o={}){const t=canvasTex(Math.round(w*400),Math.round(h*400),(x,cw,ch)=>{x.fillStyle=o.bg||'#fff';rr(x,0,0,cw,ch,o.r??30);x.fill();x.strokeStyle=o.line||'rgba(0,0,0,.15)';x.lineWidth=10;x.stroke();
  x.fillStyle=o.fg||'#333';x.font=`900 ${o.fs||Math.round(ch*0.42)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,cw/2,ch/2+4)});
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide}))}
function grass(scene,col=0xa9c99a){const g=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(col));g.rotation.x=-Math.PI/2;g.position.y=-0.01;scene.add(g);return g}
function lane(scene,z,col=0xd8d2c6){const l=new THREE.Mesh(new THREE.PlaneGeometry(200,3.2),lamb(col));l.rotation.x=-Math.PI/2;l.position.set(0,0.005,z);scene.add(l);return l}
function dayChip(text){return chip(text)}
function statChip(html){const el=document.createElement('div');el.className='stat';el.innerHTML=html;ui.appendChild(el);return el}
function popEl(el,t,t0,base='translateX(-50%) '){el.style.transform=`${base}scale(${pop((t-t0)/0.3)})`;el.style.opacity=clamp01((t-t0)/0.08)}
function hop(t,a,b,hgt){const k=clamp01((t-a)/(b-a));return Math.sin(k*Math.PI)*hgt}

// ---------- 0 타이틀: 이삿짐 트럭에서 뛰어내린 ENFP, 커튼이 동시에 '촥' ----------
S[0]=()=>{
  bgEl.style.background='linear-gradient(#8fc6f2,#cfe8ff 55%,#f2f8ff)';
  const scene=new THREE.Scene();addLights(scene,{dpos:[5,10,9]});
  const r=rng(11);grass(scene);lane(scene,1.0);
  const homes=[];
  for(let i=0;i<5;i++){const hm=home(r,{wx:[-0.65]});hm.position.set(-5.8+i*2.9,0,-4.2);scene.add(hm);homes.push(hm)}
  // 이삿짐 트럭
  const truck=new THREE.Group();const box=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.7,1.6),lamb(0xf5f0e6));box.position.set(0,1.35,0);truck.add(box);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(1.0,1.2,1.6),lamb(0xffb0c8));cab.position.set(-1.7,1.1,0);truck.add(cab);
  const cw=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.5),basic(0x9fd0ff));cw.position.set(-1.7,1.35,0.81);truck.add(cw);
  for(const x of[-1.5,0.7])for(const z of[-0.8,0.8]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.22,12),lamb(0x2b2b30));wh.rotation.x=Math.PI/2;wh.position.set(x,0.32,z);truck.add(wh)}
  const lab=signPlane('이사 왔어요 ♥',1.8,0.5,{bg:'#ffe0f0',fg:'#8a1f5a'});lab.position.set(0,1.5,0.81);truck.add(lab);
  truck.position.set(-3.4,0,1.1);scene.add(truck);
  const boxes=[];for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.4,0.5),lamb(0xd9b98a));b.position.set(-1.6+i*0.15,0.2+i*0.4,1.9-i*0.05);b.rotation.y=i*0.3;scene.add(b)}
  const E=mkE();scene.add(E);const eb=makeBubble('ENFP',{...EB,fs:70,size:0.0085});eb.position.y=2.45;E.add(eb);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="tag2">나만 다른 MBTI</div><div class="t1b out">온 세상이 <span style="color:${C_I}">ISFP</span>인데</div><div class="t2b out">나만 <span style="color:${C_E}">ENFP</span>라면?</div>`;
  const tg=ui.querySelector('.tag2'),t1=ui.querySelector('.t1b'),t2=ui.querySelector('.t2b');
  const e1=lineT(0,'e1'),shut=e1.t1+0.1;
  return t=>{
    // 점프: 트럭 짐칸 → 길 가운데
    const jk=ease((t-0.15)/0.7);
    E.position.set(-2.2+2.3*jk,(1-jk)*1.05+hop(t,0.15,0.85,0.8),1.7);
    E.rotation.y=0;standPose(E);
    if(t<0.85){E.userData.legs[0].rotation.x=-0.5;E.userData.legs[1].rotation.x=0.4;armUp(E,0,0.6);armUp(E,1,0.6)}
    else if(t>e1.t0-0.1){const k=ease((t-e1.t0+0.1)/0.25);armUp(E,0,k);armUp(E,1,k);
      const wv=Math.sin((t-e1.t0)*14)*0.35*k;E.userData.arms[0].rotation.z=-0.18-wv;E.userData.arms[1].rotation.z=0.18+wv;E.position.y=Math.abs(Math.sin((t-e1.t0)*7))*0.12*k}
    scaleBubble(eb,pop((t-0.9)/0.3));
    homes.forEach((hm,i)=>{const k=ease((t-shut-i*0.04)/0.22);setWin(hm,0,k<0.6,k);})
    cam.position.set(-0.3,2.5,10.6);cam.lookAt(-0.3,2.05,-1);
    tg.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t1.style.opacity=clamp01((t-0.1)/0.1);
    t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t2.style.opacity=clamp01((t-0.35)/0.1);
    caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- 1 이사 떡: 초인종 → 불 꺼짐 / 다음 날 아침 감사 쪽지 산더미 ----------
S[1]=()=>{
  bgEl.style.background='linear-gradient(#8fc6f2,#cfe8ff 55%,#f2f8ff)';
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffffff,0x8a8070,1.6);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(6,12,8);scene.add(sun);
  const r=rng(21);grass(scene);lane(scene,0.6);
  const homes=[];for(let i=0;i<4;i++){const hm=home(r,{wx:[-0.65]});hm.position.set(i*3.4,0,-1.8);scene.add(hm);homes.push(hm)}
  // 다음 날: ENFP 집 앞 쪽지 산더미
  const mine=home(r,{wall:0xffe6f0,roof:0xff8fc8,curtain:0xffc2e0,wx:[-0.65]});mine.position.set(40,0,-1.8);scene.add(mine);
  const notes=[];const NC=[0xfffbea,0xffe0f0,0xe0f7ec,0xe8eefc,0xfff1c2];
  for(let i=0;i<70;i++){const n=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.012,0.2),lamb(pick(r,NC)));const a=r()*Math.PI*2,rad=Math.sqrt(r())*0.55;
    n.position.set(40+mine.userData.dx+Math.cos(a)*rad,0.01+i*0.0045+(0.55-rad)*0.35,-1.8+1.2+0.55+Math.sin(a)*rad*0.6);n.rotation.y=r()*3;n.rotation.x=(r()-0.5)*0.4;scene.add(n);notes.push(n)}
  const E=mkE();scene.add(E);const bx=holdObj(E,1,riceBox(),-0.62,0.18);bx.rotation.x=1.2;
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=dayChip('이사 1일 차');
  const note=document.createElement('div');note.className='note';note.innerHTML='<div class="tape"></div><div class="dd"><span style="color:#ff6f91">♥</span><span style="color:#c9a26a">▣</span><span style="color:#7cc4a0">✿</span></div>떡 너무 맛있었어요 ♥<span class="sm">다음엔 문 앞에 두고<br>문자 주세요!</span>';ui.appendChild(note);
  const st=statChip('떡 100개 · 감사 쪽지 100장 · <b>본 얼굴 0명</b>');
  const CUT=3.4;
  return t=>{
    chipPop(ch,t,0);
    if(t<CUT){
      ch.textContent='이사 1일 차 · 떡 돌리는 중';
      // 집1 문 앞 → 걸어서 집2
      const wk=ease((t-1.45)/0.95);const x=homes[0].userData.dx+3.4*wk;
      E.position.set(x,0,0.05);E.rotation.y=wk>0&&wk<1?Math.PI/2:Math.PI;standPose(E);
      if(wk>0&&wk<1)walkPose(E,t*9,0.5);
      bx.visible=true;
      const press=(t0)=>{const k=clamp01((t-t0)/0.15)*clamp01((t0+0.5-t)/0.15);E.userData.arms[0].rotation.x=-1.5*k;E.userData.arms[0].rotation.z=-0.45*k};
      if(t<1.4)press(0.2);else if(t>2.45)press(2.5);
      setWin(homes[0],0,t<1.25,0);setWin(homes[1],0,t<3.05,0);
      cam.position.set(x+1.6,2.7,7.6);cam.lookAt(x+0.5,1.1,-1.2);
      note.style.opacity=0;st.style.opacity=0;
    }else{
      const lt=t-CUT;ch.textContent='다음 날 아침';
      hemi.intensity=1.8;
      E.position.set(40+mine.userData.dx+0.95,0,0.1);E.rotation.y=-0.5;standPose(E);bx.visible=false;
      mine.userData.hinge.rotation.y=-1.3;
      const k=ease(lt/0.5);E.userData.arms[0].rotation.x=-0.5*k;E.userData.arms[1].rotation.x=-0.5*k;
      setWin(mine,0,true,0);
      cam.position.set(40+mine.userData.dx+0.5-lt*0.08,3.0-lt*0.05,7.4-lt*0.2);cam.lookAt(40+mine.userData.dx+0.4,0.55,-0.6);
      note.style.transform=`rotate(-3deg) scale(${pop((lt-0.7)/0.35)})`;note.style.opacity=clamp01((lt-0.7)/0.1);
      popEl(st,t,5.9);
    }
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- 2 파티 초대: 단톡 '꼭 갈게요'×30 → 6:50 알림 폭탄 → 7시 혼자 ----------
S[2]=()=>{
  bgEl.style.background='linear-gradient(#ffd9ec,#ffeef6 60%,#fff8fb)';
  const scene=new THREE.Scene();addLights(scene,{sun:0xfff0e0});
  // 3D 파티 방
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xe9d6c0));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(30,12),lamb(0xffe3ee));wall.position.set(0,6,-3);scene.add(wall);
  const tb=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,0.12,24),lamb(0xffffff));tb.position.y=0.9;scene.add(tb);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.2,0.9,8),lamb(0xd8c8b8));leg.position.y=0.45;scene.add(leg);
  const cake=new THREE.Group();const c1=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,0.32,16),lamb(0xfff3f6));cake.add(c1);
  const c2=new THREE.Mesh(new THREE.CylinderGeometry(0.47,0.47,0.06,16),lamb(0xff8fc8));c2.position.y=0.17;cake.add(c2);
  for(let i=0;i<5;i++){const cd=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.18,6),lamb(0x9fd8ff));const a=i/5*Math.PI*2;cd.position.set(Math.cos(a)*0.25,0.3,Math.sin(a)*0.25);cake.add(cd);
    const fl2=glowSprite('rgba(255,210,120,1)',0.22);fl2.position.copy(cd.position);fl2.position.y+=0.13;cake.add(fl2)}
  cake.position.set(0,1.12,0);scene.add(cake);
  const chairs=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/2;if(Math.sin(a)<-0.99)continue;const c=new THREE.Group();
    const s=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.08,0.55),lamb(0xffffff));s.position.y=0.55;c.add(s);const bk=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.6,0.08),lamb(0xffffff));bk.position.set(0,0.85,-0.26);c.add(bk);
    const hat=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.3,10),lamb(pick(rng(i+5),[0x9df2c8,0xffd84d,0x9fd8ff])));hat.position.set(0.12,0.75,0.05);c.add(hat);
    c.position.set(Math.cos(a)*2.3,0,Math.sin(a)*2.3);c.lookAt(0,0,0);scene.add(c);chairs.push(c)}
  for(let i=0;i<9;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.4,3),lamb([0xff8fc8,0x9df2c8,0xffd84d][i%3]));f.rotation.x=Math.PI;f.position.set(-3.2+i*0.8,4.0-Math.sin(i/8*Math.PI)*0.5,-2.9);scene.add(f)}
  const E=mkE();E.position.set(0,0,-2.25);E.rotation.y=0;scene.add(E);sitPose(E);
  const ph=new THREE.Mesh(new THREE.ConeGeometry(0.14,0.36,10),lamb(0xffd84d));ph.position.set(0.05,0.62,0);E.userData.head.add(ph);
  const ch2=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.08,0.55),lamb(0xffffff));ch2.position.set(0,0.52,-2.25);scene.add(ch2);
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,100);
  // DOM 단톡방
  const ch=dayChip('이사 2일 차 · PM 9:00');
  const phone=document.createElement('div');phone.className='phone';
  phone.innerHTML='<div class="screen"><div class="sbar"><span>9:00</span><span>▮▮▮ 100%</span></div><div class="head">우리 동네 ♥ <span style="color:#888;margin-left:12px">31</span></div><div class="msgs"></div></div>';
  ui.appendChild(phone);const msgs=phone.querySelector('.msgs');
  const NAMES=['민지','하늘','도윤','서아','준호','유나','지호','소율','태오','다은'];
  const RE=['좋아요!! 꼭 갈게요 ㅎㅎ','저도 갈게요~ ㅎㅎ','꼭 갈게요 ♥'];
  const items=[];
  const me=document.createElement('div');me.className='row me';me.innerHTML='<div class="b">내일 저녁 7시 우리 집 파티!!<br>다들 와요~ ♥</div>';msgs.appendChild(me);items.push({el:me,t:0.4});
  RE.forEach((x,i)=>{const d=document.createElement('div');d.className='row';d.innerHTML=`<div class="av" style="background:${['#9df2c8','#b8e0d2','#a8c8e0','#d8c8e8'][i%4]}"></div><div><div class="who">${NAMES[i]}</div><div class="b">${x}</div></div>`;msgs.appendChild(d);items.push({el:d,t:1.0+i*0.2})});
  const cnt=statChip('참석 확정 <b>30명</b> ✔');
  const NT=[['민지','헉 갑자기 배가 아파서…'],['하늘','고양이가 아파서 ㅠㅠ'],['도윤','비가 와서… <span class="wx">☀ 맑음</span>'],['서아','갑자기 일이 생겨서…'],['준호','어제 먹은 게 좀…'],['유나','오늘은 좀 피곤해서 ㅠ']];
  const notis=NT.map((n,i)=>{const d=document.createElement('div');d.className='noti';d.style.top=(340+i*132)+'px';d.innerHTML=`<div class="ic" style="background:${['#9df2c8','#b8e0d2','#a8c8e0'][i%3]}"></div><div><div class="nm">우리 동네 ♥ · ${n[0]}</div><div class="tx">${n[1]}</div></div>`;ui.appendChild(d);return d});
  const st=statChip('참석 확정 30명 · <b>실제 참석 0명</b>');
  const CUT=6.35;
  return t=>{
    chipPop(ch,t,0);
    if(t<CUT){
      bgEl.style.background='linear-gradient(#ffd9ec,#ffeef6 60%,#fff8fb)';
      ch.textContent=t<3.6?'이사 2일 차 · PM 9:00':'파티 당일 · AM 8:00';
      phone.style.display='';items.forEach(q=>{const k=pop((t-q.t)/0.25);q.el.style.display=t<q.t?'none':'';q.el.style.transform=`scale(${k})`;q.el.style.transformOrigin=q.el.classList.contains('me')?'right bottom':'left bottom'});
      popEl(cnt,t,2.05);if(t>3.4)cnt.style.opacity=0;
      phone.style.filter=t>3.75?'brightness(.75)':'';
      notis.forEach((d,i)=>{const t0=3.9+i*0.28;d.style.display=t<t0?'none':'';d.style.transform=`translateY(${(1-ease((t-t0)/0.2))*-40}px) scale(${pop((t-t0)/0.25)})`});
      st.style.opacity=0;renderer.clear();
    }else{
      const lt=t-CUT;phone.style.display='none';cnt.style.opacity=0;notis.forEach(d=>d.style.display='none');
      bgEl.style.background='linear-gradient(#2c2547,#4a3d6e 60%,#6a5a8a)';ch.textContent='PM 7:00';
      E.userData.arms.forEach(a=>{a.rotation.x=-0.9;a.rotation.z=0});E.userData.head.rotation.x=0.25+Math.sin(lt*1.2)*0.03;
      cam.position.set(Math.sin(lt*0.12)*1.2,4.2-lt*0.1,7.4-lt*0.15);cam.lookAt(0,0.55,-0.6);
      popEl(st,t,8.0);
      renderer.render(scene,cam);
    }
    caption(2,t);
  };
};

// ---------- 3 노을 사진 한 장: 답장 0, 그런데 다들 알아서 나옴 ----------
S[3]=()=>{
  bgEl.style.background='linear-gradient(#6a5aa8,#c87ab8 40%,#ffb38a 75%,#ffd9a8)';
  const scene=new THREE.Scene();addLights(scene,{sky:0xffd8e8,sun:0xffc89a,dir:1.4,hemi:1.5,dpos:[-8,6,6]});
  const r=rng(31);grass(scene,0x9db08a);lane(scene,0.9,0xd8c6c0);
  const homes=[];for(let i=0;i<6;i++){const hm=home(r,{wx:[-0.65]});hm.position.set(-7+i*2.9,0,-3.2);scene.add(hm);homes.push(hm);setWin(hm,0,true,0)}
  const P=[];const PROPS=[camMesh,bookMesh,phoneMesh];
  homes.forEach((hm,i)=>{for(let j=0;j<2;j++){const p=mkI(r);scene.add(p);const it=holdObj(p,1,PROPS[(i+j)%3](),-0.62,0.14);
    const hp=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.04,6,14,Math.PI),lamb(0x2b2b30));hp.position.y=0.27;if((i+j)%2)p.userData.head.add(hp);
    P.push({p,hm,t0:2.1+i*0.32+j*0.5,j})}});
  const E=mkE();E.position.set(2.5,0,3.8);E.rotation.y=Math.PI*1.15;scene.add(E);
  const q=makeBubble('…?',{...EB,fs:80,size:0.0085});q.position.y=2.45;E.add(q);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=dayChip('이사 3일 차 · PM 6:20');
  const card=document.createElement('div');card.className='phone';card.style.cssText='top:360px;height:760px';
  card.innerHTML='<div class="screen"><div class="sbar"><span>6:20</span><span>▮▮▮ 72%</span></div><div class="head">우리 동네 ♥ <span style="color:#888;margin-left:12px">31</span></div><div class="msgs"><div class="row me"><span class="read">30</span><div class="photo"><div class="sun"></div><div class="sea"></div></div></div><div class="row me"><span class="read">30</span><div class="b">와 오늘 하늘 미쳤다</div></div><div class="div" style="opacity:0">답장 0개</div></div></div>';
  ui.appendChild(card);const rows=card.querySelectorAll('.row'),dv=card.querySelector('.div'),reads=card.querySelectorAll('.read');
  const st=statChip('초대했을 때 0명 · <b>안 불렀을 때 30명</b>');
  return t=>{
    chipPop(ch,t,0);
    const ck=t<1.75?0:ease((t-1.75)/0.35);
    card.style.display=ck>=1?'none':'';card.style.transform=`translateY(${ck*1300}px)`;
    rows.forEach((rw,i)=>{const t0=0.5+i*0.25;rw.style.display=t<t0?'none':'';rw.style.transform=`scale(${pop((t-t0)/0.25)})`;rw.style.transformOrigin='right bottom'});
    reads.forEach(x=>x.textContent=String(Math.max(0,30-Math.floor(clamp01((t-0.9)/0.6)*30))||''));
    dv.style.opacity=clamp01((t-1.2)/0.15);
    P.forEach(o=>{const {p,hm}=o;const lt=t-o.t0;hm.userData.hinge.rotation.y=-1.4*ease((t-o.t0+0.4)/0.4);
      const dxw=hm.position.x+hm.userData.dx;
      if(lt<0){p.visible=false;return}p.visible=true;
      const out=ease(lt/0.6);const wx=dxw+Math.max(0,lt-0.6)*1.25+o.j*0.25;p.position.set(wx,0,-3.2+1.2+0.3+out*1.2+o.j*0.35);
      p.rotation.y=lt<0.6?0:Math.PI/2;walkPose(p,lt*8,0.45)});
    const qk=pop((t-3.0)/0.3);scaleBubble(q,qk);E.userData.head.rotation.y=Math.sin(Math.max(0,t-3)*2.4)*0.25;
    cam.position.set(1.0+t*0.15,3.2,11.2);cam.lookAt(1.0+t*0.15,1.75,-1);
    popEl(st,t,4.5);
    caption(3,t);renderer.render(scene,cam);
  };
};

// ---------- 4 강변 노을: '2차 노래방 가자!!' → 해가 지며 한 명씩 사라짐 ----------
S[4]=()=>{
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffd8c8,0x6a5070,1.5);scene.add(hemi);
  const dl=new THREE.DirectionalLight(0xffb080,1.3);dl.position.set(0,4,-10);scene.add(dl);const fill=new THREE.DirectionalLight(0xffffff,0.6);fill.position.set(3,6,8);scene.add(fill);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(60,30),lamb(0xa8a088));g.rotation.x=-Math.PI/2;g.position.z=12;scene.add(g);
  const river=new THREE.Mesh(new THREE.PlaneGeometry(200,80),new THREE.MeshLambertMaterial({color:0x7a6aa8}));river.rotation.x=-Math.PI/2;river.position.set(0,-0.3,-43);scene.add(river);
  const far=new THREE.Mesh(new THREE.BoxGeometry(200,1.2,4),lamb(0x6a5a88));far.position.set(0,0,-60);scene.add(far);
  for(let x=-8;x<=8;x+=1.0){const pst=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.9,0.08),lamb(0xf2efe8));pst.position.set(x,0.45,-2.9);scene.add(pst)}
  const rail=new THREE.Mesh(new THREE.BoxGeometry(17,0.08,0.1),lamb(0xf2efe8));rail.position.set(0,0.92,-2.9);scene.add(rail);
  const sunG=glowSprite('rgba(255,210,140,1)',16);scene.add(sunG);const sun=new THREE.Mesh(new THREE.CircleGeometry(2.4,32),basic(0xffe2a0));scene.add(sun);
  const refl=new THREE.Mesh(new THREE.PlaneGeometry(2.2,30),new THREE.MeshBasicMaterial({color:0xffc890,transparent:true,opacity:0.45}));refl.rotation.x=-Math.PI/2;refl.position.set(0,-0.28,-30);scene.add(refl);
  const r=rng(41);const P=[];
  // 버스 정류장 + 버스
  const stop=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.2,8),lamb(0xdddddd));pole.position.y=1.1;stop.add(pole);
  const sg=signPlane('버스',0.7,0.45,{bg:'#3a7bd5',fg:'#fff'});sg.position.set(0,2.15,0.03);stop.add(sg);stop.position.set(-2.6,0,0.2);stop.visible=false;scene.add(stop);
  const bus=new THREE.Group();const bb0=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.5,1.4),lamb(0x7fd8b0));bb0.position.y=1.05;bus.add(bb0);
  const wnd=new THREE.Mesh(new THREE.PlaneGeometry(3.0,0.5),basic(0xcfeaff));wnd.position.set(0,1.4,0.71);bus.add(wnd);
  const bl=signPlane('집 가는 버스',1.4,0.32,{bg:'#fff',fg:'#2f7a5a'});bl.position.set(0,0.75,0.72);bus.add(bl);
  for(const x of[-1.2,1.2])for(const z of[-0.7,0.7]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.2,12),lamb(0x2b2b30));wh.rotation.x=Math.PI/2;wh.position.set(x,0.3,z);bus.add(wh)}
  bus.position.set(-14,0,-0.3);scene.add(bus);
  for(let i=0;i<4;i++){const p=mkI(r);p.position.set(-2.2+i*1.0,0,-2.1);p.rotation.y=Math.PI;scene.add(p);
    const ph=holdObj(p,1,phoneMesh(),-0.6,0.1);ph.visible=false;
    const lb=labelSprite('버스 3분 후',{bg:'#3a7bd5',fg:'#fff',fs:54,size:0.0042});lb.visible=false;p.add(lb);
    P.push({p,ph,lb,x0:-2.2+i*1.0,t0:2.5+i*0.1})}
  const E=mkE();E.position.set(2.0,0,-1.5);E.rotation.y=-Math.PI*0.6;scene.add(E);
  const app=document.createElement('div');app.className='noti';app.style.cssText='top:360px;height:150px';app.innerHTML='<div class="ic" style="background:#3a7bd5"></div><div><div class="nm">버스 알림 · 집 가는 버스</div><div class="tx" style="font-size:48px">3분 후 도착</div></div>';ui.appendChild(app);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,300);
  const ch=dayChip('PM 6:43 · 강변');
  const st=statChip('2차 참석 0명 · <b>막차 탑승 30명</b>');
  return t=>{
    chipPop(ch,t,0);
    const sk=ease(t/6.3);
    const top=['#7a6ab8','#3a3470'],mid=['#e98aa8','#7a5a98'],bot=['#ffc48a','#c77a90'];
    const mix=(a,b)=>{const c1=new THREE.Color(a),c2=new THREE.Color(b);return '#'+c1.lerp(c2,sk).getHexString()};
    bgEl.style.background=`linear-gradient(${mix(...top)},${mix(...mid)} 45%,${mix(...bot)} 70%)`;
    const sy=2.6-sk*4.4;sun.position.set(0,sy,-58);sunG.position.set(0,sy,-58.5);sunG.material.opacity=1-sk*0.6;refl.material.opacity=0.45*(1-sk);
    hemi.intensity=1.5-sk*0.5;dl.intensity=1.3*(1-sk*0.7);
    // ENFP: 2차 제안 (양팔 번쩍)
    standPose(E);const ek=ease((t-0.25)/0.2)*(1-ease((t-1.6)/0.3));armUp(E,0,ek);armUp(E,1,ek);E.position.y=hop(t,0.3,0.7,0.25)+hop(t,0.7,1.1,0.18);
    // 버스: 왼쪽에서 와서 2.4~3.1 정차, 4.3부터 오른쪽으로 출발
    const bx=t<4.3?-14+13*ease((t-2.2)/0.9):-1.0+14*Math.pow(clamp01((t-4.3)/1.3),1.6);bus.position.x=bx;
    const ak=t<1.75?0:pop((t-1.75)/0.3)*(1-ease((t-2.9)/0.2));app.style.transform=`scale(${ak})`;app.style.display=ak<0.01?'none':'';
    E.userData.head.rotation.y=t>2.4?Math.min(0.9,(t-2.4)*2):0;
    P.forEach((o,i)=>{const {p,ph}=o;const pk=ease((t-1.6-i*0.05)/0.25);ph.visible=pk>0.05&&t<o.t0+0.6;
      if(t<o.t0){standPose(p);p.rotation.y=Math.PI*(1-0.85*pk);p.userData.arms[1].rotation.x=-1.3*pk;p.userData.head.rotation.x=0.3*pk;p.position.set(o.x0,0,-2.1)}
      else{const lt=t-o.t0;p.userData.head.rotation.x=0;p.rotation.y=0;walkPose(p,lt*14,0.8);
        const z=-2.1+lt*1.6;p.position.set(o.x0+(-1.0-o.x0)*clamp01(lt/0.8)*0.3,Math.abs(Math.sin(lt*14))*0.08,z);p.visible=z<-1.05}});
    cam.position.set(0.0,2.9,9.4);cam.lookAt(0.0,1.45,-3);
    popEl(st,t,4.8);
    caption(4,t);renderer.render(scene,cam);
  };
};

// ---------- 5 공원 돗자리: '근데 우리 이제 뭐 해?' '…이게 하는 거예요' ----------
S[5]=()=>{
  bgEl.style.background='linear-gradient(#9cd4f5,#d6efff 60%,#eef8ff)';
  const scene=new THREE.Scene();addLights(scene,{dpos:[4,12,6]});
  const r=rng(51);grass(scene,0x9ccf8a);
  for(let i=0;i<14;i++)tree(scene,-12+r()*24,-9-r()*6,0.8+r()*0.5,pick(r,[0x6fae6a,0x7fbf72,0x5f9e5a]));
  const MATS=[0xffd84d,0x9fd8ff,0xffb0c8,0xc9a8ff,0x9df2c8];
  const lay=(p,x,z,rot=0)=>{p.rotation.order='YXZ';p.rotation.set(-Math.PI/2,rot,0);p.position.set(x,0.12,z);standPose(p);p.userData.arms.forEach(a=>a.rotation.z=0)};
  const spots=[[-2.6,-1.2],[0.2,-2.6],[2.8,-0.6],[-1.2,1.6]];
  const I=[];spots.forEach(([x,z],i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.04,2.4),lamb(MATS[i]));m.position.set(x,0.02,z);scene.add(m);
    const p=mkI(r);lay(p,x,z+0.95);scene.add(p);
    if(i===0){const hp=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.045,6,14,Math.PI),lamb(0x2b2b30));hp.position.y=0.27;hp.rotation.y=Math.PI/2;p.userData.head.add(hp)}
    if(i===1){const b=bookMesh();b.position.set(0,-0.55,0.3);b.rotation.x=1.2;p.userData.arms[1].add(b);p.userData.arms[1].rotation.x=-2.6;p.userData.arms[0].rotation.x=-2.6}
    I.push(p)});
  const mat=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.04,2.4),lamb(0xffffff));mat.position.set(1.5,0.02,2.3);scene.add(mat);
  const E=mkE();scene.add(E);const ib=makeBubble('…이게 하는 거예요',{...IB,fs:60,size:0.0055});ib.position.set(0,0.35,0);
  const ibh=new THREE.Group();scene.add(ibh);ibh.add(ib);ibh.position.set(-0.3,1.2,2.2);
  const leaves=[];for(let i=0;i<10;i++){const l=new THREE.Mesh(new THREE.TetrahedronGeometry(0.09,0),lamb(pick(r,[0x7fbf72,0xb8d86a,0xffc04d])));scene.add(l);leaves.push({l,x:-2+r()*5,z:-1+r()*4,ph:r()*5,sp:0.5+r()*0.4})}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=dayChip('이사 5일 차 · 공원');
  const e4=lineT(5,'e4'),e5=lineT(5,'e5');
  return t=>{
    chipPop(ch,t,0);
    // ENFP: 앉아 있다가 e5 즈음 눕기
    const lk=ease((t-3.2)/0.8);
    if(lk<=0){E.rotation.order='XYZ';E.rotation.set(0,Math.PI*0.15,0);sitPose(E);E.position.set(1.5,0,2.3);
      const tk=ease((t-e4.t0)/0.2)*(1-ease((t-e4.t1)/0.3));E.userData.arms[1].rotation.x=-0.9-1.0*tk;E.userData.head.rotation.y=-0.5*tk}
    else{E.rotation.order='YXZ';E.rotation.set(-Math.PI/2*lk,Math.PI*0.15*(1-lk),0);standPose(E);E.position.set(1.5,0.12*lk,2.3+0.95*lk*0.9);E.userData.arms.forEach(a=>{a.rotation.x=-0.3*(1-lk)});E.userData.head.rotation.y=0}
    eyesClose(E,ease((t-e5.t1+0.6)/0.6)*0.65);
    scaleBubble(ib,pop((t-(e4.t1+0.35))/0.3)*(1-ease((t-4.0)/0.25)));
    I.forEach((p,i)=>{p.userData.head.rotation.y=Math.sin(t*0.8+i)*0.08});
    leaves.forEach(o=>{const y=3.5-((t*o.sp+o.ph)%4);o.l.position.set(o.x+Math.sin(t+o.ph)*0.4,y,o.z);o.l.rotation.set(t*2+o.ph,t*3,0)});
    // 카메라: 옆에서 → 위에서 내려다보기
    const ck=ease((t-3.4)/3.5);
    cam.position.set(0.4+ck*0.3,4.0+ck*6.5,10.6-ck*7.6);cam.lookAt(0.4,0.3-ck*0.2,0.4+ck*0.6);
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- 6 엔딩: 새 이웃 초인종 → 불 끄고 숨기 → '문 앞에 두고 문자 주세요!' ----------
S[6]=()=>{
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xfff2e0,0x8a7a70,1.6);scene.add(hemi);
  const dl=new THREE.DirectionalLight(0xffe8d0,1.2);dl.position.set(3,8,6);scene.add(dl);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(20,20),lamb(0xd8bfa0));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wl=new THREE.Mesh(new THREE.PlaneGeometry(20,10),lamb(0xffe6f0));wl.position.set(0,5,-2.2);scene.add(wl);
  const wl2=new THREE.Mesh(new THREE.PlaneGeometry(10,10),lamb(0xf7dce8));wl2.position.set(-3.4,5,2);wl2.rotation.y=Math.PI/2;scene.add(wl2);
  const bed=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.5,3.0),lamb(0xffffff));bed.position.set(0.6,0.25,-0.4);scene.add(bed);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(2.1,1.1,0.15),lamb(0xffb0c8));hb.position.set(0.6,0.55,-1.95);scene.add(hb);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.18,0.5),lamb(0xfff3f8));pil.position.set(0.6,0.6,-1.55);scene.add(pil);
  const E=mkE();E.rotation.order='YXZ';E.rotation.set(-Math.PI/2,0,0);E.position.set(0.6,0.62,0.16);scene.add(E);standPose(E);
  const blanket=new THREE.Mesh(new THREE.BoxGeometry(2.04,0.24,1),lamb(0xffc2e0));scene.add(blanket);
  const drape=new THREE.Mesh(new THREE.BoxGeometry(2.04,0.42,0.06),lamb(0xffb0d4));drape.position.set(0.6,0.78,1.14);scene.add(drape);
  const lump=new THREE.Mesh(new THREE.SphereGeometry(0.34,14,10),lamb(0xffc2e0));lump.scale.set(1,0.75,1.1);lump.position.set(0.6,0.98,-1.3);scene.add(lump);
  const ridge=new THREE.Mesh(new THREE.CapsuleGeometry(0.3,1.5,4,10),lamb(0xffc2e0));ridge.rotation.x=Math.PI/2;ridge.scale.set(1.1,1,0.42);ridge.position.set(0.6,0.95,0.05);scene.add(ridge);
  const lamp=new THREE.Group();const lp=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.2,8),lamb(0xeeeeee));lp.position.y=0.6;lamp.add(lp);
  const sh=new THREE.Mesh(new THREE.ConeGeometry(0.35,0.4,12,1,true),lamb(0xfff3c4));sh.position.y=1.3;lamp.add(sh);const lg=glowSprite('rgba(255,225,150,1)',2.2);lg.position.y=1.25;lamp.add(lg);lamp.position.set(2.2,0,-1.5);scene.add(lamp);
  const ic=new THREE.Group();const icb=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.7,0.06),lamb(0xf2f2ee));ic.add(icb);const ics=new THREE.Mesh(new THREE.PlaneGeometry(0.36,0.3),basic(0x9fc8e8));ics.position.set(0,0.12,0.035);ic.add(ics);
  ic.position.set(-2.2,1.9,-2.15);scene.add(ic);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.2),basic(0x9fc8f0));win.position.set(-0.9,2.6,-2.18);scene.add(win);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  const ch=dayChip('이사 7일 차');
  const icom=document.createElement('div');icom.className='icom';icom.style.cssText='top:345px;height:600px;left:230px;right:230px;transform-origin:50% 0';
  icom.innerHTML='<div class="scr"><div class="live">● 띵동</div><div class="bub">안녕하세요!! 새로 이사 왔어요!!</div>'+
   '<div style="position:absolute;left:50%;top:220px;width:150px;height:150px;margin-left:-75px;border-radius:50%;background:#f3cfae"></div>'+
   '<div style="position:absolute;left:50%;top:205px;width:166px;height:90px;margin-left:-83px;border-radius:83px 83px 20px 20px;background:#e0a040"></div>'+
   '<div style="position:absolute;left:50%;top:290px;width:16px;height:22px;margin-left:-40px;background:#1a1a1a;border-radius:4px"></div><div style="position:absolute;left:50%;top:290px;width:16px;height:22px;margin-left:24px;background:#1a1a1a;border-radius:4px"></div>'+
   '<div style="position:absolute;left:50%;top:380px;width:260px;height:200px;margin-left:-130px;border-radius:70px 70px 0 0;background:#ffb84d"></div>'+
   '<div style="position:absolute;left:50%;top:440px;width:150px;height:70px;margin-left:-75px;border-radius:12px;background:#fff;border:6px solid #ff8fc8;box-sizing:border-box"></div></div><div class="lbl">현관 · 새 이웃</div>';
  ui.appendChild(icom);
  const ph=document.createElement('div');ph.className='phone';ph.style.cssText='top:360px;height:760px';
  ph.innerHTML='<div class="screen"><div class="sbar"><span>2:14</span><span>▮▮▮ 40%</span></div><div class="head">새 이웃</div><div class="msgs"><div class="row me"><div class="b" style="font-size:44px">떡 감사해요 ♥<br>다음엔 문 앞에 두고<br>문자 주세요!</div></div></div></div>';
  ui.appendChild(ph);const msg=ph.querySelector('.row');
  const st=statChip('이사 7일 차 · <b>ISFP 동화율 100%</b>');
  const end=document.createElement('div');end.innerHTML='<div class="end1 out">다음엔 누가<br>이사 올까요?</div><div class="end2 out">팔로우하고 기다려 주세요</div>';ui.appendChild(end);
  const e1=end.children[0],e2=end.children[1];
  const n6=lineT(6,'n6'),ENDT=n6.t1+0.25;
  return t=>{
    chipPop(ch,t,0);
    const off=ease((t-2.2)/0.12);
    hemi.intensity=1.6-1.15*off;dl.intensity=1.2*(1-off*0.85);lg.visible=off<0.5;win.material.color.set(off>0.5?0x2a3050:0x9fc8f0);
    bgEl.style.background=off>0.5?'#1a1830':'#ffe6f0';
    // 이불: 가슴까지 → 머리끝까지 덮기
    const bk=ease((t-2.25)/0.4);const back=-0.5-1.3*bk;blanket.scale.z=1.14-back;blanket.position.set(0.6,0.86,(1.14+back)/2);lump.visible=bk>0.6;lump.scale.set(1,0.75*clamp01((bk-0.6)/0.4),1.1);
    E.userData.head.rotation.y=t>0.3&&t<2.2?-0.6*ease((t-0.3)/0.3):0;
    const ik=t<0.55?0:pop((t-0.55)/0.3)*(1-ease((t-2.0)/0.2));icom.style.transform=`scale(${ik})`;icom.style.display=ik<0.01?'none':'';
    const pk=t<3.2?0:pop((t-3.2)/0.3)*(1-ease((t-6.0)/0.25));ph.style.transform=`scale(${pk})`;ph.style.display=pk<0.01?'none':'';
    msg.style.display=t<3.6?'none':'';msg.style.transform=`scale(${pop((t-3.6)/0.25)})`;msg.style.transformOrigin='right bottom';
    popEl(st,t,6.1);if(t>ENDT)st.style.opacity=0;
    cam.position.set(2.2-t*0.03,2.7,2.3-t*0.05);cam.lookAt(0.5,0.75,-1.1);
    const ek=t-ENDT;e1.style.opacity=clamp01(ek/0.15);e1.style.transform=`scale(${pop(ek/0.4)})`;e2.style.opacity=clamp01((ek-0.4)/0.15);e2.style.transform=`scale(${pop((ek-0.4)/0.35)})`;
    if(t>ENDT){hemi.intensity=0.35;}
    caption(6,t,ENDT);renderer.render(scene,cam);
  };
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
