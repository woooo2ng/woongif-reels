// ---------- 궁합편 공용 (한 커플: ENTP 남 · INFP 여) ----------
const S=[];
function mkF(){ // INFP 여자: 라벤더 옷, 긴 생머리
  const p=makePerson(rng(31),{shirt:0xc9a8ff,pants:0x55506a});const u=p.userData,h=u.head;
  const m=lamb(0x4a2e22);h.children[1].visible=false;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.272,16,12,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.42;h.add(cap);
  const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,14,8),m);bang.scale.set(1.15,0.36,0.62);bang.position.set(-0.03,0.43,0.12);bang.rotation.z=-0.2;h.add(bang);
  const cg=(r,l)=>new THREE.CapsuleGeometry(r,l,4,10);
  const back=new THREE.Mesh(cg(0.2,0.55),m);back.scale.set(1.3,1,0.55);back.position.set(0,-0.02,-0.13);h.add(back);
  for(const sx of[-1,1]){const sd=new THREE.Mesh(cg(0.07,0.46),m);sd.position.set(sx*0.225,0.04,0.05);h.add(sd)}
  const pin=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.02,6,10),lamb(0xb48cff));pin.position.set(0.17,0.42,0.17);h.add(pin);
  for(const sx of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.018,0.02),lamb(0x1a1a1a));l.position.set(sx*0.09,0.29,0.236);h.add(l);
    const t=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.018,0.02),lamb(0x1a1a1a));t.position.set(sx*0.13,0.297,0.226);t.rotation.z=sx*0.7;h.add(t)}
  const lip=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.022,0.01),basic(0xe8607a));lip.position.set(0,0.14,0.245);h.add(lip);
  u.hip.children[0].scale.x=0.9;const skin=u.arms[0].children[1].material;u.legs.forEach(l=>{l.children[0].material=skin});
  const skirt=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.36,0.36,12),lamb(0xdccbff));skirt.position.y=-0.14;u.hip.add(skirt);
  return p}
function mkT(){ // ENTP 남자: 주황 후드, 삐죽 머리
  const p=makePerson(rng(42),{shirt:0xffb84d,pants:0x2f3b4a});const h=p.userData.head;
  h.children[1].material=lamb(0x2a2220);
  for(let i=0;i<4;i++){const s=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.16,5),lamb(0x2a2220));s.position.set(-0.12+i*0.08,0.5,0.06);s.rotation.z=(i-1.5)*-0.35;s.rotation.x=0.3;h.add(s)}
  const hood=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.12,0.2),lamb(0xf5a742));hood.position.set(0,0.62,-0.17);p.userData.hip.add(hood);
  return p}
function holdObj(p,side,obj,y=-0.62,z=0.12){obj.position.set(0,y,z);p.userData.arms[side].add(obj);return obj}
function phoneMesh(){return new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a))}
function giftBox(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.32,0.38),lamb(0x9a7bea));g.add(b);
  const lid=new THREE.Group();lid.position.set(0,0.16,-0.19);g.add(lid);
  const lm=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.07,0.42),lamb(0xb79cff));lm.position.set(0,0.035,0.19);lid.add(lm);
  const rb=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.08,0.43),lamb(0xffd84d));rb.position.set(0,0.04,0.19);lid.add(rb);
  for(const s of[-1,1]){const bw=new THREE.Mesh(new THREE.TetrahedronGeometry(0.09,0),lamb(0xffd84d));bw.position.set(s*0.08,0.12,0.19);lid.add(bw)}
  g.userData.lid=lid;return g}
function shoe(col=0xffffff,acc=0xff6a3d){const g=new THREE.Group();
  const sole=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.07,0.2),lamb(0xf2f2f2));g.add(sole);
  const up=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.14,0.18),lamb(col));up.position.set(-0.04,0.1,0);g.add(up);
  const toe=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),lamb(col));toe.scale.set(1.2,0.7,0.95);toe.position.set(0.17,0.07,0);g.add(toe);
  const sw=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.05,0.185),lamb(acc));sw.position.set(0,0.09,0);sw.rotation.z=0.3;g.add(sw);
  const col2=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.18,0.18),lamb(col));col2.position.set(-0.18,0.15,0);g.add(col2);
  return g}
function cloudSprite(text,tint,size,fg='#4a2f86'){
  const fs=60;const c=document.createElement('canvas'),ctx=c.getContext('2d');ctx.font=`900 ${fs}px ${FONT}`;
  const tw=ctx.measureText(text).width;const w=Math.max(280,tw+130),h=210;c.width=w+20;c.height=h+20;ctx.translate(10,10);
  const puffs=[[0.15,0.6,0.34],[0.32,0.38,0.4],[0.5,0.34,0.42],[0.68,0.36,0.42],[0.86,0.58,0.34],[0.5,0.66,0.38],[0.28,0.7,0.3],[0.72,0.72,0.3]];
  ctx.fillStyle='rgba(60,40,100,0.18)';for(const[a,b,r2]of puffs){ctx.beginPath();ctx.arc(a*w,b*h+6,r2*h,0,7);ctx.fill()}
  ctx.fillStyle=tint;for(const[a,b,r2]of puffs){ctx.beginPath();ctx.arc(a*w,b*h,r2*h,0,7);ctx.fill()}
  ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${fs}px ${FONT}`;ctx.fillText(text,w/2,h*0.55);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.center.set(0.5,0);s.scale.set(c.width*size,c.height*size,1);s.userData.base=[c.width*size,c.height*size];return s}
function heartHalf(side){ // 금 가는 하트 반쪽(side -1 왼쪽, 1 오른쪽)
  const t=canvasTex(220,200,(x,w,h)=>{x.save();x.beginPath();
    const zz=[[110,40],[96,72],[122,100],[100,130],[118,160],[110,190]];
    if(side<0){x.moveTo(0,0);for(const p of zz)x.lineTo(p[0],p[1]);x.lineTo(0,200)}else{x.moveTo(220,0);for(const p of zz)x.lineTo(p[0],p[1]);x.lineTo(220,200)}
    x.closePath();x.clip();x.fillStyle='#ff6f91';x.beginPath();x.moveTo(110,190);x.bezierCurveTo(-30,100,20,-10,110,45);x.bezierCurveTo(200,-10,250,100,110,190);x.fill();
    x.strokeStyle='rgba(120,20,50,.5)';x.lineWidth=6;x.stroke();x.restore()});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(0.55,0.5,1);return s}
function signPlane(text,w,h,o={}){const t=canvasTex(Math.round(w*400),Math.round(h*400),(x,cw,ch)=>{x.fillStyle=o.bg||'#fff';rr(x,0,0,cw,ch,o.r??30);x.fill();x.strokeStyle=o.line||'rgba(0,0,0,.15)';x.lineWidth=10;x.stroke();
  x.fillStyle=o.fg||'#333';x.font=`900 ${o.fs||Math.round(ch*0.42)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,cw/2,ch/2+4)});
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide}))}
function drop(){const d=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),new THREE.MeshBasicMaterial({color:0x8fd3ff}));d.scale.set(0.8,1.3,0.8);return d}
function kneel(p){const u=p.userData;u.hip.position.y=0.5;u.legs[0].rotation.x=-1.45;u.legs[1].rotation.x=0.95}
function room(scene,o={}){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(o.floor||0xd8b48a));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(20,7,0.2),lamb(o.wall||0xfbe9d6));wall.position.set(0,3.5,o.wz??-1.6);scene.add(wall);return wall}
function bed(scene,x,z,col=0xb9a6ff,w=1.6){const g=new THREE.Group();const fr=new THREE.Mesh(new THREE.BoxGeometry(w,0.4,2.2),lamb(0x9a7a5a));fr.position.y=0.2;g.add(fr);
  const mat=new THREE.Mesh(new THREE.BoxGeometry(w-0.06,0.18,2.1),lamb(0xf6f2ff));mat.position.y=0.49;g.add(mat);
  const bl=new THREE.Mesh(new THREE.BoxGeometry(w-0.02,0.12,1.3),lamb(col));bl.position.set(0,0.6,0.42);g.add(bl);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(w*0.5,0.14,0.42),lamb(0xffffff));pil.position.set(0,0.65,-0.78);g.add(pil);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(w,0.9,0.12),lamb(0x8a6a4a));hb.position.set(0,0.65,-1.1);g.add(hb);
  g.position.set(x,0,z);scene.add(g);return g}
