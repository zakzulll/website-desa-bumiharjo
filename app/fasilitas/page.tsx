import { supabase } from "../../lib/supabase";
import Link from "next/link";

export const revalidate = 0; // Memastikan data selalu segar

// Fungsi helper untuk menyusun kalimat dinamis tanpa merusak array asli
function susunKalimat(arr: string[]) {
  if (!arr || arr.length === 0) return 'Belum ada fasilitas yang didata.';
  if (arr.length === 1) return `Terdapat ${arr[0]}`;
  
  const copyArr = [...arr]; // Salin array agar terhindar dari pemutasan data
  const terakhir = copyArr.pop();
  return `Terdapat ${copyArr.join(', ')} dan ${terakhir}`;
}

export default async function FasilitasPage() {
  const { data: fasilitasDesa } = await supabase
    .from("fasilitas_desa")
    .select("*")
    .order("id", { ascending: true });

  const data = fasilitasDesa || [];

  // Mengelompokkan data berdasarkan kategori
  const rangkuman: Record<string, string[]> = {
    'Pemerintahan': [], 
    'Tempat Ibadah': [], 
    'Kesehatan': [], 
    'Pendidikan': [], 
    'Fasilitas Olahraga': []
  };

  data.forEach((item) => {
    if (rangkuman[item.kategori]) {
      rangkuman[item.kategori].push(`${item.jumlah} ${item.nama_fasilitas}`);
    }
  });

  return (
    <>
      {/* Bootstrap CSS & Icons */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />

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
                <a className="nav-link active" href="/fasilitas">Fasilitas</a>
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
          <h1 className="fw-bold text-success">Fasilitas dan Aset Desa</h1>
          <p>Daftar fasilitas umum dan aset yang tersedia di Desa Bumiharjo</p>
        </div>
      </section>

      {/* KARTU FASILITAS UMUM */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Fasilitas Umum</h2>
            <p className="text-muted">Fasilitas yang dapat dimanfaatkan oleh masyarakat</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4">
                <i className="bi bi-building fs-1 text-success"></i>
                <h5 className="mt-3 fw-bold">Pusat Pemerintahan</h5>
                <p className="text-muted">{susunKalimat(rangkuman['Pemerintahan'])} yang digunakan sebagai pusat kegiatan, rapat, dan musyawarah warga.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4">
                <i className="bi bi-bank fs-1 text-success"></i>
                <h5 className="mt-3 fw-bold">Tempat Ibadah</h5>
                <p className="text-muted">{susunKalimat(rangkuman['Tempat Ibadah'])} sebagai sarana ibadah dan kegiatan keagamaan masyarakat.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4">
                <i className="bi bi-heart-pulse fs-1 text-success"></i>
                <h5 className="mt-3 fw-bold">Kesehatan</h5>
                <p className="text-muted">{susunKalimat(rangkuman['Kesehatan'])} untuk pelayanan kesehatan ibu, balita, dan lansia.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4">
                <i className="bi bi-mortarboard fs-1 text-success"></i>
                <h5 className="mt-3 fw-bold">Pendidikan</h5>
                <p className="text-muted">{susunKalimat(rangkuman['Pendidikan'])} sebagai sarana kegiatan belajar dan mengajar.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4">
                <i className="bi bi-universal-access fs-1 text-success"></i>
                <h5 className="mt-3 fw-bold">Olahraga</h5>
                <p className="text-muted">{susunKalimat(rangkuman['Fasilitas Olahraga'])} sebagai sarana kegiatan berolahraga.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABEL DATA FASILITAS */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Data Fasilitas</h2>
            <p className="text-muted">Data fasilitas dapat diperbarui sesuai hasil pendataan</p>
          </div>
          <div className="table-responsive bg-white p-3 rounded shadow-sm border">
            <table className="table table-bordered table-striped mb-0">
              <thead className="table-success">
                <tr>
                  <th>No</th>
                  <th>Nama Fasilitas</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">Belum ada data fasilitas</td></tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.nama_fasilitas}</td>
                      <td>{item.kategori}</td>
                      <td>{item.jumlah}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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