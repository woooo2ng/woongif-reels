S.c7=chap('c7',7,'세상의 변화');
// ---------- 7. 세상의 변화 ----------
S.v1=()=>{sky('#1a1d2e');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.4));box(scene,20,0.2,10,0x2a2f4a,0,-0.1,0);
  const bg=planeTex(12,5,canvasTex(600,250,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#2a4a8a');g.addColorStop(1,'#6a3a8a');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.15)';for(let i=0;i<20;i++)x.fillRect(i*30,0,4,h)}),{basic:1});bg.position.set(0,3,-3);scene.add(bg);
  box(scene,3.6,1.1,1.2,0xe8e8f0,0,0.55,0);const an=P(7100,{shirt:0x3a3a5a,pants:0x2a2a3a,hair:0x1d1d24,long:true});an.position.set(0,0,-0.6);scene.add(an);
  const nw=div('news','속마음 현상 일주일째');nw.style.top='880px';const b=think(an,'원고 오타 났다',{size:0.0042});const c=cam(36);
  return t=>{popT(b,t,MK('v1',0));setFace(an,t>MK('v1',0)?'flat':'smile');look(c,[0,2.2,5],[0,1.9,-0.6]);caption('v1',t);renderer.render(scene,c)}};
S.v2=()=>{sky('#1a2a1e');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0xffffff,0.4));box(scene,24,0.2,14,0x3a2a2a,0,-0.1,0);
  for(let i=0;i<4;i++){const tb=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.15,24),lamb(0x2a7a4a));tb.position.set(-6+i*4,1.0,-1);scene.add(tb);box(scene,0.3,1,0.3,0x5a3a2a,-6+i*4,0.5,-1);for(let k=0;k<4;k++)box(scene,0.4,0.6,0.4,0x5a3a2a,-6+i*4+Math.cos(k*1.57)*1.8,0.3,-1+Math.sin(k*1.57)*1.8)}
  const bn=planeTex(10,1.8,textTex([['포커 대회 전면 취소',100,'#fff']],{w:1000,h:180,bg:'#c94f4f'}),{basic:1});bn.position.set(0,4.5,-5);scene.add(bn);const c=cam(42);
  return t=>{bn.rotation.z=Math.sin(t*1.2)*0.02;look(c,[0,5,9-t*0.2],[0,2,-2]);caption('v2',t);renderer.render(scene,c)}};
function livingRoom(scene){room(scene,{});box(scene,3,0.6,1.2,0x6c8ebf,-2.5,0.3,-3.6);box(scene,3,0.9,0.3,0x6c8ebf,-2.5,0.75,-4.15)}
S.v3=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');livingRoom(scene);const fr=box(scene,1.4,2.6,1.0,0xdfe6ec,3.0,1.3,-2.6);
  const kid=P(7300,{shirt:0xffd84d,hair:0x2a2220,s:0.65});kid.position.set(3.0,0,-3.6);kid.rotation.y=0;scene.add(kid);kid.userData.hip.position.y=0.55;kid.userData.legs.forEach(l=>l.rotation.x=-1.3);
  const sk=P(7301,{shirt:0x8cc96a,hair:0x4a3426,s:0.65});sk.position.set(-1,0,1.5);sk.rotation.y=Math.PI*0.8;scene.add(sk);const b=think(kid,'냉장고 뒤에 있음',{size:0.0075,y:4.6});const c=cam(42);
  return t=>{popT(b,t,MK('v3',0));const go=t>at('v3','a01');sk.userData.arms[1].rotation.x=go?-2.6:0;setFace(sk,go?'open':'smile');setFace(kid,go?'open':'smile');look(c,[0.0,2.9,4.6],[1.8,2.0,-2.6]);caption('v3',t);renderer.render(scene,c)}};
