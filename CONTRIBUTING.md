# Panduan Kontribusi

Terima kasih ingin berkontribusi ke QimochiDB! Panduan ini menjelaskan cara
menambahkan data anime, genre, studio, dan franchise.

---

## Cara Kontribusi

1. Fork repo ini
2. Buat branch baru: [git checkout -b tambah-anime-naruto]
3. Tambah/edit file
4. Commit dengan pesan jelas
5. Push ke fork kamu
6. Buka Pull Request ke repo utama

---

## Aturan Penting

### ✅ Yang Boleh Di-copy (Fakta)

Fakta tidak bisa di-copyright. Boleh ambil dari MAL, AniList, Wikipedia:

- Judul anime (romaji, English, native)
- Tahun rilis, musim, jumlah episode
- Nama studio, producer, licensor
- Genre, rating usia
- Rating/skor (angka statistik dari MAL)
- Tanggal tayang
- External ID (malId, anilistId, kitsuId)

### ❌ Yang TIDAK Boleh Di-copy

Karya kreatif — wajib tulis sendiri:

- Sinopsis — tulis ulang pakai bahasamu sendiri
- Review — tulis sendiri
- Deskripsi karakter — tulis sendiri
- Catatan editorial — tulis sendiri

### ✅ Gambar

- Hotlink dari CDN (MAL, AniList) — jangan upload ke repo
- Format: https://cdn.myanimelist.net/images/...

---

## Menambah Anime Baru

### 1. Buat File Markdown

Copy template dari docs/ANIME-TEMPLATE.md:

[cp docs/ANIME-TEMPLATE.md src/content/anime/nama-anime.md]

Nama file = slug anime (lowercase, kebab-case):

| Judul | Slug |
|-------|------|
| Kimetsu no Yaiba | kimetsu-no-yaiba |
| Fullmetal Alchemist: Brotherhood | fullmetal-alchemist-brotherhood |
| Steins;Gate | steins-gate |

### 2. Isi Field Wajib (3 Field)

Minimal 3 field untuk anime tampil:

[
  title: "Nama Anime"
  type: TV
  status: finished
]

- type: TV | Movie | OVA | ONA | Special | Music | Unknown
- status: airing | finished | upcoming | hiatus | cancelled

Selesai. Anime sudah muncul di website.

### 3. Isi Field Opsional (Bertahap)

Isi sesuai data yang tersedia. Tidak wajib lengkap.

Contoh field opsional:

- image, banner — URL dari CDN
- trailer — YouTube ID saja, contoh: "dQw4w9WgXcQ"
- year, season, episodes, duration, rating, source
- aired.from / aired.to — format YYYY-MM-DD
- genres — array slug, contoh: action, shounen
- studios — array slug, contoh: ufotable
- producers — array nama, contoh: "Aniplex"
- franchises — array slug, contoh: demon-slayer
- related — array { relation, slug }
- stats — object { score, scoredBy, rank, popularity, members, favorites }
- malId, anilistId, kitsuId — external ID
- streaming — array { name, url, region, language }
- episodeList — array { number, title, aired }
- characters — array { name, nameNative, image, role, voiceActors }
- tags — array string
- nsfw — boolean
- draft — boolean (true = jangan tampilkan)
- contributors — array username GitHub

### 4. Isi Sinopsis (Body Markdown)

Tulis sinopsis di bawah tanda --- (frontmatter).

Tips menulis sinopsis:

1. Baca sinopsis dari 2-3 sumber (MAL, Wikipedia, ANN)
2. Tutup semua tab
3. Tulis dari ingatan pakai bahasa sendiri
4. Struktur: siapa tokoh → konflik → premis

JANGAN copy-paste dari MAL atau AniList. Itu pelanggaran copyright.

### 5. Validasi

[npx astro sync]
[npm run build]

Kalau ada error, perbaiki dulu sebelum push.

---

## Menambah Genre

Edit src/data/genres.json. Format:

[
  {
    "id": "genre-slug",
    "name": "Genre Name",
    "category": "genre",
    "description": "Deskripsi singkat (opsional)"
  }
]

Kategori yang valid:
- genre — Action, Romance, Comedy, dll
- theme — Isekai, Mecha, School, dll
- demographic — Shounen, Seinen, Shoujo, Josei

---

## Menambah Studio

Edit src/data/studios.json. Format:

[
  {
    "id": "studio-slug",
    "name": "Studio Name",
    "nameNative": "スタジオ名",
    "founded": 2000,
    "website": "https://studio.com",
    "description": "Deskripsi singkat"
  }
]

---

## Menambah Franchise

Edit src/data/franchises.json. Format:

[
  {
    "id": "franchise-slug",
    "name": "Franchise Name",
    "description": "Deskripsi franchise",
    "rootSlug": "slug-anime-utama"
  }
]

---

## Konvensi

### Slug

- Lowercase
- Kebab-case (pakai tanda - sebagai pemisah)
- Contoh: kimetsu-no-yaiba, attack-on-titan
- JANGAN pakai spasi, underscore, atau huruf besar

### Tanggal

Format: YYYY-MM-DD (ISO 8601)

Contoh: 2019-04-06

### URL

- Harus HTTPS
- Format valid (dicek Zod)

### Array

Untuk field yang butuh multiple values:

[
  genres:
    - action
    - shounen
]

---

## Yang Perlu Dicek Sebelum PR

- npx astro sync sukses
- npm run build sukses
- File .md di folder src/content/anime/
- Slug file lowercase-kebab-case
- Field wajib (title, type, status) terisi
- Sinopsis BUKAN copy-paste
- Tidak ada typo di slug relasi (genre/studio/franchise)
- Commit message jelas

---

## Contoh Commit Message

[feat(anime): tambah Violet Evergarden]
[fix(anime): perbaiki typo studio Kimetsu no Yaiba]
[docs: update template anime]
[chore(studio): tambah Kyoto Animation]

---

## Menemukan Bug?

Buka GitHub Issue dengan:
- Deskripsi bug
- Steps to reproduce
- Screenshot (kalau ada)

---

## Pertanyaan?

Buka GitHub Discussions atau hubungi maintainer.