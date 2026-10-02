# DESIGN BRIEF

# Sistem Manajemen Perpustakaan Berbasis Web

**Versi:** 1.0\
**Platform:** Web\
**Framework yang direncanakan:** Laravel\
**Status:** Design Brief / UI Specification\
**Target:** Mahasiswa, siswa, guru, dosen, dan admin/petugas
perpustakaan

------------------------------------------------------------------------

## 1. Ringkasan Produk

Sistem Manajemen Perpustakaan adalah aplikasi berbasis web yang
digunakan untuk mengelola kegiatan perpustakaan secara terintegrasi,
mulai dari pengelolaan data buku dan anggota sampai proses peminjaman,
pengembalian, denda, pembayaran denda, serta laporan.

Sistem dirancang agar:

-   mudah digunakan oleh anggota perpustakaan;
-   membantu admin/petugas mengelola data secara terpusat;
-   mempercepat proses peminjaman dan pengembalian;
-   menampilkan status buku dan transaksi dengan jelas;
-   mengurangi kesalahan pencatatan manual;
-   menyediakan laporan yang dapat dicetak atau diekspor.

------------------------------------------------------------------------

# 2. Tujuan Desain

## 2.1 Tujuan Utama

Desain antarmuka harus membuat pengguna dapat menyelesaikan tugas utama
dengan cepat, jelas, dan minim kesalahan.

Tugas utama:

1.  Login ke sistem.
2.  Mencari buku.
3.  Melihat detail dan ketersediaan buku.
4.  Melakukan peminjaman.
5.  Melihat status dan riwayat peminjaman.
6.  Memproses pengembalian.
7.  Mengelola keterlambatan dan denda.
8.  Mencatat pembayaran denda.
9.  Mengelola data buku, kategori, dan anggota.
10. Melihat, mencetak, dan mengekspor laporan.

## 2.2 Prinsip Desain

### Simple First

Tampilan dibuat sederhana dan tidak membebani pengguna dengan informasi
yang tidak diperlukan.

### Data First

Informasi penting seperti status buku, jumlah stok, tanggal jatuh tempo,
dan status denda harus mudah ditemukan.

### Action Oriented

Tombol tindakan utama harus terlihat jelas dan berada dekat dengan
informasi yang berkaitan.

### Consistent

Komponen, warna, ukuran, spacing, istilah, dan pola interaksi digunakan
secara konsisten di seluruh halaman.

### Error Prevention

Sistem memberikan validasi dan konfirmasi sebelum tindakan penting
dilakukan.

------------------------------------------------------------------------

# 3. Target Pengguna

## 3.1 Anggota

Anggota dapat terdiri dari:

-   Siswa
-   Mahasiswa
-   Guru
-   Dosen

### Kebutuhan Anggota

-   mencari buku;
-   melihat detail buku;
-   melihat ketersediaan buku;
-   melakukan peminjaman;
-   melihat buku yang sedang dipinjam;
-   melihat tanggal jatuh tempo;
-   melihat riwayat peminjaman;
-   melihat denda jika ada;
-   melihat profil.

### Batas Peminjaman

  Jenis Anggota     Maksimal Buku
  --------------- ---------------
  Siswa                         5
  Mahasiswa                     5
  Guru                         10
  Dosen                        10

### Lama Peminjaman

Masa peminjaman standar adalah **7 hari**.

------------------------------------------------------------------------

## 3.2 Admin/Petugas

Admin/petugas bertanggung jawab terhadap pengelolaan sistem.

### Kebutuhan Admin

-   mengelola buku;
-   mengelola kategori;
-   mengelola anggota;
-   memproses peminjaman;
-   memproses pengembalian;
-   mengelola denda;
-   mencatat pembayaran denda;
-   melihat dashboard;
-   membuat laporan;
-   mencetak dan mengekspor laporan.

------------------------------------------------------------------------

# 4. Struktur Informasi

## 4.1 Navigasi Admin

``` text
Dashboard
│
├── Katalog Buku
│
├── Manajemen
│   ├── Buku
│   ├── Kategori
│   └── Anggota
│
├── Transaksi
│   ├── Peminjaman
│   ├── Pengembalian
│   └── Denda
│
├── Laporan
│
├── Profil
│
└── Logout
```

