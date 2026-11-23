// 만약에 소개팅 — 프로토타입
// 대본은 data/<상대>.json에 있음. 화면 코드는 대본 내용을 몰라도 돌아가게 둔다.
(() => {
'use strict';

// ===== 설정 (과금은 나중에 여기 스위치만 켬) =====
const CONFIG = {
  paywall: false,          // true면 무료 횟수 이후 잠금
  freeCount: 1,            // 무료로 할 수 있는 상대 수 (아무 MBTI나 유저가 고름)
  hiddenLocked: false,     // true면 히든 엔딩을 잠금 상태로 보여 줌
  adSlot: false,           // true면 결과 화면 아래 광고 자리 표시
  voteUrl: 'https://woongif.pages.dev/',
  track: false,            // true면 /api/track으로 통계 전송 (Cloudflare 함수 붙인 뒤 켬)
};
const MBTI = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'];
// 지금 열려 있는 상대 (나중에 여기 추가: { mbti:'ISTP', g:'m', file:'istp-m' })
const PARTNERS = [{ mbti: 'ENFP', g: 'f', file: 'enfp-f' }];

const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const store = {
  get(k, d) { try { const v = localStorage.getItem('sgt_' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('sgt_' + k, JSON.stringify(v)); } catch {} },
};

// ===== 통계 (서버 붙이면 /api/track으로 쌓임, 지금은 실패해도 무시) =====
const sid = Math.random().toString(36).slice(2, 10);
function track(ev, data = {}) {
  if (!CONFIG.track) return;
  const body = JSON.stringify({ ev, sid, t: Date.now(), ...data });
  try { navigator.sendBeacon ? navigator.sendBeacon('/api/track', body) : fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {}); } catch {}
}

// ===== 화면 전환 =====
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === 'scr-' + id));
  if (window.Snd && Snd.ctx) $('#snd').classList.toggle('on', id !== 'start');
  track('screen', { id });
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 1800); }
function modal(title, text) { $('#modal-title').textContent = title; $('#modal-text').textContent = text; $('#modal').hidden = false; }
$('#modal-ok').onclick = () => { $('#modal').hidden = true; };

// ===== 상태 =====
const S = { me: store.get('me', null), data: null, partner: null, score: 0, picks: {}, ending: null };
const params = new URLSearchParams(location.search);

// ===== 시작 =====
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { Snd.init(); Snd.play('pop'); Snd.setMood('start'); show(b.dataset.go); });
const sndBtn = $('#snd'); sndBtn.textContent = Snd.on ? '🔊' : '🔇';
sndBtn.onclick = () => { Snd.init(); sndBtn.textContent = Snd.toggle() ? '🔊' : '🔇'; track('sound', { on: Snd.on }); };
// 친구 결과 카드 링크로 들어오면(?with=enfp-f) 그 상대로 바로
const viaLink = params.get('with');
track('open', { via: viaLink || '' });

// 내 MBTI
$('#grid-me').innerHTML = MBTI.map(m => `<button class="cell" data-m="${m}">${m}</button>`).join('');
const pickMe = m => { S.me = m; store.set('me', m); track('pick_me', { m }); renderPartners(); show('partner'); };
document.querySelectorAll('#grid-me .cell').forEach(b => b.onclick = () => { Snd.play('pop'); pickMe(b.dataset.m); });
$('[data-pick-me]').onclick = () => pickMe('모름');

