// ===== 장면: 온 세상이 ESFJ인데 산타가 온다면? =====
const ESFJB={bg:'#ffe1ec',fg:'#b0285a',fs:70};
function bubE(p,o={}){return bub(p,'ESFJ',{...ESFJB,y:o.y??2.15,size:o.size||0.0024})}
function bubT(p,text,o={}){return bub(p,text,{bg:o.bg||'#ffffff',fg:o.fg||'#2b2b3a',fs:o.fs||66,y:o.y??2.2,x:o.x||0,size:o.size||0.0024})}
function talkBeard(S0,t,on){S0.userData.beard.position.y=-0.03-(on?Math.abs(Math.sin(t*18))*0.018:0)}
function talkMouth(p,t,on){const u=p.userData;if(on){u.mouth.visible=Math.sin(t*22)>-0.3;if(u.flat)u.flat.visible=!u.mouth.visible;u.smile.visible=false}}
function nightSky(){sky('#16204a','#33468a','#8aa2d8')}
function seatInSleigh(sa,sl){sl.add(sa);sa.position.set(0,0.32,-0.15);sitPose(sa);sa.userData.legs.forEach(l=>l.rotation.x=-1.35);sa.userData.arms.forEach(a=>{a.rotation.x=-1.1})}
const NSH=[0xf2a6b8,0x9cc3ec,0xa8dcb4,0xf4cf7a,0xc9b3e6,0xf5b38a,0x8fd3d6,0xe7a0a0];
function makeNb(i,o={}){const p=makeHero({shirt:o.shirt??NSH[i%NSH.length],pants:o.pants??[0x4a5578,0x6a5a48,0x3d4a62][i%3],hair:[0x2a2220,0x4a3426,0x1d1d24,0x6b4a2f][i%4],skin:[0xf3cfae,0xebb995,0xf0c9a5][i%3],long:o.long??(i%2===1)});flatMouth(p);mood(p,'smile');eyesK(p,0.85);return p}
function lookAt2(p,x,z){p.rotation.y=Math.atan2(x-p.position.x,z-p.position.z)}
function clapPose(p,t,ph=0){const u=p.userData;const k=Math.abs(Math.sin(t*13+ph));u.arms[0].rotation.x=-1.25;u.arms[1].rotation.x=-1.25;u.arms[0].rotation.z=-0.55+0.4*k;u.arms[1].rotation.z=0.55-0.4*k}
function cheer(p,t,ph=0){armUp(p,0,1);armUp(p,1,1);p.userData.arms[0].rotation.z=-0.35-0.2*Math.sin(t*10+ph);p.userData.arms[1].rotation.z=0.35+0.2*Math.sin(t*10+ph);p.userData.hip.position.y=0.8+Math.abs(Math.sin(t*8+ph))*0.06}
function sceneLights(scene){return scene.children.filter(o=>o.isLight).map(l=>({l,i:l.intensity}))}
function dimLights(Ls,k){Ls.forEach(q=>q.l.intensity=q.i*k)}
function confetti(scene,n,r,o){const cols=[0xff5a5f,0xffd84d,0x5fd38a,0x5fb0ff,0xff9ad8,0xffffff];const a=[];
  for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.09,0.05),new THREE.MeshBasicMaterial({color:cols[i%6],side:THREE.DoubleSide}));scene.add(m);m.visible=false;
    a.push({m,x:o.x+(r()-0.5)*o.w,z:o.z+(r()-0.5)*o.d,vx:(r()-0.5)*1.6,vy:2.2+r()*2.4,vz:(r()-0.5)*1.6,ph:r()*6,rs:2+r()*6})}
  return (t,t0)=>{a.forEach(q=>{const d=t-t0;q.m.visible=d>0&&d<6;if(!q.m.visible)return;const y=o.y+q.vy*Math.min(d,0.5)*1.4-Math.max(0,d-0.5)*0.55;
    q.m.position.set(q.x+q.vx*Math.min(d,0.6)+Math.sin(d*3+q.ph)*0.15,Math.max(0.02,y),q.z+q.vz*Math.min(d,0.6));q.m.rotation.set(d*q.rs,d*q.rs*0.7,q.ph)})}}
function textPlane(text,w,h,o={}){const cw=Math.round(w*200),ch=Math.round(h*200);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({transparent:!!o.tr,side:THREE.DoubleSide,map:canvasTex(cw,ch,(x,W2,H2)=>{if(o.bg){x.fillStyle=o.bg;rr(x,0,0,W2,H2,o.r??30);x.fill()}x.fillStyle=o.fg||'#fff';x.font=`900 ${o.fs||Math.round(H2*0.55)}px "Noto Sans CJK KR"`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,W2/2,H2/2+4)})}))}
// 잔칫상
function feastTable(r,w=3.2,d=1.2){const g=new THREE.Group();
  const top=new THREE.Mesh(new THREE.BoxGeometry(w,0.1,d),lamb(0xf6efe4));top.position.y=0.78;g.add(top);
  const cloth=new THREE.Mesh(new THREE.BoxGeometry(w*0.98,0.02,0.36),lamb(0xd8343c));cloth.position.y=0.84;g.add(cloth);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.76,0.1),lamb(0x8a6a4a));l.position.set(sx*(w/2-0.15),0.38,sz*(d/2-0.12));g.add(l)}
  const dishes=[];const fc=[0xe0a050,0xd85a3a,0x8cc96a,0xf2d06a,0xc9784a,0xf5e6c8];
  for(let i=0;i<9;i++){const dg=new THREE.Group();const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.16,0.05,20),lamb(0xffffff));dg.add(pl);
    const fd=new THREE.Mesh(new THREE.SphereGeometry(0.15,12,8,0,Math.PI*2,0,Math.PI/2),lamb(fc[i%6]));fd.position.y=0.02;fd.scale.y=0.7;dg.add(fd);
    dg.position.set(-w/2+0.35+(i%5)*((w-0.7)/4),0.86,i<5?-0.25:0.25);if(i>=5)dg.position.x+= (w-0.7)/8;g.add(dg);dishes.push(dg)}
  const turkey=new THREE.Mesh(new THREE.SphereGeometry(0.28,16,12),lamb(0xc9784a));turkey.scale.set(1.3,0.8,1);turkey.position.set(0,1.0,0);g.add(turkey);
  for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.3,8),lamb(0xfaf3e0));c.position.set(-1.1+i*0.75,1.0,0.0);g.add(c);const f=glowSprite('rgba(255,200,110,1)',0.35);f.position.set(-1.1+i*0.75,1.2,0);g.add(f)}
  g.userData={dishes,turkey};return g}
function plate(c){const g=new THREE.Group();const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.16,0.05,20),lamb(0xffffff));g.add(pl);const fd=new THREE.Mesh(new THREE.SphereGeometry(0.14,12,8,0,Math.PI*2,0,Math.PI/2),lamb(c));fd.scale.y=0.7;fd.position.y=0.02;g.add(fd);return g}
function chair(){const g=new THREE.Group();const s=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.08,0.6),lamb(0x9a6a44));s.position.y=0.5;g.add(s);const b=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.7,0.08),lamb(0x9a6a44));b.position.set(0,0.88,-0.28);g.add(b);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,0.06),lamb(0x7a5034));l.position.set(sx*0.25,0.25,sz*0.25);g.add(l)}return g}
// 쿠키·우유
function cookie(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.035,14),lamb(0xd9a35c));g.add(c);for(let i=0;i<3;i++){const ch=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.02,0.03),lamb(0x5a3420));ch.position.set(Math.cos(i*2.1)*0.05,0.02,Math.sin(i*2.1)*0.05);g.add(ch)}return g}
function milk(){const g=new THREE.Group();const gl=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.24,14),new THREE.MeshLambertMaterial({color:0xdfeeff,transparent:true,opacity:0.55}));gl.position.y=0.12;g.add(gl);
  const m=new THREE.Mesh(new THREE.CylinderGeometry(0.064,0.056,0.21,14),lamb(0xffffff));m.position.y=0.11;g.add(m);g.userData.m=m;return g}
