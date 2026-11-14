// ---------- ISFP 전쟁편 전용 ----------
function setSky(a,b){bgEl.style.background=`linear-gradient(${a},${b})`}
function lerpCol(c1,c2,k){const a=new THREE.Color(c1),b=new THREE.Color(c2);return '#'+a.lerp(b,clamp01(k)).getHexString()}
function topB(b){b.material.depthTest=false;b.renderOrder=10;return b}
function bubA(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||'#e2f7c9',fg:o.fg||'#2b3a10',fs:o.fs||64,size:o.size||0.003}))}
function bubE(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||'#e4e0ff',fg:o.fg||'#2d2766',fs:o.fs||64,size:o.size||0.003}))}
function bubT(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||'#f1f1f4',fg:o.fg||'#555',fs:o.fs||60,size:o.size||0.0028}))}
function show(b,t,t0,t1){scaleBubble(b,t>=t0&&t<t1?pop((t-t0)/0.25):0)}
function field(scene,r,o={}){
  ground(scene,o.g??0x9cb97a,300);
  const mud=new THREE.Mesh(new THREE.PlaneGeometry(90,6),lamb(o.mud??0xb09b72));mud.rotation.x=-Math.PI/2;mud.position.set(0,0.01,o.mz??0);scene.add(mud);
  for(let i=0;i<16;i++){const x=(i-7.5)*3.1+r()*0.6;const post=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.9,0.09),lamb(0x5d4e3e));post.position.set(x,0.45,(o.mz??0)+(i%2?0.3:-0.3));post.rotation.z=(r()-0.5)*0.3;scene.add(post)}
  for(const y of[0.35,0.7]){const w=new THREE.Mesh(new THREE.BoxGeometry(50,0.02,0.02),lamb(0x7d7d84));w.position.set(0,y,o.mz??0);scene.add(w)}
  for(let i=0;i<10;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4.5)*13+r()*4,0,-45-r()*12);scene.add(h)}
  for(let i=0;i<10;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4.5)*13+r()*4,0,45+r()*12);scene.add(h)}
}
function megaphone(){const m=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.48,14,1,true),new THREE.MeshLambertMaterial({color:0xf0f0f0,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;return m}
function megaOn(p,k){const u=p.userData;if(!u.mega){const m=megaphone();m.position.set(0.22,0.16,0.42);m.scale.setScalar(0.75);u.head.add(m);u.mega=m}u.mega.visible=k>0.05;u.arms[1].rotation.x=-1.55*k;u.arms[1].rotation.z=-0.35*k}
function holdRifleUp(p,k){const u=p.userData;if(!u.rf){const R=rifle();R.rotation.x=Math.PI/2;R.position.set(0,-0.62,0);u.arms[1].add(R);u.rf=R}u.rf.visible=k>0.05;u.arms[1].rotation.x=-2.95*k;u.arms[1].rotation.z=0.15*k}
function helmOff(p){const h=p.userData.head;h.children[1].visible=true;const n=h.children.length;h.children[n-1].visible=false;h.children[n-2].visible=false}
function happy(p){setFace(p,true)}
function cannon(col){const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.35,1.4),lamb(0x4a4a50));base.position.y=0.45;g.add(base);
  for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.14,12),lamb(0x3a3530));w.rotation.z=Math.PI/2;w.position.set(s*0.58,0.42,0);g.add(w)}
  const br=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.22,2.0,12),lamb(col));br.rotation.x=Math.PI/2-0.25;br.position.set(0,0.9,0.7);g.add(br);return g}
function crate(){const c=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,0.6),lamb(0x9a7652));c.position.y=0.3;return c}
// 포탄 + 그림(앞면 데칼)
function shellDraw(x,w,h,k,o){// k: 0~1 진행
  x.clearRect(0,0,w,h);
  const fl=(cx,cy,s,c)=>{x.fillStyle=c;for(let i=0;i<5;i++){const a=i/5*Math.PI*2;x.beginPath();x.arc(cx+Math.cos(a)*s,cy+Math.sin(a)*s,s*0.75,0,Math.PI*2);x.fill()}x.fillStyle='#ffd84d';x.beginPath();x.arc(cx,cy,s*0.6,0,Math.PI*2);x.fill()};
  const P=o.pal||['#ff8fb3','#ffb84d','#8fd0ff','#c9a8ff'];
  if(o.style==='b'){// 적군: 하트·별 + ^^ 눈 + 고양이 귀
    const ht=(cx,cy,s,c)=>{x.fillStyle=c;x.beginPath();x.moveTo(cx,cy+s*0.9);x.bezierCurveTo(cx-s*1.6,cy-s*0.2,cx-s*0.6,cy-s*1.3,cx,cy-s*0.4);x.bezierCurveTo(cx+s*0.6,cy-s*1.3,cx+s*1.6,cy-s*0.2,cx,cy+s*0.9);x.fill()};
    const star=(cx,cy,s,c)=>{x.fillStyle=c;x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr2=i%2?s*0.45:s;x.lineTo(cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2)}x.closePath();x.fill()};
    if(k>0.02)ht(75,300,26,'#c9a8ff');if(k>0.12)star(190,320,26,'#ffd84d');if(k>0.2)star(60,200,18,'#8fd0ff');if(k>0.28)ht(200,215,20,'#ff8fb3');
    if(k>0.36){x.strokeStyle='#222';x.lineWidth=8;x.lineCap='round';for(const ex of[100,160]){x.beginPath();x.arc(ex,128,13,Math.PI*1.1,Math.PI*1.9);x.stroke()}}
    if(k>0.42){x.fillStyle='#ff6b8a';x.beginPath();x.arc(130,150,12,0,Math.PI);x.fill();x.strokeStyle='#222';x.lineWidth=6;x.beginPath();x.moveTo(112,148);x.lineTo(148,148);x.stroke()}
    if(k>0.5){x.fillStyle='#8a5a3c';for(const s2 of[-1,1]){x.beginPath();x.moveTo(130+s2*30,70);x.lineTo(130+s2*70,10);x.lineTo(130+s2*80,80);x.closePath();x.fill()}}
    if(k>0.62&&o.name){x.fillStyle='#fff';rr(x,25,395,210,70,30);x.fill();x.fillStyle='#4a3080';x.font=`900 50px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(o.name,130,432);x.textAlign='left'}
    return}
  if(k>0.02)fl(70,300,26,P[0]);
  if(k>0.12)fl(190,330,20,P[1]);
  if(k>0.2)fl(60,190,18,P[2]);
  if(k>0.28)fl(200,210,22,P[3]);
  if(k>0.36){x.fillStyle='#222';x.beginPath();x.arc(100,120,13,0,Math.PI*2);x.arc(160,120,13,0,Math.PI*2);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(104,115,4,0,Math.PI*2);x.arc(164,115,4,0,Math.PI*2);x.fill()}
  if(k>0.42){x.strokeStyle='#222';x.lineWidth=7;x.lineCap='round';x.beginPath();x.arc(130,140,22,0.2,Math.PI-0.2);x.stroke();x.fillStyle='rgba(255,120,150,.7)';x.beginPath();x.arc(72,150,14,0,Math.PI*2);x.arc(188,150,14,0,Math.PI*2);x.fill()}
  if(k>0.5){x.fillStyle=o.rib||'#ff5a8a';x.beginPath();x.moveTo(130,40);x.lineTo(80,10);x.lineTo(85,70);x.closePath();x.fill();x.beginPath();x.moveTo(130,40);x.lineTo(180,10);x.lineTo(175,70);x.closePath();x.fill();x.beginPath();x.arc(130,40,14,0,Math.PI*2);x.fill()}
  if(k>0.62&&o.name){x.fillStyle='#fff';rr(x,25,395,210,70,30);x.fill();x.fillStyle='#2b2b3a';x.font=`900 50px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(o.name,130,432);x.textAlign='left'}
}
function shell(o={}){const g=new THREE.Group();const col=o.col??0x8a8f6a;
  const b=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.62,24),smooth(col));b.position.y=0.31;g.add(b);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(0.17,0.26,24),smooth(col));tip.position.y=0.75;g.add(tip);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(0.175,0.175,0.05,24),smooth(0xc9a14a));band.position.y=0.56;g.add(band);
  const c=document.createElement('canvas');c.width=260;c.height=480;const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  const dec=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.554),new THREE.MeshBasicMaterial({map:tex,transparent:true}));dec.position.set(0,0.4,0.176);g.add(dec);
  g.userData={c,x:c.getContext('2d'),tex,k:-1,o};return g}
