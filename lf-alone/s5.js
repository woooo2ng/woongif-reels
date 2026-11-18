// ===== 추가 장면 (x1~x24, D+100, D+1000) =====
function catM(col=0x8a8a8a){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.24,0.6),lamb(col));b.position.y=0.3;g.add(b);
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.15,16,12),smooth(col));h.position.set(0,0.48,0.35);g.add(h);for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.12,4),lamb(col));e.position.set(s*0.08,0.62,0.33);g.add(e);
    const ey=new THREE.Mesh(new THREE.SphereGeometry(0.022,6,4),basic(0x3a6a2a));ey.position.set(s*0.06,0.5,0.48);g.add(ey)}
  const legs=[];for(const[x,z]of[[-0.09,0.2],[0.09,0.2],[-0.09,-0.2],[0.09,-0.2]]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.2,0.06),lamb(col));l.geometry.translate(0,-0.1,0);l.position.set(x,0.2,z);g.add(l);legs.push(l)}
  const t=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.45),lamb(col));t.geometry.translate(0,0,-0.22);t.position.set(0,0.38,-0.3);t.rotation.x=-0.9;g.add(t);g.userData={legs,tail:t};return g}
function pigeonM(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),lamb(0x8a8fa0));b.scale.set(1,0.9,1.4);g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),lamb(0x6a7080));h.position.set(0,0.12,0.15);g.add(h);return g}
function busM(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.6,9),lamb(0x3a8fd0));b.position.y=1.6;g.add(b);
  const wn=new THREE.Mesh(new THREE.BoxGeometry(2.42,0.9,7.8),lamb(0x9fc6e8));wn.position.set(0,2.2,-0.3);g.add(wn);const fw=new THREE.Mesh(new THREE.BoxGeometry(2.1,1.3,0.05),new THREE.MeshLambertMaterial({color:0xcfe6f6,transparent:true,opacity:0.45}));fw.position.set(0,2.0,4.52);g.add(fw);
  const sg=planeTex(1.6,0.4,textTex([['100-1',80,'#ffb02e']],{w:400,h:100,bg:'#111'}),{basic:1});sg.position.set(0,2.85,4.53);g.add(sg);
  for(const x of[-1.15,1.15])for(const z of[-3,3]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.3,12),lamb(0x222222));w.rotation.z=Math.PI/2;w.position.set(x,0.5,z);g.add(w)}return g}
function crowdSeats(scene,rows,cols,col,o={}){for(let r2=0;r2<rows;r2++)for(let c=0;c<cols;c++){const s=new THREE.Group();s.position.set((c-(cols-1)/2)*(o.dx||0.9),r2*(o.dy||0.35),r2*(o.dz||1.1));scene.add(s);
  const se=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.15,0.6),lamb(col));se.position.y=0.5;s.add(se);const bk=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.8,0.12),lamb(col));bk.position.set(0,0.9,0.3);s.add(bk)}}
// x1 지하철 승강장
S.x1=()=>{sky('#2a2d36');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0xffffff,0.6));
  box(scene,6,1,60,0xbfb8aa,-3,0.5,-20);box(scene,6,0.1,60,0x4a4a50,3,0.05,-20);for(const x of[2.2,3.8])box(scene,0.12,0.15,60,0x9a9a9a,x,0.15,-20);
  box(scene,0.3,8,60,0xd8d2c6,-6,4,-20);box(scene,0.3,8,60,0x8a8f99,6,4,-20);box(scene,12,0.3,60,0xe8e4dc,0,8,-20);
  for(let z=0;z>-50;z-=6){const l=new THREE.Mesh(new THREE.BoxGeometry(2,0.1,0.4),basic(0xffffff));l.position.set(-2,7.8,z);scene.add(l)}
  const bd=planeTex(3.4,0.8,textTex([['다음 열차: 정보 없음',60,'#ffb02e']],{w:680,h:160,bg:'#111'}),{basic:1});bd.position.set(-2,5.6,-6);scene.add(bd);
  const w=woong();w.position.set(-1.2,1,-2);w.rotation.y=Math.PI*0.5;scene.add(w);const c=cam(42);
  return t=>{w.userData.head.rotation.y=Math.sin(t*0.9)*0.5;setFace(w,'flat');look(c,[-4.5,3,6-t*0.2],[0,2,-12]);caption('x1',t);renderer.render(scene,c)}};
// x2 은행 금고, 돈 침대
S.x2=()=>{sky('#3a3530');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xfff0d0,0.4));interior(scene,{floor:0x8a8a90,wall:0x9a9aa2,wall2:0x8a8a92,ceil:false});
  const vd=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,0.6,32),lamb(0xb8bcc4));vd.rotation.x=Math.PI/2;vd.position.set(-8,3,-6.5);vd.rotation.z=0.3;scene.add(vd);
  const r=rng(2);for(let i=0;i<220;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.12,0.28),lamb(pick(r,[0xe8c86a,0xd9b85a,0xf0d080])));b.position.set((r()-0.5)*5,0.06+Math.floor(r()*4)*0.12,(r()-0.5)*3.5);b.rotation.y=(r()-0.5)*0.6;scene.add(b)}
  const w=woong();w.position.set(0,0.6,0);w.rotation.x=-Math.PI/2;scene.add(w);const c=cam(40);
  return t=>{const k=ease((t-0.3)/0.8);w.position.y=lerp(2.5,0.65,k);w.userData.arms.forEach((a,i)=>{a.rotation.z=(i?1.3:-1.3)*k});setFace(w,'smile');look(c,[3,4.5,4.5],[0,0.6,0]);caption('x2',t);renderer.render(scene,c)}};
