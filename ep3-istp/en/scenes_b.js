
// ---------- shared builders ----------
const BUBW={bg:'#ffffff',fg:'#2b2b3a'};
function woodTex(base,line,n=14){return canvasTex(512,512,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);x.strokeStyle=line;x.lineWidth=3;for(let i=0;i<=n;i++){const X=i*w/n;x.beginPath();x.moveTo(X,0);x.lineTo(X,h);x.stroke()}for(let i=0;i<n;i++)for(let j=0;j<3;j++){const y=((i*137+j*211)%512);x.beginPath();x.moveTo(i*w/n,y);x.lineTo((i+1)*w/n,y);x.stroke()}})}
function woodFloor(scene,base='#e3bb8c',line='#cfa575',size=40,rep=3){const t=woodTex(base,line);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);const f=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshLambertMaterial({map:t}));f.rotation.x=-Math.PI/2;scene.add(f);return f}
function box(scene,w,h,d,c,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lamb(c));m.position.set(x,y,z);if(scene)scene.add(m);return m}
function plant(scene,x,z,s=1){const g=new THREE.Group();const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.28*s,0.22*s,0.5*s,8),lamb(0xd98c5f));pot.position.y=0.25*s;g.add(pot);const lf=new THREE.Mesh(new THREE.IcosahedronGeometry(0.55*s,0),lamb(0x6fae6a));lf.position.y=0.95*s;g.add(lf);g.position.set(x,0,z);scene.add(g);return g}
function drawTV(x,w,h,ep){
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffd3dc');g.addColorStop(1,'#ffb3c4');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#fff3f6';x.fillRect(0,h*0.72,w,h*0.28);
  const fig=(cx,c,hair)=>{x.fillStyle=c;x.fillRect(cx-28,h*0.42,56,h*0.34);x.fillStyle='#f3cfae';x.beginPath();x.arc(cx,h*0.33,30,0,7);x.fill();x.fillStyle=hair;x.beginPath();x.arc(cx,h*0.31,31,Math.PI,0);x.fill()};
  fig(w*0.36,'#7fa4e0','#2a2220');fig(w*0.62,'#f07f9a','#4a3426');
  x.fillStyle='#ff4f7a';x.font=`900 60px ${FONT}`;x.textAlign='center';x.fillText('♥',w*0.49,h*0.3);
  x.fillStyle='#e8322f';x.fillRect(20,18,22,30);
  x.fillStyle='rgba(0,0,0,0.55)';x.fillRect(w-150,16,130,44);x.fillStyle='#fff';x.font=`900 30px ${FONT}`;x.fillText('EP.'+ep,w-85,49);
  x.fillStyle='rgba(0,0,0,0.6)';x.fillRect(w*0.2,h*0.82,w*0.6,50);x.fillStyle='#fff';x.font=`700 30px ${FONT}`;x.fillText(ep<6?'"I... like you."':'"Don\'t leave me..."',w*0.5,h*0.82+36);
}
// living room (S0/S1)
function buildLiving(scene,r){
  woodFloor(scene);
  box(scene,30,12,0.4,0xffe8d0,0,6,-4.2);           // back wall
  box(scene,0.6,12,0.6,0xf6dcc0,-3.9,6,-3.8);      // pillar
  const win=box(scene,2.1,2.3,0.08,0xffffff,2.9,4.1,-3.98);
  const pane=new THREE.Mesh(new THREE.PlaneGeometry(1.85,2.05),basic(0x2a3a66));pane.position.set(2.9,4.1,-3.92);scene.add(pane);
  const moon=new THREE.Mesh(new THREE.CircleGeometry(0.22,20),basic(0xfff1b8));moon.position.set(3.45,4.75,-3.9);scene.add(moon);moon.visible=false;
  // sofa
  box(scene,3.8,0.55,1.3,0x9db5de,0,0.42,-2.5);
  box(scene,3.8,1.1,0.35,0x8ea7d2,0,0.95,-3.05);
  for(const s of[-1,1])box(scene,0.35,0.85,1.3,0x8ea7d2,s*2.05,0.55,-2.5);
  const cush=box(scene,0.7,0.6,0.25,0xf0d7a8,1.2,1.0,-2.75);cush.rotation.z=0.2;
  // TV
  box(scene,2.4,0.55,0.8,0xf5efe6,-3.1,0.28,-1.2);
  const tvg=new THREE.Group();tvg.position.set(-3.1,1.45,-1.25);tvg.rotation.y=0.55;scene.add(tvg);
  const tvb=new THREE.Mesh(new THREE.BoxGeometry(2.5,1.55,0.12),lamb(0x1d1d24));tvg.add(tvb);
  const tvc=document.createElement('canvas');tvc.width=640;tvc.height=380;const tvx=tvc.getContext('2d');const tvt=new THREE.CanvasTexture(tvc);tvt.colorSpace=THREE.SRGBColorSpace;
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(2.32,1.38),new THREE.MeshBasicMaterial({map:tvt}));scr.position.z=0.07;tvg.add(scr);
  let curEp=-1;const setEp=ep=>{if(ep!==curEp){curEp=ep;drawTV(tvx,640,380,ep);tvt.needsUpdate=true}};setEp(1);
  // coffee table
  box(scene,2.3,0.12,1.1,0xf6efe4,0.9,0.72,0.4);
  for(const x of[-0.15,1.95])for(const z of[0,0.8])box(scene,0.1,0.7,0.1,0xb08a64,x,0.35,z);
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.14,0.14,12),lamb(0xe0574a));bowl.position.set(0.25,0.86,0.45);scene.add(bowl);
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.07,0.22,10),lamb(0x9cc9ff));cup.position.set(1.85,0.89,0.2);scene.add(cup);
  const phone=box(scene,0.32,0.04,0.55,0x1b1b22,1.2,0.8,0.5);phone.rotation.y=0.3;
  const phs=new THREE.Mesh(new THREE.PlaneGeometry(0.28,0.5),basic(0xe9f2ff));phs.rotation.x=-Math.PI/2;phs.position.y=0.025;phone.add(phs);
  plant(scene,3.4,-2.6,1.2);
  // ISTP on sofa with cup noodles
  const p=makePerson(r,{shirt:0xf0a440,pants:0x33384a});p.position.set(0.2,0.25,-2.35);sitPose(p);scene.add(p);
  const noodle=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.12,0.3,10),lamb(0xf2c45a));noodle.position.set(0.17,-0.62,0.12);p.userData.arms[0].add(noodle);
  const sticks=new THREE.Group();for(const dx of[-0.03,0.03]){const s=new THREE.Mesh(new THREE.BoxGeometry(0.025,0.55,0.025),lamb(0xd8b27a));s.position.set(dx,0,0);sticks.add(s)}
  sticks.position.set(0,-0.75,0.08);p.userData.arms[1].add(sticks);
  return {pane,moon,setEp,phone,p,tvg};
}
function notif(phone,scene){
  const b=makeBubble('Hangout this week?',{bg:'#ffffff',fg:'#2b2b3a',fs:64,size:0.0042});b.position.set(0.75,1.1,0.6);scene.add(b);
  const badge=labelSprite('5',{bg:'#ff4d4d',fg:'#fff',fs:54,r:40,size:0.0036});badge.center.set(0.5,0);badge.position.set(0.3,1.6,0.62);scene.add(badge);
  return {b,badge};
}