## 4.2 Navigasi Anggota

``` text
Dashboard
│
├── Katalog Buku
│
├── Peminjaman Saya
│
├── Riwayat Peminjaman
│
├── Profil
│
└── Logout
```

------------------------------------------------------------------------

# 5. Design Direction

## 5.1 Karakter Visual

Arah visual:

-   Modern
-   Akademik
-   Profesional
-   Bersih
-   Terpercaya
-   Fungsional
-   Tidak terlalu dekoratif

Desain harus terasa seperti aplikasi administrasi akademik modern, bukan
seperti website promosi.

## 5.2 Gaya Layout

Menggunakan pola:

``` text
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Sidebar      │ Content                                      │
│              │                                              │
│ Navigation   │ Page title                                   │
│              │ Actions                                      │
│              │ Filters                                      │
│              │ Main content                                 │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

Desktop menggunakan sidebar tetap.

Mobile menggunakan sidebar yang dapat dibuka melalui menu/hamburger.

------------------------------------------------------------------------

# 6. Design System

## 6.1 Color Tokens

  Token        Hex         Penggunaan
  ------------ ----------- ----------------------------------------
  Primary      `#3730A3`   Tombol utama, link aktif, elemen utama
  Background   `#F8FAFC`   Background halaman
  Surface      `#FFFFFF`   Card, modal, tabel, form
  Text         `#172033`   Teks utama
  Secondary    `#64748B`   Teks sekunder
  Success      `#15803D`   Berhasil, tersedia, lunas
  Warning      `#D97706`   Peringatan, mendekati jatuh tempo
  Error        `#DC2626`   Error, terlambat, denda
  Info         `#0369A1`   Informasi

## 6.2 Typography

Font utama:

**Inter**

Hierarki:

``` text
H1     32px / Bold
H2     24px / Bold
H3     20px / Semibold
H4     18px / Semibold
Body   14–16px / Regular
Small  12–13px / Regular
Button 14px / Medium
```

Penggunaan:

-   H1 untuk judul halaman utama.
-   H2 untuk bagian besar.
-   H3/H4 untuk subbagian atau card.
-   Body untuk informasi utama.
-   Small untuk metadata dan keterangan.

------------------------------------------------------------------------

# 7. Spacing System

Menggunakan base spacing **4px**.

``` text
4px   = xs
8px   = sm
12px  = md
16px  = lg
24px  = xl
32px  = 2xl
40px  = 3xl
48px  = 4xl
```

Prinsip:

-   Padding card minimal 16px.
-   Jarak antar section utama 24--32px.
-   Jarak label dengan input 6--8px.
-   Jarak antar tombol 8--12px.

------------------------------------------------------------------------

# 8. Border Radius

``` text
6px   Small control
8px   Button / Input
12px  Card
16px  Large container / modal
```

Gunakan radius secara konsisten.

------------------------------------------------------------------------

# 9. Shadow

Gunakan shadow secara ringan.

``` text
Card:
shadow ringan

Modal:
shadow lebih kuat

Sidebar:
border atau shadow sangat ringan
```

Jangan menggunakan shadow berat pada semua elemen.

------------------------------------------------------------------------

# 10. Iconography

Gunakan ikon yang sederhana dan mudah dikenali.

Contoh:

  Fungsi         Ikon
  -------------- -------------
  Dashboard      Home
  Buku           Book
  Kategori       Tags
  Anggota        Users
  Peminjaman     BookOpen
  Pengembalian   RotateCcw
  Denda          CircleAlert
  Laporan        FileText
  Cari           Search
  Tambah         Plus
  Edit           Pencil
  Hapus          Trash
  Cetak          Printer
  Export         Download
  Profil         User

Ikon tidak boleh menggantikan label pada tindakan yang membutuhkan
pemahaman jelas.

------------------------------------------------------------------------

# 11. Button System

## Primary Button

Digunakan untuk tindakan utama.

Contoh:

``` text
+ Peminjaman Baru
Simpan
Bayar Denda
Pinjam Buku
```

## Secondary Button

Untuk tindakan alternatif.

``` text
Batal
Kembali
Reset
```

## Danger Button

Untuk tindakan berisiko.

``` text
Hapus
Batalkan Transaksi
```