// 상대
function played() { return store.get('played', []); }
function renderPartners() {
  $('#grid-partner').innerHTML = MBTI.map(m => {
    const p = PARTNERS.find(x => x.mbti === m);
    return p
      ? `<button class="cell open" data-file="${p.file}"><span class="face">💗</span>${m}<small>${p.g === 'f' ? '여자' : '남자'} · 지금 가능</small></button>`
      : `<button class="cell locked" data-soon="${m}"><span class="face">🔒</span>${m}<small>준비 중</small></button>`;
  }).join('');
  document.querySelectorAll('#grid-partner .open').forEach(b => b.onclick = () => tryStart(b.dataset.file));
  document.querySelectorAll('#grid-partner .locked').forEach(b => b.onclick = () => {
    track('want', { m: b.dataset.soon });
    modal(`${b.dataset.soon}는 준비 중이에요`, '누르신 유형을 세고 있어요. 많이 눌린 유형부터 소개팅 상대로 나와요!');
  });
}
function tryStart(file) {
  const p = played();
  if (CONFIG.paywall && !p.includes(file) && p.length >= CONFIG.freeCount && file !== viaLink) {
    track('paywall', { file });
    modal('다음 소개팅은 유료예요', '결제는 아직 준비 중이에요.');
    return;
  }
  startGame(file);
}

// ===== 게임 =====
const stage = $('#stage'), charEl = $('#char'), textEl = $('#text'), whoEl = $('#who'), nextEl = $('#next'), choicesEl = $('#choices');
let tapResolve = null, typing = null;
$('#dialog').onclick = () => {
  if (typing) { typing.skip = true; return; }
  if (tapResolve) { const r = tapResolve; tapResolve = null; r(); }
};
function preload(d) { ['smile','excited','happy','blush','pout','teary','surprised'].forEach(e => { const i = new Image(); i.src = d.img + e + '.png'; }); }
const use3D = () => !!(window.Scene3D && Scene3D.ready);
function setExpr(e, bounce = true, act) {
  if (use3D()) { Scene3D.setExpr(e, act); return; }
  const src = S.data.img + e + '.png';
  if (!charEl.src.endsWith(src)) charEl.src = src;
  if (bounce) { charEl.classList.remove('bounce'); void charEl.offsetWidth; charEl.classList.add('bounce'); }
}
async function say(who, text) {
  if (use3D()) Scene3D.setFocus(who === 'her');
  whoEl.className = 'who' + (who === 'me' ? ' me' : who === 'nar' ? ' nar' : '');
  whoEl.textContent = who === 'me' ? '나' : who === 'nar' ? '' : S.data.mbti;
  whoEl.style.display = who === 'nar' ? 'none' : '';
  nextEl.classList.remove('on');
  textEl.textContent = '';
  const t = { skip: false }; typing = t;
  if (who === 'her' && use3D()) Scene3D.talk(true);
  for (let i = 1; i <= text.length; i++) {
    if (t.skip) { textEl.textContent = text; break; }
    textEl.textContent = text.slice(0, i);
    if (who !== 'nar' && i % 3 === 1 && text[i - 1] !== ' ') Snd.play('tick');
    await sleep(text[i - 1] === ' ' ? 18 : 34);
  }
  typing = null;
  if (use3D()) Scene3D.talk(false);
  nextEl.classList.add('on');
  await new Promise(r => { tapResolve = r; });
}
function heart() { Snd.play('ding'); const h = $('#heart-pop'); h.classList.remove('on'); void h.offsetWidth; h.classList.add('on'); }
function setProg(i) { $('#prog').innerHTML = S.data.scenes.map((_, k) => `<i class="${k < i ? 'done' : ''}"></i>`).join(''); }
function statChip(text) { const el = $('#stat-chip'); el.classList.remove('on'); if (!text) return; el.innerHTML = text.replace(/(\d[\d,]*)/g, '<b>$1</b>'); setTimeout(() => el.classList.add('on'), 700); }
// 장면별 연출 컷 (대본의 fx)
const fxEl = $('#fx'); let menuN = 0, galN = 0;
function clearFx() { fxEl.innerHTML = ''; galN = 0; }
function fx(f) {
  if (!f) return;
  const [kind, arg] = f.split(':');
  if (kind === 'menu') {
    const seq = arg.split('>'); menuN++;
    const show1 = (m, i) => { if (use3D()) Scene3D.setMenu(m); fxEl.innerHTML = `<div class="menu-pill">주문 변경 <b>${menuN}</b>회 · <b>${m}</b></div>`; };
    show1(seq[0]); if (seq[1]) setTimeout(() => { menuN++; show1(seq[1]); Snd.play('pop'); }, 1100);
  } else if (kind === 'gallery') {
    const to = +arg, from = galN; galN = to;
    let ph = fxEl.querySelector('.phone');
    if (!ph) { fxEl.innerHTML = '<div class="phone"><div class="scr"><div class="bar"><span>📷 갤러리</span><span><b class="cnt">1</b>장</span></div><div class="tiles"></div></div></div>'; ph = fxEl.querySelector('.phone'); }
    const tiles = ph.querySelector('.tiles'), cnt = ph.querySelector('.cnt'), cols = ['#cde9ff', '#ffe0f0', '#fff3c4', '#d8f0c8', '#e9ddff'];
    const add = Math.min(15, to) - tiles.children.length;
    for (let i = 0; i < add; i++) { const t = document.createElement('i'); t.textContent = '🐧'; t.style.background = cols[(tiles.children.length) % 5]; t.style.animationDelay = (i * 0.05) + 's'; tiles.prepend(t); }
    let k = from || 1; const step = Math.max(1, Math.ceil((to - k) / 20)); const iv = setInterval(() => { k = Math.min(to, k + step); cnt.textContent = k; if (k >= to) clearInterval(iv); }, 40);
  } else if (kind === 'staff' || kind === 'notes' || kind === 'bus') {
    if (use3D()) Scene3D.special(kind);
    Snd.play(kind === 'bus' ? 'bus' : kind === 'staff' ? 'ding' : 'tick');
  } else if (kind === 'flight') {
    if (fxEl.querySelector('.flight')) return;
    fxEl.innerHTML = '<div class="flight"><div class="route">김포 ✈ 제주</div><div class="meta">다음 주 토요일 · 07:10 출발 · 성인 2명</div><div class="row"><span class="left">잔여 4석!</span><span class="buy">바로 예매</span></div></div>';
    Snd.play('ding');
  }
}
// 장면 전환 카드: 화면을 덮었다가 걷히면서 다음 장면
const wipe = $('#wipe');
function sceneCard(n, title, swap) {
  return new Promise(res => {
    $('#wipe-n').textContent = n; $('#wipe-t').textContent = title;
    wipe.classList.remove('out'); wipe.classList.add('in'); Snd.play('whoosh');
    setTimeout(() => { swap(); wipe.classList.add('out'); }, 650);
    setTimeout(() => { wipe.classList.remove('in', 'out'); res(); }, 1150);
  });
}
function ask(choices) {
  if (use3D()) Scene3D.setFocus(false);
  clearFx();
  return new Promise(res => {
    choicesEl.innerHTML = choices.map((c, i) => `<button class="choice" data-i="${i}">${c.text}</button>`).join('');
    choicesEl.querySelectorAll('.choice').forEach(b => b.onclick = () => { choicesEl.innerHTML = ''; Snd.play('pop'); res(choices[+b.dataset.i]); });
  });
}

