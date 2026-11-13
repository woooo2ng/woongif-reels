// ---------- ENTJ 전용 소품 ----------
function brows(p,k=0.32){const h=p.userData.head;
  for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.025,0.02),lamb(0x1a1a1a));b.position.set(s*0.095,0.33,0.238);b.rotation.z=s*k;h.add(b)}return p}
function setSky(a,b){bgEl.style.background=`linear-gradient(${a},${b})`}
function lerpCol(c1,c2,k){const a=new THREE.Color(c1),b=new THREE.Color(c2);return '#'+a.lerp(b,clamp01(k)).getHexString()}
function field(scene,r,o={}){
  ground(scene,o.g??0x9cb97a,300);
  const mud=new THREE.Mesh(new THREE.PlaneGeometry(80,7),lamb(0xa8946e));mud.rotation.x=-Math.PI/2;mud.position.set(0,0.01,o.mz??-1);scene.add(mud);
  for(let i=0;i<14;i++){const x=(i-6.5)*3.1+r()*0.6;const post=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.9,0.09),lamb(0x5d4e3e));post.position.set(x,0.45,(o.mz??-1)+(i%2?0.4:-0.4));post.rotation.z=(r()-0.5)*0.3;scene.add(post)}
  for(const y of[0.35,0.7]){const w=new THREE.Mesh(new THREE.BoxGeometry(44,0.02,0.02),lamb(0x7d7d84));w.position.set(0,y,o.mz??-1);scene.add(w)}
  for(let i=0;i<9;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4)*13+r()*4,0,-40-r()*12);scene.add(h)}
  for(let i=0;i<12;i++)tree(scene,(i-5.5)*4.4+r()*2,-18-r()*6,1.1,0x76a866);
}
// 별 네 개 계급장 / 작대기 하나
const STAR_T=canvasTex(256,76,(x,w,h)=>{x.fillStyle='#2b2b36';rr(x,0,0,w,h,16);x.fill();x.fillStyle='#ffd84d';x.font=`900 50px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('★★★★',w/2,h/2+3)});
const BAR_T=canvasTex(256,76,(x,w,h)=>{x.fillStyle='#2b2b36';rr(x,0,0,w,h,16);x.fill();x.fillStyle='#e6e6e6';x.fillRect(w*0.3,h*0.4,w*0.4,h*0.22)});
function plate(tex,w=0.3){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*76/256),new THREE.MeshBasicMaterial({map:tex,transparent:true}));return m}
function entj(r,side){const p=brows(general(r,side),-0.22);setFace(p,false);const h=p.userData.head;
  h.children.forEach(c=>{if(c.geometry&&c.geometry.type==='CircleGeometry')c.visible=false});
  const pl=plate(STAR_T,0.3);pl.position.set(0,0.455,0.276);h.add(pl);
  const gl=glowSprite('rgba(255,236,150,1)',0.5);gl.position.set(0.1,0.47,0.3);h.add(gl);gl.material.opacity=0;p.userData.glint=gl;p.userData.ph=r()*10;
  for(const s of[-1,1]){const sp=plate(STAR_T,0.17);sp.rotation.x=-Math.PI/2;sp.position.set(s*0.3,0.69,0);p.userData.hip.add(sp)}
  return p}
function glint(p,t,k=1){const g=p.userData.glint;if(!g)return;const lt=(t*0.55+p.userData.ph)%2.2;g.material.opacity=lt<0.35?Math.sin(lt/0.35*Math.PI)*k:0}
function stern(p){standPose(p);setFace(p,false)}
function topB(b){b.material.depthTest=false;b.renderOrder=10;return b}
function bubS(p,text,o={}){return topB(bub(p,text,{y:o.y??2.25,bg:o.bg||'#ffe0dc',fg:o.fg||'#5a1a12',fs:o.fs||64,size:o.size||0.003}))}
function bubF(p,text,o={}){return topB(bub(p,text,{y:o.y??2.25,bg:o.bg||'#e4e0ff',fg:o.fg||'#2d2766',fs:o.fs||64,size:o.size||0.003}))}
function show(b,t,t0,t1){scaleBubble(b,t>=t0&&t<t1?pop((t-t0)/0.25):0)}
function whiteboard(scene,o={}){const g=new THREE.Group();const w=o.w||4.2,h=o.h||2.6;
  const B0=o.base??1.0;const fr=new THREE.Mesh(new THREE.BoxGeometry(w+0.16,h+0.16,0.1),lamb(0xb9bec8));fr.position.y=B0+h/2;g.add(fr);
  for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,B0+0.1,0.08),lamb(0x8a8f99));l.position.set(s*w*0.42,(B0+0.1)/2,0);g.add(l)}
  const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
  const sf=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}));sf.position.set(0,B0+h/2,0.056);g.add(sf);
  g.userData={c,ctx:c.getContext('2d'),tex,w,h,last:null};scene.add(g);return g}
function arrowsList(seed,n){const r=rng(seed),A=[];for(let i=0;i<n;i++){const x0=60+r()*900,y0=40+r()*560,a=r()*Math.PI*2,L=120+r()*260;
  A.push({x0,y0,x1:x0+Math.cos(a)*L,y1:y0+Math.sin(a)*L,b:(r()-0.5)*160,col:pick(r,['#1d2433','#22305e','#2f2f2f','#3a1f4f','#123a2a']),lw:5+r()*5})}return A}
function drawArrow(x,A,k=1,col=null,lw=null){const mx=(A.x0+A.x1)/2+A.b,my=(A.y0+A.y1)/2-A.b*0.5;x.strokeStyle=col||A.col;x.fillStyle=col||A.col;x.lineWidth=lw||A.lw;x.lineCap='round';
  x.beginPath();x.moveTo(A.x0,A.y0);x.quadraticCurveTo(mx,my,A.x1,A.y1);x.stroke();
  const an=Math.atan2(A.y1-my,A.x1-mx),s=(lw||A.lw)*3.2;x.beginPath();x.moveTo(A.x1+Math.cos(an)*s*0.5,A.y1+Math.sin(an)*s*0.5);x.lineTo(A.x1+Math.cos(an+2.5)*s,A.y1+Math.sin(an+2.5)*s);x.lineTo(A.x1+Math.cos(an-2.5)*s,A.y1+Math.sin(an-2.5)*s);x.closePath();x.fill()}
function boardBase(x,w,h,o={}){x.fillStyle='#fbfbf7';x.fillRect(0,0,w,h);
  x.strokeStyle='#8fb4e0';x.lineWidth=10;x.beginPath();x.moveTo(w*0.5,0);x.bezierCurveTo(w*0.42,h*0.3,w*0.6,h*0.6,w*0.48,h);x.stroke();
  x.fillStyle='rgba(120,160,90,.35)';x.fillRect(w*0.08,h*0.15,w*0.22,h*0.25);x.fillRect(w*0.7,h*0.55,w*0.2,h*0.3);
  x.font=`900 46px ${FONT}`;x.fillStyle='#333';x.fillText(o.title||'작전 회의',30,60)}
function briefcase(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.3,0.1),lamb(0x5a3a26));g.add(b);
  const hd=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.05,0.04),lamb(0x2a2a2a));hd.position.y=0.17;g.add(hd);return g}
function holdIn(p,obj,side=1,dx=0,dy=-0.62,dz=0){p.userData.arms[side].add(obj);obj.position.set(dx,dy,dz);return obj}
function megaphone(){const m=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.48,10,1,true),new THREE.MeshLambertMaterial({color:0xf0f0f0,side:THREE.DoubleSide,flatShading:true}));return m}
function binoc(){const g=new THREE.Group();for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.065,0.2,10),lamb(0x2a2a30));c.rotation.x=Math.PI/2;c.position.x=s*0.07;g.add(c)}return g}
function paper(col='#fffdf2',draw=null,w=0.5,h=0.68){const t=canvasTex(320,436,(x,W,H)=>{x.fillStyle=col;x.fillRect(0,0,W,H);if(draw)draw(x,W,H)});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}));return m}
function table(scene,x,z,w=2.4,d=1.2,col=0x9a7652){const g=new THREE.Group();const top=new THREE.Mesh(new THREE.BoxGeometry(w,0.08,d),lamb(col));top.position.y=0.86;g.add(top);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.86,0.07),lamb(0x6b5238));l.position.set(sx*(w/2-0.1),0.43,sz*(d/2-0.1));g.add(l)}
  g.position.set(x,0,z);scene.add(g);return g}
function chair(scene,x,z,ry=0){const g=new THREE.Group();const s=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.06,0.5),lamb(0x6b5a48));s.position.y=0.5;g.add(s);
  const b=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.6,0.06),lamb(0x6b5a48));b.position.set(0,0.82,-0.22);g.add(b);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.5,0.05),lamb(0x4a3e32));l.position.set(sx*0.2,0.25,sz*0.2);g.add(l)}
  g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);return g}
function salute(p,k=1){const a=p.userData.arms[1];a.rotation.x=-2.3*k;a.rotation.z=1.05*k}
function handUp(p,k=1,side=1){const a=p.userData.arms[side];a.rotation.x=-2.95*k;a.rotation.z=(side?0.15:-0.15)*k}
function watchLook(p,k=1){const a=p.userData.arms[0];a.rotation.x=-1.55*k;a.rotation.z=0.75*k;p.userData.head.rotation.x=0.3*k}
function sparkles(scene,n,r){const a=[];for(let i=0;i<n;i++){const s=textSprite('✦',90,i%2?'#fff3a8':'#ffd84d',0.004);scene.add(s);a.push({s,ph:r()})}return a}
function updSpk(a,t,anchors,on=1){a.forEach((q,i)=>{const A=anchors[i%anchors.length];const lt=(t*1.2+q.ph)%1;const k=Math.sin(lt*Math.PI)*on;q.s.visible=k>0.02;
  q.s.position.set(A.x+Math.cos(q.ph*9)*0.35,A.y+lt*0.4,A.z+0.05);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)})}
const _w=new THREE.Vector3();
function headPos(p,dy=0){p.updateMatrixWorld(true);p.userData.head.getWorldPosition(_w);return new THREE.Vector3(_w.x,_w.y+dy,_w.z)}

// ===== 0. 선전포고 → 전원 "제가 지휘하겠습니다" (타이틀) =====
S[0]=()=>{
  setSky('#a8c3e0','#eef3f7 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde7ef,30,95);addLights(scene,{hemi:1.5});
  const r=rng(31);field(scene,r,{mz:-3.2});
  const allies=[];for(let row=0;row<5;row++)for(let c=0;c<9;c++){const p=entj(r,GEN);p.position.set((c-4)*1.2+(row%2)*0.3,0,1.6+row*1.45);p.rotation.y=Math.PI;scene.add(p);allies.push({p,row,c,z0:p.position.z})}
  const pod=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.45,1.1),lamb(0x8a6a48));pod.position.set(-0.6,0.225,-1.0);scene.add(pod);
  const EJ=entj(r,GEN);EJ.position.set(-0.6,0.45,-1.0);scene.add(EJ);
  const bE=bubS(EJ,'적이 전쟁을 선포했다!',{y:2.25,size:0.0022}),bE2=bubS(EJ,'이번 전쟁 지휘는…',{y:2.25,size:0.0022});
  for(let row=0;row<3;row++)for(let c=0;c<9;c++){const p=entj(r,ENEMYG);p.position.set((c-4)*1.3,0,-9-row*1.5);scene.add(p)}
  const vol=[];[[0,4],[1,1],[1,7],[2,2],[2,6]].forEach(([row,c],i)=>{const q=allies.find(a=>a.row===row&&a.c===c);vol.push({q,b:bubS(q.p,i===0?'제가 지휘하겠습니다':'제가!',{y:2.3,size:i===0?0.0034:0.0028}),d:i*0.06})});
  const C=cam(50);const TE=at(0,'g0'),ST=EV(0).step,TE2=at(0,'g0',2.03);
  const ch=chip('병사 0명 · 장군 3,000명');
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ENTJ × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ENTJ인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  return t=>{
    const stepK=ease((t-ST)/0.35);
    allies.forEach(q=>{stern(q.p);glint(q.p,t);q.p.position.z=q.z0-0.6*stepK;if(t>ST&&t<ST+0.4)walkPose(q.p,(t-ST)*9,0.5);
      if(t>ST+0.2)handUp(q.p,ease((t-ST-0.2-(q.c%3)*0.04)/0.25))});
    stern(EJ);glint(EJ,t);const sw=t>TE-0.2&&t<TE2;if(sw){handUp(EJ,ease((t-TE+0.2)/0.25),1)}else if(t<ST){EJ.userData.arms[1].rotation.x=-1.2;EJ.userData.arms[0].rotation.x=-0.2}
    if(t>ST){EJ.rotation.y=0;EJ.userData.head.rotation.y=Math.sin(t*6)*0.25;EJ.userData.arms[0].rotation.x=-0.4;EJ.userData.arms[1].rotation.x=-0.4}
    show(bE,t,TE+0.05,TE2-0.1);show(bE2,t,TE2,ST+0.1);vol.forEach(v=>show(v.b,t,ST+0.25+v.d,99));
    if(t<TE-0.15){const k=t/(TE-0.15);C.fov=44;C.updateProjectionMatrix();C.position.set(-4.4+k*5.2,2.2,-2.1);C.lookAt(-3.6+k*5.2,1.95,2.6)}
    else if(t<ST){const k=ease((t-TE)/2.6);C.fov=44;C.updateProjectionMatrix();C.position.set(0.6-k*0.3,3.0,3.1-k*0.4);C.lookAt(-0.6,2.35,-1.0)}
    else{const k=ease((t-ST)/1.6);C.fov=52;C.updateProjectionMatrix();C.position.set(0,2.2+k*0.3,-4.2-k*0.5);C.lookAt(0,2.5,4)}
    chipPop(ch,t,ST+0.5);ch.style.opacity=t>ST+0.5?1:0;
    const T0=0.05,out=clamp01((t-TE+0.15)/0.25),os=1-out;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.65)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.65)/0.1)*os;
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 화이트보드 작전 3,000개 → 국경 너머 적장 피드백 =====
S[1]=()=>{
  setSky('#b4cde6','#eef3f7 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde7ef,25,90);addLights(scene,{hemi:1.5});
  const r=rng(41);ground(scene,0x9cb97a,300);
  tent(scene,-5,-4,0x6f8a55,1.3);tent(scene,5.5,-5,0x6f8a55,1.2);for(let i=0;i<8;i++)tree(scene,(i-3.5)*4+r(),-12-r()*4,1.1,0x76a866);
  const WB=whiteboard(scene,{w:4.2,h:2.6,base:1.7});WB.position.set(0,0,-1);
  const A=arrowsList(7,220);const KEEP=[12,57,140];
  const gens=[];for(let i=0;i<11;i++){const p=entj(r,GEN);const row=i<6?0:1;p.position.set((i%6-2.5)*0.72+(row?0.36:0),0,0.15+row*0.75+r()*0.1);p.rotation.y=Math.PI+(r()-0.5)*0.4;scene.add(p);gens.push({p,ph:r()*6,row})}
  const bubs=[['여기로!',0],['아니 이쪽!',3],['비효율적!',7],['제가 할게요',4],['근거는요?',9]].map(([tx,i],k)=>({b:bubS(gens[i].p,tx,{y:2.5,size:0.0026}),d:0.5+k*0.62,i}));
  const confused=gens.slice(0,6).map((g,i)=>bubS(g.p,i%2?'?':'…',{y:2.45,size:0.0028}));
  // 국경 너머 언덕 (멀리 떨어진 세트)
  const HL=new THREE.Group();HL.position.x=120;scene.add(HL);
  {const hill=new THREE.Mesh(new THREE.ConeGeometry(6,2.2,8),lamb(0x8fb07a));hill.position.set(0,-0.2,-1.5);HL.add(hill);
   for(let i=0;i<5;i++){const tt=new THREE.Group();HL.add(tt)}}
  const EJ=entj(r,ENEMYG);EJ.position.set(0,0.85,-1.2);HL.add(EJ);
  const bn=binoc();EJ.userData.head.add(bn);bn.position.set(0,0.26,0.36);
  const mg=megaphone();mg.rotation.x=-Math.PI/2;EJ.userData.hip.add(mg);mg.position.set(0,0.95,0.42);
  const bE=bubF(EJ,'피드백 드릴게요',{y:2.3,size:0.0032});
  const C=cam(50);const E=EV(1);
  const TS=at(1,'e2',-0.4),TB=at(1,'e2',1.4),TERASE=at(1,'e2',2.6),TAH=at(1,'e2',4.27),TGONE=at(1,'e2',5.1);
  const ch=chip('작전 0개 · 채택 0개');
  return t=>{
    // 화살표 개수
    let mode,n;
    if(t<TERASE){n=Math.min(A.length,Math.floor(6+Math.pow(clamp01(t/3.6),1.4)*A.length));mode='all'}
    else if(t<TGONE){n=A.length;mode='keep'}else{n=A.length;mode='none'}
    const er=clamp01((t-TERASE)/0.6);const key=mode+n+(mode==='keep'?Math.round(er*10):'');
    if(WB.userData.last!==key){WB.userData.last=key;const x=WB.userData.ctx,w=WB.userData.c.width,h=WB.userData.c.height;boardBase(x,w,h,{title:'작전 회의 (전원 장군)'});
      if(mode==='all')for(let i=0;i<n;i++)drawArrow(x,A[i]);
      else if(mode==='keep'){x.globalAlpha=1-er;for(let i=0;i<n;i++)if(!KEEP.includes(i))drawArrow(x,A[i]);x.globalAlpha=1;KEEP.forEach(i=>drawArrow(x,A[i],1,'#e0352b',12))}
      WB.userData.tex.needsUpdate=true}
    const cnt=t<TERASE?Math.round(3000*clamp01(t/3.6)):(t<TGONE?3:0);
    ch.textContent=`작전 ${fmt(cnt)}개 · 채택 0개`;chipPop(ch,t,0.3);ch.style.opacity=(t<TS||t>TB)?1:0;
    gens.forEach((g,i)=>{stern(g.p);glint(g.p,t);const busy=t<TERASE;
      if(busy){const a=g.p.userData.arms[1];a.rotation.x=-2.0+Math.sin(t*7+g.ph)*0.35;a.rotation.z=Math.sin(t*5+g.ph)*0.3;g.p.position.x+=Math.sin(t*3+g.ph)*0.002}
      else{g.p.userData.head.rotation.x=-0.15}});
    bubs.forEach(q=>show(q.b,t,q.d,q.d+0.9));
    confused.forEach((b,i)=>show(b,t,TERASE+0.4+i*0.05,99));
    // 적장
    const far=t>=TS&&t<TB;const binK=t<at(1,'e2',0.25);
    standPose(EJ);bn.visible=binK;mg.visible=!binK;
    if(binK){EJ.userData.arms[0].rotation.x=-2.3;EJ.userData.arms[1].rotation.x=-2.3;EJ.userData.arms[0].rotation.z=-0.35;EJ.userData.arms[1].rotation.z=0.35}
    else{EJ.userData.arms[1].rotation.x=-1.75;EJ.userData.arms[0].rotation.x=0}
    show(bE,t,at(1,'e2',0.25),TB);
    if(far){const k=ease((t-TS)/1.8);C.fov=40;C.updateProjectionMatrix();C.position.set(120+1.2,2.5,4.2-k*0.8);C.lookAt(120,2.2,-1.2)}
    else if(t<TS){const k=ease(t/4.4);C.fov=50;C.updateProjectionMatrix();C.position.set(1.6-k*1.2,3.1,6.6-k*0.6);C.lookAt(0,2.75,-1)}
    else{const z=t<TAH?0:ease((t-TAH)/0.5);const kp=A[KEEP[1]];
      C.fov=50-z*8;C.updateProjectionMatrix();C.position.set(0.2-z*0.2,3.1,6.0-z*1.2);C.lookAt(0,2.8,-1)}
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 이등병 발견 → 주머니에서 별 네 개 =====
S[2]=()=>{
  setSky('#b8d1e8','#f0f4f7 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde7ef,25,90);addLights(scene,{hemi:1.5});
  const r=rng(52);ground(scene,0x9cb97a,300);
  tent(scene,-6,-6,0x6f8a55,1.3);tent(scene,6,-7,0x6f8a55,1.3);for(let i=0;i<10;i++)tree(scene,(i-4.5)*4+r(),-14-r()*4,1.1,0x76a866);
  for(let i=0;i<4;i++){const cr=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.6,0.8),lamb(0x9a7a50));cr.position.set(3.0+(i%2)*0.85,0.3+Math.floor(i/2)*0.6,-1.4);scene.add(cr)}
  const crowd=[];for(let i=0;i<14;i++){const p=entj(r,GEN);const a=i/14*Math.PI*2;p.position.set(Math.cos(a)*(1.6+r()*1.0)-1.8,0,Math.sin(a)*(1.2+r()*0.7)-1.4);p.rotation.y=r()*6.28;scene.add(p);crowd.push(p)}
  const G=entj(r,GEN);G.position.set(-1.6,0,2.0);scene.add(G);
  const P=addFace(makePerson(r,{shirt:ALLY.shirt,pants:ALLY.pants}));{const h=P.userData.head;h.children[1].visible=false;
    const hm=new THREE.Mesh(new THREE.SphereGeometry(0.29,12,8,0,Math.PI*2,0,Math.PI*0.5),lamb(ALLY.helm));hm.position.y=0.27;h.add(hm);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.33,0.035,14),lamb(ALLY.helm));rim.position.y=0.28;h.add(rim)}
  P.position.set(2.9,0,-0.2);P.rotation.y=-0.9;scene.add(P);
  const bar=plate(BAR_T,0.28);bar.position.set(0,0.4,0.29);bar.rotation.x=-0.25;P.userData.head.add(bar);
  const st=plate(STAR_T,0.28);st.position.set(0,0.4,0.295);st.rotation.x=-0.25;P.userData.head.add(st);
  const inHand=plate(STAR_T,0.24);P.userData.arms[1].add(inHand);inHand.position.set(0,-0.68,0.1);
  const pg=glowSprite('rgba(255,236,150,1)',1.2);P.userData.head.add(pg);pg.position.set(0,0.42,0.35);
  const spares=crowd.map(p=>{const m=plate(STAR_T,0.26);p.userData.arms[1].add(m);m.position.set(0,-0.7,0.12);m.visible=false;return m});
  const spk=sparkles(scene,10,r);
  const bG=bubS(G,'자네, 돌격해.',{y:2.55}),bP=topB(bub(P,'저도 별 네 개인데요.',{y:1.95,bg:'#eef7e0',fg:'#2b3a10',size:0.0015})),bQ=bubS(G,'…',{y:2.55});
  const E=EV(2);const C=cam(50);const ch=chip('명령 받을 사람: 0명');
  const FIND=E.find,TG=at(2,'g1'),STK=E.stick,SP=E.spares;
  return t=>{
    crowd.forEach((p,i)=>{stern(p);glint(p,t)});
    stern(G);glint(G,t);stern(P);
    // 장군: 두리번 → 발견 → 가리킴
    if(t<FIND){G.userData.head.rotation.y=Math.sin(t*5)*0.6;walkPose(G,t*5,0.35);G.position.set(-1.6+t*0.4,0,2.0-t*0.2);G.rotation.y=0.6}
    else{G.position.set(-1.6+FIND*0.4,0,2.0-FIND*0.2);G.rotation.y=1.3;const k=ease((t-FIND-0.3)/0.3);G.userData.arms[1].rotation.x=-1.5*k*(t<STK+0.2?1:0)}
    // 이등병: 주머니 → 붙이기
    const pk=clamp01((t-(STK-0.9))/0.45),up=clamp01((t-(STK-0.45))/0.45);
    const a=P.userData.arms[1];
    if(t<STK-0.9){}else if(t<STK-0.45){a.rotation.x=0.25*pk;a.rotation.z=0.25*pk}
    else if(t<STK+0.25){a.rotation.x=-2.75*ease(up);a.rotation.z=0.55*ease(up)}
    else{const d=ease((t-STK-0.25)/0.3);a.rotation.x=-2.75*(1-d);a.rotation.z=0.55*(1-d)}
    inHand.visible=t>STK-0.6&&t<STK;st.visible=t>=STK;bar.visible=t<STK;
    const gk=t>=STK?clamp01(1-(t-STK)/0.6):0;pg.material.opacity=gk;pg.scale.setScalar(0.6+gk*1.2);
    // 여분 별
    crowd.forEach((p,i)=>{const k=ease((t-SP-0.2-i*0.05)/0.3);if(t>SP){handUp(p,k)}spares[i].visible=t>SP+0.15+i*0.05});
    updSpk(spk,t,crowd.slice(0,10).map(p=>headPos(p,0.9)),t>SP+0.3?1:0);
    show(bG,t,TG,STK-0.9);show(bQ,t,STK+0.35,SP);show(bP,t,at(2,'s1'),SP+0.2);
    // 카메라
    if(t<FIND+0.2){const k=ease(t/1.0);C.fov=50;C.updateProjectionMatrix();C.position.set(-3.6,2.4,4.8);C.lookAt(-0.6+k*2.6,1.6,0.2)}
    else if(t<STK-1.1){const k=ease((t-FIND-0.2)/1.0);C.fov=50;C.updateProjectionMatrix();C.position.set(-3.0+k*0.5,2.1,3.6);C.lookAt(1.6,1.5,-0.2)}
    else if(t<SP){const hp=headPos(P,0.3);const k=ease((t-STK+1.1)/0.6);C.fov=44;C.updateProjectionMatrix();C.position.set(hp.x-0.78*(2.3+0.8*(1-k))+0.3,hp.y+0.2,hp.z+0.62*(2.3+0.8*(1-k))+0.3);C.lookAt(hp.x,hp.y-0.05,hp.z)}
    else{const k=ease((t-SP)/1.4);C.fov=54;C.updateProjectionMatrix();C.position.set(1.2-k*1.0,2.9+k*0.8,4.4+k*1.4);C.lookAt(-0.6,1.6,-1.0)}
    chipPop(ch,t,at(2,'n3'));ch.style.opacity=t>at(2,'n3')?1:0;
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 적진 텐트에 병사 빌리러 → "내일 아침 9시, 발표로" =====
S[3]=()=>{
  setSky('#c7c0e6','#f2f0f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe6e2f2,25,90);addLights(scene,{hemi:1.5});
  const r=rng(63);ground(scene,0xa6b88a,300);
  tent(scene,0,-6,0x6d62ad,1.6);tent(scene,-6,-7,0x6d62ad,1.2);tent(scene,6.5,-7,0x6d62ad,1.2);for(let i=0;i<10;i++)tree(scene,(i-4.5)*4+r(),-15-r()*4,1.1,0x86a874);
  flag(scene,-3.2,-3.6,0x7c74b8,4.2,1.4);
  const WB=whiteboard(scene,{w:3.4,h:2.1});WB.position.set(3.4,0,-3.2);WB.rotation.y=-0.3;
  {const x=WB.userData.ctx,w=WB.userData.c.width,h=WB.userData.c.height;boardBase(x,w,h,{title:'적군 작전 회의'});arrowsList(99,200).forEach(A=>drawArrow(x,A));WB.userData.tex.needsUpdate=true}
  const foes=[];for(let i=0;i<9;i++){const p=entj(r,ENEMYG);p.position.set(2.2+(i%5)*0.6,0,-2.2+Math.floor(i/5)*0.7);p.rotation.y=Math.PI-0.3+(r()-0.5)*0.3;scene.add(p);foes.push({p,ph:r()*5})}
  table(scene,0,0,1.6,1.0);chair(scene,-1.05,0,Math.PI/2);chair(scene,1.05,0,-Math.PI/2);
  const G=entj(r,GEN);scene.add(G);const bc=holdIn(G,briefcase(),1,0,-0.66,0.05);bc.rotation.y=Math.PI/2;
  const EJ=entj(r,ENEMYG);EJ.position.set(1.0,0,0);EJ.rotation.y=-Math.PI/2;scene.add(EJ);
  const b1=bubS(G,'병사 좀 빌려주실 수…?',{y:2.0,size:0.0023}),b2=bubF(EJ,'저희도 빌리러 가려던 참',{y:2.0,size:0.0023}),
        d1=bubS(G,'…',{y:2.0}),d2=bubF(EJ,'…',{y:2.0}),b3=bubF(EJ,'제 밑으로 들어오시죠',{y:2.0,size:0.0023}),b4=bubS(G,'내일 아침 9시, 발표로.',{y:2.0,size:0.0024});
  [b1,b2,d1,d2,b3,b4].forEach(b=>b.position.z=0.55);const E=EV(3);const C=cam(48);const ch=chip('병사 합계: 0명 + 0명 = 0명');
  const WK=1.0;
  return t=>{
    foes.forEach(q=>{stern(q.p);glint(q.p,t);const a=q.p.userData.arms[1];a.rotation.x=-2.0+Math.sin(t*6+q.ph)*0.3});
    stern(G);stern(EJ);glint(G,t);glint(EJ,t);
    if(t<WK){const k=t/WK;G.position.set(-5+4*k,0,0.6-0.6*k);G.rotation.y=Math.PI/2;walkPose(G,t*7,0.5)}
    else{G.position.set(-1.0,0,0);G.rotation.y=Math.PI/2;sitPose(G);bc.visible=false}
    sitPose(EJ);if(t<WK){standPose(EJ)}
    const TG3=at(3,'g3');
    if(t>endOf(3,'g3',-0.4)){watchLook(G,ease((t-endOf(3,'g3',-0.4))/0.3));watchLook(EJ,ease((t-endOf(3,'g3',-0.4))/0.3))}
    if(t>at(3,'e4')&&t<endOf(3,'e4')){const a=EJ.userData.arms[1];a.rotation.x=-1.3;a.rotation.z=-0.6}
    show(b1,t,at(3,'g2'),endOf(3,'g2',0.2));show(b2,t,at(3,'e3'),endOf(3,'e3',0.2));
    show(d1,t,E.silence,at(3,'e4'));show(d2,t,E.silence+0.15,at(3,'e4'));
    show(b3,t,at(3,'e4'),endOf(3,'e4',0.2));show(b4,t,TG3,99);
    if(t<WK+0.2){C.fov=50;C.updateProjectionMatrix();C.position.set(-2.5,2.6,6.5);C.lookAt(-1,1.4,-1)}
    else if(t<E.silence){const k=ease((t-WK)/3);C.fov=50;C.updateProjectionMatrix();C.position.set(0.2,2.3,5.4-k*0.6);C.lookAt(0,1.35,-0.2)}
    else if(t<at(3,'e4')){const k=ease((t-E.silence)/0.9);C.fov=50-k*10;C.updateProjectionMatrix();C.position.set(0,2.0,4.6);C.lookAt(0,1.4,0)}
    else{const k=ease((t-at(3,'e4'))/4);C.fov=50;C.updateProjectionMatrix();C.position.set(0.4-k*0.6,2.3,5.2);C.lookAt(0,1.35,-0.2)}
    chipPop(ch,t,E.silence);ch.style.opacity=t>E.silence&&t<at(3,'g3')?1:0;
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 다음 날 9:00 PPT 대결 =====
function slideTex(lines,o={}){return canvasTex(1024,576,(x,w,h)=>{x.fillStyle=o.bg||'#ffffff';x.fillRect(0,0,w,h);x.fillStyle=o.bar||'#2e4a8f';x.fillRect(0,0,w,110);
  x.fillStyle='#fff';x.font=`900 58px ${FONT}`;x.textBaseline='middle';x.fillText(lines[0],44,58);
  x.fillStyle='#222';x.font=`800 46px ${FONT}`;lines.slice(1).forEach((l,i)=>x.fillText(l,60,200+i*90));
  if(o.chart){const c=o.chart;c.forEach((v,i)=>{x.fillStyle=i===c.length-1?'#e2552d':'#8fb4e0';x.fillRect(560+i*110,520-v*3,80,v*3)})}
  x.fillStyle='#999';x.font=`700 30px ${FONT}`;x.fillText(o.page||'',w-150,h-36)})}
S[4]=()=>{
  setSky('#a9cdef','#f1f6fa 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde9f2,30,95);addLights(scene,{hemi:1.5});
  const r=rng(74);field(scene,r,{mz:-6});
  const mk=(x,ry,col)=>{const g=new THREE.Group();const sc=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.8),new THREE.MeshBasicMaterial({map:null}));sc.position.y=2.55;g.add(sc);
    const fr=new THREE.Mesh(new THREE.BoxGeometry(3.35,1.95,0.06),lamb(0x333338));fr.position.set(0,2.55,-0.04);g.add(fr);
    for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.07,1.65,0.07),lamb(0x55555c));l.position.set(s*1.4,0.82,-0.05);g.add(l)}
    g.position.set(x,0,-1.5);g.rotation.y=ry;scene.add(g);g.userData.sc=sc;return g};
  const SA=mk(-1.9,0.18),SB=mk(1.9,-0.18);
  const AL=[slideTex(['전쟁 효율화 방안','· 지휘 일원화','· 작전 3개로 축소','· 지휘관: 본인'],{page:'p.3'}),slideTex(['지휘 경험 비교','· 회의 진행 1,204회','· 결론 도출률 100%'],{chart:[40,60,80,140],page:'p.9'}),
    slideTex(['p.17 보급 효율','· 보급로 단축 → +200%','· 비용 -38%'],{chart:[30,50,120],page:'p.17'}),slideTex(['부록 A. 근거 자료','· 출처 47건','· 원본 데이터 첨부'],{bar:'#2b6b4f',page:'부록 1/48'})];
  const FL=[slideTex(['제가 지휘해야 하는 이유','1. 결단력','2. 실행력','3. 그냥 제가 더 빠름'],{bar:'#5b5199',page:'p.2'}),slideTex(['양군 통합 로드맵','· Q1 합병','· Q2 지휘 일원화(본인)'],{bar:'#5b5199',chart:[50,90,150],page:'p.11'}),
    slideTex(['반론 예상 & 재반박','· "근거 있어요?"','· → 있습니다'],{bar:'#5b5199',page:'p.24'})];
  const G=entj(r,GEN),EJ=entj(r,ENEMYG);G.position.set(-2.9,0,0.5);G.rotation.y=0.35;EJ.position.set(2.9,0,0.5);EJ.rotation.y=-0.35;scene.add(G);scene.add(EJ);
  const aud=[];for(let row=0;row<3;row++)for(let c=0;c<8;c++){const side=c<4?GEN:ENEMYG;const p=entj(r,side);p.position.set((c-3.5)*1.0+(c<4?-0.4:0.4),0,4.3+row*1.1);p.rotation.y=Math.PI;scene.add(p);aud.push(p)}
  const dots=[glowSprite('rgba(255,40,40,1)',0.35),glowSprite('rgba(255,40,40,1)',0.35)];dots.forEach(d=>scene.add(d));
  const beams=dots.map(()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,1,4),basic(0xff3030));scene.add(m);return m});
  const bE=bubF(EJ,'17페이지, 근거 있어요?',{y:2.4,size:0.0021}),bG=bubS(G,'부록에 있습니다.',{y:2.4,size:0.0021});
  const C=cam(50);const ch=chip('다음 날 오전 9:00'),ch2=chip('발사된 포탄 0발 · 넘긴 슬라이드 0장',330);
  const TE5=at(4,'e5'),TG4=at(4,'g4');const _a=new THREE.Vector3(),_b=new THREE.Vector3();
  return t=>{
    [...aud,G,EJ].forEach(p=>{stern(p);glint(p,t)});
    const ia=t<TE5-0.2?Math.min(1,Math.floor(t/1.6)):(t<TG4-0.1?2:3);const ib=Math.min(2,Math.floor(t/1.9));
    SA.userData.sc.material.map=AL[ia];SB.userData.sc.material.map=FL[ib];SA.userData.sc.material.needsUpdate=true;SB.userData.sc.material.needsUpdate=true;
    // 레이저 포인터
    [G,EJ].forEach((p,i)=>{const a=p.userData.arms[1];a.rotation.x=-1.35;a.rotation.z=i?0.25:-0.25;
      const scr=i?SA:SB;const tgt=new THREE.Vector3(Math.sin(t*(2.3+i)+i*2)*1.1,2.55+Math.sin(t*3.1+i)*0.55,0.02);
      const cross=(t>2&&t<TE5)?1:0;const S2=(Math.sin(t*1.3+i*3)>0.2&&cross)?scr:(i?SB:SA);S2.localToWorld(_b.copy(tgt));
      p.updateMatrixWorld(true);a.children[1].getWorldPosition(_a);dots[i].position.copy(_b);
      const m=beams[i];m.position.copy(_a).add(_b).multiplyScalar(0.5);m.scale.y=_a.distanceTo(_b);m.lookAt(_b);m.rotateX(Math.PI/2)});
    show(bE,t,TE5,endOf(4,'e5',0.3));show(bG,t,TG4,99);
    const sl=Math.min(96,Math.round(t/(VOICE[4]+0.4)*96));ch2.textContent=`발사된 포탄 0발 · 넘긴 슬라이드 ${sl}장`;
    chipPop(ch,t,0.1);ch.style.opacity=t<1.6?1:0;chipPop(ch2,t,1.4);ch2.style.top='230px';ch2.style.opacity=t>1.6?1:0;
    if(t<TE5-0.3){const k=ease(t/4);C.fov=56;C.updateProjectionMatrix();C.position.set(0,4.4-k*0.3,8.4-k*1.2);C.lookAt(0,2.1,-1.5)}
    else if(t<TG4-0.1){const k=ease((t-TE5+0.3)/1.2);C.fov=50;C.updateProjectionMatrix();C.position.set(1.0,2.5,3.5-k*0.2);C.lookAt(2.6,2.0,0)}
    else{const k=ease((t-TG4+0.1)/1.0);C.fov=50;C.updateProjectionMatrix();C.position.set(-1.0,2.5,3.5-k*0.2);C.lookAt(-2.6,2.0,0)}
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. 서로 첨삭 → 밤샘 타임랩스 =====
const MAP_T=canvasTex(1024,700,(x,w,h)=>{x.fillStyle='#efe3c4';x.fillRect(0,0,w,h);x.strokeStyle='#c9b58a';x.lineWidth=3;for(let i=0;i<12;i++){x.beginPath();x.moveTo(0,i*60);x.lineTo(w,i*60+30);x.stroke()}
  x.strokeStyle='#5b5199';x.lineWidth=14;x.setLineDash([]);x.beginPath();const P=[[80,600],[260,180],[330,560],[520,120],[600,520],[760,160],[940,420]];P.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke();
  x.fillStyle='#5b5199';x.font=`900 54px ${FONT}`;x.fillText('적군 보급로',60,70)});
const RED_T=canvasTex(1024,700,(x,w,h)=>{x.strokeStyle='#e0352b';x.lineWidth=18;x.lineCap='round';x.beginPath();x.moveTo(90,610);x.lineTo(930,420);x.stroke();
  const X=(a,b)=>{x.beginPath();x.moveTo(a-40,b-40);x.lineTo(a+40,b+40);x.moveTo(a+40,b-40);x.lineTo(a-40,b+40);x.stroke()};X(260,180);X(520,120);X(760,160);
  x.fillStyle='#e0352b';x.font=`900 64px ${FONT}`;x.fillText('비효율!',600,640)});
function rosterTex(red){return canvasTex(320,436,(x,w,h)=>{x.fillStyle='#fffdf2';x.fillRect(0,0,w,h);x.fillStyle='#2e3a20';x.font=`900 34px ${FONT}`;x.fillText('아군 편성표',30,50);
  x.font=`700 22px ${FONT}`;for(let i=0;i<12;i++)x.fillText(`${i+1}중대 · 장군 ${200+i*13}명`,30,100+i*27);
  if(red){x.strokeStyle='#e0352b';x.lineWidth=7;x.beginPath();x.moveTo(20,80);x.lineTo(300,420);x.stroke();x.fillStyle='#e0352b';x.font=`900 40px ${FONT}`;x.fillText('전부 장군?',60,250)}})}
S[5]=()=>{
  setSky('#f2b48a','#ffe2c2 70%');
  const scene=new THREE.Scene();addLights(scene,{hemi:1.3,sun:0xffe0c0});
  const r=rng(85);ground(scene,0x8fa874,300);tent(scene,0,-4.5,0x8a8f6a,1.4);for(let i=0;i<8;i++)tree(scene,(i-3.5)*4+r(),-11-r()*3,1.1,0x76a866);
  const st=stars(scene,140,r,{w:90,y0:6,h:30,z:-40});
  table(scene,0,0,2.2,1.4,0x8a6a48);
  const map=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),new THREE.MeshLambertMaterial({map:MAP_T}));map.rotation.x=-Math.PI/2;map.rotation.z=Math.PI;map.position.set(0,0.905,0);scene.add(map);
  const red=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),new THREE.MeshBasicMaterial({map:RED_T,transparent:true}));red.rotation.x=-Math.PI/2;red.rotation.z=Math.PI;red.position.set(0,0.91,0);scene.add(red);
  const ros=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.68),new THREE.MeshLambertMaterial({map:rosterTex(false),side:THREE.DoubleSide}));scene.add(ros);const rosR=rosterTex(true);
  const stack=[];for(let i=0;i<14;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.012,0.56),lamb(i%3?0xfffdf2:0xffe9e6));p.position.set(i%2?-0.75:0.75,0.92+Math.floor(i/2)*0.014,0.35);p.rotation.y=(r()-0.5)*0.3;scene.add(p);stack.push(p)}
  const G=entj(r,GEN),EJ=entj(r,ENEMYG);G.position.set(-1.0,0,0.95);G.rotation.y=Math.PI*0.8;EJ.position.set(1.0,0,0.95);EJ.rotation.y=-Math.PI*0.8;scene.add(G);scene.add(EJ);
  const pen=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.3,6),lamb(0xe0352b));holdIn(G,pen,1,0,-0.7,0.05);
  const pen2=pen.clone();holdIn(EJ,pen2,1,0,-0.7,0.05);
  const bE=bubF(EJ,'…이건 더 심각한데요?',{y:2.3,size:0.0021});scene.add(bE);bE.position.set(0.35,2.45,0.9);
  const E=EV(5);const C=cam(48);const ch=chip('양국 군사력 100% · 싸울 병사 0명');
  const TG=at(5,'g5'),GR=E.grab,LP=E.lapse;const TEND=VOICE[5]+0.7;
  return t=>{
    stern(G);stern(EJ);glint(G,t);glint(EJ,t);
    const writeG=t>TG&&t<GR,writeE=t>endOf(5,'e6',-0.2),both=t>LP;
    const scr=(p,on,ph)=>{const a=p.userData.arms[1];if(on){a.rotation.x=-1.1+Math.sin(t*14+ph)*0.08;a.rotation.z=Math.sin(t*9+ph)*0.15;p.userData.head.rotation.x=0.45}};
    scr(G,writeG||both,0);scr(EJ,writeE||both,1);
    red.material.opacity=clamp01((t-TG-0.3)/2.2);
    // 편성표 뺏기
    const gk=ease((t-GR)/0.5);ros.position.set(-0.75+gk*1.5,0.95+Math.sin(gk*Math.PI)*0.35+(t>GR+0.5?0.3:0),0.35-(t>GR+0.5?0.15:0));
    ros.rotation.set(t>GR+0.5?-0.9:-Math.PI/2,t>GR+0.5?-0.5:0,0);if(t>GR+0.5){EJ.userData.arms[0].rotation.x=-1.2}
    if(t>at(5,'e6',0.6)&&ros.material.map!==rosR){ros.material.map=rosR;ros.material.needsUpdate=true}
    stack.forEach((p,i)=>p.visible=both&&(t-LP)/(TEND-LP)*14>i);
    show(bE,t,at(5,'e6'),LP);
    const lk=clamp01((t-LP)/(TEND-LP));
    if(both){const sky=lk<0.5?lerpCol('#f2b48a','#1b2148',lk*2):lerpCol('#1b2148','#f6c7a6',(lk-0.5)*2);const sky2=lk<0.5?lerpCol('#ffe2c2','#3a3f6b',lk*2):lerpCol('#3a3f6b','#fff0d8',(lk-0.5)*2);setSky(sky,sky2);st.visible=lk>0.25&&lk<0.8}
    else st.visible=false;
    const pct=both?Math.round(100+200*lk):100;ch.textContent=`양국 군사력 ${pct}% · 싸울 병사 0명`;chipPop(ch,t,LP);ch.style.opacity=both?1:0;
    if(both){const tm=lk<0.5?`PM ${7+Math.floor(lk*10)}:00`:`AM ${Math.floor((lk-0.5)*12)}:00`;ch.textContent=`${tm} · 군사력 ${pct}% · 병사 0명`}
    if(t<GR-0.2){const k=ease((t-0.2)/3.5);C.fov=48;C.updateProjectionMatrix();C.position.set(0.3,3.0-k*0.3,-2.2+k*0.3);C.lookAt(0,1.05,0.45)}
    else if(!both){C.fov=48;C.updateProjectionMatrix();C.position.set(1.4,2.6,-2.7);C.lookAt(0.6,1.5,0.7)}
    else{const k=ease((t-LP)/4);C.fov=50;C.updateProjectionMatrix();C.position.set(Math.sin(-0.6+k*1.2)*3.0,2.8+k*0.4,-Math.cos(-0.6+k*1.2)*3.0);C.lookAt(0,1.2,0.4)}
    caption(5,t);renderer.render(scene,C);
  };
};

// ===== 6. 합병 → 대표 투표 → 전원 1표 → 재투표 =====
S[6]=()=>{
  setSky('#e7e2d6','#f7f4ec 70%');
  const scene=new THREE.Scene();addLights(scene,{hemi:1.4});
  const r=rng(96);const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xb79a78));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(40,12),lamb(0xe6dccb));wall.position.set(0,6,-6);scene.add(wall);
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(6,1.0),new THREE.MeshBasicMaterial({map:canvasTex(1200,200,(x,w,h)=>{x.fillStyle='#2e4a8f';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font=`900 92px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('통합 국가 대표 선출',w/2,h/2+4)})}));ban.position.set(0,4.2,-5.95);scene.add(ban);
  table(scene,0,-0.6,5.4,1.2,0x7a5a3c);
  const box=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.6,0.5),lamb(0xf2f2f2));box.position.set(2.0,1.2,-0.6);scene.add(box);
  const slot=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.02,0.06),lamb(0x222222));slot.position.set(2.0,1.51,-0.6);scene.add(slot);
  const ppl=[];for(let row=0;row<3;row++)for(let c=0;c<9;c++){if(row===0&&(c===4||c===3))continue;const p=entj(r,(c+row)%2?GEN:ENEMYG);p.position.set((c-4)*0.95+(row%2)*0.3,0,1.3+row*1.0);p.rotation.y=Math.PI;scene.add(p);
    const bl=paper('#ffffff',null,0.28,0.38);p.userData.arms[1].add(bl);bl.position.set(0,-0.7,0.12);bl.visible=false;ppl.push({p,bl,ph:r()*5})}
  const G=entj(r,GEN),EJ=entj(r,ENEMYG);G.position.set(-0.7,0,-1.5);EJ.position.set(0.7,0,-1.5);scene.add(G);scene.add(EJ);
  const bE=bubF(EJ,'차라리 합병하죠',{y:2.4,size:0.0022}),bG=bubS(G,'대표는 투표로.',{y:2.4,size:0.0022}),rG=bubS(G,'…재투표.',{y:2.35,size:0.0028}),rE=bubF(EJ,'…재투표.',{y:2.75,size:0.0028});rG.position.x=-0.25;rE.position.x=0.25;
  // 개표 화면 / 투표용지
  const board=div('vboard');board.style.cssText='position:absolute;left:90px;top:200px;width:900px;height:960px;background:#1f2a44;border-radius:36px;box-shadow:0 30px 70px rgba(0,0,0,.35);padding:40px;box-sizing:border-box;color:#fff';
  board.innerHTML=`<div style="font-size:56px;font-weight:900;text-align:center">개표 결과</div><div style="font-size:34px;font-weight:700;text-align:center;color:#ffd84d;margin:10px 0 24px">후보 6,000명 · 투표 6,000표</div><div class="bars" style="position:relative;height:620px;display:flex;align-items:flex-end;gap:4px;border-bottom:4px solid #8fa0c8"></div><div style="font-size:44px;font-weight:900;text-align:center;margin-top:26px">전원 <span style="color:#ff6b5a">1표</span> · 당선자 없음</div>`;
  const bars=board.querySelector('.bars');for(let i=0;i<60;i++){const b=document.createElement('div');b.style.cssText=`flex:1;background:${i%2?'#7c74b8':'#7f9b5a'};height:0;border-radius:6px 6px 0 0`;bars.appendChild(b)}
  const ballots=div('ballots');ballots.style.cssText='position:absolute;left:70px;right:70px;top:200px;display:grid;grid-template-columns:repeat(3,1fr);gap:26px';
  const NM=['김장군','박장군','이장군','최장군','정장군','강장군'];
  ballots.innerHTML=NM.map((n,i)=>`<div style="background:#fffdf5;border-radius:18px;padding:26px 14px;text-align:center;box-shadow:0 12px 26px rgba(0,0,0,.25);transform:rotate(${(i%3-1)*3}deg)"><div style="font-size:28px;font-weight:800;color:#777">투표용지</div><div style="margin:18px auto 10px;width:150px;height:150px;border:6px solid #e0352b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#1d3b8f">${n}</div><div style="font-size:30px;font-weight:900;color:#e0352b">투표자: ${n}</div></div>`).join('');
  const E=EV(6);const C=cam(50);const TB=E.bars,TN2=at(6,'n6',2.44),TR=E.redo;
  return t=>{
    stern(G);stern(EJ);glint(G,t);glint(EJ,t);
    ppl.forEach((q,i)=>{stern(q.p);glint(q.p,t);const w=t>E.vote&&t<TB;q.bl.visible=w;if(w){const a=q.p.userData.arms[1];a.rotation.x=-1.0;q.p.userData.head.rotation.x=0.4;const a2=q.p.userData.arms[0];a2.rotation.x=-0.9+Math.sin(t*14+q.ph)*0.1}
      if(t>TR-0.1)handUp(q.p,ease((t-TR+0.1-(i%5)*0.05)/0.3)*0)});
    if(t>TR-0.15){handUp(G,ease((t-TR+0.15)/0.2));handUp(EJ,ease((t-TR+0.15)/0.2))}
    else if(t>at(6,'g6')){G.userData.arms[1].rotation.x=-0.6}
    show(bE,t,at(6,'e7'),endOf(6,'e7',0.1));show(bG,t,at(6,'g6'),E.vote);show(rG,t,TR,99);show(rE,t,TR+0.05,99);
    const showB=t>=TB&&t<TN2,showP=t>=TN2&&t<TR-0.2;
    board.style.display=showB?'block':'none';board.style.transform=`scale(${pop((t-TB)/0.3)})`;
    [...bars.children].forEach((b,i)=>b.style.height=(ease((t-TB-0.3-i*0.008)/0.6)*520)+'px');
    ballots.style.display=showP?'grid':'none';[...ballots.children].forEach((b,i)=>{b.style.opacity=clamp01((t-TN2-i*0.12)/0.12)});
    if(t<E.vote){const k=ease(t/4.5);C.fov=46;C.updateProjectionMatrix();C.position.set(0,4.4,5.2-k*0.3);C.lookAt(0,1.95,-1.5)}
    else if(t<TR-0.2){const k=ease((t-E.vote)/3);C.fov=54;C.updateProjectionMatrix();C.position.set(0,4.4+k*0.6,-2.6);C.lookAt(0,0.8,2.4)}
    else{const k=ease((t-TR)/1.2);C.fov=46;C.updateProjectionMatrix();C.position.set(0,4.4,5.2-k*0.3);C.lookAt(0,2.0,-1.5)}
    if(showB||showP){renderer.clear();setSky('#3a3550','#5b5478')}else{setSky('#e7e2d6','#f7f4ec 70%');renderer.render(scene,C)}
    caption(6,t);
  };
};

