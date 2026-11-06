
// ---------- S4: split screen — "I got dumped" vs "k" (advice in 3 sec) ----------
S[4]=()=>{
  bgEl.style.background='#000';
  const r=rng(344);
  const sT=new THREE.Scene();sT.background=new THREE.Color(0xb7a8c6);addLights(sT,{hemi:1.5,dir:1.0});
  const flT=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xc9b8dc));flT.rotation.x=-Math.PI/2;sT.add(flT);
  box(sT,30,10,0.3,0xb3a3c4,0,5,-2.2);
  const wT=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.2),basic(0x1f2a4f));wT.position.set(1.9,3.0,-2.03);sT.add(wT);
  box(sT,2.6,0.5,1.6,0xe8e8ec,0,0.25,-0.6);box(sT,2.6,0.22,1.6,0x7fa6e0,0,0.6,-0.6);
  const sad=makePerson(r,{shirt:0xa58cd0,pants:0x2c2c3a});sad.position.set(0,0.12,-0.6);sitPose(sad);sad.userData.head.rotation.x=0.3;sT.add(sad);
  sad.userData.arms.forEach(a=>a.rotation.x=-0.6);
  const dump=makeBubble('I got dumped',{...BUBW,fs:66,size:0.0040});dump.position.y=1.9;sad.add(dump);
  const camT=new THREE.PerspectiveCamera(44,W/(H/2),0.1,100);
  const sB=new THREE.Scene();sB.background=new THREE.Color(0xd9c2ab);addLights(sB,{hemi:1.6,dir:1.1});
  const flB=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xd6b896));flB.rotation.x=-Math.PI/2;sB.add(flB);
  box(sB,30,10,0.3,0xd9c2ab,0,5,-2.6);
  box(sB,2.4,0.1,1.0,0xf3efe8,0,1.1,-1.2);
  const mon=box(sB,1.1,0.75,0.08,0x2a2a33,-0.4,1.6,-1.55);const ms=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.65),basic(0x8ec3ea));ms.position.set(-0.4,1.6,-1.5);sB.add(ms);
  const me=makePerson(r,{shirt:0xf0a440,pants:0x33384a});me.position.set(0.1,0.12,-0.25);me.rotation.y=Math.PI;sitPose(me);sB.add(me);
  // turn the person to face camera with phone
  me.rotation.y=0.15;
  const ph=box(null,0.09,0.16,0.02,0x1b1b22,0,-0.66,0.1);me.userData.arms[1].add(ph);
  const kb=makeBubble('k',{bg:'#ffe7c7',fg:'#5a3a10',fs:80,size:0.0036});kb.position.y=1.85;me.add(kb);
  const camB=new THREE.PerspectiveCamera(44,W/(H/2),0.1,100);
  ui.insertAdjacentHTML('beforeend','<div style="position:absolute;left:0;right:0;top:958px;height:6px;background:#fff"></div>');
  const ch=chip('Advice time: 0 sec',915);ch.style.fontSize='48px';let last=-1;
  return t=>{
    const s=Math.min(3,Math.floor(clamp01((t-0.3)/1.5)*3.99));if(s!==last){last=s;ch.textContent=`Advice time: ${s} sec`}
    chipPop(ch,t,0.1);
    scaleBubble(dump,pop((t-0.1)/0.25));
    if(t>vt(4,1.55)&&!kb.userData.sw){kb.userData.sw=1;setBubble(kb,'BBQ?',{bg:'#ffe7c7',fg:'#5a3a10',fs:80,size:0.0036})}
    scaleBubble(kb,t<vt(4,1.55)?pop((t-0.75)/0.22):pop((t-vt(4,1.55))/0.22));
    me.userData.arms[1].rotation.x=-1.9;me.userData.head.rotation.x=0.2;
    sad.userData.head.rotation.z=Math.sin(t*2)*0.05;
    camT.position.set(0,2.2,5.2);camT.lookAt(0,1.4,-0.6);
    camB.position.set(0.2,2.4,5.6);camB.lookAt(0.1,2.55,-0.5);
    renderer.setScissorTest(true);
    renderer.setViewport(0,H/2,W,H/2);renderer.setScissor(0,H/2,W,H/2);renderer.render(sT,camT);
    renderer.setViewport(0,0,W,H/2);renderer.setScissor(0,0,W,H/2);renderer.render(sB,camB);
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);
    caption(4,t);
  };
};

