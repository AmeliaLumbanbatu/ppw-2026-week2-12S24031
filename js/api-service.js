/**
 * api-service.js - Data Access Layer (DAL)
 * Bertanggung jawab melakukan HTTP Request (Fetch) ke penyedia data JSON
 */

const ApiService = {
  // Ambil data profil mahasiswa
  async getProfile() {
    try {
      const response = await fetch('./data/profile.json');
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[ApiService] Gagal mengambil data profile:', error);
      throw error;
    }
  },

  // Ambil data daftar proyek portofolio
  async getProjects() {
    try {
      const response = await fetch('./data/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[ApiService] Gagal mengambil data projects:', error);
      throw error;
    }
  },

  // Ambil data paket layanan
  async getServices() {
    try {
      const response = await fetch('./data/services.json');
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[ApiService] Gagal mengambil data services:', error);
      throw error;
    }
  },

  // Simulasi Pengiriman Form Pemesanan Layanan (REST POST Dispatch)
  async submitServiceOrder(orderPayload) {
    // Memakai simulasi delay 1.5 detik agar efek loading tombol terasa
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Permintaan pemesanan layanan berhasil diproses!',
          data: orderPayload,
          timestamp: new Date().toISOString()
        });
      }, 1500);
    });
  }
};