S.v4=()=>{sky('#2a2420');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0x9aa6d8,0x302820,1.1));livingRoom(scene);const r=rng(74);const F=[];
  for(let i=0;i<6;i++){const p=P(7400+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(-4.5+i*1.1,0,-3.3+(i%2)*0.3);p.userData.hip.position.y=0.5;p.userData.legs.forEach(l=>l.rotation.x=-1.4);scene.add(p);F.push(think(p,'서프라이즈!!',{size:0.0055,y:1.9+(i%2)*0.7}));
    const cone=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.35,10),lamb(pick(r,[0xe2553f,0xffd84d,0x3a8fd0])));cone.position.y=0.62;p.userData.head.add(cone)}
  const ck=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.4,20),lamb(0xffffff));ck.position.set(1.5,1.2,0.5);scene.add(ck);table(scene,1.5,0.5,1.4,1.2);
  const door=box(scene,1.4,3,0.1,0x8a6a4a,5.8,1.5,1.5);door.rotation.y=Math.PI/2;
  const w=woong();w.position.set(7.2,0,1.5);w.rotation.y=-Math.PI/2;scene.add(w);const bw=think(w,'모른 척해야지',{size:0.0055});const c=cam(48);
  return t=>{F.forEach((b,i)=>popT(b,t,MK('v4',0)+i*0.12));popT(bw,t,MK('v4',1));setFace(w,'smile');look(c,[1.2,3.6,7.5],[1.2,2.0,-0.8]);caption('v4',t);renderer.render(scene,c)}};
S.v5=()=>{sky('#2a2420');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfff0d0,0x403020,1.2));livingRoom(scene);const r=rng(74);const F=[];
  for(let i=0;i<6;i++){const p=P(7400+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(2+i*0.8,0,-0.5+(i%2)*1.2);p.rotation.y=Math.PI/2;scene.add(p);F.push(p)}
  const w=woong();w.position.set(-0.2,0,0.6);w.rotation.y=0.3;scene.add(w);const bw=think(w,'알았음',{size:0.0045});
  const conf=[];for(let i=0;i<40;i++){const cf=new THREE.Mesh(new THREE.PlaneGeometry(0.08,0.12),new THREE.MeshBasicMaterial({color:pick(r,[0xe2553f,0xffd84d,0x3a8fd0,0x8cc96a,0xf28bc0]),side:THREE.DoubleSide}));cf.userData={x:(r()-0.5)*4,z:(r()-0.5)*3,ph:r()};scene.add(cf);conf.push(cf)}
  const c=cam(40);
  return t=>{const go=t>at('v5','a02');F.forEach(p=>{p.userData.arms.forEach((a,i)=>{a.rotation.x=go?-2.8:0;a.rotation.z=go?(i?0.4:-0.4):0});setFace(p,go?'open':'smile')});
    conf.forEach(cf=>{const lt=(t-at('v5','a02'))*0.5+cf.userData.ph*0.3;cf.visible=go;cf.position.set(cf.userData.x,3.5-lt*2.5,cf.userData.z);cf.rotation.set(t*5+cf.userData.ph*9,t*3,0)});
    w.userData.arms.forEach((a,i)=>{const s=t>at('v5','j09');a.rotation.x=s?-2.6:0;a.rotation.z=s?(i?0.5:-0.5):0});setFace(w,t>at('v5','j09')?'open':'flat');popT(bw,t,MK('v5',0));look(c,[0.6,2.6,5.4],[0.6,1.8,0]);caption('v5',t);renderer.render(scene,c)}};
S.v6=()=>{sky('#fff0f5');const big=div('box','<div style="font-size:150px">🎉</div><div style="font-size:70px">깜짝 파티</div>');big.firstChild.textContent='✕';big.firstChild.style.color='#e23b3b';
  Object.assign(big.style,{left:'560px',top:'160px',width:'800px',padding:'40px',textAlign:'center'});const s2=div('box','<div style="font-size:60px;color:#7a5ad0">모른 척 연기 ▲ 300%</div>');Object.assign(s2.style,{left:'560px',top:'600px',width:'800px',padding:'26px',textAlign:'center'});
  return t=>{renderer.clear();popEl(big,t,0.2,'');popEl(s2,t,at('v6','n16')+1.4,'');caption('v6',t)}};
