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


// ---------- ISFP (여: 좀비 롱폼 확정 B안 민트 후드 / 남: 시안 A 커플룩) — 바보털은 지웅 요청으로 뺌 ----------
function mkS(v){ // ISFP: F = 좀비 롱폼 확정 B안(민트 후드+바보털) / A·B·C = 남자 시안
  const male=v!=='F';
  const shirt={F:0xa6e8cc,A:0xa6e8cc,B:0xf3ead8,C:0xcfe9a8}[v], pants={F:0x9a9ea6,A:0x9a9ea6,B:0x8a8f9c,C:0x6c7f9a}[v];
  const p=makePerson(rng(301+'FABC'.indexOf(v)),{shirt,pants});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  const dk=c=>new THREE.Color(c).multiplyScalar(0.92).getHex();
  if(v==='F'||v==='A'){ // 후드 + 끈 + 캥거루 주머니
    const hood=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.07,10,24),lamb(dk(shirt)));hood.rotation.x=Math.PI/2;hood.position.set(0,0.66,-0.07);u.hip.add(hood);
    for(const s of[-1,1]){const st=new THREE.Mesh(new THREE.BoxGeometry(0.022,0.2,0.02),lamb(0xffffff));st.position.set(s*0.06,0.5,0.17);u.hip.add(st)}
    const pk=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.13,0.02),lamb(dk(shirt)));pk.position.set(0,0.12,0.165);u.hip.add(pk)}
  if(v==='B'){ // 오버핏 니트 골지
    for(let i=0;i<5;i++){const rb=new THREE.Mesh(new THREE.BoxGeometry(0.012,0.6,0.01),lamb(dk(shirt)));rb.position.set(-0.16+i*0.08,0.32,0.162);u.hip.add(rb)}}
  if(v==='C'){ // 체크 셔츠 (가로·세로 줄)
    for(let i=0;i<3;i++){const hz=new THREE.Mesh(new THREE.BoxGeometry(0.53,0.03,0.33),lamb(0xa6cf7e));hz.position.y=0.12+i*0.2;u.hip.add(hz);
      const vt=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.64,0.33),lamb(0xa6cf7e));vt.position.set(-0.15+i*0.15,0.32,0);u.hip.add(vt)}
    const col=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.06,0.05),lamb(0xf6f6f2));col.position.set(0,0.62,0.15);u.hip.add(col)}
  const hc={F:0x9a6a48,A:0x7a5238,B:0x3a2a22,C:0x6a4a34}[v],m=smooth(hc);
  const P={eyes:[],hls:[],lashes:[],cheeks:[]};
  for(const sx of[-1,1]){
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.046,20,16),basic(0x2a1a14));e.scale.set(0.9,1.2,0.5);e.position.set(sx*0.095,0.245,0.232);h.add(e);P.eyes.push(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.015,12,8),basic(0xffffff));hl.position.set(sx*0.095+0.015,0.266,0.252);h.add(hl);P.hls.push(hl);
    const br=new THREE.Mesh(new THREE.BoxGeometry(male?0.055:0.05,male?0.014:0.012,0.012),basic(0x3a2418));br.position.set(sx*0.095,0.322,0.262);br.rotation.z=sx*-0.1;h.add(br);
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.045,20),new THREE.MeshBasicMaterial({color:0xffa8a8,transparent:true,opacity:0.85}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);P.cheeks.push(ck)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.011,8,16,Math.PI),basic(0xd8506e));sm.rotation.z=Math.PI;sm.position.set(0,0.165,0.245);h.add(sm);P.smile=sm;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.24;h.add(cap);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.266,40,24,Math.PI,Math.PI,0,Math.PI*(v==='F'?0.66:0.6)),m);bk.position.y=0.25;h.add(bk);
  const ahoge=()=>{const ah=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.018,8,20,Math.PI*1.2),m);ah.position.set(0.02,0.56,0.02);ah.rotation.set(0,0.3,0.6);h.add(ah)};
  if(v==='F'||v==='A'){
    for(const sx of[-1,0,1]){const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);b.scale.set(0.4,0.3,0.42);b.position.set(sx*0.1,0.385-Math.abs(sx)*0.01,0.155);b.rotation.z=-sx*0.3;h.add(b)}
    if(v==='F')for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.09,20,14),m);sd.scale.set(0.6,1.1,0.85);sd.position.set(sx*0.22,0.2,0.04);h.add(sd)}
  } else if(v==='B'){ // 버킷햇
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.0,0.24,0.42);bang.position.set(0,0.37,0.15);h.add(bang);
    const crown=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.27,0.2,32),smooth(0xb9dca0));crown.position.set(0,0.52,-0.01);crown.rotation.x=-0.12;h.add(crown);
    const brim=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.38,0.025,32),smooth(0xa9cf8e));brim.position.set(0,0.43,0.0);brim.rotation.x=-0.12;h.add(brim);
  } else { // C: 부스스한 앞머리 (뾰족 끝이 사방으로)
    for(const [x,rz] of [[-0.15,0.7],[-0.08,0.35],[0,0.05],[0.08,-0.3],[0.15,-0.65]]){const b=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.2,12),m);b.position.set(x,0.37,0.19-Math.abs(x)*0.35);b.rotation.set(0.5,0,Math.PI+rz*0.5);h.add(b)}
    for(const [x,z,rz,rx] of [[-0.12,0.05,0.6,-0.3],[0.02,0.0,-0.1,-0.5],[0.14,0.02,-0.7,-0.3],[0.06,-0.14,-0.3,-1.2]]){const t=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.16,12),m);t.position.set(x,0.5,z);t.rotation.set(rx,0,rz);h.add(t)}
    ahoge();
  }
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  const mo=new THREE.Mesh(new THREE.SphereGeometry(0.045,20,14),basic(0xb8344f));mo.scale.set(1,0.75,0.4);mo.position.set(0,0.16,0.24);mo.visible=false;h.add(mo);P.open=mo;
  const tg=new THREE.Mesh(new THREE.SphereGeometry(0.024,14,10),basic(0xff8fa6));tg.scale.set(1,0.5,0.4);tg.position.set(0,0.143,0.25);tg.visible=false;h.add(tg);P.tongue=tg;
  P.happy=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.01,8,16,Math.PI),basic(0x2a1a14));a.position.set(sx*0.095,0.24,0.238);a.visible=false;h.add(a);P.happy.push(a)}
  P.tears=[];for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.018,14,10),new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:0.95}));t.scale.set(1,1.5,0.5);t.position.set(sx*0.1,0.19,0.245);t.visible=false;h.add(t);P.tears.push(t)}
  P.brows=[];P.pout=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.009,8,16),basic(0xc8405e));P.pout.position.set(0,0.165,0.248);P.pout.visible=false;h.add(P.pout);
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xd8f6ea)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p}


// ---------- ISTP (남: 좀비 롱폼 확정안 / 여: 시안 A 단발 + 같은 바람막이) — 눈은 납작한 눈 + 일자 라인(P.lids) ----------
function mkT(v){ // ISTP: Z = 좀비 롱폼 확정안(남) / A·B·C = 여자 시안
  const fem=v!=='Z';
  const shirt={Z:0x2a2a30,A:0x2a2a30,B:0x9aa0aa,C:0xf6f6f2}[v], pants={Z:0x3d4e6a,A:0x3d4e6a,B:0x2a2a30,C:0x4a5f86}[v];
  const p=makePerson(rng(401+'ZABC'.indexOf(v)),{shirt,pants});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  const M=(w,hh,d,c,x,y,z,par=u.hip)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),lamb(c));b.position.set(x,y,z);par.add(b);return b};
  if(v==='Z'||v==='A'){ // 검은 바람막이 + 빨간 줄 + 지퍼
    M(0.015,0.6,0.02,0xb8b8c0,0.04,0.32,0.165);for(const s of[-1,1]){const c=M(0.14,0.08,0.06,0x202026,s*0.1,0.64,0.12);c.rotation.z=s*0.3}
    M(0.53,0.04,0.33,0xc24a4a,0,0.2,0)}
  if(v==='B'){ // 회색 후드집업 + 안에 검은 티
    M(0.16,0.5,0.02,0x2a2a30,0,0.32,0.162);for(const s of[-1,1])M(0.022,0.18,0.02,0xffffff,s*0.1,0.5,0.172);
    const hood=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.07,10,24),lamb(0x8a909a));hood.rotation.x=Math.PI/2;hood.position.set(0,0.66,-0.07);u.hip.add(hood)}
  if(v==='C'){ // 흰 티 + 열린 데님 오버셔츠
    u.arms.forEach(a=>a.children[0].material=lamb(0x6a87b8));for(const s of[-1,1])M(0.19,0.66,0.34,0x6a87b8,s*0.175,0.31,0.002)}
  const hc={Z:0x18161a,A:0x18161a,B:0x2a2020,C:0x1e1a1c}[v],m=smooth(hc);
  const P={eyes:[],hls:[],lashes:[],cheeks:[],lids:[]};
  for(const sx of[-1,1]){
    const ex=0.095;const e=new THREE.Mesh(new THREE.SphereGeometry(0.043,20,16),basic(0x2a1a14));e.scale.set(0.95,0.72,0.5);e.userData.bs=e.scale.clone();e.position.set(sx*ex,0.244,0.232);h.add(e);P.eyes.push(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.014,12,8),basic(0xffffff));hl.position.set(sx*ex+0.014,0.252,0.252);h.add(hl);P.hls.push(hl);
    { // 졸린 듯 시크한 눈: 위아래로 납작한 눈 + 위에 일자 라인 (웃음·놀람에선 숨김)
      const ln=new THREE.Mesh(new THREE.BoxGeometry(0.092,0.013,0.012),basic(0x1a1210));ln.position.set(sx*ex,0.272,0.256);h.add(ln);P.lids.push(ln);
      if(fem){const la=new THREE.Mesh(new THREE.BoxGeometry(0.026,0.011,0.011),basic(0x1a1210));la.position.set(sx*(ex+0.05),0.277,0.25);la.rotation.z=sx*0.5;h.add(la);P.lids.push(la)}
    }
    const br=new THREE.Mesh(new THREE.BoxGeometry(fem?0.058:0.065,fem?0.012:0.014,0.012),basic(0x18161a));br.position.set(sx*0.095,0.318,0.262);br.rotation.z=0;h.add(br);
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.04,20),new THREE.MeshBasicMaterial({color:0xff9fb8,transparent:true,opacity:0.45}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);P.cheeks.push(ck)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.024,0.01,8,16,Math.PI),basic(0xb85060));sm.rotation.z=Math.PI;sm.position.set(0,0.162,0.246);h.add(sm);P.smile=sm;
  if(v==='Z'){const ba=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.028,0.006),basic(0xf6d6ae));ba.position.set(0.14,0.2,0.222);ba.rotation.set(0,0.35,0.45);h.add(ba)}
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.262,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.22;h.add(cap);
  if(v==='Z'){
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,24,Math.PI,Math.PI,0,Math.PI*0.6),m);bk.position.y=0.25;h.add(bk);
    for(const sx of[-1,1]){const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);b.scale.set(0.55,0.28,0.42);b.position.set(sx*0.08,0.39,0.155);b.rotation.z=sx*0.35;h.add(b)}
  } else if(v==='A'){ // 매끈한 단발 + 일자 앞머리, 끝은 안으로 말림
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.272,40,24,Math.PI,Math.PI,0,Math.PI*0.8),m);bk.position.y=0.25;h.add(bk);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.6,1.45,1.0);sd.position.set(sx*0.225,0.15,0.03);h.add(sd);
      const curl=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),m);curl.scale.set(0.9,0.6,1.0);curl.position.set(sx*0.2,0.02,0.06);h.add(curl)}
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.02,0.24,0.42);bang.position.set(0,0.39,0.155);h.add(bang);
  } else if(v==='B'){ // 긴 머리 하나로 묶음 + 잔머리
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI,Math.PI,0,Math.PI*0.66),m);bk.position.y=0.25;h.add(bk);
    const tie=new THREE.Mesh(new THREE.TorusGeometry(0.03,0.012,8,14),smooth(0x22222a));tie.position.set(0.2,0.06,0.06);tie.rotation.set(1.2,0,0.4);h.add(tie);
    const tail=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),m);tail.scale.set(0.8,2.1,0.8);tail.position.set(0.23,-0.08,0.1);tail.rotation.z=0.25;h.add(tail);
    const lead=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),m);lead.scale.set(0.7,1.4,0.8);lead.position.set(0.21,0.12,0.04);h.add(lead);
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.0,0.24,0.42);bang.position.set(0,0.395,0.15);h.add(bang);
    for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,10),m);w.scale.set(0.5,1.8,0.6);w.position.set(sx*0.2,0.24,0.14);h.add(w)}
  } else { // C: 귀 보이는 숏컷 + 실버 귀걸이
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI,Math.PI,0,Math.PI*0.6),m);bk.position.y=0.25;h.add(bk);
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.25,0.42);bang.position.set(0.04,0.395,0.15);bang.rotation.z=0.2;h.add(bang);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),m);sd.scale.set(0.5,1.1,0.9);sd.position.set(sx*0.24,0.27,0.04);h.add(sd);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(0.022,0.006,8,16),smooth(0xd8dce4));ring.position.set(sx*0.262,0.13,0.03);ring.rotation.y=Math.PI/2;h.add(ring)}
  }
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  const mo=new THREE.Mesh(new THREE.SphereGeometry(0.04,20,14),basic(0xb8344f));mo.scale.set(1,0.7,0.4);mo.position.set(0,0.16,0.24);mo.visible=false;h.add(mo);P.open=mo;
  const tg=new THREE.Mesh(new THREE.SphereGeometry(0.022,14,10),basic(0xff8fa6));tg.scale.set(1,0.5,0.4);tg.position.set(0,0.145,0.25);tg.visible=false;h.add(tg);P.tongue=tg;
  P.happy=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.01,8,16,Math.PI),basic(0x2a1a14));a.position.set(sx*0.095,0.24,0.264);a.visible=false;h.add(a);P.happy.push(a)}
  P.tears=[];for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.018,14,10),new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:0.95}));t.scale.set(1,1.5,0.5);t.position.set(sx*0.1,0.19,0.245);t.visible=false;h.add(t);P.tears.push(t)}
  P.brows=[];P.pout=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.009,8,16),basic(0xc8405e));P.pout.position.set(0,0.165,0.248);P.pout.visible=false;h.add(P.pout);
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xdfe4ee)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p}

// ---------- INTJ (여: 옆가르마·남색 셔츠·안경 / 남: 낮게 묶은 머리·터틀넥·안경) ----------
function mkJ(v){ // INTJ: 스타일 M(옆가르마·남색 셔츠) / B(낮은 똥머리·터틀넥). F = M 스타일 여자(확정), N = B 스타일 남자(확정)
  const fem=v!=='M'&&v!=='N'; v={F:'M',N:'B'}[v]||v;
  const shirt={M:0x4a5aa8,A:0x4a5aa8,B:0x55505e,C:0xe9dcc4}[v], pants={M:0x2c3040,A:0x2c3040,B:0x2c3040,C:0x3a3a48}[v];
  const p=makePerson(rng(501+'MABC'.indexOf(v)),{shirt,pants});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  const M=(w,hh,d,c,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),lamb(c));b.position.set(x,y,z);u.hip.add(b);return b};
  if(v==='M'||v==='A')M(0.3,0.06,0.05,0xffffff,0,0.62,0.15); // 흰 깃
  if(v==='B'){for(let i=0;i<5;i++)M(0.012,0.6,0.01,0x48434f,-0.16+i*0.08,0.32,0.162);M(0.3,0.07,0.06,0x48434f,0,0.63,0.13)} // 골지 니트 + 터틀넥
  if(v==='C'){u.arms.forEach(a=>a.children[0].material=lamb(0xd8c8a8));for(const s of[-1,1])M(0.19,0.66,0.34,0xd8c8a8,s*0.175,0.31,0.002);M(0.14,0.5,0.02,0xffffff,0,0.36,0.165)} // 베이지 재킷 + 흰 이너
  const hc={M:0x1d1d26,A:0x1d1d26,B:0x2a2020,C:0x3a2a24}[v],m=smooth(hc);
  const P={eyes:[],hls:[],lashes:[],cheeks:[],lids:[]};
  for(const sx of[-1,1]){
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.042,20,16),basic(0x2a1a14));e.scale.set(0.9,1.15,0.5);e.userData.bs=e.scale.clone();e.position.set(sx*0.09,0.25,0.232);h.add(e);P.eyes.push(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.014,12,8),basic(0xffffff));hl.position.set(sx*0.09+0.014,0.268,0.252);h.add(hl);P.hls.push(hl);
    if(fem){const la=new THREE.Mesh(new THREE.BoxGeometry(0.026,0.011,0.011),basic(0x2a1a14));la.position.set(sx*0.13,0.29,0.24);la.rotation.z=sx*0.5;h.add(la);P.lashes.push(la)}
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.013,0.012),basic(0x1d1d26));br.position.set(sx*0.09,0.33,0.262);h.add(br);
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.04,20),new THREE.MeshBasicMaterial({color:0xff9fb8,transparent:true,opacity:0.5}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);P.cheeks.push(ck)}
  { // 얇은 동그란 안경
    const gm=smooth(v==='C'?0xb08a5a:0x22222a);
    for(const sx of[-1,1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(0.062,0.009,8,28),gm);ring.position.set(sx*0.09,0.252,0.262);h.add(ring)}
    const bridge=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.009,0.009),gm);bridge.position.set(0,0.26,0.266);h.add(bridge)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.022,0.009,8,16,Math.PI),basic(0xb85060));sm.rotation.z=Math.PI;sm.position.set(0,0.162,0.246);h.add(sm);P.smile=sm;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.262,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.28;h.add(cap);
  if(v==='M'){
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,24,Math.PI,Math.PI,0,Math.PI*0.6),m);bk.position.y=0.25;h.add(bk);
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.24,0.42);bang.position.set(0.05,0.415,0.14);bang.rotation.z=0.22;h.add(bang);
  } else if(v==='A'){ // 긴 생머리 + 옆가르마
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.27,40,24,Math.PI,Math.PI,0,Math.PI*0.85),m);bk.position.y=0.25;h.add(bk);
    const back=new THREE.Mesh(new THREE.SphereGeometry(0.2,24,16),m);back.scale.set(1.25,1.7,0.6);back.position.set(0,-0.02,-0.12);h.add(back);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.5,2.0,0.85);sd.position.set(sx*0.225,0.08,0.03);h.add(sd)}
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.24,0.42);bang.position.set(0.05,0.405,0.145);bang.rotation.z=0.25;h.add(bang);
  } else if(v==='B'){ // 낮은 번(똥머리) + 앞머리 없이 넘김
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI,Math.PI,0,Math.PI*0.7),m);bk.position.y=0.25;h.add(bk);
    const bun=new THREE.Mesh(new THREE.SphereGeometry(0.1,20,14),m);bun.position.set(0,0.12,-0.29);h.add(bun);
    for(const sx of[-1,1]){const sw=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);sw.scale.set(0.6,0.2,0.4);sw.position.set(sx*0.09,0.425,0.12);sw.rotation.z=-sx*0.35;h.add(sw)}
    for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,10),m);w.scale.set(0.5,1.7,0.6);w.position.set(sx*0.21,0.25,0.13);h.add(w)}
  } else { // C: C컬 단발
    const bk=new THREE.Mesh(new THREE.SphereGeometry(0.272,40,24,Math.PI,Math.PI,0,Math.PI*0.8),m);bk.position.y=0.25;h.add(bk);
    for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.6,1.3,1.0);sd.position.set(sx*0.225,0.15,0.03);h.add(sd);
      const curl=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),m);curl.scale.set(0.9,0.6,1.0);curl.position.set(sx*0.19,0.03,0.07);h.add(curl)}
    const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.9,0.24,0.42);bang.position.set(-0.05,0.405,0.145);bang.rotation.z=-0.25;h.add(bang);
  }
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  const mo=new THREE.Mesh(new THREE.SphereGeometry(0.04,20,14),basic(0xb8344f));mo.scale.set(1,0.7,0.4);mo.position.set(0,0.16,0.24);mo.visible=false;h.add(mo);P.open=mo;
  const tg=new THREE.Mesh(new THREE.SphereGeometry(0.022,14,10),basic(0xff8fa6));tg.scale.set(1,0.5,0.4);tg.position.set(0,0.145,0.25);tg.visible=false;h.add(tg);P.tongue=tg;
  P.happy=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(0.033,0.01,8,16,Math.PI),basic(0x2a1a14));a.position.set(sx*0.09,0.245,0.24);a.visible=false;h.add(a);P.happy.push(a)}
  P.tears=[];for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.018,14,10),new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:0.95}));t.scale.set(1,1.5,0.5);t.position.set(sx*0.1,0.19,0.245);t.visible=false;h.add(t);P.tears.push(t)}
  P.brows=[];P.pout=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.009,8,16),basic(0xc8405e));P.pout.position.set(0,0.165,0.248);P.pout.visible=false;h.add(P.pout);
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xdfe6ff)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p}

