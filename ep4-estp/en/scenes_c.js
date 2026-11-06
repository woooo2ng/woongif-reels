
// ---------- S5: no arguing → one round of sparring, no hard feelings ----------
function helmet(p,c){const h=new THREE.Mesh(new THREE.SphereGeometry(0.29,14,10,0,Math.PI*2,0,Math.PI*0.6),lamb(c));h.position.y=0.26;p.userData.head.add(h);
  p.userData.arms.forEach(a=>{const g=new THREE.Mesh(new THREE.SphereGeometry(0.15,10,8),lamb(c));g.position.y=-0.62;a.add(g)})}
S[5]=()=>{
  const cut=vt(5,1.6),shake=vt(5,4.0),fin=vt(5,5.4);
  const r=rng(455);
  // argument table
  const sT=new THREE.Scene();addLights(sT,{hemi:1.6,dir:1.1});
  const f1=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xd0d8e2));f1.rotation.x=-Math.PI/2;sT.add(f1);box(sT,30,10,0.3,0xc8ced6,0,5,-3);
  box(sT,3.2,0.12,1.0,0xf3e3c8,0,1.1,0);for(const x of[-1.4,1.4])box(sT,0.12,1.1,0.12,0xb89a76,x,0.55,0);
  const A=makePerson(r,{shirt:0xe8502f});A.position.set(-1.9,0,0);A.rotation.y=Math.PI/2;sT.add(A);
  const B=makePerson(r,{shirt:0x6c8ebf});B.position.set(1.9,0,0);B.rotation.y=-Math.PI/2;sT.add(B);
  const ba=makeBubble("That's not what—",{...BUBP,fs:58,size:0.0042});ba.position.set(-1.0,2.45,0);sT.add(ba);
  const bb=makeBubble('No, what I mean is—',{...BUBP,fs:58,size:0.0042});bb.position.set(1.0,2.95,0);sT.add(bb);
  const xa=textSprite('✖',200,'#e8322f',0.0036);xa.position.set(-1.9,2.0,0.3);sT.add(xa);const xb=textSprite('✖',200,'#e8322f',0.0036);xb.position.set(1.9,2.0,0.3);sT.add(xb);
  const camT=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  // ring
  const sR=new THREE.Scene();addLights(sR,{hemi:1.6,dir:1.1});
  const f2=new THREE.Mesh(new THREE.PlaneGeometry(60,60),lamb(0xcfd6e0));f2.rotation.x=-Math.PI/2;sR.add(f2);
  box(sR,7,1.0,7,0x2f5ea8,0,0.5,-1);box(sR,7.1,0.12,7.1,0xf4f4f6,0,1.06,-1);
  const PC=[[-3.3,-4.3,0xe8322f],[3.3,-4.3,0x2f5ea8],[-3.3,2.3,0x2f5ea8],[3.3,2.3,0xe8322f]];
  for(const [x,z,c] of PC)box(sR,0.18,1.6,0.18,c,x,1.9,z);
  for(const y of[1.6,2.05,2.5]){box(sR,6.6,0.04,0.04,0xffffff,0,y,-4.3);box(sR,0.04,0.04,6.6,0xffffff,-3.3,y,-1);box(sR,0.04,0.04,6.6,0xffffff,3.3,y,-1)}
  const RB=makePerson(r,{shirt:0xe8502f,pants:0x2a2a30});RB.position.set(-0.75,1.1,-1);RB.rotation.y=Math.PI/2;helmet(RB,0xe8322f);sR.add(RB);
  const BB=makePerson(r,{shirt:0x6c8ebf,pants:0x2a2a30});BB.position.set(0.75,1.1,-1);BB.rotation.y=-Math.PI/2;helmet(BB,0x2f6fd8);sR.add(BB);
  const ref=makePerson(r,{shirt:0xffffff,pants:0x222222});ref.position.set(0,1.1,-2.3);sR.add(ref);
  const ding=textSprite('DING!',120,'#ffd84d',0.0048);ding.position.set(0,3.6,-1);sR.add(ding);
  const fun=makeBubble('That was fun lol',{...BUBP,fs:58,size:0.0042});fun.position.set(-0.9,3.45,-1);sR.add(fun);
  const fr=makeBubble('fr',{...BUBW,fs:58,size:0.0042});fr.position.set(1.1,3.45,-1);sR.add(fr);
  const camR=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  let ban=null,ch=null,lab='';
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#cfd6df,#d9dfe6)';
      if(!ban){ui.insertAdjacentHTML('beforeend','<div class="banner" style="position:absolute;left:50%;top:330px;transform:translateX(-50%);white-space:nowrap;background:#fff;color:#e8322f;font-weight:900;font-size:46px;padding:12px 30px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,.12)">NO ARGUING · SETTLE IT IN THE RING</div>');ban=ui.querySelector('.banner')}
      ban.style.opacity=clamp01(t/0.15);
      scaleBubble(ba,pop((t-0.1)/0.22));scaleBubble(bb,pop((t-0.3)/0.22));
      const xk=pop((t-0.95)/0.2);scaleSprite(xa,xk);scaleSprite(xb,xk);
      A.userData.arms[1].rotation.x=-0.8-Math.abs(Math.sin(t*8))*0.5;B.userData.arms[0].rotation.x=-0.8-Math.abs(Math.cos(t*8))*0.5;
      camT.position.set(0,2.8,9.6);camT.lookAt(0,1.6,0);
      caption(5,t);renderer.render(sT,camT);
    }else{
      if(ban){ban.remove();ban=null}
      if(!ch)ch=chip('Round 1');
      bgEl.style.background='linear-gradient(#cfd6df,#d9dfe6)';
      const u=t-cut;const want=t<shake?'Round 1':(t<fin?'3 sec later':'Grudges: 0%');
      if(want!==lab){lab=want;ch.textContent=want;ch.dataset.t0=t}chipPop(ch,t,+ch.dataset.t0);
      const R=RB.userData,Bu=BB.userData;
      if(t<shake){
        const p1=Math.max(0,Math.sin(u*9)),p2=Math.max(0,Math.sin(u*9+Math.PI));
        R.arms[0].rotation.x=-1.4-p1*0.3;R.arms[1].rotation.x=-1.2-p2*0.5;Bu.arms[0].rotation.x=-1.2-p1*0.5;Bu.arms[1].rotation.x=-1.4-p2*0.3;
        RB.position.x=-0.75+p1*0.12;BB.position.x=0.75-p2*0.12;
        const dk=pop((t-vt(5,3.0))/0.2)*(t<shake?1:0);scaleSprite(ding,t>vt(5,3.0)?dk:0);
        scaleBubble(fun,0);scaleBubble(fr,0);
      }else{
        scaleSprite(ding,0);
        RB.rotation.y=0.3;BB.rotation.y=-0.3;RB.position.x=-0.55;BB.position.x=0.55;
        R.arms[1].rotation.set(0,0,2.2);Bu.arms[0].rotation.set(0,0,-2.2);R.arms[0].rotation.set(0,0,-0.4);Bu.arms[1].rotation.set(0,0,0.4);
        scaleBubble(fun,pop((t-shake-0.2)/0.25));scaleBubble(fr,pop((t-shake-0.55)/0.25));
      }
      camR.position.set(0,3.6,7.8-u*0.2);camR.lookAt(0,2.2,-1);
      caption(5,t);renderer.render(sR,camR);
    }
  };
};

