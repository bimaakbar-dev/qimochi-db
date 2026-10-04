---
title: ""
titleEnglish: ""
titleNative: ""

malId: null
anilistId: null
kitsuId: ""

type: TV
status: finished
source: ""
season: ""
year: null
episodes: null
duration: null
rating: ""

aired:
  from: ""
  to: null

stats:
  score: null
  scoredBy: null

genres: []
studios: []

franchises: []

image: ""
banner: ""
trailer: ""

episodeList: []

characters: []

draft: false
---

Tulis sinopsis di sini.

JANGAN copy-paste dari MAL atau AniList. Tulis ulang pakai bahasa sendiri.

Panduan menulis sinopsis:

1. Baca sinopsis dari 2-3 sumber (MAL, Wikipedia, ANN)
2. Tutup semua tab
3. Tulis dari ingatan, pakai bahasa sendiri
4. Struktur: siapa tokoh → konflik → premis cerita

---

## Cara Pakai Template Ini

1. Copy file ini ke src/content/anime/
2. Rename sesuai slug anime (contoh: naruto.md)
3. Isi minimal 3 field: title, type, status
4. Isi field lain sesuai data yang tersedia (bertahap)
5. Tulis sinopsis di body markdown
6. Validasi: npx astro sync && npm run build
7. Commit + PR

Field wajib (3):

- title — judul anime
- type — TV | Movie | OVA | ONA | Special | Music | Unknown
- status — airing | finished | upcoming | hiatus | cancelled

Field opsional: isi sesuai data. TIDAK WAJIB lengkap.

Aturan penting:

- Field optional JANGAN diisi dengan string kosong ("")
- Kalau tidak ada data, hapus field-nya
- Contoh SALAH: image: ""
- Contoh BENAR: (hilangkan field image sepenuhnya)

Format franchises (kalau ada):

[
  franchises:
    - relation: sequel
      slug: anime-target-slug
      title: "Judul Anime Target"
]

Field title opsional — isi kalau anime target belum ada di database.

Panduan lengkap: lihat CONTRIBUTING.md