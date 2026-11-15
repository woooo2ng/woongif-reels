// ---------- #012 ENTP 공용 ----------
const S=[];
function holdObj(p,side,obj,y=-0.62,z=0.12){obj.position.set(0,y,z);p.userData.arms[side].add(obj);return obj}
function phoneMesh(){return new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a))}
function signPlane(text,w,h,o={}){const t=canvasTex(Math.round(w*400),Math.round(h*400),(x,cw,ch)=>{x.fillStyle=o.bg||'#fff';rr(x,0,0,cw,ch,o.r??30);x.fill();x.strokeStyle=o.line||'rgba(0,0,0,.15)';x.lineWidth=10;x.stroke();
  x.fillStyle=o.fg||'#333';x.font=`900 ${o.fs||Math.round(ch*0.42)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,cw/2,ch/2+4)});
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide}))}
function room(scene,o={}){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(o.floor||0xd8b48a));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(30,9,0.2),lamb(o.wall||0xfbe9d6));wall.position.set(0,4.5,o.wz??-2);scene.add(wall);return wall}
// 캔버스를 매 프레임 다시 그리는 평면
function liveCanvas(w,h,pw,ph){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),new THREE.MeshBasicMaterial({map:t}));m.userData={c,ctx:c.getContext('2d'),t};return m}
function brows(p){const h=p.userData.head;const g=new THREE.Group();for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.025,0.02),lamb(0x1a1a1a));b.position.set(s*0.095,0.33,0.235);b.rotation.z=s*0.45;g.add(b)}g.visible=false;h.add(g);p.userData.brow=g;return g}
function bub(p,text,o={}){const b=makeBubble(text,{bg:o.bg||TB.bg,fg:o.fg||TB.fg,fs:o.fs||70,size:o.size||0.0024});b.position.set(o.x||0,o.y??2.08,o.z||0);p.add(b);scaleBubble(b,0);return b}
function showB(b,t,t0,t1=1e9){const k=t<t1?pop((t-t0)/0.25):1-clamp01((t-t1)/0.15);scaleBubble(b,t>=t0?k:0)}
function guitar(){const g=new THREE.Group();const m=lamb(0xd9904a);
  const b1=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.09,14),m);b1.rotation.x=Math.PI/2;g.add(b1);
  const b2=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.09,14),m);b2.rotation.x=Math.PI/2;b2.position.y=0.24;g.add(b2);
  const hole=new THREE.Mesh(new THREE.CircleGeometry(0.06,12),basic(0x3a2412));hole.position.set(0,0.12,0.047);g.add(hole);
  const nk=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,0.04),lamb(0x6b4a2f));nk.position.y=0.6;g.add(nk);
  const hd=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.12,0.05),lamb(0x3a2a1a));hd.position.y=0.9;g.add(hd);return g}
function popcorn(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.08,0.22,10),lamb(0xe8484a));g.add(c);
  const s=new THREE.Mesh(new THREE.CylinderGeometry(0.112,0.082,0.06,10),lamb(0xffffff));s.position.y=0.04;g.add(s);
  const top=new THREE.Mesh(new THREE.SphereGeometry(0.11,8,6),lamb(0xfff1b8));top.scale.y=0.6;top.position.y=0.12;g.add(top);return g}
function fishBread(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),lamb(0xc98a3c));b.scale.set(1.5,0.9,0.45);g.add(b);
  const tl=new THREE.Mesh(new THREE.ConeGeometry(0.09,0.14,4),lamb(0xc98a3c));tl.rotation.z=Math.PI/2;tl.position.x=-0.24;g.add(tl);return g}
function cup(col=0xffffff){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.07,0.22,12),lamb(col));c.position.y=0.11;g.add(c);
  const l=new THREE.Mesh(new THREE.CylinderGeometry(0.095,0.095,0.03,12),lamb(0x7a4a2a));l.position.y=0.23;g.add(l);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.18,6),lamb(0xff6a8a));st.position.set(0.03,0.32,0);st.rotation.z=-0.2;g.add(st);return g}
function steam(scene,x,y,z,n=3){const a=[];for(let i=0;i<n;i++){const s=glowSprite('rgba(255,255,255,1)',0.35);scene.add(s);a.push({s,x:x+(i-1)*0.08,y,z,ph:i/n})}return a}
function updSteam(a,t,k){a.forEach(q=>{const lt=(t*0.7+q.ph)%1;q.s.position.set(q.x+Math.sin(lt*6)*0.03,q.y+lt*0.6,q.z);q.s.material.opacity=Math.sin(lt*Math.PI)*0.8*k;q.s.visible=k>0.02})}
function floorSit(p){const u=p.userData;p.position.y=-0.42;u.hip.position.y=0.8;u.legs.forEach(l=>l.rotation.x=-Math.PI/2);u.arms.forEach(a=>a.rotation.x=-0.9)}
function seatChair(scene,x,z,ry,col=0x8a6a4a){const g=new THREE.Group();const s=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.1,0.55),lamb(col));s.position.y=0.5;g.add(s);
  const b=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.7,0.1),lamb(col));b.position.set(0,0.85,-0.25);g.add(b);
  for(const a of[-0.25,0.25])for(const c of[-0.22,0.22]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,0.06),lamb(0x5a4a3a));l.position.set(a,0.25,c);g.add(l)}
  g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);return g}

// ---------- S0 영화관 2배속 (타이틀) ----------
function drawFilm(x,w,h,ph,speed,credits,k){
  if(credits){x.fillStyle='#0b0b12';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.textAlign='center';x.font=`900 ${h*0.14}px ${FONT}`;
    const lines=['THE END','','감독  ○○○','주연  ○○○ · ○○○','음악  ○○○','촬영  ○○○','','관람해 주셔서 감사합니다'];
    lines.forEach((l,i)=>{const y=h*0.95+i*h*0.16-k*h*1.4;x.font=`900 ${i==0?h*0.16:h*0.085}px ${FONT}`;x.fillText(l,w/2,y)});return}
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#8fc6ff');g.addColorStop(1,'#d9efff');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#7cc47a';x.fillRect(0,h*0.72,w,h*0.28);
  x.fillStyle='#fff6c9';x.beginPath();x.arc(w*0.82,h*0.22,h*0.1,0,7);x.fill();
  for(let i=0;i<2;i++){const px=((ph*0.25*speed+i*0.35)%1.2-0.1)*w;const by=h*0.72-Math.abs(Math.sin(ph*speed*3+i))*h*0.05;
    x.fillStyle=i?'#e46a6a':'#5a7fd0';x.fillRect(px-w*0.03,by-h*0.26,w*0.06,h*0.18);x.fillStyle='#f3cfae';x.beginPath();x.arc(px,by-h*0.32,h*0.06,0,7);x.fill()}
  if(speed>1){x.fillStyle='rgba(0,0,0,.5)';rr(x,w*0.36,h*0.05,w*0.28,h*0.2,24);x.fill();x.fillStyle='#ffc04d';x.font=`900 ${h*0.13}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(`▶▶ ${speed}x`,w*0.5,h*0.155)}
}
S[0]=()=>{
  bgEl.style.background='linear-gradient(#17142a,#2a2242 60%,#3a2c52)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sky:0xcfd8ff,ground:0x4a3a5a,dir:1.1,dpos:[0,8,-10]});
  const r=rng(1201);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0x4a2e44));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const scr=liveCanvas(800,400,7.2,3.6);scr.position.set(0,3.3,-7);scene.add(scr);
  const scrGlow=glowSprite('rgba(170,200,255,1)',14);scrGlow.position.set(0,3.4,-7.4);scene.add(scrGlow);
  const ppl=[];
  for(let row=0;row<3;row++){const y=row*0.45,z=row*1.5;
    const step=new THREE.Mesh(new THREE.BoxGeometry(10,y+0.02,1.5),lamb(0x55344e));step.position.set(0,(y+0.02)/2,z);scene.add(step);
    for(let i=0;i<5;i++){const x=-2.4+i*1.2;
      const seat=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.45,0.7),lamb(0xb8334a));seat.position.set(x,y+0.22,z+0.05);scene.add(seat);
      const back=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.9,0.15),lamb(0xa02a40));back.position.set(x,y+0.75,z+0.45);scene.add(back);
      const p=makePerson(r);p.position.set(x,y,z+0.05);p.rotation.y=Math.PI;scene.add(p);sitPose(p);
      const pc=(i+row)%2==0;if(pc)holdObj(p,0,popcorn(),-0.6,0.1);else holdObj(p,1,phoneMesh(),-0.62,0.12);
      ppl.push({p,row,i,ph:r()*6,pc});}}
  const front=ppl.find(q=>q.row==2&&q.i==2);
  const b1=bub(front.p,'…2배속 안 되나?',{size:0.0036});
  const others=[ppl.find(q=>q.row==1&&q.i==1),ppl.find(q=>q.row==1&&q.i==3)].map(q=>({q,b:bub(q.p,'하암…',{size:0.0032})}));
  // 영사기(컷B)
  const proj=new THREE.Group();proj.position.set(0,5.2,8);proj.visible=false;
  const pb=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.0,1.4),lamb(0x5a5f70));proj.add(pb);
  const lens=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,0.4,16),lamb(0x2a2a33));lens.rotation.x=Math.PI/2;lens.position.set(0,0,-0.85);proj.add(lens);
  for(const s of[-1,1]){const rl=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.12,18),lamb(0x3a3d4a));rl.rotation.z=Math.PI/2;rl.position.set(0,0.75,s*0.45);proj.add(rl);rl.userData.s=s}
  const beam=new THREE.Mesh(new THREE.ConeGeometry(1.6,8,20,1,true),new THREE.MeshBasicMaterial({color:0xfff2c0,transparent:true,opacity:0.12,depthWrite:false,side:THREE.DoubleSide}));
  beam.rotation.x=-Math.PI/2;beam.position.set(0,0,-4.9);proj.add(beam);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML='<div class="tag">#012</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:#ffc04d">ENTP라면?</div><div class="btn2x" style="opacity:0">1x</div>';
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),btn=ui.querySelector('.btn2x');
  const ch=chip('러닝타임 2시간');ch.style.opacity=0;
  return t=>{
    const c1=capAt(0,1),c2=capAt(0,2),c3=capAt(0,3),c4=capAt(0,4);
    const cutB=t>=c3&&t<c4-0.1,cutC=t>=c4-0.1;
    // 스크린
    const sp=t<c3+(c4-c3)*0.3?1:(t<c3+(c4-c3)*0.62?2:4);const credits=cutC&&t>c4+0.7;
    const sc=scr.userData;drawFilm(sc.ctx,800,400,t,sp,credits,clamp01((t-c4-0.7)/2.2));sc.t.needsUpdate=true;
    for(const q of ppl){
      if(cutC&&t>c4+0.9){const k=clamp01((t-c4-0.9)/0.3);standPose(q.p);q.p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*10+q.ph))*0.05;
        armUp(q.p,0,k);armUp(q.p,1,k);q.p.userData.arms[0].rotation.z=-0.5+Math.sin(t*16+q.ph)*0.35;q.p.userData.arms[1].rotation.z=0.5-Math.sin(t*16+q.ph)*0.35;}
      else{sitPose(q.p);const jig=t>c1?1:0;q.p.userData.legs[0].rotation.x=-Math.PI/2+Math.sin(t*28+q.ph)*0.12*jig;q.p.userData.legs[1].rotation.x=-Math.PI/2-Math.sin(t*28+q.ph)*0.12*jig;
        q.p.userData.head.rotation.y=jig*Math.sin(t*2+q.ph)*0.25;
        if(!q.pc)q.p.userData.arms[1].rotation.x=-0.9-jig*0.6;}
    }
    showB(b1,t,c2,c3);others.forEach((o,j)=>showB(o.b,t,c1+0.3+j*0.35,c3));
    // 컷
    if(!cutB&&!cutC){cam.position.set(0,2.7,-5.4);cam.lookAt(0,3.05,1.6)}
    else{const u=t-c3;cam.position.set(0,3.6,8.2-u*0.2);cam.lookAt(0,2.7,-7)}
    proj.children.forEach(o=>{if(o.userData.s)o.rotation.x=t*sp*3});
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    const tf=1-clamp01((t-c2+0.2)/0.2);
    tag.style.opacity=tf;t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t1.style.opacity=clamp01((t-0.1)/0.1)*tf;
    t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t2.style.opacity=clamp01((t-0.35)/0.1)*tf;
    // 2x 버튼
    if(cutB){const m=(c4-c3);const sw=[c3,c3+m*0.3,c3+m*0.62];const k=t<sw[1]?0:(t<sw[2]?1:2);btn.textContent=['1x','2x','4x'][k];
      btn.style.opacity=1;btn.style.transform=`scale(${pop((t-sw[k])/0.25)})`}else btn.style.opacity=0;
    if(cutC){ch.textContent=t>c4+0.8?'러닝타임 2시간 → 2분':'러닝타임 2시간';chipPop(ch,t,c4)}else ch.style.opacity=0;
    caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- S1 공부법만 3시간 → D-1 천재 ----------