function titleUI(tagTxt){
  ui.innerHTML=`<div class="tag">${tagTxt}</div><div class="title1 out" style="font-size:132px;top:330px;letter-spacing:-4px"><span style="color:${C_T}">ENTP</span><span style="font-size:90px">♂</span>×<span style="color:${C_F}">INFP</span><span style="font-size:90px">♀</span></div><div class="title2 out" style="font-size:150px;top:500px;color:#fff">커플이라면?</div>`;
  return [ui.querySelector('.tag'),ui.querySelector('.title1'),ui.querySelector('.title2')]}
const bT=(txt,o={})=>makeBubble(txt,{...TB,fs:o.fs||64,size:o.size||0.0042});
const bF=(txt,o={})=>makeBubble(txt,{...FB,fs:o.fs||64,size:o.size||0.0042});

// ---------- S0: 카페 — "나 바퀴벌레 되면?" → 역질문 20개 → "키워야지." ----------
S[0]=()=>{
  bgEl.style.background='linear-gradient(#ffd9b0,#ffeedd 55%,#fff6ec)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.7,dir:1.2,dpos:[4,9,9]});
  const r=rng(1001);
  room(scene,{floor:0xc89c74,wall:0xf6e3cc,wz:-2.2});
  const win=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6),basic(0xbfe3ff));win.position.set(0,2.6,-2.08);scene.add(win);
  for(const x of[-2.1,0,2.1]){const f=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.7,0.08),lamb(0xffffff));f.position.set(x,2.6,-2.04);scene.add(f)}
  for(const y of[1.3,3.9]){const f=new THREE.Mesh(new THREE.BoxGeometry(4.3,0.1,0.08),lamb(0xffffff));f.position.set(0,y,-2.04);scene.add(f)}
  for(let i=0;i<5;i++){const b=makeBuilding(r,1.2,2+r()*1.5,0.5,{lit:0.2});b.position.set(-1.8+i*0.9,1.3,-2.5);b.scale.setScalar(0.6);scene.add(b)}
  const tb=new THREE.Group();const top=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.62,0.06,20),lamb(0xffffff));top.position.y=0.92;tb.add(top);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.9,8),lamb(0x555560));leg.position.y=0.45;tb.add(leg);tb.position.set(0,0,0.15);scene.add(tb);
  for(const x of[-0.2,0.22]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.065,0.18,10),lamb(x<0?0xc9a8ff:0xffb84d));c.position.set(x,1.04,0.25);scene.add(c)}
  for(const s of[-1,1]){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.08,0.5),lamb(0xa06c3e));ch.position.set(s*0.95,0.5,0.15);scene.add(ch);
    const bk=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.6,0.5),lamb(0x8a5a32));bk.position.set(s*1.2,0.8,0.15);scene.add(bk)}
  const F=mkF();F.position.set(-0.95,0,0.15);F.rotation.y=Math.PI/2-0.35;sitPose(F);scene.add(F);
  const T=mkT();T.position.set(0.95,0,0.15);T.rotation.y=-Math.PI/2+0.35;sitPose(T);scene.add(T);
  const fq=bF('나 바퀴벌레 되면 어떡할 거야?',{fs:54,size:0.0034});fq.position.set(0.0,1.75,0.4);scene.add(fq);
  const fd=bF('…?',{fs:70,size:0.0042});fd.position.set(-0.6,1.85,0.3);scene.add(fd);
  const QS=['언제부터?','말은 돼?','나만 알아?','크기는?','날 수 있어?','다시 돌아와?','밥은 뭐 먹어?','몇 마리야?'];
  const QP=[[0.3,1.9],[1.05,1.98],[0.25,2.16],[1.0,2.25],[0.3,2.43],[1.05,2.52],[0.25,2.7],[1.0,2.79]];
  const qb=QS.map((q,i)=>{const b=bT(q,{fs:58,size:0.0028});b.position.set(QP[i][0],QP[i][1],0.4);scene.add(b);return b});
  const ans=bT('키워야지.',{fs:84,size:0.0046});ans.position.set(0.3,2.0,0.45);scene.add(ans);
  const hs=sprinkleHearts(scene,7,r,{x:-0.95,w:1.0,z:0.3,size:0.0032});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const [tag,t1,t2]=titleUI('#010 궁합편');
  const ch=chip('',230);ch.style.fontSize='50px';
  const QT0=capAt(0,2)+0.15,QT1=capAt(0,4)-0.2,CK0=capAt(0,4)+0.2,ANS=capAt(0,5)+0.05;
  let checked=-1;
  return t=>{
    const fo=1-clamp01((t-capAt(0,2)+0.2)/0.4);
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.25)})`;tag.style.opacity=fo;
    t1.style.transform=`scale(${pop((t-0.05)/0.3)})`;t1.style.opacity=Math.min(clamp01((t-0.05)/0.08),fo);
    t2.style.transform=`scale(${pop((t-0.25)/0.35)})`;t2.style.opacity=Math.min(clamp01((t-0.25)/0.08),fo);
    scaleBubble(fq,pop((t-capAt(0,1)+0.05)/0.25)*(1-ease((t-QT0-0.3)/0.3)));
    scaleBubble(fd,pop((t-QT0-1.8)/0.25)*(1-ease((t-ANS+0.1)/0.25)));
    const step=(QT1-QT0)/QS.length;
    let ck=Math.floor((t-CK0)/((ANS-0.4-CK0)/QS.length));
    if(ck!==checked&&ck>=0&&ck<=QS.length){checked=ck;qb.forEach((b,i)=>{if(i<ck)setBubble(b,'✔ '+QS[i],{bg:'#d8f7d8',fg:'#22713a',fs:58,size:0.0028})})}
    qb.forEach((b,i)=>{const k=pop((t-QT0-i*step)/0.22);const out=1-ease((t-CK0-(i+0.6)*((ANS-0.4-CK0)/QS.length))/0.25);scaleBubble(b,k*out*(1+0.05*Math.sin(t*9+i)))});
    const n=Math.min(20,Math.max(0,Math.round((t-QT0)/(QT1-QT0)*20)));
    if(t<QT0){ch.style.opacity=0}else{ch.textContent=t<CK0?`역질문 ${n}개`:t<ANS?'조건 검토 중…':'조건 검토 완료 ✔';chipPop(ch,t,QT0)}
    scaleBubble(ans,pop((t-ANS)/0.3));
    updHearts(hs,t,ANS+0.35,1.8,1.6);
    const tu=T.userData;tu.head.rotation.z=t>QT0&&t<ANS?Math.sin(t*3)*0.12:0;tu.arms[1].rotation.x=t>QT0&&t<CK0?-1.6+Math.sin(t*8)*0.25:-0.9;
    tu.arms[0].rotation.x=t>ANS?-1.5:-0.9;
    F.userData.head.rotation.z=t>QT0+1.8&&t<ANS?0.18:0;
    const z=6.3-t*0.06;cam.position.set(0.2,2.1,z);cam.lookAt(0.2,1.45,0);
    caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- S1: 프사 47장 → "다 똑같은데?" → 기본 사진 → ENTP 땀 ----------
S[1]=()=>{
  const r=rng(1101);
  // B: 방 (보여 주기)
  const sB=new THREE.Scene();addLights(sB,{hemi:1.7,dir:1.2,dpos:[4,9,9]});room(sB,{floor:0xe0c49e,wall:0xeee6ff});
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.08,0.3),lamb(0xffffff));shelf.position.set(-1.6,2.6,-1.45);sB.add(shelf);
  for(let i=0;i<3;i++){const pl=new THREE.Mesh(new THREE.IcosahedronGeometry(0.16,0),lamb(0x7cbf74));pl.position.set(-2.0+i*0.4,2.8,-1.45);sB.add(pl)}
  const Fb=mkF();Fb.position.set(-0.55,0,0.2);Fb.rotation.y=0.55;sB.add(Fb);
  const Tb=mkT();Tb.position.set(0.6,0,0.2);Tb.rotation.y=-0.5;sB.add(Tb);
  const ph=holdObj(Fb,1,phoneMesh(),-0.62,0.1);
  const fb=bF('이거 어때?',{fs:66});fb.position.set(-0.6,2.15,0.2);sB.add(fb);
  const tb=bT('다 똑같은데?',{fs:66});tb.position.set(0.65,2.2,0.2);sB.add(tb);
  const hl=heartHalf(-1),hr=heartHalf(1);sB.add(hl);sB.add(hr);
  const camB=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  // D: ENTP 방 (밤)
  const sD=new THREE.Scene();addLights(sD,{sky:0x9aa8ff,ground:0x303050,hemi:1.0,dir:0.7,sun:0xffe0b0,dpos:[-3,6,6]});room(sD,{floor:0x5a5470,wall:0x3f4370});
  bed(sD,0,-0.4,0xffb84d,1.8);
  const lamp=glowSprite('rgba(255,210,140,1)',2.2);lamp.position.set(-1.4,1.6,-0.9);sD.add(lamp);
  const lb=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.2,0.3,10),lamb(0xffe2a8));lb.position.set(-1.4,1.25,-0.9);sD.add(lb);
  const ls=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.9,0.5),lamb(0x8a6a4a));ls.position.set(-1.4,0.45,-0.9);sD.add(ls);
  const Td=mkT();Td.position.set(0,0.1,0.15);sitPose(Td);sD.add(Td);
  const phD=holdObj(Td,1,phoneMesh(),-0.62,0.12);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.4),new THREE.MeshBasicMaterial({map:canvasTex(500,700,(x,w,h)=>{x.fillStyle='#fff';rr(x,0,0,w,h,40);x.fill();
    x.fillStyle='#d6d9e0';x.beginPath();x.arc(w/2,250,150,0,7);x.fill();x.fillStyle='#b4b9c4';x.beginPath();x.arc(w/2,215,58,0,7);x.fill();x.beginPath();x.arc(w/2,350,100,Math.PI,0);x.fill();
    x.fillStyle='#222';x.font=`900 56px ${FONT}`;x.textAlign='center';x.fillText('INFP ♡',w/2,480);x.fillStyle='#999';x.font=`700 34px ${FONT}`;x.fillText('프로필 사진 없음',w/2,545)}),transparent:true}));
  scr.position.set(-0.55,2.45,0.6);sD.add(scr);
  const dr=drop();sD.add(dr);
  const cl=cloudSprite('…내가 그랬나','#ffffff',0.0032,'#6a4300');cl.position.set(0.6,2.0,0.3);sD.add(cl);
  const camD=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  // DOM
  const A0=0,B0=capAt(1,2)-0.15,C0=capAt(1,4)-0.1,D0=capAt(1,5)-0.15;
  const tiles=Array.from({length:47},(_,i)=>{const bgs=['#ffe6f0','#e8f0ff','#fff4d6','#e9ffe8','#f1e8ff','#ffeede'];return `<div class="pt" style="background:${bgs[i%6]};display:none"><div class="bd"></div><div class="hr"></div><div class="hd"></div><div class="hr" style="top:22px;height:30px"></div><div class="ck">${i+1}</div></div>`}).join('');
  const domA=document.createElement('div');domA.innerHTML=`<div class="phone"><div class="screen" style="background:#f4f1ff"><div class="sbar"><span>2:14</span><span>▮▮▮ 100%</span></div><div class="head">프사 후보 <span id="pc" style="margin-left:14px;color:#8a63e8">0장</span></div><div class="pgrid">${tiles}</div></div></div>`;ui.appendChild(domA);
  const pts=[...domA.querySelectorAll('.pt')],pc=domA.querySelector('#pc'),grid=domA.querySelector('.pgrid');
  const domC=document.createElement('div');domC.innerHTML=`<div class="phone"><div class="screen" style="background:#fff"><div class="sbar"><span>11:48</span><span>▮▮▮ 42%</span></div><div class="head">‹ 프로필 편집</div>
    <div class="prof"><div class="av" id="av1" style="background:#f1e8ff"><div style="position:absolute;left:105px;top:60px;width:130px;height:130px;border-radius:50%;background:#f3cfae"></div><div style="position:absolute;left:95px;top:40px;width:150px;height:90px;border-radius:75px 75px 20px 20px;background:#4a2e22"></div><div style="position:absolute;left:70px;top:200px;width:200px;height:170px;border-radius:90px 90px 0 0;background:#c9a8ff"></div></div>
    <div class="av" id="av2" style="background:#d6d9e0;position:absolute;left:50%;top:0;margin-left:-170px;opacity:0"><div style="position:absolute;left:115px;top:70px;width:110px;height:110px;border-radius:50%;background:#b4b9c4"></div><div style="position:absolute;left:70px;top:200px;width:200px;height:170px;border-radius:100px 100px 0 0;background:#b4b9c4"></div></div>
    <div class="nm">INFP</div><div class="st" id="st">상태메시지 없음</div></div>
    <div class="btn" style="top:690px;background:#ffe3e8;color:#e2335a">프로필 사진 삭제</div><div class="tap" id="tap" style="left:300px;top:700px;opacity:0"></div></div></div>`;ui.appendChild(domC);
  const av1=domC.querySelector('#av1'),av2=domC.querySelector('#av2'),tap=domC.querySelector('#tap');
  const ch=chip('',190);ch.style.fontSize='50px';
  return t=>{
    const inA=t<B0,inB=t>=B0&&t<C0,inC=t>=C0&&t<D0,inD=t>=D0;
    domA.style.display=inA?'':'none';domC.style.display=inC?'':'none';
    if(inA){bgEl.style.background='linear-gradient(#e9e0ff,#fff1f6)';
      const n=Math.min(47,Math.round(47*ease((t-0.25)/4.6)));pts.forEach((p,i)=>{p.style.display=i<n?'':'none';if(i===n-1){p.style.transform=`scale(${pop(((t*10)%1))})`}else p.style.transform=''});
      pc.textContent=`${n}장`;const rows=Math.ceil(n/4);grid.style.transform=`translateY(${-Math.max(0,rows-4)*160}px)`;
      const day=Math.min(3,1+Math.floor(t/1.7));ch.textContent=`프사 고민 ${day}일째`;ch.style.top='190px';chipPop(ch,t,0.1);renderer.clear()}
    else if(inB){bgEl.style.background='linear-gradient(#e8deff,#fff0f6 60%,#fff8ee)';const lt=t-B0;
      ch.textContent=t<capAt(1,3)+1.0?'후보 47장 중 고르는 중':'고민 3일 → 한마디 1초';chipPop(ch,lt,0.05);
      armUp(Fb,1,0.62);Fb.userData.arms[1].rotation.z=0.1;ph.rotation.x=0.4;
      scaleBubble(fb,pop((lt-0.1)/0.22)*(1-ease((t-capAt(1,3)+0.05)/0.2)));
      scaleBubble(tb,pop((t-capAt(1,3)-0.05)/0.22));
      Tb.userData.head.rotation.y=-0.2;Tb.userData.arms[0].rotation.x=t>capAt(1,3)?-0.3:0;
      const ck=t-capAt(1,3)-0.8;const sp=ease(ck/0.35)*0.22;
      hl.position.set(-0.62-sp,2.35-ease(ck/0.6)*0.15,0.3);hr.position.set(-0.62+sp,2.35-ease(ck/0.6)*0.25,0.3);hr.material.rotation=-sp*1.2;hl.material.rotation=sp*1.2;
      const hk=pop((t-capAt(1,3)-0.5)/0.25);hl.scale.set(0.55*hk,0.5*hk,1);hr.scale.set(0.55*hk,0.5*hk,1);
      Fb.userData.head.rotation.x=ck>0?ease(ck/0.4)*0.3:0;
      camB.position.set(0.05,2.1,6.4-lt*0.12);camB.lookAt(0.05,1.95,0);caption(1,t);renderer.render(sB,camB)}
    else if(inC){bgEl.style.background='linear-gradient(#1c2046,#3a3170)';const lt=t-C0;
      ch.textContent='그날 밤 PM 11:48';chipPop(ch,lt,0.05);
      const tk=lt-0.9;tap.style.opacity=tk>0&&tk<0.6?1-tk/0.6:0;tap.style.transform=`scale(${0.6+ease(tk/0.4)*0.6})`;
      const sw=ease((lt-1.3)/0.35);av1.style.opacity=1-sw;av2.style.opacity=sw;av2.style.transform=`scale(${0.9+0.1*pop((lt-1.3)/0.3)})`;
      renderer.clear()}
    else{bgEl.style.background='linear-gradient(#1a1d40,#2c2d5e 60%,#403c78)';const lt=t-D0;
      ch.textContent=`다음 날 · ENTP 미안함 ${Math.round(100*ease((lt-0.6)/1.8))}%`;chipPop(ch,lt,0.05);
      const k=pop((lt-0.1)/0.3);scr.scale.set(k,k,1);
      Td.userData.arms[1].rotation.x=-1.5;phD.rotation.x=0.6;Td.userData.head.rotation.x=0.25;Td.userData.head.rotation.y=-0.35+ease((lt-1.2)/0.4)*0.25;
      dr.visible=lt>1.0;dr.position.set(0.28,1.62-((lt-1.0)*0.35)%0.5,0.42);
      const ck2=pop((lt-1.5)/0.3);cl.scale.set(cl.userData.base[0]*ck2,cl.userData.base[1]*ck2,1);cl.visible=ck2>0.01;
      camD.position.set(-0.05,2.0,6.0-lt*0.25);camD.lookAt(-0.1,1.9,0);caption(1,t);renderer.render(sD,camD)}
    if(!inB&&!inD)caption(1,t);
  };
};

// ---------- S2: 길거리 — "너 삐졌지?" ×5 → 회색 '…' → 사과 퍼포먼스 ----------
S[2]=()=>{
  bgEl.style.background='linear-gradient(#9fd2ff,#d6edff 55%,#f2f9ff)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdcefff,14,40);addLights(scene,{hemi:1.7,dir:1.3});
  const r=rng(1201);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0xd8d2c6));g.rotation.x=-Math.PI/2;scene.add(g);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(80,5),lamb(0x6a6e78));road.rotation.x=-Math.PI/2;road.position.set(0,0.01,4.6);scene.add(road);
  const SHOP=[0xffc9d6,0xc9e6ff,0xfff0b8,0xd6f5d0,0xe6d6ff,0xffdcb8];
  for(let i=0;i<8;i++){const w=2.2;const b=new THREE.Mesh(new THREE.BoxGeometry(w,3.4+r()*1.5,1.2),lamb(SHOP[i%6]));b.position.set(-8+i*2.3,b.geometry.parameters.height/2,-2.4);scene.add(b);
    const aw=new THREE.Mesh(new THREE.BoxGeometry(w*0.9,0.12,0.6),lamb(i%2?0xff7a8a:0x7ab8ff));aw.position.set(b.position.x,2.3,-1.6);aw.rotation.x=0.3;scene.add(aw);
    const gl=new THREE.Mesh(new THREE.PlaneGeometry(w*0.7,1.4),basic(0xfff8e6));gl.position.set(b.position.x,1.0,-1.79);scene.add(gl)}
  const T=mkT();T.position.set(0.55,0,0.4);T.rotation.y=-0.7;scene.add(T);
  const F=mkF();F.position.set(-0.55,0,0.4);F.rotation.y=0.7;scene.add(F);
  const tb=bT('너 삐졌지?',{fs:64});tb.position.set(0.75,2.25,0.4);scene.add(tb);
  const fb=bF('아니',{fs:64});fb.position.set(-0.75,2.25,0.4);scene.add(fb);
  // 사과 퍼포먼스 소품
  const sign=signPlane('미안해 ㅠㅠ',1.3,0.65,{bg:'#fff',fg:'#e2335a',line:'#ffb84d'});scene.add(sign);
  const stick=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.9,0.05),lamb(0xa07a4a));scene.add(stick);
  const bal=[];for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.24,12,10),lamb([0xff7aa8,0xffd84d,0x9fd2ff][i]));const s=new THREE.Mesh(new THREE.BoxGeometry(0.012,1.0,0.012),basic(0x666666));scene.add(b);scene.add(s);bal.push([b,s])}
  const bq=new THREE.Group();const cone=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.45,8),lamb(0xfff0f5));cone.rotation.x=Math.PI;bq.add(cone);
  for(let i=0;i<5;i++){const fl=new THREE.Mesh(new THREE.IcosahedronGeometry(0.08,0),lamb([0xff5a7a,0xff9ab8,0xffd84d][i%3]));fl.position.set((i-2)*0.06,0.28+Math.abs(i-2)*-0.02,0);bq.add(fl)}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('',220);ch.style.fontSize='54px';
  const GRAY=capAt(2,1)+0.1,CUT=capAt(2,2)-0.05;
  let ls='';
  return t=>{
    const k=Math.floor((t-0.15)/0.55);
    const pre=t<CUT;
    if(pre){
      const tTurn=k%2===0;const tx=tTurn?'너 삐졌지?':'너 삐졌지??';setBubble(tb,tx+(k>3?'?':''),{...TB,fs:64,size:0.0042});
      scaleBubble(tb,t>0.15?(0.95+0.08*Math.sin(t*12)):0);
      if(t<GRAY){if(ls!=='a'){setBubble(fb,'아니',{...FB,fs:64,size:0.0042});ls='a'}scaleBubble(fb,k>=0&&(t-0.15)%0.55>0.27?pop(((t-0.15)%0.55-0.27)/0.15):0)}
      else{if(ls!=='g'){setBubble(fb,'…',{bg:'#d5d5dc',fg:'#6a6a75',fs:80,size:0.0048});ls='g'}scaleBubble(fb,pop((t-GRAY)/0.25))}
      const pct=Math.min(100,96+Math.max(0,k));ch.textContent=t<GRAY?`삐짐 확률 ${pct}%`:'삐짐 확률 100% · 선 넘음';chipPop(ch,t,0.1);
      F.rotation.y=t<GRAY?0.7:0.7-ease((t-GRAY)/0.4)*1.9;F.userData.arms.forEach(a=>{a.rotation.z=t>GRAY?(a===F.userData.arms[0]?0.6:-0.6):0;a.rotation.x=t>GRAY?-0.6:0});
      T.userData.head.rotation.z=Math.sin(t*6)*0.1;T.userData.arms[1].rotation.x=-0.6+Math.sin(t*10)*0.3;
      standPose(T);T.position.set(0.55,0,0.4);
      sign.visible=stick.visible=bq.visible=false;bal.forEach(b=>{b[0].visible=b[1].visible=false});
      cam.position.set(0,2.0,6.6-t*0.15);cam.lookAt(0,1.8,0);
    }else{
      const lt=t-CUT;
      scaleBubble(tb,0);
      if(ls!=='g2'){setBubble(fb,'…흥',{bg:'#e8e0f7',fg:'#6a5a90',fs:70,size:0.0044});ls='g2'}fb.position.set(-0.62,2.1,0.4);scaleBubble(fb,pop((lt-1.2)/0.22));
      F.rotation.y=0.4;F.userData.arms.forEach(a=>{a.rotation.x=-0.6});F.userData.arms[0].rotation.z=0.6;F.userData.arms[1].rotation.z=-0.6;
      T.rotation.y=-0.55;kneel(T);T.position.set(0.6,0,0.6);
      const tu=T.userData;tu.arms[0].rotation.x=-2.2;tu.arms[1].rotation.x=-1.2;
      const sk=pop((lt)/0.3);sign.visible=stick.visible=true;sign.position.set(0.45,2.55,0.95);sign.scale.setScalar(sk);sign.rotation.y=-0.3;stick.position.set(0.5,1.85,0.95);
      bal.forEach((b,i)=>{b[0].visible=b[1].visible=true;const bob=Math.sin(lt*3+i)*0.05;b[0].position.set(0.75+i*0.3,2.2+i*0.18+bob,0.4);b[1].position.set(0.7+i*0.12,1.6+i*0.09,0.5);b[1].rotation.z=0.35-i*0.12;b[0].scale.setScalar(pop((lt-0.15-i*0.08)/0.25))});
      bq.visible=true;bq.position.set(1.0,0.85,0.95);bq.scale.setScalar(pop((lt-0.25)/0.25));
      ch.textContent='사과 퍼포먼스 출동';chipPop(ch,lt,0.05);
      cam.position.set(0.2,1.9,6.2-lt*0.15);cam.lookAt(0.2,1.75,0);
    }
    caption(2,t);renderer.render(scene,cam);
  };
};

// ---------- S3: 마침표 하나 → 소설 3단 → 운전 중 음성 입력 ----------
S[3]=()=>{
  const r=rng(1301);
  const sA=new THREE.Scene();addLights(sA,{sky:0xb8a8ff,ground:0x303050,hemi:1.1,dir:0.6,sun:0xffe0c0,dpos:[3,6,6]});room(sA,{floor:0x6a5f88,wall:0x4a4a86});
  bed(sA,0,-0.5,0xc9a8ff,1.8);
  const moonW=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.3),basic(0x2a3a7a));moonW.position.set(1.9,2.6,-1.48);sA.add(moonW);
  const mn=new THREE.Mesh(new THREE.CircleGeometry(0.22,20),basic(0xfff0b8));mn.position.set(2.1,2.8,-1.46);sA.add(mn);
  const F=mkF();F.position.set(0,0.1,0.1);sitPose(F);sA.add(F);const ph=holdObj(F,1,phoneMesh(),-0.62,0.12);
  const glow=glowSprite('rgba(200,220,255,1)',0.55);glow.position.set(0.12,0.95,0.55);sA.add(glow);
  const CL=[['권태기 온 건가…?','#ffffff'],['이별 통보…?','#e9e2ff'],['고양이 3마리랑 늙어 감','#ffe9f1']];
  const cls=CL.map((c,i)=>{const s=cloudSprite(c[0],c[1],0.0036);s.position.set([-0.45,0.45,-0.1][i],1.95+i*0.72,0.2);sA.add(s);return s});
  const cat=[];for(let i=0;i<3;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),lamb([0xffb84d,0x444450,0xffffff][i]));b.scale.set(1.2,0.9,1);g.add(b);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(0.11,10,8),b.material);hd.position.set(0.17,0.1,0);g.add(hd);for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.08,4),b.material);e.position.set(0.18,0.21,s*0.06);g.add(e)}
    g.position.set(-0.75+i*0.45,4.3,0.4);g.rotation.y=-0.4;g.visible=false;sA.add(g);cat.push(g)}
  const camA=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  // B: 운전 중
  const sB=new THREE.Scene();sB.fog=new THREE.Fog(0x2a2f5a,8,30);addLights(sB,{sky:0x9aa8ff,ground:0x202040,hemi:1.1,dir:0.7,sun:0xd0d8ff});
  const rd=new THREE.Mesh(new THREE.PlaneGeometry(10,200),lamb(0x3a3d50));rd.rotation.x=-Math.PI/2;sB.add(rd);
  const lines=[];for(let i=0;i<20;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.15,1.4),basic(0xfff3c0));l.rotation.x=-Math.PI/2;l.position.set(0,0.01,-i*4);sB.add(l);lines.push(l)}
  for(let i=0;i<12;i++){const lp=glowSprite('rgba(255,210,140,1)',1.2);lp.position.set(i%2?3.5:-3.5,3,-i*6);sB.add(lp)}
  const car=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.6,3.4),lamb(0xffb84d));body.position.y=0.55;car.add(body);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.6,1.7),new THREE.MeshLambertMaterial({color:0x9fd2ff,transparent:true,opacity:0.35}));cab.position.set(0,1.15,-0.2);car.add(cab);
  for(const x of[-0.85,0.85])for(const z of[-1.1,1.1]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.2,12),lamb(0x222228));wh.rotation.z=Math.PI/2;wh.position.set(x,0.3,z);car.add(wh)}
  const Td=mkT();sitPose(Td);Td.position.set(-0.4,0.3,-0.1);Td.rotation.y=Math.PI;Td.scale.setScalar(0.85);car.add(Td);
  const whl=new THREE.Mesh(new THREE.TorusGeometry(0.18,0.03,6,16),lamb(0x333333));whl.position.set(-0.4,1.05,-0.75);whl.rotation.x=0.4;car.add(whl);
  car.rotation.y=Math.PI;sB.add(car);
  const tb=bT('음성 입력: "알겠어."',{fs:60,size:0.0036});tb.position.set(0,2.35,0);sB.add(tb);
  const camB=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  // DOM 메시지
  const dom=document.createElement('div');dom.innerHTML=`<div class="bigmsg"><div class="who">ENTP ♡ · 오후 9:12</div><div class="b" style="padding-right:70px">알겠어<span class="dot">.<svg class="cir" viewBox="0 0 100 100" style="position:absolute;left:-26px;top:54px;width:84px;height:84px;overflow:visible"><ellipse cx="50" cy="52" rx="44" ry="40" fill="none" stroke="#e2335a" stroke-width="9" stroke-linecap="round" stroke-dasharray="270" stroke-dashoffset="270" transform="rotate(-100 50 50)"/></svg></span></div></div>`;ui.appendChild(dom);
  const msg=dom.querySelector('.bigmsg'),dot=dom.querySelector('.dot'),cir=dom.querySelector('.cir ellipse');
  const ch=chip('',1080);ch.style.fontSize='50px';
  const CUT=capAt(3,2)-0.05;
  return t=>{
    if(t<CUT){bgEl.style.background='linear-gradient(#1c2046,#34306a 60%,#4a3f80)';
      const mk=pop((t-0.05)/0.3);const out=ease((t-capAt(3,1)+0.3)/0.4);msg.style.opacity=1-out;msg.style.transform=`scale(${(0.8+0.2*mk)*(1-out*0.2)}) translateY(${-out*80}px)`;
      const dz=ease((t-0.8)/0.6);cir.setAttribute('stroke-dashoffset',String(270*(1-dz)));dot.style.transform='';
      const ns=[capAt(3,1),capAt(3,1)+1.15,capAt(3,1)+2.3];
      cls.forEach((c,i)=>{const k=pop((t-ns[i])/0.3);c.scale.set(c.userData.base[0]*k,c.userData.base[1]*k,1);c.visible=k>0.01});
      
      F.userData.arms[1].rotation.x=-1.5;ph.rotation.x=0.6;F.userData.head.rotation.x=0.2;F.userData.head.rotation.z=t>ns[0]?Math.sin(t*1.5)*0.08:0;
      const sc=t<ns[0]?0:Math.min(3,1+Math.floor((t-ns[0])/1.15));ch.textContent=t<ns[0]?'답장 해석 중…':`시나리오 #${sc} · ${sc*40}분 경과`;ch.style.top='230px';chipPop(ch,t,0.6);
      camA.position.set(0,2.1,7.0-t*0.08);camA.lookAt(0,2.05,0);
      dom.style.display='';caption(3,t);renderer.render(sA,camA)}
    else{const lt=t-CUT;dom.style.display='none';bgEl.style.background='linear-gradient(#141838,#283066 60%,#3c3e78)';
      lines.forEach((l,i)=>{l.position.z=((-i*4+lt*14)%80)-60+20});
      scaleBubble(tb,pop((lt-0.3)/0.25));
      Td.userData.arms.forEach(a=>{a.rotation.x=-1.3});
      ch.textContent='같은 시각 · 운전 중';ch.style.top='230px';chipPop(ch,lt,0.05);
      camB.position.set(1.6,2.8,4.6);camB.lookAt(0,1.4,0);
      caption(3,t);renderer.render(sB,camB)}
  };
};

