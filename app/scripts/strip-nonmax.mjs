// Remove all [data-theme="..."] scoped rules from globals.css,
// leaving only the maximalist base theme.
import fs from 'node:fs';

const FILE = new URL('../app/globals.css', import.meta.url);
let css = fs.readFileSync(FILE, 'utf8');

// 1) Drop standalone theme-variable blocks (non-maximalist palettes).
for (const t of ['claude', 'glass', 'paper', 'dark', 'neon']) {
  css = css.replace(new RegExp(`\\[data-theme="${t}"\\]\\s*\\{[^}]*\\}\\s*`, 'g'), '');
}

// 2) Remove [data-theme="..."] selector prefixes from compound selectors.
//    e.g. `[data-theme="dark"] .blog-excerpt,[data-theme="neon"] .blog-excerpt { ... }`
//    -> remove the whole rule when every selector in the group is theme-scoped.
const rules = [];
let i = 0;
const n = css.length;
while (i < n) {
  while (i < n && /\s/.test(css[i])) i++;
  if (i >= n) break;
  if (css[i] === '/' && css[i + 1] === '*') {
    let e = css.indexOf('*/', i + 2);
    e = e === -1 ? n : e + 2;
    rules.push({ selector: null, body: css.slice(i, e) });
    i = e;
    continue;
  }
  let start = i, selEnd = -1, ended = false;
  while (i < n) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e === -1 ? n : e + 2; continue; }
    if (ch === '{') { selEnd = i; break; }
    if (ch === ';') { ended = true; i++; break; }
    i++;
  }
  if (selEnd === -1) {
    // statement (@import, etc.) or trailing text without a block
    rules.push({ selector: css.slice(start, ended ? i : i + 1), body: '', raw: true });
    continue;
  }
  const selector = css.slice(start, selEnd);
  let j = selEnd, depth = 0;
  while (j < n) {
    const ch = css[j];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { j++; break; } }
    j++;
  }
  rules.push({ selector, body: css.slice(selEnd, j) });
  i = j;
}

const out = [];
for (const r of rules) {
  if (r.selector === null || r.raw) { out.push((r.selector || '') + r.body); continue; }
  if (!/\[data-theme=/.test(r.selector)) { out.push(r.selector + r.body); continue; }
  const parts = r.selector.split(',').map(s => s.trim()).filter(Boolean);
  const nonTheme = parts.filter(p => !/\[data-theme=/.test(p));
  if (nonTheme.length > 0) out.push(nonTheme.join(', ') + r.body);
}

css = out.map(s => s.trim()).join('\n\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
fs.writeFileSync(FILE, css);
const remaining = (css.match(/data-theme/g) || []).length;
console.log('lines =', css.split('\n').length, '| data-theme refs =', remaining);
