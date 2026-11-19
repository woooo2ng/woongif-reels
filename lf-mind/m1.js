// ---------- 오프닝 ----------
S.o1=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const r=rng(1);city(scene,r,{});
  const cw=new THREE.Group();scene.add(cw);for(let i=0;i<8;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(1,5),basic(0xf2f2f2));s.rotation.x=-Math.PI/2;s.position.set(-4.4+i*1.25,0.015,0);cw.add(s)}
  const ppl=crowd(scene,22,[-4.5,4.5,-2.5,2.5],7,{ry:0});ppl.forEach((p,i)=>{p.rotation.y=(i%2?0:Math.PI)+(r()-0.5)*0.3;p.userData.ph=r()*6;p.userData.dir=i%2?1:-1});
  const TX=['배고파','월요일 싫어','집 가고 싶다','저 사람 신발 예쁘다','5분만 더 잘걸','오늘 칼퇴','커피…','지각이다','점심 뭐 먹지','다이어트 내일부터'];
  const B=ppl.slice(0,10).map((p,i)=>think(p,TX[i],{size:0.0036}));
  const c=cam(42);const t1=div('ttl1 out','만약에');t1.style.top='70px';const t2=div('ttl2 out','모두의 속마음이 보인다면?');t2.style.top='190px';t2.style.fontSize='120px';t2.style.color='#c9b6ff';
  return t=>{ppl.forEach(p=>{walkPose(p,t*5+p.userData.ph,0.45);p.position.z+=p.userData.dir*0.012});
    B.forEach((b,i)=>popT(b,t,0.3+i*0.18));look(c,[0,5.5,13-t*0.3],[0,2.2,0]);
    t1.style.transform=`scale(${pop((t-MK('o1',0)-1.6)/0.4)})`;t1.style.opacity=clamp01((t-MK('o1',0)-1.6)/0.1);t2.style.transform=`scale(${pop((t-MK('o1',0)-2.0)/0.5)})`;t2.style.opacity=clamp01((t-MK('o1',0)-2.0)/0.1);
    caption('o1',t);renderer.render(scene,c)}};
S.o2=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');const r=rng(2);city(scene,r,{});const ppl=crowd(scene,40,[-5,5,-30,4],8);
  const TX=['예의상 웃는 중','하나도 안 웃김','거짓말임','사실 안 바쁨','다 들었어','어색해','배불러','배고파','누구더라…','이름 까먹음','빨리 가고 싶다','안 친함'];
  const B=ppl.map((p,i)=>think(p,TX[i%TX.length],{size:0.0045}));const c=cam(45);
  return t=>{B.forEach((b,i)=>popT(b,t,i*0.06));const k=ease(t/DUR('o2'));look(c,[0,4+k*16,10+k*6],[0,2,-10]);caption('o2',t);renderer.render(scene,c)}};
S.c1=chap('c1',1,'아침 집');
// ---------- 1. 아침 집 ----------
function myRoom(scene,o={}){return room(scene,{winSky:o.night?['#0a0f2a','#1a2048']:['#9cc8f2','#ffe2c4'],winCity:o.night?'#0e1224':undefined,screenOff:o.screenOff})}
S.h1=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');const R=myRoom(scene);const w=woong();w.position.set(-3.6,0.95,-2.0);w.rotation.x=-Math.PI/2;scene.add(w);
  const b=think(w,'5분만…',{size:0.0048,y:0,z:0});b.position.set(0,0.2,0.9);// 누운 머리 위
  const bb=think(null,'5분만…',{size:0.005});bb.position.set(-3.6,1.7,-3.0);scene.add(bb);w.remove(b);
  const ch=chip('AM 7:30');const c=cam(40);
  return t=>{popT(bb,t,MK('h1',0));const up=t>at('h1','j01')-0.1;w.rotation.x=up?lerp(-Math.PI/2,0,ease((t-at('h1','j01')+0.1)/0.3)):-Math.PI/2;w.position.y=up?0.62:0.95;if(up){sitPose(w);w.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2)}
    bb.position.set(-3.6,up?2.35:1.7,up?-2.0:-3.0);setFace(w,up?'open':'flat');popEl(ch,t,0.2);look(c,[1.5,3.3,4.5],[-3,1.6,-2.2]);caption('h1',t);renderer.render(scene,c)}};