// x3 교무실 교장 의자
S.x3=()=>{sky('#efe8dc');const scene=new THREE.Scene();lights(scene,'day');interior(scene,{floor:0xcfc8b8,wall:0xf2ede2});const r=rng(3);
  for(let i=0;i<3;i++)for(let j=0;j<4;j++){box(scene,1.6,0.1,1,0xb89a70,-5+j*2.4,1.1,-3+i*1.8);box(scene,0.6,0.5,0.05,0x333333,-5+j*2.4,1.45,-3.3+i*1.8)}
  box(scene,3,0.12,1.4,0x8a5a3a,4,1.2,1.5);const np=planeTex(1.2,0.35,textTex([['교장',60,'#fff']],{w:240,h:70,bg:'#3a2a1a'}));np.position.set(4,1.45,2.21);scene.add(np);box(scene,1.2,0.35,0.05,0x3a2a1a,4,1.45,2.18).visible=false;
  const ch=box(scene,1.1,2.2,0.3,0x5a2a2a,4,1.6,0.3);
  const w=woong();w.position.set(4,0,0.8);sitPose(w);w.rotation.y=0;scene.add(w);const c=cam(40);
  return t=>{w.userData.arms.forEach((a,i)=>{a.rotation.x=-0.9;a.rotation.z=0});w.rotation.y=Math.sin(t*1.4)*0.5;setFace(w,'smile');look(c,[1.5,2.6,6.5],[3.6,1.6,0.8]);caption('x3',t);renderer.render(scene,c)}};
// x4 버스 운전
S.x4=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(4);city(scene,r,{});const bus=busM();scene.add(bus);
  const w=woong();w.position.set(-0.6,0.9,3.6);sitPose(w);bus.add(w);w.userData.arms.forEach(a=>a.rotation.x=-1.4);const sw=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.04,6,16),lamb(0x222222));sw.position.set(-0.6,1.8,4.2);sw.rotation.x=1.1;bus.add(sw);
  const c=cam(40);
  return t=>{bus.position.set(2,0,-40+t*6);bus.rotation.y=Math.sin(t*2)*0.03;sw.rotation.z=Math.sin(t*2)*0.6;setFace(w,'smile');
    look(c,[bus.position.x-3.5,2.6,bus.position.z+11],[bus.position.x-0.5,2.0,bus.position.z+3]);caption('x4',t);renderer.render(scene,c)}};
// x5 영화관 혼자
S.x5=()=>{sky('#0b0b10');const scene=new THREE.Scene();scene.add(new THREE.AmbientLight(0xa0a0c0,1.0));const hl=new THREE.HemisphereLight(0x8090d0,0x202028,1.0);scene.add(hl);
  box(scene,20,0.2,20,0x2a1a1e,0,-0.1,0);const sc=box(scene,14,6,0.1,0x111114,0,4,-7);crowdSeats(scene,6,10,0xa83a3a,{});
  const w=woong();w.position.set(0.45,1.05,2.2);sitPose(w);w.rotation.y=Math.PI;scene.add(w);const pc=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.15,0.35,10),lamb(0xe2553f));pc.position.set(0.9,1.5,2.2);scene.add(pc);
  const c=cam(42);
  return t=>{w.userData.head.rotation.y=Math.sin(t*0.8)*0.3;look(c,[1.6,2.4,-1.4],[0.45,1.7,2.2]);caption('x5',t);renderer.render(scene,c)}};
// x6 배터리 3%
S.x6=()=>{sky('#14161f');const ph=div('box',`<div style="text-align:center;margin-top:130px"><div style="display:inline-block;width:300px;height:140px;border:14px solid #333;border-radius:26px;position:relative"><div class="bar" style="position:absolute;left:8px;top:8px;bottom:8px;width:14px;background:#e2553f;border-radius:6px"></div></div><div class="pc" style="font-size:150px;color:#e2553f;margin-top:30px">3%</div><div style="font-size:42px;color:#888;margin-top:10px">충전기를 연결하세요</div></div>`);
  Object.assign(ph.style,{left:'560px',top:'70px',width:'540px',height:'860px',borderRadius:'50px',border:'18px solid #2b2b33',background:'#f6f6f8',boxSizing:'border-box'});
  const ou=div('box',`<div style="font-size:70px;letter-spacing:30px;margin-left:30px">▮ ▮</div><div style="font-size:34px;color:#e2553f;margin-top:10px">전기 없음</div>`);Object.assign(ou.style,{left:'1240px',top:'360px',width:'280px',padding:'40px 0',textAlign:'center',background:'#efeae0'});
  return t=>{renderer.clear();ph.querySelector('.pc').style.opacity=Math.sin(t*6)>-0.3?1:0.25;popEl(ou,t,1.0,'');caption('x6',t)}};