function setMilk(g,k){const m=g.userData.m;m.scale.y=Math.max(0.02,k);m.position.y=0.005+0.105*Math.max(0.02,k)}
// 반찬통·귤
const LIDC=[0x5fb0ff,0xff7a8a,0x5fd38a,0xffc94d,0xb38cff];
function banchan(i){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.16,0.3),new THREE.MeshLambertMaterial({color:0xf4f8fb,transparent:true,opacity:0.92}));b.position.y=0.08;g.add(b);
  const f=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.1,0.26),lamb([0xd8443a,0xe8c060,0x7ab85a,0xd87a3a,0x9a5a3a][i%5]));f.position.y=0.07;g.add(f);
  const lid=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.05,0.32),lamb(LIDC[i%5]));lid.position.y=0.18;g.add(lid);return g}
function tangerines(){const g=new THREE.Group();for(let i=0;i<7;i++){const o=new THREE.Mesh(new THREE.SphereGeometry(0.09,12,10),smooth(0xff9a2a));o.position.set(Math.cos(i*0.9)*0.1*(i%3),0.09+Math.floor(i/3)*0.12,Math.sin(i*0.9)*0.1*(i%3));g.add(o)}
  const net=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,8),new THREE.MeshBasicMaterial({color:0xd84030,wireframe:true}));net.position.y=0.17;net.scale.y=1.2;g.add(net);return g}
// 선물 몽타주 소품
function sock(){const g=new THREE.Group();const a=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.34,0.08),lamb(0xd8343c));a.position.y=0.17;g.add(a);const f=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.12,0.08),lamb(0xd8343c));f.position.set(0.05,0.04,0);g.add(f);
  const c=new THREE.Mesh(new THREE.BoxGeometry(0.19,0.08,0.09),lamb(WHITE));c.position.y=0.33;g.add(c);return g}
function workbook(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.56,0.06),lamb(0x3a6ac9));g.add(b);
  const t=new THREE.Mesh(new THREE.PlaneGeometry(0.38,0.5),new THREE.MeshBasicMaterial({map:canvasTex(190,250,(x,w,h)=>{x.fillStyle='#3a6ac9';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='900 38px "Noto Sans CJK KR"';x.textAlign='center';x.fillText('수학',w/2,70);x.fillText('문제집',w/2,115);x.fillStyle='#ffd84d';x.font='900 30px "Noto Sans CJK KR"';x.fillText('3,000제',w/2,190)})}));t.position.z=0.031;g.add(t);return g}
function potato(){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(0.16,1),lamb(0xb08850));p.scale.set(1.3,0.95,1);return p}
function openBox(col){const g=giftBox(col,0xffffff,0.7);g.userData.lid.visible=false;const inside=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.55),basic(0x5a2a2a));inside.rotation.x=-Math.PI/2;inside.position.y=0.48;g.add(inside);return g}

