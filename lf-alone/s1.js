// ---------- D+ 카드 ----------
function dcard(si,num,sub,o={}){return()=>{sky('#0d0d12');ui.innerHTML='';const d=div('dcard',`<div class="d">D+${num}</div><div class="s">${sub}</div>`);
  if(o.tint)d.style.background=o.tint;const a=d.children[0],b=d.children[1];
  return t=>{renderer.clear();a.style.transform=`scale(${0.9+0.1*pop(t/0.4)})`;a.style.opacity=clamp01(t/0.25);b.style.opacity=clamp01((t-0.5)/0.3);b.style.transform=`translateY(${(1-ease((t-0.5)/0.4))*20}px)`;
    d.style.opacity=clamp01(Math.min(t/0.2,(DUR(si)-t)/0.3))}}}
// 0 타이틀: 작은 행성 위에 웅이 혼자
S[0]=()=>{sky('linear-gradient(#050816,#121a3d 60%,#26305e)');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0xffffff,0.5));
  const r=rng(11);stars(scene,900,r,{w:260,h:160,y0:-40,z:-120,size:0.5});
  const pl=new THREE.Group();scene.add(pl);
  const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(6,3),lamb(0x6fb0e0));pl.add(ball);
  for(let i=0;i<28;i++){const v=new THREE.Vector3(r()-0.5,r()-0.5,r()-0.5).normalize();const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2+r()*1.6,0),lamb(pick(r,[0x8cc96a,0x7dbb5e,0x9ad07a])));m.position.copy(v.multiplyScalar(5.6));m.scale.setScalar(1);pl.add(m)}
  for(let i=0;i<10;i++){const v=new THREE.Vector3(r()-0.5,r()*0.8+0.2,r()-0.5).normalize();const b=makeBuilding(r,0.8,1+r()*2.2,0.8);const h=new THREE.Group();h.add(b);h.position.copy(v.clone().multiplyScalar(5.9));h.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v);pl.add(h)}
  const w=woong();w.scale.setScalar(0.55);w.position.set(0,5.95,0);scene.add(w);setFace(w,'flat');
  const c=cam(38);ui.innerHTML='';const t1=div('ttl1 out','만약에'),t2=div('ttl2 out','지구에 나 혼자 남는다면?');
  return t=>{pl.rotation.y=t*0.12;pl.rotation.x=0.15;
    w.rotation.y=Math.sin(t*0.6)*0.6;w.userData.head.rotation.y=Math.sin(t*0.9)*0.4;
    look(c,[0,4.5-t*0.05,19-t*0.3],[0,4.2,0]);
    t1.style.transform=`scale(${pop((t-0.3)/0.4)})`;t1.style.opacity=clamp01((t-0.3)/0.1);t2.style.transform=`scale(${pop((t-0.8)/0.5)})`;t2.style.opacity=clamp01((t-0.8)/0.1);
    caption(0,t);renderer.render(scene,c)}};
S[1]=dcard(1,1,'첫째 날');
// 2 웅이 방 아침, 기지개
S[2]=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xfff0e0,0.3));
  const R=room(scene,{winSky:['#9cc8f2','#ffe2c4']});const w=woong();w.position.set(-3.6,0.62,-2.4);scene.add(w);
  const c=cam(40);const ch=chip('AM 8:00 · 평일 아침');
  return t=>{const k=ease((t-0.6)/1.2);// 누워 있다가 일어나 앉음
    w.rotation.x=lerp(-Math.PI/2,0,k);w.position.y=lerp(0.95,0.62,k);w.position.z=lerp(-2.0,-1.6,k);
    const st=ease((t-2.2)/0.6);sitPose(w);w.userData.hip.position.y=0.56;w.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);
    const ar=k*(0.6+0.4*Math.sin(clamp01((t-1.6)/1.5)*Math.PI));w.userData.arms[0].rotation.set(-2.9*ar,0,-0.3*ar);w.userData.arms[1].rotation.set(-2.9*ar,0,0.3*ar);
    setFace(w,t>1.4&&t<3.2?'open':'smile');R.blanket.position.z=lerp(0.75,1.2,k);
    look(c,[2.5,3.6,5.5],[-2.4,1.6,-2.0]);popEl(ch,t,0.2);caption(2,t);renderer.render(scene,c)}};
