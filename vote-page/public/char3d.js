// 주문서 캐릭터 미리보기: 웅이프 릴스와 같은 캐릭터 코드(makePerson·femHair·addFace)로 3D 렌더
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// 주문서 선택지 → 릴스 색 (순서는 order.html의 HC·SK·CL과 같아야 해요)
export const HAIR = [0x2a2220, 0x4a3426, 0x8a5a36, 0xd9b264, 0xe7a0b8];
export const SKIN = [0xf3cfae, 0xebb995, 0xc98f68];
export const SHIRT = [0xff9ec4, 0xffc94d, 0x8cc9a0, 0x6c8ebf, 0xa58cd0, 0xe39a6b, 0x90b86c, 0xb8bec6];

const matCache = {};
const lamb = (c) => matCache["l" + c] || (matCache["l" + c] = new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
const smooth = (c) => matCache["s" + c] || (matCache["s" + c] = new THREE.MeshLambertMaterial({ color: c }));
const basic = (c) => matCache["b" + c] || (matCache["b" + c] = new THREE.MeshBasicMaterial({ color: c }));
const lighten = (c, k) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), k).getHex();

function makePerson(o) {
  const g = new THREE.Group();
  const { shirt, pants, skin, hair } = o;
  const hip = new THREE.Group(); hip.position.y = 0.8; g.add(hip);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.64, 0.32), lamb(shirt)); body.position.y = 0.32; hip.add(body);
  const legs = [], arms = [];
  for (const s of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(s * 0.13, 0.02, 0);
    const lm = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.8, 0.23), lamb(pants)); lm.position.y = -0.4; leg.add(lm);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.32), lamb(0x2b2b30)); shoe.position.set(0, -0.77, 0.05); leg.add(shoe);
    hip.add(leg); legs.push(leg);
    const arm = new THREE.Group(); arm.position.set(s * 0.34, 0.6, 0);
    const am = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.58, 0.17), lamb(shirt)); am.position.y = -0.27; arm.add(am);
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), lamb(skin)); hand.position.y = -0.6; arm.add(hand);
    hip.add(arm); arms.push(arm);
  }
  const head = new THREE.Group(); head.position.y = 0.66; hip.add(head);
  const hm = new THREE.Mesh(new THREE.SphereGeometry(0.25, 40, 30), smooth(skin)); hm.position.y = 0.24; head.add(hm);
  const hr = new THREE.Mesh(new THREE.SphereGeometry(0.265, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), smooth(hair)); hr.position.y = 0.26; hr.rotation.x = -0.35; head.add(hr);
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.02), lamb(0x1a1a1a)); e.position.set(s * 0.09, 0.25, 0.24); head.add(e);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.035, 0.01), basic(0xf2a3a3)); ch.position.set(s * 0.14, 0.17, 0.225); head.add(ch);
  }
  const sm = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.013, 4, 10, Math.PI), basic(0x5a2a2a)); sm.rotation.z = Math.PI; sm.position.set(0, 0.165, 0.245); head.add(sm);
  g.userData = { hip, legs, arms, head };
  return g;
}
function femHair(p, col, o = {}) {
  const h = p.userData.head; h.children[1].visible = false; const m = smooth(col);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.268, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), m); cap.position.y = 0.25; cap.rotation.x = -0.42; h.add(cap);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(1.15, 0.34, 0.6); bang.position.set(-0.03, 0.43, 0.12); bang.rotation.z = -0.2; h.add(bang);
  if (o.bun) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 30, 20), m); b.position.set(0, 0.5, -0.14); h.add(b); }
  else {
    const cg = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 24);
    const back = new THREE.Mesh(cg(0.2, o.short ? 0.25 : 0.55), m); back.scale.set(1.3, 1, 0.55); back.position.set(0, o.short ? 0.12 : -0.02, -0.13); h.add(back);
    for (const sx of [-1, 1]) { const sd = new THREE.Mesh(cg(0.07, o.short ? 0.22 : 0.46), m); sd.position.set(sx * 0.225, o.short ? 0.16 : 0.04, 0.05); h.add(sd); }
  }
  if (o.lash) for (const sx of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.018, 0.02), lamb(0x1a1a1a)); l.position.set(sx * 0.09, 0.29, 0.236); h.add(l); }
}
function glasses(p) {
  const h = p.userData.head;
  for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), basic(0x222222)); g.position.set(s * 0.09, 0.25, 0.25); h.add(g); }
  const br = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.01), basic(0x222222)); br.position.set(0, 0.26, 0.252); h.add(br);
}
// 주문서 선택 → 캐릭터 (남: 기본 남자 모델, 여: 릴스 girl() 모델 + 치마)
export function person(c) {
  const female = c.g === "여";
  const skin = SKIN[c.skin] ?? SKIN[0], hair = HAIR[c.hc] ?? HAIR[0], shirt = SHIRT[c.cl] ?? SHIRT[0];
  const p = makePerson({ shirt, pants: female ? skin : 0x3d4a6b, skin, hair });
  const u = p.userData;
  if (female) {
    u.hip.children[0].scale.x = 0.9;
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.36, 0.36, 16), lamb(lighten(shirt, 0.45))); sk.position.y = -0.14; u.hip.add(sk);
  }
  if (c.hair === "long") femHair(p, hair, { lash: female });
  else if (c.hair === "tied") femHair(p, hair, { bun: true, lash: female });
  else if (female) femHair(p, hair, { short: true, lash: true });
  if (c.gl) glasses(p);
  return p;
}

export function mount(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8070, 1.6));
  const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(6, 12, 8); scene.add(d);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), lamb(0xcfe8c9)); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; scene.add(ground);
  for (const x of [-0.75, 0.75]) { const sh = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12 })); sh.rotation.x = -Math.PI / 2; sh.position.set(x, 0.001, 0); scene.add(sh); }
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 1.45, 6.4); cam.lookAt(0, 1.0, 0);
  let figs = [null, null], cur = 0, key = "", raf = 0;
  function size() {
    const w = canvas.clientWidth || 340, h = canvas.clientHeight || 296;
    if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    }
  }
  function set(a, b, slot) {
    cur = slot === "b" ? 1 : 0;
    const k = JSON.stringify([a, b]);
    if (k === key) return; key = k;
    [a, b].forEach((c, i) => {
      if (figs[i]) scene.remove(figs[i]);
      const p = person(c); p.position.set(i ? 0.75 : -0.75, 0, 0); p.rotation.y = i ? -0.22 : 0.22;
      scene.add(p); figs[i] = p;
    });
  }
  const t0 = performance.now();
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!canvas.isConnected) return;
    size();
    const t = (performance.now() - t0) / 1000;
    figs.forEach((p, i) => {
      if (!p) return; const u = p.userData, on = i === cur;
      u.hip.position.y = 0.8 + (on ? Math.abs(Math.sin(t * 4)) * 0.06 : Math.sin(t * 1.6 + i) * 0.008);
      // 바깥쪽 팔로 손 흔들기 (A는 왼팔, B는 오른팔)
      const out = u.arms[i ? 1 : 0], inn = u.arms[i ? 0 : 1], sg = i ? 1 : -1;
      out.rotation.z = on ? sg * (2.5 + Math.sin(t * 7) * 0.3) : sg * 0.06;
      inn.rotation.z = -sg * 0.06;
      u.head.rotation.y = Math.sin(t * 0.9 + i * 2) * 0.12;
    });
    renderer.render(scene, cam);
  }
  loop();
  return { set, stop: () => cancelAnimationFrame(raf) };
}
