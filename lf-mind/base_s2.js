function box(scene,w,h,d,col,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lamb(col));m.position.set(x,y,z);scene.add(m);return m}
function interior(scene,o={}){box(scene,30,0.2,20,o.floor??0xe6e2da,0,-0.1,0);box(scene,30,8,0.2,o.wall??0xf2efe8,0,4,-8);box(scene,0.2,8,20,o.wall2??0xe8e4dc,-12,4,0);
  if(o.ceil!==false){const L=new THREE.Mesh(new THREE.BoxGeometry(4,0.1,0.6),basic(0xffffff));L.position.set(0,7.5,-2);scene.add(L)}}
// 11 편의점 싹쓸이
S[11]=()=>{sky('#f2efe8');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.4));interior(scene,{});const r=rng(11);
  const PC=[0xe2553f,0xffd84d,0x3a8fd0,0x8cc96a,0xf28bc0,0xff9a3c,0x9a7ad0];
  for(const z of[-4,-0.5])for(let x=-8;x<=8;x+=4){const sh=new THREE.Group();sh.position.set(x,0,z);scene.add(sh);const fr=new THREE.Mesh(new THREE.BoxGeometry(3.4,2.4,0.8),lamb(0xdedede));fr.position.y=1.2;sh.add(fr);
    for(let j=0;j<3;j++)for(let i=0;i<7;i++){const it=new THREE.Mesh(new THREE.BoxGeometry(0.35,0.5,0.3),lamb(pick(r,PC)));it.position.set(-1.45+i*0.48,0.5+j*0.75,0.45);sh.add(it)}}
  const w=woong();w.position.set(0,0,2.8);scene.add(w);const bk=[];for(let i=0;i<3;i++){const b=new THREE.Group();const bb=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.45,0.55),lamb(0xe2553f));b.add(bb);
    for(let k=0;k<6;k++){const it=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.35,0.2),lamb(pick(r,PC)));it.position.set(-0.3+(k%3)*0.3,0.3,(k<3?-0.1:0.12));b.add(it)}b.position.set(0,0.95+i*0.5,0.55);b.scale.setScalar(0.8);w.add(b);bk.push(b)}
  w.userData.arms.forEach(a=>{a.rotation.x=-1.4});const tag=div('box','계산: 0원');Object.assign(tag.style,{left:'1380px',top:'140px',padding:'14px 34px',fontSize:'52px',color:'#e2553f'});
  const c=cam(40);
  return t=>{setFace(w,'smile');walkPose(w,t*5,0.35);w.userData.arms.forEach(a=>a.rotation.x=-1.4);w.position.x=lerp(-3,2,ease(t/DUR(11)));bk.forEach((b,i)=>{b.rotation.z=Math.sin(t*5+i)*0.05});
    look(c,[w.position.x+5,3.2,8],[w.position.x,1.8,0]);popEl(tag,t,at(11,'j07')+1.5,'');caption(11,t);renderer.render(scene,c)}};
// 12 웨이팅 맛집, 대기 0
S[12]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');const r=rng(12);ground(scene,0xd8d2c6);
  const shop=new THREE.Group();scene.add(shop);const sw=makeBuilding(r,12,9,8,{wall:'#e8ddd0'});sw.position.set(0,4.5,-6);shop.add(sw);
  const sign=planeTex(7,1.4,textTex([['3시간 웨이팅 맛집',70,'#fff']],{w:800,h:160,bg:'#c94f4f',fg:'#fff'}),{basic:1});sign.position.set(0,6.2,-1.95);shop.add(sign);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(3,3.6),basic(0x3a2a20));door.position.set(0,1.8,-1.95);shop.add(door);
  for(let i=0;i<10;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.1,1.1,8),lamb(0xc9a96b));p.position.set(-4+i*1.6,0.55,1.4);scene.add(p)}
  const rope=new THREE.Mesh(new THREE.BoxGeometry(14.4,0.06,0.06),lamb(0xc94f4f));rope.position.set(3.2,0.95,1.4);scene.add(rope);
  const bd=planeTex(1.8,1.2,textTex([['현재 대기',54],['0팀',110,'#e2553f']],{w:360,h:240,bg:'#fff'}));bd.position.set(-3.4,1.3,-1.2);bd.rotation.y=0.2;scene.add(bd);
  const st=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.4,0.1),lamb(0x555555));st.position.set(-3.4,0.5,-1.3);scene.add(st);
  const c=cam(40);
  return t=>{const k=ease(t/DUR(12));look(c,lerp3([10,3,12],[2,2.2,6]),[0,2.2,-1],k);look(c,lerp3([10,3,12],[1,2.2,7],k),[-0.5,2.4,-1]);caption(12,t);renderer.render(scene,c)}};
