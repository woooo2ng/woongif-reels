
const BUBP={bg:'#ffd9d0',fg:'#6b1d0e'};
function grass(scene,c=0xc5d9a2){const g=new THREE.Mesh(new THREE.PlaneGeometry(200,200),lamb(c));g.rotation.x=-Math.PI/2;scene.add(g);return g}
function tree(scene,x,z,s=1){const t=new THREE.Group();const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.1*s,0.14*s,1.4*s,6),lamb(0x7a5a3c));tr.position.y=0.7*s;t.add(tr);const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(0.8*s,0),lamb(0x6fae6a));cr.position.y=1.9*s;t.add(cr);t.position.set(x,0,z);scene.add(t);return t}
// apartment row with "OUT" signs
function buildApts(scene,r){
  grass(scene);
  const outs=[];
  for(let i=0;i<6;i++){const w=3.6,h=8+r()*5;const b=makeBuilding(r,w,h,3,{wall:pick(r,['#d9cbb8','#cfc4b4','#d6c8b2']),win:'#4f6684',lit:0});b.position.set(-10+i*4.1,b.position.y,-6-(i%2)*1.2);scene.add(b);
    for(let k=0;k<5;k++){const s=labelSprite('OUT',{bg:'rgba(255,255,255,0.92)',fg:'#555',fs:44,r:12,size:0.0058});s.position.set(b.position.x+(r()-0.5)*2.4,1.5+r()*(h-3),b.position.z+1.6);scene.add(s);outs.push({s,d:r()*1.2})}}
  for(let i=0;i<7;i++)tree(scene,-9+i*3,-2.6,1.1);
  return outs;
}
function scaleSprite(s,k){const b=s.userData.base;s.scale.set(b[0]*k,b[1]*k,1);s.visible=k>0.01}

// ---------- S0: apartments — everyone's OUT (title) ----------
S[0]=()=>{
  bgEl.style.background='linear-gradient(#8cc8f5,#cfe8fb 60%,#e8f4fb)';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdfeefa,30,80);addLights(scene);
  const r=rng(404);const outs=buildApts(scene,r);
  const cam=new THREE.PerspectiveCamera(52,W/H,0.1,200);
  ui.innerHTML=`<div class="tag">#004</div><div class="title1 out" style="font-size:104px;letter-spacing:-2px;top:345px">What if everyone</div><div class="title2 out" style="color:${RED};font-size:178px;top:478px;letter-spacing:-4px">was ESTP?</div>`;
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2');
  return t=>{
    outs.forEach(o=>scaleSprite(o.s,pop((t-0.4-o.d)/0.25)));
    cam.position.set(0,3.2,9-t*0.4);cam.lookAt(0,5.2,-6);
    tag.style.transform=`translateX(-50%) scale(${pop(t/0.25)})`;
    t1.style.transform=`scale(${pop((t-0.05)/0.3)})`;t1.style.opacity=clamp01((t-0.05)/0.08);
    t2.style.transform=`scale(${pop((t-0.25)/0.35)})`;t2.style.opacity=clamp01((t-0.25)/0.08);
    caption(0,t);renderer.render(scene,cam);
  };
};

