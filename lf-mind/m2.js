S.c4=chap('c4',4,'학교');
// ---------- 4. 학교 ----------
function classroom(scene,n=24){interior(scene,{floor:0xc9a978,wall:0xf2ede2});box(scene,9,3,0.1,0x2f5a3a,0,3.6,-7.85);const r=rng(41);const K=[];
  for(let i=0;i<n;i++){const x=-5+(i%6)*2,z=-3+Math.floor(i/6)*1.9;box(scene,1.1,0.06,0.7,0xd9b98a,x,0.95,z);const p=P(4100+i,{shirt:pick(r,[0x2f4a7a,0x3a5a8a,0xf2f2f2]),hair:pick(r,HAIR),long:r()<0.45,s:0.85});
    p.position.set(x,0,z+0.55);p.rotation.y=Math.PI;sitPose(p);scene.add(p);K.push(p)}return K}
const TEACH=()=>P(4200,{shirt:0x8a6a4a,pants:0x3a3a3a,hair:0x3a2f2a,glasses:true});
S.x1=()=>{sky('#f2ede2');const scene=new THREE.Scene();lights(scene,'day');const K=classroom(scene);const tc=TEACH();tc.position.set(0,0,-6.5);scene.add(tc);
  const B=K.map(p=>think(p,'없음 제발',{size:0.004}));const c=cam(45);
  return t=>{tc.userData.arms[1].rotation.set(-2.6,0,0.2);B.forEach((b,i)=>popT(b,t,MK('x1',0)+i*0.04));K.forEach(p=>{setFace(p,'flat');p.userData.head.rotation.x=0.4});look(c,[0,4.6,-7.3],[0,1.2,0.5]);caption('x1',t);renderer.render(scene,c)}};
S.x2=()=>{sky('#f2ede2');const scene=new THREE.Scene();lights(scene,'day');classroom(scene);const tc=TEACH();tc.position.set(0,0,-6.5);scene.add(tc);const b=think(tc,'다행이다',{size:0.0042});const c=cam(36);
  return t=>{popT(b,t,MK('x2',0));setFace(tc,'smile');look(c,[0.8,2.4,-3.0],[0,1.9,-6.5]);caption('x2',t);renderer.render(scene,c)}};
S.x3=()=>{sky('#f2ede2');const scene=new THREE.Scene();lights(scene,'day');const K=classroom(scene);const top=K[14];setHair(top,0x1d1d24);
  const A=['3번','1번','4번'].map((s,i)=>think(top,s,{size:0.0045}));const c=cam(38);
  const crown=textSprite('1등',60,'#ffd84d',0.004);crown.position.set(0,2.6,0);top.add(crown);
  return t=>{A.forEach((b,i)=>{const t0=MK('x3',0)+i*0.8;popT(b,t,t0,i<2?t0+0.8:null)});K.forEach(p=>p.userData.head.rotation.x=0.5);look(c,[top.position.x+2,2.6,top.position.z+3.6],[top.position.x,1.6,top.position.z]);caption('x3',t);renderer.render(scene,c)}};
S.x4=()=>{sky('#f2ede2');const scene=new THREE.Scene();lights(scene,'day');const K=classroom(scene);const top=K[14];const at0=think(top,'4번',{size:0.0045});scaleBubble(at0,1);
  const B=K.filter(p=>p!==top).map(p=>think(p,'4번!',{size:0.0038}));const c=cam(45);
  return t=>{K.forEach(p=>{if(p!==top){p.rotation.y=Math.PI+Math.atan2(top.position.x-p.position.x,top.position.z-p.position.z)*0.0;p.userData.head.rotation.y=Math.atan2(top.position.x-p.position.x,top.position.z-p.position.z)*0.6}});
    B.forEach((b,i)=>popT(b,t,MK('x4',0)+i*0.03));look(c,[0,7,6],[0,1.2,-1]);caption('x4',t);renderer.render(scene,c)}};
