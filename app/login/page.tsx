"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Pastikan path ini sesuai dengan file konfigurasi Supabase-mu

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Proses autentikasi ke Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Email atau password salah!");
      setLoading(false);
    } else {
      // Jika berhasil login, arahkan ke halaman admin
      router.push("/admin/profil");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow border-0 p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <img src="/assets/img/logo-klaten.png" alt="Logo" height="50" className="mb-2" />
          <h4 className="fw-bold text-success">Login Admin</h4>
          <p className="text-muted small">Website Desa Bumiharjo</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 small text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-medium">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button 
            onClick={() => router.push("/")} 
            className="btn btn-link text-decoration-none text-muted small"
          >
            &larr; Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
