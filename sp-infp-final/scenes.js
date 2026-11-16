
// ---------- INFP 결승전편 전용 ----------
function setSky(a,b){bgEl.style.background=`linear-gradient(${a},${b})`}
function topB(b){b.material.depthTest=false;b.renderOrder=10;return b}
function show(b,t,t0,t1){scaleBubble(b,t>=t0&&t<t1?pop((t-t0)/0.25):0)}
const sh=(el,on)=>{el.style.display=on?'':'none'};
const lerp=(a,b,k)=>a+(b-a)*k;
function eyesOf(p){return p.userData.head.children.filter(m=>m.geometry&&m.geometry.parameters&&m.geometry.parameters.width===0.05)}
function cheeksOf(p){return p.userData.head.children.filter(m=>m.geometry&&m.geometry.parameters&&m.geometry.parameters.width===0.07)}
const TA={shirt:0xb48be0,shorts:0xffffff,sock:0xb48be0,num:'#ffffff'};   // 우리 INFP 나라 (라벤더)
const TB={shirt:0x7fcdb6,shorts:0x2f4a5a,sock:0x7fcdb6,num:'#1f3b45'};   // 상대 INFP 나라 (민트)
const GKA={shirt:0xffd36b,shorts:0x3a3a4a,sock:0xffd36b,num:'#3a2a00'};  // 상대 골키퍼
const _c1=new THREE.Color(),_c2=new THREE.Color();
function numTex(n,col){return canvasTex(128,128,(x)=>{x.font=`900 100px ${FONT}`;x.fillStyle=col;x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,70)})}
function player(r,team,num,o={}){
  const p=addFace(makePerson(r,{shirt:team.shirt,pants:team.sock,hair:o.hair}));const u=p.userData;
  u.legs.forEach(l=>{l.children[0].material=lamb(team.sock);l.children[1].material=lamb(0x2b2b30)});
  for(const s of[-1,1]){const th=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.26,0.24),lamb(SKIN[0]));th.position.set(0,-0.2,0);u.legs[s<0?0:1].add(th)}
  const sh_=new THREE.Mesh(new THREE.BoxGeometry(0.56,0.28,0.35),lamb(team.shorts));sh_.position.y=-0.06;u.hip.add(sh_);
  if(num!=null){const m=new THREE.MeshBasicMaterial({map:numTex(num,team.num),transparent:true});
    const b=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.34),m);b.position.set(0,0.36,-0.165);b.rotation.y=Math.PI;u.hip.add(b);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(0.15,0.15),m);f.position.set(0.13,0.5,0.165);u.hip.add(f)}
  if(o.gloves){u.arms.forEach(a=>{a.children[1].material=lamb(0xf2f2f2);a.children[1].scale.setScalar(1.5)})}
  u.cheekCol=cheeksOf(p).map(c=>c.material);setFace(p,true);return p}
// 볼 빨개짐 (부끄러움)
function blush(p,k){cheeksOf(p).forEach(c=>{c.scale.set(1+k*1.2,1+k*1.6,1);_c1.setHex(0xf2a3a3);_c2.setHex(0xff5c86);c.material.color.copy(_c1.lerp(_c2,k))})}
function handsFace(p,k){const u=p.userData;u.arms[0].rotation.x=-2.75*k;u.arms[1].rotation.x=-2.75*k;u.arms[0].rotation.z=0.75*k;u.arms[1].rotation.z=-0.75*k}
function sweat(p){const d=new THREE.Mesh(new THREE.SphereGeometry(0.045,16,12),new THREE.MeshBasicMaterial({color:0x9fd8ff,transparent:true,opacity:0.95}));d.scale.y=1.4;d.position.set(0.24,0.42,0.12);p.userData.head.add(d);d.visible=false;p.userData.sw=d;return d}
function sweatK(p,t,on){const d=p.userData.sw||sweat(p);d.visible=on;if(on){d.position.y=0.42-((t*0.9)%1)*0.25}}
function tremble(p,t,k){const u=p.userData;u.head.rotation.z=Math.sin(t*38)*0.025*k;eyesOf(p).forEach(e=>{e.scale.y=1-0.25*k+Math.sin(t*30)*0.12*k})}
function kickLeg(p,k){const l=p.userData.legs[1];l.rotation.x=k<0.5?lerp(0,0.9,ease(k/0.5)):lerp(0.9,-1.3,ease((k-0.5)/0.5))}
function runPose(p,t,amp=0.8){walkPose(p,t*11,amp)}
// 공
function ballTex(){return canvasTex(256,128,(x,w,h)=>{x.fillStyle='#fafafa';x.fillRect(0,0,w,h);x.fillStyle='#2a2a33';
  const P=[[30,30],[100,70],[170,25],[230,80],[60,105],[140,110],[210,10]];P.forEach(([a,b])=>{x.beginPath();for(let i=0;i<5;i++){const an=i/5*Math.PI*2-Math.PI/2;x.lineTo(a+Math.cos(an)*16,b+Math.sin(an)*16)}x.closePath();x.fill()})})}
let BT=null;
function ball(scene,s=1){BT=BT||ballTex();const b=new THREE.Mesh(new THREE.SphereGeometry(0.12,24,16),new THREE.MeshLambertMaterial({map:BT}));b.scale.setScalar(s);scene.add(b);return b}
// 경기장
function pitchTex(){return canvasTex(680,1050,(x,w,h)=>{for(let i=0;i<14;i++){x.fillStyle=i%2?'#7cc47a':'#86cd83';x.fillRect(0,i*h/14,w,h/14)}
  x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=4;x.strokeRect(10,10,w-20,h-20);x.beginPath();x.moveTo(10,h/2);x.lineTo(w-10,h/2);x.stroke();
  x.beginPath();x.arc(w/2,h/2,91,0,Math.PI*2);x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(w/2,h/2,5,0,Math.PI*2);x.fill();
  for(const s of[0,1]){const y0=s?h-10:10,d=s?-1:1;x.strokeRect(w/2-201,s?h-10-165:10,402,165);x.strokeRect(w/2-92,s?h-10-55:10,184,55);x.beginPath();x.arc(w/2,y0+d*110,5,0,Math.PI*2);x.fill()}})}
function crowdTex(seed=5,o={}){const r=rng(seed);return canvasTex(1024,256,(x,w,h)=>{x.fillStyle=o.bg||'#5a4f78';x.fillRect(0,0,w,h);
  const C=['#ffd3e8','#e7c6ff','#c9b4ff','#bfe9dd','#fff1b8','#ffffff','#b48be0','#7fcdb6','#ffb3c7'];
  for(let row=0;row<16;row++)for(let i=0;i<64;i++){const cx=i*16+8+(row%2)*8+(r()-0.5)*3,cy=row*16+8;x.fillStyle=C[Math.floor(r()*C.length)];x.beginPath();x.arc(cx,cy,5.6,0,Math.PI*2);x.fill()}})}
function stadium(scene,o={}){
  const p=new THREE.Mesh(new THREE.PlaneGeometry(68,105),new THREE.MeshLambertMaterial({map:pitchTex()}));p.rotation.x=-Math.PI/2;scene.add(p);
  const sur=new THREE.Mesh(new THREE.PlaneGeometry(220,260),lamb(0x6fb46d));sur.rotation.x=-Math.PI/2;sur.position.y=-0.02;scene.add(sur);
  const ct=crowdTex(o.seed||5);ct.wrapS=ct.wrapT=THREE.RepeatWrapping;ct.repeat.set(10,2);
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(110,62,34,72,1,true),new THREE.MeshBasicMaterial({map:ct,side:THREE.BackSide,color:0xd8d0ea}));bowl.position.y=15;bowl.scale.z=1.3;scene.add(bowl);
  const wall=new THREE.Mesh(new THREE.CylinderGeometry(62,62,2.4,72,1,true),new THREE.MeshLambertMaterial({color:0x6c5f96,side:THREE.BackSide}));wall.position.y=1.2;wall.scale.z=1.3;scene.add(wall);
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(120,104,4,72,1,true),new THREE.MeshLambertMaterial({color:0x3e3a5c,side:THREE.DoubleSide}));roof.position.y=33;roof.scale.z=1.3;scene.add(roof);
  const lights=[];for(const [x,z] of [[-70,-80],[70,-80],[-70,80],[70,80]]){const g=glowSprite('rgba(255,250,225,1)',22);g.position.set(x,44,z);scene.add(g);lights.push(g)}
  const goals=[goal(scene,-52.5),goal(scene,52.5,true)];
  return {bowl,goals}}