// ---------- INTP (남·여 둘 다 시안 A: 회색 후드 — 남 부스스한 머리, 여 집게핀 올림머리) ----------
function mkP(v){ // INTP 시안: MA·MB·MC 남자 / FA·FB·FC 여자
  const fem=v[0]==='F', st=v[1];
  const shirt={A:0xa9a9b8,B:0x7f8fb8,C:0xb9a8e0}[st], pants={A:0x3a3a48,B:0x4a5070,C:0x5a5a6a}[st];
  const p=makePerson(rng(601+'ABC'.indexOf(st)+(fem?10:0)),{shirt,pants});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  const M=(w,hh,d,c,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),lamb(c));b.position.set(x,y,z);u.hip.add(b);return b};
  const dk=c=>new THREE.Color(c).multiplyScalar(0.9).getHex();
  if(st==='A'){ // 회색 후드 + 큰 주머니
    const hood=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.07,10,24),lamb(dk(shirt)));hood.rotation.x=Math.PI/2;hood.position.set(0,0.66,-0.07);u.hip.add(hood);
    for(const s of[-1,1])M(0.022,0.2,0.02,0xffffff,s*0.06,0.5,0.17);M(0.3,0.13,0.02,dk(shirt),0,0.12,0.165)}
  if(st==='B'){ // 체크 셔츠 (열림) + 흰 티
    for(const s of[-1,1])M(0.19,0.66,0.34,shirt,s*0.175,0.31,0.002);M(0.14,0.6,0.02,0xf6f6f2,0,0.32,0.165);
    for(let i=0;i<3;i++){M(0.53,0.025,0.345,0x5a6a98,0,0.12+i*0.2,0)}}
  if(st==='C'){ // 연보라 오버핏 맨투맨 + 이어폰 줄
    M(0.3,0.05,0.05,dk(shirt),0,0.63,0.15);for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,0.4,6),basic(0xffffff));w.position.set(s*0.07,0.48,0.17);w.rotation.z=s*0.2;u.hip.add(w)}}
  const hc=fem?{A:0x4a3428,B:0x2a2020,C:0x5a3a2a}[st]:{A:0x3a2a22,B:0x2a2020,C:0x4a3428}[st],m=smooth(hc);
  const P={eyes:[],hls:[],lashes:[],cheeks:[],lids:[]};
  for(const sx of[-1,1]){ // 동그란 눈인데 시선이 살짝 위 (딴생각 중)
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.045,20,16),basic(0x2a1a14));e.scale.set(0.9,1.15,0.5);e.userData.bs=e.scale.clone();e.position.set(sx*0.095,0.25,0.232);h.add(e);P.eyes.push(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.016,12,8),basic(0xffffff));hl.position.set(sx*0.095+0.008,0.275,0.252);h.add(hl);P.hls.push(hl);
    if(fem){const la=new THREE.Mesh(new THREE.BoxGeometry(0.026,0.011,0.011),basic(0x2a1a14));la.position.set(sx*0.135,0.29,0.24);la.rotation.z=sx*0.5;h.add(la);P.lashes.push(la)}
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.055,0.012,0.012),basic(0x3a2418));br.position.set(sx*0.095,0.322,0.262);br.rotation.z=sx*(sx>0?0.15:-0.05);h.add(br); // 한쪽만 올라간 눈썹(갸웃)
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.042,20),new THREE.MeshBasicMaterial({color:0xffa3b8,transparent:true,opacity:0.6}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);P.cheeks.push(ck)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.022,0.009,8,16,Math.PI),basic(0xc8506e));sm.rotation.z=Math.PI;sm.position.set(0.015,0.164,0.246);h.add(sm);P.smile=sm;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=-0.24;h.add(cap);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI,Math.PI,0,Math.PI*(fem&&st!=='A'?0.85:0.64)),m);bk.position.y=0.25;h.add(bk);
  const tufts=(n,seed)=>{const r=rng(seed);for(let i=0;i<n;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.14,10),m);const a=(i/n)*Math.PI*1.6-0.8;t.position.set(Math.sin(a)*0.2,0.47+r()*0.04,Math.cos(a)*0.1-0.05);t.rotation.set(-0.3+r()*0.6,0,-Math.sin(a)*0.9+(r()-0.5)*0.5);h.add(t)}};
  if(!fem){
    if(st==='A'){ // 부스스한 자다 깬 머리
      for(const sx of[-1,0,1]){const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);b.scale.set(0.42,0.3,0.42);b.position.set(sx*0.1,0.385,0.155);b.rotation.z=-sx*0.3;h.add(b)}tufts(6,3);
    } else if(st==='B'){ // 까치머리 (뒤통수 한 가닥 뻗침)
      const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.25,0.42);bang.position.set(0.03,0.4,0.15);bang.rotation.z=0.15;h.add(bang);
      const t=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.16,10),m);t.position.set(-0.08,0.52,-0.1);t.rotation.z=0.6;h.add(t);
    } else { // 눈썹 덮는 덥수룩 앞머리
      const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.05,0.3,0.44);bang.position.set(0,0.37,0.155);h.add(bang);
      for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),m);sd.scale.set(0.6,1.2,0.9);sd.position.set(sx*0.235,0.24,0.05);h.add(sd)}
    }
  } else {
    if(st==='A'){ // 대충 올려 묶은 집게핀 머리 + 잔머리
      const bun=new THREE.Mesh(new THREE.SphereGeometry(0.11,18,12),m);bun.scale.set(1.2,0.9,0.9);bun.position.set(0,0.5,-0.14);h.add(bun);
      const clip=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.05,0.05),smooth(0xb9a8e0));clip.position.set(0,0.5,-0.04);h.add(clip);
      for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,10),m);w.scale.set(0.5,1.9,0.6);w.position.set(sx*0.2,0.25,0.14);h.add(w)}
      const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.22,0.42);bang.position.set(0.02,0.41,0.15);bang.rotation.z=0.18;h.add(bang);
    } else if(st==='B'){ // 긴 생머리 + 일자 앞머리
      const back=new THREE.Mesh(new THREE.SphereGeometry(0.2,24,16),m);back.scale.set(1.25,1.7,0.6);back.position.set(0,-0.02,-0.12);h.add(back);
      for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.5,2.0,0.85);sd.position.set(sx*0.225,0.08,0.03);h.add(sd)}
      const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(1.02,0.24,0.42);bang.position.set(0,0.39,0.155);h.add(bang);
    } else { // 단발 + 귀에 꽂은 연필
      for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.6,1.3,1.0);sd.position.set(sx*0.225,0.15,0.03);h.add(sd)}
      const bang=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);bang.scale.set(0.95,0.25,0.42);bang.position.set(-0.03,0.4,0.15);bang.rotation.z=-0.15;h.add(bang);
      const pen=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.22,8),smooth(0xffd84d));pen.position.set(0.27,0.3,0.0);pen.rotation.set(0,0,1.2);h.add(pen);
      const tip=new THREE.Mesh(new THREE.ConeGeometry(0.012,0.03,8),smooth(0xf3d6b0));tip.position.set(0.37,0.34,0.0);tip.rotation.z=-0.37;h.add(tip);
    }
  }
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  const mo=new THREE.Mesh(new THREE.SphereGeometry(0.04,20,14),basic(0xb8344f));mo.scale.set(1,0.7,0.4);mo.position.set(0,0.16,0.24);mo.visible=false;h.add(mo);P.open=mo;
  const tg=new THREE.Mesh(new THREE.SphereGeometry(0.022,14,10),basic(0xff8fa6));tg.scale.set(1,0.5,0.4);tg.position.set(0,0.145,0.25);tg.visible=false;h.add(tg);P.tongue=tg;
  P.happy=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(0.034,0.01,8,16,Math.PI),basic(0x2a1a14));a.position.set(sx*0.095,0.245,0.24);a.visible=false;h.add(a);P.happy.push(a)}
  P.tears=[];for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.018,14,10),new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:0.95}));t.scale.set(1,1.5,0.5);t.position.set(sx*0.1,0.19,0.245);t.visible=false;h.add(t);P.tears.push(t)}
  P.brows=[];P.pout=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.009,8,16),basic(0xc8405e));P.pout.position.set(0,0.165,0.248);P.pout.visible=false;h.add(P.pout);
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xe6dcff)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p}

// ===== 공용 캐릭터 빌더 (남은 유형 시안용) =====
// o: {fem, shirt, pants, hair, outfit, inner, accent, style, eyes, glasses, ring, pin, seed}
function mkGen(o){
  const fem=!!o.fem, shirt=o.shirt, pants=o.pants??0x3a3a48;
  const p=makePerson(rng(o.seed||700),{shirt,pants});const u=p.userData,h=u.head;
  const SK=0xffe3cf;h.children[0].material=new THREE.MeshLambertMaterial({color:SK,emissive:0x2a1a10});u.arms.forEach(a=>a.children[1].material=lamb(SK));
  h.children[1].visible=false;
  h.children.forEach(c=>{const g=c.geometry&&c.geometry.parameters;if(g&&((g.width===0.05&&g.height===0.07)||(g.width===0.07&&g.height===0.035)))c.visible=false});
  const M=(w,hh,d,c,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),lamb(c));b.position.set(x,y,z);u.hip.add(b);return b};
  const dk=(c,k=0.9)=>new THREE.Color(c).multiplyScalar(k).getHex();
  const inner=o.inner??0xf6f6f2, acc=o.accent??dk(shirt,0.8);
  switch(o.outfit){
    case 'hood': {const hood=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.07,10,24),lamb(dk(shirt)));hood.rotation.x=Math.PI/2;hood.position.set(0,0.66,-0.07);u.hip.add(hood);for(const s of[-1,1])M(0.022,0.2,0.02,0xffffff,s*0.06,0.5,0.17);M(0.3,0.13,0.02,dk(shirt),0,0.12,0.165);break}
    case 'collar': M(0.3,0.06,0.05,inner,0,0.62,0.15);break;
    case 'tie': M(0.3,0.06,0.05,inner,0,0.62,0.15);M(0.07,0.4,0.02,acc,0,0.38,0.17);M(0.09,0.06,0.03,acc,0,0.59,0.17);break;
    case 'knit': for(let i=0;i<5;i++)M(0.012,0.6,0.01,dk(shirt),-0.16+i*0.08,0.32,0.162);M(0.3,0.07,0.06,dk(shirt),0,0.63,0.13);break;
    case 'vest': M(0.3,0.06,0.05,inner,0,0.62,0.15);M(0.54,0.48,0.34,acc,0,0.24,0);u.arms.forEach(a=>a.children[0].material=lamb(shirt));break;
    case 'cardigan': case 'jacket': {u.arms.forEach(a=>a.children[0].material=lamb(shirt));const tor=o.outfit==='jacket';for(const s of[-1,1])M(0.19,0.66,0.34,shirt,s*0.175,0.31,0.002);M(0.14,0.6,0.02,inner,0,0.32,0.165);
      if(tor)for(const s of[-1,1]){const l=M(0.07,0.2,0.02,dk(shirt,0.85),s*0.09,0.52,0.172);l.rotation.z=s*0.35}
      else for(let i=0;i<3;i++)M(0.03,0.03,0.02,acc,0.1,0.2+i*0.14,0.175);u.hip.children.filter(c=>c.geometry&&c.geometry.parameters&&c.geometry.parameters.width===0.52).forEach(b=>b.material=lamb(inner));break}
    case 'mtm': M(0.3,0.05,0.05,dk(shirt),0,0.63,0.15);break;

    case 'stadium': {u.arms.forEach(a=>a.children[0].material=lamb(acc));M(0.015,0.6,0.02,0xffffff,0,0.32,0.168);const nk=new THREE.Mesh(new THREE.TorusGeometry(0.13,0.03,8,20),lamb(0xffffff));nk.rotation.x=Math.PI/2;nk.position.set(0,0.64,0.02);u.hip.add(nk);M(0.53,0.05,0.335,0xffffff,0,0.03,0);M(0.12,0.12,0.02,0xffffff,-0.14,0.45,0.168);break}
    case 'track': {M(0.015,0.6,0.02,0xffffff,0,0.32,0.168);u.arms.forEach(a=>{const st=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.5,0.175),lamb(0xffffff));st.position.set(0,-0.27,0);a.add(st)});const nk=new THREE.Mesh(new THREE.TorusGeometry(0.13,0.045,8,20),lamb(shirt));nk.rotation.x=Math.PI/2;nk.position.set(0,0.65,0.02);u.hip.add(nk);break}
    case 'hawaii': {M(0.05,0.6,0.02,dk(shirt,0.85),0,0.32,0.166);for(const sx of[-1,1]){const c=M(0.13,0.05,0.12,dk(shirt,0.85),sx*0.08,0.63,0.12);c.rotation.z=sx*0.4}const r2=rng(77);for(let i=0;i<14;i++){const f=new THREE.Mesh(new THREE.CircleGeometry(0.03,6),basic([0xffffff,0xff6fb5,0x5fd38a][i%3]));f.position.set((r2()-0.5)*0.46,0.05+r2()*0.56,0.162);u.hip.add(f)}break}
    case 'suit': {u.arms.forEach(a=>a.children[0].material=lamb(shirt));M(0.12,0.3,0.02,inner,0,0.5,0.165);for(const s of[-1,1]){const l=M(0.08,0.26,0.02,dk(shirt,0.8),s*0.075,0.48,0.172);l.rotation.z=s*0.45}for(let i=0;i<2;i++)M(0.03,0.03,0.02,dk(shirt,0.6),0,0.22+i*0.1,0.168);break}
    case 'puff': {M(0.32,0.06,0.06,inner,0,0.62,0.14);u.arms.forEach(a=>{const pf=new THREE.Mesh(new THREE.SphereGeometry(0.13,14,10),lamb(shirt));pf.position.y=-0.04;a.add(pf)});for(let i=0;i<3;i++)M(0.025,0.025,0.02,0xffffff,0,0.48-i*0.1,0.166);break}
    case 'sailor': {const c=M(0.42,0.16,0.02,acc,0,0.56,0.166);for(const sx of[-1,1]){const st=M(0.4,0.02,0.021,0xffffff,0,0.5+sx*0.02,0.168)}const t=M(0.08,0.08,0.03,0xff6f6f,0,0.47,0.18);t.rotation.z=Math.PI/4;break}
    case 'coat': {u.arms.forEach(a=>a.children[0].material=lamb(shirt));for(const s of[-1,1])M(0.2,0.98,0.36,shirt,s*0.17,0.15,0.0);M(0.14,0.6,0.02,inner,0,0.32,0.175);const sc=M(0.34,0.1,0.36,acc,0,0.62,0.02);M(0.08,0.3,0.03,acc,0.08,0.45,0.19);break}
    case 'polo': {for(const sx of[-1,1]){const c=M(0.12,0.05,0.12,dk(shirt,0.85),sx*0.07,0.63,0.12);c.rotation.z=sx*0.35}M(0.05,0.2,0.02,dk(shirt,0.85),0,0.52,0.165);for(let i=0;i<2;i++)M(0.025,0.025,0.02,0xffffff,0,0.56-i*0.07,0.176);break}
    case 'ribbon': {M(0.32,0.06,0.06,inner,0,0.62,0.14);for(const sx of[-1,1]){const b=new THREE.Mesh(new THREE.TorusGeometry(0.04,0.016,8,14),lamb(acc));b.scale.set(1,0.7,1);b.position.set(sx*0.045,0.57,0.18);u.hip.add(b)}M(0.03,0.03,0.03,acc,0,0.57,0.185);for(const sx of[-1,1]){const t=M(0.025,0.1,0.02,acc,sx*0.02,0.5,0.18);t.rotation.z=sx*0.25}break}
    case 'blazer': {u.arms.forEach(a=>a.children[0].material=lamb(shirt));for(const s of[-1,1])M(0.19,0.66,0.34,shirt,s*0.175,0.31,0.002);M(0.14,0.6,0.02,inner,0,0.32,0.165);for(const s of[-1,1]){const l=M(0.07,0.22,0.02,dk(shirt,0.8),s*0.09,0.5,0.172);l.rotation.z=s*0.4}M(0.06,0.04,0.02,0xffffff,-0.17,0.45,0.172);break}
    case 'stripe': for(let i=0;i<5;i++)M(0.53,0.04,0.335,acc,0,0.08+i*0.12,0);M(0.3,0.05,0.05,acc,0,0.63,0.15);break;
    case 'overall': {M(0.34,0.36,0.345,acc,0,0.18,0);for(const sx of[-1,1])M(0.05,0.3,0.35,acc,sx*0.13,0.5,0);M(0.12,0.08,0.02,dk(acc,0.85),0,0.25,0.176);for(const sx of[-1,1])M(0.03,0.03,0.02,0xffd84d,sx*0.13,0.42,0.176);break}
    case 'fleece': {M(0.015,0.6,0.02,0xb8b8c0,0,0.32,0.17);const nk=new THREE.Mesh(new THREE.TorusGeometry(0.13,0.05,10,20),lamb(dk(shirt,0.95)));nk.rotation.x=Math.PI/2;nk.position.set(0,0.65,0.02);u.hip.add(nk);for(const sx of[-1,1])M(0.12,0.1,0.02,acc,sx*0.13,0.18,0.168);break}
    case 'dress': {const sk=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.36,0.34,20),lamb(shirt));sk.position.set(0,-0.12,0);u.hip.add(sk);M(0.3,0.06,0.05,inner,0,0.62,0.15);break}
    case 'trench': {u.arms.forEach(a=>a.children[0].material=lamb(shirt));for(const s of[-1,1])M(0.2,0.98,0.36,shirt,s*0.17,0.15,0.0);M(0.14,0.6,0.02,inner,0,0.32,0.175);M(0.56,0.05,0.37,dk(shirt,0.8),0,0.2,0);for(const s of[-1,1]){const l=M(0.08,0.24,0.02,dk(shirt,0.85),s*0.1,0.5,0.185);l.rotation.z=s*0.4}for(let i=0;i<2;i++)for(const s of[-1,1])M(0.03,0.03,0.02,0x5a4030,s*0.12,0.3+i*0.12,0.19);break}
    case 'cable': {for(let i=0;i<3;i++)for(let k=0;k<5;k++){const c=M(0.05,0.06,0.01,dk(shirt,0.85),-0.13+i*0.13,0.06+k*0.12,0.163);c.rotation.z=(k%2?0.5:-0.5)}M(0.3,0.06,0.05,dk(shirt),0,0.63,0.14);break}
    case 'denim': {u.arms.forEach(a=>a.children[0].material=lamb(shirt));for(const s of[-1,1])M(0.19,0.66,0.34,shirt,s*0.175,0.31,0.002);M(0.14,0.6,0.02,inner,0,0.32,0.165);for(const s of[-1,1]){M(0.12,0.09,0.02,dk(shirt,0.85),s*0.16,0.5,0.172);M(0.02,0.02,0.02,0xd4a94a,s*0.16,0.53,0.182)}M(0.56,0.04,0.36,dk(shirt,0.85),0,0.03,0);break}

    case 'blouse': M(0.32,0.07,0.06,inner,0,0.62,0.14);for(const s of[-1,1]){const r=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),lamb(inner));r.scale.set(1,0.5,0.6);r.position.set(s*0.07,0.6,0.17);u.hip.add(r)}break;
  }
  const hc=o.hair??0x2a2020,m=smooth(hc);
  const P={eyes:[],hls:[],lashes:[],cheeks:[],lids:[]};
  const ey=o.eyes||'round';
  for(const sx of[-1,1]){
    const e=new THREE.Mesh(new THREE.SphereGeometry(0.044,20,16),basic(0x2a1a14));e.scale.set(0.9,ey==='sleepy'?0.72:ey==='calm'?0.95:1.15,0.5);e.userData.bs=e.scale.clone();e.position.set(sx*0.095,ey==='sleepy'?0.244:0.25,0.232);h.add(e);P.eyes.push(e);
    const hl=new THREE.Mesh(new THREE.SphereGeometry(0.015,12,8),basic(0xffffff));hl.position.set(sx*0.095+0.014,ey==='sleepy'?0.252:0.268,0.252);h.add(hl);P.hls.push(hl);
    if(ey==='sleepy'||ey==='calm'){const ln=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.012,0.012),basic(0x1a1210));ln.position.set(sx*0.095,ey==='sleepy'?0.272:0.29,0.256);h.add(ln);P.lids.push(ln)}
    if(fem){const la=new THREE.Mesh(new THREE.BoxGeometry(0.026,0.011,0.011),basic(0x2a1a14));la.position.set(sx*0.14,ey==='round'?0.29:0.282,0.25);la.rotation.z=sx*0.5;h.add(la);P.lashes.push(la)}
    const brRot={round:0,soft:-0.22,sharp:0.18,sleepy:0,calm:-0.06}[ey]??0;
    const br=new THREE.Mesh(new THREE.BoxGeometry(fem?0.052:0.06,fem?0.012:0.014,0.012),basic(dk(hc,0.8)));br.position.set(sx*0.095,0.33,0.262);br.rotation.z=sx*brRot;h.add(br);
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.043,20),new THREE.MeshBasicMaterial({color:0xff9fb8,transparent:true,opacity:o.cheek??0.6}));ck.position.set(sx*0.15,0.175,0.216);ck.rotation.y=sx*0.35;h.add(ck);P.cheeks.push(ck)}
  if(o.glasses){const gm=smooth(o.glasses);for(const sx of[-1,1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(0.062,0.009,8,28),gm);ring.position.set(sx*0.09,0.252,0.262);h.add(ring)}const bridge=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.009,0.009),gm);bridge.position.set(0,0.26,0.266);h.add(bridge)}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(o.smileW??0.028,0.01,8,16,Math.PI),basic(0xc8506e));sm.rotation.z=Math.PI;sm.position.set(0,0.164,0.246);h.add(sm);P.smile=sm;
  // ---- 머리 ----
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.264,40,20,0,Math.PI*2,0,Math.PI*0.5),m);cap.position.y=0.25;cap.rotation.x=['back','lowbun','slick','tuck'].includes(o.style)?-0.34:-0.24;h.add(cap);
  const longBack=['long','longside','half','wave','pony','hime','tuck','curly','lob'].includes(o.style);
  const bk=new THREE.Mesh(new THREE.SphereGeometry(0.268,40,24,Math.PI,Math.PI,0,Math.PI*(longBack||o.style==='bob'?0.82:0.62)),m);bk.position.y=0.25;h.add(bk);
  const bang=(sx,sy,x,y,rz,w=0.95)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);b.scale.set(w,sy,0.42);b.position.set(x,y,0.15);b.rotation.z=rz;h.add(b);return b};
  const sides=(sy=1.35,sx2=0.55,y=0.16)=>{for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(sx2,sy,0.95);sd.position.set(sx*0.225,y,0.03);h.add(sd)}};
  const longSides=()=>{const back=new THREE.Mesh(new THREE.SphereGeometry(0.2,24,16),m);back.scale.set(1.25,1.7,0.6);back.position.set(0,-0.02,-0.12);h.add(back);for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),m);sd.scale.set(0.5,2.0,0.85);sd.position.set(sx*0.225,0.08,0.03);h.add(sd)}};
  switch(o.style){
    case 'side': bang(0,0.24,0.05,0.415,0.22);break;                     // 단정한 옆가르마
    case 'bowl': bang(0,0.25,0,0.38,0,1.0);break;                         // 바가지

    case 'buzz': {cap.scale.setScalar(0.985);const f=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);f.scale.set(0.9,0.14,0.42);f.position.set(0,0.44,0.13);h.add(f);break}
    case 'softperm': {for(let i=0;i<7;i++){const c=new THREE.Mesh(new THREE.SphereGeometry(0.075,12,10),m);const a=-0.9+i*0.3;c.position.set(Math.sin(a)*0.2,0.42+Math.cos(a)*0.04,Math.cos(a)*0.12+0.03);h.add(c)}for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.SphereGeometry(0.08,12,10),m);c.position.set(-0.16+i*0.08,0.5,-0.06);h.add(c)}break}
    case 'swept': {const b=bang(0,0.26,-0.06,0.44,-0.35,1.05);b.scale.z=0.55;for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.08,14,10),m);sd.scale.set(0.5,1.1,1.1);sd.position.set(sx*0.24,0.27,-0.02);h.add(sd)}break}
    case 'curly': {const back=new THREE.Mesh(new THREE.SphereGeometry(0.2,24,16),m);back.scale.set(1.3,1.6,0.65);back.position.set(0,-0.02,-0.12);h.add(back);const r3=rng(31);for(let i=0;i<18;i++){const c=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),m);const sx=i%2?1:-1;c.position.set(sx*(0.2+r3()*0.07),0.32-Math.floor(i/2)*0.07,0.0+r3()*0.06);h.add(c)}for(const x of[-0.12,0,0.12]){const c=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),m);c.position.set(x,0.42,0.17);h.add(c)}break}
    case 'pixie': {bang(0,0.22,0.06,0.41,0.35,0.9);for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,10),m);sd.scale.set(0.5,1.0,0.9);sd.position.set(sx*0.24,0.29,0.05);h.add(sd)}break}
    case 'lob': {longSides();const back=h.children[h.children.length-3];back.scale.y=1.1;bang(0,0.26,0.07,0.41,0.35,0.95);break}
    case 'slick': {const top=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);top.scale.set(1.15,0.32,0.75);top.position.set(0,0.44,0.08);top.rotation.x=-0.25;h.add(top);const gl=new THREE.Mesh(new THREE.SphereGeometry(0.04,10,8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.35}));gl.scale.set(1.6,0.5,1);gl.position.set(0.06,0.5,0.17);h.add(gl);break}
    case 'twoblock': {const fr=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);fr.scale.set(0.9,0.22,0.42);fr.position.set(0.03,0.43,0.16);fr.rotation.set(-0.35,0,0.12);h.add(fr);break}
    case 'hime': {const back=new THREE.Mesh(new THREE.SphereGeometry(0.2,24,16),m);back.scale.set(1.25,1.8,0.6);back.position.set(0,-0.05,-0.12);h.add(back);for(const sx of[-1,1]){const sd=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.26,16),m);sd.position.set(sx*0.225,0.13,0.06);h.add(sd)}bang(0,0.24,0,0.39,0,1.02);break}
    case 'highpony': {bang(0,0.23,0.03,0.4,0.15);const knot=new THREE.Mesh(new THREE.SphereGeometry(0.08,14,10),m);knot.position.set(0,0.52,-0.16);h.add(knot);const tie=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.016,8,14),smooth(o.pin??0xff6f6f));tie.position.set(0,0.52,-0.12);h.add(tie);const tail=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),m);tail.scale.set(0.85,2.4,0.85);tail.position.set(0.12,0.3,-0.27);tail.rotation.z=0.35;h.add(tail);break}
    case 'comma': {bang(0,0.24,0.06,0.41,0.25,0.9);const c=new THREE.Mesh(new THREE.TorusGeometry(0.045,0.018,8,16,Math.PI*1.4),m);c.position.set(-0.02,0.37,0.24);c.rotation.z=0.6;h.add(c);break}
    case 'curtainperm': {for(const sx of[-1,1])bang(0,0.3,sx*0.1,0.38,sx*0.45,0.62);for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.09,14,10),m);f.position.set(-0.16+i*0.08,0.5,-0.02+(i%2)*0.04);h.add(f)}break}
    case 'braids': {bang(0,0.24,0,0.39,0,1.02);for(const sx of[-1,1]){for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.05-i*0.003,12,10),m);b.position.set(sx*(0.23+i*0.012),0.12-i*0.08,0.06);h.add(b)}const tie=new THREE.Mesh(new THREE.TorusGeometry(0.025,0.01,8,12),smooth(o.pin??0xffc0d8));tie.position.set(sx*0.29,-0.3,0.06);tie.rotation.x=Math.PI/2;h.add(tie)}break}
    case 'shag': {for(const sx of[-1,1])for(let i=0;i<3;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.07,14,10),m);l.position.set(sx*(0.24-i*0.01),0.27-i*0.09,0.02-i*0.02);h.add(l)}for(const [x,rz] of [[-0.12,0.3],[0.0,0],[0.12,-0.3]]){const b=bang(0,0.28,x,0.38-Math.abs(x)*0.1,rz,0.42)}break}
    case 'gentle': {const b=bang(0,0.3,0.06,0.43,0.3,1.0);b.scale.z=0.5;break}
    case 'tuck': {longSides();for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,10),m);t.position.set(sx*0.25,0.28,-0.02);h.add(t)}break}

    case 'curtain': for(const sx of[-1,1])bang(0,0.3,sx*0.09,0.375,sx*0.4,0.6);break; // 가르마 커튼
    case 'short': bang(0,0.2,0.04,0.42,0.2,0.85);break;                   // 짧게 넘김
    case 'back': break;                                                     // 이마 드러낸 넘김머리
    case 'messy': for(const sx of[-1,0,1]){const b=bang(0,0.3,sx*0.1,0.385-Math.abs(sx)*0.01,-sx*0.3,0.42)}break;
    case 'long': longSides();bang(0,0.24,0,0.39,0,1.02);break;
    case 'longside': longSides();bang(0,0.24,0.05,0.405,0.25);break;
    case 'half': longSides();bang(0,0.22,0.04,0.4,0.2,0.9);{const k=new THREE.Mesh(new THREE.SphereGeometry(0.07,14,10),m);k.position.set(0,0.42,-0.24);h.add(k);const rb=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.018,8,16),smooth(o.pin??0xffc0d8));rb.position.set(0,0.42,-0.2);h.add(rb)}break;
    case 'wave': longSides();for(const sx of[-1,1])bang(0,0.28,sx*0.09,0.38,sx*0.42,0.6);for(const sx of[-1,1])for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,10),m);c.position.set(sx*(0.22+(i%2)*0.03),-0.05-i*0.1,0.0);h.add(c)}break;
    case 'bob': sides();for(const sx of[-1,1]){const c=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),m);c.scale.set(0.9,0.6,1.0);c.position.set(sx*0.19,0.03,0.07);h.add(c)}bang(0,0.24,-0.04,0.4,-0.2,0.92);break;
    case 'bobstraight': sides();bang(0,0.24,0,0.39,0,1.02);break;
    case 'pony': {const tie=new THREE.Mesh(new THREE.TorusGeometry(0.03,0.012,8,14),smooth(o.pin??0x22222a));tie.position.set(0.2,0.06,0.06);tie.rotation.set(1.2,0,0.4);h.add(tie);const tail=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),m);tail.scale.set(0.8,2.1,0.8);tail.position.set(0.23,-0.08,0.1);tail.rotation.z=0.25;h.add(tail);bang(0,0.24,0,0.395,0,1.0);break}
    case 'lowbun': {const bun=new THREE.Mesh(new THREE.SphereGeometry(0.1,20,14),m);bun.position.set(0,0.12,-0.29);h.add(bun);for(const sx of[-1,1]){const sw=new THREE.Mesh(new THREE.SphereGeometry(0.2,32,16),m);sw.scale.set(0.6,0.2,0.4);sw.position.set(sx*0.09,0.425,0.12);sw.rotation.z=-sx*0.35;h.add(sw)}break}
    case 'topbun': {const bun=new THREE.Mesh(new THREE.SphereGeometry(0.11,18,12),m);bun.position.set(0,0.53,-0.1);h.add(bun);bang(0,0.22,0.02,0.41,0.18);for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,10),m);w.scale.set(0.5,1.9,0.6);w.position.set(sx*0.2,0.25,0.14);h.add(w)}break}
  }
  if(o.pin&&['bob','bobstraight','long','longside'].includes(o.style)){const pn=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.022,0.02),smooth(o.pin));pn.position.set(0.15,0.41,0.2);pn.rotation.z=0.4;h.add(pn)}
  if(o.ring)for(const sx of[-1,1]){const r=new THREE.Mesh(new THREE.TorusGeometry(0.022,0.006,8,16),smooth(o.ring));r.position.set(sx*0.262,0.13,0.03);r.rotation.y=Math.PI/2;h.add(r)}
  p.scale.setScalar(0.8);h.scale.setScalar(1.4);h.position.y=0.62;
  const mo=new THREE.Mesh(new THREE.SphereGeometry(0.04,20,14),basic(0xb8344f));mo.scale.set(1,0.7,0.4);mo.position.set(0,0.16,0.24);mo.visible=false;h.add(mo);P.open=mo;
  const tg=new THREE.Mesh(new THREE.SphereGeometry(0.022,14,10),basic(0xff8fa6));tg.scale.set(1,0.5,0.4);tg.position.set(0,0.145,0.25);tg.visible=false;h.add(tg);P.tongue=tg;
  P.happy=[];for(const sx of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(0.034,0.01,8,16,Math.PI),basic(0x2a1a14));a.position.set(sx*0.095,0.245,0.262);a.visible=false;h.add(a);P.happy.push(a)}
  P.tears=[];for(const sx of[-1,1]){const t=new THREE.Mesh(new THREE.SphereGeometry(0.018,14,10),new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:0.95}));t.scale.set(1,1.5,0.5);t.position.set(sx*0.1,0.19,0.245);t.visible=false;h.add(t);P.tears.push(t)}
  P.brows=[];P.pout=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.009,8,16),basic(0xc8405e));P.pout.position.set(0,0.165,0.248);P.pout.visible=false;h.add(P.pout);
  const phone = new THREE.Group(); box(phone, 0.16, 0.3, 0.03, 0x22222a, 0, 0, 0);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.27), basic(0xe6eef6)); scr.position.z = 0.017; phone.add(scr);
  phone.position.set(0, -0.68, 0.12); phone.rotation.x = Math.PI / 2; phone.visible = false; u.arms[1].add(phone);
  p.userData.P = P; p.userData.phone = phone; p.userData.baseHeadY = h.position.y;
  return p}
