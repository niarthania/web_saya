# PRD — Sistem Manajemen Perpustakaan Berbasis Web

**Status:** Final untuk MVP  
**Platform:** Web, online  
**Framework yang direkomendasikan:** Laravel  
**Target pengguna:** Siswa/Mahasiswa, Guru/Dosen, Admin/Petugas  
**Versi dokumen:** 1.0

---

## 1. Problem Statement

Pengelolaan perpustakaan yang masih dilakukan secara manual dapat menyulitkan petugas dalam mencatat dan memperbarui data buku, kategori, anggota, peminjaman, pengembalian, dan denda. Proses pencarian informasi dan pembuatan laporan juga dapat menjadi lebih lambat serta berisiko menimbulkan kesalahan pencatatan.

Pihak yang terdampak:

- **Admin/Petugas:** membutuhkan cara yang terstruktur untuk mengelola data dan transaksi perpustakaan.
- **Siswa/Mahasiswa:** membutuhkan cara yang cepat untuk mencari buku dan mengetahui status ketersediaannya.
- **Guru/Dosen:** membutuhkan informasi koleksi dan transaksi yang mudah diakses.

Sistem ini bertujuan memusatkan pengelolaan perpustakaan dalam satu sistem berbasis web sehingga data buku, anggota, transaksi, denda, dan laporan dapat dikelola secara terintegrasi.

---

## 2. Target User + Persona

### 2.1 Target User

#### Siswa/Mahasiswa
Kebutuhan utama:
- Login ke sistem.
- Mencari buku.
- Melihat detail dan ketersediaan buku.
- Melakukan peminjaman melalui sistem sesuai batas yang berlaku.
- Melihat buku yang sedang dipinjam.
- Melihat riwayat peminjaman dan status pengembalian.

#### Guru/Dosen
Kebutuhan utama:
- Login ke sistem.
- Mencari dan melihat buku.
- Melakukan peminjaman melalui sistem.
- Melihat buku yang sedang dipinjam.
- Melihat riwayat transaksi.

#### Admin/Petugas
Kebutuhan utama:
- Login dan mengelola sistem.
- Mengelola buku dan kategori.
- Mengelola anggota.
- Mengelola peminjaman dan pengembalian.
- Mengelola denda dan pembayaran.
- Melihat, mencetak, dan mengekspor laporan.
- Melihat kondisi perpustakaan melalui dashboard.

### 2.2 Persona 1 — Siswa/Mahasiswa

**Nama:** Andi  
**Peran:** Siswa/Mahasiswa

**Tujuan:**
- Menemukan buku yang dibutuhkan.
- Mengetahui ketersediaan buku.
- Meminjam buku melalui sistem.
- Mengetahui batas waktu pengembalian.

**Kebutuhan:**
- Pencarian yang cepat.
- Informasi buku yang jelas.
- Informasi status peminjaman.
- Informasi jatuh tempo dan denda jika terlambat.

**Batas peminjaman:** maksimal 5 buku aktif.  
**Durasi peminjaman:** 7 hari.

### 2.3 Persona 2 — Admin/Petugas

**Nama:** Rina  
**Peran:** Admin/Petugas Perpustakaan

**Tujuan:**
- Mengelola data perpustakaan.
- Memproses transaksi dengan cepat.
- Memantau keterlambatan dan denda.
- Menghasilkan laporan.

**Kebutuhan:**
- Dashboard ringkas.
- Tabel data yang mudah dicari dan difilter.
- Form CRUD.
- Validasi transaksi.
- Laporan yang dapat dicetak dan diekspor.

---

## 3. Goals dan Non-Goals

### 3.1 Goals

1. Menyediakan sistem manajemen perpustakaan berbasis web.
2. Menyediakan autentikasi dan hak akses berdasarkan peran.
3. Memudahkan pengelolaan data buku.
4. Memudahkan pengelolaan kategori buku.
5. Memudahkan pengelolaan anggota.
6. Memfasilitasi peminjaman melalui sistem.
7. Memfasilitasi pengembalian buku.
8. Mengidentifikasi keterlambatan dan menghitung denda.
9. Mencatat pembayaran denda beserta tanggal dan metode pembayaran.
10. Menyediakan pencarian buku.
11. Menyediakan dashboard.
12. Menyediakan laporan yang dapat dilihat, dicetak, dan diekspor.
13. Menyediakan alur utama yang dapat dijalankan tanpa error kritis.