function goal(scene,z,flip){const g=new THREE.Group();const m=lamb(0xffffff);
  for(const s of[-1,1]){const post=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.44,10),m);post.position.set(s*3.66,1.22,0);g.add(post)}
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,7.32,10),m);bar.rotation.z=Math.PI/2;bar.position.y=2.44;g.add(bar);
  const nt=canvasTex(256,128,(x,w,h)=>{x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=2;for(let i=0;i<=w;i+=10){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}for(let j=0;j<=h;j+=10){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke()}});
  const nm=new THREE.MeshBasicMaterial({map:nt,transparent:true,side:THREE.DoubleSide,depthWrite:false});
  const back=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.44),nm);back.position.set(0,1.22,-1.6);g.add(back);
  const top=new THREE.Mesh(new THREE.PlaneGeometry(7.32,1.6),nm);top.rotation.x=Math.PI/2;top.position.set(0,2.44,-0.8);g.add(top);
  for(const s of[-1,1]){const sd=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2.44),nm);sd.rotation.y=Math.PI/2;sd.position.set(s*3.66,1.22,-0.8);g.add(sd)}
  g.position.z=z;if(flip)g.rotation.y=Math.PI;scene.add(g);return g}
function dayLights(scene,o={}){addLights(scene,{hemi:o.hemi??1.55,dir:o.dir??1.5,dpos:[8,16,10]})}
function stadiumSky(){setSky('#b9a8f0','#ffe3f1 75%')}
// 사람 소품
function cameraRig(){const g=new THREE.Group();const bd=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.32,0.62),lamb(0x2d2d36));bd.position.y=1.35;g.add(bd);
  const ln=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.13,0.3,14),lamb(0x1d1d24));ln.rotation.x=Math.PI/2;ln.position.set(0,1.35,0.42);g.add(ln);
  const gl=new THREE.Mesh(new THREE.CircleGeometry(0.09,14),basic(0x6fa8ff));gl.position.set(0,1.35,0.58);g.add(gl);
  const rl=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),basic(0xff3333));rl.position.set(0.12,1.53,0.2);g.add(rl);
  for(let i=0;i<3;i++){const lg=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,1.3,6),lamb(0x55555f));const a=i/3*Math.PI*2;lg.position.set(Math.cos(a)*0.22,0.6,Math.sin(a)*0.22);lg.rotation.set(Math.sin(a)*0.3,0,-Math.cos(a)*0.3);g.add(lg)}
  g.userData.rl=rl;return g}
function bench(scene,x,z,w=4){const b=new THREE.Mesh(new THREE.BoxGeometry(w,0.12,0.6),lamb(0xc9a57a));b.position.set(x,0.5,z);scene.add(b);
  for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.5,0.5),lamb(0x8a6a4a));l.position.set(x+s*(w/2-0.2),0.25,z);scene.add(l)}}
function signTex(on){return canvasTex(256,96,(x,w,h)=>{x.fillStyle=on?'#e8455a':'#4cc38a';rr(x,4,4,w-8,h-8,20);x.fill();x.font=`900 46px ${FONT}`;x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.fillText(on?'사용 중':'비어 있음',w/2,h/2+3)})}
const SIGN_ON=signTex(true),SIGN_OFF=signTex(false);
function mom(r){const p=addFace(makePerson(r,{shirt:0xf3b8a8,pants:0x6a5a7a,hair:0x3a2a24}));const h=p.userData.head;
  const bun=new THREE.Mesh(new THREE.SphereGeometry(0.13,30,20),smooth(0x3a2a24));bun.position.set(0,0.47,-0.12);h.add(bun);
  const ap=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.5,0.02),lamb(0xfff3e6));ap.position.set(0,0.2,0.17);p.userData.hip.add(ap);setFace(p,false);return p}
function granny(r){const p=addFace(makePerson(r,{shirt:0xd98a9a,pants:0x6a6a7a,hair:0xd8d8de}));const h=p.userData.head;h.children[1].material=smooth(0xdedee6);
  const bun=new THREE.Mesh(new THREE.SphereGeometry(0.12,30,20),smooth(0xe4e4ec));bun.position.set(0,0.5,-0.08);h.add(bun);
  for(const s of[-1,1]){const g=new THREE.Mesh(new THREE.TorusGeometry(0.055,0.012,8,20),basic(0x8a6a4a));g.position.set(s*0.09,0.25,0.25);h.add(g)}
  const cd=new THREE.Mesh(new THREE.BoxGeometry(0.56,0.66,0.36),lamb(0xc9a0c8));cd.position.y=0.31;p.userData.hip.add(cd);setFace(p,false);return p}
function bannerTex(){return canvasTex(768,256,(x,w,h)=>{x.fillStyle='#fffaf0';x.fillRect(0,0,w,h);x.strokeStyle='#e8a0b8';x.lineWidth=10;x.strokeRect(8,8,w-16,h-16);
  x.font=`900 92px ${FONT}`;x.fillStyle='#d6336c';x.textAlign='center';x.textBaseline='middle';x.fillText('우리 손주 화이팅',w/2,h/2-6);x.fillStyle='#e85a8a';x.font=`900 50px ${FONT}`;x.fillText('♥ ♥ ♥',w/2,h-38)})}
function standRows(scene,r,o={}){const g=new THREE.Group();const ppl=[];
  for(let row=0;row<(o.rows||4);row++){const st=new THREE.Mesh(new THREE.BoxGeometry(o.w||14,0.5,1.2),lamb(row%2?0x8f84b8:0x9a90c2));st.position.set(0,row*0.55+0.25,-row*1.2);g.add(st);
    for(let i=0;i<(o.n||10);i++){const x=-(o.w||14)/2+0.8+i*((o.w||14)-1.6)/((o.n||10)-1);if(o.skip&&o.skip(row,i))continue;
      const p=addFace(makePerson(r,{shirt:pick(r,[0xb48be0,0xd9b3ff,0xffc2dc,0xffffff,0xbfe9dd,0xe7c6ff])}));sitPose(p);p.position.set(x+(r()-0.5)*0.2,row*0.55+0.5,-row*1.2);setFace(p,r()<0.5);g.add(p);ppl.push(p)}}
  scene.add(g);return {g,ppl}}
function livingRoom(scene){const fl=new THREE.Mesh(new THREE.PlaneGeometry(12,12),lamb(0xd9b99a));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const w=new THREE.Mesh(new THREE.PlaneGeometry(12,6),lamb(0xf2dfd0));w.position.set(0,3,-2.5);scene.add(w);
  const sofa=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.5,0.9),lamb(0x9a86c8));sofa.position.set(0,0.3,-1.6);scene.add(sofa);
  const sb=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.8,0.25),lamb(0x8a76b8));sb.position.set(0,0.75,-2.05);scene.add(sb);
  const fr=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.7),lamb(0xf7f0e0));fr.position.set(-1.4,2.2,-2.48);scene.add(fr);
  const tvGlow=new THREE.PointLight(0x9fe0ff,4,6,1.4);tvGlow.position.set(0,1.2,1.4);scene.add(tvGlow);return {tvGlow}}