// 남은 유형 캐릭터 설정
const GEN={
  // ISTJ — 네이비, 단정
  ISTJ_MA:{seed:801,shirt:0xf6f6f2,pants:0x2c3550,outfit:'tie',inner:0xffffff,accent:0x2f4aa0,style:'slick',hair:0x2a201c,eyes:'calm'},
  ISTJ_MB:{seed:802,shirt:0x2c3a66,pants:0xb8a888,outfit:'polo',style:'twoblock',hair:0x1d1d24,eyes:'calm'},
  ISTJ_FA:{fem:1,seed:803,shirt:0xffffff,pants:0x2c3550,outfit:'ribbon',inner:0xffffff,accent:0x2c3a66,style:'hime',hair:0x1d1d24,eyes:'calm'},
  ISTJ_FB:{fem:1,seed:804,shirt:0x2c3a66,pants:0x2c3550,outfit:'blazer',inner:0xffffff,style:'highpony',hair:0x2a201c,eyes:'calm',pin:0x2c3a66},
  // ISFJ — 크림·연분홍, 다정
  ISFJ_MA:{seed:811,shirt:0xfff6ea,pants:0x8a8f9c,outfit:'stripe',accent:0xffb8c8,style:'comma',hair:0x6a4a34,eyes:'soft',cheek:0.75},
  ISFJ_MB:{seed:812,shirt:0xffe0e8,pants:0xd8c8a8,outfit:'overall',accent:0xd8c8a8,style:'curtainperm',hair:0x4a3428,eyes:'soft',cheek:0.75},
  ISFJ_FA:{fem:1,seed:813,shirt:0xfff3e0,pants:0x8a8f9c,outfit:'fleece',accent:0xffd0dc,style:'braids',hair:0x6a4a34,eyes:'soft',pin:0xffc0d8,cheek:0.8},
  ISFJ_FB:{fem:1,seed:814,shirt:0xffc8d6,pants:0xffc8d6,outfit:'dress',inner:0xffffff,style:'half',hair:0x5a3a2a,eyes:'soft',pin:0xffffff,cheek:0.8},
  // INFJ — 짙은 초록, 차분·신비
  INFJ_MA:{seed:821,shirt:0xc8b89a,pants:0x2c3040,outfit:'trench',inner:0x3f6b55,style:'shag',hair:0x1d1d24,eyes:'calm'},
  INFJ_MB:{seed:822,shirt:0x3f6b55,pants:0x2c3040,outfit:'cable',style:'gentle',hair:0x2a201c,eyes:'calm'},
  INFJ_FA:{fem:1,seed:823,shirt:0x2f5a46,pants:0x2f5a46,outfit:'dress',inner:0xf6f0e0,style:'wave',hair:0x2a201c,eyes:'calm',ring:0xd4a94a},
  INFJ_FB:{fem:1,seed:824,shirt:0x3a4a6a,pants:0x2c3040,outfit:'denim',inner:0x3f6b55,style:'tuck',hair:0x1d1d24,eyes:'calm'},
  // 나머지 7개 유형 (Claude 확정안)
  ESTP_M:{seed:831,shirt:0xd8352a,pants:0x2c3040,outfit:'stadium',accent:0xf6f6f2,style:'buzz',hair:0x1d1d24,eyes:'round'},
  ESTP_F:{fem:1,seed:832,shirt:0xff6f3a,pants:0x2c3040,outfit:'track',style:'highpony',hair:0x2a201c,eyes:'round',pin:0xffffff},
  ESFP_M:{seed:841,shirt:0xffd84d,pants:0xf6f0e0,outfit:'hawaii',style:'curtainperm',hair:0x8a5a3a,eyes:'round',cheek:0.75},
  ESFP_F:{fem:1,seed:842,shirt:0xff6fb5,pants:0xffd84d,outfit:'overall',accent:0xffd84d,style:'curly',hair:0x9a5a3a,eyes:'round',cheek:0.8,ring:0xffd84d},
  ENTP_M:{seed:851,shirt:0x5a7ab8,pants:0x2c3040,outfit:'denim',inner:0xff9f43,style:'gentle',hair:0x3a2a22,eyes:'round'},
  ENTP_F:{fem:1,seed:852,shirt:0xff9f43,pants:0x2c3040,outfit:'blazer',inner:0xffffff,style:'pixie',hair:0x3a2a22,eyes:'round',ring:0xd8dce4},
  ESTJ_M:{seed:861,shirt:0x55585e,pants:0x45484e,outfit:'suit',inner:0xffffff,style:'twoblock',hair:0x1d1d24,eyes:'calm'},
  ESTJ_F:{fem:1,seed:862,shirt:0x55585e,pants:0x45484e,outfit:'suit',inner:0xffffff,style:'tuck',hair:0x2a201c,eyes:'calm'},
  ESFJ_M:{seed:871,shirt:0xff8a6a,pants:0xd8c8a8,outfit:'cable',style:'softperm',hair:0x6a4a34,eyes:'soft',cheek:0.75},
  ESFJ_F:{fem:1,seed:872,shirt:0xff9f8a,pants:0xf6f0e0,outfit:'puff',inner:0xffffff,style:'half',hair:0x6a4a34,eyes:'soft',pin:0xffffff,cheek:0.8},
  ENFJ_M:{seed:881,shirt:0x7fc4f0,pants:0xf6f0e0,outfit:'polo',style:'back',hair:0x3a2a22,eyes:'soft'},
  ENFJ_F:{fem:1,seed:882,shirt:0xf6f6f2,pants:0x4f7bd6,outfit:'sailor',accent:0x4f7bd6,style:'longside',hair:0x4a3428,eyes:'soft'},
  ENTJ_M:{seed:891,shirt:0x1d1d24,pants:0x1d1d24,outfit:'coat',inner:0xf6f6f2,accent:0x8a2a3a,style:'swept',hair:0x111114,eyes:'calm'},
  ENTJ_F:{fem:1,seed:892,shirt:0x1d1d24,pants:0x1d1d24,outfit:'coat',inner:0xf6f6f2,accent:0x8a2a3a,style:'lob',hair:0x111114,eyes:'calm',ring:0xd4a94a},
};

const MODELS = { 'istj-m': () => mkGen(GEN.ISTJ_MA), 'istj-f': () => mkGen(GEN.ISTJ_FA), 'isfj-m': () => mkGen(GEN.ISFJ_MA), 'isfj-f': () => mkGen(GEN.ISFJ_FA), 'infj-m': () => mkGen(GEN.INFJ_MA), 'infj-f': () => mkGen(GEN.INFJ_FA), 'estp-m': () => mkGen(GEN.ESTP_M), 'estp-f': () => mkGen(GEN.ESTP_F), 'esfp-m': () => mkGen(GEN.ESFP_M), 'esfp-f': () => mkGen(GEN.ESFP_F), 'entp-m': () => mkGen(GEN.ENTP_M), 'entp-f': () => mkGen(GEN.ENTP_F), 'estj-m': () => mkGen(GEN.ESTJ_M), 'estj-f': () => mkGen(GEN.ESTJ_F), 'esfj-m': () => mkGen(GEN.ESFJ_M), 'esfj-f': () => mkGen(GEN.ESFJ_F), 'enfj-m': () => mkGen(GEN.ENFJ_M), 'enfj-f': () => mkGen(GEN.ENFJ_F), 'entj-m': () => mkGen(GEN.ENTJ_M), 'entj-f': () => mkGen(GEN.ENTJ_F), 'intp-m': () => mkP('MA'), 'intp-f': () => mkP('FA'), 'intj-f': () => mkJ('F'), 'intj-m': () => mkJ('N'), 'istp-m': () => mkT('Z'), 'istp-f': () => mkT('A'), 'isfp-f': () => mkS('F'), 'isfp-m': () => mkS('A'), 'enfp-f': mkE, 'enfp-m': mkEm, 'infp-f': () => mkI('F'), 'infp-m': () => mkI('C') };