S[1]=()=>{
  bgEl.style.background='linear-gradient(#f3ead8,#f8f1e4)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,dir:1.4});const r=rng(1301);
  room(scene,{wall:0xe6dcff,floor:0xc79f78,wz:-1.2});
  const desk=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.08,1),lamb(0xf2e2c4));desk.position.set(0,0.8,-0.6);scene.add(desk);
  for(const x of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.8,0.9),lamb(0xd8c6a4));l.position.set(x,0.4,-0.6);scene.add(l)}
  const lap=new THREE.Group();lap.position.set(0.15,0.84,-0.75);scene.add(lap);
  const lb=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.03,0.48),lamb(0xbfc6d4));lb.position.z=0.05;lap.add(lb);
  const ls=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.46,0.03),lamb(0xbfc6d4));ls.position.set(0,0.23,-0.2);lap.add(ls);
  const books=[];const BC=[0xe46a6a,0x6a9ae4,0x7ac47a,0xe4c06a,0xb08ae4];
  for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.08,0.36),lamb(BC[i]));scene.add(b);books.push({b,x0:-0.9+r()*0.4,z0:-0.3-r()*0.5,ry:r()*2,i})}
  const clockF=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,0.05,24),lamb(0xffffff));clockF.rotation.x=Math.PI/2;clockF.position.set(-1.3,2.6,-1.08);scene.add(clockF);
  const hand=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.28,0.02),lamb(0x222222));hand.geometry.translate(0,0.13,0);hand.position.set(-1.3,2.6,-1.04);scene.add(hand);
  seatChair(scene,0,0.25,0,0x9a7ab8);
  const P=makePerson(r,{shirt:0xffb84d});P.position.set(0,0,0.25);P.rotation.y=Math.PI;scene.add(P);sitPose(P);
  // 밤(D-1): 4명 일렬, 카메라를 향해
  const night=new THREE.Group();night.position.set(0,0,30);scene.add(night);
  const nwall=new THREE.Mesh(new THREE.BoxGeometry(14,7,0.2),lamb(0x2c3358));nwall.position.set(0,3.5,-2);night.add(nwall);
  const nfl=new THREE.Mesh(new THREE.PlaneGeometry(14,8),lamb(0x3a3550));nfl.rotation.x=-Math.PI/2;nfl.position.y=0.01;night.add(nfl);
  for(let i=0;i<5;i++){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.9,1.1),basic(0x1a2040));w.position.set(-4+i*2,4.4,-1.88);night.add(w);
    const st=glowSprite('rgba(255,250,200,1)',0.25);st.position.set(-4+i*2+0.2,4.6,-1.85);night.add(st)}
  const crew=[];
  for(let i=0;i<3;i++){const x=-1.3+i*1.3;
    const d=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.08,0.7),lamb(0xe9d9b8));d.position.set(x,0.78,0.6);night.add(d);
    const lamp=glowSprite('rgba(255,220,140,1)',1.3);lamp.position.set(x+0.5,1.4,0.5);night.add(lamp);
    const bk=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.04,0.42),lamb(0xffffff));bk.position.set(x,0.84,0.7);night.add(bk);
    const p=makePerson(r);p.position.set(x,0,0);night.add(p);sitPose(p);
    const eyes=[];for(const s of[-1,1]){const g=glowSprite('rgba(255,120,30,1)',0.32);g.position.set(s*0.09,0.25,0.27);p.userData.head.add(g);eyes.push(g)}
    const pen=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.2,0.03),lamb(0x333333));holdObj(p,1,pen,-0.66,0.1);
    crew.push({p,eyes,ph:r()*6})}
  const gb=bub(crew[1].p,'천재 모드 ON',{size:0.0024});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('D-7 · 시험 기간');
  const card=document.createElement('div');card.className='card';card.style.opacity=0;card.innerHTML='<div class="k">지금 보는 중</div><div class="v"></div>';ui.appendChild(card);const cv=card.querySelector('.v');
  const ACTS=['▶ 공부 잘하는 법 TOP 10','✎ 플래너 꾸미기','♪ 집중력 높이는 음악 3시간'];
  return t=>{
    const c1=capAt(1,1),c2=capAt(1,2),c3=capAt(1,3);
    // 책상 정리
    books.forEach(q=>{const k=ease((t-0.2-q.i*0.12)/0.5);q.b.position.set(q.x0*(1-k)+(-0.75)*k,0.88+q.i*0.085*k,q.z0*(1-k)+(-0.75)*k);q.b.rotation.y=q.ry*(1-k)});
    hand.rotation.z=-t*(t>c1?9:1);
    if(t<c2){const a=t>c1?Math.min(2,Math.floor((t-c1)/((c2-c1)/3))):-1;
      if(a>=0){cv.textContent=ACTS[a];card.style.opacity=1;card.style.transform=`scale(${pop((t-(c1+a*(c2-c1)/3))/0.25)})`}else card.style.opacity=0;
      P.userData.arms[1].rotation.x=-0.9+(a==1?Math.sin(t*20)*0.15:0);P.userData.head.rotation.x=a>=0?0.15:0;
      ch.textContent=t>c1+(c2-c1)*0.5?'공부법 연구 3시간 · 공부 0분':'D-7 · 시험 기간';
      cam.position.set(2.6,2.9,3.4);cam.lookAt(0,1.5,-0.6);
    }else{card.style.opacity=0;ch.textContent='D-1 PM 11:00';
      crew.forEach(q=>{q.p.userData.arms[1].rotation.x=-1.0+Math.sin(t*40+q.ph)*0.2;q.p.userData.arms[0].rotation.x=-0.9;q.p.userData.head.rotation.x=0.12;
        q.eyes.forEach(e=>{const s=0.28+Math.sin(t*20+q.ph)*0.06;e.scale.set(s,s,1)})});
      cam.position.set(0,2.5,5.6-(t-c2)*0.15+30);cam.lookAt(0,1.85,30);}
    showB(gb,t,c3+0.2);
    if(t<c2)chipPop(ch,t,ch.textContent.startsWith('공부')?c1+(c2-c1)*0.5:0);else chipPop(ch,t,c2);
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- S2 취미 풀세트 → 중고 → 기타 한 바퀴 ----------
S[2]=()=>{
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,dir:1.4});const r=rng(1401);
  // A: 거실
  const A=new THREE.Group();scene.add(A);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(16,16),lamb(0xd9b98f));fl.rotation.x=-Math.PI/2;A.add(fl);
  const wl=new THREE.Mesh(new THREE.BoxGeometry(16,6,0.2),lamb(0xd7ecf5));wl.position.set(0,3,-2.2);A.add(wl);
  const P=makePerson(r,{shirt:0xffb84d});P.position.set(0,0,0);scene.add(P);A.add(P);
  const boxes=[];const items=[guitar(),(()=>{const g=new THREE.Group();for(const s of[-1,1]){const sh=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.14,0.4),lamb(0x4ab0e0));sh.position.x=s*0.13;g.add(sh)}return g})(),
    (()=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.4),lamb(0xf2f2f2));b.position.y=0.22;g.add(b);const w=new THREE.Mesh(new THREE.PlaneGeometry(0.2,0.12),basic(0x334455));w.position.set(0,0.3,0.21);g.add(w);return g})()];
  const BP=[[-1.3,0.6],[1.3,0.6],[-0.9,-1],[1.0,-1.1],[0,-1.4]];
  BP.forEach(([x,z],i)=>{const b=new THREE.Group();b.position.set(x,0,z);A.add(b);
    const bx=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.6,0.7),lamb(0xc9955a));bx.position.y=0.3;b.add(bx);
    const lid=new THREE.Mesh(new THREE.BoxGeometry(0.92,0.06,0.72),lamb(0xb5834c));lid.position.y=0.63;b.add(lid);
    const tape=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.065,0.73),lamb(0xe8d9a8));tape.position.y=0.635;b.add(tape);
    let it=null;if(i<3){it=items[i];it.position.y=0.3;it.scale.setScalar(0.01);b.add(it)}
    boxes.push({b,lid,tape,it,i})});
  const pb=bub(P,'이번엔 진짜다!',{size:0.0026});
  // C: 동네 탑뷰
  const C=new THREE.Group();C.position.set(60,0,0);scene.add(C);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0x9fcf8a));gr.rotation.x=-Math.PI/2;C.add(gr);
  for(const v of[-2.1,2.1]){const rd=new THREE.Mesh(new THREE.PlaneGeometry(30,0.9),lamb(0xbfb6a8));rd.rotation.x=-Math.PI/2;rd.position.set(0,0.01,v*0.72);C.add(rd);
    const rd2=new THREE.Mesh(new THREE.PlaneGeometry(0.9,30),lamb(0xbfb6a8));rd2.rotation.x=-Math.PI/2;rd2.position.set(v*0.43,0.01,0);C.add(rd2)}
  const HP=[[-1.8,0],[-1.8,-3],[0,-3],[1.8,-3],[1.8,0],[1.8,3],[0,3],[-1.8,3]];
  const ROOF=[0xe46a6a,0x6a9ae4,0xe4c06a,0x8ac47a,0xb08ae4,0xe48ac0,0x6ac4c0,0xffb84d];
  const houses=HP.map(([x,z],i)=>{const h=makeHouse(r,{w:1.4,h:1.1,wall:0xf3ead8,roof:ROOF[i]});h.position.set(x,0,z);C.add(h);
    const tg=labelSprite('1회 사용',{bg:'#ffe9b0',fg:'#a05a00',fs:60,size:0.0062});tg.position.set(x,2.6,z);C.add(tg);scaleBubble(tg,0);return {h,tg}});
  const me=makePerson(r,{shirt:0xffb84d});me.position.set(-1.8,0,1.15);C.add(me);
  const meB=bub(me,'…어?',{size:0.006,fs:80});
  const G=guitar();G.scale.setScalar(1.6);C.add(G);
  const dashes=[];const route=[...HP,HP[0]].map(([x,z])=>new THREE.Vector3(x,0.05,z+1.0));
  for(let s=0;s<route.length-1;s++){const a=route[s],b=route[s+1];for(let k=0;k<6;k++){const d=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.03,0.12),basic(0xffffff));d.position.lerpVectors(a,b,(k+0.5)/6);d.lookAt(b.x,0.05,b.z);d.rotateY(Math.PI/2);C.add(d);d.visible=false;dashes.push({d,s,k})}}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('택배 도착 · 새 취미 풀세트');
  const ph=document.createElement('div');ph.className='phone';ph.style.top='330px';ph.style.opacity=0;
  const LIST=[['통기타','1회 사용','#d9904a'],['클라이밍화','1회 사용','#4ab0e0'],['제빵기','미개봉','#cfcfcf'],['요가매트','1회 사용','#b08ae4'],['드론','1회 사용','#6a7a8a'],['캠핑 의자','1회 사용','#7ac47a'],['수채화 세트','미개봉','#e48ac0'],['전동 킥보드','1회 사용','#e4c06a'],['우쿨렐레','1회 사용','#c98a3c'],['복싱 글러브','1회 사용','#e46a6a']];
  ph.innerHTML=`<div class="screen" style="background:#fff"><div class="sbar"><span>9:41</span><span>●●●</span></div><div class="head">중고마켓 · 우리 동네</div><div class="mk"><div class="lst">${LIST.concat(LIST).map(([a,b,c])=>`<div class="it"><div class="th" style="background:${c}"></div><div><div class="tt">${a}</div><div class="tg">${b}</div><div class="pr">${(Math.round(3+a.length*1.7)*1000).toLocaleString()}원</div></div></div>`).join('')}</div></div></div>`;
  ui.appendChild(ph);const lst=ph.querySelector('.lst');
  return t=>{
    const c1=capAt(2,1),c2=capAt(2,2),c3=capAt(2,3),T=vEnd(2)+0.45;
    if(t<c1){A.visible=true;
      boxes.forEach(q=>{const k=clamp01((t-0.3-q.i*0.22)/0.25);q.lid.position.set(0,0.63+k*1.2,0);q.lid.rotation.x=k*2.2;q.tape.visible=k<0.05;q.lid.visible=k<0.98;
        if(q.it){const s=pop((t-0.45-q.i*0.22)/0.3);q.it.scale.setScalar(Math.max(0.01,s));q.it.position.y=0.3+s*0.75;q.it.rotation.y=t*1.5}});
      const k=clamp01((t-1.1)/0.3);armUp(P,0,k);armUp(P,1,k);P.userData.hip.position.y=0.8+Math.abs(Math.sin(t*8))*0.08*k;
      showB(pb,t,0.9);cam.position.set(0,3.6,5.6);cam.lookAt(0,1.2,-0.3);ch.textContent='택배 도착 · 새 취미 풀세트';chipPop(ch,t,0);ph.style.opacity=0;
    }else if(t<c2){ph.style.opacity=1;ph.style.transform=`scale(${0.9+0.1*pop((t-c1)/0.3)})`;
      const k=ease((t-c1-0.3)/(c2-c1-0.4));lst.style.transform=`translateY(${-k*1850}px)`;
      ch.textContent='3일 후';ch.style.top='170px';chipPop(ch,t,c1);cam.position.set(0,3.6,5.6);cam.lookAt(0,1.2,-0.3);
    }else{ph.style.opacity=0;A.visible=false;ch.style.top='230px';
      const u=clamp01((t-c2-0.2)/(T-0.9-c2-0.2));const segs=route.length-1;const f=u*segs;const s=Math.min(segs-1,Math.floor(f)),lk=f-s;
      const a=route[s],b=route[s+1];G.position.lerpVectors(a,b,ease(lk));G.position.y=0.6+Math.abs(Math.sin(lk*Math.PI))*0.9;G.rotation.y=t*2;G.rotation.z=0.3;
      dashes.forEach(q=>{q.d.visible=q.s<s||(q.s==s&&(q.k+0.5)/6<=lk)});
      houses.forEach((h,i)=>{const arr=(i)/segs;scaleBubble(h.tg,i>0&&u>arr+0.01?pop((u-arr)*segs/0.35):0)});
      showB(meB,t,T-0.85);me.rotation.y=Math.PI*0.05;
      cam.position.set(60,17,7.2);cam.lookAt(60,0,0.85);
      ch.textContent=u>0.5?'시작한 취미 47개 · 계속하는 취미 0개':'우리 동네 중고 지도';chipPop(ch,t,u>0.5?c2+(T-0.9-c2)*0.5:c2);
    }
    caption(2,t);renderer.render(scene,cam);
  };
};

