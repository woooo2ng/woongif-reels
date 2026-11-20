// ===== 13. 강아지의 눈빛 → 밥그릇 세척 =====
S[13]=()=>{const L=TMK[13].lines.n10;const tB=L[0]-0.1;
  const sA=new THREE.Scene();lights(sA,'day');const {dg}=woongRoom(sA,{winSky:['#ffcf9e','#ffe9d0']});dg.rotation.y=0.25;
  const wg=woong();wg.position.set(-0.4,0,2.6);wg.rotation.y=Math.PI*0.9;sA.add(wg);
  const bd=new THREE.Group();dg.add(bd);const dots=makeBubble('…',{bg:'#ffffff',fs:70,size:0.0022});dots.position.set(0,0.95,0.3);dg.add(dots);
  // B: 싱크대
  const sB=new THREE.Scene();lights(sB,'day');roomBox(sB,{wall:0xe9f0ee,wall2:0xdfe8e5,floor:0xc9b89a});
  for(let i=0;i<8;i++)for(let j=0;j<5;j++){const tl=new THREE.Mesh(new THREE.PlaneGeometry(0.58,0.58),lamb((i+j)%2?0xffffff:0xeef6f4));tl.position.set(-2.1+i*0.6,1.9+j*0.6,-3.88);sB.add(tl)}
  const cab=new THREE.Mesh(new THREE.BoxGeometry(5,1.6,1.2),lamb(0xf4efe6));cab.position.set(0,0.8,-3.2);sB.add(cab);
  const ctop=new THREE.Mesh(new THREE.BoxGeometry(5.1,0.1,1.3),lamb(0x9aa3ad));ctop.position.set(0,1.65,-3.2);sB.add(ctop);
  const sink=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.12,0.8),lamb(0x6f7680));sink.position.set(0,1.66,-3.1);sB.add(sink);
  const tap=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.6,8),lamb(0xcfd4da));tap.position.set(0,2.0,-3.6);sB.add(tap);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.4,8),new THREE.MeshBasicMaterial({color:0x9fd8ff,transparent:true,opacity:0.7}));water.position.set(0,1.95,-3.35);sB.add(water);
  const wg2=woong();wg2.position.set(0,0,-2.1);wg2.rotation.y=Math.PI;sB.add(wg2);setFace(wg2,'flat');
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.14,0.12,20),lamb(0xe2553f));wg2.userData.arms[0].add(bowl);bowl.position.set(0,-0.66,0.1);
  const sp=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.08,0.1),lamb(0xffd84d));wg2.userData.arms[1].add(sp);sp.position.set(0,-0.66,0.08);
  const dg2=dog({collar:true});dg2.position.set(1.3,0,-1.6);dg2.rotation.y=-0.9;sB.add(dg2);
  const bubbles=[];const r=rng(31);for(let i=0;i<22;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.05+r()*0.07,12,10),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.85}));b.userData={x:(r()-0.5)*1.2,ph:r()*3,v:0.3+r()*0.5};sB.add(b);bubbles.push(b)}
  const spark=sprinkle(sB,r,10,[0,2.2,-2.6,2.0,1.4],0xffe066);spark.forEach(s=>{s.material.map=textSprite('✦',90,'#ffe066',0.004).material.map});
  const ch=chip('밥그릇 세척 · 태어나서 처음');ch.style.top='120px';
  const c=vcam(40),c2=vcam(46);
  return t=>{if(t<tB){sky(SKY.day);ch.style.opacity=0;const k=ease(t/1.4);look(c,[1.4-k*0.4,1.4,4.6-k*1.2],[1.1,0.75,0.6]);dg.userData.head.rotation.x=-0.35;dg.userData.head.rotation.y=0.15;
      scaleBubble(dots,pop((t-0.5)/0.3));renderer.render(sA,c)}
    else{sky('#e9f0ee');popEl(ch,t,tB+0.4);const k=t-tB;wg2.userData.arms[0].rotation.x=-1.1;wg2.userData.arms[1].rotation.x=-1.1+Math.sin(k*14)*0.25;wg2.userData.arms[1].rotation.z=Math.sin(k*14)*0.2;
      bowl.rotation.y=k*2;bubbles.forEach((b,i)=>{const y=(k*b.userData.v+b.userData.ph)%1.4;b.position.set(b.userData.x+Math.sin(k*2+i)*0.1,1.75+y,-2.85);b.scale.setScalar(clamp01(1.4-y))});
      updSprinkle(spark,t,tB+0.8);dogWag(dg2,t);dg2.userData.head.rotation.x=-0.3;
      look(c2,[1.6,2.9,4.6-k*0.2],[0,1.7,-2.4]);renderer.render(sB,c2)}
    caption(13,t)}};

