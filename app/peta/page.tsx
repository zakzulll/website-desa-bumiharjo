import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Memastikan data selalu terbaru dari Supabase

export default async function PetaPage() {
  // 1. Ambil Data Peta Tematik beserta deteksi error
  const { data: daftarPeta, error: errorPeta } = await supabase
    .from("peta")
    .select("*")
    .order("id", { ascending: true });

  // 2. Ambil Data Batas Wilayah
  const { data: batas } = await supabase
    .from("batas_wilayah")
    .select("*")
    .eq("id", 1)
    .single();

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
                <a className="nav-link" href="/profil">Profil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/peta">Peta</a>
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
          <h1 className="fw-bold text-success">Peta dan Informasi Wilayah</h1>
          <p>Informasi spasial dan pemetaan Desa Bumiharjo</p>
        </div>
      </section>

      {/* GOOGLE MAPS EMBED */}
      <section className="py-5">
        <div className="container">
          <div className="section-title text-center mb-4">
            <h2 className="fw-bold text-success">Lokasi Desa</h2>
            <p>Lokasi Desa Bumiharjo pada Google Maps</p>
          </div>
          <div className="ratio ratio-16x9 shadow-sm rounded border">
            <iframe
              src="https://maps.google.com/maps?q=Desa%20Bumiharjo,%20Kemalang,%20Klaten,%20Jawa%20Tengah&t=&z=14&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* DAFTAR PETA TEMATIK DINAMIS DARI SUPABASE */}
      {(!daftarPeta || daftarPeta.length === 0) ? (
        <section className="py-5 bg-light">
          <div className="container text-center">
            <div className="card border-0 shadow-sm custom-card p-5">
              <h5 className="text-muted fw-semibold mb-2">Belum ada data peta tematik</h5>
              <p className="text-muted small mb-0">
                Silakan tambahkan data peta melalui halaman Admin atau periksa kebijakan RLS (Row Level Security) Supabase Anda.
              </p>
            </div>
          </div>
        </section>
      ) : (
        daftarPeta.map((item, index) => (
          <section key={item.id} className={index % 2 === 0 ? "bg-light py-5" : "py-5"}>
            <div className="container">
              <div className="section-title text-center mb-4">
                <h2 className="fw-bold text-success">{item.judul}</h2>
                <p className="mt-3 text-muted">{item.deskripsi}</p>
              </div>
              <div className="card custom-card">
                <div className="card-body text-center p-4">
                  <img
                    src={item.gambar_url}
                    className="img-fluid rounded my-3 shadow-sm"
                    alt={item.judul}
                    style={{ maxHeight: "500px", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </section>
        ))
      )}

      {/* BATAS WILAYAH */}
      <section className="py-5">
        <div className="container">
          <div className="section-title text-center mb-4">
            <h2 className="fw-bold text-success">Batas Wilayah</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stat-box text-center p-4 bg-white rounded shadow-sm border h-100">
                <h5 className="fw-bold text-success">Utara</h5>
                <p className="mb-0">{batas?.utara || "Data belum tersedia"}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box text-center p-4 bg-white rounded shadow-sm border h-100">
                <h5 className="fw-bold text-success">Selatan</h5>
                <p className="mb-0">{batas?.selatan || "Data belum tersedia"}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box text-center p-4 bg-white rounded shadow-sm border h-100">
                <h5 className="fw-bold text-success">Timur</h5>
                <p className="mb-0">{batas?.timur || "Data belum tersedia"}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box text-center p-4 bg-white rounded shadow-sm border h-100">
                <h5 className="fw-bold text-success">Barat</h5>
                <p className="mb-0">{batas?.barat || "Data belum tersedia"}</p>
              </div>
            </div>
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