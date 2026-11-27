// ===== 장면 =====
const ISTPB={bg:'#ffe3e3',fg:'#a3262c',fs:70};
function bubI(p,o={}){return bub(p,'ISTP',{...ISTPB,y:o.y??2.15,size:o.size||0.0024})}
function bubT(p,text,o={}){return bub(p,text,{bg:o.bg||'#ffffff',fg:o.fg||'#2b2b3a',fs:o.fs||66,y:o.y??2.2,x:o.x||0,size:o.size||0.0024})}
function talkBeard(S0,t,on){S0.userData.beard.position.y=-0.03-(on?Math.abs(Math.sin(t*18))*0.018:0)}
function nightSky(){sky('#16204a','#33468a','#8aa2d8')}
function seatInSleigh(sa,sl){sl.add(sa);sa.position.set(0,0.32,-0.15);sitPose(sa);sa.userData.legs.forEach(l=>l.rotation.x=-1.35);sa.userData.arms.forEach(a=>{a.rotation.x=-1.1})}

// ===== S0 타이틀: 북극 작업장 출정 → 이륙 → 마을 위를 지나감 → 산타 클로즈업 =====
S[0]=()=>{
  nightSky();
  const scene=nightScene();const r=rng(2001);snowGround(scene);
  scene.fog=new THREE.Fog(0x8aa2d8,30,90);
  const ws=workshop();ws.position.set(0,0,-6.5);scene.add(ws);
  [[-6,-6],[6.2,-5],[-7.5,-1],[7.6,0.5],[-5.2,3.5],[5.4,4]].forEach(([x,z],i)=>{const tr=xmasTree(1.0+((i*7)%3)*0.15,{snow:true,lights:i<2,seed:i+3});tr.position.set(x,0,z);scene.add(tr)});
  const SN=snowfall(scene,500,r,{w:26,h:14,z:0,d:24});
  const stars=starField(scene,260,r,{w:140,h:50,y0:10,z:-50});
  const sl=makeSleigh();scene.add(sl);const sa=makeSanta();seatInSleigh(sa,sl);
  const deer=[];[[-0.5,2.4],[0.5,2.4],[-0.5,4.0],[0.5,4.0]].forEach(([x,z])=>{const d=makeDeer();d.position.set(x,0,z);d.scale.setScalar(0.85);sl.add(d);deer.push(d)});
  const reins=[];for(const s of[-1,1]){const rn=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,3.4,4),lamb(0x6a3a22));rn.rotation.x=Math.PI/2-0.12;rn.position.set(s*0.3,1.2,2.0);sl.add(rn);reins.push(rn)}
  const elves=[];const ELC=[[0x4caf6a,0xd94848,0x3f9e5c],[0xd94848,0x4caf6a,0xd94848],[0x4caf6a,0xf2f2f2,0x3f9e5c]];
  [[-2.4,-2.2],[-2.4,-0.4],[-2.4,1.4],[2.4,-2.2],[2.4,-0.4],[2.4,1.4]].forEach(([x,z],i)=>{const c=ELC[i%3];const e=makeElf({shirt:c[0],pants:c[1],hat:c[2],long:i%2===1});e.position.set(x,0,z);e.rotation.y=x<0?Math.PI/2-0.4:-Math.PI/2+0.4;scene.add(e);elves.push({e,b:bubI(e,{y:2.35,size:0.0032}),i})});
  // 마을(멀리): 집 위 ISTP 말풍선
  const vil=new THREE.Group();vil.position.set(120,0,0);scene.add(vil);
  const vg=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(0xeef3ff));vg.rotation.x=-Math.PI/2;vil.add(vg);
  const houses=[];for(let i=0;i<12;i++){const row=i<6?0:1;const h=makeXHouse(r,{w:2.6+r()*0.6,h:1.8+r()*0.5});h.position.set(-9+(i%6)*3.6+(row?1.8:0),0,-row*5);vil.add(h);
    const hb=labelSpriteB();h.add(hb);hb.position.set(0,4.4,0);houses.push({h,hb,i});}
  function labelSpriteB(){const b=makeBubble('ISTP',{...ISTPB,size:0.0055});return b}
  const vsl=makeSleigh();vsl.scale.setScalar(0.55);vil.add(vsl);const vsa=makeSanta();seatInSleigh(vsa,vsl);
  const vdeer=[[-0.5,2.4],[0.5,2.4],[-0.5,4.0],[0.5,4.0]].map(([x,z])=>{const d=makeDeer();d.position.set(x,0,z);d.scale.setScalar(0.85);vsl.add(d);return d});
  const vst=starField(scene,200,r,{w:120,h:40,y0:12,z:-60});vst.position.x=120;
  // 클로즈업 세트(하늘 위)
  const cu=new THREE.Group();cu.position.set(-120,0,0);scene.add(cu);
  const csl=makeSleigh();cu.add(csl);const csa=makeSanta();seatInSleigh(csa,csl);csl.rotation.y=-0.25;
  const cb=bub(csa,'ISTP',{...ISTPB,y:2.55,size:0.0016});
  const streak=[];const sm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.7});
  for(let i=0;i<70;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.02,0.6),sm);cu.add(s);streak.push({s,x:(r()-0.5)*8,y:r()*6,z:-6+r()*8,ph:r()})}
  const cst=starField(scene,200,r,{w:60,h:30,y0:-5,z:-30});cst.position.x=-120;
  const LIFT=MK('lift'),CLOSE=MK('close'),VIL=LIFT+0.6;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,400);const tl=title();
  return t=>{
    SN.upd(t);twinkle(ws.userData.bulbs,t);
    elves.forEach(q=>{resetP(q.e);showB(q.b,t,0.9+q.i*0.1);if(t>LIFT){wave(q.e,t,q.e.position.x<0?1:0,q.i)}else{q.e.userData.arms[q.e.position.x<0?1:0].rotation.x=-0.6}});
    sl.userData.glow.scale.setScalar(1.0+0.1*Math.sin(t*6));
    resetP(sa);sitPose(sa);sa.userData.legs.forEach(l=>l.rotation.x=-1.35);sa.userData.arms.forEach(a=>a.rotation.x=-1.1);eyesK(sa,0.7);
    if(t<LIFT){sl.position.set(0,0,0);sl.rotation.x=0;deer.forEach((d,i)=>{d.position.y=0;gallop(d,t,i,0.05)})}
    else{const d=t-LIFT;const k=ease(d/1.2);sl.position.set(0,Math.pow(Math.max(0,d-0.3),1.6)*2.2,d*d*2.2+d*2.5);sl.rotation.x=-0.25*k;deer.forEach((dd,i)=>{gallop(dd,t,i);dd.position.y=Math.sin(t*12+i)*0.05})}
    // 마을
    if(t>=VIL&&t<CLOSE){const d=t-VIL;houses.forEach(q=>{showB(q.hb,t,VIL+0.15+q.i*0.05);twinkle(q.h.userData.bulbs,t,q.i)});
      vsl.position.set(-6+d*11,8.5+Math.sin(d*3)*0.2,-3);vsl.rotation.set(0,Math.PI/2,0.06);vdeer.forEach((dd,i)=>gallop(dd,t,i));
      resetP(vsa);sitPose(vsa);vsa.userData.legs.forEach(l=>l.rotation.x=-1.35)}
    // 클로즈업
    if(t>=CLOSE){const d=t-CLOSE;streak.forEach(q=>{const zz=((q.z+d*14+q.ph*8)%8)-6;q.s.position.set(q.x,q.y,zz)});
      resetP(csa);sitPose(csa);csa.userData.legs.forEach(l=>l.rotation.x=-1.35);csa.userData.arms.forEach(a=>a.rotation.x=-1.1);
      const bl=(d>1.6&&d<1.75)?0.12:0.7;eyesK(csa,bl);showB(cb,t,CLOSE+0.35);csl.position.y=Math.sin(d*2.2)*0.06;csa.userData.hat.rotation.z=Math.sin(d*5)*0.04}
    if(t<LIFT+0.2){bgEl.style.background='linear-gradient(#16204a,#33468a 55%,#8aa2d8)';cam.position.set(4.0,2.9,6.6-t*0.12);cam.lookAt(0.0,2.75,0.2)}
    else if(t<VIL){const d=t-LIFT-0.2;cam.position.set(5.6-d*0.6,3.2+d*0.8,8.4+d*0.4);cam.lookAt(0,2.6+d*2.0,1.6+d*3)}
    else if(t<CLOSE){const d=t-VIL;cam.position.set(120+d*0.4,4.2,14);cam.lookAt(120+d*0.4,5.6,-2)}
    else{const d=t-CLOSE;cam.position.set(-120+1.2-d*0.08,2.6,3.0-d*0.06);cam.lookAt(-120+0.05,2.25,-0.15)}
    tl(t,t>LIFT);caption(0,t);renderer.render(scene,cam);
  };
};