// ===== 14. 엄마, 할머니의 다음 생 조회 =====
S[14]=()=>{sky('linear-gradient(#5b5e9e,#e98a7f 60%,#ffc58c)');const scene=new THREE.Scene();lights(scene,'dusk');
  roomBox(scene,{wall:0xeadccb,wall2:0xdccab4,floor:0xb88a5e});
  const sofa=new THREE.Group();const sb=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.55,1.2),lamb(0x8c9fc0));sb.position.y=0.4;sofa.add(sb);
  const sbk=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.0,0.3),lamb(0x7d90b0));sbk.position.set(0,0.95,-0.5);sofa.add(sbk);
  for(const s of[-1,1]){const ar=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.8,1.2),lamb(0x7d90b0));ar.position.set(s*1.75,0.6,0);sofa.add(ar)}sofa.position.set(0,0,-1.5);scene.add(sofa);
  const lamp=new THREE.Group();const lp=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,2,8),lamb(0x555555));lp.position.y=1;lamp.add(lp);
  const sh=new THREE.Mesh(new THREE.ConeGeometry(0.4,0.5,16,1,true),new THREE.MeshBasicMaterial({color:0xffe0a0,side:THREE.DoubleSide}));sh.position.y=2.1;lamp.add(sh);lamp.position.set(2.4,0,-1.8);scene.add(lamp);
  const gw=glowSprite('rgba(255,220,150,1)',3);gw.position.set(2.4,2.1,-1.7);gw.material.opacity=0.5;scene.add(gw);
  const frame=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.2),new THREE.MeshBasicMaterial({map:canvasTex(200,240,(x,w,h)=>{x.fillStyle='#8a6a4a';x.fillRect(0,0,w,h);x.fillStyle='#f3ead8';x.fillRect(14,14,w-28,h-28);
    x.fillStyle='#d9c4a8';x.beginPath();x.arc(w/2,h*0.42,40,0,7);x.fill();x.fillStyle='#bbb';x.beginPath();x.arc(w/2,h*0.36,42,Math.PI,0);x.fill();x.fillStyle='#c9a0a0';x.fillRect(w/2-50,h*0.6,100,60)})}));frame.position.set(-1.6,3.3,-3.85);scene.add(frame);
  const mom=girl(71,{shirt:0xc7a3c9,pants:0x55506a,bun:true,hair:0x4a3426});mom.position.set(0.2,0,-1.3);sitPose(mom);mom.userData.hip.position.y=0.62;scene.add(mom);holdPhone(mom,1,1.2);mom.userData.head.rotation.x=0.3;
  const L=TMK[14].lines.n11;const t2=L[0]+2.715;
  const card=div('box',`<div style="font-size:34px;color:#7b5cff">전생24 · 다음 생 조회</div><div style="font-size:52px;margin:16px 0 8px">조회 대상: 할머니</div>
    <div class="ld" style="font-size:38px;color:#999">조회 중…</div><div class="rs" style="display:none"><div style="font-size:46px;color:#2fae66">다음 생 확인됨 ✔</div>
    <div style="font-size:40px;color:#555;margin-top:10px">현재 7세 · 같은 아파트 놀이터 자주 감</div></div>`);
  card.style.cssText+='left:110px;top:250px;width:860px;padding:38px 30px;box-sizing:border-box;text-align:center';const ld=card.querySelector('.ld'),rs=card.querySelector('.rs');
  const c=vcam(46);
  return t=>{look(c,[0.6,2.8,7.6-t*0.15],[0,1.4,-1.2]);popIn(card,t,0.3,'',0.3);
    ld.style.display=t<t2+0.2?'':'none';rs.style.display=t>=t2+0.2?'':'none';ld.textContent='조회 중'+'.'.repeat(1+Math.floor(t*3)%3);
    mom.userData.head.rotation.x=t>t2+0.4?0.05:0.3;setFace(mom,t>t2+0.4?'open':'smile');renderer.render(scene,c);
    caption(14,t)}};

