# Ketentuan Tes Developer APBATECH

- Waktu: 120 menit.
- Simpan jawaban di repo online (GitHub/GitLab/Bitbucket), kirim link repo saja.

## A. Soal Backend (PHP Laravel/NodeJS)

### 1. Buat Table (Nama Bebas)
Contoh struktur table "users":
| # | Name     | Datatype | Length/Set |
|---|----------|----------|------------|
| 1 | id_user  | VARCHAR  | 50         |
| 2 | username | VARCHAR  | 50         |
| 3 | password | VARCHAR  | 80         |
| 4 | nama     | VARCHAR  | 100        |
| 5 | hakakses | VARCHAR  | 20         |
| 6 | kdlink   | VARCHAR  | 10         |
| 7 | kdcbang  | VARCHAR  | 10         |

### 2. Buat REST API
- Metode testing: Postman atau sejenis, sertakan sample pengujian.
- Operasi: INSERT, UPDATE, DELETE, READ.
- Contoh JSON Response (dari screenshot):
  - INSERT: Data input seperti username, password, dll., response success.
  - UPDATE: Update field seperti username.
  - DELETE: Hapus berdasarkan ID.
  - READ: List data users.

### 3. Soal Enkripsi Data Backend
- Buat login dengan table di atas, hasil enkripsi AES-256-CBC.
- Token JWT tersimpan di cookie (1 hari).
- Buat API untuk decrypt hasil enkripsi.
- Pasang middleware validasi saat user logout (response: "Logout sukses" atau unauthorized jika token invalid).
- Contoh: Login Postman dengan data enkripsi, tampilkan token di cookie.

### 4. Script Array
- Array1 = [2, 5, 8, 9]
- Array2 = [1, 2, 3, 4, 5, 6, 7]
- Ubah menjadi Array3 = [1, 3, 4, 6, 7] (difference Array2 minus Array1).

### 5. Script String
- Input: "PT.AbadI*perKASa@BeRsAmA-DIGItAL#SolUTiONs"
- Output: "PT. Abadi Perkasa Bersama Digital Solutions" (bersihkan special char, capitalize proper).

### 6. Konversi Nominal ke Terbilang
- Nominal: Rp.10.113.199,50
- Terbilang: "Sepuluh Juta Seratus Tiga Belas Ribu Seratus Sembilan Puluh Sembilan Koma Lima Puluh Rupiah".

## B. Front End
- Buat CRUD dari soal 1 dan 2 menggunakan Angular 12 secara visual.

## C. Mobile Dev
- Buat CRUD dari soal 1 dan 2 menggunakan Java Kotlin secara visual.
- Bonus: Gunakan state management (BLOC, Provider, GetX, atau RXDart).