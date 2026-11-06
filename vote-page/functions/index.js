// 첫 화면(/)을 보낼 때 공유 이미지 주소를 전체 주소로 바꿔줌 (카톡·DM 미리보기용)
export async function onRequest({ request, next }) {
  const res = await next();
  if (!(res.headers.get("content-type") || "").includes("text/html")) return res;
  const origin = new URL(request.url).origin;
  return new HTMLRewriter()
    .on('meta[property="og:image"]', { element(e) { e.setAttribute("content", origin + "/og.png"); } })
    .on('meta[property="og:url"]', { element(e) { e.setAttribute("content", origin + "/"); } })
    .transform(res);
}
