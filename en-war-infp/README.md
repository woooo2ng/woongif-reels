# INFP 전쟁편 영어판 (INFP × WAR)

원본 코드가 없어서, 한국판 최종 mp4 위에 영어 글씨를 덮어 만든 버전.

- `render_en.py` — 한국어 자막·칩·화자 알약·말풍선·편지·타이틀을 지우고(인페인트 / 타이틀은 첫 프레임 클린 플레이트를 ECC로 맞춰 붙임) 영어로 다시 그림. `python3 render_en.py 40.13 src.mp4`
- `bub.py` — 말풍선 색 추적
- `mix_en.py`, `seg.py` — ElevenLabs 영어 음성을 한국판 대사 타이밍에 맞춰 배치
- 목소리(eleven_v4): 내레이터 Liam(TX3LPaxmHKxFdv7VOQHJ) · 병사 Lip(DGqQmo441r9TwJq0migX) · 대장 Jerry B. Military Commander(TxWZERZ5Hc6h9dGxVmXa) · 적군 병사 Nelson(EaX6rnyDKjJx35tchi80) · 적군 대장 Adam(IRHApOXLvnW57QJPQH2P)
- 글꼴: Inter ExtraBold / Black

## 2026-11-27 업로드 준비 (woong.if.en #2)
- `fix_ko_leak.py` — 편지가 나타나고 사라지는 전환 프레임(735→740, 806→813, 998→1003)에 한국어 편지가 비치던 것을 앞뒤 영어 프레임 크로스페이드로 교체. mp4는 교체본.
- `cover.py` + `thumb_INFP_war_EN.jpg` — 첫 프레임에서 자막을 지우고(인페인트 + 모래주머니 줄 덮기) Inter Black 큰 타이틀을 얹은 커버.
