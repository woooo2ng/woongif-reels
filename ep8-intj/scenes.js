// ---------- INTJ 편 공용 ----------
const S=[];
function addFace(p){const h=p.userData.head;
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.013,4,10,Math.PI),basic(0x5a2a2a));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.016,0.01),basic(0x5a2a2a));fl.position.set(0,0.145,0.248);h.add(fl);
  p.userData.smile=sm;p.userData.flat=fl;setFace(p,false);return p}
function setFace(p,smile){p.userData.smile.visible=smile;p.userData.flat.visible=!smile}
function mkP(r,o={}){return addFace(makePerson(r,o))}
function greyHair(p){p.userData.head.children[1].material=lamb(0xdcdcdc);return p}
// 배터리 (모든 사람이 같은 텍스처를 공유)
function batteryTex(){
  const c=document.createElement('canvas');c.width=360;c.height=170;const ctx=c.getContext('2d');
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;let last=-1;
  t.draw=(pct,label='사회생활 모드 ON')=>{pct=Math.round(pct);if(pct===last)return;last=pct;ctx.clearRect(0,0,360,170);
    ctx.fillStyle='rgba(0,0,0,0.18)';rr(ctx,8,6,344,52,26);ctx.fill();ctx.fillStyle='#2a3570';rr(ctx,8,2,344,50,25);ctx.fill();
    ctx.fillStyle='#fff';ctx.font=`900 30px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,180,28);
    ctx.fillStyle='#fff';rr(ctx,40,66,262,94,18);ctx.fill();ctx.fillStyle='#2b2b3a';rr(ctx,46,72,250,82,14);ctx.fill();
    ctx.fillStyle='#fff';rr(ctx,304,94,20,38,6);ctx.fill();
    const col=pct>50?'#5fe08a':pct>20?'#ffd84d':'#ff5a5a';ctx.fillStyle=col;rr(ctx,54,80,Math.max(8,234*pct/100),66,10);ctx.fill();
    ctx.fillStyle=pct>20?'#1d2a1d':'#fff';ctx.font=`900 46px ${FONT}`;ctx.fillText(pct+'%',171,114);t.needsUpdate=true};
  return t}
function batterySprite(tex,k=0.0026){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.center.set(0.5,0);s.scale.set(360*k,170*k,1);s.userData.base=[360*k,170*k];return s}
function mkCat(col=0xf2a65a){const g=new THREE.Group();const m=lamb(col);
  const b=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.26,0.5),m);b.position.y=0.25;g.add(b);
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.18,12,9),m);h.position.set(0,0.46,0.27);g.add(h);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.ConeGeometry(0.065,0.13,4),m);e.position.set(s*0.1,0.62,0.27);g.add(e);
    const ey=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.05,0.02),lamb(0x1a1a1a));ey.position.set(s*0.065,0.49,0.44);g.add(ey);
    for(const z of[0.15,-0.15]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.14,0.07),m);l.position.set(s*0.1,0.07,z);g.add(l)}}
  const n=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.03,0.02),basic(0xff8fa8));n.position.set(0,0.44,0.45);g.add(n);
  const tl=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.42,6),m);tl.position.set(0,0.42,-0.3);tl.rotation.x=-0.7;g.add(tl);g.userData.tail=tl;return g}
function mkDog(col=0xd9b38c){const g=new THREE.Group();const m=lamb(col),dm=lamb(0x8a5a3a);
  const b=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.28,0.55),m);b.position.y=0.28;g.add(b);
  const h=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.28,0.28),m);h.position.set(0,0.5,0.3);g.add(h);
  const sn=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.12,0.12),lamb(0xf2e2c8));sn.position.set(0,0.44,0.48);g.add(sn);
  const no=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.05,0.03),lamb(0x1a1a1a));no.position.set(0,0.49,0.55);g.add(no);
  g.userData.ears=[];for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.2,0.1),dm);e.position.set(s*0.18,0.5,0.28);e.rotation.z=s*0.2;g.add(e);g.userData.ears.push(e);
    const ey=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.05,0.02),lamb(0x1a1a1a));ey.position.set(s*0.07,0.56,0.445);g.add(ey);
    for(const z of[0.17,-0.17]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.16,0.08),m);l.position.set(s*0.1,0.08,z);g.add(l)}}
  const tl=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.3,6),m);tl.position.set(0,0.48,-0.32);tl.rotation.x=-0.9;g.add(tl);g.userData.tail=tl;return g}
function sadDog(g){const ink=lamb(0x1a1a1a),wh=basic(0xffffff),tear=basic(0x7fc4ff);
  for(const s of[-1,1]){const ey=new THREE.Mesh(new THREE.BoxGeometry(0.075,0.09,0.02),ink);ey.position.set(s*0.075,0.545,0.452);g.add(ey);
    const hl=new THREE.Mesh(new THREE.BoxGeometry(0.028,0.028,0.01),wh);hl.position.set(s*0.075+0.016,0.565,0.465);g.add(hl);
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.018,0.02),ink);br.position.set(s*0.08,0.62,0.452);br.rotation.z=-s*0.45;g.add(br);
    const tr=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.06,0.01),tear);tr.position.set(s*0.075,0.49,0.462);g.add(tr);(g.userData.tears=g.userData.tears||[]).push(tr)}
  g.userData.ears.forEach((e,i)=>{const s=i?1:-1;e.rotation.z=s*0.55;e.position.y=0.44});
  if(g.userData.tail){g.userData.tail.rotation.x=0.5;g.userData.tail.position.y=0.36}
  return g}
function mkHam(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,12,9),lamb(0xf0c27a));b.scale.set(1,0.85,1.1);b.position.y=0.18;g.add(b);
  const w=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,8),lamb(0xfff4e0));w.position.set(0,0.13,0.12);g.add(w);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,6),lamb(0xe8a060));e.position.set(s*0.11,0.36,0.02);g.add(e);
    const ey=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.04,0.02),lamb(0x1a1a1a));ey.position.set(s*0.07,0.25,0.2);g.add(ey)}return g}
function mkPigeon(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.14,10,8),lamb(0x9aa0b0));b.scale.set(0.8,0.8,1.3);b.position.y=0.16;g.add(b);
  const hd=new THREE.Group();hd.position.set(0,0.3,0.14);g.add(hd);const h=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6),lamb(0x6f7690));hd.add(h);
  const bk=new THREE.Mesh(new THREE.ConeGeometry(0.02,0.06,4),lamb(0xe0a040));bk.rotation.x=Math.PI/2;bk.position.set(0,0,0.08);hd.add(bk);g.userData.hd=hd;return g}
function room(scene,x,y,w,h,d,wall,floorCol){
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(w,h),lamb(wall));bw.position.set(x,y+h/2,-d/2);scene.add(bw);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(w,0.12,d),lamb(floorCol||0xc8a27a));fl.position.set(x,y-0.06,0);scene.add(fl);
}
function heartSprite(size=0.006,col='#ff6f9c'){return textSprite('♥',120,col,size)}
function umbrella(col){const g=new THREE.Group();
  const c=new THREE.Mesh(new THREE.ConeGeometry(0.62,0.32,10,1,true),new THREE.MeshLambertMaterial({color:col,flatShading:true,side:THREE.DoubleSide}));c.position.y=1.05;g.add(c);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,1.05,5),lamb(0x444444));st.position.y=0.5;g.add(st);return g}
function stampEl(text,left,top,size,col,rot=-10){const el=document.createElement('div');el.className='stamp out';el.textContent=text;
  el.style.cssText+=`left:${left}px;top:${top}px;font-size:${size}px;color:${col};white-space:nowrap;opacity:0`;el.dataset.rot=rot;ui.appendChild(el);return el}
function stampPop(el,t,t0){el.style.opacity=clamp01((t-t0)/0.06);el.style.transform=`rotate(${el.dataset.rot}deg) scale(${t<t0?0:1+0.6*(1-pop((t-t0)/0.25))})`}
const SKINC=['#f3cfae','#ebb995','#dfa882'],HAIRC=['#2a2220','#4a3426','#1d1d24','#6b4a2f'],TILEC=['#3a4060','#41465f','#3b4a5e','#463e5c'];
function faceHTML(i,extra=''){const r=rng(900+i);return `<div class="face" style="background:${pick(r,SKINC)}"><div class="hair" style="background:${pick(r,HAIRC)}"></div><div class="eye" style="left:26px"></div><div class="eye" style="left:57px"></div><div class="mouth"></div>${extra}</div>`}
function bookHTML(i){const r=rng(950+i);const cols=['#ff7a9c','#7ac8ff','#9cf27a','#ffd84d'];
  let s='<div class="book" style="opacity:0">';for(let k=0;k<4;k++)s+=`<i style="top:${14+k*18}px;width:${50+r()*60}px"></i>`;
  for(let k=0;k<3;k++)s+=`<b style="left:${14+k*36}px;background:${cols[(i+k)%4]}"></b>`;return s+'</div>'}
function setEyes(root,dx,dy){root.querySelectorAll('.eye').forEach(e=>e.style.transform=`translate(${dx}px,${dy}px)`)}

// ---------- S0: 회식 — 웃는 얼굴 + 사회생활 배터리 (타이틀) ----------
S[0]=()=>{
  const bt=batteryTex();
  // A: 회식 자리
  const A=new THREE.Scene();addLights(A,{hemi:1.6,dir:1.2,sun:0xfff0d8,dpos:[3,10,8]});
  const r=rng(801);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xb98a62));fl.rotation.x=-Math.PI/2;A.add(fl);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(30,14),lamb(0xf2dcc0));wall.position.set(0,7,-9);A.add(wall);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.1,7.2),lamb(0x8a5a3a));tb.position.set(0,0.78,-3.1);A.add(tb);
  for(const x of[-0.6,0.6])for(const z of[0.3,-6.5]){const lg=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.78,0.1),lamb(0x6a4228));lg.position.set(x,0.39,z);A.add(lg)}
  const ppl=[];
  for(let i=0;i<4;i++)for(const s of[-1,1]){const z=-0.4-i*1.6+(s>0?0.35:0);
    const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.16,0.04,12),lamb(0xffffff));pl.position.set(s*0.42,0.85,z);A.add(pl);
    const gl=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.05,0.2,8),lamb(0xffd36a));gl.position.set(s*0.3,0.93,z-0.3);A.add(gl);
    const p=mkP(r);p.position.set(s*1.0,0,z);p.rotation.y=-s*(Math.PI/2-0.75);sitPose(p);setFace(p,true);A.add(p);
    const b=batterySprite(bt,0.0024);b.position.set(0,2.05,0);p.add(b);b.visible=i<2;ppl.push({p,b,ph:r()*6,bat:i<2})}
  for(let z=1;z>-7;z-=2.6){const lamp=glowSprite('rgba(255,225,160,1)',2.2);lamp.position.set(0,3.4,z);A.add(lamp);
    const sh=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.25,8),lamb(0xffe6a0));sh.position.set(0,3.5,z);A.add(sh)}
  // B: 식당 앞 밤거리
  const B=new THREE.Scene();B.fog=new THREE.Fog(0x2a2f55,10,30);addLights(B,{sky:0x9aa8ff,ground:0x303050,hemi:1.2,dir:0.7,sun:0xd8dcff});
  const gB=new THREE.Mesh(new THREE.PlaneGeometry(60,60),lamb(0x4a4f6a));gB.rotation.x=-Math.PI/2;B.add(gB);
  const shop=new THREE.Mesh(new THREE.BoxGeometry(7,4.2,1),lamb(0x8a6a5a));shop.position.set(0,2.1,-3.2);B.add(shop);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2.4),basic(0xffe0a0));door.position.set(0,1.2,-2.69);B.add(door);
  const dg=glowSprite('rgba(255,215,150,1)',4);dg.position.set(0,1.4,-2.4);B.add(dg);
  const sign=labelSprite('회식 장소',{bg:'#ffd84d',fg:'#3a2a00',fs:60,size:0.0045});sign.position.set(0,3.5,-2.6);B.add(sign);
  const out=[];const r2=rng(812);
  for(let i=0;i<7;i++){const p=mkP(r2);p.position.set((i%3-1)*1.05+(r2()-0.5)*0.3,0,-2.2+Math.floor(i/3)*-0.01);p.userData.z0=-2.3+ (i%3)*0.2;p.userData.dl=i*0.12;
    const b=batterySprite(bt,0.0022);b.position.set(0,2.05,0);p.add(b);B.add(p);out.push(p)}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="tag">#008</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">INTJ라면?</div>`;
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2');
  const ch=chip('회식 2시간 · 배터리 3%');ch.style.opacity=0;
  const TB=capAt(0,2)-0.1;
  return t=>{
    if(t<TB){
      bgEl.style.background='linear-gradient(#f7d9b5,#fbe8d2 60%,#fff3e6)';
      const pct=100-97*ease((t-0.4)/(TB-0.6));bt.draw(pct);
      for(const q of ppl){const u=q.p.userData,c=Math.abs(Math.sin(t*9+q.ph));u.arms.forEach((a,k)=>{a.rotation.x=-1.25;a.rotation.z=(k?-1:1)*(0.15+0.32*c)});u.head.rotation.z=Math.sin(t*4+q.ph)*0.08;
        if(q.bat)scaleBubble(q.b,pop((t-0.5-q.ph*0.03)/0.25))}
      cam.position.set(0,3.3,4.9);cam.lookAt(0,1.55,-3.4);
      tag.style.transform=`translateX(-50%) scale(${pop(t/0.25)})`;
      t1.style.transform=`scale(${pop((t-0.05)/0.3)})`;t1.style.opacity=clamp01((t-0.05)/0.08);
      t2.style.transform=`scale(${pop((t-0.25)/0.35)})`;t2.style.opacity=clamp01((t-0.25)/0.08);
      caption(0,t);renderer.render(A,cam);
    }else{
      const lt=t-TB;bgEl.style.background='linear-gradient(#141a3a,#2a3170 60%,#40467e)';
      [tag,t1,t2].forEach(e=>e.style.opacity=0);
      bt.draw(3);const blink=Math.floor(lt*4)%2;
      for(const p of out){const u=p.userData,k=clamp01((lt-u.dl)/2.4);p.position.z=u.z0+k*2.6;walkPose(p,lt*5.2,0.4);u.head.rotation.x=0.18;}
      out.forEach(p=>p.children.forEach(c=>{if(c.isSprite)c.material.opacity=blink?1:0.55}));
      chipPop(ch,lt,0.15);
      cam.position.set(0,2.8,8.6-lt*0.2);cam.lookAt(0,1.4,-1.5);
      caption(0,t);renderer.render(B,cam);
    }
  };
};

// ---------- S1: 단톡 '번개 ㄱ?' → 전원 '선약 있어' → 아파트 단면 ----------
S[1]=()=>{
  const TB=capAt(1,1)-0.15;
  const NAMES=['민준','서연','도윤','하은','지호','수아'],COLS=['#8fa0ff','#ffb84d','#7ad8b0','#ff8fb3','#c9a8ff','#7fc8ff'];
  const OTH=(n,c,t)=>`<div class="row"><div class="av" style="background:${c}"></div><div><div class="who">${n}</div><div class="b">${t}</div></div></div>`;
  const items=[[0.1,OTH('지수','#ffd84d','번개 ㄱ? 오늘 8시 치킨')],...NAMES.slice(0,4).map((n,i)=>[0.75+i*0.22,OTH(n,COLS[i],'선약 있어')])];
  // 아파트 단면
  const scene=new THREE.Scene();addLights(scene,{sky:0xfff0d8,ground:0x404060,hemi:1.5,dir:0.8,dpos:[2,6,10]});
  const r=rng(1101);
  const RW=2.7,RH=2.3,D=2.2,COLSN=3,FL=4;
  const shell=new THREE.Mesh(new THREE.BoxGeometry(RW*COLSN+0.6,RH*FL+0.8,0.3),lamb(0x6f6a8f));shell.position.set(0,RH*FL/2,-D/2-0.2);scene.add(shell);
  const WALL=[0xfbe9d6,0xe6f0ff,0xf3e6ff,0xe8f6e6,0xfff3d0,0xffe6ea];
  const ACT=['read','game','desk','bed','cat','music','plant','read','gym','tv','desk','read'];
  const rooms=[];
  for(let f=0;f<FL;f++)for(let c=0;c<COLSN;c++){const x=(c-1)*RW,y=f*RH;room(scene,x,y,RW-0.12,RH,D,pick(r,WALL),0xc8a27a);
    const lg=glowSprite('rgba(255,230,170,1)',1.6);lg.position.set(x+0.8,y+RH-0.45,-0.6);scene.add(lg);
    const act=ACT[f*COLSN+c];const p=mkP(r);scene.add(p);const g={p,act,x,y};
    if(act==='read'){p.position.set(x,y,0);sitPose(p);p.rotation.y=0.3;const bk=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.26,0.05),lamb(0xe85a5a));bk.position.set(0,0.75,0.36);p.userData.hip.add(bk);
      const ch=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.6),lamb(0x8c9ad8));ch.position.set(x,y+0.25,-0.15);scene.add(ch)}
    else if(act==='gym'){p.position.set(x,y,0);for(const s of[0,1]){const db=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.1,0.1),lamb(0x333344));db.position.set(0,-0.64,0);p.userData.arms[s].add(db)}}
    else if(act==='desk'){p.position.set(x-0.2,y,0.1);sitPose(p);p.rotation.y=Math.PI;const dk=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.08,0.55),lamb(0xa07a52));dk.position.set(x-0.2,y+0.78,-0.55);scene.add(dk);
      const lap=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.3,0.03),lamb(0x333344));lap.position.set(x-0.2,y+0.98,-0.6);scene.add(lap);
      const lamp=glowSprite('rgba(255,240,180,1)',0.9);lamp.position.set(x+0.25,y+1.2,-0.6);scene.add(lamp);p.rotation.y=Math.PI*0.85}
    else if(act==='bed'){const bd=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.35,0.9),lamb(0xffffff));bd.position.set(x,y+0.18,-0.3);scene.add(bd);
      const bl=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.08,0.92),lamb(0x9fb8ff));bl.position.set(x+0.25,y+0.39,-0.3);scene.add(bl);
      p.position.set(x-0.55,y+0.46,-0.3);p.rotation.set(0,0,-Math.PI/2);p.rotation.order='ZYX';p.rotation.y=0;const bk=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.24,0.04),lamb(0x5aa0e8));bk.position.set(0,-0.7,0.1);p.userData.arms[1].add(bk)}
    else if(act==='cat'){p.position.set(x-0.3,y,0);sitPose(p);p.rotation.y=0.6;const cat=mkCat();cat.position.set(x+0.45,y,0.2);cat.rotation.y=-1.2;scene.add(cat);g.cat=cat}
    else if(act==='game'){p.position.set(x+0.1,y,0.2);sitPose(p);p.rotation.y=-0.55;const bb=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.5,0.7),lamb(0xff8fa8));bb.position.set(x+0.1,y+0.25,0.1);scene.add(bb);
      const pad=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.08,0.14),lamb(0x333344));pad.position.set(0,0.62,0.42);p.userData.hip.add(pad);
      const tv=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.6,0.06),lamb(0x22222a));tv.position.set(x-0.85,y+1.15,-0.3);tv.rotation.y=0.9;scene.add(tv);
      const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.5),basic(0x7ad8ff));sc.position.set(x-0.83,y+1.15,-0.27);sc.rotation.y=0.9;scene.add(sc)}
    else if(act==='music'){p.position.set(x,y,0);sitPose(p);const ch=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.6),lamb(0xc9a8ff));ch.position.set(x,y+0.25,-0.15);scene.add(ch);
      const hp=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.035,6,14,Math.PI),lamb(0x2a3570));hp.position.y=0.26;p.userData.head.add(hp);
      for(const sx of[-1,1]){const cup=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.14,0.14),lamb(0x2a3570));cup.position.set(sx*0.27,0.24,0);p.userData.head.add(cup)}
      const nt=textSprite('♪',90,'#8fa0ff',0.004);nt.position.set(x+0.5,y+1.9,0.2);scene.add(nt);g.note=nt}
    else if(act==='plant'){p.position.set(x-0.35,y,0);p.rotation.y=0.9;const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.15,0.3,8),lamb(0xc86a4a));pot.position.set(x+0.45,y+0.15,0.25);scene.add(pot);
      for(let k=0;k<3;k++){const lf=new THREE.Mesh(new THREE.ConeGeometry(0.14,0.5,5),lamb(0x6fae6a));lf.position.set(x+0.45+(k-1)*0.1,y+0.5,0.25);lf.rotation.z=(k-1)*0.4;scene.add(lf)}
      const can=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.18,0.14),lamb(0x7ad8b0));can.position.set(0,-0.7,0.05);p.userData.arms[1].add(can)}
    else if(act==='tv'){const so=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.45,0.6),lamb(0x8c9ad8));so.position.set(x+0.2,y+0.22,-0.35);scene.add(so);
      p.position.set(x+0.2,y,-0.2);sitPose(p);p.rotation.y=-0.5;const sn=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.09,0.16,8),lamb(0xffd84d));sn.position.set(0,0.62,0.35);p.userData.hip.add(sn);
      const tv=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.6,0.06),lamb(0x22222a));tv.position.set(x-0.9,y+1.2,-0.3);tv.rotation.y=0.9;scene.add(tv);
      const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.5),basic(0xffc8a0));sc.position.set(x-0.88,y+1.2,-0.27);sc.rotation.y=0.9;scene.add(sc)}
    rooms.push(g)}
  const bubs=[];[[1,'최고의 선약'],[7,'혼자가 최고'],[11,'평화롭다']].forEach(([i,txt])=>{const b=makeBubble(txt,{...TB,fs:60,size:0.0036});b.position.set(rooms[i].x+0.55,rooms[i].y+1.75,0.5);b.material.depthTest=false;b.renderOrder=5;scene.add(b);bubs.push(b)});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="phone"><div class="screen"><div class="sbar"><span>7:30</span><span>▮▮▮ 100%</span></div><div class="head">‹ 동네 친구들 8</div><div class="msgs" style="justify-content:flex-start;gap:10px">${items.map(i=>`<div class="it" style="display:none">${i[1]}</div>`).join('')}</div></div></div>`;
  const phone=ui.querySelector('.phone'),its=[...ui.querySelectorAll('.it')];
  const ch=chip('금요일 PM 7:30 · 번개 참석 0명',190);ch.style.fontSize='50px';
  const ch2=chip('금요일 PM 8:00 · 선약 = 나 혼자');ch2.style.opacity=0;
  return t=>{
    if(t<TB){bgEl.style.background='linear-gradient(#dfe4ff,#f3f0ff)';
      its.forEach((el,i)=>{const t0=items[i][0];if(t>=t0){el.style.display='';const k=pop((t-t0)/0.22);el.style.transform=`scale(${0.7+0.3*k})`;el.style.transformOrigin='left bottom';el.style.opacity=clamp01((t-t0)/0.08)}else el.style.display='none'});
      chipPop(ch,t,0.2);renderer.clear();caption(1,t);
    }else{const lt=t-TB;phone.style.display='none';ch.style.display='none';bgEl.style.background='linear-gradient(#141a3a,#2a3170 60%,#40467e)';
      for(const g of rooms){const u=g.p.userData;
        if(g.act==='gym'){const k=Math.abs(Math.sin(lt*4+g.x));u.arms.forEach((a,s)=>{a.rotation.x=0;a.rotation.z=(s?1:-1)*(0.3+2.4*k)})}
        else if(g.act==='read'){u.arms.forEach(a=>a.rotation.x=-1.3);u.head.rotation.x=0.25}
        else if(g.act==='desk'){u.arms.forEach((a,s)=>a.rotation.x=-1.4+Math.sin(lt*14+s*2)*0.08)}
        else if(g.act==='bed'){u.arms[1].rotation.x=-1.5;u.arms[1].rotation.z=0;}
        else if(g.act==='game'){u.arms.forEach((a,s)=>{a.rotation.x=-1.2+Math.sin(lt*16+s)*0.06;a.rotation.z=(s?-1:1)*0.35})}
        else if(g.act==='music'){u.head.rotation.z=Math.sin(lt*6)*0.15;u.arms.forEach(a=>a.rotation.x=-0.9);g.note.position.y=g.y+1.8+((lt*0.6)%1)*0.4}
        else if(g.act==='plant'){u.arms[1].rotation.x=-1.3;u.arms[1].rotation.z=-0.1+Math.sin(lt*3)*0.1}
        else if(g.act==='tv'){u.arms[1].rotation.x=-1.0-Math.abs(Math.sin(lt*3))*0.5}
        else if(g.act==='cat'){u.arms[1].rotation.x=-0.9;u.arms[1].rotation.z=-0.5-Math.sin(lt*5)*0.2;g.cat.userData.tail.rotation.z=Math.sin(lt*6)*0.5}}
      bubs.forEach((b,i)=>scaleBubble(b,pop((lt-0.4-i*0.25)/0.22)));
      chipPop(ch2,lt,0.1);
      cam.position.set(0,RH*2+0.2,21+lt*0.4);cam.lookAt(0,RH*2-1.75,0);
      caption(1,t);renderer.render(scene,cam);}
  };
};

// ---------- S2: 텅 빈 광장 → 화상회의 그리드, 지각자 응시 ----------
S[2]=()=>{
  const TB=capAt(2,1)-0.1,TJ=capAt(2,2),TL=capAt(2,3);
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdfeefe,18,45);addLights(scene,{hemi:1.7,dir:1.3});
  const r=rng(1201);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0xd8d2c6));g.rotation.x=-Math.PI/2;scene.add(g);
  for(let i=-10;i<=10;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.04,80),basic(0xc6bfb2));l.rotation.x=-Math.PI/2;l.position.set(i*1.6,0.005,0);scene.add(l)}
  for(let i=0;i<7;i++){const b=makeBuilding(r,4,6+r()*8,4);b.position.set(-13+i*4.4,b.position.y,-14);scene.add(b)}
  const pod=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.6,1.4),lamb(0x8c9ad8));pod.position.set(0,0.3,-4);scene.add(pod);
  const mic=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.1,6),lamb(0x333333));mic.position.set(0,1.15,-3.8);scene.add(mic);
  for(const x of[-3.2,3.2]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,4.2,6),lamb(0x666677));pole.position.set(x,2.1,-4.6);scene.add(pole)}
  const ban=labelSprite('대표 선출의 날',{bg:'#ffffff',fg:'#2a3570',fs:80,size:0.0062,r:8});ban.position.set(0,3.6,-4.6);scene.add(ban);
  const pg=[];for(let i=0;i<7;i++){const p=mkPigeon();p.position.set((r()-0.5)*6,0,-1+(r()-0.5)*3);p.rotation.y=r()*6;scene.add(p);pg.push({p,ph:r()*5})}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  let tiles='';for(let i=0;i<20;i++){tiles+=`<div class="tile" data-i="${i}" style="background:${TILEC[i%4]};opacity:0">${faceHTML(i)}<div class="nm">INTJ ${String(i*7+3).padStart(3,'0')}</div><div class="ok" style="opacity:0">✔</div></div>`}
  ui.innerHTML=`<div class="conf" style="display:none"><div class="confh"><span>대표 선출 회의 · 10:00 시작</span><span class="rec">● LIVE</span></div><div class="grid">${tiles}</div></div>`;
  const conf=ui.querySelector('.conf'),T=[...ui.querySelectorAll('.tile')];const LATE=6;
  const ch=chip('선거일 AM 9:50 · 광장 인원 0명');ch.style.fontSize='50px';
  const ch2=chip('',190);ch2.style.fontSize='50px';ch2.style.opacity=0;
  const st=stampEl('지각 금지법 제1조',150,700,104,'#ff5a6e',-8);
  // 타일 중심(그리드 기준) 계산
  const colW=(980-36-36)/4,rowH=(900-96-18-48)/5;const ctr=i=>[18+(i%4)*(colW+12)+colW/2,96+Math.floor(i/4)*(rowH+12)+rowH/2];
  return t=>{
    if(t<TB){bgEl.style.background='linear-gradient(#8fcbff,#cfe9ff 55%,#eef8ff)';
      for(const q of pg){q.p.userData.hd.rotation.x=Math.max(0,Math.sin(t*6+q.ph))*0.9;q.p.position.x+=Math.sin(t+q.ph)*0.002}
      chipPop(ch,t,0.1);cam.position.set(0,2.4,8.5-t*0.5);cam.lookAt(0,2.3,-4);caption(2,t);renderer.render(scene,cam);
    }else{const lt=t-TB;ch.style.display='none';conf.style.display='';renderer.clear();bgEl.style.background='linear-gradient(#cfd6ff,#eef0ff)';
      conf.style.transform=`scale(${0.9+0.1*pop(lt/0.3)})`;
      T.forEach((el,i)=>{const tj=0.1+((i*7)%20)*((TJ-TB-0.4)/20);
        if(i===LATE){el.style.opacity=1;el.classList.add('wait');if(!el.querySelector('.ld')){const d=document.createElement('div');d.className='ld';el.appendChild(d)}el.querySelector('.ld').textContent='입장 중'+'.'.repeat(1+Math.floor(lt*3)%3);el.style.boxShadow=t>TL?`0 0 0 ${4+3*Math.sin(t*10)}px #ff5a6e`:''}
        else{el.style.opacity=clamp01((lt-tj)/0.1);el.style.transform=`scale(${0.6+0.4*pop((lt-tj)/0.25)})`;el.querySelector('.ok').style.opacity=t>TJ?1:0;
          if(t>TL-0.05){const[a,b]=ctr(i),[c,d]=ctr(LATE);const L=Math.hypot(c-a,d-b)||1;setEyes(el,(c-a)/L*7,(d-b)/L*6)}else setEyes(el,0,0)}});
      ch2.textContent=t<TJ?'AM 9:50 · 입장 중…':'AM 9:50 · 19명 입장 완료 ✔';chipPop(ch2,lt,0.15);
      stampPop(st,t,TL+0.45);caption(2,t);}
  };
};

