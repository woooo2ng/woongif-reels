// 웅이프 만약에 신청소 — API (Cloudflare Pages Functions + D1)
// 바인딩: DB (D1), 환경변수: ADMIN_PASSWORD

const MBTI = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];
const STAGES = ["접수", "제작 중", "공개 예정", "나옴"];
const MBTI_STATUS = ["open", "making", "today", "done"];   // today = 오늘 공개
const DAILY_IP_LIKES = 150;
const SAME_ITEM_PER_IP = 3;   // 같은 글은 같은 인터넷(IP)에서 하루 3번까지 (시크릿 창·기록 삭제 중복 막기)
const SAME_ITEM_MSG = "이 글은 오늘 이 인터넷에서 이미 여러 번 눌렸어요. 내일 다시 눌러주세요!";  // 같은 와이파이(학교·카페)에서 하루 좋아요 상한 (종류별)
const DAILY_IP_IDEAS = 5;
const DAILY_IP_SITUATIONS = 10;
const DAILY_IP_SCENES = 10;
const ADMIN_MAX_FAILS = 5;     // 관리자 비밀번호 15분에 5번 틀리면 잠금
const BAD = ["시발","씨발","ㅅㅂ","병신","ㅂㅅ","좆","새끼","fuck","섹스","자살"];

const RELS = ["커플", "친구", "직장 동료"];

// 주민 현황 + 유형별 한마디
const TOWN_IP_MAX = 30;        // 같은 인터넷에서 새로 등록할 수 있는 기기 수
const DAILY_IP_POSTS = 10;     // 게시판 글: 같은 인터넷 하루 10개
const POST_MAX = 100;          // 글 길이
const REPORT_HIDE = 3;         // 신고 3번이면 자동 숨김
// 게시판 종류: msg = 한마디, ask = 질문(답글 가능), trait = 특징
const BOARD_CATS = ["msg", "ask", "trait"];
const catOf = (c) => (c === "ask" || c === "trait" ? c : "msg");
const CAT_SQL = (c) => (c === "msg" ? "p.cat NOT IN ('ask','trait')" : "p.cat='" + c + "'");
const DAILY_IP_REPLIES = 30;

// ---------- 맞춤 궁합 영상 주문 ----------
// 가격은 서버에서만 정함 (화면에서 보낸 금액은 믿지 않음). sale: 오픈 할인가(없으면 null)
const PRODUCTS = {
  basic:   { name: "기본 · 우리 조합 궁합편",   price: 14900, sale: null },
  special: { name: "스페셜 · 우리 이야기편", price: 29900, sale: null },
};
const priceOf = (pkg) => PRODUCTS[pkg].sale ?? PRODUCTS[pkg].price;
const ORDER_RELS = ["커플", "부부", "가족", "친구"];
const ORDER_STATUS = ["paid", "script", "making", "done", "canceled"];   // pending = 결제 전
const DELIVERY_DAYS = 7;
const DAILY_IP_ORDERS = 20;
// 토스페이먼츠 키: Cloudflare 환경 변수(TOSS_CLIENT_KEY, TOSS_SECRET_KEY). 없으면 토스 문서용 테스트 키(실제 돈 안 나감)
const TOSS_DOC_CK = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const TOSS_DOC_SK = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
const tossKeys = (env) => (env.TOSS_CLIENT_KEY && env.TOSS_SECRET_KEY
  ? { ck: String(env.TOSS_CLIENT_KEY).trim(), sk: String(env.TOSS_SECRET_KEY).trim() }
  : { ck: TOSS_DOC_CK, sk: TOSS_DOC_SK });
async function toss(env, path, payload, idem) {
  const headers = { Authorization: "Basic " + btoa(tossKeys(env).sk + ":"), "Content-Type": "application/json" };
  if (idem) headers["Idempotency-Key"] = idem;
  try {
    const r = await fetch("https://api.tosspayments.com/v1/" + path, { method: "POST", headers, body: JSON.stringify(payload) });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, data };
  } catch (e) {
    return { ok: false, data: { message: "결제사와 연결이 안 돼요. 잠시 후 다시 해 주세요" } };
  }
}
function kstDayPlus(ms, days) {
  return new Date(ms + 9 * 3600e3 + days * 86400e3).toISOString().slice(0, 10);
}
function newOrderId() {
  const d = new Date(Date.now() + 9 * 3600e3).toISOString().slice(2, 10).replace(/-/g, "");
  const r = [...crypto.getRandomValues(new Uint8Array(4))].map((b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
  return `WF-${d}-${r}`;
}
const CHAR_RULE = { g: ["여", "남"], hair: ["short", "long", "tied", "spiky", "basic", "dandy"], hc: 5, skin: 3, cl: 8 };
function cleanChar(c) {
  c = c || {};
  const n = (v, max) => { v = Math.floor(Number(v)); return v >= 0 && v < max ? v : 0; };
  return {
    g: CHAR_RULE.g.includes(c.g) ? c.g : "여",
    hair: CHAR_RULE.hair.includes(c.hair) ? c.hair : "short",
    hc: n(c.hc, CHAR_RULE.hc), skin: n(c.skin, CHAR_RULE.skin), cl: n(c.cl, CHAR_RULE.cl),
    gl: !!c.gl, feat: clean(c.feat, 30),
    top: ["tee", "hood", "shirt"].includes(c.top) ? c.top : "tee",
    bottom: ["skirt", "pants", "shorts"].includes(c.bottom) ? c.bottom : (c.g === "남" ? "pants" : "skirt"),
    bc: n(c.bc, 6), hat: ["none", "cap", "beanie"].includes(c.hat) ? c.hat : "none", scarf: !!c.scarf,
  };
}
// ---------- 주문 알림 메일 (Resend) ----------
// Cloudflare 환경 변수 RESEND_API_KEY(Secret)가 있으면 새 주문·취소 때 NOTIFY_EMAIL(기본 ddd12340@naver.com)로 메일
const NOTIFY_DEFAULT = "ddd12340@naver.com";
const H = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const C_HAIR = { short: "짧은(단발/옆가르마)", long: "긴 머리/장발", tied: "만두머리/포마드", spiky: "삐죽머리", basic: "짧은 머리", dandy: "덮은 머리" };
const C_TOP = { tee: "티셔츠", hood: "후드티", shirt: "셔츠·넥타이" }, C_BOT = { skirt: "치마", pants: "바지", shorts: "반바지" };
const C_HC = ["검정", "갈색", "밝은 갈색", "금발", "핑크"], C_SK = ["밝은", "중간", "어두운"], C_CL = ["분홍", "노랑", "민트", "파랑", "보라", "주황", "연두", "회색"], C_BC = ["남색", "검정", "베이지", "청", "노랑", "분홍"];
function charText(c) {
  if (!c) return "";
  return `${c.g === "남" ? "남자" : "여자"} · ${C_HAIR[c.hair] || c.hair} · 머리 ${C_HC[c.hc]} · 피부 ${C_SK[c.skin]} · ${C_CL[c.cl]} ${C_TOP[c.top] || ""} · ${C_BC[c.bc] || ""} ${C_BOT[c.bottom] || ""}`
    + (c.hat && c.hat !== "none" ? ` · ${c.hat === "cap" ? "캡모자" : "비니"}` : "") + (c.scarf ? " · 목도리" : "") + (c.gl ? " · 안경" : "") + (c.feat ? ` · "${c.feat}"` : "");
}
async function notifyOrder(env, o, kind, origin) {
  if (!env.RESEND_API_KEY) return;
  const ch = JSON.parse(o.chars || "{}");
  const title = kind === "cancel" ? `[웅이프] 주문 취소 ${o.id}` : `[웅이프] 새 주문 ${o.id} · ${PRODUCTS[o.pkg]?.name.split(" · ")[0]} ${o.amount.toLocaleString()}원`;
  const row = (k, v) => `<tr><td style="padding:6px 10px;color:#666;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 10px">${v}</td></tr>`;
  const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.6">
    <h2 style="margin:0 0 12px">${kind === "cancel" ? "주문이 취소됐어요 (자동 환불)" : "새 주문이 들어왔어요 🎬"}</h2>
    <table style="border-collapse:collapse;border:1px solid #ddd">
    ${row("주문번호", H(o.id))}${row("상품", H(PRODUCTS[o.pkg]?.name) + " · " + o.amount.toLocaleString() + "원")}
    ${row("두 사람", `${H(o.name_a)} ${o.a_type} × ${H(o.name_b)} ${o.b_type} · ${H(o.rel)}`)}
    ${row("캐릭터 A", H(charText(ch.a)))}${row("캐릭터 B", H(charText(ch.b)))}
    ${o.story ? row("사연", H(o.story).replace(/\n/g, "<br>")) : ""}
    ${row("인스타", o.insta ? `<a href="https://www.instagram.com/${H(o.insta)}/">@${H(o.insta)}</a>` : "-")}${row("이메일", H(o.email))}
    ${kind === "cancel" ? "" : row("전달 기한", `<b>${H(o.due_day)}</b>까지`)}</table>
    <p><a href="${origin}/admin">관리 페이지에서 보기 →</a></p></div>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + String(env.RESEND_API_KEY).trim(), "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.NOTIFY_FROM || "웅이프 주문 <onboarding@resend.dev>", to: [env.NOTIFY_EMAIL || NOTIFY_DEFAULT], subject: title, html }),
    });
  } catch (e) { /* 메일 실패해도 주문은 그대로 */ }
}
function orderRow(o, full) {
  const r = {
    id: o.id, pkg: o.pkg, product: PRODUCTS[o.pkg]?.name || o.pkg, amount: o.amount, rel: o.rel, a: o.a_type, b: o.b_type,
    nameA: o.name_a, nameB: o.name_b, status: o.status, due: o.due_day, link: o.status === "done" ? o.link : null,
    script: o.script_link || null, at: o.created_at, paidAt: o.paid_at, email: o.email,
  };
  if (full) Object.assign(r, { chars: JSON.parse(o.chars || "{}"), story: o.story, kakao: o.kakao, insta: o.insta, reels: !!o.reels, method: o.method, note: o.note, link: o.link, cancelReason: o.cancel_reason, owner: o.owner });
  return r;
}

// 호감 MBTI 투표: 결과는 비밀, 참여 인원만 공개. 마감 뒤 관리자가 '공개'를 켜면 1~3위만 보여줌
const POLL = { id: "fav-2026-11", end: "2026-11-30", reveal: "2026-12-01" };   // end = 이날(한국 시간) 밤 12시까지
const POLL_IP_MAX = 30;   // 같은 인터넷(IP)에서 이 투표에 참여할 수 있는 기기 수
const pollClosed = () => kstDay() > POLL.end;
// 커플·친구·직장 동료는 순서 상관없음, 직접 입력(엄마와 아들 등)은 순서대로
// 친구·직장 동료는 순서 상관없음 / 커플(앞 남자·뒤 여자)과 직접 입력은 순서대로
const pairKey = (a, b, rel) => (rel === "친구" || rel === "직장 동료" ? [a, b].sort() : [a, b]).join("|") + "|" + rel;

// 궁합/상황 투표판: 표 수 + 상태를 합쳐서 반환
async function comboBoard(db, kind, voter, all) {
  const [counts, status, mine, sits] = await Promise.all([
    db.prepare("SELECT key, n, first_at FROM like_counts WHERE kind=?").bind(kind).all(),
    db.prepare("SELECT key, status, link, author FROM combo_status WHERE kind=?").bind(kind).all(),
    db.prepare("SELECT key FROM likes WHERE kind=? AND voter=? AND day=?").bind(kind, voter, kstDay()).all(),
    kind === "situation" ? db.prepare("SELECT id, text, active, by_user FROM situations ORDER BY id").all() : null,
  ]);
  const sitMap = sits ? Object.fromEntries(sits.results.map((s) => [s.id, s])) : {};
  const map = new Map();
  for (const r of counts.results) map.set(r.key, { key: r.key, votes: r.n, created: r.first_at || 0, status: "open", link: null });
  for (const r of status.results) {
    const it = map.get(r.key) || { key: r.key, votes: 0 };
    map.set(r.key, { ...it, status: r.status, link: r.link, author: all ? (r.author || null) : maskInsta(r.author) });
  }
  const items = [...map.values()].map((it) => {
    const p = it.key.split("|");
    if (kind === "pair") return { ...it, a: p[0], b: p[1], rel: p[2] };
    const s = sitMap[p[1]];
    return { ...it, type: p[0], sid: Number(p[1]), text: s?.text || "(지운 상황)", active: !!s?.active };
  }).filter((it) => kind === "pair" || all || it.active || it.status !== "open");
  const hidden = items.filter((i) => i.status === "hidden");
  if (!all) items.splice(0, items.length, ...items.filter((i) => i.status !== "hidden"));
  items.sort((x, y) => y.votes - x.votes);
  const out = {
    ranking: items.filter((i) => i.status === "open"), // 자르면 하트 적은 조합이 안 보이는데 신청하면 "이미 있음"이 됨
    making: items.filter((i) => i.status === "making" || i.status === "today"),
    done: items.filter((i) => i.status === "done"),
    todayLikes: mine.results.map((r) => r.key),
  };
  if (all) out.hidden = hidden;
  if (kind === "pair") out.rels = RELS;
  else out.situations = sits.results.filter((s) => s.active && !s.by_user).map(({ id, text }) => ({ id, text }));
  return out;
}