### 3.2 Non-Goals MVP

Fitur berikut tidak menjadi bagian MVP:

- Aplikasi mobile native Android/iOS.
- Pembayaran denda online.
- Notifikasi WhatsApp/email otomatis.
- Reservasi buku.
- Rekomendasi buku berbasis AI.
- Integrasi RFID.
- Integrasi dengan sistem akademik eksternal.
- Integrasi scanner barcode/QR secara otomatis.

Fitur tersebut dapat dipertimbangkan pada V2 atau tahap berikutnya.

---

## 4. User Stories

### 4.1 Authentication

- Sebagai **pengguna**, saya ingin login supaya dapat mengakses sistem sesuai hak akses saya.
- Sebagai **pengguna**, saya ingin logout supaya akun saya tidak tetap terbuka pada perangkat yang digunakan.

### 4.2 Buku

- Sebagai **admin**, saya ingin menambahkan data buku supaya koleksi perpustakaan tercatat.
- Sebagai **admin**, saya ingin mengubah data buku supaya informasi koleksi tetap akurat.
- Sebagai **admin**, saya ingin menghapus data buku supaya koleksi yang sudah tidak digunakan dapat dikelola.
- Sebagai **pengguna**, saya ingin mencari buku supaya dapat menemukan buku yang saya butuhkan.
- Sebagai **pengguna**, saya ingin melihat detail buku supaya mengetahui informasi dan ketersediaannya.

### 4.3 Kategori

- Sebagai **admin**, saya ingin menambah kategori supaya buku dapat dikelompokkan.
- Sebagai **admin**, saya ingin mengubah kategori supaya pengelompokan tetap sesuai.
- Sebagai **admin**, saya ingin menghapus kategori supaya data kategori yang tidak digunakan dapat dibersihkan.

### 4.4 Anggota

- Sebagai **admin**, saya ingin menambahkan anggota supaya pengguna perpustakaan dapat tercatat.
- Sebagai **admin**, saya ingin mengubah data anggota supaya informasi tetap akurat.
- Sebagai **admin**, saya ingin melihat detail anggota supaya dapat memeriksa informasi dan transaksi anggota.

### 4.5 Peminjaman

- Sebagai **anggota**, saya ingin melakukan peminjaman melalui sistem supaya tidak selalu bergantung pada pencatatan manual.
- Sebagai **admin**, saya ingin mencatat dan memantau peminjaman supaya transaksi terdokumentasi.
- Sebagai **anggota**, saya ingin meminjam beberapa buku dalam satu transaksi supaya proses peminjaman lebih praktis.
- Sebagai **anggota**, saya ingin mengetahui tanggal jatuh tempo supaya dapat mengembalikan buku tepat waktu.

### 4.6 Pengembalian

- Sebagai **anggota**, saya ingin mengembalikan buku melalui sistem supaya status peminjaman diperbarui.
- Sebagai **admin**, saya ingin memproses pengembalian supaya stok/ketersediaan buku diperbarui.
- Sebagai **admin**, saya ingin mengetahui keterlambatan supaya denda dapat ditentukan.

### 4.7 Denda

- Sebagai **admin**, saya ingin melihat denda supaya kewajiban anggota dapat dipantau.
- Sebagai **admin**, saya ingin mencatat pembayaran denda supaya status pembayaran terdokumentasi.
- Sebagai **admin**, saya ingin mencatat tanggal dan metode pembayaran supaya riwayat pembayaran lengkap.

### 4.8 Laporan

- Sebagai **admin**, saya ingin melihat laporan buku supaya kondisi koleksi dapat dipantau.
- Sebagai **admin**, saya ingin melihat laporan anggota supaya data anggota dapat dipantau.
- Sebagai **admin**, saya ingin melihat laporan peminjaman dan pengembalian supaya aktivitas perpustakaan dapat dianalisis.
- Sebagai **admin**, saya ingin melihat laporan denda supaya kewajiban dan pembayaran dapat dipantau.
- Sebagai **admin**, saya ingin mencetak dan mengekspor laporan supaya laporan dapat digunakan di luar sistem.

---

## 5. Daftar Fitur: MVP / V2 / Nanti

### 5.1 MVP

