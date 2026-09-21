import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Resmi Desa Bumiharjo - Kecamatan Kemalang, Kabupaten Klaten",
  description: "Informasi resmi profil desa, peta wilayah, fasilitas, potensi, UMKM, dan layanan masyarakat Desa Bumiharjo, Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah.",
  verification: {
    google: "F_5Sx0CD0LT9bbASfBwsSBVHe0aCJPJMUwAmdjG6DBM",
  keywords: [
    "Desa Bumiharjo", 
    "Bumiharjo Kemalang", 
    "Bumiharjo Klaten", 
    "Profil Desa Bumiharjo",
    "Kantor Desa Bumiharjo"
  ],
  openGraph: {
    title: "Website Resmi Desa Bumiharjo",
    description: "Portal informasi resmi masyarakat Desa Bumiharjo, Kemalang, Klaten.",
    url: "https://website-desa-bumiharjo.vercel.app",
    siteName: "Desa Bumiharjo",
    locale: "id_ID",
    type: "website",
  },
};

// 1. Konfigurasi Font Poppins bawaan Next.js
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Website Desa Bumiharjo",
  description: "Profil dan Potensi Desa Bumiharjo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Link Bootstrap tetap di sini */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
      </head>
      {/* 2. Terapkan class font poppins langsung ke body */}
      <body className={poppins.className}>
        {children}
        
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