S.v7=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0x8cc96a);const r=rng(77);for(let i=0;i<8;i++)tree(scene,(r()-0.5)*24,-4-r()*10,1.4);
  const D=[dog({collar:true}),dog({col:0x8a6a4a,dark:0x5a3a2a}),dog({col:0x3a3a3a,dark:0x222222})];D.forEach((d,i)=>{d.position.set(-2.5+i*1.4,0,0.6);d.rotation.y=0.3;scene.add(d)});
  const ct=catM(0xff9a3c);ct.position.set(2.6,0,0.4);ct.rotation.y=-0.6;scene.add(ct);
  const B=[...D.map(d=>think(d,'간식 간식 간식',{size:0.0034,y:1.0})),think(ct,'귀찮아',{size:0.0036,y:0.9})];const c=cam(38);
  return t=>{D.forEach((d,i)=>dogWag(d,t+i));B.forEach((b,i)=>popT(b,t,MK('v7',0)+i*0.3));look(c,[0,1.9,6],[0,0.9,0]);caption('v7',t);renderer.render(scene,c)}};
S.v8=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(78);ground(scene,0xd8d2c6);const sh=makeBuilding(r,10,8,6,{wall:'#f2e6d3'});sh.position.set(0,4,-5);scene.add(sh);
  const sg=planeTex(7,1.2,textTex([['속마음 가리는 모자',70,'#fff']],{w:700,h:120,bg:'#7a5ad0'}),{basic:1});sg.position.set(0,6.2,-1.95);scene.add(sg);
  const so=planeTex(2.4,0.9,textTex([['품절',90,'#fff']],{w:240,h:90,bg:'#e23b3b'}),{basic:1});so.position.set(2.5,4.6,-1.9);so.rotation.z=-0.2;scene.add(so);
  const Q=[];for(let i=0;i<10;i++){const p=P(7800+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(-4+i*0.9,0,1+(i%2)*0.3);p.rotation.y=Math.PI*0.9;scene.add(p);Q.push(p)}
  const c=cam(42);return t=>{so.visible=t>at('v8','n18')+1;look(c,[3,3,10],[0,2.5,-1]);caption('v8',t);renderer.render(scene,c)}};
S.v9=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(79);city(scene,r,{});const p=P(7900,{shirt:0x6c8ebf,hair:0x2a2220});p.position.set(0,0,4);scene.add(p);
  const hat=new THREE.Group();p.userData.head.add(hat);hat.position.y=0.42;const brim=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.03,24),lamb(0x7a5ad0));hat.add(brim);const top=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.26,0.36,20),lamb(0x7a5ad0));top.position.y=0.18;hat.add(top);
  const b=think(p,'효과 없네',{size:0.0042,y:2.6});const c=cam(36);
  return t=>{popT(b,t,MK('v9',0));setFace(p,t>MK('v9',0)?'flat':'smile');look(c,[0,2.4,8],[0,2.3,4]);caption('v9',t);renderer.render(scene,c)}};
S.c8=chap('c8',8,'마음');
// ---------- 8. 마음 ----------
const FRIEND=()=>P(8100,{shirt:0x8cc96a,hair:0x2a2220});
function street2(scene,seed){const r=rng(seed);city(scene,r,{});}
S.r1=()=>{sky('dusk');const scene=new THREE.Scene();lights(scene,'dusk');street2(scene,81);const f=FRIEND();f.position.set(0.7,0,4);f.rotation.y=-0.7;scene.add(f);const w=woong();w.position.set(-0.7,0,4.2);w.rotation.y=0.7;scene.add(w);
  const b=think(f,'서운함',{size:0.0045});const c=cam(36);
  return t=>{popT(b,t,MK('r1',0));setFace(f,'smile');setFace(w,t>MK('r1',0)+0.3?'open':'smile');w.userData.arms[1].rotation.set(-1.0,0,0.4);look(c,[0,2.3,8.2],[0,1.9,4.1]);caption('r1',t);renderer.render(scene,c)}};