// ===== 15. 놀이터: 밥은 먹고 다니니? =====
S[15]=()=>{sky('linear-gradient(#6a7fb8,#f2a77a 55%,#ffd99a)');const scene=new THREE.Scene();lights(scene,'dusk');ground(scene,0xc9b48a);
  const sand=new THREE.Mesh(new THREE.CylinderGeometry(4,4,0.05,30),lamb(0xe9d2a0));sand.position.set(0,0.02,-1);scene.add(sand);
  const sl=new THREE.Group();const st=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.2,1.2),lamb(0xff8f6b));st.position.y=1.1;sl.add(st);
  const ramp=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.12,3.2),lamb(0xffd84d));ramp.position.set(0,1.1,1.8);ramp.rotation.x=0.65;sl.add(ramp);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(1.0,0.8,4),lamb(0x5ab0ff));roof.position.y=2.6;roof.rotation.y=Math.PI/4;sl.add(roof);sl.position.set(-3.2,0,-3.4);sl.rotation.y=0.6;scene.add(sl);
  const sw=new THREE.Group();for(const x of[-1.4,1.4]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,2.6,8),lamb(0x5ab0ff));p.position.set(x,1.3,0);sw.add(p)}
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,2.9,8),lamb(0x5ab0ff));bar.rotation.z=Math.PI/2;bar.position.y=2.6;sw.add(bar);
  const swing=[];for(const x of[-0.6,0.6]){const g=new THREE.Group();g.position.set(x,2.6,0);for(const s of[-1,1]){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.02,1.9,0.02),lamb(0x777777));ch.position.set(s*0.2,-0.95,0);g.add(ch)}
    const se=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.06,0.25),lamb(0xe2553f));se.position.y=-1.9;g.add(se);sw.add(g);swing.push(g)}sw.position.set(3.0,0,-4);sw.rotation.y=-0.4;scene.add(sw);
  const r=rng(15);for(let i=0;i<5;i++){const b=makeBuilding(r,6,14+r()*8,6,{lit:0.35});b.position.set(-14+i*7,b.position.y,-14);scene.add(b)}
  tree(scene,-5.2,-1,1.4,0xd99a4a);tree(scene,5.4,-0.5,1.3,0xe0b04a);
  const wg=woong();wg.position.set(0.55,0,0);wg.rotation.y=-0.55;scene.add(wg);
  const kd=kid(81,{girl:true,shirt:0xffe066,pants:0xff9ec4});kd.position.set(-0.5,0,0.5);kd.rotation.y=2.3;scene.add(kd);kd.userData.head.rotation.x=-0.35;
  const L=TMK[15].lines;const ty=L.y01[0],tn=L.n12[0];
  const bk=bub(kd,'밥은 먹고 다니니?',{bg:'#fff3d6',fs:62,size:0.0042,y:3.6});
  const leaves=[];for(let i=0;i<16;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.1),new THREE.MeshBasicMaterial({color:[0xe0a04a,0xd9783a,0xf2c94a][i%3],side:THREE.DoubleSide}));l.userData={x:(r()-0.5)*7,z:-1+(r()-0.5)*4,ph:r()*10,v:0.4+r()*0.3};scene.add(l);leaves.push(l)}
  const c=vcam(44);
  return t=>{look(c,[-0.9,1.9,7.4-t*0.18],[-0.05,1.65,0]);
    scaleBubble(bk,t>ty-0.1?pop((t-ty+0.1)/0.35):0);
    setFace(wg,t>ty+1.9&&t<tn?'open':'flat');wg.userData.head.rotation.x=t>tn+0.2?Math.max(0,Math.sin((t-tn-0.2)*5))*0.35*(t<tn+2.0?1:0):-0.15;
    swing.forEach((g,i)=>g.rotation.x=Math.sin(t*1.6+i)*0.18);
    leaves.forEach(l=>{const y=4-((t*l.userData.v+l.userData.ph)%4.2);l.position.set(l.userData.x+Math.sin(t+l.userData.ph)*0.4,y,l.userData.z);l.rotation.set(t*2+l.userData.ph,t,0)});
    caption(15,t);renderer.render(scene,c)}};