const FACE = {
  smile() {},
  excited(P) { (P.lids || []).forEach(l => l.visible = false); P.smile.visible = false; P.open.visible = true; P.tongue.visible = true; P.hls.forEach(h => h.scale.setScalar(1.6)); P.eyes.forEach(e => e.scale.set(1, 1.35, 0.5)); },
  happy(P) { (P.lids || []).forEach(l => l.visible = false); P.eyes.forEach(e => e.visible = false); P.hls.forEach(h => h.visible = false); P.happy.forEach(a => a.visible = true); P.smile.visible = false; P.open.visible = true; P.open.scale.set(1.1, 0.6, 0.4); P.cheeks.forEach(c => c.scale.setScalar(1.2)); },
  blush(P) { P.eyes.forEach(e => e.scale.set(0.9, 0.75, 0.5)); P.cheeks.forEach(c => { c.scale.set(1.7, 1.3, 1); c.material.opacity = 0.95; c.material.color.set(0xff7a9a); }); P.smile.scale.setScalar(0.7); },
  pout(P) { P.smile.visible = false; P.pout.visible = true; P.cheeks.forEach(c => { c.scale.setScalar(1.45); c.material.opacity = 0.9; }); P.brows.forEach((b, i) => { b.visible = true; b.rotation.z = i ? -0.35 : 0.35; }); },
  teary(P) { (P.lids || []).forEach(l => l.visible = false); P.tears.forEach(t => t.visible = true); P.hls.forEach(h => h.scale.setScalar(1.8)); P.eyes.forEach(e => e.scale.set(1, 1.3, 0.5)); P.smile.rotation.z = 0; P.smile.position.y = 0.14; P.smile.scale.setScalar(0.8); P.brows.forEach((b, i) => { b.visible = true; b.rotation.z = i ? 0.35 : -0.35; }); },
  surprised(P) { (P.lids || []).forEach(l => l.visible = false); P.smile.visible = false; P.open.visible = true; P.open.scale.set(0.7, 0.95, 0.4); P.eyes.forEach(e => e.scale.set(1.05, 1.45, 0.5)); P.brows.forEach(b => { b.visible = true; b.position.y = 0.345; }); },
};
function resetFace(P) {
  P.eyes.forEach(e => { e.visible = true; if (e.userData.bs) e.scale.copy(e.userData.bs); else e.scale.set(0.9, 1.2, 0.5); }); (P.lids || []).forEach(l => l.visible = true); P.hls.forEach(h => { h.visible = true; h.scale.setScalar(1); });
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


// ================= 유형별 데이트 코스 세트 =================
// 메뉴판 (가게마다 메뉴가 다름)
function boardTex(sel, items, o = {}) { return canvasTex(512, 300, (x, w, h) => {
  x.fillStyle = o.bg || '#2f3a33'; rr(x, 0, 0, w, h, 26); x.fill(); x.fillStyle = o.title || '#fff'; x.textAlign = 'center'; x.font = `900 50px ${FONT}`; x.fillText(o.name || 'MENU', w / 2, 62);
  x.textAlign = 'left'; x.font = `800 38px ${FONT}`;
  items.forEach(([n, p], i) => { const y = 128 + i * 54; x.fillStyle = sel === n ? '#ffd84d' : (o.fg || '#e8efe9'); x.fillText((sel === n ? '▶ ' : '   ') + n, 36, y); x.textAlign = 'right'; x.fillText(p, w - 36, y); x.textAlign = 'left'; });
}); }
function bareTable(g, z = 0.62, top = 0xffffff, w = 1.5) { box(g, w, 0.06, 0.8, top, 0, 0.72, z); cyl(g, 0.05, 0.05, 0.7, 0x555560, 0, 0.36, z, 8); }
function steam(g, x, y, z) { for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.05 + i * 0.01, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 - i * 0.1 })); s.position.set(x + (i - 1) * 0.03, y + i * 0.09, z); g.add(s); } }
function sign(g, text, w, h, x, y, z, bg = '#fff', fg = '#e2557a', fs = 0.5) { return texPlane(g, w, h, canvasTex(Math.round(w * 300), Math.round(h * 300), (c, cw, ch) => { c.fillStyle = bg; rr(c, 0, 0, cw, ch, Math.min(cw, ch) * 0.2); c.fill(); c.fillStyle = fg; c.font = `900 ${Math.round(ch * fs)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, cw / 2, ch / 2 + 3); }), x, y, z); }

function buildDiner(r, o) {
  const g = new THREE.Group(); room(g, { floor: o.floor, wall: o.wall });
  if (o.window) windowWall(g, o.window, 2.0, 2.6, -1.3);
  const menu = texPlane(g, 1.25, 0.73, boardTex('', o.items, o.board), o.window ? 1.2 : -1.25, 2.15, -2.15); g.userData.menu = menu; g.userData.menuItems = o.items; g.userData.board = o.board;
  if (o.sign) sign(g, o.sign[0], 1.1, 0.34, o.window ? 1.2 : 1.1, 2.75, -2.14, o.sign[1], o.sign[2]);
  box(g, 0.55, 0.9, 0.12, o.chair || 0xb07a52, 0, 0.75, -0.42);
  bareTable(g, 0.62, o.top || 0xffffff);
  const z = 0.68, k = o.kind;
  if (k === 'bunsik') { // 떡볶이 판 + 순대 + 튀김
    const pan = cyl(g, 0.3, 0.27, 0.06, 0x3a3a40, -0.15, 0.78, z, 20); cyl(g, 0.27, 0.27, 0.02, 0xd8352a, -0.15, 0.81, z, 20);
    for (let i = 0; i < 9; i++) { const t = cyl(g, 0.025, 0.025, 0.12, 0xffe2c8, -0.15 + (r() - 0.5) * 0.36, 0.83, z + (r() - 0.5) * 0.36, 8); t.rotation.z = Math.PI / 2; t.rotation.y = r() * 3; }
    cyl(g, 0.15, 0.13, 0.03, 0xffffff, 0.45, 0.77, z, 16); for (let i = 0; i < 4; i++) cyl(g, 0.035, 0.035, 0.03, 0x4a2a30, 0.38 + i * 0.05, 0.8, z, 10);
    for (let i = 0; i < 3; i++) box(g, 0.09, 0.05, 0.05, 0xf0b048, 0.5 - i * 0.06, 0.82, z + 0.12);
    for (let i = 0; i < 3; i++) box(g, 0.24, 0.04, 0.02, i % 2 ? 0xffd84d : 0xff7a5a, 0, 0.2 + i * 0.02, -2.18);
    for (let i = 0; i < 6; i++) box(g, 0.6, 0.12, 0.02, i % 2 ? 0xffe066 : 0xff7a5a, -2.4 + i * 0.96, 0.6, -2.18);
  }
  if (k === 'pasta') { // 크림 파스타 두 접시 + 촛불
    for (const x of [-0.38, 0.38]) { cyl(g, 0.17, 0.15, 0.025, 0xffffff, x, 0.765, z, 20); const p = new THREE.Mesh(new THREE.TorusKnotGeometry(0.06, 0.02, 40, 6), lamb(0xf6e2a8)); p.position.set(x, 0.8, z); p.rotation.x = Math.PI / 2; g.add(p); }
    cyl(g, 0.035, 0.035, 0.16, 0xfff8e8, 0, 0.83, z - 0.1, 10); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), basic(0xffc04d)); fl.scale.y = 1.6; fl.position.set(0, 0.94, z - 0.1); g.add(fl);
    for (let i = 0; i < 3; i++) { const f = texPlane(g, 0.5, 0.38, canvasTex(200, 150, (x, w, h) => { x.fillStyle = '#c9a77a'; x.fillRect(0, 0, w, h); x.fillStyle = ['#f6d7c3', '#d8e6f6', '#f3e0b8'][i]; x.fillRect(12, 12, w - 24, h - 24); x.fillStyle = ['#8fbf6a', '#6a8fbf', '#d98c6c'][i]; x.beginPath(); x.arc(w / 2, h / 2 + 10, 32, 0, 7); x.fill(); }), -2.0 + i * 0.75, 2.2 + (i % 2) * 0.15, -2.15); }
    box(g, 1.2, 0.05, 0.22, 0x6a4a3a, 1.6, 1.6, -2.07); for (let i = 0; i < 6; i++) cyl(g, 0.04, 0.04, 0.3, 0x3a5a3a, 1.1 + i * 0.2, 1.78, -2.07, 8);
  }
  if (k === 'brunch') { // 팬케이크 + 꽃병
    for (const x of [-0.38, 0.38]) { cyl(g, 0.17, 0.15, 0.025, 0xffffff, x, 0.765, z, 20); for (let i = 0; i < 3; i++) cyl(g, 0.1, 0.1, 0.035, 0xe8b870, x, 0.795 + i * 0.037, z, 18); const s = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), lamb(0xff4d6d)); s.position.set(x, 0.92, z); g.add(s); }
    cyl(g, 0.05, 0.04, 0.14, 0xcde9ff, 0, 0.82, z - 0.12, 10); for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), lamb([0xffd84d, 0xff9fcf, 0xffffff][i])); f.position.set((i - 1) * 0.04, 0.94 + (i % 2) * 0.03, z - 0.12); g.add(f); }
    plant(g, -2.4, -1.4, 1.2); plant(g, 2.4, -1.4, 1.0); lampPend(g, 0, 2.9, -0.3);
  }
  if (k === 'bbq') { // 숯불 그릴 + 고기 + 환풍구
    cyl(g, 0.3, 0.26, 0.08, 0x2b2b30, 0, 0.79, z, 20); const grill = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.01, 20), new THREE.MeshBasicMaterial({ color: 0xff7a3a })); grill.position.set(0, 0.835, z); g.add(grill);
    for (let i = 0; i < 4; i++) { const m = box(g, 0.13, 0.025, 0.08, 0xd9707a, -0.12 + (i % 2) * 0.22, 0.86, z - 0.08 + Math.floor(i / 2) * 0.16); m.rotation.y = r() - 0.5; }
    for (const x of [-0.6, 0.6]) cyl(g, 0.06, 0.05, 0.04, 0xffffff, x, 0.77, z + 0.15, 12);
    cyl(g, 0.1, 0.1, 1.5, 0xb8bcc4, 0.75, 2.8, z, 14); cyl(g, 0.2, 0.1, 0.18, 0xb8bcc4, 0.75, 2.0, z, 16);
    for (let i = 0; i < 4; i++) { const lan = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), basic(0xffb84d)); lan.scale.y = 1.3; lan.position.set(-2.2 + i * 1.45, 2.6, -1.9); g.add(lan); }
  }
  if (k === 'sushi') { // 초밥 + 노렌
    box(g, 1.0, 0.03, 0.18, 0x5a3a2a, 0, 0.765, z); for (let i = 0; i < 5; i++) { box(g, 0.09, 0.05, 0.06, 0xffffff, -0.36 + i * 0.18, 0.8, z); box(g, 0.1, 0.02, 0.065, [0xff8a5a, 0xff6f6f, 0xffd0a0][i % 3], -0.36 + i * 0.18, 0.835, z); }
    for (let i = 0; i < 4; i++) { const n = texPlane(g, 0.5, 0.8, canvasTex(120, 192, (x, w, h) => { x.fillStyle = '#2f3f6e'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = `900 60px ${FONT}`; x.textAlign = 'center'; x.fillText('すし'[i % 2], w / 2, 110); }), -0.78 + i * 0.52, 2.45, -2.1); }
    for (let i = 0; i < 9; i++) box(g, 0.08, 3.0, 0.04, 0xc9a07a, -2.6 + i * 0.65, 1.5, -2.16);
  }
  if (k === 'gukbap') { // 국밥 두 그릇 + 김치
    for (const x of [-0.38, 0.38]) { cyl(g, 0.15, 0.1, 0.12, 0x2b2b30, x, 0.81, z, 18); cyl(g, 0.13, 0.13, 0.01, 0xf3e6d0, x, 0.865, z, 18); steam(g, x, 0.95, z); }
    cyl(g, 0.08, 0.07, 0.03, 0xffffff, 0, 0.77, z + 0.15, 12); cyl(g, 0.06, 0.06, 0.02, 0xd8352a, 0, 0.79, z + 0.15, 12);
    for (let i = 0; i < 3; i++) lampPend(g, -1.6 + i * 1.6, 2.9, -0.6);
  }
  return g;
}

function shelfWall(g, r, kind, x0 = 0, w = 4.6) {
  for (let row = 0; row < 3; row++) { const y = 0.7 + row * 0.7; box(g, w, 0.05, 0.4, 0x9a6a4a, x0, y, -1.95);
    let x = x0 - w / 2 + 0.1;
    while (x < x0 + w / 2 - 0.15) {
      if (kind === 'books') { const bw = 0.06 + r() * 0.06, bh = 0.32 + r() * 0.22; box(g, bw, bh, 0.28, pick(r, [0xff9fb8, 0x8fd3ff, 0x9df2c8, 0xffd84d, 0xc9a7ff, 0xf6f0e0, 0x4f7bd6]), x + bw / 2, y + 0.025 + bh / 2, -1.95); x += bw + 0.01; }
      else if (kind === 'records') { const s = box(g, 0.03, 0.42, 0.42, pick(r, [0xff6f9f, 0x2b2b30, 0xffd84d, 0x4fb3d6, 0xf6f0e0, 0x9a5ad8]), x, y + 0.24, -1.95); s.rotation.z = (r() - 0.5) * 0.15; x += 0.05; }
      else { const c = pick(r, [0xffc0d8, 0xcde9ff, 0xd8f6ea, 0xfff3c4, 0xe6dcff]); const t = r();
        if (t < 0.35) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), lamb(c)); m.position.set(x + 0.12, y + 0.14, -1.9); g.add(m); const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), lamb(c)); e1.position.set(x + 0.05, y + 0.24, -1.9); g.add(e1); const e2 = e1.clone(); e2.position.x = x + 0.19; g.add(e2); }
        else if (t < 0.7) cyl(g, 0.07, 0.06, 0.2, c, x + 0.1, y + 0.125, -1.9, 12); else box(g, 0.16, 0.16, 0.16, c, x + 0.1, y + 0.105, -1.9);
        x += 0.28; }
    } }
}
function buildBookstore(r) {
  const g = new THREE.Group(); room(g, { floor: 0xc9a07a, wall: 0xf6ead8 });
  shelfWall(g, r, 'books');
  sign(g, '작은 책방', 1.2, 0.34, 0, 2.95, -2.14, '#6a4a3a', '#fff3c4');
  box(g, 1.4, 0.75, 0.6, 0xb07a52, 1.6, 0.37, 0.2); for (let i = 0; i < 5; i++) box(g, 0.22, 0.05, 0.3, pick(r, [0xff9fb8, 0x8fd3ff, 0xffd84d]), 1.1 + i * 0.25, 0.78, 0.2);
  lampPend(g, -1.0, 2.95, -0.4); lampPend(g, 1.0, 2.95, -0.4);
  return g;
}
function buildPropShop(r) {
  const g = new THREE.Group(); room(g, { floor: 0xf0dcc8, wall: 0xfff0f5 });
  shelfWall(g, r, 'props');
  sign(g, '소품샵 ♡', 1.2, 0.34, 0, 2.95, -2.14, '#ffc0d8', '#fff');
  box(g, 1.2, 0.8, 0.6, 0xffffff, -1.7, 0.4, 0.3); for (let i = 0; i < 4; i++) { const k = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), lamb(pick(r, [0xffd84d, 0x8fd3ff, 0xff9fb8]))); k.position.set(-2.1 + i * 0.27, 0.86, 0.3); g.add(k); }
  for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), basic(0xfff0c0)); b.position.set(-2.2 + i * 0.9, 2.75 - (i % 2) * 0.08, -1.5); g.add(b); }
  return g;
}
function buildLpBar(r) {
  const g = new THREE.Group(); room(g, { floor: 0x4a3a3a, wall: 0x3a3048 });
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) { const c = pick(r, ['#ff6f9f', '#ffd84d', '#4fb3d6', '#f6f0e0', '#9a5ad8', '#ff9f43']); texPlane(g, 0.42, 0.42, canvasTex(84, 84, (x, w, h) => { x.fillStyle = c; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.arc(w / 2, h / 2, 24, 0, 7); x.fill(); }), -2.2 + i * 0.55, 1.3 + row * 0.55, -2.15); }
  sign(g, 'LP BAR', 1.0, 0.32, 0, 2.95, -2.12, '#3a3048', '#ff6fb5');
  box(g, 1.7, 0.06, 0.7, 0x6a4a3a, 0, 0.72, 0.62); box(g, 1.6, 0.66, 0.6, 0x4a3030, 0, 0.36, 0.62);
  const tt = new THREE.Group(); box(tt, 0.4, 0.07, 0.32, 0x2b2b30, 0, 0, 0); const rec = cyl(tt, 0.13, 0.13, 0.01, 0x111111, -0.03, 0.045, 0, 24); cyl(tt, 0.04, 0.04, 0.012, 0xff6f9f, -0.03, 0.05, 0, 12); tt.position.set(0.45, 0.79, 0.62); g.add(tt); g.userData.rec = rec;
  cyl(g, 0.05, 0.04, 0.14, 0xffd84d, -0.45, 0.82, 0.68, 10);
  box(g, 0.5, 0.95, 0.12, 0x6a4a3a, 0, 0.75, -0.42);
  for (let i = 0; i < 3; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), basic(0xffb84d)); l.position.set(-1.6 + i * 1.6, 2.7, -1.2); g.add(l); }
  return g;
}
function buildCatCafe(r) {
  const g = new THREE.Group(); room(g, { floor: 0xf3e0c8, wall: 0xffeedd });
  for (let i = 0; i < 3; i++) cyl(g, 0.35, 0.35, 0.15, pick(r, [0xffc0d8, 0xcde9ff, 0xd8f6ea]), -1.8 + i * 1.8, 0.075, -1.1, 18);
  cyl(g, 0.08, 0.08, 1.8, 0xd9b48a, 2.2, 0.9, -1.6, 10); for (const y of [0.7, 1.4]) cyl(g, 0.35, 0.35, 0.06, 0xf6e3c0, 2.2, y, -1.6, 16); cyl(g, 0.4, 0.4, 0.06, 0xf6e3c0, 2.2, 1.8, -1.6, 16);
  const cat = (c, x, y, z, s = 1, ry = 0) => { const k = new THREE.Group(); const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), lamb(c)); body.scale.set(1.3, 0.9, 1); body.position.y = 0.14; k.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), lamb(c)); head.position.set(0.2, 0.26, 0); k.add(head);
    for (const z2 of [-0.06, 0.06]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.07, 6), lamb(c)); ear.position.set(0.2, 0.37, z2); k.add(ear); }
    for (const z2 of [-0.035, 0.035]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), basic(0x2a1a14)); e.position.set(0.3, 0.28, z2); k.add(e); }
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.3, 6), lamb(c)); tail.position.set(-0.24, 0.28, 0); tail.rotation.z = 0.5; k.add(tail);
    k.position.set(x, y, z); k.scale.setScalar(s); k.rotation.y = ry; g.add(k); return k; };
  cat(0xf6c08a, -1.8, 0.15, -1.1, 1.1, -0.4); cat(0xffffff, 2.2, 1.83, -1.6, 0.9, -1.2); cat(0x5a5a64, 1.4, 0, 0.4, 1.0, -2.2); g.userData.lapCat = cat(0xd9d0c8, 0.45, 0, 0.55, 1.1, -2.6);
  sign(g, '고양이 카페', 1.3, 0.34, -0.6, 2.75, -2.14, '#f6c08a', '#fff');
  box(g, 0.9, 0.06, 0.5, 0xffffff, 0, 0.42, 0.75); cyl(g, 0.05, 0.05, 0.4, 0xd9b48a, 0, 0.2, 0.75, 8);
  cyl(g, 0.3, 0.32, 0.5, 0xffc0d8, 0, 0.25, -0.02, 18); // 앉는 쿠션
  return g;
}
function buildArcade(r) {
  const g = new THREE.Group(); room(g, { floor: 0x2b2840, wall: 0x3a3060 });
  for (let i = 0; i < 4; i++) { const x = -2.1 + i * 1.4; box(g, 0.8, 1.7, 0.6, pick(r, [0xff6fb5, 0x4fb3d6, 0xffd84d, 0x9a5ad8]), x, 0.85, -1.7);
    texPlane(g, 0.62, 0.5, canvasTex(124, 100, (c, w, h) => { const gg = c.createLinearGradient(0, 0, w, h); gg.addColorStop(0, pick(r, ['#2fd6ff', '#ff6fb5', '#9df2c8'])); gg.addColorStop(1, '#2b2840'); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `900 22px ${FONT}`; c.textAlign = 'center'; c.fillText(['SCORE', '1P', 'GAME', 'WIN!'][i], w / 2, 56); }), x, 1.3, -1.39); }
  const claw = new THREE.Group(); box(claw, 0.9, 0.5, 0.8, 0xff9fcf, 0, 0.25, 0); const gl = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.9, 0.76), new THREE.MeshLambertMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.3 })); gl.position.y = 0.95; claw.add(gl);
  for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), lamb(pick(r, [0xffd84d, 0x8fd3ff, 0xffc0d8, 0x9df2c8]))); p.position.set((r() - 0.5) * 0.6, 0.6, (r() - 0.5) * 0.5); claw.add(p); }
  box(claw, 0.9, 0.15, 0.8, 0xff6fb5, 0, 1.45, 0); claw.position.set(2.0, 0, 0.2); g.add(claw);
  sign(g, 'GAME ZONE', 1.4, 0.36, 0, 2.85, -2.12, '#2b2840', '#ffd84d');
  for (let i = 0; i < 10; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), basic(pick(r, [0xff6fb5, 0x2fd6ff, 0xffd84d]))); b.position.set(-2.4 + i * 0.53, 2.5, -2.1); g.add(b); }
  return g;
}
function buildGallery(r) {
  const g = new THREE.Group(); room(g, { floor: 0xe8e4dc, wall: 0xfafafa });
  for (let i = 0; i < 3; i++) { texPlane(g, 1.1, 0.8, canvasTex(220, 160, (c, w, h) => { c.fillStyle = '#2b2b30'; c.fillRect(0, 0, w, h); c.fillStyle = '#f6f2ea'; c.fillRect(8, 8, w - 16, h - 16);
      for (let k = 0; k < 5; k++) { c.fillStyle = pick(r, ['#4a5aa8', '#ff6f6f', '#ffd84d', '#2b2b30', '#9df2c8']); if (r() < 0.5) { c.beginPath(); c.arc(30 + r() * 160, 30 + r() * 100, 12 + r() * 26, 0, 7); c.fill(); } else c.fillRect(20 + r() * 150, 20 + r() * 90, 20 + r() * 50, 8 + r() * 40); } }), -1.7 + i * 1.7, 1.85, -2.15);
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.16, 10), basic(0xfff6d8)); sp.position.set(-1.7 + i * 1.7, 2.75, -1.95); sp.rotation.x = Math.PI; g.add(sp); }
  box(g, 1.6, 0.4, 0.45, 0xb8b0a4, 0, 0.2, 1.3);
  sign(g, 'EXHIBITION', 1.2, 0.26, 0, 2.95, -2.14, '#fafafa', '#2b2b30');
  return g;
}
function buildStore(r) { // 편의점 앞 파라솔 테이블
  const g = new THREE.Group();
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), lamb(0x6a6478)); gr.rotation.x = -Math.PI / 2; g.add(gr);
  box(g, 6, 3.2, 0.3, 0xf6f6f2, 0, 1.6, -2.4);
  texPlane(g, 3.6, 1.6, canvasTex(360, 160, (c, w, h) => { c.fillStyle = '#e6f6ff'; c.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) { c.fillStyle = pick(r, ['#ff9fb8', '#ffd84d', '#8fd3ff', '#9df2c8']); c.fillRect(18 + i * 86, 20 + k * 46, 60, 26); } }), -0.6, 1.3, -2.24);
  box(g, 6, 0.4, 0.32, 0x2fb36a, 0, 2.9, -2.22); sign(g, '24 편의점', 1.4, 0.32, -0.6, 2.9, -2.04, '#2fb36a', '#fff');
  box(g, 0.9, 2.0, 0.05, 0xcde9ff, 1.9, 1.0, -2.23, new THREE.MeshBasicMaterial({ color: 0xe6f6ff }));
  bareTable(g, 0.62, 0x2fb36a, 1.2); const cup = cyl(g, 0.09, 0.07, 0.14, 0xffffff, -0.3, 0.82, 0.68, 14); cyl(g, 0.09, 0.09, 0.01, 0xff4d4d, -0.3, 0.89, 0.68, 14); steam(g, -0.3, 0.98, 0.68); cyl(g, 0.09, 0.07, 0.14, 0xffffff, 0.3, 0.82, 0.68, 14); cyl(g, 0.09, 0.09, 0.01, 0xff9f43, 0.3, 0.89, 0.68, 14);
  box(g, 0.5, 0.6, 0.1, 0x2fb36a, 0, 0.72, -0.42);
  const sgeo = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < 60; i++) sp.push((r() - 0.5) * 20, 3.4 + r() * 4, -4 - r() * 3); sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.06 })));
  return g;
}
function buildBeach(r) { // 밤바다
  const g = new THREE.Group();
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), lamb(0xe8d2a8)); sand.rotation.x = -Math.PI / 2; sand.position.z = 2; g.add(sand);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), lamb(0x3a4a8a)); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.02, -12); g.add(sea);
  const waves = []; for (let i = 0; i < 3; i++) { const w = box(g, 14, 0.02, 0.08, 0xf6f6ff, 0, 0.03, -2.2 - i * 0.9); waves.push(w); } g.userData.waves = waves;
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), basic(0xfff6c8)); moon.position.set(2.6, 3.6, -10); g.add(moon);
  const refl = box(g, 0.6, 0.01, 4, 0, 2.2, 0.03, -6, new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0.35 }));
  const sgeo = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < 120; i++) sp.push((r() - 0.5) * 24, 2 + r() * 6, -9 - r() * 2); sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.07 })));
  // 폭죽 (special 'fireworks')
  const fw = new THREE.Group(); fw.visible = false; g.add(fw); g.userData.fw = fw;
  for (let b = 0; b < 3; b++) { const burst = new THREE.Group(); burst.position.set(-2 + b * 2, 2.6 + (b % 2) * 0.6, -5); const col = [0xff6fb5, 0xffd84d, 0x8fd3ff][b];
    for (let i = 0; i < 18; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), basic(col)); const a = (i / 18) * Math.PI * 2; s.userData.dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0); burst.add(s); } fw.add(burst); }
  return g;
}
function buildPark(r) { // 저녁 공원 (비 그친 뒤)
  const g = new THREE.Group();
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), lamb(0x8fbf7a)); gr.rotation.x = -Math.PI / 2; g.add(gr);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(30, 2.2), lamb(0xd9c8a8)); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.01, 0.3); g.add(path);
  for (let i = 0; i < 8; i++) { const x = -5 + i * 1.5 + (r() - 0.5) * 0.5, z = -2.4 - r() * 2.5; cyl(g, 0.08, 0.1, 1.3, 0x8a6a52, x, 0.65, z, 8); const c = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 + r() * 0.3, 0), lamb(pick(r, [0x7fbf6a, 0x6aaf5a, 0x9ccf8a]))); c.position.set(x, 1.7, z); g.add(c); }
  box(g, 1.4, 0.08, 0.45, 0xb07a52, -1.4, 0.45, -0.9); box(g, 1.4, 0.35, 0.06, 0xb07a52, -1.4, 0.7, -1.1); for (const x of [-2, -0.8]) box(g, 0.06, 0.45, 0.4, 0x3a3a48, x, 0.22, -0.9);
  box(g, 0.08, 2.6, 0.08, 0x2f2f3a, 1.9, 1.3, -0.6); const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), basic(0xfff0c0)); bulb.position.set(1.9, 2.65, -0.6); g.add(bulb);
  for (let i = 0; i < 4; i++) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.25 + r() * 0.3, 16), new THREE.MeshLambertMaterial({ color: 0x9ab0d8, transparent: true, opacity: 0.6 })); p.rotation.x = -Math.PI / 2; p.position.set(-2 + i * 1.3, 0.02, 0.6 + r() * 0.5); g.add(p); } // 물웅덩이
  return g;
}
function buildRiver(r) { // 밤 한강 벤치
  const g = new THREE.Group();
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(30, 8), lamb(0x5a6a5a)); gr.rotation.x = -Math.PI / 2; gr.position.z = 2; g.add(gr);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), lamb(0x2a3060)); water.rotation.x = -Math.PI / 2; water.position.set(0, 0.01, -12); g.add(water);
  const ct = cityTex(r); const city = new THREE.Mesh(new THREE.PlaneGeometry(24, 3), new THREE.MeshBasicMaterial({ map: ct })); city.position.set(0, 1.4, -14); g.add(city);
  const bridge = new THREE.Group(); box(bridge, 26, 0.25, 0.4, 0x4a4a6a, 0, 2.2, 0); for (let i = 0; i < 26; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), basic(i % 3 ? 0xfff0c0 : 0xff9fcf)); l.position.set(-12.5 + i, 2.36, 0.21); bridge.add(l); } for (let i = 0; i < 6; i++) box(bridge, 0.3, 2.2, 0.3, 0x4a4a6a, -10 + i * 4, 1.1, 0); bridge.position.z = -9; g.add(bridge);
  box(g, 1.8, 0.08, 0.45, 0xb07a52, 0, 0.45, -0.1); box(g, 1.8, 0.35, 0.06, 0xb07a52, 0, 0.72, -0.32); for (const x of [-0.8, 0.8]) box(g, 0.06, 0.45, 0.4, 0x3a3a48, x, 0.22, -0.1);
  cyl(g, 0.06, 0.05, 0.14, 0xffd84d, 0.6, 0.56, -0.05, 10);
  const sgeo = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < 80; i++) sp.push((r() - 0.5) * 24, 3 + r() * 5, -13); sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.06 })));
  return g;
}
function buildSubway(r) {
  const g = new THREE.Group(); room(g, { floor: 0xb8bcc4, wall: 0xe6eef2 });
  for (let i = 0; i < 4; i++) { box(g, 1.1, 2.2, 0.04, 0, -1.8 + i * 1.2, 1.1, -1.9, new THREE.MeshLambertMaterial({ color: 0xcde9ff, transparent: true, opacity: 0.45 })); box(g, 0.08, 2.3, 0.1, 0x9aa3b5, -2.35 + i * 1.2, 1.15, -1.88); }
  box(g, 6, 0.12, 0.3, 0xffd84d, 0, 0.06, 0.2);
  for (let i = 0; i < 8; i++) box(g, 0.6, 0.6, 0.02, 0xd6e2ea, -2.4 + i * 0.7, 2.75, -2.15);
  const board = texPlane(g, 1.6, 0.4, canvasTex(480, 120, (c, w, h) => { c.fillStyle = '#1d1d24'; rr(c, 0, 0, w, h, 16); c.fill(); c.fillStyle = '#ffb84d'; c.font = `900 44px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('열차 도착 2분 전', w / 2, h / 2 + 2); }), 0.4, 2.6, -1.5); board.rotation.x = 0.1;
  box(g, 0.05, 0.6, 0.05, 0x3a3a48, 0.4, 2.95, -1.5);
  return g;
}
function buildCar(r) { // 밤 드라이브 (앞 유리 너머로 보는 운전석)
  const g = new THREE.Group();
  const ct = cityTex(r); ct.wrapS = THREE.RepeatWrapping; ct.repeat.set(0.5, 1);
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), new THREE.MeshBasicMaterial({ map: ct })); bg.position.set(0, 2.0, -3.5); g.add(bg); g.userData.city = ct;
  box(g, 3.2, 0.12, 2.6, 0x2b2b38, 0, 0.3, 0); box(g, 0.6, 0.7, 0.15, 0x3a3a4a, 0, 0.75, -0.45); // 바닥 + 좌석
  box(g, 3.2, 0.4, 0.6, 0x2b2b38, 0, 0.6, 0.95); // 대시보드
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 24), lamb(0x1d1d24)); wheel.position.set(0, 0.88, 0.7); wheel.rotation.x = -0.9; g.add(wheel); g.userData.wheel = wheel;
  for (const x of [-1.55, 1.55]) box(g, 0.08, 1.6, 0.08, 0x2b2b38, x, 1.75, 1.0); box(g, 3.2, 0.1, 0.1, 0x2b2b38, 0, 2.55, 0.9);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.5), new THREE.MeshBasicMaterial({ color: 0xcde9ff, transparent: true, opacity: 0.08 })); glass.position.set(0, 1.8, 1.05); g.add(glass);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.12), basic(0x8fd3ff)); glow.position.set(0.7, 1.0, 0.66); glow.rotation.x = -0.6; g.add(glow);
  return g;
}