S.h2=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');myRoom(scene);const w=woong();w.position.set(0.5,0,0.5);scene.add(w);
  const b=think(w,'큰일 났다',{size:0.004});const fake=think(w,'5분만…',{size:0.004});const c=cam(36);
  return t=>{const sw=t<MK('h2',0);w.userData.arms[1].rotation.set(sw?-2.7:-0.2,0,sw?0.3+Math.sin(t*14)*0.5:0);w.userData.arms[0].rotation.set(sw?-2.7:-0.2,0,sw?-0.3-Math.sin(t*14+1)*0.5:0);
    setFace(w,'open');scaleBubble(fake,sw?1:0);if(sw)fake.position.x=Math.sin(t*14)*0.12;popT(b,t,MK('h2',0));look(c,[1.2,2.3,5],[0.5,2.0,0.5]);caption('h2',t);renderer.render(scene,c)}};
S.h3=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');myRoom(scene);const w=woong();w.position.set(0,0,0.6);w.rotation.y=Math.PI;scene.add(w);
  const mir=new THREE.Mesh(new THREE.PlaneGeometry(2.2,3.2),new THREE.MeshLambertMaterial({color:0xcfe6f2}));mir.position.set(0,1.8,-0.8);scene.add(mir);box(scene,2.4,3.4,0.08,0xffffff,0,1.8,-0.86);
  const w2=woong();w2.position.set(0,0,-2.2);scene.add(w2);// 거울 속
  const b1=think(w,'오늘 좀 잘생긴 듯',{size:0.0036,x:0.5}),b2=think(w,'했음',{size:0.0036,x:-0.5});const c=cam(38);
  return t=>{const den=t>at('h3','j03');[w,w2].forEach(p=>{setFace(p,den?'open':'smile');p.userData.arms.forEach((a,i)=>{a.rotation.x=den?-1.6:-0.2;a.rotation.z=den?(i?0.4:-0.4)*Math.sin(t*16):0})});
    popT(b1,t,MK('h3',0),den?at('h3','j03')+0.2:null);popT(b2,t,MK('h3',1));look(c,[2.6,2.6,4.2],[0,1.9,-0.4]);caption('h3',t);renderer.render(scene,c)}};
function kitchen(scene){myRoom(scene);table(scene,0.5,0.5);plate(scene,0.1,1.12,0.5);plate(scene,0.9,1.12,0.5,0x8cc96a);plate(scene,0.5,1.12,0.2,0xffd84d);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.2,0.2,14),lamb(0xd98c6c));pot.position.set(0.5,1.2,0.75);scene.add(pot)}
S.h4=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');kitchen(scene);const w=woong();w.position.set(-0.9,0,0.5);w.rotation.y=Math.PI/2;sitPose(w);scene.add(w);
  const m=MOM();m.position.set(1.9,0,0.5);m.rotation.y=-Math.PI/2;sitPose(m);scene.add(m);const b=think(w,'짜…',{size:0.0042});const c=cam(36);
  return t=>{const sp=t>at('h4','j04')&&t<endOf('h4','j04');setFace(w,sp?'open':'smile');w.userData.arms[1].rotation.x=sp?-2.3:-0.9;m.userData.arms[0].rotation.x=t<endOf('h4','e01')?-1.5:-0.9;
    popT(b,t,MK('h4',0));look(c,[0.5,2.4,4.6],[0.5,1.7,0.5]);caption('h4',t);renderer.render(scene,c)}};
S.h5=()=>{sky('#f3e9da');const scene=new THREE.Scene();lights(scene,'day');kitchen(scene);const w=woong();w.position.set(-0.9,0,0.5);w.rotation.y=Math.PI/2;sitPose(w);scene.add(w);
  const m=MOM();m.position.set(1.9,0,0.5);m.rotation.y=-Math.PI/2;sitPose(m);scene.add(m);const bw=think(w,'짜…',{size:0.0036});scaleBubble(bw,1);const b=think(m,'…짜다고?',{size:0.0042});
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.07,0.2,10),new THREE.MeshLambertMaterial({color:0x9fd8ff,transparent:true,opacity:0.8}));cup.position.set(-0.6,-0.7,0);m.userData.arms[1].add(cup);
  const c=cam(34);
  return t=>{setFace(m,t>MK('h5',0)?'flat':'smile');setFace(w,'open');popT(b,t,MK('h5',0));m.userData.arms[1].rotation.x=t>at('h5','e02')?-1.4:-0.6;
    look(c,lerp3([-1.4,2.4,3.8],[-1.0,2.3,3.2],ease(t/DUR('h5'))),[1.6,1.8,0.5]);caption('h5',t);renderer.render(scene,c)}};
