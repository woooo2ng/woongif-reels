// ===== 7. 면접 2: 전생 모기 =====
S[7]=()=>{sky('#dfe6ef');const scene=new THREE.Scene();lights(scene,'day');const iv=interviewRoom(scene);
  const ap=suit(addFace(makePerson(rng(91),{shirt:0x3b3f4a,pants:0x2b2f3a,hair:0x1d1d24})),{tie:0x5ab0ff});seat(scene,ap,1.5,0,-Math.PI/2,0x2f3440);ap.userData.arms.forEach(a=>a.rotation.x=-0.9);setFace(ap,'smile');
  const wings=[];for(const s of[-1,1]){const wm=new THREE.Mesh(new THREE.CircleGeometry(0.42,24),new THREE.MeshBasicMaterial({color:0xd8f0ff,transparent:true,opacity:0.7,side:THREE.DoubleSide}));wm.scale.set(0.5,1,1);
    const wg=new THREE.Group();wg.position.set(s*0.1,0.5,-0.2);wm.position.set(s*0.18,0.25,0);wm.rotation.z=-s*0.5;wg.add(wm);ap.userData.hip.add(wg);wings.push([wg,s])}
  const ant=[];for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.3,6),lamb(0x222222));a.position.set(s*0.08,0.6,0.05);a.rotation.z=-s*0.35;ap.userData.head.add(a);
    const tip=new THREE.Mesh(new THREE.SphereGeometry(0.035,10,8),smooth(0x222222));tip.position.set(s*0.135,0.75,0.05);ap.userData.head.add(tip)}
  const ba=bub(ap,'전생: 모기',{bg:'#cfe9ff',fs:70,size:0.0036,y:2.5});
  const sw=sweat(iv);sw.visible=false;
  const glass=new THREE.Group();const gb=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.05,0.14,12),new THREE.MeshLambertMaterial({color:0xcfefff,transparent:true,opacity:0.8}));glass.add(gb);
  const liq=new THREE.Mesh(new THREE.CylinderGeometry(0.052,0.045,0.08,12),lamb(0xffffff));liq.position.y=-0.02;glass.add(liq);glass.position.set(0,-0.66,0.06);ap.userData.arms[1].add(glass);glass.visible=false;
  const L=TMK[7].lines;const c=vcam(46);const ch=chip('신입 공채 · 최종 면접');ch.style.top='120px';
  const tA=L.a01[0];
  return t=>{look(c,[1.2,3.1,9.8-t*0.1],[0.3,1.5,0]);popEl(ch,t,0.1);
    scaleBubble(ba,pop((t-0.15)/0.3));wings.forEach(([w,s])=>{w.rotation.y=s*(0.3+Math.sin(t*40)*0.35)});
    sw.visible=t>0.8&&t<tA+0.5;sw.position.y=0.4-((t*0.6)%0.3);iv.userData.head.rotation.x=t<0.8?0.3:-0.05;setFace(iv,t>0.8?'open':'flat');
    if(t>tA){const k=ease((t-tA)/0.3);ap.userData.arms[1].rotation.x=-0.9-1.7*k;glass.visible=true;setFace(ap,'smile');ap.userData.hip.position.y=0.56+Math.max(0,Math.sin((t-tA)*10))*0.04}
    caption(7,t);renderer.render(scene,c)}};

