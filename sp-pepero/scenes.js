// ---------- 공용 ----------
const S=[];
const _a=new THREE.Vector3(),_b=new THREE.Vector3();
function addFace(p){const h=p.userData.head;
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.013,4,10,Math.PI),basic(0x5a2a2a));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.016,0.01),basic(0x5a2a2a));fl.position.set(0,0.145,0.248);h.add(fl);
  p.userData.smile=sm;p.userData.flat=fl;setFace(p,false);return p}
function setFace(p,smile){p.userData.smile.visible=smile;p.userData.flat.visible=!smile}
function fem(r,o){const p=makePerson(r,{shirt:o.shirt,pants:o.pants??0x55506a,hair:o.hair??0x5a3826});const u=p.userData,h=u.head;
  const m=lamb(o.hair??0x5a3826);h.children[1].visible=false;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.272,16,12,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.42;h.add(cap);
  const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,14,8),m);bang.scale.set(1.15,0.36,0.62);bang.position.set(0.03,0.43,0.12);bang.rotation.z=0.22;h.add(bang);
  const cg=(a,l)=>new THREE.CapsuleGeometry(a,l,4,10);
  if(o.bob){const back=new THREE.Mesh(cg(0.25,0.1),m);back.scale.set(1.18,1,0.78);back.position.set(0,0.17,-0.06);h.add(back);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(cg(0.085,0.14),m);sd.position.set(sx*0.23,0.14,0.07);h.add(sd)}}
  else{const back=new THREE.Mesh(cg(0.2,0.5),m);back.scale.set(1.3,1,0.55);back.position.set(0,0.0,-0.13);h.add(back);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(cg(0.07,0.42),m);sd.position.set(sx*0.225,0.06,0.05);sd.rotation.z=sx*0.06;h.add(sd)}}
  for(const sx of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.018,0.02),lamb(0x1a1a1a));l.position.set(sx*0.09,0.29,0.236);h.add(l)}
  const sk=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.36,0.36,12),lamb(o.skirt??new THREE.Color(o.shirt).lerp(new THREE.Color(0xffffff),0.3).getHex()));sk.position.y=-0.14;u.hip.add(sk);
  return p}
const SH=[0x6c8ebf,0xd98c8c,0x8cc9a0,0xe0c070,0xa58cd0,0x7fb7c9,0xe39a6b,0xc7a3c9,0x90b86c,0xf28b8b,0x8bd1f2];
function person(r,o={}){const shirt=o.shirt??pick(r,SH);const p=o.f?fem(r,{...o,shirt}):makePerson(r,{shirt,pants:o.pants});addFace(p);setFace(p,o.smile??true);return p}
function boxTex(col,back){return canvasTex(128,176,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);
  x.fillStyle='#fff';x.fillRect(0,18,w,34);x.fillStyle=col;x.font=`900 28px ${FONT}`;x.textAlign='center';x.fillText('11.11',w/2,46);
  if(back){x.fillStyle='#fff';x.fillRect(12,110,w-24,40)}
  else{x.lineCap='round';for(let i=0;i<4;i++){x.strokeStyle='#e8c08a';x.lineWidth=9;x.beginPath();x.moveTo(22+i*24,165);x.lineTo(40+i*24,120);x.stroke();
    x.strokeStyle='#5a3220';x.beginPath();x.moveTo(40+i*24,120);x.lineTo(62+i*24,68);x.stroke()}}})}
const BOXT={};
function pepBox(col='#e8303a'){const k=col;if(!BOXT[k])BOXT[k]=[new THREE.MeshLambertMaterial({map:boxTex(col,false)}),new THREE.MeshLambertMaterial({map:boxTex(col,true)}),lamb(new THREE.Color(col).getHex())];
  const M=BOXT[k];const b=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.42,0.09),[M[2],M[2],M[2],M[2],M[0],M[1]]);const g=new THREE.Group();g.add(b);g.userData.body=b;return g}
