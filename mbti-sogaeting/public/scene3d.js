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
const FONT = '"Jua","Noto Sans KR","Apple SD Gothic Neo","Noto Sans CJK KR",sans-serif';
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

// ---------- ENFP 남자 (시안 B-1: 검은 바가지 머리 · 하늘색 티) ----------
function mkEm() {
  const p = makePerson(rng(143), { shirt: 0x8fd3ff, pants: 0x55506a }); const u = p.userData, h = u.head;
  const SK = 0xffe3cf; h.children[0].material = new THREE.MeshLambertMaterial({ color: SK, emissive: 0x2a1a10 }); u.arms.forEach(a => a.children[1].material = lamb(SK));
  h.children[1].visible = false;
  h.children.forEach(c => { const g = c.geometry && c.geometry.parameters; if (g && ((g.width === 0.05 && g.height === 0.07) || (g.width === 0.07 && g.height === 0.035))) c.visible = false; });
  const P = { eyes: [], hls: [], cheeks: [], happy: [], tears: [], brows: [] };
  for (const sx of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), basic(0x2a1a14)); e.scale.set(0.9, 1.15, 0.5); e.position.set(sx * 0.095, 0.25, 0.232); h.add(e); P.eyes.push(e);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 8), basic(0xffffff)); hl.position.set(sx * 0.095 + 0.015, 0.27, 0.252); h.add(hl); P.hls.push(hl);
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.016, 0.012), basic(0x4a2c1c)); br.position.set(sx * 0.095, 0.33, 0.232); br.rotation.z = -sx * 0.12; h.add(br);
    const ck = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20), new THREE.MeshBasicMaterial({ color: 0xff9fb8, transparent: true, opacity: 0.6 })); ck.position.set(sx * 0.15, 0.175, 0.216); ck.rotation.y = sx * 0.35; h.add(ck); P.cheeks.push(ck);
    const a = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16, Math.PI), basic(0x2a1a14)); a.position.set(sx * 0.095, 0.245, 0.238); a.visible = false; h.add(a); P.happy.push(a);
    const t = new THREE.Mesh(new THREE.SphereGeometry(0.018, 14, 10), new THREE.MeshBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0.95 })); t.scale.set(1, 1.5, 0.5); t.position.set(sx * 0.1, 0.195, 0.245); t.visible = false; h.add(t); P.tears.push(t);
  }
  P.smile = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 16, Math.PI), basic(0xc8405e)); P.smile.rotation.z = Math.PI; P.smile.position.set(0, 0.165, 0.245); h.add(P.smile);
  P.open = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 14), basic(0xb8344f)); P.open.scale.set(1, 0.75, 0.4); P.open.position.set(0, 0.16, 0.24); P.open.visible = false; h.add(P.open);
  P.tongue = new THREE.Mesh(new THREE.SphereGeometry(0.024, 14, 10), basic(0xff8fa6)); P.tongue.scale.set(1, 0.5, 0.4); P.tongue.position.set(0, 0.143, 0.25); P.tongue.visible = false; h.add(P.tongue);
  P.pout = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.009, 8, 16), basic(0xc8405e)); P.pout.position.set(0, 0.165, 0.248); P.pout.visible = false; h.add(P.pout);
  const m = smooth(0x2a2220);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.262, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.position.y = 0.25; cap.rotation.x = -0.22; h.add(cap);
  const bk = new THREE.Mesh(new THREE.SphereGeometry(0.266, 40, 24, Math.PI, Math.PI, 0, Math.PI * 0.62), m); bk.position.y = 0.25; h.add(bk);
  const bang = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), m); bang.scale.set(0.95, 0.24, 0.42); bang.position.set(0, 0.37, 0.15); h.add(bang);
  p.scale.setScalar(0.8); h.scale.setScalar(1.4); h.position.y = 0.62;
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xbfe6ff)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p;
}
// ---------- INFP (여: 좀비 롱폼 확정안 / 남: 시안 C 베레모+니트 조끼) ----------
function mkI(v) { // INFP: F = 좀비 롱폼 확정안(라벤더 가디건+헤드폰+긴 갈색머리) / A·B·C = 남자 시안
  const male=v!=='F';
  const shirt={F:0xfafafa,A:0xd9ccf5,B:0xfaf6ee,C:0xfafafa}[v], pants={F:0x8c90c0,A:0x8c90c0,B:0x9aa6c8,C:0x6f7398}[v];
  const p=makePerson(rng(201+'FABC'.indexOf(v)),{shirt,pants});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  if(v==='F'){u.arms.forEach(a=>a.children[0].material=lamb(0xcdbcf0));for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.66,0.34),lamb(0xcdbcf0));c.position.set(s*0.17,0.31,0.002);u.hip.add(c)}}
  if(v==='B'){ // 크림 후드 + 라벤더 끈
    const hood=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.07,10,24),lamb(0xeee6d8));hood.rotation.x=Math.PI/2;hood.position.set(0,0.66,-0.07);u.hip.add(hood);
    for(const s of[-1,1]){const st=new THREE.Mesh(new THREE.BoxGeometry(0.022,0.2,0.02),lamb(0xb9a4ec));st.position.set(s*0.06,0.5,0.17);u.hip.add(st)}}
  if(v==='C'){ // 셔츠 + 라벤더 니트 조끼
    const vest=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.5,0.34),lamb(0xbfaee8));vest.position.y=0.25;u.hip.add(vest);
    const col=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.06,0.05),lamb(0xffffff));col.position.set(0,0.62,0.15);u.hip.add(col)}
  const er=male?0.048:0.05, ey=0.245;
  const P={eyes:[],hls:[],lashes:[],cheeks:[]};
  for(const sx of[-1,1]){
    const e=new THREE.Mesh(new THREE.SphereGeometry(er,20,16),basic(0x2a1a14));e.scale.set(0.9,1.25,0.5);e.position.set(sx*0.095,ey,0.232);h.add(e);P.eyes.push(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(er*0.33,12,8),basic(0xffffff));hl.position.set(sx*0.095+er*0.33,ey+er*0.45,0.252);h.add(hl);P.hls.push(hl);
    if(!male){const la=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.012,0.012),basic(0x2a1a14));la.position.set(sx*0.135,ey+0.04,0.226);la.rotation.z=sx*0.6;h.add(la);P.lashes.push(la)}
    const hc0={F:0x6a4232,A:0x6a4232,B:0x3a2a26,C:0x5a3a2c}[v];
    const br=new THREE.Mesh(new THREE.BoxGeometry(male?0.055:0.05,male?0.014:0.012,0.012),basic(0x3a2418));br.position.set(sx*0.095,0.322,0.262);br.rotation.z=sx*-0.25;h.add(br); // 처진 눈썹(INFP 시그니처)
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.05,20),new THREE.MeshBasicMaterial({color:0xffa3b8,transparent:true,opacity:0.85}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);P.cheeks.push(ck)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.028,0.011,8,16,Math.PI),basic(0xd8506e));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);P.smile=sm;
  const hc={F:0x6a4232,A:0x6a4232,B:0x3a2a26,C:0x5a3a2c}[v],m=smooth(hc);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.25;h.add(cap);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI,Math.PI,0,Math.PI*(v==='F'?0.8:0.62)),m);bk.position.y=0.25;h.add(bk);
  if(v==='F'){
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.0,0.26,0.42);bang.position.set(0,0.4,0.15);h.add(bang);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.55,1.55,0.85);sd.position.set(sx*0.22,0.17,0.04);h.add(sd)}
    const band=new THREE.Mesh(new THREE.TorusGeometry(0.285,0.02,8,32,Math.PI),smooth(0xf2ecff));band.position.set(0,0.25,-0.02);h.add(band);
    for(const sx of[-1,1]){const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.06,24),smooth(0xb9a4ec));cup.rotation.z=Math.PI/2;cup.position.set(sx*0.285,0.24,-0.02);h.add(cup)}
  } else if(v==='A'){ // 몽글 웨이브 + 목에 건 헤드폰
    const r=rng(9);for(let i=0;i<16;i++){const th=r()*Math.PI*2,ph=r()*0.9;const b=new THREE.Mesh(new THREE.SphereGeometry(0.085,16,12),m);
      b.position.set(Math.sin(ph)*Math.cos(th)*0.24,0.3+Math.cos(ph)*0.22,Math.sin(ph)*Math.sin(th)*0.24-0.02);if(b.position.z>0.12)b.position.z=0.12;h.add(b)}
    for(const sx of[-1,0,1]){const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);b.scale.set(0.42,0.28,0.42);b.position.set(sx*0.1,0.385-Math.abs(sx)*0.01,0.155);b.rotation.z=-sx*0.3;h.add(b)}
    const band=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.02,8,32,Math.PI),smooth(0xf2ecff));band.rotation.x=Math.PI/2+0.2;band.position.set(0,0.66,0.02);u.hip.add(band);
    for(const sx of[-1,1]){const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.05,24),smooth(0xb9a4ec));cup.position.set(sx*0.17,0.62,0.12);cup.rotation.x=Math.PI/2;cup.rotation.z=sx*0.4;u.hip.add(cup)}
  } else if(v==='B'){ // 눈썹까지 덮는 커튼 앞머리(가르마)
    for(const sx of[-1,1]){const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);b.scale.set(0.6,0.3,0.42);b.position.set(sx*0.09,0.375,0.155);b.rotation.z=sx*0.4;h.add(b)}
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),m);sd.scale.set(0.6,1.1,0.9);sd.position.set(sx*0.235,0.24,0.06);h.add(sd)}
  } else { // C: 동글 바가지 + 연보라 베레모
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.0,0.25,0.42);bang.position.set(0,0.38,0.15);h.add(bang);
    const beret=new THREE.Mesh(new THREE.SphereGeometry(0.25,32,16),smooth(0x9d86d8));beret.scale.set(1.12,0.42,1.05);beret.position.set(0.04,0.5,-0.02);beret.rotation.z=-0.2;h.add(beret);
    const nub=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.02,0.05,8),smooth(0x9d86d8));nub.position.set(0.06,0.61,-0.02);h.add(nub);
  }
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  const mo=new THREE.Mesh(new THREE.SphereGeometry(0.045,20,14),basic(0xb8344f));mo.scale.set(1,0.75,0.4);mo.position.set(0,0.16,0.24);mo.visible=false;h.add(mo);P.open=mo;
  const tg=new THREE.Mesh(new THREE.SphereGeometry(0.024,14,10),basic(0xff8fa6));tg.scale.set(1,0.5,0.4);tg.position.set(0,0.143,0.25);tg.visible=false;h.add(tg);P.tongue=tg;
  P.happy=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.01,8,16,Math.PI),basic(0x2a1a14));a.position.set(sx*0.095,0.24,0.238);a.visible=false;h.add(a);P.happy.push(a)}
  P.tears=[];for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.018,14,10),new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:0.95}));t.scale.set(1,1.5,0.5);t.position.set(sx*0.1,0.19,0.245);t.visible=false;h.add(t);P.tears.push(t)}
  P.brows=[];P.pout=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.009,8,16),basic(0xc8405e));P.pout.position.set(0,0.165,0.248);P.pout.visible=false;h.add(P.pout);
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xe6dcff)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p}


