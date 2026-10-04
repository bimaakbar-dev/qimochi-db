# Panduan Kontribusi

Terima kasih ingin berkontribusi ke QimochiDB! Panduan ini menjelaskan cara
menambahkan data anime, genre, dan studio.

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
- Nama studio
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

- Hotlink dari CDN (MAL atau AniList) — jangan upload ke repo
- Format: https://cdn.myanimelist.net/images/...
- Format: https://s4.anilist.co/file/anilistcdn/...

---

## Menambah Anime Baru

### 1. Buat File Markdown

Copy template dari anime-template.md:

```bash
cp anime-template.md src/content/anime/nama-anime.md
```

Nama file = slug anime (lowercase, kebab-case):

| Judul | Slug |
|-------|------|
| Kimetsu no Yaiba | kimetsu-no-yaiba |
| Fullmetal Alchemist: Brotherhood | fullmetal-alchemist-brotherhood |
| Steins;Gate | steins-gate |

### 2. Isi Field Wajib (3 Field)

Minimal 3 field untuk anime tampil:

```yaml
  title: "Nama Anime"
  type: TV
  status: finished
```

- type: TV | Movie | OVA | ONA | Special | Music | Unknown
- status: airing | finished | upcoming | hiatus | cancelled

Selesai. Anime sudah muncul di website.

### 3. Isi Field Opsional (Bertahap)

Isi sesuai data yang tersedia. Tidak wajib lengkap.

Field opsional:

- titleEnglish, titleNative — judul alternatif
- malId, anilistId, kitsuId — ID external
- year, season, episodes, duration, rating, source
- aired.from / aired.to — format YYYY-MM-DD
- stats.score, stats.scoredBy — rating MAL
- genres, studios — array slug
- franchises — array object { relation, slug, title }
- image, banner, trailer — URL / YouTube ID
- episodeList — array { number, title, aired }
- characters — array { name, nameNative, image, role, voiceActors }
- draft — boolean (true = jangan tampilkan di UI)

### 4. Isi Sinopsis (Body Markdown)

Tulis sinopsis di bawah tanda `---` (frontmatter).

Tips menulis sinopsis:

1. Baca sinopsis dari 2-3 sumber (MAL, Wikipedia, ANN)
2. Tutup semua tab
3. Tulis dari ingatan pakai bahasa sendiri
4. Struktur: siapa tokoh → konflik → premis

JANGAN copy-paste dari MAL atau AniList. Itu pelanggaran copyright.

### 5. Validasi

```bash
npx astro sync
```
kemudian:

```bash
npm run build
```

Kalau ada error, perbaiki dulu sebelum push.

---

## Field Optional — Jangan Isi dengan String Kosong

Field optional (image, banner, trailer, dll) TIDAK boleh diisi dengan "".

❌ SALAH:

```yaml
  image: ""
  banner: ""
```

✅ BENAR — kalau tidak ada, hilangkan field-nya:

```yaml
  # image tidak ditulis sama sekali
```

✅ BENAR — kalau ada, isi dengan URL valid:

```yaml
  image: "https://cdn.myanimelist.net/..."
```

---

## Field Franchises — Format

Field franchises menyimpan hubungan ke anime lain:

```yaml
  franchises:
    - relation: sequel
      slug: anime-target-slug
      title: "Judul Anime Target"
```

Relation yang valid: sequel, prequel, side_story, parent_story,
alternative, spin_off, adaptation, character, summary, full_story,
compilation, contains, other.

Field title opsional — isi kalau anime target belum ada di database.

---

## Menambah Genre

Edit `src/data/genres.json`. Format:

```json
  {
    "id": "genre-slug",
    "name": "Genre Name",
    "category": "genre",
    "description": "Deskripsi singkat (opsional)"
  }
```

Kategori yang valid:
- genre — Action, Romance, Comedy, dll
- theme — Isekai, Mecha, School, dll
- demographic — Shounen, Seinen, Shoujo, Josei

---

## Menambah Studio

Edit src/data/studios.json. Format:

```json
  {
    "id": "studio-slug",
    "name": "Studio Name",
    "nameNative": "スタジオ名",
    "founded": 2000,
    "website": "https://studio.com",
    "description": "Deskripsi singkat"
  }
```

---

## Konvensi

### Slug

- Lowercase
- Kebab-case (pakai tanda - sebagai pemisah)
- Contoh: `kimetsu-no-yaiba`, `attack-on-titan`
- JANGAN pakai spasi, underscore, atau huruf besar

### Tanggal

Format: YYYY-MM-DD (ISO 8601)

Contoh: 2019-04-06

### URL

- Harus HTTPS
- Format valid (dicek Zod)

### Array

Untuk field yang butuh multiple values:

```yaml
  genres:
    - action
    - shounen
```

---

## Yang Perlu Dicek Sebelum PR

- npx astro sync sukses
- npm run build sukses
- File `.md` di folder `src/content/anime/`
- Slug file lowercase-kebab-case
- Field wajib (title, type, status) terisi
- Sinopsis BUKAN copy-paste
- Tidak ada field optional diisi dengan ""
- Tidak ada typo di slug relasi `genre/studio/franchise`
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