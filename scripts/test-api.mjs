// scripts/test-api.mjs
// Smoke test semua endpoint /api/v1/*.
// Pemakaian:
//   node scripts/test-api.mjs
//   BASE_URL=http://localhost:4321 node scripts/test-api.mjs

const BASE_URL = process.env.BASE_URL ?? 'https://yukionime.pages.dev';
const API = `${BASE_URL}/api/v1`;
const ROOT_URL = `${BASE_URL}/api/v1.json`;

// Test endpoint di dalam folder /api/v1/
const TESTS = [
  { path: '/anime.json',      kind: 'array' },
  { path: '/anime-full.json', kind: 'array' },
  { path: '/genres.json',     kind: 'array' },
  { path: '/studios.json',    kind: 'array' },
  { path: '/franchises.json', kind: 'array' },
  { path: '/stats.json',      kind: 'object' },
  { path: '/meta.json',       kind: 'object' },
];

let passed = 0;
let failed = 0;

function ok(msg)   { console.log(`✅ ${msg}`); passed++; }
function fail(msg) { console.log(`❌ ${msg}`); failed++; }

function isIso(s) {
  return typeof s === 'string' && !isNaN(Date.parse(s));
}

function validateEnvelope(body, kind) {
  if (body.error) return 'response berisi .error';
  if (!('data' in body)) return 'tidak ada field .data';
  if (typeof body.data !== kind) {
    return `.data harus ${kind}, dapat ${typeof body.data}`;
  }

  const m = body.meta;
  if (!m || typeof m !== 'object') return 'tidak ada .meta';
  if (m.version !== 'v1') return `meta.version harus "v1", dapat "${m.version}"`;
  if (typeof m.total !== 'number') return 'meta.total harus number';
  if (!isIso(m.generatedAt)) return 'meta.generatedAt bukan ISO 8601';

  const expectedTotal = Array.isArray(body.data) ? body.data.length : 1;
  if (m.total !== expectedTotal) {
    return `meta.total (${m.total}) ≠ panjang data (${expectedTotal})`;
  }

  return null;
}

async function testEndpoint({ path, kind }) {
  const url = `${API}${path}`;
  let res;

  try {
    res = await fetch(url);
  } catch (err) {
    fail(`${path} — fetch error: ${err.message}`);
    return;
  }

  if (res.status !== 200) {
    fail(`${path} — HTTP ${res.status}`);
    return;
  }

  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    fail(`${path} — content-type bukan JSON: ${ct}`);
    return;
  }

  let body;
  try {
    body = await res.json();
  } catch {
    fail(`${path} — body bukan JSON valid`);
    return;
  }

  const err = validateEnvelope(body, kind);
  if (err) {
    fail(`${path} — ${err}`);
    return;
  }

  ok(`${path} — ${body.meta.total} item`);
}

async function testRoot() {
  let res;
  try {
    res = await fetch(ROOT_URL);
  } catch (err) {
    fail(`/api/v1.json — fetch error: ${err.message}`);
    return;
  }

  if (res.status !== 200) {
    fail(`/api/v1.json — HTTP ${res.status}`);
    return;
  }

  let body;
  try {
    body = await res.json();
  } catch {
    fail(`/api/v1.json — body bukan JSON valid`);
    return;
  }

  const err = validateEnvelope(body, 'object');
  if (err) {
    fail(`/api/v1.json — ${err}`);
    return;
  }

  if (!Array.isArray(body.data.endpoints) || body.data.endpoints.length === 0) {
    fail(`/api/v1.json — .data.endpoints harus array tidak kosong`);
    return;
  }

  ok(`/api/v1.json — ${body.data.endpoints.length} endpoint terdaftar`);
}

async function testNotFound() {
  const url = `${API}/anime/__does_not_exist__.json`;
  try {
    const res = await fetch(url);
    if (res.status !== 404) {
      fail(`/anime/[id].json 404 — dapat HTTP ${res.status}`);
      return;
    }
    const body = await res.json();
    if (!body.error || body.error.code !== 'NOT_FOUND') {
      fail(`/anime/[id].json 404 — format .error salah`);
      return;
    }
    ok(`/anime/[id].json — error format OK (404)`);
  } catch (err) {
    fail(`/anime/[id].json — fetch error: ${err.message}`);
  }
}

async function testCors() {
  const url = `${API}/anime.json`;
  try {
    const res = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'GET',
      },
    });
    if (res.status !== 204 && res.status !== 200) {
      fail(`CORS preflight — HTTP ${res.status}`);
      return;
    }
    const allow = res.headers.get('access-control-allow-origin');
    if (allow !== '*') {
      fail(`CORS preflight — allow-origin = "${allow}"`);
      return;
    }
    ok(`CORS preflight — OK`);
  } catch (err) {
    fail(`CORS preflight — fetch error: ${err.message}`);
  }
}

async function main() {
  console.log(`\n🔍 Testing ${BASE_URL}\n`);

  await testRoot();

  for (const t of TESTS) {
    await testEndpoint(t);
  }

  await testNotFound();
  await testCors();

  console.log(`\n📊 Hasil: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});