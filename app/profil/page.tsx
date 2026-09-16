import { supabase } from "../../lib/supabase";

export default async function ProfilDesa() {
  // 1. Mengambil data dari Supabase
  const { data: profil } = await supabase
    .from("profil_desa")
    .select("*")
    .eq("id", 1)
    .single();

  if (!profil) {
    return <div className="text-center mt-5">Data profil belum tersedia.</div>;
  }

  // 2. Memisahkan teks Misi menjadi list (<li>) berdasarkan enter
  const listMisi = (profil.misi || "")
    .split("\n")
    .filter((item: string) => item.trim() !== "")
    .map((item: string, index: number) => (
      <li key={index}>{item.replace(/^[0-9]+\.\s*/, "")}</li>
    ));

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
      <section style={{ paddingTop: "140px", background: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container text-center">
          <h1 className="fw-bold text-success">Profil Desa Bumiharjo</h1>
          <p>Mengenal sejarah, pemerintahan, serta gambaran umum Desa Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten.</p>
        </div>
      </section>

      {/* SEJARAH */}
      <section>
        <div className="container">
          <div className="section-title"><h2>Sejarah Desa</h2></div>
          <div className="row align-items-center">
            <div className="col-lg-5">
              <img src="/assets/img/desa.png" className="img-fluid rounded shadow" alt="Balai Desa" />
            </div>
            <div className="col-lg-7 mt-4 mt-lg-0">
              <p style={{ whiteSpace: "pre-wrap", textAlign: "justify", lineHeight: "1.8" }}>
                {profil.sejarah}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="bg-light">
        <div className="container">
          <div className="section-title"><h2>Visi dan Misi</h2></div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card custom-card h-100">
                <div className="card-body">
                  <h4 className="text-success fw-bold">Visi</h4>
                  <p className="mt-3 1h-1g">{profil.visi}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card custom-card h-100">
                <div className="card-body">
                  <h4 className="text-success fw-bold">Misi</h4>
                  <ul className="mt-3 lh-lg">{listMisi}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DATA WILAYAH */}
      <section>
        <div className="container">
          <div className="section-title"><h2>Data Umum Desa</h2></div>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stat-box">
                <h3>{profil.jml_penduduk}</h3><p>Jumlah Penduduk</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box">
                <h3>{profil.jml_kk}</h3><p>Jumlah KK</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box">
                <h3>{profil.luas_wilayah}</h3><p>Luas Wilayah</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-box">
                <h3>{profil.jml_dukuh}</h3><p>Jumlah Dukuh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRUKTUR ORGANISASI */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="section-title text-center mb-4">
            <h2 className="fw-bold text-success">Struktur Organisasi</h2>
            <p className="text-muted">Bagan Struktur Organisasi dan Tata Kerja Pemerintah Desa Bumiharjo</p>
          </div>
          <div className="board-container">
            <div className="board-header text-center">
              <h5 className="fw-bold m-0 text-uppercase">Struktur Organisasi dan Tata Kerja Pemerintah Desa</h5>
              <div className="d-flex justify-content-between fw-bold mt-1 px-3 small">
                <span>DESA : BUMIHARJO</span>
                <span>KECAMATAN : KEMALANG</span>
              </div>
            </div>
            <div className="org-wrapper">
              <div className="org-card">
                <div className="org-card-title bg-green">Kepala Desa</div>
                <div className="org-card-name">{profil.kades}</div>
              </div>
              <div className="v-line" style={{ height: "25px" }}></div>
              <div className="middle-columns">
                <div className="col-kasie">
                  <div className="col-kasie-line-top"></div>
                  <div className="v-line" style={{ height: "100px" }}></div>
                  <div className="tree-row">
                    <div className="tree-col">
                      <div style={{ height: "15px" }}></div>
                      <div className="org-card"><div className="org-card-title bg-pink">Kasie. Pemerintahan</div><div className="org-card-name">{profil.kasie_pem}</div></div>
                    </div>
                    <div className="tree-col">
                      <div style={{ height: "15px" }}></div>
                      <div className="org-card"><div className="org-card-title bg-pink">Kasie. Kesejahteraan & Pelayanan</div><div className="org-card-name">{profil.kasie_kes}</div></div>
                    </div>
                  </div>
                </div>
                <div className="col-trunk"><div className="col-trunk-line-top"></div><div className="v-line" style={{ height: "100%", minHeight: "200px" }}></div></div>
                <div className="col-sekdes">
                  <div className="col-sekdes-line-top"></div>
                  <div className="v-line" style={{ height: "20px" }}></div>
                  <div className="org-card"><div className="org-card-title bg-pink">Sekretaris Desa</div><div className="org-card-name">{profil.sekdes}</div></div>
                  <div className="v-line" style={{ height: "25px" }}></div>
                  <div className="tree-row">
                    <div className="tree-col">
                      <div style={{ height: "15px" }}></div>
                      <div className="org-card"><div className="org-card-title bg-pink">Kaur. Perencanaan, TU & Umum</div><div className="org-card-name">{profil.kaur_per}</div></div>
                    </div>
                    <div className="tree-col">
                      <div style={{ height: "15px" }}></div>
                      <div className="org-card"><div className="org-card-title bg-pink">Kaur. Keuangan</div><div className="org-card-name">{profil.kaur_keu}</div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="v-line" style={{ height: "30px" }}></div>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="tree-row">
                  <div className="tree-col">
                    <div style={{ height: "15px" }}></div>
                    <div className="org-card"><div className="org-card-title bg-green">Kepala Dusun 1</div><div className="org-card-name">{profil.kadus_1}</div></div>
                  </div>
                  <div className="tree-col">
                    <div style={{ height: "15px" }}></div>
                    <div className="org-card"><div className="org-card-title bg-green">Kepala Dusun 2</div><div className="org-card-name">{profil.kadus_2}</div></div>
                  </div>
                </div>
              </div>
            </div>
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
    </>
  );
}