// ===== 8. 소개팅 첫 마디 =====
S[8]=()=>{sky('#f6dbe3');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffe0ea,0.35));
  roomBox(scene,{wall:0xf6d7e0,wall2:0xeec6d2,floor:0xd8b39a});
  const win=new THREE.Mesh(new THREE.PlaneGeometry(2.4,3.0),new THREE.MeshBasicMaterial({map:canvasTex(240,300,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffd1a8');g.addColorStop(1,'#ffeedd');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#fff';x.fillRect(w/2-4,0,8,h);x.fillRect(0,h/2-4,w,8)})}));win.position.set(-2.2,3.3,-3.85);scene.add(win);
  const fr=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.0),new THREE.MeshBasicMaterial({map:cardTex([['♥',90,'#ff7fa8']],{w:280,h:200,bg:'#fff'}),transparent:true}));fr.position.set(1.9,3.6,-3.85);scene.add(fr);
  roundTable(scene,0,0,{col:0xffffff,r:0.75});
  const vase=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.3,12),lamb(0x9ad0e6));vase.position.set(0,1.18,-0.1);scene.add(vase);
  for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.08,12,10),smooth([0xff8fb8,0xffd84d,0xffffff][i]));f.position.set(-0.07+i*0.07,1.4+(i%2)*0.06,-0.1);scene.add(f)}
  cup(scene,-0.4,1.03,0.15,0xffffff);cup(scene,0.4,1.03,0.1,0xffe0c0);
  const gl=girl(55,{shirt:0xffffff,skirt:0xff9ec4});seat(scene,gl,-1.0,0,Math.PI/2,0xffffff);gl.userData.arms.forEach(a=>a.rotation.x=-1.1);
  const mn=addFace(makePerson(rng(66),{shirt:0x6c8ebf,pants:0x33384a}));seat(scene,mn,1.0,0,-Math.PI/2,0xffffff);mn.userData.arms.forEach(a=>a.rotation.x=-1.1);
  const bg=bub(gl,'전생 뭐였어요?',{bg:'#ffffff',fs:62,size:0.0032,y:2.45});
  const bm=bub(mn,'…!',{bg:'#ffffff',fs:70,size:0.0034,y:2.4});const sw=sweat(mn);sw.visible=false;
  const L=TMK[8].lines;const tN=L.n06[0];
  const rank=div('box',`<div style="font-size:38px;color:#ff5f8f;margin-bottom:14px">소개팅 첫 질문 순위</div>
   ${[['1위','전생 뭐였어요?','#ff5f8f'],['2위','MBTI 뭐예요?','#555'],['3위','성함이…?','#999']].map(([a,b,c],i)=>`<div class="rk" style="display:flex;gap:22px;font-size:${i?46:58}px;color:${c};padding:8px 0;white-space:nowrap"><span style="width:110px">${a}</span><span>${b}</span></div>`).join('')}`);
  rank.style.cssText+='left:150px;top:240px;width:780px;padding:34px 46px;box-sizing:border-box';
  const rks=[...rank.querySelectorAll('.rk')];const c=vcam(46);
  return t=>{look(c,[-0.2,3.0,9.4-t*0.08],[-0.2,1.5,0]);
    scaleBubble(bg,pop((t-L.g01[0]-0.1)/0.3));setFace(mn,t>L.g01[0]+1.6?'open':'smile');setFace(gl,'smile');
    scaleBubble(bm,t>L.g01[0]+1.8?pop((t-L.g01[0]-1.8)/0.3):0);sw.visible=t>L.g01[0]+1.8;
    gl.userData.head.rotation.z=Math.sin(t*2)*0.05;
    popIn(rank,t,tN+0.2,'',0.35);rks.forEach((r,i)=>{const t0=tN+0.5+(2-i)*0.35;r.style.opacity=clamp01((t-t0)/0.1);r.style.transform=`translateX(${(1-ease((t-t0)/0.25))*-40}px)`});
    caption(8,t);renderer.render(scene,c)}};

