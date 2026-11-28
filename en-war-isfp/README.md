# [EN] If everyone was ISFP… and a war broke out? (woong.if.en #4)

한국판 `war-isfp` 코드를 그대로 쓰고 화면 글씨·자막·음성만 영어로 바꾼 영어 계정 편.

- 음성(eleven_v4, ElevenLabs flow C2zCFe7sYdIjBzs6Xpsx, 역할별 1테이크): 내레이터 Liam(TX3LPaxmHKxFdv7VOQHJ) · 장군 Jerry B.(TxWZERZ5Hc6h9dGxVmXa) · 적장 Adam(IRHApOXLvnW57QJPQH2P) · 적 병사 Nelson(EaX6rnyDKjJx35tchi80) · 병사 Lip(DGqQmo441r9TwJq0migX)
- `split.py`(Scribe 단어 타임스탬프 + 무음 구간으로 대사 자르기, 함성·동시 대사 합성. raw/·lines/는 커밋 안 함) → `build_audio.py`(내레이션 1.08·대사 1.05배) → `build.sh` → `render.py` 2워커(장면 0~5, 7) → `mix.py`
- 7번째 장면(작전회의·새벽 취소톡)은 한국판처럼 최종본에서 빠짐 — 그 장면 코드의 한글은 렌더되지 않음.
- 현지화: 몽실이→Mochi, 초코→Cocoa, 도장 '연기'→POSTPONED, 카톡→Group chat. 3D 말풍선은 영어 길이에 맞춰 짧게(Bring it!! / For real!! / Not Mochi…).
- 커버: `thumb.py` → `thumb_ISFP_war_EN.jpg` (첫 장면 타이틀, 자막 없이)
- 글꼴 Inter.