// ===== S0 타이틀: 굴뚝 착지 → 불 탁 → 폭죽·잔치 → 합창 → '뭘 이런 걸 다~' 앉음 → 접시 폭탄 =====
S[0]=()=>{
  sky('#3a2a2a','#5a3e36','#7a5444');
  const scene=roomScene();const r=rng(3001);const Ls=sceneLights(scene);
  const R=livingRoom(scene,{wall:0xf6e2d2});R.tv.visible=false;R.tvg.visible=false;R.sofa.visible=false;
  const ban=textPlane('산타님 어서 오세요♡',3.0,0.6,{bg:'#e2335a',fg:'#fff'});ban.position.set(0.9,3.35,-3.05);scene.add(ban);
  for(let i=0;i<9;i++){const fl=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.32,3),basic([0xffd84d,0x5fd38a,0x5fb0ff][i%3]));fl.rotation.x=Math.PI;fl.position.set(-0.7+i*0.45,3.85,-3.0);scene.add(fl)}
  const tb=feastTable(r);tb.position.set(0.7,0,0.35);scene.add(tb);
  const ch=chair();ch.position.set(-1.25,0,0.35);ch.rotation.y=Math.PI/2;scene.add(ch);
  const sa=makeSanta();scene.add(sa);const sb=bubE(sa,{y:2.3,size:0.0013});
  const mom=makeMom();mood(mom,'smile');const kid=makeKid();mood(kid,'smile');
  const crowd=[mom,kid];for(let i=0;i<7;i++)crowd.push(makeNb(i));
  const POS=[[0.2,-0.6],[0.9,-0.75],[-0.5,-1.1],[1.6,-0.7],[2.4,-0.4],[2.6,0.6],[2.3,1.5],[1.4,1.6],[0.4,1.5]];
  const cb=crowd.map((p,i)=>{scene.add(p);p.position.set(POS[i][0],0,POS[i][1]);return {p,b:bubE(p,{y:i===1?2.4:2.15,size:0.0021}),i}});
  const pop0=confetti(scene,140,r,{x:0.8,z:0.3,w:4,d:3,y:2.2});
  const stack=new THREE.Group();scene.add(stack);const PL=[];for(let i=0;i<9;i++){const p=plate([0xe0a050,0xd85a3a,0x8cc96a,0xf2d06a,0xc9784a][i%5]);p.visible=false;stack.add(p);PL.push(p)}
  const hands=[mom,crowd[2],crowd[3]];
  const LD=MK('land'),LT=MK('light'),PO=MK('pop'),CH=MK('ch'),S1=MK('s1'),SIT=MK('sit'),CK=MK('t_chip'),CL=MK('close');
  const N2=ln(0,'n2'),N2b=ln(0,'n2b');
  const ck=chip('배송 <b>1집째</b> · <b>2시간</b> 경과');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);const tl=title();
  const fpx=-2.4,SX0=-2.3,SZ0=-1.7,CX=-1.25,CZ=0.35;
  return t=>{updRoom(R,t);pop0(t,PO);ban.visible=t>CH+0.3&&t<S1;
    dimLights(Ls,t<LT?0.35:1);
    // 산타: 착지 → 손사래 치며 걸어가서 앉음
    resetP(sa);const u=sa.userData;eyesK(sa,0.75);mood(sa,'smile');
    if(t<LD){const k=clamp01(t/LD);sa.position.set(fpx,1.0*(1-k),-2.75);sa.rotation.y=0;u.arms.forEach(a=>a.rotation.x=-2.9)}
    else if(t<LD+0.3){sa.position.set(fpx,0,-2.75);u.hip.position.y=0.8-0.15*Math.sin((t-LD)/0.3*Math.PI)}
    else if(t<S1){const k=ease((t-LD-0.3)/0.5);sa.position.set(fpx+(SX0-fpx)*k,0,-2.75+(SZ0+2.75)*k);sa.rotation.y=0.6*k;if(k<1)walkPose(sa,t*7,0.35);
      if(t>LT){eyesW(sa,t<LT+0.6?1.5:1)}}
    else if(t<SIT){const k=ease((t-S1)/(SIT-S1));sa.position.set(SX0+(CX-SX0)*k,0,SZ0+(CZ-SZ0)*k);sa.rotation.y=0.6+(Math.PI/2-0.6)*k;walkPose(sa,t*7,0.35);
      armUp(sa,1,0.6);u.arms[1].rotation.z=0.3+Math.sin(t*14)*0.4}
    else{sa.position.set(CX,0,CZ);sa.rotation.y=Math.PI/2;sitPose(sa);u.legs.forEach(l=>l.rotation.x=-1.45);u.hip.position.y=0.62;
      if(t<CL)u.arms.forEach(a=>a.rotation.x=-0.9);}
    talkBeard(sa,t,speaking(0,'s1',t));
    // 접시 폭탄(내레이션 n2 동안 앞에 쌓이고, n2b 클로즈업에선 품에 안김)
    const NP=t<N2.t0?0:Math.min(9,Math.floor((t-N2.t0)/0.75)+1);
    if(t<CL){stack.position.set(CX+0.55,0.86,CZ);stack.rotation.set(0,0,0);PL.forEach((p,i)=>{p.visible=i<NP;p.position.set(0,i*0.06,0);p.rotation.y=i*0.7})}
    else{const NQ=Math.min(9,3+Math.floor((t-CL)/0.45));stack.position.copy(sa.position);stack.position.y=1.0;stack.position.x+=0.42;stack.rotation.y=Math.PI/2;
      PL.forEach((p,i)=>{p.visible=i<NQ;p.position.set(0,i*0.065,0);p.rotation.y=i*0.7});u.arms.forEach(a=>{a.rotation.x=-1.35;a.rotation.z=0});eyesW(sa,1.1)}
    showB(sb,t,N2b.t0+0.95);
    // 사람들
    cb.forEach(q=>{const p=q.p;resetP(p);lookAt2(p,t<CL?-1.2:sa.position.x,t<CL?4.5:sa.position.z);showB(q.b,t,PO+0.15+q.i*0.05,CL);
      if(t>LT){if(t<CH-0.2)clapPose(p,t,q.i);else if(t<CH+2.0)cheer(p,t,q.i);else if(t<SIT+0.3)clapPose(p,t,q.i)}
      talkMouth(p,t,speaking(0,'ch',t));if(!speaking(0,'ch',t))mood(p,'smile')});
    // 손 내밀기(클로즈업)
    if(t>CL){hands.forEach((p,i)=>{const k=Math.abs(Math.sin((t-CL)*3+i*1.3));p.position.set(CX+0.55+i*0.4,0,CZ-0.95-(i%2)*0.2);lookAt2(p,CX,CZ);p.userData.arms[1].rotation.x=-1.4-0.2*k;p.userData.arms[0].rotation.x=-1.1})}
    else hands.forEach((p,i)=>{const P0=POS[[0,2,3][i]];p.position.set(P0[0],0,P0[1])});
    chipPop(ck,t,CK);if(t>CL)ck.style.opacity=0;
    // 카메라
    if(t<CH-0.1){cam.position.set(3.4,3.0,8.4-t*0.15);cam.lookAt(0.0,2.25,-0.6)}
    else if(t<S1){const d=t-CH;cam.position.set(3.0+d*0.1,2.4,5.6);cam.lookAt(1.2,1.85,0.0)}
    else if(t<CL){const d=t-S1;cam.position.set(0.9-d*0.08,2.9,5.6-d*0.12);cam.lookAt(-0.6,1.75,0.2)}
    else{const d=t-CL;cam.position.set(1.0-d*0.04,1.85,1.45-d*0.03);cam.lookAt(CX,1.6,CZ)}
    tl(t,t>CH+0.3);caption(0,t);renderer.render(scene,cam);
  };
};