// ---------- S3: 퇴임 연설 생략 + 'ㅇㅇ' 도배 → 공약집 형광펜 ----------
S[3]=()=>{
  const T2=capAt(3,2)-0.1;
  let small='';for(let i=0;i<8;i++)small+=`<div class="tile" style="background:${TILEC[i%4]}">${faceHTML(30+i,bookHTML(i))}<div class="nm">INTJ ${String(40+i*9).padStart(3,'0')}</div></div>`;
  ui.innerHTML=`<div class="tile" id="pre" style="position:absolute;left:50px;top:300px;width:600px;height:470px;border-radius:34px;background:#3b4a5e">
     <div style="position:absolute;left:0;right:0;top:40px;height:300px;transform:scale(2);transform-origin:50% 0">${faceHTML(1)}</div>
     <div class="nm" style="font-size:28px">진행자 INTJ 001</div>
     <div id="say" style="position:absolute;left:24px;right:24px;top:22px;background:#fff;color:#2a3570;border-radius:24px;padding:14px 18px;font-size:36px;font-weight:900;text-align:center;opacity:0"></div></div>
   <div class="chat" style="left:670px;right:50px;top:300px;height:470px"><div style="color:#9fb0ff;font-size:30px;font-weight:900;padding:16px 18px 6px">채팅</div><div id="lines"></div></div>
   <div style="position:absolute;left:50px;right:50px;top:800px;height:400px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:12px">${small}</div>`;
  const say=ui.querySelector('#say'),lines=ui.querySelector('#lines'),bigs=[...ui.querySelectorAll('.book')];
  const ch=chip('',190);ch.style.fontSize='50px';
  let nl=-1;
  return t=>{bgEl.style.background='linear-gradient(#cfd6ff,#eef0ff)';renderer.clear();
    const ph2=t>=T2;
    say.textContent=ph2?'공약은 미리 배포했습니다.':'퇴임 연설은 생략하겠습니다.';
    const st=ph2?T2:0.15;say.style.opacity=clamp01((t-st)/0.1);say.style.transform=`scale(${0.8+0.2*pop((t-st)/0.25)})`;
    const N1=Math.max(0,Math.floor((T2-0.7)*9));const n=ph2?N1+Math.floor(clamp01((t-T2-0.3)/1.2)*4):Math.max(0,Math.floor((t-0.7)*9));
    if(n!==nl){nl=n;let h='';const from=Math.max(0,n-9);for(let k=from;k<n;k++){const msg=k<N1?'ㅇㅇ':['다 읽음','정독 완료','3회독 함','ㅇㅇ 숙지'][(k-N1)%4];h+=`<div class="ln"><b>INTJ ${String((k*13)%97+2).padStart(3,'0')}</b>${msg}</div>`}lines.innerHTML=h}
    bigs.forEach((b,i)=>{const t0=T2+0.35+i*0.13;b.style.opacity=clamp01((t-t0)/0.06);b.style.transform=`translateY(${(1-pop((t-t0)/0.25))*60}px)`});
    ch.textContent=ph2?'공약집 정독률 100%':'퇴임 연설 0초 · 바로 본론';chipPop(ch,ph2?t-T2:t,0.1);
    caption(3,t);
  };
};