// x7 25층 계단
S.x7=()=>{sky('#2a2c34');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0xffffff,0.5));
  for(let i=0;i<60;i++){const fl=Math.floor(i/12),k=i%12,dir=fl%2?-1:1;const s=box(scene,1.6,0.25,0.5,0xbfb8aa,dir*(k*0.5-2.75),fl*3.2+k*0.27,(fl%2)*1.8);}
  for(let f=0;f<6;f++){box(scene,7,0.2,4,0xa8a090,0,f*3.2-0.1,0.9).visible=f==0;const sg=planeTex(1,0.5,textTex([[`${20+f}F`,70,'#fff']],{w:200,h:100,bg:'#2a9d5a'}),{basic:1});sg.position.set(-3.6,f*3.2+1.6,-0.4);scene.add(sg)}
  box(scene,0.2,22,4,0xd8d2c6,-3.8,10,0.9);
  const w=woong();scene.add(w);const c=cam(45);const T=DUR('x7');
  return t=>{const p=clamp01(t/T)*5;const fl=Math.floor(p),k=p-fl,dir=fl%2?-1:1;w.position.set(dir*(k*6-2.75)*1.0,fl*3.2+k*3.2+0.12,(fl%2)*1.8);w.rotation.y=dir>0?Math.PI/2:-Math.PI/2;walkPose(w,t*7,0.7);
    w.userData.hip.rotation.x=0.35;setFace(w,'open');look(c,[6,w.position.y+2.5,9],[0,w.position.y+0.8,0.9]);caption('x7',t);renderer.render(scene,c)}};
// x8 한강 손빨래
S.x8=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0x8cc96a);const rv=new THREE.Mesh(new THREE.PlaneGeometry(400,60),lamb(0x5a90b8));rv.rotation.x=-Math.PI/2;rv.position.set(0,0.03,-34);scene.add(rv);
  box(scene,400,0.4,3,0xc9c2b4,0,0.2,-3);const r=rng(8);for(let i=0;i<10;i++){const b=makeBuilding(r,6,10+r()*20,6);b.position.set(-60+i*13,b.position.y,-80);scene.add(b)}
  const ln=box(scene,6,0.03,0.03,0xffffff,2,2.2,-1);for(const x of[-0.8,1.6])box(scene,0.08,2.2,0.08,0x8a6a4a,x+0.4,1.1,-1);
  const SH=[0xffc94d,0x9cc9ff,0xffffff,0xf2b8c6].map((col,i)=>{const s=box(scene,0.6,0.7,0.05,col,0.2+i*0.75,1.8,-1);return s});
  const w=woong();w.position.set(-2,0,-1.6);w.rotation.y=Math.PI;scene.add(w);const cl=box(scene,0.5,0.06,0.4,0xffc94d,-2,0.45,-2.3);
  const c=cam(40);
  return t=>{w.userData.hip.position.y=0.5;w.userData.legs.forEach(l=>l.rotation.x=-1.5);w.userData.arms.forEach((a,i)=>{a.rotation.x=-1.1+Math.sin(t*6+i*3)*0.35});cl.position.x=-2+Math.sin(t*6)*0.1;
    SH.forEach((s,i)=>{s.rotation.y=Math.sin(t*2+i)*0.25});look(c,[2,2.6,5],[-0.5,1,-2]);caption('x8',t);renderer.render(scene,c)}};
// x9 셀프 이발
S.x9=()=>{sky('#efe6d6');const scene=new THREE.Scene();lights(scene,'day');room(scene,{});const mir=new THREE.Mesh(new THREE.PlaneGeometry(2,3),new THREE.MeshLambertMaterial({color:0xcfe6f2}));mir.position.set(-5.88,2.4,0);mir.rotation.y=Math.PI/2;scene.add(mir);
  const w=woong();w.position.set(-4.4,0,0);w.rotation.y=-Math.PI/2;scene.add(w);const H=w.userData.head;const r=rng(9);const tufts=[];
  for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.06+r()*0.05,8,6),smooth(0x2a2220));const a=r()*Math.PI*2,b=r()*1.2;m.position.set(Math.sin(b)*Math.cos(a)*0.27,0.26+Math.cos(b)*0.27,Math.sin(b)*Math.sin(a)*0.27);H.add(m);tufts.push(m)}
  const sc=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.25,0.03),lamb(0xc0c6cc));sc.position.y=-0.7;w.userData.arms[1].add(sc);
  const cut=[];for(let i=0;i<20;i++){const h=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.04),lamb(0x2a2220));scene.add(h);cut.push({h,x:(r()-0.5)*0.6,z:(r()-0.5)*0.6,ph:r()})}
  const TR=at('x9','m04')-0.2;const c=cam(36);
  return t=>{const rev=t>TR;w.userData.arms[1].rotation.x=rev?-0.2:-2.6+Math.sin(t*12)*0.15;w.userData.arms[1].rotation.z=rev?0:0.4;
    tufts.forEach((m,i)=>{m.visible=rev});H.children[1].scale.set(1,rev?0.6:1,1);
    cut.forEach(q=>{const lt=(t*0.7+q.ph)%1;q.h.visible=!rev;q.h.position.set(-4.4+q.x,1.9-lt*1.9,q.z)});setFace(w,rev?'open':'smile');
    look(c,rev?[-2,1.95,0.05]:[-1.2,2.4,2.6],rev?[-4.4,1.95,0]:[-4.6,1.9,0]);caption('x9',t);renderer.render(scene,c)}};