// 3 폰 단톡 조용
S[3]=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');const R=room(scene,{winSky:['#9cc8f2','#ffe2c4']});const w=woong();w.position.set(-3.6,0.62,-1.6);sitPose(w);scene.add(w);
  w.userData.arms[1].rotation.x=-1.6;w.userData.arms[0].rotation.x=-1.4;
  const c=cam(40);
  const ph=div('box',`<div style="padding:26px 30px;font-size:34px;border-bottom:2px solid #eee">채팅</div>`+
    [['동기 단톡 (34)','어제 PM 11:58','ㅋㅋㅋ 내일 봐~'],['우리 가족 (4)','어제 PM 10:21','다들 잘 자'],['동아리 (58)','어제 PM 11:40','내일 회의 10시!'],['헬스 같이 (6)','어제 PM 9:02','오늘 하체ㄱ'],['과제 조 (5)','어제 PM 11:59','자료 올렸어요']].map(([a,b,c2])=>`<div style="display:flex;justify-content:space-between;padding:18px 30px;border-bottom:1px solid #f0f0f0"><div><div style="font-size:30px">${a}</div><div style="font-size:24px;color:#888;font-weight:500">${c2}</div></div><div style="font-size:22px;color:#e2553f">${b}</div></div>`).join(''));
  Object.assign(ph.style,{left:'1150px',top:'110px',width:'560px',height:'700px',borderRadius:'44px',border:'16px solid #1b1b22',overflow:'hidden'});
  const tag=div('box','새 메시지 0개');Object.assign(tag.style,{left:'1260px',top:'830px',padding:'10px 30px',fontSize:'36px',background:'#ffd84d',borderRadius:'999px'});
  return t=>{look(c,[0.2,2.8,3.4],[-3.2,1.7,-1.6]);w.userData.head.rotation.x=0.35;setFace(w,t>1.5?'open':'flat');
    ph.style.transform=`translateY(${(1-ease(t/0.5))*600}px)`;popEl(tag,t,2.2,'');caption(3,t);renderer.render(scene,c)}};
// 4 창밖 텅 빈 아파트 단지, 그네만 흔들
S[4]=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const r=rng(4);ground(scene,0xb9c4a8);
  for(let i=0;i<5;i++){const b=makeBuilding(r,6,16+r()*6,4,{wall:'#e8ddd0'});b.position.set(-16+i*8,b.position.y,-14);scene.add(b)}
  const pg=new THREE.Mesh(new THREE.BoxGeometry(10,0.1,6),lamb(0xe8d3a0));pg.position.set(0,0.05,0);scene.add(pg);
  const sw=new THREE.Group();scene.add(sw);for(const x of[-1.5,1.5]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.15,3,0.15),lamb(0xe2553f));p.position.set(x,1.5,0);sw.add(p)}
  const bar=new THREE.Mesh(new THREE.BoxGeometry(3.3,0.15,0.15),lamb(0xe2553f));bar.position.y=3;sw.add(bar);
  const seat=new THREE.Group();seat.position.y=3;sw.add(seat);const sm=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.08,0.4),lamb(0x3a6fd0));sm.position.y=-2.2;seat.add(sm);
  for(const x of[-0.35,0.35]){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.03,2.2,0.03),lamb(0x999999));ch.position.set(x,-1.1,0);seat.add(ch)}
  const sl=new THREE.Mesh(new THREE.BoxGeometry(1,2,4),lamb(0xffd84d));sl.position.set(4,1,0);sl.rotation.x=0.5;scene.add(sl);
  tree(scene,-6,2,1.3);tree(scene,7,3,1.2);tree(scene,-8,-4,1.4);
  const c=cam(40);const ch=chip('AM 8:00 · 사람 0명');
  return t=>{seat.rotation.x=Math.sin(t*1.8)*0.35*Math.exp(-t*0.05);look(c,[0,9,18-t*0.25],[0,2,-3]);popEl(ch,t,0.3);caption(4,t);renderer.render(scene,c)}};
