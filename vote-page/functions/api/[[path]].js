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
const BAD = ["시발","씨발","ㅅㅂ","병신","ㅂㅅ","좆","새끼","fuck","섹스","자살"];

const RELS = ["커플", "친구", "직장 동료"];
// 커플·친구·직장 동료는 순서 상관없음, 직접 입력(엄마와 아들 등)은 순서대로
const pairKey = (a, b, rel) => (RELS.includes(rel) ? [a, b].sort() : [a, b]).join("|") + "|" + rel;

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
    ranking: items.filter((i) => i.status === "open").slice(0, all ? 300 : 100),
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
  ready = true;
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
function isAdmin(req, env) {
  // 한글·특수문자 비밀번호도 되도록 인코딩해서 받음, 앞뒤 공백·줄바꿈은 무시
  let key = req.headers.get("x-admin-key") || "";
  try { key = decodeURIComponent(key); } catch {}
  const pw = String(env.ADMIN_PASSWORD || "").trim();
  return !!pw && key.trim() === pw;
}

export async function onRequest({ request, env, params }) {
  if (!env.DB) return err("D1 데이터베이스(DB) 바인딩이 없어요", 500);
  const db = env.DB;
  await setup(db);
  const path = (params.path || []).join("/");
  const method = request.method;
  const body = method === "POST" ? await request.json().catch(() => ({})) : {};
  const url = new URL(request.url);
  const salt = env.ADMIN_PASSWORD || "woongif";

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

  // ---------- 관리자 API ----------
  if (path.startsWith("admin/")) {
    if (!isAdmin(request, env)) return err("비밀번호가 틀렸어요", 401);

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
        `INSERT INTO combo_status (kind, key, status, link) VALUES (?,?,?,?)
         ON CONFLICT(kind, key) DO UPDATE SET status=excluded.status, link=excluded.link`
      ).bind(body.kind, key, body.status, clean(body.link, 300) || null).run();
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
    if (path === "admin/mbti" && method === "POST") {
      const type = String(body.type || "").toUpperCase();
      if (!MBTI.includes(type) || !MBTI_STATUS.includes(body.status)) return err("값이 이상해요");
      await db.prepare(
        `INSERT INTO mbti_status (type, status, episode, link) VALUES (?,?,?,?)
         ON CONFLICT(type) DO UPDATE SET status=excluded.status, episode=excluded.episode, link=excluded.link`
      ).bind(type, body.status, Number(body.episode) || null, clean(body.link, 300) || null).run();
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
      const [vis, views, hearts, ihearts, posts, ideas, scenes, topToday, sits] = await Promise.all([
        db.prepare("SELECT day, COUNT(*) n FROM visits WHERE day>=? GROUP BY day").bind(since).all(),
        db.prepare("SELECT day, n FROM daily_views WHERE day>=?").bind(since).all(),
        db.prepare("SELECT day, kind, COUNT(*) n FROM likes WHERE day>=? GROUP BY day, kind").bind(since).all(),
        db.prepare("SELECT day, COUNT(*) n FROM idea_likes WHERE day>=? GROUP BY day").bind(since).all(),
        db.prepare(`SELECT ${kday("first_at")} day, kind, COUNT(*) n FROM like_counts WHERE kind IN ('pair','situation') AND first_at>=? GROUP BY day, kind`).bind(sinceMs).all(),
        db.prepare(`SELECT ${kday("created_at")} day, COUNT(*) n FROM ideas WHERE created_at>=? GROUP BY day`).bind(sinceMs).all(),
        db.prepare(`SELECT ${kday("created_at")} day, COUNT(*) n FROM scenes WHERE created_at>=? GROUP BY day`).bind(sinceMs).all(),
        db.prepare("SELECT kind, key, COUNT(*) n FROM likes WHERE day=? GROUP BY kind, key ORDER BY n DESC LIMIT 30").bind(today).all(),
        db.prepare("SELECT id, text FROM situations").all(),
      ]);
      const days = [];
      for (let i = 13; i >= 0; i--) days.push(new Date(Date.now() + 9 * 3600e3 - i * 86400e3).toISOString().slice(0, 10));
      const blank = () => ({ visitors: 0, views: 0, hearts: 0, mbti: 0, pair: 0, situation: 0, idea: 0, newPair: 0, newSituation: 0, newIdea: 0, newScene: 0 });
      const byDay = Object.fromEntries(days.map((d) => [d, blank()]));
      const add = (d, k, n) => { if (byDay[d]) byDay[d][k] += n; };
      vis.results.forEach((r) => add(r.day, "visitors", r.n));
      views.results.forEach((r) => add(r.day, "views", r.n));
      hearts.results.forEach((r) => { add(r.day, "hearts", r.n); add(r.day, r.kind, r.n); });
      ihearts.results.forEach((r) => { add(r.day, "hearts", r.n); add(r.day, "idea", r.n); });
      posts.results.forEach((r) => add(r.day, r.kind === "pair" ? "newPair" : "newSituation", r.n));
      ideas.results.forEach((r) => add(r.day, "newIdea", r.n));
      scenes.results.forEach((r) => add(r.day, "newScene", r.n));
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
    if (path === "admin/check") return json({ ok: true });
  }

  return err("없는 주소예요", 404);
}
