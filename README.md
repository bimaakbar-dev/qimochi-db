# QimochiDB

Database anime Indonesia — katalog lengkap, API gratis untuk developer.

- 🌐 Website: https://qimochi.pages.dev
- 🔌 API Base: https://qimochi-api.bimaakbar.workers.dev

---

## Apa ini?

QimochiDB adalah database anime berbahasa Indonesia yang dikurasi komunitas.
Data disajikan lewat website dan REST API publik — gratis untuk developer.

Fokus:
- 📖 Katalog anime yang bisa di-browse & search
- 🔌 API gratis untuk bot, app, dan website
- 🇮🇩 Konten berbahasa Indonesia
- 🎯 Data berkualitas, dikurasi manual

Bukan:
- ❌ Platform streaming (tidak host video)
- ❌ Situs download
- ❌ Tracker pribadi

---

## Untuk Developer

### Contoh: Ambil Detail Anime

`curl https://qimochi-api.bimaakbar.workers.dev/api/v1/anime/kimetsu-no-yaiba.json`

Response:

```json
  {
    "data": {
  "id": "kimetsu-no-yaiba",
  "title": "Kimetsu no Yaiba",
  "titleEnglish": "Demon Slayer: Kimetsu no Yaiba",
  "titleNative": "鬼滅の刃",
  "externalIds": {
    "mal": 38000,
    "anilist": 101922,
    "kitsu": "41370"
  },
  "type": "TV",
  "status": "finished",
  "source": "manga",
  "season": "spring",
  "year": 2019,
  "episodes": 26,
  "duration": 23,
  "rating": "R",
  "aired": {
    "from": "2019-04-06",
    "to": "2019-09-28"
  },
  "stats": {
    "score": 8.5,
    "scoredBy": 1542300
  },
  "genres": ["action", "supernatural", "shounen"],
  "studios": [{ "slug": "ufotable", "name": "ufotable" }],
  "franchises": [],
  "image": "https://...",
  "banner": null,
  "trailer": "VQGCKyvzIM4",
  "episodeList": [],
  "characters": []
}
  }
```

### Contoh: Submit Rating (JavaScript)

```js
  fetch('https://qimochi-api.bimaakbar.workers.dev/api/v1/ratings/kimetsu-no-yaiba', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: 5 })
  });
```

### Endpoint Tersedia

| Endpoint | Deskripsi |
|----------|-----------|
| GET /api/v1/anime.json | List semua anime |
| GET /api/v1/anime/[id].json | Detail 1 anime |
| GET /api/v1/genres.json | List genre + count |
| GET /api/v1/studios.json | List studio + count |
| GET /api/v1/franchises.json | List franchise |
| GET /api/v1/stats.json | Statistik agregat |
| GET /api/v1/index.json | Discovery endpoint |
| GET /api/v1/ratings/[id] | Rating 1 anime |
| POST /api/v1/ratings/[id] | Submit rating |
| DELETE /api/v1/ratings/[id] | Hapus rating |

Format response:
- Sukses: { data: ..., meta: { total, generatedAt } }
- Gagal: { error: { code, message, status } }

---

## Untuk Kontributor

Kami menerima kontribusi data anime, genre, studio, dan franchise via
GitHub Pull Request.

Baca panduan lengkap: [CONTRIBUTING.md](./CONTRIBUTING.md)

Singkatnya:
1. Fork repo
2. Tambah/edit file di src/content/anime/
3. PR
4. Kami review + merge

---

## API Rules

- ✅ Open — tidak perlu API key
- ✅ CORS enabled — bebas dari domain apapun
- ✅ Cache 1 jam di edge
- ⚠️ Rate limit tidak di-enforce untuk pembacaan
- ⚠️ Tidak ada SLA — gunakan dengan bijak

---

## Sumber Data

Data fakta (judul, tahun, episode, studio, rating) diambil dari:

- MyAnimeList (https://myanimelist.net)
- AniList (https://anilist.co)
- Kitsu (https://kitsu.app)
- Wikipedia, ANN

Sinopsis ditulis ulang oleh kontributor — bukan copy-paste.

---

## License

- Kode: MIT (lihat LICENSE)
- Data: CC BY 4.0 (lihat LICENSE-DATA)

Atribusi minimal yang diminta:

  Data dari QimochiDB (https://qimochi.pages.dev)
  Lisensi: CC BY 4.0

---

## Kontak

- Discord: (coming soon)
- Telegram: (coming soon)