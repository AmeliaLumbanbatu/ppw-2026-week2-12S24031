# Tugas Mandiri Praktikum PPW Week 3 - Refactoring Portfolio dengan Bootstrap 5 & Custom CSS

Repositori ini berisi pengerjaan Tugas Mandiri Praktikum **Pemrograman dan Pengujian Aplikasi Web (PPW)** Minggu 03, Program Studi S1 Sistem Informasi - Institut Teknologi Del. Proyek ini merupakan hasil *refactoring* dari Tugas Minggu 02 menggunakan Bootstrap 5.3+ dan Custom CSS Overrides.

## 👤 Identitas Mahasiswa
- **Nama:** Amelia Renata Lumbanbatu
- **Program Studi:** S1 Sistem Informasi (2024)
- **Institusi:** Institut Teknologi Del
- **LinkedIn:** [Amelia Renata Lumbanbatu](https://www.linkedin.com/in/amelia-renata-lumbanbatu-867936364)

---

## 📊 Tabel Komparasi: Sebelum vs Sesudah Integrasi Framework

| Parameter Evaluasi | Sebelum (Week 2 - CSS Murni) | Sesudah (Week 3 - Bootstrap 5 + Custom CSS) |
| :--- | :--- | :--- |
| **Sistem Tata Letak (Layout)** | Menulis aturan `@media` manual dan CSS Grid kustom. | Menggunakan Sistem Grid Responsif 12-Kolom (`row`, `col-md-*`, `row-cols-*`). |
| **Komponen Navigasi** | Navbar statis dengan penataan Flexbox dasar. | Responsive Navbar Sticky dengan tombol *hamburger collapse* interaktif pada *mobile*. |
| **Kartu Proyek (Cards)** | Kartu statis menggunakan penataan CSS Box Model dasar. | Kartu interaktif Bootstrap (`.card`) yang terintegrasi dengan pemicu Modal Dialog (`data-bs-toggle="modal"`). |
| **Komponen Formulir** | Formulir HTML5 standar dengan *styling* manual. | Floating Labels (`.form-floating`), Input Groups berikon, dan visual feedback validasi (`.invalid-feedback`). |
| **Manajemen Tema (Theming)** | Variabel CSS kustom terbatas. | Arsitektur 6 Variabel CSS pada `:root` yang menimpa (*override*) komponen Bootstrap secara elegan tanpa `!important`. |

---

## 🛠️ Ringkasan Pembaruan Spesifikasi
1. **Bootstrap 5.3 CDN & Icons:** Terintegrasi CSS & JS Bundle terbaru via CDN dan Bootstrap Icons.
2. **Responsive Grid & Modal:** 4 Kartu Proyek responsif yang terhubung ke Modal Pop-Up detail proyek.
3. **Form Modern & Validasi:** Menggunakan Floating Labels dan JavaScript *validation feedback*.
4. **Custom CSS Overrides:** Mendefinisikan 6 variabel di `:root` untuk identitas warna kustom.