function boothSet(scene,r){const fl=new THREE.Mesh(new THREE.PlaneGeometry(10,10),lamb(0x4a4560));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(8,3.4),new THREE.MeshBasicMaterial({map:canvasTex(512,220,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#b9a8f0');g.addColorStop(0.45,'#ffe3f1');g.addColorStop(0.46,'#86cd83');g.addColorStop(1,'#6fb46d');x.fillStyle=g;x.fillRect(0,0,w,h);
    x.fillStyle='rgba(90,79,120,.85)';x.fillRect(0,40,w,50);const rr_=rng(3);for(let i=0;i<220;i++){x.fillStyle=['#ffd3e8','#e7c6ff','#fff1b8','#bfe9dd'][i%4];x.fillRect(rr_()*w,44+rr_()*42,4,4)}})}));win.position.set(0,2.3,-2.2);scene.add(win);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(8.3,0.18,0.2),lamb(0x2e2a40));fr.position.set(0,0.6,-2.15);scene.add(fr);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.12,1.1),lamb(0xd8c6a8));desk.position.set(0,0.95,0.2);scene.add(desk);
  const front=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.9,0.08),lamb(0x7a64b0));front.position.set(0,0.5,0.75);scene.add(front);
  const lbl=new THREE.Mesh(new THREE.PlaneGeometry(1.8,0.32),new THREE.MeshBasicMaterial({map:canvasTex(512,90,(x,w,h)=>{x.font=`900 58px ${FONT}`;x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.fillText('INFP 스포츠 중계',w/2,h/2+3)}),transparent:true}));lbl.position.set(0,0.62,0.8);lbl.scale.setScalar(0.6);scene.add(lbl);
  const mon=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.45,0.05),lamb(0x22222a));mon.position.set(1.15,1.28,0.05);mon.rotation.y=-0.4;scene.add(mon);
  const mic=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.4,6),lamb(0x333));st.position.y=1.2;mic.add(st);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),lamb(0x222));hd.position.y=1.42;mic.add(hd);mic.position.set(-0.35,0,0.5);scene.add(mic);
  return {}}
function caster(r){const p=addFace(makePerson(r,{shirt:0x3e4a72,pants:0x2a2f44,hair:0x2a2220}));const u=p.userData;
  const tie=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.32,0.02),lamb(0xe85a8a));tie.position.set(0,0.42,0.17);u.hip.add(tie);
  const sh2=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.12,0.02),lamb(0xffffff));sh2.position.set(0,0.6,0.165);u.hip.add(sh2);
  const hs=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.03,8,30,Math.PI),lamb(0x2a2a2a));hs.position.y=0.3;u.head.add(hs);
  for(const s of[-1,1]){const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.07,16),lamb(0x2a2a2a));cup.rotation.z=Math.PI/2;cup.position.set(s*0.27,0.26,0);u.head.add(cup)}
  const bm=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.02,0.22),lamb(0x2a2a2a));bm.position.set(-0.23,0.15,0.13);bm.rotation.y=0.6;u.head.add(bm);
  u.skinMat=u.head.children[0].material=new THREE.MeshLambertMaterial({color:0xf3cfae});return p}
function coach(r){const p=addFace(makePerson(r,{shirt:0x3a3550,pants:0x2a2638,hair:0x55504a}));const u=p.userData;
  const tie=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.32,0.02),lamb(0xb48be0));tie.position.set(0,0.42,0.17);u.hip.add(tie);
  const col=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.1,0.02),lamb(0xffffff));col.position.set(0,0.6,0.165);u.hip.add(col);
  for(const s of[-1,1]){const br=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.025,0.01),basic(0x2a2a2a));br.position.set(s*0.09,0.33,0.245);br.rotation.z=s*0.35;u.head.add(br)}
  setFace(p,false);p.scale.setScalar(1.08);return p}
function boardTex(){return canvasTex(512,320,(x,w,h)=>{x.fillStyle='#2f6b4f';x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=4;x.strokeRect(14,14,w-28,h-28);x.beginPath();x.moveTo(w/2,14);x.lineTo(w/2,h-14);x.stroke();x.beginPath();x.arc(w/2,h/2,40,0,Math.PI*2);x.stroke();
  x.fillStyle='#ffd84d';for(const [a,b] of [[120,90],[150,200],[200,140],[260,100],[300,220]]){x.beginPath();x.arc(a,b,12,0,Math.PI*2);x.fill()}
  x.strokeStyle='#ff6b8a';x.lineWidth=7;x.beginPath();x.moveTo(300,220);x.quadraticCurveTo(380,190,440,150);x.stroke();x.fillStyle='#ff6b8a';x.beginPath();x.moveTo(452,142);x.lineTo(424,146);x.lineTo(440,166);x.fill();
  x.font=`900 46px ${FONT}`;x.fillStyle='#fff';x.textAlign='center';x.fillText('무조건 골!!',w/2,h-40)})}
function heart(scene,col='#ff8fb3',size=0.004){const h=textSprite('♥',80,col,size);scene.add(h);return h}

// =================== S0 타이틀: 결승전 입장 ===================
S[0]=()=>{
  const E=EV(0);const sc=new THREE.Scene();sc.fog=new THREE.Fog(0xe9dcf5,60,170);dayLights(sc);stadium(sc,{seed:5});
  const r=rng(101);const ppl=[];
  for(let i=0;i<11;i++){const p=player(r,TA,i===5?9:i+2);p.position.set(-6+i*1.2,0,1.5);sc.add(p);ppl.push({p,i,side:0})}
  for(let i=0;i<11;i++){const p=player(r,i===5?GKA:TB,i+1);p.position.set(-6+i*1.2,0,-1.8);sc.add(p);ppl.push({p,i,side:1})}
  const fw=['rgba(255,170,220,1)','rgba(200,170,255,1)','rgba(255,240,170,1)'].map(c=>{const g=new THREE.Group();for(let k=0;k<14;k++){const s=glowSprite(c,3);g.add(s)}sc.add(g);return g});
  const fpos=[[-30,30,-60],[28,34,-58],[0,40,-70]];
  const rigs=[];
  const C=cam(50);
  ui.insertAdjacentHTML('beforeend',`<div class="tag">INFP × 결승전편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">INFP인데</div><div class="title3 out">월드컵 결승을 한다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  const fl=div('flashw');
  const HIDE=2.7;
  return t=>{
    const k=ease(t/3.0);C.position.set(lerp(0,0,k),lerp(24,1.9,k),lerp(46,9.6,k));C.lookAt(0,lerp(0,2.4,k),lerp(-10,-0.5,k));
    ppl.forEach(q=>{standPose(q.p);setFace(q.p,true);const kk=ease((t-HIDE-q.i*0.03-q.side*0.1)/0.3);handsFace(q.p,kk);q.p.userData.head.rotation.x=0.25*kk})
    fw.forEach((g,i)=>{const t0=[E.fw1,E.fw2,E.fw3][i],lt=t-t0;g.visible=lt>0&&lt<1.4;g.children.forEach((s,j)=>{const a=j/14*Math.PI*2,rad=ease(lt/0.8)*9;s.position.set(fpos[i][0]+Math.cos(a)*rad,fpos[i][1]+Math.sin(a)*rad-lt*lt*1.5,fpos[i][2]);s.material.opacity=clamp01(1.3-lt)})});
    const fk=t>HIDE-0.15&&t<HIDE+0.5?(Math.floor((t-HIDE)*14)%2?0.55:0):0;fl.style.opacity=fk;rigs.forEach(c=>c.userData.rl.visible=Math.floor(t*4)%2===0);
    const T0=0.05;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)})`;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1);
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1);
    t3.style.transform=`scale(${pop((t-T0-0.7)/0.4)})`;t3.style.opacity=clamp01((t-T0-0.7)/0.1);
    stadiumSky();renderer.render(sc,C);caption(0,t)};
};

