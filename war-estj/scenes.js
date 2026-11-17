// ---------- 공용 소품 (ENTJ 전쟁편에서 가져옴) ----------
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

// ---------- ESTJ 전용 ----------
const AB={bg:'#f2ffd0',fg:'#2b3a10'},FB={bg:'#e4e0ff',fg:'#2d2766'};
function sb(scene,text,x,y,z,o={}){const b=makeBubble(text,{bg:(o.c||AB).bg,fg:(o.c||AB).fg,fs:o.fs||64,size:o.size||0.0024});b.position.set(x,y,z);b.material.depthTest=false;b.renderOrder=10;scene.add(b);scaleBubble(b,0);return b}
function strap(p,col=0x3a3a3a){const s=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.013,6,24,Math.PI),lamb(col));s.rotation.z=Math.PI;s.position.y=0.27;p.userData.head.add(s);p.userData.strap=s;return s}
function dogtag(p){const g=new THREE.Group();const ch=new THREE.Mesh(new THREE.TorusGeometry(0.13,0.008,4,20,Math.PI),lamb(0xc8c8d0));ch.rotation.z=Math.PI;g.add(ch);
  const tg=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.1,0.01),lamb(0xdedee6));tg.position.y=-0.17;g.add(tg);g.position.set(0,0.62,0.17);p.userData.hip.add(g);return g}
function estjS(r,side){const p=brows(soldier(r,side),-0.22);strap(p);return p}
function estjG(r,side){return brows(general(r,side),-0.25)}
function hips(p,k=1){const u=p.userData;u.arms[1].rotation.x=0.15*k;u.arms[1].rotation.z=0.6*k;u.arms[0].rotation.x=0.15*k;u.arms[0].rotation.z=-0.6*k}
function point(p,k=1,up=1.7){const a=p.userData.arms[1];a.rotation.x=-up*k;a.rotation.z=0}
function runPose(p,ph){walkPose(p,ph,0.8);p.userData.hip.rotation.x=0.15}
function setCam(C,p,l,fov=50){C.fov=fov;C.updateProjectionMatrix();C.position.set(...p);C.lookAt(...l)}
function lerp3(a,b,k){return a.map((v,i)=>v+(b[i]-v)*k)}
function cardEl(lines){const d=div('card3');d.innerHTML=lines.map(l=>`<div>${l}</div>`).join('');return d}
{const st=document.createElement('style');st.textContent=`
.card3{position:absolute;left:50%;top:330px;transform:translateX(-50%);background:#fffdf5;border-radius:30px;padding:30px 60px;box-shadow:0 20px 50px rgba(0,0,0,.3);border:8px solid #2a2a2a}
.card3 div{font-size:84px;font-weight:900;color:#2a2a2a;white-space:nowrap;line-height:1.4}
.dim{position:absolute;inset:0;background:rgba(20,16,30,.62)}
.yr{position:absolute;left:50%;top:330px;transform:translateX(-50%);background:#2a2a2a;color:#ffd84d;font-weight:900;font-size:64px;padding:8px 36px;border-radius:999px;white-space:nowrap}
`;document.head.appendChild(st)}
function mapTex(){return canvasTex(1024,700,(x,w,h)=>{x.fillStyle='#e9e2c9';x.fillRect(0,0,w,h);
  x.strokeStyle='#8fb4e0';x.lineWidth=18;x.beginPath();x.moveTo(w*0.55,0);x.bezierCurveTo(w*0.45,h*0.3,w*0.65,h*0.6,w*0.5,h);x.stroke();
  x.fillStyle='rgba(110,150,80,.45)';x.fillRect(60,80,240,180);x.fillRect(700,420,250,200);
  const U=[['1소대',200,520,'#d94c3d'],['2소대',420,560,'#3d7bd9'],['3소대',640,600,'#3da35a']];
  U.forEach(([t,X,Y,c])=>{x.fillStyle=c;rr(x,X-80,Y-40,160,80,14);x.fill();x.fillStyle='#fff';x.font=`900 40px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(t,X,Y+2);
    x.strokeStyle=c;x.lineWidth=12;x.beginPath();x.moveTo(X,Y-50);x.lineTo(X+(X-420)*0.3,Y-260);x.stroke();
    x.beginPath();x.moveTo(X+(X-420)*0.3-26,Y-230);x.lineTo(X+(X-420)*0.3,Y-275);x.lineTo(X+(X-420)*0.3+26,Y-230);x.fillStyle=c;x.fill()});
  x.fillStyle='#6d62ad';x.font=`900 56px ${FONT}`;x.textAlign='center';x.fillText('적군',w/2,90)})}
function meat(){const m=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.035,0.13),new THREE.MeshLambertMaterial({color:0xd9776f,flatShading:true}));return m}
function tongs(){const g=new THREE.Group();for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.02,0.62),lamb(0xc9ccd4));b.position.x=s*0.025;b.rotation.y=s*0.04;g.add(b)}return g}
function grill(scene,x,z){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.36,0.1,24),lamb(0x2a2a2e));g.add(c);
  for(let i=-3;i<=3;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(0.76,0.012,0.012),lamb(0x8a8a90));l.position.set(0,0.055,i*0.1);g.add(l)}
  const gl=glowSprite('rgba(255,140,60,1)',1.1);gl.position.y=0.05;g.add(gl);g.position.set(x,0.93,z);scene.add(g);return g}
function restaurant(scene,r){ground(scene,0x9a7a5c,60);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(30,8),lamb(0xe8cfa6));wall.position.set(0,4,-4);scene.add(wall);
  const side=new THREE.Mesh(new THREE.PlaneGeometry(30,8),lamb(0xdcc097));side.position.set(-7,4,0);side.rotation.y=Math.PI/2;scene.add(side);
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(3.6,0.75),new THREE.MeshBasicMaterial({map:canvasTex(960,200,(x,w,h)=>{x.fillStyle='#c8372d';x.fillRect(0,0,w,h);x.fillStyle='#fff6d0';x.font=`900 96px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('첫 승리 기념 회식',w/2,h/2+4)})}));
  ban.position.set(0,4.5,-3.95);scene.add(ban);
  for(const x of[-2.4,0,2.4]){const cord=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,1.6,4),lamb(0x333333));cord.position.set(x,4.4,-1.2);scene.add(cord);
    const lamp=new THREE.Mesh(new THREE.ConeGeometry(0.32,0.3,12,1,true),new THREE.MeshLambertMaterial({color:0x8a4f3a,side:THREE.DoubleSide}));lamp.position.set(x,3.55,-1.2);scene.add(lamp);
    const gl=glowSprite('rgba(255,210,140,1)',1.4);gl.position.set(x,3.35,-1.2);scene.add(gl)}
}
function sideTable(scene,r,x,z){table(scene,x,z,1.3,1.0,0x8a6a4a);grill(scene,x,z);const P=[];
  [[-0.85,0,Math.PI/2],[0.85,0,-Math.PI/2]].forEach(([dx,dz,ry],i)=>{const p=estjS(r,i?FOE:ALLY);p.position.set(x+dx,0,z+dz);p.rotation.y=ry;sitPose(p);scene.add(p);P.push(p)});return P}


