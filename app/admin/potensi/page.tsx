'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

type Potensi = { id: number; nama_potensi: string; kategori: string; };
type Produk = { id: number; nama_produk: string; deskripsi: string; gambar_url: string | null; };

export default function AdminPotensi() {
  // --- STATE DATA ---
  const [potensiList, setPotensiList] = useState<Potensi[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);

  // --- STATE MODAL POTENSI ---
  const [showModalPotensi, setShowModalPotensi] = useState(false);
  const [modalModePotensi, setModalModePotensi] = useState<'add' | 'edit'>('add');
  const [selectedPotensiId, setSelectedPotensiId] = useState<number | null>(null);
  const [namaPotensi, setNamaPotensi] = useState('');
  const [kategoriPotensi, setKategoriPotensi] = useState('');
  const [kategoriBaru, setKategoriBaru] = useState('');
  const [isSubmittingPotensi, setIsSubmittingPotensi] = useState(false);

  // --- STATE MODAL PRODUK ---
  const [showModalProduk, setShowModalProduk] = useState(false);
  const [modalModeProduk, setModalModeProduk] = useState<'add' | 'edit' | 'detail'>('add');
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [namaProduk, setNamaProduk] = useState('');
  const [deskripsiProduk, setDeskripsiProduk] = useState('');
  const [gambarProduk, setGambarProduk] = useState<File | null>(null);
  const [isSubmittingProduk, setIsSubmittingProduk] = useState(false);

  // --- STATE SIDEBAR & NAVIGASI ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  useEffect(() => {
    fetchPotensi();
    fetchProduk();
  }, []);

  // --- FETCH DATA ---
  async function fetchPotensi() {
    const { data } = await supabase.from('potensi_desa').select('*').order('id', { ascending: false });
    if (data) setPotensiList(data);
  }

  async function fetchProduk() {
    const { data } = await supabase.from('produk_unggulan').select('*').order('id', { ascending: false });
    if (data) setProdukList(data);
  }

  // --- LOGIKA MODAL POTENSI ---
  const openAddPotensiModal = () => {
    setModalModePotensi('add');
    setSelectedPotensiId(null);
    setNamaPotensi('');
    setKategoriPotensi('');
    setKategoriBaru('');
    setShowModalPotensi(true);
  };

  const openEditPotensiModal = (item: Potensi) => {
    setModalModePotensi('edit');
    setSelectedPotensiId(item.id);
    setNamaPotensi(item.nama_potensi);
    
    const isStandardKategori = ['UMKM', 'Pertanian', 'Peternakan'].includes(item.kategori);
    if (isStandardKategori) {
      setKategoriPotensi(item.kategori);
      setKategoriBaru('');
    } else {
      setKategoriPotensi('Lainnya');
      setKategoriBaru(item.kategori);
    }
    setShowModalPotensi(true);
  };

  const handleSavePotensi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPotensi(true);

    const kategoriAkhir = kategoriPotensi === 'Lainnya' ? kategoriBaru : kategoriPotensi;
    if (!kategoriAkhir.trim()) {
      alert("Harap pilih atau masukkan kategori.");
      setIsSubmittingPotensi(false);
      return;
    }

    if (modalModePotensi === 'add') {
      const { error } = await supabase.from('potensi_desa').insert([{ nama_potensi: namaPotensi, kategori: kategoriAkhir }]);
      if (error) alert('Gagal menambah: ' + error.message);
      else alert('Potensi berhasil ditambahkan!');
    } else {
      const { error } = await supabase.from('potensi_desa').update({ nama_potensi: namaPotensi, kategori: kategoriAkhir }).eq('id', selectedPotensiId);
      if (error) alert('Gagal memperbarui: ' + error.message);
      else alert('Potensi berhasil diperbarui!');
    }

    setIsSubmittingPotensi(false);
    setShowModalPotensi(false);
    fetchPotensi();
  };

  const handleDeletePotensi = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus potensi ini?')) {
      await supabase.from('potensi_desa').delete().eq('id', id);
      fetchPotensi();
    }
  };

  // --- LOGIKA MODAL PRODUK ---
  const openAddProdukModal = () => {
    setModalModeProduk('add');
    setSelectedProduk(null);
    setNamaProduk('');
    setDeskripsiProduk('');
    setGambarProduk(null);
    setShowModalProduk(true);
  };

  const openEditProdukModal = (item: Produk) => {
    setModalModeProduk('edit');
    setSelectedProduk(item);
    setNamaProduk(item.nama_produk);
    setDeskripsiProduk(item.deskripsi);
    setGambarProduk(null);
    setShowModalProduk(true);
  };

  const openDetailProdukModal = (item: Produk) => {
    setModalModeProduk('detail');
    setSelectedProduk(item);
    setShowModalProduk(true);
  };

  const handleSaveProduk = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduk(true);

    let imageUrl = selectedProduk?.gambar_url || null;

    // Jika ada file gambar baru diunggah
    if (gambarProduk) {
      const fileExt = gambarProduk.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('produk').upload(filePath, gambarProduk);
      if (uploadError) {
        alert('Gagal mengunggah gambar: ' + uploadError.message);
        setIsSubmittingProduk(false);
        return;
      }

      // Hapus gambar lama jika dalam mode edit dan ada gambar lama
      if (modalModeProduk === 'edit' && selectedProduk?.gambar_url) {
        const oldPathMatches = selectedProduk.gambar_url.match(/public\/.*$/);
        if (oldPathMatches && oldPathMatches[0]) {
          await supabase.storage.from('produk').remove([oldPathMatches[0]]);
        }
      }

      const { data: publicUrlData } = supabase.storage.from('produk').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    if (modalModeProduk === 'add') {
      const { error } = await supabase.from('produk_unggulan').insert([{ nama_produk: namaProduk, deskripsi: deskripsiProduk, gambar_url: imageUrl }]);
      if (error) alert('Gagal menambah: ' + error.message);
      else alert('Produk berhasil ditambahkan!');
    } else if (modalModeProduk === 'edit' && selectedProduk) {
      const { error } = await supabase.from('produk_unggulan').update({ nama_produk: namaProduk, deskripsi: deskripsiProduk, gambar_url: imageUrl }).eq('id', selectedProduk.id);
      if (error) alert('Gagal memperbarui: ' + error.message);
      else alert('Produk berhasil diperbarui!');
    }

    setIsSubmittingProduk(false);
    setShowModalProduk(false);
    fetchProduk();
  };

  const handleDeleteProduk = async (id: number, gambarUrl: string | null) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      if (gambarUrl) {
        const filePathMatches = gambarUrl.match(/public\/.*$/);
        if (filePathMatches && filePathMatches[0]) {
          await supabase.storage.from('produk').remove([filePathMatches[0]]);
        }
      }
      await supabase.from('produk_unggulan').delete().eq('id', id);
      fetchProduk();
    }
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: "Poppins", sans-serif; background-color: #f8f9fa; overflow-x: hidden; margin: 0; }
        #wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        #sidebar { width: 260px; background-color: #538863; color: white; display: flex; flex-direction: column; flex-shrink: 0; transition: all 0.3s ease-in-out; z-index: 1050; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-link { color: #e2e8f0; padding: 12px 20px; font-weight: 500; transition: 0.2s; text-decoration: none; display: block; cursor: pointer; }
        .nav-link:hover, .nav-link.active { color: #ffffff; background-color: rgba(255, 255, 255, 0.1); font-weight: 600; }
        .sub-menu { border-left: 2px solid rgba(255, 255, 255, 0.3); margin-left: 30px; padding-left: 0; list-style: none; overflow: hidden; transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; }
        .sub-menu .nav-link { padding: 8px 15px; font-size: 0.9rem; font-weight: 400; }
        .sub-menu .nav-link::before { content: "— "; color: rgba(255, 255, 255, 0.5); }
        #content-wrapper { flex-grow: 1; display: flex; flex-direction: column; overflow-y: auto; width: 100%; }
        .top-navbar { background-color: #ffffff; height: 70px; min-height: 70px; flex-shrink: 0; border-bottom: 1px solid #dee2e6; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
        .chevron-icon { transition: transform 0.3s ease-in-out; }
        .submenu-open .chevron-icon { transform: rotate(90deg); }
        #sidebar-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.4); z-index: 1040; transition: opacity 0.3s ease-in-out; }
        
        @media (max-width: 991.98px) {
            #sidebar { position: fixed; top: 0; left: -260px; height: 100vh; }
            #sidebar.show { left: 0; }
            #sidebar-overlay.show { display: block; }
        }
      ` }} />

      <div id="wrapper">
        <div id="sidebar-overlay" className={isSidebarOpen ? "show" : ""} onClick={() => setIsSidebarOpen(false)}></div>

        {/* SIDEBAR */}
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
              <li className="nav-item"><Link href="/admin/fasilitas" className="nav-link">Kelola Fasilitas</Link></li>
              <li className="nav-item"><Link href="/admin/potensi" className="nav-link active">Kelola Potensi</Link></li>
              
              <li className="nav-item">
                <a onClick={() => setIsSubmenuOpen(!isSubmenuOpen)} className={`nav-link d-flex justify-content-between align-items-center text-white ${isSubmenuOpen ? "submenu-open" : ""}`}>
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

        {/* MAIN CONTENT */}
        <div id="content-wrapper">
          <header className="top-navbar">
            <button className="btn btn-light border d-lg-none" onClick={() => setIsSidebarOpen(true)}>
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="d-flex align-items-center text-end ms-auto">
              <div className="me-2 me-sm-3">
                <span className="d-block text-muted" style={{ fontSize: "0.8rem", lineHeight: "1" }}>Halo,</span>
                <strong className="d-block text-dark" style={{ fontSize: "0.95rem", lineHeight: "1.2" }}>Admin</strong>
              </div>
              <i className="bi bi-person-circle text-dark" style={{ fontSize: "2.2rem" }}></i>
            </div>
          </header>

          <main className="p-3 p-md-4 flex-grow-1">
            <h3 className="fw-bold mb-4 fs-4 fs-md-3">Kelola Potensi & Produk Desa</h3>

            {/* SECTION 1: POTENSI DESA */}
            <div className="card shadow-sm border-0 rounded-3 mb-5">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                <h5 className="fw-bold text-success m-0">1. Potensi Unggulan Desa</h5>
                <button onClick={openAddPotensiModal} className="btn btn-success btn-sm fw-medium">
                  <i className="bi bi-plus-lg me-1"></i> Tambah Potensi
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">No</th>
                        <th>Nama Potensi</th>
                        <th>Kategori</th>
                        <th className="text-center" style={{ width: '150px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {potensiList.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4 text-muted">Belum ada data potensi</td></tr>
                      ) : (
                        potensiList.map((item, idx) => (
                          <tr key={item.id}>
                            <td className="ps-4">{idx + 1}</td>
                            <td><strong className="text-dark">{item.nama_potensi}</strong></td>
                            <td><span className="badge bg-success bg-opacity-75 text-white">{item.kategori}</span></td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-warning text-white me-2" data-bs-toggle="modal" data-bs-target="#modalPeta" onClick={() => openEditPotensiModal(item)}>
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeletePotensi(item.id)}>
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

            {/* SECTION 2: PRODUK UNGGULAN */}
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                <h5 className="fw-bold text-success m-0">2. Produk Unggulan Desa</h5>
                <button onClick={openAddProdukModal} className="btn btn-success btn-sm fw-medium">
                  <i className="bi bi-plus-lg me-1"></i> Tambah Produk
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">No</th>
                        <th>Gambar</th>
                        <th>Nama Produk</th>
                        <th className="text-center" style={{ width: '200px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produkList.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4 text-muted">Belum ada data produk unggulan</td></tr>
                      ) : (
                        produkList.map((item, idx) => (
                          <tr key={item.id}>
                            <td className="ps-4">{idx + 1}</td>
                            <td>
                              {item.gambar_url ? (
                                <img src={item.gambar_url} alt={item.nama_produk} className="rounded" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                              ) : (
                                <div className="bg-secondary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                  <i className="bi bi-image text-muted"></i>
                                </div>
                              )}
                            </td>
                            <td><strong className="text-dark">{item.nama_produk}</strong></td>
                            <td className="text-center">
                              <button onClick={() => openDetailProdukModal(item)} className="btn btn-sm btn-outline-info me-2" title="Detail">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-warning text-white me-2" data-bs-toggle="modal" data-bs-target="#modalPeta" onClick={() => openEditProdukModal(item)}>
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduk(item.id, item.gambar_url)}>
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
          </main>
        </div>
      </div>

      {/* --- MODAL POTENSI (ADD / EDIT) --- */}
      {showModalPotensi && (
        <>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-bold">{modalModePotensi === 'add' ? 'Tambah Potensi Desa' : 'Edit Potensi Desa'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModalPotensi(false)}></button>
                </div>
                <form onSubmit={handleSavePotensi}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Potensi</label>
                      <input type="text" className="form-control" value={namaPotensi} onChange={(e) => setNamaPotensi(e.target.value)} placeholder="Contoh: Keripik Singkong" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Kategori Potensi</label>
                      <select className="form-select" value={kategoriPotensi} onChange={(e) => setKategoriPotensi(e.target.value)} required>
                        <option value="" disabled>-- Pilih Kategori --</option>
                        <option value="UMKM">UMKM</option>
                        <option value="Pertanian">Pertanian</option>
                        <option value="Peternakan">Peternakan</option>
                        <option value="Lainnya">-- Kategori Lainnya --</option>
                      </select>
                    </div>
                    {kategoriPotensi === 'Lainnya' && (
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Kategori Baru</label>
                        <input type="text" className="form-control" value={kategoriBaru} onChange={(e) => setKategoriBaru(e.target.value)} placeholder="Ketik kategori..." required />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer border-top-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModalPotensi(false)}>Batal</button>
                    <button type="submit" className="btn btn-success px-4" disabled={isSubmittingPotensi}>
                      {isSubmittingPotensi ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModalPotensi(false)}></div>
        </>
      )}

      {/* --- MODAL PRODUK (ADD / EDIT) --- */}
      {showModalProduk && modalModeProduk !== 'detail' && (
        <>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-bold">{modalModeProduk === 'add' ? 'Tambah Produk Unggulan' : 'Edit Produk Unggulan'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModalProduk(false)}></button>
                </div>
                <form onSubmit={handleSaveProduk}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Produk</label>
                      <input type="text" className="form-control" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} placeholder="Contoh: Durian Bawor" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Deskripsi</label>
                      <textarea className="form-control" rows={3} value={deskripsiProduk} onChange={(e) => setDeskripsiProduk(e.target.value)} placeholder="Deskripsi produk..." required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Gambar Produk</label>
                      {modalModeProduk === 'edit' && selectedProduk?.gambar_url && (
                        <div className="mb-2 d-flex align-items-center gap-2">
                          <img src={selectedProduk.gambar_url} alt="Gambar Lama" className="rounded border" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                          <small className="text-muted">Gambar saat ini. Unggah file baru untuk mengganti.</small>
                        </div>
                      )}
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => setGambarProduk(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                  <div className="modal-footer border-top-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModalProduk(false)}>Batal</button>
                    <button type="submit" className="btn btn-success px-4" disabled={isSubmittingProduk}>
                      {isSubmittingProduk ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModalProduk(false)}></div>
        </>
      )}

      {/* --- MODAL PRODUK (DETAIL) --- */}
      {showModalProduk && modalModeProduk === 'detail' && selectedProduk && (
        <>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-bold">Detail Produk Unggulan</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModalProduk(false)}></button>
                </div>
                <div className="modal-body text-center p-4">
                  {selectedProduk.gambar_url ? (
                    <img src={selectedProduk.gambar_url} alt={selectedProduk.nama_produk} className="img-fluid rounded mb-3 border" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div className="bg-secondary bg-opacity-10 rounded d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                      <i className="bi bi-image text-muted fs-1"></i>
                    </div>
                  )}
                  <h4 className="fw-bold text-dark">{selectedProduk.nama_produk}</h4>
                  <p className="text-muted mt-2 text-start bg-light p-3 rounded">{selectedProduk.deskripsi}</p>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-secondary w-100" onClick={() => setShowModalProduk(false)}>Tutup</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModalProduk(false)}></div>
        </>
      )}
    </>
  );
}