// ---------- S4: 2구역 — 약속 쏟아지는 ENTP vs "괜찮아~ ㅎㅎ" 서운함 노트 ----------
S[4]=()=>{
  bgEl.style.background='linear-gradient(#ffe6c8,#f3e8ff)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.7,dir:1.1,dpos:[0,9,9]});
  const ZW=1.95,ZX=1.02;
  const fl1=new THREE.Mesh(new THREE.PlaneGeometry(ZW,14),lamb(0xc89c74));fl1.rotation.x=-Math.PI/2;fl1.position.set(-ZX,0,0);scene.add(fl1);
  const w1=new THREE.Mesh(new THREE.BoxGeometry(ZW,4.6,0.15),lamb(0xffd9a8));w1.position.set(-ZX,2.3,-1.6);scene.add(w1);
  const lantern=glowSprite('rgba(255,200,120,1)',2.0);lantern.position.set(-ZX,3.6,-1.2);scene.add(lantern);
  const tbl=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.08,0.7),lamb(0x8a5a32));tbl.position.set(-ZX,0.78,-0.55);scene.add(tbl);
  const fr=[];for(let i=0;i<2;i++){const p=makePerson(rng(77+i));p.position.set(-ZX-0.5+i*1.0,0,-1.0);p.rotation.y=i?-0.4:0.4;sitPose(p);scene.add(p);fr.push(p)}
  const T=mkT();T.position.set(-ZX,0,0.15);sitPose(T);scene.add(T);
  const mugs=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.18,8),lamb(0xffe08a));m.position.set(-ZX-0.4+i*0.4,0.9,-0.55);scene.add(m);mugs.push(m)}
  const div=new THREE.Mesh(new THREE.BoxGeometry(0.14,4.6,6),lamb(0xffffff));div.position.set(0,2.3,0);scene.add(div);
  const fl2=new THREE.Mesh(new THREE.PlaneGeometry(ZW,14),lamb(0x7a6f9a));fl2.rotation.x=-Math.PI/2;fl2.position.set(ZX,0,0);scene.add(fl2);
  const w2=new THREE.Mesh(new THREE.BoxGeometry(ZW,4.6,0.15),lamb(0x5a5490));w2.position.set(ZX,2.3,-1.6);scene.add(w2);
  const lmp=glowSprite('rgba(255,230,170,1)',1.5);lmp.position.set(ZX+0.6,1.6,-1.0);scene.add(lmp);
  const ls=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.9,0.5),lamb(0x8a6a4a));ls.position.set(ZX+0.6,0.45,-1.0);scene.add(ls);
  const chair=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.6),lamb(0xe8d8c0));chair.position.set(ZX,0.25,0.15);scene.add(chair);
  const F=mkF();F.position.set(ZX,0,0.15);sitPose(F);scene.add(F);
  const note=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.3,0.03),lamb(0xffb3c6));holdObj(F,0,note,-0.62,0.18);
  const nl=labelSprite('서운함 노트 15',{bg:'#ff8fb3',fg:'#fff',fs:58,size:0.0032});nl.position.set(ZX,2.45,0.2);scene.add(nl);
  const tags=['술자리','풋살','스터디','동아리','생일 파티'].map((s,i)=>{const l=labelSprite(s,{bg:['#ffd84d','#9fe6a0','#9fd2ff','#ffb3c6','#d9c6ff'][i],fg:'#333',fs:56,size:0.0032});l.position.set(-ZX+(i%2?0.35:-0.35),2.45+i*0.36,-0.2);scene.add(l);return l});
  const tm=bT('늦어 미안!',{fs:58,size:0.0034});tm.position.set(-ZX,1.95,0.35);scene.add(tm);
  const fm=bF('괜찮아~ ㅎㅎ',{fs:58,size:0.0034});fm.position.set(ZX,1.95,0.35);scene.add(fm);
  const ok=bT('오 괜찮대 ✔',{fs:58,size:0.0034});ok.position.set(-ZX,1.95,0.35);scene.add(ok);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML='';const L1=chip('ENTP',230),L2=chip('INFP',230);L1.style.left='270px';L2.style.left='810px';L1.style.background=C_T;L2.style.background=C_F;L1.style.fontSize=L2.style.fontSize='50px';
  let cnt=-1;
  return t=>{
    tags.forEach((l,i)=>{const k=pop((t-0.2-i*0.4)/0.22);l.scale.set(l.userData.base[0]*k,l.userData.base[1]*k,1)});
    mugs.forEach((m,i)=>{m.position.y=0.9+Math.max(0,Math.sin(t*5+i))*0.12});fr.forEach((p,i)=>{p.userData.arms[i].rotation.x=-1.6-Math.max(0,Math.sin(t*5+i))*0.6});
    scaleBubble(tm,pop((t-capAt(4,1)+0.2)/0.22)*(1-ease((t-capAt(4,3)+0.3)/0.2)));
    scaleBubble(fm,pop((t-capAt(4,1)+0.5)/0.22)*(1-ease((t-capAt(4,2)-0.1)/0.2)));
    const c=t<capAt(4,2)?15:Math.min(17,15+Math.floor((t-capAt(4,2))/1.1)+1);if(c!==cnt){cnt=c;const nm=labelSprite(`서운함 노트 ${c}`,{bg:'#ff8fb3',fg:'#fff',fs:58,size:0.0032});nl.material.map=nm.material.map;nl.userData.base=nm.userData.base}
    const nk=t<capAt(4,2)-0.1?0:pop((t-capAt(4,2)+0.1)/0.25)*(1+(t>capAt(4,2)&&((t-capAt(4,2))%1.1)<0.2?0.12:0));nl.scale.set(nl.userData.base[0]*nk,nl.userData.base[1]*nk,1);
    F.userData.arms[1].rotation.x=t>capAt(4,2)?-1.3+Math.sin(t*14)*0.12:-0.9;F.userData.arms[0].rotation.x=-1.1;F.userData.head.rotation.x=t>capAt(4,2)?0.25:0;
    scaleBubble(ok,pop((t-capAt(4,3))/0.22));
    T.userData.arms[1].rotation.x=t>capAt(4,3)?-2.9:-0.9;T.userData.arms[1].rotation.z=t>capAt(4,3)?0.2:0;
    chipPop(L1,t,0);chipPop(L2,t,0.1);
    cam.position.set(0,2.1,7.5);cam.lookAt(0,1.75,0);
    caption(4,t);renderer.render(scene,cam);
  };
};