// ---------- S3 회식 고깃집 토론 '고양이가 사람만 하면?' ----------
function wbub(scene,text,x,y,z,o={}){const b=makeBubble(text,{bg:o.bg||TB.bg,fg:o.fg||TB.fg,fs:o.fs||64,size:o.size||0.0019});b.position.set(x,y,z);scene.add(b);scaleBubble(b,0);return b}
S[3]=()=>{
  bgEl.style.background='linear-gradient(#f3dcc0,#f9ebd8)';
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffffff,0x8a7060,1.6);scene.add(hemi);const dl=new THREE.DirectionalLight(0xfff0dd,1.3);dl.position.set(4,10,8);scene.add(dl);
  const r=rng(1555);
  const wall=room(scene,{wall:0xe9cfa8,floor:0x9a7a5a,wz:-2.4});
  const menu=signPlane('삼겹살 13,000 · 목살 14,000',2.6,0.5,{bg:'#3a2a20',fg:'#ffe0a0',r:10});menu.position.set(0,2.55,-2.28);menu.scale.setScalar(0.7);scene.add(menu);
  const lan=[];for(const x of[-1.8,1.8]){const l=new THREE.Mesh(new THREE.SphereGeometry(0.22,12,10),lamb(0xe8484a));l.scale.y=1.3;l.position.set(x,3.0,-1.6);scene.add(l);const g=glowSprite('rgba(255,180,120,1)',1.2);g.position.copy(l.position);scene.add(g);lan.push(g)}
  // 테이블+불판
  const tb=new THREE.Mesh(new THREE.CylinderGeometry(0.85,0.85,0.08,24),lamb(0x5a4a3e));tb.position.y=0.75;scene.add(tb);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.25,0.75,10),lamb(0x3a302a));leg.position.y=0.37;scene.add(leg);
  const grill=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.05,24),lamb(0x2a2a2e));grill.position.y=0.82;scene.add(grill);
  for(let i=-3;i<=3;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.8-Math.abs(i)*0.08,0.012,0.02),lamb(0x777780));b.position.set(0,0.85,i*0.11);scene.add(b)}
  const meat=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.03,0.1),new THREE.MeshLambertMaterial({color:0xf0a0a0}));m.position.set(-0.17+(i%2)*0.34,0.87,-0.22+Math.floor(i/2)*0.22);m.rotation.y=(r()-0.5)*0.5;scene.add(m);meat.push(m)}
  const smoke=[];for(let i=0;i<6;i++){const s=glowSprite('rgba(90,90,100,1)',0.9);s.material.blending=THREE.NormalBlending;scene.add(s);smoke.push({s,ph:i/6,x:(r()-0.5)*0.5})}
  const cups=[[-0.5,0.4],[0.5,0.4],[0,0.6]].map(([x,z])=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.04,0.14,10),lamb(0x8fd18a));c.position.set(x,0.86,z);scene.add(c);return c});
  // 사람들(회사원 4명)
  const XS=[-1.05,-0.35,0.35,1.05];
  const ppl=XS.map((x,i)=>{const z=-0.85+Math.abs(x)*0.35;const st=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.5,10),lamb(0xc0392b));st.position.set(x,0.25,z-0.05);scene.add(st);
    const p=makePerson(r,{shirt:[0xffffff,0xdfe8f5,0xf5f0e0,0xe8f0e8][i],pants:0x33384a});p.position.set(x,0,z);p.rotation.y=-x*0.35;scene.add(p);sitPose(p);
    const tie=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.32,0.02),lamb([0x3a5aa0,0xc0392b,0x2a7a4a,0x8a4ab0][i]));tie.position.set(0,0.4,0.17);p.userData.hip.add(tie);return p});
  // 사장님(앞치마)
  const boss=makePerson(r,{shirt:0xf2f2f2,pants:0x3d3a36});boss.position.set(2.6,0,0.1);boss.rotation.y=-Math.PI/2;scene.add(boss);
  const apron=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.62,0.02),lamb(0x3a6a9a));apron.position.set(0,0.15,0.17);boss.userData.hip.add(apron);
  const band=new THREE.Mesh(new THREE.TorusGeometry(0.255,0.03,8,24),smooth(0xffffff));band.rotation.x=Math.PI/2;band.position.y=0.36;boss.userData.head.add(band);
  const q0=wbub(scene,'근데 고양이가 사람만 하면 사람이 이김?',-0.05,2.05,-0.4,{size:0.0019,fs:62});
  const PH=[['고양이 점프력 생각해 봐',-0.4,2.05],['사람은 도구 쓰잖아',0.4,2.4],['그럼 귀여움도 커지는데?',-0.35,2.4],['반칙이지 그건!',0.45,2.05],['자료 찾아볼게',-0.5,2.05],['발톱 길이부터 재 보자',0.35,2.4]];
  const dB=PH.map(([s,x,y])=>wbub(scene,s,x,y,-0.3,{size:0.0022,fs:62}));
  const bB=wbub(scene,'고양이가 이기죠. 발톱이 있잖아요',0.15,2.4,0.6,{size:0.002,fs:62,bg:'#ffffff',fg:'#333'});
  const nB=wbub(scene,'오… 사장님 논리 미쳤다',-0.4,2.05,-0.4,{size:0.0022,fs:62});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('회식 PM 7:00 · 건배!');
  return t=>{
    const c1=capAt(3,1),c2=capAt(3,2),T=vEnd(3)+0.45;
    const tq=0.9,tArgue=Math.min(c1-0.1,tq+1.1),tBoss=c2,tSit=c2+0.9,tB=tSit+0.15,tN=tB+1.0;
    // 건배
    ppl.forEach((p,i)=>{const a=p.userData.arms;
      if(t<tq){const k=pop((t-0.15)/0.3);a[1].rotation.x=-0.9-1.5*k;a[1].rotation.z=0}
      else if(t<tArgue){a[1].rotation.x=-0.9;p.userData.head.rotation.y=(i<2?0.4:-0.4)}
      else if(t<tB){a[1].rotation.x=-1.4+Math.sin(t*9+i)*0.5;a[0].rotation.x=-0.7+Math.cos(t*7+i)*0.3;p.userData.hip.position.y=0.56+Math.abs(Math.sin(t*6+i))*0.04;p.userData.head.rotation.y=Math.sin(t*3+i)*0.4}
      else{a[1].rotation.x=-0.9;a[0].rotation.x=-0.9;p.userData.hip.position.y=0.56;p.userData.head.rotation.y=(p.position.x-boss.position.x)*-0.25}});
    showB(q0,t,tq,tArgue+0.2);
    const step=0.42,dur=0.8;dB.forEach((b,i)=>{let s=-1;const lt=t-tArgue-0.15;if(lt>0&&t<tBoss-0.1){const k=Math.floor(lt/step);for(let j=k;j>=k-1;j--){if(j>=0&&j%PH.length==i&&lt-j*step<dur)s=lt-j*step}}
      scaleBubble(b,s>=0?pop(s/0.18)*(1-clamp01((s-dur+0.12)/0.12)):0)});
    // 고기 타기 + 연기
    const burn=clamp01((t-tArgue)/(tBoss-tArgue+0.6));const col=new THREE.Color(0xf0a0a0).lerp(new THREE.Color(0x8a5a3a),clamp01(burn*1.6)).lerp(new THREE.Color(0x1a1a1a),clamp01(burn*1.6-0.6));
    meat.forEach(m=>m.material.color.copy(col));
    smoke.forEach(q=>{const lt=(t*0.6+q.ph)%1;q.s.position.set(q.x+Math.sin(lt*5)*0.1,0.95+lt*0.55,0.15);q.s.material.opacity=Math.sin(lt*Math.PI)*0.35*clamp01(burn*1.4);q.s.visible=burn>0.05});
    // 불 꺼짐(마감) + 사장님 입장
    const dim=clamp01((t-tBoss)/0.3);hemi.intensity=1.6-dim*0.75;dl.intensity=1.3-dim*0.8;bgEl.style.filter=`brightness(${1-dim*0.45})`;lan.forEach(g=>g.material.opacity=1);
    const wk=clamp01((t-tBoss-0.05)/0.75);boss.position.set(2.4-wk*1.35,0,0.1+wk*0.5);boss.rotation.y=-Math.PI/2+wk*0.75;standPose(boss);if(wk>0&&wk<1)walkPose(boss,t*9,0.5);
    if(t>tSit){boss.userData.arms[1].rotation.x=-1.3+Math.sin(t*6)*0.2}
    showB(bB,t,tB,T);showB(nB,t,tN,T);
    ch.textContent=t>tBoss?'PM 11:00 · 영업 종료 · 주제 쓸모 0%':(t>tArgue?`토론 ${Math.min(3,1+Math.floor((t-tArgue)*0.9))}시간째 · 고기 타는 중`:'회식 PM 7:00 · 건배!');
    chipPop(ch,t,t>tBoss?tBoss:(t>tArgue?tArgue:0));
    cam.position.set(0.1,3.3,5.3);cam.lookAt(0.1,1.35,-0.3);
    caption(3,t);renderer.render(scene,cam);
  };
};