// x10 빗물 축제
S.x10=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');const r=rng(10);roof(scene,{});
  const BK=[];for(let i=0;i<6;i++){const g=new THREE.Group();g.position.set(-3+i*1.3,0,-2.5+(i%2)*0.8);scene.add(g);const b=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.28,0.6,12,1,true),new THREE.MeshLambertMaterial({color:pick(r,[0x3a8fd0,0xe2553f,0xffd84d]),side:THREE.DoubleSide}));b.position.y=0.3;g.add(b);
    const wt=new THREE.Mesh(new THREE.CircleGeometry(0.31,12),lamb(0x8fc8ee));wt.rotation.x=-Math.PI/2;g.add(wt);BK.push(wt)}
  const R=[];for(let i=0;i<260;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.4,0.02),new THREE.MeshBasicMaterial({color:0xcfe0f0,transparent:true,opacity:0.6}));d.userData={x:(r()-0.5)*16,z:(r()-0.5)*12,ph:r()};scene.add(d);R.push(d)}
  const w=woong();w.position.set(0,0,1.2);scene.add(w);const c=cam(42);
  return t=>{R.forEach(d=>{const lt=(t*1.4+d.userData.ph)%1;d.position.set(d.userData.x,8-lt*8,d.userData.z)});BK.forEach(b=>b.position.y=0.05+0.5*clamp01(t/DUR('x10')));
    w.userData.arms.forEach((a,i)=>{a.rotation.x=-2.8;a.rotation.z=(i?0.5:-0.5)+Math.sin(t*6)*0.2});w.rotation.y=Math.sin(t*2)*0.6;setFace(w,'smile');look(c,[1.5,3.5,8],[0,1.2,-1]);caption('x10',t);renderer.render(scene,c)}};
S.d100=dcard('d100',100,'100일');
// x11 벽 달력에 날짜 표시
S.x11=()=>{sky('#efe6d6');const wall=div('box','');Object.assign(wall.style,{left:'0',top:'0',width:'1920px',height:'1080px',borderRadius:'0',background:'#efe4d0'});
  const cv=document.createElement('canvas');cv.width=1400;cv.height=760;Object.assign(cv.style,{position:'absolute',left:'260px',top:'90px'});wall.appendChild(cv);const x=cv.getContext('2d');
  const w=div('',null);
  return t=>{renderer.clear();x.clearRect(0,0,1400,760);x.strokeStyle='#3a3a3a';x.lineWidth=7;x.lineCap='round';const n=Math.min(100,Math.floor(t*40));
    for(let i=0;i<n;i++){const g=Math.floor(i/5),k=i%5,gx=(g%10)*135+20,gy=Math.floor(g/10)*370+40;x.beginPath();if(k<4){x.moveTo(gx+k*24,gy);x.lineTo(gx+k*24+4,gy+150)}else{x.moveTo(gx-10,gy+120);x.lineTo(gx+90,gy+30)}x.stroke()}
    caption('x11',t)}};
// x12 뭉치와 100일
S.x12=()=>{sky('#efe6d6');const scene=new THREE.Scene();lights(scene,'day');room(scene,{});const w=woong();w.position.set(0,0,0.6);w.rotation.y=0.3;scene.add(w);
  const d=dog({collar:true});d.position.set(0.6,0,1.3);d.rotation.y=-2.4;scene.add(d);const cn=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.3,14),lamb(0xe2553f));cn.position.set(0.1,0.15,1.6);scene.add(cn);
  const cd=textSprite('100',70,'#ffd84d',0.004);cd.position.set(0.1,0.55,1.6);scene.add(cd);
  const H=[];for(let i=0;i<6;i++){const h=textSprite('♥',70,'#ff8fb3',0.006);scene.add(h);H.push(h)}const c=cam(36);const TL=endOf('x12','k09')-0.2;
  return t=>{w.userData.hip.position.y=0.5;w.userData.legs.forEach(l=>l.rotation.x=-1.5);const lk=t>TL;d.position.set(lk?0.25:0.6,lk?0.35:0,lk?0.95:1.3);d.rotation.x=lk?-0.6:0;dogWag(d,t*1.5);
    setFace(w,lk?'open':'smile');H.forEach((h,i)=>{const lt=((t-TL)*0.6+i/6)%1;h.visible=lk;h.position.set(-0.3+i*0.15,1.6+lt*1.2,0.9);const s=Math.sin(lt*Math.PI);h.scale.set(h.userData.base[0]*s,h.userData.base[1]*s,1)});
    look(c,[2.4,1.8,4],[0.2,0.9,0.9]);caption('x12',t);renderer.render(scene,c)}};