// ===== 9. 전생 궁합 앱 → 원수 → 그래도 결혼 =====
S[9]=()=>{const L=TMK[9].lines.n07;const tA=L[0]+3.554,tB=L[0]+6.22;
  // 장면 A: 간판 교체
  const sA=new THREE.Scene();lights(sA,'dusk');const r=rng(9);city(sA,r,{roadW:12});
  const mkBoard=(txt,sub,col)=>{const b=new THREE.Group();const fr=new THREE.Mesh(new THREE.BoxGeometry(3.6,2.2,0.2),lamb(0x333340));b.add(fr);
    const m=new THREE.MeshBasicMaterial({map:cardTex([[txt,74,'#fff'],[sub,44,'#fff']],{w:700,h:420,bg:col})});const p=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2.0),m);p.position.z=0.11;b.add(p);
    const pole=new THREE.Mesh(new THREE.BoxGeometry(0.2,3,0.2),lamb(0x555560));pole.position.y=-2.5;b.add(pole);sA.add(b);return {b,m}};
  const B1=mkBoard('결혼정보회사','상담 예약 0건','#7a7f8f');B1.b.position.set(-1.9,4.6,-3);B1.b.scale.setScalar(0.85);
  const B2=mkBoard('전생 궁합 앱','다운로드 1위','#9b6bff');B2.b.position.set(1.9,4.6,-3.5);
  // 장면 C: 결혼식
  const sC=new THREE.Scene();lights(sC,'day');ground(sC,0x9ccf7a);
  const arch=new THREE.Group();for(let i=0;i<=16;i++){const a=i/16*Math.PI;const f=new THREE.Mesh(new THREE.IcosahedronGeometry(0.28,0),lamb([0xffffff,0xff9ec4,0xffd84d][i%3]));f.position.set(Math.cos(a)*1.9,0.2+Math.sin(a)*2.9,0);arch.add(f)}
  arch.position.set(0,0,-0.8);sC.add(arch);
  for(let i=0;i<8;i++){const ch=chairM(0xffffff);ch.position.set((i%4-1.5)*1.1,0,2.2+Math.floor(i/4)*1.0);ch.rotation.y=Math.PI;sC.add(ch)}
  const bride=girl(57,{shirt:0xffffff,skirt:0xffffff});bride.position.set(-0.55,0,0);sC.add(bride);
  const veil=new THREE.Mesh(new THREE.SphereGeometry(0.3,30,16,0,Math.PI*2,0,Math.PI*0.6),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.75}));veil.position.y=0.3;veil.scale.set(1,1.2,1.1);bride.userData.head.add(veil);
  const groom=suit(addFace(makePerson(rng(58),{shirt:0x2b2f3a,pants:0x2b2f3a})),{tie:0xffffff});groom.position.set(0.55,0,0);sC.add(groom);setFace(groom,'smile');
  bride.userData.arms[1].rotation.z=0.4;groom.userData.arms[0].rotation.z=-0.4;
  const bB=bub(bride,'원수 ♥',{bg:'#ffc2e0',fs:66,size:0.0034,y:2.4});const bG=bub(groom,'원수 ♥',{bg:'#ffc2e0',fs:66,size:0.0034,y:2.4});
  const H=sprinkle(sC,r,18,[0,0.8,0,4,2.8]);
  // 장면 B: 폰 결과
  const pB=phoneUI(`<div class="head app">전생24 · 궁합</div><div style="display:flex;justify-content:center;gap:60px;margin-top:70px">
    ${['나','너'].map((n,i)=>`<div style="text-align:center"><div style="width:180px;height:180px;border-radius:50%;background:${i?'#ffc2e0':'#cfe3ff'};display:flex;align-items:center;justify-content:center;font-size:70px;font-weight:900;color:#555">${n}</div><div style="font-size:32px;color:#777;margin-top:12px;font-weight:700">${i?'전생: 산적':'전생: 포졸'}</div></div>`).join('')}</div>
    <div style="text-align:center;margin-top:60px;font-size:40px;color:#777;font-weight:700">두 분의 전생 관계는</div>
    <div class="rs" style="text-align:center;font-size:120px;font-weight:900;color:#e2353f;letter-spacing:-4px">원수</div>
    <div style="margin:10px 70px 0;height:34px;border-radius:17px;background:#f5d7da;overflow:hidden"><div class="rb" style="height:100%;width:0;background:#e2353f"></div></div>
    <div class="pc" style="text-align:center;font-size:44px;font-weight:900;color:#e2353f;margin-top:14px">0%</div>`);
  pB.ph.style.display='none';const rb=pB.sc.querySelector('.rb'),pc=pB.sc.querySelector('.pc');
  const chA=chip('출시 석 달 후');chA.style.top='120px';
  const cA=vcam(50),cC=vcam(46);
  return t=>{chA.style.display=t<tA?'':'none';popEl(chA,t,0.1);
    if(t<tA){sky(SKY.dusk);const k=ease((t-1.0)/0.8);B1.m.color.setScalar(1-0.6*k);B2.b.scale.setScalar(0.85+0.12*pop((t-1.4)/0.4)-0.12*(t<1.4));
      look(cA,[0,3.4,9.5-t*0.2],[0,3.2,-3]);pB.ph.style.display='none';renderer.render(sA,cA)}
    else if(t<tB){sky('linear-gradient(#3a2a7a,#7b5cff 60%,#c9a8ff)');renderer.clear();pB.ph.style.display='';const k=ease((t-tA-0.3)/1.2);rb.style.width=(98*k)+'%';pc.textContent=Math.round(98*k)+'%';
      pB.ph.style.transform=shake(t,tA+1.55,12)}
    else{pB.ph.style.display='none';sky('linear-gradient(#8ec5f5,#d8ecff 60%,#f4fbff)');
      scaleBubble(bB,pop((t-tB-0.2)/0.3));scaleBubble(bG,pop((t-tB-0.35)/0.3));updSprinkle(H,t,tB);
      look(cC,[0,2.6,7.6-(t-tB)*0.3],[0,1.8,0]);renderer.render(sC,cC)}
    caption(9,t)}};

