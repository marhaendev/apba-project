# APBA Project (Fullstack Assessment)

Aplikasi Fullstack modern yang dibangun untuk memenuhi persyaratan tes teknis, mencakup Backend (Node.js/Express), Frontend (Angular 19), dan Aplikasi Mobile (Flutter) dengan desain sistem custom "ZardUI".

## 🚀 Fitur Utama

*   **Monorepo Structure**: Mengelola backend dan frontend dalam satu repositori dengan npm workspaces.
*   **Concurrent Execution**: Menjalankan kedua sisi aplikasi hanya dengan satu perintah.
*   **Advanced Authentication**:
    *   JWT disimpan aman dalam **HttpOnly Cookie**.
    *   Dukungan **Enkripsi AES-256-CBC** untuk payload login.
    *   **Auto-Logout** saat token kadaluarsa (Interceptor).
    *   Role-based Access Control (Admin vs User).
*   **ZardUI Design System**: Desain antarmuka custom yang bersih, modern, dan responsif (tanpa dependensi UI library berat).
*   **Logic Tests**: Endpoint khusus untuk transformasi Array, String, dan Terbilang.

* * *

## 🛠 Teknologi

### Backend

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: SQLite3 (dengan Sequelize ORM)
*   **Security**: `jsonwebtoken` (JWT), `crypto` (AES Encryption)
*   **Validasi**: Custom validation logic

### Frontend

*   **Framework**: Angular 19 (Latest)
*   **Styling**: Vanilla CSS dengan variabel CSS modern (ZardUI Design System - Tailwind-like utility classes)
*   **State Management**: Angular Signals
*   **HTTP**: `HttpClient` dengan `AuthInterceptor` & `Proxy`

### Mobile

*   **Framework**: Flutter
*   **State Management**: GetX
*   **API Integration**: `http` package
*   **Configuration**: `flutter_dotenv` (Membaca file `.env` root)

* * *

## 📋 Prasyarat

*   **Node.js**: v18 atau lebih baru (Disarankan v20/v24).
*   **NPM**: Bawaan Node.js.
*   **Flutter SDK**: Versi stable terbaru (untuk aplikasi mobile).
*   **Android Studio / Xcode**: Untuk menjalankan emulator/perangkat fisik.

* * *

## ⚙️ Instalasi & Konfigurasi

1. **Clone Repositori**:
```bash
git clone https://github.com/marhaendev/apba-project.git
cd apba-project
```

2. **Install Dependensi**:
Cukup jalankan satu perintah untuk menginstall seluruh dependensi (Root, Backend, Frontend):

```bash
npm install
```

### 🌍 Konfigurasi Environment
Buat file `.env` di **root folder** (atau copy dari `.env.example`):

```bash
cp .env.example .env
```

Pastikan variabel berikut sesuai:
- `BACKEND_PORT`: 3001
- `FRONTEND_PORT`: 4200
- `MOBILE_API_URL`: URL API untuk Flutter (Gunakan IP Lokal jika tes di peranti fisik)

---

## ▶️ Menjalankan Aplikasi

Anda dapat menjalankan backend dan frontend secara bersamaan dengan satu perintah dari root folder:

### 💻 Web (Backend & Frontend)
```bash
npm run dev
```
- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:4200` (Sudah terkonfigurasi Auto-Proxy ke backend)

### 📱 Mobile (Flutter)
Jalankan perintah berikut di folder `mobile`:
```bash
cd mobile
flutter pub get
flutter run
```


* * *

## 🔐 Akun Demo (Seeding)

Saat pertama kali dijalankan, database akan di-reset dan diisi data dummy:

| Role | Username | Password |
| :-- | :-- | :-- |
| **Admin** | `admin` | `admin123$` |
| **User** | `user1` | `password123$` |

* * *

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
│   └── proxy.conf.js      # Dynamic Proxy Config
│
├── mobile/                 # Flutter Mobile App
│   ├── lib/
│   │   ├── config.dart     # Konfigurasi API (Dotenv)
│   │   ├── login.dart      # UI & Logika Login
│   │   ├── dashboard.dart  # UI & Logika CRUD User
│   │   └── main.dart       # Entry Point & Dotenv Init
│   └── pubspec.yaml        # Flutter Dependencies
│
└── package.json            # Root configuration (Workspaces)
```

## 🧪 Dokumentasi API & Testing

Untuk dokumentasi lengkap endpoint API dan cara testing menggunakan cURL, silakan lihat file: 👉 **[docs/api.md](./docs/api.md)**