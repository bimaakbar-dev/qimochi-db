<div align="center">
<h1>Yukionime</h1>
</div>

<div align="center">

[![Deploy to Cloudflare Pages](https://github.com/bimaakbar-dev/yukionime/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/bimaakbar-dev/yukionime/actions/workflows/deploy-frontend.yml)

</div>

<p align="center">
Database anime Bahasa Indonesia — katalog lengkap, API gratis untuk developer.
<br/> 
<a href="https://yukionime.pages.dev">🌐 Website</a>
</p>

---

## Apa ini?

Yukionime adalah database anime berbahasa Indonesia yang dikurasi komunitas.
Data disajikan lewat website dan REST API publik — gratis untuk developer.

Fokus:
- 📖 Katalog anime yang bisa di-browse & search
- 🔌 API gratis untuk bot, app, dan website
- 🇮🇩 Konten berbahasa Indonesia
- 🎯 Data berkualitas, dikurasi manual

Bukan:
- Platform streaming (tidak host video)
- Situs download
- Tracker pribadi

---

## Untuk Developer

### Base URL

```plaintext
https://yukionime.pages.dev/api/v1
```

Root endpoint: `/api/v1.json`

Tidak perlu API key. CORS terbuka. Rate limit tidak ditegakkan.

### Endpoint

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /api/v1.json` | Root — daftar semua endpoint |
| `GET /anime.json` | Index ringkas semua anime (list & filter) |
| `GET /anime/[id].json` | Detail lengkap 1 anime berdasarkan slug |
| `GET /anime-full.json` | Snapshot semua anime + detail lengkap (1 file) |
| `GET /genres.json` | Semua genre + jumlah anime |
| `GET /studios.json` | Semua studio + jumlah anime |
| `GET /franchises.json` | Relasi franchise antar anime |
| `GET /stats.json` | Statistik agregat database |
| `GET /meta.json` | Metadata API (versi, license, changelog) |

### Contoh: Index Anime

```bash
curl https://yukionime.pages.dev/api/v1/anime.json
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
curl https://yukionime.pages.dev/api/v1/anime/kimetsu-no-yaiba.json
```

Detail berisi semua field index + tambahan: externalIds, aired,
franchises, banner, trailer, episodeList, characters, dan studios
dalam bentuk objek { slug, name }.

### Format Response

Sukses:

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

Error:

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
- 📜 Data: CC BY 4.0 (lihat [LICENSE-DATA](./LICENSE-DATA))

---

## Untuk Kontributor

Kami menerima kontribusi data anime, genre, dan studio via GitHub Pull Request.

Baca panduan lengkap: [CONTRIBUTING.md](./CONTRIBUTING.md)

Singkatnya:
1. Fork repo
2. Tambah/edit file di src/content/anime/
3. PR
4. Kami review + merge

---

## Sumber Data

Data fakta (judul, tahun, episode, studio, rating) diambil dari:

- MyAnimeList (https://myanimelist.net)
- AniList (https://anilist.co)
- Kitsu (https://kitsu.app)
- Wikipedia, ANN

Sinopsis ditulis ulang oleh kontributor — bukan copy-paste.

---

## Limitasi API (Static)

API ini di-generate secara statis. Dua hal yang perlu diketahui:

1. **404 untuk ID tidak ada** — return HTML 404 default Cloudflare Pages,
   bukan JSON. Untuk dapat JSON 404, butuh Cloudflare Pages Functions.

2. **CORS preflight (OPTIONS)** — tidak didukung. Statis server hanya
   melayani GET/HEAD. Untuk request GET sederhana (yang dipakai API ini),
   browser tidak kirim preflight, jadi CORS tetap jalan normal via
   header Access-Control-Allow-Origin: *.

## License

- Kode: MIT (lihat [LICENSE](./LICENSE))
- Data: CC BY 4.0 (lihat [LICENSE-DATA](./LICENSE-DATA))

Atribusi minimal yang diminta:

```plaintext
Data dari Yukionime (https://yukionime.pages.dev)
Lisensi: CC BY 4.0
```

---

## Kontak

- Discord: [Communtiy Server](https://discord.gg/fcnVtd4Cb)
- Telegram: (coming soon)