// ---------- S0: living room — drama binge, ignored notification (title) ----------
S[0]=()=>{
  bgEl.style.background='linear-gradient(#f6e3cf,#f3dcc4)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.65,dir:1.3,dpos:[5,10,8]});
  const r=rng(303);const L=buildLiving(scene,r);const N=notif(L.phone,scene);
  const glow=glowSprite('rgba(255,250,235,1)',1.6);glow.position.set(1.2,0.95,0.55);scene.add(glow);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="tag">#003</div><div class="title1 out" style="font-size:104px;letter-spacing:-2px;top:345px">What if everyone</div><div class="title2 out" style="color:${ORANGE};font-size:178px;top:478px;letter-spacing:-4px">was ISTP?</div>`;
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2');
  let lastN=-1;
  return t=>{
    const u=L.p.userData;u.arms[0].rotation.x=-1.25;u.arms[1].rotation.x=-1.0-Math.max(0,Math.sin(t*5))*0.5;
    u.head.rotation.y=-0.35;
    const n=Math.min(9,5+Math.floor(t/0.45));if(n!==lastN){lastN=n;N.badge.material.map=labelSprite(String(n),{bg:'#ff4d4d',fg:'#fff',fs:54,r:40}).material.map}
    const buzz=(t%0.9)<0.35;L.phone.position.x=1.2+(buzz?Math.sin(t*120)*0.03:0);
    glow.material.opacity=buzz?0.9:0.35;
    scaleBubble(N.b,pop((t-0.35)/0.3));scaleBubble(N.badge,pop((t-0.5)/0.25));
    L.setEp(1);
    cam.position.set(0.6,4.0,8.8-t*0.3);cam.lookAt(0.1,1.5,-1.2);
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.25)})`;
    t1.style.transform=`scale(${pop((t-0.05)/0.3)})`;t1.style.opacity=clamp01((t-0.05)/0.08);
    t2.style.transform=`scale(${pop((t-0.25)/0.35)})`;t2.style.opacity=clamp01((t-0.25)/0.08);
    caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- S1: Mon → Wed time-lapse, every reply "k" ----------
S[1]=()=>{
  bgEl.style.background='linear-gradient(#f6e3cf,#f3dcc4)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.65,dir:1.3,dpos:[5,10,8]});
  const r=rng(303);const L=buildLiving(scene,r);const N=notif(L.phone,scene);
  const one=makeBubble('One more episode',{bg:'#fff3df',fg:'#5a3a10',fs:60,size:0.0044});one.position.y=1.9;L.p.add(one);
  const cups=[];for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.12,0.3,10),lamb(0xf2c45a));c.position.set(0.75+(i%2)*0.04,0.93+i*0.27,0.15);scene.add(c);cups.push(c)}
  const ks=[];const KP=[[1.7,1.5],[1.1,1.95],[1.95,2.35],[1.3,2.75],[1.85,3.15]];
  for(let i=0;i<KP.length;i++){const b=makeBubble('k',{bg:'#ffffff',fg:'#2b2b3a',fs:66,size:0.0048});b.position.set(KP[i][0],KP[i][1],0.4);scene.add(b);ks.push(b)}
  const big=makeBubble('k',{bg:'#ffd84d',fg:'#3a2a00',fs:90,size:0.0062});big.position.set(1.5,3.65,0.4);scene.add(big);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip('Mon 8:00 PM');let lastC='';
  const days=[[0,'Mon 8:00 PM'],[0.55,'Tue 8:00 PM'],[1.05,'Wed 8:00 PM'],[1.55,'Wed 9:00 PM'],[vt(1,4.55),'✔ Plans set · took 3 days']];
  return t=>{
    let lab=days[0][1],t0=0;for(const d of days)if(t>=d[0]){lab=d[1];t0=d[0]}
    if(lab!==lastC){lastC=lab;ch.textContent=lab}
    chipPop(ch,t,t0);
    // time-lapse: window day/night, episodes, cup stack
    const tl=clamp01(t/1.9);const day=Math.max(0,Math.sin(tl*Math.PI*2.2))*(t<1.9?1:0);
    L.pane.material.color.setRGB(0.16+day*0.5,0.23+day*0.55,0.4+day*0.5);L.moon.visible=t>1.9;
    L.setEp(Math.min(12,1+Math.floor(t/0.17)));
    cups.forEach((c,i)=>c.visible=t>0.2+i*0.3);
    const u=L.p.userData;u.arms[0].rotation.x=-1.25;u.arms[1].rotation.x=-1.0-Math.max(0,Math.sin(t*7))*0.5;u.head.rotation.y=t<vt(1,1.9)?-0.35:0.1;
    scaleBubble(one,t<vt(1,1.9)?pop((t-0.2)/0.25):0);
    const n=Math.min(99,9+Math.floor(t*14));N.badge.visible=true;if(N.badge.userData.n!==n){N.badge.userData.n=n;N.badge.material.map=labelSprite(String(t>vt(1,2.2)?1:n),{bg:'#ff4d4d',fg:'#fff',fs:54,r:40}).material.map}
    scaleBubble(N.b,1);scaleBubble(N.badge,1);
    ks.forEach((b,i)=>scaleBubble(b,pop((t-vt(1,2.3)-i*0.28)/0.22)));
    scaleBubble(big,pop((t-vt(1,3.85))/0.3));
    cam.position.set(0.6,4.0,8.6);cam.lookAt(0.1,1.75,-1.2);
    caption(1,t);renderer.render(scene,cam);
  };
};

// ---------- S2: breaking news → café "Not my type" ----------
function buildCafe(scene,r){
  box(scene,30,12,0.4,0xd9cfc4,0,6,-3.2);
  for(const x of[-2.1,2.1]){box(scene,3.6,2.8,0.1,0xf5f5f5,x,3.6,-2.98);const g=new THREE.Mesh(new THREE.PlaneGeometry(3.3,2.5),basic(0xaecbe0));g.position.set(x,3.6,-2.92);scene.add(g)}
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xeed8bf));fl.rotation.x=-Math.PI/2;scene.add(fl);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.8,0.08,20),lamb(0xffffff));top.position.set(0,1.2,0);scene.add(top);
  box(scene,0.1,1.2,0.1,0x8a6a4a,0,0.6,0);
  for(const [x,c] of[[-0.3,0xf2b8c6],[0.3,0x9cc9ff]]){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.07,0.2,10),lamb(c));m.position.set(x,1.34,0.05);scene.add(m)}
  const A=makePerson(r,{shirt:0xf0a440,pants:0x33384a});A.position.set(-1.35,0.1,0);A.rotation.y=Math.PI/2;sitPose(A);scene.add(A);
  const B=makePerson(r,{shirt:0xa58cd0,pants:0x3d3a50});B.position.set(1.35,0.1,0);B.rotation.y=-Math.PI/2;sitPose(B);scene.add(B);
  for(const [x,ry] of[[-1.5,0],[1.5,0]]){box(scene,0.8,0.12,0.8,0xb98a5c,x,0.6,0);box(scene,0.12,1.1,0.8,0xb98a5c,x+(x<0?-0.4:0.4),1.1,0)}
  for(const P of[A,B]){P.userData.arms.forEach(a=>a.rotation.x=-1.2)}
  return {A,B};
}
S[2]=()=>{
  const cut=vt(2,2.2);
  // news
  const sN=new THREE.Scene();addLights(sN,{hemi:1.5,dir:1.0});
  const r=rng(322);
  box(sN,6,1.3,1.1,0x2f5ea8,0,0.65,0.6);box(sN,6.2,0.1,1.3,0xdfe8f5,0,1.33,0.6);
  const anc=makePerson(r,{shirt:0x2a2f44,pants:0x22263a});anc.position.set(0,0.1,-0.4);sitPose(anc);sN.add(anc);
  const tie=box(null,0.08,0.4,0.02,0xe8322f,0,0.4,0.17);anc.userData.hip.add(tie);
  const chc=document.createElement('canvas');chc.width=800;chc.height=480;const chx=chc.getContext('2d');const cht=new THREE.CanvasTexture(chc);cht.colorSpace=THREE.SRGBColorSpace;
  const board=new THREE.Group();board.position.set(0,3.55,-1.5);board.scale.set(0.72,0.72,1);sN.add(board);
  board.add(new THREE.Mesh(new THREE.BoxGeometry(4.3,2.7,0.1),lamb(0x111622)));
  const bs=new THREE.Mesh(new THREE.PlaneGeometry(4.1,2.5),new THREE.MeshBasicMaterial({map:cht}));bs.position.z=0.06;board.add(bs);
  const drawChart=k=>{const x=chx;x.fillStyle='#1e2f57';x.fillRect(0,0,800,480);x.strokeStyle='rgba(255,255,255,0.15)';x.lineWidth=2;for(let i=1;i<5;i++){x.beginPath();x.moveTo(40,i*90+20);x.lineTo(770,i*90+20);x.stroke()}
    x.fillStyle='#fff';x.font=`900 40px ${FONT}`;x.textAlign='left';x.fillText('Dating rate (%)',40,62);
    const pts=[[60,130],[200,140],[330,150],[450,175],[560,230],[650,300],[740,390]];x.strokeStyle='#ff6b7a';x.lineWidth=9;x.lineCap='round';x.beginPath();
    const n=Math.max(1,Math.floor(k*(pts.length-1)*10));for(let i=0;i<=n;i++){const f=i/10,a=Math.floor(f),b=Math.min(pts.length-1,a+1),u=f-a;const X=pts[a][0]+(pts[b][0]-pts[a][0])*u,Y=pts[a][1]+(pts[b][1]-pts[a][1])*u;i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();cht.needsUpdate=true};
  const camN=new THREE.PerspectiveCamera(48,W/H,0.1,100);
  // cafe
  const sC=new THREE.Scene();addLights(sC,{hemi:1.6,dir:1.2});
  const C=buildCafe(sC,rng(323));
  const nA=makeBubble('✖ Not my type',{bg:'#ff6b6b',fg:'#ffffff',fs:62,size:0.0036});nA.position.y=1.85;C.A.add(nA);
  const nB=makeBubble('✖ Not my type',{bg:'#ff6b6b',fg:'#ffffff',fs:62,size:0.0036});nB.position.y=1.85;C.B.add(nB);
  const camC=new THREE.PerspectiveCamera(46,W/H,0.1,100);
  let lastK=-1;
  return t=>{
    if(t<cut){
      bgEl.style.background='#2a4170';
      if(!ui.querySelector('.ticker')){ui.insertAdjacentHTML('beforeend','<div class="ticker" style="position:absolute;left:70px;right:70px;top:1420px;height:96px;display:flex;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.3)"><div style="background:#e8322f;color:#fff;font-weight:900;font-size:44px;padding:0 26px;display:flex;align-items:center">BREAKING</div><div style="flex:1;color:#1b2440;font-weight:900;font-size:44px;display:flex;align-items:center;padding-left:26px;white-space:nowrap">Dating rate hits record low</div></div>')}
      const tk=ui.querySelector('.ticker');tk.style.transform=`translateX(${(1-ease((t-0.15)/0.35))*-1200}px)`;
      const k=Math.round(clamp01((t-0.2)/1.6)*60);if(k!==lastK){lastK=k;drawChart(k/60)}
      camN.position.set(0,2.4,6.9-t*0.3);camN.lookAt(0,2.05,0);
      caption(2,t);renderer.render(sN,camN);
    }else{
      const tk=ui.querySelector('.ticker');if(tk)tk.remove();
      bgEl.style.background='linear-gradient(#e2d8cc,#e9dccb)';
      const u=t-cut;
      scaleBubble(nA,pop((u-0.25)/0.25));scaleBubble(nB,pop((u-0.45)/0.25));
      C.A.userData.head.rotation.y=Math.sin(u*2)*0.05;
      camC.position.set(0,3.0,9.6-u*0.25);camC.lookAt(0,1.85,0);
      caption(2,t);renderer.render(sC,camC);
    }
  };
};

// ---------- S3: café "Oh, okay." → ♥ Smitten → 3 years later wedding ----------
S[3]=()=>{
  const cut=vt(3,1.75);
  const sC=new THREE.Scene();addLights(sC,{hemi:1.6,dir:1.2});
  const C=buildCafe(sC,rng(323));
  const oA=makeBubble('Oh, okay.',{...BUBW,fs:64,size:0.0038});oA.position.y=1.85;C.A.add(oA);
  const oB=makeBubble('Oh, okay.',{...BUBW,fs:64,size:0.0038});oB.position.y=1.85;C.B.add(oB);
  const sm=makeBubble('♥ Smitten',{bg:'#ff8fb1',fg:'#ffffff',fs:84,size:0.0042});sC.add(sm);sm.position.set(-0.3,2.95,0.3);C.A.add(sm);
  const hearts=[];for(let i=0;i<6;i++){const h=textSprite('♥',90,'#ff7aa2',0.0035);h.position.set(-0.9+(i%2)*0.3,3.6+i*0.3,0.3);sC.add(h);hearts.push(h)}
  const camC=new THREE.PerspectiveCamera(46,W/H,0.1,100);
  // wedding
  const sW=new THREE.Scene();addLights(sW,{hemi:1.7,dir:1.1});
  const r=rng(333);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xb9e3a6));gr.rotation.x=-Math.PI/2;sW.add(gr);
  const path=new THREE.Mesh(new THREE.PlaneGeometry(2.6,40),lamb(0xffffff));path.rotation.x=-Math.PI/2;path.position.set(0,0.01,10);sW.add(path);
  const PC=[0xf7a8c0,0xfff0f4,0xf8e08a,0xffd0dc,0xe8e8e8];
  for(let i=0;i<=16;i++){const a=Math.PI*i/16;const ic=new THREE.Mesh(new THREE.IcosahedronGeometry(0.28,0),lamb(PC[i%5]));ic.position.set(Math.cos(a)*2.1,1.6+Math.sin(a)*2.0,-0.6);ic.rotation.set(i,i*2,0);sW.add(ic)}
  for(const s of[-1,1])box(sW,0.22,1.7,0.22,0xf0ece8,s*2.1,0.85,-0.6);
  const G=makePerson(r,{shirt:0xf0a440,pants:0x22263a});G.position.set(-0.5,0,0);sW.add(G);
  const bt=box(null,0.14,0.06,0.02,0x222222,0,0.55,0.17);G.userData.hip.add(bt);
  const Bd=makePerson(r,{shirt:0xffffff,pants:0xffffff});Bd.position.set(0.5,0,0);sW.add(Bd);
  const dress=new THREE.Mesh(new THREE.ConeGeometry(0.62,1.15,10),lamb(0xffffff));dress.position.y=0.05;Bd.userData.hip.add(dress);dress.position.y=-0.25;
  const hb=makeBubble('♥',{bg:'#ff8fb1',fg:'#ffffff',fs:110,size:0.0045});hb.position.set(0,3.0,0);sW.add(hb);
  const fall=[];for(let i=0;i<14;i++){const c=pick(r,['#ff7aa2','#ffd84d','#ff9ec0']);const h=textSprite('♥',80,c,0.0045);h.userData={x:(r()-0.5)*5,y0:2+r()*5,sp:0.6+r()*0.6,ph:r()*6};sW.add(h);fall.push(h)}
  const camW=new THREE.PerspectiveCamera(46,W/H,0.1,100);
  let ch=null;
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#e2d8cc,#e9dccb)';
      scaleBubble(oA,t<vt(3,0.9)?pop((t-0.1)/0.25):0);scaleBubble(oB,pop((t-0.3)/0.25));
      const sk=pop((t-vt(3,0.9))/0.3);scaleBubble(sm,t>vt(3,0.9)?sk:0);
      hearts.forEach((h,i)=>{const k=pop((t-vt(3,1.0)-i*0.08)/0.2);h.visible=k>0.01;h.scale.set(h.userData.base[0]*k,h.userData.base[1]*k,1)});
      C.A.userData.head.rotation.x=t>vt(3,0.9)?-0.15:0;
      camC.position.set(0,3.0,9.6-t*0.5);camC.lookAt(0,1.85,0);
      caption(3,t);renderer.render(sC,camC);
    }else{
      if(!ch){ch=chip('3 years later')}
      bgEl.style.background='linear-gradient(#ffe4ec,#ffd8e3)';
      const u=t-cut;chipPop(ch,u,0);
      scaleBubble(hb,pop((u-0.15)/0.3));hb.position.y=3.0+Math.sin(u*3)*0.06;
      fall.forEach(h=>{const d=h.userData;h.position.set(d.x+Math.sin(u*2+d.ph)*0.2,d.y0+2-((u*d.sp*1.5)%7),1.2)});
      G.userData.arms[1].rotation.z=0.3;Bd.userData.arms[0].rotation.z=-0.3;
      camW.position.set(0,2.0,7.6-u*0.35);camW.lookAt(0,2.1,0);
      caption(3,t);renderer.render(sW,camW);
    }
  };
};
