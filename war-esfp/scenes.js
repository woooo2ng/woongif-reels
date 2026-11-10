// ---------- ESFP 전쟁편 공용 ----------
const S=[];
function addFace(p){const h=p.userData.head;
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.013,4,10,Math.PI),basic(0x5a2a2a));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.016,0.01),basic(0x5a2a2a));fl.position.set(0,0.145,0.248);h.add(fl);
  p.userData.smile=sm;p.userData.flat=fl;setFace(p,false);return p}
function setFace(p,smile){p.userData.smile.visible=smile;p.userData.flat.visible=!smile}
const ALLY={shirt:0x7f9b5a,pants:0x55663f,helm:0x667f48};
const FOE={shirt:0x9a8fd0,pants:0x5e5896,helm:0x7c74b8};
const TOUR=[0xf28b8b,0xf2c46b,0x8bd1f2,0xb58bf2,0x8bf2b0,0xf29bd8];
function soldier(r,side,o={}){const p=addFace(makePerson(r,{shirt:side.shirt,pants:side.pants}));
  const h=p.userData.head;h.children[1].visible=false;
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.29,12,8,0,Math.PI*2,0,Math.PI*0.5),lamb(side.helm));hm.position.y=0.27;h.add(hm);
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.33,0.035,14),lamb(side.helm));rim.position.y=0.28;h.add(rim);
  return p}
function general(r,o){const p=addFace(makePerson(r,{shirt:o.shirt,pants:o.pants}));const h=p.userData.head;
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.27,0.26,0.16,14),lamb(o.cap));cap.position.y=0.44;h.add(cap);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.31,0.27,0.07,14),lamb(o.cap));top.position.y=0.54;h.add(top);
  const brim=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.03,0.2),lamb(0x222222));brim.position.set(0,0.37,0.24);h.add(brim);
  const badge=new THREE.Mesh(new THREE.CircleGeometry(0.06,5),basic(0xffd84d));badge.position.set(0,0.46,0.27);h.add(badge);
  for(const s of[-1,1]){const ep=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.05,0.22),lamb(0xe8c050));ep.position.set(s*0.3,0.66,0);p.userData.hip.add(ep)}
  const md=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.1,0.02),lamb(0xe8c050));md.position.set(-0.13,0.45,0.17);p.userData.hip.add(md);
  p.scale.setScalar(1.15);return p}
const GEN={shirt:0x56703f,pants:0x3e4f2e,cap:0x4a6136};
const ENEMYG={shirt:0x6d62ad,pants:0x463f7d,cap:0x5b5199};
function tourist(r){const p=addFace(makePerson(r,{shirt:pick(r,TOUR)}));setFace(p,true);return p}
function phoneMesh(col=0xbfe3ff){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.3,0.03),lamb(0x24242c));g.add(b);
  const s=new THREE.Mesh(new THREE.PlaneGeometry(0.14,0.26),basic(col));s.position.z=-0.017;s.rotation.y=Math.PI;g.add(s);
  const rec=new THREE.Mesh(new THREE.CircleGeometry(0.02,10),basic(0xff3a3a));rec.position.set(-0.045,0.1,-0.019);rec.rotation.y=Math.PI;g.add(rec);
  g.userData.rec=rec;return g}
// 한 손으로 폰을 들어 앞을 찍는 자세(폰 화면이 본인 쪽)
function phoneUp(p,side=1,k=1,ph=null){const a=p.userData.arms[side];a.rotation.x=-2.25*k;a.rotation.z=(side?0.35:-0.35)*k;
  if(!p.userData.phone){const ph=phoneMesh();p.userData.hip.add(ph);p.userData.phone=ph}
  const P=p.userData.phone;P.visible=k>0.05;P.position.set((side?1:-1)*0.2,0.6+0.48*k,0.15+0.36*k);P.rotation.x=-0.15;}
function rifle(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.1,0.85),lamb(0x3a3530));g.add(b);
  const st=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.17,0.26),lamb(0x6b4a2f));st.position.set(0,-0.05,-0.36);g.add(st);
  const mz=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.2),lamb(0x222222));mz.position.z=0.5;g.add(mz);return g}
function aim(p){const u=p.userData;u.arms[0].rotation.x=-1.45;u.arms[0].rotation.z=0.35;u.arms[1].rotation.x=-1.5;u.arms[1].rotation.z=-0.1;
  if(!u.rifle){const R=rifle();u.hip.add(R);u.rifle=R}u.rifle.visible=true;u.rifle.position.set(0.12,0.62,0.45)}
function noRifle(p){if(p.userData.rifle)p.userData.rifle.visible=false}
function vSign(p,side=1,k=1){const a=p.userData.arms[side];a.rotation.x=-2.7*k;a.rotation.z=(side?0.5:-0.5)*k}
function lPose(p,t,k=1,hop=true){// L을 가져가: 한 손 L 이마, 한 손 배, 옆으로 뛰기
  const u=p.userData;u.arms[1].rotation.x=-2.75*k;u.arms[1].rotation.z=1.15*k;
  u.arms[0].rotation.x=-0.9*k;u.arms[0].rotation.z=0.9*k;
  if(!u.L){const L=textSprite('L',90,'#c8ff4d',0.0045);u.head.add(L);u.L=L;L.position.set(0.02,0.55,0.32)}u.L.visible=k>0.5;
  if(hop){const s=Math.sin(t*Math.PI*2*1.6);u.legs[0].rotation.z=-0.45*Math.max(0,s)*k;u.legs[1].rotation.z=0.45*Math.max(0,-s)*k;u.hip.position.y=0.8+Math.abs(s)*0.12*k;u.hip.position.x=s*0.12*k}
}
function resetLegs(p){const u=p.userData;u.legs.forEach(l=>{l.rotation.z=0;l.rotation.x=0});u.hip.position.x=0;u.hip.position.y=0.8;if(u.L)u.L.visible=false}
function sandbags(scene,x,z,w,rows=3,col=0xc9b48a){const g=new THREE.Group();const n=Math.round(w/0.62);
  for(let j=0;j<rows;j++)for(let i=0;i<n;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.28,0.42),lamb(j%2?col:0xbfa97e));b.position.set(-w/2+0.31+i*0.62+(j%2)*0.3,0.14+j*0.27,0);b.rotation.y=(i*7+j)%3*0.04-0.04;g.add(b)}
  g.position.set(x,0,z);scene.add(g);return g}
function flag(scene,x,z,col,h=4.5,w=1.6){const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,h,6),lamb(0xdddddd));pole.position.y=h/2;g.add(pole);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(w,w*0.62,6,1),new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide,flatShading:true}));f.position.set(w/2,h-w*0.35,0);g.add(f);g.userData.f=f;
  const ball=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6),lamb(0xe8c050));ball.position.y=h;g.add(ball);g.position.set(x,0,z);scene.add(g);return g}