// ===== 10. 법정: 전생에 이미 벌 받았습니다 → 기각 =====
S[10]=()=>{sky('#7a5a44');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffe2c0,0.25));
  roomBox(scene,{wall:0x8a6248,wall2:0x7a5640,floor:0x6b4a36,h:8});
  const seal=new THREE.Mesh(new THREE.CircleGeometry(0.7,32),new THREE.MeshBasicMaterial({map:cardTex([['법원',60,'#7a5a20']],{w:200,h:200,bg:'#f2d27a'}),transparent:true}));seal.position.set(-2.4,4.6,-3.85);scene.add(seal);
  const bench=new THREE.Mesh(new THREE.BoxGeometry(4.4,1.8,1.2),lamb(0x5a3c2a));bench.position.set(0,0.9,-2.6);scene.add(bench);
  const btop=new THREE.Mesh(new THREE.BoxGeometry(4.6,0.1,1.3),lamb(0x4a3020));btop.position.set(0,1.85,-2.6);scene.add(btop);
  const judge=addFace(makePerson(rng(13),{shirt:0x1d1d24,pants:0x1d1d24,hair:0xbbbbbb}));judge.position.set(0,1.0,-3.3);scene.add(judge);
  judge.userData.arms[0].rotation.x=-1.3;judge.userData.arms[1].rotation.x=-1.3;
  const gav=new THREE.Group();const gh=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.3,12),lamb(0x8a5a3a));gh.rotation.z=Math.PI/2;gav.add(gh);
  const gs=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.4,8),lamb(0x6a4a2a));gs.position.y=-0.2;gav.add(gs);gav.position.set(0,-0.75,0.1);judge.userData.arms[1].add(gav);
  const lw=suit(addFace(makePerson(rng(17),{shirt:0x2f3440,pants:0x2f3440})),{tie:0x7b5cff,glasses:true});lw.position.set(0.9,0,0.6);lw.rotation.y=-0.5;scene.add(lw);
  const df=addFace(makePerson(rng(19),{shirt:0x9aa3ad,pants:0x6a7078}));seat(scene,df,-1.4,0.6,0.4,0x5a3c2a);df.userData.head.rotation.x=0.3;
  const bl=bub(lw,'이미 벌 받았습니다!',{bg:'#ffffff',fs:58,size:0.003,y:2.4});
  const L=TMK[10].lines.n08;const t2=L[0]+2.183,tK=L[0]+6.85;const st=stampEl('기각',-1,99,{top:520});const c=vcam(46);
  const ch=chip('형사 재판 · 최후 변론');ch.style.top='120px';
  return t=>{look(c,[0.6,3.5,9.4-t*0.08],[0,2.0,-0.8]);popEl(ch,t,0.1);
    scaleBubble(bl,t>t2?pop((t-t2)/0.3):0);lw.userData.arms[1].rotation.x=t>t2?-1.6-Math.sin(t*4)*0.2:-0.2;lw.userData.arms[1].rotation.z=t>t2?0.3:0;setFace(lw,t>t2&&t<tK?'open':'flat');
    const g=t>tK-0.35?(t<tK?-1.3-1.2*ease((t-tK+0.35)/0.3):-1.0):-1.3+Math.sin(t*1.2)*0.03;judge.userData.arms[1].rotation.x=g;
    setFace(judge,'flat');setFace(df,t>tK+0.1?'open':'flat');
    document.getElementById('c').style.transform=shake(t,tK,12);stampEl('기각',t,tK+0.05,{el:st});
    caption(10,t);renderer.render(scene,c)}};