// ---------- S5: 새벽 통화 → 상상 구름 위에 나라 건국 ----------
S[5]=()=>{
  bgEl.style.background='linear-gradient(#0e1230,#232a62 60%,#3a3a78)';
  const scene=new THREE.Scene();addLights(scene,{sky:0xa8b0ff,ground:0x202040,hemi:1.15,dir:0.7,sun:0xe0e4ff});
  const r=rng(1501);stars(scene,180,r,{y0:4,h:12,z:-6,w:16,size:0.06});
  // 2칸 방 단면
  for(const s of[-1,1]){const fl=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.2,2.6),lamb(s<0?0x7a6f9a:0x8a7a6a));fl.position.set(s*1.25,-0.1,0);scene.add(fl);
    const bw=new THREE.Mesh(new THREE.BoxGeometry(2.3,2.2,0.12),lamb(s<0?0x4a4a86:0x4a5878));bw.position.set(s*1.25,1.1,-1.3);scene.add(bw);
    const cl=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.12,2.6),lamb(0xe8e4f4));cl.position.set(s*1.25,2.2,0);scene.add(cl)}
  const mid=new THREE.Mesh(new THREE.BoxGeometry(0.16,2.3,2.6),lamb(0xe8e4f4));mid.position.set(0,1.05,0);scene.add(mid);
  bed(scene,-1.25,-0.15,0xc9a8ff,1.5).scale.setScalar(0.8);bed(scene,1.25,-0.15,0xffb84d,1.5).scale.setScalar(0.8);
  const F=mkF();F.position.set(-1.25,0.25,0.05);sitPose(F);F.scale.setScalar(0.8);scene.add(F);holdObj(F,0,phoneMesh(),-0.55,0.05);
  const T=mkT();T.position.set(1.25,0.25,0.05);sitPose(T);T.scale.setScalar(0.8);scene.add(T);holdObj(T,1,phoneMesh(),-0.55,0.05);
  const q=bF('만약에 지구에 우리 둘만 남으면?',{fs:56,size:0.0032});q.position.set(-0.15,2.55,0.6);scene.add(q);
  // 상상 구름 섬
  const isl=new THREE.Group();isl.position.set(0,3.55,-0.5);scene.add(isl);
  const cm=new THREE.MeshBasicMaterial({color:0xf2eeff});
  for(let i=0;i<14;i++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(0.35+r()*0.35,1),cm);p.position.set(-1.9+i*0.29,-0.35+(r()-0.5)*0.2,(r()-0.5)*0.6);isl.add(p)}
  const cart=new THREE.Group();const cb=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.32,0.34),lamb(0x9fd2ff));cb.position.y=0.3;cart.add(cb);
  for(const x of[-0.18,0.18]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.36,8),lamb(0x333));w.rotation.x=Math.PI/2;w.position.set(x,0.08,0);cart.add(w)}
  const cf=mkF();cf.scale.setScalar(0.32);cf.position.set(-0.05,0.35,0);cart.add(cf);const ct=mkT();ct.scale.setScalar(0.32);ct.position.set(0.12,0.35,-0.05);cart.add(ct);
  cart.position.set(-1.6,0.35,0.2);isl.add(cart);
  const fw=new THREE.Group();const ring=new THREE.Mesh(new THREE.TorusGeometry(0.75,0.05,8,24),lamb(0xff8fb3));fw.add(ring);
  for(let i=0;i<8;i++){const sp=new THREE.Mesh(new THREE.BoxGeometry(0.03,1.5,0.03),lamb(0xffd84d));sp.rotation.z=i*Math.PI/8;fw.add(sp);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.16,0.16),lamb([0x9fd2ff,0xffd84d,0xc9a8ff,0x9fe6a0][i%4]));cab.position.set(Math.cos(i*Math.PI/4)*0.75,Math.sin(i*Math.PI/4)*0.75,0.08);fw.add(cab)}
  const fwHold=new THREE.Group();fwHold.position.set(0.15,1.05,-0.2);fwHold.add(fw);const post=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.0,0.08),lamb(0xffffff));post.position.set(0.15,0.55,-0.25);isl.add(post);isl.add(fwHold);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.6,6),lamb(0xeeeeee));pole.position.set(1.35,0.8,0.1);isl.add(pole);
  const flag=signPlane('우리 나라',0.9,0.5,{bg:'#ffd84d',fg:'#6a4300',r:6,fs:80});flag.position.set(1.8,1.35,0.1);isl.add(flag);
  const est=labelSprite('건국 ✔',{bg:'#ff8fb3',fg:'#fff',fs:64,size:0.0042});est.position.set(1.0,2.3,0.3);isl.add(est);
  const hs=sprinkleHearts(scene,8,r,{x:0,w:3.6,z:-0.3,size:0.003});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('',230);ch.style.fontSize='54px';
  const Q=capAt(5,1)-0.1,ISL=capAt(5,1)+0.5,FW=capAt(5,2)-0.6,FL=capAt(5,2)+0.6;
  return t=>{
    const h=1+Math.min(3,Math.floor(Math.max(0,t-Q)/((FL+0.6-Q)/3)));const mm=t>FL+0.6?'00':'';ch.textContent=`AM ${t>FL+0.6?4:h}:00 · 통화 중`;chipPop(ch,t,0.05);
    scaleBubble(q,pop((t-Q)/0.25)*(1-ease((t-ISL-0.8)/0.3)));
    const ik=pop((t-ISL)/0.4);isl.scale.setScalar(Math.max(0.001,ik*0.62));
    cart.position.x=-1.6+ease((t-ISL-0.2)/1.4)*1.0;cart.rotation.z=Math.sin(t*12)*0.03;
    fwHold.scale.setScalar(Math.max(0.001,pop((t-FW)/0.35)));fw.rotation.z=t*0.8;post.scale.y=Math.max(0.001,ease((t-FW)/0.3));
    const fk=ease((t-FL)/0.5);pole.scale.y=Math.max(0.001,fk);pole.position.y=0.8*fk;flag.position.y=0.3+1.05*fk;flag.position.x=1.8;flag.scale.setScalar(Math.max(0.001,pop((t-FL-0.3)/0.3)));flag.rotation.y=Math.sin(t*4)*0.15;
    est.scale.set(est.userData.base[0]*pop((t-FL-0.6)/0.3),est.userData.base[1]*pop((t-FL-0.6)/0.3),1);
    updHearts(hs,t,FL+0.6,3.6,2.4);
    [F,T].forEach((p,i)=>{p.userData.head.rotation.z=Math.sin(t*2+i)*0.1;p.userData.arms[i].rotation.x=-2.6;p.userData.arms[i].rotation.z=i?0.5:-0.5});
    cam.position.set(0,3.0,8.4-t*0.12);cam.lookAt(0,2.85,0);
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6: 반박 카드 숨기기 → 며칠 뒤 한정판 운동화 ----------
S[6]=()=>{
  const r=rng(1601);
  const scene=new THREE.Scene();addLights(scene,{hemi:1.7,dir:1.2,dpos:[4,9,9]});room(scene,{floor:0xdcc0a0,wall:0xfff0e0});
  const sofa=new THREE.Group();const seat=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.45,0.85),lamb(0xa8c8e8));seat.position.y=0.3;sofa.add(seat);
  const sb=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.65,0.2),lamb(0x96b8dc));sb.position.set(0,0.8,-0.34);sofa.add(sb);sofa.position.set(0,0,-0.9);scene.add(sofa);
  const plant=new THREE.Mesh(new THREE.IcosahedronGeometry(0.4,0),lamb(0x7cbf74));plant.position.set(-2.1,1.0,-1.1);scene.add(plant);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.2,0.5,8),lamb(0xd98c6a));pot.position.set(-2.1,0.25,-1.1);scene.add(pot);
  const T=mkT();T.position.set(0.65,0,0.2);T.rotation.y=-0.55;scene.add(T);
  const F=mkF();F.position.set(-0.65,0,0.2);F.rotation.y=0.55;scene.add(F);
  const cards=['첫째','둘째','셋째'].map((s,i)=>{const c=signPlane(s,0.42,0.56,{bg:'#fff',fg:'#e07a00',fs:70,r:20,line:'#ffb84d'});scene.add(c);return c});
  const fb=bF('…',{fs:80,size:0.0046});fb.position.set(-0.8,2.2,0.3);scene.add(fb);
  const tb=bT('내가 미안해',{fs:64});tb.position.set(0.5,2.25,0.3);scene.add(tb);
  const box=giftBox();scene.add(box);const sh=shoe(0xffffff,0xff6a3d);scene.add(sh);
  const lim=labelSprite('한정판',{bg:'#ff6a3d',fg:'#fff',fs:60,size:0.0036});scene.add(lim);
  const tw=bT('…!!',{fs:80,size:0.0048});tw.position.set(0.55,2.3,0.3);scene.add(tw);
  const hs=sprinkleHearts(scene,8,r,{x:0.65,w:1.4,z:0.4,size:0.0032});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('',230);ch.style.fontSize='54px';
  const HIDE=capAt(6,1)-0.3,CUT=capAt(6,2)-0.05;
  return t=>{
    const tu=T.userData;
    if(t<CUT){bgEl.style.background='linear-gradient(#ffd6c8,#ffeede 55%,#fff6ee)';
      ch.textContent=t<HIDE?'말싸움 · ENTP 이길 확률 99%':'이길 확률 99% → 져 줌';chipPop(ch,t,0.05);
      const hk=ease((t-HIDE)/0.5);
      tu.arms[1].rotation.x=-1.4+hk*1.9;tu.arms[1].rotation.z=0.1;
      const hand=new THREE.Vector3();tu.arms[1].children[1].getWorldPosition(hand);T.updateMatrixWorld(true);tu.arms[1].children[1].getWorldPosition(hand);
      cards.forEach((c,i)=>{c.visible=true;c.position.set(hand.x-0.12+i*0.14+hk*0.2,hand.y+0.25-hk*0.2,hand.z+0.08-hk*0.5-i*0.01);c.rotation.set(0,-0.5,(1-i)*0.22);c.scale.setScalar(pop((t-0.1-i*0.1)/0.22))});
      scaleBubble(fb,pop((t-0.4)/0.22));scaleBubble(tb,pop((t-HIDE-0.4)/0.22));
      F.userData.head.rotation.x=0.2;box.visible=sh.visible=lim.visible=false;scaleBubble(tw,0);hs.forEach(q=>q.h.visible=false);
      cam.position.set(0.2,2.0,6.7-t*0.1);cam.lookAt(0.2,1.85,0);
    }else{const lt=t-CUT;bgEl.style.background='linear-gradient(#ffe0ec,#fff2e0 55%,#fffaf2)';
      cards.forEach(c=>c.visible=false);scaleBubble(fb,0);scaleBubble(tb,0);F.userData.head.rotation.x=0;tu.arms[1].rotation.x=-1.2;tu.arms[0].rotation.x=-1.2;
      F.userData.arms.forEach(a=>a.rotation.x=-1.3);
      ch.textContent=t<capAt(6,3)-0.2?'며칠 뒤':'석 달 전 지나가듯 한 말';chipPop(ch,t<capAt(6,3)-0.2?lt:t-capAt(6,3)+0.2,0.05);
      box.visible=true;const gx=-0.05+ease((lt-0.2)/0.6)*0.1;box.position.set(gx,1.05,0.75);box.scale.setScalar(pop((lt-0.1)/0.3));
      const op=ease((lt-1.2)/0.4);box.userData.lid.rotation.x=-op*1.9;
      sh.visible=op>0;sh.position.set(gx,1.25+op*0.45,0.75);sh.rotation.set(0,0.6+lt*0.8,0);sh.scale.setScalar(op*1.1);
      lim.visible=op>0.5;lim.position.set(gx,1.95+op*0.1,0.85);const lk=pop((lt-1.6)/0.25);lim.scale.set(lim.userData.base[0]*lk,lim.userData.base[1]*lk,1);
      const fz=t-capAt(6,3)-0.1;scaleBubble(tw,pop(fz/0.22));tu.head.rotation.x=fz>0&&fz<0.8?-0.1:0;
      hs.forEach(q=>q.h.visible=true);updHearts(hs,t,capAt(6,3)+0.8,2.1,1.8);
      cam.position.set(0,1.95,5.6-lt*0.12);cam.lookAt(0,1.7,0);
    }
    caption(6,t);renderer.render(scene,cam);
  };
};

