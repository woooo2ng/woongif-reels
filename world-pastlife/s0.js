// ---------- 웅이프 월드 공용 ----------
const PURP='#c9a8ff';
function vcam(fov=50){return new THREE.PerspectiveCamera(fov,W/H,0.1,600)}
function femHair(p,col=0x3a2620,o={}){const u=p.userData,h=u.head;h.children[1].visible=false;const m=smooth(col);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,20,0,Math.PI*2,0,Math.PI*0.55),m);cap.position.y=0.25;cap.rotation.x=-0.42;h.add(cap);
  const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.15,0.34,0.6);bang.position.set(-0.03,0.43,0.12);bang.rotation.z=-0.2;h.add(bang);
  if(o.bun){const b=new THREE.Mesh(new THREE.SphereGeometry(0.13,30,20),m);b.position.set(0,0.5,-0.14);h.add(b)}
  else{const cg=(r,l)=>new THREE.CapsuleGeometry(r,l,8,24);
    const back=new THREE.Mesh(cg(0.2,o.short?0.25:0.55),m);back.scale.set(1.3,1,0.55);back.position.set(0,o.short?0.12:-0.02,-0.13);h.add(back);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(cg(0.07,o.short?0.22:0.46),m);sd.position.set(sx*0.225,o.short?0.16:0.04,0.05);h.add(sd)}}
  for(const sx of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.018,0.02),lamb(0x1a1a1a));l.position.set(sx*0.09,0.29,0.236);h.add(l)}
  return p}
function girl(seed,o={}){const p=makePerson(rng(seed),{shirt:o.shirt??0xff9ec4,pants:o.pants??0x55506a,hair:0x3a2620});addFace(p);setFace(p,'smile');femHair(p,o.hair??0x3a2620,o);
  const u=p.userData;u.hip.children[0].scale.x=0.9;
  if(!o.pants){const skin=u.arms[0].children[1].material;u.legs.forEach(l=>{l.children[0].material=skin});
    const sk=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.36,0.36,16),lamb(o.skirt??0xffd1e3));sk.position.y=-0.14;u.hip.add(sk)}
  return p}
function kid(seed,o={}){const p=makePerson(rng(seed),{shirt:o.shirt??0xffd84d,pants:o.pants??0x6a8fd0});p.userData.head.scale.setScalar(1.3);p.userData.head.position.y=0.62;p.scale.setScalar(0.62);
  if(o.girl)femHair(p,0x2a2220,{short:true});return p}
function suit(p,o={}){const u=p.userData;const tie=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.36,0.02),lamb(o.tie??0xc94f4f));tie.position.set(0,0.42,0.17);u.hip.add(tie);
  const col=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.08,0.02),lamb(0xffffff));col.position.set(0,0.6,0.165);u.hip.add(col);
  if(o.glasses){for(const s of[-1,1]){const g=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.012,8,20),basic(0x222222));g.position.set(s*0.09,0.25,0.25);u.head.add(g)}
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.012,0.01),basic(0x222222));br.position.set(0,0.26,0.252);u.head.add(br)}
  return p}
function chairM(col=0x9a7a5a){const g=new THREE.Group();const s=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.08,0.6),lamb(col));s.position.y=0.5;g.add(s);
  const b=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.7,0.08),lamb(col));b.position.set(0,0.88,-0.27);g.add(b);
  for(const x of[-0.26,0.26])for(const z of[-0.24,0.24]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,0.06),lamb(0x6a5040));l.position.set(x,0.25,z);g.add(l)}return g}
function seat(scene,p,x,z,ry,col){const c=chairM(col);c.position.set(x,0,z);c.rotation.y=ry;scene.add(c);p.position.set(x,0,z);p.rotation.y=ry;sitPose(p);p.position.y=0.02;scene.add(p);return c}
function roundTable(scene,x,z,o={}){const g=new THREE.Group();const top=new THREE.Mesh(new THREE.CylinderGeometry(o.r||0.8,o.r||0.8,0.07,28),lamb(o.col??0xf3ece0));top.position.y=1.0;g.add(top);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,1,8),lamb(0x555555));leg.position.y=0.5;g.add(leg);
  const ft=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,0.04,16),lamb(0x555555));ft.position.y=0.02;g.add(ft);g.position.set(x,0,z);scene.add(g);return g}
function cup(scene,x,y,z,col=0xffffff){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.07,0.2,16),lamb(col));c.position.set(x,y+0.1,z);scene.add(c);
  const lid=new THREE.Mesh(new THREE.CylinderGeometry(0.095,0.095,0.03,16),lamb(0x6b4a2f));lid.position.set(x,y+0.21,z);scene.add(lid);return c}
function holdPhone(p,side=1,up=1.25){const ph=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.3,0.03),lamb(0x22222a));ph.position.set(0,-0.64,0.08);ph.rotation.x=-0.6;p.userData.arms[side].add(ph);p.userData.arms[side].rotation.x=-up;
  const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.13,0.26),basic(0xb79cff));sc.position.set(0,0,-0.017);sc.rotation.y=Math.PI;ph.add(sc);return ph}
