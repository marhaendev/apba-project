# APBA Project (Fullstack Assessment)

Aplikasi Fullstack modern yang dibangun untuk memenuhi persyaratan tes teknis, mencakup Backend (Node.js/Express) dan Frontend (Angular 19) dengan desain sistem custom "ZardUI".

## 🚀 Fitur Utama

- **Monorepo Structure**: Mengelola backend dan frontend dalam satu repositori dengan npm workspaces.
- **Concurrent Execution**: Menjalankan kedua sisi aplikasi hanya dengan satu perintah.
- **Advanced Authentication**:
  - JWT disimpan aman dalam **HttpOnly Cookie**.
  - Dukungan **Enkripsi AES-256-CBC** untuk payload login.
  - **Auto-Logout** saat token kadaluarsa (Interceptor).
  - Role-based Access Control (Admin vs User).
- **ZardUI Design System**: Desain antarmuka custom yang bersih, modern, dan responsif (tanpa dependensi UI library berat).
- **Logic Tests**: Endpoint khusus untuk transformasi Array, String, dan Terbilang.

---

## 🛠 Teknologi

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 (dengan Sequelize ORM)
- **Security**: `jsonwebtoken` (JWT), `crypto` (AES Encryption)
- **Validasi**: Custom validation logic

### Frontend
- **Framework**: Angular 19 (Latest)
- **Styling**: Vanilla CSS dengan variabel CSS modern (ZardUI Design System - Tailwind-like utility classes)
- **State Management**: Angular Signals
- **HTTP**: `HttpClient` dengan `AuthInterceptor` & `Proxy`

---

## 📋 Prasyarat

- **Node.js**: v18 atau lebih baru (Disarankan v20/v24).
- **NPM**: Bawaan Node.js.

---

## ⚙️ Instalasi & Konfigurasi

1.  **Clone & Install Dependencies**
    Jalankan perintah ini di root folder:
    ```bash
    npm install
    ```
    *Ini akan otomatis menginstall dependencies untuk root, backend, dan frontend.*

2.  **Konfigurasi Environment Backend**
    Buat file `.env` di **root folder** aplikasi:
    ```bash
    cp .env.example .env 
    # Atau buat manual dengan isi:
    ```
    
    Isi `.env` (di root):
    ```env
    PORT=3001
    SECRET_KEY=rahasia_negara_api_123
    JWT_EXPIRY_SECONDS=86400  # 1 Hari
    ```

---

## ▶️ Menjalankan Aplikasi

Aplikasi sekarang menggunakan konfigurasi dinamis dari file `.env` di root.

### 1. Backend
- Jalankan `npm run dev` (atau `npm run dev -w backend`).
- Server akan berjalan di port yang ditentukan di `BACKEND_PORT` (default: 3001).

### 2. Frontend
- Jalankan `npm start -w frontend`.
- Frontend akan berjalan di port `FRONTEND_PORT` (default: 4200) dan otomatis melakukan proxy ke backend.

### 3. Mobile
- Konfigurasi API terpusat di `mobile/lib/config.dart`.
- Pastikan nilainya sama dengan `MOBILE_API_URL` di `.env` (khususnya IP address jika tes di HP fisik).

Perintah `npm run dev` di root tetap bisa digunakan untuk menjalankan keduanya secara bersamaan.

---

## 🔐 Akun Demo (Seeding)

Saat pertama kali dijalankan, database akan di-reset dan diisi data dummy:

| Role  | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `password123$` |
| **User** | `user1` | `password123$` |

---

## 📂 Struktur Proyek

```
/
├── backend/                # Express App
│   ├── middleware/         # Auth & Middleware
│   ├── models/            # Sequelize Models (User)
│   ├── routes/            # API Routes (Auth, Users, Logic)
│   ├── index.js           # Server Entry Point
│   └── database.sqlite    # SQLite DB File
│
├── frontend/               # Angular App
│   ├── src/app/
│   │   ├── components/    # Login, UserList, UserForm
│   │   ├── services/      # AuthService, UserService
│   │   └── interceptors/  # AuthInterceptor (Auto Logout)
│   ├── src/styles.css     # ZardUI Global Styles
│   └── proxy.conf.json    # Config Proxy ke Backend
│
└── package.json            # Root configuration (Workspaces)
```

## 🧪 Dokumentasi API & Testing

Untuk dokumentasi lengkap endpoint API dan cara testing menggunakan cURL, silakan lihat file:
👉 **[docs/api.md](./docs/api.md)**