S.h6=()=>{sky('morning');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0xb9c4a8);const r=rng(6);
  const TX=['짜…','싱거워','또 김치찌개','이거 어제 반찬','맛있다','밥 더 줘','간이 안 맞아','계란말이 최고'];const B=[];
  for(let i=0;i<4;i++){const b=makeBuilding(r,6,18,5,{wall:'#e8ddd0',lit:0.2});b.position.set(-12+i*8,9,-6);scene.add(b);
    for(let j=0;j<5;j++){const s=think(null,TX[(i*5+j)%TX.length],{size:0.009});s.position.set(-12+i*8+(j%2?-1:1)*1.2,2+j*3.2,-3.3);scene.add(s);B.push(s)}}
  const c=cam(45);
  return t=>{B.forEach((b,i)=>popT(b,t,MK('h6',0)+i*0.12));look(c,[0,9,18-t*0.3],[0,9,-6]);caption('h6',t);renderer.render(scene,c)}};
S.c2=chap('c2',2,'지하철');
// ---------- 2. 지하철 ----------
function subway(scene){box(scene,40,0.2,5,0x9aa0a8,0,-0.1,0);box(scene,40,0.2,5,0xe8eaee,0,4,0);box(scene,40,4,0.2,0xd8dde4,0,2,-2.5);
  for(let x=-18;x<=18;x+=4){const wn=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.3),basic(0x2a3a5a));wn.position.set(x,2.5,-2.38);scene.add(wn)}
  for(let x=-18;x<=18;x+=6){box(scene,4.2,0.5,0.8,0x6a9ad0,x,0.5,-2.0);box(scene,4.2,0.8,0.15,0x6a9ad0,x,1.1,-2.35)}
  for(let x=-18;x<=18;x+=1.6){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.4,6),lamb(0xcccccc));p.position.set(x,3.3,0.6);scene.add(p)}
  box(scene,40,0.05,0.05,0xcccccc,0,3.95,0.6);scene.add(new THREE.AmbientLight(0xffffff,0.4))}
S.s1=()=>{sky('#cfd6de');const scene=new THREE.Scene();lights(scene,'day');subway(scene);const r=rng(11);
  const ppl=[];for(let i=0;i<9;i++){const p=P(1100+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(-8+i*2,0,0.4+(i%2)*0.6);p.rotation.y=0.2;scene.add(p);ppl.push(p);
    const ph=box(p.userData.arms[1],0.12,0.2,0.03,0x222222,0,-0.65,0.1);p.userData.arms[1].rotation.x=-1.3;p.userData.head.rotation.x=0.35;setFace(p,'flat')}
  const B=[think(ppl[2],'저 자리 내 거',{size:0.0042}),think(ppl[4],'내려라 내려라',{size:0.0042}),think(ppl[6],'이어폰 소리 새는 거 누구야',{size:0.0042})];
  const c=cam(40);
  return t=>{B.forEach((b,i)=>popT(b,t,MK('s1',0)+i*1.0));const sw=Math.sin(t*3)*0.02;ppl.forEach(p=>p.rotation.z=sw);look(c,[0,2.6,10.5],[0,2.2,0]);caption('s1',t);renderer.render(scene,c)}};
S.s2=()=>{sky('#cfd6de');const scene=new THREE.Scene();lights(scene,'day');subway(scene);const p=P(1201,{shirt:0xe39a6b,hair:0x2a2220,cap:0x3a3a3a});p.position.set(0,0,0.4);scene.add(p);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,6),lamb(0xffffff));e.position.set(s*0.26,0.22,0);p.userData.head.add(e)}
  const N=[];for(let i=0;i<6;i++){const n=textSprite('♪',80,'#7a5ad0',0.006);scene.add(n);N.push(n)}
  const o=[P(1202,{shirt:0x8cc96a}),P(1203,{shirt:0xd98c8c,long:true})];o[0].position.set(-1.4,0,0.6);o[1].position.set(1.4,0,0.6);o.forEach(q=>{scene.add(q);setFace(q,'flat');q.rotation.y=0.3});
  const b=think(p,'내 노래 좋지?',{size:0.0042});const c=cam(38);
  return t=>{p.userData.head.rotation.z=Math.sin(t*6)*0.12;N.forEach((n,i)=>{const lt=(t*0.6+i/6)%1;n.position.set(Math.sin(i*2)*0.6,2.1+lt*1.0,0.4);const s=Math.sin(lt*Math.PI);n.scale.set(n.userData.base[0]*s,n.userData.base[1]*s,1)});
    popT(b,t,MK('s2',0));look(c,[0,2.2,5.5],[0,2.0,0.4]);caption('s2',t);renderer.render(scene,c)}};
