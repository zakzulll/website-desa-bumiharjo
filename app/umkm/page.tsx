"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Script from "next/script";
import Link from "next/link";
import "../globals.css"; // Sesuaikan path menuju CSS bawaan Anda

interface UMKM {
  id: number;
  nama_usaha: string;
  pemilik: string;
  kategori: string;
  kontak: string;
  deskripsi: string;
  foto_url: string;
}

export default function UMKMPage() {
  const [umkmData, setUmkmData] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUMKM() {
      const { data, error } = await supabase.from("umkm_desa").select("*").order("id", { ascending: true });
      if (!error && data) setUmkmData(data);
      setLoading(false);
    }
    fetchUMKM();
  }, []);

  // Perhitungan Statistik
  const totalUMKM = umkmData.length;
  const totalKuliner = umkmData.filter((u) => u.kategori === "Kuliner").length;
  const totalKerajinan = umkmData.filter((u) => u.kategori === "Kerajinan").length;
  const totalJasa = umkmData.filter((u) => u.kategori === "Jasa").length;

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
            <img src="/assets/img/logo-klaten.png" alt="Logo Kabupaten Klaten" height="42" className="d-inline-block align-text-top" />
            <div className="d-flex flex-column">
              <span className="fw-bold text-uppercase lh-1 fs-5">Desa Bumiharjo</span>
              <span className="text-white-50" style={{ fontSize: "0.68rem", letterSpacing: "0.5px" }}>KECAMATAN KEMALANG</span>
            </div>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarProdusi">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarProdusi">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" href="/">Beranda</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/profil">Profil</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/peta">Peta</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/fasilitas">Fasilitas</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/potensi">Potensi</Link></li>
              
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="#" id="informasiDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Informasi
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow" aria-labelledby="informasiDropdown">
                  <li><Link className="dropdown-item active bg-success" href="/umkm">UMKM</Link></li>
                  <li><Link className="dropdown-item" href="/informasi">Artikel & Galeri</Link></li>
                  <li><Link className="dropdown-item" href="/apbdesa">APBDesa</Link></li>
                </ul>
              </li>
              <li className="nav-item"><Link className="nav-link" href="/kontak">Kontak</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <section style={{ paddingTop: "150px", paddingBottom: "80px", background: "#f8f9fa" }}>
        <div className="container text-center">
          <h1 className="fw-bold text-success">UMKM Desa Bumiharjo</h1>
          <p>Katalog digital usaha mikro, kecil, dan menengah masyarakat Desa Bumiharjo</p>
        </div>
      </section>

      {/* STATISTIK UMKM */}
      <section className="fade-up">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2>Statistik UMKM</h2>
            <p>Data dapat diperbarui sesuai hasil pendataan</p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="stat-box p-4 border rounded bg-white shadow-sm">
                <h3 className="counter fw-bold text-success">{loading ? "..." : totalUMKM}</h3>
                <p className="mb-0">Total UMKM</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box p-4 border rounded bg-white shadow-sm">
                <h3 className="counter fw-bold text-success">{loading ? "..." : totalKuliner}</h3>
                <p className="mb-0">Kuliner</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box p-4 border rounded bg-white shadow-sm">
                <h3 className="counter fw-bold text-success">{loading ? "..." : totalKerajinan}</h3>
                <p className="mb-0">Kerajinan</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box p-4 border rounded bg-white shadow-sm">
                <h3 className="counter fw-bold text-success">{loading ? "..." : totalJasa}</h3>
                <p className="mb-0">Jasa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATALOG UMKM */}
      <section className="bg-light py-5 mt-5">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2>Katalog UMKM</h2>
            <p>Daftar UMKM yang ada di Desa Bumiharjo</p>
          </div>
          <div className="row g-4">
            {loading ? (
              <p className="text-center w-100">Memuat Katalog...</p>
            ) : umkmData.length === 0 ? (
              <p className="text-center w-100">Belum ada UMKM yang terdaftar.</p>
            ) : (
              umkmData.map((item) => (
                <div className="col-lg-4" key={item.id}>
                  <div className="card custom-card h-100 overflow-hidden shadow-sm position-relative">
                    <div className="card-img-container position-relative">
                      <img src={item.foto_url} alt={item.nama_usaha} className="w-100 object-fit-cover" style={{ height: "250px" }} />
                      <div className="card-img-overlay-custom position-absolute bottom-0 w-100 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "white" }}>
                        <h5 className="fw-bold mb-1">{item.nama_usaha}</h5>
                        <div>
                          <span className="badge bg-success px-2 py-1">{item.kategori}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{item.deskripsi}</p>
                    </div>
                    <div className="card-hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-2 opacity-0 hover-opacity-100 transition-all" style={{ background: "rgba(255,255,255,0.9)" }}>
                      <a href={`https://wa.me/${item.kontak}?text=Halo%20${item.nama_usaha},%20saya%20ingin%20tahu%20lebih%20lengkap%20mengenai%20produk%20Anda.`} target="_blank" className="btn btn-success fw-semibold">
                        Hubungi via WA
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* TABEL DATA UMKM */}
      <section className="fade-up py-5">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2>Data UMKM</h2>
            <p>Rekapitulasi pelaku usaha di Desa</p>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-success">
                <tr>
                  <th>No</th>
                  <th>Nama UMKM</th>
                  <th>Kategori</th>
                  <th>Pemilik</th>
                  <th>Kontak</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center">Memuat data...</td></tr>
                ) : umkmData.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">Tidak ada data UMKM.</td></tr>
                ) : (
                  umkmData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{item.nama_usaha}</td>
                      <td>{item.kategori}</td>
                      <td>{item.pemilik}</td>
                      <td>
                        <a href={`https://wa.me/${item.kontak}`} target="_blank" className="text-success text-decoration-none">
                          {item.kontak}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <small className="d-block text-white-50 mb-1">Dikembangkan oleh Kolaborasi:</small>
              <small className="fw-semibold d-block">• UPN "Veteran" Yogyakarta<br />• Universitas Gadjah Mada</small>
            </div>
            <div className="col-md-4">
              <h5>Alamat</h5>
              <p>Glonggong<br />Bumiharjo, Kecamatan Kemalang<br />Kabupaten Klaten, Jawa Tengah 57484</p>
            </div>
            <div className="col-md-4">
              <h5>Kontak</h5>
              <p>+62 856-4304-3970 (Pak Tuwuh)</p>
            </div>
          </div>
          <hr />
          <div className="text-center">© 2026</div>
        </div>
      </footer>

      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
    </>
  );
}