// 오늘 좋아요 켜기/끄기. onlyOn이면 이미 눌렀을 때 끄지 않음 (새 궁합 신청용)
async function toggleLike(db, kind, key, voter, ip, onlyOn) {
  const day = kstDay();
  const had = await db.prepare("SELECT 1 x FROM likes WHERE kind=? AND key=? AND voter=? AND day=?").bind(kind, key, voter, day).first();
  let liked;
  if (had && onlyOn) liked = true;
  else if (had) {
    await db.batch([
      db.prepare("DELETE FROM likes WHERE kind=? AND key=? AND voter=? AND day=?").bind(kind, key, voter, day),
      db.prepare("UPDATE like_counts SET n=MAX(n-1,0) WHERE kind=? AND key=?").bind(kind, key),
    ]);
    liked = false;
  } else {
    const n = await db.prepare("SELECT COUNT(*) n FROM likes WHERE kind=? AND ip=? AND day=?").bind(kind, ip, day).first();
    if (n.n >= DAILY_IP_LIKES) return { error: "오늘은 이 네트워크에서 좋아요가 너무 많아요. 내일 다시!" };
    const same = await db.prepare("SELECT COUNT(*) n FROM likes WHERE kind=? AND key=? AND ip=? AND day=?").bind(kind, key, ip, day).first();
    if (same.n >= SAME_ITEM_PER_IP) return { error: SAME_ITEM_MSG };
    const ins = await db.prepare("INSERT OR IGNORE INTO likes (kind, key, voter, day, ip, created_at) VALUES (?,?,?,?,?,?)")
      .bind(kind, key, voter, day, ip, Date.now()).run();
    if (ins.meta.changes)
      await db.prepare(`INSERT INTO like_counts (kind, key, n, first_at) VALUES (?,?,1,?)
        ON CONFLICT(kind, key) DO UPDATE SET n=n+1`).bind(kind, key, Date.now()).run();
    liked = true;
  }
  const c = await db.prepare("SELECT n FROM like_counts WHERE kind=? AND key=?").bind(kind, key).first();
  return { liked, votes: c?.n || 0, key };
}