Harus menggunakan konfirmasi sebelum penghapusan data penting.

------------------------------------------------------------------------

# 12. Status Badge

Status harus menggunakan teks + warna.

Contoh:

``` text
[ Tersedia ]
[ Dipinjam ]
[ Terlambat ]
[ Menunggu ]
[ Selesai ]
[ Lunas ]
[ Belum Dibayar ]
```

Jangan hanya menggunakan warna tanpa teks.

------------------------------------------------------------------------

# 13. Komponen Utama

## 13.1 Sidebar

Isi:

``` text
LOGO
Nama Perpustakaan

Dashboard

Katalog Buku

MANAJEMEN
  Buku
  Kategori
  Anggota

TRANSAKSI
  Peminjaman
  Pengembalian
  Denda

Laporan

Profil

Logout
```

Sidebar desktop:

-   lebar sekitar 240px;
-   posisi tetap;
-   item aktif memiliki indikator visual;
-   submenu dapat digunakan untuk kelompok menu.

------------------------------------------------------------------------

## 13.2 Header

Isi:

``` text
☰ / Page Title          Search     Notification     Profile
```

Fungsi:

-   pencarian;
-   notifikasi;
-   akses profil;
-   menu mobile.

------------------------------------------------------------------------

## 13.3 Page Header

Pola:

``` text
Judul Halaman
Deskripsi singkat

[Filter / Search]             [Primary Action]
```

------------------------------------------------------------------------

## 13.4 Card

Card digunakan untuk:

-   statistik;
-   informasi buku;
-   informasi anggota;
-   ringkasan transaksi;
-   informasi denda.

------------------------------------------------------------------------

## 13.5 Data Table

Kolom tabel harus:

-   jelas;
-   tidak terlalu banyak;
-   dapat diurutkan jika diperlukan;
-   mendukung pagination;
-   memiliki action column.

Contoh:

``` text
No | Data | Status | Tanggal | Action
```

------------------------------------------------------------------------

## 13.6 Search

Search harus mendukung pencarian berdasarkan data yang relevan.

Contoh katalog:

``` text
[ 🔍 Cari judul, penulis, atau ISBN... ]
```

------------------------------------------------------------------------

## 13.7 Filter

Filter menggunakan:

-   kategori;
-   status;
-   tanggal;
-   jenis anggota;
-   status pembayaran.

------------------------------------------------------------------------

# 14. Halaman Login

## Tujuan

Memberikan akses aman ke sistem.

## Struktur

``` text
┌─────────────────────────────────────────┐
│                                         │
│              LOGO PERPUSTAKAAN          │
│                                         │
│       Sistem Manajemen Perpustakaan     │
│                                         │
│ Email                                    │
│ [_______________________________]       │
│                                         │
│ Password                                 │
│ [_______________________________]       │
│                                         │
│ [ ] Ingat saya                          │
│                                         │
│ [          MASUK          ]             │
│                                         │
│ Pesan error jika login gagal            │
│                                         │
└─────────────────────────────────────────┘
```

## State

-   Default
-   Focus
-   Error
-   Loading
-   Success

## Validasi

-   Email wajib diisi.
-   Password wajib diisi.
-   Format email harus valid.
-   Kredensial salah menampilkan pesan yang jelas.

------------------------------------------------------------------------

# 15. Dashboard

## Tujuan

Memberikan gambaran cepat kondisi perpustakaan.

## Struktur

``` text
Dashboard

Selamat datang, [Nama]

[ Total Buku ]
[ Total Anggota ]
[ Sedang Dipinjam ]
[ Terlambat ]

Aktivitas Transaksi
┌──────────────────────────────────────────┐
│ Aktivitas terbaru                        │
└──────────────────────────────────────────┘

Peminjaman Terbaru
┌──────────────────────────────────────────┐
│ Anggota | Buku | Tanggal | Status        │
└──────────────────────────────────────────┘

[ + Peminjaman Baru ]
```

## Statistik

Minimal:

-   Total Buku
-   Total Anggota
-   Sedang Dipinjam
-   Terlambat

## Empty State

Jika belum ada transaksi:

``` text
Belum ada transaksi
Data transaksi akan muncul di sini.
```

------------------------------------------------------------------------

# 16. Katalog Buku

## Tujuan

