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
function setExpr(e, bounce = true) {
  const src = S.data.img + e + '.png';
  if (!charEl.src.endsWith(src)) charEl.src = src;
  if (bounce) { charEl.classList.remove('bounce'); void charEl.offsetWidth; charEl.classList.add('bounce'); }
}
async function say(who, text) {
  whoEl.className = 'who' + (who === 'me' ? ' me' : who === 'nar' ? ' nar' : '');
  whoEl.textContent = who === 'me' ? '나' : who === 'nar' ? '' : S.data.mbti;
  whoEl.style.display = who === 'nar' ? 'none' : '';
  nextEl.classList.remove('on');
  textEl.textContent = '';
  const t = { skip: false }; typing = t;
  for (let i = 1; i <= text.length; i++) {
    if (t.skip) { textEl.textContent = text; break; }
    textEl.textContent = text.slice(0, i);
    if (who !== 'nar' && i % 3 === 1 && text[i - 1] !== ' ') Snd.play('tick');
    await sleep(text[i - 1] === ' ' ? 18 : 34);
  }
  typing = null;
  nextEl.classList.add('on');
  await new Promise(r => { tapResolve = r; });
}
function heart() { Snd.play('ding'); const h = $('#heart-pop'); h.classList.remove('on'); void h.offsetWidth; h.classList.add('on'); }
function setProg(i) { $('#prog').innerHTML = S.data.scenes.map((_, k) => `<i class="${k < i ? 'done' : ''}"></i>`).join(''); }
function statChip(text) { const el = $('#stat-chip'); el.classList.remove('on'); if (!text) return; el.innerHTML = text.replace(/(\d[\d,]*)/g, '<b>$1</b>'); setTimeout(() => el.classList.add('on'), 700); }
function ask(choices) {
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
  stage.className = 'stage cafe'; setProg(0);
  $('#scene-chip').textContent = d.intro.chip; statChip('');
  charEl.style.opacity = 0;
  await say('nar', d.intro.text);
  charEl.style.opacity = 1;
  for (let i = 0; i < d.scenes.length; i++) {
    const sc = d.scenes[i];
    stage.className = 'stage ' + sc.bg; setProg(i); Snd.setMood(sc.bg);
    $('#scene-chip').textContent = `${i + 1}. ${sc.title}`;
    statChip(sc.chip || '');
    for (const l of sc.lines) { setExpr(l.expr); await say('her', l.text); }
    const c = await ask(sc.choices);
    S.picks[sc.id] = c.key; S.score += c.score;
    track('choice', { file, scene: sc.id, key: c.key });
    await say('me', c.text);
    if (c.score > 0) heart();
    for (const l of c.react) { setExpr(l.expr); await say('her', l.text); }
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
  $('#end-name').textContent = `${e.emoji} ${e.name}`;
  $('#end-lines').innerHTML = locked
    ? '<p>히든 엔딩을 찾았어요!</p><p>잠금을 풀면 볼 수 있어요.</p>'
    : e.lines.map((l, i) => `<p style="animation-delay:${0.2 + i * 0.55}s">${l}</p>`).join('') +
      `<p class="end-punch" style="animation-delay:${0.2 + e.lines.length * 0.55}s">${e.punch}</p>`;
  const st = $('#end-stat'); st.textContent = e.stat; st.style.animationDelay = `${0.6 + e.lines.length * 0.55}s`;
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
$('#btn-result').onclick = () => {
  const d = S.data, e = S.ending, p = pattern(), n = pct();
  $('#card-who').textContent = `${S.me && S.me !== '모름' ? S.me + ' × ' : ''}${d.label}`;
  $('#card-char').src = d.img + (e.expr || 'smile') + '.png';
  $('#card-end').textContent = `${e.emoji} ${e.name}`;
  $('#card-pattern').textContent = p.line;
  $('#card-fun').innerHTML = d.result.funStats.map(s => `<li>· ${s}</li>`).join('');
  $('#ad-slot').hidden = !CONFIG.adSlot;
  show('result');
  // 숫자 올라가기
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
  const x = c.getContext('2d'), d = S.data, e = S.ending, F = 'Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#ffd2e9'); g.addColorStop(.55, '#fff6fb'); g.addColorStop(1, '#fff0b8');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.textAlign = 'center';
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(W / 2 - 230, 150, 460, 76, 38); x.fill();
  x.fillStyle = '#d64f93'; x.font = `900 40px ${F}`; x.fillText('만약에 소개팅 · 웅이프', W / 2, 202);
  x.fillStyle = '#2b2b3a'; x.font = `900 62px ${F}`; x.fillText($('#card-who').textContent, W / 2, 320);
  try { const im = await loadImg(d.img + (e.expr || 'smile') + '.png'); const h = 620, w = im.width * h / im.height; x.drawImage(im, W / 2 - w / 2, 350, w, h); } catch {}
  x.fillStyle = '#ff6fb5'; x.font = `900 190px ${F}`; x.fillText(pct() + '%', W / 2, 1150);
  x.fillStyle = '#2b2b3a'; x.font = `900 64px ${F}`; x.fillText(`${e.emoji} ${e.name}`, W / 2, 1250);
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(110, 1300, W - 220, 190, 40); x.fill();
  x.fillStyle = '#5a4d60'; x.font = `800 44px ${F}`; wrap(x, pattern().line, W / 2, 1380, W - 300, 62);
  x.fillStyle = '#6b5d70'; x.font = `800 42px ${F}`;
  d.result.funStats.forEach((s, i) => x.fillText('· ' + s, W / 2, 1580 + i * 64));
  x.fillStyle = '#b4a6b8'; x.font = `800 36px ${F}`; x.fillText('나도 해 보기 → 웅이프 프로필 링크', W / 2, 1840);
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