// ---------- S1: nobody home → everyone at the river park ----------
S[1]=()=>{
  const cut=vt(1,2.2);
  const sA=new THREE.Scene();sA.fog=new THREE.Fog(0xdfeefa,30,80);addLights(sA);
  const r=rng(404);const outs=buildApts(sA,r);
  const dots=makeBubble('...',{...BUBW,fs:60,size:0.007});dots.position.set(-1.6,3.3,-3.6);sA.add(dots);
  const camA=new THREE.PerspectiveCamera(52,W/H,0.1,200);
  // park
  const sP=new THREE.Scene();sP.fog=new THREE.Fog(0xdfeefa,25,70);addLights(sP);
  const r2=rng(411);grass(sP,0xbcd99a);
  const river=new THREE.Mesh(new THREE.PlaneGeometry(200,9),lamb(0x7fc4e8));river.rotation.x=-Math.PI/2;river.position.set(0,0.02,-9);sP.add(river);
  const path=new THREE.Mesh(new THREE.PlaneGeometry(200,1.6),lamb(0xe8dcc4));path.rotation.x=-Math.PI/2;path.position.set(0,0.03,-3.8);sP.add(path);
  box(sP,60,0.5,1.4,0xe8e8ec,0,4.2,-10);for(let x=-20;x<=20;x+=5)box(sP,0.5,4,0.6,0xd0d0d8,x,2,-10);
  for(let i=0;i<6;i++){const b=makeBuilding(r2,3,6+r2()*6,3,{lit:0.15});b.position.set(-9+i*3.8,b.position.y,-20);sP.add(b)}
  const MAT=[0xff9ec0,0xf8d24a,0x9cc9ff,0xb5e0a0];const groups=[];
  for(const [x,z,c] of[[-2.3,-0.6,0],[2.0,-1.2,1],[-0.2,1.6,2],[2.6,1.8,3]]){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(2.0,1.6),lamb(MAT[c]));m.rotation.x=-Math.PI/2;m.position.set(x,0.04,z);sP.add(m);
    const g=[];for(let k=0;k<3;k++){const a=k/3*Math.PI*2;const p=makePerson(r2);p.position.set(x+Math.cos(a)*0.55,-0.05,z+Math.sin(a)*0.45);p.rotation.y=-a-Math.PI/2;sitPose(p);sP.add(p);g.push(p)}groups.push(g)}
  const bike=new THREE.Group();const rider=makePerson(r2,{shirt:0x8cc9a0});sitPose(rider);rider.position.y=0.3;bike.add(rider);
  for(const z of[-0.5,0.5]){const w=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.05,6,14),lamb(0x333));w.rotation.y=Math.PI/2;w.position.set(0,0.3,z);bike.add(w)}
  bike.rotation.y=Math.PI/2;bike.position.set(-6,0,-3.8);sP.add(bike);
  const lol=makeBubble('lol',{...BUBW,fs:60,size:0.0055});lol.position.set(-2.3,2.0,-0.6);sP.add(lol);
  const one=makeBubble('One more round!',{...BUBP,fs:60,size:0.0055});one.position.set(1.7,2.0,-1.2);sP.add(one);
  const camP=new THREE.PerspectiveCamera(50,W/H,0.1,200);
  const ch=chip("Sat 10:00 AM · 0 people home");ch.style.fontSize='48px';let ch2=null;
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#8cc8f5,#cfe8fb 60%,#e8f4fb)';chipPop(ch,t,0);
      outs.forEach(o=>scaleSprite(o.s,1));scaleBubble(dots,pop((t-0.5)/0.25));
      camA.position.set(0,3.2,8.0-t*0.3);camA.lookAt(0,4.6,-6);
      caption(1,t);renderer.render(sA,camA);
    }else{
      if(!ch2){ch.remove();ch2=chip('River Park · packed')}
      bgEl.style.background='linear-gradient(#8cc8f5,#cfe8fb 60%,#e8f4fb)';
      const u=t-cut;chipPop(ch2,u,0);
      groups.forEach((g,gi)=>g.forEach((p,k)=>{p.userData.arms[k%2].rotation.x=-1.2-Math.max(0,Math.sin(u*6+gi+k))*0.8;p.userData.head.rotation.z=Math.sin(u*4+k)*0.1}));
      bike.position.x=-6+u*3.5;rider.userData.legs[0].rotation.x=-1.57+Math.sin(u*10)*0.4;rider.userData.legs[1].rotation.x=-1.57-Math.sin(u*10)*0.4;
      scaleBubble(lol,pop((u-0.15)/0.25));scaleBubble(one,pop((u-0.4)/0.25));
      camP.position.set(0,7.0,13.0-u*0.3);camP.lookAt(0,0.9,-2.0);
      caption(1,t);renderer.render(sP,camP);
    }
  };
};

