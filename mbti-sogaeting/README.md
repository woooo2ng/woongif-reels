# 만약에 소개팅 (mbti-sogaeting)

웅이프 MBTI 캐릭터랑 5분 소개팅하는 웹 게임. 장면 5개 → 선택지 → 엔딩 4개 → 결과 카드(공유 이미지).

## 폴더
- `public/` 배포되는 정적 사이트
  - `index.html` · `style.css` · `app.js` 화면 (대본 내용을 몰라도 돌아감)
  - `data/<상대>.json` 대본. 장면·선택지·엔딩·결과 카드 문구 전부 여기서 고침
  - `img/<상대>/<표정>.png` 캐릭터 표정 (smile·excited·happy·blush·pout·teary·surprised)
- `tools/` 표정 PNG 뽑는 도구 (이방인편 `sp-isfp-enfp`의 ENFP 모델 그대로)
  - `cd tools && npm i && python3 render_portraits.py`

## 대본 고치기
`public/data/enfp-f.json`만 고치면 됨.
- 장면 `lines`: 상대 대사 (`expr` = 표정 이름)
- `choices`: 선택지 3개 (`score` = 숨은 호감도, `react` = 반응 대사)
- `endings`: `when`(히든 조건) 또는 `min`(호감도 합계 기준)

## 새 상대 추가
1. `tools/portraits.html`에 캐릭터 모델 추가 → `img/<id>/` 표정 뽑기
2. `data/<id>.json` 대본 작성
3. `app.js`의 `PARTNERS`에 `{ mbti, g, file }` 한 줄 추가

## 나중에 켜는 스위치 (`app.js`의 `CONFIG`)
- `paywall` / `freeCount`: 첫 1명 무료(유저가 고름), 이후 잠금
- `hiddenLocked`: 히든 엔딩 잠금
- `adSlot`: 결과 화면 광고 자리
- `track`: `/api/track` 통계 전송 (Cloudflare Pages Functions + D1 붙인 뒤)

## 배포 (Cloudflare Workers · 정적 사이트)
- `wrangler.jsonc`의 `name`(mbti-sogaeting)과 대시보드 Worker 이름이 같아야 함
- Worker → Settings → Build: Git 저장소 `woongif-reels`, Branch `sogaeting`(main에 합치면 `main`), **Root directory `mbti-sogaeting`**, Build command 비움, Deploy command `npx wrangler deploy`
- 주소: https://mbti-sogaeting.dopaminpet-15a7fee7.workers.dev (Worker `mbti-sogaeting`, 2026-11-24 배포)