// 13 백화점 패딩 5벌 셀카
S[13]=()=>{sky('#f6efe6');const scene=new THREE.Scene();lights(scene,'day');scene.add(new THREE.AmbientLight(0xffffff,0.3));interior(scene,{floor:0xf2e9dc,wall:0xfbf6ee});
  const w=woong({shirt:0x2f3440});w.position.set(0,0,0.5);scene.add(w);const cols=[0x2f3440,0xc94f4f,0xffd84d,0x3a8fd0,0xf28bc0];
  cols.forEach((col,i)=>{const s=1+i*0.14;const pb=new THREE.Mesh(new THREE.BoxGeometry(0.56*s,0.68,0.36*s),lamb(col));pb.position.y=0.33;w.userData.hip.add(pb);
    w.userData.arms.forEach(a=>{const am=new THREE.Mesh(new THREE.BoxGeometry(0.16*s,0.5,0.18*s),lamb(col));am.position.y=-0.25;a.add(am)})});
  w.userData.arms.forEach((a,i)=>a.position.x=(i?1:-1)*(0.34+0.28));
  const mir=new THREE.Mesh(new THREE.PlaneGeometry(2.6,4.4),new THREE.MeshLambertMaterial({color:0xcfe6f2}));mir.position.set(-3.4,2.4,-1.2);mir.rotation.y=0.6;scene.add(mir);
  const r=rng(13);for(let i=0;i<5;i++){const rack=new THREE.Group();rack.position.set(3+i*1.4,0,-4+i*0.3);scene.add(rack);const bar=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.05,0.05),lamb(0xc9a96b));bar.position.y=2.2;rack.add(bar);
    for(let k=0;k<4;k++){const cl=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.2,0.6),lamb(pick(r,cols)));cl.position.set(-0.45+k*0.3,1.55,0);rack.add(cl)}}
  const tags=['₩2,890,000','₩1,450,000','₩3,200,000'].map((s,i)=>{const e=div('box',s);Object.assign(e.style,{left:(1250+i*60)+'px',top:(160+i*120)+'px',padding:'10px 26px',fontSize:'40px'});return e});
  const c=cam(40);
  return t=>{setFace(w,t>at(13,'j08')+2?'flat':'smile');w.userData.arms[1].rotation.x=-2.2;w.userData.arms[0].rotation.x=-0.3;w.rotation.y=-0.25+Math.sin(t*1.5)*0.1;
    tags.forEach((e,i)=>{popEl(e,t,0.5+i*0.4,'');if(t>at(13,'j08')+2.2)e.style.textDecoration='line-through'});look(c,[1.2,2.3,6],[0,1.6,0]);caption(13,t);renderer.render(scene,c)}};