function waveFlag(fl,t){const pos=fl.userData.f.geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setZ(i,Math.sin(t*4+x*3)*0.12*(x+0.8))}pos.needsUpdate=true}
function ground(scene,col,size=200){const g=new THREE.Mesh(new THREE.PlaneGeometry(size,size),lamb(col));g.rotation.x=-Math.PI/2;scene.add(g);return g}
function fence(scene,z,w=40){const g=new THREE.Group();for(let x=-w/2;x<=w/2;x+=2.2){const p=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.3,0.1),lamb(0x6b5a48));p.position.set(x,0.65,0);g.add(p)}
  for(const y of[0.45,0.8,1.15]){const l=new THREE.Mesh(new THREE.BoxGeometry(w,0.025,0.025),lamb(0x8a8a8a));l.position.set(0,y,0);g.add(l)}g.position.z=z;scene.add(g);return g}
function tent(scene,x,z,col,s=1){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.ConeGeometry(2.2,2.6,4),lamb(col));c.rotation.y=Math.PI/4;c.position.y=1.3;g.add(c);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(0.9,1.3),basic(0x2a2a30));door.position.set(0,0.65,1.12);door.rotation.x=-0.36;g.add(door);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g}
function tank(col){const g=new THREE.Group();const tr=lamb(0x3a3a3a);
  for(const s of[-1,1]){const t=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,4.2),tr);t.position.set(s*1.25,0.35,0);g.add(t)}
  const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.8,3.8),lamb(col));b.position.y=1.0;g.add(b);
  const tu=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.6,1.8),lamb(col));tu.position.set(0,1.7,-0.3);g.add(tu);
  const br=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,2.4,8),lamb(0x55663f));br.rotation.x=Math.PI/2;br.position.set(0,1.75,1.6);g.add(br);return g}
function popEl(el,t,t0,base=''){const k=pop((t-t0)/0.3);el.style.transform=`${base} scale(${k})`;el.style.opacity=clamp01((t-t0)/0.08)}
function div(cls,html,parent=ui){const d=document.createElement('div');d.className=cls;if(html!=null)d.innerHTML=html;parent.appendChild(d);return d}
function bub(p,text,o={}){const b=makeBubble(text,{bg:o.bg||'#f2ffd0',fg:o.fg||'#2b3a10',fs:o.fs||64,size:o.size});b.position.y=o.y??2.35;p.add(b);scaleBubble(b,0);return b}
function cam(fov=50,asp=W/H){return new THREE.PerspectiveCamera(fov,asp,0.1,400)}
const fmt=n=>Math.round(n).toLocaleString('en-US');