// 5 버스 정류장, 전광판 '곧 도착'
S[5]=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const r=rng(5);city(scene,r,{});
  const sh=new THREE.Group();sh.position.set(7.2,0,2);scene.add(sh);const roof=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.1,4),lamb(0x4f6a8a));roof.position.y=2.6;sh.add(roof);
  const back=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.4,4),new THREE.MeshLambertMaterial({color:0xbfd8ee,transparent:true,opacity:0.6}));back.position.set(0.75,1.3,0);sh.add(back);
  const bench=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.12,3),lamb(0x9a7a5a));bench.position.set(0.3,0.6,0);sh.add(bench);
  const bt=textTex([['100-1번  곧 도착',56,'#ffb02e']],{w:600,h:110,bg:'#111',fg:'#ffb02e'});const board=planeTex(1.5,0.28,bt,{basic:1});board.position.set(-0.05,2.35,0);board.rotation.y=-Math.PI/2;sh.add(board);
  const w=woong();w.position.set(6.2,0,3.2);w.rotation.y=-Math.PI/2+0.2;scene.add(w);
  const c=cam(40);const ch=chip('AM 8:12');
  return t=>{w.userData.head.rotation.y=Math.sin(t*1.3)*0.5;setFace(w,'flat');look(c,[2.5,2.4,9.5],[6.4,1.6,1.5]);popEl(ch,t,0.2);caption(5,t);renderer.render(scene,c)}};
// 6 도로 위 멈춘 차들, 문 열림
S[6]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(6);city(scene,r,{});
  const L=[];for(let i=0;i<9;i++){L.push([i%2?2.3:-2.3,6-i*7-r()*2,(r()-0.5)*0.3])}const C=cars(scene,r,L);
  C.forEach((c,i)=>{const d=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,1),lamb(0xdddddd));d.position.set(c.position.x+(i%2?-0.95:0.95)*1,0.8,c.position.z+0.4);d.rotation.y=(i%2?-1:1)*0.9;scene.add(d)});
  const c=cam(40);
  return t=>{look(c,[0,14-t*0.4,18-t*1.2],[0,0,-25]);caption(6,t);renderer.render(scene,c)}};
// 7 신호등 혼자 바뀜
S[7]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(7);city(scene,r,{});
  const cw=new THREE.Group();scene.add(cw);for(let i=0;i<8;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(1,4),basic(0xf2f2f2));s.rotation.x=-Math.PI/2;s.position.set(-4.4+i*1.25,0.015,0);cw.add(s)}
  const tl=new THREE.Group();tl.position.set(5.8,0,1.6);scene.add(tl);const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,3.6,8),lamb(0x555555));pole.position.y=1.8;tl.add(pole);
  const box=new THREE.Mesh(new THREE.BoxGeometry(0.5,1.0,0.3),lamb(0x222222));box.position.y=3.3;tl.add(box);
  const red=new THREE.Mesh(new THREE.CircleGeometry(0.16,16),basic(0xff3b3b)),grn=new THREE.Mesh(new THREE.CircleGeometry(0.16,16),basic(0x3bff7a));red.position.set(0,3.55,0.16);grn.position.set(0,3.05,0.16);tl.add(red,grn);
  const pigeon=new THREE.Group();const pb=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),lamb(0x8a8fa0));pb.scale.set(1,0.9,1.4);pigeon.add(pb);const ph=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),lamb(0x6a7080));ph.position.set(0,0.12,0.15);pigeon.add(ph);pigeon.position.set(0.5,0.15,0.5);scene.add(pigeon);
  const c=cam(38);
  return t=>{const g=Math.floor((t+0.5)/2.2)%2===0;red.material.color.set(g?0x4a1a1a:0xff3b3b);grn.material.color.set(g?0x3bff7a:0x1a3a24);
    pigeon.position.x=0.5+Math.sin(t*0.7)*0.8;pigeon.rotation.y=Math.sin(t*0.7)>0?1.2:-1.2;pigeon.position.y=0.15+Math.abs(Math.sin(t*5))*0.03;
    look(c,[1.5,1.6,7],[3.5,1.8,0]);caption(7,t);renderer.render(scene,c)}};