S.x5=()=>{sky('#1a1d26');const nw=div('news','<span style="background:#fff;color:#e23b3b;padding:0 16px;margin-right:24px;border-radius:8px">속보</span>필기시험 전면 폐지… 모든 시험 면접으로');
  const big=div('box','<div style="font-size:140px;color:#e23b3b">✕</div><div style="font-size:80px">필기시험</div>');Object.assign(big.style,{left:'660px',top:'230px',width:'600px',padding:'40px',textAlign:'center'});
  return t=>{renderer.clear();popEl(big,t,0.3,'');caption('x5',t)}};
function interviewSet(scene){interior(scene,{floor:0xcfd4da,wall:0xe8ecf0});table(scene,0,-1.5,4,1.2,0xe8e4dc);const I=[];for(let i=0;i<3;i++){const p=P(4300+i,{shirt:0x2f3440,pants:0x2f3440,hair:0x1d1d24,tie:0x26307a});p.position.set(-1.3+i*1.3,0,-2.4);sitPose(p);scene.add(p);I.push(p)}
  const a=P(4310,{shirt:0x2f3440,pants:0x2f3440,hair:0x4a3426,tie:0xc94f4f});a.position.set(0,0,1.6);a.rotation.y=Math.PI;sitPose(a);scene.add(a);chair(scene,0,1.9,Math.PI);return {I,a}}
S.x6=()=>{sky('#e8ecf0');const scene=new THREE.Scene();lights(scene,'day');const {I,a}=interviewSet(scene);const b=think(I[1],'불합격',{size:0.0045});const c=cam(40);
  return t=>{popT(b,t,MK('x6',0));setFace(I[1],'smile');look(c,[2.6,2.6,4.4],[0,1.7,-1.2]);caption('x6',t);renderer.render(scene,c)}};
S.x7=()=>{sky('#e8ecf0');const scene=new THREE.Scene();lights(scene,'day');const {I,a}=interviewSet(scene);const b0=think(I[1],'불합격',{size:0.0042});scaleBubble(b0,1);const b=think(a,'저도 여기 별로였어요',{size:0.0042});const c=cam(40);
  return t=>{popT(b,t,MK('x7',0));setFace(a,'smile');I.forEach(p=>setFace(p,t>MK('x7',0)+0.5?'open':'smile'));look(c,[-2.6,2.8,-4.8],[0,1.6,0.8]);caption('x7',t);renderer.render(scene,c)}};
S.c5=chap('c5',5,'소개팅');
// ---------- 5. 소개팅 ----------
function cafe(scene){interior(scene,{floor:0xb8956a,wall:0xf3e6d3,wall2:0xe9d8c2});const r=rng(51);
  for(let i=0;i<5;i++){const pl=new THREE.Group();pl.position.set(-10+i*4.5,0,-7.3);scene.add(pl);box(pl,0.5,0.6,0.5,0xd98c6c,0,0.3,0);bush(pl,0,1.1,0,1.1,0x6fae6a)}
  const L=[];for(let i=0;i<4;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.25,12,8),basic(0xffe9b0));l.position.set(-6+i*4,5.5,-2);scene.add(l)}
  const sg=planeTex(4,1,textTex([['CAFE',90,'#7a4a2a']],{w:400,h:100,bg:'#f3e6d3'}),{basic:1});sg.position.set(0,5.5,-7.85);scene.add(sg)}
function dateTable(scene,x=0){table(scene,x,0,1.6,1.2,0xffffff);const c1=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.16,10),lamb(0xffffff));c1.position.set(x-0.4,1.18,0);scene.add(c1);const c2=c1.clone();c2.position.x=x+0.4;scene.add(c2)}
S.d1=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');cafe(scene);dateTable(scene);const w=woong();w.position.set(-1.1,0,0);w.rotation.y=Math.PI/2;sitPose(w);scene.add(w);
  const dt=DATE();dt.position.set(1.1,0,0);dt.rotation.y=-Math.PI/2;sitPose(dt);scene.add(dt);const b=think(w,'누워서 유튜브',{size:0.004});const c=cam(36);
  return t=>{popT(b,t,MK('d1',0));setFace(w,t>at('d1','j07')&&t<endOf('d1','j07')?'open':'smile');w.userData.arms[1].rotation.x=t>at('d1','j07')?-1.6:-0.8;
    look(c,[0,2.2,4.2],[0,1.8,0]);caption('d1',t);renderer.render(scene,c)}};
