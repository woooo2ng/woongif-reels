// ---------- 궁합편 공용 (한 커플: INTJ 남 · ENFP 여) ----------
const S=[];
function mkE(){ // ENFP 여자 (이방인편 디자인 그대로): 양갈래 번, 큰 눈, 웃는 입, 분홍 티 + 노란 치마, 매끈한 얼굴
  const p=makePerson(rng(31),{shirt:0xff9fcf,pants:0x55506a});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;u.hip.children[0].scale.x=0.9;const skin=u.arms[0].children[1].material;u.legs.forEach(l=>{l.children[0].material=skin});
  const skirt=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.36,0.36,16),lamb(0xfff0a8));skirt.position.y=-0.14;u.hip.add(skirt);
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  u.ck=[];
  for(const sx of[-1,1]){
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.045,20,16),basic(0x2a1a14));e.scale.set(0.9,1.2,0.5);e.position.set(sx*0.095,0.25,0.232);e.userData.eye=1;h.add(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.015,12,8),basic(0xffffff));hl.position.set(sx*0.095+0.015,0.27,0.252);hl.userData.eye=1;h.add(hl);
    const la=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.012,0.012),basic(0x2a1a14));la.position.set(sx*0.135,0.29,0.226);la.rotation.z=sx*0.6;h.add(la);
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.045,20),new THREE.MeshBasicMaterial({color:0xff9fb8,transparent:true,opacity:0.75}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);u.ck.push(ck)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.04,0.011,8,16,Math.PI),basic(0xd8506e));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);u.smile=sm;
  const fr=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.011,8,16,Math.PI),basic(0xd8506e));fr.position.set(0,0.135,0.245);fr.visible=false;h.add(fr);u.frown=fr;
  const m=smooth(0x7a4a32);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.262,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.22;h.add(cap);
  const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.85,0.22,0.42);bang.position.set(0,0.39,0.14);h.add(bang);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.266,40,24,Math.PI,Math.PI,0,Math.PI*0.72),m);bk.position.y=0.25;h.add(bk);
  for(const sx of[-1,1]){const bun=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,18),m);bun.position.set(sx*0.17,0.47,-0.06);h.add(bun);
    const tie=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.018,8,16),smooth(0xff4d8d));tie.position.set(sx*0.15,0.42,-0.05);tie.rotation.set(0.3,0,sx*0.75);h.add(tie)}
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  return p}
function eFace(p,mode){const u=p.userData;u.smile.visible=mode==='smile';u.frown.visible=mode==='frown'||mode==='puff';u.ck.forEach(c=>c.scale.setScalar(mode==='puff'?1.7:1))}
function mkJ(){ // INTJ 남자: 남색 셔츠, 단정한 옆가르마, 얇은 안경, 무표정
  const p=makePerson(rng(77),{shirt:0x4a5aa8,pants:0x2c3040});const u=p.userData,h=u.head;
  h.children[1].visible=false;const m=smooth(0x1d1d26);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.262,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.3;h.add(cap);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,24,Math.PI,Math.PI,0,Math.PI*0.6),m);bk.position.y=0.25;h.add(bk);
  const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.24,0.42);bang.position.set(0.05,0.425,0.13);bang.rotation.z=0.22;h.add(bang);
  const gm=lamb(0x22222a);
  for(const sx of[-1,1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.011,8,24),gm);ring.position.set(sx*0.09,0.25,0.258);h.add(ring)}
  const br=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.011,0.011),gm);br.position.set(0,0.26,0.262);h.add(br);
  for(const sx of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.016,0.012),lamb(0x1d1d26));b.position.set(sx*0.09,0.335,0.24);h.add(b)}
  const mo=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.012,0.01),basic(0x8a4a4a));mo.position.set(0,0.15,0.248);h.add(mo);u.mouth=mo;
  const col=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.06,0.05),lamb(0xffffff));col.position.set(0,0.62,0.15);u.hip.add(col);
  u.cheeks=h.children.filter(c=>c.material&&c.material.isMeshBasicMaterial&&c.material.color.getHex()===0xf2a3a3);u.cheeks.forEach(c=>c.visible=false);
  return p}