// =================== S1 라커룸 → 화장실 ===================
S[1]=()=>{
  const E=EV(1);const r=rng(202);
  const sA=new THREE.Scene();addLights(sA,{hemi:1.45,dir:1.2});
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(20,20),lamb(0xc7b9a6));fl.rotation.x=-Math.PI/2;sA.add(fl);
  const wl=new THREE.Mesh(new THREE.PlaneGeometry(20,8),lamb(0xd8cdea));wl.position.set(0,4,-3);sA.add(wl);
  for(let i=0;i<10;i++){const lk=new THREE.Mesh(new THREE.BoxGeometry(0.9,2.2,0.5),lamb(i%2?0xa98ad6:0xb89ae0));lk.position.set(-4.5+i*1.0,1.1,-2.7);sA.add(lk)}
  const bd=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.75,0.08),new THREE.MeshLambertMaterial({map:boardTex()}));bd.position.set(0,2.1,-2.2);sA.add(bd);
  const K=coach(r);K.position.set(0.9,0,-1.3);sA.add(K);
  const sB=new THREE.Scene();addLights(sB,{hemi:1.45,dir:1.2});
  const flB=fl.clone();sB.add(flB);const wlB=new THREE.Mesh(new THREE.PlaneGeometry(20,8),lamb(0xcfc3e3));wlB.position.set(0,4,-1.4);sB.add(wlB);
  bench(sB,0,-0.5,7);const P=[];for(let i=0;i<6;i++){const p=player(r,TA,[9,4,7,11,3,8][i]);sitPose(p);p.position.set(-2.75+i*1.1,0.0,-0.5);p.userData.hip.position.y=0.62;sB.add(p);P.push(p)}
  const sC=new THREE.Scene();addLights(sC,{hemi:1.5,dir:1.1});
  const flC=new THREE.Mesh(new THREE.PlaneGeometry(40,20),lamb(0xbfd6dd));flC.rotation.x=-Math.PI/2;sC.add(flC);
  const doors=[];for(let i=0;i<11;i++){const x=-11+i*2.2;
    for(const s of[-1,1]){const pt=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.4,1.6),lamb(0xe9e3f2));pt.position.set(x+s*1.1,1.25,-0.8);sC.add(pt)}
    const bk=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.6),lamb(0xd7e7ee));bk.position.set(x,1.3,-1.6);sC.add(bk);
    const hinge=new THREE.Group();hinge.position.set(x-1.0,0,0);sC.add(hinge);const d=new THREE.Mesh(new THREE.BoxGeometry(1.95,2.2,0.07),lamb(0xb48be0));d.position.set(0.98,1.25,0);hinge.add(d);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.26),new THREE.MeshBasicMaterial({map:SIGN_OFF,transparent:true}));sg.position.set(x+0.5,2.2,0.06);sC.add(sg);
    const p=player(r,TA,i+1);p.position.set(x,0,2.2);p.visible=false;sC.add(p);doors.push({hinge,sg,p,x})}
  const K2=coach(r);K2.position.set(0,0,3.2);K2.rotation.y=Math.PI;sC.add(K2);
  const qB=topB(makeBubble('…?',{bg:'#ffffff',fg:'#3b3466',fs:72,size:0.0035}));qB.position.y=2.55;K2.add(qB);scaleBubble(qB,0);
  const C=cam(48);const ch=chip('사기: 100%');
  const tB=E.stiff-0.6,tC=E.go-0.25;
  return t=>{
    let sc;
    if(t<tB){sc=sA;const kb=t-E.bang;const arm=kb>-0.3&&kb<0.35?1:0.35+Math.sin(t*5)*0.15;
      standPose(K);K.userData.arms[1].rotation.x=-2.4*arm;K.userData.arms[1].rotation.z=0.2;K.userData.arms[0].rotation.x=-0.6-Math.sin(t*6)*0.3;K.rotation.y=-0.25;
      bd.position.x=kb>0&&kb<0.3?Math.sin(kb*80)*0.03:0;
      C.fov=48;C.updateProjectionMatrix();const k=ease(t/tB);C.position.set(-0.6,1.9,4.6-k*0.8);C.lookAt(0.2,2.0,-1.6)}
    else if(t<tC){sc=sB;const k=(t-tB);P.forEach((p,i)=>{const s=ease((t-E.stiff+0.1-i*0.05)/0.3);setFace(p,s<0.5);sweatK(p,t+i*0.3,s>0.5);p.userData.head.rotation.x=0.15*s;p.userData.arms.forEach(a=>a.rotation.x=-0.9);p.position.x=-2.75+i*1.1-s*0.08*Math.sin(t*20+i)*0});
      C.fov=46;C.updateProjectionMatrix();C.position.set(0,1.75,4.6-k*0.4);C.lookAt(0,1.45,-0.5)}
    else{sc=sC;const L=EV(1).locks;doors.forEach((d,i)=>{const t0=L[i],lt=t-t0;
      // 문 앞으로 걸어와 쏙 들어가고 문 닫힘
      const inK=ease((lt+0.45)/0.4);d.p.visible=lt<0.05&&lt>-0.5;d.p.position.set(d.x,0,lerp(2.2,-0.6,inK));d.p.rotation.y=Math.PI;walkPose(d.p,t*12,0.6);setFace(d.p,false);
      const cl=ease((lt-0.0)/0.15);d.hinge.rotation.y=lerp(-1.35,0,cl);d.sg.material.map=lt>0.05?SIGN_ON:SIGN_OFF;d.sg.scale.setScalar(lt>0.05&&lt<0.3?1+0.25*Math.sin((lt-0.05)/0.25*Math.PI):1)});
      const n=L.filter(x=>t>x+0.05).length;const last=L[L.length-1];
      const pan=ease((t-tC)/(last-tC+0.2));C.fov=50;C.updateProjectionMatrix();C.position.set(lerp(-9,0,pan),2.0,lerp(6.5,11.5,pan));C.lookAt(lerp(-9,0,pan),1.3,-0.5);
      const kq=t-last-0.35;K2.visible=kq>0;K2.rotation.y=Math.PI+Math.sin(Math.max(0,kq)*3)*0.4;show(qB,t,last+0.55,99);
      ch.textContent=n<11?`사기: ${fmt(100-n*200/11)}%`:'8만 명이 나만 본다 → 사기 -100%'}
    if(t<tC)ch.textContent=t>E.stiff?'사기: 100% → ???':'사기: 100%';
    chipPop(ch,t,0.2);setSky('#d8cdea','#efe6f7');renderer.render(sc,C);caption(1,t)};
};