S.d2=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');cafe(scene);dateTable(scene);const w=woong();w.position.set(-1.1,0,0);w.rotation.y=Math.PI/2;sitPose(w);scene.add(w);
  const dt=DATE();dt.position.set(1.1,0,0);dt.rotation.y=-Math.PI/2;sitPose(dt);scene.add(dt);const b0=think(w,'누워서 유튜브',{size:0.0036});scaleBubble(b0,1);const b=think(dt,'나도 누워서 유튜브',{size:0.004});const c=cam(36);
  return t=>{popT(b,t,MK('d2',0));setFace(dt,t>at('d2','s02')?'open':'smile');look(c,[2.4,2.1,3.0],[0.8,1.9,0]);caption('d2',t);renderer.render(scene,c)}};
S.d3=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');cafe(scene);dateTable(scene);const w=woong();w.position.set(-1.1,0,0);w.rotation.y=Math.PI/2;sitPose(w);scene.add(w);
  const dt=DATE();dt.position.set(1.1,0,0);dt.rotation.y=-Math.PI/2;sitPose(dt);scene.add(dt);const b1=think(w,'♥',{size:0.006}),b2=think(dt,'♥',{size:0.006});
  const H=[];for(let i=0;i<10;i++){const h=textSprite('♥',80,'#ff7aa8',0.005);scene.add(h);H.push(h)}const c=cam(38);
  return t=>{setFace(w,'smile');setFace(dt,'smile');popT(b1,t,MK('d3',0));popT(b2,t,MK('d3',0)+0.2);
    H.forEach((h,i)=>{const lt=((t-MK('d3',0))*0.5+i/10)%1;h.visible=t>MK('d3',0);h.position.set(-1.2+i*0.27,1.8+lt*1.8,0.4);const s=Math.sin(lt*Math.PI);h.scale.set(h.userData.base[0]*s,h.userData.base[1]*s,1)});look(c,[0,2.4,4.4],[0,1.9,0]);caption('d3',t);renderer.render(scene,c)}};
function couple(scene){dateTable(scene,0);const m=P(5501,{shirt:0x7fb7c9,hair:0x2a2220});m.position.set(-1.1,0,0);m.rotation.y=Math.PI/2;sitPose(m);scene.add(m);
  const f=P(5502,{shirt:0xe0c070,hair:0x6b4a2f,long:true});f.position.set(1.1,0,0);f.rotation.y=-Math.PI/2;sitPose(f);scene.add(f);const card=box(m.userData.arms[1],0.18,0.03,0.11,0x222222,0,-0.68,0.1);return {m,f}}
S.d4=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');cafe(scene);const {m,f}=couple(scene);const b=think(m,'반반 하자고 해 줘…',{size:0.0038});const c=cam(36);
  return t=>{m.userData.arms[1].rotation.x=-1.4;setFace(m,t>MK('d4',0)?'flat':'smile');popT(b,t,MK('d4',0));look(c,[-0.6,2.2,4.0],[-0.4,1.9,0]);caption('d4',t);renderer.render(scene,c)}};
S.d5=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');cafe(scene);const {m,f}=couple(scene);const b0=think(m,'반반 하자고 해 줘…',{size:0.0034});scaleBubble(b0,1);
  const b1=think(f,'내가 낼까',{size:0.004}),b2=think(m,'살았다',{size:0.0042});const c=cam(36);
  return t=>{m.userData.arms[1].rotation.x=-1.4;popT(b1,t,MK('d5',0));if(t>MK('d5',1)){scaleBubble(b0,0);popT(b2,t,MK('d5',1));setFace(m,'smile')}else setFace(m,'flat');f.userData.arms[1].rotation.x=t>at('d5','y01')?-1.6:-0.8;
    look(c,[0.6,2.2,4.0],[0.2,1.9,0]);caption('d5',t);renderer.render(scene,c)}};