function stick(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.024,0.024,0.3,6),lamb(0x5a3220));c.position.y=0.05;g.add(c);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(0.021,0.021,0.1,6),lamb(0xe6c08a));b.position.y=-0.15;g.add(b);return g}
function handW(p,side,out){p.userData.arms[side].children[1].getWorldPosition(out);return out}
function holdAt(scene,obj,p,side,dz=0.14,dy=0.08){scene.updateMatrixWorld();handW(p,side,obj.position);obj.position.z+=dz;obj.position.y+=dy}
function face(p,deg){p.rotation.y=deg}
// 카드형 텍스트 (여러 줄 가능, 캐시)
const CARD={};
function cardTex(text,o){const key=text+'|'+(o.bg||'')+(o.fg||'')+(o.fs||0);if(CARD[key])return CARD[key];
  const fs=o.fs||60,lines=text.split('\n');const c=document.createElement('canvas'),x=c.getContext('2d');x.font=`900 ${fs}px ${FONT}`;
  const tw=Math.max(...lines.map(l=>x.measureText(l).width),fs);const pad=fs*0.5,lh=fs*1.3;
  c.width=Math.ceil(tw+pad*2)+8;c.height=Math.ceil(lines.length*lh+pad*1.2)+12;x.translate(4,4);
  x.fillStyle='rgba(0,0,0,0.2)';rr(x,0,6,c.width-8,c.height-14,o.r??24);x.fill();
  x.fillStyle=o.bg||'#fff';rr(x,0,0,c.width-8,c.height-14,o.r??24);x.fill();
  if(o.border){x.lineWidth=6;x.strokeStyle=o.border;rr(x,3,3,c.width-14,c.height-20,o.r??24);x.stroke()}
  x.fillStyle=o.fg||'#333';x.textAlign=o.align||'center';x.textBaseline='middle';x.font=`900 ${fs}px ${FONT}`;
  lines.forEach((l,i)=>x.fillText(l,o.align==='left'?pad:(c.width-8)/2,pad*0.6+lh*(i+0.5)));
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return CARD[key]={t,w:c.width,h:c.height}}
function card(text,o={}){const s=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false}));s.renderOrder=10;s.center.set(0.5,0);s.userData.o=o;setCard(s,text);scaleBubble(s,0);return s}
function setCard(s,text){if(s.userData.txt===text)return;const o=s.userData.o;const {t,w,h}=cardTex(text,o);s.material.map=t;s.material.needsUpdate=true;const k=o.size||0.0042;s.userData.base=[w*k,h*k];s.scale.set(w*k,h*k,1);s.userData.txt=text}
// 말풍선 (방 로컬 좌표)
function B(R,x,y,text,o={}){const b=makeBubble(text,{bg:o.bg||R.light,fg:o.fg||'#2b2b3a',fs:o.fs||64,size:o.size||0.005});b.renderOrder=11;b.position.set(x,y,o.z??0.9);R.g.add(b);scaleBubble(b,0);return b}
function popB(b,lt,t0,t1=99){scaleBubble(b,lt<t0||lt>t1?0:pop((lt-t0)/0.25))}
// 건네주기: 준 사람 오른팔(1) → 받는 사람 왼팔(0)
function handover(R,gv,m,box,lt,o={}){
  const a=ease(lt/0.22),back=1-ease((lt-0.55)/0.25);gv.userData.arms[1].rotation.x=-1.35*Math.min(a,back);
  if(o.recv!==false)m.userData.arms[0].rotation.x=-(o.hold??1.15)*ease((lt-0.12)/0.25);
  R.scene.updateMatrixWorld();const k=ease((lt-0.28)/0.25);
  handW(gv,1,_a);handW(m,0,_b);box.position.lerpVectors(_a,_b,k);box.position.z+=0.14;box.position.y+=0.08;box.rotation.set(0,0,0);
}
// ---------- 아파트 단면 (4층 × 4칸, 지그재그 순서) ----------
const RW=6,RH=4.5,RD=4,GX=6.3,GY=4.8;
function roomPos(i){const row=Math.floor(i/4),w=i%4,col=row%2==0?w:3-w;return [(col-1.5)*GX,(3-row)*GY]}
function camPose(i){const [x,y]=roomPos(i);return {p:new THREE.Vector3(x,y+2.4,12.4),l:new THREE.Vector3(x,y+1.8,0)}}
const lighten=(hex,k)=>'#'+new THREE.Color(hex).lerp(new THREE.Color(0xffffff),k).getHexString();
function plate(text,col){const t=canvasTex(512,128,(x,w,h)=>{x.fillStyle='#ffffff';rr(x,4,4,w-8,h-8,40);x.fill();x.fillStyle=col;x.font=`900 92px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,w/2,h/2+6)});
  return new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.4),new THREE.MeshBasicMaterial({map:t,transparent:true}))}
function buildRoom(scene,i,act){
  const [x,y]=roomPos(i);const [name,col]=TYPES[i];const g=new THREE.Group();g.position.set(x,y,0);scene.add(g);
  const wood=lamb(0xd9b98f),fac=lamb(0xf4ece0);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(GX,0.3,RD+0.4),fac);fl.position.set(0,-0.15,0);g.add(fl);
  const fl2=new THREE.Mesh(new THREE.BoxGeometry(RW,0.02,RD),wood);fl2.position.set(0,0.011,0);g.add(fl2);
  for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.BoxGeometry(GX-RW,RH,RD+0.4),fac);w.position.set(s*GX/2,RH/2,0);g.add(w)}
  const wallCol=lighten(col,0.62);
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(RW,RH),lamb(new THREE.Color(wallCol).getHex()));bw.position.set(0,RH/2,-RD/2);g.add(bw);
  const strip=new THREE.Mesh(new THREE.PlaneGeometry(RW,0.5),lamb(new THREE.Color(lighten(col,0.35)).getHex()));strip.position.set(0,0.25,-RD/2+0.01);g.add(strip);
  
  const R={scene,g,i,col,light:lighten(col,0.75),act,r:rng(500+i*37),x,y,wall:bw};
  const upd=ROOM[i](R);upd(0);return {R,upd};
}
function building(scene,o={}){const showSign=o.sign;
  const top=new THREE.Mesh(new THREE.BoxGeometry(GX*4+0.4,0.6,RD+0.6),lamb(0xe8dccb));top.position.set(0,4*GY-0.15,0);scene.add(top);
  const sign=card('빼빼로 아파트',{fs:70,bg:'#e8303a',fg:'#fff',size:0.012});sign.material.depthTest=true;sign.position.set(0,4*GY+0.2,0);scene.add(sign);scaleBubble(sign,showSign?1:0);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(400,400),lamb(o.ground??0xb6cf8a));g.rotation.x=-Math.PI/2;g.position.y=-0.3;scene.add(g);
  const walk=new THREE.Mesh(new THREE.PlaneGeometry(GX*4+4,4),lamb(0xd8d2c6));walk.rotation.x=-Math.PI/2;walk.position.set(0,-0.29,RD/2+2);scene.add(walk);
  const r=rng(9);for(let k=0;k<12;k++){const t=new THREE.Group();const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,1.6,6),lamb(0x7a5a3c));tr.position.y=0.8;t.add(tr);
    const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(1.1,0),lamb(o.tree??0x6fae6a));cr.position.y=2.2;t.add(cr);const side=k%2?1:-1;t.position.set(side*(GX*2+2+r()*8),-0.3,-3-r()*10);scene.add(t)}
}
function world(active,o={}){
  const scene=new THREE.Scene();addLights(scene,{hemi:o.hemi??1.55,dir:o.dir??1.5,dpos:[3,10,14]});
  building(scene,o);const rooms=[];for(let i=0;i<16;i++)rooms.push(buildRoom(scene,i,i===active));return {scene,rooms};
}
const SKY='linear-gradient(#8fc4f5,#cfe6ff 50%,#fff3e6)';
// ---------- 방별 장면 (lt = 방 안 시간, 0부터) ----------
const ROOM=[];
// 1 ENTP: 가래떡데이
ROOM[0]=R=>{const gv=person(R.r,{f:true});gv.position.set(-1.6,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0xffa94d});m.position.set(0.9,0,0.5);face(m,-0.45);R.g.add(m);
  const box=pepBox();R.scene.add(box);
  const tt=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.62,10),lamb(0xfbf8f0));tt.rotation.x=Math.PI/2;m.userData.arms[1].add(tt);tt.position.set(0,-0.62,0.2);
  const b1=B(R,0.6,2.45,'오늘 가래떡데이인데요?'),b2=B(R,-1.6,2.45,'…',{fs:80});
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,lt);
    const up=ease((lt-0.75)/0.25);m.userData.arms[1].rotation.x=-1.25*up;tt.visible=up>0.02;tt.rotation.z=Math.sin(lt*10)*0.08*up;
    popB(b1,lt,0.8);popB(b2,lt,1.7);setFace(gv,lt<1.6)}};
// 2 ISFP: 답장 쓰고 지우고
ROOM[1]=R=>{const cush=new THREE.Mesh(new THREE.CylinderGeometry(0.9,1.0,0.35,14),lamb(0xbfe9d4));cush.position.set(0,0.18,0.1);R.g.add(cush);
  const m=person(R.r,{shirt:0x6fc79e,f:true,bob:true});m.position.set(0,0.0,0.3);sitPose(m);m.userData.hip.position.y=0.62;R.g.add(m);
  const ph=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.34,0.03),lamb(0x22222a));R.scene.add(ph);
  const box=pepBox();box.position.set(R.x+1.3,R.y+0.21,0.6);box.rotation.set(-0.15,-0.3,0);R.scene.add(box);
  const clk=card('답장 쓰는 중 · 0분째',{fs:46,bg:'#ffffff',fg:'#2a8a5e',size:0.006});clk.position.set(0,3.55,-1.6);R.g.add(clk);
  const inp=card(' ',{fs:56,bg:'#ffffff',fg:'#222',size:0.006,r:40,border:'#6fe0aa'});inp.position.set(0,2.3,0.9);R.g.add(inp);
  const sent=B(R,0,2.35,'♥',{fs:96,bg:'#ffe86b',fg:'#ff4f7b'});
  const seq=[['고마워!! 너무 맛있겠다ㅎㅎ',0.0,0.55,0.75],['고마워ㅎㅎ 잘 먹을게~',0.8,1.2,1.4],['헐 고마워',1.45,1.62,1.75]];
  return lt=>{const u=m.userData;u.arms.forEach(a=>{a.rotation.x=-1.25;a.rotation.z=0});u.arms[0].rotation.z=0.25;u.arms[1].rotation.z=-0.25;u.head.rotation.x=0.25;
    R.scene.updateMatrixWorld();handW(m,0,_a);handW(m,1,_b);ph.position.lerpVectors(_a,_b,0.5);ph.position.y+=0.12;ph.position.z+=0.05;ph.rotation.x=-0.9;
    let txt='',cur=lt<1.8;for(const [s,t0,t1,t2] of seq){if(lt>=t0&&lt<t2){const n=s.length;const k=lt<t1?(lt-t0)/(t1-t0):1-(lt-t1)/(t2-t1);txt=s.slice(0,Math.round(n*clamp01(k)))}}
    setCard(inp,(txt||'')+(Math.floor(lt*4)%2?'|':' '));scaleBubble(inp,lt<1.85?Math.min(1,pop((lt+0.2)/0.25)):0);
    const mins=Math.min(10,Math.floor(lt/1.8*10));setCard(clk,`답장 쓰는 중 · ${mins}분째`);scaleBubble(clk,1);
    popB(sent,lt,1.9);setFace(m,lt>1.9)}};
// 3 ISTJ: 서랍 간식 칸에 줄 맞춰 정리
ROOM[2]=R=>{const gv=person(R.r);gv.position.set(-1.9,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0x7fa8e0,pants:0x2c4058});m.position.set(0.1,0,0.5);face(m,-0.35);R.g.add(m);
  const cab=new THREE.Group();const CW=0xe8e2d6;
  const back=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.7,0.06),lamb(0xd8cfbf));back.position.set(0,0.85,-0.25);cab.add(back);
  for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.BoxGeometry(0.06,1.7,0.5),lamb(CW));w.position.set(sx*0.82,0.85,0);cab.add(w)}
  for(const y of[0.03,0.85,1.67]){const sh=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.06,0.5),lamb(CW));sh.position.set(0,y,0);cab.add(sh)}
  const tag2=card('간식',{fs:40,bg:'#2b5fa8',fg:'#fff',size:0.004,r:10});tag2.position.set(0,1.72,0.2);scaleBubble(tag2,1);cab.add(tag2);
  const SN=['#4a8fe0','#e0a33a','#3ab08a','#9a6ad0','#e05a7a'];
  const snack=c=>new THREE.Mesh(new THREE.BoxGeometry(0.2,0.42,0.09),lamb(new THREE.Color(c).getHex()));
  for(let k=0;k<5;k++){const sb=snack(SN[k]);sb.position.set(-0.6+k*0.25,0.88+0.21,0);cab.add(sb)}
  for(let k=0;k<6;k++){const sb=snack(SN[(k+2)%5]);sb.position.set(-0.6+k*0.25,0.06+0.21,0);cab.add(sb)}
  cab.position.set(1.9,0,-0.6);R.g.add(cab);
  const box=pepBox();R.scene.add(box);
  const lab=card('간식 칸 정리 완료 ✔',{fs:52,bg:'#ffffff',fg:'#2b5fa8',border:'#8fbfff',size:0.006});lab.position.set(1.4,2.15,0.9);R.g.add(lab);
  const b1=B(R,-1.9,2.45,'…지금 안 먹어?',{fs:58});
  const slot=new THREE.Vector3();
  return lt=>{standPose(gv);standPose(m);
    if(lt<0.65){handover(R,gv,m,box,lt);m.rotation.y=-0.35}
    else{handover(R,gv,m,box,0.65);const k=ease((lt-0.65)/0.25);m.rotation.y=-0.35+1.25*k;
      const p=ease((lt-0.9)/0.35);m.userData.arms[0].rotation.x=-1.15+0.2*p;m.userData.arms[1].rotation.x=-1.0*Math.sin(p*Math.PI);
      R.scene.updateMatrixWorld();handW(m,0,_a);_a.z+=0.14;_a.y+=0.08;
      slot.set(R.x+1.9-0.6+5*0.25,R.y+0.88+0.21,-0.6);
      if(lt<0.9){box.position.copy(_a);box.rotation.set(0,0,0)}
      else{box.position.lerpVectors(_a,slot,p);box.position.y+=Math.sin(p*Math.PI)*0.2;box.rotation.set(0,0,0)}
      if(lt>1.25)m.userData.arms[0].rotation.x=-0.95*(1-ease((lt-1.25)/0.25))}
    m.userData.head.rotation.x=lt>0.9&&lt<1.5?0.3:0;setFace(m,lt>1.5);
    scaleBubble(lab,lt<1.4?0:pop((lt-1.4)/0.25));popB(b1,lt,1.85);setFace(gv,false)}};
// 4 ENFP: 스토리 먼저
ROOM[3]=R=>{const gv=person(R.r);gv.position.set(-1.7,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0xff8fc8,f:true});m.position.set(0.8,0,0.5);face(m,-0.3);R.g.add(m);
  const box=pepBox();R.scene.add(box);const ph=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.3,0.03),lamb(0x22222a));R.scene.add(ph);
  const b1=B(R,0.8,2.55,'잠깐! 스토리 먼저!'),b2=B(R,-1.7,2.45,'먹어…');
  const up=card('스토리 업로드 ✔',{fs:50,bg:'#ff8fc8',fg:'#fff',size:0.006});up.position.set(0.8,3.35,0.9);R.g.add(up);
  let fl=null;if(R.act){fl=div('flash')}
  return lt=>{standPose(gv);standPose(m);
    if(lt<0.6)handover(R,gv,m,box,lt);else{handover(R,gv,m,box,0.6);const k=ease((lt-0.6)/0.25);m.userData.arms[0].rotation.x=-1.15-0.85*k;holdAt(R.scene,box,m,0,0.14,0.1)}
    const pk=ease((lt-0.6)/0.25);m.userData.arms[1].rotation.x=-2.3*pk;m.userData.arms[1].rotation.z=-0.2*pk;R.scene.updateMatrixWorld();handW(m,1,_a);ph.position.copy(_a);ph.position.y+=0.12;ph.position.z+=0.1;ph.rotation.set(0,Math.PI-0.3,0);ph.visible=pk>0.05;
    popB(b1,lt,0.55,1.85);popB(b2,lt,1.65);setFace(gv,lt<1.6);scaleBubble(up,lt<1.95?0:pop((lt-1.95)/0.25));
    if(fl){const f=Math.max(clamp01(1-Math.abs(lt-1.05)/0.08),clamp01(1-Math.abs(lt-1.35)/0.08));fl.style.opacity=f*0.85}}};
// 5 INFP: 아까워서 못 먹음
ROOM[4]=R=>{const desk=new THREE.Group();const top=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.1,0.9),lamb(0xc9a27a));top.position.y=1.0;desk.add(top);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.0,0.08),lamb(0xa98258));l.position.set(sx*0.8,0.5,sz*0.38);desk.add(l)}
  desk.position.set(-0.7,0,0.1);R.g.add(desk);
  const box=pepBox();box.position.set(R.x-0.7,R.y+1.27,0.2);R.scene.add(box);
  const bow=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.02,6,10),lamb(0xffd84d));bow.position.set(R.x-0.7,R.y+1.5,0.27);R.scene.add(bow);
  const ch=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.08,0.6),lamb(0x9b88d6));ch.position.set(1.05,0.55,0.35);R.g.add(ch);
  const m=person(R.r,{shirt:0xb9a3f0,f:true});m.position.set(1.05,0,0.35);face(m,-1.0);sitPose(m);R.g.add(m);
  m.userData.arms.forEach(a=>a.rotation.x=-1.3);
  const cal=card('11.11',{fs:60,bg:'#ffffff',fg:'#e8303a',size:0.006,r:12});cal.position.set(1.9,2.6,-1.9);R.g.add(cal);scaleBubble(cal,1);
  const b1=B(R,0.6,2.55,'아까워서 못 먹겠어…');
  const hs=[];for(let k=0;k<5;k++){const h=textSprite('♥',70,'#ff8fb3',0.005);R.g.add(h);hs.push({h,ph:k/5,x:-0.7+(k-2)*0.22})}
  const days=['11.11','11.12','11.13','11.15','11.18','11.21'];
  return lt=>{const d=Math.min(days.length-1,Math.floor(clamp01((lt-0.5)/1.9)*days.length));setCard(cal,days[d]);scaleBubble(cal,1);
    m.userData.head.rotation.z=Math.sin(lt*2)*0.08;popB(b1,lt,0.3);
    hs.forEach(q=>{const l=(lt*0.6+q.ph)%1;q.h.position.set(q.x,1.6+l*1.0,0.25);const k=Math.sin(l*Math.PI);q.h.scale.set(q.h.userData.base[0]*k,q.h.userData.base[1]*k,1)})}};
// 6 INTP: 상술이라며 다 먹음
ROOM[5]=R=>{const gv=person(R.r,{f:true,bob:true});gv.position.set(-1.6,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0x5fbccc});m.position.set(0.8,0,0.5);face(m,-0.3);R.g.add(m);
  const box=pepBox();R.scene.add(box);const st=stick();R.scene.add(st);
  const b1=B(R,0.8,2.55,'이거 다 상술인 거 알지?'),b2=B(R,-1.6,2.45,'…근데 왜 다 먹어?');
  const cnt=card('남은 빼빼로 12개',{fs:48,bg:'#ffffff',fg:'#2a8a9a',size:0.006});cnt.position.set(0,3.55,-1.6);R.g.add(cnt);
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));
    const e=lt>0.6?(lt-0.6):0;const cyc=(e*3.2)%1;const k=e>0?Math.sin(cyc*Math.PI):0;
    m.userData.arms[1].rotation.x=-0.5-2.0*k;m.userData.arms[1].rotation.z=-0.55*k;holdAt(R.scene,box,m,0,0.14,0.08);
    R.scene.updateMatrixWorld();handW(m,1,st.position);st.position.y+=0.15;st.position.z+=0.08;st.rotation.set(0.6*k,0,0.9*k);st.visible=e>0&&cyc<0.6;
    const left=Math.max(0,12-Math.floor(e*3.2*2.2));setCard(cnt,left>0?`남은 빼빼로 ${left}개`:'남은 빼빼로 0개 ✔');scaleBubble(cnt,lt<0.7?0:1);
    popB(b1,lt,0.55,1.8);popB(b2,lt,1.85);setFace(gv,false)}};
// 7 ESFP: 자랑
ROOM[6]=R=>{const gv=person(R.r);gv.position.set(-2.0,0,0.6);face(gv,0.6);R.g.add(gv);
  const m=person(R.r,{shirt:0xb9e84d,f:true});m.position.set(0.0,0,0.6);face(m,-0.15);R.g.add(m);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.08,0.8),lamb(0xc9a27a));tb.position.set(1.9,0.8,-0.9);R.g.add(tb);
  const by=[person(R.r),person(R.r,{f:true})];by[0].position.set(1.4,0,-1.3);by[1].position.set(2.4,0,-0.5);by.forEach(p=>{sitPose(p);R.g.add(p)});
  const q1=B(R,1.4,1.95,'?',{fs:80,z:-0.8}),q2=B(R,2.4,1.95,'?',{fs:80,z:0});
  const box=pepBox();R.scene.add(box);
  const b1=B(R,-0.3,3.05,'나 빼빼로 받았다~!!',{fs:70});
  return lt=>{standPose(gv);standPose(m);
    if(lt<0.55)handover(R,gv,m,box,lt);else{handover(R,gv,m,box,0.55);const k=ease((lt-0.55)/0.2);armUp(m,0,k);armUp(m,1,k);
      m.userData.hip.position.y=0.8+Math.abs(Math.sin((lt-0.55)*9))*0.25*k;R.scene.updateMatrixWorld();handW(m,0,_a);handW(m,1,_b);box.position.lerpVectors(_a,_b,0.5);box.position.y+=0.2;box.position.z+=0.1;box.rotation.z=Math.sin(lt*14)*0.15}
    sitPose(by[0]);sitPose(by[1]);const tk=ease((lt-1.2)/0.25);by[0].rotation.y=-1.2*tk;by[1].rotation.y=-1.6*tk+0.2*(1-tk);
    popB(b1,lt,0.6);popB(q1,lt,1.4);popB(q2,lt,1.5);setFace(by[0],false);setFace(by[1],false)}};
// 8 INFJ: 집 가는 길
ROOM[7]=R=>{R.wall.material=lamb(0x34407a);
  const moon=textSprite('●',120,'#fff2b8',0.006);moon.position.set(-2.0,3.3,-1.9);R.g.add(moon);
  for(let k=0;k<14;k++){const s=new THREE.Mesh(new THREE.CircleGeometry(0.03,6),basic(0xfff6d8));s.position.set((R.r()-0.5)*5.6,2+R.r()*2.2,-1.98);R.g.add(s)}
  const lamp=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.06,3.2,8),lamb(0x55566a));pole.position.y=1.6;lamp.add(pole);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),basic(0xfff1b0));bulb.position.y=3.25;lamp.add(bulb);const gl=glowSprite('rgba(255,236,170,1)',1.6);gl.position.y=3.25;lamp.add(gl);
  lamp.position.set(2.2,0,-1.2);R.g.add(lamp);
  const tiles=[];for(let k=0;k<10;k++){const t=new THREE.Mesh(new THREE.PlaneGeometry(0.05,RD),basic(0xb79e7e));t.rotation.x=-Math.PI/2;t.position.set(-3+k*0.7,0.03,0);R.g.add(t);tiles.push(t)}
  const m=person(R.r,{shirt:0xc995e6,f:true});m.position.set(0,0,0.4);face(m,0.9);R.g.add(m);
  const box=pepBox();R.scene.add(box);
  const tc=card(' ',{fs:56,bg:'#f6eaff',fg:'#5a3a7a',size:0.006,r:60});tc.position.set(0,2.45,0.9);R.g.add(tc);
  const seq=[[0.15,'왜 나한테 줬지…'],[0.9,'혹시…?'],[1.55,'아냐, 그냥 준 거겠지'],[2.2,'…근데 왜 나한테?']];
  return lt=>{walkPose(m,lt*6.5,0.45);m.userData.arms[0].rotation.x=-0.9;holdAt(R.scene,box,m,0,0.12,0.05);box.rotation.y=-0.8;
    tiles.forEach((t,k)=>{t.position.x=((-3+k*0.7-lt*1.4)%7+7)%7-3.5});
    let cur=null,t0=0;for(const [a,s] of seq)if(lt>=a){cur=s;t0=a}
    if(cur){setCard(tc,cur);scaleBubble(tc,pop((lt-t0)/0.22))}else scaleBubble(tc,0);
    m.userData.head.rotation.z=0.08*Math.sin(lt*1.5)}};
// 9 ISTP: 끄덕, 바로 뜯음
ROOM[8]=R=>{const gv=person(R.r,{f:true});gv.position.set(-1.6,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0x4a5468,pants:0x33384a});m.position.set(0.8,0,0.5);face(m,-0.3);R.g.add(m);
  const box=pepBox();R.scene.add(box);const lid=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.1,0.09),lamb(0xe8303a));R.scene.add(lid);const st=stick();R.scene.add(st);
  const b1=B(R,0.6,2.45,'아 오늘 빼빼로데이였구나',{fs:58}),b2=B(R,-1.6,2.45,'벌써…?');
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));
    const nod=lt>0.6&&lt<1.0?Math.sin((lt-0.6)/0.4*Math.PI)*0.4:0;m.userData.head.rotation.x=nod;
    holdAt(R.scene,box,m,0,0.14,0.08);
    if(lt<1.05){lid.position.copy(box.position);lid.position.y+=0.26;lid.rotation.set(0,0,0)}else{const f=lt-1.05;lid.position.set(box.position.x+f*1.5,box.position.y+0.26+f*2.4-f*f*5,box.position.z+0.2);lid.rotation.set(f*8,0,f*6)}
    lid.visible=lt<1.7;
    const e=lt>1.15?lt-1.15:0;const k=e>0?Math.sin(((e*3)%1)*Math.PI):0;m.userData.arms[1].rotation.x=-0.6*Math.min(1,e*5)-1.9*k;m.userData.arms[1].rotation.z=-0.55*k;
    R.scene.updateMatrixWorld();handW(m,1,st.position);st.position.y+=0.15;st.position.z+=0.08;st.rotation.set(0.6*k,0,0.9*k);st.visible=e>0;
    popB(b1,lt,0.6,1.8);popB(b2,lt,1.85);setFace(m,false);setFace(gv,lt<1.7)}};
// 10 ESFJ: 나도 줄게
ROOM[9]=R=>{const gv=person(R.r);gv.position.set(-1.5,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0xff9e8a,f:true});m.position.set(0.9,0,0.5);face(m,-0.45);R.g.add(m);
  const bag=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.6,0.35),lamb(0xd98c6a));bag.position.set(2.1,0.3,0.4);R.g.add(bag);
  const box=pepBox();R.scene.add(box);const box2=pepBox('#ff6fa8');R.scene.add(box2);
  const b1=B(R,0.9,2.55,'헐 나도 줄게!!');
  const hs=[];for(let k=0;k<6;k++){const h=textSprite('♥',70,'#ff8fb3',0.005);R.g.add(h);hs.push({h,ph:k/6,x:-0.4+(k-2.5)*0.25})}
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));holdAt(R.scene,box,m,0,0.14,0.08);
    // 가방에서 꺼내서 건네기
    const a1=ease((lt-0.7)/0.25),a2=ease((lt-1.05)/0.3);const arm=m.userData.arms[1];
    arm.rotation.x=lt<1.05?-0.3*a1:-0.3-1.3*a2;arm.rotation.z=lt<1.05?-0.5*a1:-0.5*(1-a2);
    R.scene.updateMatrixWorld();
    if(lt<0.7){box2.position.set(R.x+2.1,R.y+0.4,0.4);box2.visible=false}else{handW(m,1,box2.position);box2.position.z+=0.14;box2.position.y+=0.08;box2.visible=true}
    const g2=ease((lt-1.35)/0.25);gv.userData.arms[1].rotation.x=-1.2*g2;
    if(lt>1.55){handW(gv,1,box2.position);box2.position.z+=0.14;box2.position.y+=0.08}
    popB(b1,lt,0.7);
    hs.forEach(q=>{const l=(lt*0.7+q.ph)%1;q.h.visible=lt>1.6;q.h.position.set(q.x,1.9+l*1.2,0.6);const k=Math.sin(l*Math.PI);q.h.scale.set(q.h.userData.base[0]*k,q.h.userData.base[1]*k,1)})}};
// 11 INTJ: 취향이 너무 구체적임
ROOM[10]=R=>{const gv=person(R.r,{f:true});gv.position.set(-1.6,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0x5d6aa8,pants:0x2c2f40});m.position.set(0.8,0,0.5);face(m,-0.3);R.g.add(m);
  const bag=new THREE.Group();const bb=new THREE.Mesh(new THREE.BoxGeometry(0.75,0.55,0.3),lamb(0x3a3f55));bb.position.y=0.28;bag.add(bb);
  const hdl=new THREE.Mesh(new THREE.TorusGeometry(0.18,0.03,6,12,Math.PI),lamb(0x3a3f55));hdl.position.y=0.55;bag.add(hdl);bag.position.set(2.1,0,0.4);R.g.add(bag);
  const box=pepBox();R.scene.add(box);const nude=pepBox('#f1e3c4');R.scene.add(nude);
  const nl=card('누드',{fs:44,bg:'#5a3220',fg:'#fff',size:0.0035,r:10});scaleBubble(nl,1);nude.add(nl);nl.position.set(0,-0.05,0.06);nl.center.set(0.5,0.5);
  const b1=B(R,0.4,2.5,'고마워. 근데 나 누드 빼빼로만 먹어.',{fs:54});
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));holdAt(R.scene,box,m,0,0.14,0.08);
    const arm=m.userData.arms[1];const a1=ease((lt-0.95)/0.25),a2=ease((lt-1.3)/0.3);
    arm.rotation.x=lt<1.3?-0.3*a1:-0.3-1.0*a2;arm.rotation.z=lt<1.3?-0.6*a1:-0.6*(1-a2);
    R.scene.updateMatrixWorld();handW(m,1,nude.position);nude.position.z+=0.14;nude.position.y+=0.08;nude.visible=lt>1.1;
    popB(b1,lt,0.6);setFace(m,false);setFace(gv,lt<1.8)}};
// 12 ESTP: 한 입에 세 개
ROOM[11]=R=>{const gv=person(R.r);gv.position.set(-1.6,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0xff6b6b});m.position.set(0.8,0,0.5);face(m,-0.25);R.g.add(m);
  const box=pepBox();R.scene.add(box);
  const st3=new THREE.Group();for(let k=0;k<3;k++){const s=stick();s.position.x=(k-1)*0.06;s.rotation.z=(k-1)*0.12;st3.add(s)}R.scene.add(st3);
  const mouth=new THREE.Group();for(let k=0;k<3;k++){const s=stick();s.scale.setScalar(1.3);s.rotation.set(0,-0.5,Math.PI/2+(k-1)*0.32);s.position.set(0.3,(k-1)*0.02,0.0);mouth.add(s)}mouth.position.set(0.04,0.15,0.24);m.userData.head.add(mouth);
  const b1=B(R,0.8,2.55,'한 입에 세 개 ㅋ'),b2=B(R,-1.6,2.45,'ㄷㄷ',{fs:72});
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));holdAt(R.scene,box,m,0,0.14,0.08);
    const k=lt<0.7?0:lt<1.05?Math.sin((lt-0.7)/0.7*Math.PI):Math.max(0,1-(lt-1.05)/0.25)*Math.sin(0.5*Math.PI);
    m.userData.arms[1].rotation.x=-2.4*k;m.userData.arms[1].rotation.z=-0.55*k;R.scene.updateMatrixWorld();handW(m,1,st3.position);st3.position.y+=0.15;st3.position.z+=0.08;st3.visible=lt>0.7&&lt<1.05;
    mouth.visible=lt>=1.05;mouth.scale.setScalar(1);m.userData.head.rotation.x=lt>1.05?-0.1:0;
    popB(b1,lt,1.15);popB(b2,lt,1.7);setFace(gv,false)}};
// 13 ISFJ: 답례 메모
ROOM[12]=R=>{const gv=person(R.r);gv.position.set(-1.6,0,0.5);face(gv,0.55);R.g.add(gv);
  const m=person(R.r,{shirt:0x95d38e,f:true,bob:true});m.position.set(0.8,0,0.5);face(m,-0.3);R.g.add(m);
  const box=pepBox();R.scene.add(box);
  const pen=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.3,0.03),lamb(0xfff6c8));R.scene.add(pen);
  const memo=card('11.11 민지 → 빼빼로\n답례 꼭 하기 ✔',{fs:50,bg:'#fff6c8',fg:'#5a4a1a',size:0.006,r:14,align:'left'});memo.position.set(0.6,2.3,0.9);R.g.add(memo);
  const b1=B(R,0.8,2.5,'꼭 갚아야지…');
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));holdAt(R.scene,box,m,0,0.14,0.08);
    const k=ease((lt-0.65)/0.25);m.userData.arms[1].rotation.x=-1.3*k;R.scene.updateMatrixWorld();handW(m,1,pen.position);pen.position.y+=0.1;pen.position.z+=0.1;pen.visible=k>0.05;
    scaleBubble(memo,lt<0.8||lt>1.85?0:pop((lt-0.8)/0.25));popB(b1,lt,1.9);m.userData.head.rotation.x=lt<1.9?0.2*k:0}};
// 14 ENFJ: 손편지 붙여서 돌려줌
ROOM[13]=R=>{const gv=person(R.r);gv.position.set(-1.7,0,0.6);face(gv,0.6);R.g.add(gv);
  const m=person(R.r,{shirt:0xffa0c8,f:true});m.position.set(0.4,0,0.6);face(m,-0.5);R.g.add(m);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,0.8),lamb(0xc9a27a));tb.position.set(1.8,0.85,-0.9);R.g.add(tb);
  for(const sx of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.85,0.08),lamb(0xa98258));l.position.set(1.8+sx*0.8,0.42,-0.9);R.g.add(l)}
  const env=()=>{const e=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.14,0.01),lamb(0xffd6e8));const h=textSprite('♥',40,'#ff5a8a',0.0022);h.position.z=0.01;e.add(h);return e};
  for(let k=0;k<8;k++){const b=pepBox(k%2?'#e8303a':'#ff6fa8');b.position.set(R.x+1.15+(k%4)*0.42,R.y+1.1,-0.75-Math.floor(k/4)*0.35);R.scene.add(b);const e=env();e.position.set(0,-0.05,0.05);b.add(e)}
  const box=pepBox();R.scene.add(box);const gift=pepBox('#ff6fa8');const ge=env();ge.position.set(0,-0.05,0.05);gift.add(ge);R.scene.add(gift);
  const lab=card('손편지 12장 ✔',{fs:50,bg:'#ffffff',fg:'#d0407a',size:0.006});lab.position.set(1.8,1.75,-0.6);R.g.add(lab);
  const b1=B(R,0.3,2.6,'한 명씩 다 편지 썼어!');
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));holdAt(R.scene,box,m,0,0.14,0.08);
    const k=ease((lt-0.8)/0.3);const arm=m.userData.arms[1];arm.rotation.x=-1.3*k;R.scene.updateMatrixWorld();
    if(lt<0.8){gift.position.set(R.x+1.4,R.y+1.12,-0.4)}else if(lt<1.45){_a.set(R.x+1.4,R.y+1.12,-0.4);handW(m,1,_b);_b.z+=0.14;_b.y+=0.08;gift.position.lerpVectors(_a,_b,k)}
    const g2=ease((lt-1.25)/0.25);gv.userData.arms[1].rotation.x=-1.25*g2;if(lt>=1.45){handW(gv,1,gift.position);gift.position.z+=0.14;gift.position.y+=0.08}
    if(lt>=1.45)arm.rotation.x=-1.3*(1-ease((lt-1.45)/0.3));
    scaleBubble(lab,lt<0.4?0:pop((lt-0.4)/0.25));popB(b1,lt,0.7);setFace(gv,true)}};
// 15 ESTJ: 전날 준비
ROOM[14]=R=>{const tb=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.08,1.0),lamb(0xc9a27a));tb.position.set(-0.6,0.85,-0.4);R.g.add(tb);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.85,0.08),lamb(0xa98258));l.position.set(-0.6+sx*1.1,0.42,-0.4+sz*0.42);R.g.add(l)}
  const bx=[];for(let k=0;k<12;k++){const b=pepBox();b.position.set(R.x-0.6+((k%6)-2.5)*0.36,R.y+1.1,-0.2-Math.floor(k/6)*0.4);R.scene.add(b);bx.push(b)}
  const m=person(R.r,{shirt:0x4fae92,pants:0x2c4058});m.position.set(1.6,0,0.5);face(m,-0.4);R.g.add(m);
  const clip=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.34,0.03),lamb(0xffffff));R.scene.add(clip);
  const clk=card('11.10 PM 9:00 · 하루 전',{fs:46,bg:'#ffffff',fg:'#2f7a62',size:0.006});clk.position.set(0,3.55,-1.6);R.g.add(clk);
  const lab=card('인원 12명 · 12개 ✔',{fs:52,bg:'#ffffff',fg:'#2f7a62',border:'#66c2a5',size:0.006});lab.position.set(-0.6,1.75,0.3);R.g.add(lab);
  const b1=B(R,1.4,2.5,'준비 완료.');
  return lt=>{standPose(m);scaleBubble(clk,pop((lt+0.3)/0.25));
    bx.forEach((b,k)=>{const s=pop((lt-0.1-k*0.07)/0.2);b.scale.setScalar(Math.max(0.001,s));b.visible=s>0.01});
    m.userData.arms[0].rotation.x=-1.0;R.scene.updateMatrixWorld();handW(m,0,clip.position);clip.position.y+=0.12;clip.position.z+=0.1;
    const ck=lt>1.0&&lt<1.4?Math.sin((lt-1.0)/0.4*Math.PI):0;m.userData.arms[1].rotation.x=-1.1*ck;
    scaleBubble(lab,lt<1.05?0:pop((lt-1.05)/0.25));popB(b1,lt,1.6);setFace(m,false)}};
// 16 ENTJ: 다이어트 중인데… 칼로리 계산해서 딱 2개
ROOM[15]=R=>{const gv=person(R.r,{f:true});gv.position.set(-1.7,0,0.5);face(gv,0.6);R.g.add(gv);
  const m=person(R.r,{shirt:0x9a7ae0,pants:0x2c2f40});m.position.set(0.7,0,0.5);face(m,-0.3);R.g.add(m);
  const box=pepBox();R.scene.add(box);const ph=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.3,0.03),lamb(0x22222a));R.scene.add(ph);const st=stick();R.scene.add(st);
  const b1=B(R,0.4,2.5,'나 다이어트 중인데…',{fs:60}),b2=B(R,0.1,2.5,'오늘 남은 칼로리로 2개까지 가능.',{fs:54});
  const calc=card('남은 칼로리 180kcal\n= 빼빼로 2개',{fs:52,bg:'#ffffff',fg:'#6a4ac0',border:'#b58cff',size:0.006});calc.position.set(0.3,2.35,0.9);R.g.add(calc);
  const cnt=card('0 / 2개',{fs:52,bg:'#ffffff',fg:'#6a4ac0',size:0.006});cnt.position.set(0,3.55,-1.6);R.g.add(cnt);
  return lt=>{standPose(gv);standPose(m);handover(R,gv,m,box,Math.min(lt,0.6));holdAt(R.scene,box,m,0,0.14,0.08);
    const arm=m.userData.arms[1];R.scene.updateMatrixWorld();
    if(lt<1.35){const k=ease((lt-0.7)/0.2);arm.rotation.x=-1.5*k;arm.rotation.z=-0.2*k;R.scene.updateMatrixWorld();handW(m,1,ph.position);ph.position.y+=0.12;ph.position.z+=0.1;ph.rotation.set(-0.3,-0.2,0);ph.visible=k>0.05&&lt<1.35;st.visible=false;m.userData.head.rotation.x=0.25*k}
    else{ph.visible=false;m.userData.head.rotation.x=0;const e=lt-1.55;const n=e<0?0:Math.min(2,Math.floor(e/0.4)+1);const cyc=e<0?0:(e%0.4)/0.4;const k=e>=0&&e<0.8?Math.sin(cyc*Math.PI):0;
      arm.rotation.x=-0.3-2.1*k;arm.rotation.z=-0.55*k;R.scene.updateMatrixWorld();handW(m,1,st.position);st.position.y+=0.15;st.position.z+=0.08;st.rotation.set(0.6*k,0,0.9*k);st.visible=e>=0&&e<0.8;
      setCard(cnt,n>=2&&e>0.8?'2 / 2개 ✔ 끝.':`${n} / 2개`);scaleBubble(cnt,e<0?0:1)}
    if(lt<1.55)scaleBubble(cnt,0);
    popB(b1,lt,0.05,0.7);scaleBubble(calc,lt<0.75||lt>1.35?0:pop((lt-0.75)/0.22));popB(b2,lt,1.35);setFace(m,false);setFace(gv,lt>2.2)}};
// ---------- 장면 ----------
const ACT=0.45; // 카메라 이동 시간
S[0]=()=>{bgEl.style.background=SKY;const {scene,rooms}=world(-1,{sign:true});
  const C=new THREE.PerspectiveCamera(55,W/H,0.1,400);
  ui.innerHTML='<div class="tag">11.11 빼빼로데이 특집</div><div class="title1 out">빼빼로 받았을 때</div><div class="title2 out">MBTI별 반응</div>';
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2');
  const P0=new THREE.Vector3(0,10,46),L0=new THREE.Vector3(0,16.2,0);const E=camPose(0);
  return t=>{const D=DURS[0];const z=ease((t-(D-0.8))/0.8);C.position.lerpVectors(P0,E.p,z);C.position.z-=(1-z)*t*0.8;const l=new THREE.Vector3().lerpVectors(L0,E.l,z);C.lookAt(l);
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;const fo=1-clamp01((t-(D-0.6))/0.3);
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t1.style.opacity=clamp01((t-0.1)/0.1)*fo;
    t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t2.style.opacity=clamp01((t-0.35)/0.1)*fo;tag.style.opacity=fo;
    renderer.render(scene,C)}};
for(let i=0;i<16;i++)S[i+1]=()=>{bgEl.style.background=SKY;const {scene,rooms}=world(i);const C=new THREE.PerspectiveCamera(55,W/H,0.1,400);
  const [name,col,desc]=TYPES[i];
  const tg=div('ptag','빼빼로 받았을 때'),mb=div('mb out',name),cp=div('cap out',desc),nm=div('num',`${i+1}/16`);mb.style.color=col;
  const A=camPose(Math.max(0,i-1)),E=camPose(i);const upd=rooms[i].upd;
  return t=>{const k=i===0?1:ease(t/ACT);C.position.lerpVectors(A.p,E.p,k);C.lookAt(new THREE.Vector3().lerpVectors(A.l,E.l,k));
    upd(Math.max(0,t-ACT+0.05));
    tg.style.opacity=1;mb.style.transform=`scale(${pop((t-0.15)/0.35)})`;mb.style.opacity=clamp01((t-0.15)/0.08);
    cp.style.transform=`scale(${0.85+0.15*pop((t-LEAD)/0.18)})`;cp.style.opacity=clamp01((t-LEAD)/0.1);
    renderer.render(scene,C)}};
S[17]=()=>{bgEl.style.background='linear-gradient(#1d2552,#3b3f7a 55%,#7a6a9a)';const {scene}=world(-1,{sign:true,ground:0x4f5f60,tree:0x3f6a5a,hemi:1.1,dir:0.9});
  const r=rng(77);stars(scene,140,r,{w:120,y0:22,h:30,z:-30});
  const C=new THREE.PerspectiveCamera(55,W/H,0.1,400);
  const ppl=[person(r,{shirt:0xffa94d}),person(r,{shirt:0xff8fc8,f:true}),person(r,{shirt:0x8fbfff})];
  const bxs=ppl.map((p,k)=>{p.position.set((k-1)*1.5,-0.3,31);scene.add(p);const b=pepBox(k==1?'#ff6fa8':'#e8303a');scene.add(b);return b});
  const e1=div('end1 out','여러분은<br>어떤 유형인가요?'),e2=div('end2 out','댓글에 빼빼로 줄 친구를 태그해 주세요!');
  const A=camPose(15),P1=new THREE.Vector3(0,4.5,42),L1=new THREE.Vector3(0,11,0);
  return t=>{const k=ease(t/1.3);C.position.lerpVectors(A.p,P1,k);C.lookAt(new THREE.Vector3().lerpVectors(A.l,L1,k));C.position.z+=t*0.15;
    ppl.forEach((p,j)=>{standPose(p);armUp(p,1,1);p.userData.arms[1].rotation.z=0.18+Math.sin(t*7+j)*0.35;p.userData.arms[0].rotation.x=-1.0;holdAt(scene,bxs[j],p,0,0.14,0.08)});
    e1.style.opacity=clamp01((t-0.9)/0.1);e1.style.transform=`scale(${pop((t-0.9)/0.35)})`;
    e2.style.opacity=clamp01((t-1.2)/0.1);e2.style.transform=`scale(${pop((t-1.2)/0.35)})`;
    renderer.render(scene,C)}};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