// ---------- S4 단톡 단수 공지 → 드립 300개 → 아무도 못 봄 ----------
function foam(p){const g=new THREE.Group();const m=smooth(0xffffff);const pts=[[0,0.48,0,0.16],[0.12,0.44,0.06,0.11],[-0.13,0.43,0.04,0.12],[0.05,0.46,-0.12,0.12],[-0.06,0.56,0.02,0.1],[0.1,0.53,-0.04,0.08]];
  for(const[x,y,z,r] of pts){const s=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),m);s.position.set(x,y,z);g.add(s)}
  for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,8),new THREE.MeshLambertMaterial({color:0xcfefff,transparent:true,opacity:0.8}));b.position.set(-0.15+i*0.15,0.62,0.1);g.add(b);b.userData.ph=i}
  p.userData.head.add(g);return g}
S[4]=()=>{
  bgEl.style.background='linear-gradient(#dfe9f5,#f2f6fb)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.7,dir:1.2});const r=rng(1651);
  // 엘리베이터 안
  const metal=lamb(0xc9ced6),dark=lamb(0x9aa2ae);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.05,2.6),lamb(0x8a8f99));fl.position.y=-0.02;scene.add(fl);
  const bw=new THREE.Mesh(new THREE.BoxGeometry(3.2,3.4,0.1),metal);bw.position.set(0,1.7,-1.3);scene.add(bw);
  for(const s of[-1,1]){const sw=new THREE.Mesh(new THREE.BoxGeometry(0.1,3.4,2.6),dark);sw.position.set(s*1.6,1.7,0);scene.add(sw);
    const rail=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.06,2.2),lamb(0xe8e8ee));rail.position.set(s*1.52,1.0,0);scene.add(rail)}
  const mirror=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.6),new THREE.MeshLambertMaterial({color:0xdde8f2}));mirror.position.set(0,1.9,-1.24);scene.add(mirror);
  const ind=signPlane('▲ 7F',0.9,0.32,{bg:'#1d2230',fg:'#ffb84d',r:12});ind.position.set(0,3.15,-1.22);scene.add(ind);
  const ceil=glowSprite('rgba(255,250,235,1)',1.6);ceil.position.set(0,3.5,-1.0);scene.add(ceil);
  // 문(카메라 쪽에서 열림)
  const doors=[-1,1].map(s=>{const d=new THREE.Mesh(new THREE.BoxGeometry(1.6,3.4,0.08),lamb(0xb0b7c2));d.position.set(s*0.8,1.7,1.35);scene.add(d);d.userData.s=s;return d});
  const ppl=[[-0.75,-0.55,0.15],[0.05,-0.75,0],[0.8,-0.5,-0.15],[-0.35,0.2,0.1],[0.55,0.25,-0.1]].map(([x,z,ry],i)=>{const p=makePerson(r);p.position.set(x,0,z);p.rotation.y=ry;scene.add(p);const f=foam(p);
    const tw=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.08,0.12),lamb([0xffd0e0,0xd0f0ff,0xfff0b0,0xd8f5d0,0xe8d8ff][i]));tw.position.set(0,0.66,0.05);p.userData.hip.add(tw);return {p,f}});
  const q1=wbub(scene,'…단수였어요?',-0.35,2.2,0.5,{size:0.0024});
  const q2=wbub(scene,'공지 있었어요?',0.35,2.55,0.3,{size:0.0024});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('우리아파트 단톡방');
  // DOM 단톡
  const AV=['#ffb84d','#7fb7c9','#d98c8c','#8cc9a0','#a58cd0','#e0c070','#e39a6b','#90b86c'];
  const DR=[['702호','물 없으면 사이다로 씻나요?'],['1103호','이참에 단체 사우나 가죠'],['508호','단수 기념 물풍선 금지인가요'],['303호','생수 공구 받습니다 ㅋㅋ'],['907호','머리는 모레 감는 걸로'],['1201호','단수 = 단 수요일?'],['401호','관리소장님 MBTI 뭐예요?'],['605호','오늘 밤 미리 씻기 대회 ㄱ'],['812호','물 대신 드립으로 씻어요'],['204호','ㅋㅋㅋㅋㅋㅋㅋㅋ']];
  const ph=document.createElement('div');ph.className='phone';ph.style.top='290px';ph.style.height='900px';
  ph.innerHTML=`<div class="screen"><div class="sbar"><span>PM 8:10</span><span>●●●</span></div><div class="head">우리아파트 입주민 (300)</div><div class="msgs">
   <div class="row nt"><div style="width:100%;background:#fff;border-radius:28px;padding:20px 26px;box-sizing:border-box;border:4px solid #ffb84d"><div style="font-size:30px;font-weight:900;color:#e07a00">[관리사무소] 공지</div><div style="font-size:42px;font-weight:900;color:#222;margin-top:6px">내일 오전 9시~12시 단수입니다</div></div></div>
   ${DR.map(([w,m],i)=>`<div class="row dr" style="display:none"><div class="av" style="background:${AV[i%8]}"></div><div><div class="who">${w}</div><div class="b">${m}</div></div></div>`).join('')}
  </div></div>`;
  ui.appendChild(ph);const rows=[...ph.querySelectorAll('.dr')];
  return t=>{
    const c1=capAt(4,1),T=vEnd(4)+0.45;const tCut=c1+0.75;
    if(t<tCut){ph.style.display='block';ph.style.transform=`scale(${0.92+0.08*pop(t/0.3)})`;
      const t0=0.8,step=(c1+0.5-t0)/DR.length;const n=t<t0?0:Math.min(DR.length,1+Math.floor((t-t0)/step));
      rows.forEach((el,i)=>{el.style.display=i<n?'flex':'none';if(i==n-1){el.style.transform=`scale(${pop((t-t0-i*step)/0.15)})`;el.style.transformOrigin='left bottom'}});
      const cnt=t<t0?0:Math.min(300,Math.round(((t-t0)/(c1+0.6-t0))**1.6*300));
      ch.textContent=t<t0?'우리아파트 단톡방':`공지 1개 · 드립 ${cnt}개`;chipPop(ch,t,t<t0?0:t0);ch.style.top='150px';
      cam.position.set(0,1.7,6);cam.lookAt(0,1.7,0);caption(4,t);renderer.clear();return;
    }else{ph.style.display='none';ch.style.top='230px';
      const k=ease((t-tCut)/0.4);doors.forEach(d=>d.position.x=d.userData.s*(0.8+k*1.6));
      ppl.forEach((q,i)=>{standPose(q.p);q.f.children.forEach(b=>{if(b.userData.ph!==undefined)b.position.y=0.62+((t*0.8+b.userData.ph*0.33)%1)*0.25});q.p.userData.head.rotation.z=Math.sin(t*1.5+i)*0.06});
      showB(q1,t,tCut+0.45);showB(q2,t,tCut+0.95);
      ch.textContent='다음 날 AM 9:10 · 단수 중';chipPop(ch,t,tCut+0.2);
      cam.position.set(0,1.85,4.9);cam.lookAt(0,1.6,-0.4);
    }
    caption(4,t);renderer.render(scene,cam);
  };
};


