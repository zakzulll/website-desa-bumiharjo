'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Definisi Tipe Data
type Potensi = { id: number; nama_potensi: string; kategori: string; };
type Produk = { id: number; nama_produk: string; deskripsi: string; gambar_url: string | null; };

export default function PotensiPage() {
  // State Data
  const [potensi, setPotensi] = useState<Potensi[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);

  // State UI Navbar & Dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

  // State UI Accordion (Menyimpan kategori yang terakhir diklik)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      // Menarik data potensi
      const { data: potData } = await supabase.from('potensi_desa').select('*');
      if (potData) {
        setPotensi(potData);
        // Set accordion pertama kali terbuka berdasarkan kategori pertama yang ada
        if (potData.length > 0) {
          setActiveAccordion(potData[0].kategori);
        }
      }

      // Menarik data produk unggulan
      const { data: prodData } = await supabase.from('produk_unggulan').select('*').order('id', { ascending: false });
      if (prodData) setProduk(prodData);
    }
    loadData();
  }, []);

  // Mengambil daftar kategori unik secara dinamis (mendukung Kategori Baru dari Admin)
  const categories = Array.from(new Set(potensi.map(p => p.kategori)));

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      {/* NAVBAR LENGKAP DENGAN REACT STATE */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow-sm">
        <div className="container">
          {/* Bagian Kiri: Logo & Judul */}
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
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
          </Link>

          {/* Tombol Hamburger (Untuk versi HP) */}
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Bagian Kanan: Menu Navigasi */}
          <div className={`collapse navbar-collapse d-lg-flex ${isMobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" href="/">Beranda</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/profil">Profil</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/peta">Peta</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/fasilitas">Fasilitas</Link></li>
              <li className="nav-item"><Link className="nav-link active" href="/potensi">Potensi</Link></li>

              {/* Menu Dropdown Informasi (Disesuaikan dengan State Klik)[cite: 13] */}
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#!" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsInfoDropdownOpen(!isInfoDropdownOpen);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Informasi
                </a>
                <ul className={`dropdown-menu dropdown-menu-end border-0 shadow ${isInfoDropdownOpen ? 'show' : ''}`}>
                  <li><Link className="dropdown-item" href="/umkm">UMKM</Link></li>
                  <li><Link className="dropdown-item" href="/informasi">Artikel & Galeri</Link></li>
                  <li><Link className="dropdown-item" href="/apbdesa">APBDesa</Link></li>
                </ul>
              </li>

              <li className="nav-item"><Link className="nav-link" href="/kontak">Kontak</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HEADER KONTEN[cite: 13] */}
      <section style={{ paddingTop: '150px', paddingBottom: '80px', background: '#f8f9fa' }}>
        <div className="container text-center">
          <h1 className="fw-bold text-success">Potensi Desa</h1>
          <p>Berbagai potensi yang dimiliki Desa Bumiharjo</p>
        </div>
      </section>

      {/* DETAIL POTENSI (AKORDEON DINAMIS & INDIKATOR KLIK) */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2>Detail Potensi</h2>
            <p>Informasi lebih rinci mengenai potensi Desa</p>
          </div>

          <div className="accordion shadow-sm" id="accordionPotensi">
            {categories.length > 0 ? categories.map((kategori) => {
              const isOpen = activeAccordion === kategori;
              const items = potensi.filter((p) => p.kategori === kategori);

              return (
                <div className="accordion-item" key={kategori}>
                  <h2 className="accordion-header">
                    {/* Class 'collapsed' mengatur indikator Drop Down / Drop Up secara otomatis di Bootstrap */}
                    <button 
                      className={`accordion-button fw-semibold ${!isOpen ? 'collapsed' : ''}`} 
                      type="button" 
                      onClick={() => setActiveAccordion(isOpen ? null : kategori)}
                    >
                      Potensi {kategori}
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <div className="accordion-body bg-white">
                      <ul className="mb-0 text-dark">
                        {items.map((item) => (
                          <li key={item.id} className="mb-1">{item.nama_potensi}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center p-4 bg-white border rounded">
                <p className="mb-0 text-muted">Belum ada data potensi tersimpan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRODUK UNGGULAN[cite: 13] */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2>Produk Unggulan</h2>
            <p>Produk yang menjadi ciri khas Desa</p>
          </div>
          <div className="row g-4">
            {produk.length > 0 ? produk.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="card h-100 shadow-sm border-0">
                  {item.gambar_url ? (
                    <img src={item.gambar_url} className="card-img-top" alt={item.nama_produk} style={{height: '200px', objectFit: 'cover'}}/>
                  ) : (
                    <div className="card-img-top bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                      <i className="bi bi-box fs-1 text-muted"></i>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="fw-bold">{item.nama_produk}</h5>
                    <p className="text-muted">{item.deskripsi}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center w-100">
                <p className="text-muted">Belum ada produk unggulan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-success text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <small className="d-block text-white-50 mb-1">Dikembangkan oleh Kolaborasi:</small>
              <small className="fw-semibold d-block">• UPN "Veteran" Yogyakarta<br />• Universitas Gadjah Mada</small>
            </div>
            <div className="col-md-4">
              <h5>Alamat</h5>
              <p>Glonggong, Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah 57484</p>
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
    </>
  );
}