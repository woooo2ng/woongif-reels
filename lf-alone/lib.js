// ===== 롱폼: 만약에 지구에 나 혼자 남는다면? (1920x1080) =====
const TM=await (await fetch('timing.json')).json();
function sentSplit(t){const out=[];let cur='';const a=[...t];for(let i=0;i<a.length;i++){const ch=a[i];cur+=ch;if('.?!'.includes(ch)&&!'.?!'.includes(a[i+1]||'')&&cur.trim().length>3){out.push(cur.trim());cur=''}}if(cur.trim())out.push(cur.trim());
  // 너무 긴 문장은 쉼표에서 나눔
  const r=[];for(const s of out){if(s.length>30&&s.includes(', ')){const i=s.indexOf(', ',Math.floor(s.length*0.3));if(i>0){r.push(s.slice(0,i+1));r.push(s.slice(i+2));continue}}r.push(s)}
  // 짧은 조각은 앞 문장에 붙임
  const m=[];for(const s of r){if(m.length&&s.length<7&&(m[m.length-1].length+s.length)<30)m[m.length-1]+=' '+s;else m.push(s)}return m}
const CAPL={};
TM.forEach((sc,si)=>{const L=[];for(const [nm,[st,d]] of Object.entries(sc.lines)){const parts=sentSplit(TXT[nm]);const who=nm[0];
  const tot=parts.reduce((a,p)=>a+p.length,0);let acc=st;parts.forEach(p=>{L.push([acc,p,who]);acc+=d*p.length/tot});L.push([st+d+0.25,null,who])}
  L.sort((a,b)=>a[0]-b[0]);CAPL[si]=L});
