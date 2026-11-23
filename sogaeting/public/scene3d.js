// 만약에 소개팅 — 실시간 3D 장면 (릴스 룩: 파스텔 로우폴리)
// app.js는 window.Scene3D만 씀. 3D가 안 되면 ready=false로 두고 app.js가 사진 버전으로 감.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const clamp01 = x => Math.max(0, Math.min(1, x));
const ease = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
const hop = (t, a, b, h) => { const k = clamp01((t - a) / (b - a)); return Math.sin(k * Math.PI) * h; };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
const mc = {}; const lamb = c => mc[c] || (mc[c] = new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
const sc = {}; const smooth = c => sc[c] || (sc[c] = new THREE.MeshLambertMaterial({ color: c }));
const basic = c => new THREE.MeshBasicMaterial({ color: c });
const FONT = 'Pretendard,"Apple SD Gothic Neo","Noto Sans KR","Noto Sans CJK KR",sans-serif';
function box(parent, w, h, d, col, x, y, z, mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || lamb(col)); m.position.set(x, y, z); parent.add(m); return m; }
function cyl(parent, rt, rb, h, col, x, y, z, seg = 12) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), lamb(col)); m.position.set(x, y, z); parent.add(m); return m; }
function rr(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function texPlane(parent, w, h, tex, x, y, z) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); m.position.set(x, y, z); parent.add(m); return m; }

// ---------- 사람 (릴스 makePerson 그대로) ----------
const SKIN = [0xf3cfae, 0xebb995, 0xdfa882], HAIR = [0x2a2220, 0x4a3426, 0x1d1d24, 0x6b4a2f, 0x3a2f2a];
const SHIRT = [0x6c8ebf, 0xd98c8c, 0x8cc9a0, 0xe0c070, 0xa58cd0, 0x7fb7c9, 0xe39a6b, 0xc7a3c9, 0x90b86c], PANTS = [0x33384a, 0x3d3a36, 0x2c4058, 0x55506a, 0x6b5a48];
function makePerson(r, o = {}) {
  const g = new THREE.Group();
  const shirt = o.shirt ?? pick(r, SHIRT), pants = o.pants ?? pick(r, PANTS), skin = pick(r, SKIN), hair = o.hair ?? pick(r, HAIR);
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
  g.userData = { hip, legs, arms, head };
  return g;
}
function sitPose(p) { const u = p.userData; u.hip.position.y = 0.56; u.legs.forEach(l => l.rotation.x = -Math.PI / 2); }