S.d6=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');cafe(scene);const B=[];const r=rng(56);
  for(let i=0;i<4;i++){const x=-6+i*4;dateTable(scene,x);const a=P(5600+i*2,{shirt:pick(r,SHIRT),hair:pick(r,HAIR)}),b=P(5601+i*2,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:true});
    a.position.set(x-1.1,0,0);a.rotation.y=Math.PI/2;b.position.set(x+1.1,0,0);b.rotation.y=-Math.PI/2;[a,b].forEach(p=>{sitPose(p);scene.add(p);B.push(think(p,'♥',{size:0.005}))})}
  const c=cam(44);
  return t=>{B.forEach((b,i)=>popT(b,t,MK('d6',0)+i*0.15));look(c,[0,4.5,9],[0,1.6,0]);caption('d6',t);renderer.render(scene,c)}};
S.d7=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(57);city(scene,r,{});const m=P(5701,{shirt:0x7fb7c9,hair:0x2a2220});m.position.set(-0.6,0,4);m.rotation.y=0.6;scene.add(m);
  const f=P(5702,{shirt:0xf2b8c6,hair:0x4a3426,long:true});f.position.set(0.6,0,4);f.rotation.y=-0.8;scene.add(f);const b=think(f,'기념일 까먹었지',{size:0.004});const c=cam(36);
  return t=>{setFace(f,'flat');f.userData.arms.forEach(a=>a.rotation.set(-0.6,0,0));popT(b,t,MK('d7',0));setFace(m,t>MK('d7',0)+0.4?'open':'smile');look(c,[0,2.3,8.2],[0,1.9,4]);caption('d7',t);renderer.render(scene,c)}};
S.d8=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(58);city(scene,r,{});const m=P(5701,{shirt:0x7fb7c9,hair:0x2a2220});m.rotation.y=Math.PI;scene.add(m);
  const fl=new THREE.Group();fl.position.set(5.5,0,-8);scene.add(fl);box(fl,3,2.4,0.3,0xf2b8c6,0,1.2,0);const sg=planeTex(2.6,0.6,textTex([['꽃집',80,'#fff']],{w:300,h:70,bg:'#e2557a'}),{basic:1});sg.position.set(0,2.7,0.2);fl.add(sg);
  for(let i=0;i<8;i++){const f2=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),lamb(pick(r,[0xe2553f,0xffd84d,0xf28bc0])));f2.position.set(-1.2+i*0.35,0.5,0.4);fl.add(f2)}
  const c=cam(42);
  return t=>{m.position.set(lerp(0,4.5,clamp01(t/DUR('d8'))),0,lerp(4,-6,clamp01(t/DUR('d8'))));m.rotation.y=Math.PI-0.4;walkPose(m,t*12,0.9);setFace(m,'open');look(c,[-1,3,9],[2,1.8,-3]);caption('d8',t);renderer.render(scene,c)}};
S.c6=chap('c6',6,'가게');
// ---------- 6. 가게 ----------
function restaurant(scene){interior(scene,{floor:0xb89a70,wall:0xf3e6d3});const sg=planeTex(5,1,textTex([['원조 맛집',90,'#fff']],{w:500,h:100,bg:'#c94f4f'}),{basic:1});sg.position.set(0,5.2,-7.85);scene.add(sg);
  table(scene,0,0,2,1.4,0xa07a50);plate(scene,-0.3,1.12,0,0xc94f4f);plate(scene,0.3,1.12,0.1,0xe0c070)}
const OWNER=()=>P(6100,{shirt:0xffffff,pants:0x3a3a3a,hair:0x1d1d24,apron:0xc94f4f});
S.g1=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');restaurant(scene);const cu=P(6101,{shirt:0x6c8ebf,hair:0x3a2f2a});cu.position.set(-1.1,0,0);cu.rotation.y=Math.PI/2;sitPose(cu);scene.add(cu);
  const ow=OWNER();ow.position.set(1.4,0,1.2);ow.rotation.y=-2.2;scene.add(ow);const b=think(cu,'다신 안 옴',{size:0.0042});const c=cam(38);
  return t=>{popT(b,t,MK('g1',0));cu.userData.arms[1].rotation.set(t>at('g1','c02')?-2.6:-0.8,0,0);setFace(cu,'smile');look(c,[0.4,2.4,4.8],[0.2,1.8,0.4]);caption('g1',t);renderer.render(scene,c)}};