// x13 해 뜨면 일어나기
S.x13=()=>{const scene=new THREE.Scene();const hl=new THREE.HemisphereLight(0xffd2b0,0x6a5060,1.0);scene.add(hl);const r=rng(13);roof(scene,{panels:true});
  const sun=glowSprite('rgba(255,200,120,1)',30);scene.add(sun);const core=new THREE.Mesh(new THREE.CircleGeometry(4,24),basic(0xffe0a0));scene.add(core);
  const w=woong();w.position.set(0,0,1);w.rotation.y=Math.PI;scene.add(w);const c=cam(42);
  return t=>{const k=clamp01(t/DUR('x13'));bgEl.style.background=k<0.4?SKY.dusk:SKY.morning;sun.position.set(20,-6+k*26,-120);core.position.set(20,-6+k*26,-119);hl.intensity=0.7+k*0.8;
    const st=ease((t-1)/1);w.userData.arms.forEach((a,i)=>{a.rotation.x=-2.9*st;a.rotation.z=(i?0.3:-0.3)*st});look(c,[3,2,7],[4,4,-40]);caption('x13',t);renderer.render(scene,c)}};
// x14 곰팡이 핀 편의점
S.x14=()=>{sky('#3a3a32');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0xc0c0a8,0.6));interior(scene,{floor:0xb8b4a8,wall:0xc8c4b8,ceil:false});const r=rng(14);
  for(const x of[-5,-1.5]){const sh=new THREE.Group();sh.position.set(x,0,-4);scene.add(sh);box(sh,3.2,2.4,0.8,0xbcbcbc,0,1.2,0);for(let j=0;j<3;j++)for(let i=0;i<6;i++){const it=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.3),lamb(pick(r,[0x7a9a4a,0x8aaa5a,0x6a8a4a,0xc9b48a])));it.position.set(-1.25+i*0.5,0.5+j*0.75,0.45);sh.add(it)}}
  const cans=[];for(let i=0;i<40;i++){const cn=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.18,0.32,10),lamb(pick(r,[0xe2553f,0xffd84d,0x3a8fd0])));cn.position.set(2+(i%8)*0.4,0.16+Math.floor(i/8)*0.33,0.5);scene.add(cn);cans.push(cn)}
  const w=woong();w.position.set(3.4,0,2.2);w.rotation.y=Math.PI;scene.add(w);const cnt=div('box','남은 통조림: <b class="n">0</b>개');Object.assign(cnt.style,{left:'1320px',top:'110px',padding:'14px 36px',fontSize:'46px'});
  const c=cam(40);const TC=at('x14','m07')+3;
  return t=>{cnt.querySelector('.n').textContent=Math.min(148,Math.max(0,Math.floor((t-TC)*40)));popEl(cnt,t,TC,'');w.userData.arms[1].rotation.x=-1.4+Math.sin(t*8)*0.2;setFace(w,'flat');look(c,[0,3.2,8],[0.5,1.3,-1]);caption('x14',t);renderer.render(scene,c)}};
// x15 한강 뷰 펜트하우스
S.x15=()=>{sky('clear');const scene=new THREE.Scene();lights(scene,'day');const r=rng(15);ground(scene,0x8cc96a);const rv=new THREE.Mesh(new THREE.PlaneGeometry(400,50),lamb(0x5a90b8));rv.rotation.x=-Math.PI/2;rv.position.set(0,0.03,-40);scene.add(rv);
  const tw=new THREE.Mesh(new THREE.BoxGeometry(8,60,8),new THREE.MeshLambertMaterial({color:0x9fc6e0}));tw.position.set(0,30,0);scene.add(tw);for(let i=0;i<30;i++)box(scene,8.1,0.2,8.1,0xffffff,0,i*2,0);
  for(let i=0;i<12;i++){const b=makeBuilding(r,6,10+r()*25,6);b.position.set(-70+i*12,b.position.y,25+r()*20);scene.add(b)}
  const w=woong();w.position.set(0,60.1,4.2);w.scale.setScalar(1.2);scene.add(w);
  const fee=div('box','관리비 0원');Object.assign(fee.style,{left:'1400px',top:'110px',padding:'14px 36px',fontSize:'52px',color:'#2f7fe0'});const el=div('box','🛗 엘리베이터: 운행 중지');el.textContent='엘리베이터: 운행 중지';Object.assign(el.style,{left:'1260px',top:'210px',padding:'12px 30px',fontSize:'40px',color:'#e2553f'});
  const c=cam(40);
  return t=>{const k=ease(t/DUR('x15'));look(c,lerp3([30,20,40],[6,62,12],k),lerp3([0,30,0],[0,61,4],k));w.userData.arms[0].rotation.set(-2.6,0,-0.4);setFace(w,'smile');popEl(fee,t,at('x15','k10'),'');popEl(el,t,at('x15','k10')+1.6,'');caption('x15',t);renderer.render(scene,c)}};