// ---------- ENFP 여자 (이방인편 mkE + 표정 부품) ----------
function mkE() {
  const p = makePerson(rng(31), { shirt: 0xff9fcf, pants: 0x55506a }); const u = p.userData, h = u.head;
  const SK = 0xffe3cf; h.children[0].material = new THREE.MeshLambertMaterial({ color: SK, emissive: 0x2a1a10 }); u.arms.forEach(a => a.children[1].material = lamb(SK));
  h.children[1].visible = false; u.hip.children[0].scale.x = 0.9; const skin = u.arms[0].children[1].material; u.legs.forEach(l => { l.children[0].material = skin; });
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.36, 0.36, 16), lamb(0xfff0a8)); skirt.position.y = -0.14; u.hip.add(skirt);
  h.children.forEach(c => { const g = c.geometry && c.geometry.parameters; if (g && ((g.width === 0.05 && g.height === 0.07) || (g.width === 0.07 && g.height === 0.035))) c.visible = false; });
  const P = { eyes: [], hls: [], cheeks: [], happy: [], tears: [], brows: [] };
  for (const sx of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), basic(0x2a1a14)); e.scale.set(0.9, 1.2, 0.5); e.position.set(sx * 0.095, 0.25, 0.232); h.add(e); P.eyes.push(e);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 8), basic(0xffffff)); hl.position.set(sx * 0.095 + 0.015, 0.27, 0.252); h.add(hl); P.hls.push(hl);
    const la = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, 0.012), basic(0x2a1a14)); la.position.set(sx * 0.135, 0.29, 0.226); la.rotation.z = sx * 0.6; h.add(la);
    const ck = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), new THREE.MeshBasicMaterial({ color: 0xff9fb8, transparent: true, opacity: 0.75 })); ck.position.set(sx * 0.15, 0.175, 0.216); ck.rotation.y = sx * 0.35; h.add(ck); P.cheeks.push(ck);
    const a = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16, Math.PI), basic(0x2a1a14)); a.position.set(sx * 0.095, 0.245, 0.238); a.visible = false; h.add(a); P.happy.push(a);
    const t = new THREE.Mesh(new THREE.SphereGeometry(0.018, 14, 10), new THREE.MeshBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0.95 })); t.scale.set(1, 1.5, 0.5); t.position.set(sx * 0.1, 0.195, 0.245); t.visible = false; h.add(t); P.tears.push(t);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), basic(0x5a3424)); b.position.set(sx * 0.095, 0.325, 0.232); b.visible = false; h.add(b); P.brows.push(b);
  }
  P.smile = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.011, 8, 16, Math.PI), basic(0xd8506e)); P.smile.rotation.z = Math.PI; P.smile.position.set(0, 0.165, 0.245); h.add(P.smile);
  P.open = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 14), basic(0xb8344f)); P.open.scale.set(1, 0.75, 0.4); P.open.position.set(0, 0.16, 0.24); P.open.visible = false; h.add(P.open);
  P.tongue = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 10), basic(0xff8fa6)); P.tongue.scale.set(1, 0.5, 0.4); P.tongue.position.set(0, 0.143, 0.25); P.tongue.visible = false; h.add(P.tongue);
  P.pout = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.009, 8, 16), basic(0xd8506e)); P.pout.position.set(0, 0.165, 0.248); P.pout.visible = false; h.add(P.pout);
  const m = smooth(0x7a4a32);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.262, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.position.y = 0.25; cap.rotation.x = -0.22; h.add(cap);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(0.85, 0.22, 0.42); bang.position.set(0, 0.39, 0.14); h.add(bang);
  const bk = new THREE.Mesh(new THREE.SphereGeometry(0.266, 40, 24, Math.PI, Math.PI, 0, Math.PI * 0.72), m); bk.position.y = 0.25; h.add(bk);
  for (const sx of [-1, 1]) {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 18), m); bun.position.set(sx * 0.17, 0.47, -0.06); h.add(bun);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), smooth(0xff4d8d)); tie.position.set(sx * 0.15, 0.42, -0.05); tie.rotation.set(0.3, 0, sx * 0.75); h.add(tie);
  }
  p.scale.setScalar(0.8); h.scale.setScalar(1.4); h.position.y = 0.62;
  // 폰 (덕질·항공권 장면)
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xbfe6ff)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p;
}
const FACE = {
  smile() {},
  excited(P) { P.smile.visible = false; P.open.visible = true; P.tongue.visible = true; P.hls.forEach(h => h.scale.setScalar(1.6)); P.eyes.forEach(e => e.scale.set(1, 1.35, 0.5)); },
  happy(P) { P.eyes.forEach(e => e.visible = false); P.hls.forEach(h => h.visible = false); P.happy.forEach(a => a.visible = true); P.smile.visible = false; P.open.visible = true; P.open.scale.set(1.1, 0.6, 0.4); P.cheeks.forEach(c => c.scale.setScalar(1.2)); },
  blush(P) { P.eyes.forEach(e => e.scale.set(0.9, 0.75, 0.5)); P.cheeks.forEach(c => { c.scale.set(1.7, 1.3, 1); c.material.opacity = 0.95; c.material.color.set(0xff7a9a); }); P.smile.scale.setScalar(0.7); },
  pout(P) { P.smile.visible = false; P.pout.visible = true; P.cheeks.forEach(c => { c.scale.setScalar(1.45); c.material.opacity = 0.9; }); P.brows.forEach((b, i) => { b.visible = true; b.rotation.z = i ? -0.35 : 0.35; }); },
  teary(P) { P.tears.forEach(t => t.visible = true); P.hls.forEach(h => h.scale.setScalar(1.8)); P.eyes.forEach(e => e.scale.set(1, 1.3, 0.5)); P.smile.rotation.z = 0; P.smile.position.y = 0.14; P.smile.scale.setScalar(0.8); P.brows.forEach((b, i) => { b.visible = true; b.rotation.z = i ? 0.35 : -0.35; }); },
  surprised(P) { P.smile.visible = false; P.open.visible = true; P.open.scale.set(0.7, 0.95, 0.4); P.eyes.forEach(e => e.scale.set(1.05, 1.45, 0.5)); P.brows.forEach(b => { b.visible = true; b.position.y = 0.345; }); },
};
function resetFace(P) {
  P.eyes.forEach(e => { e.visible = true; e.scale.set(0.9, 1.2, 0.5); }); P.hls.forEach(h => { h.visible = true; h.scale.setScalar(1); });
  P.cheeks.forEach(c => { c.scale.setScalar(1); c.material.opacity = 0.75; c.material.color.set(0xff9fb8); });
  P.smile.visible = true; P.smile.rotation.z = Math.PI; P.smile.position.y = 0.165; P.smile.scale.setScalar(1);
  [P.open, P.tongue, P.pout, ...P.happy, ...P.tears, ...P.brows].forEach(x => x.visible = false);
  P.open.scale.set(1, 0.75, 0.4); P.brows.forEach(b => { b.position.y = 0.325; b.rotation.z = 0; });
}
// 표정에 맞는 기본 동작 (대본에서 act로 바꿀 수 있음)
const DEFAULT_ACT = { smile: 'idle', excited: 'cheer', happy: 'sway', blush: 'shy', pout: 'turn', teary: 'cover', surprised: 'startle' };