function blush(p,on){p.userData.cheeks.forEach(c=>c.visible=on)}
function eyesClose(p,k){p.userData.head.children.forEach(c=>{if(c.userData.eye){if(!c.userData.sy)c.userData.sy=c.scale.y;c.scale.y=c.userData.sy*(1-0.85*k)}})}
function holdObj(p,side,obj,y=-0.62,z=0.12){obj.position.set(0,y,z);p.userData.arms[side].add(obj);return obj}
function phoneMesh(){return new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a))}
function signPlane(text,w,h,o={}){const t=canvasTex(Math.round(w*400),Math.round(h*400),(x,cw,ch)=>{x.fillStyle=o.bg||'#fff';rr(x,0,0,cw,ch,o.r??30);x.fill();x.strokeStyle=o.line||'rgba(0,0,0,.15)';x.lineWidth=10;x.stroke();
  x.fillStyle=o.fg||'#333';x.font=`900 ${o.fs||Math.round(ch*0.42)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,cw/2,ch/2+4)});
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide}))}
function liveTex(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return {c,x:c.getContext('2d'),t}}
function drop(){const d=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),new THREE.MeshBasicMaterial({color:0x8fd3ff}));d.scale.set(0.8,1.3,0.8);return d}
function room(scene,o={}){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(o.floor||0xd8b48a));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(20,7,0.2),lamb(o.wall||0xfbe9d6));wall.position.set(0,3.5,o.wz??-1.6);scene.add(wall);return wall}
function sofa(scene,x,z,col=0xa8c8e8,w=2.6){const g=new THREE.Group();const seat=new THREE.Mesh(new THREE.BoxGeometry(w,0.45,0.85),lamb(col));seat.position.y=0.3;g.add(seat);
  const sb=new THREE.Mesh(new THREE.BoxGeometry(w,0.7,0.2),lamb(new THREE.Color(col).multiplyScalar(0.9).getHex()));sb.position.set(0,0.85,-0.34);g.add(sb);
  for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.6,0.85),lamb(new THREE.Color(col).multiplyScalar(0.9).getHex()));a.position.set(s*(w/2-0.1),0.5,0);g.add(a)}
  g.position.set(x,0,z);scene.add(g);return g}
function plant(scene,x,z,s=1){const g=new THREE.Group();const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.2,0.5,8),lamb(0xd98c6a));pot.position.y=0.25;g.add(pot);
  const lf=new THREE.Mesh(new THREE.IcosahedronGeometry(0.42,0),lamb(0x7cbf74));lf.position.y=0.85;g.add(lf);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}
function titleUI(tagTxt){
  ui.innerHTML=`<div class="tag">${tagTxt}</div><div class="title1 out" style="font-size:132px;top:330px;letter-spacing:-4px"><span style="color:${C_J}">INTJ</span><span style="font-size:90px">♂</span>×<span style="color:${C_E}">ENFP</span><span style="font-size:90px">♀</span></div><div class="title2 out" style="font-size:150px;top:500px;color:#fff">커플이라면?</div>`;
  return [ui.querySelector('.tag'),ui.querySelector('.title1'),ui.querySelector('.title2')]}
const bJ=(txt,o={})=>makeBubble(txt,{...JB,fs:o.fs||64,size:o.size||0.0042});
const bE=(txt,o={})=>makeBubble(txt,{...EB,fs:o.fs||64,size:o.size||0.0042});
function el(html){const d=document.createElement('div');d.innerHTML=html;const n=d.firstElementChild;ui.appendChild(n);return n}
function popEl(e,t,t0,base=''){e.style.transform=`${base}scale(${pop((t-t0)/0.3)})`;e.style.opacity=clamp01((t-t0)/0.08)}
function hop(t,a,b,h){const k=clamp01((t-a)/(b-a));return Math.sin(k*Math.PI)*h}
function desk(scene,x,z,w=2.0){const g=new THREE.Group();const top=new THREE.Mesh(new THREE.BoxGeometry(w,0.08,0.9),lamb(0xc9a27a));top.position.y=0.95;g.add(top);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.95,0.07),lamb(0x8a6a4a));l.position.set(sx*(w/2-0.08),0.475,sz*0.37);g.add(l)}
  g.position.set(x,0,z);scene.add(g);return g}
function stool(scene,x,z,col=0x8a6a4a,hh=0.5){const s=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.08,0.5),lamb(col));s.position.set(x,hh,z);scene.add(s);
  const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,hh,0.08),lamb(0x55555f));l.position.set(x,hh/2,z);scene.add(l);return s}

// ---------- S0: 고백 계획서 v12 (87일) → 카페에서 ENFP가 먼저 "우리 그냥 사귈래?" ----------
S[0]=()=>{
  const r=rng(1001);
  // A: INTJ 방 (밤)
  const sA=new THREE.Scene();addLights(sA,{sky:0xc0c6ff,ground:0x303050,hemi:1.25,dir:0.8,sun:0xdde0ff,dpos:[3,8,6]});
  room(sA,{floor:0x7a74a0,wall:0x6a6fae,wz:-1.7});
  stars(sA,0,r);
  const dk=desk(sA,-0.15,-1.0,2.4);
  const mon=new THREE.Mesh(new THREE.BoxGeometry(1.66,1.04,0.07),lamb(0x22222a));mon.position.set(-0.15,1.68,-1.28);sA.add(mon);
  const st=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.4,0.08),lamb(0x22222a));st.position.set(-0.15,1.12,-1.3);sA.add(st);
  const SL=liveTex(800,480);const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.56,0.94),new THREE.MeshBasicMaterial({map:SL.t}));scr.position.set(-0.15,1.68,-1.24);sA.add(scr);
  const mg=glowSprite('rgba(150,170,255,1)',3.2);mg.position.set(-0.15,1.7,-1.4);sA.add(mg);
  for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.08,0.3),lamb([0x7a8cff,0xffffff,0x5a63a8,0xd8ddff][i]));b.position.set(0.85,1.03+i*0.08,-0.9);b.rotation.y=(r()-0.5)*0.3;sA.add(b)}
  const mug=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.16,10),lamb(0xffffff));mug.position.set(-1.05,1.07,-0.8);sA.add(mug);
  const J=mkJ();J.position.set(-0.75,0,-0.05);J.rotation.y=Math.PI+0.25;sitPose(J);sA.add(J);stool(sA,-0.75,-0.05,0x5a5f88,0.5);
  const camA=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  function slide(k,k2){const x=SL.x,w=800,h=480;x.fillStyle='#f7f8ff';x.fillRect(0,0,w,h);
    x.fillStyle='#3a46a8';x.fillRect(0,0,w,74);x.fillStyle='#fff';x.font=`900 40px ${FONT}`;x.textBaseline='middle';x.textAlign='left';x.fillText('고백 계획서 v12.pptx',26,38);
    x.fillStyle='#26307a';x.font=`900 34px ${FONT}`;x.fillText('성공 확률',36,116);
    const pct=Math.round(61+17*k);x.fillStyle='#e2335a';x.font=`900 92px ${FONT}`;x.fillText(pct+'%',36,210);
    x.strokeStyle='#c8cdf0';x.lineWidth=3;x.beginPath();x.moveTo(40,440);x.lineTo(400,440);x.moveTo(40,440);x.lineTo(40,270);x.stroke();
    const pts=[[50,420],[110,400],[170,405],[230,370],[290,350],[350,320],[395,285]];const n=Math.max(1,Math.round(k*(pts.length-1)));
    x.strokeStyle='#7a8cff';x.lineWidth=9;x.lineJoin='round';x.beginPath();x.moveTo(...pts[0]);for(let i=1;i<=n;i++)x.lineTo(...pts[i]);x.stroke();
    x.fillStyle='#e2335a';x.beginPath();x.arc(...pts[n],11,0,7);x.fill();
    x.fillStyle='#26307a';x.font=`900 34px ${FONT}`;x.fillText('장소 후보',450,116);
    ['① 한강 공원','② 전시회','③ 단골 카페'].forEach((s,i)=>{if(k2>i/3+0.05){x.fillStyle=i===0?'#fff4c2':'#eef0ff';rr(x,440,150+i*92,320,72,18);x.fill();x.fillStyle='#333';x.font=`900 36px ${FONT}`;x.fillText(s,462,187+i*92)}});
    SL.t.needsUpdate=true}
  // B: 카페 (낮)
  const sB=new THREE.Scene();addLights(sB,{hemi:1.7,dir:1.2,dpos:[4,9,9]});
  room(sB,{floor:0xd9b28a,wall:0xe9f2e4,wz:-2.2});
  const win=new THREE.Mesh(new THREE.PlaneGeometry(5,2.4),basic(0xcde9ff));win.position.set(0,2.5,-2.08);sB.add(win);
  for(const x of[-2.5,-0.83,0.83,2.5]){const f=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.5,0.08),lamb(0x7a5a3a));f.position.set(x,2.5,-2.04);sB.add(f)}
  for(let i=0;i<6;i++){const tr=new THREE.Mesh(new THREE.IcosahedronGeometry(0.5+r()*0.3,0),lamb(0x8cc98a));tr.position.set(-2.2+i*0.9,1.8+r()*0.5,-2.6);sB.add(tr)}
  plant(sB,-2.3,-1.5,1.2);plant(sB,2.3,-1.5,1.0);
  const tb=new THREE.Group();const top=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.06,0.8),lamb(0xffffff));top.position.y=0.86;tb.add(top);
  const lg=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.85,8),lamb(0x555560));lg.position.y=0.43;tb.add(lg);tb.position.set(0,0,0.1);sB.add(tb);
  const cupE=new THREE.Group();const cb=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.065,0.22,12),new THREE.MeshLambertMaterial({color:0xffc2dc,transparent:true,opacity:0.85}));cupE.add(cb);
  const straw=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.3,6),lamb(0xff4d8d));straw.position.set(0.02,0.18,0);straw.rotation.z=-0.2;cupE.add(straw);cupE.position.set(-0.32,1.0,0.2);sB.add(cupE);
  const cupJ=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.06,0.17,10),lamb(0x3a2a22));cupJ.position.set(0.32,0.98,0.2);sB.add(cupJ);
  for(const s of[-1,1]){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.08,0.5),lamb(0x8a6a4a));ch.position.set(s*0.95,0.48,0.1);sB.add(ch)}
  const E=mkE();E.position.set(-0.9,0,0.1);E.rotation.y=Math.PI/2-0.45;sitPose(E);sB.add(E);
  const J2=mkJ();J2.position.set(0.9,0,0.1);J2.rotation.y=-Math.PI/2+0.45;sitPose(J2);sB.add(J2);
  const eq=bE('우리 그냥 사귈래?',{fs:62,size:0.0028});eq.position.set(-0.45,1.85,0.4);sB.add(eq);
  const ja=bJ('…응.',{fs:72,size:0.0034});ja.position.set(0.7,2.0,0.4);sB.add(ja);
  // 머릿속 PPT (생각 구름)
  const th=new THREE.Group();th.position.set(0.75,2.75,0.1);sB.add(th);
  const thm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true});
  for(const[px,py,s]of[[-0.42,-0.5,0.06],[-0.3,-0.36,0.09]]){const pf=new THREE.Mesh(new THREE.SphereGeometry(s,12,8),thm);pf.position.set(px,py,0);th.add(pf)}
  const pptT=canvasTex(640,400,(x,w,h)=>{x.fillStyle='#fff';rr(x,0,0,w,h,30);x.fill();x.fillStyle='#3a46a8';rr(x,0,0,w,70,30);x.fill();x.fillRect(0,40,w,30);
    x.fillStyle='#fff';x.font=`900 36px ${FONT}`;x.textBaseline='middle';x.fillText('고백 계획서 v12',24,36);
    x.fillStyle='#e2335a';x.font=`900 70px ${FONT}`;x.fillText('78%',30,160);x.strokeStyle='#7a8cff';x.lineWidth=10;x.beginPath();x.moveTo(40,340);x.lineTo(120,320);x.lineTo(200,300);x.lineTo(280,250);x.stroke();
    x.fillStyle='#333';x.font=`900 34px ${FONT}`;['D-day: 90일 차','장소: 한강 공원','멘트 47개 준비'].forEach((s,i)=>x.fillText(s,330,150+i*70))});
  const halves=[];for(const side of[0,1]){const g=new THREE.PlaneGeometry(0.6,0.75);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*0.5+side*0.5);
    const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:pptT,transparent:true,side:THREE.DoubleSide}));m.position.set(side?0.3:-0.3,0,0);const hg=new THREE.Group();hg.add(m);th.add(hg);halves.push(hg)}
  const crash=labelSprite('와르르',{bg:'#ffd84d',fg:'#6a4300',fs:60,size:0.0034});crash.position.set(0.8,2.3,0.5);sB.add(crash);
  const hs=sprinkleHearts(sB,7,r,{x:0,w:1.6,z:0.4,size:0.003});
  const camB=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const [tag,t1,t2]=titleUI('#015 궁합편');
  const ch=chip('',230);ch.style.fontSize='52px';
  const CUT=capAt(0,3)-0.15,ASK=capAt(0,3)+0.75,CR=ASK+0.7,YES=capAt(0,4)+1.2;
  return t=>{
    const fo=1-clamp01((t-capAt(0,1)+0.15)/0.35);
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.25)})`;tag.style.opacity=fo;
    t1.style.transform=`scale(${pop((t-0.05)/0.3)})`;t1.style.opacity=Math.min(clamp01((t-0.05)/0.08),fo);
    t2.style.transform=`scale(${pop((t-0.25)/0.35)})`;t2.style.opacity=Math.min(clamp01((t-0.25)/0.08),fo);
    if(t<CUT){
      bgEl.style.background='linear-gradient(#141a3e,#262d66 60%,#38397a)';
      slide(ease((t-capAt(0,1))/2.8),ease((t-capAt(0,2)+0.1)/1.6));
      const tc=capAt(0,1);if(t<tc-0.05){ch.style.opacity=0}else{const d=Math.max(1,Math.min(87,Math.round(1+86*ease((t-tc)/2.4))));ch.textContent=`고백 준비 ${d}일째`;chipPop(ch,t,tc)}
      const u=J.userData;u.arms.forEach((a,i)=>{a.rotation.x=-1.25+Math.sin(t*14+i*2)*0.12});u.head.rotation.x=-0.05;
      const k=ease((t-capAt(0,1)+0.3)/3.5);camA.position.set(1.45-k*0.3,2.25-k*0.05,3.6-k*0.8);camA.lookAt(-0.35,2.05-k*0.1,-1.0);
      caption(0,t);renderer.render(sA,camA);
    }else{const lt=t-CUT;
      bgEl.style.background='linear-gradient(#bfe3ff,#e8f6ff 55%,#f6fbff)';
      ch.textContent=t<YES+0.2?'만난 지 3일':'만난 지 3일 · 계획서 사용 0회';chipPop(ch,t<YES+0.2?lt:t-YES-0.2,0.02);
      const eu=E.userData;eu.arms[0].rotation.x=-1.0;eu.arms[1].rotation.x=t<ASK?-1.2+Math.sin(t*3)*0.05:-1.0;eu.head.rotation.z=t>ASK?0.15:0;eu.head.rotation.x=t<ASK?0.12:-0.05;
      scaleBubble(eq,pop((t-ASK)/0.25));
      // 생각 구름 PPT: 처음엔 둥둥 → 고백 듣고 흔들리다 두 동강 나며 떨어짐
      const tk=pop((lt-0.15)/0.3);th.scale.setScalar(Math.max(0.001,tk*0.95));
      const sh=t>ASK+0.25&&t<CR?Math.sin(t*60)*0.04:0;th.position.x=0.75+sh;
      const fk=clamp01((t-CR)/0.8);halves.forEach((hg,i)=>{const s=i?1:-1;hg.position.set(s*fk*0.35,-fk*fk*2.2,0);hg.rotation.z=s*-fk*1.1});
      thm.opacity=1-fk;halves.forEach(hg=>hg.children[0].material.opacity=1-clamp01((t-CR-0.4)/0.4));
      crash.visible=t>CR;const ck=pop((t-CR)/0.25)*(1-ease((t-CR-1.1)/0.3));crash.scale.set(crash.userData.base[0]*ck,crash.userData.base[1]*ck,1);
      const ju=J2.userData;ju.head.rotation.x=t>CR&&t<YES?0.08:0;ju.arms.forEach(a=>a.rotation.x=-1.0);
      scaleBubble(ja,pop((t-YES)/0.25));blush(J2,t>YES);
      updHearts(hs,t,YES+0.3,1.8,1.4);
      camB.position.set(0.05,2.0,6.3-lt*0.1);camB.lookAt(0.05,1.75,0);
      caption(0,t);renderer.render(sB,camB);
    }
  };
};

// ---------- S1: 데이트 코스 → "바다 보러 가자!!" → 2~6시 자유시간(즉흥용) ----------
S[1]=()=>{
  bgEl.style.background='linear-gradient(#8ec9ff,#d4ecff 55%,#eef8ff)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xd8ecff,18,60);addLights(scene,{hemi:1.7,dir:1.3});
  const r=rng(1101);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(0xb9c9a8));gr.rotation.x=-Math.PI/2;gr.position.y=-0.01;scene.add(gr);
  const sw=new THREE.Mesh(new THREE.PlaneGeometry(200,3.4),lamb(0xe2dccf));sw.rotation.x=-Math.PI/2;sw.position.set(0,0.005,0.3);scene.add(sw);
  const rd=new THREE.Mesh(new THREE.PlaneGeometry(200,5),lamb(0x6a6f78));rd.rotation.x=-Math.PI/2;rd.position.set(0,0.004,4.5);scene.add(rd);
  let x=-14;while(x<14){const w=2.6+r()*1.6,h=3.5+r()*4;const b=makeBuilding(r,w,h,2.4);b.position.set(x+w/2,b.position.y,-3.4);scene.add(b);x+=w+0.15}
  // 바다 광고판
  const bill=canvasTex(900,560,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#8fd8ff');g.addColorStop(0.55,'#d6f3ff');g.addColorStop(0.56,'#3aa0e0');g.addColorStop(1,'#2a7fc0');c.fillStyle=g;rr(c,0,0,w,h,30);c.fill();
    c.fillStyle='#fff2a8';c.beginPath();c.arc(720,130,70,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=10;for(let i=0;i<3;i++){c.beginPath();for(let xx=40;xx<w-40;xx+=10)c.lineTo(xx,360+i*60+Math.sin(xx/40)*10);c.stroke()}
    c.fillStyle='#ffffff';c.strokeStyle='#1d4a80';c.lineWidth=14;c.font=`900 120px ${FONT}`;c.textAlign='center';c.strokeText('여름 바다',w/2,250);c.fillText('여름 바다',w/2,250);
    c.font=`900 50px ${FONT}`;c.lineWidth=10;c.strokeText('기차로 2시간!',w/2,500);c.fillText('기차로 2시간!',w/2,500)});
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.24),new THREE.MeshBasicMaterial({map:bill}));bd.position.set(0.4,3.6,-2.15);scene.add(bd);
  const bf=new THREE.Mesh(new THREE.BoxGeometry(3.8,2.44,0.1),lamb(0xffffff));bf.position.set(0.4,3.6,-2.22);scene.add(bf);
  for(const s of[-1,1]){const tr=new THREE.Group();const tt=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.14,1.4,6),lamb(0x7a5a3c));tt.position.y=0.7;tr.add(tt);const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(0.8,0),lamb(0x6fae6a));cr.position.y=1.9;tr.add(cr);tr.position.set(s*3.4+0.4,0,-1.2);scene.add(tr)}
  const E=mkE();scene.add(E);const J=mkJ();scene.add(J);
  const watch=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.06,0.15),lamb(0xd8d8e0));holdObj(J,0,watch,-0.5,0.0);
  const eb=bE('어!! 바다 보러 가자!!',{fs:62,size:0.003});scene.add(eb);
  const jb=bJ('…지금 자유시간이네. 가자.',{fs:58,size:0.0026});scene.add(jb);
  const hs=sprinkleHearts(scene,8,r,{x:0.2,w:1.6,z:0.6,size:0.003});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const card=el(`<div class="card" style="top:300px"><div class="ct">오늘 데이트 코스<small>by INTJ</small></div>
    <div class="crow"><span class="tm">11:00</span>전시회<span class="ok">예매 ✔</span></div>
    <div class="crow"><span class="tm">13:00</span>파스타 맛집<span class="ok">예약 ✔</span></div>
    <div class="crow free"><span class="tm">14~18시</span>자유시간 (즉흥용)</div>
    <div class="crow"><span class="tm">19:00</span>저녁 + 산책<span class="ok">예약 ✔</span></div></div>`);
  const rows=[...card.querySelectorAll('.crow')];
  const card2=el(`<div class="card" style="top:330px;padding:18px 26px"><div class="crow free" style="font-size:46px"><span class="tm" style="font-size:44px">14~18시</span>자유시간 (즉흥용)<span class="ok" style="color:#c2307a">지금 ✔</span></div></div>`);
  const ch=chip('',230);ch.style.fontSize='52px';
  const ASK=capAt(1,1)+0.1,WT=ASK+0.7,FREE=capAt(1,2)+0.05,GO=FREE+0.55,JMP=GO+0.9;
  return t=>{
    // 카드 1: 코스 줄별 등장 → 위로 빠짐
    popEl(card,t,0.15);const out=ease((t-ASK+0.35)/0.3);card.style.transform+=` translateY(${-out*700}px)`;card.style.opacity=Math.min(card.style.opacity,1-out);
    rows.forEach((rw,i)=>{const k=pop((t-0.45-i*0.32)/0.25);rw.style.transform=`scale(${k})`;rw.style.opacity=clamp01((t-0.45-i*0.32)/0.08)});
    rows[2].style.boxShadow=t>1.6&&t<ASK?`0 0 0 ${4+3*Math.sin(t*10)}px #ff8fc8`:'none';
    popEl(card2,t,FREE);card2.style.display=t<FREE?'none':'block';card2.style.transform+=` rotate(${Math.sin(t*6)*1.2}deg)`;
    if(t<WT-0.05)ch.style.opacity=0;else{ch.textContent=t<JMP?'PM 2:00':'즉흥 데이트: 계획대로 진행 중';chipPop(ch,t<JMP?t-WT:t-JMP,0)}
    // 걷기 → 멈춤
    const wk=Math.min(t,ASK-0.2);const cx=-2.2+wk*0.62;
    const walking=t<ASK-0.2;
    E.position.set(cx-0.45,0,0.45);J.position.set(cx+0.45,0,0.35);
    if(walking){walkPose(E,t*7,0.5);walkPose(J,t*6.2,0.45);E.rotation.y=Math.PI/2;J.rotation.y=Math.PI/2}
    else{standPose(E);standPose(J);
      const eu=E.userData;const lt=t-ASK;
      E.rotation.y=Math.PI/2-ease(lt/0.3)*1.9;
      if(t<JMP){armUp(E,1,ease(lt/0.25));eu.arms[1].rotation.x=-2.3;eu.arms[1].rotation.z=0.35}else{armUp(E,0,1);armUp(E,1,1);eu.arms[0].rotation.z=-0.5;eu.arms[1].rotation.z=0.5}
      eu.hip.position.y=0.8+hop(t,ASK,ASK+0.35,0.12)+(t>JMP?Math.abs(Math.sin((t-JMP)*9))*0.22:0);
      const ju=J.userData;J.rotation.y=Math.PI/2-ease((t-ASK-0.3)/0.3)*1.3;
      const wkk=ease((t-WT+0.3)/0.3)*(1-ease((t-GO+0.1)/0.3));ju.arms[0].rotation.x=-1.6*wkk;ju.arms[0].rotation.z=0.5*wkk;ju.head.rotation.x=0.35*wkk;
      if(t>GO){ju.arms[1].rotation.x=-0.6*ease((t-GO)/0.3)}
      blush(J,t>JMP);}
    eb.position.set(cx-0.2,1.95,0.6);scaleBubble(eb,pop((t-ASK)/0.25)*(1-ease((t-GO+0.2)/0.25)));
    jb.position.set(cx+0.1,2.35,0.5);scaleBubble(jb,pop((t-GO)/0.25));
    updHearts(hs,t,JMP,1.7,1.5);hs.forEach(q=>q.x=E.position.x+0.2+(q.ph-0.5)*1.4);
    const camX=walking?cx:cx;cam.position.set(camX+0.2,1.7,6.2);cam.lookAt(camX,2.0,0);
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- S2: 해결책 3개 → "공감해 달라고!!" → 공감 공부 → "그랬구나." x5 ----------
S[2]=()=>{
  const r=rng(1201);
  // A: 밤 거실 소파
  const sA=new THREE.Scene();addLights(sA,{sky:0xffe6c8,ground:0x403050,hemi:1.35,dir:0.9,sun:0xffe0c0,dpos:[3,8,7]});
  room(sA,{floor:0x9a7a68,wall:0x6e6a9a,wz:-1.6});
  sofa(sA,-0.45,-0.9,0xffb8d0,2.2);
  const lampG=glowSprite('rgba(255,210,150,1)',2.4);lampG.position.set(-2.1,2.3,-1.2);sA.add(lampG);
  const lp=new THREE.Mesh(new THREE.ConeGeometry(0.28,0.35,10,1,true),lamb(0xffe2b0));lp.position.set(-2.1,2.2,-1.2);sA.add(lp);
  const lpole=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,2.1,6),lamb(0x55555f));lpole.position.set(-2.1,1.05,-1.2);sA.add(lpole);
  const E=mkE();E.position.set(-0.6,0,-0.75);sitPose(E);E.rotation.y=0.35;sA.add(E);
  const J=mkJ();sA.add(J);
  const WB=liveTex(700,520);const board=new THREE.Group();
  const bpl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.04),new THREE.MeshBasicMaterial({map:WB.t}));bpl.position.y=1.6;board.add(bpl);
  const bfr=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.14,0.05),lamb(0xb0b4c0));bfr.position.set(0,1.6,-0.04);board.add(bfr);
  for(const s of[-1,1]){const lg=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.1,0.05),lamb(0x8a8e9a));lg.position.set(s*0.6,0.55,-0.05);board.add(lg);
    const wh=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),lamb(0x333));wh.position.set(s*0.6,0.06,-0.05);board.add(wh)}
  board.rotation.y=-0.35;sA.add(board);
  function drawWB(k){const x=WB.x,w=700,h=520;x.fillStyle='#ffffff';x.fillRect(0,0,w,h);x.textBaseline='middle';
    x.fillStyle='#e2335a';x.font=`900 62px ${FONT}`;x.fillText('해결책',40,70);x.fillRect(40,110,200*clamp01(k*3),8);
    const L=['① 이직하기','② 대화 녹음','③ 인사팀 신고'];x.font=`900 64px ${FONT}`;x.fillStyle='#26307a';
    L.forEach((s,i)=>{const kk=clamp01(k*3-i);if(kk<=0)return;x.save();x.beginPath();x.rect(0,150+i*115,40+620*kk,115);x.clip();x.fillText(s,50,210+i*115);x.restore()});
    WB.t.needsUpdate=true}
  const tears=[0,1,2,3].map(()=>{const d=drop();sA.add(d);return d});
  const e1=bE('팀장님이 나한테… ㅠㅠ',{fs:60,size:0.0028});e1.position.set(-0.2,1.95,-0.3);sA.add(e1);
  const e2=bE('해결 말고 공감해 달라고!!',{fs:66,size:0.003});e2.position.set(0.05,2.0,-0.2);sA.add(e2);
  const j1=bJ('…!',{fs:80,size:0.0044});j1.position.set(1.25,2.45,0);sA.add(j1);
  const camA=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  // B: 새벽 책상 공부
  const sB=new THREE.Scene();addLights(sB,{sky:0x9aa4ff,ground:0x202040,hemi:0.95,dir:0.5,sun:0xd0d8ff});
  room(sB,{floor:0x4a4868,wall:0x2f3460,wz:-1.5});desk(sB,0,-0.8,2.2);
  const dl=glowSprite('rgba(255,220,160,1)',3.4);dl.position.set(0.7,1.5,-0.9);sB.add(dl);
  const dlamp=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.25,10,1,true),lamb(0xffe2b0));dlamp.position.set(0.7,1.5,-0.95);dlamp.rotation.z=0.5;sB.add(dlamp);
  for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.09,0.3),lamb([0xff9fcf,0x7a8cff,0xffd84d,0x9df2c8,0xffffff][i]));b.position.set(-0.75,1.04+i*0.09,-0.9);b.rotation.y=(r()-0.5)*0.4;sB.add(b)}
  const bkT=signPlane('공감 대화법',0.5,0.14,{bg:'#ff9fcf',fg:'#fff',r:6,fs:40});bkT.rotation.x=-Math.PI/2;bkT.position.set(-0.75,1.5,-0.9);sB.add(bkT);
  const J2=mkJ();J2.position.set(0,0,-0.1);J2.rotation.y=Math.PI;sitPose(J2);sB.add(J2);stool(sB,0,-0.1,0x5a5f88,0.5);
  const camB=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const note=el(`<div class="note"><div class="nt">공감 공부 노트 · INTJ</div><div class="big">공감 = "그랬구나"<div class="ul"></div></div><div class="sm">※ 해결책 말하기 금지</div><div class="sm" style="margin-top:14px">※ 표정: 진지하게</div></div>`);
  const ul=note.querySelector('.ul'),sms=[...note.querySelectorAll('.sm')];
  // C: 다음 날 (낮) — "그랬구나." x5
  const sC=new THREE.Scene();addLights(sC,{hemi:1.7,dir:1.2,dpos:[4,9,9]});room(sC,{floor:0xdcc0a0,wall:0xfff0e0});
  const cnt=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.95,0.6),lamb(0xffffff));cnt.position.set(0,0.47,-1.2);sC.add(cnt);
  const cntT=new THREE.Mesh(new THREE.BoxGeometry(2.7,0.06,0.7),lamb(0x9fd8c0));cntT.position.set(0,0.97,-1.2);sC.add(cntT);
  plant(sC,2.0,-1.0,0.9);
  const E3=mkE();E3.position.set(-0.6,0,0.1);E3.rotation.y=0.6;sC.add(E3);
  const J3=mkJ();J3.position.set(0.65,0,0.1);J3.rotation.y=-0.6;sC.add(J3);
  const EL=['나 커피 쏟았어','버스 놓쳤어','택배 안 왔어','배고파','나 오늘 예뻐?'];
  const ce=bE(EL[0],{fs:60,size:0.0032});ce.position.set(-0.5,1.85,0.4);sC.add(ce);
  const cj=bJ('그랬구나.',{fs:66,size:0.0038});cj.position.set(0.6,2.3,0.4);sC.add(cj);
  const lol=bE('ㅋㅋㅋㅋㅋㅋ',{fs:74,size:0.0034});lol.position.set(-0.25,1.95,0.4);sC.add(lol);
  const camC=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('',230);ch.style.fontSize='52px';
  const WIN=capAt(2,1)+0.05,ANG=capAt(2,2)+0.05,CB=capAt(2,3)-0.15,CC=capAt(2,4)-0.1;
  const P0=CC+0.15,STEP=0.62;let lastE=-1;
  return t=>{
    note.style.display=t>=CB&&t<CC?'block':'none';
    if(t<CB){
      bgEl.style.background='linear-gradient(#2a2a5a,#4a4680 60%,#6a5a8a)';
      const bx=2.4-ease((t-WIN+0.3)/0.7)*1.85;board.position.set(bx,0,-0.6);
      J.position.set(bx+0.7,0,-0.2);J.rotation.y=-0.9;if(t<WIN+0.4)walkPose(J,t*7,0.4);else{standPose(J);armUp(J,0,0);J.userData.arms[0].rotation.x=-1.4;J.userData.arms[0].rotation.z=0.6}
      drawWB(clamp01((t-WIN-0.3)/1.4));
      const eu=E.userData;eu.arms.forEach(a=>a.rotation.x=-0.9);
      if(t<ANG){eFace(E,'frown');eyesClose(E,0.5);eu.head.rotation.x=0.15;
        tears.forEach((d,i)=>{const s=i%2?1:-1;const lt=((t*1.4+i*0.37)%1);d.visible=true;d.position.set(-0.6+0.17*s*0.8+s*0.04,1.52-lt*0.45,-0.42);d.scale.setScalar(0.8)});}
      else{eFace(E,'puff');eyesClose(E,0);eu.head.rotation.x=-0.05;tears.forEach(d=>d.visible=false);eu.arms.forEach((a,i)=>{a.rotation.x=-2.4+Math.sin(t*14+i)*0.25;a.rotation.z=i?0.4:-0.4});eu.hip.position.y=0.56+Math.abs(Math.sin(t*10))*0.03}
      scaleBubble(e1,pop((t-0.25)/0.25)*(1-ease((t-ANG+0.2)/0.2)));scaleBubble(e2,pop((t-ANG)/0.25));scaleBubble(j1,pop((t-ANG-0.55)/0.22));
      if(t<WIN+1.1)ch.style.opacity=0;else{ch.textContent='해결책 3개 · 공감 0개';chipPop(ch,t,WIN+1.1)}
      camA.position.set(0.3,2.0,6.3-t*0.08);camA.lookAt(0.3,1.75,-0.5);
      caption(2,t);renderer.render(sA,camA);
    }else if(t<CC){const lt=t-CB;
      bgEl.style.background='linear-gradient(#0e1230,#1f2558 60%,#2c2c66)';
      ch.textContent='AM 2:00 · 공감 공부 중';chipPop(ch,lt,0.02);
      popEl(note,t,CB+0.1);ul.style.width=(clamp01((lt-0.5)/0.5)*100)+'%';sms.forEach((s,i)=>s.style.opacity=clamp01((lt-0.9-i*0.35)/0.15));
      J2.userData.arms.forEach((a,i)=>a.rotation.x=-1.2+Math.sin(t*12+i*3)*0.1);J2.userData.head.rotation.x=0.25;
      camB.position.set(0.9,2.1,2.7);camB.lookAt(0,1.4,-0.8);
      caption(2,t);renderer.render(sB,camB);
    }else{const lt=t-CC;
      bgEl.style.background='linear-gradient(#ffd6c8,#ffeede 55%,#fff6ee)';
      const i=Math.min(4,Math.floor((t-P0)/STEP));const ph=t-P0-i*STEP;
      const n=t<P0+0.3?0:Math.min(5,Math.floor((t-P0-0.3)/STEP)+1);
      ch.textContent=`"그랬구나" ${n}회`;chipPop(ch,lt,0.02);
      const end=P0+5*STEP+0.05;
      if(t<end){if(i!==lastE&&i>=0){lastE=i;setBubble(ce,EL[i],{...EB,fs:60,size:0.0032})}
        scaleBubble(ce,t<P0?0:pop(ph/0.18));scaleBubble(cj,t<P0+0.3?0:pop((ph-0.3)/0.15));scaleBubble(lol,0);
        J3.userData.head.rotation.z=0;J3.userData.hip.position.y=0.8;
        eFace(E3,'smile');E3.userData.hip.position.y=0.8;
      }else{scaleBubble(ce,0);scaleBubble(cj,1-ease((t-end)/0.3));scaleBubble(lol,pop((t-end)/0.22));
        const eu=E3.userData;eu.hip.position.y=0.8+Math.abs(Math.sin((t-end)*12))*0.08;eu.arms.forEach(a=>a.rotation.x=-0.6);E3.rotation.x=-0.1;eyesClose(E3,0.7)}
      J3.userData.arms.forEach(a=>{a.rotation.x=0});J3.userData.head.rotation.x=t<end?(ph>0.3?0.12:0):0;
      camC.position.set(0.05,1.95,4.6-lt*0.08);camC.lookAt(0.05,1.75,0);
      caption(2,t);renderer.render(sC,camC);
    }
  };
};

