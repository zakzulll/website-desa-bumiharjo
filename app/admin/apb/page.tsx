"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Script from "next/script";
import Link from "next/link";

interface Pendapatan {
  id: number;
  sumber: string;
  jumlah: number;
}

interface Belanja {
  id: number;
  bidang: string;
  uraian: string;
  jumlah: number;
}

export default function AdminAPBPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(true);

  // Data States
  const [pendapatanList, setPendapatanList] = useState<Pendapatan[]>([]);
  const [belanjaList, setBelanjaList] = useState<Belanja[]>([]);
  const [loadingPendapatan, setLoadingPendapatan] = useState(true);
  const [loadingBelanja, setLoadingBelanja] = useState(true);

  // Form Pendapatan States
  const [sumber, setSumber] = useState("");
  const [jumlahPendapatan, setJumlahPendapatan] = useState("");

  // Form Belanja States
  const [bidang, setBidang] = useState("1. Penyelenggaraan Pemerintahan");
  const [uraian, setUraian] = useState("");
  const [jumlahBelanja, setJumlahBelanja] = useState("");

  // Edit States
  const [editPendapatanItem, setEditPendapatanItem] = useState<Pendapatan | null>(null);
  const [editBelanjaItem, setEditBelanjaItem] = useState<Belanja | null>(null);

  useEffect(() => {
    fetchPendapatan();
    fetchBelanja();
  }, []);

  // --- FETCH DATA ---
  async function fetchPendapatan() {
    setLoadingPendapatan(true);
    const { data, error } = await supabase.from("pendapatan").select("*").order("id", { ascending: true });
    if (!error && data) setPendapatanList(data);
    setLoadingPendapatan(false);
  }

  async function fetchBelanja() {
    setLoadingBelanja(true);
    const { data, error } = await supabase.from("belanja").select("*").order("id", { ascending: true });
    if (!error && data) setBelanjaList(data);
    setLoadingBelanja(false);
  }

  // --- CRUD PENDAPATAN ---
  async function handleAddPendapatan(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("pendapatan").insert([{ sumber, jumlah: Number(jumlahPendapatan) }]);
    if (error) {
      alert("Gagal menambah data: " + error.message);
    } else {
      setSumber("");
      setJumlahPendapatan("");
      fetchPendapatan();
    }
  }

  async function handleUpdatePendapatan(e: React.FormEvent) {
    e.preventDefault();
    if (!editPendapatanItem) return;
    const { error } = await supabase
      .from("pendapatan")
      .update({ sumber: editPendapatanItem.sumber, jumlah: editPendapatanItem.jumlah })
      .eq("id", editPendapatanItem.id);

    if (error) {
      alert("Gagal memperbarui data: " + error.message);
    } else {
      setEditPendapatanItem(null);
      fetchPendapatan();
    }
  }

  async function handleDeletePendapatan(id: number) {
    if (confirm("Yakin ingin menghapus data pendapatan ini?")) {
      const { error } = await supabase.from("pendapatan").delete().eq("id", id);
      if (!error) fetchPendapatan();
      else alert("Gagal menghapus: " + error.message);
    }
  }

  // --- CRUD BELANJA ---
  async function handleAddBelanja(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("belanja").insert([{ bidang, uraian, jumlah: Number(jumlahBelanja) }]);
    if (error) {
      alert("Gagal menambah data: " + error.message);
    } else {
      setUraian("");
      setJumlahBelanja("");
      fetchBelanja();
    }
  }

  async function handleUpdateBelanja(e: React.FormEvent) {
    e.preventDefault();
    if (!editBelanjaItem) return;
    const { error } = await supabase
      .from("belanja")
      .update({ bidang: editBelanjaItem.bidang, uraian: editBelanjaItem.uraian, jumlah: editBelanjaItem.jumlah })
      .eq("id", editBelanjaItem.id);

    if (error) {
      alert("Gagal memperbarui data: " + error.message);
    } else {
      setEditBelanjaItem(null);
      fetchBelanja();
    }
  }

  async function handleDeleteBelanja(id: number) {
    if (confirm("Yakin ingin menghapus data belanja ini?")) {
      const { error } = await supabase.from("belanja").delete().eq("id", id);
      if (!error) fetchBelanja();
      else alert("Gagal menghapus: " + error.message);
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

        {/* SIDEBAR */}
        <nav id="sidebar" className={isSidebarOpen ? "show" : ""}>
          <div className="sidebar-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="/assets/img/logo-klaten.png" alt="Logo" width="40" height="50" className="me-2 me-sm-3" />
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
              <li className="nav-item"><Link href="/admin/peta" className="nav-link">Peta & Lokasi</Link></li>
              <li className="nav-item"><Link href="/admin/fasilitas" className="nav-link">Kelola Fasilitas</Link></li>
              <li className="nav-item"><Link href="/admin/potensi" className="nav-link">Kelola Potensi</Link></li>
              <li className="nav-item">
                <a onClick={(e) => { e.preventDefault(); setIsSubmenuOpen(!isSubmenuOpen); }} className={`nav-link d-flex justify-content-between align-items-center text-white ${isSubmenuOpen ? "submenu-open" : ""}`} style={{ cursor: "pointer" }}>
                  Pusat Informasi <i className="bi bi-chevron-right chevron-icon" style={{ fontSize: "0.8rem", color: "white" }}></i>
                </a>
                <ul className="sub-menu" style={{ maxHeight: isSubmenuOpen ? "200px" : "0", opacity: isSubmenuOpen ? 1 : 0 }}>
                  <li><Link href="/admin/umkm" className="nav-link">UMKM</Link></li>
                  <li><Link href="/admin/informasi" className="nav-link">Artikel & Galeri</Link></li>
                  <li><Link href="/admin/apb" className="nav-link active">APB Desa</Link></li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="mt-auto p-3 mb-2">
            <Link href="/login" className="nav-link text-white fw-bold"><i className="bi bi-box-arrow-right me-2"></i>Keluar</Link>
          </div>
        </nav>

        {/* CONTENT */}
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">Kelola APB Desa</h3>
              <span className="badge bg-primary">Admin Mode</span>
            </div>

            <div className="row">
              {/* PENDAPATAN */}
              <div className="col-12 mb-4">
                <div className="card shadow-sm border-0 border-top border-success border-4 rounded-3 p-3 p-md-4">
                  <h5 className="fw-bold mb-4"><i className="bi bi-box-arrow-in-down text-success me-2"></i>Kelola Sumber Pendapatan</h5>

                  <form onSubmit={handleAddPendapatan} className="row g-3 mb-4">
                    <div className="col-md-5">
                      <label className="form-label fw-semibold">Sumber Pendapatan</label>
                      <input type="text" className="form-control" placeholder="Contoh: Dana Desa (DD)" value={sumber} onChange={(e) => setSumber(e.target.value)} required />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label fw-semibold">Jumlah (Rp)</label>
                      <input type="number" className="form-control" placeholder="Contoh: 312412000" value={jumlahPendapatan} onChange={(e) => setJumlahPendapatan(e.target.value)} required />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button type="submit" className="btn btn-success w-100 fw-medium"><i className="bi bi-plus-lg me-1"></i> Tambah</button>
                    </div>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-success">
                        <tr>
                          <th>Sumber Pendapatan</th>
                          <th>Jumlah (Rp)</th>
                          <th className="text-center" style={{ width: "120px" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingPendapatan ? (
                          <tr><td colSpan={3} className="text-center text-muted">Memuat data...</td></tr>
                        ) : pendapatanList.length === 0 ? (
                          <tr><td colSpan={3} className="text-center text-muted">Belum ada data pendapatan.</td></tr>
                        ) : (
                          pendapatanList.map((item) => (
                            <tr key={item.id}>
                              <td>{item.sumber}</td>
                              <td className="fw-bold">Rp {item.jumlah.toLocaleString("id-ID")}</td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-warning me-1" onClick={() => setEditPendapatanItem(item)}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePendapatan(item.id)}><i className="bi bi-trash"></i></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* BELANJA */}
              <div className="col-12">
                <div className="card shadow-sm border-0 border-top border-danger border-4 rounded-3 p-3 p-md-4">
                  <h5 className="fw-bold mb-4"><i className="bi bi-box-arrow-up text-danger me-2"></i>Kelola Rincian Belanja</h5>

                  <form onSubmit={handleAddBelanja} className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Bidang Kegiatan</label>
                      <select className="form-select" value={bidang} onChange={(e) => setBidang(e.target.value)} required>
                        <option value="1. Penyelenggaraan Pemerintahan">1. Penyelenggaraan Pemerintahan</option>
                        <option value="2. Pelaksanaan Pembangunan">2. Pelaksanaan Pembangunan</option>
                        <option value="3. Pembinaan Kemasyarakatan">3. Pembinaan Kemasyarakatan</option>
                        <option value="4. Pemberdayaan Masyarakat">4. Pemberdayaan Masyarakat</option>
                        <option value="5. Penanggulangan Bencana, Darurat, dan Mendesak Desa">5. Penanggulangan Bencana, Darurat, dan Mendesak Desa</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Uraian / Rincian</label>
                      <input type="text" className="form-control" placeholder="Contoh: Jalan Aspal Dkh. Ngrancah" value={uraian} onChange={(e) => setUraian(e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Anggaran (Rp)</label>
                      <input type="number" className="form-control" placeholder="Contoh: 100000000" value={jumlahBelanja} onChange={(e) => setJumlahBelanja(e.target.value)} required />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button type="submit" className="btn btn-danger w-100 fw-medium"><i className="bi bi-plus-lg me-1"></i> Tambah</button>
                    </div>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-danger">
                        <tr>
                          <th>Bidang</th>
                          <th>Uraian Kegiatan</th>
                          <th>Anggaran (Rp)</th>
                          <th className="text-center" style={{ width: "120px" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingBelanja ? (
                          <tr><td colSpan={4} className="text-center text-muted">Memuat data...</td></tr>
                        ) : belanjaList.length === 0 ? (
                          <tr><td colSpan={4} className="text-center text-muted">Belum ada rincian belanja.</td></tr>
                        ) : (
                          belanjaList.map((item) => (
                            <tr key={item.id}>
                              <td><span className="badge bg-secondary">{item.bidang}</span></td>
                              <td>{item.uraian}</td>
                              <td className="fw-bold">Rp {item.jumlah.toLocaleString("id-ID")}</td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-warning me-1" onClick={() => setEditBelanjaItem(item)}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBelanja(item.id)}><i className="bi bi-trash"></i></button>
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

      {/* MODAL EDIT PENDAPATAN */}
      {editPendapatanItem && (
        <div className="modal show d-block tabIndex={-1}" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdatePendapatan}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Edit Pendapatan</h5>
                  <button type="button" className="btn-close" onClick={() => setEditPendapatanItem(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Sumber Pendapatan</label>
                    <input type="text" className="form-control" value={editPendapatanItem.sumber} onChange={(e) => setEditPendapatanItem({ ...editPendapatanItem, sumber: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Jumlah (Rp)</label>
                    <input type="number" className="form-control" value={editPendapatanItem.jumlah} onChange={(e) => setEditPendapatanItem({ ...editPendapatanItem, jumlah: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditPendapatanItem(null)}>Batal</button>
                  <button type="submit" className="btn btn-success">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT BELANJA */}
      {editBelanjaItem && (
        <div className="modal show d-block tabIndex={-1}" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdateBelanja}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Edit Belanja</h5>
                  <button type="button" className="btn-close" onClick={() => setEditBelanjaItem(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Bidang Kegiatan</label>
                    <select className="form-select" value={editBelanjaItem.bidang} onChange={(e) => setEditBelanjaItem({ ...editBelanjaItem, bidang: e.target.value })} required>
                      <option value="1. Penyelenggaraan Pemerintahan Desa">1. Penyelenggaraan Pemerintahan</option>
                      <option value="2. Pelaksanaan Pembangunan Desa">2. Pelaksanaan Pembangunan</option>
                      <option value="3. Pembinaan Kemasyarakatan">3. Pembinaan Kemasyarakatan</option>
                      <option value="4. Pemberdayaan Masyarakat">4. Pemberdayaan Masyarakat</option>
                      <option value="5. Penanggulangan Bencana, Darurat, dan Mendesak Desa">5. Penanggulangan Bencana, Darurat, dan Mendesak Desa</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Uraian / Rincian</label>
                    <input type="text" className="form-control" value={editBelanjaItem.uraian} onChange={(e) => setEditBelanjaItem({ ...editBelanjaItem, uraian: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Anggaran (Rp)</label>
                    <input type="number" className="form-control" value={editBelanjaItem.jumlah} onChange={(e) => setEditBelanjaItem({ ...editBelanjaItem, jumlah: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditBelanjaItem(null)}>Batal</button>
                  <button type="submit" className="btn btn-danger">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