// ===== S1 대기실 단톡 '크리스마스 뭐 해요?' =====
function phoneUI(name,members){
  const ph=document.createElement('div');ph.className='phone';ph.innerHTML=`<div class="screen"><div class="sbar"><span>23:10</span><span>▮▮▮ 85%</span></div><div class="head">${name}&nbsp;<span style="color:#888;font-weight:700">${members}</span></div><div class="msgs"></div><div class="inbar"><div class="inbox"><span class="ph" style="color:#aaa">메시지 입력</span></div><div class="sendb">▲</div></div></div>`;
  ui.appendChild(ph);ph.querySelector('.msgs').style.bottom='96px';return ph}
function msgRow(who,text,col){const d=document.createElement('div');d.className='row';d.innerHTML=`<div class="av" style="background:${col};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:30px">${who.slice(-1)}</div><div><div class="who">${who}</div><div class="b">${text}</div></div>`;return d}
S[1]=()=>{
  sky('#3a2a2a','#5a3e36','#7a5444');
  const scene=roomScene();const r=rng(2101);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xb48a64));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(20,7,0.2),lamb(0xe9d3b4));wall.position.set(0,3.5,-2.6);scene.add(wall);
  for(let i=0;i<20;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(0.06,7),lamb(0xd9bf9c));p.position.set(-9.5+i,3.5,-2.49);scene.add(p)}
  // 창(밖은 눈 내리는 밤)
  const win=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.7),basic(0x2a3a6a));win.position.set(-2.4,2.8,-2.48);scene.add(win);
  for(const [w2,h2,x,y] of[[0.08,1.7,-2.4,2.8],[2.2,0.08,-2.4,2.8],[2.36,0.14,-2.4,1.95],[2.36,0.14,-2.4,3.65]]){const f=new THREE.Mesh(new THREE.PlaneGeometry(w2,h2),basic(0xf2ebe0));f.position.set(x,y,-2.46);scene.add(f)}
  const SN=snowfall(scene,80,r,{w:2.1,h:1.6,z:-2.45,d:0.01,y0:1.95,size:0.05});
  // 사물함 + 옷걸이 + 달력
  for(let i=0;i<3;i++){const lk=new THREE.Mesh(new THREE.BoxGeometry(0.9,2.6,0.6),lamb([0xc9303a,0x3f8a5c,0xc9303a][i]));lk.position.set(1.2+i*0.95,1.3,-2.2);scene.add(lk);
    const hd=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.3,0.05),lamb(GOLD));hd.position.set(1.5+i*0.95,1.4,-1.88);scene.add(hd)}
  const cal=new THREE.Mesh(new THREE.PlaneGeometry(0.9,1.0),new THREE.MeshBasicMaterial({map:canvasTex(180,200,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#e2335a';x.fillRect(0,0,w,50);x.fillStyle='#fff';x.font='900 34px "Noto Sans CJK KR"';x.textAlign='center';x.fillText('12월',w/2,38);x.fillStyle='#e2335a';x.font='900 110px "Noto Sans CJK KR"';x.fillText('24',w/2,170)})}));cal.position.set(-0.2,3.1,-2.48);scene.add(cal);
  const gar=[];for(let i=0;i<20;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),basic([0xff4d5e,0xffd84d,0x5fd38a,0x5fb0ff][i%4]));b.position.set(-5+i*0.5,4.6-Math.sin((i%5)/4*Math.PI)*0.25,-2.4);scene.add(b);gar.push(b)}
  const bench=new THREE.Mesh(new THREE.BoxGeometry(3.0,0.45,0.8),lamb(0x8a5a3a));bench.position.set(-0.6,0.42,-0.6);scene.add(bench);
  const sack=new THREE.Mesh(new THREE.SphereGeometry(0.5,24,18),smooth(0x8a5a3a));sack.scale.set(1,0.9,0.9);sack.position.set(-1.8,0.95,-0.7);scene.add(sack);
  const tie=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.34,12),smooth(0x8a5a3a));tie.position.set(-1.8,1.5,-0.7);scene.add(tie);
  const sa=makeSanta();scene.add(sa);
  const phone3=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x1d1d22));sa.userData.arms[1].add(phone3);phone3.position.set(0,-0.66,0.08);phone3.rotation.x=-0.4;
  const scr3=new THREE.Mesh(new THREE.PlaneGeometry(0.13,0.26),basic(0xbfd8ff));scr3.position.z=0.017;phone3.add(scr3);
  const sb=bubT(sa,'…',{y:2.55,size:0.0026});
  const ph=phoneUI('북극 요정들','1,204');const msgs=ph.querySelector('.msgs');const ib=ph.querySelector('.inbox');
  const Q=MK('c_q'),RR=MK('c_r'),TY=MK('c_type'),DEL=MK('c_del'),DN=MK('c_down'),WK=MK('c_work');
  const data=[['요정 1','다들 크리스마스 뭐 해요?','#3f9e5c',Q],['요정 7','집','#d94848',RR[0]],['요정 12','집','#3f9e5c',RR[1]],['요정 30','사람 많아서 안 나감','#d94848',RR[2]],['요정 88','그날 나가는 사람 이해 안 됨','#3f9e5c',RR[3]]];
  const rows=data.map(d=>{const e=msgRow(d[0],d[1],d[2]);e.style.display='none';msgs.appendChild(e);return {e,t0:d[3]}});
  const ck=chip('크리스마스 약속 <b>0건</b> · 출근 <b>1명</b>');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);
  return t=>{SN.upd(t,0.4);twinkle(gar,t);
    rows.forEach(q=>{const on=t>=q.t0;q.e.style.display=on?'flex':'none';if(on){const k=pop((t-q.t0)/0.25);q.e.style.transform=`scale(${0.8+0.2*k})`;q.e.style.transformOrigin='left bottom';q.e.style.opacity=clamp01((t-q.t0)/0.1)}});
    const typed=t>=TY&&t<DEL;const html=typed?`일<span class="cur"></span>`:(t>=DEL&&t<DEL+0.5?`<span class="cur"></span>`:`<span class="ph" style="color:#aaa">메시지 입력</span>`);if(ib.dataset.h!==html){ib.dataset.h=html;ib.innerHTML=html}
    const pd=ease((t-DN)/0.5);ph.style.transform=`translateY(${pd*1500}px) rotate(${pd*6}deg)`;ph.style.display=pd>=1?'none':'block';
    // 산타
    resetP(sa);const u=sa.userData;eyesK(sa,0.7);
    const STAND=WK-1.4;
    if(t<STAND){sa.position.set(-0.4,0,-0.45);sa.rotation.y=0.15;sitPose(sa);u.legs.forEach(l=>l.rotation.x=-1.35);
      u.arms[1].rotation.x=-1.25;u.arms[0].rotation.x=-0.3;u.head.rotation.x=t<DN?0.35:0.1;phone3.visible=t<DN+0.6;
      if(t>DN+0.5){u.arms[1].rotation.x=-0.3;}
      if(t>DN+1.2&&t<STAND){const s=Math.sin((t-DN-1.2)*2);u.hip.position.y=0.56-0.02*Math.max(0,s);u.head.rotation.x=0.18}}
    else{const d=t-STAND;const k=ease(d/0.5);sa.position.set(-0.4+Math.max(0,d-0.9)*1.6,0,-0.45+Math.max(0,d-0.9)*0.4);
      if(d<0.5){sitPose(sa);u.hip.position.y=0.56+0.24*k;u.legs.forEach(l=>l.rotation.x=-1.35*(1-k))}
      else if(d<0.9){sa.rotation.y=0.15-ease((d-0.5)/0.4)*1.0;}
      else{sa.rotation.y=Math.PI/2-0.3;walkPose(sa,(d-0.9)*8,0.45)}
      sack.position.set(sa.position.x-0.05,d>0.6?1.95:0.95,sa.position.z-0.35);tie.position.set(sack.position.x,sack.position.y+0.55,sack.position.z);
      if(d>0.6){u.arms[0].rotation.x=-2.8;u.arms[0].rotation.z=-0.2}}
    showB(sb,t,DN+1.1,STAND);
    chipPop(ck,t,WK);
    if(t<DN+0.3){cam.position.set(0.6,3.0,5.0);cam.lookAt(-0.3,2.0,-0.5)}
    else{const d=t-DN-0.3;const fx=Math.max(-0.2,sa.position.x);cam.position.set(0.9+fx*0.6,3.1,6.2-d*0.06);cam.lookAt(fx,2.05,-0.6)}
    caption(1,t);renderer.render(scene,cam);
  };
};

