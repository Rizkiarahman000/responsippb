# 📚 REST API Pencatatan Peminjaman Buku Perpustakaan

REST API sederhana untuk layanan pencatatan peminjaman buku perpustakaan. Dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase** (PostgreSQL), serta di-deploy ke **Vercel** agar dapat diakses secara publik.

## 📌 Deskripsi Umum & Tujuan

Proyek ini menyediakan API untuk melakukan operasi **CRUD** (Create, Read, Update, Delete) terhadap data peminjaman buku oleh anggota perpustakaan. Selain itu tersedia fitur **filter query** sehingga data dapat disaring berdasarkan status, nama anggota, atau judul buku.

Tujuan utama proyek:

- Menyediakan backend sederhana untuk manajemen data peminjaman buku.
- Mempermudah integrasi dengan frontend atau aplikasi lainnya (mobile/web).
- Menjadi sarana pembelajaran membangun REST API dengan Node.js + Express + Supabase + Vercel.

## 🧱 Teknologi

| Teknologi | Keterangan |
|-----------|------------|
| Node.js   | Runtime JavaScript |
| Express.js | Framework web untuk membangun REST API |
| Supabase  | Backend-as-a-Service (database PostgreSQL) |
| Vercel    | Platform deployment (serverless) |

## 🗂️ Struktur Data / Schema

Tabel `loans` menyimpan data peminjaman buku:

| Kolom           | Tipe          | Keterangan |
|-----------------|---------------|------------|
| `id`            | `uuid`        | Primary key, otomatis di-generate |
| `nama_anggota`  | `text`        | Nama anggota yang meminjam (wajib) |
| `judul_buku`    | `text`        | Judul buku yang dipinjam (wajib) |
| `jumlah_buku`   | `integer`     | Jumlah buku yang dipinjam (wajib, min 1) |
| `tanggal_pinjam`| `date`        | Tanggal peminjaman, format `YYYY-MM-DD` (wajib) |
| `tanggal_kembali`| `date`       | Tanggal jatuh tempo pengembalian, format `YYYY-MM-DD` (wajib) |
| `deskripsi`     | `text`        | Catatan tambahan (opsional) |
| `status`        | `text`        | Status peminjaman: `Dipinjam`, `Dikembalikan`, `Terlambat` |
| `created_at`    | `timestamptz` | Timestamp pembuatan data |

Skema SQL lengkap tersedia di file [`supabase_schema.sql`](./supabase_schema.sql).

## 🔌 Endpoint

Base URL: `https://perpustakaan-peminjaman-api.vercel.app`

| Method | Endpoint        | Deskripsi |
|--------|-----------------|-----------|
| GET    | `/`             | Info API & daftar endpoint |
| GET    | `/health`       | Cek kesehatan API |
| GET    | `/loans`        | Ambil semua data peminjaman |
| GET    | `/loans?status=Terlambat` | Filter data berdasarkan status |
| GET    | `/loans/:id`    | Ambil detail satu data |
| POST   | `/loans`        | Tambah data peminjaman |
| PUT    | `/loans/:id`    | Perbarui data peminjaman |
| DELETE | `/loans/:id`    | Hapus data peminjaman |

### Query Parameter Filter (GET `/loans`)

| Parameter      | Contoh          | Keterangan |
|----------------|-----------------|------------|
| `status`       | `Terlambat`     | Filter berdasarkan status |
| `nama_anggota` | `rizki`         | Pencarian nama anggota (case-insensitive) |
| `judul_buku`   | `algoritma`     | Pencarian judul buku (case-insensitive) |

## 📦 Contoh Request & Response

### 1. Tambah Data Peminjaman

`POST /loans`

**Request Body:**

```json
{
  "nama_anggota": "Rizki Aditya",
  "judul_buku": "Dasar-Dasar Pemrograman",
  "jumlah_buku": 2,
  "tanggal_pinjam": "2026-10-01",
  "tanggal_kembali": "2026-10-15",
  "deskripsi": "Peminjaman untuk tugas kuliah",
  "status": "Dipinjam"
}
```

**Response `201 Created`:**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil dibuat",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "nama_anggota": "Rizki Aditya",
    "judul_buku": "Dasar-Dasar Pemrograman",
    "jumlah_buku": 2,
    "tanggal_pinjam": "2026-10-01",
    "tanggal_kembali": "2026-10-15",
    "deskripsi": "Peminjaman untuk tugas kuliah",
    "status": "Dipinjam",
    "created_at": "2026-10-10T20:00:00.000Z"
  }
}
```

### 2. Ambil Semua Data

`GET /loans`

**Response `200 OK`:**

```json
{
  "success": true,
  "total": 2,
  "data": [
    { "id": "...", "nama_anggota": "Rizki Aditya", "judul_buku": "Dasar-Dasar Pemrograman", "status": "Dipinjam" },
    { "id": "...", "nama_anggota": "Siti Aminah", "judul_buku": "Algoritma & Struktur Data", "status": "Terlambat" }
  ]
}
```

### 3. Filter Berdasarkan Status

`GET /loans?status=Terlambat`

**Response `200 OK`:**

```json
{
  "success": true,
  "total": 1,
  "data": [
    { "id": "...", "nama_anggota": "Siti Aminah", "judul_buku": "Algoritma & Struktur Data", "status": "Terlambat" }
  ]
}
```

### 4. Update Data

`PUT /loans/{id}`

**Request Body (sebagian field saja boleh):**

```json
{
  "status": "Dikembalikan",
  "deskripsi": "Buku sudah dikembalikan"
}
```

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil diperbarui",
  "data": { "id": "f47ac10b-...", "status": "Dikembalikan", "deskripsi": "Buku sudah dikembalikan" }
}
```

### 5. Hapus Data

`DELETE /loans/{id}`

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil dihapus",
  "data": { "id": "f47ac10b-..." }
}
```

### Contoh Response Error

**Validasi gagal (`400`):**

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": ["status harus salah satu dari: Dipinjam, Dikembalikan, Terlambat"]
}
```

**Data tidak ditemukan (`404`):**

```json
{
  "success": false,
  "message": "Data peminjaman tidak ditemukan"
}
```

## 🚀 Panduan Instalasi & Menjalankan Secara Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- Akun [Supabase](https://supabase.com/) beserta proyek yang sudah dibuat

### Langkah 1: Clone Repository

```bash
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>
```

### Langkah 2: Install Dependencies

```bash
npm install
```

### Langkah 3: Konfigurasi Environment

```bash
cp .env.example .env   # Linux/macOS
copy .env.example .env # Windows
```

Isi file `.env` dengan kredensial Supabase Anda:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
PORT=3000
```

> Kedua nilai tersebut bisa didapatkan di **Supabase Dashboard → Project Settings → API**.

### Langkah 4: Buat Tabel di Supabase

Buka **SQL Editor** di dashboard Supabase, lalu jalankan seluruh isi file [`supabase_schema.sql`](./supabase_schema.sql).

### Langkah 5: Jalankan Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`. Uji dengan membuka `http://localhost:3000/health`.

## 🌐 Link Hasil Deployment Vercel

- **Base URL:** https://perpustakaan-peminjaman-api.vercel.app
- **Health Check:** https://perpustakaan-peminjaman-api.vercel.app/health
- **Contoh Filter:** https://perpustakaan-peminjaman-api.vercel.app/loans?status=Terlambat

## 📝 Lisensi

MIT