1. Login dan authentication.
2. Role/hak akses Admin dan Anggota.
3. Dashboard.
4. Data buku.
5. Cover/foto sampul buku.
6. Kategori buku.
7. Data anggota.
8. Pencarian buku.
9. Peminjaman.
10. Pengembalian.
11. Perhitungan denda.
12. Pencatatan pembayaran denda.
13. Laporan buku.
14. Laporan anggota.
15. Laporan peminjaman.
16. Laporan pengembalian.
17. Laporan denda.
18. Cetak laporan.
19. Export laporan.
20. Riwayat peminjaman pengguna.

### 5.2 V2

1. Filter laporan berdasarkan periode yang lebih lengkap.
2. Export dengan pilihan format tambahan.
3. Barcode/QR code buku.
4. Cetak kartu anggota.
5. Notifikasi jatuh tempo.
6. Histori anggota yang lebih detail.
7. Pengelolaan role yang lebih granular.

### 5.3 Nanti

1. Aplikasi mobile native.
2. Notifikasi WhatsApp/email otomatis.
3. Reservasi buku.
4. Rekomendasi buku.
5. Integrasi RFID.
6. Pembayaran denda online.
7. Integrasi dengan sistem akademik eksternal.

---

## 6. Functional Requirements Detail per Fitur MVP

### FR-01 — Authentication dan Authorization

Sistem harus:

- menyediakan halaman login;
- menerima email/username dan password sesuai rancangan autentikasi;
- memvalidasi kredensial;
- mengarahkan pengguna ke halaman sesuai role;
- menyediakan logout;
- membatasi halaman admin agar hanya dapat diakses admin;
- membatasi akses data pribadi anggota sesuai akun pengguna.

**Role utama:**
- Admin/Petugas.
- Anggota.

Anggota mencakup:
- Siswa.
- Mahasiswa.
- Guru.
- Dosen.

### FR-02 — Dashboard

Dashboard harus menampilkan ringkasan:

- Total buku.
- Total anggota.
- Total buku sedang dipinjam.
- Total transaksi terlambat.
- Ringkasan denda.
- Aktivitas/transaksi terbaru.

Dashboard anggota minimal menampilkan:
- buku yang sedang dipinjam;
- tanggal jatuh tempo;
- status keterlambatan/denda jika ada.

### FR-03 — Manajemen Buku

Admin dapat:

- menambah buku;
- melihat daftar buku;
- melihat detail buku;
- mengubah buku;
- menghapus buku;
- mengunggah/mengelola cover buku;
- mencari buku;
- memfilter buku berdasarkan kategori/status.

Data minimal:

- ID buku.
- Kode buku.
- ISBN (opsional).
- Judul.
- Penulis.
- Penerbit.
- Tahun terbit.
- Kategori.
- Stok.
- Deskripsi.
- Cover.
- Status/ketersediaan.

**ISBN tidak wajib.**

### FR-04 — Manajemen Kategori

Admin dapat:

- menambah kategori;
- melihat kategori;
- mengubah kategori;
- menghapus kategori.

Satu buku memiliki satu kategori utama sesuai model data MVP.

Sistem tidak boleh menghapus kategori yang masih digunakan oleh buku tanpa penanganan relasi yang aman.

### FR-05 — Manajemen Anggota

Admin dapat:

- menambah anggota;
- melihat anggota;
- melihat detail anggota;
- mengubah anggota;
- menonaktifkan/menghapus anggota sesuai aturan sistem.

Data minimal:

- ID anggota.
- Nomor anggota.
- Nama.
- Email.
- Nomor telepon.
- Alamat.
- Jenis anggota.
- Status akun.

**Jenis anggota:**
- Siswa.
- Mahasiswa.
- Guru.
- Dosen.

### FR-06 — Pencarian Buku

Pengguna dapat mencari buku berdasarkan minimal:

- judul;
- penulis;
- kategori;
- kode buku;
- ISBN jika tersedia.

Hasil pencarian menampilkan minimal:

- cover;
- judul;
- penulis;
- kategori;
- status ketersediaan.

Jika tidak ditemukan, sistem menampilkan empty state yang jelas.

### FR-07 — Peminjaman

Peminjaman dapat dilakukan melalui sistem.

Satu transaksi dapat berisi beberapa buku.

Saat membuat transaksi sistem harus memvalidasi:

1. anggota aktif;
2. buku tersedia;
3. jumlah buku yang dipinjam tidak melewati batas anggota;
4. tanggal peminjaman valid;
5. tanggal jatuh tempo sesuai aturan 7 hari.

