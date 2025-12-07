# MovieList — Mobile App

Aplikasi mobile untuk mencari film dan series, melihat detail lengkap, serta menyimpan film favorit ke local storage. Dibangun menggunakan React Native + Expo.

---

## Cara instalasi & Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone <repo-url>
cd MovieList
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup API Key

Buat file `.env` pada root project, lalu isi:

```ini
OMDB_API_KEY=your_api_key
```

### 4. Jalankan Aplikasi

```bash
npx expo start
```

### 5. Jalankan di Emulator atau Device yang Digunakan

#### a. Android Studio / Emulator

Jalankan Emulator di terminal yang digunakan dengan:

```bash
emulator -avd nama_emulator
```

Lalu di Expo CLI, pilih `a` untuk membuka aplikasi Expo di emulator:

```bash
a
```

#### b. Expo Go (Real Device)

- Install aplikasi Expo Go di Android/iOS
- Jalankan:

```bash
npx expo start
```

Scan QR Code melalui kamera / Expo Go

---

## Alur Navigasi & Interaksi Aplikasi

### 1. Homepage

- User dapat klik salah satu film untuk menuju halaman detail dari film tersebut.
- Halaman utama menampilkan search bar dan juga daftar film yang terbagi menjadi beberapa section:

#### a. Search Movie

- Pengguna dapat mencari film atau series berdasarkan judul.
- Aplikasi melakukan fetch data berdasarkan query pencarian.
- Hasil pencarian akan muncul dalam bentuk list horizontal.

#### b. Latest Movies

- Menampilkan daftar film terbaru yang diambil dari API.

#### c. Recommended Series

- Menampilkan rekomendasi series pilihan dalam list horizontal.

#### d. Recommended Movies

- Menampilkan rekomendasi film pilihan dalam list horizontal.

### 2. Detail Page

Halaman detail menampilkan informasi lengkap dari film atau series berdasarkan `imdbID`.

Data yang ditampilkan mencakup:

- Title
- Year
- Poster
- IMDB Rating
- Plot / Sinopsis
- Director
- Writer
- Rated
- Genre
- Main Actors
- Type (movie / series)
- Runtime
- Released

Tersedia juga tombol untuk:

- Menambahkan ke halaman Saved
- Menghapus dari halaman Saved jika sudah tersimpan

### 3. Saved Page

Halaman untuk menampilkan semua film dan series yang telah disimpan pengguna melalui AsyncStorage.

Fitur:

- Menampilkan daftar item yang tersimpan
- Navigasi ke halaman detail
- Data akan tetap tersimpan meskipun aplikasi ditutup

---

## Pembagian Tugas Anggota Tim

### 1. Raihan

Backend / Navigation & API Intergration:

- Implementasi navigasi antar halaman (Home → Detail → Saved).
- Integrasi dan pengolahan API OMDb (fetch search, latest movies, rekomendasi).
- Membuat fungsi penyimpanan data film (fitur Save) menggunakan AsyncStorage.
- Membuat dan menghubungkan endpoint fetch detail berdasarkan imdbID.
- Membuat seluruh halaman dasar (Home, Detail, Saved) sebelum styling.
- Membuat fitur pencarian film (search query → fetch → render hasil).

### 2. Arrafi

Frontend / State Logic & UI Implementation:

- Mengatur state logic untuk Home, Detail, dan Saved Page.
- Merealisasikan desain UI/UX ke komponen React Native.
- Membuat fitur rating tampil dalam bentuk bintang, bukan hanya angka.
- Mengelompokkan data film di Homepage menjadi beberapa kategori (Latest Movies, Recommended Series, Recommended Movies, Search Result).
- Membuat list film tampil dalam bentuk horizontal scroll.
- Implementasi layout, komponen visual, dan styling agar konsisten.

### 3. Fadli

UI/UX Designer & Presentation

- Mendesain tampilan mobile app.
- Menentukan layout, warna, typography, dan struktur visual aplikasi.
- Menyusun alur interaksi pengguna agar mudah dipahami.
- Membuat materi presentasi akhir (slide, visual demo, penjelasan fitur).
- Mendukung frontend saat mengubah desain ke komponen React Native.

---

## Struktur Folder

```bash
.
├── .idea/
│ ├── caches/
│ │   └── deviceStreaming.xml
│ ├── deviceManager.xml
│ ├── misc.xml
│ ├── modules.xml
│ ├── movie-list-website.iml
│ └── vcs.xml
├── app/
│ ├── components/
│ │   └── StarRating.tsx
│ ├── detail/
│ │   └── [id]/
│ │       └── index.tsx
│ ├── savedMovie/
│ │   └── index.tsx
│ ├── _layout.tsx
│ └── index.tsx
├── .env
└── README.md
```

---

## API

Aplikasi menggunakan API OMDb.  
API Key disimpan di file `.env`.

```bash
OMDB_API_KEY=your_api_key
```

Diakses dengan cara:

```tsx
const API_KEY = Constants.expoConfig?.extra?.OMDB_API_KEY;
```

---
