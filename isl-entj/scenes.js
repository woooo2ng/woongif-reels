// ---------- ENTJ 무인도편 공용 ----------
function title(){
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ENTJ × 무인도편</div><div class="title1 out">온 세상이</div><div class="title2 out">ENTJ인데</div><div class="title3 out">무인도에 떨어진다면?</div>`);
  const el=['.tag','.title1','.title2','.title3'].map(s=>ui.querySelector(s));
  return (t,hide)=>{const o=hide?0:1;el[0].style.transform=`translateX(-50%) scale(${pop(t/0.3)})`;el[0].style.opacity=o;
    el.slice(1).forEach((e,i)=>{const t0=0.1+i*0.25;e.style.transform=`scale(${pop((t-t0)/0.35)})`;e.style.opacity=clamp01((t-t0)/0.1)*o})};
}
// 리더: 네이비 셔츠 + 코랄 넥타이
function leader(){const p=makeHero({shirt:0x3d4a6b,pants:0x2e3346});const u=p.userData;
  const tie=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.4,0.02),lamb(0xff6b5a));tie.position.set(0,0.4,0.168);u.hip.add(tie);
  const knot=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.03),lamb(0xe85544));knot.position.set(0,0.6,0.17);u.hip.add(knot);
  for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.05,0.1),lamb(0xffffff));c.position.set(s*0.08,0.63,0.15);c.rotation.z=s*-0.4;u.hip.add(c)}
  return p}
function watch(p){const w=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.08,0.19),lamb(0x2b2b30));w.position.y=-0.48;p.userData.arms[0].add(w);
  const f=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.07,0.11),basic(0xdff3ff));f.position.set(0.08,-0.48,0);p.userData.arms[0].add(f);return w}
function card(p){const c=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.012,0.12),lamb(0xffffff));c.position.set(0,-0.7,0.06);p.userData.arms[1].add(c);c.visible=false;return c}
function stick(p,len=0.9){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.025,len,5),lamb(0x8a6a44));s.position.set(0,-0.62-len*0.35,0.12);s.rotation.x=0.5;p.userData.arms[1].add(s);return s}
function folder(p,side=1){const f=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.03,0.26),lamb(0xffd84d));f.position.set(0,-0.66,0.08);p.userData.arms[side].add(f);return f}
// 손목시계 보기 (왼팔을 가슴 앞으로)
function watchPose(p,k){const u=p.userData;u.arms[0].rotation.set(-1.45*k,0,0.95*k);u.head.rotation.x=0.35*k}
// 명함 두 손으로 내밀기
function offerPose(p,k){const u=p.userData;u.arms[0].rotation.set(-1.15*k,0,0.35*k);u.arms[1].rotation.set(-1.15*k,0,-0.35*k);u.head.rotation.x=0.25*k;u.hip.rotation.x=0.18*k}
function crossArms(p,k=1){const u=p.userData;u.arms[0].rotation.set(-1.3*k,0,1.0*k);u.arms[1].rotation.set(-1.15*k,0,-1.0*k)}
function wave(p,t,side=1,ph=0){armUp(p,side,1);p.userData.arms[side].rotation.z=(side?1:-1)*(0.25+Math.sin(t*9+ph)*0.35)}
// 원숭이
function monkey(o={}){const g=new THREE.Group();const fur=o.fur??0x8a5a36,face=0xf2cfa6;
  const hip=new THREE.Group();g.add(hip);
  const body=new THREE.Mesh(new THREE.SphereGeometry(0.27,10,8),lamb(fur));body.scale.set(1,1.15,0.85);body.position.y=0.5;hip.add(body);
  const belly=new THREE.Mesh(new THREE.SphereGeometry(0.18,16,12),smooth(face));belly.scale.set(1,1.2,0.5);belly.position.set(0,0.47,0.17);hip.add(belly);
  const head=new THREE.Group();head.position.y=0.93;hip.add(head);
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.23,40,30),smooth(fur));head.add(hm);
  const fc=new THREE.Mesh(new THREE.SphereGeometry(0.16,32,24),smooth(face));fc.scale.set(1.05,0.85,0.55);fc.position.set(0,-0.03,0.15);head.add(fc);
  for(const s of[-1,1]){const ear=new THREE.Mesh(new THREE.SphereGeometry(0.08,20,14),smooth(face));ear.scale.z=0.5;ear.position.set(s*0.23,0.02,0);head.add(ear);
    const e=new THREE.Mesh(new THREE.BoxGeometry(0.045,0.06,0.02),lamb(0x1a1a1a));e.position.set(s*0.065,0.03,0.235);head.add(e)}
  const nose=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.025,0.02),lamb(0x6b4030));nose.position.set(0,-0.04,0.245);head.add(nose);
  const arms=[],legs=[];
  for(const s of[-1,1]){const a=new THREE.Group();a.position.set(s*0.25,0.68,0);const am=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.05,0.48,6),lamb(fur));am.position.y=-0.24;a.add(am);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),lamb(face));hd.position.y=-0.5;a.add(hd);hip.add(a);arms.push(a);
    const l=new THREE.Group();l.position.set(s*0.12,0.3,0);const lm=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.055,0.3,6),lamb(fur));lm.position.y=-0.15;l.add(lm);
    const ft=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.05,0.16),lamb(face));ft.position.set(0,-0.3,0.04);l.add(ft);hip.add(l);legs.push(l)}
  const tail=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.035,6,14,Math.PI*1.3),lamb(fur));tail.position.set(0,0.35,-0.28);tail.rotation.y=Math.PI/2;hip.add(tail);
  g.userData={hip,head,arms,legs,body};return g}
// 나뭇잎 사원증 (목걸이)
function badge(m){const g=new THREE.Group();m.userData.hip.add(g);
  const lf=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.2,0.02),lamb(0x4fbf6a));lf.position.set(0,0.52,0.25);g.add(lf);
  const tag=new THREE.Mesh(new THREE.PlaneGeometry(0.12,0.08),basic(0xffffff));tag.position.set(0,0.53,0.262);g.add(tag);
  for(const s of[-1,1]){const st=new THREE.Mesh(new THREE.BoxGeometry(0.015,0.22,0.015),lamb(0x4a7a3a));st.position.set(s*0.06,0.68,0.2);st.rotation.z=s*0.35;g.add(st)}
  return g}
function monkeySit(m){const u=m.userData;u.legs.forEach(l=>l.rotation.x=-1.4);u.hip.position.y=-0.15}
function coconut(){return new THREE.Mesh(new THREE.IcosahedronGeometry(0.13,0),lamb(0x6b4a2f))}
function banana(){const b=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.03,6,10,Math.PI*0.8),lamb(0xffd84d));return b}
// 모래에 그리는 판(진행도 k로 점점 그려짐)
function sandBoard(cw,ch,pw,ph,draw,col='#9a7446'){const c=document.createElement('canvas');c.width=cw;c.height=ch;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=0.012;
  let last=-1;m.userData.set=k=>{k=Math.round(clamp01(k)*90)/90;if(k===last)return;last=k;const x=c.getContext('2d');x.clearRect(0,0,cw,ch);GROOVE=col;draw(x,cw,ch,k);t.needsUpdate=true};m.userData.set(0);return m}
let GROOVE='#9a7446';
function grooveText(x,s,px,py,fs,k){if(k<=0)return;x.save();x.font=`900 ${fs}px "Noto Sans CJK KR"`;x.textAlign='left';x.textBaseline='middle';const w=x.measureText(s).width;
  x.beginPath();x.rect(px-w/2-4,py-fs,(w+8)*clamp01(k),fs*2);x.clip();x.fillStyle=GROOVE;x.fillText(s,px-w/2,py);x.restore()}
function grooveRect(x,px,py,w,h,k){if(k<=0)return;x.save();x.strokeStyle=GROOVE;x.lineWidth=9;x.lineCap='round';x.beginPath();const P=2*(w+h);let rem=P*clamp01(k);
  const seg=[[px,py,px+w,py],[px+w,py,px+w,py+h],[px+w,py+h,px,py+h],[px,py+h,px,py]];x.moveTo(px,py);
  for(const [a,b,c2,d] of seg){const L=Math.hypot(c2-a,d-b);if(rem<=0)break;const f=Math.min(1,rem/L);x.lineTo(a+(c2-a)*f,b+(d-b)*f);rem-=L}x.stroke();x.restore()}
function grooveLine(x,a,b,c2,d,k){if(k<=0)return;x.save();x.strokeStyle=GROOVE;x.lineWidth=9;x.lineCap='round';x.beginPath();x.moveTo(a,b);x.lineTo(a+(c2-a)*clamp01(k),b+(d-b)*clamp01(k));x.stroke();x.restore()}
// 나무 팻말
function signBoard(lines,o={}){const g=new THREE.Group();const w=o.w||2.6,h=o.h||1.1;const cw=900,ch=Math.round(900*h/w);
  const tex=canvasTex(cw,ch,(x)=>{x.fillStyle=o.bg||'#d9a76a';x.fillRect(0,0,cw,ch);x.strokeStyle='rgba(90,55,25,.35)';x.lineWidth=4;for(let i=1;i<5;i++){x.beginPath();x.moveTo(0,ch*i/5);x.lineTo(cw,ch*i/5+8);x.stroke()}
    x.strokeStyle='#7a4e28';x.lineWidth=18;x.strokeRect(9,9,cw-18,ch-18);x.fillStyle=o.fg||'#4a2a12';x.textAlign='center';x.textBaseline='middle';
    lines.forEach((s,i)=>{const fs=(o.fs||[150,90])[i]||90;x.font=`900 ${fs}px "Noto Sans CJK KR"`;x.fillText(s,cw/2,ch*(lines.length===1?0.53:[0.4,0.75][i]))})});
  const side=lamb(0xb9874e);const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.08),[side,side,side,side,new THREE.MeshLambertMaterial({map:tex}),side]);b.position.y=(o.y||1.4)+h/2;g.add(b);
  for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,(o.y||1.4)+h*0.6,6),lamb(0x8a6a44));p.position.set(s*w*0.38,((o.y||1.4)+h*0.6)/2,-0.06);g.add(p)}
  return g}
// 통나무 글자: 캔버스 글자를 격자로 샘플링해서 통나무 위치를 만듦
function textCells(rows,step){const c=document.createElement('canvas');c.width=1400;c.height=1400;const x=c.getContext('2d');x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';
  let y=0;const metas=[];rows.forEach(r_=>{metas.push(y);y+=r_.size*1.25});const H=y;const px=110;  // 월드 1 = px 픽셀
  rows.forEach((r_,i)=>{x.font=`900 ${r_.size*px}px "Noto Sans CJK KR"`;x.fillText(r_.text,700,700-H*px/2+(metas[i]+r_.size*0.62)*px)});
  const d=x.getImageData(0,0,1400,1400).data;const out=[];const sp=step*px;
  for(let yy=sp/2;yy<1400;yy+=sp)for(let xx=sp/2;xx<1400;xx+=sp){if(d[(Math.floor(yy)*1400+Math.floor(xx))*4+3]>120)out.push([(xx-700)/px,(yy-700)/px])}
  return out}
function logField(scene,src,dst,r,o={}){const geo=new THREE.CylinderGeometry(0.06,0.065,o.len||0.2,6);geo.rotateZ(Math.PI/2);
  const mats=[lamb(0x8a5a32),lamb(0x9a6a3e),lamb(0x7a4e2a)];const N=Math.max(src.length,dst.length);const logs=[];
  for(let i=0;i<N;i++){const m=new THREE.Mesh(geo,mats[i%3]);scene.add(m);
    const s=src[i]||[o.pile[0]+(r()-0.5)*1.4,o.pile[1]+(r()-0.5)*1.2,0.3];const d=dst[i]||[o.pile[0]+(r()-0.5)*1.4,o.pile[1]+(r()-0.5)*1.2,0.3];
    logs.push({m,s,d,ry:(r()-0.5)*0.3,rd:(r()-0.5)*0.15,del:r()})}
  return {logs,upd(k,spread=0.6){logs.forEach(q=>{const kk=ease((k-q.del*spread)/(1-spread));const x=q.s[0]+(q.d[0]-q.s[0])*kk,z=q.s[1]+(q.d[1]-q.s[1])*kk;
    const h=(q.s[2]||0)*(1-kk)+(q.d[2]||0)*kk;q.m.position.set(x,0.08+h+Math.sin(kk*Math.PI)*0.9,z);q.m.rotation.y=q.ry+(q.rd-q.ry)*kk})}}}
// 매칭: 가까운 것끼리 (x 정렬로 간단하게)
function sortCells(a){return a.slice().sort((p,q)=>p[0]-q[0]||p[1]-q[1])}
function office(scene,x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);
  const bam=lamb(0xb9c46a),bam2=lamb(0x9aab4f);
  for(const [px,pz] of [[-1.3,-0.9],[1.3,-0.9],[-1.3,0.9],[1.3,0.9]]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.4,6),bam);p.position.set(px,1.2,pz);g.add(p)}
  for(let i=0;i<9;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.6,6),i%2?bam:bam2);p.position.set(-1.2+i*0.3,0.8,-0.9);g.add(p)}
  const roof=new THREE.Mesh(new THREE.ConeGeometry(2.3,0.9,4),lamb(0x6aa860));roof.rotation.y=Math.PI/4;roof.position.y=2.8;roof.scale.z=0.75;g.add(roof);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.08,0.6),lamb(0xc8b06a));desk.position.set(0,0.75,-0.2);g.add(desk);
  for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.75,0.5),bam2);l.position.set(s*0.62,0.37,-0.2);g.add(l)}
  const sg=labelSprite('(주)무인도 본사',{bg:'#ffffff',fg:'#2b2b3a',fs:60,size:0.0042});sg.position.set(0,3.55,0);g.add(sg);
  return g}
function hat(m,col=0xffffff){const h=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.26,0.03,20),smooth(col));h.add(b);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.19,0.13,20),smooth(col));top.position.y=0.07;h.add(top);
  const bd=new THREE.Mesh(new THREE.CylinderGeometry(0.195,0.195,0.04,20),smooth(0x2b3a6b));bd.position.y=0.03;h.add(bd);
  h.position.y=0.2;m.userData.head.add(h);return h}
function coconutPile(g,r,n,rx,rz,h){for(let i=0;i<n;i++){const c=coconut();const a=r()*Math.PI*2,rr_=Math.sqrt(r());c.position.set(Math.cos(a)*rr_*rx,0.1+r()*h,Math.sin(a)*rr_*rz);c.rotation.set(r()*3,r()*3,0);g.add(c)}}
function boat(r){const g=new THREE.Group();const hull=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.5,3.4),lamb(0x9a6a3e));hull.position.y=0.25;g.add(hull);
  const bow=new THREE.Mesh(new THREE.ConeGeometry(0.8,1.0,4),lamb(0x9a6a3e));bow.rotation.x=-Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,0.45);bow.position.set(0,0.28,-2.15);g.add(bow);
  const rim=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.08,3.5),lamb(0x7a4e2a));rim.position.y=0.52;g.add(rim);
  const pile=new THREE.Group();pile.position.set(0,0.4,0.2);coconutPile(pile,r,70,0.65,1.4,0.5);g.add(pile);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.06,3.2,6),lamb(0x7a4e2a));mast.position.set(0,1.9,-0.4);g.add(mast);
  const tex=canvasTex(600,700,(x,w,h)=>{x.fillStyle='#fff8ea';x.fillRect(0,0,w,h);x.fillStyle='#e2553f';x.textAlign='center';x.textBaseline='middle';x.font='900 110px "Noto Sans CJK KR"';x.fillText('코코넛',w/2,h*0.36);x.fillText('수출 1호',w/2,h*0.58);x.font='900 70px "Noto Sans CJK KR"';x.fillStyle='#2b3a6b';x.fillText('(주)무인도',w/2,h*0.8)});
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.1),new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));sail.position.set(0,2.2,-0.36);g.add(sail);
  return g}

// ---------- S0 타이틀: 폭풍 → 떠밀려옴 → 손목시계 → 명함 → 모래 로드맵 ----------
S[0]=()=>{
  const scene=IS();const r=rng(901);const B=beach(scene,r,{shore:-2.5});
  palm(scene,-4.8,-0.8,1.35,0.35,0.3);palm(scene,5.2,0.2,1.25,-0.4,2.4);palm(scene,-6.8,2.5,1.1,0.2,1.2);rock(scene,3.9,-1.2,0.9);rock(scene,-3.6,2.6,0.6);
  for(let i=0;i<6;i++){const pl=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.06,0.22),lamb(0x9a7652));pl.position.set(-3+i*1.3+r()*0.4,0.03,-0.9+r()*1.2);pl.rotation.y=r()*3;scene.add(pl)}
  // 여행용이 아니라 출장 가방(서류가방)도 떠밀려옴
  for(const [x,z] of [[-2.2,4.4],[2.6,4.0]]){const bc=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.42,0.16),lamb(0x3a2a22));bc.position.set(x,0.08,z);bc.rotation.set(-Math.PI/2,0,0.6);scene.add(bc)}
  const ppl=crowd(r,12);const Q=[];
  const rows=[0.4,1.7,3.0];
  ppl.forEach((p,i)=>{const row=Math.floor(i/4),j=i%4;const cx=j<2?-2.5:2.5;const side=j%2?1:-1;const x=cx+side*0.48+(row===1?0.25:0),z=rows[row];
    const w=watch(p);const c=card(p);scene.add(p);Q.push({p,x,z,side,c,yaw0:(r()-0.5)*2.2,del:r()*0.6,rd:r()*0.3,row})});
  const L=leader();scene.add(L);watch(L);const st=stick(L,1.0);st.visible=false;
  const board=sandBoard(1200,900,3.8,2.85,(x,w,h,k)=>{
    const kk=i=>clamp01(k*6-i);
    grooveText(x,'무인도 탈출 로드맵',w/2,95,96,kk(0));
    const B_=[['1주차','거점 확보'],['2주차','식량 체계화'],['3주차','수출 개시'],['4주차','탈출']];
    B_.forEach(([a,b],i)=>{const bx=60+(i%2)*560,by=210+Math.floor(i/2)*330;grooveRect(x,bx,by,520,280,kk(1+i));grooveText(x,a,bx+260,by+85,78,kk(1.4+i));grooveText(x,b,bx+260,by+190,70,kk(1.6+i))});
    grooveLine(x,580,350,620,350,kk(5));});
  board.scale.setScalar(0.85);board.position.set(0.2,0.012,6.2);scene.add(board);
  const l1=ln(0,'l1'),n2=ln(0,'n2');const RISE=MK('rise'),WT=MK('watch'),CD=MK('card'),DR=MK('draw');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const tl=title();const fl=document.createElement('div');fl.className='fl';ui.appendChild(fl);
  const ck=chip('표류 3분째');ck.style.opacity=0;
  return t=>{
    const k=ease((t-0.4)/1.8);
    bgEl.style.background=`linear-gradient(${mixc('#4b566b','#7fc6ef',k)},${mixc('#8e9aab','#c9eef6',k)} 55%,${mixc('#a9b3bf','#eafaf8',k)})`;
    fl.style.opacity=t>0.3&&t<0.5?0.85*(1-(t-0.3)/0.2):0;
    B.upd(t*(1.6-k*0.8));
    Q.forEach((q,i)=>{const sl=1-ease((t-q.del)/2.0);const rk=clamp01((t-RISE-q.rd)/0.75);
      // 일어서면 정면, 명함 시간엔 짝꿍을 봄
      const ck_=ease((t-CD+0.4)/0.35);const yaw=rk<1?q.yaw0*(1-rk):(q.side>0?-Math.PI/2:Math.PI/2)*ck_;
      riseUp(q.p,q.x,q.z-sl*2.4,rk,yaw);q.p.userData.hip.rotation.x=0;q.p.userData.head.rotation.x=0;
      const wk=ease((t-WT-i*0.015)/0.25)*(1-ease((t-WT-1.3)/0.3));if(rk>=1&&wk>0)watchPose(q.p,wk);
      const ok=ease((t-CD-0.05)/0.3)*(1-ease((t-CD-1.7)/0.3));q.c.visible=ok>0.3;if(ok>0)offerPose(q.p,ok);
      if(t>DR){q.p.rotation.y=0;standPose(q.p);q.p.userData.hip.rotation.x=0;q.p.userData.head.rotation.x=0.15;q.c.visible=false}});
    // 리더: 앞줄 가운데에서 일어나 시계 → 말하기 → 모래에 그리기
    const lr=clamp01((t-RISE-0.1)/0.75);riseUp(L,0,4.4-(1-ease(t/2.2))*2.2,lr,1.3*(1-ease(lr*1.6)));const u=L.userData;u.head.rotation.x=0;u.mouth.visible=t>l1.t0&&t<l1.t1&&Math.sin(t*22)>0;
    const wk=ease((t-WT)/0.25)*(1-ease((t-WT-1.2)/0.3));if(lr>=1&&wk>0)watchPose(L,wk);
    if(t>l1.t0+0.2&&t<DR){u.arms[1].rotation.x=-0.9*ease((t-l1.t0-0.2)/0.3);u.arms[1].rotation.z=0.2}
    if(t>=DR){L.position.set(-1.25,0,4.55);L.rotation.y=0.35;st.visible=true;const dk=clamp01((t-DR-0.1)/(n2.t1-DR-0.2));board.userData.set(dk);
      u.hip.rotation.x=0.25;u.arms[1].rotation.set(-0.7+Math.sin(t*14)*0.18,0,0);u.head.rotation.x=0.3;L.position.x=-1.25+Math.sin(t*3)*0.05}
    else board.userData.set(0);
    const ex=t>=DR;
    if(!ex){cam.position.set(0,4.6,12.2-t*0.15);cam.lookAt(0,1.0,-1.2)}
    else{const c=ease((t-DR)/2.5);cam.position.set(0.2,8.2-c*0.4,11.6-c*0.4);cam.lookAt(0.2,0,6.8)}
    if(ex){chipPop(ck,t,DR+0.1)}
    tl(t,ex);caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- S1 원숭이 면접 → 사원증 → 코코넛 척척 ----------
S[1]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(911);const B=beach(scene,r,{shore:-6});
  const palms=[palm(scene,-2.4,-2.4,2.2,0.08,0.3),palm(scene,1.6,-3.2,2.4,-0.1,1.4),palm(scene,4.2,-1.4,2.0,0.12,2.2),palm(scene,-5,-1,1.9,-0.1,0.8)];
  rock(scene,-4.2,2.2,0.7);
  // 면접 세트(같은 해변, 앞쪽)
  const set=new THREE.Group();scene.add(set);
  const r1=rock(set,-0.95,2.6,0.75,0xa8a39a),r2=rock(set,0.95,2.6,0.75,0xa8a39a);
  const L=leader();set.add(L);const fd=folder(L,0);
  const mk=monkey();set.add(mk);const bn=banana();bn.position.set(0,-0.55,0.08);mk.userData.arms[1].add(bn);const bd=badge(mk);
  const kb=bub(mk,'끼끼',{y:1.45,size:0.0024,fs:70,bg:'#ffe9c2',fg:'#6b4030'});
  // 나무 위 원숭이들(사원증)
  const climbers=[];
  palms.forEach((pm,i)=>{for(let j=0;j<(i<3?2:1);j++){const m=monkey();badge(m);scene.add(m);const top=pm.userData.top.getWorldPosition(new THREE.Vector3());
    climbers.push({m,base:pm.position.clone(),top,ph:j*0.5+i*0.3,j})}});
  const cocos=[];for(let i=0;i<14;i++){const c=coconut();scene.add(c);const pm=palms[i%3];const tp=pm.userData.top.getWorldPosition(new THREE.Vector3());
    cocos.push({c,x:tp.x+(r()-0.5)*0.4,y0:tp.y-0.2,z:tp.z+(r()-0.5)*0.4,gx:-0.6+(i%5)*0.32+(r()-0.5)*0.1,gz:0.3+Math.floor(i/5)*0.3,gy:0.13+(i>=10?0.18:0),t0:i*0.18})}
  // 이달의 사원 액자
  const ptex=canvasTex(500,620,(x,w,h)=>{x.fillStyle='#fff4d6';x.fillRect(0,0,w,h);x.strokeStyle='#c9963e';x.lineWidth=26;x.strokeRect(13,13,w-26,h-26);
    x.fillStyle='#2b2b3a';x.textAlign='center';x.font='900 66px "Noto Sans CJK KR"';x.fillText('이달의 사원',w/2,100);
    x.fillStyle='#8a5a36';x.beginPath();x.arc(w/2,330,140,0,7);x.fill();x.fillStyle='#f2cfa6';x.beginPath();x.ellipse(w/2,350,105,85,0,0,7);x.fill();
    x.beginPath();x.arc(w/2-150,320,40,0,7);x.arc(w/2+150,320,40,0,7);x.fill();x.fillStyle='#1a1a1a';x.fillRect(w/2-50,315,18,26);x.fillRect(w/2+32,315,18,26);
    x.fillStyle='#4fbf6a';x.fillRect(w/2-40,500,80,60);x.fillStyle='#2b2b3a';x.font='900 44px "Noto Sans CJK KR"';x.fillText('끼끼 사원',w/2,590)});
  const frame=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.24),new THREE.MeshLambertMaterial({map:ptex}));frame.position.set(-0.4,1.75,-1.9);frame.rotation.y=0;scene.add(frame);const fp=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.3,6),lamb(0x8a6a44));fp.position.set(-0.4,0.65,-1.95);scene.add(fp);
  const l2=ln(1,'l2'),n3=ln(1,'n3');const BG=MK('badge'),CC=MK('coco');
  const below=crowd(r,3);below.forEach((p,i)=>{p.position.set(-3.2+i*1.1,0,-0.6+i*0.2);p.rotation.y=Math.PI*0.1;scene.add(p)});
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ck=chip('원숭이 정규직 0마리');ck.style.opacity=0;
  return t=>{B.upd(t);
    const wide=t<l2.t0-0.15||t>=n3.t0;
    set.visible=!wide;below.forEach(p=>p.visible=wide&&t<n3.t0);
    // 0~: 사람들이 코코넛을 못 땀(점프)
    below.forEach((p,i)=>{standPose(p);armUp(p,1,1);armUp(p,0,0.8);p.position.y=Math.max(0,Math.sin(t*7+i*1.3))*0.35});
    // 면접
    L.position.set(-1.05,-0.03,2.6);L.rotation.y=Math.PI/2;sitPose(L);L.userData.legs.forEach(l=>l.rotation.x=-1.15);const u=L.userData;u.arms[0].rotation.set(-1.0,0,0.3);u.head.rotation.x=t<l2.t0+1.6?0.3:0.05;u.mouth.visible=t>l2.t0&&t<l2.t1&&Math.sin(t*22)>0;
    mk.position.set(0.95,0.36,2.6);mk.rotation.y=-Math.PI/2;monkeySit(mk);mk.userData.arms[1].rotation.x=-0.9;mk.userData.head.rotation.z=Math.sin(t*3)*0.12;
    bd.visible=t>BG;bd.scale.setScalar(t>BG?pop((t-BG)/0.3):0.01);showB(kb,t,l2.t1+0.1,l2.t1+1.0);
    // 넓은 컷: 원숭이들이 나무를 오르내리며 코코넛
    climbers.forEach((q,i)=>{const lt=((t-n3.t0)*0.55+q.ph)%1;const up=lt<0.5?lt*2:2-lt*2;const y=0.1+up*(q.top.y-1.4);
      q.m.position.set(q.base.x+0.18+(q.top.x-q.base.x)*up,y,q.base.z+0.22);q.m.rotation.y=0.3;const u2=q.m.userData;u2.arms.forEach((a,k)=>a.rotation.x=-2.6+Math.sin(t*10+k*3)*0.3);u2.legs.forEach((l,k)=>l.rotation.x=-0.8+Math.sin(t*10+k*3)*0.4);
      q.m.visible=wide&&t>=n3.t0});
    cocos.forEach(q=>{const lt=t-n3.t0-q.t0;q.c.visible=wide&&t>=n3.t0&&lt>0;if(lt<0)return;const fall=Math.min(1,lt/0.55);
      const y=fall<1?q.y0-(q.y0-q.gy)*fall*fall:q.gy;const gx=fall<1?q.x+(q.gx-q.x)*fall:q.gx,gz=fall<1?q.z+(q.gz-q.z)*fall:q.gz;q.c.position.set(gx,y,gz)});
    frame.visible=fp.visible=wide&&t>n3.t0+1.6;frame.scale.setScalar(pop((t-n3.t0-1.6)/0.35)+0.001);
    if(wide&&t<l2.t0){cam.position.set(0,2.0,9.5);cam.lookAt(0,3.6,-2)}
    else if(!wide){const c=ease((t-l2.t0)/4);cam.position.set(0,2.3,10.6-c*0.7);cam.lookAt(0,1.0,2.6)}
    else{const c=ease((t-n3.t0)/3.5);cam.position.set(0.5,2.4,8.8-c*0.8);cam.lookAt(0,3.2,-2)}
    if(t>=n3.t0){const nn=Math.round(12*ease((t-n3.t0-0.3)/2.4));ck.innerHTML=`원숭이 정규직 0 → <b>${nn}</b>마리`;chipPop(ck,t,n3.t0)}
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- S2 첫날 밤 감성 → 회고 ----------
S[2]=()=>{
  sky('#141a3a','#2a2f5c','#4a4870');
  const scene=new THREE.Scene();addLights(scene,{hemi:0.55,sky:0x8890ff,ground:0x3a2a3a,dir:0.25});
  const fireL=new THREE.PointLight(0xffa860,14,9,1.4);fireL.position.set(0,1.0,-0.6);scene.add(fireL);
  const r=rng(921);beach(scene,r,{shore:-9,sea:0x2a3a6a,sea2:0x223060});stars(scene,260,r,{w:60,y0:4,h:30,z:-35});
  palm(scene,-4.4,-3,1.5,0.3,0.3);palm(scene,4.6,-3.5,1.4,-0.3,2);
  const F=fireMake(scene,0,-0.6);
  const ring=[];const ps=crowd(r,7);const ms=[monkey(),monkey()];ms.forEach(m=>badge(m));
  const seats=[[-2.2,0.5],[-2.3,-0.9],[-1.3,-2.0],[0.0,-2.4],[1.3,-2.0],[2.3,-0.9],[2.2,0.5]];
  ps.forEach((p,i)=>{const [x,z]=seats[i];p.position.set(x,0,z);p.rotation.y=Math.atan2(-x,-0.6-z);scene.add(p);ring.push({p,i,m:false})});
  [[-1.8,-1.6],[1.85,-1.55]].forEach(([x,z],i)=>{const m=ms[i];m.position.set(x,0,z);m.rotation.y=Math.atan2(-x,-0.6-z);scene.add(m);ring.push({p:m,i:7+i,m:true})});
  const L=leader();scene.add(L);const st=stick(L,1.0);
  const board=sandBoard(1200,700,3.6,2.1,(x,w,h,k)=>{const kk=i=>clamp01(k*5-i);
    grooveLine(x,400,40,400,h-30,kk(0));grooveLine(x,800,40,800,h-30,kk(0.5));grooveLine(x,30,170,w-30,170,kk(1));
    grooveText(x,'잘한 점',200,105,82,kk(1.6));grooveText(x,'아쉬운 점',600,105,82,kk(2.3));grooveText(x,'내일 할 일',1000,105,82,kk(3))},'#ffe2b0');
  board.position.set(0.3,0.012,2.0);for(const o of [board]){}scene.add(board);
  const n4=ln(2,'n4'),l3=ln(2,'l3');const CUT=MK('cut'),HD=MK('hands');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ck=chip('무인도 1일째 밤');
  F.g.traverse(o=>{if(o.material&&o.material.transparent)o.userData.smoke=1});
  return t=>{F.upd(t,1);F.g.traverse(o=>{if(o.userData.smoke)o.visible=false});fireL.intensity=13+Math.sin(t*17)*1.5+Math.sin(t*7)*1;
    ring.forEach(q=>{const p=q.p;if(q.m){monkeySit(p);p.position.y=0.18;p.userData.arms.forEach(a=>a.rotation.x=-0.5);
        if(t>HD){p.userData.arms[1].rotation.x=-2.9}}
      else{sitPose(p);p.position.y=0;const u=p.userData;u.head.rotation.x=t<CUT?0.2+Math.sin(t*1.2+q.i)*0.05:0;
        u.hip.rotation.z=t<CUT?Math.sin(t*1.1+q.i)*0.05:0;if(t>HD&&q.i%2===0){armUp(p,1,ease((t-HD-q.i*0.04)/0.25))}}});
    // 리더: 감성 컷에선 뒤에 앉아 있다가 CUT에 벌떡 일어나 칸을 그림
    const u=L.userData;
    if(t<CUT){L.position.set(0.2,0,-2.0);L.rotation.y=0;L.visible=false;st.visible=false}
    else{L.visible=true;st.visible=true;L.position.set(-1.95,0,2.15);L.rotation.y=Math.PI/2-0.3;standPose(L);u.hip.rotation.x=0.2;u.head.rotation.x=0.25;
      u.arms[1].rotation.set(-0.75+Math.sin(t*13)*0.2,0,0);u.mouth.visible=t>l3.t0&&t<l3.t1&&Math.sin(t*22)>0;
      if(t>l3.t0+1.2){u.arms[1].rotation.set(-1.2,0,0);u.hip.rotation.x=0;u.head.rotation.x=0}}
    board.userData.set((t-CUT-0.05)/2.0);
    if(t<CUT){const c=ease(t/CUT);cam.position.set(0,2.4,6.8-c*0.8);cam.lookAt(0,1.6,-1)}
    else{cam.position.set(0.2,6.6,8.6);cam.lookAt(0,0,2.3)}
    if(t>=CUT){ck.innerHTML='무인도 1일째 밤 · <b>회고 진행 중</b>'}
    chipPop(ck,t,0.05);caption(2,t);renderer.render(scene,cam);
  };
};

// ---------- S3 SOS → "근데 이게 최선이에요?" → '채용 중 · 경력 무관' → 부감 + 비행기 ----------
const SOS_CELLS=()=>textCells([{text:'SOS',size:2.7}],0.2);
const HIRE_CELLS=()=>textCells([{text:'채용 중',size:2.5},{text:'경력 무관',size:1.55}],0.15);
S[3]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(931);const B=beach(scene,r,{shore:-6.5});
  palm(scene,-5.6,-4.5,1.5,0.3,0.3);palm(scene,5.6,-4.2,1.4,-0.3,2);palm(scene,-6,4,1.3,0.2,1);palm(scene,6.2,4.5,1.3,-0.2,2.4);rock(scene,4.8,1.6,0.7);
  const sos=SOS_CELLS().map(([x,y])=>[x,y]);const hire=HIRE_CELLS();
  // SOS는 거의 완성(마지막 S의 끝 몇 개는 아직 옆에 쌓여 있음)
  const src=sortCells(sos),dst=sortCells(hire);
  const LF=logField(scene,src.map((c,i)=>i>src.length-10?[4.2+(i%3)*0.3,3.6+(i%2)*0.3,0.18]:c),dst,r,{pile:[4.3,3.5]});
  const ppl=crowd(r,8);const walkers=ppl.map((p,i)=>{scene.add(p);return {p,a:i/8*Math.PI*2,rad:2.2+(i%3)*1.0,sp:0.5+(i%3)*0.15}});
  const L=leader();scene.add(L);
  const pl=plane();pl.scale.setScalar(0.9);scene.add(pl);
  const l4=ln(3,'l4'),n5=ln(3,'n5');const MV=MK('move'),AE=MK('aerial');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ck=chip('무인도 2일째 · 구조 신호');
  return t=>{B.upd(t);
    LF.upd(clamp01((t-MV)/1.6),0.55);
    // 초반: 마지막 통나무 몇 개를 SOS에 올려 거의 완성
    walkers.forEach((q,i)=>{const p=q.p;standPose(p);
      if(t<l4.t0||t>MV){const a=q.a+t*q.sp*(t>MV?1.8:0.6);p.position.set(Math.cos(a)*q.rad,0,Math.sin(a)*q.rad*0.8+0.2);p.rotation.y=-a;walkPose(p,t*(t>MV?11:7)+i)}
      else{p.rotation.y=Math.atan2(2.6-p.position.x,3.4-p.position.z);u0(p)}
      if(t>MV&&t<AE){armUp(p,0,0.55);armUp(p,1,0.55)}
      if(t>=AE){p.position.set(-3.2+i*0.9,0,-3.4);p.rotation.y=Math.PI;standPose(p);armUp(p,1,0.9)}});
    function u0(p){standPose(p)}
    L.position.set(2.0,0,3.4);L.rotation.y=-0.4;standPose(L);crossArms(L,1);const u=L.userData;u.head.rotation.y=Math.sin(t*0.8)*0.1;u.mouth.visible=t>l4.t0&&t<l4.t1&&Math.sin(t*22)>0;
    if(t>l4.t0&&t<l4.t1+0.3){u.head.rotation.z=0.15}
    const aerial=t>=AE;L.visible=true;
    pl.visible=aerial;if(aerial){const k=(t-AE-0.4)/3.2;pl.position.set(-9+k*18,9,-3+k*2);pl.rotation.set(0,0.12,0)}
    if(!aerial){const c=ease((t)/MV);cam.position.set(0.6,7.2-c*0.4,12.6-c*1.0);cam.lookAt(0.6,0.3,0.6)}
    else{const c=ease((t-AE)/3);cam.position.set(0,22-c*1.2,0.6);cam.up.set(0,0,-1);cam.lookAt(0,0,0.3)}
    if(!aerial)cam.up.set(0,1,0);
    if(aerial){ck.innerHTML='구조 신호 → <b>채용 공고</b>'}
    chipPop(ck,t,0.05);caption(3,t);renderer.render(scene,cam);
  };
};

// ---------- S4 3주째: 코코넛 수출 1호 출항 ----------
S[4]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(941);const B=beach(scene,r,{shore:-1.5});
  palm(scene,-5.5,2.2,1.4,0.3,0.3);palm(scene,6,3.5,1.3,-0.3,2);
  office(scene,-2.9,-0.4,0.45);
  const bt=boat(r);scene.add(bt);
  const cap=monkey();badge(cap);hat(cap);bt.add(cap);cap.position.set(0,0.5,-1.55);cap.rotation.y=Math.PI;
  const ppl=crowd(r,9);const L=leader();const all=[L,...ppl];
  all.forEach((p,i)=>{p.position.set(-0.7+i*0.55+(i%2)*0.1,0,1.0+(i%3)*0.4);p.rotation.y=Math.PI;scene.add(p)});
  const pile=new THREE.Group();pile.position.set(2.8,0,1.2);coconutPile(pile,r,26,0.8,0.5,0.5);scene.add(pile);
  const n6=ln(4,'n6');const Ls=n6.parts.map(p=>p.length),tot=Ls.reduce((a,b)=>a+b,0);const P2=n6.t0+(n6.t1-n6.t0)*Ls[0]/tot,P3=P2+(n6.t1-n6.t0)*Ls[1]/tot;
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ck=chip('무인도 3주째');
  const stt=document.createElement('div');stt.className='stat';stt.innerHTML='탈출 <b>0</b>명 · 수출 <b>1,200</b>개';stt.style.opacity=0;ui.appendChild(stt);
  return t=>{B.upd(t);
    const go=ease((t-P2+0.2)/(P3-P2+1.5));bt.position.set(0.6,-0.12+Math.sin(t*2.4)*0.05,-3.0-go*11);bt.rotation.set(Math.sin(t*1.7)*0.03,0.05,Math.sin(t*2.1)*0.04);
    cap.userData.arms[1].rotation.x=t>P2?-2.9:-0.3;cap.userData.arms[1].rotation.z=t>P2?0.3+Math.sin(t*9)*0.3:0;
    all.forEach((p,i)=>{standPose(p);if(t<P2){if(i>0&&i%2===0){armUp(p,1,0.9)}p.rotation.y=Math.PI}
      else{p.rotation.y=Math.PI;wave(p,t,1,i);if(i%3===0)wave(p,t,0,i+1)}});
    L.userData.mouth.visible=false;
    if(t<P2){const c=ease(t/P2);cam.position.set(3.2,6.0,11.5-c*0.6);cam.lookAt(-0.6,0.6,-1.2)}
    else{const c=ease((t-P2)/3.5);cam.position.set(3.2-c*1.2,6.0+c*0.4,10.9-c*0.3);cam.lookAt(-0.3,0.6,-1.2-c*4)}
    chipPop(ck,t,0.05);
    stt.style.opacity=clamp01((t-P3+0.1)/0.1);stt.style.transform=`translateX(-50%) scale(${pop((t-P3+0.1)/0.3)})`;
    caption(4,t);renderer.render(scene,cam);
  };
};

// ---------- S5 구조 헬기 → 면접 → 합격 ----------
S[5]=()=>{
  sky('#7fc6ef','#c9eef6','#eafaf8');
  const scene=IS();const r=rng(951);const B=beach(scene,r,{shore:-7});
  palm(scene,-5.8,-4.6,1.5,0.3,0.3);palm(scene,5.8,-4.2,1.4,-0.3,2);
  const hire=HIRE_CELLS();const geo=new THREE.CylinderGeometry(0.06,0.065,0.2,6);geo.rotateZ(Math.PI/2);
  const LG=new THREE.Group();scene.add(LG);hire.forEach(([x,z],i)=>{const m=new THREE.Mesh(geo,lamb([0x8a5a32,0x9a6a3e,0x7a4e2a][i%3]));m.position.set(x,0.08,z);m.rotation.y=((i*1.7)%1-0.5)*0.2;LG.add(m)});
  const HL=heli();HL.scale.setScalar(1.05);scene.add(HL);
  const R=rescuer(r);scene.add(R);
  // 면접 세트
  const set=new THREE.Group();scene.add(set);
  const sand=new THREE.Mesh(new THREE.PlaneGeometry(30,30),lamb(SAND));sand.rotation.x=-Math.PI/2;set.add(sand);
  const of=office(set,0,-0.4,0);of.children.forEach(o=>{if(o.position.z>0.5&&o.geometry&&o.geometry.type==='CylinderGeometry')o.visible=false;if(o.isSprite)o.visible=false});
  const L=leader();set.add(L);folder(L,0);const mk=monkey();badge(mk);set.add(mk);const R2=rescuer(r);set.add(R2);
  const stump=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.3,0.45,8),lamb(0x8a6a44));stump.position.set(0,0.22,1.55);set.add(stump);const st2=stump.clone();st2.position.set(0,0.22,-1.3);set.add(st2);
  const rb=bub(R2,'…네?',{y:1.75,size:0.0024,fs:70,bg:'#fff4b8',fg:'#5a4a10'});
  const r1=ln(5,'r1'),l5=ln(5,'l5'),r2=ln(5,'r2');const SIT=MK('sit'),PS=MK('pass');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ck=chip('구조대원 1명 → 신입 사원 1명');ck.style.opacity=0;
  const stp=document.createElement('div');stp.className='stampx';stp.textContent='합격';stp.style.opacity=0;ui.appendChild(stp);
  return t=>{B.upd(t);
    const dk=ease(t/1.6);HL.position.set(3.4,1.3+(1-dk)*6,-1.2);HL.rotation.y=-0.4+(1-dk)*0.3;HL.userData.rot.rotation.y=t*30;
    standPose(R);R.position.set(2.3,t<1.7?-5:0,0.4);R.rotation.y=-0.5;if(t>r1.t0-0.1){armUp(R,1,1);armUp(R,0,0.6)}
    const desk=t>=SIT;
    // 면접: 리더 책상 뒤, 원숭이 면접관 옆, 구조대원 맞은편 그루터기
    L.position.set(0,0,-1.25);L.rotation.y=0;sitPose(L);L.userData.arms[0].rotation.set(-1.25,0,0.25);L.userData.arms[1].rotation.set(-1.05,0,-0.1);L.userData.mouth.visible=t>l5.t0&&t<l5.t1&&Math.sin(t*22)>0;
    mk.position.set(0.15,0.95,-0.5);mk.rotation.y=Math.PI/2.6;monkeySit(mk);mk.userData.arms.forEach(a=>a.rotation.x=-1.2);mk.userData.head.rotation.z=Math.sin(t*2.6)*0.1;
    R2.position.set(0,-0.08,1.45);R2.rotation.y=Math.PI;sitPose(R2);R2.userData.head.rotation.z=t>r2.t0-0.1?0.22:0;
    showB(rb,t,r2.t0,r2.t1+0.7);
    if(!desk){cam.position.set(-0.6,2.8,10.5);cam.lookAt(1.9,1.8,-0.5)}
    else{const c=ease((t-SIT)/4);cam.position.set(10.2-c*0.8,2.4,0.1);cam.lookAt(0,1.1,0.1)}
    // 넓은 컷 오브젝트 숨김/세트 보이기
    set.visible=desk;HL.visible=!desk;R.visible=!desk;LG.visible=!desk;
    if(desk){ck.style.opacity=1}chipPop(ck,t,PS);if(t<PS)ck.style.opacity=0;
    stp.style.opacity=t>PS?clamp01(1-(t-PS-1.4)/0.3):0;stp.style.transform=`translateX(-50%) rotate(-12deg) scale(${t>PS?1+(1-pop((t-PS)/0.25))*1.4:2})`;
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6 30일째: 리조트로 팔고 헬기로 떠남 → 엔딩 카드 ----------
S[6]=()=>{
  sky('#ffb37a','#ffd9a8','#fff0d6');
  const scene=IS();const r=rng(961);const B=beach(scene,r,{shore:-5,sea:0x6cc0cf,sea2:0x5aaec4});
  palm(scene,-5.4,-2.6,1.6,0.3,0.3);palm(scene,5.6,-3.2,1.5,-0.3,2);palm(scene,-6.4,3,1.3,0.2,1);
  const sg=signBoard(['리조트 오픈 예정','(주)무인도 → 매각 완료'],{w:3.4,h:1.5,fs:[120,72],y:1.3});sg.position.set(-0.9,0,0.6);scene.add(sg);
  const sold=labelSprite('SOLD',{bg:'#e2335a',fg:'#ffffff',fs:70,size:0.0055,r:12});sold.position.set(-0.4,3.05,0.32);scene.add(sold);
  const HL=heli();HL.scale.setScalar(1.2);scene.add(HL);
  // 헬기 문 옆에 손 흔드는 사람들 + 조종석의 구조대원
  const riders=crowd(r,4).map((p,i)=>{p.scale.setScalar(0.55);p.position.set(-0.9+i*0.55,-0.75,0.95);HL.add(p);return p});
  const pilot=rescuer(r);pilot.scale.setScalar(0.5);pilot.position.set(0.9,-0.6,0.3);pilot.rotation.y=Math.PI/2;HL.add(pilot);
  const ms=[0,1,2,3].map(i=>{const m=monkey();badge(m);scene.add(m);m.position.set(-1.6+i*1.05,0,3.6+(i%2)*0.4);m.rotation.y=Math.PI*0.95;return m});
  const L=leader();scene.add(L);const buyer=makePerson(r,{shirt:0xf2f2f2,pants:0xd9c9a8});scene.add(buyer);
  const ctr=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.02,0.4),lamb(0xffffff));ctr.position.set(0,-0.66,0.1);buyer.userData.arms[0].add(ctr);
  const n8=ln(6,'n8');const Ls=n8.parts.map(p=>p.length),tot=Ls.reduce((a,b)=>a+b,0);const P2=n8.t0+(n8.t1-n8.t0)*Ls[0]/tot;const TK=1.7,EN=MK('end');
  const cam=new THREE.PerspectiveCamera(46,W/H,0.1,300);
  const ck=chip('무인도 30일째');
  const dim=document.createElement('div');dim.className='fl';dim.style.background='rgba(20,15,35,1)';ui.appendChild(dim);
  const e1=document.createElement('div');e1.className='end1 out';e1.textContent='다음 무인도편은?';ui.appendChild(e1);
  const e2=document.createElement('div');e2.className='end2 out';e2.textContent='팔로우하고 기다려 주세요';ui.appendChild(e2);
  return t=>{B.upd(t);
    const up=t<TK?0:ease((t-TK)/3.2);HL.position.set(2.0-up*1.5,1.45+up*6.5,-1.2-up*2);HL.rotation.set(0,-0.35,up*0.08);HL.userData.rot.rotation.y=t*(t<TK?18:32);
    riders.forEach((p,i)=>{standPose(p);sitPose(p);p.visible=t>=TK;wave(p,t,1,i)});
    pilot.userData&&sitPose(pilot);
    // 악수(0~TK): 리더와 바이어
    L.visible=buyer.visible=t<TK;L.position.set(0.2,0,2.4);L.rotation.y=Math.PI/2;buyer.position.set(1.1,0,2.4);buyer.rotation.y=-Math.PI/2;standPose(L);standPose(buyer);
    const sh=Math.sin(t*14)*0.12;L.userData.arms[1].rotation.set(-1.1+sh,0,-0.15);buyer.userData.arms[1].rotation.set(-1.1-sh,0,0.15);buyer.userData.arms[0].rotation.set(-0.6,0,0);
    ms.forEach((m,i)=>{m.position.y=Math.max(0,Math.sin(t*8+i))*0.15;const u=m.userData;u.arms[1].rotation.x=t>TK?-2.8:-0.3;u.arms[1].rotation.z=t>TK?Math.sin(t*10+i)*0.4:0;m.visible=t>=TK});
    sold.visible=t>P2;scaleBubble(sold,pop((t-P2)/0.3));
    if(t<TK){cam.position.set(0.7,2.2,7.2);cam.lookAt(0.2,1.7,1.5)}
    else if(t<P2){const c=ease((t-TK)/2.5);cam.position.set(0.4,2.4+c*0.5,9.6);cam.lookAt(0.6,2.6+c*2.5,-1)}
    else{const c=ease((t-P2)/1.6);cam.position.set(0.4-c*1.4,2.9-c*0.4,9.6-c*0.9);cam.lookAt(0.6-c*1.6,5-c*3.4,-1+c*1.2)}
    chipPop(ck,t,0.05);if(t>EN)ck.style.opacity=0;
    const ek=clamp01((t-EN)/0.3);dim.style.opacity=ek*0.78;
    e1.style.opacity=ek;e1.style.transform=`scale(${pop((t-EN)/0.35)})`;e2.style.opacity=clamp01((t-EN-0.3)/0.2);e2.style.transform=`scale(${pop((t-EN-0.3)/0.35)})`;
    caption(6,t,EN);renderer.render(scene,cam);
  };
};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
