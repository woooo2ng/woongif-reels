// 웅이프 만약에 신청소 — API (Cloudflare Pages Functions + D1)
// 바인딩: DB (D1), 환경변수: ADMIN_PASSWORD

const MBTI = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];
const STAGES = ["접수", "제작 중", "공개 예정", "나옴"];
const MBTI_STATUS = ["open", "making", "done"];
const DAILY_IP_LIKES = 150;  // 같은 와이파이(학교·카페)에서 하루 좋아요 상한 (종류별)
const DAILY_IP_IDEAS = 5;
const DAILY_IP_SITUATIONS = 10;
const BAD = ["시발","씨발","ㅅㅂ","병신","ㅂㅅ","좆","새끼","fuck","섹스","자살"];

const RELS = ["커플", "친구", "직장 동료"];
// 커플·친구·직장 동료는 순서 상관없음, 직접 입력(엄마와 아들 등)은 순서대로
const pairKey = (a, b, rel) => (RELS.includes(rel) ? [a, b].sort() : [a, b]).join("|") + "|" + rel;

// 궁합/상황 투표판: 표 수 + 상태를 합쳐서 반환
async function comboBoard(db, kind, voter, all) {
  const [counts, status, mine, sits] = await Promise.all([
    db.prepare("SELECT key, n FROM like_counts WHERE kind=? AND n>0").bind(kind).all(),
    db.prepare("SELECT key, status, link, author FROM combo_status WHERE kind=?").bind(kind).all(),
    db.prepare("SELECT key FROM likes WHERE kind=? AND voter=? AND day=?").bind(kind, voter, kstDay()).all(),
    kind === "situation" ? db.prepare("SELECT id, text, active, by_user FROM situations ORDER BY id").all() : null,
  ]);
  const sitMap = sits ? Object.fromEntries(sits.results.map((s) => [s.id, s])) : {};
  const map = new Map();
  for (const r of counts.results) map.set(r.key, { key: r.key, votes: r.n, status: "open", link: null });
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
    making: items.filter((i) => i.status === "making"),
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
    const ins = await db.prepare("INSERT OR IGNORE INTO likes (kind, key, voter, day, ip, created_at) VALUES (?,?,?,?,?,?)")
      .bind(kind, key, voter, day, ip, Date.now()).run();
    if (ins.meta.changes)
      await db.prepare(`INSERT INTO like_counts (kind, key, n) VALUES (?,?,1)
        ON CONFLICT(kind, key) DO UPDATE SET n=n+1`).bind(kind, key).run();
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
    // 하트 수 집계 (순위 볼 때마다 전체를 세지 않도록 → 무료 한도 아끼기)
    db.prepare(`CREATE TABLE IF NOT EXISTS like_counts (
      kind TEXT NOT NULL, key TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(kind, key))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS mbti_status (
      type TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'open', episode INTEGER, link TEXT)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, author TEXT,
      approved INTEGER NOT NULL DEFAULT 0, stage TEXT NOT NULL DEFAULT '접수',
      link TEXT, hearts INTEGER NOT NULL DEFAULT 0, ip TEXT, voter TEXT, created_at INTEGER)`),
    // 아이디어 하트도 같은 글은 하루 1번
    db.prepare(`CREATE TABLE IF NOT EXISTS idea_likes (
      idea_id INTEGER NOT NULL, voter TEXT NOT NULL, day TEXT NOT NULL, PRIMARY KEY(idea_id, voter, day))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS combo_status (
      kind TEXT NOT NULL, key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', link TEXT,
      author TEXT, PRIMARY KEY(kind, key))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS situations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER,
      by_user INTEGER NOT NULL DEFAULT 0, ip TEXT)`),
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
  const key = req.headers.get("x-admin-key");
  return !!env.ADMIN_PASSWORD && key === env.ADMIN_PASSWORD;
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
    const dup = await db.prepare("SELECT id FROM ideas WHERE text=?").bind(text).first();
    if (dup) return err("이미 누가 낸 아이디어예요! 목록에서 하트를 눌러주세요");
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
      const ins = await db.prepare("INSERT OR IGNORE INTO idea_likes (idea_id, voter, day) VALUES (?,?,?)").bind(id, body.voter, day).run();
      if (ins.meta.changes) await db.prepare("UPDATE ideas SET hearts=hearts+1 WHERE id=?").bind(id).run();
    }
    const r = await db.prepare("SELECT hearts FROM ideas WHERE id=?").bind(id).first();
    return json({ liked: !had, hearts: r.hearts });
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
    if (path === "admin/check") return json({ ok: true });
  }

  return err("없는 주소예요", 404);
}