// ---------- S7: 질문 장면 ----------
S[7]=()=>{
  bgEl.style.background='linear-gradient(#121735,#28306a 60%,#3e3f7a)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x2a3068,14,40);addLights(scene,{sky:0x9aa8ff,ground:0x202040,hemi:1.1,dir:0.6,sun:0xd0d8ff});
  const r=rng(1701);stars(scene,200,r,{y0:6,h:22,z:-22,w:50});
  const moon=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),basic(0xfff0c0));moon.position.set(3.4,9.5,-20);scene.add(moon);
  const mg=glowSprite('rgba(255,240,190,1)',6);mg.position.copy(moon.position);scene.add(mg);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0x3a3f5e));gr.rotation.x=-Math.PI/2;scene.add(gr);
  for(let i=0;i<9;i++){const h=makeHouse(r,{h:1.8+r()*1.4});h.position.set(-9+i*2.4+(r()-0.5)*0.4,0,-7-(i%2)*2.4);h.rotation.y=(r()-0.5)*0.3;scene.add(h)}
  for(const x of[-3,3]){const lp=new THREE.Mesh(new THREE.BoxGeometry(0.08,2.6,0.08),lamb(0x333344));lp.position.set(x,1.3,-3);scene.add(lp);const lg=glowSprite('rgba(255,220,150,1)',1.6);lg.position.set(x,2.7,-3);scene.add(lg)}
  const F=mkF();F.position.set(-0.6,0,0);F.rotation.y=0.15;scene.add(F);
  const T=mkT();T.position.set(0.6,0,0);T.rotation.y=-0.15;scene.add(T);
  for(const lg of T.userData.legs){const s=shoe(0xffffff,0xff6a3d);s.scale.setScalar(0.62);s.rotation.y=-Math.PI/2;s.position.set(0,-0.84,0.06);lg.add(s);lg.children[1].visible=false}
  const bug=new THREE.Group();const bb=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),lamb(0x6a4a2a));bb.scale.set(1,0.6,1.5);bug.add(bb);holdObj(F,0,bug,-0.66,0.05);
  const hb=makeBubble('♥',{bg:'#ece2ff',fg:'#e2557a',fs:80,size:0.0045});hb.position.set(0.6,2.05,0);F.add(hb);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out" style="font-size:96px">여러분 주변의<br><span style="color:${C_T}">ENTP</span>×<span style="color:${C_F}">INFP</span> 커플은<br>어떤가요?</div><div class="end2 out" style="top:850px">댓글에 태그해 주세요!</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2');
  return t=>{
    armUp(F,1,1);F.userData.arms[1].rotation.z=2.6+Math.sin(t*9)*0.35;F.userData.hip.position.y=0.8+Math.abs(Math.sin(t*6))*0.06;
    armUp(T,1,1);T.userData.arms[1].rotation.z=2.5-Math.sin(t*8)*0.3;T.userData.arms[0].rotation.z=-0.4;
    scaleBubble(hb,pop((t-0.4)/0.25));
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    e2.style.transform=`scale(${pop((t-3.9)/0.3)})`;e2.style.opacity=clamp01((t-3.9)/0.1);
    cam.position.set(0,1.6,6.4-t*0.15);cam.lookAt(0,2.4,0);
    renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