// =================== S2 칭찬 핑퐁 ===================
S[2]=()=>{
  const E=EV(2);const r=rng(303);const sc=new THREE.Scene();sc.fog=new THREE.Fog(0xe9dcf5,40,150);dayLights(sc);stadium(sc,{seed:8});
  const A=player(r,TA,9);A.rotation.y=Math.PI/2;sc.add(A);const B=player(r,TB,4);B.position.set(0.9,0,0);B.rotation.y=-Math.PI/2;sc.add(B);
  const bg=[];for(let i=0;i<5;i++){const p=player(r,i%2?TA:TB,i+5);p.position.set(-8+i*4,0,-9-r()*4);p.rotation.y=(r()-0.5)*1.5;sc.add(p);bg.push(p)}
  const bl=ball(sc);const H=[];for(let i=0;i<10;i++){const h=heart(sc,'#ff8fb3',0.0045);h.visible=false;H.push(h)}
  const bA=topB(makeBubble('///',{bg:'#ffe0ec',fg:'#d6336c',fs:64,size:0.0022}));bA.position.y=2.25;A.add(bA);scaleBubble(bA,0);
  const bB=topB(makeBubble('///',{bg:'#ffe0ec',fg:'#d6336c',fs:64,size:0.0022}));bB.position.y=2.25;B.add(bB);scaleBubble(bB,0);
  const C=cam(46);const ch=chip('패스 성공률 0% · 칭찬 성공률 100%');const STOP=at(2,'d0',-0.35);
  const ping=E.ping;
  return t=>{
    // A 드리블 → 멈춤
    const run=clamp01(t/STOP),ax=lerp(-7.5,-0.9,ease(run));A.position.set(ax,0,0);
    if(t<STOP)runPose(A,t,0.75);else standPose(A);
    // 볼 소유
    let owner=0;if(t>E.steal)owner=1;if(t>E.back)owner=0;
    let bx=owner?B.position.x-0.38:A.position.x+0.38;
    if(t<STOP)bx=ax+0.38+Math.abs(Math.sin(t*11))*0.15;
    const mv=(t0,from,to,d=0.35)=>{const k=clamp01((t-t0)/d);return lerp(from,to,ease(k))};
    if(t>E.steal&&t<E.steal+0.35)bx=mv(E.steal,A.position.x+0.38,B.position.x-0.38);
    if(t>E.back&&t<E.back+0.35)bx=mv(E.back,B.position.x-0.38,A.position.x+0.38);
    let by=0.12;
    for(let i=0;i<ping.length;i++){if(t>ping[i]&&t<ping[i]+0.3){const f=i%2===0;bx=mv(ping[i],f?A.position.x+0.38:B.position.x-0.38,f?B.position.x-0.38:A.position.x+0.38,0.3);by=0.12+Math.sin(clamp01((t-ping[i])/0.3)*Math.PI)*0.25}
      else if(t>=ping[i]+0.3&&(i===ping.length-1||t<ping[i+1]))bx=i%2===0?B.position.x-0.38:A.position.x+0.38}
    bl.position.set(bx,by,0.05);bl.rotation.z-=0.2;
    // 부끄러움
    const ka=clamp01((t-E.blush)/0.3)*(t>E.steal+0.6?clamp01(1-(t-E.steal-0.6)/0.4)*0.6+0.4:1),kb=clamp01((t-E.blush2)/0.3);
    blush(A,ka);blush(B,kb);
    if(t>STOP){handsFace(A,t>E.blush&&t<E.steal?ease((t-E.blush)/0.25)*0.85:0);A.userData.head.rotation.x=t>E.blush?0.18:0;A.userData.hip.rotation.y=t>E.blush&&t<E.steal?Math.sin(t*9)*0.12:0}
    handsFace(B,t>E.blush2&&t<E.back?ease((t-E.blush2)/0.25)*0.85:0);B.userData.head.rotation.x=t>E.blush2?0.18:0;
    if(t>E.back+0.4){A.userData.hip.position.y=0.8+Math.abs(Math.sin(t*7))*0.04;B.userData.hip.position.y=0.8+Math.abs(Math.sin(t*7+1))*0.04}
    show(bA,t,E.blush,E.steal+0.3);show(bB,t,E.blush2,E.back+0.4);
    H.forEach((h,i)=>{const t0=E.back+0.5+i*0.32,lt=t-t0;h.visible=lt>0&&lt<1.4;h.position.set(-0.05+Math.sin(i*2.1)*0.5,1.9+lt*0.9,0.2);const s=Math.sin(clamp01(lt/1.4)*Math.PI);h.scale.set(h.userData.base[0]*s,h.userData.base[1]*s,1)});
    bg.forEach((p,i)=>{standPose(p)});
    const k=ease(t/3);C.position.set(lerp(-4.5,-0.1,k),1.7,lerp(6.6,6.2,k));C.lookAt(lerp(-4.5,-0.1,k),1.35,0);
    chipPop(ch,t,at(2,'n2',-0.2));ch.style.opacity=t>at(2,'n2',-0.2)?1:0;
    stadiumSky();renderer.render(sc,C);caption(2,t)};
};

// =================== S3 헛발질 → 해설 사과 ===================
S[3]=()=>{
  const E=EV(3);const r=rng(404);
  const sA=new THREE.Scene();sA.fog=new THREE.Fog(0xe9dcf5,40,150);dayLights(sA);stadium(sA,{seed:11});
  const P=player(r,TA,7);P.rotation.y=-Math.PI/2+0.3;sA.add(P);const bl=ball(sA);
  const others=[];for(let i=0;i<9;i++){const p=player(r,i%2?TA:TB,i+2);p.position.set(-12+i*3,0,-6-r()*6);p.rotation.y=(r()-0.5)*2;sA.add(p);others.push(p)}
  const ref=addFace(makePerson(r,{shirt:0x2a2a2a,pants:0x2a2a2a}));ref.position.set(5,0,-4);sA.add(ref);
  const sB=new THREE.Scene();addLights(sB,{hemi:1.3,dir:1.2});boothSet(sB,r);const K=caster(r);K.position.set(0,0,-0.35);sB.add(K);
  const C=cam(46);const ch=chip('경기 중단 · 0분');const lb=div('lbl','중계석');lb.style.top='150px';
  const all=[];for(let i=0;i<22;i++){const p=player(r,i%2?TA:TB,i+1);const a=i/22*Math.PI*2;p.position.set(Math.cos(a)*9+(r()-0.5)*3,0,Math.sin(a)*6-4+(r()-0.5)*2);sA.add(p);p.visible=false;all.push(p)}
  return t=>{
    let sc,shot=t<E.booth?0:t<E.stop?1:2;
    lb.style.opacity=shot===1?1:0;lb.style.transform=`translateX(-50%) scale(${shot===1?pop((t-E.booth)/0.3):0})`;
    if(shot===0){sc=sA;all.forEach(p=>p.visible=false);others.forEach(p=>p.visible=true);
      // 크로스 → 헛발질
      const k=clamp01((t-0.2)/(E.whiff+0.4-0.2));bl.position.set(lerp(-9,4,k),0.12+Math.sin(k*Math.PI)*2.2*(1-k*0.6),lerp(-3,0.6,k));
      standPose(P);const sw=clamp01((t-E.whiff+0.15)/0.35);if(sw>0&&sw<1){kickLeg(P,sw);P.userData.hip.rotation.x=-0.15*Math.sin(sw*Math.PI)}
      const sit=ease((t-E.sit)/0.4);if(sit>0){sitPose(P);P.userData.hip.position.y=lerp(0.8,0.3,sit);P.userData.legs.forEach(l=>l.rotation.x=-1.9*sit);P.userData.arms.forEach(a=>{a.rotation.x=-1.2*sit;a.rotation.z=0});P.userData.head.rotation.x=0.55*sit;setFace(P,false)}
      setFace(P,sit<0.3);
      C.fov=46;C.updateProjectionMatrix();C.position.set(-1.2,1.7,5.6);C.lookAt(0.3,1.0,0)}
    else if(shot===1){sc=sB;const k=t-E.booth;const u=K.userData;
      const pale=clamp01((t-at(3,'c2',-0.3))/0.4);u.skinMat.color.setHex(0xf3cfae).lerp(_c2.setHex(0xe8ecf2),pale*0.8);setFace(K,pale<0.3);
      const bowT=[at(3,'c2',0.2),at(3,'c2',1.6),at(3,'c2',3.0)];let bow=0;bowT.forEach(b=>{const x=(t-b)/0.6;if(x>0&&x<1)bow=Math.max(bow,Math.sin(x*Math.PI))});
      standPose(K);u.hip.rotation.x=0.55*bow;u.arms.forEach(a=>{a.rotation.x=-0.35;a.rotation.z=0});u.arms[1].rotation.x=-1.9+bow*0.5;sweatK(K,t,pale>0.5);tremble(K,t,pale);
      C.fov=40;C.updateProjectionMatrix();C.position.set(0.3,1.75,3.6-k*0.08);C.lookAt(0,1.45,-0.4)}
    else{sc=sA;others.forEach(p=>p.visible=false);all.forEach((p,i)=>{p.visible=true;standPose(p);const tk=ease((t-E.stop-0.2-i*0.04)/0.3);p.lookAt(0,0,30);p.rotation.y=p.rotation.y*tk+(1-tk)*(i*0.7);setFace(p,false)});
      ref.lookAt(0,0,30);P.position.set(0,0,-2);
      const k=ease((t-E.stop)/1.5);C.fov=50;C.updateProjectionMatrix();C.position.set(0,lerp(9,7,k),lerp(20,16,k));C.lookAt(0,0.8,-3);
      const mins=Math.min(3,Math.floor((t-E.stop)/0.9));ch.textContent=`경기 중단 · ${mins}분`;if(t>at(3,'n3',2.2))ch.textContent='해설 사과로 경기 중단 3분'}
    chipPop(ch,t,E.stop);ch.style.opacity=t>E.stop?1:0;
    stadiumSky();renderer.render(sc,C);caption(3,t)};
};

