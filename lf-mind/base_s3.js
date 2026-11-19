function mannequin(){const p=makePerson(rng(3),{shirt:0xf2f2f2,pants:0xe6e6e6,hair:0xf0f0f0});p.traverse(m=>{if(m.isMesh&&m.material.color){const c=m.material.color.getHex();if(c===0x1a1a1a||c===0xf2a3a3)m.visible=false;else if(m.material.flatShading===false)m.material=smooth(0xf4f1ec);else m.material=lamb(0xefebe4)}});return p}
function deer(s=1){const g=new THREE.Group();const c=0xb98a5a;const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,1.2),lamb(c));b.position.y=1.1;g.add(b);
  const n=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.7,0.25),lamb(c));n.position.set(0,1.5,0.5);n.rotation.x=0.4;g.add(n);const h=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.28,0.45),lamb(c));h.position.set(0,1.85,0.72);g.add(h);g.userData.head=h;g.userData.neck=n;
  for(const[x,z]of[[-0.17,0.45],[0.17,0.45],[-0.17,-0.45],[0.17,-0.45]]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.85,0.1),lamb(0x8a6a48));l.position.set(x,0.43,z);g.add(l)}
  const tl=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.15,0.08),lamb(0xffffff));tl.position.set(0,1.3,-0.62);g.add(tl);g.scale.setScalar(s);return g}
function meerkat(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(0.1,0.35,4,8),lamb(0xc9a06a));b.position.y=0.3;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,8),smooth(0xc9a06a));h.position.set(0,0.6,0.03);g.add(h);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.02,6,4),basic(0x111111));e.position.set(s*0.035,0.62,0.1);g.add(e)}return g}
function giraffe(){const g=new THREE.Group();const c=0xf0c060;const b=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.9,1.8),lamb(c));b.position.y=2.6;g.add(b);
  const n=new THREE.Mesh(new THREE.BoxGeometry(0.35,2.6,0.35),lamb(c));n.position.set(0,4.2,0.75);n.rotation.x=0.25;g.add(n);const h=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,0.8),lamb(c));h.position.set(0,5.5,1.2);g.add(h);
  for(const[x,z]of[[-0.3,0.7],[0.3,0.7],[-0.3,-0.7],[0.3,-0.7]]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.16,2.2,0.16),lamb(c));l.position.set(x,1.1,z);g.add(l)}
  for(let i=0;i<10;i++){const sp=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.25,0.02),lamb(0x9a6a3a));sp.position.set(0.46,2.4+(i%3)*0.25,-0.7+i*0.15);sp.rotation.y=Math.PI/2;g.add(sp)}g.userData.neck=n;return g}
function bicycle(){const g=new THREE.Group();for(const z of[-0.6,0.6]){const w=new THREE.Mesh(new THREE.TorusGeometry(0.35,0.04,6,20),lamb(0x222222));w.rotation.y=Math.PI/2;w.position.set(0,0.35,z);g.add(w)}
  const fr=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.06,1.2),lamb(0x3a8fd0));fr.position.y=0.65;g.add(fr);const st=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,0.06),lamb(0x3a8fd0));st.position.set(0,0.65,-0.3);g.add(st);
  const seat=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.05,0.28),lamb(0x222222));seat.position.set(0,0.92,-0.3);g.add(seat);const hb=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.05,0.05),lamb(0x777777));hb.position.set(0,1.05,0.5);g.add(hb);
  const bs=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.3,0.35),lamb(0xc9a06a));bs.position.set(0,0.95,0.75);g.add(bs);return g}
function lettersTex(text,o={}){return canvasTex(2048,512,(x,w,h)=>{x.fillStyle=o.bg||'#c9a978';x.fillRect(0,0,w,h);x.font=`900 360px ${FONT}`;x.textAlign='center';x.textBaseline='middle';
  // 돌멩이로 쓴 글씨: 글자 모양 안에 점 찍기
  const c2=document.createElement('canvas');c2.width=w;c2.height=h;const y=c2.getContext('2d');y.font=x.font;y.textAlign='center';y.textBaseline='middle';y.fillStyle='#000';y.fillText(text,w/2,h/2+10);
  const d=y.getImageData(0,0,w,h).data;const r=rng(o.seed||5);for(let i=0;i<9000;i++){const px=Math.floor(r()*w),py=Math.floor(r()*h);if(d[(py*w+px)*4+3]>128){x.fillStyle=pick(r,['#eeeeea','#d8d6d0','#f6f4ee','#bdbab2']);x.beginPath();x.arc(px,py,6+r()*6,0,7);x.fill()}}})}
