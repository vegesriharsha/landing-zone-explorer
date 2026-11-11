// Checks the contract between content and citations:
//   - every source key cited by a page, data file or register entry exists in src/content/sources.js
//   - every page id used in a link, `explore` or `page` field exists in src/content/registry.js
//   - every source in sources.js is cited somewhere (unused sources are a warning, not a failure)
// With --urls it also fetches every source URL and reports anything that is not a 2xx or 3xx.
// Usage: node scripts/check-content.mjs [--urls]
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const listDir = (d) => fs.readdirSync(d).map((f) => `${d}/${f}`);

const sourcesText = read('src/content/sources.js');
const sources = Object.fromEntries(
  [...sourcesText.matchAll(/^\s{2}(\w+): \{[\s\S]*?url: '([^']+)'/gm)].map((m) => [m[1], m[2]]),
);
const pageIds = new Set([...read('src/content/registry.js').matchAll(/\bid: '([a-z0-9-]+)'/g)].map((m) => m[1]));

const files = [...listDir('src/content'), ...listDir('src/pages'), ...listDir('src/archetypes'), 'src/pathway.config.js'];
const problems = [];
const cited = new Set();

for (const f of files) {
  const s = read(f);
  // sources: ['a', 'b']  or  sources={['a', 'b']}
  for (const m of s.matchAll(/\bsources(?::\s*|=\{)\[([^\]]*)\]/g)) {
    for (const k of m[1].split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)) {
      cited.add(k);
      if (!sources[k]) problems.push(`${f}: unknown source key '${k}'`);
    }
  }
  // register entries: src: 'key'
  for (const m of s.matchAll(/\bsrc: '(\w+)'/g)) {
    cited.add(m[1]);
    if (!sources[m[1]]) problems.push(`${f}: unknown register source '${m[1]}'`);
  }
  // links to pages: explore: ['id'], page: 'id', href="#id", href="#id" inside template literals
  for (const m of s.matchAll(/\bexplore: \[([^\]]*)\]/g)) {
    for (const id of m[1].split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)) {
      if (!pageIds.has(id)) problems.push(`${f}: explore links to unknown page '${id}'`);
    }
  }
  for (const m of s.matchAll(/\bpage: '([a-z0-9-]+)'/g)) if (!pageIds.has(m[1])) problems.push(`${f}: page link to unknown page '${m[1]}'`);
  for (const m of s.matchAll(/href=["'`]#([a-z][a-z0-9-]*)["'`]/g)) if (!pageIds.has(m[1])) problems.push(`${f}: href to unknown page '#${m[1]}'`);
  for (const m of s.matchAll(/\['([^']+)', '([^']+)', '([a-z][a-z0-9-]*)'\],/g)) {
    // [title, text, pageId] triples used by link grids (PavedPaths)
    if (/href=\{`#\$\{id\}`\}/.test(s) && !pageIds.has(m[3])) problems.push(`${f}: link grid points at unknown page '${m[3]}'`);
  }
}

const unused = Object.keys(sources).filter((k) => !cited.has(k));

if (process.argv.includes('--urls')) {
  const results = await Promise.all(
    Object.entries(sources).map(async ([k, url]) => {
      try {
        const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'landing-zone-explorer-check' } });
        return [k, url, res.status];
      } catch (e) {
        return [k, url, e.name === 'TimeoutError' ? 'timeout' : e.message];
      }
    }),
  );
  for (const [k, url, status] of results) {
    // 429 is the site rate-limiting the checker, not a broken link.
    if (status === 429) console.log(`warning: '${k}' rate-limited (429), re-check by hand: ${url}`);
    else if (typeof status !== 'number' || status >= 400) problems.push(`sources.js: '${k}' -> ${status} ${url}`);
  }
  console.log(`fetched ${results.length} source URLs`);
}

console.log(`${Object.keys(sources).length} sources, ${pageIds.size} pages, ${cited.size} source keys cited`);
if (unused.length) console.log(`warning: ${unused.length} source(s) cited nowhere: ${unused.join(', ')}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('content check passed');