// =================== S4 1대1 → 상상 → 패스 돌리기 ===================
S[4]=()=>{
  const E=EV(4);const r=rng(505);
  const sA=new THREE.Scene();sA.fog=new THREE.Fog(0xe9dcf5,40,160);dayLights(sA);stadium(sA,{seed:13});
  const A=player(r,TA,9);A.rotation.y=Math.PI;sA.add(A);const G=player(r,GKA,1,{gloves:true});sA.add(G);const bl=ball(sA);
  const chain=[];[[-6,-41],[-9,-36],[-3,-33],[2,-36],[5,-40],[8,-44]].forEach(([x,z],i)=>{const p=player(r,TA,[7,11,4,8,10,6][i]);p.position.set(x,0,z);sA.add(p);chain.push(p)});
  const rigs=[];for(let i=0;i<7;i++){const c=cameraRig();sA.add(c);rigs.push(c)}
  const fls=[];for(let i=0;i<10;i++){const g=glowSprite('rgba(255,255,255,1)',1.4);sA.add(g);fls.push(g)}
  // 상상 무대
  const sD=new THREE.Scene();addLights(sD,{hemi:1.6,dir:1.0});const gd=new THREE.Mesh(new THREE.PlaneGeometry(60,60),lamb(0xffd6ea));gd.rotation.x=-Math.PI/2;sD.add(gd);
  const D=player(r,TA,9);sD.add(D);const sp=[];for(let i=0;i<22;i++){const s=glowSprite(['rgba(255,240,170,1)','rgba(255,190,230,1)','rgba(210,190,255,1)'][i%3],0.6);sD.add(s);sp.push({s,a:r()*6,rr:1+r()*2.5,h:r()*3})}
  const mics=[];for(let i=0;i<3;i++){const m=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.4,6),lamb(0x333));m.add(st);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.07,14,10),lamb([0xe85a8a,0x5a8ae8,0xf2c46b][i]));hd.position.y=0.22;m.add(hd);m.rotation.x=1.2;sD.add(m);mics.push(m)}
  const dr=div('dream');const dl=div('dlist','<div>세리머니 #1 무릎 슬라이딩</div><div>세리머니 #2 손하트</div><div>세리머니 #3 하늘 가리키기</div><div>#47 우승 소감 (3분 분량)</div>');
  const rec=div('rec','● LIVE · 8만 명 시청 중');
  const C=cam(46);const ch=chip('세리머니 준비 47개 · 슈팅 0개');
  const nB=[];chain.forEach(p=>{const b=topB(makeBubble('저는 좀…',{bg:'#ffffff',fg:'#3b3466',fs:60,size:0.006}));b.position.y=2.4;p.add(b);scaleBubble(b,0);nB.push(b)});
  const gB=topB(makeBubble('…!!',{bg:'#fff3c4',fg:'#5a4000',fs:70,size:0.007}));gB.position.y=2.4;G.add(gB);scaleBubble(gB,0);
  const PS=E.passes;const recv=[...chain.slice(1),G];
  return t=>{
    let sc=sA;const real=t>=E.real&&t<E.pass1-0.05,dream=t>=E.slow+0.25&&t<E.real,pass=t>=E.pass1-0.05;
    sh(dr,dream);sh(dl,dream);sh(rec,real);
    if(t<E.slow+0.25){// 달리기
      const k=t/(E.slow+0.25);const z=lerp(-30,-41,ease(k));A.position.set(0.5,0,z);runPose(A,t,0.8);setFace(A,true);
      G.position.set(0,0,-51);standPose(G);G.userData.arms.forEach((a,i)=>{a.rotation.z=i?0.7:-0.7});
      bl.position.set(A.position.x+0.1,0.12+Math.abs(Math.sin(t*11))*0.1,z-0.45);
      const slow=clamp01((t-E.slow)/0.25);C.fov=lerp(48,30,slow);C.updateProjectionMatrix();C.position.set(2.4-slow*1.8,2.0-slow*0.3,z+4.6-slow*6.1);C.lookAt(A.position.x,1.4,z-4+slow*3.6);
      rigs.forEach(c=>c.visible=false);fls.forEach(f=>f.visible=false);chain.forEach(p=>p.visible=false)}
    else if(dream){sc=sD;const lt=t-E.slow-0.25,dur=E.real-E.slow-0.25,ph=lt/dur;
      D.position.set(0,0,lerp(3,-1,clamp01(ph*2.2)));D.rotation.y=0;standPose(D);setFace(D,true);blush(D,0.4);
      if(ph<0.45){D.userData.hip.position.y=0.42;D.userData.legs.forEach(l=>l.rotation.x=-1.4);D.userData.legs[1].rotation.x=0.9;D.userData.arms.forEach((a,i)=>{a.rotation.x=-0.3;a.rotation.z=i?2.2:-2.2});D.userData.head.rotation.x=-0.35}
      else if(ph<0.75){handsFace(D,1);D.userData.arms[0].rotation.z=-0.2;D.userData.arms[1].rotation.z=0.2}
      else{D.userData.arms[1].rotation.x=-3.0;D.userData.arms[1].rotation.z=0.15}
      mics.forEach((m,i)=>{m.visible=ph>0.75;m.position.set(-0.6+i*0.6,1.5+i%2*0.1,-0.4)});
      sp.forEach(q=>{const a=q.a+lt*1.5;q.s.position.set(Math.cos(a)*q.rr,0.4+q.h+Math.sin(lt*3+q.a)*0.2,-1+Math.sin(a)*q.rr*0.6);q.s.material.opacity=0.6+0.4*Math.sin(lt*8+q.a)});
      [...dl.children].forEach((c,i)=>{const t0=E.slow+0.35+i*(dur*0.24);c.style.transform=`scale(${pop((t-t0)/0.3)})`;c.style.opacity=clamp01((t-t0)/0.08)});
      C.fov=40;C.updateProjectionMatrix();C.position.set(0,1.6,5.2-ph*0.6);C.lookAt(0,1.3,-0.5);setSky('#ffc9e6','#fff1d6 80%')}
    else if(real){const lt=t-E.real;A.position.set(0.5,0,-41);standPose(A);setFace(A,false);sweatK(A,t,true);tremble(A,t,0.7);bl.position.set(0.6,0.12,-41.45);
      rigs.forEach((c,i)=>{c.visible=true;const a=-1.2+i*0.4;c.position.set(0.5+Math.sin(a)*3.4,0,-41-Math.cos(a)*3.4+3.0*0+0.0);c.lookAt(0.5,0,-41)});
      chain.forEach(p=>p.visible=false);rigs.forEach((c,i)=>{const a=[-0.62,-0.45,-0.3,0.3,0.45,0.62,3.0][i];c.position.set(0.5+Math.sin(a)*2.4,0,-41-Math.cos(a)*2.4);c.lookAt(0.5,0,-41)});
      fls.forEach((f,i)=>{f.visible=Math.floor(t*12+i*3.3)%5===0;const a=(i/9-0.5)*2.6;f.position.set(0.5+Math.sin(a)*2.9,1.4+(i%3)*0.3,-41-Math.cos(a)*2.9)});
      const z=clamp01(lt/0.6);C.fov=lerp(48,40,ease(z));C.updateProjectionMatrix();C.position.set(0.5,1.95,-41-lerp(6.4,4.6,ease(z)));C.lookAt(0.5,1.55,-41)}
    else{// 패스 돌리기
      rigs.forEach(c=>c.visible=false);fls.forEach(f=>f.visible=false);chain.forEach(p=>{p.visible=true;standPose(p);p.lookAt(0,0,-38)});
      A.position.set(0.5,0,-41);standPose(A);setFace(A,false);G.position.set(0,0,-51);G.lookAt(0,0,-41);
      // 공 위치
      let from=A,to=A,k=1;for(let i=0;i<PS.length;i++){if(t>=PS[i]){from=i===0?A:recv[i-1];to=recv[i];k=clamp01((t-PS[i])/0.4)}}
      if(t<PS[0]){from=A;to=A}
      const fp=from.position,tp=to.position;bl.position.set(lerp(fp.x,tp.x,ease(k)),0.12+Math.sin(k*Math.PI)*0.5,lerp(fp.z,tp.z,ease(k))+0.3);
      chain.forEach((p,i)=>{const got=PS[i];show(nB[i],t,got+0.15,(PS[i+1]||99)+0.2);if(t>got&&t<got+0.5)kickLeg(p,clamp01((t-(PS[i+1]||99)+0.3)/0.3))});
      const boot=clamp01((t-E.boot)/0.9);if(t>E.boot){G.userData.legs[1].rotation.x=-1.3*Math.sin(clamp01((t-E.boot)/0.3)*Math.PI);bl.position.set(lerp(G.position.x,6,boot),0.12+boot*30,lerp(G.position.z,-80,boot))}
      show(gB,t,E.keep+0.1,E.boot+0.4);if(t>E.keep&&t<E.boot)G.userData.arms.forEach(a=>{a.rotation.x=-1.0;a.rotation.z=0});
      const k2=ease((t-E.pass1)/2.5);C.fov=50;C.updateProjectionMatrix();C.position.set(lerp(9,8,k2),lerp(7.5,8.5,k2),-29);C.lookAt(1,0.5,-43)}
    chipPop(ch,t,at(4,'n4',0.1));ch.style.opacity=pass&&t>at(4,'n4',0.1)?1:0;
    if(!dream)stadiumSky();renderer.render(sc,C);caption(4,t)};
};