// ---------- S6: split screen — instant flirty replies ----------
S[6]=()=>{
  bgEl.style.background='#000';
  const r=rng(466);
  function room(wall,floor,shirt){
    const s=new THREE.Scene();s.background=new THREE.Color(wall);addLights(s,{hemi:1.5,dir:1.0});
    const f=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(floor));f.rotation.x=-Math.PI/2;s.add(f);
    box(s,30,10,0.3,wall,0,5,-2.4);const w=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.1),basic(0x1f2a4f));w.position.set(2.1,2.9,-2.23);s.add(w);
    box(s,2.8,0.5,1.8,0x8e6a4a,0,0.25,-0.8);box(s,2.7,0.3,1.7,0xf9d7de,0,0.62,-0.8);
    const p=makePerson(r,{shirt,pants:0x1d1d24});p.position.set(0,0.5,-0.9);sitPose(p);s.add(p);
    const ph=box(null,0.09,0.17,0.02,0x1b1b22,0,-0.66,0.1);p.userData.arms[1].add(ph);
    const gl=glowSprite('rgba(220,240,255,1)',0.9);gl.position.set(0.32,1.85,-0.6);s.add(gl);
    return {s,p};
  }
  const T=room(0xb9adc4,0xd2a878,0xe8502f);
  const book=box(T.s,0.6,0.1,0.42,0xf28aa8,-1.9,0.06,0.2);
  const bl=labelSprite('Mind Games 101',{bg:'#ffffff',fg:'#c0406a',fs:40,r:8,size:0.0026});bl.position.set(-1.9,0.55,0.2);T.s.add(bl);
  const tb=makeBubble('thinking of u lol',{...BUBP,fs:58,size:0.0044});tb.position.y=1.95;T.p.add(tb);
  const B=room(0xaab4c2,0xc9b090,0x7fc4cf);
  const bb=makeBubble('wyd?',{...BUBW,fs:58,size:0.0044});bb.position.y=1.95;B.p.add(bb);
  const hearts=[];for(const S_ of[T.s,B.s])for(let i=0;i<5;i++){const h=textSprite('♥',80,'#ff7aa2',0.0028);h.userData.ph=i*0.25;h.userData.sc=S_;S_.add(h);hearts.push(h)}
  const camT=new THREE.PerspectiveCamera(44,W/(H/2),0.1,100),camB=new THREE.PerspectiveCamera(44,W/(H/2),0.1,100);
  ui.insertAdjacentHTML('beforeend','<div style="position:absolute;left:0;right:0;top:958px;height:6px;background:#fff"></div>');
  const ch=chip('Reply time: 0.5 sec',915);ch.style.fontSize='48px';
  const sw=vt(6,0.9);
  return t=>{
    chipPop(ch,t,0.6);
    scaleBubble(tb,pop((t-0.15)/0.25));
    if(t>sw&&!bb.userData.sw){bb.userData.sw=1;setBubble(bb,'lol same',{...BUBP,fs:58,size:0.0044})}
    scaleBubble(bb,t<sw?pop((t-0.1)/0.22):pop((t-sw)/0.22));
    book.position.set(-1.9+Math.max(0,0.6-t)*1.5,0.06+Math.max(0,0.6-t)*1.2,0.2);book.rotation.z=Math.max(0,0.6-t)*6;bl.visible=t>0.6;
    hearts.forEach((h,i)=>{const k=i%5;const u=((t*0.8+h.userData.ph)%1.25);const on=t>(h.userData.sc===T.s?0.5:sw+0.2);h.visible=on;h.position.set(-0.4+k*0.2,2.8+u*1.2,-0.9);h.material.opacity=1-u/1.25});
    [T.p,B.p].forEach((p,i)=>{p.userData.arms[1].rotation.x=-2.0;p.userData.arms[1].rotation.z=0.2;p.userData.hip.position.y=0.56+Math.abs(Math.sin(t*6+i))*0.04});
    camT.position.set(0,2.3,4.6);camT.lookAt(0,1.65,-0.8);camB.position.set(0,2.2,4.8);camB.lookAt(0,3.15,-0.8);
    renderer.setScissorTest(true);
    renderer.setViewport(0,H/2,W,H/2);renderer.setScissor(0,H/2,W,H/2);renderer.render(T.s,camT);
    renderer.setViewport(0,0,W,H/2);renderer.setScissor(0,0,W,H/2);renderer.render(B.s,camB);
    renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);
    caption(6,t);
  };
};

