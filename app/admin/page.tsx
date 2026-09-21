import { redirect } from "next/navigation";

export default function AdminPage() {
  // Otomatis mengarahkan rute /admin ke /admin/profil
  redirect("/admin/profil");
}