function shellSet(s,k){k=Math.round(clamp01(k)*40)/40;if(k===s.userData.k)return;s.userData.k=k;shellDraw(s.userData.x,260,480,k,s.userData.o);s.userData.tex.needsUpdate=true}
function hug(p,k){const u=p.userData;u.arms[0].rotation.x=-1.25*k;u.arms[0].rotation.z=-0.55*k;u.arms[1].rotation.x=-1.25*k;u.arms[1].rotation.z=0.55*k}
function earbud(p,side=1){const e=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.08,0.06),smooth(0xffffff));e.position.set(side*0.255,0.22,0);p.userData.head.add(e);return e}
function pen(){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.2,8),lamb(0xff5a8a));return m}
// 카톡 폰(DOM)
function kphone(title,sub,o={}){const el=div('kphone',`<div class="screen"><div class="head">${title}<small>${sub||''}</small></div><div class="msgs"></div><div class="inp"><div class="box"></div><div class="sd">전송</div></div></div>`);
  if(o.top!=null)el.style.top=o.top+'px';return {el,msgs:el.querySelector('.msgs'),box:el.querySelector('.box')}}
function kmsg(P,who,text,o={}){const row=document.createElement('div');row.className='row'+(o.me?' me':'');
  if(o.me){row.innerHTML=`<div class="meta"><span class="un">${o.un??''}</span><span class="tm">${o.tm||''}</span></div><div class="b">${text}</div>`}
  else{row.innerHTML=`<div class="av" style="background:${o.av||'#9a8fd0'}">${o.ini||''}</div><div><div class="who">${who}</div><div style="display:flex;align-items:flex-end;gap:10px"><div class="b">${text}</div><div class="meta"><span class="un">${o.un??''}</span><span class="tm">${o.tm||''}</span></div></div></div>`}
  P.msgs.appendChild(row);row.style.display='none';return row}
function showRow(row,t,t0){const on=t>=t0;row.style.display=on?'flex':'none';if(on){const k=pop((t-t0)/0.25);row.style.transform=`scale(${0.7+0.3*k})`;row.style.transformOrigin=row.classList.contains('me')?'right bottom':'left bottom';row.style.opacity=clamp01((t-t0)/0.08)}}
{const st=document.createElement('style');st.textContent=`
.cal{position:absolute;left:170px;top:300px;width:740px;height:640px;background:#fffdf6;border-radius:40px;box-shadow:0 30px 70px rgba(0,0,0,.28);overflow:hidden}
.cal .mh{height:120px;background:#ff8f8f;color:#fff;font-size:60px;font-weight:900;display:flex;align-items:center;justify-content:center;letter-spacing:2px}
.cal .dn{text-align:center;font-size:250px;font-weight:900;color:#2b2b3a;line-height:1;margin-top:40px}
.cal .why{text-align:center;font-size:52px;font-weight:900;color:#777;margin-top:34px;white-space:nowrap}
.cal .why b{color:#e2552d}
.stampR{position:absolute;left:50%;top:210px;transform:translateX(-50%) rotate(-14deg);border:14px solid #e23b3b;color:#e23b3b;font-size:130px;font-weight:900;padding:0 40px;border-radius:28px;white-space:nowrap;background:rgba(255,255,255,.4)}
.pill{position:absolute;left:50%;transform:translateX(-50%);background:#ff8fb3;color:#fff;font-weight:900;font-size:52px;padding:10px 34px;border-radius:999px;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.18)}
.toast{position:absolute;left:110px;right:110px;background:rgba(255,255,255,.95);border-radius:30px;padding:18px 28px;display:flex;align-items:center;gap:20px;font-size:40px;font-weight:800;color:#333;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.toast i{font-style:normal;width:64px;height:64px;border-radius:18px;background:#9df2c8;display:flex;align-items:center;justify-content:center;font-size:40px;color:#1d5a41;flex:none}
.call{position:absolute;left:150px;top:150px;width:780px;height:1060px;border-radius:80px;background:#1b1b22;padding:22px;box-sizing:border-box;box-shadow:0 30px 70px rgba(60,40,90,.35)}
.call .screen{position:relative;width:100%;height:100%;border-radius:60px;background:linear-gradient(#7f73c9,#3d3768);overflow:hidden;color:#fff;text-align:center}
.call .nm{margin-top:150px;font-size:70px;font-weight:900}
.call .tm2{margin-top:20px;font-size:40px;opacity:.85}
.call .ava{width:260px;height:260px;border-radius:50%;background:#e4e0ff;margin:70px auto 0;display:flex;align-items:center;justify-content:center;font-size:120px;color:#5b5199;font-weight:900}
.call .btn{position:absolute;bottom:120px;left:50%;transform:translateX(-50%);width:150px;height:150px;border-radius:50%;background:#ff4d4d;display:flex;align-items:center;justify-content:center;font-size:50px;font-weight:900}
.side{position:absolute;left:50%;top:345px;transform:translateX(-50%);font-weight:900;font-size:56px;padding:10px 38px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.2)}
.side.a{background:#7f9b5a;color:#fff}.side.e{background:#7c74b8;color:#fff}
.note{position:absolute;left:50%;top:1080px;transform:translateX(-50%);background:#2b2b3a;color:#fff;font-weight:900;font-size:56px;padding:12px 40px;border-radius:24px;white-space:nowrap}
`;document.head.appendChild(st)}
const _w=new THREE.Vector3();
function sideBadge(la='아군',le='적군'){const a=div('side a',la),e=div('side e',le);a.style.opacity=0;e.style.opacity=0;return (t,which,t0)=>{a.style.opacity=which==='a'?1:0;e.style.opacity=which==='e'?1:0;const el=which==='a'?a:e;if(which)el.style.transform=`translateX(-50%) scale(${pop((t-t0)/0.25)})`}}

