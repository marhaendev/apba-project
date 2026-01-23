# Skenario Pengujian API

Base URL: `http://localhost:3001/api`

**Penting**:
1.  **Cookies**: Gunakan `-c cookies.txt` untuk **MENYIMPAN** cookie saat login, dan `-b cookies.txt` untuk **MENGIRIM** cookie pada request yang memerlukan autentikasi.
2.  **PowerShell**: Gunakan `curl.exe` alih-alih `curl` (karena `curl` di PowerShell adalah alias untuk `Invoke-WebRequest`).

---

## 1. Setup (Skenario Login)

### A. Login sebagai Admin
*Menyimpan token ke `admin_cookies.txt`*
```bash
curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"admin123$\"}" -c admin_cookies.txt
```

### B. Login sebagai User (Hasan)
*Menyimpan token ke `user_cookies.txt`*
```bash
curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d "{\"username\": \"hasan\", \"password\": \"hasan123$\"}" -c user_cookies.txt
```

### C. Logout
```bash
curl -X POST http://localhost:3001/api/logout -b admin_cookies.txt
```

---

## 2. Route Terlindungi (Khusus Admin)

**Tujuan**: Memverifikasi bahwa Admin dapat melakukan Create, Update, dan Delete.

### Membuat User (Sebagai Admin) -> BERHASIL
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"username\": \"testadmin\", \"password\": \"pass\", \"nama\": \"Test Admin\", \"hakakses\": \"user\"}" -b admin_cookies.txt
```

### Memperbarui User (Sebagai Admin) -> BERHASIL
*(Target ID 2 = Hasan)*
```bash
curl -X PUT http://localhost:3001/api/users/2 -H "Content-Type: application/json" -d "{\"nama\": \"Hasan Terupdate\"}" -b admin_cookies.txt
```

### Menghapus User (Sebagai Admin) -> BERHASIL
*(Gunakan ID yang ada di DB Anda, contoh: ID user baru yang dibuat)*
```bash
curl -X DELETE http://localhost:3001/api/users/8 -b admin_cookies.txt
```

---

## 3. Route Terlindungi (User / Non-Admin)

**Tujuan**: Memverifikasi bahwa User Biasa mendapatkan error **403 Forbidden**.

### Membuat User (Sebagai Hasan) -> GAGAL (403)
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"username\": \"failprop\", \"password\": \"pass\", \"nama\": \"Gagal\", \"hakakses\": \"user\"}" -b user_cookies.txt
```

### Menghapus User (Sebagai Hasan) -> GAGAL (403)
```bash
curl -X DELETE http://localhost:3001/api/users/1 -b user_cookies.txt
```

---

## 4. Route Terlindungi (Publik / Guest)

**Tujuan**: Memverifikasi bahwa Guest (tanpa cookie) mendapatkan error **401 Unauthorized**.

### Membuat User (Tanpa Cookie) -> GAGAL (401)
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"username\": \"ghost\", \"password\": \"pass\", \"nama\": \"Hantu\", \"hakakses\": \"user\"}"
```

---

## 5. Route Publik

**Tujuan**: Dapat diakses oleh siapa saja tanpa login.

### Mengambil Daftar User
```bash
curl -X GET http://localhost:3001/api/users
```

### Tes Logika: Array (Transformasi Data)
```bash
curl -X GET http://localhost:3001/api/logic/array
```

### Tes Logika: String (Manipulasi Teks)
```bash
curl -X GET "http://localhost:3001/api/logic/string?input=PT.AbadI*perKASa@BeRsAmA-DIGItAL%23SolUTiONs"
```

### Tes Logika: Terbilang (Konversi Angka ke Kata)
```bash
curl -X GET "http://localhost:3001/api/logic/terbilang?nominal=50000"
```