// ===== 16. 새 기능: 다음 생 미리보기 =====
function nightRoomScene(){const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0x6a6aa0,0.5));
  const {R,dg}=woongRoom(scene,{winSky:['#0b1030','#2a2f5e'],winLit:true,screenOff:true});
  const wg=woong();wg.position.set(-3.6,0,-2.4);wg.rotation.x=-Math.PI/2;wg.position.y=1.15;wg.rotation.z=0;scene.add(wg);holdPhone(wg,1,2.6);
  const gl=glowSprite('rgba(180,150,255,1)',2.2);gl.position.set(-3.5,1.9,-2.0);gl.material.opacity=0.6;scene.add(gl);return scene}
S[16]=()=>{sky(SKY.night);const scene=nightRoomScene();const c=vcam(46);
  const L=TMK[16].lines.n13;const tN=L[0]+3.806;
  const {ph,sc}=phoneUI(`<div class="head app">전생24</div><div style="padding:30px 36px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
    ${[['내 전생 조회','#efe9ff'],['전생 궁합','#ffe6ef'],['전생 집 찾기','#e6f4ff'],['떠난 사람 다음 생','#fff4dc']].map(([a,b])=>`<div style="height:190px;border-radius:30px;background:${b};display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;color:#444;text-align:center;padding:0 16px">${a}</div>`).join('')}</div>
    <div class="nw" style="margin:6px 36px;height:230px;border-radius:34px;background:linear-gradient(135deg,#7b5cff,#ff8fc8);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:900;box-shadow:0 0 0 8px rgba(255,216,77,.9)">
    <div style="font-size:32px;background:#ffd84d;color:#2a2100;padding:4px 18px;border-radius:12px">NEW</div><div style="font-size:66px;margin-top:10px">다음 생 미리보기</div></div>`,{time:'AM 1:12'});
  const nw=sc.querySelector('.nw');const noti=div('box','<div style="font-size:30px;color:#7b5cff">전생24 업데이트 v2.0</div><div style="font-size:42px;margin-top:6px">새 기능이 추가되었어요!</div>');
  noti.style.cssText+='left:170px;top:120px;width:740px;padding:24px 34px;box-sizing:border-box';
  return t=>{renderer.render(scene,(look(c,[-1.2,4.2,3.8],[-3.4,1.2,-2.2]),c));ph.style.filter='';
    noti.style.transform=`translateY(${(1-ease((t-0.3)/0.4))*-200}px)`;noti.style.opacity=t<3.4?clamp01((t-0.3)/0.2):clamp01(1-(t-3.4)/0.3);
    nw.style.display=t>tN?'flex':'none';nw.style.transform=`scale(${pop((t-tN)/0.35)})`;nw.style.boxShadow=`0 0 0 ${6+Math.sin(t*8)*4}px rgba(255,216,77,.9)`;
    ph.style.transform=`translateY(${(1-ease(t/0.5))*80}px)`;
    caption(16,t)}};