// 14 놀이공원 롤러코스터 탑승, 출발 안 함
S[14]=()=>{sky('day');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0xa9c48a);const r=rng(14);
  // 레일
  const N=60;for(let i=0;i<N;i++){const a=i/N*Math.PI*2;const x=Math.cos(a)*14,z=Math.sin(a)*8-6,y=1.5+Math.max(0,Math.sin(a*2))*6;const seg=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.12,0.6),lamb(0xe2553f));seg.position.set(x,y,z);seg.lookAt(Math.cos(a+0.1)*14,1.5+Math.max(0,Math.sin((a+0.1)*2))*6,Math.sin(a+0.1)*8-6);scene.add(seg);
    if(i%3==0){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,y,6),lamb(0xffffff));p.position.set(x,y/2,z);scene.add(p)}}
  const ft=new THREE.Group();ft.position.set(-16,0,-22);scene.add(ft);const rim=new THREE.Mesh(new THREE.TorusGeometry(7,0.25,6,40),lamb(0x3a8fd0));rim.position.y=9;ft.add(rim);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const cab=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),lamb(pick(r,[0xffd84d,0xf28bc0,0x8cc96a,0xe2553f])));cab.position.set(Math.cos(a)*7,9+Math.sin(a)*7,0);ft.add(cab)}
  const st=new THREE.Mesh(new THREE.BoxGeometry(6,0.3,3),lamb(0xd8d2c6));st.position.set(14,1.2,-6);scene.add(st);
  const cart=new THREE.Group();cart.position.set(14,1.6,-6);scene.add(cart);const cb=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.6,2.2),lamb(0xffd84d));cb.position.y=0.3;cart.add(cb);
  const w=woong();w.position.set(0,0.1,0);sitPose(w);w.scale.setScalar(0.9);cart.add(w);w.rotation.y=Math.PI;
  const sg=planeTex(2.6,0.9,textTex([['운행 중지',80,'#fff']],{w:520,h:180,bg:'#c94f4f'}),{basic:1});sg.position.set(11,2.6,-4.2);scene.add(sg);
  const c=cam(40);
  return t=>{const sp=t>at(14,'j09')&&t<at(14,'j09')+2.2;setFace(w,sp?'smile':'flat');w.userData.arms.forEach((a,i)=>{a.rotation.x=sp?-2.9:-0.9;a.rotation.z=sp?(i?0.3:-0.3):0});
    look(c,[17.5,3.4,-1.2],[14,2.2,-6]);caption(14,t);renderer.render(scene,c)}};
// 15 고속도로 한가운데 대자로 누움
S[15]=()=>{sky('clear');const scene=new THREE.Scene();lights(scene,'day');const r=rng(15);ground(scene,0x9cbf7a);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(22,600),lamb(0x55595f));road.rotation.x=-Math.PI/2;scene.add(road);
  for(const x of[-5.5,0,5.5])for(let z=40;z>-300;z-=8){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.25,3),basic(x?0xf2f2f2:0xffd84d));l.rotation.x=-Math.PI/2;l.position.set(x,0.01,z);scene.add(l)}
  const sg=new THREE.Group();sg.position.set(0,0,-40);scene.add(sg);for(const x of[-11,11]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.3,7,0.3),lamb(0x888888));p.position.set(x,3.5,0);sg.add(p)}
  const pl=planeTex(16,2.4,textTex([['서울 ↑  부산 400km',90,'#fff']],{w:1000,h:150,bg:'#1f6a3a'}),{basic:1});pl.position.y=7;sg.add(pl);
  for(let i=0;i<30;i++)tree(scene,(r()<0.5?-1:1)*(14+r()*20),20-r()*200,1+r());
  const w=woong();w.position.set(2.7,0.25,0);w.rotation.x=-Math.PI/2;scene.add(w);w.userData.arms.forEach((a,i)=>a.rotation.z=(i?1.3:-1.3));w.userData.legs.forEach((l,i)=>l.rotation.z=(i?0.3:-0.3));
  const c=cam(40);
  return t=>{setFace(w,'smile');const k=ease(t/DUR(15));look(c,[2.7,2.2+k*40,2+k*6],[2.7,0,-1+k*3]);caption(15,t);renderer.render(scene,c)}};
