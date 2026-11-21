// ===== 0. 타이틀: 낮 거리, 다들 전생 조회 → 맨 앞 한 명만 '모기' =====
S[0]=()=>{const r=rng(11);const scene=new THREE.Scene();
  sky('linear-gradient(#6fb6f5,#bfe2ff 60%,#eef8ff)');scene.fog=new THREE.Fog(0xcfe6ff,35,110);lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.25));city(scene,r,{roadW:12});
  const RES=[['왕!','#ffd84d'],['장군!','#ffb38a'],['공주','#ffc2e0'],['왕비','#ffc2e0'],['왕!','#ffd84d']];
  const pos=[[-1.45,0.7],[1.45,0.8],[-0.8,-1.3],[0.85,-1.2],[0,-2.9]];
  const P=pos.map(([x,z],i)=>{const p=i==2?girl(103,{shirt:0xff9ec4}):addFace(makePerson(rng(210+i)));p.position.set(x,0,z);p.rotation.y=-x*0.12;holdPhone(p,1,1.3);p.userData.head.rotation.x=0.38;scene.add(p);
    const b=bub(p,'조회 중…',{fs:60,size:0.0036,bg:'#ffffff'});return {p,b,i}});
  const hero=addFace(makePerson(rng(300),{shirt:0x7fb7c9,pants:0x33384a}));hero.position.set(0,0,2.3);scene.add(hero);holdPhone(hero,1,1.3);hero.userData.head.rotation.x=0.38;
  const hb=bub(hero,'조회 중…',{fs:60,size:0.0036,bg:'#ffffff'});const sw=sweat(hero);sw.visible=false;
  const c=vcam(48);const TC=window.TC||'#ffd84d';
  ui.innerHTML=`<div class="tag0">만약에</div><div class="ttl1 out">누구나 전생을</div><div class="ttl2 out" style="color:${TC}">조회할 수 있다면?</div>`;
  const tg=ui.querySelector('.tag0'),t1=ui.querySelector('.ttl1'),t2=ui.querySelector('.ttl2');
  const tR=0.75,tH=1.45;
  return t=>{look(c,[0,2.1,9.4-t*0.25],[0,2.05,-1.2]);
    P.forEach(({p,b,i})=>{scaleBubble(b,pop((t-0.05-i*0.04)/0.25));const t0=tR+i*0.09;
      if(t>t0&&b.userData.k!==1){b.userData.k=1;setBubble(b,RES[i][0],{bg:RES[i][1],fs:68,size:0.0042})}
      if(b.userData.k===1){scaleBubble(b,pop((t-t0)/0.3));const lk=ease((t-t0)/0.2);p.userData.head.rotation.x=0.38-0.45*lk;
        p.userData.hip.position.y=0.8+(t<tH+0.2?Math.max(0,Math.sin((t-t0)*10))*0.07:0)}
      if(t>tH+0.35){const k=ease((t-tH-0.35)/0.3);const ang=Math.atan2(0-p.position.x,2.3-p.position.z);p.rotation.y=-p.position.x*0.12*(1-k)+ang*k;p.userData.head.rotation.x=0;setFace(p,'open')}});
    scaleBubble(hb,pop((t-0.05)/0.25));
    if(t>tH){if(hb.userData.k!==1){hb.userData.k=1;setBubble(hb,'모기',{bg:'#cfe9ff',fs:74,size:0.0048})}scaleBubble(hb,pop((t-tH)/0.35));
      hero.userData.head.rotation.x=0.38-0.3*ease((t-tH-0.4)/0.3);setFace(hero,'flat');sw.visible=t>tH+0.5}
    popEl(tg,t,0.05);t1.style.transform=`scale(${pop((t-0.1)/0.3)})`;t1.style.opacity=clamp01((t-0.1)/0.1);
    t2.style.transform=`scale(${pop((t-0.3)/0.35)})`;t2.style.opacity=clamp01((t-0.3)/0.1);
    renderer.render(scene,c)}};

