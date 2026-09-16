"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase"; // Sesuaikan path jika berbeda

export default function HomePage() {
  // State untuk menyimpan data dari tabel profil_desa
  const [dataDesa, setDataDesa] = useState({
    sejarah: "",
    jml_penduduk: 0,
    jml_kk: 0,
    luas_wilayah: "",
    jml_dukuh: 0,
    kades: "",
  });

  const [loading, setLoading] = useState(true);

  // Mengambil data saat halaman dimuat
  useEffect(() => {
    async function fetchProfilDesa() {
      const { data, error } = await supabase
        .from("profil_desa")
        .select("sejarah, jml_penduduk, jml_kk, luas_wilayah, jml_dukuh, kades")
        .eq("id", 1)
        .maybeSingle();

      if (data && !error) {
        setDataDesa({
          sejarah: data.sejarah || "Desa Bumiharjo memiliki berbagai potensi di bidang pertanian...",
          jml_penduduk: data.jml_penduduk || 0,
          jml_kk: data.jml_kk || 0,
          luas_wilayah: data.luas_wilayah || "0",
          jml_dukuh: data.jml_dukuh || 0,
          kades: data.kades || "Kepala Desa",
        });
      } else {
        console.error("Gagal memuat data profil:", error);
      }
      setLoading(false);
    }

    fetchProfilDesa();
  }, []);

  return (
    <>
      {/* NAVBAR LENGKAP */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow-sm">
        <div className="container">
          {/* Bagian Kiri: Logo & Judul */}
          <a className="navbar-brand d-flex align-items-center gap-2" href="/">
            <img 
              src="/assets/img/logo-klaten.png" 
              alt="Logo Kabupaten Klaten" 
              style={{ height: "42px", width: "auto", objectFit: "contain" }} 
              className="d-inline-block align-text-top" 
            />
            <div className="d-flex flex-column">
              <span className="fw-bold text-uppercase lh-1 fs-5">Desa Bumiharjo</span>
              <span className="text-white-50" style={{ fontSize: "0.68rem", letterSpacing: "0.5px" }}>
                KECAMATAN KEMALANG
              </span>
            </div>
          </a>

          {/* Tombol Hamburger (Untuk versi HP) */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarProdusi" aria-controls="navbarProdusi" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Bagian Kanan: Menu Navigasi */}
          <div className="collapse navbar-collapse d-lg-flex" id="navbarProdusi">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">Beranda</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profil">Profil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/peta">Peta</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/fasilitas">Fasilitas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/potensi">Potensi</a>
              </li>

              {/* Menu Dropdown Informasi */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="informasiDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Informasi
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow" aria-labelledby="informasiDropdown">
                  <li><a className="dropdown-item" href="/umkm">UMKM</a></li>
                  <li><a className="dropdown-item" href="/informasi">Artikel & Galeri</a></li>
                  <li><a className="dropdown-item" href="/apbdesa">APBDesa</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/kontak">Kontak</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="fw-bold">Website Profil Desa Bumiharjo</h1>
          <p className="lead mx-auto mt-3" style={{ maxWidth: "800px" }}>
            Selamat datang di Website Profil Desa Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah. Website ini menyediakan informasi mengenai profil desa, potensi, fasilitas, UMKM, peta wilayah, serta informasi lainnya yang dapat diakses oleh masyarakat.
          </p>
          <div className="hero-btn mt-4">
            <Link href="/profil" className="btn btn-success btn-lg me-2">Profil Desa</Link>
          </div>
        </div>
      </section>

      {/* TENTANG SINGKAT[cite: 8] */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Tentang Desa</h2>
            <p className="text-muted">Sekilas informasi mengenai Desa Bumiharjo</p>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img src="/assets/img/balai-desa.jpeg" className="img-fluid rounded shadow" alt="desa Bumiharjo" />
            </div>
            <div className="col-lg-6">
              <p style={{ textAlign: "justify" }}>
                {loading ? "Memuat informasi..." : dataDesa.sejarah.substring(0, 350) + "..."}
              </p>
              <Link href="/profil" className="btn btn-outline-success mt-3">Baca Selengkapnya</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK - Diambil dari tabel profil_desa */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <div className="mb-5">
            <h2 className="fw-bold">Data Singkat Desa</h2>
            <p className="text-muted">Data dapat diperbarui sesuai hasil pendataan</p>
          </div>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-4 bg-white shadow-sm rounded">
                <h3 className="fw-bold text-success">{loading ? "..." : dataDesa.jml_penduduk}</h3>
                <p className="mb-0">Jumlah Penduduk</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-white shadow-sm rounded">
                <h3 className="fw-bold text-success">{loading ? "..." : dataDesa.jml_kk}</h3>
                <p className="mb-0">Kepala Keluarga</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-white shadow-sm rounded">
                <h3 className="fw-bold text-success">{loading ? "..." : dataDesa.jml_dukuh}</h3>
                <p className="mb-0">Jumlah Dukuh</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-white shadow-sm rounded">
                <h3 className="fw-bold text-success">{loading ? "..." : dataDesa.luas_wilayah}</h3>
                <p className="mb-0">Luas Wilayah (Ha)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMBUTAN KEPALA DESA[cite: 8, 9] */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Sambutan Kepala Desa</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card border-0 shadow-sm p-4 rounded-4">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <img src="/assets/img/kades.jpeg" alt="Kepala Desa Bumiharjo" className="img-fluid rounded-circle shadow mb-3" style={{ width: "160px", height: "160px", objectFit: "cover", border: "4px solid #198754" }} />
                    <h5 className="fw-bold text-success mb-1">{loading ? "Memuat..." : dataDesa.kades}</h5>
                    <span className="badge bg-success">Kepala Desa Bumiharjo</span>
                  </div>
                  <div className="col-md-8 text-center text-md-start">
                    <p className="fst-italic text-secondary" style={{ textAlign: "justify" }}>
                      Assalamu'Alaikum Warahmatullahi Wabarakatuh.<br /><br />
                      Website ini hadir sebagai wujud transformasi Desa Bumiharjo menjadi desa yang mampu memanfaatkan teknologi informasi... 
                      (Lanjutan sambutan dapat diatur melalui dashboard admin).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER[cite: 8] */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-4 mb-3">
              <small className="d-block text-white-50 mb-1">Dikembangkan oleh Kolaborasi:</small>
              <small className="fw-semibold">UPN "Veteran" Yogyakarta & UGM</small>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Alamat</h5>
              <p className="small text-white-50">Glonggong, Bumiharjo, Kemalang<br />Kab. Klaten, Jawa Tengah 57484</p>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Kontak</h5>
              <p className="small text-white-50">+62 856-4304-3970 (Pak Tuwuh)</p>
            </div>
          </div>
          <hr className="border-secondary" />
          <div className="text-center small text-white-50">© 2026 Desa Bumiharjo</div>
        </div>
      </footer>
    </>
  );
}