S.s3=()=>{sky('#cfd6de');const scene=new THREE.Scene();lights(scene,'day');subway(scene);const w=woong();w.position.set(0,0,0.4);w.rotation.y=-0.4;scene.add(w);
  const g=GRAN();g.position.set(2.2,0,0.6);g.rotation.y=-1.2;scene.add(g);const b=think(w,'양보해야지… 근데 다리 아픈데…',{size:0.0036});const c=cam(38);
  return t=>{g.position.x=lerp(4.5,2.2,ease(t/1.6));walkPose(g,t*5,t<1.6?0.4:0);popT(b,t,MK('s3',0));setFace(w,'flat');look(c,[0.8,2.2,5.5],[0.6,1.8,-0.6]);caption('s3',t);renderer.render(scene,c)}};
S.s4=()=>{sky('#cfd6de');const scene=new THREE.Scene();lights(scene,'day');subway(scene);const w=woong();w.position.set(0,0,0.4);w.rotation.y=-0.4;scene.add(w);
  const g=GRAN();g.position.set(1.6,0,0.6);g.rotation.y=-1.2;scene.add(g);const b=think(g,'젊은이 피곤해 보이네, 앉아요',{size:0.0036});const c=cam(36);
  return t=>{popT(b,t,MK('s4',0));g.userData.arms[1].rotation.x=t>at('s4','h01')?-1.3:0;setFace(g,'smile');setFace(w,t>at('s4','h01')?'open':'flat');look(c,[1.6,2.2,4.6],[1.2,1.9,0.2]);caption('s4',t);renderer.render(scene,c)}};
S.s5=()=>{sky('#cfd6de');const scene=new THREE.Scene();lights(scene,'day');subway(scene);const w=woong();w.position.set(-0.6,0,0.4);w.rotation.y=0.6;scene.add(w);
  const g=GRAN();g.position.set(0.9,0,0.5);g.rotation.y=-0.8;scene.add(g);const b1=think(w,'착하다',{size:0.004}),b2=think(g,'착하다',{size:0.004});const c=cam(38);
  return t=>{w.userData.arms[1].rotation.set(-1.1,0,0);g.userData.arms[1].rotation.set(-1.1,0,0);w.userData.arms[1].rotation.z=Math.sin(t*6)*0.2;g.userData.arms[1].rotation.z=-Math.sin(t*6+1)*0.2;
    setFace(w,'smile');popT(b1,t,MK('s5',0));popT(b2,t,MK('s5',0)+0.3);look(c,[0.2,2.2,5.4],[0.2,1.9,-0.6]);caption('s5',t);renderer.render(scene,c)}};
S.s6=()=>{sky('#cfd6de');const scene=new THREE.Scene();lights(scene,'day');subway(scene);const r=rng(16);const ppl=[];
  for(let i=0;i<16;i++){const p=P(1600+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(-15+i*2,0,0.3+(i%2)*0.7);scene.add(p);ppl.push(p)}
  const TX=['양보할까?','양보할까?','배고파','양보할까?','김밥 먹고 싶다','양보할까?','배고파','양보할까?'];const B=ppl.map((p,i)=>think(p,TX[i%TX.length],{size:0.0045}));const c=cam(42);
  return t=>{B.forEach((b,i)=>popT(b,t,MK('s6',0)+i*0.07));look(c,[-6+t*0.9,3.2,9],[-6+t*0.9,2,0]);caption('s6',t);renderer.render(scene,c)}};
S.c3=chap('c3',3,'회사');
// ---------- 3. 회사 ----------
function meetingRoom(scene){interior(scene,{floor:0xcfd4da,wall:0xeef0f3});table(scene,0,0,5,2,0xe8e4dc);
  const scr=planeTex(4,2.2,textTex([['주간 회의',90,'#26307a'],['안건: 신규 기획',56,'#666']],{w:800,h:440,bg:'#ffffff'}),{basic:1});scr.position.set(0,3.6,-7.85);scene.add(scr)}
function team(scene,n=5){const r=rng(31);const T=[];for(let i=0;i<n;i++){const side=i%2?1:-1,j=Math.floor(i/2);const p=P(3100+i,{shirt:pick(r,[0x6c8ebf,0xf2f2f2,0xa58cd0,0x7fb7c9,0xe0c070]),hair:pick(r,HAIR),long:r()<0.4});
  p.position.set(-1.6+j*1.6,0,side*1.45);p.rotation.y=side>0?Math.PI:0;sitPose(p);scene.add(p);T.push(p)}return T}
S.w1=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));meetingRoom(scene);const T=team(scene);
  const bs=BOSS();bs.position.set(3.4,0,0);bs.rotation.y=-Math.PI/2;scene.add(bs);const c=cam(40);
  return t=>{bs.userData.arms[1].rotation.set(-1.2,0,0.3+Math.sin(t*4)*0.2);setFace(bs,t<endOf('w1','k01')?'open':'smile');look(c,[-3,3.4,5],[1,1.6,0]);caption('w1',t);renderer.render(scene,c)}};