// ===== 0. 출정식 (타이틀) =====
function paradeGround(scene,r,o={}){
  ground(scene,0xc9b78e);
  const pod=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.0,1.6),lamb(0x8a6a4a));pod.position.set(0,0.5,-6);scene.add(pod);
  const st=new THREE.Mesh(new THREE.BoxGeometry(2.8,0.08,1.8),lamb(0xb02f3a));st.position.set(0,1.04,-6);scene.add(st);
  const fl=[flag(scene,-2.6,-7.2,0x6f8f48,5.2),flag(scene,1.6,-7.2,0x6f8f48,5.2)];
  const ban=labelSprite('출정식',{fs:80,bg:'#6f8f48',fg:'#fff',size:0.006});ban.position.set(0,4.6,-7.4);scene.add(ban);
  for(let i=0;i<14;i++){const x=(i-6.5)*3.2;const b=makeBuilding(r,2.6,4+r()*4,2.6,{wall:'#cdbb9a'});b.position.x=x;b.position.z=-22-r()*4;scene.add(b)}
  const g=general(r,GEN);g.position.set(0,1.08,-6);scene.add(g);
  const troops=[];
  for(let row=0;row<7;row++)for(let c=0;c<7;c++){const p=soldier(r,ALLY);p.position.set((c-3)*1.15+(row%2)*0.1,0,-0.6+row*1.35);p.rotation.y=Math.PI;scene.add(p);troops.push({p,row,c,ph:r()})}
  return {g,fl,troops};
}
S[0]=()=>{
  bgEl.style.background='linear-gradient(#e9935a,#f7c98f 45%,#fde6c4)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf3d2a8,25,70);addLights(scene,{sun:0xffe2c0,dpos:[-6,10,6]});
  const r=rng(901);const {g,fl,troops}=paradeGround(scene,r);
  const sun=glowSprite('rgba(255,236,190,1)',16);sun.position.set(0,6,-24);scene.add(sun);
  const C=cam(50);
  ui.innerHTML=`<div class="tag">전쟁편</div><div class="title1 out">온 세상이 ESFP인데</div><div class="title2 out" style="color:${C_T}">전쟁이 난다면?</div>`;
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2');
  const tt=vt(2.95);
  return t=>{
    troops.forEach(q=>{phoneUp(q.p,(q.c+q.row)%3?1:0,1);q.p.userData.phone.userData.rec.visible=Math.floor(t*2+q.ph*2)%2==0})
    armUp(g,1,clamp01((t-0.5)/0.4)*0.8);setFace(g,false);waveFlag(fl[0],t);waveFlag(fl[1],t+1);
    const k=ease((t-vt(2.0))/1.6);
    C.position.set(0,3.0+k*2.0,-1.6+k*13.5);C.lookAt(0,2.75-k*0.6,-6);
    tag.style.transform=`translateX(-50%) scale(${pop((t-tt)/0.3)})`;tag.style.opacity=clamp01((t-tt)/0.08);
    t1.style.transform=`scale(${pop((t-tt-0.1)/0.35)})`;t1.style.opacity=clamp01((t-tt-0.1)/0.1);
    t2.style.transform=`scale(${pop((t-tt-0.35)/0.4)})`;t2.style.opacity=clamp01((t-tt-0.35)/0.1);
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. NG =====
S[1]=()=>{
  bgEl.style.background='linear-gradient(#e9935a,#f7c98f 45%,#fde6c4)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf3d2a8,25,70);addLights(scene,{sun:0xffe2c0,dpos:[-6,10,-8]});
  const r=rng(901);const {g,fl,troops}=paradeGround(scene,r);
  const sun=glowSprite('rgba(255,248,215,1)',9);sun.position.set(0.3,3.6,-8.5);scene.add(sun);
  const hero=troops.find(q=>q.row==0&&q.c==4).p;
  const b1=bub(hero,'역광…!',{y:2.3,size:0.005});const bg=bub(g,'…',{y:2.5,bg:'#ffffff'});
  const C=cam(46);const ch=chip('출정식 NG 14번');
  return t=>{
    troops.forEach(q=>{if(q.p!==hero)phoneUp(q.p,(q.c+q.row)%3?1:0,1)});
    phoneUp(hero,1,1);const hk=clamp01((t-vt(0.1))/0.25)*(1-clamp01((t-vt(3.1))/0.3));const a=hero.userData.arms[0];a.rotation.x=-2.9*hk;a.rotation.z=-0.3*hk;
    scaleBubble(b1,0);
    // 장군: 멈칫 -> 머리 넘기기 -> 다시 차렷
    const hair=clamp01((t-vt(2.4))/0.3)*(1-clamp01((t-vt(3.6))/0.3));const sw=Math.sin((t-vt(2.4))*7)*0.25*hair;
    g.userData.arms[1].rotation.x=-2.9*hair+sw;g.userData.arms[1].rotation.z=0.9*hair;armUp(g,0,0);
    g.userData.head.rotation.z=0.12*hair;
    scaleBubble(bg,pop((t-vt(3.24))/0.3));
    waveFlag(fl[0],t);waveFlag(fl[1],t+1);
    chipPop(ch,t,vt(1.85));
    C.position.set(7.4-t*0.12,3.3,3.2);C.lookAt(-0.4,2.3,-5.0);
    caption(1,t);renderer.render(scene,C);
  };
};

// ===== 2. 국경 셀카 → 맞팔 =====
S[2]=()=>{
  bgEl.style.background='linear-gradient(#8ec5ff,#d6ecff 60%,#f1f8ff)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdcecff,30,90);addLights(scene);
  const r=rng(77);ground(scene,0x9cb97a);
  const bord=new THREE.Mesh(new THREE.PlaneGeometry(60,0.25),basic(0xf2f2e8));bord.rotation.x=-Math.PI/2;bord.position.set(0,0.01,-1);scene.add(bord);
  fence(scene,-1);
  sandbags(scene,0,3,12);sandbags(scene,0,-6,12);
  flag(scene,-5.5,5,0x6f8f48);const ff=flag(scene,5.5,-7.5,0x7c74b8);
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r()*2,-14-r()*5,1.2,0x7fb06a);
  const allies=[],foes=[];
  for(let i=0;i<8;i++){const p=soldier(r,ALLY);p.position.set((i-3.5)*1.4,0,3.7);p.rotation.y=Math.PI;scene.add(p);allies.push(p)}
  for(let i=0;i<8;i++){const p=soldier(r,FOE);p.position.set((i-3.5)*1.4+0.3,0,-6.7);scene.add(p);foes.push(p)}
  // 방아쇠 클로즈업 세트
  const IN=(()=>{const g=new THREE.Group();g.position.x=300;scene.add(g);const M=lamb(0x34302c),Wd=lamb(0x7a5434),SK=lamb(0xebb995),SL=lamb(0x7f9b5a);
    const bd=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.42,0.3),M);bd.position.set(0.2,1.55,0);g.add(bd);
    const br=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,2.2,8),M);br.rotation.z=Math.PI/2;br.position.set(2.5,1.62,0);g.add(br);
    const st=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.5,0.28),Wd);st.position.set(-1.6,1.45,0);st.rotation.z=0.12;g.add(st);
    const mg=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.7,0.24),M);mg.position.set(0.55,1.05,0);mg.rotation.z=-0.2;g.add(mg);
    const gp=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.75,0.26),Wd);gp.position.set(-0.55,1.0,0);gp.rotation.z=0.3;g.add(gp);
    const gd=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.035,6,16,Math.PI),M);gd.rotation.z=Math.PI;gd.position.set(-0.08,1.34,0);g.add(gd);
    const tr=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.22,0.06),lamb(0x111111));tr.position.set(-0.08,1.24,0);tr.rotation.z=-0.25;g.add(tr);
    const sl=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.45,0.5),SL);sl.position.set(-1.05,1.05,0.05);sl.rotation.z=0.3;g.add(sl);
    const hd=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.5,0.44),SK);hd.position.set(-0.6,1.05,0.06);hd.rotation.z=0.3;g.add(hd);
    const th=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.3,0.12),SK);th.position.set(-0.5,1.4,0.22);th.rotation.z=-0.6;g.add(th);
    const fp=new THREE.Group();fp.position.set(-0.38,1.28,0.08);g.add(fp);
    const f1=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.1,0.1),SK);f1.position.x=0.14;fp.add(f1);
    const f2p=new THREE.Group();f2p.position.x=0.28;fp.add(f2p);const f2=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.18,0.1),SK);f2.position.set(0.02,-0.08,0);f2p.add(f2);
    const gr=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0x9cb97a));gr.rotation.x=-Math.PI/2;gr.position.y=-0.6;g.add(gr);
    const bk=new THREE.Mesh(new THREE.PlaneGeometry(30,6),lamb(0xc9b48a));bk.position.set(0,1.0,-4);g.add(bk);
    return {fp}})();
  const hero=allies[3];aim(hero);{const R=hero.userData.rifle;const gd=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.008,4,10,Math.PI),lamb(0x222222));gd.rotation.y=Math.PI/2;gd.rotation.z=Math.PI;gd.position.set(0,-0.06,-0.08);R.add(gd);
    const trg=new THREE.Mesh(new THREE.BoxGeometry(0.012,0.05,0.012),lamb(0x111111));trg.position.set(0,-0.075,-0.08);trg.rotation.x=0.3;R.add(trg);
    const hand=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.1,0.12),lamb(0xebb995));hand.position.set(0.0,-0.06,-0.19);R.add(hand);
    const fp=new THREE.Group();fp.position.set(0.0,-0.045,-0.135);R.add(fp);const fg=new THREE.Mesh(new THREE.BoxGeometry(0.028,0.028,0.08),lamb(0xebb995));fg.position.z=0.04;fp.add(fg);const ft=new THREE.Mesh(new THREE.BoxGeometry(0.028,0.045,0.028),lamb(0xebb995));ft.position.set(0,-0.02,0.075);fp.add(ft);
    R.userData.fp=fp;R.userData.trg=trg;R.userData.close=[gd,hand,fp];}const F=foes[4];// 적 병사 7번
  const nm=labelSprite('적 병사 7번',{fs:44,bg:'#7c74b8',fg:'#fff',size:0.006});nm.position.y=2.25;F.add(nm);nm.visible=false;
  const bF=bub(F,'저 나왔죠?',{y:2.9,bg:'#e4e0ff',fg:'#2d2766',size:0.0055});const bH=bub(hero,'아이디 뭐예요?',{y:2.4});
  const C=cam(48);
  const chip1=chip('국경 · 대치 3시간째');const chip2=chip('교전 0분 · 맞팔 300쌍');
  const vig=div('flash');vig.style.background='radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(0,0,0,.65) 100%)';const flash=div('flash');flash.style.opacity=0;
  const photo=div('photo','<canvas width="652" height="766"></canvas><div class="pl">찰칵! 인증샷</div>');photo.style.opacity=0;
  const ring=div('ring','',photo);
  const notif=div('notif','<div class="ic" style="background:#7c74b8">7번</div><div class="tx"><b>적 병사 7번</b>님이<br>회원님을 팔로우합니다</div><div class="bt">맞팔로우</div>');notif.style.opacity=0;
  const hearts=sprinkleHearts(scene,26,r,{x:0,w:12,z:-1.5,dz:6,col:'#ff8fb3'});
  const TF=vt(1.75),TC=vt(0.55);let shot=false;
  function pose(t){
    const sel=t>=TF-0.02;
    allies.forEach((p,i)=>{if(p===hero)return;standPose(p);aim(p)});foes.forEach(p=>{if(p===F)return;standPose(p);aim(p)});
    if(!sel){standPose(hero);aim(hero);hero.rotation.y=Math.PI;{const R=hero.userData.rifle;const k=ease((t-TC-0.2)/(TF-TC-0.25));R.userData.fp.rotation.x=0.75*k+Math.sin(t*40)*0.03*(t>TC?1:0);R.userData.close.forEach(m=>m.visible=false);IN.fp.rotation.z=-0.55*k+Math.sin(t*40)*0.02}standPose(F);aim(F);F.position.y=-0.25;setFace(F,false)}
    else{noRifle(hero);standPose(hero);hero.rotation.y=0;phoneUp(hero,1,1);setFace(hero,true);
      noRifle(F);standPose(F);F.position.y=0;vSign(F,1,1);setFace(F,true)}
    // 대화 이후: 다 같이 폰
    const all=clamp01((t-vt(8.805))/0.4);
    if(all>0){allies.concat(foes).forEach((p,i)=>{if(p===hero||p===F)return;noRifle(p);standPose(p);phoneUp(p,i%2,all);setFace(p,true)})}
    if(t>=vt(3.955)){F.position.y=0.15+Math.abs(Math.sin(t*6))*0.15;F.userData.arms[0].rotation.x=-2.9;F.userData.arms[0].rotation.z=-0.6+Math.sin(t*10)*0.3;phoneUp(F,1,clamp01((t-vt(3.955))/0.3))}
    if(t>=vt(6.105)){hero.rotation.y=Math.PI;phoneUp(hero,1,1)}
  }
  function camAt(t){
    if(t<TC){C.position.set(0,3.4,10.5);C.lookAt(0,1.0,-5)}
    else if(t<TF){const k=ease((t-TC)/(TF-TC));const sh=Math.sin(t*37)*0.006;C.position.set(300-0.25+k*0.15+sh,1.32+sh,2.9-k*1.0);C.lookAt(300-0.15,1.2,0)}
    else if(t<vt(3.705)){C.position.set(-1.2,2.15,7.3);C.lookAt(0.1,1.85,1.5)}
    else if(t<vt(8.805)){const k=ease((t-vt(3.705))/1.2);C.position.set(-1.6,2.6,6.8);C.lookAt(0.6,1.7,-6.7)}
    else{const k=ease((t-vt(8.805))/1.5);C.position.set(-1.6+k*1.2,2.3+k*3.5,6.3+k*5);C.lookAt(0.5,1.0,-2)}
  }
  return t=>{
    if(!shot&&t>=TF){pose(TF);camAt(TF);renderer.render(scene,C);const cv=photo.querySelector('canvas');const cx=cv.getContext('2d');
      // 사진: 화면 가운데를 잘라 사용
      cx.drawImage(renderer.domElement,(W-W*0.95)/2,250,W*0.95,W*0.95*766/652,0,0,652,766);
      const v=F.position.clone();v.y+=1.75;v.project(C);const sx=(v.x+1)/2*W,sy=(1-v.y)/2*H;
      const px=(sx-(W-W*0.95)/2)/(W*0.95)*652,py=(sy-250)/(W*0.95*766/652)*766;
      ring.style.left=(24+px*676/652-70)+'px';ring.style.top=(24+py*766/766-80)+'px';ring.style.width='140px';ring.style.height='150px';shot=true}
    pose(t);camAt(t);waveFlag(ff,t);
    flash.style.opacity=t>=TF?clamp01(1-(t-TF)/0.35):0;vig.style.opacity=t>=TC&&t<TF?1:0;bgEl.style.background=t>=TC&&t<TF?'linear-gradient(#7fb2e8,#cfe4f7)':'linear-gradient(#8ec5ff,#d6ecff 60%,#f1f8ff)';
    const pin=pop((t-(TF+0.1))/0.35),pout=ease((t-vt(3.655))/0.35);
    photo.style.opacity=t<TF+0.1?0:1-clamp01((t-vt(3.705))/0.3);photo.style.transform=`translate(${pout*230}px,${-pout*110}px) rotate(${-4+pout*10}deg) scale(${pin*(1-pout*0.62)})`;
    ring.style.opacity=t>vt(2.605)?(Math.floor(t*4)%2?1:0.6):0;
    scaleBubble(bF,t>vt(2.605)&&t<vt(6.005)?pop((t-vt(2.605))/0.3):0);if(t>=vt(3.955))setBubble(bF,'사진 보내 주세요!',{bg:'#e4e0ff',fg:'#2d2766',fs:64,size:0.0055});
    nm.visible=t>vt(2.605);
    scaleBubble(bH,0);
    notif.style.opacity=t>vt(7.605)&&t<vt(9.005)?1:0;notif.style.transform=`translateY(${(1-ease((t-vt(7.605))/0.3))*-200}px)`;
    notif.querySelector('.bt').textContent=t>vt(8.305)?'맞팔로우 ✔':'맞팔로우';notif.querySelector('.bt').style.background=t>vt(8.305)?'#9aa3b5':'#3b82f6';
    chipPop(chip1,t,0.1);if(t>=TC)chip1.style.opacity=0;
    chipPop(chip2,t,vt(9.005));
    updHearts(hearts,t,vt(9.005),1.6,2.4);
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. 좋아요 전쟁 =====
function drawGroup(ctx,w,h,side,happy){
  ctx.fillStyle=side===FOE?'#ffe3f2':'#e6efd9';ctx.fillRect(0,0,w,h);
  ctx.fillStyle=side===FOE?'#ffd1e8':'#d5e3c2';ctx.fillRect(0,h*0.72,w,h);
  const n=6;for(let i=0;i<n;i++){const x=w*(i+0.5)/n,y=h*0.55+(i%2)*14;const col='#'+side.shirt.toString(16).padStart(6,'0'),hc='#'+side.helm.toString(16).padStart(6,'0');
    ctx.fillStyle=col;rr(ctx,x-34,y,68,90,12);ctx.fill();
    ctx.fillStyle='#f3cfae';ctx.beginPath();ctx.arc(x,y-24,34,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=hc;ctx.beginPath();ctx.arc(x,y-30,37,Math.PI,0);ctx.fill();
    ctx.fillStyle='#1a1a1a';ctx.fillRect(x-14,y-26,6,9);ctx.fillRect(x+8,y-26,6,9);
    ctx.strokeStyle='#5a2a2a';ctx.lineWidth=4;ctx.beginPath();if(happy)ctx.arc(x,y-14,9,0.2,Math.PI-0.2);else{ctx.moveTo(x-8,y-8);ctx.lineTo(x+8,y-8)}ctx.stroke();
    if(happy){ctx.fillStyle='#f3cfae';ctx.save();ctx.translate(x+40,y-40);ctx.rotate(0.3);rr(ctx,-6,-30,12,40,6);ctx.fill();rr(ctx,8,-28,12,38,6);ctx.fill();ctx.restore()}}
  if(happy){ctx.fillStyle='#ff7aa8';ctx.font=`900 40px ${FONT}`;ctx.fillText('♥',30,60);ctx.fillText('♥',w-70,70);ctx.fillStyle='#ffd84d';ctx.fillText('★',w/2-20,50)}
}
S[3]=()=>{
  bgEl.style.background='linear-gradient(#ffd1e8,#fff0f7 60%,#ffffff)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdcecff,30,90);addLights(scene);
  const r=rng(31);ground(scene,0xa8c47e);
  const tk=tank(0x7f9b5a);tk.position.set(0,0,-4);tk.rotation.y=-0.35;scene.add(tk);
  const posers=[];for(let i=0;i<5;i++){const p=soldier(r,ALLY);setFace(p,true);const a=(i-2)*0.5;p.position.set(a,i==2?2.0:1.4,i==2?-0.3:(i%2?0.6:-1.2));if(i==2){}tk.add(p);posers.push(p)}
  for(let i=0;i<6;i++){const p=soldier(r,ALLY);setFace(p,true);p.position.set(-3.6+i*1.45,0,-1.2+(i%2)*0.4);p.rotation.y=-0.2+i*0.08;scene.add(p);posers.push(p)}
  const g=general(r,GEN);g.position.set(0.3,0,1.6);g.rotation.y=0.1;scene.add(g);
  const stick=new THREE.Group();const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,2.4,6),lamb(0x333333));sp.position.y=1.2;stick.add(sp);const ph=phoneMesh();ph.position.y=2.45;ph.rotation.y=Math.PI;stick.add(ph);stick.position.set(-1.2,1.0,2.3);stick.rotation.x=-0.5;scene.add(stick);
  for(let i=0;i<8;i++)tree(scene,(i-3.5)*5,-14-r()*4,1.2);
  const C=cam(50);
  const feed=div('feed','<div class="scr"><div class="post" style="top:20px"><div class="ph"><div class="av" style="background:#7c74b8"></div>적군_공식</div><canvas width="800" height="300"></canvas><div class="lk"><span>♥</span><i>0</i></div></div><div class="post" style="top:480px"><div class="ph"><div class="av" style="background:#667f48"></div>아군_공식</div><canvas width="800" height="300"></canvas><div class="lk"><span>♥</span><i>0</i></div></div></div>');
  const cvs=feed.querySelectorAll('canvas');drawGroup(cvs[0].getContext('2d'),800,300,FOE,true);drawGroup(cvs[1].getContext('2d'),800,300,ALLY,false);
  const lk=feed.querySelectorAll('.lk i');
  const ch=chip('포탄 0발 · 보정 4,000회');const big=div('big1','<span>♥</span> <i>2,031</i>');
  const T2=vt(3.6);
  return t=>{
    const inFeed=t<T2;feed.style.display=inFeed?'block':'none';
    lk[0].textContent=fmt(30214*ease((t-vt(0.2))/1.2));lk[1].textContent=fmt(2031*ease((t-vt(0.8))/1.2));
    feed.style.transform=`scale(${pop(t/0.3)})`;
    lk[1].parentNode.style.color=t>vt(2.2)?'#ff3b6b':'#222';
    // 3D
    posers.forEach((p,i)=>{standPose(p);const k=clamp01((t-T2-i*0.06)/0.25);if(i%3==0)vSign(p,1,k);else if(i%3==1){armUp(p,0,k);armUp(p,1,k)}else{vSign(p,0,k);vSign(p,1,k*0.7)}
      p.position.y+=0;});
    standPose(g);g.userData.arms[1].rotation.x=-1.6*clamp01((t-vt(3.77))/0.2);g.userData.arms[1].rotation.z=-0.2;setFace(g,false);
    g.userData.hip.position.y=0.8+Math.abs(Math.sin(t*9))*0.04*(t>vt(3.77)?1:0);
    C.position.set(1.8,1.7,7.6-(t-T2)*0.25);C.lookAt(-0.2,2.1,-1.5);
    ch.style.display=inFeed?'none':'block';chipPop(ch,t,vt(3.85));big.style.display=inFeed?'none':'block';
    popEl(big,t,vt(3.7),'translateX(-50%)');big.querySelector('i').textContent=fmt(2031+29000*ease((t-vt(4.0))/2.5));
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 별풍선 전쟁 =====
function camp(scene,x0,side,r,o){
  const g=new THREE.Group();g.position.x=x0;scene.add(g);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(o.ground));gr.rotation.x=-Math.PI/2;g.add(gr);
  const tn=tent(g,0,-3.5,o.tent,1.2);
  const fl=flag(g,2.6,-3,o.flag,4.2);
  const crate=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.6,0.7),lamb(0xa07850));crate.position.set(-1.8,0.3,-1.2);g.add(crate);
  const tri=new THREE.Group();for(let i=0;i<3;i++){const l=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,1.4,5),lamb(0x333333));l.position.y=0.65;l.rotation.z=Math.cos(i*2.1)*0.25;l.rotation.x=Math.sin(i*2.1)*0.25;tri.add(l)}
  const tph=phoneMesh();tph.position.y=1.4;tph.rotation.y=Math.PI;tri.add(tph);tri.position.set(0,0,2.2);g.add(tri);
  for(let i=0;i<5;i++)tree(g,(i-2)*4.5+r(),-9-r()*3,1.1,o.tree);
  return {g,fl,tri};
}
S[4]=()=>{
  bgEl.style.background='linear-gradient(#9fd0ff,#dff0ff 60%,#f4fbff)';
  const scene=new THREE.Scene();addLights(scene);
  const r=rng(55);
  const A=camp(scene,0,ALLY,r,{ground:0xa8c47e,tent:0x6f8f48,flag:0x6f8f48,tree:0x6fae6a});
  const B=camp(scene,100,FOE,r,{ground:0xc7b6e0,tent:0x7c74b8,flag:0x7c74b8,tree:0x9a86c9});
  const g=general(r,GEN);g.position.set(0,0,0);A.g.add(g);
  const aide=soldier(r,ALLY);A.g.add(aide);
  const eg=general(r,ENEMYG);eg.position.set(0,0,0);B.g.add(eg);setFace(eg,true);
  // 적장 막사 내부
  const T=new THREE.Group();T.position.x=200;scene.add(T);
  const tw=new THREE.Mesh(new THREE.BoxGeometry(8,5,0.2),lamb(0x6d62ad));tw.position.set(0,2.5,-2.5);T.add(tw);
  const tf=new THREE.Mesh(new THREE.BoxGeometry(8,0.1,8),lamb(0x8a7a64));T.add(tf);
  const cot=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.45,1),lamb(0x5b5199));cot.position.set(-2.2,0.25,-1.6);T.add(cot);
  const lamp=glowSprite('rgba(255,220,150,1)',3);lamp.position.set(1.8,3.2,-2);T.add(lamp);
  const eg2=general(r,ENEMYG);setFace(eg2,true);T.add(eg2);
  const C=cam(50),CL=cam(50,495/880),CR=cam(50,495/880);
  // DOM
  const notif=div('notif','<div class="ic" style="background:#ff2e4d">LIVE</div><div class="tx"><b>적장</b>님이 라이브 방송을<br>시작했습니다 · 시청자 1만 명</div>');notif.style.opacity=0;
  const liveA=div('live','LIVE');liveA.style.cssText+='left:60px;top:230px;font-size:46px;padding:6px 22px';liveA.style.opacity=0;
  const pL=div('pane','<div class="nm">적장TV</div><div class="cnt"><span>★</span> <i>8,000</i></div>');pL.style.left='30px';
  const pR=div('pane','<div class="nm">장군TV</div><div class="cnt"><span>★</span> <i>7,900</i></div>');pR.style.left='555px';
  for(const p of[pL,pR]){const l=div('live','LIVE',p);l.style.left='20px';l.style.top='20px'}
  const toastsL=[],toastsR=[];const NM=['ㅇㅇ','국경지기','참호러버','폰병장','탱크맘','보정왕','군화짱','셀카각'];
  for(let i=0;i<4;i++){toastsL.push(div('toast','',pL));toastsR.push(div('toast','',pR))}
  const alert=div('alert','<div class="s">★</div><div class="a">ESFP짱 님</div><div class="b">별풍선 1,000개!</div>',pR);alert.style.opacity=0;
  const rev=div('stamp','역전!');rev.style.top='420px';rev.style.fontSize='90px';rev.style.opacity=0;
  const chat=div('chatbox','');const CH=['<b>참호러버</b>ㅋㅋㅋㅋㅋ','<b>폰병장</b>L을 가져가~~','<b>탱크맘</b>장군님 미쳤다','<b>국경지기</b>이게 전쟁이지','<b>보정왕</b>ㅋㅋㅋㅋㅋㅋ','<b>군화짱</b>클립 따감','<b>셀카각</b>L L L L'];
  const pscr=div('pscr','<div class="in"><div class="live" style="left:24px;top:24px">LIVE</div><div style="position:absolute;left:24px;top:84px;font-size:36px;font-weight:900;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.5)">장군TV</div><div class="bar">로그인: <b>ESFP짱</b></div></div>');pscr.style.opacity=0;
  const ch=chip('같은 시각 · 적장 막사');ch.style.opacity=0;
  const stars=[];for(let i=0;i<24;i++){const s=textSprite('★',80,'#ffd84d',0.005);scene.add(s);stars.push({s,ph:r(),x:(r()-0.5)*4})}
  const tSplit=vt(5.7),tDance=vt(13.8),tRev=vt(16.25),tDing=vt(9.37);
  const cntR=t=>t<tDing?7900+Math.min(60,Math.floor((t-tSplit)*8))*0:7900+1000*ease((t-tDing)/0.5);
  return t=>{
    const phase=t<vt(4.4)?0:t<tSplit?1:t<tDance?2:t<tRev?3:4;
    // 기본 포즈
    standPose(g);resetLegs(g);standPose(aide);standPose(eg);resetLegs(eg);standPose(eg2);resetLegs(eg2);
    let renderSplit=false;
    if(phase===0){
      g.position.set(-1.8,0,-1.2);sitPose(g);g.userData.hip.position.y=0.9;g.rotation.y=0.5;setFace(g,false);
      const k=clamp01((t-0.1)/2.2);aide.position.set(5-k*5.2,0,0.4);aide.rotation.y=-Math.PI/2+k*0.6;walkPose(aide,t*12,k<1?0.7:0);phoneUp(aide,1,1);
      C.position.set(1.5,2.4,6.5);C.lookAt(-0.6,1.3,-1);
    }else if(phase===1){
      g.position.set(-0.2,0,0.6);g.rotation.y=0;setFace(g,false);g.userData.arms[1].rotation.x=-1.3;
      aide.position.set(-1.6,0,0.2);aide.rotation.y=0.6;
      C.position.set(0,1.9,4.6);C.lookAt(0,1.7,0);
    }else if(phase===2){renderSplit=true;
      g.position.set(0,0,0.4);g.rotation.y=0;setFace(g,t>tDing);g.userData.arms[1].rotation.x=-0.4+Math.sin(t*3)*0.2;
      if(t>tDing+0.3){armUp(g,0,1);armUp(g,1,1);g.userData.hip.position.y=0.8+Math.abs(Math.sin(t*8))*0.2}
      eg.position.set(0,0,0.4);armUp(eg,1,0.6+Math.sin(t*5)*0.3);
      aide.position.set(-1.7,0,-0.3);aide.rotation.y=0.3;
      CL.position.set(100,1.8,3.4);CL.lookAt(100,1.6,0);CR.position.set(0,1.8,3.4);CR.lookAt(0,1.6,0);
    }else if(phase===3){
      g.position.set(0,0,0.4);g.rotation.y=0;setFace(g,true);lPose(g,t-tDance,1);
      aide.position.set(-1.7,0,-0.3);aide.rotation.y=0.3;lPose(aide,t-tDance+0.2,1);
      C.position.set(0,1.9,4.4);C.lookAt(0,1.6,0);
    }else{
      eg2.position.set(1.9,0,0.6);eg2.rotation.y=-0.35;lPose(eg2,t-tRev,1);phoneUp(eg2,0,1);
      C.position.set(200+1.2,2.1,7.2);C.lookAt(200+1.6,1.6,0);
    }
    A.tri.visible=B.tri.visible=phase<2;waveFlag(A.fl,t);waveFlag(B.fl,t+1);
    // 별 효과
    stars.forEach(q=>{const on=(phase===2&&t>tDing)||phase===3;q.s.visible=on;if(!on)return;const lt=((t*0.7+q.ph)%1);q.s.position.set(q.x,0.5+lt*3.6,0.6-lt);const k=Math.sin(lt*Math.PI);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)});
    // DOM
    notif.style.opacity=phase===0&&t>0.25?1:0;notif.style.transform=`translateY(${(1-ease((t-0.25)/0.3))*-220}px)`;
    liveA.style.opacity=(phase===1||phase===3)?1:0;if(phase===1)popEl(liveA,t,vt(4.75));
    pL.style.display=pR.style.display=phase===2?'block':'none';
    if(phase===2){popEl(pL,t,tSplit);popEl(pR,t,tSplit+0.12);
      pL.querySelector('.cnt i').textContent=fmt(8000+Math.floor((t-tSplit)*6));
      pR.querySelector('.cnt i').textContent=fmt(t<tDing?7900+Math.floor((t-tSplit)*5):7920+1000*ease((t-tDing)/0.5));
      const tick=Math.floor((t-tSplit)*2.2);
      [toastsL,toastsR].forEach((arr,j)=>arr.forEach((el,i)=>{const n=tick-i;el.style.top=(130+i*48)+'px';el.style.opacity=n>=0?Math.max(0,1-i*0.22):0;el.innerHTML=`<b>${NM[(n+j*3+8)%8]}</b> ★${[10,50,100,30,5,20][(n+j)%6]}`}));
      alert.style.opacity=t>tDing?1:0;popEl(alert,t,tDing);
      rev.style.opacity=t>vt(11.0)?1:0;popEl(rev,t,vt(11.0),'translateX(-50%) rotate(-10deg)');
    }else rev.style.opacity=0;
    chat.style.display=phase===3?'block':'none';
    if(phase===3){const n=Math.floor((t-tDance)*4);chat.innerHTML=Array.from({length:8},(_,i)=>`<div class="ln">${CH[(n+i)%CH.length]}</div>`).join('')}
    pscr.style.opacity=phase===4?1:0;ch.style.opacity=phase===4?1:0;
    if(phase===4){popEl(pscr,t,tRev+0.35);chipPop(ch,t,tRev)}
    caption(4,t);
    if(renderSplit){renderer.setScissorTest(true);renderer.clear();
      renderer.setViewport(30,1920-1180,495,880);renderer.setScissor(30,1920-1180,495,880);scene.background=new THREE.Color(0xd9ccef);renderer.render(scene,CL);
      renderer.setViewport(555,1920-1180,495,880);renderer.setScissor(555,1920-1180,495,880);scene.background=new THREE.Color(0xcfe6ff);renderer.render(scene,CR);
      renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);scene.background=null;bgEl.style.background='linear-gradient(#2a2f48,#3b4166)';}
    else{bgEl.style.background=phase===4?'linear-gradient(#3b3466,#5b5199)':'linear-gradient(#9fd0ff,#dff0ff 60%,#f4fbff)';renderer.render(scene,C)}
  };
};