// ===== S2 소원은 기프티콘 → 바코드 한 장 → 큰 상자 =====
S[2]=()=>{
  sky('#4a2e28','#6a4436','#8a5a46');
  const scene=roomScene();const r=rng(2201);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xa87a52));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(20,7,0.2),lamb(0x9a5a3a));wall.position.set(0,3.5,-3);scene.add(wall);
  // 선반 + 선물
  for(let row=0;row<3;row++){const sh=new THREE.Mesh(new THREE.BoxGeometry(7,0.1,0.6),lamb(0x6a3a22));sh.position.set(0.5,1.3+row*1.05,-2.6);scene.add(sh);
    for(let i=0;i<8;i++){const gb=giftBox(pick(r,[0xd8343c,0x3f9e5c,0x5fb0ff,0xffd84d,0xb79bff]),pick(r,[GOLD,0xffffff,0xd8343c]),0.55+r()*0.25);gb.position.set(-2.6+i*0.85,1.35+row*1.05,-2.6);gb.rotation.y=r()-0.5;scene.add(gb)}}
  const gar=[];for(let i=0;i<22;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),basic([0xff4d5e,0xffd84d,0x5fd38a,0x5fb0ff][i%4]));b.position.set(-5+i*0.5,4.9-Math.sin((i%6)/5*Math.PI)*0.25,-2.85);scene.add(b);gar.push(b)}
  // 책상 + 장부 + 프린터
  const desk=new THREE.Group();desk.position.set(-0.4,0,0.4);scene.add(desk);
  const top=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.12,1.2),lamb(0x7a4a2e));top.position.y=1.05;desk.add(top);
  const front=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.95,0.08),lamb(0x6a3f26));front.position.set(0,0.52,0.56);desk.add(front);
  const book=new THREE.Group();book.position.set(-0.3,1.13,0.1);desk.add(book);
  const bp1=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.05,0.8),lamb(0xfff6e0));bp1.position.x=-0.32;bp1.rotation.z=0.06;book.add(bp1);
  const bp2=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.05,0.8),lamb(0xfff6e0));bp2.position.x=0.32;bp2.rotation.z=-0.06;book.add(bp2);
  const cov=new THREE.Mesh(new THREE.BoxGeometry(1.34,0.03,0.86),lamb(0x8a2a2a));cov.position.y=-0.03;book.add(cov);
  const lines=new THREE.Mesh(new THREE.PlaneGeometry(1.2,0.7),new THREE.MeshBasicMaterial({transparent:true,map:canvasTex(300,180,(x,w,h)=>{x.fillStyle='#c9a';x.font='700 18px sans-serif';for(let i=0;i<8;i++){x.fillStyle='rgba(90,60,40,.55)';x.fillRect(i<4?12:162,18+i%4*40,110,6)}x.fillStyle='#8a2a2a';x.font='900 22px "Noto Sans CJK KR"';x.fillText('올해 선물 목록',8,14)})}));lines.rotation.x=-Math.PI/2;lines.position.set(0,0.035,0);book.add(lines);
  const prn=new THREE.Group();prn.position.set(0.85,1.11,0.15);desk.add(prn);
  const pb=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.3,0.45),lamb(0xe8e8ee));pb.position.y=0.15;prn.add(pb);
  const pt=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.04,0.2),lamb(0x3a3a44));pt.position.set(0,0.31,-0.05);prn.add(pt);
  const led=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),basic(0x5fd38a));led.position.set(0.22,0.24,0.23);prn.add(led);
  const paper=paperMesh(0.36);scene.add(paper);
  // 큰 선물 상자
  const big=giftBox(0xd8343c,GOLD,2.2);big.position.set(2.4,0,1.0);big.rotation.y=-0.3;scene.add(big);
  const sa=makeSanta();scene.add(sa);sa.position.set(-0.7,0,-0.55);
  const chair=new THREE.Mesh(new THREE.BoxGeometry(1.0,1.4,0.2),lamb(0x8a2a2a));chair.position.set(-0.7,1.0,-1.05);scene.add(chair);
  const el=makeElf({});scene.add(el);el.position.set(1.3,0,-0.2);el.rotation.y=-0.7;
  const tab=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.3,0.03),lamb(0x1d1d22));el.userData.arms[1].add(tab);tab.position.set(-0.05,-0.62,0.18);tab.rotation.set(-0.3,0.4,0);
  const tsc=new THREE.Mesh(new THREE.PlaneGeometry(0.36,0.24),basic(0xffe6a8));tsc.position.z=0.017;tab.add(tsc);
  const sbub=bubT(sa,'…',{y:2.6,size:0.0024});
  // DOM 소원 카드
  const card=document.createElement('div');card.className='wcard';card.innerHTML='<h3>산타에게 온 소원 (20억)</h3>';ui.appendChild(card);
  const WS=[['그냥 기프티콘 주세요','#e2335a','민준 (8살)'],['배민 상품권도 돼요','#2ac1bc','서연 (10살)'],['골라 주시는 것보다 제가 고르는 게…','#3f9e5c','도윤 (9살)']];
  const wr=WS.map(w=>{const d=document.createElement('div');d.className='wrow';d.innerHTML=`<div class="ic" style="background:${w[1]}">✉</div><div><span class="nm">${w[2]}</span>${w[0]}</div>`;card.appendChild(d);d.style.opacity=0;return d});
  const ck=chip('소원 <b>20억 건</b> · 기프티콘 <b>98%</b>',1120);
  const ck2=chip('상자 속: 바코드 <b>1장</b>');
  const TAB=MK('g_tab'),WW=MK('g_w'),GC=MK('g_chip'),PR=MK('g_print'),BX=MK('g_box'),C2=MK('g_chip2');
  const L1=ln(2,'s1'),E1=ln(2,'e1'),S2=ln(2,'s2'),N4=ln(2,'n4');
  const CARD_OUT=L1.t0-0.15;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);
  return t=>{twinkle(gar,t);
    // 카드
    const ck_=pop((t-TAB)/0.35);const out=ease((t-CARD_OUT)/0.3);card.style.transform=`translateY(${out*-1400}px) scale(${t<TAB?0:0.6+0.4*ck_})`;card.style.opacity=t<TAB?0:1;card.style.display=out>=1?'none':'block';
    wr.forEach((d,i)=>{const k=pop((t-WW[i])/0.25);d.style.opacity=clamp01((t-WW[i])/0.1);d.style.transform=`scale(${0.7+0.3*k})`});
    chipPop(ck,t,GC);if(t>CARD_OUT)ck.style.opacity=0;
    // 산타·요정
    resetP(sa);const u=sa.userData;sitPose(sa);u.legs.forEach(l=>l.rotation.x=-1.35);eyesK(sa,0.7);
    u.arms.forEach(a=>a.rotation.x=-1.2);
    if(t<CARD_OUT){sa.rotation.y=0.0;u.head.rotation.x=0.3}
    else{sa.rotation.y=0.55;u.head.rotation.x=0.05}
    talkBeard(sa,t,speaking(2,'s1',t));
    if(t>S2.t0&&t<PR){const k=Math.sin(clamp01((t-S2.t0)/0.6)*Math.PI);u.hip.position.y=0.56-0.05*k;u.head.rotation.x=0.05+0.25*k;eyesK(sa,0.5)}
    showB(sbub,t,S2.t0-0.05,PR-0.1);
    resetP(el);mood(el,speaking(2,'e1',t)&&Math.sin(t*20)>0?'open':'flat');if(el.userData.mouth.visible)mood(el,'flat');
    el.userData.arms[1].rotation.x=t<CARD_OUT?-1.4:-1.0;el.userData.arms[0].rotation.x=-0.2;if(speaking(2,'e1',t))el.userData.head.rotation.z=Math.sin(t*6)*0.05;
    // 프린트 → 상자
    const pk=clamp01((t-PR)/1.0);
    if(t<PR){paper.visible=false}
    else if(t<BX){paper.visible=true;const wp=new THREE.Vector3(0.45,1.45,0.1+pk*0.35);paper.position.copy(wp);paper.rotation.set(-1.2+pk*0.6,0,0)}
    else{const d=t-BX;const k=ease(d/0.5);paper.visible=d<0.55;paper.position.set(0.45+(2.4-0.45)*k,1.6+Math.sin(k*Math.PI)*0.6-k*0.4,0.45+(1.0-0.45)*k);paper.rotation.set(-0.6-k*1.0,k*2,0)}
    led.material.color.setHex(t>PR&&t<PR+1.1&&Math.sin(t*20)>0?0xffd84d:0x5fd38a);
    const lid=big.userData.lid;const lo=t<BX?0.7:(1-ease((t-BX-0.55)/0.25))*0.7;lid.position.set(0,0.5+lo*0.3,-lo*0.2);lid.rotation.x=-lo*0.8;
    const bowk=t<BX+0.8?0.6:pop((t-BX-0.8)/0.3);big.userData.bow.scale.setScalar(bowk);
    chipPop(ck2,t,C2);
    // 카메라
    if(t<CARD_OUT){cam.position.set(0.3,3.8,6.6);cam.lookAt(0.2,2.0,-0.2)}
    else if(t<PR){const tt=t<E1.t0-0.1?0:1;if(tt===0){cam.position.set(1.0,2.6,3.4);cam.lookAt(-0.6,2.05,-0.4)}else{cam.position.set(-1.0,2.4,3.0);cam.lookAt(1.2,1.55,-0.1)}
      if(t>S2.t0-0.05){cam.position.set(0.6,2.5,3.2);cam.lookAt(-0.55,2.0,-0.5)}}
    else if(t<BX-0.1){cam.position.set(1.2,2.3,2.6);cam.lookAt(0.45,1.35,0.4)}
    else{const d=t-BX;cam.position.set(2.0+d*0.08,3.9,6.4-d*0.1);cam.lookAt(1.6,1.3,0.6)}
    caption(2,t);renderer.render(scene,cam);
  };
};