S[30]=dcard(30,30,'한 달');
// 31 마트 냄새
S[31]=()=>{sky('#2a2a24');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0xa0a090,0.6));interior(scene,{floor:0x9a9a8a,wall:0xbab6a8,ceil:false});const r=rng(31);
  for(let i=-3;i<=3;i++){const fz=new THREE.Group();fz.position.set(i*3.2,0,-5);scene.add(fz);const b=new THREE.Mesh(new THREE.BoxGeometry(3,1.2,1.6),lamb(0xdfe6ec));b.position.y=0.6;fz.add(b);
    const gl=new THREE.Mesh(new THREE.BoxGeometry(2.8,0.05,1.4),new THREE.MeshLambertMaterial({color:0x8a9a6a,transparent:true,opacity:0.7}));gl.position.y=1.22;fz.add(gl)}
  const sg=planeTex(8,1.2,textTex([['냉동식품',90,'#fff']],{w:800,h:120,bg:'#3a6fd0'}),{basic:1});sg.position.set(0,4.5,-7.8);scene.add(sg);
  const W2=[];for(let i=0;i<16;i++){const s=textSprite('〰',90,'#9adf6a',0.012);s.position.set((r()-0.5)*20,1.5+r()*2,-4.5);scene.add(s);W2.push({s,ph:r()})}
  const F=[];for(let i=0;i<20;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.04,4,3),basic(0x111111));scene.add(f);F.push({f,ph:r()*6,x:(r()-0.5)*14})}
  const w=woong();scene.add(w);const c=cam(40);
  return t=>{W2.forEach(q=>{const lt=(t*0.4+q.ph)%1;q.s.position.y=1.4+lt*2.5;q.s.material.opacity=Math.sin(lt*Math.PI)});F.forEach(q=>q.f.position.set(q.x+Math.sin(t*3+q.ph)*0.6,2+Math.cos(t*4+q.ph)*0.4,-4+Math.sin(t*2+q.ph)*0.5));
    const k=clamp01((t-2.5)/2.5);w.position.set(lerp(2,-1,k),0,lerp(-2,7,k));w.rotation.y=k>0?Math.PI*0.08:Math.PI;walkPose(w,t*(k>0&&k<1?14:0),0.7);
    w.userData.arms[1].rotation.x=-2.6;w.userData.arms[1].rotation.z=0.5;setFace(w,'open');look(c,[6,3.5,9],[0,1.8,-2]);caption(31,t);renderer.render(scene,c)}};
// 32 통조림 탑
S[32]=()=>{sky('#efe6d6');const scene=new THREE.Scene();lights(scene,'day');room(scene,{});const r=rng(32);
  const tw=new THREE.Group();tw.position.set(1.5,0,-1);scene.add(tw);let n=0;for(let lv=0;lv<6;lv++){const k=6-lv;for(let i=0;i<k;i++)for(let j=0;j<2;j++){const cn=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.42,12),lamb(pick(r,[0xe2553f,0xffd84d,0x3a8fd0,0x8cc96a])));cn.position.set(-k*0.24+i*0.48+0.24,0.21+lv*0.43,j*0.48);cn.userData.n=n++;tw.add(cn)}}
  for(let i=0;i<8;i++){const rm=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.18,0.5),lamb(0xff7a3c));rm.position.set(-1.8,0.09+i*0.19,-0.6);rm.rotation.y=(r()-0.5)*0.3;scene.add(rm)}
  for(let i=0;i<6;i++){const bt=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.7,10),new THREE.MeshLambertMaterial({color:0x9fd8ff,transparent:true,opacity:0.8}));bt.position.set(4+(i%3)*0.3,0.35,-0.5+Math.floor(i/3)*0.3);scene.add(bt)}
  const w=woong();w.position.set(-0.4,0,1.8);w.rotation.y=0.4;scene.add(w);const c=cam(40);
  return t=>{tw.children.forEach(cn=>cn.visible=t*14>cn.userData.n);setFace(w,'smile');w.userData.arms[0].rotation.set(-0.3,0,-0.9);w.userData.arms[1].rotation.set(-0.3,0,0.9);
    look(c,[2,3,7.5],[1,1.4,-0.5]);caption(32,t);renderer.render(scene,c)}};
