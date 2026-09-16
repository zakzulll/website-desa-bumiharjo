"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

interface PetaItem {
  id: number;
  judul: string;
  deskripsi: string;
  gambar_url: string;
}

export default function AdminPetaPage() {
  // 1. PERBAIKAN: Semua State Hooks dipindahkan ke DALAM komponen
  const [petaList, setPetaList] = useState<PetaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  // State Form Peta (Tambah / Edit)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [judulPeta, setJudulPeta] = useState<string>("");
  const [deskripsiPeta, setDeskripsiPeta] = useState<string>("");
  const [fileGambar, setFileGambar] = useState<File | null>(null);

  // State Batas Wilayah
  const [batas, setBatas] = useState({
    utara: "",
    selatan: "",
    timur: "",
    barat: "",
  });

  // State UI Sidebar & Submenu Navigasi
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  // 2. PERBAIKAN: Fungsi toggleSubmenu dideklarasikan secara eksplisit
  const toggleSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmenuOpen((prev) => !prev);
  };

  async function fetchData() {
    setLoading(true);

    // Fetch Data Peta Tematik
    const { data: dataPeta } = await supabase
      .from("peta")
      .select("*")
      .order("id", { ascending: true });
    if (dataPeta) setPetaList(dataPeta);

    // Fetch Data Batas Wilayah
    const { data: dataBatas } = await supabase
      .from("batas_wilayah")
      .select("*")
      .eq("id", 1)
      .single();

    if (dataBatas) {
      setBatas({
        utara: dataBatas.utara,
        selatan: dataBatas.selatan,
        timur: dataBatas.timur,
        barat: dataBatas.barat,
      });
    }

    setLoading(false);
  }

  // Unggah Gambar ke Supabase Storage
  async function uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `peta/${fileName}`;

    const { error } = await supabase.storage.from("peta-images").upload(filePath, file);
    if (error) {
      alert("Gagal mengunggah gambar: " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("peta-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Simpan / Edit Peta
  async function handleSavePeta(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = "";

    if (fileGambar) {
      const uploadedUrl = await uploadImage(fileGambar);
      if (!uploadedUrl) {
        setUploading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    if (editingId) {
      // Proses Update Data
      const payload: Partial<PetaItem> = { judul: judulPeta, deskripsi: deskripsiPeta };
      if (imageUrl) payload.gambar_url = imageUrl;

      const { error } = await supabase.from("peta").update(payload).eq("id", editingId);
      if (!error) alert("Peta berhasil diperbarui!");
    } else {
      // Proses Insert Data Baru
      if (!imageUrl) {
        alert("Harap pilih gambar peta.");
        setUploading(false);
        return;
      }
      const { error } = await supabase.from("peta").insert([
        { judul: judulPeta, deskripsi: deskripsiPeta, gambar_url: imageUrl },
      ]);
      if (!error) alert("Peta berhasil ditambahkan!");
    }

    resetFormPeta();
    fetchData();
    setUploading(false);
  }

  // Handle Klik Edit
  function handleEditClick(item: PetaItem) {
    setEditingId(item.id);
    setJudulPeta(item.judul);
    setDeskripsiPeta(item.deskripsi);
  }

  // Hapus Data Peta
  async function handleDeletePeta(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus peta ini?")) return;
    const { error } = await supabase.from("peta").delete().eq("id", id);
    if (!error) {
      alert("Peta berhasil dihapus.");
      fetchData();
    }
  }

  function resetFormPeta() {
    setEditingId(null);
    setJudulPeta("");
    setDeskripsiPeta("");
    setFileGambar(null);
  }

  // Simpan Batas Wilayah
  async function handleSaveBatas(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("batas_wilayah").update(batas).eq("id", 1);
    if (!error) {
      alert("Batas wilayah berhasil diperbarui!");
    } else {
      alert("Gagal memperbarui batas wilayah: " + error.message);
    }
  }

  return (
    <>
      {/* BOOTSTRAP CSS & ICONS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* 3. PERBAIKAN: Memuat JavaScript Bootstrap untuk Mengaktifkan Interaksi Modal */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
        strategy="lazyOnload" 
      />

      {/* STYLES KHUSUS ADMIN */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: "Poppins", sans-serif; background-color: #f8f9fa; overflow-x: hidden; margin: 0; }
        #wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        #sidebar { width: 260px; background-color: #538863; color: white; display: flex; flex-direction: column; flex-shrink: 0; transition: all 0.3s ease-in-out; z-index: 1050; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-link { color: #e2e8f0; padding: 12px 20px; font-weight: 500; transition: 0.2s; text-decoration: none; display: block; }
        .nav-link:hover, .nav-link.active { color: #ffffff; background-color: rgba(255, 255, 255, 0.1); font-weight: 600; }
        .sub-menu { border-left: 2px solid rgba(255, 255, 255, 0.3); margin-left: 30px; padding-left: 0; list-style: none; overflow: hidden; transition: all 0.3s ease; }
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
      `}} />

      <div id="wrapper">
        {/* OVERLAY UNTUK LAYAR MOBILE */}
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
              <li className="nav-item"><Link href="/admin/peta" className="nav-link active">Peta & Informasi Wilayah</Link></li>
              <li className="nav-item"><Link href="/admin/fasilitas" className="nav-link">Kelola Fasilitas</Link></li>
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
              <li className="nav-item"><Link href="/admin/kontak" className="nav-link">Kontak</Link></li>
            </ul>
          </div>

          <div className="mt-auto p-3 mb-2">
            <Link href="/login" className="nav-link text-white fw-bold">
              <i className="bi bi-box-arrow-right me-2"></i>Keluar
            </Link>
          </div>
        </nav>

        {/* KONTEN UTAMA */}
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
            <h3 className="fw-bold mb-4 fs-4 fs-md-3">Manajemen Peta & Informasi Wilayah</h3>

            {/* DAFTAR PETA TABLE */}
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Daftar Peta Tematik</h5>
                <button className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalPeta" onClick={resetFormPeta}>
                  + Tambah Peta
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">No</th>
                        <th>Judul Peta</th>
                        <th>Deskripsi Singkat</th>
                        <th>Preview Gambar</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>
                      ) : petaList.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-4">Belum ada data peta.</td></tr>
                      ) : (
                        petaList.map((item, index) => (
                          <tr key={item.id}>
                            <td className="ps-4">{index + 1}</td>
                            <td className="fw-semibold">{item.judul}</td>
                            <td className="text-muted" style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.deskripsi}
                            </td>
                            <td>
                              <img src={item.gambar_url} alt={item.judul} className="rounded border" style={{ height: "50px", width: "80px", objectFit: "cover" }} />
                            </td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-warning text-white me-2" data-bs-toggle="modal" data-bs-target="#modalPeta" onClick={() => handleEditClick(item)}>
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeletePeta(item.id)}>
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

            {/* MANAJEMEN BATAS WILAYAH */}
            <div className="card shadow-sm border-0 rounded-3 p-4">
              <h5 className="fw-bold mb-3">Manajemen Batas Wilayah</h5>
              <form onSubmit={handleSaveBatas}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Batas Utara</label>
                    <input type="text" className="form-control" value={batas.utara} onChange={(e) => setBatas({ ...batas, utara: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Batas Selatan</label>
                    <input type="text" className="form-control" value={batas.selatan} onChange={(e) => setBatas({ ...batas, selatan: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Batas Timur</label>
                    <input type="text" className="form-control" value={batas.timur} onChange={(e) => setBatas({ ...batas, timur: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Batas Barat</label>
                    <input type="text" className="form-control" value={batas.barat} onChange={(e) => setBatas({ ...batas, barat: e.target.value })} required />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-4">
                  <button type="submit" className="btn btn-success px-4">Simpan Batas Wilayah</button>
                </div>
              </form>
            </div>

            {/* MODAL FORM PETA */}
            <div className="modal fade" id="modalPeta" tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">{editingId ? "Edit Peta" : "Tambah Peta"}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <form onSubmit={handleSavePeta}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Judul Peta</label>
                        <input type="text" className="form-control" value={judulPeta} onChange={(e) => setJudulPeta(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Deskripsi</label>
                        <textarea className="form-control" rows={3} value={deskripsiPeta} onChange={(e) => setDeskripsiPeta(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Gambar Peta</label>
                        <input className="form-control" type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => setFileGambar(e.target.files?.[0] || null)} required={!editingId} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                      <button type="submit" className="btn btn-success" disabled={uploading}>
                        {uploading ? "Menyimpan..." : "Simpan Peta"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}