// ===== S3 던지기 배송 =====
S[3]=()=>{
  nightSky();
  const scene=nightScene();const r=rng(2301);snowGround(scene);scene.fog=new THREE.Fog(0x8aa2d8,25,70);
  const SN=snowfall(scene,600,r,{w:40,h:14,z:-2,d:18});starField(scene,260,r,{w:160,h:50,y0:12,z:-50});
  const houses=[];for(let i=0;i<9;i++){const h=makeXHouse(r,{w:3.0,h:2.2,cx:0.6});h.position.set(i*4.6,0,0);scene.add(h);houses.push(h)}
  for(let i=0;i<10;i++){const tr=xmasTree(0.8+r()*0.3,{snow:true,lights:false,seed:i});tr.position.set(-2.3+i*4.6,0,2.6);scene.add(tr)}
  for(let i=0;i<8;i++){const tr=xmasTree(1.4,{snow:true,lights:false,seed:i+20,col:0x2a6a44});tr.position.set(-4+i*5.3,0,-6);scene.add(tr)}
  const sl=makeSleigh();scene.add(sl);const sa=makeSanta();seatInSleigh(sa,sl);
  const deer=[[-0.5,2.4],[0.5,2.4],[-0.5,4.0],[0.5,4.0]].map(([x,z])=>{const d=makeDeer();d.position.set(x,0,z);d.scale.setScalar(0.85);sl.add(d);return d});
  // 지붕 위 산타(미끄러짐용)
  const rs2=makeSanta();scene.add(rs2);
  const box0=giftBox(0xd8343c,GOLD,0.55);scene.add(box0);
  const boxes=MK('mont').map((m,i)=>{const b=giftBox([0x3f9e5c,0x5fb0ff,0xd8343c,0xffd84d,0xb79bff,0x3f9e5c][i],[GOLD,0xffffff,GOLD,0xd8343c,0xffffff,0xd8343c][i],0.5);scene.add(b);return {b,t0:m,h:houses[i+1]}});
  const ex=bubT(rs2,'!!',{y:2.6,size:0.0028,bg:'#fff3c2',fg:'#a3262c'});
  const dots=bubT(sa,'…',{y:2.6,size:0.0028});
  const SLIP=MK('slip'),TH=MK('throw'),MO=MK('mont');
  const ck=chip('1가구 배송 <b>0.8초</b>');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ch0=houses[0].userData.chim.clone().add(houses[0].position);
  function arc(b,from,to,k){b.position.set(from.x+(to.x-from.x)*k,from.y+(to.y-from.y)*k+Math.sin(k*Math.PI)*1.2,from.z+(to.z-from.z)*k);b.rotation.set(k*6,k*4,0)}
  return t=>{SN.upd(t);houses.forEach((h,i)=>twinkle(h.userData.bulbs,t,i));
    deer.forEach((d,i)=>gallop(d,t,i));
    resetP(sa);sitPose(sa);sa.userData.legs.forEach(l=>l.rotation.x=-1.35);sa.userData.arms.forEach(a=>a.rotation.x=-1.1);eyesK(sa,0.7);
    const SHOT2=SLIP+0.75;
    // 썰매 위치
    let sx;if(t<TH+0.6){sx=-1.2}else{const d=t-TH-0.6;sx=-1.2+d*8.2}
    sl.position.set(sx,5.4+Math.sin(t*2.5)*0.08,-0.2);sl.rotation.y=Math.PI/2;
    // 지붕 위 산타
    rs2.visible=t<SHOT2;resetP(rs2);eyesK(rs2,0.7);
    if(t<SLIP){rs2.position.set(-0.4,3.28,0.0);rs2.rotation.set(0,0.3,0);walkPose(rs2,t*5,0.25)}
    else{const d=t-SLIP;const k=ease(d/0.35);rs2.position.set(-0.4-d*1.2,3.28-d*0.9,0.0);rs2.rotation.set(0,0.3,0.9*k);
      rs2.userData.legs[0].rotation.x=-1.2*k;rs2.userData.legs[1].rotation.x=-0.6*k;armUp(rs2,0,k);armUp(rs2,1,k*0.7);rs2.userData.arms[0].rotation.z=-0.6+Math.sin(t*20)*0.4;eyesK(rs2,1.4)}
    showB(ex,t,SLIP+0.08,SHOT2);
    // 첫 투척
    showB(dots,t,SHOT2+0.1,TH-0.05);
    if(t>SHOT2&&t<TH+0.25){sa.userData.head.rotation.y=-0.6;sa.userData.head.rotation.x=0.4}
    if(t>TH-0.25&&t<TH+0.1){armUp(sa,0,ease((t-TH+0.25)/0.2))}
    const hand=new THREE.Vector3(sx,6.6,-0.2);
    if(t<TH){box0.visible=t>SHOT2;box0.position.set(sx+0.1,6.2,0.5);box0.rotation.set(0,0,0)}
    else{const k=clamp01((t-TH)/0.45);box0.visible=k<1;arc(box0,hand,ch0,k);box0.scale.setScalar(0.55*(1-k*0.4))}
    boxes.forEach(q=>{const k=clamp01((t-q.t0)/0.3);q.b.visible=t>q.t0&&k<1;if(q.b.visible){const c=q.h.userData.chim.clone().add(q.h.position);const st=new THREE.Vector3(sl.position.x,6.6,-0.2);arc(q.b,st,c,k)}});
    if(t>TH+0.6){const ph=MO.find(m=>t>m-0.12&&t<m+0.12);if(ph){armUp(sa,0,1)}}
    chipPop(ck,t,MO[0]-0.2);
    // 카메라
    if(t<SHOT2){cam.position.set(0.2,4.3,8.6);cam.lookAt(-0.3,3.9,0)}
    else if(t<TH+0.6){cam.position.set(2.2,6.2,7.4);cam.lookAt(-0.3,4.4,-0.2)}
    else{cam.position.set(sx+1.0,6.4,13.0);cam.lookAt(sx+1.2,4.9,-0.4)}
    caption(3,t);renderer.render(scene,cam);
  };
};

