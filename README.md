# Yukionime

[![Deploy to Cloudflare Pages](https://github.com/bimaakbar-dev/yukionime/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/bimaakbar-dev/yukionime/actions/workflows/deploy-frontend.yml)

Database anime Indonesia — katalog lengkap, API gratis untuk developer.

- 🌐 Website: https://yukionime.pages.dev

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
- ❌ Platform streaming (tidak host video)
- ❌ Situs download
- ❌ Tracker pribadi

---

## Untuk Developer

### Base URL

[yukionime.pages.dev/api/v1](https://yukionime.pages.dev/api/v1)

Tidak perlu API key. CORS terbuka. Rate limit tidak ditegakkan.

### Endpoint

| Endpoint | Deskripsi |
|----------|-----------|
| GET / | Root — daftar semua endpoint |
| GET /anime.json | Index ringkas semua anime |
| GET /anime/[id].json | Detail lengkap 1 anime |
| GET /anime-full.json | Snapshot semua anime + detail |
| GET /genres.json | Semua genre + jumlah anime |
| GET /studios.json | Semua studio + jumlah anime |
| GET /franchises.json | Relasi franchise antar anime |
| GET /stats.json | Statistik agregat database |
| GET /meta.json | Metadata API (versi, license, changelog) |

### Contoh

```bash
curl https://yukionime.pages.dev/api/v1/anime.json
```

### Format Response

Sukses:

```json
{
  "data": "…",
  "meta": {
    "version": "v1",
    "total": 80,
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
- ✅ CORS enabled
- ✅ Cache 5 menit di edge
- ⚠️ Tidak ada SLA
- 📜 Data: CC BY 4.0 (lihat [LICENSE-DATA](./LICENSE-DATA))

---

## Untuk Kontributor

Kami menerima kontribusi data anime, genre, dan studio via GitHub Pull Request.

Baca panduan lengkap: [CONTRIBUTING.md](./CONTRIBUTING.md)

Singkatnya:
1. Fork repo
2. Tambah/edit file di `src/content/anime/`
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

- Discord: [Community Server](https://discord.gg/fcnVtd4Cb)
- Telegram: (coming soon)