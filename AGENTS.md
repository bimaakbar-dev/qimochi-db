# AGENTS.md

Panduan untuk AI agent (Cursor, Claude, Copilot, dll) yang bekerja dengan
project QimochiDB.

---

## Konteks Project

QimochiDB adalah database anime Indonesia:

- Website: Astro 7 (SSG) di Cloudflare Pages
- API: Static JSON di /api/v1/*.json
- Rating: Cloudflare Workers + D1 (repo terpisah: qimochi-api)
- Konten: Markdown files di src/content/anime/
- Bahasa UI: Indonesia (id-ID)

Prinsip:

- SSG selamanya (tidak pakai SSR)
- Konten via GitHub PR (manual, terkurasi)
- API-first (data bersih, format konsisten)
- Bukan platform streaming
- Tidak ada database user (kecuali rating)

---

## Struktur Kritis

### Content Collections

File: src/content.config.ts

3 collections:

- anime — markdown files di src/content/anime/
- genres — JSON di src/data/genres.json
- studios — JSON di src/data/studios.json

3 field WAJIB di anime:

- title — string, judul romaji
- type — TV | Movie | OVA | ONA | Special | Music | Unknown
- status — airing | finished | upcoming | hiatus | cancelled

Field penting lain:

- slug = nama file .md (tanpa .md)
- genres, studios = array slug (bukan nama)
- franchises = array object { relation, slug, title? }
- image, banner, trailer = URL/host eksternal
- characters, episodeList = array object (konten panjang)
- draft = boolean, filter di getCollection

### Route Structure

Routes:

- / — landing
- /anime/[slug]/ — detail anime
- /search/anime/ — search + filter
- /api/v1/anime.json — API index ringkas
- /api/v1/anime/[id].json — API detail lengkap
- /api/v1/genres.json — API genres
- /api/v1/studios.json — API studios
- /api/v1/stats.json — API stats
- /api/v1/index.json — API discovery

Catatan:

- Semua route anime di bawah /anime/
- Search page di /search/anime/
- TIDAK ada /anime/ (katalog) — search page fungsi sebagai katalog

### Design Tokens

File: src/styles/props.css

Prefix:

- --bg-* — base, elevated, surface, hover, primary, secondary, nav, footer
- --text-* — primary, secondary, muted, disabled, inverted
- --accent, --accent-hover, --accent-soft, --accent-text
- --gold, --success, --warning, --danger (+ .soft)
- --fs-* (font size), --fw-* (font weight), --lh-* (line height)
- --s-* (spacing: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16)
- --r-* (radius: sm, md, lg, full)
- --shadow-*, --t-* (transition), --z-*

JANGAN bikin token baru tanpa alasan kuat. Pakai yang ada.

### Breakpoints

Hanya 2:

- Mobile: < 50rem
- Desktop: >= 50rem

Container max: 72rem (desktop), 50rem (mobile).

### Class Naming

BEM-ish:

- .block
- .block__element
- .block--modifier
- .block__element--modifier

Contoh: anime-card, anime-card__title, anime-card--compact.

---

## Konvensi Kode

### Astro Components

Struktur:

- Frontmatter (---) — imports, interface Props, destructure
- Markup — HTML
- Style — scoped CSS

Aturan:

- Pakai alias ~/ (bukan ../)
- Interface Props di atas
- Scoped style default, is:global hanya kalau perlu
- Komponen self-contained (fetch sendiri, tidak boleh parent kirim data mentah)

### JavaScript (Client-side)

- Pakai // @ts-nocheck kalau perlu (dynamic DOM)
- JANGAN pakai framework (React/Vue) — vanilla JS only
- Pakai document.querySelector + event delegation
- Template clone untuk render list dinamis:
  - const tpl = document.getElementById('xxx-template')
  - const node = tpl.content.cloneNode(true)

### CSS

- Vanilla CSS (bukan SCSS/Tailwind)
- CSS variables untuk semua warna/spacing/font
- Nesting & boleh (Astro support)
- Media queries:
  - @media (min-width: 50rem) — desktop
  - @media (hover: hover) and (pointer: fine) — hover-capable

---

## Jangan Lakukan

### Jangan Bikin SSR

Tidak pakai @astrojs/cloudflare adapter. Tetap output: 'static'.

Kalau butuh dynamic (rating), buat Worker terpisah di repo lain.

### Jangan Bikin Database di Repo Ini

Data di .md dan .json saja. Untuk rating, pakai Worker + D1.

### Jangan Copy Sinopsis dari MAL

Copyright issue. SELALU tulis ulang pakai bahasa sendiri.

### Jangan Upload Gambar ke Repo

Hotlink dari CDN (MAL atau AniList). Bukan host di public/.

### Jangan Pakai Framework JS

React, Vue, Svelte — TIDAK dipakai. Astro + vanilla JS only.

### Jangan Ubah Schema Tanpa Alasan

content.config.ts = kontrak data. Kalau ubah, SEMUA .md harus kompatibel.
Test npx astro sync dan npm run build.

### Jangan Isi Field Optional dengan String Kosong

Field image, banner, trailer TIDAK boleh diisi dengan "".
Hapus field-nya kalau tidak ada.

---

## Task Pattern

### Menambah Anime Baru

1. Copy anime-template.md → src/content/anime/[slug].md
2. Isi minimal 3 field wajib (title, type, status)
3. Isi field opsional sesuai data
4. Tulis sinopsis sendiri
5. Jalankan: npx astro sync
6. Kalau perlu, tambah studio/genre ke JSON masing-masing

### Menambah Studio

Edit src/data/studios.json. Format:

- id: kebab-case-slug
- name: Display Name
- founded: 2000
- website: https://...

### Fix Bug UI

1. Cek apakah bug di scoped CSS atau JS-generated element
2. Kalau JS-generated → pakai :global() atau is:global
3. Test di mobile (< 50rem) dan desktop (>= 50rem)

### Update API

File: src/pages/api/v1/*.json.ts

Format response sukses:

- data: any
- meta: { total: number, generatedAt: ISO 8601 }

Format response error:

- error: { code: string, message: string, status: number }

---

## File yang Sudah "Stable" (Jangan Ubah Tanpa Alasan)

| File | Fungsi |
|------|--------|
| content.config.ts | Schema anime |
| src/lib/format.ts | Formatter tanggal/durasi |
| src/lib/data.ts | Counter helper |
| src/lib/pagination.ts | Pagination logic |
| src/lib/icons.ts | Icon paths |
| src/lib/dom.ts | DOM helper (cloneTemplate) |
| src/lib/api/response.ts | API response helper |
| src/constants.ts | Enum + label |
| src/styles/props.css | Design tokens |

Kalau perlu ubah, cek dulu: siapa yang pakai? Test semua halaman.

---

## File Orphan (Boleh Hapus Kalau Perlu)

| File | Status |
|------|--------|
| src/lib/search.ts | Tidak terpakai (logic di client) |
| src/lib/genre.ts | Tidak terpakai + bug |
| src/lib/anime.ts | Tidak terpakai + bug |

---

## Testing Checklist

Setelah perubahan, cek:

- npx astro sync sukses
- npm run build sukses
- Landing page (/) render benar
- Detail anime (/anime/kimetsu-no-yaiba/) render benar
- Search page (/search/anime/) filter/sort jalan
- API endpoints (/api/v1/anime.json) valid
- Mobile view (< 50rem) tidak overflow
- Rating widget di halaman detail berfungsi

---

## Debugging Tips

### Build Error "Cannot find module"

Cek import path. Pakai ~/ untuk src/. @/ tidak dipakai.

### Scoped CSS Tidak Jalan

Kalau elemen dari JS (cloneNode, innerHTML), pakai :global() atau
is:global di tag style.

### hidden Attribute Tidak Bekerja

Kalau CSS punya display: flex dll, tambah:

.selector[hidden] { display: none; }

### D1 Error di Worker

Cek binding di wrangler.toml:

- [[d1_databases]]
- binding = "DB"
- database_name = "qimochi-db"

---

## Konvensi Commit

Format:

- feat(scope): deskripsi
- fix(scope): deskripsi
- docs: deskripsi
- chore: deskripsi

Scope: anime, studio, genre, api, ui, search, dll.

Contoh:

- feat(anime): tambah Violet Evergarden
- fix(search): perbaiki filter genre tidak reset
- docs: tambah panduan kontribusi

---

## Alur Data

### Static Content (SSG)

Kontributor GitHub → PR → Review + merge → Cloudflare Pages
auto-build (~2 menit) → Deploy ke CDN → Live di production.

### Rating (Dynamic)

User klik bintang di web → POST ke Worker
(qimochi-api.bimaakbar.workers.dev) → Worker validasi + UPSERT ke D1 →
Return response ke web → JS update tampilan.

### Sync Rating ke Static (Setiap 6 Jam)

GitHub Action cron → Fetch dari Worker → Generate
public/api/v1/ratings.json → Commit + push → Cloudflare Pages rebuild.

---

## Arsitektur Singkat

User / Developer → HTTP → Cloudflare Pages (SSG static files) → Untuk
rating: Cloudflare Worker → Cloudflare D1.

---

## Komponen Sidebar (Search Page)

6 komponen sidebar: Status, Genre, Studio, Tipe, Musim, Tahun.

Pattern yang sama:

- Ambil data dari collection
- Hitung count via countByField / countByArrayField (lib/data.ts)
- Filter yang count > 0
- Render list dengan data-filter-key + data-filter-value
- JS search page yang handle klik

Kalau nambah widget sidebar baru, ikuti pattern yang sama.

---

## Rating Widget

File: src/components/AnimeRating.astro

- Bintang = progress bar visual (fill dari avg atau user vote)
- Angka = skor rata-rata komunitas (fallback MAL kalau kosong)
- Vote count = jumlah voter
- Klik bintang = submit rating via Worker
- Hover = preview fill
- State disimpan di localStorage per anime

---

## Field Franchises — Format Baru

Field franchises sekarang array object:

- relation: sequel | prequel | side_story | parent_story | alternative
  | spin_off | adaptation | character | summary | full_story
  | compilation | contains | other
- slug: slug anime target
- title: string opsional (isi kalau anime target belum ada di DB)

Tab "Franchise" di halaman detail pakai field ini untuk menampilkan grid
card anime terkait.

---

## Sync Script

File: scripts/sync-ratings.js

- Fetch dari Worker GET /api/v1/ratings
- Generate public/api/v1/ratings.json
- Dijalankan via GitHub Action (.github/workflows/sync-ratings.yml)
- Cron: setiap 6 jam

---

## Referensi

- README.md — overview project
- CONTRIBUTING.md — panduan kontribusi
- anime-template.md — template anime