/**
 * app.js - Main Application Controller
 * Sistem Manajemen Perpustakaan Berbasis Web
 * PRD & Design Brief Implementation
 */

(function () {
  'use strict';

  class PustakaApp {
    constructor() {
      this.store = window.PustakaStore;
      this.currentUser = null;
      this.currentRoute = 'dashboard';
      this.currentReportTab = 'buku';

      // Stepper state for new loan
      this.stepperData = {
        step: 1,
        memberId: null,
        selectedBookIds: [],
        pinjamDate: this.store.currentDate,
        tempoDate: this.store.addDays(this.store.currentDate, 7)
      };

      // Active state for return & pay modal
      this.activeReturnLoanId = null;
      this.activePayFineId = null;

      this.init();
    }

    init() {
      // Check for remembered user session or auto-login with default admin
      const savedUser = localStorage.getItem('pustaka_session_user');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch (e) {
          this.currentUser = null;
        }
      }

      if (this.currentUser) {
        this.showAppWorkspace();
      } else {
        this.showLoginView();
      }

      // Initialize lucide icons
      this.refreshIcons();
    }

    refreshIcons() {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    // --- AUTH CONTROLLER ---
    showLoginView() {
      document.getElementById('auth-view').style.display = 'flex';
      document.getElementById('app-view').style.display = 'none';
      this.refreshIcons();
    }

    showAppWorkspace() {
      document.getElementById('auth-view').style.display = 'none';
      document.getElementById('app-view').style.display = 'block';

      this.updateSidebarUser();
      this.applyRoleRestrictions();
      this.updateFineBadge();

      // Navigate to dashboard
      const initialRoute = this.currentUser.role === 'admin' ? 'dashboard' : 'dashboard';
      this.navigate(initialRoute);
      this.refreshIcons();
    }

    handleLogin() {
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;

      const user = this.store.data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
      );

      if (!user) {
        this.showToast('error', 'Login Gagal', 'Email atau kata sandi yang Anda masukkan tidak sesuai.');
        return;
      }

      this.currentUser = user;
      if (remember) {
        localStorage.setItem('pustaka_session_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('pustaka_session_user', JSON.stringify(user));
      }

      this.showToast('success', 'Login Berhasil', `Selamat datang kembali, ${user.name}!`);
      this.showAppWorkspace();
    }

    quickLogin(email, pass) {
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = pass;
      this.handleLogin();
    }

    logout() {
      localStorage.removeItem('pustaka_session_user');
      sessionStorage.removeItem('pustaka_session_user');
      this.currentUser = null;
      this.showToast('info', 'Sampai Jumpa', 'Anda telah berhasil keluar dari sistem perpustakaan.');
      this.showLoginView();
    }

    updateSidebarUser() {
      if (!this.currentUser) return;
      const nameEl = document.getElementById('sidebar-user-name');
      const roleEl = document.getElementById('sidebar-user-role');
      const avatarEl = document.getElementById('sidebar-user-avatar');

      nameEl.textContent = this.currentUser.name;
      avatarEl.textContent = this.currentUser.name.charAt(0).toUpperCase();

      if (this.currentUser.role === 'admin') {
        roleEl.innerHTML = '<i data-lucide="shield" style="width:12px;height:12px;"></i> Admin Perpustakaan';
      } else {
        const mem = this.store.getMemberByUserId(this.currentUser.id);
        const jenis = mem ? mem.jenis_anggota : 'Anggota';
        roleEl.innerHTML = `<i data-lucide="user-check" style="width:12px;height:12px;"></i> ${jenis} Perpustakaan`;
      }
    }

    applyRoleRestrictions() {
      const isAdmin = this.currentUser && this.currentUser.role === 'admin';
      const adminNavEls = document.querySelectorAll('.admin-only-nav');
      const memberNavEls = document.querySelectorAll('.member-only-nav');
      const catalogAdminActions = document.getElementById('catalog-admin-actions');

      adminNavEls.forEach((el) => (el.style.display = isAdmin ? 'block' : 'none'));
      memberNavEls.forEach((el) => (el.style.display = !isAdmin ? 'block' : 'none'));

      if (catalogAdminActions) {
        catalogAdminActions.style.display = isAdmin ? 'block' : 'none';
      }
    }

    updateFineBadge() {
      const badge = document.getElementById('sidebar-fines-badge');
      if (!badge) return;
      const unpaidCount = this.store.data.fines.filter((f) => f.status === 'Belum Dibayar').length;
      if (unpaidCount > 0) {
        badge.textContent = unpaidCount;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }

    // --- NAVIGATION & ROUTING ---
    navigate(route) {
      this.currentRoute = route;

      // Close mobile sidebar if open
      document.getElementById('sidebar').classList.remove('mobile-open');

      // Update Nav Item Active state
      document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
        if (item.getAttribute('data-nav') === route) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Hide all views
      document.querySelectorAll('.view-panel').forEach((panel) => {
        panel.style.display = 'none';
      });

      // Update Header Breadcrumb
      const breadcrumb = document.getElementById('header-breadcrumb');

      // Route handling with Role check
      const isAdmin = this.currentUser && this.currentUser.role === 'admin';

      switch (route) {
        case 'dashboard':
          if (isAdmin) {
            breadcrumb.textContent = 'Perpustakaan / Dashboard Admin';
            document.getElementById('view-dashboard-admin').style.display = 'block';
            this.renderAdminDashboard();
          } else {
            breadcrumb.textContent = 'Perpustakaan / Dashboard Anggota';
            document.getElementById('view-dashboard-member').style.display = 'block';
            this.renderMemberDashboard();
          }
          break;

        case 'catalog':
          breadcrumb.textContent = 'Perpustakaan / Katalog Buku';
          document.getElementById('view-catalog').style.display = 'block';
          this.renderCatalog();
          break;

        case 'books':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Manajemen Buku';
          document.getElementById('view-books').style.display = 'block';
          this.renderAdminBooksTable();
          break;

        case 'categories':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Manajemen Kategori';
          document.getElementById('view-categories').style.display = 'block';
          this.renderAdminCategoriesTable();
          break;

        case 'members':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Manajemen Anggota';
          document.getElementById('view-members').style.display = 'block';
          this.renderAdminMembersTable();
          break;

        case 'loans':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Transaksi Peminjaman';
          document.getElementById('view-loans').style.display = 'block';
          this.renderLoansTable();
          break;

        case 'returns':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Pengembalian Buku';
          document.getElementById('view-returns').style.display = 'block';
          this.renderReturnsView();
          break;

        case 'fines':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Denda & Pembayaran';
          document.getElementById('view-fines').style.display = 'block';
          this.renderFinesTable();
          break;

        case 'reports':
          if (!isAdmin) return this.navigate('dashboard');
          breadcrumb.textContent = 'Perpustakaan / Laporan Terpadu';
          document.getElementById('view-reports').style.display = 'block';
          this.renderReport();
          break;

        case 'my-loans':
        case 'my-history':
          breadcrumb.textContent = route === 'my-loans' ? 'Perpustakaan / Peminjaman Saya' : 'Perpustakaan / Riwayat Transaksi';
          document.getElementById('view-member-loans').style.display = 'block';
          this.renderMemberLoans(route === 'my-history');
          break;

        case 'profile':
          breadcrumb.textContent = 'Perpustakaan / Profil Pengguna';
          document.getElementById('view-profile').style.display = 'block';
          this.renderProfile();
          break;

        default:
          this.navigate('dashboard');
      }

      this.refreshIcons();
    }

    toggleMobileSidebar() {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    }

    // --- RENDER: ADMIN DASHBOARD (Section 15) ---
    renderAdminDashboard() {
      const books = this.store.getBooks();
      const members = this.store.getMembers();
      const loans = this.store.getLoans();
      const fines = this.store.getFines();

      const totalStock = books.reduce((s, b) => s + b.stok, 0);
      const totalAvailable = books.reduce((s, b) => s + b.stok_tersedia, 0);
      const activeMembers = members.filter((m) => m.status === 'Aktif').length;

      const activeLoans = loans.filter((l) => l.status === 'Dipinjam' || l.status === 'Sebagian Kembali');
      const overdueLoans = loans.filter((l) => l.status === 'Terlambat');
      const totalBorrowedBooks = books.reduce((s, b) => s + b.dipinjam_count, 0);

      const unpaidFinesTotal = fines
        .filter((f) => f.status === 'Belum Dibayar')
        .reduce((s, f) => s + f.jumlah, 0);

      document.getElementById('dash-total-books').textContent = books.length;
      document.getElementById('dash-stock-breakdown').textContent = `${totalAvailable} dari ${totalStock} eksemplar tersedia`;

      document.getElementById('dash-total-members').textContent = members.length;
      document.getElementById('dash-active-members').textContent = `${activeMembers} anggota berstatus aktif`;

      document.getElementById('dash-borrowed-books').textContent = totalBorrowedBooks;
      document.getElementById('dash-overdue-loans').textContent = overdueLoans.length;
      document.getElementById('dash-unpaid-fines').textContent = `Total denda tertunggak: $${unpaidFinesTotal}`;

      // Render recent loans table (first 5)
      const tbody = document.getElementById('dash-recent-loans-tbody');
      tbody.innerHTML = '';

      if (loans.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center" style="padding:24px;color:var(--color-text-muted);">
              Belum ada data transaksi peminjaman.
            </td>
          </tr>`;
      } else {
        loans.slice(0, 5).forEach((loan) => {
          const badgeClass = this.getBadgeClassForLoanStatus(loan.status);
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>#${loan.kode_transaksi}</strong></td>
            <td>${loan.anggota ? loan.anggota.nama : 'Anggota'}</td>
            <td><span class="badge badge-neutral">${loan.total_buku} Buku</span></td>
            <td>${loan.tanggal_jatuh_tempo}</td>
            <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${loan.status}</span></td>
            <td class="action-col">
              <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openReturnModalForLoan('${loan.id}')">
                Proses
              </button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }

      // Render recent activities
      const actContainer = document.getElementById('dash-activity-timeline');
      actContainer.innerHTML = '';
      const acts = this.store.data.activities.slice(0, 5);

      if (acts.length === 0) {
        actContainer.innerHTML = '<p class="small-text text-muted">Belum ada aktivitas.</p>';
      } else {
        acts.forEach((act) => {
          let icon = 'info';
          if (act.type === 'loan') icon = 'book-up-2';
          if (act.type === 'return') icon = 'rotate-ccw';
          if (act.type === 'fine') icon = 'alert-circle';
          if (act.type === 'book') icon = 'book';

          const div = document.createElement('div');
          div.style.cssText = 'display:flex;align-items:flex-start;gap:12px;padding:8px 0;border-bottom:1px solid var(--color-border);';
          div.innerHTML = `
            <div style="width:28px;height:28px;border-radius:6px;background:var(--color-primary-light);color:var(--color-primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="${icon}" style="width:14px;height:14px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.8125rem;font-weight:600;color:var(--color-text-main);">${act.action}</div>
              <div style="font-size:0.75rem;color:var(--color-text-secondary);line-height:1.3;">${act.description}</div>
              <div style="font-size:0.6875rem;color:var(--color-text-muted);margin-top:2px;">${act.timestamp} &bull; ${act.user_name}</div>
            </div>
          `;
          actContainer.appendChild(div);
        });
      }
    }

    // --- RENDER: MEMBER DASHBOARD (Section 15 & 33) ---
    renderMemberDashboard() {
      const member = this.store.getMemberByUserId(this.currentUser.id);
      if (!member) return;

      const maxLimit = this.store.getMaxLoanLimit(member.jenis_anggota);
      const activeBorrowed = member.buku_aktif_count;
      const remainingQuota = member.sisa_kuota;

      document.getElementById('member-welcome-title').textContent = `Selamat datang, ${member.nama}`;
      document.getElementById('member-quota-info').textContent = `Anda terdaftar sebagai ${member.jenis_anggota}. Batas peminjaman aktif: ${maxLimit} buku.`;

      document.getElementById('member-dash-borrowed').textContent = `${activeBorrowed} / ${maxLimit}`;
      document.getElementById('member-dash-quota').textContent = `Sisa kuota: ${remainingQuota} buku`;
      document.getElementById('member-dash-fines').textContent = `$${member.total_denda_unpaid}`;

      // Find member active loans
      const memberLoans = this.store
        .getLoans()
        .filter((l) => l.anggota_id === member.id && (l.status === 'Dipinjam' || l.status === 'Sebagian Kembali' || l.status === 'Terlambat'));

      // Find nearest due date
      if (memberLoans.length > 0) {
        const sortedDue = [...memberLoans].sort((a, b) => a.tanggal_jatuh_tempo.localeCompare(b.tanggal_jatuh_tempo));
        document.getElementById('member-dash-nearest-due').textContent = sortedDue[0].tanggal_jatuh_tempo;
      } else {
        document.getElementById('member-dash-nearest-due').textContent = 'Tidak Ada';
      }

      // Returned books count
      const returnedCount = this.store.data.returns.filter((r) => {
        const ln = this.store.data.loans.find((l) => l.id === r.loan_id);
        return ln && ln.anggota_id === member.id;
      }).length;
      document.getElementById('member-dash-returned').textContent = returnedCount;

      // Active Books Container
      const container = document.getElementById('member-active-books-container');
      container.innerHTML = '';

      if (memberLoans.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="book-check"></i></div>
            <h3>Tidak Ada Pinjaman Aktif</h3>
            <p>Anda belum memiliki buku yang sedang dipinjam saat ini. Temukan bacaan menarik di katalog buku.</p>
            <button class="btn btn-primary btn-sm" onclick="window.PustakaApp.navigate('catalog')">
              Jelajahi Katalog Buku
            </button>
          </div>`;
      } else {
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:var(--space-md);';

        memberLoans.forEach((loan) => {
          loan.details.forEach((det) => {
            if (det.status !== 'Dipinjam') return;
            const b = det.buku || { judul: 'Buku', cover: 'assets/covers/cover_ai_ml.jpg', penulis: 'Penulis' };
            const daysLeft = this.store.getDaysDiff(this.store.currentDate, loan.tanggal_jatuh_tempo);

            let dueBadge = '';
            if (daysLeft < 0) {
              dueBadge = `<span class="badge badge-terlambat">Terlambat ${Math.abs(daysLeft)} hari (Denda $${Math.abs(daysLeft) * 2})</span>`;
            } else if (daysLeft === 0) {
              dueBadge = '<span class="badge badge-warning">Jatuh tempo HARI INI!</span>';
            } else {
              dueBadge = `<span class="badge badge-tersedia">Sisa ${daysLeft} hari lagi</span>`;
            }

            const item = document.createElement('div');
            item.className = 'card';
            item.style.cssText = 'padding:14px;display:flex;gap:12px;align-items:center;background:#F8FAFC;';
            item.innerHTML = `
              <img src="${b.cover}" style="width:48px;height:68px;object-fit:cover;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.15);" alt="Cover">
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.875rem;font-weight:700;color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.judul}</div>
                <div style="font-size:0.75rem;color:var(--color-text-secondary);margin-bottom:6px;">${b.penulis}</div>
                <div>${dueBadge}</div>
                <div class="small-text text-muted" style="margin-top:4px;">Jatuh tempo: ${loan.tanggal_jatuh_tempo}</div>
              </div>
            `;
            grid.appendChild(item);
          });
        });
        container.appendChild(grid);
      }
    }

    // --- RENDER: BOOK CATALOG (Section 16) ---
    renderCatalog() {
      // Populate category filter dropdown
      const catSelect = document.getElementById('catalog-filter-category');
      if (catSelect.options.length <= 1) {
        catSelect.innerHTML = '<option value="">Semua Kategori</option>';
        this.store.data.categories.forEach((c) => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.nama_kategori;
          catSelect.appendChild(opt);
        });
      }

      this.filterCatalog();
    }

    filterCatalog() {
      const keyword = (document.getElementById('catalog-search').value || '').toLowerCase().trim();
      const catFilter = document.getElementById('catalog-filter-category').value;
      const statusFilter = document.getElementById('catalog-filter-status').value;

      let books = this.store.getBooks();

      if (catFilter) {
        books = books.filter((b) => b.kategori_id === catFilter);
      }

      if (statusFilter) {
        books = books.filter((b) => b.status_ketersediaan === statusFilter);
      }

      if (keyword) {
        books = books.filter(
          (b) =>
            b.judul.toLowerCase().includes(keyword) ||
            b.penulis.toLowerCase().includes(keyword) ||
            b.kode_buku.toLowerCase().includes(keyword) ||
            (b.isbn && b.isbn.toLowerCase().includes(keyword))
        );
      }

      const grid = document.getElementById('catalog-grid');
      grid.innerHTML = '';

      if (books.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon"><i data-lucide="search-x"></i></div>
            <h3>Buku yang Anda cari tidak ditemukan.</h3>
            <p>Cobalah menggunakan kata kunci judul, nama penulis yang berbeda, atau reset filter pencarian Anda.</p>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('catalog-search').value=''; document.getElementById('catalog-filter-category').value=''; document.getElementById('catalog-filter-status').value=''; window.PustakaApp.filterCatalog();">
              Reset Filter
            </button>
          </div>`;
        this.refreshIcons();
        return;
      }

      const isMember = this.currentUser && this.currentUser.role === 'member';

      books.forEach((b) => {
        const isAvailable = b.stok_tersedia > 0;
        const badgeClass = isAvailable ? 'badge-tersedia' : 'badge-habis';
        const badgeText = isAvailable ? 'Tersedia' : 'Tidak Tersedia';

        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
          <div class="book-cover-container">
            <span class="badge ${badgeClass} book-card-badge">${badgeText}</span>
            <span class="book-category-tag">${b.kategori_nama}</span>
            <img src="${b.cover}" class="book-cover-img" alt="${b.judul}" loading="lazy">
          </div>
          <div class="book-content">
            <h3 class="book-title" title="${b.judul}">${b.judul}</h3>
            <div class="book-author">${b.penulis}</div>
            <div class="book-meta-footer">
              <div class="book-stock-info">
                Stok: <strong>${b.stok_tersedia}</strong> / ${b.stok}
              </div>
              <div style="display:flex;gap:4px;">
                <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openBookDetailModal('${b.id}')">
                  Detail
                </button>
                ${
                  isMember && isAvailable
                    ? `<button class="btn btn-primary btn-sm" onclick="window.PustakaApp.quickBorrowBook('${b.id}')">Pinjam</button>`
                    : ''
                }
              </div>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });

      this.refreshIcons();
    }

    // --- RENDER: ADMIN BOOKS TABLE (Section 22) ---
    renderAdminBooksTable() {
      // Category filter populate
      const catSelect = document.getElementById('books-admin-cat-filter');
      if (catSelect.options.length <= 1) {
        catSelect.innerHTML = '<option value="">Semua Kategori</option>';
        this.store.data.categories.forEach((c) => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.nama_kategori;
          catSelect.appendChild(opt);
        });
      }

      const keyword = (document.getElementById('books-admin-search').value || '').toLowerCase().trim();
      const catFilter = catSelect.value;

      let books = this.store.getBooks();
      if (catFilter) books = books.filter((b) => b.kategori_id === catFilter);
      if (keyword) {
        books = books.filter(
          (b) =>
            b.judul.toLowerCase().includes(keyword) ||
            b.penulis.toLowerCase().includes(keyword) ||
            b.kode_buku.toLowerCase().includes(keyword)
        );
      }

      const tbody = document.getElementById('books-admin-tbody');
      tbody.innerHTML = '';

      if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:24px;">Tidak ada data buku yang sesuai.</td></tr>`;
        return;
      }

      books.forEach((b, idx) => {
        const isAvailable = b.stok_tersedia > 0;
        const badgeClass = isAvailable ? 'badge-tersedia' : 'badge-habis';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td><img src="${b.cover}" class="table-book-thumb" alt="Cover"></td>
          <td>
            <strong>${b.kode_buku}</strong><br>
            <span class="small-text text-muted">${b.isbn || 'Tanpa ISBN'}</span>
          </td>
          <td>
            <strong>${b.judul}</strong><br>
            <span class="small-text text-secondary">${b.penulis} (${b.tahun_terbit})</span>
          </td>
          <td><span class="badge badge-neutral">${b.kategori_nama}</span></td>
          <td><strong>${b.stok_tersedia}</strong> / ${b.stok} eksemplar</td>
          <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${b.status_ketersediaan}</span></td>
          <td class="action-col">
            <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openBookDetailModal('${b.id}')" title="Detail">
              <i data-lucide="eye" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openEditBookModal('${b.id}')" title="Ubah">
              <i data-lucide="pencil" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.PustakaApp.confirmDeleteBook('${b.id}')" title="Hapus">
              <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      this.refreshIcons();
    }

    // --- RENDER: ADMIN CATEGORIES TABLE (Section 23) ---
    renderAdminCategoriesTable() {
      const categories = this.store.getCategories();
      const tbody = document.getElementById('categories-admin-tbody');
      tbody.innerHTML = '';

      categories.forEach((cat, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td><strong>${cat.nama_kategori}</strong></td>
          <td class="small-text text-secondary">${cat.deskripsi || '-'}</td>
          <td><span class="badge badge-neutral">${cat.jumlah_buku} Koleksi Buku</span></td>
          <td>${cat.created_at}</td>
          <td class="action-col">
            <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openEditCategoryModal('${cat.id}')">
              <i data-lucide="pencil" style="width:14px;height:14px;"></i> Ubah
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.PustakaApp.confirmDeleteCategory('${cat.id}')">
              <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Hapus
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      this.refreshIcons();
    }

    // --- RENDER: ADMIN MEMBERS TABLE (Section 24) ---
    renderAdminMembersTable() {
      const keyword = (document.getElementById('members-admin-search').value || '').toLowerCase().trim();
      const roleFilter = document.getElementById('members-filter-role').value;
      const statusFilter = document.getElementById('members-filter-status').value;

      let members = this.store.getMembers();
      if (roleFilter) members = members.filter((m) => m.jenis_anggota === roleFilter);
      if (statusFilter) members = members.filter((m) => m.status === statusFilter);
      if (keyword) {
        members = members.filter(
          (m) =>
            m.nama.toLowerCase().includes(keyword) ||
            m.nomor_anggota.toLowerCase().includes(keyword) ||
            m.email.toLowerCase().includes(keyword)
        );
      }

      const tbody = document.getElementById('members-admin-tbody');
      tbody.innerHTML = '';

      if (members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:24px;">Tidak ada data anggota ditemukan.</td></tr>`;
        return;
      }

      members.forEach((m, idx) => {
        const statusBadgeClass = m.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td><strong>${m.nomor_anggota}</strong></td>
          <td>
            <strong>${m.nama}</strong><br>
            <span class="small-text text-muted">${m.alamat}</span>
          </td>
          <td><span class="badge badge-neutral">${m.jenis_anggota}</span></td>
          <td>
            ${m.no_telepon}<br>
            <span class="small-text text-muted">${m.email}</span>
          </td>
          <td>
            <strong>${m.buku_aktif_count}</strong> / ${m.batas_maksimal} buku
            ${m.total_denda_unpaid > 0 ? `<br><span class="small-text" style="color:var(--color-error);font-weight:bold;">Denda: $${m.total_denda_unpaid}</span>` : ''}
          </td>
          <td><span class="badge ${statusBadgeClass}"><span class="badge-dot"></span>${m.status}</span></td>
          <td class="action-col">
            <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openMemberDetailModal('${m.id}')" title="Detail Riwayat">
              <i data-lucide="eye" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.PustakaApp.openEditMemberModal('${m.id}')" title="Ubah Data">
              <i data-lucide="pencil" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.PustakaApp.confirmDeleteMember('${m.id}')" title="Hapus">
              <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      this.refreshIcons();
    }

    // --- RENDER: LOANS TABLE (Section 18) ---
    renderLoansTable() {
      const keyword = (document.getElementById('loans-search').value || '').toLowerCase().trim();
      const statusFilter = document.getElementById('loans-filter-status').value;

      let loans = this.store.getLoans();
      if (statusFilter) loans = loans.filter((l) => l.status === statusFilter);
      if (keyword) {
        loans = loans.filter(
          (l) =>
            l.kode_transaksi.toLowerCase().includes(keyword) ||
            (l.anggota && l.anggota.nama.toLowerCase().includes(keyword))
        );
      }

      const tbody = document.getElementById('loans-tbody');
      tbody.innerHTML = '';

      if (loans.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px;">Tidak ada data peminjaman.</td></tr>`;
        return;
      }

      loans.forEach((loan) => {
        const badgeClass = this.getBadgeClassForLoanStatus(loan.status);

        // Books pill list
        const booksListHtml = loan.details
          .map((d) => {
            const b = d.buku || { judul: 'Buku' };
            const isRet = d.status === 'Kembali';
            return `<span class="badge ${isRet ? 'badge-selesai' : 'badge-neutral'}" style="margin:2px;">
              ${b.judul} ${isRet ? '(Kembali)' : ''}
            </span>`;
          })
          .join('');

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>#${loan.kode_transaksi}</strong></td>
          <td>
            <strong>${loan.anggota ? loan.anggota.nama : 'Anggota'}</strong><br>
            <span class="small-text text-muted">${loan.anggota ? loan.anggota.jenis_anggota : '-'}</span>
          </td>
          <td style="max-width:320px;">${booksListHtml}</td>
          <td>${loan.tanggal_pinjam}</td>
          <td>
            <strong>${loan.tanggal_jatuh_tempo}</strong>
            ${loan.is_overdue ? `<br><span class="small-text" style="color:var(--color-error);font-weight:bold;">Terlambat ${loan.hari_terlambat} hari ($${loan.potensi_denda})</span>` : ''}
          </td>
          <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${loan.status}</span></td>
          <td class="action-col">
            ${
              loan.status !== 'Selesai'
                ? `<button class="btn btn-primary btn-sm" onclick="window.PustakaApp.openReturnModalForLoan('${loan.id}')">
                    Kembalikan
                  </button>`
                : `<span class="small-text text-muted">Lengkap</span>`
            }
          </td>
        `;
        tbody.appendChild(tr);
      });
      this.refreshIcons();
    }

    // --- RENDER: RETURNS VIEW (Section 19) ---
    renderReturnsView() {
      // Ready to return loans
      const activeLoans = this.store
        .getLoans()
        .filter((l) => l.status === 'Dipinjam' || l.status === 'Sebagian Kembali' || l.status === 'Terlambat');

      const readyTbody = document.getElementById('ready-returns-tbody');
      readyTbody.innerHTML = '';

      if (activeLoans.length === 0) {
        readyTbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:20px;color:var(--color-text-muted);">Semua buku telah dikembalikan. Tidak ada peminjaman aktif.</td></tr>`;
      } else {
        activeLoans.forEach((loan) => {
          const unreturnedBooks = loan.details.filter((d) => d.status === 'Dipinjam');
          const bookPills = unreturnedBooks
            .map((d) => `<span class="badge badge-neutral">${d.buku ? d.buku.judul : 'Buku'}</span>`)
            .join(' ');

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>#${loan.kode_transaksi}</strong></td>
            <td>${loan.anggota ? loan.anggota.nama : 'Anggota'}</td>
            <td>${bookPills}</td>
            <td>${loan.tanggal_jatuh_tempo}</td>
            <td>
              ${
                loan.is_overdue
                  ? `<span class="badge badge-terlambat">Terlambat ${loan.hari_terlambat} hari (Denda: $${loan.potensi_denda})</span>`
                  : `<span class="badge badge-tersedia">Tepat Waktu</span>`
              }
            </td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="window.PustakaApp.openReturnModalForLoan('${loan.id}')">
                <i data-lucide="rotate-ccw"></i> Proses Pengembalian
              </button>
            </td>
          `;
          readyTbody.appendChild(tr);
        });
      }

      // History of returns
      const returnsHistoryTbody = document.getElementById('returns-history-tbody');
      returnsHistoryTbody.innerHTML = '';
      const returns = this.store.data.returns.slice(0, 10);

      if (returns.length === 0) {
        returnsHistoryTbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:20px;">Belum ada riwayat pengembalian.</td></tr>`;
      } else {
        returns.forEach((ret) => {
          const loan = this.store.data.loans.find((l) => l.id === ret.loan_id);
          const member = loan ? this.store.data.members.find((m) => m.id === loan.anggota_id) : null;
          const book = this.store.getBookById(ret.buku_id);

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>#${loan ? loan.kode_transaksi : '-'}</td>
            <td>${member ? member.nama : 'Anggota'}</td>
            <td><strong>${book ? book.judul : 'Buku'}</strong></td>
            <td>${ret.tanggal_kembali}</td>
            <td>${ret.hari_terlambat > 0 ? `<span style="color:var(--color-error);font-weight:600;">${ret.hari_terlambat} hari</span>` : '0 hari (Tepat Waktu)'}</td>
            <td>${ret.denda_amount > 0 ? `<strong>$${ret.denda_amount}</strong>` : '$0'}</td>
          `;
          returnsHistoryTbody.appendChild(tr);
        });
      }

      this.refreshIcons();
    }

    // --- RENDER: FINES TABLE (Section 20) ---
    renderFinesTable() {
      const fines = this.store.getFines();
      const unpaid = fines.filter((f) => f.status === 'Belum Dibayar');
      const paid = fines.filter((f) => f.status === 'Lunas');

      const unpaidTotal = unpaid.reduce((s, f) => s + f.jumlah, 0);
      const paidTotal = paid.reduce((s, f) => s + f.jumlah, 0);
      const totalAmount = fines.reduce((s, f) => s + f.jumlah, 0);

      document.getElementById('fines-unpaid-amount').textContent = `$${unpaidTotal}`;
      document.getElementById('fines-unpaid-count').textContent = `${unpaid.length} tagihan aktif`;

      document.getElementById('fines-paid-amount').textContent = `$${paidTotal}`;
      document.getElementById('fines-paid-count').textContent = `${paid.length} transaksi lunas`;

      document.getElementById('fines-total-amount').textContent = `$${totalAmount}`;

      const keyword = (document.getElementById('fines-search').value || '').toLowerCase().trim();
      const statusFilter = document.getElementById('fines-filter-status').value;

      let filtered = fines;
      if (statusFilter) filtered = filtered.filter((f) => f.status === statusFilter);
      if (keyword) {
        filtered = filtered.filter(
          (f) =>
            f.kode_denda.toLowerCase().includes(keyword) ||
            (f.anggota && f.anggota.nama.toLowerCase().includes(keyword)) ||
            (f.buku && f.buku.judul.toLowerCase().includes(keyword))
        );
      }

      const tbody = document.getElementById('fines-tbody');
      tbody.innerHTML = '';

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:24px;">Tidak ada data denda keterlambatan.</td></tr>`;
        return;
      }

      filtered.forEach((fine) => {
        const isPaid = fine.status === 'Lunas';
        const badgeClass = isPaid ? 'badge-lunas' : 'badge-belum-dibayar';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>#${fine.kode_denda}</strong></td>
          <td>
            <strong>${fine.anggota ? fine.anggota.nama : 'Anggota'}</strong><br>
            <span class="small-text text-muted">${fine.anggota ? fine.anggota.nomor_anggota : '-'}</span>
          </td>
          <td>${fine.buku ? fine.buku.judul : 'Buku'}</td>
          <td>${fine.jumlah_hari_terlambat} hari keterlambatan</td>
          <td><strong style="font-size:1.05rem;color:var(--color-error);">$${fine.jumlah}</strong></td>
          <td><span class="badge ${badgeClass}"><span class="badge-dot"></span>${fine.status}</span></td>
          <td>
            ${
              isPaid
                ? `<span class="small-text"><strong>${fine.tanggal_pembayaran}</strong><br>Metode: ${fine.metode_pembayaran}</span>`
                : '<span class="small-text text-muted">Menunggu pembayaran</span>'
            }
          </td>
          <td class="action-col">
            ${
              !isPaid
                ? `<button class="btn btn-success btn-sm" onclick="window.PustakaApp.openPayFineModal('${fine.id}')">
                    <i data-lucide="dollar-sign"></i> Bayar Denda
                  </button>`
                : `<span class="badge badge-lunas">Selesai</span>`
            }
          </td>
        `;
        tbody.appendChild(tr);
      });
      this.refreshIcons();
    }

    // --- RENDER: REPORTS VIEW (Section 21) ---
    switchReportTab(tab) {
      this.currentReportTab = tab;
      document.querySelectorAll('.report-tab-btn').forEach((btn) => {
        if (btn.getAttribute('data-tab') === tab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      this.renderReport();
    }

    resetReportFilters() {
      document.getElementById('report-start-date').value = '2026-09-01';
      document.getElementById('report-end-date').value = '2026-10-31';
      document.getElementById('report-search').value = '';
      this.renderReport();
    }

    renderReport() {
      const startDate = document.getElementById('report-start-date').value;
      const endDate = document.getElementById('report-end-date').value;
      const keyword = document.getElementById('report-search').value;

      const reportData = this.store.getReportData(this.currentReportTab, {
        startDate,
        endDate,
        keyword
      });

      if (!reportData) return;

      // Update Summary Bar
      const summaryBar = document.getElementById('report-summary-bar');
      const thead = document.getElementById('report-table-head');
      const tbody = document.getElementById('report-table-body');

      thead.innerHTML = '';
      tbody.innerHTML = '';

      switch (this.currentReportTab) {
        case 'buku':
          summaryBar.innerHTML = `
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div><strong>Total Judul Buku:</strong> ${reportData.total_items} judul</div>
              <div><strong>Total Eksemplar Stok:</strong> ${reportData.total_stok} buku</div>
              <div><strong>Sedang Dipinjam:</strong> ${reportData.total_dipinjam} buku</div>
              <div><strong>Ketersediaan di Rak:</strong> <span style="color:var(--color-success);font-weight:bold;">${reportData.total_tersedia} buku</span></div>
            </div>`;

          thead.innerHTML = `
            <tr>
              <th>No</th>
              <th>Kode</th>
              <th>Judul Buku</th>
              <th>Penulis</th>
              <th>Penerbit / Thn</th>
              <th>Kategori</th>
              <th>Stok Total</th>
              <th>Tersedia</th>
              <th>Status</th>
            </tr>`;

          reportData.items.forEach((b, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td><strong>${b.kode_buku}</strong></td>
              <td>${b.judul}</td>
              <td>${b.penulis}</td>
              <td>${b.penerbit} (${b.tahun_terbit})</td>
              <td>${b.kategori_nama}</td>
              <td>${b.stok}</td>
              <td><strong>${b.stok_tersedia}</strong></td>
              <td><span class="badge ${b.stok_tersedia > 0 ? 'badge-tersedia' : 'badge-habis'}">${b.status_ketersediaan}</span></td>
            `;
            tbody.appendChild(tr);
          });
          break;

        case 'anggota':
          summaryBar.innerHTML = `
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div><strong>Total Anggota Terdaftar:</strong> ${reportData.total_items} orang</div>
              <div><strong>Status Aktif:</strong> <span style="color:var(--color-success);font-weight:bold;">${reportData.total_aktif} orang</span></div>
              <div><strong>Status Nonaktif:</strong> ${reportData.total_nonaktif} orang</div>
            </div>`;

          thead.innerHTML = `
            <tr>
              <th>No</th>
              <th>Nomor Anggota</th>
              <th>Nama Anggota</th>
              <th>Jenis Anggota</th>
              <th>Email</th>
              <th>Kontak</th>
              <th>Buku Aktif</th>
              <th>Status</th>
            </tr>`;

          reportData.items.forEach((m, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td><strong>${m.nomor_anggota}</strong></td>
              <td>${m.nama}</td>
              <td><span class="badge badge-neutral">${m.jenis_anggota}</span></td>
              <td>${m.email}</td>
              <td>${m.no_telepon}</td>
              <td>${m.buku_aktif_count} / ${m.batas_maksimal}</td>
              <td><span class="badge ${m.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif'}">${m.status}</span></td>
            `;
            tbody.appendChild(tr);
          });
          break;

        case 'peminjaman':
          summaryBar.innerHTML = `
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div><strong>Total Transaksi:</strong> ${reportData.total_items} transaksi</div>
              <div><strong>Total Buku Dipinjam:</strong> ${reportData.total_buku_dipinjam} eksemplar</div>
              <div><strong>Transaksi Aktif:</strong> ${reportData.total_aktif}</div>
              <div><strong>Keterlambatan:</strong> <span style="color:var(--color-error);font-weight:bold;">${reportData.total_terlambat} transaksi</span></div>
            </div>`;

          thead.innerHTML = `
            <tr>
              <th>No</th>
              <th>Kode Transaksi</th>
              <th>Anggota</th>
              <th>Buku Dipinjam</th>
              <th>Tgl Pinjam</th>
              <th>Jatuh Tempo</th>
              <th>Status</th>
            </tr>`;

          reportData.items.forEach((l, idx) => {
            const bNames = l.details.map((d) => (d.buku ? d.buku.judul : 'Buku')).join(', ');
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td><strong>#${l.kode_transaksi}</strong></td>
              <td>${l.anggota ? l.anggota.nama : 'Anggota'}</td>
              <td>${bNames}</td>
              <td>${l.tanggal_pinjam}</td>
              <td>${l.tanggal_jatuh_tempo}</td>
              <td><span class="badge ${this.getBadgeClassForLoanStatus(l.status)}">${l.status}</span></td>
            `;
            tbody.appendChild(tr);
          });
          break;

        case 'pengembalian':
          summaryBar.innerHTML = `
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div><strong>Total Pengembalian:</strong> ${reportData.total_items} buku</div>
              <div><strong>Terlambat:</strong> ${reportData.total_terlambat} pengembalian</div>
              <div><strong>Total Denda Terkumpul:</strong> <strong style="color:var(--color-error);">$${reportData.total_denda_terkumpul}</strong></div>
            </div>`;

          thead.innerHTML = `
            <tr>
              <th>No</th>
              <th>ID Transaksi</th>
              <th>Anggota</th>
              <th>Judul Buku</th>
              <th>Tgl Pengembalian</th>
              <th>Hari Terlambat</th>
              <th>Denda ($2/hari)</th>
            </tr>`;

          reportData.items.forEach((r, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td>#${r.kode_transaksi}</td>
              <td>${r.anggota_nama}</td>
              <td><strong>${r.buku_judul}</strong></td>
              <td>${r.tanggal_kembali}</td>
              <td>${r.hari_terlambat} hari</td>
              <td>$${r.denda_amount}</td>
            `;
            tbody.appendChild(tr);
          });
          break;

        case 'denda':
          summaryBar.innerHTML = `
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div><strong>Total Tagihan Denda:</strong> $${reportData.total_nominal}</div>
              <div><strong>Denda Lunas:</strong> <span style="color:var(--color-success);font-weight:bold;">$${reportData.total_lunas}</span></div>
              <div><strong>Belum Lunas:</strong> <span style="color:var(--color-error);font-weight:bold;">$${reportData.total_belum_lunas}</span></div>
            </div>`;

          thead.innerHTML = `
            <tr>
              <th>No</th>
              <th>Kode Denda</th>
              <th>Anggota</th>
              <th>Buku Terkait</th>
              <th>Terlambat</th>
              <th>Nominal Denda</th>
              <th>Status</th>
              <th>Metode &amp; Tgl Bayar</th>
            </tr>`;

          reportData.items.forEach((f, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td><strong>#${f.kode_denda}</strong></td>
              <td>${f.anggota ? f.anggota.nama : 'Anggota'}</td>
              <td>${f.buku ? f.buku.judul : 'Buku'}</td>
              <td>${f.jumlah_hari_terlambat} hari</td>
              <td><strong>$${f.jumlah}</strong></td>
              <td><span class="badge ${f.status === 'Lunas' ? 'badge-lunas' : 'badge-belum-dibayar'}">${f.status}</span></td>
              <td>${f.status === 'Lunas' ? `${f.metode_pembayaran} (${f.tanggal_pembayaran})` : '-'}</td>
            `;
            tbody.appendChild(tr);
          });
          break;
      }
      this.refreshIcons();
    }

    printCurrentReport() {
      window.print();
    }

    exportReportCSV() {
      const startDate = document.getElementById('report-start-date').value;
      const endDate = document.getElementById('report-end-date').value;
      const keyword = document.getElementById('report-search').value;

      const reportData = this.store.getReportData(this.currentReportTab, {
        startDate,
        endDate,
        keyword
      });

      if (!reportData || reportData.items.length === 0) {
        this.showToast('warning', 'Data Kosong', 'Tidak ada data laporan untuk diekspor.');
        return;
      }

      // Convert items to CSV
      const items = reportData.items;
      const headers = Object.keys(items[0]).filter(
        (k) => typeof items[0][k] !== 'object' || items[0][k] === null
      );

      let csv = '\uFEFF'; // UTF-8 BOM
      csv += headers.join(',') + '\r\n';

      items.forEach((row) => {
        const line = headers
          .map((h) => {
            let val = row[h] == null ? '' : String(row[h]);
            val = val.replace(/"/g, '""');
            if (val.search(/("|,|\n)/g) >= 0) {
              val = `"${val}"`;
            }
            return val;
          })
          .join(',');
        csv += line + '\r\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Laporan_${this.currentReportTab}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showToast('success', 'Export Berhasil', `Laporan ${this.currentReportTab} berhasil diekspor ke CSV.`);
    }

    exportReportJSON() {
      const startDate = document.getElementById('report-start-date').value;
      const endDate = document.getElementById('report-end-date').value;
      const keyword = document.getElementById('report-search').value;

      const reportData = this.store.getReportData(this.currentReportTab, {
        startDate,
        endDate,
        keyword
      });

      if (!reportData) return;

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `Laporan_${this.currentReportTab}_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      this.showToast('success', 'Export JSON', `Laporan ${this.currentReportTab} berhasil diekspor ke JSON.`);
    }

    // --- RENDER: MEMBER LOANS & HISTORY ---
    renderMemberLoans(isHistoryMode) {
      const member = this.store.getMemberByUserId(this.currentUser.id);
      if (!member) return;

      document.getElementById('member-loans-title').textContent = isHistoryMode
        ? 'Riwayat Seluruh Peminjaman'
        : 'Peminjaman Aktif Saya';

      const loans = this.store.getLoans().filter((l) => l.anggota_id === member.id);
      const tbody = document.getElementById('member-loans-tbody');
      tbody.innerHTML = '';

      let displayedItems = [];
      loans.forEach((l) => {
        l.details.forEach((d) => {
          if (!isHistoryMode && d.status === 'Kembali') return;
          displayedItems.push({
            loan: l,
            detail: d,
            book: d.buku || { judul: 'Buku', cover: 'assets/covers/cover_ai_ml.jpg', penulis: 'Penulis' }
          });
        });
      });

      if (displayedItems.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center" style="padding:28px;">
              ${isHistoryMode ? 'Belum ada riwayat transaksi masa lalu.' : 'Saat ini tidak ada buku yang sedang dipinjam.'}
            </td>
          </tr>`;
        return;
      }

      displayedItems.forEach((item) => {
        const isRet = item.detail.status === 'Kembali';
        const daysLeft = this.store.getDaysDiff(this.store.currentDate, item.loan.tanggal_jatuh_tempo);
        const tr = document.createElement('tr');

        let statusBadge = isRet
          ? '<span class="badge badge-selesai">Sudah Kembali</span>'
          : item.loan.is_overdue
          ? '<span class="badge badge-terlambat">Terlambat</span>'
          : '<span class="badge badge-dipinjam">Dipinjam</span>';

        let sisaText = isRet
          ? `Dikembalikan (${item.detail.tanggal_kembali})`
          : daysLeft < 0
          ? `<span style="color:var(--color-error);font-weight:bold;">Terlambat ${Math.abs(daysLeft)} hari</span>`
          : `${daysLeft} hari tersisa`;

        let fineText = item.detail.denda_amount > 0 ? `$${item.detail.denda_amount}` : '$0';

        tr.innerHTML = `
          <td><img src="${item.book.cover}" class="table-book-thumb" alt="Cover"></td>
          <td>
            <strong>${item.book.judul}</strong><br>
            <span class="small-text text-muted">${item.book.penulis} &bull; #${item.loan.kode_transaksi}</span>
          </td>
          <td>${item.loan.tanggal_pinjam}</td>
          <td>${item.loan.tanggal_jatuh_tempo}</td>
          <td>${sisaText}</td>
          <td>${statusBadge}</td>
          <td>${fineText}</td>
        `;
        tbody.appendChild(tr);
      });
      this.refreshIcons();
    }

    // --- RENDER: USER PROFILE ---
    renderProfile() {
      if (!this.currentUser) return;
      const isAdmin = this.currentUser.role === 'admin';
      const member = !isAdmin ? this.store.getMemberByUserId(this.currentUser.id) : null;

      document.getElementById('profile-card-name').textContent = this.currentUser.name;
      document.getElementById('profile-big-avatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
      document.getElementById('profile-card-role').textContent = isAdmin ? 'Administrator Perpustakaan' : `${member ? member.jenis_anggota : 'Anggota'} Perpustakaan`;

      document.getElementById('profile-card-num').textContent = member ? member.nomor_anggota : 'ADM-001';
      document.getElementById('profile-card-email').textContent = this.currentUser.email;
      document.getElementById('profile-card-phone').textContent = member ? member.no_telepon : '0812-0000-0000';
      document.getElementById('profile-card-limit').textContent = isAdmin ? 'Akses Penuh (Tak Terbatas)' : `${member ? member.batas_maksimal : 5} buku aktif`;

      // Inputs
      document.getElementById('prof-input-name').value = this.currentUser.name;
      document.getElementById('prof-input-email').value = this.currentUser.email;
      document.getElementById('prof-input-phone').value = member ? member.no_telepon : '0812-0000-0000';
      document.getElementById('prof-input-type').value = isAdmin ? 'Admin' : (member ? member.jenis_anggota : 'Anggota');
      document.getElementById('prof-input-address').value = member ? member.alamat : 'Ruang Sirkulasi Perpustakaan';
    }

    saveProfile() {
      const newName = document.getElementById('prof-input-name').value.trim();
      const newPhone = document.getElementById('prof-input-phone').value.trim();
      const newAddress = document.getElementById('prof-input-address').value.trim();

      if (!newName) {
        this.showToast('error', 'Validasi Gagal', 'Nama lengkap tidak boleh kosong.');
        return;
      }

      this.currentUser.name = newName;
      if (this.currentUser.role === 'member') {
        const mem = this.store.getMemberByUserId(this.currentUser.id);
        if (mem) {
          this.store.updateMember(mem.id, {
            nama: newName,
            no_telepon: newPhone,
            alamat: newAddress
          });
        }
      }

      localStorage.setItem('pustaka_session_user', JSON.stringify(this.currentUser));
      this.updateSidebarUser();
      this.renderProfile();
      this.showToast('success', 'Profil Diperbarui', 'Data profil Anda telah berhasil disimpan.');
    }

    resetDefaultDataPrompt() {
      this.openConfirmModal(
        'Reset Database Demo',
        'Apakah Anda yakin ingin mengatur ulang semua data buku, transaksi, dan denda kembali ke data bawaan awal?',
        () => {
          this.store.resetAll();
          this.showToast('info', 'Database Direset', 'Semua data contoh berhasil dikembalikan ke kondisi awal.');
          this.navigate(this.currentRoute);
        }
      );
    }

    // --- MODAL: BOOK CRUD ---
    openNewBookModal() {
      document.getElementById('modal-book-form-title').textContent = 'Tambah Buku Baru';
      document.getElementById('book-form-id').value = '';
      document.getElementById('book-form-code').value = 'BK-' + String(this.store.data.books.length + 1).padStart(3, '0');
      document.getElementById('book-form-isbn').value = '';
      document.getElementById('book-form-title').value = '';
      document.getElementById('book-form-author').value = '';
      document.getElementById('book-form-publisher').value = '';
      document.getElementById('book-form-year').value = 2025;
      document.getElementById('book-form-stock').value = 5;
      document.getElementById('book-form-shelf').value = 'Rak A-01';
      document.getElementById('book-form-desc').value = '';

      // Populate categories
      const catSelect = document.getElementById('book-form-category');
      catSelect.innerHTML = '';
      this.store.data.categories.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nama_kategori;
        catSelect.appendChild(opt);
      });

      this.openModal('modal-book-form');
    }

    openEditBookModal(bookId) {
      const book = this.store.getBookById(bookId);
      if (!book) return;

      document.getElementById('modal-book-form-title').textContent = 'Ubah Data Buku';
      document.getElementById('book-form-id').value = book.id;
      document.getElementById('book-form-code').value = book.kode_buku;
      document.getElementById('book-form-isbn').value = book.isbn || '';
      document.getElementById('book-form-title').value = book.judul;
      document.getElementById('book-form-author').value = book.penulis;
      document.getElementById('book-form-publisher').value = book.penerbit;
      document.getElementById('book-form-year').value = book.tahun_terbit;
      document.getElementById('book-form-stock').value = book.stok;
      document.getElementById('book-form-shelf').value = book.lokasi_rak || '';
      document.getElementById('book-form-desc').value = book.deskripsi || '';

      const catSelect = document.getElementById('book-form-category');
      catSelect.innerHTML = '';
      this.store.data.categories.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nama_kategori;
        if (c.id === book.kategori_id) opt.selected = true;
        catSelect.appendChild(opt);
      });

      this.openModal('modal-book-form');
    }

    submitBookForm() {
      const id = document.getElementById('book-form-id').value;
      const data = {
        kode_buku: document.getElementById('book-form-code').value.trim(),
        isbn: document.getElementById('book-form-isbn').value.trim() || null,
        judul: document.getElementById('book-form-title').value.trim(),
        penulis: document.getElementById('book-form-author').value.trim(),
        kategori_id: document.getElementById('book-form-category').value,
        penerbit: document.getElementById('book-form-publisher').value.trim(),
        tahun_terbit: document.getElementById('book-form-year').value,
        stok: document.getElementById('book-form-stock').value,
        cover: document.getElementById('book-form-cover-preset').value,
        lokasi_rak: document.getElementById('book-form-shelf').value.trim(),
        deskripsi: document.getElementById('book-form-desc').value.trim()
      };

      try {
        if (id) {
          this.store.updateBook(id, data);
          this.showToast('success', 'Buku Diperbarui', `Buku "${data.judul}" berhasil diubah.`);
        } else {
          this.store.addBook(data);
          this.showToast('success', 'Buku Ditambahkan', `Buku "${data.judul}" berhasil ditambahkan.`);
        }
        this.closeModal('modal-book-form');
        this.navigate(this.currentRoute);
      } catch (err) {
        this.showToast('error', 'Gagal Menyimpan', err.message);
      }
    }

    confirmDeleteBook(bookId) {
      const book = this.store.getBookById(bookId);
      if (!book) return;

      this.openConfirmModal(
        'Konfirmasi Hapus Buku',
        `Apakah Anda yakin ingin menghapus buku "${book.judul}" (${book.kode_buku}) dari koleksi perpustakaan?`,
        () => {
          try {
            this.store.deleteBook(bookId);
            this.showToast('success', 'Buku Dihapus', `Buku "${book.judul}" berhasil dihapus.`);
            this.navigate(this.currentRoute);
          } catch (err) {
            this.showToast('error', 'Penghapusan Gagal', err.message);
          }
        }
      );
    }

    // --- MODAL: CATEGORY CRUD ---
    openNewCategoryModal() {
      document.getElementById('modal-category-form-title').textContent = 'Tambah Kategori Baru';
      document.getElementById('category-form-id').value = '';
      document.getElementById('category-form-name').value = '';
      document.getElementById('category-form-desc').value = '';
      this.openModal('modal-category-form');
    }

    openEditCategoryModal(catId) {
      const cat = this.store.data.categories.find((c) => c.id === catId);
      if (!cat) return;
      document.getElementById('modal-category-form-title').textContent = 'Ubah Kategori';
      document.getElementById('category-form-id').value = cat.id;
      document.getElementById('category-form-name').value = cat.nama_kategori;
      document.getElementById('category-form-desc').value = cat.deskripsi || '';
      this.openModal('modal-category-form');
    }

    submitCategoryForm() {
      const id = document.getElementById('category-form-id').value;
      const name = document.getElementById('category-form-name').value.trim();
      const desc = document.getElementById('category-form-desc').value.trim();

      try {
        if (id) {
          this.store.updateCategory(id, { nama_kategori: name, deskripsi: desc });
          this.showToast('success', 'Kategori Diperbarui', `Kategori "${name}" berhasil diubah.`);
        } else {
          this.store.addCategory({ nama_kategori: name, deskripsi: desc });
          this.showToast('success', 'Kategori Ditambahkan', `Kategori "${name}" berhasil dibuat.`);
        }
        this.closeModal('modal-category-form');
        this.renderAdminCategoriesTable();
      } catch (err) {
        this.showToast('error', 'Gagal Menyimpan', err.message);
      }
    }

    confirmDeleteCategory(catId) {
      const cat = this.store.data.categories.find((c) => c.id === catId);
      if (!cat) return;

      this.openConfirmModal(
        'Konfirmasi Hapus Kategori',
        `Apakah Anda yakin ingin menghapus kategori "${cat.nama_kategori}"?`,
        () => {
          try {
            this.store.deleteCategory(catId);
            this.showToast('success', 'Kategori Dihapus', `Kategori "${cat.nama_kategori}" berhasil dihapus.`);
            this.renderAdminCategoriesTable();
          } catch (err) {
            this.showToast('error', 'Penghapusan Ditolak (PRD 8.5)', err.message);
          }
        }
      );
    }

    // --- MODAL: MEMBER CRUD ---
    openNewMemberModal() {
      document.getElementById('modal-member-form-title').textContent = 'Tambah Anggota Baru';
      document.getElementById('member-form-id').value = '';
      document.getElementById('member-form-code').value = 'ANG-2026-' + String(this.store.data.members.length + 1).padStart(3, '0');
      document.getElementById('member-form-name').value = '';
      document.getElementById('member-form-email').value = '';
      document.getElementById('member-form-phone').value = '';
      document.getElementById('member-form-address').value = '';
      document.getElementById('member-form-type').value = 'Siswa';
      document.getElementById('member-form-status').value = 'Aktif';
      this.openModal('modal-member-form');
    }

    openEditMemberModal(memId) {
      const mem = this.store.getMemberById(memId);
      if (!mem) return;
      document.getElementById('modal-member-form-title').textContent = 'Ubah Data Anggota';
      document.getElementById('member-form-id').value = mem.id;
      document.getElementById('member-form-code').value = mem.nomor_anggota;
      document.getElementById('member-form-name').value = mem.nama;
      document.getElementById('member-form-email').value = mem.email;
      document.getElementById('member-form-phone').value = mem.no_telepon;
      document.getElementById('member-form-address').value = mem.alamat;
      document.getElementById('member-form-type').value = mem.jenis_anggota;
      document.getElementById('member-form-status').value = mem.status;
      this.openModal('modal-member-form');
    }

    submitMemberForm() {
      const id = document.getElementById('member-form-id').value;
      const data = {
        nomor_anggota: document.getElementById('member-form-code').value.trim(),
        nama: document.getElementById('member-form-name').value.trim(),
        email: document.getElementById('member-form-email').value.trim(),
        no_telepon: document.getElementById('member-form-phone').value.trim(),
        alamat: document.getElementById('member-form-address').value.trim(),
        jenis_anggota: document.getElementById('member-form-type').value,
        status: document.getElementById('member-form-status').value
      };

      try {
        if (id) {
          this.store.updateMember(id, data);
          this.showToast('success', 'Anggota Diperbarui', `Data "${data.nama}" berhasil disimpan.`);
        } else {
          this.store.addMember(data);
          this.showToast('success', 'Anggota Ditambahkan', `Anggota "${data.nama}" berhasil terdaftar.`);
        }
        this.closeModal('modal-member-form');
        this.renderAdminMembersTable();
      } catch (err) {
        this.showToast('error', 'Gagal Mendaftar', err.message);
      }
    }

    confirmDeleteMember(memId) {
      const mem = this.store.getMemberById(memId);
      if (!mem) return;

      this.openConfirmModal(
        'Konfirmasi Hapus Anggota',
        `Apakah Anda yakin ingin menghapus data anggota "${mem.nama}" (${mem.nomor_anggota})?`,
        () => {
          try {
            this.store.deleteMember(memId);
            this.showToast('success', 'Anggota Dihapus', `Data "${mem.nama}" telah dihapus.`);
            this.renderAdminMembersTable();
          } catch (err) {
            this.showToast('error', 'Penghapusan Ditolak', err.message);
          }
        }
      );
    }

    // --- MODAL: MEMBER DETAIL ---
    openMemberDetailModal(memId) {
      const mem = this.store.getMemberById(memId);
      if (!mem) return;

      const body = document.getElementById('modal-member-detail-body');
      const loans = this.store.getLoans().filter((l) => l.anggota_id === mem.id);
      const fines = this.store.getFines().filter((f) => f.anggota_id === mem.id);

      body.innerHTML = `
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:var(--space-xl);background:var(--color-surface-muted);padding:16px;border-radius:12px;">
          <div class="user-avatar" style="width:54px;height:54px;font-size:1.5rem;">${mem.nama.charAt(0)}</div>
          <div style="flex:1;">
            <h3 style="margin-bottom:2px;">${mem.nama}</h3>
            <div class="small-text text-secondary">${mem.nomor_anggota} &bull; ${mem.jenis_anggota} &bull; <span class="badge ${mem.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif'}">${mem.status}</span></div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.25rem;font-weight:700;">${mem.buku_aktif_count} / ${mem.batas_maksimal}</div>
            <div class="small-text text-muted">Buku Aktif</div>
          </div>
        </div>

        <h4 style="margin-bottom:8px;">Buku yang Sedang Dipinjam</h4>
        <div style="margin-bottom:var(--space-xl);">
          ${
            loans.filter((l) => l.status === 'Dipinjam' || l.status === 'Sebagian Kembali' || l.status === 'Terlambat').length === 0
              ? '<p class="small-text text-muted">Tidak ada peminjaman aktif saat ini.</p>'
              : `<div class="table-responsive">
                  <table class="data-table">
                    <thead><tr><th>ID</th><th>Buku</th><th>Tgl Pinjam</th><th>Jatuh Tempo</th><th>Status</th></tr></thead>
                    <tbody>
                      ${loans
                        .map((l) =>
                          l.details
                            .filter((d) => d.status === 'Dipinjam')
                            .map(
                              (d) => `<tr>
                                <td>#${l.kode_transaksi}</td>
                                <td><strong>${d.buku ? d.buku.judul : 'Buku'}</strong></td>
                                <td>${l.tanggal_pinjam}</td>
                                <td>${l.tanggal_jatuh_tempo}</td>
                                <td><span class="badge ${this.getBadgeClassForLoanStatus(l.status)}">${l.status}</span></td>
                              </tr>`
                            )
                            .join('')
                        )
                        .join('')}
                    </tbody>
                  </table>
                </div>`
          }
        </div>

        <h4 style="margin-bottom:8px;">Histori Tagihan Denda</h4>
        <div>
          ${
            fines.length === 0
              ? '<p class="small-text text-muted">Tidak ada catatan denda.</p>'
              : `<div class="table-responsive">
                  <table class="data-table">
                    <thead><tr><th>Kode</th><th>Buku</th><th>Terlambat</th><th>Nominal</th><th>Status</th></tr></thead>
                    <tbody>
                      ${fines
                        .map(
                          (f) => `<tr>
                            <td>#${f.kode_denda}</td>
                            <td>${f.buku ? f.buku.judul : 'Buku'}</td>
                            <td>${f.jumlah_hari_terlambat} hari</td>
                            <td><strong>$${f.jumlah}</strong></td>
                            <td><span class="badge ${f.status === 'Lunas' ? 'badge-lunas' : 'badge-belum-dibayar'}">${f.status}</span></td>
                          </tr>`
                        )
                        .join('')}
                    </tbody>
                  </table>
                </div>`
          }
        </div>
      `;

      this.openModal('modal-member-detail');
    }

    // --- MODAL: BOOK DETAIL (Section 17) ---
    openBookDetailModal(bookId) {
      const book = this.store.getBookById(bookId);
      if (!book) return;

      const body = document.getElementById('modal-book-detail-body');
      const isAvailable = book.stok_tersedia > 0;
      const isMember = this.currentUser && this.currentUser.role === 'member';

      body.innerHTML = `
        <div style="display:grid;grid-template-columns:220px 1fr;gap:var(--space-xl);" class="book-detail-grid">
          <div>
            <img src="${book.cover}" style="width:100%;height:310px;object-fit:cover;border-radius:10px;box-shadow:0 6px 14px rgba(0,0,0,0.15);" alt="${book.judul}">
            <div style="margin-top:12px;text-align:center;">
              <span class="badge ${isAvailable ? 'badge-tersedia' : 'badge-habis'}" style="font-size:0.875rem;padding:6px 14px;">
                ${book.status_ketersediaan}
              </span>
            </div>
          </div>
          <div>
            <span class="badge badge-neutral" style="margin-bottom:8px;">${book.kategori_nama}</span>
            <h2 style="font-size:1.45rem;margin-bottom:6px;">${book.judul}</h2>
            <p class="text-secondary" style="font-size:0.95rem;margin-bottom:16px;">Oleh <strong>${book.penulis}</strong></p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;background:var(--color-surface-muted);padding:14px;border-radius:10px;">
              <div class="small-text"><strong>Kode Buku:</strong> ${book.kode_buku}</div>
              <div class="small-text"><strong>ISBN:</strong> ${book.isbn || 'Tidak Ada'}</div>
              <div class="small-text"><strong>Penerbit:</strong> ${book.penerbit}</div>
              <div class="small-text"><strong>Tahun Terbit:</strong> ${book.tahun_terbit}</div>
              <div class="small-text"><strong>Lokasi Rak:</strong> ${book.lokasi_rak || 'Rak Utama'}</div>
              <div class="small-text"><strong>Stok Tersedia:</strong> <strong style="color:var(--color-primary);">${book.stok_tersedia}</strong> dari ${book.stok}</div>
            </div>

            <h4>Deskripsi &amp; Sinopsis</h4>
            <p style="font-size:0.875rem;color:var(--color-text-secondary);line-height:1.6;margin-top:6px;">
              ${book.deskripsi}
            </p>
          </div>
        </div>
      `;

      // Direct borrow button handling
      const btnBorrow = document.getElementById('btn-modal-borrow-direct');
      if (isMember) {
        btnBorrow.style.display = 'inline-flex';
        btnBorrow.disabled = !isAvailable;
        btnBorrow.setAttribute('data-book-id', book.id);
      } else {
        btnBorrow.style.display = 'none';
      }

      this.openModal('modal-book-detail');
    }

    borrowBookDirect() {
      const btn = document.getElementById('btn-modal-borrow-direct');
      const bookId = btn.getAttribute('data-book-id');
      this.closeModal('modal-book-detail');
      this.quickBorrowBook(bookId);
    }

    quickBorrowBook(bookId) {
      if (!this.currentUser || this.currentUser.role !== 'member') {
        this.showToast('info', 'Login Dibutuhkan', 'Silakan masuk sebagai anggota perpustakaan untuk meminjam buku.');
        return;
      }

      const member = this.store.getMemberByUserId(this.currentUser.id);
      if (!member) return;

      try {
        const loan = this.store.createLoan({
          anggota_id: member.id,
          buku_ids: [bookId],
          tanggal_pinjam: this.store.currentDate
        });

        this.showToast(
          'success',
          'Peminjaman Berhasil',
          `Buku berhasil dipinjam (#${loan.kode_transaksi}). Jatuh tempo: ${loan.tanggal_jatuh_tempo}.`
        );
        this.navigate('dashboard');
      } catch (err) {
        this.showToast('error', 'Peminjaman Gagal', err.message);
      }
    }

    // --- STEPPER: PEMINJAMAN BARU (Section 18.2) ---
    openNewLoanModal() {
      this.stepperData = {
        step: 1,
        memberId: null,
        selectedBookIds: [],
        pinjamDate: this.store.currentDate,
        tempoDate: this.store.addDays(this.store.currentDate, 7)
      };

      // Populate member dropdown
      const sel = document.getElementById('loan-select-member');
      sel.innerHTML = '<option value="">-- Pilih Anggota Peminjam --</option>';
      this.store.getMembers().forEach((m) => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.nama} (${m.nomor_anggota} - ${m.jenis_anggota}) [Sisa kuota: ${m.sisa_kuota}]`;
        if (m.status !== 'Aktif') {
          opt.textContent += ' (Nonaktif)';
        }
        sel.appendChild(opt);
      });

      document.getElementById('loan-member-preview').style.display = 'none';
      document.getElementById('loan-confirm-pinjam-date').value = this.stepperData.pinjamDate;
      document.getElementById('loan-confirm-tempo-date').value = this.stepperData.tempoDate;

      this.updateStepperUI();
      this.openModal('modal-new-loan');
    }

    handleLoanMemberSelect(memberId) {
      this.stepperData.memberId = memberId;
      const preview = document.getElementById('loan-member-preview');

      if (!memberId) {
        preview.style.display = 'none';
        return;
      }

      const mem = this.store.getMemberById(memberId);
      if (!mem) return;

      preview.style.display = 'block';
      preview.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <strong>${mem.nama}</strong> (${mem.nomor_anggota})<br>
            <span class="small-text text-secondary">Jenis: <strong>${mem.jenis_anggota}</strong> &bull; Status: <span class="badge ${mem.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif'}">${mem.status}</span></span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.15rem;font-weight:700;">${mem.buku_aktif_count} / ${mem.batas_maksimal}</div>
            <div class="small-text text-muted">Sisa Kuota: <strong>${mem.sisa_kuota} buku</strong></div>
          </div>
        </div>
        ${
          mem.status !== 'Aktif'
            ? '<div class="badge badge-nonaktif" style="margin-top:8px;display:block;">Peringatan: Anggota berstatus Nonaktif tidak diizinkan meminjam buku.</div>'
            : mem.sisa_kuota <= 0
            ? '<div class="badge badge-terlambat" style="margin-top:8px;display:block;">Batas Maksimal Tercapai: Anggota harus mengembalikan buku aktif terlebih dahulu.</div>'
            : ''
        }
      `;
    }

    loanNextStep() {
      if (this.stepperData.step === 1) {
        if (!this.stepperData.memberId) {
          this.showToast('warning', 'Pilih Anggota', 'Silakan pilih anggota peminjam terlebih dahulu.');
          return;
        }

        const mem = this.store.getMemberById(this.stepperData.memberId);
        if (mem.status !== 'Aktif') {
          this.showToast('error', 'Peminjaman Ditolak', `Anggota "${mem.nama}" berstatus Nonaktif (PRD 8.3).`);
          return;
        }

        if (mem.sisa_kuota <= 0) {
          this.showToast(
            'error',
            'Batas Peminjaman Tercapai',
            `Anggota jenis "${mem.jenis_anggota}" telah mencapai batas ${mem.batas_maksimal} buku aktif (PRD 8.2).`
          );
          return;
        }

        this.stepperData.step = 2;
        this.renderLoanBookPicker();
      } else if (this.stepperData.step === 2) {
        if (this.stepperData.selectedBookIds.length === 0) {
          this.showToast('warning', 'Pilih Buku', 'Pilih minimal satu buku untuk melanjutkan.');
          return;
        }

        this.stepperData.step = 3;
        this.renderLoanConfirmation();
      }

      this.updateStepperUI();
    }

    loanPrevStep() {
      if (this.stepperData.step > 1) {
        this.stepperData.step--;
        this.updateStepperUI();
      }
    }

    updateStepperUI() {
      const step = this.stepperData.step;

      // Update Step Circles
      [1, 2, 3].forEach((s) => {
        const ind = document.getElementById(`loan-step-ind-${s}`);
        const content = document.getElementById(`loan-step-content-${s}`);
        ind.classList.remove('active', 'completed');

        if (s < step) {
          ind.classList.add('completed');
          content.style.display = 'none';
        } else if (s === step) {
          ind.classList.add('active');
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });

      // Update Buttons
      const btnPrev = document.getElementById('btn-loan-prev');
      const btnNext = document.getElementById('btn-loan-next');
      const btnSubmit = document.getElementById('btn-loan-submit');

      btnPrev.style.display = step > 1 ? 'inline-flex' : 'none';
      btnNext.style.display = step < 3 ? 'inline-flex' : 'none';
      btnSubmit.style.display = step === 3 ? 'inline-flex' : 'none';

      if (step === 1) btnNext.textContent = 'Lanjut ke Pilih Buku →';
      if (step === 2) btnNext.textContent = 'Lanjut ke Konfirmasi →';
    }

    renderLoanBookPicker() {
      const mem = this.store.getMemberById(this.stepperData.memberId);
      const remainingQuota = mem ? mem.sisa_kuota : 5;

      document.getElementById('loan-counter-badge').textContent = `Buku dipilih: ${this.stepperData.selectedBookIds.length} / Sisa Kuota: ${remainingQuota}`;

      this.filterLoanBookPicker('');
    }

    filterLoanBookPicker(query) {
      const keyword = query.toLowerCase().trim();
      const listContainer = document.getElementById('loan-book-picker-list');
      listContainer.innerHTML = '';

      const mem = this.store.getMemberById(this.stepperData.memberId);
      const remainingQuota = mem ? mem.sisa_kuota : 5;
      const currentSelectedCount = this.stepperData.selectedBookIds.length;

      const books = this.store.getBooks().filter((b) => {
        if (!keyword) return true;
        return (
          b.judul.toLowerCase().includes(keyword) ||
          b.penulis.toLowerCase().includes(keyword) ||
          b.kode_buku.toLowerCase().includes(keyword)
        );
      });

      if (books.length === 0) {
        listContainer.innerHTML = '<div class="small-text text-muted" style="padding:12px;text-align:center;">Buku tidak ditemukan.</div>';
        return;
      }

      books.forEach((b) => {
        const isSelected = this.stepperData.selectedBookIds.includes(b.id);
        const isOutOfStock = b.stok_tersedia <= 0;
        const reachedLimit = !isSelected && currentSelectedCount >= remainingQuota;
        const isDisabled = isOutOfStock || reachedLimit;

        const item = document.createElement('label');
        item.className = `book-picker-item ${isDisabled ? 'disabled' : ''}`;
        item.innerHTML = `
          <input type="checkbox" value="${b.id}" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} onchange="window.PustakaApp.toggleLoanBookSelection('${b.id}', this.checked)">
          <img src="${b.cover}" style="width:28px;height:40px;object-fit:cover;border-radius:3px;" alt="Cover">
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.84375rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.judul}</div>
            <div class="small-text text-secondary">${b.penulis} &bull; ${b.kategori_nama}</div>
          </div>
          <div>
            ${
              isOutOfStock
                ? '<span class="badge badge-habis">Stok Habis</span>'
                : `<span class="badge badge-tersedia">Tersedia ${b.stok_tersedia}</span>`
            }
          </div>
        `;
        listContainer.appendChild(item);
      });
    }

    toggleLoanBookSelection(bookId, isChecked) {
      const mem = this.store.getMemberById(this.stepperData.memberId);
      const remainingQuota = mem ? mem.sisa_kuota : 5;

      if (isChecked) {
        if (this.stepperData.selectedBookIds.length >= remainingQuota) {
          this.showToast('warning', 'Kuota Penuh', `Batas peminjaman Anda tersisa ${remainingQuota} buku.`);
          this.renderLoanBookPicker();
          return;
        }
        this.stepperData.selectedBookIds.push(bookId);
      } else {
        this.stepperData.selectedBookIds = this.stepperData.selectedBookIds.filter((id) => id !== bookId);
      }

      this.renderLoanBookPicker();
    }

    renderLoanConfirmation() {
      const mem = this.store.getMemberById(this.stepperData.memberId);
      const books = this.stepperData.selectedBookIds.map((id) => this.store.getBookById(id)).filter(Boolean);

      const summary = document.getElementById('loan-summary-details');
      summary.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--color-border);">
          <div>
            <div class="small-text text-muted">Nama Anggota:</div>
            <strong>${mem.nama}</strong> (${mem.nomor_anggota}) - ${mem.jenis_anggota}
          </div>
          <div style="text-align:right;">
            <div class="small-text text-muted">Durasi Pinjam:</div>
            <span class="badge badge-tersedia">7 Hari Kalender</span>
          </div>
        </div>

        <div class="small-text text-muted" style="margin-bottom:6px;">Daftar Buku (${books.length} Judul Dipilih):</div>
        <ul style="padding-left:18px;margin-bottom:12px;font-size:0.875rem;">
          ${books.map((b) => `<li><strong>${b.judul}</strong> (${b.kode_buku}) - ${b.penulis}</li>`).join('')}
        </ul>
      `;
    }

    updateLoanDueDates(newPinjamDate) {
      this.stepperData.pinjamDate = newPinjamDate;
      this.stepperData.tempoDate = this.store.addDays(newPinjamDate, 7);
      document.getElementById('loan-confirm-tempo-date').value = this.stepperData.tempoDate;
    }

    submitNewLoan() {
      try {
        const pinjamDate = document.getElementById('loan-confirm-pinjam-date').value;
        const loan = this.store.createLoan({
          anggota_id: this.stepperData.memberId,
          buku_ids: this.stepperData.selectedBookIds,
          tanggal_pinjam: pinjamDate
        });

        this.closeModal('modal-new-loan');
        this.showToast(
          'success',
          'Peminjaman Berhasil',
          `Transaksi #${loan.kode_transaksi} berhasil dicatat dengan ${loan.total_buku} buku.`
        );
        this.navigate('loans');
      } catch (err) {
        this.showToast('error', 'Peminjaman Gagal', err.message);
      }
    }

    // --- MODAL: MULTI-BOOK RETURN (Section 19 & PRD FR-08) ---
    openReturnModalForLoan(loanId) {
      this.activeReturnLoanId = loanId;
      const loan = this.store.getLoanById(loanId);
      if (!loan) return;

      const unreturned = loan.details.filter((d) => d.status === 'Dipinjam');
      const body = document.getElementById('modal-return-process-body');

      body.innerHTML = `
        <div class="card" style="background:var(--color-surface-muted);padding:14px;margin-bottom:var(--space-lg);">
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <div>
              <strong>#${loan.kode_transaksi}</strong> &bull; Anggota: <strong>${loan.anggota ? loan.anggota.nama : 'Anggota'}</strong><br>
              <span class="small-text text-muted">Tanggal Pinjam: ${loan.tanggal_pinjam} &bull; Jatuh Tempo: <strong>${loan.tanggal_jatuh_tempo}</strong></span>
            </div>
            <div>
              <span class="badge ${this.getBadgeClassForLoanStatus(loan.status)}">${loan.status}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Tanggal Pengembalian Riil</label>
          <input type="date" id="return-sim-date" class="form-control" value="${this.store.currentDate}" onchange="window.PustakaApp.recalculateReturnFines()">
        </div>

        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <label class="form-label" style="margin-bottom:0;">Pilih Buku yang Dikembalikan (Dukungan Parsial)</label>
            <span class="small-text text-muted">Centang buku yang diserahkan hari ini</span>
          </div>
          <div id="return-books-checklist" style="display:flex;flex-direction:column;gap:8px;">
            ${loan.details
              .map((d) => {
                const b = d.buku || { judul: 'Buku', cover: 'assets/covers/cover_ai_ml.jpg' };
                const isAlreadyReturned = d.status === 'Kembali';

                return `
                <div class="book-picker-item ${isAlreadyReturned ? 'disabled' : ''}">
                  <input type="checkbox" name="return_book_checkbox" value="${d.id}" ${isAlreadyReturned ? 'disabled checked' : 'checked'} onchange="window.PustakaApp.recalculateReturnFines()">
                  <img src="${b.cover}" style="width:28px;height:40px;object-fit:cover;border-radius:3px;">
                  <div style="flex:1;">
                    <strong>${b.judul}</strong>
                    <div class="small-text text-muted">${d.status === 'Kembali' ? `(Sudah kembali pada ${d.tanggal_kembali})` : 'Belum Dikembalikan'}</div>
                  </div>
                </div>`;
              })
              .join('')}
          </div>
        </div>

        <div id="return-fine-alert" class="card" style="margin-top:var(--space-lg);padding:14px;background:#FEE2E2;border-color:#FECACA;display:none;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i data-lucide="alert-triangle" style="color:var(--color-error);width:24px;height:24px;"></i>
            <div style="flex:1;">
              <strong style="color:var(--color-error);">Terdeteksi Keterlambatan Pengembalian</strong>
              <div class="small-text" id="return-fine-explanation" style="color:#991B1B;">-</div>
            </div>
            <div style="font-size:1.35rem;font-weight:700;color:var(--color-error);" id="return-fine-amount-display">$0</div>
          </div>
        </div>
      `;

      this.openModal('modal-return-process');
      this.recalculateReturnFines();
      this.refreshIcons();
    }

    recalculateReturnFines() {
      const loan = this.store.getLoanById(this.activeReturnLoanId);
      if (!loan) return;

      const returnDate = document.getElementById('return-sim-date').value;
      const checkedBoxes = Array.from(document.querySelectorAll('input[name="return_book_checkbox"]:checked:not(:disabled)'));

      const daysOverdue = Math.max(0, this.store.getDaysDiff(loan.tanggal_jatuh_tempo, returnDate));
      const finePerBook = daysOverdue * 2; // $2 per hari
      const totalFine = finePerBook * checkedBoxes.length;

      const alertBox = document.getElementById('return-fine-alert');
      if (daysOverdue > 0 && checkedBoxes.length > 0) {
        alertBox.style.display = 'block';
        document.getElementById('return-fine-explanation').textContent = `Melewati jatuh tempo ${loan.tanggal_jatuh_tempo} sebanyak ${daysOverdue} hari (${checkedBoxes.length} buku x ${daysOverdue} hari x $2/hari). Sanksi denda akan dicatat ke tagihan anggota.`;
        document.getElementById('return-fine-amount-display').textContent = `$${totalFine}`;
      } else {
        alertBox.style.display = 'none';
      }
      this.refreshIcons();
    }

    submitReturnTransaction() {
      const checkedBoxes = Array.from(document.querySelectorAll('input[name="return_book_checkbox"]:checked:not(:disabled)'));
      if (checkedBoxes.length === 0) {
        this.showToast('warning', 'Pilih Buku', 'Pilih minimal satu buku yang hendak dikembalikan.');
        return;
      }

      const detailIds = checkedBoxes.map((cb) => cb.value);
      const returnDate = document.getElementById('return-sim-date').value;

      try {
        const result = this.store.processReturn({
          loan_id: this.activeReturnLoanId,
          detail_ids: detailIds,
          tanggal_kembali: returnDate
        });

        this.closeModal('modal-return-process');
        this.updateFineBadge();

        if (result.total_fine > 0) {
          this.showToast(
            'warning',
            'Pengembalian Terlambat',
            `${result.returned_count} buku dikembalikan terlambat ${result.days_overdue} hari. Tagihan denda sebesar $${result.total_fine} telah dicatat.`
          );
        } else {
          this.showToast('success', 'Pengembalian Berhasil', `${result.returned_count} buku berhasil dikembalikan tepat waktu.`);
        }

        this.navigate(this.currentRoute);
      } catch (err) {
        this.showToast('error', 'Gagal Memproses Pengembalian', err.message);
      }
    }

    // --- MODAL: PAY FINE (Section 20 & PRD FR-10) ---
    openPayFineModal(fineId) {
      this.activePayFineId = fineId;
      const fine = this.store.getFineById(fineId);
      if (!fine) return;

      document.getElementById('pay-fine-id').value = fine.id;
      document.getElementById('pay-fine-member-name').textContent = fine.anggota ? `${fine.anggota.nama} (${fine.anggota.nomor_anggota})` : 'Anggota';
      document.getElementById('pay-fine-code').textContent = '#' + fine.kode_denda;
      document.getElementById('pay-fine-days').textContent = `${fine.jumlah_hari_terlambat} hari terlambat`;
      document.getElementById('pay-fine-total-display').textContent = `Total Denda: $${fine.jumlah}`;
      document.getElementById('pay-fine-date').value = this.store.currentDate;
      document.getElementById('pay-fine-method').value = '';
      document.getElementById('pay-fine-notes').value = '';

      this.openModal('modal-pay-fine');
    }

    submitFinePayment() {
      const fineId = document.getElementById('pay-fine-id').value;
      const payDate = document.getElementById('pay-fine-date').value;
      const payMethod = document.getElementById('pay-fine-method').value;
      const notes = document.getElementById('pay-fine-notes').value.trim();

      if (!payMethod) {
        this.showToast('error', 'Validasi Gagal', 'Silakan pilih metode pembayaran yang digunakan (PRD 6.FR-10).');
        return;
      }

      try {
        const fine = this.store.payFine({
          fine_id: fineId,
          tanggal_pembayaran: payDate,
          metode_pembayaran: payMethod,
          catatan_pembayaran: notes
        });

        this.closeModal('modal-pay-fine');
        this.updateFineBadge();
        this.showToast(
          'success',
          'Pembayaran Denda Diterima',
          `Pelunasan denda $${fine.jumlah} via ${fine.metode_pembayaran} berhasil dicatat resmi.`
        );
        this.renderFinesTable();
      } catch (err) {
        this.showToast('error', 'Pembayaran Gagal', err.message);
      }
    }

    // --- MODAL: SWITCH ACCOUNT (EVALUATOR DEMO) ---
    openSwitchAccountModal() {
      const list = document.getElementById('switch-account-list');
      list.innerHTML = '';

      this.store.data.users.forEach((u) => {
        const isCurrent = this.currentUser && this.currentUser.id === u.id;
        const item = document.createElement('div');
        item.style.cssText = `padding:10px 14px;border-radius:8px;border:1px solid var(--color-border);background:${isCurrent ? 'var(--color-primary-light)' : 'var(--color-surface)'};display:flex;align-items:center;justify-content:space-between;cursor:pointer;`;
        item.onclick = () => {
          this.currentUser = u;
          localStorage.setItem('pustaka_session_user', JSON.stringify(u));
          this.closeModal('modal-switch-account');
          this.showToast('info', 'Beralih Akun', `Sekarang Anda aktif sebagai ${u.name}.`);
          this.showAppWorkspace();
        };

        item.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="user-avatar" style="width:34px;height:34px;font-size:0.875rem;">${u.name.charAt(0)}</div>
            <div>
              <strong>${u.name}</strong><br>
              <span class="small-text text-muted">${u.email} &bull; ${u.role === 'admin' ? 'Role Admin' : 'Role Anggota'}</span>
            </div>
          </div>
          <div>
            ${isCurrent ? '<span class="badge badge-aktif">Aktif</span>' : '<span class="btn btn-secondary btn-sm">Pilih</span>'}
          </div>
        `;
        list.appendChild(item);
      });

      this.openModal('modal-switch-account');
    }

    // --- MODAL: NOTIFICATIONS / ACTIVITY FEED ---
    openNotificationsModal() {
      const body = document.getElementById('notifications-modal-body');
      body.innerHTML = '';
      const acts = this.store.data.activities;

      if (acts.length === 0) {
        body.innerHTML = '<p class="small-text text-muted text-center" style="padding:20px;">Belum ada riwayat aktivitas.</p>';
      } else {
        acts.forEach((act) => {
          const item = document.createElement('div');
          item.style.cssText = 'padding:10px 0;border-bottom:1px solid var(--color-border);';
          item.innerHTML = `
            <div style="font-size:0.84375rem;font-weight:600;color:var(--color-text-main);">${act.action}</div>
            <div style="font-size:0.8125rem;color:var(--color-text-secondary);margin-top:2px;">${act.description}</div>
            <div class="small-text text-muted" style="margin-top:4px;">${act.timestamp} &bull; Oleh: ${act.user_name}</div>
          `;
          body.appendChild(item);
        });
      }

      this.openModal('modal-notifications');
    }

    // --- MODAL: UNIVERSAL CONFIRMATION (Section 26) ---
    openConfirmModal(title, message, onConfirmCallback) {
      document.getElementById('modal-confirm-title').textContent = title;
      document.getElementById('modal-confirm-message').textContent = message;

      const acceptBtn = document.getElementById('btn-confirm-accept');
      // Clone button to strip existing event listeners cleanly
      const newBtn = acceptBtn.cloneNode(true);
      acceptBtn.parentNode.replaceChild(newBtn, acceptBtn);

      newBtn.onclick = () => {
        this.closeModal('modal-confirm');
        if (typeof onConfirmCallback === 'function') {
          onConfirmCallback();
        }
      };

      this.openModal('modal-confirm');
    }

    // --- TOAST NOTIFICATIONS (Section 27) ---
    showToast(type, title, message) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let iconName = 'info';
      if (type === 'success') iconName = 'check-circle-2';
      if (type === 'error') iconName = 'alert-octagon';
      if (type === 'warning') iconName = 'alert-triangle';

      toast.innerHTML = `
        <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
      `;

      container.appendChild(toast);
      this.refreshIcons();

      // Trigger animation
      setTimeout(() => toast.classList.add('show'), 20);

      // Auto dismiss after 4s
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    // --- MODAL HELPERS ---
    openModal(modalId) {
      const m = document.getElementById(modalId);
      if (m) {
        m.classList.add('show');
        this.refreshIcons();
      }
    }

    closeModal(modalId) {
      const m = document.getElementById(modalId);
      if (m) {
        m.classList.remove('show');
      }
    }

    getBadgeClassForLoanStatus(status) {
      switch (status) {
        case 'Dipinjam':
          return 'badge-dipinjam';
        case 'Sebagian Kembali':
          return 'badge-sebagian-kembali';
        case 'Terlambat':
          return 'badge-terlambat';
        case 'Selesai':
          return 'badge-selesai';
        default:
          return 'badge-neutral';
      }
    }

    handleCoverPresetChange(val) {
      // preview or custom option handler
    }
  }

  // Instantiate application on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    window.PustakaApp = new PustakaApp();
  });
})();
