// ENTJ 무인도편에서 가져온 자세 도우미
function stick(p,len=0.9){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.025,len,5),lamb(0x8a6a44));s.position.set(0,-0.62-len*0.35,0.12);s.rotation.x=0.5;p.userData.arms[1].add(s);return s}
function crossArms(p,k=1){const u=p.userData;u.arms[0].rotation.set(-1.3*k,0,1.0*k);u.arms[1].rotation.set(-1.15*k,0,-1.0*k)}
function wave(p,t,side=1,ph=0){armUp(p,side,1);p.userData.arms[side].rotation.z=(side?1:-1)*(0.25+Math.sin(t*9+ph)*0.35)}
function laughPose(p,t,k=1,ph=0){const u=p.userData,s=Math.abs(Math.sin(t*9+ph));u.hip.rotation.x=-0.15*k*s;u.head.rotation.x=-0.25*k*s;u.arms[0].rotation.x=-0.8*k;u.arms[1].rotation.x=-0.8*k;u.arms[0].rotation.z=0.3*k;u.arms[1].rotation.z=-0.3*k}