// ===== S4 굴뚝에 걸림 → 거실에서 아이와 마주침 =====
S[4]=()=>{
  const scene=roomScene();const r=rng(2401);
  const R=livingRoom(scene,{});
  const kid=makeKid();scene.add(kid);kid.position.set(0.8,0,2.15);
  const pad=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.12,0.22),lamb(0x2b2b3a));kid.userData.arms[0].add(pad);pad.position.set(0.18,-0.66,0.15);
  const sa=makeSanta();scene.add(sa);
  const box=giftBox(0xd8343c,GOLD,0.8);scene.add(box);
  const soot=[];for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,6),new THREE.MeshBasicMaterial({color:0x555060,transparent:true,opacity:0.6}));scene.add(m);m.visible=false;soot.push({m,vx:(r()-0.5)*2,vy:r()*1.2,vz:r()*1.2})}
  // 지붕 세트(멀리)
  const rf=new THREE.Group();rf.position.set(100,0,0);scene.add(rf);const hs=makeXHouse(r,{w:3.2,h:2.2,cx:0.0});rf.add(hs);snowGround(rf);
  const SN=snowfall(rf,260,r,{w:12,h:10,d:10});
  const rbox=giftBox(0xd8343c,GOLD,0.8);rf.add(rbox);
  const rsa=makeSanta();rf.add(rsa);
  const rb=bubT(rsa,'…',{y:2.6,size:0.0026});
  // 문 밖(분할 화면 위)
  const ou=new THREE.Group();ou.position.set(-100,0,0);scene.add(ou);const ho=makeXHouse(r,{w:4.0,h:2.6});ou.add(ho);snowGround(ou);const SN2=snowfall(ou,200,r,{w:10,h:8,d:8,z:3});
  const osl=makeSleigh();osl.position.set(-2.6,0,3.2);osl.rotation.y=0.3;ou.add(osl);
  const osa=makeSanta();ou.add(osa);osa.position.set(0.9,0,1.9);osa.rotation.y=0.25;
  const ob=bubT(osa,'후…',{y:2.6,size:0.0024});const kb=bubT(kid,'후…',{y:1.9,x:0.75,size:0.003});
  const breath=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.7}));ou.add(m);breath.push(m)}
  const ST=MK('stuck'),DN=MK('m_down'),LD=MK('land'),EY=MK('eye'),WK=MK('walk'),STP=MK('stop'),CH=MK('m_chip');
  const K1=ln(4,'k1'),S3=ln(4,'s3'),S4=ln(4,'s4'),K2=ln(4,'k2'),N6=ln(4,'n6');
  const SPLIT=N6.t0+wt6();function wt6(){return 2.6}
  const ck=chip('대화 <b>4마디</b> · 둘 다 <b>안도</b>');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300),cam2=new THREE.PerspectiveCamera(40,W/(H/2),0.1,300),cam3=new THREE.PerspectiveCamera(40,W/(H/2),0.1,300);
  const sbub=bubT(sa,'…',{y:2.6,size:0.0024});
  return t=>{updRoom(R,t);SN.upd(t);SN2.upd(t);
    // 지붕 장면
    resetP(rsa);eyesK(rsa,0.7);rsa.position.set(-1.1,3.0,0.5);rsa.rotation.y=0.5;
    const ch=hs.userData.chim;const bk=clamp01((t-ST+0.35)/0.35);
    rbox.position.set(ch.x,ch.y+0.15+(1-ease(bk))*1.6,ch.z);rbox.rotation.set(0.35*bk,0.6,0.25*bk);
    if(t>ST)rbox.position.x+=Math.sin((t-ST)*40)*0.03*Math.max(0,1-(t-ST)*4);
    showB(rb,t,ST+0.25);
    if(t>ST+0.4){rsa.userData.hip.position.y=0.8-0.04*Math.sin(clamp01((t-ST-0.4)/0.4)*Math.PI);rsa.userData.head.rotation.x=0.2}
    // 거실
    resetP(kid);sitPose(kid);const ku=kid.userData;ku.legs.forEach(l=>l.rotation.x=-1.35);ku.arms.forEach(a=>a.rotation.x=-1.15);kid.rotation.y=Math.PI;mood(kid,'flat');eyesK(kid,0.8);
    const lookS=t>EY&&t<K2.t0;ku.head.rotation.y=lookS?ease((t-EY)/0.25)*0.9:0;
    if(t>STP&&t<K2.t0)ku.head.rotation.y=0;  // 산타가 문 앞에선 다시 화면
    resetP(sa);const u=sa.userData;eyesK(sa,0.7);
    const fpx=-2.4,fpz=-2.4;
    if(t<LD){const k=clamp01((t-DN)/(LD-DN));sa.position.set(fpx,2.0-k*2.0,fpz-0.1);sa.rotation.y=0.6;u.arms.forEach(a=>{a.rotation.x=-2.9})}
    else if(t<WK){sa.position.set(fpx,0,fpz+0.4);sa.rotation.y=0.75;const k=ease((t-LD)/0.3);if(t<LD+0.35){u.hip.position.y=0.8-0.25*(1-k)}
      u.arms.forEach(a=>a.rotation.x=-1.0);if(t>S3.t1+0.1){u.arms.forEach(a=>a.rotation.x=-1.0*(1-ease((t-S3.t1-0.1)/0.3)))}}
    else if(t<STP){const d=(t-WK)/(STP-WK);const p0=new THREE.Vector3(fpx,0,fpz+0.4),p1=new THREE.Vector3(5.4,0,0.6);sa.position.lerpVectors(p0,p1,ease(d));sa.rotation.y=Math.atan2(p1.x-p0.x,p1.z-p0.z);walkPose(sa,(t-WK)*7,0.4)}
    else{sa.position.set(5.4,0,0.6);const k=ease((t-STP)/0.35);sa.rotation.y=Math.PI/2*(1-k)+(-Math.PI/2-0.25)*k;if(t>CH-0.3){const d=t-CH+0.3;sa.visible=d<0.4;sa.position.x=5.4+d*2}}
    if(t<STP||t<CH-0.3)sa.visible=true;
    talkBeard(sa,t,speaking(4,'s3',t)||speaking(4,'s4',t));
    showB(sbub,t,EY+0.15,K1.t0-0.1);
    // 상자: 굴뚝에서 같이 → 트리 옆
    if(t<WK){box.position.set(sa.position.x,t<LD?sa.position.y+2.4:1.05,sa.position.z+0.45);if(t>S3.t1){const k=ease((t-S3.t1)/0.3);box.position.set(fpx+(1.5-fpx)*0+(-1.2-fpx)*0*k,1.05-1.05*k,fpz+0.85)}}
    else box.position.set(fpx,0,fpz+0.85);
    soot.forEach((q,i)=>{const d=t-LD;q.m.visible=d>0&&d<1.2;if(q.m.visible){q.m.position.set(fpx+q.vx*d,0.3+q.vy*d,fpz+0.4+q.vz*d);q.m.material.opacity=0.6*(1-d/1.2);q.m.scale.setScalar(1+d*1.5)}});
    // 분할 화면(문 밖 산타 / 소파 아이)
    resetP(osa);eyesK(osa,0.4);osa.userData.hip.position.y=0.8-0.05*Math.sin(clamp01((t-SPLIT)/0.8)*Math.PI);osa.userData.head.rotation.x=-0.15;
    showB(ob,t,SPLIT+0.3);showB(kb,t,SPLIT+0.5);
    breath.forEach((m,i)=>{const d=((t-SPLIT-0.3)*0.9+i*0.15)%1;m.visible=t>SPLIT+0.3;m.position.set(0.9+0.15+d*0.5,2.0+d*0.4,1.9+0.35+d*0.6);m.material.opacity=0.7*(1-d);m.scale.setScalar(0.6+d*1.4)});
    if(t>SPLIT){ku.head.rotation.y=0;ku.hip.position.y=0.56-0.04*Math.sin(clamp01((t-SPLIT-0.5)/0.8)*Math.PI);eyesK(kid,0.4)}
    chipPop(ck,t,CH);
    // 카메라
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);
    if(t<DN){bgEl.style.background='linear-gradient(#16204a,#33468a 55%,#8aa2d8)';cam.position.set(100+1.8,4.4,6.4);cam.lookAt(100+0.0,3.6,0)}
    else{bgEl.style.background='linear-gradient(#3a2a2a,#5a3e36 55%,#7a5444)';
      if(t<EY){cam.position.set(1.8,3.0,7.6);cam.lookAt(-1.0,1.6,-0.6)}
      else if(t<EY+0.9){cam.position.set(-0.7,1.75,0.9);cam.lookAt(0.8,1.45,2.15)}           // 아이 얼굴
      else if(t<K1.t0-0.1){cam.position.set(-0.6,2.4,0.5);cam.lookAt(fpx,2.05,fpz+0.4)}   // 산타 얼굴
      else if(t<K1.t1+0.3){cam.position.set(-0.7,1.75,0.9);cam.lookAt(0.8,1.45,2.15)}
      else if(t<WK){cam.position.set(-0.7,2.4,0.3);cam.lookAt(fpx,2.0,fpz+0.4)}
      else if(t<STP){cam.position.set(1.2,4.4,9.6);cam.lookAt(1.6,1.4,0)}
      else if(t<S4.t1+0.05){cam.position.set(1.6,2.6,3.4);cam.lookAt(5.4,2.0,0.6)}
      else if(t<SPLIT){cam.position.set(0.3,1.95,0.6);cam.lookAt(0.8,1.5,2.15);if(t>K2.t1+0.3){cam.position.set(1.0,4.2,9.0);cam.lookAt(1.5,1.5,0)}}
      else{renderer.setScissorTest(true);
        bgEl.style.background='linear-gradient(#16204a,#33468a 27%,#8aa2d8 50%,#3a2a2a 50%,#7a5444)';
        cam2.position.set(-100+1.6,2.4,6.4);cam2.lookAt(-100+0.8,2.55,1.5);cam3.position.set(0.5,1.45,-0.1);cam3.lookAt(0.8,1.4,2.15);
        renderer.setViewport(0,H/2,W,H/2);renderer.setScissor(0,H/2,W,H/2);renderer.render(scene,cam2);
        renderer.setViewport(0,0,W,H/2);renderer.setScissor(0,0,W,H/2);renderer.render(scene,cam3);
        renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);caption(4,t);return}}
    caption(4,t);renderer.render(scene,cam);
  };
};

