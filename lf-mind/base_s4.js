S[53]=dcard(53,3650,'10년',{tint:'#10140c'});
// 54 덩굴 도시
S[54]=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(54);city(scene,r,{green:0.9});cars(scene,r,[[-2.3,-4,0.3],[2.2,-16,-0.2],[-1.8,-30,0.5]],{rust:0.7,overgrow:true});const c=cam(42);
  return t=>{const k=ease(t/DUR(54));look(c,lerp3([0,18,20],[0,5,6],k),[0,3,-40]);caption(54,t);renderer.render(scene,c)}};
// 55 녹슨 다리
S[55]=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(55);ground(scene,0x6a9a5a);
  const rv=new THREE.Mesh(new THREE.PlaneGeometry(400,60),lamb(0x4f7fa0));rv.rotation.x=-Math.PI/2;rv.position.y=0.05;scene.add(rv);
  const RU=[0x9a5a3a,0x8a4a2a,0xa8683f,0x7a4a30];const br=new THREE.Group();br.position.set(0,0,0);scene.add(br);
  box(br,8,0.6,80,0x7a6a5a,0,5,0);for(let z=-36;z<=36;z+=6){for(const x of[-4,4]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.4,5,0.4),lamb(pick(r,RU)));p.position.set(x,7.5,z);br.add(p)}
    for(const x of[-4,4]){const d=new THREE.Mesh(new THREE.BoxGeometry(0.3,7,0.3),lamb(pick(r,RU)));d.position.set(x,7.5,z+3);d.rotation.x=0.7;br.add(d)}}
  for(const x of[-4,4]){const tp=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,80),lamb(0x8a4a2a));tp.position.set(x,10,0);br.add(tp)}
  for(const z of[-24,0,24]){const pl=new THREE.Mesh(new THREE.BoxGeometry(4,5,4),lamb(0x8a8a80));pl.position.set(0,2.5,z);br.add(pl)}
  for(let i=0;i<30;i++){const v=new THREE.Mesh(new THREE.BoxGeometry(0.4,1+r()*4,0.6),lamb(0x4f8a4a));v.position.set(pick(r,[-4.2,4.2]),6+r()*3,(r()-0.5)*76);br.add(v)}
  const gap=box(br,8.2,0.7,5,0x4f7fa0,0,5,10);gap.visible=false;
  const c=cam(40);
  return t=>{look(c,[30-t*1.2,8,28],[0,6,0]);caption(55,t);renderer.render(scene,c)}};
// 옥상 공용 세트
function roof(scene,o={}){const r=rng(o.seed||70);box(scene,14,0.4,14,0x5a5f66,0,-0.2,0);for(const [x,z,w,d] of [[0,-7,14,0.2],[-7,0,0.2,14],[7,0,0.2,14],[0,7,14,0.2]])box(scene,w,1,d,0x6a6f78,x,0.5,z);
  const tk=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,2,12),lamb(0x8a8f99));tk.position.set(-4.5,1.4,-4.5);scene.add(tk);box(scene,0.8,1.6,0.8,0x8a8f99,-4.5,0,-4.5);
  for(let i=0;i<12;i++)tuft(scene,(r()-0.5)*13,(r()-0.5)*13,0.8+r(),0x4f8a4a);for(let i=0;i<5;i++)bush(scene,(r()<0.5?-6.3:6.3),0.6,(r()-0.5)*12,1.2,0x4f8a4a);
  const P=[];if(o.panels)for(let i=0;i<3;i++){const p=new THREE.Group();p.position.set(3+i*1.3,0,-4.5);scene.add(p);const pn=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.06,1.6),lamb(0x2a3a6a));pn.position.y=0.9;pn.rotation.x=-0.5;p.add(pn);
    const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.9,0.08),lamb(0x888888));l.position.y=0.45;p.add(l);P.push(p)}
  let bulb=null,glow=null,pl=null;if(o.bulb){const pole=box(scene,0.08,2.6,0.08,0x6a5040,-3,1.3,2.2);const wire=box(scene,0.03,0.03,2.0,0x222222,-3,2.6,1.2);
    bulb=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,10),basic(0x555555));bulb.position.set(-3,2.45,2.2);scene.add(bulb);glow=glowSprite('rgba(255,220,140,1)',2.2);glow.position.copy(bulb.position);scene.add(glow);
    pl=new THREE.PointLight(0xffd890,8,12,1.4);pl.position.copy(bulb.position);scene.add(pl)}
  // 주변 숲이 된 도시
  for(let i=0;i<70;i++){const a=r()*Math.PI*2,d=40+r()*120;const x=Math.cos(a)*d,z=Math.sin(a)*d;const h=4+r()*18;const w=5+r()*6;const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),lamb(o.night?0x1c2030:0x8a8a7a));b.position.set(x,h/2-14,z);scene.add(b);
    const tp=new THREE.Mesh(new THREE.IcosahedronGeometry(w*0.45,0),lamb(o.night?0x1a2a1c:0x4f8a4a));tp.position.set(x,h-14+0.5,z);tp.scale.y=0.5;scene.add(tp)}
  return {bulb,glow,pl,P}}