// ---------- S2: plane takes off → cabin "Trip plan: 0%" ----------
S[2]=()=>{
  const cut=vt(2,2.5);
  const sO=new THREE.Scene();addLights(sO);
  grass(sO,0xa6d68e);
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(8,200),lamb(0x55585f));rw.rotation.x=-Math.PI/2;rw.position.y=0.02;sO.add(rw);
  for(let z=60;z>-120;z-=8){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.3,3.5),basic(0xffffff));l.rotation.x=-Math.PI/2;l.position.set(0,0.03,z);sO.add(l)}
  const plane=new THREE.Group();sO.add(plane);
  const fus=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,10,14),lamb(0xffffff));fus.rotation.x=Math.PI/2;plane.add(fus);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(0.9,14,10),lamb(0xffffff));nose.position.z=-5;plane.add(nose);
  const stripe=new THREE.Mesh(new THREE.CylinderGeometry(0.92,0.92,10,14,1,true,Math.PI*0.35,Math.PI*0.3),lamb(0xe8502f));stripe.rotation.x=Math.PI/2;plane.add(stripe);
  const wing=box(null,11,0.15,2,0xf0f0f4,0,-0.2,0.3);plane.add(wing);
  const tail=box(null,0.15,2.2,1.6,0xe8502f,0,1.6,4.4);plane.add(tail);const ht=box(null,4,0.12,1.1,0xf0f0f4,0,0.4,4.6);plane.add(ht);
  for(let i=0;i<10;i++){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.25,0.3),basic(0x2c3a5a));w.position.set(0.91,0.25,-3.6+i*0.8);w.rotation.y=Math.PI/2;plane.add(w)}
  const camO=new THREE.PerspectiveCamera(50,W/H,0.1,300);
  // cabin
  const sC=new THREE.Scene();addLights(sC,{hemi:1.5,dir:1.0});
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(20,60),lamb(0x8e98b8));fl.rotation.x=-Math.PI/2;sC.add(fl);
  box(sC,0.3,6,60,0xe6e6ea,-3.2,3,0);box(sC,0.3,6,60,0xe6e6ea,3.2,3,0);box(sC,7,0.3,60,0x7a7064,0,4.2,0);
  const r=rng(422);const pax=[];
  for(let row=0;row<5;row++)for(const side of[-1,1])for(let k=0;k<2;k++){const x=side*(1.0+k*0.85),z=-row*1.4;
    box(sC,0.8,0.5,0.8,0x2f5ea8,x,0.35,z-0.05);box(sC,0.8,1.3,0.22,0x2f5ea8,x,0.95,z-0.5);
    const p=makePerson(r,{shirt:pick(r,[0xa58cd0,0x6c8ebf,0xd98c8c,0x9a7fd0])});p.position.set(x,0.05,z);sitPose(p);sC.add(p);pax.push(p)}
  for(let row=0;row<5;row++)for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.35,0.5),basic(0x9fd0f5));w.position.set(s*3.04,2.1,-row*1.4);w.rotation.y=-s*Math.PI/2;sC.add(w)}
  const q1=makeBubble('Plans when we land?',{...BUBP,fs:60,size:0.0036});q1.position.set(-0.3,2.55,-0.5);sC.add(q1);
  const a1=makeBubble('lol no idea',{...BUBW,fs:60,size:0.0036});a1.position.set(1.0,2.05,-0.5);sC.add(a1);
  const camC=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  let ch=null;
  return t=>{
    if(t<cut){
      bgEl.style.background='linear-gradient(#7cc0f2,#bfe2fb)';
      const k=ease((t-0.4)/2.0);plane.position.set(0,1.0+k*5,6-t*7);plane.rotation.x=k*0.28;
      camO.position.set(9,2.4,4);camO.lookAt(0,1.8+k*3,plane.position.z-3);
      caption(2,t);renderer.render(sO,camO);
    }else{
      if(!ch)ch=chip('Trip plan: 0%');
      bgEl.style.background='#cfd3dd';const u=t-cut;chipPop(ch,u,0);
      scaleBubble(q1,pop((u-0.2)/0.25));scaleBubble(a1,pop((u-0.75)/0.25));
      pax.forEach((p,i)=>{p.userData.head.rotation.z=Math.sin(u*5+i)*0.1;p.userData.arms[1].rotation.x=-0.8-Math.max(0,Math.sin(u*4+i))*0.6});
      camC.position.set(0,2.8,6.4-u*0.2);camC.lookAt(0,1.5,-3);
      caption(2,t);renderer.render(sC,camC);
    }
  };
};