// ================= 남은 유형 음식점 · 코스 장소 =================
function bowl(g, x, z, col, top, r = 0.14, y = 0.76) { cyl(g, r, r * 0.68, r * 0.8, col, x, y + r * 0.4, z, 18); const t = cyl(g, r * 0.9, r * 0.9, 0.01, top, x, y + r * 0.8, z, 18); return t; }
function plate(g, x, z, col = 0xffffff, r = 0.17) { cyl(g, r, r * 0.9, 0.025, col, x, 0.765, z, 20); }
function foods(g, r, kind, z) {
  if (kind === 'mala') { for (const x of [-0.38, 0.38]) { bowl(g, x, z, 0xffffff, 0xd8352a); for (let i = 0; i < 4; i++) { const p = box(g, 0.05, 0.02, 0.05, pick(r, [0x8fd36a, 0xffd84d, 0xf6e0c0]), x + (r() - 0.5) * 0.14, 0.89, z + (r() - 0.5) * 0.14); p.rotation.y = r(); } } cyl(g, 0.05, 0.05, 0.12, 0xffd8b0, 0, 0.82, z + 0.12, 10); }
  if (kind === 'donkatsu') { for (const x of [-0.38, 0.38]) { plate(g, x, z); const k = box(g, 0.2, 0.04, 0.1, 0xd89a48, x - 0.03, 0.8, z); k.rotation.y = 0.2; const cab = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), lamb(0xc8e8a0)); cab.scale.y = 0.5; cab.position.set(x + 0.09, 0.8, z + 0.04); g.add(cab); } cyl(g, 0.05, 0.05, 0.03, 0x5a3a2a, 0, 0.78, z + 0.12, 12); }
  if (kind === 'shabu') { cyl(g, 0.26, 0.22, 0.12, 0xb8bcc4, 0, 0.82, z, 22); cyl(g, 0.24, 0.24, 0.01, 0xf3e6c8, 0, 0.88, z, 22); steam(g, 0, 0.98, z); for (const x of [-0.5, 0.5]) { plate(g, x, z + 0.08, 0xffffff, 0.12); for (let i = 0; i < 3; i++) box(g, 0.07, 0.015, 0.05, i ? 0xff9fa8 : 0x8fd36a, x - 0.04 + i * 0.04, 0.79, z + 0.08); } }
  if (kind === 'pho') { for (const x of [-0.38, 0.38]) { bowl(g, x, z, 0xffffff, 0xf6e2b8, 0.15); for (let i = 0; i < 3; i++) { const l = box(g, 0.04, 0.01, 0.03, 0x5fb35a, x + (i - 1) * 0.04, 0.89, z); } steam(g, x, 0.98, z); } }
  if (kind === 'dakgalbi') { cyl(g, 0.34, 0.32, 0.05, 0x3a3a40, 0, 0.79, z, 24); cyl(g, 0.32, 0.32, 0.01, 0xe8582a, 0, 0.82, z, 24); for (let i = 0; i < 10; i++) { const p = box(g, 0.06, 0.02, 0.04, pick(r, [0xf6e0a0, 0xc8e8a0, 0xffffff, 0xd8352a]), (r() - 0.5) * 0.48, 0.835, z + (r() - 0.5) * 0.4); p.rotation.y = r() * 3; } }
  if (kind === 'burger') { for (const x of [-0.38, 0.38]) { box(g, 0.32, 0.02, 0.24, 0xff4d4d, x, 0.76, z); const b = new THREE.Group(); cyl(b, 0.08, 0.08, 0.03, 0xd89a48, 0, 0, 0, 16); cyl(b, 0.085, 0.085, 0.025, 0x5a3020, 0, 0.03, 0, 16); cyl(b, 0.09, 0.09, 0.01, 0x8fd36a, 0, 0.05, 0, 16); const top = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), lamb(0xe8a858)); top.position.y = 0.055; b.add(top); b.position.set(x - 0.05, 0.79, z); g.add(b); for (let i = 0; i < 5; i++) box(g, 0.015, 0.1, 0.015, 0xffd84d, x + 0.08 + (i % 3) * 0.02, 0.82, z + (i - 2) * 0.015); } }
  if (kind === 'pizza') { cyl(g, 0.3, 0.3, 0.02, 0xb8bcc4, 0, 0.76, z, 24); cyl(g, 0.28, 0.28, 0.02, 0xe8b860, 0, 0.78, z, 24); cyl(g, 0.25, 0.25, 0.01, 0xd8452a, 0, 0.795, z, 24); for (let i = 0; i < 9; i++) cyl(g, 0.03, 0.03, 0.01, i % 2 ? 0x8a2a2a : 0xfff3c4, (r() - 0.5) * 0.36, 0.805, z + (r() - 0.5) * 0.36, 10); }
  if (kind === 'naengmyeon') { for (const x of [-0.38, 0.38]) { bowl(g, x, z, 0xd8dce4, 0xd8c0a0, 0.16); const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), lamb(0xffffff)); e.position.set(x, 0.9, z); g.add(e); for (let i = 0; i < 3; i++) { const ic = box(g, 0.04, 0.04, 0.04, 0, x + (i - 1) * 0.05, 0.89, z + 0.06, new THREE.MeshLambertMaterial({ color: 0xe6f6ff, transparent: true, opacity: 0.7 })); } } }
  if (kind === 'jjajang') { for (const x of [-0.38, 0.38]) { bowl(g, x, z, 0xffffff, 0x2a1a14, 0.15); box(g, 0.08, 0.01, 0.02, 0x8fd36a, x, 0.89, z); } cyl(g, 0.08, 0.07, 0.03, 0xffffff, 0, 0.77, z + 0.15, 12); box(g, 0.06, 0.01, 0.04, 0xffd84d, 0, 0.79, z + 0.15); }
  if (kind === 'curry') { for (const x of [-0.38, 0.38]) { plate(g, x, z); const rice = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), lamb(0xffffff)); rice.scale.y = 0.6; rice.position.set(x - 0.05, 0.8, z); g.add(rice); cyl(g, 0.09, 0.09, 0.01, 0xe8a820, x + 0.05, 0.785, z, 16); } }
  if (kind === 'steak') { for (const x of [-0.38, 0.38]) { plate(g, x, z, 0xffffff, 0.18); const s = box(g, 0.14, 0.04, 0.1, 0x6a3020, x, 0.8, z); s.rotation.y = 0.3; const gl = new THREE.Group(); cyl(gl, 0.005, 0.005, 0.12, 0xe6f6ff, 0, 0, 0, 6); cyl(gl, 0.04, 0.02, 0.07, 0x8a2a3a, 0, 0.09, 0, 10); gl.position.set(x * 0.5, 0.83, z - 0.15); g.add(gl); } cyl(g, 0.03, 0.03, 0.14, 0xfff8e8, 0, 0.83, z - 0.1, 10); }
}
function buildRest(r, o) { const g = buildDiner(r, { ...o, kind: 'none' }); foods(g, r, o.kind, 0.68); if (o.lanterns) for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), basic(o.lanterns)); l.scale.y = 1.3; l.position.set(-2.2 + i * 1.45, 2.6, -1.9); g.add(l); } if (o.plants) { plant(g, -2.4, -1.4, 1.1); plant(g, 2.4, -1.4, 0.9); } return g; }

function ground(g, col, z = 0) { const gr = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), lamb(col)); gr.rotation.x = -Math.PI / 2; gr.position.z = z; g.add(gr); return gr; }
function stars(g, r, n = 90, z = -9) { const sgeo = new THREE.BufferGeometry(); const sp = []; for (let i = 0; i < n; i++) sp.push((r() - 0.5) * 24, 2.5 + r() * 6, z - r() * 2); sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.06 }))); }
function bulbs(g, r, y, z, cols = [0xfff0c0, 0xff9fcf, 0x8fd3ff], n = 12, x0 = -2.6, x1 = 2.6) { for (let i = 0; i < n; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), basic(cols[i % cols.length])); b.position.set(x0 + (x1 - x0) * i / (n - 1), y - Math.sin(i / (n - 1) * Math.PI) * 0.15, z); g.add(b); } }
function seat(g, col, x, z, y = 0.5) { box(g, 0.55, 0.9, 0.12, col, x, y + 0.25, z - 0.42); }
function tree(g, r, x, z, s = 1) { cyl(g, 0.08 * s, 0.1 * s, 1.3 * s, 0x8a6a52, x, 0.65 * s, z, 8); const c = new THREE.Mesh(new THREE.IcosahedronGeometry((0.7 + r() * 0.3) * s, 0), lamb(pick(r, [0x7fbf6a, 0x6aaf5a, 0x9ccf8a]))); c.position.set(x, 1.7 * s, z); g.add(c); }