// ===== 5. 항복 거절 =====
S[5]=()=>{
  bgEl.style.background='linear-gradient(#8ec5ff,#d6ecff 60%,#f1f8ff)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdcecff,30,90);addLights(scene);
  const r=rng(12);ground(scene,0x9cb97a);
  const bord=new THREE.Mesh(new THREE.PlaneGeometry(60,0.25),basic(0xf2f2e8));bord.rotation.x=-Math.PI/2;bord.position.set(0,0.01,0);scene.add(bord);
  sandbags(scene,0,5,12);sandbags(scene,0,-7,12);
  const fa=flag(scene,-5.5,6,0x6f8f48),fb=flag(scene,5.5,-8,0x7c74b8);
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r()*2,-14-r()*5,1.2,0x7fb06a);
  const g=general(r,GEN);g.position.set(-0.9,0,1.3);g.rotation.y=Math.PI*0.85;scene.add(g);
  const e=general(r,ENEMYG);scene.add(e);
  const wf=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,2.2,6),lamb(0xa07850));pole.position.y=1.1;wf.add(pole);
  const cloth=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.6,6,1),new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide,flatShading:true}));cloth.position.set(0.45,1.85,0);wf.add(cloth);scene.add(wf);
  const crowdA=[],crowdB=[];for(let i=0;i<7;i++){const p=soldier(r,ALLY);p.position.set(-6.5+i*1.3,0,5.7);p.rotation.y=Math.PI;scene.add(p);crowdA.push(p)}
  for(let i=0;i<7;i++){const p=soldier(r,FOE);p.position.set((i-3)*1.5+0.4,0,-7.7);scene.add(p);crowdB.push(p)}
  const be=bub(e,'줴줴이야~',{y:2.6,bg:'#e4e0ff',fg:'#2d2766',size:0.0055});const bg=bub(g,'거절',{y:2.6,size:0.0001});const bq=bub(e,'?',{y:2.6,bg:'#fff',fs:80});
  const C=cam(48);const stamp=div('stamp','항복 반려');stamp.style.opacity=0;const ch=chip('인류 최초 · 항복 거절');
  return t=>{
    // 적장 걸어옴
    const k=ease((t-0.1)/vt(3.5));const ez=-6+k*5.4;e.position.set(0.5,0,ez);e.rotation.y=0;standPose(e);resetLegs(e);
    if(k<1)walkPose(e,t*9,0.5);
    const Lk=clamp01((t-vt(1.1))/0.3);e.userData.arms[1].rotation.x=-2.75*Lk;e.userData.arms[1].rotation.z=1.15*Lk;
    if(!e.userData.L){const L=textSprite('L',90,'#c8ff4d',0.0045);e.userData.head.add(L);e.userData.L=L;L.position.set(0.02,0.55,0.32)}e.userData.L.visible=Lk>0.5&&t<vt(3.6);
    setFace(e,t<vt(3.9));
    // 백기: 적장 왼손 -> 장군 쪽 -> 다시 적장
    const off=ease((t-vt(3.96))/0.5),back=ease((t-vt(6.76))/0.4);const fe=new THREE.Vector3(0.1,0.3,ez+0.45),fg=new THREE.Vector3(-0.5,0.3,0.85);
    wf.position.copy(fe).lerp(fg,off*(1-back));wf.rotation.z=-0.1;
    e.userData.arms[0].rotation.x=-0.8;
    // 장군
    standPose(g);setFace(g,false);g.rotation.y=Math.PI*0.85;phoneUp(g,1,1);
    if(t>vt(6.76)&&t<vt(7.66)){g.userData.arms[0].rotation.x=-1.3*(1-ease((t-vt(7.36))/0.3))}
    if(t>vt(8.06)){g.rotation.y=Math.PI*0.85-ease((t-vt(8.06))/0.6)*Math.PI*0.6;setFace(g,true)}
    scaleBubble(be,0);
    scaleBubble(bg,t>vt(6.76)&&t<vt(8.06)?pop((t-vt(6.76))/0.3):0);
    scaleBubble(bq,t>vt(8.36)?pop((t-vt(8.36))/0.3):0);
    crowdA.concat(crowdB).forEach((p,i)=>{standPose(p);phoneUp(p,i%2,clamp01((t-vt(8.16)-i*0.04)/0.3));setFace(p,t>vt(8.16))});
    waveFlag(fa,t);waveFlag(fb,t+1);const pos=cloth.geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setZ(i,Math.sin(t*5+x*4)*0.06*(x+0.45))}pos.needsUpdate=true;
    stamp.style.opacity=t>vt(6.96)?1:0;popEl(stamp,t,vt(6.96),'translateX(-50%) rotate(-10deg)');if(t>vt(8.06))stamp.style.opacity=0;
    ch.style.opacity=t>vt(8.12)?1:0;chipPop(ch,t,vt(8.12));
    const w=ease((t-vt(8.06))/2.5);
    C.position.set(3.4+w*1.2,2.9+w*3.6,7.6+w*5);C.lookAt(-0.6,1.6-w*0.4,-1.0-w*0.6);
    caption(5,t);renderer.render(scene,C);
  };
};

