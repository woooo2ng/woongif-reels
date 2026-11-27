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
  x.font=`900 46px ${FONT}`;x.fillStyle='#333';x.fillText(o.title||'War Room',30,60)}
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

// ================= ENFP vs INFP 전쟁편 =================
const EC={bg:'#fff1a8',fg:'#5a4300'},IC={bg:'#eadcff',fg:'#3a2766'},TC={bg:'#ffffff',fg:'#555566'};
const ENF={shirt:0xffe14d,pants:0x4f6aa8};
const TEE_T=canvasTex(256,128,(x,w,h)=>{x.fillStyle='#ffe14d';x.fillRect(0,0,w,h);x.fillStyle='#ff5fa2';x.font=`900 64px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('♥ENFP',w/2,h/2+4)});
function enfp(r,o={}){const p=addFace(makePerson(r,{shirt:ENF.shirt,pants:ENF.pants}));setFace(p,true);
  const tee=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.21),new THREE.MeshBasicMaterial({map:TEE_T}));tee.position.set(0,0.36,0.162);p.userData.hip.add(tee);
  const hb=new THREE.Mesh(new THREE.TorusGeometry(0.262,0.035,10,40),smooth(0xff6fae));hb.rotation.x=Math.PI/2+0.25;hb.position.y=0.33;p.userData.head.add(hb);
  p.userData.ph=r()*6;return p}
function enfpG(r){const p=general(r,{shirt:0xffd23f,pants:0x4f6aa8,cap:0xff7fb6});setFace(p,true);return p}
function infp(r){const p=soldier(r,FOE);setFace(p,false);p.userData.ph=r()*6;return p}
function infpG(r){const p=general(r,ENEMYG);setFace(p,false);return p}
function sweat(p){const d=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,10),smooth(0x9fd8ff));d.scale.y=1.4;d.position.set(0.2,0.42,0.18);p.userData.head.add(d);p.userData.sweat=d;return d}
function updSweat(p,t){const d=p.userData.sweat;if(!d)return;const lt=(t*0.8+(p.userData.ph||0))%1;d.position.y=0.42-lt*0.18;d.material.opacity=1}
function tremble(p,t,k=1){p.rotation.z=Math.sin(t*41+(p.userData.ph||0))*0.025*k}
function liePose(p){standPose(p);p.rotation.x=Math.PI/2;p.position.y=0.18}
function bouquet(){const g=new THREE.Group();const st=new THREE.Mesh(new THREE.ConeGeometry(0.09,0.28,8),lamb(0x7cc46a));st.rotation.x=Math.PI;g.add(st);
  [0xff8fb3,0xffd84d,0xffffff,0xff6f6f].forEach((c,i)=>{const f=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),smooth(c));f.position.set(Math.cos(i*1.6)*0.06,0.17,Math.sin(i*1.6)*0.06);g.add(f)});return g}
function snack(){const b=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.3,0.08),lamb(0xff9a5a));return b}
function banner(text,w=6,h=1.3){const g=new THREE.Group();
  const tx=canvasTex(1200,260,(x,W,Hh)=>{x.fillStyle='#ff6fae';rr(x,0,0,W,Hh,40);x.fill();x.strokeStyle='#fff';x.lineWidth=12;rr(x,14,14,W-28,Hh-28,32);x.stroke();
    x.fillStyle='#fff';let fs=150;x.font=`900 ${fs}px ${FONT}`;while(x.measureText(text).width>W-110&&fs>60){fs-=4;x.font=`900 ${fs}px ${FONT}`}x.textAlign='center';x.textBaseline='middle';x.fillText(text,W/2,Hh/2+8)});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h,8,1),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));m.position.y=3.15;g.add(m);g.userData.m=m;
  for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,3.4,6),lamb(0xdddddd));p.position.set(s*w/2,1.9,0);p.scale.y=1.12;g.add(p)}return g}
function waveBanner(b,t){const pos=b.userData.m.geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setZ(i,Math.sin(t*5+x*1.3)*0.15)}pos.needsUpdate=true}
function cheerPose(p,t,k=1){const s=Math.sin(t*9+(p.userData.ph||0));armUp(p,0,k*(0.8+0.2*s));armUp(p,1,k*(0.8-0.2*s));p.userData.hip.position.y=0.8+Math.max(0,s)*0.12*k}
function wave1(p,t,k=1,side=1){const a=p.userData.arms[side];a.rotation.x=-2.7*k;a.rotation.z=(side?1:-1)*(0.3+Math.sin(t*10)*0.35)*k}
function battery(level,red){return canvasTex(300,140,(x,w,h)=>{x.fillStyle='rgba(0,0,0,.25)';rr(x,8,14,252,112,22);x.fill();x.fillStyle='#fff';rr(x,4,8,252,112,22);x.fill();
  x.fillStyle='#333';rr(x,262,44,26,52,8);x.fill();x.fillStyle='#333';rr(x,16,20,228,88,14);x.fill();
  x.fillStyle=red?'#ff3b3b':'#5ad16a';const bw=Math.max(8,224*level);rr(x,18,22,bw,84,12);x.fill();
  x.fillStyle='#fff';x.font=`900 56px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=8;x.strokeStyle='#222';const s=Math.round(level*100)+'%';x.strokeText(s,130,66);x.fillText(s,130,66)})}
function envelopeMesh(col=0xffffff){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.02,0.24),lamb(col));g.add(b);
  const h=new THREE.Mesh(new THREE.CircleGeometry(0.035,10),basic(0xff5f8f));h.rotation.x=-Math.PI/2;h.position.y=0.012;g.add(h);return g}
function pigeon(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.35,16,12),smooth(0xe6e6ee));b.scale.set(1,0.8,1.5);g.add(b);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,12),smooth(0xd0d0dc));hd.position.set(0,0.25,0.5);g.add(hd);
  const bk=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.16,8),lamb(0xffb04d));bk.rotation.x=Math.PI/2;bk.position.set(0,0.22,0.72);g.add(bk);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),basic(0x111111));e.position.set(s*0.11,0.3,0.64);g.add(e)}
  const W=[];for(const s of[-1,1]){const w=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.04,0.45),lamb(0xd6d6e2));m.position.x=s*0.4;w.add(m);w.position.set(s*0.2,0.1,0);g.add(w);W.push(w)}
  const env=envelopeMesh(0xfff6e0);env.rotation.x=-0.3;env.position.set(0,0.12,0.86);g.add(env);g.userData.W=W;return g}
function flapW(pg,t){pg.userData.W.forEach((w,i)=>w.rotation.z=(i?-1:1)*Math.sin(t*22)*0.7)}
function plane3(col){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.3,4,10),lamb(col));b.rotation.z=Math.PI/2;g.add(b);
  const w=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.08,5),lamb(0xffffff));g.add(w);
  const tl=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.9,0.08),lamb(col));tl.position.set(-1.8,0.5,0);g.add(tl);
  const h=textSprite('♥',120,'#ff5fa2',0.006);h.position.set(-1.8,0.6,0.2);g.add(h);return g}
