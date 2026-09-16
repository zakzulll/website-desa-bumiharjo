import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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