window.setTiming=()=>{};
function caption(si,t){if(window.noCap)return;const L=CAPL[si];if(!L)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');ui.appendChild(el)}
  let idx=-1;for(let i=0;i<L.length;i++)if(t>=L[i][0]-0.05)idx=i;
  while(idx>=0&&L[idx][1]===null){const nx=L[idx+1];if(nx&&t>=nx[0]-0.75&&nx[0]-L[idx][0]<0.9){idx--}else break}
  if(idx<0||!L[idx][1]){el.style.opacity=0;return}
  const [st,txt,who]=L[idx];
  if(el.dataset.i!=idx){el.dataset.i=idx;
    if(who==='n'){el.className='cap nar';el.textContent=txt}
    else{el.className='cap say out';el.innerHTML=`<span class="nm">${who==='j'?'웅이':'스피커'}</span>`;el.appendChild(document.createTextNode(txt))}}
  const k=pop((t-st+0.05)/0.18);el.style.transform=`translateX(-50%) scale(${0.88+0.12*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
const LN=(si,nm)=>TM[si].lines[nm];
const at=(si,nm,k=0)=>LN(si,nm)[0]+k;
const endOf=(si,nm,k=0)=>LN(si,nm)[0]+LN(si,nm)[1]+k;
const DUR=si=>TM[si].dur;
const S=[];
renderer.setClearColor(0x000000,0);
// ---------- 공용 ----------
function cam(fov=42){return new THREE.PerspectiveCamera(fov,W/H,0.1,600)}
function look(c,p,q){c.position.set(...p);c.lookAt(...q)}
const lerp=(a,b,k)=>a+(b-a)*k;
const lerp3=(a,b,k)=>a.map((x,i)=>lerp(x,b[i],k));
function div(cls,html,parent=ui){const d=document.createElement('div');d.className=cls;if(html!=null)d.innerHTML=html;parent.appendChild(d);return d}
function chip(text){const el=div('chip',text);return el}
function popEl(el,t,t0,base='translateX(-50%)'){const k=pop((t-t0)/0.3);el.style.transform=`${base} scale(${k})`;el.style.opacity=clamp01((t-t0)/0.08)}
function bub(p,text,o={}){const b=makeBubble(text,{bg:o.bg||'#ffffff',fg:o.fg||'#2b2b3a',fs:o.fs||64,size:o.size||0.0042});b.position.y=o.y??2.3;p.add(b);scaleBubble(b,0);return b}
function addFace(p){const h=p.userData.head;
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.013,4,10,Math.PI),basic(0x5a2a2a));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.016,0.01),basic(0x5a2a2a));fl.position.set(0,0.145,0.248);h.add(fl);
  const op=new THREE.Mesh(new THREE.SphereGeometry(0.035,10,8),basic(0x5a2a2a));op.scale.set(1,1.3,0.4);op.position.set(0,0.14,0.245);h.add(op);
  p.userData.smile=sm;p.userData.flat=fl;p.userData.open=op;setFace(p,'flat');return p}
function setFace(p,f){p.userData.smile.visible=f==='smile';p.userData.flat.visible=f==='flat';p.userData.open.visible=f==='open'}
function woong(o={}){const r=rng(7);const p=addFace(makePerson(r,{shirt:o.shirt??0xffc94d,pants:o.pants??0x3d4a6b,hair:0x2a2220}));
  // 후드 끈
  for(const s of[-1,1]){const st=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.2,0.02),lamb(0xffffff));st.position.set(s*0.07,0.5,0.17);p.userData.hip.add(st)}
  if(o.beard){const h=p.userData.head;const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,30,20,0,Math.PI*2,Math.PI*0.55,Math.PI*0.45),smooth(0x3b2e26));b.position.set(0,0.27,0.04);b.scale.set(1.12,1.1,1.05);h.add(b);
    p.userData.smile.position.z=0.27;p.userData.flat.position.z=0.272;p.userData.open.position.z=0.27;p.userData.smile.material=basic(0xf0d0c0)}
  if(o.patch){const pa=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.14,0.02),lamb(0x8a6a4a));pa.position.set(0.12,0.2,0.17);p.userData.hip.add(pa)}
  return p}
function dog(o={}){const g=new THREE.Group();const c=o.col??0xf3e2c0,dk=o.dark??0xd9b98a;
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.26,0.55),lamb(c));body.position.y=0.36;g.add(body);
  const head=new THREE.Group();head.position.set(0,0.55,0.32);g.add(head);
  const hm=new THREE.Mesh(new THREE.SphereGeometry(0.17,24,18),smooth(c));head.add(hm);
  const mz=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),smooth(o.gray?0xdddddd:0xfff4e4));mz.position.set(0,-0.04,0.14);mz.scale.set(1.2,0.8,1);head.add(mz);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),basic(0x222222));nose.position.set(0,-0.01,0.22);head.add(nose);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.025,8,6),basic(0x1a1a1a));e.position.set(s*0.07,0.04,0.15);head.add(e);
    const ear=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.16,0.04),lamb(dk));ear.position.set(s*0.14,0.02,0);ear.rotation.z=s*0.3;head.add(ear)}
  const legs=[];for(const[x,z]of[[-0.11,0.18],[0.11,0.18],[-0.11,-0.18],[0.11,-0.18]]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.24,0.08),lamb(c));l.geometry.translate(0,-0.12,0);l.position.set(x,0.26,z);g.add(l);legs.push(l)}
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.2),lamb(dk));tail.geometry.translate(0,0,-0.1);tail.position.set(0,0.45,-0.27);tail.rotation.x=-0.6;g.add(tail);
  if(o.collar){const cl=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.025,6,16),lamb(0xe2553f));cl.rotation.x=Math.PI/2;cl.position.set(0,0.47,0.27);g.add(cl);
    const tag=new THREE.Mesh(new THREE.CircleGeometry(0.035,10),basic(0xffd84d));tag.position.set(0,0.4,0.37);g.add(tag)}
  g.userData={head,legs,tail};g.scale.setScalar(o.s||1);return g}
function dogWalk(d,t,sp=10){const u=d.userData;u.legs.forEach((l,i)=>l.rotation.x=Math.sin(t*sp+(i%2?Math.PI:0)*(i<2?1:-1))*0.5);u.tail.rotation.y=Math.sin(t*14)*0.5}
function dogWag(d,t){d.userData.tail.rotation.y=Math.sin(t*16)*0.6}
const CARC=[0xe8e4dc,0x5d6b82,0xc94f4f,0x2f3440,0x8fb3d9,0xd9c27a];
function car(col){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.55,3.6),lamb(col));b.position.y=0.55;g.add(b);
  const c=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.5,1.9),lamb(col));c.position.set(0,1.05,-0.15);g.add(c);
  const gl=new THREE.Mesh(new THREE.BoxGeometry(1.52,0.36,1.7),lamb(0x6f8aa6));gl.position.set(0,1.06,-0.15);g.add(gl);
  for(const x of[-0.8,0.8])for(const z of[-1.15,1.15]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.25,12),lamb(0x222222));w.rotation.z=Math.PI/2;w.position.set(x,0.32,z);g.add(w)}
  for(const x of[-0.55,0.55]){const hl=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.15,0.05),basic(0xfff3c4));hl.position.set(x,0.6,1.81);g.add(hl)}
  return g}
function busStopSign(){const g=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.6,6),lamb(0x888888));p.position.y=1.3;g.add(p);return g}
function tree(scene,x,z,s=1,col=0x6fae6a){const t=new THREE.Group();const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.14,1.4,6),lamb(0x7a5a3c));tr.position.y=0.7;t.add(tr);
  const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(0.85,0),lamb(col));cr.position.y=1.9;t.add(cr);t.position.set(x,0,z);t.scale.setScalar(s);scene.add(t);return t}
function tuft(scene,x,z,s=1,col=0x7dbb5e){const m=new THREE.Mesh(new THREE.ConeGeometry(0.18*s,0.5*s,5),lamb(col));m.position.set(x,0.25*s,z);scene.add(m);return m}
function bush(scene,x,y,z,s=1,col=0x5e9e55){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(0.5*s,0),lamb(col));m.position.set(x,y,z);scene.add(m);return m}
function stars(scene,n,r,o={}){const g=new THREE.BufferGeometry();const pos=[];for(let i=0;i<n;i++){pos.push((r()-0.5)*(o.w||300),(o.y0??20)+r()*(o.h||120),(o.z??-150)-r()*30)}g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  const m=new THREE.PointsMaterial({color:o.col??0xfff6d8,size:o.size||0.6,sizeAttenuation:true,transparent:true,opacity:1});const p=new THREE.Points(g,m);scene.add(p);return p}
function milky(scene,r,o={}){// 은하수 띠: 빽빽한 별 + 희미한 구름
  const g=new THREE.BufferGeometry();const pos=[];const NN=o.n||2600;for(let i=0;i<NN;i++){const u=(r()-0.5)*2;const x=u*170;const y=60+u*55+(r()-0.5)*(26*(1-Math.abs(u)*0.4))+(r()-0.5)*8;pos.push(x,y,-160-r()*20)}
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const p=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff2e0,size:0.45,transparent:true}));scene.add(p);
  for(let i=0;i<26;i++){const u=(r()-0.5)*2;const s=glowSprite(pick(r,['rgba(190,170,255,1)','rgba(255,200,230,1)','rgba(170,210,255,1)']),40+r()*40);s.material.opacity=0.16;s.position.set(u*160,60+u*52+(r()-0.5)*14,-175);scene.add(s)}
  return p}
function glowSprite(col,s){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sp.scale.set(s,s,1);return sp}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function planeTex(w,h,tex,o={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),o.basic?new THREE.MeshBasicMaterial({map:tex,transparent:!!o.tr}):new THREE.MeshLambertMaterial({map:tex,transparent:!!o.tr}));return m}
function textTex(lines,o={}){const w=o.w||512,h=o.h||256;return canvasTex(w,h,(x)=>{x.fillStyle=o.bg||'#fff';if(o.r){rr(x,0,0,w,h,o.r);x.fill()}else x.fillRect(0,0,w,h);
  x.fillStyle=o.fg||'#222';x.textAlign='center';x.textBaseline='middle';const fs=o.fs||60;lines.forEach((l,i)=>{x.font=`900 ${Array.isArray(l)?l[1]:fs}px ${FONT}`;x.fillStyle=Array.isArray(l)&&l[2]?l[2]:(o.fg||'#222');x.fillText(Array.isArray(l)?l[0]:l,w/2,h/2+(i-(lines.length-1)/2)*fs*1.25)})})}
const SKY={day:'linear-gradient(#7fb8f0,#cfe6ff 60%,#eef6ff)',morning:'linear-gradient(#9cc8f2,#ffe2c4 70%,#fff0dc)',dusk:'linear-gradient(#5b5e9e,#e98a7f 60%,#ffc58c)',night:'linear-gradient(#070b1d,#18204a 70%,#2b2f5e)',deep:'linear-gradient(#02030a,#0b1030 70%,#1a1f45)',clear:'linear-gradient(#3f9cf2,#a9dcff 60%,#e6f7ff)',winter:'linear-gradient(#a9b9cc,#dfe6ee 60%,#f4f6f8)',gold:'linear-gradient(#6a7fb8,#f2a77a 55%,#ffd99a)',gray:'linear-gradient(#9aa3ad,#c9ced4 60%,#dfe2e5)'};
function sky(k){bgEl.style.background=SKY[k]||k}
function lights(scene,mode='day'){
  const P={day:[0xffffff,0x8a8070,1.6,0xffffff,1.6],night:[0x5866a8,0x1a1a2a,0.9,0x8090d0,0.5],dusk:[0xffd2b0,0x6a5060,1.3,0xffb080,1.2],dark:[0x3a4270,0x101018,0.6,0x6070b0,0.3],winter:[0xeef2ff,0x9098a8,1.5,0xffffff,1.0]}[mode];
  scene.add(new THREE.HemisphereLight(P[0],P[1],P[2]));const d=new THREE.DirectionalLight(P[3],P[4]);d.position.set(6,12,8);scene.add(d);return d}
function ground(scene,col,size=600){const g=new THREE.Mesh(new THREE.PlaneGeometry(size,size),lamb(col));g.rotation.x=-Math.PI/2;g.position.y=-0.02;scene.add(g);return g}
// 도시 거리: 앞뒤로 긴 도로 + 양옆 건물
function city(scene,r,o={}){const g=o.green||0,night=o.night,snow=o.snow;
  ground(scene,snow?0xf2f4f7:(g>0.5?0x7fae63:0xa9b49a));
  const road=new THREE.Mesh(new THREE.PlaneGeometry(o.roadW||10,500),lamb(snow?0xe6e9ee:(g>0.6?0x6b7360:0x5b5f68)));road.rotation.x=-Math.PI/2;scene.add(road);
  for(const s of[-1,1]){const sw=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.14,500),lamb(snow?0xf6f7f9:0xd8d2c6));sw.position.set(s*((o.roadW||10)/2+1.7),0.07,0);scene.add(sw)}
  if(!snow)for(let z=30;z>-260;z-=5){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.2,2.2),basic(g>0.6?0x9a9a8a:0xf2f2f2));l.rotation.x=-Math.PI/2;l.position.set(0,0.01,z);scene.add(l)}
  const B=[];const wallsG=['#a8a394','#9da396','#b0a898'];
  for(const s of[-1,1]){let z=24;while(z>-220){const w=5+r()*4,h=(o.minH??8)+r()*(o.varH??22),d=7;
    const b=makeBuilding(r,d,h,w,{lit:night?(o.lit??0.45):0.04,wall:g>0.5?pick(r,wallsG):undefined,win:night?'#1c2240':undefined});
    b.position.set(s*((o.roadW||10)/2+3.6+d/2+r()*0.5),b.position.y,z-w/2);scene.add(b);B.push(b);
    if(g>0){// 덩굴: 건물 앞면에 초록 패치
      const n=Math.floor(g*g*14);for(let k=0;k<n;k++){const vh=1+r()*h*0.7*g;const v=new THREE.Mesh(new THREE.BoxGeometry(0.15,vh,0.6+r()*1.6),lamb(pick(r,[0x5e9e55,0x4f8a4a,0x6fae6a])));
        v.position.set(b.position.x-s*(d/2+0.05),vh/2,z-w/2+(r()-0.5)*w);scene.add(v)}
      if(g>0.6){const top=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2+r(),0),lamb(0x5e9e55));top.position.set(b.position.x,h+0.3,z-w/2);top.scale.y=0.5;scene.add(top)}}
    if(snow){const cap=new THREE.Mesh(new THREE.BoxGeometry(d+0.1,0.25,w+0.1),lamb(0xf7f9fb));cap.position.set(b.position.x,h+0.12,z-w/2);scene.add(cap)}
    z-=w+0.5}}
  for(const s of[-1,1])for(let z=18;z>-200;z-=8){tree(scene,s*((o.roadW||10)/2+1.2),z,1+g*1.4,snow?0xe8eef2:(g>0.6?0x4f8a4a:0x6fae6a))}
  if(g>0){for(let i=0;i<g*260;i++){const x=(r()-0.5)*(o.roadW||10)*1.6,z=20-r()*200;tuft(scene,x,z,0.6+r()*g*2.2,pick(r,[0x7dbb5e,0x6aa84f,0x8cc96a]))}
    if(g>0.6)for(let i=0;i<14;i++){tree(scene,(r()-0.5)*7,10-r()*150,1.3+r()*1.2,0x4f8a4a)}}
  if(snow){for(let i=0;i<120;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.3+r()*0.6,6,4),lamb(0xf7f9fb));m.scale.y=0.35;m.position.set((r()-0.5)*20,0,20-r()*150);scene.add(m)}}
  return {B}}
function cars(scene,r,list,o={}){return list.map(([x,z,ry])=>{const c=car(pick(r,CARC));c.position.set(x,0,z);c.rotation.y=ry||0;if(o.rust)c.traverse(m=>{if(m.material&&m.material.color&&m.material!==lamb(0x222222))m.material=lamb(new THREE.Color(m.material.color).lerp(new THREE.Color(0x8a6a50),o.rust).getHex())});scene.add(c);
  if(o.overgrow){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(0.9,0),lamb(0x5e9e55));b.position.set(x,1.3,z);b.scale.set(1.2,0.7,2);scene.add(b)}return c})}
// 웅이 원룸
function room(scene,o={}){const g=new THREE.Group();scene.add(g);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(12,0.2,10),lamb(o.floor??0xd9b98a));fl.position.y=-0.1;g.add(fl);
  const bw=new THREE.Mesh(new THREE.BoxGeometry(12,6,0.2),lamb(o.wall??0xf1e6d6));bw.position.set(0,3,-5);g.add(bw);
  const lw=new THREE.Mesh(new THREE.BoxGeometry(0.2,6,10),lamb(o.wall2??0xe9dcc8));lw.position.set(-6,3,0);g.add(lw);
  // 창문
  const win=new THREE.Group();win.position.set(1.5,3.2,-4.88);g.add(win);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(3.6,2.6,0.12),lamb(0xffffff));win.add(frame);
  const glassTex=canvasTex(256,192,(x,w,h)=>{const gr=x.createLinearGradient(0,0,0,h);(o.winSky||['#8ec5f5','#d8ecff']).forEach((c,i,a)=>gr.addColorStop(i/(a.length-1),c));x.fillStyle=gr;x.fillRect(0,0,w,h);
    x.fillStyle=o.winCity||'#b8c4d4';for(let i=0;i<9;i++){const bh=40+((i*37)%70);x.fillRect(i*30,h-bh,26,bh)}
    if(o.winLit){x.fillStyle='#ffe39a';for(let i=0;i<40;i++)x.fillRect((i*53)%250,h-10-((i*29)%80),5,6)}});
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(3.3,2.3),new THREE.MeshBasicMaterial({map:glassTex}));glass.position.z=0.07;win.add(glass);
  const mul=new THREE.Mesh(new THREE.BoxGeometry(0.08,2.3,0.05),lamb(0xffffff));mul.position.z=0.1;win.add(mul);
  // 침대
  const bed=new THREE.Group();bed.position.set(-3.6,0,-2.2);g.add(bed);
  const bf=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.5,4.4),lamb(0x9a7a5a));bf.position.y=0.25;bed.add(bf);
  const mat=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.35,4.2),lamb(0xffffff));mat.position.y=0.65;bed.add(mat);
  const blanket=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.22,2.6),lamb(o.blanket??0x9cc9ff));blanket.position.set(0,0.88,0.75);bed.add(blanket);
  const pil=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.3,0.8),lamb(0xffffff));pil.position.set(0,0.95,-1.6);bed.add(pil);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.4,0.2),lamb(0x8a6a4a));hb.position.set(0,0.9,-2.2);bed.add(hb);
  // 책상
  const desk=new THREE.Group();desk.position.set(3.6,0,-3.8);g.add(desk);
  const top=new THREE.Mesh(new THREE.BoxGeometry(3,0.12,1.4),lamb(0xe8e1d4));top.position.y=1.5;desk.add(top);
  for(const x of[-1.4,1.4])for(const z of[-0.6,0.6]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.5,0.1),lamb(0x777777));l.position.set(x,0.75,z);desk.add(l)}
  const mon=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.95,0.08),lamb(0x222228));mon.position.set(-0.3,2.15,-0.3);desk.add(mon);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.48,0.84),basic(o.screenOff?0x111114:0x7fb7e8));scr.position.set(-0.3,2.15,-0.255);desk.add(scr);
  const mst=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.5,0.1),lamb(0x333333));mst.position.set(-0.3,1.7,-0.35);desk.add(mst);
  // 스마트 스피커
  const spk=new THREE.Group();spk.position.set(1.0,1.56,0);desk.add(spk);
  const sb=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.24,0.5,24),lamb(0x4a4a55));sb.position.y=0.25;spk.add(sb);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.19,0.035,8,24),basic(0x55d8ff));ring.rotation.x=Math.PI/2;ring.position.y=0.5;spk.add(ring);
  // 미니 냉장고
  const fr=new THREE.Group();fr.position.set(5,0,-1);g.add(fr);
  const fb=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.8,1.2),lamb(0xdfe6ec));fb.position.y=0.9;fr.add(fb);
  const fh=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.6,0.08),lamb(0x999999));fh.position.set(-0.45,1.2,0.62);fr.add(fh);
  const fled=new THREE.Mesh(new THREE.CircleGeometry(0.05,10),basic(0x55ff88));fled.position.set(0.4,1.6,0.61);fr.add(fled);
  // 러그·소품
  const rug=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,0.03,24),lamb(o.rug??0xf2b8c6));rug.position.set(0.5,0.02,0.5);g.add(rug);
  const plant=new THREE.Group();plant.position.set(-5.2,0,-4.3);g.add(plant);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.25,0.5,8),lamb(0xd98c6c));pot.position.y=0.25;plant.add(pot);
  const lf=new THREE.Mesh(new THREE.IcosahedronGeometry(0.5,0),lamb(0x6fae6a));lf.position.y=0.9;plant.add(lf);
  return {g,bed,blanket,desk,scr,spk,ring,fr,fled,win,glassTex}}