// ---------- S3: slow-mo coffee-bet rock-paper-scissors finals ----------
S[3]=()=>{
  bgEl.style.background='linear-gradient(#d7dbe2,#e4e7ec)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,dir:1.1});
  const r=rng(433);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),lamb(0xdfe2e8));fl.rotation.x=-Math.PI/2;scene.add(fl);
  box(scene,30,10,0.3,0xd2d6dd,0,5,-4);box(scene,0.3,10,30,0xc8ccd4,-4.5,5,0);
  box(scene,1.6,0.1,1.0,0xf3e3c8,0,1.05,-0.2);box(scene,0.12,1.0,0.12,0xb89a76,0,0.5,-0.2);
  for(const x of[-0.4,0.4]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.08,0.24,10),lamb(0xffffff));c.position.set(x,1.22,-0.2);scene.add(c)}
  const P=[];const SPOT=[[-1.25,0.4,0.9,0xa58cd0],[0,1.25,Math.PI,0xe8502f],[1.25,0.4,-0.9,0x6c8ebf],[0.2,-1.6,0,0x7cbf62]];
  for(const [x,z,ry,c] of SPOT){const p=makePerson(r,{shirt:c});p.position.set(x,0,z);p.rotation.y=ry;scene.add(p);P.push(p)}
  const words=['Rock!','Paper!','Scissors!'];const bub=P.slice(0,3).map((p,i)=>{const b=makeBubble(words[i],{...(i===1?BUBW:BUBP),fs:62,size:0.0036});b.position.y=2.15;p.add(b);return b});
  const aah=textSprite('AAAH!',110,'#ff5c3a',0.0034);aah.position.set(0,2.85,1.25);scene.add(aah);
  const ch=chip('◀◀ SLOW · Coffee bet');
  ui.insertAdjacentHTML('beforeend','<div class="banner" style="position:absolute;right:0;top:330px;background:#ff6a4a;color:#fff;font-weight:900;font-size:50px;padding:14px 34px 14px 40px;border-radius:14px 0 0 14px;box-shadow:0 8px 20px rgba(0,0,0,.15)">COFFEE BET FINALS</div>');
  const ban=ui.querySelector('.banner');
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  const win=vt(3,2.6);
  return t=>{
    chipPop(ch,t,0);ban.style.transform=`translateX(${(1-ease((t-0.1)/0.4))*500}px)`;
    const slow=t*0.35;
    if(t<win){
      P.forEach((p,i)=>{const u=p.userData;u.arms[1].rotation.x=-1.2-Math.abs(Math.sin(slow*6+i*0.3))*0.9;u.arms[0].rotation.x=-0.3;u.head.rotation.x=0.25});
      bub.forEach((b,i)=>scaleBubble(b,pop((t-0.6-i*0.35)/0.3)));scaleSprite(aah,0);
    }else{
      const u=t-win;bub.forEach(b=>scaleBubble(b,0));
      const W1=P[1].userData;W1.arms.forEach((a,i)=>{a.rotation.x=0;a.rotation.z=(i?2.6:-2.6)});W1.hip.position.y=0.8+Math.abs(Math.sin(u*4))*0.15;W1.head.rotation.x=-0.3;
      [0,2].forEach(j=>{const L=P[j].userData;L.arms.forEach((a,i)=>{a.rotation.x=0;a.rotation.z=(i?2.2:-2.2)});L.head.rotation.x=0.4});
      const G=P[3].userData;G.arms.forEach((a,i)=>{a.rotation.x=0;a.rotation.z=(i?2.6:-2.6)});
      const k=pop(u/0.3)*(1+Math.sin(u*12)*0.04);scaleSprite(aah,k);
    }
    const sh=t>win?Math.sin(t*60)*0.04*Math.max(0,1-(t-win)/0.6):0;
    cam.position.set(1.0+sh,3.5,7.6-t*0.35);cam.lookAt(0,1.7+sh,0);
    caption(3,t);renderer.render(scene,cam);
  };
};