// ---------- S3: 친구 모임 → INTJ 배터리 3% → ENFP 배 아픈 척(발연기) → 같이 빠져나옴 ----------
S[3]=()=>{
  bgEl.style.background='linear-gradient(#ffcfa8,#ffe6cc 55%,#fff2e2)';
  const r=rng(1301);
  const scene=new THREE.Scene();addLights(scene,{hemi:1.65,dir:1.15,dpos:[3,9,8]});
  room(scene,{floor:0xd8b48a,wall:0xffe7d0,wz:-2.4});
  for(let i=0;i<7;i++){const g=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,6),basic([0xff8fc8,0xffd84d,0x9df2c8,0x9cc9ff][i%4]));g.position.set(-2.4+i*0.75,3.2-Math.sin(i*0.9)*0.25,-2.25);scene.add(g)}
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.0,2.2,0.08),lamb(0xa87a52));door.position.set(2.75,1.1,-2.28);scene.add(door);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,6),lamb(0xffd84d));knob.position.set(2.4,1.1,-2.22);scene.add(knob);
  const tbl=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,0.1,20),lamb(0xffffff));tbl.position.set(-0.6,0.42,-0.6);scene.add(tbl);
  const tleg=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.38,8),lamb(0x8a6a4a));tleg.position.set(-0.6,0.2,-0.6);scene.add(tleg);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const s=new THREE.Mesh(i%2?new THREE.CylinderGeometry(0.05,0.05,0.26,8):new THREE.BoxGeometry(0.22,0.06,0.16),lamb([0x9df2c8,0xffd84d,0xff9fcf,0x7fb7c9,0xe39a6b,0xffffff][i]));s.position.set(-0.6+Math.cos(a)*0.45,i%2?0.6:0.5,-0.6+Math.sin(a)*0.45);scene.add(s)}
  const FR=[];const POS=[[-1.55,-0.55],[-1.2,-1.35],[-0.3,-1.45],[0.25,-0.85]];
  POS.forEach(([x,z],i)=>{const p=makePerson(rng(1310+i),{shirt:[0xffb84d,0x9df2c8,0xc7a3c9,0x7fb7c9][i]});p.position.set(x,0,z);p.rotation.y=Math.atan2(-0.6-x,-0.6-z)*0+Math.atan2((-0.6)-x,(-0.6)-z);sitPose(p);p.userData.hip.position.y=0.3;p.userData.legs.forEach(l=>l.rotation.x=-1.4);scene.add(p);FR.push(p)});
  FR.forEach(p=>{const dx=-0.6-p.position.x,dz=-0.6-p.position.z;p.rotation.y=Math.atan2(dx,dz)});
  const E=mkE();E.position.set(-0.5,0,0.25);E.rotation.y=Math.PI;sitPose(E);E.userData.hip.position.y=0.3;E.userData.legs.forEach(l=>l.rotation.x=-1.4);scene.add(E);
  const J=mkJ();J.position.set(1.65,0,0.1);J.rotation.y=-0.5;sitPose(J);scene.add(J);stool(scene,1.65,0.1,0xb08860,0.5);
  // 배터리
  const BT=liveTex(380,190);const bat=new THREE.Sprite(new THREE.SpriteMaterial({map:BT.t,transparent:true,depthWrite:false}));bat.scale.set(0.76,0.38,1);scene.add(bat);
  function drawBat(lv,blink,charging){const x=BT.x;x.clearRect(0,0,380,190);x.fillStyle='rgba(0,0,0,.18)';rr(x,10,26,320,140,30);x.fill();
    x.fillStyle='#fff';rr(x,6,18,320,140,30);x.fill();x.fillStyle='#fff';rr(x,326,62,36,52,10);x.fill();
    const col=charging?'#3ccf6e':lv>0.5?'#3ccf6e':lv>0.2?'#ffc23d':'#ff4a5a';
    if(!(blink&&Math.floor(blink*4)%2)){x.fillStyle=col;rr(x,22,34,Math.max(16,288*lv),108,20);x.fill()}
    x.fillStyle='#222';x.font=`900 64px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText((charging?'⚡':'')+Math.round(lv*100)+'%',166,90);BT.t.needsUpdate=true}
  const fbs=['ㅋㅋㅋㅋㅋ','대박!!','건배~!','2차 가?','노래방 콜!!','사진 찍자!!'].map((s,i)=>{const b=makeBubble(s,{bg:['#fff4c2','#d9fbe9','#ece2ff','#d6ecff','#ffe0f0','#fff4c2'][i],fg:'#3a3a4a',fs:58,size:0.003});scene.add(b);return b});
  const FBP=[[-1.15,1.95],[-0.75,2.3],[0.05,2.2],[0.45,1.9],[-0.35,2.62],[-1.05,2.7]];
  const q1=makeBubble('…?',{bg:'#fff',fg:'#3a3a4a',fs:62,size:0.0034});q1.position.set(-0.95,2.0,-0.9);scene.add(q1);
  const q2=makeBubble('배 아픈 사람 맞아?',{bg:'#fff',fg:'#3a3a4a',fs:56,size:0.003});q2.position.set(-0.2,2.4,-1.3);scene.add(q2);
  const look=bE('…!',{fs:70,size:0.0038});scene.add(look);
  const sick=bE('아야… 나 배 아파서 먼저 갈게~',{fs:58,size:0.0032});scene.add(sick);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('',230);ch.style.fontSize='52px';
  const B0=0.5,B1=capAt(3,1)+2.3,LK=capAt(3,2)+0.0,ACT=LK+0.45,LEAVE=capAt(3,3)+0.05,BAD=capAt(3,4)+0.0;
  return t=>{
    const lv=t<B0?1:t<B1?1-0.97*ease((t-B0)/(B1-B0)):t<LEAVE+0.4?0.03:0.03+0.6*ease((t-LEAVE-0.4)/2.2);
    drawBat(lv,t>B1-0.3&&t<LEAVE+0.4?t:0,t>LEAVE+0.4);
    const ju=J.userData;
    // 친구들 수다
    fbs.forEach((b,i)=>{const per=1.6,st=0.2+i*0.42;const lt=((t-st)%per+per)%per;const on=t>st&&t<LK+0.2;b.position.set(FBP[i][0],FBP[i][1],-0.7);scaleBubble(b,on?pop(lt/0.2)*(1-ease((lt-1.1)/0.2)):0)});
    FR.forEach((p,i)=>{const u=p.userData;u.head.rotation.z=t<LEAVE?Math.sin(t*5+i)*0.15:0;u.arms[i%2].rotation.x=t<LK?-1.2+Math.sin(t*7+i)*0.5:-0.6});
    if(t>BAD-0.3)FR.forEach(p=>{const dx=2.4-p.position.x,dz=-1.0-p.position.z;p.rotation.y+=(Math.atan2(dx,dz)-p.rotation.y)*0.25});
    scaleBubble(q1,pop((t-BAD)/0.22));scaleBubble(q2,pop((t-BAD-0.4)/0.22));
    // INTJ: 점점 지침
    const tired=clamp01((t-B0)/(B1-B0));ju.head.rotation.x=t<LEAVE?0.35*tired:0;ju.hip.position.y=t<LEAVE?0.56-0.05*tired:0.8;ju.arms.forEach(a=>a.rotation.x=t<LEAVE?-0.4:0);
    // ENFP
    const eu=E.userData;
    if(t<LK){E.rotation.y=Math.PI;eu.arms[1].rotation.x=-1.3+Math.sin(t*8)*0.6;eFace(E,'smile')}
    else if(t<ACT){E.rotation.y=Math.PI-ease((t-LK)/0.25)*2.3}
    look.position.set(E.position.x-0.1,1.55,E.position.z+0.3);scaleBubble(look,pop((t-LK)/0.2)*(1-ease((t-ACT)/0.2)));
    if(t>=ACT&&t<LEAVE){// 일어나서 배 잡고 과장 연기
      E.rotation.y=Math.PI-2.3+ease((t-ACT)/0.3)*0.0;standPose(E);eu.hip.position.y=0.8;
      E.rotation.x=0;eu.hip.rotation.x=0.35+Math.sin(t*16)*0.06;eu.arms.forEach((a,i)=>{a.rotation.x=-0.9;a.rotation.z=i?-0.75:0.75});eFace(E,'frown');eyesClose(E,0.8);eu.head.rotation.z=Math.sin(t*10)*0.15}
    if(t>=LEAVE){eu.hip.rotation.x=0;eyesClose(E,0);eFace(E,'smile');}
    sick.position.set(0.55,1.85,E.position.z+0.4);scaleBubble(sick,pop((t-ACT-0.15)/0.22)*(1-ease((t-LEAVE-0.2)/0.25)));
    if(t>=LEAVE){// 손잡고 문으로 — ENFP는 신나서 깡충
      const k=ease((t-LEAVE-0.2)/2.6);const ex=-0.5+(2.3+0.5)*k*0+0;
      const sx=1.15+k*1.25,sz=0.25-k*1.9;
      E.position.set(sx,0,sz);J.position.set(sx+0.55,0,sz+0.1);standPose(J);
      E.rotation.y=Math.atan2(1.25,-1.9);J.rotation.y=E.rotation.y;
      if(k<1){walkPose(E,t*8,0.5);walkPose(J,t*7,0.45)}else{standPose(E);standPose(J)}
      eu.hip.position.y=0.8+Math.abs(Math.sin(t*7))*0.18;eu.arms[1].rotation.x=-0.5;ju.arms[0].rotation.x=-0.5;
    }else{E.position.set(-0.5+(t>ACT?ease((t-ACT)/0.4)*1.65:0),0,0.25)}
    bat.position.set(J.position.x,J.position.y+(t<LEAVE?2.35:2.6),J.position.z);
    if(t<capAt(3,1)-0.05)ch.style.opacity=0;else{ch.textContent=t<BAD?'친구 모임 1시간째':'연기력 0점 · 배터리 충전 중';chipPop(ch,t<BAD?t-capAt(3,1)+0.05:t-BAD,0)}
    cam.position.set(0.4,3.0,7.6-t*0.06);cam.lookAt(0.4,1.55,-0.5);
    caption(3,t);renderer.render(scene,cam);
  };
};

// ---------- S4: 삐진 ENFP → INTJ 사과문 3장(원인 분석·재발 방지 대책) → "ㅋㅋㅋ 이게 뭐야" ----------
S[4]=()=>{
  bgEl.style.background='linear-gradient(#ffe2c8,#fff1e2 55%,#fff8f0)';
  const r=rng(1401);
  const scene=new THREE.Scene();addLights(scene,{hemi:1.7,dir:1.2,dpos:[4,9,9]});room(scene,{floor:0xe0c4a4,wall:0xe8f0ff});
  const rug=new THREE.Mesh(new THREE.CircleGeometry(1.4,24),lamb(0xffd0e4));rug.rotation.x=-Math.PI/2;rug.position.set(-0.4,0.01,-0.1);scene.add(rug);
  const cush=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.18,0.7),lamb(0xff9fcf));cush.position.set(-0.4,0.09,-0.1);scene.add(cush);
  plant(scene,-2.2,-1.2,1.1);
  const bedG=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.5,1.0),lamb(0xc9d4ff));bedG.position.set(1.9,0.25,-1.1);scene.add(bedG);
  const E=mkE();E.position.set(-0.4,0,-0.1);sitPose(E);E.userData.hip.position.y=0.42;E.userData.legs.forEach(l=>l.rotation.x=-1.4);scene.add(E);
  const J=mkJ();scene.add(J);
  const stack=new THREE.Group();for(let i=0;i<3;i++){const pg=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.56,0.01),lamb(0xffffff));pg.position.set(i*0.02,-i*0.02,-i*0.012);stack.add(pg)}
  const tx=signPlane('사과문',0.36,0.12,{bg:'#fff',fg:'#222',r:2,fs:40,line:'#fff'});tx.position.set(0,0.18,0.008);stack.add(tx);
  scene.add(stack);
  const hmph=bE('흥!',{fs:80,size:0.0034});hmph.position.set(-0.35,1.75,0.1);scene.add(hmph);
  const dots=bE('…',{fs:80,size:0.0034});dots.position.set(-0.3,1.75,0.1);scene.add(dots);
  const lol=bE('ㅋㅋㅋㅋ 이게 뭐야',{fs:66,size:0.003});lol.position.set(-0.1,1.85,0.2);scene.add(lol);
  const sorry=bJ('…사과문입니다.',{fs:60,size:0.0029});sorry.position.set(0.45,2.4,0.2);scene.add(sorry);
  const hs=sprinkleHearts(scene,8,r,{x:0.0,w:1.6,z:0.3,size:0.003});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const paper=el(`<div style="position:absolute;inset:0;pointer-events:none"><div class="paper back" style="transform:translate(34px,-24px) rotate(4deg)"></div><div class="paper back" style="transform:translate(18px,-12px) rotate(2deg)"></div>
   <div class="paper" id="pp"><h1>사 과 문</h1><div class="sub">작성자: INTJ · 총 3장</div>
   <div class="ln" id="l1">1. 원인 분석</div><div class="bars" id="bb"><div style="height:40%"></div><div style="height:65%"></div><div style="height:100%;background:#ff5a7a"></div></div>
   <div class="ln" id="l2">2. 내 잘못 3가지</div><div class="tx" id="t2">· 답장 늦음 · 말투가 딱딱함 · 기념일 착각</div>
   <div class="ln" id="l3">3. 재발 방지 대책</div><div class="tx" id="t3">· 기념일 캘린더 등록 완료 ✔<br>· 답장 30분 이내 원칙</div><div class="pg">1 / 3</div></div></div>`);
  const pp=paper.querySelector('#pp');const parts=['#l1','#bb','#l2','#t2','#l3','#t3'].map(s=>paper.querySelector(s));
  const bars=[...paper.querySelectorAll('#bb div')];
  const ch=chip('',230);ch.style.fontSize='52px';
  const IN=0.3,HAND=2.6,PA=capAt(4,1)-0.15,PB=capAt(4,2)-0.1,TW=PB+0.5,LOL=capAt(4,3)+0.05;
  return t=>{
    // ENFP 등 돌리고 삐짐 → 종이 받음 → 웃음
    const eu=E.userData;
    E.rotation.y=t<HAND?0.9:0.9-ease((t-HAND)/0.4)*1.3;
    eFace(E,t<LOL?(t<TW?'puff':'frown'):'smile');
    eu.arms.forEach((a,i)=>{a.rotation.x=t<HAND+0.3?-0.3:-1.25;a.rotation.z=t<HAND+0.3?(i?-0.5:0.5):(i?-0.15:0.15)});
    if(t>LOL){eu.hip.position.y=0.42+Math.abs(Math.sin((t-LOL)*12))*0.05;eyesClose(E,0.7)}else{eyesClose(E,0)}
    eu.head.rotation.x=t>TW&&t<LOL?0.25:0;eu.head.rotation.z=t>TW&&t<LOL?Math.sin(t*20)*0.03:0;
    scaleBubble(hmph,pop((t-0.3)/0.22)*(1-ease((t-HAND)/0.2)));
    scaleBubble(dots,pop((t-TW)/0.22)*(1-ease((t-LOL+0.15)/0.2)));
    scaleBubble(lol,pop((t-LOL)/0.22));
    // INTJ 걸어 들어와 종이 내밂
    const wk=ease((t-IN)/2.0);J.position.set(2.6-wk*1.95,0,0.35);J.rotation.y=t<IN+2.0?-Math.PI/2:-Math.PI/2+ease((t-IN-2.0)/0.3)*0.65;
    const ju=J.userData;if(t<IN+2.0&&t>IN)walkPose(J,t*7,0.4);else standPose(J);
    ju.arms.forEach(a=>{a.rotation.x=t<HAND?-0.9:-1.3});ju.hip.rotation.x=t>HAND&&t<HAND+1.0?0.25:0;blush(J,t>LOL+0.5);
    scaleBubble(sorry,pop((t-HAND+0.4)/0.22)*(1-ease((t-PA)/0.2)));
    // 종이 위치: INTJ 손 → ENFP 손
    const hand=new THREE.Vector3();
    if(t<HAND+0.25){J.updateMatrixWorld(true);ju.arms[1].children[1].getWorldPosition(hand);stack.position.set(hand.x-0.12,hand.y+0.2,hand.z+0.12);stack.rotation.set(-0.2,-0.6,0)}
    else{E.updateMatrixWorld(true);eu.arms[1].children[1].getWorldPosition(hand);stack.position.set(hand.x+0.12,hand.y+0.08,hand.z+0.18);stack.rotation.set(-0.6,E.rotation.y,0)}
    stack.visible=t>IN;
    // DOM 사과문
    paper.style.display=t>PA&&t<PB+0.4?'block':'none';
    if(t>PA){const k=pop((t-PA)/0.3),o=ease((t-PB)/0.35);paper.style.transform=`translateY(${o*900}px) scale(${0.6+0.4*k})`;paper.style.opacity=clamp01((t-PA)/0.1)*(1-o)}
    const lt=t-PA;parts.forEach((p,i)=>{const s=0.25+i*0.3;p.style.opacity=clamp01((lt-s)/0.1);p.style.transform=`scale(${0.9+0.1*pop((lt-s)/0.2)})`});
    bars.forEach((b,i)=>b.style.transform=`scaleY(${ease((lt-0.6-i*0.12)/0.3)})`),bars.forEach(b=>b.style.transformOrigin='50% 100%');
    if(t<PB+0.2)ch.style.opacity=0;else{ch.textContent=t<LOL+0.3?'사과문 3장 · 정독 중':'사과문 3장 · 화 풀리는 데 10초';chipPop(ch,t<LOL+0.3?t-PB-0.2:t-LOL-0.3,0)}
    updHearts(hs,t,LOL+0.4,1.7,1.5);
    cam.position.set(0.25,2.0,6.1-t*0.08);cam.lookAt(0.25,1.55,-0.1);
    caption(4,t);renderer.render(scene,cam);
  };
};

// ---------- S5: 카톡 47개 → "ㅇㅇ" → 몰래 본 알림 설정: ENFP만 켜짐 ----------
S[5]=()=>{
  const r=rng(1501);
  const scene=new THREE.Scene();addLights(scene,{hemi:1.65,dir:1.15,dpos:[4,9,8]});room(scene,{floor:0xd6bfa4,wall:0xdff0ea,wz:-2.0});
  sofa(scene,0,-1.1,0x9cc9ff,2.6);
  const cnt=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.95,0.6),lamb(0xffffff));cnt.position.set(2.6,0.47,-1.6);scene.add(cnt);
  const J=mkJ();J.position.set(2.6,0,-1.0);J.rotation.y=Math.PI;scene.add(J);
  const ph=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.03,0.32),lamb(0x22222a));scene.add(ph);
  const glow=glowSprite('rgba(180,220,255,1)',0.9);scene.add(glow);
  const E=mkE();scene.add(E);
  const wow=bE('…!!',{fs:84,size:0.0032});scene.add(wow);
  const hs=sprinkleHearts(scene,8,r,{x:-0.2,w:1.4,z:0.2,size:0.003});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const MS=[['ㅋㅋㅋㅋㅋㅋ'],['점심 뭐 먹었어?'],['pic','#ffd9a8'],['이거 봐 고양이!!'],['pic','#d8d0c8'],['너무 귀엽지 ㅠㅠ'],['뭐해??'],['바빠?'],['나 지금 버스!'],['옆 사람 코 골아 ㅋㅋㅋ'],['보고 싶다~'],['답장해!!!']];
  const kp=el(`<div class="kphone" style="top:300px;height:900px"><div class="kscr"><div class="khd">INTJ</div><div class="kms"></div></div></div>`);
  const kms=kp.querySelector('.kms');
  const rowsK=MS.map(m=>{const d=document.createElement('div');d.className='krw me';d.innerHTML=m[0]==='pic'?`<div class="kpic" style="background:${m[1]}"></div>`:`<div class="kb">${m[0]}</div>`;kms.appendChild(d);return d});
  const rep=document.createElement('div');rep.className='krw';rep.innerHTML=`<div class="kav" style="background:${C_J}"></div><div class="kb kbig">ㅇㅇ</div>`;kms.appendChild(rep);
  const thought=el(`<div class="clock" style="top:200px;background:#ffe0f0;color:#8a1f5a;font-size:50px">(…나 사랑하긴 하나)</div>`);
  const sp=el(`<div class="kphone" style="top:300px;height:900px"><div class="kscr white"><div class="khd" style="background:#fff;border-bottom:2px solid #e6e6ee">알림 설정</div><div id="sl"></div></div></div>`);
  const SR=[['가족방','#ffd9a8',0],['회사 팀방','#c9d4e8',0],['동기 단톡','#d9fbe9',0],['동아리','#ece2ff',0],['친구들','#fff4c2',0],['동네 모임','#d6ecff',0],['ENFP ♥',C_E,1]];
  const sl=sp.querySelector('#sl');const rowsS=SR.map(([n,c,on])=>{const d=document.createElement('div');d.className='setrow'+(on?' hi':'');d.style.height='104px';d.innerHTML=`<span class="nm"><span class="ic" style="background:${c}"></span>${n}</span><span class="tg${on?' on':''}"></span>`;sl.appendChild(d);return d});
  const ch=chip('',200);ch.style.fontSize='52px';
  const REP=capAt(5,1)+0.1,TH=REP+1.1,C3=capAt(5,2)-0.1,SET=C3+1.5,ON=capAt(5,3)+0.05,BACK=ON+1.75;
  return t=>{
    const chat=t<C3,setv=t>=SET&&t<BACK;
    kp.style.display=chat?'block':'none';sp.style.display=setv?'block':'none';thought.style.display=chat&&t>TH?'block':'none';
    if(chat||setv)renderer.clear();
    if(chat){bgEl.style.background='linear-gradient(#ffd0e4,#ffe6f0 55%,#fff4f8)';
      popEl(kp,t,0.05);
      rowsK.forEach((rw,i)=>{const s=0.25+i*0.2;rw.style.display=t>s?'flex':'none';rw.style.transform=`scale(${pop((t-s)/0.18)})`});
      rep.style.display=t>REP?'flex':'none';rep.style.transform=`scale(${pop((t-REP)/0.25)})`;
      popEl(thought,t,TH,'translateX(-50%) ');
      const n=Math.min(47,Math.max(1,Math.round(47*ease((t-0.25)/2.5))));ch.textContent=`오늘 보낸 카톡 ${n}개`;chipPop(ch,t,0.1);if(t>TH-0.1)ch.style.opacity=0;
      caption(5,t);return;}
    if(setv){bgEl.style.background='linear-gradient(#ffd0e4,#ffe6f0 55%,#fff4f8)';
      popEl(sp,t,SET);
      rowsS.forEach((rw,i)=>{const s=i<6?SET+0.25+i*0.22:ON;rw.style.opacity=clamp01((t-s)/0.1);rw.style.transform=`translateX(${(1-ease((t-s)/0.25))*-120}px)`});
      const hi=rowsS[6];hi.style.boxShadow=t>ON?`inset 0 0 0 ${6+4*Math.sin(t*10)}px #ff8fc8`:'none';
      if(t<ON+0.3)ch.style.opacity=0;else{ch.textContent='알림 켜진 사람: 1명';chipPop(ch,t,ON+0.3)}
      caption(5,t);return;}
    // 3D: 소파 위 폰 → 몰래 집어 봄 / 마지막 반응
    bgEl.style.background='linear-gradient(#cfe9ff,#e6f4ff 55%,#f4faff)';
    const eu=E.userData;
    if(t<SET){const lt=t-C3;ch.style.opacity=0;
      const k=ease(lt/1.0);E.position.set(-1.6+k*1.2,0,0.4);E.rotation.y=Math.PI/2-k*0.9;
      if(lt<1.0){walkPose(E,t*5,0.3)}else standPose(E);
      eu.hip.rotation.x=0.25;eu.head.rotation.x=0.2;eu.arms.forEach(a=>a.rotation.x=-0.6);
      ph.position.set(0.1,0.56,-0.9);ph.rotation.set(0,0.3,0);glow.position.set(0.1,0.62,-0.9);glow.visible=true;
      if(lt>1.1){eu.arms[1].rotation.x=-0.6-ease((lt-1.1)/0.3)*0.6}
      scaleBubble(wow,0);
      J.userData.arms.forEach((a,i)=>a.rotation.x=-1.2+Math.sin(t*10+i*2)*0.25);
      cam.position.set(0.2,1.8,3.8);cam.lookAt(-0.2,1.0,-0.6);
    }else{const lt=t-BACK;
      E.position.set(-0.2,0,0.4);E.rotation.y=0.25;standPose(E);eu.hip.rotation.x=0;eu.head.rotation.x=0;
      eu.arms[1].rotation.x=-1.4;eu.arms[0].rotation.x=-1.2;eu.hip.position.y=0.8+hop(lt,0.3,0.6,0.15);
      ph.visible=false;glow.visible=false;
      if(!eu.ph){eu.ph=holdObj(E,1,phoneMesh(),-0.62,0.1)}
      wow.position.set(-0.2,1.75,0.6);scaleBubble(wow,pop(lt/0.22));
      ch.textContent='알림 켜진 사람: 1명';ch.style.opacity=1;ch.style.transform='translateX(-50%) scale(1)';
      updHearts(hs,t,BACK+0.2,1.6,1.6);
      cam.position.set(0.0,1.75,3.6-lt*0.15);cam.lookAt(-0.15,1.45,0);
    }
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6: 새벽 통화 위아래 분할 → "강아지 이름 뭐로 해~?" → '우리 10년 계획.xlsx' ----------
S[6]=()=>{
  const r=rng(1601);
  bgEl.style.background='linear-gradient(#0e1230,#232a62 60%,#3a3a78)';
  // 위: ENFP 침대(엎드려서 통화) / 아래: INTJ 책상(노트북)
  const sT=new THREE.Scene();addLights(sT,{sky:0xffc8e0,ground:0x302040,hemi:1.15,dir:0.75,sun:0xffd8e8,dpos:[3,8,6]});
  room(sT,{floor:0x6a5a88,wall:0x5a4a8a,wz:-1.6});stars(sT,40,r,{y0:2.4,h:1.2,z:-1.45,w:3,size:0.05});
  const winT=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.0),basic(0x1a2050));winT.position.set(1.2,2.2,-1.48);sT.add(winT);
  const bedT=new THREE.Group();const fr=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.4,1.7),lamb(0xa88a6a));fr.position.y=0.2;bedT.add(fr);
  const mt=new THREE.Mesh(new THREE.BoxGeometry(2.36,0.18,1.66),lamb(0xfff4fa));mt.position.y=0.49;bedT.add(mt);bedT.position.set(0,0,-0.6);sT.add(bedT);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.16,0.45),lamb(0xffffff));pil.position.set(-0.3,0.66,-0.1);sT.add(pil);
  const E=mkE();E.rotation.x=Math.PI/2;E.position.set(-0.3,0.62,-0.75);sT.add(E);E.userData.head.rotation.x=-1.05;
  holdObj(E,0,phoneMesh(),-0.6,0.05);
  const blanket=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,14),lamb(0xffb8d8));blanket.scale.set(1.25,0.55,1.3);blanket.position.set(-0.3,0.72,-0.35);blanket.visible=false;sT.add(blanket);
  const eq=bE('우리 나중에 강아지 이름 뭐로 해~?',{fs:56,size:0.0019});eq.position.set(-0.15,1.35,-0.2);sT.add(eq);
  const hs=sprinkleHearts(sT,8,r,{x:-0.3,w:1.4,z:-0.2,size:0.0026});
  const camT=new THREE.PerspectiveCamera(46,W/(H/2),0.1,100);
  const sBt=new THREE.Scene();addLights(sBt,{sky:0xa8b0ff,ground:0x202040,hemi:1.1,dir:0.6,sun:0xe0e4ff});
  room(sBt,{floor:0x4a4868,wall:0x323866,wz:-1.5});desk(sBt,0,-0.8,2.0);
  const lap=new THREE.Group();const lb=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.04,0.48),lamb(0xb0b4c0));lap.add(lb);
  const ls=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.46,0.03),lamb(0xb0b4c0));ls.position.set(0,0.23,-0.24);ls.rotation.x=-0.25;lap.add(ls);
  const lscr=new THREE.Mesh(new THREE.PlaneGeometry(0.64,0.4),basic(0x9fe0b8));lscr.position.set(0,0.23,-0.22);lscr.rotation.x=-0.25;lap.add(lscr);
  lap.position.set(0,1.01,-0.75);sBt.add(lap);
  const lg=glowSprite('rgba(160,240,190,1)',1.6);lg.position.set(0,1.3,-0.95);sBt.add(lg);
  const J=mkJ();J.position.set(0,0,0.05);J.rotation.y=Math.PI;sitPose(J);sBt.add(J);stool(sBt,0,0.05,0x5a5f88,0.5);
  holdObj(J,0,phoneMesh(),-0.62,0.1);
  const jw=bJ('잠깐만.',{fs:60,size:0.003});jw.position.set(0.55,2.05,0.1);sBt.add(jw);
  const camB=new THREE.PerspectiveCamera(46,W/(H/2),0.1,100);
  const div=el(`<div style="position:absolute;left:0;right:0;top:956px;height:8px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.4)"></div>`);
  const sheet=el(`<div class="sheet"><div class="sh">▦ 우리 10년 계획.xlsx</div><table>
    <tr class="hd"><td>연도</td><td>계획</td></tr>
    <tr><td class="y">2027</td><td>1주년 여행 (예약 ✔)</td></tr>
    <tr><td class="y">2028</td><td>같이 살 동네 정하기</td></tr>
    <tr><td class="y">2029</td><td>같이 살기</td></tr>
    <tr id="dog"><td class="y">2030</td><td>강아지 입양<br><span style="font-size:30px;color:#777">이름 후보:</span> <span class="nm">콩이</span> <span class="nm">두부</span> <span class="nm">감자</span></td></tr>
    <tr><td class="y">2032</td><td>ENFP 즉흥 여행용 예산</td></tr>
    <tr><td class="y">2035</td><td>…</td></tr></table></div>`);
  const trs=[...sheet.querySelectorAll('tr')];const dog=sheet.querySelector('#dog');const nms=[...sheet.querySelectorAll('.nm')];
  const ch=chip('',200);ch.style.fontSize='50px';
  const Q=0.3,SH=capAt(6,1)-0.05,DG=capAt(6,2)-0.05,KICK=DG+1.0;
  return t=>{
    const hd=H/2;
    // 위
    const eu=E.userData;const kick=t>KICK;
    eu.legs.forEach((l,i)=>l.rotation.x=kick?1.3+Math.sin(t*16+i*Math.PI)*0.6:1.0+Math.sin(t*3+i*Math.PI)*0.25);
    blanket.visible=kick;blanket.position.y=0.78+(kick?Math.abs(Math.sin(t*12))*0.05:0);eu.head.visible=!kick;
    eu.arms[0].rotation.x=-2.4;
    scaleBubble(eq,pop((t-Q)/0.25)*(1-ease((t-SH+0.2)/0.25)));updHearts(hs,t,KICK+0.1,0.9,1.0);
    camT.position.set(0.1,1.75,2.6);camT.lookAt(-0.15,1.1,-0.4);
    // 아래
    const ju=J.userData;ju.arms[1].rotation.x=-1.25+(t>SH-0.8&&t<SH?Math.sin(t*18)*0.15:0);ju.arms[0].rotation.x=-2.6;ju.arms[0].rotation.z=-0.3;
    scaleBubble(jw,pop((t-SH+0.9)/0.22)*(1-ease((t-SH)/0.2)));
    camB.position.set(1.0,2.0,2.4);camB.lookAt(0,1.35,-0.6);
    renderer.setScissorTest(true);
    renderer.setViewport(0,hd,W,hd);renderer.setScissor(0,hd,W,hd);renderer.render(sT,camT);
    renderer.setViewport(0,0,W,hd);renderer.setScissor(0,0,W,hd);renderer.render(sBt,camB);
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);
    // 엑셀
    const sv=t>SH&&t<KICK;sheet.style.display=sv?'block':'none';
    if(sv){const k=pop((t-SH)/0.3),o=ease((t-KICK+0.3)/0.3);sheet.style.transform=`scale(${k}) translateY(${o*-1200}px)`;
      trs.forEach((tr,i)=>{const s=SH+0.15+i*0.2;tr.style.opacity=clamp01((t-s)/0.1)});
      dog.className=t>DG?'hi':'';nms.forEach((n,i)=>n.style.transform=`scale(${t>DG?1+0.25*Math.max(0,1-pop((t-DG-i*0.12)/0.25)*0+Math.sin(clamp01((t-DG-i*0.12)/0.3)*Math.PI)):1})`);}
    ch.textContent=t<KICK?'AM 1:00 · 통화 중':'즉흥 질문 1개 · 계획 10년치';chipPop(ch,t<KICK?t:t-KICK,0.05);
    div.style.opacity=1;
    caption(6,t);
  };
};

