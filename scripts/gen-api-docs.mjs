import { readFile, writeFile } from 'node:fs/promises';

const README = 'README.md';
const START = '<!-- API-DOCS:START -->';
const END = '<!-- API-DOCS:END -->';

const BASE_URL = 'https://yukionime.pages.dev/api/v1';

const ENDPOINTS = [
  { path: '/',                    desc: 'Root — daftar semua endpoint' },
  { path: '/anime.json',          desc: 'Index ringkas semua anime (list & filter)' },
  { path: '/anime/[id].json',     desc: 'Detail lengkap 1 anime berdasarkan slug' },
  { path: '/anime-full.json',     desc: 'Snapshot semua anime + detail lengkap (1 file)' },
  { path: '/genres.json',         desc: 'Semua genre + jumlah anime' },
  { path: '/studios.json',        desc: 'Semua studio + jumlah anime' },
  { path: '/franchises.json',     desc: 'Relasi franchise antar anime' },
  { path: '/stats.json',          desc: 'Statistik agregat database' },
  { path: '/meta.json',           desc: 'Metadata API (versi, license, changelog)' },
];

function buildSection() {
  const table = ENDPOINTS
    .map((e) => `| \`GET ${e.path}\` | ${e.desc} |`)
    .join('\n');

  return `## Untuk Developer

### Base URL

`${BASE_URL}`

Tidak perlu API key. CORS terbuka. Rate limit tidak ditegakkan.

### Endpoint

| Endpoint | Deskripsi |
|----------|-----------|
${table}

### Contoh: Index Anime

```bash
curl ${BASE_URL}/anime.json
```

```json
{
  "data": [
    {
      "id": "kimetsu-no-yaiba",
      "title": "Kimetsu no Yaiba",
      "titleEnglish": "Demon Slayer: Kimetsu no Yaiba",
      "titleNative": "鬼滅の刃",
      "image": "https://...",
      "type": "TV",
      "status": "finished",
      "season": "spring",
      "year": 2019,
      "episodes": 26,
      "duration": 23,
      "rating": "R",
      "genres": ["action", "fantasy", "historical", "shounen"],
      "studios": ["ufotable"],
      "stats": { "score": 8.4, "scoredBy": 1542300 }
    }
  ],
  "meta": {
    "version": "v1",
    "total": 80,
    "generatedAt": "2026-10-08T12:00:00.000Z"
  }
}
```

### Contoh: Detail Anime

```bash
curl ${BASE_URL}/anime/kimetsu-no-yaiba.json
```

Detail berisi semua field index + tambahan: \`externalIds\`, \`aired\`,
\`franchises\`, \`banner\`, \`trailer\`, \`episodeList\`, \`characters\`,
dan \`studios\` dalam bentuk objek \`{ slug, name }\`.

### Format Response

**Sukses:**

```json
{
  "data": "…",
  "meta": {
    "version": "v1",
    "total": 123,
    "generatedAt": "2026-10-08T12:00:00.000Z"
  }
}
```

**Error:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Anime 'xyz' not found",
    "status": 404
  }
}
```

### Aturan

- ✅ Open — tidak perlu API key
- ✅ CORS enabled — bebas dari domain apapun
- ✅ Cache 5 menit di edge (snapshot: 1 jam)
- ⚠️ Tidak ada SLA — gunakan dengan bijak
- 📜 Data: CC BY 4.0 (lihat \`LICENSE-DATA\`)

### License

Data: **CC BY 4.0**. Atribusi minimal:

```
Data dari Yukionime (https://yukionime.pages.dev)
Lisensi: CC BY 4.0
```
`;
}

async function main() {
  const readme = await readFile(README, 'utf8');

  const startIdx = readme.indexOf(START);
  const endIdx = readme.indexOf(END);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.error(`❌ Marker tidak ditemukan di ${README}.`);
    console.error(`   Pastikan ada: ${START} ... ${END}`);
    process.exit(1);
  }

  const before = readme.slice(0, startIdx + START.length);
  const after = readme.slice(endIdx);

  const generated = `\n\n${buildSection()}\n`;

  const output = before + generated + after;

  if (output === readme) {
    console.log('✅ README sudah up-to-date, tidak ada perubahan.');
    return;
  }

  await writeFile(README, output, 'utf8');
  console.log('✅ README.md section API diperbarui.');
}

main().catch((err) => {
  console.error('❌ Gagal:', err.message);
  process.exit(1);
});