// ---------- S7: rainy gloomy day → "Come out!" → rainbow ----------
S[7]=()=>{
  const sun=vt(7,3.95);
  const scene=new THREE.Scene();const hemi=new THREE.HemisphereLight(0xffffff,0x8a8070,1.2);scene.add(hemi);const dl=new THREE.DirectionalLight(0xffffff,0.8);dl.position.set(5,10,8);scene.add(dl);
  const r=rng(477);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(100,100),lamb(0x6b6e78));gr.rotation.x=-Math.PI/2;scene.add(gr);
  const main=box(scene,6,5.5,3,0xc9c3ba,0,2.75,-5);
  for(let i=0;i<4;i++){const b=makeBuilding(r,3.4,7+r()*3,3,{wall:'#bdb6ad',win:'#4f6684',lit:0.1});b.position.set(i<2?-5.2-i*3.6:5.2+(i-2)*3.6,b.position.y,-6);scene.add(b)}
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.3),basic(0x9fb6d6));win.position.set(0,3.3,-3.48);scene.add(win);
  box(scene,2.0,0.12,0.3,0xe8e8e8,0,2.6,-3.4);
  const inside=makePerson(r,{shirt:0x9cc9f0});inside.position.set(0,1.75,-3.8);inside.scale.setScalar(0.7);scene.add(inside);
  const idots=makeBubble('...',{...BUBW,fs:60,size:0.0042});idots.position.set(0,4.15,-3.4);scene.add(idots);
  box(scene,1.1,2.0,0.1,0x6b4a34,-1.9,1.0,-3.45);
  const F=[[-2.1,0.6,0xe8502f,0.3],[-0.8,0.9,0xe0c040,0.1],[2.0,0.6,0x7cbf62,-0.3]].map(([x,z,c,ry])=>{const p=makePerson(r,{shirt:c});p.position.set(x,0,z);p.rotation.y=Math.PI+ry;scene.add(p);return p});
  const out=makePerson(r,{shirt:0x9cc9f0});out.position.set(0.5,0,0.2);out.rotation.y=Math.PI;scene.add(out);out.visible=false;
  const b1=makeBubble('Hey, come out!',{...BUBP,fs:58,size:0.0055});b1.position.set(-1.35,2.25,0.6);scene.add(b1);
  const b2=makeBubble("Let's go!",{...BUBP,fs:58,size:0.0055});b2.position.set(1.8,2.25,0.6);scene.add(b2);
  const b3=makeBubble('Come out',{...BUBP,fs:58,size:0.0055});b3.position.set(1.7,4.6,-3.3);scene.add(b3);
  const lol=makeBubble('lol',{...BUBP,fs:58,size:0.0055});lol.position.set(0.5,2.2,0.2);scene.add(lol);
  // rain
  const N=500,pos=new Float32Array(N*6),seed=[];for(let i=0;i<N;i++){seed.push([(r()-0.5)*16,r()*10,-4+r()*9])}
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(pos,3));const rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xe8eef8,transparent:true,opacity:0.7}));scene.add(rain);
  // rainbow
  const rb=new THREE.Group();['#ff6b6b','#ffa94d','#ffe066','#8ce99a','#74c0fc','#b197fc'].forEach((c,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(4.2-i*0.22,0.11,6,40,Math.PI),new THREE.MeshBasicMaterial({color:c,transparent:true}));rb.add(m)});rb.position.set(0,5.3,-7);scene.add(rb);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  const ch=chip('Rain · Mood: gloomy');let s2=false;
  return t=>{
    const k=clamp01((t-sun)/0.6);
    bgEl.style.background=k<0.5?'linear-gradient(#9aa0ab,#b8bdc6)':'linear-gradient(#7cc0f2,#cfe8fb)';
    hemi.intensity=1.2+k*0.5;dl.intensity=0.8+k*0.8;
    if(t>=sun&&!s2){s2=true;ch.textContent='Sunny · Mood: best';}chipPop(ch,t,t>=sun?sun:0);
    const a=rain.geometry.attributes.position.array;for(let i=0;i<N;i++){const s=seed[i];const y=((s[1]-t*12)%10+10)%10;a[i*6]=s[0];a[i*6+1]=y;a[i*6+2]=s[2];a[i*6+3]=s[0]-0.05;a[i*6+4]=y+0.45;a[i*6+5]=s[2]}rain.geometry.attributes.position.needsUpdate=true;
    rain.material.opacity=0.7*(1-k);rain.visible=k<1;
    rb.children.forEach(m=>m.material.opacity=k);rb.visible=k>0;rb.scale.setScalar(0.6+0.4*ease(k));
    win.material.color.set(k>0.5?0xc8e4fa:0x9fb6d6);
    F.forEach((p,i)=>{const u=p.userData;const wave=Math.sin(t*8+i);u.arms[1].rotation.x=0;u.arms[1].rotation.z=2.5+wave*0.3;if(t>=sun){u.arms[0].rotation.z=-2.5-wave*0.3}});
    scaleBubble(b1,t<sun?pop((t-0.2)/0.25):0);scaleBubble(b2,t<sun?pop((t-0.5)/0.25):0);scaleBubble(b3,t<sun?pop((t-vt(7,2.9))/0.25):0);
    scaleBubble(idots,t<sun?pop((t-0.4)/0.25):0);
    inside.visible=t<sun;out.visible=t>=sun;
    if(t>=sun){const u=out.userData;u.arms.forEach((a,i)=>{a.rotation.x=0;a.rotation.z=(i?2.6:-2.6)});u.hip.position.y=0.8+Math.abs(Math.sin(t*6))*0.12}
    scaleBubble(lol,t>=sun?pop((t-sun-0.2)/0.25):0);
    cam.position.set(0,3.2,12.0-t*0.2);cam.lookAt(0,2.7,-3);
    caption(7,t);renderer.render(scene,cam);
  };
};

