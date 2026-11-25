import cv2, numpy as np, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
from bub import detect

W, H, FPS = 1080, 1920, 30
FONTS = {'x': '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', 'b': '/usr/share/fonts/opentype/inter/Inter-Black.otf',
         'cjk': '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'}
_fc = {}
def F(s, k='x'):
    s = int(s)
    if (s, k) not in _fc: _fc[(s, k)] = ImageFont.truetype(FONTS[k], s, index=1) if k == 'cjk' else ImageFont.truetype(FONTS[k], s)
    return _fc[(s, k)]
def tw(t, s):
    b = F(s).getbbox(t); return b[2] - b[0]

DARK_OUT = (36, 34, 48)

# ---------- 텍스트 ----------
SUBS = [  # (t0, t1, speaker, text)
    (0.20, 2.30, None, 'If everyone was INFP…'),
    (2.30, 4.25, None, 'and a war broke out?'),
    (4.35, 5.80, 'sol', 'Sir… um…'),
    (5.80, 8.40, 'sol', '…can I shoot?'),
    (8.40, 12.30, 'cap', 'Hmm… I mean… maybe you could… shoot…?'),
    (12.30, 13.57, 'think', '(If I shoot him…)'),
    (13.57, 15.83, 'think', '(his family will be so sad…)'),
    (15.83, 17.33, 'think', '(his kid grows up…)'),
    (17.33, 19.50, 'think', '(and comes back for revenge…)'),
    (19.50, 22.30, 'sol', '…I can\'t do it, sir T_T'),
    (22.30, 25.10, 'cap', '…Then should we write them a letter?'),
    (27.70, 31.50, 'esol', 'Sir… can we shoot…?'),
    (32.30, 33.85, 'esol', 'Sir… from over there…'),
    (33.85, 36.10, 'esol', '…we got a letter?'),
    (36.10, 39.40, 'esol', 'How should we… reply…?'),
    (39.40, 41.72, 'ecap', 'Hmm… if it\'s too short…'),
    (41.72, 44.85, 'ecap', 'they might feel hurt…'),
    (44.85, 46.40, None, 'Year 3 of the war,'),
    (46.40, 49.10, None, 'Shots fired: 0.'),
]
SPK = {  # 라벨, 배경, 글자
    'sol': ('Soldier', (194, 238, 210), (38, 78, 56)),
    'cap': ('Captain', (255, 228, 138), (70, 50, 10)),
    'think': ('Soldier (thinking)', (254, 209, 235), (90, 40, 70)),
    'esol': ('Enemy Soldier', (221, 208, 251), (60, 45, 100)),
    'ecap': ('Enemy Captain', (254, 229, 135), (70, 50, 10)),
}
SPK_REF = {'sol': (194, 238, 210), 'cap': (255, 228, 138), 'think': (254, 209, 235),
           'esol': (221, 208, 251), 'ecap': (254, 229, 135)}

T13 = float(sys.argv[1]) if len(sys.argv) > 1 else 39.4
def chip_text(t):
    if t < 4.3: return None
    if t < 12.25: return 'Day 1 · Our Trench'
    if t < 15.7: return 'Imagining…'
    if t < 17.37: return '20 years later…'
    if t < 19.2: return 'Revenge day…'
    if t < 27.63: return 'Day 1 · Our Trench'
    if t < 36.87: return 'Day 1 · Enemy Trench'
    if t < T13: return 'Writing a reply · hour 1'
    if t < 44.8: return 'Writing a reply · hour 3'
    if t < 47.2:
        k = (t - 44.8) / (47.2 - 44.8); return f'Day {int(1 + 1094 * k * k * (3 - 2 * k))}'
    return 'Day 1095 · Year 3'

BUBBLES = [  # 이름, t0, t1, 기준색, 탐색 박스, 영어, 글자색
    ('dad', 12.3, 15.7, (236, 219, 167), (650, 850, 1000, 1100), 'Daddy!', (80, 55, 20), 22),
    ('tt1', 12.3, 17.4, (220, 239, 254), (100, 550, 520, 850), 'T_T', (40, 70, 120), 16),
    ('rev', 17.3, 19.5, (254, 138, 139), (250, 450, 900, 750), 'REVENGE!!', (255, 255, 255), 18),
    ('tt2', 19.4, 22.4, (220, 239, 254), (500, 420, 1050, 780), 'T_T', (40, 70, 120), 16),
    ('letter', 22.3, 24.8, (255, 243, 193), (80, 380, 750, 700), 'A letter?!', (70, 50, 10), 16),
    ('eletter', 31.7, 32.5, (233, 222, 252), (400, 470, 1040, 790), 'A letter…!', (70, 55, 120), 16),
    ('hmm', 36.8, 44.85, (255, 243, 193), (40, 330, 600, 640), 'Hmm…', (70, 50, 10), 16),
    ('what', 36.8, 44.85, (233, 222, 252), (350, 520, 1075, 740), 'What do I write…', (70, 55, 120), 16),
]