function buildVenue(r, k) {
  const g = new THREE.Group();
  const T = (w, h, x, y, z, draw) => texPlane(g, w, h, canvasTex(Math.round(w * 200), Math.round(h * 200), draw), x, y, z);
  switch (k) {
    case 'escape': { room(g, { floor: 0x3a3040, wall: 0x4a3a48 }); sign(g, 'ESCAPE ROOM', 1.4, 0.32, 0, 2.85, -2.14, '#2b2430', '#ff5f5f');
      box(g, 0.9, 1.9, 0.1, 0x6a4a3a, -1.6, 0.95, -2.1); cyl(g, 0.05, 0.05, 0.04, 0xffd84d, -1.25, 0.95, -2.03, 8);
      for (let i = 0; i < 3; i++) { const b = box(g, 0.4, 0.3, 0.3, 0x8a5a3a, 0.8 + i * 0.5, 0.15, -1.4); box(g, 0.08, 0.1, 0.02, 0xffd84d, 0.8 + i * 0.5, 0.2, -1.24); }
      T(0.5, 0.5, 1.6, 1.9, -2.14, (x, w, h) => { x.fillStyle = '#f6f0e0'; x.beginPath(); x.arc(w / 2, h / 2, w / 2 - 4, 0, 7); x.fill(); x.strokeStyle = '#2b2430'; x.lineWidth = 6; x.beginPath(); x.moveTo(w / 2, h / 2); x.lineTo(w / 2, 18); x.moveTo(w / 2, h / 2); x.lineTo(w - 26, h / 2); x.stroke(); });
      const kp = T(0.32, 0.42, 0.2, 1.3, -2.14, (x, w, h) => { x.fillStyle = '#2b2b30'; x.fillRect(0, 0, w, h); x.fillStyle = '#8fffa8'; x.font = `900 20px ${FONT}`; x.fillText('_ _ _ _', 8, 24); for (let i = 0; i < 9; i++) { x.fillStyle = '#d8dce4'; x.fillRect(8 + (i % 3) * 20, 34 + Math.floor(i / 3) * 16, 14, 12); } });
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), basic(0xff5f5f)); lamp.position.set(0, 2.6, -1.8); g.add(lamp); break; }
    case 'planetarium': { const dome = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x141838, side: THREE.BackSide })); g.add(dome); ground(g, 0x2a2a40); stars(g, r, 260, -6);
      for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), basic(0xfff6c8)); s.position.set(-2 + i * 0.7, 3 + Math.sin(i) * 0.6, -5); g.add(s); }
      for (const x of [-1.4, 1.4]) { box(g, 0.7, 0.4, 0.7, 0x4a4a68, x, 0.2, 0.2); box(g, 0.7, 0.6, 0.15, 0x4a4a68, x, 0.6, -0.15).rotation.x = -0.4; } box(g, 0.7, 0.4, 0.7, 0x4a4a68, 0, 0.2, 0.2); const bk = box(g, 0.7, 0.6, 0.15, 0x4a4a68, 0, 0.6, -0.15); bk.rotation.x = -0.4; break; }
    case 'pocha': { ground(g, 0x4a4458); const tent = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 4), new THREE.MeshLambertMaterial({ color: 0xff8a3a, transparent: true, opacity: 0.55, side: THREE.BackSide })); tent.position.set(0, 1.6, -0.2); g.add(tent);
      bareTable(g, 0.62, 0xe6e6e6, 1.3); for (let i = 0; i < 2; i++) { const b = cyl(g, 0.04, 0.045, 0.24, 0x2fb36a, -0.5 + i * 0.12, 0.87, 0.5, 10); } plate(g, 0.3, 0.7, 0xffffff, 0.15); for (let i = 0; i < 3; i++) { const sk = box(g, 0.2, 0.02, 0.03, 0xd8603a, 0.3, 0.8, 0.64 + i * 0.05); }
      cyl(g, 0.2, 0.2, 0.45, 0xff6f6f, 0, 0.22, -0.05, 14); for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), basic(0xffe08a)); l.position.set(-2 + i * 1.3, 2.7, -1.2); g.add(l); } sign(g, '포장마차', 1.2, 0.34, 0, 2.9, -2.1, '#ff8a3a', '#fff'); break; }
    case 'bowling': { room(g, { floor: 0xd8b88a, wall: 0x3a3a6a }); for (let i = 0; i < 3; i++) { box(g, 0.9, 0.02, 6, 0xe8c898, -1.6 + i * 1.6, 0.01, -2); for (const sx of [-1, 1]) box(g, 0.1, 0.06, 6, 0x5a5a6a, -1.6 + i * 1.6 + sx * 0.5, 0.03, -2); for (let p = 0; p < 6; p++) { const pin = cyl(g, 0.03, 0.05, 0.22, 0xffffff, -1.6 + i * 1.6 + ((p % 3) - 1) * 0.12, 0.11, -4.4 - Math.floor(p / 3) * 0.15, 8); } }
      for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), lamb(pick(r, [0xff6fb5, 0x4f7bd6, 0x2fb36a, 0xffd84d]))); b.position.set(1.9 + (i % 2) * 0.25, 0.6, 0.4 + Math.floor(i / 2) * 0.25); g.add(b); } box(g, 0.6, 0.5, 0.6, 0x3a3a48, 2.0, 0.25, 0.5);
      sign(g, 'STRIKE!', 1.2, 0.36, 0, 2.6, -2.14, '#3a3a6a', '#ffd84d'); bulbs(g, r, 2.95, -2.1); break; }
    case 'cinema': { room(g, { floor: 0x5a2a3a, wall: 0x2a1a24 }); const scr = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.8), basic(0xd8e6ff)); scr.position.set(0, 2.0, -2.15); g.add(scr);
      for (const x of [-1.2, 1.2]) seat(g, 0xb8304a, x, 0.2); seat(g, 0xb8304a, 0, 0.2); const pc = new THREE.Group(); cyl(pc, 0.12, 0.09, 0.26, 0xff4d4d, 0, 0, 0, 12); for (let i = 0; i < 8; i++) { const k = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), lamb(0xfff3c4)); k.position.set((r() - 0.5) * 0.16, 0.15, (r() - 0.5) * 0.16); pc.add(k); } pc.position.set(0.55, 0.75, 0.3); g.add(pc); break; }
    case 'garden': { ground(g, 0x8fbf7a); const path = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 20), lamb(0xe8dcc0)); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.01, -2); g.add(path);
      for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) { box(g, 1.2, 0.6, 0.9, 0x5f9f4f, sx * 1.6, 0.3, -1 - i * 1.6); for (let f = 0; f < 4; f++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), lamb(pick(r, [0xff9fcf, 0xffffff, 0xffd84d, 0xc9a7ff]))); fl.position.set(sx * 1.6 + (r() - 0.5) * 0.9, 0.63, -1 - i * 1.6 + (r() - 0.5) * 0.6); g.add(fl); } } tree(g, r, -3.2, -5, 1.2); tree(g, r, 3.3, -5.5, 1.3); break; }
    case 'flower': { room(g, { floor: 0xe8dcc8, wall: 0xf3f6ea }); for (let i = 0; i < 7; i++) { const x = -2.4 + i * 0.8; cyl(g, 0.18, 0.14, 0.35, 0xb8bcc4, x, 0.6, -1.7, 12); box(g, 0.2, 0.42, 0.2, 0x8a6a52, x, 0.21, -1.7); for (let f = 0; f < 6; f++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), lamb(pick(r, [0xff6f9f, 0xffd84d, 0xffffff, 0xff9f43, 0xc9a7ff]))); fl.position.set(x + (r() - 0.5) * 0.25, 0.9 + r() * 0.2, -1.7 + (r() - 0.5) * 0.2); g.add(fl); } }
      box(g, 1.4, 0.9, 0.6, 0xffffff, 1.6, 0.45, 0.4); sign(g, '꽃집 🌷', 1.1, 0.32, 0, 2.8, -2.14, '#5fb38a', '#fff'); break; }
    case 'bakery': { room(g, { floor: 0xe8d0b0, wall: 0xfff3e0 }); box(g, 1.4, 1.2, 0.7, 0xb8bcc4, -1.6, 0.6, -1.7); const ov = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), basic(0xffa040)); ov.position.set(-1.6, 0.75, -1.34); g.add(ov);
      box(g, 2.4, 0.9, 0.7, 0xf6f0e0, 0.6, 0.45, 0.4); for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), lamb(pick(r, [0xe8a858, 0xd89a48, 0xf0c878]))); b.scale.set(1.3, 0.7, 1); b.position.set(-0.3 + i * 0.35, 0.95, 0.4); g.add(b); } sign(g, '원데이 베이킹', 1.4, 0.32, 0.6, 2.7, -2.14, '#d89a48', '#fff'); break; }
    case 'picnic': { ground(g, 0x9fcf8a); const river = new THREE.Mesh(new THREE.PlaneGeometry(40, 8), lamb(0x8fc8f0)); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.01, -8); g.add(river);
      const mat = T(2.2, 1.6, 0, 0.02, 0.4, (x, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { x.fillStyle = (i + j) % 2 ? '#ff8fa8' : '#ffffff'; x.fillRect(i * w / 8, j * h / 6, w / 8, h / 6); } }); mat.rotation.x = -Math.PI / 2;
      box(g, 0.4, 0.25, 0.3, 0xc9a07a, 0.8, 0.14, 0.6); cyl(g, 0.06, 0.06, 0.2, 0xffd84d, -0.7, 0.12, 0.7, 10); tree(g, r, -3, -3, 1.2); tree(g, r, 3.2, -3.5, 1.1); break; }
    case 'teahouse': { room(g, { floor: 0xc9a87a, wall: 0xf6efe0 }); for (let i = 0; i < 4; i++) { const p = T(1.0, 1.6, -1.8 + i * 1.2, 1.4, -2.14, (x, w, h) => { x.fillStyle = '#fffaf0'; x.fillRect(0, 0, w, h); x.strokeStyle = '#8a6a52'; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6); for (let k = 1; k < 4; k++) { x.beginPath(); x.moveTo(0, h * k / 4); x.lineTo(w, h * k / 4); x.stroke(); } x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.stroke(); }); }
      box(g, 1.4, 0.06, 0.8, 0x8a5a3a, 0, 0.42, 0.62); for (const x of [-0.45, 0.45]) box(g, 0.08, 0.38, 0.08, 0x6a4a3a, x, 0.2, 0.62); cyl(g, 0.09, 0.08, 0.12, 0x7a9a7a, 0, 0.52, 0.62, 12); for (const x of [-0.3, 0.3]) cyl(g, 0.045, 0.035, 0.05, 0xf6f0e0, x, 0.48, 0.7, 10); steam(g, 0, 0.62, 0.62);
      box(g, 0.7, 0.12, 0.6, 0x8fa88a, 0, 0.06, -0.05); break; }
    case 'rooftop': { ground(g, 0x6a6478); const ct = cityTex(r); const city = new THREE.Mesh(new THREE.PlaneGeometry(26, 4), new THREE.MeshBasicMaterial({ map: ct })); city.position.set(0, 1.0, -9); g.add(city); stars(g, r, 120, -10);
      box(g, 8, 0.06, 0.06, 0xd8dce4, 0, 1.05, -1.6); for (let i = 0; i < 9; i++) box(g, 0.04, 1.05, 0.04, 0xd8dce4, -4 + i, 0.52, -1.6); bulbs(g, r, 2.6, -1.4, [0xfff0c0], 14); plant(g, -2.4, -1.0, 0.8); plant(g, 2.4, -1.0, 0.9); break; }
    case 'forest': { ground(g, 0x6f9f5f); const path = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 24), lamb(0xc8b088)); path.rotation.x = -Math.PI / 2; path.position.set(0.2, 0.01, -4); g.add(path);
      for (let i = 0; i < 14; i++) { const sx = i % 2 ? 1 : -1; tree(g, r, sx * (1.3 + r() * 2), -0.8 - i * 0.7, 1.1 + r() * 0.5); } for (let i = 0; i < 8; i++) { const l = new THREE.Mesh(new THREE.CircleGeometry(0.2 + r() * 0.2, 10), new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0.35 })); l.rotation.x = -Math.PI / 2; l.position.set((r() - 0.5) * 3, 0.02, -r() * 4); g.add(l); } break; }
    case 'amusement': { ground(g, 0xd8c8a8); const wh = new THREE.Group(); const rim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.06, 8, 48), lamb(0xffffff)); wh.add(rim); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const sp = box(wh, 0.04, 2.2, 0.04, 0xffffff, Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0); sp.rotation.z = a + Math.PI / 2; const cab = box(wh, 0.35, 0.35, 0.35, pick(r, [0xff6fb5, 0xffd84d, 0x8fd3ff, 0x9df2c8]), Math.cos(a) * 2.2, Math.sin(a) * 2.2 - 0.2, 0); }
      wh.position.set(-2.4, 3.2, -6); g.add(wh); g.userData.wheel = wh; for (const x of [-3.2, -1.6]) { const l = box(g, 0.1, 3.4, 0.1, 0xb8bcc4, x, 1.6, -6); l.rotation.z = x < -2 ? -0.25 : 0.25; }
      const track = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.06, 6, 40, Math.PI), lamb(0xff4d4d)); track.position.set(2.6, 1.0, -5.5); g.add(track); for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), lamb(pick(r, [0xff6fb5, 0xffd84d, 0x8fd3ff]))); b.scale.y = 1.2; b.position.set(1.6 + i * 0.12, 2.1 + (i % 2) * 0.2, -0.6); g.add(b); box(g, 0.005, 0.7, 0.005, 0xffffff, 1.6 + i * 0.12, 1.65, -0.6); } break; }
    case 'batting': { ground(g, 0x5f9f5f); const net = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({ color: 0x2b2b30, wireframe: true, transparent: true, opacity: 0.35 })); net.position.set(0, 2, -2.4); g.add(net);
      box(g, 0.6, 1.0, 0.6, 0x4f7bd6, 0, 0.5, -5); const disp = T(1.2, 0.5, 0, 2.6, -4.9, (x, w, h) => { x.fillStyle = '#1d1d24'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffd84d'; x.font = `900 52px ${FONT}`; x.textAlign = 'center'; x.fillText('120km/h', w / 2, h / 2 + 18); }); const home = T(0.5, 0.5, 0.4, 0.02, 0.6, (x, w, h) => { x.fillStyle = '#fff'; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, 0); x.lineTo(w, h / 2); x.lineTo(w / 2, h); x.lineTo(0, h / 2); x.fill(); }); home.rotation.x = -Math.PI / 2; break; }
    case 'kart': { ground(g, 0x4a4a58); for (let i = 0; i < 12; i++) box(g, 0.6, 0.3, 0.3, i % 2 ? 0xff4d4d : 0xffffff, -3.3 + i * 0.6, 0.15, -1.6); const cf = T(1.2, 0.4, 0, 2.4, -3, (x, w, h) => { for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? '#111' : '#fff'; x.fillRect(i * w / 12, j * h / 4, w / 12, h / 4); } });
      for (const [x, c] of [[-1.6, 0xffd84d], [1.8, 0x4f7bd6]]) { const k = new THREE.Group(); box(k, 0.6, 0.15, 0.9, c, 0, 0.18, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const w = cyl(k, 0.1, 0.1, 0.08, 0x1d1d24, sx * 0.32, 0.1, sz * 0.3, 10); w.rotation.z = Math.PI / 2; } k.position.set(x, 0, -0.4); g.add(k); } break; }
    case 'karaoke': { room(g, { floor: 0x2b2840, wall: 0x3a2a5a }); const sc = T(1.8, 1.0, 0, 1.9, -2.14, (x, w, h) => { const gg = x.createLinearGradient(0, 0, w, h); gg.addColorStop(0, '#6f5fd8'); gg.addColorStop(1, '#ff6fb5'); x.fillStyle = gg; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = `900 30px ${FONT}`; x.textAlign = 'center'; x.fillText('♪ 노래 제목 ♪', w / 2, h / 2 - 10); x.fillStyle = '#ffd84d'; x.fillText('점수 100', w / 2, h / 2 + 40); });
      box(g, 3.0, 0.45, 0.6, 0xff6fb5, 0, 0.22, -0.4); box(g, 3.0, 0.6, 0.15, 0xff6fb5, 0, 0.6, -0.7); box(g, 1.2, 0.4, 0.5, 0x3a3a48, 0, 0.2, 0.6); for (const x of [-0.25, 0.25]) { const mic = cyl(g, 0.025, 0.02, 0.22, 0x1d1d24, x, 0.45, 0.6, 8); mic.rotation.z = 1.4; } const t = cyl(g, 0.06, 0.06, 0.02, 0xffd84d, 0.4, 0.42, 0.55, 12);
      for (let i = 0; i < 10; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), basic(pick(r, [0xff6fb5, 0x2fd6ff, 0xffd84d]))); d.position.set((r() - 0.5) * 5, 2.4 + r() * 0.5, -1.5 + r()); g.add(d); } break; }
    case 'popup': { room(g, { floor: 0xf0f0f0, wall: 0xffe6f2 }); sign(g, 'POP-UP STORE', 1.6, 0.4, 0, 2.8, -2.14, '#ff6fb5', '#fff');
      const big = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 14), lamb(0xffd84d)); b.position.y = 0.8; big.add(b); const hd = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 14), lamb(0xffd84d)); hd.position.y = 1.7; big.add(hd); for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), basic(0x2a1a14)); e.position.set(sx * 0.15, 1.75, 0.42); big.add(e); const ear = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), lamb(0xffd84d)); ear.position.set(sx * 0.35, 2.1, 0); big.add(ear); } big.position.set(-1.7, 0, -1.3); g.add(big);
      for (let i = 0; i < 3; i++) { box(g, 0.6, 0.9, 0.5, 0xffffff, 0.8 + i * 0.7, 0.45, -1.6); const it = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), lamb(pick(r, [0xff6fb5, 0x8fd3ff, 0xffd84d]))); it.position.set(0.8 + i * 0.7, 1.02, -1.6); g.add(it); } break; }
    case 'festival': { ground(g, 0x4a4458); stars(g, r, 80, -8); for (let i = 0; i < 4; i++) { const x = -3 + i * 2; box(g, 1.6, 1.0, 0.9, pick(r, [0xff6f6f, 0xffd84d, 0x8fd3ff, 0x9df2c8]), x, 0.5, -2.2); const roof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.6, 4), lamb(0xffffff)); roof.rotation.y = Math.PI / 4; roof.position.set(x, 1.6, -2.2); g.add(roof); }
      bulbs(g, r, 2.6, -1.6, [0xff6fb5, 0xffd84d, 0x8fd3ff, 0x9df2c8], 18, -3.5, 3.5); for (let i = 0; i < 5; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), basic(0xff8a3a)); l.scale.y = 1.3; l.position.set(-2.4 + i * 1.2, 2.2, -1.9); g.add(l); } break; }
    case 'boardgame': { room(g, { floor: 0xd8b88a, wall: 0xe6f0ff }); for (let row = 0; row < 3; row++) { box(g, 4.6, 0.05, 0.4, 0x9a6a4a, 0, 0.7 + row * 0.7, -1.95); for (let i = 0; i < 12; i++) box(g, 0.3, 0.42, 0.25, pick(r, [0xff6f6f, 0x4f7bd6, 0xffd84d, 0x5fb38a, 0x9a5ad8, 0xff9f43]), -2.1 + i * 0.38, 0.95 + row * 0.7, -1.9); }
      bareTable(g, 0.62, 0xf6f0e8); const bd = T(0.8, 0.5, 0, 0.765, 0.65, (x, w, h) => { x.fillStyle = '#e8f6d8'; x.fillRect(0, 0, w, h); for (let i = 0; i < 10; i++) { x.fillStyle = ['#ff6f6f', '#4f7bd6', '#ffd84d', '#5fb38a'][i % 4]; x.fillRect(8 + i * 15, 8, 12, 12); x.fillRect(8 + i * 15, h - 20, 12, 12); } }); bd.rotation.x = -Math.PI / 2;
      for (let i = 0; i < 4; i++) cyl(g, 0.025, 0.035, 0.07, [0xff6f6f, 0x4f7bd6, 0xffd84d, 0x5fb38a][i], -0.2 + i * 0.13, 0.8, 0.62, 8); box(g, 0.08, 0.08, 0.08, 0xffffff, 0.45, 0.8, 0.75); seat(g, 0xff9f43, 0, 0); break; }
    case 'vr': { room(g, { floor: 0x1d1d40, wall: 0x2a2a5a }); const grid = new THREE.GridHelper(10, 20, 0x2fd6ff, 0x2fd6ff); grid.position.y = 0.01; grid.material.transparent = true; grid.material.opacity = 0.5; g.add(grid); sign(g, 'VR ZONE', 1.2, 0.34, 0, 2.8, -2.14, '#1d1d40', '#2fd6ff');
      for (let i = 0; i < 3; i++) { const sc = T(1.1, 0.7, -1.6 + i * 1.6, 1.7, -2.14, (x, w, h) => { const gg = x.createLinearGradient(0, 0, w, h); gg.addColorStop(0, ['#2fd6ff', '#ff6fb5', '#9df2c8'][i]); gg.addColorStop(1, '#1d1d40'); x.fillStyle = gg; x.fillRect(0, 0, w, h); }); } break; }
    case 'thrift': { room(g, { floor: 0xc9a07a, wall: 0xf3e6d6 }); sign(g, 'VINTAGE', 1.2, 0.34, 0, 2.8, -2.14, '#8a5a3a', '#fff3c4'); for (const x of [-1.6, 1.6]) { box(g, 1.6, 0.04, 0.04, 0x8a8a90, x, 1.7, -1.4); for (const sx of [-0.7, 0.7]) box(g, 0.04, 1.7, 0.04, 0x8a8a90, x + sx, 0.85, -1.4); for (let i = 0; i < 7; i++) box(g, 0.1, 0.8, 0.5, pick(r, [0xc8a060, 0x6a87b8, 0x8a3a3a, 0x5f8f5f, 0xe8d8b8, 0x3a3a48]), x - 0.6 + i * 0.2, 1.25, -1.4); }
      box(g, 0.5, 1.6, 0.05, 0xd8c8a0, 2.4, 0.9, 0.0); const mir = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.4), basic(0xdfeef6)); mir.position.set(2.4, 0.9, 0.03); g.add(mir); break; }
    case 'gym': { room(g, { floor: 0x3a3a48, wall: 0xe6eaf0 }); for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.9), basic(0xdfeef6)); m.position.set(-1.8 + i * 1.2, 1.2, -2.14); g.add(m); }
      box(g, 2.0, 0.08, 0.4, 0x2b2b30, 1.6, 0.5, -1.2); for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) { const d = cyl(g, 0.06, 0.06, 0.05, 0x1d1d24, 0.9 + i * 0.35 + sx * 0.09, 0.62, -1.2, 10); d.rotation.z = Math.PI / 2; }
      const tm = new THREE.Group(); box(tm, 0.7, 0.15, 1.6, 0x2b2b30, 0, 0.1, 0); box(tm, 0.05, 1.1, 0.05, 0x8a8a90, -0.3, 0.6, -0.7); box(tm, 0.05, 1.1, 0.05, 0x8a8a90, 0.3, 0.6, -0.7); box(tm, 0.7, 0.3, 0.1, 0x3a3a48, 0, 1.15, -0.7); tm.position.set(-1.9, 0, -0.6); g.add(tm); sign(g, 'GYM', 0.8, 0.3, 0, 2.85, -2.12, '#d8352a', '#fff'); break; }
    case 'mart': { room(g, { floor: 0xe6e6e6, wall: 0xf6f6f2 }); for (const x of [-1.8, 1.8]) for (let row = 0; row < 4; row++) { box(g, 1.6, 0.04, 0.5, 0xd8dce4, x, 0.4 + row * 0.5, -1.8); for (let i = 0; i < 7; i++) box(g, 0.18, 0.3, 0.25, pick(r, [0xff6f6f, 0xffd84d, 0x8fd3ff, 0x5fb38a, 0xff9f43, 0xffffff]), x - 0.65 + i * 0.22, 0.57 + row * 0.5, -1.8); }
      const cart = new THREE.Group(); const bsk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.8), new THREE.MeshBasicMaterial({ color: 0x8a8a90, wireframe: true })); bsk.position.y = 0.75; cart.add(bsk); for (let i = 0; i < 4; i++) box(cart, 0.15, 0.15, 0.15, pick(r, [0xff6f6f, 0xffd84d, 0x8fd36a]), (i % 2 - 0.5) * 0.25, 0.65, (Math.floor(i / 2) - 0.5) * 0.3); for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(cart, 0.05, 0.05, 0.04, 0x2b2b30, sx * 0.25, 0.05, sz * 0.35, 8).rotation.z = Math.PI / 2; box(cart, 0.03, 0.5, 0.03, 0x8a8a90, -0.28, 0.5, 0.38); cart.position.set(1.2, 0, 0.5); g.add(cart); sign(g, '오늘 특가', 1.0, 0.32, 0, 2.8, -2.12, '#ff4d4d', '#fff'); break; }
    case 'track': { ground(g, 0x6fbf6a); const tr = new THREE.Mesh(new THREE.PlaneGeometry(40, 2.6), lamb(0xd8603a)); tr.rotation.x = -Math.PI / 2; tr.position.set(0, 0.01, 0.4); g.add(tr); for (let i = 0; i < 4; i++) box(g, 40, 0.005, 0.04, 0xffffff, 0, 0.02, -0.8 + i * 0.8);
      for (let i = 0; i < 10; i++) tree(g, r, -6 + i * 1.4, -4 - r() * 2, 1); box(g, 6, 1.2, 0.6, 0xb8bcc4, 0, 0.6, -3); break; }
    case 'photobooth': { room(g, { floor: 0xf0e6f0, wall: 0xffe6ee }); const bt = new THREE.Group(); box(bt, 1.6, 2.4, 1.4, 0xffffff, 0, 1.2, 0); const cur = box(bt, 1.0, 1.8, 0.02, 0xff6fb5, 0.1, 1.1, 0.71); bt.position.set(-1.8, 0, -1.2); g.add(bt); sign(g, '인생네컷', 1.1, 0.34, -1.8, 2.6, -0.48, '#ff6fb5', '#fff');
      for (let i = 0; i < 6; i++) { T(0.22, 0.6, 0.5 + i * 0.32, 1.7, -2.14, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); for (let k = 0; k < 4; k++) { x.fillStyle = pick(r, ['#ffd6e0', '#cde9ff', '#fff3c4', '#d8f6ea']); x.fillRect(4, 4 + k * (h - 8) / 4, w - 8, (h - 8) / 4 - 4); } }); }
      for (let i = 0; i < 4; i++) { const hd = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 16), lamb(pick(r, [0xff6fb5, 0xffd84d]))); hd.position.set(0.6 + i * 0.4, 1.0, -2.0); g.add(hd); } break; }
    case 'mall': { room(g, { floor: 0xf0ece6, wall: 0xf6f6f6 }); for (let i = 0; i < 3; i++) { const x = -2 + i * 2; box(g, 1.7, 2.2, 0.1, pick(r, [0xffd6e0, 0xcde9ff, 0xfff3c4]), x, 1.1, -2.1); T(1.4, 1.2, x, 1.2, -2.04, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); for (let k = 0; k < 3; k++) { c.fillStyle = pick(r, ['#ff6f9f', '#4f7bd6', '#ffd84d', '#5fb38a']); c.fillRect(20 + k * 85, 60, 50, 140); } }); sign(g, ['SHOES', 'BAG', 'CLOTHES'][i], 0.9, 0.24, x, 2.35, -2.03, '#2b2b30', '#fff'); }
      for (let i = 0; i < 4; i++) { const sh = box(g, 0.35, 0.3, 0.12, pick(r, [0xff6f9f, 0xffffff, 0xffd84d]), 1.4 + i * 0.12, 0.65, 0.4 + i * 0.05); } break; }
    case 'market': { ground(g, 0x8a7a6a); for (let i = 0; i < 4; i++) { const x = -3 + i * 2; box(g, 1.7, 0.8, 0.9, 0x9a7a5a, x, 0.4, -2.0); const aw = box(g, 1.9, 0.08, 1.2, i % 2 ? 0xff6f6f : 0x4f7bd6, x, 2.0, -1.8); aw.rotation.x = 0.2; for (let k = 0; k < 6; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), lamb(pick(r, [0xff6f3a, 0xffd84d, 0x8fd36a, 0xd8352a]))); f.position.set(x - 0.6 + k * 0.24, 0.88, -2.0 + (k % 2) * 0.2); g.add(f); } }
      bulbs(g, r, 2.5, -1.3, [0xfff0c0], 16, -3.5, 3.5); steam(g, -1.0, 1.0, -2.0); sign(g, '시장 골목', 1.2, 0.34, 0, 2.85, -2.3, '#ff8a3a', '#fff'); break; }
    case 'pottery': { room(g, { floor: 0xd8c8b0, wall: 0xf3ece0 }); for (let row = 0; row < 2; row++) { box(g, 3.6, 0.05, 0.4, 0x9a6a4a, 0.3, 1.3 + row * 0.6, -1.95); for (let i = 0; i < 8; i++) cyl(g, 0.1, 0.07, 0.2 + r() * 0.15, pick(r, [0xe8d8c0, 0xc8a080, 0x8fb8c8, 0xf6f0e0]), -1.2 + i * 0.42, 1.45 + row * 0.6, -1.95, 12); }
      bareTable(g, 0.62, 0xc8b8a0); cyl(g, 0.22, 0.22, 0.05, 0x8a8a90, 0, 0.78, 0.65, 18); const clay = cyl(g, 0.11, 0.13, 0.16, 0xc89870, 0, 0.88, 0.65, 16); g.userData.clay = clay; seat(g, 0x8a6a52, 0, 0); sign(g, '도자기 공방', 1.2, 0.32, -1.6, 2.8, -2.14, '#c89870', '#fff'); break; }
    case 'aquarium': { room(g, { floor: 0x1d3a5a, wall: 0x1d3a5a }); const tank = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({ map: canvasTex(600, 300, (x, w, h) => { const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#4fc8f0'); gg.addColorStop(1, '#1d5a9a'); x.fillStyle = gg; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.15)'; for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(i * 80, 0); x.lineTo(i * 80 + 40, 0); x.lineTo(i * 80 - 40, h); x.lineTo(i * 80 - 80, h); x.fill(); } }) })); tank.position.set(0, 1.6, -2.1); g.add(tank);
      const fish = new THREE.Group(); for (let i = 0; i < 14; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.08 + r() * 0.06, 10, 8), lamb(pick(r, [0xff9f43, 0xffd84d, 0xffffff, 0xff6fb5]))); f.scale.set(1.6, 0.8, 0.5); f.position.set((r() - 0.5) * 5, 0.6 + r() * 2.2, -2.0); f.userData.sp = 0.3 + r() * 0.5; fish.add(f); } g.add(fish); g.userData.fish = fish;
      const ray = new THREE.Mesh(new THREE.CircleGeometry(0.4, 4), lamb(0x8a9ab8)); ray.scale.set(1.4, 0.7, 1); ray.position.set(1.4, 2.4, -2.05); g.add(ray); break; }
    case 'tower': { room(g, { floor: 0x3a3a48, wall: 0x2a2a40 }); const ct = cityTex(r); const city = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.4), new THREE.MeshBasicMaterial({ map: ct })); city.position.set(0, 1.5, -2.15); g.add(city); for (let i = 0; i < 5; i++) box(g, 0.08, 2.6, 0.08, 0x8a8a90, -2.8 + i * 1.4, 1.4, -2.1); box(g, 5.8, 0.08, 0.3, 0xb8bcc4, 0, 0.9, -1.9); sign(g, '전망대 340m', 1.4, 0.32, 0, 2.95, -2.12, '#2a2a40', '#ffd84d'); break; }
    case 'golf': { room(g, { floor: 0x3a6a3a, wall: 0x2b2b30 }); const sc = T(4.2, 2.2, 0, 1.6, -2.14, (x, w, h) => { const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#9fd8ff'); gg.addColorStop(0.5, '#cdeeff'); gg.addColorStop(0.51, '#5fb35a'); gg.addColorStop(1, '#3f8f3f'); x.fillStyle = gg; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.fillRect(w / 2 - 2, h * 0.38, 4, h * 0.14); x.fillStyle = '#ff4d4d'; x.fillRect(w / 2, h * 0.38, 18, 12); x.fillStyle = '#fff'; x.font = `900 34px ${FONT}`; x.fillText('NICE SHOT!', 20, 50); });
      const mat = box(g, 1.4, 0.02, 1.0, 0x5fb35a, 0.3, 0.01, 0.3); const ball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), lamb(0xffffff)); ball.position.set(0.6, 0.05, 0.4); g.add(ball); const club = box(g, 0.025, 0.9, 0.025, 0xb8bcc4, 0.85, 0.45, 0.2); club.rotation.z = 0.3; break; }
    case 'lounge': { room(g, { floor: 0x5a4a3a, wall: 0x3a2a28 }); const ct = cityTex(r); const city = new THREE.Mesh(new THREE.PlaneGeometry(5, 2), new THREE.MeshBasicMaterial({ map: ct })); city.position.set(0, 1.7, -2.15); g.add(city);
      box(g, 2.6, 0.45, 0.7, 0x8a2a3a, 0, 0.22, -0.4); box(g, 2.6, 0.6, 0.15, 0x8a2a3a, 0, 0.6, -0.75); box(g, 0.9, 0.06, 0.5, 0xd4a94a, 0, 0.45, 0.6); for (const x of [-0.2, 0.2]) { const gl = new THREE.Group(); cyl(gl, 0.005, 0.005, 0.1, 0xe6f6ff, 0, 0, 0, 6); cyl(gl, 0.035, 0.02, 0.06, 0x8a2a3a, 0, 0.07, 0, 10); gl.position.set(x, 0.53, 0.6); g.add(gl); }
      const piano = box(g, 1.0, 0.9, 0.5, 0x111114, 2.2, 0.45, -1.4); for (let i = 0; i < 3; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), basic(0xffd8a0)); l.position.set(-1.8 + i * 1.8, 2.8, -1.4); g.add(l); } break; }
    case 'skating': { const ice = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshLambertMaterial({ color: 0xe6f4ff })); ice.rotation.x = -Math.PI / 2; g.add(ice); box(g, 12, 0.6, 0.1, 0xffffff, 0, 0.3, -2.6); box(g, 12, 0.08, 0.2, 0x4f7bd6, 0, 0.62, -2.6); room(g, { floor: 0xe6f4ff, wall: 0xd8e6f6 });
      bulbs(g, r, 2.8, -2.0, [0xfff0c0, 0x8fd3ff], 16); for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), lamb(pick(r, [0xff6fb5, 0x4f7bd6, 0xffd84d]))); f.position.set(-2.5 + i, 1.3 + (i % 2) * 0.1, -2.5); g.add(f); } sign(g, 'ICE RINK', 1.2, 0.34, 0, 2.6, -2.14, '#4f7bd6', '#fff'); break; }
  }
  return g;
}
const REST = {
  mala: { kind: 'mala', floor: 0xb89a7a, wall: 0xffe0d0, items: [['마라탕', '12.0'], ['꿔바로우', '15.0'], ['토마토 계란', '9.0']], board: { name: '마라 MENU', bg: '#b8203a' }, sign: ['마라 맵기 1~5', '#d8352a', '#fff'], chair: 0xd8352a, lanterns: 0xff4d4d },
  donkatsu: { kind: 'donkatsu', floor: 0xc9b8a0, wall: 0xf6efe0, items: [['등심 돈가스', '11.0'], ['치즈 돈가스', '12.5'], ['모밀', '8.0']], board: { name: '돈가스', bg: '#5a3a2a' }, sign: ['정식 11:30~', '#fff', '#5a3a2a'], chair: 0x8a6a52 },
  shabu: { kind: 'shabu', floor: 0xd8c8b0, wall: 0xeaf4ea, items: [['샤브샤브 2인', '28.0'], ['죽 추가', '3.0'], ['칼국수', '4.0']], board: { name: '샤브샤브', bg: '#4f8a5a' }, chair: 0xb8a888, plants: 1 },
  pho: { kind: 'pho', floor: 0xd8c8a8, wall: 0xf3f6ea, items: [['소고기 쌀국수', '11.0'], ['분짜', '12.0'], ['짜조', '6.0']], board: { name: 'PHỞ', bg: '#3f6b55' }, chair: 0x8a6a52, plants: 1 },
  dakgalbi: { kind: 'dakgalbi', floor: 0x8a7a6a, wall: 0xfff0d8, items: [['닭갈비 2인', '24.0'], ['치즈 사리', '4.0'], ['볶음밥', '3.0']], board: { name: '춘천 닭갈비', bg: '#d8603a' }, sign: ['볶음밥 필수', '#ff8a3a', '#fff'], chair: 0xff8a3a },
  burger: { kind: 'burger', floor: 0xe6e0d8, wall: 0xfff3c4, items: [['더블 버거', '9.5'], ['감자튀김', '3.5'], ['밀크셰이크', '5.0']], board: { name: 'BURGER', bg: '#ff4d4d' }, sign: ['SINCE 2024', '#ffd84d', '#d8352a'], chair: 0xff4d4d },
  pizza: { kind: 'pizza', floor: 0xb8885a, wall: 0xf6e6d0, items: [['페퍼로니', '18.0'], ['고르곤졸라', '17.0'], ['반반 피자', '19.0']], board: { name: 'PIZZA', bg: '#2f6b3a' }, chair: 0x2f6b3a, plants: 1 },
  naengmyeon: { kind: 'naengmyeon', floor: 0xd8d8d0, wall: 0xeef4f8, items: [['물냉면', '11.0'], ['비빔냉면', '11.0'], ['수육', '18.0']], board: { name: '냉면', bg: '#2f4a7a' }, sign: ['60년 전통', '#fff', '#2f4a7a'], chair: 0x8a8a90 },
  jjajang: { kind: 'jjajang', floor: 0xb8302a, wall: 0xfff0e0, items: [['짜장면', '7.0'], ['짬뽕', '8.0'], ['탕수육', '18.0']], board: { name: '중화요리', bg: '#b8302a' }, sign: ['짜장 짬뽕', '#b8302a', '#ffd84d'], chair: 0xb8302a, lanterns: 0xff4d4d },
  curry: { kind: 'curry', floor: 0xd8c0a0, wall: 0xfff6e0, items: [['치킨 카레', '10.0'], ['돈가스 카레', '12.0'], ['난', '3.0']], board: { name: 'CURRY', bg: '#e8a820' }, chair: 0xe8a820, plants: 1 },
  steak: { kind: 'steak', floor: 0x5a4a3a, wall: 0x3a2a28, items: [['안심 스테이크', '45.0'], ['티본', '58.0'], ['하우스 와인', '12.0']], board: { name: 'STEAK HOUSE', bg: '#111114' }, chair: 0x8a2a3a, top: 0xf6f0e8 },
};