// ===== S1 쿠키·우유: 망설임 → 문틈 아이 → 우적우적 → 집마다 빨리 감기 =====
S[1]=()=>{
  sky('#3a2a2a','#5a3e36','#7a5444');
  const scene=roomScene();const r=rng(3101);
  const R=livingRoom(scene,{wall:0xdfeadb});R.tv.visible=false;R.tvg.visible=false;R.sofa.visible=false;
  const tb=new THREE.Group();scene.add(tb);tb.position.set(-0.4,0,0.6);
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.1,1.0),lamb(0xf2ebe0));top.position.y=0.75;tb.add(top);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.72,0.08),lamb(0x8a6a4a));l.position.set(sx*0.8,0.36,sz*0.4);tb.add(l)}
  const tray=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.45,0.04,24),lamb(0xffffff));tray.position.set(-0.2,0.82,0);tb.add(tray);
  const CK=[];for(let i=0;i<34;i++){const lv=Math.floor(Math.sqrt(i));const c=cookie();const a=i*2.4;const rad=Math.max(0,0.38-lv*0.07);c.position.set(-0.2+Math.cos(a)*rad*((i%3)/3+0.5),0.86+lv*0.045,Math.sin(a)*rad*((i%3)/3+0.5));c.rotation.set((r()-0.5)*0.4,r()*3,(r()-0.5)*0.4);tb.add(c);CK.push(c)}
  CK.reverse();
  const MI=[];for(let i=0;i<4;i++){const m=milk();m.position.set(0.45+(i%2)*0.2,0.8,-0.25+Math.floor(i/2)*0.3);tb.add(m);MI.push(m)}
  const note=textPlane('산타 할아버지 꼭 드세요♡',1.0,0.22,{bg:'#fff8ee',fg:'#c93a3a',r:12,fs:26});note.rotation.x=-Math.PI/2+0.35;note.position.set(-0.2,0.84,0.42);tb.add(note);
  // 문틈 아이
  const door=new THREE.Group();door.position.set(-3.6,0,1.4);scene.add(door);
  const fr1=new THREE.Mesh(new THREE.BoxGeometry(0.15,2.4,0.3),lamb(0xf2ebe0));fr1.position.set(0.7,1.2,0);door.add(fr1);
  const fr2=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.15,0.3),lamb(0xf2ebe0));fr2.position.set(0,2.4,0);door.add(fr2);
  const dark=new THREE.Mesh(new THREE.PlaneGeometry(1.3,2.3),basic(0x1a1420));dark.position.set(0,1.15,-0.1);door.add(dark);
  const dp=new THREE.Group();dp.position.set(-0.65,0,0);door.add(dp);const pan=new THREE.Mesh(new THREE.BoxGeometry(1.3,2.3,0.06),lamb(0x8a5a3a));pan.position.set(0.65,1.15,0);dp.add(pan);
  const kid=makeKid();kid.position.set(0.45,0,-0.05);door.add(kid);kid.rotation.y=0.8;mood(kid,'flat');
  const sa=makeSanta();scene.add(sa);sa.position.set(-0.6,0,-0.15);
  const hb=bubT(sa,'…',{y:2.6,size:0.0022});
  const fl=document.createElement('div');fl.className='fl';ui.appendChild(fl);
  const ff=document.createElement('div');ff.className='clock';ff.style.top='420px';ff.style.background='#2b2b3a';ff.style.color='#fff';ff.textContent='▶▶ 다음 집';ff.style.opacity=0;ui.appendChild(ff);
  const ck=chip('우유 <b>1잔째</b> · 배송 <b>1집</b>');
  const WALLS2=[0xdfeadb,0xf2dccf,0xd9e4f2,0xf5e9c9,0xe6d9ef];
  const HE=MK('hes'),PK=MK('peek'),EA=MK('eat'),FF=MK('ff'),FH=MK('ffh');const K1=ln(1,'k1'),S2=ln(1,'s2'),N3=ln(1,'n3');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);
  const wallMesh=R.g.children[2];
  return t=>{updRoom(R,t);
    resetP(sa);const u=sa.userData;eyesK(sa,0.75);mood(sa,'flat');
    const hop=t<FF?0:Math.min(5,FH.filter(x=>t>=x).length);
    const g=1.0+0.12*Math.min(1,t/1)+hop*0.16+(t>EA&&t<FF?0.1*clamp01((t-EA)/2):0);
    u.belly.scale.set(1.05*g,0.95*Math.min(g,1.5),0.75*g*1.15);u.belly.position.z=0.1+(g-1)*0.18;u.body.scale.set(1.28*Math.min(g,1.4),1.04,1.4*Math.min(g,1.3));
    if(t<PK){u.arms[0].rotation.x=-0.5;u.arms[0].rotation.z=-0.2;u.arms[1].rotation.x=-0.4;u.head.rotation.y=Math.sin(Math.max(0,t-HE)*6)*0.35*(t>HE?1:0);if(t>HE)eyesK(sa,0.5)}
    else if(t<S2.t0){u.head.rotation.y=-0.7;eyesW(sa,1.3)}
    else if(t<FF){u.head.rotation.y=0;const k=Math.abs(Math.sin((t-S2.t0)*9));if(t>EA){u.arms[1].rotation.x=-1.5-0.9*k;u.arms[0].rotation.x=-1.2-0.6*(1-k);eyesK(sa,0.3);mood(sa,'open')}else{armUp(sa,1,0.5);eyesW(sa,1.2);mood(sa,'smile')}}
    else{const k=Math.abs(Math.sin(t*12));u.arms[1].rotation.x=-1.5-0.9*k;u.arms[0].rotation.x=-1.2-0.6*(1-k);eyesK(sa,0.35);mood(sa,'open')}
    talkBeard(sa,t,speaking(1,'s2',t));showB(hb,t,HE+0.1,PK);
    // 쿠키 줄어듦, 다음 집에선 다시 산더미
    let eaten=0;if(t>EA&&t<FF)eaten=Math.floor((t-EA)*9);if(t>=FF){const lt=t-FH[Math.max(0,hop-1)];eaten=Math.floor(lt*28)}
    CK.forEach((c,i)=>c.visible=i>=Math.min(CK.length-4,eaten));
    MI.forEach((m,i)=>{let k=1;if(t>EA&&t<FF)k=1-clamp01((t-EA-1.6-i*0.4)/0.4);if(t>=FF){const lt=t-FH[Math.max(0,hop-1)];k=1-clamp01((lt-0.1-i*0.08)/0.1)}setMilk(m,k)});
    if(hop>0)wallMesh.material=lamb(WALLS2[hop%WALLS2.length]);
    // 문틈
    const ok=ease((t-PK)/0.35);dp.rotation.y=0.9*ok;kid.visible=t>PK;resetP(kid);eyesK(kid,1.0);kid.userData.head.rotation.z=0.25;kid.position.x=0.45+0.2*(1-ok);
    if(speaking(1,'k1',t)){kid.userData.eyes.forEach(e=>e.scale.y=0.9+0.1*Math.sin(t*20))}
    if(t>S2.t1){blush(kid,1.6);mood(kid,'smile')}
    // 빨리 감기 플래시
    let fk=0;FH.forEach(x=>{if(t>x-0.05&&t<x+0.15)fk=Math.max(fk,1-Math.abs(t-x-0.03)/0.12)});fl.style.opacity=fk*0.85;
    ff.style.opacity=t>FF?1:0;ff.style.transform=`translateX(-50%) scale(${t>FF?0.95+0.05*Math.sin(t*12):1})`;
    chipPop(ck,t,FF+0.05);if(t>=FF){const lt=Math.min(1,(t-FF)/2.6);const cups=Math.max(1,Math.round(1+Math.pow(lt,1.3)*46));const hs=Math.min(3,1+Math.floor(lt*3));chipSet(ck,`우유 <b>${cups}잔째</b> · 배송 <b>${hs}집</b>`)}
    // 카메라
    if(t<PK){cam.position.set(0.3,2.2,4.6-t*0.1);cam.lookAt(-0.5,1.55,0.2)}
    else if(t<S2.t0){cam.position.set(-1.9,1.55,3.6);cam.lookAt(-3.25,1.15,1.35)}
    else if(t<FF){const d=t-S2.t0;cam.position.set(0.3,2.15,3.6-d*0.08);cam.lookAt(-0.55,1.7,0.1)}
    else{const d=t-FF;cam.position.set(0.6+Math.sin(d*7)*0.05,2.4,5.0+d*0.25);cam.lookAt(-0.55,1.5,0.1)}
    caption(1,t);renderer.render(scene,cam);
  };
};