// 16 밤 PC방 100대
S[16]=()=>{sky('#0b0d1a');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x6070c0,0.3));box(scene,40,0.2,40,0x22243a,0,-0.1,0);
  const r=rng(16);const scr=[];for(let row=0;row<6;row++)for(let i=-8;i<=8;i++){const d=new THREE.Group();d.position.set(i*1.5,0,-row*2.6);scene.add(d);const tb=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.08,0.8),lamb(0x333344));tb.position.y=1;d.add(tb);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.6),new THREE.MeshBasicMaterial({color:pick(r,[0x55a8ff,0x8f6bff,0x4fe0c0])}));m.position.set(0,1.45,-0.25);d.add(m);scr.push(m);
    const ch=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.9,0.6),lamb(0x2a2a3a));ch.position.set(0,0.6,0.7);d.add(ch)}
  const gl=glowSprite('rgba(120,150,255,1)',40);gl.material.opacity=0.25;gl.position.set(0,3,-8);scene.add(gl);
  const w=woong();w.position.set(0,0,-0.05);sitPose(w);w.rotation.y=Math.PI;w.position.z=0.7;scene.add(w);
  const ch=chip('PM 10:30 · 켜진 컴퓨터 100대');const c=cam(40);
  return t=>{scr.forEach((m,i)=>m.visible=i<Math.min(102,Math.floor(t*30)));const k=ease(t/DUR(16));look(c,[0,3+k*5,5+k*6],[0,1.4,-4]);popEl(ch,t,0.4);caption(16,t);renderer.render(scene,c)}};
// 17 매칭 대기 ∞
S[17]=()=>{sky('#0b0d1a');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x6070c0,0.4));
  const w=woong();w.position.set(0,0,1.6);sitPose(w);w.rotation.y=Math.PI;scene.add(w);
  const ui2=div('box',`<div style="font-size:44px;color:#9fb3ff;margin-bottom:24px">랭크 게임</div><div style="font-size:90px;color:#fff">매칭 중<span class="dt">…</span></div><div style="font-size:48px;color:#aab;margin-top:30px">예상 대기 시간</div><div style="font-size:150px;color:#ffd84d;line-height:1">∞</div><div style="font-size:40px;color:#ff8a8a;margin-top:20px">현재 접속자: 1명</div>`);
  Object.assign(ui2.style,{left:'460px',top:'90px',width:'1000px',height:'640px',background:'#151a33',border:'14px solid #2a2a35',textAlign:'center',paddingTop:'40px',boxSizing:'border-box'});
  const c=cam(40);
  return t=>{ui2.querySelector('.dt').textContent='.'.repeat(1+Math.floor(t*2)%3);look(c,[0,2.6,5.5],[0,2.2,0]);setFace(w,'flat');caption(17,t);renderer.render(scene,c)}};
S[18]=dcard(18,3,'셋째 날');
// 19 발전소 제어실, 경고등
S[19]=()=>{sky('#1a1d26');const scene=new THREE.Scene();lights(scene,'night');scene.add(new THREE.AmbientLight(0x8090c0,0.5));interior(scene,{floor:0x3a3f4a,wall:0x4a5060,wall2:0x444a58});
  const r=rng(19);const L=[];for(let i=-3;i<=3;i++){const cs=new THREE.Group();cs.position.set(i*2.6,0,-3+Math.abs(i)*0.5);cs.rotation.y=-i*0.12;scene.add(cs);
    const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.2,1),lamb(0x5a6070));b.position.y=0.6;cs.add(b);const top=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.1,1.2),lamb(0x6a7080));top.position.set(0,1.25,0.1);top.rotation.x=0.3;cs.add(top);
    for(let k=0;k<6;k++){const l=new THREE.Mesh(new THREE.CircleGeometry(0.07,8),basic(0xff3b3b));l.position.set(-0.9+k*0.36,1.33,0.32);l.rotation.x=-1.27;cs.add(l);L.push(l)}
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.9),basic(0x1a2a3a));m.position.set(0,2.1,-0.3);cs.add(m);
    const ch=new THREE.Mesh(new THREE.BoxGeometry(0.7,1,0.7),lamb(0x2a2f3a));ch.position.set(0.3,0.5,1.4);ch.rotation.y=r()-0.5;cs.add(ch)}
  const big=planeTex(10,3.2,textTex([['⚠ 경고',90,'#ff4d4d'],['연료 공급 부족 · 응답 없음',60,'#ffd84d']],{w:1000,h:320,bg:'#10141f'}),{basic:1});big.position.set(0,5.4,-7.85);scene.add(big);
  const flash=glowSprite('rgba(255,60,60,1)',30);flash.position.set(0,6,-6);scene.add(flash);
  const c=cam(42);
  return t=>{const b=Math.sin(t*6)>0;L.forEach((l,i)=>l.material.color.set((b^(i%2))?0xff3b3b:0x401010));flash.material.opacity=b?0.35:0.08;look(c,[0,3.5,9-t*0.25],[0,2.5,-4]);caption(19,t);renderer.render(scene,c)}};