const MODELS = { 'enfp-f': mkE, 'enfp-m': mkEm, 'infp-f': () => mkI('F'), 'infp-m': () => mkI('C') };

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
function windowWall(g, col, y = 2.0, w = 4.4, x0 = 0) {
  const win = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.9), basic(col)); win.position.set(x0, y, -2.15); g.add(win);
  for (const x of [-w / 2, -w / 6, w / 6, w / 2]) box(g, 0.08, 1.95, 0.06, 0x7a5a3a, x0 + x, y, -2.1);
  box(g, w + 0.1, 0.08, 0.1, 0x7a5a3a, x0, y - 0.97, -2.08); box(g, w + 0.1, 0.08, 0.1, 0x7a5a3a, x0, y + 0.97, -2.08);
  return win;
}
function buildCafe(r) {
  const g = new THREE.Group(); room(g, { floor: 0xd9b28a, wall: 0xf6ead8 });
  const win = windowWall(g, 0xffffff, 2.0, 3.0, -0.75);
  // 입구 문 (경첩으로 열림) + 종
  box(g, 0.95, 1.95, 0.08, 0x7a5a3a, 1.45, 0.98, -2.12);
  const hinge = new THREE.Group(); hinge.position.set(1.05, 0, -2.06); g.add(hinge);
  const dp = box(hinge, 0.78, 1.8, 0.05, 0xb07a52, 0.4, 0.92, 0); box(hinge, 0.5, 0.7, 0.01, 0, 0.4, 1.25, 0.03, basic(0xcde9ff));
  cyl(hinge, 0.03, 0.03, 0.04, 0xffd84d, 0.7, 0.9, 0.05, 8); g.userData.door = hinge;
  const bell = cyl(g, 0.05, 0.08, 0.09, 0xffd84d, 1.05, 1.98, -2.0, 10);
  const open = texPlane(g, 0.5, 0.18, canvasTex(200, 72, (x, w, h) => { x.fillStyle = '#fff'; rr(x, 0, 0, w, h, 14); x.fill(); x.fillStyle = '#e2557a'; x.font = `900 40px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('OPEN', w / 2, h / 2 + 2); }), 1.45, 1.62, -2.0);
  win.material = new THREE.MeshBasicMaterial({ map: canvasTex(512, 220, (x, w, h) => {
    const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#bfe3ff'); gg.addColorStop(1, '#e6f5ff'); x.fillStyle = gg; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) { const cx = 20 + i * 60 + r() * 20, cy = h - 30 - r() * 40, rad = 34 + r() * 26; x.fillStyle = ['#9ccf8a', '#8cc47a', '#a9d896'][i % 3]; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill(); }
    x.fillStyle = '#ffffff'; [[90, 50], [330, 36]].forEach(([cx, cy]) => { x.beginPath(); x.ellipse(cx, cy, 46, 16, 0, 0, 7); x.fill(); });
  }) });
  plant(g, -2.4, -1.4, 1.2); plant(g, 2.4, -1.2, 0.9);
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
  const menu = texPlane(g, 1.3, 0.76, menuTex(''), -0.62, 2.1, -2.15); g.userData.menu = menu;
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

// 창가 테이블: 창밖으로 지나가는 사람들(INFP '이야기 지어내기' 장면)
function buildWindowTable(r) {
  const g = new THREE.Group(); room(g, { floor: 0xe8c9b0, wall: 0xfbe3ee });
  windowWall(g, 0xcfeaff, 2.0, 4.6);
  for (let i = 0; i < 6; i++) { const b = box(g, 0.7, 0.5 + r() * 0.7, 0.05, pick(r, [0xf6d7c3, 0xe3d6f3, 0xd6ead0, 0xffe6b0]), -2.0 + i * 0.8, 1.3, -2.145); b.position.y = 1.15 + b.geometry.parameters.height / 2; }
  box(g, 4.6, 0.1, 0.05, 0xc9c2bc, 0, 1.1, -2.14);
  lampPend(g, 0, 2.9, -0.2);
  dateTable(g);
  const walk = (o, extra) => { const p = makePerson(rng(o.seed), { shirt: o.shirt, pants: o.pants }); p.scale.setScalar(0.52); p.rotation.y = Math.PI / 2; p.position.set(-3, 1.12, -2.13); p.visible = false; if (extra) extra(p); g.add(p); return p; };
  const cake = walk({ seed: 31, shirt: 0x6f8fb8, pants: 0x3c4458 }, p => { const u = p.userData;
    const bx = new THREE.Group(); box(bx, 0.55, 0.38, 0.55, 0xffffff, 0, 0, 0); box(bx, 0.57, 0.06, 0.1, 0xff8fb8, 0, 0, 0); box(bx, 0.1, 0.4, 0.57, 0xff8fb8, 0, 0, 0);
    bx.position.set(0, 0.25, 0.42); u.hip.add(bx); u.arms.forEach(a => { a.rotation.x = -1.25; }); });
  const c1 = walk({ seed: 41, shirt: 0xff9fb8, pants: 0x55506a }, p => { const fl = new THREE.Group(); for (let i = 0; i < 5; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), smooth([0xff6f9f, 0xffd84d, 0xff9fd0][i % 3])); f.position.set((i - 2) * 0.07, 0.1 + (i % 2) * 0.06, 0); fl.add(f); }
    box(fl, 0.06, 0.3, 0.06, 0x6fbf6f, 0, -0.12, 0); fl.position.set(0, -0.7, 0.15); p.userData.arms[1].add(fl); p.userData.arms[1].rotation.x = -0.9; });
  const c2 = walk({ seed: 47, shirt: 0x8fd3ff, pants: 0x3c4458 }, p => { p.userData.arms[1].rotation.x = -2.9; });
  const bang = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(64, 64, x => { x.font = '900 50px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = '#fff'; x.strokeText('!?', 32, 34); x.fillStyle = '#ff5f7a'; x.fillText('!?', 32, 34); }), transparent: true, depthWrite: false }));
  bang.scale.set(0.22, 0.22, 1); bang.visible = false; g.add(bang);
  g.userData.walkers = { cake, c1, c2, bang };
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
  // 버스 (엔딩 직전에 들어옴)
  const bus = new THREE.Group(); box(bus, 3.4, 1.3, 1.2, 0x5ccf7a, 0, 0.85, 0); box(bus, 3.42, 0.35, 1.22, 0x3fa85f, 0, 0.35, 0);
  for (let i = 0; i < 5; i++) box(bus, 0.5, 0.45, 1.24, 0, -1.25 + i * 0.6, 1.1, 0, basic(0xfff2c0));
  for (const x of [-1.1, 1.1]) for (const z of [-0.6, 0.6]) { const w = cyl(bus, 0.25, 0.25, 0.15, 0x2b2b30, x, 0.25, z, 12); w.rotation.x = Math.PI / 2; }
  const num = texPlane(bus, 0.9, 0.3, canvasTex(240, 80, (x, w, h) => { x.fillStyle = '#2b2b30'; rr(x, 0, 0, w, h, 12); x.fill(); x.fillStyle = '#ffd84d'; x.font = `900 52px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('100-1', w / 2, h / 2 + 2); }), 1.2, 1.35, 0.62);
  bus.position.set(-12, 0, 2.9); bus.visible = false; g.add(bus); g.userData.bus = bus;
  // 별
  const sgeo = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < 90; i++) sp.push((r() - 0.5) * 20, 4 + r() * 6, -8 - r() * 3);
  sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.06 })));
  return g;
}

