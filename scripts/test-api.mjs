// scripts/test-api.mjs
// Smoke test semua endpoint /api/v1/*.
// Pemakaian:
//   node scripts/test-api.mjs
//   BASE_URL=http://localhost:4321 node scripts/test-api.mjs

const BASE_URL = process.env.BASE_URL ?? 'https://yukionime.pages.dev';
const API = `${BASE_URL}/api/v1`;
const ROOT_URL = `${BASE_URL}/api/v1.json`;

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

  const isArray = Array.isArray(body.data);
  if (kind === 'array' && !isArray) {
    return `.data harus array, dapat ${typeof body.data}`;
  }
  if (kind === 'object' && isArray) {
    return `.data harus object, dapat array`;
  }

  const m = body.meta;
  if (!m || typeof m !== 'object') return 'tidak ada .meta';
  if (m.version !== 'v1') return `meta.version harus "v1", dapat "${m.version}"`;
  if (typeof m.total !== 'number') return 'meta.total harus number';
  if (!isIso(m.generatedAt)) return 'meta.generatedAt bukan ISO 8601';

  const expectedTotal = isArray ? body.data.length : 1;
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

async function testDetailAnimeExists() {
  // Ambil 1 ID dari /anime.json, lalu test detail endpoint
  try {
    const idx = await fetch(`${API}/anime.json`).then((r) => r.json());
    if (!Array.isArray(idx.data) || idx.data.length === 0) {
      fail(`/anime/[id].json — tidak bisa ambil sample ID`);
      return;
    }

    const sample = idx.data[0].id;
    const res = await fetch(`${API}/anime/${sample}.json`);
    if (res.status !== 200) {
      fail(`/anime/${sample}.json — HTTP ${res.status}`);
      return;
    }

    const body = await res.json();
    const err = validateEnvelope(body, 'object');
    if (err) {
      fail(`/anime/${sample}.json — ${err}`);
      return;
    }

    if (body.data.id !== sample) {
      fail(`/anime/${sample}.json — .data.id tidak cocok`);
      return;
    }

    ok(`/anime/${sample}.json — OK`);
  } catch (err) {
    fail(`/anime/[id].json — fetch error: ${err.message}`);
  }
}

async function testCorsHeaders() {
  // Cek header CORS di response GET (bukan preflight, karena SSG tidak support OPTIONS)
  try {
    const res = await fetch(`${API}/anime.json`, {
      headers: { 'Origin': 'https://example.com' },
    });
    const allow = res.headers.get('access-control-allow-origin');
    if (allow !== '*') {
      fail(`CORS header GET — allow-origin = "${allow}"`);
      return;
    }
    ok(`CORS header GET — OK (Allow-Origin: *)`);
  } catch (err) {
    fail(`CORS header GET — fetch error: ${err.message}`);
  }
}

async function main() {
  console.log(`\n🔍 Testing ${BASE_URL}\n`);

  await testRoot();

  for (const t of TESTS) {
    await testEndpoint(t);
  }

  await testDetailAnimeExists();
  await testCorsHeaders();

  console.log(`\n📊 Hasil: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});