// ===== 6. 10년 뒤 국경 포토존 =====
S[6]=()=>{
  bgEl.style.background='linear-gradient(#ffb36b,#ffd9a8 45%,#fff1dc)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xffe2bd,30,90);addLights(scene,{sun:0xffe6c8});
  const r=rng(2036);ground(scene,0xb6cf8a);
  const bord=new THREE.Mesh(new THREE.PlaneGeometry(60,0.25),basic(0xf2f2e8));bord.rotation.x=-Math.PI/2;bord.position.set(0,0.01,-3);scene.add(bord);
  // 포토존 아치
  const arch=new THREE.Group();for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.5,4,0.5),lamb(s<0?0x6f8f48:0x7c74b8));p.position.set(s*2.4,2,0);arch.add(p)}
  const top=new THREE.Mesh(new THREE.BoxGeometry(5.6,0.6,0.5),lamb(0xff8fb3));top.position.y=4.2;arch.add(top);
  const sign=labelSprite('전쟁 포토존',{fs:80,bg:'#ffffff',fg:'#d0306a',size:0.009});sign.position.set(0,5.0,0.3);arch.add(sign);
  arch.position.set(0,0,-3);scene.add(arch);
  const tk=tank(0x7f9b5a);tk.position.set(-5.5,0,-6);tk.rotation.y=0.6;scene.add(tk);
  // 가랜드
  for(let i=0;i<16;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.18,0.4,3),lamb(TOUR[i%6]));f.rotation.x=Math.PI;f.position.set(-7+i*0.95,3.6+Math.sin(i*0.4)*0.15,-6.5);scene.add(f)}
  const balloons=[];for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.32,10,8),lamb(TOUR[i%6]));b.position.set((r()-0.5)*14,3+r()*3,-8-r()*4);scene.add(b);balloons.push({b,ph:r()})}
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r()*2,-16-r()*5,1.2,0x7fb06a);
  // 줄 선 관광객
  const q=[];for(let i=0;i<22;i++){const p=tourist(r);const z=-1.6+i*0.9;p.position.set(Math.sin(i*0.5)*1.6,0,z);p.rotation.y=Math.PI;scene.add(p);q.push({p,ph:r()})}
  const shooter=[soldier(r,ALLY),soldier(r,FOE)];shooter[0].position.set(-1.5,0,0.4);shooter[1].position.set(1.5,0,0.4);shooter.forEach(p=>{p.rotation.y=Math.PI;setFace(p,true);scene.add(p)});
  const pose=[tourist(r),tourist(r)];pose[0].position.set(-0.5,0,-3.4);pose[1].position.set(0.5,0,-3.4);pose.forEach(p=>scene.add(p));
  const g=general(r,GEN),e=general(r,ENEMYG);g.position.set(-1.7,0,-2.2);e.position.set(1.7,0,-2.2);g.rotation.y=0.3;e.rotation.y=-0.3;setFace(g,true);setFace(e,true);scene.add(g);scene.add(e);
  const bgb=bub(g,'태그!',{y:2.7,size:0.006});
  const C=cam(50);const ch=chip('전쟁 10년째');
  const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','신청소에서 골라 주세요');e1.style.opacity=e2.style.opacity=0;
  const tEnd=vt(9.87)+0.45+0.3-2.0;
  return t=>{
    q.forEach((o,i)=>{standPose(o.p);if(i%4==0)phoneUp(o.p,1,1);o.p.userData.hip.position.y=0.8+Math.max(0,Math.sin(t*3+o.ph*6))*0.03});
    shooter.forEach((p,i)=>{standPose(p);phoneUp(p,i,1)});
    pose.forEach((p,i)=>{standPose(p);vSign(p,i?1:0,1)});
    standPose(g);standPose(e);const wv=t>vt(5.7)?1:0;armUp(g,1,wv);armUp(e,0,wv);g.userData.arms[1].rotation.z=0.18+Math.sin(t*8)*0.3*wv;e.userData.arms[0].rotation.z=-0.18-Math.sin(t*8)*0.3*wv;
    balloons.forEach(o=>{o.b.position.y+=Math.sin(t*2+o.ph*6)*0.003});
    scaleBubble(bgb,0);
    ch.textContent=t<vt(1.67)?'전쟁 10년째':t<vt(3.14)?'전쟁 10년째 · 사상자 0명':'포토존 웨이팅 3시간';chipPop(ch,t,0.1);
    if(t>tEnd){ch.style.opacity=0}
    e1.style.opacity=clamp01((t-tEnd)/0.1);e1.style.transform=`scale(${pop((t-tEnd)/0.35)})`;
    e2.style.opacity=clamp01((t-tEnd-0.25)/0.1);e2.style.transform=`scale(${pop((t-tEnd-0.25)/0.35)})`;
    C.position.set(1.2-t*0.06,3.2,12.5-t*0.25);C.lookAt(0,2.9,-3);
    caption(6,t);renderer.render(scene,C);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
