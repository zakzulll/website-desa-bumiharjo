"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function KontakPage() {
  // State untuk mengontrol visibilitas tombol "Kembali ke Atas"
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
                <a className="nav-link" href="/">Beranda</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/profil">Profil</a>
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

      {/* HEADER */}
      <section style={{ paddingTop: "150px", paddingBottom: "80px", background: "#f8f9fa" }}>
        <div className="container text-center">
          <h1 className="fw-bold text-success">Kontak</h1>
          <p>Hubungi perangkat Desa untuk memperoleh informasi lebih lanjut</p>
        </div>
      </section>

      {/* INFORMASI */}
      <section className="fade-up py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-10 mx-auto">
              <div className="card custom-card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <h3 className="mb-4 text-success">Informasi Kontak</h3>
                  <p>
                    <i className="bi bi-geo-alt-fill text-success me-2"></i>
                    Desa Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah
                  </p>
                  <p>
                    <i className="bi bi-telephone-fill text-success me-2"></i>
                    +62 856-4304-3970 (Pak Tuwuh)
                  </p>
                  <p>
                    <i className="bi bi-envelope-fill text-success me-2"></i>
                    desabumiharjokml@gmail.com
                  </p>
                  <p>
                    <i className="bi bi-clock-fill text-success me-2"></i>
                    Senin - Kamis 09.00 - 13.00 WIB <br />
                    <i className="bi bi-clock-fill text-success me-2" style={{ visibility: "hidden" }}></i>
                    Jumat 09.00 - 11.00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-4 mb-3">
              <div className="mt-3">
                <small className="d-block text-white-50 mb-1">Dikembangkan oleh Kolaborasi:</small>
                <small className="fw-semibold d-block">
                  • UPN "Veteran" Yogyakarta<br />
                  • Universitas Gadjah Mada
                </small>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Alamat</h5>
              <p className="small text-white-50">
                Glonggong<br />
                Bumiharjo, Kecamatan Kemalang<br />
                Kabupaten Klaten, Jawa Tengah 57484
              </p>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Kontak</h5>
              <p className="small text-white-50">+62 856-4304-3970 (Pak Tuwuh)</p>
            </div>
          </div>

          <hr className="border-secondary" />

          <div className="text-center small text-white-50">© 2026</div>
        </div>
      </footer>

      {/* TOMBOL KEMBALI KE ATAS */}
      {showTopBtn && (
        <button 
          onClick={scrollToTop} 
          className="btn btn-success rounded-circle shadow"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </>
  );
}
