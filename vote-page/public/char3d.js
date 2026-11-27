// 주문서 캐릭터 미리보기: 웅이프 릴스와 같은 캐릭터 코드(makePerson·femHair·addFace)로 3D 렌더
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// 주문서 선택지 → 릴스 색 (순서는 order.html의 HC·SK·CL과 같아야 해요)
export const HAIR = [0x2a2220, 0x4a3426, 0x8a5a36, 0xd9b264, 0xe7a0b8];
export const SKIN = [0xffe3cf, 0xf1c6a2, 0xd09a72];   // 궁합편 매끈한 피치 피부(밝은 톤 = 궁합편 그대로)
export const BOTTOM = [0x2c3040, 0x1f1f24, 0xd9c3a0, 0x5b7fb8, 0xfff0a8, 0xffd1e3];   // 남색·검정·베이지·청·노랑·분홍
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
// ---------- 궁합편 캐릭터 ----------
// 여자: 궁합편 여자 디자인 (#015 ENFP · #010 INFP · #017 ESTJ) — 몸 0.8배·머리 1.4배, 큰 눈 하이라이트, 동그란 볼터치, 웃는 입
// 머리: 묶은 머리 = ENFP 양갈래 만두머리, 긴 머리 = INFP 긴 생머리, 짧은 머리 = ESTJ 턱선 단발
// 남자: #015 INTJ 디자인 (단정한 옆가르마, 눈썹, 흰 깃) + 웃는 입
const skinMat = (c) => matCache["k" + c] || (matCache["k" + c] = new THREE.MeshLambertMaterial({ color: c, emissive: 0x2a1a10 }));
function hideDefaultFace(h) {
  h.children.forEach((c) => { const g = c.geometry && c.geometry.parameters;
    if (g && ((g.width === 0.05 && g.height === 0.07) || (g.width === 0.07 && g.height === 0.035))) c.visible = false; });
  h.children.filter((c) => c.geometry && c.geometry.type === "TorusGeometry").forEach((c) => (c.visible = false));
}
function bigEyes(h, o = {}) {
  for (const sx of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), basic(0x2a1a14)); e.scale.set(0.9, 1.2, 0.5); e.position.set(sx * 0.095, 0.25, 0.232); h.add(e);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 8), basic(0xffffff)); hl.position.set(sx * 0.095 + 0.015, 0.27, 0.252); h.add(hl);
    if (o.lash) { const la = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, 0.012), basic(0x2a1a14)); la.position.set(sx * 0.135, 0.29, 0.226); la.rotation.z = sx * 0.6; h.add(la); }
    if (o.brow) { const br = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.016, 0.012), basic(o.brow)); br.position.set(sx * 0.095, 0.33, 0.236); h.add(br); }
    const ck = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), new THREE.MeshBasicMaterial({ color: 0xff9fb8, transparent: true, opacity: 0.75 })); ck.position.set(sx * 0.15, 0.175, 0.216); ck.rotation.y = sx * 0.35; h.add(ck);
  }
  const sm = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.011, 8, 16, Math.PI), basic(0xd8506e)); sm.rotation.z = Math.PI; sm.position.set(0, 0.165, 0.245); h.add(sm);
}
function hairENFP(h, m) {   // 양갈래 만두머리
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.262, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.position.y = 0.25; cap.rotation.x = -0.22; h.add(cap);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(0.85, 0.22, 0.42); bang.position.set(0, 0.39, 0.14); h.add(bang);
  const bk = new THREE.Mesh(new THREE.SphereGeometry(0.266, 40, 24, Math.PI, Math.PI, 0, Math.PI * 0.72), m); bk.position.y = 0.25; h.add(bk);
  for (const sx of [-1, 1]) {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 18), m); bun.position.set(sx * 0.17, 0.47, -0.06); h.add(bun);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), smooth(0xff4d8d)); tie.position.set(sx * 0.15, 0.42, -0.05); tie.rotation.set(0.3, 0, sx * 0.75); h.add(tie);
  }
}
function hairINFP(h, m) {   // 긴 생머리
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.27, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.position.y = 0.25; cap.rotation.x = -0.3; h.add(cap);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(0.95, 0.24, 0.45); bang.position.set(-0.02, 0.4, 0.13); bang.rotation.z = -0.15; h.add(bang);
  const cg = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 24);
  const back = new THREE.Mesh(cg(0.2, 0.5), m); back.scale.set(1.3, 1, 0.55); back.position.set(0, 0.0, -0.13); h.add(back);
  for (const sx of [-1, 1]) { const sd = new THREE.Mesh(cg(0.065, 0.4), m); sd.position.set(sx * 0.225, 0.07, 0.04); h.add(sd); }
  const pin = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16), smooth(0xb48cff)); pin.position.set(0.16, 0.41, 0.17); h.add(pin);
}
function hairESTJ(h, m) {   // 턱선 단발
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.262, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.position.y = 0.25; cap.rotation.x = -0.22; h.add(cap);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(0.95, 0.2, 0.42); bang.position.set(0, 0.385, 0.145); h.add(bang);
  const bob = new THREE.Mesh(new THREE.SphereGeometry(0.268, 40, 24, Math.PI * 0.82, Math.PI * 1.36, 0, Math.PI * 0.78), m); bob.position.y = 0.25; bob.scale.set(1.06, 1, 1.02); h.add(bob);
}
function hairINTJ(h, m, style) {   // 남자: 옆가르마 (+ 긴 머리 / 묶은 머리)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.262, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.position.y = 0.25; cap.rotation.x = -0.3; h.add(cap);
  const bk = new THREE.Mesh(new THREE.SphereGeometry(0.264, 40, 24, Math.PI, Math.PI, 0, Math.PI * (style === "long" ? 0.8 : 0.6)), m); bk.position.y = 0.25; h.add(bk);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(0.95, 0.24, 0.42); bang.position.set(0.05, 0.425, 0.13); bang.rotation.z = 0.22; h.add(bang);
  if (style === "tied") { const t = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 16), m); t.position.set(0, 0.36, -0.27); h.add(t); }
}
function glasses(h) {
  const gm = lamb(0x22222a);
  for (const sx of [-1, 1]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.011, 8, 24), gm); ring.position.set(sx * 0.095, 0.25, 0.258); h.add(ring); }
  const br = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.011, 0.011), gm); br.position.set(0, 0.26, 0.262); h.add(br);
}
// ---------- 옷 입히기 ----------
function hood(u, col) {   // 후드티: 등 뒤 후드 + 앞 주머니 + 끈
  const dk = new THREE.Color(col).multiplyScalar(0.88).getHex();
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), lamb(dk)); hd.scale.set(1.25, 0.75, 0.7); hd.position.set(0, 0.66, -0.15); u.hip.add(hd);
  const pk = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.13, 0.02), lamb(dk)); pk.position.set(0, 0.12, 0.17); u.hip.add(pk);
  for (const sx of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), lamb(0xffffff)); st.position.set(sx * 0.06, 0.52, 0.17); u.hip.add(st); }
}
function shirtTie(u, col) {   // 셔츠: 흰 깃 + 넥타이
  const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.05), lamb(0xffffff)); c.position.set(0, 0.62, 0.15); u.hip.add(c);
  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.02), lamb(new THREE.Color(col).multiplyScalar(0.6).getHex())); tie.position.set(0, 0.42, 0.17); u.hip.add(tie);
}
function cap(h, col) {
  const m = smooth(col);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.275, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), m); top.position.y = 0.3; top.rotation.x = -0.12; h.add(top);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.025, 24), m); brim.scale.set(1, 1, 0.75); brim.position.set(0, 0.33, 0.24); brim.rotation.x = 0.12; h.add(brim);
}
function beanie(h, col) {
  const m = smooth(col);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), m); top.position.y = 0.3; top.scale.y = 1.05; h.add(top);
  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.04, 10, 32), smooth(new THREE.Color(col).multiplyScalar(0.85).getHex())); cuff.rotation.x = Math.PI / 2; cuff.position.y = 0.31; h.add(cuff);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), smooth(0xffffff)); pom.position.y = 0.6; h.add(pom);
}
function scarf(u) {
  const m = lamb(0xe8505b);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.06, 10, 24), m); ring.rotation.x = Math.PI / 2; ring.position.y = 0.66; u.hip.add(ring);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 0.05), m); tail.position.set(0.1, 0.5, 0.18); tail.rotation.z = 0.15; u.hip.add(tail);
}
export function person(c) {
  const female = c.g === "여";
  const skin = SKIN[c.skin] ?? SKIN[0], hair = HAIR[c.hc] ?? HAIR[0], shirt = SHIRT[c.cl] ?? SHIRT[0];
  const bottom = c.bottom || (female ? "skirt" : "pants"), bcol = BOTTOM[c.bc ?? (female ? 4 : 0)] ?? BOTTOM[0];
  const p = makePerson({ shirt, pants: bottom === "pants" ? bcol : skin, skin, hair });
  const u = p.userData, h = u.head;
  h.children[0].material = skinMat(skin); u.arms.forEach((a) => (a.children[1].material = lamb(skin)));
  h.children[1].visible = false; hideDefaultFace(h);
  const m = smooth(hair);
  if (female) u.hip.children[0].scale.x = 0.9;
  if (bottom === "skirt") { const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.36, 0.36, 16), lamb(bcol)); sk.position.y = -0.14; u.hip.add(sk); }
  if (bottom === "shorts") u.legs.forEach((l) => { const sh = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.3, 0.25), lamb(bcol)); sh.position.y = -0.14; l.add(sh); });
  const top = c.top || "tee";
  if (top === "hood") hood(u, shirt);
  else if (top === "shirt") shirtTie(u, shirt);
  if (female) {
    bigEyes(h, { lash: true });
    if (c.hair === "long") hairINFP(h, m); else if (c.hair === "short") hairESTJ(h, m); else hairENFP(h, m);
  } else {
    bigEyes(h, { brow: 0x1d1d26 });
    hairINTJ(h, m, c.hair);
    if (top === "tee") { const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.05), lamb(0xffffff)); col.position.set(0, 0.62, 0.15); u.hip.add(col); }
  }
  if (c.gl) glasses(h);
  if (c.hat === "cap") cap(h, shirt); else if (c.hat === "beanie") beanie(h, shirt);
  if (c.scarf) scarf(u);
  if (female) { p.scale.setScalar(0.8); h.scale.setScalar(1.4); h.position.y = 0.62; }
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