function roomBox(scene,o={}){const fl=new THREE.Mesh(new THREE.BoxGeometry(o.w||14,0.2,o.d||12),lamb(o.floor??0xd9c2a0));fl.position.y=-0.1;scene.add(fl);
  const bw=new THREE.Mesh(new THREE.BoxGeometry(o.w||14,o.h||7,0.2),lamb(o.wall??0xf1e6d6));bw.position.set(0,(o.h||7)/2,-(o.d||12)/2+2);scene.add(bw);
  for(const s of[-1,1]){const lw=new THREE.Mesh(new THREE.BoxGeometry(0.2,o.h||7,o.d||12),lamb(o.wall2??o.wall??0xe9dcc8));lw.position.set(s*(o.w||14)/2,(o.h||7)/2,0);scene.add(lw)}
  return bw}
function spr(tex,w,h){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(w,h,1);s.userData.base=[w,h];return s}
function cardTex(lines,o={}){return canvasTex(o.w||640,o.h||260,(x,w,h)=>{x.fillStyle='rgba(0,0,0,0.18)';rr(x,6,12,w-12,h-18,34);x.fill();
  x.fillStyle=o.bg||'#fff';rr(x,6,4,w-12,h-18,34);x.fill();if(o.border){x.lineWidth=10;x.strokeStyle=o.border;rr(x,11,9,w-22,h-28,30);x.stroke()}
  x.textAlign='center';x.textBaseline='middle';lines.forEach(([t,fs,col],i,a)=>{x.font=`900 ${fs}px ${FONT}`;x.fillStyle=col||'#222';
    const tot=a.reduce((s,l)=>s+l[1]*1.25,0);let y=(h-14)/2-tot/2;for(let k=0;k<i;k++)y+=a[k][1]*1.25;x.fillText(t,w/2,y+fs*0.62)})})}
function crown(){const g=new THREE.Group();const m=lamb(0xffc93c);const b=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.14,16,1,true),m);b.material.side=THREE.DoubleSide;g.add(b);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const c=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.16,6),m);c.position.set(Math.cos(a)*0.21,0.14,Math.sin(a)*0.21);g.add(c);
    const j=new THREE.Mesh(new THREE.SphereGeometry(0.035,10,8),basic(i%2?0xe2553f:0x5ab0ff));j.position.set(Math.cos(a)*0.225,0.0,Math.sin(a)*0.225);g.add(j)}return g}
function sweat(p){const d=new THREE.Mesh(new THREE.SphereGeometry(0.05,12,10),basic(0x8fd0ff));d.scale.set(0.8,1.3,0.6);d.position.set(0.24,0.4,0.15);p.userData.head.add(d);return d}
function appIconTex(){return canvasTex(512,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#d39cff');x.fillStyle=g;rr(x,16,16,w-32,h-32,110);x.fill();
  x.fillStyle='rgba(255,255,255,0.18)';x.beginPath();x.arc(w/2,h/2-10,150,0,Math.PI*2);x.fill();
  x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.font=`900 150px ${FONT}`;x.fillText('전생',w/2,h/2-40);x.fillStyle='#ffe066';x.font=`900 130px ${FONT}`;x.fillText('24',w/2,h/2+105)})}
const APPICON_SVG=`<div style="width:120px;height:120px;border-radius:30px;background:linear-gradient(135deg,#7b5cff,#d39cff);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900;line-height:1"><div style="font-size:40px">전생</div><div style="font-size:36px;color:#ffe066">24</div></div>`;
function phoneUI(inner,o={}){const ph=div('phone');if(o.top!=null)ph.style.top=o.top+'px';const sc=div('screen',`<div class="sbar"><span>${o.time||'9:41'}</span><span>▮▮▮ 100%</span></div>`,ph);if(o.bg)sc.style.background=o.bg;sc.insertAdjacentHTML('beforeend',inner);return {ph,sc}}
function popIn(el,t,t0,base='',dur=0.3){const k=pop((t-t0)/dur);el.style.transform=`${base} scale(${Math.max(0.001,k)})`;el.style.opacity=clamp01((t-t0)/0.08)}
function stampEl(text,t,t0,o={}){let el=o.el;if(!el){el=div('stamp',text);if(o.top)el.style.top=o.top+'px';if(o.col){el.style.borderColor=o.col;el.style.color=o.col}}
  const k=clamp01((t-t0)/0.18);const s=t<t0?0:(k<1?2.4-1.4*ease(k):1);el.style.transform=`translate(-50%,-50%) rotate(-8deg) scale(${s})`;el.style.opacity=t<t0?0:1;return el}
function sprinkle(scene,r,n,area,col=0xff8fb8){const H=[];for(let i=0;i<n;i++){const s=textSprite('♥',90,'#'+col.toString(16).padStart(6,'0'),0.004);s.position.set(area[0]+(r()-0.5)*area[3],area[1]+r()*area[4],area[2]+(r()-0.5)*1.5);s.userData.v=0.4+r()*0.6;s.userData.y0=s.position.y;s.userData.ph=r()*6;scene.add(s);H.push(s)}return H}
function updSprinkle(H,t,t0){H.forEach(s=>{const k=t-t0;s.visible=k>0;s.position.y=s.userData.y0+k*s.userData.v;s.material.opacity=clamp01(1.6-k*0.35);s.position.x+=Math.sin(t*2+s.userData.ph)*0.002})}
function shake(t,t0,amp=14){const k=t-t0;if(k<0||k>0.35)return '';const a=amp*(1-k/0.35);return `translate(${Math.sin(k*90)*a}px,${Math.cos(k*70)*a}px)`}