**Batas buku aktif:**

| Jenis anggota | Maksimal buku aktif |
|---|---:|
| Siswa | 5 |
| Mahasiswa | 5 |
| Guru | 10 |
| Dosen | 10 |

**Durasi:** 7 hari.

Jika batas tercapai, sistem menolak peminjaman tambahan sampai sebagian/seluruh buku aktif dikembalikan.

Setelah peminjaman berhasil:

- transaksi tersimpan;
- detail buku tersimpan;
- jumlah/stok tersedia diperbarui;
- status transaksi menjadi aktif/dipinjam;
- tanggal jatuh tempo tercatat.

### FR-08 — Pengembalian

Sistem harus memungkinkan pemrosesan pengembalian.

Saat pengembalian:

- transaksi dicari;
- buku yang dikembalikan ditentukan;
- tanggal pengembalian dicatat;
- sistem mengecek keterlambatan;
- sistem menghitung denda jika terlambat;
- stok/ketersediaan diperbarui;
- status transaksi/detail diperbarui.

Sistem tidak boleh memproses pengembalian dua kali untuk buku/transaksi yang sudah dikembalikan.

### FR-09 — Denda

Aturan MVP:

**Denda keterlambatan = $2 per hari keterlambatan.**

Sistem harus:

- menentukan tanggal jatuh tempo;
- menentukan tanggal pengembalian;
- menghitung jumlah hari keterlambatan;
- menghitung nominal denda;
- menyimpan denda;
- menampilkan status denda;
- mencatat pembayaran.

Contoh:

Tanggal jatuh tempo: 7 Oktober.  
Tanggal kembali: 9 Oktober.  
Keterlambatan: 2 hari.  
Denda: **$4**.

### FR-10 — Pembayaran Denda

Pembayaran denda harus mencatat:

- ID denda;
- jumlah yang dibayar;
- tanggal pembayaran;
- metode pembayaran;
- status pembayaran.

Status minimal:

- Belum Lunas.
- Lunas.

**Metode pembayaran** harus dapat dipilih/dicatat pada saat pembayaran.

Jenis metode pembayaran yang tersedia perlu ditetapkan pada implementasi, tetapi sistem harus mendukung penyimpanan metode tersebut.

### FR-11 — Laporan

Laporan MVP:

1. Laporan buku.
2. Laporan anggota.
3. Laporan peminjaman.
4. Laporan pengembalian.
5. Laporan denda.

Setiap laporan minimal dapat:

- ditampilkan di web;
- dicetak;
- diekspor.

Laporan peminjaman/pengembalian/denda harus menyediakan informasi transaksi yang relevan.

### FR-12 — Riwayat Peminjaman

Anggota dapat melihat:

- buku yang sedang dipinjam;
- tanggal peminjaman;
- tanggal jatuh tempo;
- tanggal pengembalian jika sudah selesai;
- status;
- denda jika ada.

Admin dapat melihat riwayat transaksi anggota.

---

## 7. Model Data

### 7.1 User

Field kunci:

- `id`
- `name`
- `email`
- `password`
- `role`
- `created_at`
- `updated_at`

Role utama:

- `admin`
- `member`

### 7.2 Anggota

Field kunci:

- `id`
- `user_id`
- `nomor_anggota`
- `nama`
- `email`
- `no_telepon`
- `alamat`
- `jenis_anggota`
- `status`
- `created_at`
- `updated_at`

### 7.3 Kategori

Field:

- `id`
- `nama_kategori`
- `created_at`
- `updated_at`

### 7.4 Buku

Field:

- `id`
- `kode_buku`
- `isbn` nullable
- `judul`
- `penulis`
- `penerbit`
- `tahun_terbit`
- `kategori_id`
- `stok`
- `deskripsi`
- `cover`
- `status`
- `created_at`
- `updated_at`

### 7.5 Peminjaman

Field:

- `id`
- `anggota_id`
- `tanggal_pinjam`
- `tanggal_jatuh_tempo`
- `status`
- `created_at`
- `updated_at`

### 7.6 Detail Peminjaman

Field:

- `id`
- `peminjaman_id`
- `buku_id`
- `tanggal_kembali` atau relasi ke pengembalian sesuai desain database final
- `status`

**Catatan:** struktur final pengembalian per buku perlu dipastikan saat implementasi agar transaksi multi-buku dapat mengembalikan buku secara individual.

