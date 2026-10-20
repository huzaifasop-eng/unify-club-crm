"""Cut the placeholder photography out of the approved homepage mockup.

Usage: python3 tools/extract_mockup_images.py path/to/mockup.webp
Writes JPEG/PNG files to assets/img/. Replace them with real shoot photos before launch;
these are upscaled from a 941px-wide mockup, so they are soft on large screens.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

SRC = Image.open(sys.argv[1]).convert('RGB')
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'img'
OUT.mkdir(parents=True, exist_ok=True)

COLS = [(54, 185), (196, 326), (337, 466), (478, 607), (619, 748), (760, 888)]


def heal(img, box, dy):
    """Cover a baked-in UI element (heart, badge) with the patch dy pixels below it, feathered."""
    x0, y0, x1, y1 = box
    patch = img.crop((x0, y0 + dy, x1, y1 + dy))
    mask = Image.new('L', img.size, 0)
    mask.paste(255, (x0 + 1, y0 + 1, x1 - 1, y1 - 1))
    mask = mask.filter(ImageFilter.GaussianBlur(1.5))
    layer = img.copy()
    layer.paste(patch, (x0, y0))
    return Image.composite(layer, img, mask)


def up(img, scale, sharpen=70):
    w, h = img.size
    img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    return img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=sharpen, threshold=2))


def save(img, name, q=86):
    img.save(OUT / name, 'JPEG', quality=q, optimize=True, progressive=True)


def product(box, name, badge=None):
    img = SRC.crop(box)
    w, h = img.size
    img = heal(img, (w - 22, 1, w - 1, 22), 22)            # heart
    if badge:
        img = heal(img, (1, 1, badge, 17), 18)              # NEW / BESTSELLER label
    save(up(img, 3), name)


fresh = ['rose-whisper', 'plum-aura', 'ivory-bloom', 'sage-noori', 'rubi-grace', 'lilac-dreams']
best = ['mehfil', 'zarreen', 'gulbahar', 'sahar', 'noir', 'fiza']
for (x0, x1), n in zip(COLS, fresh):
    product((x0, 602, x1, 721), n + '.jpg', badge=34 if n == 'rose-whisper' else 52 if n == 'rubi-grace' else None)
for (x0, x1), n in zip(COLS, best):
    product((x0, 1015, x1, 1117), n + '.jpg')

cats = ['ready-to-wear', 'unstitched', 'formal', 'casual', 'accessories', 'sale']
for (x0, x1), n in zip([(53, 180), (195, 321), (337, 463), (478, 605), (620, 746), (761, 888)], cats):
    save(up(SRC.crop((x0, 412, x1, 499)), 3), f'cat-{n}.jpg')

save(up(SRC.crop((365, 86, 941, 342)), 2.5, 60), 'hero-modern-women.jpg', 84)
save(up(SRC.crop((0, 796, 530, 960)), 3, 60), 'festive-moments.jpg', 84)
save(up(SRC.crop((740, 796, 941, 960)), 3, 60), 'festive-arch.jpg', 84)
for i, (x0, x1) in enumerate([(293, 445), (448, 604), (607, 751), (754, 891)], 1):
    save(up(SRC.crop((x0, 1188, x1, 1317)), 3), f'look-{i}.jpg')


def unmix(box, bg, scale, name):
    """Lift artwork off a flat background into a transparent PNG."""
    img = up(SRC.crop(box), scale, 40)
    a = np.asarray(img).astype(float)
    bgc = np.array(bg, float)
    span = np.where(bgc > 127, bgc, 255 - bgc)
    alpha = np.clip((np.abs(a - bgc) / np.maximum(span, 1)).max(axis=2), 0, 1)
    alpha = np.clip((alpha - .06) / .94, 0, 1)
    fg = np.where(alpha[..., None] > 0, bgc + (a - bgc) / np.maximum(alpha[..., None], 1e-3), a)
    rgba = np.dstack([np.clip(fg, 0, 255), alpha * 255]).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(OUT / name, optimize=True)


def bg_at(x, y):
    return SRC.getpixel((x, y))


unmix((397, 27, 545, 84), bg_at(560, 40), 3, 'logo.png')
unmix((48, 1561, 148, 1624), bg_at(30, 1600), 3, 'logo-light.png')
unmix((0, 23, 80, 86), bg_at(90, 50), 3, 'floral-tl.png')
unmix((902, 23, 941, 86), bg_at(895, 80), 3, 'floral-tr.png')
unmix((0, 1484, 82, 1546), bg_at(100, 1530), 3, 'floral-bl.png')
unmix((873, 1462, 941, 1546), bg_at(860, 1530), 3, 'floral-br.png')
unmix((876, 1548, 941, 1642), bg_at(860, 1600), 3, 'floral-footer.png')
print('wrote', len(list(OUT.iterdir())), 'files to', OUT)
