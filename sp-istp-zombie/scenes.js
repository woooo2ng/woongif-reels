// ---------- ISTP 좀비편 전용 ----------
const OR='#fff0d6',ORF='#6b3a00';
function bubI(p,text,o={}){return topB(bub(p,text,{y:o.y??2.3,bg:o.bg||OR,fg:o.fg||ORF,fs:o.fs||64,size:o.size||0.0026}))}
const IC=[0x4f5d75,0x6b7280,0x3d4a5c,0x7a6f64,0x2f3a4a,0x8a9aa8,0x5c6b5a,0x6f5a4a,0x46505e];
function istp(r,o={}){const p=addFace(makePerson(r,{shirt:o.shirt??pick(r,IC),hair:o.hair}));setFace(p,false);return p}
function momP(r){const p=addFace(makePerson(r,{shirt:0xc98f9a,pants:0x5a4a5a,hair:0x2e2420}));setFace(p,false);
  const bun=new THREE.Mesh(new THREE.SphereGeometry(0.12,32,20),smooth(0x2e2420));bun.position.set(0,0.42,-0.16);p.userData.head.add(bun);return p}
// 폰 (화면이 본인 얼굴 쪽)
function myPhone(col=0x9fd0ff){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.3,0.03),lamb(0x24242c));g.add(b);
  const s=new THREE.Mesh(new THREE.PlaneGeometry(0.145,0.27),basic(col));s.position.z=0.017;g.add(s);g.userData.scr=s;return g}
function holdPhone(p,k=1,down=0.38){const u=p.userData;
  u.arms[0].rotation.x=-1.0*k;u.arms[0].rotation.z=0.4*k;u.arms[1].rotation.x=-1.0*k;u.arms[1].rotation.z=-0.4*k;
  if(!u.ph){const ph=myPhone(pick(rng(u.hip.id),[0x9fd0ff,0xffd6a8,0xc8f0c0,0xe0c8ff]));u.hip.add(ph);u.ph=ph}
  u.ph.visible=k>0.3;u.ph.position.set(0,0.33,0.47);u.ph.rotation.set(-2.0,0,0);u.head.rotation.x=down*k}
function phoneEar(p,k=1){const u=p.userData;const a=u.arms[1];a.rotation.x=-2.9*k;a.rotation.z=0.35*k;
  if(!u.eph){const ph=myPhone(0x9fd0ff);ph.scale.setScalar(0.85);u.head.add(ph);u.eph=ph;ph.position.set(0.27,0.2,0.04);ph.rotation.set(0,Math.PI/2,0.25)}
  u.eph.visible=k>0.5;if(u.ph)u.ph.visible=false}
function nod(p,t,t0){const k=t-t0;p.userData.head.rotation.x+=(k>0&&k<0.45)?Math.sin(k/0.45*Math.PI)*0.32:0}
function vigPulse(el,si,t,on=1){el.style.opacity=on*(0.25+0.75*beatPulse(si,t))}
function sitBench(p){standPose(p);sitPose(p);p.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2)}
function cutFlash(el,t,ts){el.style.background=`rgba(255,255,255,${0.7*clamp01(1-(t-ts)/0.15)*(t>=ts?1:0)})`}