function setBulb(R,on){R.bulb.material.color.set(on?0xfff2c4:0x555555);R.glow.visible=on;R.pl.intensity=on?8:0}
// 56 수염 웅이 + 할아버지 뭉치 (노을)
S[56]=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');roof(scene,{panels:true});
  const w=woong({beard:true,patch:true});w.position.set(0,0,1);sitPose(w);w.rotation.y=-0.4;scene.add(w);box(scene,1.6,0.55,0.6,0x8a6a4a,0,0.28,1);
  const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(0.9,0,1.6);d.rotation.y=-1.2;scene.add(d);d.userData.legs.forEach(l=>l.rotation.x=1.4);d.position.y=-0.15;
  const c=cam(36);
  return t=>{w.userData.arms[0].rotation.x=-0.5+Math.sin(t*2)*0.1;setFace(w,'smile');dogWag(d,t*0.3);d.userData.head.rotation.x=0.2;look(c,[2.2,1.8,5.5],[0.3,1.1,1]);caption(56,t);renderer.render(scene,c)}};
// 57 태양광 패널 + 전구 하나
S[57]=()=>{sky('night');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x7080b0,0.5));const r=rng(57);const R=roof(scene,{panels:true,bulb:true,night:true});stars(scene,800,r,{w:400,h:200,y0:10,z:-170,size:0.5});
  const w=woong({beard:true,patch:true});w.position.set(0.4,0,0.4);w.rotation.y=-0.6;scene.add(w);const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(-0.6,0,0.8);d.rotation.y=0.4;scene.add(d);
  const c=cam(40);const TO=at(57,'n29')+3.0;
  return t=>{setBulb(R,t>TO);setFace(w,t>TO?'smile':'flat');w.userData.arms[1].rotation.x=t<TO?-1.6:-0.2;const k=ease((t-TO-1)/4);look(c,lerp3([3,2.4,6],[6,7,14],k),[0.8,1.5,-0.5]);caption(57,t);renderer.render(scene,c)}};
// 58 우주정거장이 떨어짐
S[58]=()=>{sky('night');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x7080b0,0.5));const r=rng(58);const R=roof(scene,{panels:true,bulb:true,night:true});setBulb(R,true);stars(scene,1200,r,{w:400,h:200,y0:0,z:-170,size:0.5});
  const w=woong({beard:true,patch:true});w.position.set(0.4,0,1.2);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(-0.5,0,1.4);d.rotation.y=Math.PI;scene.add(d);
  const fb=glowSprite('rgba(255,170,80,1)',10);scene.add(fb);const core=glowSprite('rgba(255,255,220,1)',3);scene.add(core);const TR=[];for(let i=0;i<40;i++){const s=glowSprite('rgba(255,140,60,1)',6-i*0.12);s.material.opacity=0.5*(1-i/40);scene.add(s);TR.push(s)}
  const c=cam(45);const T0=at(58,'n30')+0.3;
  return t=>{const p=(t-T0)/7;const pos=k=>[lerp(-140,90,k),lerp(110,35,k)-k*k*20,-150];TR.forEach((s,i)=>{const k=p-i*0.012;s.visible=k>0&&k<1.1;if(s.visible)s.position.set(...pos(k))});
    fb.visible=core.visible=p>0&&p<1.1;if(fb.visible){fb.position.set(...pos(p));core.position.set(...pos(p))}
    w.userData.head.rotation.x=-0.5;look(c,[0.4,1.6,6.5],[0,9,-20]);caption(58,t);renderer.render(scene,c)}};