S.r2=()=>{sky('dusk');const scene=new THREE.Scene();lights(scene,'dusk');street2(scene,81);const f=FRIEND();f.position.set(0.7,0,4);f.rotation.y=-0.7;scene.add(f);const w=woong();w.position.set(-0.7,0,4.2);w.rotation.y=0.7;scene.add(w);
  const b0=think(f,'서운함',{size:0.0042});scaleBubble(b0,1);const b=think(f,'괜찮아졌다',{size:0.0045});const c=cam(34);
  return t=>{const ok=t>MK('r2',0);scaleBubble(b0,ok?0:1);popT(b,t,MK('r2',0));setFace(f,ok?'smile':'flat');w.userData.hip.rotation.x=t>at('r2','j10')&&!ok?0.35:0;setFace(w,'flat');
    look(c,[-1.6,2.2,7.6],[0.2,1.9,4]);caption('r2',t);renderer.render(scene,c)}};
S.r3=()=>{sky('#f6efe6');const pairs=[['괜찮아','서운함'],['미안해','진짜 미안해']];const d=div('box','<div style="font-size:60px">사과까지 걸린 시간</div><div class="v" style="font-size:160px;color:#7a5ad0">3일</div>');
  Object.assign(d.style,{left:'560px',top:'170px',width:'800px',padding:'40px',textAlign:'center'});
  return t=>{renderer.clear();const k=ease((t-0.5)/1.5);d.querySelector('.v').textContent=k<0.5?'3일':(k<0.85?'3시간':'3초');caption('r3',t)}};
S.r4=()=>{sky('#eef4f6');const scene=new THREE.Scene();lights(scene,'day');interior(scene,{floor:0xdfe8ea,wall:0xf2f8f8});box(scene,3,0.5,0.8,0x9fc6e0,-3,0.25,-6.5);
  const n=P(8400,{shirt:0x9fd8d0,pants:0x9fd8d0,hair:0x1d1d24,bun:true});n.position.set(0,0,-1);scene.add(n);n.userData.hip.position.y=0.55;n.userData.legs.forEach(l=>l.rotation.x=-1.4);box(scene,2,0.5,0.6,0x9fc6e0,0,0.25,-1.4);
  const b=think(n,'힘들다',{size:0.0045});const r=rng(84);const V=[];for(let i=0;i<4;i++){const p=P(8410+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});scene.add(p);V.push(p)}
  const cups=[];for(let i=0;i<4;i++){const cp=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.16,10),lamb(0xffffff));cp.position.set(-0.8+i*0.32,0.58,-1.2);scene.add(cp);cups.push(cp)}
  const c=cam(40);
  return t=>{popT(b,t,MK('r4',0));setFace(n,cups.some(c2=>c2.visible)?'smile':'flat');V.forEach((p,i)=>{const t0=MK('r4',0)+1.0+i*1.0;const a=clamp01((t-t0)/0.9),l=clamp01((t-t0-1.3)/0.9);const tx=-0.8+i*0.32;p.position.set(l>0?lerp(tx,-7,l):lerp(-7,tx,a),0,0.2);p.rotation.y=l>0?-Math.PI/2:Math.PI/2;if(a>=1&&l<=0)p.rotation.y=Math.PI;walkPose(p,t*6,(a>0&&a<1)||(l>0&&l<1)?0.5:0);p.visible=a>0&&l<1;cups[i].visible=a>=1});
    look(c,[2.5,2.4,4.5],[-0.4,1.3,-1]);caption('r4',t);renderer.render(scene,c)}};
S.r5=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0xa9c48a);const pg=new THREE.Mesh(new THREE.BoxGeometry(14,0.1,8),lamb(0xe8d3a0));pg.position.y=0.05;scene.add(pg);
  box(scene,1.8,0.1,0.5,0x8a6a4a,-2,0.6,0);const kid=P(8500,{shirt:0xf2b8c6,hair:0x2a2220,s:0.65,long:true});kid.position.set(-2,0,0.1);sitPose(kid);scene.add(kid);
  const r=rng(85);const K=[];for(let i=0;i<3;i++){const p=P(8510+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),s:0.65});p.position.set(1.5+i*0.9,0,0.6);p.rotation.y=-Math.PI/2;scene.add(p);K.push(p)}
  const b=think(kid,'같이 놀고 싶다',{size:0.0042,y:2.0});const c=cam(38);
  return t=>{popT(b,t,MK('r5',0));const go=t>at('r5','a03')-0.6;K.forEach((p,i)=>{p.position.x=go?lerp(1.5+i*0.9,-0.8+i*0.5,clamp01((t-at('r5','a03')+0.6)/0.8)):1.5+i*0.9;walkPose(p,t*6,0.4);if(i==0)p.userData.arms[1].rotation.x=go?-1.5:0});
    setFace(kid,t>at('r5','a03')+0.3?'smile':'flat');look(c,[-0.3,2.0,4.6],[-0.3,1.2,0]);caption('r5',t);renderer.render(scene,c)}};