### 7.7 Pengembalian

Field minimal:

- `id`
- `peminjaman_id` atau `detail_peminjaman_id`
- `tanggal_kembali`
- `status`
- `created_at`
- `updated_at`

### 7.8 Denda

Field minimal:

- `id`
- `peminjaman_id` atau `detail_peminjaman_id`
- `jumlah`
- `jumlah_hari_terlambat`
- `status`
- `tanggal_pembayaran` nullable
- `metode_pembayaran` nullable
- `created_at`
- `updated_at`

### 7.9 Relasi

```text
User
  └── Anggota

Kategori
  └── Buku

Anggota
  └── Peminjaman
       └── Detail Peminjaman
              └── Buku

Peminjaman/Detail Peminjaman
  └── Pengembalian

Peminjaman/Detail Peminjaman
  └── Denda
```

---

## 8. Edge Case dan Failure State

### 8.1 Buku Tidak Tersedia

Jika stok/ketersediaan buku tidak mencukupi:

- peminjaman ditolak;
- sistem menampilkan status tidak tersedia;
- transaksi tidak boleh tersimpan sebagai transaksi berhasil.

### 8.2 Batas Peminjaman Tercapai

Jika anggota telah mencapai:

- Siswa/Mahasiswa: 5 buku aktif;
- Guru/Dosen: 10 buku aktif;

sistem menolak peminjaman tambahan.

### 8.3 Anggota Tidak Aktif

Anggota yang tidak aktif tidak dapat membuat peminjaman baru.

### 8.4 Buku Sudah Dihapus/Dinonaktifkan

Buku yang memiliki transaksi aktif tidak boleh dihapus secara sembarangan.

Sistem harus mencegah hilangnya referensi transaksi historis.

### 8.5 Kategori Masih Digunakan

Kategori yang masih memiliki buku terkait tidak boleh dihapus tanpa mekanisme penanganan relasi.

### 8.6 Pengembalian Ganda

Jika buku/transaksi sudah dikembalikan:

- sistem menolak pengembalian kedua;
- data tidak boleh dihitung dua kali;
- stok tidak boleh bertambah dua kali.

### 8.7 Keterlambatan

Jika tanggal kembali melewati jatuh tempo:

- status terlambat;
- jumlah hari terlambat dihitung;
- denda dihitung $2/hari.

### 8.8 Denda Belum Dibayar

Status tetap:

**Belum Lunas**

Sistem tidak boleh mengubahnya menjadi lunas tanpa pencatatan pembayaran.

### 8.9 Pembayaran Denda

Pembayaran harus mencatat:

- tanggal;
- metode;
- nominal;
- status.

### 8.10 Pencarian Tidak Menemukan Data

Tampilkan:

> Buku yang Anda cari tidak ditemukan.

Jangan menampilkan tabel kosong tanpa penjelasan.

### 8.11 Login Gagal

Tampilkan pesan validasi yang aman dan tidak membocorkan detail kredensial.

### 8.12 Koneksi Terputus

Karena sistem bersifat online:

- tampilkan status koneksi/error;
- jangan menganggap transaksi berhasil sebelum server mengonfirmasi;
- pengguna dapat mencoba kembali.

### 8.13 Upload Cover Gagal

Jika file cover tidak sesuai ketentuan:

- upload ditolak;
- tampilkan pesan kesalahan;
- data buku tidak boleh menyimpan referensi file yang gagal.

### 8.14 Laporan Gagal Dibuat

Tampilkan pesan error dan opsi mencoba kembali.

---

## 9. Success Metrics

MVP dianggap selesai jika seluruh kriteria berikut terpenuhi:

### Functional Completion

- [ ] Admin dapat login.
- [ ] Anggota dapat login.
- [ ] Admin dapat mengelola buku.
- [ ] Admin dapat mengelola kategori.
- [ ] Admin dapat mengelola anggota.
- [ ] Pengguna dapat mencari buku.
- [ ] Pengguna dapat melihat detail buku.
- [ ] Pengguna dapat melakukan peminjaman melalui sistem.
- [ ] Satu transaksi dapat berisi beberapa buku.
- [ ] Sistem menerapkan batas 5 buku untuk siswa/mahasiswa.
- [ ] Sistem menerapkan batas 10 buku untuk guru/dosen.
- [ ] Sistem menerapkan durasi 7 hari.
- [ ] Sistem dapat memproses pengembalian.
- [ ] Sistem dapat menghitung denda $2/hari.
- [ ] Sistem dapat mencatat pembayaran denda.
- [ ] Sistem menyimpan tanggal pembayaran.
- [ ] Sistem menyimpan metode pembayaran.
- [ ] Admin dapat melihat laporan.
- [ ] Laporan dapat dicetak.
- [ ] Laporan dapat diekspor.
- [ ] Anggota dapat melihat riwayat peminjaman.