// ---------- S4: 투표 3초 → 공약 포스터 → 고양이 앞에 무릎 꿇는 군중 ----------
S[4]=()=>{
  const TP=capAt(4,1)-0.1,TC=capAt(4,2)-0.1;
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe6f2ff,16,40);addLights(scene,{hemi:1.7,dir:1.2});
  const r=rng(1401);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0xd8d2c6));g.rotation.x=-Math.PI/2;scene.add(g);
  for(let i=0;i<6;i++){const b=makeBuilding(r,4,5+r()*7,4);b.position.set(-11+i*4.4,b.position.y,-9);scene.add(b)}
  const cat=mkCat(0xf2a65a);cat.scale.setScalar(1.5);cat.position.set(0.6,0,0);cat.rotation.y=0.3;scene.add(cat);
  const crowd=[];const N=8;for(let i=0;i<N;i++){const a=Math.PI*(1.05+0.9*i/(N-1));const R=1.55+(i%2)*0.35;const p=mkP(r);
    p.position.set(0.6+Math.cos(a)*R,0,Math.sin(a)*R);p.rotation.y=Math.atan2(0.6-p.position.x,0-p.position.z);scene.add(p);crowd.push(p)}
  const fallen=mkP(r,{shirt:0x9a9aa8});fallen.position.set(-0.6,0.16,2.6);fallen.rotation.set(-Math.PI/2,0,0.4);scene.add(fallen);
  const fb=makeBubble('저기요…',{bg:'#eeeeee',fg:'#555',fs:60,size:0.0038});fb.position.set(-0.6,1.1,2.7);scene.add(fb);
  const hs=sprinkleHearts(scene,8,r,{x:0.6,w:1.8,z:0.2,size:0.0035,col:'#ff7aa8'});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="big out" id="vt" style="top:330px;font-size:84px">투표 진행 중</div><div class="big out" id="pc" style="top:470px;font-size:260px;color:${C_T}">0%</div><div class="big out" id="tm" style="top:800px;font-size:90px">00:00</div>
   <div class="poster" style="display:none"><h1>당선 · INTJ 102</h1><h2>— 공약 —</h2><ul style="padding:0;margin:0">${'ABCDE'.split('').map((c,i)=>`<li style="opacity:0">${i+1}. 동물 복지 ${c}</li>`).join('')}</ul><div class="small" style="opacity:0">※ 인간: 알아서 하세요</div></div>`;
  const vt=ui.querySelector('#vt'),pc=ui.querySelector('#pc'),tm=ui.querySelector('#tm'),post=ui.querySelector('.poster'),lis=[...post.querySelectorAll('li')],sm=post.querySelector('.small');
  const st=stampEl('투표 완료!',300,1000,110,'#ffd84d',-10);
  const ch=chip('사람 관심 0 · 고양이 관심 100');ch.style.opacity=0;
  return t=>{
    if(t<TP){bgEl.style.background='linear-gradient(#2a3170,#40467e)';renderer.clear();
      const k=clamp01((t-0.25)/1.1);pc.textContent=Math.round(100*ease(k))+'%';tm.textContent=k>=1?'00:03':'00:0'+Math.min(2,Math.floor(k*3));
      [vt,pc,tm].forEach((e,i)=>{e.style.opacity=clamp01((t-i*0.08)/0.1)});stampPop(st,t,1.45);caption(4,t);
    }else if(t<TC){[vt,pc,tm,st].forEach(e=>e.style.display='none');post.style.display='';renderer.clear();bgEl.style.background='linear-gradient(#cfd6ff,#eef0ff)';
      const lt=t-TP;post.style.transform=`scale(${0.85+0.15*pop(lt/0.3)})`;
      lis.forEach((e,i)=>{const t0=0.25+i*0.28;e.style.opacity=clamp01((lt-t0)/0.08);e.style.transform=`translateX(${(1-pop((lt-t0)/0.25))*-60}px)`});
      sm.style.opacity=clamp01((t-(TC-0.75))/0.1);sm.style.transform=`scale(${pop((t-(TC-0.75))/0.25)})`;caption(4,t);
    }else{const lt=t-TC;post.style.display='none';[vt,pc,tm,st].forEach(e=>e.style.display='none');bgEl.style.background='linear-gradient(#9fd2ff,#d8ecff 55%,#f2f8ff)';
      crowd.forEach((p,i)=>{const u=p.userData,k=ease((lt-i*0.04)/0.35);u.hip.position.y=0.8-0.38*k;u.legs.forEach(l=>l.rotation.x=-1.5*k);u.arms.forEach(a=>{a.rotation.x=-0.9*k});setFace(p,lt>0.3);u.head.rotation.x=0.35*k});
      cat.userData.tail.rotation.z=Math.sin(lt*6)*0.5;updHearts(hs,lt,0.3,1.0,2);scaleBubble(fb,pop((lt-0.5)/0.25));
      chipPop(ch,lt,0.2);cam.position.set(-0.3,3.4,8.2-lt*0.3);cam.lookAt(-0.1,1.3,0.5);caption(4,t);renderer.render(scene,cam);}
  };
};

// ---------- S5: 해변 플랜 A → 비 → 동시에 우산, 플랜 B ----------
S[5]=()=>{
  const TR=capAt(5,2)-0.45,TU=capAt(5,2)-0.05;
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdff0ff,18,45);const hemi=new THREE.HemisphereLight(0xffffff,0x8a8070,1.7);scene.add(hemi);const dl=new THREE.DirectionalLight(0xffffff,1.4);dl.position.set(5,12,8);scene.add(dl);
  const r=rng(1501);
  const sand=new THREE.Mesh(new THREE.PlaneGeometry(80,14),lamb(0xf2dfb0));sand.rotation.x=-Math.PI/2;sand.position.z=1;scene.add(sand);
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(80,40),lamb(0x6fc2e8));sea.rotation.x=-Math.PI/2;sea.position.set(0,-0.02,-26);scene.add(sea);
  for(let i=0;i<4;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(80,0.18),basic(0xffffff));f.rotation.x=-Math.PI/2;f.position.set(0,0.01,-5.9-i*1.6);scene.add(f)}
  const cafe=new THREE.Group();const cb=new THREE.Mesh(new THREE.BoxGeometry(4,3,3),lamb(0xffe6ea));cb.position.y=1.5;cafe.add(cb);
  const aw=new THREE.Mesh(new THREE.BoxGeometry(4.3,0.2,1),lamb(0xff8fa8));aw.position.set(0,2.6,1.6);cafe.add(aw);
  const cd=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.9),basic(0xffe0a0));cd.position.set(0,0.95,1.51);cafe.add(cd);
  const cs=labelSprite('실내 카페',{bg:'#2a3570',fg:'#fff',fs:64,size:0.0048});cs.position.set(0,3.6,1.4);cafe.add(cs);
  cafe.position.set(9.5,0,-2.6);scene.add(cafe);
  const COL=[0x8fa0ff,0xff8fb3,0xffd84d,0x7ad8b0,0xc9a8ff,0x7fc8ff,0xffa86a];
  const ppl=[];for(let i=0;i<7;i++){const p=mkP(r);p.position.set(-4.2+i*1.15+(r()-0.5)*0.3,0,-0.8+(i%3)*0.9);p.rotation.y=Math.PI/2;scene.add(p);
    const um=umbrella(COL[i]);um.scale.setScalar(0.001);p.userData.arms[1].add(um);um.position.set(0,-0.62,0);um.rotation.x=Math.PI;
    const b=makeBubble('플랜 A',{...TB,fs:60,size:0.0036});b.position.set(0,2.15,0);p.add(b);ppl.push({p,um,b,x0:p.position.x,ph:r()*6})}
  // 비
  const NR=900;const rg=new THREE.BufferGeometry();const rp=new Float32Array(NR*6);const rs=[];
  for(let i=0;i<NR;i++){rs.push([(r()-0.5)*26,r()*12,(r()-0.5)*12-1,r()])}rg.setAttribute('position',new THREE.BufferAttribute(rp,3));
  const rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xcfe0ff,transparent:true,opacity:0.8}));scene.add(rain);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('여행 1일차 · 플랜 A: 해변 산책');ch.style.fontSize='50px';
  let ph=-1;
  return t=>{const wet=clamp01((t-TR)/0.4);
    bgEl.style.background=wet<0.5?'linear-gradient(#7fc8ff,#cfeaff 55%,#fff6e0)':'linear-gradient(#7b8496,#a9b2c2 55%,#cdd3dc)';
    hemi.intensity=1.7-0.5*wet;dl.intensity=1.4-0.8*wet;sea.material.color.setHex(wet<0.5?0x6fc2e8:0x6a8aa0);
    const cx=t*0.75;
    for(const q of ppl){const u=q.p.userData;q.p.position.x=q.x0+t*0.75;walkPose(q.p,t*5.5+q.ph,0.45);
      const k=pop((t-TU-q.ph*0.01)/0.25);q.um.scale.setScalar(Math.max(0.001,k));
      if(t>TU){u.arms[1].rotation.x=-2.85;u.arms[1].rotation.z=0.1}
      const want=t>TU?1:0;if(q.b.userData.st!==want){q.b.userData.st=want;setBubble(q.b,want?'플랜 B ✔':'플랜 A',{...TB,fs:60,size:0.0036})}
      scaleBubble(q.b,pop((t-0.3-q.ph*0.03)/0.25));q.b.position.y=t>TU?2.95:2.15;setFace(q.p,false)}
    const pa=rg.attributes.position.array;
    for(let i=0;i<NR;i++){const s=rs[i];const y=((s[1]-(t-TR)*14)%12+12)%12;const vis=wet>s[3]?1:0;const x=s[0]+cx;pa.set([x,y*vis-(1-vis)*50,s[2],x-0.04,(y+0.45)*vis-(1-vis)*50,s[2]],i*6)}
    rg.attributes.position.needsUpdate=true;
    const p2=t>TU?1:0;if(p2!==ph){ph=p2;ch.textContent=p2?'플랜 B 가동 · 당황한 사람 0명':'여행 1일차 · 플랜 A: 해변 산책'}chipPop(ch,p2?t-TU:t,0.1);
    cam.position.set(cx+0.6,2.4,9.6);cam.lookAt(cx+0.9,1.5,-0.5);
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6: 출근 전 거울 앞 — '아님' 할수록 거울 속 하트 눈이 커짐 → 화면 가득 하트 → 50년째 노부부 ----------
S[6]=()=>{
  const TN=[0.9,2.35,3.6],TF=4.55,TE=capAt(6,3)-0.15;
  const A=new THREE.Scene();addLights(A,{hemi:1.7,dir:1.0,dpos:[2,8,10]});
  const RW=2.3,N=3;const r=rng(1601);
  const WALLC=[0xd6ecf2,0xf2e6f2,0xe8f2d6];
  const ppl=[];
  for(let i=0;i<N;i++){const x=(i-1)*RW;const wc=WALLC[i];
    const fl=new THREE.Mesh(new THREE.BoxGeometry(RW,0.1,6),lamb(0xe8e8ee));fl.position.set(x,-0.05,0);A.add(fl);
    const back=new THREE.Mesh(new THREE.PlaneGeometry(RW,4),lamb(wc));back.position.set(x,2,-3.2);A.add(back);
    // 거울 테두리가 있는 앞벽 (구멍 = 거울)
    const MW=1.5,MH=1.3,MY=1.8,Z=-0.6;
    const wl=lamb(wc);
    const top=new THREE.Mesh(new THREE.BoxGeometry(RW,4-(MY+MH/2),0.12),wl);top.position.set(x,(4+MY+MH/2)/2,Z);A.add(top);
    const bot=new THREE.Mesh(new THREE.BoxGeometry(RW,MY-MH/2,0.12),wl);bot.position.set(x,(MY-MH/2)/2,Z);A.add(bot);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.BoxGeometry((RW-MW)/2,MH,0.12),wl);sd.position.set(x+sx*(MW/2+(RW-MW)/4),MY,Z);A.add(sd);
      const fr=new THREE.Mesh(new THREE.BoxGeometry(0.06,MH+0.12,0.16),lamb(0xffffff));fr.position.set(x+sx*(MW/2+0.03),MY,Z);A.add(fr)}
    for(const sy of[-1,1]){const fr=new THREE.Mesh(new THREE.BoxGeometry(MW+0.12,0.06,0.16),lamb(0xffffff));fr.position.set(x,MY+sy*(MH/2+0.03),Z);A.add(fr)}
    const glass=new THREE.Mesh(new THREE.PlaneGeometry(MW,MH),new THREE.MeshBasicMaterial({color:0xdff4ff,transparent:true,opacity:0.22,depthWrite:false}));glass.position.set(x,MY,Z+0.07);A.add(glass);
    const shine=new THREE.Mesh(new THREE.PlaneGeometry(0.12,MH*0.9),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.45,depthWrite:false}));shine.position.set(x-0.4,MY,Z+0.08);shine.rotation.z=-0.4;A.add(shine);
    const sink=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.85,0.6),lamb(0xffffff));sink.position.set(x,0.43,-0.2);A.add(sink);
    const bowl=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.04,0.4),lamb(0xcfe0ea));bowl.position.set(x,0.87,-0.2);A.add(bowl);
    const brush=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.22,0.04),lamb(0x7ad8b0));brush.position.set(x+0.45,0.98,-0.35);A.add(brush);
    if(i<N-1){const dv=new THREE.Mesh(new THREE.BoxGeometry(0.12,4,1.4),lamb(0x8a90a8));dv.position.set(x+RW/2,2,0.1);A.add(dv);const dv2=new THREE.Mesh(new THREE.BoxGeometry(0.12,4,2.6),lamb(0x8a90a8));dv2.position.set(x+RW/2,2,-1.9);A.add(dv2)}
    // 실제 사람(뒷모습) + 거울 속 사람(앞모습, 같은 생김새)
    const seed=1650+i*7;const p=mkP(rng(seed));p.position.set(x-0.42,0,0.6);p.rotation.y=Math.PI-0.25;A.add(p);
    const m=mkP(rng(seed));m.position.set(x+0.3,0,-0.6-1.15);m.rotation.y=-0.15;A.add(m);
    const eyes=[];for(const sx of[-1,1]){const h=heartSprite(0.0016,'#ff4f8a');h.center.set(0.5,0.5);h.position.set(sx*0.09,0.26,0.27);h.renderOrder=6;m.userData.head.add(h);eyes.push(h)}
    const b=makeBubble('정신 차려, 아님',{...TB,fs:60,size:0.0032});b.position.set(x-0.3,2.42,0.6);b.material.depthTest=false;b.renderOrder=7;A.add(b);
    ppl.push({p,m,eyes,b,ph:i*1.3,idx:i})}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const TXT=['정신 차려, 아님','그냥 사람으로서 좋은 거임','착각임'],TSZ=[0.0032,0.0032,0.0036];
  // B: 노을 벤치 노부부
  const B=new THREE.Scene();B.fog=new THREE.Fog(0xffd8b0,14,36);addLights(B,{sky:0xffe0c0,ground:0x806050,hemi:1.5,dir:1.2,sun:0xffc890,dpos:[-6,6,8]});
  const gb=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0x9cbf7a));gb.rotation.x=-Math.PI/2;B.add(gb);
  const sun=new THREE.Mesh(new THREE.CircleGeometry(1.6,24),basic(0xffe08a));sun.position.set(0,3.2,-20);B.add(sun);const sg=glowSprite('rgba(255,200,120,1)',9);sg.position.copy(sun.position);B.add(sg);
  const bench=new THREE.Group();const seat=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,0.5),lamb(0xb07a4a));seat.position.y=0.5;bench.add(seat);
  const bk=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.42,0.07),lamb(0xa06c3e));bk.position.set(0,0.82,-0.24);bench.add(bk);B.add(bench);
  const o1=greyHair(mkP(r,{shirt:0x8c7ab8}));o1.position.set(-0.36,0,0.05);o1.rotation.y=0.2;sitPose(o1);setFace(o1,true);B.add(o1);
  const o2=greyHair(mkP(r,{shirt:0xd98c8c}));o2.position.set(0.36,0,0.05);o2.rotation.y=-0.2;sitPose(o2);setFace(o2,true);B.add(o2);
  const ob=makeBubble('♥',{bg:'#ffe0ef',fg:'#e2557a',fs:80,size:0.0045});ob.position.set(0,2.1,0.1);B.add(ob);
  const hs=sprinkleHearts(B,8,r,{w:1.6,z:0.2,size:0.0032});
  ui.innerHTML=`<div class="heartfill" style="opacity:0">♥</div>`;const hf=ui.querySelector('.heartfill');
  const ch=chip('AM 7:30 · 출근 준비 중');ch.style.fontSize='50px';const ch2=chip('그 사람만 50년째');ch2.style.opacity=0;let chs=0;
  return t=>{
    if(t<TE){bgEl.style.background='linear-gradient(#cfe9f5,#eef8fb)';
      let stg=-1;for(let k=0;k<3;k++)if(t>=TN[k])stg=k;
      for(const q of ppl){const u=q.p.userData,mu=q.m.userData;
        // 실제: 고개 저으며 양손으로 볼 감싸기
        const deny=stg>=0&&t-TN[stg]<0.9;u.head.rotation.y=deny?Math.sin(t*16+q.ph)*0.35:0;
        u.arms.forEach((a,k)=>{a.rotation.x=deny?-2.5:-0.3;a.rotation.z=(k?-1:1)*(deny?0.55:0.1)});
        // 거울 속: 고개 갸웃 + 웃음 + 하트 눈
        setFace(q.m,t>0.5);mu.head.rotation.z=Math.sin(t*3+q.ph)*0.12;mu.arms.forEach((a,k)=>{a.rotation.x=-0.4;a.rotation.z=(k?-1:1)*0.25});
        const base=t<0.5?0:1+0.75*Math.max(0,stg+1);const k=pop((t-0.5)/0.25)*base*(1+0.1*Math.sin(t*12+q.ph));
        q.eyes.forEach(e=>{e.scale.set(e.userData.base[0]*k,e.userData.base[1]*k,1);e.visible=k>0.02});
        if(stg>=0&&q.b.userData.st!==stg){q.b.userData.st=stg;setBubble(q.b,TXT[stg],{...TB,fs:60,size:TSZ[stg]})}
        const show=stg===1?q.idx===1:true;scaleBubble(q.b,stg<0?pop((t-0.2-q.idx*0.1)/0.22)*(q.b.userData.st===undefined?1:1):show?pop((t-TN[stg])/0.2):0)}
      const fk=clamp01((t-TF)/0.9);hf.style.opacity=t>TF?1:0;hf.style.transform=`translate(-50%,-50%) scale(${0.6+12*fk*fk})`;
      if(t>TF&&chs===0){chs=1;ch.textContent='부정 3회 · 실패'}chipPop(ch,chs?t-TF:t,0.1);
      cam.position.set(0,2.35,7.4);cam.lookAt(0,1.7,-1);
      caption(6,t);renderer.render(A,cam);
    }else{const lt=t-TE;hf.style.opacity=clamp01(1-lt/0.25);ch.style.opacity=0;bgEl.style.background='linear-gradient(#ff9a6a,#ffc89a 50%,#ffe6c8)';
      o1.userData.head.rotation.z=-0.15;o2.userData.head.rotation.z=0.15;scaleBubble(ob,pop((lt-0.2)/0.25));updHearts(hs,lt,0.3,1.9,1.8);
      chipPop(ch2,lt,0.3);cam.position.set(0.2,2.0,7.6-lt*0.25);cam.lookAt(0,1.5,0);caption(6,t);renderer.render(B,cam);}
  };
};

// ---------- S7: 유기견 보호소 — 강아지 앞에선 오열, 우는 사람 앞에선 무표정 ----------
S[7]=()=>{
  const TT=capAt(7,1),TD=capAt(7,2);
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe6f2ff,16,40);addLights(scene,{hemi:1.7,dir:1.2});
  const r=rng(1702);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0xa8d896));g.rotation.x=-Math.PI/2;scene.add(g);
  const yard=new THREE.Mesh(new THREE.PlaneGeometry(14,5),lamb(0xe8dcc0));yard.rotation.x=-Math.PI/2;yard.position.set(0,0.01,-0.5);scene.add(yard);
  const bld=new THREE.Mesh(new THREE.BoxGeometry(14,3.4,1),lamb(0xfff3d0));bld.position.set(0,1.7,-3.4);scene.add(bld);
  const rf=new THREE.Mesh(new THREE.BoxGeometry(14.4,0.3,1.4),lamb(0xe8955f));rf.position.set(0,3.5,-3.3);scene.add(rf);
  const sign=labelSprite('유기견 보호소',{bg:'#e8955f',fg:'#fff',fs:70,size:0.0055});sign.position.set(-1,4.2,-3);scene.add(sign);
  for(let i=0;i<7;i++){const x=-6+i*2;const k=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.4),lamb(0x8a7a6a));k.position.set(x,0.9,-2.88);scene.add(k);
    for(let j=0;j<6;j++){const bar=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.4,0.05),lamb(0x6a6a7a));bar.position.set(x-0.62+j*0.25,0.9,-2.84);scene.add(bar)}}
  for(let i=0;i<6;i++)tree(scene,-9+i*3.6,-6,1.1,0x7cbf74);
  const COLS=[0xd9b38c,0xf2e2c8,0x8a5a3a,0xe8c08a,0xb08060];
  const ppl=[];for(let i=0;i<5;i++){const x=-3.2+i*1.15;const p=mkP(r);p.position.set(x,0,0);scene.add(p);
    const dog=sadDog(mkDog(COLS[i]));dog.scale.setScalar(0.95);dog.position.set(x,0,0.85);scene.add(dog);
    const tears=[];for(const s of[-1,1])for(let k=0;k<2;k++){const d=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.07,0.02),basic(0x4aa0ff));p.userData.head.add(d);tears.push({d,s,ph:r()+k*0.5})}
    const b=makeBubble('삐빅',{...TB,fs:60,size:0.0034});b.position.set(0,2.15,0);p.add(b);
    const db=makeBubble('낑…',{bg:'#fff',fg:'#8a5a3a',fs:56,size:0.0028});db.position.set(x+0.3,1.2,1.0);db.material.depthTest=false;db.renderOrder=4;scene.add(db);
    ppl.push({p,dog,tears,b,db,txt:['흑흑','훌쩍','아가야…','ㅠㅠㅠ','데려갈게…'][i],ph:r()*6})}
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('눈물 ∞ · 단, 동물 앞 한정');ch.style.opacity=0;
  return t=>{bgEl.style.background='linear-gradient(#9fd2ff,#d8ecff 55%,#f2f8ff)';
    const cry=t>TT;
    for(const q of ppl){const u=q.p.userData;setFace(q.p,false);
      u.head.rotation.x=cry?0.35:0.1;u.head.rotation.z=cry?Math.sin(t*11+q.ph)*0.07:0;
      u.arms[1].rotation.x=cry?-2.3:0;u.arms[1].rotation.z=cry?-0.45:0;u.arms[0].rotation.x=0;
      if(!cry){u.arms.forEach(a=>{a.rotation.x=Math.round(Math.sin(t*3+q.ph))*0.25})}
      q.tears.forEach(e=>{const lt=((t*1.6+e.ph)%1);e.d.visible=cry;e.d.position.set(e.s*0.09,0.2-lt*0.3,0.24)});
      q.dog.rotation.z=Math.sin(t*40+q.ph)*0.025;q.dog.rotation.x=0.12;q.dog.position.y=Math.abs(Math.sin(t*20+q.ph))*0.01;q.dog.userData.tears.forEach(e=>e.scale.y=1+((t*1.2+q.ph)%1)*2.5);
      const kk=Math.floor(t*2.2+q.ph)%2;if(q.db.userData.k!==kk){q.db.userData.k=kk;setBubble(q.db,kk?'끼잉…':'낑…',{bg:'#fff',fg:'#8a5a3a',fs:56,size:0.0028})}
      const want=cry?1:0;if(q.b.userData.st!==want){q.b.userData.st=want;setBubble(q.b,want?q.txt:'삐빅',{...TB,fs:60,size:0.0034})}
      scaleBubble(q.b,pop((t-(cry?TT:0.15))/0.22));scaleBubble(q.db,pop((t-0.6-q.ph*0.05)/0.22))}
    chipPop(ch,t,TD+0.15);
    const cx=-0.9;
    cam.position.set(cx,3.6,8.6-t*0.12);cam.lookAt(cx,0.6,0);
    caption(7,t);renderer.render(scene,cam);
  };
};

// ---------- S8: 질문 장면 — 동물 안은 세 사람 ----------
S[8]=()=>{
  bgEl.style.background='linear-gradient(#121735,#28306a 60%,#3e3f7a)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x2a3068,14,40);addLights(scene,{sky:0x9aa8ff,ground:0x202040,hemi:1.2,dir:0.7,sun:0xd0d8ff});
  const r=rng(1801);
  stars(scene,200,r,{y0:6,h:22,z:-22,w:50});
  const moon=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),basic(0xfff0c0));moon.position.set(3.4,9.5,-20);scene.add(moon);
  const mg=glowSprite('rgba(255,240,190,1)',6);mg.position.copy(moon.position);scene.add(mg);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0x3a3f5e));gr.rotation.x=-Math.PI/2;scene.add(gr);
  for(let i=0;i<9;i++){const h=makeHouse(r,{h:1.8+r()*1.4});h.position.set(-9+i*2.4+(r()-0.5)*0.4,0,-7-(i%2)*2.4);h.rotation.y=(r()-0.5)*0.3;scene.add(h)}
  for(const x of[-3,3]){const lp=new THREE.Mesh(new THREE.BoxGeometry(0.08,2.6,0.08),lamb(0x333344));lp.position.set(x,1.3,-3);scene.add(lp);const lg=glowSprite('rgba(255,220,150,1)',1.6);lg.position.set(x,2.7,-3);scene.add(lg)}
  const pets=[mkCat(0xf2a65a),mkDog(),mkHam()];const ppl=[];
  [-1.15,0,1.15].forEach((x,i)=>{const p=mkP(r);p.position.set(x,0,0);p.rotation.y=-x*0.12;scene.add(p);const pet=pets[i];pet.scale.setScalar(i===2?1.1:0.85);pet.position.set(0,0.12,0.32);p.userData.hip.add(pet);
    const hb=heartSprite(0.0036);hb.center.set(0.5,0);hb.position.set(0,0.95,0.4);p.userData.hip.add(hb);ppl.push({p,pet,hb})});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out" style="font-size:92px;top:400px">여러분 주변의<br><span style="color:${C_T}">INTJ</span>도<br>동물을 좋아하나요?</div><div class="end2 out" style="top:790px">INTJ 친구를 태그해 주세요!</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2');
  const T2=LEAD+3.5;
  return t=>{
    ppl.forEach((q,i)=>{const u=q.p.userData;u.arms.forEach((a,s)=>{a.rotation.x=-1.0;a.rotation.z=(s?-1:1)*0.35});
      if(i===1){u.arms[1].rotation.x=0;u.arms[1].rotation.z=-2.6+Math.sin(t*8)*0.35}
      setFace(q.p,false);if(q.pet.userData.tail)q.pet.userData.tail.rotation.z=Math.sin(t*7+i)*0.5;
      const k=pop((t-0.6-i*0.2)/0.25)*(1+0.08*Math.sin(t*6+i));q.hb.scale.set(q.hb.userData.base[0]*k,q.hb.userData.base[1]*k,1);q.hb.position.y=0.95+((t*0.4+i*0.3)%1)*0.25});
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    e2.style.transform=`scale(${pop((t-T2)/0.3)})`;e2.style.opacity=clamp01((t-T2)/0.1);
    cam.position.set(0,1.6,6.4-t*0.12);cam.lookAt(0,2.3,0);
    renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