S.c9=chap('c9',9,'1년 뒤');
// ---------- 9. 1년 뒤 ----------
S.y1=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(91);city(scene,r,{});const ppl=crowd(scene,24,[-4.5,4.5,-20,4],91);
  const TX=['저녁 뭐 먹지','오늘 좋았다','고마워','보고 싶다','배고파','행복해','수고했어','내일 또 보자'];const B=ppl.map((p,i)=>think(p,TX[i%TX.length],{size:0.0042}));
  ppl.forEach((p,i)=>{p.userData.ph=r()*6;p.userData.dir=i%2?1:-1;p.rotation.y=i%2?0:Math.PI;setFace(p,'smile')});const c=cam(42);
  return t=>{ppl.forEach(p=>{walkPose(p,t*5+p.userData.ph,0.45);p.position.z+=p.userData.dir*0.01});B.forEach((b,i)=>popT(b,t,i*0.08));look(c,[0,4,12-t*0.2],[0,2,-4]);caption('y1',t);renderer.render(scene,c)}};
function phoneCall(t,key,o){// 위아래 분할: 위 웅이 방 / 아래 엄마 집
  return null}
S.y2=()=>{sky('#2a2420');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfff0d0,0x403020,1.0));room(scene,{winSky:['#e98a7f','#ffc58c']});
  const w=woong();w.position.set(-0.8,0,0.5);w.rotation.y=0.25;scene.add(w);const ph=box(w.userData.arms[1],0.14,0.24,0.03,0x222222,0,-0.68,0.12);w.userData.arms[1].rotation.x=-1.4;
  const v=div('box','');Object.assign(v.style,{left:'1180px',top:'120px',width:'520px',height:'700px',borderRadius:'40px',border:'14px solid #1b1b22',overflow:'hidden',background:'#f3e6d3'});
  const cv=document.createElement('canvas');cv.width=520;cv.height=700;v.appendChild(cv);const x=cv.getContext('2d');
  // 엄마 얼굴 간단히 그리기
  const drawMom=(talk)=>{x.fillStyle='#f3e6d3';x.fillRect(0,0,520,700);x.fillStyle='#f2a3b8';x.fillRect(110,470,300,260);x.fillStyle='#f3cfae';x.beginPath();x.arc(260,330,150,0,7);x.fill();x.fillStyle='#3a2a22';x.beginPath();x.arc(260,290,160,Math.PI*1.05,Math.PI*1.95);x.fill();x.beginPath();x.arc(260,150,55,0,7);x.fill();
    x.fillStyle='#1a1a1a';x.fillRect(200,320,20,28);x.fillRect(300,320,20,28);x.fillStyle='#f2a3a3';x.fillRect(170,380,40,14);x.fillRect(310,380,40,14);x.strokeStyle='#5a2a2a';x.lineWidth=8;x.beginPath();if(talk){x.ellipse(260,410,22,16,0,0,7)}else{x.arc(260,395,30,0.2,Math.PI-0.2)}x.stroke();
    x.fillStyle='#222';x.font='900 30px '+FONT;x.textAlign='center';x.fillText('엄마',260,50)};
  const c=cam(36);
  return t=>{const mt=t>at('y2','e03')&&t<endOf('y2','e03');drawMom(mt&&Math.sin(t*20)>0);setFace(w,t>at('y2','j11')&&t<endOf('y2','j11')?'open':'smile');popEl(v,t,0.1,'');look(c,[0.6,2.2,4.2],[-0.4,1.9,0.5]);caption('y2',t);renderer.render(scene,c)}};
