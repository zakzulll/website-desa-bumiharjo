"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // Sesuaikan path jika berbeda
import Link from "next/link";

export default function AdminProfil() {
  // 1. STATE UNTUK FORM DATA
  const [formData, setFormData] = useState({
    sejarah: "",
    visi: "",
    misi: "",
    jml_penduduk: 0,
    jml_kk: 0,
    luas_wilayah: "",
    jml_dukuh: 0,
    kades: "",
    sekdes: "",
    kasie_pem: "",
    kasie_kes: "",
    kaur_per: "",
    kaur_keu: "",
    kadus_1: "",
    kadus_2: "",
  });

  // STATE UNTUK LOADING & UI INTERAKTIF
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingOrg, setLoadingOrg] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // 2. AMBIL DATA DARI SUPABASE SAAT HALAMAN DIMUAT
  useEffect(() => {
    async function loadProfilData() {
      const { data, error } = await supabase
        .from("profil_desa")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Gagal memuat data:", error);
        return;
      }

      if (data) {
        setFormData({
          sejarah: data.sejarah || "",
          visi: data.visi || "",
          misi: data.misi || "",
          jml_penduduk: data.jml_penduduk || 0,
          jml_kk: data.jml_kk || 0,
          luas_wilayah: data.luas_wilayah || "",
          jml_dukuh: data.jml_dukuh || 0,
          kades: data.kades || "",
          sekdes: data.sekdes || "",
          kasie_pem: data.kasie_pem || "",
          kasie_kes: data.kasie_kes || "",
          kaur_per: data.kaur_per || "",
          kaur_keu: data.kaur_keu || "",
          kadus_1: data.kadus_1 || "",
          kadus_2: data.kadus_2 || "",
        });
      }
    }

    loadProfilData();

    // Logika Mengingat Status Submenu[cite: 5]
    const statusMenu = localStorage.getItem("ingatanMenuInformasi");
    if (statusMenu === "terbuka") setIsSubmenuOpen(true);
  }, []);

  // 3. HANDLER PERUBAHAN INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. HANDLER SIMPAN PROFIL[cite: 6]
  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfil(true);

    const payload = {
      id: 1,
      sejarah: formData.sejarah,
      visi: formData.visi,
      misi: formData.misi,
      jml_penduduk: Number(formData.jml_penduduk) || 0,
      jml_kk: Number(formData.jml_kk) || 0,
      luas_wilayah: formData.luas_wilayah,
      jml_dukuh: Number(formData.jml_dukuh) || 0,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profil_desa").upsert(payload);

    if (!error) {
      alert("Data Profil berhasil diperbarui!");
    } else {
      alert("Gagal menyimpan: " + error.message);
    }
    setLoadingProfil(false);
  };

  // 5. HANDLER SIMPAN ORGANISASI[cite: 6]
  const handleSaveOrganisasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingOrg(true);

    const payload = {
      id: 1,
      kades: formData.kades,
      sekdes: formData.sekdes,
      kasie_pem: formData.kasie_pem,
      kasie_kes: formData.kasie_kes,
      kaur_per: formData.kaur_per,
      kaur_keu: formData.kaur_keu,
      kadus_1: formData.kadus_1,
      kadus_2: formData.kadus_2,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profil_desa").upsert(payload);

    if (!error) {
      alert("Struktur Organisasi berhasil diperbarui!");
    } else {
      alert("Gagal menyimpan: " + error.message);
    }
    setLoadingOrg(false);
  };

  // Handler Submenu Toggle[cite: 5]
  const toggleSubmenu = () => {
    const newState = !isSubmenuOpen;
    setIsSubmenuOpen(newState);
    localStorage.setItem("ingatanMenuInformasi", newState ? "terbuka" : "tertutup");
  };

  return (
    <>
      {/* LOAD BOOTSTRAP & ICONS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* CSS KHUSUS ADMIN[cite: 4] */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: "Poppins", sans-serif; background-color: #f8f9fa; overflow-x: hidden; margin: 0; }
        #wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        #sidebar { width: 260px; background-color: #538863; color: white; display: flex; flex-direction: column; flex-shrink: 0; transition: all 0.3s ease-in-out; z-index: 1050; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-link { color: #e2e8f0; padding: 12px 20px; font-weight: 500; transition: 0.2s; text-decoration: none; display: block; }
        .nav-link:hover, .nav-link.active { color: #ffffff; background-color: rgba(255, 255, 255, 0.1); font-weight: 600; }
        .sub-menu { border-left: 2px solid rgba(255, 255, 255, 0.3); margin-left: 30px; padding-left: 0; list-style: none; overflow: hidden; transition: max-height 0.3s ease; }
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
        {/* OVERLAY UNTUK MOBILE[cite: 4, 5] */}
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
              <li className="nav-item"><Link href="/admin/profil" className="nav-link active">Manajemen Profil</Link></li>
              <li className="nav-item"><Link href="/admin/peta" className="nav-link">Peta & Informasi Wilayah</Link></li>
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

        {/* KONTEN UTAMA[cite: 6] */}
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
            <h3 className="fw-bold mb-4 fs-4 fs-md-3">Manajemen Profil Desa</h3>
            
            {/* FORM PROFIL UMUM[cite: 6] */}
            <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4 mb-4">
              <form onSubmit={handleSaveProfil}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Sejarah Desa</label>
                  <textarea name="sejarah" value={formData.sejarah} onChange={handleChange} className="form-control" rows={5} placeholder="Tuliskan sejarah desa..."></textarea>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <label className="form-label fw-semibold">Visi Desa</label>
                    <textarea name="visi" value={formData.visi} onChange={handleChange} className="form-control" rows={4} placeholder="Visi desa..."></textarea>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <label className="form-label fw-semibold">Misi Desa</label>
                    <textarea name="misi" value={formData.misi} onChange={handleChange} className="form-control" rows={4} placeholder="Gunakan format list misal: 1. Misi pertama..."></textarea>
                  </div>
                </div>

                <h6 className="fw-bold mb-3 mt-2 border-bottom pb-2">Data Umum Wilayah</h6>
                <div className="row">
                  <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-md-4">
                    <label className="form-label fw-semibold">Jumlah Penduduk</label>
                    <input type="number" name="jml_penduduk" value={formData.jml_penduduk} onChange={handleChange} className="form-control" placeholder="Misal: 2199" />
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-md-4">
                    <label className="form-label fw-semibold">Jumlah KK</label>
                    <input type="number" name="jml_kk" value={formData.jml_kk} onChange={handleChange} className="form-control" placeholder="Misal: 708" />
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-md-4">
                    <label className="form-label fw-semibold">Luas Wilayah</label>
                    <input type="text" name="luas_wilayah" value={formData.luas_wilayah} onChange={handleChange} className="form-control" placeholder="Misal: 351 Ha" />
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-md-4">
                    <label className="form-label fw-semibold">Jumlah Dukuh</label>
                    <input type="number" name="jml_dukuh" value={formData.jml_dukuh} onChange={handleChange} className="form-control" placeholder="Misal: 10" />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-success px-4 fw-medium" disabled={loadingProfil} style={{ backgroundColor: "#538863", border: "none" }}>
                    {loadingProfil ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-save me-2"></i>}
                    {loadingProfil ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>

            {/* FORM STRUKTUR ORGANISASI[cite: 6] */}
            <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2 fs-6 fs-md-5">Nama Pejabat Struktur Organisasi</h5>
              <form onSubmit={handleSaveOrganisasi}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kepala Desa</label>
                    <input type="text" name="kades" value={formData.kades} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Sekretaris Desa</label>
                    <input type="text" name="sekdes" value={formData.sekdes} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kasie Pemerintahan</label>
                    <input type="text" name="kasie_pem" value={formData.kasie_pem} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kasie Kesejahteraan & Pelayanan</label>
                    <input type="text" name="kasie_kes" value={formData.kasie_kes} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kaur Perencanaan, TU & Umum</label>
                    <input type="text" name="kaur_per" value={formData.kaur_per} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kaur Keuangan</label>
                    <input type="text" name="kaur_keu" value={formData.kaur_keu} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kepala Dusun 1</label>
                    <input type="text" name="kadus_1" value={formData.kadus_1} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Kepala Dusun 2</label>
                    <input type="text" name="kadus_2" value={formData.kadus_2} onChange={handleChange} className="form-control" />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-success px-4 fw-medium" disabled={loadingOrg} style={{ backgroundColor: "#538863", border: "none" }}>
                    {loadingOrg ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-person-lines-fill me-2"></i>}
                    {loadingOrg ? "Menyimpan..." : "Simpan Organisasi"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}