# woongif-reels

웅이프(woong.if) '온 세상이 OO라면?' MBTI 릴스 작업 저장소.

## 새 편을 만들기 전에 꼭
1. `SCENES.md`를 읽는다 — 이미 쓴 장면·연출은 그대로 반복하지 않는다.
2. 지난 편 폴더(`epN-xxxx/`)의 `contact_sheet.jpg`와 코드(있으면)를 보고 룩을 맞춘다.
3. 룩(파스텔 로우폴리, 사람 모델, 알약 말풍선, 타이틀·자막·상황 칩, 질문 엔딩)은 바꾸지 않는다. 바꾸고 싶으면 먼저 시안을 보여 주고 지웅이 고른다.
4. 길이는 지금처럼 50초 안팎(장면 8~10개)으로 간다. 줄이지 않는다. 첫 장면부터 제일 웃긴 상황으로 시작한다.
5. 웅이프 캐릭터·웅이프 엔딩·ElevenLabs 출처 표기는 넣지 않는다.

## 새 편을 완성하면
- `epN-mbti/` 폴더에 최종 mp4, contact_sheet.jpg, index.html·render.py 등 코드를 넣는다(node_modules, 프레임, 임시 파일 제외).
- `SCENES.md`에 그 편의 장면과 새로 쓴 연출을 추가하고 커밋·푸시한다.
- 신청소 16칸에 사진이 뜨도록 `vote-page/public/thumbs/`에 타이틀 장면 썸네일(가로 360px jpg)을 넣는다. MBTI 편은 `유형.jpg`(예: `INTJ.jpg`), 궁합편은 `p_앞유형_뒤유형.jpg`(예: `p_ISTP_ENFP.jpg`).

## 폴더
- `ep1-isfp/` ~ `ep4-estp/` — 최종 영상 + 장면 미리보기(contact_sheet.jpg, 2초 간격).
- 1·2편 코드 백업(woongif_reels_template.tar.gz)을 받으면 해당 폴더에 코드도 넣는다.