// ---------- S5: Korean BBQ instead of comfort ----------
S[5]=()=>{
  bgEl.style.background='linear-gradient(#b48c6c,#a37e60)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5,dir:1.0});
  const r=rng(355);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0x8a6448));fl.rotation.x=-Math.PI/2;scene.add(fl);
  box(scene,30,12,0.3,0xb08a6a,0,6,-3);
  const tb=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,0.14,24),lamb(0x6b4a34));tb.position.set(0,1.1,0);scene.add(tb);
  box(scene,0.3,1.05,0.3,0x4a3424,0,0.52,0);
  const grill=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.45,0.2,20),lamb(0x2a2a2e));grill.position.set(0,1.25,0);scene.add(grill);
  const meats=[];for(let i=0;i<4;i++){const m=box(scene,0.32,0.05,0.16,0xd4686a,-0.2+(i%2)*0.38,1.38,-0.15+Math.floor(i/2)*0.3);m.rotation.y=i*0.4;meats.push(m)}
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const d=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.06,12),lamb(i%2?0xffffff:0x7fbf7f));d.position.set(Math.cos(a)*0.95,1.21,Math.sin(a)*0.95);scene.add(d)}
  const pipe=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,4,10),lamb(0x9a9aa2));pipe.position.set(0,5.6,0);scene.add(pipe);
  const hood=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.75,0.6,16),lamb(0xa8a8b0));hood.position.set(0,3.4,0);scene.add(hood);
  const glow=glowSprite('rgba(255,190,120,1)',2.6);glow.position.set(0,1.6,0);scene.add(glow);
  const A=makePerson(r,{shirt:0xa58cd0,pants:0x2c2c3a});A.position.set(-1.6,0.1,0.1);A.rotation.y=Math.PI/2;sitPose(A);scene.add(A);
  const B=makePerson(r,{shirt:0xf0a440,pants:0x33384a});B.position.set(1.6,0.1,0.1);B.rotation.y=-Math.PI/2;sitPose(B);scene.add(B);
  const tongs=box(null,0.04,0.5,0.04,0xc0c0c8,0,-0.8,0.1);B.userData.arms[0].add(tongs);
  const siz=textSprite('Sizzle',96,'#ffffff',0.0036);siz.position.set(0.7,2.6,0.9);scene.add(siz);
  const good=makeBubble('...so good',{...BUBW,fs:64,size:0.0034});good.position.set(-1.0,2.85,0.3);scene.add(good);
  const ch=chip('7:00 PM · Korean BBQ');
  const cam=new THREE.PerspectiveCamera(48,W/H,0.1,100);
  return t=>{
    chipPop(ch,t,0);
    meats.forEach((m,i)=>m.position.y=1.38+Math.abs(Math.sin(t*9+i))*0.03);
    glow.material.opacity=0.7+Math.sin(t*11)*0.15;
    const sk=pop((t-0.25)/0.25)*(1+Math.sin(t*10)*0.04);siz.scale.set(siz.userData.base[0]*sk,siz.userData.base[1]*sk,1);
    scaleBubble(good,pop((t-vt(5,1.2))/0.25));
    B.userData.arms[0].rotation.x=-1.0+Math.sin(t*6)*0.15;A.userData.arms.forEach(a=>a.rotation.x=-1.1);
    A.userData.head.rotation.x=0.15;
    cam.position.set(0,3.6,8.8-t*0.25);cam.lookAt(0,1.6,0);
    caption(5,t);renderer.render(scene,cam);
  };
};

