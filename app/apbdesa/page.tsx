"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Script from "next/script";
import Link from "next/link";
import "../globals.css";

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

export default function APBDesaPublicPage() {
  const [pendapatanList, setPendapatanList] = useState<Pendapatan[]>([]);
  const [belanjaList, setBelanjaList] = useState<Belanja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [resPendapatan, resBelanja] = await Promise.all([
        supabase.from("pendapatan").select("*").order("id", { ascending: true }),
        supabase.from("belanja").select("*").order("id", { ascending: true })
      ]);

      if (!resPendapatan.error && resPendapatan.data) setPendapatanList(resPendapatan.data);
      if (!resBelanja.error && resBelanja.data) setBelanjaList(resBelanja.data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Perhitungan Ringkasan
  const totalPendapatan = pendapatanList.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalBelanja = belanjaList.reduce((acc, curr) => acc + curr.jumlah, 0);
  const surplus = totalPendapatan - totalBelanja;

  // Pengelompokan Belanja
  const bidang1 = belanjaList.filter(b => b.bidang === "1. Penyelenggaraan Pemerintahan Desa");
  const bidang2 = belanjaList.filter(b => b.bidang === "2. Pelaksanaan Pembangunan Desa");
  const bidang3 = belanjaList.filter(b => b.bidang === "3. Pembinaan Kemasyarakatan");
  const bidang4 = belanjaList.filter(b => b.bidang === "4. Pemberdayaan Masyarakat");
  const bidang5 = belanjaList.filter(b => b.bidang === "5. Penanggulangan Bencana, Darurat, dan Mendesak Desa");

  const subtotal1 = bidang1.reduce((acc, curr) => acc + curr.jumlah, 0);
  const subtotal2 = bidang2.reduce((acc, curr) => acc + curr.jumlah, 0);
  const subtotal3 = bidang3.reduce((acc, curr) => acc + curr.jumlah, 0);
  const subtotal4 = bidang4.reduce((acc, curr) => acc + curr.jumlah, 0);
  const subtotal5 = bidang5.reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      {/* NAVBAR */}
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
                  <li><Link className="dropdown-item" href="/umkm">UMKM</Link></li>
                  <li><Link className="dropdown-item" href="/informasi">Artikel & Galeri</Link></li>
                  <li><Link className="dropdown-item active bg-success" href="/apbdesa">APBDesa</Link></li>
                </ul>
              </li>

              <li className="nav-item"><Link className="nav-link" href="/kontak">Kontak</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="page-header bg-success py-5 mt-5 shadow-sm">
        <div className="container pt-4 text-center fade-up text-white">
          <h1 className="fw-bold mb-3">Transparansi APBDesa 2026</h1>
        </div>
      </section>

      {/* RINGKASAN ANGGARAN */}
      <section className="py-5">
        <div className="container fade-up">
          <div className="row g-4 text-center justify-content-center">
            <div className="col-md-4">
              <div className="card apbdesa-card border-success shadow-sm h-100">
                <div className="card-body py-4">
                  <div className="icon-box bg-success text-white mb-3 mx-auto">
                    <i className="bi bi-wallet2 fs-2"></i>
                  </div>
                  <h6 className="text-muted text-uppercase fw-bold">Total Pendapatan</h6>
                  <h3 className="fw-bold text-success">Rp {totalPendapatan.toLocaleString("id-ID")}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card apbdesa-card border-danger shadow-sm h-100">
                <div className="card-body py-4">
                  <div className="icon-box bg-danger text-white mb-3 mx-auto">
                    <i className="bi bi-cart-dash fs-2"></i>
                  </div>
                  <h6 className="text-muted text-uppercase fw-bold">Total Belanja</h6>
                  <h3 className="fw-bold text-danger">Rp {totalBelanja.toLocaleString("id-ID")}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card apbdesa-card border-success shadow-sm h-100">
                <div className="card-body py-4">
                  <div className="icon-box bg-success text-white mb-3 mx-auto opacity-75">
                    <i className="bi bi-piggy-bank fs-2"></i>
                  </div>
                  <h6 className="text-muted text-uppercase fw-bold">Surplus / Pembiayaan</h6>
                  <h3 className="fw-bold text-success">Rp {surplus.toLocaleString("id-ID")}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RINCIAN PENDAPATAN */}
      <section className="py-5 bg-light">
        <div className="container fade-up">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-success"><i className="bi bi-box-arrow-in-down me-2"></i>Sumber Pendapatan Desa</h3>
            <div className="divider bg-success mx-auto" style={{ width: "80px", height: "3px", borderRadius: "2px" }}></div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="table-responsive bg-white p-4 rounded shadow-sm border-top border-success border-4">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-success">
                    <tr>
                      <th scope="col" className="text-center" style={{ width: "10%" }}>No</th>
                      <th scope="col" style={{ width: "60%" }}>Rincian Sumber Pendapatan</th>
                      <th scope="col" className="text-end" style={{ width: "30%" }}>Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={3} className="text-center text-muted">Memuat data pendapatan...</td></tr>
                    ) : pendapatanList.length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-muted">Belum ada data.</td></tr>
                    ) : (
                      pendapatanList.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center">{index + 1}</td>
                          <td>{item.sumber}</td>
                          <td className="text-end fw-bold">{item.jumlah.toLocaleString("id-ID")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="table-light fw-bold">
                    <tr>
                      <td colSpan={2} className="text-end text-uppercase">Total Pendapatan</td>
                      <td className="text-end text-success fs-5">{totalPendapatan.toLocaleString("id-ID")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RINCIAN BELANJA */}
      <section className="py-5">
        <div className="container fade-up">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-success"><i className="bi bi-box-arrow-up me-2"></i>Rincian Belanja Desa</h3>
            <div className="divider bg-success mx-auto" style={{ width: "80px", height: "3px", borderRadius: "2px" }}></div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="table-responsive bg-white p-4 rounded shadow-sm border-top border-success border-4">
                <table className="table table-hover align-middle mb-0 border">
                  <thead className="table-success">
                    <tr>
                      <th scope="col" style={{ width: "70%" }}>Bidang / Uraian Kegiatan</th>
                      <th scope="col" className="text-end" style={{ width: "30%" }}>Anggaran (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Bidang 1 */}
                    <tr className="table-light border-bottom border-success">
                      <td colSpan={2} className="fw-bold text-success"><i className="bi bi-building me-2"></i>1. Penyelenggaraan Pemerintahan Desa</td>
                    </tr>
                    {bidang1.map((item, index) => (
                      <tr key={item.id}>
                        <td className="ps-4">{index + 1}. {item.uraian}</td>
                        <td className="text-end">{item.jumlah.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                    <tr className="text-muted fw-bold">
                      <td className="text-end fst-italic">Sub-total Bidang 1</td>
                      <td className="text-end">{subtotal1.toLocaleString("id-ID")}</td>
                    </tr>

                    {/* Bidang 2 */}
                    <tr className="table-light border-bottom border-success border-top">
                      <td colSpan={2} className="fw-bold text-success"><i className="bi bi-cone-striped me-2"></i>2. Pelaksanaan Pembangunan Desa</td>
                    </tr>
                    {bidang2.map((item, index) => (
                      <tr key={item.id}>
                        <td className="ps-4">{index + 1}. {item.uraian}</td>
                        <td className="text-end">{item.jumlah.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                    <tr className="text-muted fw-bold">
                      <td className="text-end fst-italic">Sub-total Bidang 2</td>
                      <td className="text-end">{subtotal2.toLocaleString("id-ID")}</td>
                    </tr>

                    {/* Bidang 3*/}
                    <tr className="table-light border-bottom border-success border-top">
                      <td colSpan={2} className="fw-bold text-success"><i className="bi bi-people me-2"></i>3. Pembinaan Kemasyarakatan</td>
                    </tr>
                    {bidang3.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">- {item.uraian}</td>
                        <td className="text-end">{item.jumlah.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                    <tr className="text-muted fw-bold">
                      <td className="text-end fst-italic">Sub-total Bidang 3</td>
                      <td className="text-end">{subtotal3.toLocaleString("id-ID")}</td>
                    </tr>

                    {/* Bidang 4*/}
                    <tr className="table-light border-bottom border-success border-top">
                      <td colSpan={2} className="fw-bold text-success"><i className="bi bi-people me-2"></i>4. Pemberdayaan Masyarakat</td>
                    </tr>
                    {bidang4.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">- {item.uraian}</td>
                        <td className="text-end">{item.jumlah.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                    <tr className="text-muted fw-bold">
                      <td className="text-end fst-italic">Sub-total Bidang 4</td>
                      <td className="text-end">{subtotal4.toLocaleString("id-ID")}</td>
                    </tr>

                    {/* Bidang 3, 4, 5 */}
                    <tr className="table-light border-bottom border-success border-top">
                      <td colSpan={2} className="fw-bold text-success"><i className="bi bi-people me-2"></i>5. Penanggulangan Bencana, Darurat, dan Mendesak Desa</td>
                    </tr>
                    {bidang5.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">- {item.uraian}</td>
                        <td className="text-end">{item.jumlah.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                    <tr className="text-muted fw-bold">
                      <td className="text-end fst-italic">Sub-total Bidang 5</td>
                      <td className="text-end">{subtotal5.toLocaleString("id-ID")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container py-4">
          <div className="row">
            <div className="col-md-4">
              <div className="mt-3">
                <small className="d-block text-white-50 mb-1">Dikembangkan oleh Kolaborasi:</small>
                <small className="fw-semibold d-block">
                  • UPN "Veteran" Yogyakarta<br />
                  • Universitas Gadjah Mada
                </small>
              </div>
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