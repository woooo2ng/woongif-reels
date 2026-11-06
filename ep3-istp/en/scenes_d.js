
// ---------- S8: line out the door for solo seating → friends sit apart ----------
S[8]=()=>{
  const cut=vt(8,2.95);
  const r=rng(388);
  // exterior
  const sE=new THREE.Scene();sE.fog=new THREE.Fog(0xe9f2fa,20,60);addLights(sE,{hemi:1.6,dir:1.3});
  const tiles=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#ece6da';x.fillRect(0,0,w,h);x.strokeStyle='#d8d0c0';x.lineWidth=4;x.strokeRect(0,0,w,h)});tiles.wrapS=tiles.wrapT=THREE.RepeatWrapping;tiles.repeat.set(20,20);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshLambertMaterial({map:tiles}));gr.rotation.x=-Math.PI/2;sE.add(gr);
  const shop=box(sE,5,4.5,3,0xf3dcb4,1.0,2.25,-8);
  const door=box(sE,1.2,2.2,0.1,0x6b4a34,1.0,1.1,-6.45);
  const signT=canvasTex(1024,180,(x,w,h)=>{x.fillStyle='#ffd9a0';x.fillRect(0,0,w,h);x.fillStyle='#b25a10';x.font=`900 92px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('SOLO DINING · 1 SEAT',w/2,h/2+4)});
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(4.6,0.8),new THREE.MeshBasicMaterial({map:signT}));sign.position.set(1.0,3.7,-6.44);sE.add(sign);
  const sgl=glowSprite('rgba(255,220,150,1)',5);sgl.position.set(1,3.6,-6.2);sE.add(sgl);
  box(sE,3.2,3.6,3,0xd8d2c8,-4.2,1.8,-7.5);
  const s2=canvasTex(512,120,(x,w,h)=>{x.fillStyle='#55575f';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font=`900 54px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('Groups welcome',w/2,h/2+3)});
  const sg2=new THREE.Mesh(new THREE.PlaneGeometry(2.8,0.65),new THREE.MeshBasicMaterial({map:s2}));sg2.position.set(-4.2,2.9,-5.99);sE.add(sg2);
  const dw=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.2),basic(0x3d4c64));dw.position.set(-4.2,1.5,-5.99);sE.add(dw);
  const q=[];for(let i=0;i<12;i++){const p=makePerson(r);p.position.set(1.0+Math.sin(i*1.3)*0.12,0,-5.8+i*0.95);p.rotation.y=Math.PI;sE.add(p);q.push(p)}
  const dots=makeBubble('...',{...BUBW,fs:60,size:0.005});dots.position.y=2.0;q[6].add(dots);
  const camE=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  // interior
  const sI=new THREE.Scene();addLights(sI,{hemi:1.6,dir:1.1});
  woodFloor(sI,'#f1dfc0','#e3cca6');
  box(sI,30,12,0.3,0xe3d6c6,0,6,-5);
  box(sI,1.1,2.2,0.1,0x7a5a40,0,1.1,-4.8);
  const fullT=canvasTex(640,140,(x,w,h)=>{x.fillStyle='#ffb35c';x.fillRect(0,0,w,h);x.fillStyle='#6b3300';x.font=`900 60px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('SOLO SEATS · FULL',w/2,h/2+3)});
  const fs=new THREE.Mesh(new THREE.PlaneGeometry(3.0,0.66),new THREE.MeshBasicMaterial({map:fullT}));fs.position.set(0,2.95,-4.83);sI.add(fs);
  const diners=[];
  for(const side of[-1,1])for(let row=0;row<3;row++)for(let k=0;k<2;k++){
    const x=side*(1.6+k*1.3),z=-3.2+row*1.6;
    box(sI,1.0,0.08,0.55,0xf8f4ee,x,1.0,z+0.45);box(sI,0.08,1.1,0.9,0xd9b98e,x+0.6,0.95,z+0.2);
    const bowl=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.1,0.12,10),lamb(0x2b2b30));bowl.position.set(x,1.1,z+0.5);sI.add(bowl);
    const p=makePerson(r);p.position.set(x,0.1,z-0.1);sitPose(p);p.userData.head.rotation.x=0.35;sI.add(p);diners.push(p)}
  const F1=makePerson(r,{shirt:0xf0a440}),F2=makePerson(r,{shirt:0x7fb7c9});F1.position.set(-0.35,0,-2.4);F2.position.set(0.35,0,-2.4);sI.add(F1);sI.add(F2);
  const by1=makeBubble('bye',{bg:'#ffe7c7',fg:'#5a3a10',fs:66,size:0.005});by1.position.y=2.0;F1.add(by1);
  const by2=makeBubble('bye',{bg:'#ffffff',fg:'#2b2b3a',fs:66,size:0.005});by2.position.y=2.0;F2.add(by2);
  const camI=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  let ch=chip('Wait: 87 groups'),ch2=null,last=-1;
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#a9d4f5,#dcefff 60%,#f4f8fc)';
      const n=87+Math.floor(clamp01(t/cut)*15);if(n!==last){last=n;ch.textContent=`Wait: ${n} groups`}chipPop(ch,t,0);
      q.forEach((p,i)=>{p.userData.head.rotation.z=Math.sin(t*2+i)*0.05});
      scaleBubble(dots,pop((t-0.6)/0.25));sgl.material.opacity=0.75+Math.sin(t*4)*0.15;
      camE.position.set(1.2,2.3,7.5-t*1.2);camE.lookAt(0.6,2.0,-6);
      caption(8,t);renderer.render(sE,camE);
    }else{
      if(!ch2){ch.remove();ch2=chip('Came together, sat apart')}
      bgEl.style.background='linear-gradient(#e6dbcc,#efe4d6)';
      const u=t-cut;chipPop(ch2,u,0);
      scaleBubble(by1,pop((u-0.2)/0.22));scaleBubble(by2,pop((u-0.35)/0.22));
      const w=clamp01((u-0.9)/1.2);
      F1.position.set(-0.35-w*0.5,0,-2.4+w*1.6);F2.position.set(0.35+w*0.5,0,-2.4+w*1.6);
      F1.rotation.y=w>0?-0.5:0;F2.rotation.y=w>0?0.5:0;
      if(w>0&&w<1){walkPose(F1,u*9,0.5);walkPose(F2,u*9+1,0.5)}else{standPose(F1);standPose(F2);F1.userData.arms[0].rotation.z=-2.3;F2.userData.arms[1].rotation.z=2.3}
      if(u<0.9){F1.userData.arms[0].rotation.z=-2.4+Math.sin(u*14)*0.3;F2.userData.arms[1].rotation.z=2.4+Math.sin(u*14)*0.3}else{F1.userData.arms[0].rotation.z=0;F2.userData.arms[1].rotation.z=0}
      diners.forEach((p,i)=>p.userData.arms[1].rotation.x=-1.2-Math.max(0,Math.sin(u*5+i))*0.4);
      camI.position.set(0,4.3,5.4);camI.lookAt(0,1.4,-2);
      caption(8,t);renderer.render(sI,camI);
    }
  };
};

// ---------- S9: "I'm sick" → "k" ... 30 min later, soup at the door ----------
S[9]=()=>{
  const cut=vt(9,3.6);
  const r=rng(399);
  const sB=new THREE.Scene();addLights(sB,{hemi:1.55,dir:1.1});
  woodFloor(sB,'#d9a873','#c79562');
  box(sB,30,12,0.3,0xc2b4c8,0,6,-2.6);
  const wf=box(sB,1.8,1.6,0.08,0xffffff,2.0,3.3,-2.42);const wp=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.4),basic(0x1f2a4f));wp.position.set(2.0,3.3,-2.36);sB.add(wp);
  box(sB,3.0,0.6,2.2,0x8e6a4a,0,0.3,-0.6);box(sB,2.9,0.3,2.1,0xfafafa,0,0.75,-0.6);box(sB,3.0,0.28,1.4,0xf3a3b3,0,1.0,-0.2);
  const S1=makePerson(r,{shirt:0x9cc9f0,pants:0x1d1d24});S1.position.set(0,0.62,-0.9);sitPose(S1);sB.add(S1);
  const towel=box(null,0.42,0.1,0.12,0xffffff,0,0.36,0.2);S1.userData.head.add(towel);
  const ph=box(null,0.09,0.17,0.02,0x1b1b22,0,-0.66,0.1);S1.userData.arms[1].add(ph);
  const sick=makeBubble("I'm sick…",{...BUBW,fs:66,size:0.0055});sick.position.y=1.95;S1.add(sick);
  const kk=makeBubble('k',{bg:'#ffe7c7',fg:'#5a3a10',fs:90,size:0.0045});kk.position.set(1.3,3.15,-0.6);sB.add(kk);
  const fig=makeBubble('…figures',{...BUBW,fs:66,size:0.0055});fig.position.set(-0.35,1.95,0);S1.add(fig);
  const camB=new THREE.PerspectiveCamera(48,W/H,0.1,100);
  // hallway
  const sH=new THREE.Scene();sH.fog=new THREE.Fog(0xf3e6d6,10,28);addLights(sH,{hemi:1.5,dir:0.9,dpos:[2,10,4]});
  const hf=new THREE.Mesh(new THREE.PlaneGeometry(4,40),lamb(0xe6d3bc));hf.rotation.x=-Math.PI/2;hf.position.z=-10;sH.add(hf);
  box(sH,0.2,4,40,0xd8c2a6,-2,2,-10);box(sH,0.2,4,40,0xcdb698,2,2,-10);box(sH,4.2,0.2,40,0x8a7a64,0,4,-10);
  for(let i=0;i<8;i++){box(sH,0.08,2.3,1.0,0x7a5a40,-1.92,1.15,-1-i*3.2);box(sH,0.08,2.3,1.0,0x7a5a40,1.92,1.15,-2.5-i*3.2);
    const lt=new THREE.Mesh(new THREE.PlaneGeometry(1.2,0.25),basic(0xfff6e0));lt.rotation.x=Math.PI/2;lt.position.set(0,3.88,-1-i*3);sH.add(lt);const lg=glowSprite('rgba(255,240,200,1)',1.6);lg.position.set(0,3.6,-1-i*3);sH.add(lg)}
  const S2=makePerson(r,{shirt:0xf2a9b8,pants:0x9cc9f0});S2.position.set(-0.95,0,-0.4);S2.rotation.y=-0.5;sH.add(S2);
  const tw2=box(null,0.42,0.1,0.12,0xffffff,0,0.36,0.2);S2.userData.head.add(tw2);
  const bag=box(sH,0.45,0.5,0.3,0xfafafa,-0.45,0.25,0.35);
  const soup=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.18,12),lamb(0xf2c45a));soup.position.set(-0.45,0.58,0.35);sH.add(soup);
  const meds=labelSprite('MEDS',{bg:'#ff5a5a',fg:'#fff',fs:54,r:16,size:0.0026});meds.center.set(0.5,0);meds.position.set(-0.05,0.5,0.45);sH.add(meds);
  const heart=makeBubble('♥',{bg:'#ff8fb1',fg:'#ffffff',fs:110,size:0.0042});heart.position.y=2.0;S2.add(heart);
  const I=makePerson(r,{shirt:0xf0a440,pants:0x33384a});I.rotation.y=Math.PI;sH.add(I);
  const camH=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  let ch=chip('10:00 PM'),ch2=null;
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#c2b4c8,#cbbfd0)';chipPop(ch,t,0);
      S1.userData.arms[1].rotation.x=-2.1;S1.userData.arms[1].rotation.z=0.25;S1.userData.arms[0].rotation.x=-0.5;
      const kT=vt(9,1.45),fT=vt(9,2.4);
      scaleBubble(sick,t<kT?pop((t-0.1)/0.25):(t<fT?0.55:0));
      scaleBubble(kk,pop((t-kT)/0.22));
      scaleBubble(fig,t>fT?pop((t-fT)/0.25):0);
      S1.userData.head.rotation.x=t>fT?0.25:0;
      camB.position.set(0,3.0,6.8-t*0.15);camB.lookAt(0,1.75,-0.6);
      caption(9,t);renderer.render(sB,camB);
    }else{
      if(!ch2){ch.remove();ch2=chip('30 min later')}
      bgEl.style.background='#f3e6d6';
      const u=t-cut;chipPop(ch2,u,0);
      I.position.set(0.5,0,-3.5-u*1.2);walkPose(I,u*7,0.5);
      const bend=ease((u-0.3)/0.6);S2.userData.arms[1].rotation.x=-1.1*bend;S2.userData.head.rotation.x=0.4*bend;
      scaleBubble(heart,pop((u-1.2)/0.3));
      const mk=pop((u-0.5)/0.25);meds.scale.set(meds.userData.base[0]*mk,meds.userData.base[1]*mk,1);meds.visible=mk>0.01;
      camH.position.set(0.7,2.4,5.4-u*0.2);camH.lookAt(-0.4,1.5,-3);
      caption(9,t);renderer.render(sH,camH);
    }
  };
};

// ---------- S10: question ending ----------
S[10]=()=>{
  bgEl.style.background='linear-gradient(#121735,#28306a 60%,#3e3f7a)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x2a3068,14,40);addLights(scene,{sky:0x9aa8ff,ground:0x202040,hemi:1.1,dir:0.6,sun:0xd0d8ff});
  const r=rng(1010);
  stars(scene,200,r,{y0:6,h:22,z:-22,w:50});
  const moon=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),basic(0xfff0c0));moon.position.set(3.4,9.5,-20);scene.add(moon);
  const mg=glowSprite('rgba(255,240,190,1)',6);mg.position.copy(moon.position);scene.add(mg);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(80,80),lamb(0x3a3f5e));gr.rotation.x=-Math.PI/2;scene.add(gr);
  for(let i=0;i<5;i++){const b=makeBuilding(r,3.2,4+r()*3,3,{wall:'#4a4f86',win:'#2c3160',lit:0.55});b.position.set(-7+i*3.5,b.position.y,-7-(i%2)*1.5);scene.add(b)}
  const A=makePerson(r,{shirt:0x7a6ad0});A.position.set(-1.4,0,0);A.rotation.y=0.2;scene.add(A);
  const bagA=box(null,0.3,0.36,0.18,0xc8ccf0,0,-0.75,0.05);A.userData.arms[0].add(bagA);
  const B=makePerson(r,{shirt:0xc79a64});B.position.set(0,0,0.3);scene.add(B);
  const bagB=box(null,0.5,0.4,0.25,0xb08850,0,0.15,0.3);B.userData.hip.add(bagB);
  const C=makePerson(r,{shirt:0x5b8ac9});C.position.set(1.4,0,0);C.rotation.y=-0.2;scene.add(C);
  const bagC=box(null,0.3,0.36,0.18,0xc8ccf0,0,-0.75,0.05);C.userData.arms[1].add(bagC);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  ui.innerHTML=`<div class="end1 out" style="font-size:104px;top:400px;letter-spacing:-2px">What are the<br><span style="color:${ORANGE}">ISTPs</span> in<br>your life like?</div><div class="end2 out" style="top:830px;font-size:50px">Tag your ISTP friend in the comments!</div>`;
  const e1=ui.querySelector('.end1'),e2=ui.querySelector('.end2');
  return t=>{
    B.userData.arms[1].rotation.x=-1.0;B.userData.arms[0].rotation.x=-1.0;
    A.userData.head.rotation.y=Math.sin(t*1.5)*0.2;C.userData.head.rotation.y=-Math.sin(t*1.5)*0.2;
    A.userData.arms[1].rotation.z=2.4+Math.sin(t*7)*0.3;
    e1.style.transform=`scale(${pop((t-0.1)/0.35)})`;e1.style.opacity=clamp01((t-0.1)/0.1);
    const t2=vt(10,2.55);e2.style.transform=`scale(${pop((t-t2)/0.3)})`;e2.style.opacity=clamp01((t-t2)/0.1);
    cam.position.set(0,1.8,9.0-t*0.15);cam.lookAt(0,3.1,0);
    renderer.render(scene,cam);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