S.w2=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));meetingRoom(scene);const T=team(scene);T.forEach(p=>setFace(p,'flat'));
  const B=T.map(p=>think(p,'점심 뭐 먹지',{size:0.0036}));const c=cam(42);
  return t=>{B.forEach((b,i)=>popT(b,t,MK('w2',0)+i*0.25));look(c,[0,5.5,7],[0,1.6,0]);caption('w2',t);renderer.render(scene,c)}};
S.w3=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));meetingRoom(scene);const T=team(scene);
  const bs=BOSS();bs.position.set(3.4,0,0);bs.rotation.y=-Math.PI/2;scene.add(bs);const b=think(bs,'나도 점심 생각',{size:0.004});const c=cam(38);
  return t=>{popT(b,t,MK('w3',0));const go=t>at('w3','k02');bs.userData.arms[1].rotation.set(go?-2.6:-0.2,0,0);T.forEach(p=>{setFace(p,go?'smile':'flat');p.userData.arms.forEach((a,i)=>a.rotation.x=go?-2.7:-0.9)});
    look(c,[1.5,2.6,4.6],[3.2,2.0,0]);caption('w3',t);renderer.render(scene,c)}};
S.w4=()=>{sky('#eef0f3');const cl=div('box',`<div style="font-size:44px;color:#888">회의 시간</div><div class="v" style="font-size:200px;color:#26307a;line-height:1.1">60분</div><div style="font-size:60px;color:#2a9d5a" class="d"></div>`);
  Object.assign(cl.style,{left:'560px',top:'130px',width:'800px',padding:'40px',textAlign:'center'});
  return t=>{renderer.clear();const k=ease((t-0.4)/1.6);cl.querySelector('.v').textContent=Math.round(lerp(60,3,k))+'분';cl.querySelector('.d').textContent=k>=1?'▼ 평균 70%':'';caption('w4',t)}};
S.w5=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');interior(scene,{floor:0xcfd4da,wall:0xeef0f3});const r=rng(35);
  for(let i=0;i<4;i++){box(scene,1.8,0.08,1,0xe8e4dc,-4+i*2.6,1.1,-3);box(scene,0.9,0.6,0.05,0x222228,-4+i*2.6,1.5,-3.3)}
  const bs=BOSS();bs.position.set(0.6,0,0.6);bs.rotation.y=-0.6;scene.add(bs);const rp=box(bs.userData.arms[1],0.35,0.45,0.03,0xffffff,0,-0.7,0.1);bs.userData.arms[1].rotation.x=-1.2;
  const w=woong();w.position.set(-0.8,0,0.8);w.rotation.y=0.7;scene.add(w);const b1=think(bs,'안 읽음',{size:0.004}),b2=think(w,'알고 있음',{size:0.004});const c=cam(38);
  return t=>{popT(b1,t,MK('w5',0));popT(b2,t,MK('w5',1));setFace(w,t>MK('w5',1)?'flat':'smile');look(c,[0,2.4,5.6],[0,1.9,0.6]);caption('w5',t);renderer.render(scene,c)}};
