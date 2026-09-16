"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Script from "next/script";
import Link from "next/link";

interface Fasilitas {
  id: number;
  nama_fasilitas: string;
  kategori: string;
  jumlah: string;
}

export default function AdminFasilitasPage() {
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // Form State untuk Tambah
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");

  // State untuk Edit Modal
  const [editId, setEditId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editKategori, setEditKategori] = useState("");
  const [editJumlah, setEditJumlah] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFasilitas();
  }, []);

  async function fetchFasilitas() {
    setLoading(true);
    const { data, error } = await supabase
      .from("fasilitas_desa")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) setFasilitas(data);
    setLoading(false);
  }

  // CREATE: Fungsi Tambah Fasilitas
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("fasilitas_desa").insert([
      { nama_fasilitas: nama, kategori, jumlah }
    ]);

    if (!error) {
      alert("Fasilitas berhasil ditambahkan!");
      setNama("");
      setKategori("");
      setJumlah("");
      fetchFasilitas();
    } else {
      alert("Gagal menambah fasilitas: " + error.message);
    }
    setSubmitting(false);
  }

  // DELETE: Fungsi Hapus Fasilitas
  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus fasilitas ini?")) return;
    
    const { error } = await supabase.from("fasilitas_desa").delete().eq("id", id);
    if (!error) {
      alert("Fasilitas berhasil dihapus.");
      fetchFasilitas();
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  }

  // Fungsi membuka Modal Edit dan memuat data
  function openEditModal(item: Fasilitas) {
    setEditId(item.id);
    setEditNama(item.nama_fasilitas);
    setEditKategori(item.kategori);
    setEditJumlah(item.jumlah);
    
    // Tampilkan modal menggunakan objek global window.bootstrap dari CDN
    if (typeof window !== "undefined") {
      // @ts-expect-error: bootstrap is loaded globally via CDN
      const bootstrap = window.bootstrap;
      const modalElement = document.getElementById("editFasilitasModal");
      if (modalElement && bootstrap) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  // UPDATE: Fungsi Simpan Perubahan
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    
    setIsEditing(true);

    const { data, error } = await supabase
      .from("fasilitas_desa")
      .update({
        nama_fasilitas: editNama,
        kategori: editKategori,
        jumlah: editJumlah
      })
      .eq("id", editId)
      .select(); // Mengembalikan data yang berhasil diubah

    if (error) {
      alert("Gagal memperbarui fasilitas: " + error.message);
    } else if (!data || data.length === 0) {
      alert("Gagal memperbarui: Data tidak ditemukan atau terhalang izin RLS.");
    } else {
      alert("Fasilitas berhasil diperbarui!");
      fetchFasilitas();
      
      if (typeof window !== "undefined") {
        // @ts-expect-error: bootstrap is loaded globally via CDN
        const bootstrap = window.bootstrap;
        const modalElement = document.getElementById("editFasilitasModal");
        if (modalElement && bootstrap) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();
        }
      }
    }
    setIsEditing(false);
  }

  const toggleSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />

      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: "Poppins", sans-serif; background-color: #f8f9fa; overflow-x: hidden; margin: 0; }
        #wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        #sidebar { width: 260px; background-color: #538863; color: white; display: flex; flex-direction: column; flex-shrink: 0; transition: all 0.3s ease-in-out; z-index: 1050; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-link { color: #e2e8f0; padding: 12px 20px; font-weight: 500; transition: 0.2s; text-decoration: none; display: block; }
        .nav-link:hover, .nav-link.active { color: #ffffff; background-color: rgba(255, 255, 255, 0.1); font-weight: 600; }
        
        .sub-menu { overflow: hidden; transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; list-style: none; padding-left: 0; margin-bottom: 0; }
        .sub-menu .nav-link { padding-left: 40px; font-size: 0.9rem; }
        .chevron-icon { transition: transform 0.3s ease; }
        .submenu-open .chevron-icon { transform: rotate(90deg); }

        #content-wrapper { flex-grow: 1; display: flex; flex-direction: column; overflow-y: auto; width: 100%; }
        .top-navbar { background-color: #ffffff; height: 70px; min-height: 70px; flex-shrink: 0; border-bottom: 1px solid #dee2e6; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
        #sidebar-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.4); z-index: 1040; }
        @media (max-width: 991.98px) {
            #sidebar { position: fixed; top: 0; left: -260px; height: 100vh; }
            #sidebar.show { left: 0; }
            #sidebar-overlay.show { display: block; }
        }
      `}} />

      <div id="wrapper">
        <div id="sidebar-overlay" className={isSidebarOpen ? "show" : ""} onClick={() => setIsSidebarOpen(false)}></div>

        {/* SIDEBAR[cite: 12] */}
        <nav id="sidebar" className={isSidebarOpen ? "show" : ""}>
          <div className="sidebar-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="/assets/img/logo-klaten.png" alt="Logo" width="40" height="50" className="me-2 me-sm-3" style={{ objectFit: "contain" }} />
              <div>
                <h6 className="mb-0 fw-bold lh-1" style={{ fontSize: "1rem" }}>DESA BUMIHARJO</h6>
                <small style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>KECAMATAN KEMALANG</small>
              </div>
            </div>
            <button className="btn text-white d-lg-none p-0 fs-4" onClick={() => setIsSidebarOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto mt-3">
            <ul className="nav flex-column">
              <li className="nav-item"><Link href="/admin/dashboard" className="nav-link">Dashboard</Link></li>
              <li className="nav-item"><Link href="/admin/profil" className="nav-link">Manajemen Profil</Link></li>
              <li className="nav-item"><Link href="/admin/peta" className="nav-link">Peta & Informasi Wilayah</Link></li>
              <li className="nav-item"><Link href="/admin/fasilitas" className="nav-link active">Kelola Fasilitas</Link></li>
              <li className="nav-item"><Link href="/admin/potensi" className="nav-link">Kelola Potensi</Link></li>
              
              {/* MENU DROPDOWN INFORMASI[cite: 12] */}
              <li className="nav-item">
                <a onClick={toggleSubmenu} className={`nav-link d-flex justify-content-between align-items-center text-white ${isSubmenuOpen ? "submenu-open" : ""}`}>
                  Pusat Informasi 
                  <i className="bi bi-chevron-right chevron-icon" style={{ fontSize: "0.8rem", color: "white" }}></i>
                </a>
                <ul className="sub-menu" style={{ maxHeight: isSubmenuOpen ? "200px" : "0", opacity: isSubmenuOpen ? 1 : 0 }}>
                  <li><Link href="/admin/umkm" className="nav-link">UMKM</Link></li>
                  <li><Link href="/admin/artikel" className="nav-link">Artikel & Galeri</Link></li>
                  <li><Link href="/admin/apb" className="nav-link">APB Desa</Link></li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="mt-auto p-3 mb-2">
            <Link href="/login" className="nav-link text-white fw-bold">
              <i className="bi bi-box-arrow-right me-2"></i>Keluar
            </Link>
          </div>
        </nav>

        {/* CONTENT */}
        <div id="content-wrapper">
          <header className="top-navbar">
            <button className="btn btn-light border d-lg-none" onClick={() => setIsSidebarOpen(true)}>
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="d-flex align-items-center text-end ms-auto">
              <div className="me-2 me-sm-3">
                <span className="d-block text-muted" style={{ fontSize: "0.8rem", lineHeight: 1 }}>Halo,</span>
                <strong className="d-block text-dark" style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>Admin</strong>
              </div>
              <i className="bi bi-person-circle text-dark" style={{ fontSize: "2.2rem" }}></i>
            </div>
          </header>

          <main className="p-3 p-md-4 flex-grow-1">
            <h3 className="fw-bold mb-4 fs-4 fs-md-3">Kelola Fasilitas Desa</h3>
            
            <div className="row g-4">
              {/* FORM TAMBAH */}
              <div className="col-lg-5">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4 sticky-top" style={{ top: "20px" }}>
                  <h5 className="fw-bold mb-3">Tambah Fasilitas Baru</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Fasilitas</label>
                      <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Masjid Al-Ikhlas" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Kategori</label>
                      <select className="form-select" value={kategori} onChange={(e) => setKategori(e.target.value)} required>
                        <option value="" disabled>-- Pilih Kategori --</option>
                        <option value="Pemerintahan">Pemerintahan</option>
                        <option value="Tempat Ibadah">Tempat Ibadah</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Pendidikan">Pendidikan</option>
                        <option value="Fasilitas Olahraga">Fasilitas Olahraga</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Jumlah & Satuan</label>
                      <input type="text" className="form-control" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="Contoh: 1 Buah" required />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-medium" disabled={submitting} style={{ backgroundColor: "#538863" }}>
                      {submitting ? "Menyimpan..." : <><i className="bi bi-plus-circle me-2"></i>Tambah Fasilitas</>}
                    </button>
                  </form>
                </div>
              </div>

              {/* DAFTAR FASILITAS */}
              <div className="col-lg-7">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4">
                  <h5 className="fw-bold mb-3">Daftar Fasilitas</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>No</th>
                          <th>Nama Fasilitas</th>
                          <th>Kategori</th>
                          <th>Jumlah</th>
                          <th className="text-center" style={{ minWidth: "140px" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={5} className="text-center text-muted">Memuat data...</td></tr>
                        ) : fasilitas.length === 0 ? (
                          <tr><td colSpan={5} className="text-center text-muted">Belum ada data fasilitas.</td></tr>
                        ) : (
                          fasilitas.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td><strong className="d-block text-dark">{item.nama_fasilitas}</strong></td>
                              <td><span className="badge bg-secondary">{item.kategori}</span></td>
                              <td>{item.jumlah}</td>
                              <td className="text-center">
                                {/* Tombol Edit */}
                                <button className="btn btn-sm btn-warning text-white me-2" data-bs-toggle="modal" data-bs-target="#modalPeta" onClick={() => openEditModal(item)}>
                                Edit
                              </button>
                                {/* Tombol Hapus */}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                                Hapus
                              </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL EDIT FASILITAS */}
      <div className="modal fade" id="editFasilitasModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="editModalLabel">Edit Fasilitas</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nama Fasilitas</label>
                  <input type="text" className="form-control" value={editNama} onChange={(e) => setEditNama(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Kategori</label>
                  <select className="form-select" value={editKategori} onChange={(e) => setEditKategori(e.target.value)} required>
                    <option value="" disabled>-- Pilih Kategori --</option>
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Tempat Ibadah">Tempat Ibadah</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Fasilitas Olahraga">Fasilitas Olahraga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Jumlah & Satuan</label>
                  <input type="text" className="form-control" value={editJumlah} onChange={(e) => setEditJumlah(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="submit" className="btn btn-success" disabled={isEditing}>
                  {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