// ===== 0. 선전포고 → 0.3초 만에 "좋다!! 내일 보자!!" (타이틀) =====
S[0]=()=>{
  setSky('#93b2d6','#e3ebf3 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde6ef,30,95);addLights(scene,{hemi:1.45});
  const r=rng(41);field(scene,r,{mz:-3.4});
  const allies=[],foes=[];
  for(let row=0;row<4;row++)for(let c=0;c<9;c++){const p=soldier(r,ALLY);p.position.set((c-4)*1.2+(row%2)*0.3,0,1.4+row*1.4);p.rotation.y=Math.PI;scene.add(p);allies.push({p,row,c,ph:r()})}
  for(let row=0;row<4;row++)for(let c=0;c<9;c++){const p=soldier(r,FOE);p.position.set((c-4)*1.2+(row%2)*0.3,0,-8.2-row*1.4);scene.add(p);foes.push({p,row,c,ph:r()})}
  const podA=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.45,1.1),lamb(0x8a6a48));podA.position.set(0,0.225,-0.3);scene.add(podA);
  const podE=podA.clone();podE.position.set(0,0.225,-6.6);scene.add(podE);
  const AG=general(r,GEN);AG.position.set(0,0.45,-0.3);AG.rotation.y=Math.PI;scene.add(AG);
  const EG=general(r,ENEMYG);EG.position.set(0,0.45,-6.6);scene.add(EG);
  const fA=flag(scene,-6,0.6,0x7f9b5a),fE=flag(scene,6,-7.2,0x9a8fd0);
  const bE=bubE(EG,'전쟁을 선포한다!!',{y:2.4,size:0.0026}),bA=bubA(AG,'좋다!! 내일 보자!!',{y:2.4,size:0.002});
  const cheers=[[0,2],[0,6],[1,4],[2,1],[2,7]].map(([row,c],i)=>{const q=allies.find(a=>a.row===row&&a.c===c);return {b:bubA(q.p,i%2?'우와아!!':'가자!!',{y:2.25,size:0.0024}),d:i*0.07}});
  const C=cam(50);const E=EV(0);const TE=E.decl,TG=E.reply,TC=E.cheer;
  const ch=chip('전군 사기 100%');
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ISFP × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ISFP인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  const flash=div('flash');const SB=sideBadge('아군 장군','적군 장군');
  return t=>{
    const ck=ease((t-TC)/0.3);
    [...allies,...foes].forEach(q=>{standPose(q.p);setFace(q.p,false);if(t>TC+q.ph*0.15){holdRifleUp(q.p,ease((t-TC-q.ph*0.15)/0.25));q.p.userData.hip.position.y=0.8+Math.abs(Math.sin((t-TC)*7+q.ph*6))*0.12*ck}});
    standPose(EG);standPose(AG);setFace(EG,false);setFace(AG,false);
    megaOn(EG,t>TE-0.3&&t<TG?ease((t-TE+0.3)/0.2):0);
    megaOn(AG,t>TG-0.18&&t<TC+0.3?ease((t-TG+0.18)/0.12):0);
    if(t>TC){holdRifleUp(AG,ck);holdRifleUp(EG,ck)}
    waveFlag(fA,t);waveFlag(fE,t+1);
    show(bE,t,TE+0.05,TG-0.05);show(bA,t,TG,TC+0.2);cheers.forEach(c=>show(c.b,t,TC+0.15+c.d,99));
    if(t<TE-0.1){const k=t/(TE-0.1);C.fov=46;C.updateProjectionMatrix();C.position.set(-4.6+k*5,2.25,-1.6);C.lookAt(-3.8+k*5,1.95,3.4)}
    else if(t<TG-0.1){const k=ease((t-TE)/2);C.fov=32-k*3;C.updateProjectionMatrix();C.position.set(0.9,2.7,0.9);C.lookAt(0,2.85,-6.6)}
    else if(t<TC){const k=ease((t-TG)/1.6);C.fov=34-k*4;C.updateProjectionMatrix();C.position.set(-0.6,2.6,-4.6);C.lookAt(0,2.85,-0.3)}
    else{const k=ease((t-TC)/3.4);C.fov=50;C.updateProjectionMatrix();C.position.set(1.5-k*1.5,6.5+k*1.5,13+k*1.5);C.lookAt(0,2.2,-4)}
    if(t>=TE-0.1&&t<TG-0.1)SB(t,'e',TE-0.1);else if(t>=TG-0.1&&t<TC)SB(t,'a',TG-0.1);else SB(t,null);
    flash.style.background=t>TG&&t<TG+0.12?'rgba(255,255,255,.35)':'transparent';
    chipPop(ch,t,TC+0.2);ch.style.opacity=t>TC+0.2?1:0;
    const T0=0.05,out=clamp01((t-TE+0.15)/0.25),os=1-out;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.65)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.65)/0.1)*os;
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 다음 날 아침: 군복 한쪽 소매에서 멈춤 → 단톡 썼다 지웠다 =====
S[1]=()=>{
  setSky('#ffe3c4','#fff6ea 70%');
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sun:0xfff1d8});
  const r=rng(52);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,14),lamb(0xd8c3a5));floor.rotation.x=-Math.PI/2;scene.add(floor);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(14,6,0.2),lamb(0xf2e6d8));wall.position.set(0,3,-2.6);scene.add(wall);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),basic(0xbfe3ff));win.position.set(-2.2,2.6,-2.49);scene.add(win);
  const wf=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.1,0.1),lamb(0xffffff));wf.position.set(-2.2,2.6,-2.45);scene.add(wf);const wf2=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.7,0.1),lamb(0xffffff));wf2.position.set(-2.2,2.6,-2.45);scene.add(wf2);
  const bed=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.55,3.0),lamb(0x9fb3d6));bed.position.set(2.4,0.28,-0.9);scene.add(bed);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.22,0.6),lamb(0xffffff));pil.position.set(2.4,0.66,-2.0);scene.add(pil);
  const ns=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.6),lamb(0xb08a62));ns.position.set(1.0,0.35,-2.1);scene.add(ns);
  const clk=new THREE.Group();const cb=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.12,20),smooth(0xff8f8f));cb.rotation.x=Math.PI/2;clk.add(cb);
  const face=new THREE.Mesh(new THREE.CircleGeometry(0.16,20),new THREE.MeshBasicMaterial({map:canvasTex(128,128,(x,w,h)=>{x.fillStyle='#fff';x.beginPath();x.arc(64,64,62,0,Math.PI*2);x.fill();x.fillStyle='#333';x.font='900 34px sans-serif';x.textAlign='center';x.fillText('7:00',64,76)})}));face.position.z=0.065;clk.add(face);
  clk.position.set(1.0,0.92,-1.95);scene.add(clk);
  const hang=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.8,0.05),lamb(0x8a6a48));hang.position.set(-4.1,0.9,-1.6);scene.add(hang);
  const VAR=window.VAR||'B';
  const stripe=(a,b)=>{const t=canvasTex(64,64,(x,w,h)=>{x.fillStyle=a;x.fillRect(0,0,w,h);x.fillStyle=b;for(let i=0;i<4;i++)x.fillRect(i*16,0,8,h)});t.wrapS=t.wrapT=THREE.RepeatWrapping;return new THREE.MeshLambertMaterial({map:t})};
  const PJ=stripe('#cfe3ff','#ffffff');
  const S1=makePerson(r,{shirt:0xbcd7f0,pants:0x9fb3d6});addFace(S1);S1.position.set(-0.2,0,-0.6);scene.add(S1);
  const U=S1.userData;
  const paint=(g,m)=>g.traverse(o=>{if(o.isMesh&&o.geometry.type==='BoxGeometry'&&o.material!==lamb(0x2b2b30)&&o.material.color&&o.material.color.getHex()!==0x1a1a1a)o.material=m});
  const pjTop=()=>{U.hip.children[0].material=PJ;U.arms.forEach(a=>a.children[0].material=PJ)};
  const pjBot=()=>{U.legs.forEach(l=>l.children[0].material=PJ)};
  const G=lamb(ALLY.shirt),GP=lamb(ALLY.pants||0x55603a);
  if(VAR==='A'){ // 재킷 한쪽 팔만 + 나머지 반쪽은 등 뒤로 축 늘어짐
    pjTop();pjBot();
    const sl=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.62,0.22),G);sl.position.y=-0.27;U.arms[0].add(sl);
    const jk=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.7,0.37),G);jk.position.set(-0.13,0.32,0);U.hip.add(jk);
    const pk=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.1,0.02),lamb(0x3f5130));pk.position.set(-0.16,0.42,0.19);U.hip.add(pk);
    const flap=new THREE.Group();flap.position.set(0.02,0.62,-0.2);U.hip.add(flap);
    const fb=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.75,0.05),G);fb.position.set(0.14,-0.37,-0.02);flap.add(fb);
    const fsl=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.6,0.17),G);fsl.position.set(0.3,-0.95,-0.05);fsl.rotation.z=0.15;flap.add(fsl);
    flap.rotation.z=-0.55;flap.rotation.x=0.15;U.flap=flap;
  }else if(VAR==='B'){ // 위는 군복+철모 풀장착, 아래는 줄무늬 잠옷 + 분홍 토끼 슬리퍼
    U.hip.children[0].material=G;U.arms.forEach(a=>a.children[0].material=G);pjBot();
    const hm=new THREE.Mesh(new THREE.SphereGeometry(0.29,40,20,0,Math.PI*2,0,Math.PI*0.5),smooth(ALLY.helm));hm.position.y=0.27;U.head.add(hm);U.head.children[1].visible=false;
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.33,0.035,40),smooth(ALLY.helm));rim.position.y=0.27;U.head.add(rim);
    const belt=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.07,0.34),lamb(0x3b2f22));belt.position.y=0.02;U.hip.add(belt);
    U.legs.forEach(l=>{l.children[1].visible=false;const sp=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.14,0.4),smooth(0xffb3c9));sp.position.set(0,-0.77,0.06);l.add(sp);
      for(const e of[-1,1]){const ear=new THREE.Mesh(new THREE.CapsuleGeometry(0.028,0.07,6,12),smooth(0xffc2d4));ear.position.set(e*0.06,-0.63,0.19);ear.rotation.x=-0.5;ear.rotation.z=e*0.25;l.add(ear)}
      const ey=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.03,0.01),basic(0x1a1a1a));ey.position.set(0,-0.72,0.27);l.add(ey)});
  }else{ // 군복 바지 한쪽 다리만 넣고 외발로 멈춤, 빈 바짓가랑이 축
    pjTop();pjBot();
    U.legs[0].children[0].material=GP;
    const empty=new THREE.Mesh(new THREE.BoxGeometry(0.21,0.78,0.08),GP);empty.position.set(0.16,-0.36,0.15);empty.rotation.x=-0.25;empty.rotation.z=0.12;U.hip.add(empty);
    const wb=new THREE.Mesh(new THREE.BoxGeometry(0.56,0.1,0.36),GP);wb.position.y=0.03;U.hip.add(wb);
    U.oneLeg=1;
  }
  const bT=bubT(S1,'…꼭 오늘 해야 되나',{y:2.25,size:0.0028});
  const E=EV(1);const C=cam(46);const ch=chip('전군 사기 100%');
  const P=kphone('전군 작전방','3,000');P.el.style.display='none';
  kmsg(P,'장군','내일 아침, 국경에서 보자!!',{av:'#56703f',ini:'장',tm:'어제'}).style.display='flex';
  kmsg(P,'병사 1,203','넵!!',{av:'#7f9b5a',tm:'어제'}).style.display='flex';
  kmsg(P,'병사 77','가즈아!!',{av:'#7f9b5a',tm:'어제'}).style.display='flex';
  P.msgs.querySelectorAll('.row').forEach(x=>x.style.display='flex');
  const TT=E.type,S1T=at(1,'s1');
  return t=>{
    standPose(S1);const fz=t>E.freeze;setFace(S1,!fz);
    const sag=ease((t-E.freeze-0.3)/0.8);S1.userData.hip.position.y=0.8-0.04*sag;S1.userData.head.rotation.x=0.22*sag;S1.userData.head.rotation.y=-0.35*ease((t-S1T)/0.6);
    if(!fz){S1.userData.arms[1].rotation.x=-0.6*Math.sin(t*6)}else S1.userData.arms[1].rotation.x=-0.25;
    S1.userData.arms[0].rotation.z=0.25;
    if(U.oneLeg){U.legs[1].rotation.x=-1.0;U.legs[1].children[0].rotation.x=0;U.arms[0].rotation.x=-0.5;U.arms[1].rotation.x=-0.5;U.arms[0].rotation.z=0.4;U.arms[1].rotation.z=-0.4}
    if(U.flap)U.flap.rotation.z=-0.55+Math.sin(t*2)*0.03;
    const ring=t>E.alarm&&t<E.alarm+1.6;clk.rotation.z=ring?Math.sin(t*60)*0.12:0;
    show(bT,t,S1T,TT);
    const mor=t<E.freeze?100:Math.max(2,Math.round(100-98*ease((t-E.freeze)/1.9)));ch.textContent=`전군 사기 ${mor}%`;chipPop(ch,t,0.15);ch.style.color=mor<50?'#e2552d':'#333';
    const k=ease(t/8);C.position.set(0.6-k*0.5,2.0,3.8-k*0.8);C.lookAt(-0.2,1.55,-0.6);
    // 단톡 입력창: 썼다 지웠다
    if(t>TT){P.el.style.display='block';P.el.style.transform=`translateY(${(1-ease((t-TT)/0.35))*900}px)`;
      const s='혹시 오늘…';const lt=(t-TT-0.35);const cyc=2.1;const ph=((lt%cyc)+cyc)%cyc;let n=0;
      if(lt>0){if(ph<0.9)n=Math.floor(ph/0.9*s.length+0.5);else if(ph<1.4)n=s.length;else n=Math.max(0,Math.round(s.length*(1-(ph-1.4)/0.5)))}
      P.box.innerHTML=s.slice(0,n)+(Math.floor(t*3)%2?'<span style="color:#999">|</span>':'');
    }
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 적장 카톡 "컨디션 괜찮으세요?" → "그럼 다음에 할까요?!" → 전원 귀가 =====
S[2]=()=>{
  setSky('#bfe0f5','#f2f8fc 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2eef7,30,100);addLights(scene,{hemi:1.5});
  const r=rng(63);field(scene,r,{mz:0});
  const runners=[];
  for(let row=0;row<3;row++)for(let c=0;c<8;c++){const p=soldier(r,ALLY);p.position.set((c-3.5)*1.4+r()*0.3,0,2.2+row*1.5);p.rotation.y=Math.PI;scene.add(p);runners.push({p,s:1,ph:r(),z0:p.position.z})}
  for(let row=0;row<3;row++)for(let c=0;c<8;c++){const p=soldier(r,FOE);p.position.set((c-3.5)*1.4+r()*0.3,0,-2.2-row*1.5);scene.add(p);runners.push({p,s:-1,ph:r(),z0:p.position.z})}
  const hb=runners.filter((q,i)=>i%5===0).map((q,i)=>(q.s>0?bubA:bubE)(q.p,i%2?'집 가자~!':'다음에 봐요~!',{y:2.15,size:0.0022}));
  const E=EV(2);const C=cam(50);const ch=chip('전쟁 연기 1회');
  const P=kphone('적장','');
  const m1=kmsg(P,'적장','혹시… 오늘 컨디션 괜찮으세요?',{av:'#6d62ad',ini:'적',tm:'오전 7:01'});
  const m2=kmsg(P,'','사실 저도 좀…',{me:1,tm:'오전 7:01'});
  const m3=kmsg(P,'적장','그럼 다음에 할까요?!',{av:'#6d62ad',ini:'적',tm:'오전 7:02'});
  const m4=kmsg(P,'','그럼 다음에 할까요?!',{me:1,tm:'오전 7:02'});
  const same=div('pill','동시 전송');same.style.top='1050px';same.style.background='#9df2c8';same.style.color='#1d5a41';
  const RUN=E.run;
  return t=>{
    const ph=t<RUN;P.el.style.display=ph?'block':'none';
    if(ph){const sh=t>E.buzz&&t<E.buzz+0.5?Math.sin(t*90)*10:0;P.el.style.transform=`translateX(${sh}px) scale(${0.85+0.15*pop((t-0.05)/0.35)})`;
      showRow(m1,t,E.m1);showRow(m2,t,E.m2);showRow(m3,t,E.both);showRow(m4,t,E.both);
      same.style.opacity=t>E.both+0.2?1:0;same.style.transform=`translateX(-50%) scale(${pop((t-E.both-0.2)/0.3)})`;}
    else same.style.opacity=0;
    runners.forEach(q=>{const lt=t-RUN-q.ph*0.3;standPose(q.p);happy(q.p);
      if(lt>0){if(!q.off){helmOff(q.p);q.off=1}walkPose(q.p,lt*11,0.8);q.p.rotation.y=q.s>0?0:Math.PI;q.p.position.z=q.z0+q.s*lt*2.2;q.p.userData.arms[1].rotation.x=-2.9}
      else if(q.off){}});
    hb.forEach((b,i)=>show(b,t,RUN+0.3+i*0.08,99));
    const k=ease((t-RUN)/3);C.fov=52;C.updateProjectionMatrix();C.position.set(9-k*2,6.5+k*1.5,9+k*2);C.lookAt(0,0.8,0);
    chipPop(ch,t,RUN+0.2);ch.style.opacity=t>RUN+0.2?1:0;
    if(ph){renderer.clear();setSky('#c9dbea','#e6eef5')}else{setSky('#bfe0f5','#f2f8fc 70%');renderer.render(scene,C)}
    caption(2,t);
  };
};

// ===== 3. 달력 '연기' 도장 37번 + 그때마다 환호 =====
S[3]=()=>{
  setSky('#bfe8d6','#f2fbf6 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe6f5ee,20,70);addLights(scene,{hemi:1.5});
  const r=rng(74);ground(scene,0x9cc98a,200);
  const ppl=[];for(let row=0;row<4;row++)for(let c=0;c<11;c++){const p=soldier(r,(c+row)%2?ALLY:FOE);helmOff(p);happy(p);p.position.set((c-5)*1.05+(row%2)*0.4,0,-row*1.2);scene.add(p);ppl.push({p,ph:r()})}
  const hearts=sprinkleHearts(scene,24,r,{x:0,w:11,z:-1.5,dz:3,col:'#ff8fb3',size:0.006});
  const E=EV(3);const ST=E.stampT;const C=cam(50);
  const ch=chip('연기 0회');ch.style.top='170px';
  const cal=div('cal','<div class="mh">11월</div><div class="dn">8</div><div class="why"></div>');
  const stp=div('stampR','연기');cal.appendChild(stp);
  const sat=div('pill','국민 만족도 100%');sat.style.top='980px';
  const MON=['11월','11월','11월','11월','12월','1월','3월','5월','8월'],DAY=[8,9,10,11,2,15,7,21,30];
  const WHY=['비 옴','날이 너무 좋음','어제 사람 만나서 기 빨림','갑자기 일 생김 <b>(없음)</b>','그냥…','오늘 기분 아님','택배 오는 날','머리 감기 귀찮음','다들 바빠 보여서'];
  const CNT=[1,2,3,4,9,16,24,31,37];
  const SAT=at(3,'n5')+LN(3,'n5')[1]*0.42;
  return t=>{
    let i=-1;ST.forEach((x,j)=>{if(t>=x)i=j});
    const j=Math.max(0,i);cal.querySelector('.mh').textContent=MON[j];cal.querySelector('.dn').textContent=DAY[j];cal.querySelector('.why').innerHTML='사유: '+WHY[j];
    const ls=i>=0?ST[i]:99;const k=clamp01((t-ls)/0.12);stp.style.opacity=i>=0?1:0;stp.style.transform=`translateX(-50%) rotate(-14deg) scale(${2.2-1.2*k})`;
    cal.style.transform=`translateY(${i>=0&&t-ls<0.1?8:0}px) scale(${pop(t/0.3)})`;
    ch.textContent=`연기 ${i>=0?CNT[i]:0}회`;chipPop(ch,t,0.05);
    ppl.forEach(q=>{standPose(q.p);const dt=t-ls;const jmp=i>=0&&dt<0.45?Math.sin(clamp01(dt/0.45)*Math.PI):0;q.p.userData.hip.position.y=0.8+jmp*0.3*(0.7+q.ph*0.3);armUp(q.p,1,jmp>0.05?1:0.0);armUp(q.p,0,jmp>0.05?1:0)});
    updHearts(hearts,t,ST[0],2.2,1.6);
    sat.style.opacity=t>SAT?1:0;sat.style.transform=`translateX(-50%) scale(${pop((t-SAT)/0.3)})`;
    C.position.set(0,4.4,9.5);C.lookAt(0,4.9,-2);
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 연기 도장 두 동강 → 진짜 출전 → 포탄에 꽃 → 몽실이 → 못 쏨 =====
S[4]=()=>{
  setSky('#8fa9c8','#dfe6ee 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xd9e1ea,28,90);addLights(scene,{hemi:1.4});
  const r=rng(85);field(scene,r,{mz:0});
  // 도장 테이블 (진지 뒤쪽)
  const tb=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.08,0.9),lamb(0x9a7652));tb.position.set(-8,0.86,12);scene.add(tb);
  for(const sx of[-1,1])for(const sz of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.86,0.07),lamb(0x6b5238));l.position.set(-8+sx*0.7,0.43,12+sz*0.35);scene.add(l)}
  const half=[0,1].map(i=>{const g=new THREE.Group();const hd=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.3,12),lamb(0x6b4a2f));hd.position.set(0,0.15,0);g.add(hd);
    const bs=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.12,0.32),lamb(0xe23b3b));bs.position.set(i?0.08:-0.08,-0.04,0);g.add(bs);scene.add(g);return g});
  const SG=general(r,GEN);SG.position.set(-8,0,12.6);SG.rotation.y=Math.PI;scene.add(SG);
  const bG=bubA(SG,'진짜 간다!!',{y:2.3,size:0.0024});
  // 양쪽 포병 진지
  const AX=[-6,-3,0,3,6];const crew=[];
  for(const side of[1,-1]){const S=side>0?ALLY:FOE;
    AX.forEach((x,i)=>{const cn=cannon(side>0?0x667f48:0x7c74b8);cn.position.set(x,0,side*5.2);cn.rotation.y=side>0?Math.PI:0;scene.add(cn);
      const p=soldier(r,S);const sx=x+(side>0?0.95:-0.95);p.position.set(sx,0,side*5.3);p.rotation.y=side>0?Math.PI+0.55:-0.55;scene.add(p);
      const cr=crate();cr.position.set(sx+(side>0?0.55:-0.55),0,side*4.8);scene.add(cr);
      const sh=shell({name:side>0?(i===2?'몽실이':['콩이','보리','뭉치','두부','몽실이'][i]):(i===2?'초코':['구름','망고','쿠키','호떡','초코'][i]),pal:i%2?['#8fd0ff','#ff8fb3','#ffd84d','#9df2c8']:undefined,rib:i%2?'#5aa0ff':'#ff5a8a',style:side>0?'a':'b',col:side>0?0x8a8f6a:0x8a6a52});
      sh.position.set(sx+(side>0?0.55:-0.55),0.6,side*4.8);sh.rotation.y=side>0?Math.PI:0;scene.add(sh);shellSet(sh,0);
      crew.push({p,sh,side,i,home:sh.position.clone(),pen:null})})}
  // 뒤쪽 행진 병력
  const march=[];for(const side of[1,-1])for(let row=0;row<3;row++)for(let c=0;c<10;c++){const p=soldier(r,side>0?ALLY:FOE);p.position.set((c-4.5)*1.3,0,side*(8+row*1.4));p.rotation.y=side>0?Math.PI:0;scene.add(p);march.push({p,side,z0:p.position.z})}
  const MS=crew.find(q=>q.side>0&&q.i===2),ES=crew.find(q=>q.side<0&&q.i===2);
  const pn=pen();MS.p.userData.arms[1].add(pn);pn.position.set(0,-0.7,0.02);
  const bM=bubA(MS.p,'못 보내요…',{y:2.0,size:0.0021}),bF=bubE(ES.p,'초코는 안 돼요…',{y:2.0,size:0.0018});
  const bL=bubA(crew.find(q=>q.side>0&&q.i===1).p,'장전!!',{y:2.3,size:0.003});
  const E=EV(4);const C=cam(46);
  const ch=chip('연기 금지령 발동');const ch2=chip('이름 붙은 포탄 0발 · 발사 0발');
  const TA=E.march,TD=E.draw,S2=at(4,'s2'),S3=at(4,'s3'),TN=E.name,TL=E.load,TH=E.hug,TF=E.foe,N7=at(4,'n7');
  const SB=sideBadge('아군 병사','적군 병사'),SBG=sideBadge('아군 장군','적군 장군');const tears=[MS,ES].map(q=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.045,16,12),new THREE.MeshBasicMaterial({color:0x7fc8ff}));s.scale.y=1.5;q.p.userData.head.add(s);s.visible=false;return s});
  return t=>{
    // A: 도장 두 동강
    const cr=E.crack;
    half.forEach((h,i)=>{if(t<cr){h.position.set(-8,1.25+Math.sin(t*4)*0.02,12.25);h.rotation.set(0,0,0)}else{const k=t-cr;h.position.set(-8+(i?1:-1)*k*1.6,1.25+k*2.2-k*k*4,12.25-k*0.6);h.rotation.z=(i?-1:1)*k*6}});
    standPose(SG);setFace(SG,false);if(t<cr+0.2){SG.userData.arms[0].rotation.x=-1.0;SG.userData.arms[1].rotation.x=-1.0}else{SG.userData.arms[1].rotation.x=-2.8*ease((t-cr-0.2)/0.2)}
    show(bG,t,at(4,'g2'),TA);
    // B: 행진
    march.forEach(q=>{standPose(q.p);setFace(q.p,false);const lt=t-TA;if(lt>0&&lt<3){walkPose(q.p,lt*8,0.5);q.p.position.z=q.z0-q.side*Math.min(lt,3)*0.6}});
    // C: 그림 (주인공 먼저, 나머지는 타임랩스로)
    crew.forEach(q=>{const p=q.p;standPose(p);
      const me=q===MS||q===ES;let k=0;
      if(q===MS)k=clamp01((t-S2-0.1)/(TN-S2+0.6));
      else if(q===ES)k=clamp01((t-S3-0.2)/1.4);
      else k=clamp01((t-S3+0.3-q.i*0.15)/1.6);
      shellSet(q.sh,k);setFace(p,t>S2);
      const drawing=t>TD&&t<TL&&(q===MS?true:t>S3-0.3);
      if(drawing){p.userData.arms[1].rotation.x=-1.25+Math.sin(t*14+q.i)*0.08;p.userData.arms[1].rotation.z=0.25;p.userData.head.rotation.x=0.25}
      // D: 장전 → 끌어안기
      const hk=ease((t-TH-(me?0:0.3+q.i*0.05))/0.3);
      if(t>TH-(me?0:-0.3)&&hk>0){hug(p,hk);p.userData.head.rotation.x=0;if(!q.held&&hk>0.3){p.userData.hip.add(q.sh);q.sh.position.set(0,-0.28,0.32);q.sh.rotation.set(0,0,0);q.held=1}
        p.rotation.y=(q.side>0?Math.PI:0);p.userData.head.rotation.y=Math.sin(t*9)*0.3*(t<N7+0.5?1:0.3);setFace(p,false)}
    });
    pn.visible=t<TH;
    show(bL,t,TL,TL+0.9);show(bM,t,at(4,'s4'),TF);show(bF,t,at(4,'f1'),N7+1.2);
    tears[0].visible=t>at(4,'s4')&&t<TF;tears[1].visible=t>at(4,'f1');tears.forEach(s=>{s.position.set(0.12,0.2-((t*0.9)%1)*0.18,0.25)});
    // 카메라
    if(t<TA){C.fov=42;C.updateProjectionMatrix();C.position.set(-7.2,2.4,9.2);C.lookAt(-8,2.35,12.4)}
    else if(t<TD){const k=ease((t-TA)/3.4);C.fov=50;C.updateProjectionMatrix();C.position.set(2-k*1,3.2+k*2.5,17-k*2);C.lookAt(0,1.6,0)}
    else if(t<S3-0.2){const k=ease((t-TD)/2.5);C.fov=36;C.updateProjectionMatrix();C.position.set(2.6,1.9,2.2-k*0.4);C.lookAt(1.2,1.35,4.9)}
    else if(t<TL){const k=ease((t-S3+0.2)/1.8);C.fov=40+k*8;C.updateProjectionMatrix();C.position.set(2.6+k*2,1.9+k*1.4,2.2+k*-0.6);C.lookAt(1.0,1.2,4.9)}
    else if(t<TF){C.fov=38;C.updateProjectionMatrix();C.position.set(1.2,1.9,2.2);C.lookAt(0.8,1.75,5.3)}
    else if(t<N7+0.2){C.fov=38;C.updateProjectionMatrix();C.position.set(-0.7,1.9,-2.2);C.lookAt(-1.05,1.75,-5.3)}
    else{const k=ease((t-N7-0.2)/2.2);C.fov=52;C.updateProjectionMatrix();C.position.set(1.5,5+k*2.5,15+k*1);C.lookAt(0,1.6,0)}
    if(t<TA){SBG(t,'a',0);SB(t,null)}else{SBG(t,null);if(t<TD)SB(t,null);else if(t<S3-0.2)SB(t,'a',TD);else if(t<TL)SB(t,null);else if(t<TF)SB(t,'a',TL);else if(t<N7+0.2)SB(t,'e',TF);else SB(t,null);}
    chipPop(ch,t,cr+0.1);ch.style.opacity=t>cr+0.1&&t<TD?1:0;
    const nn=t<S3?0:Math.round(1200*ease((t-S3)/(TL-S3)));ch2.textContent=`이름 붙은 포탄 ${fmt(nn)}발 · 발사 0발`;
    chipPop(ch2,t,S3);ch2.style.opacity=t>S3?1:0;
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. "발…!" 노을빛이 얼굴을 비춤 → "…와." → 다 같이 노을 사진 → 명당 찾아 국경선으로 → 적 병사와 같은 자리 → 플리 공유 =====
S[5]=()=>{
  const scene=new THREE.Scene();const fog=new THREE.Fog(0xdde6ef,28,95);scene.fog=fog;
  const hemi=new THREE.HemisphereLight(0xffffff,0x8a8070,1.4);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffffff,1.5);sun.position.set(-10,6,-2);scene.add(sun);
  const r=rng(96);field(scene,r,{mz:0});
  const SUN=new THREE.Mesh(new THREE.CircleGeometry(4,32),basic(0xffc46b));SUN.position.set(-60,8,0);SUN.lookAt(0,1,0);scene.add(SUN);
  const glow=glowSprite('rgba(255,190,110,1)',28);glow.position.set(-58,8,0);scene.add(glow);
  const G=general(r,GEN);G.position.set(4,0,4.2);G.rotation.y=0.75;scene.add(G);
  const bG=bubA(G,'발…!',{y:2.45,size:0.003}),bW=bubA(G,'…와',{y:2.45,size:0.003});
  const wash=div('sunwash');wash.style.cssText='position:absolute;inset:0;pointer-events:none;background:linear-gradient(100deg,rgba(255,170,90,.75),rgba(255,200,120,.25) 45%,rgba(255,200,120,0) 70%);opacity:0';ui.prepend(wash);
  const flashes=[];const phoneM=()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.26,0.03),lamb(0x22222a));const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.13,0.23),basic(0xbfe3ff));sc.position.z=-0.017;sc.rotation.y=Math.PI;m.add(sc);const f=glowSprite('rgba(255,255,255,1)',0.9);f.position.z=0.05;m.add(f);flashes.push({f,ph:Math.random()*10});return m};
  // 걸어 나와 앉는 사람들: 양쪽 진영에서 출발 → 국경선 근처 노을 쪽(-x)을 보고 앉음
  const walkers=[];
  for(let i=0;i<22;i++){const side=i%2?1:-1;const p=soldier(r,side>0?ALLY:FOE);helmOff(p);scene.add(p);
    const tz=(i-10.5)*0.62;if(Math.abs(tz)<1.0)continue;
    const from=new THREE.Vector3(1.5+r()*3.5,0,side*(1.5+r()*2.0));const to=new THREE.Vector3(-1+((i*7)%5)*0.15,0,tz);
    const ph=phoneM();p.userData.arms[1].add(ph);ph.position.set(0,-0.66,0.08);
    walkers.push({p,from,to,d:r()*0.6,ph})}
  const A=soldier(r,ALLY),F=soldier(r,FOE);helmOff(A);helmOff(F);scene.add(A);scene.add(F);
  const pair=[{p:A,from:new THREE.Vector3(3.0,0,3.6),to:new THREE.Vector3(-1.1,0,0.35),side:1},{p:F,from:new THREE.Vector3(2.6,0,-3.6),to:new THREE.Vector3(-1.1,0,-0.35),side:-1}];
  pair.forEach(q=>{const ph=phoneM();q.p.userData.arms[1].add(ph);ph.position.set(0,-0.66,0.08);q.ph=ph});
  // 국경선 명당 표시(작은 바위)
  const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(0.35,0),lamb(0xa59a8a));rock.position.set(-1.6,0.2,0);scene.add(rock);
  earbud(A,-1);const ebF=earbud(F,1);
  const spk=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.42,20),smooth(0x2b2b36));spk.rotation.z=Math.PI/2;spk.position.set(-1.0,0.2,-0.95);scene.add(spk);
  const notes=[];for(let i=0;i<8;i++){const s=textSprite(i%2?'♪':'♫',90,i%3?'#fff3a8':'#ffffff',0.005);scene.add(s);notes.push({s,ph:i/8})}
  const bF=bubE(F,'이 노래 아세요?',{y:1.75,size:0.0015}),bA=bubA(A,'헐 제 최애곡인데',{y:1.75,size:0.0015});
  const bQ=[bubA(A,'…!',{y:1.75,size:0.0018}),bubE(F,'…!',{y:1.75,size:0.0018})];
  const E=EV(5);const C=cam(46);const ch=chip('포탄 0발 · 노을 사진 0장');
  const toasts=[0,1,2].map(i=>{const d=div('toast',`<i>♪</i><div>플레이리스트가 공유됐어요<br><small style="font-size:30px;color:#777">${['적군 병사 412','아군 병사 77','적군 병사 1,029'][i]} · 「노을 감성 모음」</small></div>`);d.style.top=(330+i*150)+'px';return d});
  const SS=E.sunset,TP=E.photo,TW=E.walk,TS=E.sit,TSONG=E.song,TSH=E.share,F2=at(5,'f2'),S5=at(5,'s5');
  const walkTo=(p,from,to,t0,t1,t)=>{const k=clamp01((t-t0)/(t1-t0));p.position.lerpVectors(from,to,ease(k));
    if(k<=0){standPose(p);p.rotation.y=Math.atan2(-1,0)}else if(k<1){walkPose(p,(t-t0)*9,0.5);const dx=to.x-from.x,dz=to.z-from.z;p.rotation.y=Math.atan2(dx,dz)}else{sitPose(p);p.rotation.y=-Math.PI/2}return k};
  return t=>{
    const k=ease((t-SS)/1.4);
    setSky(lerpCol('#93b2d6','#ff9f7a',k),lerpCol('#e3ebf3','#ffe0b0',k)+' 70%');
    fog.color.set(lerpCol('#dde6ef','#ffd2a8',k));hemi.color.set(lerpCol('#ffffff','#ffd9b8',k));sun.color.set(lerpCol('#ffffff','#ffb070',k));sun.intensity=1.5+k*0.8;
    SUN.position.y=8-k*3.5;glow.position.y=SUN.position.y;glow.material.opacity=k;
    // 장군: 발…! → 빛이 얼굴에 확 → 눈부셔서 손으로 가리고 빛 쪽으로 고개 → …와
    standPose(G);const g6=at(5,'g6');const fl=clamp01((t-SS)/0.25);
    wash.style.opacity=t<TP?fl*(t<SS+0.9?1:0.6):0;
    setFace(G,t>SS+0.9);
    if(t<SS)G.userData.arms[1].rotation.x=-2.9*ease((t-g6+0.2)/0.2);
    else{G.userData.arms[1].rotation.x=-2.9*(1-ease((t-SS)/0.5));const sh=t<SS+0.9?ease((t-SS)/0.2):1-ease((t-SS-0.9)/0.4);G.userData.arms[0].rotation.x=-2.5*sh;G.userData.arms[0].rotation.z=-0.6*sh}
    G.userData.head.rotation.y=-1.0*ease((t-SS-0.1)/0.5);G.userData.head.rotation.x=t>SS&&t<SS+0.9?0.12:0;
    show(bG,t,g6,SS+0.05);show(bW,t,SS+0.95,TP+0.3);
    G.visible=t<TP;flashes.forEach(q=>{q.f.visible=t>TP&&t<TW+1.6&&Math.sin(t*9+q.ph*7)>0.93});
    // 다 같이 폰 꺼내 노을 사진 → 명당 찾아 걸어 나옴 → 앉음
    walkers.forEach(q=>{const kk=walkTo(q.p,q.from,q.to,TW+q.d,TW+q.d+1.6,t);setFace(q.p,true);
      const shoot=t>TP&&kk<1;q.ph.visible=shoot;if(shoot&&kk<=0){q.p.rotation.y=-Math.PI/2;q.p.userData.arms[1].rotation.x=-1.5}else if(shoot)q.p.userData.arms[1].rotation.x=-1.2;
      if(kk>=1){q.p.userData.arms.forEach(a=>a.rotation.x=-0.5);q.p.userData.head.rotation.z=t>TSONG?Math.sin(t*2.4+q.to.z)*0.08:0}});
    pair.forEach((q,i)=>{const kk=walkTo(q.p,q.from,q.to,TW+0.2,TS,t);const shoot=t>TP&&kk<1;q.ph.visible=shoot;if(shoot&&kk<=0){q.p.rotation.y=-Math.PI/2;q.p.userData.arms[1].rotation.x=-1.5}else if(shoot)q.p.userData.arms[1].rotation.x=-1.2;
      if(kk>=1){q.p.userData.arms.forEach(a=>a.rotation.x=-0.5);const look=t>TS&&t<TS+0.8?1:0;q.p.userData.head.rotation.y=look*(i?-1:1)*0.9*(i?1:1)*(q.side>0?-1:1)*-1;
        setFace(q.p,!(t>TS&&t<TSONG));q.p.userData.head.rotation.z=t>TSONG+0.6?Math.sin(t*2.4+i)*0.08:0}else setFace(q.p,true)});
    bQ.forEach(b=>show(b,t,TS+0.1,TS+0.8));
    spk.visible=t>TSONG-0.3;
    notes.forEach(q=>{const lt=((t-TSONG)*0.5+q.ph)%1;q.s.visible=t>TSONG;q.s.position.set(-1.0-lt*0.6+Math.sin(q.ph*20)*0.3,0.5+lt*1.6,-0.95+Math.cos(q.ph*20)*0.4);const s=Math.sin(lt*Math.PI);q.s.scale.set(q.s.userData.base[0]*s,q.s.userData.base[1]*s,1)});
    A.children.forEach(()=>{});
    show(bF,t,F2,S5);show(bA,t,S5,TSH+0.4);
    // 카메라
    if(t<TP){C.fov=40;C.updateProjectionMatrix();C.position.set(6.2,2.3,6.2);C.lookAt(4,2.25,4.2)}
    else if(t<TW+0.3){const kk=ease((t-TP)/(TW+0.3-TP));C.fov=55;C.updateProjectionMatrix();C.position.set(-3.6+kk*0.6,2.1,0.2);C.lookAt(3,1.75,0)}
    else if(t<TS+0.9){const kk=ease((t-TW-0.3)/(TS+0.6-TW));C.fov=58;C.updateProjectionMatrix();C.position.set(9.5-kk*3.5,4.2-kk*1.8,0.2);C.lookAt(-1,0.9,0)}
    else if(t<TSH){const kk=ease((t-TS-0.9)/3.5);C.fov=48;C.updateProjectionMatrix();C.position.set(3.2-kk*0.4,1.9,0);C.lookAt(-1.4,1.35,0)}
    else{const kk=ease((t-TSH)/3);C.fov=48;C.updateProjectionMatrix();C.position.set(3.4+kk*3,2.4+kk*2.5,0.3+kk*2);C.lookAt(-2,1.2,0)}
    const ph=t<TP?0:Math.round(3412*ease((t-TP)/1.6));const sh=t<TSH?0:Math.round(3000*ease((t-TSH)/2.4));
    ch.textContent=t<TSH?`포탄 0발 · 노을 사진 ${fmt(ph)}장`:`포탄 0발 · 플리 공유 ${fmt(sh)}건`;chipPop(ch,t,t<TSH?TP:TSH);ch.style.opacity=t>TP&&!(t>TS+0.9&&t<TSH)?1:0;
    toasts.forEach((d,i)=>{const t0=TSH+0.15+i*0.35;d.style.opacity=t>t0?1:0;d.style.transform=`translateY(${(1-ease((t-t0)/0.25))*-60}px)`});
    caption(5,t);{const cap=ui.querySelector('.cap');if(cap)cap.style.visibility=(t>endOf(5,'g6',0.5)&&t<F2-0.05)?'hidden':'visible'}renderer.render(scene,C);
  };
};

