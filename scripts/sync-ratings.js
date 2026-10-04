// scripts/sync-ratings.js
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const WORKER_URL = 'https://qimochi-api.bimaakbar.workers.dev';
const OUTPUT = 'public/api/v1/ratings.json';

async function main() {
  console.log(`Fetching ${WORKER_URL}/api/v1/ratings...`);

  const res = await fetch(`${WORKER_URL}/api/v1/ratings`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  const output = {
    data: json.data ?? {},
    meta: {
      total: json.total ?? 0,
      generatedAt: new Date().toISOString(),
    },
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(
    OUTPUT,
    JSON.stringify(output, null, 2) + '\n',
    'utf8'
  );

  console.log(`✅ Wrote ${output.meta.total} entries to ${OUTPUT}`);
}

main().catch((err) => {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
});