S.w6=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');interior(scene,{floor:0xcfd4da,wall:0xeef0f3});
  const bs=BOSS();bs.position.set(0.7,0,0.6);bs.rotation.y=-0.7;scene.add(bs);const w=woong();w.position.set(-0.7,0,0.8);w.rotation.y=0.7;scene.add(w);
  const b=think(w,'승진…',{size:0.0042});const sp=[];for(let i=0;i<6;i++){const s=textSprite('✦',70,'#ffe066',0.004);s.position.set(-0.7+(i-2.5)*0.25,2.0+(i%2)*0.3,1.0);scene.add(s);sp.push(s)}
  const c=cam(36);
  return t=>{w.userData.arms[1].rotation.set(-1.5,0,0.4);setFace(w,'smile');popT(b,t,MK('w6',0));sp.forEach((s,i)=>{const k=t<endOf('w6','j06')?Math.abs(Math.sin(t*4+i)):0;s.scale.set(s.userData.base[0]*k,s.userData.base[1]*k,1)});
    look(c,[0,2.3,5],[0,1.9,0.6]);caption('w6',t);renderer.render(scene,c)}};
S.w7=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');interior(scene,{floor:0xcfd4da,wall:0xeef0f3});
  const bs=BOSS();bs.position.set(0.7,0,0.6);bs.rotation.y=-0.7;scene.add(bs);const w=woong();w.position.set(-0.7,0,0.8);w.rotation.y=0.7;scene.add(w);
  const b=think(bs,'귀엽네',{size:0.0042});const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.16,10),lamb(0xffffff));cup.position.set(0,-0.7,0.08);bs.userData.arms[1].add(cup);const c=cam(34);
  return t=>{popT(b,t,MK('w7',0));bs.userData.arms[1].rotation.x=t>at('w7','k04')?-1.4:-0.3;setFace(bs,'smile');setFace(w,'flat');look(c,[1.6,2.3,4.4],[0.6,1.9,0.6]);caption('w7',t);renderer.render(scene,c)}};
S.w8=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));interior(scene,{floor:0xcfd4da,wall:0xeef0f3});const r=rng(38);const T=[];
  for(let i=0;i<8;i++){const x=-5+(i%4)*3.2,z=-2+Math.floor(i/4)*2.6;box(scene,1.8,0.08,1,0xe8e4dc,x,1.1,z);const p=P(3800+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(x,0,z+0.9);p.rotation.y=Math.PI;sitPose(p);scene.add(p);T.push(p)}
  const bs=BOSS();bs.position.set(0,0,4.2);bs.rotation.y=Math.PI;scene.add(bs);const ch=chip('PM 5:50');const c=cam(42);
  return t=>{popEl(ch,t,0.1);bs.userData.arms[1].rotation.set(-1.0,0,0.3);look(c,[0,4.5,9.5],[0,1.4,-0.5]);caption('w8',t);renderer.render(scene,c)}};
S.w9=()=>{sky('#eef0f3');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));interior(scene,{floor:0xcfd4da,wall:0xeef0f3});const r=rng(38);const T=[];
  for(let i=0;i<8;i++){const x=-5+(i%4)*3.2,z=-2+Math.floor(i/4)*2.6;box(scene,1.8,0.08,1,0xe8e4dc,x,1.1,z);const p=P(3800+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(x,0,z+0.9);p.rotation.y=Math.PI;sitPose(p);scene.add(p);T.push(p);setFace(p,'flat')}
  const bs=BOSS();bs.position.set(0,0,4.2);bs.rotation.y=Math.PI;scene.add(bs);const B=T.map(p=>think(p,'나 말고',{size:0.0065}));const bb=think(bs,'나도 싫어',{size:0.0075});const c=cam(42);
  return t=>{B.forEach((b,i)=>popT(b,t,MK('w9',0)+i*0.12));popT(bb,t,MK('w9',1));look(c,[0,5.5,11],[0,1.8,0]);caption('w9',t);renderer.render(scene,c)}};
S.w10=()=>{sky('dusk');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));interior(scene,{floor:0xcfd4da,wall:0xeef0f3});
  for(let i=0;i<8;i++){const x=-5+(i%4)*3.2,z=-2+Math.floor(i/4)*2.6;box(scene,1.8,0.08,1,0xe8e4dc,x,1.1,z);chair(scene,x,z+0.9,Math.PI*0.8)}
  const ck=planeTex(1.6,1.6,textTex([['PM 6:00',60,'#26307a']],{w:320,h:320,bg:'#fff',r:160}),{tr:1});ck.position.set(0,5,-7.85);scene.add(ck);
  const ch=chip('칼퇴율 100%');const c=cam(42);
  return t=>{popEl(ch,t,at('w10','n07')+1.4);look(c,[0,4.5,9.5-t*0.2],[0,1.6,-2]);caption('w10',t);renderer.render(scene,c)}};