Memudahkan pengguna menemukan buku.

## Struktur

``` text
Katalog Buku

[ 🔍 Cari buku... ]

[ Semua Kategori ] [ Semua Status ]

┌────────────┐ ┌────────────┐ ┌────────────┐
│   COVER    │ │   COVER    │ │   COVER    │
│            │ │            │ │            │
├────────────┤ ├────────────┤ ├────────────┤
│ Judul      │ │ Judul      │ │ Judul      │
│ Penulis    │ │ Penulis    │ │ Penulis    │
│ [Tersedia] │ │ [Dipinjam] │ │ [Tersedia] │
│ [Detail]   │ │ [Detail]   │ │ [Detail]   │
└────────────┘ └────────────┘ └────────────┘
```

Admin mendapatkan tombol:

``` text
+ Tambah Buku
```

## Informasi Buku

-   Cover
-   Judul
-   Penulis
-   Kategori
-   Status
-   Ketersediaan

ISBN bersifat opsional.

Cover buku diperlukan.

------------------------------------------------------------------------

# 17. Detail Buku

## Struktur

``` text
Detail Buku

┌───────────────┬──────────────────────────────┐
│               │ Judul Buku                  │
│    COVER      │ Penulis                     │
│               │ Kategori                    │
│               │ Penerbit                    │
│               │ Tahun                       │
│               │ ISBN                        │
│               │ Status                      │
│               │ Stok                        │
│               │                              │
│               │ [ Pinjam Buku ]             │
└───────────────┴──────────────────────────────┘

Deskripsi Buku
──────────────────────────────────────────────
...
```

Jika buku tidak tersedia:

``` text
[ Tidak Tersedia ]
```

Tombol pinjam dinonaktifkan.

------------------------------------------------------------------------

# 18. Peminjaman

## 18.1 Daftar Peminjaman

``` text
Peminjaman

[ 🔍 Cari transaksi ] [Status] [Tanggal]

[ + Peminjaman Baru ]

┌─────────────────────────────────────────────┐
│ ID | Anggota | Buku | Tgl Pinjam | Status  │
├─────────────────────────────────────────────┤
│ ...                                         │
└─────────────────────────────────────────────┘
```

## 18.2 Peminjaman Baru

Gunakan stepper.

``` text
01 Anggota → 02 Buku → 03 Konfirmasi
```

### Step 1 --- Pilih Anggota

``` text
Cari anggota
[____________________________]

Nama:
Jenis:
Buku aktif:
Batas:
```

Batas:

-   Siswa: 5
-   Mahasiswa: 5
-   Guru: 10
-   Dosen: 10

### Step 2 --- Pilih Buku

``` text
Cari buku
[____________________________]

☑ Buku A
☑ Buku B
☐ Buku C

Buku dipilih: 2
Batas maksimal: 5
```

Satu transaksi dapat berisi beberapa buku.

### Step 3 --- Konfirmasi

``` text
Anggota
Nama anggota
Jenis anggota

Buku
1. Buku A
2. Buku B

Tanggal Pinjam
[01/10/2026]

Tanggal Jatuh Tempo
[08/10/2026]

[ Kembali ] [ Konfirmasi Peminjaman ]
```

Sistem secara otomatis menghitung jatuh tempo 7 hari dari tanggal
pinjam.

------------------------------------------------------------------------

# 19. Pengembalian

## Tujuan

Mencatat buku yang dikembalikan dan menghitung keterlambatan.

## Struktur

``` text
Pengembalian

[ 🔍 Cari ID transaksi / anggota ]

Detail Transaksi
────────────────────────────────────

Anggota: Nama
Tanggal Pinjam: DD/MM/YYYY
Jatuh Tempo: DD/MM/YYYY

Buku:
☑ Buku A
☑ Buku B
☐ Buku C

Tanggal Pengembalian
[ DD/MM/YYYY ]

Keterlambatan: X hari
Denda: $X

[ Proses Pengembalian ]
```

## Multi-book Transaction

Satu transaksi dapat berisi beberapa buku.

Sistem harus memungkinkan pengembalian sebagian buku apabila diperlukan.

Contoh:

``` text
Transaksi #TRX001

Buku A  [Dikembalikan]
Buku B  [Belum Dikembalikan]
Buku C  [Dikembalikan]
```