S.y3=()=>{sky('#2a2420');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfff0d0,0x403020,1.0));
  // 왼쪽 웅이 방, 오른쪽 엄마 집 (나란히)
  const g1=new THREE.Group();scene.add(g1);const g2=new THREE.Group();g2.position.x=9;scene.add(g2);
  box(g1,8,0.2,6,0xd9b98a,0,-0.1,0);box(g1,8,5,0.2,0xf1e6d6,0,2.5,-3);box(g2,8,0.2,6,0xc9a978,0,-0.1,0);box(g2,8,5,0.2,0xf3d6c6,0,2.5,-3);
  const w=woong();w.position.set(0,0,0);g1.add(w);w.userData.arms[1].rotation.x=-1.4;box(w.userData.arms[1],0.14,0.24,0.03,0x222222,0,-0.68,0.12);
  const m=MOM();m.position.set(0,0,0);g2.add(m);m.userData.arms[1].rotation.x=-1.4;box(m.userData.arms[1],0.14,0.24,0.03,0x222222,0,-0.68,0.12);
  const b1=think(w,'보고 싶다',{size:0.0045}),b2=think(m,'보고 싶다',{size:0.0045});const ln=new THREE.Mesh(new THREE.BoxGeometry(0.06,6,0.1),basic(0xffffff));ln.position.set(4.5,2.5,0.5);scene.add(ln);const c=cam(42);
  return t=>{popT(b1,t,MK('y3',0));popT(b2,t,MK('y3',1));setFace(w,'smile');setFace(m,'smile');look(c,[4.5,2.4,9.5],[4.5,1.9,0]);caption('y3',t);renderer.render(scene,c)}};
S.y4=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const R=myRoom(scene);const w=woong();w.position.set(-3.6,0.95,-2.0);w.rotation.x=-Math.PI/2;scene.add(w);
  const ck=planeTex(2,0.7,textTex([['D+365 · AM 7:30',50,'#26307a']],{w:400,h:140,bg:'#fff',r:30}),{basic:1});ck.position.set(3.6,3.2,-4.85);scene.add(ck);
  const al=textSprite('♪ 따르릉',70,'#e2553f',0.004);al.position.set(-3.6,1.9,-3.4);scene.add(al);const c=cam(40);
  return t=>{al.position.y=1.9+Math.abs(Math.sin(t*10))*0.08;look(c,[1.5,3.3,4.5],[-3,1.6,-2.2]);caption('y4',t);renderer.render(scene,c)}};
S.y5=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');myRoom(scene);const w=woong();w.position.set(-3.6,0.62,-1.6);sitPose(w);w.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);scene.add(w);
  const q=textSprite('?',120,'#7a5ad0',0.005);q.position.set(-3.6,2.6,-1.6);scene.add(q);const c=cam(36);
  return t=>{const k=t>MK('y5',0);w.userData.head.rotation.x=k?-0.5:0;w.userData.arms[1].rotation.set(k?-2.9:0,0,0);setFace(w,'open');q.visible=t>at('y5','j12');look(c,[-1.2,2.4,2.4],[-3.6,1.9,-1.6]);caption('y5',t);renderer.render(scene,c)}};
S.y6=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const r=rng(96);city(scene,r,{});const ppl=crowd(scene,26,[-4.5,4.5,-20,4],96);
  const TX=['출근하기 싫다','배고파','오늘 날씨 좋다','커피…','졸려','보고 싶다'];const B=ppl.map((p,i)=>think(p,TX[i%TX.length],{size:0.0042}));
  const P2=[];for(let i=0;i<26;i++){const ps=textSprite('펑!',70,'#ffffff',0.005);ps.position.copy(ppl[i].position);ps.position.y=2.6;scene.add(ps);P2.push(ps)}const c=cam(42);
  return t=>{const t0=at('y6','n23')+1.5;B.forEach((b,i)=>{const ti=t0+i*0.12;scaleBubble(b,t<ti?1:0);const k=clamp01((t-ti)/0.35);const pk=k>0&&k<1;P2[i].visible=pk;if(pk){const s=pop(k)*(1-k);P2[i].scale.set(P2[i].userData.base[0]*(0.5+s),P2[i].userData.base[1]*(0.5+s),1)}});
    look(c,[0,4,12],[0,2,-4]);caption('y6',t);renderer.render(scene,c)}};