// 8 웅이 소리침, 메아리 + 비둘기 푸드덕
S[8]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(8);city(scene,r,{});cars(scene,r,[[-2.3,-8],[2.3,-20],[-2.3,-34]]);
  const w=woong();w.position.set(0,0,4);scene.add(w);const P=[];for(let i=0;i<10;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),lamb(0x8a8fa0));b.scale.set(1,0.9,1.4);g.add(b);g.position.set((r()-0.5)*6,0.15,-2-r()*6);scene.add(g);P.push({g,vx:(r()-0.5)*4,vz:-r()*3,vy:3+r()*3})}
  const E=['저기요…','…요','…요…'].map((s,i)=>{const e=div('out',s);Object.assign(e.style,{position:'absolute',fontSize:(70-i*14)+'px',left:(980+i*180)+'px',top:(200+i*90)+'px',opacity:0});return e});
  const c=cam(40);const T0=endOf(8,'j04');
  return t=>{const sh=t>at(8,'j04')&&t<T0;setFace(w,sh?'open':'flat');w.userData.arms.forEach((a,i)=>{a.rotation.x=sh?-2.0:0;a.rotation.z=sh?(i?0.6:-0.6):0});
    const fk=clamp01((t-at(8,'j04')-0.4));P.forEach(q=>{if(fk>0){const tt=t-at(8,'j04')-0.4;q.g.position.set(q.g.position.x+q.vx*0.033,0.15+q.vy*tt-2*tt*tt*0.5+0.0,q.g.position.z+q.vz*0.033);q.g.position.y=Math.max(0.15,0.15+q.vy*tt-1.2*tt*tt)}});
    E.forEach((e,i)=>{const t0=T0+0.3+i*0.6;e.style.opacity=clamp01((t-t0)/0.2)*clamp01((t0+1.4-t)/0.4)});
    const k=ease((t-T0)/3);look(c,lerp3([0,1.8,8],[0,9,16],k),[0,1.6-0*k,-6]);caption(8,t);renderer.render(scene,c)}};
// 9 스마트 스피커에게 뉴스
S[9]=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');const R=room(scene,{winSky:['#9cc8f2','#ffe2c4']});const w=woong();w.position.set(3.1,0,-2.0);w.rotation.y=Math.PI*0.95;scene.add(w);
  const c=cam(36);
  return t=>{const sp=t>at(9,'s01')&&t<endOf(9,'s01');R.ring.material.color.set(sp?(Math.sin(t*20)>0?0x55d8ff:0x2a8ab8):0x2a6a8a);setFace(w,t>at(9,'j05')&&t<endOf(9,'j05')?'open':'flat');
    w.rotation.y=Math.PI*0.75;look(c,[5.6,2.8,1.2],[3.6,1.9,-3.6]);caption(9,t);renderer.render(scene,c)}};
// 10 웅이 표정이 씨익
S[10]=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');room(scene,{winSky:['#9cc8f2','#ffe2c4']});const w=woong();w.position.set(1,0,0.5);scene.add(w);
  const sp=[];const r=rng(10);for(let i=0;i<14;i++){const s=textSprite('✦',80,'#ffe066',0.004);s.position.set((r()-0.5)*2.4,1.4+r()*1.8,0.6+r()*0.3);scene.add(s);sp.push(s)}
  const c=cam(34);
  return t=>{const k=t>at(10,'j06')+1.2;setFace(w,k?'smile':'flat');w.userData.arms.forEach((a,i)=>{const u=k?ease((t-at(10,'j06')-1.2)/0.5):0;a.rotation.x=-2.6*u;a.rotation.z=(i?0.7:-0.7)*u});
    sp.forEach((s,i)=>{const kk=k?Math.abs(Math.sin(t*3+i)):0;s.scale.set(s.userData.base[0]*kk,s.userData.base[1]*kk,1)});
    const z=ease(t/DUR(10));look(c,[1,2.1,5.5-z*1.6],[1,1.75,0.5]);caption(10,t);renderer.render(scene,c)}};