------------------------------------------------------------------------

# 20. Denda

## Tujuan

Mengelola denda akibat keterlambatan.

## Aturan

Denda:

**\$2 per hari keterlambatan.**

## Daftar Denda

``` text
Denda

[ Total Denda ]
[ Belum Dibayar ]
[ Sudah Dibayar ]

[ 🔍 Cari ]
[ Status Pembayaran ]

┌──────────────────────────────────────────────┐
│ Anggota | Terlambat | Denda | Status | Aksi │
├──────────────────────────────────────────────┤
│ ...                                          │
└──────────────────────────────────────────────┘
```

## Pembayaran Denda

Modal:

``` text
Pembayaran Denda

Anggota:
Nama

Total Denda:
$XX

Tanggal Pembayaran:
[ DD/MM/YYYY ]

Metode Pembayaran:
[ Tunai / Transfer / ... ]

[ Batal ] [ Simpan Pembayaran ]
```

Data pembayaran wajib menyimpan:

-   jumlah denda;
-   tanggal pembayaran;
-   metode pembayaran;
-   status pembayaran.

------------------------------------------------------------------------

# 21. Laporan

## Tujuan

Memberikan data administrasi yang dapat dibaca, dicetak, dan diekspor.

## Jenis Laporan

Tab:

``` text
Buku
Anggota
Peminjaman
Pengembalian
Denda
```

## Filter

``` text
Tanggal Mulai
[ DD/MM/YYYY ]

Tanggal Akhir
[ DD/MM/YYYY ]

Kategori / Status
[ Pilih ]

[ Tampilkan ]
```

## Tabel

``` text
┌──────────────────────────────────────────────┐
│ Data laporan                                 │
├──────────────────────────────────────────────┤
│ ...                                          │
└──────────────────────────────────────────────┘
```

Action:

``` text
[ Cetak ]
[ Export ]
```

Laporan harus dapat digunakan dalam format yang sesuai untuk kebutuhan
administrasi.

------------------------------------------------------------------------

# 22. Manajemen Buku

## Daftar Buku

``` text
Manajemen Buku

[ 🔍 Cari ] [Kategori] [Status]

[ + Tambah Buku ]

No | Cover | Judul | Penulis | Kategori | Stok | Status | Aksi
```

## Form Buku

Field:

-   Judul
-   Penulis
-   Kategori
-   Penerbit
-   Tahun terbit
-   ISBN (opsional)
-   Jumlah stok
-   Cover
-   Deskripsi

Action:

``` text
[ Batal ] [ Simpan Buku ]
```

------------------------------------------------------------------------

# 23. Manajemen Kategori

``` text
Kategori

[ + Tambah Kategori ]

No | Nama Kategori | Jumlah Buku | Aksi
```

Action:

-   Tambah
-   Edit
-   Hapus

Penghapusan kategori harus dicegah jika masih digunakan oleh buku atau
harus memiliki mekanisme penanganan relasi yang jelas.

------------------------------------------------------------------------

# 24. Manajemen Anggota

``` text
Anggota

[ 🔍 Cari anggota ] [Jenis]

[ + Tambah Anggota ]

No | Nama | Jenis | Kontak | Buku Aktif | Status | Aksi
```

Jenis:

-   Siswa
-   Mahasiswa
-   Guru
-   Dosen

Detail anggota menampilkan:

-   data identitas;
-   jenis anggota;
-   buku yang sedang dipinjam;
-   riwayat peminjaman;
-   denda.

------------------------------------------------------------------------

# 25. Form Validation

Semua form harus memiliki:

-   label;
-   placeholder jika diperlukan;
-   pesan error;
-   status required;
-   validasi input;
-   state disabled;
-   state loading.

Contoh:

``` text
Judul Buku *
[________________________]

Judul buku wajib diisi.
```

Pesan error harus spesifik dan mudah dipahami.

------------------------------------------------------------------------

# 26. Modal Confirmation

Untuk tindakan penting:

``` text
Konfirmasi Penghapusan

Apakah Anda yakin ingin menghapus data ini?

Tindakan ini mungkin tidak dapat dibatalkan.

[ Batal ] [ Hapus ]
```

Gunakan confirmation untuk:

-   menghapus buku;
-   menghapus anggota;
-   membatalkan transaksi;
-   tindakan administratif penting lainnya.

------------------------------------------------------------------------

# 27. Notification / Toast

Jenis:

### Success

``` text
✓ Data berhasil disimpan.
```

### Error

``` text
× Data gagal disimpan.
```

### Warning

``` text
! Buku mendekati tanggal jatuh tempo.
```

### Info

``` text
i Tidak ada buku yang tersedia.
```

Toast harus singkat dan tidak mengganggu pekerjaan pengguna.

------------------------------------------------------------------------

# 28. Empty State

Contoh katalog kosong:

``` text
Belum ada buku

Belum ada buku yang sesuai dengan pencarian Anda.

[ Reset Filter ]
```

Contoh transaksi kosong:

``` text
Belum ada transaksi peminjaman.
```

Empty state harus menjelaskan kondisi dan, jika relevan, memberikan
tindakan berikutnya.

------------------------------------------------------------------------

# 29. Loading State

Gunakan:

-   skeleton untuk tabel/card;
-   spinner pada tombol;
-   disabled state saat submit.

Contoh:

``` text
[ Menyimpan... ]
```

Hindari membuat pengguna mengklik tombol berkali-kali ketika proses
sedang berlangsung.

------------------------------------------------------------------------

# 30. Responsive Design

## Desktop

``` text
Sidebar + Header + Content
```

Target utama untuk admin.

## Tablet

-   Sidebar dapat diperkecil.
-   Tabel dapat memiliki horizontal scroll.
-   Card menyesuaikan jumlah kolom.

## Mobile

-   Sidebar menjadi drawer.
-   Card menjadi satu kolom.
-   Tombol utama tetap mudah ditemukan.
-   Tabel dapat berubah menjadi card/list jika diperlukan.
-   Form menjadi satu kolom.

------------------------------------------------------------------------

# 31. Accessibility

Target:

**WCAG 2.2 AA**

Ketentuan:

-   kontras warna cukup;
-   semua input memiliki label;
-   tombol memiliki nama yang jelas;
-   navigasi dapat digunakan dengan keyboard;
-   focus state terlihat;
-   tidak menggunakan warna sebagai satu-satunya indikator;
-   pesan error dapat dipahami;
-   ukuran teks dapat dibaca;
-   gambar cover memiliki alt text yang sesuai.

------------------------------------------------------------------------

# 32. UX Rules

## Peminjaman

Sistem harus:

1.  mengecek status anggota;
2.  mengecek batas peminjaman;
3.  mengecek ketersediaan buku;
4.  menghitung tanggal jatuh tempo;
5.  mencegah peminjaman melebihi batas;
6.  menyimpan transaksi;
7.  memperbarui stok.

## Pengembalian

Sistem harus:

1.  menemukan transaksi;
2.  mengetahui buku yang belum dikembalikan;
3.  mencatat tanggal pengembalian;
4.  menghitung keterlambatan;
5.  menghitung denda jika terlambat;
6.  memperbarui status buku;
7.  memperbarui status transaksi.

## Denda

Jika anggota terlambat:

``` text
Denda = jumlah hari terlambat × $2
```

Sistem harus menyimpan informasi pembayaran denda jika denda dibayar.

------------------------------------------------------------------------

# 33. User Flow Anggota

``` text
Login
  ↓
Dashboard
  ↓
Katalog Buku
  ↓
Cari Buku
  ↓
Detail Buku
  ↓
Cek Ketersediaan
  ↓
Pinjam Buku
  ↓
Konfirmasi
  ↓
Peminjaman Berhasil
  ↓
Peminjaman Saya
  ↓
Pantau Jatuh Tempo
  ↓
Pengembalian
  ↓
Jika Terlambat
  ↓
Denda
  ↓
Pembayaran Denda
```

------------------------------------------------------------------------

# 34. User Flow Admin

``` text
Login
  ↓
Dashboard
  ↓
Kelola Data
  ├── Buku
  ├── Kategori
  └── Anggota
  ↓
Transaksi
  ├── Peminjaman
  ├── Pengembalian
  └── Denda
  ↓
Pembayaran Denda
  ↓
Laporan
  ↓
Cetak / Export
```

------------------------------------------------------------------------