S.g2=()=>{sky('#f3e6d3');const scene=new THREE.Scene();lights(scene,'day');restaurant(scene);const ow=OWNER();ow.position.set(1.4,0,1.2);ow.rotation.y=-0.3;scene.add(ow);const b=think(ow,'…레시피 바꿔야겠다',{size:0.0042});const c=cam(34);
  return t=>{const k=ease((t-0.2)/0.6);ow.userData.hip.position.y=lerp(0.8,0.45,k);ow.userData.legs.forEach(l=>l.rotation.x=-1.4*k);ow.userData.head.rotation.x=0.4*k;setFace(ow,'flat');popT(b,t,MK('g2',0));look(c,[1.0,2.2,5.0],[1.2,1.9,1.2]);caption('g2',t);renderer.render(scene,c)}};
S.g3=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0xd8d2c6);const r=rng(63);const sw=makeBuilding(r,12,9,8,{wall:'#e8ddd0'});sw.position.set(0,4.5,-6);scene.add(sw);
  const sg=planeTex(6,1.2,textTex([['원조 맛집',80,'#fff']],{w:600,h:120,bg:'#c94f4f'}),{basic:1});sg.position.set(0,6.2,-1.95);scene.add(sg);
  const Q=[];for(let i=0;i<12;i++){const p=P(6300+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.4});p.position.set(-1+i*1.0,0,0.5+(i%2)*0.3);p.rotation.y=-Math.PI/2+0.2;scene.add(p);Q.push(think(p,'맛있다',{size:0.004}))}
  const ch=chip('한 달 뒤 · 웨이팅 12팀');const c=cam(42);
  return t=>{Q.forEach((b,i)=>popT(b,t,MK('g3',0)+i*0.1));popEl(ch,t,0.2);look(c,[5,3,10],[2,1.8,0]);caption('g3',t);renderer.render(scene,c)}};
function shop(scene){interior(scene,{floor:0xf2e9dc,wall:0xfbf6ee});const r=rng(64);for(let i=0;i<5;i++){const rack=new THREE.Group();rack.position.set(-6+i*2.4,0,-5);scene.add(rack);box(rack,1.6,0.05,0.05,0xc9a96b,0,2.2,0);
  for(let k=0;k<5;k++)box(rack,0.1,1.2,0.6,pick(r,[0x2f3440,0xc94f4f,0xffd84d,0x3a8fd0,0xf28bc0]),-0.6+k*0.3,1.55,0)}
  const mir=new THREE.Mesh(new THREE.PlaneGeometry(1.6,3),new THREE.MeshLambertMaterial({color:0xcfe6f2}));mir.position.set(-2.5,1.8,-2);mir.rotation.y=0.5;scene.add(mir)}
const CLERK=()=>P(6400,{shirt:0x2f3440,pants:0x2f3440,hair:0x1d1d24,long:true});
S.g4=()=>{sky('#f6efe6');const scene=new THREE.Scene();lights(scene,'day');shop(scene);const w=woong({shirt:0xe0a050});w.position.set(-0.5,0,0.5);w.rotation.y=0.4;scene.add(w);
  const ck=CLERK();ck.position.set(1.0,0,0.6);ck.rotation.y=-0.8;scene.add(ck);const b=think(ck,'음… 글쎄',{size:0.004});const c=cam(36);
  return t=>{popT(b,t,MK('g4',0));setFace(ck,t>MK('g4',0)?'flat':'smile');ck.userData.arms[1].rotation.set(-1.3,0,0.3);look(c,[0.3,2.2,4.8],[0.2,1.8,0.5]);caption('g4',t);renderer.render(scene,c)}};