function bed(scene,x,z,col=0xc9b8ff){const g=new THREE.Group();const f=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.45,2.4),lamb(0x8a6a4a));f.position.y=0.22;g.add(f);
  const m=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.15,2.3),lamb(0xffffff));m.position.y=0.52;g.add(m);
  const pl=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.16,0.4),lamb(0xfff4e6));pl.position.set(0,0.66,-0.9);g.add(pl);
  const bk=new THREE.Mesh(new THREE.BoxGeometry(1.36,0.08,1.4),lamb(col));bk.position.set(0,0.62,0.35);g.add(bk);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.0,0.12),lamb(0x8a6a4a));hb.position.set(0,0.5,-1.18);g.add(hb);
  g.position.set(x,0,z);scene.add(g);return g}
function room(scene,o={}){const w=o.w||8,h=o.h||3.4,d=o.d||8;
  const box=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:o.wall||0xcfc6e6,side:THREE.BackSide}));box.position.y=h/2;scene.add(box);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(w,d),lamb(o.floor||0xa58f7a));fl.rotation.x=-Math.PI/2;fl.position.y=0.005;scene.add(fl);return box}
const _cv=new THREE.Vector3();
function wpos(obj,dy=0){obj.updateMatrixWorld(true);obj.getWorldPosition(_cv);return [_cv.x,_cv.y+dy,_cv.z]}
function follow(b,p,dy){const q=headPos(p,dy);b.position.copy(q)}
function titleUI(){ui.insertAdjacentHTML('beforeend',`<div class="tag">WHAT IF…</div><div class="title1 out" style="color:${C_E};font-size:140px;letter-spacing:-3px;top:315px">ENFP Nation</div><div class="title2 out" style="color:${C_I};font-size:130px;letter-spacing:-3px;top:480px">& INFP Nation</div><div class="title3 out" style="top:655px">went to war?</div>`);
  return ['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s))}
{const st=document.createElement('style');st.textContent=`
.tag{white-space:nowrap}
.cmpbox small{white-space:nowrap}
.rule{position:absolute;left:50%;top:220px;transform:translateX(-50%);background:#fffdf5;border:8px solid #3a2766;border-radius:30px;padding:16px 50px;text-align:center;box-shadow:0 16px 40px rgba(0,0,0,.35);white-space:nowrap}
.rule small{display:block;font-size:44px;font-weight:900;color:#7a63b8}
.rule b{display:block;font-size:84px;font-weight:900;color:#2a2340;line-height:1.25}
.kphone .badge{margin-left:auto;background:#ff4d4d;color:#fff;border-radius:999px;padding:4px 18px;font-size:34px;font-weight:900}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:40px 40px 0 0;padding:34px 40px 50px;box-shadow:0 -10px 30px rgba(0,0,0,.2)}
.sheet div{font-size:44px;font-weight:700;color:#333;padding:22px 10px;border-bottom:2px solid #eee}
.sheet .exit{color:#ff3b3b;font-weight:900;border-bottom:none;border-radius:20px}
.finger{position:absolute;width:90px;height:190px;border-radius:45px 45px 30px 30px;background:#f3cfae;box-shadow:0 10px 20px rgba(0,0,0,.25);border:5px solid #d9a982}
.hl .b{background:#ffd6e8 !important;font-weight:900}
.letter{position:absolute;left:170px;top:210px;width:740px;height:930px;background:#fff8ec;border-radius:16px;box-shadow:0 30px 70px rgba(0,0,0,.45);padding:70px 66px;box-sizing:border-box;background-image:repeating-linear-gradient(#fff8ec 0 86px,#e9d9c3 86px 89px);color:#3b2f55}
.letter p{margin:0;height:89px;font-size:50px;line-height:89px;font-weight:700;white-space:nowrap;overflow:hidden}
.letter .to{color:#7a63b8;font-weight:900}
.blot{position:absolute;width:70px;height:62px;border-radius:50%;background:rgba(120,160,230,.35);filter:blur(2px)}
`;document.head.appendChild(st)}

// ===== 0. 밤 참호 → ENFP 총공격 =====
S[0]=()=>{
  const scene=new THREE.Scene();const fog=new THREE.Fog(0x2a2f55,6,26);scene.fog=fog;
  const hemi=new THREE.HemisphereLight(0xb8c4ff,0x404050,0.9);scene.add(hemi);const dl=new THREE.DirectionalLight(0xc8d0ff,0.9);dl.position.set(-6,10,6);scene.add(dl);
  const r=rng(31);const gnd=ground(scene,0x6f8a62,300);
  for(let i=0;i<9;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4)*13+r()*4,0,-60-r()*12);scene.add(h)}
  sandbags(scene,0,0,16,3);
  const IN=[];for(let i=0;i<9;i++){const p=infp(r);p.position.set(-4.8+i*1.2,0,0.85+(i%2)*0.25);p.rotation.y=Math.PI;aim(p);scene.add(p);IN.push(p)}
  const IG=infpG(r);sweat(IG);IG.position.set(1.0,0,2.2);IG.rotation.y=Math.PI;scene.add(IG);
  // ENFP 대군
  const EA=[];const E=EV(0),RV=E.reveal;
  const EGp=enfpG(r);scene.add(EGp);
  const BN=banner('LET\'S BE FRIENDS!!',4.4,1.0);scene.add(BN);
  for(let row=0;row<6;row++)for(let c=0;c<11;c++){const p=enfp(r);const x=(c-5)*1.25+(row%2)*0.6+(r()-0.5)*0.3;scene.add(p);
    if((c+row)%3===0)holdIn(p,bouquet(),1,0,-0.66,0.08);else if((c+row)%3===1)holdIn(p,snack(),0,0,-0.66,0.08);
    EA.push({p,x,row,c})}
  const flares=[];for(let i=0;i<5;i++){const g=glowSprite('rgba(255,190,120,1)',6);scene.add(g);flares.push({g,x:(i-2)*7+r()*2,ph:r()})}
  const C=cam(50);const T=titleUI();
  const ch=chip('Weapons: flowers · snacks · tees');ch.style.fontSize='50px';
  const bG=sb(scene,'ALL TROOPS, CHARGE!!!',0,0,0,{c:EC,size:0.0042});const bK=sb(scene,'…just shoot us instead.',0,0,0,{c:IC,size:0.0016});
  return t=>{
    // 하늘: 밤 → 해 뜨듯 밝아짐
    const L=ease((t-RV+0.4)/1.0);setSky(lerpCol('#141a3a','#ff9fc4',L),lerpCol('#3c4170','#ffe3a8',L)+' 75%');
    const TL1=at(0,'n1'),TL2=TL1+1.25,TL3=TL1+2.34;const ph1=t<TL2,ph3=t>=TL3&&t<RV;
    fog.color.set(lerpCol('#2a2f55','#ffd9c8',L));fog.near=(ph1?4:ph3?14:6)+L*24;fog.far=(ph1?30:ph3?50:26)+L*90;hemi.intensity=(ph1?0.12:0.9)+L*0.8;dl.intensity=(ph1?0.08:0.9)+L*0.8;
    flares.forEach(f=>{f.g.position.set(f.x,4+ease((t-RV-f.ph*0.4)/1.5)*9,-38);f.g.material.opacity=L*0.9});
    IN.forEach(p=>{aim(p);tremble(p,t,t<RV+0.5?1:0.4)});stern(IG);updSweat(IG,t);
    // 대군 전진 (z: -40 → 가까이)
    const zRaw=-42+t*4.0,zf=Math.min(zRaw,-8.5),arr=zRaw>-8.5;
    EA.forEach(q=>{const z=zf-q.row*1.5;q.p.position.set(q.x,0,z);if(arr){standPose(q.p);cheerPose(q.p,t,0.8)}else{runPose(q.p,t*12+q.p.userData.ph);if(q.c%4===0&&q.row<2)armUp(q.p,0,0.9)}});
    EGp.position.set(0.3,0,zf+1.6);if(arr)standPose(EGp);else runPose(EGp,t*11);armUp(EGp,1,0.9+Math.sin(t*9)*0.1);
    BN.position.set(0,0,zf+0.5);waveBanner(BN,t);{const u=pop((t-RV+0.1)/0.45);BN.visible=u>0.01;BN.scale.set(1,Math.max(0.01,u),1)}
    // 카메라
    const g1=at(0,'g1'),n2=E.n2,k1=E.k1;
    if(ph1){const k=ease(t/TL2);setCam(C,[1.2,0.45,zf+8-k*0.6],[0,2.2,zf-2],50)}
    else if(t<TL3){const k=ease((t-TL2)/(TL3-TL2));setCam(C,[0.4,2.0,3.4-k*0.3],[0,1.6,-12],50)}
    else if(t<RV){const k=ease((t-TL3)/(RV-TL3));setCam(C,[0.6,5.2+k*0.6,7.5+k*0.8],[0,0.6,-20],50)}
    else if(t<n2+1.6){const k=ease((t-RV)/2.4);const z=zf+6.5;setCam(C,[2.0-k*1.2,1.3+k*0.2,zf+10.5-k*1.0],[0,2.2,zf-1.5],52)}
    else if(t<k1){const k=ease((t-n2-1.6)/2.2);const z=zf;setCam(C,lerp3([0.8,1.5,z+9.5],[-1.5,3.6,z+11],k),lerp3([0,2.2,z-1.5],[0,2.0,z-1.0],k),52)}
    else{const k=ease((t-k1)/0.5);setCam(C,[0.2,2.2,IG.position.z-3.1+k*0.15],[1.0,2.45,IG.position.z],40)}
    bG.position.set(0.3,3.75,zf+1.6);show(bG,t,g1,g1+1.9);
    bK.position.set(1.0,2.88,IG.position.z);show(bK,t,at(0,'k1'),99);
    const TO=RV-0.15;const T0=[TL1-0.2,TL1-0.1,TL2-0.05,TL3-0.05];T.forEach((e,i)=>{e.style.transform=(i==0?'translateX(-50%) ':'')+`scale(${pop((t-T0[i])/0.35)})`;e.style.opacity=t<TO?clamp01((t-T0[i])/0.1):clamp01(1-(t-TO)/0.2)});
    const ct=n2+2.4;chipPop(ch,t,ct);ch.style.opacity=t>ct&&t<k1?1:0;
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 방공호 · 초인종 =====
S[1]=()=>{
  setSky('#1a1830','#1a1830');
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffffff,0x605a70,1.5);scene.add(hemi);const dl=new THREE.DirectionalLight(0xffffff,0.8);dl.position.set(2,6,4);scene.add(dl);
  const ml=new THREE.PointLight(0x9fc4ff,0,10,1.5);ml.position.set(0,2,-3);scene.add(ml);
  const r=rng(41);room(scene,{w:8,h:3.4,d:9,wall:0xb9b0d4,floor:0x8a7a6a});
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.16,16,12),basic(0xfff0b0));bulb.position.set(2.6,3.25,2.0);scene.add(bulb);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.4,2.4,0.1),lamb(0x7a7f8a));door.position.set(2.4,1.2,-4.45);scene.add(door);
  for(let i=0;i<5;i++){const rv=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.03,8),lamb(0x55595f));rv.rotation.x=Math.PI/2;rv.position.set(1.85+i*0.27,2.2,-4.39);scene.add(rv)}
  // 모니터(인터폰) — 문 앞 ENFP를 렌더 타깃으로
  const rt=new THREE.WebGLRenderTarget(512,320);rt.texture.colorSpace=THREE.SRGBColorSpace;
  const s2=new THREE.Scene();s2.background=new THREE.Color(0xd9cfa8);s2.add(new THREE.HemisphereLight(0xffffff,0x887766,2.0));
  const EP=enfp(r);s2.add(EP);const c2=new THREE.PerspectiveCamera(62,512/320,0.05,50);
  const mon=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.0),new THREE.MeshBasicMaterial({map:rt.texture}));mon.position.set(-0.6,1.9,-4.43);scene.add(mon);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.2,0.06),lamb(0x2a2a30));frame.position.set(-0.6,1.9,-4.47);scene.add(frame);
  const offM=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.0),basic(0x0d0d14));offM.position.set(-0.6,1.9,-4.425);scene.add(offM);
  const IN=[];[[-2.2,-0.6],[-0.8,0.2],[0.8,-0.4],[2.2,0.4],[-1.6,1.8],[0.2,1.9],[1.7,2.0]].forEach(([x,z],i)=>{const p=infp(r);p.position.set(x,0,z);liePose(p);p.rotation.z=(r()-0.5)*0.3;scene.add(p);IN.push(p)});
  const E=EV(1);const C=cam(50);
  const bA=sb(scene,'go…',0,0,0,{c:IC,size:0.0018}),bB=sb(scene,'go… away…',0,0,0,{c:IC,size:0.0018});
  const rl=div('rule','<small>INFP Survival Rule #1</small><b>Doorbell = play dead</b>');
  return t=>{
    const dk=ease((t-E.dark)/0.15);hemi.intensity=1.5-dk*0.95;dl.intensity=0.8-dk*0.75;bulb.material.color.set(dk>0.5?0x3a3a40:0xfff0b0);
    const on=t>E.ding;offM.visible=!on;ml.intensity=on?7:0;
    // 모니터 속 ENFP: 카메라 쪽으로 얼굴 들이밀고 손 흔듦
    standPose(EP);wave1(EP,t,1);const lean=Math.sin(t*2.2)*0.08;EP.userData.hip.rotation.x=0.04+lean*0.4;
    const zz=t>at(1,'e1')?Math.sin((t-at(1,'e1'))*3)*0.15:0;c2.position.set(0,1.74,0.85);c2.lookAt(0,1.62,0);
    if(on){renderer.setRenderTarget(rt);renderer.render(s2,c2);renderer.setRenderTarget(null)}
    IN.forEach((p,i)=>{p.position.y=0.18+Math.abs(Math.sin(t*38+i))*0.012});
    const e1=at(1,'e1'),n3=at(1,'n3');
    if(t<e1-0.2){const k=ease(t/1.4);setCam(C,[0.5,4.6-k*0.4,4.0],[-0.2,0.6,-1.2],55)}
    else if(t<n3-0.2){const k=ease((t-e1+0.2)/2.6);setCam(C,lerp3([0.5,4.2,4.0],[-0.6,1.75,-2.3],k),lerp3([-0.2,0.6,-1.2],[-0.6,1.6,-4.4],k),50)}
    else{const k=ease((t-n3+0.2)/3);setCam(C,[-0.7+k*0.3,1.7-k*0.2,-3.4],[0.1,0.3,0.8],52)}
    bA.position.set(-0.8,0.75,0.2);bB.position.set(0.8,0.75,-0.4);
    show(bA,t,n3+0.1,99);show(bB,t,n3+0.6,99);
    popEl(rl,t,n3+0.3,'translateX(-50%)');rl.style.opacity=t>n3+0.3?1:0;
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 강제 자기소개 =====
function micMesh(){const g=new THREE.Group();const h=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.025,0.26,10),lamb(0x2a2a30));g.add(h);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(0.065,14,10),smooth(0x9a9aa6));hd.position.y=0.16;g.add(hd);return g}
S[2]=()=>{
  setSky('#9fd0f5','#eef7ff 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe4f0fa,30,110);addLights(scene,{hemi:1.6});
  const r=rng(53);ground(scene,0xb9c99a,300);
  const plz=new THREE.Mesh(new THREE.CircleGeometry(5,40),lamb(0xd9cbb8));plz.rotation.x=-Math.PI/2;plz.position.y=0.01;scene.add(plz);
  for(let i=0;i<7;i++){const h=makeHouse(r,{wall:pick(r,[0x9a90c4,0x8f86b8,0xa69bd0])});h.position.set((i-3)*4.2,0,-10-r()*2);scene.add(h)}
  for(let i=0;i<8;i++)tree(scene,(i-3.5)*5+r(),-15-r()*3,1.1,0x76a866);
  const BN=banner('Friend Games ♥',5.6,0.95);BN.position.set(0,-0.75,-6.2);scene.add(BN);
  const N=12,K=5,R0=2.9,step=Math.PI*2/N;const P=[];
  for(let i=0;i<N;i++){const a=-Math.PI/2+(K-i)*step;const x=Math.cos(a)*R0,z=-Math.sin(a)*R0*-1;
    const isI=i===K||i===8||i===10;const p=isI?infp(r):enfp(r);const px=Math.cos(a)*R0,pz=Math.sin(a)*R0;
    p.position.set(px,0,pz);p.rotation.y=Math.atan2(-px,-pz);chair(scene,px,pz,p.rotation.y);scene.add(p);P.push({p,isI,a})}
  const T=P[K].p;brows(T,-0.25);sweat(T);
  const mic=micMesh();scene.add(mic);
  const E=EV(2),PASS=E.pass,MIC=E.mic,Q=E.quiet,CL=E.clap;
  const hopT=i=>PASS+(MIC-PASS)*(i/K); // i번째 사람에게 넘어가는 시각
  const HB=['I\'m an ENFP~!!','I love travel!!','Let\'s all be friends!!','Karaoke later!!'].map(tx=>sb(scene,tx,0,0,0,{c:EC,size:0.0017}));
  const b0=sb(scene,'Hi!!',0,0,0,{c:EC,size:0.0019});
  const bT=sb(scene,'(inner) Hi, I\'m… no. Again.',0,0,0,{c:TC,size:0.0012});
  const bS=sb(scene,'…uh, hi… INFP.',0,0,0,{c:IC,size:0.00105}),bE=sb(scene,'…that\'s it.',0,0,0,{c:IC,size:0.0032});
  const ch=chip('Intro rehearsals: 1');const ch2=chip('Intro length: 3 sec');
  const C=cam(48);const hv=new THREE.Vector3();
  return t=>{
    // 마이크 주인
    let hold=0;for(let i=1;i<=K;i++)if(t>=hopT(i))hold=i;
    const look=t>MIC; // 다들 INFP를 봄
    P.forEach((q,i)=>{const p=q.p;standPose(p);p.userData.hip.rotation.x=0;
      const cheer=t>CL&&!q.isI;
      if(cheer){standPose(p);cheerPose(p,t,1)}else if(i===0&&t<PASS){standPose(p);armUp(p,0,0.7+Math.sin(t*8)*0.15)}else{sitPose(p)}
      p.userData.head.rotation.y=0;
      if(look&&i!==K){const dx=T.position.x-p.position.x,dz=T.position.z-p.position.z;const want=Math.atan2(dx,dz);let d=want-p.rotation.y;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;p.userData.head.rotation.y=Math.max(-1.2,Math.min(1.2,d))*ease((t-MIC)/0.3)}
      if(i===hold){const a=p.userData.arms[1];a.rotation.x=-2.0;a.rotation.z=0.35}
    });
    // INFP: 받을 때 굳은 채 일어섬
    if(t>MIC&&t<CL+99){standPose(T);const a=T.userData.arms[1];a.rotation.x=-2.0;a.rotation.z=0.35;T.userData.hip.position.y=0.8+Math.sin(t*40)*0.006}
    tremble(T,t,t>PASS&&t<MIC?1:0.4);updSweat(T,t);
    // 마이크 위치: 주인 손 → 다음 사람 손으로 포물선
    const handPos=i=>{const p=P[i].p;p.updateMatrixWorld(true);p.userData.arms[1].children[1].getWorldPosition(hv);return hv.clone()};
    let mp;const nx=hold+1;const tN=hold<K?hopT(nx):1e9;
    if(hold<K&&t>tN-0.25){const k=clamp01((t-tN+0.25)/0.25);const A=handPos(hold),B=handPos(nx);mp=A.lerp(B,k);mp.y+=Math.sin(k*Math.PI)*0.4}else mp=handPos(hold);
    mic.position.copy(mp);mic.position.y+=0.1;mic.rotation.set(0.3,0,0);
    // 말풍선
    b0.position.copy(headPos(P[0].p,0.62));show(b0,t,at(2,'e4'),PASS-0.1);
    HB.forEach((b,j)=>{const i=j+1;if(i>=K){scaleBubble(b,0);return}b.position.copy(headPos(P[i].p,0.6));show(b,t,hopT(i)+0.05,hopT(i+1)-0.3)});
    bT.position.copy(headPos(T,0.6));show(bT,t,at(2,'s4'),MIC-0.1);bS.position.copy(headPos(T,0.62));show(bS,t,at(2,'s5'),Q);bE.position.copy(headPos(T,0.62));show(bE,t,at(2,'s6'),CL);
    // 칩
    const s4=at(2,'s4'),s4e=endOf(2,'s4');const n=Math.max(1,Math.round(1+36*clamp01((t-s4)/(s4e-s4+0.3))));ch.textContent=`Intro rehearsals: ${n}`;chipPop(ch,t,s4);ch.style.opacity=t>s4&&t<MIC+0.4?1:0;
    chipPop(ch2,t,CL+0.2);ch2.style.opacity=t>CL+0.2?1:0;
    // 카메라
    const Tp=headPos(T,0);
    if(t<PASS){const k=ease(t/PASS);const sp=headPos(P[0].p,0);setCam(C,[sp.x*0.1+0.6,2.3,sp.z*0.1-1.2+k*0.3],[sp.x,1.55,sp.z],46)}
    else if(t<MIC){const k=ease((t-PASS)/(MIC-PASS));const ang=-Math.PI/2+0.9-0.9*k;const rad=6.2-k*3.3;setCam(C,[Math.sin(ang)*rad*0+Tp.x+Math.cos(ang+Math.PI)*0,2.9-k*0.7,Tp.z+rad],[Tp.x,1.3+k*0.35,Tp.z],46)}
    else if(t<Q){const k=ease((t-MIC)/0.4);setCam(C,lerp3([Tp.x,2.2,Tp.z+3.6],[Tp.x+0.2,2.1,Tp.z+3.0],k),[Tp.x,1.95,Tp.z],44)}
    else{const k=ease((t-Q)/3);setCam(C,lerp3([Tp.x+0.4,5.6,Tp.z+7.6],[Tp.x+0.2,6.0,Tp.z+8.4],k),[0,0.6,-1.4],48)}
    waveBanner(BN,t);
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 국경 거절 실패 → 우정 팔찌 12개 =====
S[3]=()=>{
  setSky('#9fd0f5','#eef7ff 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe4f0fa,30,110);addLights(scene,{hemi:1.6});
  const r=rng(61);field(scene,r,{mz:0});
  const A=enfp(r);A.position.set(-0.8,0,-0.9);A.rotation.y=0.5;scene.add(A);
  const B=infp(r);brows(B,-0.25);B.position.set(0.8,0,0.9);B.rotation.y=Math.PI+0.5;scene.add(B);sweat(B);
  // 팔찌 공방 무대 (컷 후)
  const G2=new THREE.Group();G2.position.set(0,0,-60);scene.add(G2);
  const booth=new THREE.Mesh(new THREE.BoxGeometry(5,2.6,0.3),lamb(0xffd6e8));booth.position.set(0,1.3,-2.2);G2.add(booth);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.6,0.9),new THREE.MeshBasicMaterial({map:canvasTex(800,200,(x,w,h)=>{x.fillStyle='#ff6fae';rr(x,0,0,w,h,40);x.fill();x.fillStyle='#fff';x.font=`900 110px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('BFF Bracelets ♥',w/2,h/2+6)})}));sign.position.set(0,2.95,-2.0);G2.add(sign);
  const B2=infp(r);B2.position.set(0,0,0);G2.add(B2);
  const F=[];for(let i=0;i<12;i++){const p=enfp(r);const a=Math.PI+0.12+i/11*(Math.PI-0.24);const rad=1.4+(i%2)*0.75;p.position.set(Math.cos(a)*rad,0,Math.sin(a)*rad*0.8);p.lookAt(0,0,0);G2.add(p);F.push(p)}
  const COLS=[0xff6fae,0xffd23f,0x7fd0ff,0x9ef2a8,0xc9a8ff,0xffa94d];const BR=[];
  for(let i=0;i<12;i++){const side=i%2;const m=new THREE.Mesh(new THREE.TorusGeometry(0.105,0.028,8,20),smooth(COLS[i%6]));m.rotation.x=Math.PI/2;m.position.set(0,-0.18-Math.floor(i/2)*0.07,0);B2.userData.arms[side].add(m);BR.push(m)}
  const bat=new THREE.Sprite(new THREE.SpriteMaterial({map:battery(0.4,false),transparent:true,depthTest:false}));bat.scale.set(0.75,0.35,1);bat.renderOrder=11;scene.add(bat);
  const E=EV(3),CUT=E.cut;const C=cam(46);
  const bE1=sb(scene,'Besties now??',0,0,0,{c:EC,size:0.0017}),bE2=sb(scene,'Matching bracelets!!',0,0,0,{c:EC,size:0.0018});
  const bT=sb(scene,'(inner) Say no. Firmly.',0,0,0,{c:TC,size:0.0013}),bS=sb(scene,'…oh sure haha',0,0,0,{c:IC,size:0.0017});
  const bF=sb(scene,'Me too!!',0,0,0,{c:EC,size:0.0024}),bF2=sb(scene,'Me too!!!',0,0,0,{c:EC,size:0.0024});
  const ch=chip('Met 3 hrs ago · Besties: 12');
  return t=>{
    standPose(A);wave1(A,t,t<at(3,'s1')?1:0.5);A.userData.hip.position.y=0.8+Math.abs(Math.sin(t*6))*0.08;
    stern(B);updSweat(B,t);const s2=at(3,'s2');
    if(t>s2){setFace(B,true)}
    if(t<CUT){
      const s1=at(3,'s1');
      if(t<s1-0.1){const k=ease(t/1.6);setCam(C,[4.6-k*0.5,1.9,1.4],[0,1.5,0],46)}
      else if(t<s2-0.05){const k=ease((t-s1+0.1)/0.5);setCam(C,lerp3([4.1,1.9,1.4],[0.55,2.15,-1.75],k),lerp3([0,1.5,0],[0.8,2.3,0.9],k),42)}
      else{setCam(C,[0.55,2.15,-1.75],[0.8,2.3,0.9],42)}
      bE1.position.copy(headPos(A,0.62));bE2.position.copy(headPos(A,0.62));bT.position.copy(headPos(B,0.62));bS.position.copy(headPos(B,0.62));
      const e2=at(3,'e2'),el=LN(3,'e2')[1];show(bE1,t,e2,e2+el*0.6);show(bE2,t,e2+el*0.6,s1-0.05);show(bT,t,s1,s2-0.05);show(bS,t,s2,CUT);
      bat.visible=false;ch.style.opacity=0;[bF,bF2].forEach(b=>scaleBubble(b,0));
    }else{
      [bE1,bE2,bT,bS].forEach(b=>scaleBubble(b,0));
      standPose(B2);setFace(B2,false);B2.userData.arms[0].rotation.z=-0.5;B2.userData.arms[1].rotation.z=0.5;
      F.forEach((p,i)=>{standPose(p);cheerPose(p,t,1)});
      BR.forEach((m,i)=>{const k=pop((t-CUT-0.25-i*0.13)/0.25);m.scale.setScalar(Math.max(0.001,k))});
      const k=ease((t-CUT)/2.5);setCam(C,lerp3([0,2.0,-54.8],[0,2.2,-55.8],k),[0,1.6,-61],46);
      bF.position.set(-1.7,2.55,-61.0);bF2.position.set(1.8,2.5,-60.9);show(bF,t,CUT+0.4,CUT+1.6);show(bF2,t,CUT+0.9,CUT+2.0);
      const lv=Math.max(0.01,0.4-ease((t-CUT-1.0)/1.2)*0.39);const red=lv<0.1;bat.material.map=battery(lv<0.02?0.01:lv,red);bat.visible=!(red&&Math.floor(t*4)%2);
      bat.position.copy(headPos(B2,0.75));
      chipPop(ch,t,CUT+0.5);ch.style.opacity=t>CUT+0.5?1:0;
    }
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 진심 편지 → 답장 300통 =====
S[4]=()=>{
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffe2c0,0x403040,0.6);scene.add(hemi);
  const r=rng(71);room(scene,{w:6,h:3.2,d:6,wall:0x6e6390,floor:0x5a4a40});
  table(scene,0,0,1.6,0.9,0x8a6a4a);
  const cnd=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.3,12),lamb(0xfff4e0));cnd.position.set(-0.5,1.05,0.1);scene.add(cnd);
  const flame=glowSprite('rgba(255,190,90,1)',0.6);flame.position.set(-0.5,1.27,0.1);scene.add(flame);const pl=new THREE.PointLight(0xffb060,4,8,1.5);pl.position.set(-0.5,1.4,0.2);scene.add(pl);
  const IG=infpG(r);IG.position.set(0.15,0,-0.95);scene.add(IG);
  const pap=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.56),lamb(0xfff8ec));pap.rotation.x=-Math.PI/2;pap.position.set(0.15,0.905,0.05);scene.add(pap);
  // ENFP 본부 (멀리 떨어진 무대)
  
  const sun=new THREE.HemisphereLight(0xffffff,0x8a8070,0);scene.add(sun);const sd=new THREE.DirectionalLight(0xffffff,0);sd.position.set(86,10,8);scene.add(sd);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(60,60),lamb(0xa9c98a));gr.rotation.x=-Math.PI/2;gr.position.set(80,0.01,0);scene.add(gr);
  tent(scene,80,-4,0xffc94d,1.5);
  const EG=enfpG(r);EG.position.set(80,0,0);scene.add(EG);const lt=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.56),new THREE.MeshLambertMaterial({color:0xfff8ec,side:THREE.DoubleSide}));holdIn(EG,lt,0,0.15,-0.62,0.18);lt.rotation.x=-0.4;
  const ES=[];[[-1.3,0.5],[1.3,0.5],[-0.8,1.4],[0.9,1.5],[-2.0,-0.4],[2.0,-0.3]].forEach(([x,z])=>{const p=enfp(r);p.position.set(80+x,0,z);p.lookAt(80,0,0);p.rotation.y+=0;scene.add(p);ES.push(p)});
  const TR=[];const drm=new THREE.MeshBasicMaterial({color:0x7fc4ff,transparent:true});
  [EG,...ES].forEach((p,pi)=>{for(let s=-1;s<=1;s+=2)for(let k=0;k<5;k++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),drm);scene.add(d);TR.push({d,p,s,ph:k/5,big:pi===0})}});
  // 답장 산더미 (INFP 방공호 앞)
  const D=new THREE.Group();D.position.set(-80,0,0);scene.add(D);
  const dg=new THREE.Mesh(new THREE.PlaneGeometry(60,60),lamb(0x9cb97a));dg.rotation.x=-Math.PI/2;dg.position.set(-80,0.01,0);scene.add(dg);
  const bk=new THREE.Mesh(new THREE.BoxGeometry(5,2.4,3),lamb(0x8f86b8));bk.position.set(-80,1.2,-2.5);scene.add(bk);
  const dr=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.9),basic(0x4a4560));dr.position.set(-80,0.95,-0.99);scene.add(dr);
  const ENV=[];for(let i=0;i<300;i++){const e=envelopeMesh(pick(r,[0xffffff,0xfff1a8,0xffd6e8,0xd6f0ff]));const a=r()*Math.PI*2,rd=Math.sqrt(r())*2.1;
    const x=-80+Math.cos(a)*rd,z=-0.3+Math.sin(a)*rd*0.7;const y=0.02+(1-rd/2.2)*1.7*Math.pow(r(),0.4);e.position.set(x,y,z);e.rotation.set((r()-0.5)*0.6,r()*6,(r()-0.5)*0.6);scene.add(e);ENV.push({e,y,d:i/300})}
  const PG=pigeon();PG.scale.setScalar(1.05);scene.add(PG);const pgG=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(0x9cb97a));pgG.rotation.x=-Math.PI/2;pgG.position.set(0,0,-80);scene.add(pgG);for(let i=0;i<8;i++)tree(scene,(i-3.5)*5,-52-r()*6,1.3,0x76a866);
  const E=EV(4);const C=cam(46);
  const lw=div('letter',`<p class="to">Dear ENFP Nation,</p><p></p><p></p><p></p><p></p><p></p><p style="text-align:right">— INFP General</p>`);const ps=lw.querySelectorAll('p');
  const LT=['We really need','some alone time.','Could you please','not text us for','just 3 days…'];
  const blot=div('blot','',lw);blot.style.left='520px';blot.style.top='470px';
  const bG=sb(scene,'WRITE BACK!!',0,0,0,{c:EC,size:0.0024});
  const cmp=div('cmpbox','<div class="c1"><small>INFP letters</small><b>1</b></div><div class="c1"><small>ENFP replies</small><b class="n">0</b></div>');const cn=cmp.querySelector('.n');
  return t=>{
    const W=E.write,FLY=E.fly,RD=E.read,PILE=E.pile;
    const inRoom=t<FLY,atHQ=t>=RD&&t<PILE,atPile=t>=PILE;
    hemi.intensity=inRoom?0.6:0;pl.intensity=inRoom?4+Math.sin(t*17)*0.6:0;sun.intensity=inRoom?0:1.6;sd.intensity=inRoom?0:1.5;
    setSky(inRoom?'#241c38':'#9fd0f5',inRoom?'#241c38':'#eef7ff 70%');
    sitPose(IG);setFace(IG,false);IG.userData.legs.forEach(l=>l.visible=false);IG.userData.hip.position.y=0.56;IG.userData.arms[1].rotation.x=-1.25+Math.sin(t*14)*0.06*(t>W?1:0);IG.userData.head.rotation.x=0.35;
    flame.scale.setScalar(0.55+Math.sin(t*23)*0.05);
    // 편지 DOM
    const lin=ease((t-W)/0.3),lout=ease((t-FLY+0.4)/0.3);lw.style.display=t>W&&t<FLY?'block':'none';lw.style.transform=`translateY(${(1-lin)*80}px) scale(${1-lout*0.7}) rotate(${-lout*20}deg)`;lw.style.opacity=1-lout;
    LT.forEach((s,i)=>{const k=clamp01((t-W-0.25-i*0.32)/0.32);ps[i+1].textContent=s.slice(0,Math.round(s.length*k))});
    const bk2=pop((t-E.tear)/0.3);blot.style.transform=`scale(${bk2})`;blot.style.opacity=t>E.tear?1:0;
    // 비둘기
    PG.visible=t>=FLY&&t<RD;flapW(PG,t);const pk=(t-FLY)/(RD-FLY);PG.position.set(-2.6+pk*5.2,2.6+Math.sin(pk*Math.PI)*0.5,-40);PG.rotation.y=Math.PI/2;
    // ENFP 본부
    standPose(EG);EG.userData.arms[0].rotation.x=-1.2;EG.userData.head.rotation.x=0.25;
    ES.forEach((p,i)=>{standPose(p);if(t>at(4,'g2')+1.2)cheerPose(p,t,0.8);else{p.userData.arms[0].rotation.x=-2.3;p.userData.arms[0].rotation.z=0.8}});
    if(t>at(4,'g2')+1.2)armUp(EG,1,1);
    TR.forEach(q=>{const on=atHQ&&(q.big||t>RD+0.8);q.d.visible=on;if(!on)return;const lt=(t*1.6+q.ph)%1;const hp=headPos(q.p,0);q.d.position.set(hp.x+q.s*(0.1+lt*0.25),hp.y+0.24-lt*lt*0.9,hp.z+0.22);q.d.scale.setScalar(q.big?1.4:1)});
    bG.position.copy(headPos(EG,0.78));show(bG,t,at(4,'g2')+1.3,PILE);
    // 산더미
    ENV.forEach(q=>{const k=clamp01((t-PILE-q.d*2.6)/0.35);q.e.visible=atPile&&k>0;q.e.position.y=q.y+(1-ease(k))*6});
    cn.textContent=fmt(Math.min(300,Math.max(0,(t-PILE)/2.6*300)));cmp.style.display=atPile&&t>PILE+0.3?'flex':'none';
    if(inRoom){const k=ease(t/3);setCam(C,[1.2-k*0.3,2.0,1.7-k*0.3],[0.1,1.15,-0.1],44)}
    else if(!atHQ&&!atPile){setCam(C,[0,2.2,-32.5],[0,2.4,-40],50)}
    else if(atHQ){const k=ease((t-RD)/3.5);setCam(C,lerp3([80.2,2.1,2.6],[80.3,2.6,4.6],k),[80,1.95,0],44)}
    else{const k=ease((t-PILE)/3);setCam(C,lerp3([-80,2.0,6.5],[-80,3.4,8.0],k),[-80,1.1,-0.5],50)}
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. ENFP 떠남 → 평화 → 허전 =====
S[5]=()=>{
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe4f0fa,30,110);const hemi=new THREE.HemisphereLight(0xffffff,0x8a8070,1.6);scene.add(hemi);const dl=new THREE.DirectionalLight(0xffffff,1.5);dl.position.set(6,12,8);scene.add(dl);
  const r=rng(81);field(scene,r,{mz:0});
  const ER=[];const ES=enfp(r);ES.position.set(-0.6,0,-1.6);scene.add(ES);const EG=enfpG(r);EG.position.set(0.8,0,-2.4);scene.add(EG);
  for(let i=0;i<22;i++){const p=enfp(r);p.position.set((i%11-5)*1.3+(r()-0.5)*0.4,0,-3.6-Math.floor(i/11)*1.4);scene.add(p);ER.push({p,x:p.position.x,z:p.position.z})}
  const pf=phoneMesh(0xfff1a8);pf.userData.rec.visible=false;
  // INFP 방 (멀리 떨어진 무대)
  const R=new THREE.Group();scene.add(R);
  const rm=new THREE.Mesh(new THREE.BoxGeometry(6,3.2,6),new THREE.MeshLambertMaterial({color:0xd8cdef,side:THREE.BackSide}));rm.position.set(60,1.6,0);scene.add(rm);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(6,6),lamb(0xb79f86));fl.rotation.x=-Math.PI/2;fl.position.set(60,0.01,0);scene.add(fl);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.2),basic(0xbfe6ff));win.position.set(61.2,1.9,-2.98);scene.add(win);
  const wf=new THREE.Mesh(new THREE.BoxGeometry(1.95,1.35,0.05),lamb(0xffffff));wf.position.set(61.2,1.9,-3.0);scene.add(wf);
  const bd=bed(scene,59.6,-0.6);
  const B=infp(r);scene.add(B);sweat(B);B.userData.sweat.visible=false;
  // 엔딩: 텅 빈 국경
  const IG=infpG(r);IG.position.set(-1.5,0,4.2);IG.rotation.y=Math.PI;scene.add(IG);
  const E=EV(5);const C=cam(46);
  const bE=sb(scene,'General! A new country!!',0,0,0,{c:EC,size:0.0018}),bG=sb(scene,'GO!!!',0,0,0,{c:EC,size:0.003});
  const bD=sb(scene,'finally…',0,0,0,{c:IC,size:0.0017}),bW=sb(scene,'…why no texts?',0,0,0,{c:IC,size:0.0017});
  const hearts=sprinkleHearts(scene,5,r,{x:60,z:-0.6,w:0.6,size:0.004,col:'#c9a8ff'});
  const ch=chip('1 day later');const stat=div('statbox','<div><small>War</small><b>Year 2</b></div><div><small>Casualties</small><b>0</b></div>');
  const ph=div('kphone','<div class="screen"><div class="sbar"><span>9:41</span><span>●●●</span></div><div class="head">LET’S BE FRIENDS ♥ <small>312</small></div><div class="msgs"><div class="sys">2 years ago</div><div class="row"><div class="av" style="background:#ffc94d">1</div><div><div class="who">ENFP 1</div><div class="b">see u tomorrow!!</div></div></div><div class="sys">No new messages</div></div><div class="inp"><div class="box"></div><div class="sd">➤</div></div></div>');
  const endd=div('dim','');const e1=div('end1 out','Which war is next?');const e2=div('end2 out','Follow so you don\'t miss it');
  return t=>{
    const RUN=E.run,CALM=E.calm,DAY=E.day,WIDE=E.wide,LAST=E.last,END=E.end;
    const inRoom=(t>=CALM&&t<WIDE),last=t>=LAST;
    setSky(t>=WIDE&&!last?'#ffb38a':'#9fd0f5',t>=WIDE&&!last?'#ffe9c4 70%':'#eef7ff 70%');
    // ENFP 떠남
    standPose(ES);phoneUp(ES,1,1);ES.rotation.y=0.6;setFace(ES,true);standPose(EG);EG.rotation.y=-0.4;
    const lr=t-RUN;
    if(lr>0){[ES,EG].forEach((p,i)=>{p.rotation.y=-Math.PI/2;runPose(p,t*12+i);p.position.x=(i?0.8:-0.6)-lr*5.2})}
    else if(t>at(5,'g3'))armUp(EG,1,1);
    ER.forEach(q=>{standPose(q.p);if(lr>0){q.p.rotation.y=-Math.PI/2;runPose(q.p,t*12+q.p.userData.ph);q.p.position.x=q.x-Math.max(0,lr-0.15)*5.2}else{q.p.rotation.y=0;cheerPose(q.p,t,t>at(5,'g3')?1:0.3)}});
    bE.position.copy(headPos(ES,0.62));bG.position.copy(headPos(EG,0.75));show(bE,t,at(5,'e3'),at(5,'g3'));show(bG,t,at(5,'g3'),RUN+0.6);
    // INFP 방
    standPose(B);B.rotation.set(0,0,0);B.userData.head.rotation.set(0,0,0);
    if(t<DAY){B.rotation.x=-Math.PI/2;B.position.set(59.6,0.75,-0.95+1.4);B.rotation.x=-Math.PI/2;B.position.set(59.6,0.72,-1.05);B.rotation.x=-Math.PI/2;
      B.position.z=-1.15+1.5;setFace(B,true)}
    else{sitPose(B);B.rotation.y=Math.PI/2+0.2;B.position.set(59.3,0.12,0.0);B.userData.hip.position.y=0.58;setFace(B,false);
      const up=Math.sin((t-DAY)*2.2)>-0.2;phoneUp(B,1,up?0.75:0.25);B.userData.head.rotation.x=up?0.35:0.1}
    if(t<DAY){B.rotation.set(-Math.PI/2,0,0);B.position.set(59.6,0.76,0.45)}
    updHearts(hearts,t,CALM+0.6,1.4,1.4);hearts.forEach(q=>{q.h.visible=q.h.visible&&t<DAY&&inRoom});
    bD.position.set(59.6,1.85,-1.2);show(bD,t,CALM+0.5,DAY-0.15);bW.position.copy(headPos(B,0.62));show(bW,t,at(5,'s3'),WIDE);
    chipPop(ch,t,DAY);ch.style.opacity=t>DAY&&t<at(5,'s3')-0.1?1:0;
    // 엔딩 와이드: 장군이 텅 빈 국경을 봄
    stern(IG);
    if(!inRoom&&t<RUN+1.3){const k=ease(t/RUN);setCam(C,lerp3([2.4,1.9,2.0],[3.2,2.4,4.4],k),[-0.3,1.7,-2],46)}
    else if(inRoom){if(t<DAY){setCam(C,[61.4,2.6,0.8],[59.6,0.8,-1.4],46)}else{const k=ease((t-DAY)/3);setCam(C,[62.4-k*0.3,1.9,2.3-k*0.3],[59.3,1.75,0],44)}}
    else if(!last){const k=ease((t-WIDE)/6);setCam(C,lerp3([-0.4,3.0,9.0],[-0.2,3.3,10.5],k),[-1.0,1.8,-6],48)}
    else{setCam(C,[61.0,1.75,1.0],[59.3,1.4,0],44)}
    popEl(stat,t,vt(LN(5,'n7')[0])+0.2,'translateX(-50%)');stat.style.display=t>WIDE&&!last?'flex':'none';
    ph.style.display=last?'block':'none';ph.style.opacity=1-clamp01((t-END)/0.3);ph.style.transform=`translateY(${(1-ease((t-LAST)/0.35))*1400}px) scale(0.9)`;
    if(last){sitPose(B);B.rotation.set(0,Math.PI/2+0.2,0);B.position.set(59.3,0.12,0.0);B.userData.hip.position.y=0.58;phoneUp(B,1,0.75);setFace(B,false)}
    const ke=t>END;endd.style.opacity=ke?clamp01((t-END)/0.3)*0.9:0;e1.style.opacity=e2.style.opacity=ke?1:0;popEl(e1,t,END+0.1);popEl(e2,t,END+0.3);
    caption(5,t);renderer.render(scene,C);
  };
};

// ===== 썸네일 (한 장) =====
S[6]=()=>{
  setSky('#ff9fc4','#ffe3a8 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xffd9c8,30,120);addLights(scene,{hemi:1.7,dir:1.6});
  const r=rng(91);ground(scene,0x8fae78,300);
  for(let i=0;i<9;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4)*13+r()*4,0,-60-r()*12);scene.add(h)}
  for(let i=0;i<4;i++){const g=glowSprite('rgba(255,190,120,1)',7);g.position.set((i-1.5)*8,13,-40);g.material.opacity=0.8;scene.add(g)}
  sandbags(scene,0,0,10,3);
  // ENFP 대군: 모래주머니 너머에서 달려옴
  const zf=-4.5;const BN=banner('LET\'S BE FRIENDS!!',4.4,1.0);BN.position.set(0,0,zf-0.6);scene.add(BN);waveBanner(BN,0.6);
  const EG=enfpG(r);EG.position.set(0.2,0,zf+0.4);scene.add(EG);runPose(EG,1.2);armUp(EG,1,1);EG.userData.hip.rotation.x=0.12;
  for(let row=0;row<7;row++)for(let c=0;c<9;c++){const p=enfp(r);const x=(c-4)*1.15+(row%2)*0.55+(r()-0.5)*0.3;p.position.set(x,0,zf-0.8-row*1.3);scene.add(p);
    runPose(p,r()*6);if((c+row)%3===0){holdIn(p,bouquet(),1,0,-0.66,0.08);p.userData.arms[1].rotation.x=-1.4}else if((c+row)%3===1)armUp(p,0,0.95);else armUp(p,1,0.9)}
  // INFP: 모래주머니에 등 붙이고 숨어서 대기
  const IN=[];[[-0.75,0.6],[0.75,0.6]].forEach(([x,z],i)=>{const p=infp(r);p.position.set(x,0,z);scene.add(p);sweat(p);
    sitPose(p);p.userData.hip.position.y=0.36;const R=rifle();p.userData.hip.add(R);R.rotation.x=-Math.PI/2+0.15;R.position.set(0.1,0.35,0.22);
    p.userData.arms.forEach(a=>{a.rotation.x=-0.6;a.rotation.z=0});p.userData.head.rotation.x=0.08;IN.push(p)});
  IN.forEach((p,i)=>{p.userData.sweat.position.y=0.38;p.rotation.y=(i%2?-0.12:0.12)});
  const b1=sb(scene,'…!!',-0.85,1.72,0.6,{c:IC,size:0.0024}),b2=sb(scene,'…help',0.95,1.72,0.6,{c:IC,size:0.0022});scaleBubble(b1,1);scaleBubble(b2,1);
  const C=cam(52);setCam(C,[0.0,1.55,6.6],[0,3.05,-4],54);IN.forEach(p=>p.userData.legs.forEach(l=>l.rotation.x=-1.25));
  ui.insertAdjacentHTML('beforeend',`<div class="tag" style="top:200px;font-size:62px;padding:8px 32px">ENFP vs INFP × WAR</div><div class="title1 out" style="color:${C_E};font-size:160px;letter-spacing:-5px;top:300px">ENFP Nation</div><div class="title2 out" style="color:${C_I};font-size:150px;letter-spacing:-5px;top:480px">& INFP Nation</div><div class="title3 out" style="top:670px;font-size:132px">went to war?</div>`);
  return t=>{renderer.render(scene,C)};
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