// =================== S5 승부차기 ===================
S[5]=()=>{
  const E=EV(5);const r=rng(606);const sc=new THREE.Scene();sc.fog=new THREE.Fog(0xe9dcf5,40,170);dayLights(sc);stadium(sc,{seed:17});
  const G=player(r,GKA,1,{gloves:true});G.position.set(0,0,-52);sc.add(G);
  const K=[player(r,TB,10),player(r,TA,7),player(r,TB,3)];K.forEach(p=>{p.rotation.y=Math.PI;sc.add(p)});
  const S9=player(r,TA,9);S9.rotation.y=Math.PI;sc.add(S9);const bl=ball(sc);
  const bd=div('board','<span class="a">INFP A</span><span class="s">0 - 0</span><span class="b">INFP B</span>');bd.style.top='150px';
  const lbl=div('lbl','승부차기');lbl.style.top='290px';
  const C=cam(46);const M=[E.m1,E.m2,E.m3];
  return t=>{
    const spot=-41;let mi=-1;M.forEach((m,i)=>{if(t>=m)mi=i});if(t>=E.walk)mi=-1;
    K.forEach((p,i)=>p.visible=i===mi);S9.visible=mi<0&&t>=E.walk;
    G.userData.arms.forEach((a,i)=>{a.rotation.z=i?0.7:-0.7});G.userData.hip.position.x=Math.sin(t*4)*0.1;
    if(mi>=0){const p=K[mi],lt=t-M[mi];p.position.set(0.2,0,spot+1.4-ease(clamp01(lt/0.25))*1.2);standPose(p);setFace(p,false);
      if(lt>0.22)kickLeg(p,clamp01((lt-0.22)/0.2)*0.5+0.5);
      const fly=clamp01((lt-0.3)/0.45);bl.position.set(0.1+fly*1.5,0.12+fly*fly*16,spot-fly*14);
      C.fov=46;C.updateProjectionMatrix();C.position.set(1.4,1.9,spot+5.4);C.lookAt(0,2.2,spot-8)}
    else if(t<E.walk){bl.position.set(0,-5,0)}
    else{const lt=t-E.walk,wk=clamp01(lt/2.6);S9.position.set(0.3,0,lerp(spot+9,spot+1.0,ease(wk)));if(wk<1)walkPose(S9,t*7,0.45);else standPose(S9);setFace(S9,false);
      const pl=t>E.place-0.6;bl.position.set(pl?0.15:0.32,pl?0.12:1.15,pl?spot:S9.position.z+0.2);
      if(t>E.place-0.9&&t<E.place-0.2){S9.userData.hip.rotation.x=0.6;S9.userData.arms.forEach(a=>a.rotation.x=-0.9)}else{S9.userData.hip.rotation.x=0}
      if(t>E.breath-0.4){const b=Math.sin((t-E.breath)*2.4);S9.userData.hip.position.y=0.8+b*0.02;S9.userData.arms.forEach(a=>{a.rotation.z=(a===S9.userData.arms[0]?-1:1)*(0.15+b*0.05)})}
      const k=ease(clamp01(lt/(E.breath+1.2-E.walk)));C.fov=lerp(48,38,k);C.updateProjectionMatrix();C.position.set(lerp(1.6,0.9,k),lerp(2.0,1.85,k),lerp(spot+13,spot+3.6,k));C.lookAt(0,1.4,spot-6)}
    sh(bd,true);sh(lbl,true);popEl(bd,t,0.05,'translateX(-50%)');popEl(lbl,t,0.15,'translateX(-50%)');
    if(t<E.walk){const cut=M.some(m=>t>=m&&t<m+0.06);renderer.domElement.style.filter=cut?'brightness(1.4)':''}else renderer.domElement.style.filter='';
    stadiumSky();renderer.render(sc,C);caption(5,t)};
};

// =================== S6 두 사람의 사연 ===================
S[6]=()=>{
  const E=EV(6);const r=rng(707);const sc=new THREE.Scene();sc.fog=new THREE.Fog(0xe9dcf5,40,170);dayLights(sc);stadium(sc,{seed:19});
  const spot=-41;const G=player(r,GKA,1,{gloves:true});G.position.set(0,0,-51.5);sc.add(G);
  const S9=player(r,TA,9);S9.position.set(0.3,0,spot+1.0);S9.rotation.y=Math.PI;sc.add(S9);const bl=ball(sc);bl.position.set(0.15,0.12,spot);
  // 거실 (엄마)
  const sM=new THREE.Scene();addLights(sM,{hemi:1.3,dir:0.9});const lr=livingRoom(sM);const Mo=mom(r);sitPose(Mo);Mo.position.set(0,0.0,-1.6);Mo.userData.hip.position.y=0.62;sM.add(Mo);
  const tvB=topB(makeBubble('우리 아들…',{bg:'#ffffff',fg:'#7a3b5a',fs:60,size:0.0026}));tvB.position.y=2.2;Mo.add(tvB);scaleBubble(tvB,0);
  // 관중석 (할머니)
  const sG=new THREE.Scene();addLights(sG,{hemi:1.5,dir:1.2});const st=standRows(sG,r,{rows:4,n:9,w:12,skip:(row,i)=>row===0&&(i===4||i===3||i===5)});
  const Gr=granny(r);sitPose(Gr);Gr.position.set(0,0.5,0);Gr.userData.hip.position.y=0.66;sG.add(Gr);
  const bn=new THREE.Mesh(new THREE.PlaneGeometry(1.7,0.57),new THREE.MeshLambertMaterial({map:bannerTex(),side:THREE.DoubleSide}));bn.position.set(0,0.3,0.5);Gr.add(bn);
  const C=cam(44),C2=cam(44,W/(H/2));
  const sp=div('split');sp.style.top='956px';const w1=div('who2','골키퍼 엄마');w1.style.top='120px';const w2=div('who2','');w2.style.top='1010px';
  const T_K=at(6,'s2',-0.25),T_G1=at(6,'g1',-0.15);
  const camGK=(c,z=3.2)=>{c.position.set(0.25,1.75,-51.5+z);c.lookAt(0,1.62,-51.5)};
  const camST=(c,z=3.2)=>{c.position.set(0.25,1.75,spot+1-z);c.lookAt(0.3,1.62,spot+1)};
  return t=>{
    standPose(G);standPose(S9);G.userData.arms.forEach((a,i)=>{a.rotation.z=i?0.5:-0.5});setFace(G,false);setFace(S9,false);
    const tg=clamp01((t-0.3)/0.4);tremble(G,t,tg*(t>T_G1?1:0.5));tremble(S9,t,t>T_K?0.6:0.2);sweatK(S9,t,t>T_K);sweatK(G,t+0.4,t>T_G1);
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.setClearColor(0x000000,0);renderer.clear();
    let split=null,mode;
    if(t<E.mom){mode='gk'}else if(t<T_K){mode='mom'}else if(t<E.gran){mode='st'}else if(t<T_G1){mode='gran'}else if(t<E.both){mode='gk2'}else mode='both';
    sh(sp,mode==='mom'||mode==='both');sh(w1,mode==='mom'||mode==='both'||mode==='gran');sh(w2,mode==='both');
    stadiumSky();
    if(mode==='gk'||mode==='gk2'){const k=ease((t-(mode==='gk'?0:T_G1))/3);camGK(C,lerp(mode==='gk'?6.2:3.0,mode==='gk'?4.6:2.4,k));C.fov=40;C.updateProjectionMatrix();renderer.render(sc,C)}
    else if(mode==='st'){const k=ease((t-T_K)/3);camST(C,lerp(4.4,3.2,k));C.fov=40;C.updateProjectionMatrix();renderer.render(sc,C)}
    else if(mode==='gran'){w1.textContent='관중석';const k=t-E.gran;Gr.userData.arms.forEach((a,i)=>{a.rotation.x=-1.25;a.rotation.z=i?-0.2:0.2});bn.position.y=0.32+Math.sin(t*3)*0.03;
      st.ppl.forEach((p,i)=>{p.userData.head.rotation.y=Math.sin(t+i)*0.15});C.fov=42;C.updateProjectionMatrix();C.position.set(0,1.8,4.2-k*0.25);C.lookAt(0,0.95,-0.4);setSky('#b9a8f0','#ffe3f1 75%');renderer.render(sG,C)}
    else{// 위아래 분할
      renderer.setScissorTest(true);
      // 위
      renderer.setViewport(0,H/2,W,H/2);renderer.setScissor(0,H/2,W,H/2);
      if(mode==='mom'){w1.textContent='골키퍼 엄마';Mo.userData.arms.forEach((a,i)=>{a.rotation.x=-1.6;a.rotation.z=i?-0.55:0.55});Mo.userData.head.rotation.x=-0.1;lr.tvGlow.intensity=3+Math.sin(t*9)*0.8;show(tvB,t,E.mom+0.4,99);
        C2.aspect=W/(H/2);C2.fov=40;C2.updateProjectionMatrix();C2.position.set(0,1.45,2.6);C2.lookAt(0,1.25,-1.6);renderer.setClearColor(0xf2dfd0,1);renderer.clear();renderer.render(sM,C2)}
      else{w1.textContent='골키퍼';C2.aspect=W/(H/2);C2.fov=26;C2.updateProjectionMatrix();camGK(C2,2.6);C2.position.y=1.9;C2.lookAt(0,1.85,-51.5);renderer.setClearColor(0xe9dcf5,1);renderer.clear();renderer.render(sc,C2)}
      // 아래
      renderer.setViewport(0,0,W,H/2);renderer.setScissor(0,0,W,H/2);
      if(mode==='mom'){C2.fov=26;C2.updateProjectionMatrix();camGK(C2,2.6);C2.position.y=1.9;C2.lookAt(0,1.85,-51.5)}
      else{w2.textContent='키커';C2.fov=26;C2.updateProjectionMatrix();camST(C2,2.6);C2.position.y=1.9;C2.lookAt(0.3,1.85,spot+1)}
      renderer.setClearColor(0xe9dcf5,1);renderer.clear();renderer.render(sc,C2);
      renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.setClearColor(0x000000,0)}
    caption(6,t)};
};