async function startGame(file) {
  const r = await fetch('data/' + file + '.json');
  S.data = await r.json(); S.partner = file; S.score = 0; S.picks = {}; S.ending = null;
  preload(S.data);
  track('start', { file, me: S.me });
  show('game');
  const d = S.data;
  Snd.init(); Snd.setMood('cafe');
  try { await document.fonts.ready; } catch {}
  if (window.Scene3D && !Scene3D.ready && !Scene3D.failed) { Scene3D.failed = !Scene3D.init($('#c3d')); }
  if (use3D()) Scene3D.attach(stage);
  stage.className = 'stage cafe' + (use3D() ? ' three' : ''); setProg(0);
  if (use3D()) { Scene3D.setSet('cafe'); Scene3D.setExpr('smile', 'idle'); Scene3D.hideChar(); }
  setTimeout(() => Snd.play('bell'), 400);
  $('#scene-chip').textContent = d.intro.chip; statChip('');
  charEl.style.opacity = 0;
  await say('nar', d.intro.text);
  charEl.style.opacity = 1;
  for (let i = 0; i < d.scenes.length; i++) {
    const sc = d.scenes[i];
    await sceneCard(i + 1, sc.title, () => {
      stage.className = 'stage ' + sc.bg + (use3D() ? ' three' : ''); setProg(i); Snd.setMood(sc.bg); clearFx(); menuN = 0;
      if (use3D() && (i > 0 || Scene3D.set !== sc.bg)) Scene3D.setSet(sc.bg);
    });
    if (i === 0 && use3D()) { Snd.play('bell'); await Scene3D.enter(); }
    $('#scene-chip').textContent = `${i + 1}. ${sc.title}`;
    statChip(sc.chip || '');
    for (const l of sc.lines) { setExpr(l.expr, true, l.act); fx(l.fx); await say('her', l.text); }
    const c = await ask(sc.choices);
    S.picks[sc.id] = c.key; S.score += c.score;
    track('choice', { file, scene: sc.id, key: c.key });
    await say('me', c.text);
    if (c.score > 0) heart();
    for (const l of c.react) { setExpr(l.expr, true, l.act); fx(l.fx); await say('her', l.text); }
  }
  setProg(d.scenes.length);
  finish();
}

