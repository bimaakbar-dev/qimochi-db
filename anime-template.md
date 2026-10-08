---
# ────────────────────────────────────────────────────────
# WAJIB — 3 field
# ────────────────────────────────────────────────────────
title: "Judul Anime (romaji)"
type: TV
status: finished

# ────────────────────────────────────────────────────────
# OPSIONAL — isi kalau ada, hapus kalau tidak.
# JANGAN diisi string kosong ("").
# ────────────────────────────────────────────────────────

# titleEnglish: "English Title"
# titleNative: "日本語タイトル"
#
# malId: 0
# anilistId: 0
# kitsuId: "0"
#
# source: manga      # original | manga | light_novel | visual_novel
#                    # | game | web_manga | web_novel | novel | book
#                    # | picture_book | radio | music | 4_koma_manga
#                    # | card_game | other
# season: spring     # winter | spring | summer | fall
# year: 2024
# episodes: 12
# duration: 24       # menit per episode
# rating: PG-13      # G | PG | PG-13 | R | R+ | Rx
#
# aired:
#   from: "2024-01-01"
#   to: "2024-03-31"   # null kalau masih ongoing
#
# stats:
#   score: 8.0
#   scoredBy: 100000
#
# genres:
#   - action
#   - fantasy
#
# studios:
#   - ufotable
#
# image: "https://cdn.myanimelist.net/..."
# banner: "https://..."
# trailer: "VQGCKyvzIM4"   # YouTube video ID
#
# draft: false

# ────────────────────────────────────────────────────────
# JANGAN TULIS di markdown: franchises, episodeList, characters
#
# Datanya disimpan di repo terpisah (yukio-data) dan di-merge
# otomatis saat build. Bentuk di repo:
#
#   src/data/anime/[slug]/franchises.json
#   src/data/anime/[slug]/episodes/0001-0100.json
#   src/data/anime/[slug]/characters/0001-0100.json
#
# Handler: src/lib/anime.ts → hydrateOne()
# ────────────────────────────────────────────────────────
---

Tulis sinopsis di sini.

JANGAN copy-paste dari MAL atau AniList. Tulis ulang pakai bahasa sendiri.

Panduan menulis sinopsis:

1. Baca sinopsis dari 2-3 sumber (MAL, Wikipedia, ANN)
2. Tutup semua tab
3. Tulis dari ingatan, pakai bahasa sendiri
4. Struktur: siapa tokoh → konflik → premis cerita

---

## Cara Pakai

1. Copy file ini ke `src/content/anime/`
2. Rename sesuai slug anime (contoh: `naruto.md`)
3. Isi minimal 3 field wajib (`title`, `type`, `status`)
4. Uncomment field opsional yang mau diisi
5. Tulis sinopsis di body markdown
6. Validasi: `npx astro sync && npm run build`
7. Commit + PR

## Field Wajib

- `title` — judul anime (romaji)
- `type` — TV | Movie | OVA | ONA | Special | Music | Unknown
- `status` — airing | finished | upcoming | hiatus | cancelled

## Aturan Penting

- Field opsional **jangan** diisi string kosong (`""`)
- Kalau tidak ada data, jangan tulis field-nya sama sekali
- Contoh SALAH: `image: ""`
- Contoh BENAR: hilangkan field `image` sepenuhnya

Panduan lengkap: lihat [CONTRIBUTING.md](./CONTRIBUTING.md)