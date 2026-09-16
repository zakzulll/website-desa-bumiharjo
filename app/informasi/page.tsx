"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Script from "next/script";
import Link from "next/link";
import "../globals.css"; // Sesuaikan path menuju CSS bawaan

interface Artikel {
  id: number;
  judul: string;
  kategori: string;
  penulis: string;
  konten: string | null;
  gambar_url: string;
  created_at: string;
}

export default function InformasiPage() {
  const [dataList, setDataList] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("artikel").select("*").order("id", { ascending: false });
      if (!error && data) setDataList(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Memisahkan data berdasarkan kategori
  const artikelList = dataList.filter(item => item.kategori !== "Galeri");
  const galeriList = dataList.filter(item => item.kategori === "Galeri");

  // Format Tanggal Sederhana
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

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
                <a className="nav-link dropdown-toggle active" href="#" id="informasiDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Informasi
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow" aria-labelledby="informasiDropdown">
                  <li><a className="dropdown-item" href="/umkm">UMKM</a></li>
                  <li><a className="dropdown-item active bg-success" href="/informasi">Artikel & Galeri</a></li>
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
          <h1 className="fw-bold text-success">Informasi Desa</h1>
          <p>Pusat informasi dan kegiatan Desa Bumiharjo.</p>
        </div>
      </section>

      {/* ARTIKEL SECTION */}
      <section className="fade-up py-5">
        <div className="container">
          <div className="section-title mb-5">
            <h2>Pengumuman & Artikel Desa</h2>
            <p>Berbagai artikel dan informasi mengenai kegiatan, potensi, serta perkembangan Desa Bumiharjo.</p>
          </div>

          <div className="row g-4">
            {loading ? (
               <p className="text-center w-100">Memuat artikel...</p>
            ) : artikelList.length === 0 ? (
               <p className="text-center w-100">Belum ada artikel terbit.</p>
            ) : (
              artikelList.map((item) => (
                <div className="col-lg-4" key={item.id}>
                  <div className="card h-100 shadow-sm border-0 overflow-hidden d-flex flex-column" style={{ borderRadius: "0.75rem" }}>
                    <img src={item.gambar_url} className="card-img-top border-bottom" style={{ height: "192px", objectFit: "cover" }} alt={item.judul} />
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      <h5 className="card-title fw-bold mb-2" style={{ lineHeight: "1.2" }}>{item.judul}</h5>
                      <p className="small text-muted mb-3">
                        {formatDate(item.created_at)} &bull; <span className="fw-medium text-success">{item.penulis}</span>
                      </p>
                      <p className="card-text text-secondary small mb-4" style={{ lineHeight: "1.6" }}>
                        {item.konten ? item.konten.substring(0, 100) + "..." : ""}
                      </p>
                    </div>
                    <div className="px-4 pb-4 mt-auto">
                      <a href="#" className="text-success fw-semibold text-decoration-none d-flex align-items-center" style={{ fontSize: "0.875rem" }} data-bs-toggle="modal" data-bs-target={`#modalArtikel${item.id}`}>
                        Baca Selengkapnya
                        <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* MODALS DINAMIS UNTUK ARTIKEL */}
      {artikelList.map((item) => (
        <div className="modal fade" id={`modalArtikel${item.id}`} tabIndex={-1} aria-hidden="true" key={`modal-${item.id}`}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-5 pt-2">
                <h2 className="fw-bold mb-3">{item.judul}</h2>
                <img src={item.gambar_url} className="img-fluid rounded mb-4 w-100 border" style={{ maxHeight: "350px", objectFit: "cover" }} alt={item.judul} />
                <div className="d-flex align-items-center small text-muted mb-4 border-bottom pb-3">
                  <span className="fw-medium text-success">{item.penulis}</span>
                  <span className="mx-2">&bull;</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
                <div className="text-secondary" style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                  {item.konten}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* GALERI KEGIATAN SECTION */}
      <section className="bg-light fade-up pb-5 pt-5">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="fw-bold">Galeri Kegiatan</h2>
            <p className="text-muted">Dokumentasi kegiatan masyarakat dan Pemerintah Desa Bumiharjo.</p>
          </div>

          <div className="row g-4">
            {loading ? (
               <p className="text-center w-100">Memuat galeri...</p>
            ) : galeriList.length === 0 ? (
               <p className="text-center w-100">Belum ada dokumentasi galeri.</p>
            ) : (
              galeriList.map((item) => (
                <div className="col-md-4" key={item.id}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <img src={item.gambar_url} className="d-block w-100 object-fit-cover" style={{ height: "250px" }} alt={item.judul} />
                    <div className="card-body text-center bg-white">
                      <h5 className="card-title fw-bold text-success mb-0">{item.judul}</h5>
                    </div>
                  </div>
                </div>
              ))
            )}
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