// ===== 엔딩 =====
function pickEnding() {
  const E = S.data.endings;
  const hid = E.find(e => e.when && Object.entries(e.when).every(([k, v]) => S.picks[k] === v));
  if (hid) return hid;
  return E.filter(e => e.min != null).sort((a, b) => b.min - a.min).find(e => S.score >= e.min);
}
function finish() {
  const e = pickEnding(); S.ending = e;
  const p = played(); if (!p.includes(S.partner)) { p.push(S.partner); store.set('played', p); }
  track('ending', { file: S.partner, end: e.id, score: S.score });
  Snd.setMood('end'); Snd.duck(3); Snd.play(e.id);
  const locked = e.id === 'hidden' && (CONFIG.hiddenLocked || e.locked);
  $('#end-chip').textContent = e.chip || `${S.data.mbti}와의 소개팅 끝`;
  $('#end-char').src = S.data.img + (e.expr || 'smile') + '.png';
  // 도감 기록
  const dex = store.get('dex', {}); dex[S.partner] = [...new Set([...(dex[S.partner] || []), e.id])]; store.set('dex', dex);
  const es = $('.end-stage'); es.classList.toggle('three', use3D());
  if (use3D()) {
    Scene3D.attach(es); Scene3D.setSet(e.set || 'cafe'); Scene3D.setFocus(false);
    if (e.special) Scene3D.special(e.special);
    if (e.special !== 'istj') Scene3D.setExpr(e.expr || 'smile', e.act);
  }
  $('#end-name').textContent = `${e.emoji} ${e.name}`;
  const isChat = e.lines.some(l => l.startsWith('"'));
  const D = i => 0.3 + i * 0.75;
  if (locked) $('#end-lines').innerHTML = '<p>히든 엔딩을 찾았어요!</p><p>잠금을 풀면 볼 수 있어요.</p>';
  else if (isChat) {
    // 카톡 화면: 따옴표 대사는 ENFP 메시지, 나머지는 회색 안내
    const av = S.data.img + 'smile.png';
    $('#end-lines').innerHTML = '<div class="kakao">' + e.lines.map((l, i) => l.startsWith('"')
      ? `<div class="msg" style="animation-delay:${D(i)}s"><div class="av" style="background-image:url('${av}')"></div><div><div class="nm">${S.data.mbti}</div><div class="bb">${l.replace(/^"|"$/g, '')}</div></div></div>`
      : `<div class="nar" style="animation-delay:${D(i)}s">${l}</div>`).join('') + '</div>' +
      `<p class="end-punch" style="animation-delay:${D(e.lines.length)}s">${e.punch}</p>`;
    e.lines.forEach((l, i) => { if (l.startsWith('"')) setTimeout(() => Snd.play('ding'), D(i) * 1000); });
  } else $('#end-lines').innerHTML = e.lines.map((l, i) => `<p style="animation-delay:${D(i)}s">${l}</p>`).join('') +
      `<p class="end-punch" style="animation-delay:${D(e.lines.length)}s">${e.punch}</p>`;
  const st = $('#end-stat'); st.textContent = e.stat; st.style.animationDelay = `${0.6 + e.lines.length * 0.75}s`;
  show('ending');
}

