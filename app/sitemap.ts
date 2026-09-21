import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://website-desa-bumiharjo.vercel.app";
  
  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/profil`, lastModified: new Date() },
    { url: `${baseUrl}/peta`, lastModified: new Date() },
    { url: `${baseUrl}/fasilitas`, lastModified: new Date() },
    { url: `${baseUrl}/potensi`, lastModified: new Date() },
    { url: `${baseUrl}/kontak`, lastModified: new Date() },
  ];
}