// ===== 11. 전생 부동산 → 지금은 주차장 =====
S[11]=()=>{const L=TMK[11].lines.n09;const tB=L[0]+2.906;
  const sA=new THREE.Scene();lights(sA,'day');ground(sA,0xd8d2c6);
  const shop=new THREE.Mesh(new THREE.BoxGeometry(7,4.2,3),lamb(0xf2efe8));shop.position.set(0,2.1,-2);sA.add(shop);
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(5.6,2.4),lamb(0x9fc3dc));glass.position.set(0,1.4,-0.49);sA.add(glass);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2.2),lamb(0x6a8aa0));door.position.set(1.8,1.2,-0.48);sA.add(door);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(6.4,0.9),new THREE.MeshBasicMaterial({map:cardTex([['전생 공인중개사',80,'#ffffff']],{w:1100,h:150,bg:'#7b5cff'})}));sign.position.set(0,3.4,-0.47);sA.add(sign);
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.2),new THREE.MeshBasicMaterial({map:cardTex([['전생에 살던 집',64,'#e2353f'],['찾아 드립니다',64,'#222']],{w:760,h:210,bg:'#fff8d6'}),transparent:true}));ban.position.set(-0.4,1.6,-0.46);sA.add(ban);
  const cpl=[addFace(makePerson(rng(23),{shirt:0xe39a6b})),girl(24,{shirt:0x8cc9a0,skirt:0xcdeed7})];cpl[0].position.set(-1.9,0,1.4);cpl[1].position.set(1.9,0,1.6);cpl.forEach(p=>{p.rotation.y=Math.PI;sA.add(p)});
  const sB=new THREE.Scene();lights(sB,'day');ground(sB,0x6b6f78,200);const r=rng(4);
  for(let i=-3;i<=3;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.12,4.5),basic(0xf2f2f2));l.rotation.x=-Math.PI/2;l.position.set(i*2.4,0.01,-1.5);sB.add(l)}
  const C=cars(sB,r,[[-6,-1.5,0],[-3.6,-1.5,0],[3.6,-1.5,0],[6,-1.5,0],[-4.8,-7,0],[2.4,-7,0]]);
  for(let i=0;i<6;i++){const b=makeBuilding(r,6,10+r()*10,6);b.position.set(-15+i*6.5,b.position.y,-16);sB.add(b)}
  const pin=spr(cardTex([['전생 집 위치',54,'#fff'],['▼',50,'#fff']],{w:420,h:200,bg:'#e2353f'}),2.4,1.15);sB.add(pin);
  const cpl2=[addFace(makePerson(rng(23),{shirt:0xe39a6b})),girl(24,{shirt:0x8cc9a0,skirt:0xcdeed7})];cpl2[0].position.set(-0.5,0,1.0);cpl2[1].position.set(0.5,0,1.0);cpl2.forEach(p=>{sB.add(p);setFace(p,'open')});
  const b2=bub(cpl2[1],'…여기?',{bg:'#ffffff',fs:66,size:0.0032,y:2.35});
  const c=vcam(48);const ch=chip('신규 오픈 · 상담 무료');ch.style.top='120px';const ch2=chip('주소: 조선 한양 ○○방 → 현재 주차장');ch2.style.top='120px';ch2.style.fontSize='40px';
  return t=>{if(t<tB){sky(SKY.day);popEl(ch,t,0.1);ch2.style.opacity=0;cpl.forEach((p,i)=>walkPose(p,t*5+i,0.3));cpl.forEach((p,i)=>p.position.z=1.6-i*0.2-t*0.25);
      look(c,[0,2.6,9.0-t*0.2],[0,2.0,-1]);renderer.render(sA,c)}
    else{sky(SKY.clear);ch.style.opacity=0;popEl(ch2,t,tB+0.3);pin.position.set(0,3.6+Math.abs(Math.sin((t-tB)*4))*0.3,-1.5);const k=pop((t-tB)/0.35);pin.scale.set(2.4*k,1.15*k,1);
      scaleBubble(b2,pop((t-tB-0.7)/0.3));look(c,[0,3.6,9.6-(t-tB)*0.25],[0,1.5,-1.5]);renderer.render(sB,c)}
    caption(11,t)}};

