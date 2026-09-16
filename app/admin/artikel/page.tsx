"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Script from "next/script";
import Link from "next/link";

interface Artikel {
  id: number;
  judul: string;
  kategori: string;
  penulis: string;
  konten: string | null;
  gambar_url: string;
}

export default function AdminArtikelPage() {
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(true);

  // Form State
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [penulis, setPenulis] = useState("Admin Desa");
  const [konten, setKonten] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    fetchArtikel();
  }, []);

  async function fetchArtikel() {
    setLoading(true);
    const { data, error } = await supabase.from("artikel").select("*").order("id", { ascending: false });
    if (!error && data) setArtikelList(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foto) return alert("Pilih gambar terlebih dahulu!");
    setSubmitting(true);

    try {
      // 1. Upload Gambar ke Storage
      const fileExt = foto.name.split('.').pop();
      const fileName = `artikel-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gambar_artikel')
        .upload(fileName, foto);

      if (uploadError) throw uploadError;

      // 2. Ambil Public URL
      const { data: { publicUrl } } = supabase.storage.from('gambar_artikel').getPublicUrl(fileName);

      // 3. Simpan data ke tabel. Jika kategori Galeri, konten dikosongkan.
      const finalKonten = kategori === "Galeri" ? null : konten;
      const { error: insertError } = await supabase.from("artikel").insert([
        { judul, kategori, penulis, konten: finalKonten, gambar_url: publicUrl }
      ]);

      if (insertError) throw insertError;

      alert("Data berhasil diterbitkan!");
      setJudul(""); setKategori(""); setPenulis("Admin Desa"); setKonten(""); setFoto(null);
      (document.getElementById("inputFoto") as HTMLInputElement).value = "";
      fetchArtikel();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    const { error } = await supabase.from("artikel").delete().eq("id", id);
    if (!error) {
      alert("Data berhasil dihapus.");
      fetchArtikel();
    } else {
      alert("Gagal menghapus: " + error.message);
    }
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
            <h3 className="fw-bold mb-4">Kelola Artikel & Informasi</h3>
            
            <div className="row">
              <div className="col-lg-5 mb-4">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4 sticky-top" style={{ top: "20px" }}>
                  <h5 className="fw-bold mb-3">Tulis Baru</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Judul</label>
                      <input type="text" className="form-control" placeholder="Masukkan judul..." value={judul} onChange={(e) => setJudul(e.target.value)} required />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Kategori</label>
                        <select className="form-select" value={kategori} onChange={(e) => setKategori(e.target.value)} required>
                          <option value="" disabled>-- Pilih --</option>
                          <option value="Berita">Berita</option>
                          <option value="Pengumuman">Pengumuman</option>
                          <option value="Galeri">Galeri Kegiatan</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Penulis</label>
                        <input type="text" className="form-control" value={penulis} onChange={(e) => setPenulis(e.target.value)} required />
                      </div>
                    </div>

                    {/* LOGIKA PENYEMBUNYIAN KONTEN JIKA KATEGORI GALERI */}
                    {kategori !== "Galeri" && (
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Isi Artikel</label>
                        <textarea className="form-control" rows={6} placeholder="Tuliskan isi berita di sini..." value={konten} onChange={(e) => setKonten(e.target.value)} required></textarea>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Gambar / Thumbnail</label>
                      <input className="form-control" type="file" id="inputFoto" accept="image/png, image/jpeg, image/jpg" onChange={(e) => setFoto(e.target.files?.[0] || null)} required />
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-medium" disabled={submitting} style={{ backgroundColor: "#538863", border: "none" }}>
                      {submitting ? "Menerbitkan..." : <><i className="bi bi-send me-2"></i>Terbitkan</>}
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card shadow-sm border-0 rounded-3 p-3 p-md-4">
                  <h5 className="fw-bold mb-3">Daftar Terbit</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Thumbnail</th>
                          <th>Informasi</th>
                          <th>Kategori</th>
                          <th className="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={4} className="text-center text-muted">Memuat data...</td></tr>
                        ) : artikelList.length === 0 ? (
                          <tr><td colSpan={4} className="text-center text-muted">Belum ada data.</td></tr>
                        ) : (
                          artikelList.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <img src={item.gambar_url} alt="Thumbnail" className="rounded object-fit-cover border" style={{ width: "90px", height: "60px" }} />
                              </td>
                              <td>
                                <strong className="d-block text-dark">{item.judul}</strong>
                                <small className="d-block text-muted mb-1"><i className="bi bi-pencil-square"></i> {item.penulis}</small>
                                {item.konten && (
                                  <small className="text-muted d-block text-truncate" style={{ maxWidth: "250px" }}>
                                    {item.konten.substring(0, 50)}...
                                  </small>
                                )}
                              </td>
                              <td><span className="badge bg-secondary">{item.kategori}</span></td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                                  <i className="bi bi-trash"></i>
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
    </>
  );
}