// ---------- S6: party — silent, then vanish one by one ----------
S[6]=()=>{
  bgEl.style.background='linear-gradient(#bcd0e2,#c9d9e8)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.65,dir:1.2,dpos:[3,10,8]});
  const r=rng(366);
  woodFloor(scene,'#f1dcb8','#e2c9a0');
  box(scene,30,12,0.3,0xbdd0e3,0,6,-3.6);box(scene,0.3,12,30,0xa9bfd6,-5.5,6,0);
  const tri=[0xf06a7a,0xf8d24a,0x6fc28a,0x7fa6e0];
  for(let i=0;i<14;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.5,3),lamb(tri[i%4]));c.rotation.x=Math.PI;c.position.set(-4+i*0.75,6.3-Math.sin(i/13*Math.PI)*0.35,-3.4);scene.add(c)}
  const hp=textSprite('HAPPY',150,'#ffab4a',0.0075);hp.position.set(-1.5,3.7,-3.3);scene.add(hp);
  for(const [x,c] of[[-4.2,0xff8fb1],[-3.7,0xf8d24a]]){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(0.45,1),lamb(c));b.position.set(x,5.7,-3.2);scene.add(b)}
  // L sofa
  box(scene,7,0.5,1.2,0x8fd1a4,0.5,0.4,-2.7);box(scene,7,1.0,0.3,0x7fc496,0.5,0.9,-3.25);
  box(scene,1.2,0.5,4,0x8fd1a4,-3.6,0.4,-0.6);box(scene,0.3,1.0,4,0x7fc496,-4.15,0.9,-0.6);
  box(scene,2.4,0.15,1.3,0xf8f2e8,0.2,0.62,-0.5);for(const x of[-0.9,1.3])for(const z of[-1,0])box(scene,0.1,0.55,0.1,0xd8c8b0,x,0.28,z);
  const pz=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,0.06,8),lamb(0xf28a3a));pz.position.set(-0.3,0.73,-0.5);scene.add(pz);
  for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.06,0.18,8),lamb(pick(r,[0x9cc9ff,0xf2b8c6,0xffffff])));c.position.set(0.5+(i%2)*0.25,0.78,-0.75+Math.floor(i/2)*0.3);scene.add(c)}
  box(scene,0.5,0.03,0.3,0xf8d24a,0.9,0.71,-0.15);
  const seats=[[-2.2,-2.6,0],[-0.7,-2.6,0],[0.9,-2.6,0],[2.5,-2.6,0],[-3.5,-1.2,Math.PI/2],[-3.5,0.4,Math.PI/2]];
  const SH=[0xa58cd0,0x6c8ebf,0xd98c8c,0xf0a440,0x7fb7c9,0x8cc9a0];
  const ppl=seats.map((s,i)=>{const p=makePerson(r,{shirt:SH[i]});p.position.set(s[0],0.18,s[1]);p.rotation.y=s[2];sitPose(p);scene.add(p);
    const b=makeBubble('...',{...BUBW,fs:60,size:0.0048});b.position.y=1.85;p.add(b);
    const puff=glowSprite('rgba(255,255,255,1)',1.4);puff.position.set(s[0],1.3,s[1]);scene.add(puff);puff.visible=false;
    const ws=textSprite('Whoosh',70,'#ffffff',0.0048);ws.position.set(s[0]+0.4,2.4,s[1]);scene.add(ws);ws.visible=false;
    return {p,b,puff,ws,ph:r()*6}});
  const order=[3,0,4,2,5];const vt0=vt(6,3.35);
  const ch=chip('7:20 PM');let last='';
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  return t=>{
    const mins=7*60+20+Math.floor(clamp01(t/(VOICE[6]+0.6))*120/10)*10;const lab=`${Math.floor(mins/60)}:${String(mins%60).padStart(2,'0')} PM`;
    if(lab!==last){last=lab;ch.textContent=lab}chipPop(ch,t,0);
    ppl.forEach((q,i)=>{scaleBubble(q.b,pop((t-0.15-i*0.07)/0.25));q.p.userData.arms.forEach(a=>a.rotation.x=-0.55);q.p.userData.head.rotation.y=Math.sin(t*1.3+q.ph)*0.15;
      const oi=order.indexOf(i);if(oi>=0){const tv=vt0+oi*0.48;const u=t-tv;
        if(u>0){q.p.visible=false;q.b.visible=false;q.puff.visible=u<0.6;q.puff.material.opacity=1-u/0.6;const k=1+u*1.2;q.puff.scale.set(1.4*k,1.4*k,1);
          q.ws.visible=u<0.7;q.ws.position.y=2.4+u*0.6;q.ws.material.opacity=1-clamp01((u-0.4)/0.3)}}});
    cam.position.set(1.4,6.2,7.4);cam.lookAt(-0.5,1.5,-1.3);
    caption(6,t);renderer.render(scene,cam);
  };
};

