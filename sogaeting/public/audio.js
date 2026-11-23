// 만약에 소개팅 — 소리 (전부 웹에서 합성, 파일 없음)
// BGM: 메인 곡 하나(C – Am – F – G 로파이 진행)를 깔고 장면마다 톤만 바꿈
// 효과음: 선택 '뿅' · 하트 '띵' · 대사 '톡톡' · 엔딩 징글 4종
(() => {
'use strict';
const MOODS = {
  // tempo: BPM / arp: 한 박에 몇 음 / hat: 하이햇 / bass / pad: 길게 까는 화음 / cut: 필터(밝기) / vol
  // 카페·카운터·덕질은 시작 화면과 같은 곡 (빨라지는 버전 뺌)
  cafe:    { tempo: 96,  arp: 2, hat: true,  bass: true,  pad: false, cut: 2400, vol: 0.8 },
  counter: { tempo: 96,  arp: 2, hat: true,  bass: true,  pad: false, cut: 2400, vol: 0.8 },
  table:   { tempo: 96,  arp: 2, hat: true,  bass: true,  pad: false, cut: 2400, vol: 0.8 },
  rain:    { tempo: 72,  arp: 1, hat: false, bass: false, pad: true,  cut: 1500, vol: 1.7, piano: true },
  street:  { tempo: 80,  arp: 1, hat: false, bass: true,  pad: true,  cut: 1900, vol: 1.2 },
  end:     { tempo: 84,  arp: 1, hat: false, bass: false, pad: true,  cut: 1700, vol: 1.5 },
  start:   { tempo: 96,  arp: 2, hat: true,  bass: true,  pad: false, cut: 2400, vol: 0.8 },
};
// 코드 진행 (MIDI 번호): Cmaj7 · Am7 · Fmaj7 · G7(sus 느낌)
const CHORDS = [
  { root: 48, notes: [60, 64, 67, 71] },
  { root: 45, notes: [57, 60, 64, 67] },
  { root: 41, notes: [57, 60, 64, 65] },
  { root: 43, notes: [59, 62, 65, 67] },
];
const hz = m => 440 * Math.pow(2, (m - 69) / 12);

// ----- 악기 (ctx, 출력, 시작 시간을 받아서 그 시간에 소리를 예약) -----
function tone(ctx, out, t, freq, dur, o = {}) {
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = o.type || 'triangle'; osc.frequency.setValueAtTime(freq, t);
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + dur * 0.8);
  if (o.detune) osc.detune.value = o.detune;
  const v = o.vol ?? 0.2, a = o.attack ?? 0.008;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = osc;
  if (o.cut) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.cut; f.Q.value = 0.7; osc.connect(f); node = f; }
  node.connect(g); g.connect(out);
  osc.start(t); osc.stop(t + dur + 0.05);
}
let noiseBuf = null;
function noise(ctx, out, t, dur, vol, hp = 7000) {
  if (!noiseBuf || noiseBuf.sampleRate !== ctx.sampleRate) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + dur + 0.02);
}

// 한 마디(4박) 예약
function bar(ctx, out, t, mood, i) {
  const M = MOODS[mood] || MOODS.cafe, beat = 60 / M.tempo, ch = CHORDS[i % 4], v = M.vol;
  // 패드: 길게 까는 화음
  if (M.pad) ch.notes.forEach((n, k) => tone(ctx, out, t, hz(n), beat * 4.2, { type: 'sine', vol: 0.035 * v, attack: 0.5, detune: k % 2 ? 6 : -6 }));
  // 베이스: 1·3박
  if (M.bass) [0, 2].forEach(b => tone(ctx, out, t + b * beat, hz(ch.root), beat * 1.6, { type: 'triangle', vol: 0.13 * v, cut: 500 }));
  // 아르페지오(멜로디 대신 통통 튀는 음)
  const step = beat / M.arp, n = 4 * M.arp, seq = [0, 2, 1, 3, 2, 1, 3, 0];
  for (let k = 0; k < n; k++) {
    if (M.piano && k % 2) continue;                   // 비 장면: 듬성듬성
    let note = ch.notes[seq[k % seq.length]] + (M.arp >= 4 && k % 8 >= 4 ? 12 : 0);
    if (mood === 'street' && k === n - 1) note += 12;
    tone(ctx, out, t + k * step, hz(note), M.piano ? beat * 1.8 : step * 1.6,
      { type: M.piano ? 'sine' : 'square', vol: (M.piano ? 0.07 : 0.035) * v, cut: M.cut, attack: 0.004 });
  }
  // 하이햇: 8분음 엇박
  if (M.hat) for (let k = 0; k < 8; k++) noise(ctx, out, t + k * beat / 2, k % 2 ? 0.05 : 0.025, (k % 2 ? 0.05 : 0.025) * v);
  // 킥 대용: 둥
  if (M.bass) [0, 2].forEach(b => tone(ctx, out, t + b * beat, 120, 0.18, { type: 'sine', vol: 0.18 * v, slide: 45 }));
  return beat * 4;
}