// 20 원자력 발전소 자동 정지
S[20]=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');ground(scene,0xb0b8a8);const r=rng(20);
  const T=[];for(const x of[-8,0]){const tw=new THREE.Mesh(new THREE.CylinderGeometry(3.2,4.5,11,24,1,true),new THREE.MeshLambertMaterial({color:0xd8d8d8,side:THREE.DoubleSide}));tw.position.set(x,5.5,-6);scene.add(tw);T.push(tw)}
  const dome=new THREE.Mesh(new THREE.SphereGeometry(3,24,16,0,Math.PI*2,0,Math.PI/2),smooth(0xe6e6e6));dome.position.set(9,3,-3);scene.add(dome);box(scene,6,3,6,0xd0d0d0,9,1.5,-3);
  const steam=[];for(let i=0;i<24;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(1.2+r(),8,6),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.8}));s.userData={x:pick(r,[-8,0])+(r()-0.5)*2,ph:r()};scene.add(s);steam.push(s)}
  const pn=div('box',`<div style="font-size:36px;color:#666">원자로 상태</div><div class="v" style="font-size:72px;color:#2a9d5a">정상 운전</div>`);Object.assign(pn.style,{left:'1340px',top:'120px',padding:'20px 46px',textAlign:'center'});
  const c=cam(40);const TS=at(20,'n09')+1.6;
  return t=>{const off=t>TS;pn.querySelector('.v').textContent=off?'자동 정지 ✔':'정상 운전';pn.querySelector('.v').style.color=off?'#e2553f':'#2a9d5a';
    steam.forEach(s=>{const lt=(t*0.25+s.userData.ph)%1;const fade=off?clamp01(1-(t-TS)/2.5):1;s.position.set(s.userData.x+lt*3,11+lt*7,-6);s.material.opacity=0.8*(1-lt)*fade;s.scale.setScalar(0.6+lt*1.4)});
    look(c,[4,6,22-t*0.3],[0,5,-4]);caption(20,t);renderer.render(scene,c)}};
// 21 밤 도시 불이 구역별로 꺼짐
S[21]=()=>{sky('night');const scene=new THREE.Scene();lights(scene,'night');ground(scene,0x1a1d2e);const r=rng(21);stars(scene,300,r,{size:0.4});
  const B=[];for(let i=0;i<160;i++){const x=(r()-0.5)*160,z=-20-r()*90,h=6+r()*30,w=3+r()*5;
    const lit=makeBuilding(r,w,h,w,{lit:0.55,win:'#1c2240',wall:'#3a3f5a'});const dark=makeBuilding(r,w,h,w,{lit:0,win:'#141830',wall:'#2a2e44'});
    lit.position.set(x,h/2,z);dark.position.set(x,h/2,z);scene.add(lit,dark);B.push({lit,dark,k:(x+80)/160})}
  const c=cam(40);const T0=at(21,'n10')+0.6,T1=DUR(21)-1.2;
  return t=>{const p=(t-T0)/(T1-T0);B.forEach(b=>{const off=p>b.k+(b.k*7%0.15);b.lit.visible=!off;b.dark.visible=off});
    bgEl.style.background=p>1?SKY.deep:SKY.night;look(c,[0,30,40],[0,10,-50]);caption(21,t);renderer.render(scene,c)}};