// 33 거실 텐트 캠핑
S[33]=()=>{sky('#0d0f1a');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0x6070b0,0x101018,0.6));const R=room(scene,{winSky:['#0a0f2a','#1a2048'],winCity:'#0e1224',screenOff:1});R.bed.visible=false;
  const tn=new THREE.Group();tn.position.set(-2.8,0,-1.6);scene.add(tn);const cn=new THREE.Mesh(new THREE.ConeGeometry(2.2,2.6,4),lamb(0x4fa86a));cn.rotation.y=Math.PI/4;cn.position.y=1.3;tn.add(cn);
  const dr=new THREE.Mesh(new THREE.PlaneGeometry(0.9,1.3),basic(0x22301f));dr.position.set(0.9,0.65,0.9);dr.rotation.y=Math.PI/4;dr.rotation.x=-0.2;tn.add(dr);
  const lp=new THREE.PointLight(0xffc070,10,9,1.4);lp.position.set(0.5,1.2,0.6);scene.add(lp);const lan=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.3,8),basic(0xffd48a));lan.position.set(0.4,0.15,0.4);scene.add(lan);
  const gl=glowSprite('rgba(255,190,110,1)',4);gl.position.set(0.4,0.3,0.4);scene.add(gl);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.26,0.25,12),lamb(0xaaaaaa));pot.position.set(-0.2,0.35,1.4);scene.add(pot);const bn=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.2,12),lamb(0x333333));bn.position.set(-0.2,0.1,1.4);scene.add(bn);
  const fl=glowSprite('rgba(90,140,255,1)',0.8);fl.position.set(-0.2,0.25,1.4);scene.add(fl);
  const stm=[];for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true}));scene.add(s);stm.push(s)}
  const w=woong();w.position.set(-1.0,0,0.6);sitPose(w);w.rotation.y=0.9;scene.add(w);const c=cam(40);
  return t=>{stm.forEach((s,i)=>{const lt=(t*0.5+i/5)%1;s.position.set(-0.2+Math.sin(t+i)*0.1,0.5+lt*1.2,1.4);s.material.opacity=0.6*(1-lt)});lp.intensity=9+Math.sin(t*9)*0.6;setFace(w,'smile');
    look(c,[3.5,2.6,5],[-1,0.9,0]);caption(33,t);renderer.render(scene,c)}};
// 34 도서관
S[34]=()=>{sky('#efe6d6');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xfff0e0,0.3));interior(scene,{floor:0xc9a978,wall:0xefe6d6});const r=rng(34);
  for(let row=0;row<3;row++)for(const x of[-7,-3.5,3.5,7]){const sh=new THREE.Group();sh.position.set(x,0,-6+row*0.01);if(row)sh.position.set(x+(row==1?-1.75:1.75)*0,0,-6);scene.add(sh);const fr=new THREE.Mesh(new THREE.BoxGeometry(3.2,4.4,0.8),lamb(0x8a6a4a));fr.position.y=2.2;sh.add(fr);
    for(let j=0;j<4;j++)for(let i=0;i<12;i++){const bk=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.7+r()*0.2,0.6),lamb(pick(r,[0xc94f4f,0x3a6fd0,0x2a9d5a,0xe0c070,0x8a5ab0,0xe39a6b])));bk.position.set(-1.35+i*0.245,0.5+j*1.05,0.15);sh.add(bk)}}
  const tb=box(scene,4,0.12,2,0xa07a50,0,1.2,1);for(const x of[-1.8,1.8])box(scene,0.12,1.2,1.8,0x8a6a4a,x,0.6,1);
  const st=[];for(let i=0;i<10;i++){st.push(box(scene,0.8,0.15,0.6,pick(r,[0xc94f4f,0x3a6fd0,0x2a9d5a,0xe0c070]),1.2,1.33+i*0.16,0.8))}
  const bt=planeTex(1.2,0.5,textTex([['불 피우는 법',44]],{w:300,h:120,bg:'#ffe9b0'}));bt.position.set(1.2,1.33+10*0.16+0.01,0.8);bt.rotation.x=-Math.PI/2;scene.add(bt);
  const w=woong();w.position.set(-0.6,0,2.4);sitPose(w);w.rotation.y=Math.PI;scene.add(w);const ob=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.05,0.6),lamb(0xffffff));ob.position.set(-0.6,1.32,1.4);scene.add(ob);
  const tag=div('box','대출 기한: 없음');Object.assign(tag.style,{left:'1360px',top:'120px',padding:'14px 34px',fontSize:'48px',background:'#ffe9b0'});
  const c=cam(40);
  return t=>{w.rotation.y=Math.PI;look(c,[-3,3.4,6.5],[0,1.6,0.5]);popEl(tag,t,endOf(34,'n17')-1.6,'');setFace(w,'flat');caption(34,t);renderer.render(scene,c)}};