// ===== 6. 작전 회의 "네 좋아요~!" → 새벽 5시 취소 톡 3,000개 =====
S[6]=()=>{
  setSky('#d8c6a8','#f3eadb 70%');
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,sun:0xfff0d8});
  const r=rng(107);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),lamb(0xb9a07a));floor.rotation.x=-Math.PI/2;scene.add(floor);
  const tentW=new THREE.Mesh(new THREE.CylinderGeometry(7,7,5,8,1,true),new THREE.MeshLambertMaterial({color:0x8fa36b,side:THREE.BackSide,flatShading:true}));tentW.position.y=2.5;scene.add(tentW);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(5.2,0.1,1.8),lamb(0x9a7652));tb.position.set(0,0.82,0);scene.add(tb);
  const map=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.3),new THREE.MeshLambertMaterial({map:canvasTex(512,256,(x,w,h)=>{x.fillStyle='#e8dcb8';x.fillRect(0,0,w,h);x.strokeStyle='#c0392b';x.lineWidth=8;x.beginPath();x.moveTo(60,200);x.quadraticCurveTo(250,40,450,110);x.stroke();x.fillStyle='#c0392b';x.font='900 40px sans-serif';x.fillText('총공격',300,220)})}));
  map.rotation.x=-Math.PI/2;map.position.set(0,0.88,0);scene.add(map);
  const G=general(r,GEN);G.position.set(0,0,-1.6);scene.add(G);
  const ppl=[];[[-2.0,1.4],[-0.7,1.4],[0.7,1.4],[2.0,1.4],[-2.0,-1.2],[2.0,-1.2]].forEach(([x,z],i)=>{const p=soldier(r,ALLY);sitPose(p);p.position.set(x,0,z);p.rotation.y=z>0?Math.PI:0;scene.add(p);ppl.push(p)});
  const bG=bubA(G,'다들 괜찮죠?',{y:2.45,size:0.0028});
  const ys=ppl.map((p,i)=>bubA(p,'네 좋아요~!',{y:1.85,size:0.0017}));
  const E=EV(6);const C=cam(46);const ch=chip('찬성 100%');
  const P=kphone('전군 작전방','3,000');P.el.style.display='none';
  const sys=document.createElement('div');sys.className='sys';sys.textContent='오전 5:00';P.msgs.appendChild(sys);
  const LINES=['죄송한데 제가 오늘 좀…','저도ㅠ','헉 저도요','배가 갑자기…','고양이가 아파서요ㅠ','저 오늘 비 와서…','죄송해요 다음엔 꼭!!','저도 오늘은…'];
  const rows=[];for(let i=0;i<8;i++)rows.push(kmsg(P,`병사 ${[12,1203,77,415,2048,9,333,1777][i]}`,LINES[i],{av:'#7f9b5a',tm:'오전 5:0'+Math.min(9,i)}));
  const last=kmsg(P,'','죄송한데 저도…',{me:1,tm:'오전 5:09'});
  const cnt=div('pill','참석 0명');cnt.style.top='1080px';cnt.style.background='#e2552d';
  const TD=E.dawn,TF=E.flood,TL=E.last;
  return t=>{
    const ph=t<TD;
    standPose(G);setFace(G,true);G.userData.arms[1].rotation.x=t<at(6,'yes')?-1.4:-0.4;
    ppl.forEach((p,i)=>{sitPose(p);setFace(p,true);if(t>E.yes+i*0.04)armUp(p,1,ease((t-E.yes-i*0.04)/0.2))});
    show(bG,t,at(6,'g7'),E.yes);ys.forEach((b,i)=>show(b,t,i<4?E.yes+i*0.05:99,TD));
    C.fov=50;C.updateProjectionMatrix();const k=ease(t/4);C.position.set(0,4.0,7.6-k*0.6);C.lookAt(0,1.6,-0.6);
    chipPop(ch,t,E.yes+0.2);ch.style.opacity=ph&&t>E.yes+0.2?1:0;
    P.el.style.display=ph?'none':'block';
    if(!ph){P.el.style.transform=`scale(${0.85+0.15*pop((t-TD)/0.3)})`;rows.forEach((row,i)=>showRow(row,t,TF+i*0.13*(1-i/40)));showRow(last,t,TL);
      const n=Math.round(3000*ease((t-TF)/3));P.el.querySelector('.head small').textContent=fmt(Math.max(0,3000-n))+' 참석 예정';
      cnt.style.opacity=t>TL+0.2?1:0;cnt.style.transform=`translateX(-50%) scale(${pop((t-TL-0.2)/0.3)})`}
    else cnt.style.opacity=0;
    if(ph){setSky('#d8c6a8','#f3eadb 70%');renderer.render(scene,C)}else{renderer.clear();setSky('#3b4a6b','#8a9cc0')}
    caption(6,t);
  };
};

