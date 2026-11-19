// ---------- 유튜브 썸네일 ----------
window.drawThumb=()=>{ui.innerHTML='';
  sky('linear-gradient(#6a7fb8 0%,#f2a77a 55%,#ffd99a 100%)');
  const scene=new THREE.Scene();lights(scene,'dusk');scene.add(new THREE.AmbientLight(0xffe0c0,0.45));const r=rng(77);
  city(scene,r,{green:0.85});cars(scene,r,[[-2.6,-10,0.4],[2.4,-22,-0.3]],{rust:0.7,overgrow:true});
  const w=woong({patch:true});w.position.set(1.15,0,4.2);w.rotation.y=-0.35;scene.add(w);setFace(w,'open');
  w.userData.arms[1].rotation.set(-2.7,0,0.35);w.userData.head.rotation.set(-0.05,-0.15,0);
  const fl=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,0.3,8),lamb(0x333333));fl.position.y=-0.75;w.userData.arms[1].add(fl);
  const d=dog({collar:true,s:1.2});d.position.set(2.0,0,4.9);d.rotation.y=-0.6;scene.add(d);d.userData.head.rotation.z=0.3;
  const beam=new THREE.Mesh(new THREE.ConeGeometry(1.2,14,16,1,true),new THREE.MeshBasicMaterial({color:0xfff2c4,transparent:true,opacity:0.16,depthWrite:false,side:THREE.DoubleSide}));beam.geometry.translate(0,-7,0);beam.position.y=-0.85;w.userData.arms[1].add(beam);
  const L=glowSprite('rgba(255,240,180,1)',5);L.position.set(-4,9,-60);scene.add(L);
  const sun=glowSprite('rgba(255,190,120,1)',40);sun.position.set(-10,8,-150);scene.add(sun);
  const c=cam(40);look(c,[2.2,1.6,10.8],[0.3,2.0,0]);
  ui.innerHTML=`
  <div style="position:absolute;left:70px;top:70px;background:#ffd84d;color:#3a2a00;font-weight:900;font-size:58px;padding:8px 30px;border-radius:18px;box-shadow:0 8px 20px rgba(0,0,0,.3)">D+3650</div>
  <div class="out" style="position:absolute;left:62px;top:175px;font-size:150px;letter-spacing:-5px;line-height:1.05">지구에<br><span style="color:#9fe3ff">나 혼자</span><br>남는다면?</div>
  <div class="out" style="position:absolute;left:66px;top:705px;font-size:70px;letter-spacing:-2px;line-height:1.2">10년째 사람 0명…<br><span style="color:#ffe14d">그런데 불빛이 보였다</span></div>
  <div style="position:absolute;left:1060px;top:60px;width:300px;height:110px"></div>`;
  renderer.render(scene,c);
};