// 35 들개 무리, 웅이 차 뒤에 숨음
S[35]=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');const r=rng(35);city(scene,r,{green:0.1});const C=cars(scene,r,[[3.2,4,0.1]]);
  const D=[];for(let i=0;i<7;i++){const d=dog({col:pick(r,[0x8a6a4a,0x3a3a3a,0xd9b98a,0x6a5a4a]),dark:0x2a2a2a,s:1.4+r()*0.4});d.userData.off=[(r()-0.5)*3,(r()-0.5)*4];scene.add(d);D.push(d)}
  const w=woong();w.position.set(4.6,0,2.2);w.rotation.y=-Math.PI/2;scene.add(w);const c=cam(40);
  return t=>{D.forEach((d,i)=>{d.position.set(-1+d.userData.off[0],0,-30+t*4.2+d.userData.off[1]);dogWalk(d,t+i)});w.userData.hip.position.y=0.55;w.userData.legs.forEach(l=>l.rotation.x=-1.2);setFace(w,'open');
    w.userData.head.rotation.y=-0.3;look(c,[7,2.3,8],[0,0.8,-6]);caption(35,t);renderer.render(scene,c)}};
// 36 작은 강아지가 다가옴
S[36]=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');const r=rng(36);city(scene,r,{green:0.1});
  const w=woong();w.position.set(0,0,2);w.rotation.y=Math.PI;scene.add(w);const d=dog({collar:true});scene.add(d);d.rotation.y=0;
  const cn=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.18,10),lamb(0xe2553f));cn.position.y=-0.65;w.userData.arms[1].add(cn);
  const H=[];for(let i=0;i<5;i++){const h=textSprite('♥',70,'#ff8fb3',0.006);scene.add(h);H.push(h)}const c=cam(38);const TA=at(36,'j18')+1.2;
  return t=>{w.userData.hip.position.y=0.5;w.userData.legs.forEach(l=>l.rotation.x=-1.5);w.userData.arms[1].rotation.x=-1.2;setFace(w,t>TA?'smile':'flat');
    const k=ease((t-0.5)/3.5);d.position.set(0,0,lerp(-4,1.0,k));dogWalk(d,k<1?t:0);if(k>=1)dogWag(d,t);
    H.forEach((h,i)=>{const lt=((t-TA)*0.5+i/5)%1;h.visible=t>TA;h.position.set(-0.2+i*0.1,0.8+lt*1.4,1.2);const s=Math.sin(lt*Math.PI);h.scale.set(h.userData.base[0]*s,h.userData.base[1]*s,1)});
    look(c,[2.4,1.4,-1.5],[0,0.6,1.4]);caption(36,t);renderer.render(scene,c)}};
// 37 이름표 '뭉치'
S[37]=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');const r=rng(37);city(scene,r,{green:0.1});const d=dog({collar:true,s:1.6});d.position.set(0,0,0);scene.add(d);
  const tg=planeTex(0.5,0.3,textTex([['뭉치',90,'#3a2a00']],{w:300,h:180,bg:'#ffd84d',r:40}),{basic:1});tg.position.set(0,0.63,0.62);scene.add(tg);
  const w=woong();w.position.set(1.6,0,0.2);w.rotation.y=-1.7;scene.add(w);const c=cam(34);
  return t=>{w.userData.hip.position.y=0.5;w.userData.legs.forEach(l=>l.rotation.x=-1.5);w.userData.arms[0].rotation.x=-1.3;w.userData.arms[0].rotation.z=Math.sin(t*4)*0.2;setFace(w,'smile');dogWag(d,t);
    const k=ease((t-0.3)/2.5);look(c,lerp3([0.1,0.75,1.9],[-1.2,1.5,4.2],k),lerp3([0,0.65,0.6],[0.6,0.9,0.3],k));caption(37,t);renderer.render(scene,c)}};
// 38 동물원 동물들 밖으로
S[38]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(38);ground(scene,0xa9c48a);const road=new THREE.Mesh(new THREE.PlaneGeometry(8,300),lamb(0x6b6f76));road.rotation.x=-Math.PI/2;road.position.x=3;scene.add(road);
  const gate=new THREE.Group();gate.position.set(-6,0,-6);scene.add(gate);for(const x of[-3,3]){box(gate,0.6,5,0.6,0x7a5a3c,x,2.5,0)}const sg=planeTex(6.6,1.3,textTex([['동물원',100,'#fff']],{w:660,h:130,bg:'#2a9d5a'}),{basic:1});sg.position.set(0,5,0.35);gate.add(sg);
  const dr=box(gate,2.6,3,0.1,0xc9a06a,-1.6,1.5,0.3);dr.rotation.y=1.2;dr.position.x=-2.8;
  for(let i=0;i<8;i++)tree(scene,-12-r()*10,-r()*20,1.6);
  const M=[];for(let i=0;i<7;i++){const m=meerkat();m.scale.setScalar(1.6);scene.add(m);M.push(m)}const gf=giraffe();gf.position.set(-9,0,-12);scene.add(gf);
  const c=cam(40);
  return t=>{M.forEach((m,i)=>{m.position.set(-6+t*1.6-i*0.55,0,-4+i*0.05+Math.sin(i)*0.3);m.rotation.y=Math.PI/2;m.position.y=Math.abs(Math.sin(t*12+i))*0.06});gf.position.x=-9+t*0.5;gf.userData.neck.rotation.z=Math.sin(t)*0.08;
    look(c,[6,3,10],[-3,2,-5]);caption(38,t);renderer.render(scene,c)}};
