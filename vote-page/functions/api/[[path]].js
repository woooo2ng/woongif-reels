// 웅이프 만약에 신청소 — API (Cloudflare Pages Functions + D1)
// 바인딩: DB (D1), 환경변수: ADMIN_PASSWORD

const MBTI = [
  "ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ",
];
const STAGES = ["접수", "제작 중", "공개 예정", "나옴"];
const MBTI_STATUS = ["open", "making", "done"];
const DAILY_IP_VOTES = 15;   // 같은 와이파이(학교·카페) 고려
const DAILY_IP_IDEAS = 5;
const BAD = ["시발","씨발","ㅅㅂ","병신","ㅂㅅ","좆","새끼","fuck","섹스","자살"];

let ready = false;
async function setup(db) {
  if (ready) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS mbti_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, voter TEXT NOT NULL,
      day TEXT NOT NULL, ip TEXT, created_at INTEGER, UNIQUE(voter, day))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS mbti_status (
      type TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'open', episode INTEGER, link TEXT)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, author TEXT,
      approved INTEGER NOT NULL DEFAULT 0, stage TEXT NOT NULL DEFAULT '접수',
      link TEXT, hearts INTEGER NOT NULL DEFAULT 0, ip TEXT, voter TEXT, created_at INTEGER)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS hearts (
      idea_id INTEGER NOT NULL, voter TEXT NOT NULL, PRIMARY KEY(idea_id, voter))`),
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
      db.prepare("SELECT type, COUNT(*) n FROM mbti_votes GROUP BY type").all(),
      db.prepare("SELECT type, status, episode, link FROM mbti_status").all(),
      db.prepare("SELECT type FROM mbti_votes WHERE voter=? AND day=?").bind(voter, kstDay()).first(),
    ]);
    const c = Object.fromEntries(counts.results.map((r) => [r.type, r.n]));
    const s = Object.fromEntries(status.results.map((r) => [r.type, r]));
    return json({
      types: MBTI.map((t) => ({
        type: t, votes: c[t] || 0,
        status: s[t]?.status || "open", episode: s[t]?.episode || null, link: s[t]?.link || null,
      })),
      todayVote: mine?.type || null,
    });
  }

  if (path === "mbti/vote" && method === "POST") {
    const type = String(body.type || "").toUpperCase();
    if (!MBTI.includes(type)) return err("MBTI 유형이 이상해요");
    if (!validVoter(body.voter)) return err("다시 시도해 주세요");
    const st = await db.prepare("SELECT status FROM mbti_status WHERE type=?").bind(type).first();
    if (st && st.status === "done") return err("이미 나온 유형이에요");
    const ip = await ipHash(request, salt);
    const day = kstDay();
    const ipCount = await db.prepare("SELECT COUNT(*) n FROM mbti_votes WHERE ip=? AND day=?").bind(ip, day).first();
    if (ipCount.n >= DAILY_IP_VOTES) return err("오늘은 이 네트워크에서 신청이 너무 많아요. 내일 다시!");
    try {
      await db.prepare("INSERT INTO mbti_votes (type, voter, day, ip, created_at) VALUES (?,?,?,?,?)")
        .bind(type, body.voter, day, ip, Date.now()).run();
    } catch {
      return err("오늘은 이미 신청했어요. 내일 또 해주세요!");
    }
    return json({ ok: true });
  }

  if (path === "ideas" && method === "GET") {
    const sort = url.searchParams.get("sort") === "new" ? "created_at DESC" : "hearts DESC, created_at DESC";
    const voter = url.searchParams.get("voter") || "";
    const [list, mine] = await Promise.all([
      db.prepare(`SELECT id, text, author, stage, link, hearts FROM ideas WHERE approved=1 ORDER BY ${sort} LIMIT 300`).all(),
      db.prepare("SELECT idea_id FROM hearts WHERE voter=?").bind(voter).all(),
    ]);
    const liked = new Set(mine.results.map((r) => r.idea_id));
    return json({ ideas: list.results.map((r) => ({ ...r, liked: liked.has(r.id) })) });
  }

  if (path === "ideas" && method === "POST") {
    const text = clean(body.text, 40);
    const author = clean(body.author, 30).replace(/^@/, "");
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
    const had = await db.prepare("SELECT 1 x FROM hearts WHERE idea_id=? AND voter=?").bind(id, body.voter).first();
    if (had) {
      await db.batch([
        db.prepare("DELETE FROM hearts WHERE idea_id=? AND voter=?").bind(id, body.voter),
        db.prepare("UPDATE ideas SET hearts=MAX(hearts-1,0) WHERE id=?").bind(id),
      ]);
    } else {
      await db.batch([
        db.prepare("INSERT OR IGNORE INTO hearts (idea_id, voter) VALUES (?,?)").bind(id, body.voter),
        db.prepare("UPDATE ideas SET hearts=hearts+1 WHERE id=?").bind(id),
      ]);
    }
    const r = await db.prepare("SELECT hearts FROM ideas WHERE id=?").bind(id).first();
    return json({ liked: !had, hearts: r.hearts });
  }

  // ---------- 관리자 API ----------
  if (path.startsWith("admin/")) {
    if (!isAdmin(request, env)) return err("비밀번호가 틀렸어요", 401);

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
          db.prepare("DELETE FROM hearts WHERE idea_id=?").bind(id),
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