// ===== S2 크리스마스 아침: 양말 '헐 대박!!' → 문제집·빈 상자·감자 → 창밖 산타 눈물 =====
S[2]=()=>{
  sky('#bfe2ff','#e4f2ff','#fff6ea');
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,sky:0xffffff,ground:0xa08a70,dir:1.3,sun:0xfff4e0,dpos:[3,9,7]});const r=rng(3201);
  const R=livingRoom(scene,{wall:0xfbefe0});R.tv.visible=false;R.tvg.visible=false;R.winMat.color.set(0xbfe6ff);R.fire.visible=false;R.flames.forEach(f=>f.visible=false);
  R.sofa.position.set(0.8,0,-1.6);R.sofa.rotation.y=0;
  const kid=makeKid();scene.add(kid);kid.position.set(0.8,0,0.9);
  const mom=makeMom();mood(mom,'smile');scene.add(mom);mom.position.set(-0.3,0,-0.6);
  const dad=makeNb(1,{shirt:0x7fa6d8,long:false});scene.add(dad);dad.position.set(1.9,0,-0.6);
  const box=giftBox(0x5fb0ff,0xffffff,0.8);scene.add(box);box.position.set(0.15,0,1.2);
  const ITEMS=[sock(),workbook(),openBox(0xd8343c),potato()];ITEMS.forEach(m=>{scene.add(m);m.visible=false});
  const KC=[[0x8fb8f0,0xfbefe0],[0xf5b8c8,0xe3f0e0],[0xb8e0a8,0xe8e0f6],[0xffd27a,0xdfeaf6]];
  const kb=bubT(kid,'헐 대박!!',{y:2.25,size:0.0034,bg:'#fff3b0',fg:'#a35a00'});
  const conf=confetti(scene,60,r,{x:0.8,z:0.9,w:1.6,d:1.2,y:1.6});
  // 바깥 세트: 눈 쌓인 창가에서 들여다보는 산타
  const ex=new THREE.Group();ex.position.set(100,0,0);scene.add(ex);snowGround(ex);
  const hw=new THREE.Mesh(new THREE.BoxGeometry(8,4.5,0.4),lamb(0xe8c9a8));hw.position.set(0,2.25,-1.2);ex.add(hw);
  const wglass=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.4),basic(0xffe6a8));wglass.position.set(0,2.2,-0.99);ex.add(wglass);
  for(const [w2,h2,x,y] of[[0.1,1.5,0,2.2],[1.9,0.1,0,2.2],[2.1,0.18,0,1.45],[2.1,0.14,0,2.95]]){const f=new THREE.Mesh(new THREE.BoxGeometry(w2,h2,0.12),lamb(0xf2ebe0));f.position.set(x,y,-0.95);ex.add(f)}
  const ledge=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.12,0.3),lamb(0xfafcff));ledge.position.set(0,1.5,-0.86);ex.add(ledge);
  const ksil=makeKid();ksil.scale.setScalar(0.45);ksil.position.set(-0.3,1.45,-1.1);ksil.rotation.y=Math.PI;ex.add(ksil);
  const esa=makeSanta();ex.add(esa);esa.position.set(0.55,0,0.1);esa.rotation.y=0.74;
  const tears=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),basic(0x7ec8ff));ex.add(m);m.visible=false;tears.push({m,s:i%2?1:-1,ph:i*0.17})}
  const SN=snowfall(ex,200,r,{w:10,h:7,d:6,z:0.5});
  const eb=bubT(esa,'흑…',{y:2.6,size:0.0018});
  const ck0=chip('AM 7:00 · 크리스마스 아침');const ck=chip('선물 만족도 <b>100%</b> · 이유: 마음이 중요해서');
  const C0=MK('g_chip0'),OP=MK('open'),SO=MK('sock'),MT=MK('mt'),CR=MK('cry'),CK=MK('g_chip');const K2=ln(2,'k2');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const wallMesh=R.g.children[2];
  return t=>{updRoom(R,t);SN.upd(t,0.5);conf(t,SO);
    const shot=t<MT[0]-0.05?0:t<MT[1]-0.05?1:t<MT[2]-0.05?2:3;const st=[0,MT[0],MT[1],MT[2]][shot];const lt=t-st;
    setOutfit(kid,KC[shot][0],KC[shot][0]);wallMesh.material=lamb(KC[shot][1]);
    resetP(kid);const ku=kid.userData;eyesK(kid,0.9);mood(kid,'smile');
    ITEMS.forEach(m=>m.visible=false);box.visible=shot===0;
    const it=ITEMS[shot];const react=shot===0?SO:st+0.15;const up=ease((t-react)/0.25);
    if(t<CR){
      if(shot===0&&t<SO){ku.arms.forEach(a=>a.rotation.x=-0.9);box.userData.lid.position.y=0.5+ease((t-OP)/0.3)*1.2;box.userData.lid.rotation.z=ease((t-OP)/0.3)*1.2;eyesK(kid,t>OP?1.3:0.9)}
      else{armUp(kid,0,up);armUp(kid,1,up);ku.arms[0].rotation.z=-0.25;ku.arms[1].rotation.z=0.25;mood(kid,'open');eyesW(kid,1.4);ku.hip.position.y=0.8+Math.abs(Math.sin(t*9))*0.08*up;
        it.visible=true;if(shot===2){it.position.set(kid.position.x,1.55+0.6*up,kid.position.z+0.2);it.rotation.set(0.5,0,0)}else{it.position.set(kid.position.x,2.0+0.1*up,kid.position.z+0.15);it.rotation.set(0,0,0)}}
      if(shot===0&&t>=SO){box.userData.lid.position.y=1.7;box.userData.lid.visible=false}
    }
    showB(kb,t,react,shot===3?CR-0.2:st+(shot===0?K2.t1-st:1.25));if(shot>0&&t>st&&t<st+0.1)scaleBubble(kb,0);
    [mom,dad].forEach((p,i)=>{resetP(p);lookAt2(p,kid.position.x,kid.position.z);if(t>react+0.3)clapPose(p,t,i*2);mood(p,'smile')});
    // 바깥: 눈물
    resetP(esa);const eu=esa.userData;eyesK(esa,0.25);mood(esa,'smile');
    if(t>CR+0.3){eu.arms[1].rotation.x=-1.6;eu.arms[1].rotation.z=0.5+0.12*Math.sin(t*6);eu.head.rotation.x=-0.05+0.05*Math.sin(t*3)}
    tears.forEach(q=>{const d=((t-CR)*1.2+q.ph)%1;q.m.visible=t>CR+0.1;const hp=new THREE.Vector3(q.s*0.09,2.1-d*0.5,0.33).applyMatrix4(esa.matrixWorld);q.m.position.copy(hp).sub(ex.position);q.m.position.x+=q.s*d*0.15});
    chipPop(ck0,t,C0);if(t>MT[0]-0.1)ck0.style.opacity=0;chipPop(ck,t,CK);
    if(t<CR){const A=[[1.0,2.0,4.4],[2.4,1.9,3.6],[-0.8,1.8,3.7],[0.9,1.5,3.2]][shot];cam.position.set(A[0],A[1],A[2]-lt*0.12);cam.lookAt(0.6,1.55,0.6);
      if(shot===0&&t>K2.t1)cam.position.set(1.0,2.6,5.6)}
    else{const d=t-CR;cam.position.set(100+2.3-d*0.05,1.95,2.0-d*0.04);cam.lookAt(100+0.35,1.95,-0.4)}
    caption(2,t);renderer.render(scene,cam);
  };
};