// x16 바다 낚시
S.x16=()=>{sky('clear');const scene=new THREE.Scene();lights(scene,'day');const sea=new THREE.Mesh(new THREE.PlaneGeometry(600,600),lamb(0x3a86b8));sea.rotation.x=-Math.PI/2;scene.add(sea);
  box(scene,3,0.4,14,0x9a7a5a,0,0.8,2);for(let z=-4;z<=8;z+=3)for(const x of[-1.3,1.3])box(scene,0.25,1.6,0.25,0x7a5a3c,x,0,z);
  const w=woong({patch:true});w.position.set(0,1,-4.2);w.rotation.y=Math.PI;scene.add(w);const rod=box(scene,0.04,0.04,3.4,0x333333,0,0,0);scene.remove(rod);rod.geometry.translate(0,0,-1.7);rod.position.set(0,-0.6,0);rod.rotation.x=0.9;w.userData.arms[1].add(rod);
  const F=[];const r=rng(16);for(let i=0;i<14;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.18,0.7,6),lamb(0xc0d0e0));f.rotation.z=Math.PI/2;scene.add(f);F.push({f,x:(r()-0.5)*20,z:-10-r()*16,ph:r()*3})}
  const fish=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.8,6),lamb(0xc0d0e0));fish.rotation.x=Math.PI/2;scene.add(fish);
  const c=cam(40);const TF=at('x16','k11')-1.5;
  return t=>{F.forEach(q=>{const lt=((t+q.ph)%2.5)/0.7;q.f.visible=lt<1;q.f.position.set(q.x+lt*1.5,Math.sin(lt*Math.PI)*1.6-0.2,q.z);q.f.rotation.z=Math.PI/2-(lt-0.5)*2});
    const up=t>TF;w.userData.arms[1].rotation.x=up?-2.6:-1.0;fish.visible=up;fish.position.set(0,3.4+Math.sin(t*12)*0.1,-6.5);setFace(w,up?'open':'flat');look(c,[4,3.5,1],[0,1.6,-9]);caption('x16',t);renderer.render(scene,c)}};
// x17 고양이 사냥꾼
S.x17=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(17);city(scene,r,{green:0.3});const cat=catM(0x6a6a6a);cat.position.set(-1,0,2);scene.add(cat);
  const P=[0,1,2].map(i=>{const p=pigeonM();p.position.set(1+i*0.6,0.15,-0.5+i*0.4);scene.add(p);return p});const c=cam(36);const TJ=at('x17','m10')+0.5;
  return t=>{const j=clamp01((t-TJ)/0.5);cat.position.set(-1+j*2.3,Math.sin(j*Math.PI)*0.7,2-j*2.2);cat.rotation.y=2.4;cat.userData.legs.forEach(l=>l.rotation.x=j>0&&j<1?(l.position.z>0?-1:1):0);
    P.forEach((p,i)=>{const tt=t-TJ-0.25;if(tt>0){p.position.y=0.15+tt*3.5;p.position.x=1+i*0.6+tt*(i-1)*2;p.rotation.z=Math.sin(t*30)*0.4}});cat.userData.tail.rotation.y=Math.sin(t*5)*0.4;
    look(c,[3,1.4,5],[0.3,0.4,0.6]);caption('x17',t);renderer.render(scene,c)}};
// x18 반딧불이
S.x18=()=>{sky('night');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x5060a0,0.4));const r=rng(18);ground(scene,0x1a2a1c);const rv=new THREE.Mesh(new THREE.PlaneGeometry(400,40),lamb(0x1a2440));rv.rotation.x=-Math.PI/2;rv.position.set(0,0.03,-24);scene.add(rv);
  stars(scene,900,r,{w:400,h:200,y0:10,z:-170,size:0.5});for(let i=0;i<60;i++)tuft(scene,(r()-0.5)*40,-r()*4+2,0.8+r(),0x2a4a2a);
  const FF=[];for(let i=0;i<80;i++){const f=glowSprite('rgba(220,255,120,1)',0.5);f.userData={x:(r()-0.5)*24,y:0.5+r()*3,z:-2-r()*16,ph:r()*6};scene.add(f);FF.push(f)}
  const w=woong();w.position.set(-0.4,0,3);sitPose(w);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true});d.position.set(0.5,0,3.2);d.rotation.y=Math.PI;scene.add(d);
  const c=cam(42);
  return t=>{FF.forEach(f=>{const u=f.userData;f.position.set(u.x+Math.sin(t*0.5+u.ph)*0.8,u.y+Math.sin(t*0.8+u.ph)*0.4,u.z);f.material.opacity=0.4+0.6*Math.max(0,Math.sin(t*2+u.ph))});
    look(c,[1.5,2,8.5],[0,1.4,-6]);caption('x18',t);renderer.render(scene,c)}};