// ===== 7. 나라 6,000개 → 혼자 "전원, 집합!" → 엔딩 =====
S[7]=()=>{
  setSky('#9fc7ec','#eef5fb 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2eef7,30,110);addLights(scene,{hemi:1.5});
  const r=rng(107);ground(scene,0x9cbf7a,300);
  const flags=[],houses=[];
  for(let row=0;row<7;row++)for(let c=0;c<9;c++){if(row===0&&c===4)continue;const x=(c-4)*4.6,z=-row*5.2-1;const h=makeHouse(r,{});h.position.set(x,0,z-1.4);scene.add(h);houses.push(h);
    const yd=new THREE.Mesh(new THREE.PlaneGeometry(3.8,2.6),lamb(0xb4d38e));yd.rotation.x=-Math.PI/2;yd.position.set(x,0.01,z+0.6);scene.add(yd);
    const f=flag(scene,x+1.2,z+0.8,new THREE.Color().setHSL(r(),0.6,0.6).getHex(),2.6,1.0);flags.push(f);
    for(const s of[-1,1]){const fe=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,2.6),lamb(0xe8e0d0));fe.position.set(x+s*1.9,0.25,z+0.6);scene.add(fe)}}
  // 주인공 집
  const H=makeHouse(r,{wall:0x7f9b5a,roof:0x4a6136});H.position.set(0,0,-2.4);scene.add(H);
  const yd=new THREE.Mesh(new THREE.PlaneGeometry(3.8,2.6),lamb(0xb4d38e));yd.rotation.x=-Math.PI/2;yd.position.set(0,0.01,-0.4);scene.add(yd);
  const MF=flag(scene,1.2,-0.2,0x56703f,2.8,1.1);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.3,0.42),new THREE.MeshBasicMaterial({map:canvasTex(400,130,(x,w,h)=>{x.fillStyle='#fffdf2';x.fillRect(0,0,w,h);x.fillStyle='#3e4f2e';x.font=`900 56px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('장군국',w/2,h/2+3)})}));
  sign.position.set(-1.3,0.9,0.85);scene.add(sign);const sp=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.7,0.07),lamb(0x6b5238));sp.position.set(-1.3,0.35,0.83);scene.add(sp);
  const G=entj(r,GEN);G.position.set(0,0,-0.6);scene.add(G);
  const others=[];houses.slice(0,18).forEach(h=>{const p=entj(r,r()<0.5?GEN:ENEMYG);p.position.set(h.position.x-0.5,0,h.position.z+1.6);scene.add(p);others.push(p)});
  const bG=bubS(G,'전원, 집합!',{y:2.6,size:0.0034});
  // 지도 쪼개기 (DOM 캔버스)
  const mc=document.createElement('canvas');mc.width=900;mc.height=1000;mc.style.cssText='position:absolute;left:90px;top:190px;border-radius:30px;box-shadow:0 30px 70px rgba(0,0,0,.3)';ui.appendChild(mc);
  const mx=mc.getContext('2d');const pts=[];{const rr2=rng(5);for(let i=0;i<260;i++)pts.push([60+rr2()*780,80+rr2()*840])}
  function drawMap(k){mx.fillStyle='#bfe0f2';mx.fillRect(0,0,900,1000);mx.save();mx.beginPath();mx.moveTo(120,110);mx.bezierCurveTo(500,40,860,160,810,480);mx.bezierCurveTo(780,800,620,960,380,930);mx.bezierCurveTo(120,900,40,600,90,380);mx.closePath();
    mx.fillStyle='#cfe3a8';mx.fill();mx.clip();const n=Math.floor(Math.pow(k,1.6)*pts.length);
    mx.strokeStyle='#5d6a48';mx.lineWidth=3;for(let i=0;i<n;i++){const[a,b]=pts[i];mx.beginPath();mx.moveTo(a-60,b-30);mx.lineTo(a+60,b+30);mx.moveTo(a,b-50);mx.lineTo(a+10,b+50);mx.stroke()}
    const hr=rng(9);for(let i=0;i<Math.min(n,160);i++){const[a,b]=pts[i];mx.fillStyle=`hsl(${hr()*360},60%,62%)`;mx.fillRect(a-6,b-16,3,22);mx.fillRect(a-3,b-16,14,9)}
    mx.restore();mx.fillStyle='#1f2a44';mx.font=`900 52px ${FONT}`;mx.fillText(k<0.05?'통합 국가':'',330,90);
    const cnt=Math.round(1+5999*Math.pow(k,1.6));mx.fillStyle='rgba(255,255,255,.92)';rr(mx,250,890,400,80,40);mx.fill();mx.fillStyle='#e2552d';mx.font=`900 46px ${FONT}`;mx.textAlign='center';mx.fillText(`나라 ${fmt(cnt)}개`,450,945);mx.textAlign='left'}
  const E=EV(7);const C=cam(50);const ch=chip('국가 6,000개 · 국민 각 1명');
  const stat=div('statbox','<div><small>사상자</small><b>0명</b></div><div><small>나라</small><b>6,000개</b></div>');
  const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');
  const TM1=E.split,T3D=at(7,'n7')+LN(7,'n7')[1]*0.62,SH=E.shout,TS=E.stat,TEND=endOf(7,'n8',0.25);
  let lastK=-1;
  return t=>{
    const mapOn=t<T3D;mc.style.display=mapOn?'block':'none';
    if(mapOn){const k=clamp01((t-TM1)/(T3D-TM1-0.3));const kk=Math.round(k*40)/40;if(kk!==lastK){drawMap(kk);lastK=kk}mc.style.transform=`scale(${0.9+0.1*pop(t/0.35)})`}
    flags.forEach((f,i)=>waveFlag(f,t+i*0.3));waveFlag(MF,t);
    others.forEach(p=>{stern(p);glint(p,t)});stern(G);glint(G,t);
    // 장군: 외침 → 혼자 한 발 앞으로 → 경례
    const stepT=SH+LN(7,'g8')[1]+0.1;
    if(t>SH-0.1&&t<stepT){G.userData.arms[0].rotation.x=-0.4;G.userData.arms[1].rotation.x=-0.4;G.userData.head.rotation.x=-0.15}
    if(t>stepT){const k=ease((t-stepT)/0.4);G.position.z=-0.6+0.7*k;if(t<stepT+0.4)walkPose(G,(t-stepT)*9,0.5);if(t>stepT+0.45)salute(G,ease((t-stepT-0.45)/0.25))}
    show(bG,t,SH,stepT+0.4);
    if(t<SH-0.3){const k=ease((t-T3D)/2.2);C.fov=50;C.updateProjectionMatrix();C.position.set(0,14-k*6,16-k*6);C.lookAt(0,0,-10+k*7)}
    else if(t<TS){const k=ease((t-SH+0.3)/1.5);C.fov=48;C.updateProjectionMatrix();C.position.set(0.8,2.5,6.4-k*0.6);C.lookAt(0,2.2,-1)}
    else{const k=ease((t-TS)/5);C.fov=50;C.updateProjectionMatrix();C.position.set(0,3+k*9,6+k*10);C.lookAt(0,1+k*-0.5,-6)}
    chipPop(ch,t,T3D+0.2);ch.style.opacity=t>T3D+0.2&&t<TS?1:0;
    const ST2=at(7,'n8',0.4);stat.style.opacity=t>ST2&&t<TEND?1:0;stat.style.transform=`translateX(-50%) scale(${pop((t-ST2)/0.3)})`;
    e1.style.opacity=t>TEND?1:0;e2.style.opacity=t>TEND+0.2?1:0;popEl(e1,t,TEND);popEl(e2,t,TEND+0.2);
    if(mapOn){renderer.clear();setSky('#3a3550','#5b5478')}else{setSky('#9fc7ec','#eef5fb 70%');renderer.render(scene,C)}
    caption(7,t);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