// ===== 12. 웅이 전생 결과: 우리 집 강아지 =====
function woongRoom(scene,o={}){const R=room(scene,o);const dg=dog({collar:true});dg.position.set(1.2,0.03,0.9);dg.rotation.y=-0.6;scene.add(dg);
  const cush=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,0.12,20),lamb(0x9cc9ff));cush.position.set(1.2,0.06,0.9);scene.add(cush);dg.position.y=0.12;return {R,dg}}
S[12]=()=>{sky(SKY.day);const scene=new THREE.Scene();lights(scene,'day');const {R,dg}=woongRoom(scene,{winSky:['#ffcf9e','#ffe9d0']});
  const wg=woong();wg.position.set(-2.1,0.5,0.5);wg.rotation.y=0.5;sitPose(wg);wg.userData.hip.position.y=0.55+0.5;scene.add(wg);wg.position.y=0;
  const ph=holdPhone(wg,1,1.35);
  const L=TMK[12].lines.j02;
  const card=div('box',`<div style="font-size:34px;color:#7b5cff">전생24 · 조회 완료</div><div style="font-size:40px;color:#777;margin:14px 0 4px">웅이 님의 전생은…</div>
    <div class="res" style="font-size:96px;letter-spacing:-3px;color:#222">우리 집 강아지</div><div class="sub" style="font-size:36px;color:#999">(현재 이름: 뭉치)</div>`);
  card.style.cssText+='left:120px;top:250px;width:840px;padding:40px 30px;box-sizing:border-box;text-align:center';const res=card.querySelector('.res'),sub=card.querySelector('.sub');
  const c=vcam(46);
  return t=>{look(c,[0.2,2.8,8.0-t*0.2],[-0.8,1.2,0]);setFace(wg,t>L[0]?'open':'flat');wg.userData.head.rotation.x=t<L[0]?0.35:0.1;
    popIn(card,t,0.15,'',0.3);res.style.filter=t<L[0]-0.1?'blur(18px)':'';sub.style.opacity=clamp01((t-L[0]-0.6)/0.2);
    dg.userData.head.rotation.y=t>L[0]+0.6?0.7:0;dogWag(dg,t);
    caption(12,t);renderer.render(scene,c)}};