S.d1000=dcard('d1000',1000,'1000일',{tint:'#0f150e'});
// x19 숲이 된 놀이터
S.x19=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(19);ground(scene,0x6a9a55);
  for(let i=0;i<5;i++){const b=makeBuilding(r,6,16+r()*6,4,{wall:'#9da396'});b.position.set(-16+i*8,b.position.y,-14);scene.add(b);for(let k=0;k<6;k++){const v=box(scene,0.6+r(),2+r()*8,0.2,0x4f8a4a,-16+i*8+(r()-0.5)*5,2,-11.9)}}
  const sw=new THREE.Group();scene.add(sw);for(const x of[-1.5,1.5]){box(sw,0.15,3,0.15,0x8a5a3a,x,1.5,0)}box(sw,3.3,0.15,0.15,0x8a5a3a,0,3,0);
  const sl=box(scene,1,2,4,0xb8a050,4,1,0);sl.rotation.x=0.5;tree(scene,4,0.6,1.6,0x4f8a4a);tree(scene,-2,2,2.2,0x4f8a4a);tree(scene,1,-3,2.6,0x5e9e55);tree(scene,-6,-2,2.4);tree(scene,7,3,2);
  for(let i=0;i<160;i++)tuft(scene,(r()-0.5)*26,(r()-0.5)*16,0.8+r()*1.5,pick(r,[0x5e9e55,0x6aa84f]));for(let i=0;i<8;i++)bush(scene,(r()-0.5)*14,0.5,(r()-0.5)*8,1.4,0x4f8a4a);
  const c=cam(40);
  return t=>{look(c,[0,8-t*0.2,18-t*0.4],[0,2,-3]);caption('x19',t);renderer.render(scene,c)}};
// x20 장작 난로
S.x20=()=>{sky('#1a1612');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0x806050,0x101010,0.6));room(scene,{screenOff:1,winSky:['#1a2048','#2a3060'],winCity:'#0e1224'});
  const st=new THREE.Group();st.position.set(1.5,0,-2.5);scene.add(st);box(st,1.4,1.2,1,0x2a2a2a,0,0.6,0);box(st,0.25,4.8,0.25,0x3a3a3a,0,3.6,-0.2);const fd=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.5),basic(0xff8a3a));fd.position.set(0,0.55,0.51);st.add(fd);
  const pl=new THREE.PointLight(0xff9040,0,9,1.4);pl.position.set(1.5,1,-1.6);scene.add(pl);const gl=glowSprite('rgba(255,140,60,1)',3);gl.position.set(1.5,0.6,-1.8);scene.add(gl);
  for(let i=0;i<5;i++){const l=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.8,8),lamb(0x8a5a3a));l.rotation.z=Math.PI/2;l.position.set(3+(i%3)*0.05,0.1+Math.floor(i/3)*0.2+0.0,-2.2+(i%3)*0.21);scene.add(l)}
  const bk=box(scene,0.6,0.08,0.45,0x3a8fd0,0.4,0.04,-0.8);const w=woong({patch:true});w.position.set(1.3,0,-0.6);w.rotation.y=Math.PI;scene.add(w);
  const c=cam(40);const TF=at('x20','k12')-0.8;
  return t=>{const on=t>TF;pl.intensity=on?7+Math.sin(t*13)*0.8:0;gl.visible=on;fd.visible=on;w.userData.hip.position.y=0.5;w.userData.legs.forEach(l=>l.rotation.x=-1.5);setFace(w,on?'smile':'flat');
    w.userData.arms[1].rotation.x=on?-0.5:-1.4;look(c,[-1.4,2.2,3],[1.4,0.9,-1.8]);caption('x20',t);renderer.render(scene,c)}};
// x21 바람 빠진 타이어
S.x21=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(21);ground(scene,0x6a8a55);const C=cars(scene,r,[[0,0,0.3]],{rust:0.75});const cr=C[0];cr.position.y=-0.18;
  cr.traverse(m=>{if(m.geometry&&m.geometry.type==='CylinderGeometry'){m.scale.set(1,1,1);m.scale.y=1;m.geometry=new THREE.CylinderGeometry(0.32,0.32,0.32,12);m.scale.set(1,1,0.6)}});
  for(let i=0;i<40;i++)tuft(scene,(r()-0.5)*6,(r()-0.5)*7,0.6+r(),0x5e9e55);const c=cam(36);
  return t=>{look(c,[3.6-t*0.15,1.2,3.6],[0,0.4,0]);caption('x21',t);renderer.render(scene,c)}};
