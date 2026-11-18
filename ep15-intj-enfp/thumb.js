// ---------- 썸네일(커버): 계획 100% vs 즉흥 100% 투샷 ----------
S[9]=()=>{
  bgEl.style.background='linear-gradient(115deg,#5f73f5 0%,#8fa0ff 46%,#ff9fd0 54%,#ff6fb5 100%)';
  const scene=new THREE.Scene();addLights(scene,{hemi:1.8,dir:1.3,dpos:[2,6,9]});
  const r=rng(1901);
  const J=mkJ();J.position.set(-0.62,0,0);J.rotation.y=0.45;scene.add(J);
  const E=mkE();E.position.set(0.62,0,0.15);E.rotation.y=-0.5;scene.add(E);
  // INTJ: 사과문 / 계획서 들고 진지, ENFP: 만세
  const pl=signPlane('계획서 v12',0.62,0.3,{bg:'#fff',fg:'#26307a',r:20,fs:46,line:'#7a8cff'});holdObj(J,1,pl,-0.72,0.18);pl.rotation.set(1.25,-0.45,0);
  J.userData.arms[1].rotation.x=-1.25;J.userData.arms[1].rotation.z=-0.2;J.userData.arms[0].rotation.x=-0.3;blush(J,true);
  armUp(E,0,1);armUp(E,1,1);E.userData.arms[0].rotation.z=-0.55;E.userData.arms[1].rotation.z=0.55;E.userData.hip.position.y=0.92;
  const hs=[];for(let i=0;i<9;i++){const h=textSprite('♥',90,i%2?'#ffffff':'#ff5aa0',0.0055);h.position.set((r()-0.5)*3.2,0.9+r()*1.3,-0.8-r()*0.6);const k=0.4+r()*0.4;h.scale.set(h.userData.base[0]*k,h.userData.base[1]*k,1);scene.add(h);hs.push(h)}
  const cam=new THREE.PerspectiveCamera(42,W/H,0.1,100);cam.position.set(0,1.5,5.0);cam.lookAt(0,2.05,0);
  ui.innerHTML=`
  <div class="out" style="position:absolute;left:0;right:0;top:290px;text-align:center;font-size:150px;font-weight:900;letter-spacing:-5px;line-height:1"><span style="color:${C_J}">INTJ</span><span style="font-size:100px">♂</span><span style="font-size:120px">×</span><span style="color:${C_E}">ENFP</span><span style="font-size:100px">♀</span></div>
  <div class="out" style="position:absolute;left:0;right:0;top:470px;text-align:center;font-size:150px;letter-spacing:-5px">커플이라면?</div>
  <div style="position:absolute;left:70px;top:690px;background:#26307a;color:#fff;font-weight:900;font-size:60px;padding:10px 30px;border-radius:24px;transform:rotate(-5deg);box-shadow:0 10px 24px rgba(0,0,0,.3)">계획 100%</div>
  <div style="position:absolute;right:70px;top:690px;background:#ff5aa0;color:#fff;font-weight:900;font-size:60px;padding:10px 30px;border-radius:24px;transform:rotate(5deg);box-shadow:0 10px 24px rgba(0,0,0,.3)">즉흥 100%</div>
  <div class="out" style="position:absolute;left:0;right:0;top:1420px;text-align:center;font-size:84px;letter-spacing:-2px;line-height:1.25">고백 석 달 준비했는데<br><span style="color:#ffe14d">3일 만에 먼저 고백당함</span></div>`;
  return t=>{renderer.render(scene,cam)};
};