// ===== 7. 종전 협상도 연기 84회 → "다음에 봬요!" → 텅 빈 국경 =====
S[7]=()=>{
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf3dcc4,25,90);addLights(scene,{hemi:1.5,sun:0xffe0c0});
  const r=rng(118);field(scene,r,{mz:0,g:0xa9c08a});
  const fA=flag(scene,-4,3,0x7f9b5a,4),fE=flag(scene,4,-3,0x9a8fd0,4);
  const tum=[];for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(0.25,0),lamb(0xc9b48a));scene.add(b);tum.push({b,ph:r()})}
  const E=EV(7);const C=cam(50);
  const P=kphone('적장','');
  const m1=kmsg(P,'적장','이제 그냥 종전할까요? 만나서 서명해요!',{av:'#6d62ad',ini:'적',tm:'오후 2:10'});
  const m2=kmsg(P,'','네 좋아요~ 언제 볼까요?',{me:1,tm:'오후 2:10'});
  const cal=div('cal','<div class="mh">종전 협상</div><div class="dn">D-1</div><div class="why">장소: 국경</div>');cal.style.top='330px';
  const stp=div('stampR','연기');cal.appendChild(stp);
  const ch=chip('종전 협상 연기 0회');
  const call=div('call','<div class="screen"><div class="nm">적장</div><div class="tm2">통화 중 00:07</div><div class="ava">적</div><div class="btn">끊기</div></div>');
  const none=div('note','※ 다음 = 없음');
  const stat=div('statbox','<div><small>전쟁</small><b>3년째</b></div><div><small>사상자</small><b>0명</b></div>');
  const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');
  const ST=E.stampT,TC=E.call,TE=E.empty,TS=E.stat,TEND=endOf(7,'n10',0.3);
  return t=>{
    const phA=t<E.cal,phB=t>=E.cal&&t<TC,phC=t>=TC&&t<TE;
    P.el.style.display=phA?'block':'none';if(phA){P.el.style.transform=`scale(${0.85+0.15*pop(t/0.3)})`;showRow(m1,t,E.m1);showRow(m2,t,E.m2)}
    cal.style.display=phB?'block':'none';
    if(phB){cal.style.transform=`scale(${pop((t-E.cal)/0.3)})`;let i=-1;ST.forEach((x,j)=>{if(t>=x)i=j});const ls=i>=0?ST[i]:99,k=clamp01((t-ls)/0.12);
      stp.style.opacity=i>=0?1:0;stp.style.transform=`translateX(-50%) rotate(-14deg) scale(${2.2-1.2*k})`;cal.querySelector('.dn').textContent=['D-1','D-1','D-1','D-1'][i+1]||'D-1'}
    let n=0;if(t>=ST[0])n=Math.round(1+83*ease((t-ST[0])/(TC-ST[0]-0.1)));ch.textContent=`종전 협상 연기 ${n}회`;chipPop(ch,t,E.cal);ch.style.opacity=(phB||phC)?1:0;
    call.style.display=phC?'block':'none';if(phC){call.style.transform=`scale(${0.85+0.15*pop((t-TC)/0.3)})`;call.querySelector('.tm2').textContent=`통화 중 00:${String(7+Math.floor(t-TC)).padStart(2,'0')}`}
    none.style.opacity=phC&&t>E.none?1:0;none.style.transform=`translateX(-50%) scale(${pop((t-E.none)/0.3)})`;
    waveFlag(fA,t);waveFlag(fE,t+1);
    tum.forEach(q=>{const lt=((t*0.25+q.ph)%1);q.b.position.set(-12+lt*24,0.25+Math.abs(Math.sin(lt*30))*0.2,(q.ph-0.5)*4);q.b.rotation.z=-lt*20});
    const k=ease((t-TE)/6);C.fov=50;C.updateProjectionMatrix();C.position.set(1,2.6+k*3,11+k*3);C.lookAt(0,1.6,0);
    stat.style.opacity=t>TS&&t<TEND?1:0;stat.style.transform=`translateX(-50%) scale(${pop((t-TS)/0.3)})`;
    e1.style.opacity=t>TEND?1:0;e2.style.opacity=t>TEND+0.2?1:0;popEl(e1,t,TEND);popEl(e2,t,TEND+0.2);
    if(t<TE){renderer.clear();setSky('#f6d6c4','#fff1e6')}else{setSky('#ffb38a','#ffe6c8 70%');renderer.render(scene,C)}
    caption(7,t);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