// 39·40 마네킹과 저녁
function dinner(si,o){return()=>{sky('#efe2cc');const scene=new THREE.Scene();lights(scene,'dusk');scene.add(new THREE.AmbientLight(0xffe0c0,0.3));room(scene,{winSky:['#e98a7f','#ffc58c'],screenOff:1});
  box(scene,2.2,0.1,1.4,0xc9a06a,0.5,1.05,0.5);for(const x of[-0.4,1.4])box(scene,0.1,1.05,0.1,0x8a6a4a,x,0.52,0.5);
  const w=woong();w.position.set(-0.9,0,0.5);w.rotation.y=Math.PI/2;sitPose(w);scene.add(w);const m=mannequin();m.position.set(1.9,0,0.5);m.rotation.y=-Math.PI/2;sitPose(m);scene.add(m);
  const d=dog({collar:true});d.position.set(0.5,0,1.8);d.rotation.y=Math.PI;scene.add(d);
  for(const x of[0,1]){const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.2,0.05,14),lamb(0xffffff));pl.position.set(x,1.13,0.5);scene.add(pl)}
  const B=o.bubbles?o.bubbles.map(s=>bub(w,s,{size:0.0034,fs:56})):[];const c=cam(38);
  return t=>{setFace(w,Math.sin(t*9)>0&&t%2<1.4?'open':'smile');d.userData.head.rotation.z=Math.sin(t*1.2)*0.35;dogWag(d,t*0.4);
    B.forEach((b,i)=>{const t0=0.6+i*(DUR(si)-2)/B.length;scaleBubble(b,pop((t-t0)/0.3));b.position.y=2.0+(B.length-1-i)*0.0+Math.max(0,(t-t0))*0.0;b.position.y=1.95+i*0.38;b.position.x=(i%2?0.25:-0.25)});
    look(c,o.cam[0],o.cam[1]);caption(si,t);renderer.render(scene,c)}}}
S[39]=dinner(39,{cam:[[0.5,2.4,5.2],[0.5,1.5,0.5]]});
S[40]=dinner(40,{cam:[[-1.6,2.6,4.2],[0.2,2.2,0.5]],bubbles:['오늘 날씨 좋더라','그치?','나도 그렇게 생각해','ㅋㅋㅋ','근데 있잖아…']});
// 41 일기
S[41]=()=>{sky('#2a2420');const nb=div('box',`<div style="font-size:52px;border-bottom:3px solid #e8d8c0;padding-bottom:16px">D+30 · 오늘의 일기</div><div class="tx" style="font-size:56px;line-height:1.8;margin-top:30px;font-weight:700;color:#3a3a6a"></div>`);
  Object.assign(nb.style,{left:'460px',top:'60px',width:'1000px',height:'760px',background:'#fffaf0',padding:'60px 80px',boxSizing:'border-box',backgroundImage:'repeating-linear-gradient(#fffaf0 0 98px,#e8e0d0 98px 100px)',transform:'rotate(-2deg)'});
  const L=['오늘도 아무도 없었다.','뭉치랑 100마디 했다.','뭉치: 0마디.','그래도 꼬리는 흔들었다 ♥'];const tx=nb.querySelector('.tx');
  return t=>{renderer.clear();const n=Math.floor(t*9);let s='',k=n;for(const l of L){if(k<=0)break;s+=l.slice(0,k)+(k>=l.length?'<br>':'');k-=l.length+4}tx.innerHTML=s;caption(41,t)}};
// 42 주유소
S[42]=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0xb8b4aa);const r=rng(42);
  const can=box(scene,9,0.4,6,0xe8e8e8,0,4.2,0);box(scene,9.1,0.6,6.1,0xc94f4f,0,4.6,0);for(const x of[-3,3])box(scene,0.4,4,0.4,0xdddddd,x,2,0);
  for(const x of[-3,3]){box(scene,0.9,1.8,0.6,0xdddddd,x,0.9,1.2);const sc=planeTex(0.6,0.3,textTex([['고장',60,'#e2553f']],{w:200,h:100,bg:'#111'}),{basic:1});sc.position.set(x,1.4,1.51);scene.add(sc)}
  const pr=planeTex(2.4,3,textTex([['휘발유',60],['유통기한',50,'#666'],['≈ 1년',100,'#e2553f']],{w:300,h:380,bg:'#fff'}));pr.position.set(7,2.5,1);pr.rotation.y=-0.3;scene.add(pr);box(scene,0.2,1.2,0.2,0x777777,7,0.6,0.9);
  const w=woong();w.position.set(0,0,2.6);scene.add(w);const jc=box(w,0.5,0.6,0.25,0xe2553f,0,0,0);w.remove(jc);w.userData.arms[1].add(jc);jc.position.set(0,-0.85,0.05);
  const c=cam(40);
  return t=>{w.userData.arms[1].rotation.x=-0.1;setFace(w,'flat');w.rotation.y=Math.sin(t*0.6)*0.3;look(c,[2,2.6,11-t*0.2],[1.5,2.2,0]);caption(42,t);renderer.render(scene,c)}};
