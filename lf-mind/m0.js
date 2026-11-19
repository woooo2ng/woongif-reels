// ===== 속마음 편 공용 =====
const thCache={};
function thoughtTex(text,fs=60){const key=text+fs;if(thCache[key])return thCache[key];
  const c=document.createElement('canvas'),x=c.getContext('2d');x.font=`900 ${fs}px ${FONT}`;const tw=x.measureText(text).width;
  const w=Math.ceil(tw+fs*1.6),h=Math.ceil(fs*2.0),tail=fs*1.1;c.width=w+20;c.height=h+tail+20;x.translate(10,10);
  const body=()=>{x.beginPath();const r=h/2;const n=Math.max(3,Math.round(w/(fs*0.9)));
    for(let i=0;i<=n;i++){const cx=r*0.8+(w-r*1.6)*i/n;x.moveTo(cx+r*0.55,h*0.28);x.arc(cx,h*0.3,r*0.55,0,7);x.moveTo(cx+r*0.6,h*0.7);x.arc(cx,h*0.68,r*0.6,0,7)}
    x.moveTo(r,h/2);x.arc(r*0.75,h/2,r*0.72,0,7);x.moveTo(w,h/2);x.arc(w-r*0.75,h/2,r*0.72,0,7);x.rect(r*0.6,h*0.2,w-r*1.2,h*0.6)};
  x.fillStyle='rgba(0,0,0,0.15)';x.save();x.translate(0,5);body();x.fill();x.restore();
  x.fillStyle='#ece3ff';body();x.fill();
  x.fillStyle='#ece3ff';for(const [dx,dy,rr] of [[w*0.42,h+fs*0.25,fs*0.26],[w*0.47,h+fs*0.75,fs*0.15]]){x.beginPath();x.arc(dx,dy,rr,0,7);x.fill()}
  x.fillStyle='#3b2a6b';x.textAlign='center';x.textBaseline='middle';x.font=`900 ${fs}px ${FONT}`;x.fillText(text,w/2,h/2+fs*0.05);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return thCache[key]={t,w:c.width,h:c.height}}
function think(p,text,o={}){const {t,w,h}=thoughtTex(text,o.fs||60);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,depthTest:o.dt??true}));
  const k=o.size||0.0042;s.scale.set(w*k,h*k,1);s.center.set(0.5,0);s.userData.base=[w*k,h*k];s.position.set(o.x||0,o.y??2.15,o.z||0);if(p)p.add(s);s.renderOrder=10;scaleBubble(s,0);return s}
function popT(b,t,t0,end){let k=pop((t-t0)/0.35);if(end!=null)k*=clamp01((end-t)/0.25);scaleBubble(b,k);if(k>0)b.position.y=(b.userData.y0??(b.userData.y0=b.position.y))+Math.sin(t*2.2+b.id)*0.02}
function setHair(p,col){p.userData.head.children[1].material=smooth(col)}
function P(seed,o={}){const p=addFace(makePerson(rng(seed),{shirt:o.shirt,pants:o.pants}));if(o.hair!=null)setHair(p,o.hair);const H=p.userData.head;
  if(o.bun){const b=new THREE.Mesh(new THREE.SphereGeometry(0.12,24,16),smooth(o.hair??0x2a2220));b.position.set(0,0.52,-0.12);H.add(b)}
  if(o.long){const b=new THREE.Mesh(new THREE.SphereGeometry(0.27,32,20,0,Math.PI*2,Math.PI*0.35,Math.PI*0.45),smooth(o.hair??0x2a2220));b.position.set(0,0.22,-0.03);b.scale.set(1,1.25,1);H.add(b)}
  if(o.tie){const t=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.32,0.02),lamb(o.tie));t.position.set(0,0.42,0.17);p.userData.hip.add(t)}
  if(o.glasses){for(const s of[-1,1]){const g=new THREE.Mesh(new THREE.TorusGeometry(0.055,0.012,6,14),lamb(0x222222));g.position.set(s*0.09,0.25,0.25);H.add(g)}}
  if(o.apron){const a=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.55,0.02),lamb(o.apron));a.position.set(0,0.25,0.17);p.userData.hip.add(a)}
  if(o.cap){const c=new THREE.Mesh(new THREE.SphereGeometry(0.28,24,12,0,Math.PI*2,0,Math.PI*0.5),smooth(o.cap));c.position.y=0.3;H.add(c);const v=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.03,0.2),lamb(o.cap));v.position.set(0,0.3,0.27);H.add(v)}
  if(o.s)p.scale.setScalar(o.s);setFace(p,o.face||'smile');return p}
const MOM=()=>P(51,{shirt:0xf2a3b8,pants:0x6a5a7a,hair:0x3a2a22,bun:true});
const GRAN=()=>P(52,{shirt:0x9a7ab8,pants:0x5a4a5a,hair:0xd8d8d8,bun:true});
const BOSS=()=>P(53,{shirt:0xf2f2f2,pants:0x2a2f3a,hair:0x1d1d24,tie:0xc94f4f,glasses:true});
const DATE=()=>P(54,{shirt:0xffc0d0,pants:0xf2e6c8,hair:0x4a3426,long:true});
function chap(key,num,title){return()=>{sky('#0d0d12');ui.innerHTML='';const d=div('dcard',`<div class="s" style="font-size:52px;color:#b59cf0;margin:0 0 18px">CHAPTER ${num}</div><div class="d" style="font-size:150px;letter-spacing:-4px">${title}</div>`);
  const a=d.children[0],b=d.children[1];return t=>{renderer.clear();a.style.opacity=clamp01(t/0.3);b.style.transform=`scale(${0.9+0.1*pop((t-0.2)/0.4)})`;b.style.opacity=clamp01((t-0.2)/0.2);d.style.opacity=clamp01(Math.min(t/0.2,(DUR(key)-t)/0.3))}}}
// 줄지어 선 군중 + 말풍선
function crowd(scene,n,area,seed,o={}){const r=rng(seed);const out=[];for(let i=0;i<n;i++){const p=P(seed*100+i,{shirt:pick(r,SHIRT),hair:pick(r,HAIR),long:r()<0.35});p.position.set(area[0]+r()*(area[1]-area[0]),0,area[2]+r()*(area[3]-area[2]));p.rotation.y=o.ry??(r()-0.5)*0.6;scene.add(p);out.push(p)}return out}
// 식탁 세트
function table(scene,x,z,w=2.2,d=1.4,col=0xc9a06a){box(scene,w,0.1,d,col,x,1.05,z);for(const sx of[-1,1])for(const sz of[-1,1])box(scene,0.08,1.05,0.08,0x8a6a4a,x+sx*(w/2-0.15),0.52,z+sz*(d/2-0.15))}
function plate(scene,x,y,z,food=0xe2553f){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.18,0.04,16),lamb(0xffffff));p.position.set(x,y,z);scene.add(p);const f=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,6),lamb(food));f.scale.y=0.4;f.position.set(x,y+0.05,z);scene.add(f)}
function chair(scene,x,z,ry=0,col=0x8a6a4a){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);box(g,0.6,0.08,0.6,col,0,0.55,0);box(g,0.6,0.7,0.08,col,0,0.95,-0.28);return g}
