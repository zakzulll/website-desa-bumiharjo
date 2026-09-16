"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Sesuaikan path dengan lokasi file supabase kamu

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const cekSesiAdmin = async () => {
      // Mengambil sesi user yang sedang aktif dari Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Jika tidak ada sesi (belum login), lempar ke halaman login
        router.replace("/login");
      } else {
        // Jika sudah login, izinkan akses
        setIsAuthorized(true);
      }
    };

    cekSesiAdmin();
  }, [router]);

  // Tampilkan layar putih/loading sementara sistem mengecek status login
  // Ini mencegah "kedipan" halaman admin terlihat oleh user biasa
  if (!isAuthorized) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  // Jika aman, tampilkan halaman admin beserta sidebar-nya
  return <>{children}</>;
}