# 35. Information Priority

Prioritas informasi pada halaman transaksi:

## Prioritas 1

-   Nama anggota
-   Buku
-   Status
-   Tanggal
-   Jatuh tempo
-   Denda

## Prioritas 2

-   ID transaksi
-   Kategori
-   ISBN
-   Metadata tambahan

## Prioritas 3

-   Informasi teknis tambahan

Informasi prioritas tinggi harus terlihat tanpa pengguna membuka detail
tambahan.

------------------------------------------------------------------------

# 36. Microcopy

Gunakan bahasa Indonesia yang:

-   sederhana;
-   konsisten;
-   langsung;
-   tidak terlalu teknis.

Contoh:

Gunakan:

``` text
Buku berhasil dipinjam.
```

Hindari:

``` text
Operation borrowing transaction has been successfully executed.
```

Gunakan:

``` text
Buku tidak tersedia.
```

Bukan:

``` text
Inventory constraint detected.
```

------------------------------------------------------------------------

# 37. Naming Convention UI

Gunakan istilah yang konsisten.

  Konsep      Istilah UI
  ----------- ---------------
  Loan        Peminjaman
  Return      Pengembalian
  Fine        Denda
  Payment     Pembayaran
  Member      Anggota
  Book        Buku
  Category    Kategori
  Available   Tersedia
  Borrowed    Dipinjam
  Overdue     Terlambat
  Paid        Lunas
  Unpaid      Belum Dibayar

------------------------------------------------------------------------

# 38. Data & Privacy

Data pribadi anggota harus ditampilkan sesuai kebutuhan.

Contoh:

-   halaman umum tidak menampilkan informasi sensitif;
-   akses data anggota dibatasi berdasarkan role;
-   data transaksi hanya dapat dikelola oleh pengguna berwenang.

------------------------------------------------------------------------

# 39. Role & Permission

## Admin/Petugas

Memiliki akses:

``` text
Dashboard       ✓
Buku            ✓
Kategori        ✓
Anggota         ✓
Peminjaman      ✓
Pengembalian    ✓
Denda           ✓
Pembayaran      ✓
Laporan         ✓
```

## Anggota

Memiliki akses:

``` text
Dashboard             ✓
Katalog               ✓
Detail Buku           ✓
Peminjaman Saya       ✓
Riwayat               ✓
Profil                ✓

Manajemen Buku        ✗
Manajemen Anggota     ✗
Laporan Admin         ✗
```

------------------------------------------------------------------------

# 40. Struktur Halaman Final

``` text
AUTH
├── Login

MEMBER
├── Dashboard
├── Katalog Buku
├── Detail Buku
├── Peminjaman Saya
├── Riwayat Peminjaman
└── Profil

ADMIN
├── Dashboard
├── Katalog Buku
├── Manajemen
│   ├── Buku
│   ├── Tambah Buku
│   ├── Edit Buku
│   ├── Kategori
│   ├── Anggota
│   └── Detail Anggota
├── Transaksi
│   ├── Peminjaman
│   ├── Peminjaman Baru
│   ├── Pengembalian
│   ├── Denda
│   └── Pembayaran Denda
├── Laporan
│   ├── Laporan Buku
│   ├── Laporan Anggota
│   ├── Laporan Peminjaman
│   ├── Laporan Pengembalian
│   └── Laporan Denda
└── Profil
```

------------------------------------------------------------------------

# 41. Prioritas Implementasi

## P0 --- Wajib untuk MVP

1.  Login
2.  Dashboard
3.  Buku
4.  Kategori
5.  Anggota
6.  Peminjaman
7.  Pengembalian
8.  Denda
9.  Pembayaran Denda
10. Laporan
11. Pencarian
12. Role dan permission

## P1 --- Pengembangan Berikutnya

-   notifikasi jatuh tempo;
-   dashboard anggota yang lebih personal;
-   filter laporan lanjutan;
-   export beberapa format;
-   histori aktivitas admin.

## P2 --- Pengembangan Lanjutan

-   fitur tambahan berdasarkan kebutuhan penggunaan;
-   penyempurnaan analitik;
-   integrasi eksternal jika diperlukan.

------------------------------------------------------------------------

# 42. Acceptance Criteria UI