// ---------- 엔딩 세트 ----------
function cityTex(r) { return canvasTex(1024, 128, (x, w, h) => { x.fillStyle = '#2d2a55'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const bw = 30 + r() * 50, bh = 40 + r() * 80, bx = i * 40 + r() * 10; x.fillStyle = pick(r, ['#4a4585', '#5d5486', '#3f3a70']); x.fillRect(bx, h - bh, bw, bh);
    for (let k = 0; k < 8; k++) { x.fillStyle = r() < 0.5 ? '#ffd98a' : '#2d2a55'; x.fillRect(bx + 5 + (k % 3) * 12, h - bh + 8 + Math.floor(k / 3) * 14, 6, 7); } }
  for (let i = 0; i < 12; i++) { const gx = r() * w; const g = x.createRadialGradient(gx, 30, 0, gx, 30, 30); g.addColorStop(0, 'rgba(255,220,150,.8)'); g.addColorStop(1, 'rgba(255,220,150,0)'); x.fillStyle = g; x.fillRect(gx - 30, 0, 60, 60); } }); }
function buildBus(r) {
  const g = new THREE.Group(); room(g, { floor: 0x5d6680, wall: 0xdfe6ee });
  const ct = cityTex(r); ct.wrapS = THREE.RepeatWrapping; ct.repeat.set(0.6, 1);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.0), new THREE.MeshBasicMaterial({ map: ct })); win.position.set(0, 1.75, -2.15); g.add(win); g.userData.city = ct;
  for (const x of [-2.1, -0.7, 0.7, 2.1]) box(g, 0.1, 1.1, 0.08, 0x9aa3b5, x, 1.75, -2.1);
  box(g, 2.6, 0.45, 0.55, 0x4f7bd6, 0, 0.3, -0.55); box(g, 2.6, 0.75, 0.12, 0x4f7bd6, 0, 0.85, -0.82); // 뒷좌석
  for (const x of [-1.6, 1.6]) { box(g, 0.06, 3.2, 0.06, 0xffd84d, x, 1.6, 0.3); }
  box(g, 4.4, 0.05, 0.05, 0xb8c0cc, 0, 2.55, 0.3);
  for (let i = 0; i < 5; i++) { const hd = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 8, 16), lamb(0xffffff)); hd.position.set(-1.6 + i * 0.8, 2.25, 0.3); g.add(hd); box(g, 0.02, 0.2, 0.02, 0xb8c0cc, -1.6 + i * 0.8, 2.43, 0.3); }
  box(g, 0.9, 0.22, 0.05, 0x2b2b30, 0, 2.65, -2.05);
  texPlane(g, 0.85, 0.18, canvasTex(340, 72, (x, w, h) => { x.fillStyle = '#ff9f43'; x.font = `900 44px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('다음 정류장 ▶', w / 2, h / 2 + 2); }), 0, 2.65, -2.02);
  return g;
}
function buildRoom(r, o = {}) {
  const g = new THREE.Group(); room(g, { floor: 0xe8cfb8, wall: o.wall ?? 0xf3e3f0 });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.1), new THREE.MeshBasicMaterial({ map: canvasTex(140, 110, (x, w, h) => { const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#2d2a55'); gg.addColorStop(1, '#6a5a9f'); x.fillStyle = gg; x.fillRect(0, 0, w, h); x.fillStyle = '#fff6c8'; x.beginPath(); x.arc(100, 30, 14, 0, 7); x.fill(); x.fillStyle = '#2d2a55'; x.beginPath(); x.arc(94, 26, 13, 0, 7); x.fill(); for (let i = 0; i < 14; i++) { x.fillStyle = '#fff'; x.fillRect(r() * w, r() * h * 0.7, 2, 2); } }) }));
  win.position.set(-1.1, 2.0, -2.15); g.add(win); box(g, 1.5, 0.08, 0.1, 0xffffff, -1.1, 1.42, -2.1);
  box(g, 1.6, 0.4, 1.0, 0xffffff, 1.5, 0.2, -1.4); box(g, 1.6, 0.15, 1.0, 0xffd0e4, 1.5, 0.47, -1.4); box(g, 0.5, 0.12, 0.35, 0xffffff, 1.5, 0.6, -1.75);
  box(g, 0.9, 0.06, 0.5, 0xd9b48a, -1.6, 0.75, -1.6); cyl(g, 0.04, 0.04, 0.75, 0x9a7a5a, -1.6, 0.37, -1.6, 6);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), basic(0xfff0c0)); lamp.position.set(-1.8, 1.0, -1.6); g.add(lamp);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.0, 24), lamb(0xcde9ff)); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.01, 0.2); g.add(rug);
  plant(g, 2.3, -1.6, 0.8);
  if (o.hobbies) { // 그만둔 취미 더미
    const H = new THREE.Group(); H.position.set(-1.15, 0, -0.2); g.add(H);
    const yarn = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), lamb(0xff9fcf)); yarn.position.set(0, 0.16, 0.2); H.add(yarn);
    box(H, 0.42, 0.18, 0.3, 0x5ccf7a, 0.35, 0.09, 0.1); box(H, 0.32, 0.12, 0.2, 0x4f7bd6, 0.3, 0.24, 0.1); // 신발 상자
    const bowl = cyl(H, 0.18, 0.11, 0.14, 0xffffff, -0.3, 0.07, 0.35, 14);
    const uk = new THREE.Group(); cyl(uk, 0.16, 0.16, 0.06, 0xd9a06a, 0, 0, 0, 16).rotation.x = Math.PI / 2; box(uk, 0.05, 0.4, 0.04, 0x8a5a3a, 0, 0.3, 0); uk.position.set(-0.1, 0.45, -0.1); uk.rotation.z = 0.5; H.add(uk);
    const db = new THREE.Group(); cyl(db, 0.07, 0.07, 0.08, 0x3a3a48, -0.12, 0, 0, 10).rotation.z = Math.PI / 2; cyl(db, 0.07, 0.07, 0.08, 0x3a3a48, 0.12, 0, 0, 10).rotation.z = Math.PI / 2; cyl(db, 0.02, 0.02, 0.2, 0x9aa3b5, 0, 0, 0, 6).rotation.z = Math.PI / 2; db.position.set(0.15, 0.07, 0.45); H.add(db);
    const pal = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 14), lamb(0xf6e3c0)); pal.position.set(0.4, 0.34, 0.12); pal.rotation.x = 0.2; H.add(pal);
    texPlane(g, 0.95, 0.24, canvasTex(380, 96, (x, w, h) => { x.fillStyle = '#2b2b3a'; rr(x, 0, 0, w, h, 48); x.fill(); x.fillStyle = '#fff'; x.font = `900 46px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('그만둔 취미 9개', w / 2, h / 2 + 3); }), -1.1, 1.1, 0.1);
  }
  return g;
}
function mkISTJ() {
  const p = makePerson(rng(909), { shirt: 0x3d4a6e, pants: 0x2c3040, hair: 0x1d1d24 }); const h = p.userData.head;
  for (const sx of [-1, 1]) { const gl = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 6, 16), basic(0x2b2b30)); gl.position.set(sx * 0.09, 0.25, 0.245); h.add(gl); }
  box(h, 0.06, 0.008, 0.01, 0x2b2b30, 0, 0.25, 0.25); box(h, 0.07, 0.012, 0.01, 0x8a3a3a, 0, 0.15, 0.245);
  const folder = new THREE.Group(); box(folder, 0.3, 0.38, 0.04, 0x2f6fd6, 0, 0, 0); folder.position.set(0, -0.6, 0.14); p.userData.arms[1].add(folder);
  return p;
}