// 43 자전거 + 뭉치
S[43]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(43);city(scene,r,{green:0.2});
  const bk=bicycle();scene.add(bk);const w=woong();w.position.set(0,0.2,-0.3);sitPose(w);w.userData.legs.forEach(l=>l.rotation.x=-0.6);w.scale.setScalar(0.95);bk.add(w);w.userData.arms.forEach(a=>a.rotation.x=-1.3);
  const d=dog({collar:true,s:0.8});d.position.set(0,0.95,0.7);bk.add(d);bk.scale.setScalar(1.4);
  const c=cam(40);
  return t=>{bk.position.set(-2,0,8-t*3.2);w.userData.legs[0].rotation.x=-0.6+Math.sin(t*8)*0.4;w.userData.legs[1].rotation.x=-0.6-Math.sin(t*8)*0.4;setFace(w,'smile');d.userData.head.rotation.y=Math.sin(t*2)*0.4;
    look(c,[bk.position.x+3.5,2.6,bk.position.z+5],[bk.position.x,1.3,bk.position.z-1]);caption(43,t);renderer.render(scene,c)}};
S[44]=dcard(44,365,'1년',{tint:'#0d1a10'});
// 45 도로 틈마다 풀
S[45]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(45);city(scene,r,{green:0.45});cars(scene,r,[[-2.3,-6,0.2],[2.4,-18]],{rust:0.3});const c=cam(40);
  return t=>{look(c,[0,0.6+t*0.12,10-t*1.4],[0,0.8+t*0.1,-20]);caption(45,t);renderer.render(scene,c)}};
// 46 광화문 광장 사슴
S[46]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0x8cc96a);const r=rng(46);
  const pz=new THREE.Mesh(new THREE.PlaneGeometry(14,60),lamb(0xc9c2b4));pz.rotation.x=-Math.PI/2;pz.position.y=0.01;scene.add(pz);
  const gt=new THREE.Group();gt.position.set(0,0,-30);scene.add(gt);box(gt,18,4,3,0x9a8a7a,0,2,0);const door=box(gt,3,3,0.1,0x2a2a2a,0,1.5,1.55);
  const rf=new THREE.Mesh(new THREE.ConeGeometry(11,3,4),lamb(0x5a6a6a));rf.rotation.y=Math.PI/4;rf.scale.set(1,1,0.35);rf.position.y=6.4;gt.add(rf);box(gt,14,2,2.4,0xb84a3a,0,4.9,0);
  for(let i=0;i<200;i++)tuft(scene,(r()-0.5)*14,10-r()*40,0.5+r()*1.2);
  const D=[];[[0,-6,1.2],[1.6,-7,1],[-1.2,-8,0.7]].forEach(([x,z,s],i)=>{const d=deer(s);d.position.set(x,0,z);d.rotation.y=0.5+i;scene.add(d);D.push(d)});
  const c=cam(40);
  return t=>{D.forEach((d,i)=>{d.userData.neck.rotation.x=0.4+Math.max(0,Math.sin(t*0.8+i*2))*0.9;d.userData.head.position.y=1.85-Math.max(0,Math.sin(t*0.8+i*2))*0.7});
    look(c,[5,2.5,6-t*0.2],[0,1.5,-8]);caption(46,t);renderer.render(scene,c)}};
// 47 맑은 하늘
S[47]=()=>{sky('clear');const scene=new THREE.Scene();lights(scene,'day');const r=rng(47);city(scene,r,{green:0.5});
  for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(30+r()*20,30+r()*25,5),lamb(pick(r,[0x6a9a7a,0x7aa88a,0x5a8a6a])));m.position.set(-150+i*45,0,-260);scene.add(m)}
  const wd=div('box',`<div style="font-size:34px;color:#666">미세먼지</div><div style="font-size:84px;color:#2f7fe0">좋음</div><div style="font-size:30px;color:#888">365일 연속</div>`);Object.assign(wd.style,{left:'1500px',top:'110px',padding:'18px 46px',textAlign:'center'});
  const c=cam(45);
  return t=>{const k=ease(t/DUR(47));look(c,[0,30+k*10,30],[0,lerp(10,30,k),-120]);popEl(wd,t,endOf(47,'n24')-2.2,'');caption(47,t);renderer.render(scene,c)}};
