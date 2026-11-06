# 웅이프 만약에 신청소

인스타 프로필 링크에 거는 페이지.

- 다음 편 투표 3종 (각각 기기당 하루 1번): 🌍 온 세상 MBTI / 💞 궁합편("온 세상 ○○이 전부 A × B라면?" — 커플·친구·직장 동료 또는 직접 입력, 예: 엄마와 아들) / 🎬 상황편(온 세상이 ○○인데 ___?)
- 💡 '만약에' 아이디어 받기 + 하트 투표
- 바로가기 링크: `/#pair` 궁합편, `/#sit` 상황편, `/#idea` 아이디어

- `/` 공개 페이지 (MBTI 신청: 기기당 하루 1표 / 아이디어: 승인 후 공개, 하트)
- `/admin.html` 관리 (아이디어 승인·거절, 진행 상태, 릴스 링크, MBTI 상태, 상황 후보 추가, 궁합·상황편 제작 중/나옴 표시)
- Cloudflare Pages + Pages Functions + D1. 테이블은 첫 요청 때 자동 생성.

## 배포 (Cloudflare 대시보드, 한 번만)

1. **D1 만들기**: Workers & Pages → D1 SQL Database → Create → 이름 `woongif-vote`
2. **Pages 연결**: Workers & Pages → Create → Pages → Connect to Git → `woongif-reels` 선택
   - Framework preset: None
   - Build command: 비움
   - Build output directory: `public`
   - Root directory: `vote-page`
   - 프로젝트 이름이 주소가 됨 (예: `woongif` → `woongif.pages.dev`)
3. **설정**: 만든 Pages 프로젝트 → Settings
   - Bindings → Add → D1 database → 변수 이름 `DB`, 데이터베이스 `woongif-vote`
   - Variables and Secrets → Add → `ADMIN_PASSWORD` (Secret) = 관리자 비밀번호
4. **다시 배포**: Deployments → 최신 배포 ⋯ → Retry deployment (바인딩은 재배포 후 적용)
5. `/admin.html` 들어가서 MBTI 탭에 나온 편(1 ISFP, 2 ISTJ, 3 ISTP, 4 ESTP = 나옴, INTP = 제작 중) 저장. 궁합·상황 탭에서 상황 후보 몇 개 추가 (없으면 상황편 투표 불가)

이후엔 `main`에 push 하면 자동 배포.

## 로컬 실행

```
npm i -D wrangler
# wrangler.toml (커밋 안 함)
#   pages_build_output_dir = "./public"
#   [[d1_databases]] binding="DB" database_name="woongif-vote" database_id="local"
echo ADMIN_PASSWORD=test > .dev.vars
npx wrangler pages dev
```

## 스팸 대비

- MBTI: 기기 ID당 하루 1표 + 같은 IP 하루 15표까지
- 아이디어: 같은 IP 하루 5개, 40자, 링크·욕설 차단, 중복 문장 차단, 관리자 승인 후 공개
- IP는 해시로만 저장