// ---------- S4: fitting room — brutal honesty, nobody upset ----------
S[4]=()=>{
  bgEl.style.background='linear-gradient(#d8c2c6,#e0ccd0)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.6,dir:1.1});
  const r=rng(444);
  woodFloor(scene,'#f1d9b0','#e2c597');
  box(scene,30,10,0.3,0xd9c0c6,0,5,-3);
  box(scene,0.15,3.2,0.3,0xa88a6a,-1.0,1.6,-2.4);box(scene,0.15,3.2,0.3,0xa88a6a,1.0,1.6,-2.4);box(scene,2.3,0.2,0.3,0xa88a6a,0,3.2,-2.4);
  const cur=box(scene,0.9,2.8,0.06,0xe24e2e,0.55,1.5,-2.5);
  const sg=labelSprite('FITTING',{bg:'#ffffff',fg:'#e24e2e',fs:44,r:6,size:0.0045});sg.center.set(0.5,0);sg.position.set(0,3.35,-2.3);scene.add(sg);
  for(const x of[-3.2,3.2]){box(scene,1.6,0.06,0.06,0x777,x,2.6,-2.6);for(let i=0;i<5;i++)box(scene,0.08,1.1,0.5,pick(r,[0xa58cd0,0xf2a9b8,0x9cc9f0,0xe0c070]),x-0.6+i*0.3,2.0,-2.6)}
  const M=makePerson(r,{shirt:0x9be060,pants:0xf2a9b8});M.position.set(-0.3,0,-2.2);scene.add(M);
  const hat=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.45,8),lamb(0xf8d24a));hat.position.y=0.62;M.userData.head.add(hat);
  const M2=makePerson(r,{shirt:0x2a3550,pants:0x33384a});M2.position.copy(M.position);scene.add(M2);M2.visible=false;
  const L=makePerson(r,{shirt:0x6c8ebf,pants:0x2a3550});L.position.set(-1.25,0,0.4);L.rotation.y=Math.PI*0.85;scene.add(L);
  const R=makePerson(r,{shirt:0x6fa8b8,pants:0x5a4a3a});R.position.set(0.85,0,1.0);R.rotation.y=Math.PI*1.12;scene.add(R);
  const how=makeBubble("How's this?",{...BUBP,fs:62,size:0.0040});how.position.y=2.15;M.add(how);
  const nah=makeBubble('Nah',{...BUBW,fs:62,size:0.0040});nah.position.y=2.15;L.add(nah);
  const bet=makeBubble("That one's better",{...BUBW,fs:62,size:0.0040});bet.position.set(0.2,3.4,0.6);scene.add(bet);
  const ok=makeBubble('Better?',{...BUBP,fs:62,size:0.0040});ok.position.y=2.15;M2.add(ok);
  const g1=makeBubble('Good!',{bg:'#8fe0a0',fg:'#1d5a2a',fs:62,size:0.0040});g1.position.y=2.15;L.add(g1);
  const g2=makeBubble('Good!',{bg:'#8fe0a0',fg:'#1d5a2a',fs:62,size:0.0040});g2.position.set(0.55,3.15,0.8);scene.add(g2);
  const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  let ch=null;const t2=vt(4,2.1),t3=vt(4,4.65);
  return t=>{
    scaleBubble(how,t<t3?pop((t-0.2)/0.25):0);
    scaleBubble(nah,t>t2&&t<t3?pop((t-t2)/0.22):0);scaleBubble(bet,t>t2&&t<t3?pop((t-t2-0.6)/0.25):0);
    R.userData.arms[1].rotation.x=t>t2&&t<t3?-1.5:0;
    if(t>=t3){M.visible=false;M2.visible=true;cur.position.x=0.55;if(!ch)ch=chip('Upset: 0 people');chipPop(ch,t,t3);
      scaleBubble(ok,pop((t-t3)/0.22));scaleBubble(g1,pop((t-t3-0.35)/0.22));scaleBubble(g2,pop((t-t3-0.5)/0.22));
      R.userData.arms[1].rotation.x=0;R.userData.arms[1].rotation.z=2.5;}
    else{scaleBubble(ok,0);scaleBubble(g1,0);scaleBubble(g2,0)}
    M.userData.arms.forEach((a,i)=>a.rotation.z=(i?0.4:-0.4));
    cam.position.set(0.3,3.0,8.2-t*0.2);cam.lookAt(0,1.8,-1);
    caption(4,t);renderer.render(scene,cam);
  };
};