// ===== 1. 뉴스 속보: 전생24 출시 =====
S[1]=()=>{sky('linear-gradient(#1b2a5a,#2f4a8a)');const scene=new THREE.Scene();lights(scene,'day');
  const wall=new THREE.Mesh(new THREE.BoxGeometry(16,9,0.2),lamb(0x2b3f7a));wall.position.set(0,4.5,-3);scene.add(wall);
  for(let i=0;i<7;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(0.12,9,0.1),basic(0x4a68b8));s.position.set(-6+i*2,4.5,-2.85);scene.add(s)}
  const fl=new THREE.Mesh(new THREE.BoxGeometry(16,0.2,10),lamb(0x22305e));fl.position.y=-0.1;scene.add(fl);
  const scr=new THREE.Mesh(new THREE.BoxGeometry(3.3,2.3,0.12),lamb(0x111118));scr.position.set(0,4.6,-2.8);scene.add(scr);
  const scrTex=canvasTex(660,440,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#2a1f5e');g.addColorStop(1,'#6a4fc0');x.fillStyle=g;x.fillRect(0,0,w,h);
    x.drawImage(appIconTex().image,40,90,250,250);x.fillStyle='#fff';x.font=`900 64px ${FONT}`;x.textAlign='left';x.fillText('전생24',320,170);x.fillStyle='#ffe066';x.font=`900 44px ${FONT}`;x.fillText('정식 출시',320,240);
    x.fillStyle='rgba(255,255,255,0.8)';x.font=`700 30px ${FONT}`;x.fillText('본인 인증 → 전생 확인',320,305)});
  const sp=new THREE.Mesh(new THREE.PlaneGeometry(3.1,2.1),new THREE.MeshBasicMaterial({map:scrTex}));sp.position.set(0,4.6,-2.73);scene.add(sp);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.4,1.1),lamb(0xf2f4fa));desk.position.set(0,0.7,0.4);scene.add(desk);const dstripe=new THREE.Mesh(new THREE.BoxGeometry(3.62,0.18,1.12),basic(0xe23b3b));dstripe.position.set(0,1.2,0.4);scene.add(dstripe);
  const dfront=new THREE.Mesh(new THREE.PlaneGeometry(3.4,0.7),new THREE.MeshBasicMaterial({map:canvasTex(680,140,(x,w,h)=>{x.fillStyle='#e23b3b';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font=`900 80px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('NEWS 9',w/2,h/2+4)})}));dfront.visible=false;
  const an=suit(addFace(makePerson(rng(5),{shirt:0x2f3b55,pants:0x222833})),{tie:0x3a6fd0});an.position.set(0,1.15,-0.4);scene.add(an);setFace(an,'smile');
  const pap=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.02,0.36),lamb(0xffffff));pap.position.set(0.5,1.42,0.2);scene.add(pap);
  const c=vcam(46);
  const lo=div('lower','<span class="r">속보</span><div class="t">정부, 전생 조회 앱 \'전생24\' 출시</div>');
  const live=div('chip','● LIVE');live.style.background='#e23b3b';live.style.color='#fff';live.style.left='170px';live.style.top='90px';lo.style.top='1110px';
  return t=>{look(c,[0.3-t*0.03,3.2,7.2-t*0.12],[0,2.95,-1]);
    an.userData.head.rotation.y=Math.sin(t*1.3)*0.08;an.userData.head.rotation.x=Math.sin(t*2.1)*0.03;
    an.userData.arms[0].rotation.x=-0.5+Math.sin(t*1.7)*0.08;an.userData.arms[1].rotation.x=-0.5;
    setFace(an,Math.floor(t*6)%3==0&&t<8.6?'open':'smile');
    popIn(lo,t,0.25,'',0.3);live.style.opacity=(Math.floor(t*2)%2?1:0.6);
    caption(1,t);renderer.render(scene,c)}};

// ===== 2. 서버 폭주: 대기 480만 =====
S[2]=()=>{sky('linear-gradient(#3a2a7a,#7b5cff 60%,#c9a8ff)');renderer.clear();
  const {ph,sc}=phoneUI(`<div class="head app" style="gap:18px"><span style="font-size:44px">전생24</span></div>
   <div style="display:flex;flex-direction:column;align-items:center;padding-top:70px;gap:26px">
   ${APPICON_SVG.replace('120px;height:120px','200px;height:200px').replace('40px','64px').replace('36px','58px')}
   <div style="font-size:46px;font-weight:900;color:#333">접속 대기 중입니다</div>
   <div style="font-size:34px;color:#888;font-weight:700">내 앞의 대기 인원</div>
   <div class="cnt" style="font-size:104px;font-weight:900;color:#7b5cff;letter-spacing:-3px">0</div>
   <div style="width:560px;height:30px;border-radius:15px;background:#e5def9;overflow:hidden"><div class="bar" style="width:1%;height:100%;background:#7b5cff"></div></div>
   <div class="eta" style="font-size:34px;color:#888;font-weight:700">예상 대기 시간: 계산 중…</div></div>`);
  const cnt=sc.querySelector('.cnt'),eta=sc.querySelector('.eta');
  const ch=chip('출시 3분 후');ch.style.top='120px';
  const b=div('box','수강신청보다 치열 ✔');b.style.cssText+='left:250px;top:1020px;font-size:52px;padding:18px 34px;background:#ffd84d;color:#2a2100';
  const L=TMK[2].lines.n02;
  return t=>{const k=ease((t-0.3)/2.2);const n=Math.round(1203+k*(4812309-1203));cnt.textContent=n.toLocaleString('ko-KR')+'명';
    if(t>2.2)eta.textContent='예상 대기 시간: 9일 4시간';ph.style.transform=shake(t,0.3+1.0,10);
    popEl(ch,t,0.1);b.style.transform=`rotate(-4deg) scale(${pop((t-L[0]-4.43)/0.3)})`;b.style.opacity=clamp01((t-L[0]-4.43)/0.08);
    caption(2,t)}};

// ===== 3. 단톡방: 다들 왕·공주·장군 → 노비 올렸다가 삭제 =====
S[3]=()=>{sky('linear-gradient(#20244a,#3b4384)');renderer.clear();
  const {ph,sc}=phoneUI(`<div class="head">고등학교 동창 단톡 <span style="color:#888;margin-left:12px">32</span></div><div class="msgs" style="position:absolute;left:0;right:0;top:166px;bottom:0;padding:20px 30px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-end;gap:18px;overflow:hidden"></div>`,{bg:'#c9dbea',time:'PM 11:48'});
  const box=sc.querySelector('.msgs');const AV={민수:'#ff9e9e',지현:'#9ec5ff',태호:'#a8e6a1',준영:'#ffd59e',수빈:'#d0b3ff',하은:'#ffb3d9'};
  const card=(res,col,era)=>`<div style="background:#fff;border-radius:26px;padding:14px 26px;width:360px;box-shadow:0 2px 6px rgba(0,0,0,.08)"><div style="font-size:24px;color:#7b5cff;font-weight:900">전생24 · 조회 결과</div><div style="display:flex;align-items:baseline;gap:14px"><span style="font-size:66px;font-weight:900;color:#222">${res}</span><span style="font-size:28px;color:#888;font-weight:700">${era}</span></div><div style="height:12px;border-radius:6px;background:${col};margin-top:6px"></div></div>`;
  const txt=t=>`<div style="background:#fff;border-radius:26px;padding:16px 26px;font-size:38px;color:#222;max-width:460px">${t}</div>`;
  const L=TMK[3].lines;const tB=L.n04[0]+3.135;
  const M=[[0.4,'민수',card('왕','#ffd84d','조선')],[1.3,'지현',txt('와 대박ㅋㅋ')],[2.0,'지현',card('공주','#ffc2e0','고려')],[2.9,'태호',card('장군','#ffb38a','신라')],
    [3.8,'태호',txt('역시 우리 반 클라스 ㅋㅋ')],[4.8,'준영',card('노비','#b9b9b9','조선'),'del'],[tB+0.25,'준영',txt('아 잘못 올림ㅋㅋ')],[tB+0.95,'준영',card('왕','#ffd84d','조선')],
    [tB+1.6,'수빈',txt('ㅋㅋㅋㅋㅋㅋㅋ')],[tB+1.85,'하은',txt('ㅋㅋㅋㅋㅋㅋㅋㅋㅋ')],[tB+2.1,'민수',txt('ㅋㅋㅋㅋ')]];
  const els=M.map(([t0,nm,html,flag])=>{const d=document.createElement('div');d.style.cssText='display:none;gap:14px;align-items:flex-start';
    d.innerHTML=`<div style="width:70px;height:70px;border-radius:26px;background:${AV[nm]};flex:none"></div><div><div style="font-size:26px;color:#555;margin:0 0 6px 4px">${nm}</div><div class="bd">${html}</div></div>`;box.appendChild(d);return {d,t0,flag}});
  const tDel=tB-0.55;const delEl=els.find(e=>e.flag==='del');
  const delHTML=`<div style="background:rgba(255,255,255,.55);border-radius:26px;padding:16px 26px;font-size:32px;color:#777;font-style:italic">준영님이 메시지를 삭제했습니다.</div>`;
  const zero=div('box','<div style="font-size:40px;color:#666">인증한 사람 중 백성</div><div style="font-size:120px;color:#e2353f;line-height:1.1">0명</div>');zero.style.cssText+='left:240px;top:520px;width:600px;text-align:center;padding:30px 0';
  const ch=chip('PM 11:48 · 인증 폭주');ch.style.top='110px';const tZ=tB+2.6;
  return t=>{els.forEach(e=>{e.d.style.display=t>e.t0?'flex':'none';if(t>e.t0){const k=pop((e.t0-t+0.3>0?(t-e.t0)/0.3:1));e.d.style.transform=`scale(${0.7+0.3*k})`;e.d.style.transformOrigin='0 100%'}});
    const bd=delEl.d.querySelector('.bd');if(t>tDel&&!bd.dataset.x){bd.dataset.x=1;bd.innerHTML=delHTML}if(t<=tDel&&bd.dataset.x){delete bd.dataset.x;bd.innerHTML=M[5][2]}
    if(t>tDel){const k=clamp01((t-tDel)/0.15);bd.style.opacity=0.4+0.6*k}
    popEl(ch,t,0.1);popIn(zero,t,tZ,'rotate(-3deg)',0.35);ph.style.filter=t>tZ?'brightness(0.75)':'';
    caption(3,t)}};

// ===== 4. 내무반: 이등병 전생 장군 → 병장 경례 =====
function armyCap(p){const g=new THREE.Group();const m=smooth(0x5d6b45);const c=new THREE.Mesh(new THREE.SphereGeometry(0.27,40,20,0,Math.PI*2,0,Math.PI*0.42),m);c.position.y=0.27;g.add(c);
  const br=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.025,24,1,false,-Math.PI/2,Math.PI),m);br.position.set(0,0.3,0.12);br.scale.z=0.9;g.add(br);p.userData.head.add(g);p.userData.head.children[1].visible=false;return g}
S[4]=()=>{sky('#cfd8c0');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xf0f4e0,0.3));
  roomBox(scene,{wall:0xdfe5cf,wall2:0xd2d9bf,floor:0x9a8a6a});
  const plat=new THREE.Mesh(new THREE.BoxGeometry(9,0.6,2.2),lamb(0x8a6a4a));plat.position.set(0,0.3,-2.6);scene.add(plat);
  for(let i=0;i<6;i++){const bl=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.28,0.6),lamb(0x6b7a4a));bl.position.set(-3.8+i*1.5,0.74,-3.4);scene.add(bl);
    const pw=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.14,0.3),lamb(0xffffff));pw.position.set(-3.8+i*1.5,0.95,-3.4);scene.add(pw)}
  for(let i=0;i<4;i++){const lk=new THREE.Mesh(new THREE.BoxGeometry(0.9,2.2,0.5),lamb(0x9aa38a));lk.position.set(-4.9,1.1,0.6-i*1.0);lk.rotation.y=Math.PI/2;scene.add(lk)}
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.6,0.6),new THREE.MeshBasicMaterial({map:cardTex([['생활관 3분대',60,'#3d4a2a']],{w:560,h:130,bg:'#fff8e0'}),transparent:true}));sign.position.set(0.6,3.9,-3.85);scene.add(sign);
  const U=0x6b7a4a,UP=0x55613a;
  const sg=addFace(makePerson(rng(41),{shirt:U,pants:UP}));armyCap(sg);sg.position.set(-1.0,0.6,-1.8);sg.rotation.y=0.55;sitPose(sg);scene.add(sg);holdPhone(sg,1,1.2);setFace(sg,'flat');
  const pv=addFace(makePerson(rng(42),{shirt:U,pants:UP}));armyCap(pv);pv.position.set(0.75,0,0.4);pv.rotation.y=-0.9;scene.add(pv);setFace(pv,'open');
  const pph=holdPhone(pv,1,0.0);pph.visible=false;
  const L=TMK[4].lines;const tP=L.p01[0],tS=L.s02[0];
  const bp=bub(pv,'전생: 장군',{bg:'#ffb38a',fs:68,size:0.0034,y:2.45});
  const card=div('box',`<div style="font-size:32px;color:#7b5cff">전생24 · 내 조회 결과</div><div style="font-size:40px;color:#777;margin:10px 0 2px">병장 님의 전생은…</div><div style="font-size:84px;letter-spacing:-3px">그 장군의 말(馬)</div>`);
  card.style.cssText+='left:130px;top:240px;width:820px;padding:36px 30px;box-sizing:border-box;text-align:center';
  const ch=chip('일과 후 · 생활관');ch.style.top='120px';const c=vcam(46);
  return t=>{popEl(ch,t,0.1);look(c,[0.1,3.0,8.4-t*0.12],[-0.15,1.4,-0.6]);
    // 병장: 처음엔 비스듬히 앉아 폰 → 이등병 쪽으로 고개
    sg.userData.head.rotation.y=t<tP+0.3?0.5:0.5;
    // 이등병: 차렷 → 대답할 때 폰 내밀기
    if(t>tP){pph.visible=true;pv.userData.arms[1].rotation.x=-1.4*ease((t-tP)/0.2)}else{pv.userData.arms.forEach(a=>{a.rotation.x=0;a.rotation.z=0})}
    scaleBubble(bp,t>tP?pop((t-tP-0.1)/0.3):0);
    // 병장 자기 폰 확인 카드
    const tc=tP+TMK[4].lines.p01[1]+0.15;const show=t>tc&&t<tS+0.2;card.style.display=show?'':'none';if(show)card.style.transform=`scale(${pop((t-tc)/0.3)})`;
    sg.userData.head.rotation.x=t>tc-0.2&&t<tS?0.35:0;setFace(sg,t>tc?'open':'flat');
    // 병장 일어나 경례
    if(t>tS-0.15){const k=ease((t-tS+0.15)/0.35);sg.position.y=0.6;standPose(sg);sg.userData.hip.position.y=0.8;sg.rotation.y=0.55+0.25*k;
      sg.userData.arms[1].rotation.x=-2.35*k;sg.userData.arms[1].rotation.z=-0.4*k;sg.userData.head.rotation.x=0;sg.userData.arms[0].rotation.x=0;
      if(sg.userData._ph===undefined){sg.userData._ph=1;sg.userData.arms[1].children.forEach(o=>{if(o.geometry&&o.geometry.parameters&&o.geometry.parameters.depth===0.03)o.visible=false})}
      setFace(sg,'flat')}
    caption(4,t);renderer.render(scene,c)}};

// ===== 5. 이력서에 '전생' 칸 =====
S[5]=()=>{sky('linear-gradient(#f3ead8,#e3d3b8)');renderer.clear();
  const pap=div('box',`<div style="text-align:center;font-size:76px;letter-spacing:30px;margin:10px 0 30px">이력서</div>
   <div style="display:flex;gap:30px;margin-bottom:24px"><div style="width:190px;height:240px;background:#e9e4f2;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#aaa;font-size:30px">사진</div>
   <div style="flex:1;display:flex;flex-direction:column;gap:14px;justify-content:center">${[['성명','김OO'],['생년월일','2001. 03. 14'],['연락처','010-****-****']].map(([a,b])=>`<div style="display:flex;font-size:36px"><span style="width:180px;color:#777">${a}</span><span>${b}</span></div>`).join('')}</div></div>
   ${[['학력','OO대학교 졸업'],['경력','OO전자 인턴 6개월'],['자격증','토익 870']].map(([a,b])=>`<div class="rw" style="display:flex;font-size:40px;padding:22px 10px;border-top:3px solid #eee"><span style="width:200px;color:#777">${a}</span><span>${b}</span></div>`).join('')}
   <div class="pl" style="display:flex;font-size:44px;padding:24px 10px;border-top:3px solid #eee;border-radius:14px;position:relative"><span style="width:200px;color:#7b5cff">전생</span><span class="pv"></span>
   <span class="nw" style="position:absolute;right:16px;top:14px;background:#e2353f;color:#fff;font-size:30px;padding:6px 16px;border-radius:12px">NEW · 필수</span></div>`);
  pap.style.cssText+='left:110px;top:200px;width:860px;padding:44px 50px;box-sizing:border-box;border-radius:20px';
  const pl=pap.querySelector('.pl'),pv=pap.querySelector('.pv'),nw=pap.querySelector('.nw');
  const L=TMK[5].lines.n05;const t2=L[0]+2.23;
  const ch=chip('2026 하반기 공채 · 지원서');ch.style.top='110px';
  return t=>{popEl(ch,t,0.1);pap.style.transform=`translateY(${(1-ease(t/0.5))*60}px)`;pap.style.opacity=clamp01(t/0.3);
    const k=clamp01((t-t2-0.6)/0.4);pl.style.background=`rgba(255,216,77,${0.7*k})`;pl.style.transform=`scale(${1+0.05*Math.max(0,1-Math.abs(t-t2-0.9)*3)})`;
    nw.style.opacity=clamp01((t-t2-0.9)/0.1);nw.style.transform=`scale(${pop((t-t2-0.9)/0.3)})`;
    const txt='조선 시대 장군';const n=Math.max(0,Math.floor((t-t2-1.2)*10));pv.textContent=txt.slice(0,n)+(n<txt.length&&t>t2+1.2&&Math.floor(t*4)%2?'|':'');
    caption(5,t)}};

// ===== 6. 면접 1: 전생 장군 → 합격 =====
function interviewRoom(scene,o={}){roomBox(scene,{wall:0xdfe6ef,wall2:0xcfd8e4,floor:0x9aa3b4});
  const logo=new THREE.Mesh(new THREE.PlaneGeometry(2.6,0.7),new THREE.MeshBasicMaterial({map:cardTex([['OO전자 · 신입 면접',54,'#2f3b55']],{w:620,h:170,bg:'#ffffff'}),transparent:true}));logo.position.set(0,4.4,-3.85);scene.add(logo);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.9,1.0),lamb(0x8a95a8));desk.position.set(-1.3,0.45,0);scene.add(desk);
  const dtop=new THREE.Mesh(new THREE.BoxGeometry(2.7,0.06,1.1),lamb(0xe8ecf2));dtop.position.set(-1.3,0.93,0);scene.add(dtop);
  const plate=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.24),new THREE.MeshBasicMaterial({map:cardTex([['면접관',70,'#222']],{w:300,h:100}),transparent:true}));plate.position.set(-1.0,1.08,0.52);plate.rotation.y=0.4;scene.add(plate);
  const papers=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.02,0.56),lamb(0xffffff));papers.position.set(-0.95,0.97,0.05);scene.add(papers);
  const iv=suit(addFace(makePerson(rng(77),{shirt:0x3d4a6b,pants:0x2a2f3c,hair:0x55504a})),{glasses:true,tie:0x7b5cff});
  const ic=chairM(0x2f3440);ic.position.set(-2.0,0,0);ic.rotation.y=Math.PI/2;scene.add(ic);iv.position.set(-2.0,0.02,0);iv.rotation.y=Math.PI/2;sitPose(iv);scene.add(iv);
  iv.userData.arms.forEach(a=>a.rotation.x=-1.25);return iv}
S[6]=()=>{sky('#dfe6ef');const scene=new THREE.Scene();lights(scene,'day');const iv=interviewRoom(scene);
  const ap=suit(addFace(makePerson(rng(81),{shirt:0x2b2f3a,pants:0x2b2f3a})),{tie:0xc94f4f});seat(scene,ap,1.5,0,-Math.PI/2,0x2f3440);ap.userData.arms.forEach(a=>a.rotation.x=-0.9);setFace(ap,'smile');
  const helm=new THREE.Group();const hm=new THREE.Mesh(new THREE.SphereGeometry(0.3,40,20,0,Math.PI*2,0,Math.PI*0.5),smooth(0x8a8f99));helm.add(hm);
  const sp=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.25,10),smooth(0xc94f4f));sp.position.y=0.36;helm.add(sp);helm.position.y=0.3;
  const ghost=new THREE.Group();ghost.add(helm);ap.userData.head.add(ghost);
  const ba=bub(ap,'전생: 장군',{bg:'#ffb38a',fs:70,size:0.0036,y:2.5});
  const L=TMK[6].lines.i01;const tP=L[0]+3.95;const st=stampEl('합격',-1,99,{top:620});const c=vcam(46);
  const ch=chip('면접 1번 지원자');ch.style.top='120px';
  return t=>{look(c,[0.3,3.0,10.2-t*0.1],[0.1,1.5,0]);popEl(ch,t,0.1);
    scaleBubble(ba,pop((t-0.25)/0.3));ghost.visible=t>0.5;ghost.scale.setScalar(pop((t-0.5)/0.3)||0.001);
    iv.userData.head.rotation.x=t<1.5?0.3:0;iv.userData.head.rotation.y=Math.sin(t*1.4)*0.05;
    setFace(iv,t>tP?'smile':'flat');if(t>tP){ap.userData.arms[1].rotation.x=-2.6*ease((t-tP)/0.25);ap.userData.arms[1].rotation.z=0.3;setFace(ap,'open')}
    stampEl('합격',t,tP,{el:st});caption(6,t);renderer.render(scene,c)}};
