// Renders branded Unify Organica packshots (1600x1600 JPG) from catalog/products.json
// Usage (from repo root, needs Playwright + Chromium): node shopify/catalog/render-packshots.cjs
// Optional transparent banner cut-outs: CUTS=handle1,handle2 CUT_OUT=shopify/unify-organica-theme/assets node shopify/catalog/render-packshots.cjs
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog/products.json'), 'utf8'));
const OUT = path.join(ROOT, 'catalog/images'); fs.mkdirSync(OUT, { recursive: true });

// palette per product line: pack body, label, accent, bg tint, cap
const L = {
  oil:{body:'#9a5419',glass:true,label:'#f8f1e4',accent:'#9a5a1e',bg:'#f6ead8',cap:'#1d1d1d',collar:'#c9a24e'},
  serum:{body:'#c79a4a',glass:true,label:'#fbf6ec',accent:'#9b7430',bg:'#f7efdf',cap:'#1d1d1d',collar:'#d8b968'},
  beard:{body:'#3b2618',glass:true,label:'#1d1d1d',ink:'#e2c27a',accent:'#e2c27a',bg:'#ece5dc',cap:'#1d1d1d',collar:'#c9a24e'},
  shampoo:{body:'#5d8466',label:'#f8f4ea',accent:'#3f6b4b',bg:'#e7efe6',cap:'#26302b'},
  shampoo2:{body:'#7fb3a6',label:'#f8f4ea',accent:'#2f7a6c',bg:'#e3f1ee',cap:'#26302b'},
  shampoo3:{body:'#7b3f55',label:'#f8f4ea',accent:'#7b3f55',bg:'#f2e6ea',cap:'#26302b'},
  conditioner:{body:'#d9c49a',label:'#fbf7ee',accent:'#3f6b4b',bg:'#efeadf',cap:'#3f6b4b'},
  mask:{body:'#f0e2bf',label:'#fffaf0',accent:'#a4782a',bg:'#f6efdc',cap:'#3f6b4b'},
  bodywash:{body:'#c4826c',label:'#fbf5ee',accent:'#9a4f3a',bg:'#f6e6df',cap:'#26302b'},
  bodywash2:{body:'#df9a3c',label:'#fbf5ee',accent:'#a85d14',bg:'#f8ecd9',cap:'#26302b'},
  rose:{body:'#e6aab0',label:'#fff8f6',accent:'#b04c5a',bg:'#f9e9ea',cap:'#26302b'},
  charcoal:{body:'#2b2b2b',label:'#f2f2f0',accent:'#2b2b2b',bg:'#e6e7e6',cap:'#2b2b2b'},
  lotion:{body:'#efe1c9',label:'#fffaf2',accent:'#7a5232',bg:'#f3ebde',cap:'#7a5232'},
  coffee:{body:'#4a2f22',label:'#f6efe6',accent:'#4a2f22',bg:'#ece2d8',cap:'#c9a24e'},
  lip:{body:'#a83a52',label:'#fff6f6',accent:'#a83a52',bg:'#f6e3e8',cap:'#a83a52'},
  handwash:{body:'#6fa59a',label:'#f7f6ef',accent:'#2f7a6c',bg:'#e2efec',cap:'#26302b'},
  lavender:{body:'#9d8fc4',label:'#f9f7fd',accent:'#5e4f94',bg:'#ece9f5',cap:'#26302b'},
  lemongrass:{body:'#b9c95a',label:'#fbfbef',accent:'#5f7a1c',bg:'#f1f4df',cap:'#26302b'},
  shea:{body:'#f1e5cf',label:'#fffaf1',accent:'#8a6435',bg:'#f4ecdc',cap:'#2f5040'},
  peppermint:{body:'#cfe8de',label:'#fbfffd',accent:'#2f7a6c',bg:'#e3f2ec',cap:'#2f7a6c'},
  rosecream:{body:'#f5d6d6',label:'#fffafa',accent:'#b04c5a',bg:'#f9eaea',cap:'#b04c5a'},
  saffron:{body:'#f2cf86',label:'#fffaf0',accent:'#b0631a',bg:'#f8eedb',cap:'#7a2f1a'},
  goatmilk:{body:'#cfae82',label:'#fbf6ec',accent:'#8a6435',bg:'#f3ebde',cap:'#cfae82'},
  neem:{body:'#cfae82',label:'#e9f1e3',accent:'#3f6b4b',bg:'#e9efe3',cap:'#cfae82'},
  charcoalsoap:{body:'#cfae82',label:'#2b2b2b',ink:'#f2f2f0',accent:'#2b2b2b',bg:'#e6e7e6',cap:'#cfae82'},
  gift:{body:'#2f5040',label:'#fbf7ef',accent:'#2f5040',bg:'#e7eee9',cap:'#c9a24e'},
  gift2:{body:'#9a5419',label:'#fbf7ef',accent:'#9a5419',bg:'#f6ead8',cap:'#c9a24e'},
  gift3:{body:'#6fa59a',label:'#fbf7ef',accent:'#2f7a6c',bg:'#e2efec',cap:'#c9a24e'}
};
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur); return lines;
}
function leafMark(cx, cy, r, c, bg) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${r*0.09}"/>
  <path d="M${cx} ${cy+r*0.55} C${cx-r*0.55} ${cy+r*0.1} ${cx-r*0.35} ${cy-r*0.45} ${cx} ${cy-r*0.6} C${cx+r*0.35} ${cy-r*0.45} ${cx+r*0.55} ${cy+r*0.1} ${cx} ${cy+r*0.55} Z" fill="${c}"/>
  <path d="M${cx} ${cy+r*0.5} L${cx} ${cy-r*0.35}" stroke="${bg}" stroke-width="${r*0.07}"/>`;
}
// Label block. compact = short labels (jars, soap band)
function label(x, y, w, h, p, c, opts = {}) {
  const ink = c.ink || '#1f2a22', acc = c.ink ? c.ink : c.accent;
  const cx = x + w / 2; let out = `<g>`;
  if (!opts.noBg) out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.rx ?? 10}" fill="${c.label}"/>`;
  const compact = opts.compact ?? h < 270; const band = h >= 270;
  let yy = y + (compact ? 34 : 46);
  out += leafMark(cx, yy, compact ? 15 : 19, acc, c.label); yy += compact ? 36 : 46;
  out += `<text x="${cx}" y="${yy}" text-anchor="middle" font-family="Poppins" font-weight="500" font-size="${compact?12:14}" letter-spacing="${compact?4:5}" fill="${acc}">UNIFY ORGANICA</text>`;
  yy += compact ? 14 : 18;
  out += `<line x1="${cx-w*0.28}" x2="${cx+w*0.28}" y1="${yy}" y2="${yy}" stroke="${acc}" stroke-opacity=".45" stroke-width="1.2"/>`;
  const maxChars = Math.max(9, Math.floor(w / 17));
  const name = wrap(p.title, maxChars);
  const longest = Math.max(...name.map(s => s.length));
  const fs = Math.min(compact ? 30 : 36, (w * 0.86) / (longest * 0.5));
  yy += fs + (compact ? 8 : 14);
  for (const ln of name) { out += `<text x="${cx}" y="${yy}" text-anchor="middle" font-family="Playfair Display" font-weight="600" font-size="${fs.toFixed(1)}" fill="${ink}">${esc(ln)}</text>`; yy += fs * 1.12; }
  yy += compact ? 2 : 8;
  out += `<text x="${cx}" y="${yy}" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="${compact?11:12.5}" letter-spacing="2.5" fill="${acc}">${esc(p.desc.toUpperCase())}</text>`;
  if (!compact) {
    yy += 30;
    for (const ln of wrap(p.ing, Math.floor(w / 8.2)).slice(0, 3)) { out += `<text x="${cx}" y="${yy}" text-anchor="middle" font-family="Poppins" font-style="italic" font-size="13" fill="${ink}" fill-opacity=".75">${esc(ln)}</text>`; yy += 18; }
  }
  const size = p.variants[0][0] === 'Default Title' ? 'GIFT EDITION' : p.variants[0][0].replace(' Refill','').toUpperCase();
  const by = y + h - (band ? 58 : 30);
  out += `<text x="${cx}" y="${by}" text-anchor="middle" font-family="Poppins" font-weight="500" font-size="${compact?12:14}" letter-spacing="2" fill="${ink}">${esc(size)}</text>`;
  if (band) {
    out += `<rect x="${x}" y="${y+h-40}" width="${w}" height="40" fill="${acc}" ${opts.rx===0?'':`rx="0"`}/>`;
    out += `<text x="${cx}" y="${y+h-15}" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="11" letter-spacing="2.2" fill="${c.ink ? '#1d1d1d' : '#fff'}">ORGANIC · HALAL · CRUELTY FREE</text>`;
  }
  return out + `</g>`;
}
const shine = `<linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".14" stop-color="#fff" stop-opacity=".35"/><stop offset=".26" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`;
function pack(p) {
  const c = L[p.line]; let g = '';
  switch (p.pack) {
    case 'dropper':
      g += `<rect x="452" y="150" width="96" height="150" rx="44" fill="${c.cap}"/>
        <rect x="425" y="290" width="150" height="60" rx="8" fill="${c.collar}"/><rect x="425" y="290" width="150" height="60" rx="8" fill="url(#sh)"/>
        <rect x="455" y="345" width="90" height="30" fill="${c.body}"/>
        <rect x="330" y="370" width="340" height="510" rx="52" fill="${c.body}"/><rect x="330" y="370" width="340" height="510" rx="52" fill="url(#sh)"/>
        <rect x="330" y="370" width="340" height="510" rx="52" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="3"/>`;
      g += label(358, 452, 284, 400, p, c, { rx: 6 }); break;
    case 'pump':
      g += `<rect x="478" y="140" width="190" height="44" rx="16" fill="${c.cap}"/><rect x="640" y="150" width="56" height="20" rx="8" fill="${c.cap}"/>
        <rect x="484" y="175" width="32" height="90" fill="${c.cap}"/><rect x="430" y="250" width="140" height="70" rx="12" fill="${c.cap}"/>
        <rect x="430" y="250" width="140" height="70" rx="12" fill="url(#sh)" opacity=".7"/>
        <rect x="455" y="310" width="90" height="40" fill="${c.body}"/>
        <rect x="320" y="340" width="360" height="540" rx="56" fill="${c.body}"/><rect x="320" y="340" width="360" height="540" rx="56" fill="url(#sh)"/>`;
      g += label(345, 440, 310, 400, p, c, { rx: 8 }); break;
    case 'tube':
      g += `<path d="M300 180 H700 L652 742 H348 Z" fill="${c.body}"/><path d="M300 180 H700 L652 742 H348 Z" fill="url(#sh)"/>
        <rect x="290" y="160" width="420" height="34" rx="4" fill="${c.body}"/>
        <path d="M296 176 H704" stroke="#000" stroke-opacity=".15" stroke-width="3" stroke-dasharray="6 7"/>
        <rect x="368" y="736" width="264" height="144" rx="18" fill="${c.cap}"/><rect x="368" y="736" width="264" height="144" rx="18" fill="url(#sh)"/>`;
      g += label(352, 250, 296, 440, p, c, { noBg: true }); break;
    case 'jar': case 'pot': {
      const s = p.pack === 'pot' ? 0.75 : 1; const ox = 500 - 230*s, top = 880 - 400*s;
      g += `<g transform="translate(${ox} ${top}) scale(${s})">
        <rect x="10" y="0" width="440" height="100" rx="18" fill="${c.cap}"/><rect x="10" y="0" width="440" height="100" rx="18" fill="url(#sh)"/>
        <rect x="0" y="90" width="460" height="310" rx="44" fill="${c.body}"/><rect x="0" y="90" width="460" height="310" rx="44" fill="url(#sh)"/>
        ${label(50, 130, 360, 240, p, c, { rx: 8 })}</g>`; break; }
    case 'soap':
      g += `<path d="M250 600 L330 540 H770 L690 600 Z" fill="${c.body}" filter="brightness(1.1)"/><path d="M250 600 L330 540 H770 L690 600 Z" fill="#fff" fill-opacity=".18"/>
        <path d="M690 600 L770 540 V820 L690 880 Z" fill="${c.body}"/><path d="M690 600 L770 540 V820 L690 880 Z" fill="#000" fill-opacity=".18"/>
        <rect x="250" y="600" width="440" height="280" fill="${c.body}"/>
        <path d="M330 600 L410 540 H690 L610 600 Z" fill="${c.label}" opacity=".9"/><path d="M690 600 L770 540 V820 L690 880 Z" fill="none"/>`;
      g += label(330, 600, 280, 280, p, c, { rx: 0, compact: true });
      break;
    case 'box':
      g += `<rect x="230" y="420" width="540" height="460" rx="10" fill="${c.body}"/><rect x="230" y="420" width="540" height="460" rx="10" fill="url(#sh)"/>
        <rect x="214" y="380" width="572" height="86" rx="10" fill="${c.body}"/><rect x="214" y="380" width="572" height="86" rx="10" fill="#fff" fill-opacity=".08"/>
        <rect x="484" y="380" width="32" height="500" fill="${c.cap}"/>
        <path d="M500 382 C450 300 360 310 382 360 C396 392 470 388 500 382 C530 388 604 392 618 360 C640 310 550 300 500 382 Z" fill="none" stroke="${c.cap}" stroke-width="16"/>`;
      g += label(300, 520, 400, 330, p, c, { rx: 6 }); break;
  }
  return g;
}
function leaves(c) {
  const leaf = (x, y, r, s, o) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" opacity="${o}"><path d="M0 0 C-60 -60 -40 -170 0 -230 C40 -170 60 -60 0 0 Z" fill="${c.accent}"/><path d="M0 -8 L0 -210" stroke="${c.bg}" stroke-width="5"/></g>`;
  return leaf(190, 820, -28, 1.3, .16) + leaf(130, 860, -58, 0.9, .12) + leaf(820, 830, 30, 1.2, .14) + leaf(880, 870, 62, 0.8, .1);
}
function svg(p, cut) {
  const c = L[p.line];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>${shine}<radialGradient id="bg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${c.bg}"/></radialGradient>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
  ${cut ? '' : '<rect width="1000" height="1000" fill="url(#bg)"/>' + leaves(c)}
  <ellipse cx="500" cy="884" rx="${p.pack==='box'||p.pack==='soap'?300:220}" ry="22" fill="#000" opacity=".16" filter="url(#soft)"/>
  ${pack(p)}
  </svg>`;
}
(async () => {
  const html = `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet"><style>body{margin:0}.p{width:1000px;height:1000px}</style></head><body>${products.map(p => `<div class="p" id="${p.handle}">${svg(p)}</div>`).join('')}</body></html>`;
  fs.writeFileSync(path.join(OUT, '_sheet.html'), html);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1.6 });
  await pg.goto('file://' + path.join(OUT, '_sheet.html'), { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  const fam = await pg.evaluate(() => [document.fonts.check('600 20px "Playfair Display"'), document.fonts.check('500 20px Poppins')]); console.log('fonts', fam);
  for (const p of products) await pg.locator('#' + p.handle).screenshot({ path: path.join(OUT, p.handle + '.jpg'), type: 'jpeg', quality: 86 });
  const CUT = (process.env.CUTS || '').split(',').filter(Boolean);
  if (CUT.length) {
    const cutHtml = html.replace(/<body>[\s\S]*<\/body>/, '<body style="background:transparent">' + products.filter(p => CUT.includes(p.handle)).map(p => `<div class="p" id="${p.handle}">${svg(p, true)}</div>`).join('') + '</body>');
    fs.writeFileSync(path.join(OUT, '_cut.html'), cutHtml);
    const pc = await b.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1.1 });
    await pc.goto('file://' + path.join(OUT, '_cut.html'), { waitUntil: 'networkidle' }); await pc.evaluate(() => document.fonts.ready);
    for (const h of CUT) await pc.locator('#' + h).screenshot({ path: path.join(process.env.CUT_OUT, 'cut-' + h + '.png'), omitBackground: true });
    fs.unlinkSync(path.join(OUT, '_cut.html'));
  }
  await b.close(); fs.unlinkSync(path.join(OUT, '_sheet.html')); console.log('done', products.length);
})();