// ===== S3 반찬 싸 주기 → 썰매 이륙 실패 =====
S[3]=()=>{
  sky('#3a2a2a','#5a3e36','#7a5444');
  const scene=roomScene();const r=rng(3301);
  const R=livingRoom(scene,{wall:0xf0e2ef});R.tv.visible=false;R.tvg.visible=false;R.sofa.visible=false;
  const sa=makeSanta();scene.add(sa);const mom=makeMom();scene.add(mom);mood(mom,'smile');
  const arm=new THREE.Group();scene.add(arm);const AB=[];for(let i=0;i<6;i++){const b=i===5?tangerines():banchan(i);b.visible=false;arm.add(b);b.position.y=i*0.18;b.rotation.y=(i%2)*0.15;AB.push(b)}
  const fly=banchan(2);scene.add(fly);fly.visible=false;
  // 바깥 세트
  const ex=new THREE.Group();ex.position.set(100,0,0);scene.add(ex);snowGround(ex);
  const hs=makeXHouse(r,{w:3.6,h:2.4,cx:0.8});hs.position.set(-2.2,0,-3.4);ex.add(hs);
  const hs2=makeXHouse(r,{w:3.0,h:2.2});hs2.position.set(3.4,0,-4.2);ex.add(hs2);
  [[-5.5,-2],[5.6,-1.4]].forEach(([x,z],i)=>{const tr=xmasTree(0.9,{snow:true,lights:true,seed:i+11});tr.position.set(x,0,z);ex.add(tr)});
  const sl=makeSleigh();sl.position.set(0.6,0,0.2);sl.rotation.y=Math.PI/2-0.25;ex.add(sl);sl.userData.sack.visible=false;sl.children.forEach(c=>{});
  const deer=[];[[-0.5,2.4],[0.5,2.4],[-0.5,4.0],[0.5,4.0]].forEach(([x,z])=>{const d=makeDeer();d.position.set(x,0,z);d.scale.setScalar(0.85);sl.add(d);deer.push(d)});
  const esa=makeSanta();seatInSleigh(esa,sl);esa.position.z=0.35;
  const tower=new THREE.Group();tower.position.set(0,0.82,-0.55);sl.add(tower);const TB=[];
  for(let i=0;i<22;i++){const b=banchan(i);b.position.set(((i%3)-1)*0.36,Math.floor(i/3)*0.24,0);b.rotation.y=(r()-0.5)*0.3;b.visible=false;tower.add(b);TB.push(b)}
  const tg=tangerines();tg.scale.setScalar(1.3);tower.add(tg);tg.visible=false;
  const SN=snowfall(ex,260,r,{w:14,h:9,d:10});
  const sw=bubT(esa,'끄응…',{y:2.6,size:0.003});const fb=bubT(esa,'!!',{y:2.6,size:0.0034});
  const ck=chip('선물 <b>-1,000개</b> · 반찬통 <b>+1,000개</b>');
  const BW=MK('b_walk'),GV=MK('give'),OUT=MK('b_out'),STK=MK('stack'),CK=MK('b_chip'),TRY=MK('try'),FAIL=MK('fail');const M1=ln(3,'m1'),S3=ln(3,'s3');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  return t=>{updRoom(R,t);SN.upd(t);
    // 실내
    resetP(sa);const u=sa.userData;eyesK(sa,0.75);mood(sa,'smile');resetP(mom);
    const sx=Math.min(3.6,1.6+Math.max(0,t-BW)*2.4);const stop=t>M1.t0;const SXp=stop?Math.min(sx,1.6+(M1.t0-BW)*2.4):sx;
    sa.position.set(SXp,0,0.9);sa.rotation.y=stop?-Math.PI/2+0.2:Math.PI/2;if(!stop)walkPose(sa,t*7,0.4);
    const mk=ease((t-M1.t0+0.3)/0.5);mom.position.set(-1.0+(SXp-0.95+1.0)*mk,0,0.95);lookAt2(mom,sa.position.x,sa.position.z);if(mk<1&&t>M1.t0-0.3)walkPose(mom,t*9,0.5);
    const NB=GV.filter(x=>t>=x).length;
    if(t>GV[0]-0.2){u.arms.forEach(a=>{a.rotation.x=-1.3;a.rotation.z=0});mom.userData.arms.forEach(a=>a.rotation.x=-1.0-0.4*Math.abs(Math.sin(t*6)))}
    arm.position.set(sa.position.x-0.48,1.0,sa.position.z+0.05);arm.rotation.y=sa.rotation.y;AB.forEach((b,i)=>{b.visible=i<NB;const k=pop((t-GV[i])/0.2);b.scale.setScalar(i<NB?k:0)});
    talkMouth(mom,t,speaking(3,'m1',t));talkBeard(sa,t,speaking(3,'s3',t));if(speaking(3,'s3',t))eyesK(sa,0.35);
    // 바깥
    const NT=STK.filter(x=>t>=x).length;TB.forEach((b,i)=>{const show=i<Math.min(22,NT*2+2);b.visible=t>OUT&&show});tg.visible=NT>=10;tg.position.set(0,Math.floor(22/3)*0.24+0.1,0);
    fly.visible=false;STK.forEach((x,i)=>{const d=t-x+0.32;if(d>0&&d<0.32){fly.visible=true;const k=d/0.32;const p0=new THREE.Vector3(100-2.2,1.0,-1.9),p1=new THREE.Vector3(100+0.6,2.5,0.2);fly.position.lerpVectors(p0,p1,k);fly.position.y+=Math.sin(k*Math.PI)*1.5;fly.rotation.z=k*5}});
    let sh=0,sink=0;if(t>TRY&&t<FAIL){sh=Math.sin(t*40)*0.03;deer.forEach((d,i)=>gallop(d,t,i))}else deer.forEach((d,i)=>gallop(d,t,i,0.05));
    if(t>TRY)sink=Math.min(0.18,(t-TRY)*0.12);if(t>FAIL)sink=0.18+0.05*Math.max(0,1-(t-FAIL)*4);
    sl.position.set(0.6+sh,-sink,0.2);tower.rotation.z=t>FAIL?Math.sin((t-FAIL)*10)*0.06*Math.exp(-(t-FAIL)*2):sh*0.6;
    resetP(esa);sitPose(esa);esa.userData.legs.forEach(l=>l.rotation.x=-1.35);esa.userData.arms.forEach(a=>a.rotation.x=t>TRY?-1.6:-1.1);eyesK(esa,t>TRY&&t<FAIL?0.2:0.75);if(t>FAIL)eyesW(esa,1.4);
    showB(sw,t,TRY+0.1,FAIL);showB(fb,t,FAIL);
    chipPop(ck,t,CK);if(t>FAIL)chipSet(ck,'반찬통 <b>+1,000개</b> · 썰매 이륙 <b>실패</b>');
    if(t<OUT){bgEl.style.background='linear-gradient(#3a2a2a,#5a3e36 55%,#7a5444)';
      const mx=t<M1.t0+0.3?SXp-0.5:(SXp+mom.position.x)/2;if(t<S3.t0-0.2){cam.position.set(mx+0.3,2.5,6.2);cam.lookAt(mx,1.6,0.8)}else{cam.position.set(SXp-0.1,2.2,3.7);cam.lookAt(SXp-0.4,1.8,0.9)}}
    else{nightSky();const d=t-OUT;cam.position.set(100+4.6-d*0.1,3.0+d*0.08,6.6-d*0.08);cam.lookAt(100+0.2,2.2,-0.5)}
    caption(3,t);renderer.render(scene,cam);
  };
};