// 48 토마토
S[48]=()=>{sky('clear');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0x8a6a4a);const r=rng(48);
  for(let row=0;row<3;row++){box(scene,8,0.4,1.2,0x6b4a2f,0,0.2,-row*2);for(let i=0;i<7;i++){const p=new THREE.Group();p.position.set(-3.4+i*1.15,0.4,-row*2);scene.add(p);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.4,5),lamb(0x4f8a4a));st.position.y=0.7;p.add(st);for(let k=0;k<3;k++){const lf=new THREE.Mesh(new THREE.IcosahedronGeometry(0.35,0),lamb(0x5e9e55));lf.position.set((r()-0.5)*0.4,0.5+k*0.4,(r()-0.5)*0.3);p.add(lf)}
    for(let k=0;k<4;k++){const tm=new THREE.Mesh(new THREE.SphereGeometry(0.11,8,6),lamb(0xe2553f));tm.position.set((r()-0.5)*0.6,0.4+r()*0.9,0.25);p.add(tm)}}}
  const w=woong({patch:true});w.position.set(1,0,2);scene.add(w);const tm=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),lamb(0xe2553f));tm.position.y=-0.68;w.userData.arms[1].add(tm);
  const d=dog({collar:true});d.position.set(-0.4,0,2.4);d.rotation.y=0.8;scene.add(d);const c=cam(40);
  return t=>{const up=ease((t-at(48,'j23')-1.5)/0.5);w.userData.arms[1].rotation.x=-2.6*up-0.2;setFace(w,'smile');dogWag(d,t);look(c,[2.5,2.4,6],[0.5,1.3,0]);caption(48,t);renderer.render(scene,c)}};
// 49 첫 겨울, 이불 다섯 겹
S[49]=()=>{sky('#1a2030');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xb0c0e0,0x202030,0.9));const R=room(scene,{winSky:['#7a8aa8','#c9d3e0'],winCity:'#e6ecf2',screenOff:1});
  const bl=new THREE.Group();bl.position.set(0.5,0,0.5);scene.add(bl);[0x9cc9ff,0xf2b8c6,0xffd84d,0x8cc96a,0xc7a3c9].forEach((c,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1.1-i*0.08,12,8),lamb(c));m.scale.set(1,0.85,0.9);m.position.y=0.9+i*0.03;m.rotation.y=i*0.5;bl.add(m)});
  const w=woong();w.position.set(0.5,0.5,0.75);w.scale.setScalar(0.9);scene.add(w);w.userData.hip.visible=true;const hd=w;const d=dog({collar:true,s:0.9});d.position.set(1.25,1.25,0.55);d.rotation.y=-0.3;scene.add(d);
  const S2=[];const r=rng(49);for(let i=0;i<60;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.03,4,3),basic(0xffffff));s.userData={x:-0.2+r()*3.4,ph:r()};scene.add(s);S2.push(s)}
  const B=[0,1].map(()=>{const b=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true}));scene.add(b);return b});
  const c=cam(36);
  return t=>{S2.forEach(s=>{const lt=(t*0.15+s.userData.ph)%1;s.position.set(s.userData.x,4.4-lt*2.3,-4.8)});B.forEach((b,i)=>{const lt=(t*0.6+i*0.5)%1;b.position.set(0.5+(i?0.75:0),1.95+lt*0.4,1.2+lt*0.3);b.material.opacity=0.6*(1-lt);b.scale.setScalar(0.5+lt)});
    w.userData.arms.forEach(a=>a.visible=false);w.userData.legs.forEach(l=>l.visible=false);w.userData.hip.children[0].visible=false;setFace(w,'flat');w.userData.head.rotation.z=Math.sin(t*20)*0.03;
    look(c,[1.2,2.2,5.2],[0.8,1.5,0]);caption(49,t);renderer.render(scene,c)}};