// ===== S5 크리스마스 아침 =====
S[5]=()=>{
  const scene=roomScene();const r=rng(2501);const LG=[];scene.traverse(o=>{if(o.isLight)LG.push({o,i:o.intensity})});
  const R=livingRoom(scene,{});R.winMat.color.setHex(0xbfe4ff);
  // 소파 뒤 벽 + 창(타임랩스용)
  const fw=new THREE.Mesh(new THREE.BoxGeometry(14,7,0.2),lamb(0xf1e3cf));fw.position.set(0,3.5,4.3);scene.add(fw);
  const w2m=new THREE.MeshBasicMaterial({color:0xbfe4ff});const w2=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),w2m);w2.position.set(-0.6,2.9,4.19);w2.rotation.y=Math.PI;scene.add(w2);
  for(const [a,b] of[[0.08,1.6],[2.2,0.08]]){const f=new THREE.Mesh(new THREE.PlaneGeometry(a,b),basic(0xf2ebe0));f.position.set(-0.6,2.9,4.18);f.rotation.y=Math.PI;scene.add(f)}
  const sock=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.4,0.05),lamb(0xffffff));sock.position.set(1.7,0.6,4.18);scene.add(sock);
  const kid=makeKid();scene.add(kid);
  const mom=makeMom();scene.add(mom);mom.position.set(0.0,0,0.45);mom.rotation.y=1.3;
  const mug=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.14,10),lamb(0xd8343c));mom.userData.arms[1].add(mug);mug.position.set(0,-0.66,0.08);
  const big=giftBox(0xd8343c,GOLD,1.2);big.position.set(1.2,0,0.55);scene.add(big);
  const paper=paperMesh(0.36);scene.add(paper);
  const phone=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.22,0.02),lamb(0x1d1d22));kid.userData.arms[0].add(phone);phone.position.set(0,-0.66,0.08);
  const con=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.2,0.06),lamb(0xd8343c));scene.add(con);
  const cs=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.14),basic(0x7fe0ff));con.add(cs);cs.position.z=-0.031;cs.rotation.y=Math.PI;
  const cable=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,2.0,4),lamb(0xf2f2f2));scene.add(cable);
  const plug=labelSprite('⚡ 충전',{bg:'#ffd84d',fg:'#3a2a00',fs:60,size:0.0042});scene.add(plug);
  const ob=bubT(kid,'…오.',{y:2.3,size:0.0026});
  const pc=document.createElement('div');pc.className='pcard';pc.innerHTML='<div class="ok">✔</div><div class="big">게임 충전 완료</div><div class="sm">기프티콘 사용 · 1초</div>';pc.style.opacity=0;ui.appendChild(pc);
  const OP=MK('open'),PA=MK('paper'),SC=MK('scan'),TL=MK('tl'),P1=MK('plug1'),P2=MK('plug2');
  const K3=ln(5,'k3'),M1=ln(5,'m1'),K4=ln(5,'k4');
  const ck=chip('');const ck0=chip('AM 7:00 · 크리스마스 아침');
  const END=TM.durs[5];
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);
  return t=>{updRoom(R,t);
    resetP(kid);const ku=kid.userData;mood(kid,'flat');eyesK(kid,0.8);
    resetP(mom);mood(mom,'flat');mom.userData.arms[1].rotation.x=-1.3;
    const tlk=t>TL;mom.visible=!tlk;
    if(!tlk){kid.position.set(1.2,0,-0.25);kid.rotation.y=0;
      if(t>OP-0.1&&t<PA){ku.hip.rotation.x=0.35;ku.arms.forEach(a=>a.rotation.x=-1.6)}
      if(t>=PA){ku.arms[1].rotation.x=-1.9;ku.arms[1].rotation.z=0.25}
      if(t>M1.t0-0.1&&t<K4.t1+0.2)ku.head.rotation.y=-0.5;
      if(t>SC-0.5){ku.arms[0].rotation.x=-1.75;ku.arms[0].rotation.z=-0.35}
      con.visible=false;cable.visible=false;plug.visible=false}
    else{kid.position.set(0.8,0,2.15);kid.rotation.y=Math.PI;sitPose(kid);ku.legs.forEach(l=>l.rotation.x=-1.35);ku.arms.forEach(a=>a.rotation.x=-1.15);
      con.visible=true;con.position.set(0.8,0.78,1.95);con.rotation.set(0.9,0,0);big.visible=false;
      const pl=t>P1;cable.visible=pl;{const a=new THREE.Vector3(1.7,0.6,4.1),b=new THREE.Vector3(0.95,0.78,1.95);cable.position.lerpVectors(a,b,0.5);cable.scale.y=a.distanceTo(b)/2.0;cable.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize())}
      plug.visible=(t>P1&&t<P1+0.45)||(t>P2&&t<P2+0.5);plug.position.set(1.15,2.55,3.9);const pk=t>P2?pop((t-P2)/0.2):pop((t-P1)/0.2);plug.scale.set(plug.userData.base[0]*pk,plug.userData.base[1]*pk,1);
      ku.head.rotation.x=0.08}
    phone.visible=!tlk&&t>SC-0.5;
    const lid=big.userData.lid;const lk=ease((t-OP)/0.35);lid.position.set(-0.3*lk,0.5+lk*0.9-Math.max(0,lk-0.6)*1.6,0.4*lk);lid.rotation.set(lk*1.0,0,-lk*0.8);
    if(t<PA||tlk){paper.visible=false}else{paper.visible=true;const hp=new THREE.Vector3();ku.arms[1].localToWorld(hp.set(0,-0.62,0.1));const k=ease((t-PA)/0.35);paper.position.set(hp.x-0.05,hp.y+0.12,hp.z+0.08);paper.rotation.set(0,0,0);paper.scale.setScalar(0.5+0.5*k)}
    showB(ob,t,K3.t0,M1.t0-0.15);
    const pk=pop((t-SC-0.15)/0.3);pc.style.opacity=t>SC+0.15&&t<TL?1:0;pc.style.transform=`translateX(-50%) scale(${pk})`;
    if(tlk){const d=(t-TL)/(END-TL-0.6);const day=Math.cos(clamp01(d)*Math.PI*2);const kk=(day+1)/2;
      w2m.color.set(mixc('#0e1636','#bfe4ff',kk));LG.forEach(l=>l.o.intensity=l.i*(0.45+0.55*kk));bgEl.style.background=`linear-gradient(${mixc('#2a2030','#f5e6d0',kk)},${mixc('#2a2030','#f5e6d0',kk)})`;
      const hrs=Math.min(14,Math.floor(clamp01(d)*14.99));chipSet(ck,`플레이 <b>${hrs}시간</b>`);chipPop(ck,t,TL+0.1);ck0.style.opacity=0}
    else{bgEl.style.background='linear-gradient(#f5e6d0,#f5e6d0)';chipPop(ck0,t,0.1)}
    if(tlk){cam.position.set(0.55,2.3,-1.6);cam.lookAt(0.6,2.0,3.0)}
    else if(t<PA){cam.position.set(1.0,2.8,4.0);cam.lookAt(1.1,1.0,0.0)}
    else if(t<M1.t0-0.1){cam.position.set(1.1,1.75,2.2);cam.lookAt(1.2,1.4,-0.25)}
    else if(t<SC-0.5){cam.position.set(0.6,2.7,4.0);cam.lookAt(0.6,1.45,0.0)}
    else{cam.position.set(1.1,1.75,2.2);cam.lookAt(1.2,1.4,-0.25)}
    caption(5,t);renderer.render(scene,cam);
  };
};

