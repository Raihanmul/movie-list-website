# MovieList — Mobile App

Aplikasi mobile untuk mencari film dan series, melihat detail lengkap, serta menyimpan film favorit ke local storage. Dibangun menggunakan React Native + Expo.

---

## Fitur Utama

### Home Page

Halaman utama aplikasi terdiri dari beberapa section:

#### Search Movie

- Pengguna dapat mencari film atau series berdasarkan judul.
- Aplikasi melakukan fetch data berdasarkan query pencarian.
- Hasil pencarian akan muncul dalam bentuk list.

#### Latest Movies

- Menampilkan daftar film terbaru yang diambil dari API.

#### Recommended Series

- Menampilkan rekomendasi series pilihan dalam list horizontal.

#### Recommended Movies

- Menampilkan rekomendasi film pilihan dalam list horizontal.

---

## Detail Page

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

- Menambahkan ke Saved
- Menghapus dari Saved jika sudah tersimpan

---

## Saved Page

Halaman untuk menampilkan semua film dan series yang telah disimpan pengguna melalui AsyncStorage.

Fitur:

- Menampilkan daftar item tersimpan
- Navigasi ke halaman detail
- Data akan tetap tersimpan meskipun aplikasi ditutup

---

## Teknologi yang Digunakan

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Axios](https://axios-http.com/)
- AsyncStorage
- React Navigation

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
API Key disimpan di file `.env`:

```bash
OMDB_API_KEY=your_api_key
```

Import di code:

```tsx
const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
```

---

## Instalasi

```bash
git clone <repo-url>
cd MovieList
npm install
npm start
```