S.g5=()=>{sky('#f6efe6');const scene=new THREE.Scene();lights(scene,'day');shop(scene);const w=woong({shirt:0x6c8ebf});w.position.set(-0.5,0,0.5);w.rotation.y=0.4;scene.add(w);
  const ck=CLERK();ck.position.set(1.0,0,0.6);ck.rotation.y=-0.8;scene.add(ck);const b=think(ck,'오 진짜 잘 어울린다',{size:0.0038});const c=cam(36);
  return t=>{popT(b,t,MK('g5',0));setFace(ck,'smile');setFace(w,'smile');look(c,[0.3,2.2,4.8],[0.2,1.8,0.5]);caption('g5',t);renderer.render(scene,c)}};
S.g6=()=>{sky('#eaf4f6');const scene=new THREE.Scene();lights(scene,'day');interior(scene,{floor:0xdfe8ea,wall:0xf2f8f8});
  const ch=new THREE.Group();scene.add(ch);box(ch,1.2,0.3,3,0x7fc6d0,0,0.9,0);const w=woong();w.position.set(0,1.1,0);w.rotation.x=-1.2;scene.add(w);
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,8),basic(0xffffe0));lamp.position.set(0.6,3,0.8);scene.add(lamp);
  const dc=P(6600,{shirt:0xffffff,pants:0xffffff,hair:0x1d1d24,glasses:true});dc.position.set(1.4,0,0.6);dc.rotation.y=-1.4;scene.add(dc);const tool=box(dc.userData.arms[1],0.03,0.3,0.03,0xc0c6cc,0,-0.75,0);
  const b1=think(dc,'좀 아플 듯',{size:0.004}),b2=think(null,'집에 갈래',{size:0.004});b2.position.set(0,2.6,0.2);scene.add(b2);const c=cam(38);
  return t=>{dc.userData.arms[1].rotation.x=-1.0;popT(b1,t,MK('g6',0));popT(b2,t,MK('g6',1));setFace(w,t>MK('g6',1)?'open':'flat');look(c,[3,2.8,3.6],[0.6,1.6,0.2]);caption('g6',t);renderer.render(scene,c)}};
S.g7=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(67);city(scene,r,{});const tx=car(0xffd84d);tx.position.set(-2.3,0,0);scene.add(tx);
  const sg=planeTex(0.8,0.3,textTex([['TAXI',60,'#222']],{w:200,h:70,bg:'#fff'}),{basic:1});sg.position.set(0,1.45,-0.15);sg.rotation.y=Math.PI/2;tx.add(sg);
  const dr=P(6700,{shirt:0x6c8ebf,hair:0x3a3a3a,cap:0x2f3440});dr.position.set(-0.4,0.25,-0.1);sitPose(dr);dr.scale.setScalar(0.8);tx.add(dr);const b=think(dr,'30분',{size:0.0055,y:2.6});const c=cam(38);
  return t=>{popT(b,t,MK('g7',0));tx.position.z=-t*0.5;look(c,[2.5,2.6,tx.position.z+6],[-2.3,1.4,tx.position.z]);caption('g7',t);renderer.render(scene,c)}};
S.g8=()=>{sky('#fff4e6');const L=[['금방 가요','30분'],['잘 어울리세요','음… 글쎄'],['하나도 안 아파요','좀 아플 듯'],['맛있어요','다신 안 옴']];
  const cards=L.map(([a,b],i)=>{const d=div('box',`<div style="font-size:46px">"${a}"</div><div style="font-size:48px;color:#7a5ad0;margin-top:10px">💭 ${b}</div>`);d.querySelector('div:nth-child(2)').textContent='속마음: '+b;Object.assign(d.style,{left:(160+(i%2)*840)+'px',top:(120+Math.floor(i/2)*330)+'px',width:'760px',padding:'36px 30px',textAlign:'center'});return d});
  return t=>{renderer.clear();cards.forEach((d,i)=>popEl(d,t,0.2+i*0.35,''));caption('g8',t)}};