// ===== S6 엔딩: 산타 만족도 조사 =====
S[6]=()=>{
  sky('#3a2a2a','#5a3e36','#7a5444');
  const scene=roomScene();const r=rng(2601);
  const R=livingRoom(scene,{wall:0xd9e6f0});R.tv.visible=false;R.tvg.visible=false;R.sofa.rotation.y=0;R.sofa.position.set(1.0,0,0.6);
  const SN=snowfall(scene,70,r,{w:1.7,h:1.5,z:-3.06,d:0.01,y0:2.2,size:0.05});SN.p.position.x=-4.6;
  const sa=makeSanta();scene.add(sa);
  const phone=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x1d1d22));sa.userData.arms[1].add(phone);phone.position.set(0,-0.66,0.08);phone.rotation.x=-0.4;
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.13,0.26),basic(0xbfd8ff));scr.position.z=0.017;phone.add(scr);
  const nb=bubT(sa,'(끄덕)',{y:2.65,size:0.0024});
  const card=document.createElement('div');card.className='rank';
  card.innerHTML='<h3>2026 산타 만족도 조사 결과</h3><div class="sub">응답: 전 세계 어린이 20억 명</div>'+
    '<div class="rrow r1"><span class="no">1위</span><span class="tx">???</span></div><div class="rrow r2"><span class="no">2위</span><span class="tx">기프티콘으로 줌</span></div><div class="rrow r3"><span class="no">3위</span><span class="tx">빨리 감</span></div>';
  ui.appendChild(card);const r1=card.querySelector('.r1'),r2=card.querySelector('.r2'),r3=card.querySelector('.r3'),r1t=r1.querySelector('.tx');
  const dim=document.createElement('div');dim.className='fl';dim.style.background='rgba(18,22,48,1)';ui.appendChild(dim);
  const e0=document.createElement('div');e0.className='end0';e0.textContent='크리스마스 특별편';ui.appendChild(e0);
  const e1=document.createElement('div');e1.className='end1 out';e1.textContent='다음 편은?';ui.appendChild(e1);
  const e2=document.createElement('div');e2.className='end2 out';e2.textContent='신청소에서 골라 주세요';ui.appendChild(e2);
  const SIT=MK('sit'),NO=MK('noti'),RA=MK('r3'),RB=MK('r2'),R1=MK('r1'),ND=MK('nod'),CD=MK('card');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);
  return t=>{updRoom(R,t);SN.upd(t,0.4);
    resetP(sa);const u=sa.userData;eyesK(sa,0.7);sa.rotation.y=0;
    const k=ease((t-SIT)/0.35);sa.position.set(1.0,0,0.75);
    if(t<SIT){standPose(sa)}else{sitPose(sa);u.hip.position.y=0.56+0.1*(1-k);u.legs.forEach(l=>l.rotation.x=-1.35)}
    u.arms[1].rotation.x=t>NO?-1.3:-0.2;u.head.rotation.x=t>NO?0.3:0;phone.visible=t>NO-0.2;
    if(t>ND&&t<ND+0.7){u.head.rotation.x=0.3+0.25*Math.sin((t-ND)/0.7*Math.PI*2)}
    showB(nb,t,ND,CD);
    const ck_=pop((t-NO-0.2)/0.35);card.style.opacity=t>NO+0.2?(1-clamp01((t-CD)/0.25)):0;card.style.transform=`scale(${0.6+0.4*ck_})`;
    [[r3,RA],[r2,RB]].forEach(([e,t0])=>{e.style.opacity=t>t0?1:0.0;e.style.transform=`scale(${t>t0?0.8+0.2*pop((t-t0)/0.25):0.8})`});
    r1.style.opacity=t>RB+0.3?1:0;
    if(t>R1){if(r1t.textContent!=='말 안 걸어 줌'){r1t.textContent='말 안 걸어 줌';r1.classList.add('gold')}r1.style.transform=`scale(${0.85+0.15*pop((t-R1)/0.3)})`}
    else{r1t.textContent='???';r1.classList.remove('gold');r1.style.transform=`scale(${1+0.03*Math.sin(t*20)})`}
    const ek=clamp01((t-CD)/0.3);dim.style.opacity=ek*0.8;
    e0.style.opacity=ek;e0.style.transform=`translateX(-50%) scale(${pop((t-CD)/0.3)})`;
    e1.style.opacity=clamp01((t-CD-0.15)/0.15);e1.style.transform=`scale(${pop((t-CD-0.15)/0.35)})`;e2.style.opacity=clamp01((t-CD-0.45)/0.2);e2.style.transform=`scale(${pop((t-CD-0.45)/0.35)})`;
    if(t<NO){cam.position.set(1.0,2.8,6.2);cam.lookAt(1.0,1.7,0.6)}else{const d=Math.min(t-NO,6);cam.position.set(1.0,3.1,6.6-d*0.05);cam.lookAt(1.0,3.2,0.6)}
    caption(6,t,CD);renderer.render(scene,cam);
  };
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