def pill(d, cx, cy, text, fs, bg, fg, padx, h, r=None, shadow=True, minw=0):
    w = max(tw(text, fs) + 2 * padx, minw)
    x0, y0 = cx - w / 2, cy - h / 2
    r = h / 2 if r is None else r
    if shadow: d.rounded_rectangle([x0, y0 + 6, x0 + w, y0 + h + 6], r, fill=(0, 0, 0, 28))
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], r, fill=bg)
    d.text((cx, cy), text, font=F(fs), fill=fg, anchor='mm')

def outlined(d, cx, cy, text, fs, fill, stroke, sw, k='x'):
    d.text((cx, cy), text, font=F(fs, k), fill=fill, anchor='mm', stroke_width=sw, stroke_fill=stroke)

def fit(text, fs, maxw):
    while tw(text, fs) > maxw and fs > 20: fs -= 2
    return fs

def wrap2(text, fs, maxw):
    if tw(text, fs) <= maxw: return [text]
    words = text.split(' '); best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        m = max(tw(a, fs), tw(b, fs))
        if best is None or m < best[0]: best = (m, [a, b])
    return best[1]

# ---------- 편지 카드 ----------
def make_card(header, lines, rot):
    cw, chh, m = 800, 575, 60
    im = Image.new('RGBA', (cw + 2 * m, chh + 2 * m), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([m + 4, m + 12, m + cw + 4, m + chh + 12], 26, fill=(0, 0, 0, 35))
    d.rounded_rectangle([m, m, m + cw, m + chh], 26, fill=(253, 252, 244))
    for k in range(6):
        y = m + 105 + k * 80
        if y < m + chh - 20: d.line([(m + 6, y), (m + cw - 6, y)], fill=(208, 222, 246), width=3)
    hx = m + 695; hy = m + 480
    d.text((hx, hy), '♥', font=F(80, 'cjk'), fill=(255, 125, 170), anchor='mm')
    pill(d, m + cw / 2, m - 4, header, 40, (255, 216, 77), (58, 37, 0), 26, 68, r=16, shadow=False)
    for i, ln in enumerate(lines):
        if ln: d.text((m + 62, m + 92 + i * 80), ln, font=F(50), fill=(46, 46, 74), anchor='ls')
    return im.rotate(rot, resample=Image.BICUBIC, expand=False)

CARD_LINES = ['We actually don\'t', 'want to fight…', 'Do you feel the same…?']
def typed(t, t0, t1):
    full = '\n'.join(CARD_LINES); n = int(len(full) * min(1, max(0, (t - t0) / (t1 - t0))))
    return full[:n].split('\n') + [''] * 3
_card_cache = {}
def card_img(kind, t):
    if kind == 'to':
        lines = typed(t, 24.75, 26.3)[:3]
        key = ('to', tuple(lines))
        if key not in _card_cache: _card_cache[key] = make_card('To. Dear Enemies', lines, 2.0)
    else:
        key = ('from',)
        if key not in _card_cache: _card_cache[key] = make_card('From. All of Us', CARD_LINES, -2.0)
    return _card_cache[key]

# ---------- 지우기 ----------
def textmask(roi, white_th=215, near=9, extra=None):
    Wm = (roi.min(2) > white_th)
    if extra is not None: Wm |= extra
    Dm = (roi.max(2) < 100)
    nearW = cv2.dilate(Wm.astype(np.uint8), np.ones((near * 2 + 1,) * 2, np.uint8)) > 0
    nearD = cv2.dilate(Dm.astype(np.uint8), np.ones((near * 2 + 1,) * 2, np.uint8)) > 0
    m = (Wm & nearD) | (Dm & nearW)
    return cv2.dilate(m.astype(np.uint8), np.ones((7, 7), np.uint8))

def inpaint(f, y0, y1, x0=0, x1=W, extra_fn=None, white_th=215):
    roi = f[y0:y1, x0:x1]
    ex = extra_fn(roi) if extra_fn else None
    m = textmask(roi.astype(int), white_th, extra=ex)
    if m.sum() > 0:
        f[y0:y1, x0:x1] = cv2.inpaint(roi, m, 7, cv2.INPAINT_TELEA)
    return m

def sub_at(t):
    for s in SUBS:
        if s[0] <= t < s[1]: return s
    return None

# ---------- 메인 ----------
src = sys.argv[2] if len(sys.argv) > 2 else 'src.mp4'
_b = subprocess.run(['ffmpeg', '-v', 'error', '-ss', '36.92', '-i', src, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
BGREF = np.frombuffer(_b, np.uint8).reshape(H, W, 3).astype(int)
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', ('preview.mp4' if len(sys.argv) > 3 else 'video_en.mp4')], stdin=subprocess.PIPE)
_sg = np.load('sigs.npy', allow_pickle=True).item()
SUBP = _sg['S'].reshape(len(_sg['S']), -1).mean(1) > 0.004
CHIPP = _sg['C'].reshape(len(_sg['C']), -1).mean(1) > 0.01
def near_any(arr, i, k=12): return arr[max(0, i - k):i + k + 1].any()
def sens_mask(roi):
    g = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
    med = cv2.medianBlur(g, 41).astype(int); g = g.astype(int)
    sat = roi.max(2).astype(int) - roi.min(2)
    br = ((g - med) > 16) & (sat < 50)
    dk = ((med - g) > 28) & (cv2.dilate(br.astype(np.uint8), np.ones((15, 15), np.uint8)) > 0)
    return cv2.dilate((br | dk).astype(np.uint8), np.ones((7, 7), np.uint8))
fi = 0
PLATE = None
while True:
    b = dec.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    t = fi / FPS
    if PLATE is None: PLATE = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
    if len(sys.argv) > 3 and not any(abs(t - float(x)) < 0.02 for x in sys.argv[3].split(',')):
        fi += 1; continue
    f = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
    fint = f.astype(int)

    # 감지 (지우기 전)
    sub_on = near_any(SUBP, fi, 14)
    s = sub_at(t)
    if s is None and sub_on:
        cands = [x for x in SUBS if min(abs(t - x[0]), abs(t - x[1])) < 0.6]
        s = min(cands, key=lambda x: min(abs(t - x[0]), abs(t - x[1]))) if cands else None
    if s is None: sub_on = False
    spk_on = False
    if s and s[2]:
        ref = np.array(SPK_REF[s[2]])
        spk_on = (np.abs(fint[1172:1228, 430:650] - ref).max(2) < 22).sum() > 400
    chip_dark = (fint[250:315, 150:930].max(2) < 110)
    chip_on = near_any(CHIPP, fi, 14) and not (0.15 <= t < 4.4)
    kor_chip_w = 0
    if chip_on:
        xs = np.nonzero(chip_dark.any(0))[0]; kor_chip_w = ((xs.max() - xs.min()) + 68 + 16) if len(xs) else 0
    bubs = []
    for (name, t0, t1, ref, box, txt, fg, tol) in BUBBLES:
        if t0 <= t < t1:
            bb = detect(f, np.array(ref), box, tol)
            if bb: bubs.append((bb, ref, txt, fg))
    card = None
    if 24.6 <= t < 27.7 or 32.3 <= t < 37.0:
        strip = fint[820:900, 300:780]
        frac = (strip.min(2) > 232).mean()
        a = min(1, max(0, (frac - 0.25) / 0.45))
        if t >= 36.3:
            a = min(1, max(0, 1 - (t - 36.37) / 0.5))
            f[380:1100, 100:990] = BGREF[380:1100, 100:990]
            fint = f.astype(int)
        if a > 0.02: card = ('to' if t < 30 else 'from', a)

    # 지우기
    if 0.15 <= t < 4.25:
        Y0, Y1 = 230, 885
        roi = fint[Y0:Y1]
        tm = (roi.min(2) > 215) | (np.abs(roi - np.array([201, 178, 252])).max(2) < 45) | (roi.max(2) < 110) | \
             (np.abs(roi - np.array([255, 216, 77])).max(2) < 60)
        tm = cv2.dilate(tm.astype(np.uint8), np.ones((25, 25), np.uint8))
        g0 = cv2.cvtColor(PLATE, cv2.COLOR_RGB2GRAY).astype(np.float32)
        g1 = cv2.cvtColor(f, cv2.COLOR_RGB2GRAY).astype(np.float32)
        em = np.zeros((H, W), np.uint8); em[Y0:Y1] = 1 - tm; em[:Y0] = 1
        warp = np.eye(2, 3, dtype=np.float32)
        try:
            _, warp = cv2.findTransformECC(g0, g1, warp, cv2.MOTION_AFFINE,
                                           (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 60, 1e-5), em, 5)
        except cv2.error:
            pass
        wp = cv2.warpAffine(PLATE, warp, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        a = cv2.GaussianBlur(tm.astype(np.float32), (9, 9), 0)[..., None]
        f[Y0:Y1] = (f[Y0:Y1] * (1 - a) + wp[Y0:Y1] * a).astype(np.uint8)
        bm = inpaint(f, 1095, 1240)
    else:
        bm = None
    if sub_on:
        roi = f[1240:1350, 20:1060]
        m = textmask(roi.astype(int)) | sens_mask(roi)
        if m.sum() > 0: f[1240:1350, 20:1060] = cv2.inpaint(roi, m, 7, cv2.INPAINT_TELEA)

    im = Image.fromarray(f); d = ImageDraw.Draw(im, 'RGBA')

    # 타이틀
    if 0.15 <= t < 4.25:
        pill(d, 540, 291, 'INFP × WAR', 50, (255, 216, 77), (58, 37, 0), 28, 80, r=16, shadow=False)
        outlined(d, 540, 440, 'If everyone', 112, (255, 255, 255), DARK_OUT, 9, 'b')
        outlined(d, 540, 640, 'was INFP', 178, (201, 178, 252), DARK_OUT, 11, 'b')
        if t >= 0.83: outlined(d, 540, 830, 'and a war broke out?', 88, (255, 255, 255), DARK_OUT, 8, 'b')
        if bm is not None and bm.sum() > 0:
            n, l, st, c = cv2.connectedComponentsWithStats(cv2.dilate(bm, np.ones((31, 31), np.uint8)))
            for i in range(1, n):
                if st[i, 4] > 1500:
                    outlined(d, c[i][0], 1095 + c[i][1], 'brrr', 46, (255, 255, 255), DARK_OUT, 6)

    # 칩
    ct = chip_text(t)
    if ct and chip_on and not (0.15 <= t < 4.25):
        pill(d, 540, 281, ct, 56 if tw(ct, 56) < 860 else 48, (255, 255, 255, 240), (51, 51, 51), 36, 102, minw=kor_chip_w)

    # 말풍선
    for (bb, ref, txt, fg) in bubs:
        x0, y0, x1, y1 = bb; h = y1 - y0 + 8; cx = (x0 + x1) / 2; cy = (y0 + y1) / 2
        fs = max(18, int(h * 0.5))
        w = max(x1 - x0 + 10, tw(txt, fs) + h * 0.7)
        d.rounded_rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], h / 2, fill=tuple(ref))
        d.text((cx, cy), txt, font=F(fs), fill=fg, anchor='mm')

    # 편지
    if card:
        kind, a = card
        ci = card_img(kind, t)
        if a < 1:
            ci = ci.copy(); ci.putalpha(Image.eval(ci.getchannel('A'), lambda v: int(v * a)))
        cx, cy = (533, 755) if kind == 'to' else (545, 772)
        im.alpha_composite(ci, (int(cx - ci.width / 2), int(cy - ci.height / 2))) if im.mode == 'RGBA' else None
        if im.mode != 'RGBA':
            im = im.convert('RGBA'); im.alpha_composite(ci, (int(cx - ci.width / 2), int(cy - ci.height / 2))); im = im.convert('RGB')
            d = ImageDraw.Draw(im, 'RGBA')

    # 자막 + 화자
    if s and sub_on:
        fs = 62; lines = wrap2(s[3], fs, 960)
        if len(lines) == 1:
            outlined(d, 540, 1293, lines[0], fs, (255, 255, 255), DARK_OUT, 7)
        else:
            fs = 58; lines = wrap2(s[3], fs, 900)
            if len(lines) == 1: lines = wrap2(s[3], fs, 600)
            outlined(d, 540, 1268, lines[0], fs, (255, 255, 255), DARK_OUT, 7)
            outlined(d, 540, 1345, lines[-1], fs, (255, 255, 255), DARK_OUT, 7)
    if s and s[2] and sub_on:
        lab, bg, fg = SPK[s[2]]
        pill(d, 540, 1200, lab, 34, bg, fg, 26, 64, shadow=False, minw=0)

    enc.stdin.write(np.asarray(im.convert('RGB')).tobytes())
    fi += 1
enc.stdin.close(); enc.wait()
print('frames', fi)
