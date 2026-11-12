# 2차 수정: 전투(빗나감) → 표정 대화 순서로 바꾸고, '저도긴 해요' 대사 제거
#  - 장면3: 전투  f4 / s5 / gw('귀찮긴 해', 말풍선 'ㅇㅈ 귀찮긴 해')
#  - 장면4: 표정  fN('근데 표정이 왜 이렇게 안 좋아요?') / s4 / ('…' 말풍선) / n4
#  - 장면7: 엔딩  n8 / e2 / g3 / (카톡 'ㅇㅇ' + 도장) / n9
# lines2/ 의 줄은 이미 1.1배속 처리된 것
import json
src = open('build_audio.py').read().split('# ---------- 장면 구성')[0]
src = src.replace("f'lines/{name}.wav', '-af', 'atempo=1.1', ", "f'lines2/{name}.wav', ")
exec(src)

info = json.load(open('audio/timing.json'))
SC = {3: ([('f4', 2.9), ('s5', 0.35), ('gw', 0.4)], 0.7),
      4: ([('fN', 0.3), ('s4', 0.4), ('n4', 1.0)], 0.0),
      7: ([('n8', 0.3), ('e2', 0.45), ('g3', 0.4), ('n9', 2.2)], 0.2)}
LEAD = 0.25
for si, (lines, post) in SC.items():
    t = 0; starts = {}; xs = []
    for name, gap in lines:
        x = load(name); t += gap; starts[name] = [round(t, 3), round(len(x) / SR, 3)]; xs.append((x, t)); t += len(x) / SR
    T = t + post
    v = np.zeros(int(T * SR) + 1)
    for x, st in xs: place(v, x, st)
    save(v, f'audio/v{si + 1}.wav')
    TT = T + 0.7 + (0.3 if si == 7 else 0)
    b = np.zeros(int(TT * SR)); ev = {}
    vt = lambda nm, k=0: LEAD + starts[nm][0] + k
    if si == 3:
        b += wind(TT, 0.06); shots = [round(1.25 + i * 0.3, 3) for i in range(5)]; ev['shots'] = shots
        for i, tt in enumerate(shots): place(b, gunshot(0.45 if i % 2 else 0.38), tt); place(b, ricochet(), tt + 0.12)
    elif si == 4:
        b += wind(TT, 0.06); place(b, boom(0.1), 1.2); place(b, boom(0.08), 7.5)
    elif si == 7:
        b += wind(TT, 0.07)
        g3e = vt('g3') + starts['g3'][1]
        ev = {'reply': round(g3e + 0.4, 3), 'stamp': round(g3e + 1.95, 3)}
        place(b, ding(0.18), vt('e2', -0.2)); place(b, ding(0.18), vt('g3', -0.15)); place(b, ding(0.18), ev['reply'])
        place(b, stamp(0.7), ev['stamp'])
    save(b, f'audio/x{si + 1}.wav')
    info[si] = {'len': round(T, 3), 'lines': starts, 'ev': ev}
    print(si, info[si])
json.dump(info, open('audio/timing.json', 'w'), ensure_ascii=False, indent=1)
json.dump([x['len'] for x in info], open('voice.json', 'w'))
print('total', round(sum(x['len'] + 0.7 for x in info) + 0.3, 2))