// ---------- 지하철 ----------
function subway(sc,r){
  const L=16,z0=6,z1=-7,Wd=1.6,Hh=2.6;
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(Wd*2,L),lamb(0x8c8f99));fl.rotation.x=-Math.PI/2;fl.position.z=(z0+z1)/2;sc.add(fl);
  const strip=new THREE.Mesh(new THREE.PlaneGeometry(0.9,L),lamb(0x9fa3ad));strip.rotation.x=-Math.PI/2;strip.position.set(0,0.005,(z0+z1)/2);sc.add(strip);
  const ce=new THREE.Mesh(new THREE.PlaneGeometry(Wd*2,L),lamb(0xe6e8ee));ce.rotation.x=Math.PI/2;ce.position.set(0,Hh,(z0+z1)/2);sc.add(ce);
  const lights=[];for(const x of[-0.62,0.62]){const m=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.03,L-0.6),basic(0xf6fbff));m.position.set(x,Hh-0.03,(z0+z1)/2);sc.add(m);lights.push(m)}
  const outs=[];
  for(const s of[-1,1]){
    const lo=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.05,L),lamb(0xd6dae2));lo.position.set(s*Wd,0.525,(z0+z1)/2);sc.add(lo);
    const up=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.55,L),lamb(0xd6dae2));up.position.set(s*Wd,Hh-0.275,(z0+z1)/2);sc.add(up);
    const gl=new THREE.Mesh(new THREE.PlaneGeometry(L,1.0),basic(0x141a2c));gl.rotation.y=-s*Math.PI/2;gl.position.set(s*(Wd+0.06),1.55,(z0+z1)/2);sc.add(gl);
    for(let z=z0;z>=z1;z-=2.2){const pl=new THREE.Mesh(new THREE.BoxGeometry(0.12,1.0,0.16),lamb(0xc4c8d2));pl.position.set(s*Wd,1.55,z);sc.add(pl)}
    // 좌석
    for(let z=z0-0.6;z>z1+0.8;z-=4.2){const sb=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.12,3.6),lamb(0x6f9fd8));sb.position.set(s*(Wd-0.33),0.46,z-1.8);sc.add(sb);
      const bk=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.5,3.6),lamb(0x6f9fd8));bk.position.set(s*(Wd-0.08),0.75,z-1.8);sc.add(bk);
      const base=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.4,3.6),lamb(0xa8acb6));base.position.set(s*(Wd-0.33),0.2,z-1.8);sc.add(base)}
    // 손잡이 봉 + 손잡이
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,L,8),lamb(0xdfe3ea));bar.rotation.x=Math.PI/2;bar.position.set(s*0.95,2.15,(z0+z1)/2);sc.add(bar);
    for(let z=z0-0.4;z>z1;z-=0.75){const st=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.22,4),lamb(0xdddddd));st.position.set(s*0.95,2.03,z);sc.add(st);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.015,6,14),lamb(0xf2f2f2));ring.position.set(s*0.95,1.86,z);ring.rotation.y=Math.PI/2;sc.add(ring)}
    // 바깥 터널 불빛
    for(let i=0;i<10;i++){const g=glowSprite('rgba(255,214,150,1)',0.9);g.position.set(s*2.4,1.5+(i%3)*0.25,0);sc.add(g);outs.push({g,ph:i*1.9+s*0.7})}
  }
  for(const x of[-0.62,0.62])for(const z of[2.5,-1.5]){const po=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,Hh,8),lamb(0xdfe3ea));po.position.set(x*0.0+(x>0?0.0:0.0)+x*0.0,Hh/2,z);}
  // 끝 벽 + 연결문
  const ew=lamb(0xcfd3dc);
  for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(1.05,Hh,0.16),ew);b.position.set(s*1.075,Hh/2,z1);sc.add(b)}
  const tp=new THREE.Mesh(new THREE.BoxGeometry(1.1,Hh-2.1,0.16),ew);tp.position.set(0,2.1+(Hh-2.1)/2,z1);sc.add(tp);
  const door=new THREE.Group();const dm=lamb(0xb8bec9);
  const pc=(w,h,x,y)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.06),dm);m.position.set(x,y,0);door.add(m)};
  pc(1.1,1.15,0,0.575);pc(1.1,0.15,0,2.025);pc(0.16,0.8,-0.47,1.55);pc(0.16,0.8,0.47,1.55);
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(0.78,0.8),new THREE.MeshBasicMaterial({color:0x9fd8c8,transparent:true,opacity:0.22,depthWrite:false}));glass.position.set(0,1.55,0.01);door.add(glass);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.16),new THREE.MeshBasicMaterial({map:canvasTex(300,96,(c,w,h)=>{c.fillStyle='#2f6f4f';c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font=`900 54px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText('2호차',w/2,h/2+3)})}));sign.position.set(0,2.35,z1+0.09);sc.add(sign);
  door.position.set(0,0,z1+0.1);sc.add(door);
  // 옆 칸 (어둡고 초록빛)
  const nf=new THREE.Mesh(new THREE.PlaneGeometry(3.2,6),lamb(0x4a5a50));nf.rotation.x=-Math.PI/2;nf.position.set(0,0.002,z1-3);sc.add(nf);
  const nw=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.6),lamb(0x2f3a34));nw.position.set(0,1.3,z1-6);sc.add(nw);
  const nl=new THREE.PointLight(0x9fe0a0,5,6,1.4);nl.position.set(0,2.2,z1-1.5);sc.add(nl);
  return {lights,outs,door,glass,z1}
}

// ---------- 창문 있는 아파트(방이 보이는 정면) ----------
function roomMat(col,night){return new THREE.MeshLambertMaterial({color:col,side:THREE.BackSide,emissive:night?new THREE.Color(col).multiplyScalar(0.35):0x000000})}
function bowl(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.09,0.12,14),lamb(0xf2f2f2));g.add(b);
  const n=new THREE.Mesh(new THREE.CylinderGeometry(0.125,0.125,0.02,14),lamb(0xf3c26b));n.position.y=0.05;g.add(n);
  const ch=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.01,0.34),lamb(0xd8b878));ch.position.set(0.03,0.15,0.02);ch.rotation.x=0.9;g.add(ch);return g}
function tvTex(){return canvasTex(512,300,(c,w,h)=>{c.fillStyle='#1a1d2e';c.fillRect(0,0,w,h);c.fillStyle='#e2332d';c.fillRect(20,18,110,46);c.fillStyle='#fff';c.font=`900 34px ${FONT}`;c.fillText('LIVE',34,52);
  c.fillStyle='#c8d0ff';c.font=`800 40px ${FONT}`;c.textAlign='center';c.fillText('공식 생존자',w/2,140);c.fillStyle='#ffd84d';c.font=`900 92px ${FONT}`;c.fillText('0명',w/2,240)})}
let TVT=null;
function apt(sc,r,o={}){
  const cols=o.cols||4,rows=o.rows||5,cw=2.4,chh=2.1,gx=0.5,gy=0.55,D=2.0;const night=!!o.night;
  const Wt=cols*cw+(cols+1)*gx,Ht=rows*chh+(rows+1)*gy+0.6;
  const wallCol=o.wall??(night?0x6a6488:0xe8d8c4);
  if(!o.cut){const sh=new THREE.Shape();sh.moveTo(-Wt/2,0);sh.lineTo(Wt/2,0);sh.lineTo(Wt/2,Ht);sh.lineTo(-Wt/2,Ht);sh.lineTo(-Wt/2,0);
    for(let c=0;c<cols;c++)for(let rr2=0;rr2<rows;rr2++){const x=-Wt/2+gx+c*(cw+gx),y=0.6+gy+rr2*(chh+gy);const hp=new THREE.Path();hp.moveTo(x,y);hp.lineTo(x,y+chh);hp.lineTo(x+cw,y+chh);hp.lineTo(x+cw,y);hp.lineTo(x,y);sh.holes.push(hp)}
    const fw=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.3,bevelEnabled:false}),lamb(wallCol));fw.position.z=-0.3;sc.add(fw);
    for(let rr2=0;rr2<rows;rr2++){const ledge=new THREE.Mesh(new THREE.BoxGeometry(Wt,0.08,0.3),lamb(new THREE.Color(wallCol).multiplyScalar(0.85).getHex()));ledge.position.set(0,0.6+gy+rr2*(chh+gy)-0.04,0.12);sc.add(ledge)}}
  else{for(let rr2=0;rr2<=rows;rr2++){const sl=new THREE.Mesh(new THREE.BoxGeometry(Wt,gy,D+0.3),lamb(0xd8ccc0));sl.position.set(0,0.6+rr2*(chh+gy)+gy/2,-D/2);sc.add(sl)}
    for(let c=0;c<=cols;c++){const pl=new THREE.Mesh(new THREE.BoxGeometry(gx,Ht-0.6,D+0.3),lamb(0xd8ccc0));pl.position.set(-Wt/2+gx/2+c*(cw+gx),0.6+(Ht-0.6)/2,-D/2);sc.add(pl)}}
  const WC=night?[0x8a7a6a,0x7a8a9a,0x8a8a7a,0x9a8a9a]:[0xf4e6d2,0xdfe8f0,0xf0e2e8,0xe6eedd,0xf6ecd8];
  const rooms=[];const acts=o.acts||['ramen','game','phone','ramen','phone','game','ramen'];
  if(!TVT)TVT=tvTex();
  for(let c=0;c<cols;c++)for(let rr2=0;rr2<rows;rr2++){
    const x=-Wt/2+gx+c*(cw+gx)+cw/2,y=0.6+gy+rr2*(chh+gy);
    const wc=pick(r,WC);const fc=night?0x6a5a4a:pick(r,[0xc9a888,0xb89a7a,0xd6b896]);
    const box=new THREE.Mesh(new THREE.BoxGeometry(cw,chh,D),[roomMat(wc,night),roomMat(wc,night),roomMat(0xf2f2f2,night),roomMat(fc,night),roomMat(wc,night),roomMat(wc,night)]);box.position.set(x,y+chh/2,-0.3-D/2);sc.add(box);
    const g=new THREE.Group();g.position.set(x,y,-0.3-D/2);sc.add(g);
    const act=o.actOf?o.actOf(c,rr2):acts[(c*3+rr2*5)%acts.length];
    const p=istp(r);g.add(p);let tv=null;
    if(act==='lie'){p.rotation.set(-Math.PI/2,0,Math.PI/2*(r()<0.5?1:-1));p.position.set(0,0.2,0);holdPhone(p,1,0);p.userData.arms.forEach(a=>{a.rotation.x=-2.6;a.rotation.z*=0.5});p.userData.ph.position.set(0,0.3,0.75);p.userData.ph.rotation.set(-0.3,0,0)}
    else if(act==='ramen'){sitPose(p);p.position.set(0,-0.36,0.1);const tb=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.36,0.5),lamb(0x8a6a4e));tb.position.set(0,0.18,0.75);g.add(tb);p.userData.tbl=tb;const bw=bowl();bw.position.set(0,0.42,0.72);g.add(bw);p.userData.arms.forEach(a=>a.rotation.x=-1.2);p.userData.head.rotation.x=0.3;p.userData.bowl=bw}
    else if(act==='game'){sitPose(p);p.position.set(0.3,-0.36,0);p.rotation.y=-0.9;tv=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.48),basic(0x8fd3ff));tv.position.set(-cw/2+0.06,1.05,0.1);tv.rotation.y=Math.PI/2;g.add(tv);p.userData.arms.forEach(a=>{a.rotation.x=-1.1;a.rotation.z=0})}
    else if(act==='phone'){sitPose(p);p.position.set(0,-0.36,0);holdPhone(p,1)}
    else if(act==='desk'){p.scale.setScalar(0.85)}
    let tvm=null;if(o.tvAll){tvm=new THREE.Mesh(new THREE.PlaneGeometry(1.5,0.88),new THREE.MeshBasicMaterial({map:TVT}));tvm.position.set(0,1.15,-D/2+0.04);g.add(tvm)}
    const bl=new THREE.Mesh(new THREE.PlaneGeometry(cw,chh),new THREE.MeshLambertMaterial({map:blindTex(),side:THREE.DoubleSide}));bl.position.set(x,y+chh,-0.32);bl.visible=false;sc.add(bl);
    rooms.push({c,r:rr2,x,y,g,p,act,bl,box,chh,tvm})}
  return {rooms,Wt,Ht,cw,chh}
}
let BLT=null;function blindTex(){return BLT||(BLT=canvasTex(128,128,(c,w,h)=>{c.fillStyle='#efe6d4';c.fillRect(0,0,w,h);for(let i=0;i<16;i++){c.fillStyle='rgba(120,100,70,.25)';c.fillRect(0,i*8+6,w,2)}}))}
function setBlind(rm,k){rm.bl.visible=k>0.01;rm.bl.scale.y=Math.max(0.001,k);rm.bl.position.y=rm.y+rm.chh-(rm.chh*k)/2;}
function heliM(){const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),lamb(0xe85a4a));body.scale.set(1.3,0.95,2.0);g.add(body);
  const st=new THREE.Mesh(new THREE.SphereGeometry(1.002,24,16,0,Math.PI*2,Math.PI*0.42,0.16),lamb(0xffffff));st.scale.copy(body.scale);g.add(st);
  const win=new THREE.Mesh(new THREE.SphereGeometry(0.75,20,14,0,Math.PI*2,0,Math.PI*0.5),lamb(0x2c3e5c));win.rotation.x=1.25;win.position.set(0,0.25,1.4);win.scale.set(1.2,1,0.8);g.add(win);
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,3.2),lamb(0xe85a4a));tail.position.set(0,0.3,-3.2);g.add(tail);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.9,0.6),lamb(0xe85a4a));fin.position.set(0,0.75,-4.7);g.add(fin);
  const tr=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.9,0.12),lamb(0x333333));tr.position.set(0.12,0.75,-4.7);g.add(tr);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.4,8),lamb(0x444444));mast.position.y=1.1;g.add(mast);
  const rot=new THREE.Group();rot.position.y=1.32;g.add(rot);for(const a of[0,Math.PI/2]){const bl=new THREE.Mesh(new THREE.BoxGeometry(6.5,0.03,0.22),lamb(0x333333));bl.rotation.y=a;rot.add(bl)}
  for(const s of[-1,1]){const sk=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.08,2.6),lamb(0x555555));sk.position.set(s*0.8,-1.1,0);g.add(sk);const lg=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.4,0.06),lamb(0x555555));lg.position.set(s*0.75,-0.9,0.5);g.add(lg)}
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.1),basic(0x1e2433));door.position.set(1.32,-0.05,0.2);door.rotation.y=Math.PI/2;g.add(door);
  const res=addFace(makePerson(rng(77),{shirt:0xff8a2a,pants:0x2f3a4a}));res.position.set(1.42,-0.95,0.2);res.rotation.y=Math.PI/2;res.scale.setScalar(0.85);sitPose(res);
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.29,40,20,0,Math.PI*2,0,Math.PI*0.5),smooth(0xffffff));hm.position.y=0.27;res.userData.head.add(hm);res.userData.head.children[1].visible=false;
  const mg=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.06,0.36,12,1,true),new THREE.MeshLambertMaterial({color:0xf2f2f2,side:THREE.DoubleSide}));mg.rotation.x=Math.PI/2;res.userData.arms[1].add(mg);mg.position.set(0,-0.7,0.15);mg.visible=false;res.userData.mg=mg;
  g.add(res);g.userData={rot,res};return g}
function spinHeli(h,t){h.userData.rot.rotation.y=t*40;h.position.y+=Math.sin(t*2)*0.06}
function searchCone(sc){const cone=new THREE.Mesh(new THREE.ConeGeometry(2.4,22,24,1,true),new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:0.16,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));sc.add(cone);
  const spot=new THREE.Mesh(new THREE.CircleGeometry(2.0,32),new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:0.35,depthWrite:false,blending:THREE.AdditiveBlending}));sc.add(spot);return {cone,spot}}
function aimCone(S,from,to){const d=new THREE.Vector3().subVectors(to,from);const L2=d.length();S.cone.scale.set(1,L2/22,1);S.cone.position.copy(from).addScaledVector(d,0.5);
  S.cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),d.clone().normalize());S.spot.position.set(to.x,to.y,to.z+0.05)}
function titleEls(){ui.insertAdjacentHTML('beforeend',`<div class="tag">ISTP × 좀비편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ISTP인데</div><div class="title3 out">좀비 사태가 터진다면?</div>`);
  const E=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return (t,TA)=>{const T0=0.05,out=clamp01((t-TA+0.25)/0.25),os=1-out;const [tag,t1,t2,t3]=E;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.7)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.7)/0.1)*os}}

// ===== 0. 지하철: 옆 칸 좀비 떼(타이틀) → 폰만 보는 승객들 → 좀비 난입 '으어어어!!' → '…뭐지' → 빈자리에 앉음 → 재난문자 밀어서 지움 =====
S[0]=()=>{
  const E=EV(0);const r=rng(601);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xf2f6ff,0x7a7a88,1.9));const dl=new THREE.DirectionalLight(0xffffff,0.6);dl.position.set(0,6,3);sc.add(dl);
  const SW=subway(sc,r);
  // 옆 칸 좀비 떼 (유리에 붙음)
  const horde=[];for(let i=0;i<9;i++){const z=zombie(r);const row=Math.floor(i/3);z.position.set((i%3-1)*0.42+(r()-0.5)*0.1,0,SW.z1-0.32-row*0.55);sc.add(z);horde.push({z,x0:z.position.x,z0:z.position.z,ph:r()*6})}
  const Z=horde[1].z; // 들어오는 좀비
  // 승객
  const pax=[];const seats=[];
  for(const s of[-1,1])for(let z=5.1;z>-6.2;z-=0.72){if(Math.abs(z-1.15)<0.4)continue;seats.push([s,z])}
  const EMPTY=[1,-3.54];let sid=0;
  seats.forEach(([s,z])=>{if(s===EMPTY[0]&&Math.abs(z-EMPTY[1])<0.36)return;if(r()<0.12)return;const p=istp(r);p.position.set(s*(Wd()-0.33),0,z);p.rotation.y=-s*Math.PI/2;sitBench(p);holdPhone(p,1);sc.add(p);pax.push({p,s,z,ph:r()*6,id:sid++})});
  function Wd(){return 1.6}
  const stand=[];for(const [x,z] of[[-0.35,4.4]]){const p=istp(r);p.position.set(x,0,z);p.rotation.y=x<0?0.6:-2.4;holdPhone(p,1);p.userData.arms[0].rotation.x=-2.7;p.userData.arms[0].rotation.z=-0.15;sc.add(p);stand.push(p)}
  const lookers=pax.filter(q=>Math.abs(q.z+2.2)<2.2);const trio=pax.filter(q=>q.s>0&&q.z<-0.5&&q.z>-3.0).sort((a,b)=>Math.abs(a.z+1.75)-Math.abs(b.z+1.75)).slice(0,3).sort((a,b)=>b.z-a.z);const spk=trio[1]||trio[0];const ZC=trio.reduce((a,q)=>a+q.z,0)/trio.length;
  const bP=bubI(spk.p,'…뭐지',{y:1.62,size:0.0026,fs:72});
  const bZ=bubZ(Z,'으어어어!!',{size:0.0042});
  const C=cam(50);const tUpd=titleEls();
  const vig=div('vig');const fl=div('flash');
  // 폰 화면 + 재난문자
  const ph=div('ph2','<div class="screen"><div class="vid"><svg viewBox="0 0 200 200" width="420" height="420"><polygon points="40,70 60,10 95,55" fill="#f2a65a"/><polygon points="160,70 140,10 105,55" fill="#f2a65a"/><ellipse cx="100" cy="115" rx="78" ry="68" fill="#f2a65a"/><rect x="62" y="98" width="14" height="22" rx="7" fill="#2a2a2a"/><rect x="124" y="98" width="14" height="22" rx="7" fill="#2a2a2a"/><path d="M92 132 L100 140 L108 132" stroke="#2a2a2a" stroke-width="5" fill="none"/></svg></div><div class="ui"><div><b></b>2.1만</div><div><b></b>342</div><div><b></b>공유</div></div><div class="cap2">@cat_daily · 고양이 식빵 굽기</div></div>');
  const al=div('alertb','<div class="h"><i>긴급재난문자</i> 지금</div><div class="m">[행정안전부] 전국 좀비 사태 발생. 외출을 자제하십시오.</div>',ph.querySelector('.screen'));
  const th=div('thumb2','<svg viewBox="0 0 200 330" width="230" height="380"><path d="M40 330 L40 110 Q40 20 100 20 Q160 20 160 110 L160 330 Z" fill="#f1c8a4" stroke="#c99a78" stroke-width="6"/><path d="M62 112 Q62 48 100 48 Q138 48 138 112 Q138 140 100 140 Q62 140 62 112 Z" fill="#fbe3d2" stroke="#d8ab8c" stroke-width="5"/><path d="M48 200 Q100 215 152 200" stroke="#d8a888" stroke-width="5" fill="none"/></svg>');
  const arw=div('arw out','←');
  const ch=chip('좀비 사태 인지: 0명',330);ch.style.background='#2b2b3a';ch.style.color='#ffd84d';
  return t=>{
    const TB=E.bang,TT=E.turn,TD=E.door,TQ=E.quiet,TL=E.look,TS=E.sit,TN=E.notif,TW=E.swipe,N2=at(0,'n2');
    // 형광등 깜빡임
    const fk=(t>0.4&&t<0.5)||(t>0.55&&t<0.62)||(t>1.6&&t<1.68)||(t>2.9&&t<2.97);SW.lights.forEach(l=>l.material.color.setHex(fk?0x8a8e99:0xf6fbff));
    SW.outs.forEach(o=>{o.g.position.z=6-((t*9+o.ph*3)%14)});
    // 옆 칸 좀비
    horde.forEach((q,i)=>{if(q.z===Z&&t>=TD)return;zPose(q.z,t,0);const u=q.z.userData;if(i<3&&t>TB-0.1){const k=Math.abs(Math.sin((t-TB)*7+q.ph));u.arms[0].rotation.x=-1.9-0.2*k;u.arms[1].rotation.x=-2.0-0.2*k}
      q.z.position.x=q.x0+(t>=TD&&t<TD+2?Math.sin(t*8+q.ph)*0.03:0)});
    const bk=t>=TB&&t<TB+0.9?Math.sin((t-TB)*40)*Math.exp(-(t-TB)*4)*0.03:0;
    // 문
    const ok=ease((t-TD)/0.45);SW.door.position.x=ok*1.1+bk;
    // 들어오는 좀비
    if(t>=TD){const k=clamp01((t-TD-0.1)/1.1);const u=Z.userData;
      if(t<TL){Z.position.set(0,0,SW.z1-0.3+ease(k)*2.0);Z.rotation.y=0;zPose(Z,t,k<1?1:0);if(k>=1){u.arms[0].rotation.x=-2.3;u.arms[1].rotation.x=-2.3;u.head.rotation.x=-0.3}}
      else if(t<TS){const k2=clamp01((t-TL)/(TS-TL));zPose(Z,t,0);u.head.rotation.y=Math.sin(k2*Math.PI*2)*0.7*(1-k2);
        const kw=clamp01((k2-0.45)/0.4);Z.position.set(ease(kw)*0.85,0,SW.z1-0.3+2.0+(EMPTY[1]-(SW.z1+1.7))*ease(kw));Z.rotation.y=-ease(kw)*Math.PI/2;if(kw>0&&kw<1)zPose(Z,t,1)}
      else{Z.position.set(1.6-0.33,0,EMPTY[1]);Z.rotation.y=-Math.PI/2;zPose(Z,t,0);sitBench(Z);u.arms[0].rotation.x=-1.1;u.arms[1].rotation.x=-0.9;u.head.rotation.z=0.3}}
    // 승객: 대부분 계속 폰, 근처 몇 명만 1초 쳐다봄
    pax.forEach(q=>{sitBench(q.p);holdPhone(q.p,1);const u=q.p.userData;
      const LE=endOf(0,'p1',0.45);if(trio.includes(q)&&t>TQ&&t<LE+0.25){const k=Math.min(clamp01((t-TQ-0.15)/0.12),clamp01((LE+0.25-t)/0.12));u.head.rotation.x=0.38-0.6*k;u.head.rotation.y=-0.55*k;u.hip.rotation.x=0;return}
      if(lookers.includes(q)&&t>TQ+0.1&&t<at(0,'p1',0.95)){const k=Math.min(clamp01((t-TQ-0.1)/0.2),clamp01((at(0,'p1',0.95)-t)/0.2));u.head.rotation.x=0.38-0.55*k;u.head.rotation.y=(q.s<0?0.6:-0.6)*k*(q.z>-2?1:-1)}});
    show(bP,t,at(0,'p1'),endOf(0,'p1',0.4));{const v=t>=at(0,'p1',0.89)?1:0;if(bP.userData.v!==v){bP.userData.v=v;setBubble(bP,v?'빌런인가':'…뭐지',{bg:OR,fg:ORF,fs:72,size:0.0026});scaleBubble(bP,t>=at(0,'p1')?1:0)}}show(bZ,t,at(0,'z1'),endOf(0,'z1',0.1));
    // 카메라
    let mode='A';if(t>=TT)mode='B';if(t>=TD-0.15)mode='C';if(t>=TQ&&t<endOf(0,'p1',0.7))mode='L';if(t>=N2-0.1)mode='D';
    if(mode==='A'){const k=ease(t/TT);C.fov=46;C.position.set(0.1,1.6,-3.2-k*1.3);C.lookAt(0,1.72,SW.z1)}
    else if(mode==='B'){const k=ease((t-TT)/(TD-TT));C.fov=58;C.position.set(0,1.75,SW.z1+1.2);C.lookAt(0,0.95-k*0.1,3)}
    else if(mode==='C'){const k=ease((t-TD)/(TS-TD));C.fov=54;C.position.set(-0.25,1.85,1.6-k*1.6);C.lookAt(0.2,1.25,SW.z1+1)}
    else if(mode==='L'){const k=ease((t-TQ)/1.6);C.fov=55;C.position.set(-0.75,1.8,ZC-2.5+k*0.2);C.lookAt(1.25,1.15,ZC+0.25)}
    else{const k=ease((t-N2)/3);C.fov=55;C.position.set(-1.0,2.3,-0.4+k*0.4);C.lookAt(1.0,0.95,-3.7)}
    C.position.x+=bk*2;C.updateProjectionMatrix();
    renderer.setClearColor(0x000000,0);setSky('#1a1f33','#2b3352');renderer.render(sc,C);
    tUpd(t,TT);
    vig.style.opacity=(t>TB-0.1&&t<TQ)?(0.25+0.75*beatPulse(0,t)):0;
    cutFlash(fl,t,TD-0.15);if(t>=TQ&&t<TQ+0.2)cutFlash(fl,t,TQ);
    // 폰
    const TPr=E.press;
    const onPh=t>=TN-0.35&&t<N2-0.1;sh(ph,onPh);sh(th,onPh&&t>TN+0.35);sh(arw,onPh&&t>TW&&t<TW+0.75);
    if(onPh){const k=ease((t-TN+0.35)/0.3);ph.style.transform=`translateY(${(1-k)*1200}px)`;
      // 배너: 부르르 흔들리며 내려옴 → 멈춤 → 엄지 따라 왼쪽으로
      const ka=ease((t-TN)/0.25);const shk=t>TN&&t<TN+0.5?Math.sin((t-TN)*70)*10*(1-(t-TN)/0.5):0;
      const dk=clamp01((t-TW)/0.6);const drag=-ease(dk)*560-Math.pow(clamp01((t-TW-0.45)/0.3),2)*500;
      al.style.transform=`translateY(${(1-ka)*-300}px) translateX(${shk+drag}px) rotate(${drag*0.006}deg)`;al.style.opacity=t<TN?0:1;
      al.style.filter=t>TPr&&t<TW+0.6?'brightness(0.92)':'none';
      // 엄지: 오른쪽 아래에서 들어와 배너 위에 올림 → 꾹 → 왼쪽으로 끌기 → 빠짐
      let tx,ty;const tipX0=760,tipY0=300;
      if(t<TPr){const k2=ease((t-TN-0.35)/(TPr-TN-0.35));tx=1050+(tipX0-1050)*k2;ty=1500+(tipY0-1500)*k2}
      else if(t<TW){tx=tipX0;ty=tipY0}
      else if(t<TW+0.6){tx=tipX0-ease(dk)*560;ty=tipY0+Math.sin(dk*Math.PI)*12}
      else{const k3=ease((t-TW-0.6)/0.35);tx=200+k3*700;ty=tipY0+k3*1200}
      const press=t>=TPr&&t<TW+0.6?0.93:1;th.style.left=`${tx-115}px`;th.style.top=`${ty-25}px`;th.style.transform=`scale(${press}) rotate(-12deg)`;
      arw.style.left=`${tx+130}px`;arw.style.top=`${ty-90}px`;arw.style.opacity=Math.min(1,clamp01((t-TW)/0.1),clamp01((TW+0.75-t)/0.2))}
    chipPop(ch,t,N2+0.15);ch.style.opacity=t>N2+0.15?1:0;
    caption(0,t)};
};

// ===== 1. 3일 후: 방송 '여럿이 모여 계십시오' → 단톡 '우리 집 모일 사람?' 읽음 5·답장 0 → 아파트 단면, 다들 각자 방 → 텅 빈 대피소 =====
S[1]=()=>{
  const E=EV(1);const r=rng(611);
  // A: 낮 거리 + 방송 차량
  const sA=new THREE.Scene();addLights(sA,{hemi:1.5});ground(sA,0xb8c4a8,200);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(7,200),lamb(0x6a6e78));road.rotation.x=-Math.PI/2;road.position.y=0.01;sA.add(road);
  for(let z=10;z>-80;z-=4){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.18,1.8),basic(0xf2f2f2));l.rotation.x=-Math.PI/2;l.position.set(0,0.02,z);sA.add(l)}
  for(const s of[-1,1])for(let z=6;z>-70;z-=9){const h=10+r()*10;const b=makeBuilding(r,6,h,7,{lit:0});b.position.set(s*8.5,h/2,z);sA.add(b)}
  for(const s of[-1,1])for(let z=8;z>-60;z-=7)tree(sA,s*4.6,z,0.9);
  const van=new THREE.Group();const vb=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.4,3.6),lamb(0xf2f2f2));vb.position.y=0.95;van.add(vb);
  const vs=new THREE.Mesh(new THREE.BoxGeometry(1.72,0.25,3.62),lamb(0x3a7bd5));vs.position.y=0.75;van.add(vs);
  const vw=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.5,0.05),lamb(0x2c3e5c));vw.position.set(0,1.35,1.81);van.add(vw);
  for(const [x,ry] of[[-0.4,0.5],[0.4,-0.5]]){const hn=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.08,0.6,14,1,true),new THREE.MeshLambertMaterial({color:0xe8e8e8,side:THREE.DoubleSide}));hn.rotation.x=Math.PI/2;hn.rotation.z=ry;hn.position.set(x,1.95,0.6);van.add(hn)}
  const pole=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.3,0.1),lamb(0x777777));pole.position.set(0,1.75,0.6);van.add(pole);
  for(const x of[-0.7,0.7])for(const z of[-1.1,1.1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.2,14),lamb(0x222222));w.rotation.z=Math.PI/2;w.position.set(x,0.34,z);van.add(w)}
  van.position.set(-1.6,0,-7);sA.add(van);
  const rings=[];for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.03,6,30),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.6}));sA.add(m);rings.push(m)}
  // C: 아파트 단면
  const sC=new THREE.Scene();addLights(sC,{hemi:1.5,dir:1.0});const AP=apt(sC,r,{cut:true,cols:2,rows:4});
  // D: 텅 빈 대피소
  const sD=new THREE.Scene();addLights(sD,{hemi:1.6,dir:0.8});
  const gf=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(0xd2a873));gf.rotation.x=-Math.PI/2;sD.add(gf);
  const gw=new THREE.Mesh(new THREE.PlaneGeometry(30,9),lamb(0xe8e2d6));gw.position.set(0,4.5,-7);sD.add(gw);
  for(const s of[-1,1]){const sw=new THREE.Mesh(new THREE.PlaneGeometry(30,9),lamb(0xdcd5c8));sw.rotation.y=-s*Math.PI/2;sw.position.set(s*8,4.5,0);sD.add(sw)}
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const m=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.12,2.0),lamb(0x6f9fd8));m.position.set((i-1.5)*2.4,0.06,-5+j*2.8);sD.add(m);
    const bl=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.18,0.5),lamb(pick(r,[0xf2e6c8,0xe8d0d8,0xd0e0f0])));bl.position.set(m.position.x,0.21,m.position.z+0.55);sD.add(bl);
    const pl=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.12,0.3),lamb(0xffffff));pl.position.set(m.position.x,0.18,m.position.z-0.7);sD.add(pl)}
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.8,1.0),new THREE.MeshBasicMaterial({map:canvasTex(960,200,(c,w,h)=>{c.fillStyle='#2f6f4f';c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font=`900 120px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText('임시 대피소',w/2,h/2+6)})}));sg.position.set(0,3.3,-6.95);sD.add(sg);
  const C=cam(50);const ch=chip('3일 후');const fl=div('flash');
  const AV=['#9cb4d8','#d8b49c','#a8c8a0','#c8a8c8','#b8b8b8'];
  const kp=div('kp',`<div class="screen"><div class="head">동네 친구들 <small>6</small></div><div class="inner">
   <div class="row r1"><div class="av" style="background:${AV[0]}"></div><div><div class="who">민수</div><div class="b">야 좀비 사태래</div></div><div class="un">5</div></div>
   <div class="row r2"><div class="av" style="background:${AV[1]}"></div><div><div class="who">지훈</div><div class="b">아 그래?</div></div><div class="un">5</div></div>
   <div class="row r3"><div class="av" style="background:${AV[2]}"></div><div><div class="who">현우</div><div class="b">우리 집 모일 사람?</div></div><div class="un u3">5</div></div>
   </div><div class="inp"><div class="box">메시지 입력</div></div></div>`);
  const R=[...kp.querySelectorAll('.row')],U=[...kp.querySelectorAll('.un')];
  const st1=div('stat','<div><small>읽음</small><b style="color:#2b2b3a">5</b></div><div><small>답장</small><b>0</b></div>');st1.style.top='820px';
  const st2=div('stat','<div><small>대피소 이용자</small><b>0명</b></div>');
  return t=>{
    const TC=E.chat,TR=E.read,TX=E.cross,TH=E.shelter;let sc;
    if(t<TX){sc=sA;van.position.z=-8+t*0.45;const k=ease(t/TX);C.fov=50;C.position.set(2.2,1.5,3.5-k*0.8);C.lookAt(-1.0,1.9,-7);
      rings.forEach((m,i)=>{const p=((t*0.9+i*0.25)%1);m.position.set(van.position.x,1.95,van.position.z+0.95+p*2.2);m.scale.setScalar(0.6+p*2.4);m.material.opacity=0.55*(1-p)*(t>at(1,'b1')-0.2?1:0)})}
    else if(t<TH){sc=sC;const k=ease((t-TX)/(TH-TX));C.fov=50;C.position.set(0,AP.Ht*0.5,12+k*4);C.lookAt(0,AP.Ht*0.5-0.6,-1);
      AP.rooms.forEach(rm=>{const u=rm.p.userData;if(rm.act==='ramen'){u.head.rotation.x=0.3+Math.sin(t*5+rm.c)*0.08}if(rm.act==='game'){u.arms.forEach(a=>a.rotation.x=-1.1+Math.sin(t*14+rm.r)*0.05)}})}
    else{sc=sD;const k=ease((t-TH)/2.5);C.fov=55;C.position.set(0,3.2-k*0.6,9-k*2);C.lookAt(0,1.4,-4)}
    renderer.setClearColor(0x000000,0);setSky('#8fc4f2','#d8ecff 70%');renderer.render(sc,C);
    chipPop(ch,t,0.1);ch.style.opacity=t<TX?1:0;
    sh(kp,false);if(false){const k=ease((t-TC)/0.3);kp.style.transform=`translateY(${(1-k)*1100}px)`;
      [E.m1,E.m2,E.m3].forEach((t0,i)=>{R[i].style.visibility=t>=t0?'visible':'hidden';R[i].style.transform=`scale(${pop((t-t0)/0.22)})`;R[i].style.transformOrigin='left bottom'});
      U.forEach((u,i)=>{const t0=[E.m1,E.m2,E.m3][i];const n=Math.max(0,5-Math.floor(clamp01((t-t0-0.25)/0.7)*5.99));u.textContent=n?n:'';})}
    sh(st1,false);
    sh(st2,t>=TH+0.3);if(t>=TH+0.3)popEl(st2,t,TH+0.3,'translateX(-50%)');
    cutFlash(fl,t,TX);
    caption(1,t)};
};