// ===== 결과 카드 =====
function pct() {
  if (S.ending.id === 'hidden') return 99;
  const max = S.data.scenes.length * 3, min = -3;
  return Math.max(12, Math.min(97, Math.round(30 + (S.score - min) / (max - min) * 66)));
}
function pattern() {
  const cnt = { A: 0, B: 0, C: 0 }; Object.values(S.picks).forEach(k => cnt[k]++);
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  return S.data.result.pattern[top[1] >= 3 ? top[0] : 'mix'];
}
function dexHTML() {
  const dex = store.get('dex', {}), d = S.data, got = dex[S.partner] || [];
  const ends = d.endings.map(e => `<i class="${got.includes(e.id) ? 'on' : ''}" title="${e.name}">${got.includes(e.id) ? e.emoji : '?'}</i>`).join('');
  const done = new Set(Object.keys(dex).map(f => f.split('-')[0].toUpperCase()));
  const grid = MBTI.map(m => `<b class="${done.has(m) ? 'on' : ''}">${m}</b>`).join('');
  return { ends, grid, n: got.length, total: d.endings.length, people: done.size };
}
$('#btn-result').onclick = () => {
  const d = S.data, e = S.ending, p = pattern(), n = pct();
  S.shot = use3D() ? Scene3D.snapshot() : null;
  const card = $('#card'), th = e.theme || ['#ff6fb5', '#ffe0f0', '#fff3c4'];
  card.style.setProperty('--ac', th[0]); card.style.setProperty('--b1', th[1]); card.style.setProperty('--b2', th[2]);
  $('#card-who').textContent = `${S.me && S.me !== '모름' ? S.me + ' × ' : ''}${d.label}`;
  const ph = $('#card-photo'); ph.src = S.shot || (d.img + (e.expr || 'smile') + '.png'); ph.classList.toggle('png', !S.shot);
  $('#card-end').textContent = `${e.emoji} ${e.name}`;
  $('#card-pattern').textContent = p.line;
  $('#card-fun').innerHTML = d.result.funStats.map(s => `<li>${s}</li>`).join('');
  const dx = dexHTML();
  $('#card-dex').innerHTML = `<div class="dex-row"><span>${d.mbti} 엔딩 ${dx.n}/${dx.total}</span><span class="dex-ends">${dx.ends}</span></div>`;
  $('#dex').innerHTML = `<div class="dex-title">소개팅 도감 <small>${dx.people}/16명</small></div><div class="dex-grid">${dx.grid}</div><div class="dex-sub">${d.mbti} 엔딩 ${dx.n}/${dx.total}개 발견 · ${dx.n < dx.total ? '다른 선택을 하면 다른 엔딩이 나와요!' : '엔딩 전부 발견!'}</div>`;
  $('#ad-slot').hidden = !CONFIG.adSlot;
  show('result');
  const el = $('#card-pct'); let k = 0; const t = setInterval(() => { k = Math.min(n, k + Math.ceil(n / 25)); el.textContent = k; if (k >= n) clearInterval(t); }, 30);
  track('result', { file: S.partner, pct: n, type: p.type });
};
$('#btn-again').onclick = () => startGame(S.partner);
$('#btn-other').onclick = () => { renderPartners(); show('partner'); };