// 59 올려다보는 웅이 얼굴
S[59]=()=>{sky('night');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x7080b0,0.6));const r=rng(59);roof(scene,{night:true});stars(scene,800,r,{w:400,h:200,y0:0,z:-170,size:0.5});
  const w=woong({beard:true,patch:true});w.position.set(0,0,0);scene.add(w);const pl=new THREE.PointLight(0xffa060,5,8,1.5);pl.position.set(-1,4,3);scene.add(pl);
  const c=cam(30);
  return t=>{w.userData.head.rotation.x=-0.45;pl.intensity=Math.max(0,5-t*0.6);setFace(w,'flat');const k=ease(t/DUR(59));look(c,[0.4,1.9,2.6-k*0.5],[0,1.95,0]);caption(59,t);renderer.render(scene,c)}};
// 60 10년째 운동장 글씨를 다시
S[60]=()=>{sky('dusk');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(60);ground(scene,0x5e9e55);for(let i=0;i<300;i++)tuft(scene,(r()-0.5)*60,(r()-0.5)*30,0.6+r()*1.4,0x4f8a4a);
  const fld=new THREE.Mesh(new THREE.PlaneGeometry(40,10),new THREE.MeshLambertMaterial({map:lettersTex('누구 없어요?',{bg:'#b89a6a',seed:9})}));fld.rotation.x=-Math.PI/2;fld.position.y=0.04;scene.add(fld);
  const sch=makeBuilding(r,30,9,6,{wall:'#9da396'});sch.position.set(0,4.5,-16);scene.add(sch);for(let i=0;i<20;i++){const v=new THREE.Mesh(new THREE.BoxGeometry(1+r()*2,1+r()*7,0.2),lamb(0x4f8a4a));v.position.set((r()-0.5)*28,v.geometry.parameters.height/2,-12.9);scene.add(v)}
  const w=woong({beard:true,patch:true});w.position.set(6,0,1.5);w.rotation.y=-0.4;scene.add(w);const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(0.15,0),lamb(0xdedad0));rk.position.y=-0.68;w.userData.arms[1].add(rk);
  const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(7,0,2.4);scene.add(d);const c=cam(40);
  return t=>{w.userData.hip.position.y=0.62;w.userData.hip.rotation.x=0.45+Math.sin(t*1.5)*0.1;w.userData.arms[1].rotation.x=-0.8+Math.sin(t*3)*0.3;setFace(w,'flat');
    look(c,[10-t*0.5,7,14],[3,0,0]);caption(60,t);renderer.render(scene,c)}};
// 61 고요한 옥상 밤 (대사 없음)
S[61]=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x6070a0,0.4));const r=rng(61);const R=roof(scene,{panels:true,bulb:true,night:true});setBulb(R,true);stars(scene,1400,r,{w:400,h:200,y0:0,z:-170,size:0.5});
  const w=woong({beard:true,patch:true});w.position.set(0.5,0,1);sitPose(w);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(-0.4,0,1.2);d.rotation.y=Math.PI;scene.add(d);d.position.y=-0.15;d.userData.legs.forEach(l=>l.rotation.x=1.4);
  const c=cam(45);
  return t=>{const k=ease(t/DUR(61));look(c,lerp3([4,6,12],[2,3.5,8],k),[0,1,-10]);caption(61,t);renderer.render(scene,c)}};
// 62 산 너머 두 번째 불빛
function farHill(scene){const r=rng(62);for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(40+r()*20,26+r()*14,6),lamb(0x141a2a));m.position.set(-150+i*60,-14,-180);scene.add(m)}
  const L=glowSprite('rgba(255,235,170,1)',5);L.position.set(22,4,-170);scene.add(L);const C=glowSprite('rgba(255,255,240,1)',1.6);C.position.copy(L.position);scene.add(C);return [L,C]}