// 진영 이름표 (ENTJ 전쟁편 방식)
function sideTag(p,ally,y=1.95,o={}){const l=labelSprite(ally?'아군':'적군',{bg:ally?'#5f7f3a':'#5b5199',fg:'#fff',fs:64,size:o.size||0.0034});l.center.set(0.5,0);l.material.depthTest=false;l.renderOrder=9;l.position.set(0,y,0.3);p.add(l);return l}
// ===== 0. 작전 회의 3초 (타이틀) =====
S[0]=()=>{
  setSky('#a9c9e8','#eef4f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2ecf4,30,110);addLights(scene,{hemi:1.5});
  const r=rng(11);ground(scene,0x9cb97a,300);
  tent(scene,-5,-9,0x667f48,1.4);tent(scene,5,-9,0x667f48,1.4);flag(scene,-2.6,-2.6,0x7f9b5a,4.2,1.3);
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r(),-14-r()*4,1.1,0x76a866);
  table(scene,0,0,3.0,1.9,0x8a6a48);
  const map=new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.75),new THREE.MeshBasicMaterial({map:mapTex()}));map.rotation.x=-Math.PI/2;map.position.set(0,0.91,0);scene.add(map);
  const G=estjG(r,GEN);G.position.set(0,0,-1.45);scene.add(G);
  const ptr=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.9,6),lamb(0x3a2a20));holdIn(G,ptr,1,0,-0.95,0);
  const offs=[];[[-2.0,-0.5,Math.PI/2],[-2.0,0.5,Math.PI/2],[2.0,-0.5,-Math.PI/2],[2.0,0.5,-Math.PI/2],[-0.9,-1.5,0.2],[0.9,-1.5,-0.2]].forEach(([x,z,ry],i)=>{
    const p=estjS(r,ALLY);p.position.set(x,0,z);p.rotation.y=ry;scene.add(p);const dir=[Math.sign(x)*1,i>=4?-1:(i%2?0.6:-0.6)];offs.push({p,x,z,ry,dir,d:i*0.04})});
  // 멀리 적군 상황실도 똑같이
  const T2=new THREE.Group();scene.add(T2);T2.position.set(0,0,-34);
  {const tb=table(scene,0,-34,3.0,1.9,0x6b5a7a);tent(scene,0,-39,0x6d62ad,1.8);flag(scene,2.6,-36.4,0x7c74b8,4.2,1.3)}
  const foes=[];for(let i=0;i<6;i++){const p=estjS(r,FOE);const x=(i%2?2:-2),z=-34+(i<2?-0.5:i<4?0.5:1.5);p.position.set(i>=4?(i%2?0.9:-0.9):x,0,z);p.rotation.y=i>=4?Math.PI:(x>0?-Math.PI/2:Math.PI/2);scene.add(p);foes.push({p,x0:p.position.x,z0:p.position.z,dir:[i>=4?(i%2?0.5:-0.5):Math.sign(x),i>=4?1:0.3]})}
  const EG=estjG(r,ENEMYG);EG.position.set(0,0,-35.45+3.4);EG.rotation.y=Math.PI;scene.add(EG);
  const g1=at(0,'g1'),gl=LN(0,'g1')[1],GO=EV(0).go;
  const B=[sb(scene,'1소대 돌격!',0,2.75,-1.45,{size:0.0022}),sb(scene,'2소대 엄호!',0,2.75,-1.45,{size:0.0022}),sb(scene,'3소대 보급!',0,2.75,-1.45,{size:0.0022}),sb(scene,'질문? 없지? 해산.',0,2.75,-1.45,{size:0.0024})];
  const BT=[0,0.19,0.38,0.62].map(f=>g1+f*gl);
  const C=cam(50);const ch=chip('작전 회의 3초');
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ESTJ × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ESTJ인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  return t=>{
    stern(G);stern(EG);
    const tapping=t>g1&&t<GO;const a=G.userData.arms[1];a.rotation.x=tapping?-0.75-Math.max(0,Math.sin((t-g1)*Math.PI*2/0.42))*0.3:-0.35;
    G.userData.head.rotation.x=tapping?0.25:0;
    B.forEach((b,i)=>show(b,t,BT[i],i<3?BT[i+1]:GO+0.6));
    offs.forEach(q=>{stern(q.p);const lt=t-GO-q.d;
      if(lt<0){q.p.position.set(q.x,0,q.z);q.p.rotation.y=q.ry;q.p.userData.head.rotation.x=0.35}
      else{const k=Math.min(lt,3);q.p.rotation.y=Math.atan2(q.dir[0],q.dir[1]);q.p.position.set(q.x+q.dir[0]*k*4.2,0,q.z+q.dir[1]*k*4.2);runPose(q.p,lt*13)}});
    foes.forEach(q=>{stern(q.p);const lt=t-GO-0.1;if(lt<0){q.p.position.set(q.x0,0,q.z0)}else{const k=Math.min(lt,3);q.p.rotation.y=Math.atan2(q.dir[0],q.dir[1]);q.p.position.set(q.x0+q.dir[0]*k*4.2,0,q.z0+q.dir[1]*k*4.2);runPose(q.p,lt*13)}});
    // 카메라
    if(t<g1-0.1){const k=ease(t/(g1-0.1));setCam(C,[0,5.6-k*0.8,6.2-k*0.6],[0,0.9,-0.8])}
    else if(t<GO+0.2){const k=ease((t-g1)/1.2);setCam(C,lerp3([0,4.8,5.6],[0.3,2.6,3.4],k),lerp3([0,0.9,-0.8],[0,1.85,-1.2],k))}
    else{const k=ease((t-GO-0.2)/2.6);setCam(C,lerp3([0.3,2.6,3.4],[0,8.5,3],k),lerp3([0,1.85,-1.2],[0,0,-22],k),50+k*4)}
    const TO=g1+0.15;
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    t1.style.transform=`scale(${pop((t-0.1)/0.35)})`;t2.style.transform=`scale(${pop((t-0.35)/0.4)})`;t3.style.transform=`scale(${pop((t-0.6)/0.4)})`;
    [tag,t1,t2,t3].forEach((e,i)=>e.style.opacity=t<TO?clamp01((t-i*0.2)/0.1):clamp01(1-(t-TO)/0.2));
    chipPop(ch,t,GO);ch.style.opacity=t>GO?1:0;
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 돌격 → 턱끈 지적 배틀 =====
S[1]=()=>{
  setSky('#a8c3e0','#eef3f7 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde7ef,30,95);addLights(scene,{hemi:1.5});
  const r=rng(21);ground(scene,0xa3b882,300);
  for(let i=0;i<9;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4)*13+r()*4,0,-40-r()*12);scene.add(h)}
  const E=EV(1),STOP=E.stop;
  const pairs=[];const NC=13;
  for(let c=0;c<NC;c++){const x=(c-6)*1.25;if(c===7||c===8)continue;
    const a=estjS(r,ALLY),b=estjS(r,FOE);scene.add(a);scene.add(b);a.rotation.y=Math.PI;
    pairs.push({a,b,x,ph:r()*6,who:r()<0.5})}
  const back=[];for(let row=1;row<3;row++)for(let c=0;c<NC;c++){const a=estjS(r,ALLY),b=estjS(r,FOE);a.rotation.y=Math.PI;scene.add(a);scene.add(b);back.push({a,b,x:(c-6)*1.25+0.5,row,ph:r()*6})}
  const A=pairs[6].a,Bf=pairs[6].b;dogtag(A);const tA=sideTag(A,1,1.92,{size:0.0022}),tB=sideTag(Bf,0,1.92,{size:0.0022});
  const zA=0.5,zB=-0.5;
  const bA1=sb(scene,'잠깐. 턱끈.',0,2.4,0.2,{size:0.0016}),bB1=sb(scene,'네?',0,2.4,-0.3,{c:FB,size:0.0016}),
        bA2=sb(scene,'다치면 누가 책임져요?',0,2.4,0.1,{size:0.0015}),bB2=sb(scene,'그쪽은 군번줄!',0,2.4,-0.2,{c:FB,size:0.0016}),
        bA3=sb(scene,'…합리적이네요.',0,2.4,0.15,{size:0.0016});
  const C=cam(50);const ch=chip('교전 0회 · 지적 147회');
  return t=>{
    const run=t<STOP;const k=clamp01(t/STOP);
    pairs.forEach((q,i)=>{const za=zA+(1-k)*11,zb=zB-(1-k)*11;q.a.position.set(q.x,0,za);q.b.position.set(q.x,0,zb);
      [q.a,q.b].forEach(p=>{stern(p);p.userData.hip.rotation.x=0;if(run){runPose(p,t*12+q.ph);aim(p);p.userData.hip.position.y+=0}else{standPose(p);noRifle(p)}});
      if(!run&&q!==pairs[6]){const lt=t-STOP-0.6-q.ph*0.15;if(lt>0){const who=Math.floor(lt/1.1+q.who)%2;point(who?q.a:q.b,ease((lt%1.1)/0.2))}}});
    back.forEach(q=>{const za=zA+q.row*1.5+(1-k)*11,zb=zB-q.row*1.5-(1-k)*11;q.a.position.set(q.x,0,za);q.b.position.set(q.x,0,zb);
      [q.a,q.b].forEach(p=>{stern(p);if(run){runPose(p,t*12+q.ph);aim(p)}else{standPose(p);noRifle(p);hips(p,ease((t-STOP-0.8)/0.4))}})});
    // 주인공 둘 (카메라 쪽으로 살짝 틀어 3/4 각도)
    if(!run){const tw=ease((t-STOP)/0.3)*0.65;A.rotation.y=Math.PI-tw;Bf.rotation.y=tw}
    const bu=ease((t-E.strap)/0.25);Bf.userData.strap.rotation.x=(1-bu)*1.1;
    if(!run){
      if(t>at(1,'s1',-0.1)&&t<at(1,'n3'))point(A,ease((t-at(1,'s1',-0.1))/0.2),1.45);
      if(t>E.strap-0.1&&t<E.strap+0.6){const a=Bf.userData.arms[1];a.rotation.x=-2.3;a.rotation.z=0.4}
      if(t>E.point2-0.1&&t<at(1,'s3')+0.4){A.userData.arms[1].rotation.x=0;point(Bf,ease((t-E.point2+0.1)/0.2),1.15)}
      if(t>at(1,'s3'))hips(A,ease((t-at(1,'s3'))/0.3));
    }
    show(bA1,t,at(1,'s1'),at(1,'f1'));show(bB1,t,at(1,'f1'),at(1,'s2'));show(bA2,t,at(1,'s2'),at(1,'f2'));show(bB2,t,E.point2,at(1,'s3'));show(bA3,t,at(1,'s3'),E.zoom+0.3);
    if(run){const kk=ease(t/STOP);setCam(C,[0.6,4.2,17-kk*6],[0,1.2,-4],55)}
    else if(t<E.zoom){const kk=ease((t-STOP)/0.35);setCam(C,lerp3([0.6,4.2,11],[4.0,1.9,0],kk),lerp3([0,1.2,-4],[0,1.75,0],kk),46)}
    else{const kk=ease((t-E.zoom)/2.4);setCam(C,lerp3([4.0,1.9,0],[11,9,6],kk),lerp3([0,1.75,0],[0,0.6,-1],kk),46+kk*8)}
    tA.visible=tB.visible=!run&&t<E.zoom;
    chipPop(ch,t,E.zoom+0.3);ch.style.opacity=t>E.zoom+0.3?1:0;
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 답답해서 적에게 사격 교육 =====
S[2]=()=>{
  setSky('#b5cde4','#f1f5f8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe4ecf2,25,90);addLights(scene,{hemi:1.5});
  const r=rng(31);ground(scene,0xa6ba86,300);for(let i=0;i<10;i++)tree(scene,(i-4.5)*4+r(),-9-r()*4,1.1,0x7aa866);
  sandbags(scene,-0.2,0.9,2.2,2,0xbfa880);
  const Bf=estjS(r,FOE);Bf.position.set(0,0,0);Bf.rotation.y=Math.PI/2;scene.add(Bf);
  const A=estjS(r,ALLY);scene.add(A);sideTag(A,1,1.95,{size:0.0028});sideTag(Bf,0,1.95,{size:0.0028});
  const TX=3.1;const E=EV(2);const SH=E.shot;
  const fl=glowSprite('rgba(255,220,120,1)',0.6);scene.add(fl);const tr=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.025,0.025),basic(0xfff0a0));scene.add(tr);
  const spk=glowSprite('rgba(255,250,200,1)',0.9);scene.add(spk);const ting=textSprite('팅!',110,'#ffd84d',0.0032);scene.add(ting);
  const misses=[0,1,2,3].map(i=>LEAD+0.2+i*0.35);
  const bA=sb(scene,'아니 그게 아니라, 줘 봐요.',-0.3,2.45,0.2,{size:0.0017}),bA2=sb(scene,'팔꿈치 붙이고, 숨 참고.',-0.3,2.45,0.2,{size:0.0017}),bA3=sb(scene,'쏘세요.',-0.3,2.45,0.2,{size:0.0018}),
        bA4=sb(scene,'그쵸!! 그렇게 하는 거예요.',TX-0.35,2.5,0,{size:0.0016}),bH=sb(scene,'…',TX,2.4,0,{size:0.0024});
  const s4=at(2,'s4'),s4l=LN(2,'s4')[1],s4e=endOf(2,'s4');
  const ch=chip('적군 명중률 0%');const C=cam(50);
  return t=>{
    stern(A);stern(Bf);aim(Bf);
    // 총구 섬광/탄
    let shotT=-1;misses.forEach(m=>{if(t>=m&&t<m+0.3)shotT=m});if(t>=SH&&t<SH+0.3)shotT=SH;
    const lt=t-shotT;fl.visible=shotT>0&&lt<0.08;fl.position.set(0.75,1.5,0);
    tr.visible=shotT>0&&lt<0.22;const hit=shotT===SH;const yy=hit?2.05:1.5+(misses.indexOf(shotT)%2?0.9:-0.6),zz=hit?0:(misses.indexOf(shotT)%2?1.4:-1.6);
    tr.position.set(0.9+lt/0.12*(TX-0.9),1.5+(yy-1.5)*lt/0.12,zz*lt/0.12);
    // A 이동: 표적 자리 → B 뒤 → 다시 표적 자리
    let ax=TX,ar=-Math.PI/2,walking=false;const goT=E.grab,gT=goT+0.55,back0=s4e-0.75,back1=s4e+0.05;
    if(t>goT&&t<gT){const k=(t-goT)/0.55;ax=TX+(-0.75-TX)*k;walking=true}
    else if(t>=gT&&t<back0){ax=-0.75;ar=Math.PI/2}
    else if(t>=back0&&t<back1){const k=(t-back0)/(back1-back0);ax=-0.75+(TX+0.75)*k;walking=true;ar=Math.PI/2}
    A.position.set(ax,0,t>=gT&&t<back0?-0.35:0);A.rotation.y=walking?(t<back0?-Math.PI/2:Math.PI/2):(t>=gT&&t<back0?Math.PI/2:-Math.PI/2);
    if(walking)runPose(A,t*12);else if(t<goT){hips(A);A.userData.head.rotation.y=Math.sin(t*9)*0.25*(t>LEAD+0.3?1:0)}
    if(t>=gT&&t<back0){const u=A.userData;u.arms[1].rotation.x=-1.4;u.arms[0].rotation.x=-1.4+Math.sin(t*8)*0.15;u.arms[1].rotation.z=-0.2}
    // 피격 + 박수
    const hk=t>SH+0.06?Math.exp(-(t-SH-0.06)*6):0;A.userData.head.rotation.z=hk*Math.sin((t-SH)*40)*0.35;
    spk.visible=t>SH+0.06&&t<SH+0.35;spk.position.set(TX,2.2,0.1);
    ting.visible=t>SH+0.06&&t<at(2,'n4');ting.position.set(TX+0.3,2.15,0.3);const tk=pop((t-SH-0.06)/0.25);ting.scale.set(ting.userData.base[0]*tk,ting.userData.base[1]*tk,1);
    if(t>at(2,'s5',-0.1)){const u=A.userData,c=Math.abs(Math.sin((t-at(2,'s5'))*Math.PI*5));u.arms[1].rotation.x=-1.35;u.arms[0].rotation.x=-1.35;u.arms[1].rotation.z=-0.15-c*0.3;u.arms[0].rotation.z=0.15+c*0.3;A.userData.head.rotation.z=0}
    const f=[s4,s4+s4l*0.42,s4+s4l*0.82];show(bA,t,f[0],f[1]);show(bA2,t,f[1],f[2]);show(bA3,t,f[2],back1);show(bA4,t,at(2,'s5'),99);show(bH,t,LEAD+0.5,goT);
    ch.textContent=t>SH+0.1?'적군 명중률 0% → 100%':'적군 명중률 0%';chipPop(ch,t,t>SH+0.1?SH+0.1:LEAD+0.3);
    if(t<goT){setCam(C,[1.55,2.0,9.4],[1.55,1.5,0],50)}
    else if(t<back0){const k=ease((t-goT)/0.6);setCam(C,lerp3([1.55,2.0,9.4],[-0.2,1.9,4.4],k),lerp3([1.55,1.5,0],[-0.3,1.45,0],k),50)}
    else if(t<SH+0.15){const k=ease((t-back0)/0.5);setCam(C,lerp3([-0.2,1.9,4.4],[1.55,2.0,9.4],k),lerp3([-0.3,1.45,0],[1.55,1.5,0],k),50)}
    else{const k=ease((t-SH-0.15)/0.5);setCam(C,lerp3([1.55,2.0,9.4],[TX-0.3,1.95,4.4],k),lerp3([1.55,1.5,0],[TX-0.3,1.7,0],k),50)}
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 선전포고도 결론부터 =====
S[3]=()=>{
  setSky('#c3d4ea','#f3f5f9 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe7ecf4,30,100);addLights(scene,{hemi:1.5});
  const r=rng(41);ground(scene,0xa2b884,300);
  const pod=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.8,1.2),lamb(0x6d62ad));pod.position.set(0,0.4,-8);scene.add(pod);
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(6,2.2),new THREE.MeshBasicMaterial({map:canvasTex(1200,440,(x,w,h)=>{x.fillStyle='#5b5199';x.fillRect(0,0,w,h);x.strokeStyle='#ffd84d';x.lineWidth=16;x.strokeRect(20,20,w-40,h-40);x.fillStyle='#fff';x.font=`900 120px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('대국민 선전포고',w/2,h/2+6)})}));
  ban.position.set(0,3.6,-10.5);scene.add(ban);flag(scene,-3.6,-10,0x7c74b8,4.6,1.4);flag(scene,3.6,-10,0x7c74b8,4.6,1.4);
  const EJ=estjG(r,ENEMYG);EJ.position.set(0,0.8,-8);scene.add(EJ);const tE3=sideTag(EJ,0,2.15,{size:0.0022});const m1=holdIn(EJ,megaphone(),1,0,-0.62,0.05);
  for(let row=0;row<3;row++)for(let c=0;c<10;c++){const p=estjS(r,FOE);p.position.set((c-4.5)*1.1,0,-12-row*1.3);scene.add(p)}
  const G=estjG(r,GEN);G.position.set(0,0,3);G.rotation.y=Math.PI;scene.add(G);const tG3=sideTag(G,1,1.95,{size:0.0017});const m2=holdIn(G,megaphone(),1,0,-0.62,0.05);
  for(let row=0;row<2;row++)for(let c=0;c<8;c++){const p=estjS(r,ALLY);p.position.set((c-3.5)*1.1,0,5+row*1.3);p.rotation.y=Math.PI;scene.add(p)}
  const bE=sb(scene,'유구한 역사와 전통에…',0,3.8,-8,{c:FB,size:0.0024}),bG=sb(scene,'결론이 뭔데. 세 줄로.',0,2.9,3,{size:0.0019}),bG2=sb(scene,'진작 그렇게 말하지.',0,2.9,3,{size:0.0019});
  const E=EV(3),e1=at(3,'e1'),CU=E.cut,TH=E.three,g3=at(3,'g3'),n5=at(3,'n5');const e2l=LN(3,'e2')[1];
  const card=cardEl(['1. 내일 공격','2. 05시','3. 정면']);card.style.top='150px';const rows=[...card.children];
  const ch=chip('연설 30초 경과');const C=cam(50);
  return t=>{
    stern(EJ);stern(G);
    const ea=EJ.userData.arms;ea[1].rotation.x=t<CU?-2.0:(t>TH&&t<g3?-2.0:-0.4);ea[0].rotation.x=t<CU?-1.2-Math.sin(t*5)*0.6:-0.2;ea[0].rotation.z=t<CU?-0.5:0;
    m1.rotation.x=0.4;
    const ga=G.userData.arms;ga[1].rotation.x=(t>CU-0.15&&t<TH)?-2.0:-0.3;m2.rotation.x=0.4;
    if(t>g3&&t<n5)G.userData.head.rotation.x=Math.max(0,Math.sin((t-g3)*Math.PI*3))*0.3;
    show(bE,t,e1,CU);show(bG,t,CU,TH);show(bG2,t,g3,n5);
    // 세 줄 카드
    const cardOn=t>TH&&t<n5;card.style.opacity=cardOn?1:0;card.style.transform=`translateX(-50%) scale(${pop((t-TH)/0.3)})`;
    rows.forEach((d,i)=>{const t0=TH+i*e2l*0.33;d.style.opacity=t>t0?1:0;d.style.transform=`scale(${pop((t-t0)/0.25)})`});
    chipPop(ch,t,e1+1.0);ch.style.opacity=t>e1+1.0&&t<CU?1:0;
    if(t<CU){const k=ease(t/CU);setCam(C,[0.4,2.1+k*0.2,-4.4+k*0.6],[0,2.7,-8.5],48)}
    else if(t<TH){const k=ease((t-CU)/2);setCam(C,[0.5,2.2,-0.6+k*0.4],[0,1.95,3],48)}
    else if(t<g3){setCam(C,[0.3,2.7,-2.6],[0,3.1,-8.5],50)}
    else if(t<n5){setCam(C,[0.5,2.2,-0.4],[0,1.95,3],48)}
    else{const k=ease((t-n5)/3);setCam(C,lerp3([2,5,10],[2.5,8,14],k),[0,1.2,-3],50)}
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 포로 교환 → 라떼 배틀 =====
S[4]=()=>{
  setSky('#bcd3ea','#f3f6f9 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe6edf4,30,100);addLights(scene,{hemi:1.5});
  const r=rng(51);ground(scene,0xa4b986,300);for(let i=0;i<12;i++)tree(scene,(i-5.5)*4.2+r(),-9-r()*4,1.1,0x7aa866);
  const line=new THREE.Mesh(new THREE.PlaneGeometry(0.12,20),basic(0xffffff));line.rotation.x=-Math.PI/2;line.position.set(0,0.01,0);scene.add(line);
  const G=estjG(r,GEN);G.position.set(-1.0,0,0);G.rotation.y=Math.PI/2;scene.add(G);
  const EJ=estjG(r,ENEMYG);EJ.position.set(1.0,0,0);EJ.rotation.y=-Math.PI/2;scene.add(EJ);
  sideTag(G,1,1.95,{size:0.0024});sideTag(EJ,0,1.95,{size:0.0024});
  const R=estjS(r,FOE);R.scale.setScalar(0.88);R.position.set(0,0,0.45);scene.add(R);
  for(const [x,sd] of [[-2.2,ALLY],[-2.9,ALLY],[2.2,FOE],[2.9,FOE]]){const p=estjS(r,sd);p.position.set(x,0,-0.8);p.rotation.y=x<0?Math.PI/2:-Math.PI/2;scene.add(p);stern(p)}
  const soul=new THREE.Group();const sm=new THREE.Mesh(new THREE.CapsuleGeometry(0.17,0.25,8,16),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.75}));soul.add(sm);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.06,0.01),basic(0x333333));e.position.set(s*0.06,0.06,0.17);soul.add(e)}soul.scale.setScalar(1.6);scene.add(soul);
  const E=EV(4);const r1=at(4,'r1');
  const bR=sb(scene,'…좀 힘드네요.',0,2.2,0.45,{c:FB,size:0.0018});
  const L4=[['g4','나 때는 포탄 맨손으로!',AB,-0.3,0.0018],['e3','나 때는 철조망 이로!',FB,0.3,0.002],['g5','군화 한 켤레로 3년!!',AB,-0.2,0.0023],['e4','나 때는 군화가 없었어!!!',FB,0.05,0.0025]];
  const LB=L4.map(([nm,tx,c,x,s])=>({nm,b:sb(scene,tx,x,2.75,0.1,{c,size:s})}));
  const small=[['나 때는…',AB,-0.6],['나 때는…!',FB,0.6]].map(([tx,c,x])=>sb(scene,tx,x,2.6,0.1,{c,size:0.0016}));
  const n6=at(4,'n6');const ch=chip('라떼 배틀 47분째');const ch0=chip('포로 교환 현장');const C=cam(50);
  return t=>{
    stern(G);stern(EJ);standPose(R);
    const sl=ease((t-r1)/0.3);R.userData.hip.rotation.x=0.25*sl;R.userData.head.rotation.x=0.45*sl;R.userData.arms.forEach(a=>a.rotation.x=0.15*sl);
    const tk=ease((t-E.turn)/0.2);G.userData.head.rotation.y=-0.9*tk;EJ.userData.head.rotation.y=0.9*tk;
    // 말할 때 몸을 신병 쪽으로 숙임
    const spk=nm=>t>at(4,nm)&&t<endOf(4,nm);
    G.userData.hip.rotation.x=(spk('g4')||spk('g5'))?0.18:0;EJ.userData.hip.rotation.x=(spk('e3')||spk('e4'))?0.18:0;
    if(spk('g4')||spk('g5')){point(G,1,1.3)}if(spk('e3')||spk('e4')){point(EJ,1,1.3)}
    show(bR,t,r1,E.turn+0.3);
    LB.forEach((q,i)=>show(q.b,t,at(4,q.nm),i<3?at(4,LB[i+1].nm):n6));
    if(t>n6){const lt=t-n6;small.forEach((b,i)=>show(b,t,n6+((Math.floor(lt/0.6)%2)===i?Math.floor(lt/0.6)*0.6:999),n6+(Math.floor(lt/0.6)+1)*0.6))}
    soul.visible=t>E.soul;const sk=clamp01((t-E.soul)/2.5);soul.position.set(Math.sin(t*3)*0.12,1.75+sk*1.3,0.45);
    const k6=ease((t-n6)/2.5);setSky(lerpCol('#bcd3ea','#f0a27a',k6),lerpCol('#f3f6f9','#ffd9a8',k6)+' 70%');
    chipPop(ch,t,E.soul);ch.style.opacity=t>E.soul?1:0;chipPop(ch0,t,0.1);ch0.style.opacity=t<E.turn?1:0;
    if(t<n6){const k=ease(t/n6);setCam(C,[0,1.75,5.4-k*0.6],[0,1.75,0],50)}
    else{const k=ease((t-n6)/3);setCam(C,lerp3([0,1.75,4.8],[0,2.6,7.6],k),[0,1.6,0],50)}
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. 포탄 대신 잔소리 폭격 =====
S[5]=()=>{
  setSky('#9fb6d0','#e6edf3 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde5ee,30,110);addLights(scene,{hemi:1.45});
  const r=rng(61);ground(scene,0x9fb47f,300);
  sandbags(scene,0,1.6,16,3);sandbags(scene,0,-13.6,16,3,0xb4a7d6);
  const fen=fence(scene,-6,16);fen.rotation.z=0.06;fen.rotation.y=0.08;
  const al=[],fo=[];for(let c=0;c<12;c++){const p=estjS(r,ALLY);p.position.set((c-5.5)*1.3,0,2.4);p.rotation.y=Math.PI;scene.add(p);const m=holdIn(p,megaphone(),1,0,-0.62,0.05);m.visible=false;al.push({p,m,d:r()*0.25})}
  for(let c=0;c<12;c++){const p=estjS(r,FOE);p.position.set((c-5.5)*1.3,0,-14.4);scene.add(p);const m=holdIn(p,megaphone(),1,0,-0.62,0.05);m.visible=false;fo.push({p,m,d:r()*0.25})}
  const fixers=[0,1,2].map(i=>{const p=estjS(r,FOE);p.position.set(-2+i*2,0,-6.6);scene.add(p);return p});
  const G=estjG(r,GEN);G.position.set(-2.3,0,4.0);G.rotation.y=Math.PI*0.9;scene.add(G);
  const bG=sb(scene,'발사!',-2.3,2.95,4.0,{size:0.0028});
  const E=EV(5),F=E.fire;
  const AT=['철조망 각도 삐뚤어졌다!','보고서 양식 틀렸다!','줄 똑바로 서!','군화 끈 풀렸다!','5분 전 집합 몰라?','복장 점검!'];
  const FT=['참호 그렇게 파면 무너진다!','보고는 미리미리!','점호 시간 지켜!','철모 삐뚤어졌다!','정리 정돈!'];
  const shots=[];AT.forEach((tx,i)=>shots.push({b:sb(scene,tx,0,0,0,{size:0.0075}),x0:(i-2.5)*2.4,z0:2.0,x1:(i-2.5)*1.8+0.8,z1:-13,t0:F+0.1+i*0.42,dur:1.7}));
  FT.forEach((tx,i)=>shots.push({b:sb(scene,tx,0,0,0,{c:FB,size:0.0075}),x0:(i-2)*2.6,z0:-13.4,x1:(i-2)*2.0-0.6,z1:1.6,t0:F+0.3+i*0.45,dur:1.7}));
  const n7=at(5,'n7');const ch=chip('포탄 0발 · 잔소리 폭격 중');const C=cam(50);
  return t=>{
    stern(G);
    [...al,...fo].forEach(q=>{stern(q.p);const k=ease((t-F-q.d)/0.25);q.m.visible=k>0.05;const a=q.p.userData.arms[1];a.rotation.x=t<F?-0.2:-1.9*k;q.m.rotation.x=0.3});
    if(t<F){handUp(G,ease((t-at(5,'g6',-0.2))/0.2))}else{const a=G.userData.arms[1];a.rotation.x=-1.6;a.rotation.z=0}
    show(bG,t,at(5,'g6'),F+0.6);
    shots.forEach(s=>{const k=(t-s.t0)/s.dur;const on=k>0&&k<1;s.b.visible=on;if(!on){s.b.scale.set(0,0,1);return}
      s.b.position.set(s.x0+(s.x1-s.x0)*k,2.4+Math.sin(k*Math.PI)*4.2,s.z0+(s.z1-s.z0)*k);scaleBubble(s.b,pop(k/0.12))});
    // 적이 잔소리 듣고 철조망 고침
    const fk=ease((t-n7)/1.6);fen.rotation.z=0.06*(1-fk);fen.rotation.y=0.08*(1-fk);
    fixers.forEach((p,i)=>{stern(p);if(t>n7-0.6){const a=p.userData.arms;a[0].rotation.x=-1.2+Math.sin(t*7+i)*0.2;a[1].rotation.x=-1.2-Math.sin(t*7+i)*0.2}});
    if(t<F){const k=ease(t/F);setCam(C,[-0.8,2.4,8.2-k*0.5],[-1.6,1.8,-6],50)}
    else if(t<n7){const k=ease((t-F)/1.4);setCam(C,lerp3([-0.8,2.4,7.7],[16,9,8],k),lerp3([-1.6,1.8,-6],[0,3.4,-6],k),55)}
    else{const k=ease((t-n7)/1.2);setCam(C,lerp3([16,9,8],[5,3.2,-1.6],k),lerp3([0,3.4,-6],[0,1.0,-6.4],k),50)}
    chipPop(ch,t,F+0.4);ch.style.opacity=t>F+0.4?1:0;
    caption(5,t);renderer.render(scene,C);
  };
};

// ===== 6~7 공용: 고깃집 =====
function bbq(r,o={}){
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x8a6a50,12,40);addLights(scene,{hemi:1.35,sky:0xfff0d8,ground:0x8a6a50,sun:0xffd9a8,dir:1.3});
  restaurant(scene,r);
  table(scene,0,0,1.5,1.1,0x9a7652);grill(scene,0,0);
  const G=estjG(r,GEN);G.position.set(-0.8,0,0);G.rotation.y=Math.PI/2-0.45;sitPose(G);scene.add(G);
  const EJ=estjG(r,ENEMYG);EJ.position.set(0.8,0,0);EJ.rotation.y=-Math.PI/2+0.45;sitPose(EJ);scene.add(EJ);
  const M=[-0.15,0,0.15].map((z,i)=>{const m=meat();m.position.set(i===1?0:(i?0.1:-0.1),1.0,z);scene.add(m);return m});
  sideTag(G,1,1.8,{size:0.0016});sideTag(EJ,0,1.8,{size:0.0016});
  const T=tongs();T.position.set(0,1.32,0);T.rotation.y=Math.PI/2;scene.add(T);
  const side=[];[[-3.2,1.2],[3.2,1.2],[-3.4,-2.2],[3.4,-2.2]].forEach(([x,z])=>side.push(...sideTable(scene,r,x,z)));
  return {scene,G,EJ,M,T,side};
}
function holdTongs(G,EJ,k){[G,EJ].forEach(p=>{const a=p.userData.arms[1];a.rotation.x=-0.9-0.55*k;a.rotation.z=0})}
function flipMeat(M,t,t0,dur=0.45){M.forEach((m,i)=>{const lt=t-t0-i*0.12;const k=clamp01(lt/dur);m.rotation.z=Math.PI*ease(k);m.position.y=1.0+Math.sin(k*Math.PI)*0.18})}

S[6]=()=>{
  setSky('#c98a5a','#f2c995 70%');const r=rng(71);const {scene,G,EJ,M,T,side}=bbq(r);
  const E=EV(6),g7=at(6,'g7'),GR=E.grab;
  const bG=sb(scene,'제가 구울게요.',-0.45,2.32,0.1,{size:0.0014}),bE=sb(scene,'아뇨, 제가요.',0.3,2.32,0.1,{c:FB,size:0.0014}),
        bG2=sb(scene,'고기는 한 번만 뒤집는 겁니다.',-0.3,2.32,0.1,{size:0.0013}),bE2=sb(scene,'합리적이네요.',0.4,2.32,0.1,{c:FB,size:0.0014}),bE3=sb(scene,'근데 지금 제 차례예요.',0.3,2.32,0.1,{c:FB,size:0.0013});
  const e6=at(6,'e6'),e6l=LN(6,'e6')[1];
  const ch=chip('집게 점유율 50 : 50');const C=cam(50);
  return t=>{
    stern(G);stern(EJ);sitPose(G);sitPose(EJ);
    const gk=ease((t-g7)/0.3),ek=ease((t-GR)/0.25);
    {const a=G.userData.arms[1];a.rotation.x=-0.9-0.55*gk}{const a=EJ.userData.arms[1];a.rotation.x=-0.9-0.55*ek}
    T.visible=true;T.position.y=1.32+(t>GR?Math.sin(t*2)*0.01:0);
    // 집게가 같이 움직이며 고기 뒤집기
    [0,1.6,3.2].forEach(k=>{if(t>E.flip+k)flipMeat(M,t,E.flip+k)});
    M.forEach(m=>{const c=new THREE.Color(0xd9776f).lerp(new THREE.Color(0xa55a3a),clamp01((t-1)/7));m.material.color.copy(c)});
    side.forEach((p,i)=>{p.userData.head.rotation.y=(i%2?-1:1)*0.0;const a=p.userData.arms[1];a.rotation.x=-0.9;p.userData.head.rotation.x=t>GR?0.05:0});
    show(bG,t,g7,GR);show(bE,t,at(6,'e5'),at(6,'g8'));show(bG2,t,at(6,'g8'),e6);show(bE2,t,e6,e6+e6l*0.35);show(bE3,t,e6+e6l*0.35,99);
    chipPop(ch,t,GR+0.4);ch.style.opacity=t>GR+0.4?1:0;
    if(t<GR){const k=ease(t/GR);setCam(C,[0,2.0,4.1-k*0.3],[0,1.45,0],48)}
    else if(t<GR+0.9){const k=ease((t-GR)/0.4);setCam(C,lerp3([0,2.0,3.8],[0.1,1.85,3.0],k),lerp3([0,1.45,0],[0,1.35,0],k),48)}
    else{const k=ease((t-GR-0.9)/3);setCam(C,lerp3([0.1,1.85,3.0],[0,2.0,3.9],k),lerp3([0,1.35,0],[0,1.45,0],k),48)}
    caption(6,t);renderer.render(scene,C);
  };
};

// ===== 7. 엔딩: 3년째 집게 대치 =====
S[7]=()=>{
  setSky('#c98a5a','#f2c995 70%');const r=rng(81);const {scene,G,EJ,M,T,side}=bbq(r);
  // 창문(계절)
  const win=canvasTex(512,512,()=>{});const wm=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),new THREE.MeshBasicMaterial({map:win}));wm.position.set(-2.9,2.4,-3.95);scene.add(wm);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.8,0.05),lamb(0x6b4a2f));fr.position.set(-2.9,2.4,-3.98);scene.add(fr);
  const SEAS=[['#dfe9f2','#ffffff','겨울'],['#cfe9ff','#ffb7cf','봄'],['#bfe6ff','#59b35c','여름'],['#f6d8b0','#e8833a','가을']];
  const PT=Array.from({length:40},()=>({x:Math.random()*512,y:Math.random()*512,s:3+Math.random()*7,v:40+Math.random()*60}));
  const E=EV(7),ST=E.stat,ST2=at(7,'n8',2.45),END=E.end;
  const yr=div('yr');const stat=div('statbox','<div><small>전쟁</small><b>3년째</b></div><div><small>사상자</small><b>0명</b></div>');
  const stat2=div('statbox','<div><small>주고받은 잔소리</small><b>2,676번</b></div>');stat2.style.top='600px';
  const dim=div('dim');const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');e1.style.top='560px';e2.style.top='720px';
  const bG=sb(scene,'제 차례입니다.',-0.25,2.32,0.1,{size:0.0013}),bE=sb(scene,'합리적이네요.',0.15,2.32,0.1,{c:FB,size:0.0013});
  const C=cam(50);
  return t=>{
    stern(G);stern(EJ);sitPose(G);sitPose(EJ);holdTongs(G,EJ,1);
    const ph=clamp01((t-0.2)/(ST-0.1));const si=Math.min(3,Math.floor(ph*4*0.999+(t>ST?3:0)));const season=t>ST?3:Math.min(3,Math.floor(ph*4));
    const [sky,pc,nm]=SEAS[season];
    {const x=win.image.getContext('2d');x.fillStyle=sky;x.fillRect(0,0,512,512);x.fillStyle=season===2?'#7cc46e':'#a9c78a';x.fillRect(0,380,512,132);
     if(season!==2){x.fillStyle=pc;PT.forEach(p=>{const y=(p.y+t*p.v)%512;x.beginPath();x.arc((p.x+Math.sin(t*2+p.y)*12)%512,y,p.s,0,Math.PI*2);x.fill()})}
     else{x.fillStyle='#ffe066';x.beginPath();x.arc(400,100,60,0,Math.PI*2);x.fill()}win.needsUpdate=true}
    const years=t>ST?3:Math.min(3,1+Math.floor(ph*3));yr.textContent=`대치 ${years}년째 · ${nm}`;yr.style.opacity=t<ST?1:0;yr.style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;
    const cyc=(t%1.2)/1.2;flipMeat(M,t,Math.floor(t/1.2)*1.2+0.1,0.4);
    M.forEach(m=>m.material.color.set(0xa55a3a));
    show(bG,t,0.3+Math.floor(t/1.2)*1.2,Math.floor(t/1.2)*1.2+0.85);show(bE,t,0.85+Math.floor(t/1.2)*1.2,Math.floor(t/1.2)*1.2+1.3);
    if(t>ST){bG.visible=false;bE.visible=false}
    side.forEach((p,i)=>{const a=p.userData.arms[1];a.rotation.x=-0.9-Math.max(0,Math.sin(t*4+i))*0.4});
    stat.style.opacity=t>ST&&t<END?1:0;stat.style.transform=`translateX(-50%) scale(${pop((t-ST)/0.3)})`;
    stat2.style.opacity=t>ST2&&t<END?1:0;stat2.style.transform=`translateX(-50%) scale(${pop((t-ST2)/0.3)})`;
    dim.style.opacity=t>END?clamp01((t-END)/0.3):0;e1.style.opacity=t>END?1:0;e2.style.opacity=t>END+0.2?1:0;popEl(e1,t,END);popEl(e2,t,END+0.2);
    const k=ease(t/6);setCam(C,[-0.6+k*0.6,2.1,4.4+k*0.4],[-0.3+k*0.3,1.5,-1],50);
    caption(7,t);renderer.render(scene,C);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