let ready = false;
async function setup(db) {
  if (ready) return;
  await db.batch([
    // 좋아요: 같은 글(kind+key)은 기기당 하루 1번, 누적 집계. kind = mbti | pair | situation
    db.prepare(`CREATE TABLE IF NOT EXISTS likes (
      kind TEXT NOT NULL, key TEXT NOT NULL, voter TEXT NOT NULL, day TEXT NOT NULL,
      ip TEXT, created_at INTEGER, PRIMARY KEY(kind, key, voter, day))`),
    db.prepare(`CREATE INDEX IF NOT EXISTS likes_ip ON likes(kind, ip, day)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS likes_item_ip ON likes(kind, key, ip, day)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS likes_voter ON likes(voter)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS likes_day ON likes(day)`),
    // 방문 기록: 하루에 기기당 1줄 (방문자 수) + 하루 열람 수
    db.prepare(`CREATE TABLE IF NOT EXISTS visits (day TEXT NOT NULL, voter TEXT NOT NULL, PRIMARY KEY(day, voter))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS daily_views (day TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)`),
    // 하트 수 집계 (순위 볼 때마다 전체를 세지 않도록 → 무료 한도 아끼기)
    db.prepare(`CREATE TABLE IF NOT EXISTS like_counts (
      kind TEXT NOT NULL, key TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, first_at INTEGER, PRIMARY KEY(kind, key))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS mbti_status (
      type TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'open', episode INTEGER, link TEXT)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, author TEXT,
      approved INTEGER NOT NULL DEFAULT 0, stage TEXT NOT NULL DEFAULT '접수',
      link TEXT, hearts INTEGER NOT NULL DEFAULT 0, ip TEXT, voter TEXT, created_at INTEGER)`),
    // 아이디어 하트도 같은 글은 하루 1번
    db.prepare(`CREATE TABLE IF NOT EXISTS idea_likes (
      idea_id INTEGER NOT NULL, voter TEXT NOT NULL, day TEXT NOT NULL, ip TEXT, PRIMARY KEY(idea_id, voter, day))`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idea_likes_ip ON idea_likes(idea_id, ip, day)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS combo_status (
      kind TEXT NOT NULL, key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', link TEXT,
      author TEXT, PRIMARY KEY(kind, key))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS situations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER,
      by_user INTEGER NOT NULL DEFAULT 0, ip TEXT)`),
    // 차단 목록: voter(기기, 영구) / ip(7일)
    db.prepare(`CREATE TABLE IF NOT EXISTS blocks (
      kind TEXT NOT NULL, value TEXT NOT NULL, until INTEGER, note TEXT, created_at INTEGER, PRIMARY KEY(kind, value))`),
    // 관리자 비밀번호 틀림 기록 (IP별)
    db.prepare(`CREATE TABLE IF NOT EXISTS admin_fails (ip TEXT NOT NULL, ts INTEGER NOT NULL)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS admin_fails_ip ON admin_fails(ip, ts)`),
    // 장면 제보: 운영자만 보는 비공개 글
    db.prepare(`CREATE TABLE IF NOT EXISTS scenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, text TEXT NOT NULL, author TEXT,
      checked INTEGER NOT NULL DEFAULT 0, ip TEXT, voter TEXT, created_at INTEGER)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS scenes_ip ON scenes(ip, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS situations_text ON situations(text)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS situations_ip ON situations(ip, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS ideas_text ON ideas(text)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS ideas_ip ON ideas(ip, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS ideas_list ON ideas(approved, hearts)`),
  ]);
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS poll_votes (
      poll TEXT NOT NULL, voter TEXT NOT NULL, choice TEXT NOT NULL, my_type TEXT, ip TEXT,
      created_at INTEGER, updated_at INTEGER, PRIMARY KEY (poll, voter))`),
    db.prepare(`CREATE INDEX IF NOT EXISTS poll_ip ON poll_votes(poll, ip)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`),
  ]);
  await db.batch([
    // 주민 등록: 기기당 MBTI 하나 (바꿀 수 있음)
    db.prepare(`CREATE TABLE IF NOT EXISTS residents (
      voter TEXT PRIMARY KEY, type TEXT NOT NULL, ip TEXT, created_at INTEGER, updated_at INTEGER)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS residents_type ON residents(type)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS residents_ip ON residents(ip)`),
    // 유형별 게시판: type = 받는 유형, writer_type = 쓴 사람 유형
    db.prepare(`CREATE TABLE IF NOT EXISTS board_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, cat TEXT NOT NULL, text TEXT NOT NULL,
      writer_type TEXT, hearts INTEGER NOT NULL DEFAULT 0, reports INTEGER NOT NULL DEFAULT 0,
      hidden INTEGER NOT NULL DEFAULT 0, ip TEXT, voter TEXT, created_at INTEGER)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS board_list ON board_posts(type, cat, hidden, hearts)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS board_ip ON board_posts(ip, created_at)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS board_likes (post_id INTEGER NOT NULL, voter TEXT NOT NULL, ip TEXT, PRIMARY KEY(post_id, voter))`),
    db.prepare(`CREATE INDEX IF NOT EXISTS board_likes_voter ON board_likes(voter)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS users (uid TEXT PRIMARY KEY, nickname TEXT, created_at INTEGER, updated_at INTEGER)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS board_reports (post_id INTEGER NOT NULL, voter TEXT NOT NULL, ip TEXT, created_at INTEGER, PRIMARY KEY(post_id, voter))`),
    // 질문 글의 답글
    db.prepare(`CREATE TABLE IF NOT EXISTS board_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, text TEXT NOT NULL, writer_type TEXT,
      reports INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0, ip TEXT, voter TEXT, created_at INTEGER)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS board_replies_post ON board_replies(post_id, hidden, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS board_replies_ip ON board_replies(ip, created_at)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS reply_reports (reply_id INTEGER NOT NULL, voter TEXT NOT NULL, ip TEXT, created_at INTEGER, PRIMARY KEY(reply_id, voter))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, pkg TEXT NOT NULL, amount INTEGER NOT NULL, rel TEXT, a_type TEXT, b_type TEXT, name_a TEXT, name_b TEXT,
      chars TEXT, story TEXT, email TEXT, kakao TEXT, reels INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending', payment_key TEXT, method TEXT, owner TEXT, voter TEXT, ip TEXT,
      created_at INTEGER, paid_at INTEGER, due_day TEXT, link TEXT, script_link TEXT, note TEXT, cancel_reason TEXT, canceled_at INTEGER)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS orders_owner ON orders(owner, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS orders_voter ON orders(voter, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS orders_status ON orders(status, created_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS orders_ip ON orders(ip, created_at)`),
  ]);
  try { await db.prepare("ALTER TABLE orders ADD COLUMN insta TEXT").run(); } catch (e) { /* 이미 있음 */ }
  // 닉네임 중복 막기용 비교 키 (소문자·띄어쓰기 제거)
  try { await db.prepare("ALTER TABLE users ADD COLUMN nick_key TEXT").run(); } catch (e) { /* 이미 있음 */ }
  await db.batch([
    db.prepare("UPDATE users SET nick_key=lower(replace(nickname,' ','')) WHERE nick_key IS NULL AND nickname IS NOT NULL"),
    db.prepare("CREATE INDEX IF NOT EXISTS users_nick_key ON users(nick_key)"),
  ]);
  // '오늘 공개'로 바꾼 날짜 (다음 날이면 자동으로 '나옴')
  for (const t of ["mbti_status", "combo_status"]) {
    try { await db.prepare(`ALTER TABLE ${t} ADD COLUMN status_day TEXT`).run(); } catch (e) { /* 이미 있음 */ }
  }
  ready = true;
}

// '오늘 공개'는 그날까지만 → 다음 날부터 '나옴'
let rolledDay = "";
async function rollToday(db) {
  const d = kstDay();
  if (rolledDay === d) return;
  await db.batch([
    db.prepare("UPDATE mbti_status SET status='done' WHERE status='today' AND (status_day IS NULL OR status_day < ?)").bind(d),
    db.prepare("UPDATE combo_status SET status='done' WHERE status='today' AND (status_day IS NULL OR status_day < ?)").bind(d),
  ]);
  rolledDay = d;
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
const err = (msg, status = 400) => json({ error: msg }, status);

function kstDay() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}
async function ipHash(req, salt) {
  const ip = req.headers.get("cf-connecting-ip") || "local";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + "|" + salt));
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function validVoter(v) {
  return typeof v === "string" && /^[a-zA-Z0-9-]{16,64}$/.test(v);
}
function clean(s, max) {
  return String(s ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}
// "온 세상이 INFP인데 좀비가 나타난다면?" → "좀비가 나타난다면"
function cleanSituation(t) {
  return clean(t, 40).replace(/^온\s*세상이\s*\S+?(인데|이면|라면)\s*/, "").replace(/[?？!]+$/, "").trim().slice(0, 30);
}
// 인스타 아이디: 영문·숫자·._ 만, @ 떼고 30자
function cleanInsta(s) {
  const v = String(s ?? "").trim().replace(/^@+/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(v) ? v : "";
}
// 공개용 아이디 가리기: woong.if → wo***f (길이도 안 드러나게 별은 항상 3개)
function maskInsta(v) {
  if (!v) return null;
  if (v.length <= 2) return v[0] + "*";
  if (v.length <= 4) return v.slice(0, 2) + "***";
  return v.slice(0, 2) + "***" + v.slice(-1);
}

// ---------- 로그인 세션 (서명한 쿠키) ----------
const kakaoOn = (env) => !!env.KAKAO_REST_KEY;
function getCookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return m ? m[1] : null;
}
async function hmac(env, msg) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(String(env.SESSION_SECRET || env.ADMIN_PASSWORD || "woongif") + "|session"),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function makeSession(env, uid) {
  const body = btoa(uid).replace(/=+$/, "") + "." + (Date.now() + 180 * 86400e3);
  return body + "." + (await hmac(env, body));
}
async function readSession(req, env) {
  const t = getCookie(req, "wf_s");
  if (!t) return null;
  const i = t.lastIndexOf(".");
  const body = t.slice(0, i), sig = t.slice(i + 1);
  if (!body || sig !== (await hmac(env, body))) return null;
  const [u, exp] = body.split(".");
  if (Number(exp) < Date.now()) return null;
  try { return atob(u); } catch { return null; }
}
// 주민·글쓰기 주인: 카카오 켜져 있으면 로그인 계정만, 꺼져 있으면 기기 ID
async function whoAmI(req, env, voter) {
  const s = await readSession(req, env);
  if (s) return s;
  return !kakaoOn(env) && validVoter(voter) ? voter : null;
}
const NICK_ADJ = ["눕고싶은", "산책하는", "새벽감성", "야식먹는", "계획없는", "노래하는", "고민많은", "햇살같은", "출근싫은", "멍때리는"];
function defaultNick(type, seed) {
  let h = 0; for (const ch of String(seed || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `${NICK_ADJ[h % NICK_ADJ.length]} ${type || ""} ${10 + (h % 90)}`.replace(/\s+/g, " ");
}
const nickKey = (n) => String(n || "").toLowerCase().replace(/\s+/g, "");
async function nickTaken(db, nick, uid) {
  const r = await db.prepare("SELECT 1 x FROM users WHERE nick_key=? AND uid<>? LIMIT 1").bind(nickKey(nick), uid || "").first();
  return !!r;
}
async function suggestNick(db, type) {
  for (let i = 0; i < 30; i++) {
    const n = `${NICK_ADJ[Math.floor(Math.random() * NICK_ADJ.length)]} ${type} ${10 + Math.floor(Math.random() * (i < 15 ? 90 : 990))}`;
    if (!(await nickTaken(db, n, ""))) return n;
  }
  return `${NICK_ADJ[0]} ${type} ${Date.now() % 100000}`;
}
function cleanNick(v) {
  const n = clean(v, 16);
  if (n.length < 2) return { error: "닉네임은 2자 이상으로 해 주세요" };
  const low = n.toLowerCase().replace(/\s/g, "");
  if (BAD.some((w) => low.includes(w))) return { error: "조금만 순한 닉네임으로 부탁해요 🙏" };
  if (/https?:|www\.|\.com|@/i.test(n)) return { error: "닉네임에 링크나 아이디는 넣을 수 없어요" };
  return n;
}
function isAdmin(req, env) {
  // 한글·특수문자 비밀번호도 되도록 인코딩해서 받음, 앞뒤 공백·줄바꿈은 무시
  let key = req.headers.get("x-admin-key") || "";
  try { key = decodeURIComponent(key); } catch {}
  const pw = String(env.ADMIN_PASSWORD || "").trim();
  return !!pw && key.trim() === pw;
}

export async function onRequest({ request, env, params, waitUntil }) {
  if (!env.DB) return err("D1 데이터베이스(DB) 바인딩이 없어요", 500);
  const db = env.DB;
  await setup(db);
  await rollToday(db);
  const path = (params.path || []).join("/");
  const method = request.method;
  const body = method === "POST" ? await request.json().catch(() => ({})) : {};
  const url = new URL(request.url);
  const salt = env.ADMIN_PASSWORD || "woongif";

  // 차단된 기기·인터넷은 글쓰기·하트 막기 (보기는 가능)
  if (method === "POST" && !path.startsWith("admin/") && path !== "visit" && !path.startsWith("auth/")) {
    const ip = await ipHash(request, salt);
    const b = await db.prepare(
      "SELECT 1 x FROM blocks WHERE (kind='voter' AND value=?) OR (kind='ip' AND value=? AND (until IS NULL OR until>?)) LIMIT 1"
    ).bind(String(body.voter || "-"), ip, Date.now()).first();
    if (b) return err("이용이 제한됐어요. 문의는 페이지 아래 메일로 해주세요.", 403);
  }

  // ---------- 공개 API ----------
  if (path === "mbti" && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    const [counts, status, mine] = await Promise.all([
      db.prepare("SELECT key type, n FROM like_counts WHERE kind='mbti'").all(),
      db.prepare("SELECT type, status, episode, link FROM mbti_status").all(),
      db.prepare("SELECT key type FROM likes WHERE kind='mbti' AND voter=? AND day=?").bind(voter, kstDay()).all(),
    ]);
    const c = Object.fromEntries(counts.results.map((r) => [r.type, r.n]));
    const s = Object.fromEntries(status.results.map((r) => [r.type, r]));
    return json({
      types: MBTI.map((t) => ({
        type: t, votes: c[t] || 0,
        status: s[t]?.status || "open", episode: s[t]?.episode || null, link: s[t]?.link || null,
      })),
      todayLikes: mine.results.map((r) => r.type),
    });
  }

  if (path === "mbti/like" && method === "POST") {
    const type = String(body.type || "").toUpperCase();
    if (!MBTI.includes(type)) return err("MBTI 유형이 이상해요");
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const st = await db.prepare("SELECT status FROM mbti_status WHERE type=?").bind(type).first();
    const had = await db.prepare("SELECT 1 x FROM likes WHERE kind='mbti' AND key=? AND voter=? AND day=?").bind(type, body.voter, kstDay()).first();
    if (st && st.status === "done" && !had) return err("이미 나온 유형이에요");
    const r = await toggleLike(db, "mbti", type, body.voter, await ipHash(request, salt), false);
    return r.error ? err(r.error) : json(r);
  }

  if (path === "ideas" && method === "GET") {
    const sort = url.searchParams.get("sort") === "new" ? "created_at DESC" : "hearts DESC, created_at DESC";
    const voter = url.searchParams.get("voter") || "";
    const [list, mine] = await Promise.all([
      db.prepare(`SELECT id, text, author, stage, link, hearts FROM ideas WHERE approved=1 ORDER BY ${sort} LIMIT 300`).all(),
      db.prepare("SELECT idea_id FROM idea_likes WHERE voter=? AND day=?").bind(voter, kstDay()).all(),
    ]);
    const liked = new Set(mine.results.map((r) => r.idea_id));
    return json({ ideas: list.results.map((r) => ({ ...r, author: maskInsta(r.author), liked: liked.has(r.id) })) });
  }

  if (path === "ideas" && method === "POST") {
    const text = clean(body.text, 40);
    const author = cleanInsta(body.author);
    if (text.length < 2) return err("아이디어를 적어주세요");
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const low = (text + author).toLowerCase().replace(/\s/g, "");
    if (BAD.some((w) => low.includes(w))) return err("조금만 순한 말로 부탁해요 🙏");
    if (/https?:|www\./i.test(text)) return err("링크는 넣을 수 없어요");
    const ip = await ipHash(request, salt);
    const since = Date.now() - 24 * 3600e3;
    const n = await db.prepare("SELECT COUNT(*) n FROM ideas WHERE ip=? AND created_at>?").bind(ip, since).first();
    if (n.n >= DAILY_IP_IDEAS) return err("하루에 5개까지 낼 수 있어요");
    const dup = await db.prepare("SELECT id, approved FROM ideas WHERE text=?").bind(text).first();
    if (dup) return err(dup.approved === 1 ? "이미 올라온 아이디어예요! 목록에서 하트를 눌러주세요" : "이미 접수된 아이디어예요. 확인 후 올라가요!");
    await db.prepare("INSERT INTO ideas (text, author, ip, voter, created_at) VALUES (?,?,?,?,?)")
      .bind(text, author || null, ip, body.voter, Date.now()).run();
    return json({ ok: true });
  }

  const heartMatch = path.match(/^ideas\/(\d+)\/heart$/);
  if (heartMatch && method === "POST") {
    const id = Number(heartMatch[1]);
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const idea = await db.prepare("SELECT id FROM ideas WHERE id=? AND approved=1").bind(id).first();
    if (!idea) return err("없는 아이디어예요", 404);
    const day = kstDay();
    const had = await db.prepare("SELECT 1 x FROM idea_likes WHERE idea_id=? AND voter=? AND day=?").bind(id, body.voter, day).first();
    if (had) {
      await db.batch([
        db.prepare("DELETE FROM idea_likes WHERE idea_id=? AND voter=? AND day=?").bind(id, body.voter, day),
        db.prepare("UPDATE ideas SET hearts=MAX(hearts-1,0) WHERE id=?").bind(id),
      ]);
    } else {
      const ip = await ipHash(request, salt);
      const same = await db.prepare("SELECT COUNT(*) n FROM idea_likes WHERE idea_id=? AND ip=? AND day=?").bind(id, ip, day).first();
      if (same.n >= SAME_ITEM_PER_IP) return err(SAME_ITEM_MSG);
      const ins = await db.prepare("INSERT OR IGNORE INTO idea_likes (idea_id, voter, day, ip) VALUES (?,?,?,?)").bind(id, body.voter, day, ip).run();
      if (ins.meta.changes) await db.prepare("UPDATE ideas SET hearts=hearts+1 WHERE id=?").bind(id).run();
    }
    const r = await db.prepare("SELECT hearts FROM ideas WHERE id=?").bind(id).first();
    return json({ liked: !had, hearts: r.hearts });
  }

  // ---------- 방문 기록 ----------
  if (path === "visit" && method === "POST") {
    const day = kstDay();
    const ops = [db.prepare(`INSERT INTO daily_views (day, n) VALUES (?,1) ON CONFLICT(day) DO UPDATE SET n=n+1`).bind(day)];
    if (validVoter(body.voter)) ops.push(db.prepare("INSERT OR IGNORE INTO visits (day, voter) VALUES (?,?)").bind(day, body.voter));
    await db.batch(ops);
    return json({ ok: true });
  }

  // ---------- 내가 ❤️ 누른 것 중 뽑힌 것 (제작 중 · 오늘 공개 · 나옴) ----------
  // ---------- 호감 투표 ----------
  if (path === "poll" && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    const [mine, rev] = await Promise.all([
      validVoter(voter) ? db.prepare("SELECT choice, my_type FROM poll_votes WHERE poll=? AND voter=?").bind(POLL.id, voter).first() : null,
      db.prepare("SELECT value FROM settings WHERE key=?").bind("poll_reveal:" + POLL.id).first(),
    ]);
    const out = { id: POLL.id, end: POLL.end, reveal: POLL.reveal, closed: pollClosed(), mine: mine || null, top3: null };   // 참여 인원은 공개 안 함
    if (rev && rev.value === "1") {
      out.top3 = (await db.prepare("SELECT choice type, COUNT(*) n FROM poll_votes WHERE poll=? GROUP BY choice ORDER BY n DESC LIMIT 3").bind(POLL.id).all()).results.map((r) => r.type);
    }
    return json(out);
  }
  if (path === "poll/vote" && method === "POST") {
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    if (pollClosed()) return err("투표가 끝났어요. 결과는 @woong.if에서 확인해 주세요!");
    const choice = String(body.choice || "").toUpperCase(), my = String(body.my_type || "").toUpperCase();
    if (!MBTI.includes(choice)) return err("호감 MBTI를 골라 주세요");
    if (!MBTI.includes(my)) return err("내 MBTI도 골라 주세요");
    const ip = await ipHash(request, salt);
    const had = await db.prepare("SELECT 1 x FROM poll_votes WHERE poll=? AND voter=?").bind(POLL.id, body.voter).first();
    if (!had) {
      const n = await db.prepare("SELECT COUNT(*) n FROM poll_votes WHERE poll=? AND ip=?").bind(POLL.id, ip).first();
      if (n.n >= POLL_IP_MAX) return err("이 인터넷에서 이미 많이 투표했어요");
    }
    const now = Date.now();
    await db.prepare(`INSERT INTO poll_votes (poll, voter, choice, my_type, ip, created_at, updated_at) VALUES (?,?,?,?,?,?,?)
      ON CONFLICT(poll, voter) DO UPDATE SET choice=excluded.choice, my_type=excluded.my_type, updated_at=excluded.updated_at`)
      .bind(POLL.id, body.voter, choice, my, ip, now, now).run();
    return json({ ok: true, changed: !!had, mine: { choice, my_type: my } });
  }

  if (path === "mine" && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    if (!validVoter(voter)) return json({ picked: [] });
    const [liked, ms, cs, sits] = await Promise.all([
      db.prepare("SELECT DISTINCT kind, key FROM likes WHERE voter=? LIMIT 500").bind(voter).all(),
      db.prepare("SELECT type, status, episode, link FROM mbti_status WHERE status IN ('making','today','done')").all(),
      db.prepare("SELECT kind, key, status, link FROM combo_status WHERE status IN ('making','today','done')").all(),
      db.prepare("SELECT id, text FROM situations").all(),
    ]);
    const st = new Map();
    for (const r of ms.results) st.set("mbti|" + r.type, r);
    for (const r of cs.results) st.set(r.kind + "|" + r.key, r);
    const sitText = Object.fromEntries(sits.results.map((x) => [x.id, x.text]));
    const picked = [];
    for (const l of liked.results) {
      const r = st.get(l.kind + "|" + l.key);
      if (!r) continue;
      const p = l.key.split("|");
      const item = { kind: l.kind, key: l.key, status: r.status, link: r.link || null };
      if (l.kind === "mbti") item.type = l.key;
      else if (l.kind === "pair") Object.assign(item, { a: p[0], b: p[1], rel: p[2] });
      else Object.assign(item, { type: p[0], text: sitText[p[1]] || "" });
      picked.push(item);
    }
    return json({ picked });
  }

  // ---------- 장면 제보 (비공개) ----------
  if (path === "scenes" && method === "POST") {
    const type = String(body.type || "").toUpperCase();
    if (!MBTI.includes(type)) return err("MBTI를 골라주세요");
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const text = clean(body.text, 80);
    if (text.length < 4) return err("어떤 장면인지 조금 더 적어주세요");
    if (/https?:|www\./i.test(text)) return err("링크는 넣을 수 없어요");
    const ip = await ipHash(request, salt);
    const n = await db.prepare("SELECT COUNT(*) n FROM scenes WHERE ip=? AND created_at>?").bind(ip, Date.now() - 24 * 3600e3).first();
    if (n.n >= DAILY_IP_SCENES) return err("장면 제보는 하루에 10개까지예요. 고마워요!");
    await db.prepare("INSERT INTO scenes (type, text, author, ip, voter, created_at) VALUES (?,?,?,?,?,?)")
      .bind(type, text, cleanInsta(body.author) || null, ip, body.voter, Date.now()).run();
    return json({ ok: true });
  }

  // ---------- 궁합편 · 상황편 ----------
  if ((path === "pair" || path === "situation") && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    const all = url.searchParams.get("all") === "1" && isAdmin(request, env);
    return json(await comboBoard(db, path, voter, all));
  }

  if ((path === "pair/like" || path === "situation/like") && method === "POST") {
    const kind = path.split("/")[0];
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    let key;
    if (kind === "pair") {
      const a = String(body.a || "").toUpperCase(), b = String(body.b || "").toUpperCase();
      if (!MBTI.includes(a) || !MBTI.includes(b)) return err("MBTI 두 개를 골라주세요");
      const rel = clean(body.rel, 12).replace(/\|/g, "");
      if (!RELS.includes(rel)) {
        if (rel.length < 2) return err("관계를 골라주거나 적어주세요");
        const low = rel.toLowerCase().replace(/\s/g, "");
        if (BAD.some((w) => low.includes(w))) return err("조금만 순한 말로 부탁해요 🙏");
        if (/https?:|www\.|\.com/i.test(rel)) return err("링크는 넣을 수 없어요");
      }
      key = pairKey(a, b, rel);
    } else {
      const t = String(body.type || "").toUpperCase();
      if (!MBTI.includes(t)) return err("MBTI를 골라주세요");
      let sid;
      if (typeof body.text === "string") {
        // 직접 입력한 상황: 같은 문장이 있으면 그걸 쓰고, 없으면 새로 만듦
        const text = cleanSituation(body.text);
        if (text.length < 2) return err("상황을 적어주세요");
        const low = text.toLowerCase().replace(/\s/g, "");
        if (BAD.some((w) => low.includes(w))) return err("조금만 순한 말로 부탁해요 🙏");
        if (/https?:|www\.|\.com/i.test(text)) return err("링크는 넣을 수 없어요");
        const found = await db.prepare("SELECT id, active FROM situations WHERE text=?").bind(text).first();
        if (found && !found.active) return err("신청할 수 없는 상황이에요");
        if (found) sid = found.id;
        else {
          const ip = await ipHash(request, salt);
          const n = await db.prepare("SELECT COUNT(*) n FROM situations WHERE ip=? AND created_at>?").bind(ip, Date.now() - 24 * 3600e3).first();
          if (n.n >= DAILY_IP_SITUATIONS) return err("새 상황은 하루에 10개까지 만들 수 있어요");
          const r = await db.prepare("INSERT INTO situations (text, created_at, by_user, ip) VALUES (?,?,1,?)").bind(text, Date.now(), ip).run();
          sid = r.meta.last_row_id;
        }
      } else {
        const s = await db.prepare("SELECT id FROM situations WHERE id=? AND active=1").bind(Number(body.sid)).first();
        if (!s) return err("상황을 골라주세요");
        sid = s.id;
      }
      key = `${t}|${sid}`;
    }
    const st = await db.prepare("SELECT status FROM combo_status WHERE kind=? AND key=?").bind(kind, key).first();
    if (st && st.status === "hidden") return err("신청할 수 없는 조합이에요");
    const had = await db.prepare("SELECT 1 x FROM likes WHERE kind=? AND key=? AND voter=? AND day=?").bind(kind, key, body.voter, kstDay()).first();
    if (st && st.status === "done" && !had) return err("이미 나온 편이에요!");
    // 새로 신청(onlyNew)인데 이미 올라온 조합이면 좋아요 없이 알려만 줌
    if (body.onlyNew) {
      const exists = await db.prepare("SELECT 1 x FROM like_counts WHERE kind=? AND key=?").bind(kind, key).first()
        || await db.prepare("SELECT 1 x FROM combo_status WHERE kind=? AND key=?").bind(kind, key).first();
      if (exists) return json({ exists: true, key });
    }
    const r = await toggleLike(db, kind, key, body.voter, await ipHash(request, salt), !!body.onlyOn || !!body.onlyNew);
    if (r.error) return err(r.error);
    // 처음 신청한 사람의 인스타 아이디만 남김 (선택)
    const author = cleanInsta(body.author);
    if ((body.onlyOn || body.onlyNew) && author && !BAD.some((w) => author.toLowerCase().includes(w))) {
      await db.prepare(`INSERT INTO combo_status (kind, key, author) VALUES (?,?,?)
        ON CONFLICT(kind, key) DO UPDATE SET author=COALESCE(combo_status.author, excluded.author)`).bind(kind, key, author).run();
    }
    return json(r);
  }

  // ---------- 로그인 (카카오) ----------
  // KAKAO_REST_KEY가 없으면 기기 기준으로 주민 등록·글쓰기 가능 (로그인 버튼은 숨김)
  if (path === "auth/kakao" && method === "GET") {
    if (!kakaoOn(env)) return err("카카오 로그인이 아직 준비 중이에요", 503);
    const v = url.searchParams.get("voter") || "";
    const state = crypto.randomUUID() + "." + (validVoter(v) ? v : "");
    const q = new URLSearchParams({ client_id: env.KAKAO_REST_KEY, redirect_uri: url.origin + "/api/auth/kakao/callback", response_type: "code", state });
    return new Response(null, { status: 302, headers: {
      location: "https://kauth.kakao.com/oauth/authorize?" + q,
      "set-cookie": `wf_st=${encodeURIComponent(state)}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    } });
  }
  if (path === "auth/kakao/callback" && method === "GET") {
    const back = (msg) => new Response(null, { status: 302, headers: { location: "/#town" + (msg ? "?login=" + encodeURIComponent(msg) : ""), "set-cookie": "wf_st=; Path=/; Max-Age=0" } });
    const code = url.searchParams.get("code"), state = url.searchParams.get("state") || "";
    if (!code || !kakaoOn(env)) return back("fail");
    if (state !== decodeURIComponent(getCookie(request, "wf_st") || "")) return back("fail");
    try {
      const tk = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST", headers: { "content-type": "application/x-www-form-urlencoded;charset=utf-8" },
        body: new URLSearchParams({ grant_type: "authorization_code", client_id: env.KAKAO_REST_KEY, redirect_uri: url.origin + "/api/auth/kakao/callback", code, ...(env.KAKAO_CLIENT_SECRET ? { client_secret: env.KAKAO_CLIENT_SECRET } : {}) }),
      }).then((r) => r.json());
      if (!tk.access_token) return back("fail");
      const me = await fetch("https://kapi.kakao.com/v2/user/me", { headers: { authorization: "Bearer " + tk.access_token } }).then((r) => r.json());
      if (!me.id) return back("fail");
      const uid = "k:" + me.id, now = Date.now();
      await db.prepare("INSERT OR IGNORE INTO users (uid, nickname, created_at, updated_at) VALUES (?,?,?,?)").bind(uid, null, now, now).run();
      // 로그인 전에 이 기기로 등록·작성한 게 있으면 계정으로 옮김
      const dev = state.split(".")[1] || "";
      if (validVoter(dev)) {
        const has = await db.prepare("SELECT 1 x FROM residents WHERE voter=?").bind(uid).first();
        if (!has) {
          await db.batch([
            db.prepare("UPDATE residents SET voter=? WHERE voter=?").bind(uid, dev),
            db.prepare("UPDATE board_posts SET voter=? WHERE voter=?").bind(uid, dev),
            db.prepare("UPDATE users SET nickname=COALESCE(users.nickname,(SELECT nickname FROM users WHERE uid=?)), nick_key=COALESCE(users.nick_key,(SELECT nick_key FROM users WHERE uid=?)) WHERE uid=?").bind(dev, dev, uid),
            db.prepare("UPDATE users SET nickname=NULL, nick_key=NULL WHERE uid=?").bind(dev),
          ]);
        }
      }
      const tok = await makeSession(env, uid);
      return new Response(null, { status: 302, headers: [
        ["location", "/#town"],
        ["set-cookie", `wf_s=${tok}; Path=/; Max-Age=${180 * 86400}; HttpOnly; Secure; SameSite=Lax`],
        ["set-cookie", "wf_st=; Path=/; Max-Age=0"],
      ] });
    } catch (e) { return back("fail"); }
  }
  if (path === "auth/logout" && method === "POST") {
    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": "wf_s=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax" } });
  }

  // ---------- 주민 현황 (내 MBTI 등록 + 하루 한 번 응원) ----------
  if (path === "town" && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    const session = await readSession(request, env);
    const uid = session || (!kakaoOn(env) && validVoter(voter) ? voter : null);
    const [res, cheers, me, mine] = await Promise.all([
      db.prepare("SELECT type, COUNT(*) n FROM residents GROUP BY type").all(),
      db.prepare("SELECT key type, n FROM like_counts WHERE kind='cheer'").all(),
      uid ? db.prepare("SELECT r.type, r.created_at, u.nickname FROM residents r LEFT JOIN users u ON u.uid=r.voter WHERE r.voter=?").bind(uid).first() : null,
      validVoter(voter) ? db.prepare("SELECT key FROM likes WHERE kind='cheer' AND voter=? AND day=? LIMIT 1").bind(voter, kstDay()).first() : null,
    ]);
    const r = Object.fromEntries(res.results.map((x) => [x.type, x.n]));
    const c = Object.fromEntries(cheers.results.map((x) => [x.type, x.n]));
    return json({
      types: MBTI.map((t) => ({ type: t, residents: r[t] || 0, cheers: c[t] || 0 })),
      me: me ? { type: me.type, nick: me.nickname || defaultNick(me.type, uid), since: me.created_at } : null,
      loggedIn: !!session, kakao: kakaoOn(env),
      cheeredToday: mine ? mine.key : null,
    });
  }

  if (path === "town/join" && method === "POST") {
    const type = String(body.type || "").toUpperCase();
    if (!MBTI.includes(type)) return err("MBTI를 골라 주세요");
    const uid = await whoAmI(request, env, body.voter);
    if (!uid) return err(kakaoOn(env) ? "먼저 로그인해 주세요" : "다시 시도해 주세요", 401);
    let nick = null;
    if (body.nick !== undefined) {
      nick = cleanNick(body.nick); if (typeof nick === "object") return err(nick.error);
      if (await nickTaken(db, nick, uid)) return err("이미 있는 닉네임이에요. 다른 이름으로 해 주세요", 409);
    }
    const ip = await ipHash(request, salt);
    const had = await db.prepare("SELECT type FROM residents WHERE voter=?").bind(uid).first();
    if (!had) {
      const n = await db.prepare("SELECT COUNT(*) n FROM residents WHERE ip=?").bind(ip).first();
      if (n.n >= TOWN_IP_MAX) return err("이 인터넷에서 이미 많이 등록했어요");
    }
    const now = Date.now();
    const ops = [db.prepare(`INSERT INTO residents (voter, type, ip, created_at, updated_at) VALUES (?,?,?,?,?)
      ON CONFLICT(voter) DO UPDATE SET type=excluded.type, updated_at=excluded.updated_at`).bind(uid, type, ip, now, now)];
    if (nick) ops.push(db.prepare(`INSERT INTO users (uid, nickname, nick_key, created_at, updated_at) VALUES (?,?,?,?,?)
      ON CONFLICT(uid) DO UPDATE SET nickname=excluded.nickname, nick_key=excluded.nick_key, updated_at=excluded.updated_at`).bind(uid, nick, nickKey(nick), now, now));
    await db.batch(ops);
    return json({ ok: true, me: type, changed: !!had && had.type !== type });
  }

  if (path === "town/nick" && method === "POST") {
    const uid = await whoAmI(request, env, body.voter);
    if (!uid) return err("먼저 로그인해 주세요", 401);
    const nick = cleanNick(body.nick);
    if (typeof nick === "object") return err(nick.error);
    if (await nickTaken(db, nick, uid)) return err("이미 있는 닉네임이에요. 다른 이름으로 해 주세요", 409);
    const now = Date.now();
    await db.prepare(`INSERT INTO users (uid, nickname, nick_key, created_at, updated_at) VALUES (?,?,?,?,?)
      ON CONFLICT(uid) DO UPDATE SET nickname=excluded.nickname, nick_key=excluded.nick_key, updated_at=excluded.updated_at`).bind(uid, nick, nickKey(nick), now, now).run();
    return json({ ok: true, nick });
  }
  // 안 겹치는 닉네임 추천 / 사용 가능 확인
  if (path === "town/nick/suggest" && method === "GET") {
    const type = String(url.searchParams.get("type") || "").toUpperCase();
    return json({ nick: await suggestNick(db, MBTI.includes(type) ? type : "") });
  }
  if (path === "town/nick/check" && method === "GET") {
    const nick = cleanNick(url.searchParams.get("nick"));
    if (typeof nick === "object") return json({ ok: false, error: nick.error });
    const uid = await whoAmI(request, env, url.searchParams.get("voter") || "");
    return json({ ok: !(await nickTaken(db, nick, uid)), error: "이미 있는 닉네임이에요" });
  }

  // 응원 = 하트라서 로그인 없이 기기 기준 (단, 내 유형은 등록돼 있어야 함)
  if (path === "town/cheer" && method === "POST") {
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const uid = await whoAmI(request, env, body.voter);
    const me = uid ? await db.prepare("SELECT type FROM residents WHERE voter=?").bind(uid).first() : null;
    if (!me) return err("먼저 내 MBTI를 등록해 주세요");
    const today = await db.prepare("SELECT key FROM likes WHERE kind='cheer' AND voter=? AND day=? LIMIT 1").bind(body.voter, kstDay()).first();
    if (today && today.key !== me.type) return err("응원은 하루에 한 번이에요. 내일 또 와 주세요!");
    const r = await toggleLike(db, "cheer", me.type, body.voter, await ipHash(request, salt), false);
    return r.error ? err(r.error) : json(r);
  }

  // ---------- 유형별 한마디 게시판 ----------
  const postRow = (p, uid, liked) => ({ id: p.id, to: p.type, cat: catOf(p.cat), text: p.text, writer: p.writer_type, nick: p.nickname || defaultNick(p.writer_type, p.voter),
    hearts: p.hearts, replies: p.replies || 0, at: p.created_at, liked: !!liked, mine: !!uid && p.voter === uid });
  const REPLY_CNT = "(SELECT COUNT(*) FROM board_replies r WHERE r.post_id=p.id AND r.hidden=0) replies";
  if (path === "board" && method === "GET") {
    const type = String(url.searchParams.get("type") || "").toUpperCase();
    if (!MBTI.includes(type)) return err("MBTI 유형이 이상해요");
    const cat = catOf(url.searchParams.get("cat"));
    const sort = url.searchParams.get("sort") === "new" ? "p.created_at DESC" : "p.hearts DESC, p.created_at DESC";
    const voter = url.searchParams.get("voter") || "";
    const uid = await whoAmI(request, env, voter);
    const [list, counts, cats] = await Promise.all([
      db.prepare(`SELECT p.id, p.type, p.cat, p.text, p.writer_type, p.hearts, p.voter, p.created_at, u.nickname, ${REPLY_CNT} FROM board_posts p LEFT JOIN users u ON u.uid=p.voter
        WHERE p.type=? AND ${CAT_SQL(cat)} AND p.hidden=0 ORDER BY ${sort} LIMIT 200`).bind(type).all(),
      db.prepare(`SELECT p.type, COUNT(*) n FROM board_posts p WHERE p.hidden=0 AND ${CAT_SQL(cat)} GROUP BY p.type`).all(),
      db.prepare("SELECT cat, COUNT(*) n FROM board_posts WHERE hidden=0 AND type=? GROUP BY cat").bind(type).all(),
    ]);
    const catCounts = { msg: 0, ask: 0, trait: 0 };
    for (const r of cats.results) catCounts[catOf(r.cat)] += r.n;
    let liked = new Set();
    if (validVoter(voter) && list.results.length) {
      const ids = list.results.map((p) => p.id);
      const q = await db.prepare(`SELECT post_id FROM board_likes WHERE voter=? AND post_id IN (${ids.map(() => "?").join(",")})`).bind(voter, ...ids).all();
      liked = new Set(q.results.map((x) => x.post_id));
    }
    return json({ type, cat, catCounts, counts: Object.fromEntries(counts.results.map((x) => [x.type, x.n])), posts: list.results.map((p) => postRow(p, uid, liked.has(p.id))) });
  }
  if (path === "board/recent" && method === "GET") {
    const r = await db.prepare(`SELECT p.id, p.type, p.cat, p.text, p.writer_type, p.hearts, p.voter, p.created_at, u.nickname, ${REPLY_CNT} FROM board_posts p LEFT JOIN users u ON u.uid=p.voter
      WHERE p.hidden=0 ORDER BY p.created_at DESC LIMIT 3`).all();
    return json({ posts: r.results.map((p) => postRow(p, null, false)) });
  }

  if (path === "board" && method === "POST") {
    const type = String(body.type || "").toUpperCase();
    if (!MBTI.includes(type)) return err("어떤 유형에게 쓸지 골라 주세요");
    const uid = await whoAmI(request, env, body.voter);
    if (!uid) return err(kakaoOn(env) ? "먼저 로그인해 주세요" : "다시 시도해 주세요", 401);
    const me = await db.prepare("SELECT type FROM residents WHERE voter=?").bind(uid).first();
    if (!me) return err("먼저 내 MBTI를 등록해 주세요");
    const text = clean(body.text, POST_MAX);
    if (text.length < 4) return err("조금 더 적어 주세요");
    const low = text.toLowerCase().replace(/\s/g, "");
    if (BAD.some((w) => low.includes(w))) return err("조금만 순한 말로 부탁해요 🙏");
    if (/https?:|www\.|\.com|\.kr/i.test(text)) return err("링크는 넣을 수 없어요");
    const ip = await ipHash(request, salt);
    const n = await db.prepare("SELECT COUNT(*) n FROM board_posts WHERE ip=? AND created_at>?").bind(ip, Date.now() - 24 * 3600e3).first();
    if (n.n >= DAILY_IP_POSTS) return err("글은 하루에 10개까지 쓸 수 있어요");
    const dup = await db.prepare("SELECT 1 x FROM board_posts WHERE type=? AND text=?").bind(type, text).first();
    if (dup) return err("똑같은 글이 이미 있어요! 그 글에 공감을 눌러 주세요");
    const r = await db.prepare("INSERT INTO board_posts (type, cat, text, writer_type, ip, voter, created_at) VALUES (?,?,?,?,?,?,?)")
      .bind(type, catOf(body.cat), text, me.type, ip, uid, Date.now()).run();
    return json({ ok: true, id: r.meta.last_row_id });
  }

  // ---------- 질문 답글 ----------
  const replyMatch = path.match(/^board\/(\d+)\/replies$/);
  if (replyMatch && method === "GET") {
    const id = Number(replyMatch[1]);
    const voter = url.searchParams.get("voter") || "";
    const uid = await whoAmI(request, env, voter);
    const r = await db.prepare(`SELECT r.id, r.text, r.writer_type, r.voter, r.created_at, u.nickname FROM board_replies r LEFT JOIN users u ON u.uid=r.voter
      WHERE r.post_id=? AND r.hidden=0 ORDER BY r.created_at ASC LIMIT 300`).bind(id).all();
    return json({ replies: r.results.map((x) => ({ id: x.id, text: x.text, writer: x.writer_type, nick: x.nickname || defaultNick(x.writer_type, x.voter), at: x.created_at, mine: !!uid && x.voter === uid })) });
  }
  if (replyMatch && method === "POST") {
    const id = Number(replyMatch[1]);
    const post = await db.prepare("SELECT id, cat FROM board_posts WHERE id=? AND hidden=0").bind(id).first();
    if (!post) return err("없는 글이에요", 404);
    if (catOf(post.cat) !== "ask") return err("답글은 질문에만 달 수 있어요");
    const uid = await whoAmI(request, env, body.voter);
    if (!uid) return err(kakaoOn(env) ? "먼저 로그인해 주세요" : "다시 시도해 주세요", 401);
    const me = await db.prepare("SELECT type FROM residents WHERE voter=?").bind(uid).first();
    if (!me) return err("먼저 내 MBTI를 등록해 주세요");
    const text = clean(body.text, POST_MAX);
    if (text.length < 2) return err("답글을 적어 주세요");
    const low = text.toLowerCase().replace(/\s/g, "");
    if (BAD.some((w) => low.includes(w))) return err("조금만 순한 말로 부탁해요 🙏");
    if (/https?:|www\.|\.com|\.kr/i.test(text)) return err("링크는 넣을 수 없어요");
    const ip = await ipHash(request, salt);
    const n = await db.prepare("SELECT COUNT(*) n FROM board_replies WHERE ip=? AND created_at>?").bind(ip, Date.now() - 24 * 3600e3).first();
    if (n.n >= DAILY_IP_REPLIES) return err("답글은 하루에 30개까지 달 수 있어요");
    const r = await db.prepare("INSERT INTO board_replies (post_id, text, writer_type, ip, voter, created_at) VALUES (?,?,?,?,?,?)")
      .bind(id, text, me.type, ip, uid, Date.now()).run();
    return json({ ok: true, id: r.meta.last_row_id });
  }
  const replyAct = path.match(/^board\/reply\/(\d+)\/(delete|report)$/);
  if (replyAct && method === "POST") {
    const rid = Number(replyAct[1]), act = replyAct[2];
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const rp = await db.prepare("SELECT id, voter FROM board_replies WHERE id=? AND hidden=0").bind(rid).first();
    if (!rp) return err("없는 답글이에요", 404);
    if (act === "delete") {
      const uid = await whoAmI(request, env, body.voter);
      if (!uid || rp.voter !== uid) return err("내가 쓴 답글만 지울 수 있어요", 403);
      await db.batch([db.prepare("DELETE FROM reply_reports WHERE reply_id=?").bind(rid), db.prepare("DELETE FROM board_replies WHERE id=?").bind(rid)]);
      return json({ ok: true });
    }
    const ip = await ipHash(request, salt);
    const ins = await db.prepare("INSERT OR IGNORE INTO reply_reports (reply_id, voter, ip, created_at) VALUES (?,?,?,?)").bind(rid, body.voter, ip, Date.now()).run();
    if (ins.meta.changes) {
      const c = await db.prepare("SELECT COUNT(DISTINCT ip) n FROM reply_reports WHERE reply_id=?").bind(rid).first();
      await db.prepare("UPDATE board_replies SET reports=?, hidden=CASE WHEN ?>=? THEN 1 ELSE hidden END WHERE id=?").bind(c.n, c.n, REPORT_HIDE, rid).run();
    }
    return json({ ok: true });
  }

  const postMatch = path.match(/^board\/(\d+)\/(heart|report|delete)$/);
  if (postMatch && method === "POST") {
    const id = Number(postMatch[1]), act = postMatch[2];
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const post = await db.prepare("SELECT id, voter FROM board_posts WHERE id=? AND hidden=0").bind(id).first();
    if (!post) return err("없는 글이에요", 404);
    if (act === "delete") {
      const uid = await whoAmI(request, env, body.voter);
      if (!uid || post.voter !== uid) return err("내가 쓴 글만 지울 수 있어요", 403);
      await db.batch([
        db.prepare("DELETE FROM board_likes WHERE post_id=?").bind(id),
        db.prepare("DELETE FROM board_reports WHERE post_id=?").bind(id),
        db.prepare("DELETE FROM board_replies WHERE post_id=?").bind(id),
        db.prepare("DELETE FROM board_posts WHERE id=?").bind(id),
      ]);
      return json({ ok: true });
    }
    const ip = await ipHash(request, salt);
    if (act === "heart") {
      const had = await db.prepare("SELECT 1 x FROM board_likes WHERE post_id=? AND voter=?").bind(id, body.voter).first();
      if (had) {
        await db.batch([
          db.prepare("DELETE FROM board_likes WHERE post_id=? AND voter=?").bind(id, body.voter),
          db.prepare("UPDATE board_posts SET hearts=MAX(hearts-1,0) WHERE id=?").bind(id),
        ]);
      } else {
        const same = await db.prepare("SELECT COUNT(*) n FROM board_likes WHERE post_id=? AND ip=?").bind(id, ip).first();
        if (same.n >= SAME_ITEM_PER_IP) return err("이 글은 이 인터넷에서 이미 여러 번 공감했어요");
        const ins = await db.prepare("INSERT OR IGNORE INTO board_likes (post_id, voter, ip) VALUES (?,?,?)").bind(id, body.voter, ip).run();
        if (ins.meta.changes) await db.prepare("UPDATE board_posts SET hearts=hearts+1 WHERE id=?").bind(id).run();
      }
      const r = await db.prepare("SELECT hearts FROM board_posts WHERE id=?").bind(id).first();
      return json({ liked: !had, hearts: r.hearts });
    }
    // 신고: 기기당 1번, 서로 다른 인터넷 기준으로 쌓여서 3번이면 숨김
    const ins = await db.prepare("INSERT OR IGNORE INTO board_reports (post_id, voter, ip, created_at) VALUES (?,?,?,?)").bind(id, body.voter, ip, Date.now()).run();
    if (ins.meta.changes) {
      const c = await db.prepare("SELECT COUNT(DISTINCT ip) n FROM board_reports WHERE post_id=?").bind(id).first();
      await db.prepare("UPDATE board_posts SET reports=?, hidden=CASE WHEN ?>=? THEN 1 ELSE hidden END WHERE id=?").bind(c.n, c.n, REPORT_HIDE, id).run();
    }
    return json({ ok: true });
  }

  // ---------- 맞춤 궁합 영상 주문 ----------
  if (path === "order/config" && method === "GET") {
    const products = Object.fromEntries(Object.entries(PRODUCTS).map(([k, p]) => [k, { name: p.name, price: p.price, sale: p.sale, pay: priceOf(k) }]));
    const ck = tossKeys(env).ck;
    return json({ products, clientKey: ck, test: ck.startsWith("test_"), days: DELIVERY_DAYS });
  }
  if (path === "order/create" && method === "POST") {
    const pkg = PRODUCTS[body.pkg] ? body.pkg : null;
    if (!pkg) return err("상품을 골라 주세요");
    if (!ORDER_RELS.includes(body.rel)) return err("관계를 골라 주세요");
    if (!MBTI.includes(body.a) || !MBTI.includes(body.b)) return err("두 사람 MBTI를 골라 주세요");
    const nameA = clean(body.nameA, 8), nameB = clean(body.nameB, 8);
    if (!nameA || !nameB) return err("두 사람을 부를 이름을 적어 주세요");
    const email = clean(body.email, 80);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err("이메일을 확인해 주세요");
    const insta = cleanInsta(body.insta);
    if (!insta) return err("인스타그램 아이디를 확인해 주세요");
    if (!body.terms) return err("이용약관·환불정책에 동의해 주세요");
    const story = pkg === "special" ? String(body.story ?? "").replace(/[\u0000-\u0008\u000b-\u001f<>]/g, "").trim().slice(0, 500) : "";
    if (pkg === "special" && story.length < 10) return err("사연을 10자 이상 적어 주세요");
    const chars = { a: cleanChar(body.chars?.a), b: cleanChar(body.chars?.b) };
    if (pkg !== "special") { chars.a.feat = ""; chars.b.feat = ""; }
    const ip = await ipHash(request, salt);
    const n = await db.prepare("SELECT COUNT(*) n FROM orders WHERE ip=? AND created_at>?").bind(ip, Date.now() - 86400e3).first();
    if (n.n >= DAILY_IP_ORDERS) return err("오늘은 주문서를 너무 많이 만들었어요. 내일 다시 해 주세요", 429);
    const voter = validVoter(body.voter) ? body.voter : null;
    const owner = (await readSession(request, env)) || voter;
    const id = newOrderId(), amount = priceOf(pkg);
    await db.prepare(`INSERT INTO orders (id, pkg, amount, rel, a_type, b_type, name_a, name_b, chars, story, email, kakao, insta, reels, status, owner, voter, ip, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0,'pending',?,?,?,?)`)
      .bind(id, pkg, amount, body.rel, body.a, body.b, nameA, nameB, JSON.stringify(chars), story, email, clean(body.kakao, 30), insta, owner, voter, ip, Date.now()).run();
    return json({ orderId: id, amount, orderName: `${body.a}×${body.b} 궁합 영상 (${PRODUCTS[pkg].name.split(" · ")[0]})`, email });
  }
  if (path === "order/confirm" && method === "POST") {
    const o = await db.prepare("SELECT * FROM orders WHERE id=?").bind(String(body.orderId || "")).first();
    if (!o) return err("주문을 찾을 수 없어요", 404);
    if (o.status !== "pending") {
      if (o.payment_key && o.payment_key === body.paymentKey) return json({ order: orderRow(o) });   // 새로고침 등으로 다시 온 경우
      return err("이미 처리된 주문이에요", 409);
    }
    if (Number(body.amount) !== o.amount) return err("결제 금액이 주문과 달라요. 다시 주문해 주세요", 400);
    const r = await toss(env, "payments/confirm", { paymentKey: String(body.paymentKey || ""), orderId: o.id, amount: o.amount }, "confirm-" + o.id);
    if (!r.ok) return err(r.data.message || "결제 승인에 실패했어요", 400);
    const now = Date.now(), due = kstDayPlus(now, DELIVERY_DAYS);
    const method2 = r.data.easyPay?.provider ? `${r.data.method} · ${r.data.easyPay.provider}` : r.data.method || "";
    await db.prepare("UPDATE orders SET status='paid', payment_key=?, method=?, paid_at=?, due_day=? WHERE id=? AND status='pending'")
      .bind(r.data.paymentKey, method2, now, due, o.id).run();
    const mail = notifyOrder(env, { ...o, due_day: due }, "new", url.origin);
    if (waitUntil) waitUntil(mail); else await mail;
    return json({ order: orderRow({ ...o, status: "paid", payment_key: r.data.paymentKey, method: method2, paid_at: now, due_day: due }) });
  }
  if (path === "orders/mine" && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    const uid = await readSession(request, env);
    const keys = [uid, validVoter(voter) ? voter : null].filter(Boolean);
    if (!keys.length) return json({ orders: [] });
    const q = keys.map(() => "?").join(",");
    const r = await db.prepare(`SELECT * FROM orders WHERE status<>'pending' AND (owner IN (${q}) OR voter IN (${q})) ORDER BY created_at DESC LIMIT 50`).bind(...keys, ...keys).all();
    return json({ orders: r.results.map((o) => orderRow(o)) });
  }
  if (path.startsWith("order/") && path.endsWith("/cancel") && method === "POST") {
    const id = path.slice(6, -7);
    const o = await db.prepare("SELECT * FROM orders WHERE id=?").bind(id).first();
    if (!o) return err("주문을 찾을 수 없어요", 404);
    const uid = await readSession(request, env);
    const mine = (uid && o.owner === uid) || (validVoter(body.voter) && (o.voter === body.voter || o.owner === body.voter));
    if (!mine) return err("내 주문만 취소할 수 있어요", 403);
    if (o.status !== "paid") return err("제작이 시작돼서 바로 취소할 수 없어요. 메일로 문의해 주세요", 409);
    const r = await toss(env, `payments/${encodeURIComponent(o.payment_key)}/cancel`, { cancelReason: "구매자 취소 (제작 시작 전)" }, "cancel-" + o.id);
    if (!r.ok) return err(r.data.message || "취소에 실패했어요. 메일로 문의해 주세요", 400);
    await db.prepare("UPDATE orders SET status='canceled', cancel_reason=?, canceled_at=? WHERE id=?").bind("구매자 취소", Date.now(), o.id).run();
    const mail = notifyOrder(env, o, "cancel", url.origin);
    if (waitUntil) waitUntil(mail); else await mail;
    return json({ ok: true });
  }

  // ---------- 내 정보: 내가 하트 누른 것 + 내가 쓴 글 ----------
  if (path === "me" && method === "GET") {
    const voter = url.searchParams.get("voter") || "";
    const uid = await whoAmI(request, env, voter);
    const [liked, ms, cs, sits, posts, ranks] = await Promise.all([
      validVoter(voter) ? db.prepare(`SELECT kind, key, COUNT(*) n, MAX(created_at) last, MAX(day) lastday FROM likes WHERE voter=? AND kind IN ('mbti','pair','situation')
        GROUP BY kind, key ORDER BY last DESC LIMIT 60`).bind(voter).all() : { results: [] },
      db.prepare("SELECT type, status, link FROM mbti_status").all(),
      db.prepare("SELECT kind, key, status, link FROM combo_status").all(),
      db.prepare("SELECT id, text FROM situations").all(),
      uid ? db.prepare(`SELECT p.id, p.type, p.cat, p.text, p.writer_type, p.hearts, p.voter, p.created_at, ${REPLY_CNT} FROM board_posts p WHERE p.voter=? AND p.hidden=0 ORDER BY p.created_at DESC LIMIT 50`).bind(uid).all() : { results: [] },
      db.prepare("SELECT kind, key, n FROM like_counts WHERE kind IN ('mbti','pair','situation') ORDER BY n DESC").all(),
    ]);
    const st = new Map();
    for (const r of ms.results) st.set("mbti|" + r.type, r);
    for (const r of cs.results) st.set(r.kind + "|" + r.key, r);
    const sitText = Object.fromEntries(sits.results.map((x) => [x.id, x.text]));
    // 순위: 아직 안 나온 것 중에서
    const rankOf = {}; const cnt = { mbti: 0, pair: 0, situation: 0 };
    for (const r of ranks.results) {
      const s0 = st.get(r.kind + "|" + r.key)?.status || "open";
      if (s0 === "open") rankOf[r.kind + "|" + r.key] = ++cnt[r.kind];
    }
    const today = kstDay();
    const items = liked.results.map((l) => {
      const s0 = st.get(l.kind + "|" + l.key) || {};
      const p = l.key.split("|");
      const it = { kind: l.kind, key: l.key, n: l.n, today: l.lastday === today, status: s0.status || "open", link: s0.link || null, rank: rankOf[l.kind + "|" + l.key] || null };
      if (l.kind === "mbti") it.type = l.key;
      else if (l.kind === "pair") Object.assign(it, { a: p[0], b: p[1], rel: p[2] });
      else Object.assign(it, { type: p[0], text: sitText[p[1]] || "" });
      return it;
    }).filter((it) => it.status !== "hidden");
    return json({ likes: items, posts: posts.results.map((p) => postRow(p, uid, false)) });
  }

  // ---------- 관리자 API ----------
  if (path.startsWith("admin/")) {
    // 15분 안에 5번 틀리면 잠깐 막기
    const aip = await ipHash(request, salt);
    const since = Date.now() - 15 * 60e3;
    const fails = await db.prepare("SELECT COUNT(*) n FROM admin_fails WHERE ip=? AND ts>?").bind(aip, since).first();
    if (fails.n >= ADMIN_MAX_FAILS) return err("비밀번호를 여러 번 틀려서 15분 동안 막혔어요", 429);
    if (!isAdmin(request, env)) {
      await db.prepare("INSERT INTO admin_fails (ip, ts) VALUES (?,?)").bind(aip, Date.now()).run();
      const left = ADMIN_MAX_FAILS - fails.n - 1;
      return err(left > 0 ? `비밀번호가 틀렸어요 (${left}번 더 틀리면 15분 동안 막혀요)` : "비밀번호를 여러 번 틀려서 15분 동안 막혔어요", 401);
    }
    if (fails.n) await db.prepare("DELETE FROM admin_fails WHERE ip=?").bind(aip).run();

    // ---- 차단 ----
    if (path === "admin/block" && method === "POST") {
      // 글 하나를 기준으로 그 글을 쓴 기기·인터넷을 찾아서 차단
      let who = null, note = "";
      if (body.kind === "idea") {
        who = await db.prepare("SELECT voter, ip, text FROM ideas WHERE id=?").bind(Number(body.id)).first();
        note = who?.text || "";
      } else if (body.kind === "scene") {
        who = await db.prepare("SELECT voter, ip, type || ' · ' || text AS text FROM scenes WHERE id=?").bind(Number(body.id)).first();
        note = who?.text || "";
      } else if (body.kind === "reply") {
        who = await db.prepare("SELECT voter, ip, text FROM board_replies WHERE id=?").bind(Number(body.id)).first();
        note = who?.text || "";
      } else if (body.kind === "post") {
        who = await db.prepare("SELECT voter, ip, type || ' · ' || text AS text FROM board_posts WHERE id=?").bind(Number(body.id)).first();
        note = who?.text || "";
      } else if (body.kind === "pair" || body.kind === "situation") {
        who = await db.prepare("SELECT voter, ip FROM likes WHERE kind=? AND key=? ORDER BY created_at ASC LIMIT 1").bind(body.kind, String(body.key || "")).first();
        note = String(body.label || body.key || "");
      }
      if (!who || (!who.voter && !who.ip)) return err("누가 썼는지 찾을 수 없어요");
      const now = Date.now(), ops = [];
      if (who.voter) ops.push(db.prepare("INSERT OR REPLACE INTO blocks (kind, value, until, note, created_at) VALUES ('voter',?,NULL,?,?)").bind(who.voter, note.slice(0, 80), now));
      if (who.ip) ops.push(db.prepare("INSERT OR REPLACE INTO blocks (kind, value, until, note, created_at) VALUES ('ip',?,?,?,?)").bind(who.ip, now + 7 * 86400e3, note.slice(0, 80), now));
      await db.batch(ops);
      return json({ ok: true });
    }
    if (path === "admin/blocks" && method === "GET") {
      const r = await db.prepare("SELECT kind, value, until, note, created_at FROM blocks ORDER BY created_at DESC LIMIT 300").all();
      return json({ blocks: r.results.map((b) => ({ ...b, active: !b.until || b.until > Date.now() })) });
    }
    if (path === "admin/unblock" && method === "POST") {
      await db.prepare("DELETE FROM blocks WHERE kind=? AND value=?").bind(String(body.kind), String(body.value)).run();
      return json({ ok: true });
    }

    // ---- 백업 ----
    if (path === "admin/poll" && method === "GET") {
      const [rank, cross, cnt, rev] = await Promise.all([
        db.prepare("SELECT choice type, COUNT(*) n FROM poll_votes WHERE poll=? GROUP BY choice ORDER BY n DESC").bind(POLL.id).all(),
        db.prepare("SELECT my_type, choice, COUNT(*) n FROM poll_votes WHERE poll=? GROUP BY my_type, choice ORDER BY my_type, n DESC").bind(POLL.id).all(),
        db.prepare("SELECT COUNT(*) n FROM poll_votes WHERE poll=?").bind(POLL.id).first(),
        db.prepare("SELECT value FROM settings WHERE key=?").bind("poll_reveal:" + POLL.id).first(),
      ]);
      return json({ ...POLL, closed: pollClosed(), count: cnt.n, revealed: !!(rev && rev.value === "1"), ranking: rank.results, cross: cross.results });
    }
    if (path === "admin/poll/reveal" && method === "POST") {
      await db.prepare("INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
        .bind("poll_reveal:" + POLL.id, body.on ? "1" : "0").run();
      return json({ ok: true });
    }
    if (path === "admin/export" && method === "GET") {
      const tables = ["likes", "like_counts", "mbti_status", "combo_status", "situations", "ideas", "idea_likes", "scenes", "visits", "daily_views", "blocks", "poll_votes", "settings", "residents", "users", "board_posts", "board_likes", "board_reports", "board_replies", "reply_reports", "orders"];
      const out = { exported_at: new Date().toISOString(), tables: {} };
      for (const t of tables) out.tables[t] = (await db.prepare(`SELECT * FROM ${t}`).all()).results;
      return new Response(JSON.stringify(out), {
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      });
    }

    if (path === "admin/situations" && method === "GET") {
      const r = await db.prepare("SELECT id, text, active, by_user FROM situations ORDER BY by_user ASC, active DESC, id DESC").all();
      return json({ situations: r.results });
    }
    if (path === "admin/situations/add" && method === "POST") {
      const text = cleanSituation(body.text);
      if (text.length < 2) return err("상황을 적어주세요");
      const found = await db.prepare("SELECT id FROM situations WHERE text=?").bind(text).first();
      if (found) await db.prepare("UPDATE situations SET by_user=0, active=1 WHERE id=?").bind(found.id).run();
      else await db.prepare("INSERT INTO situations (text, created_at) VALUES (?,?)").bind(text, Date.now()).run();
      return json({ ok: true });
    }
    if (path === "admin/situations/update" && method === "POST") {
      const id = Number(body.id);
      if (typeof body.suggest === "boolean")
        await db.prepare("UPDATE situations SET by_user=? WHERE id=?").bind(body.suggest ? 0 : 1, id).run();
      if (typeof body.active === "boolean")
        await db.prepare("UPDATE situations SET active=? WHERE id=?").bind(body.active ? 1 : 0, id).run();
      if (typeof body.text === "string" && clean(body.text, 30))
        await db.prepare("UPDATE situations SET text=? WHERE id=?").bind(clean(body.text, 30), id).run();
      return json({ ok: true });
    }
    // 관리자가 궁합·상황 직접 넣기 (하트 0개로 시작)
    if (path === "admin/combo/add" && method === "POST") {
      let key;
      if (body.kind === "pair") {
        const a = String(body.a || "").toUpperCase(), b = String(body.b || "").toUpperCase();
        const rel = clean(body.rel, 12).replace(/\|/g, "");
        if (!MBTI.includes(a) || !MBTI.includes(b)) return err("MBTI 두 개를 골라주세요");
        if (rel.length < 2) return err("관계를 적어주세요");
        key = pairKey(a, b, rel);
      } else if (body.kind === "situation") {
        const t = String(body.type || "").toUpperCase();
        const text = cleanSituation(body.text);
        if (!MBTI.includes(t)) return err("MBTI를 골라주세요");
        if (text.length < 2) return err("상황을 적어주세요");
        let s0 = await db.prepare("SELECT id FROM situations WHERE text=?").bind(text).first();
        if (!s0) {
          const r = await db.prepare("INSERT INTO situations (text, created_at, by_user) VALUES (?,?,0)").bind(text, Date.now()).run();
          s0 = { id: r.meta.last_row_id };
        } else await db.prepare("UPDATE situations SET active=1 WHERE id=?").bind(s0.id).run();
        key = `${t}|${s0.id}`;
      } else return err("값이 이상해요");
      const has = await db.prepare("SELECT 1 x FROM like_counts WHERE kind=? AND key=?").bind(body.kind, key).first();
      if (has) return err("이미 올라와 있어요");
      await db.batch([
        db.prepare("INSERT INTO like_counts (kind, key, n, first_at) VALUES (?,?,0,?)").bind(body.kind, key, Date.now()),
        db.prepare(`INSERT INTO combo_status (kind, key, status, author) VALUES (?,?,'open',?)
          ON CONFLICT(kind, key) DO UPDATE SET author=COALESCE(combo_status.author, excluded.author)`).bind(body.kind, key, cleanInsta(body.author) || null),
      ]);
      return json({ ok: true, key });
    }
    // 궁합·상황 글 완전 삭제 (하트 기록까지)
    if (path === "admin/combo/delete" && method === "POST") {
      if (!["pair", "situation"].includes(body.kind)) return err("값이 이상해요");
      const key = String(body.key || "").slice(0, 60);
      if (!key.includes("|")) return err("값이 이상해요");
      await db.batch([
        db.prepare("DELETE FROM likes WHERE kind=? AND key=?").bind(body.kind, key),
        db.prepare("DELETE FROM like_counts WHERE kind=? AND key=?").bind(body.kind, key),
        db.prepare("DELETE FROM combo_status WHERE kind=? AND key=?").bind(body.kind, key),
      ]);
      // 사용자가 쓴 상황인데 더 이상 쓰는 곳이 없으면 상황 문장도 지움
      if (body.kind === "situation") {
        const sid = Number(key.split("|")[1]);
        const used = await db.prepare("SELECT 1 x FROM like_counts WHERE kind='situation' AND key LIKE ?").bind("%|" + sid).first();
        if (!used) await db.prepare("DELETE FROM situations WHERE id=? AND by_user=1").bind(sid).run();
      }
      return json({ ok: true });
    }
    if (path === "admin/combo" && method === "POST") {
      if (!["pair", "situation"].includes(body.kind) || ![...MBTI_STATUS, "hidden"].includes(body.status)) return err("값이 이상해요");
      const key = String(body.key || "").slice(0, 40);
      if (!key.includes("|")) return err("값이 이상해요");
      await db.prepare(
        `INSERT INTO combo_status (kind, key, status, link, status_day) VALUES (?,?,?,?,?)
         ON CONFLICT(kind, key) DO UPDATE SET status=excluded.status, link=excluded.link,
           status_day=CASE WHEN combo_status.status='today' AND excluded.status='today' THEN combo_status.status_day ELSE excluded.status_day END`
      ).bind(body.kind, key, body.status, clean(body.link, 300) || null, kstDay()).run();
      return json({ ok: true });
    }

    if (path === "admin/ideas" && method === "GET") {
      const r = await db.prepare(
        "SELECT id, text, author, approved, stage, link, hearts, created_at FROM ideas ORDER BY approved ASC, created_at DESC LIMIT 500"
      ).all();
      return json({ ideas: r.results });
    }
    if (path === "admin/ideas/update" && method === "POST") {
      const id = Number(body.id);
      if (body.delete) {
        await db.batch([
          db.prepare("DELETE FROM idea_likes WHERE idea_id=?").bind(id),
          db.prepare("DELETE FROM ideas WHERE id=?").bind(id),
        ]);
        return json({ ok: true });
      }
      const sets = [], vals = [];
      if ([-1, 0, 1].includes(body.approved)) { sets.push("approved=?"); vals.push(body.approved); }
      if (STAGES.includes(body.stage)) { sets.push("stage=?"); vals.push(body.stage); }
      if (typeof body.text === "string" && clean(body.text, 40)) { sets.push("text=?"); vals.push(clean(body.text, 40)); }
      if (typeof body.link === "string") { sets.push("link=?"); vals.push(clean(body.link, 300) || null); }
      if (!sets.length) return err("바꿀 게 없어요");
      await db.prepare(`UPDATE ideas SET ${sets.join(",")} WHERE id=?`).bind(...vals, id).run();
      return json({ ok: true });
    }
    if (path === "admin/ideas/add" && method === "POST") {
      // 관리자가 직접 넣는 아이디어 (바로 공개)
      const text = clean(body.text, 40);
      if (!text) return err("내용이 없어요");
      await db.prepare("INSERT INTO ideas (text, author, approved, stage, created_at) VALUES (?,?,1,?,?)")
        .bind(text, clean(body.author, 30) || null, STAGES.includes(body.stage) ? body.stage : "접수", Date.now()).run();
      return json({ ok: true });
    }
    // 하트 수 직접 정하기 (관리자)
    if (path === "admin/hearts" && method === "POST") {
      const n = Math.floor(Number(body.n));
      if (!Number.isFinite(n) || n < 0 || n > 1000000) return err("0 이상 숫자로 적어주세요");
      if (body.kind === "idea") {
        await db.prepare("UPDATE ideas SET hearts=? WHERE id=?").bind(n, Number(body.id) || 0).run();
        return json({ ok: true });
      }
      if (!["mbti", "pair", "situation"].includes(body.kind)) return err("값이 이상해요");
      const key = String(body.key || "").slice(0, 60);
      if (body.kind === "mbti" ? !MBTI.includes(key) : !key.includes("|")) return err("값이 이상해요");
      await db.prepare(`INSERT INTO like_counts (kind, key, n, first_at) VALUES (?,?,?,?)
        ON CONFLICT(kind, key) DO UPDATE SET n=excluded.n`).bind(body.kind, key, n, Date.now()).run();
      return json({ ok: true });
    }
    if (path === "admin/mbti" && method === "POST") {
      const type = String(body.type || "").toUpperCase();
      if (!MBTI.includes(type) || !MBTI_STATUS.includes(body.status)) return err("값이 이상해요");
      await db.prepare(
        `INSERT INTO mbti_status (type, status, episode, link, status_day) VALUES (?,?,?,?,?)
         ON CONFLICT(type) DO UPDATE SET status=excluded.status, episode=excluded.episode, link=excluded.link,
           status_day=CASE WHEN mbti_status.status='today' AND excluded.status='today' THEN mbti_status.status_day ELSE excluded.status_day END`
      ).bind(type, body.status, Number(body.episode) || null, clean(body.link, 300) || null, kstDay()).run();
      return json({ ok: true });
    }
    if (path === "admin/scenes" && method === "GET") {
      const r = await db.prepare("SELECT id, type, text, author, checked, created_at FROM scenes ORDER BY created_at DESC LIMIT 1000").all();
      return json({ scenes: r.results });
    }
    if (path === "admin/scenes/update" && method === "POST") {
      const id = Number(body.id);
      if (body.delete) await db.prepare("DELETE FROM scenes WHERE id=?").bind(id).run();
      else await db.prepare("UPDATE scenes SET checked=? WHERE id=?").bind(body.checked ? 1 : 0, id).run();
      return json({ ok: true });
    }
    // 통계: 오늘 요약 + 최근 14일 + 오늘 많이 눌린 것
    if (path === "admin/stats" && method === "GET") {
      const today = kstDay();
      const since = new Date(Date.now() + 9 * 3600e3 - 13 * 86400e3).toISOString().slice(0, 10);
      const sinceMs = Date.parse(since + "T00:00:00+09:00");
      const kday = (col) => `date((${col}/1000)+32400,'unixepoch')`;
      const [vis, views, hearts, ihearts, posts, ideas, scenes, topToday, sits, bposts, newres] = await Promise.all([
        db.prepare("SELECT day, COUNT(*) n FROM visits WHERE day>=? GROUP BY day").bind(since).all(),
        db.prepare("SELECT day, n FROM daily_views WHERE day>=?").bind(since).all(),
        db.prepare("SELECT day, kind, COUNT(*) n FROM likes WHERE day>=? GROUP BY day, kind").bind(since).all(),
        db.prepare("SELECT day, COUNT(*) n FROM idea_likes WHERE day>=? GROUP BY day").bind(since).all(),
        db.prepare(`SELECT ${kday("first_at")} day, kind, COUNT(*) n FROM like_counts WHERE kind IN ('pair','situation') AND first_at>=? GROUP BY day, kind`).bind(sinceMs).all(),
        db.prepare(`SELECT ${kday("created_at")} day, COUNT(*) n FROM ideas WHERE created_at>=? GROUP BY day`).bind(sinceMs).all(),
        db.prepare(`SELECT ${kday("created_at")} day, COUNT(*) n FROM scenes WHERE created_at>=? GROUP BY day`).bind(sinceMs).all(),
        db.prepare("SELECT kind, key, COUNT(*) n FROM likes WHERE day=? GROUP BY kind, key ORDER BY n DESC LIMIT 30").bind(today).all(),
        db.prepare("SELECT id, text FROM situations").all(),
        db.prepare(`SELECT ${kday("created_at")} day, COUNT(*) n FROM board_posts WHERE created_at>=? GROUP BY day`).bind(sinceMs).all(),
        db.prepare(`SELECT ${kday("created_at")} day, COUNT(*) n FROM residents WHERE created_at>=? GROUP BY day`).bind(sinceMs).all(),
      ]);
      const days = [];
      for (let i = 13; i >= 0; i--) days.push(new Date(Date.now() + 9 * 3600e3 - i * 86400e3).toISOString().slice(0, 10));
      const blank = () => ({ visitors: 0, views: 0, hearts: 0, mbti: 0, pair: 0, situation: 0, idea: 0, cheer: 0, newPair: 0, newSituation: 0, newIdea: 0, newScene: 0, newPost: 0, newResident: 0 });
      const byDay = Object.fromEntries(days.map((d) => [d, blank()]));
      const add = (d, k, n) => { if (byDay[d]) byDay[d][k] += n; };
      vis.results.forEach((r) => add(r.day, "visitors", r.n));
      views.results.forEach((r) => add(r.day, "views", r.n));
      hearts.results.forEach((r) => { add(r.day, "hearts", r.n); add(r.day, r.kind, r.n); });
      ihearts.results.forEach((r) => { add(r.day, "hearts", r.n); add(r.day, "idea", r.n); });
      posts.results.forEach((r) => add(r.day, r.kind === "pair" ? "newPair" : "newSituation", r.n));
      ideas.results.forEach((r) => add(r.day, "newIdea", r.n));
      scenes.results.forEach((r) => add(r.day, "newScene", r.n));
      bposts.results.forEach((r) => add(r.day, "newPost", r.n));
      newres.results.forEach((r) => add(r.day, "newResident", r.n));
      const sitText = Object.fromEntries(sits.results.map((x) => [x.id, x.text]));
      const label = (kind, key) => {
        const p = key.split("|");
        if (kind === "mbti") return `온 세상이 ${key}`;
        if (kind === "pair") return `${p[2]} ${p[0]} × ${p[1]}`;
        return `${p[0]} · ${sitText[p[1]] || ""}`;
      };
      const top = { mbti: [], pair: [], situation: [] };
      topToday.results.forEach((r) => { if (top[r.kind] && top[r.kind].length < 5) top[r.kind].push({ label: label(r.kind, r.key), n: r.n }); });
      return json({ today, days: days.map((d) => ({ day: d, ...byDay[d] })), top });
    }
    // ---- 주민·게시판 ----
    if (path === "admin/board" && method === "GET") {
      const r = await db.prepare("SELECT p.id, p.type, p.cat, p.text, p.writer_type, p.hearts, p.reports, p.hidden, p.created_at, u.nickname FROM board_posts p LEFT JOIN users u ON u.uid=p.voter ORDER BY p.hidden DESC, p.reports DESC, p.created_at DESC LIMIT 1000").all();
      const rr = await db.prepare("SELECT r.id, r.post_id, r.text, r.writer_type, r.reports, r.hidden, r.created_at, u.nickname, p.type, p.text post_text FROM board_replies r LEFT JOIN users u ON u.uid=r.voter LEFT JOIN board_posts p ON p.id=r.post_id ORDER BY r.hidden DESC, r.reports DESC, r.created_at DESC LIMIT 1000").all();
      return json({ posts: r.results, replies: rr.results });
    }
    if (path === "admin/board/update" && method === "POST") {
      const id = Number(body.id);
      if (body.delete) {
        await db.batch([
          db.prepare("DELETE FROM board_likes WHERE post_id=?").bind(id),
          db.prepare("DELETE FROM board_reports WHERE post_id=?").bind(id),
          db.prepare("DELETE FROM board_replies WHERE post_id=?").bind(id),
          db.prepare("DELETE FROM board_posts WHERE id=?").bind(id),
        ]);
      } else if (typeof body.hidden === "boolean") {
        // 다시 보이게 하면 신고 기록도 지움 (또 바로 숨지 않게)
        const ops = [db.prepare("UPDATE board_posts SET hidden=?, reports=CASE WHEN ? THEN reports ELSE 0 END WHERE id=?").bind(body.hidden ? 1 : 0, body.hidden ? 1 : 0, id)];
        if (!body.hidden) ops.push(db.prepare("DELETE FROM board_reports WHERE post_id=?").bind(id));
        await db.batch(ops);
      } else return err("바꿀 게 없어요");
      return json({ ok: true });
    }
    if (path === "admin/reply/update" && method === "POST") {
      const id = Number(body.id);
      if (body.delete) await db.batch([db.prepare("DELETE FROM reply_reports WHERE reply_id=?").bind(id), db.prepare("DELETE FROM board_replies WHERE id=?").bind(id)]);
      else if (typeof body.hidden === "boolean") {
        const ops = [db.prepare("UPDATE board_replies SET hidden=?, reports=CASE WHEN ? THEN reports ELSE 0 END WHERE id=?").bind(body.hidden ? 1 : 0, body.hidden ? 1 : 0, id)];
        if (!body.hidden) ops.push(db.prepare("DELETE FROM reply_reports WHERE reply_id=?").bind(id));
        await db.batch(ops);
      } else return err("바꿀 게 없어요");
      return json({ ok: true });
    }
    // ---- 맞춤 영상 주문 ----
    if (path === "admin/orders" && method === "GET") {
      const all = url.searchParams.get("all") === "1";
      const r = await db.prepare(`SELECT * FROM orders ${all ? "" : "WHERE status<>'pending'"} ORDER BY CASE status WHEN 'paid' THEN 0 WHEN 'script' THEN 1 WHEN 'making' THEN 2 ELSE 3 END, created_at DESC LIMIT 500`).all();
      return json({ orders: r.results.map((o) => orderRow(o, true)), test: tossKeys(env).ck.startsWith("test_") });
    }
    if (path === "admin/notify-test" && method === "POST") {
      if (!env.RESEND_API_KEY) return err("RESEND_API_KEY가 아직 없어요");
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + String(env.RESEND_API_KEY).trim(), "Content-Type": "application/json" },
        body: JSON.stringify({ from: env.NOTIFY_FROM || "웅이프 주문 <onboarding@resend.dev>", to: [env.NOTIFY_EMAIL || NOTIFY_DEFAULT], subject: "[웅이프] 주문 알림 테스트", html: "<p>주문 알림 메일이 잘 와요 ✅</p>" }) }).catch(() => null);
      const d = r ? await r.json().catch(() => ({})) : {};
      return r && r.ok ? json({ ok: true }) : err(d.message || "메일을 못 보냈어요");
    }
    if (path === "admin/order/update" && method === "POST") {
      const o = await db.prepare("SELECT * FROM orders WHERE id=?").bind(String(body.id || "")).first();
      if (!o) return err("주문을 찾을 수 없어요", 404);
      if (body.refund) {
        if (!o.payment_key || o.status === "canceled" || o.status === "pending") return err("환불할 결제가 없어요");
        const r = await toss(env, `payments/${encodeURIComponent(o.payment_key)}/cancel`, { cancelReason: clean(body.reason, 100) || "판매자 환불" }, "cancel-" + o.id);
        if (!r.ok) return err(r.data.message || "환불에 실패했어요");
        await db.prepare("UPDATE orders SET status='canceled', cancel_reason=?, canceled_at=? WHERE id=?").bind(clean(body.reason, 100) || "판매자 환불", Date.now(), o.id).run();
        return json({ ok: true });
      }
      const st = ORDER_STATUS.includes(body.status) && body.status !== "canceled" ? body.status : o.status;
      await db.prepare("UPDATE orders SET status=?, link=?, script_link=?, note=? WHERE id=?")
        .bind(st, body.link !== undefined ? clean(body.link, 300) || null : o.link, body.script !== undefined ? clean(body.script, 300) || null : o.script_link,
          body.note !== undefined ? String(body.note).slice(0, 1000) : o.note, o.id).run();
      return json({ ok: true });
    }
    if (path === "admin/check") return json({ ok: true });
  }

  return err("없는 주소예요", 404);
}