Desain dianggap siap diimplementasikan jika:

-   seluruh halaman utama memiliki struktur yang jelas;
-   navigasi konsisten;
-   status transaksi mudah dibedakan;
-   form memiliki validasi;
-   state loading tersedia;
-   empty state tersedia;
-   error state tersedia;
-   responsive pada desktop, tablet, dan mobile;
-   aksesibilitas dasar terpenuhi;
-   tindakan utama mudah ditemukan;
-   tabel dapat digunakan untuk data dalam jumlah besar;
-   laporan dapat diarahkan ke proses cetak/export.

------------------------------------------------------------------------

# 43. Checklist Design Handoff

## Visual

-   [ ] Color tokens ditentukan
-   [ ] Typography ditentukan
-   [ ] Spacing ditentukan
-   [ ] Radius ditentukan
-   [ ] Button style ditentukan
-   [ ] Badge style ditentukan
-   [ ] Icon style ditentukan

## Components

-   [ ] Sidebar
-   [ ] Header
-   [ ] Card
-   [ ] Button
-   [ ] Input
-   [ ] Select
-   [ ] Search
-   [ ] Filter
-   [ ] Table
-   [ ] Modal
-   [ ] Toast
-   [ ] Pagination
-   [ ] Empty state
-   [ ] Loading state

## Pages

-   [ ] Login
-   [ ] Dashboard
-   [ ] Katalog Buku
-   [ ] Detail Buku
-   [ ] Peminjaman
-   [ ] Pengembalian
-   [ ] Denda
-   [ ] Pembayaran Denda
-   [ ] Laporan
-   [ ] Manajemen Buku
-   [ ] Kategori
-   [ ] Anggota
-   [ ] Profil

## UX

-   [ ] User flow anggota
-   [ ] User flow admin
-   [ ] Validasi
-   [ ] Confirmation
-   [ ] Error handling
-   [ ] Responsive
-   [ ] Accessibility

------------------------------------------------------------------------

# 44. Rekomendasi Struktur Folder UI

Untuk implementasi Laravel, struktur tampilan dapat dibuat seperti:

``` text
resources/
└── views/
    ├── layouts/
    │   ├── app.blade.php
    │   ├── auth.blade.php
    │   ├── sidebar.blade.php
    │   └── header.blade.php
    │
    ├── components/
    │   ├── button.blade.php
    │   ├── card.blade.php
    │   ├── badge.blade.php
    │   ├── modal.blade.php
    │   ├── table.blade.php
    │   ├── input.blade.php
    │   └── alert.blade.php
    │
    ├── auth/
    │   └── login.blade.php
    │
    ├── dashboard/
    │   └── index.blade.php
    │
    ├── books/
    │   ├── index.blade.php
    │   ├── create.blade.php
    │   ├── edit.blade.php
    │   └── show.blade.php
    │
    ├── categories/
    │   └── index.blade.php
    │
    ├── members/
    │   ├── index.blade.php
    │   └── show.blade.php
    │
    ├── loans/
    │   ├── index.blade.php
    │   └── create.blade.php
    │
    ├── returns/
    │   └── index.blade.php
    │
    ├── fines/
    │   ├── index.blade.php
    │   └── payment.blade.php
    │
    └── reports/
        └── index.blade.php
```

------------------------------------------------------------------------

# 45. Final Design Direction

Sistem Manajemen Perpustakaan menggunakan pendekatan **Clean Academic
Dashboard** dengan fokus pada kemudahan penggunaan, keterbacaan data,
konsistensi, dan efisiensi pekerjaan.

Visual utama menggunakan:

-   warna primary indigo;
-   background terang;
-   card putih;
-   typography Inter;
-   sidebar navigasi;
-   tabel untuk data administratif;
-   card untuk ringkasan;
-   badge untuk status;
-   modal untuk tindakan yang membutuhkan konfirmasi;
-   responsive layout;
-   aksesibilitas WCAG 2.2 AA.

Prioritas pengalaman pengguna adalah:

``` text
Cari → Lihat → Pinjam → Pantau → Kembalikan → Kelola Denda → Lihat Laporan
```

Desain ini menjadi acuan untuk tahap berikutnya, yaitu pembuatan **UI
high-fidelity, database/schema, dan implementasi Laravel**.