// 22 냉장고 '띵' 꺼짐
S[22]=()=>{sky('#0d0f1a');const scene=new THREE.Scene();const hl=new THREE.HemisphereLight(0x8090c0,0x101018,0.9);scene.add(hl);const R=room(scene,{winSky:['#0a0f2a','#1a2048'],winCity:'#0e1224'});
  const fl=new THREE.PointLight(0xdfe8ff,6,6,1.5);fl.position.set(5,1.2,0.6);scene.add(fl);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.8,0.08),lamb(0xdfe6ec));door.geometry.translate(0.6,0,0);door.position.set(4.4,0.9,-0.38);door.rotation.y=-1.6;scene.add(door);
  const w=woong();w.position.set(4.2,0,1.6);w.rotation.y=Math.PI*0.85;scene.add(w);const ic=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.35,8),lamb(0xd9a46a));ic.rotation.x=Math.PI;ic.position.set(0,-0.75,0.05);w.userData.arms[1].add(ic);
  const sc=new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),smooth(0xf7c6d8));sc.position.y=-0.55;w.userData.arms[1].add(sc);
  const c=cam(40);const TO=at(22,'j12')-0.3;
  return t=>{const off=t>TO;fl.intensity=off?0:6;R.fled.material.color.set(off?0x222222:0x55ff88);hl.intensity=off?0.5:0.9;w.userData.arms[1].rotation.x=-1.3;setFace(w,off?'open':'flat');
    if(off){const k=clamp01((t-TO)/0.6);w.userData.head.rotation.x=-0.2*k}look(c,[7.2,2.4,2.6],[4.3,1.5,0.6]);caption(22,t);renderer.render(scene,c)}};
// 23 수도꼭지 물 끊김
S[23]=()=>{sky('#e6e9ee');const scene=new THREE.Scene();lights(scene,'day');box(scene,10,0.2,6,0xd8dde4,0,-0.1,0);box(scene,10,6,0.2,0xeef1f4,0,3,-2);
  const sink=new THREE.Mesh(new THREE.BoxGeometry(3,0.8,1.8),lamb(0xffffff));sink.position.set(0,1.6,-0.6);scene.add(sink);const basin=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.1,1.3),lamb(0xb8c4d0));basin.position.set(0,2.0,-0.6);scene.add(basin);
  const fa=new THREE.Group();fa.position.set(0,2.0,-1.35);scene.add(fa);const p=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.9,10),lamb(0xc0c6cc));p.position.y=0.45;fa.add(p);
  const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.6,10),lamb(0xc0c6cc));sp.rotation.x=Math.PI/2;sp.position.set(0,0.9,0.3);fa.add(sp);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.85,8),new THREE.MeshLambertMaterial({color:0x8fd0ff,transparent:true,opacity:0.8}));water.position.set(0,2.5,-0.8);scene.add(water);
  const drops=[0,1,2].map(()=>{const d=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),lamb(0x8fd0ff));scene.add(d);return d});
  const w=woong();w.visible=false;
  const c=cam(36);const TS=at(23,'n11')+0.8;
  return t=>{const k=clamp01((t-TS)/1.2);water.scale.y=Math.max(0.001,1-k);water.position.y=2.5+0.42*k;water.visible=k<0.98;
    drops.forEach((d,i)=>{const lt=((t-TS-1.2)*0.6+i/3)%1;d.visible=t>TS+1.2&&t<TS+5;d.position.set(0,2.85-lt*0.8,-1.0)});
    w.userData.arms[1].rotation.x=-1.2;setFace(w,t>TS+1.5?'open':'flat');look(c,[-2.6,3.4,3.2],[0,2.3,-0.8]);caption(23,t);renderer.render(scene,c)}};
// 24 서비스 없음
S[24]=()=>{sky('#11131c');const scene=new THREE.Scene();const ph=div('box',`<div style="display:flex;justify-content:space-between;padding:22px 34px;font-size:30px;color:#999"><span>서비스 없음</span><span class="wf">📶</span></div><div style="text-align:center;margin-top:150px"><div style="font-size:150px;color:#ccc">✕</div><div style="font-size:52px;margin-top:20px">인터넷 연결 없음</div><div style="font-size:32px;color:#999;margin-top:20px;font-weight:500">네트워크를 확인하세요</div></div><div class="bt" style="position:absolute;left:0;right:0;bottom:60px;text-align:center;font-size:40px;color:#e2553f">다시 시도</div>`);
  Object.assign(ph.style,{left:'690px',top:'60px',width:'540px',height:'900px',borderRadius:'50px',border:'18px solid #2b2b33',background:'#f6f6f8',boxSizing:'border-box'});ph.querySelector('.wf').textContent='Wi-Fi ✕';
  const thumb=div('',null);Object.assign(thumb.style,{position:'absolute',width:'90px',height:'90px',borderRadius:'50%',background:'rgba(255,220,180,.85)',left:'920px',top:'880px'});
  return t=>{renderer.clear();const tap=Math.floor((t-0.8)/0.9);const k=((t-0.8)%0.9)/0.9;thumb.style.transform=`translateY(${t>0.8&&k<0.3?-12:0}px)`;thumb.style.opacity=t>0.8?1:0;
    ph.querySelector('.bt').style.opacity=k<0.15&&t>0.8?0.4:1;caption(24,t)}};