// ===== S4 이웃 릴레이 =====
S[4]=()=>{
  nightSky();
  const scene=nightScene();const r=rng(3401);snowGround(scene);scene.fog=new THREE.Fog(0x8aa2d8,30,90);
  const stars=starField(scene,200,r,{w:140,h:50,y0:10,z:-50});
  const HP=[[-4.2,-3.5],[4.2,-3.5],[-4.4,2.2],[4.4,2.2]];
  const hs=HP.map(([x,z],i)=>{const h=makeXHouse(r,{w:3.0,h:2.2});h.position.set(x,0,z);h.rotation.y=x<0?Math.PI/2:-Math.PI/2;scene.add(h);return h});
  for(let z=-12;z<-6;z+=3)for(const x of[-4.4,4.4]){const h=makeXHouse(r,{w:2.6,h:2.0});h.position.set(x,0,z);h.rotation.y=x<0?Math.PI/2:-Math.PI/2;scene.add(h)}
  const sl=makeSleigh();sl.position.set(0,-0.15,-0.6);sl.rotation.y=0.2;scene.add(sl);sl.userData.sack.visible=false;
  const deer=[[-0.5,2.4],[0.5,2.4],[-0.5,4.0],[0.5,4.0]].map(([x,z])=>{const d=makeDeer();d.position.set(x,0,z);d.scale.setScalar(0.85);sl.add(d);d.rotation.x=0.05;return d});
  const tower=new THREE.Group();tower.position.set(0,0.82,-0.55);sl.add(tower);for(let i=0;i<21;i++){const b=banchan(i);b.position.set(((i%3)-1)*0.36,Math.floor(i/3)*0.24,0);tower.add(b)}
  const sack=new THREE.Mesh(new THREE.SphereGeometry(0.5,24,18),smooth(0x8a5a3a));sack.position.set(0.9,0.5,0.5);scene.add(sack);
  const sa=makeSanta();scene.add(sa);sa.position.set(0.9,0,1.3);sa.rotation.y=-0.3;
  const sb=bubT(sa,'후…',{y:2.6,size:0.0026});
  // 이웃: 집마다 4명씩 줄을 서서 썰매→집으로 선물 릴레이
  const lines=HP.map(([hx,hz],j)=>{const ppl=[];const door=new THREE.Vector3(hx+(hx<0?1.55:-1.55),0,hz);const src=new THREE.Vector3(0.9,0,0.5);
    for(let i=0;i<4;i++){const p=makeNb(j*4+i);p.scale.setScalar(0.95);scene.add(p);const k=(i+1)/5;const pos=new THREE.Vector3().lerpVectors(src,door,k);ppl.push({p,pos,b:bubE(p,{y:2.15,size:0.0028}),i})}
    const boxes=[];for(let i=0;i<3;i++){const b=giftBox([0xd8343c,0x5fb0ff,0x5fd38a][(i+j)%3],GOLD,0.55);scene.add(b);boxes.push(b)}
    return {ppl,door,src,boxes,j}});
  const nb=makeNb(5,{shirt:0x9cc3ec,long:false});scene.add(nb);nb.position.set(-1.0,0,2.2);const nbb=bubE(nb,{y:2.2,size:0.0018});
  const ck0=chip('PM 11:50 · 배송 마감 <b>10분 전</b>');const ck=chip('산타가 배송 <b>12집</b> · 이웃이 배송 <b>20억 집</b>');
  const C0=MK('r_chip0'),SG=MK('sigh'),WN=MK('win'),RO=MK('r_out'),RL=MK('relay'),CK=MK('r_chip');const B1=ln(4,'b1');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  return t=>{
    deer.forEach((d,i)=>gallop(d,t,i,0.04));
    resetP(sa);const u=sa.userData;eyesK(sa,0.5);
    if(t<RL){u.hip.position.y=0.8-0.06*Math.sin(clamp01((t-SG)/0.8)*Math.PI);u.head.rotation.x=t>SG?0.25:0;mood(sa,'flat')}
    else{lookAt2(sa,-2,-2);clapPose(sa,t);eyesK(sa,0.25);mood(sa,'smile')}
    showB(sb,t,SG,B1.t0);
    lines.forEach(L=>{L.ppl.forEach(q=>{const p=q.p;resetP(p);const appear=WN[L.j]+q.i*0.04;p.visible=t>appear;
        const atDoor=L.door.clone();const k=ease((t-RO-q.i*0.08)/1.2);p.position.lerpVectors(atDoor,q.pos,k);
        if(k>0&&k<1)walkPose(p,t*9+q.i,0.5);p.scale.setScalar(0.95*pop((t-appear)/0.3));
        if(k<=0)lookAt2(p,sa.position.x,sa.position.z);else{const dir=L.door.clone().sub(L.src);p.rotation.y=Math.atan2(dir.x,dir.z)+Math.PI/2;}
        if(t>RL){const ph=(t-RL)*3.6+q.i*0.9;p.userData.arms.forEach(a=>a.rotation.x=-1.2-0.3*Math.sin(ph))}
        showB(q.b,t,appear+0.2,B1.t0-0.1)});
      L.boxes.forEach((b,i)=>{b.visible=t>RL+0.1;if(!b.visible)return;const lt=((t-RL)*0.75+i/3)%1;const pp=new THREE.Vector3().lerpVectors(L.src,L.door,lt);b.position.set(pp.x,1.25+Math.abs(Math.sin(lt*Math.PI*5))*0.25,pp.z);b.rotation.y=lt*6})});
    // 말하는 이웃
    resetP(nb);lookAt2(nb,sa.position.x,sa.position.z);nb.visible=t>WN[0];if(speaking(4,'b1',t)){talkMouth(nb,t,true);nb.userData.arms[1].rotation.x=-1.3}else mood(nb,'smile');showB(nbb,t,WN[0]+0.2,B1.t0-0.1);
    if(t>RO){const k=ease((t-RO)/1.0);nb.position.set(-1.0+k*0.3,0,2.2-k*0.4)}
    chipPop(ck0,t,C0);if(t>CK-0.1)ck0.style.opacity=0;chipPop(ck,t,CK);
    if(t<B1.t0-0.1){cam.position.set(2.6,2.6,7.0-t*0.2);cam.lookAt(0.3,1.6,0.0)}
    else if(t<RL-0.2){cam.position.set(0.55,2.05,1.5);cam.lookAt(-1.0,1.85,2.2)}
    else{const d=t-RL;cam.position.set(1.0+d*0.2,10.5+d*0.3,8.8);cam.lookAt(0,0.5,-0.8)}
    caption(4,t);renderer.render(scene,cam);
  };
};

