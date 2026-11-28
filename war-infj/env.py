# 장면별 음성 트랙(v{i}.wav)의 1/30초 음량 → audio/env.json (입모양용)
import json, numpy as np
from scipy.io import wavfile
out = []
for i in range(1, 7):
    sr, x = wavfile.read(f'audio/v{i}.wav'); x = x.astype(np.float32)
    if x.ndim > 1: x = x.mean(1)
    x /= (np.abs(x).max() + 1e-9); hop = sr // 30
    r = np.array([np.sqrt(np.mean(x[k:k + hop] ** 2)) for k in range(0, len(x), hop)])
    r = np.clip(r / (np.percentile(r[r > 0.01], 90) + 1e-9), 0, 1)
    out.append([round(float(v), 2) for v in r])
json.dump(out, open('audio/env.json', 'w'))
print([len(o) for o in out])