// 25 스피커 불빛 꺼짐
S[25]=()=>{sky('#0d0f1a');const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0x7080b0,0x101018,0.8));const R=room(scene,{winSky:['#0a0f2a','#1a2048'],winCity:'#0e1224',screenOff:1});
  const gl=glowSprite('rgba(85,216,255,1)',2.2);gl.position.set(4.6,2.1,-3.8);scene.add(gl);
  const w=woong();w.position.set(3.4,0,-1.8);w.rotation.y=Math.PI*0.85;scene.add(w);
  const c=cam(36);const TO=endOf(25,'s02')-0.2;
  return t=>{const on=t<TO?(Math.sin(t*14)>-0.3):false;R.ring.material.color.set(on?0x55d8ff:0x1a2228);gl.visible=on;
    const reach=ease((t-at(25,'j14'))/0.4);w.userData.arms[1].rotation.x=-1.5*reach;setFace(w,t>at(25,'j14')?'open':'flat');look(c,[6.2,2.8,0.6],[4.2,1.9,-3.6]);caption(25,t);renderer.render(scene,c)}};
// 26 깜깜한 서울 하늘에 은하수
S[26]=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'dark');ground(scene,0x0c0e18);const r=rng(26);
  for(let i=0;i<120;i++){const x=(r()-0.5)*220,z=-30-r()*60,h=5+r()*28,w=3+r()*5;const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),lamb(0x111426));b.position.set(x,h/2,z);scene.add(b)}
  const mw=milky(scene,r);stars(scene,1200,r,{w:400,h:200,y0:10,z:-170,size:0.5});
  const c=cam(50);
  return t=>{const k=ease(t/DUR(26));mw.material.opacity=clamp01(t/3);look(c,[0,4,30],[0,10+k*40,-60]);caption(26,t);renderer.render(scene,c)}};
// 27 옥상에 누워 별 보기
S[27]=()=>{sky('deep');const scene=new THREE.Scene();lights(scene,'dark');scene.add(new THREE.AmbientLight(0x8090c0,0.9));const r=rng(27);
  box(scene,14,0.4,14,0x3a3f52,0,-0.2,0);for(const [x,z,w,d] of [[0,-7,14,0.2],[-7,0,0.2,14],[7,0,0.2,14]]){box(scene,w,1,d,0x4a5066,x,0.5,z)}
  const mw=milky(scene,r);stars(scene,900,r,{w:400,h:200,y0:0,z:-170,size:0.5});
  const w=woong();w.position.set(0,0.25,1.5);w.rotation.x=-Math.PI/2;scene.add(w);w.userData.arms.forEach((a,i)=>{a.rotation.x=-2.8;a.rotation.z=(i?-0.6:0.6)});
  const ss=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.15,6),basic(0xffffff));scene.add(ss);
  const c=cam(45);
  return t=>{setFace(w,t>at(27,'j15')+2.5?'flat':'smile');const k=ease(t/DUR(27));const k2=ease((t-DUR(27)*0.45)/(DUR(27)*0.5));look(c,lerp3([1.4,1.3,3.4],[0.5,3,5.5],k2),lerp3([0,0.4,1.2],[0,14,-30],k2));
    const st=(t-3)%5;ss.visible=st>0&&st<0.8;ss.position.set(-30+st*60,40-st*10,-120);ss.rotation.y=1.2;caption(27,t);renderer.render(scene,c)}};