// 결과 이미지 만들기 (인스타 스토리·카톡 공유용 1080x1920)
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function wrap(ctx, text, x, y, maxW, lh) {
  let line = '', yy = y;
  for (const ch of text) { if (ctx.measureText(line + ch).width > maxW && line) { ctx.fillText(line, x, yy); line = ch; yy += lh; } else line += ch; }
  ctx.fillText(line, x, yy); return yy;
}
async function makeImage() {
  const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), d = S.data, e = S.ending, th = e.theme || ['#ff6fb5', '#ffe0f0', '#fff3c4'];
  const T = '"Jua","Noto Sans KR",sans-serif', B = '"Noto Sans KR","Apple SD Gothic Neo",sans-serif';
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, th[1]); g.addColorStop(1, th[2]); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.textAlign = 'center';
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(W / 2 - 230, 110, 460, 76, 38); x.fill();
  x.fillStyle = th[0]; x.font = `40px ${T}`; x.fillText('만약에 소개팅 · 웅이프', W / 2, 162);
  x.fillStyle = '#2b2b3a'; x.font = `66px ${T}`; x.fillText($('#card-who').textContent, W / 2, 280);
  try {
    const im = await loadImg($('#card-photo').src);
    const pw = 860, phh = 640, px = (W - pw) / 2, py = 320;
    x.save(); x.beginPath(); x.roundRect(px, py, pw, phh, 48); x.clip();
    if (S.shot) { const s = Math.max(pw / im.width, phh / im.height); x.drawImage(im, px + (pw - im.width * s) / 2, py + (phh - im.height * s) / 2, im.width * s, im.height * s); }
    else { x.fillStyle = '#fff'; x.fillRect(px, py, pw, phh); const h = phh * 0.95, w = im.width * h / im.height; x.drawImage(im, W / 2 - w / 2, py + phh - h, w, h); }
    x.restore(); x.lineWidth = 10; x.strokeStyle = '#fff'; x.beginPath(); x.roundRect(px, py, pw, phh, 48); x.stroke();
  } catch {}
  x.fillStyle = th[0]; x.font = `190px ${T}`; x.fillText(pct() + '%', W / 2, 1160);
  x.fillStyle = '#2b2b3a'; x.font = `70px ${T}`; x.fillText(`${e.emoji} ${e.name}`, W / 2, 1265);
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(110, 1310, W - 220, 180, 40); x.fill();
  x.fillStyle = '#5a4d60'; x.font = `700 42px ${B}`; wrap(x, pattern().line, W / 2, 1385, W - 300, 60);
  x.fillStyle = '#6b5d70'; x.font = `700 40px ${B}`; d.result.funStats.forEach((s, i) => x.fillText(s, W / 2, 1575 + i * 60));
  const dx = dexHTML(); x.fillStyle = th[0]; x.font = `46px ${T}`; x.fillText(`${d.mbti} 엔딩 ${dx.n}/${dx.total} 발견`, W / 2, 1790);
  x.fillStyle = '#9a8da0'; x.font = `36px ${T}`; x.fillText('나도 해 보기 → 웅이프 프로필 링크', W / 2, 1855);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
$('#btn-share').onclick = async () => {
  const url = location.origin + location.pathname + '?with=' + S.partner;
  const text = `나 ${S.data.mbti}랑 소개팅했는데 ${S.ending.emoji} ${S.ending.name} 나옴 ㅋㅋ 너도 해 봐`;
  track('share_click', { file: S.partner });
  try {
    const blob = await makeImage();
    const f = new File([blob], 'sogaeting.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: text + ' ' + url }); track('share_done', { how: 'file' }); return; }
    if (navigator.share) { await navigator.share({ text, url }); track('share_done', { how: 'link' }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sogaeting.png'; a.click();
    try { await navigator.clipboard.writeText(text + ' ' + url); } catch {}
    toast('이미지 저장 + 링크 복사 완료!'); track('share_done', { how: 'download' });
  } catch (err) { if (err && err.name !== 'AbortError') toast('공유가 안 됐어요. 화면을 캡처해 주세요!'); }
};

// ===== 첫 화면 =====
if (viaLink && PARTNERS.some(p => p.file === viaLink)) {
  $('#scr-start .btn.main').textContent = '친구가 한 소개팅 나도 하기';
}
show('start');
})();
