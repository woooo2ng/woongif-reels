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