S.y7=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const r=rng(97);city(scene,r,{});const ppl=crowd(scene,8,[-3,3,1,5],97);ppl.forEach(p=>setFace(p,'flat'));
  const Q=ppl.map(p=>{const q=textSprite('…',90,'#ffffff',0.005);q.position.y=2.4;p.add(q);return q});const c=cam(38);
  return t=>{ppl.forEach((p,i)=>{p.userData.head.rotation.y=Math.sin(t*1.2+i)*0.5});look(c,[0,2.6,10],[0,1.9,3]);caption('y7',t);renderer.render(scene,c)}};
S.y8=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');myRoom(scene);const w=woong();w.position.set(0.5,0,0.5);scene.add(w);box(w.userData.arms[1],0.14,0.24,0.03,0x222222,0,-0.68,0.12);const c=cam(32);
  return t=>{const up=ease((t-0.3)/0.6);w.userData.arms[1].rotation.x=-1.0-1.4*up*(t>at('y8','j13')-0.5?1:0.6);w.userData.arms[1].rotation.z=0.25;setFace(w,t>at('y8','j13')?'smile':'flat');look(c,[0.8,2.2,3.4],[0.4,2.0,0.5]);caption('y8',t);renderer.render(scene,c)}};
S.y9=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(99);city(scene,r,{});const ppl=[];
  for(let i=0;i<5;i++){const a=P(9900+i*2,{shirt:pick(r,SHIRT),hair:pick(r,HAIR)}),b=P(9901+i*2,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:true});a.position.set(-4+i*2,0,2-i*3);b.position.set(-3.2+i*2,0,2-i*3);a.rotation.y=Math.PI/2-0.3;b.rotation.y=-Math.PI/2+0.3;scene.add(a,b);ppl.push(a,b)}
  const S2=['고마워','미안해','보고 싶었어','사랑해','수고했어'];const L=ppl.filter((p,i)=>i%2==0).map((p,i)=>{const s=makeBubble(S2[i],{bg:'#ffffff',fs:60,size:0.0038});s.position.y=2.2;p.add(s);scaleBubble(s,0);return s});const c=cam(42);
  return t=>{ppl.forEach(p=>setFace(p,'smile'));L.forEach((s,i)=>scaleBubble(s,pop((t-0.4-i*0.5)/0.35)));look(c,[2,3.6,10],[0,1.9,-3]);caption('y9',t);renderer.render(scene,c)}};
S.y10=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0x8090c0,0.5));const r=rng(100);ground(scene,0x1a1d2e);stars(scene,900,r,{w:300,h:160,y0:10,z:-120,size:0.5});
  for(let i=0;i<8;i++){const b=makeBuilding(r,6,6+r()*10,6,{lit:0.5,win:'#1c2240',wall:'#3a3f5a'});b.position.set(-21+i*6,b.position.y,-12);scene.add(b)}
  const w=woong();w.position.set(0,0,2);scene.add(w);const e=think(w,'   ',{size:0.0045});scene.add(new THREE.PointLight(0xfff0d0,8,10).translateY(4).translateZ(5));const c=cam(40);
  const q1=div('ttl1 out','지금 여러분 머리 위에는');q1.style.top='120px';q1.style.fontSize='80px';const q2=div('ttl2 out','어떤 말풍선이 떠 있나요?');q2.style.top='230px';q2.style.fontSize='110px';q2.style.color='#c9b6ff';
  const q3=div('ttl1 out','댓글로 알려 주세요!');q3.style.top='400px';q3.style.fontSize='54px';
  return t=>{popT(e,t,0.4);w.userData.arms[0].rotation.set(-2.6,0,-0.4+Math.sin(t*5)*0.3);setFace(w,'smile');look(c,[0,2.4,8-t*0.1],[0,3.0,2]);
    [q1,q2,q3].forEach((q,i)=>{const t0=endOf('y10','n26')+0.2+i*0.4;q.style.transform=`scale(${pop((t-t0)/0.4)})`;q.style.opacity=clamp01((t-t0)/0.1)});const cp=ui.querySelector('.cap');if(cp&&t>endOf('y10','n26'))cp.style.display='none';renderer.render(scene,c)}};