// ===== 17. 99%에서 멈춤 → 현생을 먼저 완료해 주세요 =====
S[17]=()=>{sky(SKY.night);const scene=nightRoomScene();const c=vcam(46);const L=TMK[17].lines.j03;const tP=L[0]+L[1]+0.25;
  const {ph,sc}=phoneUI(`<div class="head app">다음 생 미리보기</div><div style="display:flex;flex-direction:column;align-items:center;padding-top:110px;gap:30px">
    <div style="width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,#fff6d8,#c9a8ff);display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:900;color:#7b5cff">?</div>
    <div style="font-size:44px;font-weight:900;color:#444">다음 생 불러오는 중…</div>
    <div style="width:580px;height:46px;border-radius:23px;background:#e5def9;overflow:hidden"><div class="bar" style="height:100%;width:0;background:linear-gradient(90deg,#7b5cff,#ff8fc8)"></div></div>
    <div class="pc" style="font-size:90px;font-weight:900;color:#7b5cff">0%</div></div>
    <div class="md" style="position:absolute;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center">
     <div style="background:#fff;border-radius:40px;width:600px;padding:50px 30px 30px;text-align:center;font-weight:900"><div style="font-size:34px;color:#e2353f">⚠ 알림</div>
     <div style="font-size:54px;color:#222;margin:20px 0 34px;line-height:1.3">현생을 먼저<br>완료해 주세요.</div><div style="background:#7b5cff;color:#fff;font-size:42px;border-radius:24px;padding:18px">확인</div></div></div>`,{time:'AM 1:13'});
  const bar=sc.querySelector('.bar'),pc=sc.querySelector('.pc'),md=sc.querySelector('.md'),box=md.firstElementChild;
  return t=>{renderer.render(scene,(look(c,[-1.2,4.2,3.8],[-3.4,1.2,-2.2]),c));
    const k=Math.min(0.99,ease(t/1.3)*0.99);bar.style.width=(k*100)+'%';pc.textContent=Math.round(k*100)+'%';pc.style.opacity=t>1.3?(Math.floor(t*3)%2?1:0.55):1;
    md.style.display=t>tP?'flex':'none';box.style.transform=`scale(${pop((t-tP)/0.3)})`;
    caption(17,t)}};

// ===== 18. 엔딩: 여러분의 전생은? =====
S[18]=()=>{sky('linear-gradient(#0d0b2a,#2a1f5e 60%,#5a3f8f)');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0x8070c0,0.6));
  const r=rng(18);ground(scene,0x3a3560);stars(scene,300,r,{y0:8});
  for(let i=0;i<7;i++){const h=makeBuilding(r,4,5+r()*6,4,{lit:0.5,win:'#1c2240'});h.position.set(-12+i*4,h.position.y,-8);scene.add(h)}
  const ppl=[[-1.5,'왕?','#ffd84d'],[0,'장군?','#ffb38a'],[1.5,'모기?','#cfe9ff']].map(([x,tx,col],i)=>{const p=i==1?woong():(i==0?girl(91,{shirt:0xff9ec4}):addFace(makePerson(rng(92),{shirt:0x8cc9a0})));
    p.position.set(x,0,0);scene.add(p);const b=bub(p,tx,{bg:col,fs:66,size:0.0036,y:2.35});return {p,b}});
  const c=vcam(46);ui.innerHTML='<div class="ttl1 out" style="top:330px">여러분의 전생은</div><div class="ttl2 out" style="top:470px;color:#ffd84d">뭐였을 것 같나요?</div>';
  const t1=ui.querySelector('.ttl1'),t2=ui.querySelector('.ttl2');const cm=div('chip','댓글로 알려 주세요 ▼');cm.style.top='1290px';cm.style.fontSize='56px';
  return t=>{look(c,[0,2.6,8.4-t*0.1],[0,2.4,0]);ppl.forEach(({p,b},i)=>{const ph=t*6+i;p.userData.arms[1].rotation.z=2.5+Math.sin(ph)*0.3;scaleBubble(b,pop((t-0.4-i*0.15)/0.3));if(p.userData.smile)setFace(p,'smile')});
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t1.style.opacity=clamp01((t-0.1)/0.1);t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t2.style.opacity=clamp01((t-0.35)/0.1);
    popEl(cm,t,0.9);renderer.render(scene,c)}};
