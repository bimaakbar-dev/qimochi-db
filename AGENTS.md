# AGENTS.md

Panduan untuk AI agent (Cursor, Claude, Copilot, dll) yang bekerja dengan
project Yukionime.

---

## Konteks Project

Yukionime adalah database anime Indonesia:

- Website: Astro 7 (SSG) di Cloudflare Pages
- API: Static JSON di `/api/v1/*.json` (auto-generated dari content collections)
- Rating: Cloudflare Workers + D1 (repo terpisah: qimochi-api)
- Konten: Markdown files di `src/content/anime/`
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

File: `src/content.config.ts`

3 collections:

- anime — markdown files di `src/content/anime/`
- genres — JSON di `src/data/genres.json`
- studios — JSON di `src/data/studios.json`

3 field WAJIB di anime:

- `title` — string, judul romaji
- `type` — TV | Movie | OVA | ONA | Special | Music | Unknown
- `status` — airing | finished | upcoming | hiatus | cancelled

Field penting lain:

- `slug` = nama file `.md` (tanpa `.md`)
- `genres`, `studios` = array slug (bukan nama)
- `franchises` = array object `{ relation, slug, title? }`
- `image`, `banner`, `trailer` = URL/host eksternal
- `characters`, `episodeList` = array object (konten panjang)
- `draft` = boolean, filter di `getCollection`

### Route Structure

Routes:

- `/` — landing
- `/anime/[slug]/` — detail anime
- `/search/anime/` — search + filter (fungsi sebagai katalog)
- `/api/v1/` — root API (index endpoint)
- `/api/v1/anime.json` — index ringkas
- `/api/v1/anime/[id].json` — detail per anime
- `/api/v1/anime-full.json` — snapshot semua detail
- `/api/v1/genres.json`
- `/api/v1/studios.json`
- `/api/v1/franchises.json`
- `/api/v1/stats.json`
- `/api/v1/meta.json`

Catatan:

- Semua route anime di bawah `/anime/`
- Search page di `/search/anime/`
- TIDAK ada `/anime/` (katalog) — search page fungsi sebagai katalog

### Design Tokens

File: `src/styles/props.css`

Prefix:

- `--bg-*` — base, elevated, surface, hover, primary, secondary, nav, footer
- `--text-*` — primary, secondary, muted, disabled, inverted
- `--accent`, `--accent-hover`, `--accent-soft`, `--accent-text`
- `--gold`, `--success`, `--warning`, `--danger` (+ `.soft`)
- `--fs-*` (font size), `--fw-*` (font weight), `--lh-*` (line height)
- `--s-*` (spacing: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16)
- `--r-*` (radius: sm, md, lg, full)
- `--shadow-*`, `--t-*` (transition), `--z-*`

JANGAN bikin token baru tanpa alasan kuat. Pakai yang ada.

### Breakpoints

Hanya 2:

- Mobile: < 50rem
- Desktop: >= 50rem

Container max: 72rem (desktop), 50rem (mobile).

### Class Naming

BEM-ish:

- `.block`
- `.block__element`
- `.block--modifier`
- `.block__element--modifier`

Contoh: `anime-card`, `anime-card__title`, `anime-card--compact`.

---

## Konvensi Kode

### Astro Components

Struktur:

- Frontmatter (`---`) — imports, interface Props, destructure
- Markup — HTML
- Style — scoped CSS

Aturan:

- Pakai alias `~/` (bukan `../`)
- `interface Props` di atas
- Scoped style default, `is:global` hanya kalau perlu
- Komponen self-contained (fetch sendiri, tidak boleh parent kirim data mentah)

### JavaScript (Client-side)

- Pakai `// @ts-nocheck` kalau perlu (dynamic DOM)
- JANGAN pakai framework (React/Vue) — vanilla JS only
- Pakai `document.querySelector` + event delegation
- Template clone untuk render list dinamis:
  - `const tpl = document.getElementById('xxx-template')`
  - `const node = tpl.content.cloneNode(true)`

### CSS

- Vanilla CSS (bukan SCSS/Tailwind)
- CSS variables untuk semua warna/spacing/font
- Nesting `&` boleh (Astro support)
- Media queries:
  - `@media (min-width: 50rem)` — desktop
  - `@media (hover: hover) and (pointer: fine)` — hover-capable

---

## Jangan Lakukan

### Jangan Bikin SSR

Tidak pakai `@astrojs/cloudflare` adapter. Tetap `output: 'static'`.

Kalau butuh dynamic (rating), buat Worker terpisah di repo lain.

### Jangan Bikin Database di Repo Ini

Data di `.md` dan `.json` saja. Untuk rating, pakai Worker + D1.

### Jangan Copy Sinopsis dari MAL

Copyright issue. SELALU tulis ulang pakai bahasa sendiri.

### Jangan Upload Gambar ke Repo

Hotlink dari CDN (MAL atau AniList). Bukan host di `public/`.

### Jangan Pakai Framework JS

React, Vue, Svelte — TIDAK dipakai. Astro + vanilla JS only.

### Jangan Ubah Schema Tanpa Alasan

`content.config.ts` = kontrak data. Kalau ubah, SEMUA `.md` harus kompatibel.
Test `npx astro sync` dan `npm run build`.

### Jangan Isi Field Optional dengan String Kosong

Field `image`, `banner`, `trailer` TIDAK boleh diisi dengan `""`.
Hapus field-nya kalau tidak ada.

---

## Task Pattern

### Menambah Anime Baru

1. Copy `anime-template.md` → `src/content/anime/[slug].md`
2. Isi minimal 3 field wajib (`title`, `type`, `status`)
3. Isi field opsional sesuai data
4. Tulis sinopsis sendiri
5. Jalankan: `npx astro sync`
6. Kalau perlu, tambah studio/genre ke JSON masing-masing

### Menambah Studio

Edit `src/data/studios.json`. Format:

- `id`: kebab-case-slug
- `name`: Display Name
- `founded`: 2000
- `website`: https://...

### Menambah Endpoint API

1. Buat file di `src/pages/api/v1/`
2. Pakai helper `jsonResponse` / `errorResponse` dari `~/lib/api/response`
3. Tambah `export const OPTIONS` untuk CORS preflight
4. Update `ENDPOINTS` array di `scripts/gen-api-docs.mjs`
5. Push — workflow `gen-api-docs` akan update README otomatis

### Update API

Format response sukses (WAJIB):

```json
{
  "data": "…",
  "meta": {
    "version": "v1",
    "total": 123,
    "generatedAt": "2026-10-08T12:00:00.000Z"
  }
}