// ----- 효과음 -----
const SFX = {
  pop(ctx, out, t) { tone(ctx, out, t, 520, 0.14, { type: 'sine', vol: 0.3, slide: 1100 }); },
  ding(ctx, out, t) { [1568, 2093].forEach((f, i) => tone(ctx, out, t + i * 0.07, f, 0.6, { type: 'sine', vol: 0.16 })); },
  tick(ctx, out, t) { tone(ctx, out, t, 1500 + Math.random() * 300, 0.035, { type: 'sine', vol: 0.05 }); },
  // 엔딩 징글
  after(ctx, out, t) { [72, 76, 79, 84, 88].forEach((n, i) => tone(ctx, out, t + i * 0.11, hz(n), 0.9, { type: 'sine', vol: 0.15 }));
    [1, 2].forEach(i => noise(ctx, out, t + 0.55 + i * 0.12, 0.25, 0.03, 9000)); },
  friend(ctx, out, t) { [67, 72, 67, 76].forEach((n, i) => tone(ctx, out, t + i * 0.13, hz(n), 0.2, { type: 'square', vol: 0.13, cut: 3000 }));
    tone(ctx, out, t + 0.55, hz(79), 0.5, { type: 'square', vol: 0.13, cut: 3000 }); },
  matchmaker(ctx, out, t) { [67, 66, 65, 64].forEach((n, i) => tone(ctx, out, t + i * 0.28, hz(n), i === 3 ? 0.9 : 0.3, { type: 'triangle', vol: 0.16, slide: i === 3 ? hz(n) * 0.94 : undefined })); },
  hidden(ctx, out, t) { [84, 88, 91, 88, 86, 84, 83, 84].forEach((n, i) => tone(ctx, out, t + i * 0.22, hz(n), 1.1, { type: 'sine', vol: 0.12 })); },
};

// ----- 재생기 -----
const Snd = {
  ctx: null, master: null, bgm: null, sfx: null, mood: null, nextT: 0, barI: 0, timer: null,
  on: (() => { try { return localStorage.getItem('sgt_sound') !== '0'; } catch { return true; } })(),
  init() {
    if (this.ctx) { this.ctx.resume && this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ctx = this.ctx = new AC();
    this.master = ctx.createGain(); this.master.gain.value = this.on ? 0.9 : 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    this.master.connect(comp); comp.connect(ctx.destination);
    this.bgm = ctx.createGain(); this.bgm.gain.value = 1.1; this.bgm.connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 1; this.sfx.connect(this.master);
    document.addEventListener('visibilitychange', () => { if (!this.ctx) return; document.hidden ? this.ctx.suspend() : this.ctx.resume(); });
  },
  setMood(m) {
    if (!this.ctx) return;
    this.mood = m;
    if (!this.timer) {
      this.nextT = this.ctx.currentTime + 0.1; this.barI = 0;
      this.timer = setInterval(() => this.tick(), 120); this.tick();
    }
  },
  tick() { // 0.6초 앞까지 미리 예약
    const ctx = this.ctx; if (!ctx || !this.mood) return;
    while (this.nextT < ctx.currentTime + 0.6) { this.nextT += bar(ctx, this.bgm, this.nextT, this.mood, this.barI++); }
  },
  duck(sec = 2.2) { // 징글 나올 때 BGM 잠깐 줄이기
    if (!this.ctx) return; const g = this.bgm.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.25, t + 0.15); g.linearRampToValueAtTime(1.1, t + sec);
  },
  play(name) { if (!this.ctx || !this.on || !SFX[name]) return; SFX[name](this.ctx, this.sfx, this.ctx.currentTime + 0.01); },
  toggle() {
    this.on = !this.on; try { localStorage.setItem('sgt_sound', this.on ? '1' : '0'); } catch {}
    if (this.ctx) this.master.gain.setTargetAtTime(this.on ? 0.9 : 0, this.ctx.currentTime, 0.05);
    return this.on;
  },
};
window.Snd = Snd;
window.__sndTest = { bar, SFX, MOODS }; // 오프라인 점검용
})();