// x22 명절 윷놀이
S.x22=()=>{sky('#efe6d6');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xfff0e0,0.3));room(scene,{});const mat=box(scene,3,0.03,3,0xd9b98a,0.5,0.02,0.5);
  const w=woong({patch:true});w.position.set(-0.8,0,0.5);w.rotation.y=Math.PI/2;scene.add(w);const d=dog({collar:true});d.position.set(1.9,0,0.5);d.rotation.y=-Math.PI/2;scene.add(d);
  const Y=[0,1,2,3].map(i=>{const y=box(scene,0.6,0.06,0.12,0xf2e0b0,0,0,0);return y});
  const sc=div('box','뭉치 <span style="color:#e2553f">4</span> : <span style="color:#888">0</span> 웅이');Object.assign(sc.style,{left:'1380px',top:'110px',padding:'14px 36px',fontSize:'50px'});
  const c=cam(38);
  return t=>{const ph=(t%2.4)/2.4;Y.forEach((y,i)=>{const air=ph<0.5;y.position.set(0.5+(i-1.5)*0.25,air?0.2+Math.sin(ph/0.5*Math.PI)*2:0.05,0.5+(i%2)*0.2);y.rotation.set(air?t*9+i:0,i*0.7,air?t*7:(i%2?Math.PI:0))});
    w.userData.hip.position.y=0.5;w.userData.legs.forEach(l=>l.rotation.x=-1.5);w.userData.arms[1].rotation.x=ph<0.15?-2.6:-0.8;dogWag(d,t);d.userData.head.rotation.z=Math.sin(t)*0.2;setFace(w,'smile');
    popEl(sc,t,at('x22','m14')+2,'');look(c,[0.5,3.4,4.8],[0.5,0.6,0.5]);caption('x22',t);renderer.render(scene,c)}};
// x23 공터를 덮은 텃밭
S.x23=()=>{sky('clear');const scene=new THREE.Scene();lights(scene,'day');const r=rng(23);ground(scene,0x6a9a55);
  for(let row=0;row<14;row++){box(scene,30,0.3,0.9,0x6b4a2f,0,0.15,-12+row*1.8);for(let i=0;i<24;i++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(0.4,0),lamb(pick(r,[0x5e9e55,0x7dbb5e,0x8cc96a])));p.position.set(-14+i*1.2,0.6,-12+row*1.8);scene.add(p);
    if(r()<0.3){const f=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),lamb(pick(r,[0xe2553f,0xffd84d,0xff9a3c])));f.position.set(p.position.x+0.2,0.8,p.position.z+0.2);scene.add(f)}}}
  for(let i=0;i<14;i++){const b=makeBuilding(r,8,12+r()*20,8,{wall:'#9da396'});b.position.set(-70+i*11,b.position.y,-34);scene.add(b);bush(scene,b.position.x,b.geometry.parameters.height+0.3,-34,2,0x4f8a4a)}
  const w=woong({beard:false,patch:true});w.position.set(2,0,9);scene.add(w);const hoe=box(scene,0.05,1.6,0.05,0x8a6a4a,0,0,0);scene.remove(hoe);hoe.position.y=-0.6;w.userData.arms[1].add(hoe);
  const c=cam(42);
  return t=>{w.userData.arms[1].rotation.x=-1.6+Math.abs(Math.sin(t*3))*1.2;setFace(w,'smile');const k=ease(t/DUR('x23'));look(c,lerp3([4,3,15],[0,26,26],k),[0,0,-2]);caption('x23',t);renderer.render(scene,c)}};
// x24 병 편지
S.x24=()=>{sky('gold');const scene=new THREE.Scene();lights(scene,'dusk');const sea=new THREE.Mesh(new THREE.PlaneGeometry(600,600),lamb(0x4a7aa8));sea.rotation.x=-Math.PI/2;sea.position.set(0,0.02,-300);scene.add(sea);
  const sand=new THREE.Mesh(new THREE.PlaneGeometry(600,20),lamb(0xe8d3a0));sand.rotation.x=-Math.PI/2;sand.position.z=5;scene.add(sand);
  const sun=new THREE.Mesh(new THREE.CircleGeometry(10,24),basic(0xffb070));sun.position.set(0,6,-200);scene.add(sun);const sg=glowSprite('rgba(255,170,100,1)',60);sg.position.set(0,6,-199);scene.add(sg);
  const w=woong({beard:true,patch:true});w.position.set(0,0,3);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true,gray:true,col:0xe8dcc8,s:0.85});d.position.set(1,0,3.2);d.rotation.y=Math.PI;scene.add(d);
  const bt=new THREE.Group();const bb=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.4,10),new THREE.MeshLambertMaterial({color:0x8fd0b0,transparent:true,opacity:0.8}));bt.add(bb);const pp=box(bt,0.08,0.25,0.02,0xfff4d8,0,0,0);scene.add(bt);
  const c=cam(40);const TT=at('x24','m16')+0.6;
  return t=>{const k=t-TT;if(k<0){bt.position.set(0.4,1.4,2.8);bt.rotation.set(0,0,0.3);w.userData.arms[1].rotation.x=-1.2}else{const f=Math.min(k,1.2);bt.position.set(0.4,1.4+f*4-f*f*4.5,2.8-f*9-(k>1.2?(k-1.2)*0.8:0));bt.position.y=Math.max(0.1+Math.sin(t*3)*0.05,bt.position.y);bt.rotation.z=0.3+k*3*(k<1.2);
      w.userData.arms[1].rotation.x=-2.8*Math.max(0,1-k*2)}setFace(w,'flat');look(c,[2.5,2.2,8],[0,1.5,-8]);caption('x24',t);renderer.render(scene,c)}};