// ---------- S5 장난 → 진지 → 내 사람 지키기 ----------
S[5]=()=>{
  bgEl.style.background='linear-gradient(#fff4dc,#fffaf0)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,dir:1.3});const r=rng(1701);
  room(scene,{wall:0xf6efe0,floor:0xd8d2c6,wz:-2.6});
  for(const x of[-3.6,-1.9,1.6]){const sh=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.8,0.6),lamb(0xe8e0d0));sh.position.set(x,0.9,-2.0);scene.add(sh);
    for(let j=0;j<3;j++)for(let k=0;k<4;k++){const it=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.28,0.2),lamb(pick(r,[0xe46a6a,0x6a9ae4,0x7ac47a,0xe4c06a,0xb08ae4])));it.position.set(x-0.48+k*0.32,0.5+j*0.55,-1.7);scene.add(it)}}
  const ctr=new THREE.Mesh(new THREE.BoxGeometry(0.6,1.0,1.8),lamb(0x9ab8d0));ctr.position.set(0.75,0.5,-0.2);scene.add(ctr);
  const ctop=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.06,1.9),lamb(0xf2f2f2));ctop.position.set(0.75,1.03,-0.2);scene.add(ctop);
  const reg=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.4),lamb(0x444a55));reg.position.set(0.8,1.21,-0.75);scene.add(reg);
  const owner=makePerson(r,{shirt:0x8ac47a});owner.position.set(1.2,0,-0.15);owner.rotation.y=-Math.PI/2+0.6;scene.add(owner);
  const apron=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.02),lamb(0xffffff));apron.position.set(0,0.2,0.17);owner.userData.hip.add(apron);
  const vic=makePerson(r,{shirt:0x7f9ac9});scene.add(vic);
  const FR=[0,1,2].map(i=>{const p=makePerson(r,{shirt:[0xffb84d,0xe39a6b,0xa58cd0][i]});scene.add(p);brows(p);return p});
  FR.forEach(p=>p.userData.brow.children.forEach(b=>{b.scale.set(1.3,1.6,1)}));
  const basket=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.22,0.32),lamb(0xe8484a));basket.position.set(0,0.52,0);FR[0].userData.head.add(basket);
  const gB=[wbub(scene,'이거 써 봐 ㅋㅋ',-2.7,2.3,-0.4),wbub(scene,'ㅋㅋㅋㅋㅋ',-1.3,2.15,-0.4)];
  const oB=wbub(scene,'계산 안 하고 가시게요?',0.45,2.35,-0.1,{bg:'#ffffff',fg:'#333',size:0.0022});
  const vB=wbub(scene,'저 진짜 했는데…',-0.2,1.95,0.1,{bg:'#e3ecff',fg:'#2a3a6a',size:0.0022});
  const PR=[['영수증 여기 있어요',-0.45,2.6],['결제 3시 12분이에요',-0.4,2.28],['CCTV 같이 보실까요?',-0.35,1.96]];
  const pB=PR.map(([s,x,y])=>wbub(scene,s,x,y,0.3,{bg:'#ffffff',fg:'#222',size:0.0021}));
  const sorry=wbub(scene,'저희 실수네요, 죄송합니다',0.2,2.6,-0.1,{bg:'#ffffff',fg:'#333',size:0.0022});
  const fun=wbub(scene,'서비스 맛있다 ㅋㅋ',-0.6,2.15,0.4,{size:0.0021});
  const cups=[0,1,2].map(i=>{const c=cup([0xffd0e0,0xd0f0ff,0xfff0b0][i]);c.position.set(0.68,1.06,-0.5+i*0.3);scene.add(c);c.scale.setScalar(0.01);return c});
  const hearts=sprinkleHearts(scene,6,r,{x:-0.15,z:0.1,w:0.6,col:'#ff8fb3',size:0.005});
  const rcp=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.34),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('평소 진지한 순간 0초');
  return t=>{
    const c1=capAt(5,1),c2=capAt(5,2),c3=capAt(5,3),T=vEnd(5)+0.45;
    const tIn=c1+(c2-c1)*0.4;const tP=c2-0.1;const tS=c3+0.3;const tF=Math.min(T-0.9,tS+1.1);
    if(t<c1){
      FR.forEach((p,i)=>{p.position.set(-2.7+i*0.75,0,-0.4);p.rotation.y=[0.35,0,-0.35][i];standPose(p);p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*9+i))*0.1;p.userData.brow.visible=false});
      armUp(FR[0],0,1);FR[0].userData.arms[0].rotation.z=-0.3;armUp(FR[2],1,0.6+Math.sin(t*10)*0.3);FR[2].userData.head.rotation.z=Math.sin(t*12)*0.25;
      basket.visible=true;vic.visible=false;
      gB.forEach((b,i)=>showB(b,t,0.2+i*0.35,c1));
      cam.position.set(-2.0,2.7,4.0);cam.lookAt(-2.0,1.55,-0.6);ch.textContent='평소 진지한 순간 0초';chipPop(ch,t,0);
    }else{gB.forEach(b=>scaleBubble(b,0));basket.visible=false;vic.visible=true;FR[2].userData.head.rotation.z=0;
      vic.position.set(0.05,0,0.0);vic.rotation.y=Math.PI/2-0.7;standPose(vic);vic.userData.head.rotation.x=t<tS?0.2:0;
      showB(oB,t,c1+0.05,tP);showB(vB,t,c1+0.75,tP);
      const END=[[-0.7,0.7],[-1.0,-0.2],[-1.3,0.65]];
      FR.forEach((p,i)=>{const k=ease((t-tIn-i*0.15)/0.6);const [ex,ez]=END[i];p.position.set(ex-1.6*(1-k),0,ez);p.rotation.y=Math.PI/2-0.75;
        standPose(p);if(k<1&&k>0)walkPose(p,t*9,0.5);p.userData.brow.visible=t>tIn&&t<tF;});
      FR.forEach((p,i)=>showB(pB[i],t,tP+i*0.45,tS));
      if(t>tP&&t<tS){FR[0].userData.arms[1].rotation.x=-1.4;if(!rcp.parent)holdObj(FR[0],1,rcp,-0.68,0.12)}
      showB(sorry,t,tS,T);cups.forEach((c,i)=>c.scale.setScalar(Math.max(0.01,pop((t-tS-0.3-i*0.12)/0.3))));
      owner.userData.head.rotation.x=t>tS?0.3:0;
      if(t>tF){FR.forEach((p,i)=>{p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*9+i))*0.08});armUp(FR[1],1,1);FR[1].userData.arms[1].rotation.z=0.4}
      showB(fun,t,tF);updHearts(hearts,t,tF,1.75,0.45);
      cam.position.set(-0.05,2.9,5.8);cam.lookAt(-0.05,1.6,-0.3);
      ch.textContent=t>tF?'평소 장난 100% · 내 사람 지키기 100%':(t>tIn?'진지 모드 ON':'계산대 앞 억울한 상황');chipPop(ch,t,t>tF?tF:(t>tIn?tIn:c1));
    }
    caption(5,t);renderer.render(scene,cam);
  };
};