const SKY = {
  cafe: ['#ffe9d2', '#ffd8b8'], counter: ['#e9f3e6', '#d6ead0'], table: ['#fbe3f0', '#f6d0e4'], rain: ['#a9bdd6', '#c8d6e6'], street: ['#4a4585', '#ffb3a0'], bus: ['#2d2a55', '#4a4585'], room: ['#f3e3f0', '#f3e3f0'], hobby: ['#efe3f6', '#efe3f6'], window: ['#fbe3f0', '#f6d0e4'],
};
// 세트별 카메라·캐릭터 위치
const SETUP = {
  cafe:    { cam: [0, 1.6, 3.9], look: [0, 1.2, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.7, dir: 1.2, sun: 0xfff2e0 } },
  counter: { cam: [0.2, 1.55, 3.4], look: [0, 1.25, 0], fov: 40, char: [0.15, 0, 0.1], sit: false, light: { hemi: 1.7, dir: 1.2, sun: 0xffffff } },
  table:   { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xffe8f0 } },
  rain:    { cam: [-0.3, 1.55, 3.5], look: [0, 1.25, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.25, dir: 0.8, sun: 0xcfe0ff } },
  bus:     { cam: [0.3, 1.45, 3.3], look: [0, 1.15, -0.4], fov: 40, char: [0, 0, -0.45], sit: true, legsOn: true, light: { hemi: 1.4, dir: 0.9, sun: 0xffe0c0 } },
  room:    { cam: [0.2, 1.4, 3.6], look: [0, 1.1, 0], fov: 40, char: [0, 0, 0.1], sit: false, light: { hemi: 1.6, dir: 1.0, sun: 0xffe8f0 } },
  window:  { cam: [0.5, 1.6, 3.7], look: [0, 1.45, 0], fov: 44, char: [0.35, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff0e0 } },
  hobby:   { cam: [-0.4, 1.4, 3.6], look: [-0.4, 1.0, 0], fov: 40, char: [0.35, 0, 0.1], sit: false, light: { hemi: 1.6, dir: 1.0, sun: 0xfff0e0 } },
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
      const sets = { cafe: buildCafe(r), counter: buildCounter(r), table: buildTable(r), rain: buildRain(r), street: buildStreet(r), bus: buildBus(r), room: buildRoom(r), hobby: buildRoom(r, { hobbies: true, wall: 0xefe3f6 }), window: buildWindowTable(r) };
      const T = mkISTJ(); T.visible = false; sets.cafe.add(T); sets.cafe.userData.istj = T;
      Object.values(sets).forEach(s => { s.visible = false; scene.add(s); });
      const E = mkE(); scene.add(E); this.models = { 'enfp-f': E }; this.modelId = 'enfp-f';
      Object.assign(this, { renderer, scene, hemi, dir, cam, sets, E, canvas, set: null, expr: 'smile', act: 'idle', actT: 0, focus: 0, focusTarget: 0, shakeT: -9, t0: performance.now(), blinkAt: 2 });
      this.ro = new ResizeObserver(() => this.resize()); this.resize(); this.ro.observe(canvas.parentElement);
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
    if (S.sit) { u.hip.position.y = 0.56; u.legs.forEach(l => { l.rotation.x = -Math.PI / 2; l.visible = !!S.legsOn; }); } else { u.hip.position.y = 0.8; u.legs.forEach(l => { l.rotation.x = 0; l.visible = true; }); }
    this.baseHipY = u.hip.position.y; this.focus = 0; this.focusTarget = 0;
    if (name === 'counter') this.setMenu('');
    this.staffT = this.notesT = this.busT = this.istjT = this.notifT = this.cakeT = this.coupleT = null; this.sets.cafe.userData.istj.visible = false; this.E.visible = true; if (this.notif) this.notif.forEach(n => n.visible = false); this.sets.street.userData.bus.visible = false; this.lastEmoteExpr = null;
  },
  attach(parent) { if (this.canvas.parentElement !== parent) { parent.prepend(this.canvas); this.ro.observe(parent); } this.resize(); },
  snapshot() { this.renderer.render(this.scene, this.cam); try { return this.renderer.domElement.toDataURL('image/jpeg', 0.9); } catch { return null; } },
  setMenu(sel) { const m = this.sets.counter.userData.menu; m.material.map = menuTex(sel); m.material.needsUpdate = true; },
  setExpr(expr, act) {
    const P = this.E.userData.P; resetFace(P); (FACE[expr] || FACE.smile)(P); this.expr = expr;
    this.act = act || DEFAULT_ACT[expr] || 'idle'; this.actT = this.now();
    this.E.userData.phone.visible = this.act === 'phone';
    if (this.act === 'startle') this.shakeT = this.now();
    if (this.act !== 'none' && expr !== this.lastEmoteExpr) this.emote(EMOTE[expr]);
    this.lastEmoteExpr = expr;
  },
  setFocus(on) { this.focusTarget = on ? 1 : 0; },
  setModel(id) {
    if (!MODELS[id] || this.modelId === id) return;
    this.models = this.models || {};
    const next = this.models[id] || (this.models[id] = MODELS[id]());
    if (this.E && this.E !== next) this.scene.remove(this.E);
    this.scene.add(next); this.E = next; this.modelId = id;
    const cur = this.set; this.set = null; if (cur) this.setSet(cur);
  },
  // ----- 첫 등장: 문 열고 뛰어 들어와서 앉기 -----
  hideChar() { this.E.visible = false; this.introPan = true; const d = this.sets.cafe.userData.door; d.rotation.y = 0; },
  enter() {
    return new Promise(res => { this.E.visible = true; this.E.userData.legs.forEach(l => l.visible = true); this.entering = { t0: this.now(), res }; this.setExpr('excited', 'none'); });
  },
  doEnter(t) {
    const en = this.entering, a = t - en.t0, u = this.E.userData, d = this.sets.cafe.userData.door;
    d.rotation.y = -1.3 * ease(a / 0.35) * (1 - ease((a - 1.6) / 0.5));
    const pts = [[1.45, -1.9], [1.2, -0.9], [0.55, 0.05], [0, 0]];
    const k = ease(clamp01((a - 0.25) / 1.35)), seg = Math.min(2, Math.floor(k * 3)), f = k * 3 - seg;
    const A = pts[seg], B = pts[seg + 1]; const x = A[0] + (B[0] - A[0]) * f, z = A[1] + (B[1] - A[1]) * f;
    this.E.position.set(x, 0, z);
    const walking = a < 1.6;
    if (walking) {
      u.hip.position.y = 0.8 + Math.abs(Math.cos(a * 11)) * 0.04; const sw = Math.sin(a * 11) * 0.6;
      u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw; u.arms[0].rotation.x = -sw * 0.7; u.arms[0].rotation.z = 0;
      u.arms[1].rotation.x = -2.6; u.arms[1].rotation.z = 0.25 + Math.sin(a * 12) * 0.35; // 손 흔들기
      this.E.rotation.y = Math.atan2(B[0] - A[0], B[1] - A[1]) * (1 - ease((a - 1.2) / 0.4));
    } else {
      const s = ease((a - 1.6) / 0.3); u.hip.position.y = 0.8 - 0.24 * s; u.legs.forEach(l => l.rotation.x = -Math.PI / 2 * s); this.E.rotation.y = 0;
    }
    if (a > 1.95) { this.E.position.set(0, 0, 0); this.E.userData.legs.forEach(l => l.visible = false); this.introPan = false; this.baseHipY = 0.56; this.entering = null; this.setExpr('excited', 'wave'); en.res(); }
    return true;
  },
  // ----- 말할 때 입 -----
  talk(on) { this.talking = on; if (!on) this.applyFace(); },
  applyFace() { const P = this.E.userData.P; resetFace(P); (FACE[this.expr] || FACE.smile)(P); },
  // ----- 머리 위 말풍선 -----
  emote(text) {
    if (!text) return;
    if (!this.emoteS) { this.emoteS = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false })); this.emoteS.renderOrder = 10; this.scene.add(this.emoteS); }
    const fs = 64, c = document.createElement('canvas'), x = c.getContext('2d'); x.font = `900 ${fs}px ${FONT}`;
    const w = Math.ceil(x.measureText(text).width + fs * 1.1), h = Math.ceil(fs * 1.5 + fs * 0.35); c.width = w + 8; c.height = h + 8; x.translate(4, 4);
    const bh = fs * 1.5; x.fillStyle = 'rgba(0,0,0,.18)'; rr(x, 0, 4, w, bh, bh / 2); x.fill(); x.fillStyle = '#ffe0f0'; rr(x, 0, 0, w, bh, bh / 2); x.fill();
    x.beginPath(); x.moveTo(w * 0.3 - 10, bh - 2); x.lineTo(w * 0.24, bh + fs * 0.33); x.lineTo(w * 0.3 + 10, bh - 2); x.fill();
    x.font = `900 ${fs}px ${FONT}`; x.fillStyle = '#8a1f5a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, bh / 2 + 4);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (this.emoteS.material.map) this.emoteS.material.map.dispose();
    this.emoteS.material.map = t; this.emoteS.material.needsUpdate = true; const k = 0.0028; this.emoteS.userData.base = [c.width * k, c.height * k]; this.emoteT = this.now();
  },
  // ----- 장면별 특별 순간 -----
  special(kind) {
    const t = this.now();
    if (kind === 'staff') this.staffT = t;
    if (kind === 'notes') this.notesT = t;
    if (kind === 'bus') { this.busT = t; this.sets.street.userData.bus.visible = true; }
    if (kind === 'istj') { this.istjT = t; this.E.visible = false; this.sets.cafe.userData.istj.visible = true; this.introPan = true; }
    if (kind === 'notif') this.notifT = t;
    if (kind === 'cakeman') this.cakeT = t;
    if (kind === 'couple') this.coupleT = t;
  },
  updSpecial(t) {
    if (this.set === 'counter' && this.staffT != null) { const st = this.sets.counter.userData.staff, u = st.userData, a = t - this.staffT;
      const on = a < 2.2; u.arms[1].rotation.x = on ? -2.7 : 0; u.arms[0].rotation.x = on ? -2.7 : 0; u.arms[1].rotation.z = on ? 0.3 : 0; u.arms[0].rotation.z = on ? -0.3 : 0;
      st.position.y = on ? Math.abs(Math.sin(a * 7)) * 0.08 : 0; }
    if (this.set === 'rain') {
      if (!this.notes) { this.notes = []; for (let i = 0; i < 7; i++) { const c = canvasTex(64, 64, (x) => { x.font = '900 52px sans-serif'; x.fillStyle = i % 2 ? '#ff8fc8' : '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = 'rgba(60,40,80,.6)'; x.strokeText(i % 2 ? '♪' : '♫', 32, 34); x.fillText(i % 2 ? '♪' : '♫', 32, 34); });
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: c, transparent: true, depthWrite: false })); sp.scale.set(0.22, 0.22, 1); sp.visible = false; this.sets.rain.add(sp); this.notes.push(sp); } }
      const a = this.notesT == null ? 99 : t - this.notesT;
      this.notes.forEach((n, i) => { const lt = ((a * 0.45) + i / 7) % 1; n.visible = a < 4.5; n.position.set(-0.6 + (i % 4) * 0.4 + Math.sin(a * 2 + i) * 0.08, 1.4 + lt * 1.1, 0.2); n.material.opacity = Math.sin(lt * Math.PI); });
    }
    if (this.set === 'window') { const W = this.sets.window.userData.walkers;
      const go = (p, t0, speed, ph, dx = 0) => { const a = t0 == null ? -1 : t - t0, x = -2.4 + a * speed + dx; p.visible = a >= 0 && x > -2.3 && x < 2.3; if (!p.visible) return x;
        const u = p.userData, sw = Math.sin(a * ph) * 0.7; p.position.x = x; u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw; p.position.y = 1.12 + Math.abs(Math.sin(a * ph)) * 0.03; return x; };
      // 케이크 아저씨: 엄청 급하게
      if (W.cake.visible || this.cakeT != null) go(W.cake, this.cakeT, 1.25, 14);
      // 300일 커플: 꽃다발 든 쪽 + 머리 짚는 쪽(까먹음)
      go(W.c1, this.coupleT, 0.55, 7, 0.38); const x2 = go(W.c2, this.coupleT, 0.55, 7);
      W.bang.visible = W.c2.visible; if (W.bang.visible) W.bang.position.set(x2, 1.92 + Math.sin(t * 6) * 0.02, -2.0);
    }
    if (this.set === 'bus') this.sets.bus.userData.city.offset.x = (t * 0.06) % 1;
    if (this.istjT != null) { // ISTJ: 정자세로 문에서 테이블까지 걸어와 꾸벅
      const T = this.sets.cafe.userData.istj, u = T.userData, a = t - this.istjT, d = this.sets.cafe.userData.door;
      d.rotation.y = -1.3 * ease(a / 0.35) * (1 - ease((a - 2.0) / 0.5));
      const k = ease(clamp01((a - 0.3) / 2.2)); T.position.set(1.45 - 1.45 * k, 0, -1.9 + 2.0 * k); T.rotation.y = a < 2.5 ? Math.atan2(-1.45, 2.0) * (1 - ease((a - 2.1) / 0.4)) : 0;
      const walk = a > 0.3 && a < 2.5, sw = walk ? Math.sin(a * 8) * 0.35 : 0;
      u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw; u.arms[0].rotation.x = -sw * 0.25; u.arms[1].rotation.x = -0.15;
      u.hip.rotation.x = a > 2.8 && a < 3.6 ? Math.sin(clamp01((a - 2.8) / 0.8) * Math.PI) * 0.45 : 0; // 꾸벅
      this.introPanX = 0.75 * (1 - ease((a - 1.4) / 1.2));
    }
    if (this.notifT != null) { // 단톡방 알림 폭발
      if (!this.notif) { this.notif = []; const glyph = ['💬', '+1', 'ㅋㅋ', '💬', '+47', '♥', '💬', 'ㅋㅋㅋ'];
        for (let i = 0; i < 12; i++) { const g = glyph[i % glyph.length]; const c = canvasTex(160, 90, (x, w, h) => { x.fillStyle = '#fff'; rr(x, 4, 4, w - 8, h - 8, 40); x.fill(); x.strokeStyle = '#ffd84d'; x.lineWidth = 6; x.stroke(); x.font = `900 44px ${FONT}`; x.fillStyle = '#3a2a00'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(g, w / 2, h / 2 + 3); });
          const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: c, transparent: true, depthWrite: false })); sp.scale.set(0.34, 0.19, 1); sp.visible = false; this.sets.room.add(sp); this.notif.push(sp); } }
      const a = t - this.notifT; this.notif.forEach((n, i) => { const lt = ((a * 0.35) + i / 12) % 1; n.visible = true; const ang = i * 2.4; n.position.set(Math.cos(ang) * (0.55 + lt * 0.5), 1.0 + lt * 1.5, 0.3 + Math.sin(ang) * 0.2); n.material.opacity = Math.sin(lt * Math.PI); });
    }
    if (this.set === 'street' && this.busT != null) { const bus = this.sets.street.userData.bus, a = t - this.busT; bus.position.x = -12 + 10.6 * ease(a / 2.4); }
  },

  now() { return (performance.now() - this.t0) / 1000; },
  frame() {
    const t = this.now(), dt = Math.min(0.05, t - (this.lastT || t)); this.lastT = t;
    const E = this.E, u = E.userData, S = SETUP[this.set], a = t - this.actT;
    // 기본: 숨쉬기
    if (this.entering) { this.doEnter(t); this.updSpecial(t); this.camAndRender(t, dt, S); return; }
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
    // 말할 때 입 벌렸다 닫기
    if (this.talking) {
      const P = u.P, m = Math.sin(t * 19) > 0.1;
      if (['excited', 'surprised', 'happy'].includes(this.expr)) { if (!P.open.userData.sy) P.open.userData.sy = P.open.scale.y; P.open.scale.y = (this.expr === 'surprised' ? 0.95 : this.expr === 'happy' ? 0.6 : 0.75) * (m ? 1 : 0.35); }
      else if (this.expr === 'pout') { P.pout.scale.setScalar(m ? 1.25 : 0.8); }
      else { P.smile.visible = !m; P.open.visible = m; P.open.scale.set(0.8, 0.55, 0.4); }
    }
    // 머리 위 말풍선
    if (this.emoteS) { const a = t - this.emoteT, b = this.emoteS.userData.base, k = a < 1.6 ? (a < 0.25 ? 1 + 0.3 * Math.sin(a / 0.25 * Math.PI) * (1 - a / 0.25) : 1) * Math.min(1, a / 0.12) : Math.max(0, 1 - (a - 1.6) / 0.2);
      this.emoteS.visible = k > 0.01; this.emoteS.scale.set(b[0] * k, b[1] * k, 1); const hp = new THREE.Vector3(); u.head.getWorldPosition(hp); this.emoteS.position.set(hp.x + 0.3, hp.y + 0.55, hp.z + 0.1); }
    this.updSpecial(t);
    // 직원 (카운터)
    if (this.set === 'counter') { const st = this.sets.counter.userData.staff; st.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; }
    // 비
    if (this.set === 'rain') { const R2 = this.sets.rain.userData.rain; R2.sp.forEach((s, i) => { s[1] -= s[3] * 2.2 * dt; s[0] -= s[3] * 0.4 * dt; if (s[1] < 1.3) { s[1] = 2.95; s[0] += 0.5; } if (s[0] < -2.3) s[0] += 4.6; const o = i * 6; R2.pos[o] = s[0]; R2.pos[o + 1] = s[1]; R2.pos[o + 2] = s[2]; R2.pos[o + 3] = s[0] - 0.06; R2.pos[o + 4] = s[1] - 0.34; R2.pos[o + 5] = s[2]; }); R2.geo.attributes.position.needsUpdate = true; }
    this.camAndRender(t, dt, S);
  },
  camAndRender(t, dt, S) {
    // 카메라: 대사 중엔 천천히 다가가고, 놀라면 흔들림
    this.focus += (this.focusTarget - this.focus) * Math.min(1, dt * 1.2);
    const f = this.focus * 0.16, lk0 = S.look, cp0 = S.cam;
    let ox = 0; if (this.introPan) { ox = 0.75; if (this.entering) ox = 0.75 * (1 - ease((t - this.entering.t0 - 0.9) / 0.9)); if (this.istjT != null) ox = this.introPanX ?? 0.75; }
    const cp = [cp0[0] + ox, cp0[1], cp0[2]], lk = [lk0[0] + ox, lk0[1], lk0[2]];
    let sx = 0, sy = 0; const sa = t - this.shakeT; if (sa < 0.35) { const amp = (1 - sa / 0.35) * 0.04; sx = Math.sin(sa * 70) * amp; sy = Math.cos(sa * 55) * amp; }
    this.cam.position.set(cp[0] + (lk[0] - cp[0]) * f + sx + Math.sin(t * 0.25) * 0.04, cp[1] + (lk[1] + 0.12 - cp[1]) * f + sy, cp[2] + (lk[2] - cp[2]) * f);
    this.cam.fov = S.fov * (this.fovK || 1); this.cam.updateProjectionMatrix();
    this.cam.lookAt(lk[0], lk[1] + f * 0.25, lk[2]);
    this.renderer.render(this.scene, this.cam);
  },
};
const EMOTE = { excited: '!!', surprised: '!?', blush: '♥', teary: '흐엉', pout: '흥', happy: '♪' };
const FACE_EYE_Y = { smile: 1.2, excited: 1.35, blush: 0.75, pout: 1.2, teary: 1.3, surprised: 1.45 };
window.Scene3D = Scene3D;
window.dispatchEvent(new Event('scene3d-loaded'));
