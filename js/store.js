/**
 * store.js - State Management & Business Logic
 * Sistem Manajemen Perpustakaan Berbasis Web
 * Sesuai PRD & Design Brief
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'pustaka_core_db_v1';

  // Initial Seed Data
  const defaultData = {
    users: [
      {
        id: 'usr-1',
        name: 'Rina Suryani (Admin)',
        email: 'admin@pustaka.id',
        password: 'admin',
        role: 'admin',
        created_at: '2026-01-15'
      },
      {
        id: 'usr-2',
        name: 'Andi Pratama',
        email: 'andi@siswa.pustaka.id',
        password: 'user',
        role: 'member',
        member_id: 'mem-1',
        created_at: '2026-02-01'
      },
      {
        id: 'usr-3',
        name: 'Dewi Lestari',
        email: 'dewi@kampus.pustaka.id',
        password: 'user',
        role: 'member',
        member_id: 'mem-2',
        created_at: '2026-02-10'
      },
      {
        id: 'usr-4',
        name: 'Pak Budi Santoso',
        email: 'budi@guru.pustaka.id',
        password: 'user',
        role: 'member',
        member_id: 'mem-3',
        created_at: '2026-02-15'
      },
      {
        id: 'usr-5',
        name: 'Dr. Suryo Broto',
        email: 'suryo@dosen.pustaka.id',
        password: 'user',
        role: 'member',
        member_id: 'mem-4',
        created_at: '2026-03-01'
      },
      {
        id: 'usr-6',
        name: 'Siti Rahma (Nonaktif)',
        email: 'siti@siswa.pustaka.id',
        password: 'user',
        role: 'member',
        member_id: 'mem-5',
        created_at: '2026-03-10'
      }
    ],

    members: [
      {
        id: 'mem-1',
        user_id: 'usr-2',
        nomor_anggota: 'ANG-2026-001',
        nama: 'Andi Pratama',
        email: 'andi@siswa.pustaka.id',
        no_telepon: '0812-3456-7890',
        alamat: 'Jl. Merdeka No. 14, Jakarta',
        jenis_anggota: 'Siswa', // Max 5 buku
        status: 'Aktif',
        created_at: '2026-02-01'
      },
      {
        id: 'mem-2',
        user_id: 'usr-3',
        nomor_anggota: 'ANG-2026-002',
        nama: 'Dewi Lestari',
        email: 'dewi@kampus.pustaka.id',
        no_telepon: '0856-7890-1234',
        alamat: 'Jl. Salemba Raya No. 4, Jakarta Pusat',
        jenis_anggota: 'Mahasiswa', // Max 5 buku
        status: 'Aktif',
        created_at: '2026-02-10'
      },
      {
        id: 'mem-3',
        user_id: 'usr-4',
        nomor_anggota: 'ANG-2026-003',
        nama: 'Pak Budi Santoso',
        email: 'budi@guru.pustaka.id',
        no_telepon: '0813-9876-5432',
        alamat: 'Komplek Pendidik Mandiri Blok C-2, Depok',
        jenis_anggota: 'Guru', // Max 10 buku
        status: 'Aktif',
        created_at: '2026-02-15'
      },
      {
        id: 'mem-4',
        user_id: 'usr-5',
        nomor_anggota: 'ANG-2026-004',
        nama: 'Dr. Suryo Broto, M.Sc.',
        email: 'suryo@dosen.pustaka.id',
        no_telepon: '0811-2233-4455',
        alamat: 'Perum Dosen UI No. 8, Depok',
        jenis_anggota: 'Dosen', // Max 10 buku
        status: 'Aktif',
        created_at: '2026-03-01'
      },
      {
        id: 'mem-5',
        user_id: 'usr-6',
        nomor_anggota: 'ANG-2026-005',
        nama: 'Siti Rahma',
        email: 'siti@siswa.pustaka.id',
        no_telepon: '0821-4567-8901',
        alamat: 'Jl. Anggrek Cendrawasih No. 22, Jakarta Barat',
        jenis_anggota: 'Siswa',
        status: 'Nonaktif', // Contoh nonaktif untuk failure state test
        created_at: '2026-03-10'
      }
    ],

    categories: [
      {
        id: 'cat-1',
        nama_kategori: 'Teknologi & Ilmu Komputer',
        deskripsi: 'Koleksi rekayasa perangkat lunak, AI, arsitektur data, dan jaringan komputasi.',
        created_at: '2026-01-10'
      },
      {
        id: 'cat-2',
        nama_kategori: 'Sains & Fisika',
        deskripsi: 'Koleksi astrofisika, fisika modern, kalkulus kuantum, dan riset sains terapan.',
        created_at: '2026-01-10'
      },
      {
        id: 'cat-3',
        nama_kategori: 'Sastra & Fiksi',
        deskripsi: 'Karya sastra pilihan, novel klasik kontemporer, puisi, dan antologi cerita pendek.',
        created_at: '2026-01-11'
      },
      {
        id: 'cat-4',
        nama_kategori: 'Ekonomi & Manajemen',
        deskripsi: 'Buku manajemen strategis korporasi, transformasi digital, dan pasar modal.',
        created_at: '2026-01-12'
      },
      {
        id: 'cat-5',
        nama_kategori: 'Sejarah & Humaniora',
        deskripsi: 'Studi sejarah peradaban Nusantara, jalur perdagangan dunia, dan kajian budaya.',
        created_at: '2026-01-15'
      },
      {
        id: 'cat-6',
        nama_kategori: 'Kedokteran & Farmasi',
        deskripsi: 'Buku teks farmakologi klinis, anatomi manusia modern, dan protokol diagnosis medik.',
        created_at: '2026-01-18'
      },
      {
        id: 'cat-7',
        nama_kategori: 'Hukum & Tata Negara',
        deskripsi: 'Doktrin tata negara, konstitusi, kebijakan publik dan reformasi hukum perdata.',
        created_at: '2026-01-20'
      }
    ],

    books: [
      {
        id: 'bk-1',
        kode_buku: 'TIK-001',
        isbn: '978-602-03-9821-4',
        judul: 'Kecerdasan Buatan dan Pembelajaran Mesin',
        penulis: 'Dr. Andri Kusuma & Prof. Sari Dewi',
        penerbit: 'Akademia Publishing',
        tahun_terbit: 2025,
        kategori_id: 'cat-1',
        stok: 6,
        cover: 'assets/covers/cover_ai_ml.jpg',
        deskripsi: 'Buku komprehensif mengupas pondasi matematika machine learning, neural networks, deep learning transformer, dan implementasi praktis kecerdasan buatan.',
        lokasi_rak: 'Rak A-01',
        created_at: '2026-01-15'
      },
      {
        id: 'bk-2',
        kode_buku: 'FIS-002',
        isbn: '978-602-04-1102-9',
        judul: 'Prinsip Dasar Fisika Modern',
        penulis: 'Jurusan Fisika FMIPA Universitas Indonesia',
        penerbit: 'Edisi Pers Universitas',
        tahun_terbit: 2024,
        kategori_id: 'cat-2',
        stok: 4,
        cover: 'assets/covers/cover_fisika.jpg',
        deskripsi: 'Pembahasan lengkap mulai dari relativitas khusus Einstein, mekanika kuantum, struktur atom hingga fenomena astrofisika dan partikel kosmologi.',
        lokasi_rak: 'Rak B-03',
        created_at: '2026-01-16'
      },
      {
        id: 'bk-3',
        kode_buku: 'SAS-003',
        isbn: '978-979-22-8700-1',
        judul: 'Lembayung di Balik Cakrawala',
        penulis: 'Ahmad Fuadi Pratama',
        penerbit: 'Pustaka Media Indonesia',
        tahun_terbit: 2023,
        kategori_id: 'cat-3',
        stok: 5,
        cover: 'assets/covers/cover_sastra.svg',
        deskripsi: 'Sebuah novel perjalanan emosional seorang pemuda pulau yang menempuh pendidikan di tanah rantau demi membuktikan tekad dan menjaga janji leluhur.',
        lokasi_rak: 'Rak C-05',
        created_at: '2026-01-17'
      },
      {
        id: 'bk-4',
        kode_buku: 'EKO-004',
        isbn: '978-602-424-651-7',
        judul: 'Manajemen Bisnis & Strategi Digital',
        penulis: 'Prof. Dr. Hendra Wijaya, S.E., M.M.',
        penerbit: 'Institut Bisnis & Keuangan Indonesia',
        tahun_terbit: 2025,
        kategori_id: 'cat-4',
        stok: 7,
        cover: 'assets/covers/cover_ekonomi.svg',
        deskripsi: 'Pedoman eksekutif dan manajerial dalam merancang arsitektur bisnis modern, pemanfaatan ekosistem cloud, serta analisis finansial prediktif.',
        lokasi_rak: 'Rak D-02',
        created_at: '2026-01-18'
      },
      {
        id: 'bk-5',
        kode_buku: 'KOM-005',
        isbn: '978-623-180-221-5',
        judul: 'Arsitektur Web dan Rekayasa Sistem',
        penulis: 'Ir. Rian Pratama, M.Kom.',
        penerbit: 'Deepmind Press & Akademia',
        tahun_terbit: 2025,
        kategori_id: 'cat-1',
        stok: 5,
        cover: 'assets/covers/cover_webdev.svg',
        deskripsi: 'Kajian arsitektur microservices, clean code, optimasi performa web skala jutaan pengguna, dan implementasi continuous delivery yang andal.',
        lokasi_rak: 'Rak A-02',
        created_at: '2026-01-19'
      },
      {
        id: 'bk-6',
        kode_buku: 'SEJ-006',
        isbn: '978-602-740-983-3',
        judul: 'Nusantara: Jejak Jalur Rempah & Maritim',
        penulis: 'Dr. Asri Wardani, M.Hum.',
        penerbit: 'Lembaga Sejarah & Arkeologi',
        tahun_terbit: 2024,
        kategori_id: 'cat-5',
        stok: 4,
        cover: 'assets/covers/cover_sejarah.svg',
        deskripsi: 'Rekonstruksi mendalam diplomasi bahari kerajaan-kerajaan Nusantara, perniagaan lintas samudra Hindia-Pasifik, dan dampaknya pada peta dunia.',
        lokasi_rak: 'Rak E-01',
        created_at: '2026-01-20'
      },
      {
        id: 'bk-7',
        kode_buku: 'MED-007',
        isbn: '978-602-120-774-0',
        judul: 'Farmakologi Dasar & Anatomi Klinis',
        penulis: 'dr. Nadia Kartika, Sp.PK',
        penerbit: 'Fakultas Kedokteran Nasional',
        tahun_terbit: 2024,
        kategori_id: 'cat-6',
        stok: 3,
        cover: 'assets/covers/cover_kedokteran.svg',
        deskripsi: 'Referensi klinis praktis mahasiswa kedokteran dan tenaga kesehatan mengenai interaksi obat, mekanisme seluler, dan korelasi anatomi tubuh.',
        lokasi_rak: 'Rak F-04',
        created_at: '2026-01-21'
      },
      {
        id: 'bk-8',
        kode_buku: 'HUK-008',
        isbn: '978-623-218-440-2',
        judul: 'Hukum Tata Negara & Reformasi Publik',
        penulis: 'Prof. Bagus Santoso, S.H., M.H.',
        penerbit: 'Pers Hukum dan Konstitusi',
        tahun_terbit: 2023,
        kategori_id: 'cat-7',
        stok: 4,
        cover: 'assets/covers/cover_hukum.svg',
        deskripsi: 'Analisis yuridis komprehensif mengenai lembaga kepresidenan, mekanisme peradilan konstitusi, serta harmonisasi peraturan perundang-undangan.',
        lokasi_rak: 'Rak G-02',
        created_at: '2026-01-22'
      }
    ],

    loans: [
      {
        id: 'ln-101',
        kode_transaksi: 'TRX-202609-001',
        anggota_id: 'mem-1', // Andi Pratama (Siswa)
        tanggal_pinjam: '2026-09-27',
        tanggal_jatuh_tempo: '2026-10-04', // 7 hari
        status: 'Dipinjam',
        created_at: '2026-09-27'
      },
      {
        id: 'ln-102',
        kode_transaksi: 'TRX-202609-002',
        anggota_id: 'mem-2', // Dewi Lestari (Mahasiswa) - Overdue scenario
        tanggal_pinjam: '2026-09-17',
        tanggal_jatuh_tempo: '2026-09-24', // Jatuh tempo 7 hari kemudian (24 Sept) -> 7 hari terlambat per 1 Okt 2026
        status: 'Terlambat',
        created_at: '2026-09-17'
      },
      {
        id: 'ln-103',
        kode_transaksi: 'TRX-202609-003',
        anggota_id: 'mem-3', // Pak Budi Santoso (Guru) - Completed scenario
        tanggal_pinjam: '2026-09-10',
        tanggal_jatuh_tempo: '2026-09-17',
        status: 'Selesai',
        created_at: '2026-09-10'
      }
    ],

    loan_details: [
      // ln-101 (Andi Pratama - 2 buku)
      {
        id: 'ld-1',
        loan_id: 'ln-101',
        buku_id: 'bk-1', // AI & ML
        status: 'Dipinjam',
        tanggal_kembali: null,
        hari_terlambat: 0,
        denda_amount: 0
      },
      {
        id: 'ld-2',
        loan_id: 'ln-101',
        buku_id: 'bk-5', // Web Dev
        status: 'Dipinjam',
        tanggal_kembali: null,
        hari_terlambat: 0,
        denda_amount: 0
      },

      // ln-102 (Dewi Lestari - 2 buku terlambat)
      {
        id: 'ld-3',
        loan_id: 'ln-102',
        buku_id: 'bk-2', // Fisika Modern
        status: 'Dipinjam',
        tanggal_kembali: null,
        hari_terlambat: 7, // 1 Okt - 24 Sept = 7 hari
        denda_amount: 14 // 7 * $2 = $14
      },
      {
        id: 'ld-4',
        loan_id: 'ln-102',
        buku_id: 'bk-4', // Manajemen Bisnis
        status: 'Dipinjam',
        tanggal_kembali: null,
        hari_terlambat: 7,
        denda_amount: 14
      },

      // ln-103 (Pak Budi - Selesai dikembalikan tepat waktu)
      {
        id: 'ld-5',
        loan_id: 'ln-103',
        buku_id: 'bk-6', // Sejarah
        status: 'Kembali',
        tanggal_kembali: '2026-09-16',
        hari_terlambat: 0,
        denda_amount: 0
      }
    ],

    returns: [
      {
        id: 'ret-1',
        loan_id: 'ln-103',
        detail_id: 'ld-5',
        buku_id: 'bk-6',
        tanggal_kembali: '2026-09-16',
        hari_terlambat: 0,
        denda_amount: 0,
        created_at: '2026-09-16'
      }
    ],

    fines: [
      {
        id: 'fne-1',
        kode_denda: 'FNE-202609-001',
        loan_id: 'ln-102',
        detail_id: 'ld-3',
        anggota_id: 'mem-2', // Dewi Lestari
        buku_id: 'bk-2',
        jumlah_hari_terlambat: 7,
        jumlah: 14, // $14 ($2/hari * 7 hari)
        status: 'Belum Dibayar',
        tanggal_pembayaran: null,
        metode_pembayaran: null,
        catatan: 'Terlambat 7 hari pengembalian buku Fisika Modern.',
        created_at: '2026-09-25'
      },
      {
        id: 'fne-2',
        kode_denda: 'FNE-202609-002',
        loan_id: 'ln-102',
        detail_id: 'ld-4',
        anggota_id: 'mem-2', // Dewi Lestari
        buku_id: 'bk-4',
        jumlah_hari_terlambat: 7,
        jumlah: 14,
        status: 'Belum Dibayar',
        tanggal_pembayaran: null,
        metode_pembayaran: null,
        catatan: 'Terlambat 7 hari pengembalian buku Manajemen Bisnis.',
        created_at: '2026-09-25'
      },
      {
        id: 'fne-0',
        kode_denda: 'FNE-202609-000',
        loan_id: 'ln-099',
        detail_id: 'ld-0',
        anggota_id: 'mem-1', // Andi Pratama
        buku_id: 'bk-3',
        jumlah_hari_terlambat: 2,
        jumlah: 4, // $4 (2 hari * $2)
        status: 'Lunas',
        tanggal_pembayaran: '2026-09-20',
        metode_pembayaran: 'QRIS',
        catatan: 'Denda keterlambatan telah dilunasi via QRIS pada 20/09/2026.',
        created_at: '2026-09-18'
      }
    ],

    activities: [
      {
        id: 'act-1',
        timestamp: '2026-09-27 10:15',
        user_name: 'Petugas Perpustakaan',
        action: 'Peminjaman Baru',
        description: 'Mencatat peminjaman 2 buku untuk Andi Pratama (#TRX-202609-001)',
        type: 'loan'
      },
      {
        id: 'act-2',
        timestamp: '2026-09-25 08:30',
        user_name: 'Sistem Otomatis',
        action: 'Keterlambatan Terdeteksi',
        description: 'Transaksi #TRX-202609-002 (Dewi Lestari) melewati jatuh tempo. Denda terhitung $2/hari.',
        type: 'fine'
      },
      {
        id: 'act-3',
        timestamp: '2026-09-20 14:05',
        user_name: 'Petugas Perpustakaan',
        action: 'Pembayaran Denda',
        description: 'Menerima pembayaran denda $4 dari Andi Pratama melalui QRIS (#FNE-202609-000)',
        type: 'fine'
      },
      {
        id: 'act-4',
        timestamp: '2026-09-16 11:20',
        user_name: 'Petugas Perpustakaan',
        action: 'Pengembalian Buku',
        description: 'Menerima pengembalian tepat waktu buku Sejarah dari Pak Budi Santoso (#TRX-202609-003)',
        type: 'return'
      }
    ]
  };

  class Store {
    constructor() {
      this.data = this.load();
      this.currentDate = '2026-10-01'; // Default system date per simulation requirements
      this.recalculateOverdueStatus();
    }

    load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to parse localStorage, resetting to default.', e);
      }
      this.save(defaultData);
      return JSON.parse(JSON.stringify(defaultData));
    }

    save(dataToSave) {
      const data = dataToSave || this.data;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Storage full or error saving data:', e);
      }
    }

    resetAll() {
      localStorage.removeItem(STORAGE_KEY);
      this.data = JSON.parse(JSON.stringify(defaultData));
      this.save();
      this.recalculateOverdueStatus();
      return true;
    }

    // Helper: Calculate diff in days between two YYYY-MM-DD dates
    getDaysDiff(startDateStr, endDateStr) {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const diffTime = end.getTime() - start.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // Helper: Add days to YYYY-MM-DD
    addDays(dateStr, days) {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + days);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Recalculate overdue loans based on current simulation date
    recalculateOverdueStatus() {
      const now = this.currentDate;
      this.data.loans.forEach((loan) => {
        if (loan.status === 'Dipinjam' || loan.status === 'Sebagian Kembali') {
          if (loan.tanggal_jatuh_tempo < now) {
            loan.status = 'Terlambat';
          }
        }
      });
      this.save();
    }

    // Log Activity
    logActivity(action, description, type, userName = 'Admin') {
      const act = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user_name: userName,
        action,
        description,
        type: type || 'general'
      };
      this.data.activities.unshift(act);
      if (this.data.activities.length > 50) {
        this.data.activities.pop();
      }
      this.save();
    }

    // --- BOOKS ---
    getBooks() {
      return this.data.books.map((b) => {
        const borrowedCount = this.getBookBorrowedCount(b.id);
        const availableStock = Math.max(0, b.stok - borrowedCount);
        const status = availableStock > 0 ? 'Tersedia' : 'Tidak Tersedia';
        const category = this.data.categories.find((c) => c.id === b.kategori_id);
        return {
          ...b,
          stok_tersedia: availableStock,
          dipinjam_count: borrowedCount,
          kategori_nama: category ? category.nama_kategori : 'Umum',
          status_ketersediaan: status
        };
      });
    }

    getBookById(id) {
      const books = this.getBooks();
      return books.find((b) => b.id === id) || null;
    }

    getBookBorrowedCount(bookId) {
      let count = 0;
      this.data.loan_details.forEach((ld) => {
        if (ld.buku_id === bookId && ld.status === 'Dipinjam') {
          count++;
        }
      });
      return count;
    }

    addBook(bookData) {
      if (!bookData.judul || !bookData.penulis || !bookData.kategori_id || bookData.stok == null) {
        throw new Error('Harap lengkapi semua field wajib bertanda (*).');
      }

      const id = 'bk-' + Date.now();
      const kode = bookData.kode_buku || 'BK-' + String(this.data.books.length + 1).padStart(3, '0');
      const newBook = {
        id,
        kode_buku: kode,
        isbn: bookData.isbn || null,
        judul: bookData.judul.trim(),
        penulis: bookData.penulis.trim(),
        penerbit: bookData.penerbit ? bookData.penerbit.trim() : 'Penerbit Mandiri',
        tahun_terbit: parseInt(bookData.tahun_terbit, 10) || new Date().getFullYear(),
        kategori_id: bookData.kategori_id,
        stok: parseInt(bookData.stok, 10) || 1,
        cover: bookData.cover || 'assets/covers/cover_ai_ml.jpg',
        deskripsi: bookData.deskripsi ? bookData.deskripsi.trim() : 'Buku koleksi perpustakaan.',
        lokasi_rak: bookData.lokasi_rak || 'Rak Umum',
        created_at: this.currentDate
      };

      this.data.books.unshift(newBook);
      this.logActivity('Tambah Buku', `Menambahkan buku "${newBook.judul}" (${newBook.kode_buku})`, 'book');
      this.save();
      return newBook;
    }

    updateBook(id, updateData) {
      const idx = this.data.books.findIndex((b) => b.id === id);
      if (idx === -1) throw new Error('Buku tidak ditemukan.');

      this.data.books[idx] = {
        ...this.data.books[idx],
        ...updateData,
        stok: parseInt(updateData.stok, 10) || this.data.books[idx].stok,
        tahun_terbit: parseInt(updateData.tahun_terbit, 10) || this.data.books[idx].tahun_terbit
      };
      this.logActivity('Ubah Buku', `Memperbarui data buku "${this.data.books[idx].judul}"`, 'book');
      this.save();
      return this.data.books[idx];
    }

    deleteBook(id) {
      const book = this.getBookById(id);
      if (!book) throw new Error('Buku tidak ditemukan.');

      // Check PRD 8.4: Buku yang memiliki transaksi aktif tidak boleh dihapus
      const activeBorrowed = this.getBookBorrowedCount(id);
      if (activeBorrowed > 0) {
        throw new Error(`Buku "${book.judul}" tidak dapat dihapus karena masih sedang dipinjam (${activeBorrowed} eksemplar aktif).`);
      }

      this.data.books = this.data.books.filter((b) => b.id !== id);
      this.logActivity('Hapus Buku', `Menghapus buku "${book.judul}" (${book.kode_buku})`, 'book');
      this.save();
      return true;
    }

    // --- CATEGORIES ---
    getCategories() {
      return this.data.categories.map((c) => {
        const bookCount = this.data.books.filter((b) => b.kategori_id === c.id).length;
        return {
          ...c,
          jumlah_buku: bookCount
        };
      });
    }

    addCategory(catData) {
      if (!catData.nama_kategori) throw new Error('Nama kategori wajib diisi.');
      const id = 'cat-' + Date.now();
      const newCat = {
        id,
        nama_kategori: catData.nama_kategori.trim(),
        deskripsi: catData.deskripsi ? catData.deskripsi.trim() : '',
        created_at: this.currentDate
      };
      this.data.categories.push(newCat);
      this.logActivity('Tambah Kategori', `Menambahkan kategori "${newCat.nama_kategori}"`, 'general');
      this.save();
      return newCat;
    }

    updateCategory(id, updateData) {
      const idx = this.data.categories.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Kategori tidak ditemukan.');
      this.data.categories[idx] = {
        ...this.data.categories[idx],
        ...updateData
      };
      this.logActivity('Ubah Kategori', `Mengubah kategori "${this.data.categories[idx].nama_kategori}"`, 'general');
      this.save();
      return this.data.categories[idx];
    }

    deleteCategory(id) {
      // Check PRD 8.5: Kategori yang masih digunakan buku tidak boleh dihapus
      const relatedBooks = this.data.books.filter((b) => b.kategori_id === id);
      if (relatedBooks.length > 0) {
        throw new Error(`Kategori ini tidak dapat dihapus karena masih digunakan oleh ${relatedBooks.length} judul buku.`);
      }

      const cat = this.data.categories.find((c) => c.id === id);
      this.data.categories = this.data.categories.filter((c) => c.id !== id);
      if (cat) {
        this.logActivity('Hapus Kategori', `Menghapus kategori "${cat.nama_kategori}"`, 'general');
      }
      this.save();
      return true;
    }

    // --- MEMBERS ---
    getMembers() {
      return this.data.members.map((m) => {
        const activeLoansCount = this.getMemberActiveBooksCount(m.id);
        const maxLimit = this.getMaxLoanLimit(m.jenis_anggota);
        const unpaidFines = this.getMemberUnpaidFinesTotal(m.id);
        return {
          ...m,
          buku_aktif_count: activeLoansCount,
          batas_maksimal: maxLimit,
          sisa_kuota: Math.max(0, maxLimit - activeLoansCount),
          total_denda_unpaid: unpaidFines
        };
      });
    }

    getMemberById(id) {
      const members = this.getMembers();
      return members.find((m) => m.id === id) || null;
    }

    getMemberByUserId(userId) {
      const members = this.getMembers();
      return members.find((m) => m.user_id === userId) || null;
    }

    getMaxLoanLimit(jenisAnggota) {
      // PRD 6.FR-07: Siswa: 5, Mahasiswa: 5, Guru: 10, Dosen: 10
      if (jenisAnggota === 'Guru' || jenisAnggota === 'Dosen') {
        return 10;
      }
      return 5;
    }

    getMemberActiveBooksCount(memberId) {
      let count = 0;
      const memberLoanIds = this.data.loans
        .filter((l) => l.anggota_id === memberId && (l.status === 'Dipinjam' || l.status === 'Sebagian Kembali' || l.status === 'Terlambat'))
        .map((l) => l.id);

      this.data.loan_details.forEach((ld) => {
        if (memberLoanIds.includes(ld.loan_id) && ld.status === 'Dipinjam') {
          count++;
        }
      });
      return count;
    }

    getMemberUnpaidFinesTotal(memberId) {
      return this.data.fines
        .filter((f) => f.anggota_id === memberId && f.status === 'Belum Dibayar')
        .reduce((sum, f) => sum + (f.jumlah || 0), 0);
    }

    addMember(memberData) {
      if (!memberData.nama || !memberData.email || !memberData.jenis_anggota) {
        throw new Error('Nama, Email, dan Jenis Anggota wajib diisi.');
      }

      // Check email uniqueness
      if (this.data.members.some((m) => m.email.toLowerCase() === memberData.email.toLowerCase())) {
        throw new Error('Email anggota ini sudah terdaftar.');
      }

      const memId = 'mem-' + Date.now();
      const usrId = 'usr-' + Date.now();
      const noAnggota = memberData.nomor_anggota || `ANG-2026-${String(this.data.members.length + 1).padStart(3, '0')}`;

      // Create linked user
      const newUser = {
        id: usrId,
        name: memberData.nama.trim(),
        email: memberData.email.trim(),
        password: memberData.password || 'user123',
        role: 'member',
        member_id: memId,
        created_at: this.currentDate
      };
      this.data.users.push(newUser);

      const newMember = {
        id: memId,
        user_id: usrId,
        nomor_anggota: noAnggota,
        nama: memberData.nama.trim(),
        email: memberData.email.trim(),
        no_telepon: memberData.no_telepon ? memberData.no_telepon.trim() : '-',
        alamat: memberData.alamat ? memberData.alamat.trim() : '-',
        jenis_anggota: memberData.jenis_anggota,
        status: memberData.status || 'Aktif',
        created_at: this.currentDate
      };
      this.data.members.push(newMember);

      this.logActivity('Tambah Anggota', `Mendaftarkan anggota baru "${newMember.nama}" (${newMember.jenis_anggota})`, 'member');
      this.save();
      return newMember;
    }

    updateMember(id, updateData) {
      const idx = this.data.members.findIndex((m) => m.id === id);
      if (idx === -1) throw new Error('Anggota tidak ditemukan.');

      this.data.members[idx] = {
        ...this.data.members[idx],
        ...updateData
      };

      // Also update linked user name if changed
      const user = this.data.users.find((u) => u.id === this.data.members[idx].user_id);
      if (user && updateData.nama) {
        user.name = updateData.nama;
      }

      this.logActivity('Ubah Anggota', `Memperbarui data anggota "${this.data.members[idx].nama}"`, 'member');
      this.save();
      return this.data.members[idx];
    }

    deleteMember(id) {
      const member = this.getMemberById(id);
      if (!member) throw new Error('Anggota tidak ditemukan.');

      const activeLoans = this.getMemberActiveBooksCount(id);
      if (activeLoans > 0) {
        throw new Error(`Anggota "${member.nama}" masih memiliki ${activeLoans} buku yang belum dikembalikan!`);
      }

      const unpaidFines = this.getMemberUnpaidFinesTotal(id);
      if (unpaidFines > 0) {
        throw new Error(`Anggota "${member.nama}" memiliki tunggakan denda sebesar $${unpaidFines} yang belum dilunasi.`);
      }

      this.data.members = this.data.members.filter((m) => m.id !== id);
      this.data.users = this.data.users.filter((u) => u.id !== member.user_id);
      this.logActivity('Hapus Anggota', `Menghapus anggota "${member.nama}" (${member.nomor_anggota})`, 'member');
      this.save();
      return true;
    }

    // --- TRANSACTIONS: PEMINJAMAN (LOANS) ---
    getLoans() {
      return this.data.loans.map((l) => {
        const member = this.data.members.find((m) => m.id === l.anggota_id);
        const details = this.data.loan_details
          .filter((ld) => ld.loan_id === l.id)
          .map((ld) => {
            const book = this.getBookById(ld.buku_id);
            return {
              ...ld,
              buku: book
            };
          });

        const activeItems = details.filter((d) => d.status === 'Dipinjam');
        const returnedItems = details.filter((d) => d.status === 'Kembali');

        // Check if overdue relative to today
        const isOverdue = (l.status === 'Dipinjam' || l.status === 'Sebagian Kembali' || l.status === 'Terlambat') && l.tanggal_jatuh_tempo < this.currentDate;
        const daysOverdue = isOverdue ? Math.max(0, this.getDaysDiff(l.tanggal_jatuh_tempo, this.currentDate)) : 0;
        const calculatedFine = daysOverdue * 2 * activeItems.length;

        return {
          ...l,
          anggota: member,
          details,
          total_buku: details.length,
          buku_aktif_count: activeItems.length,
          buku_kembali_count: returnedItems.length,
          is_overdue: isOverdue,
          hari_terlambat: daysOverdue,
          potensi_denda: calculatedFine
        };
      });
    }

    getLoanById(id) {
      const loans = this.getLoans();
      return loans.find((l) => l.id === id) || null;
    }

    createLoan({ anggota_id, buku_ids, tanggal_pinjam }) {
      // 1. Validate Member
      const member = this.getMemberById(anggota_id);
      if (!member) throw new Error('Data anggota tidak valid.');
      if (member.status !== 'Aktif') {
        throw new Error(`Peminjaman ditolak: Anggota "${member.nama}" berstatus Nonaktif (PRD 8.3).`);
      }

      // 2. Validate Book IDs
      if (!Array.isArray(buku_ids) || buku_ids.length === 0) {
        throw new Error('Pilih minimal satu buku untuk dipinjam.');
      }

      // 3. Validate Loan Quota (PRD 6.FR-07)
      const currentActive = this.getMemberActiveBooksCount(anggota_id);
      const maxLimit = this.getMaxLoanLimit(member.jenis_anggota);
      const remainingQuota = maxLimit - currentActive;

      if (buku_ids.length > remainingQuota) {
        throw new Error(`Peminjaman melebihi batas! Anggota jenis "${member.jenis_anggota}" maksimal meminjam ${maxLimit} buku aktif. Saat ini sedang meminjam ${currentActive} buku, sisa kuota: ${remainingQuota} buku.`);
      }

      // 4. Validate Book Stock Availability
      const requestedBooks = [];
      for (const bId of buku_ids) {
        const book = this.getBookById(bId);
        if (!book) throw new Error(`Buku dengan ID ${bId} tidak ditemukan.`);
        if (book.stok_tersedia <= 0) {
          throw new Error(`Buku "${book.judul}" saat ini tidak tersedia (stok habis) (PRD 8.1).`);
        }
        requestedBooks.push(book);
      }

      // 5. Calculate Dates (PRD 6.FR-07: Durasi 7 hari)
      const pinjamDate = tanggal_pinjam || this.currentDate;
      const jatuhTempoDate = this.addDays(pinjamDate, 7);

      const loanId = 'ln-' + Date.now();
      const codeTrx = `TRX-${pinjamDate.replace(/-/g, '').substring(0, 6)}-${String(this.data.loans.length + 1).padStart(3, '0')}`;

      const newLoan = {
        id: loanId,
        kode_transaksi: codeTrx,
        anggota_id,
        tanggal_pinjam: pinjamDate,
        tanggal_jatuh_tempo: jatuhTempoDate,
        status: 'Dipinjam',
        created_at: pinjamDate
      };

      // Add Loan Details
      const newDetails = requestedBooks.map((b, idx) => ({
        id: `ld-${Date.now()}-${idx}`,
        loan_id: loanId,
        buku_id: b.id,
        status: 'Dipinjam',
        tanggal_kembali: null,
        hari_terlambat: 0,
        denda_amount: 0
      }));

      this.data.loans.unshift(newLoan);
      this.data.loan_details.push(...newDetails);

      const bookNames = requestedBooks.map((b) => b.judul).join(', ');
      this.logActivity(
        'Peminjaman Baru',
        `Peminjaman ${requestedBooks.length} buku untuk ${member.nama} (${codeTrx}): [${bookNames}]`,
        'loan'
      );

      this.save();
      return this.getLoanById(loanId);
    }

    // --- TRANSACTIONS: PENGEMBALIAN (RETURNS & PARTIAL RETURNS) ---
    processReturn({ loan_id, detail_ids, tanggal_kembali }) {
      const loan = this.getLoanById(loan_id);
      if (!loan) throw new Error('Data transaksi peminjaman tidak ditemukan.');

      if (!Array.isArray(detail_ids) || detail_ids.length === 0) {
        throw new Error('Pilih minimal satu buku yang dikembalikan.');
      }

      const returnDate = tanggal_kembali || this.currentDate;
      const member = this.getMemberById(loan.anggota_id);

      // Calculate Overdue days
      const daysOverdue = Math.max(0, this.getDaysDiff(loan.tanggal_jatuh_tempo, returnDate));
      const finePerBook = daysOverdue * 2; // PRD 6.FR-09: $2 per hari

      const returnedItems = [];
      const newFines = [];

      for (const dId of detail_ids) {
        const detail = this.data.loan_details.find((ld) => ld.id === dId);
        if (!detail) continue;

        // PRD 8.6: Cegah pengembalian ganda
        if (detail.status === 'Kembali') {
          throw new Error('Buku ini sudah tercatat telah dikembalikan sebelumnya.');
        }

        detail.status = 'Kembali';
        detail.tanggal_kembali = returnDate;
        detail.hari_terlambat = daysOverdue;
        detail.denda_amount = finePerBook;

        // Record in returns table
        const retRecord = {
          id: 'ret-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          loan_id: loan.id,
          detail_id: detail.id,
          buku_id: detail.buku_id,
          tanggal_kembali: returnDate,
          hari_terlambat: daysOverdue,
          denda_amount: finePerBook,
          created_at: returnDate
        };
        this.data.returns.unshift(retRecord);
        returnedItems.push(detail);

        // If late fee applies, generate fine record (PRD FR-09)
        if (finePerBook > 0) {
          const fineId = 'fne-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
          const fineCode = `FNE-${returnDate.replace(/-/g, '').substring(0, 6)}-${String(this.data.fines.length + 1).padStart(3, '0')}`;
          const bookObj = this.getBookById(detail.buku_id);

          const newFine = {
            id: fineId,
            kode_denda: fineCode,
            loan_id: loan.id,
            detail_id: detail.id,
            anggota_id: loan.anggota_id,
            buku_id: detail.buku_id,
            jumlah_hari_terlambat: daysOverdue,
            jumlah: finePerBook,
            status: 'Belum Dibayar',
            tanggal_pembayaran: null,
            metode_pembayaran: null,
            catatan: `Keterlambatan ${daysOverdue} hari untuk buku "${bookObj ? bookObj.judul : 'Koleksi'}" (Jatuh tempo: ${loan.tanggal_jatuh_tempo})`,
            created_at: returnDate
          };
          this.data.fines.unshift(newFine);
          newFines.push(newFine);
        }
      }

      // Update overall Loan status
      const allLoanDetails = this.data.loan_details.filter((ld) => ld.loan_id === loan.id);
      const remainingUnreturned = allLoanDetails.filter((ld) => ld.status === 'Dipinjam');

      const loanRecord = this.data.loans.find((l) => l.id === loan.id);
      if (loanRecord) {
        if (remainingUnreturned.length === 0) {
          loanRecord.status = 'Selesai';
        } else {
          loanRecord.status = 'Sebagian Kembali';
        }
      }

      this.logActivity(
        'Pengembalian Buku',
        `Menerima pengembalian ${returnedItems.length} buku dari ${member ? member.nama : 'Anggota'} (${loan.kode_transaksi}). Keterlambatan: ${daysOverdue} hari${newFines.length > 0 ? `, Denda: $${newFines.reduce((s, f) => s + f.jumlah, 0)}` : ''}`,
        'return'
      );

      this.save();
      return {
        returned_count: returnedItems.length,
        days_overdue: daysOverdue,
        total_fine: newFines.reduce((s, f) => s + f.jumlah, 0),
        new_fines: newFines,
        loan_status: loanRecord ? loanRecord.status : 'Selesai'
      };
    }

    // --- FINES & PAYMENTS ---
    getFines() {
      return this.data.fines.map((f) => {
        const member = this.data.members.find((m) => m.id === f.anggota_id);
        const book = this.getBookById(f.buku_id);
        const loan = this.data.loans.find((l) => l.id === f.loan_id);
        return {
          ...f,
          anggota: member,
          buku: book,
          loan: loan
        };
      });
    }

    getFineById(id) {
      const fines = this.getFines();
      return fines.find((f) => f.id === id) || null;
    }

    payFine({ fine_id, tanggal_pembayaran, metode_pembayaran, catatan_pembayaran }) {
      const fine = this.data.fines.find((f) => f.id === fine_id);
      if (!fine) throw new Error('Data denda tidak ditemukan.');

      if (fine.status === 'Lunas') {
        throw new Error('Denda ini sudah lunas sebelumnya.');
      }

      if (!metode_pembayaran) {
        throw new Error('Metode pembayaran wajib dipilih (PRD 6.FR-10).');
      }

      const payDate = tanggal_pembayaran || this.currentDate;
      fine.status = 'Lunas';
      fine.tanggal_pembayaran = payDate;
      fine.metode_pembayaran = metode_pembayaran;
      if (catatan_pembayaran) {
        fine.catatan = (fine.catatan ? fine.catatan + ' | ' : '') + catatan_pembayaran;
      }

      const member = this.data.members.find((m) => m.id === fine.anggota_id);
      this.logActivity(
        'Pembayaran Denda',
        `Pelunasan denda $${fine.jumlah} oleh ${member ? member.nama : 'Anggota'} via ${metode_pembayaran} (${fine.kode_denda})`,
        'fine'
      );

      this.save();
      return fine;
    }

    // --- REPORT DATA GENERATORS (PRD 6.FR-11) ---
    getReportData(type, filters = {}) {
      const startDate = filters.startDate || '1970-01-01';
      const endDate = filters.endDate || '2099-12-31';
      const keyword = (filters.keyword || '').toLowerCase().trim();

      switch (type) {
        case 'buku': {
          let list = this.getBooks();
          if (filters.kategori_id) {
            list = list.filter((b) => b.kategori_id === filters.kategori_id);
          }
          if (filters.status) {
            list = list.filter((b) => b.status_ketersediaan === filters.status);
          }
          if (keyword) {
            list = list.filter((b) =>
              b.judul.toLowerCase().includes(keyword) ||
              b.penulis.toLowerCase().includes(keyword) ||
              b.kode_buku.toLowerCase().includes(keyword) ||
              (b.isbn && b.isbn.toLowerCase().includes(keyword))
            );
          }
          return {
            title: 'Laporan Koleksi Buku Perpustakaan',
            total_items: list.length,
            total_stok: list.reduce((s, b) => s + b.stok, 0),
            total_dipinjam: list.reduce((s, b) => s + b.dipinjam_count, 0),
            total_tersedia: list.reduce((s, b) => s + b.stok_tersedia, 0),
            items: list
          };
        }

        case 'anggota': {
          let list = this.getMembers();
          if (filters.jenis_anggota) {
            list = list.filter((m) => m.jenis_anggota === filters.jenis_anggota);
          }
          if (filters.status) {
            list = list.filter((m) => m.status === filters.status);
          }
          if (keyword) {
            list = list.filter((m) =>
              m.nama.toLowerCase().includes(keyword) ||
              m.nomor_anggota.toLowerCase().includes(keyword) ||
              m.email.toLowerCase().includes(keyword)
            );
          }
          return {
            title: 'Laporan Data Anggota Perpustakaan',
            total_items: list.length,
            total_aktif: list.filter((m) => m.status === 'Aktif').length,
            total_nonaktif: list.filter((m) => m.status === 'Nonaktif').length,
            items: list
          };
        }

        case 'peminjaman': {
          let list = this.getLoans().filter(
            (l) => l.tanggal_pinjam >= startDate && l.tanggal_pinjam <= endDate
          );
          if (filters.status) {
            list = list.filter((l) => l.status === filters.status);
          }
          if (keyword) {
            list = list.filter((l) =>
              l.kode_transaksi.toLowerCase().includes(keyword) ||
              (l.anggota && l.anggota.nama.toLowerCase().includes(keyword))
            );
          }
          return {
            title: 'Laporan Transaksi Peminjaman Buku',
            total_items: list.length,
            total_buku_dipinjam: list.reduce((s, l) => s + l.total_buku, 0),
            total_aktif: list.filter((l) => l.status === 'Dipinjam' || l.status === 'Sebagian Kembali').length,
            total_terlambat: list.filter((l) => l.status === 'Terlambat').length,
            items: list
          };
        }

        case 'pengembalian': {
          let list = this.data.returns
            .filter((r) => r.tanggal_kembali >= startDate && r.tanggal_kembali <= endDate)
            .map((r) => {
              const loan = this.data.loans.find((l) => l.id === r.loan_id);
              const member = loan ? this.data.members.find((m) => m.id === loan.anggota_id) : null;
              const book = this.getBookById(r.buku_id);
              return {
                ...r,
                kode_transaksi: loan ? loan.kode_transaksi : '-',
                anggota_nama: member ? member.nama : 'Anggota',
                buku_judul: book ? book.judul : 'Buku',
                jatuh_tempo: loan ? loan.tanggal_jatuh_tempo : '-'
              };
            });

          if (keyword) {
            list = list.filter((r) =>
              r.kode_transaksi.toLowerCase().includes(keyword) ||
              r.anggota_nama.toLowerCase().includes(keyword) ||
              r.buku_judul.toLowerCase().includes(keyword)
            );
          }
          return {
            title: 'Laporan Pengembalian Buku',
            total_items: list.length,
            total_terlambat: list.filter((r) => r.hari_terlambat > 0).length,
            total_denda_terkumpul: list.reduce((s, r) => s + r.denda_amount, 0),
            items: list
          };
        }

        case 'denda': {
          let list = this.getFines().filter((f) => f.created_at >= startDate && f.created_at <= endDate);
          if (filters.status) {
            list = list.filter((f) => f.status === filters.status);
          }
          if (keyword) {
            list = list.filter((f) =>
              f.kode_denda.toLowerCase().includes(keyword) ||
              (f.anggota && f.anggota.nama.toLowerCase().includes(keyword))
            );
          }
          const totalNominal = list.reduce((s, f) => s + f.jumlah, 0);
          const totalLunas = list.filter((f) => f.status === 'Lunas').reduce((s, f) => s + f.jumlah, 0);
          const totalBelumLunas = list.filter((f) => f.status === 'Belum Dibayar').reduce((s, f) => s + f.jumlah, 0);

          return {
            title: 'Laporan Denda dan Keuangan Perpustakaan',
            total_items: list.length,
            total_nominal: totalNominal,
            total_lunas: totalLunas,
            total_belum_lunas: totalBelumLunas,
            items: list
          };
        }

        default:
          return null;
      }
    }
  }

  // Export to global window
  window.PustakaStore = new Store();
})();