// ===== S5 엔딩: 답장 1년 → '다 했다!' → 12월 24일 출동 =====
S[5]=()=>{
  sky('#3a2a2a','#5a3e36','#7a5444');
  const scene=roomScene();const r=rng(3501);
  const R=livingRoom(scene,{wall:0xd9e6f0});R.tv.visible=false;R.tvg.visible=false;R.sofa.rotation.y=0;R.sofa.position.set(1.0,0,0.6);
  const SN=snowfall(scene,90,r,{w:1.7,h:1.5,z:-3.0,d:0.01,y0:2.2,size:0.06});SN.p.position.x=-4.6;
  const sa=makeSanta();scene.add(sa);
  const phone=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x1d1d22));sa.userData.arms[1].add(phone);phone.position.set(0,-0.66,0.08);phone.rotation.x=-0.4;
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.13,0.26),basic(0xbfd8ff));scr.position.z=0.017;phone.add(scr);
  const elf=makeElf({shirt:0x4caf6a,pants:0xd94848,hat:0x3f9e5c,long:true});scene.add(elf);mood(elf,'smile');
  const qb=bubT(sa,'…?',{y:2.65,size:0.0026});const db=bubT(sa,'끝!',{y:2.6,size:0.0024,bg:'#fff3b0',fg:'#a35a00'});
  // 휴대폰 UI
  const ph=document.createElement('div');ph.className='phone';ph.style.top='170px';ph.style.height='900px';ph.style.left='170px';ph.style.width='740px';
  ph.innerHTML=`<div class="screen"><div class="sbar"><span>12:26</span><span>▮▮▮ 2%</span></div><div class="head">메시지&nbsp;<span class="badge" style="margin-left:auto;background:#e2335a;color:#fff;border-radius:999px;padding:2px 18px;font-size:32px">+999</span></div><div class="msgs"></div></div>`;
  ui.appendChild(ph);const msgs=ph.querySelector('.msgs'),badge=ph.querySelector('.badge');
  const WHO2=['민지네','서준이네','하윤 엄마','도윤이','지아네','이준 아빠','수아네','예준이'];const AC=['#f2a6b8','#9cc3ec','#a8dcb4','#f4cf7a','#c9b3e6','#f5b38a','#8fd3d6','#e7a0a0'];
  const ROWS=[];for(let i=0;i<14;i++){const me=i%2===1;const d=document.createElement('div');d.className='row'+(me?' me':'');
    d.innerHTML=me?`<div class="b">네~ 덕분에요♡</div>`:`<div class="av" style="background:${AC[(i>>1)%8]};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:30px">${WHO2[(i>>1)%8][0]}</div><div><div class="who">${WHO2[(i>>1)%8]}</div><div class="b">잘 들어가셨어요? ㅎㅎ</div></div>`;
    d.style.display='none';msgs.appendChild(d);ROWS.push(d)}
  const cal=document.createElement('div');cal.style.cssText='position:absolute;right:60px;top:1090px;width:210px;border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 14px 34px rgba(0,0,0,.3);text-align:center;opacity:0';
  cal.innerHTML='<div class="cm" style="background:#e2335a;color:#fff;font-weight:900;font-size:40px;padding:6px 0">12월</div><div class="cd" style="font-weight:900;font-size:110px;color:#2b2b3a;line-height:1.15">26</div>';ui.appendChild(cal);const cm=cal.querySelector('.cm'),cd=cal.querySelector('.cd');
  const ck=chip('답장 <b>1</b> / 20억');ck.style.top='1080px';ck.style.left='42%';
  const dim=document.createElement('div');dim.className='fl';dim.style.background='rgba(18,22,48,1)';ui.appendChild(dim);
  const e0=document.createElement('div');e0.className='end0';e0.textContent='크리스마스 특별편';ui.appendChild(e0);
  const e1=document.createElement('div');e1.className='end1 out';e1.textContent='다음 편은?';ui.appendChild(e1);
  const e2=document.createElement('div');e2.className='end2 out';e2.textContent='팔로우하고 기다려 주세요';ui.appendChild(e2);
  const BZ=MK('buzz'),TL=MK('tl'),TLE=MK('tle'),DONE=MK('done'),AL=MK('alarm'),CD=MK('card');const E1=ln(5,'e1');
  const SEAS=[[0x2a3a6a,0xffffff],[0x9fd6ff,0xffb3d1],[0x7fd0ff,0x8be07a],[0x6fa8d8,0xff9a3a],[0x2a3a6a,0xffffff]];
  const MON=['12월','3월','6월','9월','12월'];
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,200);
  return t=>{updRoom(R,t);
    // 계절 타임랩스(창밖)
    const sp=clamp01((t-TL)/(TLE-TL));const si=Math.min(4,Math.floor(sp*4.999));const sk=sp*4-Math.floor(sp*4);
    const c0=SEAS[si],c1=SEAS[Math.min(4,si+1)];R.winMat.color.set(mixc(c0[0],c1[0],t>TL&&t<TLE?ease(sk*2-1):0));SN.p.material.color.set(c0[1]);SN.upd(t,t>TL&&t<TLE?3:0.5);
    // 산타
    resetP(sa);const u=sa.userData;eyesK(sa,0.6);sa.position.set(1.0,0,0.75);sa.rotation.y=0;sitPose(sa);u.legs.forEach(l=>l.rotation.x=-1.35);
    phone.visible=t<DONE;mood(sa,'smile');
    if(t<DONE){u.arms[1].rotation.x=-1.3;u.arms[0].rotation.x=-1.2+0.1*Math.sin(t*20);u.head.rotation.x=0.3;
      if(t>TL){const age=sp;u.hat.rotation.z=age*0.25;eyesK(sa,0.6-0.35*age)}}
    else if(t<AL){const k=pop((t-DONE)/0.3);armUp(sa,0,k);armUp(sa,1,k);eyesW(sa,1.2);mood(sa,'open')}
    else{const k=ease((t-AL)/0.2);armUp(sa,0,1-k*0.5);armUp(sa,1,1-k*0.5);eyesW(sa,1.6);mood(sa,'flat');u.head.rotation.y=-0.6*k}
    talkBeard(sa,t,speaking(5,'s4',t));showB(db,t,DONE+0.05,AL);showB(qb,t,E1.t0+0.6,CD);
    // 요정 등장(문 쪽)
    const ek=ease((t-AL-0.15)/0.6);elf.visible=t>AL+0.1;elf.position.set(5.6-ek*3.0,0,1.2);elf.rotation.y=-Math.PI/2+0.4*ek;resetP(elf);if(ek<1)walkPose(elf,t*9,0.5);else{wave(elf,t,1)}
    talkMouth(elf,t,speaking(5,'e1',t));
    // 휴대폰 메시지(점점 빨라짐)
    const show=t<DONE+0.2;ph.style.display=show?'block':'none';
    const nShown=Math.floor(Math.min(14,1+Math.max(0,t-0.2)*1.6+Math.max(0,t-TL)*6));ROWS.forEach((d,i)=>{d.style.display=i<nShown?'flex':'none'});
    if(t>TL){const cyc=Math.floor((t-TL)*14)%2;ROWS.forEach((d,i)=>{d.style.display=(i>=14-8+cyc&&i<14)||i<nShown&&i>=nShown-8?'flex':'none'})}
    const k=pop((t-0.15)/0.3);ph.style.transform=`scale(${0.6+0.4*k})`;ph.style.opacity=clamp01(t/0.15);
    badge.textContent=t>DONE-0.3?'0':'+999';
    let n=1;if(t>0.3)n=Math.floor(Math.pow(clamp01((t-0.3)/(DONE-0.3)),3)*2e9);const fmt=n>=1e8?(n/1e8).toFixed(n>=1.95e9?0:1).replace('.0','')+'억':n>=1e4?Math.floor(n/1e4).toLocaleString()+'만':n.toLocaleString();
    chipSet(ck,t>=DONE?'답장 <b>20억</b> / 20억 ✔':`답장 <b>${fmt}</b> / 20억`);chipPop(ck,t,0.4);if(t>AL)ck.style.opacity=0;
    // 달력
    cal.style.opacity=t>0.3&&t<CD?1:0;
    const mi=Math.min(4,Math.floor(sp*4.999));let mtxt=MON[mi],dtxt=t<TL?'26':String(1+Math.floor((sp*4-Math.floor(sp*4))*28));
    if(t>=TLE){mtxt='12월';dtxt=t>AL?'24':'23'}
    if(cm.textContent!==mtxt)cm.textContent=mtxt;if(cd.textContent!==dtxt)cd.textContent=dtxt;
    const ak=t>AL?pop((t-AL)/0.3):0;cal.style.transform=t>AL?`translate(${-300*ease((t-AL)/0.3)}px,${-500*ease((t-AL)/0.3)}px) scale(${1+1.2*ak})`:'none';cd.style.color=t>AL?'#e2335a':'#2b2b3a';
    // 엔딩 카드
    const ek2=clamp01((t-CD)/0.3);dim.style.opacity=ek2*0.82;
    e0.style.opacity=ek2;e0.style.transform=`translateX(-50%) scale(${pop((t-CD)/0.3)})`;
    e1.style.opacity=clamp01((t-CD-0.15)/0.15);e1.style.transform=`scale(${pop((t-CD-0.15)/0.35)})`;e2.style.opacity=clamp01((t-CD-0.45)/0.2);e2.style.transform=`scale(${pop((t-CD-0.45)/0.35)})`;
    if(t>CD)cal.style.opacity=0;
    // 카메라
    if(t<DONE){cam.position.set(1.0,2.5,4.6);cam.lookAt(0.6,2.55,-0.3)}
    else if(t<AL){cam.position.set(1.0,2.3,4.2);cam.lookAt(1.0,2.05,0.7)}
    else{const d=Math.min(t-AL,4);cam.position.set(1.8+d*0.05,2.5,6.0);cam.lookAt(1.8,1.6,0.8)}
    caption(5,t,CD);renderer.render(scene,cam);
  };
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