// ---------- S6 질문 ----------
S[6]=()=>{
  bgEl.style.background='linear-gradient(#1b2350,#3a3a78 60%,#6a5a98)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.2,sky:0xb8c4ff,ground:0x3a3050,dir:0.9});const r=rng(1801);
  stars(scene,140,r);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(0.9,16,12),basic(0xfff0c0));moon.position.set(3.6,5.0,-20);scene.add(moon);
  const mg=glowSprite('rgba(255,240,190,1)',6);mg.position.copy(moon.position);scene.add(mg);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0x3a3f5e));gr.rotation.x=-Math.PI/2;scene.add(gr);
  for(let i=0;i<9;i++){const h=makeHouse(r,{h:1.8+r()*1.4});h.position.set(-9+i*2.4+(r()-0.5)*0.4,0,-7-(i%2)*2.4);h.rotation.y=(r()-0.5)*0.3;scene.add(h)}
  for(const x of[-3,3]){const lp=new THREE.Mesh(new THREE.BoxGeometry(0.08,2.6,0.08),lamb(0x333344));lp.position.set(x,1.3,-3);scene.add(lp);const lg=glowSprite('rgba(255,220,150,1)',1.6);lg.position.set(x,2.7,-3);scene.add(lg)}
  const ppl=[0,1,2].map(i=>{const p=makePerson(r,{shirt:[0xffb84d,0xe39a6b,0xa58cd0][i]});p.position.set(-1.1+i*1.1,0,0);p.rotation.y=(1-i)*0.2;scene.add(p);return p});
  const g=guitar();g.rotation.z=0.5;holdObj(ppl[0],0,g,-0.75,0.15);
  holdObj(ppl[1],0,popcorn(),-0.66,0.1);
  const bag=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.3,0.12),lamb(0xf2e2c0));holdObj(ppl[2],0,bag,-0.75,0.1);const fb=fishBread();fb.scale.setScalar(0.6);fb.position.set(0,0.2,0);bag.add(fb);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out">여러분 주변의<br><span style="color:${C_T}">ENTP</span>는<br>어떤가요?</div><div class="end2 out" style="top:830px">댓글에 ENTP 친구를 태그해 주세요!</div><div class="end3">다음 MBTI는? 신청소에서 골라 주세요</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2'),e3=ui.querySelector('.end3');
  return t=>{
    const c2=LEAD+CAPT[6][1];
    ppl.forEach((p,i)=>{armUp(p,1,1);p.userData.arms[1].rotation.z=2.5+Math.sin(t*8+i)*0.35*(i%2?-1:1);p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*6+i))*0.06});
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    e2.style.transform=`scale(${pop((t-c2)/0.3)})`;e2.style.opacity=clamp01((t-c2)/0.1);
    const t3=vEnd(6)-0.4;e3.style.transform=`translateX(-50%) scale(${pop((t-t3)/0.3)})`;e3.style.opacity=clamp01((t-t3)/0.1);
    cam.position.set(0,1.6,6.4-t*0.15);cam.lookAt(0,2.4,0);
    renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';bgEl.style.filter='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
