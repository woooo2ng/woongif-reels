# [EN] If everyone was ISTP… and a war broke out? (woong.if.en #3)

한국판 `war-istp` 코드를 그대로 쓰고 화면 글씨·자막·음성만 영어로 바꾼 영어 계정 편.

- 음성(eleven_v4, ElevenLabs flow lSW8T9cdQJtJtNWYZpvE, 역할별 1테이크): 내레이터 Liam(TX3LPaxmHKxFdv7VOQHJ) · 장군 Jerry B.(TxWZERZ5Hc6h9dGxVmXa) · 적장 Adam(IRHApOXLvnW57QJPQH2P) · 적 병사 Nelson(EaX6rnyDKjJx35tchi80) · 병사 Lip(DGqQmo441r9TwJq0migX)
- `split.py`(Scribe 단어 타임스탬프로 대사 자르기, raw/·lines/는 커밋 안 함) → `build_audio.py`(한국판 최종 구성 build_audio+build_v2+build_s0를 한 파일로, 대사 1.08배) → `build.sh` → `render.py` 2워커 → `mix.py`
- 커버: `thumb.py` → `thumb_ISTP_war_EN.jpg` (첫 장면 타이틀, 자막 없이)
- 글꼴 Inter. 길이 92초.