// =================== S7 슛 → 정지 ===================
S[7]=()=>{
  const E=EV(7);const r=rng(808);const sc=new THREE.Scene();sc.fog=new THREE.Fog(0xe9dcf5,40,170);dayLights(sc);stadium(sc,{seed:23});
  const spot=-41;const G=player(r,GKA,1,{gloves:true});G.position.set(0,0,-52);sc.add(G);
  const S9=player(r,TA,9);S9.rotation.y=Math.PI;sc.add(S9);const bl=ball(sc,1.6);
  const sG=new THREE.Scene();addLights(sG,{hemi:1.5,dir:1.2});standRows(sG,r,{rows:4,n:9,w:12,skip:(row,i)=>row===0&&i>=3&&i<=5});const Gr=granny(r);sitPose(Gr);Gr.position.set(0,0.5,0);Gr.userData.hip.position.y=0.66;sG.add(Gr);
  const sM=new THREE.Scene();addLights(sM,{hemi:1.3,dir:0.9});livingRoom(sM);const Mo=mom(r);sitPose(Mo);Mo.position.set(0,0,-1.6);Mo.userData.hip.position.y=0.62;sM.add(Mo);
  const C=cam(44),C2=cam(40,W/(H/2));
  const sp=div('split');sp.style.top='956px';
  const fz=div('flashw');const c1=div('cont1 out','2부에서 계속');const c2=div('cont2 out','팔로우하고 기다려 주세요');
  const INS0=E.shot+0.55,INS1=E.shot+1.35;
  return t=>{
    G.userData.arms.forEach((a,i)=>{a.rotation.z=i?0.7:-0.7});
    const frz=t>=E.freeze;const tt=frz?E.freeze:t;
    // 달려가서 슛
    const run=clamp01((tt-E.run)/(E.shot-E.run));S9.position.set(0.9-run*0.6,0,spot+3.2-run*3.0);if(tt<E.shot)runPose(S9,tt,0.8);else{standPose(S9);kickLeg(S9,clamp01((tt-E.shot+0.12)/0.35)*0.5+0.5)}
    setFace(S9,false);S9.userData.head.rotation.x=tt<E.shot?0.1:-0.15;eyesOf(S9).forEach(e=>e.scale.y=tt>E.shot-0.5?0.2:1);
    const fly=clamp01((tt-E.shot)/(E.freeze-E.shot+1.2));bl.position.set(lerp(0.15,-2.0,fly),0.12+Math.sin(fly*Math.PI*0.9)*1.5,lerp(spot,-51.0,fly));bl.rotation.x-=0.05;
    const dv=clamp01((tt-E.shot-0.2)/2.0);G.position.set(lerp(0,-1.0,dv),0,-52);G.userData.hip.rotation.z=dv*1.1;G.userData.hip.position.y=0.8+Math.sin(dv*Math.PI)*0.4;
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.setClearColor(0x000000,0);renderer.clear();
    const ins=tt>=INS0&&tt<INS1;sh(sp,ins);
    stadiumSky();
    if(ins){renderer.setScissorTest(true);
      renderer.setViewport(0,H/2,W,H/2);renderer.setScissor(0,H/2,W,H/2);Gr.userData.arms.forEach((a,i)=>{a.rotation.x=-1.9;a.rotation.z=i?-0.6:0.6});eyesOf(Gr).forEach(e=>e.scale.y=0.2);
      C2.position.set(0,1.85,2.6);C2.lookAt(0,1.55,0);renderer.setClearColor(0xe9dcf5,1);renderer.clear();renderer.render(sG,C2);
      renderer.setViewport(0,0,W,H/2);renderer.setScissor(0,0,W,H/2);Mo.userData.arms.forEach((a,i)=>{a.rotation.x=-1.9;a.rotation.z=i?-0.6:0.6});eyesOf(Mo).forEach(e=>e.scale.y=0.2);
      C2.position.set(0,1.45,1.9);C2.lookAt(0,1.3,-1.6);renderer.setClearColor(0xf2dfd0,1);renderer.clear();renderer.render(sM,C2);
      renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.setClearColor(0x000000,0)}
    else{if(tt<E.shot+0.1){C.fov=46;C.updateProjectionMatrix();C.position.set(1.8,1.9,spot+7.5-run*2.5);C.lookAt(0,1.3,spot-8)}
      else{// 공 따라가는 측면 슬로모션
        const b=bl.position;C.fov=40;C.updateProjectionMatrix();C.position.set(b.x+1.4,1.6,b.z+4.4);C.lookAt(lerp(b.x,-0.5,0.3),1.25,lerp(b.z,-52,0.3))}
      renderer.render(sc,C)}
    renderer.domElement.style.filter=frz?'grayscale(0.55) contrast(1.05)':'';
    fz.style.opacity=frz?clamp01(1-(t-E.freeze)/0.25)*0.8:0;
    popEl(c1,t,E.freeze+0.35);popEl(c2,t,E.freeze+0.6);
    caption(7,t)};
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.domElement.style.filter='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