// ===== 2. 현관: 문 긁는 좀비 + 박동 → '엄마' 전화, 화면만 켜짐(무음 3년째) → 3초 통화(위아래 분할) → 문밖 좀비 '…으어?' 지나감 =====
S[2]=()=>{
  const E=EV(2);const r=rng(621);
  // 내 방 (밤)
  const sA=new THREE.Scene();sA.add(new THREE.HemisphereLight(0xc8c0ff,0x4a4058,1.9));{const d=new THREE.DirectionalLight(0xffe2c0,0.7);d.position.set(-2,4,5);sA.add(d)}
  const rb=roomBox(sA,{floor:0x8a7360,wall:0x5d5a7a,wall2:0x534f70});
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(14,6),lamb(0x534f70));rw.rotation.y=-Math.PI/2;rw.position.set(3.2,3,0);sA.add(rw);
  const door=door3(sA,1.45,-2.93,0);door.userData.d.children[0].material=lamb(0x6a5a4a);
  const sofa=new THREE.Group();const sb=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.45,0.9),lamb(0x4a6a7a));sb.position.y=0.3;sofa.add(sb);const sbk=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.7,0.25),lamb(0x42606e));sbk.position.set(0,0.75,-0.35);sofa.add(sbk);
  for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.55,0.9),lamb(0x42606e));a.position.set(s*1.25,0.5,0);sofa.add(a)}sofa.position.set(-0.6,0,-1.6);sA.add(sofa);
  const tbl=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.4,0.7),lamb(0x7a5a40));tbl.position.set(-0.6,0.2,-0.2);sA.add(tbl);
  const bw=bowl();bw.position.set(-1.0,0.47,-0.2);sA.add(bw);
  const callT=canvasTex(480,840,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2e3a58');g.addColorStop(1,'#151a28');c.fillStyle=g;c.fillRect(0,0,w,h);c.textAlign='center';
    c.fillStyle='#8a96b8';c.beginPath();c.arc(w/2,200,80,0,7);c.fill();c.fillStyle='#d8def0';c.beginPath();c.arc(w/2,180,30,0,7);c.fill();c.beginPath();c.arc(w/2,250,50,Math.PI,0);c.fill();
    c.fillStyle='#fff';c.font=`900 130px ${FONT}`;c.fillText('엄마',w/2,430);c.font=`800 50px ${FONT}`;c.fillStyle='#c8d0e8';c.fillText('수신 전화',w/2,500);
    c.fillStyle='#e2332d';c.beginPath();c.arc(130,700,66,0,7);c.fill();c.fillStyle='#2ec46a';c.beginPath();c.arc(350,700,66,0,7);c.fill();
    c.fillStyle='#fff';c.font=`800 40px ${FONT}`;c.fillText('거절',130,800);c.fillText('응답',350,800)});
  const tph=myPhone(0x111111);tph.rotation.x=-Math.PI/2;tph.position.set(-0.25,0.42,-0.15);sA.add(tph);
  const scrOn=new THREE.MeshBasicMaterial({map:callT}),scrOff=basic(0x0b0b10);
  const glow=glowSprite('rgba(170,200,255,1)',0.55);glow.material.opacity=0.25;glow.position.set(-0.25,0.43,-0.15);sA.add(glow);
  const me=istp(r,{shirt:0x3d4a5c});me.position.set(-0.3,0,-1.55);sitPose(me);sA.add(me);
  // 엄마 집 (따뜻)
  const sM=new THREE.Scene();warmLights(sM);room(sM,{wall:0xe8d8c0,wall2:0xdcc8b0,floor:0xb89a7a});
  const ms=new THREE.Group();const msb=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.45,0.9),lamb(0xb06a5a));msb.position.y=0.3;ms.add(msb);const msk=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.7,0.25),lamb(0x9a5a4a));msk.position.set(0,0.75,-0.35);ms.add(msk);ms.position.set(0,0,-1.6);sM.add(ms);
  const mom=momP(r);mom.position.set(0.3,0,-1.55);sitPose(mom);sM.add(mom);
  const tv=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.95,0.08),lamb(0x222228));tv.position.set(-2.6,1.4,0.6);tv.rotation.y=Math.PI/2+0.4;sM.add(tv);
  const tvs=new THREE.Mesh(new THREE.PlaneGeometry(1.45,0.82),basic(0x8fd3ff));tvs.position.set(-2.55,1.4,0.62);tvs.rotation.y=Math.PI/2+0.4;sM.add(tvs);
  // 복도 (문 밖)
  const sH=new THREE.Scene();sH.add(new THREE.HemisphereLight(0xd8e0c8,0x4a4a40,1.3));{const d=new THREE.DirectionalLight(0xfff0d0,0.6);d.position.set(2,5,6);sH.add(d)}
  const hf=new THREE.Mesh(new THREE.PlaneGeometry(10,40),lamb(0x8a8a82));hf.rotation.x=-Math.PI/2;sH.add(hf);
  const hw=new THREE.Mesh(new THREE.PlaneGeometry(40,4),lamb(0xb8b4a8));hw.position.set(0,2,-1.2);sH.add(hw);
  const hd=door3(sH,0,-1.15,0);hd.userData.d.children[0].material=lamb(0x6a5a4a);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.2),new THREE.MeshBasicMaterial({map:canvasTex(250,100,(c,w,h)=>{c.fillStyle='#fff';c.fillRect(0,0,w,h);c.fillStyle='#333';c.font=`900 70px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText('703',w/2,h/2+3)})}));pl.position.set(0,2.4,-1.06);sH.add(pl);
  const hl=new THREE.PointLight(0xfff0c0,4,6,1.5);hl.position.set(0,3.2,0.5);sH.add(hl);
  const Zh=zombie(r);Zh.position.set(0.35,0,-0.75);sH.add(Zh);const bZ=bubZ(Zh,'…으어?',{size:0.0024});
  const bM={m1:bubI(mom,'살아 있냐.',{y:1.75,size:0.0036}),m2:bubI(mom,'밥은.',{y:1.75,size:0.0036}),m3:bubI(mom,'그래.',{y:1.75,size:0.0036})};
  const bH={h1:bubI(me,'어.',{y:1.75,size:0.0036}),h2:bubI(me,'먹음.',{y:1.75,size:0.0036})};
  const C=cam(50),Ctop=cam(50,W/(H/2)),Cbot=cam(50,W/(H/2));
  const vig=div('vig');const fl=div('flash');
  const ch=chip('무음 모드: 3년째',170);ch.style.background='#2b2b3a';ch.style.color='#ffd84d';
  const ch2=chip('안부 확인: 3초',330);ch2.style.background='#2b2b3a';ch2.style.color='#ffd84d';
  const sl=div('splitline');const w1=div('who2','엄마');w1.style.top='40px';const w2=div('who2','나');w2.style.top='1000px';
  const cu=div('callui','통화 중 <i>00:00</i>');cu.style.top='860px';const cuT=cu.querySelector('i');
  return t=>{
    const TR=E.ring,TA=E.answer,TH=E.hang,TP=E.pass;
    // 문 흔들림(긁을 때)
    const sk=t<TP+0.4?Math.sin(t*31)*0.004*(0.5+0.5*Math.sin(t*3.1)):0;door.userData.d.rotation.y=sk*3;
    sitPose(me);holdPhone(me,t<TA?0:0,0.1);me.userData.head.rotation.x=0.05;
    const lit=t>=TR&&t<TA;tph.userData.scr.material=lit?scrOn:scrOff;glow.visible=lit;
    if(t>=TA){phoneEar(me,1);tph.visible=false}else{tph.visible=true;me.userData.arms.forEach(a=>{a.rotation.x=-0.6;a.rotation.z=0});if(me.userData.eph)me.userData.eph.visible=false}
    if(t>=TH+0.3){me.userData.arms[1].rotation.x=-1.2;me.userData.arms[1].rotation.z=0;if(me.userData.eph)me.userData.eph.visible=false}
    sitPose(mom);phoneEar(mom,t<TH?1:0);if(t>=TH){mom.userData.arms[1].rotation.x=-0.8;mom.userData.arms[1].rotation.z=0}
    mom.userData.head.rotation.y=t<TH?0:-0.8*ease((t-TH)/0.3);
    Object.entries(bM).forEach(([k,b])=>show(b,t,at(2,k),endOf(2,k,0.15)));Object.entries(bH).forEach(([k,b])=>show(b,t,at(2,k),endOf(2,k,0.15)));
    renderer.setClearColor(0x000000,0);
    const split=t>=at(2,'m1')-0.3&&t<TH+0.55;
    sh(sl,split);sh(w1,split);sh(w2,split);sh(cu,split&&t<TH);
    if(split){setSky('#2a2840','#2a2840');renderer.setScissorTest(true);
      renderer.setViewport(0,H/2,W,H/2);renderer.setScissor(0,H/2,W,H/2);Ctop.position.set(0.3,1.75,2.7);Ctop.lookAt(0.3,1.3,-1.5);renderer.render(sM,Ctop);
      renderer.setViewport(0,0,W,H/2);renderer.setScissor(0,0,W,H/2);Cbot.position.set(-0.3,1.75,2.7);Cbot.lookAt(-0.3,1.3,-1.5);renderer.render(sA,Cbot);
      renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);
      const sec=Math.max(0,Math.floor(t-at(2,'m1')+0.3));cuT.textContent=`00:0${Math.min(9,sec)}`}
    else if(t>=TH+0.55){setSky('#2a2c26','#4a4a40');const k=ease((t-TH-0.55)/3);C.fov=50;C.position.set(0.9,1.6,3.6-k*0.8);C.lookAt(0.1,1.3,-1);zPose(Zh,t,0);
      const zu=Zh.userData;const tz=t-(TP+0.5);if(tz<0){Zh.rotation.y=Math.PI*0.9;zu.head.rotation.z=0.5}else{Zh.rotation.y=Math.PI*0.9-Math.min(1,tz)*Math.PI*0.4;Zh.position.x=0.35+Math.max(0,tz-0.4)*0.9;zPose(Zh,t,tz>0.4?1:0)}
      show(bZ,t,at(2,'z2'),endOf(2,'z2',0.5));renderer.render(sH,C)}
    else{setSky('#1e1c30','#2e2a48');
      if(t>=TR&&t<TA){const k=ease((t-TR)/2.5);C.fov=34;C.position.set(-0.25,1.25-k*0.12,0.3);C.lookAt(-0.25,0.38,-0.06)}
      else{const k=ease(t/TR);C.fov=52;C.position.set(0.4,2.1,5.6-k*0.9);C.lookAt(0.4,1.15,-1.5)}
      renderer.render(sA,C)}
    vig.style.opacity=t<TR+0.1?(0.25+0.75*beatPulse(2,t)):0;
    cutFlash(fl,t,TH+0.55);
    chipPop(ch,t,at(2,'n4',2.3));ch.style.opacity=t>at(2,'n4',2.3)&&t<TA?1:0;
    chipPop(ch2,t,TH+0.05);ch2.style.opacity=t>TH+0.05&&t<TH+0.55?1:0;if(t>TH+0.55)ch2.style.opacity=0;
    caption(2,t)};
};

// ===== 3. 재택 화상회의: 팀장 '카메라 좀 켜 주세요' → 12칸 다 검은 화면 → 김 대리 칸만 켜지는데 좀비 '으어어어!!' → '…김 대리님만 열정 있네요' → 이달의 우수사원 =====
S[3]=()=>{
  const E=EV(3);const r=rng(651);
  const sT=new THREE.Scene();warmLights(sT);room(sT,{wall:0xd8d0c0,wall2:0xccc2b0,floor:0x9a8068});
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.4,0.3),lamb(0x8a6a4e));shelf.position.set(0.9,1.5,-2.6);sT.add(shelf);
  for(let i=0;i<6;i++){const bk=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.4,0.22),lamb(pick(r,[0xc0504d,0x4f81bd,0x9bbb59,0xf2c14e])));bk.position.set(0.35+i*0.2,1.75,-2.5);sT.add(bk)}
  const boss=istp(r,{shirt:0x5a6270});boss.position.set(0,0,-0.9);sitPose(boss);sT.add(boss);
  const dsk=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,0.7),lamb(0x7a5a40));dsk.position.set(0,0.95,-0.1);sT.add(dsk);
  const cT=cam(38,320/200);
  const sK=new THREE.Scene();sK.add(new THREE.HemisphereLight(0x9fb8a8,0x302828,1.3));{const d=new THREE.DirectionalLight(0xc8ffd8,0.8);d.position.set(0,2,4);sK.add(d)}
  room(sK,{wall:0x3e4c4a,wall2:0x364442,floor:0x3a3430});
  const post=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.8),lamb(0x8a7a5a));post.position.set(-1.0,1.7,-2.9);sK.add(post);
  const zk=zombie(r);zk.position.set(0,0,-0.9);sK.add(zk);
  const dk=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,0.7),lamb(0x4a3a30));dk.position.set(0,0.95,-0.1);sK.add(dk);
  const cK=cam(38,320/200);
  const NM=['박 팀장','이 주임','최 사원','정 과장','윤 대리','한 사원','오 주임','김 대리','서 대리','강 사원','임 과장','조 사원'];
  const IC2=['#6b7a99','#7a8a6b','#99806b','#8a6b99','#6b998e','#996b7a'];
  const bar=div('mbar','<span>재택근무 · 오전 회의</span><span><i>●</i> REC 12명</span>');
  const tiles=NM.map((n,i)=>{const d=div('tile',`<div class="ini" style="background:${IC2[i%6]}">${n[0]}</div><div class="nm">${n}</div><div class="mu">음소거</div>`);return d});
  const bot=div('mbot','<b></b><b></b><b class="red"></b>');
  const aw=div('stat','<div><small>이달의 우수사원</small><b style="color:#d89a00">김 대리</b></div>');aw.style.top='1080px';
  const fl=div('flash');
  const TR=i=>[45+(i%3)*335,270+Math.floor(i/3)*215,320,200];
  const BIG=[45,270,990,640];
  const lerpR=(A,B,k)=>A.map((v,i)=>v+(B[i]-v)*k);
  function place(el,R){el.style.left=R[0]+'px';el.style.top=R[1]+'px';el.style.width=R[2]+'px';el.style.height=R[3]+'px'}
  function rview(sc,C,R){C.aspect=R[2]/R[3];C.updateProjectionMatrix();renderer.setViewport(R[0],H-R[1]-R[3],R[2],R[3]);renderer.setScissor(R[0],H-R[1]-R[3],R[2],R[3]);renderer.render(sc,C)}
  return t=>{
    const TG=E.grid,TC=E.camon,TB=E.big,TA=E.award;
    // 팀장 칸
    let RB=t<TG?BIG:lerpR(BIG,TR(0),ease((t-TG)/0.35));if(t>=TB)RB=lerpR(TR(0),[700,780,320,200],ease((t-TB)/0.4));
    let RK=TR(7);if(t>=TB)RK=lerpR(TR(7),BIG,ease((t-TB)/0.4));
    tiles.forEach((d,i)=>{let R=TR(i);if(i===0)R=RB;if(i===7)R=RK;place(d,R);
      const appear=i===0?1:pop((t-TG-i*0.05)/0.2);d.style.transform=`scale(${appear})`;d.style.opacity=(i===0||i===7)?1:(t<TB?clamp01((t-TG-i*0.05)/0.1):clamp01(1-(t-TB)/0.3));
      const live=i===0||(i===7&&t>=TC);d.classList.toggle('live',live);d.querySelector('.ini').style.display=live?'none':'flex';d.querySelector('.mu').style.display=live?'none':'block'});
    tiles[0].style.zIndex=5;
    // 3D
    renderer.setClearColor(0x000000,0);setSky('#15171f','#15171f');renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.clear();renderer.setScissorTest(true);
    const bu=boss.userData;sitPose(boss);bu.arms.forEach(a=>{a.rotation.x=-1.3;a.rotation.z=0});bu.head.rotation.x=t>=at(3,'t2')-0.3?0.15:0.05;
    if(t>=TC){const zu=zk.userData;zPose(zk,t,0);sitPose(zk);zu.arms[0].rotation.x=-1.75+Math.sin(t*6)*0.12;zu.arms[1].rotation.x=-1.85+Math.cos(t*6)*0.12;zu.head.rotation.z=0.25+Math.sin(t*2)*0.08;
      cK.position.set(0,1.62,1.25);cK.lookAt(0,1.45,-0.9);rview(sK,cK,RK)}
    cT.position.set(0,1.6,1.3);cT.lookAt(0,1.45,-0.9);rview(sT,cT,RB);
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);
    cutFlash(fl,t,TC);if(t<TC)fl.style.background='transparent';
    sh(aw,t>=TA);if(t>=TA)popEl(aw,t,TA,'translateX(-50%)');
    caption(3,t)};
};

// ===== 4. 밤 서치라이트가 주인공 창문을 비춤 → 고개 까딱(최대 리액션) → '…반응 없음. 좀비로 판정.' → 헬기 떠나고 후루룩 → 1년 후 뉴스 '공식 생존자 0명' → 집집마다 그 뉴스 보며 라면 =====
S[4]=()=>{
  const E=EV(4);const r=rng(641);
  const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xb0b6ee,0x4a4660,1.5));{const d=new THREE.DirectionalLight(0xa8b4ff,0.6);d.position.set(-5,10,6);sc.add(d)}
  ground(sc,0x2e3040,300);
  const AP=apt(sc,r,{cols:4,rows:5,night:true,tvAll:true,actOf:(c,rr)=>c===1&&rr===2?'hero':'ramen'});
  const HR=AP.rooms.find(rm=>rm.act==='hero');const TVNEW=AP.rooms[0].tvm.material;const TVOFF=new THREE.MeshBasicMaterial({map:canvasTex(256,150,(c,w,h)=>{const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#7fb0e8');g.addColorStop(1,'#c8a0e0');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(w*0.3,h*0.6,30,0,7);c.fill()})});
  // 주인공: 창문 쪽을 보고 책상에서 라면
  const me=HR.p;me.position.set(0,0,0.15);me.rotation.y=0;sitPose(me);me.position.y=-0.05;me.scale.setScalar(0.9);
  const chair=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.5),lamb(0x4a4a58));chair.position.set(0,0.22,0.1);HR.g.add(chair);me.position.y=0.17;
  const desk=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.08,0.55),lamb(0x8a6a4e));desk.position.set(0,0.72,0.72);HR.g.add(desk);
  const bw=bowl();bw.position.set(0,0.82,0.62);HR.g.add(bw);
  AP.rooms.forEach(rm=>{if(rm!==HR&&rm.p.userData.bowl){}});
  // 엔딩용: 방마다 각자 노는 모습 (TV·게임·먹기·폰)
  const GAMET=new THREE.MeshBasicMaterial({map:canvasTex(256,150,(g,w,h)=>{g.fillStyle='#2b1f4a';g.fillRect(0,0,w,h);const cols=['#ff6b6b','#ffd84d','#5ad17a','#6bb8ff','#c38bff'];for(let i=0;i<14;i++){g.fillStyle=cols[i%5];g.fillRect(14+(i%7)*33,40+Math.floor(i/7)*36,28,28)}g.fillStyle='#fff';g.font=`900 26px ${FONT}`;g.fillText('STAGE 99',70,128)})});
  const ENDA=['tv','game','eat','phone'];
  AP.rooms.forEach((rm,i)=>{rm.end=rm===HR?'tv':ENDA[(i*3+1)%4];if(rm.end==='game'){const pad=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.06,0.14),lamb(0x222228));rm.p.userData.hip.add(pad);pad.position.set(0,0.28,0.42);pad.visible=false;rm.pad=pad}
    if(rm.end==='tv'){const sb=bowl();sb.scale.setScalar(0.9);rm.g.add(sb);sb.position.set(0.5,0.06,0.25);sb.visible=false;rm.snack=sb}});
  const hel=heliM();sc.add(hel);const res=hel.userData.res;
  const SL=searchCone(sc);const room0={x:HR.x,y:HR.y+1.1};
  const hlite=glowSprite('rgba(255,250,220,1)',1.8);hlite.material.opacity=0.28;hlite.position.set(HR.x,HR.y+1.4,-2.1);sc.add(hlite);
  const C=cam(50);const fl=div('flash');
  const ch=chip('주인공 최대 리액션',330);ch.style.background='#2b2b3a';ch.style.color='#ffd84d';
  const bino=div('bino','<svg width="1080" height="1920"><defs><radialGradient id="vg"><stop offset="70%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,.6)"/></radialGradient><mask id="bm2"><rect width="1080" height="1920" fill="#000"/><circle cx="370" cy="860" r="350" fill="#fff"/><circle cx="710" cy="860" r="350" fill="#fff"/></mask><mask id="bm"><rect width="1080" height="1920" fill="#fff"/><circle cx="370" cy="860" r="350" fill="#000"/><circle cx="710" cy="860" r="350" fill="#000"/></mask></defs><rect width="1080" height="1920" fill="#0b0b12" mask="url(#bm)"/><rect width="1080" height="1920" fill="url(#vg)" mask="url(#bm2)"/><line x1="540" y1="700" x2="540" y2="1020" stroke="rgba(255,255,255,.35)" stroke-width="4"/><line x1="380" y1="860" x2="700" y2="860" stroke="rgba(255,255,255,.35)" stroke-width="4"/></svg>');
  const zst=div('zst','좀비');
  const chs=chip('야간 생존자 수색',170);chs.style.background='#2b2b3a';chs.style.color='#ffd84d';
  const yr=div('yr out','1년 후');
  // 1년 후: 어깨 너머 TV
  const sTV=new THREE.Scene();sTV.add(new THREE.HemisphereLight(0xb8b0d8,0x403850,1.4));{const d=new THREE.DirectionalLight(0xffe0c0,0.5);d.position.set(2,4,4);sTV.add(d)}
  room(sTV,{wall:0x5e5a7a,wall2:0x545070,floor:0x6a5848});
  const bigTV=new THREE.Mesh(new THREE.BoxGeometry(2.5,1.5,0.1),lamb(0x1d1d24));bigTV.position.set(0,1.55,-2.85);sTV.add(bigTV);
  const bigS=new THREE.Mesh(new THREE.PlaneGeometry(2.36,1.38),new THREE.MeshBasicMaterial({map:canvasTex(1024,600,(c2,w,h)=>{c2.fillStyle='#1a1d2e';c2.fillRect(0,0,w,h);c2.fillStyle='#e2332d';c2.fillRect(36,30,170,70);c2.fillStyle='#fff';c2.font=`900 52px ${FONT}`;c2.fillText('LIVE',58,84);c2.textAlign='center';c2.fillStyle='#c8d0ff';c2.font=`800 74px ${FONT}`;c2.fillText('좀비 사태 1년',w/2,240);c2.fillStyle='#ffd84d';c2.font=`900 128px ${FONT}`;c2.fillText('공식 생존자 0명',w/2,420);c2.fillStyle='#ffd84d';c2.fillRect(0,h-90,w,90);c2.fillStyle='#222';c2.font=`900 46px ${FONT}`;c2.fillText('정부 "생존자 확인 안 됨"',w/2,h-30)})}));bigS.position.set(0,1.55,-2.79);sTV.add(bigS);
  const tglow=new THREE.PointLight(0x8fb0ff,3,6,1.5);tglow.position.set(0,1.5,-1.8);sTV.add(tglow);
  const sof=new THREE.Group();const sfb=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.45,0.9),lamb(0x4a6a7a));sfb.position.y=0.3;sof.add(sfb);const sfk=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.45,0.22),lamb(0x42606e));sfk.position.set(0,0.65,0.4);sof.add(sfk);sof.position.set(0,0,0.6);sTV.add(sof);
  const me2=istp(rng(77),{shirt:0x3d4a5c});me2.position.set(-0.3,0,0.5);me2.rotation.y=Math.PI;sitPose(me2);sTV.add(me2);
  const bw2=bowl();me2.userData.hip.add(bw2);bw2.position.set(0,0.3,0.45);
  const CT=cam(50);
  const real=div('stat','<div><small>공식 생존자</small><b>0명</b></div><div><small>실제 생존자</small><b style="color:#2a9d5c">전 국민</b></div>');real.style.top='300px';
  const tvd=div('tv','<div class="live">LIVE</div><div class="hd">좀비 사태 1년</div><div class="big">공식 생존자 0명</div><div class="tick">&nbsp;&nbsp;정부 "생존자 확인 안 됨" · 전국 아파트 창문 불빛은 매일 켜져 있어… · 라면 판매량 역대 최고</div>');
  const tick=tvd.querySelector('.tick');
  const dim=div('flash');const e1=div('end1 out','다음 좀비편은?'),e2=div('end2 out','팔로우하고 기다려 주세요');
  return t=>{
    const TLd=E.land,TN=E.nod,TRd=E.radio,TL=E.leave,TSl=E.slurp,TY=E.year,TP=E.pull,TE=E.end,C2=at(4,'c2');
    AP.rooms.forEach(rm=>{if(rm.tvm)rm.tvm.material=t<TY?TVOFF:TVNEW});
    spinHeli(hel,t);
    // 주인공
    const u=me.userData;sitPose(me);u.arms.forEach(a=>{a.rotation.x=-1.25;a.rotation.z=0});
    const eating=t<TN-0.9||t>TSl-0.2;u.head.rotation.x=eating?0.32+Math.sin(t*6)*0.06:-0.05;nod(me,t,TN);
    if(t>TSl-0.2&&t<TSl+0.6)u.head.rotation.x=0.25+Math.sin((t-TSl)*20)*0.05;
    // 헬기·서치라이트
    const hpos=new THREE.Vector3(HR.x+4,HR.y+6.5,10);hel.position.copy(hpos);hel.rotation.y=1.88;
    let tgt;if(t<TLd-0.1){const k=clamp01(t/(TLd-0.1));const ke=ease(k);tgt=new THREE.Vector3(-AP.Wt/2+1.2+(HR.x+AP.Wt/2-1.2)*ke+Math.sin(k*Math.PI*3)*1.6*(1-ke),HR.y+1.1+Math.sin(k*Math.PI*2+0.6)*2.4*(1-ke),0)}else tgt=new THREE.Vector3(HR.x,HR.y+1.1,0);
    const away=clamp01((t-TL)/1.4);if(away>0){hel.position.x+=away*14;hel.position.y+=away*4;tgt.x+=away*10}
    aimCone(SL,hel.position.clone().add(new THREE.Vector3(0,-1,0)),tgt);const lon=t<TL+1.0;SL.cone.visible=lon;SL.spot.visible=lon;hlite.visible=t>TLd&&t<TL+0.3;
    let mode;if(t<TLd)mode='wide';else if(t<TRd)mode='win';else if(t<TL)mode='res';else if(t<TL+1.0)mode='wideL';else if(t<TY)mode='win';else if(t<TP)mode='tv';else mode='pull';
    renderer.setClearColor(0x000000,0);setSky('#141a3a','#3a3f72 80%');
    if(mode==='wideL'){C.fov=50;C.position.set(HR.x*0.3+1.4,HR.y+1.5,28);C.lookAt(HR.x*0.3+3.0,HR.y+3.0,0);renderer.render(sc,C)}
    else if(mode==='tv'){const k=ease((t-TY-0.75)/3.5);const u2=me2.userData;sitPose(me2);u2.arms.forEach(a=>{a.rotation.x=-1.2;a.rotation.z=0});u2.head.rotation.x=-0.05+Math.sin(t*5)*0.04*(Math.sin(t*1.3)>0.3?1:0);
      CT.fov=52;CT.updateProjectionMatrix();CT.position.set(0.05,2.35,3.2-k*0.35);CT.lookAt(-0.1,1.15,-2.4);setSky('#2a2840','#2a2840');renderer.render(sTV,CT)}
    else if(mode==='wide'){const k=ease(t/TLd);C.fov=50;C.position.set(HR.x*0.3+1.4,HR.y+1.5,30-k*2);C.lookAt(HR.x*0.3+1.4,HR.y+2.4,0);renderer.render(sc,C)}
    else if(mode==='win'){const k=ease((t-TLd)/(TRd-TLd));C.fov=42;C.position.set(HR.x+0.25,HR.y+1.25,3.3-k*0.5);C.lookAt(HR.x,HR.y+0.95,-1.2);if(t>=TL){C.position.set(HR.x+0.2,HR.y+1.2,2.6);C.lookAt(HR.x,HR.y+0.9,-1.2)}renderer.render(sc,C)}
    else if(mode==='res'){const sw=Math.sin(t*2.3)*0.04;C.fov=7;C.position.set(HR.x+2.5,HR.y+2.2,24);C.lookAt(HR.x+sw,HR.y+1.25+Math.cos(t*1.7)*0.03,-0.9);hlite.visible=false;C.updateProjectionMatrix();renderer.render(sc,C);C.fov=50;C.updateProjectionMatrix()}
    else if(mode==='pull'){chair.visible=false;desk.visible=false;bw.visible=false;
      AP.rooms.forEach(rm=>{const p=rm.p,u3=p.userData;sitPose(p);u3.arms.forEach(a=>{a.rotation.z=0});if(u3.ph)u3.ph.visible=false;if(rm.pad)rm.pad.visible=false;if(rm.snack)rm.snack.visible=false;
        const tb=u3.tbl,bl=u3.bowl;if(tb)tb.visible=false;if(bl)bl.visible=false;const ph=t*5+rm.c*1.3+rm.r*0.7;
        if(rm.end==='tv'){p.rotation.y=Math.PI;p.position.set(0,-0.36,0.35);u3.arms.forEach(a=>a.rotation.x=-0.5);u3.arms[1].rotation.x=-0.9+Math.max(0,Math.sin(ph*0.6))*0.6;u3.head.rotation.x=0;if(rm.snack)rm.snack.visible=true}
        else if(rm.end==='game'){p.rotation.y=Math.PI;p.position.set(0,-0.36,0.35);u3.arms.forEach((a,j)=>a.rotation.x=-1.05+Math.sin(ph*3+j)*0.08);u3.head.rotation.x=-0.05;rm.pad.visible=true;if(rm.tvm)rm.tvm.material=GAMET;p.position.x=Math.sin(ph*0.8)*0.05}
        else if(rm.end==='eat'){p.rotation.y=0;p.position.set(0,-0.36,0.1);if(tb)tb.visible=true;if(bl){bl.visible=true;bl.position.set(0,0.42,0.72)}u3.arms.forEach(a=>a.rotation.x=-1.2);u3.head.rotation.x=0.3+Math.sin(ph)*0.1}
        else{p.rotation.y=0;p.position.set(0,-0.36,0.1);holdPhone(p,1);u3.head.rotation.x=0.38+Math.sin(ph*0.5)*0.05}});
      me.scale.setScalar(0.9);
      const k=ease((t-TP)/3.4);C.fov=50;C.position.set(HR.x+0.3+k*0.2,HR.y+1.75+k*0.2,2.4+k*12);C.lookAt(HR.x+k*0.3,HR.y+1.1-k*0.6,-1.4);
      AP.rooms.forEach(rm=>{if(rm!==HR){const uu=rm.p.userData;uu.head.rotation.x=0.25+Math.sin(t*5+rm.c+rm.r)*0.08}});renderer.render(sc,C)}
    else{renderer.render(sc,C)}
    cutFlash(fl,t,TRd);
    sh(bino,mode==='res');const TZ=at(4,'c2',0.95);sh(zst,mode==='res'&&t>=TZ);if(t>=TZ){const k=pop((t-TZ)/0.22);zst.style.transform=`translate(-50%,-50%) rotate(-12deg) scale(${2.2-1.2*Math.min(1,k)})`;zst.style.opacity=clamp01((t-TZ)/0.06)}
    chipPop(ch,t,TN+0.1);ch.style.opacity=t>TN+0.1&&t<TRd?1:0;chipPop(chs,t,0.15);chs.style.opacity=t<TLd?1:0;
    sh(yr,t>=TY&&t<TY+0.75);
    sh(tvd,false);sh(real,t>=E.real&&t<TE);if(t>=E.real)popEl(real,t,E.real,'translateX(-50%)');
    dim.style.background=`rgba(10,10,25,${0.55*clamp01((t-TE)/0.3)})`;popEl(e1,t,TE);popEl(e2,t,TE+0.25);sh(e1,t>=TE);sh(e2,t>=TE);
    caption(4,t)};
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