S[62]=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x6070a0,0.4));const r=rng(63);const R=roof(scene,{panels:true,bulb:true,night:true});setBulb(R,true);stars(scene,1400,r,{w:400,h:200,y0:15,z:-190,size:0.5});
  const FL=farHill(scene);const w=woong({beard:true,patch:true});w.position.set(0.5,0,1);sitPose(w);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(-0.4,0,1.2);d.rotation.y=Math.PI;scene.add(d);
  const c=cam(40);const TL=at(62,'n32')+2.6;
  return t=>{const on=t>TL&&(Math.floor((t-TL)*1.2)%2===0||t>TL+3);FL.forEach(s=>s.visible=on);d.userData.head.rotation.x=on?-0.2:0;d.userData.head.rotation.z=on?0.3:0;
    const k=ease((t-TL)/3);look(c,lerp3([1.5,2.6,5],[0.6,2.4,4],k),lerp3([10,1,-60],[22,4,-170],k));caption(62,t);renderer.render(scene,c)}};
// 63 손전등 신호
S[63]=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x6070a0,0.5));const r=rng(64);const R=roof(scene,{panels:true,bulb:true,night:true});setBulb(R,true);stars(scene,1400,r,{w:400,h:200,y0:15,z:-190,size:0.5});
  const FL=farHill(scene);const w=woong({beard:true,patch:true});w.position.set(0.5,0,1);w.rotation.y=Math.PI*0.95;scene.add(w);
  const fl=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,0.3,8),lamb(0x333333));fl.position.y=-0.75;w.userData.arms[1].add(fl);
  const beam=new THREE.Mesh(new THREE.ConeGeometry(1.4,12,16,1,true),new THREE.MeshBasicMaterial({color:0xfff2c4,transparent:true,opacity:0.18,depthWrite:false,side:THREE.DoubleSide}));beam.geometry.translate(0,-6,0);beam.position.y=-0.85;w.userData.arms[1].add(beam);
  const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(-0.4,0,1.4);d.rotation.y=Math.PI;scene.add(d);
  const c=cam(40);const T0=at(63,'j29')+0.5;
  return t=>{const up=ease((t-0.3)/0.4);w.userData.arms[1].rotation.x=-2.7*up+Math.sin(t*6)*0.25*up;w.userData.arms[1].rotation.z=0.2+Math.sin(t*6)*0.2;beam.visible=Math.floor(t*3)%2===0||t<T0;
    const on=t<T0||Math.floor((t-T0)*3+1)%2===0;FL.forEach(s=>s.visible=on);setFace(w,'open');dogWag(d,t*1.5);d.userData.head.rotation.x=-0.3;
    look(c,[3.2,2.2,6.5],[-2,3,-30]);caption(63,t);renderer.render(scene,c)}};
// 64 질문 엔딩
S[64]=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x6070a0,0.45));const r=rng(65);const R=roof(scene,{panels:true,bulb:true,night:true});setBulb(R,true);stars(scene,1600,r,{w:400,h:200,y0:15,z:-190,size:0.5});
  const FL=farHill(scene);const w=woong({beard:true,patch:true});w.position.set(0.5,0,1);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(-0.4,0,1.4);d.rotation.y=Math.PI;scene.add(d);
  const q1=div('ttl1 out','지구에 나 혼자 남는다면');q1.style.top='150px';q1.style.fontSize='84px';const q2=div('ttl2 out','제일 먼저 뭘 할 건가요?');q2.style.top='260px';q2.style.fontSize='110px';q2.style.color='#ffd84d';
  const q3=div('ttl1 out','댓글로 알려 주세요!');q3.style.top='430px';q3.style.fontSize='54px';
  const c=cam(45);
  return t=>{const k=ease(t/DUR(64));look(c,lerp3([1.5,3,7],[3,14,24],k),[0,lerp(2,6,k),-40]);w.userData.arms[0].rotation.set(-2.6,0,-0.4+Math.sin(t*5)*0.3);
    [q1,q2,q3].forEach((q,i)=>{const t0=1.5+i*0.5;q.style.transform=`scale(${pop((t-t0)/0.4)})`;q.style.opacity=clamp01((t-t0)/0.1)});
    ui.querySelector('.cap')&&(ui.querySelector('.cap').style.display='none');renderer.render(scene,c)}};
