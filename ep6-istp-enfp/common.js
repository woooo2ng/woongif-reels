const CAPW={};
let LEAD=0.25,VOICE=[];
window.setTiming=(lead,voice)=>{LEAD=lead;VOICE=voice};
function caption(si,t){
  const parts=CAPS[si];if(!parts)return;
  let el=ui.querySelector('.cap');if(!el){el=document.createElement('div');el.className='cap out';ui.appendChild(el)}
  const L=CAPW[si]||parts.map(p=>p.length);const v=VOICE[si]||3,tot=L.reduce((a,b)=>a+b,0);
  let acc=LEAD,idx=0;for(let i=0;i<parts.length;i++){const len=v*L[i]/tot;if(t>=acc-0.05)idx=i;acc+=len}
  if(el.dataset.i!=idx){el.dataset.i=idx;el.textContent=parts[idx]}
  const st=LEAD+v*L.slice(0,idx).reduce((a,b)=>a+b,0)/tot;
  const k=pop((t-st+0.05)/0.18);el.style.transform=`scale(${0.85+0.15*k})`;el.style.opacity=clamp01((t-st+0.1)/0.1);
}
function chip(text,top){const el=document.createElement('div');el.className='clock';el.textContent=text;if(top!=null)el.style.top=top+'px';ui.appendChild(el);return el}
function chipPop(el,t,t0=0){el.style.transform=`translateX(-50%) scale(${pop((t-t0)/0.3)})`;el.style.opacity=clamp01((t-t0)/0.08)}
function labelSprite(text,o={}){
  const fs=o.fs||64;const c=document.createElement('canvas'),ctx=c.getContext('2d');
  ctx.font=`900 ${fs}px ${FONT}`;const tw=ctx.measureText(text).width;const pad=fs*0.5,h=fs*1.5;
  c.width=Math.ceil(tw+pad*2)+8;c.height=Math.ceil(h)+12;ctx.translate(4,4);
  ctx.fillStyle='rgba(0,0,0,0.2)';rr(ctx,0,5,c.width-8,h,o.r??18);ctx.fill();
  ctx.fillStyle=o.bg||'#fff';rr(ctx,0,0,c.width-8,h,o.r??18);ctx.fill();
  ctx.fillStyle=o.fg||'#333';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${fs}px ${FONT}`;ctx.fillText(text,(c.width-8)/2,h/2+fs*0.06);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));const k=o.size||0.006;
  s.scale.set(c.width*k,c.height*k,1);s.userData.base=[c.width*k,c.height*k];return s;
}
function armUp(p,side,k){const a=p.userData.arms[side];a.rotation.x=-2.95*k;a.rotation.z=(side?0.18:-0.18)*k}
function stars(scene,n,r,o={}){const g=new THREE.BufferGeometry();const pos=[];for(let i=0;i<n;i++){pos.push((r()-0.5)*(o.w||80),(o.y0??8)+r()*(o.h||30),(o.z??-40)-r()*10)}g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const m=new THREE.PointsMaterial({color:0xfff6d8,size:o.size||0.18,sizeAttenuation:true});const p=new THREE.Points(g,m);scene.add(p);return p}
function glowSprite(col,s){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sp.scale.set(s,s,1);return sp}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function makeHouse(r,o={}){
  const g=new THREE.Group();const w=o.w||2.4,h=o.h||2,d=2.2;
  const wall=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lamb(o.wall||pick(r,[0x6f6a8f,0x5d6585,0x7a6f8a,0x66708c])));wall.position.y=h/2;g.add(wall);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(w*0.85,1.1,4),lamb(o.roof||pick(r,[0x8a4f5a,0x4f5a8a,0x5a7a6a,0x7a5a8a])));roof.rotation.y=Math.PI/4;roof.position.y=h+0.55;roof.scale.z=d/w;g.add(roof);
  for(const x of[-w*0.25,w*0.25]){const win=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.5),basic(r()<0.8?0xffe39a:0x3a3f5a));win.position.set(x,h*0.55,d/2+0.01);g.add(win)}
  return g;
}
renderer.setClearColor(0x000000,0);