// ---------- S7: tearjerker screen → poker-faced audience, popcorn crunch ----------
S[7]=()=>{
  const cut=vt(7,1.75);
  const r=rng(377);
  // screen view
  const sS=new THREE.Scene();addLights(sS,{hemi:0.6,dir:0.3,sky:0x8090ff});
  const scc=document.createElement('canvas');scc.width=900;scc.height=560;const sx=scc.getContext('2d');const sct=new THREE.CanvasTexture(scc);sct.colorSpace=THREE.SRGBColorSpace;
  const drawScreen=t=>{const g=sx.createLinearGradient(0,0,0,560);g.addColorStop(0,'#5d74c4');g.addColorStop(1,'#8fa6ea');sx.fillStyle=g;sx.fillRect(0,0,900,560);
    sx.strokeStyle='rgba(255,255,255,0.35)';sx.lineWidth=3;for(let i=0;i<40;i++){const X=(i*97+t*40)%900,Y=(i*53+t*600)%560;sx.beginPath();sx.moveTo(X,Y);sx.lineTo(X-4,Y+26);sx.stroke()}
    sx.fillStyle='#fdf6ee';sx.beginPath();sx.arc(450,250,120,0,7);sx.fill();sx.fillStyle='#2a2830';sx.beginPath();sx.arc(450,228,124,Math.PI*1.02,Math.PI*1.98);sx.fill();
    sx.strokeStyle='#222';sx.lineWidth=10;sx.beginPath();sx.moveTo(390,250);sx.lineTo(430,262);sx.moveTo(510,250);sx.lineTo(470,262);sx.stroke();
    sx.fillStyle='#4fc3f7';sx.fillRect(398,262,22,90+Math.sin(t*8)*8);sx.fillRect(480,262,22,90+Math.cos(t*8)*8);
    sx.fillStyle='#222';sx.beginPath();sx.ellipse(450,320,22,28,0,0,7);sx.fill();
    sx.fillStyle='rgba(0,0,0,0.55)';sx.fillRect(0,440,900,80);sx.fillStyle='#fff';sx.font=`900 46px ${FONT}`;sx.textAlign='center';sx.fillText('"Mommyyy... don\'t go..."',450,496);sct.needsUpdate=true};
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(9,5.6),new THREE.MeshBasicMaterial({map:sct}));scr.position.set(0,4.2,-6);sS.add(scr);
  const sg=glowSprite('rgba(140,160,255,1)',16);sg.position.set(0,4,-6.5);sS.add(sg);
  for(let i=0;i<7;i++){const h=new THREE.Mesh(new THREE.SphereGeometry(0.75,12,10),lamb(0x2a2420));h.position.set(-4.5+i*1.5+(i%2)*0.3,0.8+(i%2)*0.3,1.6+(i%3)*0.4);sS.add(h)}
  const camS=new THREE.PerspectiveCamera(55,W/H,0.1,100);
  // audience
  const sA=new THREE.Scene();addLights(sA,{hemi:0.95,dir:0.9,sky:0xc8c8ff,ground:0x302040,dpos:[0,6,10]});
  const audience=[];
  for(let row=0;row<4;row++){const z=-row*1.5,y=row*0.55;
    box(sA,14,y+0.01,1.5,0x1c1830,0,y/2,z-0.2);
    for(let i=0;i<5;i++){const x=(i-2)*1.45+(row%2)*0.3;
      box(sA,1.1,0.5,0.9,0xa8304a,x,y+0.25,z-0.1);box(sA,1.1,1.3,0.25,0x962a42,x,y+0.75,z-0.6);
      const p=makePerson(r);p.position.set(x,y+0.05,z);sitPose(p);sA.add(p);
      const pc=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.15,0.35,10),lamb(0xffffff));pc.position.set(0,0.62,0.45);p.add(pc);
      const pt=new THREE.Mesh(new THREE.IcosahedronGeometry(0.17,0),lamb(0xfff3c4));pt.position.set(0,0.82,0.45);p.add(pt);
      p.userData.arms[1].rotation.x=-1.3;
      const b=makeBubble('...',{...BUBW,fs:60,size:0.0045});b.position.y=1.8;p.add(b);
      audience.push({p,b,row,i,ph:r()*6,show:r()<0.55})}}
  const cr=[];for(const [x,y] of[[-0.45,2.9],[0.5,2.2],[0.0,3.55]]){const s=textSprite('Crunch',80,'#ffe27a',0.0030);s.position.set(x,y,1.2);sA.add(s);s.visible=false;cr.push(s)}
  const camA=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  let ch=null;
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#0d0f1f,#1b2040)';
      drawScreen(t);camS.position.set(0,2.6,6.5-t*0.3);camS.lookAt(0,3.4,-6);
      caption(7,t);renderer.render(sS,camS);
    }else{
      if(!ch){ch=chip('Ultimate tearjerker · 0 tears');ch.style.fontSize='50px'}
      bgEl.style.background='linear-gradient(#0e0c1c,#16122a)';
      const u=t-cut;chipPop(ch,u,0);
      audience.forEach(q=>{if(q.show)scaleBubble(q.b,pop((u-0.2-q.i*0.05-q.row*0.04)/0.25));else q.b.visible=false;
        q.p.userData.arms[1].rotation.x=-1.3-Math.max(0,Math.sin(u*5+q.ph))*0.5;q.p.userData.hip.position.y=0.56});
      const cs=vt(7,2.85)-cut;cr.forEach((s,i)=>{const k=pop((u-cs-i*0.35)/0.2);s.visible=u>cs+i*0.35;s.scale.set(s.userData.base[0]*k,s.userData.base[1]*k,1)});
      camA.position.set(0,3.2,6.4-u*0.25);camA.lookAt(0,1.9,-1.5);
      caption(7,t);renderer.render(sA,camA);
    }
  };
};