// 28 태양광 가로등 혼자 켜짐
S[28]=()=>{sky('dusk');const scene=new THREE.Scene();lights(scene,'dusk');const r=rng(28);city(scene,r,{night:true,lit:0});
  const lamps=[];for(let i=0;i<6;i++){const g=new THREE.Group();g.position.set(-6.4,0,6-i*10);scene.add(g);const p=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,5,8),lamb(0x6a6f7a));p.position.y=2.5;g.add(p);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.1,0.1),lamb(0x6a6f7a));arm.position.set(0.6,4.9,0);g.add(arm);const panel=new THREE.Mesh(new THREE.BoxGeometry(1,0.06,0.7),lamb(0x2a3a6a));panel.position.set(0,5.2,0);panel.rotation.z=0.3;g.add(panel);
    const bulb=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.12,0.3),basic(0x444444));bulb.position.set(1.1,4.82,0);g.add(bulb);
    const glow=glowSprite('rgba(255,230,160,1)',3.5);glow.position.set(1.1,4.7,0);g.add(glow);
    const pool=new THREE.Mesh(new THREE.CircleGeometry(2.4,24),new THREE.MeshBasicMaterial({color:0xffe6a0,transparent:true,opacity:0.35}));pool.rotation.x=-Math.PI/2;pool.position.set(1.1,0.03,0);g.add(pool);lamps.push({bulb,glow,pool})}
  const c=cam(40);
  return t=>{const k=clamp01((t-1)/4);bgEl.style.background=t<2.5?SKY.dusk:SKY.night;lamps.forEach((l,i)=>{const on=t>1.5+i*0.35;l.bulb.material.color.set(on?0xfff2c4:0x444444);l.glow.visible=on;l.pool.visible=on});
    look(c,[2,3.5,14-t*0.6],[-5,2.5,-14]);caption(28,t);renderer.render(scene,c)}};
// 29 지하철역 침수
S[29]=()=>{sky('gray');const scene=new THREE.Scene();lights(scene,'day');for(const [x,z,w,d] of [[-52,0,100,200],[52,0,100,200],[0,51,4,100],[0,-58,4,100]])box(scene,w,0.2,d,0xc9c4ba,x,-0.1,z);
  const pit=new THREE.Group();scene.add(pit);for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(4,0.3,0.6),lamb(0xbdb6aa));s.position.set(0,-i*0.3,-i*0.6);pit.add(s)}
  for(const x of[-2.1,2.1]){const wl=new THREE.Mesh(new THREE.BoxGeometry(0.3,4,8),lamb(0x8a8f99));wl.position.set(x,-1.2,-3.4);pit.add(wl);const rail=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,6),lamb(0xd0d0d0));rail.position.set(x,1.1,-2.5);rail.rotation.x=0.45;pit.add(rail)}
  const roof=new THREE.Mesh(new THREE.BoxGeometry(5,0.2,3),new THREE.MeshLambertMaterial({color:0x9fd0ff,transparent:true,opacity:0.6}));roof.position.set(0,3,0.6);scene.add(roof);
  const sg=planeTex(3,0.8,textTex([['🚇 2호선 역',60,'#fff']],{w:480,h:128,bg:'#2fa84f'}),{basic:1});sg.position.set(0,3.6,1.6);scene.add(sg);sg.material.map=textTex([['지하철 2호선',60,'#fff']],{w:480,h:128,bg:'#2fa84f'});
  const water=new THREE.Mesh(new THREE.PlaneGeometry(3.9,7),new THREE.MeshLambertMaterial({color:0x4f7fa0,transparent:true,opacity:0.92}));water.rotation.x=-Math.PI/2;water.position.set(0,-3,-4);scene.add(water);
  const c=cam(40);
  return t=>{const k=ease(t/DUR(29));water.position.y=lerp(-2.6,-0.5,k);water.material.color.setHSL(0.56,0.35,0.42+Math.sin(t*3)*0.02);look(c,[3,4,5.5],[0,-1.2,-3.5]);caption(29,t);renderer.render(scene,c)}};