// ---------- 세트 ----------
function room(g, o) {
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), lamb(o.floor)); fl.rotation.x = -Math.PI / 2; fl.position.z = 2; g.add(fl);
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), lamb(o.wall)); wl.position.set(0, 4, o.wz ?? -2.2); g.add(wl);
}
function plant(g, x, z, s = 1) { const p = new THREE.Group(); cyl(p, 0.22, 0.17, 0.4, 0xd98c6c, 0, 0.2, 0, 10); const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), lamb(0x7fbf6a)); b.position.y = 0.72; p.add(b); const b2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), lamb(0x9ccf8a)); b2.position.set(0.15, 1.02, 0.05); p.add(b2); p.position.set(x, 0, z); p.scale.setScalar(s); g.add(p); return p; }
function lampPend(g, x, y, z) { const l = new THREE.Group(); box(l, 0.02, 1.2, 0.02, 0x555560, 0, 0.6, 0); const sh = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.22, 16, 1, true), lamb(0xffe08a)); sh.position.y = 0; sh.material.side = THREE.DoubleSide; l.add(sh); const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), basic(0xfff2c0)); bulb.position.y = -0.08; l.add(bulb); l.position.set(x, y, z); g.add(l); }
function dateTable(g, z = 0.62) {
  box(g, 1.5, 0.06, 0.8, 0xffffff, 0, 0.72, z); cyl(g, 0.05, 0.05, 0.7, 0x555560, 0, 0.36, z, 8);
  cyl(g, 0.08, 0.065, 0.2, 0xffd0e4, -0.42, 0.85, z + 0.12); cyl(g, 0.075, 0.06, 0.17, 0x3a2a22, 0.42, 0.84, z + 0.2);
  const straw = box(g, 0.012, 0.22, 0.012, 0xff6fb5, -0.39, 0.97, z + 0.1); straw.rotation.z = -0.25;
}
function windowWall(g, col, y = 2.0, w = 4.4) {
  const win = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.9), basic(col)); win.position.set(0, y, -2.15); g.add(win);
  for (const x of [-w / 2, -w / 6, w / 6, w / 2]) box(g, 0.08, 1.95, 0.06, 0x7a5a3a, x, y, -2.1);
  box(g, w + 0.1, 0.08, 0.1, 0x7a5a3a, 0, y - 0.97, -2.08); box(g, w + 0.1, 0.08, 0.1, 0x7a5a3a, 0, y + 0.97, -2.08);
  return win;
}
function buildCafe(r) {
  const g = new THREE.Group(); room(g, { floor: 0xd9b28a, wall: 0xf6ead8 });
  const win = windowWall(g, 0xffffff);
  win.material = new THREE.MeshBasicMaterial({ map: canvasTex(512, 220, (x, w, h) => {
    const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#bfe3ff'); gg.addColorStop(1, '#e6f5ff'); x.fillStyle = gg; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) { const cx = 20 + i * 60 + r() * 20, cy = h - 30 - r() * 40, rad = 34 + r() * 26; x.fillStyle = ['#9ccf8a', '#8cc47a', '#a9d896'][i % 3]; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill(); }
    x.fillStyle = '#ffffff'; [[90, 50], [330, 36]].forEach(([cx, cy]) => { x.beginPath(); x.ellipse(cx, cy, 46, 16, 0, 0, 7); x.fill(); });
  }) });
  plant(g, -2.2, -1.4, 1.2); plant(g, 2.2, -1.4, 1.0);
  lampPend(g, -1.1, 2.9, -0.4); lampPend(g, 1.1, 2.9, -0.4);
  box(g, 0.55, 0.9, 0.12, 0xb07a52, 0, 0.75, -0.42); // 의자 등받이
  dateTable(g);
  return g;
}
function menuTex(sel) { return canvasTex(512, 300, (x, w, h) => {
  x.fillStyle = '#2f3a33'; rr(x, 0, 0, w, h, 26); x.fill(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = `900 52px ${FONT}`; x.fillText('MENU', w / 2, 64);
  x.textAlign = 'left'; x.font = `800 40px ${FONT}`;
  [['라떼', '4.5'], ['딸기 에이드', '5.0'], ['수제 케이크', '6.0']].forEach(([n, p], i) => { const y = 132 + i * 58; x.fillStyle = sel === n ? '#ffd84d' : '#e8efe9'; x.fillText((sel === n ? '▶ ' : '   ') + n, 40, y); x.textAlign = 'right'; x.fillText(p, w - 40, y); x.textAlign = 'left'; });
}); }
function buildCounter(r) {
  const g = new THREE.Group(); room(g, { floor: 0xcfb08a, wall: 0xdff0e2 });
  const menu = texPlane(g, 1.5, 0.88, menuTex(''), -1.05, 2.05, -2.15); g.userData.menu = menu;
  box(g, 1.3, 0.05, 0.25, 0x9a6a4a, 1.1, 1.75, -2.05);
  for (let i = 0; i < 4; i++) cyl(g, 0.06, 0.05, 0.14, pick(r, [0xffffff, 0xffd0e4, 0xcde9ff]), 0.7 + i * 0.27, 1.85, -2.05);
  box(g, 3.0, 0.95, 0.6, 0xb07a52, 0, 0.47, 0.75); box(g, 3.1, 0.06, 0.7, 0xf3ead8, 0, 0.97, 0.75); // 카운터
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.35 })); glass.position.set(1.0, 1.25, 0.75); g.add(glass);
  for (let i = 0; i < 3; i++) { const c = cyl(g, 0.11, 0.11, 0.12, pick(r, [0xffc0d8, 0xfff0c0, 0xd9b48a]), 0.72 + i * 0.28, 1.07, 0.75, 14); cyl(c, 0.02, 0.02, 0.04, 0xff4d6d, 0, 0.08, 0, 8); }
  const staff = makePerson(rng(77), { shirt: 0xffffff, hair: 0x2a2220 }); box(staff.userData.hip, 0.5, 0.5, 0.02, 0x3f6b55, 0, 0.25, 0.17); // 앞치마
  staff.position.set(-0.85, 0, -0.5); staff.rotation.y = 0.3; staff.scale.setScalar(0.9); g.add(staff); g.userData.staff = staff;
  plant(g, 2.4, -1.4, 1.0);
  return g;
}
function buildTable(r) {
  const g = new THREE.Group(); room(g, { floor: 0xe8c9b0, wall: 0xfbe3ee });
  for (let i = 0; i < 3; i++) { const f = texPlane(g, 0.6, 0.45, canvasTex(240, 180, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = pick(r, ['#bfe6ff', '#ffe0a8', '#d8f0c8']); x.fillRect(12, 12, w - 24, h - 24); x.font = '90px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(['🐧', '🌷', '☕'][i], w / 2, h / 2 + 6); }), -1.6 + i * 1.6, 2.2 + (i % 2) * 0.2, -2.15); }
  lampPend(g, 0, 2.9, -0.2);
  box(g, 0.55, 0.9, 0.12, 0xb07a52, 0, 0.75, -0.42);
  plant(g, -2.0, -1.3, 1.1);
  dateTable(g);
  return g;
}
function buildRain(r) {
  const g = new THREE.Group(); room(g, { floor: 0xb9a48c, wall: 0xdfe4ee });
  windowWall(g, 0x6f84a8, 2.0, 4.8);
  // 창밖 건물 실루엣
  for (let i = 0; i < 7; i++) { const b = box(g, 0.6 + r() * 0.4, 0.8 + r() * 1.2, 0.1, 0x55668a, -2.3 + i * 0.75, 1.3, -2.4); b.position.y = 1.05 + b.geometry.parameters.height / 2; }
  // 빗줄기
  const N = 340, pos = new Float32Array(N * 6), sp = [];
  for (let i = 0; i < N; i++) { const x = (r() - 0.5) * 4.6, y = 1.05 + r() * 1.9, z = -2.3; sp.push([x, y, z, 1.6 + r() * 1.2]); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const rain = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xdbe9ff, transparent: true, opacity: 0.55 })); g.add(rain);
  g.userData.rain = { geo, sp, pos };
  // 유리 물방울
  // 유리에 흘러내리는 물줄기
  for (let i = 0; i < 14; i++) { const d = box(g, 0.012, 0.15 + r() * 0.3, 0.005, 0, (r() - 0.5) * 4.4, 1.2 + r() * 1.6, -2.1, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })); }
  lampPend(g, 0, 2.9, -0.3);
  box(g, 0.55, 0.9, 0.12, 0x8a6a52, 0, 0.75, -0.42);
  dateTable(g);
  return g;
}
function buildStreet(r) {
  const g = new THREE.Group();
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), lamb(0x5b5470)); gr.rotation.x = -Math.PI / 2; g.add(gr);
  const walk = new THREE.Mesh(new THREE.PlaneGeometry(30, 2.6), lamb(0xb8aac8)); walk.rotation.x = -Math.PI / 2; walk.position.set(0, 0.01, 0.2); g.add(walk);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(30, 3), lamb(0x3f3a55)); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.012, 3.0); g.add(road);
  for (let i = 0; i < 8; i++) box(g, 0.7, 0.01, 0.12, 0xfff3c4, -6 + i * 1.8, 0.02, 3.0);
  // 건물 (창문 불빛)
  for (let i = 0; i < 9; i++) {
    const h = 1.6 + r() * 2.6, w = 1.2 + r() * 0.8;
    const tex = canvasTex(64, 128, (x, cw, ch) => { x.fillStyle = pick(r, ['#5d5486', '#6a5a8f', '#4f4a78']); x.fillRect(0, 0, cw, ch); for (let a = 0; a < 3; a++) for (let b = 0; b < 7; b++) { x.fillStyle = r() < 0.45 ? '#ffd98a' : '#3d3866'; x.fillRect(8 + a * 19, 8 + b * 17, 11, 10); } });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1), new THREE.MeshBasicMaterial({ map: tex })); b.position.set(-6.5 + i * 1.6, h / 2, -6.5 - r() * 1.5); g.add(b);
  }
  // 정류장
  const st = new THREE.Group(); for (const x of [-0.9, 0.9]) box(st, 0.07, 2.1, 0.07, 0x3a3a48, x, 1.05, -0.5);
  box(st, 2.1, 0.08, 0.9, 0x3a3a48, 0, 2.12, -0.2); const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.03), new THREE.MeshLambertMaterial({ color: 0xcde9ff, transparent: true, opacity: 0.4 })); back.position.set(0, 1.2, -0.55); st.add(back);
  box(st, 1.4, 0.06, 0.35, 0xb07a52, 0, 0.45, -0.35); st.position.set(-1.3, 0, -0.4); g.add(st);
  const sign = texPlane(g, 0.5, 0.5, canvasTex(200, 200, (x, w, h) => { x.fillStyle = '#2f6fd6'; x.beginPath(); x.arc(w / 2, h / 2, 96, 0, 7); x.fill(); x.fillStyle = '#fff'; x.font = `900 70px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('BUS', w / 2, h / 2 + 4); }), 1.4, 2.4, -0.4);
  box(g, 0.05, 2.0, 0.05, 0x3a3a48, 1.4, 1.1, -0.42);
  // 가로등
  box(g, 0.08, 2.8, 0.08, 0x2f2f3a, 2.2, 1.4, 0.1); const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), basic(0xfff0c0)); bulb.position.set(2.2, 2.85, 0.1); g.add(bulb);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(128, 128, (x, w, h) => { const gg = x.createRadialGradient(64, 64, 0, 64, 64, 64); gg.addColorStop(0, 'rgba(255,230,170,0.9)'); gg.addColorStop(1, 'rgba(255,230,170,0)'); x.fillStyle = gg; x.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.set(1.6, 1.6, 1); glow.position.copy(bulb.position); g.add(glow);
  // 별
  const sgeo = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < 90; i++) sp.push((r() - 0.5) * 20, 4 + r() * 6, -8 - r() * 3);
  sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.06 })));
  return g;
}
const SKY = {
  cafe: ['#ffe9d2', '#ffd8b8'], counter: ['#e9f3e6', '#d6ead0'], table: ['#fbe3f0', '#f6d0e4'], rain: ['#a9bdd6', '#c8d6e6'], street: ['#4a4585', '#ffb3a0'],
};
// 세트별 카메라·캐릭터 위치
const SETUP = {
  cafe:    { cam: [0, 1.6, 3.9], look: [0, 1.2, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.7, dir: 1.2, sun: 0xfff2e0 } },
  counter: { cam: [0.2, 1.55, 3.4], look: [0, 1.25, 0], fov: 40, char: [0.15, 0, 0.1], sit: false, light: { hemi: 1.7, dir: 1.2, sun: 0xffffff } },
  table:   { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xffe8f0 } },
  rain:    { cam: [-0.3, 1.55, 3.5], look: [0, 1.25, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.25, dir: 0.8, sun: 0xcfe0ff } },
  street:  { cam: [0.5, 1.3, 4.8], look: [0, 1.05, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.45, dir: 1.0, sun: 0xffd2b0 } },
};

// ---------- 엔진 ----------
const Scene3D = {
  ready: false,
  init(canvas) {
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8070, 1.7); scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xffffff, 1.2); dir.position.set(3, 7, 8); scene.add(dir);
      const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
      const r = rng(4040);
      const sets = { cafe: buildCafe(r), counter: buildCounter(r), table: buildTable(r), rain: buildRain(r), street: buildStreet(r) };
      Object.values(sets).forEach(s => { s.visible = false; scene.add(s); });
      const E = mkE(); scene.add(E);
      Object.assign(this, { renderer, scene, hemi, dir, cam, sets, E, canvas, set: null, expr: 'smile', act: 'idle', actT: 0, focus: 0, focusTarget: 0, shakeT: -9, t0: performance.now(), blinkAt: 2 });
      this.resize(); new ResizeObserver(() => this.resize()).observe(canvas.parentElement);
      this.setSet('cafe'); this.setExpr('smile');
      const loop = () => { this.frame(); this.raf = requestAnimationFrame(loop); }; loop();
      this.ready = true; return true;
    } catch (e) { console.warn('3D 끔', e); this.ready = false; return false; }
  },
  resize() {
    const p = this.canvas.parentElement, w = p.clientWidth, h = p.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix();
    // 세로로 긴 화면이면 시야를 넓혀서 캐릭터가 잘리지 않게
    this.fovK = w / h < 0.62 ? 1.18 : 1;
  },
  setSet(name) {
    if (!this.sets[name]) name = 'cafe';
    Object.entries(this.sets).forEach(([k, s]) => s.visible = k === name);
    this.set = name; const S = SETUP[name];
    const sky = SKY[name]; this.scene.background = canvasTex(4, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    this.hemi.intensity = S.light.hemi; this.dir.intensity = S.light.dir; this.dir.color.set(S.light.sun);
    const u = this.E.userData; this.E.position.set(...S.char); this.E.rotation.set(0, 0, 0);
    if (S.sit) { u.hip.position.y = 0.56; u.legs.forEach(l => l.rotation.x = -Math.PI / 2); } else { u.hip.position.y = 0.8; u.legs.forEach(l => l.rotation.x = 0); }
    this.baseHipY = u.hip.position.y; this.focus = 0; this.focusTarget = 0;
    if (name === 'counter') this.setMenu('');
  },
  setMenu(sel) { const m = this.sets.counter.userData.menu; m.material.map = menuTex(sel); m.material.needsUpdate = true; },
  setExpr(expr, act) {
    const P = this.E.userData.P; resetFace(P); (FACE[expr] || FACE.smile)(P); this.expr = expr;
    this.act = act || DEFAULT_ACT[expr] || 'idle'; this.actT = this.now();
    this.E.userData.phone.visible = this.act === 'phone';
    if (this.act === 'startle') this.shakeT = this.now();
  },
  setFocus(on) { this.focusTarget = on ? 1 : 0; },
  now() { return (performance.now() - this.t0) / 1000; },
  frame() {
    const t = this.now(), dt = Math.min(0.05, t - (this.lastT || t)); this.lastT = t;
    const E = this.E, u = E.userData, S = SETUP[this.set], a = t - this.actT;
    // 기본: 숨쉬기
    u.hip.position.y = this.baseHipY + Math.sin(t * 2.2) * 0.008;
    u.head.rotation.set(Math.sin(t * 1.3) * 0.03, Math.sin(t * 0.9) * 0.06, Math.sin(t * 1.1) * 0.03);
    E.rotation.y = 0; E.position.y = 0;
    let L = [0, 0], R = [0, 0]; // 팔 [x, z] (왼, 오)
    switch (this.act) {
      case 'cheer': L = [-2.7, -0.35]; R = [-2.7, 0.35]; E.position.y = Math.abs(Math.sin(a * 7)) * 0.07 * Math.max(0, 1 - a / 1.6); break;
      case 'wave': R = [-2.6, 0.25 + Math.sin(a * 10) * 0.3]; break;
      case 'sway': E.rotation.z = Math.sin(t * 3) * 0.04; L = [-0.2, -0.15]; R = [-0.2, 0.15]; u.head.rotation.z += Math.sin(t * 3) * 0.08; break;
      case 'shy': L = [-1.1, 0.55]; R = [-1.1, -0.55]; u.head.rotation.x = 0.18; u.head.rotation.z = 0.12; break;
      case 'turn': E.rotation.y = -0.35 * ease(a / 0.3); L = [-0.5, 0.9]; R = [-0.5, -0.9]; break;
      case 'cover': L = [-2.55, 0.05]; R = [-2.55, -0.05]; u.head.rotation.x = 0.12 + Math.sin(t * 9) * 0.02; break;
      case 'startle': L = [-1.6, -0.3]; R = [-1.6, 0.3]; E.position.y = hop(a, 0, 0.3, 0.12); break;
      case 'phone': R = [-1.35, 0.15]; L = [-0.9, -0.1]; u.head.rotation.x = 0.08; break;
      case 'point': R = [-1.9, -0.25]; u.head.rotation.y = -0.3; break;
      case 'hop': E.position.y = hop(a % 0.5, 0, 0.5, 0.1); break;
      default: L = [Math.sin(t * 1.4) * 0.05, 0]; R = [-Math.sin(t * 1.4) * 0.05, 0];
    }
    // 앉은 세트에선 팔을 테이블 위로 살짝
    if (S.sit && this.act === 'idle') { L = [-0.7, 0]; R = [-0.7, 0]; }
    const k = Math.min(1, dt * 12);
    u.arms[0].rotation.x += (L[0] - u.arms[0].rotation.x) * k; u.arms[0].rotation.z += (L[1] - u.arms[0].rotation.z) * k;
    u.arms[1].rotation.x += (R[0] - u.arms[1].rotation.x) * k; u.arms[1].rotation.z += (R[1] - u.arms[1].rotation.z) * k;
    // 눈 깜빡임
    if (t > this.blinkAt) { this.blinkAt = t + 2.2 + Math.random() * 2.5; this.blinkS = t; }
    const bk = this.blinkS ? 1 - Math.sin(clamp01((t - this.blinkS) / 0.14) * Math.PI) * 0.9 : 1;
    if (this.expr !== 'happy') u.P.eyes.forEach(e => { e.scale.y = (FACE_EYE_Y[this.expr] || 1.2) * bk; });
    // 직원 (카운터)
    if (this.set === 'counter') { const st = this.sets.counter.userData.staff; st.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; }
    // 비
    if (this.set === 'rain') { const R2 = this.sets.rain.userData.rain; R2.sp.forEach((s, i) => { s[1] -= s[3] * 2.2 * dt; s[0] -= s[3] * 0.4 * dt; if (s[1] < 1.3) { s[1] = 2.95; s[0] += 0.5; } if (s[0] < -2.3) s[0] += 4.6; const o = i * 6; R2.pos[o] = s[0]; R2.pos[o + 1] = s[1]; R2.pos[o + 2] = s[2]; R2.pos[o + 3] = s[0] - 0.06; R2.pos[o + 4] = s[1] - 0.34; R2.pos[o + 5] = s[2]; }); R2.geo.attributes.position.needsUpdate = true; }
    // 카메라: 대사 중엔 천천히 다가가고, 놀라면 흔들림
    this.focus += (this.focusTarget - this.focus) * Math.min(1, dt * 1.2);
    const f = this.focus * 0.16, cp = S.cam, lk = S.look;
    let sx = 0, sy = 0; const sa = t - this.shakeT; if (sa < 0.35) { const amp = (1 - sa / 0.35) * 0.04; sx = Math.sin(sa * 70) * amp; sy = Math.cos(sa * 55) * amp; }
    this.cam.position.set(cp[0] + (lk[0] - cp[0]) * f + sx + Math.sin(t * 0.25) * 0.04, cp[1] + (lk[1] + 0.12 - cp[1]) * f + sy, cp[2] + (lk[2] - cp[2]) * f);
    this.cam.fov = S.fov * (this.fovK || 1); this.cam.updateProjectionMatrix();
    this.cam.lookAt(lk[0], lk[1] + f * 0.25, lk[2]);
    this.renderer.render(this.scene, this.cam);
  },
};
const FACE_EYE_Y = { smile: 1.2, excited: 1.35, blush: 0.75, pout: 1.2, teary: 1.3, surprised: 1.45 };
window.Scene3D = Scene3D;
window.dispatchEvent(new Event('scene3d-loaded'));