// ---------- S8: question ending ----------
S[8]=()=>{
  bgEl.style.background='linear-gradient(#121735,#28306a 60%,#3e3f7a)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x2a3068,14,40);addLights(scene,{sky:0x9aa8ff,ground:0x202040,hemi:1.1,dir:0.6,sun:0xd0d8ff});
  const r=rng(808);
  stars(scene,200,r,{y0:6,h:22,z:-22,w:50});
  const moon=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),basic(0xfff0c0));moon.position.set(-3.4,9.5,-20);scene.add(moon);
  const mg=glowSprite('rgba(255,240,190,1)',6);mg.position.copy(moon.position);scene.add(mg);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0x3a3f5e));gr.rotation.x=-Math.PI/2;scene.add(gr);
  for(let i=0;i<5;i++){const b=makeBuilding(r,3.2,4+r()*3,3,{wall:'#4a4f86',win:'#2c3160',lit:0.55});b.position.set(-7+i*3.5,b.position.y,-7-(i%2)*1.5);scene.add(b)}
  const P=[[-1.4,0xd84a3a],[0,0xc9b040],[1.4,0x5b8ac9]].map(([x,c],i)=>{const p=makePerson(r,{shirt:c});p.position.set(x,0,i===1?0.3:0);p.rotation.y=-x*0.12;scene.add(p);return p});
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out" style="font-size:104px;top:400px;letter-spacing:-2px">What are the<br><span style="color:${RED}">ESTPs</span> in<br>your life like?</div><div class="end2 out" style="top:830px;font-size:48px;left:60px;right:60px;line-height:1.3">Tag the ESTP friend you're hanging out with today!</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2');
  return t=>{
    P.forEach((p,i)=>{const u=p.userData;const w=Math.sin(t*6+i*1.3);u.arms[0].rotation.z=-2.5-w*0.25;u.arms[1].rotation.z=2.5+w*0.25;u.hip.position.y=0.8+Math.abs(Math.sin(t*5+i))*0.08});
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    const t2=vt(8,2.6);e2.style.transform=`scale(${pop((t-t2)/0.3)})`;e2.style.opacity=clamp01((t-t2)/0.1);
    cam.position.set(0,1.8,9.0-t*0.15);cam.lookAt(0,3.1,0);
    renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