const SKY = {
  mala: ['#ffe0d0', '#ffd0c0'], donkatsu: ['#f6efe0', '#e8e0c8'], shabu: ['#eaf4ea', '#d8e8d8'], pho: ['#f3f6ea', '#e6ecd8'], dakgalbi: ['#fff0d8', '#ffe0c0'], burger: ['#fff3c4', '#ffe6a0'], pizza: ['#f6e6d0', '#e8d4b8'], naengmyeon: ['#eef4f8', '#dfe8f0'], jjajang: ['#fff0e0', '#ffe0c8'], curry: ['#fff6e0', '#ffe8c0'], steak: ['#3a2a28', '#2a1d1c'], escape: ['#3a3040', '#2a2430'], planetarium: ['#0d1030', '#1d2250'], pocha: ['#2d2a55', '#4a3a6a'], bowling: ['#3a3a6a', '#2b2b50'], cinema: ['#2a1a24', '#1d1018'], garden: ['#bfe6ff', '#e6f6ff'], flower: ['#f3f6ea', '#e6eed8'], bakery: ['#fff3e0', '#ffe6c8'], picnic: ['#a8dcff', '#e6f6ff'], teahouse: ['#f6efe0', '#e8dcc8'], rooftop: ['#1d2250', '#3a3a6a'], forest: ['#cfeac0', '#e6f4d8'], amusement: ['#9fd8ff', '#ffd8e8'], batting: ['#1d2250', '#3a4a7a'], kart: ['#bfe6ff', '#e6f6ff'], karaoke: ['#3a2a5a', '#2b2040'], popup: ['#ffe6f2', '#ffd6e8'], festival: ['#1d2250', '#4a3a6a'], boardgame: ['#e6f0ff', '#d8e6f6'], vr: ['#1d1d40', '#2a2a5a'], thrift: ['#f3e6d6', '#e8d8c0'], gym: ['#e6eaf0', '#d8dce4'], mart: ['#f6f6f2', '#e8e8e0'], track: ['#ffcfa0', '#ffe6c8'], photobooth: ['#ffe6ee', '#ffd6e0'], mall: ['#f6f6f6', '#eaeaea'], market: ['#2d2a55', '#5a4a7a'], pottery: ['#f3ece0', '#e6dcc8'], aquarium: ['#1d3a5a', '#12263e'], tower: ['#1d1d40', '#2a2a5a'], golf: ['#2b2b30', '#1d1d24'], lounge: ['#3a2a28', '#2a1d1c'], skating: ['#d8e6f6', '#c8d8f0'],
  cafe: ['#ffe9d2', '#ffd8b8'], bunsik: ['#fff3c4', '#ffe0a8'], pasta: ['#f3dcc8', '#e8c8b0'], brunch: ['#e6f7ef', '#d8f0e4'], bbq: ['#f6e0c8', '#e8c8a8'], sushi: ['#f3eadb', '#e6d8c0'], gukbap: ['#f6f0e0', '#e8e0c8'],
  bookstore: ['#f6ead8', '#ecdcc0'], props: ['#fff0f5', '#ffe0ec'], lpbar: ['#3a3048', '#2a2238'], catcafe: ['#ffeedd', '#ffe0c8'], arcade: ['#3a3060', '#2b2840'], gallery: ['#fafafa', '#eeeeee'],
  store: ['#2d2a55', '#5a4a8a'], beach: ['#1d2250', '#4a4585'], park: ['#ffb3a0', '#c9a7d8'], river: ['#1d2250', '#3a3a6a'], subway: ['#e6eef2', '#d6e2ea'], car: ['#1d1d40', '#2d2a55'], counter: ['#e9f3e6', '#d6ead0'], table: ['#fbe3f0', '#f6d0e4'], rain: ['#a9bdd6', '#c8d6e6'], street: ['#4a4585', '#ffb3a0'], bus: ['#2d2a55', '#4a4585'], room: ['#f3e3f0', '#f3e3f0'], hobby: ['#efe3f6', '#efe3f6'], window: ['#fbe3f0', '#f6d0e4'],
};
// 세트별 카메라·캐릭터 위치
const SETUP = {
  cafe:    { cam: [0, 1.6, 3.9], look: [0, 1.2, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.7, dir: 1.2, sun: 0xfff2e0 } },
  counter: { cam: [0.2, 1.55, 3.4], look: [0, 1.25, 0], fov: 40, char: [0.15, 0, 0.1], sit: false, light: { hemi: 1.7, dir: 1.2, sun: 0xffffff } },
  table:   { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xffe8f0 } },
  rain:    { cam: [-0.3, 1.55, 3.5], look: [0, 1.25, 0], fov: 38, char: [0, 0, 0], sit: true, light: { hemi: 1.25, dir: 0.8, sun: 0xcfe0ff } },
  bus:     { cam: [0.3, 1.45, 3.3], look: [0, 1.15, -0.4], fov: 40, char: [0, 0, -0.45], sit: true, legsOn: true, light: { hemi: 1.4, dir: 0.9, sun: 0xffe0c0 } },
  room:    { cam: [0.2, 1.4, 3.6], look: [0, 1.1, 0], fov: 40, char: [0, 0, 0.1], sit: false, light: { hemi: 1.6, dir: 1.0, sun: 0xffe8f0 } },
  bunsik:  { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff0d0 } },
  pasta:   { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.45, dir: 0.95, sun: 0xffd8b0 } },
  brunch:  { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.8, dir: 1.15, sun: 0xffffff } },
  bbq:     { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.6, dir: 1.0, sun: 0xffd8a8 } },
  sushi:   { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.7, dir: 1.05, sun: 0xfff0d8 } },
  gukbap:  { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.7, dir: 1.05, sun: 0xfff6e0 } },
  lpbar:   { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.15, dir: 0.8, sun: 0xffb8d8 } },
  catcafe: { cam: [0.4, 1.4, 3.4], look: [0, 1.0, 0], fov: 42, char: [0, 0, 0], sit: true, legsOn: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff0e0 } },
  store:   { cam: [0.35, 1.5, 3.1], look: [0, 1.2, 0], fov: 42, char: [0, 0, 0], sit: true, light: { hemi: 1.35, dir: 0.9, sun: 0xe0f0ff } },
  bookstore: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.6, dir: 1.0, sun: 0xffe8c8 } },
  props:   { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.75, dir: 1.1, sun: 0xfff0f5 } },
  arcade:  { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.3, dir: 0.9, sun: 0xd8c8ff } },
  gallery: { cam: [0.3, 1.45, 3.8], look: [0, 1.2, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.8, dir: 1.1, sun: 0xffffff } },
  subway:  { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.7, dir: 1.0, sun: 0xffffff } },
  beach:   { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.2, dir: 0.85, sun: 0xc8d8ff } },
  park:    { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.4, dir: 1.0, sun: 0xffc8a8 } },
  river:   { cam: [0.4, 1.3, 3.6], look: [0, 1.0, 0], fov: 40, char: [0, 0, -0.1], sit: true, legsOn: true, light: { hemi: 1.15, dir: 0.8, sun: 0xc8d0ff } },
  car:     { cam: [0.1, 1.6, 3.8], look: [0, 1.4, 0], fov: 38, char: [0, 0.42, -0.3], sit: true, light: { hemi: 1.5, dir: 1.0, sun: 0xd8e0ff } },
  mala: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  donkatsu: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  shabu: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  pho: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  dakgalbi: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  burger: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  pizza: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  naengmyeon: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  jjajang: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  curry: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.75, dir: 1.1, sun: 0xfff4e0 } },
  steak: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.45, dir: 0.95, sun: 0xffd8b0 } },
  escape: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  planetarium: { cam: [0.3, 1.4, 3.6], look: [0, 1.1, 0.2], fov: 42, char: [0, 0, 0.2], sit: true, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  pocha: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  bowling: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  cinema: { cam: [0.3, 1.45, 3.4], look: [0, 1.1, 0.2], fov: 40, char: [0, 0, 0.2], sit: true, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  garden: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  flower: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  bakery: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  picnic: { cam: [0.4, 1.1, 3.4], look: [0, 0.6, 0.3], fov: 42, char: [0, -0.5, 0.4], sit: true, legsOn: true, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  teahouse: { cam: [0.3, 1.2, 3.0], look: [0, 0.85, 0], fov: 40, char: [0, -0.28, 0], sit: true, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  rooftop: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  forest: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  amusement: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  batting: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  kart: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  karaoke: { cam: [0.3, 1.4, 3.4], look: [0, 1.0, -0.3], fov: 42, char: [0, 0, -0.35], sit: true, legsOn: true, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  popup: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  festival: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  boardgame: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  vr: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  thrift: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  gym: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  mart: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  track: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  photobooth: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  mall: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  market: { cam: [0.5, 1.35, 4.4], look: [0, 1.1, 0], fov: 40, char: [0.2, 0, 0.4], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  pottery: { cam: [0.35, 1.5, 3.0], look: [0, 1.2, 0], fov: 40, char: [0, 0, 0], sit: true, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
  aquarium: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  tower: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  golf: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  lounge: { cam: [0.3, 1.4, 3.4], look: [0, 1.0, -0.3], fov: 42, char: [0, 0, -0.35], sit: true, legsOn: true, light: { hemi: 1.25, dir: 0.85, sun: 0xd8d0ff } },
  skating: { cam: [0.3, 1.45, 3.8], look: [0, 1.15, 0], fov: 40, char: [0.2, 0, 0.3], sit: false, light: { hemi: 1.65, dir: 1.05, sun: 0xfff4e0 } },
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
      const sets = { cafe: buildCafe(r), counter: buildCounter(r), table: buildTable(r), rain: buildRain(r), street: buildStreet(r), bus: buildBus(r), room: buildRoom(r), hobby: buildRoom(r, { hobbies: true, wall: 0xefe3f6 }), bunsik: buildDiner(r, { kind: 'bunsik', floor: 0xd9c8a8, wall: 0xfff3c4, items: [['떡볶이', '4.5'], ['순대', '4.0'], ['모둠 튀김', '5.0']], board: { name: '분식 MENU', bg: '#d8352a' }, sign: ['떡볶이 맛집', '#ff7a5a', '#fff'], chair: 0xff7a5a }),
        pasta: buildDiner(r, { kind: 'pasta', floor: 0x8a6a52, wall: 0xf3dcc8, items: [['크림 파스타', '15.0'], ['오늘의 파스타', '16.0'], ['리조또', '15.5']], board: { name: 'Trattoria', bg: '#6a3a3a' }, chair: 0x6a4a3a, top: 0xf6f0e8 }),
        brunch: buildDiner(r, { kind: 'brunch', floor: 0xf0e4d0, wall: 0xe6f7ef, window: 0xd8f0ff, items: [['팬케이크', '14.0'], ['에그 베네딕트', '15.0'], ['과일 요거트', '9.0']], board: { name: 'BRUNCH', bg: '#5fb38a' }, chair: 0xffffff }),
        bbq: buildDiner(r, { kind: 'bbq', floor: 0x8a7a6a, wall: 0xf6e0c8, items: [['삼겹살', '16.0'], ['목살', '17.0'], ['된장찌개', '5.0']], board: { name: '숯불 고기', bg: '#3a2a22' }, sign: ['고기 굽는 집', '#3a2a22', '#ffb84d'], chair: 0x8a5a3a, top: 0x6a5a4a }),
        sushi: buildDiner(r, { kind: 'sushi', floor: 0xb89a7a, wall: 0xf3eadb, items: [['오마카세 런치', '45.0'], ['모둠 초밥', '28.0'], ['우동', '9.0']], board: { name: '스시 오늘', bg: '#2f3f6e' }, chair: 0x6a4a3a, top: 0xd9b48a }),
        gukbap: buildDiner(r, { kind: 'gukbap', floor: 0xc9b8a0, wall: 0xf6f0e0, items: [['돼지국밥', '10.0'], ['순대국밥', '10.0'], ['수육 小', '15.0']], board: { name: '국밥', bg: '#2b2b30' }, sign: ['3대째 국밥', '#fff', '#2b2b30'], chair: 0x9a7a5a }),
        bookstore: buildBookstore(r), props: buildPropShop(r), lpbar: buildLpBar(r), catcafe: buildCatCafe(r), arcade: buildArcade(r), gallery: buildGallery(r),
        store: buildStore(r), beach: buildBeach(r), park: buildPark(r), river: buildRiver(r), subway: buildSubway(r), car: buildCar(r),
        mala: buildRest(r, REST.mala), donkatsu: buildRest(r, REST.donkatsu), shabu: buildRest(r, REST.shabu), pho: buildRest(r, REST.pho), dakgalbi: buildRest(r, REST.dakgalbi), burger: buildRest(r, REST.burger), pizza: buildRest(r, REST.pizza), naengmyeon: buildRest(r, REST.naengmyeon), jjajang: buildRest(r, REST.jjajang), curry: buildRest(r, REST.curry), steak: buildRest(r, REST.steak), escape: buildVenue(r, 'escape'), planetarium: buildVenue(r, 'planetarium'), pocha: buildVenue(r, 'pocha'), bowling: buildVenue(r, 'bowling'), cinema: buildVenue(r, 'cinema'), garden: buildVenue(r, 'garden'), flower: buildVenue(r, 'flower'), bakery: buildVenue(r, 'bakery'), picnic: buildVenue(r, 'picnic'), teahouse: buildVenue(r, 'teahouse'), rooftop: buildVenue(r, 'rooftop'), forest: buildVenue(r, 'forest'), amusement: buildVenue(r, 'amusement'), batting: buildVenue(r, 'batting'), kart: buildVenue(r, 'kart'), karaoke: buildVenue(r, 'karaoke'), popup: buildVenue(r, 'popup'), festival: buildVenue(r, 'festival'), boardgame: buildVenue(r, 'boardgame'), vr: buildVenue(r, 'vr'), thrift: buildVenue(r, 'thrift'), gym: buildVenue(r, 'gym'), mart: buildVenue(r, 'mart'), track: buildVenue(r, 'track'), photobooth: buildVenue(r, 'photobooth'), mall: buildVenue(r, 'mall'), market: buildVenue(r, 'market'), pottery: buildVenue(r, 'pottery'), aquarium: buildVenue(r, 'aquarium'), tower: buildVenue(r, 'tower'), golf: buildVenue(r, 'golf'), lounge: buildVenue(r, 'lounge'), skating: buildVenue(r, 'skating'),
        window: buildWindowTable(r) };
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
    if (this.sets[name].userData.menu) this.setMenu('');
    this.staffT = this.notesT = this.busT = this.istjT = this.notifT = this.cakeT = this.coupleT = this.umbT = this.fwT = null; this.sets.beach.userData.fw.visible = false; if (this.sets.room.userData.draw) this.sets.room.userData.draw.visible = false; if (this.sets.room.userData.helm) this.sets.room.userData.helm.visible = false; if (this.sets.room.userData.tix) this.sets.room.userData.tix.visible = false; if (this.sets.room.userData.duo) this.sets.room.userData.duo.visible = false; if (this.sets.room.userData.memo) this.sets.room.userData.memo.visible = false; if (this.E.userData.umb) this.E.userData.umb.visible = false; this.sets.cafe.userData.istj.visible = false; this.E.visible = true; if (this.notif) this.notif.forEach(n => n.visible = false); this.sets.street.userData.bus.visible = false; this.lastEmoteExpr = null;
  },
  attach(parent) { if (this.canvas.parentElement !== parent) { parent.prepend(this.canvas); this.ro.observe(parent); } this.resize(); },
  snapshot() { this.renderer.render(this.scene, this.cam); try { return this.renderer.domElement.toDataURL('image/jpeg', 0.9); } catch { return null; } },
  setMenu(sel) { const s = this.sets[this.set], m = s && s.userData.menu; if (!m) return; m.material.map = s.userData.menuItems ? boardTex(sel, s.userData.menuItems, s.userData.board) : menuTex(sel); m.material.needsUpdate = true; },
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
  get door() { return (this.sets[this.set] && this.sets[this.set].userData.door) || this._noDoor || (this._noDoor = new THREE.Group()); },
  enter() {
    return new Promise(res => { this.E.visible = true; this.E.userData.legs.forEach(l => l.visible = true); this.entering = { t0: this.now(), res }; this.setExpr('excited', 'none'); });
  },
  doEnter(t) {
    const en = this.entering, a = t - en.t0, u = this.E.userData, d = this.door;
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
    if (kind === 'fireworks') this.fwT = t;
    if (kind === 'memo') { const R = this.sets.room; if (!R.userData.memo) { const grp = new THREE.Group();
        const tex = canvasTex(360, 300, (x, w, h) => { x.fillStyle = '#fff6b8'; x.fillRect(0, 0, w, h); x.fillStyle = '#e8d98a'; x.fillRect(0, 0, w, 26);
          x.fillStyle = '#2a2a3a'; x.font = 'bold 24px sans-serif'; x.fillText('좋았던 점', 22, 64); x.font = '20px sans-serif';
          ['1. 웃는 게 좋았음', '2. 대화가 편했음', '3. 같이 있으면 계획을', '    안 세워도 불안하지 않음'].forEach((t, i) => x.fillText(t, 22, 110 + i * 40));
          x.fillStyle = '#ff6f9f'; x.font = 'bold 30px sans-serif'; x.fillText('♥', w - 54, h - 30); });
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.9), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(1.0, 2.05, -2.12); m.rotation.z = -0.04; grp.add(m);
        R.add(grp); R.userData.memo = grp; }
      R.userData.memo.visible = true; }
    if (kind === 'duo') { const R = this.sets.room; if (!R.userData.duo) { const grp = new THREE.Group();
        box(grp, 1.5, 0.9, 0.06, 0x22222a, 1.05, 2.05, -2.13);
        const tex = canvasTex(300, 170, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6f5fd8'); gr.addColorStop(1, '#ff8fb8'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
          x.fillStyle = '#fff'; x.font = 'bold 30px sans-serif'; x.textAlign = 'center'; x.fillText('STAGE CLEAR!', w / 2, 70); x.font = 'bold 26px sans-serif'; x.fillStyle = '#8fd3ff'; x.fillText('1P', w / 2 - 50, 125); x.fillStyle = '#ffe08a'; x.fillText('♥', w / 2, 125); x.fillStyle = '#ffb3c8'; x.fillText('2P', w / 2 + 50, 125); });
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 0.78), new THREE.MeshBasicMaterial({ map: tex })); scr.position.set(1.05, 2.05, -2.09); grp.add(scr);
        [[0.75, 0x8fd3ff], [1.35, 0xffb3c8]].forEach(([x, c]) => { const pad = new THREE.Group(); box(pad, 0.3, 0.06, 0.16, c, 0, 0, 0); for (const s of [-1, 1]) { const g2 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), lamb(c)); g2.position.set(s * 0.14, 0, 0.03); pad.add(g2); } pad.position.set(x, 1.5, -2.0); pad.rotation.x = 1.2; grp.add(pad); });
        R.add(grp); R.userData.duo = grp; }
      R.userData.duo.visible = true; }
    if (kind === 'tickets') { const R = this.sets.room; if (!R.userData.tix) { const grp = new THREE.Group(); const r = rng(23);
        const places = ['강릉', '여수', '경주', '전주', '부산', '속초', '통영', '안동', '순천', '군산', '목포', '포항'];
        box(grp, 1.5, 1.0, 0.03, 0xc9a77a, 1.05, 2.05, -2.15);
        places.forEach((pl, i) => { const tex = canvasTex(160, 80, (x, w, h) => { x.fillStyle = '#fffaf0'; x.fillRect(0, 0, w, h); x.fillStyle = ['#ff8fb8', '#8fd3ff', '#9df2c8'][i % 3]; x.fillRect(0, 0, w, 18);
            x.fillStyle = '#2a2a30'; x.font = 'bold 26px sans-serif'; x.textAlign = 'center'; x.fillText(pl, w / 2, 50); x.font = '14px sans-serif'; x.fillText('2인 · 당일', w / 2, 70); });
          const t = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshBasicMaterial({ map: tex })); t.position.set(0.55 + (i % 4) * 0.34 + (r() - 0.5) * 0.04, 2.38 - Math.floor(i / 4) * 0.28 + (r() - 0.5) * 0.04, -2.12); t.rotation.z = (r() - 0.5) * 0.2; grp.add(t); });
        R.add(grp); R.userData.tix = grp; }
      R.userData.tix.visible = true; }
    if (kind === 'helmets') { const R = this.sets.room; if (!R.userData.helm) { const grp = new THREE.Group();
        box(grp, 1.3, 0.06, 0.3, 0x8a6a52, 0.95, 1.75, -2.05);
        [[-0.32, 0x1a1a1e], [0.32, 0xffffff]].forEach(([x, c], i) => { const hm = new THREE.Group();
          const sh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), smooth(c)); hm.add(sh);
          const st = new THREE.Mesh(new THREE.SphereGeometry(0.263, 32, 20, -0.09, 0.18, 0, Math.PI * 0.62), smooth(i ? 0x9df2c8 : 0xc24a4a)); hm.add(st);
          const vz = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 12, -0.9, 1.8, Math.PI * 0.32, Math.PI * 0.28), new THREE.MeshLambertMaterial({ color: 0x334055, transparent: true, opacity: 0.8 })); vz.rotation.y = Math.PI / 2; hm.add(vz);
          hm.position.set(0.95 + x, 1.8, -1.95); hm.rotation.y = -Math.PI / 2; grp.add(hm); });
        R.add(grp); R.userData.helm = grp; }
      R.userData.helm.visible = true; }
    if (kind === 'drawings') { const R = this.sets.room; if (!R.userData.draw) { const grp = new THREE.Group(); const r = rng(9);
        for (let i = 0; i < 14; i++) { const tex = canvasTex(120, 150, (x, w, h) => { x.fillStyle = '#fffdf6'; x.fillRect(0, 0, w, h); x.strokeStyle = '#c9b48a'; x.lineWidth = 8; x.strokeRect(4, 4, w - 8, h - 8);
            x.fillStyle = ['#ffe0f0', '#d8f6ea', '#fff3c4', '#cde9ff'][i % 4]; x.fillRect(16, 16, w - 32, h - 32); x.strokeStyle = '#5a4a3a'; x.lineWidth = 4;
            x.fillStyle = '#8ab8e8'; x.beginPath(); x.ellipse(w / 2, 128, 30, 26, 0, Math.PI, 0); x.fill(); x.fillStyle = '#ffe3cf'; x.beginPath(); x.arc(w / 2, 72, 26, 0, Math.PI * 2); x.fill(); x.stroke(); x.fillStyle = '#5a4a3a'; x.beginPath(); x.arc(w / 2, 62, 27, Math.PI * 1.05, Math.PI * 1.95); x.fill(); x.beginPath(); x.arc(w / 2 - 9, 74, 3.5, 0, 7); x.arc(w / 2 + 9, 74, 3.5, 0, 7); x.fill(); x.beginPath(); x.arc(w / 2, 82, 7, 0.2, Math.PI - 0.2); x.stroke();
            x.fillStyle = '#ff6f9f'; x.font = '22px sans-serif'; x.fillText('♥', w / 2 + 14, 40); });
          const f = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.42), new THREE.MeshBasicMaterial({ map: tex })); f.position.set(-2.0 + (i % 7) * 0.66 + (r() - 0.5) * 0.1, 1.55 + Math.floor(i / 7) * 0.62 + (r() - 0.5) * 0.08, -2.12); f.rotation.z = (r() - 0.5) * 0.15; grp.add(f); }
        R.add(grp); R.userData.draw = grp; }
      R.userData.draw.visible = true; }
    if (kind === 'umbrella') { const u = this.E.userData; if (!u.umb) { const um = new THREE.Group(); // 내 쪽(카메라 쪽)으로 기운 우산
        const can = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.36, 18, 1, true), new THREE.MeshLambertMaterial({ color: 0x9df2c8, side: THREE.DoubleSide })); can.position.y = 2.45; um.add(can);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), smooth(0xffffff)); tip.position.y = 2.65; um.add(tip);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.5, 8), smooth(0xdedede)); stick.position.y = 1.65; um.add(stick);
        um.position.set(0.28, 0, 0.1); um.rotation.set(0.42, 0, -0.12); u.umb = um; this.E.add(um); }
      u.umb.visible = true; this.umbT = t; }
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
    if (this.set === 'amusement') this.sets.amusement.userData.wheel.rotation.z = t * 0.15;
    if (this.set === 'aquarium') this.sets.aquarium.userData.fish.children.forEach((f, i) => { f.position.x = ((f.position.x + 3 + 0.004 * (1 + f.userData.sp)) % 6) - 3; f.position.y += Math.sin(t * 2 + i) * 0.001; });
    if (this.set === 'car') { const C = this.sets.car.userData; C.city.offset.x = t * 0.08; C.wheel.rotation.z = Math.sin(t * 0.7) * 0.08; }
    if (this.set === 'lpbar') this.sets.lpbar.userData.rec.rotation.y = t * 3;
    if (this.set === 'beach') { const B = this.sets.beach.userData; B.waves.forEach((w, i) => { w.position.z = -2.2 - i * 0.9 + Math.sin(t * 1.2 + i) * 0.15; });
      if (this.fwT != null) { const a = t - this.fwT; B.fw.visible = true; B.fw.children.forEach((burst, bi) => { const k = ((a - bi * 0.45) % 2.2 + 2.2) % 2.2; burst.visible = a > bi * 0.45; burst.children.forEach(s => { s.position.copy(s.userData.dir).multiplyScalar(k * 0.9); s.material.opacity = 1; s.scale.setScalar(Math.max(0.01, 1.2 - k * 0.5)); }); }); } }
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
