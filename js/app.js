/**
 * app.js - Presentation Layer & UI Logic
 * Mengelola state antarmuka, rendering dinamis CSR, Universal Modal, dan Form Event Listener
 */

const App = {
  // State aplikasi lokal
  state: {
    profile: null,
    projects: [],
    services: [],
    currentFilter: 'All',
    ordersCount: 0
  },

  // Inisialisasi Aplikasi
  async init() {
    this.initLocalStorage();
    this.setupEventListeners();
    await this.loadAllData();
  },

  // Sanitasi string masukan untuk mencegah serangan DOM XSS
  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Inisialisasi data dari LocalStorage
  initLocalStorage() {
    const savedOrders = localStorage.getItem('app_service_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        this.state.ordersCount = parsed.length;
      } catch (e) {
        this.state.ordersCount = 0;
      }
    }
    this.updateOrderBadge();
  },

  // Perbarui indikator jumlah pesanan di Navbar
  updateOrderBadge() {
    const badgeEl = document.getElementById('orderBadge');
    if (badgeEl) {
      badgeEl.innerHTML = `<i class="fa-solid fa-cart-shopping me-1"></i> Pesanan: ${this.state.ordersCount}`;
    }
  },

  // Ambil seluruh data JSON secara asinkron (CSR)
  async loadAllData() {
    // 1. LOADING STATE
    this.renderSkeletonLoaders();

    try {
      const [profileData, projectsData, servicesData] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getProjects(),
        ApiService.getServices()
      ]);

      this.state.profile = profileData;
      this.state.projects = projectsData;
      this.state.services = servicesData;

      // 2. SUCCESS STATE
      this.renderProfile();
      this.renderProjects();
      this.renderServices();

    } catch (error) {
      // 3. ERROR STATE
      this.showErrorAlert('Gagal memuat data dari penyedia data JSON. Pastikan Anda menjalankan aplikasi via server lokal (Live Server).');
    }
  },

  // Visualisasi Loading State (Skeleton Loaders)
  renderSkeletonLoaders() {
    const projContainer = document.getElementById('projectContainer');
    const srvContainer = document.getElementById('servicesContainer');

    if (projContainer) {
      projContainer.innerHTML = Array(4).fill(0).map(() => `
        <div class="col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
            <div class="bg-secondary opacity-25" style="height: 180px;"></div>
            <div class="card-body p-3">
              <div class="placeholder-glow">
                <span class="placeholder col-8 mb-2"></span>
                <span class="placeholder col-12"></span>
                <span class="placeholder col-10"></span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (srvContainer) {
      srvContainer.innerHTML = Array(3).fill(0).map(() => `
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-3">
            <div class="placeholder-glow">
              <span class="placeholder col-7 mb-2"></span>
              <span class="placeholder col-12 mb-2"></span>
              <span class="placeholder col-9"></span>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  // Render Data Profil Mahasiswa
  renderProfile() {
    const p = this.state.profile;
    if (!p) return;

    document.getElementById('profileBadge').innerHTML = `<i class="fa-solid fa-graduation-cap me-1"></i> ${this.escapeHTML(p.nim)} • ${this.escapeHTML(p.programStudy)}`;
    document.getElementById('profileName').textContent = `Halo Semua 👋, Saya ${p.name}`;
    document.getElementById('profileBio').textContent = p.bio;
    if (p.socials?.linkedin) {
      document.getElementById('linkLinkedin').href = p.socials.linkedin;
    }
  },

  // Render Daftar Kartu Proyek
  renderProjects() {
    const container = document.getElementById('projectContainer');
    if (!container) return;

    // Filter Kategori
    const filtered = this.state.currentFilter === 'All'
      ? this.state.projects
      : this.state.projects.filter(p => p.category === this.state.currentFilter);

    // 4. EMPTY STATE
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="text-secondary mb-3"><i class="fa-solid fa-folder-open fa-3x"></i></div>
          <h5 class="fw-bold">Tidak ada proyek dalam kategori ini</h5>
          <p class="text-muted">Pilih kategori lain untuk melihat koleksi karya portofolio.</p>
        </div>
      `;
      return;
    }

    // Render Kartu Proyek
    container.innerHTML = filtered.map(proj => `
      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-3 overflow-hidden h-100 d-flex flex-column">
          <img src="${this.escapeHTML(proj.thumbnail)}" class="card-img-top" alt="${this.escapeHTML(proj.title)}" style="height: 180px; object-fit: cover;">
          <div class="card-body p-3 d-flex flex-column">
            <span class="badge bg-primary-subtle text-primary mb-2 align-self-start">${this.escapeHTML(proj.category)}</span>
            <h5 class="card-title fw-bold text-truncate">${this.escapeHTML(proj.title)}</h5>
            <p class="card-text text-secondary small flex-grow-1 text-truncate-2 mb-3">${this.escapeHTML(proj.description)}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="badge bg-light text-dark border">${this.escapeHTML(proj.metrics)}</span>
              <button type="button" class="btn btn-sm btn-primary px-3 fw-semibold btn-detail" data-id="${proj.id}">
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  // Render Daftar Paket Layanan
  renderServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;

    container.innerHTML = this.state.services.map(srv => `
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column">
          <h4 class="fw-bold text-primary mb-2">${this.escapeHTML(srv.name)}</h4>
          <div class="fs-5 fw-semibold text-dark mb-3">${this.escapeHTML(srv.price)}</div>
          <p class="text-secondary small mb-4">${this.escapeHTML(srv.description)}</p>
          <ul class="list-unstyled mb-4 flex-grow-1">
            ${srv.features.map(f => `<li class="mb-2 text-secondary"><i class="fa-solid fa-check text-success me-2"></i>${this.escapeHTML(f)}</li>`).join('')}
          </ul>
          <a href="#orderForm" class="btn btn-outline-primary w-100 fw-semibold mt-auto select-service-btn" data-service="${this.escapeHTML(srv.name)}">
            Pilih Layanan Ini
          </a>
        </div>
      </div>
    `).join('');
  },

  // Tampilkan Modal Universal Berdasarkan ID Proyek yang Diklik
  openProjectModal(projectId) {
    const proj = this.state.projects.find(p => p.id === projectId);
    if (!proj) return;

    document.getElementById('projectModalTitle').textContent = proj.title;
    document.getElementById('projectModalBody').innerHTML = `
      <img src="${this.escapeHTML(proj.thumbnail)}" class="img-fluid rounded mb-3 w-100" style="max-height: 300px; object-fit: cover;" alt="${this.escapeHTML(proj.title)}">
      <div class="d-flex align-items-center gap-2 mb-3">
        <span class="badge bg-primary px-3 py-2">${this.escapeHTML(proj.category)}</span>
        <span class="badge bg-secondary px-3 py-2">${this.escapeHTML(proj.metrics)}</span>
      </div>
      <h6 class="fw-bold">Deskripsi Proyek:</h6>
      <p class="text-secondary mb-3">${this.escapeHTML(proj.description)}</p>
      <h6 class="fw-bold">Teknologi Digunakan:</h6>
      <div class="d-flex flex-wrap gap-2 mb-4">
        ${proj.tags.map(t => `<span class="badge bg-light text-dark border">${this.escapeHTML(t)}</span>`).join('')}
      </div>
      <div class="text-end">
        <a href="${this.escapeHTML(proj.link)}" target="_blank" class="btn btn-primary fw-semibold">
          <i class="fa-brands fa-github me-1"></i> Lihat di GitHub
        </a>
      </div>
    `;

    const modalEl = document.getElementById('universalProjectModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },

  // Event Listener Registrasi
  setupEventListeners() {
    // 1. Event Delegation Tombol Detail Modal pada Kartu Proyek
    document.getElementById('projectContainer')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-detail');
      if (btn) {
        const projId = btn.getAttribute('data-id');
        this.openProjectModal(projId);
      }
    });

    // 2. Event Delegation Tombol Pilih Layanan
    document.getElementById('servicesContainer')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-service-btn');
      if (btn) {
        const serviceName = btn.getAttribute('data-service');
        const selectEl = document.getElementById('serviceType');
        if (selectEl) {
          selectEl.value = serviceName;
        }
      }
    });

    // 3. Event Listener Filter Kategori Proyek
    const filterGroup = document.getElementById('filterGroup');
    if (filterGroup) {
      filterGroup.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          filterGroup.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.state.currentFilter = e.target.getAttribute('data-filter');
          this.renderProjects();
        }
      });
    }

    // 4. Form Submit Asinkron (Decoupled REST Form Dispatching)
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
      orderForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah full page reload

        const submitBtn = document.getElementById('submitBtn');
        const formData = new FormData(orderForm);
        const payload = Object.fromEntries(formData.entries());

        // Mengubah status tombol saat memproses
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';

        try {
          // Kirim payload secara asinkron via API Service
          const result = await ApiService.submitServiceOrder(payload);

          // Simpan ke LocalStorage
          this.saveOrderToLocalStorage(payload);

          // Tampilkan Notifikasi Toast
          this.showToast('Sukses! Permintaan pemesanan layanan berhasil dikirim.');

          orderForm.reset();
        } catch (err) {
          this.showToast('Gagal mengirim pemesanan. Silakan coba lagi.', true);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Kirim Permintaan';
        }
      });
    }
  },

  // Simpan data pemesanan ke LocalStorage
  saveOrderToLocalStorage(payload) {
    let orders = [];
    const saved = localStorage.getItem('app_service_orders');
    if (saved) {
      try { orders = JSON.parse(saved); } catch (e) { orders = []; }
    }
    orders.push({ ...payload, createdAt: new Date().toISOString() });
    localStorage.setItem('app_service_orders', JSON.stringify(orders));

    this.state.ordersCount = orders.length;
    this.updateOrderBadge();
  },

  // Tampilkan Alert Error Fallback
  showErrorAlert(msg) {
    const alertEl = document.getElementById('errorAlert');
    const msgEl = document.getElementById('errorMessage');
    if (alertEl && msgEl) {
      msgEl.textContent = msg;
      alertEl.classList.remove('d-none');
    }
  },

  // Tampilkan Notifikasi Bootstrap Toast
  showToast(msg, isError = false) {
    const toastEl = document.getElementById('liveToast');
    const toastMsg = document.getElementById('toastMessage');

    if (toastEl && toastMsg) {
      toastMsg.textContent = msg;
      if (isError) {
        toastEl.classList.remove('text-bg-success');
        toastEl.classList.add('text-bg-danger');
      } else {
        toastEl.classList.remove('text-bg-danger');
        toastEl.classList.add('text-bg-success');
      }
      const bsToast = new bootstrap.Toast(toastEl);
      bsToast.show();
    }
  }
};

// Jalankan aplikasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});