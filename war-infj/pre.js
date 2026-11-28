// ---------- ENTP 전쟁편에서 가져온 공용 ----------
function mouthO(p){const m=new THREE.Mesh(new THREE.CircleGeometry(0.055,16),basic(0x4a1a1a));m.position.set(0,0.15,0.249);m.visible=false;p.userData.head.add(m);p.userData.mo=m;return m}
function faceO(p,on){if(!p.userData.mo)mouthO(p);p.userData.mo.visible=on;if(on){p.userData.smile.visible=false;p.userData.flat.visible=false}}
function eyesBig(p,k){p.userData.head.children.forEach(c=>{if(c.geometry&&c.geometry.parameters&&c.geometry.parameters.height===0.07)c.scale.y=k})}
function lineMark(scene,z){const l=new THREE.Mesh(new THREE.PlaneGeometry(60,0.22),basic(0xfafafa));l.rotation.x=-Math.PI/2;l.position.set(0,0.02,z);scene.add(l);return l}
function borderField(scene,r,o={}){
  ground(scene,o.g??0x9cb97a,300);
  const dirt=new THREE.Mesh(new THREE.PlaneGeometry(80,4),lamb(0xb9a47a));dirt.rotation.x=-Math.PI/2;dirt.position.set(0,0.01,-5);scene.add(dirt);
  lineMark(scene,-5);
  sandbags(scene,0,1.8,18,2);sandbags(scene,0,-11.8,18,2,0xb4a7d6);
  for(let i=0;i<10;i++)tree(scene,(i-4.5)*5+r(),-22-r()*4,1.2,0x76a866);
  for(let i=0;i<8;i++)tree(scene,(i-3.5)*6+r(),9+r()*3,1.1,0x76a866);
  for(let i=0;i<7;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-3)*14+r()*4,0,-42-r()*10);scene.add(h)}
  tent(scene,-9,6,0x667f48,1.3);tent(scene,9,-17,0x6d62ad,1.3);
  flag(scene,-7.5,2.8,0x7f9b5a,4.2,1.3);flag(scene,7.5,-12.8,0x7c74b8,4.2,1.3);
}