### Quality

- Tidak ada error kritis pada happy path.
- Data transaksi konsisten antara buku, anggota, peminjaman, pengembalian, dan denda.
- Hak akses tidak dapat dilewati melalui URL secara langsung.
- Form memiliki validasi.
- Sistem memberikan feedback untuk loading, success, error, dan empty state.
- Tampilan dapat digunakan pada desktop, tablet, dan mobile.

### Definisi Selesai

Sistem dinyatakan selesai apabila alur utama berikut dapat berjalan end-to-end:

```text
Login
  ↓
Cari/Pilih Buku
  ↓
Peminjaman
  ↓
7 Hari
  ↓
Pengembalian
  ↓
Cek Keterlambatan
  ↓
Denda jika ada
  ↓
Pembayaran Denda
  ↓
Laporan
  ↓
Cetak / Export
```

---

## 10. Open Questions / Keputusan Implementasi yang Perlu Ditetapkan

Requirement bisnis utama sudah ditetapkan. Beberapa detail teknis berikut masih perlu diputuskan sebelum implementasi database dan UI final:

1. **Metode pembayaran denda**  
   Pilihan awal dapat berupa tunai, transfer, dan lainnya, tetapi daftar final belum ditetapkan.

2. **Format export laporan**  
   Kebutuhan sudah menetapkan export, tetapi format final (misalnya PDF, Excel, atau keduanya) perlu ditetapkan pada tahap teknis.

3. **Pengembalian sebagian dalam satu transaksi**  
   Karena satu transaksi dapat berisi beberapa buku, desain database dan UI harus mendukung pengembalian satu atau beberapa buku tanpa memaksa seluruh transaksi ditutup sekaligus.

4. **Aturan penghapusan data historis**  
   Data buku/anggota yang sudah memiliki transaksi historis sebaiknya tidak menghilangkan histori transaksi.

5. **Batas ukuran dan format cover buku**  
   Perlu ditetapkan pada implementasi, termasuk format file dan ukuran maksimal.

6. **Mekanisme pendaftaran akun anggota**  
   Requirement saat ini menetapkan login, tetapi belum menetapkan apakah akun dibuat oleh admin atau anggota dapat melakukan registrasi sendiri.

---

# Ringkasan Requirement Final

| Item | Keputusan |
|---|---|
| Platform | Web |
| Koneksi | Online |
| Framework | Laravel |
| Pengguna | Siswa, Mahasiswa, Guru, Dosen, Admin |
| Maks. siswa/mahasiswa | 5 buku aktif |
| Maks. guru/dosen | 10 buku aktif |
| Durasi pinjam | 7 hari |
| Denda | $2/hari keterlambatan |
| Multi-book transaction | Ya |
| Peminjaman melalui sistem | Ya |
| ISBN | Opsional |
| Cover buku | Ya |
| Pembayaran denda | Dicatat |
| Tanggal pembayaran | Dicatat |
| Metode pembayaran | Dicatat |
| Laporan | Web + cetak + export |
| MVP | Buku, kategori, anggota, peminjaman, pengembalian, denda, pencarian, login, dashboard, laporan |

---

# Prioritas MVP

**P0 — Wajib berjalan**

1. Authentication & authorization
2. Buku
3. Kategori
4. Anggota
5. Pencarian
6. Peminjaman
7. Pengembalian
8. Denda
9. Pembayaran denda
10. Dashboard
11. Laporan

**P1 — Wajib sebagai bagian kualitas MVP**

1. Validasi form
2. Empty state
3. Loading state
4. Error state
5. Hak akses
6. Responsive layout
7. Print/export laporan
8. Riwayat transaksi

**P2 — Ditunda**

1. Barcode/QR
2. Notifikasi
3. Reservasi
4. Mobile app
5. RFID
6. Pembayaran online
7. Integrasi eksternal
