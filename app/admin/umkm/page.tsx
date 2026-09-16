"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Script from "next/script";
import Link from "next/link";

interface UMKM {
  id: number;
  nama_usaha: string;
  pemilik: string;
  kategori: string;
  kontak: string;
  deskripsi: string;
  foto_url: string;
}

export default function AdminUMKMPage() {
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(true);

  // Form State
  const [namaUsaha, setNamaUsaha] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [kategori, setKategori] = useState("");
  const [kontak, setKontak] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    fetchUMKM();
  }, []);

  async function fetchUMKM() {
    setLoading(true);
    const { data, error } = await supabase.from("umkm_desa").select("*").order("id", { ascending: false });
    if (!error && data) setUmkmList(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foto) return alert("Pilih foto terlebih dahulu!");
    setSubmitting(true);

    try {
      // 1. Upload Foto ke Supabase Storage
      const fileExt = foto.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('umkm_images')
        .upload(fileName, foto);

      if (uploadError) throw uploadError;

      // 2. Dapatkan Public URL
      const { data: { publicUrl } } = supabase.storage.from('umkm_images').getPublicUrl(fileName);

      // 3. Simpan data ke tabel umkm_desa
      const { error: insertError } = await supabase.from("umkm_desa").insert([
        { nama_usaha: namaUsaha, pemilik, kategori, kontak, deskripsi, foto_url: publicUrl }
      ]);

      if (insertError) throw insertError;

      alert("Data UMKM berhasil ditambahkan!");
      // Reset Form
      setNamaUsaha(""); setPemilik(""); setKategori(""); setKontak(""); setDeskripsi(""); setFoto(null);
      (document.getElementById("inputFotoUmkm") as HTMLInputElement).value = "";
      fetchUMKM();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus UMKM ini?")) return;
    const { error } = await supabase.from("umkm_desa").delete().eq("id", id);
    if (!error) {
      alert("UMKM berhasil dihapus.");
      fetchUMKM();
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  }

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

        <nav id="sidebar" className={isSidebarOpen ? "show" : ""}>
          <div className="sidebar-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="/assets/img/logo-klaten.png" alt="Logo" width="40" height="50" className="me-2 me-sm-3" />
              <div>
                <h6 className="mb-0 fw-bold lh-1" style={{ fontSize: "1rem" }}>DESA BUMIHARJO</h6>
                <small style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>KECAMATAN KEMALANG</small>
              </div>
            </div>
            <button className="btn text-white d-lg-none p-0 fs-4" onClick={() => setIsSidebarOpen(false)}><i className="bi bi-x-lg"></i></button>
          </div>

          <div className="flex-grow-1 overflow-auto mt-3">
            <ul className="nav flex-column">
              <li className="nav-item"><Link href="/admin/dashboard" className="nav-link">Dashboard</Link></li>
              <li className="nav-item"><Link href="/admin/profil" className="nav-link">Manajemen Profil</Link></li>
              <li className="nav-item"><Link href="/admin/peta" className="nav-link">Peta & Lokasi</Link></li>
              <li className="nav-item"><Link href="/admin/fasilitas" className="nav-link">Kelola Fasilitas</Link></li>
              <li className="nav-item"><Link href="/admin/potensi" className="nav-link">Kelola Potensi</Link></li>
              <li className="nav-item">
                <a onClick={(e) => { e.preventDefault(); setIsSubmenuOpen(!isSubmenuOpen); }} className={`nav-link d-flex justify-content-between align-items-center text-white ${isSubmenuOpen ? "submenu-open" : ""}`} style={{ cursor: "pointer" }}>
                  Pusat Informasi <i className="bi bi-chevron-right chevron-icon" style={{ fontSize: "0.8rem", color: "white" }}></i>
                </a>
                <ul className="sub-menu" style={{ maxHeight: isSubmenuOpen ? "200px" : "0", opacity: isSubmenuOpen ? 1 : 0 }}>
                  <li><Link href="/admin/umkm" className="nav-link active">UMKM</Link></li>
                  <li><Link href="/admin/artikel" className="nav-link">Artikel & Galeri</Link></li>
                  <li><Link href="/admin/apb" className="nav-link">APB Desa</Link></li>
                </ul>
              </li>
              <li className="nav-item"><Link href="/admin/kontak" className="nav-link">Kontak</Link></li>
            </ul>
          </div>
          <div className="mt-auto p-3 mb-2">
            <Link href="/login" className="nav-link text-white fw-bold"><i className="bi bi-box-arrow-right me-2"></i>Keluar</Link>
          </div>
        </nav>

        <div id="content-wrapper">
          <header className="top-navbar">
            <button className="btn btn-light border d-lg-none" onClick={() => setIsSidebarOpen(true)}><i className="bi bi-list fs-4"></i></button>
            <div className="d-flex align-items-center text-end ms-auto">
              <div className="me-2 me-sm-3">
                <span className="d-block text-muted" style={{ fontSize: "0.8rem", lineHeight: 1 }}>Halo,</span>
                <strong className="d-block text-dark" style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>Admin</strong>
              </div>
              <i className="bi bi-person-circle text-dark" style={{ fontSize: "2.2rem" }}></i>
            </div>
          </header>

          <main className="p-3 p-md-4 flex-grow-1">
            <h3 className="fw-bold mb-4">Kelola UMKM Desa</h3>
            <div className="row">
              <div className="col-lg-5 mb-4">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4 sticky-top" style={{ top: "20px" }}>
                  <h5 className="fw-bold mb-3">Tambah Data UMKM</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Usaha / Produk</label>
                      <input type="text" className="form-control" value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Pemilik</label>
                      <input type="text" className="form-control" value={pemilik} onChange={(e) => setPemilik(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Kategori</label>
                      <select className="form-select" value={kategori} onChange={(e) => setKategori(e.target.value)} required>
                        <option value="" disabled>-- Pilih Kategori --</option>
                        <option value="Kuliner">Makanan & Minuman (Kuliner)</option>
                        <option value="Kerajinan">Kriya & Kerajinan</option>
                        <option value="Fashion">Pakaian & Fashion</option>
                        <option value="Jasa">Jasa & Layanan</option>
                        <option value="Toko">Toko Kelontong / Grosir</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nomor WhatsApp (Awali 62)</label>
                      <input type="number" className="form-control" value={kontak} onChange={(e) => setKontak(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Deskripsi Produk/Usaha</label>
                      <textarea className="form-control" rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Unggah Foto Produk/Toko</label>
                      <input className="form-control" type="file" id="inputFotoUmkm" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] || null)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-medium" disabled={submitting} style={{ backgroundColor: "#0d6efd", border: "none" }}>
                      {submitting ? "Menyimpan..." : <><i className="bi bi-plus-circle me-2"></i>Tambah Data UMKM</>}
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4">
                  <h5 className="fw-bold mb-3">Daftar UMKM Terdaftar</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Foto</th>
                          <th>Informasi Usaha</th>
                          <th>Kategori</th>
                          <th className="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={4} className="text-center text-muted">Memuat data...</td></tr>
                        ) : umkmList.length === 0 ? (
                          <tr><td colSpan={4} className="text-center text-muted">Belum ada data UMKM.</td></tr>
                        ) : (
                          umkmList.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <img src={item.foto_url} alt={item.nama_usaha} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                              </td>
                              <td>
                                <strong className="d-block">{item.nama_usaha}</strong>
                                <small className="text-muted">Pemilik: {item.pemilik}</small>
                              </td>
                              <td><span className="badge bg-secondary">{item.kategori}</span></td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Hapus</button>
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
    </>
  );
}