// ---------- S7: 질문 장면 — 밤바다(2번의 바다) ----------
S[7]=()=>{
  bgEl.style.background='linear-gradient(#121735,#28306a 60%,#3e3f7a)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x2a3068,16,45);addLights(scene,{sky:0x9aa8ff,ground:0x202040,hemi:1.15,dir:0.6,sun:0xd0d8ff});
  const r=rng(1701);stars(scene,220,r,{y0:5,h:22,z:-24,w:60});
  const moon=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),basic(0xfff0c0));moon.position.set(-3.2,8.5,-22);scene.add(moon);
  const mg=glowSprite('rgba(255,240,190,1)',6);mg.position.copy(moon.position);scene.add(mg);
  const sand=new THREE.Mesh(new THREE.PlaneGeometry(80,12),lamb(0xbfae8a));sand.rotation.x=-Math.PI/2;sand.position.set(0,0,2);scene.add(sand);
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(80,60),lamb(0x2f4f8f));sea.rotation.x=-Math.PI/2;sea.position.set(0,-0.02,-26);scene.add(sea);
  const foam=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(80,0.12),basic(0xd8e8ff));f.rotation.x=-Math.PI/2;scene.add(f);foam.push(f)}
  const refl=new THREE.Mesh(new THREE.PlaneGeometry(0.9,14),new THREE.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:0.35}));refl.rotation.x=-Math.PI/2;refl.position.set(-2.2,0.0,-12);scene.add(refl);
  const E=mkE();E.position.set(-0.55,0,0.4);E.rotation.y=0.15;scene.add(E);
  const J=mkJ();J.position.set(0.55,0,0.4);J.rotation.y=-0.15;scene.add(J);
  const hb=makeBubble('♥',{bg:'#ffe0f0',fg:'#e2557a',fs:80,size:0.0036});hb.position.set(0,1.62,0.4);scene.add(hb);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out" style="font-size:96px">여러분 주변의<br><span style="color:${C_J}">INTJ</span>×<span style="color:${C_E}">ENFP</span> 커플은<br>어떤가요?</div><div class="end2 out" style="top:850px">댓글에 태그해 주세요!</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2');
  const T2=LEAD+3.78;
  return t=>{
    foam.forEach((f,i)=>{const k=((t*0.25+i/3)%1);f.position.set(0,0.01,-1.5-k*6);f.material.opacity=1-k;f.material.transparent=true});
    armUp(E,1,1);E.userData.arms[1].rotation.z=2.6+Math.sin(t*9)*0.35;E.userData.hip.position.y=0.8+Math.abs(Math.sin(t*6))*0.06;
    armUp(J,1,1);J.userData.arms[1].rotation.z=2.5-Math.sin(t*5)*0.25;blush(J,true);
    scaleBubble(hb,pop((t-0.4)/0.25));
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    e2.style.transform=`scale(${pop((t-T2)/0.3)})`;e2.style.opacity=clamp01((t-T2)/0.1);
    cam.position.set(0,1.6,6.2-t*0.15);cam.lookAt(0,2.4,0);
    renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';bgEl.style.background='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