// 50 운동장에 돌 글씨
S[50]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0x8cc96a);const tex=lettersTex('누구 없어요?');
  const fld=new THREE.Mesh(new THREE.PlaneGeometry(40,10),new THREE.MeshLambertMaterial({map:tex}));fld.rotation.x=-Math.PI/2;fld.position.y=0.02;scene.add(fld);
  const mask=new THREE.Mesh(new THREE.PlaneGeometry(40,10),lamb(0xc9a978));mask.rotation.x=-Math.PI/2;mask.position.y=0.03;scene.add(mask);
  const sch=makeBuilding(rng(50),30,9,6,{wall:'#e8ddd0'});sch.position.set(0,4.5,-16);scene.add(sch);
  const w=woong({patch:true});scene.add(w);const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(0.15,0),lamb(0xdedad0));rk.position.y=-0.68;w.userData.arms[1].add(rk);const c=cam(40);
  return t=>{const k=clamp01(t/(DUR(50)-1));mask.scale.x=1-k;mask.position.x=20*k;w.position.set(-20+40*k+0.8,0,1.2);w.userData.hip.position.y=0.62;w.userData.hip.rotation.x=0.5;w.userData.arms[1].rotation.x=-0.8+Math.sin(t*6)*0.3;w.rotation.y=Math.PI/2;
    setFace(w,'flat');look(c,[w.position.x-2,6,12],[w.position.x-3,0,-1]);caption(50,t);renderer.render(scene,c)}};
// 51 하늘에서 본 운동장 + 라디오
S[51]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(51);ground(scene,0x7fae63);const fld=new THREE.Mesh(new THREE.PlaneGeometry(40,10),new THREE.MeshLambertMaterial({map:lettersTex('누구 없어요?')}));fld.rotation.x=-Math.PI/2;fld.position.y=0.02;scene.add(fld);
  const sch=makeBuilding(r,30,9,6,{wall:'#e8ddd0'});sch.position.set(0,4.5,-16);scene.add(sch);
  for(let i=0;i<90;i++){const x=(r()-0.5)*200,z=(r()-0.5)*200;if(Math.abs(x)<26&&Math.abs(z)<22)continue;const h=5+r()*25,w=5+r()*6;const b=makeBuilding(r,w,h,w,{wall:pick(r,['#a8a394','#b0a898'])});b.position.set(x,h/2,z);scene.add(b)}
  const w=woong({patch:true});w.position.set(21,0,2);w.scale.setScalar(1.5);scene.add(w);
  const rd=div('box',`<div style="font-size:30px;color:#888">FM <span class="f">88.1</span> MHz</div><div class="z" style="font-size:54px;color:#555;margin-top:6px">지지직…</div>`);Object.assign(rd.style,{left:'80px',top:'80px',padding:'18px 40px',background:'#f2e9d8',border:'8px solid #8a6a4a'});
  const c=cam(40);
  return t=>{const k=ease(t/DUR(51));look(c,[0,30+k*90,8+k*10],[0,0,0]);rd.querySelector('.f').textContent=(88.1+((t*7.3)%19.8)).toFixed(1);rd.querySelector('.z').textContent='지'+'지'.repeat(1+Math.floor(t*4)%3)+'직…';
    rd.style.opacity=clamp01((t-at(51,'n26'))/0.3);caption(51,t);renderer.render(scene,c)}};
// 52 혼자 생일 축하
S[52]=()=>{sky('#0d0f1a');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0x5060a0,0x101018,0.45));room(scene,{winSky:['#0a0f2a','#1a2048'],winCity:'#0e1224',screenOff:1});
  box(scene,2.2,0.1,1.4,0xc9a06a,0.5,1.05,0.5);for(const x of[-0.4,1.4])box(scene,0.1,1.05,0.1,0x8a6a4a,x,0.52,0.5);
  const cn=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.3,14),lamb(0xe2553f));cn.position.set(0.5,1.25,0.5);scene.add(cn);const cd=box(scene,0.05,0.3,0.05,0xffffff,0.5,1.55,0.5);
  const fl=glowSprite('rgba(255,200,110,1)',1.2);fl.position.set(0.5,1.78,0.5);scene.add(fl);const pl=new THREE.PointLight(0xffb060,6,6,1.6);pl.position.set(0.5,1.9,0.5);scene.add(pl);
  const w=woong({patch:true});w.position.set(0.5,0,-0.5);sitPose(w);scene.add(w);const m=mannequin();m.position.set(1.9,0,0.5);m.rotation.y=-Math.PI/2;sitPose(m);scene.add(m);
  const d=dog({collar:true});d.position.set(-0.6,0,0.6);d.rotation.y=Math.PI/2;scene.add(d);
  const hat=new THREE.Mesh(new THREE.ConeGeometry(0.15,0.4,10),lamb(0x8fd0ff));hat.position.set(0,0.66,0);w.userData.head.add(hat);
  const c=cam(38);
  return t=>{fl.scale.setScalar(1.1+Math.sin(t*13)*0.1);pl.intensity=6+Math.sin(t*11)*0.8;w.userData.arms.forEach((a,i)=>{a.rotation.x=-1.2;a.rotation.z=(i?-0.5:0.5)+Math.sin(t*3)*0.15*(i?1:-1)});setFace(w,Math.sin(t*5)>0?'open':'flat');
    look(c,[0.5,2.2,4.2],[0.5,1.5,0]);caption(52,t);renderer.render(scene,c)}};
